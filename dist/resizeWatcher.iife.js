var ResizeWatcher = (function (exports) {
    'use strict';

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise, SuppressedError, Symbol */


    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
        var e = new Error(message);
        return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
    };

    function useDebounceFn(fn, duration) {
        var timer = null;
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (timer) {
                clearTimeout(timer);
                timer = null;
            }
            timer = setTimeout(function () { return fn.apply(void 0, args); }, duration);
        };
    }

    var defaultResizeWatcherOptions = {
        immediate: false,
        duration: 300,
        handler: undefined,
        mode: 'simple',
        threshold: []
    };
    var elMap = new WeakMap();
    var R = ResizeObserver;
    var Watcher = /** @class */ (function () {
        function Watcher(el, options) {
            this.el = el;
            var _options = __assign(__assign({}, defaultResizeWatcherOptions), options);
            this.options = _options;
        }
        Watcher.create = function (el, options) {
            return new Watcher(el, options);
        };
        Watcher.prototype.mount = function () {
            var firstTrigger = true;
            var _a = this, options = _a.options, el = _a.el;
            var immediate = options.immediate, duration = options.duration, handler = options.handler, mode = options.mode, threshold = options.threshold;
            var debounceFn;
            if (duration && duration > 0) {
                debounceFn = handler && useDebounceFn(handler, duration);
            }
            else {
                debounceFn = handler;
            }
            var _threshold;
            if (mode === 'threshold') {
                _threshold = threshold === null || threshold === void 0 ? void 0 : threshold.map(function (item) {
                    var min = Math.min(item.range[0], item.range[1]);
                    var max = Math.max(item.range[0], item.range[1]);
                    var _handler = item.handler && useDebounceFn(item.handler, duration);
                    return {
                        range: [min, max],
                        handler: _handler
                    };
                });
            }
            var resizeObserver = new R(function (entries) {
                entries.forEach(function (item) {
                    if (immediate && firstTrigger) {
                        if (mode === 'simple') {
                            handler && handler(item.contentRect);
                        }
                        else {
                            handleThreshold(threshold, item.contentRect);
                        }
                    }
                    if (!firstTrigger) {
                        if (mode === 'simple') {
                            debounceFn === null || debounceFn === void 0 ? void 0 : debounceFn(item.contentRect);
                        }
                        else {
                            handleThreshold(_threshold, item.contentRect);
                        }
                    }
                    else {
                        firstTrigger = false;
                    }
                });
            });
            resizeObserver.observe(el);
            elMap.set(el, resizeObserver);
        };
        Watcher.prototype.unmount = function () {
            var el = this.el;
            var resizeObserver = elMap.get(el);
            resizeObserver === null || resizeObserver === void 0 ? void 0 : resizeObserver.unobserve(el);
            elMap.delete(el);
        };
        return Watcher;
    }());
    function handleThreshold(threshold, rect) {
        threshold === null || threshold === void 0 ? void 0 : threshold.forEach(function (thr) {
            var range = thr.range, handler = thr.handler;
            var width = rect.width;
            if (range[0] <= width && width <= range[1]) {
                handler && handler(rect);
            }
        });
    }

    exports.Watcher = Watcher;

    return exports;

})({});
