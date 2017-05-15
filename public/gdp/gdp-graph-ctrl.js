/*global angular*/
/*global Highcharts*/
/*global google*/
/*global zingchart*/

angular
    .module("DataManagementApp")
    .controller("GdpGraphCtrl",["$scope","$http",function ($scope, $http){
        
        $scope.apikey = "secret";
        $scope.data = {};
        var dataCache = {};
        $scope.country = [];
        $scope.year = [];
        $scope.gdp = [];
        $scope.gdp_growth = [];
        $scope.gdp_deflator = [];
        
        function capitalizeFirstLetter(string) {
                return string.charAt(0).toUpperCase() + string.slice(1);
            }
        
        $http.get("/api/v1/gdp/"+ "?" + "apikey=" + $scope.apikey).then(function(response){
            
            dataCache = response.data;
            $scope.data = dataCache;
            
            for(var i=0; i<response.data.length; i++){
                $scope.country.push(capitalizeFirstLetter($scope.data[i].country) + " " + $scope.data[i].year);
                $scope.year.push(Number($scope.data[i].year));
                $scope.gdp.push(Number($scope.data[i].gdp));
                $scope.gdp_growth.push(Number($scope.data[i].gdp_growth));
                $scope.gdp_deflator.push(Number($scope.data[i].gdp_deflator));
                
                console.log($scope.data[i].country);
            }
        });    
            
        console.log("Controller initialized");
        
        $http.get("/api/v1/gdp/"+ "?" + "apikey=" + $scope.apikey).then(function(response){
            
            
            Highcharts.chart('container',{
                title: {
                    text: 'Highcharts'
                },
                chart: {
                    type: 'spline'
                },
                xAxis: {
                    categories: $scope.country
                },
                legend: {
                    layout: 'vertical',
                    floating: true,
                    backgroundColor: '#FFFFFF',
                    //align: 'left',
                    verticalAlign: 'top',
                    align: 'right',
                    y: 60,
                    x: -60
                },
                tooltip: {
                    formatter: function () {
                        return '<b>' + this.series.name + '</b><br/>' +
                            capitalizeFirstLetter(this.x) + ': ' + this.y;
                    }
                },
                series:[{
                    name: 'Country',
                    data: $scope.country
                }, {
                    name: 'Year',
                    data: $scope.year
                }, {
                    name: 'Gdp',
                    data: $scope.gdp
                }, {
                    name: 'Gdp_Growth',
                    data: $scope.gdp_growth
                }, {
                    name: 'Gdp_Deflator',
                    data: $scope.gdp_deflator
                }]
            });
            
            //Google
            google.charts.load('current', {
                    'packages': ['controls', 'geochart'],
                    mapsApiKey: "AIzaSyBAtQCZMy-Z9ssoeQh-yloj-3PArIDfgjE"
                });
                google.charts.setOnLoadCallback(drawRegionsMap);

                function drawRegionsMap() {
                    var chartData = [
                        ['country', 'gdp', 'year']
                    ];

                    response.data.forEach(function(x) {
                        chartData.push([x.country, Number(x['gdp']), Number(x.year)]);
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
            
         //ZingChart
            var myConfig = {
                "type": "line",
                
                "backgroundColor":'#2C2C39',
                "title": {
                    "text": "Gdp Data Analytics",
                    "fontColor":"#E3E3E5",
                    "font-size": "24px",
                    "adjust-layout": true
                },
                "plotarea": {
                    "margin": "dynamic 45 60 dynamic",
                },
                
                "legend": {
                    "layout": "float",
                    "background-color": "none",
                    "border-width": 0,
                    "shadow": 0,
                    "align": "center",
                    "adjust-layout": true,
                "item": {
                    "padding": 7,
                    "marginRight": 17,
                    "cursor": "hand"
                }
                },
                
                "scale-x": {
                    "label": {
                        "text": "Country and Year",
                        "fontColor":"#E3E3E5",

                    },
                    "labels": 
                        $scope.country
                    
                },
                "scale-y": {
                    "min-value": "0:1383292800000",
                    "label": {
                        "text": "Values Views",
                        "fontColor":"#E3E3E5",

                    },
                    
                },
                
                "crosshair-x": {
                    "line-color": "#efefef",
                    "plot-label": {
                    "border-radius": "5px",
                    "border-width": "1px",
                    "border-color": "#f6f7f8",
                    "padding": "10px",
                    "font-weight": "bold"
                },
                "scale-label": {
                    "font-color": "#000",
                    "background-color": "#f6f7f8",
                    "border-radius": "5px"
                }
            },
                
                "tooltip": {
                    "visible": false
                },
                
                "plot": {
                    "highlight": true,
                    "tooltip-text": "%t views: %v<br>%k",
                    "shadow": 0,
                    "line-width": "2px",
                    "marker": {
                    "type": "circle",
                    "size": 3
                },
                "highlight-state": {
                "line-width": 3
                },
                "animation": {
                    "effect": 1,
                    "sequence": 2,
                    "speed": 100,
                }
                },
                
                "series": [
                {
                    "values": $scope.gdp,
                    "text": "Gdp",
                    "line-color": "#007790",
                    "legend-item":{
                      "background-color": "#007790",
                      "borderRadius":5,
                      "font-color":"white"
                    },
                    "legend-marker": {
                        "visible":false
                    },
                    "marker": {
                        "background-color": "#007790",
                        "border-width": 1,
                        "shadow": 0,
                        "border-color": "#69dbf1"
                    },
                    "highlight-marker":{
                      "size":6,
                      "background-color": "#007790",
                    }
                },
                {
                    "values": $scope.gdp_growth,
                    "text": "Gdp_Growth",
                    "line-color": "#FEB32E",
                    "legend-item":{
                      "background-color": "#FEB32E",
                      "borderRadius":5,
                      "font-color":"white"
                    },
                    "legend-marker": {
                        "visible":false
                    },
                    "marker": {
                        "background-color": "#FEB32E",
                        "border-width": 1,
                        "shadow": 0,
                        "border-color": "#69f2d0"
                    },
                    "highlight-marker":{
                      "size":6,
                      "background-color": "#FEB32E",
                    }
                },
                {
                    "values": $scope.gdp_deflator,
                    "text": "Gdp_Deflator",
                    "line-color": "#da534d",
                    "legend-item":{
                      "background-color": "#da534d",
                      "borderRadius":5,
                      "font-color":"white"
                    },
                    "legend-marker": {
                        "visible":false
                    },
                    "marker": {
                        "background-color": "#da534d",
                        "border-width": 1,
                        "shadow": 0,
                        "border-color": "#faa39f"
                    },
                    "highlight-marker":{
                      "size":6,
                      "background-color": "#da534d",
                    }
                }
            ]
            };

            zingchart.render({
                id: 'myChart',
                data: myConfig,
                height: '100%',
                width: '95%'
            });
            

             });
    }]);