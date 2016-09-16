﻿(function(){
    var taskAngular = angular.module('taskAngular', ['ngRoute']);

        taskAngular.config(function ($routeProvider) {

            $routeProvider
                .when("/home", {
                    templateUrl: "views/home.html",
                    controller: "homeController"
                })
                .when("/invoices", {
                    templateUrl: "views/invoices.html",
                    controller: "invoicesController"
                })
                .when("/newinvoice", {
                    templateUrl: "views/newInvoice.html",
                    controller: "newInvoiceController"
                })
                .when("/customers", {
                    templateUrl: "views/customers.html",
                    controller: "customersController"
                })

                .when("/login", {
                    templateUrl: "views/login.html",
                    controller: "loginController"
                })
                .otherwise({ redirectTo: "/home" });
        })
    /*
    .run(function ($rootScope, $location) {
            $rootScope.$on("$routeChangeStart", function (event, next, current) {
                if (!authenticated) {
                    if (next.templateUrl != "views/login.html")
                        $location.path("/login");
                }
            })
        });
   */
    
}());