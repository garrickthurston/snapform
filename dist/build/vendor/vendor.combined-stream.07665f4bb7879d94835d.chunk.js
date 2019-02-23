(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["vendor/vendor.combined-stream"],{

/***/ "X9DY":
/*!*************************************************************!*\
  !*** ./node_modules/combined-stream/lib/combined_stream.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer) {var util = __webpack_require__(/*! util */ "7tlc");
var Stream = __webpack_require__(/*! stream */ "1IWx").Stream;
var DelayedStream = __webpack_require__(/*! delayed-stream */ "2Va9");
var defer = __webpack_require__(/*! ./defer.js */ "ljOw");

module.exports = CombinedStream;
function CombinedStream() {
  this.writable = false;
  this.readable = true;
  this.dataSize = 0;
  this.maxDataSize = 2 * 1024 * 1024;
  this.pauseStreams = true;

  this._released = false;
  this._streams = [];
  this._currentStream = null;
}
util.inherits(CombinedStream, Stream);

CombinedStream.create = function(options) {
  var combinedStream = new this();

  options = options || {};
  for (var option in options) {
    combinedStream[option] = options[option];
  }

  return combinedStream;
};

CombinedStream.isStreamLike = function(stream) {
  return (typeof stream !== 'function')
    && (typeof stream !== 'string')
    && (typeof stream !== 'boolean')
    && (typeof stream !== 'number')
    && (!Buffer.isBuffer(stream));
};

CombinedStream.prototype.append = function(stream) {
  var isStreamLike = CombinedStream.isStreamLike(stream);

  if (isStreamLike) {
    if (!(stream instanceof DelayedStream)) {
      var newStream = DelayedStream.create(stream, {
        maxDataSize: Infinity,
        pauseStream: this.pauseStreams,
      });
      stream.on('data', this._checkDataSize.bind(this));
      stream = newStream;
    }

    this._handleErrors(stream);

    if (this.pauseStreams) {
      stream.pause();
    }
  }

  this._streams.push(stream);
  return this;
};

CombinedStream.prototype.pipe = function(dest, options) {
  Stream.prototype.pipe.call(this, dest, options);
  this.resume();
  return dest;
};

CombinedStream.prototype._getNext = function() {
  this._currentStream = null;
  var stream = this._streams.shift();


  if (typeof stream == 'undefined') {
    this.end();
    return;
  }

  if (typeof stream !== 'function') {
    this._pipeNext(stream);
    return;
  }

  var getStream = stream;
  getStream(function(stream) {
    var isStreamLike = CombinedStream.isStreamLike(stream);
    if (isStreamLike) {
      stream.on('data', this._checkDataSize.bind(this));
      this._handleErrors(stream);
    }

    defer(this._pipeNext.bind(this, stream));
  }.bind(this));
};

CombinedStream.prototype._pipeNext = function(stream) {
  this._currentStream = stream;

  var isStreamLike = CombinedStream.isStreamLike(stream);
  if (isStreamLike) {
    stream.on('end', this._getNext.bind(this));
    stream.pipe(this, {end: false});
    return;
  }

  var value = stream;
  this.write(value);
  this._getNext();
};

CombinedStream.prototype._handleErrors = function(stream) {
  var self = this;
  stream.on('error', function(err) {
    self._emitError(err);
  });
};

CombinedStream.prototype.write = function(data) {
  this.emit('data', data);
};

CombinedStream.prototype.pause = function() {
  if (!this.pauseStreams) {
    return;
  }

  if(this.pauseStreams && this._currentStream && typeof(this._currentStream.pause) == 'function') this._currentStream.pause();
  this.emit('pause');
};

CombinedStream.prototype.resume = function() {
  if (!this._released) {
    this._released = true;
    this.writable = true;
    this._getNext();
  }

  if(this.pauseStreams && this._currentStream && typeof(this._currentStream.resume) == 'function') this._currentStream.resume();
  this.emit('resume');
};

CombinedStream.prototype.end = function() {
  this._reset();
  this.emit('end');
};

CombinedStream.prototype.destroy = function() {
  this._reset();
  this.emit('close');
};

CombinedStream.prototype._reset = function() {
  this.writable = false;
  this._streams = [];
  this._currentStream = null;
};

CombinedStream.prototype._checkDataSize = function() {
  this._updateDataSize();
  if (this.dataSize <= this.maxDataSize) {
    return;
  }

  var message =
    'DelayedStream#maxDataSize of ' + this.maxDataSize + ' bytes exceeded.';
  this._emitError(new Error(message));
};

CombinedStream.prototype._updateDataSize = function() {
  this.dataSize = 0;

  var self = this;
  this._streams.forEach(function(stream) {
    if (!stream.dataSize) {
      return;
    }

    self.dataSize += stream.dataSize;
  });

  if (this._currentStream && this._currentStream.dataSize) {
    this.dataSize += this._currentStream.dataSize;
  }
};

CombinedStream.prototype._emitError = function(err) {
  this._reset();
  this.emit('error', err);
};

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../buffer/index.js */ "tjlA").Buffer))

/***/ }),

/***/ "ljOw":
/*!***************************************************!*\
  !*** ./node_modules/combined-stream/lib/defer.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(setImmediate, process) {module.exports = defer;

/**
 * Runs provided function on next iteration of the event loop
 *
 * @param {function} fn - function to run
 */
function defer(fn)
{
  var nextTick = typeof setImmediate == 'function'
    ? setImmediate
    : (
      typeof process == 'object' && typeof process.nextTick == 'function'
      ? process.nextTick
      : null
    );

  if (nextTick)
  {
    nextTick(fn);
  }
  else
  {
    setTimeout(fn, 0);
  }
}

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../timers-browserify/main.js */ "URgk").setImmediate, __webpack_require__(/*! ./../../process/browser.js */ "8oxB")))

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29tYmluZWQtc3RyZWFtL2xpYi9jb21iaW5lZF9zdHJlYW0uanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvbWJpbmVkLXN0cmVhbS9saWIvZGVmZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEseURBQVcsbUJBQU8sQ0FBQyxrQkFBTTtBQUN6QixhQUFhLG1CQUFPLENBQUMsb0JBQVE7QUFDN0Isb0JBQW9CLG1CQUFPLENBQUMsNEJBQWdCO0FBQzVDLFlBQVksbUJBQU8sQ0FBQyx3QkFBWTs7QUFFaEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLFdBQVc7QUFDbEM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7QUM1TEE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVyxTQUFTO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJidWlsZC92ZW5kb3IvdmVuZG9yLmNvbWJpbmVkLXN0cmVhbS4wNzY2NWY0YmI3ODc5ZDk0ODM1ZC5jaHVuay5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciB1dGlsID0gcmVxdWlyZSgndXRpbCcpO1xyXG52YXIgU3RyZWFtID0gcmVxdWlyZSgnc3RyZWFtJykuU3RyZWFtO1xyXG52YXIgRGVsYXllZFN0cmVhbSA9IHJlcXVpcmUoJ2RlbGF5ZWQtc3RyZWFtJyk7XHJcbnZhciBkZWZlciA9IHJlcXVpcmUoJy4vZGVmZXIuanMnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ29tYmluZWRTdHJlYW07XHJcbmZ1bmN0aW9uIENvbWJpbmVkU3RyZWFtKCkge1xyXG4gIHRoaXMud3JpdGFibGUgPSBmYWxzZTtcclxuICB0aGlzLnJlYWRhYmxlID0gdHJ1ZTtcclxuICB0aGlzLmRhdGFTaXplID0gMDtcclxuICB0aGlzLm1heERhdGFTaXplID0gMiAqIDEwMjQgKiAxMDI0O1xyXG4gIHRoaXMucGF1c2VTdHJlYW1zID0gdHJ1ZTtcclxuXHJcbiAgdGhpcy5fcmVsZWFzZWQgPSBmYWxzZTtcclxuICB0aGlzLl9zdHJlYW1zID0gW107XHJcbiAgdGhpcy5fY3VycmVudFN0cmVhbSA9IG51bGw7XHJcbn1cclxudXRpbC5pbmhlcml0cyhDb21iaW5lZFN0cmVhbSwgU3RyZWFtKTtcclxuXHJcbkNvbWJpbmVkU3RyZWFtLmNyZWF0ZSA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcclxuICB2YXIgY29tYmluZWRTdHJlYW0gPSBuZXcgdGhpcygpO1xyXG5cclxuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcclxuICBmb3IgKHZhciBvcHRpb24gaW4gb3B0aW9ucykge1xyXG4gICAgY29tYmluZWRTdHJlYW1bb3B0aW9uXSA9IG9wdGlvbnNbb3B0aW9uXTtcclxuICB9XHJcblxyXG4gIHJldHVybiBjb21iaW5lZFN0cmVhbTtcclxufTtcclxuXHJcbkNvbWJpbmVkU3RyZWFtLmlzU3RyZWFtTGlrZSA9IGZ1bmN0aW9uKHN0cmVhbSkge1xyXG4gIHJldHVybiAodHlwZW9mIHN0cmVhbSAhPT0gJ2Z1bmN0aW9uJylcclxuICAgICYmICh0eXBlb2Ygc3RyZWFtICE9PSAnc3RyaW5nJylcclxuICAgICYmICh0eXBlb2Ygc3RyZWFtICE9PSAnYm9vbGVhbicpXHJcbiAgICAmJiAodHlwZW9mIHN0cmVhbSAhPT0gJ251bWJlcicpXHJcbiAgICAmJiAoIUJ1ZmZlci5pc0J1ZmZlcihzdHJlYW0pKTtcclxufTtcclxuXHJcbkNvbWJpbmVkU3RyZWFtLnByb3RvdHlwZS5hcHBlbmQgPSBmdW5jdGlvbihzdHJlYW0pIHtcclxuICB2YXIgaXNTdHJlYW1MaWtlID0gQ29tYmluZWRTdHJlYW0uaXNTdHJlYW1MaWtlKHN0cmVhbSk7XHJcblxyXG4gIGlmIChpc1N0cmVhbUxpa2UpIHtcclxuICAgIGlmICghKHN0cmVhbSBpbnN0YW5jZW9mIERlbGF5ZWRTdHJlYW0pKSB7XHJcbiAgICAgIHZhciBuZXdTdHJlYW0gPSBEZWxheWVkU3RyZWFtLmNyZWF0ZShzdHJlYW0sIHtcclxuICAgICAgICBtYXhEYXRhU2l6ZTogSW5maW5pdHksXHJcbiAgICAgICAgcGF1c2VTdHJlYW06IHRoaXMucGF1c2VTdHJlYW1zLFxyXG4gICAgICB9KTtcclxuICAgICAgc3RyZWFtLm9uKCdkYXRhJywgdGhpcy5fY2hlY2tEYXRhU2l6ZS5iaW5kKHRoaXMpKTtcclxuICAgICAgc3RyZWFtID0gbmV3U3RyZWFtO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuX2hhbmRsZUVycm9ycyhzdHJlYW0pO1xyXG5cclxuICAgIGlmICh0aGlzLnBhdXNlU3RyZWFtcykge1xyXG4gICAgICBzdHJlYW0ucGF1c2UoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHRoaXMuX3N0cmVhbXMucHVzaChzdHJlYW0pO1xyXG4gIHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuQ29tYmluZWRTdHJlYW0ucHJvdG90eXBlLnBpcGUgPSBmdW5jdGlvbihkZXN0LCBvcHRpb25zKSB7XHJcbiAgU3RyZWFtLnByb3RvdHlwZS5waXBlLmNhbGwodGhpcywgZGVzdCwgb3B0aW9ucyk7XHJcbiAgdGhpcy5yZXN1bWUoKTtcclxuICByZXR1cm4gZGVzdDtcclxufTtcclxuXHJcbkNvbWJpbmVkU3RyZWFtLnByb3RvdHlwZS5fZ2V0TmV4dCA9IGZ1bmN0aW9uKCkge1xyXG4gIHRoaXMuX2N1cnJlbnRTdHJlYW0gPSBudWxsO1xyXG4gIHZhciBzdHJlYW0gPSB0aGlzLl9zdHJlYW1zLnNoaWZ0KCk7XHJcblxyXG5cclxuICBpZiAodHlwZW9mIHN0cmVhbSA9PSAndW5kZWZpbmVkJykge1xyXG4gICAgdGhpcy5lbmQoKTtcclxuICAgIHJldHVybjtcclxuICB9XHJcblxyXG4gIGlmICh0eXBlb2Ygc3RyZWFtICE9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICB0aGlzLl9waXBlTmV4dChzdHJlYW0pO1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuXHJcbiAgdmFyIGdldFN0cmVhbSA9IHN0cmVhbTtcclxuICBnZXRTdHJlYW0oZnVuY3Rpb24oc3RyZWFtKSB7XHJcbiAgICB2YXIgaXNTdHJlYW1MaWtlID0gQ29tYmluZWRTdHJlYW0uaXNTdHJlYW1MaWtlKHN0cmVhbSk7XHJcbiAgICBpZiAoaXNTdHJlYW1MaWtlKSB7XHJcbiAgICAgIHN0cmVhbS5vbignZGF0YScsIHRoaXMuX2NoZWNrRGF0YVNpemUuYmluZCh0aGlzKSk7XHJcbiAgICAgIHRoaXMuX2hhbmRsZUVycm9ycyhzdHJlYW0pO1xyXG4gICAgfVxyXG5cclxuICAgIGRlZmVyKHRoaXMuX3BpcGVOZXh0LmJpbmQodGhpcywgc3RyZWFtKSk7XHJcbiAgfS5iaW5kKHRoaXMpKTtcclxufTtcclxuXHJcbkNvbWJpbmVkU3RyZWFtLnByb3RvdHlwZS5fcGlwZU5leHQgPSBmdW5jdGlvbihzdHJlYW0pIHtcclxuICB0aGlzLl9jdXJyZW50U3RyZWFtID0gc3RyZWFtO1xyXG5cclxuICB2YXIgaXNTdHJlYW1MaWtlID0gQ29tYmluZWRTdHJlYW0uaXNTdHJlYW1MaWtlKHN0cmVhbSk7XHJcbiAgaWYgKGlzU3RyZWFtTGlrZSkge1xyXG4gICAgc3RyZWFtLm9uKCdlbmQnLCB0aGlzLl9nZXROZXh0LmJpbmQodGhpcykpO1xyXG4gICAgc3RyZWFtLnBpcGUodGhpcywge2VuZDogZmFsc2V9KTtcclxuICAgIHJldHVybjtcclxuICB9XHJcblxyXG4gIHZhciB2YWx1ZSA9IHN0cmVhbTtcclxuICB0aGlzLndyaXRlKHZhbHVlKTtcclxuICB0aGlzLl9nZXROZXh0KCk7XHJcbn07XHJcblxyXG5Db21iaW5lZFN0cmVhbS5wcm90b3R5cGUuX2hhbmRsZUVycm9ycyA9IGZ1bmN0aW9uKHN0cmVhbSkge1xyXG4gIHZhciBzZWxmID0gdGhpcztcclxuICBzdHJlYW0ub24oJ2Vycm9yJywgZnVuY3Rpb24oZXJyKSB7XHJcbiAgICBzZWxmLl9lbWl0RXJyb3IoZXJyKTtcclxuICB9KTtcclxufTtcclxuXHJcbkNvbWJpbmVkU3RyZWFtLnByb3RvdHlwZS53cml0ZSA9IGZ1bmN0aW9uKGRhdGEpIHtcclxuICB0aGlzLmVtaXQoJ2RhdGEnLCBkYXRhKTtcclxufTtcclxuXHJcbkNvbWJpbmVkU3RyZWFtLnByb3RvdHlwZS5wYXVzZSA9IGZ1bmN0aW9uKCkge1xyXG4gIGlmICghdGhpcy5wYXVzZVN0cmVhbXMpIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcblxyXG4gIGlmKHRoaXMucGF1c2VTdHJlYW1zICYmIHRoaXMuX2N1cnJlbnRTdHJlYW0gJiYgdHlwZW9mKHRoaXMuX2N1cnJlbnRTdHJlYW0ucGF1c2UpID09ICdmdW5jdGlvbicpIHRoaXMuX2N1cnJlbnRTdHJlYW0ucGF1c2UoKTtcclxuICB0aGlzLmVtaXQoJ3BhdXNlJyk7XHJcbn07XHJcblxyXG5Db21iaW5lZFN0cmVhbS5wcm90b3R5cGUucmVzdW1lID0gZnVuY3Rpb24oKSB7XHJcbiAgaWYgKCF0aGlzLl9yZWxlYXNlZCkge1xyXG4gICAgdGhpcy5fcmVsZWFzZWQgPSB0cnVlO1xyXG4gICAgdGhpcy53cml0YWJsZSA9IHRydWU7XHJcbiAgICB0aGlzLl9nZXROZXh0KCk7XHJcbiAgfVxyXG5cclxuICBpZih0aGlzLnBhdXNlU3RyZWFtcyAmJiB0aGlzLl9jdXJyZW50U3RyZWFtICYmIHR5cGVvZih0aGlzLl9jdXJyZW50U3RyZWFtLnJlc3VtZSkgPT0gJ2Z1bmN0aW9uJykgdGhpcy5fY3VycmVudFN0cmVhbS5yZXN1bWUoKTtcclxuICB0aGlzLmVtaXQoJ3Jlc3VtZScpO1xyXG59O1xyXG5cclxuQ29tYmluZWRTdHJlYW0ucHJvdG90eXBlLmVuZCA9IGZ1bmN0aW9uKCkge1xyXG4gIHRoaXMuX3Jlc2V0KCk7XHJcbiAgdGhpcy5lbWl0KCdlbmQnKTtcclxufTtcclxuXHJcbkNvbWJpbmVkU3RyZWFtLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24oKSB7XHJcbiAgdGhpcy5fcmVzZXQoKTtcclxuICB0aGlzLmVtaXQoJ2Nsb3NlJyk7XHJcbn07XHJcblxyXG5Db21iaW5lZFN0cmVhbS5wcm90b3R5cGUuX3Jlc2V0ID0gZnVuY3Rpb24oKSB7XHJcbiAgdGhpcy53cml0YWJsZSA9IGZhbHNlO1xyXG4gIHRoaXMuX3N0cmVhbXMgPSBbXTtcclxuICB0aGlzLl9jdXJyZW50U3RyZWFtID0gbnVsbDtcclxufTtcclxuXHJcbkNvbWJpbmVkU3RyZWFtLnByb3RvdHlwZS5fY2hlY2tEYXRhU2l6ZSA9IGZ1bmN0aW9uKCkge1xyXG4gIHRoaXMuX3VwZGF0ZURhdGFTaXplKCk7XHJcbiAgaWYgKHRoaXMuZGF0YVNpemUgPD0gdGhpcy5tYXhEYXRhU2l6ZSkge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuXHJcbiAgdmFyIG1lc3NhZ2UgPVxyXG4gICAgJ0RlbGF5ZWRTdHJlYW0jbWF4RGF0YVNpemUgb2YgJyArIHRoaXMubWF4RGF0YVNpemUgKyAnIGJ5dGVzIGV4Y2VlZGVkLic7XHJcbiAgdGhpcy5fZW1pdEVycm9yKG5ldyBFcnJvcihtZXNzYWdlKSk7XHJcbn07XHJcblxyXG5Db21iaW5lZFN0cmVhbS5wcm90b3R5cGUuX3VwZGF0ZURhdGFTaXplID0gZnVuY3Rpb24oKSB7XHJcbiAgdGhpcy5kYXRhU2l6ZSA9IDA7XHJcblxyXG4gIHZhciBzZWxmID0gdGhpcztcclxuICB0aGlzLl9zdHJlYW1zLmZvckVhY2goZnVuY3Rpb24oc3RyZWFtKSB7XHJcbiAgICBpZiAoIXN0cmVhbS5kYXRhU2l6ZSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgc2VsZi5kYXRhU2l6ZSArPSBzdHJlYW0uZGF0YVNpemU7XHJcbiAgfSk7XHJcblxyXG4gIGlmICh0aGlzLl9jdXJyZW50U3RyZWFtICYmIHRoaXMuX2N1cnJlbnRTdHJlYW0uZGF0YVNpemUpIHtcclxuICAgIHRoaXMuZGF0YVNpemUgKz0gdGhpcy5fY3VycmVudFN0cmVhbS5kYXRhU2l6ZTtcclxuICB9XHJcbn07XHJcblxyXG5Db21iaW5lZFN0cmVhbS5wcm90b3R5cGUuX2VtaXRFcnJvciA9IGZ1bmN0aW9uKGVycikge1xyXG4gIHRoaXMuX3Jlc2V0KCk7XHJcbiAgdGhpcy5lbWl0KCdlcnJvcicsIGVycik7XHJcbn07XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gZGVmZXI7XHJcblxyXG4vKipcclxuICogUnVucyBwcm92aWRlZCBmdW5jdGlvbiBvbiBuZXh0IGl0ZXJhdGlvbiBvZiB0aGUgZXZlbnQgbG9vcFxyXG4gKlxyXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBmbiAtIGZ1bmN0aW9uIHRvIHJ1blxyXG4gKi9cclxuZnVuY3Rpb24gZGVmZXIoZm4pXHJcbntcclxuICB2YXIgbmV4dFRpY2sgPSB0eXBlb2Ygc2V0SW1tZWRpYXRlID09ICdmdW5jdGlvbidcclxuICAgID8gc2V0SW1tZWRpYXRlXHJcbiAgICA6IChcclxuICAgICAgdHlwZW9mIHByb2Nlc3MgPT0gJ29iamVjdCcgJiYgdHlwZW9mIHByb2Nlc3MubmV4dFRpY2sgPT0gJ2Z1bmN0aW9uJ1xyXG4gICAgICA/IHByb2Nlc3MubmV4dFRpY2tcclxuICAgICAgOiBudWxsXHJcbiAgICApO1xyXG5cclxuICBpZiAobmV4dFRpY2spXHJcbiAge1xyXG4gICAgbmV4dFRpY2soZm4pO1xyXG4gIH1cclxuICBlbHNlXHJcbiAge1xyXG4gICAgc2V0VGltZW91dChmbiwgMCk7XHJcbiAgfVxyXG59XHJcbiJdLCJzb3VyY2VSb290IjoiIn0=