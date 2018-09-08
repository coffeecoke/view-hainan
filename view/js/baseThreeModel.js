define(["exports", "three", "../animateProxy"], function (exports, _three, _animateProxy) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var THREE = _interopRequireWildcard(_three);

    function _interopRequireWildcard(obj) {
        if (obj && obj.__esModule) {
            return obj;
        } else {
            var newObj = {};

            if (obj != null) {
                for (var key in obj) {
                    if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
                }
            }

            newObj.default = obj;
            return newObj;
        }
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
                    (0, _animateProxy.initAnimateProxy)();
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
});