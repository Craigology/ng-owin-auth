(function() {
    'use strict';

    angular.module('app').controller("loginController", ['$scope', '$rootScope', '$http', "$q", "toast", loginController]);

    function loginController($scope, $rootScope, $http, $q, toast) {
        var vm = this;

        $scope.isBusy = false;
        vm.title = 'Hello World';
        vm.getToken = getToken;

        (function activate() {


        });

        function getToken() {
            vm.title = "Clicked";

            var currentContentType = $http.defaults.headers.post['Content-Type'];
            $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

            var deferred = $q.defer();
            var url = '/Token';
            var request = jQuery.param({ username: "Fred", password: "Fishoil6$", grant_type: "password" });

            $scope.isBusy = true;

            $scope.isBusyPromise = $http.post(url, request, {tracker: $rootScope.loadingTracker }).success(function (data, status) {
                deferred.resolve(data);
            }).error(function (data, status) {
                deferred.reject(data);
            });

            $scope.isBusyPromise.then(function(token) {
                toast.success('Logged in.');
            }, function(error) {
                toast.error('Failed to login, reason: ' + error);
            }).finally(function() {
                $scope.isBusy = false;
            });

            //    success(function(data, status, headers, config) {

            //        $rootScope.$broadcast("login", data);
            //        $scope.token = data;
            //        vm.userName = data.userName;
            //        vm.email = data.email;
            //        vm.message = "Welcome, " + data.userName;

            //        toast.success('Logged in.');
            //    });
            //$scope.isBusy.
            //        error(function(data, status, headers, config) {
            //        });

            $http.defaults.headers.post['Content-Type'] = currentContentType;
        }
    }
})();

