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
        initTop10Chart('data/indexChangeData'+code+'.json')
        $(this).addClass('active').siblings().removeClass('active')
    })

    // top10

    initTop10('data/top10-01.json')
    initTop10Chart('data/indexChangeData01.json')

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
                        show:false,
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
                            symbol: 'none',
                            itemStyle: {
                                normal: {
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
            riskData.push({name:key, value:rate});
        });
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
                    radius : ['30%','40%'],
                    center: ['50%', '50%'],
                    color:['#E13848','#E7773A','#EAC82B','#3A73C9'],
                    data:riskData,
                    label: {
                        textStyle: {
                            fontSize: 24
                        },
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
})