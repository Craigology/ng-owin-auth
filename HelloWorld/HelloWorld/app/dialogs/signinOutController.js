(function() {
    'use strict';

    angular.module('app').controller("signinoutController", ['$scope', '$rootScope', '$http', "$q", "$modal", "toast", "localStorageService", "authService", "usSpinnerService", signinoutController]);

    function signinoutController($scope, $rootScope, $http, $q, $modal, toast, $localStorageService, $authService, usSpinnerService) {
        var vm = this;

        vm.cancel = cancel;
        vm.username = $localStorageService.get('recentUsername');
        vm.password = "";
        vm.isBusy = false;

        vm.signIn = function () {

            vm.isBusy = true;
            usSpinnerService.spin('spinner-local-submit-button');

            $authService
                .login({ userName: vm.username, password: vm.password })
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

        vm.signOut = function () {

            vm.isBusy = true;
            usSpinnerService.spin('spinner-local-submit-button');

            $authService.logOut();

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

