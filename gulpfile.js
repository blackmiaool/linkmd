var gulp = require('gulp');

var path = require('path');
var replace = require('gulp-replace')
var livereload = require('gulp-livereload');
var _ = require('underscore');

var fs = require("fs");
var shell = require('gulp-shell')
var node_less = require('less');

var copy = require('gulp-copy');
var concat = require("gulp-concat");
var md2json = require("gulp-markdown-table-to-json");

var rename = require("gulp-rename");
var cached = require("gulp-cached")
var gutil = require('gulp-util');
var injectfile = require('gulp-inject-file')
var headerfooter = require('gulp-header-footer');
var merge = require('merge-stream');
var babel = require('gulp-babel');

function get_babel_params() {
    return {
        //        compact: false,
        presets: ['es2015'],
        //        plugins: ["transform-runtime"],
        //        optional: ['runtime'],
    }
}
gulp.task('html', function () {
    return gulp.src(['html/index.html', 'html/editor.html'])
        .pipe(injectfile({
            pattern: '<!--\\sinject:<filename>-->',
            recursive: true
        }))
        .pipe(cached("html"))
        .pipe(gulp.dest('dist/')).pipe(livereload());
})
gulp.task('tag', function () {
    return gulp.src(['tag/**/*.tag'])
        .pipe(cached("tag"))
        .pipe(gulp.dest('dist/')).pipe(livereload());
})
var less = require('gulp-less');
gulp.task('less', function () {

    var e = less({
        paths: [path.join(__dirname, 'less')]
    });

    function swallowError(error) {

        // If you want details of the error in the console
        console.log(error.toString())

        this.emit('end')
    }
    return gulp.src(['less/style.less','less/deep-ui.less'])
        .pipe(e)
        .pipe(cached("less"))
        .on('error', swallowError)
        .pipe(gulp.dest('dist/css')).pipe(livereload());
});

gulp.task('mv-dist',  function () {
    gulp.src('libs/css/**/*')
        .pipe(gulp.dest('dist/css'));
    gulp.src('libs/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'))
    return gulp.src('libs/js/**/*')
        .pipe(gulp.dest('dist/js'));
});


gulp.task('es6', function () {
    var babel_pipe = babel(get_babel_params());
    babel_pipe.on('error', function (ee) {
        gutil.log(ee);
        babel_pipe.end();
    });
    return gulp.src(['js/**/*.js'])
    .pipe(injectfile({
            pattern: '<!--\\sinject:<filename>-->'
        }))
        .pipe(cached("es6"))
        .pipe(babel_pipe)
        .pipe(gulp.dest('dist/js'))
        .pipe(livereload());
});
//
//gulp.task('mv-res', function () {
//    return gulp.src('res/**/*')
//        .pipe(cached("mv-res"))
//        .pipe(gulp.dest("dist/res/"));
//})
gulp.task('default', function () {

    gulp.start(["mv-dist", "tag","less", "html", "es6"]);

});
gulp.task('reload', function () {

    gulp.src("")
        .pipe(livereload());

});

livereload.listen();
gulp.watch('less/**/*.less', ['less']);
gulp.watch(['js/**/*.js'], ['es6']);
gulp.watch('index.html', ['reload']);
gulp.watch('html/**/*.html', ['html']);
gulp.watch('tag/**/*.tag', ['tag']);
//gulp.watch('res/**/*.*', ['mv-res', 'reload'])
