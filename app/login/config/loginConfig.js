define([],
    function() {
        'use strict';
        var loginModule = angular.module('loginModule', []);
        loginModule.config(['$stateProvider',
            function($stateProvider) {
                $stateProvider
                    .state('login', {
                        url: '/login',
                        templateUrl: 'app/login/view/login.html',
                        controller: 'loginCtrl',
                        resolve: {
                            script: ['$ocLazyLoad', function($ocLazyLoad) {
                                return $ocLazyLoad.load(['app/login/service/loginService.js',
                                    'app/login/controller/loginCtrl.js']);
                            }]
                        }

                    })
            }
        ]);
        return loginModule;
    });
