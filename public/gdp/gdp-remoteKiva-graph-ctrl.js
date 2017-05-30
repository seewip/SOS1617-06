/* global Highcharts */
/* global angular */
angular
    .module("DataManagementApp")
    .controller("GdpRemoteKivaGraphCtrl",["$scope","$http", "$rootScope",function ($scope, $http ,$rootScope){
        
        $scope.apikey = "secret";
        $scope.data = {};
        var dataCache = {};
        $scope.country = [];
        $scope.year = [];
        $scope.gdp = [];
        $scope.gdp_growth = [];
        $scope.gdp_deflator = [];
      
        $scope.lender_id= [];
        $scope.name = [];
        $scope.uid = [];
        
        function capitalizeFirstLetter(string) {
                return string.charAt(0).toUpperCase() + string.slice(1);
            }
        
        
        
        
        $http.get("https://api.kivaws.org/v1/lenders/search.json").then(function(response){
            
            dataCache = response.data;
            $scope.data = dataCache;
            
            console.log(response);
            
            for(var i=0; i<response.data.length; i++){
                
                
                    $scope.lender_id.push(Number($scope.data[i].lender_id));
                    $scope.name.push(Number($scope.data[i].name));
                    $scope.uid.push(Number($scope.data[i].uid));
                
                    console.log($scope.data[i].country);
                    
                
            }
            $http.get("/api/v1/gdp/"+ "?" + "apikey=" + $scope.apikey).then(function(response){
            
                dataCache = response.data;
                $scope.data = dataCache;
            
                for(var i=0; i<response.data.length; i++){
                    $scope.country.push(capitalizeFirstLetter($scope.data[i].country) + " " +Number($scope.data[i].year) );
                    $scope.year.push(Number($scope.data[i].year));
                    $scope.gdp.push(Number($scope.data[i].gdp));
                    $scope.gdp_growth.push(Number($scope.data[i].gdp_growth));
                    $scope.gdp_deflator.push(Number($scope.data[i].gdp_deflator));
            
                
                
            }console.log("Controller initialized (GdpRemoteKivaGraphCtrl)");
        
                
                Highcharts.chart('container', {

    chart: {
        type: 'column'
    },

    title: {
        text: 'Integration GDP by Education with KIVA API'
    },

    xAxis: {
        categories: $scope.country
    },

    yAxis: {
        allowDecimals: false,
        min: 0,
        title: {
            text: 'Number of students'
        }
    },

    tooltip: {
        formatter: function () {
            return '<b>' + this.x + '</b><br/>' +
               capitalizeFirstLetter( this.series.name )+ ': ' + this.y + '<br/>' +
                'Total: ' + this.point.stackTotal;
        }
    },

    plotOptions: {
        column: {
            stacking: 'normal'
        }
    },

    series: [{
        name: 'Lender',
        data: $scope.lender_id,
        //stack: 'male'
    }, {
        name: 'Uid',
        data: [$scope.uid],
        //stack: 'male'
    }, {
        name: 'Year',
        data: [$scope.year],
        //stack: 'female'
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
                
                
            //     Highcharts.chart('container', {
            //     chart: {
            //         type: 'area'
            //     },
            //     title: {
            //         text: 'Highcharts'
            //     },
            //     subtitle: {
            //         text: 'Source: G07 - SALARIES'
            //     },
            //     xAxis: {
            //         categories: $scope.country
            //     },
            //     yAxis: {
            //         title: {
            //             text: 'Values'
            //         },
            //         labels: {
            //             formatter: function () {
            //                 return this.value + '%';
            //             }
            //         }
            //     },
            //     tooltip: {
            //         crosshairs: true,
            //         shared: true
            //     },
            //     plotOptions: {
            //         spline: {
            //             marker: {
            //                 radius: 4,
            //                 lineColor: '#666666',
            //                 lineWidth: 1
            //             },
            //             dataLabels: {
            //                 enabled: true
            //             }
            //         },
            //         series: {
            //             connectNulls: true
            //         }
            //     },
            //     series:[{
            //         name: 'Year',
                    
            //         data: $scope.year
            //     }, {
            //         name: 'Gdp',
                   
            //         data: $scope.gdp
            //     }, {
            //         name: 'Gdp_Growth',
                    
            //         data: $scope.gdp_growth
            //     }, {
            //         name: 'Gdp_Deflator',
                    
            //         data: $scope.gdp_deflator
            //     },{
            //         type: 'area',
            //         name: 'Minimum Salary',
            //         data: $scope.minimumSalary
            //     },{
            //         type:'area',
            //         name: 'Average Salary',
            //         data: $scope.averageSalary
            //     },{
            //         type: 'area',
            //         name: 'Risk Of Poverty',
            //         data: $scope.riskOfPoverty
            //     }]
                
            // });
            
        });
    });    
        
}]);