const gulp = require('gulp'),
      sass = require('gulp-sass'),
      postcss = require('gulp-postcss'),
      autoprefixer = require('autoprefixer'),
      cssnano = require('cssnano'),
      sourcemaps = require('gulp-sourcemaps'),
      uglify = require('gulp-uglify-es').default,
      rename = require('gulp-rename'),
      htmlmin = require('gulp-htmlmin'),
      imagemin = require('gulp-imagemin'),
      imageminMozjpeg = require('imagemin-mozjpeg'),
      browsersync = require('browser-sync').create();

// PATHS
const paths = {
    styles: {
        src: 'src/scss/main.scss',
        dest: 'dist/css'
    },
    scripts: {
        src: 'src/js/*.js',
        dest: 'dist/js'
    },
    pages: {
        src: 'src/*.html',
        dest: 'dist'
    },
    images: {
        src: 'src/img/*',
        dest: 'dist/img'
    }
}

// IMAGES
function images() {
    return gulp
        .src(paths.images.src)
        .pipe(imagemin([
            imageminMozjpeg({
                quality: 40
            })
        ]))
        .pipe(gulp.dest(paths.images.dest));
}

// HMTL
function html() {
    return gulp
        .src(paths.pages.src)
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true
        }))
        .pipe(gulp.dest(paths.pages.dest));
}

// STYLES
function style() {
    return gulp
        .src(paths.styles.src)
        .pipe(rename('main.min.css'))
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}))
        .on('error', sass.logError)
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.styles.dest))
        .pipe(browsersync.stream());
}

// SCRIPT
function script() {
    return gulp
        .src(paths.scripts.src)
        .pipe(rename('main.min.js'))
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.scripts.dest));
}

// RELOAD
function reload() {
    browsersync.reload();
}

// WATCH
function watch() {
    browsersync.init({
        server: {
            baseDir: './dist'
        }
    });

    gulp.watch(paths.pages.src, html).on('change', browsersync.reload);
    gulp.watch(paths.styles.src, style).on('change', browsersync.reload);
    gulp.watch(paths.scripts.src, script);
    gulp.watch(paths.pages.src, reload);
/*     gulp.watch('dist/*.html').on('change', browsersync.reload); */
    
}

// EXPORTS
exports.watch = watch;
exports.style = style;
exports.html = html;
exports.script = script;

var build = gulp.parallel(style, watch, script, html);

gulp.task('images', images);

gulp.task('build', build);

gulp.task('default', build);