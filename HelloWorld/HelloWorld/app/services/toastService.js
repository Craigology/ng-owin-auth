(function() {
    'use strict';

    var app = angular.module('app');

    app.factory('toastService', ['$rootScope', function ($rootScope) {

        var _currentMessage;
        var _currentTitle;

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
            "preventDuplicates": false,
            "newestOnTop" : false,
            "onShown": function () {
            },
            "onHidden": function () {
                _currentMessage = undefined;
                _currentTitle = undefined;
            }
        };

        var toastServiceFactory = {};

        var _success = function (message, title) {
            if (message == _currentMessage) {
                return;
            }
            if (title == _currentTitle) {
                _clear();
            }
            _currentMessage = message;
            _currentTitle = title;
            toastr.success(message, "Success");
        };

        var _error = function (message, title) {
            if (message == _currentMessage) {
                return;
            }
            if (title == _currentTitle) {
                _clear();
            }
            _currentMessage = message;
            _currentTitle = title;
            toastr.error(message, title, toastrOptionsForErrors);
        };

        var _clear = function () {
            _currentMessage = undefined;
            _currentTitle = undefined;
            toastr.clear();
        };

        toastServiceFactory.success = _success;
        toastServiceFactory.error = _error;
        toastServiceFactory.clear = _clear;

        return toastServiceFactory;
        }
    ]);
})();