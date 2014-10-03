﻿(function() {
    'use strict';

    var app = angular.module('app');

    //app.constant('_START_REQUEST_', '_START_REQUEST_');
    //app.constant('_END_REQUEST_', '_END_REQUEST_');

    //app.run(['$httpProvider', '$log', '_START_REQUEST_', '_END_REQUEST_', function ($httpProvider, $log, _START_REQUEST_, _END_REQUEST_) {

    //    var $http,
    //        httpLoggingInterceptor = ['$q', '$injector', function ($q, $injector) {
    //            var rootScope;

    //            function success(response) {
    //                // get $http via $injector because of circular dependency problem
    //                $http = $http || $injector.get('$http');
    //                $log.log("<" + $http.pendingRequests[0]);
    //                // don't send notification until all requests are complete
    //                if ($http.pendingRequests.length < 1) {
    //                    // get $rootScope via $injector because of circular dependency problem
    //                    rootScope = rootScope || $injector.get('$rootScope');
    //                    // send a notification requests are complete
    //                    rootScope.$broadcast(_END_REQUEST_);
    //                }
    //                return response;
    //            }

    //            function error(response) {
    //                // get $http via $injector because of circular dependency problem
    //                $http = $http || $injector.get('$http');
    //                $log.log("X" + $http.pendingRequests[0]);
    //                // don't send notification until all requests are complete
    //                if ($http.pendingRequests.length < 1) {
    //                    // get $rootScope via $injector because of circular dependency problem
    //                    rootScope = rootScope || $injector.get('$rootScope');
    //                    // send a notification requests are complete
    //                    rootScope.$broadcast(_END_REQUEST_);
    //                }
    //                return $q.reject(response);
    //            }

    //            return function (promise) {
    //                // get $rootScope via $injector because of circular dependency problem
    //                rootScope = rootScope || $injector.get('$rootScope');
    //                // send notification a request has started
    //                rootScope.$broadcast(_START_REQUEST_);
    //                $log.log(">" + $http.pendingRequests[0]);
    //                return promise.then(success, error);
    //            }
    //        }];

    app.config(function($httpProvider) {
        $httpProvider.interceptors.push([
            '$location', '$q', '$injector', function ($location, $q, $injector) {

                var tokenProviderInterceptorFactory = {};

                tokenProviderInterceptorFactory.request = function(config) {

                    config.headers = config.headers || {};

                    var authData = $injector.get('localStorageService').get('authorizationData');
                    if (authData) {
                        config.headers.Authorization = 'Bearer ' + authData.token;
                    }

                    return config;
                };

                tokenProviderInterceptorFactory.responseError = function(rejection) {
                    if (rejection.status === 401) {
                        $injector.get('$state').go('signIn');
                    } else {
                        $injector.get('toast').error(rejection.statusText);
                    }
                    return $q.reject(rejection);
                };

                return tokenProviderInterceptorFactory;
            }
        ]);
    });
})();