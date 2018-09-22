
var riskMap;    // 风险分布echart
var map;    // 地图echart
var industryMap = getNameByCode();
/**
 * 框架渲染
 */
var renderFrame = function() {
    renderBlockBorder(".origin-border");
    // renderTitle("#index .origin-border", "");
    renderTitle("#companyList .origin-border", " 高风险企业名单");
    renderTitle("#distributionMap .origin-border", "风险企业分布");
    renderTitle("#curData .origin-border", "当期数据");
   
    // 行业
    // $('#index .origin-border .horn').append('<div class="item-container"></div>');
    // 非法集资高风险企业名单
    $('#companyList .origin-border .horn').append('<div class="item-container"></div>');
    // 非法集资风险企业分布
    $('#distributionMap .origin-border .horn').append('<div class="item-container"></div>');

  
    riskMap = echarts.init($('#distributionMap .origin-border .horn .item-container')[0]);
    // 今日数据
    var html = '<div class="item-container">';
    html += '<div class="total-data">';
    html += '<div class="data-container">';
    html += '<div class="text-container">';
    html += '<div class="time">截止 2018-08-14 16:00</div>';
    html += '<div class="title">金融机构数量</div>';
    html += '</div>';
    html += '<div class="value-container"></div>';
    html += '</div>';
    html += '<div class="split-line"></div>';
    html += '</div>';
    html += '<div class="risk-data">';
    html += '</div>';
    html += '<div class="industry-data"></div>';
    html += '</div>';
    $('#curData .origin-border .horn').append(html);
    var aryRisk = [
        {code:'riskCount', name:'小额贷款公司',color:'#1a69f8',num:'87'},
        {code:'highRishCount', name:'股权交易场所',color:'#1a69f8',num:'64'},
        {code:'illegalCount', name:'地方交易场所',color:'#cfa02e',num:'34'},
        {code:'p2p', name:'P2P公司',color:'#e03343',num:'48'}
    ];
    var html = '';

    var htmls='';
    // $.each(aryRisk, function(index, item) {
        $.ajax({
            url:"data/dataName.json",
            dataType:"json",
            async:false,
            success:function(data){
                $.each(data,function(index,item){
                    htmls += '<div>';
                    htmls += '<div class="process-container" code="' + data[index].code + '">';
                    htmls += '<div class="convas-container"></div>';
                    htmls += '<div class="icon-container">';
                    htmls += data[index].num;
                    htmls += '</div>';
                    htmls += '</div>';
                    htmls += '<div class="count-container"><span name="count" style="color:' + data[index].color + ';"></span><span name="unit">家</span></div>';
                    htmls += '<div class="name-container">' + data[index].name + '</div>';
                    htmls += '</div>';

                })
            }
        });
    $('#curData .origin-border .horn .risk-data').append(htmls);

    map = echarts.init($('#map .map')[0])
};

/**
 * 各模块数据渲染
 */
var renderData = function() {
    // renderIndex();
    renderCompanyList();
    renderDistributionMap();
    renderCurData();
    renderMap();
};

/**
 * P2P行业
 */
// var renderIndex = function() {
//     var changeIdex;
//     clearInterval(changeIdex);
//     $('#index .origin-border .title-container .text span').text(industry[0].name + '行业指标');
//     $.ajax({
//         url: 'data/indexData.json',
//         data:{code:industry[0].code},
//         dataType: 'json',
//         async: false,
//         success: function(data){
//             renderIndexData('#index .origin-border .horn .item-container', data, 9);
//         }
//     });
//     var i = 1;
//     changeIdex = setInterval(function(){
//         $.ajax({
//             url: 'data/indexData.json',
//             dataType: 'json',
//             data:{code:industry[i].code},
//             success: function(data){
//                 rotateYDIV({
//                     $obj:$('#index'),
//                     inRotate: function() {
//                         $('#index .origin-border .title-container .text span').text(industry[i].name + '行业指标');
//                         renderIndexData('#index .origin-border .horn .item-container', data, 9);
//                     },
//                     afterRotate: function() {
//                         i++;
//                         if(i === industry.length) {
//                             i = 0;
//                         }
//                     }
//                 });
//             }
//         });
//     }, 5000);

    
// };

var renderRiskCompanyData = function(data) {
    var html = '';
    $.each(data, function(index, item){
        // 计算风险等级：高、中、低
        var riskLevelName; 
        var riskLevel;
        var iconId;
        var riskIndex = parseInt(item.riskIndex)
        if(riskIndex > 400) {
            riskLevelName = "高";
            riskLevel = 1;
            iconId = 'level1';
        } else if(riskIndex >200 && riskIndex <= 400) {
            riskLevelName = "中";
            riskLevel = 2;
            iconId = 'level2';
        } else if(riskIndex >100 && riskIndex <= 200) {
            riskLevelName = "低";
            riskLevel = 3;
            iconId = 'level3';
        } else if(riskIndex <= 100){
            riskLevelName = '普'; 
            riskLevel = 4;
            iconId = 'level4';
        }

        html += '<div class="item" riskLevel="'+ riskLevel +'">';
        html += '<div class="icon-container">';
        html += '<div class="icon">';
        html += $('#allIcon [name=' + iconId + ']').prop("outerHTML");
        html += '</div>';
        html += '<span>';
        html += riskLevelName;
        html += '</span>';
        html += '</div>';
        html += '<div class="company-name">';
        html += item.companyName;
        html += '</div>';
        html += '<div class="index-container" style="width:' + (parseInt(item.riskIndex) + 120) + 'px;">';
        html += '<span>' + item.date + '</span>';
        html += '</div>';
        html += '</div>';
    });

    $('#companyList .origin-border .item-container').html('<div class="body1">' + html + '</div><div class="body2">' + html + '</div>');
    setScroll();
};

/**
 * 设置滚动效果
 */
var setScroll = function() {
    var speed = 50;
    var body = $('#companyList .origin-border .item-container')[0];
    var body1 = $('#companyList .origin-border .item-container .body1')[0];
    var body2 = $('#companyList .origin-border .item-container .body2')[0];
    $(body2).html($(body).html());
    function Marquee() {
        if (body2.offsetTop - body.scrollTop <= 0) {
            body.scrollTop -= body1.offsetHeight;
        } else {
            body.scrollTop++;
        }
    }
    var MyMar = setInterval(Marquee, speed);
    body.onmouseover = function() {
        clearInterval(MyMar);
    }
    
    body.onmouseout = function() {
        MyMar = setInterval(Marquee, speed);
    }
};

/**
 * 非法集资高风险企业名单--分页数据
 */
var renderCompanyList = function() {
    $.ajax({
        url: 'data/riskCompanyData.json',
        dataType: 'json',
        success: function(data){
            renderRiskCompanyData(data.pageData);
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
    var name = ['高风险','中风险','低风险','正常'];
    for(var i=1; i<=4; i++) {
        var key = 'level' + i;
        var quantity = data[key]?data[key]:0;
        var rate = (sum > 0) ? Math.round(quantity*100/sum) : 0;
        riskData.push({name:name[i-1], value:quantity, rate:rate});
    }
    var myDate = new Date();
    var year = myDate.getFullYear();
    var month = myDate.getMonth() + 1;
    var left = $('#distributionMap .item-container').width()/2;
    var top = $('#distributionMap .item-container').height()/2;
    //distributionMapData
    var option = {
        visualMap: {
            show: false,
            inRange: {
                //colorLightness: [0, 1]
            }
        },
        graphic: [
            {
                type:'text',
                left:'center',
                top:'center',
                
                z:2,
                zlevel:100,
                style: {
                    text: year + '\r\n',
                    fontSize: 24,
                }
            },
            {
                type:'text',
                
                position: [left-30, top],
                z:2,
                zlevel:100,
                style: {
                    text:(month<10)?'0'+month:''+month,
                    fontSize: 40,
                }
            },
            {
                type:'text',
                position: [left+15, top+10],
                z:2,
                zlevel:100,
                style: {
                    text:'月',
                    fontSize: 24,
                }
            }
        ],
        series : [
            {
                type:'pie',
                radius : '55%',
                center: ['50%', '50%'],
                color:['#E13848','#E7773A','#EAC82B','#3A73C9'],
                data:riskData,
                roseType: 'radius',
                label: {
                    textStyle: {
                        fontSize: 14
                    },
                    verticalAlign:'top',
                    formatter:function(a){
                        var content = '';
                        content += ' {rate|'+a.data.rate+'%}  ';
                        content += '{name|'+a.data.name+'}\n';
                        content += '{value|企业个数：'+a.data.value+'}';
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
};

/**
 * 渲染企业分布
 */
var renderDistributionMap = function() {
    $.ajax({
        url: 'data/riskData.json',
        dataType: 'json',
        async:false,
        success: function(data){
            initRiskMap(data);
        }
    });
    var refeshDistribution = setInterval(function(){
        $.ajax({
            url: 'data/riskData.json',
            dataType: 'json',
            async:false,
            success: function(data){
                $.each(data, function(key, value){
                    var newValue = Math.floor(Math.random()*(3000-600+1)+300);
                    // data[key]= newValue;
                    data[key]= value;
                });
                initRiskMap(data);
            }
        });
    },5000);
};

/**
 * 渲染金融机构数量
 * @param {*} totalData
 */
var renderTotalData = function(totalData) {
    $('#curData .item-container .total-data .data-container .text-container .time').html('截止 ' + totalData.time);
    var html = '';
    var strCount = totalData.totalCount.toString();
    for(var i=0; i<strCount.length; i++){
        html += '<div class="value">';
        html += strCount[i];
        html += '</div>';
    }
    $('#curData .item-container .total-data .data-container .value-container').html(html);
};

var progressCanvas = {};

/**
 * 渲染风险机构数量
 * @param {*} riskData 
 */
var renderRiskData = function(riskData) {
    $('#curData .item-container .risk-data .process-container').each(function(){
        var code = $(this).attr('code');
        var $countObj = $(this).parent('div').find('span[name=count]');
        if(!progressCanvas[code]) {    // 没有初始化，先初始化
            var opts = {
                wrapDom:$(this).find('.convas-container')[0],
                width:180,
                height:180,
                bgColors:'#fff',
                lineCap:'round',
                showShadow:true,
                type:'circle',
                lineWidth:4,
                lineColors:'#00e5d2', //  array or string
                shadowBlur:20,
                shadowColor:'#00e5d2',
                maxVal:500,
                minVal:0
            }
            progressCanvas[code] = new ProgressUtil.default(opts);
            progressCanvas[code].render();
        } 
        progressCanvas[code].update(riskData[code]);
        $countObj.html(riskData[code]);
    });
};

/**
 * 渲染行业数据
 * @param {*} industryData 
 */
var renderIndustryData = function(industryData) {
    $.each(industryData, function(index, item){
        var code = item.code;
        if(!progressCanvas[code]) { // 还没有创建
            var html = '<div class="industry-item">';
            html += '<div class="name-container">' + item.name + '</div>';
            html += '<div class="process-container" code="' + code + '"></div>';
            html += '</div>';
            $('#curData .item-container .industry-data').append(html);
            var opts = {
                wrapDom:$('#curData .item-container .industry-data .process-container[code=' + code + ']')[0],
                width:200,
                height:120,
                bgColors:'#111',
                lineCap:'round',
                showShadow:true,
                type:'line',
                lineWidth:16,
                lineColors:'#e13848', //  array or string
                shadowBlur:'#101856',
                maxVal:item.max
            };
            progressCanvas[code]=new ProgressUtil.default(opts);
            progressCanvas[code].render();
        } 
        progressCanvas[code].update(item.value);
    });
};

/**
 * 渲染今日数据
 */
var renderCurData = function() {
    
    $.ajax({
        url: 'data/curData.json',
        dataType: 'json',
        async:false,
        success: function(data){
            renderTotalData(data.totalData);
            renderRiskData(data.riskData);
            renderIndustryData(data.industryData);
        }
    });
    // var refeshCurData = setInterval(function(){
    //     $.ajax({
    //         url: 'data/curData.json',
    //         dataType: 'json',
    //         async:false,
    //         success: function(data){
    //             data.totalData.totalCount = Math.floor(Math.random()*99999);
    //             renderTotalData(data.totalData);
    //             $.each(data.riskData,function(key, value){
    //                 data.riskData[key] =  Math.floor(Math.random()*500);
    //             });
    //             renderRiskData(data.riskData);
    //             $.each(data.riskData,function(index, item){
    //                 item.value =  Math.floor(Math.random()*100);
    //             });
    //             renderIndustryData(data.industryData);
    //         }
    //     });
        
    // },5000);

};

var renderMapChart = function() {
    var riskData = [];
    var levelIcons = {
        low: './img/low.png',
        middle: './img/middle.png',
        high: './img/high.png'
    };
    $.ajax({
        url: 'data/mapData.json',
        dataType: 'json',
        async : false,
        success: function(data){
            $.each(data, function(index, item) {
                item.value = Math.round((item.risk + item.highRisk) / item.total * 100);
                riskData.push(item);
            });
        }
    });
    map.setOption(option = {
        geo: {
            show: true,
            map: '海南',
            aspectScale:1,
            regions: [{name: '南海诸岛',itemStyle: {color:"red"}}],
            label: {
                normal: {
                    show: false
                },
                emphasis: {
                    show: true,
                }
            },
            roam: false,//地图设置不可拖拽，固定的
            itemStyle: {
                normal: {
                    areaColor: '#006fff',
                    borderWidth: 1,
                    shadowColor: 'rgba(29,92,171, 1)',
                    shadowBlur: 50,
                    shadowOffsetX:20,
                    shadowOffsetY:20
                }
            }
        },
        toolbox: {
            show: false
        },
        visualMap: {
            min: 0,
            max: 100,
            text:['高','低'],
            realtime: false,
            calculable: true,
            inRange: {
                color: ['#5b93ff','#3766ff', '#003496']
            },
            textGap :10,
            itemHeight : 300,
            right:100,
            bottom:100,
            textStyle :{
                fontSize:24,
                color:'#fff'
            }
        },
        series: [
            {
                type: 'map',
                mapType: '海南', // 自定义扩展图表类型
                aspectScale:1,
                label: {
                    normal: {
                        show: true,
                        formatter: function (params) {
                            if(params.value>50) {
                                var icon = 'high';
                            } else if(params.value>30 && params.value<=50) {
                                var icon = 'middle';
                            } else if(params.value <= 30) {
                                var icon = 'low';
                            }
                            return params.name + '{' + icon + '|}';
                        },
                        position: 'inside',
                        padding: [4, 5],
                        textStyle :{
                            fontSize:24,
                            color:'#fff'
                        },
                        rich: {
                            low: {
                                height: 60,
                                align: 'center',
                                backgroundColor: {
                                    image: levelIcons.low
                                }
                            },
                            middle: {
                                height: 80,
                                align: 'center',
                                backgroundColor: {
                                    image: levelIcons.middle
                                }
                            },
                            high: {
                                height: 100,
                                align: 'center',
                                backgroundColor: {
                                    image: levelIcons.high
                                }
                            }
                        }
                    },
                    emphasis: {
                        show: true
                    }
                },
                itemStyle:{
                    normal:{label:{show:true}},
                    emphasis:{label:{show:true}}
                },
                data:riskData
            }
        ]
    });
    setMapActive(riskData);
   
};

/**
 * 渲染地图
 */
var renderMap = function() {
    
    var mapJson;
    $.ajax({
        url: 'data/hainan.json',
        dataType: 'json',
        async : false,
        success: function(data){
            mapJson = data;
        }
    });

    // echarts.registerMap('hainan', mapJson);


    renderMapChart();
    var refeshMap = setInterval(function(){
        renderMapChart();

    },200000);
};

/**
 * 循环显示各个市的数据
 */
var setMapActive = function(data) {
    var positionMap = {    // 各市对应的tip位置和市中心点的位置
        '1301': {tipLeft:110, tipTop:140,afterCss:'width: 108px;top: 162px;right: -109px;'},
        '1302': {tipLeft:1180, tipTop:342,afterCss:'width: 150px;top: -43px;right: 184px;transform: rotate(35deg);'},
        '1303': {tipLeft:35, tipTop:589,afterCss:'width: 160px;top: 144px;right: -140px;transform: rotate(-35deg);'},
        '1304': {tipLeft:25, tipTop:631,afterCss:'width: 220px;top: 240px;right: -200px;transform: rotate(-25deg)'},
        '1305': {tipLeft:1125, tipTop:630,afterCss:'width: 280px;top: 100px;right: 223px;transform: rotate(15deg);'},
        '1306': {tipLeft:30, tipTop:431,afterCss:'width: 220px;top: 148px;right: -220px;transform: rotate(15deg);'},
        '1307': {tipLeft:240, tipTop:20,afterCss:'width: 304px;top: 80px;right: -323px;transform: rotate(15deg);'},
        '1308': {tipLeft:1190, tipTop:400,afterCss:'width: 216px;top: 174px;left: -215px;'},
        '1309': {tipLeft:130, tipTop:60,afterCss:'width: 416px;top: 117px;right: -346px;transform: rotate(15deg);'},
        '1310': {tipLeft:100, tipTop:390,afterCss:'width: 262px;top: -5px;right: -237px;'},
        '1311': {tipLeft:1210, tipTop:280,afterCss:'width: 290px;top: 231px;left: -290px;'},
        '1312': {tipLeft:100, tipTop:140,afterCss:'width: 280px;top: 269px;right: -223px;transform: rotate(54deg);'},
        '1313': {tipLeft:130, tipTop:111,afterCss:'width: 220px;top: 148px;right: -220px;'},
        '1314': {tipLeft:1100, tipTop:600,afterCss:'width: 224px;top: 160px;left: -223px;'},
        '1315': {tipLeft:1286, tipTop:409,afterCss:'width: 216px;top: 174px;left: -215px;'},
        '1316': {tipLeft:1200, tipTop:340,afterCss:'width: 216px;top: 117px;left: -206px;transform: rotate(23deg);'},
        '1317': {tipLeft:1100, tipTop:620,afterCss:'width: 262px;top: -5px;left: -207px;transform: rotate(36deg);'},
        '1318': {tipLeft:1100, tipTop:540,afterCss:'width: 290px;top: 231px;left: -290px;'}
    };
    var index = 0;
    var setInfo = function(index) {
        
        $('#map .tooltip .name').html(data[index].name);
        $('#map .tooltip .item .value').eq(0).html(data[index].total);
        $('#map .tooltip .item .value').eq(1).html(data[index].risk);
        $('#map .tooltip .item .value').eq(2).html(data[index].highRisk);
        var position = positionMap[data[index].code];
        $('#map .tooltip').css({
            'left' : position.tipLeft + 'px',
            'top' : position.tipTop + 'px'
        }).show();
        $('#map .tooltip style').html('#map .tooltip::after{' + position.afterCss + '}')
       
    };
    setInfo(index);
    var MyMar = setInterval(function () {
        if(index===data.length-1) {
            index=0;
        } else {
            index++;
        } 
        setInfo(index);
    }, 5000);
    map.on('click', function (params) {
       clearInterval(MyMar)
       setInfo(params.dataIndex);
       
    });
    $('#map .tooltip').on('click',function () {
        clearInterval(MyMar)
        setInfo(Math.min(++index,data.length-1));
         MyMar = setInterval(function () {
            if(index===data.length-1) {
                index=0;
            } else {
                index++;
            } 
            setInfo(index);
        }, 5000);
    })
};