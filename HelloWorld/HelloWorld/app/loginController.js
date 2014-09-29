﻿(function() {
    'use strict';

    angular.module('app').controller("loginController", ['$scope', '$rootScope', '$http', "$q", "toast", loginController]);

    function loginController($scope, $rootScope, $http, $q, toast) {
        var vm = this;

        $scope.isBusy = false;
        $scope.isLoggedIn = false;
        vm.getToken = getToken;

        (function activate() {


        });

        function getToken() {
            vm.title = "Clicked";

            var currentContentType = $http.defaults.headers.post['Content-Type'];
            $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

            var deferred = $q.defer();
            var url = '/Token';
            var request = jQuery.param({ username: "Fred", password: "Fishoil6$", grant_type: "password" });

            $scope.isBusy = true;

            $scope.isBusyPromise = $http.post(url, request, {tracker: $rootScope.loadingTracker }).success(function (response, status) {
                deferred.resolve(response);
            }).error(function (response, status) {
                deferred.reject(response);
            });

            $scope.isBusyPromise.then(function (response) {
                $scope.isLoggedIn = true;
                vm.token = response.data;
                vm.username = vm.token.userName;
                toast.success(vm.token.userName + ' logged in.');
            }, function(error) {
                toast.error('Failed to login, reason: ' + error);
            }).finally(function() {
                $scope.isBusy = false;
            });

            $http.defaults.headers.post['Content-Type'] = currentContentType;
        }
    }
})();

