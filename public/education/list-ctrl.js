/* global angular */
/* global Materialize */
/* global $ */
var previousPage;
var nextPage
var setPage;

angular.module("EducationManagerApp").
controller("ListCtrl", ["$scope", "$http", function($scope, $http) {
    console.log("Controller initialized");

    $scope.apikey = "secret";
    $scope.search = {};
    $scope.searchAdd = {};

    var currentPage = 1;
    var maxPages = 1;

    var elementsPerPage = 5;

    function setPagination() {
        $('#pagination_div').empty();
        if (currentPage == 1) {
            $('#pagination_div').append('<li class="disabled"><a href="#"><i class="material-icons">chevron_left</i></a></li>');
        }
        else {
            $('#pagination_div').append('<li class="waves-effect"><a href="#" onclick="previousPage()"><i class="material-icons">chevron_left</i></a></li>');
        }

        for (var i = 1; i <= maxPages; i++) {
            if (currentPage == i) {
                $('#pagination_div').append('<li class="active"><a href="#" onclick="setPage(' + i + ')">' + i + '</a></li>');
            }
            else {
                $('#pagination_div').append('<li class="waves-effect"><a href="#" onclick="setPage(' + i + ')">' + i + '</a></li>');
            }
        }

        if (currentPage == maxPages) {
            $('#pagination_div').append('<li class="disabled"><a href="#"><i class="material-icons">chevron_right</i></a></li>');
        }
        else {
            $('#pagination_div').append('<li class="waves-effect"><a href="#" onclick="nextPage()"><i class="material-icons">chevron_right</i></a></li>');
        }
    }

    setPage = function(page) {
        currentPage = page;
        if (currentPage <= 0) currentPage = 1;
        if (currentPage > maxPages) currentPage = maxPages;
        refresh();
    };

    previousPage = function() {
        currentPage--;
        if (currentPage <= 0) currentPage = 1;
        refresh();
    };

    nextPage = function() {
        currentPage++;
        if (currentPage > maxPages) currentPage = maxPages;
        refresh();
    };

    function refresh() {

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
                maxPages = Math.ceil(response.data.length / elementsPerPage);
                if (currentPage <= 0) currentPage = 1;
                if (currentPage > maxPages) currentPage = maxPages;
                setPagination();
                $scope.data = response.data.slice(Number((currentPage - 1) * elementsPerPage), Number((currentPage) * elementsPerPage));
                //$scope.data = response.data;
                //console.log("Data count: " + response.data.length);
                //console.log("Max pages: " + maxPages);
                //console.log("Current page: " + currentPage);
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
                    Materialize.toast('<i class="material-icons">done</i> Loaded inital data succesfully!', 4000);
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
    });
}]);
