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
                    "<div>" +
                    "<div ng-transclude class='eyui-tabs-head'></div>" +
                    "<div ng-bind-html='currentItem.detail | eyui_to_trusted' class='eyui-tabs-detail'></div>" +
                    "</div>");
                $templateCache.put("eyuiTabItem-template.html",
                    "<div ng-bind='item.label' ng-click='clickFn()' class='eyui-tabs-item'" +
                    "ng-class=\"{'eyui-tabs-item-active':active}\"></div>");
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


require(['/ey-ui/util/filter',
    '/ey-ui/compoment/ey-ui-templates',
    '/ey-ui/compoment/tabCompoment'
], function() {})
