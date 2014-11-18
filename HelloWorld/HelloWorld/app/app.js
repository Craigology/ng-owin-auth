(function () {
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
        'ui.bootstrap.showErrors',
        'angular-ladda'
    ]);

   
    app.run(["$rootScope", "promiseTracker",  function ($rootScope, promiseTracker) {
        $rootScope.loadingTracker = promiseTracker({ activationDelay: 0, minDuration: 250 });
    }]);    


    app.directive('monitorValidity', function () {
        return {
            restrict: "A",
            require: "^?ngModel",
            link: function (scope, elem, attr, ngModel) {

                var toggleHasError = function (newVal, oldVal) {
                    if (newVal === true) {
                        elem.parent().parent().toggleClass('has-error', true);
                    }
                    else if (newVal === false) {
                        elem.parent().parent().toggleClass('has-error', false);
                    }
                };

                scope.$watch(function () { return ngModel.$invalid; }, toggleHasError);
            }
        }
    });

})();