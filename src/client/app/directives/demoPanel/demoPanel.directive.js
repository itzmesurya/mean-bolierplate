(function () {
    'use strict';

    angular
        .module('ep.formly.directives')
        .directive('demoPanel', demoPanel);


    function demoPanel() {
        // Usage:
        // 
        // Creates:
        //
        var directive = {
            bindToController: true,
            transclude:true,
            controller: DemoPanelController,
            templateUrl:'app/directives/demoPanel/demoPanel.html',
            controllerAs: 'vm',
            link: link,
            restrict: 'E',
            scope: {
                title:'@'
            }
        };
        return directive;

        function link(scope, element, attrs) {}
    }
    /* @ngInject */
    DemoPanelController.$inject = ['$scope'];

    function DemoPanelController() {

    }
})();