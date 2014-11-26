(function () {
    'use strict';

    var app = angular.module('app', [
        // Angular modules 
        'ngAnimate',       
        'ui.bootstrap',
        'ngResource',

        // Custom modules 
        'common',

        // 3rd Party Modules
        'angularSpinner',
        'ajoslin.promise-tracker',
        'LocalStorageModule',
        'ui.router',
        'ui.bootstrap.showErrors',
        'angular-ladda'
    ]);
   
    app.run(["$rootScope", "promiseTracker",  function ($rootScope, promiseTracker) {
        $rootScope.loadingTracker = promiseTracker({ activationDelay: 0, minDuration: 250 });
    }]);    

})();