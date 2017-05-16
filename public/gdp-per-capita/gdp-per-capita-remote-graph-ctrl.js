/* global angular */
/* global Highcharts */
/* global c3 */

angular
    .module("DataManagementApp")
    .controller("GdpPerCapitaRemoteGraphCtrl", ["$scope", "$http", "$rootScope", function($scope, $http, $rootScope) {

        $scope.apikey = "secret";
        $scope.data = {};
        var dataCache = {};
        var dataCacheEcs = {};
        $scope.country = [];
        $scope.year = [];
        $scope.gdp_per_capita_growth = [];
        $scope.gdp_per_capita = [];
        $scope.gdp_per_capita_ppp = [];
        $scope.province = [];
        // $scope.year = [];
        $scope.pp = [];
        $scope.podemos = [];
        $scope.psoe = [];
        $scope.cs = [];

        $http.get("https://sos1617-05.herokuapp.com/api/v1/elections-voting-stats?apikey=cinco").then(function(response) {

            dataCacheEcs = response.data;
            $scope.data = dataCacheEcs;

            for (var i = 0; i < response.data.length; i++) {
                $scope.province.push($scope.data[i].province);
                //$scope.year.push(Number($scope.data[i].year));
                $scope.pp.push(Number($scope.data[i].pp));
                $scope.podemos.push(Number($scope.data[i].podemos));
                $scope.psoe.push(Number($scope.data[i].psoe));
                $scope.cs.push(Number($scope.data[i].cs));
            }
            
            $http.get("/api/v1/gdp-per-capita" + "?" + "apikey=" + $scope.apikey).then(function(response) {
                dataCache = response.data;
                $scope.data = dataCache;

                for (var i = 0; i < response.data.length; i++) {
                    $scope.country.push($scope.data[i].country);
                    $scope.year.push(Number($scope.data[i].year));
                    $scope.gdp_per_capita_growth.push(Number($scope.data[i]["gdp-per-capita-growth"]));
                    $scope.gdp_per_capita.push(Number($scope.data[i]["gdp-per-capita"]));
                    $scope.gdp_per_capita_ppp.push(Number($scope.data[i]["gdp-per-capita-ppp"]));

                }

                console.log("Controller initialized (GdpPerCapitaRemoteGraphCtrl)");

                //Highchart 

                Highcharts.chart('container', {
                    chart: {
                        plotBackgroundColor: null,
                        plotBorderWidth: 0,
                        plotShadow: false
                    },
                    title: {
                        text: 'Integrated<br>data',
                        align: 'center',
                        verticalAlign: 'middle',
                        y: 40
                    },
                    tooltip: {
                        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                    },
                    plotOptions: {
                        pie: {
                            dataLabels: {
                                enabled: true,
                                distance: -50,
                                style: {
                                    fontWeight: 'bold',
                                    color: 'white'
                                }
                            },
                            startAngle: -90,
                            endAngle: 90,
                            center: ['50%', '75%']
                        }
                    },
                    series: [{
                        type: 'pie',
                        innerSize: '50%',
                        data: [
                            ['pp', $scope.pp.reduce((a, b) => a + b, 0)],
                            ['podemos', $scope.podemos.reduce((a, b) => a + b, 0)],
                            ['psoe', $scope.psoe.reduce((a, b) => a + b, 0)],
                            ['cs', $scope.cs.reduce((a, b) => a + b, 0)],
                            ['gdp per capita growth', $scope.gdp_per_capita_growth.reduce((a, b) => a + b, 0)], 
                        ]
                    }]
                });


            });

        });
    }]);
