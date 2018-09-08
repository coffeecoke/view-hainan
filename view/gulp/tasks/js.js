/**
 * 处理js相关任务
 * @param gulp
 * @param Plugins
 * @param config
 */
module.exports=function (gulp, Plugins, config) {

    const TaskName = config.TaskName;

    gulp.task(TaskName.BabelJS,function () {
        return gulp.src([config.PhoenixRoot+'/**/*.js',
            '!'+config.PhoenixRoot+'/quickGis.js'])
            .pipe(Plugins.babel({
                presets: ['env']
            }))
            .pipe(gulp.dest(config.PreBuildPath+'/js'));

    });
};