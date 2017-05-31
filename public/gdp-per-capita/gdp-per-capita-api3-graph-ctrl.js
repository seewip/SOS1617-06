/* global angular */
/* global Highcharts */

angular
    .module("DataManagementApp")
    .controller("GdpPerCapitaApi3GraphCtrl", ["$scope", "$http", "$rootScope", function($scope, $http, $rootScope) {

        $scope.apikey = "secret";
        $scope.data = {};
        $scope.data1 = {};
        $scope.data2 = {};
        var dataCache = {};
        var dataCache1 = {};
        var dataCache2 = {};
        $scope.country = [];
        $scope.gdp_per_capita_growth = [];
        $scope.accuracy = [];


        $http.get("/api/v1/gdp-per-capita" + "?" + "apikey=" + $scope.apikey).then(function(response1) {

            dataCache1 = response1.data;
            $scope.data1 = dataCache1;

            for (var i = 0; i < response1.data.length; i++) {
                $scope.country.push($scope.data1[i].country);
                $scope.gdp_per_capita_growth.push(Number($scope.data1[i]["gdp-per-capita-growth"]));

                var id = "";

                $http.get("https://marquisdegeek.com/api/country/?name=" + $scope.data1[i].country).then(function(response) {

                    dataCache = response.data;
                    $scope.data = dataCache;

                    id = $scope.data[0]["id"];
                
                    $http.get("https://marquisdegeek.com/api/country/?id=" + id).then(function(response2) {
                        dataCache2 = response2.data;
                        $scope.data2 = dataCache2;

                        $scope.accuracy.push(Number($scope.data2[0]["accuracy"]));

                        console.log("Controller initialized (GdpPerCapitaApi3GraphCtrl)");

                        // Highchart

                        Highcharts.chart('container', {
                            chart: {
                                type: 'area'
                            },
                            title: {
                                text: ''
                            },
                            xAxis: {
                                categories: $scope.country,
                                tickmarkPlacement: 'on',
                                title: {
                                    text: ''
                                }
                            },
                            yAxis: {
                                title: {
                                    text: ''
                                }
                            },
                            tooltip: {
                                split: true,
                                valueSuffix: ''
                            },
                            plotOptions: {
                                area: {
                                    stacking: 'normal',
                                    lineColor: '#666666',
                                    lineWidth: 1,
                                    marker: {
                                        lineWidth: 1,
                                        lineColor: '#666666'
                                    }
                                }
                            },
                            series: [{
                                name: 'accuracy',
                                data: $scope.accuracy
                            }, {
                                name: 'gdp_per_capita_growth',
                                data: $scope.gdp_per_capita_growth
                            }]
                        });

                    });
                });
            }
        });
    }]);
