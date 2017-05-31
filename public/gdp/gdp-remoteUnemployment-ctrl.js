/* global Highcharts */
/* global angular */
angular
    .module("DataManagementApp")
    .controller("GdpRemoteUnemploymentGraphCtrl", ["$scope", "$http", "$rootScope", function($scope, $http, $rootScope) {

        $scope.apikey = "secret";
        $scope.data = {};
        var dataCache = {};

        $scope.country = [];
        $scope.year = [];
        $scope.gdp = [];
        $scope.gdp_growth = [];
        $scope.gdp_deflator = [];

        $scope.Id = [];
        $scope.FK_Vaiable = [];
        $scope.Nombre = [];
        $scope.Codigo = [];



        function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }




        $http.get("https://servicios.ine.es/wstempus/js/ES/VALORES_VARIABLEOPERACION/141/293?page=1").
        then(function(response) {

            dataCache = response.data;
            $scope.data = dataCache;

            console.log(response.data);

            response.data.forEach(function(data) {
                $scope.Id.push(Number(data.Id));
                $scope.FK_Vaiable.push(Number(data.Fk_Variable));
                $scope.Nombre.push(String(data.Nombre));
                $scope.Codigo.push(String(data.Codigo));


                console.log(data.Fk_Variable);
            });

            // for(var i=0; i<response.data.length; i++){


            //         $scope.Id.push(Number($scope.data[i].id));
            //         $scope.FK_Vaiable.push(Number($scope.data[i].FK_Vaiable));
            //         $scope.Nombre.push(String($scope.data[i].Nombre));
            //         $scope.Codigo.push(String($scope.data[i].Codigo));


            //         console.log($scope.data[i].FK_Vaiable);


            // }
            $http.get("/api/v1/gdp/" + "?" + "apikey=" + $scope.apikey).then(function(response) {

                dataCache = response.data;
                $scope.data = dataCache;
                console.log(response);
                for (var i = 0; i < response.data.length; i++) {
                    $scope.country.push(capitalizeFirstLetter($scope.data[i].country) + " " + $scope.data[i].year);
                    $scope.year.push(Number($scope.data[i].year));
                    $scope.gdp.push(Number($scope.data[i].gdp));
                    $scope.gdp_growth.push(Number($scope.data[i].gdp_growth));

                    console.log($scope.data[i].country);


                }
                console.log("Controller initialized (GdpRemoteUnemploymentGraphCtrl)");

                Highcharts.chart('container', {
                    chart: {
                        type: 'area'
                    },
                    title: {
                        text: 'Gdp Api Integrated with data from INE about unemployment'
                    },
                    subtitle: {
                        text: 'Source: Junta de Andalucia'
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
                            text: 'Values'
                        },
                        labels: {
                            formatter: function() {
                                return this.value / 1000;
                            }
                        }
                    },
                    tooltip: {
                        split: true,
                        valueSuffix: ' values'
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
                        name: 'Gdp',
                        data: $scope.gdp
                    }, {
                        name: 'Gdp_Growth',
                        data: $scope.gdp_growth
                    }, {
                        name: 'Gdp_Deflator',
                        data: $scope.gdp_deflator
                    }, {
                        name: 'Integration with weather',
                        data: $scope.Id
                    }]
                });


            });
        });

    }]);
