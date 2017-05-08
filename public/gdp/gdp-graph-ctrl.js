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
            
         //ZingChart
            var myChart = {
                "type": "line",
                "backgroundColor":'#2C2C39',
                "title": {
                    "text": "ZingChart for GDP !"
                },
                "legend": {
                    "header": {
                        "text": "GDP "
                    },
                    "draggable": "true",
                    "drag-handler": "icon"
                },
                "plot": {
                    "value-box": {
                        "text": "%node-value"
                    }
                },
                "series": [{
                    "name" : "Gdp",
                    "values": $scope.gdp
                }, {
                    "name": "Gdp_Growth",
                    "values": $scope.gdp_growth
                }, {
                    "name" : "Gdp_Deflator",
                    "values": $scope.gdp_deflator
                }]
            };
            zingchart.render({
                id: "myChart",
                data: myChart,
                height: 680,
                width: 1200
            });
             });
    }]);