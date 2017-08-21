define([],
    function () {
        'use strict';

        var dragPanelCtrl = ['$scope', '$templateCache', function ($scope, $templateCache) {
            $scope.header = "日志详情"
        }];

        var homeModule = angular.module('homeModule');
        homeModule.controller('dragPanelCtrl', dragPanelCtrl);


    }());
