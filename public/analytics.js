/*global angular*/
/* global Highcharts */
angular
    .module("DataManagementApp")
    .controller("AnalyticsCtrl",["$scope","$http","$rootScope",function ($scope, $http,$rootScope){
        
        console.log("Chart Controller initialized");
    
        $scope.apikey = "secret";
        $scope.data = {};
        var dataCache = {};
         $scope.country = [];
         $scope.country1 = [];
         $scope.year = [];
         $scope.gdp = [];
         $scope.gdp_growth = [];
         $scope.gdp_deflator = [];
         $scope.gdp_per_capita_growth = [];
         $scope.gdp_per_capita = [];
         $scope.gdp_per_capita_ppp = [];
        
         
         $http.get("/api/v1/gdp/"+ "?" + "apikey=" + $scope.apikey).then(function(response){
             dataCache = response.data;
             $scope.data = dataCache;
             
             for(var i=0; i<response.data.length; i++){
                $scope.country.push($scope.data[i].country + " " + $scope.data[i].year);
                $scope.year.push(Number($scope.data[i].year));
                $scope.gdp.push(Number($scope.data[i].gdp));
                $scope.gdp_growth.push(Number($scope.data[i].gdp_growth));
                $scope.gdp_deflator.push(Number($scope.data[i].gdp_deflator));
                
                console.log($scope.data[i].country);
             }
             


         });

                console.log("Controller intialized");
                $http
                    .get("/api/v1/gdp/"+ "?" + "apikey=" + $scope.apikey)
                    .then(function(response) {
                        console.log("hola" + response.data);
                        
                        
                $http
                    .get("../api/v1/education" + "?" + "apikey=" + $scope.apikey)
                    .then(function(response){
                        
                             
                var years = [];
                var countries = [];

                response.data.forEach(function(d) {
                    if (years.indexOf(Number(d.year)) == -1) years.push(Number(d.year));
                    if (countries.indexOf(d.country) == -1) countries.push(d.country);
                });
                years.sort((a, b) => a - b);

                var countriesData = [];

                countries.forEach(function(d) {
                    var c = {
                        name: d,
                        data: []
                    };
                    years.forEach(function(e) {
                        c.data.push(0);
                    });
                    countriesData.push(c);
                });

                response.data.forEach(function(d) {
                    countriesData.forEach(function(e) {
                        if (d.country === e.name) {
                            e.data[years.indexOf(Number(d.year))] = Number(d['education-gdp-perc']);
                        }
                    });
                });
                        
                        
                        
                        
                  
                $http
                    .get("/api/v1/gdp-per-capita" + "?" + "apikey=" + $scope.apikey)
                    .then(function(response){
                                     dataCache = response.data;
            $scope.data = dataCache;

            for (var i = 0; i < response.data.length; i++) {
                $scope.country.push($scope.data[i].country);
                $scope.year.push(Number($scope.data[i].year));
                $scope.gdp_per_capita_growth.push(Number($scope.data[i]["gdp-per-capita-growth"]));
                $scope.gdp_per_capita.push(Number($scope.data[i]["gdp-per-capita"]));
                $scope.gdp_per_capita_ppp.push(Number($scope.data[i]["gdp-per-capita-ppp"]));
            }
            
             $scope.categoriasTotal = $scope.country.concat($scope.country1);
             $scope.categoriasTotal = $scope.categoriasTotal.concat($scope.countries);
                        console.log($scope.country);
                        console.log($scope.country1);
                        console.log($scope.countries);
                        console.log($scope.categoriasTotal);
                    Highcharts.chart('analyticschart', {
                                chart: {
                                    type: 'column'
                                },
                                title: {
                                    text: 'GDP API + EDUCATION API + GDP PER CAPITA API'
                                },
                                xAxis: {

                                    categories: $scope.categoriasTotal
                                
                                },
                                yAxis: {
                                    min: 0,
                                    title: {
                                        text: 'Comparison Expenditure on public education between three countries'
                                    },
                                    stackLabels: {
                                        enabled: true,
                                        style: {
                                            fontWeight: 'bold',
                                            color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                                        }
                                    }
                                },
                                legend: {
                                    align: 'right',
                                    x: -30,
                                    verticalAlign: 'top',
                                    y: 25,
                                    floating: true,
                                    backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
                                    borderColor: '#CCC',
                                    borderWidth: 1,
                                    shadow: false
                                },
                                tooltip: {
                                    headerFormat: '<b>{point.x}</b><br/>',
                                    pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
                                },
                                plotOptions: {
                                    column: {
                                        stacking: 'normal',
                                        dataLabels: {
                                            enabled: true,
                                            color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'
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
                                    name : 'Gdp Per Capita',
                                    data: $scope.gdp_per_capita
                                },{
                                    name : 'Gdp Per Capita Growth ',
                                    data: $scope.gdp_per_capita_growth
                                }, {
                                    name : 'Gdp Per Capita PPP',
                                    data: $scope.gdp_per_capita_ppp
                                }, {
                                    name : 'Education Gdp Per Capita',
                                    data: $scope.data
                                }]
                            });
                        
                    });
                    });
                    });
            }]);
