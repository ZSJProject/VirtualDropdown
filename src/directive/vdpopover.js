/**
 * @ngdoc object
 * @name popoverWindow
 * @description popoverWindow directive implements popover window which show all properties of the item.
 */
module.exports = ['$compile', function ($compile) {
    return {
        restrict: 'A',
        scope: false,
        controllerAs: 'vdPopoverCtrl',
        controller: [
            '$scope', '$compile', 'vdConfig',
            function ($scope, $compile, vdConfig) {
                var self = this;
                
                this.popover = null;
                this.options = {};

                this.showProperties = function(event) {
                    if(event) event.stopPropagation();

                    if (angular.equals(this.popover, null)) {
                        this.popover = angular.element(require('pug/vdpopover.pug'));
                        element.append($compile(this.popover)($scope));
                    }
                    else {
                        this.closeProperties();
                    }
                };

                this.closeProperties = function (event) {
                    if(event) event.stopPropagation();

                    if(!angular.equals(this.popover, null)) {
                        this.popover.remove();
                        this.popover = null;
                    }
                };

                $scope.$on(vdConfig.OPTION_UPDATE_EVENT, function(options){
                    self.options = (options.input && options.input.properties) || {};
                });
            }
        ]
    };
}];
