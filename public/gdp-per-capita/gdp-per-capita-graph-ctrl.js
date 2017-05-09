/* global angular */
/* global Materialize */
/* global $ */
/* global google */
/* global Highcharts */
/* global c3 */

angular
    .module("DataManagementApp")
    .controller("GdpPerCapitaGraphCtrl", ["$scope", "$http", "$rootScope", function($scope, $http, $rootScope) {
                console.log("Controller initialized (GdpPerCapitaGraphCtrl)");

                if (!$rootScope.apikey) $rootScope.apikey = "secret";

                $scope.refresh = function() {
                    $http
                        .get("../api/v1/gdp-per-capita" + "?" + "apikey=" + $rootScope.apikey)
                        .then(function(response) {

                                var years = [];
                                var countries = [];

                                response.data.forEach(function(d) {
                                    if (years.indexOf(Number(d.year)) == -1) years.push(Number(d.year));
                                    if (countries.indexOf(d.country) == -1) countries.push(d.country);
                                });
                                years.sort((a, b) => a - b);

                                var countriesData = [];

                                countries.forEach(function(d) {
                                    var c = {
                                        name: d,
                                        data: []
                                    };
                                    years.forEach(function(e) {
                                        c.data.push(0);
                                    });
                                    countriesData.push(c);
                                });

                                response.data.forEach(function(d) {
                                    countriesData.forEach(function(e) {
                                        if (d.country === e.name) {
                                            e.data[years.indexOf(Number(d.year))] = Number(d['gdp-per-capita-growth']);
                                        }
                                    });
                                });
                
                                // Highcharts
                                


                                Highcharts.chart('container', {
                                    chart: {
                                        type: 'areaspline'
                                    },
                                    title: {
                                        text: 'Highcharts'
                                    },
                                    legend: {
                                        layout: 'vertical',
                                        align: 'left',
                                        verticalAlign: 'top',
                                        x: 150,
                                        y: 100,
                                        floating: true,
                                        borderWidth: 1,
                                        backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
                                    },
                                    xAxis: {
                                        categories: years,
                                        plotBands: [{
                                            from: 4.5,
                                            to: 6.5,
                                            color: 'rgba(68, 170, 213, .2)'
                                        }]
                                    },
                                    yAxis: {
                                        title: {
                                            text: 'Gdp per capita growth(%)'
                                        }
                                    },
                                    tooltip: {
                                        shared: true,
                                        valueSuffix: 'units'
                                    },
                                    credits: {
                                        enabled: false
                                    },
                                    plotOptions: {
                                        areaspline: {
                                            fillOpacity: 0.5
                                        }
                                    },
                                    // motion: {
                                    //     enabled: true,
                                    //     axisLabel: 'Week',
                                    //     labels: [
                                    //         "Week 31", "Week 32", "Week 33", "Week 34",
                                    //         "Week 35", "Week 36", "Week 37", "Week 38",
                                    //         "Week 39", "Week 40", "Week 41"
                                    //     ],
                                    //     series: [0, 1], // The series which holds points to update
                                    //     updateInterval: 15,
                                    //     magnet: {
                                    //         round: 'floor', // ceil / floor / round
                                    //         step: 0.02
                                    //     }
                                    // },
                                    series: [countriesData]
                                });


                                // Google Charts - Geochart
                                google.charts.load('current', {
                                    'packages': ['controls', 'geochart']
                                });
                                google.charts.setOnLoadCallback(drawRegionsMap);

                                function drawRegionsMap() {
                                    var chartData = [
                                        ['country', 'gdp-per-capita-growth', 'year']
                                    ];

                                    response.data.forEach(function(x) {
                                        chartData.push([x.country, Number(x['gdp-per-capita-growth']), Number(x.year)]);
                                    });

                                    var data = google.visualization.arrayToDataTable(chartData);

                                    var options = {
                                        colorAxis: {
                                            colors: ['red', 'yellow', 'green']
                                        }
                                    };

                                    var dashboard = new google.visualization.Dashboard(document.getElementById('dashboard'));

                                    var yearSelector = new google.visualization.ControlWrapper({
                                        controlType: 'CategoryFilter',
                                        containerId: 'filter',
                                        options: {
                                            filterColumnIndex: 2,
                                            ui: {
                                                allowTyping: false,
                                                allowMultiple: false,
                                                allowNone: false
                                            }
                                        }
                                    });

                                    var chart = new google.visualization.ChartWrapper({
                                        chartType: 'GeoChart',
                                        containerId: 'map',
                                        options: {
                                            colorAxis: {
                                                colors: ['red', 'yellow', 'green']
                                            }
                                        }
                                    });

                                    dashboard.bind(yearSelector, chart);
                                    dashboard.draw(data, options);
                                }

                                // C3
                                var chart = c3.generate({
                                    bindto: 'chart',
                                    data: {
                                        x: 'x',
                                        columns: []
                                    },
                                    axis: {
                                        x: {
                                            type: 'timeseries',
                                            tick: {
                                                format: '%Y-%m-%d'
                                            }
                                        }
                                    }
                                });
                                countriesData.forEach(function(e) {
                                    $scope.data.push(e.data);
                                });

                        });
                        };
                        $scope.refresh()
}]);