var gulp = require('gulp');
var args = require('yargs').argv;
var browserSync = require('browser-sync');
var config = require('./gulp.config')();
var del = require('del');
var gulpif = require('gulp-if');
var path = require('path');
var _ = require('lodash');
var injectString = require('gulp-inject-string');
var $ = require('gulp-load-plugins')({
    lazy: true
});
var port = process.env.PORT || config.defaultPort;






/**
 * Task 1 Before performing any action in the index.html
 * delete the index.html from client folder and copy
 *  the file from 'copy' folder.
 */
gulp.task('del-index',  function () {
    return del(config.index);
});
gulp.task('copy-index', ['del-index'], function () {
    return gulp.src(config.copyIndex)
        .pipe(gulp.dest(config.client));
});
gulp.task('inject-vendor-scripts', ['copy-index'], function () {
    log('Wire up the bower css, js,  and our app js into the html');
    var options = config.getWiredepDefaultOptions();
    var wiredep = require('wiredep').stream;
    return gulp
        .src(config.index)

        //Bower injection
        // .src will look for source of html files which call for dependencies
        // using the syntax bower:js or bower:css.  
        .pipe(wiredep(options))
        //app injection
        .pipe($.inject(gulp.src(config.js.app)))

       
        // wiredep options are passed to configure the wiredep stream 
        .pipe(gulp.dest(config.client));
    // Files will be picked from gulp.src call stated above and modified 
    // in the stream and placed into the gulp.dest ie in a specified 
    // destination.
});


/**
 * Inject Task: Injecting app css to index.html and calling
 * the wiredep task (for injecting bower, css, js and app.js
 * files to index.html file
 */
gulp.task('inject', ['styles','inject-vendor-scripts' ], function () {
    log('Wire up the app css into the html, and call wiredep ');
   
    return gulp
        .src(config.index)
        // App CSS files
        .pipe($.inject(gulp.src(config.css.app)))


        .pipe(gulp.dest(config.client));
});
/**
 * Styles Task: Compiling all the less files
 * to css files
 */
gulp.task('styles', ['clean-styles'], function () {
    log('Compiling Less --> CSS');

    return gulp
        .src([config.less])
        .pipe($.plumber())
        .pipe($.less())
        .pipe($.autoprefixer({
            browsers: ['last 2 version', '> 5%']
        }))
        .pipe(gulp.dest(config.temp));
});
/**
 * Clean Styles Task: Cleaning all css files
 * from './.tmp/../' folder
 */
gulp.task('clean-styles', function (done) {
    var files = [].concat(
        config.temp + '**/*.css',
        config.build + 'styles/**/*.css');
    clean(files, done);
});

gulp.task('templatecache', ['clean-code', 'inject'], function () {
    log('Creating AngularJS $templateCache');

    return gulp
        .src(config.htmltemplates)
        .pipe($.htmlmin({
            empty: true
        }))
        .pipe($.angularTemplatecache(
            config.templateCache.file,
            config.templateCache.options
        ))
        .pipe(gulp.dest(config.temp));
});


/**
 * Clean Code Task: Cleaning JS and HTML files
 * from './.tmp/../', './build/../' and
 * './build/js/../' folder
 */
gulp.task('clean-code', function (done) {
    var files = [].concat(
        config.temp + '**/*.js',
        config.build + '**/*.html',
        config.build + 'js/**/*.js'
    );
    clean(files, done);
});
/**
 * Serve Dev Task: Serving the dev and calling
 * inject task
 */
gulp.task('serve-dev', ['inject'], function () {
    serve(true /* isDev */ );
});
////////////
/**
 * Serve Build Task: Serving the build
 */
gulp.task('serve-build', ['build'], function () {
    serve(false /* isDev */ );
});
/**
 * Clean Images Task: Cleaning images from
 * './build/images/../' folder
 */
gulp.task('clean-images', function (done) {
    clean(config.build + 'images/**/*.*', done);
});

/**
 * Images Task: Copying images from
 * './src/client/images/' folder to
 * './build/images/' folder
 * and compressing them to optimization level 4
 */
gulp.task('images', ['clean-images'], function () {
    log('Copying and compressing the images');

    return gulp
        .src(config.images)
        .pipe($.imagemin({
            optimizationLevel: 4
        }))
        .pipe(gulp.dest(config.build + 'images'));
});

/**
 * Clean UI Grid Fonts Task: Cleaning ui-grid-fonts
 * from './build/styles/../' folder
 */

/**
 * Clean Fonts Task: Cleaning fonts from
 * './build/fonts/../' folder
 */
gulp.task('clean-fonts', function (done) {
    clean(config.build + 'fonts/**/*.*', done);
});

/**
 * Fonts Task: Copying fonts from
 * './bower_components/font-awesome/fonts/',
 * './bower_components/bootstrap/fonts/',
 * './src/client/fonts/' folders
 * to './build/fonts/' folder
 */
gulp.task('fonts', ['optimize', 'clean-fonts'], function () {
    log('Copying fonts');

    return gulp
        .src(config.fonts)
        .pipe(gulp.dest(config.build + 'fonts'));
});

/**
 * Build Task: Building all the images, fonts, web.config,
 * favicon.ico, ui-grid-fonts and json files.
 */
gulp.task('build', ['images', 'fonts'], function () {
    log('Building everything');

    var msg = {
        title: 'gulp build',
        subtitle: 'Deployed to the build folder',
        message: 'Running `gulp serve-build`'
    };
    log('Cleaning: ' + $.util.colors.blue(config.temp));
    del(config.temp);
    log(msg);
    notify(msg);
});

/**
 * Optimize Task: Optimizing the JS, CSS and HTML files
 */
gulp.task('optimize', ['templatecache'], function () {
    log('Optimizing the javascript, css, html');

    var assets = $.useref.assets({
        searchPath: './'
    });
    var templateCache = config.temp + config.templateCache.file;
    var templateClientCache = config.temp + config.templateClientCache.file;
    var cssFilter = $.filter('**/*.css');
    var jsLibFilter = $.filter('**/' + config.optimized.lib);
    var jsAppFilter = $.filter('**/' + config.optimized.app);
    return gulp
        .src(config.index)
        .pipe($.plumber())
        .pipe($.inject(
            gulp.src(templateCache, {
                read: false
            }), {
                starttag: '<!-- inject:templates:js -->'
            }))
        .pipe($.inject(
            gulp.src(templateClientCache, {
                read: false
            }), {
                starttag: '<!-- inject:templatesclient:js -->'
            }))
        .pipe(assets)
        .pipe(cssFilter)
        .pipe($.csso())
        .pipe(cssFilter.restore())
        .pipe(jsLibFilter)
        .pipe($.uglify())
        .pipe(jsLibFilter.restore())
        .pipe(jsAppFilter)
        .pipe($.ngAnnotate())
        .pipe($.uglify())
        .pipe(jsAppFilter.restore())
        // .pipe($.rev())
        .pipe(assets.restore())
        .pipe($.useref())
        // .pipe($.revReplace())
        .pipe(gulp.dest(config.build))
        // .pipe($.rev.manifest())
        .pipe(gulp.dest(config.build));
});

/**
 * Activates the gulp module by setting variables
 */

function changeEvent(event) {
    var srcPattern = new RegExp('/.*(?=/' + config.source + ')/');
    log('File ' + event.path.replace(srcPattern, '') + ' ' + event.type);
}
/**
 * clean Function: Cleans up the paths specified
 */
function clean(path, done) {
    log('Cleaning: ' + $.util.colors.blue(path));
    del(path, done);
}
/**
 * log Function: Logs the messages with the font color blue
 */
function log(msg) {
    if (typeof (msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                $.util.log($.util.colors.blue(msg[item]));
            }
        }
    } else {
        $.util.log($.util.colors.blue(msg));
    }
}
/**
 * Serve Function: Serving the node requests for
 * dev and build environment
 * --restart: nodemon restarted and browserSync has been called
 * --start: nodemon started and startBrowserSync has been called
 * --crash: nodemon crashed due to script scrashed for some reason
 * --exit: nodemon exited
 */
function serve(isDev, specRunner) {
    var nodeOptions = {
        script: config.nodeServer,
        delayTime: 1,
        env: {
            'PORT': port,
            'NODE_ENV': isDev ? 'dev' : 'build'
        },
        watch: [config.server]
    };

    return $.nodemon(nodeOptions)
        .on('restart', function (ev) {
            log('*** nodemon restarted');
            log('files changed on restart:\n' + ev);
            setTimeout(function () {
                browserSync.notify('reloading now ...');
                browserSync.reload({
                    stream: false
                });
            }, config.browserReloadDelay);
        })
        .on('start', function () {
            log('*** nodemon started');
            startBrowserSync(isDev, specRunner);
        })
        .on('crash', function () {
            log('*** nodemon crashed: script crashed for some reason');
        })
        .on('exit', function () {
            log('*** nodemon exited cleanly');
        });
}
/**
 * startBrowser Function: Starting the browser and syncs the files
 * for dev and non dev environments
 */
function startBrowserSync(isDev, specRunner) {
    if (args.nosync || browserSync.active) {
        return;
    }

    log('Starting browser-sync on port ' + port);
    log('isDev ' + isDev);
    if (isDev) {
        gulp.watch([config.less, 
            ], ['styles'])
            .on('change', changeEvent);
    } else {
        gulp.watch([config.less, config.js.app, config.html
                
            ], ['optimize', browserSync.reload])
            .on('change', changeEvent);
    }

    var options = {
        proxy: 'localhost:' + port,
        port: 1440,
        files: isDev ? [
            config.client + '**/*.*',
            '!' + config.less,
            config.temp + '**/*.css'
        ] : [],
        ghostMode: {
            clicks: true,
            location: false,
            forms: true,
            scroll: true
        },
        injectChanges: true,
        logFileChanges: true,
        logLevel: 'debug',
        logPrefix: 'gulp-patterns',
        notify: true,
        reloadDelay: 0 //1000
    };

    if (specRunner) {
        options.startPath = config.specRunnerFile;
    }

    browserSync(options);
}
/**
 * notify Function: Notifies about the gulp events
 */
function notify(options) {
    var notifier = require('node-notifier');
    var notifyOptions = {
        sound: 'Bottle',
        contentImage: path.join(__dirname, 'gulp.png'),
        icon: path.join(__dirname, 'gulp.png')
    };
    _.assign(notifyOptions, options);
    notifier.notify(notifyOptions);
}