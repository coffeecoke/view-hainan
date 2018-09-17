

var shieldProgress = null;
var shieldProgress2 = null;
var industryMap = getNameByCode();
/**
 * 渲染行业图标
 * @param {*}
 */
var renderIndustryIcon = function() {
    renderFrame();
    var doms=$('#allIcon .icon-item'),domItems=[];
    $.each(doms,function(i,item){
        domItems.push({
            wrapDom:item,
            bgWidth:900,
            bgHeight:900,
            bgWrapDom:$(item).find('.cicle')[0],
            bgColors:[
                {stop:0.47,color:'#10142d'},
                // {stop:.72,color:'#4970b3'},
                {stop:.55,color:'#293d7d'},
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

    iconTrans.appendDoms(domItems,1500,2000);

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
    // 行业指标
    $('#index .origin-border .horn').append('<div class="item-container"></div>');
    // 指标变化
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
    $('#riskMap .origin-border .horn').append('<div class="item-container"></div>');
    riskMap = echarts.init($('#riskMap .origin-border .horn .item-container')[0]);
    riskMap2 = echarts.init($('#riskMap .origin-border .horn .item-container')[1]);
    initProgress();
    initProgress2();
    //var code = industry[0].code;
    
};

var initProgress = function() {
    var opts={
        width:400,
        height:400,
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
        width:400,
        height:400,
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
    alert(1)
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
var initIndexChangeChart = function(data) {
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
    var option = {
        tooltip: {
            trigger: 'axis',
            position: function (pt) {
                return [pt[0], '10%'];
            }
        },
        legend : {
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
            data : [{name:'投资金额'},{name:'投资人数'},{name:'借款人数'}]
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
            data:['0','10%','20%','30%','40%','50%']
           
        }],
        series: [
            {
                name:'投资金额',
                type:'line',
                symbol: 'none',
                itemStyle: {
                    normal: {
                        color: 'rgb(58,115,201,0.8)'
                    }
                },
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgb(58,115,201,0.8)'
                        }, {
                            offset: 1,
                            color: 'rgb(58,115,201,0)'
                        }])
                    }
                },
                data: dataBRIR
            },
            {
                name:'投资人数',
                type:'line',
                symbol: 'none',
                itemStyle: {
                    normal: {
                        color: 'rgb(225,56,72,0.8)'
                    }
                },
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgb(225,56,72,0.8)'
                        }, {
                            offset: 1,
                            color: 'rgb(225,56,72,0)'
                        }])
                    }
                },
                data: dataTVGR
            },
            {
                name:'借款人数',
                type:'line',
                symbol: 'none',
                itemStyle: {
                    normal: {
                        color: 'rgb(239,209,71,0.8)'
                    }
                },
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgb(239,209,71,0.8)'
                        }, {
                            offset: 1,
                            color: 'rgb(239,209,71,0)'
                        }])
                    }
                },
                data: dataTGR
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
            initIndexChangeChart(data); // 渲染数据
            $('#indexChange').toggleClass('card-flipped')

           
        }
    });
};

/**
 * 渲染企业数据
 * @param {*} code 需要展示的数据的code值
 */
var renderCompanyData = function(code) {
    var config = [
        {name :"排名", key:"rank",  width : "10%", class:"rank"},
        {name :"企业名称", key:"companyName",  width : "30%", class:"white"},
        {name :"统一社会信用代码", key:"companyCode",  width : "20%", class:"blue"},
        {name :"所属区域", key:"region",  width : "20%", class:"blue"},
        {name :"级别", key:"level",  width : "20%", class:"blue", class:"level"}
    ];
    
    initTable('#companyData .table-container', 'data/companyData'+code+'.json', {code:code}, config);
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
        html += '<img src="img/risk-icon'+(index+1)+'.png" />'
        html += '</div>';
        html += '<div class="name">' + item.name + '</div>'
        html += '<div class="value">' + item.value + '</div>'
        html += '</div>'
    });
    $('#operateIndex .origin-border .horn .icon-container .icon-item-list').html(html);
    // 指数
    shieldProgress.update(50);
    shieldProgress2.update(60);
};

/**
 * 渲染运行指数
 * @param {*} code 需要展示的数据的code值
 */
var renderOperateIndex = function(code) {
    // 渲染右侧数据
    $.ajax({
        url: 'data/operateIndexData.json',
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
    var name = ['极高','高','中','低'];
    for(var i=1; i<=4; i++) {
        var key = 'level' + i;
        var quantity = data[key]?data[key]:0;
        var rate = (sum > 0) ? Math.round(quantity*100/sum) : 0;
        riskData.push({name:name[i-1], value:rate});
    }
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
        // graphic: [
        //     {
        //         type:'text',
        //         left:'center',
        //         top:'center',
                
        //         z:2,
        //         zlevel:100,
        //         style: {
        //             text: year + '\r\n',
        //             fontSize: 24,
        //         }
        //     },
        //     {
        //         type:'text',
        //         position: [left-30, top],
        //         z:2,
        //         zlevel:100,
        //         style: {
        //             text:(month<10)?'0'+month:''+month,
        //             fontSize: 40,
        //         }
        //     },
        //     {
        //         type:'text',
        //         position: [left + 15, top+10],
        //         z:2,
        //         zlevel:100,
        //         style: {
        //             text:'月',
        //             fontSize: 24,
        //         }
        //     }
        // ],
        series : [
            {
                type:'pie',
                radius : '75%',
                center: ['50%', '50%'],
                color:['#E13848','#E7773A','#EAC82B','#3A73C9'],
                data:riskData,
                roseType: 'radius',
                label: {
                    textStyle: {
                        fontSize: 24
                    },
                    verticalAlign:'top',
                    formatter:function(a){
                        var content = '';
                        content += ' {rate|'+a.data.value+'%}  ';
                        content += '{name|'+a.data.name+'风险}';
                        //content += '{value|企业个数：'+a.data.value+'}';
                        return content;
                        
                    },
                    rich: {
                        rate: {
                            color:'#FFF',
                            fontSize:'40px'
                        },
                        name: {
                            fontSize:'24px'
                        },
                        value : {
                            color:'#d4d4d4',
                            fontSize:'24px'
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
        url: 'data/riskData.json',
        data:{code:code},
        dataType: 'json',
        success: function(data){
            $('#riskMap .origin-border .title-container .text span').text(industryMap[code] + '风险分布图');
            initRiskMap(data);
            $('#riskMap').toggleClass('card-flipped')
           
        }
    });

};