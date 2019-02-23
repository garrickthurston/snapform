(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["vendor/vendor.vm-browserify"],{

/***/ "BwZh":
/*!*********************************************!*\
  !*** ./node_modules/vm-browserify/index.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var indexOf = __webpack_require__(/*! indexof */ "7jRU");

var Object_keys = function (obj) {
    if (Object.keys) return Object.keys(obj)
    else {
        var res = [];
        for (var key in obj) res.push(key)
        return res;
    }
};

var forEach = function (xs, fn) {
    if (xs.forEach) return xs.forEach(fn)
    else for (var i = 0; i < xs.length; i++) {
        fn(xs[i], i, xs);
    }
};

var defineProp = (function() {
    try {
        Object.defineProperty({}, '_', {});
        return function(obj, name, value) {
            Object.defineProperty(obj, name, {
                writable: true,
                enumerable: false,
                configurable: true,
                value: value
            })
        };
    } catch(e) {
        return function(obj, name, value) {
            obj[name] = value;
        };
    }
}());

var globals = ['Array', 'Boolean', 'Date', 'Error', 'EvalError', 'Function',
'Infinity', 'JSON', 'Math', 'NaN', 'Number', 'Object', 'RangeError',
'ReferenceError', 'RegExp', 'String', 'SyntaxError', 'TypeError', 'URIError',
'decodeURI', 'decodeURIComponent', 'encodeURI', 'encodeURIComponent', 'escape',
'eval', 'isFinite', 'isNaN', 'parseFloat', 'parseInt', 'undefined', 'unescape'];

function Context() {}
Context.prototype = {};

var Script = exports.Script = function NodeScript (code) {
    if (!(this instanceof Script)) return new Script(code);
    this.code = code;
};

Script.prototype.runInContext = function (context) {
    if (!(context instanceof Context)) {
        throw new TypeError("needs a 'context' argument.");
    }
    
    var iframe = document.createElement('iframe');
    if (!iframe.style) iframe.style = {};
    iframe.style.display = 'none';
    
    document.body.appendChild(iframe);
    
    var win = iframe.contentWindow;
    var wEval = win.eval, wExecScript = win.execScript;

    if (!wEval && wExecScript) {
        // win.eval() magically appears when this is called in IE:
        wExecScript.call(win, 'null');
        wEval = win.eval;
    }
    
    forEach(Object_keys(context), function (key) {
        win[key] = context[key];
    });
    forEach(globals, function (key) {
        if (context[key]) {
            win[key] = context[key];
        }
    });
    
    var winKeys = Object_keys(win);

    var res = wEval.call(win, this.code);
    
    forEach(Object_keys(win), function (key) {
        // Avoid copying circular objects like `top` and `window` by only
        // updating existing context properties or new properties in the `win`
        // that was only introduced after the eval.
        if (key in context || indexOf(winKeys, key) === -1) {
            context[key] = win[key];
        }
    });

    forEach(globals, function (key) {
        if (!(key in context)) {
            defineProp(context, key, win[key]);
        }
    });
    
    document.body.removeChild(iframe);
    
    return res;
};

Script.prototype.runInThisContext = function () {
    return eval(this.code); // maybe...
};

Script.prototype.runInNewContext = function (context) {
    var ctx = Script.createContext(context);
    var res = this.runInContext(ctx);

    forEach(Object_keys(ctx), function (key) {
        context[key] = ctx[key];
    });

    return res;
};

forEach(Object_keys(Script.prototype), function (name) {
    exports[name] = Script[name] = function (code) {
        var s = Script(code);
        return s[name].apply(s, [].slice.call(arguments, 1));
    };
});

exports.createScript = function (code) {
    return exports.Script(code);
};

exports.createContext = Script.createContext = function (context) {
    var copy = new Context();
    if(typeof context === 'object') {
        forEach(Object_keys(context), function (key) {
            copy[key] = context[key];
        });
    }
    return copy;
};


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdm0tYnJvd3NlcmlmeS9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSxjQUFjLG1CQUFPLENBQUMscUJBQVM7O0FBRS9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHdCQUF3QixlQUFlO0FBQ3ZDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZ0NBQWdDLFNBQVM7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSwyQkFBMkI7QUFDM0I7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBIiwiZmlsZSI6ImJ1aWxkL3ZlbmRvci92ZW5kb3Iudm0tYnJvd3NlcmlmeS41ZjQ3MGQzNzhjODU1N2ZhOTJjNC5jaHVuay5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBpbmRleE9mID0gcmVxdWlyZSgnaW5kZXhvZicpO1xyXG5cclxudmFyIE9iamVjdF9rZXlzID0gZnVuY3Rpb24gKG9iaikge1xyXG4gICAgaWYgKE9iamVjdC5rZXlzKSByZXR1cm4gT2JqZWN0LmtleXMob2JqKVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgdmFyIHJlcyA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBvYmopIHJlcy5wdXNoKGtleSlcclxuICAgICAgICByZXR1cm4gcmVzO1xyXG4gICAgfVxyXG59O1xyXG5cclxudmFyIGZvckVhY2ggPSBmdW5jdGlvbiAoeHMsIGZuKSB7XHJcbiAgICBpZiAoeHMuZm9yRWFjaCkgcmV0dXJuIHhzLmZvckVhY2goZm4pXHJcbiAgICBlbHNlIGZvciAodmFyIGkgPSAwOyBpIDwgeHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBmbih4c1tpXSwgaSwgeHMpO1xyXG4gICAgfVxyXG59O1xyXG5cclxudmFyIGRlZmluZVByb3AgPSAoZnVuY3Rpb24oKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh7fSwgJ18nLCB7fSk7XHJcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKG9iaiwgbmFtZSwgdmFsdWUpIHtcclxuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwgbmFtZSwge1xyXG4gICAgICAgICAgICAgICAgd3JpdGFibGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH07XHJcbiAgICB9IGNhdGNoKGUpIHtcclxuICAgICAgICByZXR1cm4gZnVuY3Rpb24ob2JqLCBuYW1lLCB2YWx1ZSkge1xyXG4gICAgICAgICAgICBvYmpbbmFtZV0gPSB2YWx1ZTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG59KCkpO1xyXG5cclxudmFyIGdsb2JhbHMgPSBbJ0FycmF5JywgJ0Jvb2xlYW4nLCAnRGF0ZScsICdFcnJvcicsICdFdmFsRXJyb3InLCAnRnVuY3Rpb24nLFxyXG4nSW5maW5pdHknLCAnSlNPTicsICdNYXRoJywgJ05hTicsICdOdW1iZXInLCAnT2JqZWN0JywgJ1JhbmdlRXJyb3InLFxyXG4nUmVmZXJlbmNlRXJyb3InLCAnUmVnRXhwJywgJ1N0cmluZycsICdTeW50YXhFcnJvcicsICdUeXBlRXJyb3InLCAnVVJJRXJyb3InLFxyXG4nZGVjb2RlVVJJJywgJ2RlY29kZVVSSUNvbXBvbmVudCcsICdlbmNvZGVVUkknLCAnZW5jb2RlVVJJQ29tcG9uZW50JywgJ2VzY2FwZScsXHJcbidldmFsJywgJ2lzRmluaXRlJywgJ2lzTmFOJywgJ3BhcnNlRmxvYXQnLCAncGFyc2VJbnQnLCAndW5kZWZpbmVkJywgJ3VuZXNjYXBlJ107XHJcblxyXG5mdW5jdGlvbiBDb250ZXh0KCkge31cclxuQ29udGV4dC5wcm90b3R5cGUgPSB7fTtcclxuXHJcbnZhciBTY3JpcHQgPSBleHBvcnRzLlNjcmlwdCA9IGZ1bmN0aW9uIE5vZGVTY3JpcHQgKGNvZGUpIHtcclxuICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBTY3JpcHQpKSByZXR1cm4gbmV3IFNjcmlwdChjb2RlKTtcclxuICAgIHRoaXMuY29kZSA9IGNvZGU7XHJcbn07XHJcblxyXG5TY3JpcHQucHJvdG90eXBlLnJ1bkluQ29udGV4dCA9IGZ1bmN0aW9uIChjb250ZXh0KSB7XHJcbiAgICBpZiAoIShjb250ZXh0IGluc3RhbmNlb2YgQ29udGV4dCkpIHtcclxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwibmVlZHMgYSAnY29udGV4dCcgYXJndW1lbnQuXCIpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICB2YXIgaWZyYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaWZyYW1lJyk7XHJcbiAgICBpZiAoIWlmcmFtZS5zdHlsZSkgaWZyYW1lLnN0eWxlID0ge307XHJcbiAgICBpZnJhbWUuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgIFxyXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChpZnJhbWUpO1xyXG4gICAgXHJcbiAgICB2YXIgd2luID0gaWZyYW1lLmNvbnRlbnRXaW5kb3c7XHJcbiAgICB2YXIgd0V2YWwgPSB3aW4uZXZhbCwgd0V4ZWNTY3JpcHQgPSB3aW4uZXhlY1NjcmlwdDtcclxuXHJcbiAgICBpZiAoIXdFdmFsICYmIHdFeGVjU2NyaXB0KSB7XHJcbiAgICAgICAgLy8gd2luLmV2YWwoKSBtYWdpY2FsbHkgYXBwZWFycyB3aGVuIHRoaXMgaXMgY2FsbGVkIGluIElFOlxyXG4gICAgICAgIHdFeGVjU2NyaXB0LmNhbGwod2luLCAnbnVsbCcpO1xyXG4gICAgICAgIHdFdmFsID0gd2luLmV2YWw7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGZvckVhY2goT2JqZWN0X2tleXMoY29udGV4dCksIGZ1bmN0aW9uIChrZXkpIHtcclxuICAgICAgICB3aW5ba2V5XSA9IGNvbnRleHRba2V5XTtcclxuICAgIH0pO1xyXG4gICAgZm9yRWFjaChnbG9iYWxzLCBmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICAgICAgaWYgKGNvbnRleHRba2V5XSkge1xyXG4gICAgICAgICAgICB3aW5ba2V5XSA9IGNvbnRleHRba2V5XTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuICAgIFxyXG4gICAgdmFyIHdpbktleXMgPSBPYmplY3Rfa2V5cyh3aW4pO1xyXG5cclxuICAgIHZhciByZXMgPSB3RXZhbC5jYWxsKHdpbiwgdGhpcy5jb2RlKTtcclxuICAgIFxyXG4gICAgZm9yRWFjaChPYmplY3Rfa2V5cyh3aW4pLCBmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICAgICAgLy8gQXZvaWQgY29weWluZyBjaXJjdWxhciBvYmplY3RzIGxpa2UgYHRvcGAgYW5kIGB3aW5kb3dgIGJ5IG9ubHlcclxuICAgICAgICAvLyB1cGRhdGluZyBleGlzdGluZyBjb250ZXh0IHByb3BlcnRpZXMgb3IgbmV3IHByb3BlcnRpZXMgaW4gdGhlIGB3aW5gXHJcbiAgICAgICAgLy8gdGhhdCB3YXMgb25seSBpbnRyb2R1Y2VkIGFmdGVyIHRoZSBldmFsLlxyXG4gICAgICAgIGlmIChrZXkgaW4gY29udGV4dCB8fCBpbmRleE9mKHdpbktleXMsIGtleSkgPT09IC0xKSB7XHJcbiAgICAgICAgICAgIGNvbnRleHRba2V5XSA9IHdpbltrZXldO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIGZvckVhY2goZ2xvYmFscywgZnVuY3Rpb24gKGtleSkge1xyXG4gICAgICAgIGlmICghKGtleSBpbiBjb250ZXh0KSkge1xyXG4gICAgICAgICAgICBkZWZpbmVQcm9wKGNvbnRleHQsIGtleSwgd2luW2tleV0pO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgXHJcbiAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGlmcmFtZSk7XHJcbiAgICBcclxuICAgIHJldHVybiByZXM7XHJcbn07XHJcblxyXG5TY3JpcHQucHJvdG90eXBlLnJ1bkluVGhpc0NvbnRleHQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4gZXZhbCh0aGlzLmNvZGUpOyAvLyBtYXliZS4uLlxyXG59O1xyXG5cclxuU2NyaXB0LnByb3RvdHlwZS5ydW5Jbk5ld0NvbnRleHQgPSBmdW5jdGlvbiAoY29udGV4dCkge1xyXG4gICAgdmFyIGN0eCA9IFNjcmlwdC5jcmVhdGVDb250ZXh0KGNvbnRleHQpO1xyXG4gICAgdmFyIHJlcyA9IHRoaXMucnVuSW5Db250ZXh0KGN0eCk7XHJcblxyXG4gICAgZm9yRWFjaChPYmplY3Rfa2V5cyhjdHgpLCBmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICAgICAgY29udGV4dFtrZXldID0gY3R4W2tleV07XHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gcmVzO1xyXG59O1xyXG5cclxuZm9yRWFjaChPYmplY3Rfa2V5cyhTY3JpcHQucHJvdG90eXBlKSwgZnVuY3Rpb24gKG5hbWUpIHtcclxuICAgIGV4cG9ydHNbbmFtZV0gPSBTY3JpcHRbbmFtZV0gPSBmdW5jdGlvbiAoY29kZSkge1xyXG4gICAgICAgIHZhciBzID0gU2NyaXB0KGNvZGUpO1xyXG4gICAgICAgIHJldHVybiBzW25hbWVdLmFwcGx5KHMsIFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSk7XHJcbiAgICB9O1xyXG59KTtcclxuXHJcbmV4cG9ydHMuY3JlYXRlU2NyaXB0ID0gZnVuY3Rpb24gKGNvZGUpIHtcclxuICAgIHJldHVybiBleHBvcnRzLlNjcmlwdChjb2RlKTtcclxufTtcclxuXHJcbmV4cG9ydHMuY3JlYXRlQ29udGV4dCA9IFNjcmlwdC5jcmVhdGVDb250ZXh0ID0gZnVuY3Rpb24gKGNvbnRleHQpIHtcclxuICAgIHZhciBjb3B5ID0gbmV3IENvbnRleHQoKTtcclxuICAgIGlmKHR5cGVvZiBjb250ZXh0ID09PSAnb2JqZWN0Jykge1xyXG4gICAgICAgIGZvckVhY2goT2JqZWN0X2tleXMoY29udGV4dCksIGZ1bmN0aW9uIChrZXkpIHtcclxuICAgICAgICAgICAgY29weVtrZXldID0gY29udGV4dFtrZXldO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGNvcHk7XHJcbn07XHJcbiJdLCJzb3VyY2VSb290IjoiIn0=