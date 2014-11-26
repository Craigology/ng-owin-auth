(function() {
    'use strict';

    angular
        .module('app')
        .directive('monitorValidity', monitorValidity);

    monitorValidity.$inject = ['$window'];
    
    function monitorValidity ($window) {

        var directive = {
            link: link,
            restrict: 'A',
            require: "^?ngModel"
        };
        return directive;

        function link(scope, element, attrs, ngModel) {

            var onPristineChanged = function (newVal, oldVal) {
                checkIfHasError();
            };

            var onInvalidChanged = function (newVal, oldVal) {
                checkIfHasError();
            };

            var onSubmittedChanged = function (newVal, oldVal) {
                checkIfHasError();
            };

            var checkIfHasError = function () {

                if (ngModel.$pristine)
                    return;

                if (ngModel.$invalid) {
                    element.parent().parent().toggleClass('has-error', true);
                }
                else if (ngModel.$invalid === false) {
                    element.parent().parent().toggleClass('has-error', false);
                }
            };

            scope.$watch(function () { return ngModel.$pristine; }, onPristineChanged);
            scope.$watch(function () { return ngModel.$invalid; }, onInvalidChanged);
            scope.$watch(function () { return ngModel.$submitted; }, onSubmittedChanged);
        }
    }
})();