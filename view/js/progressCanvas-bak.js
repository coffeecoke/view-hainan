define(['exports', './bezierCurve'], function (exports, _bezierCurve) {
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
        }

        _createClass(ProgressCanvas, [{
            key: '__init',
            value: function __init() {
                var me = this,
                    opts = me.options;
                if (opts.width && opts.height && _.isString(me.type)) {
                    var canvas = document.createElement('canvas');
                    canvas.width = opts.width;
                    canvas.height = opts.height;
                    me.canvas = canvas;
                    me.context = canvas.getContext('2d');
                }
                return me;
            }
        }, {
            key: '__drawBase',
            value: function __drawBase() {
                var opts = this.options,
                    ctx = this.context;
                if (ctx) {}
            }
        }, {
            key: '__drawProgress',
            value: function __drawProgress() {
                var ctx = this.context,
                    opts = this.options;
                if (ctx) {}
            }
        }, {
            key: 'clearCanvas',
            value: function clearCanvas() {
                var ctx = this.context,
                    opts = this.options;
                if (ctx) {
                    ctx.clearRect(0, 0, opts.width, opts.height);
                }
            }
        }, {
            key: 'render',
            value: function render() {
                //  draw rect
                this.__drawBase();
                // draw stars
                this.__drawProgress();
                return this;
            }
        }, {
            key: 'update',
            value: function update() {
                if (this.__drawProgress) {
                    this.clearCanvas();
                    this.render();
                }
            }
        }]);

        return ProgressCanvas;
    }();

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
                    this.curVal = val;
                    this.ctx.restore();
                    this.render();
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
                this.timeline = new TimelineMax();
                /*this.timeline.to([curve1,curve4],1,{
                    onComplete: function() {
                        curve1.draw();
                        curve4.draw();
                    }
                }).to([curve2,curve3],2,{
                    onComplete: function() {
                        curve2.draw();
                        curve3.draw();
                    }
                });*/

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
                    if (me.curVal > 0 && this.totalPoints) {
                        var pointSize = this.totalPoints.length,
                            percent = me.curVal / me.maxVal,
                            preBlur = ctx.shadowBlur,
                            preColor = ctx.shadowColor,
                            preStroke = ctx.strokeStyle,
                            preFill = ctx.fillStyle;

                        curPos = percent * pointSize;
                        var nodes = this.totalPoints.slice(0, curPos);
                        var color = this.getColorByVal(percent);
                        ctx.strokeStyle = color;
                        ctx.shadowBlur = 0;
                        _bezierCurve2.default.drawCurveByNodes(ctx, nodes);
                        ctx.fillStyle = color;
                        // draw dot
                        var dotPoint = nodes[nodes.length - 1];
                        ctx.shadowBlur = 60;
                        ctx.shadowColor = '#bcbcbc';
                        ctx.fillStyle = '#eee';
                        ctx.beginPath();
                        ctx.arc(dotPoint[0], dotPoint[1], 15, 0, Math.PI * 3);
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
                ctx.font = '600 100px "Microsoft YaHei"';
                ctx.textAlign = 'center';
                ctx.fillText(this.curVal, center_x, center_y + 65);
                ctx.font = '600 60px "Microsoft YaHei"';
                ctx.fillStyle = '#fff';
                ctx.fillText('长城指数', center_x, center_y - 65);
            }
        }]);

        return ShieldProgress;
    }(BaseProgress);

    var LineProgress = function (_BaseProgress2) {
        _inherits(LineProgress, _BaseProgress2);

        function LineProgress() {
            _classCallCheck(this, LineProgress);

            return _possibleConstructorReturn(this, (LineProgress.__proto__ || Object.getPrototypeOf(LineProgress)).apply(this, arguments));
        }

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
                    ctx = me.ctx;
                if (ctx) {
                    var center_x = me.width / 2,
                        center_y = me.height / 2,
                        radius = Math.min(center_x, center_y) * 2 / 3,
                        curPos = 0;
                    var preOperation = ctx.globalCompositeOperation;
                    if (me.curVal > 0) {
                        curPos = me.curVal / me.maxVal * 360 - 90;
                        ctx.beginPath();
                        ctx.arc(center_x, center_y, radius, degreeToRadian(270), degreeToRadian(curPos), true);
                        ctx.stroke();
                        ctx.closePath();
                    }

                    // draw bg


                    ctx.globalCompositeOperation = preOperation;
                }
            }
        }]);

        return CircleProgress;
    }(BaseProgress);

    function degreeToRadian(degree) {
        var factor = Math.PI / 180;
        return factor * degree;
    }

    exports.default = {
        ProgressCanvas: ProgressCanvas, CircleProgress: CircleProgress, ShieldProgress: ShieldProgress
    };
});