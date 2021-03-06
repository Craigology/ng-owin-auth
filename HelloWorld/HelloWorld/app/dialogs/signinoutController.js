﻿(function() {
    'use strict';

    angular.module('app').controller("signinoutController", ['$scope', '$rootScope', '$http', "$q", "$modal", "$state", "toastService", "localStorageService", "authService", signinoutController]);

    function signinoutController($scope, $rootScope, $http, $q, $modal, $state, toastService, $localStorageService, $authService) {
        var vm = this;

        vm.cancel = cancel;
        vm.username = $localStorageService.get('recentUsername');
        vm.password = "";

        vm.isBusy = false;

        vm.showErrors = function (model) {
            if (model.$invalid && $scope.signinForm.$dirty) {
                if (model.$error.required) {
                    toastService.error(model.$name + ' is required.', model.$name, "local");
                }
            }
        };

        vm.signin = function () {

            $scope.signinForm.$setDirty();
            $scope.signinForm.$setSubmitted();

            if ($scope.signinForm.$invalid) {
                vm.showErrors($scope.signinForm.username);
                vm.showErrors($scope.signinForm.password);
                return;
            }

            toastService.clearAll();

            vm.isBusy = true;

            $authService
                .signin({ userName: vm.username, password: vm.password })
                .then(function(response) {

                    $scope.$close(true);

                }, function (error) {
                    toastService.error(error.error_description, "There's A Problem Signing You In", "server");
                }).finally(function () {
                    vm.isBusy = false;
                });
        };

        vm.signout = function () {

            vm.isBusy = true;
            $authService.signout();

            vm.username = null;
            vm.isBusy = false;

            $scope.$close(true);
        };

        vm.register = function () {
            toastService.clearAll();
            $scope.$close(false);
            $state.go('register', {}, { reload: true });
        };

        function cancel() {
            toastService.clearAll();
            $scope.$close(false);
        }
    }
})();

