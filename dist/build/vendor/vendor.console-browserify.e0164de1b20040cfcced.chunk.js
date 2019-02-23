(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["vendor/vendor.console-browserify"],{

/***/ "ziTh":
/*!**************************************************!*\
  !*** ./node_modules/console-browserify/index.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/*global window, global*/
var util = __webpack_require__(/*! util */ "7tlc")
var assert = __webpack_require__(/*! assert */ "9lTW")
var now = __webpack_require__(/*! date-now */ "LSWl")

var slice = Array.prototype.slice
var console
var times = {}

if (typeof global !== "undefined" && global.console) {
    console = global.console
} else if (typeof window !== "undefined" && window.console) {
    console = window.console
} else {
    console = {}
}

var functions = [
    [log, "log"],
    [info, "info"],
    [warn, "warn"],
    [error, "error"],
    [time, "time"],
    [timeEnd, "timeEnd"],
    [trace, "trace"],
    [dir, "dir"],
    [consoleAssert, "assert"]
]

for (var i = 0; i < functions.length; i++) {
    var tuple = functions[i]
    var f = tuple[0]
    var name = tuple[1]

    if (!console[name]) {
        console[name] = f
    }
}

module.exports = console

function log() {}

function info() {
    console.log.apply(console, arguments)
}

function warn() {
    console.log.apply(console, arguments)
}

function error() {
    console.warn.apply(console, arguments)
}

function time(label) {
    times[label] = now()
}

function timeEnd(label) {
    var time = times[label]
    if (!time) {
        throw new Error("No such label: " + label)
    }

    var duration = now() - time
    console.log(label + ": " + duration + "ms")
}

function trace() {
    var err = new Error()
    err.name = "Trace"
    err.message = util.format.apply(null, arguments)
    console.error(err.stack)
}

function dir(object) {
    console.log(util.inspect(object) + "\n")
}

function consoleAssert(expression) {
    if (!expression) {
        var arr = slice.call(arguments, 1)
        assert.ok(false, util.format.apply(null, arr))
    }
}

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../webpack/buildin/global.js */ "yLpj")))

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29uc29sZS1icm93c2VyaWZ5L2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBO0FBQ0EsV0FBVyxtQkFBTyxDQUFDLGtCQUFNO0FBQ3pCLGFBQWEsbUJBQU8sQ0FBQyxvQkFBUTtBQUM3QixVQUFVLG1CQUFPLENBQUMsc0JBQVU7O0FBRTVCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxlQUFlLHNCQUFzQjtBQUNyQztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImJ1aWxkL3ZlbmRvci92ZW5kb3IuY29uc29sZS1icm93c2VyaWZ5LmUwMTY0ZGUxYjIwMDQwY2ZjY2VkLmNodW5rLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypnbG9iYWwgd2luZG93LCBnbG9iYWwqL1xyXG52YXIgdXRpbCA9IHJlcXVpcmUoXCJ1dGlsXCIpXHJcbnZhciBhc3NlcnQgPSByZXF1aXJlKFwiYXNzZXJ0XCIpXHJcbnZhciBub3cgPSByZXF1aXJlKFwiZGF0ZS1ub3dcIilcclxuXHJcbnZhciBzbGljZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZVxyXG52YXIgY29uc29sZVxyXG52YXIgdGltZXMgPSB7fVxyXG5cclxuaWYgKHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgJiYgZ2xvYmFsLmNvbnNvbGUpIHtcclxuICAgIGNvbnNvbGUgPSBnbG9iYWwuY29uc29sZVxyXG59IGVsc2UgaWYgKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgJiYgd2luZG93LmNvbnNvbGUpIHtcclxuICAgIGNvbnNvbGUgPSB3aW5kb3cuY29uc29sZVxyXG59IGVsc2Uge1xyXG4gICAgY29uc29sZSA9IHt9XHJcbn1cclxuXHJcbnZhciBmdW5jdGlvbnMgPSBbXHJcbiAgICBbbG9nLCBcImxvZ1wiXSxcclxuICAgIFtpbmZvLCBcImluZm9cIl0sXHJcbiAgICBbd2FybiwgXCJ3YXJuXCJdLFxyXG4gICAgW2Vycm9yLCBcImVycm9yXCJdLFxyXG4gICAgW3RpbWUsIFwidGltZVwiXSxcclxuICAgIFt0aW1lRW5kLCBcInRpbWVFbmRcIl0sXHJcbiAgICBbdHJhY2UsIFwidHJhY2VcIl0sXHJcbiAgICBbZGlyLCBcImRpclwiXSxcclxuICAgIFtjb25zb2xlQXNzZXJ0LCBcImFzc2VydFwiXVxyXG5dXHJcblxyXG5mb3IgKHZhciBpID0gMDsgaSA8IGZ1bmN0aW9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgdmFyIHR1cGxlID0gZnVuY3Rpb25zW2ldXHJcbiAgICB2YXIgZiA9IHR1cGxlWzBdXHJcbiAgICB2YXIgbmFtZSA9IHR1cGxlWzFdXHJcblxyXG4gICAgaWYgKCFjb25zb2xlW25hbWVdKSB7XHJcbiAgICAgICAgY29uc29sZVtuYW1lXSA9IGZcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBjb25zb2xlXHJcblxyXG5mdW5jdGlvbiBsb2coKSB7fVxyXG5cclxuZnVuY3Rpb24gaW5mbygpIHtcclxuICAgIGNvbnNvbGUubG9nLmFwcGx5KGNvbnNvbGUsIGFyZ3VtZW50cylcclxufVxyXG5cclxuZnVuY3Rpb24gd2FybigpIHtcclxuICAgIGNvbnNvbGUubG9nLmFwcGx5KGNvbnNvbGUsIGFyZ3VtZW50cylcclxufVxyXG5cclxuZnVuY3Rpb24gZXJyb3IoKSB7XHJcbiAgICBjb25zb2xlLndhcm4uYXBwbHkoY29uc29sZSwgYXJndW1lbnRzKVxyXG59XHJcblxyXG5mdW5jdGlvbiB0aW1lKGxhYmVsKSB7XHJcbiAgICB0aW1lc1tsYWJlbF0gPSBub3coKVxyXG59XHJcblxyXG5mdW5jdGlvbiB0aW1lRW5kKGxhYmVsKSB7XHJcbiAgICB2YXIgdGltZSA9IHRpbWVzW2xhYmVsXVxyXG4gICAgaWYgKCF0aW1lKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTm8gc3VjaCBsYWJlbDogXCIgKyBsYWJlbClcclxuICAgIH1cclxuXHJcbiAgICB2YXIgZHVyYXRpb24gPSBub3coKSAtIHRpbWVcclxuICAgIGNvbnNvbGUubG9nKGxhYmVsICsgXCI6IFwiICsgZHVyYXRpb24gKyBcIm1zXCIpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHRyYWNlKCkge1xyXG4gICAgdmFyIGVyciA9IG5ldyBFcnJvcigpXHJcbiAgICBlcnIubmFtZSA9IFwiVHJhY2VcIlxyXG4gICAgZXJyLm1lc3NhZ2UgPSB1dGlsLmZvcm1hdC5hcHBseShudWxsLCBhcmd1bWVudHMpXHJcbiAgICBjb25zb2xlLmVycm9yKGVyci5zdGFjaylcclxufVxyXG5cclxuZnVuY3Rpb24gZGlyKG9iamVjdCkge1xyXG4gICAgY29uc29sZS5sb2codXRpbC5pbnNwZWN0KG9iamVjdCkgKyBcIlxcblwiKVxyXG59XHJcblxyXG5mdW5jdGlvbiBjb25zb2xlQXNzZXJ0KGV4cHJlc3Npb24pIHtcclxuICAgIGlmICghZXhwcmVzc2lvbikge1xyXG4gICAgICAgIHZhciBhcnIgPSBzbGljZS5jYWxsKGFyZ3VtZW50cywgMSlcclxuICAgICAgICBhc3NlcnQub2soZmFsc2UsIHV0aWwuZm9ybWF0LmFwcGx5KG51bGwsIGFycikpXHJcbiAgICB9XHJcbn1cclxuIl0sInNvdXJjZVJvb3QiOiIifQ==