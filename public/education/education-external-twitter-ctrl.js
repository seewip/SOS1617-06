/* global angular */
/* global Materialize */
/* global Highcharts */

angular.module("DataManagementApp").
controller("EducationExternalTwitterGraphCtrl", ["$scope", "$http", "$rootScope", function($scope, $http, $rootScope) {
    console.log("Controller initialized (EducationExternalTwitterGraphCtrl)");

    $scope.loading = false;

    if (!$rootScope.apikey) $rootScope.apikey = "secret";

    $scope.refresh = function(token) {
        $scope.loading = true;
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
                    .get("https://api.twitter.com/1.1/friends/list.json?cursor=-1&screen_name=mafiu95&skip_status=true&include_user_entities=false", {
                        headers: {
                            'Authorization': 'bearer '+token
                        }
                    })
                    .then(function(response_foreign) {

                        console.log(response_foreign.data);

                        response.data.forEach(function(d) {
                            if (years.indexOf(Number(d.year)) == -1) years.push(Number(d.year));
                            if (countries.indexOf(d.country) == -1) countries.push(d.country);
                        });

                        response_foreign.data.data.forEach(function(d) {
                            if (years.indexOf(Number(d.fan_count)) == -1) years.push(Number(d.fan_count));
                            if (provincesForeign.indexOf(d.name) == -1) provincesForeign.push(d.name);
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
                                type: "column",
                                yAxis: 1,
                                data: []
                            };
                            years.forEach(function(e) {
                                c.data.push(null);
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

                        response_foreign.data.data.forEach(function(d) {
                            provincesDataForeign.forEach(function(e) {
                                if (d.name === e.name) {
                                    e.data[years.indexOf(Number(d.fan_count))] = Number(d['fan_count']);
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

    //$scope.refresh();

}]);
