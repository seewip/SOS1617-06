/* global Highcharts */
/* global angular */
angular
    .module("DataManagementApp")
    .controller("GdpRemoteGraphCtrl",["$scope","$http",function ($scope, $http){
        
        $scope.apikey = "secret";
        $scope.data = {};
        var dataCache = {};
      
        
        $scope.minimumSalary= [];
        $scope.averageSalary = [];
        $scope.riskOfPoverty = [];
        
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
                $scope.minimumSalary.push(null);
                $scope.averageSalary.push(null);
                $scope.riskOfPoverty.push(null);
                
                console.log($scope.data[i].country);
            }
        });
        
        $http.get("https://sos1617-07.herokuapp.com/api/v1/salaries/?apikey=sos07").then(function(response){
            
            dataCache = response.data;
            $scope.data = dataCache;
            
            for(var i=0; i<response.data.length; i++){
                
                if($scope.country.indexOf(capitalizeFirstLetter($scope.data[i].country) + " " + $scope.data[i].year)==-1){
                    $scope.country.push(capitalizeFirstLetter($scope.data[i].country) + " " + $scope.data[i].year);
                    $scope.year.push(null);
                    $scope.gdp.push(null);
                    $scope.gdp_growth.push(null);
                    $scope.gdp_deflator.push(null);
                    $scope.minimumSalary.push(Number($scope.data[i].minimumSalary));
                    $scope.averageSalary.push(Number($scope.data[i].averageSalary));
                    $scope.riskOfPoverty.push(Number($scope.data[i].riskOfPoverty));
                
                    console.log($scope.data[i].country);
                    
                }else{
                    var index = $scope.country.indexOf(capitalizeFirstLetter(capitalizeFirstLetter($scope.data[i].country) + " " + $scope.data[i].year));
                    $scope.minimumSalary.push(index,1,Number($scope.data[i].minimumSalary));
                    $scope.averageSalary.push(index,1,Number($scope.data[i].averageSalary));
                    $scope.riskOfPoverty.push(index,1,Number($scope.data[i].riskOfPoverty));
                }
            }
        });
            
        console.log("Controller initialized");
        $http.get("https://sos1617-07.herokuapp.com/api/v1/salaries/?apikey=sos07").then(function(response){
            
            
            Highcharts.chart('container', {
                chart: {
                    type: 'spline'
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
                    name: 'Minimum Salary',
                    data: $scope.minimumSalary
                },{
                    name: 'Average Salary',
                    data: $scope.averageSalary
                },{
                    name: 'Risk Of Poverty',
                    data: $scope.riskOfPoverty
                }]
                
            });
            
        });
    }]);