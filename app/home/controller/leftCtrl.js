define([],
    function() {
        'use strict';

        var leftCtrl = ['$scope', function($scope) {
            $scope.menuList = [{
                'id': 'home',
                'label': '介绍',
                'collapsed': true,  //是否折叠菜单,可选,默认为false
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
            },
            {
                'id': 'dragPanel',
                'label': '拖拉面板',
                'collapsed': true,
                'href': '/#/left/dragPanel',
                'img': '',
                'sub': null
            },
            {
                'id': 'accordion',
                'label': '手风琴面板',
                'collapsed': true,
                'href': '/#/left/accordion',
                'img': '',
                'sub': null
            }]
        }];

        var homeModule = angular.module('homeModule');
        homeModule.controller('leftCtrl', leftCtrl);


    }());
