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
            require: ["^form", "^?ngModel"]
        };
        return directive;

        function link(scope, element, attrs, ctrls) {

            var form = ctrls[0];
            var ngModel = ctrls[1];

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

                if (form.$pristine === true || form.$submitted === false)
                    return;

                if (ngModel.$invalid) {
                    element.parent().parent().toggleClass('has-error', true);
                }
                else if (ngModel.$invalid === false) {
                    element.parent().parent().toggleClass('has-error', false);
                }
            };

            scope.$watch(function () { return form.$pristine; }, onPristineChanged);
            scope.$watch(function () { return form.$submitted; }, onSubmittedChanged);
            scope.$watch(function () { return ngModel.$invalid; }, onInvalidChanged);
        }
    }
})();