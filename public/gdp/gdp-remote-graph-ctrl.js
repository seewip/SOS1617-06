// Author: Cristina Leal Echevarria

/* global Highcharts */
/* global angular */
angular
    .module("DataManagementApp")
    .controller("GdpRemoteGraphCtrl",["$scope","$http", "$rootScope",function ($scope, $http ,$rootScope){
        
        $scope.apikey = "secret";
        $scope.data = {};
        var dataCache = {};
        $scope.country = [];
        $scope.year = [];
        $scope.gdp = [];
        $scope.gdp_growth = [];
        $scope.gdp_deflator = [];
      
        
        $scope.minimumSalary= [];
        $scope.averageSalary = [];
        $scope.riskOfPoverty = [];
        
        function capitalizeFirstLetter(string) {
                return string.charAt(0).toUpperCase() + string.slice(1);
            }
        
        
        
        
        $http.get("https://sos1617-07.herokuapp.com/api/v1/salaries/?apikey=sos07").then(function(response){
            
            dataCache = response.data;
            $scope.data = dataCache;
            
            for(var i=0; i<response.data.length; i++){
                
                
                    $scope.minimumSalary.push(Number($scope.data[i].minimumSalary));
                    $scope.averageSalary.push(Number($scope.data[i].averageSalary));
                    $scope.riskOfPoverty.push(Number($scope.data[i].riskOfPoverty));
                
                    console.log($scope.data[i].country);
                    
                
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
            
                
                
            }console.log("Controller initialized (GdpRemoteGraphCtrl)");
        
    
                Highcharts.chart('container', {
                chart: {
                    type: 'area'
                },
                title: {
                    text: 'Highcharts'
                },
                subtitle: {
                    text: 'Source: G07 - SALARIES'
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
                    name: 'Minimum Salary',
                    data: $scope.minimumSalary
                },{
                    type:'area',
                    name: 'Average Salary',
                    data: $scope.averageSalary
                },{
                    type: 'area',
                    name: 'Risk Of Poverty',
                    data: $scope.riskOfPoverty
                }]
                
            });
            
        });
    });    
        
}]);