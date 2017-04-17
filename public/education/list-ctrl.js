/* global angular */
/* global Materialize */
/* global $ */
var previousPage;
var nextPage;
var setPage;

angular.module("EducationManagerApp").
controller("ListCtrl", ["$scope", "$http", function($scope, $http) {
    console.log("Controller initialized");

    $scope.apikey = "secret";
    $scope.search = {};
    $scope.searchAdd = {};

    var dataCache = {};
    $scope.currentPage = 1;
    $scope.maxPages = 1;
    $scope.pages = [];

    var elementsPerPage = 5;

    function setPagination() {
        $scope.pages = [];
        for (var i = 1; i <= $scope.maxPages; i++) $scope.pages.push(i);
    }

    $scope.setPage = function(page) {
        $scope.currentPage = page;
        $scope.refreshPage();
    };

    $scope.previousPage = function() {
        $scope.currentPage--;
        $scope.refreshPage();
    };

    $scope.nextPage = function() {
        $scope.currentPage++;
        $scope.refreshPage();
    };

    $scope.refreshPage = function() {
        if ($scope.currentPage <= 0) $scope.currentPage = 1;
        if ($scope.currentPage > $scope.maxPages) $scope.currentPage = $scope.maxPages;
        setPagination();
        $scope.data = dataCache.slice(Number(($scope.currentPage - 1) * elementsPerPage), Number(($scope.currentPage) * elementsPerPage));
    };

    var refresh = $scope.refresh = function() {

        var modifier = "";
        var properties = "";
        if ($scope.search.country && $scope.search.year) {
            modifier = "/" + $scope.search.country + "/" + $scope.search.year;
        }
        else if ($scope.search.country) {
            modifier = "/" + $scope.search.country;
        }
        else if ($scope.search.year) {
            modifier = "/" + $scope.search.year;
        }
        for (var prop in $scope.searchAdd) {
            if ($scope.searchAdd.hasOwnProperty(prop) && prop) {
                properties += prop + "=" + $scope.searchAdd[prop] + "&";
            }
        }

        $http
            .get("../api/v1/education" + modifier + "?" + "apikey=" + $scope.apikey + "&" + properties)
            .then(function(response) {
                //console.log("GET: " + "../api/v1/education" + modifier + "?" + "apikey=" + $scope.apikey + "&" + properties);
                $scope.maxPages = Math.max(Math.ceil(response.data.length / elementsPerPage), 1);
                dataCache = response.data;
                $scope.refreshPage();
            }, function(response) {
                Materialize.toast('<i class="material-icons">error_outline</i> Error getting data!', 4000);
            });
    }


    $scope.addData = function() {
        $http
            .post("../api/v1/education" + "?" + "apikey=" + $scope.apikey, $scope.newData)
            .then(function(response) {
                console.log("Data added!");
                Materialize.toast('<i class="material-icons">done</i> ' + $scope.newData.country + ' has been added succesfully!', 4000);
                refresh();
            }, function(response) {
                Materialize.toast('<i class="material-icons">error_outline</i> Error adding data!', 4000);
            });
    };

    $scope.editDataModal = function(data) {
        data["oldCountry"] = data["country"];
        data["oldYear"] = data["year"];
        $scope.editDataUnit = data;
        $('#editModal').modal('open');
    };

    $scope.editData = function(data) {

        var oldCountry = data.oldCountry;
        var oldYear = data.oldYear;
        delete data._id;
        delete data.oldCountry;
        delete data.oldYear;

        data.year = Number(data.year);
        $http
            .put("../api/v1/education/" + oldCountry + "/" + oldYear + "?" + "apikey=" + $scope.apikey, data)
            .then(function(response) {
                console.log("Data " + data.country + " edited!");
                Materialize.toast('<i class="material-icons">done</i> ' + oldCountry + ' has been edited succesfully!', 4000);
                refresh();
            }, function(response) {
                Materialize.toast('<i class="material-icons">error_outline</i> Error editing data!', 4000);
                refresh();
            });
    };

    $scope.delData = function(data) {
        $http
            .delete("../api/v1/education/" + data.country + "/" + data.year + "?" + "apikey=" + $scope.apikey)
            .then(function(response) {
                console.log("Data " + data.country + " deleted!");
                Materialize.toast('<i class="material-icons">done</i> ' + data.country + ' has been deleted succesfully!', 4000);
                refresh();
            }, function(response) {
                Materialize.toast('<i class="material-icons">error_outline</i> Error deleting data!', 4000);
            });
    };

    $scope.delAllData = function() {
        $http
            .delete("../api/v1/education" + "?" + "apikey=" + $scope.apikey)
            .then(function(response) {
                console.log("All data deleted!");
                Materialize.toast('<i class="material-icons">done</i> All data has been deleted succesfully!', 4000);
                refresh();
            }, function(response) {
                Materialize.toast('<i class="material-icons">error_outline</i> Error deleting all data!', 4000);
            });
    };

    $scope.loadInitialData = function() {
        refresh();
        if ($scope.data.length == 0) {
            $http
                .get("../api/v1/education/loadInitialData" + "?" + "apikey=" + $scope.apikey)
                .then(function(response) {
                    console.log("Initial data loaded");
                    Materialize.toast('<i class="material-icons">done</i> Loaded initial data succesfully!', 4000);
                    refresh();
                }, function(response) {
                    Materialize.toast('<i class="material-icons">error_outline</i> Error adding initial data!', 4000);
                });
        }
        else {
            Materialize.toast('<i class="material-icons">error_outline</i> List must be empty to add initial data!', 4000);
            console.log("List must be empty!");
        }
    };

    refresh();

    $(document).ready(function() {
        $('.modal').modal({
            ready: function(modal, trigger) {
                Materialize.updateTextFields();
            },
            complete: function() {
                refresh();
            }
        });
        $(".button-collapse").sideNav();
        $(".dropdown-button").dropdown();
    });
}]);
