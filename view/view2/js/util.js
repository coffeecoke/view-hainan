/**
 * 渲染模块边框
 * @param {*} selecter 选择器
 */
var renderBlockBorder = function(selecter) {
    var html = "<div class='horn'>";
    html += "<div class='horn-icon horn-lt'></div>";
    html += "<div class='horn-icon horn-rt'></div>";
    html += "<div class='horn-icon horn-lb'></div>";
    html += "<div class='horn-icon horn-rb'></div>";
    html += "</div>";
    $(selecter).append(html);
};
/**
 * 渲染模块标题
 * @param {*} selecter 选择器
 * @param {*} title 标题内容
 */
var renderTitle = function(selecter, title) {
    var containerWidth = $(selecter)[0].offsetWidth;
    
    var html = "<div class='title-container'>";
    html += "<div class='title-container-horn title-container-lt'></div>";
    html += "<div class='title-container-horn title-container-rt'></div>";
    html += "<div class='title-container-horn title-container-rb'></div>";
    html += "<div class='title-container-horn title-container-lb'></div>";
    html += "<div class='background'></div>"
    html += "<div class='text'><span>" + title + "</span></div>"
    html += "</div>";
    $(selecter).append(html);
};

/**
 * 初始化表格框架
 * @param {*} selecter 选择器
 * @param {*} config 配置
 */
var renderTable = function(selecter, data, config) {
    
    var tHeader = "";
    var tBody = "";
    tHeader += "<thead>";
    tHeader += "<tr>";
    $.each(config, function(index, item) {
        tHeader += "<th data-key='" + item.key + "' width='" + item.width + "'>";
        tHeader += item.name;
        tHeader += "</th>";
    });
    tHeader += "</tr>";
    tHeader += "</thead>";
    tBody += "<tbody>";
    $.each(data, function(i, item){
        tBody += "<tr class='li'>";
        $.each(config, function(j, c) {
            var key = c.key;
            tBody += "<td width='" + c.width + "' class='" + (c.class || "") + "'>";
            tBody += item[key];
            tBody += "</td>";
        });
        
        tBody += "</tr>";
    });
    tBody += "</tbody>";
    var html = "";
    html += "<div class='tbl-header'><table>" + tHeader + "</table></div>";
    html += "<div class='tbl-body'><div class='body1 roll__list'><table>" + tBody + "<table></div></div>";
    $(selecter).html(html);
    $(selecter + ' .tbl-body').css('height', $(selecter + ' .tbl-body').parent().height() + 'px');

};

/**
 * 刷新数据
 * @param {*} url 
 */
var refreshTableData = function(url,param) {
    var result;
    $.ajax({
        url: url,
        data:param,
        dataType: 'json',
        async : false,
        success: function(data){
            result = data;
            $.each(result.pageData, function(index, item){
                // 设置一点变化
                var random = Math.floor(Math.random()*1000);
                item.contractAmount = random;
            });
        }
    });
    return result;
};

/**
 * 设置表格滚动效果
 * @param {*} selecter 选择器
 */
var setTableScroll = function(selecter) {
    $(selecter).rollNoInterval().top();
    // var speed = 50;
    // var body = $(selecter + ' .tbl-body')[0];
    // var body1 = $(selecter + ' .tbl-body .body1')[0];
    // var body2 = $(selecter + ' .tbl-body .body2')[0];
    // $(body2).html($(body).html());
    // function Marquee() {
    //     if (body2.offsetTop - body.scrollTop <= 0) {
    //         body.scrollTop -= body1.offsetHeight;
    //     } else {
    //         body.scrollTop++;
    //     }
    // }
  
    // var MyMar = setInterval(Marquee, speed);
    //clearInterval(MyMar);
    // body.onmouseover = function() {
    //     clearInterval(MyMar);
    // }
    
    // body.onmouseout = function() {
    //     MyMar = setInterval(Marquee, speed);
    // }
    // return MyMar;
};

var initTable = function(selecter, url, param, config) {
    param = $.extend({curPage : 1,pageNum : 500},param);
    var data= refreshTableData(url,param);
    var dataCount = data.dataCount;
    renderTable(selecter, data.pageData, config);
    setTableScroll(selecter);

    // return setInterval(function(){ // 每隔10分钟请求一次
    //     var pageCount = Math.ceil(dataCount/param.pageNum);
    //     param.curPage = (param.curPage < pageCount) ? param.curPage + 1 : 1;
    //     data= refreshTableData(url,param);
    //     renderTable(selecter, data.pageData, config);
    //     setTableScroll(selecter);
    // },10000);
};

var indexIconMap = {
    '01-01':'indexIcon01',
    '01-02':'indexIcon02',
    '01-03':'indexIcon03',
    '01-04':'indexIcon04',
    '01-05':'indexIcon05',
    '01-06':'indexIcon06',
    '01-07':'indexIcon07',
    '01-08':'indexIcon08',
    '01-09':'indexIcon09',
    '02-01':'indexIcon01',
    '02-02':'indexIcon06',
    '02-03':'indexIcon10',
    '02-04':'indexIcon04',
    '02-05':'indexIcon07',
    '02-06':'indexIcon03',
    '02-07':'indexIcon11',
    '02-08':'indexIcon12',
    '02-09':'indexIcon13',
    '03-01':'indexIcon01',
    '03-02':'indexIcon06',
    '03-03':'indexIcon04',
    '03-04':'indexIcon14',
    '03-05':'indexIcon15',
    '03-06':'indexIcon16',
    '03-07':'indexIcon17',
    '03-08':'indexIcon12',
    '03-09':'indexIcon18',
    '04-01':'indexIcon01',
    '04-02':'indexIcon06',
    '04-03':'indexIcon04',
    '04-04':'indexIcon14',
    '04-05':'indexIcon15',
    '04-06':'indexIcon16',
    '04-07':'indexIcon17',
    '04-08':'indexIcon12',
    '04-09':'indexIcon18',
    '05-01':'indexIcon01',
    '05-02':'indexIcon06',
    '05-03':'indexIcon04',
    '05-04':'indexIcon10',
    '05-05':'indexIcon11',
    '05-06':'indexIcon19',
    '05-07':'indexIcon20',
    '05-08':'indexIcon12',
    '05-09':'indexIcon18',
    '06-01':'indexIcon01',
    '06-02':'indexIcon06',
    '06-03':'indexIcon03',
    '06-04':'indexIcon04',
    '06-05':'indexIcon21',
    '06-06':'indexIcon11',
    '06-07':'indexIcon12',
    '06-08':'indexIcon07',
    '06-09':'indexIcon18',
    '07-01':'indexIcon01',
    '07-02':'indexIcon06',
    '07-03':'indexIcon04',
    '07-04':'indexIcon10',
    '07-05':'indexIcon22',
    '07-06':'indexIcon11',
    '07-07':'indexIcon12',
    '07-08':'indexIcon07',
    '07-09':'indexIcon18',
    '08-01':'indexIcon01',
    '08-02':'indexIcon06',
    '08-03':'indexIcon04',
    '08-04':'indexIcon10',
    '08-05':'indexIcon07',
    '08-06':'indexIcon23',
    '08-07':'indexIcon24',
    '08-08':'indexIcon25',
    '08-09':'indexIcon18',
    '09-01':'indexIcon01',
    '09-02':'indexIcon06',
    '09-03':'indexIcon04',
    '09-04':'indexIcon26',
    '09-05':'indexIcon07',
    '09-06':'indexIcon27',
    '09-07':'indexIcon28',
    '09-08':'indexIcon29',
    '09-09':'indexIcon18'
};



/**
 * 渲染指标数据
 * @param {*} selecter 选择器
 * @param {*} data 数据
 * @param {*} max 最大值
 */
var renderIndexData = function(selecter, data, max) {
    // 渲染数据
    var html = '';
    for(var i=0; i<data.length && i<max; i++) {
        html += '<div name="indexItem">';
        html += '<div class="image">';
        html += '<div class="icon">';
        html += '<div class="background"></div>';
        html += $('#allIcon [name=' + indexIconMap[data[i].code] + ']').prop("outerHTML");
        html += '</div>';
        html += '</div>';
        html += '<div class="text">';
        html += '<div name="value">';
        html += data[i].value;
        html += '</div>';
        html += '<div name="name">';
        html += data[i].name;
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
    }
    $(selecter).html(html);
};


var rotateYDIV = function(config){
    config.beforeRotate && config.beforeRotate();
    var rotYINT;
    var startYRotate = function($obj) {
        var rotateY = $obj.data('rotateY');
        if(!rotateY) {
            rotateY = 0;
        }
        rotateY=rotateY+3;
        if(rotateY === 90){
            config.inRotate && config.inRotate();
        }
        if(rotateY >= 180) {
            rotateY=0;
            clearInterval(rotYINT);
            config.afterRotate && config.afterRotate();
        }
        $obj.data('rotateY',rotateY);
        $obj.css({
            'transform':'rotateY(' + rotateY + 'deg)',
            'webkitTransform':'rotateY(' + rotateY + 'deg)',
            'OTransform':'rotateY(' + rotateY + 'deg)',
            'MozTransform':'rotateY(' + rotateY + 'deg)'
        });
    };
    
    clearInterval(rotYINT);
    rotYINT = setInterval(function(){
        startYRotate(config.$obj);
       
    },1);
};

var industry = [
    {name:'P2P',code:'01'},
    {name:'小额贷款公司',code:'02'},
    {name:'各类交易场所',code:'03'},
    {name:'股权交易',code:'04'},
    {name:'融资担保',code:'05'},
    {name:'典当行',code:'06'},
    {name:'融资租赁公司',code:'07'},
    {name:'商业保理公司',code:'08'},
    {name:'地方融资公司',code:'09'},
    {name:'农村合作组织',code:'10'}
];

var getNameByCode = function() {
    var result = {};
    $.each(industry, function(index, item) {
        result[item.code] = item.name;
    });
    return result;
};

