define([],
    function() {
        'use strict';

        var homeCtrl = ['$scope','$templateCache', function($scope,$templateCache) {
            $scope.items = [{
                id: 1,
                label: "中国",
                detail: $templateCache.get('template.html')
            }, {
                id: 2,
                label: "美国",
                detail: "美国XXX"
            }];

            $scope.currentItem = {
                id: 1,
                label: "中国",
                detail: $templateCache.get('template.html')
            };

        }];

        var homeModule = angular.module('homeModule');
        homeModule.controller('homeCtrl', homeCtrl);


    }());
