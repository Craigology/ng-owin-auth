﻿(function () {
    'use strict';

    var app = angular.module('app', [
        // Angular modules 
        'ngAnimate',       
        'ui.bootstrap',
        'ngResource',

        // Custom modules 
        'common',

        // 3rd Party Modules
        'angularSpinner',
        'ajoslin.promise-tracker',
        'LocalStorageModule',
        'ui.router',
        'ui.bootstrap.showErrors'
    ]);

    app.config(function () {
        toastr.options = {
            "closeButton": true,
            "positionClass": "toast-bottom-right",
            "showDuration": "300",
            "hideDuration": "500",
            "timeOut": "2000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        };
    });

    app.factory('toast', function () {

        return {
            success: function (text) {
                toastr.success(text, "Success");
            },
            error: function (text) {
                toastr.error(text, "Error");
            }
        };
    });

    app.run(["$rootScope", "promiseTracker",  function ($rootScope, promiseTracker) {
        $rootScope.loadingTracker = promiseTracker({ activationDelay: 0, minDuration: 250 });
    }]);    


    app.directive('serverErrors', function () {
        return {
            restrict: "A",
            require: "^?ngModel",
            link: function (scope, elem, attr, ngModel) {

                console.log(scope, elem, attr);

                scope.$watch(function () { return scope.serverErrors.$invalid; }, function (newVal, oldVal) {
                    if (newVal === true && !oldVal) {
                        elem.toggleClass('has-error', true);
                    }
                });
            }
        }
    });



})();