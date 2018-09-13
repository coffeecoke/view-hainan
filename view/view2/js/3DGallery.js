var rotatePhos = (function () {
    var util = {
        $: function (sId) { 
            return $('#' + sId); 
        },
        $$: function (itemSelecter) { 
            return $(itemSelecter); 
        },
        addEventHandler: function (elem, type, handler) {
            console.log('addEventHandler');
            if (elem.addEventListener) {
                elem.addEventListener(type, handler, false);
            }
            else {
                elem.attachEvent("on" + type, handler);
            }
        },
        removeEventHandler: function (elem, type, handler) {
            console.log('removeEventHandler');
            if (elem.removeEventListener) {
                elem.removeEventListener(type, handler, false);
            }
            else {
                elem.detachEvent("on" + type, handler);
            }
        },
        getComputedStyle: function (elem) {
            console.log('getComputedStyle');
            if (elem.currentStyle)
                return elem.currentStyle;
            else {
                return document.defaultView.getComputedStyle(elem, null);
            }
        },
        emptyFunction: function () { },
        getElementsByClassName: function (className, parentElement) {
            console.log('getElementsByClassName');
            var elems = (parentElement || document.body).getElementsByTagName("*");
            var result = [];
            for (i = 0; j = elems[i]; i++) {
                if ((" " + j.className + " ").indexOf(" " + className + " ") != -1) {
                    result.push(j);
                }
            }
            return result;
        },
        extend: function (destination, source) {
            console.log('extend');
            for (var name in source) {
                destination[name] = source[name];
            }
            return destination;
        }
    };
    var rp = function (id, options) {
        console.log('rp');
        this.init(id, options); //初始化 
    }
    rp.prototype = (function () {
        console.log('prototype');
        var rotate;
        var imgWidth;
        var imgHeight;
        var scaleMargin;
        var con;
        var handler;
        var Tween = {//缓动类 默认提供三种缓动模式：linear easein easeout 
            linear: function (t, b, c, d, dir) { return c * t / d * dir + b; },
            easeIn: function (t, b, c, d, dir) {
                return c * (t /= d) * t * dir + b;
            },
            easeOut: function (t, b, c, d, dir) {
                return -c * (t /= d) * (t - 2) * dir + b;
            }
        };
        /* 改变椭圆旋转轨迹的横半轴长，竖半轴长*/
        var changeRotateWH = function (width, height) {
            console.log('changeRotateWH');
            var halfScale = (this.maxScale - this.minScale) / 2; //旋转到中间位置时的图片的缩放大小 
            rotate = {};
            rotate.originX = width / 2; //旋转原点X轴坐标 
            rotate.originY = height / 2; //旋转原点Y轴坐标 
            rotate.halfRotateWidth = (width - this.imgWidth) / 2; //旋转横半轴长 
            rotate.halfRotateHeight = (height - this.imgHeight) / 2; //旋转竖半轴长 
        }
        /* 设置图片旋转角和初始位置，大小 */
        var initImgRC = function ($items) {
            console.log('initImgRC');
            var len = $items.length;
            con = (2 * Math.PI) / len;
            
            for(var i=0; i<$items.length; i++) {
                $items[i].RC = i * con;

                //console.log('i===>' +  $items[i].RC);

                // $items.eq(i).css({
                //     'width' : imgWidth + 'px',
                //     'height' : imgHeight + 'px'
                // });
                setImgPositionAndSize($($items[i]), 0);
            }
            
        }
        /* 设置图片大小 */
        var setImgSize = function ($item) {   //$item
            console.log('setImgSize');
            var left = rotate.originX + rotate.halfRotateWidth * Math.cos($item[0].RC) - imgWidth / 2;
            var top = rotate.originY - rotate.halfRotateHeight * Math.sin($item[0].RC) - imgHeight / 2;
            var scale = 0.2 + scaleMargin * (rotate.halfRotateHeight - rotate.halfRotateHeight * Math.sin($item[0].RC)) / (2 * rotate.halfRotateHeight); //图片在该时刻的缩放比 
            $item.css({
                'position' : 'absolute',
                'left' : left + 'px',
                'top' : top + 'px',
                'transform' : 'scale('+scale+')',
                // 'width' : imgWidth * scale + 'px',
                // 'height' : imgHeight * scale + 'px',
                'z-index' : Math.round(scale * 100)
            });
        }
        /* 设置图片位置和大小的匀速变化 */
        var setImgPositionAndSize = function ($item, path, direction) {
            console.log('setImgPositionAndSize');
            direction = direction || 'CW';
            var dir = direction == 'CW' ? -1 : 1;
            //console.log('path-->' + path);
            //console.log('dir-->' + dir);
            //console.log('RC1-->' +  $item[0].RC);
            $item[0].RC += (path * dir);
            //console.log('RC2-->' +  $item[0].RC);
            modifyImgAngle($item);
            setImgSize($item);
        }
        /* 修改图片旋转角度（保证在0-2pai之间） */
        var modifyImgAngle = function ($item) {
            console.log('modifyImgAngle');
            ($item[0].RC > (2 * Math.PI)) && ($item[0].RC -= 2 * Math.PI);
            ($item[0].RC < 0) && ($item[0].RC += 2 * Math.PI);
        }
        /* 设置图片的新位置 */
        var setPos = function ($item, path) {
            console.log('setPos');
            $item[0].RC = path;
            modifyImgAngle($item);
            var left = rotate.originX + rotate.halfRotateWidth * Math.cos($item[0].RC) - imgWidth / 2;
            var top = rotate.originY - rotate.halfRotateHeight * Math.sin($item[0].RC) - imgHeight / 2;
            var scale = 0.1 + scaleMargin * (rotate.halfRotateHeight - rotate.halfRotateHeight * Math.sin(img.RC)) / (2 * rotate.halfRotateHeight); //图片在该时刻的缩放比 
            
            $item.css({
                'position' : 'absolute',
                'left' : left + 'px',
                'top' : top + 'px',
                'transform' : 'scale('+scale+')',
                // 'width' : imgWidth * scale + 'px',
                // 'height' : imgHeight * scale + 'px',
                'z-index' : Math.round(scale * 100)
            });
        }
        /* 旋转指定角度 */
        var rotateAngle = function ($items, angle, dir, tween, onSelected) {
            console.log('rotateAngle');
            var duration = 1000;
            var startTime = (new Date()).getTime();
            dir == 'CW' ? dir = -1 : dir = 1;
            for (var i = 0, len = $items.length; i < len; i++) {
                $items[i].startAngle = $items[i].RC;
            }
            timeId = window.setInterval(function () {
                var now = (new Date()).getTime();
                if ((now - startTime) >= duration) {
                    window.clearInterval(timeId);
                    timeId = undefined;
                    onSelected = onSelected || util.emptyFunction;
                    onSelected(); //触发回调函数; 
                }
                for (var i = 0, len = $items.length; i < len; i++) {
                    var path = tween(now - startTime, $items[i].startAngle, angle, duration, dir); //通过缓动公式计算新角度（RC） 
                    setPos($items[i], path, dir);
                }
            }, 20);
        }
        /* 图片选择事件处理程序 */
        var imgSelectedHandler = function ($items, path, tween, onSelected) {
            console.log('imgSelectedHandler');
            return function (eve) {
                eve = eve || window.event;
                var dir;
                var angle;
                var target = eve.target || eve.srcElement;
                var RC = target.RC;
                if (RC >= Math.PI / 2 && RC <= Math.PI * 3 / 2) {
                    dir = 'ACW';
                    angle = 3 * Math.PI / 2 - RC;
                }
                else {
                    dir = 'CW';
                    Math.sin(RC) >= 0 ? angle = Math.PI / 2 + RC : angle = RC - 3 * Math.PI / 2;
                }
                (typeof timeId != 'undefined') && window.clearInterval(timeId);
                rotateAngle($items, angle, dir, tween, onSelected);
            }
        }
        /* 为图片绑定点击事件处理程序 */
        var bindHandlerForImgs = function ($items, path, onSelected) {
            console.log('bindHandlerForImgs');
            for (var i = 0, len = $items.length; i < len; i++) {
                $items[i].handler = imgSelectedHandler($items, path, onSelected);
                util.addEventHandler($items[i], 'click', $items[i].handler);
            }
        }
        /* 删除图片上的点击事件处理程序 */
        var removeImgsHandler = function ($items) {
            console.log('removeImgsHandler');
            for (var i = 0, len = $items.length; i < len; i++) {
                if ($items[i].handler) {
                    util.removeEventHandler($items[i], 'click', $items[i].handler);
                }
            }
        }
        return {
            /* 初始化 */
            init: function (id, options) {
                console.log('init');
                var defaultOptions = {
                    width: 1750, //容器宽 
                    height: 800, //容器高 
                    imgWidth: 375, //图片宽 
                    imgHeight: 430, //图片高 
                    maxScale: 1.5, //最大缩放倍数 
                    minScale: 0.5, //最小缩放倍数 
                    rotateSpeed: 10 //运转速度 
                }
                options = util.extend(defaultOptions, options); //参数设置 
                this.$container = util.$(id);
                this.width = options.width;
                this.height = options.height;
                imgWidth = this.imgWidth = options.imgWidth;
                imgHeight = this.imgHeight = options.imgHeight;
                this.maxScale = options.maxScale;
                this.minScale = options.minScale;
                scaleMargin = this.maxScale - this.minScale;
                this.rotateSpeed = options.rotateSpeed;
                this.$items = util.$$('#industryIcon .icon-item');
                this.setContainerSize(this.width, this.height);
                initImgRC(this.$items);
            },
            /* 设置容器尺寸 */
            setContainerSize: function (width, height) {
                console.log('setContainerSize');
                width = width || this.width;
                height = height || this.height;
                this.$container.css({
                    'position' : 'relative',
                    'width' : width + 'px',
                    'height' : height + 'px'
                });
                changeRotateWH.call(this, width, height); //改变容器尺寸后改变旋转轨迹 
            },
            /* 选择上一幅图片 */
            prePho: function (onSelected) {
                console.log('prePho');
                if (this.pattern == 'hand') {
                    onSelected = onSelected || util.emptyFunction;
                    var tween = tween || Tween['easeOut'];
                    if (typeof timeId != 'undefined') {
                        return;
                    } else {
                        rotateAngle(this.$items, con, 'ACW', tween, onSelected);
                    }
                }
            },
            /* 选择下一幅图片 */
            nextPho: function (onSelected) {
                console.log('nextPho');
                if (this.pattern == 'hand') {
                    onSelected = onSelected || util.emptyFunction;
                    var tween = tween || Tween['easeOut'];
                    if (typeof timeId != 'undefined') {
                        return;
                    } else {
                        rotateAngle(this.$items, con, 'CW', tween, onSelected);
                    }
                }
            },
            /* 添加缓动模式 */
            addTweenFunction: function (name, func) {
                console.log('addTweenFunction');
                if (typeof func == 'Function' || typeof func == 'Object') {
                    Tween[name] = func;
                }
            },
            /* 设置旋转模式（自动/手动）*/
            setPattern: function (patternName, option) {
                console.log('setPattern');
                option = option || {};
                this.pattern = patternName;
                var rotateSpeed = option.rotateSpeed || 10;
                this.path = Math.PI / 1000 * rotateSpeed;
                (typeof timeId != 'undefined') && window.clearInterval(timeId);
                if (patternName === 'auto') {//自动模式 可传入旋转方向：option.rotateDir 旋转速度：option.rotateSpeed 
                    var self = this;
                    var direction = option.rotateDir || 'CW'; //顺时针：CW 逆时针：ACW 
                    removeImgsHandler(this.$items);
                    timeId = window.setInterval(function () {
                        for (var i = 0, len = self.$items.length; i < len; i++) {
                            setImgPositionAndSize(self.$items.eq(i), self.path, direction);
                        }
                    }, 20);
                }
                else if (patternName === 'hand') {//手动模式，可传回调函数：option.onSelected 缓动模式：option.tween 
                    var onSelected = option.onSelected || util.emptyFunction;
                    var tween = Tween[tween] || Tween['easeOut']; //缓动模式默认为easeout 
                    removeImgsHandler(this.$items);
                    (typeof timeId != 'undefined') && window.clearInterval(timeId);
                    timeId = undefined;
                    bindHandlerForImgs(this.$items, this.path, tween, onSelected);
                }
            }
        }
    })();
    return rp;
})();


