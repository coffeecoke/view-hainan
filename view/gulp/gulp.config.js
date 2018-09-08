module.exports= function () {
    //  define variables in gulp task
    const RootPath='./';
    let config={
        ProductName:'phoenix-3.0',
        Version:'init',
        RootPath:RootPath,  //  based on gulpfile.js path
        GulpRoot:RootPath+'gulp',  //   file path for gulp
        TaskFilePath:RootPath+'gulp/tasks',  //  gulp task file path
        PreBuildPath:RootPath+'prebuild',  //  before dist，just like less、gulp-rev, etc.
        DebugPath:RootPath+'debug',
        SrcPath:RootPath+'src',
        ReleaseRoot:RootPath+'release',    //  release dir

        LessRoot:RootPath+'src/less',
        PhoenixRoot:RootPath+'src/phoenix',
        ImagePath:RootPath+'src/phoenix/assets/images'
    };

    config.TaskName={
        Default:'default',
        Help:'help',
        Detail:'detail',
        Release:'release',
        Debug:'debug',

        BuildCss:'build:css',
        BabelJS:'build:babel',

        CleanAll:'cleanAll',
        CleanPreBuild:'cleanPreBuild',
        CleanCss:'cleanCss',
        CleanDebug:'cleanDebug',
        MinCssForDebug:'minCss4Debug',
        MinImgForDebug:'minImg4Debug',
        MinHtmlForDebug:'minHtml4Debug',

        CleanRelease:'cleanRelease',
        MinCssForRelease:'minCss4Release',
        MinImgForRelease:'minImg4Release',
        MinHtmlForRelease:'minHtml4Release'
    };

    config.getReleasePath=function () {
        return config.ReleaseRoot+'/'+config.ProductName+'-'+config.Version;
    };

    return config;
};