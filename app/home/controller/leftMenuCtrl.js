define([],
    function() {
        'use strict';

        var leftMenuCtrl = ['$scope','$templateCache', function($scope,$templateCache) {
            $scope.menuList = [{
                'id': 'Home',
                'label': 'Home',
                'collapsed': true,
                'href': '#',
                'img': '',
                'sub': null
            }, {
                'id': 'About',
                'label': 'About',
                'collapsed': false,
                'href': '#',
                'img': '',
                'sub': [{
                    'id': 'About1',
                    'label': 'About1',
                'collapsed': true,
                    'href': '#',
                    'img': '',
                    'sub': null
                }, {
                    'id': 'About2',
                    'label': 'About2',
                    'collapsed': false,
                    'href': '#',
                    'img': '',
                    'sub': [{
                        'id': 'About21',
                        'label': 'About21',
                        'collapsed': true,
                        'href': '#',
                        'img': '',
                        'sub': null
                    }, {
                        'id': 'About22',
                        'label': 'About22',
                        'collapsed': true,
                        'href': '#',
                        'img': '',
                        'sub': null
                    }, {
                        'id': 'About23',
                        'label': 'About23',
                        'collapsed': true,
                        'href': '#',
                        'img': '',
                        'sub': null
                    }]
                }, {
                    'id': 'About3',
                    'label': 'About3',
                    'collapsed': true,
                    'href': '#',
                    'img': '',
                    'sub': null
                }]
            }, {
                'id': 'Hello',
                'label': 'Hello',
                'collapsed': true,
                'href': '#',
                'img': '',
                'sub': null
            }]
        }];

        var homeModule = angular.module('homeModule');
        homeModule.controller('leftMenuCtrl', leftMenuCtrl);


    }());
