

/*global angular*/
/*global Highcharts*/


angular
    .module("DataManagementApp")
    .controller("GdpProxyGraphGoogleCtrl", ["$scope", "$http", function($scope, $http) {

        console.log("GdpProxyGraphGoogleCtrl");

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
        text: 'Chart Generated with Integration of Google Maps Api'
    },
    xAxis: {
        categories: $scope.country
    },
    labels: {
        items: [{
            html: 'Total Gdp consumption Showing in Map',
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
        name: 'Integration with Google Maps Api',
        data: $scope.priceaceite,
        marker: {
            lineWidth: 2,
            lineColor: Highcharts.getOptions().colors[3],
            fillColor: 'white'
        }
    }, {
        type: 'pie',
        name: 'Total consumption',
        data: [{
            name: 'Jane',
            y: 13,
            color: Highcharts.getOptions().colors[0] // Jane's color
        }, {
            name: 'John',
            y: 23,
            color: Highcharts.getOptions().colors[1] // John's color
        }, {
            name: 'Joe',
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






