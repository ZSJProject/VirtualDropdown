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

    $scope.selectedItems = [];
    $scope.items = [{
                "id": "a0",
                "children": 0,
                "caption": "전국",
                "list": null
            },
            {
                "id": "a1",
                "children": 1,
                "caption": "서울",
            },
            {
                "id": "a101",
                "parent": "a1",
                "children": 6,
                "caption": "소계(도심지역)"
            },
            {
                "id": "a10101",
                "parent": "a101",
                "children": 0,
                "caption": "광화문",
                "list": null
            },
            {
                "id": "a10102",
                "parent": "a101",
                "children": 0,
                "caption": "동대문",
                "list": null
            },
            {
                "id": "a10103",
                "parent": "a101",
                "children": 0,
                "caption": "명동",
                "list": null
            },
            {
                "id": "a10104",
                "parent": "a101",
                "children": 0,
                "caption": "서울역",
                "list": null
            },
            {
                "id": "a10105",
                "parent": "a101",
                "children": 0,
                "caption": "종로",
                "list": null
            },
            {
                "id": "a10106",
                "parent": "a101",
                "children": 0,
                "caption": "충무로",
                "list": null
            }
        ];

    /*

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
    }*/

});