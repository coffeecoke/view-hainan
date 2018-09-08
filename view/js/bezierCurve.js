define(['exports'], function (exports) {
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
});