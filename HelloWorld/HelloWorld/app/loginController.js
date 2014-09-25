(function() {
    'use strict';

    angular.module('app').controller("loginController", ['$scope', loginController]);

    function loginController($scope) {
        var vm = this;

        vm.title = 'Hello World';
        vm.getToken = getToken;

        (function activate() {

        });

        function getToken() {
            vm.title = "Clicked";
        }
    }
})();

