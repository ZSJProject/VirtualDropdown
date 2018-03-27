(function () {
    angular.module('kr-input', ['throttle'])
        .directive('krInput', ['$parse', 'nextTick',
            function ($parse, nextTick) {
                return {
                    priority: 2,
                    restrict: 'A',
                    link: function (scope, element, attrs) {
                        var target = element,
                            getter, setter;

                        if (attrs.krInput) {
                            getter = $parse(attrs.krInput);
                            setter = getter.assign;
                        }

                        target.off('compositionstart');
                        target.on('compositionstart', function (event) {
                            event.stopImmediatePropagation();
                        });
                        target.on('input', function (event) {
                            if (typeof setter !== 'function')
                                return;

                            nextTick(function () {
                                if (setter) setter(scope, target.val());
                            });
                        });
                    }
                };
            }
        ]);
})();