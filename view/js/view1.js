
// var radarData = [];
/**
 * 设置雷达图参数--用于刷新页面
 * @param {*} option 
 */
var refreshRadar = function(option) {
    option.radar[0].indicator = [];
    option.series[0].data[0].value = [];
    $.ajax({
        url: 'data/radarData.json',
        dataType: 'json',
        async : false,
        success: function(data){
            var html = "<div class='radar-data-container'>";
            $.each(data, function(index, item){
                // 设置雷达图参数
                option.radar[0].indicator.push({name:item.name, max:100});
                // item.value
                var random = Math.floor(Math.random()*(100-60+1)+60);
                option.series[0].data[0].value.push(item.value);
                // 设置右侧数据
                if(item.value) {
                    html += "<div class='radar-data-item'><div name='title'>" + item.name + "</div><div name='value'>" + item.value + "</div></div>";
                }
                
                
            });
            html += "</div>"
            $(option.selecter + " .radar-data").html(html);
        }
    });
    return option;
};

/**
 * 渲染雷达图
 * @param {*} selecter 选择器
 */
var initRaderMap = function(selecter) {
    var chartRaderMap = echarts.init($(selecter + " .radar-map")[0]);
    var option = {
        selecter : selecter,
        legend: {                               // 图例组件
            enabled: true                       // 隐藏图例
	    },
	    radar: [{                               // 雷达图坐标系组件，只适用于雷达图。
	        center: ['50%', '50%'],             // 圆中心坐标，数组的第一项是横坐标，第二项是纵坐标。[ default: ['50%', '50%'] ]
	        radius: "60%",                      // 圆的半径，数组的第一项是内半径，第二项是外半径。
	        startAngle: 90,                     // 坐标系起始角度，也就是第一个指示器轴的角度。[ default: 90 ]
	        name: {                             // (圆外的标签)雷达图每个指示器名称的配置项。
	            formatter: '{value}',
	            textStyle: {
	                fontSize: 24,
	                color: '#FFF'
	            }
	        },
	        nameGap: 30,                        // 指示器名称和指示器轴的距离。[ default: 15 ]
	        splitNumber: 4,                     // (这里是圆的环数)指示器轴的分割段数。[ default: 5 ]
	        shape: 'circle',                    // 雷达图绘制类型，支持 'polygon'(多边形) 和 'circle'(圆)。[ default: 'polygon' ]
	        axisLine: {                         // (圆内的几条直线)坐标轴轴线相关设置
	            show:false                      // 是否显示坐标轴轴线
            },
	        splitLine: {                        // (这里是指所有圆环)坐标轴在 grid 区域中的分隔线。
	            lineStyle: {
	                color: '#3B5BA2',           // 分隔线颜色
	                width: 1, 					// 分隔线线宽
	            }
	        },
	        splitArea: {                        // 坐标轴在 grid 区域中的分隔区域，默认不显示。
                show: false
	        }
	    }],
	    series: [{
	        name: '雷达图',              // 系列名称,用于tooltip的显示，legend 的图例筛选，在 setOption 更新数据和配置项时用于指定对应的系列。
	        type: 'radar',              // 系列类型: 雷达图
	        itemStyle: {                // 折线拐点标志的样式。
	            normal: {               // 普通状态时的样式
	                lineStyle: {
                        width: 5,
                        color: '#2d66d1',
                        shadowBlur: 30,
                        shadowColor: "#7498CE", //7498CE
                        shadowOffsetX: 0,
                        shadowOffsetY: 0
	                },
	                opacity: 1
	            }
	        },
	        data: [{
	            symbol: 'circle',
	            symbolSize: 8,
	            label: {                   
	                    normal: {  
	                        show: false
	                    }  
	                },
	            itemStyle: {
	                normal: {
	                    borderColor: '#FFF',
                        borderWidth: 1,
                        color:'rgba(12, 17, 36, 1)'
	                }
	            },
	            
	            areaStyle: {
	                normal: {
                        color: {
                            type: 'radial',
                            x: 0.5,
                            y: 0.5,
                            r: 0.5,
                            colorStops: [{
                                offset: 0, color: 'rgb(10,63,191,0.5)' // 0% 处的颜色
                            }, {
                                offset: 01, color: 'rgb(10,63,191,0)' // 100% 处的颜色
                            }],
                            globalCoord: false // 缺省为 false
                        }
	                }
	            }
	        }]
	    }]
    };
    option = refreshRadar(option);
	
	// 使用刚指定的配置项和数据显示图表
    chartRaderMap.setOption(option);
    setInterval(function(){ // 每隔10分钟请求一次
        option = refreshRadar(option);
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
var initIndustryIcon = function(selecter, clolr, name) {
    var objHtml = "<div class='industry-icon-item'>";
    objHtml += "<div class='industry-icon-item-color'></div>";
    objHtml += "<div class='industry-icon-item-name'>" + name + "</div>";
    objHtml += "</div>";
    $obj = $(objHtml);
    $obj.find(".industry-icon-item-color").css("background", clolr);
    $(selecter).append($obj);
};

/**
 * 渲染行业指标变化图表
 * @param {*} selecter 
 */
var initIndustryChart = function(selecter) {
    var industryChart = echarts.init($(selecter)[0]);
    var option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'none'
            },
            formatter: function (params) {
                return params[0].name + ': ' + params[0].value;
            }
        },
        xAxis: {
            axisTick: {show: true},
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
        yAxis: {
            max : 60,
            splitLine: {
                show: true,
                lineStyle : {
                    color: '#999999',
                    width: 1,
                    type: 'dashed',
                    opacity : 0.5
                }
                
            },
            axisTick: {show: true},
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
                    color : "#81c6ed",
                    fontSize : 16
                }
            }
        },
        color: function(params) {
            if(params.value > 50) {
                return "#E13848";
            } else if(params.value > 30 &&  params.value <= 50) {
                return "#D0B954";
            } else {
                return "#3A73C9";
            }
        },
        series: [{
            name: 'hill',
            type: 'pictorialBar',
            barCategoryGap: '0%',
            symbol: 'triangle',
            itemStyle: {
                normal: {
                    opacity: 0.9
                },
                emphasis: {
                    opacity: 1
                }
            },
            z: 10
        }, {
            name: 'glyph',
            type: 'pictorialBar',
            barGap: '-100%',
            symbol: "path://M250 50 L0 -500 L500 -500 Z",
            symbolPosition: 'end',
            symbolSize: 20,
            symbolOffset: [0, '-120%']
        }]
    };
    option = refreshIndustryChart(option);
    industryChart.setOption(option);
    setInterval(function(){ // 每隔10分钟请求一次
        option = refreshIndustryChart(option);
        industryChart.setOption(option);
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
    renderTitle("#raderMap .origin-border", "企业地区分布图");
    // 行业指标变化分为上边图例和下边的图表
    renderTitle("#industryData .origin-border", "行业指标变化");
    // 右侧表格
    renderTitle("#leftColumn1 .origin-border", "");
    renderTitle("#leftColumn2 .origin-border", "");
    renderTitle("#rightColumn1 .origin-border", "");
    renderTitle("#rightColumn2 .origin-border", "");
    // 雷达图分为左边展示图和右边的数据
    $("#raderMap .origin-border .horn").append("<div class='radar-map'></div><div class='radar-data'></div>");
    // 行业指标变化
    $("#industryData .origin-border .horn").append("<div class='industry-icon'></div><div class='industry-map'></div>");
    initIndustryIcon("#industryData .origin-border .horn .industry-icon", "#E13848", "高于50");
    initIndustryIcon("#industryData .origin-border .horn .industry-icon", "#D08954", "高于30-低于50");
    initIndustryIcon("#industryData .origin-border .horn .industry-icon", "#3A73C9", "低于30");
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

