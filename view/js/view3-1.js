var industryMap = getNameByCode();
$(function () {
    // 模块载入动画
    var t =new TimelineMax();
   
    t.to('.column > div', 1, {
        x:0,
        y:0
    });
   

    var indexChangeChart = echarts.init(document.getElementById('indexChangeChart'));

    // tab切换
    // $('#item-toggle').rollSlide({
    //     orientation: 'left',
    //     num: 1,
    //     v: 1000,
    //     space: 3000,
    //     isRoll: false
    // });
    $('#item-toggle .roll__list li').on('click', function () {
        var code = $(this).data('code');
        $('#top10').data('code', code);
        initTop10('data/top10-' + code + '.json')
        initTop10Chart('data/indexRiskScopeChangeData' + code + '.json')
        $(this).addClass('active').siblings().removeClass('active')
    })

    // top10
    $('#item-toggle .roll__list li:first-child').click()
    //initTop10('data/top10-01.json')
    initTop10Chart('data/indexRiskScopeChangeData01.json')

    function initTop10(url) {
        $.ajax({
            url: url,
            dataType: 'json',
            sync: false,
            success: function (data) {
                var htmls = '<ul class="roll__list" style="position: absolute; left: 0; top: 0;">';
                $.each(data, function (index, item) {
                    htmls += '<li class="li-' + index + '">' +
                        '<dl>' +
                        '  <dt>' + item.name + '</dt>' +
                        '   <dd>' + item.value + '</dd>' +
                        '</dl>' +
                        '</li>'

                })
                htmls += '</ul>'
                $('#top10').html(htmls);
                $('#top10').rollNoInterval().top();

            }
        })
        renderModal();

        function renderModal() {
            $('.mask').on('click', function () {
                $('#risk-modal').fadeOut();
                $(this).fadeOut();
            });
            $('#top10').on('click', function () {
                $('.mask').fadeIn();
                $('#risk-modal').fadeIn();
                var code = $(this).data('code');
                $('#risk-modal .origin-border .title-container .text span').text(industryMap[code]);
                var configs = {
                    // p2p
                    "01": [{
                            name: "序号",
                            key: "rank",
                            width: "5%",
                            class: "rank"
                        },
                        {
                            name: "企业名称",
                            key: "companyName",
                            width: "30%",
                            class: "white"
                        },
                        
                        {
                            name: "风险指标分类",
                            key: "classification",
                            width: "15%",
                            class: "blue"
                        },
                        {
                            name: "风险指标",
                            key: "index",
                            width: "30%",
                            class: "blue"
                        }

                    ],
                    // 小贷
                    "02": [{
                            name: "序号",
                            key: "rank",
                            width: "5%",
                            class: "rank"
                        },
                        {
                            name: "企业名称",
                            key: "companyName",
                            width: "30%",
                            class: "white"
                        },
                       
                        {
                            name: "风险指标分类",
                            key: "classification",
                            width: "15%",
                            class: "blue"
                        },
                        {
                            name: "风险指标",
                            key: "index",
                            width: "30%",
                            class: "blue"
                        }

                    ],
                    // 地方交易场所
                    "03": [{
                            name: "序号",
                            key: "rank",
                            width: "5%",
                            class: "rank"
                        },
                        {
                            name: "企业名称",
                            key: "companyName",
                            width: "30%",
                            class: "white"
                        },
                        
                        {
                            name: "风险指标分类",
                            key: "classification",
                            width: "15%",
                            class: "blue"
                        },
                        {
                            name: "风险指标",
                            key: "index",
                            width: "30%",
                            class: "blue"
                        }

                    ],
                    // 股权交易场所
                    "04": [{
                            name: "序号",
                            key: "rank",
                            width: "5%",
                            class: "rank"
                        },
                        {
                            name: "企业名称",
                            key: "companyName",
                            width: "30%",
                            class: "white"
                        },
                        
                        {
                            name: "风险指标分类",
                            key: "classification",
                            width: "15%",
                            class: "blue"
                        },
                        {
                            name: "风险指标",
                            key: "index",
                            width: "30%",
                            class: "blue"
                        }

                    ],



                }

                initTable('#risk-modal .table-container', 'data/riskModal' + code + '.json', {
                    code: code
                }, configs[code], true);

            })

            
        }


    }

    $(function () {
        // 非法集资企业弹出框
        $('.mask').on('click',function () {
            $('.mask').fadeOut();
            $('#holographic-modal').fadeOut();
        })
        $('#companyList').on('click', function () {
            var code = ''
            var config = [{
                    name: "序号",
                    key: "key1",
                    width: "4%",
                    class: "rank"
                },
                {
                    name: "企业名称",
                    key: "key2",
                    width: "10%",
                    class: "white"
                },
                
                {
                    name: "数据日期",
                    key: "key3",
                    width: "15%",
                    class: "blue"
                },
                {
                    name: "风险指标分类",
                    key: "key4",
                    width: "15%",
                    class: "blue"
                },
                {
                    name: "风险指标",
                    key: "key4",
                    width: "15%",
                    class: "blue"
                },
                {
                    name: "风险依据信息",
                    key: "key4",
                    width: "35%",
                    class: "blue"
                },
                {
                    name: "置信度",
                    key: "key4",
                    width: "10%",
                    class: "blue"
                }

            ]

            $('.mask').fadeIn();
            $('#holographic-modal').fadeIn();
            $('#holographic-modal .origin-border .title-container .text span').text('海南守财奴金融信息服务有限公司--全息画像');
            $('#holographic-toggle .roll__list li').on('click',function () {
                var $index =$(this).index();
                $(this).addClass('active').siblings().removeClass('active');
                $('.holographic-wrap .panel-items .panel-item').eq($index).show().siblings().hide()
                if($index==4) {
                    initTable('.holographic-wrap .panel-items .panel-item5 .table-container', 'data/riskCompanyModal' + code + '.json', {
                        code: code
                    }, config, true);
                }
               
            })

           
           
            
        })
    })


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
                        show: true,
                        trigger: 'axis',
                        position: function (pt) {
                            return [pt[0], '10%'];
                        }
                    },
                    grid: {
                        left: "5%",
                        right: "8%",
                        top: "10%",
                        bottom: "10%"
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
                            symbolSize: 8,
                            showSymbol: false,
                            itemStyle: {
                                normal: {
                                    borderColor: '#e43bee',
                                    borderWidth: 6,
                                    color: 'rgb(58,115,201,0.8)'
                                }
                            },
                            lineStyle: {
                                color: "#d83bef",
                                width: 4
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

    
    $.ajax({
        url: 'data/compony.json',
        dataType: 'json',
        success: function (data) {
            initComponyChart(data)
        }
    });
    // 非法集资风险企业分布
    var initComponyChart = function (data) {
        var comonyChart = echarts.init(document.getElementById('comonyChart'))
        var riskData = [];
        var sum = 0;
        $.each(data, function (key, value) {
            sum += value;
        });
        $.each(data, function (key, value) {
            var quantity = data[key] ? data[key] : 0;
            var rate = (sum > 0) ? Math.round(quantity * 100 / sum) : 0;

            riskData.push({
                name: key,
                value: rate,
                quantity: quantity
            });
        });
        var option = {
            angleAxis: {
                interval: 1,
                type: 'category',
                data: ['舆情',
                    '资金流向',
                    '金融产品',
                    '财务报表',
                    '机构与高管',
                    '投资者调查',
                    '借调人调查',
                    '收益承诺'
                ],
                z: 10,
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: "#284fe6",
                        width: 1,
                        type: "solid"
                    },
                },
                axisLabel: {
                    interval: 0,
                    show: true,
                    color: "#00e5d2",
                    margin: 8,
                    fontSize: 16
                },
            },
            radiusAxis: {
                min: 0,
                max: 100,
                interval: 20,
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: "#284fe6",
                        width: 1,
                        type: "solid"
                    },
                },
                axisLabel: {
                    formatter: '{value} %',
                    show: true,
                    padding: [0, 0, 20, 0],
                    color: "#00e5d2",
                    fontSize: 14
                },
                splitLine: {
                    lineStyle: {
                        color: "#284fe6",
                        width: 1,
                        type: "solid"
                    }
                }
            },
            polar: {},
           
            series: [{
                type: 'bar',
                data: [{
                        value:80,
                        itemStyle: {
                            normal: {
                                color: "#f54d4d"
                            }
                        }
                    },
                    {
                        value: 70,
                        itemStyle: {
                            normal: {
                                color: "#f87544"
                            }
                        }
                    },
                    {
                        value: 60,
                        itemStyle: {
                            normal: {
                                color: "#ffae00"
                            }
                        }
                    },
                    {
                        value: 50,
                        itemStyle: {
                            normal: {
                                color: "#dcff00"
                            }
                        }
                    },
                    {
                        value: 50,
                        itemStyle: {
                            normal: {
                                color: "#25d053"
                            }
                        }
                    },
                    {
                        value:53,
                        itemStyle: {
                            normal: {
                                color: "#01fff5"
                            }
                        }
                    },
                    {
                        value: 48,
                        itemStyle: {
                            normal: {
                                color: "#007cff"
                            }
                        }
                    },
                    {
                        value: 45,
                        itemStyle: {
                            normal: {
                                color: "#4245ff"
                            }
                        }
                    }
                ],
                coordinateSystem: 'polar',
            }],
        };

        comonyChart.setOption(option);

    };
})

// 预警企业及处置企业情况
$(function () {
    var lineCharts = echarts.init(document.getElementById('lineCharts'));
    var xData = ['2015', '2016', '2017', '2018']

    var option1 = {
        legend: {
            icon: 'rect',
            itemWidth: 10,
            itemHeight: 10,
            data: ["预警企业", "处置企业", "案件移交"],
            //top:'40',
            textStyle: {
                color: "#fff"
            },
            right: 20,
            top: 5

        },
        color: ["#1ecb43", "#7a86fc", "#f918de"],
        tooltip: {
            show: true,
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'line'
            },
            textStyle: {
                padding: 30,
                color: "#fff"
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
            boundaryGap: true,
            data: xData,
            axisLabel: {
                color: "#7fc5ed"
            },
            axisLine: {
                lineStyle: {
                    color: '#175c81'
                }
            },
            axisTick: {
                color: '#fff'
            }
        },
        yAxis: {
            // name:'万元',
            type: 'value',
            boundaryGap: true,

            axisLabel: {
                color: "#7fc5ed"
            },
            splitLine: {
                show: true,
                lineStyle: {
                    color: '#104f6d',
                    type: 'dashed'
                }
            },
            axisLine: {
                lineStyle: {
                    color: '#175c81'
                }
            }
        },
        grid: {
            top: '10%',
            bottom: '20%'
        },
        series: [{
                name: '预警企业',
                data: [0, 0, 0, 0],
                type: 'line',
                smooth: true,
                symbolSize: 0,
                itemStyle: {
                    normal: {
                        lineStyle: {
                            width: 2,
                            color: '#1ecb43',
                            shadowBlur: 10,
                            shadowColor: '#1ecb43'
                        }
                    }
                }
            },
            {
                name: '处置企业',
                data: [10, 14, 12, 9],
                type: 'line',
                width: 3,
                symbolSize: 0,
                smooth: true,
                itemStyle: {
                    normal: {
                        lineStyle: {
                            width: 2,
                            color: '#7a86fc',
                            shadowBlur: 10,
                            shadowColor: '#7a86fc'
                        }
                    }
                }
            },
            {
                name: '案件移交',
                data: [0, 0, 0, 0],
                type: 'line',
                width: 3,
                symbolSize: 0,
                smooth: true,
                itemStyle: {
                    normal: {
                        lineStyle: {
                            width: 2,
                            color: '#f918de',
                            shadowBlur: 10,
                            shadowColor: '#f918de'
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
    success: function (data) {
        renderRiskCompanyData(data.pageData);
    }
});
var renderRiskCompanyData = function (data) {
    var html = '';
    $.each(data, function (index, item) {
        // 计算风险等级：高、中、低
        var riskLevelName;
        var riskLevel;
        var iconId;
        var riskIndex = parseInt(item.riskIndex)
        if (riskIndex >= 78) {
            riskLevelName = "高";
            riskLevel = 1;
            iconId = 'level1';
        } else if (riskIndex > 52 && riskIndex <= 77) {
            riskLevelName = "中";
            riskLevel = 2;
            iconId = 'level2';
        } else if (riskIndex > 0 && riskIndex <= 51) {
            riskLevelName = "低";
            riskLevel = 4;
            iconId = 'level4';
        } else if (riskIndex <= 100) {
            riskLevelName = '普';
            riskLevel = 3;
            iconId = 'level4';
        }

        // if (riskIndex > 0) {
        //     riskLevelName = "高";
        //     riskLevel = 2;
        //     iconId = 'level2';
        // }

        html += '<div class="item" riskLevel="' + riskLevel + '">';
        html += '<div class="icon-container" style="display:none">';
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

    $('#companyList .origin-border .item-container').html('<div class="body1">' + html + '</div>');
    // setScroll();
};

/**
 * 设置滚动效果
 */
var setScroll = function () {
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
    body.onmouseover = function () {
        clearInterval(MyMar);
    }

    body.onmouseout = function () {
        MyMar = setInterval(Marquee, speed);
    }
};

// 地图
$(function () {
    // 地图echart
    var map = echarts.init($('#map .map')[0])
    var t =new TimelineMax();
   
    var renderMap = function () {

        var mapJson;
        $.ajax({
            url: 'data/hainan.json',
            dataType: 'json',
            async: false,
            success: function (data) {
                mapJson = data;
            }
        });

        // echarts.registerMap('hainan', mapJson);


        renderMapChart();
        var refeshMap = setInterval(function () {
            renderMapChart();

        }, 200000);
    };
    var renderMapChart = function () {
        var riskData = [];
        var levelIcons = {
            low: './img/low.png',
            middle: './img/middle.png',
            high: './img/high.png'
        };
        $.ajax({
            url: 'data/mapData.json',
            dataType: 'json',
            async: false,
            success: function (data) {
                $.each(data, function (index, item) {
                    item.value = Math.round((item.Detection) / 36058 * 1000);

                    riskData.push(item);
                });
                // renderTooltip(data)

            }
        });
        map.setOption(option = {
            geo: {
                show: true,
                map: '海南',
                aspectScale: 1,
                regions: [{
                    name: '南海诸岛',
                    itemStyle: {
                        color: "red"
                    }
                }],
                label: {
                    normal: {
                        show: false
                    },
                    emphasis: {
                        show: true,
                    }
                },
                roam: false, //地图设置不可拖拽，固定的
                itemStyle: {
                    normal: {
                        areaColor: '#006fff',
                        borderWidth: 1,
                        shadowColor: 'rgba(29,92,171, 1)',
                        shadowBlur: 0,
                        shadowOffsetX: 10,
                        shadowOffsetY: 10
                    }
                }
            },
            tooltip: {
                backgroundColor: 'transparent',
                formatter: function (params) {
                   
                    return '<div style="width:360px;height:440px;background:url(img/tooltip-bg.png) center no-repeat;padding:30px 20px;position:relative;z-index:100">' +
                        '<h3 style="color:#fff;font-size:28px;padding:20px 0px 30px 30px;text-align:left;font-weight:normal;">' + params.name + '</h3>' +
                        '<div style="padding:20px 40px 5px 40px;overflow:hidden">' +
                        '    <span style="color:#fff;font-size:24px;float:left;">流入资金<small>(亿)</small>:</span>' +
                        '    <span style="font-size:28px;color:#fff;float:right;">' + params.data.inflow + '</span>' +
                        '</div>' +
                        '<div style="padding:20px 40px 5px 40px;overflow:hidden">' +
                        '    <span style="color:#fff;font-size:24px;float:left;">流出资金<small>(亿)</small>:</span>' +
                        '    <span style="font-size:28px;color:#fff;float:right;">' + params.data.outflow + '</span>' +
                        '</div>' +
                        '<div style="padding:20px 40px 5px 40px;overflow:hidden">' +
                        '    <span style="color:#fff;font-size:24px;float:left;">监管企业<small>(家)</small>:</span>' +
                        '    <span style="font-size:28px;color:#fff;float:right;">' + params.data.total + '</span>' +
                        '</div>' +
                        '<div style="padding:20px 40px 5px 40px;overflow:hidden">' +
                        '    <span style="color:#fff;font-size:24px;float:left;">监测企业<small>(家)</small>:</span>' +
                        '    <span style="font-size:28px;color:#fff;float:right;">' + params.data.Detection + '</span>' +
                        '</div>' +
                        '<div style="padding:20px 40px 5px 40px;overflow:hidden">' +
                        '    <span style="color:#fff;font-size:24px;float:left;">风险企业<small>(家)</small>:</span>' +
                        '    <span style="font-size:28px;color:#fff;float:right;">' + params.data.risk + '</span>' +
                        '</div>' +
                        '<div style="padding:20px 40px 5px 40px;overflow:hidden">' +
                        '    <span style="color:#fff;font-size:24px;float:left;">高风险企业<small>(家)</small>:</span>' +
                        '    <span style="font-size:28px;color:#fff;float:right;">' + params.data.highRisk + '</span>' +
                        '</div>' +
                        '</div>'

                }
            },
            toolbox: {
                show: false
            },
            visualMap: {
                show: false,
                min: 0,
                max: 200,
                text: ['风险等级高', '风险等级低'],
                realtime: false,
                calculable: true,
                inRange: {
                    color: ['#1c6dfe', '#003ef8', '#1226ad']
                },
                textGap: 10,
                itemHeight: 300,
                right: 100,
                bottom: 100,
                textStyle: {
                    fontSize: 24,
                    color: '#fff'
                }
            },
            series: [{
                type: 'map',
                mapType: '海南', // 自定义扩展图表类型
                aspectScale: 1,
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

                            if (params.data.highRisk > 1) {
                                var icon = 'high';
                                return params.name + '{' + icon + '|}';
                            } else if (params.data.risk >= 1 && params.data.highRisk <= 0) {
                                var icon = 'middle';
                                return params.name + '{' + icon + '|}';
                            } else if (params.data.risk == 0) {
                                // var icon = '';
                                // return params.name + '{' + icon + '|}';
                            }

                        },
                        position: 'inside',
                        padding: [4, 5],
                        textStyle: {
                            fontSize: 24,
                            color: '#fff'
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
                itemStyle: {
                    normal: { //未选中状态
                        // borderWidth:2,//边框大小
                        // borderColor:'#07c8ff',
                        label: {
                            show: true //显示名称
                        }
                    },
                    emphasis: { // 也是选中样式

                        areaColor: '#00e5d2',
                        label: {
                            show: true,

                        }
                    }
                    // normal:{label:{show:true}},
                    // emphasis:{label:{show:true}}
                },
                data: riskData
            }]
        });


        function renderTooltip(data) {
            var myTime = 0;

            var index = 0;

            function autoShowTip() {


                myTime = setInterval(function () {

                    for (var i = 0; i < data.length; i++) {

                        map.dispatchAction({

                            type: 'hideTip',

                            seriesIndex: 0,

                            dataIndex: i

                        })

                        map.dispatchAction({

                            type: 'mapUnSelect',

                            seriesIndex: 0,

                            dataIndex: i

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

                        type: "mapSelect",

                        seriesIndex: 0,

                        dataIndex: index

                    })

                    map.dispatchAction({

                        type: "showTip",

                        seriesIndex: 0,

                        dataIndex: index

                    })

                    index++;

                    if (index > data.length) {

                        index = 0;

                    }

                }, 5000)

            }

            autoShowTip();

            //        setMapActive(riskData);

            map.on('mousemove', function (params) {
                if (myTime) {

                    clearInterval(myTime);

                    myTime = 0;

                }
                for (var i = 0; i < data.length; i++) {

                    map.dispatchAction({

                        type: 'hideTip',

                        seriesIndex: 0,

                        dataIndex: i

                    })

                    map.dispatchAction({

                        type: 'mapUnSelect',

                        seriesIndex: 0,

                        dataIndex: i

                    })

                }

                map.dispatchAction({

                    type: 'showTip',

                    seriesIndex: 0,

                    dataIndex: params.dataIndex

                })

                map.dispatchAction({

                    type: 'mapSelect',

                    seriesIndex: 0,

                    dataIndex: params.dataIndex

                })

            })

            map.on('globalout', function () {

                for (var i = 0; i < data.length; i++) {

                    map.dispatchAction({

                        type: 'hideTip',

                        seriesIndex: 0,

                        dataIndex: i

                    })

                    map.dispatchAction({

                        type: 'mapUnSelect',

                        seriesIndex: 0,

                        dataIndex: i

                    })

                }
                if (!myTime) {

                    autoShowTip();


                }

            })
        }

    };

    renderMap();
})

//资金流变化趋势
$(function(){
    var barCharts = echarts.init(document.getElementById('barCharts'));
    var option = {
        grid:{
            top:'14%',
            left:'8%',
            right:'6%',
            bottom:'10%'
        },
        legend:{
            show:true,
            icon: 'rect',
            itemWidth: 15,
            itemHeight: 15,
            textStyle:{
                color:'#fff',
                fontSize:'14'
            },
            right:'10%'
        },
        xAxis: {
            data: ['2018-4', '2018-5', '2018-6', '2018-7', '2018-8'],
            axisLine: {
                lineStyle: {
                    color: '#0177d4'
                }
            },
            axisLabel: {
                color: '#01f3e1',
                fontSize: 14
            }
        },
        yAxis: {
            nameTextStyle: {
                color: '#fff',
                fontSize: 16
            },
            axisLine: {
                lineStyle: {
                    color: '#284fe6',
                }
            },
            axisLabel: {
                color: '#01f3e1',
                fontSize: 16
            },
            splitLine: {
                show:true,
                lineStyle: {
                    type:'dashed',
                    color: '#284fe6'
                }
            },
            interval:5,
            max:30
    
        },
        series: [{
            type: 'bar',
            name:'资金流入',
            barWidth: 18,
            itemStyle:{
                normal:{
                    barBorderRadius: [30,30,0,0],
                    color:new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: '#08ccd9'
                    }, {
                        offset: 0.8,
                        color: '#2675f1'
                    }], false)
                }
            },
            data: [14, 15, 18, 16, 17]
        },
        {
            type: 'bar',
            name:'资金流出',
            barWidth: 18,
            itemStyle:{
                normal:{
                    barBorderRadius: [30,30,0,0],
                    color:new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: '#e6ad1e'
                    }, {
                        offset: 0.8,
                        color: '#e5891d'
                    }], false)
                }
            },
            data: [5, 7, 8, 6, 7, 8, 6]
        }]
    };
    barCharts.setOption(option);

    

    // top10
    // $('#cashflow-toggle .roll__list li:first-child').click()
    $('.mask').on('click', function () {
        $('#cashflow-modal').fadeOut();
        $(this).fadeOut();
    });
    barCharts.on('click',function () {
        renderCashflowModal();

    })
    $('.supervision-number').on('click',function () {
        renderCashflowModal();

    })

    function renderCashflowModal() {
        $('.mask').fadeIn();
        $('#cashflow-modal').fadeIn();

        $('#cashflow-modal .origin-border .title-container .text span').text('资金流向');
        var config = [
            {
                name: "序号",
                key: "key1",
                width: "5%",
                class: "rank"
            },
            {
                name: "企业",
                key: "key2",
                width: "20%",
                class: "white"
            },
        
            {
                name: "当期回收金额",
                key: "key3",
                width: "15%",
                class: "blue"
            },
            {
                name: "融资金额",
                key: "key4",
                width: "20%",
                class: "blue"
            },
            {
                name: "当期发放金额",
                key: "key5",
                width: "20%",
                class: "blue"
            }

        ];
        $('#cashflow-toggle .roll__list li').on('click', function () {
            var code = $(this).data('code');
            $(this).addClass('active').siblings().removeClass('active')

            initTable1('#cashflow-modal .table-container', 'data/cashflowModal'+code+'.json', {
                code: ''
            }, config, true);
        })
        $('#cashflow-toggle .roll__list li:first-child').click()
       
    }
})
//p2p雷达图
$(function(){

    var circleChart1 = echarts.init($('.circleChart1')[0]);
    // var bigfonts = 24;
var nsum = 800;
var fontS = 20;
var dataAxis = [];
var radius = 50;
data = [{
        "color": "#01f3e1",
        "text": "融资变化率",
        "num": "134",
        "percent": 10,
    },
    {
        "color": "#01f3e1",
        "text": "现金流变化率",
        "num": "230",
        "percent": 30
    },
    {
        "color": "#01f3e1",
        "text": "利润变化率",
        "num": "136",
        "percent": 12
    },
    {
        "color": "#01f3e1",
        "text": "利率水平",
        "num": "49",
        "percent": 20
    },
    {
        "color": "#01f3e1",
        "text": "笔均金额",
        "num": "360",
        "percent": 30
    }
]


var option = {
    radar: [{
            indicator: data,
            radius: radius,
            startAngle: 126,
            splitNumber: 6,
            shape: 'circle',
            name: {
                textStyle: {
                    fontSize:'16'
                }
            },
            splitArea: {
                areaStyle: {
                    color: '	rgba(6,222,249,0.06)',
                    shadowBlur: 10
                }
            },
            axisLine: {
                lineStyle: {
                    color: '#0431d3'
                }
            },
            splitLine: {
                lineStyle: {
                    color: '#0431d3'
                }
            }
        },

    ],
    series: [{
        name: '雷达图',
        type: 'radar',
        symbolSize: 0,
        areaStyle: {
            normal: {
                color: '#29a0c2',
            },

            emphasis: {
                color: '#29a0c2',
            }
        },
        lineStyle: {
            normal: {
                color: '#0cc2c9',
                type: 'solid',
                width: 2
            },
            emphasis: {}
        },
        data: [{
            value: [34, 10, 36, 49, 60],
            label: {
                show: 'true',
            }
        }]
    }]
}

circleChart1.setOption(option);
})
//小贷雷达图
$(function(){

var circleChart2 = echarts.init($('.circleChart2')[0]);
    // var bigfonts = 24;
var nsum = 800;
var fontS = 12;
var dataAxis = [];
var radius = 50;
data = [{
    "color": "#01f3e1",
    "text": "融资变化率",
    "num": "134",
    "percent": 10
},
{
    "color": "#01f3e1",
    "text": "现金流变化率",
    "num": "230",
    "percent": 30
},
{
    "color": "#01f3e1",
    "text": "利润变化率",
    "num": "136",
    "percent": 12
},
{
    "color": "#01f3e1",
    "text": "利率水平",
    "num": "49",
    "percent": 20
},
{
    "color": "#01f3e1",
    "text": "笔均金额",
    "num": "360",
    "percent": 30
}
]



var option2 = {
    tooltip:{},
    radar: [{
            indicator: data,
            radius: radius,
            startAngle: 126,
            splitNumber: 6,
            shape: 'circle',
            name: {
                textStyle: {
                    fontSize:'16'
                }
            },
            splitArea: {
                areaStyle: {
                    color: '	rgba(6,222,249,0.06)',
                    shadowBlur: 10
                }
            },
            axisLine: {
                lineStyle: {
                    color: '#0431d3'
                }
            },
            splitLine: {
                lineStyle: {
                    color: '#0431d3'
                }
            }
        },

    ],
    series: [{
        name: '雷达图',
        type: 'radar',
        symbolSize: 0,
        areaStyle: {
            normal: {
                color: '#29a0c2',
            },

            emphasis: {
                color: '#29a0c2',
            }
        },
        lineStyle: {
            normal: {
                color: '#0cc2c9',
                type: 'solid',
                width: 2
            },
            emphasis: {}
        },
        data: [{
            value: [12, 24, 18, 34, 23],
            label: {
                show: 'true'
            }
        }]
    }]
}

circleChart2.setOption(option2);
})

//地方交易雷达图
$(function(){

    var circleChart3 = echarts.init($('.circleChart3')[0]);
    // var bigfonts = 24;
var nsum = 800;
var fontS = 12;
var dataAxis = [];
var radius = 50;
data = [{
    "color": "#01f3e1",
    "text": "融资变化率",
    "num": "134",
    "percent": 10
},
{
    "color": "#01f3e1",
    "text": "现金流变化率",
    "num": "230",
    "percent": 30
},
{
    "color": "#01f3e1",
    "text": "利润变化率",
    "num": "136",
    "percent": 12
},
{
    "color": "#01f3e1",
    "text": "利率水平",
    "num": "49",
    "percent": 20
},
{
    "color": "#01f3e1",
    "text": "笔均金额",
    "num": "360",
    "percent": 30
}
]



var option3 = {
    radar: [{
            indicator: data,
            radius: radius,
            startAngle: 126,
            splitNumber: 6,
            shape: 'circle',
            name: {
                textStyle: {
                    fontSize:'16'
                }
            },
            splitArea: {
                areaStyle: {
                    color: '	rgba(6,222,249,0.06)',
                    shadowBlur: 10
                }
            },
            axisLine: {
                lineStyle: {
                    color: '#0431d3'
                }
            },
            splitLine: {
                lineStyle: {
                    color: '#0431d3'
                }
            }
        },

    ],
    series: [{
        name: '雷达图',
        type: 'radar',
        symbolSize: 0,
        areaStyle: {
            normal: {
                color: '#29a0c2',
            },

            emphasis: {
                color: '#29a0c2',
            }
        },
        lineStyle: {
            normal: {
                color: '#0cc2c9',
                type: 'solid',
                width: 2
            },
            emphasis: {}
        },
        data: [{
            value: [23, 18, 30, 20, 16],
            label: {
                show: 'true'
            }
        }]
    }]
}

circleChart3.setOption(option3);
})

//雷达图4
$(function(){

    var circleChart4 = echarts.init($('.circleChart4')[0]);
    // var bigfonts = 24;
var nsum = 800;
var fontS = 12;
var dataAxis = [];
var radius = 50;
data = [{
    "color": "#01f3e1",
    "text": "融资变化率",
    "num": "134",
    "percent": 10
},
{
    "color": "#01f3e1",
    "text": "现金流变化率",
    "num": "230",
    "percent": 30
},
{
    "color": "#01f3e1",
    "text": "利润变化率",
    "num": "136",
    "percent": 12
},
{
    "color": "#01f3e1",
    "text": "利率水平",
    "num": "49",
    "percent": 20
},
{
    "color": "#01f3e1",
    "text": "笔均金额",
    "num": "360",
    "percent": 30
}
]



var option4 = {
    radar: [{
            indicator: data,
            radius: radius,
            startAngle: 126,
            splitNumber: 6,
            shape: 'circle',
            name: {
                textStyle: {
                    fontSize:'16'
                }
            },
            splitArea: {
                areaStyle: {
                    color: '	rgba(6,222,249,0.06)',
                    shadowBlur: 10
                }
            },
            axisLine: {
                lineStyle: {
                    color: '#0431d3'
                }
            },
            splitLine: {
                lineStyle: {
                    color: '#0431d3'
                }
            }
        },

    ],
    series: [{
        name: '雷达图',
        type: 'radar',
        symbolSize: 0,
        areaStyle: {
            normal: {
                color: '#29a0c2',
            },

            emphasis: {
                color: '#29a0c2',
            }
        },
        lineStyle: {
            normal: {
                color: '#0cc2c9',
                type: 'solid',
                width: 2
            },
            emphasis: {}
        },
        data: [{
            value: [12, 24, 16, 12, 24],
            label: {
                show: 'true'
            }
        }]
    }]
}

circleChart4.setOption(option4);
})
$(function () {
    var pagesLen = $('.circleChart-wrap li').length;
    var pageItemWidth = $('.circleChart-wrap li').width();
    var i = 0;
    var outerTimer;
    function moveLeft () {
        outerTimer = setInterval(function () {
            var sldieNum =  ++i&&(i==pagesLen)?i=0:i;
            $('.circleChart-wrap').animate({
                     left:-pageItemWidth*sldieNum
             },1000)
           
        },10000);
    }
    moveLeft();
    $('.circleChart-wrap').hover(function () {
        clearInterval(outerTimer)
    },function () {
        moveLeft()
    })
})
