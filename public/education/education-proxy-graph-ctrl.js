// Author: Mateusz Dominik

/* global angular */
/* global Materialize */
/* global Highcharts */

angular.module("DataManagementApp").
controller("EducationProxyGraphCtrl", ["$scope", "$http", "$rootScope", function($scope, $http, $rootScope) {
    console.log("Controller initialized (EducationProxyGraphCtrl)");

    $scope.loading = true;

    if (!$rootScope.apikey) $rootScope.apikey = "secret";

    $scope.refresh = function() {
        $http
            .get("../api/v1/education" + "?" + "apikey=" + $rootScope.apikey)
            .then(function(response) {
                //$scope.debug = "";

                var years = [];
                var countries = [];
                var provincesForeign = [];
                var countriesData = [];
                var provincesDataForeign = [];

                $http
                    .get("../proxy/education")
                    .then(function(response_foreign) {

                        response.data.forEach(function(d) {
                            if (years.indexOf(Number(d.year)) == -1) years.push(Number(d.year));
                            if (countries.indexOf(d.country) == -1) countries.push(d.country);
                        });

                        response_foreign.data.forEach(function(d) {
                            if (years.indexOf(Number(d.year)) == -1) years.push(Number(d.year));
                            if (provincesForeign.indexOf(d.province) == -1) provincesForeign.push(d.province);
                        });

                        years.sort((a, b) => a - b);

                        countries.forEach(function(d) {
                            var b = {
                                name: d,
                                type: "column",
                                yAxis: 0,
                                data: []
                            };
                            years.forEach(function(e) {
                                b.data.push(0);
                            });
                            countriesData.push(b);
                        });

                        provincesForeign.forEach(function(d) {
                            var c = {
                                name: d,
                                type: "spline",
                                yAxis: 1,
                                data: []
                            };
                            years.forEach(function(e) {
                                c.data.push(0);
                            });
                            provincesDataForeign.push(c);
                        });

                        response.data.forEach(function(d) {
                            countriesData.forEach(function(e) {
                                if (d.country === e.name) {
                                    e.data[years.indexOf(Number(d.year))] = Number(d['education-gdp-perc']);
                                }
                            });
                        });

                        response_foreign.data.forEach(function(d) {
                            provincesDataForeign.forEach(function(e) {
                                if (d.province === e.name) {
                                    e.data[years.indexOf(Number(d.year))] = Number(d['oil']);
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
                                text: 'Spending on education and the amount of oil'
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
                                    text: 'Amount of oil',
                                    style: {
                                        color: Highcharts.getOptions().colors[0]
                                    }
                                },
                                labels: {
                                    format: '{value}',
                                    style: {
                                        color: Highcharts.getOptions().colors[0]
                                    }
                                },
                                opposite: true
                            }],
                            tooltip: {
                                shared: true
                            },
                            plotOptions: {
                                column: {
                                    stacking: 'normal'
                                }
                            },
                            series: []
                        };

                        hc.xAxis.categories = years;
                        hc.series = countriesData.concat(provincesDataForeign);

                        Highcharts.chart('hc_column', hc);
                        
                        $scope.loading = false;
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

}]);
