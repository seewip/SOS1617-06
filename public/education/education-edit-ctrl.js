/* global angular */
/* global Materialize */
var previousPage;
var nextPage;
var setPage;

angular.module("DataManagementApp").
controller("EducationEditCtrl", ["$scope", "$http", "$routeParams", "$location", "$rootScope", function($scope, $http, $routeParams, $location, $rootScope) {
    console.log("Controller initialized (EducationEditCtrl)");

    if (!$rootScope.apikey) $rootScope.apikey = "secret";

    function refresh() {
        $http
            .get("../api/v1/education/" + $routeParams.country + "/" + $routeParams.year + "?" + "apikey=" + $rootScope.apikey)
            .then(function(response) {
                $scope.editDataUnit = response.data[0];
            }, function(response) {
                switch (response.status) {
                    case 401:
                        Materialize.toast('<i class="material-icons">error_outline</i> Error getting data - api key missing!', 4000);
                        break;
                    case 403:
                        Materialize.toast('<i class="material-icons">error_outline</i> Error getting data - api key incorrect!', 4000);
                        break;
                    case 404:
                        Materialize.toast('<i class="material-icons">error_outline</i> Error getting data - data not found!', 4000);
                        break;
                    default:
                        Materialize.toast('<i class="material-icons">error_outline</i> Error getting data!', 4000);
                        break;
                }
            });
    }

    $scope.discardData = function() {
        console.log("Discarding changes and returning back to main view");
        $location.path('/education');
    };

    $scope.editData = function(data) {
        $http
            .put("../api/v1/education/" + data.country + "/" + data.year + "?" + "apikey=" + $rootScope.apikey, data)
            .then(function(response) {
                console.log("Data " + data.country + " edited!");
                Materialize.toast('<i class="material-icons">done</i> ' + data.country + ' has been edited succesfully!', 4000);
                $location.path('/education');
            }, function(response) {
                switch (response.status) {
                    case 400:
                        Materialize.toast('<i class="material-icons">error_outline</i> Error editing data - incorrect data was typed!', 4000);
                        break;
                    case 401:
                        Materialize.toast('<i class="material-icons">error_outline</i> Error getting data - api key missing!', 4000);
                        break;
                    case 403:
                        Materialize.toast('<i class="material-icons">error_outline</i> Error getting data - api key incorrect!', 4000);
                        break;
                    default:
                        Materialize.toast('<i class="material-icons">error_outline</i> Error editing data!', 4000);
                        break;
                }
            });
    };

    refresh();
}]);
