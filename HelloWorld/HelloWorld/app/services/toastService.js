(function() {
    'use strict';

    var app = angular.module('app');

    app.factory('toastService', ['$rootScope', function ($rootScope) {

        var _onShown = function ($toastElement, options) {
        };

        var _onHidden = function ($toastElement) {
        };

        var toastrOptionsForErrors = {
            "closeButton": true,
            "debug": false,
            "progressBar": true,
            "positionClass": "toast-bottom-full-width",
            "target" : "#viewContainer",
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

        var toastrOptionsForSuccess = {
            "closeButton": true,
            "debug": false,
            "progressBar": true,
            "positionClass": "toast-bottom-full-width",
            "target": "#viewContainer",
            "onclick": null,
            "showDuration": "100",
            "hideDuration": "100",
            "timeOut": "5000",
            "extendedTimeOut": "10000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut",
            "preventDuplicates": {
                "skipDuplicateMessage": true,
                "removeMessageWithSameTitle": false
            },
            "newestOnTop": false,
            "onShown": _onShown,
            "onHidden": _onHidden
        };

        var toastServiceFactory = {};

        var _success = function (message, title, tag) {
            var toast = toastr.success(message, title, toastrOptionsForSuccess);
            if (toast !== undefined && tag !== undefined) {
                toast.attr('data-tag', tag);
            }
        };

        var _error = function (message, title, tag) {
            var toast = toastr.error(message, title, toastrOptionsForErrors);
            if (toast !== undefined && tag !== undefined) {
                toast.attr('data-tag', tag);
            }
        };

        var _clear = function (tag) {
            if (tag !== undefined) {
                var activeToasts = window.$('.toast');
                for (var i = 0; i < activeToasts.length; i++) {
                    var $activeToast = $(activeToasts[i]);
                    if ($activeToast.data('tag') == tag) {
                        $activeToast.remove();
                    }
                }
            }
            else {
                _clearAll();
            }
        };

        var _clearAll = function () {
            toastr.clear();
        };

        toastServiceFactory.success = _success;
        toastServiceFactory.error = _error;
        toastServiceFactory.clear = _clear;
        toastServiceFactory.clearAll = _clearAll;

        return toastServiceFactory;
        }
    ]);
})();