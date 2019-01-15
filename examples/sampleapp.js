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
    $scope.opt = {
        item: {
            multiple: 10,
            property: {
                key: 'item',
                value: 'test'
            }
        }
    };
    $scope.selectedItems = [];
    $scope.items = [];

    var generatedCount = 10000;

    generateItems();

    function generateItems() {
        for (var i = 0; i < generatedCount; i++) {
            $scope.items.push({
                item: 'Item #' + (i + 1),
                test: '123 - ' + (i + 1)
            })
        }

        // Set selcted item indecies 1 and 9999
        $scope.selectedItems.push($scope.items[0]);
        $scope.selectedItems.push($scope.items[999]);
    }

});