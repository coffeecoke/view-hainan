$(function () {
    var indexChangeChart =echarts.init(document.getElementById('indexChangeChart'));

    // tab切换
    $('#item-toggle').rollSlide({
        orientation: 'left',
        num: 1,
        v: 1000,
        space: 3000,
        isRoll: false
    });
    $('#item-toggle .roll__list li').on('click',function () {
        var code = $(this).data('code');
        $(this).addClass('active').siblings().removeClass('active')
    })
    // top10
    initTop10('data/top10-01.json')
    initTop10Chart('data/indexChangeData.json')

    function initTop10(url) {
        $.ajax({
            url: url,
            dataType: 'json',
            success: function (data) {
                var htmls = "";
                $.each(data, function (indx, item) {
                    htmls += '<li class="li-1">' +
                        '<dl>' +
                        '  <dt>' + item.name + '</dt>' +
                        '   <dd>' + item.value + '</dd>' +
                        '</dl>' +
                        '</li>'

                })
                $('#top10 .roll__list').html('').append(htmls);
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


})