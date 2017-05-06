/*global angular*/
/*global Highcharts*/
/*global google*/

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
                    type: 'bar'
                },
                xAxis: {
                    categories: $scope.categorias
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
                'packages': ['controls','geochart']
            });
            google.charts.setOnLoadCallback(drawRegionsMap);
                        
        
            function drawRegionsMap() {
                var myData = [['Country','Gdp', 'Year']];
     
                response.data.forEach(function (d){
                    myData.push([capitalizeFirstLetter(d.country), Number(d.gdp), Number(d.year)]);
                });
                    
                var data = google.visualization.arrayToDataTable(myData);
                var options = {
                    region: '150',
                    colorAxis: {colors: ['yellow', 'orange' , 'blue']}
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
                        displayMode: 'regions',
                        region: '150',
                        colorAxis: {colors: ['green', 'yellow' , 'red']}
                    }
                });
                dashboard.bind(yearSelector, chart);
                dashboard.draw(data, options);
            }    
            
            
            // //ZingChart
            // var myChart = echarts.init(document.getElementById('echarts'));

            //     // specify chart configuration item and data
            // var option2 = {
            //     backgroundColor: '#0f375f',
            //     title: {
            //         text: 'ECharts',
            //         textStyle:{
            //             color: '#ccc'
            //         }
            //     },
            //     tooltip: {},
            //     legend: {
            //         data:['ESL Total','ESL Objective'],
            //         textStyle: {
            //             color: '#ccc'
            //         }
            //     },
            //     xAxis: {
            //         type: 'category',
            //         data: $scope.categorias,
            //         axisLine: {
            //             lineStyle: {
            //                 color: '#ccc'
            //             }
            //         }
            //     },
            //     yAxis: {
            //         splitLine: {show: false},
            //         axisLine: {
            //             lineStyle: {
            //                 color: '#ccc'
            //             }
            //         }
            //     },
            //     series: [{
            //         name: 'ESL Total',
            //         type: 'line',
            //         smooth: true,
            //         showAllSymbol: true,
            //         symbol: 'emptyCircle',
            //         symbolSize: 15,
            //         data: $scope.esltotal
            //     }, {
            //         name: 'ESL Objective',
            //         type: 'bar',
            //         barWidth: 10,
            //         itemStyle: {
            //             normal: {
            //                 barBorderRadius: 5,
            //                 color: new echarts.graphic.LinearGradient(0, 0, 0, 1,[{offset: 0, color: '#14c8d4'},
            //                     {offset: 1, color: '#43eec6'}])
            //             }
            //         },
            //         data: $scope.eslobjective
            //     }, {
            //         name: 'ESL Total',
            //         type: 'bar',
            //         barGap: '-100%',
            //         barWidth: 10,
            //         itemStyle: {
            //             normal: {
            //                 color: new echarts.graphic.LinearGradient(0, 0, 0, 1,[
            //                     {offset: 0, color: 'rgba(20,200,212,0.5)'},
            //                     {offset: 0.2, color: 'rgba(20,200,212,0.2)'},
            //                     {offset: 1, color: 'rgba(20,200,212,0)'}])
            //             }
            //         },
            //         z: -12,
            //         data: $scope.esltotal
            //     }, {
            //         name: 'ESL Total',
            //         type: 'pictorialBar',
            //         symbol: 'rect',
            //         itemStyle: {
            //             normal: {
            //                 color: '#0f375f'
            //             }
            //         },
            //         symbolRepeat: true,
            //         symbolSize: [12, 4],
            //             symbolMargin: 1,
            //         z: -10,
            //         data: $scope.esltotal
            //     }]
            // };

            // // use configuration item and data specified to show chart
            // myChart.setOption(option2);
             });
    }]);