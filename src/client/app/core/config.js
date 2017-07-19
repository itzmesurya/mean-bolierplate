(function() {
    'use strict';

    var core = angular.module('ep.formly.core');

    core.config(toastrConfig);

    toastrConfig.$inject = ['toastr'];
    /* @ngInject */
    function toastrConfig(toastr) {
        toastr.options.timeOut = 4000;
        toastr.options.positionClass = 'toast-bottom-right';
    }

    //=== Application Configuration ===
   
    //===/Application Configuration ===
})();
