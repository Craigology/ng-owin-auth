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

        $scope.previousErrors = [];

        vm.register = function () {

            //$scope.$broadcast('show-errors-check-validity');
            $scope.registerForm.$setPristine();

            vm.isBusy = true;

            usSpinnerService.spin('spinner-local-submit-button');

            angular.forEach($scope.previousErrors, function(value, key) {
                var elem = $scope.registerForm[value];
                elem.$invalid = false;
                elem.$setValidity('x', true);
                elem.$error.serverMessages.length = 0;
            });

            $scope.previousErrors.length = 0;

            $authService
                .register(vm.registration)
                .then(function(response) {

                }, function (result) {
                    toast.error('Failed to register, reason: ' + result);

                    angular.forEach(result.data.errors, function (value, key) {

                        var elem = $scope.registerForm[value.key];
                        elem.$invalid = false;
                        elem.$setValidity('x', true);
                        elem.$error.serverMessages = [];
                    });

                    angular.forEach(result.data.errors, function (value, key) {

                        var elem = $scope.registerForm[value.key];
                        elem.$error.serverMessages.push(value.error);

                        $scope.previousErrors.push(value.key);
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

