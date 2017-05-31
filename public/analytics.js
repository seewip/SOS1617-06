/*global angular*/
/* global Highcharts */
angular.module("DataManagementApp").
controller("AnalyticsCtrl", ["$scope", "$http", "$rootScope", function($scope, $http, $rootScope) {

            console.log("Controller initialized (AnalyticsCtrl)");

            $scope.loading = true;

            if (!$rootScope.apikey) $rootScope.apikey = "secret";

            $scope.refresh = function() {
                $http
                    .get("../api/v1/education" + "?" + "apikey=" + $rootScope.apikey)
                    .then(function(response) {

                        var years = [];
                        var countries = [];
                        var countriesForeign = [];
                        var countriesForeign2 = [];
                        var countriesData = [];
                        var countriesDataForeign = [];
                        var countriesDataForeign2 = [];

                        $http
                            .get("../api/v1/gdp" + "?" + "apikey=" + $rootScope.apikey)
                            .then(function(response_foreign) {

                                $http
                                    .get("../api/v1/gdp-per-capita" + "?" + "apikey=" + $rootScope.apikey)
                                    .then(function(response_foreign2) {

                                        response.data.forEach(function(d) {
                                            if (years.indexOf(Number(d.year)) == -1) years.push(Number(d.year));
                                            if (countries.indexOf(d.country) == -1) countries.push(d.country);
                                        });

                                        response_foreign.data.forEach(function(d) {
                                            if (years.indexOf(Number(d.year)) == -1) years.push(Number(d.year));
                                            if (countriesForeign.indexOf(d.country) == -1) countriesForeign.push(d.country);
                                        });

                                        response_foreign2.data.forEach(function(d) {
                                            if (years.indexOf(Number(d.year)) == -1) years.push(Number(d.year));
                                            if (countriesForeign2.indexOf(d.country) == -1) countriesForeign2.push(d.country);
                                        });

                                        years.sort((a, b) => a - b);

                                        countries.forEach(function(d) {
                                            var b = {
                                                name: d,
                                                type: "area",
                                                yAxis: 0,
                                                data: []
                                            };
                                            years.forEach(function(e) {
                                                b.data.push(0);
                                            });
                                            countriesData.push(b);
                                        });

                                        countriesForeign.forEach(function(d) {
                                            var c = {
                                                name: d,
                                                type: "column",
                                                yAxis: 1,
                                                data: []
                                            };
                                            years.forEach(function(e) {
                                                c.data.push(0);
                                            });
                                            countriesDataForeign.push(c);
                                        });

                                        countriesForeign2.forEach(function(d) {
                                            var c = {
                                                name: d,
                                                type: "spline",
                                                yAxis: 2,
                                                data: []
                                            };
                                            years.forEach(function(e) {
                                                c.data.push(0);
                                            });
                                            countriesDataForeign2.push(c);
                                        });

                                        response.data.forEach(function(d) {
                                            countriesData.forEach(function(e) {
                                                if (d.country === e.name) {
                                                    e.data[years.indexOf(Number(d.year))] = Number(d['education-gdp-perc']);
                                                }
                                            });
                                        });

                                        response_foreign.data.forEach(function(d) {
                                            countriesDataForeign.forEach(function(e) {
                                                if (d.country === e.name) {
                                                    e.data[years.indexOf(Number(d.year))] = Number(d['gdp_growth']);
                                                }
                                            });
                                        });

                                        response_foreign2.data.forEach(function(d) {
                                            countriesDataForeign2.forEach(function(e) {
                                                if (d.country === e.name) {
                                                    e.data[years.indexOf(Number(d.year))] = Number(d['gdp-per-capita-growth']);
                                                }
                                            });
                                        });

                                        // $scope.debug += "#COUNTRIES:\n" + JSON.stringify(countries, null, 2);
                                        // $scope.debug += "#YEARS:\n" + JSON.stringify(years, null, 2);
                                        // $scope.debug += "#DATA:\n" + JSON.stringify(countriesData, null, 2);
                                        // $scope.debug += "#DATA_FOREIGN:\n" + JSON.stringify(countriesDataForeign, null, 2);

                                        var hc = {
                                            chart: {
                                                zoomType: 'xy'
                                            },
                                            title: {
                                                text: 'Spendings on education, GDP Growth and GDP/Capita Growth'
                                            },
                                            xAxis: {
                                                categories: [],
                                                crosshair: true
                                            },
                                            yAxis: [{ // Primary yAxis
                                                labels: {
                                                    format: '{value} %',
                                                    style: {
                                                        color: Highcharts.getOptions().colors[1]
                                                    }
                                                },
                                                title: {
                                                    text: 'GDP (%)',
                                                    style: {
                                                        color: Highcharts.getOptions().colors[1]
                                                    }
                                                }

                                            }, { // Secondary yAxis
                                                gridLineWidth: 0,
                                                title: {
                                                    text: 'GDP Growth',
                                                    style: {
                                                        color: Highcharts.getOptions().colors[0]
                                                    }
                                                },
                                                labels: {
                                                    format: '{value} %',
                                                    style: {
                                                        color: Highcharts.getOptions().colors[0]
                                                    }
                                                },
                                                opposite: true
                                            }, { // Tertiary yAxis
                                                gridLineWidth: 0,
                                                title: {
                                                    text: 'GDP/Capita Growth',
                                                    style: {
                                                        color: Highcharts.getOptions().colors[2]
                                                    }
                                                },
                                                labels: {
                                                    format: '{value} %',
                                                    style: {
                                                        color: Highcharts.getOptions().colors[2]
                                                    }
                                                },
                                                opposite: true
                                            }],
                                            tooltip: {
                                                shared: true
                                            },
                                            series: []
                                        };

                                        hc.xAxis.categories = years;
                                        hc.series = countriesData.concat(countriesDataForeign).concat(countriesDataForeign2);

                                        Highcharts.chart('hc_column', hc);

                                        $scope.loading = false;
                                    });

                            });

                    }, function(response) {
                        $scope.loading = false;
                        switch (response.status) {
                            case 401:
                                Materialize.toast('<i class="material-icons">error_outline</i> Error getting data - api key missing!', 4000);
                                break;
                            case 403:
                                Materialize.toast('<i class="material-icons">error_outline</i> Error getting data - api key incorrect!', 4000);
                                break;
                            case 404:
                                Materialize.toast('<i class="material-icons">error_outline</i> No data found!', 4000);
                                break;
                            default:
                                Materialize.toast('<i class="material-icons">error_outline</i> Error getting data!', 4000);
                                break;
                        }
                    });
            };

            $scope.refresh();

            //     console.log("Chart Controller initialized");

            //     $scope.apikey = "secret";
            //     $scope.data = {};
            //     var dataCache = {};
            //     $scope.country = [];
            //     $scope.country1 = [];
            //     $scope.year = [];
            //     $scope.gdp = [];
            //     $scope.gdp_growth = [];
            //     $scope.gdp_deflator = [];
            //     $scope.gdp_per_capita_growth = [];
            //     $scope.gdp_per_capita = [];
            //     $scope.gdp_per_capita_ppp = [];


            //     $http.get("/api/v1/gdp/" + "?" + "apikey=" + $scope.apikey).then(function(response) {
            //         dataCache = response.data;
            //         $scope.data = dataCache;

            //         for (var i = 0; i < response.data.length; i++) {
            //             $scope.country.push($scope.data[i].country + " " + $scope.data[i].year);
            //             $scope.year.push(Number($scope.data[i].year));
            //             $scope.gdp.push(Number($scope.data[i].gdp));
            //             $scope.gdp_growth.push(Number($scope.data[i].gdp_growth));
            //             $scope.gdp_deflator.push(Number($scope.data[i].gdp_deflator));

            //             console.log($scope.data[i].country);
            //         }



            //     });

            //     console.log("Controller intialized");
            //     $http
            //         .get("/api/v1/gdp/" + "?" + "apikey=" + $scope.apikey)
            //         .then(function(response) {
            //             console.log("hola" + response.data);


            //             $http
            //                 .get("../api/v1/education" + "?" + "apikey=" + $scope.apikey)
            //                 .then(function(response) {


            //                     var years = [];
            //                     var countries = [];

            //                     response.data.forEach(function(d) {
            //                         if (years.indexOf(Number(d.year)) == -1) years.push(Number(d.year));
            //                         if (countries.indexOf(d.country) == -1) countries.push(d.country);
            //                     });
            //                     years.sort((a, b) => a - b);

            //                     var countriesData = [];

            //                     countries.forEach(function(d) {
            //                         var c = {
            //                             name: d,
            //                             data: []
            //                         };
            //                         years.forEach(function(e) {
            //                             c.data.push(0);
            //                         });
            //                         countriesData.push(c);
            //                     });

            //                     response.data.forEach(function(d) {
            //                         countriesData.forEach(function(e) {
            //                             if (d.country === e.name) {
            //                                 e.data[years.indexOf(Number(d.year))] = Number(d['education-gdp-perc']);
            //                             }
            //                         });
            //                     });





            //                     $http
            //                         .get("/api/v1/gdp-per-capita" + "?" + "apikey=" + $scope.apikey)
            //                         .then(function(response) {
            //                             dataCache = response.data;
            //                             $scope.data = dataCache;

            //                             for (var i = 0; i < response.data.length; i++) {
            //                                 $scope.country.push($scope.data[i].country);
            //                                 $scope.year.push(Number($scope.data[i].year));
            //                                 $scope.gdp_per_capita_growth.push(Number($scope.data[i]["gdp-per-capita-growth"]));
            //                                 $scope.gdp_per_capita.push(Number($scope.data[i]["gdp-per-capita"]));
            //                                 $scope.gdp_per_capita_ppp.push(Number($scope.data[i]["gdp-per-capita-ppp"]));
            //                             }

            //                             $scope.categoriasTotal = $scope.country.concat($scope.country1);
            //                             $scope.categoriasTotal = $scope.categoriasTotal.concat($scope.countries);
            //                             console.log($scope.country);
            //                             console.log($scope.country1);
            //                             console.log($scope.countries);
            //                             console.log($scope.categoriasTotal);
            //                             Highcharts.chart('analyticschart', {
            //                                 chart: {
            //                                     type: 'column'
            //                                 },
            //                                 title: {
            //                                     text: 'GDP API + EDUCATION API + GDP PER CAPITA API'
            //                                 },
            //                                 xAxis: {

            //                                     categories: $scope.categoriasTotal

            //                                 },
            //                                 yAxis: {
            //                                     min: 0,
            //                                     title: {
            //                                         text: 'Comparison Expenditure on public education between three countries'
            //                                     },
            //                                     stackLabels: {
            //                                         enabled: true,
            //                                         style: {
            //                                             fontWeight: 'bold',
            //                                             color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
            //                                         }
            //                                     }
            //                                 },
            //                                 legend: {
            //                                     align: 'right',
            //                                     x: -30,
            //                                     verticalAlign: 'top',
            //                                     y: 25,
            //                                     floating: true,
            //                                     backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
            //                                     borderColor: '#CCC',
            //                                     borderWidth: 1,
            //                                     shadow: false
            //                                 },
            //                                 tooltip: {
            //                                     headerFormat: '<b>{point.x}</b><br/>',
            //                                     pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
            //                                 },
            //                                 plotOptions: {
            //                                     column: {
            //                                         stacking: 'normal',
            //                                         dataLabels: {
            //                                             enabled: true,
            //                                             color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'
            //                                         }
            //                                     }
            //                                 },
            //                                 series: [{
            //                                     name: 'Gdp',
            //                                     data: $scope.gdp
            //                                 }, {
            //                                     name: 'Gdp_Growth',
            //                                     data: $scope.gdp_growth
            //                                 }, {
            //                                     name: 'Gdp_Deflator',
            //                                     data: $scope.gdp_deflator
            //                                 }, {
            //                                     name: 'Gdp Per Capita',
            //                                     data: $scope.gdp_per_capita
            //                                 }, {
            //                                     name: 'Gdp Per Capita Growth ',
            //                                     data: $scope.gdp_per_capita_growth
            //                                 }, {
            //                                     name: 'Gdp Per Capita PPP',
            //                                     data: $scope.gdp_per_capita_ppp
            //                                 }, {
            //                                     name: 'Education Gdp Per Capita',
            //                                     data: $scope.data
            //                                 }]
            //                             });

            //                         });
            //                 });
            //         });
            // }
}]);
