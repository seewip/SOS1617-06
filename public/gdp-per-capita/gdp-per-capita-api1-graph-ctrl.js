// Author: Jihane Fahri

/* global angular */
/* global Highcharts */

angular
    .module("DataManagementApp")
    .controller("GdpPerCapitaApi1GraphCtrl", ["$scope", "$http", "$rootScope", function($scope, $http, $rootScope) {

        $scope.apikey = "secret";
        $scope.data = {};
        $scope.data1 = {};
        var dataCache = {};
        var dataCache1 = {};
        $scope.country = [];
        $scope.gdp_per_capita_growth = [];
        $scope.gdp_per_capita = [];
        $scope.gdp_per_capita_ppp = [];
        $scope.samplesAicha = [];
        $scope.samplesFrancisco = [];
        $scope.samplesJihane = [];
        $scope.genderAicha = [];
        $scope.genderFrancisco = [];
        $scope.genderJihane = [];
//A
        console.log("A");
        $http.get("/api/v1/gdp-per-capita" + "?" + "apikey=" + $scope.apikey).then(function(response1) {
//B
            console.log("B");
            dataCache1 = response1.data;
            $scope.data1 = dataCache1;

            for (var i = 0; i < response1.data.length; i++) {
                $scope.country.push($scope.data1[i].country);
                $scope.gdp_per_capita_growth.push(Number($scope.data1[i]["gdp-per-capita-growth"]));
                $scope.gdp_per_capita.push(Number($scope.data1[i]["gdp-per-capita"]));
                $scope.gdp_per_capita_ppp.push(Number($scope.data1[i]["gdp-per-capita-ppp"]));
//C
                console.log("C");
                var sigla = "";

                switch ($scope.data1[i].country) {
                    case 'spain':
                        sigla = 'ES'
                        break;
                    case 'morocco':
                        sigla = 'MA'
                        break;
                    case 'poland':
                        sigla = 'PL'
                        break;
                    default:
                        break;
                }
//D
                console.log("D");
                $http.get("https://gender-api.com/get?name=Aicha;Francisco;Jihane&country=" + sigla + "&key=uDcCNztcQfnxsVLBho").then(function(response) {
//E
                    console.log("E");
                    dataCache = response.data;
                    $scope.data = dataCache;

                    $scope.samplesAicha.push(Number($scope.data.result[0]['samples']));
                    $scope.samplesFrancisco.push(Number($scope.data.result[1]['samples']));
                    $scope.samplesJihane.push(Number($scope.data.result[2]['samples']));
                    $scope.genderAicha.push($scope.data.result[0]['gender']);
                    $scope.genderFrancisco.push($scope.data.result[1]['gender']);
                    $scope.genderJihane.push($scope.data.result[2]['gender']);

                    console.log("Controller initialized (GdpPerCapitaApi1GraphCtrl)");

                    // Highchart

                    Highcharts.chart('container', {
                        chart: {
                            type: 'column'
                        },
                        title: {
                            text: 'Gdp Per Capita data integrated with data of Gender Api'
                        },
                        xAxis: {
                            categories: $scope.country,
                            crosshair: true
                        },
                        yAxis: {
                            min: 0,
                            title: {
                                text: 'Values'
                            }
                        },
                        tooltip: {
                            headerFormat: '<span style="font-size:20px">{point.key}</span><table>',
                            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                                '<td style="padding:0"><b>{point.y:.1f} </b></td></tr>',
                            footerFormat: '</table>',
                            shared: true,
                            useHTML: true
                        },
                        plotOptions: {
                            column: {
                                pointPadding: 0.2,
                                borderWidth: 0
                            }
                        },
                        series: [{
                            name: 'gdp per capita',
                            data: $scope.gdp_per_capita

                        }, {
                            name: 'gdp per capita growth',
                            data: $scope.gdp_per_capita_growth

                        }, {
                            name: 'gdp per capita ppp',
                            data: $scope.gdp_per_capita_ppp

                        }, {
                            name: 'samplesAicha',
                            data: $scope.samplesAicha

                        }, {
                            name: 'samplesFrancisco',
                            data: $scope.samplesFrancisco

                        }, {
                            name: 'samplesJihane',
                            data: $scope.samplesJihane

                        }]
                    });
                });
            }
        });
        
    //F
    console.log("F");
    }]);
