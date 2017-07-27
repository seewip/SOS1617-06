// Author: Jihane Fahri

/* global angular */
/* global google */
/* global Highcharts */
/* global c3 */

angular
    .module("DataManagementApp")
    .controller("GdpPerCapitaGraphCtrl", ["$scope", "$http", "$rootScope", function($scope, $http, $rootScope) {
        
        $scope.apikey = "secret";
        $scope.data = {};
        var dataCache = {};
        $scope.country = [];
        $scope.year = [];
        $scope.gdp_per_capita_growth = [];
        $scope.gdp_per_capita = [];
        $scope.gdp_per_capita_ppp = [];

        $http.get("/api/v1/gdp-per-capita" + "?" + "apikey=" + $scope.apikey).then(function(response) {

            dataCache = response.data;
            $scope.data = dataCache;

            for (var i = 0; i < response.data.length; i++) {
                $scope.country.push($scope.data[i].country);
                $scope.year.push(Number($scope.data[i].year));
                $scope.gdp_per_capita_growth.push(Number($scope.data[i]["gdp-per-capita-growth"]));
                $scope.gdp_per_capita.push(Number($scope.data[i]["gdp-per-capita"]));
                $scope.gdp_per_capita_ppp.push(Number($scope.data[i]["gdp-per-capita-ppp"]));
            }
            console.log("Controller initialized (GdpPerCapitaGraphCtrl)");

            //Highchart

            Highcharts.chart('container', {
                chart: {
                    zoomType: 'xy'
                },
                title: {
                    text: 'Data representation'
                },
                subtitle: {
                    text: 'Gdp per capita, gdp per capita growth and gdp per capita ppp for each country'
                },
                xAxis: [{
                    categories: $scope.country,
                    crosshair: true
                }],
                yAxis: [{ // Primary yAxis
                    labels: {
                        format: '{value}',
                        style: {
                            color: Highcharts.getOptions().colors[2]
                        }
                    },
                    title: {
                        text: 'Gdp Per Capita PPP 2015',
                        style: {
                            color: Highcharts.getOptions().colors[2]
                        }
                    },
                    opposite: true

                }, { // Secondary yAxis
                    gridLineWidth: 0,
                    title: {
                        text: 'Gdp Per Capita Growth 2015',
                        style: {
                            color: Highcharts.getOptions().colors[0]
                        }
                    },
                    labels: {
                        format: '{value} %',
                        style: {
                            color: Highcharts.getOptions().colors[0]
                        }
                    }

                }, { // Tertiary yAxis
                    gridLineWidth: 0,
                    title: {
                        text: 'Gdp Per Capita 2015',
                        style: {
                            color: Highcharts.getOptions().colors[1]
                        }
                    },
                    labels: {
                        format: '{value} ',
                        style: {
                            color: Highcharts.getOptions().colors[1]
                        }
                    },
                    opposite: true
                }],
                tooltip: {
                    shared: true
                },
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    x: 0,
                    verticalAlign: 'bottom',
                    y: -50,
                    floating: true,
                    backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
                },
                series: [{
                    name: 'Gdp Per Capita Growth 2015',
                    type: 'bar',
                    yAxis: 1,
                    data: $scope.gdp_per_capita_growth,
                    tooltip: {
                        valueSuffix: ''
                    }

                }, {
                    name: 'Gdp Per Capita 2015',
                    type: 'bar',
                    yAxis: 2,
                    data: $scope.gdp_per_capita,
                    marker: {
                        enabled: false
                    },
                    dashStyle: 'shortdot',
                    tooltip: {
                        valueSuffix: ''
                    }

                }, {
                    name: 'Gdp Per Capita PPP 2015',
                    type: 'bar',
                    data: $scope.gdp_per_capita_ppp,
                    tooltip: {
                        valueSuffix: ''
                    }
                }]
            });

            //Google

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

            // Line chart
            var chart = c3.generate({
                bindto: '#chart',
                data: {
                    x: 'x',
                    columns: [
                        ['x'].concat($scope.country), ['Gdp Per Capita Growth 2015'].concat($scope.gdp_per_capita_growth), ['Gdp Per Capita 2015'].concat($scope.gdp_per_capita), ['Gdp Per Capita PPP 2015'].concat($scope.gdp_per_capita_ppp)
                    ],

                },
                axis: {
                    x: {
                        type: 'category' // this needed to load string x value
                    },
                    y: {
                        label: { // ADD
                            text: 'Gdp Per Capita PPP',
                            position: 'outer-middle'
                        }
                    }
                }
            });

            // chart_donut.js

            var chart2 = c3.generate({
                bindto: '#chart2',
                data: {
                    columns: [
                        [$scope.country[0], $scope.gdp_per_capita[0]]
                    ],
                    type: 'donut',
                    onclick: function(d, i) {
                        console.log("onclick", d, i);
                    },
                    onmouseover: function(d, i) {
                        console.log("onmouseover", d, i);
                    },
                    onmouseout: function(d, i) {
                        console.log("onmouseout", d, i);
                    }
                },
                donut: {
                    title: "GDP/Capita "
                }
            });

            setTimeout(function() {
                chart2.load({
                    columns: [
                        [$scope.country[1], $scope.gdp_per_capita[1]]
                    ]
                });
            }, 2500);

            setTimeout(function() {
                chart2.load({
                    columns: [
                        [$scope.country[2], $scope.gdp_per_capita[2]]
                    ]
                });
            }, 5000);


        });
    }]);
