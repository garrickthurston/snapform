(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["vendor/vendor.delayed-stream"],{

/***/ "2Va9":
/*!***********************************************************!*\
  !*** ./node_modules/delayed-stream/lib/delayed_stream.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Stream = __webpack_require__(/*! stream */ "1IWx").Stream;
var util = __webpack_require__(/*! util */ "7tlc");

module.exports = DelayedStream;
function DelayedStream() {
  this.source = null;
  this.dataSize = 0;
  this.maxDataSize = 1024 * 1024;
  this.pauseStream = true;

  this._maxDataSizeExceeded = false;
  this._released = false;
  this._bufferedEvents = [];
}
util.inherits(DelayedStream, Stream);

DelayedStream.create = function(source, options) {
  var delayedStream = new this();

  options = options || {};
  for (var option in options) {
    delayedStream[option] = options[option];
  }

  delayedStream.source = source;

  var realEmit = source.emit;
  source.emit = function() {
    delayedStream._handleEmit(arguments);
    return realEmit.apply(source, arguments);
  };

  source.on('error', function() {});
  if (delayedStream.pauseStream) {
    source.pause();
  }

  return delayedStream;
};

Object.defineProperty(DelayedStream.prototype, 'readable', {
  configurable: true,
  enumerable: true,
  get: function() {
    return this.source.readable;
  }
});

DelayedStream.prototype.setEncoding = function() {
  return this.source.setEncoding.apply(this.source, arguments);
};

DelayedStream.prototype.resume = function() {
  if (!this._released) {
    this.release();
  }

  this.source.resume();
};

DelayedStream.prototype.pause = function() {
  this.source.pause();
};

DelayedStream.prototype.release = function() {
  this._released = true;

  this._bufferedEvents.forEach(function(args) {
    this.emit.apply(this, args);
  }.bind(this));
  this._bufferedEvents = [];
};

DelayedStream.prototype.pipe = function() {
  var r = Stream.prototype.pipe.apply(this, arguments);
  this.resume();
  return r;
};

DelayedStream.prototype._handleEmit = function(args) {
  if (this._released) {
    this.emit.apply(this, args);
    return;
  }

  if (args[0] === 'data') {
    this.dataSize += args[1].length;
    this._checkIfMaxDataSizeExceeded();
  }

  this._bufferedEvents.push(args);
};

DelayedStream.prototype._checkIfMaxDataSizeExceeded = function() {
  if (this._maxDataSizeExceeded) {
    return;
  }

  if (this.dataSize <= this.maxDataSize) {
    return;
  }

  this._maxDataSizeExceeded = true;
  var message =
    'DelayedStream#maxDataSize of ' + this.maxDataSize + ' bytes exceeded.'
  this.emit('error', new Error(message));
};


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZGVsYXllZC1zdHJlYW0vbGliL2RlbGF5ZWRfc3RyZWFtLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBLGFBQWEsbUJBQU8sQ0FBQyxvQkFBUTtBQUM3QixXQUFXLG1CQUFPLENBQUMsa0JBQU07O0FBRXpCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxrQ0FBa0M7QUFDbEM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYnVpbGQvdmVuZG9yL3ZlbmRvci5kZWxheWVkLXN0cmVhbS5hNGI3MmQ3YzgyM2M2ZjE2ZDFjMi5jaHVuay5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBTdHJlYW0gPSByZXF1aXJlKCdzdHJlYW0nKS5TdHJlYW07XHJcbnZhciB1dGlsID0gcmVxdWlyZSgndXRpbCcpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBEZWxheWVkU3RyZWFtO1xyXG5mdW5jdGlvbiBEZWxheWVkU3RyZWFtKCkge1xyXG4gIHRoaXMuc291cmNlID0gbnVsbDtcclxuICB0aGlzLmRhdGFTaXplID0gMDtcclxuICB0aGlzLm1heERhdGFTaXplID0gMTAyNCAqIDEwMjQ7XHJcbiAgdGhpcy5wYXVzZVN0cmVhbSA9IHRydWU7XHJcblxyXG4gIHRoaXMuX21heERhdGFTaXplRXhjZWVkZWQgPSBmYWxzZTtcclxuICB0aGlzLl9yZWxlYXNlZCA9IGZhbHNlO1xyXG4gIHRoaXMuX2J1ZmZlcmVkRXZlbnRzID0gW107XHJcbn1cclxudXRpbC5pbmhlcml0cyhEZWxheWVkU3RyZWFtLCBTdHJlYW0pO1xyXG5cclxuRGVsYXllZFN0cmVhbS5jcmVhdGUgPSBmdW5jdGlvbihzb3VyY2UsIG9wdGlvbnMpIHtcclxuICB2YXIgZGVsYXllZFN0cmVhbSA9IG5ldyB0aGlzKCk7XHJcblxyXG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xyXG4gIGZvciAodmFyIG9wdGlvbiBpbiBvcHRpb25zKSB7XHJcbiAgICBkZWxheWVkU3RyZWFtW29wdGlvbl0gPSBvcHRpb25zW29wdGlvbl07XHJcbiAgfVxyXG5cclxuICBkZWxheWVkU3RyZWFtLnNvdXJjZSA9IHNvdXJjZTtcclxuXHJcbiAgdmFyIHJlYWxFbWl0ID0gc291cmNlLmVtaXQ7XHJcbiAgc291cmNlLmVtaXQgPSBmdW5jdGlvbigpIHtcclxuICAgIGRlbGF5ZWRTdHJlYW0uX2hhbmRsZUVtaXQoYXJndW1lbnRzKTtcclxuICAgIHJldHVybiByZWFsRW1pdC5hcHBseShzb3VyY2UsIGFyZ3VtZW50cyk7XHJcbiAgfTtcclxuXHJcbiAgc291cmNlLm9uKCdlcnJvcicsIGZ1bmN0aW9uKCkge30pO1xyXG4gIGlmIChkZWxheWVkU3RyZWFtLnBhdXNlU3RyZWFtKSB7XHJcbiAgICBzb3VyY2UucGF1c2UoKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBkZWxheWVkU3RyZWFtO1xyXG59O1xyXG5cclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KERlbGF5ZWRTdHJlYW0ucHJvdG90eXBlLCAncmVhZGFibGUnLCB7XHJcbiAgY29uZmlndXJhYmxlOiB0cnVlLFxyXG4gIGVudW1lcmFibGU6IHRydWUsXHJcbiAgZ2V0OiBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLnNvdXJjZS5yZWFkYWJsZTtcclxuICB9XHJcbn0pO1xyXG5cclxuRGVsYXllZFN0cmVhbS5wcm90b3R5cGUuc2V0RW5jb2RpbmcgPSBmdW5jdGlvbigpIHtcclxuICByZXR1cm4gdGhpcy5zb3VyY2Uuc2V0RW5jb2RpbmcuYXBwbHkodGhpcy5zb3VyY2UsIGFyZ3VtZW50cyk7XHJcbn07XHJcblxyXG5EZWxheWVkU3RyZWFtLnByb3RvdHlwZS5yZXN1bWUgPSBmdW5jdGlvbigpIHtcclxuICBpZiAoIXRoaXMuX3JlbGVhc2VkKSB7XHJcbiAgICB0aGlzLnJlbGVhc2UoKTtcclxuICB9XHJcblxyXG4gIHRoaXMuc291cmNlLnJlc3VtZSgpO1xyXG59O1xyXG5cclxuRGVsYXllZFN0cmVhbS5wcm90b3R5cGUucGF1c2UgPSBmdW5jdGlvbigpIHtcclxuICB0aGlzLnNvdXJjZS5wYXVzZSgpO1xyXG59O1xyXG5cclxuRGVsYXllZFN0cmVhbS5wcm90b3R5cGUucmVsZWFzZSA9IGZ1bmN0aW9uKCkge1xyXG4gIHRoaXMuX3JlbGVhc2VkID0gdHJ1ZTtcclxuXHJcbiAgdGhpcy5fYnVmZmVyZWRFdmVudHMuZm9yRWFjaChmdW5jdGlvbihhcmdzKSB7XHJcbiAgICB0aGlzLmVtaXQuYXBwbHkodGhpcywgYXJncyk7XHJcbiAgfS5iaW5kKHRoaXMpKTtcclxuICB0aGlzLl9idWZmZXJlZEV2ZW50cyA9IFtdO1xyXG59O1xyXG5cclxuRGVsYXllZFN0cmVhbS5wcm90b3R5cGUucGlwZSA9IGZ1bmN0aW9uKCkge1xyXG4gIHZhciByID0gU3RyZWFtLnByb3RvdHlwZS5waXBlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbiAgdGhpcy5yZXN1bWUoKTtcclxuICByZXR1cm4gcjtcclxufTtcclxuXHJcbkRlbGF5ZWRTdHJlYW0ucHJvdG90eXBlLl9oYW5kbGVFbWl0ID0gZnVuY3Rpb24oYXJncykge1xyXG4gIGlmICh0aGlzLl9yZWxlYXNlZCkge1xyXG4gICAgdGhpcy5lbWl0LmFwcGx5KHRoaXMsIGFyZ3MpO1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuXHJcbiAgaWYgKGFyZ3NbMF0gPT09ICdkYXRhJykge1xyXG4gICAgdGhpcy5kYXRhU2l6ZSArPSBhcmdzWzFdLmxlbmd0aDtcclxuICAgIHRoaXMuX2NoZWNrSWZNYXhEYXRhU2l6ZUV4Y2VlZGVkKCk7XHJcbiAgfVxyXG5cclxuICB0aGlzLl9idWZmZXJlZEV2ZW50cy5wdXNoKGFyZ3MpO1xyXG59O1xyXG5cclxuRGVsYXllZFN0cmVhbS5wcm90b3R5cGUuX2NoZWNrSWZNYXhEYXRhU2l6ZUV4Y2VlZGVkID0gZnVuY3Rpb24oKSB7XHJcbiAgaWYgKHRoaXMuX21heERhdGFTaXplRXhjZWVkZWQpIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcblxyXG4gIGlmICh0aGlzLmRhdGFTaXplIDw9IHRoaXMubWF4RGF0YVNpemUpIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcblxyXG4gIHRoaXMuX21heERhdGFTaXplRXhjZWVkZWQgPSB0cnVlO1xyXG4gIHZhciBtZXNzYWdlID1cclxuICAgICdEZWxheWVkU3RyZWFtI21heERhdGFTaXplIG9mICcgKyB0aGlzLm1heERhdGFTaXplICsgJyBieXRlcyBleGNlZWRlZC4nXHJcbiAgdGhpcy5lbWl0KCdlcnJvcicsIG5ldyBFcnJvcihtZXNzYWdlKSk7XHJcbn07XHJcbiJdLCJzb3VyY2VSb290IjoiIn0=