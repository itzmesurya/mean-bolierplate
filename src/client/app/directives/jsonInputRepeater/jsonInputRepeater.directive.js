(function () {
    'use strict';

    angular
        .module('ep.formly.directives')
        .directive('jsonInputRepeater', jsonInputRepeater);

    jsonInputRepeater.$inject = ['$http', '$compile'];

    function jsonInputRepeater($http, $compile) {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            // bindToController:true,
            controller: jsonInputRepeaterController,
            templateUrl: 'app/directives/jsonInputRepeater/jsonInputRepeater.html',
            controllerAs: 'vm',
            link: link,
            restrict: 'E',
            scope: {
                data: '='
            }
        };
        return directive;

        function link(scope, element, attrs) {
            console.log('jsonInputRepeater link');
        }
    }
    /* @ngInject */
    jsonInputRepeaterController.$inject = ['$scope']

    function jsonInputRepeaterController($scope) {
        console.log('jsonInputRepeater controller');
    }
})();