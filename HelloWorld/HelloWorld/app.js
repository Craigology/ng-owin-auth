var app = angular.module('HelloWorld', []);

app.controller("MainController", function ($scope) {
    $scope.inputValue = "Fred!";
});