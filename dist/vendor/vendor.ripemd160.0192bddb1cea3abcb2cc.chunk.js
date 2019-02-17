(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["vendor/vendor.ripemd160"],{

/***/ "tcrS":
/*!*****************************************!*\
  !*** ./node_modules/ripemd160/index.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var Buffer = __webpack_require__(/*! buffer */ "tjlA").Buffer
var inherits = __webpack_require__(/*! inherits */ "P7XM")
var HashBase = __webpack_require__(/*! hash-base */ "k+aG")

var ARRAY16 = new Array(16)

var zl = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
  7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8,
  3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12,
  1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2,
  4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13
]

var zr = [
  5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12,
  6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2,
  15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13,
  8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14,
  12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11
]

var sl = [
  11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8,
  7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12,
  11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5,
  11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12,
  9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6
]

var sr = [
  8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6,
  9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11,
  9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5,
  15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8,
  8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11
]

var hl = [0x00000000, 0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xa953fd4e]
var hr = [0x50a28be6, 0x5c4dd124, 0x6d703ef3, 0x7a6d76e9, 0x00000000]

function RIPEMD160 () {
  HashBase.call(this, 64)

  // state
  this._a = 0x67452301
  this._b = 0xefcdab89
  this._c = 0x98badcfe
  this._d = 0x10325476
  this._e = 0xc3d2e1f0
}

inherits(RIPEMD160, HashBase)

RIPEMD160.prototype._update = function () {
  var words = ARRAY16
  for (var j = 0; j < 16; ++j) words[j] = this._block.readInt32LE(j * 4)

  var al = this._a | 0
  var bl = this._b | 0
  var cl = this._c | 0
  var dl = this._d | 0
  var el = this._e | 0

  var ar = this._a | 0
  var br = this._b | 0
  var cr = this._c | 0
  var dr = this._d | 0
  var er = this._e | 0

  // computation
  for (var i = 0; i < 80; i += 1) {
    var tl
    var tr
    if (i < 16) {
      tl = fn1(al, bl, cl, dl, el, words[zl[i]], hl[0], sl[i])
      tr = fn5(ar, br, cr, dr, er, words[zr[i]], hr[0], sr[i])
    } else if (i < 32) {
      tl = fn2(al, bl, cl, dl, el, words[zl[i]], hl[1], sl[i])
      tr = fn4(ar, br, cr, dr, er, words[zr[i]], hr[1], sr[i])
    } else if (i < 48) {
      tl = fn3(al, bl, cl, dl, el, words[zl[i]], hl[2], sl[i])
      tr = fn3(ar, br, cr, dr, er, words[zr[i]], hr[2], sr[i])
    } else if (i < 64) {
      tl = fn4(al, bl, cl, dl, el, words[zl[i]], hl[3], sl[i])
      tr = fn2(ar, br, cr, dr, er, words[zr[i]], hr[3], sr[i])
    } else { // if (i<80) {
      tl = fn5(al, bl, cl, dl, el, words[zl[i]], hl[4], sl[i])
      tr = fn1(ar, br, cr, dr, er, words[zr[i]], hr[4], sr[i])
    }

    al = el
    el = dl
    dl = rotl(cl, 10)
    cl = bl
    bl = tl

    ar = er
    er = dr
    dr = rotl(cr, 10)
    cr = br
    br = tr
  }

  // update state
  var t = (this._b + cl + dr) | 0
  this._b = (this._c + dl + er) | 0
  this._c = (this._d + el + ar) | 0
  this._d = (this._e + al + br) | 0
  this._e = (this._a + bl + cr) | 0
  this._a = t
}

RIPEMD160.prototype._digest = function () {
  // create padding and handle blocks
  this._block[this._blockOffset++] = 0x80
  if (this._blockOffset > 56) {
    this._block.fill(0, this._blockOffset, 64)
    this._update()
    this._blockOffset = 0
  }

  this._block.fill(0, this._blockOffset, 56)
  this._block.writeUInt32LE(this._length[0], 56)
  this._block.writeUInt32LE(this._length[1], 60)
  this._update()

  // produce result
  var buffer = Buffer.alloc ? Buffer.alloc(20) : new Buffer(20)
  buffer.writeInt32LE(this._a, 0)
  buffer.writeInt32LE(this._b, 4)
  buffer.writeInt32LE(this._c, 8)
  buffer.writeInt32LE(this._d, 12)
  buffer.writeInt32LE(this._e, 16)
  return buffer
}

function rotl (x, n) {
  return (x << n) | (x >>> (32 - n))
}

function fn1 (a, b, c, d, e, m, k, s) {
  return (rotl((a + (b ^ c ^ d) + m + k) | 0, s) + e) | 0
}

function fn2 (a, b, c, d, e, m, k, s) {
  return (rotl((a + ((b & c) | ((~b) & d)) + m + k) | 0, s) + e) | 0
}

function fn3 (a, b, c, d, e, m, k, s) {
  return (rotl((a + ((b | (~c)) ^ d) + m + k) | 0, s) + e) | 0
}

function fn4 (a, b, c, d, e, m, k, s) {
  return (rotl((a + ((b & d) | (c & (~d))) + m + k) | 0, s) + e) | 0
}

function fn5 (a, b, c, d, e, m, k, s) {
  return (rotl((a + (b ^ (c | (~d))) + m + k) | 0, s) + e) | 0
}

module.exports = RIPEMD160


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcmlwZW1kMTYwL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBWTtBQUNaLGFBQWEsbUJBQU8sQ0FBQyxvQkFBUTtBQUM3QixlQUFlLG1CQUFPLENBQUMsc0JBQVU7QUFDakMsZUFBZSxtQkFBTyxDQUFDLHVCQUFXOztBQUVsQzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLGlCQUFpQixRQUFROztBQUV6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxpQkFBaUIsUUFBUTtBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSyxPQUFPO0FBQ1o7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEiLCJmaWxlIjoidmVuZG9yL3ZlbmRvci5yaXBlbWQxNjAuMDE5MmJkZGIxY2VhM2FiY2IyY2MuY2h1bmsuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCdcbnZhciBCdWZmZXIgPSByZXF1aXJlKCdidWZmZXInKS5CdWZmZXJcbnZhciBpbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJylcbnZhciBIYXNoQmFzZSA9IHJlcXVpcmUoJ2hhc2gtYmFzZScpXG5cbnZhciBBUlJBWTE2ID0gbmV3IEFycmF5KDE2KVxuXG52YXIgemwgPSBbXG4gIDAsIDEsIDIsIDMsIDQsIDUsIDYsIDcsIDgsIDksIDEwLCAxMSwgMTIsIDEzLCAxNCwgMTUsXG4gIDcsIDQsIDEzLCAxLCAxMCwgNiwgMTUsIDMsIDEyLCAwLCA5LCA1LCAyLCAxNCwgMTEsIDgsXG4gIDMsIDEwLCAxNCwgNCwgOSwgMTUsIDgsIDEsIDIsIDcsIDAsIDYsIDEzLCAxMSwgNSwgMTIsXG4gIDEsIDksIDExLCAxMCwgMCwgOCwgMTIsIDQsIDEzLCAzLCA3LCAxNSwgMTQsIDUsIDYsIDIsXG4gIDQsIDAsIDUsIDksIDcsIDEyLCAyLCAxMCwgMTQsIDEsIDMsIDgsIDExLCA2LCAxNSwgMTNcbl1cblxudmFyIHpyID0gW1xuICA1LCAxNCwgNywgMCwgOSwgMiwgMTEsIDQsIDEzLCA2LCAxNSwgOCwgMSwgMTAsIDMsIDEyLFxuICA2LCAxMSwgMywgNywgMCwgMTMsIDUsIDEwLCAxNCwgMTUsIDgsIDEyLCA0LCA5LCAxLCAyLFxuICAxNSwgNSwgMSwgMywgNywgMTQsIDYsIDksIDExLCA4LCAxMiwgMiwgMTAsIDAsIDQsIDEzLFxuICA4LCA2LCA0LCAxLCAzLCAxMSwgMTUsIDAsIDUsIDEyLCAyLCAxMywgOSwgNywgMTAsIDE0LFxuICAxMiwgMTUsIDEwLCA0LCAxLCA1LCA4LCA3LCA2LCAyLCAxMywgMTQsIDAsIDMsIDksIDExXG5dXG5cbnZhciBzbCA9IFtcbiAgMTEsIDE0LCAxNSwgMTIsIDUsIDgsIDcsIDksIDExLCAxMywgMTQsIDE1LCA2LCA3LCA5LCA4LFxuICA3LCA2LCA4LCAxMywgMTEsIDksIDcsIDE1LCA3LCAxMiwgMTUsIDksIDExLCA3LCAxMywgMTIsXG4gIDExLCAxMywgNiwgNywgMTQsIDksIDEzLCAxNSwgMTQsIDgsIDEzLCA2LCA1LCAxMiwgNywgNSxcbiAgMTEsIDEyLCAxNCwgMTUsIDE0LCAxNSwgOSwgOCwgOSwgMTQsIDUsIDYsIDgsIDYsIDUsIDEyLFxuICA5LCAxNSwgNSwgMTEsIDYsIDgsIDEzLCAxMiwgNSwgMTIsIDEzLCAxNCwgMTEsIDgsIDUsIDZcbl1cblxudmFyIHNyID0gW1xuICA4LCA5LCA5LCAxMSwgMTMsIDE1LCAxNSwgNSwgNywgNywgOCwgMTEsIDE0LCAxNCwgMTIsIDYsXG4gIDksIDEzLCAxNSwgNywgMTIsIDgsIDksIDExLCA3LCA3LCAxMiwgNywgNiwgMTUsIDEzLCAxMSxcbiAgOSwgNywgMTUsIDExLCA4LCA2LCA2LCAxNCwgMTIsIDEzLCA1LCAxNCwgMTMsIDEzLCA3LCA1LFxuICAxNSwgNSwgOCwgMTEsIDE0LCAxNCwgNiwgMTQsIDYsIDksIDEyLCA5LCAxMiwgNSwgMTUsIDgsXG4gIDgsIDUsIDEyLCA5LCAxMiwgNSwgMTQsIDYsIDgsIDEzLCA2LCA1LCAxNSwgMTMsIDExLCAxMVxuXVxuXG52YXIgaGwgPSBbMHgwMDAwMDAwMCwgMHg1YTgyNzk5OSwgMHg2ZWQ5ZWJhMSwgMHg4ZjFiYmNkYywgMHhhOTUzZmQ0ZV1cbnZhciBociA9IFsweDUwYTI4YmU2LCAweDVjNGRkMTI0LCAweDZkNzAzZWYzLCAweDdhNmQ3NmU5LCAweDAwMDAwMDAwXVxuXG5mdW5jdGlvbiBSSVBFTUQxNjAgKCkge1xuICBIYXNoQmFzZS5jYWxsKHRoaXMsIDY0KVxuXG4gIC8vIHN0YXRlXG4gIHRoaXMuX2EgPSAweDY3NDUyMzAxXG4gIHRoaXMuX2IgPSAweGVmY2RhYjg5XG4gIHRoaXMuX2MgPSAweDk4YmFkY2ZlXG4gIHRoaXMuX2QgPSAweDEwMzI1NDc2XG4gIHRoaXMuX2UgPSAweGMzZDJlMWYwXG59XG5cbmluaGVyaXRzKFJJUEVNRDE2MCwgSGFzaEJhc2UpXG5cblJJUEVNRDE2MC5wcm90b3R5cGUuX3VwZGF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIHdvcmRzID0gQVJSQVkxNlxuICBmb3IgKHZhciBqID0gMDsgaiA8IDE2OyArK2opIHdvcmRzW2pdID0gdGhpcy5fYmxvY2sucmVhZEludDMyTEUoaiAqIDQpXG5cbiAgdmFyIGFsID0gdGhpcy5fYSB8IDBcbiAgdmFyIGJsID0gdGhpcy5fYiB8IDBcbiAgdmFyIGNsID0gdGhpcy5fYyB8IDBcbiAgdmFyIGRsID0gdGhpcy5fZCB8IDBcbiAgdmFyIGVsID0gdGhpcy5fZSB8IDBcblxuICB2YXIgYXIgPSB0aGlzLl9hIHwgMFxuICB2YXIgYnIgPSB0aGlzLl9iIHwgMFxuICB2YXIgY3IgPSB0aGlzLl9jIHwgMFxuICB2YXIgZHIgPSB0aGlzLl9kIHwgMFxuICB2YXIgZXIgPSB0aGlzLl9lIHwgMFxuXG4gIC8vIGNvbXB1dGF0aW9uXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgODA7IGkgKz0gMSkge1xuICAgIHZhciB0bFxuICAgIHZhciB0clxuICAgIGlmIChpIDwgMTYpIHtcbiAgICAgIHRsID0gZm4xKGFsLCBibCwgY2wsIGRsLCBlbCwgd29yZHNbemxbaV1dLCBobFswXSwgc2xbaV0pXG4gICAgICB0ciA9IGZuNShhciwgYnIsIGNyLCBkciwgZXIsIHdvcmRzW3pyW2ldXSwgaHJbMF0sIHNyW2ldKVxuICAgIH0gZWxzZSBpZiAoaSA8IDMyKSB7XG4gICAgICB0bCA9IGZuMihhbCwgYmwsIGNsLCBkbCwgZWwsIHdvcmRzW3psW2ldXSwgaGxbMV0sIHNsW2ldKVxuICAgICAgdHIgPSBmbjQoYXIsIGJyLCBjciwgZHIsIGVyLCB3b3Jkc1t6cltpXV0sIGhyWzFdLCBzcltpXSlcbiAgICB9IGVsc2UgaWYgKGkgPCA0OCkge1xuICAgICAgdGwgPSBmbjMoYWwsIGJsLCBjbCwgZGwsIGVsLCB3b3Jkc1t6bFtpXV0sIGhsWzJdLCBzbFtpXSlcbiAgICAgIHRyID0gZm4zKGFyLCBiciwgY3IsIGRyLCBlciwgd29yZHNbenJbaV1dLCBoclsyXSwgc3JbaV0pXG4gICAgfSBlbHNlIGlmIChpIDwgNjQpIHtcbiAgICAgIHRsID0gZm40KGFsLCBibCwgY2wsIGRsLCBlbCwgd29yZHNbemxbaV1dLCBobFszXSwgc2xbaV0pXG4gICAgICB0ciA9IGZuMihhciwgYnIsIGNyLCBkciwgZXIsIHdvcmRzW3pyW2ldXSwgaHJbM10sIHNyW2ldKVxuICAgIH0gZWxzZSB7IC8vIGlmIChpPDgwKSB7XG4gICAgICB0bCA9IGZuNShhbCwgYmwsIGNsLCBkbCwgZWwsIHdvcmRzW3psW2ldXSwgaGxbNF0sIHNsW2ldKVxuICAgICAgdHIgPSBmbjEoYXIsIGJyLCBjciwgZHIsIGVyLCB3b3Jkc1t6cltpXV0sIGhyWzRdLCBzcltpXSlcbiAgICB9XG5cbiAgICBhbCA9IGVsXG4gICAgZWwgPSBkbFxuICAgIGRsID0gcm90bChjbCwgMTApXG4gICAgY2wgPSBibFxuICAgIGJsID0gdGxcblxuICAgIGFyID0gZXJcbiAgICBlciA9IGRyXG4gICAgZHIgPSByb3RsKGNyLCAxMClcbiAgICBjciA9IGJyXG4gICAgYnIgPSB0clxuICB9XG5cbiAgLy8gdXBkYXRlIHN0YXRlXG4gIHZhciB0ID0gKHRoaXMuX2IgKyBjbCArIGRyKSB8IDBcbiAgdGhpcy5fYiA9ICh0aGlzLl9jICsgZGwgKyBlcikgfCAwXG4gIHRoaXMuX2MgPSAodGhpcy5fZCArIGVsICsgYXIpIHwgMFxuICB0aGlzLl9kID0gKHRoaXMuX2UgKyBhbCArIGJyKSB8IDBcbiAgdGhpcy5fZSA9ICh0aGlzLl9hICsgYmwgKyBjcikgfCAwXG4gIHRoaXMuX2EgPSB0XG59XG5cblJJUEVNRDE2MC5wcm90b3R5cGUuX2RpZ2VzdCA9IGZ1bmN0aW9uICgpIHtcbiAgLy8gY3JlYXRlIHBhZGRpbmcgYW5kIGhhbmRsZSBibG9ja3NcbiAgdGhpcy5fYmxvY2tbdGhpcy5fYmxvY2tPZmZzZXQrK10gPSAweDgwXG4gIGlmICh0aGlzLl9ibG9ja09mZnNldCA+IDU2KSB7XG4gICAgdGhpcy5fYmxvY2suZmlsbCgwLCB0aGlzLl9ibG9ja09mZnNldCwgNjQpXG4gICAgdGhpcy5fdXBkYXRlKClcbiAgICB0aGlzLl9ibG9ja09mZnNldCA9IDBcbiAgfVxuXG4gIHRoaXMuX2Jsb2NrLmZpbGwoMCwgdGhpcy5fYmxvY2tPZmZzZXQsIDU2KVxuICB0aGlzLl9ibG9jay53cml0ZVVJbnQzMkxFKHRoaXMuX2xlbmd0aFswXSwgNTYpXG4gIHRoaXMuX2Jsb2NrLndyaXRlVUludDMyTEUodGhpcy5fbGVuZ3RoWzFdLCA2MClcbiAgdGhpcy5fdXBkYXRlKClcblxuICAvLyBwcm9kdWNlIHJlc3VsdFxuICB2YXIgYnVmZmVyID0gQnVmZmVyLmFsbG9jID8gQnVmZmVyLmFsbG9jKDIwKSA6IG5ldyBCdWZmZXIoMjApXG4gIGJ1ZmZlci53cml0ZUludDMyTEUodGhpcy5fYSwgMClcbiAgYnVmZmVyLndyaXRlSW50MzJMRSh0aGlzLl9iLCA0KVxuICBidWZmZXIud3JpdGVJbnQzMkxFKHRoaXMuX2MsIDgpXG4gIGJ1ZmZlci53cml0ZUludDMyTEUodGhpcy5fZCwgMTIpXG4gIGJ1ZmZlci53cml0ZUludDMyTEUodGhpcy5fZSwgMTYpXG4gIHJldHVybiBidWZmZXJcbn1cblxuZnVuY3Rpb24gcm90bCAoeCwgbikge1xuICByZXR1cm4gKHggPDwgbikgfCAoeCA+Pj4gKDMyIC0gbikpXG59XG5cbmZ1bmN0aW9uIGZuMSAoYSwgYiwgYywgZCwgZSwgbSwgaywgcykge1xuICByZXR1cm4gKHJvdGwoKGEgKyAoYiBeIGMgXiBkKSArIG0gKyBrKSB8IDAsIHMpICsgZSkgfCAwXG59XG5cbmZ1bmN0aW9uIGZuMiAoYSwgYiwgYywgZCwgZSwgbSwgaywgcykge1xuICByZXR1cm4gKHJvdGwoKGEgKyAoKGIgJiBjKSB8ICgofmIpICYgZCkpICsgbSArIGspIHwgMCwgcykgKyBlKSB8IDBcbn1cblxuZnVuY3Rpb24gZm4zIChhLCBiLCBjLCBkLCBlLCBtLCBrLCBzKSB7XG4gIHJldHVybiAocm90bCgoYSArICgoYiB8ICh+YykpIF4gZCkgKyBtICsgaykgfCAwLCBzKSArIGUpIHwgMFxufVxuXG5mdW5jdGlvbiBmbjQgKGEsIGIsIGMsIGQsIGUsIG0sIGssIHMpIHtcbiAgcmV0dXJuIChyb3RsKChhICsgKChiICYgZCkgfCAoYyAmICh+ZCkpKSArIG0gKyBrKSB8IDAsIHMpICsgZSkgfCAwXG59XG5cbmZ1bmN0aW9uIGZuNSAoYSwgYiwgYywgZCwgZSwgbSwgaywgcykge1xuICByZXR1cm4gKHJvdGwoKGEgKyAoYiBeIChjIHwgKH5kKSkpICsgbSArIGspIHwgMCwgcykgKyBlKSB8IDBcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBSSVBFTUQxNjBcbiJdLCJzb3VyY2VSb290IjoiIn0=