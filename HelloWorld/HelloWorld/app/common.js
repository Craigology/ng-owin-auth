(function () {
    'use strict';

    var commonModule = angular.module('common', []);

    commonModule.factory('common', ['$q', '$rootScope', '$timeout', common]);

    function common($scope) {

        var service = {
            $q: $q,
            $timeout: $timeout
        };

        return service;
    };
})();