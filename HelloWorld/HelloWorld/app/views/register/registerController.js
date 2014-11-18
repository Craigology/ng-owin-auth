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

        vm.showErrors = function (model) {
            if (model.$invalid) {
                if (model.$error.$serverErrors) {
                    toastService.error(model.$error.$serverErrors, model.$name);
                }
                if (model.$error.required) {
                    toastService.error(model.$name + ' is required.', model.$name);
                }
            }
        };

        vm.register = function () {

            toastService.clear();
            var hasLocalErrors = false;

            for (var i in $scope.registerForm) {
                
                var input = $scope.registerForm[i];
                if (input) {
                    if (input.$invalid) {
                        var errors = [];
                        if (input.$error.required) {
                            input.$pristine = false;
                            input.$setValidity('required', false);
                            errors.push(input.$name + ' is required.');
                        }
                        else {
                            input.$setValidity('required', true);
                        }

                        // If any local validation errors then raise a toast for this input and set a market for below.
                        if (errors.length > 0) {
                            toastService.error(errors.join("\n"), input.$name);
                            hasLocalErrors = true;
                            continue;
                        }

                        // No local form validation errors, so clear any server errors from previous invocation, if any.
                        input.$setValidity('serverErrors', true);
                        input.$invalid = false;
                    }
                }
            }

            if (hasLocalErrors) {
                return;
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

