/* global Highcharts */
/* global angular */
angular
    .module("DataManagementApp")
    .controller("GdpRemoteKivaGraphCtrl",["$scope","$http", "$rootScope",function ($scope, $http ,$rootScope){
        
        $scope.apikey = "secret";
        $scope.data = {};
        var dataCache = {};
        var newdataCache = {};
        $scope.country = [];
        $scope.year = [];
        $scope.gdp = [];
        $scope.gdp_growth = [];
        $scope.gdp_deflator = [];
        
        var array = [];
        $scope.lender_id= [];
        $scope.name = [];
        $scope.uid = [];
        
        function capitalizeFirstLetter(string) {
                return string.charAt(0).toUpperCase() + string.slice(1);
            }
        
        
        
        
        $http.get("https://api.kivaws.org/v1/lenders/search.json").then(function(response){
            
            newdataCache = response.data;
            $scope.data = newdataCache;
            
            console.log(response);
            
            for(var i=0; i<response.data.length; i++){
                
                
                    array.push(Number(response.data[i].lender_id));
                    array.push(Number(response.data[i].name));
                    array.push(Number(response.data[i].uid));
                
                    console.log(response.data[i].lender_id);
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
        type: 'area'
    },
    title: {
        text: 'Gdp API Integrated with data From KIVA API'
    },
    subtitle: {
        text: 'Source:https://api.kivaws.org'
    },
    xAxis: {
        categories: $scope.country,
        tickmarkPlacement: 'on',
        title: {
            enabled: false
        }
    },
    yAxis: {
        title: {
            text: 'Education'
        }
    },
    tooltip: {
        pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.percentage:.1f}%</b> ({point.y:,.0f} millions)<br/>',
        split: true
    },
    plotOptions: {
        area: {
            stacking: 'percent',
            lineColor: '#ffffff',
            lineWidth: 1,
            marker: {
                lineWidth: 1,
                lineColor: '#ffffff'
            }
        }
    },
    series: [{
        name: 'Gdp',
        data: [$scope.gdp]
    }, {
        name: 'Gdp_Growth',
        data: [$scope.gdp_growth]
    }, {
        name: 'Gdp_Growth',
        data: [$scope.gdp_deflator]
    }, {
        name: 'Data Integrated',
        data: [$scope.uid]
    }]
});
                
});
    });    
        
}]);