'use strict';

var gulp = require('gulp');
var concat = require('gulp-concat');//合并
var path  = require('path');
var ngannotate = require('browserify-ngannotate');
var notify = require('gulp-notify');
var connect = require('gulp-connect');
var sourcemaps = require('gulp-sourcemaps');
var watch = require('gulp-watch');
var babelify = require('babelify');
var browserify = require('browserify');
var exorcist = require('exorcist');
var source = require('vinyl-source-stream');
var uglifyify = require('uglifyify');//压缩
var watchify = require('watchify');
var assign = require('lodash.assign');
var gutil = require('gulp-util');
var moment = require('moment');
var del = require("del"); 
var templateCache = require('gulp-angular-templatecache');
//var templateCache = require('gulp-template-cache');

// Add custom help messages to your gulp tasks
require('gulp-help')(gulp, {
    description: 'Help listing.'
});

//源文件目录
var srcPaths = {
	srcPath : './lib/ey-ui/src/', 
    scriptEntry: ['./lib/ey-ui/src/start.js',
                  './lib/ey-ui/src/common/common.js',
                  './lib/ey-ui/src/compoment/**/*.js',
                  './lib/ey-ui/src/tpl/templates.js',
                  './lib/ey-ui/src/end.js'],  //入口文件
    fonts: './lib/ey-ui/src/common/fonts/*',
    images: './lib/ey-ui/src/images/*',
    styles: './lib/ey-ui/src/**/css/*',
    htmls: './lib/ey-ui/src/compoment/**/tpl/*.html',
    html2Tplcache:'./lib/ey-ui/src/tabCompoment/tpl/*.html'
    
}

//目标文件目录
var destPaths = {
	destPath: './lib/ey-ui/dist/', //目标文件目录
    bundleMapName: './lib/ey-ui/dist/scripts/ey-ui.min.js.map',
    bundleName: 'ey-ui.min.js',
    scriptsPath: './lib/ey-ui/dist/scripts/',//目标 JS 文件目录
    fonts: './lib/ey-ui/dist/fonts/',
    images: './lib/ey-ui/dist/images/',
    styles: './lib/ey-ui/dist/css/',
    htmls: './lib/ey-ui/dist/tpl/',
    html2Tplcache:'./lib/ey-ui/src/tpl/'
}

//任务名称
var task = {
    buildScripts : 'buildScripts', //压缩构建JS文件
    watchScripts : 'watchScripts', //监控JS文件修改
    clean : 'clean', //构建前删除文件
    develop: 'develop', //开发监控启动
    build: 'build', //构建打包
    server: 'server',  //启动服务
    fonts: 'fonts',
    images: 'images',
    buildStyles: 'buildStyles',
    watchStyles: 'watchStyles',
    watchHtmls: 'watchHtmls',
    html2Tplcache:'html2Tplcache'
}

/*gulp.task(task.html2Tplcache, function() {
  return gulp.src(srcPaths.html2Tplcache)
    .pipe(templateCache())
    .pipe(gulp.dest(destPaths.html2Tplcache));
});*/

gulp.task(task.html2Tplcache, function () {
  return gulp.src(srcPaths.htmls)
    .pipe(templateCache({
        module: "ui.ey-ui"
    }))
    .pipe(gulp.dest(destPaths.html2Tplcache));
});

//启动服务
/**** ****/
gulp.task(task.server, 'A simple web server.', ()=>{
    connect.server({
        root: './',
        port: 3000,
        livereload: true
    });
    console.log("http://localhost:3000/");
});


//构建JS  task.html2Tplcache
gulp.task(task.buildScripts, 'build scripts',[task.html2Tplcache], function(){
    var bundler = initBrowserify();
    bundleJs(bundler);
});

//监控JS文件修改
gulp.task(task.watchScripts, 'build and watch scripts files', function(){
    var br = initBrowserify();
    var w = watchify(br)
    .on('update', function(){
        bundleJs(w);
    })
    .on('log', gutil.log);
    bundleJs(w);
});


gulp.task(task.fonts, "copy fonts to dest dir", function(){
    return gulp.src(srcPaths.fonts)
        .pipe(gulp.dest(destPaths.fonts));
});


gulp.task(task.images, "copy images to dest dir", function(){
    return gulp.src(srcPaths.images)
        .pipe(gulp.dest(destPaths.images));
        /*.pipe(gulp.dest(function(file) {
            var fileName = destPaths.images + file.path.split("\\").pop();
            return fileName;
        }));*/
});

gulp.task(task.watchStyles, "build and watch styles", function(){
    gulp.start(task.buildStyles);
    return gulp.watch(srcPaths.styles, [task.buildStyles]);
});

gulp.task(task.buildStyles, "build styles and copy fonts", [task.fonts, task.images], function() {
    gulp.src(srcPaths.styles)
    .pipe(concat('ey-ui.min.css'))
    .pipe(sourcemaps.init())
   /*.pipe(sass({
        errLogToConsole: true,
        sourcemaps: true,
        outputStyle: 'compressed'
    }))*/
    .pipe(sourcemaps.write("./"))
    .on('error', notify.onError("Error: <%= error.message %>"))
    .pipe(gulp.dest(destPaths.styles));
    /*.pipe(notify('Compiled sass (' + moment().format('MMM Do h:mm:ss A') + ')'));
    .pipe(connect.reload())*/
});


gulp.task(task.watchHtmls, "watch htmls and copy them to dest dir",function(){
    gulp.start(task.html2Tplcache);
    return gulp.watch(srcPaths.htmls,[task.html2Tplcache]);
});

////////////////////common function begin//////////////////////////
function initBrowserify(){
	// 在这里添加自定义 browserify 选项
    var opts = assign( {}, watchify.args, {
        entries: [srcPaths.scriptEntry],
        debug: false
    });

    var br = browserify(opts)
    //es6转化为es5
    //.transform(babelify, { 
     //   presets: ['es2015'],
    //})
    //用 /** @ngInject */ 对需要自动依赖注入的function进行注释。
    .transform(ngannotate)
    //将合并的js文件压缩混淆
    //.transform(uglifyify, {global: true}); 

    return br;
}

function bundleJs(bundler){
    return gulp.src(srcPaths.scriptEntry)     //要合并的文件
            .pipe(concat('ey-ui.all.js'))  // 合并匹配到的js文件并命名为 "all.js"
            .pipe(gulp.dest(destPaths.scriptsPath));
    /*return bundler.bundle()
        // 如果有错误发生，记录这些错误
        .on('error', notify.onError('Error: <%= error.message %>'))
        //  from a stream, to a stream, and send source map to a stream
        .pipe(exorcist(destPaths.bundleMapName))//
        //目标文件名称
        .pipe(source(destPaths.bundleName))*/
        // 可选项，如果你不需要缓存文件内容，就删除
        //.pipe(buffer())
        // 目标目录
        //.pipe(gulp.dest(destPaths.scriptsPath));
        /*// 提示
        .pipe(notify('Compiled scripts (' + moment().format('MMM Do h:mm:ss A') + ')'))
        // 刷新
        .pipe(connect.reload());*/
}
////////////////////common function end//////////////////////////

//编译之前删除文件
gulp.task(task.clean, 'clean before build', function(cb) { 
	return del([destPaths.destPath], cb);
});

// gulp.task(task.develop, [task.clean,task.buildStyles,task.buildScripts,task.watchHtmls,task.server]);
gulp.task(task.build, [task.html2Tplcache,task.buildStyles,task.buildScripts]);
