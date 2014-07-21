var gulp = require('gulp');
var plugins = require('gulp-load-plugins')({
    scope: ['dependencies', 'devDependencies']
});

var PATHS = {
    JS: './src/javascript/staggertype/',
    DEST: './dist/'
}

gulp.task('scripts', function() {
    return gulp.src([   'src/js/staggertype/animationframe.js',
                        'src/js/staggertype/staggertype.js',
                        'src/js/staggertype/staggertype.easing.js'])
        .pipe(plugins.jshint('.jshintrc'))
        .pipe(plugins.jshint.reporter('default'))
        .pipe(plugins.concat('staggertype.js'))
        .pipe(gulp.dest('./dist/'))
        .pipe(plugins.rename({suffix: '.min'}))
        .pipe(plugins.uglify({

        }))
        .pipe(gulp.dest('./dist'))
        .pipe(plugins.notify({ message: 'Scripts task complete' }));
});


gulp.task('watch', function() {

    // Watch .js files
    gulp.watch('src/js/**/*.js', ['scripts']);

});


gulp.task('default', ['scripts', 'watch'], function() {
    gulp.start('scripts');
});