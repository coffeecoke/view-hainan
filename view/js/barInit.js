 var barOption = {
    title: {
        text: '厦门国际银行全球交易额总量',
        textStyle:{
            color: '#FFF',
            fontWeight: 'bold'
        },
        left:'center'
    },
    tooltip: {},
    legend: {
        data:['印度','欧洲','东南亚','拉丁美洲','北美'],
        orient: 'vertical',
        left: 310,
        top: 70,
        itemGap: 20,
        textStyle:{
            color: '#FFF',
            fontWeight: 'bold'
        }
    },
    label:{
        show:false
    },
    series: [{
        name: '交易额总量',
        type: 'pie',
        label: {
            normal: {
                show: false,
                position: 'center'
            }
        },
        radius: ['50%', '70%'],
/*         itemStyle: {
            normal: {
                color: '#c23531',
                shadowBlur: 200,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
        }, */
        data: [                
                {value:335, name:'印度'},
                {value:310, name:'欧洲'},
                {value:234, name:'东南亚'},
                {value:135, name:'拉丁美洲'},
                {value:1548, name:'北美'}
        ]
    }],
    color:['#1aa8ff', '#bda29a','#6e7074', '#546570', '#c4ccd3']
};

function fakePicInit(){
    var fakePic = echarts.init(document.getElementById('fakePic'));
    fakePic.setOption(barOption);
    setTimeout( function(){
        $('.leftColumn1').addClass('aniShow');
    } , 1000);
    var currentIndex = -1;
    setInterval(function () {
        var dataLen = barOption.series[0].data.length;
        // 取消之前高亮的图形
        fakePic.dispatchAction({
            type: 'downplay',
            //seriesName: '销量',
            seriesIndex: 0,
            dataIndex: currentIndex
        });
        currentIndex = (currentIndex + 1) % dataLen;
        // 高亮当前图形
        fakePic.dispatchAction({
            type: 'highlight',
            //seriesName: '销量',
            seriesIndex: 0,
            dataIndex: currentIndex
        });
        // 显示 tooltip
        fakePic.dispatchAction({
            type: 'showTip',
            //seriesName: '销量',
            seriesIndex: 0,
            dataIndex: currentIndex
        });
    }, 1000);
    
}

