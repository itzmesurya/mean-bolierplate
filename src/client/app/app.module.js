(function () {

    'use strict';

    angular.module('ep.formly', [
        /* Shared modules */
        'ep.formly.core',
        'ep.formly.layout',
        'honda',
        /** Directives to be used in the sample pages only! */
        'ep.formly.directives'
        // /* Epsilon Formly */
        // This is our base template application directly from
        // our ep.formly module (at least it should be)
        // For now, this is just a placeholder application
        // /* THEME */
        // This will be defined by the injected
        // theme folder
        // ** ALL theme modules will follow this structure


        // /* Third party */
        // 'ngResource',
        // 'ngCkeditor'
    ]);
})();