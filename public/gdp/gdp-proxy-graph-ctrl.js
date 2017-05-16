// 


/*global angular*/
/*global Highcharts*/


angular
    .module("DataManagementApp")
    .controller("GdpProxyGraphCtrl", ["$scope", "$http", function($scope, $http) {

        console.log("GdpProxyGraphCtrl");

        $scope.apikey = "secret";
        $scope.data = {};
        var dataCache = {};
        $scope.country = [];
        $scope.year = [];
        $scope.gdp = [];
        $scope.gdp_growth = [];
        $scope.gdp_deflator = [];
        $scope.province = [];
        $scope.priceaceite = [];
        $scope.pricevirgen = [];
        $scope.priceextra = [];



        function capitalizeFirstLetter(string) {
            console.log("Captitalizing string: "+string);
            return string.charAt(0).toUpperCase() + string.slice(1);
        }



        $http
            .get("https://sos1617-04.herokuapp.com/api/v2/price-stats?apikey=12345")
            .then(function(response) {
                dataCache = response.data;
                $scope.data = dataCache;

                for (var i = 0; i < response.data.length; i++) {
                    $scope.country.push(capitalizeFirstLetter($scope.data[i].province) + " " + $scope.data[i].year);
                    $scope.year.push(($scope.data[i].year));
                    $scope.priceaceite.push(Number($scope.data[i].priceaceite));
                    $scope.pricevirgen.push(Number($scope.data[i].pricevirgen));
                    $scope.priceextra.push(Number($scope.data[i].priceextra));
                    $scope.gdp.push(null);
                    $scope.gdp_growth.push(null);
                    $scope.gdp_deflator.push(null);

                    //console.log($scope.data[i].province);
                    //console.log(JSON.stringify($scope.priceaceite, null, 2));

                }
                console.log(JSON.stringify($scope.country, null, 2));

                $http.get("/api/v1/gdp/" + "?" + "apikey=" + $scope.apikey).then(function(response) {

                    dataCache = response.data;
                    $scope.data = dataCache;

                    for (var i = 0; i < response.data.length; i++) {
                        $scope.country.push(capitalizeFirstLetter($scope.data[i].country) + " " + $scope.data[i].year);
                        //$scope.year.push(Number($scope.data[i].year));
                        $scope.gdp.push(Number($scope.data[i].gdp));
                        $scope.gdp_growth.push(Number($scope.data[i].gdp_growth));
                        $scope.gdp_deflator.push(Number($scope.data[i].gdp_deflator));
                        $scope.priceaceite.push(null);
                        $scope.priceextra.push(null);
                        $scope.pricevirgen.push(null);

                        console.log($scope.data[i].country);
                    }
                    Highcharts.chart('container', {
                        title: {
                            text: 'Highcharts'
                        },
                        chart: {
                            type: 'area'
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
                                    capitalizeFirstLetter(this.x) + ': ' + this.y;
                            }
                        },
                        series: [{
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
                        }, {
                            name: 'Integration with G04 Price of Olive oil in Andalussian',
                            data: $scope.priceaceite
                        }]



                    });



                });
            });

    }]);
