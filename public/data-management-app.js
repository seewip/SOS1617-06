// Authors: Cristina Leal Echevarria, Jihane Fahri, Mateusz Dominik

/* global angular */
angular.module("DataManagementApp", ["ngRoute", "chart.js"]).config(function($routeProvider) {
    $routeProvider.when("/", {
            templateUrl: "main.html"
        })
        .when("/integrations", {
            templateUrl: "integrations.html"
        })
        .when("/analytics", {
            templateUrl: "analytics.html",
            controller: "AnalyticsCtrl"
        })
        .when("/about", {
            templateUrl: "about.html"
        })
        .when("/governance", {
            templateUrl: "governance.html"
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
        .when("/gdp/remoteKiva", {
            templateUrl: "gdp/remoteKiva.html",
            controller: "GdpRemoteKivaGraphCtrl"
        })
        .when("/gdp/proxyGraph", {
            templateUrl: "gdp/proxyGraph.html",
            controller: "GdpProxyGraphCtrl"
        })
        .when("/gdp/proxyPopulation", {
            templateUrl: "gdp/proxyPopulation.html",
            controller: "GdpProxyPopulationCtrl"
        })
        .when("/gdp/proxyExchangeRates", {
            templateUrl: "gdp/proxyExchangeRates.html",
            controller: "GdpProxyExchangeRatesCtrl"
        })
        .when("/gdp/proxyRestCountries", {
            templateUrl: "gdp/proxyRestCountries.html",
            controller: "GdpProxyRestCountriesCtrl"
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
        .when("/education/externalTwitterGraph", {
            templateUrl: "education/externalTwitterGraph.html",
            controller: "EducationExternalTwitterGraphCtrl"
        })
        .when("/education/externalHearthstoneGraph", {
            templateUrl: "education/externalHearthstoneGraph.html",
            controller: "EducationExternalHearthstoneGraphCtrl"
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
        })
        .when("/gdp-per-capita/proxyApi1Graph", {
            templateUrl: "gdp-per-capita/proxyApi1Graph.html",
            controller: "GdpPerCapitaApi1GraphCtrl"
        })
        .when("/gdp-per-capita/proxyApi2Graph", {
            templateUrl: "gdp-per-capita/proxyApi2Graph.html",
            controller: "GdpPerCapitaApi2GraphCtrl"
        })
        .when("/gdp-per-capita/proxyApi3Graph", {
            templateUrl: "gdp-per-capita/proxyApi3Graph.html",
            controller: "GdpPerCapitaApi3GraphCtrl"
        })
        .when("/gdp-per-capita/proxyApi4Graph", {
            templateUrl: "gdp-per-capita/proxyApi4Graph.html",
            controller: "GdpPerCapitaApi4GraphCtrl"
        });

    console.log("App initialized and configured");
});
