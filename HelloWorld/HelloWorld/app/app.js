(function () {
    'use strict';

    var app = angular.module('app', [
        // Angular modules 
        'ngAnimate',
        'ngRoute',
        'ui.bootstrap',
        'ngResource',

        // Custom modules 
        'common',

        // 3rd Party Modules
        'angularSpinner',
        'ajoslin.promise-tracker'
    ]);

    //app.config(function ($provide) {

    //    $provide.decorator("$exceptionHandler", function ($delegate, $injector) {
    //        return function (exception, cause) {
    //            var $rootScope = $injector.get("$rootScope");
    //            $rootScope.addError({ message: "Exception", reason: exception });
    //            toastr.error(cause);
    //            $delegate(exception, cause);
    //        };
    //    });
    //});

    app.config(function () {
        toastr.options = {
            "closeButton": true,
            "positionClass": "toast-bottom-right",
            "showDuration": "300",
            "hideDuration": "500",
            "timeOut": "2000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        };
    });

    app.factory('toast', function () {

        return {
            success: function (text) {
                toastr.success(text, "Success");
            },
            error: function (text) {
                toastr.error(text, "Error");
            }
        };
    });

    app.run(["$rootScope", "promiseTracker",  function ($rootScope, promiseTracker) {

        $rootScope.loadingTracker = promiseTracker({ activationDelay: 0, minDuration: 250 });
    }] );

})();