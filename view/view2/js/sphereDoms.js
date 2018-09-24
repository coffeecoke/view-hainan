(function (window,factory) {
    if(!window.SphereDoms){
        var Modules=factory();
        window.SphereDoms=Modules.SphereDoms;
    }
})(window,function () {
    var Modules={};

    Modules.AnimateProxy=function () {
        'use strict';
        var exports={};
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

        var innerData = {},
            _def_res = { key: '', context: undefined, handler: undefined };

        var AnimateProxy = function () {
            function AnimateProxy() {
                _classCallCheck(this, AnimateProxy);

                innerData.motion = {};
            }

            _createClass(AnimateProxy, [{
                key: 'playAnimation',
                value: function playAnimation() {
                    var motion = innerData.motion;
                    for (var m in motion) {
                        var obj = motion[m],
                            meth = obj.handler,
                            context = obj.context;
                        meth.call(context);
                    }
                    requestAnimationFrame(window.animateProxy.playAnimation);
                }
            }, {
                key: 'addMotion',
                value: function addMotion(func, parentContext) {
                    var key = 'ap_motion_' + Date.now(),
                        meth = void 0,
                        res = _.extend({}, _def_res);
                    if (_.isFunction(func)) {
                        meth = func;
                        res = _.extend({}, _def_res, {
                            key: key,
                            handler: meth
                        });
                        if (parentContext) {
                            res.context = parentContext;
                        }
                        innerData.motion[key] = res;
                    }
                    return res;
                }
            }, {
                key: 'removeMotion',
                value: function removeMotion(key) {
                    if (_.isString(key)) {
                        var tmp = void 0;
                        if (tmp = innerData.motion[key] && _.isFunction(tmp.handler)) {
                            delete innerData.motion[key];
                        }
                    }
                }
            }, {
                key: 'getOldAnimateProxy',
                value: function getOldAnimateProxy() {
                    return innerData.oldAnimateProxy;
                }
            }]);

            return AnimateProxy;
        }();

        var initAnimateProxy = exports.initAnimateProxy = function initAnimateProxy() {
            if (window.animateProxy) {
                innerData.oldAnimateProxy = window.animateProxy;
            }
            window.animateProxy = new AnimateProxy();
        };
        return exports;
    }();

    Modules.BaseThreeModel=function () {
        "use strict";
        var exports={};

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
            wrapDom: undefined,
            width: undefined,
            height: undefined,
            scene: undefined,
            sceneOpts: {
                useFog: false,
                fogOpts: {
                    color: 0x000000,
                    near: 1,
                    far: 512
                }
            },
            camera: undefined,
            cameraOpts: {
                nearPlane: undefined,
                farPlane: undefined
            },
            renderer: undefined,
            rendererOpts: {
                webglOpts: undefined,
                clearColor: undefined
            },
            showStats: true
        };

        var BaseThreeModel = function () {
            function BaseThreeModel(opts) {
                _classCallCheck(this, BaseThreeModel);

                this.options = _.extend({}, _def_opts, opts);
                this.wrapDom = opts.wrapDom;
                this.scene = opts.scene;
                this.camera = opts.camera;
                this.renderer = opts.renderer;

                this.stats = undefined;
                this.animateHandler = undefined;
                this.initModel();
            }

            _createClass(BaseThreeModel, [{
                key: "initModel",
                value: function initModel() {
                    var me = this,
                        opts = me.options;
                    if (!THREE) {
                        throw new Error('You need add Three.js to your script!');
                    }
                    /* if ( ! Detector.webgl ) {
                         Detector.addGetWebGLMessage();
                         return;
                     }*/
                    if (!me.scene) {
                        me.scene = new THREE.Scene();
                    }
                    if (opts.sceneOpts) {
                        if (opts.sceneOpts.useFog) {
                            var fogOpts = opts.sceneOpts.fogOpts;
                            if (fogOpts) {
                                me.scene.fog = new THREE.Fog(fogOpts.color, fogOpts.near, fogOpts.far);
                            }
                        }
                    }
                    if (!me.camera) {
                        if (!opts.width || !opts.height) {
                            throw new Error('Cannot create Camera without width and height!');
                        }
                        me.camera = new THREE.PerspectiveCamera(75, opts.width / opts.height, 0.1, 1000);
                        me.camera.position.set(75, 75, 75);
                        me.camera.lookAt(new THREE.Vector3(0, 0, 0));
                    }
                    var wrapFlag = true;
                    if (!opts.width || !opts.height) {
                        throw new Error('Cannot create Renderer without width and height!');
                    }
                    if (!me.renderer) {
                        var webglOpts = {
                                powerPreference: 'high-performance',
                                antialias: true
                            },
                            glOpts = opts.rendererOpts.webglOpts,
                            clearColor = opts.rendererOpts.clearColor || 0x000000;
                        if (glOpts) {
                            if (glOpts.canvas) wrapFlag = false;
                            webglOpts = _.extend({}, webglOpts, opts.rendererOpts.webglOpts);
                        }
                        me.renderer = new THREE.WebGLRenderer(webglOpts);
                        me.renderer.setClearColor(clearColor);
                    }
                    me.renderer.setSize(opts.width, opts.height);

                    if (me.wrapDom) {
                        if (wrapFlag) {
                            me.wrapDom.appendChild(me.renderer.domElement);
                        }
                        //  add stat
                        if (opts.showStats) {
                            this.stats = this.customStats();
                            if (this.stats) {
                                me.wrapDom.appendChild(this.stats.domElement);
                            } else {
                                throw new Error('the method `customStats` exec error, ' + 'perhaps no stats object has been return');
                            }
                        }
                    } else {
                        throw new Error('Cannot add find wrapDom!');
                    }
                    me.prepareClip();
                    return me;
                }
            }, {
                key: "customStats",
                value: function customStats() {
                    var stats = new Stats();
                    stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
                    // 将stats的界面对应左上角
                    stats.domElement.style.position = 'absolute';
                    stats.domElement.style.left = '0px';
                    stats.domElement.style.top = '0px';
                    return stats;
                }
            }, {
                key: "onResize",
                value: function onResize(width, height) {
                    if (width && height && this.camera && this.renderer) {
                        this.camera.aspect = width / height;
                        this.camera.updateProjectionMatrix();
                        this.render();
                        this.renderer.setSize(width, height);
                    }
                }
            }, {
                key: "render",
                value: function render() {
                    this.renderer.render(this.scene, this.camera);
                }
            }, {
                key: "prepareClip",
                value: function prepareClip() {}
            }, {
                key: "clipMotion",
                value: function clipMotion() {}
            }, {
                key: "inAnimate",
                value: function inAnimate() {}
            }, {
                key: "__inAnimate",
                value: function __inAnimate(cb) {}
            }, {
                key: "outAnimate",
                value: function outAnimate() {}
            }, {
                key: "__outAnimate",
                value: function __outAnimate(cb) {
                    this.outAnimate();
                    if (_.isFunction(cb)) {
                        cb.call(this);
                    }
                }
            }, {
                key: "addToStage",
                value: function addToStage() {
                    var jumpInAnimate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

                    if (!window.animateProxy) {
                        (0, Modules.AnimateProxy.initAnimateProxy)();
                    }

                    this.renderer.render(this.scene, this.camera);
                    if (!jumpInAnimate) {
                        this.__inAnimate();
                    }

                    var tmpFunc = this.clipMotion;

                    this.clipMotion = function () {
                        tmpFunc.call(this, arguments);
                        //  inject stats
                        if (this.options.showStats) {
                            this.stats.update();
                        }
                    };
                    this.animateHandler = window.animateProxy.addMotion(this.clipMotion, this);
                }
            }, {
                key: "removeFromStage",
                value: function removeFromStage() {
                    var _this = this;

                    if (window.animateProxy) {
                        var key = void 0;
                        if (this.animateHandler && (key = this.animateHandler.key)) {
                            window.animateProxy.removeMotion(key);
                        }
                        this.__outAnimate(function () {
                            for (var i = 0; i < _this.scene.children.length; i++) {
                                var object = _this.scene.children[i];
                                _this.scene.remove(object);
                            }
                        });
                    }
                }
            }]);

            return BaseThreeModel;
        }();

        exports.default = BaseThreeModel;

        return exports;
    }();

    Modules.SphereDoms=function () {
        'use strict';
        var exports={};

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

        var CameraRadius = 2200,
            CameraHeight = 750,
            events = {};

        var SphereDoms = function (_BaseThreeModel) {
            _inherits(SphereDoms, _BaseThreeModel);

            function SphereDoms(opts) {
                _classCallCheck(this, SphereDoms);

                return _possibleConstructorReturn(this, (SphereDoms.__proto__ || Object.getPrototypeOf(SphereDoms)).call(this, _.extend(opts, {
                    scene: new THREE.Scene(),
                    sceneOpts: {
                        useFog: true,
                        fogOpts: {
                            color: 0x262D44,
                            near: 10
                        }
                    },
                    renderer: new THREE.CSS3DRenderer()
                })));
            }

            _createClass(SphereDoms, [{
                key: 'prepareClip',
                value: function prepareClip() {
                    var me = this;
                    this.domItems = [];
                    this.target = [];
                    this.raycaster = new THREE.Raycaster();
                    this.mouse = new THREE.Vector2();

                    this.tween = undefined;

                    this.group = new THREE.Group();
                    this.scene.add(this.group);
                    this.group.position.set(0, CameraHeight, 0);

                    this.camera.position.set(0, 0, CameraRadius);
                    this.camera.lookAt(this.scene.position);

                    this.cameraControl = new THREE.OrbitControls(this.camera, this.renderer.domElement);
                    this.cameraControl.target.set(0, 0, 0);
                    this.cameraControl.enablePan = false;
                    this.cameraControl.enableDamping = true;
                    this.cameraControl.dampingFactor = .8;
                    this.cameraControl.maxDistance = CameraRadius + 1200;
                    this.cameraControl.minDistance = CameraRadius;
                    this.cameraControl.maxPolarAngle = Math.PI * 0.5;
                    this.cameraControl.minPolarAngle = Math.PI * 0.5;
                    this.cameraControl.update();

                    // this.wrapDom.addEventListener( 'mousedown', me.onDocumentMouseDown, false );
                    // this.wrapDom.addEventListener( 'touchstart', me.onDocumentTouchStart, false );

                    this.render();
                }
            }, {
                key: 'calculateTargetPosition',
                value: function calculateTargetPosition(domCnt) {
                    var a = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 800;
                    var b = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 400;

                    var group = [];
                    if (domCnt) {
                        //  椭圆轨迹
                        var theta = 360 / domCnt;
                        var alpha = 0;
                        for (var i = 0; i < domCnt; i++) {
                            var x = a * Math.sin(alpha * Math.PI / 180),
                                z = b * Math.cos(alpha * Math.PI / 180),
                                y = -z / 1.5,
                                obj = new THREE.Object3D();
                            obj.position.set(x, y, z);
                            // obj.lookAt(new THREE.Vector3(x,y,9000));
                            group.push(obj);
                            alpha -= theta;
                        }
                    }
                    return group;
                }
            }, {
                key: 'clipMotion',
                value: function clipMotion() {
                    this.render();
                    this.cameraControl.update();
                    this.domItems.forEach(function (item) {
                        item.userData.update();
                    });
                }
            }, {
                key: 'appendDoms',
                value: function appendDoms(domItems) {
                    var _this2 = this;

                    var radius = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 900;
                
                    var me = this;
                    if (_.isArray(domItems)) {
                        var size = domItems.length;
                        this.target = this.calculateTargetPosition(size, radius, radius * 0.6);
                        domItems.forEach(function (item, idx) {
                            var wrapDom = item.wrapDom,
                                bgWidth = item.bgWidth,
                                bgHeight = item.bgHeight,
                                bgWrapDom = item.bgWrapDom,
                                bgColors = item.bgColors,
                                handler = item.handler,
                                tar = _this2.target[idx],
                                bg = new FocusBg({
                                    width: bgWidth,
                                    height: bgHeight,
                                    wrapDom: bgWrapDom,
                                    bgColors: bgColors
                                }).render();


                            var obj = new THREE.CSS3DObject(wrapDom);
                            obj.userData = bg;
                            obj.position.set(tar.position.x, tar.position.y, tar.position.z);
                            _this2.group.add(obj);
                            _this2.domItems.push(obj);

                            wrapDom.addEventListener('click', function (e) {
                                if (_.isFunction(handler)) {
                                    var preIdx = me.preIdx,
                                        nextIdx = e.data || parseInt(e.currentTarget.getAttribute('index'));
                                    var tmpDoms = [].concat(me.domItems.slice(nextIdx), me.domItems.slice(0, nextIdx));

                                    tmpDoms.forEach(function (curItem, idx) {
                                        var curTar = me.target[idx];
                                        // console.log(idxOffset);
                                        TweenMax.to(curItem.position, 2, {
                                            x: curTar.position.x,
                                            y: curTar.position.y,
                                            z: curTar.position.z
                                        });
                                        TweenMax.to(curItem.rotation, 2, {
                                            x: curTar.rotation.x,
                                            y: curTar.rotation.y,
                                            z: curTar.rotation.z
                                        });
                                    });
                                    me.cameraControl.update();

                                    me.preIdx = nextIdx;
                                    handler.call(_this2, item);
                                }
                            });
                        });

                        this.preIdx = 0;
                        this.render();
                    }
                }
            }, {
                key: 'autoSwitch',
                value: function autoSwitch() {
                    var _this3 = this;

                    var flag = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
                    var circleTime = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 5000;

                    this.autoSwitchFlag = flag;
                    if (this.autoSwitchFlag) {
                        var loopFunc = function loopFunc() {
                            _this3.switchDom(_this3.preIdx);
                            if (_this3.preIdx === _this3.domItems.length) {
                                _this3.preIdx = 0;
                            } else {
                                _this3.preIdx++;
                            }
                            _this3.loopHandler = setTimeout(loopFunc, circleTime);
                        };
                        loopFunc();
                    } else {
                        clearTimeout(this.loopHandler);
                    }
                }
            }, {
                key: 'switchDom',
                value: function switchDom(idx) {
                    var cur = void 0;
                    if (idx !== undefined && idx < this.domItems.length) {
                        cur = this.domItems[idx];
                        var event = new Event('click');
                        event.data = idx;
                        cur.element.dispatchEvent(event);
                    }
                }
            }, {
                key: 'onDocumentTouchStart',
                value: function onDocumentTouchStart(event) {
                    event.preventDefault();
                    event.clientX = event.touches[0].clientX;
                    event.clientY = event.touches[0].clientY;
                    onDocumentMouseDown(event);
                }
            }, {
                key: 'onDocumentMouseDown',
                value: function onDocumentMouseDown(event) {
                    event.preventDefault();
                    this.mouse.x = event.clientX / this.renderer.domElement.clientWidth * 2 - 1;
                    this.mouse.y = -(event.clientY / this.renderer.domElement.clientHeight) * 2 + 1;
                    this.raycaster.setFromCamera(this.mouse, this.camera);
                    var intersects = this.raycaster.intersectObjects(this.domItems);
                    if (intersects.length > 0) {
                        console.log(intersects[0].object);
                    }
                    /*
                    // Parse all the faces
                    for ( var i in intersects ) {
                        intersects[ i ].face.material[ 0 ].color.setHex( Math.random() * 0xffffff | 0x80000000 );
                    }
                    */
                }
            }]);

            return SphereDoms;
        }(Modules.BaseThreeModel.default);

        var Def_Color = 'rgb(45, 100, 205)';

        var FocusBg = function () {
            function FocusBg(opts) {
                _classCallCheck(this, FocusBg);

                this.options = _.extend({}, opts);
                this.width = this.options.width;
                this.height = this.options.height;
                this.wrapDom = this.options.wrapDom;
                this.ctx = undefined;
                this.rings = [];
                this.__init();
            }

            _createClass(FocusBg, [{
                key: '__init',
                value: function __init() {
                    if (this.height && this.width && this.wrapDom) {
                        var canvas = document.createElement('canvas');
                        canvas.width = this.width;
                        canvas.height = this.height;
                        this.wrapDom.appendChild(canvas);
                        this.ctx = canvas.getContext('2d');
                        // this.ctx.globalAlpha=0;
                        this.ctx.lineCap = 'round';
                        this.maxRadius = Math.min(this.width, this.height) / 2 * .8;
                        this.rings.push({
                            color: this.options.color || Def_Color,
                            width: 14,
                            radius: this.maxRadius * .9,
                            theta: 70,
                            offset: Math.floor(Math.random() * 350) + 10,
                            clockwise: true
                        }, {
                            color: this.options.color || Def_Color,
                            width: 4,
                            radius: this.maxRadius * .72,
                            theta: 260,
                            offset: Math.floor(Math.random() * 350) + 10,
                            clockwise: false
                        });
                    }
                    return this;
                }
            }, {
                key: 'render',
                value: function render() {
                    var ctx = this.ctx;
                    if (ctx) {
                        ctx.clearRect(0, 0, this.width, this.height);
                        var centerX = this.width / 2,
                            centerY = this.height / 2,
                            r = this.maxRadius,
                            colors = this.options.bgColors,
                            gradientFill = void 0;

                        if (colors && _.isArray(colors)) {
                            gradientFill = ctx.createRadialGradient(centerX, centerY, .1, centerX, centerY, r / .8);
                            colors.forEach(function (c) {
                                gradientFill.addColorStop(c.stop, c.color);
                            });
                            ctx.fillStyle = gradientFill;
                            ctx.beginPath();
                            ctx.arc(centerX, centerY, this.maxRadius, 0, Math.PI * 2);
                            ctx.closePath();
                            ctx.fill();
                        }

                        ctx.lineWidth = 2;
                        // out dashed line
                        ctx.strokeStyle = '#888';
                        ctx.setLineDash([3, 8]);
                        ctx.beginPath();
                        ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
                        ctx.closePath();
                        ctx.stroke();

                        ctx.strokeStyle = this.options.color || Def_Color;
                        // draw ring2
                        ctx.setLineDash([3, 3]);
                        ctx.beginPath();
                        ctx.arc(centerX, centerY, r * .8, 0, Math.PI * 2);
                        ctx.closePath();
                        ctx.stroke();

                        ctx.setLineDash([]);
                        //  draw sector
                        this.rings.forEach(function (ring) {
                            var color = ring.color,
                                width = ring.width,
                                radius = ring.radius,
                                theta = ring.theta,
                                offset = ring.offset,
                                clockwise = ring.clockwise,
                                end = void 0;

                            if (clockwise) {
                                end = 360 - theta + offset;
                            } else {
                                end = theta + offset;
                            }
                            ctx.lineWidth = width;
                            ctx.strokeStyle = color;
                            ctx.beginPath();
                            ctx.arc(centerX, centerY, radius, offset * Math.PI / 180, end * Math.PI / 180, clockwise);
                            ctx.stroke();
                        });
                    }
                    return this;
                }
            }, {
                key: 'update',
                value: function update() {
                    var _this4 = this;

                    var newGroup = [];
                    var loop = function loop() {
                        newGroup = [];
                        _this4.rings.forEach(function (ring) {
                            var of = ring.offset;
                            if (ring.clockwise) {
                                of-=2;
                            } else {
                                of+=2;
                            }
                            ring.offset = of;
                            newGroup.push(ring);
                        });
                        _this4.rings = newGroup;
                        _this4.render();
                    };

                    loop();

                    // this.loopHandler=window.animateProxy.addMotion(loop,this);
                }
            }]);

            return FocusBg;
        }();

        exports.default = SphereDoms;

        return exports;
    }();

    return Modules;
});