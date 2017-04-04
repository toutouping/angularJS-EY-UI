/**
 * 页面头部控制器
 * @param  {Array} 
 * @return {[type]}
 */
define([], function() {
    'use strict';

    var topCtrl = ['$scope', function($scope) {
         $scope.topTemplate = "framework/topNav/top.html";
    }];

    return topCtrl;
});
