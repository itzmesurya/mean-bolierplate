(function() {
    'use strict';

    angular
        .module('honda')
        .controller('hondaController', hondaController);

    hondaController.$inject = ['$scope'];
    function hondaController($scope) {
        var vm = this;
        

        activate();

        ////////////////

        function activate() { }
    }
})();