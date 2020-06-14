var gulp = require("gulp"),
    sass = require("gulp-sass"),
    postcss = require("gulp-postcss"),
    autoprefixer = require("autoprefixer"),
    cssnano = require("cssnano"),
    sourcemaps = require("gulp-sourcemaps"),
	del = require("del"),
    browserSync = require("browser-sync").create();

var paths = {
    html: {
        src: './app/**/*.html',
        dest: './build'
    },
    styles: {
        src: "./app/scss/**/*.scss",
        dest: "./build/css"
    },
    images: {
        src: './app/static/**/*',
        dest: './build/static'
    }
};

const clean = () => del(['./build']);

function html(){
    return gulp
      .src(paths.html.src)
      .pipe(gulp.dest(paths.html.dest));
}

function styles() {
    return gulp
        .src(paths.styles.src)
        // Initialize sourcemaps before compilation starts
        .pipe(sourcemaps.init())
        .pipe(sass())
        .on("error", sass.logError)
        // Use postcss with autoprefixer and compress the compiled file using cssnano
        .pipe(postcss([autoprefixer(), cssnano()]))
        // Now add/write the sourcemaps
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.styles.dest))
        // Add browsersync stream pipe after compilation
        .pipe(browserSync.stream());
}

function images(){
    return gulp
      .src(paths.images.src)
      .pipe(gulp.dest(paths.images.dest));
}

function watchChanges() {
    browserSync.init({
        server: {
            baseDir: "./build"
        }
    });
    gulp.watch(paths.styles.src, styles);
    gulp.watch(paths.html.src).on('change', browserSync.reload);
}


const build = gulp.series(
    clean,
    gulp.parallel(styles, images),
    html
    );

const watch = gulp.series(build, watchChanges);

exports.images = images;
exports.clean = clean;
exports.style = styles;
exports.watch = watch
exports.build = build;
exports.default = build;
