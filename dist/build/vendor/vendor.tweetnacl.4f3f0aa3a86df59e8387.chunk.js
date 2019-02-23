(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["vendor/vendor.tweetnacl"],{

/***/ "WKRr":
/*!*********************************************!*\
  !*** ./node_modules/tweetnacl/nacl-fast.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

(function(nacl) {
'use strict';

// Ported in 2014 by Dmitry Chestnykh and Devi Mandiri.
// Public domain.
//
// Implementation derived from TweetNaCl version 20140427.
// See for details: http://tweetnacl.cr.yp.to/

var gf = function(init) {
  var i, r = new Float64Array(16);
  if (init) for (i = 0; i < init.length; i++) r[i] = init[i];
  return r;
};

//  Pluggable, initialized in high-level API below.
var randombytes = function(/* x, n */) { throw new Error('no PRNG'); };

var _0 = new Uint8Array(16);
var _9 = new Uint8Array(32); _9[0] = 9;

var gf0 = gf(),
    gf1 = gf([1]),
    _121665 = gf([0xdb41, 1]),
    D = gf([0x78a3, 0x1359, 0x4dca, 0x75eb, 0xd8ab, 0x4141, 0x0a4d, 0x0070, 0xe898, 0x7779, 0x4079, 0x8cc7, 0xfe73, 0x2b6f, 0x6cee, 0x5203]),
    D2 = gf([0xf159, 0x26b2, 0x9b94, 0xebd6, 0xb156, 0x8283, 0x149a, 0x00e0, 0xd130, 0xeef3, 0x80f2, 0x198e, 0xfce7, 0x56df, 0xd9dc, 0x2406]),
    X = gf([0xd51a, 0x8f25, 0x2d60, 0xc956, 0xa7b2, 0x9525, 0xc760, 0x692c, 0xdc5c, 0xfdd6, 0xe231, 0xc0a4, 0x53fe, 0xcd6e, 0x36d3, 0x2169]),
    Y = gf([0x6658, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666]),
    I = gf([0xa0b0, 0x4a0e, 0x1b27, 0xc4ee, 0xe478, 0xad2f, 0x1806, 0x2f43, 0xd7a7, 0x3dfb, 0x0099, 0x2b4d, 0xdf0b, 0x4fc1, 0x2480, 0x2b83]);

function ts64(x, i, h, l) {
  x[i]   = (h >> 24) & 0xff;
  x[i+1] = (h >> 16) & 0xff;
  x[i+2] = (h >>  8) & 0xff;
  x[i+3] = h & 0xff;
  x[i+4] = (l >> 24)  & 0xff;
  x[i+5] = (l >> 16)  & 0xff;
  x[i+6] = (l >>  8)  & 0xff;
  x[i+7] = l & 0xff;
}

function vn(x, xi, y, yi, n) {
  var i,d = 0;
  for (i = 0; i < n; i++) d |= x[xi+i]^y[yi+i];
  return (1 & ((d - 1) >>> 8)) - 1;
}

function crypto_verify_16(x, xi, y, yi) {
  return vn(x,xi,y,yi,16);
}

function crypto_verify_32(x, xi, y, yi) {
  return vn(x,xi,y,yi,32);
}

function core_salsa20(o, p, k, c) {
  var j0  = c[ 0] & 0xff | (c[ 1] & 0xff)<<8 | (c[ 2] & 0xff)<<16 | (c[ 3] & 0xff)<<24,
      j1  = k[ 0] & 0xff | (k[ 1] & 0xff)<<8 | (k[ 2] & 0xff)<<16 | (k[ 3] & 0xff)<<24,
      j2  = k[ 4] & 0xff | (k[ 5] & 0xff)<<8 | (k[ 6] & 0xff)<<16 | (k[ 7] & 0xff)<<24,
      j3  = k[ 8] & 0xff | (k[ 9] & 0xff)<<8 | (k[10] & 0xff)<<16 | (k[11] & 0xff)<<24,
      j4  = k[12] & 0xff | (k[13] & 0xff)<<8 | (k[14] & 0xff)<<16 | (k[15] & 0xff)<<24,
      j5  = c[ 4] & 0xff | (c[ 5] & 0xff)<<8 | (c[ 6] & 0xff)<<16 | (c[ 7] & 0xff)<<24,
      j6  = p[ 0] & 0xff | (p[ 1] & 0xff)<<8 | (p[ 2] & 0xff)<<16 | (p[ 3] & 0xff)<<24,
      j7  = p[ 4] & 0xff | (p[ 5] & 0xff)<<8 | (p[ 6] & 0xff)<<16 | (p[ 7] & 0xff)<<24,
      j8  = p[ 8] & 0xff | (p[ 9] & 0xff)<<8 | (p[10] & 0xff)<<16 | (p[11] & 0xff)<<24,
      j9  = p[12] & 0xff | (p[13] & 0xff)<<8 | (p[14] & 0xff)<<16 | (p[15] & 0xff)<<24,
      j10 = c[ 8] & 0xff | (c[ 9] & 0xff)<<8 | (c[10] & 0xff)<<16 | (c[11] & 0xff)<<24,
      j11 = k[16] & 0xff | (k[17] & 0xff)<<8 | (k[18] & 0xff)<<16 | (k[19] & 0xff)<<24,
      j12 = k[20] & 0xff | (k[21] & 0xff)<<8 | (k[22] & 0xff)<<16 | (k[23] & 0xff)<<24,
      j13 = k[24] & 0xff | (k[25] & 0xff)<<8 | (k[26] & 0xff)<<16 | (k[27] & 0xff)<<24,
      j14 = k[28] & 0xff | (k[29] & 0xff)<<8 | (k[30] & 0xff)<<16 | (k[31] & 0xff)<<24,
      j15 = c[12] & 0xff | (c[13] & 0xff)<<8 | (c[14] & 0xff)<<16 | (c[15] & 0xff)<<24;

  var x0 = j0, x1 = j1, x2 = j2, x3 = j3, x4 = j4, x5 = j5, x6 = j6, x7 = j7,
      x8 = j8, x9 = j9, x10 = j10, x11 = j11, x12 = j12, x13 = j13, x14 = j14,
      x15 = j15, u;

  for (var i = 0; i < 20; i += 2) {
    u = x0 + x12 | 0;
    x4 ^= u<<7 | u>>>(32-7);
    u = x4 + x0 | 0;
    x8 ^= u<<9 | u>>>(32-9);
    u = x8 + x4 | 0;
    x12 ^= u<<13 | u>>>(32-13);
    u = x12 + x8 | 0;
    x0 ^= u<<18 | u>>>(32-18);

    u = x5 + x1 | 0;
    x9 ^= u<<7 | u>>>(32-7);
    u = x9 + x5 | 0;
    x13 ^= u<<9 | u>>>(32-9);
    u = x13 + x9 | 0;
    x1 ^= u<<13 | u>>>(32-13);
    u = x1 + x13 | 0;
    x5 ^= u<<18 | u>>>(32-18);

    u = x10 + x6 | 0;
    x14 ^= u<<7 | u>>>(32-7);
    u = x14 + x10 | 0;
    x2 ^= u<<9 | u>>>(32-9);
    u = x2 + x14 | 0;
    x6 ^= u<<13 | u>>>(32-13);
    u = x6 + x2 | 0;
    x10 ^= u<<18 | u>>>(32-18);

    u = x15 + x11 | 0;
    x3 ^= u<<7 | u>>>(32-7);
    u = x3 + x15 | 0;
    x7 ^= u<<9 | u>>>(32-9);
    u = x7 + x3 | 0;
    x11 ^= u<<13 | u>>>(32-13);
    u = x11 + x7 | 0;
    x15 ^= u<<18 | u>>>(32-18);

    u = x0 + x3 | 0;
    x1 ^= u<<7 | u>>>(32-7);
    u = x1 + x0 | 0;
    x2 ^= u<<9 | u>>>(32-9);
    u = x2 + x1 | 0;
    x3 ^= u<<13 | u>>>(32-13);
    u = x3 + x2 | 0;
    x0 ^= u<<18 | u>>>(32-18);

    u = x5 + x4 | 0;
    x6 ^= u<<7 | u>>>(32-7);
    u = x6 + x5 | 0;
    x7 ^= u<<9 | u>>>(32-9);
    u = x7 + x6 | 0;
    x4 ^= u<<13 | u>>>(32-13);
    u = x4 + x7 | 0;
    x5 ^= u<<18 | u>>>(32-18);

    u = x10 + x9 | 0;
    x11 ^= u<<7 | u>>>(32-7);
    u = x11 + x10 | 0;
    x8 ^= u<<9 | u>>>(32-9);
    u = x8 + x11 | 0;
    x9 ^= u<<13 | u>>>(32-13);
    u = x9 + x8 | 0;
    x10 ^= u<<18 | u>>>(32-18);

    u = x15 + x14 | 0;
    x12 ^= u<<7 | u>>>(32-7);
    u = x12 + x15 | 0;
    x13 ^= u<<9 | u>>>(32-9);
    u = x13 + x12 | 0;
    x14 ^= u<<13 | u>>>(32-13);
    u = x14 + x13 | 0;
    x15 ^= u<<18 | u>>>(32-18);
  }
   x0 =  x0 +  j0 | 0;
   x1 =  x1 +  j1 | 0;
   x2 =  x2 +  j2 | 0;
   x3 =  x3 +  j3 | 0;
   x4 =  x4 +  j4 | 0;
   x5 =  x5 +  j5 | 0;
   x6 =  x6 +  j6 | 0;
   x7 =  x7 +  j7 | 0;
   x8 =  x8 +  j8 | 0;
   x9 =  x9 +  j9 | 0;
  x10 = x10 + j10 | 0;
  x11 = x11 + j11 | 0;
  x12 = x12 + j12 | 0;
  x13 = x13 + j13 | 0;
  x14 = x14 + j14 | 0;
  x15 = x15 + j15 | 0;

  o[ 0] = x0 >>>  0 & 0xff;
  o[ 1] = x0 >>>  8 & 0xff;
  o[ 2] = x0 >>> 16 & 0xff;
  o[ 3] = x0 >>> 24 & 0xff;

  o[ 4] = x1 >>>  0 & 0xff;
  o[ 5] = x1 >>>  8 & 0xff;
  o[ 6] = x1 >>> 16 & 0xff;
  o[ 7] = x1 >>> 24 & 0xff;

  o[ 8] = x2 >>>  0 & 0xff;
  o[ 9] = x2 >>>  8 & 0xff;
  o[10] = x2 >>> 16 & 0xff;
  o[11] = x2 >>> 24 & 0xff;

  o[12] = x3 >>>  0 & 0xff;
  o[13] = x3 >>>  8 & 0xff;
  o[14] = x3 >>> 16 & 0xff;
  o[15] = x3 >>> 24 & 0xff;

  o[16] = x4 >>>  0 & 0xff;
  o[17] = x4 >>>  8 & 0xff;
  o[18] = x4 >>> 16 & 0xff;
  o[19] = x4 >>> 24 & 0xff;

  o[20] = x5 >>>  0 & 0xff;
  o[21] = x5 >>>  8 & 0xff;
  o[22] = x5 >>> 16 & 0xff;
  o[23] = x5 >>> 24 & 0xff;

  o[24] = x6 >>>  0 & 0xff;
  o[25] = x6 >>>  8 & 0xff;
  o[26] = x6 >>> 16 & 0xff;
  o[27] = x6 >>> 24 & 0xff;

  o[28] = x7 >>>  0 & 0xff;
  o[29] = x7 >>>  8 & 0xff;
  o[30] = x7 >>> 16 & 0xff;
  o[31] = x7 >>> 24 & 0xff;

  o[32] = x8 >>>  0 & 0xff;
  o[33] = x8 >>>  8 & 0xff;
  o[34] = x8 >>> 16 & 0xff;
  o[35] = x8 >>> 24 & 0xff;

  o[36] = x9 >>>  0 & 0xff;
  o[37] = x9 >>>  8 & 0xff;
  o[38] = x9 >>> 16 & 0xff;
  o[39] = x9 >>> 24 & 0xff;

  o[40] = x10 >>>  0 & 0xff;
  o[41] = x10 >>>  8 & 0xff;
  o[42] = x10 >>> 16 & 0xff;
  o[43] = x10 >>> 24 & 0xff;

  o[44] = x11 >>>  0 & 0xff;
  o[45] = x11 >>>  8 & 0xff;
  o[46] = x11 >>> 16 & 0xff;
  o[47] = x11 >>> 24 & 0xff;

  o[48] = x12 >>>  0 & 0xff;
  o[49] = x12 >>>  8 & 0xff;
  o[50] = x12 >>> 16 & 0xff;
  o[51] = x12 >>> 24 & 0xff;

  o[52] = x13 >>>  0 & 0xff;
  o[53] = x13 >>>  8 & 0xff;
  o[54] = x13 >>> 16 & 0xff;
  o[55] = x13 >>> 24 & 0xff;

  o[56] = x14 >>>  0 & 0xff;
  o[57] = x14 >>>  8 & 0xff;
  o[58] = x14 >>> 16 & 0xff;
  o[59] = x14 >>> 24 & 0xff;

  o[60] = x15 >>>  0 & 0xff;
  o[61] = x15 >>>  8 & 0xff;
  o[62] = x15 >>> 16 & 0xff;
  o[63] = x15 >>> 24 & 0xff;
}

function core_hsalsa20(o,p,k,c) {
  var j0  = c[ 0] & 0xff | (c[ 1] & 0xff)<<8 | (c[ 2] & 0xff)<<16 | (c[ 3] & 0xff)<<24,
      j1  = k[ 0] & 0xff | (k[ 1] & 0xff)<<8 | (k[ 2] & 0xff)<<16 | (k[ 3] & 0xff)<<24,
      j2  = k[ 4] & 0xff | (k[ 5] & 0xff)<<8 | (k[ 6] & 0xff)<<16 | (k[ 7] & 0xff)<<24,
      j3  = k[ 8] & 0xff | (k[ 9] & 0xff)<<8 | (k[10] & 0xff)<<16 | (k[11] & 0xff)<<24,
      j4  = k[12] & 0xff | (k[13] & 0xff)<<8 | (k[14] & 0xff)<<16 | (k[15] & 0xff)<<24,
      j5  = c[ 4] & 0xff | (c[ 5] & 0xff)<<8 | (c[ 6] & 0xff)<<16 | (c[ 7] & 0xff)<<24,
      j6  = p[ 0] & 0xff | (p[ 1] & 0xff)<<8 | (p[ 2] & 0xff)<<16 | (p[ 3] & 0xff)<<24,
      j7  = p[ 4] & 0xff | (p[ 5] & 0xff)<<8 | (p[ 6] & 0xff)<<16 | (p[ 7] & 0xff)<<24,
      j8  = p[ 8] & 0xff | (p[ 9] & 0xff)<<8 | (p[10] & 0xff)<<16 | (p[11] & 0xff)<<24,
      j9  = p[12] & 0xff | (p[13] & 0xff)<<8 | (p[14] & 0xff)<<16 | (p[15] & 0xff)<<24,
      j10 = c[ 8] & 0xff | (c[ 9] & 0xff)<<8 | (c[10] & 0xff)<<16 | (c[11] & 0xff)<<24,
      j11 = k[16] & 0xff | (k[17] & 0xff)<<8 | (k[18] & 0xff)<<16 | (k[19] & 0xff)<<24,
      j12 = k[20] & 0xff | (k[21] & 0xff)<<8 | (k[22] & 0xff)<<16 | (k[23] & 0xff)<<24,
      j13 = k[24] & 0xff | (k[25] & 0xff)<<8 | (k[26] & 0xff)<<16 | (k[27] & 0xff)<<24,
      j14 = k[28] & 0xff | (k[29] & 0xff)<<8 | (k[30] & 0xff)<<16 | (k[31] & 0xff)<<24,
      j15 = c[12] & 0xff | (c[13] & 0xff)<<8 | (c[14] & 0xff)<<16 | (c[15] & 0xff)<<24;

  var x0 = j0, x1 = j1, x2 = j2, x3 = j3, x4 = j4, x5 = j5, x6 = j6, x7 = j7,
      x8 = j8, x9 = j9, x10 = j10, x11 = j11, x12 = j12, x13 = j13, x14 = j14,
      x15 = j15, u;

  for (var i = 0; i < 20; i += 2) {
    u = x0 + x12 | 0;
    x4 ^= u<<7 | u>>>(32-7);
    u = x4 + x0 | 0;
    x8 ^= u<<9 | u>>>(32-9);
    u = x8 + x4 | 0;
    x12 ^= u<<13 | u>>>(32-13);
    u = x12 + x8 | 0;
    x0 ^= u<<18 | u>>>(32-18);

    u = x5 + x1 | 0;
    x9 ^= u<<7 | u>>>(32-7);
    u = x9 + x5 | 0;
    x13 ^= u<<9 | u>>>(32-9);
    u = x13 + x9 | 0;
    x1 ^= u<<13 | u>>>(32-13);
    u = x1 + x13 | 0;
    x5 ^= u<<18 | u>>>(32-18);

    u = x10 + x6 | 0;
    x14 ^= u<<7 | u>>>(32-7);
    u = x14 + x10 | 0;
    x2 ^= u<<9 | u>>>(32-9);
    u = x2 + x14 | 0;
    x6 ^= u<<13 | u>>>(32-13);
    u = x6 + x2 | 0;
    x10 ^= u<<18 | u>>>(32-18);

    u = x15 + x11 | 0;
    x3 ^= u<<7 | u>>>(32-7);
    u = x3 + x15 | 0;
    x7 ^= u<<9 | u>>>(32-9);
    u = x7 + x3 | 0;
    x11 ^= u<<13 | u>>>(32-13);
    u = x11 + x7 | 0;
    x15 ^= u<<18 | u>>>(32-18);

    u = x0 + x3 | 0;
    x1 ^= u<<7 | u>>>(32-7);
    u = x1 + x0 | 0;
    x2 ^= u<<9 | u>>>(32-9);
    u = x2 + x1 | 0;
    x3 ^= u<<13 | u>>>(32-13);
    u = x3 + x2 | 0;
    x0 ^= u<<18 | u>>>(32-18);

    u = x5 + x4 | 0;
    x6 ^= u<<7 | u>>>(32-7);
    u = x6 + x5 | 0;
    x7 ^= u<<9 | u>>>(32-9);
    u = x7 + x6 | 0;
    x4 ^= u<<13 | u>>>(32-13);
    u = x4 + x7 | 0;
    x5 ^= u<<18 | u>>>(32-18);

    u = x10 + x9 | 0;
    x11 ^= u<<7 | u>>>(32-7);
    u = x11 + x10 | 0;
    x8 ^= u<<9 | u>>>(32-9);
    u = x8 + x11 | 0;
    x9 ^= u<<13 | u>>>(32-13);
    u = x9 + x8 | 0;
    x10 ^= u<<18 | u>>>(32-18);

    u = x15 + x14 | 0;
    x12 ^= u<<7 | u>>>(32-7);
    u = x12 + x15 | 0;
    x13 ^= u<<9 | u>>>(32-9);
    u = x13 + x12 | 0;
    x14 ^= u<<13 | u>>>(32-13);
    u = x14 + x13 | 0;
    x15 ^= u<<18 | u>>>(32-18);
  }

  o[ 0] = x0 >>>  0 & 0xff;
  o[ 1] = x0 >>>  8 & 0xff;
  o[ 2] = x0 >>> 16 & 0xff;
  o[ 3] = x0 >>> 24 & 0xff;

  o[ 4] = x5 >>>  0 & 0xff;
  o[ 5] = x5 >>>  8 & 0xff;
  o[ 6] = x5 >>> 16 & 0xff;
  o[ 7] = x5 >>> 24 & 0xff;

  o[ 8] = x10 >>>  0 & 0xff;
  o[ 9] = x10 >>>  8 & 0xff;
  o[10] = x10 >>> 16 & 0xff;
  o[11] = x10 >>> 24 & 0xff;

  o[12] = x15 >>>  0 & 0xff;
  o[13] = x15 >>>  8 & 0xff;
  o[14] = x15 >>> 16 & 0xff;
  o[15] = x15 >>> 24 & 0xff;

  o[16] = x6 >>>  0 & 0xff;
  o[17] = x6 >>>  8 & 0xff;
  o[18] = x6 >>> 16 & 0xff;
  o[19] = x6 >>> 24 & 0xff;

  o[20] = x7 >>>  0 & 0xff;
  o[21] = x7 >>>  8 & 0xff;
  o[22] = x7 >>> 16 & 0xff;
  o[23] = x7 >>> 24 & 0xff;

  o[24] = x8 >>>  0 & 0xff;
  o[25] = x8 >>>  8 & 0xff;
  o[26] = x8 >>> 16 & 0xff;
  o[27] = x8 >>> 24 & 0xff;

  o[28] = x9 >>>  0 & 0xff;
  o[29] = x9 >>>  8 & 0xff;
  o[30] = x9 >>> 16 & 0xff;
  o[31] = x9 >>> 24 & 0xff;
}

function crypto_core_salsa20(out,inp,k,c) {
  core_salsa20(out,inp,k,c);
}

function crypto_core_hsalsa20(out,inp,k,c) {
  core_hsalsa20(out,inp,k,c);
}

var sigma = new Uint8Array([101, 120, 112, 97, 110, 100, 32, 51, 50, 45, 98, 121, 116, 101, 32, 107]);
            // "expand 32-byte k"

function crypto_stream_salsa20_xor(c,cpos,m,mpos,b,n,k) {
  var z = new Uint8Array(16), x = new Uint8Array(64);
  var u, i;
  for (i = 0; i < 16; i++) z[i] = 0;
  for (i = 0; i < 8; i++) z[i] = n[i];
  while (b >= 64) {
    crypto_core_salsa20(x,z,k,sigma);
    for (i = 0; i < 64; i++) c[cpos+i] = m[mpos+i] ^ x[i];
    u = 1;
    for (i = 8; i < 16; i++) {
      u = u + (z[i] & 0xff) | 0;
      z[i] = u & 0xff;
      u >>>= 8;
    }
    b -= 64;
    cpos += 64;
    mpos += 64;
  }
  if (b > 0) {
    crypto_core_salsa20(x,z,k,sigma);
    for (i = 0; i < b; i++) c[cpos+i] = m[mpos+i] ^ x[i];
  }
  return 0;
}

function crypto_stream_salsa20(c,cpos,b,n,k) {
  var z = new Uint8Array(16), x = new Uint8Array(64);
  var u, i;
  for (i = 0; i < 16; i++) z[i] = 0;
  for (i = 0; i < 8; i++) z[i] = n[i];
  while (b >= 64) {
    crypto_core_salsa20(x,z,k,sigma);
    for (i = 0; i < 64; i++) c[cpos+i] = x[i];
    u = 1;
    for (i = 8; i < 16; i++) {
      u = u + (z[i] & 0xff) | 0;
      z[i] = u & 0xff;
      u >>>= 8;
    }
    b -= 64;
    cpos += 64;
  }
  if (b > 0) {
    crypto_core_salsa20(x,z,k,sigma);
    for (i = 0; i < b; i++) c[cpos+i] = x[i];
  }
  return 0;
}

function crypto_stream(c,cpos,d,n,k) {
  var s = new Uint8Array(32);
  crypto_core_hsalsa20(s,n,k,sigma);
  var sn = new Uint8Array(8);
  for (var i = 0; i < 8; i++) sn[i] = n[i+16];
  return crypto_stream_salsa20(c,cpos,d,sn,s);
}

function crypto_stream_xor(c,cpos,m,mpos,d,n,k) {
  var s = new Uint8Array(32);
  crypto_core_hsalsa20(s,n,k,sigma);
  var sn = new Uint8Array(8);
  for (var i = 0; i < 8; i++) sn[i] = n[i+16];
  return crypto_stream_salsa20_xor(c,cpos,m,mpos,d,sn,s);
}

/*
* Port of Andrew Moon's Poly1305-donna-16. Public domain.
* https://github.com/floodyberry/poly1305-donna
*/

var poly1305 = function(key) {
  this.buffer = new Uint8Array(16);
  this.r = new Uint16Array(10);
  this.h = new Uint16Array(10);
  this.pad = new Uint16Array(8);
  this.leftover = 0;
  this.fin = 0;

  var t0, t1, t2, t3, t4, t5, t6, t7;

  t0 = key[ 0] & 0xff | (key[ 1] & 0xff) << 8; this.r[0] = ( t0                     ) & 0x1fff;
  t1 = key[ 2] & 0xff | (key[ 3] & 0xff) << 8; this.r[1] = ((t0 >>> 13) | (t1 <<  3)) & 0x1fff;
  t2 = key[ 4] & 0xff | (key[ 5] & 0xff) << 8; this.r[2] = ((t1 >>> 10) | (t2 <<  6)) & 0x1f03;
  t3 = key[ 6] & 0xff | (key[ 7] & 0xff) << 8; this.r[3] = ((t2 >>>  7) | (t3 <<  9)) & 0x1fff;
  t4 = key[ 8] & 0xff | (key[ 9] & 0xff) << 8; this.r[4] = ((t3 >>>  4) | (t4 << 12)) & 0x00ff;
  this.r[5] = ((t4 >>>  1)) & 0x1ffe;
  t5 = key[10] & 0xff | (key[11] & 0xff) << 8; this.r[6] = ((t4 >>> 14) | (t5 <<  2)) & 0x1fff;
  t6 = key[12] & 0xff | (key[13] & 0xff) << 8; this.r[7] = ((t5 >>> 11) | (t6 <<  5)) & 0x1f81;
  t7 = key[14] & 0xff | (key[15] & 0xff) << 8; this.r[8] = ((t6 >>>  8) | (t7 <<  8)) & 0x1fff;
  this.r[9] = ((t7 >>>  5)) & 0x007f;

  this.pad[0] = key[16] & 0xff | (key[17] & 0xff) << 8;
  this.pad[1] = key[18] & 0xff | (key[19] & 0xff) << 8;
  this.pad[2] = key[20] & 0xff | (key[21] & 0xff) << 8;
  this.pad[3] = key[22] & 0xff | (key[23] & 0xff) << 8;
  this.pad[4] = key[24] & 0xff | (key[25] & 0xff) << 8;
  this.pad[5] = key[26] & 0xff | (key[27] & 0xff) << 8;
  this.pad[6] = key[28] & 0xff | (key[29] & 0xff) << 8;
  this.pad[7] = key[30] & 0xff | (key[31] & 0xff) << 8;
};

poly1305.prototype.blocks = function(m, mpos, bytes) {
  var hibit = this.fin ? 0 : (1 << 11);
  var t0, t1, t2, t3, t4, t5, t6, t7, c;
  var d0, d1, d2, d3, d4, d5, d6, d7, d8, d9;

  var h0 = this.h[0],
      h1 = this.h[1],
      h2 = this.h[2],
      h3 = this.h[3],
      h4 = this.h[4],
      h5 = this.h[5],
      h6 = this.h[6],
      h7 = this.h[7],
      h8 = this.h[8],
      h9 = this.h[9];

  var r0 = this.r[0],
      r1 = this.r[1],
      r2 = this.r[2],
      r3 = this.r[3],
      r4 = this.r[4],
      r5 = this.r[5],
      r6 = this.r[6],
      r7 = this.r[7],
      r8 = this.r[8],
      r9 = this.r[9];

  while (bytes >= 16) {
    t0 = m[mpos+ 0] & 0xff | (m[mpos+ 1] & 0xff) << 8; h0 += ( t0                     ) & 0x1fff;
    t1 = m[mpos+ 2] & 0xff | (m[mpos+ 3] & 0xff) << 8; h1 += ((t0 >>> 13) | (t1 <<  3)) & 0x1fff;
    t2 = m[mpos+ 4] & 0xff | (m[mpos+ 5] & 0xff) << 8; h2 += ((t1 >>> 10) | (t2 <<  6)) & 0x1fff;
    t3 = m[mpos+ 6] & 0xff | (m[mpos+ 7] & 0xff) << 8; h3 += ((t2 >>>  7) | (t3 <<  9)) & 0x1fff;
    t4 = m[mpos+ 8] & 0xff | (m[mpos+ 9] & 0xff) << 8; h4 += ((t3 >>>  4) | (t4 << 12)) & 0x1fff;
    h5 += ((t4 >>>  1)) & 0x1fff;
    t5 = m[mpos+10] & 0xff | (m[mpos+11] & 0xff) << 8; h6 += ((t4 >>> 14) | (t5 <<  2)) & 0x1fff;
    t6 = m[mpos+12] & 0xff | (m[mpos+13] & 0xff) << 8; h7 += ((t5 >>> 11) | (t6 <<  5)) & 0x1fff;
    t7 = m[mpos+14] & 0xff | (m[mpos+15] & 0xff) << 8; h8 += ((t6 >>>  8) | (t7 <<  8)) & 0x1fff;
    h9 += ((t7 >>> 5)) | hibit;

    c = 0;

    d0 = c;
    d0 += h0 * r0;
    d0 += h1 * (5 * r9);
    d0 += h2 * (5 * r8);
    d0 += h3 * (5 * r7);
    d0 += h4 * (5 * r6);
    c = (d0 >>> 13); d0 &= 0x1fff;
    d0 += h5 * (5 * r5);
    d0 += h6 * (5 * r4);
    d0 += h7 * (5 * r3);
    d0 += h8 * (5 * r2);
    d0 += h9 * (5 * r1);
    c += (d0 >>> 13); d0 &= 0x1fff;

    d1 = c;
    d1 += h0 * r1;
    d1 += h1 * r0;
    d1 += h2 * (5 * r9);
    d1 += h3 * (5 * r8);
    d1 += h4 * (5 * r7);
    c = (d1 >>> 13); d1 &= 0x1fff;
    d1 += h5 * (5 * r6);
    d1 += h6 * (5 * r5);
    d1 += h7 * (5 * r4);
    d1 += h8 * (5 * r3);
    d1 += h9 * (5 * r2);
    c += (d1 >>> 13); d1 &= 0x1fff;

    d2 = c;
    d2 += h0 * r2;
    d2 += h1 * r1;
    d2 += h2 * r0;
    d2 += h3 * (5 * r9);
    d2 += h4 * (5 * r8);
    c = (d2 >>> 13); d2 &= 0x1fff;
    d2 += h5 * (5 * r7);
    d2 += h6 * (5 * r6);
    d2 += h7 * (5 * r5);
    d2 += h8 * (5 * r4);
    d2 += h9 * (5 * r3);
    c += (d2 >>> 13); d2 &= 0x1fff;

    d3 = c;
    d3 += h0 * r3;
    d3 += h1 * r2;
    d3 += h2 * r1;
    d3 += h3 * r0;
    d3 += h4 * (5 * r9);
    c = (d3 >>> 13); d3 &= 0x1fff;
    d3 += h5 * (5 * r8);
    d3 += h6 * (5 * r7);
    d3 += h7 * (5 * r6);
    d3 += h8 * (5 * r5);
    d3 += h9 * (5 * r4);
    c += (d3 >>> 13); d3 &= 0x1fff;

    d4 = c;
    d4 += h0 * r4;
    d4 += h1 * r3;
    d4 += h2 * r2;
    d4 += h3 * r1;
    d4 += h4 * r0;
    c = (d4 >>> 13); d4 &= 0x1fff;
    d4 += h5 * (5 * r9);
    d4 += h6 * (5 * r8);
    d4 += h7 * (5 * r7);
    d4 += h8 * (5 * r6);
    d4 += h9 * (5 * r5);
    c += (d4 >>> 13); d4 &= 0x1fff;

    d5 = c;
    d5 += h0 * r5;
    d5 += h1 * r4;
    d5 += h2 * r3;
    d5 += h3 * r2;
    d5 += h4 * r1;
    c = (d5 >>> 13); d5 &= 0x1fff;
    d5 += h5 * r0;
    d5 += h6 * (5 * r9);
    d5 += h7 * (5 * r8);
    d5 += h8 * (5 * r7);
    d5 += h9 * (5 * r6);
    c += (d5 >>> 13); d5 &= 0x1fff;

    d6 = c;
    d6 += h0 * r6;
    d6 += h1 * r5;
    d6 += h2 * r4;
    d6 += h3 * r3;
    d6 += h4 * r2;
    c = (d6 >>> 13); d6 &= 0x1fff;
    d6 += h5 * r1;
    d6 += h6 * r0;
    d6 += h7 * (5 * r9);
    d6 += h8 * (5 * r8);
    d6 += h9 * (5 * r7);
    c += (d6 >>> 13); d6 &= 0x1fff;

    d7 = c;
    d7 += h0 * r7;
    d7 += h1 * r6;
    d7 += h2 * r5;
    d7 += h3 * r4;
    d7 += h4 * r3;
    c = (d7 >>> 13); d7 &= 0x1fff;
    d7 += h5 * r2;
    d7 += h6 * r1;
    d7 += h7 * r0;
    d7 += h8 * (5 * r9);
    d7 += h9 * (5 * r8);
    c += (d7 >>> 13); d7 &= 0x1fff;

    d8 = c;
    d8 += h0 * r8;
    d8 += h1 * r7;
    d8 += h2 * r6;
    d8 += h3 * r5;
    d8 += h4 * r4;
    c = (d8 >>> 13); d8 &= 0x1fff;
    d8 += h5 * r3;
    d8 += h6 * r2;
    d8 += h7 * r1;
    d8 += h8 * r0;
    d8 += h9 * (5 * r9);
    c += (d8 >>> 13); d8 &= 0x1fff;

    d9 = c;
    d9 += h0 * r9;
    d9 += h1 * r8;
    d9 += h2 * r7;
    d9 += h3 * r6;
    d9 += h4 * r5;
    c = (d9 >>> 13); d9 &= 0x1fff;
    d9 += h5 * r4;
    d9 += h6 * r3;
    d9 += h7 * r2;
    d9 += h8 * r1;
    d9 += h9 * r0;
    c += (d9 >>> 13); d9 &= 0x1fff;

    c = (((c << 2) + c)) | 0;
    c = (c + d0) | 0;
    d0 = c & 0x1fff;
    c = (c >>> 13);
    d1 += c;

    h0 = d0;
    h1 = d1;
    h2 = d2;
    h3 = d3;
    h4 = d4;
    h5 = d5;
    h6 = d6;
    h7 = d7;
    h8 = d8;
    h9 = d9;

    mpos += 16;
    bytes -= 16;
  }
  this.h[0] = h0;
  this.h[1] = h1;
  this.h[2] = h2;
  this.h[3] = h3;
  this.h[4] = h4;
  this.h[5] = h5;
  this.h[6] = h6;
  this.h[7] = h7;
  this.h[8] = h8;
  this.h[9] = h9;
};

poly1305.prototype.finish = function(mac, macpos) {
  var g = new Uint16Array(10);
  var c, mask, f, i;

  if (this.leftover) {
    i = this.leftover;
    this.buffer[i++] = 1;
    for (; i < 16; i++) this.buffer[i] = 0;
    this.fin = 1;
    this.blocks(this.buffer, 0, 16);
  }

  c = this.h[1] >>> 13;
  this.h[1] &= 0x1fff;
  for (i = 2; i < 10; i++) {
    this.h[i] += c;
    c = this.h[i] >>> 13;
    this.h[i] &= 0x1fff;
  }
  this.h[0] += (c * 5);
  c = this.h[0] >>> 13;
  this.h[0] &= 0x1fff;
  this.h[1] += c;
  c = this.h[1] >>> 13;
  this.h[1] &= 0x1fff;
  this.h[2] += c;

  g[0] = this.h[0] + 5;
  c = g[0] >>> 13;
  g[0] &= 0x1fff;
  for (i = 1; i < 10; i++) {
    g[i] = this.h[i] + c;
    c = g[i] >>> 13;
    g[i] &= 0x1fff;
  }
  g[9] -= (1 << 13);

  mask = (c ^ 1) - 1;
  for (i = 0; i < 10; i++) g[i] &= mask;
  mask = ~mask;
  for (i = 0; i < 10; i++) this.h[i] = (this.h[i] & mask) | g[i];

  this.h[0] = ((this.h[0]       ) | (this.h[1] << 13)                    ) & 0xffff;
  this.h[1] = ((this.h[1] >>>  3) | (this.h[2] << 10)                    ) & 0xffff;
  this.h[2] = ((this.h[2] >>>  6) | (this.h[3] <<  7)                    ) & 0xffff;
  this.h[3] = ((this.h[3] >>>  9) | (this.h[4] <<  4)                    ) & 0xffff;
  this.h[4] = ((this.h[4] >>> 12) | (this.h[5] <<  1) | (this.h[6] << 14)) & 0xffff;
  this.h[5] = ((this.h[6] >>>  2) | (this.h[7] << 11)                    ) & 0xffff;
  this.h[6] = ((this.h[7] >>>  5) | (this.h[8] <<  8)                    ) & 0xffff;
  this.h[7] = ((this.h[8] >>>  8) | (this.h[9] <<  5)                    ) & 0xffff;

  f = this.h[0] + this.pad[0];
  this.h[0] = f & 0xffff;
  for (i = 1; i < 8; i++) {
    f = (((this.h[i] + this.pad[i]) | 0) + (f >>> 16)) | 0;
    this.h[i] = f & 0xffff;
  }

  mac[macpos+ 0] = (this.h[0] >>> 0) & 0xff;
  mac[macpos+ 1] = (this.h[0] >>> 8) & 0xff;
  mac[macpos+ 2] = (this.h[1] >>> 0) & 0xff;
  mac[macpos+ 3] = (this.h[1] >>> 8) & 0xff;
  mac[macpos+ 4] = (this.h[2] >>> 0) & 0xff;
  mac[macpos+ 5] = (this.h[2] >>> 8) & 0xff;
  mac[macpos+ 6] = (this.h[3] >>> 0) & 0xff;
  mac[macpos+ 7] = (this.h[3] >>> 8) & 0xff;
  mac[macpos+ 8] = (this.h[4] >>> 0) & 0xff;
  mac[macpos+ 9] = (this.h[4] >>> 8) & 0xff;
  mac[macpos+10] = (this.h[5] >>> 0) & 0xff;
  mac[macpos+11] = (this.h[5] >>> 8) & 0xff;
  mac[macpos+12] = (this.h[6] >>> 0) & 0xff;
  mac[macpos+13] = (this.h[6] >>> 8) & 0xff;
  mac[macpos+14] = (this.h[7] >>> 0) & 0xff;
  mac[macpos+15] = (this.h[7] >>> 8) & 0xff;
};

poly1305.prototype.update = function(m, mpos, bytes) {
  var i, want;

  if (this.leftover) {
    want = (16 - this.leftover);
    if (want > bytes)
      want = bytes;
    for (i = 0; i < want; i++)
      this.buffer[this.leftover + i] = m[mpos+i];
    bytes -= want;
    mpos += want;
    this.leftover += want;
    if (this.leftover < 16)
      return;
    this.blocks(this.buffer, 0, 16);
    this.leftover = 0;
  }

  if (bytes >= 16) {
    want = bytes - (bytes % 16);
    this.blocks(m, mpos, want);
    mpos += want;
    bytes -= want;
  }

  if (bytes) {
    for (i = 0; i < bytes; i++)
      this.buffer[this.leftover + i] = m[mpos+i];
    this.leftover += bytes;
  }
};

function crypto_onetimeauth(out, outpos, m, mpos, n, k) {
  var s = new poly1305(k);
  s.update(m, mpos, n);
  s.finish(out, outpos);
  return 0;
}

function crypto_onetimeauth_verify(h, hpos, m, mpos, n, k) {
  var x = new Uint8Array(16);
  crypto_onetimeauth(x,0,m,mpos,n,k);
  return crypto_verify_16(h,hpos,x,0);
}

function crypto_secretbox(c,m,d,n,k) {
  var i;
  if (d < 32) return -1;
  crypto_stream_xor(c,0,m,0,d,n,k);
  crypto_onetimeauth(c, 16, c, 32, d - 32, c);
  for (i = 0; i < 16; i++) c[i] = 0;
  return 0;
}

function crypto_secretbox_open(m,c,d,n,k) {
  var i;
  var x = new Uint8Array(32);
  if (d < 32) return -1;
  crypto_stream(x,0,32,n,k);
  if (crypto_onetimeauth_verify(c, 16,c, 32,d - 32,x) !== 0) return -1;
  crypto_stream_xor(m,0,c,0,d,n,k);
  for (i = 0; i < 32; i++) m[i] = 0;
  return 0;
}

function set25519(r, a) {
  var i;
  for (i = 0; i < 16; i++) r[i] = a[i]|0;
}

function car25519(o) {
  var i, v, c = 1;
  for (i = 0; i < 16; i++) {
    v = o[i] + c + 65535;
    c = Math.floor(v / 65536);
    o[i] = v - c * 65536;
  }
  o[0] += c-1 + 37 * (c-1);
}

function sel25519(p, q, b) {
  var t, c = ~(b-1);
  for (var i = 0; i < 16; i++) {
    t = c & (p[i] ^ q[i]);
    p[i] ^= t;
    q[i] ^= t;
  }
}

function pack25519(o, n) {
  var i, j, b;
  var m = gf(), t = gf();
  for (i = 0; i < 16; i++) t[i] = n[i];
  car25519(t);
  car25519(t);
  car25519(t);
  for (j = 0; j < 2; j++) {
    m[0] = t[0] - 0xffed;
    for (i = 1; i < 15; i++) {
      m[i] = t[i] - 0xffff - ((m[i-1]>>16) & 1);
      m[i-1] &= 0xffff;
    }
    m[15] = t[15] - 0x7fff - ((m[14]>>16) & 1);
    b = (m[15]>>16) & 1;
    m[14] &= 0xffff;
    sel25519(t, m, 1-b);
  }
  for (i = 0; i < 16; i++) {
    o[2*i] = t[i] & 0xff;
    o[2*i+1] = t[i]>>8;
  }
}

function neq25519(a, b) {
  var c = new Uint8Array(32), d = new Uint8Array(32);
  pack25519(c, a);
  pack25519(d, b);
  return crypto_verify_32(c, 0, d, 0);
}

function par25519(a) {
  var d = new Uint8Array(32);
  pack25519(d, a);
  return d[0] & 1;
}

function unpack25519(o, n) {
  var i;
  for (i = 0; i < 16; i++) o[i] = n[2*i] + (n[2*i+1] << 8);
  o[15] &= 0x7fff;
}

function A(o, a, b) {
  for (var i = 0; i < 16; i++) o[i] = a[i] + b[i];
}

function Z(o, a, b) {
  for (var i = 0; i < 16; i++) o[i] = a[i] - b[i];
}

function M(o, a, b) {
  var v, c,
     t0 = 0,  t1 = 0,  t2 = 0,  t3 = 0,  t4 = 0,  t5 = 0,  t6 = 0,  t7 = 0,
     t8 = 0,  t9 = 0, t10 = 0, t11 = 0, t12 = 0, t13 = 0, t14 = 0, t15 = 0,
    t16 = 0, t17 = 0, t18 = 0, t19 = 0, t20 = 0, t21 = 0, t22 = 0, t23 = 0,
    t24 = 0, t25 = 0, t26 = 0, t27 = 0, t28 = 0, t29 = 0, t30 = 0,
    b0 = b[0],
    b1 = b[1],
    b2 = b[2],
    b3 = b[3],
    b4 = b[4],
    b5 = b[5],
    b6 = b[6],
    b7 = b[7],
    b8 = b[8],
    b9 = b[9],
    b10 = b[10],
    b11 = b[11],
    b12 = b[12],
    b13 = b[13],
    b14 = b[14],
    b15 = b[15];

  v = a[0];
  t0 += v * b0;
  t1 += v * b1;
  t2 += v * b2;
  t3 += v * b3;
  t4 += v * b4;
  t5 += v * b5;
  t6 += v * b6;
  t7 += v * b7;
  t8 += v * b8;
  t9 += v * b9;
  t10 += v * b10;
  t11 += v * b11;
  t12 += v * b12;
  t13 += v * b13;
  t14 += v * b14;
  t15 += v * b15;
  v = a[1];
  t1 += v * b0;
  t2 += v * b1;
  t3 += v * b2;
  t4 += v * b3;
  t5 += v * b4;
  t6 += v * b5;
  t7 += v * b6;
  t8 += v * b7;
  t9 += v * b8;
  t10 += v * b9;
  t11 += v * b10;
  t12 += v * b11;
  t13 += v * b12;
  t14 += v * b13;
  t15 += v * b14;
  t16 += v * b15;
  v = a[2];
  t2 += v * b0;
  t3 += v * b1;
  t4 += v * b2;
  t5 += v * b3;
  t6 += v * b4;
  t7 += v * b5;
  t8 += v * b6;
  t9 += v * b7;
  t10 += v * b8;
  t11 += v * b9;
  t12 += v * b10;
  t13 += v * b11;
  t14 += v * b12;
  t15 += v * b13;
  t16 += v * b14;
  t17 += v * b15;
  v = a[3];
  t3 += v * b0;
  t4 += v * b1;
  t5 += v * b2;
  t6 += v * b3;
  t7 += v * b4;
  t8 += v * b5;
  t9 += v * b6;
  t10 += v * b7;
  t11 += v * b8;
  t12 += v * b9;
  t13 += v * b10;
  t14 += v * b11;
  t15 += v * b12;
  t16 += v * b13;
  t17 += v * b14;
  t18 += v * b15;
  v = a[4];
  t4 += v * b0;
  t5 += v * b1;
  t6 += v * b2;
  t7 += v * b3;
  t8 += v * b4;
  t9 += v * b5;
  t10 += v * b6;
  t11 += v * b7;
  t12 += v * b8;
  t13 += v * b9;
  t14 += v * b10;
  t15 += v * b11;
  t16 += v * b12;
  t17 += v * b13;
  t18 += v * b14;
  t19 += v * b15;
  v = a[5];
  t5 += v * b0;
  t6 += v * b1;
  t7 += v * b2;
  t8 += v * b3;
  t9 += v * b4;
  t10 += v * b5;
  t11 += v * b6;
  t12 += v * b7;
  t13 += v * b8;
  t14 += v * b9;
  t15 += v * b10;
  t16 += v * b11;
  t17 += v * b12;
  t18 += v * b13;
  t19 += v * b14;
  t20 += v * b15;
  v = a[6];
  t6 += v * b0;
  t7 += v * b1;
  t8 += v * b2;
  t9 += v * b3;
  t10 += v * b4;
  t11 += v * b5;
  t12 += v * b6;
  t13 += v * b7;
  t14 += v * b8;
  t15 += v * b9;
  t16 += v * b10;
  t17 += v * b11;
  t18 += v * b12;
  t19 += v * b13;
  t20 += v * b14;
  t21 += v * b15;
  v = a[7];
  t7 += v * b0;
  t8 += v * b1;
  t9 += v * b2;
  t10 += v * b3;
  t11 += v * b4;
  t12 += v * b5;
  t13 += v * b6;
  t14 += v * b7;
  t15 += v * b8;
  t16 += v * b9;
  t17 += v * b10;
  t18 += v * b11;
  t19 += v * b12;
  t20 += v * b13;
  t21 += v * b14;
  t22 += v * b15;
  v = a[8];
  t8 += v * b0;
  t9 += v * b1;
  t10 += v * b2;
  t11 += v * b3;
  t12 += v * b4;
  t13 += v * b5;
  t14 += v * b6;
  t15 += v * b7;
  t16 += v * b8;
  t17 += v * b9;
  t18 += v * b10;
  t19 += v * b11;
  t20 += v * b12;
  t21 += v * b13;
  t22 += v * b14;
  t23 += v * b15;
  v = a[9];
  t9 += v * b0;
  t10 += v * b1;
  t11 += v * b2;
  t12 += v * b3;
  t13 += v * b4;
  t14 += v * b5;
  t15 += v * b6;
  t16 += v * b7;
  t17 += v * b8;
  t18 += v * b9;
  t19 += v * b10;
  t20 += v * b11;
  t21 += v * b12;
  t22 += v * b13;
  t23 += v * b14;
  t24 += v * b15;
  v = a[10];
  t10 += v * b0;
  t11 += v * b1;
  t12 += v * b2;
  t13 += v * b3;
  t14 += v * b4;
  t15 += v * b5;
  t16 += v * b6;
  t17 += v * b7;
  t18 += v * b8;
  t19 += v * b9;
  t20 += v * b10;
  t21 += v * b11;
  t22 += v * b12;
  t23 += v * b13;
  t24 += v * b14;
  t25 += v * b15;
  v = a[11];
  t11 += v * b0;
  t12 += v * b1;
  t13 += v * b2;
  t14 += v * b3;
  t15 += v * b4;
  t16 += v * b5;
  t17 += v * b6;
  t18 += v * b7;
  t19 += v * b8;
  t20 += v * b9;
  t21 += v * b10;
  t22 += v * b11;
  t23 += v * b12;
  t24 += v * b13;
  t25 += v * b14;
  t26 += v * b15;
  v = a[12];
  t12 += v * b0;
  t13 += v * b1;
  t14 += v * b2;
  t15 += v * b3;
  t16 += v * b4;
  t17 += v * b5;
  t18 += v * b6;
  t19 += v * b7;
  t20 += v * b8;
  t21 += v * b9;
  t22 += v * b10;
  t23 += v * b11;
  t24 += v * b12;
  t25 += v * b13;
  t26 += v * b14;
  t27 += v * b15;
  v = a[13];
  t13 += v * b0;
  t14 += v * b1;
  t15 += v * b2;
  t16 += v * b3;
  t17 += v * b4;
  t18 += v * b5;
  t19 += v * b6;
  t20 += v * b7;
  t21 += v * b8;
  t22 += v * b9;
  t23 += v * b10;
  t24 += v * b11;
  t25 += v * b12;
  t26 += v * b13;
  t27 += v * b14;
  t28 += v * b15;
  v = a[14];
  t14 += v * b0;
  t15 += v * b1;
  t16 += v * b2;
  t17 += v * b3;
  t18 += v * b4;
  t19 += v * b5;
  t20 += v * b6;
  t21 += v * b7;
  t22 += v * b8;
  t23 += v * b9;
  t24 += v * b10;
  t25 += v * b11;
  t26 += v * b12;
  t27 += v * b13;
  t28 += v * b14;
  t29 += v * b15;
  v = a[15];
  t15 += v * b0;
  t16 += v * b1;
  t17 += v * b2;
  t18 += v * b3;
  t19 += v * b4;
  t20 += v * b5;
  t21 += v * b6;
  t22 += v * b7;
  t23 += v * b8;
  t24 += v * b9;
  t25 += v * b10;
  t26 += v * b11;
  t27 += v * b12;
  t28 += v * b13;
  t29 += v * b14;
  t30 += v * b15;

  t0  += 38 * t16;
  t1  += 38 * t17;
  t2  += 38 * t18;
  t3  += 38 * t19;
  t4  += 38 * t20;
  t5  += 38 * t21;
  t6  += 38 * t22;
  t7  += 38 * t23;
  t8  += 38 * t24;
  t9  += 38 * t25;
  t10 += 38 * t26;
  t11 += 38 * t27;
  t12 += 38 * t28;
  t13 += 38 * t29;
  t14 += 38 * t30;
  // t15 left as is

  // first car
  c = 1;
  v =  t0 + c + 65535; c = Math.floor(v / 65536);  t0 = v - c * 65536;
  v =  t1 + c + 65535; c = Math.floor(v / 65536);  t1 = v - c * 65536;
  v =  t2 + c + 65535; c = Math.floor(v / 65536);  t2 = v - c * 65536;
  v =  t3 + c + 65535; c = Math.floor(v / 65536);  t3 = v - c * 65536;
  v =  t4 + c + 65535; c = Math.floor(v / 65536);  t4 = v - c * 65536;
  v =  t5 + c + 65535; c = Math.floor(v / 65536);  t5 = v - c * 65536;
  v =  t6 + c + 65535; c = Math.floor(v / 65536);  t6 = v - c * 65536;
  v =  t7 + c + 65535; c = Math.floor(v / 65536);  t7 = v - c * 65536;
  v =  t8 + c + 65535; c = Math.floor(v / 65536);  t8 = v - c * 65536;
  v =  t9 + c + 65535; c = Math.floor(v / 65536);  t9 = v - c * 65536;
  v = t10 + c + 65535; c = Math.floor(v / 65536); t10 = v - c * 65536;
  v = t11 + c + 65535; c = Math.floor(v / 65536); t11 = v - c * 65536;
  v = t12 + c + 65535; c = Math.floor(v / 65536); t12 = v - c * 65536;
  v = t13 + c + 65535; c = Math.floor(v / 65536); t13 = v - c * 65536;
  v = t14 + c + 65535; c = Math.floor(v / 65536); t14 = v - c * 65536;
  v = t15 + c + 65535; c = Math.floor(v / 65536); t15 = v - c * 65536;
  t0 += c-1 + 37 * (c-1);

  // second car
  c = 1;
  v =  t0 + c + 65535; c = Math.floor(v / 65536);  t0 = v - c * 65536;
  v =  t1 + c + 65535; c = Math.floor(v / 65536);  t1 = v - c * 65536;
  v =  t2 + c + 65535; c = Math.floor(v / 65536);  t2 = v - c * 65536;
  v =  t3 + c + 65535; c = Math.floor(v / 65536);  t3 = v - c * 65536;
  v =  t4 + c + 65535; c = Math.floor(v / 65536);  t4 = v - c * 65536;
  v =  t5 + c + 65535; c = Math.floor(v / 65536);  t5 = v - c * 65536;
  v =  t6 + c + 65535; c = Math.floor(v / 65536);  t6 = v - c * 65536;
  v =  t7 + c + 65535; c = Math.floor(v / 65536);  t7 = v - c * 65536;
  v =  t8 + c + 65535; c = Math.floor(v / 65536);  t8 = v - c * 65536;
  v =  t9 + c + 65535; c = Math.floor(v / 65536);  t9 = v - c * 65536;
  v = t10 + c + 65535; c = Math.floor(v / 65536); t10 = v - c * 65536;
  v = t11 + c + 65535; c = Math.floor(v / 65536); t11 = v - c * 65536;
  v = t12 + c + 65535; c = Math.floor(v / 65536); t12 = v - c * 65536;
  v = t13 + c + 65535; c = Math.floor(v / 65536); t13 = v - c * 65536;
  v = t14 + c + 65535; c = Math.floor(v / 65536); t14 = v - c * 65536;
  v = t15 + c + 65535; c = Math.floor(v / 65536); t15 = v - c * 65536;
  t0 += c-1 + 37 * (c-1);

  o[ 0] = t0;
  o[ 1] = t1;
  o[ 2] = t2;
  o[ 3] = t3;
  o[ 4] = t4;
  o[ 5] = t5;
  o[ 6] = t6;
  o[ 7] = t7;
  o[ 8] = t8;
  o[ 9] = t9;
  o[10] = t10;
  o[11] = t11;
  o[12] = t12;
  o[13] = t13;
  o[14] = t14;
  o[15] = t15;
}

function S(o, a) {
  M(o, a, a);
}

function inv25519(o, i) {
  var c = gf();
  var a;
  for (a = 0; a < 16; a++) c[a] = i[a];
  for (a = 253; a >= 0; a--) {
    S(c, c);
    if(a !== 2 && a !== 4) M(c, c, i);
  }
  for (a = 0; a < 16; a++) o[a] = c[a];
}

function pow2523(o, i) {
  var c = gf();
  var a;
  for (a = 0; a < 16; a++) c[a] = i[a];
  for (a = 250; a >= 0; a--) {
      S(c, c);
      if(a !== 1) M(c, c, i);
  }
  for (a = 0; a < 16; a++) o[a] = c[a];
}

function crypto_scalarmult(q, n, p) {
  var z = new Uint8Array(32);
  var x = new Float64Array(80), r, i;
  var a = gf(), b = gf(), c = gf(),
      d = gf(), e = gf(), f = gf();
  for (i = 0; i < 31; i++) z[i] = n[i];
  z[31]=(n[31]&127)|64;
  z[0]&=248;
  unpack25519(x,p);
  for (i = 0; i < 16; i++) {
    b[i]=x[i];
    d[i]=a[i]=c[i]=0;
  }
  a[0]=d[0]=1;
  for (i=254; i>=0; --i) {
    r=(z[i>>>3]>>>(i&7))&1;
    sel25519(a,b,r);
    sel25519(c,d,r);
    A(e,a,c);
    Z(a,a,c);
    A(c,b,d);
    Z(b,b,d);
    S(d,e);
    S(f,a);
    M(a,c,a);
    M(c,b,e);
    A(e,a,c);
    Z(a,a,c);
    S(b,a);
    Z(c,d,f);
    M(a,c,_121665);
    A(a,a,d);
    M(c,c,a);
    M(a,d,f);
    M(d,b,x);
    S(b,e);
    sel25519(a,b,r);
    sel25519(c,d,r);
  }
  for (i = 0; i < 16; i++) {
    x[i+16]=a[i];
    x[i+32]=c[i];
    x[i+48]=b[i];
    x[i+64]=d[i];
  }
  var x32 = x.subarray(32);
  var x16 = x.subarray(16);
  inv25519(x32,x32);
  M(x16,x16,x32);
  pack25519(q,x16);
  return 0;
}

function crypto_scalarmult_base(q, n) {
  return crypto_scalarmult(q, n, _9);
}

function crypto_box_keypair(y, x) {
  randombytes(x, 32);
  return crypto_scalarmult_base(y, x);
}

function crypto_box_beforenm(k, y, x) {
  var s = new Uint8Array(32);
  crypto_scalarmult(s, x, y);
  return crypto_core_hsalsa20(k, _0, s, sigma);
}

var crypto_box_afternm = crypto_secretbox;
var crypto_box_open_afternm = crypto_secretbox_open;

function crypto_box(c, m, d, n, y, x) {
  var k = new Uint8Array(32);
  crypto_box_beforenm(k, y, x);
  return crypto_box_afternm(c, m, d, n, k);
}

function crypto_box_open(m, c, d, n, y, x) {
  var k = new Uint8Array(32);
  crypto_box_beforenm(k, y, x);
  return crypto_box_open_afternm(m, c, d, n, k);
}

var K = [
  0x428a2f98, 0xd728ae22, 0x71374491, 0x23ef65cd,
  0xb5c0fbcf, 0xec4d3b2f, 0xe9b5dba5, 0x8189dbbc,
  0x3956c25b, 0xf348b538, 0x59f111f1, 0xb605d019,
  0x923f82a4, 0xaf194f9b, 0xab1c5ed5, 0xda6d8118,
  0xd807aa98, 0xa3030242, 0x12835b01, 0x45706fbe,
  0x243185be, 0x4ee4b28c, 0x550c7dc3, 0xd5ffb4e2,
  0x72be5d74, 0xf27b896f, 0x80deb1fe, 0x3b1696b1,
  0x9bdc06a7, 0x25c71235, 0xc19bf174, 0xcf692694,
  0xe49b69c1, 0x9ef14ad2, 0xefbe4786, 0x384f25e3,
  0x0fc19dc6, 0x8b8cd5b5, 0x240ca1cc, 0x77ac9c65,
  0x2de92c6f, 0x592b0275, 0x4a7484aa, 0x6ea6e483,
  0x5cb0a9dc, 0xbd41fbd4, 0x76f988da, 0x831153b5,
  0x983e5152, 0xee66dfab, 0xa831c66d, 0x2db43210,
  0xb00327c8, 0x98fb213f, 0xbf597fc7, 0xbeef0ee4,
  0xc6e00bf3, 0x3da88fc2, 0xd5a79147, 0x930aa725,
  0x06ca6351, 0xe003826f, 0x14292967, 0x0a0e6e70,
  0x27b70a85, 0x46d22ffc, 0x2e1b2138, 0x5c26c926,
  0x4d2c6dfc, 0x5ac42aed, 0x53380d13, 0x9d95b3df,
  0x650a7354, 0x8baf63de, 0x766a0abb, 0x3c77b2a8,
  0x81c2c92e, 0x47edaee6, 0x92722c85, 0x1482353b,
  0xa2bfe8a1, 0x4cf10364, 0xa81a664b, 0xbc423001,
  0xc24b8b70, 0xd0f89791, 0xc76c51a3, 0x0654be30,
  0xd192e819, 0xd6ef5218, 0xd6990624, 0x5565a910,
  0xf40e3585, 0x5771202a, 0x106aa070, 0x32bbd1b8,
  0x19a4c116, 0xb8d2d0c8, 0x1e376c08, 0x5141ab53,
  0x2748774c, 0xdf8eeb99, 0x34b0bcb5, 0xe19b48a8,
  0x391c0cb3, 0xc5c95a63, 0x4ed8aa4a, 0xe3418acb,
  0x5b9cca4f, 0x7763e373, 0x682e6ff3, 0xd6b2b8a3,
  0x748f82ee, 0x5defb2fc, 0x78a5636f, 0x43172f60,
  0x84c87814, 0xa1f0ab72, 0x8cc70208, 0x1a6439ec,
  0x90befffa, 0x23631e28, 0xa4506ceb, 0xde82bde9,
  0xbef9a3f7, 0xb2c67915, 0xc67178f2, 0xe372532b,
  0xca273ece, 0xea26619c, 0xd186b8c7, 0x21c0c207,
  0xeada7dd6, 0xcde0eb1e, 0xf57d4f7f, 0xee6ed178,
  0x06f067aa, 0x72176fba, 0x0a637dc5, 0xa2c898a6,
  0x113f9804, 0xbef90dae, 0x1b710b35, 0x131c471b,
  0x28db77f5, 0x23047d84, 0x32caab7b, 0x40c72493,
  0x3c9ebe0a, 0x15c9bebc, 0x431d67c4, 0x9c100d4c,
  0x4cc5d4be, 0xcb3e42b6, 0x597f299c, 0xfc657e2a,
  0x5fcb6fab, 0x3ad6faec, 0x6c44198c, 0x4a475817
];

function crypto_hashblocks_hl(hh, hl, m, n) {
  var wh = new Int32Array(16), wl = new Int32Array(16),
      bh0, bh1, bh2, bh3, bh4, bh5, bh6, bh7,
      bl0, bl1, bl2, bl3, bl4, bl5, bl6, bl7,
      th, tl, i, j, h, l, a, b, c, d;

  var ah0 = hh[0],
      ah1 = hh[1],
      ah2 = hh[2],
      ah3 = hh[3],
      ah4 = hh[4],
      ah5 = hh[5],
      ah6 = hh[6],
      ah7 = hh[7],

      al0 = hl[0],
      al1 = hl[1],
      al2 = hl[2],
      al3 = hl[3],
      al4 = hl[4],
      al5 = hl[5],
      al6 = hl[6],
      al7 = hl[7];

  var pos = 0;
  while (n >= 128) {
    for (i = 0; i < 16; i++) {
      j = 8 * i + pos;
      wh[i] = (m[j+0] << 24) | (m[j+1] << 16) | (m[j+2] << 8) | m[j+3];
      wl[i] = (m[j+4] << 24) | (m[j+5] << 16) | (m[j+6] << 8) | m[j+7];
    }
    for (i = 0; i < 80; i++) {
      bh0 = ah0;
      bh1 = ah1;
      bh2 = ah2;
      bh3 = ah3;
      bh4 = ah4;
      bh5 = ah5;
      bh6 = ah6;
      bh7 = ah7;

      bl0 = al0;
      bl1 = al1;
      bl2 = al2;
      bl3 = al3;
      bl4 = al4;
      bl5 = al5;
      bl6 = al6;
      bl7 = al7;

      // add
      h = ah7;
      l = al7;

      a = l & 0xffff; b = l >>> 16;
      c = h & 0xffff; d = h >>> 16;

      // Sigma1
      h = ((ah4 >>> 14) | (al4 << (32-14))) ^ ((ah4 >>> 18) | (al4 << (32-18))) ^ ((al4 >>> (41-32)) | (ah4 << (32-(41-32))));
      l = ((al4 >>> 14) | (ah4 << (32-14))) ^ ((al4 >>> 18) | (ah4 << (32-18))) ^ ((ah4 >>> (41-32)) | (al4 << (32-(41-32))));

      a += l & 0xffff; b += l >>> 16;
      c += h & 0xffff; d += h >>> 16;

      // Ch
      h = (ah4 & ah5) ^ (~ah4 & ah6);
      l = (al4 & al5) ^ (~al4 & al6);

      a += l & 0xffff; b += l >>> 16;
      c += h & 0xffff; d += h >>> 16;

      // K
      h = K[i*2];
      l = K[i*2+1];

      a += l & 0xffff; b += l >>> 16;
      c += h & 0xffff; d += h >>> 16;

      // w
      h = wh[i%16];
      l = wl[i%16];

      a += l & 0xffff; b += l >>> 16;
      c += h & 0xffff; d += h >>> 16;

      b += a >>> 16;
      c += b >>> 16;
      d += c >>> 16;

      th = c & 0xffff | d << 16;
      tl = a & 0xffff | b << 16;

      // add
      h = th;
      l = tl;

      a = l & 0xffff; b = l >>> 16;
      c = h & 0xffff; d = h >>> 16;

      // Sigma0
      h = ((ah0 >>> 28) | (al0 << (32-28))) ^ ((al0 >>> (34-32)) | (ah0 << (32-(34-32)))) ^ ((al0 >>> (39-32)) | (ah0 << (32-(39-32))));
      l = ((al0 >>> 28) | (ah0 << (32-28))) ^ ((ah0 >>> (34-32)) | (al0 << (32-(34-32)))) ^ ((ah0 >>> (39-32)) | (al0 << (32-(39-32))));

      a += l & 0xffff; b += l >>> 16;
      c += h & 0xffff; d += h >>> 16;

      // Maj
      h = (ah0 & ah1) ^ (ah0 & ah2) ^ (ah1 & ah2);
      l = (al0 & al1) ^ (al0 & al2) ^ (al1 & al2);

      a += l & 0xffff; b += l >>> 16;
      c += h & 0xffff; d += h >>> 16;

      b += a >>> 16;
      c += b >>> 16;
      d += c >>> 16;

      bh7 = (c & 0xffff) | (d << 16);
      bl7 = (a & 0xffff) | (b << 16);

      // add
      h = bh3;
      l = bl3;

      a = l & 0xffff; b = l >>> 16;
      c = h & 0xffff; d = h >>> 16;

      h = th;
      l = tl;

      a += l & 0xffff; b += l >>> 16;
      c += h & 0xffff; d += h >>> 16;

      b += a >>> 16;
      c += b >>> 16;
      d += c >>> 16;

      bh3 = (c & 0xffff) | (d << 16);
      bl3 = (a & 0xffff) | (b << 16);

      ah1 = bh0;
      ah2 = bh1;
      ah3 = bh2;
      ah4 = bh3;
      ah5 = bh4;
      ah6 = bh5;
      ah7 = bh6;
      ah0 = bh7;

      al1 = bl0;
      al2 = bl1;
      al3 = bl2;
      al4 = bl3;
      al5 = bl4;
      al6 = bl5;
      al7 = bl6;
      al0 = bl7;

      if (i%16 === 15) {
        for (j = 0; j < 16; j++) {
          // add
          h = wh[j];
          l = wl[j];

          a = l & 0xffff; b = l >>> 16;
          c = h & 0xffff; d = h >>> 16;

          h = wh[(j+9)%16];
          l = wl[(j+9)%16];

          a += l & 0xffff; b += l >>> 16;
          c += h & 0xffff; d += h >>> 16;

          // sigma0
          th = wh[(j+1)%16];
          tl = wl[(j+1)%16];
          h = ((th >>> 1) | (tl << (32-1))) ^ ((th >>> 8) | (tl << (32-8))) ^ (th >>> 7);
          l = ((tl >>> 1) | (th << (32-1))) ^ ((tl >>> 8) | (th << (32-8))) ^ ((tl >>> 7) | (th << (32-7)));

          a += l & 0xffff; b += l >>> 16;
          c += h & 0xffff; d += h >>> 16;

          // sigma1
          th = wh[(j+14)%16];
          tl = wl[(j+14)%16];
          h = ((th >>> 19) | (tl << (32-19))) ^ ((tl >>> (61-32)) | (th << (32-(61-32)))) ^ (th >>> 6);
          l = ((tl >>> 19) | (th << (32-19))) ^ ((th >>> (61-32)) | (tl << (32-(61-32)))) ^ ((tl >>> 6) | (th << (32-6)));

          a += l & 0xffff; b += l >>> 16;
          c += h & 0xffff; d += h >>> 16;

          b += a >>> 16;
          c += b >>> 16;
          d += c >>> 16;

          wh[j] = (c & 0xffff) | (d << 16);
          wl[j] = (a & 0xffff) | (b << 16);
        }
      }
    }

    // add
    h = ah0;
    l = al0;

    a = l & 0xffff; b = l >>> 16;
    c = h & 0xffff; d = h >>> 16;

    h = hh[0];
    l = hl[0];

    a += l & 0xffff; b += l >>> 16;
    c += h & 0xffff; d += h >>> 16;

    b += a >>> 16;
    c += b >>> 16;
    d += c >>> 16;

    hh[0] = ah0 = (c & 0xffff) | (d << 16);
    hl[0] = al0 = (a & 0xffff) | (b << 16);

    h = ah1;
    l = al1;

    a = l & 0xffff; b = l >>> 16;
    c = h & 0xffff; d = h >>> 16;

    h = hh[1];
    l = hl[1];

    a += l & 0xffff; b += l >>> 16;
    c += h & 0xffff; d += h >>> 16;

    b += a >>> 16;
    c += b >>> 16;
    d += c >>> 16;

    hh[1] = ah1 = (c & 0xffff) | (d << 16);
    hl[1] = al1 = (a & 0xffff) | (b << 16);

    h = ah2;
    l = al2;

    a = l & 0xffff; b = l >>> 16;
    c = h & 0xffff; d = h >>> 16;

    h = hh[2];
    l = hl[2];

    a += l & 0xffff; b += l >>> 16;
    c += h & 0xffff; d += h >>> 16;

    b += a >>> 16;
    c += b >>> 16;
    d += c >>> 16;

    hh[2] = ah2 = (c & 0xffff) | (d << 16);
    hl[2] = al2 = (a & 0xffff) | (b << 16);

    h = ah3;
    l = al3;

    a = l & 0xffff; b = l >>> 16;
    c = h & 0xffff; d = h >>> 16;

    h = hh[3];
    l = hl[3];

    a += l & 0xffff; b += l >>> 16;
    c += h & 0xffff; d += h >>> 16;

    b += a >>> 16;
    c += b >>> 16;
    d += c >>> 16;

    hh[3] = ah3 = (c & 0xffff) | (d << 16);
    hl[3] = al3 = (a & 0xffff) | (b << 16);

    h = ah4;
    l = al4;

    a = l & 0xffff; b = l >>> 16;
    c = h & 0xffff; d = h >>> 16;

    h = hh[4];
    l = hl[4];

    a += l & 0xffff; b += l >>> 16;
    c += h & 0xffff; d += h >>> 16;

    b += a >>> 16;
    c += b >>> 16;
    d += c >>> 16;

    hh[4] = ah4 = (c & 0xffff) | (d << 16);
    hl[4] = al4 = (a & 0xffff) | (b << 16);

    h = ah5;
    l = al5;

    a = l & 0xffff; b = l >>> 16;
    c = h & 0xffff; d = h >>> 16;

    h = hh[5];
    l = hl[5];

    a += l & 0xffff; b += l >>> 16;
    c += h & 0xffff; d += h >>> 16;

    b += a >>> 16;
    c += b >>> 16;
    d += c >>> 16;

    hh[5] = ah5 = (c & 0xffff) | (d << 16);
    hl[5] = al5 = (a & 0xffff) | (b << 16);

    h = ah6;
    l = al6;

    a = l & 0xffff; b = l >>> 16;
    c = h & 0xffff; d = h >>> 16;

    h = hh[6];
    l = hl[6];

    a += l & 0xffff; b += l >>> 16;
    c += h & 0xffff; d += h >>> 16;

    b += a >>> 16;
    c += b >>> 16;
    d += c >>> 16;

    hh[6] = ah6 = (c & 0xffff) | (d << 16);
    hl[6] = al6 = (a & 0xffff) | (b << 16);

    h = ah7;
    l = al7;

    a = l & 0xffff; b = l >>> 16;
    c = h & 0xffff; d = h >>> 16;

    h = hh[7];
    l = hl[7];

    a += l & 0xffff; b += l >>> 16;
    c += h & 0xffff; d += h >>> 16;

    b += a >>> 16;
    c += b >>> 16;
    d += c >>> 16;

    hh[7] = ah7 = (c & 0xffff) | (d << 16);
    hl[7] = al7 = (a & 0xffff) | (b << 16);

    pos += 128;
    n -= 128;
  }

  return n;
}

function crypto_hash(out, m, n) {
  var hh = new Int32Array(8),
      hl = new Int32Array(8),
      x = new Uint8Array(256),
      i, b = n;

  hh[0] = 0x6a09e667;
  hh[1] = 0xbb67ae85;
  hh[2] = 0x3c6ef372;
  hh[3] = 0xa54ff53a;
  hh[4] = 0x510e527f;
  hh[5] = 0x9b05688c;
  hh[6] = 0x1f83d9ab;
  hh[7] = 0x5be0cd19;

  hl[0] = 0xf3bcc908;
  hl[1] = 0x84caa73b;
  hl[2] = 0xfe94f82b;
  hl[3] = 0x5f1d36f1;
  hl[4] = 0xade682d1;
  hl[5] = 0x2b3e6c1f;
  hl[6] = 0xfb41bd6b;
  hl[7] = 0x137e2179;

  crypto_hashblocks_hl(hh, hl, m, n);
  n %= 128;

  for (i = 0; i < n; i++) x[i] = m[b-n+i];
  x[n] = 128;

  n = 256-128*(n<112?1:0);
  x[n-9] = 0;
  ts64(x, n-8,  (b / 0x20000000) | 0, b << 3);
  crypto_hashblocks_hl(hh, hl, x, n);

  for (i = 0; i < 8; i++) ts64(out, 8*i, hh[i], hl[i]);

  return 0;
}

function add(p, q) {
  var a = gf(), b = gf(), c = gf(),
      d = gf(), e = gf(), f = gf(),
      g = gf(), h = gf(), t = gf();

  Z(a, p[1], p[0]);
  Z(t, q[1], q[0]);
  M(a, a, t);
  A(b, p[0], p[1]);
  A(t, q[0], q[1]);
  M(b, b, t);
  M(c, p[3], q[3]);
  M(c, c, D2);
  M(d, p[2], q[2]);
  A(d, d, d);
  Z(e, b, a);
  Z(f, d, c);
  A(g, d, c);
  A(h, b, a);

  M(p[0], e, f);
  M(p[1], h, g);
  M(p[2], g, f);
  M(p[3], e, h);
}

function cswap(p, q, b) {
  var i;
  for (i = 0; i < 4; i++) {
    sel25519(p[i], q[i], b);
  }
}

function pack(r, p) {
  var tx = gf(), ty = gf(), zi = gf();
  inv25519(zi, p[2]);
  M(tx, p[0], zi);
  M(ty, p[1], zi);
  pack25519(r, ty);
  r[31] ^= par25519(tx) << 7;
}

function scalarmult(p, q, s) {
  var b, i;
  set25519(p[0], gf0);
  set25519(p[1], gf1);
  set25519(p[2], gf1);
  set25519(p[3], gf0);
  for (i = 255; i >= 0; --i) {
    b = (s[(i/8)|0] >> (i&7)) & 1;
    cswap(p, q, b);
    add(q, p);
    add(p, p);
    cswap(p, q, b);
  }
}

function scalarbase(p, s) {
  var q = [gf(), gf(), gf(), gf()];
  set25519(q[0], X);
  set25519(q[1], Y);
  set25519(q[2], gf1);
  M(q[3], X, Y);
  scalarmult(p, q, s);
}

function crypto_sign_keypair(pk, sk, seeded) {
  var d = new Uint8Array(64);
  var p = [gf(), gf(), gf(), gf()];
  var i;

  if (!seeded) randombytes(sk, 32);
  crypto_hash(d, sk, 32);
  d[0] &= 248;
  d[31] &= 127;
  d[31] |= 64;

  scalarbase(p, d);
  pack(pk, p);

  for (i = 0; i < 32; i++) sk[i+32] = pk[i];
  return 0;
}

var L = new Float64Array([0xed, 0xd3, 0xf5, 0x5c, 0x1a, 0x63, 0x12, 0x58, 0xd6, 0x9c, 0xf7, 0xa2, 0xde, 0xf9, 0xde, 0x14, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x10]);

function modL(r, x) {
  var carry, i, j, k;
  for (i = 63; i >= 32; --i) {
    carry = 0;
    for (j = i - 32, k = i - 12; j < k; ++j) {
      x[j] += carry - 16 * x[i] * L[j - (i - 32)];
      carry = (x[j] + 128) >> 8;
      x[j] -= carry * 256;
    }
    x[j] += carry;
    x[i] = 0;
  }
  carry = 0;
  for (j = 0; j < 32; j++) {
    x[j] += carry - (x[31] >> 4) * L[j];
    carry = x[j] >> 8;
    x[j] &= 255;
  }
  for (j = 0; j < 32; j++) x[j] -= carry * L[j];
  for (i = 0; i < 32; i++) {
    x[i+1] += x[i] >> 8;
    r[i] = x[i] & 255;
  }
}

function reduce(r) {
  var x = new Float64Array(64), i;
  for (i = 0; i < 64; i++) x[i] = r[i];
  for (i = 0; i < 64; i++) r[i] = 0;
  modL(r, x);
}

// Note: difference from C - smlen returned, not passed as argument.
function crypto_sign(sm, m, n, sk) {
  var d = new Uint8Array(64), h = new Uint8Array(64), r = new Uint8Array(64);
  var i, j, x = new Float64Array(64);
  var p = [gf(), gf(), gf(), gf()];

  crypto_hash(d, sk, 32);
  d[0] &= 248;
  d[31] &= 127;
  d[31] |= 64;

  var smlen = n + 64;
  for (i = 0; i < n; i++) sm[64 + i] = m[i];
  for (i = 0; i < 32; i++) sm[32 + i] = d[32 + i];

  crypto_hash(r, sm.subarray(32), n+32);
  reduce(r);
  scalarbase(p, r);
  pack(sm, p);

  for (i = 32; i < 64; i++) sm[i] = sk[i];
  crypto_hash(h, sm, n + 64);
  reduce(h);

  for (i = 0; i < 64; i++) x[i] = 0;
  for (i = 0; i < 32; i++) x[i] = r[i];
  for (i = 0; i < 32; i++) {
    for (j = 0; j < 32; j++) {
      x[i+j] += h[i] * d[j];
    }
  }

  modL(sm.subarray(32), x);
  return smlen;
}

function unpackneg(r, p) {
  var t = gf(), chk = gf(), num = gf(),
      den = gf(), den2 = gf(), den4 = gf(),
      den6 = gf();

  set25519(r[2], gf1);
  unpack25519(r[1], p);
  S(num, r[1]);
  M(den, num, D);
  Z(num, num, r[2]);
  A(den, r[2], den);

  S(den2, den);
  S(den4, den2);
  M(den6, den4, den2);
  M(t, den6, num);
  M(t, t, den);

  pow2523(t, t);
  M(t, t, num);
  M(t, t, den);
  M(t, t, den);
  M(r[0], t, den);

  S(chk, r[0]);
  M(chk, chk, den);
  if (neq25519(chk, num)) M(r[0], r[0], I);

  S(chk, r[0]);
  M(chk, chk, den);
  if (neq25519(chk, num)) return -1;

  if (par25519(r[0]) === (p[31]>>7)) Z(r[0], gf0, r[0]);

  M(r[3], r[0], r[1]);
  return 0;
}

function crypto_sign_open(m, sm, n, pk) {
  var i, mlen;
  var t = new Uint8Array(32), h = new Uint8Array(64);
  var p = [gf(), gf(), gf(), gf()],
      q = [gf(), gf(), gf(), gf()];

  mlen = -1;
  if (n < 64) return -1;

  if (unpackneg(q, pk)) return -1;

  for (i = 0; i < n; i++) m[i] = sm[i];
  for (i = 0; i < 32; i++) m[i+32] = pk[i];
  crypto_hash(h, m, n);
  reduce(h);
  scalarmult(p, q, h);

  scalarbase(q, sm.subarray(32));
  add(p, q);
  pack(t, p);

  n -= 64;
  if (crypto_verify_32(sm, 0, t, 0)) {
    for (i = 0; i < n; i++) m[i] = 0;
    return -1;
  }

  for (i = 0; i < n; i++) m[i] = sm[i + 64];
  mlen = n;
  return mlen;
}

var crypto_secretbox_KEYBYTES = 32,
    crypto_secretbox_NONCEBYTES = 24,
    crypto_secretbox_ZEROBYTES = 32,
    crypto_secretbox_BOXZEROBYTES = 16,
    crypto_scalarmult_BYTES = 32,
    crypto_scalarmult_SCALARBYTES = 32,
    crypto_box_PUBLICKEYBYTES = 32,
    crypto_box_SECRETKEYBYTES = 32,
    crypto_box_BEFORENMBYTES = 32,
    crypto_box_NONCEBYTES = crypto_secretbox_NONCEBYTES,
    crypto_box_ZEROBYTES = crypto_secretbox_ZEROBYTES,
    crypto_box_BOXZEROBYTES = crypto_secretbox_BOXZEROBYTES,
    crypto_sign_BYTES = 64,
    crypto_sign_PUBLICKEYBYTES = 32,
    crypto_sign_SECRETKEYBYTES = 64,
    crypto_sign_SEEDBYTES = 32,
    crypto_hash_BYTES = 64;

nacl.lowlevel = {
  crypto_core_hsalsa20: crypto_core_hsalsa20,
  crypto_stream_xor: crypto_stream_xor,
  crypto_stream: crypto_stream,
  crypto_stream_salsa20_xor: crypto_stream_salsa20_xor,
  crypto_stream_salsa20: crypto_stream_salsa20,
  crypto_onetimeauth: crypto_onetimeauth,
  crypto_onetimeauth_verify: crypto_onetimeauth_verify,
  crypto_verify_16: crypto_verify_16,
  crypto_verify_32: crypto_verify_32,
  crypto_secretbox: crypto_secretbox,
  crypto_secretbox_open: crypto_secretbox_open,
  crypto_scalarmult: crypto_scalarmult,
  crypto_scalarmult_base: crypto_scalarmult_base,
  crypto_box_beforenm: crypto_box_beforenm,
  crypto_box_afternm: crypto_box_afternm,
  crypto_box: crypto_box,
  crypto_box_open: crypto_box_open,
  crypto_box_keypair: crypto_box_keypair,
  crypto_hash: crypto_hash,
  crypto_sign: crypto_sign,
  crypto_sign_keypair: crypto_sign_keypair,
  crypto_sign_open: crypto_sign_open,

  crypto_secretbox_KEYBYTES: crypto_secretbox_KEYBYTES,
  crypto_secretbox_NONCEBYTES: crypto_secretbox_NONCEBYTES,
  crypto_secretbox_ZEROBYTES: crypto_secretbox_ZEROBYTES,
  crypto_secretbox_BOXZEROBYTES: crypto_secretbox_BOXZEROBYTES,
  crypto_scalarmult_BYTES: crypto_scalarmult_BYTES,
  crypto_scalarmult_SCALARBYTES: crypto_scalarmult_SCALARBYTES,
  crypto_box_PUBLICKEYBYTES: crypto_box_PUBLICKEYBYTES,
  crypto_box_SECRETKEYBYTES: crypto_box_SECRETKEYBYTES,
  crypto_box_BEFORENMBYTES: crypto_box_BEFORENMBYTES,
  crypto_box_NONCEBYTES: crypto_box_NONCEBYTES,
  crypto_box_ZEROBYTES: crypto_box_ZEROBYTES,
  crypto_box_BOXZEROBYTES: crypto_box_BOXZEROBYTES,
  crypto_sign_BYTES: crypto_sign_BYTES,
  crypto_sign_PUBLICKEYBYTES: crypto_sign_PUBLICKEYBYTES,
  crypto_sign_SECRETKEYBYTES: crypto_sign_SECRETKEYBYTES,
  crypto_sign_SEEDBYTES: crypto_sign_SEEDBYTES,
  crypto_hash_BYTES: crypto_hash_BYTES
};

/* High-level API */

function checkLengths(k, n) {
  if (k.length !== crypto_secretbox_KEYBYTES) throw new Error('bad key size');
  if (n.length !== crypto_secretbox_NONCEBYTES) throw new Error('bad nonce size');
}

function checkBoxLengths(pk, sk) {
  if (pk.length !== crypto_box_PUBLICKEYBYTES) throw new Error('bad public key size');
  if (sk.length !== crypto_box_SECRETKEYBYTES) throw new Error('bad secret key size');
}

function checkArrayTypes() {
  var t, i;
  for (i = 0; i < arguments.length; i++) {
     if ((t = Object.prototype.toString.call(arguments[i])) !== '[object Uint8Array]')
       throw new TypeError('unexpected type ' + t + ', use Uint8Array');
  }
}

function cleanup(arr) {
  for (var i = 0; i < arr.length; i++) arr[i] = 0;
}

// TODO: Completely remove this in v0.15.
if (!nacl.util) {
  nacl.util = {};
  nacl.util.decodeUTF8 = nacl.util.encodeUTF8 = nacl.util.encodeBase64 = nacl.util.decodeBase64 = function() {
    throw new Error('nacl.util moved into separate package: https://github.com/dchest/tweetnacl-util-js');
  };
}

nacl.randomBytes = function(n) {
  var b = new Uint8Array(n);
  randombytes(b, n);
  return b;
};

nacl.secretbox = function(msg, nonce, key) {
  checkArrayTypes(msg, nonce, key);
  checkLengths(key, nonce);
  var m = new Uint8Array(crypto_secretbox_ZEROBYTES + msg.length);
  var c = new Uint8Array(m.length);
  for (var i = 0; i < msg.length; i++) m[i+crypto_secretbox_ZEROBYTES] = msg[i];
  crypto_secretbox(c, m, m.length, nonce, key);
  return c.subarray(crypto_secretbox_BOXZEROBYTES);
};

nacl.secretbox.open = function(box, nonce, key) {
  checkArrayTypes(box, nonce, key);
  checkLengths(key, nonce);
  var c = new Uint8Array(crypto_secretbox_BOXZEROBYTES + box.length);
  var m = new Uint8Array(c.length);
  for (var i = 0; i < box.length; i++) c[i+crypto_secretbox_BOXZEROBYTES] = box[i];
  if (c.length < 32) return false;
  if (crypto_secretbox_open(m, c, c.length, nonce, key) !== 0) return false;
  return m.subarray(crypto_secretbox_ZEROBYTES);
};

nacl.secretbox.keyLength = crypto_secretbox_KEYBYTES;
nacl.secretbox.nonceLength = crypto_secretbox_NONCEBYTES;
nacl.secretbox.overheadLength = crypto_secretbox_BOXZEROBYTES;

nacl.scalarMult = function(n, p) {
  checkArrayTypes(n, p);
  if (n.length !== crypto_scalarmult_SCALARBYTES) throw new Error('bad n size');
  if (p.length !== crypto_scalarmult_BYTES) throw new Error('bad p size');
  var q = new Uint8Array(crypto_scalarmult_BYTES);
  crypto_scalarmult(q, n, p);
  return q;
};

nacl.scalarMult.base = function(n) {
  checkArrayTypes(n);
  if (n.length !== crypto_scalarmult_SCALARBYTES) throw new Error('bad n size');
  var q = new Uint8Array(crypto_scalarmult_BYTES);
  crypto_scalarmult_base(q, n);
  return q;
};

nacl.scalarMult.scalarLength = crypto_scalarmult_SCALARBYTES;
nacl.scalarMult.groupElementLength = crypto_scalarmult_BYTES;

nacl.box = function(msg, nonce, publicKey, secretKey) {
  var k = nacl.box.before(publicKey, secretKey);
  return nacl.secretbox(msg, nonce, k);
};

nacl.box.before = function(publicKey, secretKey) {
  checkArrayTypes(publicKey, secretKey);
  checkBoxLengths(publicKey, secretKey);
  var k = new Uint8Array(crypto_box_BEFORENMBYTES);
  crypto_box_beforenm(k, publicKey, secretKey);
  return k;
};

nacl.box.after = nacl.secretbox;

nacl.box.open = function(msg, nonce, publicKey, secretKey) {
  var k = nacl.box.before(publicKey, secretKey);
  return nacl.secretbox.open(msg, nonce, k);
};

nacl.box.open.after = nacl.secretbox.open;

nacl.box.keyPair = function() {
  var pk = new Uint8Array(crypto_box_PUBLICKEYBYTES);
  var sk = new Uint8Array(crypto_box_SECRETKEYBYTES);
  crypto_box_keypair(pk, sk);
  return {publicKey: pk, secretKey: sk};
};

nacl.box.keyPair.fromSecretKey = function(secretKey) {
  checkArrayTypes(secretKey);
  if (secretKey.length !== crypto_box_SECRETKEYBYTES)
    throw new Error('bad secret key size');
  var pk = new Uint8Array(crypto_box_PUBLICKEYBYTES);
  crypto_scalarmult_base(pk, secretKey);
  return {publicKey: pk, secretKey: new Uint8Array(secretKey)};
};

nacl.box.publicKeyLength = crypto_box_PUBLICKEYBYTES;
nacl.box.secretKeyLength = crypto_box_SECRETKEYBYTES;
nacl.box.sharedKeyLength = crypto_box_BEFORENMBYTES;
nacl.box.nonceLength = crypto_box_NONCEBYTES;
nacl.box.overheadLength = nacl.secretbox.overheadLength;

nacl.sign = function(msg, secretKey) {
  checkArrayTypes(msg, secretKey);
  if (secretKey.length !== crypto_sign_SECRETKEYBYTES)
    throw new Error('bad secret key size');
  var signedMsg = new Uint8Array(crypto_sign_BYTES+msg.length);
  crypto_sign(signedMsg, msg, msg.length, secretKey);
  return signedMsg;
};

nacl.sign.open = function(signedMsg, publicKey) {
  if (arguments.length !== 2)
    throw new Error('nacl.sign.open accepts 2 arguments; did you mean to use nacl.sign.detached.verify?');
  checkArrayTypes(signedMsg, publicKey);
  if (publicKey.length !== crypto_sign_PUBLICKEYBYTES)
    throw new Error('bad public key size');
  var tmp = new Uint8Array(signedMsg.length);
  var mlen = crypto_sign_open(tmp, signedMsg, signedMsg.length, publicKey);
  if (mlen < 0) return null;
  var m = new Uint8Array(mlen);
  for (var i = 0; i < m.length; i++) m[i] = tmp[i];
  return m;
};

nacl.sign.detached = function(msg, secretKey) {
  var signedMsg = nacl.sign(msg, secretKey);
  var sig = new Uint8Array(crypto_sign_BYTES);
  for (var i = 0; i < sig.length; i++) sig[i] = signedMsg[i];
  return sig;
};

nacl.sign.detached.verify = function(msg, sig, publicKey) {
  checkArrayTypes(msg, sig, publicKey);
  if (sig.length !== crypto_sign_BYTES)
    throw new Error('bad signature size');
  if (publicKey.length !== crypto_sign_PUBLICKEYBYTES)
    throw new Error('bad public key size');
  var sm = new Uint8Array(crypto_sign_BYTES + msg.length);
  var m = new Uint8Array(crypto_sign_BYTES + msg.length);
  var i;
  for (i = 0; i < crypto_sign_BYTES; i++) sm[i] = sig[i];
  for (i = 0; i < msg.length; i++) sm[i+crypto_sign_BYTES] = msg[i];
  return (crypto_sign_open(m, sm, sm.length, publicKey) >= 0);
};

nacl.sign.keyPair = function() {
  var pk = new Uint8Array(crypto_sign_PUBLICKEYBYTES);
  var sk = new Uint8Array(crypto_sign_SECRETKEYBYTES);
  crypto_sign_keypair(pk, sk);
  return {publicKey: pk, secretKey: sk};
};

nacl.sign.keyPair.fromSecretKey = function(secretKey) {
  checkArrayTypes(secretKey);
  if (secretKey.length !== crypto_sign_SECRETKEYBYTES)
    throw new Error('bad secret key size');
  var pk = new Uint8Array(crypto_sign_PUBLICKEYBYTES);
  for (var i = 0; i < pk.length; i++) pk[i] = secretKey[32+i];
  return {publicKey: pk, secretKey: new Uint8Array(secretKey)};
};

nacl.sign.keyPair.fromSeed = function(seed) {
  checkArrayTypes(seed);
  if (seed.length !== crypto_sign_SEEDBYTES)
    throw new Error('bad seed size');
  var pk = new Uint8Array(crypto_sign_PUBLICKEYBYTES);
  var sk = new Uint8Array(crypto_sign_SECRETKEYBYTES);
  for (var i = 0; i < 32; i++) sk[i] = seed[i];
  crypto_sign_keypair(pk, sk, true);
  return {publicKey: pk, secretKey: sk};
};

nacl.sign.publicKeyLength = crypto_sign_PUBLICKEYBYTES;
nacl.sign.secretKeyLength = crypto_sign_SECRETKEYBYTES;
nacl.sign.seedLength = crypto_sign_SEEDBYTES;
nacl.sign.signatureLength = crypto_sign_BYTES;

nacl.hash = function(msg) {
  checkArrayTypes(msg);
  var h = new Uint8Array(crypto_hash_BYTES);
  crypto_hash(h, msg, msg.length);
  return h;
};

nacl.hash.hashLength = crypto_hash_BYTES;

nacl.verify = function(x, y) {
  checkArrayTypes(x, y);
  // Zero length arguments are considered not equal.
  if (x.length === 0 || y.length === 0) return false;
  if (x.length !== y.length) return false;
  return (vn(x, 0, y, 0, x.length) === 0) ? true : false;
};

nacl.setPRNG = function(fn) {
  randombytes = fn;
};

(function() {
  // Initialize PRNG if environment provides CSPRNG.
  // If not, methods calling randombytes will throw.
  var crypto = typeof self !== 'undefined' ? (self.crypto || self.msCrypto) : null;
  if (crypto && crypto.getRandomValues) {
    // Browsers.
    var QUOTA = 65536;
    nacl.setPRNG(function(x, n) {
      var i, v = new Uint8Array(n);
      for (i = 0; i < n; i += QUOTA) {
        crypto.getRandomValues(v.subarray(i, i + Math.min(n - i, QUOTA)));
      }
      for (i = 0; i < n; i++) x[i] = v[i];
      cleanup(v);
    });
  } else if (true) {
    // Node.js.
    crypto = __webpack_require__(/*! crypto */ 4);
    if (crypto && crypto.randomBytes) {
      nacl.setPRNG(function(x, n) {
        var i, v = crypto.randomBytes(n);
        for (i = 0; i < n; i++) x[i] = v[i];
        cleanup(v);
      });
    }
  }
})();

})( true && module.exports ? module.exports : (self.nacl = self.nacl || {}));


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdHdlZXRuYWNsL25hY2wtZmFzdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUF1QixpQkFBaUI7QUFDeEM7QUFDQTs7QUFFQTtBQUNBLHdDQUF3Qyw0QkFBNEI7O0FBRXBFO0FBQ0EsNEJBQTRCOztBQUU1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxhQUFhLE9BQU87QUFDcEI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLGlCQUFpQixRQUFRO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxpQkFBaUIsUUFBUTtBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLFFBQVE7QUFDckIsYUFBYSxPQUFPO0FBQ3BCO0FBQ0E7QUFDQSxlQUFlLFFBQVE7QUFDdkI7QUFDQSxlQUFlLFFBQVE7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLE9BQU87QUFDdEI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsUUFBUTtBQUNyQixhQUFhLE9BQU87QUFDcEI7QUFDQTtBQUNBLGVBQWUsUUFBUTtBQUN2QjtBQUNBLGVBQWUsUUFBUTtBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLE9BQU87QUFDdEI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLE9BQU87QUFDeEI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQixPQUFPO0FBQ3hCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsOENBQThDO0FBQzlDLDhDQUE4QztBQUM5Qyw4Q0FBOEM7QUFDOUMsOENBQThDO0FBQzlDLDhDQUE4QztBQUM5QztBQUNBLDhDQUE4QztBQUM5Qyw4Q0FBOEM7QUFDOUMsOENBQThDO0FBQzlDOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHNEQUFzRDtBQUN0RCxzREFBc0Q7QUFDdEQsc0RBQXNEO0FBQ3RELHNEQUFzRDtBQUN0RCxzREFBc0Q7QUFDdEQ7QUFDQSxzREFBc0Q7QUFDdEQsc0RBQXNEO0FBQ3RELHNEQUFzRDtBQUN0RDs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0I7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjs7QUFFckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7O0FBRXJCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQjtBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCOztBQUVyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0I7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjs7QUFFckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7O0FBRXJCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQjtBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCOztBQUVyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0I7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjs7QUFFckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7O0FBRXJCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQjtBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCOztBQUVyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0I7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjs7QUFFckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxVQUFVLFFBQVE7QUFDbEI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxhQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGFBQWEsUUFBUTtBQUNyQjtBQUNBLGFBQWEsUUFBUTs7QUFFckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsYUFBYSxPQUFPO0FBQ3BCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLFVBQVU7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGVBQWUsV0FBVztBQUMxQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLFFBQVE7QUFDckI7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsYUFBYSxRQUFRO0FBQ3JCOztBQUVBO0FBQ0E7QUFDQSxhQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxpQkFBaUIsUUFBUTtBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0E7QUFDQSxhQUFhLE9BQU87QUFDcEI7QUFDQSxlQUFlLFFBQVE7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7O0FBRUE7QUFDQSxpQkFBaUIsUUFBUTtBQUN6Qjs7QUFFQTtBQUNBLGlCQUFpQixRQUFRO0FBQ3pCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHNCQUFzQiwyQkFBMkI7QUFDakQsc0JBQXNCLDJCQUEyQjtBQUNqRCxzQkFBc0IsMkJBQTJCO0FBQ2pELHNCQUFzQiwyQkFBMkI7QUFDakQsc0JBQXNCLDJCQUEyQjtBQUNqRCxzQkFBc0IsMkJBQTJCO0FBQ2pELHNCQUFzQiwyQkFBMkI7QUFDakQsc0JBQXNCLDJCQUEyQjtBQUNqRCxzQkFBc0IsMkJBQTJCO0FBQ2pELHNCQUFzQiwyQkFBMkI7QUFDakQsc0JBQXNCLDJCQUEyQjtBQUNqRCxzQkFBc0IsMkJBQTJCO0FBQ2pELHNCQUFzQiwyQkFBMkI7QUFDakQsc0JBQXNCLDJCQUEyQjtBQUNqRCxzQkFBc0IsMkJBQTJCO0FBQ2pELHNCQUFzQiwyQkFBMkI7QUFDakQ7O0FBRUE7QUFDQTtBQUNBLHNCQUFzQiwyQkFBMkI7QUFDakQsc0JBQXNCLDJCQUEyQjtBQUNqRCxzQkFBc0IsMkJBQTJCO0FBQ2pELHNCQUFzQiwyQkFBMkI7QUFDakQsc0JBQXNCLDJCQUEyQjtBQUNqRCxzQkFBc0IsMkJBQTJCO0FBQ2pELHNCQUFzQiwyQkFBMkI7QUFDakQsc0JBQXNCLDJCQUEyQjtBQUNqRCxzQkFBc0IsMkJBQTJCO0FBQ2pELHNCQUFzQiwyQkFBMkI7QUFDakQsc0JBQXNCLDJCQUEyQjtBQUNqRCxzQkFBc0IsMkJBQTJCO0FBQ2pELHNCQUFzQiwyQkFBMkI7QUFDakQsc0JBQXNCLDJCQUEyQjtBQUNqRCxzQkFBc0IsMkJBQTJCO0FBQ2pELHNCQUFzQiwyQkFBMkI7QUFDakQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsYUFBYSxRQUFRO0FBQ3JCLGVBQWUsUUFBUTtBQUN2QjtBQUNBO0FBQ0E7QUFDQSxhQUFhLFFBQVE7QUFDckI7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsYUFBYSxRQUFRO0FBQ3JCLGVBQWUsUUFBUTtBQUN2QjtBQUNBO0FBQ0E7QUFDQSxhQUFhLFFBQVE7QUFDckI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0E7QUFDQSxhQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLE1BQU07QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGVBQWUsUUFBUTtBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsUUFBUTtBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLHFCQUFxQjtBQUNyQixxQkFBcUI7O0FBRXJCO0FBQ0E7QUFDQTs7QUFFQSxzQkFBc0I7QUFDdEIsc0JBQXNCOztBQUV0QjtBQUNBO0FBQ0E7O0FBRUEsc0JBQXNCO0FBQ3RCLHNCQUFzQjs7QUFFdEI7QUFDQTtBQUNBOztBQUVBLHNCQUFzQjtBQUN0QixzQkFBc0I7O0FBRXRCO0FBQ0E7QUFDQTs7QUFFQSxzQkFBc0I7QUFDdEIsc0JBQXNCOztBQUV0QjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEscUJBQXFCO0FBQ3JCLHFCQUFxQjs7QUFFckI7QUFDQTtBQUNBOztBQUVBLHNCQUFzQjtBQUN0QixzQkFBc0I7O0FBRXRCO0FBQ0E7QUFDQTs7QUFFQSxzQkFBc0I7QUFDdEIsc0JBQXNCOztBQUV0QjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEscUJBQXFCO0FBQ3JCLHFCQUFxQjs7QUFFckI7QUFDQTs7QUFFQSxzQkFBc0I7QUFDdEIsc0JBQXNCOztBQUV0QjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxtQkFBbUIsUUFBUTtBQUMzQjtBQUNBO0FBQ0E7O0FBRUEseUJBQXlCO0FBQ3pCLHlCQUF5Qjs7QUFFekI7QUFDQTs7QUFFQSwwQkFBMEI7QUFDMUIsMEJBQTBCOztBQUUxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDBCQUEwQjtBQUMxQiwwQkFBMEI7O0FBRTFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsMEJBQTBCO0FBQzFCLDBCQUEwQjs7QUFFMUI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLG1CQUFtQjtBQUNuQixtQkFBbUI7O0FBRW5CO0FBQ0E7O0FBRUEsb0JBQW9CO0FBQ3BCLG9CQUFvQjs7QUFFcEI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxtQkFBbUI7QUFDbkIsbUJBQW1COztBQUVuQjtBQUNBOztBQUVBLG9CQUFvQjtBQUNwQixvQkFBb0I7O0FBRXBCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsbUJBQW1CO0FBQ25CLG1CQUFtQjs7QUFFbkI7QUFDQTs7QUFFQSxvQkFBb0I7QUFDcEIsb0JBQW9COztBQUVwQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBLG1CQUFtQjtBQUNuQixtQkFBbUI7O0FBRW5CO0FBQ0E7O0FBRUEsb0JBQW9CO0FBQ3BCLG9CQUFvQjs7QUFFcEI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxtQkFBbUI7QUFDbkIsbUJBQW1COztBQUVuQjtBQUNBOztBQUVBLG9CQUFvQjtBQUNwQixvQkFBb0I7O0FBRXBCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsbUJBQW1CO0FBQ25CLG1CQUFtQjs7QUFFbkI7QUFDQTs7QUFFQSxvQkFBb0I7QUFDcEIsb0JBQW9COztBQUVwQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBLG1CQUFtQjtBQUNuQixtQkFBbUI7O0FBRW5CO0FBQ0E7O0FBRUEsb0JBQW9CO0FBQ3BCLG9CQUFvQjs7QUFFcEI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxtQkFBbUI7QUFDbkIsbUJBQW1COztBQUVuQjtBQUNBOztBQUVBLG9CQUFvQjtBQUNwQixvQkFBb0I7O0FBRXBCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsYUFBYSxPQUFPO0FBQ3BCOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGFBQWEsT0FBTzs7QUFFcEI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGFBQWEsT0FBTztBQUNwQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLFFBQVE7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLGNBQWMsU0FBUztBQUN2QjtBQUNBLGdDQUFnQyxPQUFPO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLFFBQVE7QUFDckIsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxhQUFhLFFBQVE7QUFDckIsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGFBQWEsT0FBTztBQUNwQixhQUFhLFFBQVE7O0FBRXJCO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGNBQWMsUUFBUTtBQUN0QjtBQUNBOztBQUVBLGFBQWEsUUFBUTtBQUNyQixhQUFhLFFBQVE7QUFDckIsYUFBYSxRQUFRO0FBQ3JCLGVBQWUsUUFBUTtBQUN2QjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBLGFBQWEsT0FBTztBQUNwQixhQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7O0FBRUEsYUFBYSxPQUFPO0FBQ3BCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxhQUFhLHNCQUFzQjtBQUNuQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGlCQUFpQixnQkFBZ0I7QUFDakM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLGdCQUFnQjtBQUNqQztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQixnQkFBZ0I7QUFDakM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx3REFBd0Q7QUFDeEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsY0FBYztBQUMvQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQixnQkFBZ0I7QUFDakM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLHVCQUF1QjtBQUNwQyxhQUFhLGdCQUFnQjtBQUM3QjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsZUFBZTtBQUNoQyxVQUFVO0FBQ1Y7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLFFBQVE7QUFDekI7QUFDQSxVQUFVO0FBQ1Y7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsT0FBTztBQUN4QjtBQUNBO0FBQ0EsaUJBQWlCLE9BQU87QUFDeEI7QUFDQSxLQUFLO0FBQ0wsR0FBRyxVQUFVLElBQThCO0FBQzNDO0FBQ0EsYUFBYSxtQkFBTyxDQUFDLGVBQVE7QUFDN0I7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLE9BQU87QUFDMUI7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLENBQUM7O0FBRUQsQ0FBQyxFQUFFLEtBQTZCLGtFQUFrRSIsImZpbGUiOiJidWlsZC92ZW5kb3IvdmVuZG9yLnR3ZWV0bmFjbC40ZjNmMGFhM2E4NmRmNTllODM4Ny5jaHVuay5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbihuYWNsKSB7XHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbi8vIFBvcnRlZCBpbiAyMDE0IGJ5IERtaXRyeSBDaGVzdG55a2ggYW5kIERldmkgTWFuZGlyaS5cclxuLy8gUHVibGljIGRvbWFpbi5cclxuLy9cclxuLy8gSW1wbGVtZW50YXRpb24gZGVyaXZlZCBmcm9tIFR3ZWV0TmFDbCB2ZXJzaW9uIDIwMTQwNDI3LlxyXG4vLyBTZWUgZm9yIGRldGFpbHM6IGh0dHA6Ly90d2VldG5hY2wuY3IueXAudG8vXHJcblxyXG52YXIgZ2YgPSBmdW5jdGlvbihpbml0KSB7XHJcbiAgdmFyIGksIHIgPSBuZXcgRmxvYXQ2NEFycmF5KDE2KTtcclxuICBpZiAoaW5pdCkgZm9yIChpID0gMDsgaSA8IGluaXQubGVuZ3RoOyBpKyspIHJbaV0gPSBpbml0W2ldO1xyXG4gIHJldHVybiByO1xyXG59O1xyXG5cclxuLy8gIFBsdWdnYWJsZSwgaW5pdGlhbGl6ZWQgaW4gaGlnaC1sZXZlbCBBUEkgYmVsb3cuXHJcbnZhciByYW5kb21ieXRlcyA9IGZ1bmN0aW9uKC8qIHgsIG4gKi8pIHsgdGhyb3cgbmV3IEVycm9yKCdubyBQUk5HJyk7IH07XHJcblxyXG52YXIgXzAgPSBuZXcgVWludDhBcnJheSgxNik7XHJcbnZhciBfOSA9IG5ldyBVaW50OEFycmF5KDMyKTsgXzlbMF0gPSA5O1xyXG5cclxudmFyIGdmMCA9IGdmKCksXHJcbiAgICBnZjEgPSBnZihbMV0pLFxyXG4gICAgXzEyMTY2NSA9IGdmKFsweGRiNDEsIDFdKSxcclxuICAgIEQgPSBnZihbMHg3OGEzLCAweDEzNTksIDB4NGRjYSwgMHg3NWViLCAweGQ4YWIsIDB4NDE0MSwgMHgwYTRkLCAweDAwNzAsIDB4ZTg5OCwgMHg3Nzc5LCAweDQwNzksIDB4OGNjNywgMHhmZTczLCAweDJiNmYsIDB4NmNlZSwgMHg1MjAzXSksXHJcbiAgICBEMiA9IGdmKFsweGYxNTksIDB4MjZiMiwgMHg5Yjk0LCAweGViZDYsIDB4YjE1NiwgMHg4MjgzLCAweDE0OWEsIDB4MDBlMCwgMHhkMTMwLCAweGVlZjMsIDB4ODBmMiwgMHgxOThlLCAweGZjZTcsIDB4NTZkZiwgMHhkOWRjLCAweDI0MDZdKSxcclxuICAgIFggPSBnZihbMHhkNTFhLCAweDhmMjUsIDB4MmQ2MCwgMHhjOTU2LCAweGE3YjIsIDB4OTUyNSwgMHhjNzYwLCAweDY5MmMsIDB4ZGM1YywgMHhmZGQ2LCAweGUyMzEsIDB4YzBhNCwgMHg1M2ZlLCAweGNkNmUsIDB4MzZkMywgMHgyMTY5XSksXHJcbiAgICBZID0gZ2YoWzB4NjY1OCwgMHg2NjY2LCAweDY2NjYsIDB4NjY2NiwgMHg2NjY2LCAweDY2NjYsIDB4NjY2NiwgMHg2NjY2LCAweDY2NjYsIDB4NjY2NiwgMHg2NjY2LCAweDY2NjYsIDB4NjY2NiwgMHg2NjY2LCAweDY2NjYsIDB4NjY2Nl0pLFxyXG4gICAgSSA9IGdmKFsweGEwYjAsIDB4NGEwZSwgMHgxYjI3LCAweGM0ZWUsIDB4ZTQ3OCwgMHhhZDJmLCAweDE4MDYsIDB4MmY0MywgMHhkN2E3LCAweDNkZmIsIDB4MDA5OSwgMHgyYjRkLCAweGRmMGIsIDB4NGZjMSwgMHgyNDgwLCAweDJiODNdKTtcclxuXHJcbmZ1bmN0aW9uIHRzNjQoeCwgaSwgaCwgbCkge1xyXG4gIHhbaV0gICA9IChoID4+IDI0KSAmIDB4ZmY7XHJcbiAgeFtpKzFdID0gKGggPj4gMTYpICYgMHhmZjtcclxuICB4W2krMl0gPSAoaCA+PiAgOCkgJiAweGZmO1xyXG4gIHhbaSszXSA9IGggJiAweGZmO1xyXG4gIHhbaSs0XSA9IChsID4+IDI0KSAgJiAweGZmO1xyXG4gIHhbaSs1XSA9IChsID4+IDE2KSAgJiAweGZmO1xyXG4gIHhbaSs2XSA9IChsID4+ICA4KSAgJiAweGZmO1xyXG4gIHhbaSs3XSA9IGwgJiAweGZmO1xyXG59XHJcblxyXG5mdW5jdGlvbiB2bih4LCB4aSwgeSwgeWksIG4pIHtcclxuICB2YXIgaSxkID0gMDtcclxuICBmb3IgKGkgPSAwOyBpIDwgbjsgaSsrKSBkIHw9IHhbeGkraV1eeVt5aStpXTtcclxuICByZXR1cm4gKDEgJiAoKGQgLSAxKSA+Pj4gOCkpIC0gMTtcclxufVxyXG5cclxuZnVuY3Rpb24gY3J5cHRvX3ZlcmlmeV8xNih4LCB4aSwgeSwgeWkpIHtcclxuICByZXR1cm4gdm4oeCx4aSx5LHlpLDE2KTtcclxufVxyXG5cclxuZnVuY3Rpb24gY3J5cHRvX3ZlcmlmeV8zMih4LCB4aSwgeSwgeWkpIHtcclxuICByZXR1cm4gdm4oeCx4aSx5LHlpLDMyKTtcclxufVxyXG5cclxuZnVuY3Rpb24gY29yZV9zYWxzYTIwKG8sIHAsIGssIGMpIHtcclxuICB2YXIgajAgID0gY1sgMF0gJiAweGZmIHwgKGNbIDFdICYgMHhmZik8PDggfCAoY1sgMl0gJiAweGZmKTw8MTYgfCAoY1sgM10gJiAweGZmKTw8MjQsXHJcbiAgICAgIGoxICA9IGtbIDBdICYgMHhmZiB8IChrWyAxXSAmIDB4ZmYpPDw4IHwgKGtbIDJdICYgMHhmZik8PDE2IHwgKGtbIDNdICYgMHhmZik8PDI0LFxyXG4gICAgICBqMiAgPSBrWyA0XSAmIDB4ZmYgfCAoa1sgNV0gJiAweGZmKTw8OCB8IChrWyA2XSAmIDB4ZmYpPDwxNiB8IChrWyA3XSAmIDB4ZmYpPDwyNCxcclxuICAgICAgajMgID0ga1sgOF0gJiAweGZmIHwgKGtbIDldICYgMHhmZik8PDggfCAoa1sxMF0gJiAweGZmKTw8MTYgfCAoa1sxMV0gJiAweGZmKTw8MjQsXHJcbiAgICAgIGo0ICA9IGtbMTJdICYgMHhmZiB8IChrWzEzXSAmIDB4ZmYpPDw4IHwgKGtbMTRdICYgMHhmZik8PDE2IHwgKGtbMTVdICYgMHhmZik8PDI0LFxyXG4gICAgICBqNSAgPSBjWyA0XSAmIDB4ZmYgfCAoY1sgNV0gJiAweGZmKTw8OCB8IChjWyA2XSAmIDB4ZmYpPDwxNiB8IChjWyA3XSAmIDB4ZmYpPDwyNCxcclxuICAgICAgajYgID0gcFsgMF0gJiAweGZmIHwgKHBbIDFdICYgMHhmZik8PDggfCAocFsgMl0gJiAweGZmKTw8MTYgfCAocFsgM10gJiAweGZmKTw8MjQsXHJcbiAgICAgIGo3ICA9IHBbIDRdICYgMHhmZiB8IChwWyA1XSAmIDB4ZmYpPDw4IHwgKHBbIDZdICYgMHhmZik8PDE2IHwgKHBbIDddICYgMHhmZik8PDI0LFxyXG4gICAgICBqOCAgPSBwWyA4XSAmIDB4ZmYgfCAocFsgOV0gJiAweGZmKTw8OCB8IChwWzEwXSAmIDB4ZmYpPDwxNiB8IChwWzExXSAmIDB4ZmYpPDwyNCxcclxuICAgICAgajkgID0gcFsxMl0gJiAweGZmIHwgKHBbMTNdICYgMHhmZik8PDggfCAocFsxNF0gJiAweGZmKTw8MTYgfCAocFsxNV0gJiAweGZmKTw8MjQsXHJcbiAgICAgIGoxMCA9IGNbIDhdICYgMHhmZiB8IChjWyA5XSAmIDB4ZmYpPDw4IHwgKGNbMTBdICYgMHhmZik8PDE2IHwgKGNbMTFdICYgMHhmZik8PDI0LFxyXG4gICAgICBqMTEgPSBrWzE2XSAmIDB4ZmYgfCAoa1sxN10gJiAweGZmKTw8OCB8IChrWzE4XSAmIDB4ZmYpPDwxNiB8IChrWzE5XSAmIDB4ZmYpPDwyNCxcclxuICAgICAgajEyID0ga1syMF0gJiAweGZmIHwgKGtbMjFdICYgMHhmZik8PDggfCAoa1syMl0gJiAweGZmKTw8MTYgfCAoa1syM10gJiAweGZmKTw8MjQsXHJcbiAgICAgIGoxMyA9IGtbMjRdICYgMHhmZiB8IChrWzI1XSAmIDB4ZmYpPDw4IHwgKGtbMjZdICYgMHhmZik8PDE2IHwgKGtbMjddICYgMHhmZik8PDI0LFxyXG4gICAgICBqMTQgPSBrWzI4XSAmIDB4ZmYgfCAoa1syOV0gJiAweGZmKTw8OCB8IChrWzMwXSAmIDB4ZmYpPDwxNiB8IChrWzMxXSAmIDB4ZmYpPDwyNCxcclxuICAgICAgajE1ID0gY1sxMl0gJiAweGZmIHwgKGNbMTNdICYgMHhmZik8PDggfCAoY1sxNF0gJiAweGZmKTw8MTYgfCAoY1sxNV0gJiAweGZmKTw8MjQ7XHJcblxyXG4gIHZhciB4MCA9IGowLCB4MSA9IGoxLCB4MiA9IGoyLCB4MyA9IGozLCB4NCA9IGo0LCB4NSA9IGo1LCB4NiA9IGo2LCB4NyA9IGo3LFxyXG4gICAgICB4OCA9IGo4LCB4OSA9IGo5LCB4MTAgPSBqMTAsIHgxMSA9IGoxMSwgeDEyID0gajEyLCB4MTMgPSBqMTMsIHgxNCA9IGoxNCxcclxuICAgICAgeDE1ID0gajE1LCB1O1xyXG5cclxuICBmb3IgKHZhciBpID0gMDsgaSA8IDIwOyBpICs9IDIpIHtcclxuICAgIHUgPSB4MCArIHgxMiB8IDA7XHJcbiAgICB4NCBePSB1PDw3IHwgdT4+PigzMi03KTtcclxuICAgIHUgPSB4NCArIHgwIHwgMDtcclxuICAgIHg4IF49IHU8PDkgfCB1Pj4+KDMyLTkpO1xyXG4gICAgdSA9IHg4ICsgeDQgfCAwO1xyXG4gICAgeDEyIF49IHU8PDEzIHwgdT4+PigzMi0xMyk7XHJcbiAgICB1ID0geDEyICsgeDggfCAwO1xyXG4gICAgeDAgXj0gdTw8MTggfCB1Pj4+KDMyLTE4KTtcclxuXHJcbiAgICB1ID0geDUgKyB4MSB8IDA7XHJcbiAgICB4OSBePSB1PDw3IHwgdT4+PigzMi03KTtcclxuICAgIHUgPSB4OSArIHg1IHwgMDtcclxuICAgIHgxMyBePSB1PDw5IHwgdT4+PigzMi05KTtcclxuICAgIHUgPSB4MTMgKyB4OSB8IDA7XHJcbiAgICB4MSBePSB1PDwxMyB8IHU+Pj4oMzItMTMpO1xyXG4gICAgdSA9IHgxICsgeDEzIHwgMDtcclxuICAgIHg1IF49IHU8PDE4IHwgdT4+PigzMi0xOCk7XHJcblxyXG4gICAgdSA9IHgxMCArIHg2IHwgMDtcclxuICAgIHgxNCBePSB1PDw3IHwgdT4+PigzMi03KTtcclxuICAgIHUgPSB4MTQgKyB4MTAgfCAwO1xyXG4gICAgeDIgXj0gdTw8OSB8IHU+Pj4oMzItOSk7XHJcbiAgICB1ID0geDIgKyB4MTQgfCAwO1xyXG4gICAgeDYgXj0gdTw8MTMgfCB1Pj4+KDMyLTEzKTtcclxuICAgIHUgPSB4NiArIHgyIHwgMDtcclxuICAgIHgxMCBePSB1PDwxOCB8IHU+Pj4oMzItMTgpO1xyXG5cclxuICAgIHUgPSB4MTUgKyB4MTEgfCAwO1xyXG4gICAgeDMgXj0gdTw8NyB8IHU+Pj4oMzItNyk7XHJcbiAgICB1ID0geDMgKyB4MTUgfCAwO1xyXG4gICAgeDcgXj0gdTw8OSB8IHU+Pj4oMzItOSk7XHJcbiAgICB1ID0geDcgKyB4MyB8IDA7XHJcbiAgICB4MTEgXj0gdTw8MTMgfCB1Pj4+KDMyLTEzKTtcclxuICAgIHUgPSB4MTEgKyB4NyB8IDA7XHJcbiAgICB4MTUgXj0gdTw8MTggfCB1Pj4+KDMyLTE4KTtcclxuXHJcbiAgICB1ID0geDAgKyB4MyB8IDA7XHJcbiAgICB4MSBePSB1PDw3IHwgdT4+PigzMi03KTtcclxuICAgIHUgPSB4MSArIHgwIHwgMDtcclxuICAgIHgyIF49IHU8PDkgfCB1Pj4+KDMyLTkpO1xyXG4gICAgdSA9IHgyICsgeDEgfCAwO1xyXG4gICAgeDMgXj0gdTw8MTMgfCB1Pj4+KDMyLTEzKTtcclxuICAgIHUgPSB4MyArIHgyIHwgMDtcclxuICAgIHgwIF49IHU8PDE4IHwgdT4+PigzMi0xOCk7XHJcblxyXG4gICAgdSA9IHg1ICsgeDQgfCAwO1xyXG4gICAgeDYgXj0gdTw8NyB8IHU+Pj4oMzItNyk7XHJcbiAgICB1ID0geDYgKyB4NSB8IDA7XHJcbiAgICB4NyBePSB1PDw5IHwgdT4+PigzMi05KTtcclxuICAgIHUgPSB4NyArIHg2IHwgMDtcclxuICAgIHg0IF49IHU8PDEzIHwgdT4+PigzMi0xMyk7XHJcbiAgICB1ID0geDQgKyB4NyB8IDA7XHJcbiAgICB4NSBePSB1PDwxOCB8IHU+Pj4oMzItMTgpO1xyXG5cclxuICAgIHUgPSB4MTAgKyB4OSB8IDA7XHJcbiAgICB4MTEgXj0gdTw8NyB8IHU+Pj4oMzItNyk7XHJcbiAgICB1ID0geDExICsgeDEwIHwgMDtcclxuICAgIHg4IF49IHU8PDkgfCB1Pj4+KDMyLTkpO1xyXG4gICAgdSA9IHg4ICsgeDExIHwgMDtcclxuICAgIHg5IF49IHU8PDEzIHwgdT4+PigzMi0xMyk7XHJcbiAgICB1ID0geDkgKyB4OCB8IDA7XHJcbiAgICB4MTAgXj0gdTw8MTggfCB1Pj4+KDMyLTE4KTtcclxuXHJcbiAgICB1ID0geDE1ICsgeDE0IHwgMDtcclxuICAgIHgxMiBePSB1PDw3IHwgdT4+PigzMi03KTtcclxuICAgIHUgPSB4MTIgKyB4MTUgfCAwO1xyXG4gICAgeDEzIF49IHU8PDkgfCB1Pj4+KDMyLTkpO1xyXG4gICAgdSA9IHgxMyArIHgxMiB8IDA7XHJcbiAgICB4MTQgXj0gdTw8MTMgfCB1Pj4+KDMyLTEzKTtcclxuICAgIHUgPSB4MTQgKyB4MTMgfCAwO1xyXG4gICAgeDE1IF49IHU8PDE4IHwgdT4+PigzMi0xOCk7XHJcbiAgfVxyXG4gICB4MCA9ICB4MCArICBqMCB8IDA7XHJcbiAgIHgxID0gIHgxICsgIGoxIHwgMDtcclxuICAgeDIgPSAgeDIgKyAgajIgfCAwO1xyXG4gICB4MyA9ICB4MyArICBqMyB8IDA7XHJcbiAgIHg0ID0gIHg0ICsgIGo0IHwgMDtcclxuICAgeDUgPSAgeDUgKyAgajUgfCAwO1xyXG4gICB4NiA9ICB4NiArICBqNiB8IDA7XHJcbiAgIHg3ID0gIHg3ICsgIGo3IHwgMDtcclxuICAgeDggPSAgeDggKyAgajggfCAwO1xyXG4gICB4OSA9ICB4OSArICBqOSB8IDA7XHJcbiAgeDEwID0geDEwICsgajEwIHwgMDtcclxuICB4MTEgPSB4MTEgKyBqMTEgfCAwO1xyXG4gIHgxMiA9IHgxMiArIGoxMiB8IDA7XHJcbiAgeDEzID0geDEzICsgajEzIHwgMDtcclxuICB4MTQgPSB4MTQgKyBqMTQgfCAwO1xyXG4gIHgxNSA9IHgxNSArIGoxNSB8IDA7XHJcblxyXG4gIG9bIDBdID0geDAgPj4+ICAwICYgMHhmZjtcclxuICBvWyAxXSA9IHgwID4+PiAgOCAmIDB4ZmY7XHJcbiAgb1sgMl0gPSB4MCA+Pj4gMTYgJiAweGZmO1xyXG4gIG9bIDNdID0geDAgPj4+IDI0ICYgMHhmZjtcclxuXHJcbiAgb1sgNF0gPSB4MSA+Pj4gIDAgJiAweGZmO1xyXG4gIG9bIDVdID0geDEgPj4+ICA4ICYgMHhmZjtcclxuICBvWyA2XSA9IHgxID4+PiAxNiAmIDB4ZmY7XHJcbiAgb1sgN10gPSB4MSA+Pj4gMjQgJiAweGZmO1xyXG5cclxuICBvWyA4XSA9IHgyID4+PiAgMCAmIDB4ZmY7XHJcbiAgb1sgOV0gPSB4MiA+Pj4gIDggJiAweGZmO1xyXG4gIG9bMTBdID0geDIgPj4+IDE2ICYgMHhmZjtcclxuICBvWzExXSA9IHgyID4+PiAyNCAmIDB4ZmY7XHJcblxyXG4gIG9bMTJdID0geDMgPj4+ICAwICYgMHhmZjtcclxuICBvWzEzXSA9IHgzID4+PiAgOCAmIDB4ZmY7XHJcbiAgb1sxNF0gPSB4MyA+Pj4gMTYgJiAweGZmO1xyXG4gIG9bMTVdID0geDMgPj4+IDI0ICYgMHhmZjtcclxuXHJcbiAgb1sxNl0gPSB4NCA+Pj4gIDAgJiAweGZmO1xyXG4gIG9bMTddID0geDQgPj4+ICA4ICYgMHhmZjtcclxuICBvWzE4XSA9IHg0ID4+PiAxNiAmIDB4ZmY7XHJcbiAgb1sxOV0gPSB4NCA+Pj4gMjQgJiAweGZmO1xyXG5cclxuICBvWzIwXSA9IHg1ID4+PiAgMCAmIDB4ZmY7XHJcbiAgb1syMV0gPSB4NSA+Pj4gIDggJiAweGZmO1xyXG4gIG9bMjJdID0geDUgPj4+IDE2ICYgMHhmZjtcclxuICBvWzIzXSA9IHg1ID4+PiAyNCAmIDB4ZmY7XHJcblxyXG4gIG9bMjRdID0geDYgPj4+ICAwICYgMHhmZjtcclxuICBvWzI1XSA9IHg2ID4+PiAgOCAmIDB4ZmY7XHJcbiAgb1syNl0gPSB4NiA+Pj4gMTYgJiAweGZmO1xyXG4gIG9bMjddID0geDYgPj4+IDI0ICYgMHhmZjtcclxuXHJcbiAgb1syOF0gPSB4NyA+Pj4gIDAgJiAweGZmO1xyXG4gIG9bMjldID0geDcgPj4+ICA4ICYgMHhmZjtcclxuICBvWzMwXSA9IHg3ID4+PiAxNiAmIDB4ZmY7XHJcbiAgb1szMV0gPSB4NyA+Pj4gMjQgJiAweGZmO1xyXG5cclxuICBvWzMyXSA9IHg4ID4+PiAgMCAmIDB4ZmY7XHJcbiAgb1szM10gPSB4OCA+Pj4gIDggJiAweGZmO1xyXG4gIG9bMzRdID0geDggPj4+IDE2ICYgMHhmZjtcclxuICBvWzM1XSA9IHg4ID4+PiAyNCAmIDB4ZmY7XHJcblxyXG4gIG9bMzZdID0geDkgPj4+ICAwICYgMHhmZjtcclxuICBvWzM3XSA9IHg5ID4+PiAgOCAmIDB4ZmY7XHJcbiAgb1szOF0gPSB4OSA+Pj4gMTYgJiAweGZmO1xyXG4gIG9bMzldID0geDkgPj4+IDI0ICYgMHhmZjtcclxuXHJcbiAgb1s0MF0gPSB4MTAgPj4+ICAwICYgMHhmZjtcclxuICBvWzQxXSA9IHgxMCA+Pj4gIDggJiAweGZmO1xyXG4gIG9bNDJdID0geDEwID4+PiAxNiAmIDB4ZmY7XHJcbiAgb1s0M10gPSB4MTAgPj4+IDI0ICYgMHhmZjtcclxuXHJcbiAgb1s0NF0gPSB4MTEgPj4+ICAwICYgMHhmZjtcclxuICBvWzQ1XSA9IHgxMSA+Pj4gIDggJiAweGZmO1xyXG4gIG9bNDZdID0geDExID4+PiAxNiAmIDB4ZmY7XHJcbiAgb1s0N10gPSB4MTEgPj4+IDI0ICYgMHhmZjtcclxuXHJcbiAgb1s0OF0gPSB4MTIgPj4+ICAwICYgMHhmZjtcclxuICBvWzQ5XSA9IHgxMiA+Pj4gIDggJiAweGZmO1xyXG4gIG9bNTBdID0geDEyID4+PiAxNiAmIDB4ZmY7XHJcbiAgb1s1MV0gPSB4MTIgPj4+IDI0ICYgMHhmZjtcclxuXHJcbiAgb1s1Ml0gPSB4MTMgPj4+ICAwICYgMHhmZjtcclxuICBvWzUzXSA9IHgxMyA+Pj4gIDggJiAweGZmO1xyXG4gIG9bNTRdID0geDEzID4+PiAxNiAmIDB4ZmY7XHJcbiAgb1s1NV0gPSB4MTMgPj4+IDI0ICYgMHhmZjtcclxuXHJcbiAgb1s1Nl0gPSB4MTQgPj4+ICAwICYgMHhmZjtcclxuICBvWzU3XSA9IHgxNCA+Pj4gIDggJiAweGZmO1xyXG4gIG9bNThdID0geDE0ID4+PiAxNiAmIDB4ZmY7XHJcbiAgb1s1OV0gPSB4MTQgPj4+IDI0ICYgMHhmZjtcclxuXHJcbiAgb1s2MF0gPSB4MTUgPj4+ICAwICYgMHhmZjtcclxuICBvWzYxXSA9IHgxNSA+Pj4gIDggJiAweGZmO1xyXG4gIG9bNjJdID0geDE1ID4+PiAxNiAmIDB4ZmY7XHJcbiAgb1s2M10gPSB4MTUgPj4+IDI0ICYgMHhmZjtcclxufVxyXG5cclxuZnVuY3Rpb24gY29yZV9oc2Fsc2EyMChvLHAsayxjKSB7XHJcbiAgdmFyIGowICA9IGNbIDBdICYgMHhmZiB8IChjWyAxXSAmIDB4ZmYpPDw4IHwgKGNbIDJdICYgMHhmZik8PDE2IHwgKGNbIDNdICYgMHhmZik8PDI0LFxyXG4gICAgICBqMSAgPSBrWyAwXSAmIDB4ZmYgfCAoa1sgMV0gJiAweGZmKTw8OCB8IChrWyAyXSAmIDB4ZmYpPDwxNiB8IChrWyAzXSAmIDB4ZmYpPDwyNCxcclxuICAgICAgajIgID0ga1sgNF0gJiAweGZmIHwgKGtbIDVdICYgMHhmZik8PDggfCAoa1sgNl0gJiAweGZmKTw8MTYgfCAoa1sgN10gJiAweGZmKTw8MjQsXHJcbiAgICAgIGozICA9IGtbIDhdICYgMHhmZiB8IChrWyA5XSAmIDB4ZmYpPDw4IHwgKGtbMTBdICYgMHhmZik8PDE2IHwgKGtbMTFdICYgMHhmZik8PDI0LFxyXG4gICAgICBqNCAgPSBrWzEyXSAmIDB4ZmYgfCAoa1sxM10gJiAweGZmKTw8OCB8IChrWzE0XSAmIDB4ZmYpPDwxNiB8IChrWzE1XSAmIDB4ZmYpPDwyNCxcclxuICAgICAgajUgID0gY1sgNF0gJiAweGZmIHwgKGNbIDVdICYgMHhmZik8PDggfCAoY1sgNl0gJiAweGZmKTw8MTYgfCAoY1sgN10gJiAweGZmKTw8MjQsXHJcbiAgICAgIGo2ICA9IHBbIDBdICYgMHhmZiB8IChwWyAxXSAmIDB4ZmYpPDw4IHwgKHBbIDJdICYgMHhmZik8PDE2IHwgKHBbIDNdICYgMHhmZik8PDI0LFxyXG4gICAgICBqNyAgPSBwWyA0XSAmIDB4ZmYgfCAocFsgNV0gJiAweGZmKTw8OCB8IChwWyA2XSAmIDB4ZmYpPDwxNiB8IChwWyA3XSAmIDB4ZmYpPDwyNCxcclxuICAgICAgajggID0gcFsgOF0gJiAweGZmIHwgKHBbIDldICYgMHhmZik8PDggfCAocFsxMF0gJiAweGZmKTw8MTYgfCAocFsxMV0gJiAweGZmKTw8MjQsXHJcbiAgICAgIGo5ICA9IHBbMTJdICYgMHhmZiB8IChwWzEzXSAmIDB4ZmYpPDw4IHwgKHBbMTRdICYgMHhmZik8PDE2IHwgKHBbMTVdICYgMHhmZik8PDI0LFxyXG4gICAgICBqMTAgPSBjWyA4XSAmIDB4ZmYgfCAoY1sgOV0gJiAweGZmKTw8OCB8IChjWzEwXSAmIDB4ZmYpPDwxNiB8IChjWzExXSAmIDB4ZmYpPDwyNCxcclxuICAgICAgajExID0ga1sxNl0gJiAweGZmIHwgKGtbMTddICYgMHhmZik8PDggfCAoa1sxOF0gJiAweGZmKTw8MTYgfCAoa1sxOV0gJiAweGZmKTw8MjQsXHJcbiAgICAgIGoxMiA9IGtbMjBdICYgMHhmZiB8IChrWzIxXSAmIDB4ZmYpPDw4IHwgKGtbMjJdICYgMHhmZik8PDE2IHwgKGtbMjNdICYgMHhmZik8PDI0LFxyXG4gICAgICBqMTMgPSBrWzI0XSAmIDB4ZmYgfCAoa1syNV0gJiAweGZmKTw8OCB8IChrWzI2XSAmIDB4ZmYpPDwxNiB8IChrWzI3XSAmIDB4ZmYpPDwyNCxcclxuICAgICAgajE0ID0ga1syOF0gJiAweGZmIHwgKGtbMjldICYgMHhmZik8PDggfCAoa1szMF0gJiAweGZmKTw8MTYgfCAoa1szMV0gJiAweGZmKTw8MjQsXHJcbiAgICAgIGoxNSA9IGNbMTJdICYgMHhmZiB8IChjWzEzXSAmIDB4ZmYpPDw4IHwgKGNbMTRdICYgMHhmZik8PDE2IHwgKGNbMTVdICYgMHhmZik8PDI0O1xyXG5cclxuICB2YXIgeDAgPSBqMCwgeDEgPSBqMSwgeDIgPSBqMiwgeDMgPSBqMywgeDQgPSBqNCwgeDUgPSBqNSwgeDYgPSBqNiwgeDcgPSBqNyxcclxuICAgICAgeDggPSBqOCwgeDkgPSBqOSwgeDEwID0gajEwLCB4MTEgPSBqMTEsIHgxMiA9IGoxMiwgeDEzID0gajEzLCB4MTQgPSBqMTQsXHJcbiAgICAgIHgxNSA9IGoxNSwgdTtcclxuXHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCAyMDsgaSArPSAyKSB7XHJcbiAgICB1ID0geDAgKyB4MTIgfCAwO1xyXG4gICAgeDQgXj0gdTw8NyB8IHU+Pj4oMzItNyk7XHJcbiAgICB1ID0geDQgKyB4MCB8IDA7XHJcbiAgICB4OCBePSB1PDw5IHwgdT4+PigzMi05KTtcclxuICAgIHUgPSB4OCArIHg0IHwgMDtcclxuICAgIHgxMiBePSB1PDwxMyB8IHU+Pj4oMzItMTMpO1xyXG4gICAgdSA9IHgxMiArIHg4IHwgMDtcclxuICAgIHgwIF49IHU8PDE4IHwgdT4+PigzMi0xOCk7XHJcblxyXG4gICAgdSA9IHg1ICsgeDEgfCAwO1xyXG4gICAgeDkgXj0gdTw8NyB8IHU+Pj4oMzItNyk7XHJcbiAgICB1ID0geDkgKyB4NSB8IDA7XHJcbiAgICB4MTMgXj0gdTw8OSB8IHU+Pj4oMzItOSk7XHJcbiAgICB1ID0geDEzICsgeDkgfCAwO1xyXG4gICAgeDEgXj0gdTw8MTMgfCB1Pj4+KDMyLTEzKTtcclxuICAgIHUgPSB4MSArIHgxMyB8IDA7XHJcbiAgICB4NSBePSB1PDwxOCB8IHU+Pj4oMzItMTgpO1xyXG5cclxuICAgIHUgPSB4MTAgKyB4NiB8IDA7XHJcbiAgICB4MTQgXj0gdTw8NyB8IHU+Pj4oMzItNyk7XHJcbiAgICB1ID0geDE0ICsgeDEwIHwgMDtcclxuICAgIHgyIF49IHU8PDkgfCB1Pj4+KDMyLTkpO1xyXG4gICAgdSA9IHgyICsgeDE0IHwgMDtcclxuICAgIHg2IF49IHU8PDEzIHwgdT4+PigzMi0xMyk7XHJcbiAgICB1ID0geDYgKyB4MiB8IDA7XHJcbiAgICB4MTAgXj0gdTw8MTggfCB1Pj4+KDMyLTE4KTtcclxuXHJcbiAgICB1ID0geDE1ICsgeDExIHwgMDtcclxuICAgIHgzIF49IHU8PDcgfCB1Pj4+KDMyLTcpO1xyXG4gICAgdSA9IHgzICsgeDE1IHwgMDtcclxuICAgIHg3IF49IHU8PDkgfCB1Pj4+KDMyLTkpO1xyXG4gICAgdSA9IHg3ICsgeDMgfCAwO1xyXG4gICAgeDExIF49IHU8PDEzIHwgdT4+PigzMi0xMyk7XHJcbiAgICB1ID0geDExICsgeDcgfCAwO1xyXG4gICAgeDE1IF49IHU8PDE4IHwgdT4+PigzMi0xOCk7XHJcblxyXG4gICAgdSA9IHgwICsgeDMgfCAwO1xyXG4gICAgeDEgXj0gdTw8NyB8IHU+Pj4oMzItNyk7XHJcbiAgICB1ID0geDEgKyB4MCB8IDA7XHJcbiAgICB4MiBePSB1PDw5IHwgdT4+PigzMi05KTtcclxuICAgIHUgPSB4MiArIHgxIHwgMDtcclxuICAgIHgzIF49IHU8PDEzIHwgdT4+PigzMi0xMyk7XHJcbiAgICB1ID0geDMgKyB4MiB8IDA7XHJcbiAgICB4MCBePSB1PDwxOCB8IHU+Pj4oMzItMTgpO1xyXG5cclxuICAgIHUgPSB4NSArIHg0IHwgMDtcclxuICAgIHg2IF49IHU8PDcgfCB1Pj4+KDMyLTcpO1xyXG4gICAgdSA9IHg2ICsgeDUgfCAwO1xyXG4gICAgeDcgXj0gdTw8OSB8IHU+Pj4oMzItOSk7XHJcbiAgICB1ID0geDcgKyB4NiB8IDA7XHJcbiAgICB4NCBePSB1PDwxMyB8IHU+Pj4oMzItMTMpO1xyXG4gICAgdSA9IHg0ICsgeDcgfCAwO1xyXG4gICAgeDUgXj0gdTw8MTggfCB1Pj4+KDMyLTE4KTtcclxuXHJcbiAgICB1ID0geDEwICsgeDkgfCAwO1xyXG4gICAgeDExIF49IHU8PDcgfCB1Pj4+KDMyLTcpO1xyXG4gICAgdSA9IHgxMSArIHgxMCB8IDA7XHJcbiAgICB4OCBePSB1PDw5IHwgdT4+PigzMi05KTtcclxuICAgIHUgPSB4OCArIHgxMSB8IDA7XHJcbiAgICB4OSBePSB1PDwxMyB8IHU+Pj4oMzItMTMpO1xyXG4gICAgdSA9IHg5ICsgeDggfCAwO1xyXG4gICAgeDEwIF49IHU8PDE4IHwgdT4+PigzMi0xOCk7XHJcblxyXG4gICAgdSA9IHgxNSArIHgxNCB8IDA7XHJcbiAgICB4MTIgXj0gdTw8NyB8IHU+Pj4oMzItNyk7XHJcbiAgICB1ID0geDEyICsgeDE1IHwgMDtcclxuICAgIHgxMyBePSB1PDw5IHwgdT4+PigzMi05KTtcclxuICAgIHUgPSB4MTMgKyB4MTIgfCAwO1xyXG4gICAgeDE0IF49IHU8PDEzIHwgdT4+PigzMi0xMyk7XHJcbiAgICB1ID0geDE0ICsgeDEzIHwgMDtcclxuICAgIHgxNSBePSB1PDwxOCB8IHU+Pj4oMzItMTgpO1xyXG4gIH1cclxuXHJcbiAgb1sgMF0gPSB4MCA+Pj4gIDAgJiAweGZmO1xyXG4gIG9bIDFdID0geDAgPj4+ICA4ICYgMHhmZjtcclxuICBvWyAyXSA9IHgwID4+PiAxNiAmIDB4ZmY7XHJcbiAgb1sgM10gPSB4MCA+Pj4gMjQgJiAweGZmO1xyXG5cclxuICBvWyA0XSA9IHg1ID4+PiAgMCAmIDB4ZmY7XHJcbiAgb1sgNV0gPSB4NSA+Pj4gIDggJiAweGZmO1xyXG4gIG9bIDZdID0geDUgPj4+IDE2ICYgMHhmZjtcclxuICBvWyA3XSA9IHg1ID4+PiAyNCAmIDB4ZmY7XHJcblxyXG4gIG9bIDhdID0geDEwID4+PiAgMCAmIDB4ZmY7XHJcbiAgb1sgOV0gPSB4MTAgPj4+ICA4ICYgMHhmZjtcclxuICBvWzEwXSA9IHgxMCA+Pj4gMTYgJiAweGZmO1xyXG4gIG9bMTFdID0geDEwID4+PiAyNCAmIDB4ZmY7XHJcblxyXG4gIG9bMTJdID0geDE1ID4+PiAgMCAmIDB4ZmY7XHJcbiAgb1sxM10gPSB4MTUgPj4+ICA4ICYgMHhmZjtcclxuICBvWzE0XSA9IHgxNSA+Pj4gMTYgJiAweGZmO1xyXG4gIG9bMTVdID0geDE1ID4+PiAyNCAmIDB4ZmY7XHJcblxyXG4gIG9bMTZdID0geDYgPj4+ICAwICYgMHhmZjtcclxuICBvWzE3XSA9IHg2ID4+PiAgOCAmIDB4ZmY7XHJcbiAgb1sxOF0gPSB4NiA+Pj4gMTYgJiAweGZmO1xyXG4gIG9bMTldID0geDYgPj4+IDI0ICYgMHhmZjtcclxuXHJcbiAgb1syMF0gPSB4NyA+Pj4gIDAgJiAweGZmO1xyXG4gIG9bMjFdID0geDcgPj4+ICA4ICYgMHhmZjtcclxuICBvWzIyXSA9IHg3ID4+PiAxNiAmIDB4ZmY7XHJcbiAgb1syM10gPSB4NyA+Pj4gMjQgJiAweGZmO1xyXG5cclxuICBvWzI0XSA9IHg4ID4+PiAgMCAmIDB4ZmY7XHJcbiAgb1syNV0gPSB4OCA+Pj4gIDggJiAweGZmO1xyXG4gIG9bMjZdID0geDggPj4+IDE2ICYgMHhmZjtcclxuICBvWzI3XSA9IHg4ID4+PiAyNCAmIDB4ZmY7XHJcblxyXG4gIG9bMjhdID0geDkgPj4+ICAwICYgMHhmZjtcclxuICBvWzI5XSA9IHg5ID4+PiAgOCAmIDB4ZmY7XHJcbiAgb1szMF0gPSB4OSA+Pj4gMTYgJiAweGZmO1xyXG4gIG9bMzFdID0geDkgPj4+IDI0ICYgMHhmZjtcclxufVxyXG5cclxuZnVuY3Rpb24gY3J5cHRvX2NvcmVfc2Fsc2EyMChvdXQsaW5wLGssYykge1xyXG4gIGNvcmVfc2Fsc2EyMChvdXQsaW5wLGssYyk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyeXB0b19jb3JlX2hzYWxzYTIwKG91dCxpbnAsayxjKSB7XHJcbiAgY29yZV9oc2Fsc2EyMChvdXQsaW5wLGssYyk7XHJcbn1cclxuXHJcbnZhciBzaWdtYSA9IG5ldyBVaW50OEFycmF5KFsxMDEsIDEyMCwgMTEyLCA5NywgMTEwLCAxMDAsIDMyLCA1MSwgNTAsIDQ1LCA5OCwgMTIxLCAxMTYsIDEwMSwgMzIsIDEwN10pO1xyXG4gICAgICAgICAgICAvLyBcImV4cGFuZCAzMi1ieXRlIGtcIlxyXG5cclxuZnVuY3Rpb24gY3J5cHRvX3N0cmVhbV9zYWxzYTIwX3hvcihjLGNwb3MsbSxtcG9zLGIsbixrKSB7XHJcbiAgdmFyIHogPSBuZXcgVWludDhBcnJheSgxNiksIHggPSBuZXcgVWludDhBcnJheSg2NCk7XHJcbiAgdmFyIHUsIGk7XHJcbiAgZm9yIChpID0gMDsgaSA8IDE2OyBpKyspIHpbaV0gPSAwO1xyXG4gIGZvciAoaSA9IDA7IGkgPCA4OyBpKyspIHpbaV0gPSBuW2ldO1xyXG4gIHdoaWxlIChiID49IDY0KSB7XHJcbiAgICBjcnlwdG9fY29yZV9zYWxzYTIwKHgseixrLHNpZ21hKTtcclxuICAgIGZvciAoaSA9IDA7IGkgPCA2NDsgaSsrKSBjW2Nwb3MraV0gPSBtW21wb3MraV0gXiB4W2ldO1xyXG4gICAgdSA9IDE7XHJcbiAgICBmb3IgKGkgPSA4OyBpIDwgMTY7IGkrKykge1xyXG4gICAgICB1ID0gdSArICh6W2ldICYgMHhmZikgfCAwO1xyXG4gICAgICB6W2ldID0gdSAmIDB4ZmY7XHJcbiAgICAgIHUgPj4+PSA4O1xyXG4gICAgfVxyXG4gICAgYiAtPSA2NDtcclxuICAgIGNwb3MgKz0gNjQ7XHJcbiAgICBtcG9zICs9IDY0O1xyXG4gIH1cclxuICBpZiAoYiA+IDApIHtcclxuICAgIGNyeXB0b19jb3JlX3NhbHNhMjAoeCx6LGssc2lnbWEpO1xyXG4gICAgZm9yIChpID0gMDsgaSA8IGI7IGkrKykgY1tjcG9zK2ldID0gbVttcG9zK2ldIF4geFtpXTtcclxuICB9XHJcbiAgcmV0dXJuIDA7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyeXB0b19zdHJlYW1fc2Fsc2EyMChjLGNwb3MsYixuLGspIHtcclxuICB2YXIgeiA9IG5ldyBVaW50OEFycmF5KDE2KSwgeCA9IG5ldyBVaW50OEFycmF5KDY0KTtcclxuICB2YXIgdSwgaTtcclxuICBmb3IgKGkgPSAwOyBpIDwgMTY7IGkrKykgeltpXSA9IDA7XHJcbiAgZm9yIChpID0gMDsgaSA8IDg7IGkrKykgeltpXSA9IG5baV07XHJcbiAgd2hpbGUgKGIgPj0gNjQpIHtcclxuICAgIGNyeXB0b19jb3JlX3NhbHNhMjAoeCx6LGssc2lnbWEpO1xyXG4gICAgZm9yIChpID0gMDsgaSA8IDY0OyBpKyspIGNbY3BvcytpXSA9IHhbaV07XHJcbiAgICB1ID0gMTtcclxuICAgIGZvciAoaSA9IDg7IGkgPCAxNjsgaSsrKSB7XHJcbiAgICAgIHUgPSB1ICsgKHpbaV0gJiAweGZmKSB8IDA7XHJcbiAgICAgIHpbaV0gPSB1ICYgMHhmZjtcclxuICAgICAgdSA+Pj49IDg7XHJcbiAgICB9XHJcbiAgICBiIC09IDY0O1xyXG4gICAgY3BvcyArPSA2NDtcclxuICB9XHJcbiAgaWYgKGIgPiAwKSB7XHJcbiAgICBjcnlwdG9fY29yZV9zYWxzYTIwKHgseixrLHNpZ21hKTtcclxuICAgIGZvciAoaSA9IDA7IGkgPCBiOyBpKyspIGNbY3BvcytpXSA9IHhbaV07XHJcbiAgfVxyXG4gIHJldHVybiAwO1xyXG59XHJcblxyXG5mdW5jdGlvbiBjcnlwdG9fc3RyZWFtKGMsY3BvcyxkLG4saykge1xyXG4gIHZhciBzID0gbmV3IFVpbnQ4QXJyYXkoMzIpO1xyXG4gIGNyeXB0b19jb3JlX2hzYWxzYTIwKHMsbixrLHNpZ21hKTtcclxuICB2YXIgc24gPSBuZXcgVWludDhBcnJheSg4KTtcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IDg7IGkrKykgc25baV0gPSBuW2krMTZdO1xyXG4gIHJldHVybiBjcnlwdG9fc3RyZWFtX3NhbHNhMjAoYyxjcG9zLGQsc24scyk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyeXB0b19zdHJlYW1feG9yKGMsY3BvcyxtLG1wb3MsZCxuLGspIHtcclxuICB2YXIgcyA9IG5ldyBVaW50OEFycmF5KDMyKTtcclxuICBjcnlwdG9fY29yZV9oc2Fsc2EyMChzLG4sayxzaWdtYSk7XHJcbiAgdmFyIHNuID0gbmV3IFVpbnQ4QXJyYXkoOCk7XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCA4OyBpKyspIHNuW2ldID0gbltpKzE2XTtcclxuICByZXR1cm4gY3J5cHRvX3N0cmVhbV9zYWxzYTIwX3hvcihjLGNwb3MsbSxtcG9zLGQsc24scyk7XHJcbn1cclxuXHJcbi8qXHJcbiogUG9ydCBvZiBBbmRyZXcgTW9vbidzIFBvbHkxMzA1LWRvbm5hLTE2LiBQdWJsaWMgZG9tYWluLlxyXG4qIGh0dHBzOi8vZ2l0aHViLmNvbS9mbG9vZHliZXJyeS9wb2x5MTMwNS1kb25uYVxyXG4qL1xyXG5cclxudmFyIHBvbHkxMzA1ID0gZnVuY3Rpb24oa2V5KSB7XHJcbiAgdGhpcy5idWZmZXIgPSBuZXcgVWludDhBcnJheSgxNik7XHJcbiAgdGhpcy5yID0gbmV3IFVpbnQxNkFycmF5KDEwKTtcclxuICB0aGlzLmggPSBuZXcgVWludDE2QXJyYXkoMTApO1xyXG4gIHRoaXMucGFkID0gbmV3IFVpbnQxNkFycmF5KDgpO1xyXG4gIHRoaXMubGVmdG92ZXIgPSAwO1xyXG4gIHRoaXMuZmluID0gMDtcclxuXHJcbiAgdmFyIHQwLCB0MSwgdDIsIHQzLCB0NCwgdDUsIHQ2LCB0NztcclxuXHJcbiAgdDAgPSBrZXlbIDBdICYgMHhmZiB8IChrZXlbIDFdICYgMHhmZikgPDwgODsgdGhpcy5yWzBdID0gKCB0MCAgICAgICAgICAgICAgICAgICAgICkgJiAweDFmZmY7XHJcbiAgdDEgPSBrZXlbIDJdICYgMHhmZiB8IChrZXlbIDNdICYgMHhmZikgPDwgODsgdGhpcy5yWzFdID0gKCh0MCA+Pj4gMTMpIHwgKHQxIDw8ICAzKSkgJiAweDFmZmY7XHJcbiAgdDIgPSBrZXlbIDRdICYgMHhmZiB8IChrZXlbIDVdICYgMHhmZikgPDwgODsgdGhpcy5yWzJdID0gKCh0MSA+Pj4gMTApIHwgKHQyIDw8ICA2KSkgJiAweDFmMDM7XHJcbiAgdDMgPSBrZXlbIDZdICYgMHhmZiB8IChrZXlbIDddICYgMHhmZikgPDwgODsgdGhpcy5yWzNdID0gKCh0MiA+Pj4gIDcpIHwgKHQzIDw8ICA5KSkgJiAweDFmZmY7XHJcbiAgdDQgPSBrZXlbIDhdICYgMHhmZiB8IChrZXlbIDldICYgMHhmZikgPDwgODsgdGhpcy5yWzRdID0gKCh0MyA+Pj4gIDQpIHwgKHQ0IDw8IDEyKSkgJiAweDAwZmY7XHJcbiAgdGhpcy5yWzVdID0gKCh0NCA+Pj4gIDEpKSAmIDB4MWZmZTtcclxuICB0NSA9IGtleVsxMF0gJiAweGZmIHwgKGtleVsxMV0gJiAweGZmKSA8PCA4OyB0aGlzLnJbNl0gPSAoKHQ0ID4+PiAxNCkgfCAodDUgPDwgIDIpKSAmIDB4MWZmZjtcclxuICB0NiA9IGtleVsxMl0gJiAweGZmIHwgKGtleVsxM10gJiAweGZmKSA8PCA4OyB0aGlzLnJbN10gPSAoKHQ1ID4+PiAxMSkgfCAodDYgPDwgIDUpKSAmIDB4MWY4MTtcclxuICB0NyA9IGtleVsxNF0gJiAweGZmIHwgKGtleVsxNV0gJiAweGZmKSA8PCA4OyB0aGlzLnJbOF0gPSAoKHQ2ID4+PiAgOCkgfCAodDcgPDwgIDgpKSAmIDB4MWZmZjtcclxuICB0aGlzLnJbOV0gPSAoKHQ3ID4+PiAgNSkpICYgMHgwMDdmO1xyXG5cclxuICB0aGlzLnBhZFswXSA9IGtleVsxNl0gJiAweGZmIHwgKGtleVsxN10gJiAweGZmKSA8PCA4O1xyXG4gIHRoaXMucGFkWzFdID0ga2V5WzE4XSAmIDB4ZmYgfCAoa2V5WzE5XSAmIDB4ZmYpIDw8IDg7XHJcbiAgdGhpcy5wYWRbMl0gPSBrZXlbMjBdICYgMHhmZiB8IChrZXlbMjFdICYgMHhmZikgPDwgODtcclxuICB0aGlzLnBhZFszXSA9IGtleVsyMl0gJiAweGZmIHwgKGtleVsyM10gJiAweGZmKSA8PCA4O1xyXG4gIHRoaXMucGFkWzRdID0ga2V5WzI0XSAmIDB4ZmYgfCAoa2V5WzI1XSAmIDB4ZmYpIDw8IDg7XHJcbiAgdGhpcy5wYWRbNV0gPSBrZXlbMjZdICYgMHhmZiB8IChrZXlbMjddICYgMHhmZikgPDwgODtcclxuICB0aGlzLnBhZFs2XSA9IGtleVsyOF0gJiAweGZmIHwgKGtleVsyOV0gJiAweGZmKSA8PCA4O1xyXG4gIHRoaXMucGFkWzddID0ga2V5WzMwXSAmIDB4ZmYgfCAoa2V5WzMxXSAmIDB4ZmYpIDw8IDg7XHJcbn07XHJcblxyXG5wb2x5MTMwNS5wcm90b3R5cGUuYmxvY2tzID0gZnVuY3Rpb24obSwgbXBvcywgYnl0ZXMpIHtcclxuICB2YXIgaGliaXQgPSB0aGlzLmZpbiA/IDAgOiAoMSA8PCAxMSk7XHJcbiAgdmFyIHQwLCB0MSwgdDIsIHQzLCB0NCwgdDUsIHQ2LCB0NywgYztcclxuICB2YXIgZDAsIGQxLCBkMiwgZDMsIGQ0LCBkNSwgZDYsIGQ3LCBkOCwgZDk7XHJcblxyXG4gIHZhciBoMCA9IHRoaXMuaFswXSxcclxuICAgICAgaDEgPSB0aGlzLmhbMV0sXHJcbiAgICAgIGgyID0gdGhpcy5oWzJdLFxyXG4gICAgICBoMyA9IHRoaXMuaFszXSxcclxuICAgICAgaDQgPSB0aGlzLmhbNF0sXHJcbiAgICAgIGg1ID0gdGhpcy5oWzVdLFxyXG4gICAgICBoNiA9IHRoaXMuaFs2XSxcclxuICAgICAgaDcgPSB0aGlzLmhbN10sXHJcbiAgICAgIGg4ID0gdGhpcy5oWzhdLFxyXG4gICAgICBoOSA9IHRoaXMuaFs5XTtcclxuXHJcbiAgdmFyIHIwID0gdGhpcy5yWzBdLFxyXG4gICAgICByMSA9IHRoaXMuclsxXSxcclxuICAgICAgcjIgPSB0aGlzLnJbMl0sXHJcbiAgICAgIHIzID0gdGhpcy5yWzNdLFxyXG4gICAgICByNCA9IHRoaXMucls0XSxcclxuICAgICAgcjUgPSB0aGlzLnJbNV0sXHJcbiAgICAgIHI2ID0gdGhpcy5yWzZdLFxyXG4gICAgICByNyA9IHRoaXMucls3XSxcclxuICAgICAgcjggPSB0aGlzLnJbOF0sXHJcbiAgICAgIHI5ID0gdGhpcy5yWzldO1xyXG5cclxuICB3aGlsZSAoYnl0ZXMgPj0gMTYpIHtcclxuICAgIHQwID0gbVttcG9zKyAwXSAmIDB4ZmYgfCAobVttcG9zKyAxXSAmIDB4ZmYpIDw8IDg7IGgwICs9ICggdDAgICAgICAgICAgICAgICAgICAgICApICYgMHgxZmZmO1xyXG4gICAgdDEgPSBtW21wb3MrIDJdICYgMHhmZiB8IChtW21wb3MrIDNdICYgMHhmZikgPDwgODsgaDEgKz0gKCh0MCA+Pj4gMTMpIHwgKHQxIDw8ICAzKSkgJiAweDFmZmY7XHJcbiAgICB0MiA9IG1bbXBvcysgNF0gJiAweGZmIHwgKG1bbXBvcysgNV0gJiAweGZmKSA8PCA4OyBoMiArPSAoKHQxID4+PiAxMCkgfCAodDIgPDwgIDYpKSAmIDB4MWZmZjtcclxuICAgIHQzID0gbVttcG9zKyA2XSAmIDB4ZmYgfCAobVttcG9zKyA3XSAmIDB4ZmYpIDw8IDg7IGgzICs9ICgodDIgPj4+ICA3KSB8ICh0MyA8PCAgOSkpICYgMHgxZmZmO1xyXG4gICAgdDQgPSBtW21wb3MrIDhdICYgMHhmZiB8IChtW21wb3MrIDldICYgMHhmZikgPDwgODsgaDQgKz0gKCh0MyA+Pj4gIDQpIHwgKHQ0IDw8IDEyKSkgJiAweDFmZmY7XHJcbiAgICBoNSArPSAoKHQ0ID4+PiAgMSkpICYgMHgxZmZmO1xyXG4gICAgdDUgPSBtW21wb3MrMTBdICYgMHhmZiB8IChtW21wb3MrMTFdICYgMHhmZikgPDwgODsgaDYgKz0gKCh0NCA+Pj4gMTQpIHwgKHQ1IDw8ICAyKSkgJiAweDFmZmY7XHJcbiAgICB0NiA9IG1bbXBvcysxMl0gJiAweGZmIHwgKG1bbXBvcysxM10gJiAweGZmKSA8PCA4OyBoNyArPSAoKHQ1ID4+PiAxMSkgfCAodDYgPDwgIDUpKSAmIDB4MWZmZjtcclxuICAgIHQ3ID0gbVttcG9zKzE0XSAmIDB4ZmYgfCAobVttcG9zKzE1XSAmIDB4ZmYpIDw8IDg7IGg4ICs9ICgodDYgPj4+ICA4KSB8ICh0NyA8PCAgOCkpICYgMHgxZmZmO1xyXG4gICAgaDkgKz0gKCh0NyA+Pj4gNSkpIHwgaGliaXQ7XHJcblxyXG4gICAgYyA9IDA7XHJcblxyXG4gICAgZDAgPSBjO1xyXG4gICAgZDAgKz0gaDAgKiByMDtcclxuICAgIGQwICs9IGgxICogKDUgKiByOSk7XHJcbiAgICBkMCArPSBoMiAqICg1ICogcjgpO1xyXG4gICAgZDAgKz0gaDMgKiAoNSAqIHI3KTtcclxuICAgIGQwICs9IGg0ICogKDUgKiByNik7XHJcbiAgICBjID0gKGQwID4+PiAxMyk7IGQwICY9IDB4MWZmZjtcclxuICAgIGQwICs9IGg1ICogKDUgKiByNSk7XHJcbiAgICBkMCArPSBoNiAqICg1ICogcjQpO1xyXG4gICAgZDAgKz0gaDcgKiAoNSAqIHIzKTtcclxuICAgIGQwICs9IGg4ICogKDUgKiByMik7XHJcbiAgICBkMCArPSBoOSAqICg1ICogcjEpO1xyXG4gICAgYyArPSAoZDAgPj4+IDEzKTsgZDAgJj0gMHgxZmZmO1xyXG5cclxuICAgIGQxID0gYztcclxuICAgIGQxICs9IGgwICogcjE7XHJcbiAgICBkMSArPSBoMSAqIHIwO1xyXG4gICAgZDEgKz0gaDIgKiAoNSAqIHI5KTtcclxuICAgIGQxICs9IGgzICogKDUgKiByOCk7XHJcbiAgICBkMSArPSBoNCAqICg1ICogcjcpO1xyXG4gICAgYyA9IChkMSA+Pj4gMTMpOyBkMSAmPSAweDFmZmY7XHJcbiAgICBkMSArPSBoNSAqICg1ICogcjYpO1xyXG4gICAgZDEgKz0gaDYgKiAoNSAqIHI1KTtcclxuICAgIGQxICs9IGg3ICogKDUgKiByNCk7XHJcbiAgICBkMSArPSBoOCAqICg1ICogcjMpO1xyXG4gICAgZDEgKz0gaDkgKiAoNSAqIHIyKTtcclxuICAgIGMgKz0gKGQxID4+PiAxMyk7IGQxICY9IDB4MWZmZjtcclxuXHJcbiAgICBkMiA9IGM7XHJcbiAgICBkMiArPSBoMCAqIHIyO1xyXG4gICAgZDIgKz0gaDEgKiByMTtcclxuICAgIGQyICs9IGgyICogcjA7XHJcbiAgICBkMiArPSBoMyAqICg1ICogcjkpO1xyXG4gICAgZDIgKz0gaDQgKiAoNSAqIHI4KTtcclxuICAgIGMgPSAoZDIgPj4+IDEzKTsgZDIgJj0gMHgxZmZmO1xyXG4gICAgZDIgKz0gaDUgKiAoNSAqIHI3KTtcclxuICAgIGQyICs9IGg2ICogKDUgKiByNik7XHJcbiAgICBkMiArPSBoNyAqICg1ICogcjUpO1xyXG4gICAgZDIgKz0gaDggKiAoNSAqIHI0KTtcclxuICAgIGQyICs9IGg5ICogKDUgKiByMyk7XHJcbiAgICBjICs9IChkMiA+Pj4gMTMpOyBkMiAmPSAweDFmZmY7XHJcblxyXG4gICAgZDMgPSBjO1xyXG4gICAgZDMgKz0gaDAgKiByMztcclxuICAgIGQzICs9IGgxICogcjI7XHJcbiAgICBkMyArPSBoMiAqIHIxO1xyXG4gICAgZDMgKz0gaDMgKiByMDtcclxuICAgIGQzICs9IGg0ICogKDUgKiByOSk7XHJcbiAgICBjID0gKGQzID4+PiAxMyk7IGQzICY9IDB4MWZmZjtcclxuICAgIGQzICs9IGg1ICogKDUgKiByOCk7XHJcbiAgICBkMyArPSBoNiAqICg1ICogcjcpO1xyXG4gICAgZDMgKz0gaDcgKiAoNSAqIHI2KTtcclxuICAgIGQzICs9IGg4ICogKDUgKiByNSk7XHJcbiAgICBkMyArPSBoOSAqICg1ICogcjQpO1xyXG4gICAgYyArPSAoZDMgPj4+IDEzKTsgZDMgJj0gMHgxZmZmO1xyXG5cclxuICAgIGQ0ID0gYztcclxuICAgIGQ0ICs9IGgwICogcjQ7XHJcbiAgICBkNCArPSBoMSAqIHIzO1xyXG4gICAgZDQgKz0gaDIgKiByMjtcclxuICAgIGQ0ICs9IGgzICogcjE7XHJcbiAgICBkNCArPSBoNCAqIHIwO1xyXG4gICAgYyA9IChkNCA+Pj4gMTMpOyBkNCAmPSAweDFmZmY7XHJcbiAgICBkNCArPSBoNSAqICg1ICogcjkpO1xyXG4gICAgZDQgKz0gaDYgKiAoNSAqIHI4KTtcclxuICAgIGQ0ICs9IGg3ICogKDUgKiByNyk7XHJcbiAgICBkNCArPSBoOCAqICg1ICogcjYpO1xyXG4gICAgZDQgKz0gaDkgKiAoNSAqIHI1KTtcclxuICAgIGMgKz0gKGQ0ID4+PiAxMyk7IGQ0ICY9IDB4MWZmZjtcclxuXHJcbiAgICBkNSA9IGM7XHJcbiAgICBkNSArPSBoMCAqIHI1O1xyXG4gICAgZDUgKz0gaDEgKiByNDtcclxuICAgIGQ1ICs9IGgyICogcjM7XHJcbiAgICBkNSArPSBoMyAqIHIyO1xyXG4gICAgZDUgKz0gaDQgKiByMTtcclxuICAgIGMgPSAoZDUgPj4+IDEzKTsgZDUgJj0gMHgxZmZmO1xyXG4gICAgZDUgKz0gaDUgKiByMDtcclxuICAgIGQ1ICs9IGg2ICogKDUgKiByOSk7XHJcbiAgICBkNSArPSBoNyAqICg1ICogcjgpO1xyXG4gICAgZDUgKz0gaDggKiAoNSAqIHI3KTtcclxuICAgIGQ1ICs9IGg5ICogKDUgKiByNik7XHJcbiAgICBjICs9IChkNSA+Pj4gMTMpOyBkNSAmPSAweDFmZmY7XHJcblxyXG4gICAgZDYgPSBjO1xyXG4gICAgZDYgKz0gaDAgKiByNjtcclxuICAgIGQ2ICs9IGgxICogcjU7XHJcbiAgICBkNiArPSBoMiAqIHI0O1xyXG4gICAgZDYgKz0gaDMgKiByMztcclxuICAgIGQ2ICs9IGg0ICogcjI7XHJcbiAgICBjID0gKGQ2ID4+PiAxMyk7IGQ2ICY9IDB4MWZmZjtcclxuICAgIGQ2ICs9IGg1ICogcjE7XHJcbiAgICBkNiArPSBoNiAqIHIwO1xyXG4gICAgZDYgKz0gaDcgKiAoNSAqIHI5KTtcclxuICAgIGQ2ICs9IGg4ICogKDUgKiByOCk7XHJcbiAgICBkNiArPSBoOSAqICg1ICogcjcpO1xyXG4gICAgYyArPSAoZDYgPj4+IDEzKTsgZDYgJj0gMHgxZmZmO1xyXG5cclxuICAgIGQ3ID0gYztcclxuICAgIGQ3ICs9IGgwICogcjc7XHJcbiAgICBkNyArPSBoMSAqIHI2O1xyXG4gICAgZDcgKz0gaDIgKiByNTtcclxuICAgIGQ3ICs9IGgzICogcjQ7XHJcbiAgICBkNyArPSBoNCAqIHIzO1xyXG4gICAgYyA9IChkNyA+Pj4gMTMpOyBkNyAmPSAweDFmZmY7XHJcbiAgICBkNyArPSBoNSAqIHIyO1xyXG4gICAgZDcgKz0gaDYgKiByMTtcclxuICAgIGQ3ICs9IGg3ICogcjA7XHJcbiAgICBkNyArPSBoOCAqICg1ICogcjkpO1xyXG4gICAgZDcgKz0gaDkgKiAoNSAqIHI4KTtcclxuICAgIGMgKz0gKGQ3ID4+PiAxMyk7IGQ3ICY9IDB4MWZmZjtcclxuXHJcbiAgICBkOCA9IGM7XHJcbiAgICBkOCArPSBoMCAqIHI4O1xyXG4gICAgZDggKz0gaDEgKiByNztcclxuICAgIGQ4ICs9IGgyICogcjY7XHJcbiAgICBkOCArPSBoMyAqIHI1O1xyXG4gICAgZDggKz0gaDQgKiByNDtcclxuICAgIGMgPSAoZDggPj4+IDEzKTsgZDggJj0gMHgxZmZmO1xyXG4gICAgZDggKz0gaDUgKiByMztcclxuICAgIGQ4ICs9IGg2ICogcjI7XHJcbiAgICBkOCArPSBoNyAqIHIxO1xyXG4gICAgZDggKz0gaDggKiByMDtcclxuICAgIGQ4ICs9IGg5ICogKDUgKiByOSk7XHJcbiAgICBjICs9IChkOCA+Pj4gMTMpOyBkOCAmPSAweDFmZmY7XHJcblxyXG4gICAgZDkgPSBjO1xyXG4gICAgZDkgKz0gaDAgKiByOTtcclxuICAgIGQ5ICs9IGgxICogcjg7XHJcbiAgICBkOSArPSBoMiAqIHI3O1xyXG4gICAgZDkgKz0gaDMgKiByNjtcclxuICAgIGQ5ICs9IGg0ICogcjU7XHJcbiAgICBjID0gKGQ5ID4+PiAxMyk7IGQ5ICY9IDB4MWZmZjtcclxuICAgIGQ5ICs9IGg1ICogcjQ7XHJcbiAgICBkOSArPSBoNiAqIHIzO1xyXG4gICAgZDkgKz0gaDcgKiByMjtcclxuICAgIGQ5ICs9IGg4ICogcjE7XHJcbiAgICBkOSArPSBoOSAqIHIwO1xyXG4gICAgYyArPSAoZDkgPj4+IDEzKTsgZDkgJj0gMHgxZmZmO1xyXG5cclxuICAgIGMgPSAoKChjIDw8IDIpICsgYykpIHwgMDtcclxuICAgIGMgPSAoYyArIGQwKSB8IDA7XHJcbiAgICBkMCA9IGMgJiAweDFmZmY7XHJcbiAgICBjID0gKGMgPj4+IDEzKTtcclxuICAgIGQxICs9IGM7XHJcblxyXG4gICAgaDAgPSBkMDtcclxuICAgIGgxID0gZDE7XHJcbiAgICBoMiA9IGQyO1xyXG4gICAgaDMgPSBkMztcclxuICAgIGg0ID0gZDQ7XHJcbiAgICBoNSA9IGQ1O1xyXG4gICAgaDYgPSBkNjtcclxuICAgIGg3ID0gZDc7XHJcbiAgICBoOCA9IGQ4O1xyXG4gICAgaDkgPSBkOTtcclxuXHJcbiAgICBtcG9zICs9IDE2O1xyXG4gICAgYnl0ZXMgLT0gMTY7XHJcbiAgfVxyXG4gIHRoaXMuaFswXSA9IGgwO1xyXG4gIHRoaXMuaFsxXSA9IGgxO1xyXG4gIHRoaXMuaFsyXSA9IGgyO1xyXG4gIHRoaXMuaFszXSA9IGgzO1xyXG4gIHRoaXMuaFs0XSA9IGg0O1xyXG4gIHRoaXMuaFs1XSA9IGg1O1xyXG4gIHRoaXMuaFs2XSA9IGg2O1xyXG4gIHRoaXMuaFs3XSA9IGg3O1xyXG4gIHRoaXMuaFs4XSA9IGg4O1xyXG4gIHRoaXMuaFs5XSA9IGg5O1xyXG59O1xyXG5cclxucG9seTEzMDUucHJvdG90eXBlLmZpbmlzaCA9IGZ1bmN0aW9uKG1hYywgbWFjcG9zKSB7XHJcbiAgdmFyIGcgPSBuZXcgVWludDE2QXJyYXkoMTApO1xyXG4gIHZhciBjLCBtYXNrLCBmLCBpO1xyXG5cclxuICBpZiAodGhpcy5sZWZ0b3Zlcikge1xyXG4gICAgaSA9IHRoaXMubGVmdG92ZXI7XHJcbiAgICB0aGlzLmJ1ZmZlcltpKytdID0gMTtcclxuICAgIGZvciAoOyBpIDwgMTY7IGkrKykgdGhpcy5idWZmZXJbaV0gPSAwO1xyXG4gICAgdGhpcy5maW4gPSAxO1xyXG4gICAgdGhpcy5ibG9ja3ModGhpcy5idWZmZXIsIDAsIDE2KTtcclxuICB9XHJcblxyXG4gIGMgPSB0aGlzLmhbMV0gPj4+IDEzO1xyXG4gIHRoaXMuaFsxXSAmPSAweDFmZmY7XHJcbiAgZm9yIChpID0gMjsgaSA8IDEwOyBpKyspIHtcclxuICAgIHRoaXMuaFtpXSArPSBjO1xyXG4gICAgYyA9IHRoaXMuaFtpXSA+Pj4gMTM7XHJcbiAgICB0aGlzLmhbaV0gJj0gMHgxZmZmO1xyXG4gIH1cclxuICB0aGlzLmhbMF0gKz0gKGMgKiA1KTtcclxuICBjID0gdGhpcy5oWzBdID4+PiAxMztcclxuICB0aGlzLmhbMF0gJj0gMHgxZmZmO1xyXG4gIHRoaXMuaFsxXSArPSBjO1xyXG4gIGMgPSB0aGlzLmhbMV0gPj4+IDEzO1xyXG4gIHRoaXMuaFsxXSAmPSAweDFmZmY7XHJcbiAgdGhpcy5oWzJdICs9IGM7XHJcblxyXG4gIGdbMF0gPSB0aGlzLmhbMF0gKyA1O1xyXG4gIGMgPSBnWzBdID4+PiAxMztcclxuICBnWzBdICY9IDB4MWZmZjtcclxuICBmb3IgKGkgPSAxOyBpIDwgMTA7IGkrKykge1xyXG4gICAgZ1tpXSA9IHRoaXMuaFtpXSArIGM7XHJcbiAgICBjID0gZ1tpXSA+Pj4gMTM7XHJcbiAgICBnW2ldICY9IDB4MWZmZjtcclxuICB9XHJcbiAgZ1s5XSAtPSAoMSA8PCAxMyk7XHJcblxyXG4gIG1hc2sgPSAoYyBeIDEpIC0gMTtcclxuICBmb3IgKGkgPSAwOyBpIDwgMTA7IGkrKykgZ1tpXSAmPSBtYXNrO1xyXG4gIG1hc2sgPSB+bWFzaztcclxuICBmb3IgKGkgPSAwOyBpIDwgMTA7IGkrKykgdGhpcy5oW2ldID0gKHRoaXMuaFtpXSAmIG1hc2spIHwgZ1tpXTtcclxuXHJcbiAgdGhpcy5oWzBdID0gKCh0aGlzLmhbMF0gICAgICAgKSB8ICh0aGlzLmhbMV0gPDwgMTMpICAgICAgICAgICAgICAgICAgICApICYgMHhmZmZmO1xyXG4gIHRoaXMuaFsxXSA9ICgodGhpcy5oWzFdID4+PiAgMykgfCAodGhpcy5oWzJdIDw8IDEwKSAgICAgICAgICAgICAgICAgICAgKSAmIDB4ZmZmZjtcclxuICB0aGlzLmhbMl0gPSAoKHRoaXMuaFsyXSA+Pj4gIDYpIHwgKHRoaXMuaFszXSA8PCAgNykgICAgICAgICAgICAgICAgICAgICkgJiAweGZmZmY7XHJcbiAgdGhpcy5oWzNdID0gKCh0aGlzLmhbM10gPj4+ICA5KSB8ICh0aGlzLmhbNF0gPDwgIDQpICAgICAgICAgICAgICAgICAgICApICYgMHhmZmZmO1xyXG4gIHRoaXMuaFs0XSA9ICgodGhpcy5oWzRdID4+PiAxMikgfCAodGhpcy5oWzVdIDw8ICAxKSB8ICh0aGlzLmhbNl0gPDwgMTQpKSAmIDB4ZmZmZjtcclxuICB0aGlzLmhbNV0gPSAoKHRoaXMuaFs2XSA+Pj4gIDIpIHwgKHRoaXMuaFs3XSA8PCAxMSkgICAgICAgICAgICAgICAgICAgICkgJiAweGZmZmY7XHJcbiAgdGhpcy5oWzZdID0gKCh0aGlzLmhbN10gPj4+ICA1KSB8ICh0aGlzLmhbOF0gPDwgIDgpICAgICAgICAgICAgICAgICAgICApICYgMHhmZmZmO1xyXG4gIHRoaXMuaFs3XSA9ICgodGhpcy5oWzhdID4+PiAgOCkgfCAodGhpcy5oWzldIDw8ICA1KSAgICAgICAgICAgICAgICAgICAgKSAmIDB4ZmZmZjtcclxuXHJcbiAgZiA9IHRoaXMuaFswXSArIHRoaXMucGFkWzBdO1xyXG4gIHRoaXMuaFswXSA9IGYgJiAweGZmZmY7XHJcbiAgZm9yIChpID0gMTsgaSA8IDg7IGkrKykge1xyXG4gICAgZiA9ICgoKHRoaXMuaFtpXSArIHRoaXMucGFkW2ldKSB8IDApICsgKGYgPj4+IDE2KSkgfCAwO1xyXG4gICAgdGhpcy5oW2ldID0gZiAmIDB4ZmZmZjtcclxuICB9XHJcblxyXG4gIG1hY1ttYWNwb3MrIDBdID0gKHRoaXMuaFswXSA+Pj4gMCkgJiAweGZmO1xyXG4gIG1hY1ttYWNwb3MrIDFdID0gKHRoaXMuaFswXSA+Pj4gOCkgJiAweGZmO1xyXG4gIG1hY1ttYWNwb3MrIDJdID0gKHRoaXMuaFsxXSA+Pj4gMCkgJiAweGZmO1xyXG4gIG1hY1ttYWNwb3MrIDNdID0gKHRoaXMuaFsxXSA+Pj4gOCkgJiAweGZmO1xyXG4gIG1hY1ttYWNwb3MrIDRdID0gKHRoaXMuaFsyXSA+Pj4gMCkgJiAweGZmO1xyXG4gIG1hY1ttYWNwb3MrIDVdID0gKHRoaXMuaFsyXSA+Pj4gOCkgJiAweGZmO1xyXG4gIG1hY1ttYWNwb3MrIDZdID0gKHRoaXMuaFszXSA+Pj4gMCkgJiAweGZmO1xyXG4gIG1hY1ttYWNwb3MrIDddID0gKHRoaXMuaFszXSA+Pj4gOCkgJiAweGZmO1xyXG4gIG1hY1ttYWNwb3MrIDhdID0gKHRoaXMuaFs0XSA+Pj4gMCkgJiAweGZmO1xyXG4gIG1hY1ttYWNwb3MrIDldID0gKHRoaXMuaFs0XSA+Pj4gOCkgJiAweGZmO1xyXG4gIG1hY1ttYWNwb3MrMTBdID0gKHRoaXMuaFs1XSA+Pj4gMCkgJiAweGZmO1xyXG4gIG1hY1ttYWNwb3MrMTFdID0gKHRoaXMuaFs1XSA+Pj4gOCkgJiAweGZmO1xyXG4gIG1hY1ttYWNwb3MrMTJdID0gKHRoaXMuaFs2XSA+Pj4gMCkgJiAweGZmO1xyXG4gIG1hY1ttYWNwb3MrMTNdID0gKHRoaXMuaFs2XSA+Pj4gOCkgJiAweGZmO1xyXG4gIG1hY1ttYWNwb3MrMTRdID0gKHRoaXMuaFs3XSA+Pj4gMCkgJiAweGZmO1xyXG4gIG1hY1ttYWNwb3MrMTVdID0gKHRoaXMuaFs3XSA+Pj4gOCkgJiAweGZmO1xyXG59O1xyXG5cclxucG9seTEzMDUucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKG0sIG1wb3MsIGJ5dGVzKSB7XHJcbiAgdmFyIGksIHdhbnQ7XHJcblxyXG4gIGlmICh0aGlzLmxlZnRvdmVyKSB7XHJcbiAgICB3YW50ID0gKDE2IC0gdGhpcy5sZWZ0b3Zlcik7XHJcbiAgICBpZiAod2FudCA+IGJ5dGVzKVxyXG4gICAgICB3YW50ID0gYnl0ZXM7XHJcbiAgICBmb3IgKGkgPSAwOyBpIDwgd2FudDsgaSsrKVxyXG4gICAgICB0aGlzLmJ1ZmZlclt0aGlzLmxlZnRvdmVyICsgaV0gPSBtW21wb3MraV07XHJcbiAgICBieXRlcyAtPSB3YW50O1xyXG4gICAgbXBvcyArPSB3YW50O1xyXG4gICAgdGhpcy5sZWZ0b3ZlciArPSB3YW50O1xyXG4gICAgaWYgKHRoaXMubGVmdG92ZXIgPCAxNilcclxuICAgICAgcmV0dXJuO1xyXG4gICAgdGhpcy5ibG9ja3ModGhpcy5idWZmZXIsIDAsIDE2KTtcclxuICAgIHRoaXMubGVmdG92ZXIgPSAwO1xyXG4gIH1cclxuXHJcbiAgaWYgKGJ5dGVzID49IDE2KSB7XHJcbiAgICB3YW50ID0gYnl0ZXMgLSAoYnl0ZXMgJSAxNik7XHJcbiAgICB0aGlzLmJsb2NrcyhtLCBtcG9zLCB3YW50KTtcclxuICAgIG1wb3MgKz0gd2FudDtcclxuICAgIGJ5dGVzIC09IHdhbnQ7XHJcbiAgfVxyXG5cclxuICBpZiAoYnl0ZXMpIHtcclxuICAgIGZvciAoaSA9IDA7IGkgPCBieXRlczsgaSsrKVxyXG4gICAgICB0aGlzLmJ1ZmZlclt0aGlzLmxlZnRvdmVyICsgaV0gPSBtW21wb3MraV07XHJcbiAgICB0aGlzLmxlZnRvdmVyICs9IGJ5dGVzO1xyXG4gIH1cclxufTtcclxuXHJcbmZ1bmN0aW9uIGNyeXB0b19vbmV0aW1lYXV0aChvdXQsIG91dHBvcywgbSwgbXBvcywgbiwgaykge1xyXG4gIHZhciBzID0gbmV3IHBvbHkxMzA1KGspO1xyXG4gIHMudXBkYXRlKG0sIG1wb3MsIG4pO1xyXG4gIHMuZmluaXNoKG91dCwgb3V0cG9zKTtcclxuICByZXR1cm4gMDtcclxufVxyXG5cclxuZnVuY3Rpb24gY3J5cHRvX29uZXRpbWVhdXRoX3ZlcmlmeShoLCBocG9zLCBtLCBtcG9zLCBuLCBrKSB7XHJcbiAgdmFyIHggPSBuZXcgVWludDhBcnJheSgxNik7XHJcbiAgY3J5cHRvX29uZXRpbWVhdXRoKHgsMCxtLG1wb3MsbixrKTtcclxuICByZXR1cm4gY3J5cHRvX3ZlcmlmeV8xNihoLGhwb3MseCwwKTtcclxufVxyXG5cclxuZnVuY3Rpb24gY3J5cHRvX3NlY3JldGJveChjLG0sZCxuLGspIHtcclxuICB2YXIgaTtcclxuICBpZiAoZCA8IDMyKSByZXR1cm4gLTE7XHJcbiAgY3J5cHRvX3N0cmVhbV94b3IoYywwLG0sMCxkLG4sayk7XHJcbiAgY3J5cHRvX29uZXRpbWVhdXRoKGMsIDE2LCBjLCAzMiwgZCAtIDMyLCBjKTtcclxuICBmb3IgKGkgPSAwOyBpIDwgMTY7IGkrKykgY1tpXSA9IDA7XHJcbiAgcmV0dXJuIDA7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyeXB0b19zZWNyZXRib3hfb3BlbihtLGMsZCxuLGspIHtcclxuICB2YXIgaTtcclxuICB2YXIgeCA9IG5ldyBVaW50OEFycmF5KDMyKTtcclxuICBpZiAoZCA8IDMyKSByZXR1cm4gLTE7XHJcbiAgY3J5cHRvX3N0cmVhbSh4LDAsMzIsbixrKTtcclxuICBpZiAoY3J5cHRvX29uZXRpbWVhdXRoX3ZlcmlmeShjLCAxNixjLCAzMixkIC0gMzIseCkgIT09IDApIHJldHVybiAtMTtcclxuICBjcnlwdG9fc3RyZWFtX3hvcihtLDAsYywwLGQsbixrKTtcclxuICBmb3IgKGkgPSAwOyBpIDwgMzI7IGkrKykgbVtpXSA9IDA7XHJcbiAgcmV0dXJuIDA7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNldDI1NTE5KHIsIGEpIHtcclxuICB2YXIgaTtcclxuICBmb3IgKGkgPSAwOyBpIDwgMTY7IGkrKykgcltpXSA9IGFbaV18MDtcclxufVxyXG5cclxuZnVuY3Rpb24gY2FyMjU1MTkobykge1xyXG4gIHZhciBpLCB2LCBjID0gMTtcclxuICBmb3IgKGkgPSAwOyBpIDwgMTY7IGkrKykge1xyXG4gICAgdiA9IG9baV0gKyBjICsgNjU1MzU7XHJcbiAgICBjID0gTWF0aC5mbG9vcih2IC8gNjU1MzYpO1xyXG4gICAgb1tpXSA9IHYgLSBjICogNjU1MzY7XHJcbiAgfVxyXG4gIG9bMF0gKz0gYy0xICsgMzcgKiAoYy0xKTtcclxufVxyXG5cclxuZnVuY3Rpb24gc2VsMjU1MTkocCwgcSwgYikge1xyXG4gIHZhciB0LCBjID0gfihiLTEpO1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgMTY7IGkrKykge1xyXG4gICAgdCA9IGMgJiAocFtpXSBeIHFbaV0pO1xyXG4gICAgcFtpXSBePSB0O1xyXG4gICAgcVtpXSBePSB0O1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gcGFjazI1NTE5KG8sIG4pIHtcclxuICB2YXIgaSwgaiwgYjtcclxuICB2YXIgbSA9IGdmKCksIHQgPSBnZigpO1xyXG4gIGZvciAoaSA9IDA7IGkgPCAxNjsgaSsrKSB0W2ldID0gbltpXTtcclxuICBjYXIyNTUxOSh0KTtcclxuICBjYXIyNTUxOSh0KTtcclxuICBjYXIyNTUxOSh0KTtcclxuICBmb3IgKGogPSAwOyBqIDwgMjsgaisrKSB7XHJcbiAgICBtWzBdID0gdFswXSAtIDB4ZmZlZDtcclxuICAgIGZvciAoaSA9IDE7IGkgPCAxNTsgaSsrKSB7XHJcbiAgICAgIG1baV0gPSB0W2ldIC0gMHhmZmZmIC0gKChtW2ktMV0+PjE2KSAmIDEpO1xyXG4gICAgICBtW2ktMV0gJj0gMHhmZmZmO1xyXG4gICAgfVxyXG4gICAgbVsxNV0gPSB0WzE1XSAtIDB4N2ZmZiAtICgobVsxNF0+PjE2KSAmIDEpO1xyXG4gICAgYiA9IChtWzE1XT4+MTYpICYgMTtcclxuICAgIG1bMTRdICY9IDB4ZmZmZjtcclxuICAgIHNlbDI1NTE5KHQsIG0sIDEtYik7XHJcbiAgfVxyXG4gIGZvciAoaSA9IDA7IGkgPCAxNjsgaSsrKSB7XHJcbiAgICBvWzIqaV0gPSB0W2ldICYgMHhmZjtcclxuICAgIG9bMippKzFdID0gdFtpXT4+ODtcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG5lcTI1NTE5KGEsIGIpIHtcclxuICB2YXIgYyA9IG5ldyBVaW50OEFycmF5KDMyKSwgZCA9IG5ldyBVaW50OEFycmF5KDMyKTtcclxuICBwYWNrMjU1MTkoYywgYSk7XHJcbiAgcGFjazI1NTE5KGQsIGIpO1xyXG4gIHJldHVybiBjcnlwdG9fdmVyaWZ5XzMyKGMsIDAsIGQsIDApO1xyXG59XHJcblxyXG5mdW5jdGlvbiBwYXIyNTUxOShhKSB7XHJcbiAgdmFyIGQgPSBuZXcgVWludDhBcnJheSgzMik7XHJcbiAgcGFjazI1NTE5KGQsIGEpO1xyXG4gIHJldHVybiBkWzBdICYgMTtcclxufVxyXG5cclxuZnVuY3Rpb24gdW5wYWNrMjU1MTkobywgbikge1xyXG4gIHZhciBpO1xyXG4gIGZvciAoaSA9IDA7IGkgPCAxNjsgaSsrKSBvW2ldID0gblsyKmldICsgKG5bMippKzFdIDw8IDgpO1xyXG4gIG9bMTVdICY9IDB4N2ZmZjtcclxufVxyXG5cclxuZnVuY3Rpb24gQShvLCBhLCBiKSB7XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCAxNjsgaSsrKSBvW2ldID0gYVtpXSArIGJbaV07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIFoobywgYSwgYikge1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgMTY7IGkrKykgb1tpXSA9IGFbaV0gLSBiW2ldO1xyXG59XHJcblxyXG5mdW5jdGlvbiBNKG8sIGEsIGIpIHtcclxuICB2YXIgdiwgYyxcclxuICAgICB0MCA9IDAsICB0MSA9IDAsICB0MiA9IDAsICB0MyA9IDAsICB0NCA9IDAsICB0NSA9IDAsICB0NiA9IDAsICB0NyA9IDAsXHJcbiAgICAgdDggPSAwLCAgdDkgPSAwLCB0MTAgPSAwLCB0MTEgPSAwLCB0MTIgPSAwLCB0MTMgPSAwLCB0MTQgPSAwLCB0MTUgPSAwLFxyXG4gICAgdDE2ID0gMCwgdDE3ID0gMCwgdDE4ID0gMCwgdDE5ID0gMCwgdDIwID0gMCwgdDIxID0gMCwgdDIyID0gMCwgdDIzID0gMCxcclxuICAgIHQyNCA9IDAsIHQyNSA9IDAsIHQyNiA9IDAsIHQyNyA9IDAsIHQyOCA9IDAsIHQyOSA9IDAsIHQzMCA9IDAsXHJcbiAgICBiMCA9IGJbMF0sXHJcbiAgICBiMSA9IGJbMV0sXHJcbiAgICBiMiA9IGJbMl0sXHJcbiAgICBiMyA9IGJbM10sXHJcbiAgICBiNCA9IGJbNF0sXHJcbiAgICBiNSA9IGJbNV0sXHJcbiAgICBiNiA9IGJbNl0sXHJcbiAgICBiNyA9IGJbN10sXHJcbiAgICBiOCA9IGJbOF0sXHJcbiAgICBiOSA9IGJbOV0sXHJcbiAgICBiMTAgPSBiWzEwXSxcclxuICAgIGIxMSA9IGJbMTFdLFxyXG4gICAgYjEyID0gYlsxMl0sXHJcbiAgICBiMTMgPSBiWzEzXSxcclxuICAgIGIxNCA9IGJbMTRdLFxyXG4gICAgYjE1ID0gYlsxNV07XHJcblxyXG4gIHYgPSBhWzBdO1xyXG4gIHQwICs9IHYgKiBiMDtcclxuICB0MSArPSB2ICogYjE7XHJcbiAgdDIgKz0gdiAqIGIyO1xyXG4gIHQzICs9IHYgKiBiMztcclxuICB0NCArPSB2ICogYjQ7XHJcbiAgdDUgKz0gdiAqIGI1O1xyXG4gIHQ2ICs9IHYgKiBiNjtcclxuICB0NyArPSB2ICogYjc7XHJcbiAgdDggKz0gdiAqIGI4O1xyXG4gIHQ5ICs9IHYgKiBiOTtcclxuICB0MTAgKz0gdiAqIGIxMDtcclxuICB0MTEgKz0gdiAqIGIxMTtcclxuICB0MTIgKz0gdiAqIGIxMjtcclxuICB0MTMgKz0gdiAqIGIxMztcclxuICB0MTQgKz0gdiAqIGIxNDtcclxuICB0MTUgKz0gdiAqIGIxNTtcclxuICB2ID0gYVsxXTtcclxuICB0MSArPSB2ICogYjA7XHJcbiAgdDIgKz0gdiAqIGIxO1xyXG4gIHQzICs9IHYgKiBiMjtcclxuICB0NCArPSB2ICogYjM7XHJcbiAgdDUgKz0gdiAqIGI0O1xyXG4gIHQ2ICs9IHYgKiBiNTtcclxuICB0NyArPSB2ICogYjY7XHJcbiAgdDggKz0gdiAqIGI3O1xyXG4gIHQ5ICs9IHYgKiBiODtcclxuICB0MTAgKz0gdiAqIGI5O1xyXG4gIHQxMSArPSB2ICogYjEwO1xyXG4gIHQxMiArPSB2ICogYjExO1xyXG4gIHQxMyArPSB2ICogYjEyO1xyXG4gIHQxNCArPSB2ICogYjEzO1xyXG4gIHQxNSArPSB2ICogYjE0O1xyXG4gIHQxNiArPSB2ICogYjE1O1xyXG4gIHYgPSBhWzJdO1xyXG4gIHQyICs9IHYgKiBiMDtcclxuICB0MyArPSB2ICogYjE7XHJcbiAgdDQgKz0gdiAqIGIyO1xyXG4gIHQ1ICs9IHYgKiBiMztcclxuICB0NiArPSB2ICogYjQ7XHJcbiAgdDcgKz0gdiAqIGI1O1xyXG4gIHQ4ICs9IHYgKiBiNjtcclxuICB0OSArPSB2ICogYjc7XHJcbiAgdDEwICs9IHYgKiBiODtcclxuICB0MTEgKz0gdiAqIGI5O1xyXG4gIHQxMiArPSB2ICogYjEwO1xyXG4gIHQxMyArPSB2ICogYjExO1xyXG4gIHQxNCArPSB2ICogYjEyO1xyXG4gIHQxNSArPSB2ICogYjEzO1xyXG4gIHQxNiArPSB2ICogYjE0O1xyXG4gIHQxNyArPSB2ICogYjE1O1xyXG4gIHYgPSBhWzNdO1xyXG4gIHQzICs9IHYgKiBiMDtcclxuICB0NCArPSB2ICogYjE7XHJcbiAgdDUgKz0gdiAqIGIyO1xyXG4gIHQ2ICs9IHYgKiBiMztcclxuICB0NyArPSB2ICogYjQ7XHJcbiAgdDggKz0gdiAqIGI1O1xyXG4gIHQ5ICs9IHYgKiBiNjtcclxuICB0MTAgKz0gdiAqIGI3O1xyXG4gIHQxMSArPSB2ICogYjg7XHJcbiAgdDEyICs9IHYgKiBiOTtcclxuICB0MTMgKz0gdiAqIGIxMDtcclxuICB0MTQgKz0gdiAqIGIxMTtcclxuICB0MTUgKz0gdiAqIGIxMjtcclxuICB0MTYgKz0gdiAqIGIxMztcclxuICB0MTcgKz0gdiAqIGIxNDtcclxuICB0MTggKz0gdiAqIGIxNTtcclxuICB2ID0gYVs0XTtcclxuICB0NCArPSB2ICogYjA7XHJcbiAgdDUgKz0gdiAqIGIxO1xyXG4gIHQ2ICs9IHYgKiBiMjtcclxuICB0NyArPSB2ICogYjM7XHJcbiAgdDggKz0gdiAqIGI0O1xyXG4gIHQ5ICs9IHYgKiBiNTtcclxuICB0MTAgKz0gdiAqIGI2O1xyXG4gIHQxMSArPSB2ICogYjc7XHJcbiAgdDEyICs9IHYgKiBiODtcclxuICB0MTMgKz0gdiAqIGI5O1xyXG4gIHQxNCArPSB2ICogYjEwO1xyXG4gIHQxNSArPSB2ICogYjExO1xyXG4gIHQxNiArPSB2ICogYjEyO1xyXG4gIHQxNyArPSB2ICogYjEzO1xyXG4gIHQxOCArPSB2ICogYjE0O1xyXG4gIHQxOSArPSB2ICogYjE1O1xyXG4gIHYgPSBhWzVdO1xyXG4gIHQ1ICs9IHYgKiBiMDtcclxuICB0NiArPSB2ICogYjE7XHJcbiAgdDcgKz0gdiAqIGIyO1xyXG4gIHQ4ICs9IHYgKiBiMztcclxuICB0OSArPSB2ICogYjQ7XHJcbiAgdDEwICs9IHYgKiBiNTtcclxuICB0MTEgKz0gdiAqIGI2O1xyXG4gIHQxMiArPSB2ICogYjc7XHJcbiAgdDEzICs9IHYgKiBiODtcclxuICB0MTQgKz0gdiAqIGI5O1xyXG4gIHQxNSArPSB2ICogYjEwO1xyXG4gIHQxNiArPSB2ICogYjExO1xyXG4gIHQxNyArPSB2ICogYjEyO1xyXG4gIHQxOCArPSB2ICogYjEzO1xyXG4gIHQxOSArPSB2ICogYjE0O1xyXG4gIHQyMCArPSB2ICogYjE1O1xyXG4gIHYgPSBhWzZdO1xyXG4gIHQ2ICs9IHYgKiBiMDtcclxuICB0NyArPSB2ICogYjE7XHJcbiAgdDggKz0gdiAqIGIyO1xyXG4gIHQ5ICs9IHYgKiBiMztcclxuICB0MTAgKz0gdiAqIGI0O1xyXG4gIHQxMSArPSB2ICogYjU7XHJcbiAgdDEyICs9IHYgKiBiNjtcclxuICB0MTMgKz0gdiAqIGI3O1xyXG4gIHQxNCArPSB2ICogYjg7XHJcbiAgdDE1ICs9IHYgKiBiOTtcclxuICB0MTYgKz0gdiAqIGIxMDtcclxuICB0MTcgKz0gdiAqIGIxMTtcclxuICB0MTggKz0gdiAqIGIxMjtcclxuICB0MTkgKz0gdiAqIGIxMztcclxuICB0MjAgKz0gdiAqIGIxNDtcclxuICB0MjEgKz0gdiAqIGIxNTtcclxuICB2ID0gYVs3XTtcclxuICB0NyArPSB2ICogYjA7XHJcbiAgdDggKz0gdiAqIGIxO1xyXG4gIHQ5ICs9IHYgKiBiMjtcclxuICB0MTAgKz0gdiAqIGIzO1xyXG4gIHQxMSArPSB2ICogYjQ7XHJcbiAgdDEyICs9IHYgKiBiNTtcclxuICB0MTMgKz0gdiAqIGI2O1xyXG4gIHQxNCArPSB2ICogYjc7XHJcbiAgdDE1ICs9IHYgKiBiODtcclxuICB0MTYgKz0gdiAqIGI5O1xyXG4gIHQxNyArPSB2ICogYjEwO1xyXG4gIHQxOCArPSB2ICogYjExO1xyXG4gIHQxOSArPSB2ICogYjEyO1xyXG4gIHQyMCArPSB2ICogYjEzO1xyXG4gIHQyMSArPSB2ICogYjE0O1xyXG4gIHQyMiArPSB2ICogYjE1O1xyXG4gIHYgPSBhWzhdO1xyXG4gIHQ4ICs9IHYgKiBiMDtcclxuICB0OSArPSB2ICogYjE7XHJcbiAgdDEwICs9IHYgKiBiMjtcclxuICB0MTEgKz0gdiAqIGIzO1xyXG4gIHQxMiArPSB2ICogYjQ7XHJcbiAgdDEzICs9IHYgKiBiNTtcclxuICB0MTQgKz0gdiAqIGI2O1xyXG4gIHQxNSArPSB2ICogYjc7XHJcbiAgdDE2ICs9IHYgKiBiODtcclxuICB0MTcgKz0gdiAqIGI5O1xyXG4gIHQxOCArPSB2ICogYjEwO1xyXG4gIHQxOSArPSB2ICogYjExO1xyXG4gIHQyMCArPSB2ICogYjEyO1xyXG4gIHQyMSArPSB2ICogYjEzO1xyXG4gIHQyMiArPSB2ICogYjE0O1xyXG4gIHQyMyArPSB2ICogYjE1O1xyXG4gIHYgPSBhWzldO1xyXG4gIHQ5ICs9IHYgKiBiMDtcclxuICB0MTAgKz0gdiAqIGIxO1xyXG4gIHQxMSArPSB2ICogYjI7XHJcbiAgdDEyICs9IHYgKiBiMztcclxuICB0MTMgKz0gdiAqIGI0O1xyXG4gIHQxNCArPSB2ICogYjU7XHJcbiAgdDE1ICs9IHYgKiBiNjtcclxuICB0MTYgKz0gdiAqIGI3O1xyXG4gIHQxNyArPSB2ICogYjg7XHJcbiAgdDE4ICs9IHYgKiBiOTtcclxuICB0MTkgKz0gdiAqIGIxMDtcclxuICB0MjAgKz0gdiAqIGIxMTtcclxuICB0MjEgKz0gdiAqIGIxMjtcclxuICB0MjIgKz0gdiAqIGIxMztcclxuICB0MjMgKz0gdiAqIGIxNDtcclxuICB0MjQgKz0gdiAqIGIxNTtcclxuICB2ID0gYVsxMF07XHJcbiAgdDEwICs9IHYgKiBiMDtcclxuICB0MTEgKz0gdiAqIGIxO1xyXG4gIHQxMiArPSB2ICogYjI7XHJcbiAgdDEzICs9IHYgKiBiMztcclxuICB0MTQgKz0gdiAqIGI0O1xyXG4gIHQxNSArPSB2ICogYjU7XHJcbiAgdDE2ICs9IHYgKiBiNjtcclxuICB0MTcgKz0gdiAqIGI3O1xyXG4gIHQxOCArPSB2ICogYjg7XHJcbiAgdDE5ICs9IHYgKiBiOTtcclxuICB0MjAgKz0gdiAqIGIxMDtcclxuICB0MjEgKz0gdiAqIGIxMTtcclxuICB0MjIgKz0gdiAqIGIxMjtcclxuICB0MjMgKz0gdiAqIGIxMztcclxuICB0MjQgKz0gdiAqIGIxNDtcclxuICB0MjUgKz0gdiAqIGIxNTtcclxuICB2ID0gYVsxMV07XHJcbiAgdDExICs9IHYgKiBiMDtcclxuICB0MTIgKz0gdiAqIGIxO1xyXG4gIHQxMyArPSB2ICogYjI7XHJcbiAgdDE0ICs9IHYgKiBiMztcclxuICB0MTUgKz0gdiAqIGI0O1xyXG4gIHQxNiArPSB2ICogYjU7XHJcbiAgdDE3ICs9IHYgKiBiNjtcclxuICB0MTggKz0gdiAqIGI3O1xyXG4gIHQxOSArPSB2ICogYjg7XHJcbiAgdDIwICs9IHYgKiBiOTtcclxuICB0MjEgKz0gdiAqIGIxMDtcclxuICB0MjIgKz0gdiAqIGIxMTtcclxuICB0MjMgKz0gdiAqIGIxMjtcclxuICB0MjQgKz0gdiAqIGIxMztcclxuICB0MjUgKz0gdiAqIGIxNDtcclxuICB0MjYgKz0gdiAqIGIxNTtcclxuICB2ID0gYVsxMl07XHJcbiAgdDEyICs9IHYgKiBiMDtcclxuICB0MTMgKz0gdiAqIGIxO1xyXG4gIHQxNCArPSB2ICogYjI7XHJcbiAgdDE1ICs9IHYgKiBiMztcclxuICB0MTYgKz0gdiAqIGI0O1xyXG4gIHQxNyArPSB2ICogYjU7XHJcbiAgdDE4ICs9IHYgKiBiNjtcclxuICB0MTkgKz0gdiAqIGI3O1xyXG4gIHQyMCArPSB2ICogYjg7XHJcbiAgdDIxICs9IHYgKiBiOTtcclxuICB0MjIgKz0gdiAqIGIxMDtcclxuICB0MjMgKz0gdiAqIGIxMTtcclxuICB0MjQgKz0gdiAqIGIxMjtcclxuICB0MjUgKz0gdiAqIGIxMztcclxuICB0MjYgKz0gdiAqIGIxNDtcclxuICB0MjcgKz0gdiAqIGIxNTtcclxuICB2ID0gYVsxM107XHJcbiAgdDEzICs9IHYgKiBiMDtcclxuICB0MTQgKz0gdiAqIGIxO1xyXG4gIHQxNSArPSB2ICogYjI7XHJcbiAgdDE2ICs9IHYgKiBiMztcclxuICB0MTcgKz0gdiAqIGI0O1xyXG4gIHQxOCArPSB2ICogYjU7XHJcbiAgdDE5ICs9IHYgKiBiNjtcclxuICB0MjAgKz0gdiAqIGI3O1xyXG4gIHQyMSArPSB2ICogYjg7XHJcbiAgdDIyICs9IHYgKiBiOTtcclxuICB0MjMgKz0gdiAqIGIxMDtcclxuICB0MjQgKz0gdiAqIGIxMTtcclxuICB0MjUgKz0gdiAqIGIxMjtcclxuICB0MjYgKz0gdiAqIGIxMztcclxuICB0MjcgKz0gdiAqIGIxNDtcclxuICB0MjggKz0gdiAqIGIxNTtcclxuICB2ID0gYVsxNF07XHJcbiAgdDE0ICs9IHYgKiBiMDtcclxuICB0MTUgKz0gdiAqIGIxO1xyXG4gIHQxNiArPSB2ICogYjI7XHJcbiAgdDE3ICs9IHYgKiBiMztcclxuICB0MTggKz0gdiAqIGI0O1xyXG4gIHQxOSArPSB2ICogYjU7XHJcbiAgdDIwICs9IHYgKiBiNjtcclxuICB0MjEgKz0gdiAqIGI3O1xyXG4gIHQyMiArPSB2ICogYjg7XHJcbiAgdDIzICs9IHYgKiBiOTtcclxuICB0MjQgKz0gdiAqIGIxMDtcclxuICB0MjUgKz0gdiAqIGIxMTtcclxuICB0MjYgKz0gdiAqIGIxMjtcclxuICB0MjcgKz0gdiAqIGIxMztcclxuICB0MjggKz0gdiAqIGIxNDtcclxuICB0MjkgKz0gdiAqIGIxNTtcclxuICB2ID0gYVsxNV07XHJcbiAgdDE1ICs9IHYgKiBiMDtcclxuICB0MTYgKz0gdiAqIGIxO1xyXG4gIHQxNyArPSB2ICogYjI7XHJcbiAgdDE4ICs9IHYgKiBiMztcclxuICB0MTkgKz0gdiAqIGI0O1xyXG4gIHQyMCArPSB2ICogYjU7XHJcbiAgdDIxICs9IHYgKiBiNjtcclxuICB0MjIgKz0gdiAqIGI3O1xyXG4gIHQyMyArPSB2ICogYjg7XHJcbiAgdDI0ICs9IHYgKiBiOTtcclxuICB0MjUgKz0gdiAqIGIxMDtcclxuICB0MjYgKz0gdiAqIGIxMTtcclxuICB0MjcgKz0gdiAqIGIxMjtcclxuICB0MjggKz0gdiAqIGIxMztcclxuICB0MjkgKz0gdiAqIGIxNDtcclxuICB0MzAgKz0gdiAqIGIxNTtcclxuXHJcbiAgdDAgICs9IDM4ICogdDE2O1xyXG4gIHQxICArPSAzOCAqIHQxNztcclxuICB0MiAgKz0gMzggKiB0MTg7XHJcbiAgdDMgICs9IDM4ICogdDE5O1xyXG4gIHQ0ICArPSAzOCAqIHQyMDtcclxuICB0NSAgKz0gMzggKiB0MjE7XHJcbiAgdDYgICs9IDM4ICogdDIyO1xyXG4gIHQ3ICArPSAzOCAqIHQyMztcclxuICB0OCAgKz0gMzggKiB0MjQ7XHJcbiAgdDkgICs9IDM4ICogdDI1O1xyXG4gIHQxMCArPSAzOCAqIHQyNjtcclxuICB0MTEgKz0gMzggKiB0Mjc7XHJcbiAgdDEyICs9IDM4ICogdDI4O1xyXG4gIHQxMyArPSAzOCAqIHQyOTtcclxuICB0MTQgKz0gMzggKiB0MzA7XHJcbiAgLy8gdDE1IGxlZnQgYXMgaXNcclxuXHJcbiAgLy8gZmlyc3QgY2FyXHJcbiAgYyA9IDE7XHJcbiAgdiA9ICB0MCArIGMgKyA2NTUzNTsgYyA9IE1hdGguZmxvb3IodiAvIDY1NTM2KTsgIHQwID0gdiAtIGMgKiA2NTUzNjtcclxuICB2ID0gIHQxICsgYyArIDY1NTM1OyBjID0gTWF0aC5mbG9vcih2IC8gNjU1MzYpOyAgdDEgPSB2IC0gYyAqIDY1NTM2O1xyXG4gIHYgPSAgdDIgKyBjICsgNjU1MzU7IGMgPSBNYXRoLmZsb29yKHYgLyA2NTUzNik7ICB0MiA9IHYgLSBjICogNjU1MzY7XHJcbiAgdiA9ICB0MyArIGMgKyA2NTUzNTsgYyA9IE1hdGguZmxvb3IodiAvIDY1NTM2KTsgIHQzID0gdiAtIGMgKiA2NTUzNjtcclxuICB2ID0gIHQ0ICsgYyArIDY1NTM1OyBjID0gTWF0aC5mbG9vcih2IC8gNjU1MzYpOyAgdDQgPSB2IC0gYyAqIDY1NTM2O1xyXG4gIHYgPSAgdDUgKyBjICsgNjU1MzU7IGMgPSBNYXRoLmZsb29yKHYgLyA2NTUzNik7ICB0NSA9IHYgLSBjICogNjU1MzY7XHJcbiAgdiA9ICB0NiArIGMgKyA2NTUzNTsgYyA9IE1hdGguZmxvb3IodiAvIDY1NTM2KTsgIHQ2ID0gdiAtIGMgKiA2NTUzNjtcclxuICB2ID0gIHQ3ICsgYyArIDY1NTM1OyBjID0gTWF0aC5mbG9vcih2IC8gNjU1MzYpOyAgdDcgPSB2IC0gYyAqIDY1NTM2O1xyXG4gIHYgPSAgdDggKyBjICsgNjU1MzU7IGMgPSBNYXRoLmZsb29yKHYgLyA2NTUzNik7ICB0OCA9IHYgLSBjICogNjU1MzY7XHJcbiAgdiA9ICB0OSArIGMgKyA2NTUzNTsgYyA9IE1hdGguZmxvb3IodiAvIDY1NTM2KTsgIHQ5ID0gdiAtIGMgKiA2NTUzNjtcclxuICB2ID0gdDEwICsgYyArIDY1NTM1OyBjID0gTWF0aC5mbG9vcih2IC8gNjU1MzYpOyB0MTAgPSB2IC0gYyAqIDY1NTM2O1xyXG4gIHYgPSB0MTEgKyBjICsgNjU1MzU7IGMgPSBNYXRoLmZsb29yKHYgLyA2NTUzNik7IHQxMSA9IHYgLSBjICogNjU1MzY7XHJcbiAgdiA9IHQxMiArIGMgKyA2NTUzNTsgYyA9IE1hdGguZmxvb3IodiAvIDY1NTM2KTsgdDEyID0gdiAtIGMgKiA2NTUzNjtcclxuICB2ID0gdDEzICsgYyArIDY1NTM1OyBjID0gTWF0aC5mbG9vcih2IC8gNjU1MzYpOyB0MTMgPSB2IC0gYyAqIDY1NTM2O1xyXG4gIHYgPSB0MTQgKyBjICsgNjU1MzU7IGMgPSBNYXRoLmZsb29yKHYgLyA2NTUzNik7IHQxNCA9IHYgLSBjICogNjU1MzY7XHJcbiAgdiA9IHQxNSArIGMgKyA2NTUzNTsgYyA9IE1hdGguZmxvb3IodiAvIDY1NTM2KTsgdDE1ID0gdiAtIGMgKiA2NTUzNjtcclxuICB0MCArPSBjLTEgKyAzNyAqIChjLTEpO1xyXG5cclxuICAvLyBzZWNvbmQgY2FyXHJcbiAgYyA9IDE7XHJcbiAgdiA9ICB0MCArIGMgKyA2NTUzNTsgYyA9IE1hdGguZmxvb3IodiAvIDY1NTM2KTsgIHQwID0gdiAtIGMgKiA2NTUzNjtcclxuICB2ID0gIHQxICsgYyArIDY1NTM1OyBjID0gTWF0aC5mbG9vcih2IC8gNjU1MzYpOyAgdDEgPSB2IC0gYyAqIDY1NTM2O1xyXG4gIHYgPSAgdDIgKyBjICsgNjU1MzU7IGMgPSBNYXRoLmZsb29yKHYgLyA2NTUzNik7ICB0MiA9IHYgLSBjICogNjU1MzY7XHJcbiAgdiA9ICB0MyArIGMgKyA2NTUzNTsgYyA9IE1hdGguZmxvb3IodiAvIDY1NTM2KTsgIHQzID0gdiAtIGMgKiA2NTUzNjtcclxuICB2ID0gIHQ0ICsgYyArIDY1NTM1OyBjID0gTWF0aC5mbG9vcih2IC8gNjU1MzYpOyAgdDQgPSB2IC0gYyAqIDY1NTM2O1xyXG4gIHYgPSAgdDUgKyBjICsgNjU1MzU7IGMgPSBNYXRoLmZsb29yKHYgLyA2NTUzNik7ICB0NSA9IHYgLSBjICogNjU1MzY7XHJcbiAgdiA9ICB0NiArIGMgKyA2NTUzNTsgYyA9IE1hdGguZmxvb3IodiAvIDY1NTM2KTsgIHQ2ID0gdiAtIGMgKiA2NTUzNjtcclxuICB2ID0gIHQ3ICsgYyArIDY1NTM1OyBjID0gTWF0aC5mbG9vcih2IC8gNjU1MzYpOyAgdDcgPSB2IC0gYyAqIDY1NTM2O1xyXG4gIHYgPSAgdDggKyBjICsgNjU1MzU7IGMgPSBNYXRoLmZsb29yKHYgLyA2NTUzNik7ICB0OCA9IHYgLSBjICogNjU1MzY7XHJcbiAgdiA9ICB0OSArIGMgKyA2NTUzNTsgYyA9IE1hdGguZmxvb3IodiAvIDY1NTM2KTsgIHQ5ID0gdiAtIGMgKiA2NTUzNjtcclxuICB2ID0gdDEwICsgYyArIDY1NTM1OyBjID0gTWF0aC5mbG9vcih2IC8gNjU1MzYpOyB0MTAgPSB2IC0gYyAqIDY1NTM2O1xyXG4gIHYgPSB0MTEgKyBjICsgNjU1MzU7IGMgPSBNYXRoLmZsb29yKHYgLyA2NTUzNik7IHQxMSA9IHYgLSBjICogNjU1MzY7XHJcbiAgdiA9IHQxMiArIGMgKyA2NTUzNTsgYyA9IE1hdGguZmxvb3IodiAvIDY1NTM2KTsgdDEyID0gdiAtIGMgKiA2NTUzNjtcclxuICB2ID0gdDEzICsgYyArIDY1NTM1OyBjID0gTWF0aC5mbG9vcih2IC8gNjU1MzYpOyB0MTMgPSB2IC0gYyAqIDY1NTM2O1xyXG4gIHYgPSB0MTQgKyBjICsgNjU1MzU7IGMgPSBNYXRoLmZsb29yKHYgLyA2NTUzNik7IHQxNCA9IHYgLSBjICogNjU1MzY7XHJcbiAgdiA9IHQxNSArIGMgKyA2NTUzNTsgYyA9IE1hdGguZmxvb3IodiAvIDY1NTM2KTsgdDE1ID0gdiAtIGMgKiA2NTUzNjtcclxuICB0MCArPSBjLTEgKyAzNyAqIChjLTEpO1xyXG5cclxuICBvWyAwXSA9IHQwO1xyXG4gIG9bIDFdID0gdDE7XHJcbiAgb1sgMl0gPSB0MjtcclxuICBvWyAzXSA9IHQzO1xyXG4gIG9bIDRdID0gdDQ7XHJcbiAgb1sgNV0gPSB0NTtcclxuICBvWyA2XSA9IHQ2O1xyXG4gIG9bIDddID0gdDc7XHJcbiAgb1sgOF0gPSB0ODtcclxuICBvWyA5XSA9IHQ5O1xyXG4gIG9bMTBdID0gdDEwO1xyXG4gIG9bMTFdID0gdDExO1xyXG4gIG9bMTJdID0gdDEyO1xyXG4gIG9bMTNdID0gdDEzO1xyXG4gIG9bMTRdID0gdDE0O1xyXG4gIG9bMTVdID0gdDE1O1xyXG59XHJcblxyXG5mdW5jdGlvbiBTKG8sIGEpIHtcclxuICBNKG8sIGEsIGEpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBpbnYyNTUxOShvLCBpKSB7XHJcbiAgdmFyIGMgPSBnZigpO1xyXG4gIHZhciBhO1xyXG4gIGZvciAoYSA9IDA7IGEgPCAxNjsgYSsrKSBjW2FdID0gaVthXTtcclxuICBmb3IgKGEgPSAyNTM7IGEgPj0gMDsgYS0tKSB7XHJcbiAgICBTKGMsIGMpO1xyXG4gICAgaWYoYSAhPT0gMiAmJiBhICE9PSA0KSBNKGMsIGMsIGkpO1xyXG4gIH1cclxuICBmb3IgKGEgPSAwOyBhIDwgMTY7IGErKykgb1thXSA9IGNbYV07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHBvdzI1MjMobywgaSkge1xyXG4gIHZhciBjID0gZ2YoKTtcclxuICB2YXIgYTtcclxuICBmb3IgKGEgPSAwOyBhIDwgMTY7IGErKykgY1thXSA9IGlbYV07XHJcbiAgZm9yIChhID0gMjUwOyBhID49IDA7IGEtLSkge1xyXG4gICAgICBTKGMsIGMpO1xyXG4gICAgICBpZihhICE9PSAxKSBNKGMsIGMsIGkpO1xyXG4gIH1cclxuICBmb3IgKGEgPSAwOyBhIDwgMTY7IGErKykgb1thXSA9IGNbYV07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyeXB0b19zY2FsYXJtdWx0KHEsIG4sIHApIHtcclxuICB2YXIgeiA9IG5ldyBVaW50OEFycmF5KDMyKTtcclxuICB2YXIgeCA9IG5ldyBGbG9hdDY0QXJyYXkoODApLCByLCBpO1xyXG4gIHZhciBhID0gZ2YoKSwgYiA9IGdmKCksIGMgPSBnZigpLFxyXG4gICAgICBkID0gZ2YoKSwgZSA9IGdmKCksIGYgPSBnZigpO1xyXG4gIGZvciAoaSA9IDA7IGkgPCAzMTsgaSsrKSB6W2ldID0gbltpXTtcclxuICB6WzMxXT0oblszMV0mMTI3KXw2NDtcclxuICB6WzBdJj0yNDg7XHJcbiAgdW5wYWNrMjU1MTkoeCxwKTtcclxuICBmb3IgKGkgPSAwOyBpIDwgMTY7IGkrKykge1xyXG4gICAgYltpXT14W2ldO1xyXG4gICAgZFtpXT1hW2ldPWNbaV09MDtcclxuICB9XHJcbiAgYVswXT1kWzBdPTE7XHJcbiAgZm9yIChpPTI1NDsgaT49MDsgLS1pKSB7XHJcbiAgICByPSh6W2k+Pj4zXT4+PihpJjcpKSYxO1xyXG4gICAgc2VsMjU1MTkoYSxiLHIpO1xyXG4gICAgc2VsMjU1MTkoYyxkLHIpO1xyXG4gICAgQShlLGEsYyk7XHJcbiAgICBaKGEsYSxjKTtcclxuICAgIEEoYyxiLGQpO1xyXG4gICAgWihiLGIsZCk7XHJcbiAgICBTKGQsZSk7XHJcbiAgICBTKGYsYSk7XHJcbiAgICBNKGEsYyxhKTtcclxuICAgIE0oYyxiLGUpO1xyXG4gICAgQShlLGEsYyk7XHJcbiAgICBaKGEsYSxjKTtcclxuICAgIFMoYixhKTtcclxuICAgIFooYyxkLGYpO1xyXG4gICAgTShhLGMsXzEyMTY2NSk7XHJcbiAgICBBKGEsYSxkKTtcclxuICAgIE0oYyxjLGEpO1xyXG4gICAgTShhLGQsZik7XHJcbiAgICBNKGQsYix4KTtcclxuICAgIFMoYixlKTtcclxuICAgIHNlbDI1NTE5KGEsYixyKTtcclxuICAgIHNlbDI1NTE5KGMsZCxyKTtcclxuICB9XHJcbiAgZm9yIChpID0gMDsgaSA8IDE2OyBpKyspIHtcclxuICAgIHhbaSsxNl09YVtpXTtcclxuICAgIHhbaSszMl09Y1tpXTtcclxuICAgIHhbaSs0OF09YltpXTtcclxuICAgIHhbaSs2NF09ZFtpXTtcclxuICB9XHJcbiAgdmFyIHgzMiA9IHguc3ViYXJyYXkoMzIpO1xyXG4gIHZhciB4MTYgPSB4LnN1YmFycmF5KDE2KTtcclxuICBpbnYyNTUxOSh4MzIseDMyKTtcclxuICBNKHgxNix4MTYseDMyKTtcclxuICBwYWNrMjU1MTkocSx4MTYpO1xyXG4gIHJldHVybiAwO1xyXG59XHJcblxyXG5mdW5jdGlvbiBjcnlwdG9fc2NhbGFybXVsdF9iYXNlKHEsIG4pIHtcclxuICByZXR1cm4gY3J5cHRvX3NjYWxhcm11bHQocSwgbiwgXzkpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBjcnlwdG9fYm94X2tleXBhaXIoeSwgeCkge1xyXG4gIHJhbmRvbWJ5dGVzKHgsIDMyKTtcclxuICByZXR1cm4gY3J5cHRvX3NjYWxhcm11bHRfYmFzZSh5LCB4KTtcclxufVxyXG5cclxuZnVuY3Rpb24gY3J5cHRvX2JveF9iZWZvcmVubShrLCB5LCB4KSB7XHJcbiAgdmFyIHMgPSBuZXcgVWludDhBcnJheSgzMik7XHJcbiAgY3J5cHRvX3NjYWxhcm11bHQocywgeCwgeSk7XHJcbiAgcmV0dXJuIGNyeXB0b19jb3JlX2hzYWxzYTIwKGssIF8wLCBzLCBzaWdtYSk7XHJcbn1cclxuXHJcbnZhciBjcnlwdG9fYm94X2FmdGVybm0gPSBjcnlwdG9fc2VjcmV0Ym94O1xyXG52YXIgY3J5cHRvX2JveF9vcGVuX2FmdGVybm0gPSBjcnlwdG9fc2VjcmV0Ym94X29wZW47XHJcblxyXG5mdW5jdGlvbiBjcnlwdG9fYm94KGMsIG0sIGQsIG4sIHksIHgpIHtcclxuICB2YXIgayA9IG5ldyBVaW50OEFycmF5KDMyKTtcclxuICBjcnlwdG9fYm94X2JlZm9yZW5tKGssIHksIHgpO1xyXG4gIHJldHVybiBjcnlwdG9fYm94X2FmdGVybm0oYywgbSwgZCwgbiwgayk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyeXB0b19ib3hfb3BlbihtLCBjLCBkLCBuLCB5LCB4KSB7XHJcbiAgdmFyIGsgPSBuZXcgVWludDhBcnJheSgzMik7XHJcbiAgY3J5cHRvX2JveF9iZWZvcmVubShrLCB5LCB4KTtcclxuICByZXR1cm4gY3J5cHRvX2JveF9vcGVuX2FmdGVybm0obSwgYywgZCwgbiwgayk7XHJcbn1cclxuXHJcbnZhciBLID0gW1xyXG4gIDB4NDI4YTJmOTgsIDB4ZDcyOGFlMjIsIDB4NzEzNzQ0OTEsIDB4MjNlZjY1Y2QsXHJcbiAgMHhiNWMwZmJjZiwgMHhlYzRkM2IyZiwgMHhlOWI1ZGJhNSwgMHg4MTg5ZGJiYyxcclxuICAweDM5NTZjMjViLCAweGYzNDhiNTM4LCAweDU5ZjExMWYxLCAweGI2MDVkMDE5LFxyXG4gIDB4OTIzZjgyYTQsIDB4YWYxOTRmOWIsIDB4YWIxYzVlZDUsIDB4ZGE2ZDgxMTgsXHJcbiAgMHhkODA3YWE5OCwgMHhhMzAzMDI0MiwgMHgxMjgzNWIwMSwgMHg0NTcwNmZiZSxcclxuICAweDI0MzE4NWJlLCAweDRlZTRiMjhjLCAweDU1MGM3ZGMzLCAweGQ1ZmZiNGUyLFxyXG4gIDB4NzJiZTVkNzQsIDB4ZjI3Yjg5NmYsIDB4ODBkZWIxZmUsIDB4M2IxNjk2YjEsXHJcbiAgMHg5YmRjMDZhNywgMHgyNWM3MTIzNSwgMHhjMTliZjE3NCwgMHhjZjY5MjY5NCxcclxuICAweGU0OWI2OWMxLCAweDllZjE0YWQyLCAweGVmYmU0Nzg2LCAweDM4NGYyNWUzLFxyXG4gIDB4MGZjMTlkYzYsIDB4OGI4Y2Q1YjUsIDB4MjQwY2ExY2MsIDB4NzdhYzljNjUsXHJcbiAgMHgyZGU5MmM2ZiwgMHg1OTJiMDI3NSwgMHg0YTc0ODRhYSwgMHg2ZWE2ZTQ4MyxcclxuICAweDVjYjBhOWRjLCAweGJkNDFmYmQ0LCAweDc2Zjk4OGRhLCAweDgzMTE1M2I1LFxyXG4gIDB4OTgzZTUxNTIsIDB4ZWU2NmRmYWIsIDB4YTgzMWM2NmQsIDB4MmRiNDMyMTAsXHJcbiAgMHhiMDAzMjdjOCwgMHg5OGZiMjEzZiwgMHhiZjU5N2ZjNywgMHhiZWVmMGVlNCxcclxuICAweGM2ZTAwYmYzLCAweDNkYTg4ZmMyLCAweGQ1YTc5MTQ3LCAweDkzMGFhNzI1LFxyXG4gIDB4MDZjYTYzNTEsIDB4ZTAwMzgyNmYsIDB4MTQyOTI5NjcsIDB4MGEwZTZlNzAsXHJcbiAgMHgyN2I3MGE4NSwgMHg0NmQyMmZmYywgMHgyZTFiMjEzOCwgMHg1YzI2YzkyNixcclxuICAweDRkMmM2ZGZjLCAweDVhYzQyYWVkLCAweDUzMzgwZDEzLCAweDlkOTViM2RmLFxyXG4gIDB4NjUwYTczNTQsIDB4OGJhZjYzZGUsIDB4NzY2YTBhYmIsIDB4M2M3N2IyYTgsXHJcbiAgMHg4MWMyYzkyZSwgMHg0N2VkYWVlNiwgMHg5MjcyMmM4NSwgMHgxNDgyMzUzYixcclxuICAweGEyYmZlOGExLCAweDRjZjEwMzY0LCAweGE4MWE2NjRiLCAweGJjNDIzMDAxLFxyXG4gIDB4YzI0YjhiNzAsIDB4ZDBmODk3OTEsIDB4Yzc2YzUxYTMsIDB4MDY1NGJlMzAsXHJcbiAgMHhkMTkyZTgxOSwgMHhkNmVmNTIxOCwgMHhkNjk5MDYyNCwgMHg1NTY1YTkxMCxcclxuICAweGY0MGUzNTg1LCAweDU3NzEyMDJhLCAweDEwNmFhMDcwLCAweDMyYmJkMWI4LFxyXG4gIDB4MTlhNGMxMTYsIDB4YjhkMmQwYzgsIDB4MWUzNzZjMDgsIDB4NTE0MWFiNTMsXHJcbiAgMHgyNzQ4Nzc0YywgMHhkZjhlZWI5OSwgMHgzNGIwYmNiNSwgMHhlMTliNDhhOCxcclxuICAweDM5MWMwY2IzLCAweGM1Yzk1YTYzLCAweDRlZDhhYTRhLCAweGUzNDE4YWNiLFxyXG4gIDB4NWI5Y2NhNGYsIDB4Nzc2M2UzNzMsIDB4NjgyZTZmZjMsIDB4ZDZiMmI4YTMsXHJcbiAgMHg3NDhmODJlZSwgMHg1ZGVmYjJmYywgMHg3OGE1NjM2ZiwgMHg0MzE3MmY2MCxcclxuICAweDg0Yzg3ODE0LCAweGExZjBhYjcyLCAweDhjYzcwMjA4LCAweDFhNjQzOWVjLFxyXG4gIDB4OTBiZWZmZmEsIDB4MjM2MzFlMjgsIDB4YTQ1MDZjZWIsIDB4ZGU4MmJkZTksXHJcbiAgMHhiZWY5YTNmNywgMHhiMmM2NzkxNSwgMHhjNjcxNzhmMiwgMHhlMzcyNTMyYixcclxuICAweGNhMjczZWNlLCAweGVhMjY2MTljLCAweGQxODZiOGM3LCAweDIxYzBjMjA3LFxyXG4gIDB4ZWFkYTdkZDYsIDB4Y2RlMGViMWUsIDB4ZjU3ZDRmN2YsIDB4ZWU2ZWQxNzgsXHJcbiAgMHgwNmYwNjdhYSwgMHg3MjE3NmZiYSwgMHgwYTYzN2RjNSwgMHhhMmM4OThhNixcclxuICAweDExM2Y5ODA0LCAweGJlZjkwZGFlLCAweDFiNzEwYjM1LCAweDEzMWM0NzFiLFxyXG4gIDB4MjhkYjc3ZjUsIDB4MjMwNDdkODQsIDB4MzJjYWFiN2IsIDB4NDBjNzI0OTMsXHJcbiAgMHgzYzllYmUwYSwgMHgxNWM5YmViYywgMHg0MzFkNjdjNCwgMHg5YzEwMGQ0YyxcclxuICAweDRjYzVkNGJlLCAweGNiM2U0MmI2LCAweDU5N2YyOTljLCAweGZjNjU3ZTJhLFxyXG4gIDB4NWZjYjZmYWIsIDB4M2FkNmZhZWMsIDB4NmM0NDE5OGMsIDB4NGE0NzU4MTdcclxuXTtcclxuXHJcbmZ1bmN0aW9uIGNyeXB0b19oYXNoYmxvY2tzX2hsKGhoLCBobCwgbSwgbikge1xyXG4gIHZhciB3aCA9IG5ldyBJbnQzMkFycmF5KDE2KSwgd2wgPSBuZXcgSW50MzJBcnJheSgxNiksXHJcbiAgICAgIGJoMCwgYmgxLCBiaDIsIGJoMywgYmg0LCBiaDUsIGJoNiwgYmg3LFxyXG4gICAgICBibDAsIGJsMSwgYmwyLCBibDMsIGJsNCwgYmw1LCBibDYsIGJsNyxcclxuICAgICAgdGgsIHRsLCBpLCBqLCBoLCBsLCBhLCBiLCBjLCBkO1xyXG5cclxuICB2YXIgYWgwID0gaGhbMF0sXHJcbiAgICAgIGFoMSA9IGhoWzFdLFxyXG4gICAgICBhaDIgPSBoaFsyXSxcclxuICAgICAgYWgzID0gaGhbM10sXHJcbiAgICAgIGFoNCA9IGhoWzRdLFxyXG4gICAgICBhaDUgPSBoaFs1XSxcclxuICAgICAgYWg2ID0gaGhbNl0sXHJcbiAgICAgIGFoNyA9IGhoWzddLFxyXG5cclxuICAgICAgYWwwID0gaGxbMF0sXHJcbiAgICAgIGFsMSA9IGhsWzFdLFxyXG4gICAgICBhbDIgPSBobFsyXSxcclxuICAgICAgYWwzID0gaGxbM10sXHJcbiAgICAgIGFsNCA9IGhsWzRdLFxyXG4gICAgICBhbDUgPSBobFs1XSxcclxuICAgICAgYWw2ID0gaGxbNl0sXHJcbiAgICAgIGFsNyA9IGhsWzddO1xyXG5cclxuICB2YXIgcG9zID0gMDtcclxuICB3aGlsZSAobiA+PSAxMjgpIHtcclxuICAgIGZvciAoaSA9IDA7IGkgPCAxNjsgaSsrKSB7XHJcbiAgICAgIGogPSA4ICogaSArIHBvcztcclxuICAgICAgd2hbaV0gPSAobVtqKzBdIDw8IDI0KSB8IChtW2orMV0gPDwgMTYpIHwgKG1baisyXSA8PCA4KSB8IG1baiszXTtcclxuICAgICAgd2xbaV0gPSAobVtqKzRdIDw8IDI0KSB8IChtW2orNV0gPDwgMTYpIHwgKG1bais2XSA8PCA4KSB8IG1bais3XTtcclxuICAgIH1cclxuICAgIGZvciAoaSA9IDA7IGkgPCA4MDsgaSsrKSB7XHJcbiAgICAgIGJoMCA9IGFoMDtcclxuICAgICAgYmgxID0gYWgxO1xyXG4gICAgICBiaDIgPSBhaDI7XHJcbiAgICAgIGJoMyA9IGFoMztcclxuICAgICAgYmg0ID0gYWg0O1xyXG4gICAgICBiaDUgPSBhaDU7XHJcbiAgICAgIGJoNiA9IGFoNjtcclxuICAgICAgYmg3ID0gYWg3O1xyXG5cclxuICAgICAgYmwwID0gYWwwO1xyXG4gICAgICBibDEgPSBhbDE7XHJcbiAgICAgIGJsMiA9IGFsMjtcclxuICAgICAgYmwzID0gYWwzO1xyXG4gICAgICBibDQgPSBhbDQ7XHJcbiAgICAgIGJsNSA9IGFsNTtcclxuICAgICAgYmw2ID0gYWw2O1xyXG4gICAgICBibDcgPSBhbDc7XHJcblxyXG4gICAgICAvLyBhZGRcclxuICAgICAgaCA9IGFoNztcclxuICAgICAgbCA9IGFsNztcclxuXHJcbiAgICAgIGEgPSBsICYgMHhmZmZmOyBiID0gbCA+Pj4gMTY7XHJcbiAgICAgIGMgPSBoICYgMHhmZmZmOyBkID0gaCA+Pj4gMTY7XHJcblxyXG4gICAgICAvLyBTaWdtYTFcclxuICAgICAgaCA9ICgoYWg0ID4+PiAxNCkgfCAoYWw0IDw8ICgzMi0xNCkpKSBeICgoYWg0ID4+PiAxOCkgfCAoYWw0IDw8ICgzMi0xOCkpKSBeICgoYWw0ID4+PiAoNDEtMzIpKSB8IChhaDQgPDwgKDMyLSg0MS0zMikpKSk7XHJcbiAgICAgIGwgPSAoKGFsNCA+Pj4gMTQpIHwgKGFoNCA8PCAoMzItMTQpKSkgXiAoKGFsNCA+Pj4gMTgpIHwgKGFoNCA8PCAoMzItMTgpKSkgXiAoKGFoNCA+Pj4gKDQxLTMyKSkgfCAoYWw0IDw8ICgzMi0oNDEtMzIpKSkpO1xyXG5cclxuICAgICAgYSArPSBsICYgMHhmZmZmOyBiICs9IGwgPj4+IDE2O1xyXG4gICAgICBjICs9IGggJiAweGZmZmY7IGQgKz0gaCA+Pj4gMTY7XHJcblxyXG4gICAgICAvLyBDaFxyXG4gICAgICBoID0gKGFoNCAmIGFoNSkgXiAofmFoNCAmIGFoNik7XHJcbiAgICAgIGwgPSAoYWw0ICYgYWw1KSBeICh+YWw0ICYgYWw2KTtcclxuXHJcbiAgICAgIGEgKz0gbCAmIDB4ZmZmZjsgYiArPSBsID4+PiAxNjtcclxuICAgICAgYyArPSBoICYgMHhmZmZmOyBkICs9IGggPj4+IDE2O1xyXG5cclxuICAgICAgLy8gS1xyXG4gICAgICBoID0gS1tpKjJdO1xyXG4gICAgICBsID0gS1tpKjIrMV07XHJcblxyXG4gICAgICBhICs9IGwgJiAweGZmZmY7IGIgKz0gbCA+Pj4gMTY7XHJcbiAgICAgIGMgKz0gaCAmIDB4ZmZmZjsgZCArPSBoID4+PiAxNjtcclxuXHJcbiAgICAgIC8vIHdcclxuICAgICAgaCA9IHdoW2klMTZdO1xyXG4gICAgICBsID0gd2xbaSUxNl07XHJcblxyXG4gICAgICBhICs9IGwgJiAweGZmZmY7IGIgKz0gbCA+Pj4gMTY7XHJcbiAgICAgIGMgKz0gaCAmIDB4ZmZmZjsgZCArPSBoID4+PiAxNjtcclxuXHJcbiAgICAgIGIgKz0gYSA+Pj4gMTY7XHJcbiAgICAgIGMgKz0gYiA+Pj4gMTY7XHJcbiAgICAgIGQgKz0gYyA+Pj4gMTY7XHJcblxyXG4gICAgICB0aCA9IGMgJiAweGZmZmYgfCBkIDw8IDE2O1xyXG4gICAgICB0bCA9IGEgJiAweGZmZmYgfCBiIDw8IDE2O1xyXG5cclxuICAgICAgLy8gYWRkXHJcbiAgICAgIGggPSB0aDtcclxuICAgICAgbCA9IHRsO1xyXG5cclxuICAgICAgYSA9IGwgJiAweGZmZmY7IGIgPSBsID4+PiAxNjtcclxuICAgICAgYyA9IGggJiAweGZmZmY7IGQgPSBoID4+PiAxNjtcclxuXHJcbiAgICAgIC8vIFNpZ21hMFxyXG4gICAgICBoID0gKChhaDAgPj4+IDI4KSB8IChhbDAgPDwgKDMyLTI4KSkpIF4gKChhbDAgPj4+ICgzNC0zMikpIHwgKGFoMCA8PCAoMzItKDM0LTMyKSkpKSBeICgoYWwwID4+PiAoMzktMzIpKSB8IChhaDAgPDwgKDMyLSgzOS0zMikpKSk7XHJcbiAgICAgIGwgPSAoKGFsMCA+Pj4gMjgpIHwgKGFoMCA8PCAoMzItMjgpKSkgXiAoKGFoMCA+Pj4gKDM0LTMyKSkgfCAoYWwwIDw8ICgzMi0oMzQtMzIpKSkpIF4gKChhaDAgPj4+ICgzOS0zMikpIHwgKGFsMCA8PCAoMzItKDM5LTMyKSkpKTtcclxuXHJcbiAgICAgIGEgKz0gbCAmIDB4ZmZmZjsgYiArPSBsID4+PiAxNjtcclxuICAgICAgYyArPSBoICYgMHhmZmZmOyBkICs9IGggPj4+IDE2O1xyXG5cclxuICAgICAgLy8gTWFqXHJcbiAgICAgIGggPSAoYWgwICYgYWgxKSBeIChhaDAgJiBhaDIpIF4gKGFoMSAmIGFoMik7XHJcbiAgICAgIGwgPSAoYWwwICYgYWwxKSBeIChhbDAgJiBhbDIpIF4gKGFsMSAmIGFsMik7XHJcblxyXG4gICAgICBhICs9IGwgJiAweGZmZmY7IGIgKz0gbCA+Pj4gMTY7XHJcbiAgICAgIGMgKz0gaCAmIDB4ZmZmZjsgZCArPSBoID4+PiAxNjtcclxuXHJcbiAgICAgIGIgKz0gYSA+Pj4gMTY7XHJcbiAgICAgIGMgKz0gYiA+Pj4gMTY7XHJcbiAgICAgIGQgKz0gYyA+Pj4gMTY7XHJcblxyXG4gICAgICBiaDcgPSAoYyAmIDB4ZmZmZikgfCAoZCA8PCAxNik7XHJcbiAgICAgIGJsNyA9IChhICYgMHhmZmZmKSB8IChiIDw8IDE2KTtcclxuXHJcbiAgICAgIC8vIGFkZFxyXG4gICAgICBoID0gYmgzO1xyXG4gICAgICBsID0gYmwzO1xyXG5cclxuICAgICAgYSA9IGwgJiAweGZmZmY7IGIgPSBsID4+PiAxNjtcclxuICAgICAgYyA9IGggJiAweGZmZmY7IGQgPSBoID4+PiAxNjtcclxuXHJcbiAgICAgIGggPSB0aDtcclxuICAgICAgbCA9IHRsO1xyXG5cclxuICAgICAgYSArPSBsICYgMHhmZmZmOyBiICs9IGwgPj4+IDE2O1xyXG4gICAgICBjICs9IGggJiAweGZmZmY7IGQgKz0gaCA+Pj4gMTY7XHJcblxyXG4gICAgICBiICs9IGEgPj4+IDE2O1xyXG4gICAgICBjICs9IGIgPj4+IDE2O1xyXG4gICAgICBkICs9IGMgPj4+IDE2O1xyXG5cclxuICAgICAgYmgzID0gKGMgJiAweGZmZmYpIHwgKGQgPDwgMTYpO1xyXG4gICAgICBibDMgPSAoYSAmIDB4ZmZmZikgfCAoYiA8PCAxNik7XHJcblxyXG4gICAgICBhaDEgPSBiaDA7XHJcbiAgICAgIGFoMiA9IGJoMTtcclxuICAgICAgYWgzID0gYmgyO1xyXG4gICAgICBhaDQgPSBiaDM7XHJcbiAgICAgIGFoNSA9IGJoNDtcclxuICAgICAgYWg2ID0gYmg1O1xyXG4gICAgICBhaDcgPSBiaDY7XHJcbiAgICAgIGFoMCA9IGJoNztcclxuXHJcbiAgICAgIGFsMSA9IGJsMDtcclxuICAgICAgYWwyID0gYmwxO1xyXG4gICAgICBhbDMgPSBibDI7XHJcbiAgICAgIGFsNCA9IGJsMztcclxuICAgICAgYWw1ID0gYmw0O1xyXG4gICAgICBhbDYgPSBibDU7XHJcbiAgICAgIGFsNyA9IGJsNjtcclxuICAgICAgYWwwID0gYmw3O1xyXG5cclxuICAgICAgaWYgKGklMTYgPT09IDE1KSB7XHJcbiAgICAgICAgZm9yIChqID0gMDsgaiA8IDE2OyBqKyspIHtcclxuICAgICAgICAgIC8vIGFkZFxyXG4gICAgICAgICAgaCA9IHdoW2pdO1xyXG4gICAgICAgICAgbCA9IHdsW2pdO1xyXG5cclxuICAgICAgICAgIGEgPSBsICYgMHhmZmZmOyBiID0gbCA+Pj4gMTY7XHJcbiAgICAgICAgICBjID0gaCAmIDB4ZmZmZjsgZCA9IGggPj4+IDE2O1xyXG5cclxuICAgICAgICAgIGggPSB3aFsoais5KSUxNl07XHJcbiAgICAgICAgICBsID0gd2xbKGorOSklMTZdO1xyXG5cclxuICAgICAgICAgIGEgKz0gbCAmIDB4ZmZmZjsgYiArPSBsID4+PiAxNjtcclxuICAgICAgICAgIGMgKz0gaCAmIDB4ZmZmZjsgZCArPSBoID4+PiAxNjtcclxuXHJcbiAgICAgICAgICAvLyBzaWdtYTBcclxuICAgICAgICAgIHRoID0gd2hbKGorMSklMTZdO1xyXG4gICAgICAgICAgdGwgPSB3bFsoaisxKSUxNl07XHJcbiAgICAgICAgICBoID0gKCh0aCA+Pj4gMSkgfCAodGwgPDwgKDMyLTEpKSkgXiAoKHRoID4+PiA4KSB8ICh0bCA8PCAoMzItOCkpKSBeICh0aCA+Pj4gNyk7XHJcbiAgICAgICAgICBsID0gKCh0bCA+Pj4gMSkgfCAodGggPDwgKDMyLTEpKSkgXiAoKHRsID4+PiA4KSB8ICh0aCA8PCAoMzItOCkpKSBeICgodGwgPj4+IDcpIHwgKHRoIDw8ICgzMi03KSkpO1xyXG5cclxuICAgICAgICAgIGEgKz0gbCAmIDB4ZmZmZjsgYiArPSBsID4+PiAxNjtcclxuICAgICAgICAgIGMgKz0gaCAmIDB4ZmZmZjsgZCArPSBoID4+PiAxNjtcclxuXHJcbiAgICAgICAgICAvLyBzaWdtYTFcclxuICAgICAgICAgIHRoID0gd2hbKGorMTQpJTE2XTtcclxuICAgICAgICAgIHRsID0gd2xbKGorMTQpJTE2XTtcclxuICAgICAgICAgIGggPSAoKHRoID4+PiAxOSkgfCAodGwgPDwgKDMyLTE5KSkpIF4gKCh0bCA+Pj4gKDYxLTMyKSkgfCAodGggPDwgKDMyLSg2MS0zMikpKSkgXiAodGggPj4+IDYpO1xyXG4gICAgICAgICAgbCA9ICgodGwgPj4+IDE5KSB8ICh0aCA8PCAoMzItMTkpKSkgXiAoKHRoID4+PiAoNjEtMzIpKSB8ICh0bCA8PCAoMzItKDYxLTMyKSkpKSBeICgodGwgPj4+IDYpIHwgKHRoIDw8ICgzMi02KSkpO1xyXG5cclxuICAgICAgICAgIGEgKz0gbCAmIDB4ZmZmZjsgYiArPSBsID4+PiAxNjtcclxuICAgICAgICAgIGMgKz0gaCAmIDB4ZmZmZjsgZCArPSBoID4+PiAxNjtcclxuXHJcbiAgICAgICAgICBiICs9IGEgPj4+IDE2O1xyXG4gICAgICAgICAgYyArPSBiID4+PiAxNjtcclxuICAgICAgICAgIGQgKz0gYyA+Pj4gMTY7XHJcblxyXG4gICAgICAgICAgd2hbal0gPSAoYyAmIDB4ZmZmZikgfCAoZCA8PCAxNik7XHJcbiAgICAgICAgICB3bFtqXSA9IChhICYgMHhmZmZmKSB8IChiIDw8IDE2KTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBhZGRcclxuICAgIGggPSBhaDA7XHJcbiAgICBsID0gYWwwO1xyXG5cclxuICAgIGEgPSBsICYgMHhmZmZmOyBiID0gbCA+Pj4gMTY7XHJcbiAgICBjID0gaCAmIDB4ZmZmZjsgZCA9IGggPj4+IDE2O1xyXG5cclxuICAgIGggPSBoaFswXTtcclxuICAgIGwgPSBobFswXTtcclxuXHJcbiAgICBhICs9IGwgJiAweGZmZmY7IGIgKz0gbCA+Pj4gMTY7XHJcbiAgICBjICs9IGggJiAweGZmZmY7IGQgKz0gaCA+Pj4gMTY7XHJcblxyXG4gICAgYiArPSBhID4+PiAxNjtcclxuICAgIGMgKz0gYiA+Pj4gMTY7XHJcbiAgICBkICs9IGMgPj4+IDE2O1xyXG5cclxuICAgIGhoWzBdID0gYWgwID0gKGMgJiAweGZmZmYpIHwgKGQgPDwgMTYpO1xyXG4gICAgaGxbMF0gPSBhbDAgPSAoYSAmIDB4ZmZmZikgfCAoYiA8PCAxNik7XHJcblxyXG4gICAgaCA9IGFoMTtcclxuICAgIGwgPSBhbDE7XHJcblxyXG4gICAgYSA9IGwgJiAweGZmZmY7IGIgPSBsID4+PiAxNjtcclxuICAgIGMgPSBoICYgMHhmZmZmOyBkID0gaCA+Pj4gMTY7XHJcblxyXG4gICAgaCA9IGhoWzFdO1xyXG4gICAgbCA9IGhsWzFdO1xyXG5cclxuICAgIGEgKz0gbCAmIDB4ZmZmZjsgYiArPSBsID4+PiAxNjtcclxuICAgIGMgKz0gaCAmIDB4ZmZmZjsgZCArPSBoID4+PiAxNjtcclxuXHJcbiAgICBiICs9IGEgPj4+IDE2O1xyXG4gICAgYyArPSBiID4+PiAxNjtcclxuICAgIGQgKz0gYyA+Pj4gMTY7XHJcblxyXG4gICAgaGhbMV0gPSBhaDEgPSAoYyAmIDB4ZmZmZikgfCAoZCA8PCAxNik7XHJcbiAgICBobFsxXSA9IGFsMSA9IChhICYgMHhmZmZmKSB8IChiIDw8IDE2KTtcclxuXHJcbiAgICBoID0gYWgyO1xyXG4gICAgbCA9IGFsMjtcclxuXHJcbiAgICBhID0gbCAmIDB4ZmZmZjsgYiA9IGwgPj4+IDE2O1xyXG4gICAgYyA9IGggJiAweGZmZmY7IGQgPSBoID4+PiAxNjtcclxuXHJcbiAgICBoID0gaGhbMl07XHJcbiAgICBsID0gaGxbMl07XHJcblxyXG4gICAgYSArPSBsICYgMHhmZmZmOyBiICs9IGwgPj4+IDE2O1xyXG4gICAgYyArPSBoICYgMHhmZmZmOyBkICs9IGggPj4+IDE2O1xyXG5cclxuICAgIGIgKz0gYSA+Pj4gMTY7XHJcbiAgICBjICs9IGIgPj4+IDE2O1xyXG4gICAgZCArPSBjID4+PiAxNjtcclxuXHJcbiAgICBoaFsyXSA9IGFoMiA9IChjICYgMHhmZmZmKSB8IChkIDw8IDE2KTtcclxuICAgIGhsWzJdID0gYWwyID0gKGEgJiAweGZmZmYpIHwgKGIgPDwgMTYpO1xyXG5cclxuICAgIGggPSBhaDM7XHJcbiAgICBsID0gYWwzO1xyXG5cclxuICAgIGEgPSBsICYgMHhmZmZmOyBiID0gbCA+Pj4gMTY7XHJcbiAgICBjID0gaCAmIDB4ZmZmZjsgZCA9IGggPj4+IDE2O1xyXG5cclxuICAgIGggPSBoaFszXTtcclxuICAgIGwgPSBobFszXTtcclxuXHJcbiAgICBhICs9IGwgJiAweGZmZmY7IGIgKz0gbCA+Pj4gMTY7XHJcbiAgICBjICs9IGggJiAweGZmZmY7IGQgKz0gaCA+Pj4gMTY7XHJcblxyXG4gICAgYiArPSBhID4+PiAxNjtcclxuICAgIGMgKz0gYiA+Pj4gMTY7XHJcbiAgICBkICs9IGMgPj4+IDE2O1xyXG5cclxuICAgIGhoWzNdID0gYWgzID0gKGMgJiAweGZmZmYpIHwgKGQgPDwgMTYpO1xyXG4gICAgaGxbM10gPSBhbDMgPSAoYSAmIDB4ZmZmZikgfCAoYiA8PCAxNik7XHJcblxyXG4gICAgaCA9IGFoNDtcclxuICAgIGwgPSBhbDQ7XHJcblxyXG4gICAgYSA9IGwgJiAweGZmZmY7IGIgPSBsID4+PiAxNjtcclxuICAgIGMgPSBoICYgMHhmZmZmOyBkID0gaCA+Pj4gMTY7XHJcblxyXG4gICAgaCA9IGhoWzRdO1xyXG4gICAgbCA9IGhsWzRdO1xyXG5cclxuICAgIGEgKz0gbCAmIDB4ZmZmZjsgYiArPSBsID4+PiAxNjtcclxuICAgIGMgKz0gaCAmIDB4ZmZmZjsgZCArPSBoID4+PiAxNjtcclxuXHJcbiAgICBiICs9IGEgPj4+IDE2O1xyXG4gICAgYyArPSBiID4+PiAxNjtcclxuICAgIGQgKz0gYyA+Pj4gMTY7XHJcblxyXG4gICAgaGhbNF0gPSBhaDQgPSAoYyAmIDB4ZmZmZikgfCAoZCA8PCAxNik7XHJcbiAgICBobFs0XSA9IGFsNCA9IChhICYgMHhmZmZmKSB8IChiIDw8IDE2KTtcclxuXHJcbiAgICBoID0gYWg1O1xyXG4gICAgbCA9IGFsNTtcclxuXHJcbiAgICBhID0gbCAmIDB4ZmZmZjsgYiA9IGwgPj4+IDE2O1xyXG4gICAgYyA9IGggJiAweGZmZmY7IGQgPSBoID4+PiAxNjtcclxuXHJcbiAgICBoID0gaGhbNV07XHJcbiAgICBsID0gaGxbNV07XHJcblxyXG4gICAgYSArPSBsICYgMHhmZmZmOyBiICs9IGwgPj4+IDE2O1xyXG4gICAgYyArPSBoICYgMHhmZmZmOyBkICs9IGggPj4+IDE2O1xyXG5cclxuICAgIGIgKz0gYSA+Pj4gMTY7XHJcbiAgICBjICs9IGIgPj4+IDE2O1xyXG4gICAgZCArPSBjID4+PiAxNjtcclxuXHJcbiAgICBoaFs1XSA9IGFoNSA9IChjICYgMHhmZmZmKSB8IChkIDw8IDE2KTtcclxuICAgIGhsWzVdID0gYWw1ID0gKGEgJiAweGZmZmYpIHwgKGIgPDwgMTYpO1xyXG5cclxuICAgIGggPSBhaDY7XHJcbiAgICBsID0gYWw2O1xyXG5cclxuICAgIGEgPSBsICYgMHhmZmZmOyBiID0gbCA+Pj4gMTY7XHJcbiAgICBjID0gaCAmIDB4ZmZmZjsgZCA9IGggPj4+IDE2O1xyXG5cclxuICAgIGggPSBoaFs2XTtcclxuICAgIGwgPSBobFs2XTtcclxuXHJcbiAgICBhICs9IGwgJiAweGZmZmY7IGIgKz0gbCA+Pj4gMTY7XHJcbiAgICBjICs9IGggJiAweGZmZmY7IGQgKz0gaCA+Pj4gMTY7XHJcblxyXG4gICAgYiArPSBhID4+PiAxNjtcclxuICAgIGMgKz0gYiA+Pj4gMTY7XHJcbiAgICBkICs9IGMgPj4+IDE2O1xyXG5cclxuICAgIGhoWzZdID0gYWg2ID0gKGMgJiAweGZmZmYpIHwgKGQgPDwgMTYpO1xyXG4gICAgaGxbNl0gPSBhbDYgPSAoYSAmIDB4ZmZmZikgfCAoYiA8PCAxNik7XHJcblxyXG4gICAgaCA9IGFoNztcclxuICAgIGwgPSBhbDc7XHJcblxyXG4gICAgYSA9IGwgJiAweGZmZmY7IGIgPSBsID4+PiAxNjtcclxuICAgIGMgPSBoICYgMHhmZmZmOyBkID0gaCA+Pj4gMTY7XHJcblxyXG4gICAgaCA9IGhoWzddO1xyXG4gICAgbCA9IGhsWzddO1xyXG5cclxuICAgIGEgKz0gbCAmIDB4ZmZmZjsgYiArPSBsID4+PiAxNjtcclxuICAgIGMgKz0gaCAmIDB4ZmZmZjsgZCArPSBoID4+PiAxNjtcclxuXHJcbiAgICBiICs9IGEgPj4+IDE2O1xyXG4gICAgYyArPSBiID4+PiAxNjtcclxuICAgIGQgKz0gYyA+Pj4gMTY7XHJcblxyXG4gICAgaGhbN10gPSBhaDcgPSAoYyAmIDB4ZmZmZikgfCAoZCA8PCAxNik7XHJcbiAgICBobFs3XSA9IGFsNyA9IChhICYgMHhmZmZmKSB8IChiIDw8IDE2KTtcclxuXHJcbiAgICBwb3MgKz0gMTI4O1xyXG4gICAgbiAtPSAxMjg7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gbjtcclxufVxyXG5cclxuZnVuY3Rpb24gY3J5cHRvX2hhc2gob3V0LCBtLCBuKSB7XHJcbiAgdmFyIGhoID0gbmV3IEludDMyQXJyYXkoOCksXHJcbiAgICAgIGhsID0gbmV3IEludDMyQXJyYXkoOCksXHJcbiAgICAgIHggPSBuZXcgVWludDhBcnJheSgyNTYpLFxyXG4gICAgICBpLCBiID0gbjtcclxuXHJcbiAgaGhbMF0gPSAweDZhMDllNjY3O1xyXG4gIGhoWzFdID0gMHhiYjY3YWU4NTtcclxuICBoaFsyXSA9IDB4M2M2ZWYzNzI7XHJcbiAgaGhbM10gPSAweGE1NGZmNTNhO1xyXG4gIGhoWzRdID0gMHg1MTBlNTI3ZjtcclxuICBoaFs1XSA9IDB4OWIwNTY4OGM7XHJcbiAgaGhbNl0gPSAweDFmODNkOWFiO1xyXG4gIGhoWzddID0gMHg1YmUwY2QxOTtcclxuXHJcbiAgaGxbMF0gPSAweGYzYmNjOTA4O1xyXG4gIGhsWzFdID0gMHg4NGNhYTczYjtcclxuICBobFsyXSA9IDB4ZmU5NGY4MmI7XHJcbiAgaGxbM10gPSAweDVmMWQzNmYxO1xyXG4gIGhsWzRdID0gMHhhZGU2ODJkMTtcclxuICBobFs1XSA9IDB4MmIzZTZjMWY7XHJcbiAgaGxbNl0gPSAweGZiNDFiZDZiO1xyXG4gIGhsWzddID0gMHgxMzdlMjE3OTtcclxuXHJcbiAgY3J5cHRvX2hhc2hibG9ja3NfaGwoaGgsIGhsLCBtLCBuKTtcclxuICBuICU9IDEyODtcclxuXHJcbiAgZm9yIChpID0gMDsgaSA8IG47IGkrKykgeFtpXSA9IG1bYi1uK2ldO1xyXG4gIHhbbl0gPSAxMjg7XHJcblxyXG4gIG4gPSAyNTYtMTI4KihuPDExMj8xOjApO1xyXG4gIHhbbi05XSA9IDA7XHJcbiAgdHM2NCh4LCBuLTgsICAoYiAvIDB4MjAwMDAwMDApIHwgMCwgYiA8PCAzKTtcclxuICBjcnlwdG9faGFzaGJsb2Nrc19obChoaCwgaGwsIHgsIG4pO1xyXG5cclxuICBmb3IgKGkgPSAwOyBpIDwgODsgaSsrKSB0czY0KG91dCwgOCppLCBoaFtpXSwgaGxbaV0pO1xyXG5cclxuICByZXR1cm4gMDtcclxufVxyXG5cclxuZnVuY3Rpb24gYWRkKHAsIHEpIHtcclxuICB2YXIgYSA9IGdmKCksIGIgPSBnZigpLCBjID0gZ2YoKSxcclxuICAgICAgZCA9IGdmKCksIGUgPSBnZigpLCBmID0gZ2YoKSxcclxuICAgICAgZyA9IGdmKCksIGggPSBnZigpLCB0ID0gZ2YoKTtcclxuXHJcbiAgWihhLCBwWzFdLCBwWzBdKTtcclxuICBaKHQsIHFbMV0sIHFbMF0pO1xyXG4gIE0oYSwgYSwgdCk7XHJcbiAgQShiLCBwWzBdLCBwWzFdKTtcclxuICBBKHQsIHFbMF0sIHFbMV0pO1xyXG4gIE0oYiwgYiwgdCk7XHJcbiAgTShjLCBwWzNdLCBxWzNdKTtcclxuICBNKGMsIGMsIEQyKTtcclxuICBNKGQsIHBbMl0sIHFbMl0pO1xyXG4gIEEoZCwgZCwgZCk7XHJcbiAgWihlLCBiLCBhKTtcclxuICBaKGYsIGQsIGMpO1xyXG4gIEEoZywgZCwgYyk7XHJcbiAgQShoLCBiLCBhKTtcclxuXHJcbiAgTShwWzBdLCBlLCBmKTtcclxuICBNKHBbMV0sIGgsIGcpO1xyXG4gIE0ocFsyXSwgZywgZik7XHJcbiAgTShwWzNdLCBlLCBoKTtcclxufVxyXG5cclxuZnVuY3Rpb24gY3N3YXAocCwgcSwgYikge1xyXG4gIHZhciBpO1xyXG4gIGZvciAoaSA9IDA7IGkgPCA0OyBpKyspIHtcclxuICAgIHNlbDI1NTE5KHBbaV0sIHFbaV0sIGIpO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gcGFjayhyLCBwKSB7XHJcbiAgdmFyIHR4ID0gZ2YoKSwgdHkgPSBnZigpLCB6aSA9IGdmKCk7XHJcbiAgaW52MjU1MTkoemksIHBbMl0pO1xyXG4gIE0odHgsIHBbMF0sIHppKTtcclxuICBNKHR5LCBwWzFdLCB6aSk7XHJcbiAgcGFjazI1NTE5KHIsIHR5KTtcclxuICByWzMxXSBePSBwYXIyNTUxOSh0eCkgPDwgNztcclxufVxyXG5cclxuZnVuY3Rpb24gc2NhbGFybXVsdChwLCBxLCBzKSB7XHJcbiAgdmFyIGIsIGk7XHJcbiAgc2V0MjU1MTkocFswXSwgZ2YwKTtcclxuICBzZXQyNTUxOShwWzFdLCBnZjEpO1xyXG4gIHNldDI1NTE5KHBbMl0sIGdmMSk7XHJcbiAgc2V0MjU1MTkocFszXSwgZ2YwKTtcclxuICBmb3IgKGkgPSAyNTU7IGkgPj0gMDsgLS1pKSB7XHJcbiAgICBiID0gKHNbKGkvOCl8MF0gPj4gKGkmNykpICYgMTtcclxuICAgIGNzd2FwKHAsIHEsIGIpO1xyXG4gICAgYWRkKHEsIHApO1xyXG4gICAgYWRkKHAsIHApO1xyXG4gICAgY3N3YXAocCwgcSwgYik7XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBzY2FsYXJiYXNlKHAsIHMpIHtcclxuICB2YXIgcSA9IFtnZigpLCBnZigpLCBnZigpLCBnZigpXTtcclxuICBzZXQyNTUxOShxWzBdLCBYKTtcclxuICBzZXQyNTUxOShxWzFdLCBZKTtcclxuICBzZXQyNTUxOShxWzJdLCBnZjEpO1xyXG4gIE0ocVszXSwgWCwgWSk7XHJcbiAgc2NhbGFybXVsdChwLCBxLCBzKTtcclxufVxyXG5cclxuZnVuY3Rpb24gY3J5cHRvX3NpZ25fa2V5cGFpcihwaywgc2ssIHNlZWRlZCkge1xyXG4gIHZhciBkID0gbmV3IFVpbnQ4QXJyYXkoNjQpO1xyXG4gIHZhciBwID0gW2dmKCksIGdmKCksIGdmKCksIGdmKCldO1xyXG4gIHZhciBpO1xyXG5cclxuICBpZiAoIXNlZWRlZCkgcmFuZG9tYnl0ZXMoc2ssIDMyKTtcclxuICBjcnlwdG9faGFzaChkLCBzaywgMzIpO1xyXG4gIGRbMF0gJj0gMjQ4O1xyXG4gIGRbMzFdICY9IDEyNztcclxuICBkWzMxXSB8PSA2NDtcclxuXHJcbiAgc2NhbGFyYmFzZShwLCBkKTtcclxuICBwYWNrKHBrLCBwKTtcclxuXHJcbiAgZm9yIChpID0gMDsgaSA8IDMyOyBpKyspIHNrW2krMzJdID0gcGtbaV07XHJcbiAgcmV0dXJuIDA7XHJcbn1cclxuXHJcbnZhciBMID0gbmV3IEZsb2F0NjRBcnJheShbMHhlZCwgMHhkMywgMHhmNSwgMHg1YywgMHgxYSwgMHg2MywgMHgxMiwgMHg1OCwgMHhkNiwgMHg5YywgMHhmNywgMHhhMiwgMHhkZSwgMHhmOSwgMHhkZSwgMHgxNCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMHgxMF0pO1xyXG5cclxuZnVuY3Rpb24gbW9kTChyLCB4KSB7XHJcbiAgdmFyIGNhcnJ5LCBpLCBqLCBrO1xyXG4gIGZvciAoaSA9IDYzOyBpID49IDMyOyAtLWkpIHtcclxuICAgIGNhcnJ5ID0gMDtcclxuICAgIGZvciAoaiA9IGkgLSAzMiwgayA9IGkgLSAxMjsgaiA8IGs7ICsraikge1xyXG4gICAgICB4W2pdICs9IGNhcnJ5IC0gMTYgKiB4W2ldICogTFtqIC0gKGkgLSAzMildO1xyXG4gICAgICBjYXJyeSA9ICh4W2pdICsgMTI4KSA+PiA4O1xyXG4gICAgICB4W2pdIC09IGNhcnJ5ICogMjU2O1xyXG4gICAgfVxyXG4gICAgeFtqXSArPSBjYXJyeTtcclxuICAgIHhbaV0gPSAwO1xyXG4gIH1cclxuICBjYXJyeSA9IDA7XHJcbiAgZm9yIChqID0gMDsgaiA8IDMyOyBqKyspIHtcclxuICAgIHhbal0gKz0gY2FycnkgLSAoeFszMV0gPj4gNCkgKiBMW2pdO1xyXG4gICAgY2FycnkgPSB4W2pdID4+IDg7XHJcbiAgICB4W2pdICY9IDI1NTtcclxuICB9XHJcbiAgZm9yIChqID0gMDsgaiA8IDMyOyBqKyspIHhbal0gLT0gY2FycnkgKiBMW2pdO1xyXG4gIGZvciAoaSA9IDA7IGkgPCAzMjsgaSsrKSB7XHJcbiAgICB4W2krMV0gKz0geFtpXSA+PiA4O1xyXG4gICAgcltpXSA9IHhbaV0gJiAyNTU7XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiByZWR1Y2Uocikge1xyXG4gIHZhciB4ID0gbmV3IEZsb2F0NjRBcnJheSg2NCksIGk7XHJcbiAgZm9yIChpID0gMDsgaSA8IDY0OyBpKyspIHhbaV0gPSByW2ldO1xyXG4gIGZvciAoaSA9IDA7IGkgPCA2NDsgaSsrKSByW2ldID0gMDtcclxuICBtb2RMKHIsIHgpO1xyXG59XHJcblxyXG4vLyBOb3RlOiBkaWZmZXJlbmNlIGZyb20gQyAtIHNtbGVuIHJldHVybmVkLCBub3QgcGFzc2VkIGFzIGFyZ3VtZW50LlxyXG5mdW5jdGlvbiBjcnlwdG9fc2lnbihzbSwgbSwgbiwgc2spIHtcclxuICB2YXIgZCA9IG5ldyBVaW50OEFycmF5KDY0KSwgaCA9IG5ldyBVaW50OEFycmF5KDY0KSwgciA9IG5ldyBVaW50OEFycmF5KDY0KTtcclxuICB2YXIgaSwgaiwgeCA9IG5ldyBGbG9hdDY0QXJyYXkoNjQpO1xyXG4gIHZhciBwID0gW2dmKCksIGdmKCksIGdmKCksIGdmKCldO1xyXG5cclxuICBjcnlwdG9faGFzaChkLCBzaywgMzIpO1xyXG4gIGRbMF0gJj0gMjQ4O1xyXG4gIGRbMzFdICY9IDEyNztcclxuICBkWzMxXSB8PSA2NDtcclxuXHJcbiAgdmFyIHNtbGVuID0gbiArIDY0O1xyXG4gIGZvciAoaSA9IDA7IGkgPCBuOyBpKyspIHNtWzY0ICsgaV0gPSBtW2ldO1xyXG4gIGZvciAoaSA9IDA7IGkgPCAzMjsgaSsrKSBzbVszMiArIGldID0gZFszMiArIGldO1xyXG5cclxuICBjcnlwdG9faGFzaChyLCBzbS5zdWJhcnJheSgzMiksIG4rMzIpO1xyXG4gIHJlZHVjZShyKTtcclxuICBzY2FsYXJiYXNlKHAsIHIpO1xyXG4gIHBhY2soc20sIHApO1xyXG5cclxuICBmb3IgKGkgPSAzMjsgaSA8IDY0OyBpKyspIHNtW2ldID0gc2tbaV07XHJcbiAgY3J5cHRvX2hhc2goaCwgc20sIG4gKyA2NCk7XHJcbiAgcmVkdWNlKGgpO1xyXG5cclxuICBmb3IgKGkgPSAwOyBpIDwgNjQ7IGkrKykgeFtpXSA9IDA7XHJcbiAgZm9yIChpID0gMDsgaSA8IDMyOyBpKyspIHhbaV0gPSByW2ldO1xyXG4gIGZvciAoaSA9IDA7IGkgPCAzMjsgaSsrKSB7XHJcbiAgICBmb3IgKGogPSAwOyBqIDwgMzI7IGorKykge1xyXG4gICAgICB4W2kral0gKz0gaFtpXSAqIGRbal07XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBtb2RMKHNtLnN1YmFycmF5KDMyKSwgeCk7XHJcbiAgcmV0dXJuIHNtbGVuO1xyXG59XHJcblxyXG5mdW5jdGlvbiB1bnBhY2tuZWcociwgcCkge1xyXG4gIHZhciB0ID0gZ2YoKSwgY2hrID0gZ2YoKSwgbnVtID0gZ2YoKSxcclxuICAgICAgZGVuID0gZ2YoKSwgZGVuMiA9IGdmKCksIGRlbjQgPSBnZigpLFxyXG4gICAgICBkZW42ID0gZ2YoKTtcclxuXHJcbiAgc2V0MjU1MTkoclsyXSwgZ2YxKTtcclxuICB1bnBhY2syNTUxOShyWzFdLCBwKTtcclxuICBTKG51bSwgclsxXSk7XHJcbiAgTShkZW4sIG51bSwgRCk7XHJcbiAgWihudW0sIG51bSwgclsyXSk7XHJcbiAgQShkZW4sIHJbMl0sIGRlbik7XHJcblxyXG4gIFMoZGVuMiwgZGVuKTtcclxuICBTKGRlbjQsIGRlbjIpO1xyXG4gIE0oZGVuNiwgZGVuNCwgZGVuMik7XHJcbiAgTSh0LCBkZW42LCBudW0pO1xyXG4gIE0odCwgdCwgZGVuKTtcclxuXHJcbiAgcG93MjUyMyh0LCB0KTtcclxuICBNKHQsIHQsIG51bSk7XHJcbiAgTSh0LCB0LCBkZW4pO1xyXG4gIE0odCwgdCwgZGVuKTtcclxuICBNKHJbMF0sIHQsIGRlbik7XHJcblxyXG4gIFMoY2hrLCByWzBdKTtcclxuICBNKGNoaywgY2hrLCBkZW4pO1xyXG4gIGlmIChuZXEyNTUxOShjaGssIG51bSkpIE0oclswXSwgclswXSwgSSk7XHJcblxyXG4gIFMoY2hrLCByWzBdKTtcclxuICBNKGNoaywgY2hrLCBkZW4pO1xyXG4gIGlmIChuZXEyNTUxOShjaGssIG51bSkpIHJldHVybiAtMTtcclxuXHJcbiAgaWYgKHBhcjI1NTE5KHJbMF0pID09PSAocFszMV0+PjcpKSBaKHJbMF0sIGdmMCwgclswXSk7XHJcblxyXG4gIE0oclszXSwgclswXSwgclsxXSk7XHJcbiAgcmV0dXJuIDA7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyeXB0b19zaWduX29wZW4obSwgc20sIG4sIHBrKSB7XHJcbiAgdmFyIGksIG1sZW47XHJcbiAgdmFyIHQgPSBuZXcgVWludDhBcnJheSgzMiksIGggPSBuZXcgVWludDhBcnJheSg2NCk7XHJcbiAgdmFyIHAgPSBbZ2YoKSwgZ2YoKSwgZ2YoKSwgZ2YoKV0sXHJcbiAgICAgIHEgPSBbZ2YoKSwgZ2YoKSwgZ2YoKSwgZ2YoKV07XHJcblxyXG4gIG1sZW4gPSAtMTtcclxuICBpZiAobiA8IDY0KSByZXR1cm4gLTE7XHJcblxyXG4gIGlmICh1bnBhY2tuZWcocSwgcGspKSByZXR1cm4gLTE7XHJcblxyXG4gIGZvciAoaSA9IDA7IGkgPCBuOyBpKyspIG1baV0gPSBzbVtpXTtcclxuICBmb3IgKGkgPSAwOyBpIDwgMzI7IGkrKykgbVtpKzMyXSA9IHBrW2ldO1xyXG4gIGNyeXB0b19oYXNoKGgsIG0sIG4pO1xyXG4gIHJlZHVjZShoKTtcclxuICBzY2FsYXJtdWx0KHAsIHEsIGgpO1xyXG5cclxuICBzY2FsYXJiYXNlKHEsIHNtLnN1YmFycmF5KDMyKSk7XHJcbiAgYWRkKHAsIHEpO1xyXG4gIHBhY2sodCwgcCk7XHJcblxyXG4gIG4gLT0gNjQ7XHJcbiAgaWYgKGNyeXB0b192ZXJpZnlfMzIoc20sIDAsIHQsIDApKSB7XHJcbiAgICBmb3IgKGkgPSAwOyBpIDwgbjsgaSsrKSBtW2ldID0gMDtcclxuICAgIHJldHVybiAtMTtcclxuICB9XHJcblxyXG4gIGZvciAoaSA9IDA7IGkgPCBuOyBpKyspIG1baV0gPSBzbVtpICsgNjRdO1xyXG4gIG1sZW4gPSBuO1xyXG4gIHJldHVybiBtbGVuO1xyXG59XHJcblxyXG52YXIgY3J5cHRvX3NlY3JldGJveF9LRVlCWVRFUyA9IDMyLFxyXG4gICAgY3J5cHRvX3NlY3JldGJveF9OT05DRUJZVEVTID0gMjQsXHJcbiAgICBjcnlwdG9fc2VjcmV0Ym94X1pFUk9CWVRFUyA9IDMyLFxyXG4gICAgY3J5cHRvX3NlY3JldGJveF9CT1haRVJPQllURVMgPSAxNixcclxuICAgIGNyeXB0b19zY2FsYXJtdWx0X0JZVEVTID0gMzIsXHJcbiAgICBjcnlwdG9fc2NhbGFybXVsdF9TQ0FMQVJCWVRFUyA9IDMyLFxyXG4gICAgY3J5cHRvX2JveF9QVUJMSUNLRVlCWVRFUyA9IDMyLFxyXG4gICAgY3J5cHRvX2JveF9TRUNSRVRLRVlCWVRFUyA9IDMyLFxyXG4gICAgY3J5cHRvX2JveF9CRUZPUkVOTUJZVEVTID0gMzIsXHJcbiAgICBjcnlwdG9fYm94X05PTkNFQllURVMgPSBjcnlwdG9fc2VjcmV0Ym94X05PTkNFQllURVMsXHJcbiAgICBjcnlwdG9fYm94X1pFUk9CWVRFUyA9IGNyeXB0b19zZWNyZXRib3hfWkVST0JZVEVTLFxyXG4gICAgY3J5cHRvX2JveF9CT1haRVJPQllURVMgPSBjcnlwdG9fc2VjcmV0Ym94X0JPWFpFUk9CWVRFUyxcclxuICAgIGNyeXB0b19zaWduX0JZVEVTID0gNjQsXHJcbiAgICBjcnlwdG9fc2lnbl9QVUJMSUNLRVlCWVRFUyA9IDMyLFxyXG4gICAgY3J5cHRvX3NpZ25fU0VDUkVUS0VZQllURVMgPSA2NCxcclxuICAgIGNyeXB0b19zaWduX1NFRURCWVRFUyA9IDMyLFxyXG4gICAgY3J5cHRvX2hhc2hfQllURVMgPSA2NDtcclxuXHJcbm5hY2wubG93bGV2ZWwgPSB7XHJcbiAgY3J5cHRvX2NvcmVfaHNhbHNhMjA6IGNyeXB0b19jb3JlX2hzYWxzYTIwLFxyXG4gIGNyeXB0b19zdHJlYW1feG9yOiBjcnlwdG9fc3RyZWFtX3hvcixcclxuICBjcnlwdG9fc3RyZWFtOiBjcnlwdG9fc3RyZWFtLFxyXG4gIGNyeXB0b19zdHJlYW1fc2Fsc2EyMF94b3I6IGNyeXB0b19zdHJlYW1fc2Fsc2EyMF94b3IsXHJcbiAgY3J5cHRvX3N0cmVhbV9zYWxzYTIwOiBjcnlwdG9fc3RyZWFtX3NhbHNhMjAsXHJcbiAgY3J5cHRvX29uZXRpbWVhdXRoOiBjcnlwdG9fb25ldGltZWF1dGgsXHJcbiAgY3J5cHRvX29uZXRpbWVhdXRoX3ZlcmlmeTogY3J5cHRvX29uZXRpbWVhdXRoX3ZlcmlmeSxcclxuICBjcnlwdG9fdmVyaWZ5XzE2OiBjcnlwdG9fdmVyaWZ5XzE2LFxyXG4gIGNyeXB0b192ZXJpZnlfMzI6IGNyeXB0b192ZXJpZnlfMzIsXHJcbiAgY3J5cHRvX3NlY3JldGJveDogY3J5cHRvX3NlY3JldGJveCxcclxuICBjcnlwdG9fc2VjcmV0Ym94X29wZW46IGNyeXB0b19zZWNyZXRib3hfb3BlbixcclxuICBjcnlwdG9fc2NhbGFybXVsdDogY3J5cHRvX3NjYWxhcm11bHQsXHJcbiAgY3J5cHRvX3NjYWxhcm11bHRfYmFzZTogY3J5cHRvX3NjYWxhcm11bHRfYmFzZSxcclxuICBjcnlwdG9fYm94X2JlZm9yZW5tOiBjcnlwdG9fYm94X2JlZm9yZW5tLFxyXG4gIGNyeXB0b19ib3hfYWZ0ZXJubTogY3J5cHRvX2JveF9hZnRlcm5tLFxyXG4gIGNyeXB0b19ib3g6IGNyeXB0b19ib3gsXHJcbiAgY3J5cHRvX2JveF9vcGVuOiBjcnlwdG9fYm94X29wZW4sXHJcbiAgY3J5cHRvX2JveF9rZXlwYWlyOiBjcnlwdG9fYm94X2tleXBhaXIsXHJcbiAgY3J5cHRvX2hhc2g6IGNyeXB0b19oYXNoLFxyXG4gIGNyeXB0b19zaWduOiBjcnlwdG9fc2lnbixcclxuICBjcnlwdG9fc2lnbl9rZXlwYWlyOiBjcnlwdG9fc2lnbl9rZXlwYWlyLFxyXG4gIGNyeXB0b19zaWduX29wZW46IGNyeXB0b19zaWduX29wZW4sXHJcblxyXG4gIGNyeXB0b19zZWNyZXRib3hfS0VZQllURVM6IGNyeXB0b19zZWNyZXRib3hfS0VZQllURVMsXHJcbiAgY3J5cHRvX3NlY3JldGJveF9OT05DRUJZVEVTOiBjcnlwdG9fc2VjcmV0Ym94X05PTkNFQllURVMsXHJcbiAgY3J5cHRvX3NlY3JldGJveF9aRVJPQllURVM6IGNyeXB0b19zZWNyZXRib3hfWkVST0JZVEVTLFxyXG4gIGNyeXB0b19zZWNyZXRib3hfQk9YWkVST0JZVEVTOiBjcnlwdG9fc2VjcmV0Ym94X0JPWFpFUk9CWVRFUyxcclxuICBjcnlwdG9fc2NhbGFybXVsdF9CWVRFUzogY3J5cHRvX3NjYWxhcm11bHRfQllURVMsXHJcbiAgY3J5cHRvX3NjYWxhcm11bHRfU0NBTEFSQllURVM6IGNyeXB0b19zY2FsYXJtdWx0X1NDQUxBUkJZVEVTLFxyXG4gIGNyeXB0b19ib3hfUFVCTElDS0VZQllURVM6IGNyeXB0b19ib3hfUFVCTElDS0VZQllURVMsXHJcbiAgY3J5cHRvX2JveF9TRUNSRVRLRVlCWVRFUzogY3J5cHRvX2JveF9TRUNSRVRLRVlCWVRFUyxcclxuICBjcnlwdG9fYm94X0JFRk9SRU5NQllURVM6IGNyeXB0b19ib3hfQkVGT1JFTk1CWVRFUyxcclxuICBjcnlwdG9fYm94X05PTkNFQllURVM6IGNyeXB0b19ib3hfTk9OQ0VCWVRFUyxcclxuICBjcnlwdG9fYm94X1pFUk9CWVRFUzogY3J5cHRvX2JveF9aRVJPQllURVMsXHJcbiAgY3J5cHRvX2JveF9CT1haRVJPQllURVM6IGNyeXB0b19ib3hfQk9YWkVST0JZVEVTLFxyXG4gIGNyeXB0b19zaWduX0JZVEVTOiBjcnlwdG9fc2lnbl9CWVRFUyxcclxuICBjcnlwdG9fc2lnbl9QVUJMSUNLRVlCWVRFUzogY3J5cHRvX3NpZ25fUFVCTElDS0VZQllURVMsXHJcbiAgY3J5cHRvX3NpZ25fU0VDUkVUS0VZQllURVM6IGNyeXB0b19zaWduX1NFQ1JFVEtFWUJZVEVTLFxyXG4gIGNyeXB0b19zaWduX1NFRURCWVRFUzogY3J5cHRvX3NpZ25fU0VFREJZVEVTLFxyXG4gIGNyeXB0b19oYXNoX0JZVEVTOiBjcnlwdG9faGFzaF9CWVRFU1xyXG59O1xyXG5cclxuLyogSGlnaC1sZXZlbCBBUEkgKi9cclxuXHJcbmZ1bmN0aW9uIGNoZWNrTGVuZ3RocyhrLCBuKSB7XHJcbiAgaWYgKGsubGVuZ3RoICE9PSBjcnlwdG9fc2VjcmV0Ym94X0tFWUJZVEVTKSB0aHJvdyBuZXcgRXJyb3IoJ2JhZCBrZXkgc2l6ZScpO1xyXG4gIGlmIChuLmxlbmd0aCAhPT0gY3J5cHRvX3NlY3JldGJveF9OT05DRUJZVEVTKSB0aHJvdyBuZXcgRXJyb3IoJ2JhZCBub25jZSBzaXplJyk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNoZWNrQm94TGVuZ3Rocyhwaywgc2spIHtcclxuICBpZiAocGsubGVuZ3RoICE9PSBjcnlwdG9fYm94X1BVQkxJQ0tFWUJZVEVTKSB0aHJvdyBuZXcgRXJyb3IoJ2JhZCBwdWJsaWMga2V5IHNpemUnKTtcclxuICBpZiAoc2subGVuZ3RoICE9PSBjcnlwdG9fYm94X1NFQ1JFVEtFWUJZVEVTKSB0aHJvdyBuZXcgRXJyb3IoJ2JhZCBzZWNyZXQga2V5IHNpemUnKTtcclxufVxyXG5cclxuZnVuY3Rpb24gY2hlY2tBcnJheVR5cGVzKCkge1xyXG4gIHZhciB0LCBpO1xyXG4gIGZvciAoaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcclxuICAgICBpZiAoKHQgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYXJndW1lbnRzW2ldKSkgIT09ICdbb2JqZWN0IFVpbnQ4QXJyYXldJylcclxuICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ3VuZXhwZWN0ZWQgdHlwZSAnICsgdCArICcsIHVzZSBVaW50OEFycmF5Jyk7XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBjbGVhbnVwKGFycikge1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSBhcnJbaV0gPSAwO1xyXG59XHJcblxyXG4vLyBUT0RPOiBDb21wbGV0ZWx5IHJlbW92ZSB0aGlzIGluIHYwLjE1LlxyXG5pZiAoIW5hY2wudXRpbCkge1xyXG4gIG5hY2wudXRpbCA9IHt9O1xyXG4gIG5hY2wudXRpbC5kZWNvZGVVVEY4ID0gbmFjbC51dGlsLmVuY29kZVVURjggPSBuYWNsLnV0aWwuZW5jb2RlQmFzZTY0ID0gbmFjbC51dGlsLmRlY29kZUJhc2U2NCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCduYWNsLnV0aWwgbW92ZWQgaW50byBzZXBhcmF0ZSBwYWNrYWdlOiBodHRwczovL2dpdGh1Yi5jb20vZGNoZXN0L3R3ZWV0bmFjbC11dGlsLWpzJyk7XHJcbiAgfTtcclxufVxyXG5cclxubmFjbC5yYW5kb21CeXRlcyA9IGZ1bmN0aW9uKG4pIHtcclxuICB2YXIgYiA9IG5ldyBVaW50OEFycmF5KG4pO1xyXG4gIHJhbmRvbWJ5dGVzKGIsIG4pO1xyXG4gIHJldHVybiBiO1xyXG59O1xyXG5cclxubmFjbC5zZWNyZXRib3ggPSBmdW5jdGlvbihtc2csIG5vbmNlLCBrZXkpIHtcclxuICBjaGVja0FycmF5VHlwZXMobXNnLCBub25jZSwga2V5KTtcclxuICBjaGVja0xlbmd0aHMoa2V5LCBub25jZSk7XHJcbiAgdmFyIG0gPSBuZXcgVWludDhBcnJheShjcnlwdG9fc2VjcmV0Ym94X1pFUk9CWVRFUyArIG1zZy5sZW5ndGgpO1xyXG4gIHZhciBjID0gbmV3IFVpbnQ4QXJyYXkobS5sZW5ndGgpO1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbXNnLmxlbmd0aDsgaSsrKSBtW2krY3J5cHRvX3NlY3JldGJveF9aRVJPQllURVNdID0gbXNnW2ldO1xyXG4gIGNyeXB0b19zZWNyZXRib3goYywgbSwgbS5sZW5ndGgsIG5vbmNlLCBrZXkpO1xyXG4gIHJldHVybiBjLnN1YmFycmF5KGNyeXB0b19zZWNyZXRib3hfQk9YWkVST0JZVEVTKTtcclxufTtcclxuXHJcbm5hY2wuc2VjcmV0Ym94Lm9wZW4gPSBmdW5jdGlvbihib3gsIG5vbmNlLCBrZXkpIHtcclxuICBjaGVja0FycmF5VHlwZXMoYm94LCBub25jZSwga2V5KTtcclxuICBjaGVja0xlbmd0aHMoa2V5LCBub25jZSk7XHJcbiAgdmFyIGMgPSBuZXcgVWludDhBcnJheShjcnlwdG9fc2VjcmV0Ym94X0JPWFpFUk9CWVRFUyArIGJveC5sZW5ndGgpO1xyXG4gIHZhciBtID0gbmV3IFVpbnQ4QXJyYXkoYy5sZW5ndGgpO1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYm94Lmxlbmd0aDsgaSsrKSBjW2krY3J5cHRvX3NlY3JldGJveF9CT1haRVJPQllURVNdID0gYm94W2ldO1xyXG4gIGlmIChjLmxlbmd0aCA8IDMyKSByZXR1cm4gZmFsc2U7XHJcbiAgaWYgKGNyeXB0b19zZWNyZXRib3hfb3BlbihtLCBjLCBjLmxlbmd0aCwgbm9uY2UsIGtleSkgIT09IDApIHJldHVybiBmYWxzZTtcclxuICByZXR1cm4gbS5zdWJhcnJheShjcnlwdG9fc2VjcmV0Ym94X1pFUk9CWVRFUyk7XHJcbn07XHJcblxyXG5uYWNsLnNlY3JldGJveC5rZXlMZW5ndGggPSBjcnlwdG9fc2VjcmV0Ym94X0tFWUJZVEVTO1xyXG5uYWNsLnNlY3JldGJveC5ub25jZUxlbmd0aCA9IGNyeXB0b19zZWNyZXRib3hfTk9OQ0VCWVRFUztcclxubmFjbC5zZWNyZXRib3gub3ZlcmhlYWRMZW5ndGggPSBjcnlwdG9fc2VjcmV0Ym94X0JPWFpFUk9CWVRFUztcclxuXHJcbm5hY2wuc2NhbGFyTXVsdCA9IGZ1bmN0aW9uKG4sIHApIHtcclxuICBjaGVja0FycmF5VHlwZXMobiwgcCk7XHJcbiAgaWYgKG4ubGVuZ3RoICE9PSBjcnlwdG9fc2NhbGFybXVsdF9TQ0FMQVJCWVRFUykgdGhyb3cgbmV3IEVycm9yKCdiYWQgbiBzaXplJyk7XHJcbiAgaWYgKHAubGVuZ3RoICE9PSBjcnlwdG9fc2NhbGFybXVsdF9CWVRFUykgdGhyb3cgbmV3IEVycm9yKCdiYWQgcCBzaXplJyk7XHJcbiAgdmFyIHEgPSBuZXcgVWludDhBcnJheShjcnlwdG9fc2NhbGFybXVsdF9CWVRFUyk7XHJcbiAgY3J5cHRvX3NjYWxhcm11bHQocSwgbiwgcCk7XHJcbiAgcmV0dXJuIHE7XHJcbn07XHJcblxyXG5uYWNsLnNjYWxhck11bHQuYmFzZSA9IGZ1bmN0aW9uKG4pIHtcclxuICBjaGVja0FycmF5VHlwZXMobik7XHJcbiAgaWYgKG4ubGVuZ3RoICE9PSBjcnlwdG9fc2NhbGFybXVsdF9TQ0FMQVJCWVRFUykgdGhyb3cgbmV3IEVycm9yKCdiYWQgbiBzaXplJyk7XHJcbiAgdmFyIHEgPSBuZXcgVWludDhBcnJheShjcnlwdG9fc2NhbGFybXVsdF9CWVRFUyk7XHJcbiAgY3J5cHRvX3NjYWxhcm11bHRfYmFzZShxLCBuKTtcclxuICByZXR1cm4gcTtcclxufTtcclxuXHJcbm5hY2wuc2NhbGFyTXVsdC5zY2FsYXJMZW5ndGggPSBjcnlwdG9fc2NhbGFybXVsdF9TQ0FMQVJCWVRFUztcclxubmFjbC5zY2FsYXJNdWx0Lmdyb3VwRWxlbWVudExlbmd0aCA9IGNyeXB0b19zY2FsYXJtdWx0X0JZVEVTO1xyXG5cclxubmFjbC5ib3ggPSBmdW5jdGlvbihtc2csIG5vbmNlLCBwdWJsaWNLZXksIHNlY3JldEtleSkge1xyXG4gIHZhciBrID0gbmFjbC5ib3guYmVmb3JlKHB1YmxpY0tleSwgc2VjcmV0S2V5KTtcclxuICByZXR1cm4gbmFjbC5zZWNyZXRib3gobXNnLCBub25jZSwgayk7XHJcbn07XHJcblxyXG5uYWNsLmJveC5iZWZvcmUgPSBmdW5jdGlvbihwdWJsaWNLZXksIHNlY3JldEtleSkge1xyXG4gIGNoZWNrQXJyYXlUeXBlcyhwdWJsaWNLZXksIHNlY3JldEtleSk7XHJcbiAgY2hlY2tCb3hMZW5ndGhzKHB1YmxpY0tleSwgc2VjcmV0S2V5KTtcclxuICB2YXIgayA9IG5ldyBVaW50OEFycmF5KGNyeXB0b19ib3hfQkVGT1JFTk1CWVRFUyk7XHJcbiAgY3J5cHRvX2JveF9iZWZvcmVubShrLCBwdWJsaWNLZXksIHNlY3JldEtleSk7XHJcbiAgcmV0dXJuIGs7XHJcbn07XHJcblxyXG5uYWNsLmJveC5hZnRlciA9IG5hY2wuc2VjcmV0Ym94O1xyXG5cclxubmFjbC5ib3gub3BlbiA9IGZ1bmN0aW9uKG1zZywgbm9uY2UsIHB1YmxpY0tleSwgc2VjcmV0S2V5KSB7XHJcbiAgdmFyIGsgPSBuYWNsLmJveC5iZWZvcmUocHVibGljS2V5LCBzZWNyZXRLZXkpO1xyXG4gIHJldHVybiBuYWNsLnNlY3JldGJveC5vcGVuKG1zZywgbm9uY2UsIGspO1xyXG59O1xyXG5cclxubmFjbC5ib3gub3Blbi5hZnRlciA9IG5hY2wuc2VjcmV0Ym94Lm9wZW47XHJcblxyXG5uYWNsLmJveC5rZXlQYWlyID0gZnVuY3Rpb24oKSB7XHJcbiAgdmFyIHBrID0gbmV3IFVpbnQ4QXJyYXkoY3J5cHRvX2JveF9QVUJMSUNLRVlCWVRFUyk7XHJcbiAgdmFyIHNrID0gbmV3IFVpbnQ4QXJyYXkoY3J5cHRvX2JveF9TRUNSRVRLRVlCWVRFUyk7XHJcbiAgY3J5cHRvX2JveF9rZXlwYWlyKHBrLCBzayk7XHJcbiAgcmV0dXJuIHtwdWJsaWNLZXk6IHBrLCBzZWNyZXRLZXk6IHNrfTtcclxufTtcclxuXHJcbm5hY2wuYm94LmtleVBhaXIuZnJvbVNlY3JldEtleSA9IGZ1bmN0aW9uKHNlY3JldEtleSkge1xyXG4gIGNoZWNrQXJyYXlUeXBlcyhzZWNyZXRLZXkpO1xyXG4gIGlmIChzZWNyZXRLZXkubGVuZ3RoICE9PSBjcnlwdG9fYm94X1NFQ1JFVEtFWUJZVEVTKVxyXG4gICAgdGhyb3cgbmV3IEVycm9yKCdiYWQgc2VjcmV0IGtleSBzaXplJyk7XHJcbiAgdmFyIHBrID0gbmV3IFVpbnQ4QXJyYXkoY3J5cHRvX2JveF9QVUJMSUNLRVlCWVRFUyk7XHJcbiAgY3J5cHRvX3NjYWxhcm11bHRfYmFzZShwaywgc2VjcmV0S2V5KTtcclxuICByZXR1cm4ge3B1YmxpY0tleTogcGssIHNlY3JldEtleTogbmV3IFVpbnQ4QXJyYXkoc2VjcmV0S2V5KX07XHJcbn07XHJcblxyXG5uYWNsLmJveC5wdWJsaWNLZXlMZW5ndGggPSBjcnlwdG9fYm94X1BVQkxJQ0tFWUJZVEVTO1xyXG5uYWNsLmJveC5zZWNyZXRLZXlMZW5ndGggPSBjcnlwdG9fYm94X1NFQ1JFVEtFWUJZVEVTO1xyXG5uYWNsLmJveC5zaGFyZWRLZXlMZW5ndGggPSBjcnlwdG9fYm94X0JFRk9SRU5NQllURVM7XHJcbm5hY2wuYm94Lm5vbmNlTGVuZ3RoID0gY3J5cHRvX2JveF9OT05DRUJZVEVTO1xyXG5uYWNsLmJveC5vdmVyaGVhZExlbmd0aCA9IG5hY2wuc2VjcmV0Ym94Lm92ZXJoZWFkTGVuZ3RoO1xyXG5cclxubmFjbC5zaWduID0gZnVuY3Rpb24obXNnLCBzZWNyZXRLZXkpIHtcclxuICBjaGVja0FycmF5VHlwZXMobXNnLCBzZWNyZXRLZXkpO1xyXG4gIGlmIChzZWNyZXRLZXkubGVuZ3RoICE9PSBjcnlwdG9fc2lnbl9TRUNSRVRLRVlCWVRFUylcclxuICAgIHRocm93IG5ldyBFcnJvcignYmFkIHNlY3JldCBrZXkgc2l6ZScpO1xyXG4gIHZhciBzaWduZWRNc2cgPSBuZXcgVWludDhBcnJheShjcnlwdG9fc2lnbl9CWVRFUyttc2cubGVuZ3RoKTtcclxuICBjcnlwdG9fc2lnbihzaWduZWRNc2csIG1zZywgbXNnLmxlbmd0aCwgc2VjcmV0S2V5KTtcclxuICByZXR1cm4gc2lnbmVkTXNnO1xyXG59O1xyXG5cclxubmFjbC5zaWduLm9wZW4gPSBmdW5jdGlvbihzaWduZWRNc2csIHB1YmxpY0tleSkge1xyXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoICE9PSAyKVxyXG4gICAgdGhyb3cgbmV3IEVycm9yKCduYWNsLnNpZ24ub3BlbiBhY2NlcHRzIDIgYXJndW1lbnRzOyBkaWQgeW91IG1lYW4gdG8gdXNlIG5hY2wuc2lnbi5kZXRhY2hlZC52ZXJpZnk/Jyk7XHJcbiAgY2hlY2tBcnJheVR5cGVzKHNpZ25lZE1zZywgcHVibGljS2V5KTtcclxuICBpZiAocHVibGljS2V5Lmxlbmd0aCAhPT0gY3J5cHRvX3NpZ25fUFVCTElDS0VZQllURVMpXHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2JhZCBwdWJsaWMga2V5IHNpemUnKTtcclxuICB2YXIgdG1wID0gbmV3IFVpbnQ4QXJyYXkoc2lnbmVkTXNnLmxlbmd0aCk7XHJcbiAgdmFyIG1sZW4gPSBjcnlwdG9fc2lnbl9vcGVuKHRtcCwgc2lnbmVkTXNnLCBzaWduZWRNc2cubGVuZ3RoLCBwdWJsaWNLZXkpO1xyXG4gIGlmIChtbGVuIDwgMCkgcmV0dXJuIG51bGw7XHJcbiAgdmFyIG0gPSBuZXcgVWludDhBcnJheShtbGVuKTtcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IG0ubGVuZ3RoOyBpKyspIG1baV0gPSB0bXBbaV07XHJcbiAgcmV0dXJuIG07XHJcbn07XHJcblxyXG5uYWNsLnNpZ24uZGV0YWNoZWQgPSBmdW5jdGlvbihtc2csIHNlY3JldEtleSkge1xyXG4gIHZhciBzaWduZWRNc2cgPSBuYWNsLnNpZ24obXNnLCBzZWNyZXRLZXkpO1xyXG4gIHZhciBzaWcgPSBuZXcgVWludDhBcnJheShjcnlwdG9fc2lnbl9CWVRFUyk7XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzaWcubGVuZ3RoOyBpKyspIHNpZ1tpXSA9IHNpZ25lZE1zZ1tpXTtcclxuICByZXR1cm4gc2lnO1xyXG59O1xyXG5cclxubmFjbC5zaWduLmRldGFjaGVkLnZlcmlmeSA9IGZ1bmN0aW9uKG1zZywgc2lnLCBwdWJsaWNLZXkpIHtcclxuICBjaGVja0FycmF5VHlwZXMobXNnLCBzaWcsIHB1YmxpY0tleSk7XHJcbiAgaWYgKHNpZy5sZW5ndGggIT09IGNyeXB0b19zaWduX0JZVEVTKVxyXG4gICAgdGhyb3cgbmV3IEVycm9yKCdiYWQgc2lnbmF0dXJlIHNpemUnKTtcclxuICBpZiAocHVibGljS2V5Lmxlbmd0aCAhPT0gY3J5cHRvX3NpZ25fUFVCTElDS0VZQllURVMpXHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2JhZCBwdWJsaWMga2V5IHNpemUnKTtcclxuICB2YXIgc20gPSBuZXcgVWludDhBcnJheShjcnlwdG9fc2lnbl9CWVRFUyArIG1zZy5sZW5ndGgpO1xyXG4gIHZhciBtID0gbmV3IFVpbnQ4QXJyYXkoY3J5cHRvX3NpZ25fQllURVMgKyBtc2cubGVuZ3RoKTtcclxuICB2YXIgaTtcclxuICBmb3IgKGkgPSAwOyBpIDwgY3J5cHRvX3NpZ25fQllURVM7IGkrKykgc21baV0gPSBzaWdbaV07XHJcbiAgZm9yIChpID0gMDsgaSA8IG1zZy5sZW5ndGg7IGkrKykgc21baStjcnlwdG9fc2lnbl9CWVRFU10gPSBtc2dbaV07XHJcbiAgcmV0dXJuIChjcnlwdG9fc2lnbl9vcGVuKG0sIHNtLCBzbS5sZW5ndGgsIHB1YmxpY0tleSkgPj0gMCk7XHJcbn07XHJcblxyXG5uYWNsLnNpZ24ua2V5UGFpciA9IGZ1bmN0aW9uKCkge1xyXG4gIHZhciBwayA9IG5ldyBVaW50OEFycmF5KGNyeXB0b19zaWduX1BVQkxJQ0tFWUJZVEVTKTtcclxuICB2YXIgc2sgPSBuZXcgVWludDhBcnJheShjcnlwdG9fc2lnbl9TRUNSRVRLRVlCWVRFUyk7XHJcbiAgY3J5cHRvX3NpZ25fa2V5cGFpcihwaywgc2spO1xyXG4gIHJldHVybiB7cHVibGljS2V5OiBwaywgc2VjcmV0S2V5OiBza307XHJcbn07XHJcblxyXG5uYWNsLnNpZ24ua2V5UGFpci5mcm9tU2VjcmV0S2V5ID0gZnVuY3Rpb24oc2VjcmV0S2V5KSB7XHJcbiAgY2hlY2tBcnJheVR5cGVzKHNlY3JldEtleSk7XHJcbiAgaWYgKHNlY3JldEtleS5sZW5ndGggIT09IGNyeXB0b19zaWduX1NFQ1JFVEtFWUJZVEVTKVxyXG4gICAgdGhyb3cgbmV3IEVycm9yKCdiYWQgc2VjcmV0IGtleSBzaXplJyk7XHJcbiAgdmFyIHBrID0gbmV3IFVpbnQ4QXJyYXkoY3J5cHRvX3NpZ25fUFVCTElDS0VZQllURVMpO1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgcGsubGVuZ3RoOyBpKyspIHBrW2ldID0gc2VjcmV0S2V5WzMyK2ldO1xyXG4gIHJldHVybiB7cHVibGljS2V5OiBwaywgc2VjcmV0S2V5OiBuZXcgVWludDhBcnJheShzZWNyZXRLZXkpfTtcclxufTtcclxuXHJcbm5hY2wuc2lnbi5rZXlQYWlyLmZyb21TZWVkID0gZnVuY3Rpb24oc2VlZCkge1xyXG4gIGNoZWNrQXJyYXlUeXBlcyhzZWVkKTtcclxuICBpZiAoc2VlZC5sZW5ndGggIT09IGNyeXB0b19zaWduX1NFRURCWVRFUylcclxuICAgIHRocm93IG5ldyBFcnJvcignYmFkIHNlZWQgc2l6ZScpO1xyXG4gIHZhciBwayA9IG5ldyBVaW50OEFycmF5KGNyeXB0b19zaWduX1BVQkxJQ0tFWUJZVEVTKTtcclxuICB2YXIgc2sgPSBuZXcgVWludDhBcnJheShjcnlwdG9fc2lnbl9TRUNSRVRLRVlCWVRFUyk7XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCAzMjsgaSsrKSBza1tpXSA9IHNlZWRbaV07XHJcbiAgY3J5cHRvX3NpZ25fa2V5cGFpcihwaywgc2ssIHRydWUpO1xyXG4gIHJldHVybiB7cHVibGljS2V5OiBwaywgc2VjcmV0S2V5OiBza307XHJcbn07XHJcblxyXG5uYWNsLnNpZ24ucHVibGljS2V5TGVuZ3RoID0gY3J5cHRvX3NpZ25fUFVCTElDS0VZQllURVM7XHJcbm5hY2wuc2lnbi5zZWNyZXRLZXlMZW5ndGggPSBjcnlwdG9fc2lnbl9TRUNSRVRLRVlCWVRFUztcclxubmFjbC5zaWduLnNlZWRMZW5ndGggPSBjcnlwdG9fc2lnbl9TRUVEQllURVM7XHJcbm5hY2wuc2lnbi5zaWduYXR1cmVMZW5ndGggPSBjcnlwdG9fc2lnbl9CWVRFUztcclxuXHJcbm5hY2wuaGFzaCA9IGZ1bmN0aW9uKG1zZykge1xyXG4gIGNoZWNrQXJyYXlUeXBlcyhtc2cpO1xyXG4gIHZhciBoID0gbmV3IFVpbnQ4QXJyYXkoY3J5cHRvX2hhc2hfQllURVMpO1xyXG4gIGNyeXB0b19oYXNoKGgsIG1zZywgbXNnLmxlbmd0aCk7XHJcbiAgcmV0dXJuIGg7XHJcbn07XHJcblxyXG5uYWNsLmhhc2guaGFzaExlbmd0aCA9IGNyeXB0b19oYXNoX0JZVEVTO1xyXG5cclxubmFjbC52ZXJpZnkgPSBmdW5jdGlvbih4LCB5KSB7XHJcbiAgY2hlY2tBcnJheVR5cGVzKHgsIHkpO1xyXG4gIC8vIFplcm8gbGVuZ3RoIGFyZ3VtZW50cyBhcmUgY29uc2lkZXJlZCBub3QgZXF1YWwuXHJcbiAgaWYgKHgubGVuZ3RoID09PSAwIHx8IHkubGVuZ3RoID09PSAwKSByZXR1cm4gZmFsc2U7XHJcbiAgaWYgKHgubGVuZ3RoICE9PSB5Lmxlbmd0aCkgcmV0dXJuIGZhbHNlO1xyXG4gIHJldHVybiAodm4oeCwgMCwgeSwgMCwgeC5sZW5ndGgpID09PSAwKSA/IHRydWUgOiBmYWxzZTtcclxufTtcclxuXHJcbm5hY2wuc2V0UFJORyA9IGZ1bmN0aW9uKGZuKSB7XHJcbiAgcmFuZG9tYnl0ZXMgPSBmbjtcclxufTtcclxuXHJcbihmdW5jdGlvbigpIHtcclxuICAvLyBJbml0aWFsaXplIFBSTkcgaWYgZW52aXJvbm1lbnQgcHJvdmlkZXMgQ1NQUk5HLlxyXG4gIC8vIElmIG5vdCwgbWV0aG9kcyBjYWxsaW5nIHJhbmRvbWJ5dGVzIHdpbGwgdGhyb3cuXHJcbiAgdmFyIGNyeXB0byA9IHR5cGVvZiBzZWxmICE9PSAndW5kZWZpbmVkJyA/IChzZWxmLmNyeXB0byB8fCBzZWxmLm1zQ3J5cHRvKSA6IG51bGw7XHJcbiAgaWYgKGNyeXB0byAmJiBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKSB7XHJcbiAgICAvLyBCcm93c2Vycy5cclxuICAgIHZhciBRVU9UQSA9IDY1NTM2O1xyXG4gICAgbmFjbC5zZXRQUk5HKGZ1bmN0aW9uKHgsIG4pIHtcclxuICAgICAgdmFyIGksIHYgPSBuZXcgVWludDhBcnJheShuKTtcclxuICAgICAgZm9yIChpID0gMDsgaSA8IG47IGkgKz0gUVVPVEEpIHtcclxuICAgICAgICBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKHYuc3ViYXJyYXkoaSwgaSArIE1hdGgubWluKG4gLSBpLCBRVU9UQSkpKTtcclxuICAgICAgfVxyXG4gICAgICBmb3IgKGkgPSAwOyBpIDwgbjsgaSsrKSB4W2ldID0gdltpXTtcclxuICAgICAgY2xlYW51cCh2KTtcclxuICAgIH0pO1xyXG4gIH0gZWxzZSBpZiAodHlwZW9mIHJlcXVpcmUgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAvLyBOb2RlLmpzLlxyXG4gICAgY3J5cHRvID0gcmVxdWlyZSgnY3J5cHRvJyk7XHJcbiAgICBpZiAoY3J5cHRvICYmIGNyeXB0by5yYW5kb21CeXRlcykge1xyXG4gICAgICBuYWNsLnNldFBSTkcoZnVuY3Rpb24oeCwgbikge1xyXG4gICAgICAgIHZhciBpLCB2ID0gY3J5cHRvLnJhbmRvbUJ5dGVzKG4pO1xyXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBuOyBpKyspIHhbaV0gPSB2W2ldO1xyXG4gICAgICAgIGNsZWFudXAodik7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxufSkoKTtcclxuXHJcbn0pKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzID8gbW9kdWxlLmV4cG9ydHMgOiAoc2VsZi5uYWNsID0gc2VsZi5uYWNsIHx8IHt9KSk7XHJcbiJdLCJzb3VyY2VSb290IjoiIn0=