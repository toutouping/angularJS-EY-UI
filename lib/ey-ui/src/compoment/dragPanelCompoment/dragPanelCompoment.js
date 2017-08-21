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