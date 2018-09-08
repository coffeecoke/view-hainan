/**
 * 按照参数构建
 * @param gulp
 * @param Plugins
 * @param config
 */
module.exports=function (gulp, Plugins, config) {

    const Types=['debug','release'],
        TypeStr=Types.join(','),
        TaskName=config.TaskName;

    const buildProject=function (type) {
        if(type && type.length>1 && TypeStr.indexOf(type)>-1){
            const cmdLst={
                clean:'',
                buildCss:TaskName.BuildCss,
                minCss:'',
                minImg:'',
                minHtml:'',
                minJS:'',
                resultPath:''
            };
            if(Types[0]==type){
                cmdLst.clean=TaskName.CleanDebug;
                cmdLst.minCss=TaskName.MinCssForDebug;
                cmdLst.minImg=TaskName.MinImgForDebug;
                cmdLst.minHtml=TaskName.MinHtmlForDebug;

                cmdLst.resultPath=config.DebugPath;
            }else if(Types[1]==type){
                // create version no.
                config.Version=createVersion(Date.now());
                cmdLst.clean=TaskName.CleanRelease;
                cmdLst.minCss=TaskName.MinCssForRelease;
                cmdLst.minImg=TaskName.MinImgForRelease;
                cmdLst.minHtml=TaskName.MinHtmlForRelease;
                cmdLst.resultPath=config.getReleasePath();

            }
            const msg=type+' complete:'+cmdLst.resultPath+'!';

            Plugins.runSequence(
                cmdLst.clean,cmdLst.buildCss,
                [cmdLst.minCss,cmdLst.minImg],
                function () {
                    console.log(msg);
                });
        }
    };

    /**
     * create version no. by md5 ( prefix 8 pos. )
     * @param key
     * @returns {string}
     */
    const createVersion=function (key) {
        let res,tmp;
        const hsh=Plugins.crypto.createHash('md5');
        hsh.update(key+'');
        tmp=hsh.digest('hex');
        res=key+'-'+tmp.substring(0,8);
        return res;
    };

    return buildProject;
};