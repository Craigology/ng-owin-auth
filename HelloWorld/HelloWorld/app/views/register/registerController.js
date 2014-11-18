(function() {
    'use strict';

    angular.module('app').controller("registerController", ['$scope', '$rootScope', '$http', "$q", "$modal", 'toastService', "localStorageService", "authService", "usSpinnerService", registerController]);

    function registerController($scope, $rootScope, $http, $q, $modal, toastService, $localStorageService, $authService, usSpinnerService) {

        var vm = this;        

        vm.registration = {
            username: "",
            email: "",
            password: "",
            password_confirm: ""
        };

        vm.isBusy = false;

        $scope.previousErrors = [];

        vm.showErrors = function (model) {
            if (model.$invalid && model.$error.$serverErrors) {
                toastService.error(model.$error.$serverErrors, model.$name);
            }
        };

        vm.register = function () {

            for (var i in $scope.registerForm) {
                
                var input = $scope.registerForm[i];
                if (input) {
                    if (input.$invalid) {
                        input.$setValidity('serverErrors', true);
                        input.$invalid = false;
                    }
                }
            }
            $scope.registerForm.$setPristine();

            vm.isBusy = true;
        
            $authService
                .register(vm.registration)
                .then(function(response) {

                }, function (result) {

                    angular.forEach(result.data.errors, function (value, key) {

                        var elem = $scope.registerForm[value.key];
                        elem.$setValidity('serverErrors', false);

                        var errorWithDecodedNewLines = value.error.replace(/\\n/g, '<br/>');
                        elem.$error.$serverErrors = errorWithDecodedNewLines;
                        elem.$invalid = true;

                        toastService.error(errorWithDecodedNewLines, value.key);
                    });

                }).finally(function () {
                    vm.isBusy = false;
                });
        };

        vm.cancel = function cancel() {
            // redirect back to landing?
        };
    }
})();

