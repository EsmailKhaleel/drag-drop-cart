const { src, dest, series, parallel, watch } = require("gulp");


const globs = {
    html: "project/*.html",
    css: "project/css/*.css",
    js: "project/js/*.js",
    img: "project/images/*"
};

// ===================================================
// Bonus task to use gulp-useref, gulp-replace
// ===================================================

const htmlmin = require("gulp-html-minifier-terser");
const replace = require("gulp-replace");
const useref = require("gulp-useref");
// html task
function htmlTask() {
    //access html file
    return src(globs.html)
        // Updates paths in HTML
        .pipe(useref())
        .pipe(replace(/src=["']?images\//g, 'src="assets/images/'))
        //minify
        .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
        // move to dist
        .pipe(dest("dist"));
}
exports.h = htmlTask;



const concat = require("gulp-concat");
const cleanCSS = require('gulp-clean-css');
function cssTask() {
    // access css files
    return src(globs.css)
        // concat to one file
        .pipe(concat("style.min.css"))
        // minify
        .pipe(cleanCSS())
        // move to dist
        .pipe(dest("dist/assets/css"));
}
exports.css = cssTask;


const terser = require('gulp-terser');
function jsTask() {
    return src(globs.js, { sourcemaps: true })
        .pipe(concat("script.min.js"))
        .pipe(terser())
        .pipe(dest("dist/assets/js", { sourcemaps: "." }));
}
exports.js = jsTask;


const optimizeImages = require("gulp-optimize-images");
function imgTask() {

    return src(globs.img, { encoding: false })
        .pipe(optimizeImages({
            compressOptions: {
                jpg: { quality: 60 }
            }
        }))
        .pipe(dest('dist/images'));
}
exports.img = imgTask

function watchTask() {
    watch(globs.html, htmlTask)
    watch(globs.css, cssTask)
    watch(globs.js, jsTask)
    watch(globs.img, imgTask)
}


//default //gulp
exports.default = series(parallel(htmlTask, cssTask, jsTask, imgTask), watchTask);


