define([],
    function() {
        'use strict';

        var leftCtrl = ['$scope', function($scope) {
            $scope.menuList = [{
                'id': 'home',
                'label': '介绍',
                'collapsed': true,
                'href': '/#/left/home',
                'img': '',
                'sub': null
            },
            {
                'id': 'tab',
                'label': '分页页签',
                'collapsed': true,
                'href': '/#/left/tab',
                'img': '',
                'sub': null
            },
            {
                'id': 'leftMenu',
                'label': '左侧菜单',
                'collapsed': true,
                'href': '/#/left/leftMenu',
                'img': '',
                'sub': null
            }]
        }];

        var homeModule = angular.module('homeModule');
        homeModule.controller('leftCtrl', leftCtrl);


    }());
