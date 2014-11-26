(function() {
    'use strict';

    var app = angular.module('app');

    app.config(function ($stateProvider, $urlRouterProvider, $locationProvider, $injector) {

        $locationProvider.html5Mode(true);

        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: 'app/views/home/partial-home.html',
                onEnter: function() {
                    console.log("Entered state: 'home'");
                }
            });

        $stateProvider
            .state('landing', {
                url: '/landing',
                templateUrl: 'app/views/landing/partial-landing.html',
                onEnter: function() {
                    console.log("Entered state: 'landing'");
                }
            });

        $stateProvider
            .state("signin", {
                url: "/signin",
                onEnter: [
                    '$modal', function ($modal) {
                        console.log("Entered state 'signin'");
                        $modal.open({
                            templateUrl: 'app/dialogs/signin.html',
                            controller: 'signinoutController as vm'
                        });
                    }
                ]
            });

        $stateProvider
            .state("" +
            "register", {
                url: "/register",
                templateUrl: 'app/views/register/partial-register.html',
                onEnter: function() {
                    console.log("Entered state: 'register'");
                }
            });

        //$urlRouterProvider.otherwise("/");
    });
})();