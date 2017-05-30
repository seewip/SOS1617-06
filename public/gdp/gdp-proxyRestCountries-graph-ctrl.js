
/*global angular*/
/*global Highcharts*/


angular
    .module("DataManagementApp")
    .controller("GdpProxyRestCountriesCtrl", ["$scope", "$http","$rootScope", function($scope, $http,$rootScope) {

        console.log("GdpProxyRestCountriesCtrl");

        $scope.apikey = "secret";
        $scope.data = {};
        var dataCache = {};
        $scope.data1 = {};
        var dataCache1 = {};
        $scope.country = [];
        $scope.year = [];
        $scope.gdp = [];
        $scope.gdp_growth = [];
        $scope.gdp_deflator = [];
        $scope.name = [];
        $scope.region = [];
        $scope.capital = [];
        $scope.currencies = [];

        // function capitalizeFirstLetter(string) {
        //     return string.charAt(0).toUpperCase() + string.slice(1);
        // }



        $http
            .get("https://restcountries.eu/rest/v2/name/spain")
            .then(function(response) {
                dataCache = response.data;
                $scope.data = dataCache;
                
                console.log(response);
                
                for (var i = 0; i < response.data.length; i++) {
                    $scope.country.push(String($scope.data[i].country) + " " +Number($scope.data[i].year) );
                    //$scope.year.push(($scope.data[i].year));
                    $scope.name.push(Number($scope.data[i].name));
                    $scope.region.push(Number($scope.data[i].region));
                    $scope.capital.push(Number($scope.data[i].capital));
                    $scope.currencies.push(Number($scope.data[i].currencies));
                    $scope.gdp.push(null);
                    $scope.gdp_growth.push(null);
                    $scope.gdp_deflator.push(null);

                    //console.log($scope.data[i].province);
                    //console.log(JSON.stringify($scope.priceaceite, null, 2));

                }
                console.log(JSON.stringify($scope.country, null, 2));

                $http.get("/api/v1/gdp/" + "?" + "apikey=" + $scope.apikey).then(function(response) {

                    dataCache1 = response.data;
                    $scope.data1 = dataCache1;

                    for (var i = 0; i < response.data.length; i++) {
                        $scope.country.push(String($scope.data1[i].country) + " " + Number($scope.data1[i].year));
                        //$scope.year.push(Number($scope.data[i].year));
                        $scope.gdp.push(Number($scope.data1[i].gdp));
                        $scope.gdp_growth.push(Number($scope.data1[i].gdp_growth));
                        $scope.gdp_deflator.push(Number($scope.data1[i].gdp_deflator));
                        $scope.name.push(null);
                        $scope.region.push(null);
                        $scope.capital.push(null);
                        $scope.currencies.push(null);

                        console.log($scope.data1[i].country);
                    }
                    Highcharts.chart('container', {
                        title: {
                            text: 'Highcharts'
                        },
                        chart: {
                            type: 'spline'
                        },
                        xAxis: {
                            categories: $scope.country
                        },
                        legend: {
                            layout: 'vertical',
                            floating: true,
                            backgroundColor: '#FFFFFF',
                            //align: 'left',
                            verticalAlign: 'top',
                            align: 'right',
                            y: 60,
                            x: -60
                        },
                        tooltip: {
                            formatter: function() {
                                return '<b>' + this.series.name + '</b><br/>' +
                                    ': ' + this.y;
                            }
                        },
                        series: [ {
                            name: 'Gdp',
                            data: $scope.gdp
                        }, {
                            name: 'Gdp_Growth',
                            data: $scope.gdp_growth
                        }, {
                            name: 'Gdp_Deflator',
                            data: $scope.gdp_deflator
                        }, {
                            name: 'Integration with RestCountries',
                            data: $scope.region
                        }]



                    });



                });
            });

    }]);
