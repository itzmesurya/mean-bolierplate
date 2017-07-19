(function () {
    'use strict';

    angular
        .module('honda')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        var states = [{
                state: 'honda',
                config: {
                    abstract: true,
                    template: '<div ui-view></div>',
                    url: '/',
                    title: '',
                    appTitle: '',
                    appFooterTitle: '',
                    settings: {
                        icon: 'compass'
                    }
                }
            },
            {
                state: 'honda.default',
                config: {
                    url: '',
                    templateUrl: 'app/honda/honda.html',
                    controller: 'hondaController',
                    controllerAs: 'vm',
                    title: 'honda'
                }
            }
        ];
        routerHelper.configureStates(states, '/');

    }
})();