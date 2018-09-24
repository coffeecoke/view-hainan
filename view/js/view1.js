
// var radarData = [];
/**
 * 设置雷达图参数--用于刷新页面
 * @param {*} option 
 */
// var refreshRadar = function(option) {
//     option.radar[0].indicator = [];
//     option.series[0].data[0].value = [];
//     $.ajax({
//         url: 'data/radarData.json',
//         dataType: 'json',
//         async : false,
//         success: function(data){
//             var html = "<div class='radar-data-container'>";
//             $.each(data, function(index, item){
//                 // 设置雷达图参数
//                 option.radar[0].indicator.push({name:item.name, max:100});
//                 // item.value
//                 var random = Math.floor(Math.random()*(100-60+1)+60);
//                 option.series[0].data[0].value.push(item.value);
//                 // 设置右侧数据
//                 if(item.value) {
//                     html += "<div class='radar-data-item'><div name='title'>" + item.name + "</div><div name='value'>" + item.value + "</div></div>";
//                 }
                
                
//             });
//             html += "</div>"
//             $(option.selecter + " .radar-data").html(html);
//         }
//     });
//     return option;
// };

/**
 * 渲染雷达图
 * @param {*} selecter 选择器
 */
var initRaderMap = function(selecter) {
    var chartRaderMap = echarts.init($(selecter + " .radar-map")[0]);
    option = {
        title: {
            text: '监测企业:21326',
            //            x: 'center',
            //            y: 'center',
            x: '10%',
            y: '0%',
            textAlign: 'center',
            textStyle: {
                fontWeight: 'normal',
                color: '#fff',
                fontSize: '20'
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            },
            formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            textStyle:{
                color:'#fff'
            },
            //            x: 'right',文字在图例颜色的右边了
            right: '10%',
            top: '10%',
            //            data数据中若存在''，则表示换行，用''切割。
            data: ['民间投资中介机构', '网络借贷机构', '虚拟理财', '房地产行业',  '私募基金', '地方交易场', '相互保险', '养老机构','“消费返利”网站','农民合作社']
        },
        //        calculable:true,
        series: [
            {
                type: 'pie',
                // center: [110, 95],
                // radius: [88, 90],
                radius: ['73%', '75%'],
                center: ['40%', '50%'],
                labelLine: {
                    normal: {
                        show: 0,
                    },
                },
                itemStyle: {
                    normal: {
                        color: function(a) {
                            if (a.data == 2) {
                                return '#00f7fd';
                            }
                            if (a.data == 1) {
                                return 'rgba(0,0,0, 0)';
                            }
                        },
                    },
                },
                data: [2, 1, 2, 1, 2, 1, 2, 1,2,1,2,1,2,1,2,1,2,1,2,1],
            },
            {
                name: '',
                type: 'pie',
                radius: ['60%', '70%'],
                  center: ['40%', '50%'],
                // center: [110, 95],
                // radius: [52, 62],
                startAngle: 190, //设置起始的角度
                avoidLabelOverlap: false,
                hoverAnimation: false,
                /*控制圆环点击不会放大*/
    
                label: {
                    normal: {
                        show: 1,
                        position: 'top',
                        formatter: '{c}%',
                        color:'#00f7fd',
                        fontSize: '18'

                    },
                    emphasis: {
                        show: true,
                        textStyle: {
                            fontSize: '16',
                            fontWeight: 'bold'
                        }
                    }
                },
                //                labelLine: {
                //                    normal: {
                //                        show: true,
                //                        length:0.001,
                //                        type: 'dashed'
                //                    }
                //                },
                labelLine: {
                    normal: {
                        smooth: true,
                        length: 20,
                        length2: 3,
                        lineStyle: {
                            type: 'dotted',
                        },
                    },
                },
                data: [{
                        value: 21,
                        name: '民间投资中介机构',
                        itemStyle: {
                            color: '#0073ff'
                        }
                    },
                    {
                        value: 2,
                        name: '网络借贷机构',
                        itemStyle: {
                            color: '#05b5ff'
                        }
                    },
                    {
                        value: 16,
                        name: '虚拟理财',
                        itemStyle: {
                            color: '#00f9ff'
                        }
                    },
                    {
                        value: 4,
                        name: '房地产行业',
                        itemStyle: {
                            color: '#00ffc0'
                        }
                    },
                    {
                        value: 4,
                        name: '私募基金',
                        itemStyle: {
                            color: '#01ff7f'
                        }
                    },
                    {
                        value: 10,
                        name: '地方交易场',
                        itemStyle: {
                            color: '#00b265'
                        }
                    },
                    {
                        value: 3,
                        name: '相互保险',
                        itemStyle: {
                            color: '#ffd645'
                        }
                    },
                    {
                        value: 13,
                        name: '养老机构',
                        itemStyle: {
                            color: '#ff3567'
                        }
                    },
                    {
                        value: 12,
                        name: '“消费返利”网站',
                        itemStyle: {
                            color: '#b95af2'
                        }
                    },
                    {
                        value: 15,
                        name: '农民合作社',
                        itemStyle: {
                            color: '#6f5af2'
                        }
                    }
    
                ]
            }
        ]
    };
    // option = refreshRadar(option);
	
	// 使用刚指定的配置项和数据显示图表
    chartRaderMap.setOption(option);
    setInterval(function(){ // 每隔10分钟请求一次
        // option = refreshRadar(option);
        chartRaderMap.setOption(option);
    },3000);
};

var refreshIndustryChart = function(option) {
    option.xAxis.data = [];
    option.series[0].data = [];
    option.series[1].data = [];
    $.ajax({
        url: 'data/industryData.json',
        dataType: 'json',
        async : false,
        success: function(data){
            $.each(data, function(index, item){
                // 设置行业指标图参数
                option.xAxis.data.push(item.name);
                var random = Math.floor(Math.random()*60);
                item.value = random;
                option.series[0].data.push(item.value);
                option.series[1].data.push(item.value);
                
            });
        }
    });
    return option;

};

/**
 * 设置行业指标变化的图例
 * @param {*} selecter 选择器
 * @param {*} clolr 颜色
 * @param {*} name 名称
 */
// var initIndustryIcon = function(selecter, clolr, name) {
//     var objHtml = "<div class='industry-icon-item'>";
//     objHtml += "<div class='industry-icon-item-color'></div>";
//     objHtml += "<div class='industry-icon-item-name'>" + name + "</div>";
//     objHtml += "</div>";
//     $obj = $(objHtml);
//     $obj.find(".industry-icon-item-color").css("background", clolr);
//     $(selecter).append($obj);
// };

/**
 * 渲染行业指标变化图表
 * @param {*} selecter 
 */
var initIndustryChart = function(selecter) {
    var industryChart = echarts.init($(selecter)[0]);
    var option = {
        color: ['#0073ff', '#05b5ff', '#00f9ff', '#00ffc0','#01ff7f', '#00b265', '#ffd645', '#ff3567','#b95af2', '#6f5af2'],
        //title: {
        //    text: '报警次数'
        //},
        tooltip: {
            trigger: 'axis',
            //formatter: "{b} <br> 合格率: {c}%"
        },
        legend: {
            show:false,
            icon:'squer',
            orient: 'vertical',
            textStyle:{
                color:'#fff'
            },
            //            x: 'right',文字在图例颜色的右边了
            right: '2%',
            top: '5%',
            //            data数据中若存在''，则表示换行，用''切割。
            data: ['民间投资中介机构', '网络借贷机构', '虚拟理财', '房地产行业',  '私募基金', '地方交易场', '相互保险', '养老机构','“消费返利”网站','农民合作社']
        },
        grid: {
            left: '3%',
            right: '5%',
            bottom: '3%',
            top:'10%',
            containLabel: true
        },
        
        xAxis: {
            show:true,
            type:'category',
            data:['民间投资','网络借贷','虚拟理财','房地产',"私募基金","地方交易","相互保险",'养老机构'],
            axisLine:{
                show:true,
                lineStyle:{
                   color:'#999'
                }
            },
            
            axisLabel:{
                show:true,
                itemStyle:{
                    color:'#999'
                }
            },
        },
        yAxis: {
            type: 'value',
            name: '风险指数',
            min:0,
            max:500,
            axisLine:{
                lineStyle:{
                    color:'#999'
                }
            },
            axisTick:{
                lineStyle:{
                    color:'#999'
                }
            },
            axislable:{
                show:true,
                normal:{
                    color:'#999'
                }
            },
            splitLine: {
                show: true,
                lineStyle: {
                    color: '#999',
                    width: 1,
                    type: 'dashed',
                    opacity: 0.5
                }

            }
        },
        series: [
            { 
                type: 'bar',
                barGap: '-100%',
                barWidth:'20',
                //配置样式
                itemStyle: {   
                    //通常情况下：
                    normal:{  
        　　　　　　　　　　　　//每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
                        color: '#002e56'
                    },
                    //鼠标悬停时：
                    emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                },
                data: [500,500,500,500,500,500,500,500]
            },
            { 
                type: 'bar',
                barGap: '-100%',
                barWidth:'20',
                
                data: [
                    {
                        value:300,
                        itemStyle:{
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: '#185af6'
                            }, {
                                offset: 1,
                                color: '#5b8afc'
                            }]),
                        }
                    },
                    {
                        value:100,
                        itemStyle:{
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: '#1e88f6'
                            }, {
                                offset: 1,
                                color: '#5ba8fa'
                            }]),
                        }
                    },
                    {
                        value:380,
                        itemStyle:{
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: '#27d0fb'
                            }, {
                                offset: 1,
                                color: '#75e1fb'
                            }]),
                        }
                    },
                    {
                        value:350,
                        itemStyle:{
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: '#1bd7be'
                            }, {
                                offset: 1,
                                color: '#5ef0db'
                            }]),
                        }
                    },
                    {
                        value:300,
                        itemStyle:{
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: '#e7991b'
                            }, {
                                offset: 1,
                                color: '#f7bb59'
                            }]),
                        }
                    },
                    {
                        value:400,
                        itemStyle:{
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: '#ed4545'
                            }, {
                                offset: 1,
                                color: '#f16566'
                            }]),
                        }
                    },
                    {
                        value:200,
                        itemStyle:{
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: '#ed3384'
                            }, {
                                offset: 1,
                                color: '#f374ab'
                            }]),
                        }
                    },
                    {
                        value:240,
                        itemStyle:{
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: '#a17ef6'
                            }, {
                                offset: 1,
                                color: '#bfa3fa'
                            }]),
                        }
                    }
                ]
            },
          
        
    ]
}
    // option = refreshIndustryChart(option);
    industryChart.setOption(option);
    setInterval(function(){ // 每隔10分钟请求一次
        // option = refreshIndustryChart(option);
        // industryChart.setOption(option);
    },3000);
};

var tableConfig =   [
    {name :"机构名称", key:"org",  width : "10%"},
    {name :"营业收入", key:"date",  width : "10%"},
    {name :"营业利润", key:"orgName",  width : "10%"},
    {name :"净利润", key:"contractAmount",  width : "10%"},
    {name :"投资者开户数", key:"projectDuration",  width : "10%"},
    {name :"成交笔数", key:"lendingRate",  width : "10%"},
    {name :"成交金额", key:"valueDateate",  width : "10%"},
    {name :"手续费收入", key:"paymentType",  width : "10%"},
    {name :"出金总金额", key:"guaranteeType",  width : "10%"},
    {name :"入金总金额", key:"borrowerName",  width : "10%"},
    // {name :"披露财务信息<br>的企业数", key:"borrows",  width : "10%"}
];
var tableConfigs =   [
    {name :"机构名称", key:"org",  width : "10%"},
    {name :"营业收入", key:"date",  width : "5%"},
    {name :"净利润", key:"orgName",  width : "10%"},
    {name :"投资者数量", key:"contractAmount",  width : "10%"},
    {name :"挂牌公司数量 ", key:"projectDuration",  width : "10%"},
    {name :"挂牌公司总资产", key:"lendingRate",  width : "10%"},
    {name :"挂牌公司净利润", key:"valueDateate",  width : "10%"},
    {name :"挂牌公司摘牌数", key:"paymentType",  width : "10%"},
    {name :"融资总额", key:"guaranteeType",  width : "10%"},
    {name :"交易金额", key:"borrowerName",  width : "10%"},
    // {name :"风险准备金额", key:"borrows",  width : "10%"}
];
var tableConfigdata =   [
    {name :"机构名称", key:"org",  width : "10%"},
    {name :"投资人数", key:"date",  width : "10%"},
    {name :"借款人数", key:"orgName",  width : "10%"},
    {name :"成交额", key:"contractAmount",  width : "10%"},
    {name :"待收本金", key:"projectDuration",  width : "10%"},
    {name :"逾期金额", key:"lendingRate",  width : "10%"},
    {name :"逾期率", key:"valueDateate",  width : "10%"},
    {name :"代偿金额", key:"paymentType",  width : "10%"},
    {name :"代偿率", key:"guaranteeType",  width : "10%"},
    {name :"借款利率", key:"borrowerName",  width : "10%"}
];
var tableConfigdatas =   [
    {name :"机构名称", key:"org",  width : "10%"},
    {name :"笔均贷款", key:"date",  width : "10%"},
    {name :"贷款余额", key:"orgName",  width : "10%"},
    {name :"发放金额", key:"contractAmount",  width : "10%"},
    {name :"回收金额", key:"projectDuration",  width : "10%"},
    {name :"综合费率", key:"lendingRate",  width : "10%"},
    {name :"不良率", key:"valueDateate",  width : "10%"},
    {name :"拨备覆盖率", key:"paymentType",  width : "10%"},
    {name :"逾期率", key:"guaranteeType",  width : "10%"},
    {name :"债券类融资总额", key:"borrowerName",  width : "10%"}
];

var refeshPage = {};

var renderIndustryTable = function(id, index) {
    $('#' + id + ' .title-container .text span').html(industry[index].name + '当期指标数据');
    refeshPage[id] = initTable('#leftColumn1 .origin-border .horn .table-container', 'data/hainanData.json', {code:industry[index].code}, tableConfig,true);
    refeshPage[id] = initTable('#leftColumn2 .origin-border .horn .table-container', 'data/transition.json', {code:industry[index].code}, tableConfigs,false);
    refeshPage[id] = initTable('#rightColumn1 .origin-border .horn .table-container', 'data/P2PData.json', {code:industry[index].code}, tableConfigdata,true);
    refeshPage[id] = initTable('#rightColumn2 .origin-border .horn .table-container', 'data/Microfinance.json', {code:industry[index].code}, tableConfigdatas,true);
};

var initIndustryTable = function() {  // 定时切换
    var i = 4;
    var changeIndustry;
    clearInterval(changeIndustry);
    renderIndustryTable('rightColumn1', 0);
    renderIndustryTable('rightColumn2', 1);
    renderIndustryTable('leftColumn1', 2);
    renderIndustryTable('leftColumn2', 3);
    changeIndustry = setInterval(function(){
        // 表格数据
        // rotateYDIV({
        //     $obj:$('#rightColumn1'),
        //     beforeRotate: function() {
        //         if(i === industry.length) {
        //             i = 0;
        //         }
        //     },
        //     inRotate: function() {
        //         console.log("第一个数据==>" + i);
        //         clearInterval(refeshPage['rightColumn1']);
        //         renderIndustryTable('rightColumn1', i);
        //     },
        //     afterRotate: function() {
        //         i++;
        //         setTimeout(function(){
        //             rotateYDIV({
        //                 $obj:$('#rightColumn2'),
        //                 beforeRotate: function() {
        //                     if(i === industry.length) {
        //                         i = 0;
        //                     }
        //                 },
        //                 inRotate: function() {
        //                     console.log("第二个数据==>" + i);
        //                     clearInterval(refeshPage['rightColumn2']);
        //                     renderIndustryTable('rightColumn2', i);
        //                 },
        //                 afterRotate: function() {
        //                     i++;
        //                 }
        //             });
        //         },5000);
        //     }
        // });
        
    },50000);
};

/**
 * 框架渲染
 */
var renderFrame = function() {
    renderBlockBorder(".origin-border");
    renderTitle("#raderMap .origin-border", "监测行业分布");
    // 行业指标变化分为上边图例和下边的图表
    renderTitle("#industryData .origin-border", "特征词命中次数");
    // 右侧表格
    renderTitle("#leftColumn1 .origin-border", "");
    renderTitle("#leftColumn2 .origin-border", "");
    renderTitle("#rightColumn1 .origin-border", "");
    renderTitle("#rightColumn2 .origin-border", "");
    // 雷达图分为左边展示图和右边的数据
    $("#raderMap .origin-border .horn").append("<div class='radar-map'></div>");
    // 行业指标变化
    $("#industryData .origin-border .horn").append("<div class='industry-icon'></div><div class='industry-map'></div>");
    // initIndustryIcon("#industryData .origin-border .horn .industry-icon", "#E13848", "高于50");
    // initIndustryIcon("#industryData .origin-border .horn .industry-icon", "#D08954", "高于30-低于50");
    // initIndustryIcon("#industryData .origin-border .horn .industry-icon", "#3A73C9", "低于30");
    $("#rightColumn1 .origin-border .horn").append("<div class='table-container'></div>");
    $("#rightColumn2 .origin-border .horn").append("<div class='table-container'></div>");
    $("#leftColumn1 .origin-border .horn").append("<div class='table-container'></div>");
    $("#leftColumn2 .origin-border .horn").append("<div class='table-container'></div>");
};
/**
 * 数据渲染
 */
var renderData = function() {
    // 渲染雷达数据
    initRaderMap("#raderMap .origin-border .horn");
    // 行业指标变化
    initIndustryChart("#industryData .origin-border .horn .industry-map");
    // 渲染右侧数据
    initIndustryTable();
};

