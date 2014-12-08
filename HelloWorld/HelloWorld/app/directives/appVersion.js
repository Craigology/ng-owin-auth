(function () {
    'use strict';

    angular
        .module('app')
        .directive('appVersion', appVersion);

    function appVersion() {
        return {
            restrict: 'A',
            template: '0.0.0.0',
            transclude: true
        };
    }
})();