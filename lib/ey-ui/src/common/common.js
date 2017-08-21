
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
