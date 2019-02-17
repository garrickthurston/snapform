(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["vendor/vendor.json-stringify-safe"],{

/***/ "3/DG":
/*!*******************************************************!*\
  !*** ./node_modules/json-stringify-safe/stringify.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

exports = module.exports = stringify
exports.getSerialize = serializer

function stringify(obj, replacer, spaces, cycleReplacer) {
  return JSON.stringify(obj, serializer(replacer, cycleReplacer), spaces)
}

function serializer(replacer, cycleReplacer) {
  var stack = [], keys = []

  if (cycleReplacer == null) cycleReplacer = function(key, value) {
    if (stack[0] === value) return "[Circular ~]"
    return "[Circular ~." + keys.slice(0, stack.indexOf(value)).join(".") + "]"
  }

  return function(key, value) {
    if (stack.length > 0) {
      var thisPos = stack.indexOf(this)
      ~thisPos ? stack.splice(thisPos + 1) : stack.push(this)
      ~thisPos ? keys.splice(thisPos, Infinity, key) : keys.push(key)
      if (~stack.indexOf(value)) value = cycleReplacer.call(this, key, value)
    }
    else stack.push(value)

    return replacer == null ? value : replacer.call(this, key, value)
  }
}


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvanNvbi1zdHJpbmdpZnktc2FmZS9zdHJpbmdpZnkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSIsImZpbGUiOiJ2ZW5kb3IvdmVuZG9yLmpzb24tc3RyaW5naWZ5LXNhZmUuNGMwOGRiNWM0YjI2MjkwMDMwZGEuY2h1bmsuanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBzdHJpbmdpZnlcbmV4cG9ydHMuZ2V0U2VyaWFsaXplID0gc2VyaWFsaXplclxuXG5mdW5jdGlvbiBzdHJpbmdpZnkob2JqLCByZXBsYWNlciwgc3BhY2VzLCBjeWNsZVJlcGxhY2VyKSB7XG4gIHJldHVybiBKU09OLnN0cmluZ2lmeShvYmosIHNlcmlhbGl6ZXIocmVwbGFjZXIsIGN5Y2xlUmVwbGFjZXIpLCBzcGFjZXMpXG59XG5cbmZ1bmN0aW9uIHNlcmlhbGl6ZXIocmVwbGFjZXIsIGN5Y2xlUmVwbGFjZXIpIHtcbiAgdmFyIHN0YWNrID0gW10sIGtleXMgPSBbXVxuXG4gIGlmIChjeWNsZVJlcGxhY2VyID09IG51bGwpIGN5Y2xlUmVwbGFjZXIgPSBmdW5jdGlvbihrZXksIHZhbHVlKSB7XG4gICAgaWYgKHN0YWNrWzBdID09PSB2YWx1ZSkgcmV0dXJuIFwiW0NpcmN1bGFyIH5dXCJcbiAgICByZXR1cm4gXCJbQ2lyY3VsYXIgfi5cIiArIGtleXMuc2xpY2UoMCwgc3RhY2suaW5kZXhPZih2YWx1ZSkpLmpvaW4oXCIuXCIpICsgXCJdXCJcbiAgfVxuXG4gIHJldHVybiBmdW5jdGlvbihrZXksIHZhbHVlKSB7XG4gICAgaWYgKHN0YWNrLmxlbmd0aCA+IDApIHtcbiAgICAgIHZhciB0aGlzUG9zID0gc3RhY2suaW5kZXhPZih0aGlzKVxuICAgICAgfnRoaXNQb3MgPyBzdGFjay5zcGxpY2UodGhpc1BvcyArIDEpIDogc3RhY2sucHVzaCh0aGlzKVxuICAgICAgfnRoaXNQb3MgPyBrZXlzLnNwbGljZSh0aGlzUG9zLCBJbmZpbml0eSwga2V5KSA6IGtleXMucHVzaChrZXkpXG4gICAgICBpZiAofnN0YWNrLmluZGV4T2YodmFsdWUpKSB2YWx1ZSA9IGN5Y2xlUmVwbGFjZXIuY2FsbCh0aGlzLCBrZXksIHZhbHVlKVxuICAgIH1cbiAgICBlbHNlIHN0YWNrLnB1c2godmFsdWUpXG5cbiAgICByZXR1cm4gcmVwbGFjZXIgPT0gbnVsbCA/IHZhbHVlIDogcmVwbGFjZXIuY2FsbCh0aGlzLCBrZXksIHZhbHVlKVxuICB9XG59XG4iXSwic291cmNlUm9vdCI6IiJ9