/* global Highcharts */
/* global angular */
angular
    .module("DataManagementApp")
    .controller("GdpRemoteUnemploymentGraphCtrl",["$scope","$http", "$rootScope",function ($scope, $http ,$rootScope){
        
        $scope.apikey = "secret";
        $scope.data = {};
        var dataCache = {};
        var dataCache1 = {};
        $scope.country = [];
        $scope.year = [];
        $scope.gdp = [];
        $scope.gdp_growth = [];
        $scope.gdp_deflator = [];
        
        $scope.Id = [];
        $scope.FK_Vaiable= [];
        $scope.Nombre =[];
        $scope.Codigo=[];
       
     
        
        function capitalizeFirstLetter(string) {
                return string.charAt(0).toUpperCase() + string.slice(1);
            }
        
        
        
        
        $http.get("https://servicios.ine.es/wstempus/js/ES/VALORES_VARIABLE/12?page=1").
        then(function(response){
            
            dataCache = response.data;
            $scope.data = dataCache;
            
            console.log(response);
            
            for(var i=0; i<response.data.length; i++){
                
                
                    $scope.Id.push(Number($scope.data[i].Fecha));
                    $scope.FK_Vaiable.push(Number($scope.data[i].FK_TipoDato));
                    $scope.Nombre.push(Number($scope.data[i].FK_Periodo));
                    $scope.Codigo.push(Number($scope.data[i].Valor));
                    
                
                    console.log($scope.data[i].id);
                    
                
            }
            $http.get("/api/v1/gdp/"+ "?" + "apikey=" + $scope.apikey).then(function(response){
            
                dataCache1 = response.data;
                $scope.data1 = dataCache1;
                console.log(response);
                for(var i=0; i<response.data.length; i++){
                    $scope.country.push(capitalizeFirstLetter($scope.data1[i].country) + " " + $scope.data1[i].year);
                    $scope.year.push(Number($scope.data1[i].year));
                    $scope.gdp.push(Number($scope.data1[i].gdp));
                    $scope.gdp_growth.push(Number($scope.data1[i].gdp_growth));

                    console.log($scope.data1[i].country);            
                
                
            }console.log("Controller initialized (GdpRemoteUnemploymentGraphCtrl)");
        
    
                
                Highcharts.chart('container', {
                chart: {
                    type: 'spline'
                },
                title: {
                    text: 'Highcharts'
                },
                subtitle: {
                    text: 'Source: INE - WORK STATUS'
                },
                xAxis: {
                    categories: $scope.country
                },
                yAxis: {
                    title: {
                        text: 'Values'
                    },
                    labels: {
                        formatter: function () {
                            return this.value + '%';
                        }
                    }
                },
                tooltip: {
                    crosshairs: true,
                    shared: true
                },
                plotOptions: {
                    spline: {
                        marker: {
                            radius: 4,
                            lineColor: '#666666',
                            lineWidth: 1
                        },
                        dataLabels: {
                            enabled: true
                        }
                    },
                    series: {
                        connectNulls: true
                    }
                },
                series:[{
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
                },{
                    type: 'area',
                    name: 'Fecha',
                    data: $scope.Fecha
                },{
                    type:'area',
                    name: 'Tipo',
                    data: $scope.FK_TipoDato
                },{
                    type: 'area',
                    name: 'Dato',
                    data: $scope.FK_TipoDato
                }]
                
            });
            
        });
    });    
        
}]);