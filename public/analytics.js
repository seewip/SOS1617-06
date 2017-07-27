// Authors: Cristina Leal Echevarria, Jihane Fahri, Mateusz Dominik

/* global angular */
/* global Materialize */
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
}]);
