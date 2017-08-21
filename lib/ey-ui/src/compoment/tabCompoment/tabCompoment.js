/**
 * 页签组件
 * @param  {[type]} compoment)       {                                                   'use strict';        var compoment [description]
 * @param  {[type]} controller:      ["$scope"       [description]
 * @param  {[type]} function($scope) {                                                                                                    this.setCurrentItem [description]
 * @param  {[type]} link:            function(scope, element,      attr [description]
 * @return {[type]}                  [description]
 */
define('/ey-ui/compoment/tabCompoment', ['/ey-ui/compoment/compoment'],
    function(compoment) {
        'use strict';

        var compoment = angular.module(compoment);
        compoment.directive("eyuiTabs", function() {
            return {
                restrict: "E",
                templateUrl: "tabCompoment/tpl/eyuiTabs-tpl.html",
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
                templateUrl: "tabCompoment/tpl/eyuiTabItem-tpl.html",
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