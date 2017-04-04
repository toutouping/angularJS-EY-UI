define(['../framework/topNav/topCtrl',
        '../framework/bottomNav/bottomCtrl',
        '../app/home/config/homeConfig',
        '../app/login/config/loginConfig'
    ],
    function(topCtrl, bottomCtrl, homeConfig, loginConfig) {
        'use strict';

        //依赖的模块
        var dependence = ['ui.router',
            'oc.lazyLoad',
            'ui.ey-ui',
            homeConfig.name,
            loginConfig.name
        ];

        var app = angular.module('framework', dependence);

        //模块配置
        app.config(['$locationProvider', '$urlRouterProvider','$ocLazyLoadProvider',
            function($locationProvider, $urlRouterProvider,$ocLazyLoadProvider) {
                $ocLazyLoadProvider.config({   //按需加载配置项
                    asyncLoader: require,  //jsLoader: require,
                    debug: true
                });
                $locationProvider.hashPrefix('');
                $urlRouterProvider.otherwise('/left/home'); //默认跳转至主页
            }
        ]);

        app.controller('bottomCtrl', bottomCtrl);
        app.controller('topCtrl', topCtrl);

        return app;
    });
