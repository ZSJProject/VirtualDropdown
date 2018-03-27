/**
 * @ngdoc object
 * @name vsdropdown
 * @description vsdropdown is module of the vsdropdown
 */

 angular.module('vsdropdown', [])
        .constant('vdConfig', require('./config/vdconfig'))
        .directive('vdPopover', require('./directive/vdpopover'))
        .directive('vsDropdown', require('./directive/vsdropdown'));