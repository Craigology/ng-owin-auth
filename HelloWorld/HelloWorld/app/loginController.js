(function() {
    'use strict';

    angular.module('app').controller("loginController", ['$scope', '$rootScope', '$http', loginController]);

    function loginController($scope, $rootScope, $http) {
        var vm = this;

        vm.title = 'Hello World';
        vm.getToken = getToken;

        (function activate() {

        });

        function getToken() {
            vm.title = "Clicked";

            var currentContentType = $http.defaults.headers.post['Content-Type'];
            $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

            $http.post('/Token', jQuery.param({ username: "Fred", password: "Fishoil6$", grant_type: "password" })).
                success(function (data, status, headers, config) {
                    $rootScope.$broadcast("login", data);
                    $scope.token = data;
                    vm.userName = data.userName;
                    vm.email = data.email;
                    vm.message = "Welcome, " + data.userName;
                }).
                error(function(data, status, headers, config) {
                    $http.defaults.headers.post['Content-Type'] = currentContentType;
                    $log()
            });
        }
    }
})();

