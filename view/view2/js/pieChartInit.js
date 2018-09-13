pieChartOption1 = {
    title:{
        text:'个人业务',
        left:'center',
        textStyle:{
            color:'#FFF',
            fontSize: 12
        }
    },
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)",
        position: 'right'
    },
    series: [
        {
            name:'个人业务占比',
            type:'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            hoverAnimation: true,
            label: {
                normal: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    show: true,
                    textStyle: {
                        color:'#FFF',
                        fontSize: '8'
                    }
                }
            },
            labelLine: {
                show: true,
                length: 1,
                length1: 2
            },
            data:[
                {value:335, name:'凤凰花卡'},
                {value:310, name:'投资理财'},
                {value:234, name:'储蓄存款'},
                {value:135, name:'个人贷款'}
            ]
        }
    ],
    color:['#1aa8ff', '#bda29a','#6e7074', '#546570', '#c4ccd3']
};

pieChartOption2 = {
    title:{
        text:'公司业务',
        left:'center',
        textStyle:{
            color:'#FFF',
            fontSize: 12
        }
    },
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
/*     legend: {
        orient: 'vertical',
        x: 'left',
        data:['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
    }, */
    series: [
        {
            name:'访问来源',
            type:'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            label: {
                normal: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    show: true,
                    textStyle: {
                        fontSize: '8'
                    }
                }
            },
            labelLine: {
                normal: {
                    show: false
                }
            },
            data:[
                {value:335, name:'存款业务'},
                {value:310, name:'信贷业务'},
                {value:234, name:'中间业务'},
                {value:135, name:'现金管理'},
                {value:1548, name:'国际业务'},
                {value:1548, name:'投行业务'},
            ]
        }
    ],
    color:['#1aa8ff', '#bda29a','#6e7074', '#546570', '#c4ccd3']
};


function pieChart1Init(){
    var pieChart1 = echarts.init(document.getElementById('pieChart1'));
    pieChart1.setOption(pieChartOption1);

    
    var currentIndex = -1;
    setInterval(function () {
        var dataLen = pieChartOption1.series[0].data.length;
        // 取消之前高亮的图形
        pieChart1.dispatchAction({
            type: 'downplay',
            //seriesName: '销量',
            //seriesIndex: 2,
            dataIndex: currentIndex
        });
        currentIndex = (currentIndex + 1) % dataLen;
        // 高亮当前图形
        pieChart1.dispatchAction({
            type: 'highlight',
            //seriesName: '销量',
            //seriesIndex: 2,
            dataIndex: currentIndex
        });
        // 显示 tooltip
        pieChart1.dispatchAction({
            type: 'showTip',
            //seriesName: '销量',
            //seriesIndex: 2,
            dataIndex: currentIndex
        });
    }, 2000);
}

function pieChart2Init(){
    var pieChart2 = echarts.init(document.getElementById('pieChart2'));
    pieChart2.setOption(pieChartOption2);
    
    var currentIndex = -1;
    setInterval(function () {
        var dataLen = pieChartOption2.series[0].data.length;
        // 取消之前高亮的图形
        pieChart2.dispatchAction({
            type: 'downplay',
            //seriesName: '销量',
            //seriesIndex: 2,
            dataIndex: currentIndex
        });
        currentIndex = (currentIndex + 1) % dataLen;
        // 高亮当前图形
        pieChart2.dispatchAction({
            type: 'highlight',
            //seriesName: '销量',
            //seriesIndex: 2,
            dataIndex: currentIndex
        });
        // 显示 tooltip
        pieChart2.dispatchAction({
            type: 'showTip',
            //seriesName: '销量',
            //seriesIndex: 2,
            dataIndex: currentIndex
        });
    }, 4000);
}