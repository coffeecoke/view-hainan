/**
 * 清理文件
 * @param gulp
 * @param Plugins
 * @param config
 */
module.exports=function (gulp, Plugins, config) {

    const TaskName=config.TaskName;

    /**
     *  clean all debug and latest release
     */
    gulp.task(TaskName.CleanAll,[
        TaskName.CleanDebug,
        TaskName.CleanRelease
    ]);


    gulp.task(TaskName.CleanCss,function (cb) {
        return Plugins.del([
            config.PreBuildPath+'/css',
            config.DebugPath+'/css'],cb);
    });

    gulp.task(TaskName.CleanPreBuild,function (cb) {
        return Plugins.del(config.PreBuildPath+'/*' ,cb);
    });

    gulp.task(TaskName.CleanDebug,function (cb) {
        return Plugins.del([
            config.PreBuildPath+'/*',config.DebugPath+'/*'
        ],cb);
    });

    gulp.task(TaskName.CleanRelease,function (cb) {
        return Plugins.del([
            config.PreBuildPath+'/*',config.getReleasePath()
        ],cb);
    });
};