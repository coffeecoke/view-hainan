window.ProgressUtil={};
window.BezierCurveUtil={};
(function (global,exports, _bezierCurve) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _bezierCurve2 = _interopRequireDefault(_bezierCurve);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _possibleConstructorReturn(self, call) {
        if (!self) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }

        return call && (typeof call === "object" || typeof call === "function") ? call : self;
    }

    function _inherits(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }

        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

    var Def_Colors = {
            MainColor: '#00cccc',
            HaloColor: '#006677',
            BackgroundColor: '#003030',
            Dark: '#000'
        },
        ProgressType = {
            Line: 'line',
            Shield: 'shield',
            Circle: 'circle'
        };

    var _def_opts = {
        type: '',
        width: '',
        height: '',
        wrapDom: undefined,
        colors: {},
        minVal: undefined,
        maxVal: undefined,
        curVal: undefined,
        onChangeHandler: undefined
    };

    var ProgressCanvas = function () {
        function ProgressCanvas(opts) {
            _classCallCheck(this, ProgressCanvas);

            this.options = _.extend({}, _def_opts, opts);
            this.wrapDom = this.options.wrapDom;
            this.type = this.options.type;
            this.canvas = undefined;
            this.context = undefined;
            this.progress = undefined;
            this.__init();
        }

        _createClass(ProgressCanvas, [{
            key: '__init',
            value: function __init() {
                var me = this,
                    opts = me.options;
                if (me.wrapDom && opts.width && opts.height && _.isString(me.type)) {
                    var canvas = document.createElement('canvas');
                    canvas.width = opts.width;
                    canvas.height = opts.height;
                    me.canvas = canvas;
                    me.wrapDom.appendChild(me.canvas);
                    me.context = canvas.getContext('2d');
                    me.options.ctx = me.context;
                    switch (me.type) {
                        case ProgressType.Circle:
                            me.progress = new CircleProgress(me.options);
                            break;
                        case ProgressType.Shield:
                            me.progress = new ShieldProgress(me.options);
                            break;
                        case ProgressType.Line:
                        default:
                            me.progress = new LineProgress(me.options);
                            break;
                    }
                } else {
                    throw 'Cannot init ProgressCanvas, please check arguments!';
                }
                return me;
            }
        }, {
            key: 'clearCanvas',
            value: function clearCanvas() {
                if (this.progress) {
                    this.progress.clearCanvas();
                }
            }
        }, {
            key: 'render',
            value: function render() {
                if (this.progress) {
                    this.progress.render();
                }
            }
        }, {
            key: 'update',
            value: function update(val) {
                if (this.progress) {
                    this.progress.updateVal(val);
                }
            }
        }]);

        return ProgressCanvas;
    }();

    ProgressCanvas.ProgressType = ProgressType;

    var _def_base_opts = {
        showBackground: false,
        gradientType: 'radian', // radian or linear or none
        bgColors: [{
            stop: 0,
            color: Def_Colors.BackgroundColor
        }, {
            stop: 1,
            color: Def_Colors.Dark
        }], //  array or string
        lineWidth: 5,
        lineCap: 'round',
        useGradient: false,
        lineColors: Def_Colors.MainColor, //  array or string
        showShadow: true,
        shadowBlur: 8,
        shadowColor: Def_Colors.HaloColor
    };

    var BaseProgress = function () {
        function BaseProgress(opts) {
            _classCallCheck(this, BaseProgress);

            this.options = _.extend({}, _def_base_opts, opts);
            this.ctx = opts.ctx;
            this.width = opts.width;
            this.height = opts.height;
            this.curVal = opts.curVal || 0;
            this.minVal = opts.minVal || 0;
            this.maxVal = opts.maxVal || 100;
            this.mainColor = opts.mainColor || Def_Colors.MainColor;
        }

        _createClass(BaseProgress, [{
            key: '__drawBase',
            value: function __drawBase() {
                var me = this,
                    opts = me.options,
                    ctx = me.ctx;
                if (ctx && me.width && me.height) {
                    this.clearCanvas();
                    var lineGradient = void 0,
                        bgGradient = void 0,
                        center_x = me.width / 2,
                        center_y = me.height / 2,
                        minSize = Math.min(center_x, center_y);
                    if ('radian' === opts.gradientType) {
                        bgGradient = ctx.createRadialGradient(center_x, center_y, 5, center_x, center_y, minSize);
                        lineGradient = ctx.createRadialGradient(center_x, center_y, 5, center_x, center_y, minSize);
                    } else if ('linear' === opts.gradientType) {
                        bgGradient = ctx.createLinearGradient(0, 0, 0, me.width);
                        lineGradient = ctx.createLinearGradient(0, 0, 0, me.width);
                    }
                    // background
                    if (opts.showBackground && opts.bgColors) {
                        if (_.isString(opts.bgColors)) {
                            ctx.fillStyle = opts.bgColors;
                        } else if (bgGradient && _.isArray(opts.bgColors) && opts.bgColors.length) {
                            opts.bgColors.forEach(function (item) {
                                bgGradient.addColorStop(item.stop, item.color);
                            });
                            ctx.fillStyle = bgGradient;
                        } else {
                            ctx.fillStyle = Def_Colors.BackgroundColor;
                        }
                        ctx.fillRect(0, 0, me.width, me.height);
                    }
                    ctx.lineWidth = opts.lineWidth;
                    if (opts.lineCap) {
                        ctx.lineCap = opts.lineCap;
                    }
                    if (opts.lineColors) {
                        if (_.isString(opts.lineColors)) {
                            ctx.strokeStyle = opts.lineColors;
                        } else if (opts.useGradient && _.isArray(opts.lineColors)) {
                            opts.lineColors.forEach(function (item) {
                                lineGradient.addColorStop(item.stop, item.color);
                            });
                            ctx.strokeStyle = lineGradient;
                        }
                    }
                    if (opts.showShadow) {
                        ctx.shadowBlur = opts.shadowBlur || 0;
                        if (opts.shadowColor) {
                            ctx.shadowColor = opts.shadowColor;
                        }
                    }
                    ctx.save();
                    this.__drawProgress();
                }
            }
        }, {
            key: '__drawProgress',
            value: function __drawProgress() {}
        }, {
            key: '__dynamicDraw',
            value: function __dynamicDraw(length) {
                var me = this,
                    gap = 5;
                me.curVal = 0;
                var animateClip = function animateClip() {
                    setTimeout(function () {
                        if (me.curVal < length) {
                            me.curVal++;
                            me.render();
                            animateClip.call(me);
                        }
                        gap = Math.tan(me.curVal * Math.PI / 3 / length) + 5;
                    }, gap);
                };
                animateClip.call(me);
            }
        }, {
            key: 'render',
            value: function render() {
                //  draw rect
                this.__drawBase();
                return this;
            }
        }, {
            key: 'clearCanvas',
            value: function clearCanvas() {
                var ctx = this.ctx;
                if (ctx) {
                    ctx.clearRect(0, 0, this.width, this.height);
                }
            }
        }, {
            key: 'updateVal',
            value: function updateVal(val) {
                if (val !== undefined) {
                    var me = this;
                    me.ctx.restore();
                    me.__dynamicDraw(val);
                }
            }
        }]);

        return BaseProgress;
    }();

    var ShieldProgress = function (_BaseProgress) {
        _inherits(ShieldProgress, _BaseProgress);

        function ShieldProgress(opts) {
            _classCallCheck(this, ShieldProgress);

            return _possibleConstructorReturn(this, (ShieldProgress.__proto__ || Object.getPrototypeOf(ShieldProgress)).call(this, _.extend(opts, {
                bgColorOpts: {
                    gradientType: 'radian' // radian or linear
                }
            })));
        }

        _createClass(ShieldProgress, [{
            key: '__drawShield',
            value: function __drawShield() {
                var opts = this.options,
                    ctx = this.ctx;
                var w = void 0,
                    h = void 0,
                    size = Math.min(this.width, this.height);
                w = h = size;
                var offset = Math.abs(this.width - this.height),
                    offset_x = 0,
                    offset_y = 0,
                    offset_x2 = 0;
                if (this.width > this.height) {
                    offset_x = offset / 2;
                    offset_x2 = offset;
                } else {
                    offset_y = offset / 2;
                }
                var a = void 0,
                    b = void 0,
                    c1 = void 0,
                    c2 = void 0,
                    d = void 0,
                    b_mirr = void 0,
                    c1_mirr = void 0,
                    c2_mirr = void 0;
                a = [w * .5 + offset_x, h / 6 + offset_y];
                b = [w * .22 + offset_x, h / 4 + offset_y];
                c1 = [w * .21 + offset_x, h * .5 + offset_y];
                c2 = [w * .25 + offset_x, h * .75 + offset_y];
                d = [w / 2 + offset_x, h * .8 + offset_y];
                b_mirr = [w - b[0] + offset_x2, b[1]];
                c1_mirr = [w - c1[0] + offset_x2, c1[1]];
                c2_mirr = [w - c2[0] + offset_x2, c2[1]];

                var line1 = [a, b],
                    line2 = [b, c1, c2, d],
                    line3 = [b_mirr, c1_mirr, c2_mirr, d],
                    line4 = [b_mirr, a];
                var renderOpts = {
                    lineWidth: opts.lineWidth,
                    useGradient: opts.useGradient,
                    // colors:[{stop:0,color:'#00c3c3'},{stop:1,color:'#111'}],  //  string or array
                    colors: opts.lineColors,
                    showShadow: opts.showShadow,
                    shadowBlur: opts.shadowBlur,
                    shadowColor: opts.shadowColor
                };

                var curve1 = void 0,
                    curve2 = void 0,
                    curve3 = void 0,
                    curve4 = void 0,
                    totalPoints = [];
                _bezierCurve2.default.initCurveStyle(ctx, renderOpts);
                curve1 = _bezierCurve2.default.createBezierCurve(ctx, line1);
                curve2 = _bezierCurve2.default.createBezierCurve(ctx, line2);
                curve3 = _bezierCurve2.default.createBezierCurve(ctx, line3);
                curve4 = _bezierCurve2.default.createBezierCurve(ctx, line4);
                curve1.draw();
                curve2.draw();
                curve3.draw();
                curve4.draw();

                var line3Fixed = curve3.curvePoints.reverse(),
                    line4Fixed = curve4.curvePoints;
                line3Fixed.shift(); //  移除重复的一个点；
                line4Fixed.pop(); //  移除最后一个重复的点
                this.totalPoints = [].concat(curve1.curvePoints).concat(curve2.curvePoints).concat(line3Fixed).concat(line4Fixed);
            }
        }, {
            key: 'getColorByVal',
            value: function getColorByVal(percent) {
                var color = '#3a73c9';
                if (percent < .25 && percent >= 0) {
                    color = '#3a73c9';
                } else if (percent < .5) {
                    color = '#eac82b';
                } else if (percent < .75) {
                    color = '#e7773a';
                } else {
                    color = '#e13848';
                }
                return color;
            }
        }, {
            key: '__drawProgress',
            value: function __drawProgress() {
                var me = this,
                    ctx = me.ctx;
                if (ctx) {
                    var curPos = 0,
                        preOperation = ctx.globalCompositeOperation;
                    this.__drawShield();
                    if (me.curVal >= 0 && this.totalPoints) {
                        var pointSize = this.totalPoints.length,
                            percent = me.curVal / me.maxVal,
                            preBlur = ctx.shadowBlur,
                            preColor = ctx.shadowColor,
                            preStroke = ctx.strokeStyle,
                            preFill = ctx.fillStyle;

                        curPos = percent * pointSize || 1;
                        var nodes = this.totalPoints.slice(0, curPos);
                        var color = this.getColorByVal(percent);
                        ctx.strokeStyle = color;
                        ctx.shadowBlur = 0;
                        _bezierCurve2.default.drawCurveByNodes(ctx, nodes);
                        ctx.fillStyle = color;
                        // draw dot
                        var pCnt = nodes.length ? nodes.length - 1 : 0,
                            dotPoint = nodes[pCnt];
                        ctx.shadowBlur = 60;
                        ctx.shadowColor = '#bcbcbc';
                        ctx.fillStyle = '#eee';
                        ctx.beginPath();
                        ctx.arc(dotPoint[0], dotPoint[1], 10, 0, Math.PI * 3);
                        ctx.fill();

                        // draw label
                        ctx.fillStyle = color;
                        ctx.shadowBlur = 0;
                        this.__drawLabel();
                        ctx.strokeStyle = preStroke;
                        ctx.shadowBlur = preBlur;
                        ctx.shadowColor = preColor;
                        ctx.fillStyle = preFill;
                    }

                    ctx.globalCompositeOperation = preOperation;
                }
            }
        }, {
            key: '__drawLabel',
            value: function __drawLabel() {
                var me = this,
                    ctx = me.ctx,
                    center_x = me.width / 2,
                    center_y = me.height / 2;
                ctx.font = '300 100px "Microsoft YaHei"';
                ctx.textAlign = 'center';
                ctx.fillText(this.curVal, center_x, center_y + 65);
                ctx.font = '300 40px "Microsoft YaHei"';
                ctx.fillStyle = '#fff';
                ctx.fillText('运行指数', center_x, center_y - 45);
            }
        }, {
            key: '__dynamicDraw',
            value: function __dynamicDraw(length) {
                var me = this,
                    gap = 1;
                me.curVal = 0;
                var remainder = length/10;
                var integer = length-remainder
                var animateClip = function animateClip() {
                    setTimeout(function () {
                        
                        if (me.curVal < length) {
                            if (me.curVal <= integer&&integer>=10) {
                                me.curVal += 5;
                              
                            }
                            if (me.curVal > integer&&integer>=10) {
                                me.curVal += 1;
                              
                            }
                            if(integer < 10) {
                                me.curVal += 1;
                            }
                            // me.curVal += 5;
                            me.render();
                            animateClip.call(me);
                        }
                        gap = Math.exp(0.0526 * me.curVal) * 0.0156;
                    }, gap);
                };
                animateClip.call(me);
            }
        }]);

        return ShieldProgress;
    }(BaseProgress);

    var LineProgress = function (_BaseProgress2) {
        _inherits(LineProgress, _BaseProgress2);

        function LineProgress(opts) {
            _classCallCheck(this, LineProgress);

            return _possibleConstructorReturn(this, (LineProgress.__proto__ || Object.getPrototypeOf(LineProgress)).call(this, _.extend(opts, {
                bgColorOpts: {
                    gradientType: 'radian' // radian or linear
                }
            })));
        }

        _createClass(LineProgress, [{
            key: '__drawProgress',
            value: function __drawProgress() {
                var me = this,
                    ctx = me.ctx,
                    opts = this.options;
                if (ctx) {
                    var curPos = void 0,
                        offset = this.width / 20,
                        centerY = this.height / 2,
                        startX = offset,
                        endX = void 0,
                        length = void 0,
                        maxValX = void 0,
                        maxValY = centerY + opts.lineWidth / 2;
                    var preStroke = ctx.strokeStyle,
                        preBlur = ctx.shadowBlur,
                        progressBgColor = '#1e306d';

                    // draw max
                    ctx.font = '400 28px "Microsoft YaHei"';
                    ctx.textAlign = 'left';
                    ctx.fillStyle = '#fff';
                    var textWidth = ctx.measureText(this.maxVal).width;
                    endX = this.width - offset - textWidth - 10;
                    length = endX - startX;
                    maxValX = endX + 10;
                    ctx.shadowBlur = 0;
                    ctx.fillText(this.maxVal, maxValX, maxValY);
                    ctx.shadowBlur = preBlur;
                    //  draw bg;
                    ctx.strokeStyle = progressBgColor;
                    ctx.beginPath();
                    ctx.moveTo(startX, centerY);
                    ctx.lineTo(endX, centerY);
                    ctx.stroke();
                    ctx.strokeStyle = preStroke;

                    //  draw progress
                    if (me.curVal >= 0) {
                        curPos = me.curVal / me.maxVal * length + startX;
                        ctx.beginPath();
                        ctx.moveTo(startX, centerY);
                        ctx.lineTo(curPos, centerY);
                        ctx.stroke();
                        this.__drawFlagAndCurVal(curPos, centerY, preStroke);
                    }
                }
            }
        }, {
            key: '__drawFlagAndCurVal',
            value: function __drawFlagAndCurVal(x, y, fillColor) {
                var ctx = this.ctx,
                    opts = this.options;
                if (ctx) {
                    var triH = 16,
                        flagOffset = y - opts.lineWidth / 2 - 5,
                        cx = x,
                        cy = flagOffset,
                        line = Math.sqrt(4 * Math.pow(16, 2) / 3),
                        halfLine = line / 2,
                        ax = x - halfLine,
                        bx = x + halfLine,
                        ay = cy - triH,
                        by = ay,
                        valY = ay - 8,
                        valX = x;
                    var preLineWidth = ctx.lineWidth,
                        preLineCap = ctx.lineCap,
                        preFill = ctx.fillStyle,
                        preBlur = ctx.shadowBlur;
                    ctx.lineWidth = 1;
                    ctx.lineCap = 'butt';
                    ctx.fillStyle = fillColor;
                    ctx.beginPath();
                    ctx.moveTo(cx, cy);
                    ctx.lineTo(ax, ay);
                    ctx.lineTo(bx, by);
                    ctx.closePath();
                    ctx.fill();
                    //  cur val

                    ctx.shadowBlur = 0;
                    ctx.font = '400 30px "Microsoft YaHei"';
                    ctx.textAlign = 'center';
                    ctx.fillStyle = '#fff';
                    ctx.fillText(this.curVal, valX, valY);

                    ctx.shadowBlur = preBlur;
                    ctx.lineWidth = preLineWidth;
                    ctx.lineCap = preLineCap;
                    ctx.fillStyle = preFill;
                }
            }
        }]);

        return LineProgress;
    }(BaseProgress);

    var CircleProgress = function (_BaseProgress3) {
        _inherits(CircleProgress, _BaseProgress3);

        function CircleProgress(opts) {
            _classCallCheck(this, CircleProgress);

            return _possibleConstructorReturn(this, (CircleProgress.__proto__ || Object.getPrototypeOf(CircleProgress)).call(this, _.extend(opts, {
                bgColorOpts: {
                    gradientType: 'radian' // radian or linear
                }
            })));
        }

        _createClass(CircleProgress, [{
            key: '__drawProgress',
            value: function __drawProgress() {
                var me = this,
                    ctx = me.ctx,
                    opts = this.options;
                if (ctx) {
                    var center_x = me.width / 2,
                        center_y = me.height / 2,
                        radius = Math.min(center_x, center_y) * 2 / 3,
                        curPos = 0,
                        textX = center_x,
                        textY = center_y + 50;

                    //  draw bg
                    var preStroke = ctx.strokeStyle,
                        preFill = ctx.fillStyle,
                        preBlur = ctx.shadowBlur,
                        progressBgColor = '#253f95';

                    var bgLinear = ctx.createRadialGradient(center_x, center_y, radius * .1, center_x, center_y, radius);
                    bgLinear.addColorStop(0, progressBgColor);
                    bgLinear.addColorStop(.67, '#10172e');
                    bgLinear.addColorStop(.97, '#10172e');
                    bgLinear.addColorStop(1, progressBgColor);
                    ctx.fillStyle = bgLinear;
                    ctx.beginPath();
                    ctx.arc(center_x, center_y, radius, degreeToRadian(0), degreeToRadian(360));
                    ctx.closePath();
                    ctx.fill();

                    ctx.strokeStyle = progressBgColor;
                    ctx.beginPath();
                    ctx.arc(center_x, center_y, radius, degreeToRadian(0), degreeToRadian(360));
                    ctx.closePath();
                    ctx.stroke();

                    ctx.strokeStyle = preStroke;
                    ctx.fillStyle = preFill;

                    if (me.curVal > 0) {
                        curPos = 360 - me.curVal / me.maxVal * 360 - 90;
                        ctx.beginPath();
                        ctx.arc(center_x, center_y, radius, degreeToRadian(270), degreeToRadian(curPos), true);
                        ctx.shadowBlur = 0;
                        ctx.stroke();
                        ctx.shadowBlur = preBlur;

                        /* ctx.font='600 50px "Microsoft YaHei"';
                         ctx.textAlign='right';
                         ctx.fillStyle=preStroke;
                         ctx.fillText(me.curVal,textX,textY);
                             ctx.font='400 24px "Microsoft YaHei"';
                         ctx.textAlign='left';
                         ctx.fillStyle='#fff';
                         ctx.fillText('家',textX,textY);*/
                    }
                }
            }
        }, {
            key: '__dynamicDraw',
            value: function __dynamicDraw(length) {
                var me = this,
                    gap = 1;
                me.curVal = 0;
                var animateClip = function animateClip() {
                    setTimeout(function () {
                        if (me.curVal < length) {
                            me.curVal++;
                            me.render();
                            animateClip.call(me);
                        }
                        gap = Math.exp(0.053 * me.curVal) * 0.1;
                    }, gap);
                };
                animateClip.call(me);
            }
        }]);

        return CircleProgress;
    }(BaseProgress);

    function degreeToRadian(degree) {
        var factor = Math.PI / 180;
        return factor * degree;
    }

    exports.default = ProgressCanvas;

})(window,window.ProgressUtil,function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

    var _def_opts = {
        lineWidth: 1,
        lineCap: 'round',
        useGradient: false,
        colors: [{ stop: 0, color: '#00c3c3' }, { stop: 1, color: '#111' }], //  string or array
        showShadow: true,
        shadowBlur: 10,
        shadowColor: '#00ffff'
    };

    var factorial = function factorial(num) {
        return num <= 1 ? 1 : num * factorial(num - 1);
    };

    var calculateNodeExtent = function calculateNodeExtent(nodes) {
        var extent = void 0;
        if (nodes && _.isArray(nodes)) {
            var xArr = [],
                yArr = [],
                xArrTmp = void 0,
                yArrTmp = void 0;
            nodes.forEach(function (item) {
                xArr.push(item[0]);
                yArr.push(item[1]);
            });
            xArrTmp = _.sortBy(xArr);
            yArrTmp = _.sortBy(yArr);
            var xM = xArrTmp.length - 1,
                yM = yArrTmp.length - 1;
            extent = [xArrTmp[0], yArrTmp[0], xArrTmp[xM], yArrTmp[yM]];
        }
        return extent;
    };

    var Curve = function () {
        function Curve(ctx, nodes, renderOpts) {
            _classCallCheck(this, Curve);

            this.ctx = ctx;
            this.nodes = nodes;
            this.renderOpts = renderOpts;
            this.curvePoints = BezierCurve.calculateCurveNodes(nodes);
        }

        _createClass(Curve, [{
            key: 'draw',
            value: function draw() {
                var ctx = this.ctx,
                    points = this.curvePoints,
                    renderOpts = this.renderOpts;
                if (ctx && _.isArray(points)) {
                    if (!_.isEmpty(renderOpts)) {
                        BezierCurve.initCurveStyle(ctx, renderOpts);
                    }
                    BezierCurve.drawCurveByNodes(ctx, points);
                }
            }
        }]);

        return Curve;
    }();

    var BezierCurve = function () {
        function BezierCurve() {
            _classCallCheck(this, BezierCurve);
        }

        _createClass(BezierCurve, null, [{
            key: 'calculateCurvePerNode',
            value: function calculateCurvePerNode(nodeArr, t) {
                var x = void 0,
                    y = void 0,
                    lineCnt = void 0;
                if (nodeArr.length) {
                    x = y = 0;
                    lineCnt = nodeArr.length - 1;
                    nodeArr.forEach(function (item, idx) {
                        var offset = void 0,
                            cell = Math.pow(1 - t, lineCnt - idx) * Math.pow(t, idx);
                        if (idx === 0) {
                            offset = cell; //factorial(idx)*cell;
                        } else {
                            offset = factorial(lineCnt) / factorial(idx) / factorial(lineCnt - idx) * cell;
                        }
                        x += item[0] * offset;
                        y += item[1] * offset;

                        // console.log(`${x},${y}`);
                    });
                    return [x, y];
                }
                return [];
            }
        }, {
            key: 'createBezierCurve',
            value: function createBezierCurve(ctx, nodes, renderOpts) {
                return new Curve(ctx, nodes, renderOpts);
            }
        }, {
            key: 'initCurveStyle',
            value: function initCurveStyle(ctx, renderOpts) {
                if (ctx && renderOpts) {
                    var opts = void 0;
                    if (!renderOpts) {
                        opts = _.extend({}, _def_opts);
                    } else {
                        opts = _.extend({}, _def_opts, renderOpts);
                    }
                    var lineGradient = void 0;
                    ctx.lineWidth = opts.lineWidth || 1;
                    if (opts.lineCap) {
                        ctx.lineCap = opts.lineCap;
                    }
                    var colorOpt = opts.colors;
                    if (_.isString(colorOpt)) {
                        ctx.strokeStyle = colorOpt;
                    } else if (opts.useGradient && _.isArray(colorOpt)) {
                        var extent = calculateNodeExtent(nodes);
                        if (extent) {
                            lineGradient = ctx.createLinearGradient(extent[0], extent[1], extent[2], extent[3]);
                        } else {
                            lineGradient = ctx.createLinearGradient(0, 0, 0, 200);
                        }
                        colorOpt.forEach(function (item) {
                            lineGradient.addColorStop(item.stop, item.color);
                        });
                        ctx.strokeStyle = lineGradient;
                    }
                    if (opts.showShadow) {
                        ctx.shadowBlur = opts.shadowBlur || 10;
                        if (opts.shadowColor) {
                            ctx.shadowColor = opts.shadowColor;
                        }
                    }
                }
            }
        }, {
            key: 'drawCurve',
            value: function drawCurve(ctx, nodes, renderOpts) {
                var manualFlag = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

                var curvePoints = void 0;
                if (ctx && nodes && _.isArray(nodes) && nodes.length) {
                    var nodeSize = nodes.length,
                        startNode = void 0,
                        endNode = void 0;
                    //  set style
                    BezierCurve.initCurveStyle(ctx, renderOpts);
                    // calculate nodes
                    curvePoints = BezierCurve.calculateCurveNodes(nodes);

                    // draw
                    if (nodeSize === 2 && !manualFlag) {
                        startNode = nodes[0];
                        endNode = nodes[1];
                        if (_.isArray(startNode) && _.isArray(endNode)) {
                            ctx.beginPath();
                            ctx.moveTo(startNode[0], startNode[1]);
                            ctx.lineTo(endNode[0], endNode[1]);
                            ctx.stroke();
                        }
                    } else if (nodeSize === 3 && !manualFlag) {
                        var ctrlNode = void 0;
                        startNode = nodes[0];
                        ctrlNode = nodes[1];
                        endNode = nodes[2];
                        ctx.beginPath();
                        ctx.moveTo(startNode[0], startNode[1]);
                        ctx.quadraticCurveTo(ctrlNode[0], ctrlNode[1], endNode[0], endNode[1]);
                        ctx.stroke();
                    } else if (nodeSize === 4 && !manualFlag) {
                        var ctrlNode1 = void 0,
                            ctrlNode2 = void 0;
                        startNode = nodes[0];
                        ctrlNode1 = nodes[1];
                        ctrlNode2 = nodes[2];
                        endNode = nodes[3];
                        ctx.beginPath();
                        ctx.moveTo(startNode[0], startNode[1]);
                        ctx.bezierCurveTo(ctrlNode1[0], ctrlNode1[1], ctrlNode2[0], ctrlNode2[1], endNode[0], endNode[1]);
                        ctx.stroke();
                    } else {
                        // 高阶贝塞尔曲线
                        BezierCurve.drawCurveByNodes(ctx, curvePoints);
                    }
                    ctx.closePath();
                }
                return new Curve(ctx, nodes, curvePoints);
            }
        }, {
            key: 'calculateCurveNodes',
            value: function calculateCurveNodes(nodes) {
                var bezierArr = [],
                    pointCnt = void 0,
                    step = void 0;
                if (nodes && _.isArray(nodes)) {
                    pointCnt = nodes.length === 2 ? 50 : 200;
                    step = 1 / pointCnt;
                    for (var i = 0; i < 1; i += step) {
                        bezierArr.push(BezierCurve.calculateCurvePerNode(nodes, i));
                    }
                    bezierArr.push(nodes[nodes.length - 1]);
                }
                return bezierArr;
            }
        }, {
            key: 'drawCurveByNodes',
            value: function drawCurveByNodes(ctx, curvePoints) {
                if (_.isArray(curvePoints)) {
                    var preBlur = ctx.shadowBlur;
                    var _drawFunc = function _drawFunc() {
                        curvePoints.forEach(function (p, index) {
                            if (index) {
                                var startPos = curvePoints[index - 1];
                                ctx.beginPath();
                                ctx.moveTo(startPos[0], startPos[1]);
                                ctx.lineTo(p[0], p[1]);
                                ctx.stroke();
                            }
                        });
                    };
                    //  shadow
                    _drawFunc();
                    ctx.shadowBlur = 0;
                    _drawFunc();
                    ctx.shadowBlur = preBlur;
                }
            }
        }]);

        return BezierCurve;
    }();

    exports.default = BezierCurve;

    return exports;
}(window.BezierCurveUtil));