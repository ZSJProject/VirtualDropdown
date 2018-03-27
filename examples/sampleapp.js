/**
 * @ngdoc object
 * @name sampleapp
 * @description Module which uses the vsdropdown component.
 */
var sampleapp = angular.module('sampleapp', ['kr-input', 'vs-repeat','throttle','vsdropdown']);

/**
 * @ngdoc object
 * @name sampleappctrl1
 * @description Controller which uses the vsdropdown component. Multiple selection. String array as input.
 */
sampleapp.controller('sampleappctrl1', function ($scope) {

    var items = $scope.items = [],
        selectedItems = $scope.selectedItems = [];

    $scope.$watch('selectedItems', function (newVal, oldVal) {
        if (newVal !== oldVal) {
            console.log('PARENT - watch: ', newVal);
        }
    }, true);

    var generatedCount = 10000;
    generateItems();

    // Configuration of the vsdropdown
    $scope.opt = {
        multiple: 20
    };

    // generate test items to the vsdropdown
    function generateItems() {
        for (var i = 0; i < generatedCount; i++) {
            items.push({
                item: 'Item #' + (i + 1),
                test: '123'
            })
        }
        // Set selcted item indecies 1 and 9999
        selectedItems.push(items[0]);
        selectedItems.push(items[999]);
    }

});