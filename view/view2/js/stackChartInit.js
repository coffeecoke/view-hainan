stackChartOption = {
    title: {
        text: '各区域交易额即时趋势',
        textStyle:{
            color: '#FFF',
            fontWeight: 'bold'
        },
        left:'center'
    },
/*     tooltip : {
        trigger: 'axis',
        axisPointer: {
            type: 'cross',
            label: {
                backgroundColor: '#6a7985'
            }
        }
    }, */
    legend: {
        data:['北京','纽约','东京','孟买','香港'],
        textStyle:{
            color: '#fff',
            fontWeight: 'bold'
        },
        itemGap:15,
        top:30
    },
    color:['#1aa8ff', '#bda29a','#6e7074', '#546570', '#c4ccd3'],
    label:{
        show:false
    },
    smooth:true,//?
    markPoint:'triangle',//?
    toolbox: {
        feature: {
            saveAsImage: {}
        }
    },
    grid: {
        left: '0%',
        right: '0%',
        bottom: '10%',
        containLabel: true
    },
    xAxis : [
        {
            type : 'category',
            boundaryGap : false,
            data : ['20:10','20:11','20:12','20:13','20:14','20:15','20:16'],
            axisLine :{
                show:false,
                lineStyle:{
                    color: '#FFF'
                },
                width:0
            },
            axisTick:{
                show:false
            },
            splitLine:{
                show:false
            }
        }
    ],
    yAxis : [
        {
            type : 'value',
            show: false,
            axisLine :{
                show:false,
                lineStyle:{
                    color: '#FFF'
                }
            },
            axisTick:{
                show:false
            },
            splitLine:{
                show:false
            }
        }
    ],
    series : [
        {
            name:'北京',
            type:'line',
            stack: '总量',
            areaStyle: {normal: {}},
            symbol:'roundRect',
            data:[120, 132, 101, 134, 90, 230, 210]
        },
        {
            name:'纽约',
            type:'line',
            stack: '总量',
            areaStyle: {normal: {}},
            symbol:'roundRect',
            data:[220, 182, 191, 234, 290, 330, 310]
        },
        {
            name:'东京',
            type:'line',
            stack: '总量',
            areaStyle: {normal: {}},
            symbol:'roundRect',
            data:[150, 232, 201, 154, 190, 330, 410]
        },
        {
            name:'孟买',
            type:'line',
            stack: '总量',
            areaStyle: {normal: {}},
            symbol:'roundRect',
            data:[320, 332, 301, 334, 390, 330, 320]
        },
        {
            name:'香港',
            type:'line',
            stack: '总量',
            label: {
                normal: {
                    show: true,
                    position: 'top'
                }
            },
            areaStyle: {normal: {}},
            symbol:'roundRect',
            data:[820, 932, 901, 934, 1290, 1330, 1320]
        }
    ]
};

function stackChartInit(){
    var stackChart = echarts.init(document.getElementById('stackChart'));
    stackChart.setOption(stackChartOption);
    setTimeout( function(){
        $('.leftColumn2').addClass('aniShow');
    } , 1500);
    var currentIndex = -1;
    setInterval(function () {
        var dataLen = stackChartOption.series[0].data.length;
        // 取消之前高亮的图形
        stackChart.dispatchAction({
            type: 'downplay',
            //seriesName: '销量',
            //seriesIndex: 2,
            dataIndex: currentIndex
        });
        currentIndex = (currentIndex + 1) % dataLen;
        // 高亮当前图形
        stackChart.dispatchAction({
            type: 'highlight',
            //seriesName: '销量',
            //seriesIndex: 2,
            dataIndex: currentIndex
        });
        // 显示 tooltip
        stackChart.dispatchAction({
            type: 'showTip',
            //seriesName: '销量',
            //seriesIndex: 2,
            dataIndex: currentIndex
        });
    }, 1000);
}
