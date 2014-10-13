(function() {
    'use strict';

    angular.module('app').controller("authController", ['$scope', '$rootScope', '$http', "$q", "$modal", "toast", "localStorageService", "authService", "usSpinnerService", authController]);

    function authController($scope, $rootScope, $http, $q, $modal, toast, $localStorageService, $authService, usSpinnerService) {
        var vm = this;

        vm.cancel = cancel;
        vm.username = $localStorageService.get('recentUsername');
        vm.password = "";
        vm.isBusy = false;

        vm.signin = function () {

            vm.isBusy = true;
            usSpinnerService.spin('spinner-local-submit-button');

            $authService
                .signin({ userName: vm.username, password: vm.password })
                .then(function(response) {

                    $rootScope.isLoggedIn = true;
                    $rootScope.token = response;
                    
                    $localStorageService.set('recentUsername', $rootScope.token.userName);

                    $scope.$close(true);

                }, function (error) {
                    toast.error('Failed to login, reason: ' + error);
                }).finally(function () {
                    usSpinnerService.stop('spinner-local-submit-button');
                    vm.isBusy = false;
                });
        };

        vm.signout = function () {

            vm.isBusy = true;
            usSpinnerService.spin('spinner-local-submit-button');

            $authService.signout();

            $rootScope.isLoggedIn = true;
            $rootScope.token = null;

            vm.username = null;

            usSpinnerService.stop('spinner-local-submit-button');
            vm.isBusy = false;

            $scope.$close(true);
        };

        function cancel() {
            $scope.$close(false);
        }
    }
})();

