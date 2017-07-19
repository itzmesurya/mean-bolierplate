(function () {
    'use strict';

    angular
        .module('ep.formly.layout')
        .controller('Shell', Shell);

    Shell.$inject = ['$timeout'];

    function Shell($timeout) {
        var vm = this;
        vm.menuItems = [{
                name: "Form controls",
                items: [{
                        name: 'TextBox',
                        url: '/textbox'
                    },
                    {
                        name: 'Text area',
                        url: '/textarea'
                    },
                    {
                        name: 'Checkbox',
                        url: '/checkbox'
                    },
                    {
                        name: 'Switch',
                        url: '/switch'
                    },
                    {
                        name: 'Dropdown',
                        url: '/dropdown'
                    },
                    {
                        name: 'File Upload',
                        url: '/fileupload'
                    },
                    {
                        name: 'Radio Button',
                        url: '/radiobutton'
                    },
                    {
                        name: 'AutoComplete',
                        url: '/autocomplete'
                    },
                    {
                        name: 'Modal Popup',
                        url: '/modalpopup'
                    },
                    {
                        name: 'Date Picker',
                        url: '/datepicker'
                    },
                    {
                        name: 'Button',
                        url: '/buttons'
                    },
                    {
                        name: 'Label',
                        url: '/label'
                    }
                ]
            }, {
                name: "Collective components",
                items: [{
                        name: 'Ui-Grid',
                        url: '/uigrid'
                    },
                    {
                        name: 'Data-Table',
                        url: '/datatable'
                    },
                    {
                        name: 'Accordion',
                        url: '/accordion'
                    }
                ]
            }, {
                name: "Special components",
                items: [{
                        name: 'Card',
                        url: '/card'
                    },
                    {
                        name: 'Tabs',
                        url: '/tabs'
                    }
                ]
            },
            {
                name: "Demos",
                items: [{
                        name: 'Material Demo',
                        url: '/materialdemo'
                    },
                    {
                        name: 'Formly Generator',
                        url: '/generator'
                    },
                    {
                        name: 'Formly Layout Generator',
                        url: '/layoutgenerator'
                    }
                ]
            }
        ];
    }
})();