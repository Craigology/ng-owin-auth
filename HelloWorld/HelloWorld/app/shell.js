(function() {
    'use strict';

    angular.module('app').controller("shell", ['$scope', '$rootScope', '$http', "$q", "$modal", "toast", shell]);

    function shell($scope, $rootScope, $http, $q, $modal, toast) {
        var vm = this;

        $scope.isBusy = false;
        $scope.isLoggedIn = false;

        vm.signIn = signIn;
        vm.username = "";

        $scope.$on('loggedIn', function (event, username) {
            vm.isLoggedIn = true;
            $scope.isLoggedIn = true;
            vm.username = username;
        });

        (function activate() {

        });

        function signIn() {

            $modal.open({
                templateUrl: 'app/dialogs/signin.html',
                controller: 'signinController as vm',
                resolve: {
                    //customerId: function () {
                    //    return vm.customer.id;
                    //},
                    //customerName: function () {
                    //    return vm.customer.name;
                    //},
                    //customersContext: function () {
                    //    return customersContext;
                    //},
                }
            });
        }
    }
})();

