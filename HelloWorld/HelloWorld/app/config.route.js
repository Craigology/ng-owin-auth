(function() {
    'use strict';

    var app = angular.module('app');

    app.config(function($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/landing');

        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: 'app/views/home/partial-home.html'
            });


        $stateProvider
            .state('landing', {
                url: '/landing',
                templateUrl: 'app/views/landing/partial-landing.html'
            });


        $stateProvider
            .state("signIn", {
                url: "/signIn",
                onEnter: [
                    '$modal', function($modal) {
                        $modal.open({
                            templateUrl: 'app/dialogs/signin.html',
                            controller: 'signinoutController as vm'
                        });
                    }
                ]
            });
    });
})();