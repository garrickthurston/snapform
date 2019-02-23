(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["vendor/vendor.assert-plus"],{

/***/ "60GX":
/*!********************************************!*\
  !*** ./node_modules/assert-plus/assert.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer, process) {// Copyright (c) 2012, Mark Cavage. All rights reserved.
// Copyright 2015 Joyent, Inc.

var assert = __webpack_require__(/*! assert */ "9lTW");
var Stream = __webpack_require__(/*! stream */ "1IWx").Stream;
var util = __webpack_require__(/*! util */ "7tlc");


///--- Globals

/* JSSTYLED */
var UUID_REGEXP = /^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$/;


///--- Internal

function _capitalize(str) {
    return (str.charAt(0).toUpperCase() + str.slice(1));
}

function _toss(name, expected, oper, arg, actual) {
    throw new assert.AssertionError({
        message: util.format('%s (%s) is required', name, expected),
        actual: (actual === undefined) ? typeof (arg) : actual(arg),
        expected: expected,
        operator: oper || '===',
        stackStartFunction: _toss.caller
    });
}

function _getClass(arg) {
    return (Object.prototype.toString.call(arg).slice(8, -1));
}

function noop() {
    // Why even bother with asserts?
}


///--- Exports

var types = {
    bool: {
        check: function (arg) { return typeof (arg) === 'boolean'; }
    },
    func: {
        check: function (arg) { return typeof (arg) === 'function'; }
    },
    string: {
        check: function (arg) { return typeof (arg) === 'string'; }
    },
    object: {
        check: function (arg) {
            return typeof (arg) === 'object' && arg !== null;
        }
    },
    number: {
        check: function (arg) {
            return typeof (arg) === 'number' && !isNaN(arg);
        }
    },
    finite: {
        check: function (arg) {
            return typeof (arg) === 'number' && !isNaN(arg) && isFinite(arg);
        }
    },
    buffer: {
        check: function (arg) { return Buffer.isBuffer(arg); },
        operator: 'Buffer.isBuffer'
    },
    array: {
        check: function (arg) { return Array.isArray(arg); },
        operator: 'Array.isArray'
    },
    stream: {
        check: function (arg) { return arg instanceof Stream; },
        operator: 'instanceof',
        actual: _getClass
    },
    date: {
        check: function (arg) { return arg instanceof Date; },
        operator: 'instanceof',
        actual: _getClass
    },
    regexp: {
        check: function (arg) { return arg instanceof RegExp; },
        operator: 'instanceof',
        actual: _getClass
    },
    uuid: {
        check: function (arg) {
            return typeof (arg) === 'string' && UUID_REGEXP.test(arg);
        },
        operator: 'isUUID'
    }
};

function _setExports(ndebug) {
    var keys = Object.keys(types);
    var out;

    /* re-export standard assert */
    if (process.env.NODE_NDEBUG) {
        out = noop;
    } else {
        out = function (arg, msg) {
            if (!arg) {
                _toss(msg, 'true', arg);
            }
        };
    }

    /* standard checks */
    keys.forEach(function (k) {
        if (ndebug) {
            out[k] = noop;
            return;
        }
        var type = types[k];
        out[k] = function (arg, msg) {
            if (!type.check(arg)) {
                _toss(msg, k, type.operator, arg, type.actual);
            }
        };
    });

    /* optional checks */
    keys.forEach(function (k) {
        var name = 'optional' + _capitalize(k);
        if (ndebug) {
            out[name] = noop;
            return;
        }
        var type = types[k];
        out[name] = function (arg, msg) {
            if (arg === undefined || arg === null) {
                return;
            }
            if (!type.check(arg)) {
                _toss(msg, k, type.operator, arg, type.actual);
            }
        };
    });

    /* arrayOf checks */
    keys.forEach(function (k) {
        var name = 'arrayOf' + _capitalize(k);
        if (ndebug) {
            out[name] = noop;
            return;
        }
        var type = types[k];
        var expected = '[' + k + ']';
        out[name] = function (arg, msg) {
            if (!Array.isArray(arg)) {
                _toss(msg, expected, type.operator, arg, type.actual);
            }
            var i;
            for (i = 0; i < arg.length; i++) {
                if (!type.check(arg[i])) {
                    _toss(msg, expected, type.operator, arg, type.actual);
                }
            }
        };
    });

    /* optionalArrayOf checks */
    keys.forEach(function (k) {
        var name = 'optionalArrayOf' + _capitalize(k);
        if (ndebug) {
            out[name] = noop;
            return;
        }
        var type = types[k];
        var expected = '[' + k + ']';
        out[name] = function (arg, msg) {
            if (arg === undefined || arg === null) {
                return;
            }
            if (!Array.isArray(arg)) {
                _toss(msg, expected, type.operator, arg, type.actual);
            }
            var i;
            for (i = 0; i < arg.length; i++) {
                if (!type.check(arg[i])) {
                    _toss(msg, expected, type.operator, arg, type.actual);
                }
            }
        };
    });

    /* re-export built-in assertions */
    Object.keys(assert).forEach(function (k) {
        if (k === 'AssertionError') {
            out[k] = assert[k];
            return;
        }
        if (ndebug) {
            out[k] = noop;
            return;
        }
        out[k] = assert[k];
    });

    /* export ourselves (for unit tests _only_) */
    out._setExports = _setExports;

    return out;
}

module.exports = _setExports(process.env.NODE_NDEBUG);

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../buffer/index.js */ "tjlA").Buffer, __webpack_require__(/*! ./../process/browser.js */ "8oxB")))

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYXNzZXJ0LXBsdXMvYXNzZXJ0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBO0FBQ0E7O0FBRUEsYUFBYSxtQkFBTyxDQUFDLG9CQUFRO0FBQzdCLGFBQWEsbUJBQU8sQ0FBQyxvQkFBUTtBQUM3QixXQUFXLG1CQUFPLENBQUMsa0JBQU07OztBQUd6Qjs7QUFFQTtBQUNBLGdDQUFnQyxFQUFFLGFBQWEsRUFBRSxhQUFhLEVBQUUsYUFBYSxFQUFFLGFBQWEsR0FBRzs7O0FBRy9GOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTs7QUFFQTtBQUNBO0FBQ0EsK0JBQStCLG1DQUFtQztBQUNsRSxLQUFLO0FBQ0w7QUFDQSwrQkFBK0Isb0NBQW9DO0FBQ25FLEtBQUs7QUFDTDtBQUNBLCtCQUErQixrQ0FBa0M7QUFDakUsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsK0JBQStCLDZCQUE2QixFQUFFO0FBQzlEO0FBQ0EsS0FBSztBQUNMO0FBQ0EsK0JBQStCLDJCQUEyQixFQUFFO0FBQzVEO0FBQ0EsS0FBSztBQUNMO0FBQ0EsK0JBQStCLDhCQUE4QixFQUFFO0FBQy9EO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSwrQkFBK0IsNEJBQTRCLEVBQUU7QUFDN0Q7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLCtCQUErQiw4QkFBOEIsRUFBRTtBQUMvRDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixnQkFBZ0I7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixnQkFBZ0I7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTs7QUFFQTtBQUNBOztBQUVBIiwiZmlsZSI6ImJ1aWxkL3ZlbmRvci92ZW5kb3IuYXNzZXJ0LXBsdXMuYmVjYjg3YjhhZmQ1OGY4ZTM0YjkuY2h1bmsuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMTIsIE1hcmsgQ2F2YWdlLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxyXG4vLyBDb3B5cmlnaHQgMjAxNSBKb3llbnQsIEluYy5cclxuXHJcbnZhciBhc3NlcnQgPSByZXF1aXJlKCdhc3NlcnQnKTtcclxudmFyIFN0cmVhbSA9IHJlcXVpcmUoJ3N0cmVhbScpLlN0cmVhbTtcclxudmFyIHV0aWwgPSByZXF1aXJlKCd1dGlsJyk7XHJcblxyXG5cclxuLy8vLS0tIEdsb2JhbHNcclxuXHJcbi8qIEpTU1RZTEVEICovXHJcbnZhciBVVUlEX1JFR0VYUCA9IC9eW2EtZkEtRjAtOV17OH0tW2EtZkEtRjAtOV17NH0tW2EtZkEtRjAtOV17NH0tW2EtZkEtRjAtOV17NH0tW2EtZkEtRjAtOV17MTJ9JC87XHJcblxyXG5cclxuLy8vLS0tIEludGVybmFsXHJcblxyXG5mdW5jdGlvbiBfY2FwaXRhbGl6ZShzdHIpIHtcclxuICAgIHJldHVybiAoc3RyLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgc3RyLnNsaWNlKDEpKTtcclxufVxyXG5cclxuZnVuY3Rpb24gX3Rvc3MobmFtZSwgZXhwZWN0ZWQsIG9wZXIsIGFyZywgYWN0dWFsKSB7XHJcbiAgICB0aHJvdyBuZXcgYXNzZXJ0LkFzc2VydGlvbkVycm9yKHtcclxuICAgICAgICBtZXNzYWdlOiB1dGlsLmZvcm1hdCgnJXMgKCVzKSBpcyByZXF1aXJlZCcsIG5hbWUsIGV4cGVjdGVkKSxcclxuICAgICAgICBhY3R1YWw6IChhY3R1YWwgPT09IHVuZGVmaW5lZCkgPyB0eXBlb2YgKGFyZykgOiBhY3R1YWwoYXJnKSxcclxuICAgICAgICBleHBlY3RlZDogZXhwZWN0ZWQsXHJcbiAgICAgICAgb3BlcmF0b3I6IG9wZXIgfHwgJz09PScsXHJcbiAgICAgICAgc3RhY2tTdGFydEZ1bmN0aW9uOiBfdG9zcy5jYWxsZXJcclxuICAgIH0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBfZ2V0Q2xhc3MoYXJnKSB7XHJcbiAgICByZXR1cm4gKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChhcmcpLnNsaWNlKDgsIC0xKSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG5vb3AoKSB7XHJcbiAgICAvLyBXaHkgZXZlbiBib3RoZXIgd2l0aCBhc3NlcnRzP1xyXG59XHJcblxyXG5cclxuLy8vLS0tIEV4cG9ydHNcclxuXHJcbnZhciB0eXBlcyA9IHtcclxuICAgIGJvb2w6IHtcclxuICAgICAgICBjaGVjazogZnVuY3Rpb24gKGFyZykgeyByZXR1cm4gdHlwZW9mIChhcmcpID09PSAnYm9vbGVhbic7IH1cclxuICAgIH0sXHJcbiAgICBmdW5jOiB7XHJcbiAgICAgICAgY2hlY2s6IGZ1bmN0aW9uIChhcmcpIHsgcmV0dXJuIHR5cGVvZiAoYXJnKSA9PT0gJ2Z1bmN0aW9uJzsgfVxyXG4gICAgfSxcclxuICAgIHN0cmluZzoge1xyXG4gICAgICAgIGNoZWNrOiBmdW5jdGlvbiAoYXJnKSB7IHJldHVybiB0eXBlb2YgKGFyZykgPT09ICdzdHJpbmcnOyB9XHJcbiAgICB9LFxyXG4gICAgb2JqZWN0OiB7XHJcbiAgICAgICAgY2hlY2s6IGZ1bmN0aW9uIChhcmcpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHR5cGVvZiAoYXJnKSA9PT0gJ29iamVjdCcgJiYgYXJnICE9PSBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBudW1iZXI6IHtcclxuICAgICAgICBjaGVjazogZnVuY3Rpb24gKGFyZykge1xyXG4gICAgICAgICAgICByZXR1cm4gdHlwZW9mIChhcmcpID09PSAnbnVtYmVyJyAmJiAhaXNOYU4oYXJnKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgZmluaXRlOiB7XHJcbiAgICAgICAgY2hlY2s6IGZ1bmN0aW9uIChhcmcpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHR5cGVvZiAoYXJnKSA9PT0gJ251bWJlcicgJiYgIWlzTmFOKGFyZykgJiYgaXNGaW5pdGUoYXJnKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgYnVmZmVyOiB7XHJcbiAgICAgICAgY2hlY2s6IGZ1bmN0aW9uIChhcmcpIHsgcmV0dXJuIEJ1ZmZlci5pc0J1ZmZlcihhcmcpOyB9LFxyXG4gICAgICAgIG9wZXJhdG9yOiAnQnVmZmVyLmlzQnVmZmVyJ1xyXG4gICAgfSxcclxuICAgIGFycmF5OiB7XHJcbiAgICAgICAgY2hlY2s6IGZ1bmN0aW9uIChhcmcpIHsgcmV0dXJuIEFycmF5LmlzQXJyYXkoYXJnKTsgfSxcclxuICAgICAgICBvcGVyYXRvcjogJ0FycmF5LmlzQXJyYXknXHJcbiAgICB9LFxyXG4gICAgc3RyZWFtOiB7XHJcbiAgICAgICAgY2hlY2s6IGZ1bmN0aW9uIChhcmcpIHsgcmV0dXJuIGFyZyBpbnN0YW5jZW9mIFN0cmVhbTsgfSxcclxuICAgICAgICBvcGVyYXRvcjogJ2luc3RhbmNlb2YnLFxyXG4gICAgICAgIGFjdHVhbDogX2dldENsYXNzXHJcbiAgICB9LFxyXG4gICAgZGF0ZToge1xyXG4gICAgICAgIGNoZWNrOiBmdW5jdGlvbiAoYXJnKSB7IHJldHVybiBhcmcgaW5zdGFuY2VvZiBEYXRlOyB9LFxyXG4gICAgICAgIG9wZXJhdG9yOiAnaW5zdGFuY2VvZicsXHJcbiAgICAgICAgYWN0dWFsOiBfZ2V0Q2xhc3NcclxuICAgIH0sXHJcbiAgICByZWdleHA6IHtcclxuICAgICAgICBjaGVjazogZnVuY3Rpb24gKGFyZykgeyByZXR1cm4gYXJnIGluc3RhbmNlb2YgUmVnRXhwOyB9LFxyXG4gICAgICAgIG9wZXJhdG9yOiAnaW5zdGFuY2VvZicsXHJcbiAgICAgICAgYWN0dWFsOiBfZ2V0Q2xhc3NcclxuICAgIH0sXHJcbiAgICB1dWlkOiB7XHJcbiAgICAgICAgY2hlY2s6IGZ1bmN0aW9uIChhcmcpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHR5cGVvZiAoYXJnKSA9PT0gJ3N0cmluZycgJiYgVVVJRF9SRUdFWFAudGVzdChhcmcpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgb3BlcmF0b3I6ICdpc1VVSUQnXHJcbiAgICB9XHJcbn07XHJcblxyXG5mdW5jdGlvbiBfc2V0RXhwb3J0cyhuZGVidWcpIHtcclxuICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXModHlwZXMpO1xyXG4gICAgdmFyIG91dDtcclxuXHJcbiAgICAvKiByZS1leHBvcnQgc3RhbmRhcmQgYXNzZXJ0ICovXHJcbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9OREVCVUcpIHtcclxuICAgICAgICBvdXQgPSBub29wO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBvdXQgPSBmdW5jdGlvbiAoYXJnLCBtc2cpIHtcclxuICAgICAgICAgICAgaWYgKCFhcmcpIHtcclxuICAgICAgICAgICAgICAgIF90b3NzKG1zZywgJ3RydWUnLCBhcmcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICAvKiBzdGFuZGFyZCBjaGVja3MgKi9cclxuICAgIGtleXMuZm9yRWFjaChmdW5jdGlvbiAoaykge1xyXG4gICAgICAgIGlmIChuZGVidWcpIHtcclxuICAgICAgICAgICAgb3V0W2tdID0gbm9vcDtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgdHlwZSA9IHR5cGVzW2tdO1xyXG4gICAgICAgIG91dFtrXSA9IGZ1bmN0aW9uIChhcmcsIG1zZykge1xyXG4gICAgICAgICAgICBpZiAoIXR5cGUuY2hlY2soYXJnKSkge1xyXG4gICAgICAgICAgICAgICAgX3Rvc3MobXNnLCBrLCB0eXBlLm9wZXJhdG9yLCBhcmcsIHR5cGUuYWN0dWFsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9KTtcclxuXHJcbiAgICAvKiBvcHRpb25hbCBjaGVja3MgKi9cclxuICAgIGtleXMuZm9yRWFjaChmdW5jdGlvbiAoaykge1xyXG4gICAgICAgIHZhciBuYW1lID0gJ29wdGlvbmFsJyArIF9jYXBpdGFsaXplKGspO1xyXG4gICAgICAgIGlmIChuZGVidWcpIHtcclxuICAgICAgICAgICAgb3V0W25hbWVdID0gbm9vcDtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgdHlwZSA9IHR5cGVzW2tdO1xyXG4gICAgICAgIG91dFtuYW1lXSA9IGZ1bmN0aW9uIChhcmcsIG1zZykge1xyXG4gICAgICAgICAgICBpZiAoYXJnID09PSB1bmRlZmluZWQgfHwgYXJnID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCF0eXBlLmNoZWNrKGFyZykpIHtcclxuICAgICAgICAgICAgICAgIF90b3NzKG1zZywgaywgdHlwZS5vcGVyYXRvciwgYXJnLCB0eXBlLmFjdHVhbCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfSk7XHJcblxyXG4gICAgLyogYXJyYXlPZiBjaGVja3MgKi9cclxuICAgIGtleXMuZm9yRWFjaChmdW5jdGlvbiAoaykge1xyXG4gICAgICAgIHZhciBuYW1lID0gJ2FycmF5T2YnICsgX2NhcGl0YWxpemUoayk7XHJcbiAgICAgICAgaWYgKG5kZWJ1Zykge1xyXG4gICAgICAgICAgICBvdXRbbmFtZV0gPSBub29wO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciB0eXBlID0gdHlwZXNba107XHJcbiAgICAgICAgdmFyIGV4cGVjdGVkID0gJ1snICsgayArICddJztcclxuICAgICAgICBvdXRbbmFtZV0gPSBmdW5jdGlvbiAoYXJnLCBtc2cpIHtcclxuICAgICAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KGFyZykpIHtcclxuICAgICAgICAgICAgICAgIF90b3NzKG1zZywgZXhwZWN0ZWQsIHR5cGUub3BlcmF0b3IsIGFyZywgdHlwZS5hY3R1YWwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBpO1xyXG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgYXJnLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXR5cGUuY2hlY2soYXJnW2ldKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIF90b3NzKG1zZywgZXhwZWN0ZWQsIHR5cGUub3BlcmF0b3IsIGFyZywgdHlwZS5hY3R1YWwpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH0pO1xyXG5cclxuICAgIC8qIG9wdGlvbmFsQXJyYXlPZiBjaGVja3MgKi9cclxuICAgIGtleXMuZm9yRWFjaChmdW5jdGlvbiAoaykge1xyXG4gICAgICAgIHZhciBuYW1lID0gJ29wdGlvbmFsQXJyYXlPZicgKyBfY2FwaXRhbGl6ZShrKTtcclxuICAgICAgICBpZiAobmRlYnVnKSB7XHJcbiAgICAgICAgICAgIG91dFtuYW1lXSA9IG5vb3A7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHR5cGUgPSB0eXBlc1trXTtcclxuICAgICAgICB2YXIgZXhwZWN0ZWQgPSAnWycgKyBrICsgJ10nO1xyXG4gICAgICAgIG91dFtuYW1lXSA9IGZ1bmN0aW9uIChhcmcsIG1zZykge1xyXG4gICAgICAgICAgICBpZiAoYXJnID09PSB1bmRlZmluZWQgfHwgYXJnID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KGFyZykpIHtcclxuICAgICAgICAgICAgICAgIF90b3NzKG1zZywgZXhwZWN0ZWQsIHR5cGUub3BlcmF0b3IsIGFyZywgdHlwZS5hY3R1YWwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBpO1xyXG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgYXJnLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXR5cGUuY2hlY2soYXJnW2ldKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIF90b3NzKG1zZywgZXhwZWN0ZWQsIHR5cGUub3BlcmF0b3IsIGFyZywgdHlwZS5hY3R1YWwpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH0pO1xyXG5cclxuICAgIC8qIHJlLWV4cG9ydCBidWlsdC1pbiBhc3NlcnRpb25zICovXHJcbiAgICBPYmplY3Qua2V5cyhhc3NlcnQpLmZvckVhY2goZnVuY3Rpb24gKGspIHtcclxuICAgICAgICBpZiAoayA9PT0gJ0Fzc2VydGlvbkVycm9yJykge1xyXG4gICAgICAgICAgICBvdXRba10gPSBhc3NlcnRba107XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG5kZWJ1Zykge1xyXG4gICAgICAgICAgICBvdXRba10gPSBub29wO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG91dFtrXSA9IGFzc2VydFtrXTtcclxuICAgIH0pO1xyXG5cclxuICAgIC8qIGV4cG9ydCBvdXJzZWx2ZXMgKGZvciB1bml0IHRlc3RzIF9vbmx5XykgKi9cclxuICAgIG91dC5fc2V0RXhwb3J0cyA9IF9zZXRFeHBvcnRzO1xyXG5cclxuICAgIHJldHVybiBvdXQ7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gX3NldEV4cG9ydHMocHJvY2Vzcy5lbnYuTk9ERV9OREVCVUcpO1xyXG4iXSwic291cmNlUm9vdCI6IiJ9