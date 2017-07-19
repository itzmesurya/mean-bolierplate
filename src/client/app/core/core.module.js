(function () {
    'use strict';

    angular
        .module('ep.formly.core', [
            /* 3rd-party modules */
            'ui.router'
        ])
        .provider('routerHelper', routerHelperProvider);

    routerHelperProvider.$inject = ['$locationProvider', '$stateProvider', '$urlRouterProvider'];
    /* @ngInject */
    function routerHelperProvider($locationProvider, $stateProvider, $urlRouterProvider) {
        /* jshint validthis:true */
        var config = {
            docTitle: undefined,
            resolveAlways: {}
        };

        $locationProvider.html5Mode(true);

        this.configure = function (cfg) {
            angular.extend(config, cfg);
        };

        this.$get = RouterHelper;
        RouterHelper.$inject = ['$location', '$rootScope', '$state'];
        /* @ngInject */
        function RouterHelper($location, $rootScope, $state) {
            var handlingStateChangeError = false;
            var hasOtherwise = false;
            var stateCounts = {
                errors: 0,
                changes: 0
            };

            var service = {
                configureStates: configureStates,
                getStates: getStates,
                stateCounts: stateCounts
            };

            init();

            return service;

            function configureStates(states, otherwisePath) {
                states.forEach(function (state) {
                    if (!angular.isUndefined(state)) {
                        state.config.resolve =
                            angular.extend(state.config.resolve || {}, config.resolveAlways);
                        $stateProvider.state(state.state, state.config);
                    }
                });
                if (otherwisePath && !hasOtherwise) {
                    hasOtherwise = true;
                    $urlRouterProvider.otherwise('404/PageNotFound');
                }
            }

            function handleRoutingErrors() {
                // Route cancellation:
                // On routing error, go to the dashboard.
                // Provide an exit clause if it tries to do it twice.
                $rootScope.$on('$stateChangeError',
                    function (event, toState, toParams, fromState, fromParams, error) {
                        if (handlingStateChangeError) {
                            return;
                        }
                        stateCounts.errors++;
                        handlingStateChangeError = true;
                        var msg = formatErrorMessage(error);
                        event.preventDefault();
                        $location.path(error.handlerPath ? error.handlerPath : '/');

                        function formatErrorMessage(error) {
                            var dest = (toState && (toState.title || toState.name ||
                                toState.loadedTemplateUrl)) || 'unknown target';
                            return 'Error routing to ' + dest + '. ' +
                                error.message || error.data || '' +
                                '. <br/>' + (error.statusText || '') +
                                ': ' + (error.status || '');
                        }
                    }
                );
            }

            function init() {
                handleRoutingErrors();
                updateDocTitle();
                updateAppTitle();
            }

            function getStates() {
                return $state.get();
            }

            function updateDocTitle() {
                $rootScope.$on('$stateChangeSuccess',
                    function (event, toState, toParams, fromState, fromParams) {
                        stateCounts.changes++;
                        handlingStateChangeError = false;
                        var title = config.docTitle + ' ' + (toState.title || '');
                        $rootScope.title = title; // data bind to <title>
                    }
                );
            }

            function updateAppTitle() {
                $rootScope.$on('$stateChangeSuccess',
                    function (event, toState, toParams, fromState, fromParams) {
                        var states = $state.get();
                        states.filter(function (obj) {
                            if (obj.abstract && $state.includes(obj.name) && obj.appTitle) {
                                $rootScope.appFooterTitle = obj.appTitle;
                                $rootScope.appTitle = obj.appTitle;
                            }
                        });
                    }
                );
            }
        }
    }
})();