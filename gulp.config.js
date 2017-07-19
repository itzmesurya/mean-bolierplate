module.exports = function () {
    var client = './src/client/';
    var clientApp = client + 'app/';
    var root = './';
    var server = './src/server/';
    var temp = './.tmp/';
    var wiredep = require('wiredep');
    var bowerFiles = wiredep({
        devDependencies: true
    })['js'];
    var theme = './src/themes/';
    var clientLibrary = client + 'libraries/';
    var defaultTheme = 'angularMaterial';
    var themeConfigFileName = '/theme.config.json';
    var themeBase = [
        './src/themes/_base'
    ];
    var config = {
        /**
         * Files paths
         */
        alljs: [
            './src/**/*.js',
            './*.js',
            '!./src/themes/**/*.js',
            '!' + client + 'libraries/**/*.js'
        ],
        /**
         * browser sync
         */
        browserReloadDelay: 1000,
        /**
         * Bower and NPM locations
         */
        bower: {
            json: require('./bower.json'),
            directory: './bower_components/',
            ignorePath: '../..'
        },
        build: './build/',
        client: client,
        themeBower: {
            json: clientLibrary + 'bower.json',
            directory: clientLibrary + 'bower_components',
            ignorePath: '../../../..'
        },
        css: {
            app: [
                temp + 'styles.css',
                client + '**/*.css',
                client + '**/*.svg',
                '!' + client + 'theme/**/*.css',
                '!' + client + 'libraries/bower_components/**/*.css'
            ]
        },
        defaultPort: 7201,
        defaultTheme: defaultTheme,
        fonts: [
            client + 'app/assets/fonts/**/*.*'
        ],
        html: clientApp + '**/*.html',
        htmltemplates: [
             client + 'theme/**/*.html'
        ],
        images: client + 'images/**/*.*',
        index: client + 'index.html',
        copyIndex: client + 'copy/index.html',
        js: {
            app: [
                clientApp + '**/*.module.js',
                clientApp + '**/*.js',
                '!' + clientApp + '**/*.spec.js'
            ],
            custom: [
                client + 'libraries/**/*.js',
                '!' + client + 'libraries/bower_components/**/*.js'
            ]
        },
        less: client + 'styles/styles.less',
        nodeServer: './src/server/app.js',
        /**
         * optimized files
         */
        optimized: {
            app: 'app.js',
            lib: 'lib.js',
            theme: 'theme.js'
        },
        packages: [
            './package.json',
            './bower.json'
        ],

        root: root,
        server: server,
        temp: temp,
        theme: theme,
        themeBase: themeBase,
        themeConfigFileName: themeConfigFileName,
        /**
         * template cache
         */
        templateCache: {
            file: 'templates.js',
            options: {
                module: 'ep.formly.theme.core',
                standAlone: false,
                root: 'theme/'
            }
        },
        templateClientCache: {
            file: 'templatesclient.js',
            options: {
                module: 'ep.formly.core',
                standAlone: false,
                root: 'app/'
            }
        }

    };
    config.getWiredepDefaultOptions = function () {
        var options = {
            bowerJson: config.bower.json,
            directory: config.bower.directory,
            ignorePath: config.bower.ignorePath
        };
        return options;
    };
    config.getWiredepThemeOptions = function () {
        var options = {
            bowerJson: config.themeBower.json,
            directory: config.themeBower.directory,
            ignorePath: config.themeBower.ignorePath
        };
        return options;
    };
    return config;
};