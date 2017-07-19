(function() {
    'use strict';

    angular
        .module('ep.formly.core')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates(), '/');
    }

    function getStates() {
        return [
            {
                state: '404',
                config: {
                    abstract: true,
                    template: '<ui-view></ui-view>',
                    url: '/404',
                    settings: {
                        icon: 'compass'
                    }
                }
            },
            {
                state: '404.PageNotFound',
                config: {
                    url: '/PageNotFound',
                    templateUrl: 'app/core/ep404NotFound.html',
                }
            }
        ];
    }
})();
