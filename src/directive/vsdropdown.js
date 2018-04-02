/**
 * @ngdoc object
 * @name vsdropdown
 * @description vsdropdown is main directive of the component.
 * 
 * options : {
 *  visiblePropName: string
 *  multiple: number
 *  itemHeight: number
 *  makeItemText: function
 *  makeSelectText: function
 *  itemSelectCb: function
 *  view: {
 *       overlayText: string,
 *       propertyTitle: string,
 *       valueTitle: string
 *  },
 *  filter:{
 *       enabled: boolean,
 *       filterPlaceholderTxt: string,
 *       filtering: function
 *   }
 * }
 * 
 */
module.exports = ['$parse', 'throttle', function ($parse, throttle) {
    return {
        restrict: 'EA',
        require: ['^vsDropdown'],
        template: require('pug/vsdropdown.pug'),
        scope: {
            selectedItems: '=',
            options: '='
        },
        controllerAs: 'vdCtrl',
        link: function (scope, element, attrs, ctrls) {
            var vdCtrl = ctrls[0] || {},
                scrollContent = element[0].querySelector('.vd-items');

            function initSelectedItems(){
                if(!scope.selectedItems || !(scope.selectedItems instanceof Array)){
                    var getter = $parse(attrs.selectedItems),
                        setter = getter.assign,
                        selectedItems = getter(scope.$parent);

                    if(!selectedItems || !(selectedItems instanceof Array)){
                        setter(scope.$parent, scope.selectedItems ? [scope.selectedItems] : []);   
                    }
                }
            }

            initSelectedItems();
            vdCtrl.applyItems(attrs.items);

            scope.filterText = '';

            scope.$watch('filterText', throttle(function(){
                vdCtrl.filtering();
                if(scrollContent) scrollContent.scrollTop = 0;
            }, 30));
            
            scope.$watch('selectedItems', initSelectedItems);
            scope.$watch('options', vdCtrl.applyOptions);

            attrs.$observe('items', vdCtrl.applyItems);
            attrs.$observe('placeholder', function(placeholder){
                if(placeholder) vdCtrl.placeholder = placeholder;
            });
        },
        controller: [
            '$scope', '$filter','vdConfig', 
            function ($scope, $filter, vdConfig) {
                var self = this,
                    itemsGetter;

                this.options = {};
                this.filterdItems = [];
                this.showOverlay = false;
                this.showSelector = false;

                Object.defineProperties(this, {
                    items: {
                        get: function(){
                            if(itemsGetter){
                                return itemsGetter($scope.$parent);
                            }else return [];
                        }
                    },
                    visiblePropName: {
                        get: function(){
                            return (this.options && this.options.visiblePropName);
                        }
                    }
                });

                function notifyParent(item, operator) {
                    if (self.options && typeof self.options.itemSelectCb === 'function'){
                        self.options.itemSelectCb($scope.selectedItems, item, operator);
                    }
                }

                function processNestedObject(prop, item) {
                    var parts = prop.split(vdConfig.DOT_SEPARATOR);
                    var tempVal = angular.copy(item);
                    angular.forEach(parts, function (p) {
                        tempVal = tempVal[p];
                    });
                    return tempVal;
                }

                Object.assign(this, {
                    applyItems: function(itemsString){
                        if(itemsString){
                            itemsGetter = $parse(itemsString);
                        }
                    },
                    applyOptions: function(options){
                        if(typeof options === 'object'){
                            self.options 
                                = Object.assign(
                                    {},
                                    vdConfig.BASIC_OPTION, 
                                    options || {}
                                )
        
                            var itemHeight = parseInt(self.options.itemHeight);
                                multiple = parseInt(self.options.multiple);
        
                            if(isNaN(multiple) || multiple < 1){
                                self.options.multiple = 1;
                            }else{
                                self.options.multiple = multiple;
                            }

                            if(isNaN(itemHeight) || itemHeight < 16){
                                self.options.itemHeight = 16;
                            }else{
                                self.options.itemHeight = itemHeight;
                            }
        
                            self.options.view = 
                                Object.assign(
                                    {},
                                    vdConfig.BASIC_VIEW,
                                    self.options.view || {}
                                )
                            self.options.filter = 
                                Object.assign(
                                    {},
                                    vdConfig.BASIC_FILTER,
                                    self.options.filter || {}
                                )
                        }
                    },
                    isObject: function(item){
                        return (typeof item === 'object');
                    },
                    closeAll: function(){
                        self.showOverlay = false;
                        self.showSelector = false;
                    },
                    toggleSelector: function (state) {
                        if(state != null) self.showOverlay = state;
                        else self.showSelector = !self.showSelector;

                        if(self.showSelector && self.showOverlay) self.showOverlay = false;
                    },
                    toggleOverlay: function (state) {   
                        if(state != null) self.showOverlay = state;
                        else self.showOverlay = !self.showOverlay;

                        if(self.showOverlay && self.showSelector) self.showSelector = false;
                    },
                    itemClicked: function (item, index, event) {
                        var _index = self.IndexofItemSelected(item),
                            options = self.options || {multiple: 1};
    
                        if (_index === -1) {
                            self.addItem(item, event);
                        }else {
                            self.removeItem(_index, event);
                        }
    
                        if(options.multiple === 1) {
                            self.showSelector = false;
                        }
                    },
                    addItem: function (item, event) {
                        if(event) event.stopPropagation();
    
                        var options = self.options || {multiple: 1},
                            selectedItems = $scope.selectedItems;
    
                        if (options.multiple > 1) {
                            if (selectedItems.length === options.multiple) {
                                self.removeItem(selectedItems.length - 1, event);
                            }
    
                            selectedItems.push(item);
                        }else {
                            selectedItems[0] = item;
                        }
                        
                        notifyParent(item, vdConfig.OPERATION_ADD);
                    },
                    removeItem: function (index, event) {
                        event.stopPropagation();
    
                        var selectedItems = $scope.selectedItems,
                            item = selectedItems[index];
    
                        if (selectedItems.length === 1){
                            self.toggleOverlay(false);
                        }
    
                        selectedItems.splice(index, 1);
    
                        notifyParent(item, vdConfig.OPERATION_DEL);
                    },
                    isItemSelected: function (item) {
                        return self.IndexofItemSelected(item) !== -1;
                    },
                    IndexofItemSelected: function (item) {
                        var options = self.options,
                            selectedItems = $scope.selectedItems;

                        if(typeof item === 'object'){
                            var objectCompare = options.objectCompare;
                            
                            if(typeof objectCompare === 'function'){
                                for(var idx=0;idx< selectedItems.length;idx++){
                                    if(objectCompare(selectedItems[idx], item)) return idx;
                                }

                                return -1;
                            }
                        }

                        return $scope.selectedItems.indexOf(item);
                    },
                    getPropertyValue: function (prop, item) {
                        var returned,
                            isObject = (typeof item === 'object');

                        if(self.options && typeof self.options.makeItemText === 'function'){
                            returned = self.options.makeItemText(item);
                        }else if (prop == null) {
                            returned = item;
                        }else if(isObject){
                            if(prop.indexOf(vdConfig.DOT_SEPARATOR) === -1){
                                returned = item[prop];
                            }else{
                                returned = processNestedObject(prop, item);
                            }
                        }
    
                        return returned || '알 수 없음';
                    },    
                    getViewProperties: function(item){
                        return self.options.view.properties || Object.keys(item);
                    },
                    getSelectText: function(items){
                        var returned;

                        if(self.options && typeof self.options.makeSelectText === 'function'){
                            returned = self.options.makeSelectText(items);
                        }else if(items[0]){
                            returned = self.getPropertyValue(self.visiblePropName, items[0]);
                        }else{
                            returned = self.placeholder;
                        }

                        return returned || '아이템 선택';
                    },
                    filtering: (function(){
                        var lastFilter;

                        return function(){
                            var filter = $scope.filterText,
                                filtering = $filter('filter');

                            if(lastFilter !== filter){
                                var items = self.items;

                                if(typeof filter === 'string' && filter.length){
                                    if(self.options && (typeof self.options.filtering === 'function')){
                                        filtering = self.options.filtering
                                    }

                                    return (self.filterdItems = filtering(self.items, filter));
                                }else return (self.filterdItems = self.items);

                                lastFilter = filter;
                            }else return self.filterdItems;
                        }
                    })(),
                    clearFilter: function () {
                        $scope.filterText = '';
                    }
                });
            }
        ]
    };
}];
