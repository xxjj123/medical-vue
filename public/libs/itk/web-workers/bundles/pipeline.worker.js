(function () {
  'use strict';

  var register = {exports: {}};

  var _createClass$1 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

  function _classCallCheck$1(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  var TinyEmitter$1 = function () {
    function TinyEmitter() {
      _classCallCheck$1(this, TinyEmitter);

      Object.defineProperty(this, '__listeners', {
        value: {},
        enumerable: false,
        writable: false
      });
    }

    _createClass$1(TinyEmitter, [{
      key: 'emit',
      value: function emit(eventName) {
        if (!this.__listeners[eventName]) return this;

        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = this.__listeners[eventName][Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var handler = _step.value;

            handler.apply(undefined, args);
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        return this;
      }
    }, {
      key: 'once',
      value: function once(eventName, handler) {
        var _this = this;

        var once = function once() {
          _this.off(eventName, once);
          handler.apply(undefined, arguments);
        };

        return this.on(eventName, once);
      }
    }, {
      key: 'on',
      value: function on(eventName, handler) {
        if (!this.__listeners[eventName]) this.__listeners[eventName] = [];

        this.__listeners[eventName].push(handler);

        return this;
      }
    }, {
      key: 'off',
      value: function off(eventName, handler) {
        if (handler) this.__listeners[eventName] = this.__listeners[eventName].filter(function (h) {
          return h !== handler;
        });else this.__listeners[eventName] = [];

        return this;
      }
    }]);

    return TinyEmitter;
  }();

  var tinyEmitter = TinyEmitter$1;

  var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

  var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

  function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  var TinyEmitter = tinyEmitter;

  var MESSAGE_RESULT = 0;
  var MESSAGE_EVENT = 1;

  var RESULT_ERROR = 0;
  var RESULT_SUCCESS = 1;

  var DEFAULT_HANDLER = 'main';

  var isPromise = function isPromise(o) {
    return (typeof o === 'undefined' ? 'undefined' : _typeof(o)) === 'object' && o !== null && typeof o.then === 'function' && typeof o.catch === 'function';
  };

  function RegisterPromise(fn) {
    var handlers = _defineProperty({}, DEFAULT_HANDLER, fn);
    var sendPostMessage = self.postMessage.bind(self);

    var server = new (function (_TinyEmitter) {
      _inherits(WorkerRegister, _TinyEmitter);

      function WorkerRegister() {
        _classCallCheck(this, WorkerRegister);

        return _possibleConstructorReturn(this, (WorkerRegister.__proto__ || Object.getPrototypeOf(WorkerRegister)).apply(this, arguments));
      }

      _createClass(WorkerRegister, [{
        key: 'emit',
        value: function emit(eventName) {
          for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
          }

          if (args.length == 1 && args[0] instanceof TransferableResponse) {
            sendPostMessage({ eventName: eventName, args: args }, args[0].transferable);
          } else {
            sendPostMessage({ eventName: eventName, args: args });
          }
          return this;
        }
      }, {
        key: 'emitLocally',
        value: function emitLocally(eventName) {
          var _get2;

          for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
            args[_key2 - 1] = arguments[_key2];
          }

          (_get2 = _get(WorkerRegister.prototype.__proto__ || Object.getPrototypeOf(WorkerRegister.prototype), 'emit', this)).call.apply(_get2, [this, eventName].concat(args));
        }
      }, {
        key: 'operation',
        value: function operation(name, handler) {
          handlers[name] = handler;
          return this;
        }
      }]);

      return WorkerRegister;
    }(TinyEmitter))();

    var run = function run(messageId, payload, handlerName) {

      var onSuccess = function onSuccess(result) {
        if (result && result instanceof TransferableResponse) {
          sendResult(messageId, RESULT_SUCCESS, result.payload, result.transferable);
        } else {
          sendResult(messageId, RESULT_SUCCESS, result);
        }
      };

      var onError = function onError(e) {
        sendResult(messageId, RESULT_ERROR, {
          message: e.message,
          stack: e.stack
        });
      };

      try {
        var result = runFn(messageId, payload, handlerName);
        if (isPromise(result)) {
          result.then(onSuccess).catch(onError);
        } else {
          onSuccess(result);
        }
      } catch (e) {
        onError(e);
      }
    };

    var runFn = function runFn(messageId, payload, handlerName) {
      var handler = handlers[handlerName || DEFAULT_HANDLER];
      if (!handler) throw new Error('Not found handler for this request');

      return handler(payload, sendEvent.bind(null, messageId));
    };

    var sendResult = function sendResult(messageId, success, payload) {
      var transferable = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];

      sendPostMessage([MESSAGE_RESULT, messageId, success, payload], transferable);
    };

    var sendEvent = function sendEvent(messageId, eventName, payload) {
      if (!eventName) throw new Error('eventName is required');

      if (typeof eventName !== 'string') throw new Error('eventName should be string');

      sendPostMessage([MESSAGE_EVENT, messageId, eventName, payload]);
    };

    self.addEventListener('message', function (_ref) {
      var data = _ref.data;

      if (Array.isArray(data)) {
        run.apply(undefined, _toConsumableArray(data));
      } else if (data && data.eventName) {
        server.emitLocally.apply(server, [data.eventName].concat(_toConsumableArray(data.args)));
      }
    });

    return server;
  }

  var TransferableResponse = function TransferableResponse(payload, transferable) {
    _classCallCheck(this, TransferableResponse);

    this.payload = payload;
    this.transferable = transferable;
  };

  register.exports = RegisterPromise;
  register.exports.TransferableResponse = TransferableResponse;

  var registerWebworker = register.exports;

  var axios$2 = {exports: {}};

  var bind$2 = function bind(fn, thisArg) {
    return function wrap() {
      var args = new Array(arguments.length);
      for (var i = 0; i < args.length; i++) {
        args[i] = arguments[i];
      }
      return fn.apply(thisArg, args);
    };
  };

  var bind$1 = bind$2;

  // utils is a library of generic helper functions non-specific to axios

  var toString = Object.prototype.toString;

  /**
   * Determine if a value is an Array
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is an Array, otherwise false
   */
  function isArray(val) {
    return toString.call(val) === '[object Array]';
  }

  /**
   * Determine if a value is undefined
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if the value is undefined, otherwise false
   */
  function isUndefined(val) {
    return typeof val === 'undefined';
  }

  /**
   * Determine if a value is a Buffer
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a Buffer, otherwise false
   */
  function isBuffer(val) {
    return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
      && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
  }

  /**
   * Determine if a value is an ArrayBuffer
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is an ArrayBuffer, otherwise false
   */
  function isArrayBuffer(val) {
    return toString.call(val) === '[object ArrayBuffer]';
  }

  /**
   * Determine if a value is a FormData
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is an FormData, otherwise false
   */
  function isFormData(val) {
    return (typeof FormData !== 'undefined') && (val instanceof FormData);
  }

  /**
   * Determine if a value is a view on an ArrayBuffer
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
   */
  function isArrayBufferView(val) {
    var result;
    if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
      result = ArrayBuffer.isView(val);
    } else {
      result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
    }
    return result;
  }

  /**
   * Determine if a value is a String
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a String, otherwise false
   */
  function isString(val) {
    return typeof val === 'string';
  }

  /**
   * Determine if a value is a Number
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a Number, otherwise false
   */
  function isNumber(val) {
    return typeof val === 'number';
  }

  /**
   * Determine if a value is an Object
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is an Object, otherwise false
   */
  function isObject(val) {
    return val !== null && typeof val === 'object';
  }

  /**
   * Determine if a value is a plain Object
   *
   * @param {Object} val The value to test
   * @return {boolean} True if value is a plain Object, otherwise false
   */
  function isPlainObject(val) {
    if (toString.call(val) !== '[object Object]') {
      return false;
    }

    var prototype = Object.getPrototypeOf(val);
    return prototype === null || prototype === Object.prototype;
  }

  /**
   * Determine if a value is a Date
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a Date, otherwise false
   */
  function isDate(val) {
    return toString.call(val) === '[object Date]';
  }

  /**
   * Determine if a value is a File
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a File, otherwise false
   */
  function isFile(val) {
    return toString.call(val) === '[object File]';
  }

  /**
   * Determine if a value is a Blob
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a Blob, otherwise false
   */
  function isBlob(val) {
    return toString.call(val) === '[object Blob]';
  }

  /**
   * Determine if a value is a Function
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a Function, otherwise false
   */
  function isFunction(val) {
    return toString.call(val) === '[object Function]';
  }

  /**
   * Determine if a value is a Stream
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a Stream, otherwise false
   */
  function isStream(val) {
    return isObject(val) && isFunction(val.pipe);
  }

  /**
   * Determine if a value is a URLSearchParams object
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a URLSearchParams object, otherwise false
   */
  function isURLSearchParams(val) {
    return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
  }

  /**
   * Trim excess whitespace off the beginning and end of a string
   *
   * @param {String} str The String to trim
   * @returns {String} The String freed of excess whitespace
   */
  function trim(str) {
    return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
  }

  /**
   * Determine if we're running in a standard browser environment
   *
   * This allows axios to run in a web worker, and react-native.
   * Both environments support XMLHttpRequest, but not fully standard globals.
   *
   * web workers:
   *  typeof window -> undefined
   *  typeof document -> undefined
   *
   * react-native:
   *  navigator.product -> 'ReactNative'
   * nativescript
   *  navigator.product -> 'NativeScript' or 'NS'
   */
  function isStandardBrowserEnv() {
    if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                             navigator.product === 'NativeScript' ||
                                             navigator.product === 'NS')) {
      return false;
    }
    return (
      typeof window !== 'undefined' &&
      typeof document !== 'undefined'
    );
  }

  /**
   * Iterate over an Array or an Object invoking a function for each item.
   *
   * If `obj` is an Array callback will be called passing
   * the value, index, and complete array for each item.
   *
   * If 'obj' is an Object callback will be called passing
   * the value, key, and complete object for each property.
   *
   * @param {Object|Array} obj The object to iterate
   * @param {Function} fn The callback to invoke for each item
   */
  function forEach(obj, fn) {
    // Don't bother if no value provided
    if (obj === null || typeof obj === 'undefined') {
      return;
    }

    // Force an array if not already something iterable
    if (typeof obj !== 'object') {
      /*eslint no-param-reassign:0*/
      obj = [obj];
    }

    if (isArray(obj)) {
      // Iterate over array values
      for (var i = 0, l = obj.length; i < l; i++) {
        fn.call(null, obj[i], i, obj);
      }
    } else {
      // Iterate over object keys
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          fn.call(null, obj[key], key, obj);
        }
      }
    }
  }

  /**
   * Accepts varargs expecting each argument to be an object, then
   * immutably merges the properties of each object and returns result.
   *
   * When multiple objects contain the same key the later object in
   * the arguments list will take precedence.
   *
   * Example:
   *
   * ```js
   * var result = merge({foo: 123}, {foo: 456});
   * console.log(result.foo); // outputs 456
   * ```
   *
   * @param {Object} obj1 Object to merge
   * @returns {Object} Result of all merge properties
   */
  function merge(/* obj1, obj2, obj3, ... */) {
    var result = {};
    function assignValue(val, key) {
      if (isPlainObject(result[key]) && isPlainObject(val)) {
        result[key] = merge(result[key], val);
      } else if (isPlainObject(val)) {
        result[key] = merge({}, val);
      } else if (isArray(val)) {
        result[key] = val.slice();
      } else {
        result[key] = val;
      }
    }

    for (var i = 0, l = arguments.length; i < l; i++) {
      forEach(arguments[i], assignValue);
    }
    return result;
  }

  /**
   * Extends object a by mutably adding to it the properties of object b.
   *
   * @param {Object} a The object to be extended
   * @param {Object} b The object to copy properties from
   * @param {Object} thisArg The object to bind function to
   * @return {Object} The resulting value of object a
   */
  function extend(a, b, thisArg) {
    forEach(b, function assignValue(val, key) {
      if (thisArg && typeof val === 'function') {
        a[key] = bind$1(val, thisArg);
      } else {
        a[key] = val;
      }
    });
    return a;
  }

  /**
   * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
   *
   * @param {string} content with BOM
   * @return {string} content value without BOM
   */
  function stripBOM(content) {
    if (content.charCodeAt(0) === 0xFEFF) {
      content = content.slice(1);
    }
    return content;
  }

  var utils$d = {
    isArray: isArray,
    isArrayBuffer: isArrayBuffer,
    isBuffer: isBuffer,
    isFormData: isFormData,
    isArrayBufferView: isArrayBufferView,
    isString: isString,
    isNumber: isNumber,
    isObject: isObject,
    isPlainObject: isPlainObject,
    isUndefined: isUndefined,
    isDate: isDate,
    isFile: isFile,
    isBlob: isBlob,
    isFunction: isFunction,
    isStream: isStream,
    isURLSearchParams: isURLSearchParams,
    isStandardBrowserEnv: isStandardBrowserEnv,
    forEach: forEach,
    merge: merge,
    extend: extend,
    trim: trim,
    stripBOM: stripBOM
  };

  var utils$c = utils$d;

  function encode(val) {
    return encodeURIComponent(val).
      replace(/%3A/gi, ':').
      replace(/%24/g, '$').
      replace(/%2C/gi, ',').
      replace(/%20/g, '+').
      replace(/%5B/gi, '[').
      replace(/%5D/gi, ']');
  }

  /**
   * Build a URL by appending params to the end
   *
   * @param {string} url The base of the url (e.g., http://www.google.com)
   * @param {object} [params] The params to be appended
   * @returns {string} The formatted url
   */
  var buildURL$2 = function buildURL(url, params, paramsSerializer) {
    /*eslint no-param-reassign:0*/
    if (!params) {
      return url;
    }

    var serializedParams;
    if (paramsSerializer) {
      serializedParams = paramsSerializer(params);
    } else if (utils$c.isURLSearchParams(params)) {
      serializedParams = params.toString();
    } else {
      var parts = [];

      utils$c.forEach(params, function serialize(val, key) {
        if (val === null || typeof val === 'undefined') {
          return;
        }

        if (utils$c.isArray(val)) {
          key = key + '[]';
        } else {
          val = [val];
        }

        utils$c.forEach(val, function parseValue(v) {
          if (utils$c.isDate(v)) {
            v = v.toISOString();
          } else if (utils$c.isObject(v)) {
            v = JSON.stringify(v);
          }
          parts.push(encode(key) + '=' + encode(v));
        });
      });

      serializedParams = parts.join('&');
    }

    if (serializedParams) {
      var hashmarkIndex = url.indexOf('#');
      if (hashmarkIndex !== -1) {
        url = url.slice(0, hashmarkIndex);
      }

      url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
    }

    return url;
  };

  var utils$b = utils$d;

  function InterceptorManager$1() {
    this.handlers = [];
  }

  /**
   * Add a new interceptor to the stack
   *
   * @param {Function} fulfilled The function to handle `then` for a `Promise`
   * @param {Function} rejected The function to handle `reject` for a `Promise`
   *
   * @return {Number} An ID used to remove interceptor later
   */
  InterceptorManager$1.prototype.use = function use(fulfilled, rejected, options) {
    this.handlers.push({
      fulfilled: fulfilled,
      rejected: rejected,
      synchronous: options ? options.synchronous : false,
      runWhen: options ? options.runWhen : null
    });
    return this.handlers.length - 1;
  };

  /**
   * Remove an interceptor from the stack
   *
   * @param {Number} id The ID that was returned by `use`
   */
  InterceptorManager$1.prototype.eject = function eject(id) {
    if (this.handlers[id]) {
      this.handlers[id] = null;
    }
  };

  /**
   * Iterate over all the registered interceptors
   *
   * This method is particularly useful for skipping over any
   * interceptors that may have become `null` calling `eject`.
   *
   * @param {Function} fn The function to call for each interceptor
   */
  InterceptorManager$1.prototype.forEach = function forEach(fn) {
    utils$b.forEach(this.handlers, function forEachHandler(h) {
      if (h !== null) {
        fn(h);
      }
    });
  };

  var InterceptorManager_1 = InterceptorManager$1;

  var utils$a = utils$d;

  var normalizeHeaderName$1 = function normalizeHeaderName(headers, normalizedName) {
    utils$a.forEach(headers, function processHeader(value, name) {
      if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
        headers[normalizedName] = value;
        delete headers[name];
      }
    });
  };

  /**
   * Update an Error with the specified config, error code, and response.
   *
   * @param {Error} error The error to update.
   * @param {Object} config The config.
   * @param {string} [code] The error code (for example, 'ECONNABORTED').
   * @param {Object} [request] The request.
   * @param {Object} [response] The response.
   * @returns {Error} The error.
   */
  var enhanceError$2 = function enhanceError(error, config, code, request, response) {
    error.config = config;
    if (code) {
      error.code = code;
    }

    error.request = request;
    error.response = response;
    error.isAxiosError = true;

    error.toJSON = function toJSON() {
      return {
        // Standard
        message: this.message,
        name: this.name,
        // Microsoft
        description: this.description,
        number: this.number,
        // Mozilla
        fileName: this.fileName,
        lineNumber: this.lineNumber,
        columnNumber: this.columnNumber,
        stack: this.stack,
        // Axios
        config: this.config,
        code: this.code,
        status: this.response && this.response.status ? this.response.status : null
      };
    };
    return error;
  };

  var enhanceError$1 = enhanceError$2;

  /**
   * Create an Error with the specified message, config, error code, request and response.
   *
   * @param {string} message The error message.
   * @param {Object} config The config.
   * @param {string} [code] The error code (for example, 'ECONNABORTED').
   * @param {Object} [request] The request.
   * @param {Object} [response] The response.
   * @returns {Error} The created error.
   */
  var createError$2 = function createError(message, config, code, request, response) {
    var error = new Error(message);
    return enhanceError$1(error, config, code, request, response);
  };

  var createError$1 = createError$2;

  /**
   * Resolve or reject a Promise based on response status.
   *
   * @param {Function} resolve A function that resolves the promise.
   * @param {Function} reject A function that rejects the promise.
   * @param {object} response The response.
   */
  var settle$1 = function settle(resolve, reject, response) {
    var validateStatus = response.config.validateStatus;
    if (!response.status || !validateStatus || validateStatus(response.status)) {
      resolve(response);
    } else {
      reject(createError$1(
        'Request failed with status code ' + response.status,
        response.config,
        null,
        response.request,
        response
      ));
    }
  };

  var utils$9 = utils$d;

  var cookies$1 = (
    utils$9.isStandardBrowserEnv() ?

    // Standard browser envs support document.cookie
      (function standardBrowserEnv() {
        return {
          write: function write(name, value, expires, path, domain, secure) {
            var cookie = [];
            cookie.push(name + '=' + encodeURIComponent(value));

            if (utils$9.isNumber(expires)) {
              cookie.push('expires=' + new Date(expires).toGMTString());
            }

            if (utils$9.isString(path)) {
              cookie.push('path=' + path);
            }

            if (utils$9.isString(domain)) {
              cookie.push('domain=' + domain);
            }

            if (secure === true) {
              cookie.push('secure');
            }

            document.cookie = cookie.join('; ');
          },

          read: function read(name) {
            var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
            return (match ? decodeURIComponent(match[3]) : null);
          },

          remove: function remove(name) {
            this.write(name, '', Date.now() - 86400000);
          }
        };
      })() :

    // Non standard browser env (web workers, react-native) lack needed support.
      (function nonStandardBrowserEnv() {
        return {
          write: function write() {},
          read: function read() { return null; },
          remove: function remove() {}
        };
      })()
  );

  /**
   * Determines whether the specified URL is absolute
   *
   * @param {string} url The URL to test
   * @returns {boolean} True if the specified URL is absolute, otherwise false
   */
  var isAbsoluteURL$1 = function isAbsoluteURL(url) {
    // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
    // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
    // by any combination of letters, digits, plus, period, or hyphen.
    return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
  };

  /**
   * Creates a new URL by combining the specified URLs
   *
   * @param {string} baseURL The base URL
   * @param {string} relativeURL The relative URL
   * @returns {string} The combined URL
   */
  var combineURLs$1 = function combineURLs(baseURL, relativeURL) {
    return relativeURL
      ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
      : baseURL;
  };

  var isAbsoluteURL = isAbsoluteURL$1;
  var combineURLs = combineURLs$1;

  /**
   * Creates a new URL by combining the baseURL with the requestedURL,
   * only when the requestedURL is not already an absolute URL.
   * If the requestURL is absolute, this function returns the requestedURL untouched.
   *
   * @param {string} baseURL The base URL
   * @param {string} requestedURL Absolute or relative URL to combine
   * @returns {string} The combined full path
   */
  var buildFullPath$1 = function buildFullPath(baseURL, requestedURL) {
    if (baseURL && !isAbsoluteURL(requestedURL)) {
      return combineURLs(baseURL, requestedURL);
    }
    return requestedURL;
  };

  var utils$8 = utils$d;

  // Headers whose duplicates are ignored by node
  // c.f. https://nodejs.org/api/http.html#http_message_headers
  var ignoreDuplicateOf = [
    'age', 'authorization', 'content-length', 'content-type', 'etag',
    'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
    'last-modified', 'location', 'max-forwards', 'proxy-authorization',
    'referer', 'retry-after', 'user-agent'
  ];

  /**
   * Parse headers into an object
   *
   * ```
   * Date: Wed, 27 Aug 2014 08:58:49 GMT
   * Content-Type: application/json
   * Connection: keep-alive
   * Transfer-Encoding: chunked
   * ```
   *
   * @param {String} headers Headers needing to be parsed
   * @returns {Object} Headers parsed into an object
   */
  var parseHeaders$1 = function parseHeaders(headers) {
    var parsed = {};
    var key;
    var val;
    var i;

    if (!headers) { return parsed; }

    utils$8.forEach(headers.split('\n'), function parser(line) {
      i = line.indexOf(':');
      key = utils$8.trim(line.substr(0, i)).toLowerCase();
      val = utils$8.trim(line.substr(i + 1));

      if (key) {
        if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
          return;
        }
        if (key === 'set-cookie') {
          parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
        } else {
          parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
        }
      }
    });

    return parsed;
  };

  var utils$7 = utils$d;

  var isURLSameOrigin$1 = (
    utils$7.isStandardBrowserEnv() ?

    // Standard browser envs have full support of the APIs needed to test
    // whether the request URL is of the same origin as current location.
      (function standardBrowserEnv() {
        var msie = /(msie|trident)/i.test(navigator.userAgent);
        var urlParsingNode = document.createElement('a');
        var originURL;

        /**
      * Parse a URL to discover it's components
      *
      * @param {String} url The URL to be parsed
      * @returns {Object}
      */
        function resolveURL(url) {
          var href = url;

          if (msie) {
          // IE needs attribute set twice to normalize properties
            urlParsingNode.setAttribute('href', href);
            href = urlParsingNode.href;
          }

          urlParsingNode.setAttribute('href', href);

          // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
          return {
            href: urlParsingNode.href,
            protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
            host: urlParsingNode.host,
            search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
            hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
            hostname: urlParsingNode.hostname,
            port: urlParsingNode.port,
            pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
              urlParsingNode.pathname :
              '/' + urlParsingNode.pathname
          };
        }

        originURL = resolveURL(window.location.href);

        /**
      * Determine if a URL shares the same origin as the current location
      *
      * @param {String} requestURL The URL to test
      * @returns {boolean} True if URL shares the same origin, otherwise false
      */
        return function isURLSameOrigin(requestURL) {
          var parsed = (utils$7.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
          return (parsed.protocol === originURL.protocol &&
              parsed.host === originURL.host);
        };
      })() :

    // Non standard browser envs (web workers, react-native) lack needed support.
      (function nonStandardBrowserEnv() {
        return function isURLSameOrigin() {
          return true;
        };
      })()
  );

  /**
   * A `Cancel` is an object that is thrown when an operation is canceled.
   *
   * @class
   * @param {string=} message The message.
   */
  function Cancel$3(message) {
    this.message = message;
  }

  Cancel$3.prototype.toString = function toString() {
    return 'Cancel' + (this.message ? ': ' + this.message : '');
  };

  Cancel$3.prototype.__CANCEL__ = true;

  var Cancel_1 = Cancel$3;

  var utils$6 = utils$d;
  var settle = settle$1;
  var cookies = cookies$1;
  var buildURL$1 = buildURL$2;
  var buildFullPath = buildFullPath$1;
  var parseHeaders = parseHeaders$1;
  var isURLSameOrigin = isURLSameOrigin$1;
  var createError = createError$2;
  var defaults$4 = defaults_1;
  var Cancel$2 = Cancel_1;

  var xhr = function xhrAdapter(config) {
    return new Promise(function dispatchXhrRequest(resolve, reject) {
      var requestData = config.data;
      var requestHeaders = config.headers;
      var responseType = config.responseType;
      var onCanceled;
      function done() {
        if (config.cancelToken) {
          config.cancelToken.unsubscribe(onCanceled);
        }

        if (config.signal) {
          config.signal.removeEventListener('abort', onCanceled);
        }
      }

      if (utils$6.isFormData(requestData)) {
        delete requestHeaders['Content-Type']; // Let the browser set it
      }

      var request = new XMLHttpRequest();

      // HTTP basic authentication
      if (config.auth) {
        var username = config.auth.username || '';
        var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
        requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
      }

      var fullPath = buildFullPath(config.baseURL, config.url);
      request.open(config.method.toUpperCase(), buildURL$1(fullPath, config.params, config.paramsSerializer), true);

      // Set the request timeout in MS
      request.timeout = config.timeout;

      function onloadend() {
        if (!request) {
          return;
        }
        // Prepare the response
        var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
        var responseData = !responseType || responseType === 'text' ||  responseType === 'json' ?
          request.responseText : request.response;
        var response = {
          data: responseData,
          status: request.status,
          statusText: request.statusText,
          headers: responseHeaders,
          config: config,
          request: request
        };

        settle(function _resolve(value) {
          resolve(value);
          done();
        }, function _reject(err) {
          reject(err);
          done();
        }, response);

        // Clean up request
        request = null;
      }

      if ('onloadend' in request) {
        // Use onloadend if available
        request.onloadend = onloadend;
      } else {
        // Listen for ready state to emulate onloadend
        request.onreadystatechange = function handleLoad() {
          if (!request || request.readyState !== 4) {
            return;
          }

          // The request errored out and we didn't get a response, this will be
          // handled by onerror instead
          // With one exception: request that using file: protocol, most browsers
          // will return status as 0 even though it's a successful request
          if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
            return;
          }
          // readystate handler is calling before onerror or ontimeout handlers,
          // so we should call onloadend on the next 'tick'
          setTimeout(onloadend);
        };
      }

      // Handle browser request cancellation (as opposed to a manual cancellation)
      request.onabort = function handleAbort() {
        if (!request) {
          return;
        }

        reject(createError('Request aborted', config, 'ECONNABORTED', request));

        // Clean up request
        request = null;
      };

      // Handle low level network errors
      request.onerror = function handleError() {
        // Real errors are hidden from us by the browser
        // onerror should only fire if it's a network error
        reject(createError('Network Error', config, null, request));

        // Clean up request
        request = null;
      };

      // Handle timeout
      request.ontimeout = function handleTimeout() {
        var timeoutErrorMessage = config.timeout ? 'timeout of ' + config.timeout + 'ms exceeded' : 'timeout exceeded';
        var transitional = config.transitional || defaults$4.transitional;
        if (config.timeoutErrorMessage) {
          timeoutErrorMessage = config.timeoutErrorMessage;
        }
        reject(createError(
          timeoutErrorMessage,
          config,
          transitional.clarifyTimeoutError ? 'ETIMEDOUT' : 'ECONNABORTED',
          request));

        // Clean up request
        request = null;
      };

      // Add xsrf header
      // This is only done if running in a standard browser environment.
      // Specifically not if we're in a web worker, or react-native.
      if (utils$6.isStandardBrowserEnv()) {
        // Add xsrf header
        var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
          cookies.read(config.xsrfCookieName) :
          undefined;

        if (xsrfValue) {
          requestHeaders[config.xsrfHeaderName] = xsrfValue;
        }
      }

      // Add headers to the request
      if ('setRequestHeader' in request) {
        utils$6.forEach(requestHeaders, function setRequestHeader(val, key) {
          if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
            // Remove Content-Type if data is undefined
            delete requestHeaders[key];
          } else {
            // Otherwise add header to the request
            request.setRequestHeader(key, val);
          }
        });
      }

      // Add withCredentials to request if needed
      if (!utils$6.isUndefined(config.withCredentials)) {
        request.withCredentials = !!config.withCredentials;
      }

      // Add responseType to request if needed
      if (responseType && responseType !== 'json') {
        request.responseType = config.responseType;
      }

      // Handle progress if needed
      if (typeof config.onDownloadProgress === 'function') {
        request.addEventListener('progress', config.onDownloadProgress);
      }

      // Not all browsers support upload events
      if (typeof config.onUploadProgress === 'function' && request.upload) {
        request.upload.addEventListener('progress', config.onUploadProgress);
      }

      if (config.cancelToken || config.signal) {
        // Handle cancellation
        // eslint-disable-next-line func-names
        onCanceled = function(cancel) {
          if (!request) {
            return;
          }
          reject(!cancel || (cancel && cancel.type) ? new Cancel$2('canceled') : cancel);
          request.abort();
          request = null;
        };

        config.cancelToken && config.cancelToken.subscribe(onCanceled);
        if (config.signal) {
          config.signal.aborted ? onCanceled() : config.signal.addEventListener('abort', onCanceled);
        }
      }

      if (!requestData) {
        requestData = null;
      }

      // Send the request
      request.send(requestData);
    });
  };

  var utils$5 = utils$d;
  var normalizeHeaderName = normalizeHeaderName$1;
  var enhanceError = enhanceError$2;

  var DEFAULT_CONTENT_TYPE = {
    'Content-Type': 'application/x-www-form-urlencoded'
  };

  function setContentTypeIfUnset(headers, value) {
    if (!utils$5.isUndefined(headers) && utils$5.isUndefined(headers['Content-Type'])) {
      headers['Content-Type'] = value;
    }
  }

  function getDefaultAdapter() {
    var adapter;
    if (typeof XMLHttpRequest !== 'undefined') {
      // For browsers use XHR adapter
      adapter = xhr;
    } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
      // For node use HTTP adapter
      adapter = xhr;
    }
    return adapter;
  }

  function stringifySafely(rawValue, parser, encoder) {
    if (utils$5.isString(rawValue)) {
      try {
        (parser || JSON.parse)(rawValue);
        return utils$5.trim(rawValue);
      } catch (e) {
        if (e.name !== 'SyntaxError') {
          throw e;
        }
      }
    }

    return (encoder || JSON.stringify)(rawValue);
  }

  var defaults$3 = {

    transitional: {
      silentJSONParsing: true,
      forcedJSONParsing: true,
      clarifyTimeoutError: false
    },

    adapter: getDefaultAdapter(),

    transformRequest: [function transformRequest(data, headers) {
      normalizeHeaderName(headers, 'Accept');
      normalizeHeaderName(headers, 'Content-Type');

      if (utils$5.isFormData(data) ||
        utils$5.isArrayBuffer(data) ||
        utils$5.isBuffer(data) ||
        utils$5.isStream(data) ||
        utils$5.isFile(data) ||
        utils$5.isBlob(data)
      ) {
        return data;
      }
      if (utils$5.isArrayBufferView(data)) {
        return data.buffer;
      }
      if (utils$5.isURLSearchParams(data)) {
        setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
        return data.toString();
      }
      if (utils$5.isObject(data) || (headers && headers['Content-Type'] === 'application/json')) {
        setContentTypeIfUnset(headers, 'application/json');
        return stringifySafely(data);
      }
      return data;
    }],

    transformResponse: [function transformResponse(data) {
      var transitional = this.transitional || defaults$3.transitional;
      var silentJSONParsing = transitional && transitional.silentJSONParsing;
      var forcedJSONParsing = transitional && transitional.forcedJSONParsing;
      var strictJSONParsing = !silentJSONParsing && this.responseType === 'json';

      if (strictJSONParsing || (forcedJSONParsing && utils$5.isString(data) && data.length)) {
        try {
          return JSON.parse(data);
        } catch (e) {
          if (strictJSONParsing) {
            if (e.name === 'SyntaxError') {
              throw enhanceError(e, this, 'E_JSON_PARSE');
            }
            throw e;
          }
        }
      }

      return data;
    }],

    /**
     * A timeout in milliseconds to abort a request. If set to 0 (default) a
     * timeout is not created.
     */
    timeout: 0,

    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',

    maxContentLength: -1,
    maxBodyLength: -1,

    validateStatus: function validateStatus(status) {
      return status >= 200 && status < 300;
    },

    headers: {
      common: {
        'Accept': 'application/json, text/plain, */*'
      }
    }
  };

  utils$5.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
    defaults$3.headers[method] = {};
  });

  utils$5.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
    defaults$3.headers[method] = utils$5.merge(DEFAULT_CONTENT_TYPE);
  });

  var defaults_1 = defaults$3;

  var utils$4 = utils$d;
  var defaults$2 = defaults_1;

  /**
   * Transform the data for a request or a response
   *
   * @param {Object|String} data The data to be transformed
   * @param {Array} headers The headers for the request or response
   * @param {Array|Function} fns A single function or Array of functions
   * @returns {*} The resulting transformed data
   */
  var transformData$1 = function transformData(data, headers, fns) {
    var context = this || defaults$2;
    /*eslint no-param-reassign:0*/
    utils$4.forEach(fns, function transform(fn) {
      data = fn.call(context, data, headers);
    });

    return data;
  };

  var isCancel$1 = function isCancel(value) {
    return !!(value && value.__CANCEL__);
  };

  var utils$3 = utils$d;
  var transformData = transformData$1;
  var isCancel = isCancel$1;
  var defaults$1 = defaults_1;
  var Cancel$1 = Cancel_1;

  /**
   * Throws a `Cancel` if cancellation has been requested.
   */
  function throwIfCancellationRequested(config) {
    if (config.cancelToken) {
      config.cancelToken.throwIfRequested();
    }

    if (config.signal && config.signal.aborted) {
      throw new Cancel$1('canceled');
    }
  }

  /**
   * Dispatch a request to the server using the configured adapter.
   *
   * @param {object} config The config that is to be used for the request
   * @returns {Promise} The Promise to be fulfilled
   */
  var dispatchRequest$1 = function dispatchRequest(config) {
    throwIfCancellationRequested(config);

    // Ensure headers exist
    config.headers = config.headers || {};

    // Transform request data
    config.data = transformData.call(
      config,
      config.data,
      config.headers,
      config.transformRequest
    );

    // Flatten headers
    config.headers = utils$3.merge(
      config.headers.common || {},
      config.headers[config.method] || {},
      config.headers
    );

    utils$3.forEach(
      ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
      function cleanHeaderConfig(method) {
        delete config.headers[method];
      }
    );

    var adapter = config.adapter || defaults$1.adapter;

    return adapter(config).then(function onAdapterResolution(response) {
      throwIfCancellationRequested(config);

      // Transform response data
      response.data = transformData.call(
        config,
        response.data,
        response.headers,
        config.transformResponse
      );

      return response;
    }, function onAdapterRejection(reason) {
      if (!isCancel(reason)) {
        throwIfCancellationRequested(config);

        // Transform response data
        if (reason && reason.response) {
          reason.response.data = transformData.call(
            config,
            reason.response.data,
            reason.response.headers,
            config.transformResponse
          );
        }
      }

      return Promise.reject(reason);
    });
  };

  var utils$2 = utils$d;

  /**
   * Config-specific merge-function which creates a new config-object
   * by merging two configuration objects together.
   *
   * @param {Object} config1
   * @param {Object} config2
   * @returns {Object} New object resulting from merging config2 to config1
   */
  var mergeConfig$2 = function mergeConfig(config1, config2) {
    // eslint-disable-next-line no-param-reassign
    config2 = config2 || {};
    var config = {};

    function getMergedValue(target, source) {
      if (utils$2.isPlainObject(target) && utils$2.isPlainObject(source)) {
        return utils$2.merge(target, source);
      } else if (utils$2.isPlainObject(source)) {
        return utils$2.merge({}, source);
      } else if (utils$2.isArray(source)) {
        return source.slice();
      }
      return source;
    }

    // eslint-disable-next-line consistent-return
    function mergeDeepProperties(prop) {
      if (!utils$2.isUndefined(config2[prop])) {
        return getMergedValue(config1[prop], config2[prop]);
      } else if (!utils$2.isUndefined(config1[prop])) {
        return getMergedValue(undefined, config1[prop]);
      }
    }

    // eslint-disable-next-line consistent-return
    function valueFromConfig2(prop) {
      if (!utils$2.isUndefined(config2[prop])) {
        return getMergedValue(undefined, config2[prop]);
      }
    }

    // eslint-disable-next-line consistent-return
    function defaultToConfig2(prop) {
      if (!utils$2.isUndefined(config2[prop])) {
        return getMergedValue(undefined, config2[prop]);
      } else if (!utils$2.isUndefined(config1[prop])) {
        return getMergedValue(undefined, config1[prop]);
      }
    }

    // eslint-disable-next-line consistent-return
    function mergeDirectKeys(prop) {
      if (prop in config2) {
        return getMergedValue(config1[prop], config2[prop]);
      } else if (prop in config1) {
        return getMergedValue(undefined, config1[prop]);
      }
    }

    var mergeMap = {
      'url': valueFromConfig2,
      'method': valueFromConfig2,
      'data': valueFromConfig2,
      'baseURL': defaultToConfig2,
      'transformRequest': defaultToConfig2,
      'transformResponse': defaultToConfig2,
      'paramsSerializer': defaultToConfig2,
      'timeout': defaultToConfig2,
      'timeoutMessage': defaultToConfig2,
      'withCredentials': defaultToConfig2,
      'adapter': defaultToConfig2,
      'responseType': defaultToConfig2,
      'xsrfCookieName': defaultToConfig2,
      'xsrfHeaderName': defaultToConfig2,
      'onUploadProgress': defaultToConfig2,
      'onDownloadProgress': defaultToConfig2,
      'decompress': defaultToConfig2,
      'maxContentLength': defaultToConfig2,
      'maxBodyLength': defaultToConfig2,
      'transport': defaultToConfig2,
      'httpAgent': defaultToConfig2,
      'httpsAgent': defaultToConfig2,
      'cancelToken': defaultToConfig2,
      'socketPath': defaultToConfig2,
      'responseEncoding': defaultToConfig2,
      'validateStatus': mergeDirectKeys
    };

    utils$2.forEach(Object.keys(config1).concat(Object.keys(config2)), function computeConfigValue(prop) {
      var merge = mergeMap[prop] || mergeDeepProperties;
      var configValue = merge(prop);
      (utils$2.isUndefined(configValue) && merge !== mergeDirectKeys) || (config[prop] = configValue);
    });

    return config;
  };

  var data = {
    "version": "0.23.0"
  };

  var VERSION = data.version;

  var validators$1 = {};

  // eslint-disable-next-line func-names
  ['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach(function(type, i) {
    validators$1[type] = function validator(thing) {
      return typeof thing === type || 'a' + (i < 1 ? 'n ' : ' ') + type;
    };
  });

  var deprecatedWarnings = {};

  /**
   * Transitional option validator
   * @param {function|boolean?} validator - set to false if the transitional option has been removed
   * @param {string?} version - deprecated version / removed since version
   * @param {string?} message - some message with additional info
   * @returns {function}
   */
  validators$1.transitional = function transitional(validator, version, message) {
    function formatMessage(opt, desc) {
      return '[Axios v' + VERSION + '] Transitional option \'' + opt + '\'' + desc + (message ? '. ' + message : '');
    }

    // eslint-disable-next-line func-names
    return function(value, opt, opts) {
      if (validator === false) {
        throw new Error(formatMessage(opt, ' has been removed' + (version ? ' in ' + version : '')));
      }

      if (version && !deprecatedWarnings[opt]) {
        deprecatedWarnings[opt] = true;
        // eslint-disable-next-line no-console
        console.warn(
          formatMessage(
            opt,
            ' has been deprecated since v' + version + ' and will be removed in the near future'
          )
        );
      }

      return validator ? validator(value, opt, opts) : true;
    };
  };

  /**
   * Assert object's properties type
   * @param {object} options
   * @param {object} schema
   * @param {boolean?} allowUnknown
   */

  function assertOptions(options, schema, allowUnknown) {
    if (typeof options !== 'object') {
      throw new TypeError('options must be an object');
    }
    var keys = Object.keys(options);
    var i = keys.length;
    while (i-- > 0) {
      var opt = keys[i];
      var validator = schema[opt];
      if (validator) {
        var value = options[opt];
        var result = value === undefined || validator(value, opt, options);
        if (result !== true) {
          throw new TypeError('option ' + opt + ' must be ' + result);
        }
        continue;
      }
      if (allowUnknown !== true) {
        throw Error('Unknown option ' + opt);
      }
    }
  }

  var validator$1 = {
    assertOptions: assertOptions,
    validators: validators$1
  };

  var utils$1 = utils$d;
  var buildURL = buildURL$2;
  var InterceptorManager = InterceptorManager_1;
  var dispatchRequest = dispatchRequest$1;
  var mergeConfig$1 = mergeConfig$2;
  var validator = validator$1;

  var validators = validator.validators;
  /**
   * Create a new instance of Axios
   *
   * @param {Object} instanceConfig The default config for the instance
   */
  function Axios$1(instanceConfig) {
    this.defaults = instanceConfig;
    this.interceptors = {
      request: new InterceptorManager(),
      response: new InterceptorManager()
    };
  }

  /**
   * Dispatch a request
   *
   * @param {Object} config The config specific for this request (merged with this.defaults)
   */
  Axios$1.prototype.request = function request(config) {
    /*eslint no-param-reassign:0*/
    // Allow for axios('example/url'[, config]) a la fetch API
    if (typeof config === 'string') {
      config = arguments[1] || {};
      config.url = arguments[0];
    } else {
      config = config || {};
    }

    config = mergeConfig$1(this.defaults, config);

    // Set config.method
    if (config.method) {
      config.method = config.method.toLowerCase();
    } else if (this.defaults.method) {
      config.method = this.defaults.method.toLowerCase();
    } else {
      config.method = 'get';
    }

    var transitional = config.transitional;

    if (transitional !== undefined) {
      validator.assertOptions(transitional, {
        silentJSONParsing: validators.transitional(validators.boolean),
        forcedJSONParsing: validators.transitional(validators.boolean),
        clarifyTimeoutError: validators.transitional(validators.boolean)
      }, false);
    }

    // filter out skipped interceptors
    var requestInterceptorChain = [];
    var synchronousRequestInterceptors = true;
    this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
      if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
        return;
      }

      synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;

      requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
    });

    var responseInterceptorChain = [];
    this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
      responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
    });

    var promise;

    if (!synchronousRequestInterceptors) {
      var chain = [dispatchRequest, undefined];

      Array.prototype.unshift.apply(chain, requestInterceptorChain);
      chain = chain.concat(responseInterceptorChain);

      promise = Promise.resolve(config);
      while (chain.length) {
        promise = promise.then(chain.shift(), chain.shift());
      }

      return promise;
    }


    var newConfig = config;
    while (requestInterceptorChain.length) {
      var onFulfilled = requestInterceptorChain.shift();
      var onRejected = requestInterceptorChain.shift();
      try {
        newConfig = onFulfilled(newConfig);
      } catch (error) {
        onRejected(error);
        break;
      }
    }

    try {
      promise = dispatchRequest(newConfig);
    } catch (error) {
      return Promise.reject(error);
    }

    while (responseInterceptorChain.length) {
      promise = promise.then(responseInterceptorChain.shift(), responseInterceptorChain.shift());
    }

    return promise;
  };

  Axios$1.prototype.getUri = function getUri(config) {
    config = mergeConfig$1(this.defaults, config);
    return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
  };

  // Provide aliases for supported request methods
  utils$1.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
    /*eslint func-names:0*/
    Axios$1.prototype[method] = function(url, config) {
      return this.request(mergeConfig$1(config || {}, {
        method: method,
        url: url,
        data: (config || {}).data
      }));
    };
  });

  utils$1.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
    /*eslint func-names:0*/
    Axios$1.prototype[method] = function(url, data, config) {
      return this.request(mergeConfig$1(config || {}, {
        method: method,
        url: url,
        data: data
      }));
    };
  });

  var Axios_1 = Axios$1;

  var Cancel = Cancel_1;

  /**
   * A `CancelToken` is an object that can be used to request cancellation of an operation.
   *
   * @class
   * @param {Function} executor The executor function.
   */
  function CancelToken(executor) {
    if (typeof executor !== 'function') {
      throw new TypeError('executor must be a function.');
    }

    var resolvePromise;

    this.promise = new Promise(function promiseExecutor(resolve) {
      resolvePromise = resolve;
    });

    var token = this;

    // eslint-disable-next-line func-names
    this.promise.then(function(cancel) {
      if (!token._listeners) return;

      var i;
      var l = token._listeners.length;

      for (i = 0; i < l; i++) {
        token._listeners[i](cancel);
      }
      token._listeners = null;
    });

    // eslint-disable-next-line func-names
    this.promise.then = function(onfulfilled) {
      var _resolve;
      // eslint-disable-next-line func-names
      var promise = new Promise(function(resolve) {
        token.subscribe(resolve);
        _resolve = resolve;
      }).then(onfulfilled);

      promise.cancel = function reject() {
        token.unsubscribe(_resolve);
      };

      return promise;
    };

    executor(function cancel(message) {
      if (token.reason) {
        // Cancellation has already been requested
        return;
      }

      token.reason = new Cancel(message);
      resolvePromise(token.reason);
    });
  }

  /**
   * Throws a `Cancel` if cancellation has been requested.
   */
  CancelToken.prototype.throwIfRequested = function throwIfRequested() {
    if (this.reason) {
      throw this.reason;
    }
  };

  /**
   * Subscribe to the cancel signal
   */

  CancelToken.prototype.subscribe = function subscribe(listener) {
    if (this.reason) {
      listener(this.reason);
      return;
    }

    if (this._listeners) {
      this._listeners.push(listener);
    } else {
      this._listeners = [listener];
    }
  };

  /**
   * Unsubscribe from the cancel signal
   */

  CancelToken.prototype.unsubscribe = function unsubscribe(listener) {
    if (!this._listeners) {
      return;
    }
    var index = this._listeners.indexOf(listener);
    if (index !== -1) {
      this._listeners.splice(index, 1);
    }
  };

  /**
   * Returns an object that contains a new `CancelToken` and a function that, when called,
   * cancels the `CancelToken`.
   */
  CancelToken.source = function source() {
    var cancel;
    var token = new CancelToken(function executor(c) {
      cancel = c;
    });
    return {
      token: token,
      cancel: cancel
    };
  };

  var CancelToken_1 = CancelToken;

  /**
   * Syntactic sugar for invoking a function and expanding an array for arguments.
   *
   * Common use case would be to use `Function.prototype.apply`.
   *
   *  ```js
   *  function f(x, y, z) {}
   *  var args = [1, 2, 3];
   *  f.apply(null, args);
   *  ```
   *
   * With `spread` this example can be re-written.
   *
   *  ```js
   *  spread(function(x, y, z) {})([1, 2, 3]);
   *  ```
   *
   * @param {Function} callback
   * @returns {Function}
   */
  var spread = function spread(callback) {
    return function wrap(arr) {
      return callback.apply(null, arr);
    };
  };

  /**
   * Determines whether the payload is an error thrown by Axios
   *
   * @param {*} payload The value to test
   * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
   */
  var isAxiosError = function isAxiosError(payload) {
    return (typeof payload === 'object') && (payload.isAxiosError === true);
  };

  var utils = utils$d;
  var bind = bind$2;
  var Axios = Axios_1;
  var mergeConfig = mergeConfig$2;
  var defaults = defaults_1;

  /**
   * Create an instance of Axios
   *
   * @param {Object} defaultConfig The default config for the instance
   * @return {Axios} A new instance of Axios
   */
  function createInstance(defaultConfig) {
    var context = new Axios(defaultConfig);
    var instance = bind(Axios.prototype.request, context);

    // Copy axios.prototype to instance
    utils.extend(instance, Axios.prototype, context);

    // Copy context to instance
    utils.extend(instance, context);

    // Factory for creating new instances
    instance.create = function create(instanceConfig) {
      return createInstance(mergeConfig(defaultConfig, instanceConfig));
    };

    return instance;
  }

  // Create the default instance to be exported
  var axios$1 = createInstance(defaults);

  // Expose Axios class to allow class inheritance
  axios$1.Axios = Axios;

  // Expose Cancel & CancelToken
  axios$1.Cancel = Cancel_1;
  axios$1.CancelToken = CancelToken_1;
  axios$1.isCancel = isCancel$1;
  axios$1.VERSION = data.version;

  // Expose all/spread
  axios$1.all = function all(promises) {
    return Promise.all(promises);
  };
  axios$1.spread = spread;

  // Expose isAxiosError
  axios$1.isAxiosError = isAxiosError;

  axios$2.exports = axios$1;

  // Allow use of default import syntax in TypeScript
  axios$2.exports.default = axios$1;

  var axios = axios$2.exports;

  function camelCase(kebobCase) {
      // make any alphabets that follows '-' an uppercase character, and remove the corresponding hyphen
      const cameledParam = kebobCase.replace(/-([a-z])/g, (kk) => {
          return kk[1].toUpperCase();
      });
      // remove all non-alphanumeric characters
      const outParam = cameledParam.replace(/([^0-9a-z])/ig, '');
      // check if resulting string is empty
      if (outParam === '') {
          console.error('Resulting string is empty.');
      }
      return outParam;
  }

  // Load the Emscripten module in the browser in a WebWorker.
  //
  // baseUrl is usually taken from '../itkConfig.js', but a different value
  // could be passed.
  async function loadEmscriptenModuleWebWorker(moduleRelativePathOrURL, baseUrl) {
      let modulePrefix = null;
      if (typeof moduleRelativePathOrURL !== 'string') {
          modulePrefix = moduleRelativePathOrURL.href;
      }
      else if (moduleRelativePathOrURL.startsWith('http')) {
          modulePrefix = moduleRelativePathOrURL;
      }
      else {
          modulePrefix = `${baseUrl}/${moduleRelativePathOrURL}`;
      }
      if (modulePrefix.endsWith('.js')) {
          modulePrefix = modulePrefix.substring(0, modulePrefix.length - 3);
      }
      if (modulePrefix.endsWith('.wasm')) {
          modulePrefix = modulePrefix.substring(0, modulePrefix.length - 5);
      }
      // importScripts / UMD is required over dynamic ESM import until Firefox
      // adds worker dynamic import support:
      // https://bugzilla.mozilla.org/show_bug.cgi?id=1540913
      const wasmBinaryPath = `${modulePrefix}.wasm`;
      const response = await axios.get(wasmBinaryPath, { responseType: 'arraybuffer' });
      const wasmBinary = response.data;
      const modulePath = `${modulePrefix}.umd.js`;
      importScripts(modulePath);
      const moduleBaseName = camelCase(modulePrefix.replace(/.*\//, ''));
      // @ts-ignore: error TS7053: Element implicitly has an 'any' type because expression of type 'string' can't be used to index type 'WorkerGlobalScope & typeof globalThis'.
      const wrapperModule = self[moduleBaseName];
      const emscriptenModule = wrapperModule({ wasmBinary });
      return emscriptenModule;
  }

  // To cache loaded pipeline modules
  const pipelineToModule = new Map();
  async function loadPipelineModule(pipelinePath, baseUrl) {
      let moduleRelativePathOrURL = pipelinePath;
      let pipeline = pipelinePath;
      let pipelineModule = null;
      if (typeof pipelinePath !== 'string') {
          moduleRelativePathOrURL = new URL(pipelinePath.href);
          pipeline = moduleRelativePathOrURL.href;
      }
      if (pipelineToModule.has(pipeline)) {
          pipelineModule = pipelineToModule.get(pipeline);
      }
      else {
          pipelineToModule.set(pipeline, await loadEmscriptenModuleWebWorker(moduleRelativePathOrURL, baseUrl));
          pipelineModule = pipelineToModule.get(pipeline);
      }
      return pipelineModule;
  }

  const mimeToIO$2 = new Map([
      ['image/jpeg', 'JPEGImageIO'],
      ['image/png', 'PNGImageIO'],
      ['image/tiff', 'TIFFImageIO'],
      ['image/x-ms-bmp', 'BMPImageIO'],
      ['image/x-bmp', 'BMPImageIO'],
      ['image/bmp', 'BMPImageIO'],
      ['application/dicom', 'GDCMImageIO']
  ]);
  var mimeToIO$3 = mimeToIO$2;

  const extensionToIO$2 = new Map([
      ['bmp', 'BMPImageIO'],
      ['BMP', 'BMPImageIO'],
      ['dcm', 'GDCMImageIO'],
      ['DCM', 'GDCMImageIO'],
      ['gipl', 'GiplImageIO'],
      ['gipl.gz', 'GiplImageIO'],
      ['hdf5', 'HDF5ImageIO'],
      ['jpg', 'JPEGImageIO'],
      ['JPG', 'JPEGImageIO'],
      ['jpeg', 'JPEGImageIO'],
      ['JPEG', 'JPEGImageIO'],
      ['iwi', 'WASMImageIO'],
      ['iwi.cbor', 'WASMImageIO'],
      ['iwi.cbor.zstd', 'WASMZstdImageIO'],
      ['lsm', 'LSMImageIO'],
      ['mnc', 'MINCImageIO'],
      ['MNC', 'MINCImageIO'],
      ['mnc.gz', 'MINCImageIO'],
      ['MNC.GZ', 'MINCImageIO'],
      ['mnc2', 'MINCImageIO'],
      ['MNC2', 'MINCImageIO'],
      ['mgh', 'MGHImageIO'],
      ['mgz', 'MGHImageIO'],
      ['mgh.gz', 'MGHImageIO'],
      ['mha', 'MetaImageIO'],
      ['mhd', 'MetaImageIO'],
      ['mrc', 'MRCImageIO'],
      ['nia', 'NiftiImageIO'],
      ['nii', 'NiftiImageIO'],
      ['nii.gz', 'NiftiImageIO'],
      ['hdr', 'NiftiImageIO'],
      ['nrrd', 'NrrdImageIO'],
      ['NRRD', 'NrrdImageIO'],
      ['nhdr', 'NrrdImageIO'],
      ['NHDR', 'NrrdImageIO'],
      ['png', 'PNGImageIO'],
      ['PNG', 'PNGImageIO'],
      ['pic', 'BioRadImageIO'],
      ['PIC', 'BioRadImageIO'],
      ['tif', 'TIFFImageIO'],
      ['TIF', 'TIFFImageIO'],
      ['tiff', 'TIFFImageIO'],
      ['TIFF', 'TIFFImageIO'],
      ['vtk', 'VTKImageIO'],
      ['VTK', 'VTKImageIO'],
      ['isq', 'ScancoImageIO'],
      ['ISQ', 'ScancoImageIO'],
      ['fdf', 'FDFImageIO'],
      ['FDF', 'FDFImageIO']
  ]);
  var extensionToIO$3 = extensionToIO$2;

  function getFileExtension(filePath) {
      let extension = filePath.slice((filePath.lastIndexOf('.') - 1 >>> 0) + 2);
      if (extension.toLowerCase() === 'gz') {
          const index = filePath.slice(0, -3).lastIndexOf('.');
          extension = filePath.slice((index - 1 >>> 0) + 2);
      }
      else if (extension.toLowerCase() === 'cbor') {
          const index = filePath.slice(0, -5).lastIndexOf('.');
          extension = filePath.slice((index - 1 >>> 0) + 2);
      }
      else if (extension.toLowerCase() === 'zstd') {
          // .iwi.cbor.zstd
          const index = filePath.slice(0, -10).lastIndexOf('.');
          extension = filePath.slice((index - 1 >>> 0) + 2);
      }
      else if (extension.toLowerCase() === 'zip') {
          const index = filePath.slice(0, -4).lastIndexOf('.');
          extension = filePath.slice((index - 1 >>> 0) + 2);
      }
      return extension;
  }

  const ImageIOIndex = ['PNGImageIO', 'MetaImageIO', 'TIFFImageIO', 'NiftiImageIO', 'JPEGImageIO', 'NrrdImageIO', 'VTKImageIO', 'BMPImageIO', 'HDF5ImageIO', 'MINCImageIO', 'MRCImageIO', 'LSMImageIO', 'MGHImageIO', 'BioRadImageIO', 'GiplImageIO', 'GEAdwImageIO', 'GE4ImageIO', 'GE5ImageIO', 'GDCMImageIO', 'ScancoImageIO', 'FDFImageIO', 'WASMImageIO', 'WASMZstdImageIO',];
  var ImageIOIndex$1 = ImageIOIndex;

  const InterfaceTypes = {
      // Todo: remove Interface prefix after IOTypes has been removed
      TextFile: 'InterfaceTextFile',
      BinaryFile: 'InterfaceBinaryFile',
      TextStream: 'InterfaceTextStream',
      BinaryStream: 'InterfaceBinaryStream',
      Image: 'InterfaceImage',
      Mesh: 'InterfaceMesh',
      PolyData: 'InterfacePolyData'
  };
  var InterfaceTypes$1 = InterfaceTypes;

  const IOTypes = {
      Text: 'Text',
      Binary: 'Binary',
      Image: 'Image',
      Mesh: 'Mesh'
  };
  var IOTypes$1 = IOTypes;

  const IntTypes = {
      Int8: 'int8',
      UInt8: 'uint8',
      Int16: 'int16',
      UInt16: 'uint16',
      Int32: 'int32',
      UInt32: 'uint32',
      Int64: 'int64',
      UInt64: 'uint64',
      SizeValueType: 'uint64',
      IdentifierType: 'uint64',
      IndexValueType: 'int64',
      OffsetValueType: 'int64'
  };
  var IntTypes$1 = IntTypes;

  const FloatTypes = {
      Float32: 'float32',
      Float64: 'float64',
      SpacePrecisionType: 'float64'
  };
  var FloatTypes$1 = FloatTypes;

  function bufferToTypedArray(wasmType, buffer) {
      let typedArray = null;
      switch (wasmType) {
          case IntTypes$1.UInt8: {
              typedArray = new Uint8Array(buffer);
              break;
          }
          case IntTypes$1.Int8: {
              typedArray = new Int8Array(buffer);
              break;
          }
          case IntTypes$1.UInt16: {
              typedArray = new Uint16Array(buffer);
              break;
          }
          case IntTypes$1.Int16: {
              typedArray = new Int16Array(buffer);
              break;
          }
          case IntTypes$1.UInt32: {
              typedArray = new Uint32Array(buffer);
              break;
          }
          case IntTypes$1.Int32: {
              typedArray = new Int32Array(buffer);
              break;
          }
          case IntTypes$1.UInt64: {
              if (typeof globalThis.BigUint64Array === 'function') {
                  typedArray = new BigUint64Array(buffer);
              }
              else {
                  // Sub with reasonable default. Will get cast to Uint8Array when
                  // transferred to WebAssembly.
                  typedArray = new Uint8Array(buffer);
              }
              break;
          }
          case IntTypes$1.Int64: {
              if (typeof globalThis.BigInt64Array === 'function') {
                  typedArray = new BigInt64Array(buffer);
              }
              else {
                  // Sub with reasonable default. Will get cast to Uint8Array when
                  // transferred to WebAssembly.
                  typedArray = new Uint8Array(buffer);
              }
              break;
          }
          case FloatTypes$1.Float32: {
              typedArray = new Float32Array(buffer);
              break;
          }
          case FloatTypes$1.Float64: {
              typedArray = new Float64Array(buffer);
              break;
          }
          case 'null': {
              typedArray = null;
              break;
          }
          case null: {
              typedArray = null;
              break;
          }
          default:
              throw new Error('Type is not supported as a TypedArray');
      }
      return typedArray;
  }

  const haveSharedArrayBuffer$1 = typeof globalThis.SharedArrayBuffer === 'function';
  const encoder = new TextEncoder();
  const decoder = new TextDecoder('utf-8');
  function readFileSharedArray(emscriptenModule, path) {
      const opts = { flags: 'r', encoding: 'binary' };
      const stream = emscriptenModule.fs_open(path, opts.flags);
      const stat = emscriptenModule.fs_stat(path);
      const length = stat.size;
      let arrayBufferData = null;
      if (haveSharedArrayBuffer$1) {
          arrayBufferData = new SharedArrayBuffer(length); // eslint-disable-line
      }
      else {
          arrayBufferData = new ArrayBuffer(length);
      }
      const array = new Uint8Array(arrayBufferData);
      emscriptenModule.fs_read(stream, array, 0, length, 0);
      emscriptenModule.fs_close(stream);
      return array;
  }
  function memoryUint8SharedArray(emscriptenModule, byteOffset, length) {
      let arrayBufferData = null;
      if (haveSharedArrayBuffer$1) {
          arrayBufferData = new SharedArrayBuffer(length); // eslint-disable-line
      }
      else {
          arrayBufferData = new ArrayBuffer(length);
      }
      const array = new Uint8Array(arrayBufferData);
      const dataArrayView = new Uint8Array(emscriptenModule.HEAPU8.buffer, byteOffset, length);
      array.set(dataArrayView);
      return array;
  }
  function setPipelineModuleInputArray(emscriptenModule, dataArray, inputIndex, subIndex) {
      let dataPtr = 0;
      if (dataArray !== null) {
          dataPtr = emscriptenModule.ccall('itk_wasm_input_array_alloc', 'number', ['number', 'number', 'number', 'number'], [0, inputIndex, subIndex, dataArray.buffer.byteLength]);
          emscriptenModule.HEAPU8.set(new Uint8Array(dataArray.buffer), dataPtr);
      }
      return dataPtr;
  }
  function setPipelineModuleInputJSON(emscriptenModule, dataObject, inputIndex) {
      const dataJSON = JSON.stringify(dataObject);
      const jsonPtr = emscriptenModule.ccall('itk_wasm_input_json_alloc', 'number', ['number', 'number', 'number'], [0, inputIndex, dataJSON.length]);
      emscriptenModule.writeAsciiToMemory(dataJSON, jsonPtr, false);
  }
  function getPipelineModuleOutputArray(emscriptenModule, outputIndex, subIndex, componentType) {
      const dataPtr = emscriptenModule.ccall('itk_wasm_output_array_address', 'number', ['number', 'number', 'number'], [0, outputIndex, subIndex]);
      const dataSize = emscriptenModule.ccall('itk_wasm_output_array_size', 'number', ['number', 'number', 'number'], [0, outputIndex, subIndex]);
      const dataUint8 = memoryUint8SharedArray(emscriptenModule, dataPtr, dataSize);
      const data = bufferToTypedArray(componentType, dataUint8.buffer);
      return data;
  }
  function getPipelineModuleOutputJSON(emscriptenModule, outputIndex) {
      const jsonPtr = emscriptenModule.ccall('itk_wasm_output_json_address', 'number', ['number', 'number'], [0, outputIndex]);
      const dataJSON = emscriptenModule.AsciiToString(jsonPtr);
      const dataObject = JSON.parse(dataJSON);
      return dataObject;
  }
  function runPipelineEmscripten(pipelineModule, args, outputs, inputs) {
      if (!(inputs == null) && inputs.length > 0) {
          inputs.forEach(function (input, index) {
              switch (input.type) {
                  case InterfaceTypes$1.TextStream:
                      {
                          const dataArray = encoder.encode(input.data.data);
                          const arrayPtr = setPipelineModuleInputArray(pipelineModule, dataArray, index, 0);
                          const dataJSON = { size: dataArray.buffer.byteLength, data: `data:application/vnd.itk.address,0:${arrayPtr}` };
                          setPipelineModuleInputJSON(pipelineModule, dataJSON, index);
                          break;
                      }
                  case InterfaceTypes$1.BinaryStream:
                      {
                          const dataArray = input.data.data;
                          const arrayPtr = setPipelineModuleInputArray(pipelineModule, dataArray, index, 0);
                          const dataJSON = { size: dataArray.buffer.byteLength, data: `data:application/vnd.itk.address,0:${arrayPtr}` };
                          setPipelineModuleInputJSON(pipelineModule, dataJSON, index);
                          break;
                      }
                  case InterfaceTypes$1.TextFile:
                      {
                          pipelineModule.fs_writeFile(input.data.path, input.data.data);
                          break;
                      }
                  case InterfaceTypes$1.BinaryFile:
                      {
                          pipelineModule.fs_writeFile(input.data.path, input.data.data);
                          break;
                      }
                  case InterfaceTypes$1.Image:
                      {
                          const image = input.data;
                          const dataPtr = setPipelineModuleInputArray(pipelineModule, image.data, index, 0);
                          const directionPtr = setPipelineModuleInputArray(pipelineModule, image.direction, index, 1);
                          const imageJSON = {
                              imageType: image.imageType,
                              name: image.name,
                              origin: image.origin,
                              spacing: image.spacing,
                              direction: `data:application/vnd.itk.address,0:${directionPtr}`,
                              size: image.size,
                              data: `data:application/vnd.itk.address,0:${dataPtr}`
                          };
                          setPipelineModuleInputJSON(pipelineModule, imageJSON, index);
                          break;
                      }
                  case InterfaceTypes$1.Mesh:
                      {
                          const mesh = input.data;
                          const pointsPtr = setPipelineModuleInputArray(pipelineModule, mesh.points, index, 0);
                          const cellsPtr = setPipelineModuleInputArray(pipelineModule, mesh.cells, index, 1);
                          const pointDataPtr = setPipelineModuleInputArray(pipelineModule, mesh.pointData, index, 2);
                          const cellDataPtr = setPipelineModuleInputArray(pipelineModule, mesh.cellData, index, 3);
                          const meshJSON = {
                              meshType: mesh.meshType,
                              name: mesh.name,
                              numberOfPoints: mesh.numberOfPoints,
                              points: `data:application/vnd.itk.address,0:${pointsPtr}`,
                              numberOfCells: mesh.numberOfCells,
                              cells: `data:application/vnd.itk.address,0:${cellsPtr}`,
                              cellBufferSize: mesh.cellBufferSize,
                              numberOfPointPixels: mesh.numberOfPointPixels,
                              pointData: `data:application/vnd.itk.address,0:${pointDataPtr}`,
                              numberOfCellPixels: mesh.numberOfCellPixels,
                              cellData: `data:application/vnd.itk.address,0:${cellDataPtr}`
                          };
                          setPipelineModuleInputJSON(pipelineModule, meshJSON, index);
                          break;
                      }
                  case InterfaceTypes$1.PolyData:
                      {
                          const polyData = input.data;
                          const pointsPtr = setPipelineModuleInputArray(pipelineModule, polyData.points, index, 0);
                          const verticesPtr = setPipelineModuleInputArray(pipelineModule, polyData.vertices, index, 1);
                          const linesPtr = setPipelineModuleInputArray(pipelineModule, polyData.lines, index, 2);
                          const polygonsPtr = setPipelineModuleInputArray(pipelineModule, polyData.polygons, index, 3);
                          const triangleStripsPtr = setPipelineModuleInputArray(pipelineModule, polyData.triangleStrips, index, 4);
                          const pointDataPtr = setPipelineModuleInputArray(pipelineModule, polyData.pointData, index, 5);
                          const cellDataPtr = setPipelineModuleInputArray(pipelineModule, polyData.pointData, index, 6);
                          const polyDataJSON = {
                              polyDataType: polyData.polyDataType,
                              name: polyData.name,
                              numberOfPoints: polyData.numberOfPoints,
                              points: `data:application/vnd.itk.address,0:${pointsPtr}`,
                              verticesBufferSize: polyData.verticesBufferSize,
                              vertices: `data:application/vnd.itk.address,0:${verticesPtr}`,
                              linesBufferSize: polyData.linesBufferSize,
                              lines: `data:application/vnd.itk.address,0:${linesPtr}`,
                              polygonsBufferSize: polyData.polygonsBufferSize,
                              polygons: `data:application/vnd.itk.address,0:${polygonsPtr}`,
                              triangleStripsBufferSize: polyData.triangleStripsBufferSize,
                              triangleStrips: `data:application/vnd.itk.address,0:${triangleStripsPtr}`,
                              numberOfPointPixels: polyData.numberOfPointPixels,
                              pointData: `data:application/vnd.itk.address,0:${pointDataPtr}`,
                              numberOfCellPixels: polyData.numberOfCellPixels,
                              cellData: `data:application/vnd.itk.address,0:${cellDataPtr}`
                          };
                          setPipelineModuleInputJSON(pipelineModule, polyDataJSON, index);
                          break;
                      }
                  case IOTypes$1.Text:
                      {
                          pipelineModule.fs_writeFile(input.path, input.data);
                          break;
                      }
                  case IOTypes$1.Binary:
                      {
                          pipelineModule.fs_writeFile(input.path, input.data);
                          break;
                      }
                  case IOTypes$1.Image:
                      {
                          const image = input.data;
                          const imageJSON = {
                              imageType: image.imageType,
                              name: image.name,
                              origin: image.origin,
                              spacing: image.spacing,
                              direction: 'data:application/vnd.itk.path,data/direction.raw',
                              size: image.size,
                              data: 'data:application/vnd.itk.path,data/data.raw'
                          };
                          pipelineModule.fs_mkdirs(`${input.path}/data`);
                          pipelineModule.fs_writeFile(`${input.path}/index.json`, JSON.stringify(imageJSON));
                          if (image.data === null) {
                              throw Error('image.data is null');
                          }
                          pipelineModule.fs_writeFile(`${input.path}/data/data.raw`, new Uint8Array(image.data.buffer));
                          pipelineModule.fs_writeFile(`${input.path}/data/direction.raw`, new Uint8Array(image.direction.buffer));
                          break;
                      }
                  case IOTypes$1.Mesh:
                      {
                          const mesh = input.data;
                          const meshJSON = {
                              meshType: mesh.meshType,
                              name: mesh.name,
                              numberOfPoints: mesh.numberOfPoints,
                              points: 'data:application/vnd.itk.path,data/points.raw',
                              numberOfPointPixels: mesh.numberOfPointPixels,
                              pointData: 'data:application/vnd.itk.path,data/pointData.raw',
                              numberOfCells: mesh.numberOfCells,
                              cells: 'data:application/vnd.itk.path,data/cells.raw',
                              numberOfCellPixels: mesh.numberOfCellPixels,
                              cellData: 'data:application/vnd.itk.path,data/cellData.raw',
                              cellBufferSize: mesh.cellBufferSize
                          };
                          pipelineModule.fs_mkdirs(`${input.path}/data`);
                          pipelineModule.fs_writeFile(`${input.path}/index.json`, JSON.stringify(meshJSON));
                          if (meshJSON.numberOfPoints > 0) {
                              if (mesh.points === null) {
                                  throw Error('mesh.points is null');
                              }
                              pipelineModule.fs_writeFile(`${input.path}/data/points.raw`, new Uint8Array(mesh.points.buffer));
                          }
                          if (meshJSON.numberOfPointPixels > 0) {
                              if (mesh.pointData === null) {
                                  throw Error('mesh.pointData is null');
                              }
                              pipelineModule.fs_writeFile(`${input.path}/data/pointData.raw`, new Uint8Array(mesh.pointData.buffer));
                          }
                          if (meshJSON.numberOfCells > 0) {
                              if (mesh.cells === null) {
                                  throw Error('mesh.cells is null');
                              }
                              pipelineModule.fs_writeFile(`${input.path}/data/cells.raw`, new Uint8Array(mesh.cells.buffer));
                          }
                          if (meshJSON.numberOfCellPixels > 0) {
                              if (mesh.cellData === null) {
                                  throw Error('mesh.cellData is null');
                              }
                              pipelineModule.fs_writeFile(`${input.path}/data/cellData.raw`, new Uint8Array(mesh.cellData.buffer));
                          }
                          break;
                      }
                  default:
                      throw Error('Unsupported input InterfaceType');
              }
          });
      }
      pipelineModule.resetModuleStdout();
      pipelineModule.resetModuleStderr();
      let returnValue = 0;
      try {
          returnValue = pipelineModule.callMain(args.slice());
      }
      catch (exception) {
          // Note: Module must be built with CMAKE_BUILD_TYPE set to Debug.
          // e.g.: itk-wasm build my/project -- -DCMAKE_BUILD_TYPE:STRING=Debug
          if (typeof exception === 'number') {
              console.log('Exception while running pipeline:');
              console.log('stdout:', pipelineModule.getModuleStdout());
              console.error('stderr:', pipelineModule.getModuleStderr());
              if (typeof pipelineModule.getExceptionMessage !== 'undefined') {
                  console.error('exception:', pipelineModule.getExceptionMessage(exception));
              }
              else {
                  console.error('Build module in Debug mode for exception message information.');
              }
          }
          throw exception;
      }
      const stdout = pipelineModule.getModuleStdout();
      const stderr = pipelineModule.getModuleStderr();
      const populatedOutputs = [];
      if (!(outputs == null) && outputs.length > 0 && returnValue === 0) {
          outputs.forEach(function (output, index) {
              let outputData = null;
              switch (output.type) {
                  case InterfaceTypes$1.TextStream:
                      {
                          // const jsonPtr = pipelineModule.ccall('itk_wasm_output_json_address', 'number', ['number', 'number'], [0, index])
                          // const jsonSize = pipelineModule.ccall('itk_wasm_output_json_size', 'number', ['number', 'number'], [0, index])
                          // const jsonArray = pipelineModule.HEAPU8.slice(jsonPtr, jsonPtr + jsonSize)
                          // const dataJSON = JSON.parse(decoder.decode(jsonArray))
                          const dataPtr = pipelineModule.ccall('itk_wasm_output_array_address', 'number', ['number', 'number', 'number'], [0, index, 0]);
                          const dataSize = pipelineModule.ccall('itk_wasm_output_array_size', 'number', ['number', 'number', 'number'], [0, index, 0]);
                          const dataArrayView = new Uint8Array(pipelineModule.HEAPU8.buffer, dataPtr, dataSize);
                          outputData = { data: decoder.decode(dataArrayView) };
                          break;
                      }
                  case InterfaceTypes$1.BinaryStream:
                      {
                          // const jsonPtr = pipelineModule.ccall('itk_wasm_output_json_address', 'number', ['number', 'number'], [0, index])
                          // const jsonSize = pipelineModule.ccall('itk_wasm_output_json_size', 'number', ['number', 'number'], [0, index])
                          // const jsonArray = pipelineModule.HEAPU8.slice(jsonPtr, jsonPtr + jsonSize)
                          // const dataJSON = JSON.parse(decoder.decode(jsonArray))
                          const dataPtr = pipelineModule.ccall('itk_wasm_output_array_address', 'number', ['number', 'number', 'number'], [0, index, 0]);
                          const dataSize = pipelineModule.ccall('itk_wasm_output_array_size', 'number', ['number', 'number', 'number'], [0, index, 0]);
                          outputData = { data: memoryUint8SharedArray(pipelineModule, dataPtr, dataSize) };
                          break;
                      }
                  case InterfaceTypes$1.TextFile:
                      {
                          outputData = { path: output.data.path, data: pipelineModule.fs_readFile(output.data.path, { encoding: 'utf8' }) };
                          break;
                      }
                  case InterfaceTypes$1.BinaryFile:
                      {
                          outputData = { path: output.data.path, data: readFileSharedArray(pipelineModule, output.data.path) };
                          break;
                      }
                  case InterfaceTypes$1.Image:
                      {
                          const image = getPipelineModuleOutputJSON(pipelineModule, index);
                          image.data = getPipelineModuleOutputArray(pipelineModule, index, 0, image.imageType.componentType);
                          image.direction = getPipelineModuleOutputArray(pipelineModule, index, 1, FloatTypes$1.Float64);
                          outputData = image;
                          break;
                      }
                  case InterfaceTypes$1.Mesh:
                      {
                          const mesh = getPipelineModuleOutputJSON(pipelineModule, index);
                          if (mesh.numberOfPoints > 0) {
                              mesh.points = getPipelineModuleOutputArray(pipelineModule, index, 0, mesh.meshType.pointComponentType);
                          }
                          else {
                              mesh.points = bufferToTypedArray(mesh.meshType.pointComponentType, new ArrayBuffer(0));
                          }
                          if (mesh.numberOfCells > 0) {
                              mesh.cells = getPipelineModuleOutputArray(pipelineModule, index, 1, mesh.meshType.cellComponentType);
                          }
                          else {
                              mesh.cells = bufferToTypedArray(mesh.meshType.cellComponentType, new ArrayBuffer(0));
                          }
                          if (mesh.numberOfPointPixels > 0) {
                              mesh.pointData = getPipelineModuleOutputArray(pipelineModule, index, 2, mesh.meshType.pointPixelComponentType);
                          }
                          else {
                              mesh.pointData = bufferToTypedArray(mesh.meshType.pointPixelComponentType, new ArrayBuffer(0));
                          }
                          if (mesh.numberOfCellPixels > 0) {
                              mesh.cellData = getPipelineModuleOutputArray(pipelineModule, index, 3, mesh.meshType.cellPixelComponentType);
                          }
                          else {
                              mesh.cellData = bufferToTypedArray(mesh.meshType.cellPixelComponentType, new ArrayBuffer(0));
                          }
                          outputData = mesh;
                          break;
                      }
                  case InterfaceTypes$1.PolyData:
                      {
                          const polyData = getPipelineModuleOutputJSON(pipelineModule, index);
                          if (polyData.numberOfPoints > 0) {
                              polyData.points = getPipelineModuleOutputArray(pipelineModule, index, 0, FloatTypes$1.Float32);
                          }
                          else {
                              polyData.points = new Float32Array();
                          }
                          if (polyData.verticesBufferSize > 0) {
                              polyData.vertices = getPipelineModuleOutputArray(pipelineModule, index, 1, IntTypes$1.UInt32);
                          }
                          else {
                              polyData.vertices = new Uint32Array();
                          }
                          if (polyData.linesBufferSize > 0) {
                              polyData.lines = getPipelineModuleOutputArray(pipelineModule, index, 2, IntTypes$1.UInt32);
                          }
                          else {
                              polyData.lines = new Uint32Array();
                          }
                          if (polyData.polygonsBufferSize > 0) {
                              polyData.polygons = getPipelineModuleOutputArray(pipelineModule, index, 3, IntTypes$1.UInt32);
                          }
                          else {
                              polyData.polygons = new Uint32Array();
                          }
                          if (polyData.triangleStripsBufferSize > 0) {
                              polyData.triangleStrips = getPipelineModuleOutputArray(pipelineModule, index, 4, IntTypes$1.UInt32);
                          }
                          else {
                              polyData.triangleStrips = new Uint32Array();
                          }
                          if (polyData.numberOfPointPixels > 0) {
                              polyData.pointData = getPipelineModuleOutputArray(pipelineModule, index, 5, polyData.polyDataType.pointPixelComponentType);
                          }
                          else {
                              polyData.pointData = bufferToTypedArray(polyData.polyDataType.pointPixelComponentType, new ArrayBuffer(0));
                          }
                          if (polyData.numberOfCellPixels > 0) {
                              polyData.cellData = getPipelineModuleOutputArray(pipelineModule, index, 6, polyData.polyDataType.cellPixelComponentType);
                          }
                          else {
                              polyData.cellData = bufferToTypedArray(polyData.polyDataType.cellPixelComponentType, new ArrayBuffer(0));
                          }
                          outputData = polyData;
                          break;
                      }
                  case IOTypes$1.Text:
                      {
                          if (typeof output.path === 'undefined') {
                              throw new Error('output.path not defined');
                          }
                          outputData = pipelineModule.fs_readFile(output.path, { encoding: 'utf8' });
                          break;
                      }
                  case IOTypes$1.Binary:
                      {
                          if (typeof output.path === 'undefined') {
                              throw new Error('output.path not defined');
                          }
                          outputData = readFileSharedArray(pipelineModule, output.path);
                          break;
                      }
                  case IOTypes$1.Image:
                      {
                          if (typeof output.path === 'undefined') {
                              throw new Error('output.path not defined');
                          }
                          const imageJSON = pipelineModule.fs_readFile(`${output.path}/index.json`, { encoding: 'utf8' });
                          const image = JSON.parse(imageJSON);
                          const dataUint8 = readFileSharedArray(pipelineModule, `${output.path}/data/data.raw`);
                          image.data = bufferToTypedArray(image.imageType.componentType, dataUint8.buffer);
                          const directionUint8 = readFileSharedArray(pipelineModule, `${output.path}/data/direction.raw`);
                          image.direction = bufferToTypedArray(FloatTypes$1.Float64, directionUint8.buffer);
                          outputData = image;
                          break;
                      }
                  case IOTypes$1.Mesh:
                      {
                          if (typeof output.path === 'undefined') {
                              throw new Error('output.path not defined');
                          }
                          const meshJSON = pipelineModule.fs_readFile(`${output.path}/index.json`, { encoding: 'utf8' });
                          const mesh = JSON.parse(meshJSON);
                          if (mesh.numberOfPoints > 0) {
                              const dataUint8Points = readFileSharedArray(pipelineModule, `${output.path}/data/points.raw`);
                              mesh.points = bufferToTypedArray(mesh.meshType.pointComponentType, dataUint8Points.buffer);
                          }
                          else {
                              mesh.points = bufferToTypedArray(mesh.meshType.pointComponentType, new ArrayBuffer(0));
                          }
                          if (mesh.numberOfPointPixels > 0) {
                              const dataUint8PointData = readFileSharedArray(pipelineModule, `${output.path}/data/pointData.raw`);
                              mesh.pointData = bufferToTypedArray(mesh.meshType.pointPixelComponentType, dataUint8PointData.buffer);
                          }
                          else {
                              mesh.pointData = bufferToTypedArray(mesh.meshType.pointPixelComponentType, new ArrayBuffer(0));
                          }
                          if (mesh.numberOfCells > 0) {
                              const dataUint8Cells = readFileSharedArray(pipelineModule, `${output.path}/data/cells.raw`);
                              mesh.cells = bufferToTypedArray(mesh.meshType.cellComponentType, dataUint8Cells.buffer);
                          }
                          else {
                              mesh.cells = bufferToTypedArray(mesh.meshType.cellComponentType, new ArrayBuffer(0));
                          }
                          if (mesh.numberOfCellPixels > 0) {
                              const dataUint8CellData = readFileSharedArray(pipelineModule, `${output.path}/data/cellData.raw`);
                              mesh.cellData = bufferToTypedArray(mesh.meshType.cellPixelComponentType, dataUint8CellData.buffer);
                          }
                          else {
                              mesh.cellData = bufferToTypedArray(mesh.meshType.cellPixelComponentType, new ArrayBuffer(0));
                          }
                          outputData = mesh;
                          break;
                      }
                  default:
                      throw Error('Unsupported output InterfaceType');
              }
              const populatedOutput = {
                  type: output.type,
                  data: outputData
              };
              populatedOutputs.push(populatedOutput);
          });
      }
      return { returnValue, stdout, stderr, outputs: populatedOutputs };
  }

  var __await$1 = (self && self.__await) || function (v) { return this instanceof __await$1 ? (this.v = v, this) : new __await$1(v); };
  var __asyncGenerator$1 = (self && self.__asyncGenerator) || function (thisArg, _arguments, generator) {
      if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
      var g = generator.apply(thisArg, _arguments || []), i, q = [];
      return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
      function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
      function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
      function step(r) { r.value instanceof __await$1 ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
      function fulfill(value) { resume("next", value); }
      function reject(value) { resume("throw", value); }
      function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
  };
  var __asyncValues$1 = (self && self.__asyncValues) || function (o) {
      if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
      var m = o[Symbol.asyncIterator], i;
      return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
      function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
      function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
  };
  function availableIOModules$1(input) {
      return __asyncGenerator$1(this, arguments, function* availableIOModules_1() {
          for (let idx = 0; idx < ImageIOIndex$1.length; idx++) {
              const trialIO = ImageIOIndex$1[idx] + '-read-image';
              const ioModule = yield __await$1(loadPipelineModule(trialIO, input.config.imageIOUrl));
              yield yield __await$1(ioModule);
          }
      });
  }
  async function loadImageIOPipelineModule(input, postfix) {
      var e_1, _a;
      if (input.mimeType && mimeToIO$3.has(input.mimeType)) {
          const io = mimeToIO$3.get(input.mimeType) + postfix;
          const ioModule = await loadPipelineModule(io, input.config.imageIOUrl);
          return ioModule;
      }
      const extension = getFileExtension(input.fileName);
      if (extensionToIO$3.has(extension)) {
          const io = extensionToIO$3.get(extension) + postfix;
          const ioModule = await loadPipelineModule(io, input.config.imageIOUrl);
          return ioModule;
      }
      for (let idx = 0; idx < ImageIOIndex$1.length; ++idx) {
          let idx = 0;
          try {
              for (var _b = (e_1 = void 0, __asyncValues$1(availableIOModules$1(input))), _c; _c = await _b.next(), !_c.done;) {
                  const pipelineModule = _c.value;
                  try {
                      const { returnValue, outputs } = await runPipelineEmscripten(pipelineModule, input.args, input.outputs, input.inputs);
                      if (returnValue === 0) {
                          return pipelineModule;
                      }
                  }
                  catch (error) {
                      // continue
                  }
                  idx++;
              }
          }
          catch (e_1_1) { e_1 = { error: e_1_1 }; }
          finally {
              try {
                  if (_c && !_c.done && (_a = _b.return)) await _a.call(_b);
              }
              finally { if (e_1) throw e_1.error; }
          }
      }
      throw Error(`Could not find IO for: ${input.fileName}`);
  }

  const mimeToIO = new Map([]);
  var mimeToIO$1 = mimeToIO;

  const extensionToIO = new Map([
      ['vtk', 'VTKPolyDataMeshIO'],
      ['VTK', 'VTKPolyDataMeshIO'],
      ['byu', 'BYUMeshIO'],
      ['BYU', 'BYUMeshIO'],
      ['fsa', 'FreeSurferAsciiMeshIO'],
      ['FSA', 'FreeSurferAsciiMeshIO'],
      ['fsb', 'FreeSurferBinaryMeshIO'],
      ['FSB', 'FreeSurferBinaryMeshIO'],
      ['obj', 'OBJMeshIO'],
      ['OBJ', 'OBJMeshIO'],
      ['off', 'OFFMeshIO'],
      ['OFF', 'OFFMeshIO'],
      ['stl', 'STLMeshIO'],
      ['STL', 'STLMeshIO'],
      ['swc', 'SWCMeshIO'],
      ['SWC', 'SWCMeshIO'],
      ['iwm', 'WASMMeshIO'],
      ['iwm.cbor', 'WASMMeshIO'],
      ['iwm.cbor.zstd', 'WASMZstdMeshIO']
  ]);
  var extensionToIO$1 = extensionToIO;

  const MeshIOIndex = ['BYUMeshIO', 'FreeSurferAsciiMeshIO', 'FreeSurferBinaryMeshIO', 'OBJMeshIO', 'OFFMeshIO', 'STLMeshIO', 'SWCMeshIO', 'VTKPolyDataMeshIO', 'WASMMeshIO', 'WASMZstdMeshIO',];
  var MeshIOIndex$1 = MeshIOIndex;

  var __await = (self && self.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); };
  var __asyncGenerator = (self && self.__asyncGenerator) || function (thisArg, _arguments, generator) {
      if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
      var g = generator.apply(thisArg, _arguments || []), i, q = [];
      return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
      function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
      function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
      function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
      function fulfill(value) { resume("next", value); }
      function reject(value) { resume("throw", value); }
      function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
  };
  var __asyncValues = (self && self.__asyncValues) || function (o) {
      if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
      var m = o[Symbol.asyncIterator], i;
      return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
      function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
      function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
  };
  function availableIOModules(input) {
      return __asyncGenerator(this, arguments, function* availableIOModules_1() {
          for (let idx = 0; idx < MeshIOIndex$1.length; idx++) {
              const trialIO = MeshIOIndex$1[idx] + '-read-mesh';
              const ioModule = yield __await(loadPipelineModule(trialIO, input.config.meshIOUrl));
              yield yield __await(ioModule);
          }
      });
  }
  async function loadMeshIOPipelineModule(input, postfix) {
      var e_1, _a;
      if (input.mimeType && mimeToIO$1.has(input.mimeType)) {
          const io = mimeToIO$1.get(input.mimeType) + postfix;
          const ioModule = await loadPipelineModule(io, input.config.meshIOUrl);
          return ioModule;
      }
      const extension = getFileExtension(input.fileName);
      if (extensionToIO$1.has(extension)) {
          const io = extensionToIO$1.get(extension) + postfix;
          const ioModule = await loadPipelineModule(io, input.config.meshIOUrl);
          return ioModule;
      }
      for (let idx = 0; idx < MeshIOIndex$1.length; ++idx) {
          let idx = 0;
          try {
              for (var _b = (e_1 = void 0, __asyncValues(availableIOModules(input))), _c; _c = await _b.next(), !_c.done;) {
                  const pipelineModule = _c.value;
                  try {
                      const { returnValue, outputs } = await runPipelineEmscripten(pipelineModule, input.args, input.outputs, input.inputs);
                      if (returnValue === 0) {
                          return pipelineModule;
                      }
                  }
                  catch (error) {
                      // continue
                  }
                  idx++;
              }
          }
          catch (e_1_1) { e_1 = { error: e_1_1 }; }
          finally {
              try {
                  if (_c && !_c.done && (_a = _b.return)) await _a.call(_b);
              }
              finally { if (e_1) throw e_1.error; }
          }
      }
      throw Error(`Could not find IO for: ${input.fileName}`);
  }

  const haveSharedArrayBuffer = typeof globalThis.SharedArrayBuffer === 'function'; // eslint-disable-line
  function getTransferable(data) {
      let result = null;
      if (data.buffer !== undefined) {
          result = data.buffer;
      }
      else if (data.byteLength !== undefined) {
          result = data;
      }
      if (!!result && haveSharedArrayBuffer && result instanceof SharedArrayBuffer) { // eslint-disable-line
          return null;
      }
      return result;
  }

  function meshTransferables(mesh) {
      const transferables = [];
      if (mesh.points != null) {
          transferables.push(mesh.points.buffer);
      }
      if (mesh.pointData != null) {
          transferables.push(mesh.pointData.buffer);
      }
      if (mesh.cells != null) {
          transferables.push(mesh.cells.buffer);
      }
      if (mesh.cellData != null) {
          transferables.push(mesh.cellData.buffer);
      }
      return transferables;
  }

  function polyDataTransferables(polyData) {
      const transferables = [];
      if (polyData.points != null) {
          transferables.push(polyData.points.buffer);
      }
      if (polyData.vertices != null) {
          transferables.push(polyData.vertices.buffer);
      }
      if (polyData.lines != null) {
          transferables.push(polyData.lines.buffer);
      }
      if (polyData.polygons != null) {
          transferables.push(polyData.polygons.buffer);
      }
      if (polyData.triangleStrips != null) {
          transferables.push(polyData.triangleStrips.buffer);
      }
      if (polyData.pointData != null) {
          transferables.push(polyData.pointData.buffer);
      }
      if (polyData.cellData != null) {
          transferables.push(polyData.cellData.buffer);
      }
      return transferables;
  }

  async function runPipeline(pipelineModule, args, outputs, inputs) {
      const result = runPipelineEmscripten(pipelineModule, args, outputs, inputs);
      const transferables = [];
      if (result.outputs) {
          result.outputs.forEach(function (output) {
              if (output.type === InterfaceTypes$1.BinaryStream || output.type === InterfaceTypes$1.BinaryFile) {
                  // Binary data
                  const binary = output.data;
                  const transferable = getTransferable(binary);
                  if (transferable) {
                      transferables.push(transferable);
                  }
              }
              else if (output.type === InterfaceTypes$1.Image) {
                  // Image data
                  const image = output.data;
                  let transferable = getTransferable(image.data);
                  if (transferable) {
                      transferables.push(transferable);
                  }
                  transferable = getTransferable(image.direction);
                  if (transferable) {
                      transferables.push(transferable);
                  }
              }
              else if (output.type === InterfaceTypes$1.Mesh) {
                  const mesh = output.data;
                  const mt = meshTransferables(mesh);
                  transferables.push(...mt);
              }
              else if (output.type === InterfaceTypes$1.PolyData) {
                  const polyData = output.data;
                  const pt = polyDataTransferables(polyData);
                  transferables.push(...pt);
              }
              else if (output.type === IOTypes$1.Binary) {
                  // Binary data
                  const binary = output.data;
                  const transferable = getTransferable(binary);
                  if (transferable) {
                      transferables.push(transferable);
                  }
              }
              else if (output.type === IOTypes$1.Image) {
                  // Image data
                  const image = output.data;
                  let transferable = getTransferable(image.data);
                  if (transferable) {
                      transferables.push(transferable);
                  }
                  transferable = getTransferable(image.direction);
                  if (transferable) {
                      transferables.push(transferable);
                  }
              }
              else if (output.type === IOTypes$1.Mesh) {
                  // Mesh data
                  const mesh = output.data;
                  if (mesh.points) {
                      const transferable = getTransferable(mesh.points);
                      if (transferable) {
                          transferables.push(transferable);
                      }
                  }
                  if (mesh.pointData) {
                      const transferable = getTransferable(mesh.pointData);
                      if (transferable) {
                          transferables.push(transferable);
                      }
                  }
                  if (mesh.cells) {
                      const transferable = getTransferable(mesh.cells);
                      if (transferable) {
                          transferables.push(transferable);
                      }
                  }
                  if (mesh.cellData) {
                      const transferable = getTransferable(mesh.cellData);
                      if (transferable) {
                          transferables.push(transferable);
                      }
                  }
              }
          });
      }
      return new registerWebworker.TransferableResponse(result, transferables);
  }

  registerWebworker(async function (input) {
      let pipelineModule = null;
      if (input.operation === 'runPipeline') {
          pipelineModule = await loadPipelineModule(input.pipelinePath, input.config.pipelinesUrl);
      }
      else if (input.operation === 'readImage') {
          pipelineModule = await loadImageIOPipelineModule(input, '-read-image');
      }
      else if (input.operation === 'writeImage') {
          pipelineModule = await loadImageIOPipelineModule(input, '-write-image');
      }
      else if (input.operation === 'readMesh') {
          pipelineModule = await loadMeshIOPipelineModule(input, '-read-mesh');
      }
      else if (input.operation === 'writeMesh') {
          pipelineModule = await loadMeshIOPipelineModule(input, '-write-mesh');
      }
      else if (input.operation === 'meshToPolyData') {
          pipelineModule = await loadPipelineModule('mesh-to-polydata', input.config.meshIOUrl);
      }
      else if (input.operation === 'polyDataToMesh') {
          pipelineModule = await loadPipelineModule('polydata-to-mesh', input.config.meshIOUrl);
      }
      else if (input.operation === 'readDICOMImageSeries') {
          pipelineModule = await loadPipelineModule('read-image-dicom-file-series', input.config.imageIOUrl);
      }
      else if (input.operation === 'readDICOMTags') {
          pipelineModule = await loadPipelineModule('read-dicom-tags', input.config.imageIOUrl);
      }
      else {
          throw new Error('Unknown worker operation');
      }
      return runPipeline(pipelineModule, input.args, input.outputs, input.inputs);
  });

})();
