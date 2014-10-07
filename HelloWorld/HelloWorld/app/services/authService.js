(function() {
    'use strict';

    angular.module('app').factory('authService', [
        '$http', '$q', 'localStorageService', '$rootScope', function($http, $q, localStorageService, $rootScope) {

            var authServiceFactory = {};
            
            var _authentication = {
                isAuth: false,
                userName: ""
            };

        var _saveRegistration = function(registration) {

            logOut();

            return $http.post('api/account/register', registration).then(function(response) {
                return response;
            });
        };

        var _login = function(loginData) {

            var data = "grant_type=password&username=" + loginData.userName + "&password=" + loginData.password;

            var deferred = $q.defer();

            $http.post('token', data, {
                headers:
                { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).success(function(response) {

                localStorageService.set('authorizationData',
                { token: response.access_token, userName: loginData.userName });

                _authentication.isAuth = true;
                _authentication.userName = loginData.userName;
                _broadcastSignIn();

                deferred.resolve(response);

            }).error(function(err, status) {
                _logOut();
                deferred.reject(err);
            });

            return deferred.promise;
        };

        var _logOut = function() {

            localStorageService.remove('authorizationData');

            _authentication.isAuth = false;
            _authentication.userName = "";

            _broadcastSignOut();
        };

        var _checkForExistingToken = function() {

            var authData = localStorageService.get('authorizationData');
            if (authData) {
                _authentication.isAuth = true;
                _authentication.userName = authData.userName;
            }
        };

        var _broadcastSignIn = function() {
                $rootScope.$broadcast('loggedIn', _authentication.userName);
            };

        var _broadcastSignOut = function() {
            $rootScope.$broadcast('loggedOut');
        };

        authServiceFactory.saveRegistration = _saveRegistration;
        authServiceFactory.login = _login;
        authServiceFactory.logOut = _logOut;
        authServiceFactory.checkForExistingToken = _checkForExistingToken;
        authServiceFactory.authentication = _authentication;
        authServiceFactory.broadcastSignIn = _broadcastSignIn;
        authServiceFactory.broadcastSignOut = _broadcastSignOut;

        return authServiceFactory;
        }
    ]);
})();