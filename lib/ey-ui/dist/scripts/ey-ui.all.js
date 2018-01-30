var compoment = angular.module('ui.ey-ui', []);
define('/ey-ui/compoment/compoment', [],
    function() {
        'use strict';
        var com = angular.module('ui.ey-ui');
        return com.name;
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

define('/ey-ui/compoment/accordionCompoment', ['/ey-ui/compoment/compoment'],
    function(compoment) {
        'use strict';

        var compoment = angular.module(compoment);
        compoment.constant('eyuiAccordionConfig', {
          closeOthers: true
        })

        compoment.controller('eyuiAccordionController', ['$scope', '$attrs', 'eyuiAccordionConfig', function($scope, $attrs, accordionConfig) {
          // This array keeps track of the accordion groups
          this.groups = [];

          // Ensure that all the groups in this accordion are closed, unless close-others explicitly says not to
          this.closeOthers = function(openGroup) {
            var closeOthers = angular.isDefined($attrs.closeOthers) ?
              $scope.$eval($attrs.closeOthers) : accordionConfig.closeOthers;
            if (closeOthers) {
              angular.forEach(this.groups, function(group) {
                if (group !== openGroup) {
                  group.isOpen = false;
                }
              });
            }
          };

          // This is called from the accordion-group directive to add itself to the accordion
          this.addGroup = function(groupScope) {
            var that = this;
            this.groups.push(groupScope);

            groupScope.$on('$destroy', function(event) {
              that.removeGroup(groupScope);
            });
          };

          // This is called from the accordion-group directive when to remove itself
          this.removeGroup = function(group) {
            var index = this.groups.indexOf(group);
            if (index !== -1) {
              this.groups.splice(index, 1);
            }
          };
        }]);

        // The accordion directive simply sets up the directive controller
        // and adds an accordion CSS class to itself element.
        compoment.directive('eyuiAccordion', function() {
          return {
            controller: 'eyuiAccordionController',
            controllerAs: 'accordion',
            transclude: true,
            templateUrl: function(element, attrs) {
              return attrs.templateUrl || 'accordionCompoment/tpl/accordion.html';
            }
          };
        });

        // The accordion-group directive indicates a block of html that will expand and collapse in an accordion
        compoment.directive('eyuiAccordionGroup', function() {
          return {
            require: '^eyuiAccordion',         // We need this directive to be inside an accordion
            transclude: true,              // It transcludes the contents of the directive into the template
            restrict: 'A',
            templateUrl: function(element, attrs) {
              return attrs.templateUrl || 'accordionCompoment/tpl/accordionGroup.html';
            },
            scope: {
              heading: '@',               // Interpolate the heading attribute onto this scope
              panelClass: '@?',           // Ditto with panelClass
              isOpen: '=?',
              isDisabled: '=?'
            },
            controller: function() {
              this.setHeading = function(element) {
                this.heading = element;
              };
            },
            link: function(scope, element, attrs, accordionCtrl) {
              element.addClass('panel');
              accordionCtrl.addGroup(scope);

              scope.openClass = attrs.openClass || 'panel-open';
              scope.panelClass = attrs.panelClass || 'panel-default';
              scope.$watch('isOpen', function(value) {
                element.toggleClass(scope.openClass, !!value);
                if (value) {
                  accordionCtrl.closeOthers(scope);
                }
              });

              scope.toggleOpen = function($event) {
                if (!scope.isDisabled) {
                  if (!$event || $event.which === 32) {
                    scope.isOpen = !scope.isOpen;
                  }
                }
              };

              var id = 'accordiongroup-' + scope.$id + '-' + Math.floor(Math.random() * 10000);
              scope.headingId = id + '-tab';
              scope.panelId = id + '-panel';
            }
          };
        })

        // Use accordion-heading below an accordion-group to provide a heading containing HTML
        compoment.directive('eyuiAccordionHeading', function() {
          return {
            transclude: true,   // Grab the contents to be used as the heading
            template: '',       // In effect remove this element!
            replace: true,
            require: '^eyuiAccordionGroup',
            link: function(scope, element, attrs, accordionGroupCtrl, transclude) {
              accordionGroupCtrl.setHeading(transclude(scope, angular.noop));
            }
          };
        });

        compoment.directive('eyuiAccordionTransclude', function() {
          return {
            require: '^eyuiAccordionGroup',
            link: function(scope, element, attrs, controller) {
              scope.$watch(function() { return controller[attrs.eyuiAccordionTransclude]; }, function(heading) {
                if (heading) {
                  var elem = angular.element(element[0].querySelector(getHeaderSelectors()));
                  elem.html('');
                  elem.append(heading);
                }
              });
            }
          };

          function getHeaderSelectors() {
              return 'eyui-accordion-header,' +
                  '[eyui-accordion-header]'
          }
        });
    }
);
/**
 * 拖拽面板
 * @param  {[type]} compoment)       {'use strict';  var compoment [description]
 * @param  {[type]} controller:      ["$scope"       [description]
 * @param  {[type]} function($scope) {                                                                                                    this.setCurrentItem [description]
 * @param  {[type]} link:            function(scope, element,      attr [description]
 * @return {[type]}                  [description]
 */
define('/ey-ui/compoment/dragPanelCompoment', ['/ey-ui/compoment/compoment'],
    function(compoment) {
       var compoment = angular.module(compoment);
        compoment.directive("eyuiDragPanel", function() {
            return {
                restrict: "E",
                templateUrl: "dragPanelCompoment/tpl/eyuiDragPanel-tpl.html",
                replace: true,
                transclude: true,
                controller: function() {
                },
                scope: {
                    header: "@header"
                },
                link: function link(scope,iElement,iAttrs,controller,transcludeFn){
                   bindDragFn(iElement);

                   scope.closeThis = function(element) {
                       $(iElement[0]).remove();
                   };

                   function bindDragFn(iElement){
                     $(iElement[0]).on({
                        mousedown: function (e) {
                            e.stopPropagation();
                            var el = $(this);
                            var os = el.offset(); 
                            var dx = e.pageX - os.left; 
                            var dy = e.pageY - os.top;
                            $(document).on('mousemove.drag', function (e) {
                                e.stopPropagation();
                                if(e.which === 1){
                                    //不允许超出父容器范围
                                    var mouse = e;
                                    var containOffset = $('body').offset();
                                    var containWidth = $('body').width();
                                    var containHeight = $('body').height();
                                    if(event.pageX < containOffset.left +dx){
                                        mouse.pageX = containOffset.left + dx;
                                    }
                                    if(event.pageX > containOffset.left + containWidth -el.width() +dx){
                                        mouse.pageX = containOffset.left + containWidth -el.width() +dx;
                                    }
                                    if(event.pageY < containOffset.top + dy){
                                        mouse.pageY = containOffset.top + dy;
                                    }
                                    if(event.pageY > containOffset.top + containHeight -el.height() +dy){
                                        mouse.pageY = containOffset.top + containHeight -el.height() +dy;
                                    }
                                    //设置鼠标移动时元素跟随位置
                                    el.offset({ top: mouse.pageY - dy, left: mouse.pageX - dx });  
                                }else{
                                    $(document).off('mousemove.drag');
                                }
                            });
                        },
                        mouseup: function (e) {
                            $(document).off('mousemove.drag');
                        }
                    });
                   }
                }
              }
        });
    });
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


define('/ey-ui/compoment/slideFollowCompoment', ['/ey-ui/compoment/compoment'],
  function(compoment) {
      'use strict';

      var compoment = angular.module(compoment);

      compoment.directive("eyuiSlideFollow", ['$timeout', function($timeout) {
              return {
                  restrict: 'E',
                  replace: false,
                  scope: {
                      id: "@",
                      datasetData: "="
                  },
                  template: "<div class='eyui-slide-follow'><ul class='slide'><li ng-repeat = 'data in datasetData'>{{data.option}}</li></ul></div>",
                  link: function(scope, elem, attrs) {
                      $timeout(function() {
                          var className = $(elem).find('ul');
                          var i = 0,
                              sh;
                          var liLength = className.children("li").length;
                          var liHeight = className.children("li").height() + parseInt(className.children("li").css('border-bottom-width'));
                          className.html(className.html() + className.html());
                          // 开启定时器
                          sh = setInterval(slide, 4000);

                          function slide() {
                              if (parseInt(className.css("margin-top")) > (-liLength * liHeight)) {
                                  i++;
                                  className.animate({
                                      marginTop: -liHeight * i + "px"
                                  }, "slow");
                              } else {
                                  i = 0;
                                  className.css("margin-top", "0px");
                              }
                          }
                          // 清除定时器
                          className.hover(function() {
                              clearInterval(sh);
                          }, function() {
                              clearInterval(sh);
                              sh = setInterval(slide, 4000);
                          })
                      }, 0)
                  }
              }
          }])



      compoment.directive("eyuiScrollHorizontal", ['$timeout', function($timeout) {
              return {
                  restrict: 'E',
                  replace: true,
                  scope: {
                      datasetTxt: "="
                  },
                  template: "<div class='eyui-croll-orizontal'><div class='inner'><p class='txt'>{{datasetTxt}}</p></div></div>",
                  link: function(scope, elem, attrs) {
                      $timeout(function() {
                        var wrapper = elem[0];
                        var inner = wrapper.getElementsByTagName('div')[0];
                        var p = document.getElementsByTagName('p')[0];
                        var p_w = p.offsetWidth;
                        var wrapper_w = wrapper.offsetWidth;
                        if(wrapper_w > p_w){ return false;}
                        inner.innerHTML+=inner.innerHTML;
                        var timeOutFn = $timeout(fun1,2000); 
                        function fun1(){
                          if(p_w > wrapper.scrollLeft){
                            wrapper.scrollLeft++;
                            $timeout.cancel(timeOutFn);
                            timeOutFn = $timeout(fun1,30);
                          }
                          else{
                            $timeout.cancel(timeOutFn);
                            timeOutFn = $timeout(fun2,2000);
                          }
                        }
                        function fun2(){
                          wrapper.scrollLeft=0;
                          fun1();
                        }

                        // 清除定时器
                        elem.hover(function() {
                            $timeout.cancel(timeOutFn);
                        }, function() {
                            $timeout.cancel(timeOutFn);
                            timeOutFn = $timeout(fun1,30);
                        })
                      },0)
                  }
              }
          }])
    });
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
angular.module('ui.ey-ui').run(['$templateCache', function($templateCache) {$templateCache.put('accordionCompoment/tpl/accordion.html','<div role="tablist" class="panel-group" ng-transclude></div>');
$templateCache.put('accordionCompoment/tpl/accordionGroup.html','<div role="tab" id="{{::headingId}}" aria-selected="{{isOpen}}" class="panel-heading" ng-keypress="toggleOpen($event)">\r\n  <h4 class="panel-title">\r\n    <a role="button" data-toggle="collapse" href aria-expanded="{{isOpen}}" aria-controls="{{::panelId}}" tabindex="0" class="accordion-toggle" ng-click="toggleOpen()" uib-accordion-transclude="heading" ng-disabled="isDisabled" uib-tabindex-toggle><span uib-accordion-header ng-class="{\'text-muted\': isDisabled}">{{heading}}</span></a>\r\n  </h4>\r\n</div>\r\n<div id="{{::panelId}}" aria-labelledby="{{::headingId}}" aria-hidden="{{!isOpen}}" role="tabpanel" class="panel-collapse collapse" uib-collapse="!isOpen">\r\n  <div class="panel-body" ng-transclude></div>\r\n</div>\r\n');
$templateCache.put('dragPanelCompoment/tpl/eyuiDragPanel-tpl.html','<div class="eyui-drag">\r\n   <div class="eyui-drag-header">\r\n         <div class="eyui-drag-title unselectable">{{header}}</div>\r\n         <div class="eyui-drag-tools">\r\n            <i class="closeBtn" ng-click="closeThis()"></i>\r\n         </div>\r\n   </div>\r\n   <div class="eyui-drag-content" ng-transclude>\r\n   </div>\r\n</div>');
$templateCache.put('leftMenuCompoment/tpl/eyuiLeftMenu-sub-tpl.html','<a ng-bind=\'menu.label\' ng-click=\'clickFn(menu)\' ng-class=\'{selected:menu.selected && !menu.sub}\' ng-href=\'{{menu.href}}\'></a>\r\n<i ng-if=\'menu.sub\' class=\'collapsed\'>&gt;</i>\r\n<ul ng-if=\'menu.sub\' ng-class=\'{collapsed:menu.collapsed}\'>\r\n    <li ng-repeat=\'menu in menu.sub\' ng-include=\'"leftMenuCompoment/tpl/eyuiLeftMenu-sub-tpl.html"\'></li>\r\n</ul>\r\n');
$templateCache.put('leftMenuCompoment/tpl/eyuiLeftMenu-tpl.html','<ul>\r\n    <li ng-repeat=\'menu in menuList\' ng-include=\'"leftMenuCompoment/tpl/eyuiLeftMenu-sub-tpl.html"\'></li>\r\n</ul>\r\n\r\n');
$templateCache.put('tabCompoment/tpl/eyuiTabItem-tpl.html','<div ng-bind=\'item.label\' ng-click=\'clickFn()\' class=\'eyui-tabs-item\' ng-class="{\'eyui-tabs-item-active\':active}">\r\n</div>\r\n');
$templateCache.put('tabCompoment/tpl/eyuiTabs-tpl.html','<div class=\'eyui-tabs\'>\r\n    <div ng-transclude class=\'eyui-tabs-head\'></div>\r\n    <div ng-bind-html=\'currentItem.detail | eyui_to_trusted\' class=\'eyui-tabs-detail\'></div>\r\n</div>\r\n');}]);
/**
 * [description]
 * @param  {[type]} ) {}          [description]
 * @return {[type]}   [description]
 */
require(['/ey-ui/compoment/compoment',
	'/ey-ui/util/filter',
    '/ey-ui/compoment/tabCompoment',
    '/ey-ui/compoment/leftMenuCompoment',
    '/ey-ui/compoment/accordionCompoment',
    '/ey-ui/compoment/dragPanelCompoment',
    '/ey-ui/compoment/slideFollowCompoment'
], function() {
});