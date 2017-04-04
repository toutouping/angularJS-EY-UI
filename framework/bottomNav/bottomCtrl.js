/**
 * 页面底部控制器
 * @param  {Array} 
 * @return {[type]}
 */
define([],function(){
    'use strict';

     var bottomCtrl =  ['$scope', function($scope){
     	$scope.bottomTemplate = "framework/bottomNav/footer.html";
     }];
     
    return bottomCtrl;
});