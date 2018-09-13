var mapBarOption = {
    tooltip: {},
    series: [{
        id: 'bar',
        zlevel: 2,
        type: 'bar',
        symbol: 'none',
        itemStyle: {
            normal: {
                color: '#ddb926'
            }
        },
        data: []
    }]
};

function mapBarInit(){
    setTimeout( function(){
        $('.middleColumn2').addClass('aniShow');
    } , 2500);
}