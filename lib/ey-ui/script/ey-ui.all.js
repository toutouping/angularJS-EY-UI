define('/ey-ui/compoment/compoment', [],
    function() {
        'use strict';
        var compoment = angular.module('ui.ey-ui', []);
        return compoment.name;
    }
);


/******************************* 过滤器 **********************************/
define('/ey-ui/util/filter', ['/ey-ui/compoment/compoment'],
    function(compoment) {
        'use strict';
        var compoment = angular.module(compoment);
        compoment.filter('eyui_to_trusted', ['$sce', function($sce) {
            return function(text) {
                return $sce.trustAsHtml(text);
            };
        }]);
    }
);


/******************************* 模板 **********************************/
define('/ey-ui/compoment/ey-ui-templates', ['/ey-ui/compoment/compoment'],
    function(compoment) {
        'use strict';
        angular.module(compoment)
            .run(function($templateCache) {
                /******************************* 页签组件模板 **********************************/
                $templateCache.put("eyuiTabs-template.html",
                    "<div class='eyui-tabs'>" +
                    "<div ng-transclude class='eyui-tabs-head'></div>" +
                    "<div ng-bind-html='currentItem.detail | eyui_to_trusted' class='eyui-tabs-detail'></div>" +
                    "</div>");
                $templateCache.put("eyuiTabItem-template.html",
                    "<div ng-bind='item.label' ng-click='clickFn()' class='eyui-tabs-item'" +
                    "ng-class=\"{'eyui-tabs-item-active':active}\"></div>");
                /******************************* 左侧菜单栏模板 **********************************/
                $templateCache.put("eyuiLeftMenu-sub-template.html",
                    "<span ng-class='{selected :menu.selected && !menu.sub}'></span>"+
                    "<a ng-bind='menu.label' ng-click='clickFn(menu)' ng-class='{selected:menu.selected && !menu.sub}'ng-href='{{menu.href}}'></a>" +
                    "<i ng-if='menu.sub' class='collapsed'>&gt;</i>" +
                    "<ul ng-if='menu.sub' ng-class='{collapsed:menu.collapsed}'>" +
                    "<li ng-repeat='menu in menu.sub'ng-include='\"eyuiLeftMenu-sub-template.html\"'></li>" +
                    "</ul>");
                $templateCache.put("eyuiLeftMenu-template.html",
                    "<ul><li ng-repeat='menu in menuList' ng-include='\"eyuiLeftMenu-sub-template.html\"'></li>" +
                    "</ul>");
                /******************************* xxx **********************************/

            });
    }
);

/******************************* 页签组件 **********************************/
define('/ey-ui/compoment/tabCompoment', ['/ey-ui/compoment/compoment'],
    function(compoment) {
        'use strict';

        var compoment = angular.module(compoment);
        compoment.directive("eyuiTabs", function() {
            return {
                restrict: "E",
                templateUrl: "eyuiTabs-template.html",
                replace: true,
                transclude: true,
                scope: {
                    currentItem: "=",
                },
                controller: ["$scope", function($scope) {
                    this.setCurrentItem = function(currentItem) {
                        $scope.currentItem = currentItem;
                    }
                    this.setCurrentItem($scope.$parent.currentItem);
                    this.eyuiTabScope = $scope;
                }],
                link: function(scope, element, attr) {

                }
            }
        });
        compoment.directive("eyuiTabsItem", function() {
            return {
                restrict: "E",
                templateUrl: "eyuiTabItem-template.html",
                replace: true,
                require: "?^eyuiTabs",
                scope: {
                    item: "="
                },
                link: function(scope, element, attr, eyuiTabsCtrl) {
                    scope.clickFn = function() {
                        eyuiTabsCtrl.setCurrentItem(scope.item);
                    }
                    eyuiTabsCtrl.eyuiTabScope.$watch("currentItem", function(newValue, oldValue) {
                        if (!newValue) {
                            return;
                        }
                        if (scope.item.id === newValue.id) {
                            scope.active = true;
                        } else {
                            scope.active = false;
                        }
                    });
                }
            }
        });
    }
);
/******************************* 左侧菜单组件 **********************************/
define('/ey-ui/compoment/leftMenuCompoment', ['/ey-ui/compoment/compoment'],
    function(compoment) {
        'use strict';

        var compoment = angular.module(compoment);
        compoment.directive("eyuiLeftMenu", function() {
            return {
                restrict: "E",
                templateUrl: "eyuiLeftMenu-template.html",
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


require(['/ey-ui/util/filter',
    '/ey-ui/compoment/ey-ui-templates',
    '/ey-ui/compoment/tabCompoment',
    '/ey-ui/compoment/leftMenuCompoment'
], function() {})
