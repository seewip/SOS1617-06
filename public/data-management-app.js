/* global angular */
angular.module("DataManagementApp", ["ngRoute"]).config(function($routeProvider) {
    $routeProvider.when("/", {
            templateUrl: "main.html"
        })
        .when("/analytics", {
            templateUrl: "analytics.html"
        })

    .when("/gdp", {
            templateUrl: "gdp/list.html",
            controller: "GdpListCtrl"
        })
        .when("/gdp/:country/:year", {
            templateUrl: "gdp/edit.html",
            controller: "GdpEditCtrl"
        })
        .when("/gdp/graph", {
            templateUrl: "/gdp/graph.html",
            controller: "GdpGraphCtrl"
        })

    .when("/education", {
            templateUrl: "education/list.html",
            controller: "EducationListCtrl"
        })
        .when("/education/:country/:year", {
            templateUrl: "education/edit.html",
            controller: "EducationEditCtrl"
        })
        .when("/education/graph", {
            templateUrl: "education/graph.html",
        })

    .when("/gdp-per-capita", {
            templateUrl: "gdp-per-capita/list.html",
            controller: "GdpPerCapitaListCtrl"
        })
        .when("/gdp-per-capita/:country/:year", {
            templateUrl: "gdp-per-capita/edit.html",
            controller: "GdpPerCapitaEditCtrl"
        })
        .when("/gdp-per-capita/graph", {
            templateUrl: "gdp-per-capita/graph.html",
        });

    console.log("App initialized and configured");
});
