/* global angular */
/* global Materialize */
/* global $ */
/* global google */
/* global Highcharts */

angular.module("DataManagementApp").
controller("EducationRemoteGraphCtrl", ["$scope", "$http", "$rootScope", function($scope, $http, $rootScope) {
    console.log("Controller initialized (EducationRemoteGraphCtrl)");

    if (!$rootScope.apikey) $rootScope.apikey = "secret";

    // $scope.refresh = function() {
    //     $http
    //         .get("../api/v1/education" + "?" + "apikey=" + $rootScope.apikey)
    //         .then(function(response) {

    //             var years = [];
    //             var countries = [];

    //             response.data.forEach(function(d) {
    //                 if (years.indexOf(Number(d.year)) == -1) years.push(Number(d.year));
    //                 if (countries.indexOf(d.country) == -1) countries.push(d.country);
    //             });
    //             years.sort((a, b) => a - b);

    //             var countriesData = [];

    //             countries.forEach(function(d) {
    //                 var c = {
    //                     name: d,
    //                     data: []
    //                 };
    //                 years.forEach(function(e) {
    //                     c.data.push(0);
    //                 });
    //                 countriesData.push(c);
    //             });

    //             response.data.forEach(function(d) {
    //                 countriesData.forEach(function(e) {
    //                     if (d.country === e.name) {
    //                         e.data[years.indexOf(Number(d.year))] = Number(d['education-gdp-perc']);
    //                     }
    //                 });
    //             });

    //             // HighCharts
    //             var hc = {
    //                 chart: {
    //                     type: 'column'
    //                 },
    //                 title: {
    //                     text: 'Spendings on education'
    //                 },
    //                 xAxis: {
    //                     categories: [],
    //                     crosshair: true
    //                 },
    //                 yAxis: {
    //                     min: 0,
    //                     title: {
    //                         text: 'GDP (%)'
    //                     }
    //                 },
    //                 tooltip: {
    //                     headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
    //                     pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
    //                         '<td style="padding:0"><b>{point.y:.1f}%</b></td></tr>',
    //                     footerFormat: '</table>',
    //                     shared: true,
    //                     useHTML: true
    //                 },
    //                 plotOptions: {
    //                     column: {
    //                         pointPadding: 0.2,
    //                         borderWidth: 0
    //                     }
    //                 },
    //                 series: []
    //             };

    //             hc.xAxis.categories = years;
    //             hc.series = countriesData;

    //             Highcharts.chart('hc_column', hc);

    //             // Google Charts - Geochart
    //             google.charts.load('current', {
    //                 'packages': ['controls', 'geochart']
    //             });
    //             google.charts.setOnLoadCallback(drawRegionsMap);

    //             function drawRegionsMap() {
    //                 var chartData = [
    //                     ['country', 'education-gdp-perc', 'year']
    //                 ];

    //                 response.data.forEach(function(x) {
    //                     chartData.push([x.country, Number(x['education-gdp-perc']), Number(x.year)]);
    //                 });

    //                 var data = google.visualization.arrayToDataTable(chartData);

    //                 var options = {
    //                     colorAxis: {
    //                         colors: ['red', 'yellow', 'green']
    //                     }
    //                 };

    //                 var dashboard = new google.visualization.Dashboard(document.getElementById('dashboard'));

    //                 var yearSelector = new google.visualization.ControlWrapper({
    //                     controlType: 'CategoryFilter',
    //                     containerId: 'filter',
    //                     options: {
    //                         filterColumnIndex: 2,
    //                         ui: {
    //                             allowTyping: false,
    //                             allowMultiple: false,
    //                             allowNone: false
    //                         }
    //                     }
    //                 });

    //                 var chart = new google.visualization.ChartWrapper({
    //                     chartType: 'GeoChart',
    //                     containerId: 'map',
    //                     options: {
    //                         colorAxis: {
    //                             colors: ['red', 'yellow', 'green']
    //                         }
    //                     }
    //                 });

    //                 dashboard.bind(yearSelector, chart);
    //                 dashboard.draw(data, options);
    //             }

    //             //Angular-Chart
    //             $scope.labels = years;
    //             $scope.series = countries;
    //             $scope.data = [];
    //             countriesData.forEach(function(e) {
    //                 $scope.data.push(e.data);
    //             });
    //             $scope.datasetOverride = [{
    //                 yAxisID: 'y-axis-1'
    //             }];
    //             $scope.options = {
    //                 scales: {
    //                     yAxes: [{
    //                         id: 'y-axis-1',
    //                         type: 'linear',
    //                         display: true,
    //                         position: 'left'
    //                     }]
    //                 }
    //             };

    //         }, function(response) {
    //             switch (response.status) {
    //                 case 401:
    //                     Materialize.toast('<i class="material-icons">error_outline</i> Error getting data - api key missing!', 4000);
    //                     break;
    //                 case 403:
    //                     Materialize.toast('<i class="material-icons">error_outline</i> Error getting data - api key incorrect!', 4000);
    //                     break;
    //                 case 404:
    //                     Materialize.toast('<i class="material-icons">error_outline</i> No data found!', 4000);
    //                     break;
    //                 default:
    //                     Materialize.toast('<i class="material-icons">error_outline</i> Error getting data!', 4000);
    //                     break;
    //             }
    //         });
    // };

    // $scope.refresh();

}]);
