(function () {
    'use strict';

    angular
        .module('ep.formly')
        .controller('mainController', MainController);

    MainController.$inject = ['$scope'];
    function MainController($scope) {
        var vm = this;
        activate();
        function activate() {
            console.log('mainController activated!');
        }
        $scope.openLeftMenu = function () {
           
        };
    }
})();