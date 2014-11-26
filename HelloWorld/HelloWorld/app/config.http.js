(function() {
    'use strict';

    var app = angular.module('app');

    app.constant('_START_REQUEST_', '_START_REQUEST_');
    app.constant('_END_REQUEST_', '_END_REQUEST_');

    // Interceptor to log requests, and broadcast start/end events.
    app.config(function($httpProvider) {
        $httpProvider.interceptors.push([
            '$q', '$injector', function($q, $injector) {

                var $http;
                var rootScope;

                function success(response) {
                    $http = $http || $injector.get('$http');
                    $log.log("<" + $http.pendingRequests[0]);
                    // don't send notification until all requests are complete
                    if ($http.pendingRequests.length < 1) {
                        rootScope = rootScope || $injector.get('$rootScope');
                        // send a notification requests are complete
                        rootScope.$broadcast(_END_REQUEST_);
                    }
                    return response;
                }

                function error(response) {
                    $http = $http || $injector.get('$http');
                    $log.log("X" + $http.pendingRequests[0]);
                    // don't send notification until all requests are complete
                    if ($http.pendingRequests.length < 1) {
                        rootScope = rootScope || $injector.get('$rootScope');
                        rootScope.$broadcast(_END_REQUEST_);
                    }
                    return $q.reject(response);
                }

                return function(promise) {
                    rootScope = rootScope || $injector.get('$rootScope');
                    rootScope.$broadcast(_START_REQUEST_);
                    $log.log(">" + $http.pendingRequests[0]);
                    return promise.then(success, error);
                }
            }
        ]);
    });

    // Interceptor to inject the authentication header if present, and redirect to the signIn state on 401.
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

                tokenProviderInterceptorFactory.responseError = function (rejection) {
                    if (rejection.status === 0) {
                        $injector.get('toastService').error("There's a problem communicating with the server right now. Please try again in a few moments.", "Temporarily Unavailable", "http");
                    } else if (rejection.status === 401) {
                        $injector.get('$state').go('signin');
                    } else if (rejection.status === 400) {
                        // Don't announce here, let the promise error callback deal with it.
                    } else if (rejection.status === 406) {
                        // Don't announce here, let the promise error callback deal with it.
                    } else {
                        $injector.get('toastService').error(rejection.statusText, "That Seemed To Fail", "http");
                    }
                    return $q.reject(rejection);
                };

                return tokenProviderInterceptorFactory;
            }
        ]);
    });
})();