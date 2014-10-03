(function() {
    'use strict';

    angular.module('app').controller("signinoutController", ['$scope', '$rootScope', '$http', "$q", "$modal", "toast", "localStorageService", "authService", signinoutController]);

    function signinoutController($scope, $rootScope, $http, $q, $modal, toast, $localStorageService, $authService) {
        var vm = this;

        $scope.isBusy = false;

        vm.cancel = cancel;
        vm.username = $localStorageService.get('recentUsername');
        vm.password = "";

        vm.signIn = function () {
            $scope.isBusy = true;
            $authService
                .login({ userName: vm.username, password: vm.password })
                .then(function(response) {
                    $rootScope.isLoggedIn = true;
                    $scope.$close(true);
                    vm.token = response;
                    vm.username = vm.token.userName;
                    $localStorageService.set('recentUsername', vm.username);
                    $rootScope.$broadcast('loggedIn', vm.username);

                }, function (error) {
                    toast.error('Failed to login, reason: ' + error);
                }).finally(function () {
                    $scope.isBusy = false;
                });
        };

        vm.signOut = function () {

            $scope.isBusy = true;
            $authService.logOut();

            $rootScope.isLoggedIn = false;
            $scope.$close(true);
            vm.token = null;
            vm.username = null;
            $rootScope.$broadcast('loggedOut');
            $scope.isBusy = false;
        };

        function cancel() {
            $scope.$close(false);
        }
    }
})();

