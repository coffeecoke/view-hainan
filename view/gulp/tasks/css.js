/**
 * 处理 css 相关内容
 * @param gulp
 * @param Plugins
 * @param config
 */
module.exports=function (gulp, Plugins, config) {

    const TaskName=config.TaskName;

    /**
     *  build css theme from less
     */
    gulp.task(TaskName.BuildCss,function () {
        return gulp.src([ config.LessRoot+'/themes/**/*.less',
            config.LessRoot+'/base.less' ])
            .pipe(Plugins.less())
            .pipe(Plugins.autoprefixer({
                browsers: ['cover 99.5%','not dead'],
                cascade: false,
                remove:false
            }))
            .pipe(gulp.dest(config.PreBuildPath+'/css'))
            .pipe(Plugins.notify({
                message: 'Build css complete!'
            }));
    });

    /**
     *  minimal css files to debug
     */
    gulp.task(TaskName.MinCssForDebug,function () {
        return gulp.src(config.PreBuildPath+'/css/**/*.css')
            .pipe(Plugins.rev())
            // .pipe(Plugins.cleanCss())
            .pipe(gulp.dest(config.DebugPath+'/css'))
            .pipe(Plugins.rev.manifest())
            .pipe(Plugins.rename('rev-css-debug.json'))
            .pipe(gulp.dest(config.PreBuildPath+'/rev'))
            .pipe(Plugins.notify({
                message: 'Minify css to debug path complete!'
            }));
    });

    /**
     *  minimal css files to release
     */
    gulp.task(TaskName.MinCssForRelease,function () {
        return gulp.src(config.PreBuildPath+'/css/**/*.css')
            .pipe(Plugins.rev())
            .pipe(Plugins.cleanCss())
            .pipe(gulp.dest(config.getReleasePath()+'/css'))
            .pipe(Plugins.rev.manifest())
            .pipe(Plugins.rename('rev-css-release.json'))
            .pipe(gulp.dest(config.PreBuildPath+'/rev'))
            .pipe(Plugins.notify({
                message: 'Minify css to release path complete!'
            }));
    });

};