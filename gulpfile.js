(function (require) {
    'use strict';

    // Gulp dependencies
    var gulp = require('gulp'),
        $ = require('gulp-load-plugins')(),
        del = require('del'),
        karmaServer = require('karma').Server,
        gulpProtractorAngular = require('gulp-angular-protractor'),
        runSequence = require('run-sequence');


    //Setting up the test task
    gulp.task('test-e2e', function(callback) {
        gulp.src(['dummy_spec.js'])
            .pipe(gulpProtractorAngular({
                'configFile': 'protractor.conf.js',
                'debug': false,
                'autoStartStopServer': true
            }))
            .on('error', function(e) {
                console.log(e);
            })
            .on('end', callback);
    });


    // Unit testing
    gulp.task('test-unit', function(done) {
        var server = new karmaServer({
            configFile: __dirname + '/karma.conf.js',
            singleRun: true
        }, done);

        server.start();
    });


    // Codewatcher
    gulp.task('autotest', function() {
        return gulp.watch(['src/scripts/**/*.js', '!src/scripts/modules/*.js', 'test/unit/spec/*.js'], ['test-unit']);
    });


    // Run JSHint linter. If it fails, the build process stops.
    gulp.task('jshint', function () {
        var src = [
            'src/**/scripts/**/*.js',
            'gulpfile.js',
            '!**/modules/**/*.js'
        ];

        return gulp.src(src)
            .pipe($.jshint())
            .pipe($.jshint.reporter('jshint-stylish'))
            .pipe($.jshint.reporter('fail'));
    });


    // Clean up build and destination folders
    gulp.task('clean', function (cb) {
        del(['dist/'], cb);
    });


    // Compile and minify less files into css file.
    gulp.task('build-css', function () {
        var src = ['src/styles/main.less'], dest = 'dist/styles';

        return gulp.src(src)
            .pipe($.less())
            .pipe($.minifyCss())
            .on('error', function (err) {
                $.util.log($.util.colors.red(err));
            })
            .pipe(gulp.dest(dest));
    });


    // Minify javascript files.
    gulp.task('build-js', function () {

        var src = ['src/scripts/app.js', 'src/scripts/**/*.js'],
            dest = 'dist/scripts';

        return gulp.src(src)
            .pipe($.concat('app.min.js'))
            .pipe($.uglify({
                mangle: false, // do not mangle
            }))
            .on('error', function (err) {
                $.util.log($.util.colors.red(err));
            })
            .pipe(gulp.dest(dest))
            .pipe($.size({
                title: 'javascripts'
            }));
    });


    // Minify HTML files and templates.
    gulp.task('build-html', function () {
        var dest = 'dist/';

        gulp.src('src/tpl/*.html').pipe(gulp.dest(dest + '/tpl'));

        return gulp.src('index.html')
            .pipe($.htmlReplace({
                'css': 'styles/main.css',
                'js': 'scripts/app.min.js',
                'tpl': {
                    src: 'tpl/spinner-overlay.html',
                    tpl: '<div bs-loading-overlay bs-loading-overlay-reference-id="main" bs-loading-overlay-template-url="%s"></div>'
                }
            }))
            .pipe($.htmlmin({collapseWhitespace: true}))
            .pipe(gulp.dest(dest))
            .pipe($.size({
                title: 'templates'
            }));
    });


    // Doing tests
    gulp.task('test-all', ['test-unit', 'test-e2e']);


    // Build all
    gulp.task('build-all', function () {
        runSequence(
            'jshint',
            'test-unit',
            'test-e2e',
            'clean',
            'build-css',
            'build-js',
            'build-html'
        );
    });


    // Default task, build all
    gulp.task('default', ['build-all']);

})(require);
