/* global angular */
angular.module("DataManagementApp", ["ngRoute", "chart.js"]).config(function($routeProvider) {
    $routeProvider.when("/", {
            templateUrl: "main.html"
        })
        .when("/analytics", {
            templateUrl: "analytics.html"
        })
        .when("/about", {
            templateUrl: "about.html"
        })
        .when("/governance", {
            templateUrl: "governance.html"
        })
        .when("/about", {
            templateUrl: "integrations.html"
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
        .when("/gdp/remoteGraph", {
            templateUrl: "gdp/remoteGraph.html",
            controller: "GdpRemoteGraphCtrl"
        })
        .when("/gdp/remoteUnemployment", {
            templateUrl: "gdp/remoteUnemployment.html",
            controller: "GdpRemoteUnemploymentGraphCtrl"
        })
        .when("/gdp/proxyGraph", {
            templateUrl: "gdp/proxyGraph.html",
            controller: "GdpProxyGraphCtrl"
        })
        .when("/gdp/proxyExchangeRates", {
            templateUrl: "gdp/proxyExchangeRates.html",
            controller: "GdpProxyExchangeRatesCtrl"
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
            controller: "EducationGraphCtrl"
        })
        .when("/education/remoteGraph", {
            templateUrl: "education/remoteGraph.html",
            controller: "EducationRemoteGraphCtrl"
        })
        .when("/education/proxyGraph", {
            templateUrl: "education/proxyGraph.html",
            controller: "EducationProxyGraphCtrl"
        })
        .when("/education/externalFacebookGraph", {
            templateUrl: "education/externalFacebookGraph.html",
            controller: "EducationExternalFacebookGraphCtrl"
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
            controller: "GdpPerCapitaGraphCtrl"
        })
        .when("/gdp-per-capita/remoteGraph", {
            templateUrl: "gdp-per-capita/remoteGraph.html",
            controller: "GdpPerCapitaRemoteGraphCtrl"
        })
        .when("/gdp-per-capita/proxyGraph", {
            templateUrl: "gdp-per-capita/proxyGraph.html",
            controller: "GdpPerCapitaProxyGraphCtrl"
        });

    console.log("App initialized and configured");
});
