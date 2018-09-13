
var riskMap;    // 风险分布echart
var map;    // 地图echart
var industryMap = getNameByCode();
var mapActive;
var geoCoord = {};
/**
 * 框架渲染
 */
var renderFrame = function() {
    renderBlockBorder(".origin-border");
    renderTitle("#index .origin-border", "");
    renderTitle("#companyList .origin-border", "非法集资高风险企业名单");
    renderTitle("#distributionMap .origin-border", "非法集资风险企业分布");
    renderTitle("#curData .origin-border", "今日数据");
    // 行业
    $('#index .origin-border .horn').append('<div class="item-container"></div>');

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
        {code:'riskCount', name:'风险机构数量',color:'#e03343'},
        {code:'highRishCount', name:'高风险机构数量',color:'#cfa02e'},
        {code:'illegalCount', name:'非法集资企业风险数量',color:'#e03343'}
    ];
    var html = '';
    $.each(aryRisk, function(index, item) {
        html += '<div>';
        html += '<div class="process-container" code="' + item.code + '">';
        html += '<div class="convas-container"></div>';
        html += '<div class="icon-container">';
        html += $('#allIcon [name=' + item.code + ']').prop("outerHTML");
        html += '</div>';
        html += '</div>';
        html += '<div class="count-container"><span name="count" style="color:' + item.color + ';"></span><span name="unit">家</span></div>';
        html += '<div class="name-container">' + item.name + '</div>';
        html += '</div>';
    });
    $('#curData .origin-border .horn .risk-data').append(html);

    map = echarts.init($('#map .map')[0]);
};

/**
 * 各模块数据渲染
 */
var renderData = function() {
    renderIndex();
    renderCompanyList();
    renderDistributionMap();
    renderCurData();
    renderMap();
};

/**
 * 行业指标
 */
var changeIdex;
var renderIndex = function() {
    if(changeIdex){
        clearInterval(changeIdex);
    }
    $('#index .origin-border .title-container .text span').text(industry[0].name + '行业指标');
    $.ajax({
        url: '../data/indexData.json',
        data:{code:industry[0].code},
        dataType: 'json',
        async: false,
        success: function(data){
            renderIndexData('#index .origin-border .horn .item-container', data, 9);
        }
    });
    var i = 1;
    changeIdex = setInterval(function(){
        if(i === industry.length) {
            i = 0;
        }
        $.ajax({
            url: '../data/indexData.json',
            dataType: 'json',
            data:{code:industry[i].code},
            success: function(data){
                rotateYDIV({
                    $obj:$('#index'),
                    inRotate: function() {
                        $('#index .origin-border .title-container .text span').text(industry[i].name + '行业指标');
                        renderIndexData('#index .origin-border .horn .item-container', data, 9);
                        i++;
                    }
                });
            }
        });
    }, 50000);

    
};

var renderRiskCompanyData = function(data) {
    var html = '';
    $.each(data, function(index, item){
        // 计算风险等级：高、中、低
        var riskLevelName; 
        var riskLevel;
        var iconId;
        var riskIndex = parseInt(item.riskIndex)
        if(riskIndex > 400) {
            riskLevelName = "极";
            riskLevel = 1;
            iconId = 'level1';
        } else if(riskIndex >200 && riskIndex <= 400) {
            riskLevelName = "高";
            riskLevel = 2;
            iconId = 'level2';
        } else if(riskIndex >100 && riskIndex <= 200) {
            riskLevelName = "中";
            riskLevel = 3;
            iconId = 'level3';
        } else if(riskIndex <= 100){
            riskLevelName = '低'; 
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
        url: '../data/riskCompanyData.json',
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
    var name = ['极高','高','中','低'];
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
        //         position: [left+15, top+10],
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
                radius : '65%',
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
                        content += ' {rate|'+a.data.rate+'%}  ';
                        content += '{name|'+a.data.name+'风险}\n';
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
        url: '../data/riskData.json',
        dataType: 'json',
        async:false,
        success: function(data){
            initRiskMap(data);
        }
    });
    var refeshDistribution = setInterval(function(){
        $.ajax({
            url: '../data/riskData.json',
            dataType: 'json',
            async:false,
            success: function(data){
                $.each(data, function(key, value){
                    var newValue = Math.floor(Math.random()*(3000-600+1)+300);
                    data[key]= newValue;
                });
                initRiskMap(data);
            }
        });
    },50000);
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
                width:300,
                height:300,
                bgColors:'#111',
                lineCap:'round',
                showShadow:true,
                type:'circle',
                lineWidth:12,
                lineColors:$countObj.css('color'), //  array or string
                shadowBlur:18,
                shadowColor:'#1b40b0',
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
                width:250,
                height:120,
                bgColors:'#111',
                lineCap:'round',
                showShadow:true,
                type:'line',
                lineWidth:16,
                lineColors:'#e13848', //  array or string
                shadowColor:'#101856',
                //shadowBlur:18,
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
        url: '../data/curData.json',
        dataType: 'json',
        async:false,
        success: function(data){
            renderTotalData(data.totalData);
            renderRiskData(data.riskData);
            renderIndustryData(data.industryData);
        }
    });
    var refeshCurData = setInterval(function(){
        $.ajax({
            url: '../data/curData.json',
            dataType: 'json',
            async:false,
            success: function(data){
                data.totalData.totalCount = Math.floor(Math.random()*99999);
                renderTotalData(data.totalData);
                $.each(data.riskData,function(key, value){
                    data.riskData[key] =  Math.floor(Math.random()*500);
                });
                renderRiskData(data.riskData);
                $.each(data.riskData,function(index, item){
                    item.value =  Math.floor(Math.random()*100);
                });
                renderIndustryData(data.industryData);
            }
        });
        
    },50000);

};

var renderMapChart = function(url) {
    $('#map .high').remove();
    var riskData = [];
    var highData = [],middleData = [], lowData = [];
    var levelIcons = {
        low: '../img/low.png',
        middle: '../img/middle.png',
        high: '../img/high.png'
    };
    
    $.ajax({
        url: url,
        dataType: 'json',
        async : false,
        success: function(data){
            $.each(data, function(index, item) {
                item.value = Math.round((item.risk + item.highRisk) / item.total * 100);
                item.coord = geoCoord[item.name];
                riskData.push(item);
                var coord = {value:[]};
                coord.name=item.name;
                $.each(geoCoord[item.name], function(i, value) {
                    coord.value.push(value);
                });
                //coord.value = geoCoord[item.name];
                coord.value.push(item.value);
                if(item.value > 50) {
                    highData.push(coord);
                } else if(item.value <= 50 && item.value > 30) {
                    middleData.push(coord);
                } else if(item.value <= 30){
                    lowData.push(coord);
                }
            });
        }
    });
    map.setOption(option = {
        geo: {
            show: true,
            map: 'hebei',
            label: {
                normal: {
                    show: false
                },
                emphasis: {
                    show: false,
                }
            },
            roam: false,//地图设置不可拖拽，固定的
            itemStyle: {
                normal: {
                    areaColor: '#006fff',
                    borderWidth: 1,
                    shadowColor: 'rgba(29,92,171, 0.8)',
                    shadowBlur: 0,
                    shadowOffsetX:10,
                    shadowOffsetY:10
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
                mapType: 'hebei', // 自定义扩展图表类型
                label: {
                    normal: {
                        show: true,
                        formatter: function (params) {
                            return params.name;
                        },
                        position: 'inside',
                        padding: [4, 5],
                        textStyle :{
                            fontSize:24,
                            color:'#fff'
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
                data:riskData,
                zlevel: 2
            },
            {
                type: 'scatter',
                effectType: 'ripple',
                coordinateSystem: 'geo',
                data: highData,
                symbol:'image://../img/high.png',
                //symbol:'path://M200 200,A80 80,0 1 1 200 201z M350 200,A70 70,0 1 0 350 201z',
                symbolSize: 100,
                symbolOffset :[60 , 0 ],
                showEffectOn: 'render',
                zlevel: 2
            },
            {
                type: 'scatter',
                effectType: 'ripple',
                coordinateSystem: 'geo',
                data: highData,
                symbol:'image://../img/high1.png',
                //symbol:'image://data:image/gif;base64,R0lGODlhEwASAPcAAPj4+AAAAODg2MC4uPj48KiAGPjYAPj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+CH/C05FVFNDQVBFMi4wAwHoAwAh+QQLCAD9ACwAAAAAEwASAAcIgwD7CRxIsKDBgQESBhhw0GAAARAFLGyIECKBixIZHlz48CGBjhoLBijwUKKAjxAnFhxQkkBKiCRDEvR4ESWBmAJV9mOZ8OTDAjhBDhxANKEBjkVTysx51GTPjEt3loyoNGq/ljU/Em1IM6tOkSkVlvyasypRlkpXJtw6dG3UswbhCgwIACH5BAsIAP0ALAAAAAATABIAh/j4+AAAAODg2MC4uPj48KiAGPjYAPj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Ah8APsJFBigYIABAxMq7BdAgEMBBxcqbCiAgEWICCUebNiQAMeMEwtQ7DgS5MABFB9SFGlyYEqHHVlKRFlwAEQBBWTOHEDTwMeWCwP4vGkw4syXDzFqdGixacmgFZtaLKh0YtSOHlHyXIgS48+tSzdWlShQK8+DQLlmBJswIAAh/wtHSUZDT05uYjEuMAIBAA4GAAIABQAAAAAAAAAAAAYyLmdpZgAAOw0K',
                //symbol:'path://M200 200,A80 80,0 1 1 200 201z M350 200,A70 70,0 1 0 350 201z',
                symbolSize: 30,
                symbolOffset :[60 , 0 ],
                showEffectOn: 'render',
                zlevel: 3
            },
            {
                type: 'effectScatter',
                effectType: 'ripple',
                coordinateSystem: 'geo',
                data: highData,
                symbol:'image://../img/highCicle.png',
                //symbol:'path://M200 200,A80 80,0 1 1 200 201z M350 200,A70 70,0 1 0 350 201z',
                symbolSize: 60,
                symbolOffset :['100%' , 0 ],
                showEffectOn: 'render',
                rippleEffect: {
                    brushType: 'stroke',
                    period: 3,
                    scale: 2.5
                },
                zlevel: 2
            },
            {
                type: 'scatter',
                effectType: 'ripple',
                coordinateSystem: 'geo',
                data: middleData,
                symbol:'image://../img/middle.png',
                //symbol:'path://M200 200,A80 80,0 1 1 200 201z M350 200,A70 70,0 1 0 350 201z',
                symbolSize: 80,
                symbolOffset :[40 , 0 ],
                showEffectOn: 'render',
                zlevel: 2
            },
            {
                type: 'scatter',
                effectType: 'ripple',
                coordinateSystem: 'geo',
                data: middleData,
                symbol:'image://../img/middle1.png',
                //symbol:'path://M200 200,A80 80,0 1 1 200 201z M350 200,A70 70,0 1 0 350 201z',
                symbolSize: 10,
                symbolOffset :[40 , 0 ],
                showEffectOn: 'render',
                zlevel: 3
            },
            {
                type: 'effectScatter',
                effectType: 'ripple',
                coordinateSystem: 'geo',
                data: middleData,
                symbol:'image://../img/middleCicle.png',
                symbolSize: 40,
                symbolOffset :['100%' , 0 ],
                showEffectOn: 'render',
                rippleEffect: {
                    brushType: 'stroke',
                    period: 4,
                    scale: 2.5
                },
                zlevel: 2
            },
            {
                type: 'scatter',
                effectType: 'ripple',
                coordinateSystem: 'geo',
                data: lowData,
                symbol:'image://../img/low.png',
                symbolSize: 40,
                symbolOffset :[60 , 0 ],
                showEffectOn: 'render',
                zlevel: 2
            },
        ]
    }
    );
    $.each(highData,function(i, item){
        var coor = [item.value[0], item.value[1]];
        var position = map.convertToPixel('geo',coor);
        var html = '<div class="high" style="width:30px;height:30px;z-index:100;position: absolute;left:'+(position[0]+45)+'px;top:'+(position[1]-15)+'px;">';
        html += '<img src="../img/test.gif" style="width:100%;" />';
        html += '</div>';
        $('#map').append(html);
    });
    setMapActive(riskData);
    
};

/**
 * 渲染地图
 */
var renderMap = function() {
    var mapJson;
    $.ajax({
        url: '../data/map/hebei.json',
        dataType: 'json',
        async : false,
        success: function(data){
            mapJson = data;
            $.each(data.features, function(index, item) {
                geoCoord[item.properties.name] = item.properties.cp;
            });
        }
    });

    echarts.registerMap('hebei', mapJson);
    renderMapChart('../data/mapData.json');
    map.on('click', function (params) {
        // 市级
        if(params.data && params.data.code) {
            $.getJSON('../data/map/city/'+ params.data.code +'.json', function(mapData){
                if(mapData) {
                    $.each(mapData.features, function(index, item) {
                        geoCoord[item.properties.name] = item.properties.cp;
                    });
                    echarts.registerMap('hebei', mapData);
                    renderMapChart('../data/' + params.data.code + '.json');
                } else {
                    echarts.registerMap('hebei', mapJson);
                    renderMapChart('../data/mapData.json');
                }
            });
        } else {
            echarts.registerMap('hebei', mapJson);
            renderMapChart('../data/mapData.json');
        }
    });
    var refeshMap = setInterval(function(){
        echarts.registerMap('hebei', mapJson);
        renderMapChart('../data/mapData.json');

    },200000);
};

/**
 * 循环显示各个市的数据
 */
var setMapActive = function(data) {
    if(mapActive) {
        clearInterval(mapActive);
    }
    var index = 0;
    var setInfo = function() {
        var mapWidth = $('#map').width();
        var tooltipWidth = $('#map .tooltip').width();
        var tooltipHeight = $('#map .tooltip').height();
        var cityPosition = map.convertToPixel('geo',data[index].coord);
        var cssTooltip = {
            'top': (cityPosition[1] - tooltipHeight/2) + 'px',
            'left': 'auto',
            'right': 'auto',
            'z-index':200
        };
        var cssLine = 'z-index:200;top:' + (tooltipHeight/2+15) + 'px;';
        var lineWidth;
        if(cityPosition[0]*2 < mapWidth) {    // 放左侧
            cssTooltip['left'] = '40px';
            lineWidth = cityPosition[0] - 100 - tooltipWidth;
            cssLine += 'right:-' + lineWidth + 'px;'
        } else {    // 放右侧
            cssTooltip['right'] = '40px';
            lineWidth = mapWidth - cityPosition[0] - 100 - tooltipWidth;
            cssLine += 'left:-' + lineWidth + 'px;'
        }
        cssLine += 'width:' + lineWidth + 'px;'
        $('#map .tooltip ').css({
            width:'0px',
            height: '0px'
        });
        $('#map .tooltip style').html('#map .tooltip::after{display:none;}');
        $('#map .tooltip').animate({width:'400px',height: '310px'},1000,function(){
            // 计算线长
            $('#map .tooltip style').html('#map .tooltip::after{' + cssLine + 'display:block;}');
        });
        $('#map .tooltip .name').html(data[index].name);
        $('#map .tooltip .item .value').eq(0).html(data[index].total);
        $('#map .tooltip .item .value').eq(1).html(data[index].risk);
        $('#map .tooltip .item .value').eq(2).html(data[index].highRisk);
        $('#map .tooltip-container').show();
        // var position = positionMap[data[index].code];
        $('#map .tooltip-container').css(cssTooltip).show();
        if(index===data.length-1) {
            index=0;
        } else {
            index++;
        } 
    };
    setInfo();
    mapActive = setInterval(setInfo, 10000);
};




/**
 * 循环显示各个市的数据
 */
// var setMapActive = function(data) {
//     if(mapActive) {
//         clearInterval(mapActive);
//     }
//     var positionMap = {    // 各市对应的tip位置和市中心点的位置
//         '130100': {tipLeft:34, tipTop:780,afterCss:'width: 108px;top: 162px;right: -109px;'},
//         '130200': {tipLeft:1111, tipTop:852,afterCss:'width: 150px;top: -43px;right: 184px;transform: rotate(35deg);'},
//         '130300': {tipLeft:1357, tipTop:489,afterCss:'width: 70px;top: 144px;left: -70px;transform: rotate(15deg);'},
//         '130400': {tipLeft:25, tipTop:831,afterCss:'width: 280px;top: 348px;right: -69px;transform: rotate(17deg);'},
//         '130500': {tipLeft:25, tipTop:831,afterCss:'width: 280px;top: 269px;right: -223px;transform: rotate(54deg);'},
//         '130600': {tipLeft:25, tipTop:611,afterCss:'width: 220px;top: 148px;right: -220px;'},
//         '130700': {tipLeft:25, tipTop:300,afterCss:'width: 224px;top: 160px;right: -223px;'},
//         '130800': {tipLeft:1286, tipTop:169,afterCss:'width: 216px;top: 174px;left: -215px;transform: rotate(-9deg);'},
//         '130900': {tipLeft:1100, tipTop:840,afterCss:'width: 216px;top: 117px;left: -206px;transform: rotate(23deg);'},
//         '131000': {tipLeft:1100, tipTop:840,afterCss:'width: 262px;top: -5px;left: -237px;transform: rotate(36deg);'},
//         '131100': {tipLeft:1100, tipTop:840,afterCss:'width: 290px;top: 231px;left: -290px;'}
//     };
//     var index = 0;
//     var setInfo = function() {
//         $('#map .tooltip ').css({
//             width:'0px',
//             height: '0px'
//         });
//         $('#map .tooltip style').html('#map .tooltip::after{display:none;}');
//         $('#map .tooltip').animate({width:'400px',height: '310px'},1000,function(){
//             $('#map .tooltip style').html('#map .tooltip::after{' + position.afterCss + 'display:block;}');
//         });
//         $('#map .tooltip .name').html(data[index].name);
//         $('#map .tooltip .item .value').eq(0).html(data[index].total);
//         $('#map .tooltip .item .value').eq(1).html(data[index].risk);
//         $('#map .tooltip .item .value').eq(2).html(data[index].highRisk);
//         var position = positionMap[data[index].code];
//         $('#map .tooltip-container').css({
//             'left' : position.tipLeft + 'px',
//             'top' : position.tipTop + 'px'
//         }).show();
//         if(index===data.length-1) {
//             index=0;
//         } else {
//             index++;
//         } 
//     };
//     setInfo();
//     mapActive = setInterval(setInfo, 10000);
// };