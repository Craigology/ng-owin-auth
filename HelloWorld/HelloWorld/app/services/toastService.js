(function() {
    'use strict';

    var app = angular.module('app');

    app.factory('toastService', ['$rootScope', function ($rootScope) {

        var activeToasts = {};

        var _onShown = function ($toastElement, options) {
        };

        var _onHidden = function ($toastElement) {
            delete activeToasts[$toastElement];
        };

        var toastrOptionsForErrors = {
            "closeButton": true,
            "debug": false,
            "progressBar": true,
            "positionClass": "toast-bottom-full-width",
            "onclick": null,
            "showDuration": "200",
            "hideDuration": "200",
            "timeOut": "15000",
            "extendedTimeOut": "30000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut",
            "preventDuplicates" : {
                "skipDuplicateMessage" : true,
                "removeMessageWithSameTitle" : true
            },
            "newestOnTop" : false,
            "onShown" : _onShown,
            "onHidden": _onHidden
        };

        var toastServiceFactory = {};

        var _success = function (message, title) {
            toastr.success(message, "Success");
        };

        var _error = function (message, title, tag) {
            var toast = toastr.error(message, title, toastrOptionsForErrors);
            if (toast !== undefined && tag !== undefined) {
                activeToasts[toast] = tag;
            }
        };

        var _clear = function (tag) {
            if (tag !== undefined && activeToasts.length > 0) {
                for (var activeToast in activeToasts) {
                    if (activeToasts[activeToast] == tag) {
                        $(activeToast).remove();
                    }
                }
            }
            else {
                activeToasts.length = 0;
                toastr.clear();
            }
        };

        toastServiceFactory.success = _success;
        toastServiceFactory.error = _error;
        toastServiceFactory.clear = _clear;

        return toastServiceFactory;
        }
    ]);
})();