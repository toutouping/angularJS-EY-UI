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
                            timeOutFn = $timeout(fun1,30);
                          }
                          else{
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
                            var timeOutFn = $timeout(fun1,30);
                        })
                      },0)
                  }
              }
          }])
    });