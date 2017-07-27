// Author: Cristina Leal Echevarria

/*global angular*/
/*global Highcharts*/


angular
    .module("DataManagementApp")
    .controller("GdpProxyExchangeRatesCtrl", ["$scope", "$http", "$rootScope", function($scope, $http, $rootScope) {

        console.log("GdpProxyExchangeRatesCtrl");

        $scope.apikey = "secret";

        $scope.data = {};
        $scope.data1 = {};

        var dataCache = {};
        var dataCache1 = {};

        $scope.country = [];
        $scope.year = [];
        $scope.gdp = [];
        $scope.gdp_growth = [];
        $scope.gdp_deflator = [];
        $scope.ratesX = [];
        $scope.ratesY = [];
        $scope.ratesName = [];

        function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }


        $http
            .get("https://api.fixer.io/latest")
            .then(function(response) {

                dataCache1 = response.data;
                $scope.data = dataCache1;

                console.log(response.data.rates);

                //response.data.rates.forEach(function(object) {
                for (var object in response.data.rates) {

                    $scope.ratesX.push(response.data.date);
                    $scope.ratesY.push(response.data.rates[object]);
                    $scope.ratesName.push(object);

                    // $scope.base.push(Array(String(object.base)));
                    // $scope.date.push(String(object.date));
                    // $scope.rates.push(String(Number(object.rates)));

                    $scope.gdp.push(null);
                    $scope.gdp_growth.push(null);
                    $scope.gdp_deflator.push(null);

                    // console.log($scope.data[i].date);
                    // console.log(JSON.stringify($scope.date, null, 2));
                    console.log(object + " = " + response.data.rates[object]);
                }


                $http.get("/api/v1/gdp/" + "?" + "apikey=" + $scope.apikey).then(function(response) {

                    dataCache = response.data;
                    $scope.data1 = dataCache;

                    console.log(response);

                    for (var i = 0; i < response.data.length; i++) {
                        $scope.country.push(capitalizeFirstLetter($scope.data1[i].country) + " " + $scope.data1[i].year);
                        //$scope.year.push(Number($scope.data[i].year));
                        $scope.gdp.push(Number($scope.data1[i].gdp));
                        $scope.gdp_growth.push(Number($scope.data1[i].gdp_growth));
                        $scope.gdp_deflator.push(Number($scope.data1[i].gdp_deflator));
                        $scope.ratesName.push(null);
                        $scope.ratesX.push(null);
                        $scope.ratesY.push(null);


                        console.log($scope.data1[i].country);
                    }
                    Highcharts.chart('container', {
                        title: {
                            text: 'Chart Generated with Integration of Exange Rates'
                        },
                        xAxis: {
                            categories: $scope.country
                        },
                        labels: {
                            items: [{
                                html: 'Total Gdp consumption Showing with Exchange Rates',
                                style: {
                                    left: '50px',
                                    top: '18px',
                                    color: (Highcharts.theme && Highcharts.theme.textColor) || 'black'
                                }
                            }]
                        },
                        series: [{
                            type: 'column',
                            name: 'Gdp',
                            data: $scope.gdp
                        }, {
                            type: 'column',
                            name: 'Gdp_Growth',
                            data: $scope.gdp_growth
                        }, {
                            type: 'column',
                            name: 'Gdp_Deflator',
                            data: $scope.gdp_deflator
                        }, {
                            type: 'spline',
                            name: 'Integration with Exchange Rates Api',
                            data: [$scope.ratesY],
                            marker: {
                                lineWidth: 2,
                                lineColor: Highcharts.getOptions().colors[3],
                                fillColor: 'orange'
                            }
                        }, {
                            type: 'pie',
                            name: 'Total consumption Between Gdp and Exchange Rates',
                            data: [{
                                name: '',
                                y: 13,
                                color: Highcharts.getOptions().colors[0] // Jane's color
                            }, {
                                name: 'Coin',
                                y: 23,
                                color: Highcharts.getOptions().colors[1] // John's color
                            }, {
                                name: 'Country',
                                y: 19,
                                color: Highcharts.getOptions().colors[2] // Joe's color
                            }],
                            center: [100, 80],
                            size: 100,
                            showInLegend: false,
                            dataLabels: {
                                enabled: false
                            }
                        }]
                    });



                });
            });

    }]);
