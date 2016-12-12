(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("w3c-xmlhttprequest"), require("socket.io-client"));
	else if(typeof define === 'function' && define.amd)
		define("cloudboost", ["w3c-xmlhttprequest", "socket.io-client"], factory);
	else if(typeof exports === 'object')
		exports["cloudboost"] = factory(require("w3c-xmlhttprequest"), require("socket.io-client"));
	else
		root["cloudboost"] = factory(root["w3c-xmlhttprequest"], root["socket.io-client"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_5__, __WEBPACK_EXTERNAL_MODULE_9__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var _CB = __webpack_require__(1);

	var _CB2 = _interopRequireDefault(_CB);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	try {
	  if (window) {
	    _CB2.default._isNode = false;
	    window.Blob = undefined;
	    window.BlobBuilder = undefined;
	    window.WebKitBlobBuilder = undefined;
	  }
	} catch (e) {
	  _CB2.default._isNode = true;
	} ///<reference path="./cloudboost.d.ts" />

	if (_CB2.default._isNode) {
	  _CB2.default._loadXml = function () {
	    var xmlhttp;
	    xmlhttp = __webpack_require__(5).XMLHttpRequest;
	    xmlhttp = new xmlhttp();
	    return xmlhttp;
	  };
	} else {
	  _CB2.default._loadXml = function () {
	    var xmlhttp;
	    xmlhttp = XMLHttpRequest;
	    xmlhttp = new xmlhttp();
	    return xmlhttp;
	  };
	}

	__webpack_require__(6);
	__webpack_require__(8);
	__webpack_require__(30);
	__webpack_require__(31);
	__webpack_require__(32);
	__webpack_require__(33);
	__webpack_require__(34);
	__webpack_require__(35);
	__webpack_require__(36);
	__webpack_require__(37);
	__webpack_require__(38);
	__webpack_require__(39);
	__webpack_require__(40);
	__webpack_require__(41);
	__webpack_require__(42);

	try {
	  window.CB = _CB2.default;
	} catch (e) {}
	module.exports = _CB2.default;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _bluebird = __webpack_require__(3);

	var _bluebird2 = _interopRequireDefault(_bluebird);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var CloudBoost = function () {
	    function CloudBoost() {
	        _classCallCheck(this, CloudBoost);

	        this._isNode = false;
	        this.Socket = null;
	        this.io = null; //socket.io library is saved here.
	        this.apiUrl = 'https://api.cloudboost.io';
	        if (typeof process !== "undefined" && process.versions && process.versions.node) {
	            this._isNode = true;
	        } else {
	            this._isNode = false;
	        }
	        this.Events = { trigger: this.trigger.bind(this) };
	    }

	    _createClass(CloudBoost, [{
	        key: '_ajaxIE8',
	        value: function _ajaxIE8(method, url, data) {
	            var promise = new this.Promise();
	            var xdr = new XDomainRequest();
	            xdr.onload = function () {
	                var response;
	                try {
	                    response = JSON.parse(xdr.responseText);
	                } catch (e) {
	                    promise.reject(e);
	                }
	                if (response) {
	                    promise.resolve(response);
	                }
	            };
	            xdr.onerror = xdr.ontimeout = function () {
	                // Let's fake a real error message.
	                var fakeResponse = {
	                    responseText: JSON.stringify({
	                        code: 500,
	                        error: "IE's XDomainRequest does not supply error info."
	                    })
	                };
	                promise.reject(fakeResponse);
	            };
	            xdr.onprogress = function () {};
	            xdr.open(method, url);
	            xdr.send(data);
	            return promise;
	        }
	    }, {
	        key: 'trigger',
	        value: function trigger(events) {
	            var event, node, calls, tail, args, all, rest;
	            if (!(calls = this._callbacks)) {
	                return this;
	            }
	            all = calls.all;
	            events = events.split(eventSplitter);
	            rest = slice.call(arguments, 1);

	            // For each event, walk through the linked list of callbacks twice,
	            // first to trigger the event, then to trigger any `"all"` callbacks.
	            event = events.shift();
	            while (event) {
	                node = calls[event];
	                if (node) {
	                    tail = node.tail;
	                    while ((node = node.next) !== tail) {
	                        node.callback.apply(node.context || this, rest);
	                    }
	                }
	                node = all;
	                if (node) {
	                    tail = node.tail;
	                    args = [event].concat(rest);
	                    while ((node = node.next) !== tail) {
	                        node.callback.apply(node.context || this, args);
	                    }
	                }
	                event = events.shift();
	            }

	            return this;
	        }
	    }, {
	        key: 'Promise',
	        value: function Promise() {
	            var resolve, reject;
	            var promise = new _bluebird2.default(function () {
	                resolve = arguments[0];
	                reject = arguments[1];
	            });
	            return {
	                resolve: resolve,
	                reject: reject,
	                promise: promise
	            };
	        }
	    }]);

	    return CloudBoost;
	}();

	var CB = new CloudBoost();

	// inheriting BlueBird Promise Library
	Object.setPrototypeOf(CB.Promise, _bluebird2.default);

	exports.default = CB;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 2 */
/***/ function(module, exports) {

	// shim for using process in browser
	var process = module.exports = {};

	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.

	var cachedSetTimeout;
	var cachedClearTimeout;

	function defaultSetTimout() {
	    throw new Error('setTimeout has not been defined');
	}
	function defaultClearTimeout () {
	    throw new Error('clearTimeout has not been defined');
	}
	(function () {
	    try {
	        if (typeof setTimeout === 'function') {
	            cachedSetTimeout = setTimeout;
	        } else {
	            cachedSetTimeout = defaultSetTimout;
	        }
	    } catch (e) {
	        cachedSetTimeout = defaultSetTimout;
	    }
	    try {
	        if (typeof clearTimeout === 'function') {
	            cachedClearTimeout = clearTimeout;
	        } else {
	            cachedClearTimeout = defaultClearTimeout;
	        }
	    } catch (e) {
	        cachedClearTimeout = defaultClearTimeout;
	    }
	} ())
	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    // if setTimeout wasn't available but was latter defined
	    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
	        cachedSetTimeout = setTimeout;
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch(e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch(e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }


	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    // if clearTimeout wasn't available but was latter defined
	    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
	        cachedClearTimeout = clearTimeout;
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
	    }



	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = runTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    runClearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process, global, setImmediate) {/* @preserve
	 * The MIT License (MIT)
	 * 
	 * Copyright (c) 2013-2015 Petka Antonov
	 * 
	 * Permission is hereby granted, free of charge, to any person obtaining a copy
	 * of this software and associated documentation files (the "Software"), to deal
	 * in the Software without restriction, including without limitation the rights
	 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	 * copies of the Software, and to permit persons to whom the Software is
	 * furnished to do so, subject to the following conditions:
	 * 
	 * The above copyright notice and this permission notice shall be included in
	 * all copies or substantial portions of the Software.
	 * 
	 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
	 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	 * THE SOFTWARE.
	 * 
	 */
	/**
	 * bluebird build version 3.4.6
	 * Features enabled: core, race, call_get, generators, map, nodeify, promisify, props, reduce, settle, some, using, timers, filter, any, each
	*/
	!function(e){if(true)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.Promise=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof _dereq_=="function"&&_dereq_;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof _dereq_=="function"&&_dereq_;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
	"use strict";
	module.exports = function(Promise) {
	var SomePromiseArray = Promise._SomePromiseArray;
	function any(promises) {
	    var ret = new SomePromiseArray(promises);
	    var promise = ret.promise();
	    ret.setHowMany(1);
	    ret.setUnwrap();
	    ret.init();
	    return promise;
	}

	Promise.any = function (promises) {
	    return any(promises);
	};

	Promise.prototype.any = function () {
	    return any(this);
	};

	};

	},{}],2:[function(_dereq_,module,exports){
	"use strict";
	var firstLineError;
	try {throw new Error(); } catch (e) {firstLineError = e;}
	var schedule = _dereq_("./schedule");
	var Queue = _dereq_("./queue");
	var util = _dereq_("./util");

	function Async() {
	    this._customScheduler = false;
	    this._isTickUsed = false;
	    this._lateQueue = new Queue(16);
	    this._normalQueue = new Queue(16);
	    this._haveDrainedQueues = false;
	    this._trampolineEnabled = true;
	    var self = this;
	    this.drainQueues = function () {
	        self._drainQueues();
	    };
	    this._schedule = schedule;
	}

	Async.prototype.setScheduler = function(fn) {
	    var prev = this._schedule;
	    this._schedule = fn;
	    this._customScheduler = true;
	    return prev;
	};

	Async.prototype.hasCustomScheduler = function() {
	    return this._customScheduler;
	};

	Async.prototype.enableTrampoline = function() {
	    this._trampolineEnabled = true;
	};

	Async.prototype.disableTrampolineIfNecessary = function() {
	    if (util.hasDevTools) {
	        this._trampolineEnabled = false;
	    }
	};

	Async.prototype.haveItemsQueued = function () {
	    return this._isTickUsed || this._haveDrainedQueues;
	};


	Async.prototype.fatalError = function(e, isNode) {
	    if (isNode) {
	        process.stderr.write("Fatal " + (e instanceof Error ? e.stack : e) +
	            "\n");
	        process.exit(2);
	    } else {
	        this.throwLater(e);
	    }
	};

	Async.prototype.throwLater = function(fn, arg) {
	    if (arguments.length === 1) {
	        arg = fn;
	        fn = function () { throw arg; };
	    }
	    if (typeof setTimeout !== "undefined") {
	        setTimeout(function() {
	            fn(arg);
	        }, 0);
	    } else try {
	        this._schedule(function() {
	            fn(arg);
	        });
	    } catch (e) {
	        throw new Error("No async scheduler available\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
	    }
	};

	function AsyncInvokeLater(fn, receiver, arg) {
	    this._lateQueue.push(fn, receiver, arg);
	    this._queueTick();
	}

	function AsyncInvoke(fn, receiver, arg) {
	    this._normalQueue.push(fn, receiver, arg);
	    this._queueTick();
	}

	function AsyncSettlePromises(promise) {
	    this._normalQueue._pushOne(promise);
	    this._queueTick();
	}

	if (!util.hasDevTools) {
	    Async.prototype.invokeLater = AsyncInvokeLater;
	    Async.prototype.invoke = AsyncInvoke;
	    Async.prototype.settlePromises = AsyncSettlePromises;
	} else {
	    Async.prototype.invokeLater = function (fn, receiver, arg) {
	        if (this._trampolineEnabled) {
	            AsyncInvokeLater.call(this, fn, receiver, arg);
	        } else {
	            this._schedule(function() {
	                setTimeout(function() {
	                    fn.call(receiver, arg);
	                }, 100);
	            });
	        }
	    };

	    Async.prototype.invoke = function (fn, receiver, arg) {
	        if (this._trampolineEnabled) {
	            AsyncInvoke.call(this, fn, receiver, arg);
	        } else {
	            this._schedule(function() {
	                fn.call(receiver, arg);
	            });
	        }
	    };

	    Async.prototype.settlePromises = function(promise) {
	        if (this._trampolineEnabled) {
	            AsyncSettlePromises.call(this, promise);
	        } else {
	            this._schedule(function() {
	                promise._settlePromises();
	            });
	        }
	    };
	}

	Async.prototype.invokeFirst = function (fn, receiver, arg) {
	    this._normalQueue.unshift(fn, receiver, arg);
	    this._queueTick();
	};

	Async.prototype._drainQueue = function(queue) {
	    while (queue.length() > 0) {
	        var fn = queue.shift();
	        if (typeof fn !== "function") {
	            fn._settlePromises();
	            continue;
	        }
	        var receiver = queue.shift();
	        var arg = queue.shift();
	        fn.call(receiver, arg);
	    }
	};

	Async.prototype._drainQueues = function () {
	    this._drainQueue(this._normalQueue);
	    this._reset();
	    this._haveDrainedQueues = true;
	    this._drainQueue(this._lateQueue);
	};

	Async.prototype._queueTick = function () {
	    if (!this._isTickUsed) {
	        this._isTickUsed = true;
	        this._schedule(this.drainQueues);
	    }
	};

	Async.prototype._reset = function () {
	    this._isTickUsed = false;
	};

	module.exports = Async;
	module.exports.firstLineError = firstLineError;

	},{"./queue":26,"./schedule":29,"./util":36}],3:[function(_dereq_,module,exports){
	"use strict";
	module.exports = function(Promise, INTERNAL, tryConvertToPromise, debug) {
	var calledBind = false;
	var rejectThis = function(_, e) {
	    this._reject(e);
	};

	var targetRejected = function(e, context) {
	    context.promiseRejectionQueued = true;
	    context.bindingPromise._then(rejectThis, rejectThis, null, this, e);
	};

	var bindingResolved = function(thisArg, context) {
	    if (((this._bitField & 50397184) === 0)) {
	        this._resolveCallback(context.target);
	    }
	};

	var bindingRejected = function(e, context) {
	    if (!context.promiseRejectionQueued) this._reject(e);
	};

	Promise.prototype.bind = function (thisArg) {
	    if (!calledBind) {
	        calledBind = true;
	        Promise.prototype._propagateFrom = debug.propagateFromFunction();
	        Promise.prototype._boundValue = debug.boundValueFunction();
	    }
	    var maybePromise = tryConvertToPromise(thisArg);
	    var ret = new Promise(INTERNAL);
	    ret._propagateFrom(this, 1);
	    var target = this._target();
	    ret._setBoundTo(maybePromise);
	    if (maybePromise instanceof Promise) {
	        var context = {
	            promiseRejectionQueued: false,
	            promise: ret,
	            target: target,
	            bindingPromise: maybePromise
	        };
	        target._then(INTERNAL, targetRejected, undefined, ret, context);
	        maybePromise._then(
	            bindingResolved, bindingRejected, undefined, ret, context);
	        ret._setOnCancel(maybePromise);
	    } else {
	        ret._resolveCallback(target);
	    }
	    return ret;
	};

	Promise.prototype._setBoundTo = function (obj) {
	    if (obj !== undefined) {
	        this._bitField = this._bitField | 2097152;
	        this._boundTo = obj;
	    } else {
	        this._bitField = this._bitField & (~2097152);
	    }
	};

	Promise.prototype._isBound = function () {
	    return (this._bitField & 2097152) === 2097152;
	};

	Promise.bind = function (thisArg, value) {
	    return Promise.resolve(value).bind(thisArg);
	};
	};

	},{}],4:[function(_dereq_,module,exports){
	"use strict";
	var old;
	if (typeof Promise !== "undefined") old = Promise;
	function noConflict() {
	    try { if (Promise === bluebird) Promise = old; }
	    catch (e) {}
	    return bluebird;
	}
	var bluebird = _dereq_("./promise")();
	bluebird.noConflict = noConflict;
	module.exports = bluebird;

	},{"./promise":22}],5:[function(_dereq_,module,exports){
	"use strict";
	var cr = Object.create;
	if (cr) {
	    var callerCache = cr(null);
	    var getterCache = cr(null);
	    callerCache[" size"] = getterCache[" size"] = 0;
	}

	module.exports = function(Promise) {
	var util = _dereq_("./util");
	var canEvaluate = util.canEvaluate;
	var isIdentifier = util.isIdentifier;

	var getMethodCaller;
	var getGetter;
	if (false) {
	var makeMethodCaller = function (methodName) {
	    return new Function("ensureMethod", "                                    \n\
	        return function(obj) {                                               \n\
	            'use strict'                                                     \n\
	            var len = this.length;                                           \n\
	            ensureMethod(obj, 'methodName');                                 \n\
	            switch(len) {                                                    \n\
	                case 1: return obj.methodName(this[0]);                      \n\
	                case 2: return obj.methodName(this[0], this[1]);             \n\
	                case 3: return obj.methodName(this[0], this[1], this[2]);    \n\
	                case 0: return obj.methodName();                             \n\
	                default:                                                     \n\
	                    return obj.methodName.apply(obj, this);                  \n\
	            }                                                                \n\
	        };                                                                   \n\
	        ".replace(/methodName/g, methodName))(ensureMethod);
	};

	var makeGetter = function (propertyName) {
	    return new Function("obj", "                                             \n\
	        'use strict';                                                        \n\
	        return obj.propertyName;                                             \n\
	        ".replace("propertyName", propertyName));
	};

	var getCompiled = function(name, compiler, cache) {
	    var ret = cache[name];
	    if (typeof ret !== "function") {
	        if (!isIdentifier(name)) {
	            return null;
	        }
	        ret = compiler(name);
	        cache[name] = ret;
	        cache[" size"]++;
	        if (cache[" size"] > 512) {
	            var keys = Object.keys(cache);
	            for (var i = 0; i < 256; ++i) delete cache[keys[i]];
	            cache[" size"] = keys.length - 256;
	        }
	    }
	    return ret;
	};

	getMethodCaller = function(name) {
	    return getCompiled(name, makeMethodCaller, callerCache);
	};

	getGetter = function(name) {
	    return getCompiled(name, makeGetter, getterCache);
	};
	}

	function ensureMethod(obj, methodName) {
	    var fn;
	    if (obj != null) fn = obj[methodName];
	    if (typeof fn !== "function") {
	        var message = "Object " + util.classString(obj) + " has no method '" +
	            util.toString(methodName) + "'";
	        throw new Promise.TypeError(message);
	    }
	    return fn;
	}

	function caller(obj) {
	    var methodName = this.pop();
	    var fn = ensureMethod(obj, methodName);
	    return fn.apply(obj, this);
	}
	Promise.prototype.call = function (methodName) {
	    var args = [].slice.call(arguments, 1);;
	    if (false) {
	        if (canEvaluate) {
	            var maybeCaller = getMethodCaller(methodName);
	            if (maybeCaller !== null) {
	                return this._then(
	                    maybeCaller, undefined, undefined, args, undefined);
	            }
	        }
	    }
	    args.push(methodName);
	    return this._then(caller, undefined, undefined, args, undefined);
	};

	function namedGetter(obj) {
	    return obj[this];
	}
	function indexedGetter(obj) {
	    var index = +this;
	    if (index < 0) index = Math.max(0, index + obj.length);
	    return obj[index];
	}
	Promise.prototype.get = function (propertyName) {
	    var isIndex = (typeof propertyName === "number");
	    var getter;
	    if (!isIndex) {
	        if (canEvaluate) {
	            var maybeGetter = getGetter(propertyName);
	            getter = maybeGetter !== null ? maybeGetter : namedGetter;
	        } else {
	            getter = namedGetter;
	        }
	    } else {
	        getter = indexedGetter;
	    }
	    return this._then(getter, undefined, undefined, propertyName, undefined);
	};
	};

	},{"./util":36}],6:[function(_dereq_,module,exports){
	"use strict";
	module.exports = function(Promise, PromiseArray, apiRejection, debug) {
	var util = _dereq_("./util");
	var tryCatch = util.tryCatch;
	var errorObj = util.errorObj;
	var async = Promise._async;

	Promise.prototype["break"] = Promise.prototype.cancel = function() {
	    if (!debug.cancellation()) return this._warn("cancellation is disabled");

	    var promise = this;
	    var child = promise;
	    while (promise._isCancellable()) {
	        if (!promise._cancelBy(child)) {
	            if (child._isFollowing()) {
	                child._followee().cancel();
	            } else {
	                child._cancelBranched();
	            }
	            break;
	        }

	        var parent = promise._cancellationParent;
	        if (parent == null || !parent._isCancellable()) {
	            if (promise._isFollowing()) {
	                promise._followee().cancel();
	            } else {
	                promise._cancelBranched();
	            }
	            break;
	        } else {
	            if (promise._isFollowing()) promise._followee().cancel();
	            promise._setWillBeCancelled();
	            child = promise;
	            promise = parent;
	        }
	    }
	};

	Promise.prototype._branchHasCancelled = function() {
	    this._branchesRemainingToCancel--;
	};

	Promise.prototype._enoughBranchesHaveCancelled = function() {
	    return this._branchesRemainingToCancel === undefined ||
	           this._branchesRemainingToCancel <= 0;
	};

	Promise.prototype._cancelBy = function(canceller) {
	    if (canceller === this) {
	        this._branchesRemainingToCancel = 0;
	        this._invokeOnCancel();
	        return true;
	    } else {
	        this._branchHasCancelled();
	        if (this._enoughBranchesHaveCancelled()) {
	            this._invokeOnCancel();
	            return true;
	        }
	    }
	    return false;
	};

	Promise.prototype._cancelBranched = function() {
	    if (this._enoughBranchesHaveCancelled()) {
	        this._cancel();
	    }
	};

	Promise.prototype._cancel = function() {
	    if (!this._isCancellable()) return;
	    this._setCancelled();
	    async.invoke(this._cancelPromises, this, undefined);
	};

	Promise.prototype._cancelPromises = function() {
	    if (this._length() > 0) this._settlePromises();
	};

	Promise.prototype._unsetOnCancel = function() {
	    this._onCancelField = undefined;
	};

	Promise.prototype._isCancellable = function() {
	    return this.isPending() && !this._isCancelled();
	};

	Promise.prototype.isCancellable = function() {
	    return this.isPending() && !this.isCancelled();
	};

	Promise.prototype._doInvokeOnCancel = function(onCancelCallback, internalOnly) {
	    if (util.isArray(onCancelCallback)) {
	        for (var i = 0; i < onCancelCallback.length; ++i) {
	            this._doInvokeOnCancel(onCancelCallback[i], internalOnly);
	        }
	    } else if (onCancelCallback !== undefined) {
	        if (typeof onCancelCallback === "function") {
	            if (!internalOnly) {
	                var e = tryCatch(onCancelCallback).call(this._boundValue());
	                if (e === errorObj) {
	                    this._attachExtraTrace(e.e);
	                    async.throwLater(e.e);
	                }
	            }
	        } else {
	            onCancelCallback._resultCancelled(this);
	        }
	    }
	};

	Promise.prototype._invokeOnCancel = function() {
	    var onCancelCallback = this._onCancel();
	    this._unsetOnCancel();
	    async.invoke(this._doInvokeOnCancel, this, onCancelCallback);
	};

	Promise.prototype._invokeInternalOnCancel = function() {
	    if (this._isCancellable()) {
	        this._doInvokeOnCancel(this._onCancel(), true);
	        this._unsetOnCancel();
	    }
	};

	Promise.prototype._resultCancelled = function() {
	    this.cancel();
	};

	};

	},{"./util":36}],7:[function(_dereq_,module,exports){
	"use strict";
	module.exports = function(NEXT_FILTER) {
	var util = _dereq_("./util");
	var getKeys = _dereq_("./es5").keys;
	var tryCatch = util.tryCatch;
	var errorObj = util.errorObj;

	function catchFilter(instances, cb, promise) {
	    return function(e) {
	        var boundTo = promise._boundValue();
	        predicateLoop: for (var i = 0; i < instances.length; ++i) {
	            var item = instances[i];

	            if (item === Error ||
	                (item != null && item.prototype instanceof Error)) {
	                if (e instanceof item) {
	                    return tryCatch(cb).call(boundTo, e);
	                }
	            } else if (typeof item === "function") {
	                var matchesPredicate = tryCatch(item).call(boundTo, e);
	                if (matchesPredicate === errorObj) {
	                    return matchesPredicate;
	                } else if (matchesPredicate) {
	                    return tryCatch(cb).call(boundTo, e);
	                }
	            } else if (util.isObject(e)) {
	                var keys = getKeys(item);
	                for (var j = 0; j < keys.length; ++j) {
	                    var key = keys[j];
	                    if (item[key] != e[key]) {
	                        continue predicateLoop;
	                    }
	                }
	                return tryCatch(cb).call(boundTo, e);
	            }
	        }
	        return NEXT_FILTER;
	    };
	}

	return catchFilter;
	};

	},{"./es5":13,"./util":36}],8:[function(_dereq_,module,exports){
	"use strict";
	module.exports = function(Promise) {
	var longStackTraces = false;
	var contextStack = [];

	Promise.prototype._promiseCreated = function() {};
	Promise.prototype._pushContext = function() {};
	Promise.prototype._popContext = function() {return null;};
	Promise._peekContext = Promise.prototype._peekContext = function() {};

	function Context() {
	    this._trace = new Context.CapturedTrace(peekContext());
	}
	Context.prototype._pushContext = function () {
	    if (this._trace !== undefined) {
	        this._trace._promiseCreated = null;
	        contextStack.push(this._trace);
	    }
	};

	Context.prototype._popContext = function () {
	    if (this._trace !== undefined) {
	        var trace = contextStack.pop();
	        var ret = trace._promiseCreated;
	        trace._promiseCreated = null;
	        return ret;
	    }
	    return null;
	};

	function createContext() {
	    if (longStackTraces) return new Context();
	}

	function peekContext() {
	    var lastIndex = contextStack.length - 1;
	    if (lastIndex >= 0) {
	        return contextStack[lastIndex];
	    }
	    return undefined;
	}
	Context.CapturedTrace = null;
	Context.create = createContext;
	Context.deactivateLongStackTraces = function() {};
	Context.activateLongStackTraces = function() {
	    var Promise_pushContext = Promise.prototype._pushContext;
	    var Promise_popContext = Promise.prototype._popContext;
	    var Promise_PeekContext = Promise._peekContext;
	    var Promise_peekContext = Promise.prototype._peekContext;
	    var Promise_promiseCreated = Promise.prototype._promiseCreated;
	    Context.deactivateLongStackTraces = function() {
	        Promise.prototype._pushContext = Promise_pushContext;
	        Promise.prototype._popContext = Promise_popContext;
	        Promise._peekContext = Promise_PeekContext;
	        Promise.prototype._peekContext = Promise_peekContext;
	        Promise.prototype._promiseCreated = Promise_promiseCreated;
	        longStackTraces = false;
	    };
	    longStackTraces = true;
	    Promise.prototype._pushContext = Context.prototype._pushContext;
	    Promise.prototype._popContext = Context.prototype._popContext;
	    Promise._peekContext = Promise.prototype._peekContext = peekContext;
	    Promise.prototype._promiseCreated = function() {
	        var ctx = this._peekContext();
	        if (ctx && ctx._promiseCreated == null) ctx._promiseCreated = this;
	    };
	};
	return Context;
	};

	},{}],9:[function(_dereq_,module,exports){
	"use strict";
	module.exports = function(Promise, Context) {
	var getDomain = Promise._getDomain;
	var async = Promise._async;
	var Warning = _dereq_("./errors").Warning;
	var util = _dereq_("./util");
	var canAttachTrace = util.canAttachTrace;
	var unhandledRejectionHandled;
	var possiblyUnhandledRejection;
	var bluebirdFramePattern =
	    /[\\\/]bluebird[\\\/]js[\\\/](release|debug|instrumented)/;
	var nodeFramePattern = /\((?:timers\.js):\d+:\d+\)/;
	var parseLinePattern = /[\/<\(](.+?):(\d+):(\d+)\)?\s*$/;
	var stackFramePattern = null;
	var formatStack = null;
	var indentStackFrames = false;
	var printWarning;
	var debugging = !!(util.env("BLUEBIRD_DEBUG") != 0 &&
	                        (true ||
	                         util.env("BLUEBIRD_DEBUG") ||
	                         util.env("NODE_ENV") === "development"));

	var warnings = !!(util.env("BLUEBIRD_WARNINGS") != 0 &&
	    (debugging || util.env("BLUEBIRD_WARNINGS")));

	var longStackTraces = !!(util.env("BLUEBIRD_LONG_STACK_TRACES") != 0 &&
	    (debugging || util.env("BLUEBIRD_LONG_STACK_TRACES")));

	var wForgottenReturn = util.env("BLUEBIRD_W_FORGOTTEN_RETURN") != 0 &&
	    (warnings || !!util.env("BLUEBIRD_W_FORGOTTEN_RETURN"));

	Promise.prototype.suppressUnhandledRejections = function() {
	    var target = this._target();
	    target._bitField = ((target._bitField & (~1048576)) |
	                      524288);
	};

	Promise.prototype._ensurePossibleRejectionHandled = function () {
	    if ((this._bitField & 524288) !== 0) return;
	    this._setRejectionIsUnhandled();
	    async.invokeLater(this._notifyUnhandledRejection, this, undefined);
	};

	Promise.prototype._notifyUnhandledRejectionIsHandled = function () {
	    fireRejectionEvent("rejectionHandled",
	                                  unhandledRejectionHandled, undefined, this);
	};

	Promise.prototype._setReturnedNonUndefined = function() {
	    this._bitField = this._bitField | 268435456;
	};

	Promise.prototype._returnedNonUndefined = function() {
	    return (this._bitField & 268435456) !== 0;
	};

	Promise.prototype._notifyUnhandledRejection = function () {
	    if (this._isRejectionUnhandled()) {
	        var reason = this._settledValue();
	        this._setUnhandledRejectionIsNotified();
	        fireRejectionEvent("unhandledRejection",
	                                      possiblyUnhandledRejection, reason, this);
	    }
	};

	Promise.prototype._setUnhandledRejectionIsNotified = function () {
	    this._bitField = this._bitField | 262144;
	};

	Promise.prototype._unsetUnhandledRejectionIsNotified = function () {
	    this._bitField = this._bitField & (~262144);
	};

	Promise.prototype._isUnhandledRejectionNotified = function () {
	    return (this._bitField & 262144) > 0;
	};

	Promise.prototype._setRejectionIsUnhandled = function () {
	    this._bitField = this._bitField | 1048576;
	};

	Promise.prototype._unsetRejectionIsUnhandled = function () {
	    this._bitField = this._bitField & (~1048576);
	    if (this._isUnhandledRejectionNotified()) {
	        this._unsetUnhandledRejectionIsNotified();
	        this._notifyUnhandledRejectionIsHandled();
	    }
	};

	Promise.prototype._isRejectionUnhandled = function () {
	    return (this._bitField & 1048576) > 0;
	};

	Promise.prototype._warn = function(message, shouldUseOwnTrace, promise) {
	    return warn(message, shouldUseOwnTrace, promise || this);
	};

	Promise.onPossiblyUnhandledRejection = function (fn) {
	    var domain = getDomain();
	    possiblyUnhandledRejection =
	        typeof fn === "function" ? (domain === null ?
	                                            fn : util.domainBind(domain, fn))
	                                 : undefined;
	};

	Promise.onUnhandledRejectionHandled = function (fn) {
	    var domain = getDomain();
	    unhandledRejectionHandled =
	        typeof fn === "function" ? (domain === null ?
	                                            fn : util.domainBind(domain, fn))
	                                 : undefined;
	};

	var disableLongStackTraces = function() {};
	Promise.longStackTraces = function () {
	    if (async.haveItemsQueued() && !config.longStackTraces) {
	        throw new Error("cannot enable long stack traces after promises have been created\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
	    }
	    if (!config.longStackTraces && longStackTracesIsSupported()) {
	        var Promise_captureStackTrace = Promise.prototype._captureStackTrace;
	        var Promise_attachExtraTrace = Promise.prototype._attachExtraTrace;
	        config.longStackTraces = true;
	        disableLongStackTraces = function() {
	            if (async.haveItemsQueued() && !config.longStackTraces) {
	                throw new Error("cannot enable long stack traces after promises have been created\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
	            }
	            Promise.prototype._captureStackTrace = Promise_captureStackTrace;
	            Promise.prototype._attachExtraTrace = Promise_attachExtraTrace;
	            Context.deactivateLongStackTraces();
	            async.enableTrampoline();
	            config.longStackTraces = false;
	        };
	        Promise.prototype._captureStackTrace = longStackTracesCaptureStackTrace;
	        Promise.prototype._attachExtraTrace = longStackTracesAttachExtraTrace;
	        Context.activateLongStackTraces();
	        async.disableTrampolineIfNecessary();
	    }
	};

	Promise.hasLongStackTraces = function () {
	    return config.longStackTraces && longStackTracesIsSupported();
	};

	var fireDomEvent = (function() {
	    try {
	        if (typeof CustomEvent === "function") {
	            var event = new CustomEvent("CustomEvent");
	            util.global.dispatchEvent(event);
	            return function(name, event) {
	                var domEvent = new CustomEvent(name.toLowerCase(), {
	                    detail: event,
	                    cancelable: true
	                });
	                return !util.global.dispatchEvent(domEvent);
	            };
	        } else if (typeof Event === "function") {
	            var event = new Event("CustomEvent");
	            util.global.dispatchEvent(event);
	            return function(name, event) {
	                var domEvent = new Event(name.toLowerCase(), {
	                    cancelable: true
	                });
	                domEvent.detail = event;
	                return !util.global.dispatchEvent(domEvent);
	            };
	        } else {
	            var event = document.createEvent("CustomEvent");
	            event.initCustomEvent("testingtheevent", false, true, {});
	            util.global.dispatchEvent(event);
	            return function(name, event) {
	                var domEvent = document.createEvent("CustomEvent");
	                domEvent.initCustomEvent(name.toLowerCase(), false, true,
	                    event);
	                return !util.global.dispatchEvent(domEvent);
	            };
	        }
	    } catch (e) {}
	    return function() {
	        return false;
	    };
	})();

	var fireGlobalEvent = (function() {
	    if (util.isNode) {
	        return function() {
	            return process.emit.apply(process, arguments);
	        };
	    } else {
	        if (!util.global) {
	            return function() {
	                return false;
	            };
	        }
	        return function(name) {
	            var methodName = "on" + name.toLowerCase();
	            var method = util.global[methodName];
	            if (!method) return false;
	            method.apply(util.global, [].slice.call(arguments, 1));
	            return true;
	        };
	    }
	})();

	function generatePromiseLifecycleEventObject(name, promise) {
	    return {promise: promise};
	}

	var eventToObjectGenerator = {
	    promiseCreated: generatePromiseLifecycleEventObject,
	    promiseFulfilled: generatePromiseLifecycleEventObject,
	    promiseRejected: generatePromiseLifecycleEventObject,
	    promiseResolved: generatePromiseLifecycleEventObject,
	    promiseCancelled: generatePromiseLifecycleEventObject,
	    promiseChained: function(name, promise, child) {
	        return {promise: promise, child: child};
	    },
	    warning: function(name, warning) {
	        return {warning: warning};
	    },
	    unhandledRejection: function (name, reason, promise) {
	        return {reason: reason, promise: promise};
	    },
	    rejectionHandled: generatePromiseLifecycleEventObject
	};

	var activeFireEvent = function (name) {
	    var globalEventFired = false;
	    try {
	        globalEventFired = fireGlobalEvent.apply(null, arguments);
	    } catch (e) {
	        async.throwLater(e);
	        globalEventFired = true;
	    }

	    var domEventFired = false;
	    try {
	        domEventFired = fireDomEvent(name,
	                    eventToObjectGenerator[name].apply(null, arguments));
	    } catch (e) {
	        async.throwLater(e);
	        domEventFired = true;
	    }

	    return domEventFired || globalEventFired;
	};

	Promise.config = function(opts) {
	    opts = Object(opts);
	    if ("longStackTraces" in opts) {
	        if (opts.longStackTraces) {
	            Promise.longStackTraces();
	        } else if (!opts.longStackTraces && Promise.hasLongStackTraces()) {
	            disableLongStackTraces();
	        }
	    }
	    if ("warnings" in opts) {
	        var warningsOption = opts.warnings;
	        config.warnings = !!warningsOption;
	        wForgottenReturn = config.warnings;

	        if (util.isObject(warningsOption)) {
	            if ("wForgottenReturn" in warningsOption) {
	                wForgottenReturn = !!warningsOption.wForgottenReturn;
	            }
	        }
	    }
	    if ("cancellation" in opts && opts.cancellation && !config.cancellation) {
	        if (async.haveItemsQueued()) {
	            throw new Error(
	                "cannot enable cancellation after promises are in use");
	        }
	        Promise.prototype._clearCancellationData =
	            cancellationClearCancellationData;
	        Promise.prototype._propagateFrom = cancellationPropagateFrom;
	        Promise.prototype._onCancel = cancellationOnCancel;
	        Promise.prototype._setOnCancel = cancellationSetOnCancel;
	        Promise.prototype._attachCancellationCallback =
	            cancellationAttachCancellationCallback;
	        Promise.prototype._execute = cancellationExecute;
	        propagateFromFunction = cancellationPropagateFrom;
	        config.cancellation = true;
	    }
	    if ("monitoring" in opts) {
	        if (opts.monitoring && !config.monitoring) {
	            config.monitoring = true;
	            Promise.prototype._fireEvent = activeFireEvent;
	        } else if (!opts.monitoring && config.monitoring) {
	            config.monitoring = false;
	            Promise.prototype._fireEvent = defaultFireEvent;
	        }
	    }
	};

	function defaultFireEvent() { return false; }

	Promise.prototype._fireEvent = defaultFireEvent;
	Promise.prototype._execute = function(executor, resolve, reject) {
	    try {
	        executor(resolve, reject);
	    } catch (e) {
	        return e;
	    }
	};
	Promise.prototype._onCancel = function () {};
	Promise.prototype._setOnCancel = function (handler) { ; };
	Promise.prototype._attachCancellationCallback = function(onCancel) {
	    ;
	};
	Promise.prototype._captureStackTrace = function () {};
	Promise.prototype._attachExtraTrace = function () {};
	Promise.prototype._clearCancellationData = function() {};
	Promise.prototype._propagateFrom = function (parent, flags) {
	    ;
	    ;
	};

	function cancellationExecute(executor, resolve, reject) {
	    var promise = this;
	    try {
	        executor(resolve, reject, function(onCancel) {
	            if (typeof onCancel !== "function") {
	                throw new TypeError("onCancel must be a function, got: " +
	                                    util.toString(onCancel));
	            }
	            promise._attachCancellationCallback(onCancel);
	        });
	    } catch (e) {
	        return e;
	    }
	}

	function cancellationAttachCancellationCallback(onCancel) {
	    if (!this._isCancellable()) return this;

	    var previousOnCancel = this._onCancel();
	    if (previousOnCancel !== undefined) {
	        if (util.isArray(previousOnCancel)) {
	            previousOnCancel.push(onCancel);
	        } else {
	            this._setOnCancel([previousOnCancel, onCancel]);
	        }
	    } else {
	        this._setOnCancel(onCancel);
	    }
	}

	function cancellationOnCancel() {
	    return this._onCancelField;
	}

	function cancellationSetOnCancel(onCancel) {
	    this._onCancelField = onCancel;
	}

	function cancellationClearCancellationData() {
	    this._cancellationParent = undefined;
	    this._onCancelField = undefined;
	}

	function cancellationPropagateFrom(parent, flags) {
	    if ((flags & 1) !== 0) {
	        this._cancellationParent = parent;
	        var branchesRemainingToCancel = parent._branchesRemainingToCancel;
	        if (branchesRemainingToCancel === undefined) {
	            branchesRemainingToCancel = 0;
	        }
	        parent._branchesRemainingToCancel = branchesRemainingToCancel + 1;
	    }
	    if ((flags & 2) !== 0 && parent._isBound()) {
	        this._setBoundTo(parent._boundTo);
	    }
	}

	function bindingPropagateFrom(parent, flags) {
	    if ((flags & 2) !== 0 && parent._isBound()) {
	        this._setBoundTo(parent._boundTo);
	    }
	}
	var propagateFromFunction = bindingPropagateFrom;

	function boundValueFunction() {
	    var ret = this._boundTo;
	    if (ret !== undefined) {
	        if (ret instanceof Promise) {
	            if (ret.isFulfilled()) {
	                return ret.value();
	            } else {
	                return undefined;
	            }
	        }
	    }
	    return ret;
	}

	function longStackTracesCaptureStackTrace() {
	    this._trace = new CapturedTrace(this._peekContext());
	}

	function longStackTracesAttachExtraTrace(error, ignoreSelf) {
	    if (canAttachTrace(error)) {
	        var trace = this._trace;
	        if (trace !== undefined) {
	            if (ignoreSelf) trace = trace._parent;
	        }
	        if (trace !== undefined) {
	            trace.attachExtraTrace(error);
	        } else if (!error.__stackCleaned__) {
	            var parsed = parseStackAndMessage(error);
	            util.notEnumerableProp(error, "stack",
	                parsed.message + "\n" + parsed.stack.join("\n"));
	            util.notEnumerableProp(error, "__stackCleaned__", true);
	        }
	    }
	}

	function checkForgottenReturns(returnValue, promiseCreated, name, promise,
	                               parent) {
	    if (returnValue === undefined && promiseCreated !== null &&
	        wForgottenReturn) {
	        if (parent !== undefined && parent._returnedNonUndefined()) return;
	        if ((promise._bitField & 65535) === 0) return;

	        if (name) name = name + " ";
	        var handlerLine = "";
	        var creatorLine = "";
	        if (promiseCreated._trace) {
	            var traceLines = promiseCreated._trace.stack.split("\n");
	            var stack = cleanStack(traceLines);
	            for (var i = stack.length - 1; i >= 0; --i) {
	                var line = stack[i];
	                if (!nodeFramePattern.test(line)) {
	                    var lineMatches = line.match(parseLinePattern);
	                    if (lineMatches) {
	                        handlerLine  = "at " + lineMatches[1] +
	                            ":" + lineMatches[2] + ":" + lineMatches[3] + " ";
	                    }
	                    break;
	                }
	            }

	            if (stack.length > 0) {
	                var firstUserLine = stack[0];
	                for (var i = 0; i < traceLines.length; ++i) {

	                    if (traceLines[i] === firstUserLine) {
	                        if (i > 0) {
	                            creatorLine = "\n" + traceLines[i - 1];
	                        }
	                        break;
	                    }
	                }

	            }
	        }
	        var msg = "a promise was created in a " + name +
	            "handler " + handlerLine + "but was not returned from it, " +
	            "see http://goo.gl/rRqMUw" +
	            creatorLine;
	        promise._warn(msg, true, promiseCreated);
	    }
	}

	function deprecated(name, replacement) {
	    var message = name +
	        " is deprecated and will be removed in a future version.";
	    if (replacement) message += " Use " + replacement + " instead.";
	    return warn(message);
	}

	function warn(message, shouldUseOwnTrace, promise) {
	    if (!config.warnings) return;
	    var warning = new Warning(message);
	    var ctx;
	    if (shouldUseOwnTrace) {
	        promise._attachExtraTrace(warning);
	    } else if (config.longStackTraces && (ctx = Promise._peekContext())) {
	        ctx.attachExtraTrace(warning);
	    } else {
	        var parsed = parseStackAndMessage(warning);
	        warning.stack = parsed.message + "\n" + parsed.stack.join("\n");
	    }

	    if (!activeFireEvent("warning", warning)) {
	        formatAndLogError(warning, "", true);
	    }
	}

	function reconstructStack(message, stacks) {
	    for (var i = 0; i < stacks.length - 1; ++i) {
	        stacks[i].push("From previous event:");
	        stacks[i] = stacks[i].join("\n");
	    }
	    if (i < stacks.length) {
	        stacks[i] = stacks[i].join("\n");
	    }
	    return message + "\n" + stacks.join("\n");
	}

	function removeDuplicateOrEmptyJumps(stacks) {
	    for (var i = 0; i < stacks.length; ++i) {
	        if (stacks[i].length === 0 ||
	            ((i + 1 < stacks.length) && stacks[i][0] === stacks[i+1][0])) {
	            stacks.splice(i, 1);
	            i--;
	        }
	    }
	}

	function removeCommonRoots(stacks) {
	    var current = stacks[0];
	    for (var i = 1; i < stacks.length; ++i) {
	        var prev = stacks[i];
	        var currentLastIndex = current.length - 1;
	        var currentLastLine = current[currentLastIndex];
	        var commonRootMeetPoint = -1;

	        for (var j = prev.length - 1; j >= 0; --j) {
	            if (prev[j] === currentLastLine) {
	                commonRootMeetPoint = j;
	                break;
	            }
	        }

	        for (var j = commonRootMeetPoint; j >= 0; --j) {
	            var line = prev[j];
	            if (current[currentLastIndex] === line) {
	                current.pop();
	                currentLastIndex--;
	            } else {
	                break;
	            }
	        }
	        current = prev;
	    }
	}

	function cleanStack(stack) {
	    var ret = [];
	    for (var i = 0; i < stack.length; ++i) {
	        var line = stack[i];
	        var isTraceLine = "    (No stack trace)" === line ||
	            stackFramePattern.test(line);
	        var isInternalFrame = isTraceLine && shouldIgnore(line);
	        if (isTraceLine && !isInternalFrame) {
	            if (indentStackFrames && line.charAt(0) !== " ") {
	                line = "    " + line;
	            }
	            ret.push(line);
	        }
	    }
	    return ret;
	}

	function stackFramesAsArray(error) {
	    var stack = error.stack.replace(/\s+$/g, "").split("\n");
	    for (var i = 0; i < stack.length; ++i) {
	        var line = stack[i];
	        if ("    (No stack trace)" === line || stackFramePattern.test(line)) {
	            break;
	        }
	    }
	    if (i > 0) {
	        stack = stack.slice(i);
	    }
	    return stack;
	}

	function parseStackAndMessage(error) {
	    var stack = error.stack;
	    var message = error.toString();
	    stack = typeof stack === "string" && stack.length > 0
	                ? stackFramesAsArray(error) : ["    (No stack trace)"];
	    return {
	        message: message,
	        stack: cleanStack(stack)
	    };
	}

	function formatAndLogError(error, title, isSoft) {
	    if (typeof console !== "undefined") {
	        var message;
	        if (util.isObject(error)) {
	            var stack = error.stack;
	            message = title + formatStack(stack, error);
	        } else {
	            message = title + String(error);
	        }
	        if (typeof printWarning === "function") {
	            printWarning(message, isSoft);
	        } else if (typeof console.log === "function" ||
	            typeof console.log === "object") {
	            console.log(message);
	        }
	    }
	}

	function fireRejectionEvent(name, localHandler, reason, promise) {
	    var localEventFired = false;
	    try {
	        if (typeof localHandler === "function") {
	            localEventFired = true;
	            if (name === "rejectionHandled") {
	                localHandler(promise);
	            } else {
	                localHandler(reason, promise);
	            }
	        }
	    } catch (e) {
	        async.throwLater(e);
	    }

	    if (name === "unhandledRejection") {
	        if (!activeFireEvent(name, reason, promise) && !localEventFired) {
	            formatAndLogError(reason, "Unhandled rejection ");
	        }
	    } else {
	        activeFireEvent(name, promise);
	    }
	}

	function formatNonError(obj) {
	    var str;
	    if (typeof obj === "function") {
	        str = "[function " +
	            (obj.name || "anonymous") +
	            "]";
	    } else {
	        str = obj && typeof obj.toString === "function"
	            ? obj.toString() : util.toString(obj);
	        var ruselessToString = /\[object [a-zA-Z0-9$_]+\]/;
	        if (ruselessToString.test(str)) {
	            try {
	                var newStr = JSON.stringify(obj);
	                str = newStr;
	            }
	            catch(e) {

	            }
	        }
	        if (str.length === 0) {
	            str = "(empty array)";
	        }
	    }
	    return ("(<" + snip(str) + ">, no stack trace)");
	}

	function snip(str) {
	    var maxChars = 41;
	    if (str.length < maxChars) {
	        return str;
	    }
	    return str.substr(0, maxChars - 3) + "...";
	}

	function longStackTracesIsSupported() {
	    return typeof captureStackTrace === "function";
	}

	var shouldIgnore = function() { return false; };
	var parseLineInfoRegex = /[\/<\(]([^:\/]+):(\d+):(?:\d+)\)?\s*$/;
	function parseLineInfo(line) {
	    var matches = line.match(parseLineInfoRegex);
	    if (matches) {
	        return {
	            fileName: matches[1],
	            line: parseInt(matches[2], 10)
	        };
	    }
	}

	function setBounds(firstLineError, lastLineError) {
	    if (!longStackTracesIsSupported()) return;
	    var firstStackLines = firstLineError.stack.split("\n");
	    var lastStackLines = lastLineError.stack.split("\n");
	    var firstIndex = -1;
	    var lastIndex = -1;
	    var firstFileName;
	    var lastFileName;
	    for (var i = 0; i < firstStackLines.length; ++i) {
	        var result = parseLineInfo(firstStackLines[i]);
	        if (result) {
	            firstFileName = result.fileName;
	            firstIndex = result.line;
	            break;
	        }
	    }
	    for (var i = 0; i < lastStackLines.length; ++i) {
	        var result = parseLineInfo(lastStackLines[i]);
	        if (result) {
	            lastFileName = result.fileName;
	            lastIndex = result.line;
	            break;
	        }
	    }
	    if (firstIndex < 0 || lastIndex < 0 || !firstFileName || !lastFileName ||
	        firstFileName !== lastFileName || firstIndex >= lastIndex) {
	        return;
	    }

	    shouldIgnore = function(line) {
	        if (bluebirdFramePattern.test(line)) return true;
	        var info = parseLineInfo(line);
	        if (info) {
	            if (info.fileName === firstFileName &&
	                (firstIndex <= info.line && info.line <= lastIndex)) {
	                return true;
	            }
	        }
	        return false;
	    };
	}

	function CapturedTrace(parent) {
	    this._parent = parent;
	    this._promisesCreated = 0;
	    var length = this._length = 1 + (parent === undefined ? 0 : parent._length);
	    captureStackTrace(this, CapturedTrace);
	    if (length > 32) this.uncycle();
	}
	util.inherits(CapturedTrace, Error);
	Context.CapturedTrace = CapturedTrace;

	CapturedTrace.prototype.uncycle = function() {
	    var length = this._length;
	    if (length < 2) return;
	    var nodes = [];
	    var stackToIndex = {};

	    for (var i = 0, node = this; node !== undefined; ++i) {
	        nodes.push(node);
	        node = node._parent;
	    }
	    length = this._length = i;
	    for (var i = length - 1; i >= 0; --i) {
	        var stack = nodes[i].stack;
	        if (stackToIndex[stack] === undefined) {
	            stackToIndex[stack] = i;
	        }
	    }
	    for (var i = 0; i < length; ++i) {
	        var currentStack = nodes[i].stack;
	        var index = stackToIndex[currentStack];
	        if (index !== undefined && index !== i) {
	            if (index > 0) {
	                nodes[index - 1]._parent = undefined;
	                nodes[index - 1]._length = 1;
	            }
	            nodes[i]._parent = undefined;
	            nodes[i]._length = 1;
	            var cycleEdgeNode = i > 0 ? nodes[i - 1] : this;

	            if (index < length - 1) {
	                cycleEdgeNode._parent = nodes[index + 1];
	                cycleEdgeNode._parent.uncycle();
	                cycleEdgeNode._length =
	                    cycleEdgeNode._parent._length + 1;
	            } else {
	                cycleEdgeNode._parent = undefined;
	                cycleEdgeNode._length = 1;
	            }
	            var currentChildLength = cycleEdgeNode._length + 1;
	            for (var j = i - 2; j >= 0; --j) {
	                nodes[j]._length = currentChildLength;
	                currentChildLength++;
	            }
	            return;
	        }
	    }
	};

	CapturedTrace.prototype.attachExtraTrace = function(error) {
	    if (error.__stackCleaned__) return;
	    this.uncycle();
	    var parsed = parseStackAndMessage(error);
	    var message = parsed.message;
	    var stacks = [parsed.stack];

	    var trace = this;
	    while (trace !== undefined) {
	        stacks.push(cleanStack(trace.stack.split("\n")));
	        trace = trace._parent;
	    }
	    removeCommonRoots(stacks);
	    removeDuplicateOrEmptyJumps(stacks);
	    util.notEnumerableProp(error, "stack", reconstructStack(message, stacks));
	    util.notEnumerableProp(error, "__stackCleaned__", true);
	};

	var captureStackTrace = (function stackDetection() {
	    var v8stackFramePattern = /^\s*at\s*/;
	    var v8stackFormatter = function(stack, error) {
	        if (typeof stack === "string") return stack;

	        if (error.name !== undefined &&
	            error.message !== undefined) {
	            return error.toString();
	        }
	        return formatNonError(error);
	    };

	    if (typeof Error.stackTraceLimit === "number" &&
	        typeof Error.captureStackTrace === "function") {
	        Error.stackTraceLimit += 6;
	        stackFramePattern = v8stackFramePattern;
	        formatStack = v8stackFormatter;
	        var captureStackTrace = Error.captureStackTrace;

	        shouldIgnore = function(line) {
	            return bluebirdFramePattern.test(line);
	        };
	        return function(receiver, ignoreUntil) {
	            Error.stackTraceLimit += 6;
	            captureStackTrace(receiver, ignoreUntil);
	            Error.stackTraceLimit -= 6;
	        };
	    }
	    var err = new Error();

	    if (typeof err.stack === "string" &&
	        err.stack.split("\n")[0].indexOf("stackDetection@") >= 0) {
	        stackFramePattern = /@/;
	        formatStack = v8stackFormatter;
	        indentStackFrames = true;
	        return function captureStackTrace(o) {
	            o.stack = new Error().stack;
	        };
	    }

	    var hasStackAfterThrow;
	    try { throw new Error(); }
	    catch(e) {
	        hasStackAfterThrow = ("stack" in e);
	    }
	    if (!("stack" in err) && hasStackAfterThrow &&
	        typeof Error.stackTraceLimit === "number") {
	        stackFramePattern = v8stackFramePattern;
	        formatStack = v8stackFormatter;
	        return function captureStackTrace(o) {
	            Error.stackTraceLimit += 6;
	            try { throw new Error(); }
	            catch(e) { o.stack = e.stack; }
	            Error.stackTraceLimit -= 6;
	        };
	    }

	    formatStack = function(stack, error) {
	        if (typeof stack === "string") return stack;

	        if ((typeof error === "object" ||
	            typeof error === "function") &&
	            error.name !== undefined &&
	            error.message !== undefined) {
	            return error.toString();
	        }
	        return formatNonError(error);
	    };

	    return null;

	})([]);

	if (typeof console !== "undefined" && typeof console.warn !== "undefined") {
	    printWarning = function (message) {
	        console.warn(message);
	    };
	    if (util.isNode && process.stderr.isTTY) {
	        printWarning = function(message, isSoft) {
	            var color = isSoft ? "\u001b[33m" : "\u001b[31m";
	            console.warn(color + message + "\u001b[0m\n");
	        };
	    } else if (!util.isNode && typeof (new Error().stack) === "string") {
	        printWarning = function(message, isSoft) {
	            console.warn("%c" + message,
	                        isSoft ? "color: darkorange" : "color: red");
	        };
	    }
	}

	var config = {
	    warnings: warnings,
	    longStackTraces: false,
	    cancellation: false,
	    monitoring: false
	};

	if (longStackTraces) Promise.longStackTraces();

	return {
	    longStackTraces: function() {
	        return config.longStackTraces;
	    },
	    warnings: function() {
	        return config.warnings;
	    },
	    cancellation: function() {
	        return config.cancellation;
	    },
	    monitoring: function() {
	        return config.monitoring;
	    },
	    propagateFromFunction: function() {
	        return propagateFromFunction;
	    },
	    boundValueFunction: function() {
	        return boundValueFunction;
	    },
	    checkForgottenReturns: checkForgottenReturns,
	    setBounds: setBounds,
	    warn: warn,
	    deprecated: deprecated,
	    CapturedTrace: CapturedTrace,
	    fireDomEvent: fireDomEvent,
	    fireGlobalEvent: fireGlobalEvent
	};
	};

	},{"./errors":12,"./util":36}],10:[function(_dereq_,module,exports){
	"use strict";
	module.exports = function(Promise) {
	function returner() {
	    return this.value;
	}
	function thrower() {
	    throw this.reason;
	}

	Promise.prototype["return"] =
	Promise.prototype.thenReturn = function (value) {
	    if (value instanceof Promise) value.suppressUnhandledRejections();
	    return this._then(
	        returner, undefined, undefined, {value: value}, undefined);
	};

	Promise.prototype["throw"] =
	Promise.prototype.thenThrow = function (reason) {
	    return this._then(
	        thrower, undefined, undefined, {reason: reason}, undefined);
	};

	Promise.prototype.catchThrow = function (reason) {
	    if (arguments.length <= 1) {
	        return this._then(
	            undefined, thrower, undefined, {reason: reason}, undefined);
	    } else {
	        var _reason = arguments[1];
	        var handler = function() {throw _reason;};
	        return this.caught(reason, handler);
	    }
	};

	Promise.prototype.catchReturn = function (value) {
	    if (arguments.length <= 1) {
	        if (value instanceof Promise) value.suppressUnhandledRejections();
	        return this._then(
	            undefined, returner, undefined, {value: value}, undefined);
	    } else {
	        var _value = arguments[1];
	        if (_value instanceof Promise) _value.suppressUnhandledRejections();
	        var handler = function() {return _value;};
	        return this.caught(value, handler);
	    }
	};
	};

	},{}],11:[function(_dereq_,module,exports){
	"use strict";
	module.exports = function(Promise, INTERNAL) {
	var PromiseReduce = Promise.reduce;
	var PromiseAll = Promise.all;

	function promiseAllThis() {
	    return PromiseAll(this);
	}

	function PromiseMapSeries(promises, fn) {
	    return PromiseReduce(promises, fn, INTERNAL, INTERNAL);
	}

	Promise.prototype.each = function (fn) {
	    return PromiseReduce(this, fn, INTERNAL, 0)
	              ._then(promiseAllThis, undefined, undefined, this, undefined);
	};

	Promise.prototype.mapSeries = function (fn) {
	    return PromiseReduce(this, fn, INTERNAL, INTERNAL);
	};

	Promise.each = function (promises, fn) {
	    return PromiseReduce(promises, fn, INTERNAL, 0)
	              ._then(promiseAllThis, undefined, undefined, promises, undefined);
	};

	Promise.mapSeries = PromiseMapSeries;
	};


	},{}],12:[function(_dereq_,module,exports){
	"use strict";
	var es5 = _dereq_("./es5");
	var Objectfreeze = es5.freeze;
	var util = _dereq_("./util");
	var inherits = util.inherits;
	var notEnumerableProp = util.notEnumerableProp;

	function subError(nameProperty, defaultMessage) {
	    function SubError(message) {
	        if (!(this instanceof SubError)) return new SubError(message);
	        notEnumerableProp(this, "message",
	            typeof message === "string" ? message : defaultMessage);
	        notEnumerableProp(this, "name", nameProperty);
	        if (Error.captureStackTrace) {
	            Error.captureStackTrace(this, this.constructor);
	        } else {
	            Error.call(this);
	        }
	    }
	    inherits(SubError, Error);
	    return SubError;
	}

	var _TypeError, _RangeError;
	var Warning = subError("Warning", "warning");
	var CancellationError = subError("CancellationError", "cancellation error");
	var TimeoutError = subError("TimeoutError", "timeout error");
	var AggregateError = subError("AggregateError", "aggregate error");
	try {
	    _TypeError = TypeError;
	    _RangeError = RangeError;
	} catch(e) {
	    _TypeError = subError("TypeError", "type error");
	    _RangeError = subError("RangeError", "range error");
	}

	var methods = ("join pop push shift unshift slice filter forEach some " +
	    "every map indexOf lastIndexOf reduce reduceRight sort reverse").split(" ");

	for (var i = 0; i < methods.length; ++i) {
	    if (typeof Array.prototype[methods[i]] === "function") {
	        AggregateError.prototype[methods[i]] = Array.prototype[methods[i]];
	    }
	}

	es5.defineProperty(AggregateError.prototype, "length", {
	    value: 0,
	    configurable: false,
	    writable: true,
	    enumerable: true
	});
	AggregateError.prototype["isOperational"] = true;
	var level = 0;
	AggregateError.prototype.toString = function() {
	    var indent = Array(level * 4 + 1).join(" ");
	    var ret = "\n" + indent + "AggregateError of:" + "\n";
	    level++;
	    indent = Array(level * 4 + 1).join(" ");
	    for (var i = 0; i < this.length; ++i) {
	        var str = this[i] === this ? "[Circular AggregateError]" : this[i] + "";
	        var lines = str.split("\n");
	        for (var j = 0; j < lines.length; ++j) {
	            lines[j] = indent + lines[j];
	        }
	        str = lines.join("\n");
	        ret += str + "\n";
	    }
	    level--;
	    return ret;
	};

	function OperationalError(message) {
	    if (!(this instanceof OperationalError))
	        return new OperationalError(message);
	    notEnumerableProp(this, "name", "OperationalError");
	    notEnumerableProp(this, "message", message);
	    this.cause = message;
	    this["isOperational"] = true;

	    if (message instanceof Error) {
	        notEnumerableProp(this, "message", message.message);
	        notEnumerableProp(this, "stack", message.stack);
	    } else if (Error.captureStackTrace) {
	        Error.captureStackTrace(this, this.constructor);
	    }

	}
	inherits(OperationalError, Error);

	var errorTypes = Error["__BluebirdErrorTypes__"];
	if (!errorTypes) {
	    errorTypes = Objectfreeze({
	        CancellationError: CancellationError,
	        TimeoutError: TimeoutError,
	        OperationalError: OperationalError,
	        RejectionError: OperationalError,
	        AggregateError: AggregateError
	    });
	    es5.defineProperty(Error, "__BluebirdErrorTypes__", {
	        value: errorTypes,
	        writable: false,
	        enumerable: false,
	        configurable: false
	    });
	}

	module.exports = {
	    Error: Error,
	    TypeError: _TypeError,
	    RangeError: _RangeError,
	    CancellationError: errorTypes.CancellationError,
	    OperationalError: errorTypes.OperationalError,
	    TimeoutError: errorTypes.TimeoutError,
	    AggregateError: errorTypes.AggregateError,
	    Warning: Warning
	};

	},{"./es5":13,"./util":36}],13:[function(_dereq_,module,exports){
	var isES5 = (function(){
	    "use strict";
	    return this === undefined;
	})();

	if (isES5) {
	    module.exports = {
	        freeze: Object.freeze,
	        defineProperty: Object.defineProperty,
	        getDescriptor: Object.getOwnPropertyDescriptor,
	        keys: Object.keys,
	        names: Object.getOwnPropertyNames,
	        getPrototypeOf: Object.getPrototypeOf,
	        isArray: Array.isArray,
	        isES5: isES5,
	        propertyIsWritable: function(obj, prop) {
	            var descriptor = Object.getOwnPropertyDescriptor(obj, prop);
	            return !!(!descriptor || descriptor.writable || descriptor.set);
	        }
	    };
	} else {
	    var has = {}.hasOwnProperty;
	    var str = {}.toString;
	    var proto = {}.constructor.prototype;

	    var ObjectKeys = function (o) {
	        var ret = [];
	        for (var key in o) {
	            if (has.call(o, key)) {
	                ret.push(key);
	            }
	        }
	        return ret;
	    };

	    var ObjectGetDescriptor = function(o, key) {
	        return {value: o[key]};
	    };

	    var ObjectDefineProperty = function (o, key, desc) {
	        o[key] = desc.value;
	        return o;
	    };

	    var ObjectFreeze = function (obj) {
	        return obj;
	    };

	    var ObjectGetPrototypeOf = function (obj) {
	        try {
	            return Object(obj).constructor.prototype;
	        }
	        catch (e) {
	            return proto;
	        }
	    };

	    var ArrayIsArray = function (obj) {
	        try {
	            return str.call(obj) === "[object Array]";
	        }
	        catch(e) {
	            return false;
	        }
	    };

	    module.exports = {
	        isArray: ArrayIsArray,
	        keys: ObjectKeys,
	        names: ObjectKeys,
	        defineProperty: ObjectDefineProperty,
	        getDescriptor: ObjectGetDescriptor,
	        freeze: ObjectFreeze,
	        getPrototypeOf: ObjectGetPrototypeOf,
	        isES5: isES5,
	        propertyIsWritable: function() {
	            return true;
	        }
	    };
	}

	},{}],14:[function(_dereq_,module,exports){
	"use strict";
	module.exports = function(Promise, INTERNAL) {
	var PromiseMap = Promise.map;

	Promise.prototype.filter = function (fn, options) {
	    return PromiseMap(this, fn, options, INTERNAL);
	};

	Promise.filter = function (promises, fn, options) {
	    return PromiseMap(promises, fn, options, INTERNAL);
	};
	};

	},{}],15:[function(_dereq_,module,exports){
	"use strict";
	module.exports = function(Promise, tryConvertToPromise) {
	var util = _dereq_("./util");
	var CancellationError = Promise.CancellationError;
	var errorObj = util.errorObj;

	function PassThroughHandlerContext(promise, type, handler) {
	    this.promise = promise;
	    this.type = type;
	    this.handler = handler;
	    this.called = false;
	    this.cancelPromise = null;
	}

	PassThroughHandlerContext.prototype.isFinallyHandler = function() {
	    return this.type === 0;
	};

	function FinallyHandlerCancelReaction(finallyHandler) {
	    this.finallyHandler = finallyHandler;
	}

	FinallyHandlerCancelReaction.prototype._resultCancelled = function() {
	    checkCancel(this.finallyHandler);
	};

	function checkCancel(ctx, reason) {
	    if (ctx.cancelPromise != null) {
	        if (arguments.length > 1) {
	            ctx.cancelPromise._reject(reason);
	        } else {
	            ctx.cancelPromise._cancel();
	        }
	        ctx.cancelPromise = null;
	        return true;
	    }
	    return false;
	}

	function succeed() {
	    return finallyHandler.call(this, this.promise._target()._settledValue());
	}
	function fail(reason) {
	    if (checkCancel(this, reason)) return;
	    errorObj.e = reason;
	    return errorObj;
	}
	function finallyHandler(reasonOrValue) {
	    var promise = this.promise;
	    var handler = this.handler;

	    if (!this.called) {
	        this.called = true;
	        var ret = this.isFinallyHandler()
	            ? handler.call(promise._boundValue())
	            : handler.call(promise._boundValue(), reasonOrValue);
	        if (ret !== undefined) {
	            promise._setReturnedNonUndefined();
	            var maybePromise = tryConvertToPromise(ret, promise);
	            if (maybePromise instanceof Promise) {
	                if (this.cancelPromise != null) {
	                    if (maybePromise._isCancelled()) {
	                        var reason =
	                            new CancellationError("late cancellation observer");
	                        promise._attachExtraTrace(reason);
	                        errorObj.e = reason;
	                        return errorObj;
	                    } else if (maybePromise.isPending()) {
	                        maybePromise._attachCancellationCallback(
	                            new FinallyHandlerCancelReaction(this));
	                    }
	                }
	                return maybePromise._then(
	                    succeed, fail, undefined, this, undefined);
	            }
	        }
	    }

	    if (promise.isRejected()) {
	        checkCancel(this);
	        errorObj.e = reasonOrValue;
	        return errorObj;
	    } else {
	        checkCancel(this);
	        return reasonOrValue;
	    }
	}

	Promise.prototype._passThrough = function(handler, type, success, fail) {
	    if (typeof handler !== "function") return this.then();
	    return this._then(success,
	                      fail,
	                      undefined,
	                      new PassThroughHandlerContext(this, type, handler),
	                      undefined);
	};

	Promise.prototype.lastly =
	Promise.prototype["finally"] = function (handler) {
	    return this._passThrough(handler,
	                             0,
	                             finallyHandler,
	                             finallyHandler);
	};

	Promise.prototype.tap = function (handler) {
	    return this._passThrough(handler, 1, finallyHandler);
	};

	return PassThroughHandlerContext;
	};

	},{"./util":36}],16:[function(_dereq_,module,exports){
	"use strict";
	module.exports = function(Promise,
	                          apiRejection,
	                          INTERNAL,
	                          tryConvertToPromise,
	                          Proxyable,
	                          debug) {
	var errors = _dereq_("./errors");
	var TypeError = errors.TypeError;
	var util = _dereq_("./util");
	var errorObj = util.errorObj;
	var tryCatch = util.tryCatch;
	var yieldHandlers = [];

	function promiseFromYieldHandler(value, yieldHandlers, traceParent) {
	    for (var i = 0; i < yieldHandlers.length; ++i) {
	        traceParent._pushContext();
	        var result = tryCatch(yieldHandlers[i])(value);
	        traceParent._popContext();
	        if (result === errorObj) {
	            traceParent._pushContext();
	            var ret = Promise.reject(errorObj.e);
	            traceParent._popContext();
	            return ret;
	        }
	        var maybePromise = tryConvertToPromise(result, traceParent);
	        if (maybePromise instanceof Promise) return maybePromise;
	    }
	    return null;
	}

	function PromiseSpawn(generatorFunction, receiver, yieldHandler, stack) {
	    if (debug.cancellation()) {
	        var internal = new Promise(INTERNAL);
	        var _finallyPromise = this._finallyPromise = new Promise(INTERNAL);
	        this._promise = internal.lastly(function() {
	            return _finallyPromise;
	        });
	        internal._captureStackTrace();
	        internal._setOnCancel(this);
	    } else {
	        var promise = this._promise = new Promise(INTERNAL);
	        promise._captureStackTrace();
	    }
	    this._stack = stack;
	    this._generatorFunction = generatorFunction;
	    this._receiver = receiver;
	    this._generator = undefined;
	    this._yieldHandlers = typeof yieldHandler === "function"
	        ? [yieldHandler].concat(yieldHandlers)
	        : yieldHandlers;
	    this._yieldedPromise = null;
	    this._cancellationPhase = false;
	}
	util.inherits(PromiseSpawn, Proxyable);

	PromiseSpawn.prototype._isResolved = function() {
	    return this._promise === null;
	};

	PromiseSpawn.prototype._cleanup = function() {
	    this._promise = this._generator = null;
	    if (debug.cancellation() && this._finallyPromise !== null) {
	        this._finallyPromise._fulfill();
	        this._finallyPromise = null;
	    }
	};

	PromiseSpawn.prototype._promiseCancelled = function() {
	    if (this._isResolved()) return;
	    var implementsReturn = typeof this._generator["return"] !== "undefined";

	    var result;
	    if (!implementsReturn) {
	        var reason = new Promise.CancellationError(
	            "generator .return() sentinel");
	        Promise.coroutine.returnSentinel = reason;
	        this._promise._attachExtraTrace(reason);
	        this._promise._pushContext();
	        result = tryCatch(this._generator["throw"]).call(this._generator,
	                                                         reason);
	        this._promise._popContext();
	    } else {
	        this._promise._pushContext();
	        result = tryCatch(this._generator["return"]).call(this._generator,
	                                                          undefined);
	        this._promise._popContext();
	    }
	    this._cancellationPhase = true;
	    this._yieldedPromise = null;
	    this._continue(result);
	};

	PromiseSpawn.prototype._promiseFulfilled = function(value) {
	    this._yieldedPromise = null;
	    this._promise._pushContext();
	    var result = tryCatch(this._generator.next).call(this._generator, value);
	    this._promise._popContext();
	    this._continue(result);
	};

	PromiseSpawn.prototype._promiseRejected = function(reason) {
	    this._yieldedPromise = null;
	    this._promise._attachExtraTrace(reason);
	    this._promise._pushContext();
	    var result = tryCatch(this._generator["throw"])
	        .call(this._generator, reason);
	    this._promise._popContext();
	    this._continue(result);
	};

	PromiseSpawn.prototype._resultCancelled = function() {
	    if (this._yieldedPromise instanceof Promise) {
	        var promise = this._yieldedPromise;
	        this._yieldedPromise = null;
	        promise.cancel();
	    }
	};

	PromiseSpawn.prototype.promise = function () {
	    return this._promise;
	};

	PromiseSpawn.prototype._run = function () {
	    this._generator = this._generatorFunction.call(this._receiver);
	    this._receiver =
	        this._generatorFunction = undefined;
	    this._promiseFulfilled(undefined);
	};

	PromiseSpawn.prototype._continue = function (result) {
	    var promise = this._promise;
	    if (result === errorObj) {
	        this._cleanup();
	        if (this._cancellationPhase) {
	            return promise.cancel();
	        } else {
	            return promise._rejectCallback(result.e, false);
	        }
	    }

	    var value = result.value;
	    if (result.done === true) {
	        this._cleanup();
	        if (this._cancellationPhase) {
	            return promise.cancel();
	        } else {
	            return promise._resolveCallback(value);
	        }
	    } else {
	        var maybePromise = tryConvertToPromise(value, this._promise);
	        if (!(maybePromise instanceof Promise)) {
	            maybePromise =
	                promiseFromYieldHandler(maybePromise,
	                                        this._yieldHandlers,
	                                        this._promise);
	            if (maybePromise === null) {
	                this._promiseRejected(
	                    new TypeError(
	                        "A value %s was yielded that could not be treated as a promise\u000a\u000a    See http://goo.gl/MqrFmX\u000a\u000a".replace("%s", value) +
	                        "From coroutine:\u000a" +
	                        this._stack.split("\n").slice(1, -7).join("\n")
	                    )
	                );
	                return;
	            }
	        }
	        maybePromise = maybePromise._target();
	        var bitField = maybePromise._bitField;
	        ;
	        if (((bitField & 50397184) === 0)) {
	            this._yieldedPromise = maybePromise;
	            maybePromise._proxy(this, null);
	        } else if (((bitField & 33554432) !== 0)) {
	            Promise._async.invoke(
	                this._promiseFulfilled, this, maybePromise._value()
	            );
	        } else if (((bitField & 16777216) !== 0)) {
	            Promise._async.invoke(
	                this._promiseRejected, this, maybePromise._reason()
	            );
	        } else {
	            this._promiseCancelled();
	        }
	    }
	};

	Promise.coroutine = function (generatorFunction, options) {
	    if (typeof generatorFunction !== "function") {
	        throw new TypeError("generatorFunction must be a function\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
	    }
	    var yieldHandler = Object(options).yieldHandler;
	    var PromiseSpawn$ = PromiseSpawn;
	    var stack = new Error().stack;
	    return function () {
	        var generator = generatorFunction.apply(this, arguments);
	        var spawn = new PromiseSpawn$(undefined, undefined, yieldHandler,
	                                      stack);
	        var ret = spawn.promise();
	        spawn._generator = generator;
	        spawn._promiseFulfilled(undefined);
	        return ret;
	    };
	};

	Promise.coroutine.addYieldHandler = function(fn) {
	    if (typeof fn !== "function") {
	        throw new TypeError("expecting a function but got " + util.classString(fn));
	    }
	    yieldHandlers.push(fn);
	};

	Promise.spawn = function (generatorFunction) {
	    debug.deprecated("Promise.spawn()", "Promise.coroutine()");
	    if (typeof generatorFunction !== "function") {
	        return apiRejection("generatorFunction must be a function\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
	    }
	    var spawn = new PromiseSpawn(generatorFunction, this);
	    var ret = spawn.promise();
	    spawn._run(Promise.spawn);
	    return ret;
	};
	};

	},{"./errors":12,"./util":36}],17:[function(_dereq_,module,exports){
	"use strict";
	module.exports =
	function(Promise, PromiseArray, tryConvertToPromise, INTERNAL, async,
	         getDomain) {
	var util = _dereq_("./util");
	var canEvaluate = util.canEvaluate;
	var tryCatch = util.tryCatch;
	var errorObj = util.errorObj;
	var reject;

	if (false) {
	if (canEvaluate) {
	    var thenCallback = function(i) {
	        return new Function("value", "holder", "                             \n\
	            'use strict';                                                    \n\
	            holder.pIndex = value;                                           \n\
	            holder.checkFulfillment(this);                                   \n\
	            ".replace(/Index/g, i));
	    };

	    var promiseSetter = function(i) {
	        return new Function("promise", "holder", "                           \n\
	            'use strict';                                                    \n\
	            holder.pIndex = promise;                                         \n\
	            ".replace(/Index/g, i));
	    };

	    var generateHolderClass = function(total) {
	        var props = new Array(total);
	        for (var i = 0; i < props.length; ++i) {
	            props[i] = "this.p" + (i+1);
	        }
	        var assignment = props.join(" = ") + " = null;";
	        var cancellationCode= "var promise;\n" + props.map(function(prop) {
	            return "                                                         \n\
	                promise = " + prop + ";                                      \n\
	                if (promise instanceof Promise) {                            \n\
	                    promise.cancel();                                        \n\
	                }                                                            \n\
	            ";
	        }).join("\n");
	        var passedArguments = props.join(", ");
	        var name = "Holder$" + total;


	        var code = "return function(tryCatch, errorObj, Promise, async) {    \n\
	            'use strict';                                                    \n\
	            function [TheName](fn) {                                         \n\
	                [TheProperties]                                              \n\
	                this.fn = fn;                                                \n\
	                this.asyncNeeded = true;                                     \n\
	                this.now = 0;                                                \n\
	            }                                                                \n\
	                                                                             \n\
	            [TheName].prototype._callFunction = function(promise) {          \n\
	                promise._pushContext();                                      \n\
	                var ret = tryCatch(this.fn)([ThePassedArguments]);           \n\
	                promise._popContext();                                       \n\
	                if (ret === errorObj) {                                      \n\
	                    promise._rejectCallback(ret.e, false);                   \n\
	                } else {                                                     \n\
	                    promise._resolveCallback(ret);                           \n\
	                }                                                            \n\
	            };                                                               \n\
	                                                                             \n\
	            [TheName].prototype.checkFulfillment = function(promise) {       \n\
	                var now = ++this.now;                                        \n\
	                if (now === [TheTotal]) {                                    \n\
	                    if (this.asyncNeeded) {                                  \n\
	                        async.invoke(this._callFunction, this, promise);     \n\
	                    } else {                                                 \n\
	                        this._callFunction(promise);                         \n\
	                    }                                                        \n\
	                                                                             \n\
	                }                                                            \n\
	            };                                                               \n\
	                                                                             \n\
	            [TheName].prototype._resultCancelled = function() {              \n\
	                [CancellationCode]                                           \n\
	            };                                                               \n\
	                                                                             \n\
	            return [TheName];                                                \n\
	        }(tryCatch, errorObj, Promise, async);                               \n\
	        ";

	        code = code.replace(/\[TheName\]/g, name)
	            .replace(/\[TheTotal\]/g, total)
	            .replace(/\[ThePassedArguments\]/g, passedArguments)
	            .replace(/\[TheProperties\]/g, assignment)
	            .replace(/\[CancellationCode\]/g, cancellationCode);

	        return new Function("tryCatch", "errorObj", "Promise", "async", code)
	                           (tryCatch, errorObj, Promise, async);
	    };

	    var holderClasses = [];
	    var thenCallbacks = [];
	    var promiseSetters = [];

	    for (var i = 0; i < 8; ++i) {
	        holderClasses.push(generateHolderClass(i + 1));
	        thenCallbacks.push(thenCallback(i + 1));
	        promiseSetters.push(promiseSetter(i + 1));
	    }

	    reject = function (reason) {
	        this._reject(reason);
	    };
	}}

	Promise.join = function () {
	    var last = arguments.length - 1;
	    var fn;
	    if (last > 0 && typeof arguments[last] === "function") {
	        fn = arguments[last];
	        if (false) {
	            if (last <= 8 && canEvaluate) {
	                var ret = new Promise(INTERNAL);
	                ret._captureStackTrace();
	                var HolderClass = holderClasses[last - 1];
	                var holder = new HolderClass(fn);
	                var callbacks = thenCallbacks;

	                for (var i = 0; i < last; ++i) {
	                    var maybePromise = tryConvertToPromise(arguments[i], ret);
	                    if (maybePromise instanceof Promise) {
	                        maybePromise = maybePromise._target();
	                        var bitField = maybePromise._bitField;
	                        ;
	                        if (((bitField & 50397184) === 0)) {
	                            maybePromise._then(callbacks[i], reject,
	                                               undefined, ret, holder);
	                            promiseSetters[i](maybePromise, holder);
	                            holder.asyncNeeded = false;
	                        } else if (((bitField & 33554432) !== 0)) {
	                            callbacks[i].call(ret,
	                                              maybePromise._value(), holder);
	                        } else if (((bitField & 16777216) !== 0)) {
	                            ret._reject(maybePromise._reason());
	                        } else {
	                            ret._cancel();
	                        }
	                    } else {
	                        callbacks[i].call(ret, maybePromise, holder);
	                    }
	                }

	                if (!ret._isFateSealed()) {
	                    if (holder.asyncNeeded) {
	                        var domain = getDomain();
	                        if (domain !== null) {
	                            holder.fn = util.domainBind(domain, holder.fn);
	                        }
	                    }
	                    ret._setAsyncGuaranteed();
	                    ret._setOnCancel(holder);
	                }
	                return ret;
	            }
	        }
	    }
	    var args = [].slice.call(arguments);;
	    if (fn) args.pop();
	    var ret = new PromiseArray(args).promise();
	    return fn !== undefined ? ret.spread(fn) : ret;
	};

	};

	},{"./util":36}],18:[function(_dereq_,module,exports){
	"use strict";
	module.exports = function(Promise,
	                          PromiseArray,
	                          apiRejection,
	                          tryConvertToPromise,
	                          INTERNAL,
	                          debug) {
	var getDomain = Promise._getDomain;
	var util = _dereq_("./util");
	var tryCatch = util.tryCatch;
	var errorObj = util.errorObj;
	var async = Promise._async;

	function MappingPromiseArray(promises, fn, limit, _filter) {
	    this.constructor$(promises);
	    this._promise._captureStackTrace();
	    var domain = getDomain();
	    this._callback = domain === null ? fn : util.domainBind(domain, fn);
	    this._preservedValues = _filter === INTERNAL
	        ? new Array(this.length())
	        : null;
	    this._limit = limit;
	    this._inFlight = 0;
	    this._queue = [];
	    async.invoke(this._asyncInit, this, undefined);
	}
	util.inherits(MappingPromiseArray, PromiseArray);

	MappingPromiseArray.prototype._asyncInit = function() {
	    this._init$(undefined, -2);
	};

	MappingPromiseArray.prototype._init = function () {};

	MappingPromiseArray.prototype._promiseFulfilled = function (value, index) {
	    var values = this._values;
	    var length = this.length();
	    var preservedValues = this._preservedValues;
	    var limit = this._limit;

	    if (index < 0) {
	        index = (index * -1) - 1;
	        values[index] = value;
	        if (limit >= 1) {
	            this._inFlight--;
	            this._drainQueue();
	            if (this._isResolved()) return true;
	        }
	    } else {
	        if (limit >= 1 && this._inFlight >= limit) {
	            values[index] = value;
	            this._queue.push(index);
	            return false;
	        }
	        if (preservedValues !== null) preservedValues[index] = value;

	        var promise = this._promise;
	        var callback = this._callback;
	        var receiver = promise._boundValue();
	        promise._pushContext();
	        var ret = tryCatch(callback).call(receiver, value, index, length);
	        var promiseCreated = promise._popContext();
	        debug.checkForgottenReturns(
	            ret,
	            promiseCreated,
	            preservedValues !== null ? "Promise.filter" : "Promise.map",
	            promise
	        );
	        if (ret === errorObj) {
	            this._reject(ret.e);
	            return true;
	        }

	        var maybePromise = tryConvertToPromise(ret, this._promise);
	        if (maybePromise instanceof Promise) {
	            maybePromise = maybePromise._target();
	            var bitField = maybePromise._bitField;
	            ;
	            if (((bitField & 50397184) === 0)) {
	                if (limit >= 1) this._inFlight++;
	                values[index] = maybePromise;
	                maybePromise._proxy(this, (index + 1) * -1);
	                return false;
	            } else if (((bitField & 33554432) !== 0)) {
	                ret = maybePromise._value();
	            } else if (((bitField & 16777216) !== 0)) {
	                this._reject(maybePromise._reason());
	                return true;
	            } else {
	                this._cancel();
	                return true;
	            }
	        }
	        values[index] = ret;
	    }
	    var totalResolved = ++this._totalResolved;
	    if (totalResolved >= length) {
	        if (preservedValues !== null) {
	            this._filter(values, preservedValues);
	        } else {
	            this._resolve(values);
	        }
	        return true;
	    }
	    return false;
	};

	MappingPromiseArray.prototype._drainQueue = function () {
	    var queue = this._queue;
	    var limit = this._limit;
	    var values = this._values;
	    while (queue.length > 0 && this._inFlight < limit) {
	        if (this._isResolved()) return;
	        var index = queue.pop();
	        this._promiseFulfilled(values[index], index);
	    }
	};

	MappingPromiseArray.prototype._filter = function (booleans, values) {
	    var len = values.length;
	    var ret = new Array(len);
	    var j = 0;
	    for (var i = 0; i < len; ++i) {
	        if (booleans[i]) ret[j++] = values[i];
	    }
	    ret.length = j;
	    this._resolve(ret);
	};

	MappingPromiseArray.prototype.preservedValues = function () {
	    return this._preservedValues;
	};

	function map(promises, fn, options, _filter) {
	    if (typeof fn !== "function") {
	        return apiRejection("expecting a function but got " + util.classString(fn));
	    }

	    var limit = 0;
	    if (options !== undefined) {
	        if (typeof options === "object" && options !== null) {
	            if (typeof options.concurrency !== "number") {
	                return Promise.reject(
	                    new TypeError("'concurrency' must be a number but it is " +
	                                    util.classString(options.concurrency)));
	            }
	            limit = options.concurrency;
	        } else {
	            return Promise.reject(new TypeError(
	                            "options argument must be an object but it is " +
	                             util.classString(options)));
	        }
	    }
	    limit = typeof limit === "number" &&
	        isFinite(limit) && limit >= 1 ? limit : 0;
	    return new MappingPromiseArray(promises, fn, limit, _filter).promise();
	}

	Promise.prototype.map = function (fn, options) {
	    return map(this, fn, options, null);
	};

	Promise.map = function (promises, fn, options, _filter) {
	    return map(promises, fn, options, _filter);
	};


	};

	},{"./util":36}],19:[function(_dereq_,module,exports){
	"use strict";
	module.exports =
	function(Promise, INTERNAL, tryConvertToPromise, apiRejection, debug) {
	var util = _dereq_("./util");
	var tryCatch = util.tryCatch;

	Promise.method = function (fn) {
	    if (typeof fn !== "function") {
	        throw new Promise.TypeError("expecting a function but got " + util.classString(fn));
	    }
	    return function () {
	        var ret = new Promise(INTERNAL);
	        ret._captureStackTrace();
	        ret._pushContext();
	        var value = tryCatch(fn).apply(this, arguments);
	        var promiseCreated = ret._popContext();
	        debug.checkForgottenReturns(
	            value, promiseCreated, "Promise.method", ret);
	        ret._resolveFromSyncValue(value);
	        return ret;
	    };
	};

	Promise.attempt = Promise["try"] = function (fn) {
	    if (typeof fn !== "function") {
	        return apiRejection("expecting a function but got " + util.classString(fn));
	    }
	    var ret = new Promise(INTERNAL);
	    ret._captureStackTrace();
	    ret._pushContext();
	    var value;
	    if (arguments.length > 1) {
	        debug.deprecated("calling Promise.try with more than 1 argument");
	        var arg = arguments[1];
	        var ctx = arguments[2];
	        value = util.isArray(arg) ? tryCatch(fn).apply(ctx, arg)
	                                  : tryCatch(fn).call(ctx, arg);
	    } else {
	        value = tryCatch(fn)();
	    }
	    var promiseCreated = ret._popContext();
	    debug.checkForgottenReturns(
	        value, promiseCreated, "Promise.try", ret);
	    ret._resolveFromSyncValue(value);
	    return ret;
	};

	Promise.prototype._resolveFromSyncValue = function (value) {
	    if (value === util.errorObj) {
	        this._rejectCallback(value.e, false);
	    } else {
	        this._resolveCallback(value, true);
	    }
	};
	};

	},{"./util":36}],20:[function(_dereq_,module,exports){
	"use strict";
	var util = _dereq_("./util");
	var maybeWrapAsError = util.maybeWrapAsError;
	var errors = _dereq_("./errors");
	var OperationalError = errors.OperationalError;
	var es5 = _dereq_("./es5");

	function isUntypedError(obj) {
	    return obj instanceof Error &&
	        es5.getPrototypeOf(obj) === Error.prototype;
	}

	var rErrorKey = /^(?:name|message|stack|cause)$/;
	function wrapAsOperationalError(obj) {
	    var ret;
	    if (isUntypedError(obj)) {
	        ret = new OperationalError(obj);
	        ret.name = obj.name;
	        ret.message = obj.message;
	        ret.stack = obj.stack;
	        var keys = es5.keys(obj);
	        for (var i = 0; i < keys.length; ++i) {
	            var key = keys[i];
	            if (!rErrorKey.test(key)) {
	                ret[key] = obj[key];
	            }
	        }
	        return ret;
	    }
	    util.markAsOriginatingFromRejection(obj);
	    return obj;
	}

	function nodebackForPromise(promise, multiArgs) {
	    return function(err, value) {
	        if (promise === null) return;
	        if (err) {
	            var wrapped = wrapAsOperationalError(maybeWrapAsError(err));
	            promise._attachExtraTrace(wrapped);
	            promise._reject(wrapped);
	        } else if (!multiArgs) {
	            promise._fulfill(value);
	        } else {
	            var args = [].slice.call(arguments, 1);;
	            promise._fulfill(args);
	        }
	        promise = null;
	    };
	}

	module.exports = nodebackForPromise;

	},{"./errors":12,"./es5":13,"./util":36}],21:[function(_dereq_,module,exports){
	"use strict";
	module.exports = function(Promise) {
	var util = _dereq_("./util");
	var async = Promise._async;
	var tryCatch = util.tryCatch;
	var errorObj = util.errorObj;

	function spreadAdapter(val, nodeback) {
	    var promise = this;
	    if (!util.isArray(val)) return successAdapter.call(promise, val, nodeback);
	    var ret =
	        tryCatch(nodeback).apply(promise._boundValue(), [null].concat(val));
	    if (ret === errorObj) {
	        async.throwLater(ret.e);
	    }
	}

	function successAdapter(val, nodeback) {
	    var promise = this;
	    var receiver = promise._boundValue();
	    var ret = val === undefined
	        ? tryCatch(nodeback).call(receiver, null)
	        : tryCatch(nodeback).call(receiver, null, val);
	    if (ret === errorObj) {
	        async.throwLater(ret.e);
	    }
	}
	function errorAdapter(reason, nodeback) {
	    var promise = this;
	    if (!reason) {
	        var newReason = new Error(reason + "");
	        newReason.cause = reason;
	        reason = newReason;
	    }
	    var ret = tryCatch(nodeback).call(promise._boundValue(), reason);
	    if (ret === errorObj) {
	        async.throwLater(ret.e);
	    }
	}

	Promise.prototype.asCallback = Promise.prototype.nodeify = function (nodeback,
	                                                                     options) {
	    if (typeof nodeback == "function") {
	        var adapter = successAdapter;
	        if (options !== undefined && Object(options).spread) {
	            adapter = spreadAdapter;
	        }
	        this._then(
	            adapter,
	            errorAdapter,
	            undefined,
	            this,
	            nodeback
	        );
	    }
	    return this;
	};
	};

	},{"./util":36}],22:[function(_dereq_,module,exports){
	"use strict";
	module.exports = function() {
	var makeSelfResolutionError = function () {
	    return new TypeError("circular promise resolution chain\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
	};
	var reflectHandler = function() {
	    return new Promise.PromiseInspection(this._target());
	};
	var apiRejection = function(msg) {
	    return Promise.reject(new TypeError(msg));
	};
	function Proxyable() {}
	var UNDEFINED_BINDING = {};
	var util = _dereq_("./util");

	var getDomain;
	if (util.isNode) {
	    getDomain = function() {
	        var ret = process.domain;
	        if (ret === undefined) ret = null;
	        return ret;
	    };
	} else {
	    getDomain = function() {
	        return null;
	    };
	}
	util.notEnumerableProp(Promise, "_getDomain", getDomain);

	var es5 = _dereq_("./es5");
	var Async = _dereq_("./async");
	var async = new Async();
	es5.defineProperty(Promise, "_async", {value: async});
	var errors = _dereq_("./errors");
	var TypeError = Promise.TypeError = errors.TypeError;
	Promise.RangeError = errors.RangeError;
	var CancellationError = Promise.CancellationError = errors.CancellationError;
	Promise.TimeoutError = errors.TimeoutError;
	Promise.OperationalError = errors.OperationalError;
	Promise.RejectionError = errors.OperationalError;
	Promise.AggregateError = errors.AggregateError;
	var INTERNAL = function(){};
	var APPLY = {};
	var NEXT_FILTER = {};
	var tryConvertToPromise = _dereq_("./thenables")(Promise, INTERNAL);
	var PromiseArray =
	    _dereq_("./promise_array")(Promise, INTERNAL,
	                               tryConvertToPromise, apiRejection, Proxyable);
	var Context = _dereq_("./context")(Promise);
	 /*jshint unused:false*/
	var createContext = Context.create;
	var debug = _dereq_("./debuggability")(Promise, Context);
	var CapturedTrace = debug.CapturedTrace;
	var PassThroughHandlerContext =
	    _dereq_("./finally")(Promise, tryConvertToPromise);
	var catchFilter = _dereq_("./catch_filter")(NEXT_FILTER);
	var nodebackForPromise = _dereq_("./nodeback");
	var errorObj = util.errorObj;
	var tryCatch = util.tryCatch;
	function check(self, executor) {
	    if (typeof executor !== "function") {
	        throw new TypeError("expecting a function but got " + util.classString(executor));
	    }
	    if (self.constructor !== Promise) {
	        throw new TypeError("the promise constructor cannot be invoked directly\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
	    }
	}

	function Promise(executor) {
	    this._bitField = 0;
	    this._fulfillmentHandler0 = undefined;
	    this._rejectionHandler0 = undefined;
	    this._promise0 = undefined;
	    this._receiver0 = undefined;
	    if (executor !== INTERNAL) {
	        check(this, executor);
	        this._resolveFromExecutor(executor);
	    }
	    this._promiseCreated();
	    this._fireEvent("promiseCreated", this);
	}

	Promise.prototype.toString = function () {
	    return "[object Promise]";
	};

	Promise.prototype.caught = Promise.prototype["catch"] = function (fn) {
	    var len = arguments.length;
	    if (len > 1) {
	        var catchInstances = new Array(len - 1),
	            j = 0, i;
	        for (i = 0; i < len - 1; ++i) {
	            var item = arguments[i];
	            if (util.isObject(item)) {
	                catchInstances[j++] = item;
	            } else {
	                return apiRejection("expecting an object but got " +
	                    "A catch statement predicate " + util.classString(item));
	            }
	        }
	        catchInstances.length = j;
	        fn = arguments[i];
	        return this.then(undefined, catchFilter(catchInstances, fn, this));
	    }
	    return this.then(undefined, fn);
	};

	Promise.prototype.reflect = function () {
	    return this._then(reflectHandler,
	        reflectHandler, undefined, this, undefined);
	};

	Promise.prototype.then = function (didFulfill, didReject) {
	    if (debug.warnings() && arguments.length > 0 &&
	        typeof didFulfill !== "function" &&
	        typeof didReject !== "function") {
	        var msg = ".then() only accepts functions but was passed: " +
	                util.classString(didFulfill);
	        if (arguments.length > 1) {
	            msg += ", " + util.classString(didReject);
	        }
	        this._warn(msg);
	    }
	    return this._then(didFulfill, didReject, undefined, undefined, undefined);
	};

	Promise.prototype.done = function (didFulfill, didReject) {
	    var promise =
	        this._then(didFulfill, didReject, undefined, undefined, undefined);
	    promise._setIsFinal();
	};

	Promise.prototype.spread = function (fn) {
	    if (typeof fn !== "function") {
	        return apiRejection("expecting a function but got " + util.classString(fn));
	    }
	    return this.all()._then(fn, undefined, undefined, APPLY, undefined);
	};

	Promise.prototype.toJSON = function () {
	    var ret = {
	        isFulfilled: false,
	        isRejected: false,
	        fulfillmentValue: undefined,
	        rejectionReason: undefined
	    };
	    if (this.isFulfilled()) {
	        ret.fulfillmentValue = this.value();
	        ret.isFulfilled = true;
	    } else if (this.isRejected()) {
	        ret.rejectionReason = this.reason();
	        ret.isRejected = true;
	    }
	    return ret;
	};

	Promise.prototype.all = function () {
	    if (arguments.length > 0) {
	        this._warn(".all() was passed arguments but it does not take any");
	    }
	    return new PromiseArray(this).promise();
	};

	Promise.prototype.error = function (fn) {
	    return this.caught(util.originatesFromRejection, fn);
	};

	Promise.getNewLibraryCopy = module.exports;

	Promise.is = function (val) {
	    return val instanceof Promise;
	};

	Promise.fromNode = Promise.fromCallback = function(fn) {
	    var ret = new Promise(INTERNAL);
	    ret._captureStackTrace();
	    var multiArgs = arguments.length > 1 ? !!Object(arguments[1]).multiArgs
	                                         : false;
	    var result = tryCatch(fn)(nodebackForPromise(ret, multiArgs));
	    if (result === errorObj) {
	        ret._rejectCallback(result.e, true);
	    }
	    if (!ret._isFateSealed()) ret._setAsyncGuaranteed();
	    return ret;
	};

	Promise.all = function (promises) {
	    return new PromiseArray(promises).promise();
	};

	Promise.cast = function (obj) {
	    var ret = tryConvertToPromise(obj);
	    if (!(ret instanceof Promise)) {
	        ret = new Promise(INTERNAL);
	        ret._captureStackTrace();
	        ret._setFulfilled();
	        ret._rejectionHandler0 = obj;
	    }
	    return ret;
	};

	Promise.resolve = Promise.fulfilled = Promise.cast;

	Promise.reject = Promise.rejected = function (reason) {
	    var ret = new Promise(INTERNAL);
	    ret._captureStackTrace();
	    ret._rejectCallback(reason, true);
	    return ret;
	};

	Promise.setScheduler = function(fn) {
	    if (typeof fn !== "function") {
	        throw new TypeError("expecting a function but got " + util.classString(fn));
	    }
	    return async.setScheduler(fn);
	};

	Promise.prototype._then = function (
	    didFulfill,
	    didReject,
	    _,    receiver,
	    internalData
	) {
	    var haveInternalData = internalData !== undefined;
	    var promise = haveInternalData ? internalData : new Promise(INTERNAL);
	    var target = this._target();
	    var bitField = target._bitField;

	    if (!haveInternalData) {
	        promise._propagateFrom(this, 3);
	        promise._captureStackTrace();
	        if (receiver === undefined &&
	            ((this._bitField & 2097152) !== 0)) {
	            if (!((bitField & 50397184) === 0)) {
	                receiver = this._boundValue();
	            } else {
	                receiver = target === this ? undefined : this._boundTo;
	            }
	        }
	        this._fireEvent("promiseChained", this, promise);
	    }

	    var domain = getDomain();
	    if (!((bitField & 50397184) === 0)) {
	        var handler, value, settler = target._settlePromiseCtx;
	        if (((bitField & 33554432) !== 0)) {
	            value = target._rejectionHandler0;
	            handler = didFulfill;
	        } else if (((bitField & 16777216) !== 0)) {
	            value = target._fulfillmentHandler0;
	            handler = didReject;
	            target._unsetRejectionIsUnhandled();
	        } else {
	            settler = target._settlePromiseLateCancellationObserver;
	            value = new CancellationError("late cancellation observer");
	            target._attachExtraTrace(value);
	            handler = didReject;
	        }

	        async.invoke(settler, target, {
	            handler: domain === null ? handler
	                : (typeof handler === "function" &&
	                    util.domainBind(domain, handler)),
	            promise: promise,
	            receiver: receiver,
	            value: value
	        });
	    } else {
	        target._addCallbacks(didFulfill, didReject, promise, receiver, domain);
	    }

	    return promise;
	};

	Promise.prototype._length = function () {
	    return this._bitField & 65535;
	};

	Promise.prototype._isFateSealed = function () {
	    return (this._bitField & 117506048) !== 0;
	};

	Promise.prototype._isFollowing = function () {
	    return (this._bitField & 67108864) === 67108864;
	};

	Promise.prototype._setLength = function (len) {
	    this._bitField = (this._bitField & -65536) |
	        (len & 65535);
	};

	Promise.prototype._setFulfilled = function () {
	    this._bitField = this._bitField | 33554432;
	    this._fireEvent("promiseFulfilled", this);
	};

	Promise.prototype._setRejected = function () {
	    this._bitField = this._bitField | 16777216;
	    this._fireEvent("promiseRejected", this);
	};

	Promise.prototype._setFollowing = function () {
	    this._bitField = this._bitField | 67108864;
	    this._fireEvent("promiseResolved", this);
	};

	Promise.prototype._setIsFinal = function () {
	    this._bitField = this._bitField | 4194304;
	};

	Promise.prototype._isFinal = function () {
	    return (this._bitField & 4194304) > 0;
	};

	Promise.prototype._unsetCancelled = function() {
	    this._bitField = this._bitField & (~65536);
	};

	Promise.prototype._setCancelled = function() {
	    this._bitField = this._bitField | 65536;
	    this._fireEvent("promiseCancelled", this);
	};

	Promise.prototype._setWillBeCancelled = function() {
	    this._bitField = this._bitField | 8388608;
	};

	Promise.prototype._setAsyncGuaranteed = function() {
	    if (async.hasCustomScheduler()) return;
	    this._bitField = this._bitField | 134217728;
	};

	Promise.prototype._receiverAt = function (index) {
	    var ret = index === 0 ? this._receiver0 : this[
	            index * 4 - 4 + 3];
	    if (ret === UNDEFINED_BINDING) {
	        return undefined;
	    } else if (ret === undefined && this._isBound()) {
	        return this._boundValue();
	    }
	    return ret;
	};

	Promise.prototype._promiseAt = function (index) {
	    return this[
	            index * 4 - 4 + 2];
	};

	Promise.prototype._fulfillmentHandlerAt = function (index) {
	    return this[
	            index * 4 - 4 + 0];
	};

	Promise.prototype._rejectionHandlerAt = function (index) {
	    return this[
	            index * 4 - 4 + 1];
	};

	Promise.prototype._boundValue = function() {};

	Promise.prototype._migrateCallback0 = function (follower) {
	    var bitField = follower._bitField;
	    var fulfill = follower._fulfillmentHandler0;
	    var reject = follower._rejectionHandler0;
	    var promise = follower._promise0;
	    var receiver = follower._receiverAt(0);
	    if (receiver === undefined) receiver = UNDEFINED_BINDING;
	    this._addCallbacks(fulfill, reject, promise, receiver, null);
	};

	Promise.prototype._migrateCallbackAt = function (follower, index) {
	    var fulfill = follower._fulfillmentHandlerAt(index);
	    var reject = follower._rejectionHandlerAt(index);
	    var promise = follower._promiseAt(index);
	    var receiver = follower._receiverAt(index);
	    if (receiver === undefined) receiver = UNDEFINED_BINDING;
	    this._addCallbacks(fulfill, reject, promise, receiver, null);
	};

	Promise.prototype._addCallbacks = function (
	    fulfill,
	    reject,
	    promise,
	    receiver,
	    domain
	) {
	    var index = this._length();

	    if (index >= 65535 - 4) {
	        index = 0;
	        this._setLength(0);
	    }

	    if (index === 0) {
	        this._promise0 = promise;
	        this._receiver0 = receiver;
	        if (typeof fulfill === "function") {
	            this._fulfillmentHandler0 =
	                domain === null ? fulfill : util.domainBind(domain, fulfill);
	        }
	        if (typeof reject === "function") {
	            this._rejectionHandler0 =
	                domain === null ? reject : util.domainBind(domain, reject);
	        }
	    } else {
	        var base = index * 4 - 4;
	        this[base + 2] = promise;
	        this[base + 3] = receiver;
	        if (typeof fulfill === "function") {
	            this[base + 0] =
	                domain === null ? fulfill : util.domainBind(domain, fulfill);
	        }
	        if (typeof reject === "function") {
	            this[base + 1] =
	                domain === null ? reject : util.domainBind(domain, reject);
	        }
	    }
	    this._setLength(index + 1);
	    return index;
	};

	Promise.prototype._proxy = function (proxyable, arg) {
	    this._addCallbacks(undefined, undefined, arg, proxyable, null);
	};

	Promise.prototype._resolveCallback = function(value, shouldBind) {
	    if (((this._bitField & 117506048) !== 0)) return;
	    if (value === this)
	        return this._rejectCallback(makeSelfResolutionError(), false);
	    var maybePromise = tryConvertToPromise(value, this);
	    if (!(maybePromise instanceof Promise)) return this._fulfill(value);

	    if (shouldBind) this._propagateFrom(maybePromise, 2);

	    var promise = maybePromise._target();

	    if (promise === this) {
	        this._reject(makeSelfResolutionError());
	        return;
	    }

	    var bitField = promise._bitField;
	    if (((bitField & 50397184) === 0)) {
	        var len = this._length();
	        if (len > 0) promise._migrateCallback0(this);
	        for (var i = 1; i < len; ++i) {
	            promise._migrateCallbackAt(this, i);
	        }
	        this._setFollowing();
	        this._setLength(0);
	        this._setFollowee(promise);
	    } else if (((bitField & 33554432) !== 0)) {
	        this._fulfill(promise._value());
	    } else if (((bitField & 16777216) !== 0)) {
	        this._reject(promise._reason());
	    } else {
	        var reason = new CancellationError("late cancellation observer");
	        promise._attachExtraTrace(reason);
	        this._reject(reason);
	    }
	};

	Promise.prototype._rejectCallback =
	function(reason, synchronous, ignoreNonErrorWarnings) {
	    var trace = util.ensureErrorObject(reason);
	    var hasStack = trace === reason;
	    if (!hasStack && !ignoreNonErrorWarnings && debug.warnings()) {
	        var message = "a promise was rejected with a non-error: " +
	            util.classString(reason);
	        this._warn(message, true);
	    }
	    this._attachExtraTrace(trace, synchronous ? hasStack : false);
	    this._reject(reason);
	};

	Promise.prototype._resolveFromExecutor = function (executor) {
	    var promise = this;
	    this._captureStackTrace();
	    this._pushContext();
	    var synchronous = true;
	    var r = this._execute(executor, function(value) {
	        promise._resolveCallback(value);
	    }, function (reason) {
	        promise._rejectCallback(reason, synchronous);
	    });
	    synchronous = false;
	    this._popContext();

	    if (r !== undefined) {
	        promise._rejectCallback(r, true);
	    }
	};

	Promise.prototype._settlePromiseFromHandler = function (
	    handler, receiver, value, promise
	) {
	    var bitField = promise._bitField;
	    if (((bitField & 65536) !== 0)) return;
	    promise._pushContext();
	    var x;
	    if (receiver === APPLY) {
	        if (!value || typeof value.length !== "number") {
	            x = errorObj;
	            x.e = new TypeError("cannot .spread() a non-array: " +
	                                    util.classString(value));
	        } else {
	            x = tryCatch(handler).apply(this._boundValue(), value);
	        }
	    } else {
	        x = tryCatch(handler).call(receiver, value);
	    }
	    var promiseCreated = promise._popContext();
	    bitField = promise._bitField;
	    if (((bitField & 65536) !== 0)) return;

	    if (x === NEXT_FILTER) {
	        promise._reject(value);
	    } else if (x === errorObj) {
	        promise._rejectCallback(x.e, false);
	    } else {
	        debug.checkForgottenReturns(x, promiseCreated, "",  promise, this);
	        promise._resolveCallback(x);
	    }
	};

	Promise.prototype._target = function() {
	    var ret = this;
	    while (ret._isFollowing()) ret = ret._followee();
	    return ret;
	};

	Promise.prototype._followee = function() {
	    return this._rejectionHandler0;
	};

	Promise.prototype._setFollowee = function(promise) {
	    this._rejectionHandler0 = promise;
	};

	Promise.prototype._settlePromise = function(promise, handler, receiver, value) {
	    var isPromise = promise instanceof Promise;
	    var bitField = this._bitField;
	    var asyncGuaranteed = ((bitField & 134217728) !== 0);
	    if (((bitField & 65536) !== 0)) {
	        if (isPromise) promise._invokeInternalOnCancel();

	        if (receiver instanceof PassThroughHandlerContext &&
	            receiver.isFinallyHandler()) {
	            receiver.cancelPromise = promise;
	            if (tryCatch(handler).call(receiver, value) === errorObj) {
	                promise._reject(errorObj.e);
	            }
	        } else if (handler === reflectHandler) {
	            promise._fulfill(reflectHandler.call(receiver));
	        } else if (receiver instanceof Proxyable) {
	            receiver._promiseCancelled(promise);
	        } else if (isPromise || promise instanceof PromiseArray) {
	            promise._cancel();
	        } else {
	            receiver.cancel();
	        }
	    } else if (typeof handler === "function") {
	        if (!isPromise) {
	            handler.call(receiver, value, promise);
	        } else {
	            if (asyncGuaranteed) promise._setAsyncGuaranteed();
	            this._settlePromiseFromHandler(handler, receiver, value, promise);
	        }
	    } else if (receiver instanceof Proxyable) {
	        if (!receiver._isResolved()) {
	            if (((bitField & 33554432) !== 0)) {
	                receiver._promiseFulfilled(value, promise);
	            } else {
	                receiver._promiseRejected(value, promise);
	            }
	        }
	    } else if (isPromise) {
	        if (asyncGuaranteed) promise._setAsyncGuaranteed();
	        if (((bitField & 33554432) !== 0)) {
	            promise._fulfill(value);
	        } else {
	            promise._reject(value);
	        }
	    }
	};

	Promise.prototype._settlePromiseLateCancellationObserver = function(ctx) {
	    var handler = ctx.handler;
	    var promise = ctx.promise;
	    var receiver = ctx.receiver;
	    var value = ctx.value;
	    if (typeof handler === "function") {
	        if (!(promise instanceof Promise)) {
	            handler.call(receiver, value, promise);
	        } else {
	            this._settlePromiseFromHandler(handler, receiver, value, promise);
	        }
	    } else if (promise instanceof Promise) {
	        promise._reject(value);
	    }
	};

	Promise.prototype._settlePromiseCtx = function(ctx) {
	    this._settlePromise(ctx.promise, ctx.handler, ctx.receiver, ctx.value);
	};

	Promise.prototype._settlePromise0 = function(handler, value, bitField) {
	    var promise = this._promise0;
	    var receiver = this._receiverAt(0);
	    this._promise0 = undefined;
	    this._receiver0 = undefined;
	    this._settlePromise(promise, handler, receiver, value);
	};

	Promise.prototype._clearCallbackDataAtIndex = function(index) {
	    var base = index * 4 - 4;
	    this[base + 2] =
	    this[base + 3] =
	    this[base + 0] =
	    this[base + 1] = undefined;
	};

	Promise.prototype._fulfill = function (value) {
	    var bitField = this._bitField;
	    if (((bitField & 117506048) >>> 16)) return;
	    if (value === this) {
	        var err = makeSelfResolutionError();
	        this._attachExtraTrace(err);
	        return this._reject(err);
	    }
	    this._setFulfilled();
	    this._rejectionHandler0 = value;

	    if ((bitField & 65535) > 0) {
	        if (((bitField & 134217728) !== 0)) {
	            this._settlePromises();
	        } else {
	            async.settlePromises(this);
	        }
	    }
	};

	Promise.prototype._reject = function (reason) {
	    var bitField = this._bitField;
	    if (((bitField & 117506048) >>> 16)) return;
	    this._setRejected();
	    this._fulfillmentHandler0 = reason;

	    if (this._isFinal()) {
	        return async.fatalError(reason, util.isNode);
	    }

	    if ((bitField & 65535) > 0) {
	        async.settlePromises(this);
	    } else {
	        this._ensurePossibleRejectionHandled();
	    }
	};

	Promise.prototype._fulfillPromises = function (len, value) {
	    for (var i = 1; i < len; i++) {
	        var handler = this._fulfillmentHandlerAt(i);
	        var promise = this._promiseAt(i);
	        var receiver = this._receiverAt(i);
	        this._clearCallbackDataAtIndex(i);
	        this._settlePromise(promise, handler, receiver, value);
	    }
	};

	Promise.prototype._rejectPromises = function (len, reason) {
	    for (var i = 1; i < len; i++) {
	        var handler = this._rejectionHandlerAt(i);
	        var promise = this._promiseAt(i);
	        var receiver = this._receiverAt(i);
	        this._clearCallbackDataAtIndex(i);
	        this._settlePromise(promise, handler, receiver, reason);
	    }
	};

	Promise.prototype._settlePromises = function () {
	    var bitField = this._bitField;
	    var len = (bitField & 65535);

	    if (len > 0) {
	        if (((bitField & 16842752) !== 0)) {
	            var reason = this._fulfillmentHandler0;
	            this._settlePromise0(this._rejectionHandler0, reason, bitField);
	            this._rejectPromises(len, reason);
	        } else {
	            var value = this._rejectionHandler0;
	            this._settlePromise0(this._fulfillmentHandler0, value, bitField);
	            this._fulfillPromises(len, value);
	        }
	        this._setLength(0);
	    }
	    this._clearCancellationData();
	};

	Promise.prototype._settledValue = function() {
	    var bitField = this._bitField;
	    if (((bitField & 33554432) !== 0)) {
	        return this._rejectionHandler0;
	    } else if (((bitField & 16777216) !== 0)) {
	        return this._fulfillmentHandler0;
	    }
	};

	function deferResolve(v) {this.promise._resolveCallback(v);}
	function deferReject(v) {this.promise._rejectCallback(v, false);}

	Promise.defer = Promise.pending = function() {
	    debug.deprecated("Promise.defer", "new Promise");
	    var promise = new Promise(INTERNAL);
	    return {
	        promise: promise,
	        resolve: deferResolve,
	        reject: deferReject
	    };
	};

	util.notEnumerableProp(Promise,
	                       "_makeSelfResolutionError",
	                       makeSelfResolutionError);

	_dereq_("./method")(Promise, INTERNAL, tryConvertToPromise, apiRejection,
	    debug);
	_dereq_("./bind")(Promise, INTERNAL, tryConvertToPromise, debug);
	_dereq_("./cancel")(Promise, PromiseArray, apiRejection, debug);
	_dereq_("./direct_resolve")(Promise);
	_dereq_("./synchronous_inspection")(Promise);
	_dereq_("./join")(
	    Promise, PromiseArray, tryConvertToPromise, INTERNAL, async, getDomain);
	Promise.Promise = Promise;
	Promise.version = "3.4.6";
	_dereq_('./map.js')(Promise, PromiseArray, apiRejection, tryConvertToPromise, INTERNAL, debug);
	_dereq_('./call_get.js')(Promise);
	_dereq_('./using.js')(Promise, apiRejection, tryConvertToPromise, createContext, INTERNAL, debug);
	_dereq_('./timers.js')(Promise, INTERNAL, debug);
	_dereq_('./generators.js')(Promise, apiRejection, INTERNAL, tryConvertToPromise, Proxyable, debug);
	_dereq_('./nodeify.js')(Promise);
	_dereq_('./promisify.js')(Promise, INTERNAL);
	_dereq_('./props.js')(Promise, PromiseArray, tryConvertToPromise, apiRejection);
	_dereq_('./race.js')(Promise, INTERNAL, tryConvertToPromise, apiRejection);
	_dereq_('./reduce.js')(Promise, PromiseArray, apiRejection, tryConvertToPromise, INTERNAL, debug);
	_dereq_('./settle.js')(Promise, PromiseArray, debug);
	_dereq_('./some.js')(Promise, PromiseArray, apiRejection);
	_dereq_('./filter.js')(Promise, INTERNAL);
	_dereq_('./each.js')(Promise, INTERNAL);
	_dereq_('./any.js')(Promise);
	                                                         
	    util.toFastProperties(Promise);                                          
	    util.toFastProperties(Promise.prototype);                                
	    function fillTypes(value) {                                              
	        var p = new Promise(INTERNAL);                                       
	        p._fulfillmentHandler0 = value;                                      
	        p._rejectionHandler0 = value;                                        
	        p._promise0 = value;                                                 
	        p._receiver0 = value;                                                
	    }                                                                        
	    // Complete slack tracking, opt out of field-type tracking and           
	    // stabilize map                                                         
	    fillTypes({a: 1});                                                       
	    fillTypes({b: 2});                                                       
	    fillTypes({c: 3});                                                       
	    fillTypes(1);                                                            
	    fillTypes(function(){});                                                 
	    fillTypes(undefined);                                                    
	    fillTypes(false);                                                        
	    fillTypes(new Promise(INTERNAL));                                        
	    debug.setBounds(Async.firstLineError, util.lastLineError);               
	    return Promise;                                                          

	};

	},{"./any.js":1,"./async":2,"./bind":3,"./call_get.js":5,"./cancel":6,"./catch_filter":7,"./context":8,"./debuggability":9,"./direct_resolve":10,"./each.js":11,"./errors":12,"./es5":13,"./filter.js":14,"./finally":15,"./generators.js":16,"./join":17,"./map.js":18,"./method":19,"./nodeback":20,"./nodeify.js":21,"./promise_array":23,"./promisify.js":24,"./props.js":25,"./race.js":27,"./reduce.js":28,"./settle.js":30,"./some.js":31,"./synchronous_inspection":32,"./thenables":33,"./timers.js":34,"./using.js":35,"./util":36}],23:[function(_dereq_,module,exports){
	"use strict";
	module.exports = function(Promise, INTERNAL, tryConvertToPromise,
	    apiRejection, Proxyable) {
	var util = _dereq_("./util");
	var isArray = util.isArray;

	function toResolutionValue(val) {
	    switch(val) {
	    case -2: return [];
	    case -3: return {};
	    }
	}

	function PromiseArray(values) {
	    var promise = this._promise = new Promise(INTERNAL);
	    if (values instanceof Promise) {
	        promise._propagateFrom(values, 3);
	    }
	    promise._setOnCancel(this);
	    this._values = values;
	    this._length = 0;
	    this._totalResolved = 0;
	    this._init(undefined, -2);
	}
	util.inherits(PromiseArray, Proxyable);

	PromiseArray.prototype.length = function () {
	    return this._length;
	};

	PromiseArray.prototype.promise = function () {
	    return this._promise;
	};

	PromiseArray.prototype._init = function init(_, resolveValueIfEmpty) {
	    var values = tryConvertToPromise(this._values, this._promise);
	    if (values instanceof Promise) {
	        values = values._target();
	        var bitField = values._bitField;
	        ;
	        this._values = values;

	        if (((bitField & 50397184) === 0)) {
	            this._promise._setAsyncGuaranteed();
	            return values._then(
	                init,
	                this._reject,
	                undefined,
	                this,
	                resolveValueIfEmpty
	           );
	        } else if (((bitField & 33554432) !== 0)) {
	            values = values._value();
	        } else if (((bitField & 16777216) !== 0)) {
	            return this._reject(values._reason());
	        } else {
	            return this._cancel();
	        }
	    }
	    values = util.asArray(values);
	    if (values === null) {
	        var err = apiRejection(
	            "expecting an array or an iterable object but got " + util.classString(values)).reason();
	        this._promise._rejectCallback(err, false);
	        return;
	    }

	    if (values.length === 0) {
	        if (resolveValueIfEmpty === -5) {
	            this._resolveEmptyArray();
	        }
	        else {
	            this._resolve(toResolutionValue(resolveValueIfEmpty));
	        }
	        return;
	    }
	    this._iterate(values);
	};

	PromiseArray.prototype._iterate = function(values) {
	    var len = this.getActualLength(values.length);
	    this._length = len;
	    this._values = this.shouldCopyValues() ? new Array(len) : this._values;
	    var result = this._promise;
	    var isResolved = false;
	    var bitField = null;
	    for (var i = 0; i < len; ++i) {
	        var maybePromise = tryConvertToPromise(values[i], result);

	        if (maybePromise instanceof Promise) {
	            maybePromise = maybePromise._target();
	            bitField = maybePromise._bitField;
	        } else {
	            bitField = null;
	        }

	        if (isResolved) {
	            if (bitField !== null) {
	                maybePromise.suppressUnhandledRejections();
	            }
	        } else if (bitField !== null) {
	            if (((bitField & 50397184) === 0)) {
	                maybePromise._proxy(this, i);
	                this._values[i] = maybePromise;
	            } else if (((bitField & 33554432) !== 0)) {
	                isResolved = this._promiseFulfilled(maybePromise._value(), i);
	            } else if (((bitField & 16777216) !== 0)) {
	                isResolved = this._promiseRejected(maybePromise._reason(), i);
	            } else {
	                isResolved = this._promiseCancelled(i);
	            }
	        } else {
	            isResolved = this._promiseFulfilled(maybePromise, i);
	        }
	    }
	    if (!isResolved) result._setAsyncGuaranteed();
	};

	PromiseArray.prototype._isResolved = function () {
	    return this._values === null;
	};

	PromiseArray.prototype._resolve = function (value) {
	    this._values = null;
	    this._promise._fulfill(value);
	};

	PromiseArray.prototype._cancel = function() {
	    if (this._isResolved() || !this._promise._isCancellable()) return;
	    this._values = null;
	    this._promise._cancel();
	};

	PromiseArray.prototype._reject = function (reason) {
	    this._values = null;
	    this._promise._rejectCallback(reason, false);
	};

	PromiseArray.prototype._promiseFulfilled = function (value, index) {
	    this._values[index] = value;
	    var totalResolved = ++this._totalResolved;
	    if (totalResolved >= this._length) {
	        this._resolve(this._values);
	        return true;
	    }
	    return false;
	};

	PromiseArray.prototype._promiseCancelled = function() {
	    this._cancel();
	    return true;
	};

	PromiseArray.prototype._promiseRejected = function (reason) {
	    this._totalResolved++;
	    this._reject(reason);
	    return true;
	};

	PromiseArray.prototype._resultCancelled = function() {
	    if (this._isResolved()) return;
	    var values = this._values;
	    this._cancel();
	    if (values instanceof Promise) {
	        values.cancel();
	    } else {
	        for (var i = 0; i < values.length; ++i) {
	            if (values[i] instanceof Promise) {
	                values[i].cancel();
	            }
	        }
	    }
	};

	PromiseArray.prototype.shouldCopyValues = function () {
	    return true;
	};

	PromiseArray.prototype.getActualLength = function (len) {
	    return len;
	};

	return PromiseArray;
	};

	},{"./util":36}],24:[function(_dereq_,module,exports){
	"use strict";
	module.exports = function(Promise, INTERNAL) {
	var THIS = {};
	var util = _dereq_("./util");
	var nodebackForPromise = _dereq_("./nodeback");
	var withAppended = util.withAppended;
	var maybeWrapAsError = util.maybeWrapAsError;
	var canEvaluate = util.canEvaluate;
	var TypeError = _dereq_("./errors").TypeError;
	var defaultSuffix = "Async";
	var defaultPromisified = {__isPromisified__: true};
	var noCopyProps = [
	    "arity",    "length",
	    "name",
	    "arguments",
	    "caller",
	    "callee",
	    "prototype",
	    "__isPromisified__"
	];
	var noCopyPropsPattern = new RegExp("^(?:" + noCopyProps.join("|") + ")$");

	var defaultFilter = function(name) {
	    return util.isIdentifier(name) &&
	        name.charAt(0) !== "_" &&
	        name !== "constructor";
	};

	function propsFilter(key) {
	    return !noCopyPropsPattern.test(key);
	}

	function isPromisified(fn) {
	    try {
	        return fn.__isPromisified__ === true;
	    }
	    catch (e) {
	        return false;
	    }
	}

	function hasPromisified(obj, key, suffix) {
	    var val = util.getDataPropertyOrDefault(obj, key + suffix,
	                                            defaultPromisified);
	    return val ? isPromisified(val) : false;
	}
	function checkValid(ret, suffix, suffixRegexp) {
	    for (var i = 0; i < ret.length; i += 2) {
	        var key = ret[i];
	        if (suffixRegexp.test(key)) {
	            var keyWithoutAsyncSuffix = key.replace(suffixRegexp, "");
	            for (var j = 0; j < ret.length; j += 2) {
	                if (ret[j] === keyWithoutAsyncSuffix) {
	                    throw new TypeError("Cannot promisify an API that has normal methods with '%s'-suffix\u000a\u000a    See http://goo.gl/MqrFmX\u000a"
	                        .replace("%s", suffix));
	                }
	            }
	        }
	    }
	}

	function promisifiableMethods(obj, suffix, suffixRegexp, filter) {
	    var keys = util.inheritedDataKeys(obj);
	    var ret = [];
	    for (var i = 0; i < keys.length; ++i) {
	        var key = keys[i];
	        var value = obj[key];
	        var passesDefaultFilter = filter === defaultFilter
	            ? true : defaultFilter(key, value, obj);
	        if (typeof value === "function" &&
	            !isPromisified(value) &&
	            !hasPromisified(obj, key, suffix) &&
	            filter(key, value, obj, passesDefaultFilter)) {
	            ret.push(key, value);
	        }
	    }
	    checkValid(ret, suffix, suffixRegexp);
	    return ret;
	}

	var escapeIdentRegex = function(str) {
	    return str.replace(/([$])/, "\\$");
	};

	var makeNodePromisifiedEval;
	if (false) {
	var switchCaseArgumentOrder = function(likelyArgumentCount) {
	    var ret = [likelyArgumentCount];
	    var min = Math.max(0, likelyArgumentCount - 1 - 3);
	    for(var i = likelyArgumentCount - 1; i >= min; --i) {
	        ret.push(i);
	    }
	    for(var i = likelyArgumentCount + 1; i <= 3; ++i) {
	        ret.push(i);
	    }
	    return ret;
	};

	var argumentSequence = function(argumentCount) {
	    return util.filledRange(argumentCount, "_arg", "");
	};

	var parameterDeclaration = function(parameterCount) {
	    return util.filledRange(
	        Math.max(parameterCount, 3), "_arg", "");
	};

	var parameterCount = function(fn) {
	    if (typeof fn.length === "number") {
	        return Math.max(Math.min(fn.length, 1023 + 1), 0);
	    }
	    return 0;
	};

	makeNodePromisifiedEval =
	function(callback, receiver, originalName, fn, _, multiArgs) {
	    var newParameterCount = Math.max(0, parameterCount(fn) - 1);
	    var argumentOrder = switchCaseArgumentOrder(newParameterCount);
	    var shouldProxyThis = typeof callback === "string" || receiver === THIS;

	    function generateCallForArgumentCount(count) {
	        var args = argumentSequence(count).join(", ");
	        var comma = count > 0 ? ", " : "";
	        var ret;
	        if (shouldProxyThis) {
	            ret = "ret = callback.call(this, {{args}}, nodeback); break;\n";
	        } else {
	            ret = receiver === undefined
	                ? "ret = callback({{args}}, nodeback); break;\n"
	                : "ret = callback.call(receiver, {{args}}, nodeback); break;\n";
	        }
	        return ret.replace("{{args}}", args).replace(", ", comma);
	    }

	    function generateArgumentSwitchCase() {
	        var ret = "";
	        for (var i = 0; i < argumentOrder.length; ++i) {
	            ret += "case " + argumentOrder[i] +":" +
	                generateCallForArgumentCount(argumentOrder[i]);
	        }

	        ret += "                                                             \n\
	        default:                                                             \n\
	            var args = new Array(len + 1);                                   \n\
	            var i = 0;                                                       \n\
	            for (var i = 0; i < len; ++i) {                                  \n\
	               args[i] = arguments[i];                                       \n\
	            }                                                                \n\
	            args[i] = nodeback;                                              \n\
	            [CodeForCall]                                                    \n\
	            break;                                                           \n\
	        ".replace("[CodeForCall]", (shouldProxyThis
	                                ? "ret = callback.apply(this, args);\n"
	                                : "ret = callback.apply(receiver, args);\n"));
	        return ret;
	    }

	    var getFunctionCode = typeof callback === "string"
	                                ? ("this != null ? this['"+callback+"'] : fn")
	                                : "fn";
	    var body = "'use strict';                                                \n\
	        var ret = function (Parameters) {                                    \n\
	            'use strict';                                                    \n\
	            var len = arguments.length;                                      \n\
	            var promise = new Promise(INTERNAL);                             \n\
	            promise._captureStackTrace();                                    \n\
	            var nodeback = nodebackForPromise(promise, " + multiArgs + ");   \n\
	            var ret;                                                         \n\
	            var callback = tryCatch([GetFunctionCode]);                      \n\
	            switch(len) {                                                    \n\
	                [CodeForSwitchCase]                                          \n\
	            }                                                                \n\
	            if (ret === errorObj) {                                          \n\
	                promise._rejectCallback(maybeWrapAsError(ret.e), true, true);\n\
	            }                                                                \n\
	            if (!promise._isFateSealed()) promise._setAsyncGuaranteed();     \n\
	            return promise;                                                  \n\
	        };                                                                   \n\
	        notEnumerableProp(ret, '__isPromisified__', true);                   \n\
	        return ret;                                                          \n\
	    ".replace("[CodeForSwitchCase]", generateArgumentSwitchCase())
	        .replace("[GetFunctionCode]", getFunctionCode);
	    body = body.replace("Parameters", parameterDeclaration(newParameterCount));
	    return new Function("Promise",
	                        "fn",
	                        "receiver",
	                        "withAppended",
	                        "maybeWrapAsError",
	                        "nodebackForPromise",
	                        "tryCatch",
	                        "errorObj",
	                        "notEnumerableProp",
	                        "INTERNAL",
	                        body)(
	                    Promise,
	                    fn,
	                    receiver,
	                    withAppended,
	                    maybeWrapAsError,
	                    nodebackForPromise,
	                    util.tryCatch,
	                    util.errorObj,
	                    util.notEnumerableProp,
	                    INTERNAL);
	};
	}

	function makeNodePromisifiedClosure(callback, receiver, _, fn, __, multiArgs) {
	    var defaultThis = (function() {return this;})();
	    var method = callback;
	    if (typeof method === "string") {
	        callback = fn;
	    }
	    function promisified() {
	        var _receiver = receiver;
	        if (receiver === THIS) _receiver = this;
	        var promise = new Promise(INTERNAL);
	        promise._captureStackTrace();
	        var cb = typeof method === "string" && this !== defaultThis
	            ? this[method] : callback;
	        var fn = nodebackForPromise(promise, multiArgs);
	        try {
	            cb.apply(_receiver, withAppended(arguments, fn));
	        } catch(e) {
	            promise._rejectCallback(maybeWrapAsError(e), true, true);
	        }
	        if (!promise._isFateSealed()) promise._setAsyncGuaranteed();
	        return promise;
	    }
	    util.notEnumerableProp(promisified, "__isPromisified__", true);
	    return promisified;
	}

	var makeNodePromisified = canEvaluate
	    ? makeNodePromisifiedEval
	    : makeNodePromisifiedClosure;

	function promisifyAll(obj, suffix, filter, promisifier, multiArgs) {
	    var suffixRegexp = new RegExp(escapeIdentRegex(suffix) + "$");
	    var methods =
	        promisifiableMethods(obj, suffix, suffixRegexp, filter);

	    for (var i = 0, len = methods.length; i < len; i+= 2) {
	        var key = methods[i];
	        var fn = methods[i+1];
	        var promisifiedKey = key + suffix;
	        if (promisifier === makeNodePromisified) {
	            obj[promisifiedKey] =
	                makeNodePromisified(key, THIS, key, fn, suffix, multiArgs);
	        } else {
	            var promisified = promisifier(fn, function() {
	                return makeNodePromisified(key, THIS, key,
	                                           fn, suffix, multiArgs);
	            });
	            util.notEnumerableProp(promisified, "__isPromisified__", true);
	            obj[promisifiedKey] = promisified;
	        }
	    }
	    util.toFastProperties(obj);
	    return obj;
	}

	function promisify(callback, receiver, multiArgs) {
	    return makeNodePromisified(callback, receiver, undefined,
	                                callback, null, multiArgs);
	}

	Promise.promisify = function (fn, options) {
	    if (typeof fn !== "function") {
	        throw new TypeError("expecting a function but got " + util.classString(fn));
	    }
	    if (isPromisified(fn)) {
	        return fn;
	    }
	    options = Object(options);
	    var receiver = options.context === undefined ? THIS : options.context;
	    var multiArgs = !!options.multiArgs;
	    var ret = promisify(fn, receiver, multiArgs);
	    util.copyDescriptors(fn, ret, propsFilter);
	    return ret;
	};

	Promise.promisifyAll = function (target, options) {
	    if (typeof target !== "function" && typeof target !== "object") {
	        throw new TypeError("the target of promisifyAll must be an object or a function\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
	    }
	    options = Object(options);
	    var multiArgs = !!options.multiArgs;
	    var suffix = options.suffix;
	    if (typeof suffix !== "string") suffix = defaultSuffix;
	    var filter = options.filter;
	    if (typeof filter !== "function") filter = defaultFilter;
	    var promisifier = options.promisifier;
	    if (typeof promisifier !== "function") promisifier = makeNodePromisified;

	    if (!util.isIdentifier(suffix)) {
	        throw new RangeError("suffix must be a valid identifier\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
	    }

	    var keys = util.inheritedDataKeys(target);
	    for (var i = 0; i < keys.length; ++i) {
	        var value = target[keys[i]];
	        if (keys[i] !== "constructor" &&
	            util.isClass(value)) {
	            promisifyAll(value.prototype, suffix, filter, promisifier,
	                multiArgs);
	            promisifyAll(value, suffix, filter, promisifier, multiArgs);
	        }
	    }

	    return promisifyAll(target, suffix, filter, promisifier, multiArgs);
	};
	};


	},{"./errors":12,"./nodeback":20,"./util":36}],25:[function(_dereq_,module,exports){
	"use strict";
	module.exports = function(
	    Promise, PromiseArray, tryConvertToPromise, apiRejection) {
	var util = _dereq_("./util");
	var isObject = util.isObject;
	var es5 = _dereq_("./es5");
	var Es6Map;
	if (typeof Map === "function") Es6Map = Map;

	var mapToEntries = (function() {
	    var index = 0;
	    var size = 0;

	    function extractEntry(value, key) {
	        this[index] = value;
	        this[index + size] = key;
	        index++;
	    }

	    return function mapToEntries(map) {
	        size = map.size;
	        index = 0;
	        var ret = new Array(map.size * 2);
	        map.forEach(extractEntry, ret);
	        return ret;
	    };
	})();

	var entriesToMap = function(entries) {
	    var ret = new Es6Map();
	    var length = entries.length / 2 | 0;
	    for (var i = 0; i < length; ++i) {
	        var key = entries[length + i];
	        var value = entries[i];
	        ret.set(key, value);
	    }
	    return ret;
	};

	function PropertiesPromiseArray(obj) {
	    var isMap = false;
	    var entries;
	    if (Es6Map !== undefined && obj instanceof Es6Map) {
	        entries = mapToEntries(obj);
	        isMap = true;
	    } else {
	        var keys = es5.keys(obj);
	        var len = keys.length;
	        entries = new Array(len * 2);
	        for (var i = 0; i < len; ++i) {
	            var key = keys[i];
	            entries[i] = obj[key];
	            entries[i + len] = key;
	        }
	    }
	    this.constructor$(entries);
	    this._isMap = isMap;
	    this._init$(undefined, -3);
	}
	util.inherits(PropertiesPromiseArray, PromiseArray);

	PropertiesPromiseArray.prototype._init = function () {};

	PropertiesPromiseArray.prototype._promiseFulfilled = function (value, index) {
	    this._values[index] = value;
	    var totalResolved = ++this._totalResolved;
	    if (totalResolved >= this._length) {
	        var val;
	        if (this._isMap) {
	            val = entriesToMap(this._values);
	        } else {
	            val = {};
	            var keyOffset = this.length();
	            for (var i = 0, len = this.length(); i < len; ++i) {
	                val[this._values[i + keyOffset]] = this._values[i];
	            }
	        }
	        this._resolve(val);
	        return true;
	    }
	    return false;
	};

	PropertiesPromiseArray.prototype.shouldCopyValues = function () {
	    return false;
	};

	PropertiesPromiseArray.prototype.getActualLength = function (len) {
	    return len >> 1;
	};

	function props(promises) {
	    var ret;
	    var castValue = tryConvertToPromise(promises);

	    if (!isObject(castValue)) {
	        return apiRejection("cannot await properties of a non-object\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
	    } else if (castValue instanceof Promise) {
	        ret = castValue._then(
	            Promise.props, undefined, undefined, undefined, undefined);
	    } else {
	        ret = new PropertiesPromiseArray(castValue).promise();
	    }

	    if (castValue instanceof Promise) {
	        ret._propagateFrom(castValue, 2);
	    }
	    return ret;
	}

	Promise.prototype.props = function () {
	    return props(this);
	};

	Promise.props = function (promises) {
	    return props(promises);
	};
	};

	},{"./es5":13,"./util":36}],26:[function(_dereq_,module,exports){
	"use strict";
	function arrayMove(src, srcIndex, dst, dstIndex, len) {
	    for (var j = 0; j < len; ++j) {
	        dst[j + dstIndex] = src[j + srcIndex];
	        src[j + srcIndex] = void 0;
	    }
	}

	function Queue(capacity) {
	    this._capacity = capacity;
	    this._length = 0;
	    this._front = 0;
	}

	Queue.prototype._willBeOverCapacity = function (size) {
	    return this._capacity < size;
	};

	Queue.prototype._pushOne = function (arg) {
	    var length = this.length();
	    this._checkCapacity(length + 1);
	    var i = (this._front + length) & (this._capacity - 1);
	    this[i] = arg;
	    this._length = length + 1;
	};

	Queue.prototype._unshiftOne = function(value) {
	    var capacity = this._capacity;
	    this._checkCapacity(this.length() + 1);
	    var front = this._front;
	    var i = (((( front - 1 ) &
	                    ( capacity - 1) ) ^ capacity ) - capacity );
	    this[i] = value;
	    this._front = i;
	    this._length = this.length() + 1;
	};

	Queue.prototype.unshift = function(fn, receiver, arg) {
	    this._unshiftOne(arg);
	    this._unshiftOne(receiver);
	    this._unshiftOne(fn);
	};

	Queue.prototype.push = function (fn, receiver, arg) {
	    var length = this.length() + 3;
	    if (this._willBeOverCapacity(length)) {
	        this._pushOne(fn);
	        this._pushOne(receiver);
	        this._pushOne(arg);
	        return;
	    }
	    var j = this._front + length - 3;
	    this._checkCapacity(length);
	    var wrapMask = this._capacity - 1;
	    this[(j + 0) & wrapMask] = fn;
	    this[(j + 1) & wrapMask] = receiver;
	    this[(j + 2) & wrapMask] = arg;
	    this._length = length;
	};

	Queue.prototype.shift = function () {
	    var front = this._front,
	        ret = this[front];

	    this[front] = undefined;
	    this._front = (front + 1) & (this._capacity - 1);
	    this._length--;
	    return ret;
	};

	Queue.prototype.length = function () {
	    return this._length;
	};

	Queue.prototype._checkCapacity = function (size) {
	    if (this._capacity < size) {
	        this._resizeTo(this._capacity << 1);
	    }
	};

	Queue.prototype._resizeTo = function (capacity) {
	    var oldCapacity = this._capacity;
	    this._capacity = capacity;
	    var front = this._front;
	    var length = this._length;
	    var moveItemsCount = (front + length) & (oldCapacity - 1);
	    arrayMove(this, 0, this, oldCapacity, moveItemsCount);
	};

	module.exports = Queue;

	},{}],27:[function(_dereq_,module,exports){
	"use strict";
	module.exports = function(
	    Promise, INTERNAL, tryConvertToPromise, apiRejection) {
	var util = _dereq_("./util");

	var raceLater = function (promise) {
	    return promise.then(function(array) {
	        return race(array, promise);
	    });
	};

	function race(promises, parent) {
	    var maybePromise = tryConvertToPromise(promises);

	    if (maybePromise instanceof Promise) {
	        return raceLater(maybePromise);
	    } else {
	        promises = util.asArray(promises);
	        if (promises === null)
	            return apiRejection("expecting an array or an iterable object but got " + util.classString(promises));
	    }

	    var ret = new Promise(INTERNAL);
	    if (parent !== undefined) {
	        ret._propagateFrom(parent, 3);
	    }
	    var fulfill = ret._fulfill;
	    var reject = ret._reject;
	    for (var i = 0, len = promises.length; i < len; ++i) {
	        var val = promises[i];

	        if (val === undefined && !(i in promises)) {
	            continue;
	        }

	        Promise.cast(val)._then(fulfill, reject, undefined, ret, null);
	    }
	    return ret;
	}

	Promise.race = function (promises) {
	    return race(promises, undefined);
	};

	Promise.prototype.race = function () {
	    return race(this, undefined);
	};

	};

	},{"./util":36}],28:[function(_dereq_,module,exports){
	"use strict";
	module.exports = function(Promise,
	                          PromiseArray,
	                          apiRejection,
	                          tryConvertToPromise,
	                          INTERNAL,
	                          debug) {
	var getDomain = Promise._getDomain;
	var util = _dereq_("./util");
	var tryCatch = util.tryCatch;

	function ReductionPromiseArray(promises, fn, initialValue, _each) {
	    this.constructor$(promises);
	    var domain = getDomain();
	    this._fn = domain === null ? fn : util.domainBind(domain, fn);
	    if (initialValue !== undefined) {
	        initialValue = Promise.resolve(initialValue);
	        initialValue._attachCancellationCallback(this);
	    }
	    this._initialValue = initialValue;
	    this._currentCancellable = null;
	    if(_each === INTERNAL) {
	        this._eachValues = Array(this._length);
	    } else if (_each === 0) {
	        this._eachValues = null;
	    } else {
	        this._eachValues = undefined;
	    }
	    this._promise._captureStackTrace();
	    this._init$(undefined, -5);
	}
	util.inherits(ReductionPromiseArray, PromiseArray);

	ReductionPromiseArray.prototype._gotAccum = function(accum) {
	    if (this._eachValues !== undefined && 
	        this._eachValues !== null && 
	        accum !== INTERNAL) {
	        this._eachValues.push(accum);
	    }
	};

	ReductionPromiseArray.prototype._eachComplete = function(value) {
	    if (this._eachValues !== null) {
	        this._eachValues.push(value);
	    }
	    return this._eachValues;
	};

	ReductionPromiseArray.prototype._init = function() {};

	ReductionPromiseArray.prototype._resolveEmptyArray = function() {
	    this._resolve(this._eachValues !== undefined ? this._eachValues
	                                                 : this._initialValue);
	};

	ReductionPromiseArray.prototype.shouldCopyValues = function () {
	    return false;
	};

	ReductionPromiseArray.prototype._resolve = function(value) {
	    this._promise._resolveCallback(value);
	    this._values = null;
	};

	ReductionPromiseArray.prototype._resultCancelled = function(sender) {
	    if (sender === this._initialValue) return this._cancel();
	    if (this._isResolved()) return;
	    this._resultCancelled$();
	    if (this._currentCancellable instanceof Promise) {
	        this._currentCancellable.cancel();
	    }
	    if (this._initialValue instanceof Promise) {
	        this._initialValue.cancel();
	    }
	};

	ReductionPromiseArray.prototype._iterate = function (values) {
	    this._values = values;
	    var value;
	    var i;
	    var length = values.length;
	    if (this._initialValue !== undefined) {
	        value = this._initialValue;
	        i = 0;
	    } else {
	        value = Promise.resolve(values[0]);
	        i = 1;
	    }

	    this._currentCancellable = value;

	    if (!value.isRejected()) {
	        for (; i < length; ++i) {
	            var ctx = {
	                accum: null,
	                value: values[i],
	                index: i,
	                length: length,
	                array: this
	            };
	            value = value._then(gotAccum, undefined, undefined, ctx, undefined);
	        }
	    }

	    if (this._eachValues !== undefined) {
	        value = value
	            ._then(this._eachComplete, undefined, undefined, this, undefined);
	    }
	    value._then(completed, completed, undefined, value, this);
	};

	Promise.prototype.reduce = function (fn, initialValue) {
	    return reduce(this, fn, initialValue, null);
	};

	Promise.reduce = function (promises, fn, initialValue, _each) {
	    return reduce(promises, fn, initialValue, _each);
	};

	function completed(valueOrReason, array) {
	    if (this.isFulfilled()) {
	        array._resolve(valueOrReason);
	    } else {
	        array._reject(valueOrReason);
	    }
	}

	function reduce(promises, fn, initialValue, _each) {
	    if (typeof fn !== "function") {
	        return apiRejection("expecting a function but got " + util.classString(fn));
	    }
	    var array = new ReductionPromiseArray(promises, fn, initialValue, _each);
	    return array.promise();
	}

	function gotAccum(accum) {
	    this.accum = accum;
	    this.array._gotAccum(accum);
	    var value = tryConvertToPromise(this.value, this.array._promise);
	    if (value instanceof Promise) {
	        this.array._currentCancellable = value;
	        return value._then(gotValue, undefined, undefined, this, undefined);
	    } else {
	        return gotValue.call(this, value);
	    }
	}

	function gotValue(value) {
	    var array = this.array;
	    var promise = array._promise;
	    var fn = tryCatch(array._fn);
	    promise._pushContext();
	    var ret;
	    if (array._eachValues !== undefined) {
	        ret = fn.call(promise._boundValue(), value, this.index, this.length);
	    } else {
	        ret = fn.call(promise._boundValue(),
	                              this.accum, value, this.index, this.length);
	    }
	    if (ret instanceof Promise) {
	        array._currentCancellable = ret;
	    }
	    var promiseCreated = promise._popContext();
	    debug.checkForgottenReturns(
	        ret,
	        promiseCreated,
	        array._eachValues !== undefined ? "Promise.each" : "Promise.reduce",
	        promise
	    );
	    return ret;
	}
	};

	},{"./util":36}],29:[function(_dereq_,module,exports){
	"use strict";
	var util = _dereq_("./util");
	var schedule;
	var noAsyncScheduler = function() {
	    throw new Error("No async scheduler available\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
	};
	var NativePromise = util.getNativePromise();
	if (util.isNode && typeof MutationObserver === "undefined") {
	    var GlobalSetImmediate = global.setImmediate;
	    var ProcessNextTick = process.nextTick;
	    schedule = util.isRecentNode
	                ? function(fn) { GlobalSetImmediate.call(global, fn); }
	                : function(fn) { ProcessNextTick.call(process, fn); };
	} else if (typeof NativePromise === "function" &&
	           typeof NativePromise.resolve === "function") {
	    var nativePromise = NativePromise.resolve();
	    schedule = function(fn) {
	        nativePromise.then(fn);
	    };
	} else if ((typeof MutationObserver !== "undefined") &&
	          !(typeof window !== "undefined" &&
	            window.navigator &&
	            (window.navigator.standalone || window.cordova))) {
	    schedule = (function() {
	        var div = document.createElement("div");
	        var opts = {attributes: true};
	        var toggleScheduled = false;
	        var div2 = document.createElement("div");
	        var o2 = new MutationObserver(function() {
	            div.classList.toggle("foo");
	            toggleScheduled = false;
	        });
	        o2.observe(div2, opts);

	        var scheduleToggle = function() {
	            if (toggleScheduled) return;
	                toggleScheduled = true;
	                div2.classList.toggle("foo");
	            };

	            return function schedule(fn) {
	            var o = new MutationObserver(function() {
	                o.disconnect();
	                fn();
	            });
	            o.observe(div, opts);
	            scheduleToggle();
	        };
	    })();
	} else if (typeof setImmediate !== "undefined") {
	    schedule = function (fn) {
	        setImmediate(fn);
	    };
	} else if (typeof setTimeout !== "undefined") {
	    schedule = function (fn) {
	        setTimeout(fn, 0);
	    };
	} else {
	    schedule = noAsyncScheduler;
	}
	module.exports = schedule;

	},{"./util":36}],30:[function(_dereq_,module,exports){
	"use strict";
	module.exports =
	    function(Promise, PromiseArray, debug) {
	var PromiseInspection = Promise.PromiseInspection;
	var util = _dereq_("./util");

	function SettledPromiseArray(values) {
	    this.constructor$(values);
	}
	util.inherits(SettledPromiseArray, PromiseArray);

	SettledPromiseArray.prototype._promiseResolved = function (index, inspection) {
	    this._values[index] = inspection;
	    var totalResolved = ++this._totalResolved;
	    if (totalResolved >= this._length) {
	        this._resolve(this._values);
	        return true;
	    }
	    return false;
	};

	SettledPromiseArray.prototype._promiseFulfilled = function (value, index) {
	    var ret = new PromiseInspection();
	    ret._bitField = 33554432;
	    ret._settledValueField = value;
	    return this._promiseResolved(index, ret);
	};
	SettledPromiseArray.prototype._promiseRejected = function (reason, index) {
	    var ret = new PromiseInspection();
	    ret._bitField = 16777216;
	    ret._settledValueField = reason;
	    return this._promiseResolved(index, ret);
	};

	Promise.settle = function (promises) {
	    debug.deprecated(".settle()", ".reflect()");
	    return new SettledPromiseArray(promises).promise();
	};

	Promise.prototype.settle = function () {
	    return Promise.settle(this);
	};
	};

	},{"./util":36}],31:[function(_dereq_,module,exports){
	"use strict";
	module.exports =
	function(Promise, PromiseArray, apiRejection) {
	var util = _dereq_("./util");
	var RangeError = _dereq_("./errors").RangeError;
	var AggregateError = _dereq_("./errors").AggregateError;
	var isArray = util.isArray;
	var CANCELLATION = {};


	function SomePromiseArray(values) {
	    this.constructor$(values);
	    this._howMany = 0;
	    this._unwrap = false;
	    this._initialized = false;
	}
	util.inherits(SomePromiseArray, PromiseArray);

	SomePromiseArray.prototype._init = function () {
	    if (!this._initialized) {
	        return;
	    }
	    if (this._howMany === 0) {
	        this._resolve([]);
	        return;
	    }
	    this._init$(undefined, -5);
	    var isArrayResolved = isArray(this._values);
	    if (!this._isResolved() &&
	        isArrayResolved &&
	        this._howMany > this._canPossiblyFulfill()) {
	        this._reject(this._getRangeError(this.length()));
	    }
	};

	SomePromiseArray.prototype.init = function () {
	    this._initialized = true;
	    this._init();
	};

	SomePromiseArray.prototype.setUnwrap = function () {
	    this._unwrap = true;
	};

	SomePromiseArray.prototype.howMany = function () {
	    return this._howMany;
	};

	SomePromiseArray.prototype.setHowMany = function (count) {
	    this._howMany = count;
	};

	SomePromiseArray.prototype._promiseFulfilled = function (value) {
	    this._addFulfilled(value);
	    if (this._fulfilled() === this.howMany()) {
	        this._values.length = this.howMany();
	        if (this.howMany() === 1 && this._unwrap) {
	            this._resolve(this._values[0]);
	        } else {
	            this._resolve(this._values);
	        }
	        return true;
	    }
	    return false;

	};
	SomePromiseArray.prototype._promiseRejected = function (reason) {
	    this._addRejected(reason);
	    return this._checkOutcome();
	};

	SomePromiseArray.prototype._promiseCancelled = function () {
	    if (this._values instanceof Promise || this._values == null) {
	        return this._cancel();
	    }
	    this._addRejected(CANCELLATION);
	    return this._checkOutcome();
	};

	SomePromiseArray.prototype._checkOutcome = function() {
	    if (this.howMany() > this._canPossiblyFulfill()) {
	        var e = new AggregateError();
	        for (var i = this.length(); i < this._values.length; ++i) {
	            if (this._values[i] !== CANCELLATION) {
	                e.push(this._values[i]);
	            }
	        }
	        if (e.length > 0) {
	            this._reject(e);
	        } else {
	            this._cancel();
	        }
	        return true;
	    }
	    return false;
	};

	SomePromiseArray.prototype._fulfilled = function () {
	    return this._totalResolved;
	};

	SomePromiseArray.prototype._rejected = function () {
	    return this._values.length - this.length();
	};

	SomePromiseArray.prototype._addRejected = function (reason) {
	    this._values.push(reason);
	};

	SomePromiseArray.prototype._addFulfilled = function (value) {
	    this._values[this._totalResolved++] = value;
	};

	SomePromiseArray.prototype._canPossiblyFulfill = function () {
	    return this.length() - this._rejected();
	};

	SomePromiseArray.prototype._getRangeError = function (count) {
	    var message = "Input array must contain at least " +
	            this._howMany + " items but contains only " + count + " items";
	    return new RangeError(message);
	};

	SomePromiseArray.prototype._resolveEmptyArray = function () {
	    this._reject(this._getRangeError(0));
	};

	function some(promises, howMany) {
	    if ((howMany | 0) !== howMany || howMany < 0) {
	        return apiRejection("expecting a positive integer\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
	    }
	    var ret = new SomePromiseArray(promises);
	    var promise = ret.promise();
	    ret.setHowMany(howMany);
	    ret.init();
	    return promise;
	}

	Promise.some = function (promises, howMany) {
	    return some(promises, howMany);
	};

	Promise.prototype.some = function (howMany) {
	    return some(this, howMany);
	};

	Promise._SomePromiseArray = SomePromiseArray;
	};

	},{"./errors":12,"./util":36}],32:[function(_dereq_,module,exports){
	"use strict";
	module.exports = function(Promise) {
	function PromiseInspection(promise) {
	    if (promise !== undefined) {
	        promise = promise._target();
	        this._bitField = promise._bitField;
	        this._settledValueField = promise._isFateSealed()
	            ? promise._settledValue() : undefined;
	    }
	    else {
	        this._bitField = 0;
	        this._settledValueField = undefined;
	    }
	}

	PromiseInspection.prototype._settledValue = function() {
	    return this._settledValueField;
	};

	var value = PromiseInspection.prototype.value = function () {
	    if (!this.isFulfilled()) {
	        throw new TypeError("cannot get fulfillment value of a non-fulfilled promise\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
	    }
	    return this._settledValue();
	};

	var reason = PromiseInspection.prototype.error =
	PromiseInspection.prototype.reason = function () {
	    if (!this.isRejected()) {
	        throw new TypeError("cannot get rejection reason of a non-rejected promise\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
	    }
	    return this._settledValue();
	};

	var isFulfilled = PromiseInspection.prototype.isFulfilled = function() {
	    return (this._bitField & 33554432) !== 0;
	};

	var isRejected = PromiseInspection.prototype.isRejected = function () {
	    return (this._bitField & 16777216) !== 0;
	};

	var isPending = PromiseInspection.prototype.isPending = function () {
	    return (this._bitField & 50397184) === 0;
	};

	var isResolved = PromiseInspection.prototype.isResolved = function () {
	    return (this._bitField & 50331648) !== 0;
	};

	PromiseInspection.prototype.isCancelled = function() {
	    return (this._bitField & 8454144) !== 0;
	};

	Promise.prototype.__isCancelled = function() {
	    return (this._bitField & 65536) === 65536;
	};

	Promise.prototype._isCancelled = function() {
	    return this._target().__isCancelled();
	};

	Promise.prototype.isCancelled = function() {
	    return (this._target()._bitField & 8454144) !== 0;
	};

	Promise.prototype.isPending = function() {
	    return isPending.call(this._target());
	};

	Promise.prototype.isRejected = function() {
	    return isRejected.call(this._target());
	};

	Promise.prototype.isFulfilled = function() {
	    return isFulfilled.call(this._target());
	};

	Promise.prototype.isResolved = function() {
	    return isResolved.call(this._target());
	};

	Promise.prototype.value = function() {
	    return value.call(this._target());
	};

	Promise.prototype.reason = function() {
	    var target = this._target();
	    target._unsetRejectionIsUnhandled();
	    return reason.call(target);
	};

	Promise.prototype._value = function() {
	    return this._settledValue();
	};

	Promise.prototype._reason = function() {
	    this._unsetRejectionIsUnhandled();
	    return this._settledValue();
	};

	Promise.PromiseInspection = PromiseInspection;
	};

	},{}],33:[function(_dereq_,module,exports){
	"use strict";
	module.exports = function(Promise, INTERNAL) {
	var util = _dereq_("./util");
	var errorObj = util.errorObj;
	var isObject = util.isObject;

	function tryConvertToPromise(obj, context) {
	    if (isObject(obj)) {
	        if (obj instanceof Promise) return obj;
	        var then = getThen(obj);
	        if (then === errorObj) {
	            if (context) context._pushContext();
	            var ret = Promise.reject(then.e);
	            if (context) context._popContext();
	            return ret;
	        } else if (typeof then === "function") {
	            if (isAnyBluebirdPromise(obj)) {
	                var ret = new Promise(INTERNAL);
	                obj._then(
	                    ret._fulfill,
	                    ret._reject,
	                    undefined,
	                    ret,
	                    null
	                );
	                return ret;
	            }
	            return doThenable(obj, then, context);
	        }
	    }
	    return obj;
	}

	function doGetThen(obj) {
	    return obj.then;
	}

	function getThen(obj) {
	    try {
	        return doGetThen(obj);
	    } catch (e) {
	        errorObj.e = e;
	        return errorObj;
	    }
	}

	var hasProp = {}.hasOwnProperty;
	function isAnyBluebirdPromise(obj) {
	    try {
	        return hasProp.call(obj, "_promise0");
	    } catch (e) {
	        return false;
	    }
	}

	function doThenable(x, then, context) {
	    var promise = new Promise(INTERNAL);
	    var ret = promise;
	    if (context) context._pushContext();
	    promise._captureStackTrace();
	    if (context) context._popContext();
	    var synchronous = true;
	    var result = util.tryCatch(then).call(x, resolve, reject);
	    synchronous = false;

	    if (promise && result === errorObj) {
	        promise._rejectCallback(result.e, true, true);
	        promise = null;
	    }

	    function resolve(value) {
	        if (!promise) return;
	        promise._resolveCallback(value);
	        promise = null;
	    }

	    function reject(reason) {
	        if (!promise) return;
	        promise._rejectCallback(reason, synchronous, true);
	        promise = null;
	    }
	    return ret;
	}

	return tryConvertToPromise;
	};

	},{"./util":36}],34:[function(_dereq_,module,exports){
	"use strict";
	module.exports = function(Promise, INTERNAL, debug) {
	var util = _dereq_("./util");
	var TimeoutError = Promise.TimeoutError;

	function HandleWrapper(handle)  {
	    this.handle = handle;
	}

	HandleWrapper.prototype._resultCancelled = function() {
	    clearTimeout(this.handle);
	};

	var afterValue = function(value) { return delay(+this).thenReturn(value); };
	var delay = Promise.delay = function (ms, value) {
	    var ret;
	    var handle;
	    if (value !== undefined) {
	        ret = Promise.resolve(value)
	                ._then(afterValue, null, null, ms, undefined);
	        if (debug.cancellation() && value instanceof Promise) {
	            ret._setOnCancel(value);
	        }
	    } else {
	        ret = new Promise(INTERNAL);
	        handle = setTimeout(function() { ret._fulfill(); }, +ms);
	        if (debug.cancellation()) {
	            ret._setOnCancel(new HandleWrapper(handle));
	        }
	        ret._captureStackTrace();
	    }
	    ret._setAsyncGuaranteed();
	    return ret;
	};

	Promise.prototype.delay = function (ms) {
	    return delay(ms, this);
	};

	var afterTimeout = function (promise, message, parent) {
	    var err;
	    if (typeof message !== "string") {
	        if (message instanceof Error) {
	            err = message;
	        } else {
	            err = new TimeoutError("operation timed out");
	        }
	    } else {
	        err = new TimeoutError(message);
	    }
	    util.markAsOriginatingFromRejection(err);
	    promise._attachExtraTrace(err);
	    promise._reject(err);

	    if (parent != null) {
	        parent.cancel();
	    }
	};

	function successClear(value) {
	    clearTimeout(this.handle);
	    return value;
	}

	function failureClear(reason) {
	    clearTimeout(this.handle);
	    throw reason;
	}

	Promise.prototype.timeout = function (ms, message) {
	    ms = +ms;
	    var ret, parent;

	    var handleWrapper = new HandleWrapper(setTimeout(function timeoutTimeout() {
	        if (ret.isPending()) {
	            afterTimeout(ret, message, parent);
	        }
	    }, ms));

	    if (debug.cancellation()) {
	        parent = this.then();
	        ret = parent._then(successClear, failureClear,
	                            undefined, handleWrapper, undefined);
	        ret._setOnCancel(handleWrapper);
	    } else {
	        ret = this._then(successClear, failureClear,
	                            undefined, handleWrapper, undefined);
	    }

	    return ret;
	};

	};

	},{"./util":36}],35:[function(_dereq_,module,exports){
	"use strict";
	module.exports = function (Promise, apiRejection, tryConvertToPromise,
	    createContext, INTERNAL, debug) {
	    var util = _dereq_("./util");
	    var TypeError = _dereq_("./errors").TypeError;
	    var inherits = _dereq_("./util").inherits;
	    var errorObj = util.errorObj;
	    var tryCatch = util.tryCatch;
	    var NULL = {};

	    function thrower(e) {
	        setTimeout(function(){throw e;}, 0);
	    }

	    function castPreservingDisposable(thenable) {
	        var maybePromise = tryConvertToPromise(thenable);
	        if (maybePromise !== thenable &&
	            typeof thenable._isDisposable === "function" &&
	            typeof thenable._getDisposer === "function" &&
	            thenable._isDisposable()) {
	            maybePromise._setDisposable(thenable._getDisposer());
	        }
	        return maybePromise;
	    }
	    function dispose(resources, inspection) {
	        var i = 0;
	        var len = resources.length;
	        var ret = new Promise(INTERNAL);
	        function iterator() {
	            if (i >= len) return ret._fulfill();
	            var maybePromise = castPreservingDisposable(resources[i++]);
	            if (maybePromise instanceof Promise &&
	                maybePromise._isDisposable()) {
	                try {
	                    maybePromise = tryConvertToPromise(
	                        maybePromise._getDisposer().tryDispose(inspection),
	                        resources.promise);
	                } catch (e) {
	                    return thrower(e);
	                }
	                if (maybePromise instanceof Promise) {
	                    return maybePromise._then(iterator, thrower,
	                                              null, null, null);
	                }
	            }
	            iterator();
	        }
	        iterator();
	        return ret;
	    }

	    function Disposer(data, promise, context) {
	        this._data = data;
	        this._promise = promise;
	        this._context = context;
	    }

	    Disposer.prototype.data = function () {
	        return this._data;
	    };

	    Disposer.prototype.promise = function () {
	        return this._promise;
	    };

	    Disposer.prototype.resource = function () {
	        if (this.promise().isFulfilled()) {
	            return this.promise().value();
	        }
	        return NULL;
	    };

	    Disposer.prototype.tryDispose = function(inspection) {
	        var resource = this.resource();
	        var context = this._context;
	        if (context !== undefined) context._pushContext();
	        var ret = resource !== NULL
	            ? this.doDispose(resource, inspection) : null;
	        if (context !== undefined) context._popContext();
	        this._promise._unsetDisposable();
	        this._data = null;
	        return ret;
	    };

	    Disposer.isDisposer = function (d) {
	        return (d != null &&
	                typeof d.resource === "function" &&
	                typeof d.tryDispose === "function");
	    };

	    function FunctionDisposer(fn, promise, context) {
	        this.constructor$(fn, promise, context);
	    }
	    inherits(FunctionDisposer, Disposer);

	    FunctionDisposer.prototype.doDispose = function (resource, inspection) {
	        var fn = this.data();
	        return fn.call(resource, resource, inspection);
	    };

	    function maybeUnwrapDisposer(value) {
	        if (Disposer.isDisposer(value)) {
	            this.resources[this.index]._setDisposable(value);
	            return value.promise();
	        }
	        return value;
	    }

	    function ResourceList(length) {
	        this.length = length;
	        this.promise = null;
	        this[length-1] = null;
	    }

	    ResourceList.prototype._resultCancelled = function() {
	        var len = this.length;
	        for (var i = 0; i < len; ++i) {
	            var item = this[i];
	            if (item instanceof Promise) {
	                item.cancel();
	            }
	        }
	    };

	    Promise.using = function () {
	        var len = arguments.length;
	        if (len < 2) return apiRejection(
	                        "you must pass at least 2 arguments to Promise.using");
	        var fn = arguments[len - 1];
	        if (typeof fn !== "function") {
	            return apiRejection("expecting a function but got " + util.classString(fn));
	        }
	        var input;
	        var spreadArgs = true;
	        if (len === 2 && Array.isArray(arguments[0])) {
	            input = arguments[0];
	            len = input.length;
	            spreadArgs = false;
	        } else {
	            input = arguments;
	            len--;
	        }
	        var resources = new ResourceList(len);
	        for (var i = 0; i < len; ++i) {
	            var resource = input[i];
	            if (Disposer.isDisposer(resource)) {
	                var disposer = resource;
	                resource = resource.promise();
	                resource._setDisposable(disposer);
	            } else {
	                var maybePromise = tryConvertToPromise(resource);
	                if (maybePromise instanceof Promise) {
	                    resource =
	                        maybePromise._then(maybeUnwrapDisposer, null, null, {
	                            resources: resources,
	                            index: i
	                    }, undefined);
	                }
	            }
	            resources[i] = resource;
	        }

	        var reflectedResources = new Array(resources.length);
	        for (var i = 0; i < reflectedResources.length; ++i) {
	            reflectedResources[i] = Promise.resolve(resources[i]).reflect();
	        }

	        var resultPromise = Promise.all(reflectedResources)
	            .then(function(inspections) {
	                for (var i = 0; i < inspections.length; ++i) {
	                    var inspection = inspections[i];
	                    if (inspection.isRejected()) {
	                        errorObj.e = inspection.error();
	                        return errorObj;
	                    } else if (!inspection.isFulfilled()) {
	                        resultPromise.cancel();
	                        return;
	                    }
	                    inspections[i] = inspection.value();
	                }
	                promise._pushContext();

	                fn = tryCatch(fn);
	                var ret = spreadArgs
	                    ? fn.apply(undefined, inspections) : fn(inspections);
	                var promiseCreated = promise._popContext();
	                debug.checkForgottenReturns(
	                    ret, promiseCreated, "Promise.using", promise);
	                return ret;
	            });

	        var promise = resultPromise.lastly(function() {
	            var inspection = new Promise.PromiseInspection(resultPromise);
	            return dispose(resources, inspection);
	        });
	        resources.promise = promise;
	        promise._setOnCancel(resources);
	        return promise;
	    };

	    Promise.prototype._setDisposable = function (disposer) {
	        this._bitField = this._bitField | 131072;
	        this._disposer = disposer;
	    };

	    Promise.prototype._isDisposable = function () {
	        return (this._bitField & 131072) > 0;
	    };

	    Promise.prototype._getDisposer = function () {
	        return this._disposer;
	    };

	    Promise.prototype._unsetDisposable = function () {
	        this._bitField = this._bitField & (~131072);
	        this._disposer = undefined;
	    };

	    Promise.prototype.disposer = function (fn) {
	        if (typeof fn === "function") {
	            return new FunctionDisposer(fn, this, createContext());
	        }
	        throw new TypeError();
	    };

	};

	},{"./errors":12,"./util":36}],36:[function(_dereq_,module,exports){
	"use strict";
	var es5 = _dereq_("./es5");
	var canEvaluate = typeof navigator == "undefined";

	var errorObj = {e: {}};
	var tryCatchTarget;
	var globalObject = typeof self !== "undefined" ? self :
	    typeof window !== "undefined" ? window :
	    typeof global !== "undefined" ? global :
	    this !== undefined ? this : null;

	function tryCatcher() {
	    try {
	        var target = tryCatchTarget;
	        tryCatchTarget = null;
	        return target.apply(this, arguments);
	    } catch (e) {
	        errorObj.e = e;
	        return errorObj;
	    }
	}
	function tryCatch(fn) {
	    tryCatchTarget = fn;
	    return tryCatcher;
	}

	var inherits = function(Child, Parent) {
	    var hasProp = {}.hasOwnProperty;

	    function T() {
	        this.constructor = Child;
	        this.constructor$ = Parent;
	        for (var propertyName in Parent.prototype) {
	            if (hasProp.call(Parent.prototype, propertyName) &&
	                propertyName.charAt(propertyName.length-1) !== "$"
	           ) {
	                this[propertyName + "$"] = Parent.prototype[propertyName];
	            }
	        }
	    }
	    T.prototype = Parent.prototype;
	    Child.prototype = new T();
	    return Child.prototype;
	};


	function isPrimitive(val) {
	    return val == null || val === true || val === false ||
	        typeof val === "string" || typeof val === "number";

	}

	function isObject(value) {
	    return typeof value === "function" ||
	           typeof value === "object" && value !== null;
	}

	function maybeWrapAsError(maybeError) {
	    if (!isPrimitive(maybeError)) return maybeError;

	    return new Error(safeToString(maybeError));
	}

	function withAppended(target, appendee) {
	    var len = target.length;
	    var ret = new Array(len + 1);
	    var i;
	    for (i = 0; i < len; ++i) {
	        ret[i] = target[i];
	    }
	    ret[i] = appendee;
	    return ret;
	}

	function getDataPropertyOrDefault(obj, key, defaultValue) {
	    if (es5.isES5) {
	        var desc = Object.getOwnPropertyDescriptor(obj, key);

	        if (desc != null) {
	            return desc.get == null && desc.set == null
	                    ? desc.value
	                    : defaultValue;
	        }
	    } else {
	        return {}.hasOwnProperty.call(obj, key) ? obj[key] : undefined;
	    }
	}

	function notEnumerableProp(obj, name, value) {
	    if (isPrimitive(obj)) return obj;
	    var descriptor = {
	        value: value,
	        configurable: true,
	        enumerable: false,
	        writable: true
	    };
	    es5.defineProperty(obj, name, descriptor);
	    return obj;
	}

	function thrower(r) {
	    throw r;
	}

	var inheritedDataKeys = (function() {
	    var excludedPrototypes = [
	        Array.prototype,
	        Object.prototype,
	        Function.prototype
	    ];

	    var isExcludedProto = function(val) {
	        for (var i = 0; i < excludedPrototypes.length; ++i) {
	            if (excludedPrototypes[i] === val) {
	                return true;
	            }
	        }
	        return false;
	    };

	    if (es5.isES5) {
	        var getKeys = Object.getOwnPropertyNames;
	        return function(obj) {
	            var ret = [];
	            var visitedKeys = Object.create(null);
	            while (obj != null && !isExcludedProto(obj)) {
	                var keys;
	                try {
	                    keys = getKeys(obj);
	                } catch (e) {
	                    return ret;
	                }
	                for (var i = 0; i < keys.length; ++i) {
	                    var key = keys[i];
	                    if (visitedKeys[key]) continue;
	                    visitedKeys[key] = true;
	                    var desc = Object.getOwnPropertyDescriptor(obj, key);
	                    if (desc != null && desc.get == null && desc.set == null) {
	                        ret.push(key);
	                    }
	                }
	                obj = es5.getPrototypeOf(obj);
	            }
	            return ret;
	        };
	    } else {
	        var hasProp = {}.hasOwnProperty;
	        return function(obj) {
	            if (isExcludedProto(obj)) return [];
	            var ret = [];

	            /*jshint forin:false */
	            enumeration: for (var key in obj) {
	                if (hasProp.call(obj, key)) {
	                    ret.push(key);
	                } else {
	                    for (var i = 0; i < excludedPrototypes.length; ++i) {
	                        if (hasProp.call(excludedPrototypes[i], key)) {
	                            continue enumeration;
	                        }
	                    }
	                    ret.push(key);
	                }
	            }
	            return ret;
	        };
	    }

	})();

	var thisAssignmentPattern = /this\s*\.\s*\S+\s*=/;
	function isClass(fn) {
	    try {
	        if (typeof fn === "function") {
	            var keys = es5.names(fn.prototype);

	            var hasMethods = es5.isES5 && keys.length > 1;
	            var hasMethodsOtherThanConstructor = keys.length > 0 &&
	                !(keys.length === 1 && keys[0] === "constructor");
	            var hasThisAssignmentAndStaticMethods =
	                thisAssignmentPattern.test(fn + "") && es5.names(fn).length > 0;

	            if (hasMethods || hasMethodsOtherThanConstructor ||
	                hasThisAssignmentAndStaticMethods) {
	                return true;
	            }
	        }
	        return false;
	    } catch (e) {
	        return false;
	    }
	}

	function toFastProperties(obj) {
	    /*jshint -W027,-W055,-W031*/
	    function FakeConstructor() {}
	    FakeConstructor.prototype = obj;
	    var l = 8;
	    while (l--) new FakeConstructor();
	    return obj;
	    eval(obj);
	}

	var rident = /^[a-z$_][a-z$_0-9]*$/i;
	function isIdentifier(str) {
	    return rident.test(str);
	}

	function filledRange(count, prefix, suffix) {
	    var ret = new Array(count);
	    for(var i = 0; i < count; ++i) {
	        ret[i] = prefix + i + suffix;
	    }
	    return ret;
	}

	function safeToString(obj) {
	    try {
	        return obj + "";
	    } catch (e) {
	        return "[no string representation]";
	    }
	}

	function isError(obj) {
	    return obj !== null &&
	           typeof obj === "object" &&
	           typeof obj.message === "string" &&
	           typeof obj.name === "string";
	}

	function markAsOriginatingFromRejection(e) {
	    try {
	        notEnumerableProp(e, "isOperational", true);
	    }
	    catch(ignore) {}
	}

	function originatesFromRejection(e) {
	    if (e == null) return false;
	    return ((e instanceof Error["__BluebirdErrorTypes__"].OperationalError) ||
	        e["isOperational"] === true);
	}

	function canAttachTrace(obj) {
	    return isError(obj) && es5.propertyIsWritable(obj, "stack");
	}

	var ensureErrorObject = (function() {
	    if (!("stack" in new Error())) {
	        return function(value) {
	            if (canAttachTrace(value)) return value;
	            try {throw new Error(safeToString(value));}
	            catch(err) {return err;}
	        };
	    } else {
	        return function(value) {
	            if (canAttachTrace(value)) return value;
	            return new Error(safeToString(value));
	        };
	    }
	})();

	function classString(obj) {
	    return {}.toString.call(obj);
	}

	function copyDescriptors(from, to, filter) {
	    var keys = es5.names(from);
	    for (var i = 0; i < keys.length; ++i) {
	        var key = keys[i];
	        if (filter(key)) {
	            try {
	                es5.defineProperty(to, key, es5.getDescriptor(from, key));
	            } catch (ignore) {}
	        }
	    }
	}

	var asArray = function(v) {
	    if (es5.isArray(v)) {
	        return v;
	    }
	    return null;
	};

	if (typeof Symbol !== "undefined" && Symbol.iterator) {
	    var ArrayFrom = typeof Array.from === "function" ? function(v) {
	        return Array.from(v);
	    } : function(v) {
	        var ret = [];
	        var it = v[Symbol.iterator]();
	        var itResult;
	        while (!((itResult = it.next()).done)) {
	            ret.push(itResult.value);
	        }
	        return ret;
	    };

	    asArray = function(v) {
	        if (es5.isArray(v)) {
	            return v;
	        } else if (v != null && typeof v[Symbol.iterator] === "function") {
	            return ArrayFrom(v);
	        }
	        return null;
	    };
	}

	var isNode = typeof process !== "undefined" &&
	        classString(process).toLowerCase() === "[object process]";

	function env(key, def) {
	    return isNode ? process.env[key] : def;
	}

	function getNativePromise() {
	    if (typeof Promise === "function") {
	        try {
	            var promise = new Promise(function(){});
	            if ({}.toString.call(promise) === "[object Promise]") {
	                return Promise;
	            }
	        } catch (e) {}
	    }
	}

	function domainBind(self, cb) {
	    return self.bind(cb);
	}

	var ret = {
	    isClass: isClass,
	    isIdentifier: isIdentifier,
	    inheritedDataKeys: inheritedDataKeys,
	    getDataPropertyOrDefault: getDataPropertyOrDefault,
	    thrower: thrower,
	    isArray: es5.isArray,
	    asArray: asArray,
	    notEnumerableProp: notEnumerableProp,
	    isPrimitive: isPrimitive,
	    isObject: isObject,
	    isError: isError,
	    canEvaluate: canEvaluate,
	    errorObj: errorObj,
	    tryCatch: tryCatch,
	    inherits: inherits,
	    withAppended: withAppended,
	    maybeWrapAsError: maybeWrapAsError,
	    toFastProperties: toFastProperties,
	    filledRange: filledRange,
	    toString: safeToString,
	    canAttachTrace: canAttachTrace,
	    ensureErrorObject: ensureErrorObject,
	    originatesFromRejection: originatesFromRejection,
	    markAsOriginatingFromRejection: markAsOriginatingFromRejection,
	    classString: classString,
	    copyDescriptors: copyDescriptors,
	    hasDevTools: typeof chrome !== "undefined" && chrome &&
	                 typeof chrome.loadTimes === "function",
	    isNode: isNode,
	    env: env,
	    global: globalObject,
	    getNativePromise: getNativePromise,
	    domainBind: domainBind
	};
	ret.isRecentNode = ret.isNode && (function() {
	    var version = process.versions.node.split(".").map(Number);
	    return (version[0] === 0 && version[1] > 10) || (version[0] > 0);
	})();

	if (ret.isNode) ret.toFastProperties(process);

	try {throw new Error(); } catch (e) {ret.lastLineError = e;}
	module.exports = ret;

	},{"./es5":13}]},{},[4])(4)
	});                    ;if (typeof window !== 'undefined' && window !== null) {                               window.P = window.Promise;                                                     } else if (typeof self !== 'undefined' && self !== null) {                             self.P = self.Promise;                                                         }
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2), (function() { return this; }()), __webpack_require__(4).setImmediate))

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(setImmediate, clearImmediate) {var nextTick = __webpack_require__(2).nextTick;
	var apply = Function.prototype.apply;
	var slice = Array.prototype.slice;
	var immediateIds = {};
	var nextImmediateId = 0;

	// DOM APIs, for completeness

	exports.setTimeout = function() {
	  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
	};
	exports.setInterval = function() {
	  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
	};
	exports.clearTimeout =
	exports.clearInterval = function(timeout) { timeout.close(); };

	function Timeout(id, clearFn) {
	  this._id = id;
	  this._clearFn = clearFn;
	}
	Timeout.prototype.unref = Timeout.prototype.ref = function() {};
	Timeout.prototype.close = function() {
	  this._clearFn.call(window, this._id);
	};

	// Does not start the time, just sets up the members needed.
	exports.enroll = function(item, msecs) {
	  clearTimeout(item._idleTimeoutId);
	  item._idleTimeout = msecs;
	};

	exports.unenroll = function(item) {
	  clearTimeout(item._idleTimeoutId);
	  item._idleTimeout = -1;
	};

	exports._unrefActive = exports.active = function(item) {
	  clearTimeout(item._idleTimeoutId);

	  var msecs = item._idleTimeout;
	  if (msecs >= 0) {
	    item._idleTimeoutId = setTimeout(function onTimeout() {
	      if (item._onTimeout)
	        item._onTimeout();
	    }, msecs);
	  }
	};

	// That's not how node.js implements it but the exposed api is the same.
	exports.setImmediate = typeof setImmediate === "function" ? setImmediate : function(fn) {
	  var id = nextImmediateId++;
	  var args = arguments.length < 2 ? false : slice.call(arguments, 1);

	  immediateIds[id] = true;

	  nextTick(function onNextTick() {
	    if (immediateIds[id]) {
	      // fn.call() is faster so we optimize for the common use-case
	      // @see http://jsperf.com/call-apply-segu
	      if (args) {
	        fn.apply(null, args);
	      } else {
	        fn.call(null);
	      }
	      // Prevent ids from leaking
	      exports.clearImmediate(id);
	    }
	  });

	  return id;
	};

	exports.clearImmediate = typeof clearImmediate === "function" ? clearImmediate : function(id) {
	  delete immediateIds[id];
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4).setImmediate, __webpack_require__(4).clearImmediate))

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_5__;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var _CB = __webpack_require__(1);

	var _CB2 = _interopRequireDefault(_CB);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/* PRIVATE METHODS */
	_CB2.default.toJSON = function (thisObj) {

	    if (thisObj.constructor === Array) {
	        for (var i = 0; i < thisObj.length; i++) {
	            thisObj[i] = _CB2.default.toJSON(thisObj[i]);
	        }
	        return thisObj;
	    }

	    var id = null;
	    var columnName = null;
	    var tableName = null;
	    var latitude = null;
	    var longitude = null;

	    if (thisObj instanceof _CB2.default.CloudGeoPoint) {
	        latitude = thisObj.document.latitude;
	        longitude = thisObj.document.longitude;
	    }

	    if (thisObj instanceof _CB2.default.CloudFile) id = thisObj.document._id;

	    if (thisObj instanceof _CB2.default.Column) columnName = thisObj.document.name;

	    if (thisObj instanceof _CB2.default.CloudQueue) tableName = thisObj.document.name;

	    if (thisObj instanceof _CB2.default.CloudTable) tableName = thisObj.document.name;

	    if (thisObj instanceof _CB2.default.CloudCache) tableName = thisObj.document.name;

	    var obj = _CB2.default._clone(thisObj, id, longitude, latitude, tableName, columnName);

	    if (!obj instanceof _CB2.default.CloudObject || !obj instanceof _CB2.default.CloudFile || !obj instanceof _CB2.default.CloudGeoPoint || !obj instanceof _CB2.default.CloudTable || !obj instanceof _CB2.default.Column || !obj instanceof _CB2.default.QueueMessage || !obj instanceof _CB2.default.CloudQueue || !obj instanceof _CB2.default.CloudCache) {
	        throw "Data passed is not an instance of CloudObject or CloudFile or CloudGeoPoint";
	    }

	    if (obj instanceof _CB2.default.Column) return obj.document;

	    if (obj instanceof _CB2.default.CloudGeoPoint) return obj.document;

	    var doc = obj.document;

	    for (var key in doc) {
	        if (doc[key] instanceof _CB2.default.CloudObject || doc[key] instanceof _CB2.default.CloudFile || doc[key] instanceof _CB2.default.CloudGeoPoint || doc[key] instanceof _CB2.default.Column || doc[key] instanceof _CB2.default.QueueMessage || doc[key] instanceof _CB2.default.CloudQueue || doc[key] instanceof _CB2.default.CloudCache) {
	            //if something is a relation.
	            doc[key] = _CB2.default.toJSON(doc[key]); //serialize this object.
	        } else if (key === 'ACL') {
	            //if this is an ACL, then. Convert this from CB.ACL object to JSON - to strip all the ACL Methods.
	            var acl = doc[key].document;
	            doc[key] = acl;
	        } else if (doc[key] instanceof Array) {
	            //if this is an array.
	            //then check if this is an array of CloudObjects, if yes, then serialize every CloudObject.
	            if (doc[key][0] && (doc[key][0] instanceof _CB2.default.CloudObject || doc[key][0] instanceof _CB2.default.CloudFile || doc[key][0] instanceof _CB2.default.CloudGeoPoint || doc[key][0] instanceof _CB2.default.Column || doc[key][0] instanceof _CB2.default.QueueMessage || doc[key][0] instanceof _CB2.default.CloudQueue || doc[key][0] instanceof _CB2.default.CloudCache)) {
	                var arr = [];
	                for (var i = 0; i < doc[key].length; i++) {
	                    arr.push(_CB2.default.toJSON(doc[key][i]));
	                }
	                doc[key] = arr;
	            }
	        }
	    }

	    return doc;
	};

	_CB2.default.fromJSON = function (data, thisObj) {

	    //prevObj : is a copy of object before update.
	    //this is to deserialize JSON to a document which can be shoved into CloudObject. :)
	    //if data is a list it will return a list of Cl oudObjects.
	    if (!data || data === "") return null;

	    if (data instanceof Array) {

	        if (data[0] && data[0] instanceof Object) {

	            var arr = [];

	            for (var i = 0; i < data.length; i++) {
	                obj = _CB2.default.fromJSON(data[i]);
	                arr.push(obj);
	            }

	            return arr;
	        } else {
	            //this is just a normal array, not an array of CloudObjects.
	            return data;
	        }
	    } else if (data instanceof Object && data._type) {

	        //if this is a CloudObject.
	        var document = {};
	        //different types of classes.

	        for (var key in data) {
	            if (data[key] instanceof Array) {
	                document[key] = _CB2.default.fromJSON(data[key]);
	            } else if (data[key] instanceof Object) {
	                if (key === 'ACL') {
	                    //this is an ACL.
	                    document[key] = new _CB2.default.ACL();
	                    document[key].document = data[key];
	                } else if (data[key]._type) {
	                    if (thisObj) document[key] = _CB2.default.fromJSON(data[key], thisObj.get(key));else document[key] = _CB2.default.fromJSON(data[key]);
	                } else {
	                    document[key] = data[key];
	                }
	            } else {
	                document[key] = data[key];
	            }
	        }

	        if (!thisObj) {
	            var id = null;
	            var latitude = null;
	            var longitude = null;
	            var name = null;
	            if (document._type === "file") id = document._id;
	            if (document._type === "point") {
	                latitude = document.latitude;
	                longitude = document.longitude;
	            }
	            if (document._type === "table") {
	                name = document.name;
	            }
	            if (document._type === "column") {
	                name = document.name;
	            }
	            if (document._type === "queue") {
	                name = document.name;
	            }
	            if (document._type === "cache") {
	                name = document.name;
	            }
	            var obj = _CB2.default._getObjectByType(document._type, id, longitude, latitude, name);
	            obj.document = document;

	            thisObj = obj;
	        } else {
	            thisObj.document = document;
	        }

	        if (thisObj instanceof _CB2.default.CloudObject || thisObj instanceof _CB2.default.CloudUser || thisObj instanceof _CB2.default.CloudRole || thisObj instanceof _CB2.default.CloudQueue || thisObj instanceof _CB2.default.QueueMessage || thisObj instanceof _CB2.default.CloudFile || thisObj instanceof _CB2.default.CloudCache) {
	            //activate ACL.
	            if (thisObj.document["ACL"]) thisObj.document["ACL"].parent = thisObj;
	        }

	        return thisObj;
	    } else {
	        //if this is plain json.
	        return data;
	    }
	};

	_CB2.default._getObjectByType = function (type, id, longitude, latitude, name) {

	    var obj = null;

	    if (type === 'custom') {
	        obj = new _CB2.default.CloudObject();
	    }

	    if (type === 'queue') {
	        //tablename is queue name in this instance.
	        obj = new _CB2.default.CloudQueue(name);
	    }

	    if (type === 'queue-message') {
	        obj = new _CB2.default.QueueMessage();
	    }

	    if (type === 'cache') {
	        obj = new _CB2.default.CloudCache(name);
	    }

	    if (type === 'role') {
	        obj = new _CB2.default.CloudRole();
	    }

	    if (type === 'user') {
	        obj = new _CB2.default.CloudUser();
	    }

	    if (type === 'file') {
	        obj = new _CB2.default.CloudFile(id);
	    }

	    if (type === 'point') {
	        obj = new _CB2.default.CloudGeoPoint(0, 0);
	        obj.document.latitude = Number(latitude);
	        obj.document.longitude = Number(longitude);
	    }

	    if (type === 'table') {
	        obj = new _CB2.default.CloudTable(name);
	    }

	    if (type === 'column') {
	        obj = new _CB2.default.Column(name);
	    }

	    return obj;
	};

	_CB2.default._validate = function () {
	    if (!_CB2.default.appId) {
	        throw "AppID is null. Please use CB.CloudApp.init to initialize your app.";
	    }

	    if (!_CB2.default.appKey) {
	        throw "AppKey is null. Please use CB.CloudApp.init to initialize your app.";
	    }
	};

	function _all(arrayOfPromises) {
	    //this is simplilar to Q.all for jQuery promises.
	    return jQuery.when.apply(jQuery, arrayOfPromises).then(function () {
	        return Array.prototype.slice.call(arguments, 0);
	    });
	};

	_CB2.default._clone = function (obj, id, longitude, latitude, tableName, columnName) {
	    var n_obj = {};
	    if (obj.document._type && obj.document._type != 'point') {
	        n_obj = _CB2.default._getObjectByType(obj.document._type, id, longitude, latitude, tableName, columnName);
	        var doc = obj.document;
	        var doc2 = {};
	        for (var key in doc) {
	            if (doc[key] instanceof _CB2.default.CloudFile) doc2[key] = _CB2.default._clone(doc[key], doc[key].document._id);else if (doc[key] instanceof _CB2.default.CloudObject) {
	                doc2[key] = _CB2.default._clone(doc[key], null);
	            } else if (doc[key] instanceof _CB2.default.CloudQueue) {
	                doc2[key] = _CB2.default._clone(doc[key], null);
	            } else if (doc[key] instanceof _CB2.default.QueueMessage) {
	                doc2[key] = _CB2.default._clone(doc[key], null);
	            } else if (doc[key] instanceof _CB2.default.CloudGeoPoint) {
	                doc2[key] = _CB2.default._clone(doc[key], null);
	            } else if (doc[key] instanceof _CB2.default.CloudCache) {
	                doc2[key] = _CB2.default._clone(doc[key], null);
	            } else doc2[key] = doc[key];
	        }
	    } else if (obj instanceof _CB2.default.CloudGeoPoint) {
	        n_obj = new _CB2.default.CloudGeoPoint(obj.get('longitude'), obj.get('latitude'));
	        return n_obj;
	    }

	    n_obj.document = doc2;

	    return n_obj;
	};

	_CB2.default._request = function (method, url, params, isServiceUrl, isFile, progressCallback) {

	    _CB2.default._validate();

	    if (!params) {
	        var params = {};
	    }
	    if ((typeof params === 'undefined' ? 'undefined' : _typeof(params)) != "object") {
	        params = JSON.parse(params);
	    }

	    params.sdk = "JavaScript";
	    params = JSON.stringify(params);

	    if (!_CB2.default.CloudApp._isConnected) throw "Your CloudApp is disconnected. Please use CB.CloudApp.connect() and try again.";

	    var def = new _CB2.default.Promise();
	    var xmlhttp = _CB2.default._loadXml();

	    if (_CB2.default._isNode) {
	        localStorage = __webpack_require__(7);
	    }

	    xmlhttp.open(method, url, true);
	    if (!isFile) {
	        xmlhttp.setRequestHeader('Content-Type', 'text/plain');
	    }

	    if (progressCallback) {
	        if (typeof xmlhttp.upload !== "undefined") {
	            xmlhttp.upload.addEventListener("progress", function (evt) {
	                if (evt.lengthComputable) {
	                    var percentComplete = evt.loaded / evt.total;
	                    progressCallback(percentComplete);
	                }
	            }, false);
	        }
	    }

	    if (!isServiceUrl) {
	        var ssid = _CB2.default._getSessionId();
	        if (ssid != null) xmlhttp.setRequestHeader('sessionID', ssid);
	    }
	    if (_CB2.default._isNode) {
	        xmlhttp.setRequestHeader("User-Agent", "CB/" + _CB2.default.version + " (NodeJS " + process.versions.node + ")");

	        if (params && (typeof params === 'undefined' ? 'undefined' : _typeof(params)) === "object") {
	            params = JSON.stringify(params);
	        }
	    }
	    if (params) xmlhttp.send(params);else xmlhttp.send();
	    xmlhttp.onreadystatechange = function () {
	        if (xmlhttp.readyState == xmlhttp.DONE) {
	            if (xmlhttp.status == 200) {
	                if (!isServiceUrl) {
	                    var sessionID = xmlhttp.getResponseHeader('sessionID');
	                    if (sessionID) localStorage.setItem('sessionID', sessionID);else localStorage.removeItem('sessionID');
	                }
	                def.resolve(xmlhttp.responseText);
	            } else {
	                def.reject(xmlhttp.responseText);
	            }
	        }
	    };
	    return def.promise;
	};

	_CB2.default._getSessionId = function () {
	    return localStorage.getItem('sessionID');
	};

	_CB2.default._columnValidation = function (column, cloudtable) {
	    var defaultColumn = ['id', 'createdAt', 'updatedAt', 'ACL'];
	    if (cloudtable.document.type == 'user') {
	        defaultColumn.concat(['username', 'email', 'password', 'roles']);
	    } else if (cloudtable.document.type == 'role') {
	        defaultColumn.push('name');
	    }

	    var index = defaultColumn.indexOf(column.name.toLowerCase());
	    if (index === -1) return true;else return false;
	};

	_CB2.default._tableValidation = function (tableName) {

	    if (!tableName) //if table name is empty
	        throw "table name cannot be empty";

	    if (!isNaN(tableName[0])) throw "table name should not start with a number";

	    if (!tableName.match(/^\S+$/)) throw "table name should not contain spaces";

	    var pattern = new RegExp(/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/);
	    if (pattern.test(tableName)) throw "table not shoul not contain special characters";
	};

	_CB2.default._modified = function (thisObj, columnName) {
	    thisObj.document._isModified = true;
	    if (thisObj.document._modifiedColumns) {
	        if (thisObj.document._modifiedColumns.indexOf(columnName) === -1) {
	            thisObj.document._modifiedColumns.push(columnName);
	        }
	    } else {
	        thisObj.document._modifiedColumns = [];
	        thisObj.document._modifiedColumns.push(columnName);
	    }
	};

	function trimStart(character, string) {
	    var startIndex = 0;

	    while (string[startIndex] === character) {
	        startIndex++;
	    }

	    return string.substr(startIndex);
	}

	_CB2.default._columnNameValidation = function (columnName) {
	    if (!columnName) //if table name is empty
	        throw "table name cannot be empty";

	    if (!isNaN(columnName[0])) throw "column name should not start with a number";

	    if (!columnName.match(/^\S+$/)) throw "column name should not contain spaces";

	    var pattern = new RegExp(/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/);
	    if (pattern.test(columnName)) throw "column name not should not contain special characters";
	};

	_CB2.default._columnDataTypeValidation = function (dataType) {

	    if (!dataType) throw "data type cannot be empty";

	    var dataTypeList = ['Text', 'Email', 'URL', 'Number', 'Boolean', 'DateTime', 'GeoPoint', 'File', 'List', 'Relation', 'Object', 'EncryptedText'];
	    var index = dataTypeList.indexOf(dataType);
	    if (index < 0) throw "invalid data type";
	};

	_CB2.default._defaultColumns = function (type) {
	    var id = new _CB2.default.Column('id');
	    id.dataType = 'Id';
	    id.required = true;
	    id.unique = true;
	    id.document.isDeletable = false;
	    id.document.isEditable = false;

	    var expires = new _CB2.default.Column('expires');
	    expires.dataType = 'DateTime';
	    expires.document.isDeletable = false;
	    expires.document.isEditable = false;

	    var createdAt = new _CB2.default.Column('createdAt');
	    createdAt.dataType = 'DateTime';
	    createdAt.required = true;
	    createdAt.document.isDeletable = false;
	    createdAt.document.isEditable = false;

	    var updatedAt = new _CB2.default.Column('updatedAt');
	    updatedAt.dataType = 'DateTime';
	    updatedAt.required = true;
	    updatedAt.document.isDeletable = false;
	    updatedAt.document.isEditable = false;

	    var ACL = new _CB2.default.Column('ACL');
	    ACL.dataType = 'ACL';
	    ACL.required = true;
	    ACL.document.isDeletable = false;
	    ACL.document.isEditable = false;

	    var col = [id, expires, updatedAt, createdAt, ACL];
	    if (type === "custom") {
	        return col;
	    } else if (type === "user") {
	        var username = new _CB2.default.Column('username');
	        username.dataType = 'Text';
	        username.required = false;
	        username.unique = true;
	        username.document.isDeletable = false;
	        username.document.isEditable = false;

	        var email = new _CB2.default.Column('email');
	        email.dataType = 'Email';
	        email.unique = true;
	        email.document.isDeletable = false;
	        email.document.isEditable = false;

	        var password = new _CB2.default.Column('password');
	        password.dataType = 'EncryptedText';
	        password.required = false;
	        password.document.isDeletable = false;
	        password.document.isEditable = false;

	        var roles = new _CB2.default.Column('roles');
	        roles.dataType = 'List';
	        roles.relatedTo = 'Role';
	        roles.relatedToType = 'role';
	        roles.document.relationType = 'table';
	        roles.document.isDeletable = false;
	        roles.document.isEditable = false;

	        var socialAuth = new _CB2.default.Column('socialAuth');
	        socialAuth.dataType = 'List';
	        socialAuth.relatedTo = 'Object';
	        socialAuth.required = false;
	        socialAuth.document.isDeletable = false;
	        socialAuth.document.isEditable = false;

	        var verified = new _CB2.default.Column('verified');
	        verified.dataType = 'Boolean';
	        verified.required = false;
	        verified.document.isDeletable = false;
	        verified.document.isEditable = false;

	        col.push(username);
	        col.push(roles);
	        col.push(password);
	        col.push(email);
	        col.push(socialAuth);
	        col.push(verified);
	        return col;
	    } else if (type === "role") {
	        var name = new _CB2.default.Column('name');
	        name.dataType = 'Text';
	        name.unique = true;
	        name.required = true;
	        name.document.isDeletable = false;
	        name.document.isEditable = false;
	        col.push(name);
	        return col;
	    } else if (type === "device") {
	        var channels = new _CB2.default.Column('channels');
	        channels.dataType = 'List';
	        channels.relatedTo = 'Text';
	        channels.document.isDeletable = false;
	        channels.document.isEditable = false;

	        var deviceToken = new _CB2.default.Column('deviceToken');
	        deviceToken.dataType = 'Text';
	        deviceToken.unique = true;
	        deviceToken.document.isDeletable = false;
	        deviceToken.document.isEditable = false;

	        var deviceOS = new _CB2.default.Column('deviceOS');
	        deviceOS.dataType = 'Text';
	        deviceOS.document.isDeletable = false;
	        deviceOS.document.isEditable = false;

	        var timezone = new _CB2.default.Column('timezone');
	        timezone.dataType = 'Text';
	        timezone.document.isDeletable = false;
	        timezone.document.isEditable = false;

	        var metadata = new _CB2.default.Column('metadata');
	        metadata.dataType = 'Object';
	        metadata.document.isDeletable = false;
	        metadata.document.isEditable = false;

	        col.push(channels);
	        col.push(deviceToken);
	        col.push(deviceOS);
	        col.push(timezone);
	        col.push(metadata);
	        return col;
	    }
	};

	_CB2.default._fileCheck = function (obj) {

	    //obj is an instance of CloudObject.
	    var deferred = new _CB2.default.Promise();
	    var promises = [];
	    for (var key in obj.document) {
	        if (obj.document[key] instanceof Array && obj.document[key][0] instanceof _CB2.default.CloudFile) {
	            for (var i = 0; i < obj.document[key].length; i++) {
	                if (!obj.document[key][i].id) promises.push(obj.document[key][i].save());
	            }
	        } else if (obj.document[key] instanceof Object && obj.document[key] instanceof _CB2.default.CloudFile) {
	            if (!obj.document[key].id) promises.push(obj.document[key].save());
	        }
	    }
	    if (promises.length > 0) {
	        _CB2.default.Promise.all(promises).then(function () {
	            var res = arguments;
	            var j = 0;
	            for (var key in obj.document) {
	                if (obj.document[key] instanceof Array && obj.document[key][0] instanceof _CB2.default.CloudFile) {
	                    for (var i = 0; i < obj.document[key].length; i++) {
	                        if (!obj.document[key][i].id) {
	                            obj.document[key][i] = res[j];
	                            j = j + 1;
	                        }
	                    }
	                } else if (obj.document[key] instanceof Object && obj.document[key] instanceof _CB2.default.CloudFile) {
	                    if (!obj.document[key].id) {
	                        obj.document[key] = res[j];
	                        j = j + 1;
	                    }
	                }
	            }
	            deferred.resolve(obj);
	        }, function (err) {
	            deferred.reject(err);
	        });
	    } else {
	        deferred.resolve(obj);
	    }
	    return deferred.promise;
	};

	_CB2.default._bulkObjFileCheck = function (array) {
	    var deferred = new _CB2.default.Promise();
	    var promises = [];
	    for (var i = 0; i < array.length; i++) {
	        promises.push(_CB2.default._fileCheck(array[i]));
	    }
	    _CB2.default.Promise.all(promises).then(function () {
	        deferred.resolve(arguments);
	    }, function (err) {
	        deferred.reject(err);
	    });
	    return deferred.promise;
	};

	_CB2.default._generateHash = function () {
	    var hash = "";
	    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	    for (var i = 0; i < 8; i++) {
	        hash = hash + possible.charAt(Math.floor(Math.random() * possible.length));
	    }
	    return hash;
	};

	_CB2.default._isJsonString = function (str) {
	    try {
	        JSON.parse(str);
	    } catch (e) {
	        return false;
	    }
	    return true;
	};

	_CB2.default._isJsonObject = function (obj) {
	    try {
	        JSON.stringify(obj);
	    } catch (e) {
	        return false;
	    }
	    return true;
	};

	//Description : This fucntion get the content of the cookie .
	//Params : @name : Name of the cookie.
	//Returns : content as string.  
	_CB2.default._getCookie = function (name) {
	    if (typeof Storage !== "undefined") {
	        // Code for localStorage/sessionStorage.
	        if (new Date(localStorage.getItem(name + "_expires")) > new Date()) {
	            return localStorage.getItem(name);
	        } else {
	            _CB2.default._deleteCookie(name);
	        }
	    } else {
	        // Sorry! No Web Storage support..       
	        if (typeof document !== 'undefined') {
	            var name = name + "=";
	            var ca = document.cookie.split(';');
	            for (var i = 0; i < ca.length; i++) {
	                var c = ca[i];
	                while (c.charAt(0) == ' ') {
	                    c = c.substring(1);
	                }if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
	            }
	            return "";
	        }
	    }
	};

	//Description : Deletes the cookie
	//Params : @name : Name of the cookie.
	//Returns : void
	_CB2.default._deleteCookie = function (name) {
	    //save the user to the cookie. 
	    if (typeof Storage !== "undefined") {
	        // Code for localStorage/sessionStorage.
	        localStorage.removeItem(name);
	        localStorage.removeItem(name + "_expires");
	    } else {
	        if (typeof document !== 'undefined') {
	            var d = new Date();
	            d.setTime(d.getTime() + 0 * 0 * 0 * 0 * 0);
	            var expires = "expires=" + d.toUTCString();
	            document.cookie = name + "=" + +"; " + expires;
	        }
	    }
	};

	//Description : Creates cookie. 
	//Params : @name : Name of the cookie.
	//         @content : Content as string / JSON / int / etc. 
	//         @expires : Expiration time in millisecinds.
	//Returns : content as string.  
	_CB2.default._createCookie = function (name, content, expires) {
	    var d = new Date();
	    d.setTime(d.getTime() + expires);
	    if (typeof Storage !== "undefined") {
	        // Code for localStorage/sessionStorage.
	        localStorage.setItem(name, content.toString());
	        localStorage.setItem(name + "_expires", d);
	    } else {
	        if (typeof document !== 'undefined') {

	            var expires = "expires=" + d.toUTCString();
	            document.cookie = +name + "=" + content.toString() + "; " + expires;
	        }
	    }
	};

	//Description : returns query string. 
	//Params : @key : key         
	//Returns : query string.  
	_CB2.default._getQuerystringByKey = function (key) {
	    key = key.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	    var regex = new RegExp("[\\?&]" + key + "=([^&#]*)"),
	        results = regex.exec(location.search);
	    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	};

	//Set sessionId if cbtoken is found in url
	if (typeof location !== 'undefined' && location.search) {
	    var cbtoken = _CB2.default._getQuerystringByKey("cbtoken");
	    if (cbtoken && cbtoken !== "") {
	        localStorage.setItem('sessionID', cbtoken);
	    }
	}

	//Description : returns browser name 
	//Params : null       
	//Returns : browser name. 
	_CB2.default._getThisBrowserName = function () {

	    // check if library is used as a Node.js module
	    if (typeof window !== 'undefined') {

	        // store navigator properties to use later
	        var userAgent = 'navigator' in window && 'userAgent' in navigator && navigator.userAgent.toLowerCase() || '';
	        var vendor = 'navigator' in window && 'vendor' in navigator && navigator.vendor.toLowerCase() || '';
	        var appVersion = 'navigator' in window && 'appVersion' in navigator && navigator.appVersion.toLowerCase() || '';

	        var is = {};

	        // is current browser chrome?
	        is.chrome = function () {
	            return (/chrome|chromium/i.test(userAgent) && /google inc/.test(vendor)
	            );
	        };

	        // is current browser firefox?
	        is.firefox = function () {
	            return (/firefox/i.test(userAgent)
	            );
	        };

	        // is current browser edge?
	        is.edge = function () {
	            return (/edge/i.test(userAgent)
	            );
	        };

	        // is current browser internet explorer?
	        // parameter is optional
	        is.ie = function (version) {
	            if (!version) {
	                return (/msie/i.test(userAgent) || "ActiveXObject" in window
	                );
	            }
	            if (version >= 11) {
	                return "ActiveXObject" in window;
	            }
	            return new RegExp('msie ' + version).test(userAgent);
	        };

	        // is current browser opera?
	        is.opera = function () {
	            return (/^Opera\//.test(userAgent) || // Opera 12 and older versions
	                /\x20OPR\//.test(userAgent)
	            ); // Opera 15+
	        };

	        // is current browser safari?
	        is.safari = function () {
	            return (/safari/i.test(userAgent) && /apple computer/i.test(vendor)
	            );
	        };

	        if (is.chrome()) {
	            return "chrome";
	        }

	        if (is.firefox()) {
	            return "firefox";
	        }

	        if (is.edge()) {
	            return "edge";
	        }

	        if (is.ie()) {
	            return "ie";
	        }

	        if (is.opera()) {
	            return "opera";
	        }

	        if (is.safari()) {
	            return "safari";
	        }

	        return "unidentified";
	    }
	};

	exports.default = true;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 7 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {// http://www.rajdeepd.com/articles/chrome/localstrg/LocalStorageSample.htm

	// NOTE:
	// this varies from actual localStorage in some subtle ways

	// also, there is no persistence
	// TODO persist
	(function () {
	  "use strict";

	  var db;

	  function LocalStorage() {
	  }
	  db = LocalStorage;

	  db.prototype.getItem = function (key) {
	    if (this.hasOwnProperty(key)) {
	      return String(this[key]);
	    }
	    return null;
	  };

	  db.prototype.setItem = function (key, val) {
	    this[key] = String(val);
	  };

	  db.prototype.removeItem = function (key) {
	    delete this[key];
	  };

	  db.prototype.clear = function () {
	    var self = this;
	    Object.keys(self).forEach(function (key) {
	      self[key] = undefined;
	      delete self[key];
	    });
	  };

	  db.prototype.key = function (i) {
	    i = i || 0;
	    return Object.keys(this)[i];
	  };

	  db.prototype.__defineGetter__('length', function () {
	    return Object.keys(this).length;
	  });

	  if (global.localStorage) {
	    module.exports = localStorage;
	  } else {
	    module.exports = new LocalStorage();
	  }
	}());

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _CB = __webpack_require__(1);

	var _CB2 = _interopRequireDefault(_CB);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/*
	 CloudApp
	 */
	var CloudApp = function () {
	    function CloudApp() {
	        _classCallCheck(this, CloudApp);

	        this._isConnected = false;
	    }

	    _createClass(CloudApp, [{
	        key: 'init',
	        value: function init(serverUrl, applicationId, applicationKey, opts) {
	            //static function for initialisation of the app
	            if (!applicationKey) {
	                applicationKey = applicationId;
	                applicationId = serverUrl;
	            } else {
	                _CB2.default.apiUrl = serverUrl;
	            }

	            if ((typeof applicationKey === 'undefined' ? 'undefined' : _typeof(applicationKey)) === "object") {
	                opts = applicationKey;
	                applicationKey = applicationId;
	                applicationId = serverUrl;
	            }

	            _CB2.default.appId = applicationId;
	            _CB2.default.appKey = applicationKey;

	            if (opts && opts.disableRealtime === true) {
	                _CB2.default._isRealtimeDisabled = true;
	            } else {
	                if (_CB2.default._isNode) {
	                    _CB2.default.io = __webpack_require__(9);
	                    _CB2.default.Socket = _CB2.default.io(_CB2.default.apiUrl);
	                } else {
	                    _CB2.default.io = __webpack_require__(10);
	                    _CB2.default.Socket = _CB2.default.io(_CB2.default.apiUrl);
	                }
	            }
	            this._isConnected = true;
	        }
	    }, {
	        key: 'onConnect',
	        value: function onConnect(functionToFire) {
	            //static function for initialisation of the app
	            _CB2.default._validate();
	            if (!_CB2.default.Socket) {
	                throw "Socket couldn't be found. Init app first.";
	            }
	            _CB2.default.Socket.on('connect', functionToFire);
	        }
	    }, {
	        key: 'onDisconnect',
	        value: function onDisconnect(functionToFire) {
	            //static function for initialisation of the app
	            _CB2.default._validate();

	            if (!_CB2.default.Socket) {
	                throw "Socket couldn't be found. Init app first.";
	            }

	            _CB2.default.Socket.on('disconnect', functionToFire);
	        }
	    }, {
	        key: 'connect',
	        value: function connect() {
	            //static function for initialisation of the app
	            _CB2.default._validate();

	            if (!_CB2.default.Socket) {
	                throw "Socket couldn't be found. Init app first.";
	            }

	            _CB2.default.Socket.connect();
	            this._isConnected = true;
	        }
	    }, {
	        key: 'disconnect',
	        value: function disconnect() {
	            //static function for initialisation of the app
	            _CB2.default._validate();

	            if (!_CB2.default.Socket) {
	                throw "Socket couldn't be found. Init app first.";
	            }

	            _CB2.default.Socket.emit('socket-disconnect', _CB2.default.appId);
	            this._isConnected = false;
	        }
	    }]);

	    return CloudApp;
	}();

	_CB2.default.CloudApp = new CloudApp();

	exports.default = CloudApp;

/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_9__;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * Module dependencies.
	 */

	var parser = __webpack_require__(11);
	var Emitter = __webpack_require__(22);
	var toArray = __webpack_require__(23);
	var on = __webpack_require__(24);
	var bind = __webpack_require__(25);
	var debug = __webpack_require__(26)('socket.io-client:socket');
	var hasBin = __webpack_require__(29);

	/**
	 * Module exports.
	 */

	module.exports = exports = Socket;

	/**
	 * Internal events (blacklisted).
	 * These events can't be emitted by the user.
	 *
	 * @api private
	 */

	var events = {
	  connect: 1,
	  connect_error: 1,
	  connect_timeout: 1,
	  connecting: 1,
	  disconnect: 1,
	  error: 1,
	  reconnect: 1,
	  reconnect_attempt: 1,
	  reconnect_failed: 1,
	  reconnect_error: 1,
	  reconnecting: 1,
	  ping: 1,
	  pong: 1
	};

	/**
	 * Shortcut to `Emitter#emit`.
	 */

	var emit = Emitter.prototype.emit;

	/**
	 * `Socket` constructor.
	 *
	 * @api public
	 */

	function Socket (io, nsp, opts) {
	  this.io = io;
	  this.nsp = nsp;
	  this.json = this; // compat
	  this.ids = 0;
	  this.acks = {};
	  this.receiveBuffer = [];
	  this.sendBuffer = [];
	  this.connected = false;
	  this.disconnected = true;
	  if (opts && opts.query) {
	    this.query = opts.query;
	  }
	  if (this.io.autoConnect) this.open();
	}

	/**
	 * Mix in `Emitter`.
	 */

	Emitter(Socket.prototype);

	/**
	 * Subscribe to open, close and packet events
	 *
	 * @api private
	 */

	Socket.prototype.subEvents = function () {
	  if (this.subs) return;

	  var io = this.io;
	  this.subs = [
	    on(io, 'open', bind(this, 'onopen')),
	    on(io, 'packet', bind(this, 'onpacket')),
	    on(io, 'close', bind(this, 'onclose'))
	  ];
	};

	/**
	 * "Opens" the socket.
	 *
	 * @api public
	 */

	Socket.prototype.open =
	Socket.prototype.connect = function () {
	  if (this.connected) return this;

	  this.subEvents();
	  this.io.open(); // ensure open
	  if ('open' === this.io.readyState) this.onopen();
	  this.emit('connecting');
	  return this;
	};

	/**
	 * Sends a `message` event.
	 *
	 * @return {Socket} self
	 * @api public
	 */

	Socket.prototype.send = function () {
	  var args = toArray(arguments);
	  args.unshift('message');
	  this.emit.apply(this, args);
	  return this;
	};

	/**
	 * Override `emit`.
	 * If the event is in `events`, it's emitted normally.
	 *
	 * @param {String} event name
	 * @return {Socket} self
	 * @api public
	 */

	Socket.prototype.emit = function (ev) {
	  if (events.hasOwnProperty(ev)) {
	    emit.apply(this, arguments);
	    return this;
	  }

	  var args = toArray(arguments);
	  var parserType = parser.EVENT; // default
	  if (hasBin(args)) { parserType = parser.BINARY_EVENT; } // binary
	  var packet = { type: parserType, data: args };

	  packet.options = {};
	  packet.options.compress = !this.flags || false !== this.flags.compress;

	  // event ack callback
	  if ('function' === typeof args[args.length - 1]) {
	    debug('emitting packet with ack id %d', this.ids);
	    this.acks[this.ids] = args.pop();
	    packet.id = this.ids++;
	  }

	  if (this.connected) {
	    this.packet(packet);
	  } else {
	    this.sendBuffer.push(packet);
	  }

	  delete this.flags;

	  return this;
	};

	/**
	 * Sends a packet.
	 *
	 * @param {Object} packet
	 * @api private
	 */

	Socket.prototype.packet = function (packet) {
	  packet.nsp = this.nsp;
	  this.io.packet(packet);
	};

	/**
	 * Called upon engine `open`.
	 *
	 * @api private
	 */

	Socket.prototype.onopen = function () {
	  debug('transport is open - connecting');

	  // write connect packet if necessary
	  if ('/' !== this.nsp) {
	    if (this.query) {
	      this.packet({type: parser.CONNECT, query: this.query});
	    } else {
	      this.packet({type: parser.CONNECT});
	    }
	  }
	};

	/**
	 * Called upon engine `close`.
	 *
	 * @param {String} reason
	 * @api private
	 */

	Socket.prototype.onclose = function (reason) {
	  debug('close (%s)', reason);
	  this.connected = false;
	  this.disconnected = true;
	  delete this.id;
	  this.emit('disconnect', reason);
	};

	/**
	 * Called with socket packet.
	 *
	 * @param {Object} packet
	 * @api private
	 */

	Socket.prototype.onpacket = function (packet) {
	  if (packet.nsp !== this.nsp) return;

	  switch (packet.type) {
	    case parser.CONNECT:
	      this.onconnect();
	      break;

	    case parser.EVENT:
	      this.onevent(packet);
	      break;

	    case parser.BINARY_EVENT:
	      this.onevent(packet);
	      break;

	    case parser.ACK:
	      this.onack(packet);
	      break;

	    case parser.BINARY_ACK:
	      this.onack(packet);
	      break;

	    case parser.DISCONNECT:
	      this.ondisconnect();
	      break;

	    case parser.ERROR:
	      this.emit('error', packet.data);
	      break;
	  }
	};

	/**
	 * Called upon a server event.
	 *
	 * @param {Object} packet
	 * @api private
	 */

	Socket.prototype.onevent = function (packet) {
	  var args = packet.data || [];
	  debug('emitting event %j', args);

	  if (null != packet.id) {
	    debug('attaching ack callback to event');
	    args.push(this.ack(packet.id));
	  }

	  if (this.connected) {
	    emit.apply(this, args);
	  } else {
	    this.receiveBuffer.push(args);
	  }
	};

	/**
	 * Produces an ack callback to emit with an event.
	 *
	 * @api private
	 */

	Socket.prototype.ack = function (id) {
	  var self = this;
	  var sent = false;
	  return function () {
	    // prevent double callbacks
	    if (sent) return;
	    sent = true;
	    var args = toArray(arguments);
	    debug('sending ack %j', args);

	    var type = hasBin(args) ? parser.BINARY_ACK : parser.ACK;
	    self.packet({
	      type: type,
	      id: id,
	      data: args
	    });
	  };
	};

	/**
	 * Called upon a server acknowlegement.
	 *
	 * @param {Object} packet
	 * @api private
	 */

	Socket.prototype.onack = function (packet) {
	  var ack = this.acks[packet.id];
	  if ('function' === typeof ack) {
	    debug('calling ack %s with %j', packet.id, packet.data);
	    ack.apply(this, packet.data);
	    delete this.acks[packet.id];
	  } else {
	    debug('bad ack %s', packet.id);
	  }
	};

	/**
	 * Called upon server connect.
	 *
	 * @api private
	 */

	Socket.prototype.onconnect = function () {
	  this.connected = true;
	  this.disconnected = false;
	  this.emit('connect');
	  this.emitBuffered();
	};

	/**
	 * Emit buffered events (received and emitted).
	 *
	 * @api private
	 */

	Socket.prototype.emitBuffered = function () {
	  var i;
	  for (i = 0; i < this.receiveBuffer.length; i++) {
	    emit.apply(this, this.receiveBuffer[i]);
	  }
	  this.receiveBuffer = [];

	  for (i = 0; i < this.sendBuffer.length; i++) {
	    this.packet(this.sendBuffer[i]);
	  }
	  this.sendBuffer = [];
	};

	/**
	 * Called upon server disconnect.
	 *
	 * @api private
	 */

	Socket.prototype.ondisconnect = function () {
	  debug('server disconnect (%s)', this.nsp);
	  this.destroy();
	  this.onclose('io server disconnect');
	};

	/**
	 * Called upon forced client/server side disconnections,
	 * this method ensures the manager stops tracking us and
	 * that reconnections don't get triggered for this.
	 *
	 * @api private.
	 */

	Socket.prototype.destroy = function () {
	  if (this.subs) {
	    // clean subscriptions to avoid reconnections
	    for (var i = 0; i < this.subs.length; i++) {
	      this.subs[i].destroy();
	    }
	    this.subs = null;
	  }

	  this.io.destroy(this);
	};

	/**
	 * Disconnects the socket manually.
	 *
	 * @return {Socket} self
	 * @api public
	 */

	Socket.prototype.close =
	Socket.prototype.disconnect = function () {
	  if (this.connected) {
	    debug('performing disconnect (%s)', this.nsp);
	    this.packet({ type: parser.DISCONNECT });
	  }

	  // remove socket from pool
	  this.destroy();

	  if (this.connected) {
	    // fire events
	    this.onclose('io client disconnect');
	  }
	  return this;
	};

	/**
	 * Sets the compress flag.
	 *
	 * @param {Boolean} if `true`, compresses the sending data
	 * @return {Socket} self
	 * @api public
	 */

	Socket.prototype.compress = function (compress) {
	  this.flags = this.flags || {};
	  this.flags.compress = compress;
	  return this;
	};


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * Module dependencies.
	 */

	var debug = __webpack_require__(12)('socket.io-parser');
	var json = __webpack_require__(15);
	var Emitter = __webpack_require__(18);
	var binary = __webpack_require__(19);
	var isBuf = __webpack_require__(21);

	/**
	 * Protocol version.
	 *
	 * @api public
	 */

	exports.protocol = 4;

	/**
	 * Packet types.
	 *
	 * @api public
	 */

	exports.types = [
	  'CONNECT',
	  'DISCONNECT',
	  'EVENT',
	  'ACK',
	  'ERROR',
	  'BINARY_EVENT',
	  'BINARY_ACK'
	];

	/**
	 * Packet type `connect`.
	 *
	 * @api public
	 */

	exports.CONNECT = 0;

	/**
	 * Packet type `disconnect`.
	 *
	 * @api public
	 */

	exports.DISCONNECT = 1;

	/**
	 * Packet type `event`.
	 *
	 * @api public
	 */

	exports.EVENT = 2;

	/**
	 * Packet type `ack`.
	 *
	 * @api public
	 */

	exports.ACK = 3;

	/**
	 * Packet type `error`.
	 *
	 * @api public
	 */

	exports.ERROR = 4;

	/**
	 * Packet type 'binary event'
	 *
	 * @api public
	 */

	exports.BINARY_EVENT = 5;

	/**
	 * Packet type `binary ack`. For acks with binary arguments.
	 *
	 * @api public
	 */

	exports.BINARY_ACK = 6;

	/**
	 * Encoder constructor.
	 *
	 * @api public
	 */

	exports.Encoder = Encoder;

	/**
	 * Decoder constructor.
	 *
	 * @api public
	 */

	exports.Decoder = Decoder;

	/**
	 * A socket.io Encoder instance
	 *
	 * @api public
	 */

	function Encoder() {}

	/**
	 * Encode a packet as a single string if non-binary, or as a
	 * buffer sequence, depending on packet type.
	 *
	 * @param {Object} obj - packet object
	 * @param {Function} callback - function to handle encodings (likely engine.write)
	 * @return Calls callback with Array of encodings
	 * @api public
	 */

	Encoder.prototype.encode = function(obj, callback){
	  debug('encoding packet %j', obj);

	  if (exports.BINARY_EVENT == obj.type || exports.BINARY_ACK == obj.type) {
	    encodeAsBinary(obj, callback);
	  }
	  else {
	    var encoding = encodeAsString(obj);
	    callback([encoding]);
	  }
	};

	/**
	 * Encode packet as string.
	 *
	 * @param {Object} packet
	 * @return {String} encoded
	 * @api private
	 */

	function encodeAsString(obj) {
	  var str = '';
	  var nsp = false;

	  // first is type
	  str += obj.type;

	  // attachments if we have them
	  if (exports.BINARY_EVENT == obj.type || exports.BINARY_ACK == obj.type) {
	    str += obj.attachments;
	    str += '-';
	  }

	  // if we have a namespace other than `/`
	  // we append it followed by a comma `,`
	  if (obj.nsp && '/' != obj.nsp) {
	    nsp = true;
	    str += obj.nsp;
	  }

	  // immediately followed by the id
	  if (null != obj.id) {
	    if (nsp) {
	      str += ',';
	      nsp = false;
	    }
	    str += obj.id;
	  }

	  // json data
	  if (null != obj.data) {
	    if (nsp) str += ',';
	    str += json.stringify(obj.data);
	  }

	  debug('encoded %j as %s', obj, str);
	  return str;
	}

	/**
	 * Encode packet as 'buffer sequence' by removing blobs, and
	 * deconstructing packet into object with placeholders and
	 * a list of buffers.
	 *
	 * @param {Object} packet
	 * @return {Buffer} encoded
	 * @api private
	 */

	function encodeAsBinary(obj, callback) {

	  function writeEncoding(bloblessData) {
	    var deconstruction = binary.deconstructPacket(bloblessData);
	    var pack = encodeAsString(deconstruction.packet);
	    var buffers = deconstruction.buffers;

	    buffers.unshift(pack); // add packet info to beginning of data list
	    callback(buffers); // write all the buffers
	  }

	  binary.removeBlobs(obj, writeEncoding);
	}

	/**
	 * A socket.io Decoder instance
	 *
	 * @return {Object} decoder
	 * @api public
	 */

	function Decoder() {
	  this.reconstructor = null;
	}

	/**
	 * Mix in `Emitter` with Decoder.
	 */

	Emitter(Decoder.prototype);

	/**
	 * Decodes an ecoded packet string into packet JSON.
	 *
	 * @param {String} obj - encoded packet
	 * @return {Object} packet
	 * @api public
	 */

	Decoder.prototype.add = function(obj) {
	  var packet;
	  if ('string' == typeof obj) {
	    packet = decodeString(obj);
	    if (exports.BINARY_EVENT == packet.type || exports.BINARY_ACK == packet.type) { // binary packet's json
	      this.reconstructor = new BinaryReconstructor(packet);

	      // no attachments, labeled binary but no binary data to follow
	      if (this.reconstructor.reconPack.attachments === 0) {
	        this.emit('decoded', packet);
	      }
	    } else { // non-binary full packet
	      this.emit('decoded', packet);
	    }
	  }
	  else if (isBuf(obj) || obj.base64) { // raw binary data
	    if (!this.reconstructor) {
	      throw new Error('got binary data when not reconstructing a packet');
	    } else {
	      packet = this.reconstructor.takeBinaryData(obj);
	      if (packet) { // received final buffer
	        this.reconstructor = null;
	        this.emit('decoded', packet);
	      }
	    }
	  }
	  else {
	    throw new Error('Unknown type: ' + obj);
	  }
	};

	/**
	 * Decode a packet String (JSON data)
	 *
	 * @param {String} str
	 * @return {Object} packet
	 * @api private
	 */

	function decodeString(str) {
	  var p = {};
	  var i = 0;

	  // look up type
	  p.type = Number(str.charAt(0));
	  if (null == exports.types[p.type]) return error();

	  // look up attachments if type binary
	  if (exports.BINARY_EVENT == p.type || exports.BINARY_ACK == p.type) {
	    var buf = '';
	    while (str.charAt(++i) != '-') {
	      buf += str.charAt(i);
	      if (i == str.length) break;
	    }
	    if (buf != Number(buf) || str.charAt(i) != '-') {
	      throw new Error('Illegal attachments');
	    }
	    p.attachments = Number(buf);
	  }

	  // look up namespace (if any)
	  if ('/' == str.charAt(i + 1)) {
	    p.nsp = '';
	    while (++i) {
	      var c = str.charAt(i);
	      if (',' == c) break;
	      p.nsp += c;
	      if (i == str.length) break;
	    }
	  } else {
	    p.nsp = '/';
	  }

	  // look up id
	  var next = str.charAt(i + 1);
	  if ('' !== next && Number(next) == next) {
	    p.id = '';
	    while (++i) {
	      var c = str.charAt(i);
	      if (null == c || Number(c) != c) {
	        --i;
	        break;
	      }
	      p.id += str.charAt(i);
	      if (i == str.length) break;
	    }
	    p.id = Number(p.id);
	  }

	  // look up json data
	  if (str.charAt(++i)) {
	    p = tryParse(p, str.substr(i));
	  }

	  debug('decoded %s as %j', str, p);
	  return p;
	}

	function tryParse(p, str) {
	  try {
	    p.data = json.parse(str);
	  } catch(e){
	    return error();
	  }
	  return p; 
	};

	/**
	 * Deallocates a parser's resources
	 *
	 * @api public
	 */

	Decoder.prototype.destroy = function() {
	  if (this.reconstructor) {
	    this.reconstructor.finishedReconstruction();
	  }
	};

	/**
	 * A manager of a binary event's 'buffer sequence'. Should
	 * be constructed whenever a packet of type BINARY_EVENT is
	 * decoded.
	 *
	 * @param {Object} packet
	 * @return {BinaryReconstructor} initialized reconstructor
	 * @api private
	 */

	function BinaryReconstructor(packet) {
	  this.reconPack = packet;
	  this.buffers = [];
	}

	/**
	 * Method to be called when binary data received from connection
	 * after a BINARY_EVENT packet.
	 *
	 * @param {Buffer | ArrayBuffer} binData - the raw binary data received
	 * @return {null | Object} returns null if more binary data is expected or
	 *   a reconstructed packet object if all buffers have been received.
	 * @api private
	 */

	BinaryReconstructor.prototype.takeBinaryData = function(binData) {
	  this.buffers.push(binData);
	  if (this.buffers.length == this.reconPack.attachments) { // done with buffer list
	    var packet = binary.reconstructPacket(this.reconPack, this.buffers);
	    this.finishedReconstruction();
	    return packet;
	  }
	  return null;
	};

	/**
	 * Cleans up binary packet reconstruction variables.
	 *
	 * @api private
	 */

	BinaryReconstructor.prototype.finishedReconstruction = function() {
	  this.reconPack = null;
	  this.buffers = [];
	};

	function error(data){
	  return {
	    type: exports.ERROR,
	    data: 'parser error'
	  };
	}


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * This is the web browser implementation of `debug()`.
	 *
	 * Expose `debug()` as the module.
	 */

	exports = module.exports = __webpack_require__(13);
	exports.log = log;
	exports.formatArgs = formatArgs;
	exports.save = save;
	exports.load = load;
	exports.useColors = useColors;
	exports.storage = 'undefined' != typeof chrome
	               && 'undefined' != typeof chrome.storage
	                  ? chrome.storage.local
	                  : localstorage();

	/**
	 * Colors.
	 */

	exports.colors = [
	  'lightseagreen',
	  'forestgreen',
	  'goldenrod',
	  'dodgerblue',
	  'darkorchid',
	  'crimson'
	];

	/**
	 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
	 * and the Firebug extension (any Firefox version) are known
	 * to support "%c" CSS customizations.
	 *
	 * TODO: add a `localStorage` variable to explicitly enable/disable colors
	 */

	function useColors() {
	  // is webkit? http://stackoverflow.com/a/16459606/376773
	  return ('WebkitAppearance' in document.documentElement.style) ||
	    // is firebug? http://stackoverflow.com/a/398120/376773
	    (window.console && (console.firebug || (console.exception && console.table))) ||
	    // is firefox >= v31?
	    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
	    (navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31);
	}

	/**
	 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
	 */

	exports.formatters.j = function(v) {
	  return JSON.stringify(v);
	};


	/**
	 * Colorize log arguments if enabled.
	 *
	 * @api public
	 */

	function formatArgs() {
	  var args = arguments;
	  var useColors = this.useColors;

	  args[0] = (useColors ? '%c' : '')
	    + this.namespace
	    + (useColors ? ' %c' : ' ')
	    + args[0]
	    + (useColors ? '%c ' : ' ')
	    + '+' + exports.humanize(this.diff);

	  if (!useColors) return args;

	  var c = 'color: ' + this.color;
	  args = [args[0], c, 'color: inherit'].concat(Array.prototype.slice.call(args, 1));

	  // the final "%c" is somewhat tricky, because there could be other
	  // arguments passed either before or after the %c, so we need to
	  // figure out the correct index to insert the CSS into
	  var index = 0;
	  var lastC = 0;
	  args[0].replace(/%[a-z%]/g, function(match) {
	    if ('%%' === match) return;
	    index++;
	    if ('%c' === match) {
	      // we only are interested in the *last* %c
	      // (the user may have provided their own)
	      lastC = index;
	    }
	  });

	  args.splice(lastC, 0, c);
	  return args;
	}

	/**
	 * Invokes `console.log()` when available.
	 * No-op when `console.log` is not a "function".
	 *
	 * @api public
	 */

	function log() {
	  // this hackery is required for IE8/9, where
	  // the `console.log` function doesn't have 'apply'
	  return 'object' === typeof console
	    && console.log
	    && Function.prototype.apply.call(console.log, console, arguments);
	}

	/**
	 * Save `namespaces`.
	 *
	 * @param {String} namespaces
	 * @api private
	 */

	function save(namespaces) {
	  try {
	    if (null == namespaces) {
	      exports.storage.removeItem('debug');
	    } else {
	      exports.storage.debug = namespaces;
	    }
	  } catch(e) {}
	}

	/**
	 * Load `namespaces`.
	 *
	 * @return {String} returns the previously persisted debug modes
	 * @api private
	 */

	function load() {
	  var r;
	  try {
	    r = exports.storage.debug;
	  } catch(e) {}
	  return r;
	}

	/**
	 * Enable namespaces listed in `localStorage.debug` initially.
	 */

	exports.enable(load());

	/**
	 * Localstorage attempts to return the localstorage.
	 *
	 * This is necessary because safari throws
	 * when a user disables cookies/localstorage
	 * and you attempt to access it.
	 *
	 * @return {LocalStorage}
	 * @api private
	 */

	function localstorage(){
	  try {
	    return window.localStorage;
	  } catch (e) {}
	}


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * This is the common logic for both the Node.js and web browser
	 * implementations of `debug()`.
	 *
	 * Expose `debug()` as the module.
	 */

	exports = module.exports = debug;
	exports.coerce = coerce;
	exports.disable = disable;
	exports.enable = enable;
	exports.enabled = enabled;
	exports.humanize = __webpack_require__(14);

	/**
	 * The currently active debug mode names, and names to skip.
	 */

	exports.names = [];
	exports.skips = [];

	/**
	 * Map of special "%n" handling functions, for the debug "format" argument.
	 *
	 * Valid key names are a single, lowercased letter, i.e. "n".
	 */

	exports.formatters = {};

	/**
	 * Previously assigned color.
	 */

	var prevColor = 0;

	/**
	 * Previous log timestamp.
	 */

	var prevTime;

	/**
	 * Select a color.
	 *
	 * @return {Number}
	 * @api private
	 */

	function selectColor() {
	  return exports.colors[prevColor++ % exports.colors.length];
	}

	/**
	 * Create a debugger with the given `namespace`.
	 *
	 * @param {String} namespace
	 * @return {Function}
	 * @api public
	 */

	function debug(namespace) {

	  // define the `disabled` version
	  function disabled() {
	  }
	  disabled.enabled = false;

	  // define the `enabled` version
	  function enabled() {

	    var self = enabled;

	    // set `diff` timestamp
	    var curr = +new Date();
	    var ms = curr - (prevTime || curr);
	    self.diff = ms;
	    self.prev = prevTime;
	    self.curr = curr;
	    prevTime = curr;

	    // add the `color` if not set
	    if (null == self.useColors) self.useColors = exports.useColors();
	    if (null == self.color && self.useColors) self.color = selectColor();

	    var args = Array.prototype.slice.call(arguments);

	    args[0] = exports.coerce(args[0]);

	    if ('string' !== typeof args[0]) {
	      // anything else let's inspect with %o
	      args = ['%o'].concat(args);
	    }

	    // apply any `formatters` transformations
	    var index = 0;
	    args[0] = args[0].replace(/%([a-z%])/g, function(match, format) {
	      // if we encounter an escaped % then don't increase the array index
	      if (match === '%%') return match;
	      index++;
	      var formatter = exports.formatters[format];
	      if ('function' === typeof formatter) {
	        var val = args[index];
	        match = formatter.call(self, val);

	        // now we need to remove `args[index]` since it's inlined in the `format`
	        args.splice(index, 1);
	        index--;
	      }
	      return match;
	    });

	    if ('function' === typeof exports.formatArgs) {
	      args = exports.formatArgs.apply(self, args);
	    }
	    var logFn = enabled.log || exports.log || console.log.bind(console);
	    logFn.apply(self, args);
	  }
	  enabled.enabled = true;

	  var fn = exports.enabled(namespace) ? enabled : disabled;

	  fn.namespace = namespace;

	  return fn;
	}

	/**
	 * Enables a debug mode by namespaces. This can include modes
	 * separated by a colon and wildcards.
	 *
	 * @param {String} namespaces
	 * @api public
	 */

	function enable(namespaces) {
	  exports.save(namespaces);

	  var split = (namespaces || '').split(/[\s,]+/);
	  var len = split.length;

	  for (var i = 0; i < len; i++) {
	    if (!split[i]) continue; // ignore empty strings
	    namespaces = split[i].replace(/\*/g, '.*?');
	    if (namespaces[0] === '-') {
	      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
	    } else {
	      exports.names.push(new RegExp('^' + namespaces + '$'));
	    }
	  }
	}

	/**
	 * Disable debug output.
	 *
	 * @api public
	 */

	function disable() {
	  exports.enable('');
	}

	/**
	 * Returns true if the given mode name is enabled, false otherwise.
	 *
	 * @param {String} name
	 * @return {Boolean}
	 * @api public
	 */

	function enabled(name) {
	  var i, len;
	  for (i = 0, len = exports.skips.length; i < len; i++) {
	    if (exports.skips[i].test(name)) {
	      return false;
	    }
	  }
	  for (i = 0, len = exports.names.length; i < len; i++) {
	    if (exports.names[i].test(name)) {
	      return true;
	    }
	  }
	  return false;
	}

	/**
	 * Coerce `val`.
	 *
	 * @param {Mixed} val
	 * @return {Mixed}
	 * @api private
	 */

	function coerce(val) {
	  if (val instanceof Error) return val.stack || val.message;
	  return val;
	}


/***/ },
/* 14 */
/***/ function(module, exports) {

	/**
	 * Helpers.
	 */

	var s = 1000;
	var m = s * 60;
	var h = m * 60;
	var d = h * 24;
	var y = d * 365.25;

	/**
	 * Parse or format the given `val`.
	 *
	 * Options:
	 *
	 *  - `long` verbose formatting [false]
	 *
	 * @param {String|Number} val
	 * @param {Object} options
	 * @return {String|Number}
	 * @api public
	 */

	module.exports = function(val, options){
	  options = options || {};
	  if ('string' == typeof val) return parse(val);
	  return options.long
	    ? long(val)
	    : short(val);
	};

	/**
	 * Parse the given `str` and return milliseconds.
	 *
	 * @param {String} str
	 * @return {Number}
	 * @api private
	 */

	function parse(str) {
	  str = '' + str;
	  if (str.length > 10000) return;
	  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(str);
	  if (!match) return;
	  var n = parseFloat(match[1]);
	  var type = (match[2] || 'ms').toLowerCase();
	  switch (type) {
	    case 'years':
	    case 'year':
	    case 'yrs':
	    case 'yr':
	    case 'y':
	      return n * y;
	    case 'days':
	    case 'day':
	    case 'd':
	      return n * d;
	    case 'hours':
	    case 'hour':
	    case 'hrs':
	    case 'hr':
	    case 'h':
	      return n * h;
	    case 'minutes':
	    case 'minute':
	    case 'mins':
	    case 'min':
	    case 'm':
	      return n * m;
	    case 'seconds':
	    case 'second':
	    case 'secs':
	    case 'sec':
	    case 's':
	      return n * s;
	    case 'milliseconds':
	    case 'millisecond':
	    case 'msecs':
	    case 'msec':
	    case 'ms':
	      return n;
	  }
	}

	/**
	 * Short format for `ms`.
	 *
	 * @param {Number} ms
	 * @return {String}
	 * @api private
	 */

	function short(ms) {
	  if (ms >= d) return Math.round(ms / d) + 'd';
	  if (ms >= h) return Math.round(ms / h) + 'h';
	  if (ms >= m) return Math.round(ms / m) + 'm';
	  if (ms >= s) return Math.round(ms / s) + 's';
	  return ms + 'ms';
	}

	/**
	 * Long format for `ms`.
	 *
	 * @param {Number} ms
	 * @return {String}
	 * @api private
	 */

	function long(ms) {
	  return plural(ms, d, 'day')
	    || plural(ms, h, 'hour')
	    || plural(ms, m, 'minute')
	    || plural(ms, s, 'second')
	    || ms + ' ms';
	}

	/**
	 * Pluralization helper.
	 */

	function plural(ms, n, name) {
	  if (ms < n) return;
	  if (ms < n * 1.5) return Math.floor(ms / n) + ' ' + name;
	  return Math.ceil(ms / n) + ' ' + name + 's';
	}


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module, global) {/*! JSON v3.3.2 | http://bestiejs.github.io/json3 | Copyright 2012-2014, Kit Cambridge | http://kit.mit-license.org */
	;(function () {
	  // Detect the `define` function exposed by asynchronous module loaders. The
	  // strict `define` check is necessary for compatibility with `r.js`.
	  var isLoader = "function" === "function" && __webpack_require__(17);

	  // A set of types used to distinguish objects from primitives.
	  var objectTypes = {
	    "function": true,
	    "object": true
	  };

	  // Detect the `exports` object exposed by CommonJS implementations.
	  var freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports;

	  // Use the `global` object exposed by Node (including Browserify via
	  // `insert-module-globals`), Narwhal, and Ringo as the default context,
	  // and the `window` object in browsers. Rhino exports a `global` function
	  // instead.
	  var root = objectTypes[typeof window] && window || this,
	      freeGlobal = freeExports && objectTypes[typeof module] && module && !module.nodeType && typeof global == "object" && global;

	  if (freeGlobal && (freeGlobal["global"] === freeGlobal || freeGlobal["window"] === freeGlobal || freeGlobal["self"] === freeGlobal)) {
	    root = freeGlobal;
	  }

	  // Public: Initializes JSON 3 using the given `context` object, attaching the
	  // `stringify` and `parse` functions to the specified `exports` object.
	  function runInContext(context, exports) {
	    context || (context = root["Object"]());
	    exports || (exports = root["Object"]());

	    // Native constructor aliases.
	    var Number = context["Number"] || root["Number"],
	        String = context["String"] || root["String"],
	        Object = context["Object"] || root["Object"],
	        Date = context["Date"] || root["Date"],
	        SyntaxError = context["SyntaxError"] || root["SyntaxError"],
	        TypeError = context["TypeError"] || root["TypeError"],
	        Math = context["Math"] || root["Math"],
	        nativeJSON = context["JSON"] || root["JSON"];

	    // Delegate to the native `stringify` and `parse` implementations.
	    if (typeof nativeJSON == "object" && nativeJSON) {
	      exports.stringify = nativeJSON.stringify;
	      exports.parse = nativeJSON.parse;
	    }

	    // Convenience aliases.
	    var objectProto = Object.prototype,
	        getClass = objectProto.toString,
	        isProperty, forEach, undef;

	    // Test the `Date#getUTC*` methods. Based on work by @Yaffle.
	    var isExtended = new Date(-3509827334573292);
	    try {
	      // The `getUTCFullYear`, `Month`, and `Date` methods return nonsensical
	      // results for certain dates in Opera >= 10.53.
	      isExtended = isExtended.getUTCFullYear() == -109252 && isExtended.getUTCMonth() === 0 && isExtended.getUTCDate() === 1 &&
	        // Safari < 2.0.2 stores the internal millisecond time value correctly,
	        // but clips the values returned by the date methods to the range of
	        // signed 32-bit integers ([-2 ** 31, 2 ** 31 - 1]).
	        isExtended.getUTCHours() == 10 && isExtended.getUTCMinutes() == 37 && isExtended.getUTCSeconds() == 6 && isExtended.getUTCMilliseconds() == 708;
	    } catch (exception) {}

	    // Internal: Determines whether the native `JSON.stringify` and `parse`
	    // implementations are spec-compliant. Based on work by Ken Snyder.
	    function has(name) {
	      if (has[name] !== undef) {
	        // Return cached feature test result.
	        return has[name];
	      }
	      var isSupported;
	      if (name == "bug-string-char-index") {
	        // IE <= 7 doesn't support accessing string characters using square
	        // bracket notation. IE 8 only supports this for primitives.
	        isSupported = "a"[0] != "a";
	      } else if (name == "json") {
	        // Indicates whether both `JSON.stringify` and `JSON.parse` are
	        // supported.
	        isSupported = has("json-stringify") && has("json-parse");
	      } else {
	        var value, serialized = '{"a":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}';
	        // Test `JSON.stringify`.
	        if (name == "json-stringify") {
	          var stringify = exports.stringify, stringifySupported = typeof stringify == "function" && isExtended;
	          if (stringifySupported) {
	            // A test function object with a custom `toJSON` method.
	            (value = function () {
	              return 1;
	            }).toJSON = value;
	            try {
	              stringifySupported =
	                // Firefox 3.1b1 and b2 serialize string, number, and boolean
	                // primitives as object literals.
	                stringify(0) === "0" &&
	                // FF 3.1b1, b2, and JSON 2 serialize wrapped primitives as object
	                // literals.
	                stringify(new Number()) === "0" &&
	                stringify(new String()) == '""' &&
	                // FF 3.1b1, 2 throw an error if the value is `null`, `undefined`, or
	                // does not define a canonical JSON representation (this applies to
	                // objects with `toJSON` properties as well, *unless* they are nested
	                // within an object or array).
	                stringify(getClass) === undef &&
	                // IE 8 serializes `undefined` as `"undefined"`. Safari <= 5.1.7 and
	                // FF 3.1b3 pass this test.
	                stringify(undef) === undef &&
	                // Safari <= 5.1.7 and FF 3.1b3 throw `Error`s and `TypeError`s,
	                // respectively, if the value is omitted entirely.
	                stringify() === undef &&
	                // FF 3.1b1, 2 throw an error if the given value is not a number,
	                // string, array, object, Boolean, or `null` literal. This applies to
	                // objects with custom `toJSON` methods as well, unless they are nested
	                // inside object or array literals. YUI 3.0.0b1 ignores custom `toJSON`
	                // methods entirely.
	                stringify(value) === "1" &&
	                stringify([value]) == "[1]" &&
	                // Prototype <= 1.6.1 serializes `[undefined]` as `"[]"` instead of
	                // `"[null]"`.
	                stringify([undef]) == "[null]" &&
	                // YUI 3.0.0b1 fails to serialize `null` literals.
	                stringify(null) == "null" &&
	                // FF 3.1b1, 2 halts serialization if an array contains a function:
	                // `[1, true, getClass, 1]` serializes as "[1,true,],". FF 3.1b3
	                // elides non-JSON values from objects and arrays, unless they
	                // define custom `toJSON` methods.
	                stringify([undef, getClass, null]) == "[null,null,null]" &&
	                // Simple serialization test. FF 3.1b1 uses Unicode escape sequences
	                // where character escape codes are expected (e.g., `\b` => `\u0008`).
	                stringify({ "a": [value, true, false, null, "\x00\b\n\f\r\t"] }) == serialized &&
	                // FF 3.1b1 and b2 ignore the `filter` and `width` arguments.
	                stringify(null, value) === "1" &&
	                stringify([1, 2], null, 1) == "[\n 1,\n 2\n]" &&
	                // JSON 2, Prototype <= 1.7, and older WebKit builds incorrectly
	                // serialize extended years.
	                stringify(new Date(-8.64e15)) == '"-271821-04-20T00:00:00.000Z"' &&
	                // The milliseconds are optional in ES 5, but required in 5.1.
	                stringify(new Date(8.64e15)) == '"+275760-09-13T00:00:00.000Z"' &&
	                // Firefox <= 11.0 incorrectly serializes years prior to 0 as negative
	                // four-digit years instead of six-digit years. Credits: @Yaffle.
	                stringify(new Date(-621987552e5)) == '"-000001-01-01T00:00:00.000Z"' &&
	                // Safari <= 5.1.5 and Opera >= 10.53 incorrectly serialize millisecond
	                // values less than 1000. Credits: @Yaffle.
	                stringify(new Date(-1)) == '"1969-12-31T23:59:59.999Z"';
	            } catch (exception) {
	              stringifySupported = false;
	            }
	          }
	          isSupported = stringifySupported;
	        }
	        // Test `JSON.parse`.
	        if (name == "json-parse") {
	          var parse = exports.parse;
	          if (typeof parse == "function") {
	            try {
	              // FF 3.1b1, b2 will throw an exception if a bare literal is provided.
	              // Conforming implementations should also coerce the initial argument to
	              // a string prior to parsing.
	              if (parse("0") === 0 && !parse(false)) {
	                // Simple parsing test.
	                value = parse(serialized);
	                var parseSupported = value["a"].length == 5 && value["a"][0] === 1;
	                if (parseSupported) {
	                  try {
	                    // Safari <= 5.1.2 and FF 3.1b1 allow unescaped tabs in strings.
	                    parseSupported = !parse('"\t"');
	                  } catch (exception) {}
	                  if (parseSupported) {
	                    try {
	                      // FF 4.0 and 4.0.1 allow leading `+` signs and leading
	                      // decimal points. FF 4.0, 4.0.1, and IE 9-10 also allow
	                      // certain octal literals.
	                      parseSupported = parse("01") !== 1;
	                    } catch (exception) {}
	                  }
	                  if (parseSupported) {
	                    try {
	                      // FF 4.0, 4.0.1, and Rhino 1.7R3-R4 allow trailing decimal
	                      // points. These environments, along with FF 3.1b1 and 2,
	                      // also allow trailing commas in JSON objects and arrays.
	                      parseSupported = parse("1.") !== 1;
	                    } catch (exception) {}
	                  }
	                }
	              }
	            } catch (exception) {
	              parseSupported = false;
	            }
	          }
	          isSupported = parseSupported;
	        }
	      }
	      return has[name] = !!isSupported;
	    }

	    if (!has("json")) {
	      // Common `[[Class]]` name aliases.
	      var functionClass = "[object Function]",
	          dateClass = "[object Date]",
	          numberClass = "[object Number]",
	          stringClass = "[object String]",
	          arrayClass = "[object Array]",
	          booleanClass = "[object Boolean]";

	      // Detect incomplete support for accessing string characters by index.
	      var charIndexBuggy = has("bug-string-char-index");

	      // Define additional utility methods if the `Date` methods are buggy.
	      if (!isExtended) {
	        var floor = Math.floor;
	        // A mapping between the months of the year and the number of days between
	        // January 1st and the first of the respective month.
	        var Months = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
	        // Internal: Calculates the number of days between the Unix epoch and the
	        // first day of the given month.
	        var getDay = function (year, month) {
	          return Months[month] + 365 * (year - 1970) + floor((year - 1969 + (month = +(month > 1))) / 4) - floor((year - 1901 + month) / 100) + floor((year - 1601 + month) / 400);
	        };
	      }

	      // Internal: Determines if a property is a direct property of the given
	      // object. Delegates to the native `Object#hasOwnProperty` method.
	      if (!(isProperty = objectProto.hasOwnProperty)) {
	        isProperty = function (property) {
	          var members = {}, constructor;
	          if ((members.__proto__ = null, members.__proto__ = {
	            // The *proto* property cannot be set multiple times in recent
	            // versions of Firefox and SeaMonkey.
	            "toString": 1
	          }, members).toString != getClass) {
	            // Safari <= 2.0.3 doesn't implement `Object#hasOwnProperty`, but
	            // supports the mutable *proto* property.
	            isProperty = function (property) {
	              // Capture and break the object's prototype chain (see section 8.6.2
	              // of the ES 5.1 spec). The parenthesized expression prevents an
	              // unsafe transformation by the Closure Compiler.
	              var original = this.__proto__, result = property in (this.__proto__ = null, this);
	              // Restore the original prototype chain.
	              this.__proto__ = original;
	              return result;
	            };
	          } else {
	            // Capture a reference to the top-level `Object` constructor.
	            constructor = members.constructor;
	            // Use the `constructor` property to simulate `Object#hasOwnProperty` in
	            // other environments.
	            isProperty = function (property) {
	              var parent = (this.constructor || constructor).prototype;
	              return property in this && !(property in parent && this[property] === parent[property]);
	            };
	          }
	          members = null;
	          return isProperty.call(this, property);
	        };
	      }

	      // Internal: Normalizes the `for...in` iteration algorithm across
	      // environments. Each enumerated key is yielded to a `callback` function.
	      forEach = function (object, callback) {
	        var size = 0, Properties, members, property;

	        // Tests for bugs in the current environment's `for...in` algorithm. The
	        // `valueOf` property inherits the non-enumerable flag from
	        // `Object.prototype` in older versions of IE, Netscape, and Mozilla.
	        (Properties = function () {
	          this.valueOf = 0;
	        }).prototype.valueOf = 0;

	        // Iterate over a new instance of the `Properties` class.
	        members = new Properties();
	        for (property in members) {
	          // Ignore all properties inherited from `Object.prototype`.
	          if (isProperty.call(members, property)) {
	            size++;
	          }
	        }
	        Properties = members = null;

	        // Normalize the iteration algorithm.
	        if (!size) {
	          // A list of non-enumerable properties inherited from `Object.prototype`.
	          members = ["valueOf", "toString", "toLocaleString", "propertyIsEnumerable", "isPrototypeOf", "hasOwnProperty", "constructor"];
	          // IE <= 8, Mozilla 1.0, and Netscape 6.2 ignore shadowed non-enumerable
	          // properties.
	          forEach = function (object, callback) {
	            var isFunction = getClass.call(object) == functionClass, property, length;
	            var hasProperty = !isFunction && typeof object.constructor != "function" && objectTypes[typeof object.hasOwnProperty] && object.hasOwnProperty || isProperty;
	            for (property in object) {
	              // Gecko <= 1.0 enumerates the `prototype` property of functions under
	              // certain conditions; IE does not.
	              if (!(isFunction && property == "prototype") && hasProperty.call(object, property)) {
	                callback(property);
	              }
	            }
	            // Manually invoke the callback for each non-enumerable property.
	            for (length = members.length; property = members[--length]; hasProperty.call(object, property) && callback(property));
	          };
	        } else if (size == 2) {
	          // Safari <= 2.0.4 enumerates shadowed properties twice.
	          forEach = function (object, callback) {
	            // Create a set of iterated properties.
	            var members = {}, isFunction = getClass.call(object) == functionClass, property;
	            for (property in object) {
	              // Store each property name to prevent double enumeration. The
	              // `prototype` property of functions is not enumerated due to cross-
	              // environment inconsistencies.
	              if (!(isFunction && property == "prototype") && !isProperty.call(members, property) && (members[property] = 1) && isProperty.call(object, property)) {
	                callback(property);
	              }
	            }
	          };
	        } else {
	          // No bugs detected; use the standard `for...in` algorithm.
	          forEach = function (object, callback) {
	            var isFunction = getClass.call(object) == functionClass, property, isConstructor;
	            for (property in object) {
	              if (!(isFunction && property == "prototype") && isProperty.call(object, property) && !(isConstructor = property === "constructor")) {
	                callback(property);
	              }
	            }
	            // Manually invoke the callback for the `constructor` property due to
	            // cross-environment inconsistencies.
	            if (isConstructor || isProperty.call(object, (property = "constructor"))) {
	              callback(property);
	            }
	          };
	        }
	        return forEach(object, callback);
	      };

	      // Public: Serializes a JavaScript `value` as a JSON string. The optional
	      // `filter` argument may specify either a function that alters how object and
	      // array members are serialized, or an array of strings and numbers that
	      // indicates which properties should be serialized. The optional `width`
	      // argument may be either a string or number that specifies the indentation
	      // level of the output.
	      if (!has("json-stringify")) {
	        // Internal: A map of control characters and their escaped equivalents.
	        var Escapes = {
	          92: "\\\\",
	          34: '\\"',
	          8: "\\b",
	          12: "\\f",
	          10: "\\n",
	          13: "\\r",
	          9: "\\t"
	        };

	        // Internal: Converts `value` into a zero-padded string such that its
	        // length is at least equal to `width`. The `width` must be <= 6.
	        var leadingZeroes = "000000";
	        var toPaddedString = function (width, value) {
	          // The `|| 0` expression is necessary to work around a bug in
	          // Opera <= 7.54u2 where `0 == -0`, but `String(-0) !== "0"`.
	          return (leadingZeroes + (value || 0)).slice(-width);
	        };

	        // Internal: Double-quotes a string `value`, replacing all ASCII control
	        // characters (characters with code unit values between 0 and 31) with
	        // their escaped equivalents. This is an implementation of the
	        // `Quote(value)` operation defined in ES 5.1 section 15.12.3.
	        var unicodePrefix = "\\u00";
	        var quote = function (value) {
	          var result = '"', index = 0, length = value.length, useCharIndex = !charIndexBuggy || length > 10;
	          var symbols = useCharIndex && (charIndexBuggy ? value.split("") : value);
	          for (; index < length; index++) {
	            var charCode = value.charCodeAt(index);
	            // If the character is a control character, append its Unicode or
	            // shorthand escape sequence; otherwise, append the character as-is.
	            switch (charCode) {
	              case 8: case 9: case 10: case 12: case 13: case 34: case 92:
	                result += Escapes[charCode];
	                break;
	              default:
	                if (charCode < 32) {
	                  result += unicodePrefix + toPaddedString(2, charCode.toString(16));
	                  break;
	                }
	                result += useCharIndex ? symbols[index] : value.charAt(index);
	            }
	          }
	          return result + '"';
	        };

	        // Internal: Recursively serializes an object. Implements the
	        // `Str(key, holder)`, `JO(value)`, and `JA(value)` operations.
	        var serialize = function (property, object, callback, properties, whitespace, indentation, stack) {
	          var value, className, year, month, date, time, hours, minutes, seconds, milliseconds, results, element, index, length, prefix, result;
	          try {
	            // Necessary for host object support.
	            value = object[property];
	          } catch (exception) {}
	          if (typeof value == "object" && value) {
	            className = getClass.call(value);
	            if (className == dateClass && !isProperty.call(value, "toJSON")) {
	              if (value > -1 / 0 && value < 1 / 0) {
	                // Dates are serialized according to the `Date#toJSON` method
	                // specified in ES 5.1 section 15.9.5.44. See section 15.9.1.15
	                // for the ISO 8601 date time string format.
	                if (getDay) {
	                  // Manually compute the year, month, date, hours, minutes,
	                  // seconds, and milliseconds if the `getUTC*` methods are
	                  // buggy. Adapted from @Yaffle's `date-shim` project.
	                  date = floor(value / 864e5);
	                  for (year = floor(date / 365.2425) + 1970 - 1; getDay(year + 1, 0) <= date; year++);
	                  for (month = floor((date - getDay(year, 0)) / 30.42); getDay(year, month + 1) <= date; month++);
	                  date = 1 + date - getDay(year, month);
	                  // The `time` value specifies the time within the day (see ES
	                  // 5.1 section 15.9.1.2). The formula `(A % B + B) % B` is used
	                  // to compute `A modulo B`, as the `%` operator does not
	                  // correspond to the `modulo` operation for negative numbers.
	                  time = (value % 864e5 + 864e5) % 864e5;
	                  // The hours, minutes, seconds, and milliseconds are obtained by
	                  // decomposing the time within the day. See section 15.9.1.10.
	                  hours = floor(time / 36e5) % 24;
	                  minutes = floor(time / 6e4) % 60;
	                  seconds = floor(time / 1e3) % 60;
	                  milliseconds = time % 1e3;
	                } else {
	                  year = value.getUTCFullYear();
	                  month = value.getUTCMonth();
	                  date = value.getUTCDate();
	                  hours = value.getUTCHours();
	                  minutes = value.getUTCMinutes();
	                  seconds = value.getUTCSeconds();
	                  milliseconds = value.getUTCMilliseconds();
	                }
	                // Serialize extended years correctly.
	                value = (year <= 0 || year >= 1e4 ? (year < 0 ? "-" : "+") + toPaddedString(6, year < 0 ? -year : year) : toPaddedString(4, year)) +
	                  "-" + toPaddedString(2, month + 1) + "-" + toPaddedString(2, date) +
	                  // Months, dates, hours, minutes, and seconds should have two
	                  // digits; milliseconds should have three.
	                  "T" + toPaddedString(2, hours) + ":" + toPaddedString(2, minutes) + ":" + toPaddedString(2, seconds) +
	                  // Milliseconds are optional in ES 5.0, but required in 5.1.
	                  "." + toPaddedString(3, milliseconds) + "Z";
	              } else {
	                value = null;
	              }
	            } else if (typeof value.toJSON == "function" && ((className != numberClass && className != stringClass && className != arrayClass) || isProperty.call(value, "toJSON"))) {
	              // Prototype <= 1.6.1 adds non-standard `toJSON` methods to the
	              // `Number`, `String`, `Date`, and `Array` prototypes. JSON 3
	              // ignores all `toJSON` methods on these objects unless they are
	              // defined directly on an instance.
	              value = value.toJSON(property);
	            }
	          }
	          if (callback) {
	            // If a replacement function was provided, call it to obtain the value
	            // for serialization.
	            value = callback.call(object, property, value);
	          }
	          if (value === null) {
	            return "null";
	          }
	          className = getClass.call(value);
	          if (className == booleanClass) {
	            // Booleans are represented literally.
	            return "" + value;
	          } else if (className == numberClass) {
	            // JSON numbers must be finite. `Infinity` and `NaN` are serialized as
	            // `"null"`.
	            return value > -1 / 0 && value < 1 / 0 ? "" + value : "null";
	          } else if (className == stringClass) {
	            // Strings are double-quoted and escaped.
	            return quote("" + value);
	          }
	          // Recursively serialize objects and arrays.
	          if (typeof value == "object") {
	            // Check for cyclic structures. This is a linear search; performance
	            // is inversely proportional to the number of unique nested objects.
	            for (length = stack.length; length--;) {
	              if (stack[length] === value) {
	                // Cyclic structures cannot be serialized by `JSON.stringify`.
	                throw TypeError();
	              }
	            }
	            // Add the object to the stack of traversed objects.
	            stack.push(value);
	            results = [];
	            // Save the current indentation level and indent one additional level.
	            prefix = indentation;
	            indentation += whitespace;
	            if (className == arrayClass) {
	              // Recursively serialize array elements.
	              for (index = 0, length = value.length; index < length; index++) {
	                element = serialize(index, value, callback, properties, whitespace, indentation, stack);
	                results.push(element === undef ? "null" : element);
	              }
	              result = results.length ? (whitespace ? "[\n" + indentation + results.join(",\n" + indentation) + "\n" + prefix + "]" : ("[" + results.join(",") + "]")) : "[]";
	            } else {
	              // Recursively serialize object members. Members are selected from
	              // either a user-specified list of property names, or the object
	              // itself.
	              forEach(properties || value, function (property) {
	                var element = serialize(property, value, callback, properties, whitespace, indentation, stack);
	                if (element !== undef) {
	                  // According to ES 5.1 section 15.12.3: "If `gap` {whitespace}
	                  // is not the empty string, let `member` {quote(property) + ":"}
	                  // be the concatenation of `member` and the `space` character."
	                  // The "`space` character" refers to the literal space
	                  // character, not the `space` {width} argument provided to
	                  // `JSON.stringify`.
	                  results.push(quote(property) + ":" + (whitespace ? " " : "") + element);
	                }
	              });
	              result = results.length ? (whitespace ? "{\n" + indentation + results.join(",\n" + indentation) + "\n" + prefix + "}" : ("{" + results.join(",") + "}")) : "{}";
	            }
	            // Remove the object from the traversed object stack.
	            stack.pop();
	            return result;
	          }
	        };

	        // Public: `JSON.stringify`. See ES 5.1 section 15.12.3.
	        exports.stringify = function (source, filter, width) {
	          var whitespace, callback, properties, className;
	          if (objectTypes[typeof filter] && filter) {
	            if ((className = getClass.call(filter)) == functionClass) {
	              callback = filter;
	            } else if (className == arrayClass) {
	              // Convert the property names array into a makeshift set.
	              properties = {};
	              for (var index = 0, length = filter.length, value; index < length; value = filter[index++], ((className = getClass.call(value)), className == stringClass || className == numberClass) && (properties[value] = 1));
	            }
	          }
	          if (width) {
	            if ((className = getClass.call(width)) == numberClass) {
	              // Convert the `width` to an integer and create a string containing
	              // `width` number of space characters.
	              if ((width -= width % 1) > 0) {
	                for (whitespace = "", width > 10 && (width = 10); whitespace.length < width; whitespace += " ");
	              }
	            } else if (className == stringClass) {
	              whitespace = width.length <= 10 ? width : width.slice(0, 10);
	            }
	          }
	          // Opera <= 7.54u2 discards the values associated with empty string keys
	          // (`""`) only if they are used directly within an object member list
	          // (e.g., `!("" in { "": 1})`).
	          return serialize("", (value = {}, value[""] = source, value), callback, properties, whitespace, "", []);
	        };
	      }

	      // Public: Parses a JSON source string.
	      if (!has("json-parse")) {
	        var fromCharCode = String.fromCharCode;

	        // Internal: A map of escaped control characters and their unescaped
	        // equivalents.
	        var Unescapes = {
	          92: "\\",
	          34: '"',
	          47: "/",
	          98: "\b",
	          116: "\t",
	          110: "\n",
	          102: "\f",
	          114: "\r"
	        };

	        // Internal: Stores the parser state.
	        var Index, Source;

	        // Internal: Resets the parser state and throws a `SyntaxError`.
	        var abort = function () {
	          Index = Source = null;
	          throw SyntaxError();
	        };

	        // Internal: Returns the next token, or `"$"` if the parser has reached
	        // the end of the source string. A token may be a string, number, `null`
	        // literal, or Boolean literal.
	        var lex = function () {
	          var source = Source, length = source.length, value, begin, position, isSigned, charCode;
	          while (Index < length) {
	            charCode = source.charCodeAt(Index);
	            switch (charCode) {
	              case 9: case 10: case 13: case 32:
	                // Skip whitespace tokens, including tabs, carriage returns, line
	                // feeds, and space characters.
	                Index++;
	                break;
	              case 123: case 125: case 91: case 93: case 58: case 44:
	                // Parse a punctuator token (`{`, `}`, `[`, `]`, `:`, or `,`) at
	                // the current position.
	                value = charIndexBuggy ? source.charAt(Index) : source[Index];
	                Index++;
	                return value;
	              case 34:
	                // `"` delimits a JSON string; advance to the next character and
	                // begin parsing the string. String tokens are prefixed with the
	                // sentinel `@` character to distinguish them from punctuators and
	                // end-of-string tokens.
	                for (value = "@", Index++; Index < length;) {
	                  charCode = source.charCodeAt(Index);
	                  if (charCode < 32) {
	                    // Unescaped ASCII control characters (those with a code unit
	                    // less than the space character) are not permitted.
	                    abort();
	                  } else if (charCode == 92) {
	                    // A reverse solidus (`\`) marks the beginning of an escaped
	                    // control character (including `"`, `\`, and `/`) or Unicode
	                    // escape sequence.
	                    charCode = source.charCodeAt(++Index);
	                    switch (charCode) {
	                      case 92: case 34: case 47: case 98: case 116: case 110: case 102: case 114:
	                        // Revive escaped control characters.
	                        value += Unescapes[charCode];
	                        Index++;
	                        break;
	                      case 117:
	                        // `\u` marks the beginning of a Unicode escape sequence.
	                        // Advance to the first character and validate the
	                        // four-digit code point.
	                        begin = ++Index;
	                        for (position = Index + 4; Index < position; Index++) {
	                          charCode = source.charCodeAt(Index);
	                          // A valid sequence comprises four hexdigits (case-
	                          // insensitive) that form a single hexadecimal value.
	                          if (!(charCode >= 48 && charCode <= 57 || charCode >= 97 && charCode <= 102 || charCode >= 65 && charCode <= 70)) {
	                            // Invalid Unicode escape sequence.
	                            abort();
	                          }
	                        }
	                        // Revive the escaped character.
	                        value += fromCharCode("0x" + source.slice(begin, Index));
	                        break;
	                      default:
	                        // Invalid escape sequence.
	                        abort();
	                    }
	                  } else {
	                    if (charCode == 34) {
	                      // An unescaped double-quote character marks the end of the
	                      // string.
	                      break;
	                    }
	                    charCode = source.charCodeAt(Index);
	                    begin = Index;
	                    // Optimize for the common case where a string is valid.
	                    while (charCode >= 32 && charCode != 92 && charCode != 34) {
	                      charCode = source.charCodeAt(++Index);
	                    }
	                    // Append the string as-is.
	                    value += source.slice(begin, Index);
	                  }
	                }
	                if (source.charCodeAt(Index) == 34) {
	                  // Advance to the next character and return the revived string.
	                  Index++;
	                  return value;
	                }
	                // Unterminated string.
	                abort();
	              default:
	                // Parse numbers and literals.
	                begin = Index;
	                // Advance past the negative sign, if one is specified.
	                if (charCode == 45) {
	                  isSigned = true;
	                  charCode = source.charCodeAt(++Index);
	                }
	                // Parse an integer or floating-point value.
	                if (charCode >= 48 && charCode <= 57) {
	                  // Leading zeroes are interpreted as octal literals.
	                  if (charCode == 48 && ((charCode = source.charCodeAt(Index + 1)), charCode >= 48 && charCode <= 57)) {
	                    // Illegal octal literal.
	                    abort();
	                  }
	                  isSigned = false;
	                  // Parse the integer component.
	                  for (; Index < length && ((charCode = source.charCodeAt(Index)), charCode >= 48 && charCode <= 57); Index++);
	                  // Floats cannot contain a leading decimal point; however, this
	                  // case is already accounted for by the parser.
	                  if (source.charCodeAt(Index) == 46) {
	                    position = ++Index;
	                    // Parse the decimal component.
	                    for (; position < length && ((charCode = source.charCodeAt(position)), charCode >= 48 && charCode <= 57); position++);
	                    if (position == Index) {
	                      // Illegal trailing decimal.
	                      abort();
	                    }
	                    Index = position;
	                  }
	                  // Parse exponents. The `e` denoting the exponent is
	                  // case-insensitive.
	                  charCode = source.charCodeAt(Index);
	                  if (charCode == 101 || charCode == 69) {
	                    charCode = source.charCodeAt(++Index);
	                    // Skip past the sign following the exponent, if one is
	                    // specified.
	                    if (charCode == 43 || charCode == 45) {
	                      Index++;
	                    }
	                    // Parse the exponential component.
	                    for (position = Index; position < length && ((charCode = source.charCodeAt(position)), charCode >= 48 && charCode <= 57); position++);
	                    if (position == Index) {
	                      // Illegal empty exponent.
	                      abort();
	                    }
	                    Index = position;
	                  }
	                  // Coerce the parsed value to a JavaScript number.
	                  return +source.slice(begin, Index);
	                }
	                // A negative sign may only precede numbers.
	                if (isSigned) {
	                  abort();
	                }
	                // `true`, `false`, and `null` literals.
	                if (source.slice(Index, Index + 4) == "true") {
	                  Index += 4;
	                  return true;
	                } else if (source.slice(Index, Index + 5) == "false") {
	                  Index += 5;
	                  return false;
	                } else if (source.slice(Index, Index + 4) == "null") {
	                  Index += 4;
	                  return null;
	                }
	                // Unrecognized token.
	                abort();
	            }
	          }
	          // Return the sentinel `$` character if the parser has reached the end
	          // of the source string.
	          return "$";
	        };

	        // Internal: Parses a JSON `value` token.
	        var get = function (value) {
	          var results, hasMembers;
	          if (value == "$") {
	            // Unexpected end of input.
	            abort();
	          }
	          if (typeof value == "string") {
	            if ((charIndexBuggy ? value.charAt(0) : value[0]) == "@") {
	              // Remove the sentinel `@` character.
	              return value.slice(1);
	            }
	            // Parse object and array literals.
	            if (value == "[") {
	              // Parses a JSON array, returning a new JavaScript array.
	              results = [];
	              for (;; hasMembers || (hasMembers = true)) {
	                value = lex();
	                // A closing square bracket marks the end of the array literal.
	                if (value == "]") {
	                  break;
	                }
	                // If the array literal contains elements, the current token
	                // should be a comma separating the previous element from the
	                // next.
	                if (hasMembers) {
	                  if (value == ",") {
	                    value = lex();
	                    if (value == "]") {
	                      // Unexpected trailing `,` in array literal.
	                      abort();
	                    }
	                  } else {
	                    // A `,` must separate each array element.
	                    abort();
	                  }
	                }
	                // Elisions and leading commas are not permitted.
	                if (value == ",") {
	                  abort();
	                }
	                results.push(get(value));
	              }
	              return results;
	            } else if (value == "{") {
	              // Parses a JSON object, returning a new JavaScript object.
	              results = {};
	              for (;; hasMembers || (hasMembers = true)) {
	                value = lex();
	                // A closing curly brace marks the end of the object literal.
	                if (value == "}") {
	                  break;
	                }
	                // If the object literal contains members, the current token
	                // should be a comma separator.
	                if (hasMembers) {
	                  if (value == ",") {
	                    value = lex();
	                    if (value == "}") {
	                      // Unexpected trailing `,` in object literal.
	                      abort();
	                    }
	                  } else {
	                    // A `,` must separate each object member.
	                    abort();
	                  }
	                }
	                // Leading commas are not permitted, object property names must be
	                // double-quoted strings, and a `:` must separate each property
	                // name and value.
	                if (value == "," || typeof value != "string" || (charIndexBuggy ? value.charAt(0) : value[0]) != "@" || lex() != ":") {
	                  abort();
	                }
	                results[value.slice(1)] = get(lex());
	              }
	              return results;
	            }
	            // Unexpected token encountered.
	            abort();
	          }
	          return value;
	        };

	        // Internal: Updates a traversed object member.
	        var update = function (source, property, callback) {
	          var element = walk(source, property, callback);
	          if (element === undef) {
	            delete source[property];
	          } else {
	            source[property] = element;
	          }
	        };

	        // Internal: Recursively traverses a parsed JSON object, invoking the
	        // `callback` function for each value. This is an implementation of the
	        // `Walk(holder, name)` operation defined in ES 5.1 section 15.12.2.
	        var walk = function (source, property, callback) {
	          var value = source[property], length;
	          if (typeof value == "object" && value) {
	            // `forEach` can't be used to traverse an array in Opera <= 8.54
	            // because its `Object#hasOwnProperty` implementation returns `false`
	            // for array indices (e.g., `![1, 2, 3].hasOwnProperty("0")`).
	            if (getClass.call(value) == arrayClass) {
	              for (length = value.length; length--;) {
	                update(value, length, callback);
	              }
	            } else {
	              forEach(value, function (property) {
	                update(value, property, callback);
	              });
	            }
	          }
	          return callback.call(source, property, value);
	        };

	        // Public: `JSON.parse`. See ES 5.1 section 15.12.2.
	        exports.parse = function (source, callback) {
	          var result, value;
	          Index = 0;
	          Source = "" + source;
	          result = get(lex());
	          // If a JSON string contains multiple tokens, it is invalid.
	          if (lex() != "$") {
	            abort();
	          }
	          // Reset the parser state.
	          Index = Source = null;
	          return callback && getClass.call(callback) == functionClass ? walk((value = {}, value[""] = result, value), "", callback) : result;
	        };
	      }
	    }

	    exports["runInContext"] = runInContext;
	    return exports;
	  }

	  if (freeExports && !isLoader) {
	    // Export for CommonJS environments.
	    runInContext(root, freeExports);
	  } else {
	    // Export for web browsers and JavaScript engines.
	    var nativeJSON = root.JSON,
	        previousJSON = root["JSON3"],
	        isRestored = false;

	    var JSON3 = runInContext(root, (root["JSON3"] = {
	      // Public: Restores the original value of the global `JSON` object and
	      // returns a reference to the `JSON3` object.
	      "noConflict": function () {
	        if (!isRestored) {
	          isRestored = true;
	          root.JSON = nativeJSON;
	          root["JSON3"] = previousJSON;
	          nativeJSON = previousJSON = null;
	        }
	        return JSON3;
	      }
	    }));

	    root.JSON = {
	      "parse": JSON3.parse,
	      "stringify": JSON3.stringify
	    };
	  }

	  // Export for asynchronous module loaders.
	  if (isLoader) {
	    !(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
	      return JSON3;
	    }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  }
	}).call(this);

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(16)(module), (function() { return this; }())))

/***/ },
/* 16 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 17 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(__webpack_amd_options__) {module.exports = __webpack_amd_options__;

	/* WEBPACK VAR INJECTION */}.call(exports, {}))

/***/ },
/* 18 */
/***/ function(module, exports) {

	
	/**
	 * Expose `Emitter`.
	 */

	module.exports = Emitter;

	/**
	 * Initialize a new `Emitter`.
	 *
	 * @api public
	 */

	function Emitter(obj) {
	  if (obj) return mixin(obj);
	};

	/**
	 * Mixin the emitter properties.
	 *
	 * @param {Object} obj
	 * @return {Object}
	 * @api private
	 */

	function mixin(obj) {
	  for (var key in Emitter.prototype) {
	    obj[key] = Emitter.prototype[key];
	  }
	  return obj;
	}

	/**
	 * Listen on the given `event` with `fn`.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */

	Emitter.prototype.on =
	Emitter.prototype.addEventListener = function(event, fn){
	  this._callbacks = this._callbacks || {};
	  (this._callbacks[event] = this._callbacks[event] || [])
	    .push(fn);
	  return this;
	};

	/**
	 * Adds an `event` listener that will be invoked a single
	 * time then automatically removed.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */

	Emitter.prototype.once = function(event, fn){
	  var self = this;
	  this._callbacks = this._callbacks || {};

	  function on() {
	    self.off(event, on);
	    fn.apply(this, arguments);
	  }

	  on.fn = fn;
	  this.on(event, on);
	  return this;
	};

	/**
	 * Remove the given callback for `event` or all
	 * registered callbacks.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */

	Emitter.prototype.off =
	Emitter.prototype.removeListener =
	Emitter.prototype.removeAllListeners =
	Emitter.prototype.removeEventListener = function(event, fn){
	  this._callbacks = this._callbacks || {};

	  // all
	  if (0 == arguments.length) {
	    this._callbacks = {};
	    return this;
	  }

	  // specific event
	  var callbacks = this._callbacks[event];
	  if (!callbacks) return this;

	  // remove all handlers
	  if (1 == arguments.length) {
	    delete this._callbacks[event];
	    return this;
	  }

	  // remove specific handler
	  var cb;
	  for (var i = 0; i < callbacks.length; i++) {
	    cb = callbacks[i];
	    if (cb === fn || cb.fn === fn) {
	      callbacks.splice(i, 1);
	      break;
	    }
	  }
	  return this;
	};

	/**
	 * Emit `event` with the given args.
	 *
	 * @param {String} event
	 * @param {Mixed} ...
	 * @return {Emitter}
	 */

	Emitter.prototype.emit = function(event){
	  this._callbacks = this._callbacks || {};
	  var args = [].slice.call(arguments, 1)
	    , callbacks = this._callbacks[event];

	  if (callbacks) {
	    callbacks = callbacks.slice(0);
	    for (var i = 0, len = callbacks.length; i < len; ++i) {
	      callbacks[i].apply(this, args);
	    }
	  }

	  return this;
	};

	/**
	 * Return array of callbacks for `event`.
	 *
	 * @param {String} event
	 * @return {Array}
	 * @api public
	 */

	Emitter.prototype.listeners = function(event){
	  this._callbacks = this._callbacks || {};
	  return this._callbacks[event] || [];
	};

	/**
	 * Check if this emitter has `event` handlers.
	 *
	 * @param {String} event
	 * @return {Boolean}
	 * @api public
	 */

	Emitter.prototype.hasListeners = function(event){
	  return !! this.listeners(event).length;
	};


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {/*global Blob,File*/

	/**
	 * Module requirements
	 */

	var isArray = __webpack_require__(20);
	var isBuf = __webpack_require__(21);

	/**
	 * Replaces every Buffer | ArrayBuffer in packet with a numbered placeholder.
	 * Anything with blobs or files should be fed through removeBlobs before coming
	 * here.
	 *
	 * @param {Object} packet - socket.io event packet
	 * @return {Object} with deconstructed packet and list of buffers
	 * @api public
	 */

	exports.deconstructPacket = function(packet){
	  var buffers = [];
	  var packetData = packet.data;

	  function _deconstructPacket(data) {
	    if (!data) return data;

	    if (isBuf(data)) {
	      var placeholder = { _placeholder: true, num: buffers.length };
	      buffers.push(data);
	      return placeholder;
	    } else if (isArray(data)) {
	      var newData = new Array(data.length);
	      for (var i = 0; i < data.length; i++) {
	        newData[i] = _deconstructPacket(data[i]);
	      }
	      return newData;
	    } else if ('object' == typeof data && !(data instanceof Date)) {
	      var newData = {};
	      for (var key in data) {
	        newData[key] = _deconstructPacket(data[key]);
	      }
	      return newData;
	    }
	    return data;
	  }

	  var pack = packet;
	  pack.data = _deconstructPacket(packetData);
	  pack.attachments = buffers.length; // number of binary 'attachments'
	  return {packet: pack, buffers: buffers};
	};

	/**
	 * Reconstructs a binary packet from its placeholder packet and buffers
	 *
	 * @param {Object} packet - event packet with placeholders
	 * @param {Array} buffers - binary buffers to put in placeholder positions
	 * @return {Object} reconstructed packet
	 * @api public
	 */

	exports.reconstructPacket = function(packet, buffers) {
	  var curPlaceHolder = 0;

	  function _reconstructPacket(data) {
	    if (data && data._placeholder) {
	      var buf = buffers[data.num]; // appropriate buffer (should be natural order anyway)
	      return buf;
	    } else if (isArray(data)) {
	      for (var i = 0; i < data.length; i++) {
	        data[i] = _reconstructPacket(data[i]);
	      }
	      return data;
	    } else if (data && 'object' == typeof data) {
	      for (var key in data) {
	        data[key] = _reconstructPacket(data[key]);
	      }
	      return data;
	    }
	    return data;
	  }

	  packet.data = _reconstructPacket(packet.data);
	  packet.attachments = undefined; // no longer useful
	  return packet;
	};

	/**
	 * Asynchronously removes Blobs or Files from data via
	 * FileReader's readAsArrayBuffer method. Used before encoding
	 * data as msgpack. Calls callback with the blobless data.
	 *
	 * @param {Object} data
	 * @param {Function} callback
	 * @api private
	 */

	exports.removeBlobs = function(data, callback) {
	  function _removeBlobs(obj, curKey, containingObject) {
	    if (!obj) return obj;

	    // convert any blob
	    if ((global.Blob && obj instanceof Blob) ||
	        (global.File && obj instanceof File)) {
	      pendingBlobs++;

	      // async filereader
	      var fileReader = new FileReader();
	      fileReader.onload = function() { // this.result == arraybuffer
	        if (containingObject) {
	          containingObject[curKey] = this.result;
	        }
	        else {
	          bloblessData = this.result;
	        }

	        // if nothing pending its callback time
	        if(! --pendingBlobs) {
	          callback(bloblessData);
	        }
	      };

	      fileReader.readAsArrayBuffer(obj); // blob -> arraybuffer
	    } else if (isArray(obj)) { // handle array
	      for (var i = 0; i < obj.length; i++) {
	        _removeBlobs(obj[i], i, obj);
	      }
	    } else if (obj && 'object' == typeof obj && !isBuf(obj)) { // and object
	      for (var key in obj) {
	        _removeBlobs(obj[key], key, obj);
	      }
	    }
	  }

	  var pendingBlobs = 0;
	  var bloblessData = data;
	  _removeBlobs(bloblessData);
	  if (!pendingBlobs) {
	    callback(bloblessData);
	  }
	};

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 20 */
/***/ function(module, exports) {

	module.exports = Array.isArray || function (arr) {
	  return Object.prototype.toString.call(arr) == '[object Array]';
	};


/***/ },
/* 21 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {
	module.exports = isBuf;

	/**
	 * Returns true if obj is a buffer or an arraybuffer.
	 *
	 * @api private
	 */

	function isBuf(obj) {
	  return (global.Buffer && global.Buffer.isBuffer(obj)) ||
	         (global.ArrayBuffer && obj instanceof ArrayBuffer);
	}

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * Expose `Emitter`.
	 */

	if (true) {
	  module.exports = Emitter;
	}

	/**
	 * Initialize a new `Emitter`.
	 *
	 * @api public
	 */

	function Emitter(obj) {
	  if (obj) return mixin(obj);
	};

	/**
	 * Mixin the emitter properties.
	 *
	 * @param {Object} obj
	 * @return {Object}
	 * @api private
	 */

	function mixin(obj) {
	  for (var key in Emitter.prototype) {
	    obj[key] = Emitter.prototype[key];
	  }
	  return obj;
	}

	/**
	 * Listen on the given `event` with `fn`.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */

	Emitter.prototype.on =
	Emitter.prototype.addEventListener = function(event, fn){
	  this._callbacks = this._callbacks || {};
	  (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
	    .push(fn);
	  return this;
	};

	/**
	 * Adds an `event` listener that will be invoked a single
	 * time then automatically removed.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */

	Emitter.prototype.once = function(event, fn){
	  function on() {
	    this.off(event, on);
	    fn.apply(this, arguments);
	  }

	  on.fn = fn;
	  this.on(event, on);
	  return this;
	};

	/**
	 * Remove the given callback for `event` or all
	 * registered callbacks.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */

	Emitter.prototype.off =
	Emitter.prototype.removeListener =
	Emitter.prototype.removeAllListeners =
	Emitter.prototype.removeEventListener = function(event, fn){
	  this._callbacks = this._callbacks || {};

	  // all
	  if (0 == arguments.length) {
	    this._callbacks = {};
	    return this;
	  }

	  // specific event
	  var callbacks = this._callbacks['$' + event];
	  if (!callbacks) return this;

	  // remove all handlers
	  if (1 == arguments.length) {
	    delete this._callbacks['$' + event];
	    return this;
	  }

	  // remove specific handler
	  var cb;
	  for (var i = 0; i < callbacks.length; i++) {
	    cb = callbacks[i];
	    if (cb === fn || cb.fn === fn) {
	      callbacks.splice(i, 1);
	      break;
	    }
	  }
	  return this;
	};

	/**
	 * Emit `event` with the given args.
	 *
	 * @param {String} event
	 * @param {Mixed} ...
	 * @return {Emitter}
	 */

	Emitter.prototype.emit = function(event){
	  this._callbacks = this._callbacks || {};
	  var args = [].slice.call(arguments, 1)
	    , callbacks = this._callbacks['$' + event];

	  if (callbacks) {
	    callbacks = callbacks.slice(0);
	    for (var i = 0, len = callbacks.length; i < len; ++i) {
	      callbacks[i].apply(this, args);
	    }
	  }

	  return this;
	};

	/**
	 * Return array of callbacks for `event`.
	 *
	 * @param {String} event
	 * @return {Array}
	 * @api public
	 */

	Emitter.prototype.listeners = function(event){
	  this._callbacks = this._callbacks || {};
	  return this._callbacks['$' + event] || [];
	};

	/**
	 * Check if this emitter has `event` handlers.
	 *
	 * @param {String} event
	 * @return {Boolean}
	 * @api public
	 */

	Emitter.prototype.hasListeners = function(event){
	  return !! this.listeners(event).length;
	};


/***/ },
/* 23 */
/***/ function(module, exports) {

	module.exports = toArray

	function toArray(list, index) {
	    var array = []

	    index = index || 0

	    for (var i = index || 0; i < list.length; i++) {
	        array[i - index] = list[i]
	    }

	    return array
	}


/***/ },
/* 24 */
/***/ function(module, exports) {

	
	/**
	 * Module exports.
	 */

	module.exports = on;

	/**
	 * Helper for subscriptions.
	 *
	 * @param {Object|EventEmitter} obj with `Emitter` mixin or `EventEmitter`
	 * @param {String} event name
	 * @param {Function} callback
	 * @api public
	 */

	function on (obj, ev, fn) {
	  obj.on(ev, fn);
	  return {
	    destroy: function () {
	      obj.removeListener(ev, fn);
	    }
	  };
	}


/***/ },
/* 25 */
/***/ function(module, exports) {

	/**
	 * Slice reference.
	 */

	var slice = [].slice;

	/**
	 * Bind `obj` to `fn`.
	 *
	 * @param {Object} obj
	 * @param {Function|String} fn or string
	 * @return {Function}
	 * @api public
	 */

	module.exports = function(obj, fn){
	  if ('string' == typeof fn) fn = obj[fn];
	  if ('function' != typeof fn) throw new Error('bind() requires a function');
	  var args = slice.call(arguments, 2);
	  return function(){
	    return fn.apply(obj, args.concat(slice.call(arguments)));
	  }
	};


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {
	/**
	 * This is the web browser implementation of `debug()`.
	 *
	 * Expose `debug()` as the module.
	 */

	exports = module.exports = __webpack_require__(27);
	exports.log = log;
	exports.formatArgs = formatArgs;
	exports.save = save;
	exports.load = load;
	exports.useColors = useColors;
	exports.storage = 'undefined' != typeof chrome
	               && 'undefined' != typeof chrome.storage
	                  ? chrome.storage.local
	                  : localstorage();

	/**
	 * Colors.
	 */

	exports.colors = [
	  'lightseagreen',
	  'forestgreen',
	  'goldenrod',
	  'dodgerblue',
	  'darkorchid',
	  'crimson'
	];

	/**
	 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
	 * and the Firebug extension (any Firefox version) are known
	 * to support "%c" CSS customizations.
	 *
	 * TODO: add a `localStorage` variable to explicitly enable/disable colors
	 */

	function useColors() {
	  // is webkit? http://stackoverflow.com/a/16459606/376773
	  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
	  return (typeof document !== 'undefined' && 'WebkitAppearance' in document.documentElement.style) ||
	    // is firebug? http://stackoverflow.com/a/398120/376773
	    (window.console && (console.firebug || (console.exception && console.table))) ||
	    // is firefox >= v31?
	    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
	    (navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31);
	}

	/**
	 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
	 */

	exports.formatters.j = function(v) {
	  try {
	    return JSON.stringify(v);
	  } catch (err) {
	    return '[UnexpectedJSONParseError]: ' + err.message;
	  }
	};


	/**
	 * Colorize log arguments if enabled.
	 *
	 * @api public
	 */

	function formatArgs() {
	  var args = arguments;
	  var useColors = this.useColors;

	  args[0] = (useColors ? '%c' : '')
	    + this.namespace
	    + (useColors ? ' %c' : ' ')
	    + args[0]
	    + (useColors ? '%c ' : ' ')
	    + '+' + exports.humanize(this.diff);

	  if (!useColors) return args;

	  var c = 'color: ' + this.color;
	  args = [args[0], c, 'color: inherit'].concat(Array.prototype.slice.call(args, 1));

	  // the final "%c" is somewhat tricky, because there could be other
	  // arguments passed either before or after the %c, so we need to
	  // figure out the correct index to insert the CSS into
	  var index = 0;
	  var lastC = 0;
	  args[0].replace(/%[a-z%]/g, function(match) {
	    if ('%%' === match) return;
	    index++;
	    if ('%c' === match) {
	      // we only are interested in the *last* %c
	      // (the user may have provided their own)
	      lastC = index;
	    }
	  });

	  args.splice(lastC, 0, c);
	  return args;
	}

	/**
	 * Invokes `console.log()` when available.
	 * No-op when `console.log` is not a "function".
	 *
	 * @api public
	 */

	function log() {
	  // this hackery is required for IE8/9, where
	  // the `console.log` function doesn't have 'apply'
	  return 'object' === typeof console
	    && console.log
	    && Function.prototype.apply.call(console.log, console, arguments);
	}

	/**
	 * Save `namespaces`.
	 *
	 * @param {String} namespaces
	 * @api private
	 */

	function save(namespaces) {
	  try {
	    if (null == namespaces) {
	      exports.storage.removeItem('debug');
	    } else {
	      exports.storage.debug = namespaces;
	    }
	  } catch(e) {}
	}

	/**
	 * Load `namespaces`.
	 *
	 * @return {String} returns the previously persisted debug modes
	 * @api private
	 */

	function load() {
	  var r;
	  try {
	    return exports.storage.debug;
	  } catch(e) {}

	  // If debug isn't set in LS, and we're in Electron, try to load $DEBUG
	  if (typeof process !== 'undefined' && 'env' in process) {
	    return process.env.DEBUG;
	  }
	}

	/**
	 * Enable namespaces listed in `localStorage.debug` initially.
	 */

	exports.enable(load());

	/**
	 * Localstorage attempts to return the localstorage.
	 *
	 * This is necessary because safari throws
	 * when a user disables cookies/localstorage
	 * and you attempt to access it.
	 *
	 * @return {LocalStorage}
	 * @api private
	 */

	function localstorage(){
	  try {
	    return window.localStorage;
	  } catch (e) {}
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * This is the common logic for both the Node.js and web browser
	 * implementations of `debug()`.
	 *
	 * Expose `debug()` as the module.
	 */

	exports = module.exports = debug.debug = debug;
	exports.coerce = coerce;
	exports.disable = disable;
	exports.enable = enable;
	exports.enabled = enabled;
	exports.humanize = __webpack_require__(28);

	/**
	 * The currently active debug mode names, and names to skip.
	 */

	exports.names = [];
	exports.skips = [];

	/**
	 * Map of special "%n" handling functions, for the debug "format" argument.
	 *
	 * Valid key names are a single, lowercased letter, i.e. "n".
	 */

	exports.formatters = {};

	/**
	 * Previously assigned color.
	 */

	var prevColor = 0;

	/**
	 * Previous log timestamp.
	 */

	var prevTime;

	/**
	 * Select a color.
	 *
	 * @return {Number}
	 * @api private
	 */

	function selectColor() {
	  return exports.colors[prevColor++ % exports.colors.length];
	}

	/**
	 * Create a debugger with the given `namespace`.
	 *
	 * @param {String} namespace
	 * @return {Function}
	 * @api public
	 */

	function debug(namespace) {

	  // define the `disabled` version
	  function disabled() {
	  }
	  disabled.enabled = false;

	  // define the `enabled` version
	  function enabled() {

	    var self = enabled;

	    // set `diff` timestamp
	    var curr = +new Date();
	    var ms = curr - (prevTime || curr);
	    self.diff = ms;
	    self.prev = prevTime;
	    self.curr = curr;
	    prevTime = curr;

	    // add the `color` if not set
	    if (null == self.useColors) self.useColors = exports.useColors();
	    if (null == self.color && self.useColors) self.color = selectColor();

	    var args = new Array(arguments.length);
	    for (var i = 0; i < args.length; i++) {
	      args[i] = arguments[i];
	    }

	    args[0] = exports.coerce(args[0]);

	    if ('string' !== typeof args[0]) {
	      // anything else let's inspect with %o
	      args = ['%o'].concat(args);
	    }

	    // apply any `formatters` transformations
	    var index = 0;
	    args[0] = args[0].replace(/%([a-z%])/g, function(match, format) {
	      // if we encounter an escaped % then don't increase the array index
	      if (match === '%%') return match;
	      index++;
	      var formatter = exports.formatters[format];
	      if ('function' === typeof formatter) {
	        var val = args[index];
	        match = formatter.call(self, val);

	        // now we need to remove `args[index]` since it's inlined in the `format`
	        args.splice(index, 1);
	        index--;
	      }
	      return match;
	    });

	    // apply env-specific formatting
	    args = exports.formatArgs.apply(self, args);

	    var logFn = enabled.log || exports.log || console.log.bind(console);
	    logFn.apply(self, args);
	  }
	  enabled.enabled = true;

	  var fn = exports.enabled(namespace) ? enabled : disabled;

	  fn.namespace = namespace;

	  return fn;
	}

	/**
	 * Enables a debug mode by namespaces. This can include modes
	 * separated by a colon and wildcards.
	 *
	 * @param {String} namespaces
	 * @api public
	 */

	function enable(namespaces) {
	  exports.save(namespaces);

	  var split = (namespaces || '').split(/[\s,]+/);
	  var len = split.length;

	  for (var i = 0; i < len; i++) {
	    if (!split[i]) continue; // ignore empty strings
	    namespaces = split[i].replace(/[\\^$+?.()|[\]{}]/g, '\\$&').replace(/\*/g, '.*?');
	    if (namespaces[0] === '-') {
	      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
	    } else {
	      exports.names.push(new RegExp('^' + namespaces + '$'));
	    }
	  }
	}

	/**
	 * Disable debug output.
	 *
	 * @api public
	 */

	function disable() {
	  exports.enable('');
	}

	/**
	 * Returns true if the given mode name is enabled, false otherwise.
	 *
	 * @param {String} name
	 * @return {Boolean}
	 * @api public
	 */

	function enabled(name) {
	  var i, len;
	  for (i = 0, len = exports.skips.length; i < len; i++) {
	    if (exports.skips[i].test(name)) {
	      return false;
	    }
	  }
	  for (i = 0, len = exports.names.length; i < len; i++) {
	    if (exports.names[i].test(name)) {
	      return true;
	    }
	  }
	  return false;
	}

	/**
	 * Coerce `val`.
	 *
	 * @param {Mixed} val
	 * @return {Mixed}
	 * @api private
	 */

	function coerce(val) {
	  if (val instanceof Error) return val.stack || val.message;
	  return val;
	}


/***/ },
/* 28 */
/***/ function(module, exports) {

	/**
	 * Helpers.
	 */

	var s = 1000
	var m = s * 60
	var h = m * 60
	var d = h * 24
	var y = d * 365.25

	/**
	 * Parse or format the given `val`.
	 *
	 * Options:
	 *
	 *  - `long` verbose formatting [false]
	 *
	 * @param {String|Number} val
	 * @param {Object} options
	 * @throws {Error} throw an error if val is not a non-empty string or a number
	 * @return {String|Number}
	 * @api public
	 */

	module.exports = function (val, options) {
	  options = options || {}
	  var type = typeof val
	  if (type === 'string' && val.length > 0) {
	    return parse(val)
	  } else if (type === 'number' && isNaN(val) === false) {
	    return options.long ?
				fmtLong(val) :
				fmtShort(val)
	  }
	  throw new Error('val is not a non-empty string or a valid number. val=' + JSON.stringify(val))
	}

	/**
	 * Parse the given `str` and return milliseconds.
	 *
	 * @param {String} str
	 * @return {Number}
	 * @api private
	 */

	function parse(str) {
	  str = String(str)
	  if (str.length > 10000) {
	    return
	  }
	  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(str)
	  if (!match) {
	    return
	  }
	  var n = parseFloat(match[1])
	  var type = (match[2] || 'ms').toLowerCase()
	  switch (type) {
	    case 'years':
	    case 'year':
	    case 'yrs':
	    case 'yr':
	    case 'y':
	      return n * y
	    case 'days':
	    case 'day':
	    case 'd':
	      return n * d
	    case 'hours':
	    case 'hour':
	    case 'hrs':
	    case 'hr':
	    case 'h':
	      return n * h
	    case 'minutes':
	    case 'minute':
	    case 'mins':
	    case 'min':
	    case 'm':
	      return n * m
	    case 'seconds':
	    case 'second':
	    case 'secs':
	    case 'sec':
	    case 's':
	      return n * s
	    case 'milliseconds':
	    case 'millisecond':
	    case 'msecs':
	    case 'msec':
	    case 'ms':
	      return n
	    default:
	      return undefined
	  }
	}

	/**
	 * Short format for `ms`.
	 *
	 * @param {Number} ms
	 * @return {String}
	 * @api private
	 */

	function fmtShort(ms) {
	  if (ms >= d) {
	    return Math.round(ms / d) + 'd'
	  }
	  if (ms >= h) {
	    return Math.round(ms / h) + 'h'
	  }
	  if (ms >= m) {
	    return Math.round(ms / m) + 'm'
	  }
	  if (ms >= s) {
	    return Math.round(ms / s) + 's'
	  }
	  return ms + 'ms'
	}

	/**
	 * Long format for `ms`.
	 *
	 * @param {Number} ms
	 * @return {String}
	 * @api private
	 */

	function fmtLong(ms) {
	  return plural(ms, d, 'day') ||
	    plural(ms, h, 'hour') ||
	    plural(ms, m, 'minute') ||
	    plural(ms, s, 'second') ||
	    ms + ' ms'
	}

	/**
	 * Pluralization helper.
	 */

	function plural(ms, n, name) {
	  if (ms < n) {
	    return
	  }
	  if (ms < n * 1.5) {
	    return Math.floor(ms / n) + ' ' + name
	  }
	  return Math.ceil(ms / n) + ' ' + name + 's'
	}


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {
	/*
	 * Module requirements.
	 */

	var isArray = __webpack_require__(20);

	/**
	 * Module exports.
	 */

	module.exports = hasBinary;

	/**
	 * Checks for binary data.
	 *
	 * Right now only Buffer and ArrayBuffer are supported..
	 *
	 * @param {Object} anything
	 * @api public
	 */

	function hasBinary(data) {

	  function _hasBinary(obj) {
	    if (!obj) return false;

	    if ( (global.Buffer && global.Buffer.isBuffer && global.Buffer.isBuffer(obj)) ||
	         (global.ArrayBuffer && obj instanceof ArrayBuffer) ||
	         (global.Blob && obj instanceof Blob) ||
	         (global.File && obj instanceof File)
	        ) {
	      return true;
	    }

	    if (isArray(obj)) {
	      for (var i = 0; i < obj.length; i++) {
	          if (_hasBinary(obj[i])) {
	              return true;
	          }
	      }
	    } else if (obj && 'object' == typeof obj) {
	      // see: https://github.com/Automattic/has-binary/pull/4
	      if (obj.toJSON && 'function' == typeof obj.toJSON) {
	        obj = obj.toJSON();
	      }

	      for (var key in obj) {
	        if (Object.prototype.hasOwnProperty.call(obj, key) && _hasBinary(obj[key])) {
	          return true;
	        }
	      }
	    }

	    return false;
	  }

	  return _hasBinary(data);
	}

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _CB = __webpack_require__(1);

	var _CB2 = _interopRequireDefault(_CB);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/*
	 Column.js
	 */
	var Column = function Column(columnName, dataType, required, unique) {
	    _classCallCheck(this, Column);

	    this.document = {};
	    if (columnName) {
	        _CB2.default._columnNameValidation(columnName);
	        this.document.name = columnName;
	        this.document._type = 'column';
	    }

	    if (dataType) {
	        _CB2.default._columnDataTypeValidation(dataType);
	        this.document.dataType = dataType;
	    } else {
	        this.document.dataType = "Text";
	    }

	    if (typeof required === 'boolean') {
	        this.document.required = required;
	    } else {
	        this.document.required = false;
	    }

	    if (typeof unique === 'boolean') {
	        this.document.unique = unique;
	    } else {
	        this.document.unique = false;
	    }

	    if (dataType === "Text") {
	        this.document.isSearchable = true;
	    }

	    this.document.relatedTo = null;
	    this.document.relationType = null;

	    this.document.isDeletable = true;
	    this.document.isEditable = true;
	    this.document.isRenamable = false;
	    this.document.editableByMasterKey = false;
	};

	Object.defineProperty(Column.prototype, 'name', {
	    get: function get() {
	        return this.document.name;
	    },
	    set: function set(name) {
	        this.document.name = name;
	    }
	});

	Object.defineProperty(Column.prototype, 'dataType', {
	    get: function get() {
	        return this.document.dataType;
	    },
	    set: function set(dataType) {
	        this.document.dataType = dataType;
	    }
	});

	Object.defineProperty(Column.prototype, 'unique', {
	    get: function get() {
	        return this.document.unique;
	    },
	    set: function set(unique) {
	        this.document.unique = unique;
	    }
	});

	Object.defineProperty(Column.prototype, 'relatedTo', {
	    get: function get() {
	        return this.document.relatedTo;
	    },
	    set: function set(relatedTo) {
	        this.document.relatedTo = relatedTo;
	    }
	});

	Object.defineProperty(Column.prototype, 'required', {
	    get: function get() {
	        return this.document.required;
	    },
	    set: function set(required) {
	        this.document.required = required;
	    }
	});

	Object.defineProperty(Column.prototype, 'editableByMasterKey', {
	    get: function get() {
	        return this.document.editableByMasterKey;
	    },
	    set: function set(editableByMasterKey) {
	        this.document.editableByMasterKey = editableByMasterKey;
	    }
	});

	Object.defineProperty(Column.prototype, 'isSearchable', {
	    get: function get() {
	        return this.document.isSearchable;
	    },
	    set: function set(isSearchable) {
	        this.document.isSearchable = isSearchable;
	    }
	});

	_CB2.default.Column = Column;

	exports.default = _CB2.default.Column;

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _CB = __webpack_require__(1);

	var _CB2 = _interopRequireDefault(_CB);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/*
	  CloudTable
	 */
	var CloudTable = function () {
	    function CloudTable(tableName) {
	        _classCallCheck(this, CloudTable);

	        _CB2.default._tableValidation(tableName);
	        this.document = {};
	        this.document.name = tableName;
	        this.document.appId = _CB2.default.appId;
	        this.document._type = 'table';

	        if (tableName.toLowerCase() === "user") {
	            this.document.type = "user";
	            this.document.maxCount = 1;
	        } else if (tableName.toLowerCase() === "role") {
	            this.document.type = "role";
	            this.document.maxCount = 1;
	        } else if (tableName.toLowerCase() === "device") {
	            this.document.type = "device";
	            this.document.maxCount = 1;
	        } else {
	            this.document.type = "custom";
	            this.document.maxCount = 9999;
	        }
	        this.document.columns = _CB2.default._defaultColumns(this.document.type);
	    }

	    _createClass(CloudTable, [{
	        key: 'addColumn',
	        value: function addColumn(column) {
	            if (Object.prototype.toString.call(column) === '[object String]') {
	                var obj = new _CB2.default.Column(column);
	                column = obj;
	            }
	            if (Object.prototype.toString.call(column) === '[object Object]') {
	                if (_CB2.default._columnValidation(column, this)) this.document.columns.push(column);
	            } else if (Object.prototype.toString.call(column) === '[object Array]') {
	                for (var i = 0; i < column.length; i++) {
	                    if (_CB2.default._columnValidation(column[i], this)) this.document.columns.push(column[i]);
	                }
	            }
	        }
	    }, {
	        key: 'getColumn',
	        value: function getColumn(columnName) {
	            if (Object.prototype.toString.call(columnName) !== '[object String]') {
	                throw "Should enter a columnName";
	            }
	            var columns = this.document.columns;
	            for (var i = 0; i < columns.length; i++) {
	                if (columns[i].name === columnName) return columns[i];
	            }
	            throw "Column Does Not Exists";
	        }
	    }, {
	        key: 'updateColumn',
	        value: function updateColumn(column) {
	            if (Object.prototype.toString.call(column) === '[object Object]') {
	                if (_CB2.default._columnValidation(column, this)) {
	                    var columns = this.document.columns;
	                    for (var i = 0; i < columns.length; i++) {
	                        if (columns[i].name === column.name) {
	                            columns[i] = column;
	                            this.document.columns = columns;
	                            break;
	                        }
	                    }
	                } else {
	                    throw "Invalid Column";
	                }
	            } else {
	                throw "Invalid Column";
	            }
	        }
	    }, {
	        key: 'deleteColumn',
	        value: function deleteColumn(column) {
	            if (Object.prototype.toString.call(column) === '[object String]') {
	                var obj = new _CB2.default.Column(column);
	                column = obj;
	            }
	            if (Object.prototype.toString.call(column) === '[object Object]') {
	                if (_CB2.default._columnValidation(column, this)) {
	                    var arr = [];
	                    for (var i = 0; i < this.columns.length; i++) {
	                        if (this.columns[i].name !== column.name) arr.push(this.columns[i]);
	                    }
	                    this.document.columns = arr;
	                }
	            } else if (Object.prototype.toString.call(column) === '[object Array]') {
	                var arr = [];
	                for (var i = 0; i < column.length; i++) {
	                    if (_CB2.default._columnValidation(column[i], this)) {
	                        for (var i = 0; i < this.columns.length; i++) {
	                            if (this.columns[i].name !== column[i].name) arr.push(this.columns[i]);
	                        }
	                        this.document.columns = arr;
	                    }
	                }
	            }
	        }
	    }, {
	        key: 'delete',

	        /**
	         * Deletes a table from database.
	         *
	         * @param table
	         * @param callback
	         * @returns {*}
	         */

	        value: function _delete(callback) {
	            _CB2.default._validate();

	            var def;
	            if (!callback) {
	                def = new _CB2.default.Promise();
	            }

	            var params = JSON.stringify({
	                key: _CB2.default.appKey,
	                name: this.name,
	                method: "DELETE"
	            });

	            var thisObj = this;

	            var url = _CB2.default.apiUrl + '/app/' + _CB2.default.appId + "/" + this.name;

	            _CB2.default._request('PUT', url, params, true).then(function (response) {
	                if (callback) {
	                    callback.success(thisObj);
	                } else {
	                    def.resolve(thisObj);
	                }
	            }, function (err) {
	                if (callback) {
	                    callback.error(err);
	                } else {
	                    def.reject(err);
	                }
	            });

	            if (!callback) {
	                return def.promise;
	            }
	        }

	        /**
	         * Saves a table
	         *
	         * @param callback
	         * @returns {*}
	         */

	    }, {
	        key: 'save',
	        value: function save(callback) {
	            var def;
	            if (!callback) {
	                def = new _CB2.default.Promise();
	            }
	            _CB2.default._validate();
	            var thisObj = this;
	            var params = JSON.stringify({
	                key: _CB2.default.appKey,
	                data: _CB2.default.toJSON(thisObj)
	            });

	            var thisObj = this;

	            var url = _CB2.default.apiUrl + '/app/' + _CB2.default.appId + "/" + thisObj.document.name;

	            _CB2.default._request('PUT', url, params, true).then(function (response) {
	                response = JSON.parse(response);
	                thisObj = _CB2.default.fromJSON(response);
	                if (callback) {
	                    callback.success(thisObj);
	                } else {
	                    def.resolve(thisObj);
	                }
	            }, function (err) {
	                if (callback) {
	                    callback.error(err);
	                } else {
	                    def.reject(err);
	                }
	            });

	            if (!callback) {
	                return def.promise;
	            }
	        }
	    }]);

	    return CloudTable;
	}();

	Object.defineProperty(CloudTable.prototype, 'columns', {
	    get: function get() {
	        return this.document.columns;
	    }
	});

	Object.defineProperty(CloudTable.prototype, 'name', {
	    get: function get() {
	        return this.document.name;
	    },
	    set: function set() {
	        throw "You can not rename a table";
	    }
	});

	Object.defineProperty(CloudTable.prototype, 'id', {
	    get: function get() {
	        return this.document._id;
	    }
	});

	_CB2.default.CloudTable = CloudTable;

	/**
	 * Gets All the Tables from an App
	 *
	 * @param callback
	 * @returns {*}
	 */

	_CB2.default.CloudTable.getAll = function (callback) {
	    if (!_CB2.default.appId) {
	        throw "CB.appId is null.";
	    }

	    var def;
	    if (!callback) {
	        def = new _CB2.default.Promise();
	    }

	    var params = JSON.stringify({
	        key: _CB2.default.appKey
	    });

	    var url = _CB2.default.apiUrl + '/app/' + _CB2.default.appId + "/_getAll";
	    _CB2.default._request('POST', url, params, true).then(function (response) {
	        response = JSON.parse(response);
	        var obj = _CB2.default.fromJSON(response);
	        if (callback) {
	            callback.success(obj);
	        } else {
	            def.resolve(obj);
	        }
	    }, function (err) {
	        if (callback) {
	            callback.error(err);
	        } else {
	            def.reject(err);
	        }
	    });
	    if (!callback) {
	        return def.promise;
	    }
	};

	/**
	 * Gets a table
	 *
	 * @param table
	 *  It is the CloudTable object
	 * @param callback
	 * @returns {*}
	 */

	_CB2.default.CloudTable.get = function (table, callback) {
	    if (Object.prototype.toString.call(table) === '[object String]') {
	        var obj = new this(table);
	        table = obj;
	    }
	    if (Object.prototype.toString.call(table) === '[object Object]') {
	        {
	            if (!_CB2.default.appId) {
	                throw "CB.appId is null.";
	            }

	            var def;
	            if (!callback) {
	                def = new _CB2.default.Promise();
	            }

	            var params = JSON.stringify({
	                key: _CB2.default.appKey,
	                appId: _CB2.default.appId
	            });

	            var url = _CB2.default.apiUrl + '/app/' + _CB2.default.appId + "/" + table.document.name;
	            _CB2.default._request('POST', url, params, true).then(function (response) {
	                if (response === "null" || response === "") {
	                    obj = null;
	                } else {
	                    response = JSON.parse(response);
	                    var obj = _CB2.default.fromJSON(response);
	                }
	                if (callback) {
	                    callback.success(obj);
	                } else {
	                    def.resolve(obj);
	                }
	            }, function (err) {
	                if (callback) {
	                    callback.error(err);
	                } else {
	                    def.reject(err);
	                }
	            });
	            if (!callback) {
	                return def.promise;
	            }
	        }
	    } else if (Object.prototype.toString.call(table) === '[object Array]') {
	        throw "cannot fetch array of tables";
	    }
	};

	exports.default = _CB2.default.CloudTable;

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _CB = __webpack_require__(1);

	var _CB2 = _interopRequireDefault(_CB);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	_CB2.default.ACL = function () {
	    //constructor for ACL class
	    this.document = {};
	    this.document['read'] = { "allow": { "user": ['all'], "role": [] }, "deny": { "user": [], "role": [] } }; //by default allow read access to "all"
	    this.document['write'] = { "allow": { "user": ['all'], "role": [] }, "deny": { "user": [], "role": [] } }; //by default allow write access to "all"
	    this.parent = null;
	};
	_CB2.default.ACL.prototype.setPublicWriteAccess = function (value) {
	    //for setting the public write access
	    if (value) {
	        //If asked to allow public write access
	        this.document['write']['allow']['user'] = ['all'];
	    } else {
	        var index = this.document['write']['allow']['user'].indexOf('all');
	        if (index > -1) {
	            this.document['write']['allow']['user'].splice(index, 1); //remove the "all" value from the "write" array of "this" object
	        }
	    }

	    if (this.parent) {
	        _CB2.default._modified(this.parent, 'ACL');
	    }
	};
	_CB2.default.ACL.prototype.setPublicReadAccess = function (value) {
	    //for setting the public read access

	    if (value) {
	        //If asked to allow public read access
	        this.document['read']['allow']['user'] = ['all'];
	    } else {
	        var index = this.document['read']['allow']['user'].indexOf('all');
	        if (index > -1) {
	            this.document['read']['allow']['user'].splice(index, 1); //remove the "all" value from the "read" array of "this" object
	        }
	    }

	    if (this.parent) {
	        _CB2.default._modified(this.parent, 'ACL');
	    }
	};
	_CB2.default.ACL.prototype.setUserWriteAccess = function (userId, value) {
	    //for setting the user write access

	    if (value) {
	        //If asked to allow user write access
	        //remove public write access.
	        var index = this.document['write']['allow']['user'].indexOf('all');
	        if (index > -1) {
	            this.document['write']['allow']['user'].splice(index, 1);
	        }
	        if (this.document['write']['allow']['user'].indexOf(userId) === -1) {
	            this.document['write']['allow']['user'].push(userId);
	        }
	    } else {
	        var index = this.document['write']['allow']['user'].indexOf(userId);
	        if (index > -1) {
	            this.document['write']['allow']['user'].splice(index, 1); //remove the "userId" value from the "write" array of "this" object
	        }
	        this.document['write']['deny']['user'].push(userId);
	    }

	    if (this.parent) {
	        _CB2.default._modified(this.parent, 'ACL');
	    }
	};
	_CB2.default.ACL.prototype.setUserReadAccess = function (userId, value) {
	    //for setting the user read access

	    if (value) {
	        //If asked to allow user read access
	        //remove public write access.
	        var index = this.document['read']['allow']['user'].indexOf('all');
	        if (index > -1) {
	            this.document['read']['allow']['user'].splice(index, 1);
	        }
	        if (this.document['read']['allow']['user'].indexOf(userId) === -1) {
	            this.document['read']['allow']['user'].push(userId);
	        }
	    } else {
	        var index = this.document['read']['allow']['user'].indexOf(userId);
	        if (index > -1) {
	            this.document['read']['allow']['user'].splice(index, 1); //remove the "userId" value from the "read" array of "this" object
	        }
	        this.document['read']['deny']['user'].push(userId);
	    }

	    if (this.parent) {
	        _CB2.default._modified(this.parent, 'ACL');
	    }
	};
	_CB2.default.ACL.prototype.setRoleWriteAccess = function (roleId, value) {

	    if (value) {
	        //remove public write access.
	        var index = this.document['write']['allow']['user'].indexOf('all');
	        if (index > -1) {
	            this.document['write']['allow']['user'].splice(index, 1);
	        }
	        if (this.document['write']['allow']['role'].indexOf(roleId) === -1) {
	            this.document['write']['allow']['role'].push(roleId);
	        }
	    } else {
	        var index = this.document['write']['allow']['role'].indexOf(roleId);
	        if (index > -1) {
	            this.document['write']['allow']['role'].splice(index, 1);
	        }
	        var index = this.document['write']['allow']['user'].indexOf('all');
	        if (index > -1) {
	            this.document['write']['allow']['user'].splice(index, 1);
	        }

	        this.document['write']['deny']['role'].push(roleId);
	    }

	    if (this.parent) {
	        _CB2.default._modified(this.parent, 'ACL');
	    }
	};
	_CB2.default.ACL.prototype.setRoleReadAccess = function (roleId, value) {

	    if (value) {
	        //remove public write access.
	        var index = this.document['read']['allow']['user'].indexOf('all');
	        if (index > -1) {
	            this.document['read']['allow']['user'].splice(index, 1);
	        }
	        if (this.document['read']['allow']['role'].indexOf(roleId) === -1) {
	            this.document['read']['allow']['role'].push(roleId);
	        }
	    } else {
	        var index = this.document['read']['allow']['role'].indexOf(roleId);
	        if (index > -1) {
	            this.document['read']['allow']['role'].splice(index, 1);
	        }
	        var index = this.document['read']['allow']['user'].indexOf('all');
	        if (index > -1) {
	            this.document['read']['allow']['user'].splice(index, 1);
	        }
	        this.document['read']['deny']['role'].push(roleId);
	    }

	    if (this.parent) {
	        _CB2.default._modified(this.parent, 'ACL');
	    }
	};

	exports.default = _CB2.default.ACL;

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _CB = __webpack_require__(1);

	var _CB2 = _interopRequireDefault(_CB);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/*
	 *CloudGeoPoint
	 */

	var CloudGeoPoint = function () {
	    function CloudGeoPoint(longitude, latitude) {
	        _classCallCheck(this, CloudGeoPoint);

	        if (!latitude && latitude !== 0 || !longitude && longitude !== 0) throw "Latitude or Longitude is empty.";

	        if (isNaN(latitude)) throw "Latitude " + latitude + " is not a number type.";

	        if (isNaN(longitude)) throw "Longitude " + longitude + " is not a number type.";

	        this.document = {};
	        this.document._type = "point";
	        this.document._isModified = true;
	        //The default datum for an earth-like sphere is WGS84. Coordinate-axis order is longitude, latitude.
	        if (Number(latitude) >= -90 && Number(latitude) <= 90 && Number(longitude) >= -180 && Number(longitude) <= 180) {
	            this.document.coordinates = [Number(longitude), Number(latitude)];
	            this.document.latitude = Number(latitude);
	            this.document.longitude = Number(longitude);
	        } else {
	            throw "latitude and longitudes are not in range";
	        }
	    }

	    _createClass(CloudGeoPoint, [{
	        key: "get",
	        value: function get(name) {
	            //for getting data of a particular column

	            return this.document[name];
	        }
	    }, {
	        key: "set",
	        value: function set(name, value) {
	            //for getting data of a particular column

	            if (name === 'latitude') {
	                if (Number(value) >= -90 && Number(value) <= 90) {
	                    this.document.latitude = Number(value);
	                    this.document.coordinates[1] = Number(value);
	                    this.document._isModified = true;
	                } else throw "Latitude is not in Range";
	            } else {
	                if (Number(value) >= -180 && Number(value) <= 180) {
	                    this.document.longitude = Number(value);
	                    this.document.coordinates[0] = Number(value);
	                    this.document._isModified = true;
	                } else throw "Latitude is not in Range";
	            }
	        }
	    }, {
	        key: "distanceInKMs",
	        value: function distanceInKMs(point) {

	            var earthRedius = 6371; //in Kilometer
	            return earthRedius * greatCircleFormula(this, point);
	        }
	    }, {
	        key: "distanceInMiles",
	        value: function distanceInMiles(point) {

	            var earthRedius = 3959; // in Miles
	            return earthRedius * greatCircleFormula(this, point);
	        }
	    }, {
	        key: "distanceInRadians",
	        value: function distanceInRadians(point) {

	            return greatCircleFormula(this, point);
	        }
	    }]);

	    return CloudGeoPoint;
	}();

	Object.defineProperty(CloudGeoPoint.prototype, 'latitude', {
	    get: function get() {
	        return this.document.coordinates[1];
	    },
	    set: function set(latitude) {
	        if (Number(latitude) >= -90 && Number(latitude) <= 90) {
	            this.document.latitude = Number(latitude);
	            this.document.coordinates[1] = Number(latitude);
	            this.document._isModified = true;
	        } else throw "Latitude is not in Range";
	    }
	});

	Object.defineProperty(CloudGeoPoint.prototype, 'longitude', {
	    get: function get() {
	        return this.document.coordinates[0];
	    },
	    set: function set(longitude) {
	        if (Number(longitude) >= -180 && Number(longitude) <= 180) {
	            this.document.longitude = Number(longitude);
	            this.document.coordinates[0] = Number(longitude);
	            this.document._isModified = true;
	        } else throw "Longitude is not in Range";
	    }
	});

	function greatCircleFormula(thisObj, point) {

	    var dLat = (thisObj.document.coordinates[1] - point.document.coordinates[1]).toRad();
	    var dLon = (thisObj.document.coordinates[0] - point.document.coordinates[0]).toRad();
	    var lat1 = point.document.coordinates[1].toRad();
	    var lat2 = thisObj.document.coordinates[1].toRad();
	    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
	    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	    return c;
	}

	if (typeof Number.prototype.toRad === "undefined") {
	    Number.prototype.toRad = function () {
	        return this * Math.PI / 180;
	    };
	}

	_CB2.default.CloudGeoPoint = _CB2.default.CloudGeoPoint || CloudGeoPoint;

	exports.default = _CB2.default.CloudGeoPoint;

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _CB = __webpack_require__(1);

	var _CB2 = _interopRequireDefault(_CB);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/*
	 CloudObject
	 */
	var CloudObject = function () {
	    function CloudObject(tableName, id) {
	        _classCallCheck(this, CloudObject);

	        //object for documents
	        this.document = {};
	        this.document._tableName = tableName; //the document object
	        this.document.ACL = new _CB2.default.ACL(); //ACL(s) of the document
	        this.document._type = 'custom';
	        this.document.expires = null;
	        this.document._hash = _CB2.default._generateHash();

	        if (!id) {
	            this.document._modifiedColumns = ['createdAt', 'updatedAt', 'ACL', 'expires'];
	            this.document._isModified = true;
	        } else {
	            this.document._modifiedColumns = [];
	            this.document._isModified = false;
	            this.document._id = id;
	        }
	    }

	    _createClass(CloudObject, [{
	        key: 'set',

	        /* RealTime implementation ends here.  */

	        value: function set(columnName, data) {
	            //for setting data for a particular column

	            var keywords = ['_tableName', '_type', 'operator'];

	            if (columnName === 'id' || columnName === '_id') throw "You cannot set the id of a CloudObject";

	            if (columnName === 'id') columnName = '_' + columnName;

	            if (keywords.indexOf(columnName) > -1) {
	                throw columnName + " is a keyword. Please choose a different column name.";
	            }
	            this.document[columnName] = data;
	            _CB2.default._modified(this, columnName);
	        }
	    }, {
	        key: 'relate',
	        value: function relate(columnName, objectTableName, objectId) {
	            //for setting data for a particular column

	            var keywords = ['_tableName', '_type', 'operator'];

	            if (columnName === 'id' || columnName === '_id') throw "You cannot set the id of a CloudObject";

	            if (columnName === 'id') throw "You cannot link an object to this column";

	            if (keywords.indexOf(columnName) > -1) {
	                throw columnName + " is a keyword. Please choose a different column name.";
	            }

	            this.document[columnName] = new _CB2.default.CloudObject(objectTableName, objectId);
	            _CB2.default._modified(this, columnName);
	        }
	    }, {
	        key: 'get',
	        value: function get(columnName) {
	            //for getting data of a particular column

	            if (columnName === 'id') columnName = '_' + columnName;

	            return this.document[columnName];
	        }
	    }, {
	        key: 'unset',
	        value: function unset(columnName) {
	            //to unset the data of the column
	            this.document[columnName] = null;
	            _CB2.default._modified(this, columnName);
	        }
	    }, {
	        key: 'save',


	        /**
	         * Saved CloudObject in Database.
	         * @param callback
	         * @returns {*}
	         */

	        value: function save(callback) {
	            //save the document to the db
	            var def;
	            _CB2.default._validate();

	            if (!callback) {
	                def = new _CB2.default.Promise();
	            }
	            var thisObj = this;
	            _CB2.default._fileCheck(this).then(function (thisObj) {

	                var xmlhttp = _CB2.default._loadXml();
	                var params = JSON.stringify({
	                    document: _CB2.default.toJSON(thisObj),
	                    key: _CB2.default.appKey
	                });
	                var url = _CB2.default.apiUrl + "/data/" + _CB2.default.appId + '/' + thisObj.document._tableName;
	                _CB2.default._request('PUT', url, params).then(function (response) {
	                    thisObj = _CB2.default.fromJSON(JSON.parse(response), thisObj);
	                    if (callback) {
	                        callback.success(thisObj);
	                    } else {
	                        def.resolve(thisObj);
	                    }
	                }, function (err) {
	                    if (callback) {
	                        callback.error(err);
	                    } else {
	                        def.reject(err);
	                    }
	                });
	            }, function (err) {
	                if (callback) {
	                    callback.error(err);
	                } else {
	                    def.reject(err);
	                }
	            });
	            if (!callback) {
	                return def.promise;
	            }
	        }
	    }, {
	        key: 'fetch',
	        value: function fetch(callback) {
	            //fetch the document from the db
	            if (!_CB2.default.appId) {
	                throw "CB.appId is null.";
	            }
	            if (!this.document._id) {
	                throw "Can't fetch an object which is not saved.";
	            }
	            var thisObj = this;
	            var def;
	            if (!callback) {
	                def = new _CB2.default.Promise();
	            }
	            var query = null;
	            if (thisObj.document._type === 'file') {
	                query = new _CB2.default.CloudQuery('_File');
	            } else {
	                query = new _CB2.default.CloudQuery(thisObj.document._tableName);
	            }
	            query.findById(thisObj.get('id')).then(function (res) {
	                if (!callback) {
	                    def.resolve(res);
	                } else {
	                    callback.success(res);
	                }
	            }, function (err) {
	                if (!callback) {
	                    def.reject(err);
	                } else {
	                    callback.error(err);
	                }
	            });

	            if (!callback) {
	                return def.promise;
	            }
	        }
	    }, {
	        key: 'delete',
	        value: function _delete(callback) {
	            //delete an object matching the objectId
	            if (!_CB2.default.appId) {
	                throw "CB.appId is null.";
	            }
	            if (!this.document._id) {
	                throw "You cannot delete an object which is not saved.";
	            }
	            var thisObj = this;
	            var def;
	            if (!callback) {
	                def = new _CB2.default.Promise();
	            }

	            var params = JSON.stringify({
	                key: _CB2.default.appKey,
	                document: _CB2.default.toJSON(thisObj),
	                method: "DELETE"
	            });

	            var url = _CB2.default.apiUrl + "/data/" + _CB2.default.appId + '/' + thisObj.document._tableName;

	            _CB2.default._request('PUT', url, params).then(function (response) {
	                thisObj = _CB2.default.fromJSON(JSON.parse(response), thisObj);
	                if (callback) {
	                    callback.success(thisObj);
	                } else {
	                    def.resolve(thisObj);
	                }
	            }, function (err) {
	                if (callback) {
	                    callback.error(err);
	                } else {
	                    def.reject(err);
	                }
	            });

	            if (!callback) {
	                return def.promise;
	            }
	        }
	    }]);

	    return CloudObject;
	}();

	Object.defineProperty(CloudObject.prototype, 'ACL', {
	    get: function get() {
	        return this.document.ACL;
	    },
	    set: function set(ACL) {
	        this.document.ACL = ACL;
	        this.document.ACL.parent = this;
	        _CB2.default._modified(this, 'ACL');
	    }
	});

	Object.defineProperty(CloudObject.prototype, 'id', {
	    get: function get() {
	        return this.document._id;
	    }
	});

	Object.defineProperty(CloudObject.prototype, 'createdAt', {
	    get: function get() {
	        return this.document.createdAt;
	    },
	    set: function set(createdAt) {
	        this.document.createdAt = createdAt;
	        _CB2.default._modified(this, 'createdAt');
	    }
	});

	Object.defineProperty(CloudObject.prototype, 'updatedAt', {
	    get: function get() {
	        return this.document.updatedAt;
	    },
	    set: function set(updatedAt) {
	        this.document.updatedAt = updatedAt;
	        _CB2.default._modified(this, 'updatedAt');
	    }
	});

	/* For Expire of objects */
	Object.defineProperty(CloudObject.prototype, 'expires', {
	    get: function get() {
	        return this.document.expires;
	    },
	    set: function set(expires) {
	        this.document.expires = expires;
	        _CB2.default._modified(this, 'expires');
	    }
	});

	/* This is Real time implementation of CloudObjects */
	CloudObject.on = function (tableName, eventType, cloudQuery, callback, done) {

	    if (_CB2.default._isRealtimeDisabled) {
	        throw "Realtime is disbaled for this app.";
	    }

	    var def;

	    //shift variables.
	    if (cloudQuery && !(cloudQuery instanceof _CB2.default.CloudQuery)) {
	        //this is a function.
	        if (callback !== null && (typeof callback === 'undefined' ? 'undefined' : _typeof(callback)) === 'object') {
	            //callback is actually done.
	            done = callback;
	            callback = null;
	        }
	        callback = cloudQuery;
	        cloudQuery = null;
	    }

	    if (!done) {
	        def = new _CB2.default.Promise();
	    }

	    //validate query.
	    if (cloudQuery && cloudQuery instanceof _CB2.default.CloudQuery) {

	        if (cloudQuery.tableName !== tableName) {
	            throw "CloudQuery TableName and CloudNotification TableName should be same.";
	        }

	        if (cloudQuery.query) {
	            if (cloudQuery.query.$include.length > 0) {
	                throw "Include with CloudNotificaitons is not supported right now.";
	            }
	        }

	        if (Object.keys(cloudQuery.select).length > 0) {
	            throw "You cannot pass the query with select in CloudNotifications.";
	        }
	    }

	    tableName = tableName.toLowerCase();

	    if (eventType instanceof Array) {
	        //if event type is an array.
	        for (var i = 0; i < eventType.length; i++) {
	            _CB2.default.CloudObject.on(tableName, eventType[i], cloudQuery, callback);
	            if (done && done.success) done.success();else def.resolve();
	        }
	    } else {
	        eventType = eventType.toLowerCase();
	        if (eventType === 'created' || eventType === 'updated' || eventType === 'deleted') {

	            var payload = {
	                room: (_CB2.default.appId + 'table' + tableName + eventType).toLowerCase(),
	                sessionId: _CB2.default._getSessionId()
	            };

	            _CB2.default.Socket.emit('join-object-channel', payload);
	            _CB2.default.Socket.on((_CB2.default.appId + 'table' + tableName + eventType).toLowerCase(), function (data) {
	                //listen to events in custom channel.
	                data = _CB2.default.fromJSON(data);
	                if (cloudQuery && cloudQuery instanceof _CB2.default.CloudQuery && _CB2.default.CloudObject._validateNotificationQuery(data, cloudQuery)) callback(data);else if (!cloudQuery) callback(data);
	            });

	            if (done && done.success) done.success();else def.resolve();
	        } else {
	            throw 'created, updated, deleted are supported notification types.';
	        }
	    }

	    if (!done) {
	        return def.promise;
	    }
	};

	CloudObject.off = function (tableName, eventType, done) {

	    if (_CB2.default._isRealtimeDisabled) {
	        throw "Realtime is disbaled for this app.";
	    }

	    var def;

	    if (!done) {
	        def = new _CB2.default.Promise();
	    }

	    tableName = tableName.toLowerCase();

	    if (eventType instanceof Array) {
	        //if event type is an array.
	        for (var i = 0; i < eventType.length; i++) {
	            _CB2.default.CloudObject.off(tableName, eventType[i]);
	            if (done && done.success) done.success();else def.resolve();
	        }
	    } else {

	        eventType = eventType.toLowerCase();

	        if (eventType === 'created' || eventType === 'updated' || eventType === 'deleted') {
	            _CB2.default.Socket.emit('leave-object-channel', (_CB2.default.appId + 'table' + tableName + eventType).toLowerCase());
	            _CB2.default.Socket.removeAllListeners((_CB2.default.appId + 'table' + tableName + eventType).toLowerCase());
	            if (done && done.success) done.success();else def.resolve();
	        } else {
	            throw 'created, updated, deleted are supported notification types.';
	        }
	    }

	    if (!done) {
	        return def.promise;
	    }
	};

	CloudObject.saveAll = function (array, callback) {

	    if (!array || array.constructor !== Array) {
	        throw "Array of CloudObjects is Null";
	    }

	    for (var i = 0; i < array.length; i++) {
	        if (!(array[i] instanceof _CB2.default.CloudObject)) {
	            throw "Should Be an Array of CloudObjects";
	        }
	    }

	    var def;
	    if (!callback) {
	        def = new _CB2.default.Promise();
	    }

	    _CB2.default._bulkObjFileCheck(array).then(function () {
	        var xmlhttp = _CB2.default._loadXml();
	        var params = JSON.stringify({
	            document: _CB2.default.toJSON(array),
	            key: _CB2.default.appKey
	        });
	        var url = _CB2.default.apiUrl + "/data/" + _CB2.default.appId + '/' + array[0]._tableName;
	        _CB2.default._request('PUT', url, params).then(function (response) {
	            var thisObj = _CB2.default.fromJSON(JSON.parse(response));
	            if (callback) {
	                callback.success(thisObj);
	            } else {
	                def.resolve(thisObj);
	            }
	        }, function (err) {
	            if (callback) {
	                callback.error(err);
	            } else {
	                def.reject(err);
	            }
	        });
	    }, function (err) {
	        if (callback) {
	            callback.error(err);
	        } else {
	            def.reject(err);
	        }
	    });

	    if (!callback) {
	        return def.promise;
	    }
	};

	CloudObject.deleteAll = function (array, callback) {

	    if (!array && array.constructor !== Array) {
	        throw "Array of CloudObjects is Null";
	    }

	    for (var i = 0; i < array.length; i++) {
	        if (!(array[i] instanceof _CB2.default.CloudObject)) {
	            throw "Should Be an Array of CloudObjects";
	        }
	    }

	    var def;
	    if (!callback) {
	        def = new _CB2.default.Promise();
	    }

	    var xmlhttp = _CB2.default._loadXml();
	    var params = JSON.stringify({
	        document: _CB2.default.toJSON(array),
	        key: _CB2.default.appKey,
	        method: "DELETE"
	    });
	    var url = _CB2.default.apiUrl + "/data/" + _CB2.default.appId + '/' + array[0]._tableName;
	    _CB2.default._request('PUT', url, params).then(function (response) {
	        var thisObj = _CB2.default.fromJSON(JSON.parse(response));
	        if (callback) {
	            callback.success(thisObj);
	        } else {
	            def.resolve(thisObj);
	        }
	    }, function (err) {
	        if (callback) {
	            callback.error(err);
	        } else {
	            def.reject(err);
	        }
	    });

	    if (!callback) {
	        return def.promise;
	    }
	};

	/* Private Methods */
	CloudObject._validateNotificationQuery = function (cloudObject, cloudQuery) {
	    //delete an object matching the objectId

	    if (!cloudQuery) throw "CloudQuery is null";

	    if (!cloudQuery.query) throw "There is no query in CloudQuery";

	    //validate query.
	    var query = cloudQuery.query;

	    if (cloudQuery.limit === 0) return false;

	    if (cloudQuery.skip > 0) {
	        --cloudQuery.skip;
	        return false;
	    }

	    //delete include
	    delete query.$include;

	    if (_CB2.default.CloudQuery._validateQuery(cloudObject, query)) {
	        //redice limit of CloudQuery.
	        --cloudQuery.limit;
	        return true;
	    } else {
	        return false;
	    }
	};

	_CB2.default.CloudObject = CloudObject;

	exports.default = _CB2.default.CloudObject;

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _CB = __webpack_require__(1);

	var _CB2 = _interopRequireDefault(_CB);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/*
	 CloudFiles
	 */

	_CB2.default.CloudFile = _CB2.default.CloudFile || function (file, data, type) {

	    if (Object.prototype.toString.call(file) === '[object File]' || Object.prototype.toString.call(file) === '[object Blob]') {

	        this.fileObj = file;
	        this.document = {
	            _id: null,
	            _type: 'file',
	            ACL: new _CB2.default.ACL(),
	            name: file && file.name && file.name !== "" ? file.name : 'unknown',
	            size: file.size,
	            url: null,
	            expires: null,
	            contentType: typeof file.type !== "undefined" && file.type !== "" ? file.type : 'unknown'
	        };
	    } else if (typeof file === "string") {
	        var regexp = RegExp("https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,}");
	        if (regexp.test(file)) {
	            this.document = {
	                _id: null,
	                _type: 'file',
	                ACL: new _CB2.default.ACL(),
	                name: '',
	                size: '',
	                url: file,
	                expires: null,
	                contentType: ''
	            };
	        } else {
	            if (data) {
	                this.data = data;
	                if (!type) {
	                    type = file.split('.')[file.split('.').length - 1];
	                }
	                this.document = {
	                    _id: null,
	                    _type: 'file',
	                    ACL: new _CB2.default.ACL(),
	                    name: file,
	                    size: '',
	                    url: null,
	                    expires: null,
	                    contentType: type
	                };
	            } else {
	                this.document = {
	                    _id: file,
	                    _type: 'file'
	                };
	            }
	        }
	    }
	};

	_CB2.default.CloudFile.prototype = Object.create(_CB2.default.CloudObject.prototype);

	Object.defineProperty(_CB2.default.CloudFile.prototype, 'type', {
	    get: function get() {
	        return this.document.contentType;
	    },
	    set: function set(type) {
	        this.document.contentType = type;
	    }
	});

	Object.defineProperty(_CB2.default.CloudFile.prototype, 'url', {
	    get: function get() {
	        return this.document.url;
	    },
	    set: function set(url) {
	        this.document.url = url;
	    }
	});

	Object.defineProperty(_CB2.default.CloudFile.prototype, 'size', {
	    get: function get() {
	        return this.document.size;
	    },
	    set: function set(size) {
	        this.document.size = size;
	    }
	});

	Object.defineProperty(_CB2.default.CloudFile.prototype, 'name', {
	    get: function get() {
	        return this.document.name;
	    },
	    set: function set(name) {
	        this.document.name = name;
	    }
	});

	/**
	 * Uploads File
	 *
	 * @param callback
	 * @returns {*}
	 */

	_CB2.default.CloudFile.prototype.save = function (callback) {

	    var def;

	    if (!callback) {
	        def = new _CB2.default.Promise();
	    }

	    var thisObj = this;

	    if (!this.fileObj && !this.data) throw "You cannot save a file which is null";

	    if (!this.data) {
	        var params = new FormData();
	        params.append("fileToUpload", this.fileObj);
	        params.append("key", _CB2.default.appKey);
	        params.append("fileObj", JSON.stringify(_CB2.default.toJSON(thisObj)));
	        var url = _CB2.default.apiUrl + '/file/' + _CB2.default.appId;

	        var uploadProgressCallback = null;

	        if (callback && callback.uploadProgress) {
	            uploadProgressCallback = callback.uploadProgress;
	        }

	        _CB2.default._request('POST', url, params, false, true, uploadProgressCallback).then(function (response) {
	            thisObj.document = JSON.parse(response);
	            if (callback) {
	                callback.success(thisObj);
	            } else {
	                def.resolve(thisObj);
	            }
	        }, function (err) {
	            if (callback) {
	                callback.error(err);
	            } else {
	                def.reject(err);
	            }
	        });
	    } else {
	        var data = this.data;
	        var params = JSON.stringify({
	            data: data,
	            fileObj: _CB2.default.toJSON(this),
	            key: _CB2.default.appKey
	        });
	        var url = _CB2.default.apiUrl + '/file/' + _CB2.default.appId;
	        var uploadProgressCallback = null;

	        if (callback && callback.uploadProgress) {
	            uploadProgressCallback = callback.uploadProgress;
	        }

	        _CB2.default._request('POST', url, params, null, null, uploadProgressCallback).then(function (response) {
	            thisObj.document = JSON.parse(response);
	            delete thisObj.data;
	            if (callback) {
	                callback.success(thisObj);
	            } else {
	                def.resolve(thisObj);
	            }
	        }, function (err) {
	            if (callback) {
	                callback.error(err);
	            } else {
	                def.reject(err);
	            }
	        });
	    }

	    if (!callback) {
	        return def.promise;
	    }
	};

	/**
	 * Removes a file from Database.
	 *
	 * @param callback
	 * @returns {*}
	 */

	_CB2.default.CloudFile.prototype.delete = function (callback) {
	    var def;

	    if (!this.url) {
	        throw "You cannot delete a file which does not have an URL";
	    }
	    if (!callback) {
	        def = new _CB2.default.Promise();
	    }
	    var thisObj = this;

	    var params = JSON.stringify({
	        fileObj: _CB2.default.toJSON(thisObj),
	        key: _CB2.default.appKey,
	        method: "PUT"
	    });
	    var url = _CB2.default.apiUrl + '/file/' + _CB2.default.appId + '/' + this.document._id;

	    _CB2.default._request('PUT', url, params).then(function (response) {
	        thisObj.url = null;
	        if (callback) {
	            callback.success(thisObj);
	        } else {
	            def.resolve(thisObj);
	        }
	    }, function (err) {
	        if (callback) {
	            callback.error(err);
	        } else {
	            def.reject(err);
	        }
	    });

	    if (!callback) {
	        return def.promise;
	    }
	};

	_CB2.default.CloudFile.prototype.getFileContent = function (callback) {

	    var def;

	    if (!this.url) {
	        throw "URL is null. Fetch this file object first using fetch()";
	    }
	    if (!callback) {
	        def = new _CB2.default.Promise();
	    }

	    var params = JSON.stringify({
	        key: _CB2.default.appKey
	    });
	    var url = this.url;

	    _CB2.default._request('GET', url, params).then(function (response) {
	        if (callback) {
	            callback.success(response);
	        } else {
	            def.resolve(response);
	        }
	    }, function (err) {
	        if (callback) {
	            callback.error(err);
	        } else {
	            def.reject(err);
	        }
	    });

	    if (!callback) {
	        return def.promise;
	    }
	};

	exports.default = _CB2.default.CloudFile;

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _CB = __webpack_require__(1);

	var _CB2 = _interopRequireDefault(_CB);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/*
	CloudQueue
	 */

	var CloudQueue = function () {
	    function CloudQueue(queueName, queueType) {
	        _classCallCheck(this, CloudQueue);

	        if (typeof queueName === 'undefined' || queueName == null) {
	            throw "Cannot create a queue with empty name";
	        }

	        this.document = {};
	        this.document.ACL = new _CB2.default.ACL(); //ACL(s) of the document
	        this.document._type = 'queue';
	        this.document.expires = null;
	        this.document.name = queueName;
	        this.document.retry = null;
	        this.document.subscribers = [];
	        this.document.messages = [];

	        if (queueType && queueType !== "push" && queueType !== "pull") {
	            throw "Type can be push or pull";
	        }
	        if (queueType) {
	            this.document.queueType = queueType;
	        } else {
	            this.document.queueType = "pull";
	        }
	    }

	    _createClass(CloudQueue, [{
	        key: 'addMessage',
	        value: function addMessage(queueMessage, callback) {

	            if (queueMessage == null) throw "Message cannot be null";

	            var def;
	            _CB2.default._validate();

	            if (!callback) {
	                def = new _CB2.default.Promise();
	            }

	            var messages = [];

	            if (queueMessage.constructor !== Array) {
	                messages.push(queueMessage);
	            } else {
	                messages = queueMessage;
	            }

	            for (var i = 0; i < messages.length; i++) {
	                if (!(messages[i] instanceof _CB2.default.QueueMessage)) {
	                    messages[i] = new _CB2.default.QueueMessage(messages[i]);
	                }
	            }

	            this.document.messages = messages;

	            //PUT TO SERVER.
	            var thisObj = this;

	            var xmlhttp = _CB2.default._loadXml();

	            var params = JSON.stringify({
	                document: _CB2.default.toJSON(thisObj),
	                key: _CB2.default.appKey
	            });

	            var url = _CB2.default.apiUrl + "/queue/" + _CB2.default.appId + '/' + thisObj.document.name + '/message';

	            _CB2.default._request('PUT', url, params).then(function (response) {
	                var messages = _CB2.default.fromJSON(JSON.parse(response));
	                if (callback) {
	                    callback.success(messages);
	                } else {
	                    def.resolve(messages);
	                }
	            }, function (err) {
	                if (callback) {
	                    callback.error(err);
	                } else {
	                    def.reject(err);
	                }
	            });
	        }
	    }, {
	        key: 'updateMessage',
	        value: function updateMessage(queueMessage, callback) {

	            if (queueMessage == null) throw "Message cannot be null";

	            var def;
	            _CB2.default._validate();

	            if (!callback) {
	                def = new _CB2.default.Promise();
	            }

	            var messages = [];

	            if (queueMessage.constructor !== Array) {
	                if (!queueMessage.id) {
	                    throw "Message cannot be updated because it has never been saved.";
	                } else {
	                    messages.push(queueMessage);
	                }
	            } else {
	                messages = queueMessage;
	                for (var i = 0; i < messages.length; i++) {
	                    if (!(messages[i] instanceof _CB2.default.QueueMessage)) {
	                        throw "Message is not an instance of QueueMessage.";
	                    }

	                    if (!message[i].id) {
	                        throw "Message cannot be updated because it has never been saved.";
	                    }
	                }
	            }

	            return this.addMessage(queueMessage, callback);
	        }
	    }, {
	        key: 'getMessage',
	        value: function getMessage(count, callback) {

	            var def;
	            _CB2.default._validate();

	            if (!callback) {
	                def = new _CB2.default.Promise();
	            }

	            if ((typeof count === 'undefined' ? 'undefined' : _typeof(count)) === 'object' && !callback) {
	                callback = count;
	                count = null;
	            }

	            if (!count) count = 1;

	            var thisObj = this;

	            var xmlhttp = _CB2.default._loadXml();

	            var params = JSON.stringify({
	                count: count,
	                key: _CB2.default.appKey
	            });

	            var url = _CB2.default.apiUrl + "/queue/" + _CB2.default.appId + '/' + thisObj.document.name + '/getMessage';

	            _CB2.default._request('POST', url, params).then(function (response) {

	                if (!response || response === "") {
	                    response = null;
	                }

	                if (callback) {
	                    callback.success(_CB2.default.fromJSON(JSON.parse(response)));
	                } else {
	                    def.resolve(_CB2.default.fromJSON(JSON.parse(response)));
	                }
	            }, function (err) {
	                if (callback) {
	                    callback.error(err);
	                } else {
	                    def.reject(err);
	                }
	            });
	        }
	    }, {
	        key: 'getAllMessages',
	        value: function getAllMessages(callback) {

	            var def;
	            _CB2.default._validate();

	            if (!callback) {
	                def = new _CB2.default.Promise();
	            }

	            if ((typeof count === 'undefined' ? 'undefined' : _typeof(count)) === 'object' && !callback) {
	                callback = count;
	                count = null;
	            }

	            var thisObj = this;

	            var xmlhttp = _CB2.default._loadXml();

	            var params = JSON.stringify({
	                key: _CB2.default.appKey
	            });

	            var url = _CB2.default.apiUrl + "/queue/" + _CB2.default.appId + '/' + thisObj.document.name + '/messages';

	            _CB2.default._request('POST', url, params).then(function (response) {

	                if (!response || response === "") {
	                    response = null;
	                }

	                if (callback) {
	                    callback.success(_CB2.default.fromJSON(JSON.parse(response)));
	                } else {
	                    def.resolve(_CB2.default.fromJSON(JSON.parse(response)));
	                }
	            }, function (err) {
	                if (callback) {
	                    callback.error(err);
	                } else {
	                    def.reject(err);
	                }
	            });
	        }
	    }, {
	        key: 'getMessageById',
	        value: function getMessageById(id, callback) {
	            var def;

	            _CB2.default._validate();

	            if (!callback) {
	                def = new _CB2.default.Promise();
	            }

	            var xmlhttp = _CB2.default._loadXml();

	            var params = JSON.stringify({
	                key: _CB2.default.appKey
	            });

	            var url = _CB2.default.apiUrl + "/queue/" + _CB2.default.appId + '/' + this.document.name + '/message/' + id;

	            _CB2.default._request('POST', url, params).then(function (response) {

	                if (!response || response === "") {
	                    response = null;
	                }

	                if (callback) {
	                    callback.success(_CB2.default.fromJSON(JSON.parse(response)));
	                } else {
	                    def.resolve(_CB2.default.fromJSON(JSON.parse(response)));
	                }
	            }, function (err) {
	                if (callback) {
	                    callback.error(err);
	                } else {
	                    def.reject(err);
	                }
	            });
	        }
	    }, {
	        key: 'get',
	        value: function get(callback) {
	            var def;

	            _CB2.default._validate();

	            if (!callback) {
	                def = new _CB2.default.Promise();
	            }

	            var xmlhttp = _CB2.default._loadXml();

	            var thisObj = this;

	            var params = JSON.stringify({
	                key: _CB2.default.appKey
	            });

	            var url = _CB2.default.apiUrl + "/queue/" + _CB2.default.appId + '/' + thisObj.document.name + '/';

	            _CB2.default._request('POST', url, params).then(function (response) {
	                if (callback) {
	                    callback.success(_CB2.default.fromJSON(JSON.parse(response), thisObj));
	                } else {
	                    def.resolve(_CB2.default.fromJSON(JSON.parse(response), thisObj));
	                }
	            }, function (err) {
	                if (callback) {
	                    callback.error(err);
	                } else {
	                    def.reject(err);
	                }
	            });
	        }
	    }, {
	        key: 'create',
	        value: function create(callback) {
	            var def;

	            _CB2.default._validate();

	            if (!callback) {
	                def = new _CB2.default.Promise();
	            }

	            var xmlhttp = _CB2.default._loadXml();

	            var thisObj = this;

	            var params = JSON.stringify({
	                key: _CB2.default.appKey,
	                document: _CB2.default.toJSON(thisObj)
	            });

	            var url = _CB2.default.apiUrl + "/queue/" + _CB2.default.appId + '/' + thisObj.document.name + '/create';

	            _CB2.default._request('POST', url, params).then(function (response) {
	                if (callback) {
	                    callback.success(_CB2.default.fromJSON(JSON.parse(response), thisObj));
	                } else {
	                    def.resolve(_CB2.default.fromJSON(JSON.parse(response), thisObj));
	                }
	            }, function (err) {
	                if (callback) {
	                    callback.error(err);
	                } else {
	                    def.reject(err);
	                }
	            });
	        }
	    }, {
	        key: 'addSubscriber',
	        value: function addSubscriber(url, callback) {

	            var def;

	            _CB2.default._validate();

	            if (!callback) {
	                def = new _CB2.default.Promise();
	            }

	            var xmlhttp = _CB2.default._loadXml();

	            var tempSubscribers = this.document.subscribers;

	            this.document.subscribers = [];

	            if (url.constructor === Array) {
	                for (var i = 0; i < url.length; i++) {
	                    this.document.subscribers.push(url[i]);
	                }
	            } else {
	                this.document.subscribers.push(url);
	            }

	            var params = JSON.stringify({
	                key: _CB2.default.appKey,
	                document: _CB2.default.toJSON(this)
	            });

	            var thisObj = this;

	            var url = _CB2.default.apiUrl + '/queue/' + _CB2.default.appId + '/' + thisObj.document.name + '/subscriber/';

	            _CB2.default._request('POST', url, params).then(function (response) {
	                thisObj = _CB2.default.fromJSON(JSON.parse(response), thisObj);
	                if (callback) {
	                    callback.success(thisObj);
	                } else {
	                    def.resolve(thisObj);
	                }
	            }, function (err) {
	                thisObj.document.subscribers = tempSubscribers;
	                if (callback) {
	                    callback.error(err);
	                } else {
	                    def.reject(err);
	                }
	            });
	        }
	    }, {
	        key: 'removeSubscriber',
	        value: function removeSubscriber(url, callback) {

	            var def;

	            _CB2.default._validate();

	            if (!callback) {
	                def = new _CB2.default.Promise();
	            }

	            var xmlhttp = _CB2.default._loadXml();

	            var tempSubscribers = this.document.subscribers;

	            this.document.subscribers = [];

	            if (url.constructor === Array) {
	                for (var i = 0; i < url.length; i++) {
	                    this.document.subscribers.push(url[i]);
	                }
	            } else {
	                this.document.subscribers.push(url);
	            }

	            var thisObj = this;

	            var params = JSON.stringify({
	                key: _CB2.default.appKey,
	                document: _CB2.default.toJSON(thisObj),
	                method: "DELETE"
	            });

	            var url = _CB2.default.apiUrl + '/queue/' + _CB2.default.appId + '/' + thisObj.document.name + '/subscriber/';

	            _CB2.default._request('PUT', url, params).then(function (response) {
	                thisObj = _CB2.default.fromJSON(JSON.parse(response), thisObj);
	                if (callback) {
	                    callback.success(thisObj);
	                } else {
	                    def.resolve(thisObj);
	                }
	            }, function (err) {
	                this.document.subscribers = tempSubscribers;
	                if (callback) {
	                    callback.error(err);
	                } else {
	                    def.reject(err);
	                }
	            });
	        }
	    }, {
	        key: 'peekMessage',
	        value: function peekMessage(count, callback) {

	            var def;

	            _CB2.default._validate();

	            if (!callback) {
	                def = new _CB2.default.Promise();
	            }

	            if ((typeof count === 'undefined' ? 'undefined' : _typeof(count)) === 'object' && !callback) {
	                callback = count;
	                count = null;
	            }

	            if (!count) count = 1;

	            var xmlhttp = _CB2.default._loadXml();

	            var params = JSON.stringify({
	                key: _CB2.default.appKey,
	                count: count
	            });

	            var url = _CB2.default.apiUrl + "/queue/" + _CB2.default.appId + '/' + this.document.name + '/peekMessage';

	            _CB2.default._request('POST', url, params).then(function (response) {
	                if (callback) {
	                    callback.success(_CB2.default.fromJSON(JSON.parse(response)));
	                } else {
	                    def.resolve(_CB2.default.fromJSON(JSON.parse(response)));
	                }
	            }, function (err) {
	                if (callback) {
	                    callback.error(err);
	                } else {
	                    def.reject(err);
	                }
	            });
	        }
	    }, {
	        key: 'delete',
	        value: function _delete(callback) {
	            var def;

	            _CB2.default._validate();

	            if (!callback) {
	                def = new _CB2.default.Promise();
	            }

	            var xmlhttp = _CB2.default._loadXml();

	            var params = JSON.stringify({
	                key: _CB2.default.appKey,
	                document: _CB2.default.toJSON(this),
	                method: "DELETE"
	            });

	            var thisObj = this;

	            var url = _CB2.default.apiUrl + "/queue/" + _CB2.default.appId + '/' + thisObj.document.name;

	            _CB2.default._request('PUT', url, params).then(function (response) {
	                thisObj = _CB2.default.fromJSON(JSON.parse(response), thisObj);
	                if (callback) {
	                    callback.success(thisObj);
	                } else {
	                    def.resolve(thisObj);
	                }
	            }, function (err) {
	                if (callback) {
	                    callback.error(err);
	                } else {
	                    def.reject(err);
	                }
	            });
	        }
	    }, {
	        key: 'clear',
	        value: function clear(callback) {
	            var def;

	            _CB2.default._validate();

	            if (!callback) {
	                def = new _CB2.default.Promise();
	            }

	            var xmlhttp = _CB2.default._loadXml();

	            var params = JSON.stringify({
	                key: _CB2.default.appKey,
	                document: _CB2.default.toJSON(this),
	                method: "DELETE"
	            });

	            var thisObj = this;

	            var url = _CB2.default.apiUrl + "/queue/" + _CB2.default.appId + '/' + thisObj.document.name + "/clear";

	            _CB2.default._request('PUT', url, params).then(function (response) {
	                thisObj = _CB2.default.fromJSON(JSON.parse(response), thisObj);
	                if (callback) {
	                    callback.success(thisObj);
	                } else {
	                    def.resolve(thisObj);
	                }
	            }, function (err) {
	                if (callback) {
	                    callback.error(err);
	                } else {
	                    def.reject(err);
	                }
	            });
	        }
	    }, {
	        key: 'refreshMessageTimeout',
	        value: function refreshMessageTimeout(id, timeout, callback) {
	            var def;

	            _CB2.default._validate();

	            if (!callback) {
	                def = new _CB2.default.Promise();
	            }

	            if (!id) throw "Message Id cannot be null";

	            if (id instanceof _CB2.default.QueueMessage) {
	                if (!id.id) {
	                    throw "Queue Message should have an id.";
	                } else {
	                    id = id.id;
	                }
	            }

	            if (!callback && (timeout.success || timeout.error)) {
	                callback = timeout;
	                timeout = null;
	            }

	            var xmlhttp = _CB2.default._loadXml();

	            var params = JSON.stringify({
	                key: _CB2.default.appKey,
	                timeout: timeout
	            });

	            var thisObj = this;

	            var url = _CB2.default.apiUrl + "/queue/" + _CB2.default.appId + '/' + thisObj.document.name + "/" + id + "/refresh-message-timeout";

	            _CB2.default._request('PUT', url, params).then(function (response) {
	                if (callback) {
	                    callback.success(_CB2.default.fromJSON(JSON.parse(response)));
	                } else {
	                    def.resolve(_CB2.default.fromJSON(JSON.parse(response)));
	                }
	            }, function (err) {
	                if (callback) {
	                    callback.error(err);
	                } else {
	                    def.reject(err);
	                }
	            });
	        }
	    }, {
	        key: 'deleteMessage',
	        value: function deleteMessage(id, callback) {
	            var def;

	            _CB2.default._validate();

	            if (!id || !(id instanceof _CB2.default.QueueMessage) && typeof id !== 'string') {
	                throw "Delete Message function should have id of the message or insance of QueueMessage as the first parameter. ";
	            }

	            if (id instanceof _CB2.default.QueueMessage) {
	                id = id.id;
	            }

	            if (!callback) {
	                def = new _CB2.default.Promise();
	            }

	            var xmlhttp = _CB2.default._loadXml();

	            var params = JSON.stringify({
	                key: _CB2.default.appKey,
	                method: "DELETE"
	            });

	            var thisObj = this;

	            var url = _CB2.default.apiUrl + "/queue/" + _CB2.default.appId + '/' + thisObj.document.name + "/message/" + id;

	            _CB2.default._request('PUT', url, params).then(function (response) {
	                if (callback) {
	                    callback.success(_CB2.default.fromJSON(JSON.parse(response)));
	                } else {
	                    def.resolve(_CB2.default.fromJSON(JSON.parse(response)));
	                }
	            }, function (err) {
	                if (callback) {
	                    callback.error(err);
	                } else {
	                    def.reject(err);
	                }
	            });
	        }
	    }, {
	        key: 'update',
	        value: function update(callback) {
	            var def;

	            _CB2.default._validate();

	            if (!callback) {
	                def = new _CB2.default.Promise();
	            }

	            var xmlhttp = _CB2.default._loadXml();

	            var thisObj = this;

	            var params = JSON.stringify({
	                key: _CB2.default.appKey,
	                document: _CB2.default.toJSON(thisObj)
	            });

	            var url = _CB2.default.apiUrl + "/queue/" + _CB2.default.appId + '/' + thisObj.document.name;

	            _CB2.default._request('PUT', url, params).then(function (response) {
	                if (callback) {
	                    callback.success(_CB2.default.fromJSON(JSON.parse(response), thisObj));
	                } else {
	                    def.resolve(_CB2.default.fromJSON(JSON.parse(response), thisObj));
	                }
	            }, function (err) {
	                if (callback) {
	                    callback.error(err);
	                } else {
	                    def.reject(err);
	                }
	            });
	        }
	    }]);

	    return CloudQueue;
	}();

	Object.defineProperty(CloudQueue.prototype, 'retry', {
	    get: function get() {
	        return this.document.retry;
	    },
	    set: function set(retry) {

	        if (this.queueType !== "push") {
	            throw "Queue Type should be push to set this property";
	        }

	        this.document.retry = retry;
	        _CB2.default._modified(this, 'retry');
	    }
	});

	Object.defineProperty(CloudQueue.prototype, 'size', {
	    get: function get() {
	        if (this.document.size) return this.document.size;else return 0;
	    }
	});

	Object.defineProperty(CloudQueue.prototype, 'name', {
	    get: function get() {
	        return this.document.name;
	    }
	});

	Object.defineProperty(CloudQueue.prototype, 'subscribers', {
	    get: function get() {
	        return this.document.subscribers;
	    }
	});

	Object.defineProperty(CloudQueue.prototype, 'type', {
	    get: function get() {
	        return this.document.queueType;
	    },
	    set: function set(queueType) {
	        this.document.queueType = queueType;
	        _CB2.default._modified(this, 'queueType');
	    }
	});

	Object.defineProperty(CloudQueue.prototype, 'ACL', {
	    get: function get() {
	        return this.document.ACL;
	    },
	    set: function set(ACL) {
	        this.document.ACL = ACL;
	        _CB2.default._modified(this, 'ACL');
	    }
	});

	Object.defineProperty(CloudQueue.prototype, 'id', {
	    get: function get() {
	        return this.document._id;
	    }
	});

	Object.defineProperty(CloudQueue.prototype, 'createdAt', {
	    get: function get() {
	        return this.document.createdAt;
	    }
	});

	Object.defineProperty(CloudQueue.prototype, 'updatedAt', {
	    get: function get() {
	        return this.document.updatedAt;
	    }
	});

	Object.defineProperty(CloudQueue.prototype, 'expires', {
	    get: function get() {
	        return this.document.expires;
	    },
	    set: function set(expires) {
	        this.document.expires = expires;
	        _CB2.default._modified(this, 'expires');
	    }
	});

	CloudQueue.getAll = function (callback) {

	    var def;

	    _CB2.default._validate();

	    if (!callback) {
	        def = new _CB2.default.Promise();
	    }

	    var xmlhttp = _CB2.default._loadXml();

	    var thisObj = this;

	    var params = JSON.stringify({
	        key: _CB2.default.appKey
	    });

	    var url = _CB2.default.apiUrl + "/queue/" + _CB2.default.appId + '/';

	    _CB2.default._request('POST', url, params).then(function (response) {

	        if (response === "") {
	            response = null;
	        }

	        if (callback) {
	            callback.success(_CB2.default.fromJSON(JSON.parse(response)));
	        } else {
	            def.resolve(_CB2.default.fromJSON(JSON.parse(response)));
	        }
	    }, function (err) {
	        if (callback) {
	            callback.error(err);
	        } else {
	            def.reject(err);
	        }
	    });
	};

	CloudQueue.get = function (queueName, callback) {
	    var queue = new _CB2.default.CloudQueue(queueName);
	    return queue.get(callback);
	};

	CloudQueue.delete = function (queueName, callback) {
	    var queue = new _CB2.default.CloudQueue(queueName);
	    return queue.delete(callback);
	};

	_CB2.default.CloudQueue = CloudQueue;

	_CB2.default.QueueMessage = function (data) {

	    this.document = {};
	    this.document.ACL = new _CB2.default.ACL(); //ACL(s) of the document
	    this.document._type = 'queue-message';
	    this.document.expires = null;
	    this.document.timeout = 1800; //30 mins by default.
	    this.document.delay = null;
	    this.document.message = data;
	    this.document._id = null;
	    this.document._modifiedColumns = ['createdAt', 'updatedAt', 'ACL', 'expires', 'timeout', 'delay', 'message'];
	    this.document._isModified = true;
	};

	Object.defineProperty(_CB2.default.QueueMessage.prototype, 'message', {
	    get: function get() {
	        return this.document.message;
	    },
	    set: function set(message) {
	        this.document.message = message;
	        _CB2.default._modified(this, 'message');
	    }
	});

	Object.defineProperty(_CB2.default.QueueMessage.prototype, 'ACL', {
	    get: function get() {
	        return this.document.ACL;
	    },
	    set: function set(ACL) {
	        this.document.ACL = ACL;
	        _CB2.default._modified(this, 'ACL');
	    }
	});

	Object.defineProperty(_CB2.default.QueueMessage.prototype, 'id', {
	    get: function get() {
	        return this.document._id;
	    }
	});

	Object.defineProperty(_CB2.default.QueueMessage.prototype, 'createdAt', {
	    get: function get() {
	        return this.document.createdAt;
	    },
	    set: function set(createdAt) {
	        this.document.createdAt = createdAt;
	        _CB2.default._modified(this, 'createdAt');
	    }
	});

	Object.defineProperty(_CB2.default.QueueMessage.prototype, 'updatedAt', {
	    get: function get() {
	        return this.document.updatedAt;
	    },
	    set: function set(updatedAt) {
	        this.document.updatedAt = updatedAt;
	        _CB2.default._modified(this, 'updatedAt');
	    }
	});

	Object.defineProperty(_CB2.default.QueueMessage.prototype, 'expires', {
	    get: function get() {
	        return this.document.expires;
	    },
	    set: function set(expires) {
	        this.document.expires = expires;
	        _CB2.default._modified(this, 'expires');
	    }
	});

	Object.defineProperty(_CB2.default.QueueMessage.prototype, 'timeout', {
	    get: function get() {
	        return this.document.timeout;
	    },
	    set: function set(timeout) {
	        this.document.timeout = timeout;
	        _CB2.default._modified(this, 'timeout');
	    }
	});

	Object.defineProperty(_CB2.default.QueueMessage.prototype, 'delay', {
	    get: function get() {
	        if (this.document.delay) return this.document.delay / 1000;else return 0;
	    },
	    set: function set(delay) {
	        delay *= 1000; //converting to seconds from milli seconds,
	        this.document.delay = delay;
	        _CB2.default._modified(this, 'delay');
	    }
	});

	exports.default = _CB2.default.CloudQueue;

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _CB = __webpack_require__(1);

	var _CB2 = _interopRequireDefault(_CB);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/*
	 CloudRole
	 */

	var CloudRole = function CloudRole(roleName) {
	    _classCallCheck(this, CloudRole);

	    //calling the constructor.
	    if (!this.document) this.document = {};
	    this.document._tableName = 'Role';
	    this.document._type = 'role';
	    this.document.name = roleName;
	    this.document.expires = null;
	    this.document.ACL = new _CB2.default.ACL();
	    this.document.expires = null;
	    this.document._isModified = true;
	    this.document._modifiedColumns = ['createdAt', 'updatedAt', 'ACL', 'name', 'expires'];
	};

	CloudRole.prototype = Object.create(_CB2.default.CloudObject.prototype);

	Object.defineProperty(CloudRole.prototype, 'name', {
	    get: function get() {
	        return this.document.name;
	    },
	    set: function set(name) {
	        this.document.name = name;
	        _CB2.default._modified(this, name);
	    }
	});

	_CB2.default.CloudRole = _CB2.default.CloudRole || CloudRole;

	exports.default = _CB2.default.CloudRole;

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _CB = __webpack_require__(1);

	var _CB2 = _interopRequireDefault(_CB);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/*
	 CloudUser
	 */

	var CloudUser = function CloudUser() {
	    _classCallCheck(this, CloudUser);

	    if (!this.document) this.document = {};
	    this.document._tableName = 'User';
	    this.document.expires = null;
	    this.document._type = 'user';
	    this.document.expires = null;
	    this.document.ACL = new _CB2.default.ACL();
	    this.document._isModified = true;
	    this.document._modifiedColumns = ['createdAt', 'updatedAt', 'ACL', 'expires'];
	};

	_CB2.default.CloudUser = _CB2.default.CloudUser || CloudUser;

	//Description  : This function gets the current user from the server by taking the sessionId from querystring.
	//Params : 
	//returns : CloudUser object if the current user is still in session or null. 
	_CB2.default.CloudUser.getCurrentUser = function (callback) {

	    var def;
	    if (!callback) {
	        def = new _CB2.default.Promise();
	    }

	    //now call the signup API.
	    var params = JSON.stringify({
	        key: _CB2.default.appKey
	    });

	    var url = _CB2.default.apiUrl + "/user/" + _CB2.default.appId + "/currentUser";

	    _CB2.default._request('POST', url, params).then(function (response) {
	        var user = response;
	        if (response) {
	            try {
	                user = new _CB2.default.CloudUser();
	                _CB2.default.fromJSON(JSON.parse(response), user);
	                _CB2.default.CloudUser.current = user;
	                _CB2.default.CloudUser._setCurrentUser(user);
	            } catch (e) {}
	        }

	        if (callback) {
	            callback.success(user);
	        } else {
	            def.resolve(user);
	        }
	    }, function (err) {
	        if (callback) {
	            callback.error(err);
	        } else {
	            def.reject(err);
	        }
	    });

	    if (!callback) {
	        return def.promise;
	    }
	};

	//Private Static fucntions

	//Description  : This function gets the current user from the cookie or from local storage.
	//Params : 
	//returns : CloudUser object if the current user is still in session or null. 
	_CB2.default.CloudUser._getCurrentUser = function () {
	    var content = _CB2.default._getCookie("CBCurrentUser");
	    if (content && content.length > 0) {
	        return _CB2.default.fromJSON(JSON.parse(content));
	    } else {
	        return null;
	    }
	};

	//Description  : This function saves the current user to the cookie or to local storage.
	//Params : @user - Instance of CB.CloudUser Object.
	//returns : void. 
	_CB2.default.CloudUser._setCurrentUser = function (user) {
	    //save the user to the cookie. 
	    if (!user) {
	        return;
	    }

	    //expiration time of 30 days.
	    _CB2.default._createCookie("CBCurrentUser", JSON.stringify(_CB2.default.toJSON(user)), 30 * 24 * 60 * 60 * 1000);
	};

	//Description  : This function saves the current user to the cookie or to local storage.
	//Params : @user - Instance of CB.CloudUser Object.
	//returns : void. 
	_CB2.default.CloudUser._removeCurrentUser = function () {
	    //save the user to the cookie. 
	    _CB2.default._deleteCookie("CBCurrentUser");
	};

	_CB2.default.CloudUser.resetPassword = function (email, callback) {

	    if (!email) {
	        throw "Email is required.";
	    }

	    var def;
	    if (!callback) {
	        def = new _CB2.default.Promise();
	    }

	    //now call the signup API.
	    var params = JSON.stringify({
	        email: email,
	        key: _CB2.default.appKey
	    });

	    var url = _CB2.default.apiUrl + "/user/" + _CB2.default.appId + "/resetPassword";

	    _CB2.default._request('POST', url, params).then(function (response) {
	        if (callback) {
	            callback.success();
	        } else {
	            def.resolve();
	        }
	    }, function (err) {
	        if (callback) {
	            callback.error(err);
	        } else {
	            def.reject(err);
	        }
	    });

	    if (!callback) {
	        return def.promise;
	    }
	};

	_CB2.default.CloudUser.prototype = Object.create(_CB2.default.CloudObject.prototype);

	Object.defineProperty(_CB2.default.CloudUser.prototype, 'username', {
	    get: function get() {
	        return this.document.username;
	    },
	    set: function set(username) {
	        this.document.username = username;
	        _CB2.default._modified(this, 'username');
	    }
	});
	Object.defineProperty(_CB2.default.CloudUser.prototype, 'password', {
	    get: function get() {
	        return this.document.password;
	    },
	    set: function set(password) {
	        this.document.password = password;
	        _CB2.default._modified(this, 'password');
	    }
	});
	Object.defineProperty(_CB2.default.CloudUser.prototype, 'email', {
	    get: function get() {
	        return this.document.email;
	    },
	    set: function set(email) {
	        this.document.email = email;
	        _CB2.default._modified(this, 'email');
	    }
	});

	_CB2.default.CloudUser.current = _CB2.default.CloudUser._getCurrentUser();

	_CB2.default.CloudUser.prototype.signUp = function (callback) {

	    if (_CB2.default._isNode) {
	        throw "Error : You cannot signup the user on the server. Use CloudUser.save() instead.";
	    }

	    if (!this.document.username) {
	        throw "Username is not set.";
	    }
	    if (!this.document.password) {
	        throw "Password is not set.";
	    }
	    if (!this.document.email) {
	        throw "Email is not set.";
	    }
	    var thisObj = this;
	    var def;
	    if (!callback) {
	        def = new _CB2.default.Promise();
	    }
	    //now call the signup API.
	    var params = JSON.stringify({
	        document: _CB2.default.toJSON(thisObj),
	        key: _CB2.default.appKey
	    });
	    var url = _CB2.default.apiUrl + "/user/" + _CB2.default.appId + "/signup";

	    _CB2.default._request('POST', url, params).then(function (user) {

	        var response = null;
	        if (user && user != "") {
	            _CB2.default.fromJSON(JSON.parse(user), thisObj);
	            _CB2.default.CloudUser.current = thisObj;
	            _CB2.default.CloudUser._setCurrentUser(thisObj);
	            response = thisObj;
	        }

	        if (callback) {
	            callback.success(response);
	        } else {
	            def.resolve(response);
	        }
	    }, function (err) {
	        if (callback) {
	            callback.error(err);
	        } else {
	            def.reject(err);
	        }
	    });

	    if (!callback) {
	        return def.promise;
	    }
	};

	_CB2.default.CloudUser.prototype.changePassword = function (oldPassword, newPassword, callback) {

	    var thisObj = this;
	    var def;
	    if (!callback) {
	        def = new _CB2.default.Promise();
	    }
	    //now call the signup API.
	    var params = JSON.stringify({
	        oldPassword: oldPassword,
	        newPassword: newPassword,
	        key: _CB2.default.appKey
	    });

	    var url = _CB2.default.apiUrl + "/user/" + _CB2.default.appId + "/changePassword";

	    _CB2.default._request('PUT', url, params).then(function (response) {
	        if (callback) {
	            callback.success(_CB2.default.fromJSON(JSON.parse(response), thisObj));
	        } else {
	            def.resolve(_CB2.default.fromJSON(JSON.parse(response), thisObj));
	        }
	    }, function (err) {
	        if (callback) {
	            callback.error(err);
	        } else {
	            def.reject(err);
	        }
	    });

	    if (!callback) {
	        return def.promise;
	    }
	};

	_CB2.default.CloudUser.prototype.logIn = function (callback) {

	    if (_CB2.default._isNode) {
	        throw "Error : You cannot login the user on the server.";
	    }

	    if (!this.document.username) {
	        throw "Username is not set.";
	    }
	    if (!this.document.password) {
	        throw "Password is not set.";
	    }
	    var thisObj = this;
	    var def;
	    if (!callback) {
	        def = new _CB2.default.Promise();
	    }
	    //now call the signup API.
	    var params = JSON.stringify({
	        document: _CB2.default.toJSON(thisObj),
	        key: _CB2.default.appKey
	    });
	    var url = _CB2.default.apiUrl + "/user/" + _CB2.default.appId + "/login";

	    _CB2.default._request('POST', url, params).then(function (response) {
	        thisObj = _CB2.default.fromJSON(JSON.parse(response), thisObj);
	        _CB2.default.CloudUser.current = thisObj;
	        if (callback) {
	            callback.success(thisObj);
	        } else {
	            def.resolve(thisObj);
	        }
	        _CB2.default.CloudUser._setCurrentUser(thisObj);
	    }, function (err) {
	        if (callback) {
	            callback.error(err);
	        } else {
	            def.reject(err);
	        }
	    });

	    if (!callback) {
	        return def.promise;
	    }
	};

	_CB2.default.CloudUser.authenticateWithProvider = function (dataJson, callback) {

	    if (_CB2.default._isNode) {
	        throw "Error : You cannot login the user on the server.";
	    }

	    var def;
	    if (!callback) {
	        def = new _CB2.default.Promise();
	    }

	    if (!dataJson) {
	        throw "data object is null.";
	    }

	    if (dataJson && !dataJson.provider) {
	        throw "provider is not set.";
	    }

	    if (dataJson && !dataJson.accessToken) {
	        throw "accessToken is not set.";
	    }

	    if (dataJson.provider.toLowerCase() === "twiter" && !dataJson.accessSecret) {
	        throw "accessSecret is required for provider twitter.";
	    }

	    var params = JSON.stringify({
	        provider: dataJson.provider,
	        accessToken: dataJson.accessToken,
	        accessSecret: dataJson.accessSecret,
	        key: _CB2.default.appKey
	    });

	    var url = _CB2.default.apiUrl + "/user/" + _CB2.default.appId + "/loginwithprovider";

	    _CB2.default._request('POST', url, params).then(function (response) {
	        var user = response;
	        if (response) {
	            try {
	                user = new _CB2.default.CloudUser();
	                _CB2.default.fromJSON(JSON.parse(response), user);
	                _CB2.default.CloudUser.current = user;
	                _CB2.default.CloudUser._setCurrentUser(user);
	            } catch (e) {}
	        }

	        if (callback) {
	            callback.success(user);
	        } else {
	            def.resolve(user);
	        }
	    }, function (err) {
	        if (callback) {
	            callback.error(err);
	        } else {
	            def.reject(err);
	        }
	    });

	    if (!callback) {
	        return def.promise;
	    }
	};

	_CB2.default.CloudUser.prototype.logOut = function (callback) {

	    if (_CB2.default._isNode) {
	        throw "Error : You cannot logOut the user on the server.";
	    }

	    var thisObj = this;
	    var def;
	    if (!callback) {
	        def = new _CB2.default.Promise();
	    }
	    //now call the logout API.
	    var params = JSON.stringify({
	        document: _CB2.default.toJSON(thisObj),
	        key: _CB2.default.appKey
	    });
	    var url = _CB2.default.apiUrl + "/user/" + _CB2.default.appId + "/logout";

	    _CB2.default._request('POST', url, params).then(function (response) {
	        _CB2.default.fromJSON(JSON.parse(response), thisObj);
	        _CB2.default.CloudUser.current = null;
	        if (callback) {
	            callback.success(thisObj);
	        } else {
	            def.resolve(thisObj);
	        }
	        _CB2.default.CloudUser._removeCurrentUser();
	    }, function (err) {
	        if (callback) {
	            callback.error(err);
	        } else {
	            def.reject(err);
	        }
	    });

	    if (!callback) {
	        return def.promise;
	    }
	};
	_CB2.default.CloudUser.prototype.addToRole = function (role, callback) {
	    if (!role) {
	        throw "Role is null";
	    }
	    var thisObj = this;
	    var def;
	    if (!callback) {
	        def = new _CB2.default.Promise();
	    }

	    //Call the addToRole API
	    var params = JSON.stringify({
	        user: _CB2.default.toJSON(thisObj),
	        role: _CB2.default.toJSON(role),
	        key: _CB2.default.appKey
	    });
	    var url = _CB2.default.apiUrl + "/user/" + _CB2.default.appId + "/addToRole";

	    _CB2.default._request('PUT', url, params).then(function (response) {
	        _CB2.default.fromJSON(JSON.parse(response), thisObj);
	        if (callback) {
	            callback.success(thisObj);
	        } else {
	            def.resolve(thisObj);
	        }
	    }, function (err) {
	        if (callback) {
	            callback.error(err);
	        } else {
	            def.reject(err);
	        }
	    });

	    if (!callback) {
	        return def.promise;
	    }
	};
	_CB2.default.CloudUser.prototype.isInRole = function (role) {
	    if (!role) {
	        throw "role is null";
	    }

	    var roleArray = this.get('roles');
	    var userRoleIds = [];

	    if (roleArray && roleArray.length > 0) {
	        for (var i = 0; i < roleArray.length; ++i) {
	            userRoleIds.push(roleArray[i].document._id);
	        }
	    }

	    return userRoleIds.indexOf(role.document._id) >= 0;
	};

	_CB2.default.CloudUser.prototype.removeFromRole = function (role, callback) {
	    if (!role) {
	        throw "Role is null";
	    }
	    var thisObj = this;
	    var def;
	    if (!callback) {
	        def = new _CB2.default.Promise();
	    }
	    //now call the removeFromRole API.
	    var params = JSON.stringify({
	        user: _CB2.default.toJSON(thisObj),
	        role: _CB2.default.toJSON(role),
	        key: _CB2.default.appKey
	    });
	    var url = _CB2.default.apiUrl + "/user/" + _CB2.default.appId + "/removeFromRole";

	    _CB2.default._request('PUT', url, params).then(function (response) {
	        _CB2.default.fromJSON(JSON.parse(response), thisObj);
	        if (callback) {
	            callback.success(thisObj);
	        } else {
	            def.resolve(thisObj);
	        }
	    }, function (err) {
	        if (callback) {
	            callback.error(err);
	        } else {
	            def.reject(err);
	        }
	    });

	    if (!callback) {
	        return def.promise;
	    }
	};

	exports.default = _CB2.default.CloudUser;

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _CB = __webpack_require__(1);

	var _CB2 = _interopRequireDefault(_CB);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/*
	 CloudCache
	 */

	var CloudCache = function () {
	    function CloudCache(cacheName) {
	        _classCallCheck(this, CloudCache);

	        if (typeof cacheName === 'undefined' || cacheName === null || cacheName === '') {
	            throw "Cannot create a cache with empty name";
	        }
	        this.document = {};
	        this.document._tableName = "cache";
	        this.document.name = cacheName;
	        this.document.size = "";
	        this.document.items = [];
	    }

	    _createClass(CloudCache, [{
	        key: 'set',
	        value: function set(key, value, callback) {
	            var def;
	            _CB2.default._validate();

	            if (!callback) {
	                def = new _CB2.default.Promise();
	            }

	            if (typeof value === 'undefined') {
	                throw "Value cannot be undefined.";
	            }

	            var params = JSON.stringify({
	                key: _CB2.default.appKey,
	                item: value
	            });

	            var url = _CB2.default.apiUrl + '/cache/' + _CB2.default.appId + '/' + this.document.name + '/' + key;
	            _CB2.default._request('PUT', url, params, true).then(function (response) {
	                if (_CB2.default._isJsonString(response)) {
	                    response = JSON.parse(response);
	                }

	                var obj = _CB2.default.fromJSON(response);
	                if (callback) {
	                    callback.success(obj);
	                } else {
	                    def.resolve(obj);
	                }
	            }, function (err) {
	                if (callback) {
	                    callback.error(err);
	                } else {
	                    def.reject(err);
	                }
	            });
	            if (!callback) {
	                return def.promise;
	            }
	        }
	    }, {
	        key: 'deleteItem',
	        value: function deleteItem(key, callback) {
	            var def;
	            _CB2.default._validate();

	            if (!callback) {
	                def = new _CB2.default.Promise();
	            }

	            var params = JSON.stringify({
	                key: _CB2.default.appKey,
	                method: "DELETE"
	            });

	            var url = _CB2.default.apiUrl + '/cache/' + _CB2.default.appId + '/' + this.document.name + '/item/' + key;
	            _CB2.default._request('PUT', url, params, true).then(function (response) {
	                if (_CB2.default._isJsonString(response)) {
	                    response = JSON.parse(response);
	                }

	                var obj = _CB2.default.fromJSON(response);
	                if (callback) {
	                    callback.success(obj);
	                } else {
	                    def.resolve(obj);
	                }
	            }, function (err) {
	                if (callback) {
	                    callback.error(err);
	                } else {
	                    def.reject(err);
	                }
	            });
	            if (!callback) {
	                return def.promise;
	            }
	        }
	    }, {
	        key: 'create',
	        value: function create(callback) {
	            var def;
	            _CB2.default._validate();

	            if (!callback) {
	                def = new _CB2.default.Promise();
	            }

	            var params = JSON.stringify({
	                key: _CB2.default.appKey
	            });

	            var thisObj = this;

	            var url = _CB2.default.apiUrl + '/cache/' + _CB2.default.appId + '/' + this.document.name + '/create';
	            _CB2.default._request('POST', url, params, true).then(function (response) {
	                if (_CB2.default._isJsonString(response)) {
	                    response = JSON.parse(response);
	                }
	                var obj = _CB2.default.fromJSON(response, thisObj);
	                if (callback) {
	                    callback.success(obj);
	                } else {
	                    def.resolve(obj);
	                }
	            }, function (err) {
	                if (callback) {
	                    callback.error(err);
	                } else {
	                    def.reject(err);
	                }
	            });
	            if (!callback) {
	                return def.promise;
	            }
	        }
	    }, {
	        key: 'get',
	        value: function get(key, callback) {

	            var def;
	            _CB2.default._validate();

	            if (!callback) {
	                def = new _CB2.default.Promise();
	            }

	            var params = JSON.stringify({
	                key: _CB2.default.appKey
	            });

	            var url = _CB2.default.apiUrl + '/cache/' + _CB2.default.appId + '/' + this.document.name + '/' + key + '/item';
	            _CB2.default._request('POST', url, params, true).then(function (response) {
	                if (_CB2.default._isJsonString(response)) {
	                    response = JSON.parse(response);
	                }
	                var obj = _CB2.default.fromJSON(response);
	                if (callback) {
	                    callback.success(obj);
	                } else {
	                    def.resolve(obj);
	                }
	            }, function (err) {
	                if (callback) {
	                    callback.error(err);
	                } else {
	                    def.reject(err);
	                }
	            });
	            if (!callback) {
	                return def.promise;
	            }
	        }
	    }, {
	        key: 'getInfo',
	        value: function getInfo(callback) {
	            var def;
	            _CB2.default._validate();

	            if (!callback) {
	                def = new _CB2.default.Promise();
	            }

	            var params = JSON.stringify({
	                key: _CB2.default.appKey
	            });

	            var thisObj = this;

	            var url = _CB2.default.apiUrl + '/cache/' + _CB2.default.appId + '/' + this.document.name;
	            _CB2.default._request('POST', url, params, true).then(function (response) {
	                if (_CB2.default._isJsonString(response)) {
	                    response = JSON.parse(response);
	                }
	                var obj = _CB2.default.fromJSON(response, thisObj);
	                if (callback) {
	                    callback.success(obj);
	                } else {
	                    def.resolve(obj);
	                }
	            }, function (err) {
	                if (callback) {
	                    callback.error(err);
	                } else {
	                    def.reject(err);
	                }
	            });
	            if (!callback) {
	                return def.promise;
	            }
	        }
	    }, {
	        key: 'getItemsCount',
	        value: function getItemsCount(callback) {
	            var def;
	            _CB2.default._validate();

	            if (!callback) {
	                def = new _CB2.default.Promise();
	            }

	            var params = JSON.stringify({
	                key: _CB2.default.appKey
	            });

	            var url = _CB2.default.apiUrl + '/cache/' + _CB2.default.appId + '/' + this.document.name + '/items/count';
	            _CB2.default._request('POST', url, params, true).then(function (response) {
	                if (_CB2.default._isJsonString(response)) {
	                    response = JSON.parse(response);
	                }
	                var obj = _CB2.default.fromJSON(response);
	                if (callback) {
	                    callback.success(obj);
	                } else {
	                    def.resolve(obj);
	                }
	            }, function (err) {
	                if (callback) {
	                    callback.error(err);
	                } else {
	                    def.reject(err);
	                }
	            });
	            if (!callback) {
	                return def.promise;
	            }
	        }
	    }, {
	        key: 'getAll',
	        value: function getAll(callback) {
	            var def;
	            _CB2.default._validate();

	            if (!callback) {
	                def = new _CB2.default.Promise();
	            }

	            var thisObj = this;

	            var params = JSON.stringify({
	                key: _CB2.default.appKey
	            });
	            var url = _CB2.default.apiUrl + '/cache/' + _CB2.default.appId + '/' + this.document.name + '/items';
	            _CB2.default._request('POST', url, params, true).then(function (response) {
	                if (_CB2.default._isJsonString(response)) {
	                    response = JSON.parse(response);
	                }
	                var obj = _CB2.default.fromJSON(response);

	                thisObj.document.items = obj;

	                if (callback) {
	                    callback.success(obj);
	                } else {
	                    def.resolve(obj);
	                }
	            }, function (err) {
	                if (callback) {
	                    callback.error(err);
	                } else {
	                    def.reject(err);
	                }
	            });
	            if (!callback) {
	                return def.promise;
	            }
	        }
	    }, {
	        key: 'clear',
	        value: function clear(callback) {
	            var def;
	            _CB2.default._validate();

	            if (!callback) {
	                def = new _CB2.default.Promise();
	            }

	            var params = JSON.stringify({
	                key: _CB2.default.appKey,
	                method: "DELETE"
	            });

	            var thisObj = this;

	            var url = _CB2.default.apiUrl + '/cache/' + _CB2.default.appId + '/' + this.document.name + '/clear/items';
	            _CB2.default._request('PUT', url, params, true).then(function (response) {
	                if (_CB2.default._isJsonString(response)) {
	                    response = JSON.parse(response);
	                }
	                var obj = _CB2.default.fromJSON(response, thisObj);
	                if (callback) {
	                    callback.success(obj);
	                } else {
	                    def.resolve(obj);
	                }
	            }, function (err) {
	                if (callback) {
	                    callback.error(err);
	                } else {
	                    def.reject(err);
	                }
	            });
	            if (!callback) {
	                return def.promise;
	            }
	        }
	    }, {
	        key: 'delete',
	        value: function _delete(callback) {
	            var def;
	            _CB2.default._validate();

	            if (!callback) {
	                def = new _CB2.default.Promise();
	            }

	            var params = JSON.stringify({
	                key: _CB2.default.appKey,
	                method: "DELETE"
	            });

	            var thisObj = this;

	            var url = _CB2.default.apiUrl + '/cache/' + _CB2.default.appId + '/' + this.document.name;
	            _CB2.default._request('PUT', url, params, true).then(function (response) {
	                if (_CB2.default._isJsonString(response)) {
	                    response = JSON.parse(response);
	                }
	                var obj = _CB2.default.fromJSON(response, thisObj);
	                if (callback) {
	                    callback.success(obj);
	                } else {
	                    def.resolve(obj);
	                }
	            }, function (err) {
	                if (callback) {
	                    callback.error(err);
	                } else {
	                    def.reject(err);
	                }
	            });
	            if (!callback) {
	                return def.promise;
	            }
	        }
	    }]);

	    return CloudCache;
	}();

	CloudCache.getAll = function (callback) {
	    var def;
	    _CB2.default._validate();

	    if (!callback) {
	        def = new _CB2.default.Promise();
	    }

	    var params = JSON.stringify({
	        key: _CB2.default.appKey
	    });

	    var url = _CB2.default.apiUrl + '/cache/' + _CB2.default.appId;
	    _CB2.default._request('POST', url, params, true).then(function (response) {
	        if (_CB2.default._isJsonString(response)) {
	            response = JSON.parse(response);
	        }
	        var obj = _CB2.default.fromJSON(response);
	        if (callback) {
	            callback.success(obj);
	        } else {
	            def.resolve(obj);
	        }
	    }, function (err) {
	        if (callback) {
	            callback.error(err);
	        } else {
	            def.reject(err);
	        }
	    });
	    if (!callback) {
	        return def.promise;
	    }
	};

	CloudCache.deleteAll = function (callback) {
	    var def;
	    _CB2.default._validate();

	    if (!callback) {
	        def = new _CB2.default.Promise();
	    }

	    var params = JSON.stringify({
	        key: _CB2.default.appKey,
	        method: "DELETE"
	    });

	    var url = _CB2.default.apiUrl + '/cache/' + _CB2.default.appId;
	    _CB2.default._request('PUT', url, params, true).then(function (response) {
	        if (_CB2.default._isJsonString(response)) {
	            response = JSON.parse(response);
	        }
	        var obj = _CB2.default.fromJSON(response);
	        if (callback) {
	            callback.success(obj);
	        } else {
	            def.resolve(obj);
	        }
	    }, function (err) {
	        if (callback) {
	            callback.error(err);
	        } else {
	            def.reject(err);
	        }
	    });
	    if (!callback) {
	        return def.promise;
	    }
	};

	Object.defineProperty(CloudCache.prototype, 'name', {
	    get: function get() {
	        return this.document.name;
	    }
	});

	Object.defineProperty(CloudCache.prototype, 'size', {
	    get: function get() {
	        return this.document.size;
	    }
	});

	Object.defineProperty(CloudCache.prototype, 'items', {
	    get: function get() {
	        return this.document.items;
	    }
	});

	_CB2.default.CloudCache = CloudCache;

	exports.default = _CB2.default.CloudCache;

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _CB = __webpack_require__(1);

	var _CB2 = _interopRequireDefault(_CB);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/* CloudNotificiation */

	_CB2.default.CloudNotification = _CB2.default.CloudNotification || {};

	_CB2.default.CloudNotification.on = function (channelName, callback, done) {

	    if (_CB2.default._isRealtimeDisabled) {
	        throw "Realtime is disbaled for this app.";
	    }

	    _CB2.default._validate();

	    var def;

	    if (!done) {
	        def = new _CB2.default.Promise();
	    }

	    _CB2.default.Socket.emit('join-custom-channel', _CB2.default.appId + channelName);
	    _CB2.default.Socket.on(_CB2.default.appId + channelName, function (data) {
	        //listen to events in custom channel.
	        callback(data);
	    });

	    if (done && done.success) done.success();else def.resolve();

	    if (!done) {
	        return def.promise;
	    }
	};

	_CB2.default.CloudNotification.off = function (channelName, done) {

	    if (_CB2.default._isRealtimeDisabled) {
	        throw "Realtime is disbaled for this app.";
	    }

	    _CB2.default._validate();

	    var def;

	    if (!done) {
	        def = new _CB2.default.Promise();
	    }

	    _CB2.default.Socket.emit('leave-custom-channel', _CB2.default.appId + channelName);
	    _CB2.default.Socket.removeAllListeners(_CB2.default.appId + channelName);
	    if (done && done.success) done.success();else def.resolve();

	    if (!done) {
	        return def.promise;
	    }
	};

	_CB2.default.CloudNotification.publish = function (channelName, data, done) {

	    if (_CB2.default._isRealtimeDisabled) {
	        throw "Realtime is disbaled for this app.";
	    }

	    _CB2.default._validate();

	    var def;

	    if (!done) {
	        def = new _CB2.default.Promise();
	    }

	    _CB2.default.Socket.emit('publish-custom-channel', { channel: _CB2.default.appId + channelName, data: data });
	    if (done && done.success) done.success();else def.resolve();

	    if (!done) {
	        return def.promise;
	    }
	};

	exports.default = _CB2.default.CloudNotification;

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _CB = __webpack_require__(1);

	var _CB2 = _interopRequireDefault(_CB);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/*CloudBoost Push Notifications*/

	_CB2.default.CloudPush = {};

	_CB2.default.CloudPush.send = function (data, query, callback) {

	    var tableName = "Device";

	    if (!_CB2.default.appId) {
	        throw "CB.appId is null.";
	    }
	    var def;
	    if (!callback) {
	        def = new _CB2.default.Promise();
	    }

	    if (!data) {
	        throw "data object is null.";
	    }
	    if (data && !data.message) {
	        throw "message is not set.";
	    }

	    //Query Set
	    if (query && Object.prototype.toString.call(query) == "[object Object]" && typeof query.success !== 'function') {
	        var pushQuery = query;
	    }
	    //Channels List
	    if (query && Object.prototype.toString.call(query) == "[object Array]" && typeof query.success !== 'function') {
	        var pushQuery = new _CB2.default.CloudQuery(tableName);
	        pushQuery.containedIn('channels', query);
	    }
	    //Single Channel    
	    if (query && Object.prototype.toString.call(query) == "[object String]" && typeof query.success !== 'function') {
	        var pushQuery = new _CB2.default.CloudQuery(tableName);
	        pushQuery.containedIn('channels', [query]);
	    }
	    //when query param is callback
	    if (query && Object.prototype.toString.call(query) == "[object Object]" && typeof query.success === 'function') {
	        callback = query;
	        var pushQuery = new _CB2.default.CloudQuery(tableName);
	    }
	    //No query param
	    if (!query) {
	        var pushQuery = new _CB2.default.CloudQuery(tableName);
	    }

	    var params = JSON.stringify({
	        query: pushQuery.query,
	        sort: pushQuery.sort,
	        limit: pushQuery.limit,
	        skip: pushQuery.skip,
	        key: _CB2.default.appKey,
	        data: data
	    });

	    var url = _CB2.default.apiUrl + "/push/" + _CB2.default.appId + '/send';

	    _CB2.default._request('POST', url, params).then(function (response) {
	        var object = response;
	        if (_CB2.default._isJsonString(response)) {
	            object = JSON.parse(response);
	        }

	        if (callback) {
	            callback.success(object);
	        } else {
	            def.resolve(object);
	        }
	    }, function (err) {

	        if (_CB2.default._isJsonString(err)) {
	            err = JSON.parse(err);
	        }

	        if (callback) {
	            callback.error(err);
	        } else {
	            def.reject(err);
	        }
	    });

	    if (!callback) {
	        return def.promise;
	    }
	};

	_CB2.default.CloudPush.enableWebNotifications = function (callback) {

	    var def;
	    if (!callback) {
	        def = new _CB2.default.Promise();
	    }

	    //Check document
	    if (typeof document !== 'undefined') {

	        _CB2.default.CloudPush._requestBrowserNotifications().then(function (response) {

	            if ('serviceWorker' in navigator) {
	                return navigator.serviceWorker.register('serviceWorker.js', { scope: './' });
	            } else {
	                var noServerDef = new _CB2.default.Promise();
	                noServerDef.reject('Service workers aren\'t supported in this browser.');
	                return noServerDef;
	            }
	        }).then(function (registration) {

	            if (!registration.showNotification) {
	                var noServerDef = new _CB2.default.Promise();
	                noServerDef.reject('Notifications aren\'t supported on service workers.');
	                return noServerDef;
	            } else {
	                return _CB2.default.CloudPush._subscribe();
	            }
	        }).then(function (subscription) {

	            //PublicKey for secure connection with server
	            var browserKey = subscription.getKey ? subscription.getKey('p256dh') : '';
	            browserKey = browserKey ? btoa(String.fromCharCode.apply(null, new Uint8Array(browserKey))) : '';

	            //AuthKey for secure connection with server
	            var authKey = subscription.getKey ? subscription.getKey('auth') : '';
	            authKey = authKey ? btoa(String.fromCharCode.apply(null, new Uint8Array(authKey))) : '';

	            _CB2.default.CloudPush._addDevice(_CB2.default._getThisBrowserName(), subscription.endpoint, browserKey, authKey, {
	                success: function success(obj) {
	                    if (callback) {
	                        callback.success();
	                    } else {
	                        def.resolve();
	                    }
	                }, error: function error(_error) {
	                    if (callback) {
	                        callback.error(_error);
	                    } else {
	                        def.reject(_error);
	                    }
	                }
	            });
	        }, function (error) {
	            if (callback) {
	                callback.error(error);
	            } else {
	                def.reject(error);
	            }
	        });
	    } else {
	        if (callback) {
	            callback.error("Browser document not found");
	        } else {
	            def.reject("Browser document not found");
	        }
	    }

	    if (!callback) {
	        return def.promise;
	    }
	};

	_CB2.default.CloudPush.disableWebNotifications = function (callback) {

	    var def;
	    if (!callback) {
	        def = new _CB2.default.Promise();
	    }

	    //Check document
	    if (typeof document !== 'undefined') {

	        _CB2.default.CloudPush._getSubscription().then(function (subscription) {

	            //No subscription 
	            if (!subscription) {
	                if (callback) {
	                    callback.success();
	                } else {
	                    def.resolve();
	                }
	            }

	            if (subscription) {
	                var promises = [];

	                //We have a subcription, so call unsubscribe on it
	                promises.push(subscription.unsubscribe());
	                //Remove Device Objects
	                promises.push(_CB2.default.CloudPush._deleteDevice(_CB2.default._getThisBrowserName(), subscription.endpoint));

	                _CB2.default.Promise.all(promises).then(function (successful) {
	                    if (callback) {
	                        callback.success();
	                    } else {
	                        def.resolve();
	                    }
	                }, function (error) {
	                    if (callback) {
	                        callback.error(error);
	                    } else {
	                        def.reject(error);
	                    }
	                });
	            }
	        }, function (error) {
	            if (callback) {
	                callback.error(error);
	            } else {
	                def.reject(error);
	            }
	        });
	    } else {
	        if (callback) {
	            callback.error("Browser document not found");
	        } else {
	            def.reject("Browser document not found");
	        }
	    }

	    if (!callback) {
	        return def.promise;
	    }
	};

	_CB2.default.CloudPush._subscribe = function () {

	    var def = new _CB2.default.Promise();

	    // Check if push messaging is supported  
	    if (!('PushManager' in window)) {
	        return def.reject('Push messaging isn\'t supported.');
	    }

	    navigator.serviceWorker.ready.then(function (reg) {

	        reg.pushManager.getSubscription().then(function (subscription) {

	            if (!subscription) {
	                reg.pushManager.subscribe({ userVisibleOnly: true }).then(function (subscription) {
	                    def.resolve(subscription);
	                }).catch(function (err) {
	                    def.reject(err);
	                });
	            } else {
	                def.resolve(subscription);
	            }
	        }).catch(function (err) {
	            def.reject(err);
	        });
	    }, function (error) {
	        def.reject(error);
	    });

	    return def.promise;
	};

	_CB2.default.CloudPush._getSubscription = function () {

	    var def = new _CB2.default.Promise();

	    navigator.serviceWorker.ready.then(function (reg) {

	        reg.pushManager.getSubscription().then(function (subscription) {

	            if (!subscription) {
	                def.resolve(null);
	            } else {
	                def.resolve(subscription);
	            }
	        }).catch(function (err) {
	            def.reject(err);
	        });
	    }, function (error) {
	        def.reject(error);
	    });

	    return def.promise;
	};

	_CB2.default.CloudPush._requestBrowserNotifications = function () {

	    var def = new _CB2.default.Promise();

	    if (!("Notification" in window)) {
	        def.reject("This browser does not support system notifications");
	    } else if (Notification.permission === "granted") {

	        def.resolve("Permission granted");
	    } else if (Notification.permission !== 'denied') {

	        Notification.requestPermission(function (permission) {

	            if (permission === "granted") {
	                def.resolve("Permission granted");
	            }

	            if (permission === "denied") {
	                def.reject("Permission denied");
	            }
	        });
	    }

	    return def.promise;
	};

	//save the device document to the db
	_CB2.default.CloudPush._addDevice = function (deviceOS, endPoint, browserKey, authKey, callback) {

	    var def;
	    _CB2.default._validate();

	    //Set Fields
	    var thisObj = new _CB2.default.CloudObject('Device');
	    thisObj.set('deviceOS', deviceOS);
	    thisObj.set('deviceToken', endPoint);
	    thisObj.set('metadata', { browserKey: browserKey, authKey: authKey });

	    if (!callback) {
	        def = new _CB2.default.Promise();
	    }

	    var xmlhttp = _CB2.default._loadXml();
	    var params = JSON.stringify({
	        document: _CB2.default.toJSON(thisObj),
	        key: _CB2.default.appKey
	    });

	    var url = _CB2.default.apiUrl + "/push/" + _CB2.default.appId;
	    _CB2.default._request('PUT', url, params).then(function (response) {
	        thisObj = _CB2.default.fromJSON(JSON.parse(response), thisObj);
	        if (callback) {
	            callback.success(thisObj);
	        } else {
	            def.resolve(thisObj);
	        }
	    }, function (err) {
	        if (callback) {
	            callback.error(err);
	        } else {
	            def.reject(err);
	        }
	    });

	    if (!callback) {
	        return def.promise;
	    }
	};

	_CB2.default.CloudPush._deleteDevice = function (deviceOS, endPoint, callback) {
	    //delete an object matching the objectId
	    if (!_CB2.default.appId) {
	        throw "CB.appId is null.";
	    }

	    var def;
	    if (!callback) {
	        def = new _CB2.default.Promise();
	    }

	    var data = {
	        deviceOS: deviceOS,
	        deviceToken: endPoint
	    };

	    var params = JSON.stringify({
	        key: _CB2.default.appKey,
	        document: data,
	        method: "DELETE"
	    });

	    var url = _CB2.default.apiUrl + "/push/" + _CB2.default.appId;

	    _CB2.default._request('PUT', url, params).then(function (response) {
	        if (callback) {
	            callback.success(response);
	        } else {
	            def.resolve(response);
	        }
	    }, function (err) {
	        if (callback) {
	            callback.error(err);
	        } else {
	            def.reject(err);
	        }
	    });

	    if (!callback) {
	        return def.promise;
	    }
	};

	exports.default = _CB2.default.CloudPush;

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _CB = __webpack_require__(1);

	var _CB2 = _interopRequireDefault(_CB);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/*
	 CloudQuery
	 */

	var CloudQuery = function () {
	    function CloudQuery(tableName) {
	        _classCallCheck(this, CloudQuery);

	        //constructor for the class CloudQuery
	        if (!tableName) throw "Table Name cannot be null";

	        this.tableName = tableName;
	        this.query = {};
	        this.query.$include = [];
	        this.query.$includeList = [];
	        this.select = {};
	        this.sort = {};
	        this.skip = 0;
	        this.limit = 10; //default limit is 10
	    }

	    _createClass(CloudQuery, [{
	        key: "search",
	        value: function search(_search, language, caseSensitive, diacriticSensitive) {

	            //Validations
	            if (typeof _search !== "string") {
	                throw "First parameter is required and it should be a string.";
	            }

	            if (language !== null && typeof language !== "undefined" && typeof language !== "string") {
	                throw "Second parameter should be a string.";
	            }

	            if (caseSensitive !== null && typeof caseSensitive !== "undefined" && typeof caseSensitive !== "boolean") {
	                throw "Third parameter should be a boolean.";
	            }

	            if (diacriticSensitive !== null && typeof diacriticSensitive !== "undefined" && typeof diacriticSensitive !== "boolean") {
	                throw "Fourth parameter should be a boolean.";
	            }

	            //Set the fields
	            this.query["$text"] = {};
	            if (typeof _search === "string") {
	                this.query["$text"]["$search"] = _search;
	            }

	            if (language !== null && typeof language !== "undefined" && typeof language === "string") {
	                this.query["$text"]["$language"] = language;
	            }

	            if (caseSensitive !== null && typeof caseSensitive !== "undefined" && typeof caseSensitive === "boolean") {
	                this.query["$text"]["$caseSensitive"] = caseSensitive;
	            }

	            if (diacriticSensitive !== null && typeof diacriticSensitive !== "undefined" && typeof diacriticSensitive === "boolean") {
	                this.query["$text"]["$diacriticSensitive"] = diacriticSensitive;
	            }

	            return this;
	        }
	    }, {
	        key: "equalTo",
	        value: function equalTo(columnName, data) {

	            if (columnName === 'id') columnName = '_' + columnName;

	            if (data !== null) {
	                if (data.constructor === _CB2.default.CloudObject) {
	                    columnName = columnName + '._id';
	                    data = data.get('id');
	                }

	                this.query[columnName] = data;
	            } else {

	                //This is for people who code : obj.equalTo('column', null);
	                this.doesNotExists(columnName);
	            }

	            return this;
	        }
	    }, {
	        key: "includeList",
	        value: function includeList(columnName) {
	            if (columnName === 'id') columnName = '_' + columnName;

	            this.query.$includeList.push(columnName);

	            return this;
	        }
	    }, {
	        key: "include",
	        value: function include(columnName) {
	            if (columnName === 'id') columnName = '_' + columnName;

	            this.query.$include.push(columnName);

	            return this;
	        }
	    }, {
	        key: "all",
	        value: function all(columnName) {
	            if (columnName === 'id') columnName = '_' + columnName;

	            this.query.$all = columnName;

	            return this;
	        }
	    }, {
	        key: "any",
	        value: function any(columnName) {
	            if (columnName === 'id') columnName = '_' + columnName;

	            this.query.$any = columnName;

	            return this;
	        }
	    }, {
	        key: "first",
	        value: function first(columnName) {
	            if (columnName === 'id') columnName = '_' + columnName;

	            this.query.$first = columnName;

	            return this;
	        }
	    }, {
	        key: "notEqualTo",
	        value: function notEqualTo(columnName, data) {
	            if (columnName === 'id') columnName = '_' + columnName;

	            if (data !== null) {

	                if (data.constructor === _CB2.default.CloudObject) {
	                    columnName = columnName + '._id';
	                    data = data.get('id');
	                }

	                this.query[columnName] = {
	                    $ne: data
	                };
	            } else {
	                //This is for people who code : obj.notEqualTo('column', null);
	                this.exists(columnName);
	            }

	            return this;
	        }
	    }, {
	        key: "greaterThan",
	        value: function greaterThan(columnName, data) {

	            if (columnName === 'id') columnName = '_' + columnName;

	            if (!this.query[columnName]) {
	                this.query[columnName] = {};
	            }
	            this.query[columnName]["$gt"] = data;

	            return this;
	        }
	    }, {
	        key: "greaterThanEqualTo",
	        value: function greaterThanEqualTo(columnName, data) {

	            if (columnName === 'id') columnName = '_' + columnName;

	            if (!this.query[columnName]) {
	                this.query[columnName] = {};
	            }
	            this.query[columnName]["$gte"] = data;

	            return this;
	        }
	    }, {
	        key: "lessThan",
	        value: function lessThan(columnName, data) {

	            if (columnName === 'id') columnName = '_' + columnName;

	            if (!this.query[columnName]) {
	                this.query[columnName] = {};
	            }
	            this.query[columnName]["$lt"] = data;

	            return this;
	        }
	    }, {
	        key: "lessThanEqualTo",
	        value: function lessThanEqualTo(columnName, data) {

	            if (columnName === 'id') columnName = '_' + columnName;

	            if (!this.query[columnName]) {
	                this.query[columnName] = {};
	            }
	            this.query[columnName]["$lte"] = data;

	            return this;
	        }
	    }, {
	        key: "orderByAsc",


	        //Sorting
	        value: function orderByAsc(columnName) {

	            if (columnName === 'id') columnName = '_' + columnName;

	            this.sort[columnName] = 1;

	            return this;
	        }
	    }, {
	        key: "orderByDesc",
	        value: function orderByDesc(columnName) {

	            if (columnName === 'id') columnName = '_' + columnName;

	            this.sort[columnName] = -1;

	            return this;
	        }
	    }, {
	        key: "setLimit",


	        //Limit and skip
	        value: function setLimit(data) {

	            this.limit = data;
	            return this;
	        }
	    }, {
	        key: "setSkip",
	        value: function setSkip(data) {
	            this.skip = data;
	            return this;
	        }
	    }, {
	        key: "paginate",
	        value: function paginate(pageNo, totalItemsInPage, callback) {

	            if (!_CB2.default.appId) {
	                throw "CB.appId is null.";
	            }
	            if (!this.tableName) {
	                throw "TableName is null.";
	            }
	            var def;
	            var callback;
	            if ((typeof callback === "undefined" ? "undefined" : _typeof(callback)) === 'object' && typeof callback.success === 'function') {
	                callback = callback;
	            }
	            if (!callback) {
	                def = new _CB2.default.Promise();
	            }

	            if (pageNo && (typeof pageNo === "undefined" ? "undefined" : _typeof(pageNo)) === 'object' && typeof pageNo.success === 'function') {
	                callback = pageNo;
	                pageNo = null;
	            }
	            if (totalItemsInPage && (typeof totalItemsInPage === "undefined" ? "undefined" : _typeof(totalItemsInPage)) === 'object' && typeof totalItemsInPage.success === 'function') {
	                callback = totalItemsInPage;
	                totalItemsInPage = null;
	            }

	            if (pageNo && typeof pageNo === 'number' && pageNo > 0) {
	                if (typeof totalItemsInPage === 'number' && totalItemsInPage > 0) {
	                    var skip = pageNo * totalItemsInPage - totalItemsInPage;
	                    this.setSkip(skip);
	                    this.setLimit(totalItemsInPage);
	                }
	            }

	            if (totalItemsInPage && typeof totalItemsInPage === 'number' && totalItemsInPage > 0) {
	                this.setLimit(totalItemsInPage);
	            }
	            var thisObj = this;

	            var promises = [];
	            promises.push(this.find());

	            var countQuery = Object.create(this);
	            countQuery.setSkip(0);
	            countQuery.setLimit(99999999);

	            promises.push(countQuery.count());

	            _CB2.default.Promise.all(promises).then(function (list) {
	                var objectsList = null;
	                var count = null;
	                var totalPages = 0;

	                if (list && list.length > 0) {
	                    objectsList = list[0];
	                    count = list[1];
	                    if (!count) {
	                        count = 0;
	                        totalPages = 0;
	                    } else {
	                        totalPages = Math.ceil(count / thisObj.limit);
	                    }
	                    if (totalPages && totalPages < 0) {
	                        totalPages = 0;
	                    }
	                }
	                if (callback) {
	                    callback.success(objectsList, count, totalPages);
	                } else {
	                    def.resolve(objectsList, count, totalPages);
	                }
	            }, function (error) {
	                if (callback) {
	                    callback.error(error);
	                } else {
	                    def.reject(error);
	                }
	            });

	            if (!callback) {
	                return def.promise;
	            }
	        }
	    }, {
	        key: "selectColumn",


	        //select/deselect columns to show
	        value: function selectColumn(columnNames) {

	            if (Object.keys(this.select).length === 0) {
	                this.select = {
	                    _id: 1,
	                    createdAt: 1,
	                    updatedAt: 1,
	                    ACL: 1,
	                    _type: 1,
	                    _tableName: 1
	                };
	            }

	            if (Object.prototype.toString.call(columnNames) === '[object Object]') {
	                this.select = columnNames;
	            } else if (Object.prototype.toString.call(columnNames) === '[object Array]') {
	                for (var i = 0; i < columnNames.length; i++) {
	                    this.select[columnNames[i]] = 1;
	                }
	            } else {
	                this.select[columnNames] = 1;
	            }

	            return this;
	        }
	    }, {
	        key: "doNotSelectColumn",
	        value: function doNotSelectColumn(columnNames) {
	            if (Object.prototype.toString.call(columnNames) === '[object Object]') {
	                this.select = columnNames;
	            } else if (Object.prototype.toString.call(columnNames) === '[object Array]') {
	                for (var i = 0; i < columnNames.length; i++) {
	                    this.select[columnNames[i]] = 0;
	                }
	            } else {
	                this.select[columnNames] = 0;
	            }

	            return this;
	        }
	    }, {
	        key: "containedIn",
	        value: function containedIn(columnName, data) {

	            var isCloudObject = false;

	            var CbData = [];
	            if (columnName === 'id') columnName = '_' + columnName;

	            if (Object.prototype.toString.call(data) === '[object Object]' && !data instanceof _CB2.default.CloudObject) {
	                //if object is passed as an argument
	                throw 'Array / value / CloudObject expected as an argument';
	            }

	            if (Object.prototype.toString.call(data) === '[object Array]') {
	                //if array is passed, then replace the whole

	                for (var i = 0; i < data.length; i++) {
	                    if (data[i] instanceof _CB2.default.CloudObject) {
	                        isCloudObject = true;
	                        if (!data[i].id) {
	                            throw "CloudObject passed should be saved and should have an id before being passed to containedIn";
	                        }
	                        CbData.push(data[i].id);
	                    }
	                }
	                if (CbData.length === 0) {
	                    CbData = data;
	                }

	                if (isCloudObject) {
	                    columnName = columnName + '._id';
	                }

	                if (!this.query[columnName]) {
	                    this.query[columnName] = {};
	                }

	                this.query[columnName]["$in"] = CbData;
	                var thisObj = this;
	                if (typeof this.query[columnName]["$nin"] !== 'undefined') {
	                    //for removing dublicates
	                    CbData.forEach(function (val) {
	                        if ((index = thisObj.query[columnName]["$nin"].indexOf(val)) >= 0) {
	                            thisObj.query[columnName]["$nin"].splice(index, 1);
	                        }
	                    });
	                }
	            } else {
	                //if the argument is a string then push if it is not present already


	                if (data instanceof _CB2.default.CloudObject) {

	                    if (!data.id) {
	                        throw "CloudObject passed should be saved and should have an id before being passed to containedIn";
	                    }

	                    columnName = columnName + '._id';
	                    CbData = data.id;
	                } else CbData = data;

	                if (!this.query[columnName]) {
	                    this.query[columnName] = {};
	                }

	                if (!this.query[columnName]["$in"]) {
	                    this.query[columnName]["$in"] = [];
	                }
	                if (this.query[columnName]["$in"].indexOf(CbData) === -1) {
	                    this.query[columnName]["$in"].push(CbData);
	                }
	                if (typeof this.query[columnName]["$nin"] !== 'undefined') {
	                    if ((index = this.query[columnName]["$nin"].indexOf(CbData)) >= 0) {
	                        this.query[columnName]["$nin"].splice(index, 1);
	                    }
	                }
	            }

	            return this;
	        }
	    }, {
	        key: "notContainedIn",
	        value: function notContainedIn(columnName, data) {

	            var isCloudObject = false;

	            var CbData = [];
	            if (columnName === 'id') columnName = '_' + columnName;

	            if (Object.prototype.toString.call(data) === '[object Object]' && !data instanceof _CB2.default.CloudObject) {
	                //if object is passed as an argument
	                throw 'Array or string expected as an argument';
	            }

	            if (Object.prototype.toString.call(data) === '[object Array]') {
	                //if array is passed, then replace the whole

	                for (var i = 0; i < data.length; i++) {
	                    if (data[i] instanceof _CB2.default.CloudObject) {
	                        isCloudObject = true;
	                        if (!data[i].id) {
	                            throw "CloudObject passed should be saved and should have an id before being passed to notContainedIn";
	                        }

	                        CbData.push(data[i].id);
	                    }
	                }
	                if (CbData.length === 0) {
	                    CbData = data;
	                }

	                if (isCloudObject) {
	                    columnName = columnName + '._id';
	                }

	                if (!this.query[columnName]) {
	                    this.query[columnName] = {};
	                }

	                this.query[columnName]["$nin"] = CbData;
	                if (typeof this.query[columnName]["$in"] !== 'undefined') {
	                    //for removing duplicates
	                    thisObj = this;
	                    CbData.forEach(function (val) {
	                        if ((index = thisObj.query[columnName]["$in"].indexOf(val)) >= 0) {
	                            thisObj.query[columnName]["$in"].splice(index, 1);
	                        }
	                    });
	                }
	            } else {
	                //if the argument is a string then push if it is not present already

	                if (data instanceof _CB2.default.CloudObject) {

	                    if (!data.id) {
	                        throw "CloudObject passed should be saved and should have an id before being passed to notContainedIn";
	                    }

	                    columnName = columnName + '._id';
	                    CbData = data.id;
	                } else CbData = data;

	                if (!this.query[columnName]) {
	                    this.query[columnName] = {};
	                }

	                if (!this.query[columnName]["$nin"]) {
	                    this.query[columnName]["$nin"] = [];
	                }
	                if (this.query[columnName]["$nin"].indexOf(CbData) === -1) {
	                    this.query[columnName]["$nin"].push(CbData);
	                }
	                if (typeof this.query[columnName]["$in"] !== 'undefined') {
	                    if ((index = this.query[columnName]["$in"].indexOf(CbData)) >= 0) {
	                        this.query[columnName]["$in"].splice(index, 1);
	                    }
	                }
	            }

	            return this;
	        }
	    }, {
	        key: "exists",
	        value: function exists(columnName) {
	            if (columnName === 'id') columnName = '_' + columnName;

	            if (!this.query[columnName]) {
	                this.query[columnName] = {};
	            }
	            this.query[columnName]["$exists"] = true;

	            return this;
	        }
	    }, {
	        key: "doesNotExists",
	        value: function doesNotExists(columnName) {
	            if (columnName === 'id') columnName = '_' + columnName;

	            if (!this.query[columnName]) {
	                this.query[columnName] = {};
	            }
	            this.query[columnName]["$exists"] = false;

	            return this;
	        }
	    }, {
	        key: "containsAll",
	        value: function containsAll(columnName, data) {

	            var isCloudObject = false;

	            var CbData = [];

	            if (columnName === 'id') columnName = '_' + columnName;

	            if (Object.prototype.toString.call(data) === '[object Object]' && !data instanceof _CB2.default.CloudObject) {
	                //if object is passed as an argument
	                throw 'Array or string expected as an argument';
	            }

	            if (Object.prototype.toString.call(data) === '[object Array]') {
	                //if array is passed, then replace the whole


	                for (var i = 0; i < data.length; i++) {
	                    if (data[i] instanceof _CB2.default.CloudObject) {

	                        isCloudObject = true;

	                        if (!data[i].id) {
	                            throw "CloudObject passed should be saved and should have an id before being passed to containsAll";
	                        }

	                        CbData.push(data[i].id);
	                    }
	                }

	                if (CbData.length === 0) {
	                    CbData = data;
	                }

	                if (isCloudObject) {
	                    columnName = columnName + '._id';
	                }

	                if (!this.query[columnName]) {
	                    this.query[columnName] = {};
	                }

	                this.query[columnName]["$all"] = CbData;
	            } else {
	                //if the argument is a string then push if it is not present already

	                if (data instanceof _CB2.default.CloudObject) {

	                    if (!data.id) {
	                        throw "CloudObject passed should be saved and should have an id before being passed to containsAll";
	                    }

	                    columnName = columnName + '._id';
	                    CbData = data.id;
	                } else CbData = data;

	                if (!this.query[columnName]) {
	                    this.query[columnName] = {};
	                }

	                if (!this.query[columnName]["$all"]) {
	                    this.query[columnName]["$all"] = [];
	                }
	                if (this.query[columnName]["$all"].indexOf(CbData) === -1) {
	                    this.query[columnName]["$all"].push(CbData);
	                }
	            }

	            return this;
	        }
	    }, {
	        key: "startsWith",
	        value: function startsWith(columnName, value) {
	            if (columnName === 'id') columnName = '_' + columnName;

	            var regex = '^' + value;
	            if (!this.query[columnName]) {
	                this.query[columnName] = {};
	            }

	            this.query[columnName]["$regex"] = regex;
	            this.query[columnName]["$options"] = 'im';

	            return this;
	        }
	    }, {
	        key: "regex",
	        value: function regex(columnName, value, isCaseInsensitive) {
	            if (columnName === 'id') columnName = '_' + columnName;

	            if (!this.query[columnName]) {
	                this.query[columnName] = {};
	            }

	            this.query[columnName]["$regex"] = value;

	            if (isCaseInsensitive) {
	                this.query[columnName]["$options"] = "i";
	            }

	            return this;
	        }
	    }, {
	        key: "substring",
	        value: function substring(columnName, value, isCaseInsensitive) {

	            if (typeof columnName === "string") {
	                columnName = [columnName];
	            }

	            for (var j = 0; j < columnName.length; j++) {
	                if (Object.prototype.toString.call(value) === '[object Array]' && value.length > 0) {
	                    if (!this.query["$or"]) this.query["$or"] = [];
	                    for (var i = 0; i < value.length; i++) {
	                        var obj = {};
	                        obj[columnName[j]] = {};
	                        obj[columnName[j]]["$regex"] = ".*" + value[i] + ".*";

	                        if (isCaseInsensitive) {
	                            obj[columnName[j]]["$options"] = "i";
	                        }

	                        this.query["$or"].push(obj);
	                    }
	                } else {
	                    if (columnName.length === 1) {
	                        this.regex(columnName[j], ".*" + value + ".*", isCaseInsensitive);
	                    } else {
	                        if (!this.query["$or"]) this.query["$or"] = [];
	                        var obj = {};
	                        obj[columnName[j]] = {};
	                        obj[columnName[j]]["$regex"] = ".*" + value + ".*";

	                        if (isCaseInsensitive) {
	                            obj[columnName[j]]["$options"] = "i";
	                        }

	                        this.query["$or"].push(obj);
	                    }
	                }
	            }

	            return this;
	        }

	        //GeoPoint near query

	    }, {
	        key: "near",
	        value: function near(columnName, geoPoint, maxDistance, minDistance) {
	            if (!this.query[columnName]) {
	                this.query[columnName] = {};
	                this.query[columnName]['$near'] = {
	                    '$geometry': { coordinates: geoPoint['document'].coordinates, type: 'Point' },
	                    '$maxDistance': maxDistance,
	                    '$minDistance': minDistance
	                };
	            }
	        }
	    }, {
	        key: "geoWithin",


	        //GeoPoint geoWithin query
	        value: function geoWithin(columnName, geoPoint, radius) {

	            if (!radius) {
	                var coordinates = [];
	                //extracting coordinates from each CloudGeoPoint Object
	                if (Object.prototype.toString.call(geoPoint) === '[object Array]') {
	                    for (var i = 0; i < geoPoint.length; i++) {
	                        if (geoPoint[i]['document'].hasOwnProperty('coordinates')) {
	                            coordinates[i] = geoPoint[i]['document']['coordinates'];
	                        }
	                    }
	                } else {
	                    throw 'Invalid Parameter, coordinates should be an array of CloudGeoPoint Object';
	                }
	                //2dSphere needs first and last coordinates to be same for polygon type
	                //eg. for Triangle four coordinates need to pass, three points of triangle and fourth one should be same as first one
	                coordinates[coordinates.length] = coordinates[0];
	                var type = 'Polygon';
	                if (!this.query[columnName]) {
	                    this.query[columnName] = {};
	                    this.query[columnName]['$geoWithin'] = {};
	                    this.query[columnName]['$geoWithin']['$geometry'] = {
	                        'type': type,
	                        'coordinates': [coordinates]
	                    };
	                }
	            } else {
	                if (!this.query[columnName]) {
	                    this.query[columnName] = {};
	                    this.query[columnName]['$geoWithin'] = {
	                        '$centerSphere': [geoPoint['document']['coordinates'], radius / 3963.2]
	                    };
	                }
	            }
	        }
	    }, {
	        key: "count",
	        value: function count(callback) {
	            if (!_CB2.default.appId) {
	                throw "CB.appId is null.";
	            }
	            if (!this.tableName) {
	                throw "TableName is null.";
	            }
	            var def;
	            if (!callback) {
	                def = new _CB2.default.Promise();
	            }
	            var thisObj = this;
	            var params = JSON.stringify({
	                query: thisObj.query,
	                limit: thisObj.limit,
	                skip: thisObj.skip,
	                key: _CB2.default.appKey
	            });
	            var url = _CB2.default.apiUrl + "/data/" + _CB2.default.appId + "/" + thisObj.tableName + '/count';

	            _CB2.default._request('POST', url, params).then(function (response) {
	                response = parseInt(response);
	                if (callback) {
	                    callback.success(response);
	                } else {
	                    def.resolve(response);
	                }
	            }, function (err) {
	                if (callback) {
	                    callback.error(err);
	                } else {
	                    def.reject(err);
	                }
	            });

	            if (!callback) {
	                return def.promise;
	            }
	        }
	    }, {
	        key: "distinct",
	        value: function distinct(keys, callback) {

	            if (keys === 'id') {
	                keys = '_id';
	            }

	            if (!_CB2.default.appId) {
	                throw "CB.appId is null.";
	            }
	            if (!this.tableName) {
	                throw "TableName is null.";
	            }
	            if (Object.prototype.toString.call(keys) !== '[object Array]' && keys.length <= 0) {
	                throw "keys should be array";
	            }
	            var def;
	            if (!callback) {
	                def = new _CB2.default.Promise();
	            }

	            var thisObj = this;

	            var params = JSON.stringify({
	                onKey: keys,
	                query: thisObj.query,
	                select: thisObj.select,
	                sort: thisObj.sort,
	                limit: thisObj.limit,
	                skip: thisObj.skip,
	                key: _CB2.default.appKey
	            });
	            var url = _CB2.default.apiUrl + "/data/" + _CB2.default.appId + "/" + thisObj.tableName + '/distinct';

	            _CB2.default._request('POST', url, params).then(function (response) {
	                var object = _CB2.default.fromJSON(JSON.parse(response));
	                if (callback) {
	                    callback.success(object);
	                } else {
	                    def.resolve(object);
	                }
	            }, function (err) {
	                if (callback) {
	                    callback.error(err);
	                } else {
	                    def.reject(err);
	                }
	            });

	            if (!callback) {
	                return def.promise;
	            }
	        }
	    }, {
	        key: "find",
	        value: function find(callback) {
	            //find the document(s) matching the given query
	            if (!_CB2.default.appId) {
	                throw "CB.appId is null.";
	            }
	            if (!this.tableName) {
	                throw "TableName is null.";
	            }
	            var def;
	            if (!callback) {
	                def = new _CB2.default.Promise();
	            }

	            var thisObj = this;

	            var xmlhttp = _CB2.default._loadXml();
	            var params = JSON.stringify({
	                query: thisObj.query,
	                select: thisObj.select,
	                sort: thisObj.sort,
	                limit: thisObj.limit,
	                skip: thisObj.skip,
	                key: _CB2.default.appKey
	            });

	            var url = _CB2.default.apiUrl + "/data/" + _CB2.default.appId + "/" + thisObj.tableName + '/find';

	            _CB2.default._request('POST', url, params).then(function (response) {
	                var object = _CB2.default.fromJSON(JSON.parse(response));
	                if (callback) {
	                    callback.success(object);
	                } else {
	                    def.resolve(object);
	                }
	            }, function (err) {
	                if (callback) {
	                    callback.error(err);
	                } else {
	                    def.reject(err);
	                }
	            });

	            if (!callback) {
	                return def.promise;
	            }
	        }
	    }, {
	        key: "get",
	        value: function get(objectId, callback) {
	            var query = new _CB2.default.CloudQuery(this.tableName);
	            return query.findById(objectId, callback);
	        }
	    }, {
	        key: "findById",
	        value: function findById(objectId, callback) {
	            //find the document(s) matching the given query

	            var thisObj = this;

	            if (!_CB2.default.appId) {
	                throw "CB.appId is null.";
	            }
	            if (!this.tableName) {
	                throw "TableName is null.";
	            }
	            var def;
	            if (!callback) {
	                def = new _CB2.default.Promise();
	            }

	            if (thisObj.skip && !thisObj.skip !== 0) {
	                throw "You cannot use skip and find object by Id in the same query";
	            }

	            if (thisObj.limit && thisObj.limit === 0) {
	                throw "You cannot use limit and find object by Id in the same query";
	            }

	            if (thisObj.sort && Object.getOwnPropertyNames(thisObj.sort).length > 0) {
	                throw "You cannot use sort and find object by Id in the same query";
	            }

	            thisObj.equalTo('id', objectId);

	            var params = JSON.stringify({
	                query: thisObj.query,
	                select: thisObj.select,
	                key: _CB2.default.appKey,
	                limit: 1,
	                skip: 0,
	                sort: {}
	            });

	            var url = _CB2.default.apiUrl + "/data/" + _CB2.default.appId + "/" + thisObj.tableName + '/find';

	            _CB2.default._request('POST', url, params).then(function (response) {
	                response = JSON.parse(response);
	                if (Object.prototype.toString.call(response) === '[object Array]') {
	                    response = response[0];
	                }
	                if (callback) {
	                    callback.success(_CB2.default.fromJSON(response));
	                } else {
	                    def.resolve(_CB2.default.fromJSON(response));
	                }
	            }, function (err) {
	                if (callback) {
	                    callback.error(err);
	                } else {
	                    def.reject(err);
	                }
	            });

	            if (!callback) {
	                return def.promise;
	            }
	        }
	    }, {
	        key: "findOne",
	        value: function findOne(callback) {
	            //find a single document matching the given query
	            if (!_CB2.default.appId) {
	                throw "CB.appId is null.";
	            }
	            if (!this.tableName) {
	                throw "TableName is null.";
	            }
	            var def;
	            if (!callback) {
	                def = new _CB2.default.Promise();
	            }
	            var params = JSON.stringify({
	                query: this.query,
	                select: this.select,
	                sort: this.sort,
	                skip: this.skip,
	                key: _CB2.default.appKey
	            });
	            var url = _CB2.default.apiUrl + "/data/" + _CB2.default.appId + "/" + this.tableName + '/findOne';

	            _CB2.default._request('POST', url, params).then(function (response) {
	                var object = _CB2.default.fromJSON(JSON.parse(response));
	                if (callback) {
	                    callback.success(object);
	                } else {
	                    def.resolve(object);
	                }
	            }, function (err) {
	                if (callback) {
	                    callback.error(err);
	                } else {
	                    def.reject(err);
	                }
	            });

	            if (!callback) {
	                return def.promise;
	            }
	        }
	    }]);

	    return CloudQuery;
	}();

	// Logical operations


	CloudQuery.or = function (obj1, obj2) {

	    var tableName;
	    var queryArray = [];

	    if (Object.prototype.toString.call(obj1) === "[object Array]") {
	        tableName = obj1[0].tableName;
	        for (var i = 0; i < obj1.length; ++i) {
	            if (obj1[i].tableName != tableName) {
	                throw "Table names are not same";
	                break;
	            }
	            if (!obj1[i] instanceof _CB2.default.CloudQuery) {
	                throw "Array items are not instanceof of CloudQuery";
	                break;
	            }
	            queryArray.push(obj1[i].query);
	        }
	    }

	    if (typeof obj2 !== 'undefined' && typeof obj1 !== 'undefined' && Object.prototype.toString.call(obj1) !== "[object Array]") {

	        if (Object.prototype.toString.call(obj2) === "[object Array]") {
	            throw "First and second parameter should be an instance of CloudQuery object";
	        }
	        if (!obj1.tableName === obj2.tableName) {
	            throw "Table names are not same";
	        }
	        if (!obj1 instanceof _CB2.default.CloudQuery) {
	            throw "Data passed is not an instance of CloudQuery";
	        }
	        if (!obj2 instanceof _CB2.default.CloudQuery) {
	            throw "Data passed is not an instance of CloudQuery";
	        }
	        tableName = obj1.tableName;
	        queryArray.push(obj1.query);
	        queryArray.push(obj2.query);
	    }
	    if (typeof tableName === 'undefined') {
	        throw "Invalid operation";
	    }
	    var obj = new _CB2.default.CloudQuery(tableName);
	    obj.query["$or"] = queryArray;
	    return obj;
	};
	CloudQuery._validateQuery = function (cloudObject, query) {
	    //validate query. 
	    for (var key in query) {

	        if (query[key]) {
	            var value = query[key];
	            if ((typeof value === "undefined" ? "undefined" : _typeof(value)) === 'object') {

	                if (key === '$or') {
	                    if (query[key].length > 0) {
	                        var isTrue = false;
	                        for (var i = 0; i < query[key].length; i++) {
	                            if (_CB2.default.CloudQuery._validateQuery(cloudObject, query[key][i])) {
	                                isTrue = true;
	                                break;
	                            }
	                        }

	                        if (!isTrue) {
	                            return false;
	                        }
	                    }
	                } else {

	                    for (var objectKeys in value) {
	                        //not equalTo query
	                        if (objectKeys === '$ne') {
	                            if (cloudObject.get(key) === query[key]['$ne']) {
	                                return false;
	                            }
	                        }

	                        //greater than
	                        if (objectKeys === '$gt') {
	                            if (cloudObject.get(key) <= query[key]['$gt']) {
	                                return false;
	                            }
	                        }

	                        //less than
	                        if (objectKeys === '$lt') {
	                            if (cloudObject.get(key) >= query[key]['$lt']) {
	                                return false;
	                            }
	                        }

	                        //greater than and equalTo. 
	                        if (objectKeys === '$gte') {
	                            if (cloudObject.get(key) < query[key]['$gte']) {
	                                return false;
	                            }
	                        }

	                        //less than and equalTo. 
	                        if (objectKeys === '$lte') {
	                            if (cloudObject.get(key) > query[key]['$lte']) {
	                                return false;
	                            }
	                        }

	                        //exists 
	                        if (objectKeys === '$exists') {
	                            if (query[key][objectKeys] && cloudObject.get(key)) {
	                                //do nothing.
	                            } else if (query[key][objectKeys] !== false) {
	                                return false;
	                            }
	                        }

	                        //doesNot exists. 
	                        if (objectKeys === '$exists') {
	                            if (!query[key][objectKeys] && cloudObject.get(key)) {
	                                return false;
	                            }
	                        }

	                        //startsWith. 
	                        if (objectKeys === '$regex') {

	                            var reg = new RegExp(query[key][objectKeys]);

	                            if (!query[key]['$options']) {
	                                if (!reg.test(cloudObject.get(key))) //test actial regex. 
	                                    return false;
	                            } else {
	                                if (query[key]['$options'] === 'im') {
	                                    //test starts with.
	                                    //starts with.
	                                    var value = trimStart('^', query[key][objectKeys]);
	                                    if (cloudObject.get(key).indexOf(value) !== 0) return false;
	                                }
	                            }
	                        }

	                        //containedIn. 
	                        if (objectKeys === '$in') {

	                            if (query[key][objectKeys]) {
	                                var arr = query[key][objectKeys];
	                                var value = null;
	                                if (key.indexOf('.') > -1) {
	                                    //for CloudObjects
	                                    value = cloudObject.get(key.substr(0, key.indexOf('.')));
	                                } else {
	                                    value = cloudObject.get(key);
	                                }

	                                if (Object.prototype.toString.call(value) === '[object Array]') {
	                                    var exists = false;
	                                    for (var i = 0; i < value.length; i++) {
	                                        if (value[i] instanceof _CB2.default.CloudObject) {
	                                            if (arr.indexOf(value[i].id) > -1) {
	                                                exists = true;
	                                                break;
	                                            }
	                                        } else {
	                                            if (arr.indexOf(value[i]) > -1) {
	                                                exists = true;
	                                                break;
	                                            }
	                                        }
	                                    }

	                                    if (!exists) {
	                                        return false;
	                                    }
	                                } else {
	                                    //if the element is not in the array then return false;
	                                    if (arr.indexOf(value) === -1) return false;
	                                }
	                            }
	                        }

	                        //doesNot containedIn. 
	                        if (objectKeys === '$nin') {
	                            if (query[key][objectKeys]) {
	                                var arr = query[key][objectKeys];
	                                var value = null;
	                                if (key.indexOf('.') > -1) {
	                                    //for CloudObjects
	                                    value = cloudObject.get(key.substr(0, key.indexOf('.')));
	                                } else {
	                                    value = cloudObject.get(key);
	                                }

	                                if (Object.prototype.toString.call(value) === '[object Array]') {
	                                    var exists = false;
	                                    for (var i = 0; i < value.length; i++) {
	                                        if (value[i] instanceof _CB2.default.CloudObject) {
	                                            if (arr.indexOf(value[i].id) !== -1) {
	                                                exists = true;
	                                                break;
	                                            }
	                                        } else {
	                                            if (arr.indexOf(value[i]) !== -1) {
	                                                exists = true;
	                                                break;
	                                            }
	                                        }
	                                    }

	                                    if (exists) {
	                                        return false;
	                                    }
	                                } else {
	                                    //if the element is not in the array then return false;
	                                    if (arr.indexOf(value) !== -1) return false;
	                                }
	                            }
	                        }

	                        //containsAll. 
	                        if (objectKeys === '$all') {
	                            if (query[key][objectKeys]) {
	                                var arr = query[key][objectKeys];
	                                var value = null;
	                                if (key.indexOf('.') > -1) {
	                                    //for CloudObjects
	                                    value = cloudObject.get(key.substr(0, key.indexOf('.')));
	                                } else {
	                                    value = cloudObject.get(key);
	                                }

	                                if (Object.prototype.toString.call(value) === '[object Array]') {
	                                    for (var i = 0; i < value.length; i++) {
	                                        if (value[i] instanceof _CB2.default.CloudObject) {
	                                            if (arr.indexOf(value[i].id) === -1) {
	                                                return false;
	                                            }
	                                        } else {
	                                            if (arr.indexOf(value[i]) === -1) {
	                                                return false;
	                                            }
	                                        }
	                                    }
	                                } else {
	                                    //if the element is not in the array then return false;
	                                    if (arr.indexOf(value) === -1) return false;
	                                }
	                            }
	                        }
	                    }
	                }
	            } else {
	                //it might be a plain equalTo query. 
	                if (key.indexOf('.') !== -1) {
	                    // for keys with "key._id" - This is for CloudObjects.
	                    var temp = key.substring(0, key.indexOf('.'));
	                    if (!cloudObject.get(temp)) {
	                        return false;
	                    }

	                    if (cloudObject.get(temp).id !== query[key]) {
	                        return false;
	                    }
	                } else {
	                    if (cloudObject.get(key) !== query[key]) {
	                        return false;
	                    }
	                }
	            }
	        }
	    }

	    return true;
	};

	_CB2.default.CloudQuery = CloudQuery;

	exports.default = _CB2.default.CloudQuery;

/***/ }
/******/ ])
});
;