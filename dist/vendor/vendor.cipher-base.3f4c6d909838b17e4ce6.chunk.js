(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["vendor/vendor.cipher-base"],{

/***/ "ZDAU":
/*!*******************************************!*\
  !*** ./node_modules/cipher-base/index.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Buffer = __webpack_require__(/*! safe-buffer */ "hwdV").Buffer
var Transform = __webpack_require__(/*! stream */ "1IWx").Transform
var StringDecoder = __webpack_require__(/*! string_decoder */ "fXKp").StringDecoder
var inherits = __webpack_require__(/*! inherits */ "P7XM")

function CipherBase (hashMode) {
  Transform.call(this)
  this.hashMode = typeof hashMode === 'string'
  if (this.hashMode) {
    this[hashMode] = this._finalOrDigest
  } else {
    this.final = this._finalOrDigest
  }
  if (this._final) {
    this.__final = this._final
    this._final = null
  }
  this._decoder = null
  this._encoding = null
}
inherits(CipherBase, Transform)

CipherBase.prototype.update = function (data, inputEnc, outputEnc) {
  if (typeof data === 'string') {
    data = Buffer.from(data, inputEnc)
  }

  var outData = this._update(data)
  if (this.hashMode) return this

  if (outputEnc) {
    outData = this._toString(outData, outputEnc)
  }

  return outData
}

CipherBase.prototype.setAutoPadding = function () {}
CipherBase.prototype.getAuthTag = function () {
  throw new Error('trying to get auth tag in unsupported state')
}

CipherBase.prototype.setAuthTag = function () {
  throw new Error('trying to set auth tag in unsupported state')
}

CipherBase.prototype.setAAD = function () {
  throw new Error('trying to set aad in unsupported state')
}

CipherBase.prototype._transform = function (data, _, next) {
  var err
  try {
    if (this.hashMode) {
      this._update(data)
    } else {
      this.push(this._update(data))
    }
  } catch (e) {
    err = e
  } finally {
    next(err)
  }
}
CipherBase.prototype._flush = function (done) {
  var err
  try {
    this.push(this.__final())
  } catch (e) {
    err = e
  }

  done(err)
}
CipherBase.prototype._finalOrDigest = function (outputEnc) {
  var outData = this.__final() || Buffer.alloc(0)
  if (outputEnc) {
    outData = this._toString(outData, outputEnc, true)
  }
  return outData
}

CipherBase.prototype._toString = function (value, enc, fin) {
  if (!this._decoder) {
    this._decoder = new StringDecoder(enc)
    this._encoding = enc
  }

  if (this._encoding !== enc) throw new Error('can\'t switch encodings')

  var out = this._decoder.write(value)
  if (fin) {
    out += this._decoder.end()
  }

  return out
}

module.exports = CipherBase


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY2lwaGVyLWJhc2UvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsYUFBYSxtQkFBTyxDQUFDLHlCQUFhO0FBQ2xDLGdCQUFnQixtQkFBTyxDQUFDLG9CQUFRO0FBQ2hDLG9CQUFvQixtQkFBTyxDQUFDLDRCQUFnQjtBQUM1QyxlQUFlLG1CQUFPLENBQUMsc0JBQVU7O0FBRWpDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEiLCJmaWxlIjoidmVuZG9yL3ZlbmRvci5jaXBoZXItYmFzZS4zZjRjNmQ5MDk4MzhiMTdlNGNlNi5jaHVuay5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBCdWZmZXIgPSByZXF1aXJlKCdzYWZlLWJ1ZmZlcicpLkJ1ZmZlclxudmFyIFRyYW5zZm9ybSA9IHJlcXVpcmUoJ3N0cmVhbScpLlRyYW5zZm9ybVxudmFyIFN0cmluZ0RlY29kZXIgPSByZXF1aXJlKCdzdHJpbmdfZGVjb2RlcicpLlN0cmluZ0RlY29kZXJcbnZhciBpbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJylcblxuZnVuY3Rpb24gQ2lwaGVyQmFzZSAoaGFzaE1vZGUpIHtcbiAgVHJhbnNmb3JtLmNhbGwodGhpcylcbiAgdGhpcy5oYXNoTW9kZSA9IHR5cGVvZiBoYXNoTW9kZSA9PT0gJ3N0cmluZydcbiAgaWYgKHRoaXMuaGFzaE1vZGUpIHtcbiAgICB0aGlzW2hhc2hNb2RlXSA9IHRoaXMuX2ZpbmFsT3JEaWdlc3RcbiAgfSBlbHNlIHtcbiAgICB0aGlzLmZpbmFsID0gdGhpcy5fZmluYWxPckRpZ2VzdFxuICB9XG4gIGlmICh0aGlzLl9maW5hbCkge1xuICAgIHRoaXMuX19maW5hbCA9IHRoaXMuX2ZpbmFsXG4gICAgdGhpcy5fZmluYWwgPSBudWxsXG4gIH1cbiAgdGhpcy5fZGVjb2RlciA9IG51bGxcbiAgdGhpcy5fZW5jb2RpbmcgPSBudWxsXG59XG5pbmhlcml0cyhDaXBoZXJCYXNlLCBUcmFuc2Zvcm0pXG5cbkNpcGhlckJhc2UucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uIChkYXRhLCBpbnB1dEVuYywgb3V0cHV0RW5jKSB7XG4gIGlmICh0eXBlb2YgZGF0YSA9PT0gJ3N0cmluZycpIHtcbiAgICBkYXRhID0gQnVmZmVyLmZyb20oZGF0YSwgaW5wdXRFbmMpXG4gIH1cblxuICB2YXIgb3V0RGF0YSA9IHRoaXMuX3VwZGF0ZShkYXRhKVxuICBpZiAodGhpcy5oYXNoTW9kZSkgcmV0dXJuIHRoaXNcblxuICBpZiAob3V0cHV0RW5jKSB7XG4gICAgb3V0RGF0YSA9IHRoaXMuX3RvU3RyaW5nKG91dERhdGEsIG91dHB1dEVuYylcbiAgfVxuXG4gIHJldHVybiBvdXREYXRhXG59XG5cbkNpcGhlckJhc2UucHJvdG90eXBlLnNldEF1dG9QYWRkaW5nID0gZnVuY3Rpb24gKCkge31cbkNpcGhlckJhc2UucHJvdG90eXBlLmdldEF1dGhUYWcgPSBmdW5jdGlvbiAoKSB7XG4gIHRocm93IG5ldyBFcnJvcigndHJ5aW5nIHRvIGdldCBhdXRoIHRhZyBpbiB1bnN1cHBvcnRlZCBzdGF0ZScpXG59XG5cbkNpcGhlckJhc2UucHJvdG90eXBlLnNldEF1dGhUYWcgPSBmdW5jdGlvbiAoKSB7XG4gIHRocm93IG5ldyBFcnJvcigndHJ5aW5nIHRvIHNldCBhdXRoIHRhZyBpbiB1bnN1cHBvcnRlZCBzdGF0ZScpXG59XG5cbkNpcGhlckJhc2UucHJvdG90eXBlLnNldEFBRCA9IGZ1bmN0aW9uICgpIHtcbiAgdGhyb3cgbmV3IEVycm9yKCd0cnlpbmcgdG8gc2V0IGFhZCBpbiB1bnN1cHBvcnRlZCBzdGF0ZScpXG59XG5cbkNpcGhlckJhc2UucHJvdG90eXBlLl90cmFuc2Zvcm0gPSBmdW5jdGlvbiAoZGF0YSwgXywgbmV4dCkge1xuICB2YXIgZXJyXG4gIHRyeSB7XG4gICAgaWYgKHRoaXMuaGFzaE1vZGUpIHtcbiAgICAgIHRoaXMuX3VwZGF0ZShkYXRhKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnB1c2godGhpcy5fdXBkYXRlKGRhdGEpKVxuICAgIH1cbiAgfSBjYXRjaCAoZSkge1xuICAgIGVyciA9IGVcbiAgfSBmaW5hbGx5IHtcbiAgICBuZXh0KGVycilcbiAgfVxufVxuQ2lwaGVyQmFzZS5wcm90b3R5cGUuX2ZsdXNoID0gZnVuY3Rpb24gKGRvbmUpIHtcbiAgdmFyIGVyclxuICB0cnkge1xuICAgIHRoaXMucHVzaCh0aGlzLl9fZmluYWwoKSlcbiAgfSBjYXRjaCAoZSkge1xuICAgIGVyciA9IGVcbiAgfVxuXG4gIGRvbmUoZXJyKVxufVxuQ2lwaGVyQmFzZS5wcm90b3R5cGUuX2ZpbmFsT3JEaWdlc3QgPSBmdW5jdGlvbiAob3V0cHV0RW5jKSB7XG4gIHZhciBvdXREYXRhID0gdGhpcy5fX2ZpbmFsKCkgfHwgQnVmZmVyLmFsbG9jKDApXG4gIGlmIChvdXRwdXRFbmMpIHtcbiAgICBvdXREYXRhID0gdGhpcy5fdG9TdHJpbmcob3V0RGF0YSwgb3V0cHV0RW5jLCB0cnVlKVxuICB9XG4gIHJldHVybiBvdXREYXRhXG59XG5cbkNpcGhlckJhc2UucHJvdG90eXBlLl90b1N0cmluZyA9IGZ1bmN0aW9uICh2YWx1ZSwgZW5jLCBmaW4pIHtcbiAgaWYgKCF0aGlzLl9kZWNvZGVyKSB7XG4gICAgdGhpcy5fZGVjb2RlciA9IG5ldyBTdHJpbmdEZWNvZGVyKGVuYylcbiAgICB0aGlzLl9lbmNvZGluZyA9IGVuY1xuICB9XG5cbiAgaWYgKHRoaXMuX2VuY29kaW5nICE9PSBlbmMpIHRocm93IG5ldyBFcnJvcignY2FuXFwndCBzd2l0Y2ggZW5jb2RpbmdzJylcblxuICB2YXIgb3V0ID0gdGhpcy5fZGVjb2Rlci53cml0ZSh2YWx1ZSlcbiAgaWYgKGZpbikge1xuICAgIG91dCArPSB0aGlzLl9kZWNvZGVyLmVuZCgpXG4gIH1cblxuICByZXR1cm4gb3V0XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ2lwaGVyQmFzZVxuIl0sInNvdXJjZVJvb3QiOiIifQ==