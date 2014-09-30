(function() {
    'use strict';

    angular.module('app').controller("signinController", ['$scope', '$rootScope', '$http', "$q", "$modal", "toast", 'localStorageService', signinController]);

    function signinController($scope, $rootScope, $http, $q, $modal, toast, $localStorageService) {
        var vm = this;

        $scope.isBusy = false;

        vm.getToken = getToken;
        vm.cancel = cancel;
        vm.username = $localStorageService.get('recentUsername');
        vm.password = "";

        function getToken() {

            var currentContentType = $http.defaults.headers.post['Content-Type'];
            $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

            var deferred = $q.defer();
            var url = '/Token';
            var request = jQuery.param({ username: vm.username, password: vm.password, grant_type: "password" });

            $scope.isBusy = true;

            $scope.isBusyPromise = $http.post(url, request, {tracker: $rootScope.loadingTracker }).success(function (response, status) {
                deferred.resolve(response);
            }).error(function (response, status) {
                deferred.reject(response);
            });

            $scope.isBusyPromise.then(function (response) {

                $scope.isLoggedIn = true;
                $scope.$close(true);
                vm.token = response.data;
                vm.username = vm.token.userName;
                toast.success(vm.token.userName + ' logged in.');

                $localStorageService.set('recentUsername', vm.username);

            }, function(error) {
                toast.error('Failed to login, reason: ' + error);
            }).finally(function() {
                $scope.isBusy = false;
            });

            $http.defaults.headers.post['Content-Type'] = currentContentType;
        }

        function cancel() {
            $scope.$close(false);
        }
    }
})();

