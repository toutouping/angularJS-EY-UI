define([],
    function() {
        'use strict';

        var sideFollowCtrl = ['$scope','$templateCache', function($scope,$templateCache) {
          $scope.datasetData = [
				{option : "这个是第一条数据"},
				{option : "这个是第二条数据"},
				{option : "这个是第三条数据"},
				{option : "这个是第四条数据"},
				{option : "这个是第五条数据"},
				{option : "这个是第六条数据"}
			];

            $scope.datasetTxt = "文字如果超出了宽度自动向左滚动文字如果超出了宽度自动向左滚动。";
        }];

        var homeModule = angular.module('homeModule');
        homeModule.controller('sideFollowCtrl', sideFollowCtrl);


    }());
