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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcmlwZW1kMTYwL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBWTtBQUNaLGFBQWEsbUJBQU8sQ0FBQyxvQkFBUTtBQUM3QixlQUFlLG1CQUFPLENBQUMsc0JBQVU7QUFDakMsZUFBZSxtQkFBTyxDQUFDLHVCQUFXOztBQUVsQzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLGlCQUFpQixRQUFROztBQUV6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxpQkFBaUIsUUFBUTtBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSyxPQUFPO0FBQ1o7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEiLCJmaWxlIjoiYnVpbGQvdmVuZG9yL3ZlbmRvci5yaXBlbWQxNjAuZTZkY2Y2ZjVkYzU4OWJkNzQwMTMuY2h1bmsuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCdcclxudmFyIEJ1ZmZlciA9IHJlcXVpcmUoJ2J1ZmZlcicpLkJ1ZmZlclxyXG52YXIgaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpXHJcbnZhciBIYXNoQmFzZSA9IHJlcXVpcmUoJ2hhc2gtYmFzZScpXHJcblxyXG52YXIgQVJSQVkxNiA9IG5ldyBBcnJheSgxNilcclxuXHJcbnZhciB6bCA9IFtcclxuICAwLCAxLCAyLCAzLCA0LCA1LCA2LCA3LCA4LCA5LCAxMCwgMTEsIDEyLCAxMywgMTQsIDE1LFxyXG4gIDcsIDQsIDEzLCAxLCAxMCwgNiwgMTUsIDMsIDEyLCAwLCA5LCA1LCAyLCAxNCwgMTEsIDgsXHJcbiAgMywgMTAsIDE0LCA0LCA5LCAxNSwgOCwgMSwgMiwgNywgMCwgNiwgMTMsIDExLCA1LCAxMixcclxuICAxLCA5LCAxMSwgMTAsIDAsIDgsIDEyLCA0LCAxMywgMywgNywgMTUsIDE0LCA1LCA2LCAyLFxyXG4gIDQsIDAsIDUsIDksIDcsIDEyLCAyLCAxMCwgMTQsIDEsIDMsIDgsIDExLCA2LCAxNSwgMTNcclxuXVxyXG5cclxudmFyIHpyID0gW1xyXG4gIDUsIDE0LCA3LCAwLCA5LCAyLCAxMSwgNCwgMTMsIDYsIDE1LCA4LCAxLCAxMCwgMywgMTIsXHJcbiAgNiwgMTEsIDMsIDcsIDAsIDEzLCA1LCAxMCwgMTQsIDE1LCA4LCAxMiwgNCwgOSwgMSwgMixcclxuICAxNSwgNSwgMSwgMywgNywgMTQsIDYsIDksIDExLCA4LCAxMiwgMiwgMTAsIDAsIDQsIDEzLFxyXG4gIDgsIDYsIDQsIDEsIDMsIDExLCAxNSwgMCwgNSwgMTIsIDIsIDEzLCA5LCA3LCAxMCwgMTQsXHJcbiAgMTIsIDE1LCAxMCwgNCwgMSwgNSwgOCwgNywgNiwgMiwgMTMsIDE0LCAwLCAzLCA5LCAxMVxyXG5dXHJcblxyXG52YXIgc2wgPSBbXHJcbiAgMTEsIDE0LCAxNSwgMTIsIDUsIDgsIDcsIDksIDExLCAxMywgMTQsIDE1LCA2LCA3LCA5LCA4LFxyXG4gIDcsIDYsIDgsIDEzLCAxMSwgOSwgNywgMTUsIDcsIDEyLCAxNSwgOSwgMTEsIDcsIDEzLCAxMixcclxuICAxMSwgMTMsIDYsIDcsIDE0LCA5LCAxMywgMTUsIDE0LCA4LCAxMywgNiwgNSwgMTIsIDcsIDUsXHJcbiAgMTEsIDEyLCAxNCwgMTUsIDE0LCAxNSwgOSwgOCwgOSwgMTQsIDUsIDYsIDgsIDYsIDUsIDEyLFxyXG4gIDksIDE1LCA1LCAxMSwgNiwgOCwgMTMsIDEyLCA1LCAxMiwgMTMsIDE0LCAxMSwgOCwgNSwgNlxyXG5dXHJcblxyXG52YXIgc3IgPSBbXHJcbiAgOCwgOSwgOSwgMTEsIDEzLCAxNSwgMTUsIDUsIDcsIDcsIDgsIDExLCAxNCwgMTQsIDEyLCA2LFxyXG4gIDksIDEzLCAxNSwgNywgMTIsIDgsIDksIDExLCA3LCA3LCAxMiwgNywgNiwgMTUsIDEzLCAxMSxcclxuICA5LCA3LCAxNSwgMTEsIDgsIDYsIDYsIDE0LCAxMiwgMTMsIDUsIDE0LCAxMywgMTMsIDcsIDUsXHJcbiAgMTUsIDUsIDgsIDExLCAxNCwgMTQsIDYsIDE0LCA2LCA5LCAxMiwgOSwgMTIsIDUsIDE1LCA4LFxyXG4gIDgsIDUsIDEyLCA5LCAxMiwgNSwgMTQsIDYsIDgsIDEzLCA2LCA1LCAxNSwgMTMsIDExLCAxMVxyXG5dXHJcblxyXG52YXIgaGwgPSBbMHgwMDAwMDAwMCwgMHg1YTgyNzk5OSwgMHg2ZWQ5ZWJhMSwgMHg4ZjFiYmNkYywgMHhhOTUzZmQ0ZV1cclxudmFyIGhyID0gWzB4NTBhMjhiZTYsIDB4NWM0ZGQxMjQsIDB4NmQ3MDNlZjMsIDB4N2E2ZDc2ZTksIDB4MDAwMDAwMDBdXHJcblxyXG5mdW5jdGlvbiBSSVBFTUQxNjAgKCkge1xyXG4gIEhhc2hCYXNlLmNhbGwodGhpcywgNjQpXHJcblxyXG4gIC8vIHN0YXRlXHJcbiAgdGhpcy5fYSA9IDB4Njc0NTIzMDFcclxuICB0aGlzLl9iID0gMHhlZmNkYWI4OVxyXG4gIHRoaXMuX2MgPSAweDk4YmFkY2ZlXHJcbiAgdGhpcy5fZCA9IDB4MTAzMjU0NzZcclxuICB0aGlzLl9lID0gMHhjM2QyZTFmMFxyXG59XHJcblxyXG5pbmhlcml0cyhSSVBFTUQxNjAsIEhhc2hCYXNlKVxyXG5cclxuUklQRU1EMTYwLnByb3RvdHlwZS5fdXBkYXRlID0gZnVuY3Rpb24gKCkge1xyXG4gIHZhciB3b3JkcyA9IEFSUkFZMTZcclxuICBmb3IgKHZhciBqID0gMDsgaiA8IDE2OyArK2opIHdvcmRzW2pdID0gdGhpcy5fYmxvY2sucmVhZEludDMyTEUoaiAqIDQpXHJcblxyXG4gIHZhciBhbCA9IHRoaXMuX2EgfCAwXHJcbiAgdmFyIGJsID0gdGhpcy5fYiB8IDBcclxuICB2YXIgY2wgPSB0aGlzLl9jIHwgMFxyXG4gIHZhciBkbCA9IHRoaXMuX2QgfCAwXHJcbiAgdmFyIGVsID0gdGhpcy5fZSB8IDBcclxuXHJcbiAgdmFyIGFyID0gdGhpcy5fYSB8IDBcclxuICB2YXIgYnIgPSB0aGlzLl9iIHwgMFxyXG4gIHZhciBjciA9IHRoaXMuX2MgfCAwXHJcbiAgdmFyIGRyID0gdGhpcy5fZCB8IDBcclxuICB2YXIgZXIgPSB0aGlzLl9lIHwgMFxyXG5cclxuICAvLyBjb21wdXRhdGlvblxyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgODA7IGkgKz0gMSkge1xyXG4gICAgdmFyIHRsXHJcbiAgICB2YXIgdHJcclxuICAgIGlmIChpIDwgMTYpIHtcclxuICAgICAgdGwgPSBmbjEoYWwsIGJsLCBjbCwgZGwsIGVsLCB3b3Jkc1t6bFtpXV0sIGhsWzBdLCBzbFtpXSlcclxuICAgICAgdHIgPSBmbjUoYXIsIGJyLCBjciwgZHIsIGVyLCB3b3Jkc1t6cltpXV0sIGhyWzBdLCBzcltpXSlcclxuICAgIH0gZWxzZSBpZiAoaSA8IDMyKSB7XHJcbiAgICAgIHRsID0gZm4yKGFsLCBibCwgY2wsIGRsLCBlbCwgd29yZHNbemxbaV1dLCBobFsxXSwgc2xbaV0pXHJcbiAgICAgIHRyID0gZm40KGFyLCBiciwgY3IsIGRyLCBlciwgd29yZHNbenJbaV1dLCBoclsxXSwgc3JbaV0pXHJcbiAgICB9IGVsc2UgaWYgKGkgPCA0OCkge1xyXG4gICAgICB0bCA9IGZuMyhhbCwgYmwsIGNsLCBkbCwgZWwsIHdvcmRzW3psW2ldXSwgaGxbMl0sIHNsW2ldKVxyXG4gICAgICB0ciA9IGZuMyhhciwgYnIsIGNyLCBkciwgZXIsIHdvcmRzW3pyW2ldXSwgaHJbMl0sIHNyW2ldKVxyXG4gICAgfSBlbHNlIGlmIChpIDwgNjQpIHtcclxuICAgICAgdGwgPSBmbjQoYWwsIGJsLCBjbCwgZGwsIGVsLCB3b3Jkc1t6bFtpXV0sIGhsWzNdLCBzbFtpXSlcclxuICAgICAgdHIgPSBmbjIoYXIsIGJyLCBjciwgZHIsIGVyLCB3b3Jkc1t6cltpXV0sIGhyWzNdLCBzcltpXSlcclxuICAgIH0gZWxzZSB7IC8vIGlmIChpPDgwKSB7XHJcbiAgICAgIHRsID0gZm41KGFsLCBibCwgY2wsIGRsLCBlbCwgd29yZHNbemxbaV1dLCBobFs0XSwgc2xbaV0pXHJcbiAgICAgIHRyID0gZm4xKGFyLCBiciwgY3IsIGRyLCBlciwgd29yZHNbenJbaV1dLCBocls0XSwgc3JbaV0pXHJcbiAgICB9XHJcblxyXG4gICAgYWwgPSBlbFxyXG4gICAgZWwgPSBkbFxyXG4gICAgZGwgPSByb3RsKGNsLCAxMClcclxuICAgIGNsID0gYmxcclxuICAgIGJsID0gdGxcclxuXHJcbiAgICBhciA9IGVyXHJcbiAgICBlciA9IGRyXHJcbiAgICBkciA9IHJvdGwoY3IsIDEwKVxyXG4gICAgY3IgPSBiclxyXG4gICAgYnIgPSB0clxyXG4gIH1cclxuXHJcbiAgLy8gdXBkYXRlIHN0YXRlXHJcbiAgdmFyIHQgPSAodGhpcy5fYiArIGNsICsgZHIpIHwgMFxyXG4gIHRoaXMuX2IgPSAodGhpcy5fYyArIGRsICsgZXIpIHwgMFxyXG4gIHRoaXMuX2MgPSAodGhpcy5fZCArIGVsICsgYXIpIHwgMFxyXG4gIHRoaXMuX2QgPSAodGhpcy5fZSArIGFsICsgYnIpIHwgMFxyXG4gIHRoaXMuX2UgPSAodGhpcy5fYSArIGJsICsgY3IpIHwgMFxyXG4gIHRoaXMuX2EgPSB0XHJcbn1cclxuXHJcblJJUEVNRDE2MC5wcm90b3R5cGUuX2RpZ2VzdCA9IGZ1bmN0aW9uICgpIHtcclxuICAvLyBjcmVhdGUgcGFkZGluZyBhbmQgaGFuZGxlIGJsb2Nrc1xyXG4gIHRoaXMuX2Jsb2NrW3RoaXMuX2Jsb2NrT2Zmc2V0KytdID0gMHg4MFxyXG4gIGlmICh0aGlzLl9ibG9ja09mZnNldCA+IDU2KSB7XHJcbiAgICB0aGlzLl9ibG9jay5maWxsKDAsIHRoaXMuX2Jsb2NrT2Zmc2V0LCA2NClcclxuICAgIHRoaXMuX3VwZGF0ZSgpXHJcbiAgICB0aGlzLl9ibG9ja09mZnNldCA9IDBcclxuICB9XHJcblxyXG4gIHRoaXMuX2Jsb2NrLmZpbGwoMCwgdGhpcy5fYmxvY2tPZmZzZXQsIDU2KVxyXG4gIHRoaXMuX2Jsb2NrLndyaXRlVUludDMyTEUodGhpcy5fbGVuZ3RoWzBdLCA1NilcclxuICB0aGlzLl9ibG9jay53cml0ZVVJbnQzMkxFKHRoaXMuX2xlbmd0aFsxXSwgNjApXHJcbiAgdGhpcy5fdXBkYXRlKClcclxuXHJcbiAgLy8gcHJvZHVjZSByZXN1bHRcclxuICB2YXIgYnVmZmVyID0gQnVmZmVyLmFsbG9jID8gQnVmZmVyLmFsbG9jKDIwKSA6IG5ldyBCdWZmZXIoMjApXHJcbiAgYnVmZmVyLndyaXRlSW50MzJMRSh0aGlzLl9hLCAwKVxyXG4gIGJ1ZmZlci53cml0ZUludDMyTEUodGhpcy5fYiwgNClcclxuICBidWZmZXIud3JpdGVJbnQzMkxFKHRoaXMuX2MsIDgpXHJcbiAgYnVmZmVyLndyaXRlSW50MzJMRSh0aGlzLl9kLCAxMilcclxuICBidWZmZXIud3JpdGVJbnQzMkxFKHRoaXMuX2UsIDE2KVxyXG4gIHJldHVybiBidWZmZXJcclxufVxyXG5cclxuZnVuY3Rpb24gcm90bCAoeCwgbikge1xyXG4gIHJldHVybiAoeCA8PCBuKSB8ICh4ID4+PiAoMzIgLSBuKSlcclxufVxyXG5cclxuZnVuY3Rpb24gZm4xIChhLCBiLCBjLCBkLCBlLCBtLCBrLCBzKSB7XHJcbiAgcmV0dXJuIChyb3RsKChhICsgKGIgXiBjIF4gZCkgKyBtICsgaykgfCAwLCBzKSArIGUpIHwgMFxyXG59XHJcblxyXG5mdW5jdGlvbiBmbjIgKGEsIGIsIGMsIGQsIGUsIG0sIGssIHMpIHtcclxuICByZXR1cm4gKHJvdGwoKGEgKyAoKGIgJiBjKSB8ICgofmIpICYgZCkpICsgbSArIGspIHwgMCwgcykgKyBlKSB8IDBcclxufVxyXG5cclxuZnVuY3Rpb24gZm4zIChhLCBiLCBjLCBkLCBlLCBtLCBrLCBzKSB7XHJcbiAgcmV0dXJuIChyb3RsKChhICsgKChiIHwgKH5jKSkgXiBkKSArIG0gKyBrKSB8IDAsIHMpICsgZSkgfCAwXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGZuNCAoYSwgYiwgYywgZCwgZSwgbSwgaywgcykge1xyXG4gIHJldHVybiAocm90bCgoYSArICgoYiAmIGQpIHwgKGMgJiAofmQpKSkgKyBtICsgaykgfCAwLCBzKSArIGUpIHwgMFxyXG59XHJcblxyXG5mdW5jdGlvbiBmbjUgKGEsIGIsIGMsIGQsIGUsIG0sIGssIHMpIHtcclxuICByZXR1cm4gKHJvdGwoKGEgKyAoYiBeIChjIHwgKH5kKSkpICsgbSArIGspIHwgMCwgcykgKyBlKSB8IDBcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBSSVBFTUQxNjBcclxuIl0sInNvdXJjZVJvb3QiOiIifQ==