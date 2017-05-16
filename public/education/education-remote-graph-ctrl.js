/* global angular */
/* global Materialize */
/* global Highcharts */

angular.module("DataManagementApp").
controller("EducationRemoteGraphCtrl", ["$scope", "$http", "$rootScope", function($scope, $http, $rootScope) {
    console.log("Controller initialized (EducationRemoteGraphCtrl)");

    if (!$rootScope.apikey) $rootScope.apikey = "secret";

    $scope.refresh = function() {
        $http
            .get("../api/v1/education" + "?" + "apikey=" + $rootScope.apikey)
            .then(function(response) {
                //$scope.debug = "";

                var years = [];
                var countries = [];
                var countriesForeign = [];
                var countriesData = [];
                var countriesDataForeign = [];

                $http
                    .get("https://sos1617-01.herokuapp.com/api/v2/startups-stats?apikey=sos161701")
                    .then(function(response_foreign) {

                        response.data.forEach(function(d) {
                            if (years.indexOf(Number(d.year)) == -1) years.push(Number(d.year));
                            if (countries.indexOf(d.country) == -1) countries.push(d.country);
                        });

                        response_foreign.data.forEach(function(d) {
                            if (years.indexOf(Number(d.year)) == -1) years.push(Number(d.year));
                            if (countriesForeign.indexOf(d.country) == -1) countriesForeign.push(d.country);
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
                                    e.data[years.indexOf(Number(d.year))] = Number(d['total']);
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
                                text: 'Spending on education and the level of start-ups'
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
                                    text: 'The level of start-ups',
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
                            series: []
                        };
                        
                        hc.xAxis.categories = years;
                        hc.series = countriesData.concat(countriesDataForeign);

                        Highcharts.chart('hc_column', hc);

                    });

            }, function(response) {
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
