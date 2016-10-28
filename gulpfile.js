var gulp = require('gulp');
var useref = require('gulp-useref');

gulp.task('angular', function(){
    return gulp.src('node_modules/angular/angular.min.js')
        .pipe(useref())
        .pipe(gulp.dest('prod/js'));
});

gulp.task('bulma', function(){
    return gulp.src('node_modules/bulma/css/bulma.css')
        .pipe(useref())
        .pipe(gulp.dest('prod/css'));
});

gulp.task('compile', ['angular', 'bulma'], function (){
    console.log('Building files');
})
