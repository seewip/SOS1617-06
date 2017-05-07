/* global angular */

angular.module("DataManagementApp").
controller("GdpPerCapitaGraphCtrl", ["$scope", "$http", "$rootScope", function($scope, $http, $rootScope) {
    console.log("Controller initialized (GdpPerCapitaGraphCtrl)");
    
    if (!$rootScope.apikey) $rootScope.apikey = "secret";
}]);