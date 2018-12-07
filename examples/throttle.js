(function(){
    var factory = {
        'throttle': ['$q', '$timeout',
            function($q, $timeout) {
                return function(callback, threshhold, trailing) {
                    threshhold = threshhold || 250;
                    
                    if(trailing == null) trailing = true;
            
                    var last, deferTimer;
            
                    return function() {
                        var now = +new Date(),
                            args = arguments,
                            context = this;
            
                        $timeout.cancel(deferTimer);
                        
                        if (last && now < (last + threshhold)) {
                            if (trailing) {
                                deferTimer = $timeout(function() {
                                    now = +new Date();
                                    last = now;
                                    return callback.apply(context, args);
                                }, threshhold);
                            }

                            return deferTimer;
                        } else {
                            var deferred = $q.defer();

                            last = now;
                            deferred.resolve(callback.apply(context, args));
                            deferTimer = deferred.promise;

                            return deferTimer;
                        }
                    };
                };
            }
        ],
        'debounce': ['$timeout',
            function($timeout) {
                return function(callback, delay) {
                    delay = delay || 250;
            
                    var deferTimer;
            
                    return function() {
                        var args = arguments,
                            context = this;

                        $timeout.cancel(deferTimer);
                        deferTimer = $timeout(function() {
                            return callback.apply(context, args);
                        }, delay);

                        return deferTimer;
                    };
                };
            }
        ],
        'singleton': ['$q', 
            function($q) {
                return function(callback, forever) {
                    var promise = null;

                    return function() {
                        var args = arguments;
                        var context = this;
            
                        if (promise) {
                            return promise;
                        }
            
                        if (!angular.isFunction(callback)) {
                            return $q.reject(new Error("callback must be function"));
                        }
            
                        var result = callback.apply(context, args);
            
                        if (!isPromiseLike(result)) {
                            return $q.reject(new Error("callback return must be promise object"));
                        }
            
                        promise = $q.when(result)
                            .finally(function() {
                                if (forever !== true) {
                                    promise = null;
                                }
                            });
                        return promise;
                    };
                };
            }
        ],
        'nextTick': [
            '$timeout', '$rootScope',
            function($timeout, $rootScope){
                var _nextTick;

                return (_nextTick = function(callback, digest, scope) {
                    //-- grab function reference for storing state details
                    var nextTick = _nextTick;
                    var timeout = nextTick.timeout;
                    var queue = nextTick.queue || [];
            
                    //-- add callback to the queue
                    queue.push({scope: scope, callback: callback});
            
                    //-- set default value for digest
                    if (digest == null) digest = true;
            
                    //-- store updated digest/queue values
                    nextTick.digest = nextTick.digest || digest;
                    nextTick.queue = queue;
            
                    //-- either return existing timeout or create a new one
                    return timeout || (nextTick.timeout = $timeout(processQueue, 0, false));
            
                    /**
                     * Grab a copy of the current queue
                     * Clear the queue for future use
                     * Process the existing queue
                     * Trigger digest if necessary
                     */
                    function processQueue() {
                        var queue = nextTick.queue;
                        var digest = nextTick.digest;
                
                        nextTick.queue = [];
                        nextTick.timeout = null;
                        nextTick.digest = false;
                
                        queue.forEach(function(queueItem) {
                            var skip = queueItem.scope && queueItem.scope.$$destroyed;
                            if (!skip) {
                                queueItem.callback();
                            }
                        });
                
                        if (digest) $rootScope.$digest();
                    }
                });
            }
        ]
    }

    angular.module('throttle', [])
        .factory('throttle', factory.throttle)
        .factory('debounce', factory.debounce)
        .factory('singleton', factory.singleton)
        .factory('nextTick', factory.nextTick);
})();