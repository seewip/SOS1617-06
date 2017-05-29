

/*global angular*/
/*global Highcharts*/


angular
    .module("DataManagementApp")
    .controller("GdpProxyExchangeRatesCtrl", ["$scope", "$http", function($scope, $http) {

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
        $scope.timestamp= [];
        $scope.source1 = [];
        $scope.quotes = [];
        $scope.privacy =[];



        function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }



        $http
            .get("https://api.fixer.io/latest?symbols=USD,GBP")
            .then(function(response) {
                console.log(response);
                dataCache = response.data;
                $scope.data = dataCache;

                for (var i = 0; i < response.data.length; i++) {
                    $scope.country.push(capitalizeFirstLetter($scope.data[i].province) + " " + $scope.data[i].year);
                    $scope.year.push(($scope.data[i].year));
                    $scope.privacy.push(Number($scope.data[i].priceaceite));
                    $scope.timestamp.push(Number($scope.data[i].pricevirgen));
                    $scope.source1.push(String($scope.data[i].priceextra));
                    $scope.quotes.push(Number($scope.data[i].priceextra));
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
                        $scope.country.push(capitalizeFirstLetter($scope.data1[i].country) + " " + $scope.data1[i].year);
                        //$scope.year.push(Number($scope.data[i].year));
                        $scope.gdp.push(Number($scope.data1[i].gdp));
                        $scope.gdp_growth.push(Number($scope.data1[i].gdp_growth));
                        $scope.gdp_deflator.push(Number($scope.data1[i].gdp_deflator));
                        $scope.privacy.push(null);
                        $scope.timestamp.push(null);
                        $scope.source1.push(null);
                        $scope.quotes.push(null);

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
        data: [$scope.source1],
        marker: {
            lineWidth: 2,
            lineColor: Highcharts.getOptions().colors[3],
            fillColor: 'white'
        }
    }, {
        type: 'pie',
        name: 'Total consumption Between Gdp and Exchange Rates',
        data: [{
            name: 'Gdp',
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






