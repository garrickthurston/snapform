(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["vendor/vendor.resolve-pathname"],{

/***/ "Rh1G":
/*!************************************************!*\
  !*** ./node_modules/resolve-pathname/index.js ***!
  \************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
function isAbsolute(pathname) {
  return pathname.charAt(0) === '/';
}

// About 1.5x faster than the two-arg version of Array#splice()
function spliceOne(list, index) {
  for (var i = index, k = i + 1, n = list.length; k < n; i += 1, k += 1) {
    list[i] = list[k];
  }

  list.pop();
}

// This implementation is based heavily on node's url.parse
function resolvePathname(to) {
  var from = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

  var toParts = to && to.split('/') || [];
  var fromParts = from && from.split('/') || [];

  var isToAbs = to && isAbsolute(to);
  var isFromAbs = from && isAbsolute(from);
  var mustEndAbs = isToAbs || isFromAbs;

  if (to && isAbsolute(to)) {
    // to is absolute
    fromParts = toParts;
  } else if (toParts.length) {
    // to is relative, drop the filename
    fromParts.pop();
    fromParts = fromParts.concat(toParts);
  }

  if (!fromParts.length) return '/';

  var hasTrailingSlash = void 0;
  if (fromParts.length) {
    var last = fromParts[fromParts.length - 1];
    hasTrailingSlash = last === '.' || last === '..' || last === '';
  } else {
    hasTrailingSlash = false;
  }

  var up = 0;
  for (var i = fromParts.length; i >= 0; i--) {
    var part = fromParts[i];

    if (part === '.') {
      spliceOne(fromParts, i);
    } else if (part === '..') {
      spliceOne(fromParts, i);
      up++;
    } else if (up) {
      spliceOne(fromParts, i);
      up--;
    }
  }

  if (!mustEndAbs) for (; up--; up) {
    fromParts.unshift('..');
  }if (mustEndAbs && fromParts[0] !== '' && (!fromParts[0] || !isAbsolute(fromParts[0]))) fromParts.unshift('');

  var result = fromParts.join('/');

  if (hasTrailingSlash && result.substr(-1) !== '/') result += '/';

  return result;
}

/* harmony default export */ __webpack_exports__["default"] = (resolvePathname);

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcmVzb2x2ZS1wYXRobmFtZS9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGlEQUFpRCxPQUFPO0FBQ3hEO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQSxnQ0FBZ0MsUUFBUTtBQUN4Qzs7QUFFQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7O0FBRUEseUJBQXlCLE1BQU07QUFDL0I7QUFDQSxHQUFHOztBQUVIOztBQUVBOztBQUVBO0FBQ0E7O0FBRWUsOEVBQWUsRSIsImZpbGUiOiJidWlsZC92ZW5kb3IvdmVuZG9yLnJlc29sdmUtcGF0aG5hbWUuZDkxZDgxODgyYWNjMWMyYzJkZjguY2h1bmsuanMiLCJzb3VyY2VzQ29udGVudCI6WyJmdW5jdGlvbiBpc0Fic29sdXRlKHBhdGhuYW1lKSB7XHJcbiAgcmV0dXJuIHBhdGhuYW1lLmNoYXJBdCgwKSA9PT0gJy8nO1xyXG59XHJcblxyXG4vLyBBYm91dCAxLjV4IGZhc3RlciB0aGFuIHRoZSB0d28tYXJnIHZlcnNpb24gb2YgQXJyYXkjc3BsaWNlKClcclxuZnVuY3Rpb24gc3BsaWNlT25lKGxpc3QsIGluZGV4KSB7XHJcbiAgZm9yICh2YXIgaSA9IGluZGV4LCBrID0gaSArIDEsIG4gPSBsaXN0Lmxlbmd0aDsgayA8IG47IGkgKz0gMSwgayArPSAxKSB7XHJcbiAgICBsaXN0W2ldID0gbGlzdFtrXTtcclxuICB9XHJcblxyXG4gIGxpc3QucG9wKCk7XHJcbn1cclxuXHJcbi8vIFRoaXMgaW1wbGVtZW50YXRpb24gaXMgYmFzZWQgaGVhdmlseSBvbiBub2RlJ3MgdXJsLnBhcnNlXHJcbmZ1bmN0aW9uIHJlc29sdmVQYXRobmFtZSh0bykge1xyXG4gIHZhciBmcm9tID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiAnJztcclxuXHJcbiAgdmFyIHRvUGFydHMgPSB0byAmJiB0by5zcGxpdCgnLycpIHx8IFtdO1xyXG4gIHZhciBmcm9tUGFydHMgPSBmcm9tICYmIGZyb20uc3BsaXQoJy8nKSB8fCBbXTtcclxuXHJcbiAgdmFyIGlzVG9BYnMgPSB0byAmJiBpc0Fic29sdXRlKHRvKTtcclxuICB2YXIgaXNGcm9tQWJzID0gZnJvbSAmJiBpc0Fic29sdXRlKGZyb20pO1xyXG4gIHZhciBtdXN0RW5kQWJzID0gaXNUb0FicyB8fCBpc0Zyb21BYnM7XHJcblxyXG4gIGlmICh0byAmJiBpc0Fic29sdXRlKHRvKSkge1xyXG4gICAgLy8gdG8gaXMgYWJzb2x1dGVcclxuICAgIGZyb21QYXJ0cyA9IHRvUGFydHM7XHJcbiAgfSBlbHNlIGlmICh0b1BhcnRzLmxlbmd0aCkge1xyXG4gICAgLy8gdG8gaXMgcmVsYXRpdmUsIGRyb3AgdGhlIGZpbGVuYW1lXHJcbiAgICBmcm9tUGFydHMucG9wKCk7XHJcbiAgICBmcm9tUGFydHMgPSBmcm9tUGFydHMuY29uY2F0KHRvUGFydHMpO1xyXG4gIH1cclxuXHJcbiAgaWYgKCFmcm9tUGFydHMubGVuZ3RoKSByZXR1cm4gJy8nO1xyXG5cclxuICB2YXIgaGFzVHJhaWxpbmdTbGFzaCA9IHZvaWQgMDtcclxuICBpZiAoZnJvbVBhcnRzLmxlbmd0aCkge1xyXG4gICAgdmFyIGxhc3QgPSBmcm9tUGFydHNbZnJvbVBhcnRzLmxlbmd0aCAtIDFdO1xyXG4gICAgaGFzVHJhaWxpbmdTbGFzaCA9IGxhc3QgPT09ICcuJyB8fCBsYXN0ID09PSAnLi4nIHx8IGxhc3QgPT09ICcnO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBoYXNUcmFpbGluZ1NsYXNoID0gZmFsc2U7XHJcbiAgfVxyXG5cclxuICB2YXIgdXAgPSAwO1xyXG4gIGZvciAodmFyIGkgPSBmcm9tUGFydHMubGVuZ3RoOyBpID49IDA7IGktLSkge1xyXG4gICAgdmFyIHBhcnQgPSBmcm9tUGFydHNbaV07XHJcblxyXG4gICAgaWYgKHBhcnQgPT09ICcuJykge1xyXG4gICAgICBzcGxpY2VPbmUoZnJvbVBhcnRzLCBpKTtcclxuICAgIH0gZWxzZSBpZiAocGFydCA9PT0gJy4uJykge1xyXG4gICAgICBzcGxpY2VPbmUoZnJvbVBhcnRzLCBpKTtcclxuICAgICAgdXArKztcclxuICAgIH0gZWxzZSBpZiAodXApIHtcclxuICAgICAgc3BsaWNlT25lKGZyb21QYXJ0cywgaSk7XHJcbiAgICAgIHVwLS07XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBpZiAoIW11c3RFbmRBYnMpIGZvciAoOyB1cC0tOyB1cCkge1xyXG4gICAgZnJvbVBhcnRzLnVuc2hpZnQoJy4uJyk7XHJcbiAgfWlmIChtdXN0RW5kQWJzICYmIGZyb21QYXJ0c1swXSAhPT0gJycgJiYgKCFmcm9tUGFydHNbMF0gfHwgIWlzQWJzb2x1dGUoZnJvbVBhcnRzWzBdKSkpIGZyb21QYXJ0cy51bnNoaWZ0KCcnKTtcclxuXHJcbiAgdmFyIHJlc3VsdCA9IGZyb21QYXJ0cy5qb2luKCcvJyk7XHJcblxyXG4gIGlmIChoYXNUcmFpbGluZ1NsYXNoICYmIHJlc3VsdC5zdWJzdHIoLTEpICE9PSAnLycpIHJlc3VsdCArPSAnLyc7XHJcblxyXG4gIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IHJlc29sdmVQYXRobmFtZTsiXSwic291cmNlUm9vdCI6IiJ9