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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdm0tYnJvd3NlcmlmeS9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSxjQUFjLG1CQUFPLENBQUMscUJBQVM7O0FBRS9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHdCQUF3QixlQUFlO0FBQ3ZDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZ0NBQWdDLFNBQVM7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSwyQkFBMkI7QUFDM0I7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBIiwiZmlsZSI6ImJ1aWxkL3ZlbmRvci92ZW5kb3Iudm0tYnJvd3NlcmlmeS5iZjg5MjQ1MTgzMDlkZTFhZTc5Ny5jaHVuay5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBpbmRleE9mID0gcmVxdWlyZSgnaW5kZXhvZicpO1xuXG52YXIgT2JqZWN0X2tleXMgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgaWYgKE9iamVjdC5rZXlzKSByZXR1cm4gT2JqZWN0LmtleXMob2JqKVxuICAgIGVsc2Uge1xuICAgICAgICB2YXIgcmVzID0gW107XG4gICAgICAgIGZvciAodmFyIGtleSBpbiBvYmopIHJlcy5wdXNoKGtleSlcbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG59O1xuXG52YXIgZm9yRWFjaCA9IGZ1bmN0aW9uICh4cywgZm4pIHtcbiAgICBpZiAoeHMuZm9yRWFjaCkgcmV0dXJuIHhzLmZvckVhY2goZm4pXG4gICAgZWxzZSBmb3IgKHZhciBpID0gMDsgaSA8IHhzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGZuKHhzW2ldLCBpLCB4cyk7XG4gICAgfVxufTtcblxudmFyIGRlZmluZVByb3AgPSAoZnVuY3Rpb24oKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHt9LCAnXycsIHt9KTtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKG9iaiwgbmFtZSwgdmFsdWUpIHtcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIG5hbWUsIHtcbiAgICAgICAgICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlXG4gICAgICAgICAgICB9KVxuICAgICAgICB9O1xuICAgIH0gY2F0Y2goZSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24ob2JqLCBuYW1lLCB2YWx1ZSkge1xuICAgICAgICAgICAgb2JqW25hbWVdID0gdmFsdWU7XG4gICAgICAgIH07XG4gICAgfVxufSgpKTtcblxudmFyIGdsb2JhbHMgPSBbJ0FycmF5JywgJ0Jvb2xlYW4nLCAnRGF0ZScsICdFcnJvcicsICdFdmFsRXJyb3InLCAnRnVuY3Rpb24nLFxuJ0luZmluaXR5JywgJ0pTT04nLCAnTWF0aCcsICdOYU4nLCAnTnVtYmVyJywgJ09iamVjdCcsICdSYW5nZUVycm9yJyxcbidSZWZlcmVuY2VFcnJvcicsICdSZWdFeHAnLCAnU3RyaW5nJywgJ1N5bnRheEVycm9yJywgJ1R5cGVFcnJvcicsICdVUklFcnJvcicsXG4nZGVjb2RlVVJJJywgJ2RlY29kZVVSSUNvbXBvbmVudCcsICdlbmNvZGVVUkknLCAnZW5jb2RlVVJJQ29tcG9uZW50JywgJ2VzY2FwZScsXG4nZXZhbCcsICdpc0Zpbml0ZScsICdpc05hTicsICdwYXJzZUZsb2F0JywgJ3BhcnNlSW50JywgJ3VuZGVmaW5lZCcsICd1bmVzY2FwZSddO1xuXG5mdW5jdGlvbiBDb250ZXh0KCkge31cbkNvbnRleHQucHJvdG90eXBlID0ge307XG5cbnZhciBTY3JpcHQgPSBleHBvcnRzLlNjcmlwdCA9IGZ1bmN0aW9uIE5vZGVTY3JpcHQgKGNvZGUpIHtcbiAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgU2NyaXB0KSkgcmV0dXJuIG5ldyBTY3JpcHQoY29kZSk7XG4gICAgdGhpcy5jb2RlID0gY29kZTtcbn07XG5cblNjcmlwdC5wcm90b3R5cGUucnVuSW5Db250ZXh0ID0gZnVuY3Rpb24gKGNvbnRleHQpIHtcbiAgICBpZiAoIShjb250ZXh0IGluc3RhbmNlb2YgQ29udGV4dCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIm5lZWRzIGEgJ2NvbnRleHQnIGFyZ3VtZW50LlwiKTtcbiAgICB9XG4gICAgXG4gICAgdmFyIGlmcmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lmcmFtZScpO1xuICAgIGlmICghaWZyYW1lLnN0eWxlKSBpZnJhbWUuc3R5bGUgPSB7fTtcbiAgICBpZnJhbWUuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICBcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGlmcmFtZSk7XG4gICAgXG4gICAgdmFyIHdpbiA9IGlmcmFtZS5jb250ZW50V2luZG93O1xuICAgIHZhciB3RXZhbCA9IHdpbi5ldmFsLCB3RXhlY1NjcmlwdCA9IHdpbi5leGVjU2NyaXB0O1xuXG4gICAgaWYgKCF3RXZhbCAmJiB3RXhlY1NjcmlwdCkge1xuICAgICAgICAvLyB3aW4uZXZhbCgpIG1hZ2ljYWxseSBhcHBlYXJzIHdoZW4gdGhpcyBpcyBjYWxsZWQgaW4gSUU6XG4gICAgICAgIHdFeGVjU2NyaXB0LmNhbGwod2luLCAnbnVsbCcpO1xuICAgICAgICB3RXZhbCA9IHdpbi5ldmFsO1xuICAgIH1cbiAgICBcbiAgICBmb3JFYWNoKE9iamVjdF9rZXlzKGNvbnRleHQpLCBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgIHdpbltrZXldID0gY29udGV4dFtrZXldO1xuICAgIH0pO1xuICAgIGZvckVhY2goZ2xvYmFscywgZnVuY3Rpb24gKGtleSkge1xuICAgICAgICBpZiAoY29udGV4dFtrZXldKSB7XG4gICAgICAgICAgICB3aW5ba2V5XSA9IGNvbnRleHRba2V5XTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIFxuICAgIHZhciB3aW5LZXlzID0gT2JqZWN0X2tleXMod2luKTtcblxuICAgIHZhciByZXMgPSB3RXZhbC5jYWxsKHdpbiwgdGhpcy5jb2RlKTtcbiAgICBcbiAgICBmb3JFYWNoKE9iamVjdF9rZXlzKHdpbiksIGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgLy8gQXZvaWQgY29weWluZyBjaXJjdWxhciBvYmplY3RzIGxpa2UgYHRvcGAgYW5kIGB3aW5kb3dgIGJ5IG9ubHlcbiAgICAgICAgLy8gdXBkYXRpbmcgZXhpc3RpbmcgY29udGV4dCBwcm9wZXJ0aWVzIG9yIG5ldyBwcm9wZXJ0aWVzIGluIHRoZSBgd2luYFxuICAgICAgICAvLyB0aGF0IHdhcyBvbmx5IGludHJvZHVjZWQgYWZ0ZXIgdGhlIGV2YWwuXG4gICAgICAgIGlmIChrZXkgaW4gY29udGV4dCB8fCBpbmRleE9mKHdpbktleXMsIGtleSkgPT09IC0xKSB7XG4gICAgICAgICAgICBjb250ZXh0W2tleV0gPSB3aW5ba2V5XTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgZm9yRWFjaChnbG9iYWxzLCBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgIGlmICghKGtleSBpbiBjb250ZXh0KSkge1xuICAgICAgICAgICAgZGVmaW5lUHJvcChjb250ZXh0LCBrZXksIHdpbltrZXldKTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIFxuICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoaWZyYW1lKTtcbiAgICBcbiAgICByZXR1cm4gcmVzO1xufTtcblxuU2NyaXB0LnByb3RvdHlwZS5ydW5JblRoaXNDb250ZXh0ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBldmFsKHRoaXMuY29kZSk7IC8vIG1heWJlLi4uXG59O1xuXG5TY3JpcHQucHJvdG90eXBlLnJ1bkluTmV3Q29udGV4dCA9IGZ1bmN0aW9uIChjb250ZXh0KSB7XG4gICAgdmFyIGN0eCA9IFNjcmlwdC5jcmVhdGVDb250ZXh0KGNvbnRleHQpO1xuICAgIHZhciByZXMgPSB0aGlzLnJ1bkluQ29udGV4dChjdHgpO1xuXG4gICAgZm9yRWFjaChPYmplY3Rfa2V5cyhjdHgpLCBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgIGNvbnRleHRba2V5XSA9IGN0eFtrZXldO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJlcztcbn07XG5cbmZvckVhY2goT2JqZWN0X2tleXMoU2NyaXB0LnByb3RvdHlwZSksIGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgZXhwb3J0c1tuYW1lXSA9IFNjcmlwdFtuYW1lXSA9IGZ1bmN0aW9uIChjb2RlKSB7XG4gICAgICAgIHZhciBzID0gU2NyaXB0KGNvZGUpO1xuICAgICAgICByZXR1cm4gc1tuYW1lXS5hcHBseShzLCBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpO1xuICAgIH07XG59KTtcblxuZXhwb3J0cy5jcmVhdGVTY3JpcHQgPSBmdW5jdGlvbiAoY29kZSkge1xuICAgIHJldHVybiBleHBvcnRzLlNjcmlwdChjb2RlKTtcbn07XG5cbmV4cG9ydHMuY3JlYXRlQ29udGV4dCA9IFNjcmlwdC5jcmVhdGVDb250ZXh0ID0gZnVuY3Rpb24gKGNvbnRleHQpIHtcbiAgICB2YXIgY29weSA9IG5ldyBDb250ZXh0KCk7XG4gICAgaWYodHlwZW9mIGNvbnRleHQgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIGZvckVhY2goT2JqZWN0X2tleXMoY29udGV4dCksIGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICAgIGNvcHlba2V5XSA9IGNvbnRleHRba2V5XTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBjb3B5O1xufTtcbiJdLCJzb3VyY2VSb290IjoiIn0=