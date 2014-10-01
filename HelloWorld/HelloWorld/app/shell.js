(function() {
    'use strict';

    angular.module('app').controller("shell", ['$scope', '$rootScope', '$http', "$q", "$modal", "toast", "authService", shell]);

    function shell($scope, $rootScope, $http, $q, $modal, toast, $authService) {
        var vm = this;

        vm.signIn = signIn;
        vm.signOut = signOut;
        vm.foo = foo;
        vm.username = "";

        $scope.$on('loggedIn', function (event, username) {
            vm.isLoggedIn = true;
            $scope.isLoggedIn = true;
            vm.username = username;
            toast.success(username + ' logged in.');
        });

        $scope.$on('loggedOut', function (event, username) {
            vm.isLoggedIn = false;
            $scope.isLoggedIn = false;
            vm.username = null;
        });

        $scope.isBusy = true;
        $authService.checkForExistingToken();
        $scope.isBusy = false;

        if ($authService.authentication.isAuth == true) {
            $scope.$broadcast('loggedIn', $authService.authentication.userName);
        }

        (function activate() {

        });

        function signIn() {
            $modal.open({
                templateUrl: 'app/dialogs/signin.html',
                controller: 'signinoutController as vm'
            });
        }

        function signOut() {
            $modal.open({
                templateUrl: 'app/dialogs/signout.html',
                controller: 'signinoutController as vm'
            });
        }

        function foo() {

            var deferred = $q.defer();

            $http.get('/Foo').success(function (response) {

                deferred.resolve(response);

            }).error(function (err, status) {

                deferred.reject(err);
            });

            return deferred.promise;
        };     
    }
})();

