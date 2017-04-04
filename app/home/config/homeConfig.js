define([],
    function() {
        'use strict';

        var homeModule = angular.module('homeModule', []);

        homeModule.config(['$stateProvider',
            function($stateProvider) {
                $stateProvider
                    .state('home', {
                        url: '/home',
                        templateUrl: 'app/home/view/home.html',
                        controller: 'homeCtrl',
                        resolve: {
                            script: ['$ocLazyLoad', function($ocLazyLoad) {
                                return $ocLazyLoad.load(['app/home/service/homeService.js',
                                    'app/home/controller/homeCtrl.js']);
                            }]
                        }

                    })
            }
        ]);
        return homeModule;
    });
