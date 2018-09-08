
var radarData = [];
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
                option.series[0].data[0].value.push(random);
                // 设置右侧数据
                html += "<div class='radar-data-item'><div name='title'>" + item.name + "</div><div name='value'>" + random + "</div></div>";
                
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
                        color: '#0e2568',
                        shadowBlur: -50,
                        shadowColor: "#FFF",
                        shadowOffsetX: 0,
                        shadowOffsetY: 0,
                        opacity: 0.1,
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
            symbolSize: 30,
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

/**
 * 初始化表格框架
 * @param {*} selecter 选择器
 * @param {*} config 配置
 */
var initTable = function(selecter, data, config) {
    var defaults = [
        {name :"时间", key:"date",  width : "5%"},
        {name :"金融机构名称", key:"orgName",  width : "10%"},
        {name :"合同金额（千万）", key:"contractAmount",  width : "10%"},
        {name :"项目期限", key:"projectDuration",  width : "10%"},
        {name :"借款利率", key:"lendingRate",  width : "10%"},
        {name :"起息日", key:"valueDateate",  width : "5%"},
        {name :"还款方式", key:"paymentType",  width : "10%"},
        {name :"担保方式", key:"guaranteeType",  width : "10%"},
        {name :"借款人", key:"borrowerName",  width : "10%"},
        {name :"借款人证件类型", key:"credentialType",  width : "10%"},
        {name :"借款人证件号码", key:"credentialNum",  width : "10%"}
    ];
    config = config || defaults;
    var html = "";
    var tHeader = "";
    var tBody = "";
    html += "<table>";
    html += "<thead>";
    html += "<tr>";
    $.each(config, function(index, item) {
        html += "<th data-key='" + item.key + "' width='" + item.width + "'>";
        html += item.name;
        html += "</th>";
    });
    html += "</tr>";
    html += "</thead>";
    html += "<tbody>";
    $.each(data, function(i, item){
        html += "<tr>";
        $.each(config, function(j, c) {
            var key = c.key;
            html += "<td width='" + c.width + "'>";
            html += item[key];
            html += "</td>";
        });
        
        html += "</tr>";
    });
    html += "</tbody>";
    html += "</table>";

    $(selecter).append("<div class='tbl-header'>" + html + "</div><div class='tbl-body'>" + html + "</div>");
};

var refreshTableData = function(url) {
    var result;
    $.ajax({
        url: url,
        dataType: 'json',
        async : false,
        success: function(data){
            result = data.pageData;
            $.each(result, function(index, item){
                // 设置一点变化
                var random = Math.floor(Math.random()*1000);
                item.contractAmount = random;
            });
        }
    });
    return result;
};

var setTableScroll = function(selecter) {
    var itemLength = $(selecter + ' .tbl-body tbody tr').length;
    // if(itemLength > 10){
    //     $(selecter + ' .tbl-body tbody').html($(selecter + ' .tbl-body tbody').html()+$(selecter + ' .tbl-body tbody').html());
    //     $(selecter + ' .tbl-body').css('top', '0');
    //     var tblTop = 0;
    //     var speedhq = 50; // 数值越大越慢
    //     var outerHeight = $(selecter + ' .tbl-body tbody').find("tr").outerHeight();
    //     function Marqueehq(){
    //         if(tblTop <= -outerHeight*itemLength){
    //             tblTop = 0;
    //         } else {
    //             tblTop -= 1;
    //         }
    //         $(selecter + ' .tbl-body').css('top', tblTop+'px');
    //     }
    
    //     MyMarhq = setInterval(Marqueehq,speedhq);
    
    //     // 鼠标移上去取消事件
    //     $(selecter + " .tbl-header tbody").hover(function (){
    //         clearInterval(MyMarhq);
    //     },function (){
    //         clearInterval(MyMarhq);
    //         MyMarhq = setInterval(Marqueehq,speedhq);
    //     })
    
    // }
};