/* global angular */
/* global Highcharts */

angular
    .module("DataManagementApp")
    .controller("GdpPerCapitaApi2GraphCtrl", ["$scope", "$http", "$rootScope", function($scope, $http, $rootScope) {

        $scope.apikey = "secret";
        $scope.data = {};
        $scope.data1 = {};
        $scope.data2 = {};
        var dataCache = {};
        var dataCache1 = {};
        $scope.year = [];
        $scope.gdp_per_capita_growth = [];
        $scope.league = [];
        $scope.numberOfTeams = [];
        $scope.numberOfGames = [];


        $http.get("/api/v1/gdp-per-capita" + "?" + "apikey=" + $scope.apikey).then(function(response1) {

            dataCache1 = response1.data;
            $scope.data1 = dataCache1;

            for (var i = 0; i < response1.data.length; i++) {
                $scope.gdp_per_capita_growth.push(Number($scope.data1[i]["gdp-per-capita-growth"]));
                $scope.year.push(Number($scope.data1[i]["year"]));


                $http.get("/proxyApi2/gdp-per-capita" + "?"  + "apikey=" + $scope.apikey).then(function(response) {

                    dataCache = response.data;
                    $scope.data = dataCache;
                    
                    $scope.league.push($scope.data[i]["league"]);
                    $scope.numberOfGames.push(Number($scope.data[i]["numberOfGames"]));
                    $scope.numberOfTeams.push(Number($scope.data[i]["numberOfTeams"]));
                    console.log($scope.league);
                    console.log("Controller initialized (GdpPerCapitaApi2GraphCtrl)");

                    // Highchart

                    Highcharts.chart('container', {

                        chart: {
                            type: 'column'
                        },

                        title: {
                            text: ''
                        },

                        xAxis: {
                            categories: $scope.league
                        },

                        yAxis: {
                            allowDecimals: false,
                            min: 0,
                            title: {
                                text: ''
                            }
                        },

                        tooltip: {
                            formatter: function() {
                                return '<b>' + this.x + '</b><br/>' +
                                    this.series.name + ': ' + this.y + '<br/>' +
                                    'Total: ' + this.point.stackTotal;
                            }
                        },

                        plotOptions: {
                            column: {
                                stacking: 'normal'
                            }
                        },

                        series: [{
                            name: 'numberOfTeams',
                            data: $scope.numberOfTeams
                        }, {
                            name: 'numberOfGames',
                            data: $scope.numberOfGames
                        }, {
                            name: 'gdp_per_capita_growth',
                            data: $scope.gdp_per_capita_growth
                        }]
                    });
                });

            }
        });
    }]);
