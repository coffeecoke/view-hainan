

var shieldProgress = null;
var shieldProgress2 = null;
var industryMap = getNameByCode();
/**
 * 渲染行业图标
 * @param {*}
 */
var renderIndustryIcon = function() {
    renderFrame();
    renderModal()
    var doms=$('#allIcon .icon-item'),domItems=[];
    $.each(doms,function(i,item){
        domItems.push({
            wrapDom:item,
            bgWidth:900,
            bgHeight:900,
            bgWrapDom:$(item).find('.cicle')[0],
            bgColors:[
                {stop:0.47,color:'transparent'},
                // {stop:.72,color:'#4970b3'},
                {stop:.55,color:'transparent'},
                {stop:1,color:'transparent'}
            ],
            handler:function(data){
                // item.trigger('click');
                //console.log('call item');
                var $wrap=$(data.wrapDom);
                var code=$wrap.data('code');
                // 行业指标
                renderIndex(code);
                // 行业指标变化
                renderIndexChange(code);
                // 企业数据
                renderCompanyData(code);
                
                // 运行指数
                renderOperateIndex(code);
                // 风险分布图
                renderRiskMap(code);
                // 风险信息
                renderRiskInformation(code);
            }
        });
    });
    
    var ScreenWidth=$('#industryIcon').width(),
        ScreenHeight=$('#industryIcon').height();
    var iconTrans=new window.SphereDoms.default({
        width:ScreenWidth,
        height:ScreenHeight,
        showStats:false,
        wrapDom:document.getElementById('industryIcon')
    });
    iconTrans.addToStage();

    iconTrans.appendDoms(domItems,2400,2000);

    var size=domItems.length;
    iconTrans.autoSwitch(true,50000);

    window.animateProxy.playAnimation();

};

var riskMap;    // 运行风险echart
var indexChangeChart; //指标变化echart
/**
 * 渲染框架
 */
var renderFrame = function() {
    renderBlockBorder(".origin-border");
    renderTitle("#index .origin-border", "");
    renderTitle("#indexChange .origin-border", "");
    renderTitle("#operateIndex .origin-border", "");
    renderTitle("#riskMap .origin-border", "");
    renderTitle("#risk-modal .origin-border", "");
    // 行业指标
    $('#index .origin-border .horn').append('<div class="item-container"></div>');
    // 指标变化
    $('#indexChange .origin-border .horn').append('<ul class="echarts-list"><li class="active" data-code="BRIR">融资金额</li><li data-code="TVGR">交易金额</li><li data-code="TGR">投资人数</li></ul>');
    $('#indexChange .origin-border .horn').append('<div class="item-container"></div>');
    indexChangeChart = echarts.init($('#indexChange .origin-border .horn .item-container')[0]);
    indexChangeChart2 = echarts.init($('#indexChange .origin-border .horn .item-container')[1]);
    // 交易场所运行指数
    var html = '<div class="item-container">';
    html += '<div class="data-container"><div class="canvas-container"></div></div>';
    html += '<div class="icon-container"><div class="icon-item-list"></div></div>';
    html += '</div>';
    $('#operateIndex .origin-border .horn').append(html);
    
    // 风险分布图
    $('#riskMap .origin-border .horn').append('<div class="item-container"></div>')
    $('#riskMap .origin-border .horn').append('<div class="right-containers"></div>');
    riskMap = echarts.init($('#riskMap .origin-border .horn .item-container')[0]);
    riskMap2 = echarts.init($('#riskMap .origin-border .horn .item-container')[1]);
    initProgress();
    initProgress2();
    //var code = industry[0].code;

    // 弹出层table
    $("#risk-modal .origin-border .horn").append("<div class='table-container'></div>");
    
};

var initProgress = function() {
    var opts={
        width:350,
        height:350,
        bgColors:'#111',
        lineCap:'round',
        showShadow:true,
        shadowBlur:8,
        shadowColor:'#101856',
        type:'shield',
        wrapDom:$('#operateIndex .item-container .data-container .canvas-container')[0],
        lineWidth:10,
        lineColors:'#122147', //  array or string
        shadowBlur:5
    };
    shieldProgress=new ProgressUtil.default(opts);
    shieldProgress.render();
};
var initProgress2 = function() {
    var opts={
        width:350,
        height:350,
        bgColors:'#111',
        lineCap:'round',
        showShadow:true,
        shadowBlur:8,
        shadowColor:'#101856',
        type:'shield',
        wrapDom:$('#operateIndex .item-container .data-container .canvas-container')[1],
        lineWidth:10,
        lineColors:'#122147', //  array or string
        shadowBlur:5
    };
    shieldProgress2=new ProgressUtil.default(opts);
    shieldProgress2.render();
};

/**
 * 设置图标的点击事件
 */
var setEvent = function() {
   
    $('#industryIcon .icon-item:not([data-code=3spot])').on('click',function(){
        var code= $(this).data('code');
        // 图标转换
        iconChange($(this));
        // 行业指标
        renderIndex(code);
        // 行业指标变化
        renderIndexChange(code);
        // 企业数据
        renderCompanyData(code);
        // 运行指数
        renderOperateIndex(code);
        // 风险分布图
        renderRiskMap(code);
    });
};

/**
 * 图标转换
 * @param {*} $obj 需要展示jQuery对象
 */
var iconChange = function($obj) {
    var index = parseInt($obj.attr('index'));   
    $('#industryIcon .icon-item:not([data-code=3spot])').each(function() {
        var thisIndex = parseInt($(this).attr('index'));  
        
        if(thisIndex >= index) {
            $(this).attr('index', thisIndex - index);
        } else {
            $(this).attr('index', $('#industryIcon .icon-item:not([data-code=3spot])').length + thisIndex - index);
        }
    });
};



/**
 * 渲染行业指标
 * @param {*} code 需要展示的数据的code值
 */
var renderIndex = function(code) {

    $.ajax({
        url: 'data/indexData'+code+'.json',
        data:{code:code},
        dataType: 'json',
        success: function(data){
            $('#index .origin-border .title-container .text span').text(industryMap[code] + '行业指标');
            renderIndexData('#index .origin-border .horn .item-container', data, 12);
            $('#index').toggleClass('card-flipped')
          
            
        }
    });
};

/**
 * 行业指标变化折线图
 * @param {*} data 数据
 */

var initIndexChangeChart = function(data,dataName) {
    var date = [];
    var dataBRIR = [];
    var dataTVGR = [];
    var dataTGR = [];
    $.each(data, function(index, item) {
        date.push(item.date);
        dataBRIR.push(item.BRIR);
        dataTVGR.push(item.TVGR);
        dataTGR.push(item.TGR);
    
    });
    var datas = {
        BRIR:dataBRIR,
        TVGR:dataTVGR,
        TGR:dataTGR
    }
    var option = {
        tooltip: {
            trigger: 'axis',
            position: function (pt) {
                return [pt[0], '10%'];
            }
        },
        legend : {
            show:false,
            icon:'rect',
            itemWidth: 10,
            itemHeight: 10,
            y : 'top',
            right : '40px',
            color : ['#3A73C9','#E13848','#efd147'],
            textStyle: {
                color:'#FFF',
                fontSize:'24px'
            },
            data : [{name:'投资金额'}]
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            axisLine: {
                show: true,
                lineStyle: {
                    color: '#999999',
                    width: 3,
                    type: 'solid'
                }
            },
            axisLabel: {
                textStyle: {
                    color : "#999999",
                    fontSize : 16
                },
                interval:0,
                // rotate:40
            },
            data: date
        },
        yAxis: [{
            type: 'value',
            boundaryGap: [0, '100%'],
            max : function(value) {
                return Math.ceil(value.max/10)*10;
            },
            splitLine: {
                show: true,
                lineStyle : {
                    color: '#999999',
                    width: 1,
                    type: 'dashed',
                    opacity : 0.5
                }
                
            },
            axisLine: {
                show: true,
                lineStyle: {
                    color: '#999999',
                    width: 3,
                    type: 'solid'
                }
            },
            axisLabel: {
                textStyle: {
                    color : "#999999",
                    fontSize : 16
                }
            }
        },
        {
            type: 'category',
           
            position: 'right',
            axisLine: {
                show: true,
                lineStyle: {
                    color: '999999',
                    width: 3,
                    type: 'solid'
                }
            },
            splitLine: {
                show: 'show',
                lineStyle : {
                    color: 'transparent',
                    width: 1,
                    type: 'dashed',
                    opacity : 0.5
                }
                
            },
            axisLabel: {
                textStyle: {
                    color : "#999999",
                    fontSize : 16
                }
            },
           
           
        }],
        series: [
            {
                name:'投资金额',
                type:'line',
                symbol: 'none',
                itemStyle: {
                    normal: {
                        color: 'rgb(38,150,94,0.8)'
                    }
                },
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgb(38,150,94,0.8)'
                        }, {
                            offset: 1,
                            color: 'rgb(38,150,94,0)'
                        }])
                    }
                },
                data: datas[dataName]
            }
        ]
    };
    indexChangeChart.setOption(option);
    indexChangeChart2.setOption(option);
};

/**
 * 渲染行业指标变化
 * @param {*} code 需要展示的数据的code值
 */

var renderIndexChange = function(code) {
    
    $.ajax({
        url: 'data/indexChangeData.json',
        data:{code:code},
        dataType: 'json',
        success: function(data){
           
            $('#indexChange .origin-border .title-container .text span').text(industryMap[code] + '行业指标变化');
            initIndexChangeChart(data,'BRIR'); // 渲染数据
            $('#indexChange').toggleClass('card-flipped')
            $("#indexChange .origin-border .horn").on("click",".echarts-list li",function(){
                $(this).addClass("active").siblings().removeClass("active");
                var dataName = $(this).data('code')
                initIndexChangeChart(data,dataName);
            });
           
        }
    });

};

/**
 * 渲染企业数据
 * @param {*} code 需要展示的数据的code值
 */
var renderCompanyData = function(code) {
    var configs ={
        "01":[
            {name :"排名", key:"rank",  width : "5%", class:"rank"},
            {name :"企业名称", key:"companyName",  width : "25%", class:"white"},
            {name :"所属区域", key:"region",  width : "10%", class:"blue"},
            {name :"指数", key:"index",  width : "10%", class:"blue"},
            {name :"信用风险", key:"cRisk",  width : "10%", class:"blue", class:"level"},
            {name :"操作风险", key:"orisk",  width : "10%", class:"blue", class:"level"},
            {name :"管理风险", key:"mrisk",  width : "10%", class:"blue", class:"level"},
            {name :"经营风险", key:"brisk",  width : "10%", class:"blue", class:"level"},
        ],
        "02":[
            {name :"排名", key:"rank",  width : "5%", class:"rank"},
            {name :"企业名称", key:"companyName",  width : "25%", class:"white"},
            {name :"所属区域", key:"region",  width : "10%", class:"blue"},
            {name :"指数", key:"index",  width : "10%", class:"blue"},
            {name :"资产质量", key:"quality",  width : "10%", class:"blue", class:"level"},
            {name :"流动性", key:"fluidity",  width : "10%", class:"blue", class:"level"},
            {name :"盈利及效率", key:"profit",  width : "10%", class:"blue", class:"level"},
            {name :"管理风险", key:"mrisk",  width : "10%", class:"blue", class:"level"},
            {name :"经营风险", key:"brisk",  width : "10%", class:"blue", class:"level"},
        ],
        "03":[
            {name :"排名", key:"rank",  width : "5%", class:"rank"},
            {name :"企业名称", key:"companyName",  width : "25%", class:"white"},
            {name :"所属区域", key:"region",  width : "10%", class:"blue"},
            {name :"指数", key:"index",  width : "10%", class:"blue"},
            {name :"信用风险", key:"cRisk",  width : "10%", class:"blue", class:"level"},
            {name :"合规风险", key:"lrisk",  width : "10%", class:"blue", class:"level"},
            {name :"管理风险", key:"mrisk",  width : "10%", class:"blue", class:"level"},
            {name :"经营风险", key:"brisk",  width : "10%", class:"blue", class:"level"},
        ],
        "04":[
            {name :"排名", key:"rank",  width : "5%", class:"rank"},
            {name :"企业名称", key:"companyName",  width : "25%", class:"white"},
            {name :"所属区域", key:"region",  width : "10%", class:"blue"},
            {name :"指数", key:"index",  width : "10%", class:"blue"},
            {name :"信用风险", key:"cRisk",  width : "10%", class:"blue", class:"level"},
            {name :"合规风险", key:"lrisk",  width : "10%", class:"blue", class:"level"},
            {name :"管理风险", key:"mrisk",  width : "10%", class:"blue", class:"level"},
            {name :"经营风险", key:"brisk",  width : "10%", class:"blue", class:"level"},
        ]
    }
    var config = [
        {name :"排名", key:"rank",  width : "5%", class:"rank"},
        {name :"企业名称", key:"companyName",  width : "25%", class:"white"},
        {name :"所属区域", key:"region",  width : "10%", class:"blue"},
        {name :"指数", key:"index",  width : "10%", class:"blue"},
        {name :"资产质量", key:"quality",  width : "10%", class:"blue", class:"level"},
        {name :"流动性", key:"fluidity",  width : "10%", class:"blue", class:"level"},
        {name :"盈利及效率", key:"profit",  width : "10%", class:"blue", class:"level"},
        {name :"管理风险", key:"mrisk",  width : "10%", class:"blue", class:"level"},
        {name :"经营风险", key:"orisk",  width : "10%", class:"blue", class:"level"},
    ];
    
    initTable('#companyData .table-container', 'data/companyData'+code+'.json', {code:code}, configs[code]);
};

var operateIconMap = {
    // P2P
    '01-01':'operate01.png',
    '01-02':'operate02.png',
    '01-03':'operate04.png',
    '01-04':'operate05.png',
    '01-05':'operate06.png',
    '01-06':'operate07.png',
    // 小额贷款
    '02-01':'operate01.png',
    '02-02':'operate02.png',
    '02-03':'operate04.png',
    '02-04':'operate05.png',
    '02-05':'operate06.png',
    '02-06':'operate07.png',
    // 各类交易场所
    '03-01':'operate01.png',
    '03-02':'operate04.png',
    '03-03':'operate05.png',
    '03-04':'operate06.png',
    '03-05':'operate07.png',
    // 股权交易
    '04-01':'operate01.png',
    '04-02':'operate04.png',
    '04-03':'operate05.png',
    '04-04':'operate06.png',
    '04-05':'operate07.png',
    // 融资担保
    '05-01':'operate01.png',
    '05-02':'operate02.png',
    '05-03':'operate04.png',
    '05-04':'operate05.png',
    '05-05':'operate06.png',
    '05-06':'operate07.png',
    // 典当行
    '06-01':'operate01.png',
    '06-02':'operate02.png',
    '06-03':'.png',
    '06-04':'operate04.png',
    '06-05':'operate05.png',
    '06-06':'operate06.png',
    '06-07':'operate07.png',
    // 融资租赁公司
    '07-01':'operate01.png',
    '07-02':'operate02.png',
    '07-03':'.png',
    '07-04':'operate04.png',
    '07-05':'operate05.png',
    '07-06':'operate06.png',
    '07-07':'operate07.png',
    // 商业保理公司（资产公司）
    '08-01':'.png',
    '08-02':'operate04.png',
    '08-03':'operate05.png',
    '08-04':'operate08.png',
    '08-05':'operate07.png',
    // 地方融资公司(融资担保)
    '09-01':'operate01.png',
    '09-02':'operate02.png',
    '09-03':'operate04.png',
    '09-04':'operate05.png',
    '09-05':'operate06.png',
    '09-06':'operate07.png',
    // 农村合作组织
    '10-01':'operate01.png',
    '10-02':'operate02.png',
    '10-03':'operate04.png',
    '10-04':'operate05.png',
    '10-05':'operate06.png',
    '10-06':'operate07.png',
};

/**
 * 渲染运行指数
 * @param {*} data 
 */
var initOperateIndex = function(data) {
    var html = '';
    var score = 65;
    $.each(data, function(index, item) {

        html += '<div class="operate-item">';
        html += '<div class="icon">';
        html += '<img src="img/operate0'+(index+1)+'.png" />'
        html += '</div>';
        html += '<div class="name">' + item.name + '</div>'
        html += '<div class="value">' + item.value + '</div>'
        html += '</div>'
    });
    $('#operateIndex .origin-border .horn .icon-container .icon-item-list').html(html);
    // 指数
    shieldProgress.update(Math.floor(Math.random()*(80-60+1)+60));
    shieldProgress2.update(Math.floor(Math.random()*(80-60+1)+60));
};

/**
 * 渲染运行指数
 * @param {*} code 需要展示的数据的code值
 */
var renderOperateIndex = function(code) {
    // 渲染右侧数据
    $.ajax({
        url: 'data/operateIndexData'+code+'.json',
        data:{code:code},
        dataType: 'json',
        success: function(data){

            $('#operateIndex .origin-border .title-container .text span').text(industryMap[code] + '运行指数');
            initOperateIndex(data);
            $('#operateIndex').toggleClass('card-flipped')
        }
    });
};

/**
 * 渲染运行风险分布图
 * @param {*} data 
 */
var initRiskMap = function(data) {
    var riskData = [];
    var sum = 0;
    $.each(data, function(key, value) {
        sum += value;
    });
    $.each(data, function(key, value) {
        var quantity = data[key]?data[key]:0;
        var rate = (sum > 0) ? Math.round(quantity*100/sum) : 0;
        riskData.push({name:key, value:rate});
    });
    // var name = ['极高','高','中','低'];
    // for(var i=1; i<=4; i++) {
    //     var key = 'level' + i;
       
    // }
    var myDate = new Date();
    var year = myDate.getFullYear();
    var month = myDate.getMonth() + 1;
    var left = $('#riskMap .item-container').width()/2;
    var top = $('#riskMap .item-container').height()/2;
    var option = {
        visualMap: {
            show: false,
            inRange: {
                //colorLightness: [0, 1]
            }
        },
        series : [
            {
                type:'pie',
                radius : ['20%','36%'],
                center: ['52%', '50%'],
                color:['#0fb5ec','#2348d1','#00e5d2','#3c7fff','#00a0e9'],
                data:riskData,
                label: {
                   
                    verticalAlign:'top',
                    formatter:function(a){
                        var content = '';
                        content += ' {rate|'+a.data.value+'%}\n';
                        content += '{name|'+a.data.name+'}';
                        //content += '{value|企业个数：'+a.data.value+'}';
                        return content;
                        
                    },
                    rich: {
                        rate: {
                            color:'#FFF',
                            fontSize:20
                        },
                        name: {
                            fontSize:18
                        },
                        value : {
                            color:'#d4d4d4',
                            fontSize:18
                        }
                    }
                },
                labelLine: {
                    normal: {
                        lineStyle: {
                            
                        },
                        //smooth: 0.2,
                        length: 30,
                        length2: 30
                    }
                },
                itemStyle: {
                    normal: {
                        
                    }
                },
                textStyle : {
                    fontSize : 24
                },
                animationType: 'scale',
                animationEasing: 'elasticOut',
                animationDelay: function (idx) {
                    return Math.random() * 200;
                }
            }
        ]
    };

    riskMap.setOption(option);
    riskMap2.setOption(option);
};
/**
 * 渲染风险指数
 * @param {*} code 需要展示的数据的code值
 */
var renderRiskMap = function(code) {
    
    $.ajax({
        url: 'data/riskData'+code+'.json',
        data:{code:code},
        dataType: 'json',
        success: function(data){
            $('#riskMap .origin-border .title-container .text span').text(industryMap[code] + '风险分布图');
            initRiskMap(data);
            $('#riskMap').toggleClass('card-flipped')
           
        }
    });

};
// 风险信息
var renderRiskInformation = function(code) {
    var config = [
        {name :"序号", key:"rank",  width : "20%", class:"rank"},
        {name :"风险分类", key:"classification",  width : "40%", class:"white"},
        {name :"风险企业数", key:"num",  width : "40%", class:"blue"}
    ];
    
    initTable('.front .right-containers', 'data/riskInformation.json', {code:code}, config);
    initTable('.back .right-containers', 'data/riskInformation.json', {code:code}, config);
};

// 风险信息弹出层


function renderModal () {
    $('.mask').on('click',function () {
        $('#risk-modal').fadeOut();
        $(this).fadeOut();
    });
    $('#riskMap').on('click','.right-containers .body1 tr',function () {
   
        $('.mask').fadeIn();
        $('#risk-modal').fadeIn();
        var code = $(this).data('code');
        $('#risk-modal .origin-border .title-container .text span').text(industryMap[code]);
        var configs = {
            // p2p
            "01":[
                {name :"序号", key:"rank",  width : "5%", class:"rank"},
                {name :"企业名称", key:"companyName",  width : "30%", class:"white"},
                {name :"数据日期", key:"date",  width : "10%", class:"blue"},
                {name :"风险指标分类", key:"classification",  width : "15%", class:"blue"},
                {name :"风险指标", key:"index",  width : "30%", class:"blue"}
               
            ],
            // 小贷
            "02":[
                {name :"序号", key:"rank",  width : "5%", class:"rank"},
                {name :"企业名称", key:"companyName",  width : "30%", class:"white"},
                {name :"数据日期", key:"date",  width : "10%", class:"blue"},
                {name :"风险指标分类", key:"classification",  width : "15%", class:"blue"},
                {name :"风险指标", key:"index",  width : "30%", class:"blue"}
             
            ],
            // 地方交易场所
            "03":[
                {name :"序号", key:"rank",  width : "5%", class:"rank"},
                {name :"企业名称", key:"companyName",  width : "30%", class:"white"},
                {name :"数据日期", key:"date",  width : "10%", class:"blue"},
                {name :"风险指标分类", key:"classification",  width : "15%", class:"blue"},
                {name :"风险指标", key:"index",  width : "30%", class:"blue"}
              
            ],
            // 股权交易场所
            "04":[
                {name :"序号", key:"rank",  width : "5%", class:"rank"},
                {name :"企业名称", key:"companyName",  width : "30%", class:"white"},
                {name :"数据日期", key:"date",  width : "10%", class:"blue"},
                {name :"风险指标分类", key:"classification",  width : "15%", class:"blue"},
                {name :"风险指标", key:"index",  width : "30%", class:"blue"}
              
            ],
            
            
            
        }
    
        initTable('#risk-modal .table-container', 'data/riskModal.json', {code:code}, configs[code]);
       
    
    })
}


