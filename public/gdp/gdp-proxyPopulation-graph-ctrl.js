/*global angular*/
/*global zingchart*/
angular
    .module("DataManagementApp")
    .controller("GdpProxyPopulationCtrl",["$scope","$http",function ($scope, $http){
        
        $scope.apikey = "secret";
        $scope.data = {};
        var dataCache = {};
        
        $scope.data1 = {};
        var dataCache1 = {};
        
        $scope.country = [];
        
        $scope.years = [];
        $scope.gdp = [];
        $scope.gdp_growth = [];
        $scope.gdp_deflator = [];
       
        
        $scope.countries = [];
        $scope.dataInicial = [];
        
        
        function capitalizeFirstLetter(string) {
                return string.charAt(0).toUpperCase() + string.slice(1);
            }
        
        $http.get("/api/v1/gdp/"+ "?" + "apikey=" + $scope.apikey).then(function(response){
            
            dataCache1 = response.data;
            $scope.data = dataCache1;
            
            for(var i=0; i<response.data.length; i++){
                $scope.country.push(capitalizeFirstLetter($scope.data[i].country) + " " + $scope.data[i].year);
                $scope.years.push($scope.data[i].year);
                $scope.gdp.push(Number($scope.data[i].gdp));
                $scope.gdp_growth.push(Number($scope.data[i].gdp_growth));
                $scope.gdp_deflator.push(Number($scope.data[i].gdp_deflator));
                
                $scope.countries.push(null);
                $scope.dataInicial.push(null);
             
                console.log($scope.data[i].country);
            }
        });
        
        $http.get("http://api.population.io/1.0/countries").then(function(response){
            
            dataCache = response.data;
            $scope.data = dataCache;
            console.log(response);
            
            for(var i=0; i<response.data.length; i++){
                
                if(capitalizeFirstLetter($scope.data[i].name) == "Spain"){
                    $scope.dataInicial.splice(0,1,Array(String($scope.data[i].dataInicial)));
                    $scope.dataInicial.splice(1,1,Array(String($scope.data[i].dataInicial)));
                    console.log($scope.data[i].dataInicial);
                } else if(capitalizeFirstLetter($scope.data[i].name) == "Poland"){
                    $scope.dataInicial.splice(2,1,Array(String($scope.data[i].dataInicial)));
                    $scope.dataInicial.splice(3,1,Array(String($scope.data[i].dataInicial)));
                    console.log($scope.data[i].dataInicial);
                } else if(capitalizeFirstLetter($scope.data[i].name) == "Morocco"){
                    $scope.dataInicial.splice(4,1,Array(String($scope.data[i].dataInicial)));
                    $scope.gini.splice(5,1,Array(($scope.data[i].dataInicial)));
                    console.log($scope.data[i].dataInicial);
                }else if(capitalizeFirstLetter($scope.data[i].name) == "United Kingdom"){
                    $scope.dataInicial.splice(6,1,Array(String($scope.data[i].dataInicial)));
                    $scope.gini.splice(7,1,Array(String($scope.data[i].dataInicial)));
                    console.log($scope.data[i].dataInicial);
                }
            }
            console.log($scope.dataInicial);
        });
        
        $http.get("/api/v1/gdp/"+ "?" + "apikey=" + $scope.apikey).then(function(response){
            
            var myConfig = {
                "type": "line",
                
                "backgroundColor":'#2C2C39',
                "title": {
                    "text": "Gdp Data Integrated With World Population API",
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
                
                ,
                {
                    "values": $scope.dataInicial,
                    "text": "Countries",
                    "line-color": "#da576d",
                    "legend-item":{
                      "background-color": "#da576d",
                      "borderRadius":5,
                      "font-color":"white"
                    },
                    "legend-marker": {
                        "visible":false
                    },
                    "marker": {
                        "background-color": "#da576d",
                        "border-width": 1,
                        "shadow": 0,
                        "border-color": "#faa19f"
                    },
                    "highlight-marker":{
                      "size":6,
                      "background-color": "#da576d",
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