/**
 * dropdown controller
 */

import checkObject from 'checkObject'
import is from '@sindresorhus/is';
import get from 'lodash.get';

import ClassName from './index.scss'

export const 
    ConfigSchema = {
        item: {
            __regexp__: /item/,
            height: [/^height$/, 32, 'number'],
            multiple: [/^multiple$/, 10, 'number'],
            property: {
                __regexp__: /property/,
                key: [/^key$/, null, ['string', 'function_']],
                value: [/^value|name$/, null, ['string', 'function_']]
            }
        },
        view: {
            __regexp__: /view/,
            overlayText: [/^overlaytext$/, '선택된 아이템', 'string']
        },
        filter: {
            __regexp__: /filter/,
            enable: [/^enable$/, true, 'boolean'],
            placeholder: [/^placeholder$/, '필터', 'string'],
            function: [/^func(tion)?$/, null, 'function']
        },
        counter: {
            __regexp__: /counter/,
            enable: [/^enable$/, true, 'boolean'],
        }
    },
    DialogEnum = {
        NONE: 0,
        SELECTOR: 1,
        OVERLAY: 2
    };

export default function(
    $scope, $element, $filter
){
    'ngInject';

    let prevHash;

    Object.defineProperties(this, {
        showItems: {
            get: () => {
                switch(this.DialogState){
                    case DialogEnum.OVERLAY:
                        return this.selected;
                    case DialogEnum.SELECTOR:
                        return this.filteredItems;
                    default:
                        return [];
                }
            }
        }
    })

    Object.assign(this, {
        waiting: false,
        filteredItems: [],
        $onInit: () => {
            this.filtering = this.filtering || false;
            this.filteredItems = this.filteredItems || [];
            this.lastFilterText = null;
            this.DialogState = DialogEnum.NONE;
            $scope.DialogEnum = DialogEnum;
            
            this.$onChanges({selected: true});
        },
        $postLink: () => {
            const parentElement = $element[0];

            this.element = {
                dropdown: parentElement.querySelector('.' + ClassName.VsDropdown),
                itemView: parentElement.querySelector('.' + ClassName.ItemView),
                scrollContent: parentElement.querySelector('.vd-items')
            };

            const scrollContent = angular.element(this.element.scrollContent);

            scrollContent.off('scroll.vsdropdown');
            scrollContent.on('scroll.vsdropdown', (event) => {
                var scrollHeight = this.element.scrollContent.scrollHeight,
                    scrollTop = this.element.scrollContent.scrollTop,
                    height = this.element.scrollContent.offsetHeight;

                if(this.DialogState != DialogEnum.SELECTOR) return;

                if(scrollHeight - scrollTop <= height && !this.loading){
                    var result = this.onBottom();
                    
                    if(is.promise(result)){
                        this.loading = result;
                        $scope.$evalAsync();

                        (async () => {
                            await this.loading;

                            $scope.$evalAsync(() => {
                                this.loading = false;
                            });
                        })();
                    }
                }
            });
        },
        $onChanges: (changes) => {
            if(changes.items){
                this.filter();
            }

            if(changes.options){
                this.options = checkObject(this.options, ConfigSchema);
            }

            if(changes.selected){
                if(!is.array(this.selected)){
                    if(this.selected != null){
                        this.selected = [this.selected];
                    }else this.selected = [];
                }
            }
        },
        
        isAllSelected: () => {
            var multiple = get(this, 'options.item.multiple') || 10,
                itemsLength = Math.min(this.filteredItems.length, multiple),
                selectedLength = this.selected.length;

            return (itemsLength <= selectedLength);
        },
        isItemSelected: (item) => {
            return (this.indexOfItemSelected(item) !== -1);
        },

        filter: async () => {
            var options = get(this, 'options.filter') || {},
                filterText = $scope.filterText,
                filterer = options.function || $filter('filter');

            if(this.lastFilterText == null || this.lastFilterText !== filterText){
                if(this.loading){
                    if(this._filterTimer) clearTimeout(this._filterTimer);
                    
                    this._filterTimer = setTimeout(this.filter, 100);
                }else{
                    if(is.nonEmptyString(filterText)){
                        this.loading = filterer(this.items, filterText);
    
                        $scope.$evalAsync();
    
                        try{
                            const filtered = await this.loading;
    
                            if(is.nonEmptyArray(filtered)){
                                this.filteredItems = filtered;
                            }else this.filteredItems = [];
    
                            $scope.$evalAsync(() => {
                                this.loading = false;
                            });

                            this.lastFilterText = filterText;
    
                            if(filterText !== $scope.filterText){
                                this.filter();
                            }else $scope.$broadcast('vsRepeatUpdateTrigger', true);
                        }catch(error){
                            $scope.$evalAsync(() => {
                                this.loading = false;
                            });
                        }
                    }else{
                        this.filteredItems = this.items;
                        $scope.$broadcast('vsRepeatUpdateTrigger', true);
                    }
                }
            }else{
                this.filteredItems = this.items;
                $scope.$broadcast('vsRepeatUpdateTrigger', true);
            }
        },
        
        toggleAllSelect: () => {
            var multiple = get(this, 'options.item.multiple') || 10,
                selectedItems = this.selected;

            if(this.isAllSelected()){
                for(var idx=selectedItems.length;idx>=0;idx--){
                    this.removeItem(idx);
                }
            }else{
                var filteredItems = this.filteredItems,
                    remainLength = multiple - selectedItems.length;
                    
                if(remainLength > 0){
                    for(var idx=0;idx<filteredItems.length;idx++){
                        var item = filteredItems[idx];

                        if(remainLength <= 0) break;
                        else if(!this.isItemSelected(item)){
                            this.addItem(item);
                            remainLength--;
                        }
                    }
                }
            }
        },

        clickItem: (item, event) => {
            var 
                multiple = get(this, 'options.item.multiple') || 10,
                index = this.indexOfItemSelected(item);

            if(index !== -1){
                this.removeItem(index, event);
            }else{
                this.addItem(item, event);
            }

            if(multiple == 1) {
                this.dialogType = DialogEnum.NONE;
            }
        },
        addItem: function (item, event) {
            var multiple = get(this, 'options.item.multiple') || 10,
                selectedItems = this.selected,
                index;
                            
            if (multiple > 1) {
                if (selectedItems.length === multiple) {
                    this.removeItem(selectedItems.length - 1, event);
                }

                index = selectedItems.push(item) - 1;
            }else {
                selectedItems[0] = item;
                index = 0;
            }

            this.onAdd({ $item: item, $index: index, $event: event });

            if(event) event.stopPropagation();
        },
        removeItem: (index, event) => {
            var selectedItems = this.selected;

            if (selectedItems.length === 1){
                this.toggleDialog(DialogEnum.OVERLAY, false);
            }

            const item = (selectedItems.splice(index, 1) || [])[0];

            this.onRemove({ $item: item, $index: index, $event: event});

            if(event) event.stopPropagation();
        },
        indexOfItemSelected: (item) => {
            var options = get(this, 'options.item') || {},
                selectedItems = this.selected;
                
            return selectedItems.findIndex((_item) => {
                return (this.getPropertyKey(item) == this.getPropertyKey(_item));
            });
        },

        getPropertyKey: function(item) {
            var key = get(this, 'options.item.property.key');

            if(is.object(item)){
                if(is.string(key)){
                    return get(item, key);
                }else if(is.function_(key)){
                    return key(item);
                }else{
                    item = JSON.stringify(item);
                }
            }
            
            return item;
        },    

        getPropertyValue: function (item) {
            var key = get(this, 'options.item.property.value');

            if(is.object(item)){
                if(is.string(key)){
                    return (get(item, key) || '알 수 없음');
                }else if(is.function_(key)){
                    return (key(item) || '알 수 없음');
                }else{
                    item = JSON.stringify(item);
                }
            }
            
            return item;
        },
        getSelectText: function (items){
            return (this.getPropertyValue(items[0]) || this.placeholder || '선택');
        }, 

        clearFilter: function () {
            $scope.filterText = '';
        },

        toggleDialog: (type, bool) => {
            const 
                itemViewParent = this.element.itemView.parentElement,
                itemView = angular.element(this.element.itemView);

            if((bool === false) 
                || (type == DialogEnum.NONE)
                || (bool !== true && this.DialogState == type)
            ){
                type = DialogEnum.NONE;
            }

            switch(type){
                case DialogEnum.NONE:
                    if(itemViewParent){
                        itemView.detach();
                    }
                    break;
                case DialogEnum.SELECTOR:
                case DialogEnum.OVERLAY:
                    if(calcPosition.timer){
                        clearTimeout(calcPosition.timer);
                    }

                    if(itemViewParent){
                        itemView.detach();
                    }

                    angular.element(document.body).append(itemView);

                    calcPosition(
                        this.element.dropdown,
                        this.element.itemView,
                        this.element.scrollContent
                    );
                    break;
            }

            this.DialogState = type;
        }
    });

    $scope.$on('vd.close', () => {
        this.toggleDialog(DialogEnum.NONE);
    });

    $scope.$watch('filterText', () => {
        this.filter();
    });

    function calcPosition(dropdown, itemView, scrollContent){
        var itemViewPosition = 'bottom',
            dropdownRect = dropdown.getBoundingClientRect(),
            itemViewRect = itemView.getBoundingClientRect(),
            position = {
                top: (dropdownRect.y + dropdownRect.height),
                left: dropdownRect.x
            },
            remainBottom = window.innerHeight - position.top,
            remainTop = dropdownRect.y,
            height = remainBottom,
            width = dropdown.clientWidth || dropdownRect.width;

        if(230 < remainBottom){
            height = 160;
        }else if(230 < remainTop){
            height = 160;
            itemViewPosition = 'top';
        }else if(150 < remainBottom){
            height = 80;
        }else if(150 < remainTop){
            height = 80;
            itemViewPosition = 'top';
        }

        if(itemViewPosition === 'top'){
            position.top = dropdownRect.y - itemViewRect.height;
        }

        var curHash = JSON.stringify([position, height, width]);

        if(curHash != prevHash){
            scrollContent.style.minHeight = height + 'px';
            scrollContent.style.maxHeight = height + 'px';
            itemView.style.top = position.top + 'px';
            itemView.style.left = position.left + 'px';
            itemView.style.width = width + 'px';

            prevHash = curHash;
        }

        calcPosition.timer = setTimeout(calcPosition, 30, dropdown, itemView, scrollContent);
    }
}