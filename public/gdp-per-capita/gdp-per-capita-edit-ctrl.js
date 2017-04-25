/* global angular */
/* global Materialize */
var previousPage;
var nextPage;
var setPage;

angular.module("DataManagementApp").
controller("GdpPerCapitaEditCtrl", ["$scope", "$http", "$routeParams", "$location", function($scope, $http, $routeParams, $location) {
    console.log("Controller initialized (GdpPerCapitaEditCtrl)");
    
    var apikey = "secret";

    function refresh() {
        $http
            .get("../api/v1/gdp-per-capita/" + $routeParams.country + "/" + $routeParams.year + "?" + "apikey=" + apikey)
            .then(function(response) {
                $scope.editDataUnit = response.data;
            });
    }
    
    $scope.discardData = function() {
        console.log("Discarding changes and returning back to main view");
        $location.path('/gdp-per-capita');
    };
    
    $scope.editData = function() {
        console.log("Unimplemented!");
    };

    /* $scope.editData = function(data) {

        var oldCountry = data.oldCountry;
        var oldYear = data.oldYear;
        delete data._id;
        delete data.oldCountry;
        delete data.oldYear;

        data.year = Number(data.year);
        $http
            .put("../api/v1/gdp-per-capita/" + oldCountry + "/" + oldYear + "?" + "apikey=" + $scope.apikey, data)
            .then(function(response) {
                console.log("Data " + data.country + " edited!");
                Materialize.toast('<i class="material-icons">done</i> ' + oldCountry + ' has been edited succesfully!', 4000);
                refresh();
            }, function(response) {
                Materialize.toast('<i class="material-icons">error_outline</i> Error editing data!', 4000);
                refresh();
            });
    };
    
    $scope.updateContact = function(contact) {
         $http
             .put("api/v1/contacts/" + $routeParams.name, contact)
             .then(function(response) {
                 console.log("Contact " + contact.name + " edited!");
                 $location.path("/");
             });
    };*/

    refresh();
}]);