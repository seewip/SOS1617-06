/*global angular*/

angular
    .module("DataManagementApp")
    .controller("GdpProxyGraphCtrl", ["$scope", "$http", function($scope, $http) {
            console.log("Graph Controller initialized");

            $scope.apikey = "secret";
            var categoriesH = [];
            var dataS = [];
            var dataM = [];
            var dataCa = [];
            var dataG = [];
            var dataCo = [];
            var dataA = [];
            var dataJ = [];
            var dataH = [];

            $scope.sta = [];

            $scope.data = {};
            var dataCache = {};
            $scope.country = [];
            $scope.year = [];
            $scope.gdp = [];
            $scope.gdp_growth = [];
            $scope.gdp_deflator = [];

          

            function sortResults(prop, asc) {
                $scope.sta = $scope.sta.sort(function(a, b) {
                    if (asc) {
                        return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
                    }
                    else {
                        return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
                    }
                });
            }

            /////PRICE OF OLIVE OIL IN ANDALUSSIAN/////
            $http.get("https://sos1617-04.herokuapp.com/api/v2/price-stats?apikey=12345").then(function(response) {
                    $scope.sta = response.data;
                    sortResults('year', true);
                    var cat = [];
                    for (var i in $scope.sta) {
                        cat.push($scope.sta[i].year);
                        switch ($scope.sta[i].province) {
                            case "sevilla":
                                dataS.push(parseInt($scope.sta[i].pricevirgen));
                                break;
                            case "malaga":
                                dataM.push(parseInt($scope.sta[i].pricevirgen));
                                break;
                            case "cadiz":
                                dataCa.push(parseInt($scope.sta[i].pricevirgen));
                                break;
                            case "granada":
                                dataG.push(parseInt($scope.sta[i].pricevirgen));
                                break;
                            case "cordoba":
                                dataCo.push(parseInt($scope.sta[i].pricevirgen));
                                break;
                            case "almeria":
                                dataA.push(parseInt($scope.sta[i].pricevirgen));
                                break;
                            case "huelva":
                                dataH.push(parseInt($scope.sta[i].pricevirgen));
                                break;
                            case "sevilla":
                                dataS.push(parseInt($scope.sta[i].pricevirgen));
                                break;
                        }


                        /////GDP EXPENDITURE ON PUBLIC EDUCATION/////


                        console.log("Controller initialized");

                         function capitalizeFirstLetter(string) {
                            return string.charAt(0).toUpperCase() + string.slice(1);
                        }

                        $http.get("/api/v1/gdp/" + "?" + "apikey=" + $scope.apikey).then(function(response) {
                                dataCache = response.data;
                                $scope.data = dataCache;

                                for (var i = 0; i < response.data.length; i++) {

                                    $scope.country.push(capitalizeFirstLetter($scope.data[i].country) + " " + $scope.data[i].year);
                                    $scope.year.push(Number($scope.data[i].year));
                                    $scope.gdp.push(Number($scope.data[i].gdp));
                                    $scope.gdp_growth.push(Number($scope.data[i].gdp_growth));
                                    $scope.gdp_deflator.push(Number($scope.data[i].gdp_deflator));


                                    console.log($scope.data[i].country);
                                }
                                    /*global Highcharts*/
                                    Highcharts.chart('container', {
                                        title: {
                                            text: 'Highcharts'
                                        },
                                        chart: {
                                            type: 'area'
                                        },
                                        xAxis: {
                                            categories: $scope.country,
                                            categorias: categoriesH
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
                                                    this.x + ': ' + this.y;
                                            }

                                        },
                                        series: [{
                                            name: 'Country',
                                            data: $scope.country
                                        }, {
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
                                            name: 'sevilla',
                                            data: dataS
                                        }, {
                                            name: 'malaga',
                                            data: dataM
                                        }, {
                                            name: 'cadiz',
                                            data: dataCa
                                        }, {
                                            name: 'granada',
                                            data: dataG
                                        }, {
                                            name: 'cordoba',
                                            data: dataCo
                                        }, {
                                            name: 'almeria',
                                            data: dataA
                                        }, {
                                            name: 'jaen',
                                            data: dataJ
                                        }, {
                                            name: 'huelva',
                                            data: dataH
                                        }]
                                    });
                                });
                        }
                    });

            }]);