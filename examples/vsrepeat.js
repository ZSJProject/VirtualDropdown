/*
    FN  : VSRepeat.js
    C   : 2018년 02월 13일 15시 42분 작성
    DS  : 
    N   : 
    A   : Mk(barmherzig@mkpowered.pro)
    L   : 모든 권한은 Mk(barmherzig@mkpowered.pro)에 있습니다.
*/

(function ()
{
        // DESCRIPTION:
        // vsRepeat directive stands for Virtual Scroll Repeat. It turns a standard ngRepeated set of elements in a scrollable container
        // into a component, where the user thinks he has all the elements rendered and all he needs to do is scroll (without any kind of
        // pagination - which most users loath) and at the same time the browser isn't overloaded by that many elements/angular bindings etc.
        // The directive renders only so many elements that can fit into current container's clientHeight/clientWidth.

        // LIMITATIONS:
        // - current version only supports an Array as a right-hand-side object for ngRepeat
        // - all rendered elements must have the same height/width or the sizes of the elements must be known up front

        // USAGE:
        // In order to use the vsRepeat directive you need to place a vs-repeat attribute on a direct parent of an element with ng-repeat
        // example:
        // <div vs-repeat>
        //      <div ng-repeat="item in someArray">
        //          <!-- content -->
        //      </div>
        // </div>
        //
        // or:
        // <div vs-repeat>
        //      <div ng-repeat-start="item in someArray">
        //          <!-- content -->
        //      </div>
        //      <div>
        //         <!-- something in the middle -->
        //      </div>
        //      <div ng-repeat-end>
        //          <!-- content -->
        //      </div>
        // </div>
        //
        // You can also measure the single element's height/width (including all paddings and margins), and then speficy it as a value
        // of the attribute 'vs-repeat'. This can be used if one wants to override the automatically computed element size.
        // example:
        // <div vs-repeat="50"> <!-- the specified element height is 50px -->
        //      <div ng-repeat="item in someArray">
        //          <!-- content -->
        //      </div>
        // </div>
        //
        // IMPORTANT!
        //
        // - the vsRepeat directive must be applied to a direct parent of an element with ngRepeat
        // - the value of vsRepeat attribute is the single element's height/width measured in pixels. If none provided, the directive
        //      will compute it automatically

        // OPTIONAL PARAMETERS (attributes):
        // vs-repeat-container="selector" - selector for element containing ng-repeat. (defaults to the current element)
        // vs-scroll-parent="selector" - selector to the scrollable container. The directive will look for a closest parent matching
        //                              the given selector (defaults to the current element)
        // vs-horizontal - stack repeated elements horizontally instead of vertically
        // vs-offset-before="value" - top/left offset in pixels (defaults to 0)
        // vs-offset-after="value" - bottom/right offset in pixels (defaults to 0)
        // vs-excess="value" - an integer number representing the number of elements to be rendered outside of the current container's viewport
        //                      (defaults to 2)
        // vs-size - a property name of the items in collection that is a number denoting the element size (in pixels)
        // vs-autoresize - use this attribute without vs-size and without specifying element's size. The automatically computed element style will
        //              readjust upon window resize if the size is dependable on the viewport size
        // vs-scrolled-to-end="callback" - callback will be called when the last item of the list is rendered
        // vs-scrolled-to-end-offset="integer" - set this number to trigger the scrolledToEnd callback n items before the last gets rendered
        // vs-scrolled-to-beginning="callback" - callback will be called when the first item of the list is rendered
        // vs-scrolled-to-beginning-offset="integer" - set this number to trigger the scrolledToBeginning callback n items before the first gets rendered

        // EVENTS:
        // - 'vsRepeatTrigger' - an event the directive listens for to manually trigger reinitialization
        // - 'vsRepeatReinitialized' - an event the directive emits upon reinitialization done

        var
            MakeUUID = function(Prefix){
                var
                    Now     = new Date().getTime(),
                    UUID    = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(Part) {
                        Random  = (Now + Math.random() * 16) % 16 | 0;
                        Now     = Math.floor(Now / 16);

                        return (Part === 'x' ? Random : (Random & 0x3 |0x8)).toString(16);
                    }),

                    Random;

                return [Prefix || '', UUID].join('');
            },
            DDE     = document.documentElement,
            MF      = DDE.matches ? 'matches' :
                DDE.matchesSelector ? 'matchesSelector' :
                    DDE.webkitMatches ? 'webkitMatches' :
                        DDE.webkitMatchesSelector ? 'webkitMatchesSelector' :
                            DDE.msMatches ? 'msMatches' :
                                DDE.msMatchesSelector ? 'msMatchesSelector' :
                                    DDE.mozMatches ? 'mozMatches' :
                                        DDE.mozMatchesSelector ? 'mozMatchesSelector' : null,

            CE      = angular.element.prototype.closest || function (selector) {
                var
                    el = this[0].parentNode;

                while (el !== document.documentElement && el != null && !el[MF](selector))
                    el = el.parentNode;

                if (el && el[MF](selector))
                    return angular.element(el);

                else
                    return angular.element();
            };

        angular.module('vs-repeat', ['throttle'])
        .directive('vsRepeatSync', function(){
            return {
                restrict:   'A',
                scope:      false,
                controllerAs: 'vsSyncCtrl',
                controller: function($scope, throttle){ 
                    var resizeObserver,
                        prevSizeString;

                    updateThrottle = throttle(function updateThrottle(){
                        $scope.$broadcast('vsRepeatUpdateTrigger');

                        if($scope.$root && !$scope.$root.$$phase){
                            $scope.$digest();
                        }
                    }, 30);

                    updateHandler = function updateHandler(event){
                        var syncTarget = event.target;

                        $scope.$broadcast('vsRepeatUpdateScroll', syncTarget.scrollTop, syncTarget.scrollLeft);
                        
                        updateThrottle();
                    };

                    function registerResizeObserver(target){
                        resizeObserver = new ResizeObserver(function(entry){
                            if(entry[0]){
                                var sizeString = JSON.stringify({
                                    width: entry[0].contentRect.width,
                                    height: entry[0].contentRect.height,
                                });

                                if(sizeString !== prevSizeString){
                                    $scope.$broadcast('vsRepeatReInitialTrigger');

                                    if ($scope.$root && !$scope.$root.$$phase) {
                                        $scope.$apply();
                                    }

                                    prevSizeString = sizeString;
                                }
                            }
                        });
                        
                        resizeObserver.observe(target);
                    }

                    function deregisterResizeObserver(target){
                        resizeObserver.unobserve(target);
                    }
                        
                    this.register = function(target){
                        if(target){
                            target.on('scroll.vsSync', updateHandler);
                            registerResizeObserver(target[0]);
                        }
                    };

                    this.deregister = function(target){
                        if(target){
                            deregisterResizeObserver(target[0]);
                            target.off('scroll.vsSync');
                        }
                    };
                }
            }
        })
        .directive('vsRepeat', function ($compile, $parse, $log, throttle) {
            'ngInject';

            return {
                restrict:   'A',
                require:    ['^^?vsRepeatSync', 'vsRepeat'],
                scope:      true,
                controllerAs: 'vsCtrl',
                compile:    function(tElement, tAttrs) {
                    var
                        repeatContainer         = angular
                            .isDefined(tAttrs.vsRepeatContainer) ?
                                angular.element(tElement[0].querySelector(tAttrs.vsRepeatContainer)) :
                                tElement,

                        ngRepeatChild           = null,
                        childCloneHtml          = null,
                        isNgRepeatStart         = false,
                        attributesDictionary    = {
                            'vsRepeat': 'elementSize',
                            'vsOffsetBefore': 'offsetBefore',
                            'vsOffsetAfter': 'offsetAfter',
                            'vsScrolledToEndOffset': 'scrolledToEndOffset',
                            'vsScrolledToBeginningOffset': 'scrolledToBeginningOffset',
                            'vsExcess': 'excess'
                        },

                        ngRepeatExpression,
                        expressionMatches,
                        lhs,
                        rhs,
                        rhsSuffix,
                        originalNgRepeatAttr;

                    Array.from(repeatContainer.children()).forEach(function(child){
                        if(ngRepeatChild){
                            childCloneHtml += child.outerHTML;
                        }else{
                            if(child.getAttribute('ng-repeat')) {
                                originalNgRepeatAttr = 'ng-repeat';
                                ngRepeatExpression = child.getAttribute('ng-repeat');
                            }else if(child.getAttribute('data-ng-repeat')) {
                                originalNgRepeatAttr = 'data-ng-repeat';
                                ngRepeatExpression = child.getAttribute('data-ng-repeat');
                            }else return;
    
                            ngRepeatChild = angular.element(child);
                            childCloneHtml = child.outerHTML;
                        }
                    });

                    if(!ngRepeatChild){
                        throw new Error('angular-vs-repeat: no ng-repeat directive on a child element');
                    }

                    expressionMatches = /^\s*(\S+)\s+in\s+([\S\s]+?)(track\s+by\s+\S+)?$/.exec(ngRepeatExpression);

                    lhs         = expressionMatches[1];
                    rhs         = expressionMatches[2];
                    rhsSuffix   = expressionMatches[3];

                    repeatContainer.empty();

                    return {
                        pre: function(scope, element, attrs, controllers) {
                            var
                                vsSyncCtrl          = controllers[0] || {},
                                vsCtrl              = controllers[1] || {},
                                $repeatContainer     = angular
                                    .isDefined(attrs.vsRepeatContainer) ?
                                        angular.element(element[0].querySelector(attrs.vsRepeatContainer)) :
                                        element,

                                childClone          = angular.element(childCloneHtml),
                                childTagName        = childClone[0].tagName.toLowerCase(),

                                $beforeContent      = angular.element('<' + childTagName + ' class="vs-repeat-before-content"></' + childTagName + '>'),
                                $afterContent       = angular.element('<' + childTagName + ' class="vs-repeat-after-content"></' + childTagName + '>'),

                                $scrollParent       = attrs.vsScrollParent ?
                                    attrs.vsScrollParent === 'window' ? angular.element(window) :
                                        CE.call($repeatContainer, attrs.vsScrollParent) : $repeatContainer,

                                sizesPropertyExists = !!attrs.vsSize || !!attrs.vsSizeProperty,
                                prevSizeString = '';
                                
                            if (!('vsSize' in attrs) && 'vsSizeProperty' in attrs) {
                                $log.warn('vs-size-property attribute is deprecated. Please use vs-size attribute which also accepts angular expressions.');
                            }

                            if ($scrollParent.length === 0) {
                                throw 'Specified scroll parent selector did not match any element';
                            }

                            //start--initialize vsCtrl define
                            vsCtrl.originalCollectionGetter = $parse(rhs);
                            vsCtrl.isHorizontal = typeof attrs.vsHorizontal !== 'undefined';
                            vsCtrl.isSync = !!Object.keys(vsSyncCtrl).length;
                            vsCtrl.isSyncTarget = attrs.vsSyncTarget != null;
                            Object.assign(vsCtrl.options, 'vsOptions' in attrs ? scope.$eval(attrs.vsOptions) : {});

                            vsCtrl.$scrollParent = $scrollParent;
                            vsCtrl.$repeatContainer = $repeatContainer;
                            vsCtrl.autoSize = !attrs.vsRepeat;

                            vsCtrl.elementSize = (+attrs.vsRepeat) || vsCtrl.getClientSize() || 50;

                            if (sizesPropertyExists) {
                                vsCtrl.sizesCumulative = [];
                            }

                            Object.keys(attributesDictionary).forEach(function(key) {
                                if (attrs[key] != null) {
                                    attrs.$observe(key, function(value) {
                                        // '+' serves for getting a number from the string as the attributes are always strings
                                        vsCtrl[attributesDictionary[key]] = +value;
                                        reinitialize();
                                    });
                                }
                            });
                            //end--initialize vsCtrl define

                            if (vsCtrl.isHorizontal) {
                                $beforeContent.css('height', '100%');
                                $afterContent.css('height', '100%');
                            }else{
                                $beforeContent.css('width', '100%');
                                $afterContent.css('width', '100%');
                            }

                            scope.$watch(function(){
                                return vsCtrl.originalCollection.length;
                            }, function(newLength, oldLength){
                                if(newLength !== oldLength) refresh();
                            });

                            var newNgRepeatAttrValue = [
                                lhs,
                                'in',
                                'vsCtrl.collection'
                            ];

                            if(rhsSuffix) newNgRepeatAttrValue.push(rhsSuffix);

                            childClone.eq(0).attr(originalNgRepeatAttr, newNgRepeatAttrValue.join(' '));

                            childClone.addClass('vs-repeat-repeated-element');

                            $repeatContainer.append($beforeContent);
                            $repeatContainer.append(childClone);
                            $compile(childClone)(scope);
                            $repeatContainer.append($afterContent);

                            //--start define inner function
                            function setSize(element, size){
                                var layoutProp = vsCtrl.isHorizontal ? 'width' : 'height';
                                element.css(layoutProp, size + 'px');
                                element.css('min-' + layoutProp, size + 'px');
                            }

                            function updateInnerStyle() {
                                var contentSize = vsCtrl.updateCollection(sizesPropertyExists);

                                if(contentSize){
                                    setSize($beforeContent, contentSize.o1);
                                    setSize($afterContent, (contentSize.total - contentSize.o2));
                                }

                                return contentSize && scope.$root && !scope.$root.$$phase;
                            }

                            function setAutoSize() {
                                if (vsCtrl.autoSize) {
                                    scope.$$postDigest(function() {
                                        if ($repeatContainer[0].offsetHeight || $repeatContainer[0].offsetWidth) { // element is visible
                                            var offsetString = vsCtrl.sizeString.offset,
                                                children = $repeatContainer.children(),
                                                i = 0,
                                                gotSomething = false,
                                                insideStartEndSequence = false;

                                            while (i < children.length) {
                                                if (children[i].attributes[originalNgRepeatAttr] != null || insideStartEndSequence) {
                                                    if (!gotSomething) {
                                                        vsCtrl.elementSize = 0;
                                                    }

                                                    gotSomething = true;
                                                    if (children[i][offsetString]) {
                                                        vsCtrl.elementSize += children[i][offsetString];
                                                    }

                                                    if (isNgRepeatStart) {
                                                        if (children[i].attributes['ng-repeat-end'] != null || children[i].attributes['data-ng-repeat-end'] != null) {
                                                            break;
                                                        }
                                                        else {
                                                            insideStartEndSequence = true;
                                                        }
                                                    }
                                                    else {
                                                        break;
                                                    }
                                                }
                                                i++;
                                            }

                                            if (gotSomething) {
                                                reinitialize();
                                                vsCtrl.autoSize = false;
                                                if (scope.$root && !scope.$root.$$phase) {
                                                    scope.$apply();
                                                }
                                            }
                                        }
                                        else {
                                            var dereg = scope.$watch(function() {
                                                if ($repeatContainer[0].offsetHeight || $repeatContainer[0].offsetWidth) {
                                                    dereg();
                                                    setAutoSize();
                                                }
                                            });
                                        }
                                    });
                                }
                            }

                            function refresh() {
                                var originalCollection = vsCtrl.originalCollection;

                                if (!originalCollection || originalCollection.length < 1) {
                                    vsCtrl.collection = [];
                                    vsCtrl.sizesCumulative = [0];
                                }else{
                                    if (sizesPropertyExists) {
                                        vsCtrl.sizes = originalCollection.map(function(item) {
                                            var s = scope.$new(false);
                                            angular.extend(s, item);
                                            s[lhs] = item;
                                            var size = (attrs.vsSize || attrs.vsSizeProperty) ?
                                                s.$eval(attrs.vsSize || attrs.vsSizeProperty) :
                                                vsCtrl.elementSize;
                                            s.$destroy();
                                            return size;
                                        });
                                        var sum = 0;
                                        vsCtrl.sizesCumulative = vsCtrl.sizes.map(function(size) {
                                            var res = sum;
                                            sum += size;
                                            return res;
                                        });
                                        vsCtrl.sizesCumulative.push(sum);
                                    }else setAutoSize();
                                }

                                reinitialize();
                            };

                            function reinitialize(){
                                var originalLength = vsCtrl.originalCollection.length;
                                
                                vsCtrl.initialPrevSize();
        
                                vsCtrl.updateTotalSize(sizesPropertyExists ?
                                    vsCtrl.sizesCumulative[originalLength] :
                                    vsCtrl.elementSize * originalLength
                                );
        
                                updateInnerStyle();
        
                                scope.$emit('vsRepeatReinitialized', vsCtrl.startIndex, vsCtrl.endIndex);
                            }

                            function updateHandler(event) {
                                updateInnerStyle();
                                        
                                if(scope.$root && !scope.$root.$$phase){
                                    scope.$digest();
                                }

                                event && event.preventDefault();
                            }

                            //--end define inner function

                            var updateHandlerThrottle = throttle(updateHandler, 30),
                                resizeObserver;

                            if(vsCtrl.isSync){
                                if(vsCtrl.isSyncTarget){
                                    vsSyncCtrl.register($scrollParent);
                                }

                                scope.$on('$destroy', function() {
                                    if(vsCtrl.isSyncTarget){
                                        vsSyncCtrl.deregister($scrollParent);
                                    }
                                });
                            }else{
                                $scrollParent.on('scroll', updateHandlerThrottle);

                                resizeObserver = new ResizeObserver(function(entry){
                                    if(entry[0]){
                                        var sizeString = JSON.stringify({
                                            width: entry[0].contentRect.width,
                                            height: entry[0].contentRect.height,
                                        });

                                        if(sizeString !== prevSizeString){
                                            reinitialize();
                                            if (scope.$root && !scope.$root.$$phase) {
                                                scope.$apply();
                                            }

                                            prevSizeString = sizeString;
                                        }
                                    }
                                });
                                
                                resizeObserver.observe($scrollParent[0]);

                                scope.$on('$destroy', function() {
                                    $scrollParent.off('scroll', updateHandlerThrottle);
                                    if(resizeObserver){
                                        resizeObserver.unobserve($scrollParent[0]);
                                    }
                                });
                            }

                            scope.$on('vsRepeatUpdateTrigger', updateInnerStyle);
                            scope.$on('vsRepeatRefreshTrigger', refresh);
                            scope.$on('vsRepeatReInitialTrigger', reinitialize);
                            scope.$on('vsRepeatUpdateScroll', function(event, scrollTop, scrollLeft){
                                if(vsCtrl.isHorizontal){
                                    $scrollParent[0].scrollLeft = scrollLeft;
                                }else{
                                    $scrollParent[0].scrollTop = scrollTop;
                                }
                            });

                            scope.$on('vsRepeatResize', function() {
                                vsCtrl.autoSize = true;
                                vsCtrl.setAutoSize();
                            });

                            scope.$on('vsRenderAll', function() {//e , quantum) {
                                if(vsCtrl.options.latch) {
                                    setTimeout(function() {
                                        // var __endIndex = Math.min(scope.endIndex + (quantum || 1), originalLength);
                                        vsCtrl.setLatch();

                                        scope.$$postDigest(function() {
                                            setSize($beforeContent, 0);
                                            setSize($afterContent, 0);
                                        });

                                        scope.$apply(function() {
                                            scope.$emit('vsRenderAllDone');
                                        });
                                    });
                                }
                            });
                        }
                    };
                },
                controller: function($scope){
                    var self = this,
                        childCtrl = {},
                        prevStartIndex = null,
                        prevEndIndex = null,
                        minStartIndex = null,
                        maxEndIndex = null;

                    Object.defineProperties(this, {
                        originalCollection: {
                            get: function(){
                                if(self.originalCollectionGetter){
                                    return self.originalCollectionGetter($scope);
                                }else return [];
                            }
                        },
                        sizeString: {
                            get: function(){
                                if(self.isHorizontal){
                                    return {
                                        client: 'clientWidth',
                                        offset: 'offsetWidth',
                                        scroll: 'scrollLeft'
                                    }
                                }else{
                                    return {
                                        client: 'clientHeight',
                                        offset: 'offsetHeight',
                                        scroll: 'scrollTop'
                                    }
                                }
                            }
                        }
                    });

                    this.ctrlId = MakeUUID();
                    this.collection = [];
                    this.options = {};
                    this.sizesCumulative = [];
                    this.sizes = [];

                    this.startIndex = 0;
                    this.endIndex = 0;
                    this.totalSize = 0;
                    this.offsetBefore = 0;
                    this.offsetAfter = 0;
                    this.excess = 2;

                    this.initialPrevSize = function(){
                        prevStartIndex = null;
                        prevEndIndex = null;
                        minStartIndex = 0;
                        maxEndIndex = self.originalCollection.length;
                    }

                    this.updateTotalSize = function updateTotalSize(size){
                        self.totalSize = self.offsetBefore + size + self.offsetAfter;
                    };

                    this.getWindowScroll = function() {
                        if ('pageYOffset' in window) {
                            return {
                                scrollTop: pageYOffset,
                                scrollLeft: pageXOffset
                            };
                        }
                        else {
                            var sx, sy, d = document, r = d.documentElement, b = d.body;
                            sx = r.scrollLeft || b.scrollLeft || 0;
                            sy = r.scrollTop || b.scrollTop || 0;
                            return {
                                scrollTop: sy,
                                scrollLeft: sx
                            };
                        }
                    };
    
                    this.getClientSize = function() {
                        var scrollElement = self.$scrollParent[0];

                        if (scrollElement === window) {
                            return self.isHorizontal ? window.innerWidth : window.innerHeight;
                        }
                        else {
                            return scrollElement[self.sizeString.client];
                        }
                    };
    
                    this.getScrollPos = function() {
                        var scrollElement = self.$scrollParent[0];

                        return scrollElement === window ?
                            self.getWindowScroll()[self.sizeString.scroll] : 
                            scrollElement[self.sizeString.scroll];
                    };
    
                    this.getScrollOffset = function() {
                        var vsElement = self.$repeatContainer[0];
                        var scrollElement = self.$scrollParent[0];
                        var isHorizontal = self.isHorizontal;
                        var vsPos = vsElement.getBoundingClientRect()[isHorizontal ? 'left' : 'top'];
                        var scrollPos = scrollElement === window ? 0 : scrollElement.getBoundingClientRect()[isHorizontal ? 'left' : 'top'];
                        var correction = vsPos - scrollPos +
                            (scrollElement === window ? self.getWindowScroll() : scrollElement)[isHorizontal ? 'scrollLeft' : 'scrollTop'];
    
                        return correction;
                    };

                    this.setLatch = function(){
                        var endIndex = self.originalCollection.length;

                        maxEndIndex = Math.max(endIndex, maxEndIndex);

                        self.endIndex = self.options.latch ? maxEndIndex : endIndex;
                        self.collection = self.originalCollection.slice(self.startIndex, self.endIndex);
                        prevEndIndex = self.endIndex;
                    };

                    this.updateCollection = function(sizesPropertyExists){
                        var $scrollPosition = self.getScrollPos(),
                            $clientSize = self.getClientSize(),
                            $scrollOffset = self.$repeatContainer[0] === self.$scrollParent[0] ? 
                                0:
                                self.getScrollOffset(),
                            originalLength = self.originalCollection.length,
                            startIndex = self.startIndex,
                            endIndex = self.endIndex;

                        if(sizesPropertyExists) {
                            startIndex = 0;
                            while (self.sizesCumulative[startIndex] < $scrollPosition - self.offsetBefore - $scrollOffset) {
                                startIndex++;
                            }
                            if (startIndex > 0) { startIndex--; }

                            // Adjust the start index according to the excess
                            startIndex = Math.max(
                                Math.floor(startIndex - self.excess / 2),
                                0
                            );

                            endIndex = startIndex;
                            while (self.sizesCumulative[endIndex] < $scrollPosition - self.offsetBefore - $scrollOffset + $clientSize) {
                                endIndex++;
                            }

                            // Adjust the end index according to the excess
                            endIndex = Math.min(
                                Math.ceil(endIndex + self.excess / 2),
                                originalLength
                            );
                        }else {
                            startIndex = Math.max(
                                Math.floor(
                                    ($scrollPosition - self.offsetBefore - $scrollOffset) / self.elementSize
                                ) - self.excess / 2,
                                0
                            );

                            endIndex = Math.min(
                                startIndex + Math.ceil(
                                $clientSize / self.elementSize
                                ) + self.excess,
                                originalLength
                            );
                        }

                        minStartIndex = Math.min(startIndex, minStartIndex);
                        maxEndIndex = Math.max(endIndex, maxEndIndex);

                        self.startIndex = self.options.latch ? minStartIndex : startIndex;
                        self.endIndex = self.options.latch ? maxEndIndex : endIndex;

                        // Move to the end of the collection if we are now past it
                        if (maxEndIndex < self.startIndex)
                            self.startIndex = maxEndIndex;

                        var digestRequired = false;

                        if (prevStartIndex == null) {
                            digestRequired = true;
                        }else if (prevEndIndex == null) {
                            digestRequired = true;
                        }

                        if (!digestRequired) {
                            if (self.options.hunked) {
                                if (Math.abs(self.startIndex - prevStartIndex) >= self.excess / 2 ||
                                    (self.startIndex === 0 && prevStartIndex !== 0)) {
                                    digestRequired = true;
                                }
                                else if (Math.abs(self.endIndex - prevEndIndex) >= self.excess / 2 ||
                                    (self.endIndex === originalLength && prevEndIndex !== originalLength)) {
                                    digestRequired = true;
                                }
                            }
                            else {
                                digestRequired = self.startIndex !== prevStartIndex ||
                                    self.endIndex !== prevEndIndex;
                            }
                        }

                        if (digestRequired) {
                            self.collection = self.originalCollection.slice(self.startIndex, self.endIndex);

                            if(!self.isSync || self.isSyncTarget){
                                $scope.$emit(
                                    'vsRepeatInnerCollectionUpdated', 
                                    self.startIndex, self.endIndex,
                                    self.isHorizontal
                                );
                            }

                            prevStartIndex = self.startIndex;
                            prevEndIndex = self.endIndex;

                            if(sizesPropertyExists){
                                return {
                                    o1 : self.sizesCumulative[self.startIndex] + self.offsetBefore,
                                    o2 : self.sizesCumulative[self.collection.length + self.startIndex] + self.offsetBefore,
                                    total: self.totalSize
                                };
                            }else{
                                return {
                                    o1 : self.startIndex * self.elementSize + self.offsetBefore,
                                    o2 : (self.collection.length + self.startIndex) * self.elementSize + self.offsetBefore,
                                    total: self.totalSize
                                };
                            }
                        }

                        return null;
                    };
                }
            };
        });
})();