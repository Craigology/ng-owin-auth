(function() {
    'use strict';

    angular.module('app').factory('authService', [
        '$http', '$q', 'localStorageService', '$rootScope', function($http, $q, localStorageService, $rootScope) {

        var authServiceFactory = {};
            
        var _authentication = {
            isAuth: false,
            userName: ""
        };

        var _register = function (registration) {

            var deferred = $q.defer();

            return $http.post('api/account/register', registration)
            .success(function (response) {

                _signin({ userName: registration.username, password: registration.password });
                deferred.resolve(response);
            });

        };

        var _signin = function(signinData) {

            var data = "grant_type=password&username=" + signinData.userName + "&password=" + signinData.password;

            var deferred = $q.defer();

            $http.post('token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).success(function(response) {

                $rootScope.token = response;
                $rootScope.isLoggedIn = true;
                
                localStorageService.set('recentUsername', response.userName);
                localStorageService.set('authorizationData', { token: response.access_token, userName: response.userName });

                _authentication.isAuth = true;
                _authentication.userName = signinData.userName;

                _broadcastSignIn();

                deferred.resolve(response);

            }).error(function(err, status) {
                _signout();
                deferred.reject(err);
            });

            return deferred.promise;
        };

        var _signout = function() {

            $rootScope.isLoggedIn = false;
            $rootScope.token = null;

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

        var _broadcastSignIn = function () {
            $rootScope.isLoggedIn = true;
            $rootScope.$broadcast('loggedIn', _authentication.userName);
            };

        var _broadcastSignOut = function () {
            $rootScope.isLoggedIn = false;
            $rootScope.$broadcast('loggedOut');
        };

        authServiceFactory.register = _register;
        authServiceFactory.signin = _signin;
        authServiceFactory.signout = _signout;
        authServiceFactory.checkForExistingToken = _checkForExistingToken;
        authServiceFactory.authentication = _authentication;
        authServiceFactory.broadcastSignIn = _broadcastSignIn;
        authServiceFactory.broadcastSignOut = _broadcastSignOut;

        return authServiceFactory;
        }
    ]);
})();