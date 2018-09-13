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
});