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