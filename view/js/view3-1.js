$(function () {
    var indexChangeChart =echarts.init(document.getElementById('indexChangeChart'));

    // tab切换
    // $('#item-toggle').rollSlide({
    //     orientation: 'left',
    //     num: 1,
    //     v: 1000,
    //     space: 3000,
    //     isRoll: false
    // });
    $('#item-toggle .roll__list li').on('click',function () {
        var code = $(this).data('code');
        initTop10('data/top10-'+code+'.json')
        initTop10Chart('data/indexRiskScopeChangeData'+code+'.json')
        $(this).addClass('active').siblings().removeClass('active')
    })

    // top10

    initTop10('data/top10-01.json')
    initTop10Chart('data/indexRiskScopeChangeData01.json')

    function initTop10(url) {
        $.ajax({
            url: url,
            dataType: 'json',
            sync:false,
            success: function (data) {
                var htmls = '<ul class="roll__list" style="position: absolute; left: 0; top: 0;">';
                $.each(data, function (index, item) {
                    htmls += '<li class="li-'+index+'">' +
                        '<dl>' +
                        '  <dt>' + item.name + '</dt>' +
                        '   <dd>' + item.value + '</dd>' +
                        '</dl>' +
                        '</li>'

                })
                htmls+='</ul>'
                $('#top10').html(htmls);
                $('#top10').rollNoInterval().top();

            }
        })
        
    }
   
    
    function initTop10Chart(url) {
        $.ajax({
            url: url,
            dataType: 'json',
            success: function (data) {
                var xDatas = [];
                var yDatas = [];
                $.each(data, function (index, item) {
                    xDatas.push(item.date);
                    yDatas.push(item.value);
                })
                
                var option = {
                    tooltip: {
                        show:true,
                        trigger: 'axis',
                        position: function (pt) {
                            return [pt[0], '10%'];
                        }
                    },
                    grid:{
                        left:"5%",
                        right:"8%",
                        top:"10%",
                        bottom:"10%"
                    },
                    legend: {
                        icon: 'rect',
                        itemWidth: 10,
                        itemHeight: 10,
                        y: 'top',
                        right: '40px',
                        textStyle: {
                            color: '#FFF',
                            fontSize: '24px'
                        }

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
                                color: "#999999",
                                fontSize: 16
                            },
                            interval: 0,
                            // rotate:40
                        },
                        data: xDatas
                    },
                    yAxis: [{
                            type: 'value',
                            boundaryGap: [0, '100%'],
                            max: function (value) {
                                return Math.ceil(value.max / 10) * 10;
                            },
                            splitLine: {
                                show: true,
                                lineStyle: {
                                    color: '#999999',
                                    width: 1,
                                    type: 'dashed',
                                    opacity: 0.5
                                }

                            },
                            axisLine: {
                                show: false,
                                lineStyle: {
                                    color: '#999999',
                                    width: 3,
                                    type: 'solid'
                                }
                            },
                            axisLabel: {
                                textStyle: {
                                    color: "#999999",
                                    fontSize: 16
                                }
                            }
                        }
                       
                    ],
                    series: [{
                            name: '',
                            type: 'line',
                            symbol: 'circle',
                            symbolSize:8,
                            showSymbol:false,
                            itemStyle: {
                                normal: {
                                    borderColor:'#e43bee',
                                    borderWidth: 6,
                                    color: 'rgb(58,115,201,0.8)'
                                }
                            },
                            lineStyle:{
                                color:"#d83bef",
                                width:4
                            },
                            areaStyle: {
                                normal: {
                                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                        offset: 0,
                                        color: 'rgb(216,59,239,0.9)'
                                    }, {
                                        offset: 1,
                                        color: 'rgb(216,59,239,0)'
                                    }])
                                }
                            },
                            data: yDatas
                        },

                    ]
                };
                indexChangeChart.setOption(option);

            }
        })

    }

    // 当期行业运行指数
    $("#circleChart1").circleChart({
        size: 80,
        value: 40,
        color: "#03e5d2",
        backgroundColor: "#fff",
        text: 0,
        onDraw: function(el, circle) {
            circle.text(Math.round(circle.value));
        }
    });
    $("#circleChart2").circleChart({
        size: 80,
        value: 40,
        color: "#03e5d2",
        backgroundColor: "#fff",
        text: 0,
        onDraw: function(el, circle) {
            circle.text(Math.round(circle.value));
        }
    });
    $("#circleChart3").circleChart({
        size: 80,
        value: 40,
        color: "#03e5d2",
        backgroundColor: "#fff",
        text: 0,
        onDraw: function(el, circle) {
            circle.text(Math.round(circle.value));
        }
    });
    $("#circleChart4").circleChart({
        size: 80,
        value: 40,
        color: "#03e5d2",
        backgroundColor: "#fff",
        text: 20,
        onDraw: function(el, circle) {
            circle.text(Math.round(circle.value));
        }
    }); 
    $.ajax({
        url: 'data/compony.json',
        dataType: 'json',
        success: function(data){
            initComponyChart(data)
        }
    });
    // 非法集资风险企业分布
    var initComponyChart = function(data) {
        var comonyChart = echarts.init(document.getElementById('comonyChart'))
        var riskData = [];
        var sum = 0;
        $.each(data, function(key, value) {
            sum += value;
        });
        $.each(data, function(key, value) {
            var quantity = data[key]?data[key]:0;
            var rate = (sum > 0) ? Math.round(quantity*100/sum) : 0;
        
            riskData.push({name:key, value:rate,quantity:quantity});
        });
        var option = {
            series : [
                {
                    type:'pie',
                    radius : ['50%','70%'],
                    center: ['50%', '50%'],
                    color:['#E13848','#E7773A','#EAC82B','#3A73C9'],
                    data:riskData,
                    label: {
                        // textStyle: {
                        //     fontSize: 24
                        // },
                        verticalAlign:'top',
                        formatter:function(a){
                            var content = '';
                            content += ' {rate|'+a.data.value+'%}   ';
                            content += '{name|'+a.data.name+'}\n';
                            content += '{value|企业个数：'+a.data.quantity+'}';
                            return content;
                            
                        },
                        rich: {
                            rate: {
                                color:'#FFF',
                                fontSize:28,
                    
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
    
        comonyChart.setOption(option);
       
    };
})

// 预警企业及处置企业情况
$(function(){
    var lineCharts = echarts.init(document.getElementById('lineCharts'));
    var xData = ['201609', '201610', '201611', '201612', '201701', '201702']
  
    var option1 = {
        legend:{
            icon:'rect',
            itemWidth:10,
            itemHeight:10,
            data:["预警企业","处置企业","案件移交"],
            //top:'40',
            textStyle:{
                color:"#fff"
            },
            right:20,
            top:5
            
        },
        color:["#1ecb43","#7a86fc","#f918de"],
        tooltip:{
            show:false,
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
               type: 'line'
            },
            textStyle:{
                padding:30,
                color:"#fff"
            },
            // backgroundColor:"transparent",
            // formatter : function(params,ticket,callback){
            //     var data1=datas1[params[0].dataIndex]*20+'%'
            //     return '<div style="background-size:100% 100%;width:200px;height:100px;padding:20px 0 20px 40px">' +
            //         '<span style="margin-left:10px;font-weight: bold">'+data1+'</span>'+
            //         ' <span style="margin-left:5px;font-weight: bold">'+"12%"+'</span><br/> '+
            //         '<span style="margin:10px;font-weight: bold">'+'2018.05.15'+'</span><br />'+

            //         '</div>';
            // }
        },
        xAxis: {
            // name:'日期',
            type: 'category',
            boundaryGap : true,
            data:xData,
            axisLabel:{
                color:"#7fc5ed"
            },
            axisLine:{
                lineStyle: {
                    color: '#175c81'
                }
            },
            axisTick:{
                color:'#fff'
            }
        },
        yAxis: {
            // name:'万元',
            type: 'value',
            boundaryGap : true,
            
            axisLabel:{
                color:"#7fc5ed"
            },
            splitLine:{
                show:true,
                lineStyle:{
                    color:'#104f6d',
                    type:'dashed'
                }
            },
            axisLine:{
                lineStyle: {
                    color: '#175c81'
                }
            }
        },
        grid:{
            top:'10%',
            bottom:'20%'
        },
        series: [
            {
                name:'预警企业',
                data: [50,70,90,100,110,120],
                type: 'line',
                smooth: true,
                symbolSize:0,
                itemStyle:{
                    normal:{
                        lineStyle:{
                            width:2,
                            color:'#1ecb43',
                            shadowBlur:10,
                            shadowColor:'#1ecb43'
                        }
                    }
                }
            },
            {
                name:'处置企业',
                data:[100,200,140,300,140,200],
                type: 'line',
                width:3,
                symbolSize:0,
                smooth: true,
                itemStyle:{
                    normal:{
                        lineStyle:{
                            width:2,
                            color:'#7a86fc',
                            shadowBlur:10,
                            shadowColor:'#7a86fc'
                        }
                    }
                }
            },
            {
                name:'案件移交',
                data:[200,300,340,220,240,100],
                type: 'line',
                width:3,
                symbolSize:0,
                smooth: true,
                itemStyle:{
                    normal:{
                        lineStyle:{
                            width:2,
                            color:'#f918de',
                            shadowBlur:10,
                            shadowColor:'#f918de'
                        }
                    }
                }
            }
        ]
    };
    lineCharts.setOption(option1);
})

// 非法集资高风险企业
$.ajax({
    url: 'data/riskCompanyData.json',
    dataType: 'json',
    success: function(data){
        renderRiskCompanyData(data.pageData);
    }
});
var renderRiskCompanyData = function(data) {
    var html = '';
    $.each(data, function(index, item){
        // 计算风险等级：高、中、低
        var riskLevelName; 
        var riskLevel;
        var iconId;
        var riskIndex = parseInt(item.riskIndex)
        // if(riskIndex > 400) {
        //     riskLevelName = "高";
        //     riskLevel = 1;
        //     iconId = 'level1';
        // } else if(riskIndex >200 && riskIndex <= 400) {
        //     riskLevelName = "中";
        //     riskLevel = 2;
        //     iconId = 'level2';
        // } else if(riskIndex >100 && riskIndex <= 200) {
        //     riskLevelName = "低";
        //     riskLevel = 3;
        //     iconId = 'level3';
        // } else if(riskIndex <= 100){
        //     riskLevelName = '普'; 
        //     riskLevel = 4;
        //     iconId = 'level4';
        // }
        if(riskIndex > 0) {
            riskLevelName = "高";
            riskLevel = 2;
            iconId = 'level2';
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
        html += '<div class="index-container" style="width:' + 120 + 'px;">';
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

// 地图
$(function () {
    // 地图echart
    var map = echarts.init($('#map .map')[0])
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

                renderTooltip(data)
              
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
            tooltip:{
                backgroundColor:'transparent',
                formatter:function (params) {
                   
                    return  '<div style="width:360px;height:440px;background:url(img/tooltip-bg.png) center no-repeat;padding:30px 20px;position:relative;z-index:100">'+
                            '<h3 style="color:#fff;font-size:28px;padding:20px 0px 30px 30px;text-align:left;font-weight:normal;">'+params.name+'</h3>'+
                            '<div style="padding:20px 40px 20px 40px;overflow:hidden">'+
                            '    <span style="color:#fff;font-size:24px;float:left;">监管企业<small>(家)</small>:</span>'+
                            '    <span style="font-size:28px;color:#fff;float:right;">'+params.data.total+'</span>'+
                            '</div>'+
                            '<div style="padding:20px 40px 20px 40px;overflow:hidden">'+
                            '    <span style="color:#fff;font-size:24px;float:left;">风险企业<small>(家)</small>:</span>'+
                            '    <span style="font-size:28px;color:#fff;float:right;">'+params.data.risk+'</span>'+
                            '</div>'+
                            '<div style="padding:20px 40px 20px 40px;overflow:hidden">'+
                            '    <span style="color:#fff;font-size:24px;float:left;">检测企业<small>(家)</small>:</span>'+
                            '    <span style="font-size:28px;color:#fff;float:right;">'+params.data.Detection+'</span>'+
                            '</div>'+
                            '<div style="padding:20px 40px 20px 40px;overflow:hidden">'+
                            '    <span style="color:#fff;font-size:24px;float:left;">非法集资风险<small>(家)</small>:</span>'+
                            '    <span style="font-size:28px;color:#fff;float:right;">'+params.data.illegal+'</span>'+
                            '</div>'+
                            '</div>'
                   
                }
            },
            toolbox: {
                show: false
            },
            visualMap: {
                min: 0,
                max: 100,
                text:['风险等级高','风险等级低'],
                realtime: false,
                calculable: true,
                inRange: {
                    color: ['#5389ff','#1c6dfe', '#0c3fe1']
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
                                // if(params.highRisk>1) {
                                //     var icon = 'high';
                                // } else if(params.value>30 && params.value<=50) {
                                //     var icon = 'middle';
                                // } else if(params.value <= 30) {
                                //     var icon = 'low';
                                // }
                                // return params.name + '{' + icon + '|}';
                        
                                if(params.data.highRisk>1) {
                                    var icon = 'high';
                                    return params.name + '{' + icon + '|}';
                                } else if(params.data.risk>1 && params.data.highRisk<=0) {
                                    var icon = 'middle';
                                    return params.name + '{' + icon + '|}';
                                } else {
                                    var icon = 'low';
                                    return params.name + '{' + icon + '|}';
                                }
                                
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
                        normal: {//未选中状态
                            borderWidth:2,//边框大小
                            borderColor:'#07c8ff',
                            label: {
                                show: true//显示名称
                            }
                        },
                        emphasis: {// 也是选中样式
                           
                            areaColor: '#00e5d2',
                            label: {
                                show: true,
                               
                            }
                         } 
                        // normal:{label:{show:true}},
                        // emphasis:{label:{show:true}}
                    },
                    data:riskData
                }
            ]
        });


       function renderTooltip(data) {
          
            var myTime = 0;

            var index = 0;

            function autoShowTip(){

                

                myTime = setInterval(function () {
                    
                    for(var i=0;i<data.length;i++) {

                        map.dispatchAction({

                            type:'hideTip',

                            seriesIndex:0,

                            dataIndex:i

                        })

                        map.dispatchAction({

                            type:'mapUnSelect',

                            seriesIndex:0,

                            dataIndex:i

                        })

                    }
                    // map.dispatchAction({

                    //         type:"mapUnSelect",

                    //         seriesIndex:0,

                    //         dataIndex:index===0?data.length-1:(index-1)

                    // })

                    // map.dispatchAction({

                    //         type:"hideTip",

                    //         seriesIndex:0,

                    //         dataIndex:index===0?data.length-1:(index-1)

                    // })

                    map.dispatchAction({

                            type:"mapSelect",

                            seriesIndex:0,

                            dataIndex:index

                    })

                    map.dispatchAction({  

                            type:"showTip",

                            seriesIndex:0,

                            dataIndex:index

                    })

                    index++;

                    if(index > data.length){

                            index = 0;

                    }

                },5000)

            }

            autoShowTip();

        //        setMapActive(riskData);

            map.on('mousemove',function (params) {

        

                    if(myTime){

                        clearInterval(myTime);

                        myTime = 0;

                    }

                

                    for(var i=0;i<data.length;i++) {

                        map.dispatchAction({

                            type:'hideTip',

                            seriesIndex:0,

                            dataIndex:i

                        })

                        map.dispatchAction({

                            type:'mapUnSelect',

                            seriesIndex:0,

                            dataIndex:i

                        })

                    }

                    map.dispatchAction({

                        type:'showTip',

                        seriesIndex:0,

                        dataIndex:params.dataIndex

                    })

                    map.dispatchAction({

                        type:'mapSelect',

                        seriesIndex:0,

                        dataIndex:params.dataIndex

                    })

                

                

                

            })

            map.on('globalout',function () {

                    if(!myTime){

                        autoShowTip();

                        for(var i=0;i<data.length;i++) {

                            map.dispatchAction({
    
                                type:'hideTip',
    
                                seriesIndex:0,
    
                                dataIndex:i
    
                            })
    
                            map.dispatchAction({
    
                                type:'mapUnSelect',
    
                                seriesIndex:0,
    
                                dataIndex:i
    
                            })
    
                        }
                    }

            })
       }
       
    };

    renderMap();
})
