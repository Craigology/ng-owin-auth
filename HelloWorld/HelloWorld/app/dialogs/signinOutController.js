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

        //function getToken() {

        //    var currentContentType = $http.defaults.headers.post['Content-Type'];
        //    $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

        //    var deferred = $q.defer();
        //    var url = '/Token';
        //    var request = jQuery.param({ username: vm.username, password: vm.password, grant_type: "password" });

        //    $scope.isBusy = true;

        //    $scope.isBusyPromise = $http.post(url, request, {tracker: $rootScope.loadingTracker }).success(function (response, status) {
        //        deferred.resolve(response);
        //    }).error(function (response, status) {
        //        deferred.reject(response);
        //    });

        //    $scope.isBusyPromise.then(function (response) {

        //        $rootScope.isLoggedIn = true;
        //        $scope.$close(true);
        //        vm.token = response.data;
        //        vm.username = vm.token.userName;
        //        toast.success(vm.token.userName + ' logged in.');

        //        $localStorageService.set('recentUsername', vm.username);
        //        $rootScope.$broadcast('loggedIn', vm.username);

        //    }, function(error) {
        //        toast.error('Failed to login, reason: ' + error);
        //    }).finally(function() {
        //        $scope.isBusy = false;
        //    });

        //    $http.defaults.headers.post['Content-Type'] = currentContentType;
        //}

        function cancel() {
            $scope.$close(false);
        }
    }
})();

