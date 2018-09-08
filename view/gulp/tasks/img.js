/**
 * 压缩图片、css-sprites等
 * @param gulp
 * @param Plugins
 * @param config
 */
module.exports=function (gulp, Plugins, config) {

    const TaskName=config.TaskName;

    gulp.task(TaskName.MinImgForDebug,function () {
        return gulp.src(config.ImagePath+'/*')
            .pipe(Plugins.rev())
            .pipe(Plugins.imagemin())
            .pipe(gulp.dest(config.DebugPath+'/assets/image'))
            .pipe(Plugins.rev.manifest())
            .pipe(Plugins.rename('rev-img-debug.json'))
            .pipe(gulp.dest(config.PreBuildPath+'/rev'))
            .pipe(Plugins.notify({
                message: 'Minify images to debug path complete!'
            }));
    });

    gulp.task(TaskName.MinImgForRelease,function () {
        return gulp.src(config.ImagePath+'/*')
            .pipe(Plugins.rev())
            .pipe(Plugins.imagemin())
            .pipe(gulp.dest(config.getReleasePath()+'/assets/image'))
            .pipe(Plugins.rev.manifest())
            .pipe(Plugins.rename('rev-img-release.json'))
            .pipe(gulp.dest(config.PreBuildPath+'/rev'))
            .pipe(Plugins.notify({
                message: 'Minify images to release path complete!'
            }));
    });

};