define([],
    function() {
        'use strict';

    var loginCtrl = ['$scope', function($scope) {
        console.log('loginCtrl');
    }];

    var loginModule = angular.module('loginModule');
    loginModule.controller('loginCtrl',loginCtrl);
}());
