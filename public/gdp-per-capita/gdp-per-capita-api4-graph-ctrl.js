// Author: Jihane Fahri

/* global angular */
/* global Highcharts */

angular
    .module("DataManagementApp")
    .controller("GdpPerCapitaApi4GraphCtrl", ["$scope", "$http", "$rootScope", function($scope, $http, $rootScope) {

        $scope.apikey = "secret";
        $scope.data = {};
        $scope.data1 = {};
        var dataCache = {};
        var dataCache1 = {};
        $scope.country = [];
        $scope.gdp_per_capita_growth = [];
        $scope.lat = [];
        $scope.long = [];

        $http.get("/api/v1/gdp-per-capita" + "?" + "apikey=" + $scope.apikey).then(function(response1) {

            dataCache1 = response1.data;
            $scope.data1 = dataCache1;

            for (var i = 0; i < response1.data.length; i++) {
                $scope.country.push($scope.data1[i].country);
                $scope.gdp_per_capita_growth.push(Number($scope.data1[i]["gdp-per-capita-growth"]));


                $http.get("https://travelbriefing.org/" + $scope.data1[i].country + "?format=json").then(function(response) {

                    dataCache = response.data;
                    $scope.data = dataCache;

                    $scope.lat.push(Number($scope.data.maps['lat']));
                    $scope.long.push(Number($scope.data.maps['long']));

                    console.log("Controller initialized (GdpPerCapitaApi4GraphCtrl)");

                    // Highchart
                    Highcharts.chart('container', {
                        chart: {
                            type: 'column'
                        },
                        title: {
                            text: 'Column chart with negative values'
                        },
                        xAxis: {
                            categories: $scope.country
                        },
                        credits: {
                            enabled: false
                        },
                        series: [{
                            name: 'gdp per capita growth',
                            data: $scope.gdp_per_capita_growth
                        }, {
                            name: 'latitude',
                            data: $scope.lat
                        }, {
                            name: 'longitude',
                            data: $scope.long
                        }]
                    });
                });
            }
        });
    }]);
