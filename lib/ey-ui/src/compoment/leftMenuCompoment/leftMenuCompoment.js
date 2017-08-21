/**
 * 左侧菜单组件
 * @param  {[type]} compoment)       {                                         'use strict';        var compoment [description]
 * @param  {[type]} controller:      ["$scope"       [description]
 * @param  {[type]} function($scope) {                                                                                          this.setMenuList [description]
 * @param  {[type]} link:            function(scope, element,      attr) {                                                                                                          function resetSelected(itemList){                          $.each(itemList,function(key,val){                              itemList[key].selected [description]
 * @return {[type]}                  [description]
 */
define('/ey-ui/compoment/leftMenuCompoment', ['/ey-ui/compoment/compoment'],
    function(compoment) {
        'use strict';

        var compoment = angular.module(compoment);
        compoment.directive("eyuiLeftMenu", function() {
            return {
                restrict: "E",
                templateUrl: "leftMenuCompoment/tpl/eyuiLeftMenu-tpl.html",
                replace: true,
                scope: {
                    menuList: "=",
                },
                controller: ["$scope", function($scope) {
                    this.setMenuList = function(menuList) {
                        $scope.menuList = menuList;
                    }
                    this.setMenuList($scope.$parent.menuList);
                }],
                link: function(scope, element, attr) {
                    //重置选择项
                    function resetSelected(itemList){
                          $.each(itemList,function(key,val){
                              itemList[key].selected =  false;
                              if(!!val.sub){
                                 resetSelected(val.sub);
                              }
                          })
                    }

                    scope.clickFn = function(node) {
                        node.collapsed = ! node.collapsed; //是否闭合
                        if(!node.sub){
                            resetSelected(scope.menuList);
                            node.selected =  true;
                        }
                    }
                }
            }
        });
    }
);

