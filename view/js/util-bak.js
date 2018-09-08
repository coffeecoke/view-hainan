/**
   加载地图：根据地图所在省市的行政编号，
   获取对应的json地图数据，然后向echarts注册该区域的地图
   最后加载地图信息
   @params {String} mapCode:地图行政编号,for example['中国':'100000', '湖南': '430000']
   @params {String} mapName: 地图名称
*/
function loadMap(mapCode, mapName, mapChart) {
    if(mapCode == 'china'){
        mapChart.setOption(mapOption, true);//mainMap要抽取
        curMap = {
            mapCode: mapCode,
            mapName: mapName
        };     
    }else{
        $.getJSON('china-main-city/' + mapCode + '.json', function (data) {
            if (data) {
                //向echarts插件注册地图
                echarts.registerMap(mapName, data);
                var option = {
                   tooltip: {
                       trigger: 'item',
                       formatter: '{b}'
                   },
                   series: [
                       {
                           name: '',
                           type: 'map',
                           mapType: mapName,
                           selectedMode : 'multiple',
                           label: {
                               normal: {
                                   show: true
                               },
                               emphasis: {
                                   show: true
                               }
                           },
                           zoom: 2,
                           data:[
                           ]
                       }
                   ]
                };
                mapChart.setOption(option, true);
                curMap = {
                   mapCode: mapCode,
                   mapName: mapName
                };     
            } else {
                alert('无法加载该地图');
            }       
       });
    }
}

function initWindow(){
    $('body').css('height', $(window).height());
    $('body').css('width', $(window).width());
}

var convertedData = [
    convertData(data),
    convertData(data.sort(function (a, b) {
        return b.value - a.value;
    }).slice(0, 6))//从大往小排
];

function convertData(data) {
    var res = [];
    for( var j = 0; j < 100; j++ ){
        for (var i = 0; i < data.length; i++) {
            var geoCoord = geoCoordMap[data[i].name];
  /*           geoCoord[0]+= Math.random() * 0.1;
            geoCoord[1]+= Math.random() * 0.1; */
            if (geoCoord) {
                res.push({
                    name: data[i].name,
                    value: geoCoord.concat(data[i].value)
                });
            }
        }
    }

    return res;
};

function renderBrushed(params) {
    var mainSeries = params.batch[0].selected[0]; //batch 为选中工具，此为数据，大多情况只有一个选中工具，selected 为数组，包括N个选中序列（series）。

    var selectedItems = [];
    var categoryData = [];
    var barData = [];
    var maxBar = 30;
    var sum = 0;
    var count = 0;

    for (var i = 0; i < mainSeries.dataIndex.length; i++) {
        var rawIndex = mainSeries.dataIndex[i];
        var dataItem = convertedData[0][rawIndex];
        var pmValue = dataItem.value[2];

        sum += pmValue;
        count++;

        selectedItems.push(dataItem);
    }

    selectedItems.sort(function (a, b) {
        return a.value[2] - b.value[2];
    });

    for (var i = 0; i < Math.min(selectedItems.length, maxBar); i++) {
        categoryData.push(selectedItems[i].name);
        barData.push(selectedItems[i].value[2]);
    }

    this.setOption({
        tooltip: {},
        series: [{
            id: 'bar',
            zlevel: 2,
            type: 'bar',
            symbol: 'none',
            itemStyle: {
                normal: {
                    color: 'rgb(26,168,255)'
                }
            },
            data: barData
        }],
        grid:{
            left: 55,
            right:55,
            top: 0
        },
        yAxis: {
            axisLabel: {show: !!count}
        },
        xAxis: {
            axisLabel:{
                color: '#fff',
                interval:0
            },
            data: categoryData
        },
        title: {
            id: 'statistic',
            text: count ? '分行平均交易额: ' + (sum / count).toFixed(4) + '亿（美元）': '',
            bottom: '0',
            left:'37%',
            textStyle:{
                color: '#FFF',
                fontWeight: 'bold'
            }
        }/* ,
        series: {
            id: 'bar',
            data: barData
        } */
    });
}