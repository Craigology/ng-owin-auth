(function() {
    'use strict';

    angular.module('app').controller("registerController", ['$scope', '$rootScope', '$http', "$q", "$modal", "toast", "localStorageService", "authService", "usSpinnerService", registerController]);

    function registerController($scope, $rootScope, $http, $q, $modal, toast, $localStorageService, $authService, usSpinnerService) {

        var vm = this;        

        vm.registration = {
            username: "Fred",
            email: "somebademail",
            password: "",
            password_confirm: ""
        };

        vm.isBusy = false;

        vm.register = function () {

            //$scope.$broadcast('show-errors-check-validity');
            //if ($scope.registerForm.$invalid) { return; }

            vm.isBusy = true;

            usSpinnerService.spin('spinner-local-submit-button');

            $scope.registerForm.$setPristine();

            $authService
                .register(vm.registration)
                .then(function(response) {

                }, function (result) {
                    toast.error('Failed to register, reason: ' + result);

                    angular.forEach(result.data.errors, function (value, key) {

                        $scope.registerForm[value.key].$invalid = true;
                        $scope.registerForm[value.key].$setValidity('', false);
                        $scope.registerForm[value.key].$error.serverMessages = [];                        
                    });

                    angular.forEach(result.data.errors, function (value, key) {

                        $scope.registerForm[value.key].$error.serverMessages.push(value.error);
                    });

                    //$scope.$broadcast('show-errors-check-validity');

                }).finally(function () {
                    usSpinnerService.stop('spinner-local-submit-button');
                    vm.isBusy = false;
                });
        };

        vm.cancel = function cancel() {
            // redirect back to landing?


        };
    }
})();

