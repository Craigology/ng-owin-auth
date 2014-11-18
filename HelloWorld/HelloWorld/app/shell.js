(function() {
    'use strict';

    angular.module('app').controller("shell", ['$scope', '$rootScope', '$http', "$q", "$log", "$modal", "$state", "toastService", "authService", "$urlRouter", "$location", shell]);

    function shell($scope, $rootScope, $http, $q, $log, $modal, $state, toastServicetoast, $authService, $urlRouter, $location) {
        var vm = this;

        vm.signin = signin;
        vm.signout = signout;
        vm.someAuthenticatedApi = someAuthenticatedApi;
        vm.username = "";

        $rootScope.isLoggedIn = false;
        $scope.isLoggedIn = false;
        vm.isLoggedIn = false;

        $scope.$on('loggedIn', function (event, username) {
            $log.log("Shell received loggedIn event");
            $scope.isLoggedIn = true;
            $rootScope.isLoggedIn = true;
            vm.isLoggedIn = true;
            vm.username = username;
            toastService.success(username + ' logged in.');

            $state.go('home', {}, { reload: true });
        });

        $scope.$on('loggedOut', function (event) {
            $log.log("Shell received loggedOut event");
            $scope.isLoggedIn = false;
            $rootScope.isLoggedIn = false;
            vm.isLoggedIn = false;

            vm.username = null;

            $state.go('landing', {},  { reload: true });
        });

        $authService.checkForExistingToken();
        if ($authService.authentication.isAuth == true) {
            $authService.broadcastSignIn();
        }
        else {
            $log.log("Shell checkForExistingToken() isAuth=" + $authService.authentication.isAuth);
            $authService.broadcastSignOut();
        };

        $scope.$on('$viewContentLoading', function (event, viewConfig) {
            $authService.checkForExistingToken();

            if ($authService.authentication.isAuth == true) {

                if ($location.$$url === "/landing") {
                    // stop the change!
                    event.preventDefault();
                    $state.go("home");
                }
            }

            if ($authService.authentication.isAuth == false) {

                if ($location.$$url === "/home") {
                    // stop the change!
                    event.preventDefault();

                    $state.go("landing");
                }
            }
        });

        (function activate() {

            });

            function signin() {
                $modal.open({
                    templateUrl: 'app/dialogs/signin.html',
                    controller: 'signinoutController as vm'
                });
            }

            function signout() {
                $modal.open({
                    templateUrl: 'app/dialogs/signout.html',
                    controller: 'signinoutController as vm'
                });
            }

            function someAuthenticatedApi() {

                var deferred = $q.defer();

                $http.get('/someAuthenticatedApi').success(function(response) {
                    deferred.resolve(response);
                }).error(function(err, status) {
                    deferred.reject(err);
                });

                return deferred.promise;
            };
        }
})();
