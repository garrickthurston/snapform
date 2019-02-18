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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdHdlZXRuYWNsL25hY2wtZmFzdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUF1QixpQkFBaUI7QUFDeEM7QUFDQTs7QUFFQTtBQUNBLHdDQUF3Qyw0QkFBNEI7O0FBRXBFO0FBQ0EsNEJBQTRCOztBQUU1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxhQUFhLE9BQU87QUFDcEI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLGlCQUFpQixRQUFRO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxpQkFBaUIsUUFBUTtBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLFFBQVE7QUFDckIsYUFBYSxPQUFPO0FBQ3BCO0FBQ0E7QUFDQSxlQUFlLFFBQVE7QUFDdkI7QUFDQSxlQUFlLFFBQVE7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLE9BQU87QUFDdEI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsUUFBUTtBQUNyQixhQUFhLE9BQU87QUFDcEI7QUFDQTtBQUNBLGVBQWUsUUFBUTtBQUN2QjtBQUNBLGVBQWUsUUFBUTtBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLE9BQU87QUFDdEI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLE9BQU87QUFDeEI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQixPQUFPO0FBQ3hCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsOENBQThDO0FBQzlDLDhDQUE4QztBQUM5Qyw4Q0FBOEM7QUFDOUMsOENBQThDO0FBQzlDLDhDQUE4QztBQUM5QztBQUNBLDhDQUE4QztBQUM5Qyw4Q0FBOEM7QUFDOUMsOENBQThDO0FBQzlDOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHNEQUFzRDtBQUN0RCxzREFBc0Q7QUFDdEQsc0RBQXNEO0FBQ3RELHNEQUFzRDtBQUN0RCxzREFBc0Q7QUFDdEQ7QUFDQSxzREFBc0Q7QUFDdEQsc0RBQXNEO0FBQ3RELHNEQUFzRDtBQUN0RDs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0I7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjs7QUFFckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7O0FBRXJCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQjtBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCOztBQUVyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0I7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjs7QUFFckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7O0FBRXJCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQjtBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCOztBQUVyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0I7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjs7QUFFckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7O0FBRXJCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQjtBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCOztBQUVyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0I7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjs7QUFFckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxVQUFVLFFBQVE7QUFDbEI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxhQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGFBQWEsUUFBUTtBQUNyQjtBQUNBLGFBQWEsUUFBUTs7QUFFckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsYUFBYSxPQUFPO0FBQ3BCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLFVBQVU7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGVBQWUsV0FBVztBQUMxQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLFFBQVE7QUFDckI7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsYUFBYSxRQUFRO0FBQ3JCOztBQUVBO0FBQ0E7QUFDQSxhQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxpQkFBaUIsUUFBUTtBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0E7QUFDQSxhQUFhLE9BQU87QUFDcEI7QUFDQSxlQUFlLFFBQVE7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7O0FBRUE7QUFDQSxpQkFBaUIsUUFBUTtBQUN6Qjs7QUFFQTtBQUNBLGlCQUFpQixRQUFRO0FBQ3pCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHNCQUFzQiwyQkFBMkI7QUFDakQsc0JBQXNCLDJCQUEyQjtBQUNqRCxzQkFBc0IsMkJBQTJCO0FBQ2pELHNCQUFzQiwyQkFBMkI7QUFDakQsc0JBQXNCLDJCQUEyQjtBQUNqRCxzQkFBc0IsMkJBQTJCO0FBQ2pELHNCQUFzQiwyQkFBMkI7QUFDakQsc0JBQXNCLDJCQUEyQjtBQUNqRCxzQkFBc0IsMkJBQTJCO0FBQ2pELHNCQUFzQiwyQkFBMkI7QUFDakQsc0JBQXNCLDJCQUEyQjtBQUNqRCxzQkFBc0IsMkJBQTJCO0FBQ2pELHNCQUFzQiwyQkFBMkI7QUFDakQsc0JBQXNCLDJCQUEyQjtBQUNqRCxzQkFBc0IsMkJBQTJCO0FBQ2pELHNCQUFzQiwyQkFBMkI7QUFDakQ7O0FBRUE7QUFDQTtBQUNBLHNCQUFzQiwyQkFBMkI7QUFDakQsc0JBQXNCLDJCQUEyQjtBQUNqRCxzQkFBc0IsMkJBQTJCO0FBQ2pELHNCQUFzQiwyQkFBMkI7QUFDakQsc0JBQXNCLDJCQUEyQjtBQUNqRCxzQkFBc0IsMkJBQTJCO0FBQ2pELHNCQUFzQiwyQkFBMkI7QUFDakQsc0JBQXNCLDJCQUEyQjtBQUNqRCxzQkFBc0IsMkJBQTJCO0FBQ2pELHNCQUFzQiwyQkFBMkI7QUFDakQsc0JBQXNCLDJCQUEyQjtBQUNqRCxzQkFBc0IsMkJBQTJCO0FBQ2pELHNCQUFzQiwyQkFBMkI7QUFDakQsc0JBQXNCLDJCQUEyQjtBQUNqRCxzQkFBc0IsMkJBQTJCO0FBQ2pELHNCQUFzQiwyQkFBMkI7QUFDakQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsYUFBYSxRQUFRO0FBQ3JCLGVBQWUsUUFBUTtBQUN2QjtBQUNBO0FBQ0E7QUFDQSxhQUFhLFFBQVE7QUFDckI7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsYUFBYSxRQUFRO0FBQ3JCLGVBQWUsUUFBUTtBQUN2QjtBQUNBO0FBQ0E7QUFDQSxhQUFhLFFBQVE7QUFDckI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0E7QUFDQSxhQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLE1BQU07QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGVBQWUsUUFBUTtBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsUUFBUTtBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLHFCQUFxQjtBQUNyQixxQkFBcUI7O0FBRXJCO0FBQ0E7QUFDQTs7QUFFQSxzQkFBc0I7QUFDdEIsc0JBQXNCOztBQUV0QjtBQUNBO0FBQ0E7O0FBRUEsc0JBQXNCO0FBQ3RCLHNCQUFzQjs7QUFFdEI7QUFDQTtBQUNBOztBQUVBLHNCQUFzQjtBQUN0QixzQkFBc0I7O0FBRXRCO0FBQ0E7QUFDQTs7QUFFQSxzQkFBc0I7QUFDdEIsc0JBQXNCOztBQUV0QjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEscUJBQXFCO0FBQ3JCLHFCQUFxQjs7QUFFckI7QUFDQTtBQUNBOztBQUVBLHNCQUFzQjtBQUN0QixzQkFBc0I7O0FBRXRCO0FBQ0E7QUFDQTs7QUFFQSxzQkFBc0I7QUFDdEIsc0JBQXNCOztBQUV0QjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEscUJBQXFCO0FBQ3JCLHFCQUFxQjs7QUFFckI7QUFDQTs7QUFFQSxzQkFBc0I7QUFDdEIsc0JBQXNCOztBQUV0QjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxtQkFBbUIsUUFBUTtBQUMzQjtBQUNBO0FBQ0E7O0FBRUEseUJBQXlCO0FBQ3pCLHlCQUF5Qjs7QUFFekI7QUFDQTs7QUFFQSwwQkFBMEI7QUFDMUIsMEJBQTBCOztBQUUxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDBCQUEwQjtBQUMxQiwwQkFBMEI7O0FBRTFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsMEJBQTBCO0FBQzFCLDBCQUEwQjs7QUFFMUI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLG1CQUFtQjtBQUNuQixtQkFBbUI7O0FBRW5CO0FBQ0E7O0FBRUEsb0JBQW9CO0FBQ3BCLG9CQUFvQjs7QUFFcEI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxtQkFBbUI7QUFDbkIsbUJBQW1COztBQUVuQjtBQUNBOztBQUVBLG9CQUFvQjtBQUNwQixvQkFBb0I7O0FBRXBCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsbUJBQW1CO0FBQ25CLG1CQUFtQjs7QUFFbkI7QUFDQTs7QUFFQSxvQkFBb0I7QUFDcEIsb0JBQW9COztBQUVwQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBLG1CQUFtQjtBQUNuQixtQkFBbUI7O0FBRW5CO0FBQ0E7O0FBRUEsb0JBQW9CO0FBQ3BCLG9CQUFvQjs7QUFFcEI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxtQkFBbUI7QUFDbkIsbUJBQW1COztBQUVuQjtBQUNBOztBQUVBLG9CQUFvQjtBQUNwQixvQkFBb0I7O0FBRXBCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsbUJBQW1CO0FBQ25CLG1CQUFtQjs7QUFFbkI7QUFDQTs7QUFFQSxvQkFBb0I7QUFDcEIsb0JBQW9COztBQUVwQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBLG1CQUFtQjtBQUNuQixtQkFBbUI7O0FBRW5CO0FBQ0E7O0FBRUEsb0JBQW9CO0FBQ3BCLG9CQUFvQjs7QUFFcEI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxtQkFBbUI7QUFDbkIsbUJBQW1COztBQUVuQjtBQUNBOztBQUVBLG9CQUFvQjtBQUNwQixvQkFBb0I7O0FBRXBCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsYUFBYSxPQUFPO0FBQ3BCOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGFBQWEsT0FBTzs7QUFFcEI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGFBQWEsT0FBTztBQUNwQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLFFBQVE7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLGNBQWMsU0FBUztBQUN2QjtBQUNBLGdDQUFnQyxPQUFPO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLFFBQVE7QUFDckIsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxhQUFhLFFBQVE7QUFDckIsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGFBQWEsT0FBTztBQUNwQixhQUFhLFFBQVE7O0FBRXJCO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGNBQWMsUUFBUTtBQUN0QjtBQUNBOztBQUVBLGFBQWEsUUFBUTtBQUNyQixhQUFhLFFBQVE7QUFDckIsYUFBYSxRQUFRO0FBQ3JCLGVBQWUsUUFBUTtBQUN2QjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBLGFBQWEsT0FBTztBQUNwQixhQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7O0FBRUEsYUFBYSxPQUFPO0FBQ3BCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxhQUFhLHNCQUFzQjtBQUNuQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGlCQUFpQixnQkFBZ0I7QUFDakM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLGdCQUFnQjtBQUNqQztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQixnQkFBZ0I7QUFDakM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx3REFBd0Q7QUFDeEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsY0FBYztBQUMvQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQixnQkFBZ0I7QUFDakM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLHVCQUF1QjtBQUNwQyxhQUFhLGdCQUFnQjtBQUM3QjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsZUFBZTtBQUNoQyxVQUFVO0FBQ1Y7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLFFBQVE7QUFDekI7QUFDQSxVQUFVO0FBQ1Y7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsT0FBTztBQUN4QjtBQUNBO0FBQ0EsaUJBQWlCLE9BQU87QUFDeEI7QUFDQSxLQUFLO0FBQ0wsR0FBRyxVQUFVLElBQThCO0FBQzNDO0FBQ0EsYUFBYSxtQkFBTyxDQUFDLGVBQVE7QUFDN0I7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLE9BQU87QUFDMUI7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLENBQUM7O0FBRUQsQ0FBQyxFQUFFLEtBQTZCLGtFQUFrRSIsImZpbGUiOiJidWlsZC92ZW5kb3IvdmVuZG9yLnR3ZWV0bmFjbC5jZGEyNGM5NDNkMGJlYmY2NWYyZS5jaHVuay5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbihuYWNsKSB7XG4ndXNlIHN0cmljdCc7XG5cbi8vIFBvcnRlZCBpbiAyMDE0IGJ5IERtaXRyeSBDaGVzdG55a2ggYW5kIERldmkgTWFuZGlyaS5cbi8vIFB1YmxpYyBkb21haW4uXG4vL1xuLy8gSW1wbGVtZW50YXRpb24gZGVyaXZlZCBmcm9tIFR3ZWV0TmFDbCB2ZXJzaW9uIDIwMTQwNDI3LlxuLy8gU2VlIGZvciBkZXRhaWxzOiBodHRwOi8vdHdlZXRuYWNsLmNyLnlwLnRvL1xuXG52YXIgZ2YgPSBmdW5jdGlvbihpbml0KSB7XG4gIHZhciBpLCByID0gbmV3IEZsb2F0NjRBcnJheSgxNik7XG4gIGlmIChpbml0KSBmb3IgKGkgPSAwOyBpIDwgaW5pdC5sZW5ndGg7IGkrKykgcltpXSA9IGluaXRbaV07XG4gIHJldHVybiByO1xufTtcblxuLy8gIFBsdWdnYWJsZSwgaW5pdGlhbGl6ZWQgaW4gaGlnaC1sZXZlbCBBUEkgYmVsb3cuXG52YXIgcmFuZG9tYnl0ZXMgPSBmdW5jdGlvbigvKiB4LCBuICovKSB7IHRocm93IG5ldyBFcnJvcignbm8gUFJORycpOyB9O1xuXG52YXIgXzAgPSBuZXcgVWludDhBcnJheSgxNik7XG52YXIgXzkgPSBuZXcgVWludDhBcnJheSgzMik7IF85WzBdID0gOTtcblxudmFyIGdmMCA9IGdmKCksXG4gICAgZ2YxID0gZ2YoWzFdKSxcbiAgICBfMTIxNjY1ID0gZ2YoWzB4ZGI0MSwgMV0pLFxuICAgIEQgPSBnZihbMHg3OGEzLCAweDEzNTksIDB4NGRjYSwgMHg3NWViLCAweGQ4YWIsIDB4NDE0MSwgMHgwYTRkLCAweDAwNzAsIDB4ZTg5OCwgMHg3Nzc5LCAweDQwNzksIDB4OGNjNywgMHhmZTczLCAweDJiNmYsIDB4NmNlZSwgMHg1MjAzXSksXG4gICAgRDIgPSBnZihbMHhmMTU5LCAweDI2YjIsIDB4OWI5NCwgMHhlYmQ2LCAweGIxNTYsIDB4ODI4MywgMHgxNDlhLCAweDAwZTAsIDB4ZDEzMCwgMHhlZWYzLCAweDgwZjIsIDB4MTk4ZSwgMHhmY2U3LCAweDU2ZGYsIDB4ZDlkYywgMHgyNDA2XSksXG4gICAgWCA9IGdmKFsweGQ1MWEsIDB4OGYyNSwgMHgyZDYwLCAweGM5NTYsIDB4YTdiMiwgMHg5NTI1LCAweGM3NjAsIDB4NjkyYywgMHhkYzVjLCAweGZkZDYsIDB4ZTIzMSwgMHhjMGE0LCAweDUzZmUsIDB4Y2Q2ZSwgMHgzNmQzLCAweDIxNjldKSxcbiAgICBZID0gZ2YoWzB4NjY1OCwgMHg2NjY2LCAweDY2NjYsIDB4NjY2NiwgMHg2NjY2LCAweDY2NjYsIDB4NjY2NiwgMHg2NjY2LCAweDY2NjYsIDB4NjY2NiwgMHg2NjY2LCAweDY2NjYsIDB4NjY2NiwgMHg2NjY2LCAweDY2NjYsIDB4NjY2Nl0pLFxuICAgIEkgPSBnZihbMHhhMGIwLCAweDRhMGUsIDB4MWIyNywgMHhjNGVlLCAweGU0NzgsIDB4YWQyZiwgMHgxODA2LCAweDJmNDMsIDB4ZDdhNywgMHgzZGZiLCAweDAwOTksIDB4MmI0ZCwgMHhkZjBiLCAweDRmYzEsIDB4MjQ4MCwgMHgyYjgzXSk7XG5cbmZ1bmN0aW9uIHRzNjQoeCwgaSwgaCwgbCkge1xuICB4W2ldICAgPSAoaCA+PiAyNCkgJiAweGZmO1xuICB4W2krMV0gPSAoaCA+PiAxNikgJiAweGZmO1xuICB4W2krMl0gPSAoaCA+PiAgOCkgJiAweGZmO1xuICB4W2krM10gPSBoICYgMHhmZjtcbiAgeFtpKzRdID0gKGwgPj4gMjQpICAmIDB4ZmY7XG4gIHhbaSs1XSA9IChsID4+IDE2KSAgJiAweGZmO1xuICB4W2krNl0gPSAobCA+PiAgOCkgICYgMHhmZjtcbiAgeFtpKzddID0gbCAmIDB4ZmY7XG59XG5cbmZ1bmN0aW9uIHZuKHgsIHhpLCB5LCB5aSwgbikge1xuICB2YXIgaSxkID0gMDtcbiAgZm9yIChpID0gMDsgaSA8IG47IGkrKykgZCB8PSB4W3hpK2ldXnlbeWkraV07XG4gIHJldHVybiAoMSAmICgoZCAtIDEpID4+PiA4KSkgLSAxO1xufVxuXG5mdW5jdGlvbiBjcnlwdG9fdmVyaWZ5XzE2KHgsIHhpLCB5LCB5aSkge1xuICByZXR1cm4gdm4oeCx4aSx5LHlpLDE2KTtcbn1cblxuZnVuY3Rpb24gY3J5cHRvX3ZlcmlmeV8zMih4LCB4aSwgeSwgeWkpIHtcbiAgcmV0dXJuIHZuKHgseGkseSx5aSwzMik7XG59XG5cbmZ1bmN0aW9uIGNvcmVfc2Fsc2EyMChvLCBwLCBrLCBjKSB7XG4gIHZhciBqMCAgPSBjWyAwXSAmIDB4ZmYgfCAoY1sgMV0gJiAweGZmKTw8OCB8IChjWyAyXSAmIDB4ZmYpPDwxNiB8IChjWyAzXSAmIDB4ZmYpPDwyNCxcbiAgICAgIGoxICA9IGtbIDBdICYgMHhmZiB8IChrWyAxXSAmIDB4ZmYpPDw4IHwgKGtbIDJdICYgMHhmZik8PDE2IHwgKGtbIDNdICYgMHhmZik8PDI0LFxuICAgICAgajIgID0ga1sgNF0gJiAweGZmIHwgKGtbIDVdICYgMHhmZik8PDggfCAoa1sgNl0gJiAweGZmKTw8MTYgfCAoa1sgN10gJiAweGZmKTw8MjQsXG4gICAgICBqMyAgPSBrWyA4XSAmIDB4ZmYgfCAoa1sgOV0gJiAweGZmKTw8OCB8IChrWzEwXSAmIDB4ZmYpPDwxNiB8IChrWzExXSAmIDB4ZmYpPDwyNCxcbiAgICAgIGo0ICA9IGtbMTJdICYgMHhmZiB8IChrWzEzXSAmIDB4ZmYpPDw4IHwgKGtbMTRdICYgMHhmZik8PDE2IHwgKGtbMTVdICYgMHhmZik8PDI0LFxuICAgICAgajUgID0gY1sgNF0gJiAweGZmIHwgKGNbIDVdICYgMHhmZik8PDggfCAoY1sgNl0gJiAweGZmKTw8MTYgfCAoY1sgN10gJiAweGZmKTw8MjQsXG4gICAgICBqNiAgPSBwWyAwXSAmIDB4ZmYgfCAocFsgMV0gJiAweGZmKTw8OCB8IChwWyAyXSAmIDB4ZmYpPDwxNiB8IChwWyAzXSAmIDB4ZmYpPDwyNCxcbiAgICAgIGo3ICA9IHBbIDRdICYgMHhmZiB8IChwWyA1XSAmIDB4ZmYpPDw4IHwgKHBbIDZdICYgMHhmZik8PDE2IHwgKHBbIDddICYgMHhmZik8PDI0LFxuICAgICAgajggID0gcFsgOF0gJiAweGZmIHwgKHBbIDldICYgMHhmZik8PDggfCAocFsxMF0gJiAweGZmKTw8MTYgfCAocFsxMV0gJiAweGZmKTw8MjQsXG4gICAgICBqOSAgPSBwWzEyXSAmIDB4ZmYgfCAocFsxM10gJiAweGZmKTw8OCB8IChwWzE0XSAmIDB4ZmYpPDwxNiB8IChwWzE1XSAmIDB4ZmYpPDwyNCxcbiAgICAgIGoxMCA9IGNbIDhdICYgMHhmZiB8IChjWyA5XSAmIDB4ZmYpPDw4IHwgKGNbMTBdICYgMHhmZik8PDE2IHwgKGNbMTFdICYgMHhmZik8PDI0LFxuICAgICAgajExID0ga1sxNl0gJiAweGZmIHwgKGtbMTddICYgMHhmZik8PDggfCAoa1sxOF0gJiAweGZmKTw8MTYgfCAoa1sxOV0gJiAweGZmKTw8MjQsXG4gICAgICBqMTIgPSBrWzIwXSAmIDB4ZmYgfCAoa1syMV0gJiAweGZmKTw8OCB8IChrWzIyXSAmIDB4ZmYpPDwxNiB8IChrWzIzXSAmIDB4ZmYpPDwyNCxcbiAgICAgIGoxMyA9IGtbMjRdICYgMHhmZiB8IChrWzI1XSAmIDB4ZmYpPDw4IHwgKGtbMjZdICYgMHhmZik8PDE2IHwgKGtbMjddICYgMHhmZik8PDI0LFxuICAgICAgajE0ID0ga1syOF0gJiAweGZmIHwgKGtbMjldICYgMHhmZik8PDggfCAoa1szMF0gJiAweGZmKTw8MTYgfCAoa1szMV0gJiAweGZmKTw8MjQsXG4gICAgICBqMTUgPSBjWzEyXSAmIDB4ZmYgfCAoY1sxM10gJiAweGZmKTw8OCB8IChjWzE0XSAmIDB4ZmYpPDwxNiB8IChjWzE1XSAmIDB4ZmYpPDwyNDtcblxuICB2YXIgeDAgPSBqMCwgeDEgPSBqMSwgeDIgPSBqMiwgeDMgPSBqMywgeDQgPSBqNCwgeDUgPSBqNSwgeDYgPSBqNiwgeDcgPSBqNyxcbiAgICAgIHg4ID0gajgsIHg5ID0gajksIHgxMCA9IGoxMCwgeDExID0gajExLCB4MTIgPSBqMTIsIHgxMyA9IGoxMywgeDE0ID0gajE0LFxuICAgICAgeDE1ID0gajE1LCB1O1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgMjA7IGkgKz0gMikge1xuICAgIHUgPSB4MCArIHgxMiB8IDA7XG4gICAgeDQgXj0gdTw8NyB8IHU+Pj4oMzItNyk7XG4gICAgdSA9IHg0ICsgeDAgfCAwO1xuICAgIHg4IF49IHU8PDkgfCB1Pj4+KDMyLTkpO1xuICAgIHUgPSB4OCArIHg0IHwgMDtcbiAgICB4MTIgXj0gdTw8MTMgfCB1Pj4+KDMyLTEzKTtcbiAgICB1ID0geDEyICsgeDggfCAwO1xuICAgIHgwIF49IHU8PDE4IHwgdT4+PigzMi0xOCk7XG5cbiAgICB1ID0geDUgKyB4MSB8IDA7XG4gICAgeDkgXj0gdTw8NyB8IHU+Pj4oMzItNyk7XG4gICAgdSA9IHg5ICsgeDUgfCAwO1xuICAgIHgxMyBePSB1PDw5IHwgdT4+PigzMi05KTtcbiAgICB1ID0geDEzICsgeDkgfCAwO1xuICAgIHgxIF49IHU8PDEzIHwgdT4+PigzMi0xMyk7XG4gICAgdSA9IHgxICsgeDEzIHwgMDtcbiAgICB4NSBePSB1PDwxOCB8IHU+Pj4oMzItMTgpO1xuXG4gICAgdSA9IHgxMCArIHg2IHwgMDtcbiAgICB4MTQgXj0gdTw8NyB8IHU+Pj4oMzItNyk7XG4gICAgdSA9IHgxNCArIHgxMCB8IDA7XG4gICAgeDIgXj0gdTw8OSB8IHU+Pj4oMzItOSk7XG4gICAgdSA9IHgyICsgeDE0IHwgMDtcbiAgICB4NiBePSB1PDwxMyB8IHU+Pj4oMzItMTMpO1xuICAgIHUgPSB4NiArIHgyIHwgMDtcbiAgICB4MTAgXj0gdTw8MTggfCB1Pj4+KDMyLTE4KTtcblxuICAgIHUgPSB4MTUgKyB4MTEgfCAwO1xuICAgIHgzIF49IHU8PDcgfCB1Pj4+KDMyLTcpO1xuICAgIHUgPSB4MyArIHgxNSB8IDA7XG4gICAgeDcgXj0gdTw8OSB8IHU+Pj4oMzItOSk7XG4gICAgdSA9IHg3ICsgeDMgfCAwO1xuICAgIHgxMSBePSB1PDwxMyB8IHU+Pj4oMzItMTMpO1xuICAgIHUgPSB4MTEgKyB4NyB8IDA7XG4gICAgeDE1IF49IHU8PDE4IHwgdT4+PigzMi0xOCk7XG5cbiAgICB1ID0geDAgKyB4MyB8IDA7XG4gICAgeDEgXj0gdTw8NyB8IHU+Pj4oMzItNyk7XG4gICAgdSA9IHgxICsgeDAgfCAwO1xuICAgIHgyIF49IHU8PDkgfCB1Pj4+KDMyLTkpO1xuICAgIHUgPSB4MiArIHgxIHwgMDtcbiAgICB4MyBePSB1PDwxMyB8IHU+Pj4oMzItMTMpO1xuICAgIHUgPSB4MyArIHgyIHwgMDtcbiAgICB4MCBePSB1PDwxOCB8IHU+Pj4oMzItMTgpO1xuXG4gICAgdSA9IHg1ICsgeDQgfCAwO1xuICAgIHg2IF49IHU8PDcgfCB1Pj4+KDMyLTcpO1xuICAgIHUgPSB4NiArIHg1IHwgMDtcbiAgICB4NyBePSB1PDw5IHwgdT4+PigzMi05KTtcbiAgICB1ID0geDcgKyB4NiB8IDA7XG4gICAgeDQgXj0gdTw8MTMgfCB1Pj4+KDMyLTEzKTtcbiAgICB1ID0geDQgKyB4NyB8IDA7XG4gICAgeDUgXj0gdTw8MTggfCB1Pj4+KDMyLTE4KTtcblxuICAgIHUgPSB4MTAgKyB4OSB8IDA7XG4gICAgeDExIF49IHU8PDcgfCB1Pj4+KDMyLTcpO1xuICAgIHUgPSB4MTEgKyB4MTAgfCAwO1xuICAgIHg4IF49IHU8PDkgfCB1Pj4+KDMyLTkpO1xuICAgIHUgPSB4OCArIHgxMSB8IDA7XG4gICAgeDkgXj0gdTw8MTMgfCB1Pj4+KDMyLTEzKTtcbiAgICB1ID0geDkgKyB4OCB8IDA7XG4gICAgeDEwIF49IHU8PDE4IHwgdT4+PigzMi0xOCk7XG5cbiAgICB1ID0geDE1ICsgeDE0IHwgMDtcbiAgICB4MTIgXj0gdTw8NyB8IHU+Pj4oMzItNyk7XG4gICAgdSA9IHgxMiArIHgxNSB8IDA7XG4gICAgeDEzIF49IHU8PDkgfCB1Pj4+KDMyLTkpO1xuICAgIHUgPSB4MTMgKyB4MTIgfCAwO1xuICAgIHgxNCBePSB1PDwxMyB8IHU+Pj4oMzItMTMpO1xuICAgIHUgPSB4MTQgKyB4MTMgfCAwO1xuICAgIHgxNSBePSB1PDwxOCB8IHU+Pj4oMzItMTgpO1xuICB9XG4gICB4MCA9ICB4MCArICBqMCB8IDA7XG4gICB4MSA9ICB4MSArICBqMSB8IDA7XG4gICB4MiA9ICB4MiArICBqMiB8IDA7XG4gICB4MyA9ICB4MyArICBqMyB8IDA7XG4gICB4NCA9ICB4NCArICBqNCB8IDA7XG4gICB4NSA9ICB4NSArICBqNSB8IDA7XG4gICB4NiA9ICB4NiArICBqNiB8IDA7XG4gICB4NyA9ICB4NyArICBqNyB8IDA7XG4gICB4OCA9ICB4OCArICBqOCB8IDA7XG4gICB4OSA9ICB4OSArICBqOSB8IDA7XG4gIHgxMCA9IHgxMCArIGoxMCB8IDA7XG4gIHgxMSA9IHgxMSArIGoxMSB8IDA7XG4gIHgxMiA9IHgxMiArIGoxMiB8IDA7XG4gIHgxMyA9IHgxMyArIGoxMyB8IDA7XG4gIHgxNCA9IHgxNCArIGoxNCB8IDA7XG4gIHgxNSA9IHgxNSArIGoxNSB8IDA7XG5cbiAgb1sgMF0gPSB4MCA+Pj4gIDAgJiAweGZmO1xuICBvWyAxXSA9IHgwID4+PiAgOCAmIDB4ZmY7XG4gIG9bIDJdID0geDAgPj4+IDE2ICYgMHhmZjtcbiAgb1sgM10gPSB4MCA+Pj4gMjQgJiAweGZmO1xuXG4gIG9bIDRdID0geDEgPj4+ICAwICYgMHhmZjtcbiAgb1sgNV0gPSB4MSA+Pj4gIDggJiAweGZmO1xuICBvWyA2XSA9IHgxID4+PiAxNiAmIDB4ZmY7XG4gIG9bIDddID0geDEgPj4+IDI0ICYgMHhmZjtcblxuICBvWyA4XSA9IHgyID4+PiAgMCAmIDB4ZmY7XG4gIG9bIDldID0geDIgPj4+ICA4ICYgMHhmZjtcbiAgb1sxMF0gPSB4MiA+Pj4gMTYgJiAweGZmO1xuICBvWzExXSA9IHgyID4+PiAyNCAmIDB4ZmY7XG5cbiAgb1sxMl0gPSB4MyA+Pj4gIDAgJiAweGZmO1xuICBvWzEzXSA9IHgzID4+PiAgOCAmIDB4ZmY7XG4gIG9bMTRdID0geDMgPj4+IDE2ICYgMHhmZjtcbiAgb1sxNV0gPSB4MyA+Pj4gMjQgJiAweGZmO1xuXG4gIG9bMTZdID0geDQgPj4+ICAwICYgMHhmZjtcbiAgb1sxN10gPSB4NCA+Pj4gIDggJiAweGZmO1xuICBvWzE4XSA9IHg0ID4+PiAxNiAmIDB4ZmY7XG4gIG9bMTldID0geDQgPj4+IDI0ICYgMHhmZjtcblxuICBvWzIwXSA9IHg1ID4+PiAgMCAmIDB4ZmY7XG4gIG9bMjFdID0geDUgPj4+ICA4ICYgMHhmZjtcbiAgb1syMl0gPSB4NSA+Pj4gMTYgJiAweGZmO1xuICBvWzIzXSA9IHg1ID4+PiAyNCAmIDB4ZmY7XG5cbiAgb1syNF0gPSB4NiA+Pj4gIDAgJiAweGZmO1xuICBvWzI1XSA9IHg2ID4+PiAgOCAmIDB4ZmY7XG4gIG9bMjZdID0geDYgPj4+IDE2ICYgMHhmZjtcbiAgb1syN10gPSB4NiA+Pj4gMjQgJiAweGZmO1xuXG4gIG9bMjhdID0geDcgPj4+ICAwICYgMHhmZjtcbiAgb1syOV0gPSB4NyA+Pj4gIDggJiAweGZmO1xuICBvWzMwXSA9IHg3ID4+PiAxNiAmIDB4ZmY7XG4gIG9bMzFdID0geDcgPj4+IDI0ICYgMHhmZjtcblxuICBvWzMyXSA9IHg4ID4+PiAgMCAmIDB4ZmY7XG4gIG9bMzNdID0geDggPj4+ICA4ICYgMHhmZjtcbiAgb1szNF0gPSB4OCA+Pj4gMTYgJiAweGZmO1xuICBvWzM1XSA9IHg4ID4+PiAyNCAmIDB4ZmY7XG5cbiAgb1szNl0gPSB4OSA+Pj4gIDAgJiAweGZmO1xuICBvWzM3XSA9IHg5ID4+PiAgOCAmIDB4ZmY7XG4gIG9bMzhdID0geDkgPj4+IDE2ICYgMHhmZjtcbiAgb1szOV0gPSB4OSA+Pj4gMjQgJiAweGZmO1xuXG4gIG9bNDBdID0geDEwID4+PiAgMCAmIDB4ZmY7XG4gIG9bNDFdID0geDEwID4+PiAgOCAmIDB4ZmY7XG4gIG9bNDJdID0geDEwID4+PiAxNiAmIDB4ZmY7XG4gIG9bNDNdID0geDEwID4+PiAyNCAmIDB4ZmY7XG5cbiAgb1s0NF0gPSB4MTEgPj4+ICAwICYgMHhmZjtcbiAgb1s0NV0gPSB4MTEgPj4+ICA4ICYgMHhmZjtcbiAgb1s0Nl0gPSB4MTEgPj4+IDE2ICYgMHhmZjtcbiAgb1s0N10gPSB4MTEgPj4+IDI0ICYgMHhmZjtcblxuICBvWzQ4XSA9IHgxMiA+Pj4gIDAgJiAweGZmO1xuICBvWzQ5XSA9IHgxMiA+Pj4gIDggJiAweGZmO1xuICBvWzUwXSA9IHgxMiA+Pj4gMTYgJiAweGZmO1xuICBvWzUxXSA9IHgxMiA+Pj4gMjQgJiAweGZmO1xuXG4gIG9bNTJdID0geDEzID4+PiAgMCAmIDB4ZmY7XG4gIG9bNTNdID0geDEzID4+PiAgOCAmIDB4ZmY7XG4gIG9bNTRdID0geDEzID4+PiAxNiAmIDB4ZmY7XG4gIG9bNTVdID0geDEzID4+PiAyNCAmIDB4ZmY7XG5cbiAgb1s1Nl0gPSB4MTQgPj4+ICAwICYgMHhmZjtcbiAgb1s1N10gPSB4MTQgPj4+ICA4ICYgMHhmZjtcbiAgb1s1OF0gPSB4MTQgPj4+IDE2ICYgMHhmZjtcbiAgb1s1OV0gPSB4MTQgPj4+IDI0ICYgMHhmZjtcblxuICBvWzYwXSA9IHgxNSA+Pj4gIDAgJiAweGZmO1xuICBvWzYxXSA9IHgxNSA+Pj4gIDggJiAweGZmO1xuICBvWzYyXSA9IHgxNSA+Pj4gMTYgJiAweGZmO1xuICBvWzYzXSA9IHgxNSA+Pj4gMjQgJiAweGZmO1xufVxuXG5mdW5jdGlvbiBjb3JlX2hzYWxzYTIwKG8scCxrLGMpIHtcbiAgdmFyIGowICA9IGNbIDBdICYgMHhmZiB8IChjWyAxXSAmIDB4ZmYpPDw4IHwgKGNbIDJdICYgMHhmZik8PDE2IHwgKGNbIDNdICYgMHhmZik8PDI0LFxuICAgICAgajEgID0ga1sgMF0gJiAweGZmIHwgKGtbIDFdICYgMHhmZik8PDggfCAoa1sgMl0gJiAweGZmKTw8MTYgfCAoa1sgM10gJiAweGZmKTw8MjQsXG4gICAgICBqMiAgPSBrWyA0XSAmIDB4ZmYgfCAoa1sgNV0gJiAweGZmKTw8OCB8IChrWyA2XSAmIDB4ZmYpPDwxNiB8IChrWyA3XSAmIDB4ZmYpPDwyNCxcbiAgICAgIGozICA9IGtbIDhdICYgMHhmZiB8IChrWyA5XSAmIDB4ZmYpPDw4IHwgKGtbMTBdICYgMHhmZik8PDE2IHwgKGtbMTFdICYgMHhmZik8PDI0LFxuICAgICAgajQgID0ga1sxMl0gJiAweGZmIHwgKGtbMTNdICYgMHhmZik8PDggfCAoa1sxNF0gJiAweGZmKTw8MTYgfCAoa1sxNV0gJiAweGZmKTw8MjQsXG4gICAgICBqNSAgPSBjWyA0XSAmIDB4ZmYgfCAoY1sgNV0gJiAweGZmKTw8OCB8IChjWyA2XSAmIDB4ZmYpPDwxNiB8IChjWyA3XSAmIDB4ZmYpPDwyNCxcbiAgICAgIGo2ICA9IHBbIDBdICYgMHhmZiB8IChwWyAxXSAmIDB4ZmYpPDw4IHwgKHBbIDJdICYgMHhmZik8PDE2IHwgKHBbIDNdICYgMHhmZik8PDI0LFxuICAgICAgajcgID0gcFsgNF0gJiAweGZmIHwgKHBbIDVdICYgMHhmZik8PDggfCAocFsgNl0gJiAweGZmKTw8MTYgfCAocFsgN10gJiAweGZmKTw8MjQsXG4gICAgICBqOCAgPSBwWyA4XSAmIDB4ZmYgfCAocFsgOV0gJiAweGZmKTw8OCB8IChwWzEwXSAmIDB4ZmYpPDwxNiB8IChwWzExXSAmIDB4ZmYpPDwyNCxcbiAgICAgIGo5ICA9IHBbMTJdICYgMHhmZiB8IChwWzEzXSAmIDB4ZmYpPDw4IHwgKHBbMTRdICYgMHhmZik8PDE2IHwgKHBbMTVdICYgMHhmZik8PDI0LFxuICAgICAgajEwID0gY1sgOF0gJiAweGZmIHwgKGNbIDldICYgMHhmZik8PDggfCAoY1sxMF0gJiAweGZmKTw8MTYgfCAoY1sxMV0gJiAweGZmKTw8MjQsXG4gICAgICBqMTEgPSBrWzE2XSAmIDB4ZmYgfCAoa1sxN10gJiAweGZmKTw8OCB8IChrWzE4XSAmIDB4ZmYpPDwxNiB8IChrWzE5XSAmIDB4ZmYpPDwyNCxcbiAgICAgIGoxMiA9IGtbMjBdICYgMHhmZiB8IChrWzIxXSAmIDB4ZmYpPDw4IHwgKGtbMjJdICYgMHhmZik8PDE2IHwgKGtbMjNdICYgMHhmZik8PDI0LFxuICAgICAgajEzID0ga1syNF0gJiAweGZmIHwgKGtbMjVdICYgMHhmZik8PDggfCAoa1syNl0gJiAweGZmKTw8MTYgfCAoa1syN10gJiAweGZmKTw8MjQsXG4gICAgICBqMTQgPSBrWzI4XSAmIDB4ZmYgfCAoa1syOV0gJiAweGZmKTw8OCB8IChrWzMwXSAmIDB4ZmYpPDwxNiB8IChrWzMxXSAmIDB4ZmYpPDwyNCxcbiAgICAgIGoxNSA9IGNbMTJdICYgMHhmZiB8IChjWzEzXSAmIDB4ZmYpPDw4IHwgKGNbMTRdICYgMHhmZik8PDE2IHwgKGNbMTVdICYgMHhmZik8PDI0O1xuXG4gIHZhciB4MCA9IGowLCB4MSA9IGoxLCB4MiA9IGoyLCB4MyA9IGozLCB4NCA9IGo0LCB4NSA9IGo1LCB4NiA9IGo2LCB4NyA9IGo3LFxuICAgICAgeDggPSBqOCwgeDkgPSBqOSwgeDEwID0gajEwLCB4MTEgPSBqMTEsIHgxMiA9IGoxMiwgeDEzID0gajEzLCB4MTQgPSBqMTQsXG4gICAgICB4MTUgPSBqMTUsIHU7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCAyMDsgaSArPSAyKSB7XG4gICAgdSA9IHgwICsgeDEyIHwgMDtcbiAgICB4NCBePSB1PDw3IHwgdT4+PigzMi03KTtcbiAgICB1ID0geDQgKyB4MCB8IDA7XG4gICAgeDggXj0gdTw8OSB8IHU+Pj4oMzItOSk7XG4gICAgdSA9IHg4ICsgeDQgfCAwO1xuICAgIHgxMiBePSB1PDwxMyB8IHU+Pj4oMzItMTMpO1xuICAgIHUgPSB4MTIgKyB4OCB8IDA7XG4gICAgeDAgXj0gdTw8MTggfCB1Pj4+KDMyLTE4KTtcblxuICAgIHUgPSB4NSArIHgxIHwgMDtcbiAgICB4OSBePSB1PDw3IHwgdT4+PigzMi03KTtcbiAgICB1ID0geDkgKyB4NSB8IDA7XG4gICAgeDEzIF49IHU8PDkgfCB1Pj4+KDMyLTkpO1xuICAgIHUgPSB4MTMgKyB4OSB8IDA7XG4gICAgeDEgXj0gdTw8MTMgfCB1Pj4+KDMyLTEzKTtcbiAgICB1ID0geDEgKyB4MTMgfCAwO1xuICAgIHg1IF49IHU8PDE4IHwgdT4+PigzMi0xOCk7XG5cbiAgICB1ID0geDEwICsgeDYgfCAwO1xuICAgIHgxNCBePSB1PDw3IHwgdT4+PigzMi03KTtcbiAgICB1ID0geDE0ICsgeDEwIHwgMDtcbiAgICB4MiBePSB1PDw5IHwgdT4+PigzMi05KTtcbiAgICB1ID0geDIgKyB4MTQgfCAwO1xuICAgIHg2IF49IHU8PDEzIHwgdT4+PigzMi0xMyk7XG4gICAgdSA9IHg2ICsgeDIgfCAwO1xuICAgIHgxMCBePSB1PDwxOCB8IHU+Pj4oMzItMTgpO1xuXG4gICAgdSA9IHgxNSArIHgxMSB8IDA7XG4gICAgeDMgXj0gdTw8NyB8IHU+Pj4oMzItNyk7XG4gICAgdSA9IHgzICsgeDE1IHwgMDtcbiAgICB4NyBePSB1PDw5IHwgdT4+PigzMi05KTtcbiAgICB1ID0geDcgKyB4MyB8IDA7XG4gICAgeDExIF49IHU8PDEzIHwgdT4+PigzMi0xMyk7XG4gICAgdSA9IHgxMSArIHg3IHwgMDtcbiAgICB4MTUgXj0gdTw8MTggfCB1Pj4+KDMyLTE4KTtcblxuICAgIHUgPSB4MCArIHgzIHwgMDtcbiAgICB4MSBePSB1PDw3IHwgdT4+PigzMi03KTtcbiAgICB1ID0geDEgKyB4MCB8IDA7XG4gICAgeDIgXj0gdTw8OSB8IHU+Pj4oMzItOSk7XG4gICAgdSA9IHgyICsgeDEgfCAwO1xuICAgIHgzIF49IHU8PDEzIHwgdT4+PigzMi0xMyk7XG4gICAgdSA9IHgzICsgeDIgfCAwO1xuICAgIHgwIF49IHU8PDE4IHwgdT4+PigzMi0xOCk7XG5cbiAgICB1ID0geDUgKyB4NCB8IDA7XG4gICAgeDYgXj0gdTw8NyB8IHU+Pj4oMzItNyk7XG4gICAgdSA9IHg2ICsgeDUgfCAwO1xuICAgIHg3IF49IHU8PDkgfCB1Pj4+KDMyLTkpO1xuICAgIHUgPSB4NyArIHg2IHwgMDtcbiAgICB4NCBePSB1PDwxMyB8IHU+Pj4oMzItMTMpO1xuICAgIHUgPSB4NCArIHg3IHwgMDtcbiAgICB4NSBePSB1PDwxOCB8IHU+Pj4oMzItMTgpO1xuXG4gICAgdSA9IHgxMCArIHg5IHwgMDtcbiAgICB4MTEgXj0gdTw8NyB8IHU+Pj4oMzItNyk7XG4gICAgdSA9IHgxMSArIHgxMCB8IDA7XG4gICAgeDggXj0gdTw8OSB8IHU+Pj4oMzItOSk7XG4gICAgdSA9IHg4ICsgeDExIHwgMDtcbiAgICB4OSBePSB1PDwxMyB8IHU+Pj4oMzItMTMpO1xuICAgIHUgPSB4OSArIHg4IHwgMDtcbiAgICB4MTAgXj0gdTw8MTggfCB1Pj4+KDMyLTE4KTtcblxuICAgIHUgPSB4MTUgKyB4MTQgfCAwO1xuICAgIHgxMiBePSB1PDw3IHwgdT4+PigzMi03KTtcbiAgICB1ID0geDEyICsgeDE1IHwgMDtcbiAgICB4MTMgXj0gdTw8OSB8IHU+Pj4oMzItOSk7XG4gICAgdSA9IHgxMyArIHgxMiB8IDA7XG4gICAgeDE0IF49IHU8PDEzIHwgdT4+PigzMi0xMyk7XG4gICAgdSA9IHgxNCArIHgxMyB8IDA7XG4gICAgeDE1IF49IHU8PDE4IHwgdT4+PigzMi0xOCk7XG4gIH1cblxuICBvWyAwXSA9IHgwID4+PiAgMCAmIDB4ZmY7XG4gIG9bIDFdID0geDAgPj4+ICA4ICYgMHhmZjtcbiAgb1sgMl0gPSB4MCA+Pj4gMTYgJiAweGZmO1xuICBvWyAzXSA9IHgwID4+PiAyNCAmIDB4ZmY7XG5cbiAgb1sgNF0gPSB4NSA+Pj4gIDAgJiAweGZmO1xuICBvWyA1XSA9IHg1ID4+PiAgOCAmIDB4ZmY7XG4gIG9bIDZdID0geDUgPj4+IDE2ICYgMHhmZjtcbiAgb1sgN10gPSB4NSA+Pj4gMjQgJiAweGZmO1xuXG4gIG9bIDhdID0geDEwID4+PiAgMCAmIDB4ZmY7XG4gIG9bIDldID0geDEwID4+PiAgOCAmIDB4ZmY7XG4gIG9bMTBdID0geDEwID4+PiAxNiAmIDB4ZmY7XG4gIG9bMTFdID0geDEwID4+PiAyNCAmIDB4ZmY7XG5cbiAgb1sxMl0gPSB4MTUgPj4+ICAwICYgMHhmZjtcbiAgb1sxM10gPSB4MTUgPj4+ICA4ICYgMHhmZjtcbiAgb1sxNF0gPSB4MTUgPj4+IDE2ICYgMHhmZjtcbiAgb1sxNV0gPSB4MTUgPj4+IDI0ICYgMHhmZjtcblxuICBvWzE2XSA9IHg2ID4+PiAgMCAmIDB4ZmY7XG4gIG9bMTddID0geDYgPj4+ICA4ICYgMHhmZjtcbiAgb1sxOF0gPSB4NiA+Pj4gMTYgJiAweGZmO1xuICBvWzE5XSA9IHg2ID4+PiAyNCAmIDB4ZmY7XG5cbiAgb1syMF0gPSB4NyA+Pj4gIDAgJiAweGZmO1xuICBvWzIxXSA9IHg3ID4+PiAgOCAmIDB4ZmY7XG4gIG9bMjJdID0geDcgPj4+IDE2ICYgMHhmZjtcbiAgb1syM10gPSB4NyA+Pj4gMjQgJiAweGZmO1xuXG4gIG9bMjRdID0geDggPj4+ICAwICYgMHhmZjtcbiAgb1syNV0gPSB4OCA+Pj4gIDggJiAweGZmO1xuICBvWzI2XSA9IHg4ID4+PiAxNiAmIDB4ZmY7XG4gIG9bMjddID0geDggPj4+IDI0ICYgMHhmZjtcblxuICBvWzI4XSA9IHg5ID4+PiAgMCAmIDB4ZmY7XG4gIG9bMjldID0geDkgPj4+ICA4ICYgMHhmZjtcbiAgb1szMF0gPSB4OSA+Pj4gMTYgJiAweGZmO1xuICBvWzMxXSA9IHg5ID4+PiAyNCAmIDB4ZmY7XG59XG5cbmZ1bmN0aW9uIGNyeXB0b19jb3JlX3NhbHNhMjAob3V0LGlucCxrLGMpIHtcbiAgY29yZV9zYWxzYTIwKG91dCxpbnAsayxjKTtcbn1cblxuZnVuY3Rpb24gY3J5cHRvX2NvcmVfaHNhbHNhMjAob3V0LGlucCxrLGMpIHtcbiAgY29yZV9oc2Fsc2EyMChvdXQsaW5wLGssYyk7XG59XG5cbnZhciBzaWdtYSA9IG5ldyBVaW50OEFycmF5KFsxMDEsIDEyMCwgMTEyLCA5NywgMTEwLCAxMDAsIDMyLCA1MSwgNTAsIDQ1LCA5OCwgMTIxLCAxMTYsIDEwMSwgMzIsIDEwN10pO1xuICAgICAgICAgICAgLy8gXCJleHBhbmQgMzItYnl0ZSBrXCJcblxuZnVuY3Rpb24gY3J5cHRvX3N0cmVhbV9zYWxzYTIwX3hvcihjLGNwb3MsbSxtcG9zLGIsbixrKSB7XG4gIHZhciB6ID0gbmV3IFVpbnQ4QXJyYXkoMTYpLCB4ID0gbmV3IFVpbnQ4QXJyYXkoNjQpO1xuICB2YXIgdSwgaTtcbiAgZm9yIChpID0gMDsgaSA8IDE2OyBpKyspIHpbaV0gPSAwO1xuICBmb3IgKGkgPSAwOyBpIDwgODsgaSsrKSB6W2ldID0gbltpXTtcbiAgd2hpbGUgKGIgPj0gNjQpIHtcbiAgICBjcnlwdG9fY29yZV9zYWxzYTIwKHgseixrLHNpZ21hKTtcbiAgICBmb3IgKGkgPSAwOyBpIDwgNjQ7IGkrKykgY1tjcG9zK2ldID0gbVttcG9zK2ldIF4geFtpXTtcbiAgICB1ID0gMTtcbiAgICBmb3IgKGkgPSA4OyBpIDwgMTY7IGkrKykge1xuICAgICAgdSA9IHUgKyAoeltpXSAmIDB4ZmYpIHwgMDtcbiAgICAgIHpbaV0gPSB1ICYgMHhmZjtcbiAgICAgIHUgPj4+PSA4O1xuICAgIH1cbiAgICBiIC09IDY0O1xuICAgIGNwb3MgKz0gNjQ7XG4gICAgbXBvcyArPSA2NDtcbiAgfVxuICBpZiAoYiA+IDApIHtcbiAgICBjcnlwdG9fY29yZV9zYWxzYTIwKHgseixrLHNpZ21hKTtcbiAgICBmb3IgKGkgPSAwOyBpIDwgYjsgaSsrKSBjW2Nwb3MraV0gPSBtW21wb3MraV0gXiB4W2ldO1xuICB9XG4gIHJldHVybiAwO1xufVxuXG5mdW5jdGlvbiBjcnlwdG9fc3RyZWFtX3NhbHNhMjAoYyxjcG9zLGIsbixrKSB7XG4gIHZhciB6ID0gbmV3IFVpbnQ4QXJyYXkoMTYpLCB4ID0gbmV3IFVpbnQ4QXJyYXkoNjQpO1xuICB2YXIgdSwgaTtcbiAgZm9yIChpID0gMDsgaSA8IDE2OyBpKyspIHpbaV0gPSAwO1xuICBmb3IgKGkgPSAwOyBpIDwgODsgaSsrKSB6W2ldID0gbltpXTtcbiAgd2hpbGUgKGIgPj0gNjQpIHtcbiAgICBjcnlwdG9fY29yZV9zYWxzYTIwKHgseixrLHNpZ21hKTtcbiAgICBmb3IgKGkgPSAwOyBpIDwgNjQ7IGkrKykgY1tjcG9zK2ldID0geFtpXTtcbiAgICB1ID0gMTtcbiAgICBmb3IgKGkgPSA4OyBpIDwgMTY7IGkrKykge1xuICAgICAgdSA9IHUgKyAoeltpXSAmIDB4ZmYpIHwgMDtcbiAgICAgIHpbaV0gPSB1ICYgMHhmZjtcbiAgICAgIHUgPj4+PSA4O1xuICAgIH1cbiAgICBiIC09IDY0O1xuICAgIGNwb3MgKz0gNjQ7XG4gIH1cbiAgaWYgKGIgPiAwKSB7XG4gICAgY3J5cHRvX2NvcmVfc2Fsc2EyMCh4LHosayxzaWdtYSk7XG4gICAgZm9yIChpID0gMDsgaSA8IGI7IGkrKykgY1tjcG9zK2ldID0geFtpXTtcbiAgfVxuICByZXR1cm4gMDtcbn1cblxuZnVuY3Rpb24gY3J5cHRvX3N0cmVhbShjLGNwb3MsZCxuLGspIHtcbiAgdmFyIHMgPSBuZXcgVWludDhBcnJheSgzMik7XG4gIGNyeXB0b19jb3JlX2hzYWxzYTIwKHMsbixrLHNpZ21hKTtcbiAgdmFyIHNuID0gbmV3IFVpbnQ4QXJyYXkoOCk7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgODsgaSsrKSBzbltpXSA9IG5baSsxNl07XG4gIHJldHVybiBjcnlwdG9fc3RyZWFtX3NhbHNhMjAoYyxjcG9zLGQsc24scyk7XG59XG5cbmZ1bmN0aW9uIGNyeXB0b19zdHJlYW1feG9yKGMsY3BvcyxtLG1wb3MsZCxuLGspIHtcbiAgdmFyIHMgPSBuZXcgVWludDhBcnJheSgzMik7XG4gIGNyeXB0b19jb3JlX2hzYWxzYTIwKHMsbixrLHNpZ21hKTtcbiAgdmFyIHNuID0gbmV3IFVpbnQ4QXJyYXkoOCk7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgODsgaSsrKSBzbltpXSA9IG5baSsxNl07XG4gIHJldHVybiBjcnlwdG9fc3RyZWFtX3NhbHNhMjBfeG9yKGMsY3BvcyxtLG1wb3MsZCxzbixzKTtcbn1cblxuLypcbiogUG9ydCBvZiBBbmRyZXcgTW9vbidzIFBvbHkxMzA1LWRvbm5hLTE2LiBQdWJsaWMgZG9tYWluLlxuKiBodHRwczovL2dpdGh1Yi5jb20vZmxvb2R5YmVycnkvcG9seTEzMDUtZG9ubmFcbiovXG5cbnZhciBwb2x5MTMwNSA9IGZ1bmN0aW9uKGtleSkge1xuICB0aGlzLmJ1ZmZlciA9IG5ldyBVaW50OEFycmF5KDE2KTtcbiAgdGhpcy5yID0gbmV3IFVpbnQxNkFycmF5KDEwKTtcbiAgdGhpcy5oID0gbmV3IFVpbnQxNkFycmF5KDEwKTtcbiAgdGhpcy5wYWQgPSBuZXcgVWludDE2QXJyYXkoOCk7XG4gIHRoaXMubGVmdG92ZXIgPSAwO1xuICB0aGlzLmZpbiA9IDA7XG5cbiAgdmFyIHQwLCB0MSwgdDIsIHQzLCB0NCwgdDUsIHQ2LCB0NztcblxuICB0MCA9IGtleVsgMF0gJiAweGZmIHwgKGtleVsgMV0gJiAweGZmKSA8PCA4OyB0aGlzLnJbMF0gPSAoIHQwICAgICAgICAgICAgICAgICAgICAgKSAmIDB4MWZmZjtcbiAgdDEgPSBrZXlbIDJdICYgMHhmZiB8IChrZXlbIDNdICYgMHhmZikgPDwgODsgdGhpcy5yWzFdID0gKCh0MCA+Pj4gMTMpIHwgKHQxIDw8ICAzKSkgJiAweDFmZmY7XG4gIHQyID0ga2V5WyA0XSAmIDB4ZmYgfCAoa2V5WyA1XSAmIDB4ZmYpIDw8IDg7IHRoaXMuclsyXSA9ICgodDEgPj4+IDEwKSB8ICh0MiA8PCAgNikpICYgMHgxZjAzO1xuICB0MyA9IGtleVsgNl0gJiAweGZmIHwgKGtleVsgN10gJiAweGZmKSA8PCA4OyB0aGlzLnJbM10gPSAoKHQyID4+PiAgNykgfCAodDMgPDwgIDkpKSAmIDB4MWZmZjtcbiAgdDQgPSBrZXlbIDhdICYgMHhmZiB8IChrZXlbIDldICYgMHhmZikgPDwgODsgdGhpcy5yWzRdID0gKCh0MyA+Pj4gIDQpIHwgKHQ0IDw8IDEyKSkgJiAweDAwZmY7XG4gIHRoaXMucls1XSA9ICgodDQgPj4+ICAxKSkgJiAweDFmZmU7XG4gIHQ1ID0ga2V5WzEwXSAmIDB4ZmYgfCAoa2V5WzExXSAmIDB4ZmYpIDw8IDg7IHRoaXMucls2XSA9ICgodDQgPj4+IDE0KSB8ICh0NSA8PCAgMikpICYgMHgxZmZmO1xuICB0NiA9IGtleVsxMl0gJiAweGZmIHwgKGtleVsxM10gJiAweGZmKSA8PCA4OyB0aGlzLnJbN10gPSAoKHQ1ID4+PiAxMSkgfCAodDYgPDwgIDUpKSAmIDB4MWY4MTtcbiAgdDcgPSBrZXlbMTRdICYgMHhmZiB8IChrZXlbMTVdICYgMHhmZikgPDwgODsgdGhpcy5yWzhdID0gKCh0NiA+Pj4gIDgpIHwgKHQ3IDw8ICA4KSkgJiAweDFmZmY7XG4gIHRoaXMucls5XSA9ICgodDcgPj4+ICA1KSkgJiAweDAwN2Y7XG5cbiAgdGhpcy5wYWRbMF0gPSBrZXlbMTZdICYgMHhmZiB8IChrZXlbMTddICYgMHhmZikgPDwgODtcbiAgdGhpcy5wYWRbMV0gPSBrZXlbMThdICYgMHhmZiB8IChrZXlbMTldICYgMHhmZikgPDwgODtcbiAgdGhpcy5wYWRbMl0gPSBrZXlbMjBdICYgMHhmZiB8IChrZXlbMjFdICYgMHhmZikgPDwgODtcbiAgdGhpcy5wYWRbM10gPSBrZXlbMjJdICYgMHhmZiB8IChrZXlbMjNdICYgMHhmZikgPDwgODtcbiAgdGhpcy5wYWRbNF0gPSBrZXlbMjRdICYgMHhmZiB8IChrZXlbMjVdICYgMHhmZikgPDwgODtcbiAgdGhpcy5wYWRbNV0gPSBrZXlbMjZdICYgMHhmZiB8IChrZXlbMjddICYgMHhmZikgPDwgODtcbiAgdGhpcy5wYWRbNl0gPSBrZXlbMjhdICYgMHhmZiB8IChrZXlbMjldICYgMHhmZikgPDwgODtcbiAgdGhpcy5wYWRbN10gPSBrZXlbMzBdICYgMHhmZiB8IChrZXlbMzFdICYgMHhmZikgPDwgODtcbn07XG5cbnBvbHkxMzA1LnByb3RvdHlwZS5ibG9ja3MgPSBmdW5jdGlvbihtLCBtcG9zLCBieXRlcykge1xuICB2YXIgaGliaXQgPSB0aGlzLmZpbiA/IDAgOiAoMSA8PCAxMSk7XG4gIHZhciB0MCwgdDEsIHQyLCB0MywgdDQsIHQ1LCB0NiwgdDcsIGM7XG4gIHZhciBkMCwgZDEsIGQyLCBkMywgZDQsIGQ1LCBkNiwgZDcsIGQ4LCBkOTtcblxuICB2YXIgaDAgPSB0aGlzLmhbMF0sXG4gICAgICBoMSA9IHRoaXMuaFsxXSxcbiAgICAgIGgyID0gdGhpcy5oWzJdLFxuICAgICAgaDMgPSB0aGlzLmhbM10sXG4gICAgICBoNCA9IHRoaXMuaFs0XSxcbiAgICAgIGg1ID0gdGhpcy5oWzVdLFxuICAgICAgaDYgPSB0aGlzLmhbNl0sXG4gICAgICBoNyA9IHRoaXMuaFs3XSxcbiAgICAgIGg4ID0gdGhpcy5oWzhdLFxuICAgICAgaDkgPSB0aGlzLmhbOV07XG5cbiAgdmFyIHIwID0gdGhpcy5yWzBdLFxuICAgICAgcjEgPSB0aGlzLnJbMV0sXG4gICAgICByMiA9IHRoaXMuclsyXSxcbiAgICAgIHIzID0gdGhpcy5yWzNdLFxuICAgICAgcjQgPSB0aGlzLnJbNF0sXG4gICAgICByNSA9IHRoaXMucls1XSxcbiAgICAgIHI2ID0gdGhpcy5yWzZdLFxuICAgICAgcjcgPSB0aGlzLnJbN10sXG4gICAgICByOCA9IHRoaXMucls4XSxcbiAgICAgIHI5ID0gdGhpcy5yWzldO1xuXG4gIHdoaWxlIChieXRlcyA+PSAxNikge1xuICAgIHQwID0gbVttcG9zKyAwXSAmIDB4ZmYgfCAobVttcG9zKyAxXSAmIDB4ZmYpIDw8IDg7IGgwICs9ICggdDAgICAgICAgICAgICAgICAgICAgICApICYgMHgxZmZmO1xuICAgIHQxID0gbVttcG9zKyAyXSAmIDB4ZmYgfCAobVttcG9zKyAzXSAmIDB4ZmYpIDw8IDg7IGgxICs9ICgodDAgPj4+IDEzKSB8ICh0MSA8PCAgMykpICYgMHgxZmZmO1xuICAgIHQyID0gbVttcG9zKyA0XSAmIDB4ZmYgfCAobVttcG9zKyA1XSAmIDB4ZmYpIDw8IDg7IGgyICs9ICgodDEgPj4+IDEwKSB8ICh0MiA8PCAgNikpICYgMHgxZmZmO1xuICAgIHQzID0gbVttcG9zKyA2XSAmIDB4ZmYgfCAobVttcG9zKyA3XSAmIDB4ZmYpIDw8IDg7IGgzICs9ICgodDIgPj4+ICA3KSB8ICh0MyA8PCAgOSkpICYgMHgxZmZmO1xuICAgIHQ0ID0gbVttcG9zKyA4XSAmIDB4ZmYgfCAobVttcG9zKyA5XSAmIDB4ZmYpIDw8IDg7IGg0ICs9ICgodDMgPj4+ICA0KSB8ICh0NCA8PCAxMikpICYgMHgxZmZmO1xuICAgIGg1ICs9ICgodDQgPj4+ICAxKSkgJiAweDFmZmY7XG4gICAgdDUgPSBtW21wb3MrMTBdICYgMHhmZiB8IChtW21wb3MrMTFdICYgMHhmZikgPDwgODsgaDYgKz0gKCh0NCA+Pj4gMTQpIHwgKHQ1IDw8ICAyKSkgJiAweDFmZmY7XG4gICAgdDYgPSBtW21wb3MrMTJdICYgMHhmZiB8IChtW21wb3MrMTNdICYgMHhmZikgPDwgODsgaDcgKz0gKCh0NSA+Pj4gMTEpIHwgKHQ2IDw8ICA1KSkgJiAweDFmZmY7XG4gICAgdDcgPSBtW21wb3MrMTRdICYgMHhmZiB8IChtW21wb3MrMTVdICYgMHhmZikgPDwgODsgaDggKz0gKCh0NiA+Pj4gIDgpIHwgKHQ3IDw8ICA4KSkgJiAweDFmZmY7XG4gICAgaDkgKz0gKCh0NyA+Pj4gNSkpIHwgaGliaXQ7XG5cbiAgICBjID0gMDtcblxuICAgIGQwID0gYztcbiAgICBkMCArPSBoMCAqIHIwO1xuICAgIGQwICs9IGgxICogKDUgKiByOSk7XG4gICAgZDAgKz0gaDIgKiAoNSAqIHI4KTtcbiAgICBkMCArPSBoMyAqICg1ICogcjcpO1xuICAgIGQwICs9IGg0ICogKDUgKiByNik7XG4gICAgYyA9IChkMCA+Pj4gMTMpOyBkMCAmPSAweDFmZmY7XG4gICAgZDAgKz0gaDUgKiAoNSAqIHI1KTtcbiAgICBkMCArPSBoNiAqICg1ICogcjQpO1xuICAgIGQwICs9IGg3ICogKDUgKiByMyk7XG4gICAgZDAgKz0gaDggKiAoNSAqIHIyKTtcbiAgICBkMCArPSBoOSAqICg1ICogcjEpO1xuICAgIGMgKz0gKGQwID4+PiAxMyk7IGQwICY9IDB4MWZmZjtcblxuICAgIGQxID0gYztcbiAgICBkMSArPSBoMCAqIHIxO1xuICAgIGQxICs9IGgxICogcjA7XG4gICAgZDEgKz0gaDIgKiAoNSAqIHI5KTtcbiAgICBkMSArPSBoMyAqICg1ICogcjgpO1xuICAgIGQxICs9IGg0ICogKDUgKiByNyk7XG4gICAgYyA9IChkMSA+Pj4gMTMpOyBkMSAmPSAweDFmZmY7XG4gICAgZDEgKz0gaDUgKiAoNSAqIHI2KTtcbiAgICBkMSArPSBoNiAqICg1ICogcjUpO1xuICAgIGQxICs9IGg3ICogKDUgKiByNCk7XG4gICAgZDEgKz0gaDggKiAoNSAqIHIzKTtcbiAgICBkMSArPSBoOSAqICg1ICogcjIpO1xuICAgIGMgKz0gKGQxID4+PiAxMyk7IGQxICY9IDB4MWZmZjtcblxuICAgIGQyID0gYztcbiAgICBkMiArPSBoMCAqIHIyO1xuICAgIGQyICs9IGgxICogcjE7XG4gICAgZDIgKz0gaDIgKiByMDtcbiAgICBkMiArPSBoMyAqICg1ICogcjkpO1xuICAgIGQyICs9IGg0ICogKDUgKiByOCk7XG4gICAgYyA9IChkMiA+Pj4gMTMpOyBkMiAmPSAweDFmZmY7XG4gICAgZDIgKz0gaDUgKiAoNSAqIHI3KTtcbiAgICBkMiArPSBoNiAqICg1ICogcjYpO1xuICAgIGQyICs9IGg3ICogKDUgKiByNSk7XG4gICAgZDIgKz0gaDggKiAoNSAqIHI0KTtcbiAgICBkMiArPSBoOSAqICg1ICogcjMpO1xuICAgIGMgKz0gKGQyID4+PiAxMyk7IGQyICY9IDB4MWZmZjtcblxuICAgIGQzID0gYztcbiAgICBkMyArPSBoMCAqIHIzO1xuICAgIGQzICs9IGgxICogcjI7XG4gICAgZDMgKz0gaDIgKiByMTtcbiAgICBkMyArPSBoMyAqIHIwO1xuICAgIGQzICs9IGg0ICogKDUgKiByOSk7XG4gICAgYyA9IChkMyA+Pj4gMTMpOyBkMyAmPSAweDFmZmY7XG4gICAgZDMgKz0gaDUgKiAoNSAqIHI4KTtcbiAgICBkMyArPSBoNiAqICg1ICogcjcpO1xuICAgIGQzICs9IGg3ICogKDUgKiByNik7XG4gICAgZDMgKz0gaDggKiAoNSAqIHI1KTtcbiAgICBkMyArPSBoOSAqICg1ICogcjQpO1xuICAgIGMgKz0gKGQzID4+PiAxMyk7IGQzICY9IDB4MWZmZjtcblxuICAgIGQ0ID0gYztcbiAgICBkNCArPSBoMCAqIHI0O1xuICAgIGQ0ICs9IGgxICogcjM7XG4gICAgZDQgKz0gaDIgKiByMjtcbiAgICBkNCArPSBoMyAqIHIxO1xuICAgIGQ0ICs9IGg0ICogcjA7XG4gICAgYyA9IChkNCA+Pj4gMTMpOyBkNCAmPSAweDFmZmY7XG4gICAgZDQgKz0gaDUgKiAoNSAqIHI5KTtcbiAgICBkNCArPSBoNiAqICg1ICogcjgpO1xuICAgIGQ0ICs9IGg3ICogKDUgKiByNyk7XG4gICAgZDQgKz0gaDggKiAoNSAqIHI2KTtcbiAgICBkNCArPSBoOSAqICg1ICogcjUpO1xuICAgIGMgKz0gKGQ0ID4+PiAxMyk7IGQ0ICY9IDB4MWZmZjtcblxuICAgIGQ1ID0gYztcbiAgICBkNSArPSBoMCAqIHI1O1xuICAgIGQ1ICs9IGgxICogcjQ7XG4gICAgZDUgKz0gaDIgKiByMztcbiAgICBkNSArPSBoMyAqIHIyO1xuICAgIGQ1ICs9IGg0ICogcjE7XG4gICAgYyA9IChkNSA+Pj4gMTMpOyBkNSAmPSAweDFmZmY7XG4gICAgZDUgKz0gaDUgKiByMDtcbiAgICBkNSArPSBoNiAqICg1ICogcjkpO1xuICAgIGQ1ICs9IGg3ICogKDUgKiByOCk7XG4gICAgZDUgKz0gaDggKiAoNSAqIHI3KTtcbiAgICBkNSArPSBoOSAqICg1ICogcjYpO1xuICAgIGMgKz0gKGQ1ID4+PiAxMyk7IGQ1ICY9IDB4MWZmZjtcblxuICAgIGQ2ID0gYztcbiAgICBkNiArPSBoMCAqIHI2O1xuICAgIGQ2ICs9IGgxICogcjU7XG4gICAgZDYgKz0gaDIgKiByNDtcbiAgICBkNiArPSBoMyAqIHIzO1xuICAgIGQ2ICs9IGg0ICogcjI7XG4gICAgYyA9IChkNiA+Pj4gMTMpOyBkNiAmPSAweDFmZmY7XG4gICAgZDYgKz0gaDUgKiByMTtcbiAgICBkNiArPSBoNiAqIHIwO1xuICAgIGQ2ICs9IGg3ICogKDUgKiByOSk7XG4gICAgZDYgKz0gaDggKiAoNSAqIHI4KTtcbiAgICBkNiArPSBoOSAqICg1ICogcjcpO1xuICAgIGMgKz0gKGQ2ID4+PiAxMyk7IGQ2ICY9IDB4MWZmZjtcblxuICAgIGQ3ID0gYztcbiAgICBkNyArPSBoMCAqIHI3O1xuICAgIGQ3ICs9IGgxICogcjY7XG4gICAgZDcgKz0gaDIgKiByNTtcbiAgICBkNyArPSBoMyAqIHI0O1xuICAgIGQ3ICs9IGg0ICogcjM7XG4gICAgYyA9IChkNyA+Pj4gMTMpOyBkNyAmPSAweDFmZmY7XG4gICAgZDcgKz0gaDUgKiByMjtcbiAgICBkNyArPSBoNiAqIHIxO1xuICAgIGQ3ICs9IGg3ICogcjA7XG4gICAgZDcgKz0gaDggKiAoNSAqIHI5KTtcbiAgICBkNyArPSBoOSAqICg1ICogcjgpO1xuICAgIGMgKz0gKGQ3ID4+PiAxMyk7IGQ3ICY9IDB4MWZmZjtcblxuICAgIGQ4ID0gYztcbiAgICBkOCArPSBoMCAqIHI4O1xuICAgIGQ4ICs9IGgxICogcjc7XG4gICAgZDggKz0gaDIgKiByNjtcbiAgICBkOCArPSBoMyAqIHI1O1xuICAgIGQ4ICs9IGg0ICogcjQ7XG4gICAgYyA9IChkOCA+Pj4gMTMpOyBkOCAmPSAweDFmZmY7XG4gICAgZDggKz0gaDUgKiByMztcbiAgICBkOCArPSBoNiAqIHIyO1xuICAgIGQ4ICs9IGg3ICogcjE7XG4gICAgZDggKz0gaDggKiByMDtcbiAgICBkOCArPSBoOSAqICg1ICogcjkpO1xuICAgIGMgKz0gKGQ4ID4+PiAxMyk7IGQ4ICY9IDB4MWZmZjtcblxuICAgIGQ5ID0gYztcbiAgICBkOSArPSBoMCAqIHI5O1xuICAgIGQ5ICs9IGgxICogcjg7XG4gICAgZDkgKz0gaDIgKiByNztcbiAgICBkOSArPSBoMyAqIHI2O1xuICAgIGQ5ICs9IGg0ICogcjU7XG4gICAgYyA9IChkOSA+Pj4gMTMpOyBkOSAmPSAweDFmZmY7XG4gICAgZDkgKz0gaDUgKiByNDtcbiAgICBkOSArPSBoNiAqIHIzO1xuICAgIGQ5ICs9IGg3ICogcjI7XG4gICAgZDkgKz0gaDggKiByMTtcbiAgICBkOSArPSBoOSAqIHIwO1xuICAgIGMgKz0gKGQ5ID4+PiAxMyk7IGQ5ICY9IDB4MWZmZjtcblxuICAgIGMgPSAoKChjIDw8IDIpICsgYykpIHwgMDtcbiAgICBjID0gKGMgKyBkMCkgfCAwO1xuICAgIGQwID0gYyAmIDB4MWZmZjtcbiAgICBjID0gKGMgPj4+IDEzKTtcbiAgICBkMSArPSBjO1xuXG4gICAgaDAgPSBkMDtcbiAgICBoMSA9IGQxO1xuICAgIGgyID0gZDI7XG4gICAgaDMgPSBkMztcbiAgICBoNCA9IGQ0O1xuICAgIGg1ID0gZDU7XG4gICAgaDYgPSBkNjtcbiAgICBoNyA9IGQ3O1xuICAgIGg4ID0gZDg7XG4gICAgaDkgPSBkOTtcblxuICAgIG1wb3MgKz0gMTY7XG4gICAgYnl0ZXMgLT0gMTY7XG4gIH1cbiAgdGhpcy5oWzBdID0gaDA7XG4gIHRoaXMuaFsxXSA9IGgxO1xuICB0aGlzLmhbMl0gPSBoMjtcbiAgdGhpcy5oWzNdID0gaDM7XG4gIHRoaXMuaFs0XSA9IGg0O1xuICB0aGlzLmhbNV0gPSBoNTtcbiAgdGhpcy5oWzZdID0gaDY7XG4gIHRoaXMuaFs3XSA9IGg3O1xuICB0aGlzLmhbOF0gPSBoODtcbiAgdGhpcy5oWzldID0gaDk7XG59O1xuXG5wb2x5MTMwNS5wcm90b3R5cGUuZmluaXNoID0gZnVuY3Rpb24obWFjLCBtYWNwb3MpIHtcbiAgdmFyIGcgPSBuZXcgVWludDE2QXJyYXkoMTApO1xuICB2YXIgYywgbWFzaywgZiwgaTtcblxuICBpZiAodGhpcy5sZWZ0b3Zlcikge1xuICAgIGkgPSB0aGlzLmxlZnRvdmVyO1xuICAgIHRoaXMuYnVmZmVyW2krK10gPSAxO1xuICAgIGZvciAoOyBpIDwgMTY7IGkrKykgdGhpcy5idWZmZXJbaV0gPSAwO1xuICAgIHRoaXMuZmluID0gMTtcbiAgICB0aGlzLmJsb2Nrcyh0aGlzLmJ1ZmZlciwgMCwgMTYpO1xuICB9XG5cbiAgYyA9IHRoaXMuaFsxXSA+Pj4gMTM7XG4gIHRoaXMuaFsxXSAmPSAweDFmZmY7XG4gIGZvciAoaSA9IDI7IGkgPCAxMDsgaSsrKSB7XG4gICAgdGhpcy5oW2ldICs9IGM7XG4gICAgYyA9IHRoaXMuaFtpXSA+Pj4gMTM7XG4gICAgdGhpcy5oW2ldICY9IDB4MWZmZjtcbiAgfVxuICB0aGlzLmhbMF0gKz0gKGMgKiA1KTtcbiAgYyA9IHRoaXMuaFswXSA+Pj4gMTM7XG4gIHRoaXMuaFswXSAmPSAweDFmZmY7XG4gIHRoaXMuaFsxXSArPSBjO1xuICBjID0gdGhpcy5oWzFdID4+PiAxMztcbiAgdGhpcy5oWzFdICY9IDB4MWZmZjtcbiAgdGhpcy5oWzJdICs9IGM7XG5cbiAgZ1swXSA9IHRoaXMuaFswXSArIDU7XG4gIGMgPSBnWzBdID4+PiAxMztcbiAgZ1swXSAmPSAweDFmZmY7XG4gIGZvciAoaSA9IDE7IGkgPCAxMDsgaSsrKSB7XG4gICAgZ1tpXSA9IHRoaXMuaFtpXSArIGM7XG4gICAgYyA9IGdbaV0gPj4+IDEzO1xuICAgIGdbaV0gJj0gMHgxZmZmO1xuICB9XG4gIGdbOV0gLT0gKDEgPDwgMTMpO1xuXG4gIG1hc2sgPSAoYyBeIDEpIC0gMTtcbiAgZm9yIChpID0gMDsgaSA8IDEwOyBpKyspIGdbaV0gJj0gbWFzaztcbiAgbWFzayA9IH5tYXNrO1xuICBmb3IgKGkgPSAwOyBpIDwgMTA7IGkrKykgdGhpcy5oW2ldID0gKHRoaXMuaFtpXSAmIG1hc2spIHwgZ1tpXTtcblxuICB0aGlzLmhbMF0gPSAoKHRoaXMuaFswXSAgICAgICApIHwgKHRoaXMuaFsxXSA8PCAxMykgICAgICAgICAgICAgICAgICAgICkgJiAweGZmZmY7XG4gIHRoaXMuaFsxXSA9ICgodGhpcy5oWzFdID4+PiAgMykgfCAodGhpcy5oWzJdIDw8IDEwKSAgICAgICAgICAgICAgICAgICAgKSAmIDB4ZmZmZjtcbiAgdGhpcy5oWzJdID0gKCh0aGlzLmhbMl0gPj4+ICA2KSB8ICh0aGlzLmhbM10gPDwgIDcpICAgICAgICAgICAgICAgICAgICApICYgMHhmZmZmO1xuICB0aGlzLmhbM10gPSAoKHRoaXMuaFszXSA+Pj4gIDkpIHwgKHRoaXMuaFs0XSA8PCAgNCkgICAgICAgICAgICAgICAgICAgICkgJiAweGZmZmY7XG4gIHRoaXMuaFs0XSA9ICgodGhpcy5oWzRdID4+PiAxMikgfCAodGhpcy5oWzVdIDw8ICAxKSB8ICh0aGlzLmhbNl0gPDwgMTQpKSAmIDB4ZmZmZjtcbiAgdGhpcy5oWzVdID0gKCh0aGlzLmhbNl0gPj4+ICAyKSB8ICh0aGlzLmhbN10gPDwgMTEpICAgICAgICAgICAgICAgICAgICApICYgMHhmZmZmO1xuICB0aGlzLmhbNl0gPSAoKHRoaXMuaFs3XSA+Pj4gIDUpIHwgKHRoaXMuaFs4XSA8PCAgOCkgICAgICAgICAgICAgICAgICAgICkgJiAweGZmZmY7XG4gIHRoaXMuaFs3XSA9ICgodGhpcy5oWzhdID4+PiAgOCkgfCAodGhpcy5oWzldIDw8ICA1KSAgICAgICAgICAgICAgICAgICAgKSAmIDB4ZmZmZjtcblxuICBmID0gdGhpcy5oWzBdICsgdGhpcy5wYWRbMF07XG4gIHRoaXMuaFswXSA9IGYgJiAweGZmZmY7XG4gIGZvciAoaSA9IDE7IGkgPCA4OyBpKyspIHtcbiAgICBmID0gKCgodGhpcy5oW2ldICsgdGhpcy5wYWRbaV0pIHwgMCkgKyAoZiA+Pj4gMTYpKSB8IDA7XG4gICAgdGhpcy5oW2ldID0gZiAmIDB4ZmZmZjtcbiAgfVxuXG4gIG1hY1ttYWNwb3MrIDBdID0gKHRoaXMuaFswXSA+Pj4gMCkgJiAweGZmO1xuICBtYWNbbWFjcG9zKyAxXSA9ICh0aGlzLmhbMF0gPj4+IDgpICYgMHhmZjtcbiAgbWFjW21hY3BvcysgMl0gPSAodGhpcy5oWzFdID4+PiAwKSAmIDB4ZmY7XG4gIG1hY1ttYWNwb3MrIDNdID0gKHRoaXMuaFsxXSA+Pj4gOCkgJiAweGZmO1xuICBtYWNbbWFjcG9zKyA0XSA9ICh0aGlzLmhbMl0gPj4+IDApICYgMHhmZjtcbiAgbWFjW21hY3BvcysgNV0gPSAodGhpcy5oWzJdID4+PiA4KSAmIDB4ZmY7XG4gIG1hY1ttYWNwb3MrIDZdID0gKHRoaXMuaFszXSA+Pj4gMCkgJiAweGZmO1xuICBtYWNbbWFjcG9zKyA3XSA9ICh0aGlzLmhbM10gPj4+IDgpICYgMHhmZjtcbiAgbWFjW21hY3BvcysgOF0gPSAodGhpcy5oWzRdID4+PiAwKSAmIDB4ZmY7XG4gIG1hY1ttYWNwb3MrIDldID0gKHRoaXMuaFs0XSA+Pj4gOCkgJiAweGZmO1xuICBtYWNbbWFjcG9zKzEwXSA9ICh0aGlzLmhbNV0gPj4+IDApICYgMHhmZjtcbiAgbWFjW21hY3BvcysxMV0gPSAodGhpcy5oWzVdID4+PiA4KSAmIDB4ZmY7XG4gIG1hY1ttYWNwb3MrMTJdID0gKHRoaXMuaFs2XSA+Pj4gMCkgJiAweGZmO1xuICBtYWNbbWFjcG9zKzEzXSA9ICh0aGlzLmhbNl0gPj4+IDgpICYgMHhmZjtcbiAgbWFjW21hY3BvcysxNF0gPSAodGhpcy5oWzddID4+PiAwKSAmIDB4ZmY7XG4gIG1hY1ttYWNwb3MrMTVdID0gKHRoaXMuaFs3XSA+Pj4gOCkgJiAweGZmO1xufTtcblxucG9seTEzMDUucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKG0sIG1wb3MsIGJ5dGVzKSB7XG4gIHZhciBpLCB3YW50O1xuXG4gIGlmICh0aGlzLmxlZnRvdmVyKSB7XG4gICAgd2FudCA9ICgxNiAtIHRoaXMubGVmdG92ZXIpO1xuICAgIGlmICh3YW50ID4gYnl0ZXMpXG4gICAgICB3YW50ID0gYnl0ZXM7XG4gICAgZm9yIChpID0gMDsgaSA8IHdhbnQ7IGkrKylcbiAgICAgIHRoaXMuYnVmZmVyW3RoaXMubGVmdG92ZXIgKyBpXSA9IG1bbXBvcytpXTtcbiAgICBieXRlcyAtPSB3YW50O1xuICAgIG1wb3MgKz0gd2FudDtcbiAgICB0aGlzLmxlZnRvdmVyICs9IHdhbnQ7XG4gICAgaWYgKHRoaXMubGVmdG92ZXIgPCAxNilcbiAgICAgIHJldHVybjtcbiAgICB0aGlzLmJsb2Nrcyh0aGlzLmJ1ZmZlciwgMCwgMTYpO1xuICAgIHRoaXMubGVmdG92ZXIgPSAwO1xuICB9XG5cbiAgaWYgKGJ5dGVzID49IDE2KSB7XG4gICAgd2FudCA9IGJ5dGVzIC0gKGJ5dGVzICUgMTYpO1xuICAgIHRoaXMuYmxvY2tzKG0sIG1wb3MsIHdhbnQpO1xuICAgIG1wb3MgKz0gd2FudDtcbiAgICBieXRlcyAtPSB3YW50O1xuICB9XG5cbiAgaWYgKGJ5dGVzKSB7XG4gICAgZm9yIChpID0gMDsgaSA8IGJ5dGVzOyBpKyspXG4gICAgICB0aGlzLmJ1ZmZlclt0aGlzLmxlZnRvdmVyICsgaV0gPSBtW21wb3MraV07XG4gICAgdGhpcy5sZWZ0b3ZlciArPSBieXRlcztcbiAgfVxufTtcblxuZnVuY3Rpb24gY3J5cHRvX29uZXRpbWVhdXRoKG91dCwgb3V0cG9zLCBtLCBtcG9zLCBuLCBrKSB7XG4gIHZhciBzID0gbmV3IHBvbHkxMzA1KGspO1xuICBzLnVwZGF0ZShtLCBtcG9zLCBuKTtcbiAgcy5maW5pc2gob3V0LCBvdXRwb3MpO1xuICByZXR1cm4gMDtcbn1cblxuZnVuY3Rpb24gY3J5cHRvX29uZXRpbWVhdXRoX3ZlcmlmeShoLCBocG9zLCBtLCBtcG9zLCBuLCBrKSB7XG4gIHZhciB4ID0gbmV3IFVpbnQ4QXJyYXkoMTYpO1xuICBjcnlwdG9fb25ldGltZWF1dGgoeCwwLG0sbXBvcyxuLGspO1xuICByZXR1cm4gY3J5cHRvX3ZlcmlmeV8xNihoLGhwb3MseCwwKTtcbn1cblxuZnVuY3Rpb24gY3J5cHRvX3NlY3JldGJveChjLG0sZCxuLGspIHtcbiAgdmFyIGk7XG4gIGlmIChkIDwgMzIpIHJldHVybiAtMTtcbiAgY3J5cHRvX3N0cmVhbV94b3IoYywwLG0sMCxkLG4sayk7XG4gIGNyeXB0b19vbmV0aW1lYXV0aChjLCAxNiwgYywgMzIsIGQgLSAzMiwgYyk7XG4gIGZvciAoaSA9IDA7IGkgPCAxNjsgaSsrKSBjW2ldID0gMDtcbiAgcmV0dXJuIDA7XG59XG5cbmZ1bmN0aW9uIGNyeXB0b19zZWNyZXRib3hfb3BlbihtLGMsZCxuLGspIHtcbiAgdmFyIGk7XG4gIHZhciB4ID0gbmV3IFVpbnQ4QXJyYXkoMzIpO1xuICBpZiAoZCA8IDMyKSByZXR1cm4gLTE7XG4gIGNyeXB0b19zdHJlYW0oeCwwLDMyLG4sayk7XG4gIGlmIChjcnlwdG9fb25ldGltZWF1dGhfdmVyaWZ5KGMsIDE2LGMsIDMyLGQgLSAzMix4KSAhPT0gMCkgcmV0dXJuIC0xO1xuICBjcnlwdG9fc3RyZWFtX3hvcihtLDAsYywwLGQsbixrKTtcbiAgZm9yIChpID0gMDsgaSA8IDMyOyBpKyspIG1baV0gPSAwO1xuICByZXR1cm4gMDtcbn1cblxuZnVuY3Rpb24gc2V0MjU1MTkociwgYSkge1xuICB2YXIgaTtcbiAgZm9yIChpID0gMDsgaSA8IDE2OyBpKyspIHJbaV0gPSBhW2ldfDA7XG59XG5cbmZ1bmN0aW9uIGNhcjI1NTE5KG8pIHtcbiAgdmFyIGksIHYsIGMgPSAxO1xuICBmb3IgKGkgPSAwOyBpIDwgMTY7IGkrKykge1xuICAgIHYgPSBvW2ldICsgYyArIDY1NTM1O1xuICAgIGMgPSBNYXRoLmZsb29yKHYgLyA2NTUzNik7XG4gICAgb1tpXSA9IHYgLSBjICogNjU1MzY7XG4gIH1cbiAgb1swXSArPSBjLTEgKyAzNyAqIChjLTEpO1xufVxuXG5mdW5jdGlvbiBzZWwyNTUxOShwLCBxLCBiKSB7XG4gIHZhciB0LCBjID0gfihiLTEpO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IDE2OyBpKyspIHtcbiAgICB0ID0gYyAmIChwW2ldIF4gcVtpXSk7XG4gICAgcFtpXSBePSB0O1xuICAgIHFbaV0gXj0gdDtcbiAgfVxufVxuXG5mdW5jdGlvbiBwYWNrMjU1MTkobywgbikge1xuICB2YXIgaSwgaiwgYjtcbiAgdmFyIG0gPSBnZigpLCB0ID0gZ2YoKTtcbiAgZm9yIChpID0gMDsgaSA8IDE2OyBpKyspIHRbaV0gPSBuW2ldO1xuICBjYXIyNTUxOSh0KTtcbiAgY2FyMjU1MTkodCk7XG4gIGNhcjI1NTE5KHQpO1xuICBmb3IgKGogPSAwOyBqIDwgMjsgaisrKSB7XG4gICAgbVswXSA9IHRbMF0gLSAweGZmZWQ7XG4gICAgZm9yIChpID0gMTsgaSA8IDE1OyBpKyspIHtcbiAgICAgIG1baV0gPSB0W2ldIC0gMHhmZmZmIC0gKChtW2ktMV0+PjE2KSAmIDEpO1xuICAgICAgbVtpLTFdICY9IDB4ZmZmZjtcbiAgICB9XG4gICAgbVsxNV0gPSB0WzE1XSAtIDB4N2ZmZiAtICgobVsxNF0+PjE2KSAmIDEpO1xuICAgIGIgPSAobVsxNV0+PjE2KSAmIDE7XG4gICAgbVsxNF0gJj0gMHhmZmZmO1xuICAgIHNlbDI1NTE5KHQsIG0sIDEtYik7XG4gIH1cbiAgZm9yIChpID0gMDsgaSA8IDE2OyBpKyspIHtcbiAgICBvWzIqaV0gPSB0W2ldICYgMHhmZjtcbiAgICBvWzIqaSsxXSA9IHRbaV0+Pjg7XG4gIH1cbn1cblxuZnVuY3Rpb24gbmVxMjU1MTkoYSwgYikge1xuICB2YXIgYyA9IG5ldyBVaW50OEFycmF5KDMyKSwgZCA9IG5ldyBVaW50OEFycmF5KDMyKTtcbiAgcGFjazI1NTE5KGMsIGEpO1xuICBwYWNrMjU1MTkoZCwgYik7XG4gIHJldHVybiBjcnlwdG9fdmVyaWZ5XzMyKGMsIDAsIGQsIDApO1xufVxuXG5mdW5jdGlvbiBwYXIyNTUxOShhKSB7XG4gIHZhciBkID0gbmV3IFVpbnQ4QXJyYXkoMzIpO1xuICBwYWNrMjU1MTkoZCwgYSk7XG4gIHJldHVybiBkWzBdICYgMTtcbn1cblxuZnVuY3Rpb24gdW5wYWNrMjU1MTkobywgbikge1xuICB2YXIgaTtcbiAgZm9yIChpID0gMDsgaSA8IDE2OyBpKyspIG9baV0gPSBuWzIqaV0gKyAoblsyKmkrMV0gPDwgOCk7XG4gIG9bMTVdICY9IDB4N2ZmZjtcbn1cblxuZnVuY3Rpb24gQShvLCBhLCBiKSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgMTY7IGkrKykgb1tpXSA9IGFbaV0gKyBiW2ldO1xufVxuXG5mdW5jdGlvbiBaKG8sIGEsIGIpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCAxNjsgaSsrKSBvW2ldID0gYVtpXSAtIGJbaV07XG59XG5cbmZ1bmN0aW9uIE0obywgYSwgYikge1xuICB2YXIgdiwgYyxcbiAgICAgdDAgPSAwLCAgdDEgPSAwLCAgdDIgPSAwLCAgdDMgPSAwLCAgdDQgPSAwLCAgdDUgPSAwLCAgdDYgPSAwLCAgdDcgPSAwLFxuICAgICB0OCA9IDAsICB0OSA9IDAsIHQxMCA9IDAsIHQxMSA9IDAsIHQxMiA9IDAsIHQxMyA9IDAsIHQxNCA9IDAsIHQxNSA9IDAsXG4gICAgdDE2ID0gMCwgdDE3ID0gMCwgdDE4ID0gMCwgdDE5ID0gMCwgdDIwID0gMCwgdDIxID0gMCwgdDIyID0gMCwgdDIzID0gMCxcbiAgICB0MjQgPSAwLCB0MjUgPSAwLCB0MjYgPSAwLCB0MjcgPSAwLCB0MjggPSAwLCB0MjkgPSAwLCB0MzAgPSAwLFxuICAgIGIwID0gYlswXSxcbiAgICBiMSA9IGJbMV0sXG4gICAgYjIgPSBiWzJdLFxuICAgIGIzID0gYlszXSxcbiAgICBiNCA9IGJbNF0sXG4gICAgYjUgPSBiWzVdLFxuICAgIGI2ID0gYls2XSxcbiAgICBiNyA9IGJbN10sXG4gICAgYjggPSBiWzhdLFxuICAgIGI5ID0gYls5XSxcbiAgICBiMTAgPSBiWzEwXSxcbiAgICBiMTEgPSBiWzExXSxcbiAgICBiMTIgPSBiWzEyXSxcbiAgICBiMTMgPSBiWzEzXSxcbiAgICBiMTQgPSBiWzE0XSxcbiAgICBiMTUgPSBiWzE1XTtcblxuICB2ID0gYVswXTtcbiAgdDAgKz0gdiAqIGIwO1xuICB0MSArPSB2ICogYjE7XG4gIHQyICs9IHYgKiBiMjtcbiAgdDMgKz0gdiAqIGIzO1xuICB0NCArPSB2ICogYjQ7XG4gIHQ1ICs9IHYgKiBiNTtcbiAgdDYgKz0gdiAqIGI2O1xuICB0NyArPSB2ICogYjc7XG4gIHQ4ICs9IHYgKiBiODtcbiAgdDkgKz0gdiAqIGI5O1xuICB0MTAgKz0gdiAqIGIxMDtcbiAgdDExICs9IHYgKiBiMTE7XG4gIHQxMiArPSB2ICogYjEyO1xuICB0MTMgKz0gdiAqIGIxMztcbiAgdDE0ICs9IHYgKiBiMTQ7XG4gIHQxNSArPSB2ICogYjE1O1xuICB2ID0gYVsxXTtcbiAgdDEgKz0gdiAqIGIwO1xuICB0MiArPSB2ICogYjE7XG4gIHQzICs9IHYgKiBiMjtcbiAgdDQgKz0gdiAqIGIzO1xuICB0NSArPSB2ICogYjQ7XG4gIHQ2ICs9IHYgKiBiNTtcbiAgdDcgKz0gdiAqIGI2O1xuICB0OCArPSB2ICogYjc7XG4gIHQ5ICs9IHYgKiBiODtcbiAgdDEwICs9IHYgKiBiOTtcbiAgdDExICs9IHYgKiBiMTA7XG4gIHQxMiArPSB2ICogYjExO1xuICB0MTMgKz0gdiAqIGIxMjtcbiAgdDE0ICs9IHYgKiBiMTM7XG4gIHQxNSArPSB2ICogYjE0O1xuICB0MTYgKz0gdiAqIGIxNTtcbiAgdiA9IGFbMl07XG4gIHQyICs9IHYgKiBiMDtcbiAgdDMgKz0gdiAqIGIxO1xuICB0NCArPSB2ICogYjI7XG4gIHQ1ICs9IHYgKiBiMztcbiAgdDYgKz0gdiAqIGI0O1xuICB0NyArPSB2ICogYjU7XG4gIHQ4ICs9IHYgKiBiNjtcbiAgdDkgKz0gdiAqIGI3O1xuICB0MTAgKz0gdiAqIGI4O1xuICB0MTEgKz0gdiAqIGI5O1xuICB0MTIgKz0gdiAqIGIxMDtcbiAgdDEzICs9IHYgKiBiMTE7XG4gIHQxNCArPSB2ICogYjEyO1xuICB0MTUgKz0gdiAqIGIxMztcbiAgdDE2ICs9IHYgKiBiMTQ7XG4gIHQxNyArPSB2ICogYjE1O1xuICB2ID0gYVszXTtcbiAgdDMgKz0gdiAqIGIwO1xuICB0NCArPSB2ICogYjE7XG4gIHQ1ICs9IHYgKiBiMjtcbiAgdDYgKz0gdiAqIGIzO1xuICB0NyArPSB2ICogYjQ7XG4gIHQ4ICs9IHYgKiBiNTtcbiAgdDkgKz0gdiAqIGI2O1xuICB0MTAgKz0gdiAqIGI3O1xuICB0MTEgKz0gdiAqIGI4O1xuICB0MTIgKz0gdiAqIGI5O1xuICB0MTMgKz0gdiAqIGIxMDtcbiAgdDE0ICs9IHYgKiBiMTE7XG4gIHQxNSArPSB2ICogYjEyO1xuICB0MTYgKz0gdiAqIGIxMztcbiAgdDE3ICs9IHYgKiBiMTQ7XG4gIHQxOCArPSB2ICogYjE1O1xuICB2ID0gYVs0XTtcbiAgdDQgKz0gdiAqIGIwO1xuICB0NSArPSB2ICogYjE7XG4gIHQ2ICs9IHYgKiBiMjtcbiAgdDcgKz0gdiAqIGIzO1xuICB0OCArPSB2ICogYjQ7XG4gIHQ5ICs9IHYgKiBiNTtcbiAgdDEwICs9IHYgKiBiNjtcbiAgdDExICs9IHYgKiBiNztcbiAgdDEyICs9IHYgKiBiODtcbiAgdDEzICs9IHYgKiBiOTtcbiAgdDE0ICs9IHYgKiBiMTA7XG4gIHQxNSArPSB2ICogYjExO1xuICB0MTYgKz0gdiAqIGIxMjtcbiAgdDE3ICs9IHYgKiBiMTM7XG4gIHQxOCArPSB2ICogYjE0O1xuICB0MTkgKz0gdiAqIGIxNTtcbiAgdiA9IGFbNV07XG4gIHQ1ICs9IHYgKiBiMDtcbiAgdDYgKz0gdiAqIGIxO1xuICB0NyArPSB2ICogYjI7XG4gIHQ4ICs9IHYgKiBiMztcbiAgdDkgKz0gdiAqIGI0O1xuICB0MTAgKz0gdiAqIGI1O1xuICB0MTEgKz0gdiAqIGI2O1xuICB0MTIgKz0gdiAqIGI3O1xuICB0MTMgKz0gdiAqIGI4O1xuICB0MTQgKz0gdiAqIGI5O1xuICB0MTUgKz0gdiAqIGIxMDtcbiAgdDE2ICs9IHYgKiBiMTE7XG4gIHQxNyArPSB2ICogYjEyO1xuICB0MTggKz0gdiAqIGIxMztcbiAgdDE5ICs9IHYgKiBiMTQ7XG4gIHQyMCArPSB2ICogYjE1O1xuICB2ID0gYVs2XTtcbiAgdDYgKz0gdiAqIGIwO1xuICB0NyArPSB2ICogYjE7XG4gIHQ4ICs9IHYgKiBiMjtcbiAgdDkgKz0gdiAqIGIzO1xuICB0MTAgKz0gdiAqIGI0O1xuICB0MTEgKz0gdiAqIGI1O1xuICB0MTIgKz0gdiAqIGI2O1xuICB0MTMgKz0gdiAqIGI3O1xuICB0MTQgKz0gdiAqIGI4O1xuICB0MTUgKz0gdiAqIGI5O1xuICB0MTYgKz0gdiAqIGIxMDtcbiAgdDE3ICs9IHYgKiBiMTE7XG4gIHQxOCArPSB2ICogYjEyO1xuICB0MTkgKz0gdiAqIGIxMztcbiAgdDIwICs9IHYgKiBiMTQ7XG4gIHQyMSArPSB2ICogYjE1O1xuICB2ID0gYVs3XTtcbiAgdDcgKz0gdiAqIGIwO1xuICB0OCArPSB2ICogYjE7XG4gIHQ5ICs9IHYgKiBiMjtcbiAgdDEwICs9IHYgKiBiMztcbiAgdDExICs9IHYgKiBiNDtcbiAgdDEyICs9IHYgKiBiNTtcbiAgdDEzICs9IHYgKiBiNjtcbiAgdDE0ICs9IHYgKiBiNztcbiAgdDE1ICs9IHYgKiBiODtcbiAgdDE2ICs9IHYgKiBiOTtcbiAgdDE3ICs9IHYgKiBiMTA7XG4gIHQxOCArPSB2ICogYjExO1xuICB0MTkgKz0gdiAqIGIxMjtcbiAgdDIwICs9IHYgKiBiMTM7XG4gIHQyMSArPSB2ICogYjE0O1xuICB0MjIgKz0gdiAqIGIxNTtcbiAgdiA9IGFbOF07XG4gIHQ4ICs9IHYgKiBiMDtcbiAgdDkgKz0gdiAqIGIxO1xuICB0MTAgKz0gdiAqIGIyO1xuICB0MTEgKz0gdiAqIGIzO1xuICB0MTIgKz0gdiAqIGI0O1xuICB0MTMgKz0gdiAqIGI1O1xuICB0MTQgKz0gdiAqIGI2O1xuICB0MTUgKz0gdiAqIGI3O1xuICB0MTYgKz0gdiAqIGI4O1xuICB0MTcgKz0gdiAqIGI5O1xuICB0MTggKz0gdiAqIGIxMDtcbiAgdDE5ICs9IHYgKiBiMTE7XG4gIHQyMCArPSB2ICogYjEyO1xuICB0MjEgKz0gdiAqIGIxMztcbiAgdDIyICs9IHYgKiBiMTQ7XG4gIHQyMyArPSB2ICogYjE1O1xuICB2ID0gYVs5XTtcbiAgdDkgKz0gdiAqIGIwO1xuICB0MTAgKz0gdiAqIGIxO1xuICB0MTEgKz0gdiAqIGIyO1xuICB0MTIgKz0gdiAqIGIzO1xuICB0MTMgKz0gdiAqIGI0O1xuICB0MTQgKz0gdiAqIGI1O1xuICB0MTUgKz0gdiAqIGI2O1xuICB0MTYgKz0gdiAqIGI3O1xuICB0MTcgKz0gdiAqIGI4O1xuICB0MTggKz0gdiAqIGI5O1xuICB0MTkgKz0gdiAqIGIxMDtcbiAgdDIwICs9IHYgKiBiMTE7XG4gIHQyMSArPSB2ICogYjEyO1xuICB0MjIgKz0gdiAqIGIxMztcbiAgdDIzICs9IHYgKiBiMTQ7XG4gIHQyNCArPSB2ICogYjE1O1xuICB2ID0gYVsxMF07XG4gIHQxMCArPSB2ICogYjA7XG4gIHQxMSArPSB2ICogYjE7XG4gIHQxMiArPSB2ICogYjI7XG4gIHQxMyArPSB2ICogYjM7XG4gIHQxNCArPSB2ICogYjQ7XG4gIHQxNSArPSB2ICogYjU7XG4gIHQxNiArPSB2ICogYjY7XG4gIHQxNyArPSB2ICogYjc7XG4gIHQxOCArPSB2ICogYjg7XG4gIHQxOSArPSB2ICogYjk7XG4gIHQyMCArPSB2ICogYjEwO1xuICB0MjEgKz0gdiAqIGIxMTtcbiAgdDIyICs9IHYgKiBiMTI7XG4gIHQyMyArPSB2ICogYjEzO1xuICB0MjQgKz0gdiAqIGIxNDtcbiAgdDI1ICs9IHYgKiBiMTU7XG4gIHYgPSBhWzExXTtcbiAgdDExICs9IHYgKiBiMDtcbiAgdDEyICs9IHYgKiBiMTtcbiAgdDEzICs9IHYgKiBiMjtcbiAgdDE0ICs9IHYgKiBiMztcbiAgdDE1ICs9IHYgKiBiNDtcbiAgdDE2ICs9IHYgKiBiNTtcbiAgdDE3ICs9IHYgKiBiNjtcbiAgdDE4ICs9IHYgKiBiNztcbiAgdDE5ICs9IHYgKiBiODtcbiAgdDIwICs9IHYgKiBiOTtcbiAgdDIxICs9IHYgKiBiMTA7XG4gIHQyMiArPSB2ICogYjExO1xuICB0MjMgKz0gdiAqIGIxMjtcbiAgdDI0ICs9IHYgKiBiMTM7XG4gIHQyNSArPSB2ICogYjE0O1xuICB0MjYgKz0gdiAqIGIxNTtcbiAgdiA9IGFbMTJdO1xuICB0MTIgKz0gdiAqIGIwO1xuICB0MTMgKz0gdiAqIGIxO1xuICB0MTQgKz0gdiAqIGIyO1xuICB0MTUgKz0gdiAqIGIzO1xuICB0MTYgKz0gdiAqIGI0O1xuICB0MTcgKz0gdiAqIGI1O1xuICB0MTggKz0gdiAqIGI2O1xuICB0MTkgKz0gdiAqIGI3O1xuICB0MjAgKz0gdiAqIGI4O1xuICB0MjEgKz0gdiAqIGI5O1xuICB0MjIgKz0gdiAqIGIxMDtcbiAgdDIzICs9IHYgKiBiMTE7XG4gIHQyNCArPSB2ICogYjEyO1xuICB0MjUgKz0gdiAqIGIxMztcbiAgdDI2ICs9IHYgKiBiMTQ7XG4gIHQyNyArPSB2ICogYjE1O1xuICB2ID0gYVsxM107XG4gIHQxMyArPSB2ICogYjA7XG4gIHQxNCArPSB2ICogYjE7XG4gIHQxNSArPSB2ICogYjI7XG4gIHQxNiArPSB2ICogYjM7XG4gIHQxNyArPSB2ICogYjQ7XG4gIHQxOCArPSB2ICogYjU7XG4gIHQxOSArPSB2ICogYjY7XG4gIHQyMCArPSB2ICogYjc7XG4gIHQyMSArPSB2ICogYjg7XG4gIHQyMiArPSB2ICogYjk7XG4gIHQyMyArPSB2ICogYjEwO1xuICB0MjQgKz0gdiAqIGIxMTtcbiAgdDI1ICs9IHYgKiBiMTI7XG4gIHQyNiArPSB2ICogYjEzO1xuICB0MjcgKz0gdiAqIGIxNDtcbiAgdDI4ICs9IHYgKiBiMTU7XG4gIHYgPSBhWzE0XTtcbiAgdDE0ICs9IHYgKiBiMDtcbiAgdDE1ICs9IHYgKiBiMTtcbiAgdDE2ICs9IHYgKiBiMjtcbiAgdDE3ICs9IHYgKiBiMztcbiAgdDE4ICs9IHYgKiBiNDtcbiAgdDE5ICs9IHYgKiBiNTtcbiAgdDIwICs9IHYgKiBiNjtcbiAgdDIxICs9IHYgKiBiNztcbiAgdDIyICs9IHYgKiBiODtcbiAgdDIzICs9IHYgKiBiOTtcbiAgdDI0ICs9IHYgKiBiMTA7XG4gIHQyNSArPSB2ICogYjExO1xuICB0MjYgKz0gdiAqIGIxMjtcbiAgdDI3ICs9IHYgKiBiMTM7XG4gIHQyOCArPSB2ICogYjE0O1xuICB0MjkgKz0gdiAqIGIxNTtcbiAgdiA9IGFbMTVdO1xuICB0MTUgKz0gdiAqIGIwO1xuICB0MTYgKz0gdiAqIGIxO1xuICB0MTcgKz0gdiAqIGIyO1xuICB0MTggKz0gdiAqIGIzO1xuICB0MTkgKz0gdiAqIGI0O1xuICB0MjAgKz0gdiAqIGI1O1xuICB0MjEgKz0gdiAqIGI2O1xuICB0MjIgKz0gdiAqIGI3O1xuICB0MjMgKz0gdiAqIGI4O1xuICB0MjQgKz0gdiAqIGI5O1xuICB0MjUgKz0gdiAqIGIxMDtcbiAgdDI2ICs9IHYgKiBiMTE7XG4gIHQyNyArPSB2ICogYjEyO1xuICB0MjggKz0gdiAqIGIxMztcbiAgdDI5ICs9IHYgKiBiMTQ7XG4gIHQzMCArPSB2ICogYjE1O1xuXG4gIHQwICArPSAzOCAqIHQxNjtcbiAgdDEgICs9IDM4ICogdDE3O1xuICB0MiAgKz0gMzggKiB0MTg7XG4gIHQzICArPSAzOCAqIHQxOTtcbiAgdDQgICs9IDM4ICogdDIwO1xuICB0NSAgKz0gMzggKiB0MjE7XG4gIHQ2ICArPSAzOCAqIHQyMjtcbiAgdDcgICs9IDM4ICogdDIzO1xuICB0OCAgKz0gMzggKiB0MjQ7XG4gIHQ5ICArPSAzOCAqIHQyNTtcbiAgdDEwICs9IDM4ICogdDI2O1xuICB0MTEgKz0gMzggKiB0Mjc7XG4gIHQxMiArPSAzOCAqIHQyODtcbiAgdDEzICs9IDM4ICogdDI5O1xuICB0MTQgKz0gMzggKiB0MzA7XG4gIC8vIHQxNSBsZWZ0IGFzIGlzXG5cbiAgLy8gZmlyc3QgY2FyXG4gIGMgPSAxO1xuICB2ID0gIHQwICsgYyArIDY1NTM1OyBjID0gTWF0aC5mbG9vcih2IC8gNjU1MzYpOyAgdDAgPSB2IC0gYyAqIDY1NTM2O1xuICB2ID0gIHQxICsgYyArIDY1NTM1OyBjID0gTWF0aC5mbG9vcih2IC8gNjU1MzYpOyAgdDEgPSB2IC0gYyAqIDY1NTM2O1xuICB2ID0gIHQyICsgYyArIDY1NTM1OyBjID0gTWF0aC5mbG9vcih2IC8gNjU1MzYpOyAgdDIgPSB2IC0gYyAqIDY1NTM2O1xuICB2ID0gIHQzICsgYyArIDY1NTM1OyBjID0gTWF0aC5mbG9vcih2IC8gNjU1MzYpOyAgdDMgPSB2IC0gYyAqIDY1NTM2O1xuICB2ID0gIHQ0ICsgYyArIDY1NTM1OyBjID0gTWF0aC5mbG9vcih2IC8gNjU1MzYpOyAgdDQgPSB2IC0gYyAqIDY1NTM2O1xuICB2ID0gIHQ1ICsgYyArIDY1NTM1OyBjID0gTWF0aC5mbG9vcih2IC8gNjU1MzYpOyAgdDUgPSB2IC0gYyAqIDY1NTM2O1xuICB2ID0gIHQ2ICsgYyArIDY1NTM1OyBjID0gTWF0aC5mbG9vcih2IC8gNjU1MzYpOyAgdDYgPSB2IC0gYyAqIDY1NTM2O1xuICB2ID0gIHQ3ICsgYyArIDY1NTM1OyBjID0gTWF0aC5mbG9vcih2IC8gNjU1MzYpOyAgdDcgPSB2IC0gYyAqIDY1NTM2O1xuICB2ID0gIHQ4ICsgYyArIDY1NTM1OyBjID0gTWF0aC5mbG9vcih2IC8gNjU1MzYpOyAgdDggPSB2IC0gYyAqIDY1NTM2O1xuICB2ID0gIHQ5ICsgYyArIDY1NTM1OyBjID0gTWF0aC5mbG9vcih2IC8gNjU1MzYpOyAgdDkgPSB2IC0gYyAqIDY1NTM2O1xuICB2ID0gdDEwICsgYyArIDY1NTM1OyBjID0gTWF0aC5mbG9vcih2IC8gNjU1MzYpOyB0MTAgPSB2IC0gYyAqIDY1NTM2O1xuICB2ID0gdDExICsgYyArIDY1NTM1OyBjID0gTWF0aC5mbG9vcih2IC8gNjU1MzYpOyB0MTEgPSB2IC0gYyAqIDY1NTM2O1xuICB2ID0gdDEyICsgYyArIDY1NTM1OyBjID0gTWF0aC5mbG9vcih2IC8gNjU1MzYpOyB0MTIgPSB2IC0gYyAqIDY1NTM2O1xuICB2ID0gdDEzICsgYyArIDY1NTM1OyBjID0gTWF0aC5mbG9vcih2IC8gNjU1MzYpOyB0MTMgPSB2IC0gYyAqIDY1NTM2O1xuICB2ID0gdDE0ICsgYyArIDY1NTM1OyBjID0gTWF0aC5mbG9vcih2IC8gNjU1MzYpOyB0MTQgPSB2IC0gYyAqIDY1NTM2O1xuICB2ID0gdDE1ICsgYyArIDY1NTM1OyBjID0gTWF0aC5mbG9vcih2IC8gNjU1MzYpOyB0MTUgPSB2IC0gYyAqIDY1NTM2O1xuICB0MCArPSBjLTEgKyAzNyAqIChjLTEpO1xuXG4gIC8vIHNlY29uZCBjYXJcbiAgYyA9IDE7XG4gIHYgPSAgdDAgKyBjICsgNjU1MzU7IGMgPSBNYXRoLmZsb29yKHYgLyA2NTUzNik7ICB0MCA9IHYgLSBjICogNjU1MzY7XG4gIHYgPSAgdDEgKyBjICsgNjU1MzU7IGMgPSBNYXRoLmZsb29yKHYgLyA2NTUzNik7ICB0MSA9IHYgLSBjICogNjU1MzY7XG4gIHYgPSAgdDIgKyBjICsgNjU1MzU7IGMgPSBNYXRoLmZsb29yKHYgLyA2NTUzNik7ICB0MiA9IHYgLSBjICogNjU1MzY7XG4gIHYgPSAgdDMgKyBjICsgNjU1MzU7IGMgPSBNYXRoLmZsb29yKHYgLyA2NTUzNik7ICB0MyA9IHYgLSBjICogNjU1MzY7XG4gIHYgPSAgdDQgKyBjICsgNjU1MzU7IGMgPSBNYXRoLmZsb29yKHYgLyA2NTUzNik7ICB0NCA9IHYgLSBjICogNjU1MzY7XG4gIHYgPSAgdDUgKyBjICsgNjU1MzU7IGMgPSBNYXRoLmZsb29yKHYgLyA2NTUzNik7ICB0NSA9IHYgLSBjICogNjU1MzY7XG4gIHYgPSAgdDYgKyBjICsgNjU1MzU7IGMgPSBNYXRoLmZsb29yKHYgLyA2NTUzNik7ICB0NiA9IHYgLSBjICogNjU1MzY7XG4gIHYgPSAgdDcgKyBjICsgNjU1MzU7IGMgPSBNYXRoLmZsb29yKHYgLyA2NTUzNik7ICB0NyA9IHYgLSBjICogNjU1MzY7XG4gIHYgPSAgdDggKyBjICsgNjU1MzU7IGMgPSBNYXRoLmZsb29yKHYgLyA2NTUzNik7ICB0OCA9IHYgLSBjICogNjU1MzY7XG4gIHYgPSAgdDkgKyBjICsgNjU1MzU7IGMgPSBNYXRoLmZsb29yKHYgLyA2NTUzNik7ICB0OSA9IHYgLSBjICogNjU1MzY7XG4gIHYgPSB0MTAgKyBjICsgNjU1MzU7IGMgPSBNYXRoLmZsb29yKHYgLyA2NTUzNik7IHQxMCA9IHYgLSBjICogNjU1MzY7XG4gIHYgPSB0MTEgKyBjICsgNjU1MzU7IGMgPSBNYXRoLmZsb29yKHYgLyA2NTUzNik7IHQxMSA9IHYgLSBjICogNjU1MzY7XG4gIHYgPSB0MTIgKyBjICsgNjU1MzU7IGMgPSBNYXRoLmZsb29yKHYgLyA2NTUzNik7IHQxMiA9IHYgLSBjICogNjU1MzY7XG4gIHYgPSB0MTMgKyBjICsgNjU1MzU7IGMgPSBNYXRoLmZsb29yKHYgLyA2NTUzNik7IHQxMyA9IHYgLSBjICogNjU1MzY7XG4gIHYgPSB0MTQgKyBjICsgNjU1MzU7IGMgPSBNYXRoLmZsb29yKHYgLyA2NTUzNik7IHQxNCA9IHYgLSBjICogNjU1MzY7XG4gIHYgPSB0MTUgKyBjICsgNjU1MzU7IGMgPSBNYXRoLmZsb29yKHYgLyA2NTUzNik7IHQxNSA9IHYgLSBjICogNjU1MzY7XG4gIHQwICs9IGMtMSArIDM3ICogKGMtMSk7XG5cbiAgb1sgMF0gPSB0MDtcbiAgb1sgMV0gPSB0MTtcbiAgb1sgMl0gPSB0MjtcbiAgb1sgM10gPSB0MztcbiAgb1sgNF0gPSB0NDtcbiAgb1sgNV0gPSB0NTtcbiAgb1sgNl0gPSB0NjtcbiAgb1sgN10gPSB0NztcbiAgb1sgOF0gPSB0ODtcbiAgb1sgOV0gPSB0OTtcbiAgb1sxMF0gPSB0MTA7XG4gIG9bMTFdID0gdDExO1xuICBvWzEyXSA9IHQxMjtcbiAgb1sxM10gPSB0MTM7XG4gIG9bMTRdID0gdDE0O1xuICBvWzE1XSA9IHQxNTtcbn1cblxuZnVuY3Rpb24gUyhvLCBhKSB7XG4gIE0obywgYSwgYSk7XG59XG5cbmZ1bmN0aW9uIGludjI1NTE5KG8sIGkpIHtcbiAgdmFyIGMgPSBnZigpO1xuICB2YXIgYTtcbiAgZm9yIChhID0gMDsgYSA8IDE2OyBhKyspIGNbYV0gPSBpW2FdO1xuICBmb3IgKGEgPSAyNTM7IGEgPj0gMDsgYS0tKSB7XG4gICAgUyhjLCBjKTtcbiAgICBpZihhICE9PSAyICYmIGEgIT09IDQpIE0oYywgYywgaSk7XG4gIH1cbiAgZm9yIChhID0gMDsgYSA8IDE2OyBhKyspIG9bYV0gPSBjW2FdO1xufVxuXG5mdW5jdGlvbiBwb3cyNTIzKG8sIGkpIHtcbiAgdmFyIGMgPSBnZigpO1xuICB2YXIgYTtcbiAgZm9yIChhID0gMDsgYSA8IDE2OyBhKyspIGNbYV0gPSBpW2FdO1xuICBmb3IgKGEgPSAyNTA7IGEgPj0gMDsgYS0tKSB7XG4gICAgICBTKGMsIGMpO1xuICAgICAgaWYoYSAhPT0gMSkgTShjLCBjLCBpKTtcbiAgfVxuICBmb3IgKGEgPSAwOyBhIDwgMTY7IGErKykgb1thXSA9IGNbYV07XG59XG5cbmZ1bmN0aW9uIGNyeXB0b19zY2FsYXJtdWx0KHEsIG4sIHApIHtcbiAgdmFyIHogPSBuZXcgVWludDhBcnJheSgzMik7XG4gIHZhciB4ID0gbmV3IEZsb2F0NjRBcnJheSg4MCksIHIsIGk7XG4gIHZhciBhID0gZ2YoKSwgYiA9IGdmKCksIGMgPSBnZigpLFxuICAgICAgZCA9IGdmKCksIGUgPSBnZigpLCBmID0gZ2YoKTtcbiAgZm9yIChpID0gMDsgaSA8IDMxOyBpKyspIHpbaV0gPSBuW2ldO1xuICB6WzMxXT0oblszMV0mMTI3KXw2NDtcbiAgelswXSY9MjQ4O1xuICB1bnBhY2syNTUxOSh4LHApO1xuICBmb3IgKGkgPSAwOyBpIDwgMTY7IGkrKykge1xuICAgIGJbaV09eFtpXTtcbiAgICBkW2ldPWFbaV09Y1tpXT0wO1xuICB9XG4gIGFbMF09ZFswXT0xO1xuICBmb3IgKGk9MjU0OyBpPj0wOyAtLWkpIHtcbiAgICByPSh6W2k+Pj4zXT4+PihpJjcpKSYxO1xuICAgIHNlbDI1NTE5KGEsYixyKTtcbiAgICBzZWwyNTUxOShjLGQscik7XG4gICAgQShlLGEsYyk7XG4gICAgWihhLGEsYyk7XG4gICAgQShjLGIsZCk7XG4gICAgWihiLGIsZCk7XG4gICAgUyhkLGUpO1xuICAgIFMoZixhKTtcbiAgICBNKGEsYyxhKTtcbiAgICBNKGMsYixlKTtcbiAgICBBKGUsYSxjKTtcbiAgICBaKGEsYSxjKTtcbiAgICBTKGIsYSk7XG4gICAgWihjLGQsZik7XG4gICAgTShhLGMsXzEyMTY2NSk7XG4gICAgQShhLGEsZCk7XG4gICAgTShjLGMsYSk7XG4gICAgTShhLGQsZik7XG4gICAgTShkLGIseCk7XG4gICAgUyhiLGUpO1xuICAgIHNlbDI1NTE5KGEsYixyKTtcbiAgICBzZWwyNTUxOShjLGQscik7XG4gIH1cbiAgZm9yIChpID0gMDsgaSA8IDE2OyBpKyspIHtcbiAgICB4W2krMTZdPWFbaV07XG4gICAgeFtpKzMyXT1jW2ldO1xuICAgIHhbaSs0OF09YltpXTtcbiAgICB4W2krNjRdPWRbaV07XG4gIH1cbiAgdmFyIHgzMiA9IHguc3ViYXJyYXkoMzIpO1xuICB2YXIgeDE2ID0geC5zdWJhcnJheSgxNik7XG4gIGludjI1NTE5KHgzMix4MzIpO1xuICBNKHgxNix4MTYseDMyKTtcbiAgcGFjazI1NTE5KHEseDE2KTtcbiAgcmV0dXJuIDA7XG59XG5cbmZ1bmN0aW9uIGNyeXB0b19zY2FsYXJtdWx0X2Jhc2UocSwgbikge1xuICByZXR1cm4gY3J5cHRvX3NjYWxhcm11bHQocSwgbiwgXzkpO1xufVxuXG5mdW5jdGlvbiBjcnlwdG9fYm94X2tleXBhaXIoeSwgeCkge1xuICByYW5kb21ieXRlcyh4LCAzMik7XG4gIHJldHVybiBjcnlwdG9fc2NhbGFybXVsdF9iYXNlKHksIHgpO1xufVxuXG5mdW5jdGlvbiBjcnlwdG9fYm94X2JlZm9yZW5tKGssIHksIHgpIHtcbiAgdmFyIHMgPSBuZXcgVWludDhBcnJheSgzMik7XG4gIGNyeXB0b19zY2FsYXJtdWx0KHMsIHgsIHkpO1xuICByZXR1cm4gY3J5cHRvX2NvcmVfaHNhbHNhMjAoaywgXzAsIHMsIHNpZ21hKTtcbn1cblxudmFyIGNyeXB0b19ib3hfYWZ0ZXJubSA9IGNyeXB0b19zZWNyZXRib3g7XG52YXIgY3J5cHRvX2JveF9vcGVuX2FmdGVybm0gPSBjcnlwdG9fc2VjcmV0Ym94X29wZW47XG5cbmZ1bmN0aW9uIGNyeXB0b19ib3goYywgbSwgZCwgbiwgeSwgeCkge1xuICB2YXIgayA9IG5ldyBVaW50OEFycmF5KDMyKTtcbiAgY3J5cHRvX2JveF9iZWZvcmVubShrLCB5LCB4KTtcbiAgcmV0dXJuIGNyeXB0b19ib3hfYWZ0ZXJubShjLCBtLCBkLCBuLCBrKTtcbn1cblxuZnVuY3Rpb24gY3J5cHRvX2JveF9vcGVuKG0sIGMsIGQsIG4sIHksIHgpIHtcbiAgdmFyIGsgPSBuZXcgVWludDhBcnJheSgzMik7XG4gIGNyeXB0b19ib3hfYmVmb3Jlbm0oaywgeSwgeCk7XG4gIHJldHVybiBjcnlwdG9fYm94X29wZW5fYWZ0ZXJubShtLCBjLCBkLCBuLCBrKTtcbn1cblxudmFyIEsgPSBbXG4gIDB4NDI4YTJmOTgsIDB4ZDcyOGFlMjIsIDB4NzEzNzQ0OTEsIDB4MjNlZjY1Y2QsXG4gIDB4YjVjMGZiY2YsIDB4ZWM0ZDNiMmYsIDB4ZTliNWRiYTUsIDB4ODE4OWRiYmMsXG4gIDB4Mzk1NmMyNWIsIDB4ZjM0OGI1MzgsIDB4NTlmMTExZjEsIDB4YjYwNWQwMTksXG4gIDB4OTIzZjgyYTQsIDB4YWYxOTRmOWIsIDB4YWIxYzVlZDUsIDB4ZGE2ZDgxMTgsXG4gIDB4ZDgwN2FhOTgsIDB4YTMwMzAyNDIsIDB4MTI4MzViMDEsIDB4NDU3MDZmYmUsXG4gIDB4MjQzMTg1YmUsIDB4NGVlNGIyOGMsIDB4NTUwYzdkYzMsIDB4ZDVmZmI0ZTIsXG4gIDB4NzJiZTVkNzQsIDB4ZjI3Yjg5NmYsIDB4ODBkZWIxZmUsIDB4M2IxNjk2YjEsXG4gIDB4OWJkYzA2YTcsIDB4MjVjNzEyMzUsIDB4YzE5YmYxNzQsIDB4Y2Y2OTI2OTQsXG4gIDB4ZTQ5YjY5YzEsIDB4OWVmMTRhZDIsIDB4ZWZiZTQ3ODYsIDB4Mzg0ZjI1ZTMsXG4gIDB4MGZjMTlkYzYsIDB4OGI4Y2Q1YjUsIDB4MjQwY2ExY2MsIDB4NzdhYzljNjUsXG4gIDB4MmRlOTJjNmYsIDB4NTkyYjAyNzUsIDB4NGE3NDg0YWEsIDB4NmVhNmU0ODMsXG4gIDB4NWNiMGE5ZGMsIDB4YmQ0MWZiZDQsIDB4NzZmOTg4ZGEsIDB4ODMxMTUzYjUsXG4gIDB4OTgzZTUxNTIsIDB4ZWU2NmRmYWIsIDB4YTgzMWM2NmQsIDB4MmRiNDMyMTAsXG4gIDB4YjAwMzI3YzgsIDB4OThmYjIxM2YsIDB4YmY1OTdmYzcsIDB4YmVlZjBlZTQsXG4gIDB4YzZlMDBiZjMsIDB4M2RhODhmYzIsIDB4ZDVhNzkxNDcsIDB4OTMwYWE3MjUsXG4gIDB4MDZjYTYzNTEsIDB4ZTAwMzgyNmYsIDB4MTQyOTI5NjcsIDB4MGEwZTZlNzAsXG4gIDB4MjdiNzBhODUsIDB4NDZkMjJmZmMsIDB4MmUxYjIxMzgsIDB4NWMyNmM5MjYsXG4gIDB4NGQyYzZkZmMsIDB4NWFjNDJhZWQsIDB4NTMzODBkMTMsIDB4OWQ5NWIzZGYsXG4gIDB4NjUwYTczNTQsIDB4OGJhZjYzZGUsIDB4NzY2YTBhYmIsIDB4M2M3N2IyYTgsXG4gIDB4ODFjMmM5MmUsIDB4NDdlZGFlZTYsIDB4OTI3MjJjODUsIDB4MTQ4MjM1M2IsXG4gIDB4YTJiZmU4YTEsIDB4NGNmMTAzNjQsIDB4YTgxYTY2NGIsIDB4YmM0MjMwMDEsXG4gIDB4YzI0YjhiNzAsIDB4ZDBmODk3OTEsIDB4Yzc2YzUxYTMsIDB4MDY1NGJlMzAsXG4gIDB4ZDE5MmU4MTksIDB4ZDZlZjUyMTgsIDB4ZDY5OTA2MjQsIDB4NTU2NWE5MTAsXG4gIDB4ZjQwZTM1ODUsIDB4NTc3MTIwMmEsIDB4MTA2YWEwNzAsIDB4MzJiYmQxYjgsXG4gIDB4MTlhNGMxMTYsIDB4YjhkMmQwYzgsIDB4MWUzNzZjMDgsIDB4NTE0MWFiNTMsXG4gIDB4Mjc0ODc3NGMsIDB4ZGY4ZWViOTksIDB4MzRiMGJjYjUsIDB4ZTE5YjQ4YTgsXG4gIDB4MzkxYzBjYjMsIDB4YzVjOTVhNjMsIDB4NGVkOGFhNGEsIDB4ZTM0MThhY2IsXG4gIDB4NWI5Y2NhNGYsIDB4Nzc2M2UzNzMsIDB4NjgyZTZmZjMsIDB4ZDZiMmI4YTMsXG4gIDB4NzQ4ZjgyZWUsIDB4NWRlZmIyZmMsIDB4NzhhNTYzNmYsIDB4NDMxNzJmNjAsXG4gIDB4ODRjODc4MTQsIDB4YTFmMGFiNzIsIDB4OGNjNzAyMDgsIDB4MWE2NDM5ZWMsXG4gIDB4OTBiZWZmZmEsIDB4MjM2MzFlMjgsIDB4YTQ1MDZjZWIsIDB4ZGU4MmJkZTksXG4gIDB4YmVmOWEzZjcsIDB4YjJjNjc5MTUsIDB4YzY3MTc4ZjIsIDB4ZTM3MjUzMmIsXG4gIDB4Y2EyNzNlY2UsIDB4ZWEyNjYxOWMsIDB4ZDE4NmI4YzcsIDB4MjFjMGMyMDcsXG4gIDB4ZWFkYTdkZDYsIDB4Y2RlMGViMWUsIDB4ZjU3ZDRmN2YsIDB4ZWU2ZWQxNzgsXG4gIDB4MDZmMDY3YWEsIDB4NzIxNzZmYmEsIDB4MGE2MzdkYzUsIDB4YTJjODk4YTYsXG4gIDB4MTEzZjk4MDQsIDB4YmVmOTBkYWUsIDB4MWI3MTBiMzUsIDB4MTMxYzQ3MWIsXG4gIDB4MjhkYjc3ZjUsIDB4MjMwNDdkODQsIDB4MzJjYWFiN2IsIDB4NDBjNzI0OTMsXG4gIDB4M2M5ZWJlMGEsIDB4MTVjOWJlYmMsIDB4NDMxZDY3YzQsIDB4OWMxMDBkNGMsXG4gIDB4NGNjNWQ0YmUsIDB4Y2IzZTQyYjYsIDB4NTk3ZjI5OWMsIDB4ZmM2NTdlMmEsXG4gIDB4NWZjYjZmYWIsIDB4M2FkNmZhZWMsIDB4NmM0NDE5OGMsIDB4NGE0NzU4MTdcbl07XG5cbmZ1bmN0aW9uIGNyeXB0b19oYXNoYmxvY2tzX2hsKGhoLCBobCwgbSwgbikge1xuICB2YXIgd2ggPSBuZXcgSW50MzJBcnJheSgxNiksIHdsID0gbmV3IEludDMyQXJyYXkoMTYpLFxuICAgICAgYmgwLCBiaDEsIGJoMiwgYmgzLCBiaDQsIGJoNSwgYmg2LCBiaDcsXG4gICAgICBibDAsIGJsMSwgYmwyLCBibDMsIGJsNCwgYmw1LCBibDYsIGJsNyxcbiAgICAgIHRoLCB0bCwgaSwgaiwgaCwgbCwgYSwgYiwgYywgZDtcblxuICB2YXIgYWgwID0gaGhbMF0sXG4gICAgICBhaDEgPSBoaFsxXSxcbiAgICAgIGFoMiA9IGhoWzJdLFxuICAgICAgYWgzID0gaGhbM10sXG4gICAgICBhaDQgPSBoaFs0XSxcbiAgICAgIGFoNSA9IGhoWzVdLFxuICAgICAgYWg2ID0gaGhbNl0sXG4gICAgICBhaDcgPSBoaFs3XSxcblxuICAgICAgYWwwID0gaGxbMF0sXG4gICAgICBhbDEgPSBobFsxXSxcbiAgICAgIGFsMiA9IGhsWzJdLFxuICAgICAgYWwzID0gaGxbM10sXG4gICAgICBhbDQgPSBobFs0XSxcbiAgICAgIGFsNSA9IGhsWzVdLFxuICAgICAgYWw2ID0gaGxbNl0sXG4gICAgICBhbDcgPSBobFs3XTtcblxuICB2YXIgcG9zID0gMDtcbiAgd2hpbGUgKG4gPj0gMTI4KSB7XG4gICAgZm9yIChpID0gMDsgaSA8IDE2OyBpKyspIHtcbiAgICAgIGogPSA4ICogaSArIHBvcztcbiAgICAgIHdoW2ldID0gKG1baiswXSA8PCAyNCkgfCAobVtqKzFdIDw8IDE2KSB8IChtW2orMl0gPDwgOCkgfCBtW2orM107XG4gICAgICB3bFtpXSA9IChtW2orNF0gPDwgMjQpIHwgKG1bais1XSA8PCAxNikgfCAobVtqKzZdIDw8IDgpIHwgbVtqKzddO1xuICAgIH1cbiAgICBmb3IgKGkgPSAwOyBpIDwgODA7IGkrKykge1xuICAgICAgYmgwID0gYWgwO1xuICAgICAgYmgxID0gYWgxO1xuICAgICAgYmgyID0gYWgyO1xuICAgICAgYmgzID0gYWgzO1xuICAgICAgYmg0ID0gYWg0O1xuICAgICAgYmg1ID0gYWg1O1xuICAgICAgYmg2ID0gYWg2O1xuICAgICAgYmg3ID0gYWg3O1xuXG4gICAgICBibDAgPSBhbDA7XG4gICAgICBibDEgPSBhbDE7XG4gICAgICBibDIgPSBhbDI7XG4gICAgICBibDMgPSBhbDM7XG4gICAgICBibDQgPSBhbDQ7XG4gICAgICBibDUgPSBhbDU7XG4gICAgICBibDYgPSBhbDY7XG4gICAgICBibDcgPSBhbDc7XG5cbiAgICAgIC8vIGFkZFxuICAgICAgaCA9IGFoNztcbiAgICAgIGwgPSBhbDc7XG5cbiAgICAgIGEgPSBsICYgMHhmZmZmOyBiID0gbCA+Pj4gMTY7XG4gICAgICBjID0gaCAmIDB4ZmZmZjsgZCA9IGggPj4+IDE2O1xuXG4gICAgICAvLyBTaWdtYTFcbiAgICAgIGggPSAoKGFoNCA+Pj4gMTQpIHwgKGFsNCA8PCAoMzItMTQpKSkgXiAoKGFoNCA+Pj4gMTgpIHwgKGFsNCA8PCAoMzItMTgpKSkgXiAoKGFsNCA+Pj4gKDQxLTMyKSkgfCAoYWg0IDw8ICgzMi0oNDEtMzIpKSkpO1xuICAgICAgbCA9ICgoYWw0ID4+PiAxNCkgfCAoYWg0IDw8ICgzMi0xNCkpKSBeICgoYWw0ID4+PiAxOCkgfCAoYWg0IDw8ICgzMi0xOCkpKSBeICgoYWg0ID4+PiAoNDEtMzIpKSB8IChhbDQgPDwgKDMyLSg0MS0zMikpKSk7XG5cbiAgICAgIGEgKz0gbCAmIDB4ZmZmZjsgYiArPSBsID4+PiAxNjtcbiAgICAgIGMgKz0gaCAmIDB4ZmZmZjsgZCArPSBoID4+PiAxNjtcblxuICAgICAgLy8gQ2hcbiAgICAgIGggPSAoYWg0ICYgYWg1KSBeICh+YWg0ICYgYWg2KTtcbiAgICAgIGwgPSAoYWw0ICYgYWw1KSBeICh+YWw0ICYgYWw2KTtcblxuICAgICAgYSArPSBsICYgMHhmZmZmOyBiICs9IGwgPj4+IDE2O1xuICAgICAgYyArPSBoICYgMHhmZmZmOyBkICs9IGggPj4+IDE2O1xuXG4gICAgICAvLyBLXG4gICAgICBoID0gS1tpKjJdO1xuICAgICAgbCA9IEtbaSoyKzFdO1xuXG4gICAgICBhICs9IGwgJiAweGZmZmY7IGIgKz0gbCA+Pj4gMTY7XG4gICAgICBjICs9IGggJiAweGZmZmY7IGQgKz0gaCA+Pj4gMTY7XG5cbiAgICAgIC8vIHdcbiAgICAgIGggPSB3aFtpJTE2XTtcbiAgICAgIGwgPSB3bFtpJTE2XTtcblxuICAgICAgYSArPSBsICYgMHhmZmZmOyBiICs9IGwgPj4+IDE2O1xuICAgICAgYyArPSBoICYgMHhmZmZmOyBkICs9IGggPj4+IDE2O1xuXG4gICAgICBiICs9IGEgPj4+IDE2O1xuICAgICAgYyArPSBiID4+PiAxNjtcbiAgICAgIGQgKz0gYyA+Pj4gMTY7XG5cbiAgICAgIHRoID0gYyAmIDB4ZmZmZiB8IGQgPDwgMTY7XG4gICAgICB0bCA9IGEgJiAweGZmZmYgfCBiIDw8IDE2O1xuXG4gICAgICAvLyBhZGRcbiAgICAgIGggPSB0aDtcbiAgICAgIGwgPSB0bDtcblxuICAgICAgYSA9IGwgJiAweGZmZmY7IGIgPSBsID4+PiAxNjtcbiAgICAgIGMgPSBoICYgMHhmZmZmOyBkID0gaCA+Pj4gMTY7XG5cbiAgICAgIC8vIFNpZ21hMFxuICAgICAgaCA9ICgoYWgwID4+PiAyOCkgfCAoYWwwIDw8ICgzMi0yOCkpKSBeICgoYWwwID4+PiAoMzQtMzIpKSB8IChhaDAgPDwgKDMyLSgzNC0zMikpKSkgXiAoKGFsMCA+Pj4gKDM5LTMyKSkgfCAoYWgwIDw8ICgzMi0oMzktMzIpKSkpO1xuICAgICAgbCA9ICgoYWwwID4+PiAyOCkgfCAoYWgwIDw8ICgzMi0yOCkpKSBeICgoYWgwID4+PiAoMzQtMzIpKSB8IChhbDAgPDwgKDMyLSgzNC0zMikpKSkgXiAoKGFoMCA+Pj4gKDM5LTMyKSkgfCAoYWwwIDw8ICgzMi0oMzktMzIpKSkpO1xuXG4gICAgICBhICs9IGwgJiAweGZmZmY7IGIgKz0gbCA+Pj4gMTY7XG4gICAgICBjICs9IGggJiAweGZmZmY7IGQgKz0gaCA+Pj4gMTY7XG5cbiAgICAgIC8vIE1halxuICAgICAgaCA9IChhaDAgJiBhaDEpIF4gKGFoMCAmIGFoMikgXiAoYWgxICYgYWgyKTtcbiAgICAgIGwgPSAoYWwwICYgYWwxKSBeIChhbDAgJiBhbDIpIF4gKGFsMSAmIGFsMik7XG5cbiAgICAgIGEgKz0gbCAmIDB4ZmZmZjsgYiArPSBsID4+PiAxNjtcbiAgICAgIGMgKz0gaCAmIDB4ZmZmZjsgZCArPSBoID4+PiAxNjtcblxuICAgICAgYiArPSBhID4+PiAxNjtcbiAgICAgIGMgKz0gYiA+Pj4gMTY7XG4gICAgICBkICs9IGMgPj4+IDE2O1xuXG4gICAgICBiaDcgPSAoYyAmIDB4ZmZmZikgfCAoZCA8PCAxNik7XG4gICAgICBibDcgPSAoYSAmIDB4ZmZmZikgfCAoYiA8PCAxNik7XG5cbiAgICAgIC8vIGFkZFxuICAgICAgaCA9IGJoMztcbiAgICAgIGwgPSBibDM7XG5cbiAgICAgIGEgPSBsICYgMHhmZmZmOyBiID0gbCA+Pj4gMTY7XG4gICAgICBjID0gaCAmIDB4ZmZmZjsgZCA9IGggPj4+IDE2O1xuXG4gICAgICBoID0gdGg7XG4gICAgICBsID0gdGw7XG5cbiAgICAgIGEgKz0gbCAmIDB4ZmZmZjsgYiArPSBsID4+PiAxNjtcbiAgICAgIGMgKz0gaCAmIDB4ZmZmZjsgZCArPSBoID4+PiAxNjtcblxuICAgICAgYiArPSBhID4+PiAxNjtcbiAgICAgIGMgKz0gYiA+Pj4gMTY7XG4gICAgICBkICs9IGMgPj4+IDE2O1xuXG4gICAgICBiaDMgPSAoYyAmIDB4ZmZmZikgfCAoZCA8PCAxNik7XG4gICAgICBibDMgPSAoYSAmIDB4ZmZmZikgfCAoYiA8PCAxNik7XG5cbiAgICAgIGFoMSA9IGJoMDtcbiAgICAgIGFoMiA9IGJoMTtcbiAgICAgIGFoMyA9IGJoMjtcbiAgICAgIGFoNCA9IGJoMztcbiAgICAgIGFoNSA9IGJoNDtcbiAgICAgIGFoNiA9IGJoNTtcbiAgICAgIGFoNyA9IGJoNjtcbiAgICAgIGFoMCA9IGJoNztcblxuICAgICAgYWwxID0gYmwwO1xuICAgICAgYWwyID0gYmwxO1xuICAgICAgYWwzID0gYmwyO1xuICAgICAgYWw0ID0gYmwzO1xuICAgICAgYWw1ID0gYmw0O1xuICAgICAgYWw2ID0gYmw1O1xuICAgICAgYWw3ID0gYmw2O1xuICAgICAgYWwwID0gYmw3O1xuXG4gICAgICBpZiAoaSUxNiA9PT0gMTUpIHtcbiAgICAgICAgZm9yIChqID0gMDsgaiA8IDE2OyBqKyspIHtcbiAgICAgICAgICAvLyBhZGRcbiAgICAgICAgICBoID0gd2hbal07XG4gICAgICAgICAgbCA9IHdsW2pdO1xuXG4gICAgICAgICAgYSA9IGwgJiAweGZmZmY7IGIgPSBsID4+PiAxNjtcbiAgICAgICAgICBjID0gaCAmIDB4ZmZmZjsgZCA9IGggPj4+IDE2O1xuXG4gICAgICAgICAgaCA9IHdoWyhqKzkpJTE2XTtcbiAgICAgICAgICBsID0gd2xbKGorOSklMTZdO1xuXG4gICAgICAgICAgYSArPSBsICYgMHhmZmZmOyBiICs9IGwgPj4+IDE2O1xuICAgICAgICAgIGMgKz0gaCAmIDB4ZmZmZjsgZCArPSBoID4+PiAxNjtcblxuICAgICAgICAgIC8vIHNpZ21hMFxuICAgICAgICAgIHRoID0gd2hbKGorMSklMTZdO1xuICAgICAgICAgIHRsID0gd2xbKGorMSklMTZdO1xuICAgICAgICAgIGggPSAoKHRoID4+PiAxKSB8ICh0bCA8PCAoMzItMSkpKSBeICgodGggPj4+IDgpIHwgKHRsIDw8ICgzMi04KSkpIF4gKHRoID4+PiA3KTtcbiAgICAgICAgICBsID0gKCh0bCA+Pj4gMSkgfCAodGggPDwgKDMyLTEpKSkgXiAoKHRsID4+PiA4KSB8ICh0aCA8PCAoMzItOCkpKSBeICgodGwgPj4+IDcpIHwgKHRoIDw8ICgzMi03KSkpO1xuXG4gICAgICAgICAgYSArPSBsICYgMHhmZmZmOyBiICs9IGwgPj4+IDE2O1xuICAgICAgICAgIGMgKz0gaCAmIDB4ZmZmZjsgZCArPSBoID4+PiAxNjtcblxuICAgICAgICAgIC8vIHNpZ21hMVxuICAgICAgICAgIHRoID0gd2hbKGorMTQpJTE2XTtcbiAgICAgICAgICB0bCA9IHdsWyhqKzE0KSUxNl07XG4gICAgICAgICAgaCA9ICgodGggPj4+IDE5KSB8ICh0bCA8PCAoMzItMTkpKSkgXiAoKHRsID4+PiAoNjEtMzIpKSB8ICh0aCA8PCAoMzItKDYxLTMyKSkpKSBeICh0aCA+Pj4gNik7XG4gICAgICAgICAgbCA9ICgodGwgPj4+IDE5KSB8ICh0aCA8PCAoMzItMTkpKSkgXiAoKHRoID4+PiAoNjEtMzIpKSB8ICh0bCA8PCAoMzItKDYxLTMyKSkpKSBeICgodGwgPj4+IDYpIHwgKHRoIDw8ICgzMi02KSkpO1xuXG4gICAgICAgICAgYSArPSBsICYgMHhmZmZmOyBiICs9IGwgPj4+IDE2O1xuICAgICAgICAgIGMgKz0gaCAmIDB4ZmZmZjsgZCArPSBoID4+PiAxNjtcblxuICAgICAgICAgIGIgKz0gYSA+Pj4gMTY7XG4gICAgICAgICAgYyArPSBiID4+PiAxNjtcbiAgICAgICAgICBkICs9IGMgPj4+IDE2O1xuXG4gICAgICAgICAgd2hbal0gPSAoYyAmIDB4ZmZmZikgfCAoZCA8PCAxNik7XG4gICAgICAgICAgd2xbal0gPSAoYSAmIDB4ZmZmZikgfCAoYiA8PCAxNik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBhZGRcbiAgICBoID0gYWgwO1xuICAgIGwgPSBhbDA7XG5cbiAgICBhID0gbCAmIDB4ZmZmZjsgYiA9IGwgPj4+IDE2O1xuICAgIGMgPSBoICYgMHhmZmZmOyBkID0gaCA+Pj4gMTY7XG5cbiAgICBoID0gaGhbMF07XG4gICAgbCA9IGhsWzBdO1xuXG4gICAgYSArPSBsICYgMHhmZmZmOyBiICs9IGwgPj4+IDE2O1xuICAgIGMgKz0gaCAmIDB4ZmZmZjsgZCArPSBoID4+PiAxNjtcblxuICAgIGIgKz0gYSA+Pj4gMTY7XG4gICAgYyArPSBiID4+PiAxNjtcbiAgICBkICs9IGMgPj4+IDE2O1xuXG4gICAgaGhbMF0gPSBhaDAgPSAoYyAmIDB4ZmZmZikgfCAoZCA8PCAxNik7XG4gICAgaGxbMF0gPSBhbDAgPSAoYSAmIDB4ZmZmZikgfCAoYiA8PCAxNik7XG5cbiAgICBoID0gYWgxO1xuICAgIGwgPSBhbDE7XG5cbiAgICBhID0gbCAmIDB4ZmZmZjsgYiA9IGwgPj4+IDE2O1xuICAgIGMgPSBoICYgMHhmZmZmOyBkID0gaCA+Pj4gMTY7XG5cbiAgICBoID0gaGhbMV07XG4gICAgbCA9IGhsWzFdO1xuXG4gICAgYSArPSBsICYgMHhmZmZmOyBiICs9IGwgPj4+IDE2O1xuICAgIGMgKz0gaCAmIDB4ZmZmZjsgZCArPSBoID4+PiAxNjtcblxuICAgIGIgKz0gYSA+Pj4gMTY7XG4gICAgYyArPSBiID4+PiAxNjtcbiAgICBkICs9IGMgPj4+IDE2O1xuXG4gICAgaGhbMV0gPSBhaDEgPSAoYyAmIDB4ZmZmZikgfCAoZCA8PCAxNik7XG4gICAgaGxbMV0gPSBhbDEgPSAoYSAmIDB4ZmZmZikgfCAoYiA8PCAxNik7XG5cbiAgICBoID0gYWgyO1xuICAgIGwgPSBhbDI7XG5cbiAgICBhID0gbCAmIDB4ZmZmZjsgYiA9IGwgPj4+IDE2O1xuICAgIGMgPSBoICYgMHhmZmZmOyBkID0gaCA+Pj4gMTY7XG5cbiAgICBoID0gaGhbMl07XG4gICAgbCA9IGhsWzJdO1xuXG4gICAgYSArPSBsICYgMHhmZmZmOyBiICs9IGwgPj4+IDE2O1xuICAgIGMgKz0gaCAmIDB4ZmZmZjsgZCArPSBoID4+PiAxNjtcblxuICAgIGIgKz0gYSA+Pj4gMTY7XG4gICAgYyArPSBiID4+PiAxNjtcbiAgICBkICs9IGMgPj4+IDE2O1xuXG4gICAgaGhbMl0gPSBhaDIgPSAoYyAmIDB4ZmZmZikgfCAoZCA8PCAxNik7XG4gICAgaGxbMl0gPSBhbDIgPSAoYSAmIDB4ZmZmZikgfCAoYiA8PCAxNik7XG5cbiAgICBoID0gYWgzO1xuICAgIGwgPSBhbDM7XG5cbiAgICBhID0gbCAmIDB4ZmZmZjsgYiA9IGwgPj4+IDE2O1xuICAgIGMgPSBoICYgMHhmZmZmOyBkID0gaCA+Pj4gMTY7XG5cbiAgICBoID0gaGhbM107XG4gICAgbCA9IGhsWzNdO1xuXG4gICAgYSArPSBsICYgMHhmZmZmOyBiICs9IGwgPj4+IDE2O1xuICAgIGMgKz0gaCAmIDB4ZmZmZjsgZCArPSBoID4+PiAxNjtcblxuICAgIGIgKz0gYSA+Pj4gMTY7XG4gICAgYyArPSBiID4+PiAxNjtcbiAgICBkICs9IGMgPj4+IDE2O1xuXG4gICAgaGhbM10gPSBhaDMgPSAoYyAmIDB4ZmZmZikgfCAoZCA8PCAxNik7XG4gICAgaGxbM10gPSBhbDMgPSAoYSAmIDB4ZmZmZikgfCAoYiA8PCAxNik7XG5cbiAgICBoID0gYWg0O1xuICAgIGwgPSBhbDQ7XG5cbiAgICBhID0gbCAmIDB4ZmZmZjsgYiA9IGwgPj4+IDE2O1xuICAgIGMgPSBoICYgMHhmZmZmOyBkID0gaCA+Pj4gMTY7XG5cbiAgICBoID0gaGhbNF07XG4gICAgbCA9IGhsWzRdO1xuXG4gICAgYSArPSBsICYgMHhmZmZmOyBiICs9IGwgPj4+IDE2O1xuICAgIGMgKz0gaCAmIDB4ZmZmZjsgZCArPSBoID4+PiAxNjtcblxuICAgIGIgKz0gYSA+Pj4gMTY7XG4gICAgYyArPSBiID4+PiAxNjtcbiAgICBkICs9IGMgPj4+IDE2O1xuXG4gICAgaGhbNF0gPSBhaDQgPSAoYyAmIDB4ZmZmZikgfCAoZCA8PCAxNik7XG4gICAgaGxbNF0gPSBhbDQgPSAoYSAmIDB4ZmZmZikgfCAoYiA8PCAxNik7XG5cbiAgICBoID0gYWg1O1xuICAgIGwgPSBhbDU7XG5cbiAgICBhID0gbCAmIDB4ZmZmZjsgYiA9IGwgPj4+IDE2O1xuICAgIGMgPSBoICYgMHhmZmZmOyBkID0gaCA+Pj4gMTY7XG5cbiAgICBoID0gaGhbNV07XG4gICAgbCA9IGhsWzVdO1xuXG4gICAgYSArPSBsICYgMHhmZmZmOyBiICs9IGwgPj4+IDE2O1xuICAgIGMgKz0gaCAmIDB4ZmZmZjsgZCArPSBoID4+PiAxNjtcblxuICAgIGIgKz0gYSA+Pj4gMTY7XG4gICAgYyArPSBiID4+PiAxNjtcbiAgICBkICs9IGMgPj4+IDE2O1xuXG4gICAgaGhbNV0gPSBhaDUgPSAoYyAmIDB4ZmZmZikgfCAoZCA8PCAxNik7XG4gICAgaGxbNV0gPSBhbDUgPSAoYSAmIDB4ZmZmZikgfCAoYiA8PCAxNik7XG5cbiAgICBoID0gYWg2O1xuICAgIGwgPSBhbDY7XG5cbiAgICBhID0gbCAmIDB4ZmZmZjsgYiA9IGwgPj4+IDE2O1xuICAgIGMgPSBoICYgMHhmZmZmOyBkID0gaCA+Pj4gMTY7XG5cbiAgICBoID0gaGhbNl07XG4gICAgbCA9IGhsWzZdO1xuXG4gICAgYSArPSBsICYgMHhmZmZmOyBiICs9IGwgPj4+IDE2O1xuICAgIGMgKz0gaCAmIDB4ZmZmZjsgZCArPSBoID4+PiAxNjtcblxuICAgIGIgKz0gYSA+Pj4gMTY7XG4gICAgYyArPSBiID4+PiAxNjtcbiAgICBkICs9IGMgPj4+IDE2O1xuXG4gICAgaGhbNl0gPSBhaDYgPSAoYyAmIDB4ZmZmZikgfCAoZCA8PCAxNik7XG4gICAgaGxbNl0gPSBhbDYgPSAoYSAmIDB4ZmZmZikgfCAoYiA8PCAxNik7XG5cbiAgICBoID0gYWg3O1xuICAgIGwgPSBhbDc7XG5cbiAgICBhID0gbCAmIDB4ZmZmZjsgYiA9IGwgPj4+IDE2O1xuICAgIGMgPSBoICYgMHhmZmZmOyBkID0gaCA+Pj4gMTY7XG5cbiAgICBoID0gaGhbN107XG4gICAgbCA9IGhsWzddO1xuXG4gICAgYSArPSBsICYgMHhmZmZmOyBiICs9IGwgPj4+IDE2O1xuICAgIGMgKz0gaCAmIDB4ZmZmZjsgZCArPSBoID4+PiAxNjtcblxuICAgIGIgKz0gYSA+Pj4gMTY7XG4gICAgYyArPSBiID4+PiAxNjtcbiAgICBkICs9IGMgPj4+IDE2O1xuXG4gICAgaGhbN10gPSBhaDcgPSAoYyAmIDB4ZmZmZikgfCAoZCA8PCAxNik7XG4gICAgaGxbN10gPSBhbDcgPSAoYSAmIDB4ZmZmZikgfCAoYiA8PCAxNik7XG5cbiAgICBwb3MgKz0gMTI4O1xuICAgIG4gLT0gMTI4O1xuICB9XG5cbiAgcmV0dXJuIG47XG59XG5cbmZ1bmN0aW9uIGNyeXB0b19oYXNoKG91dCwgbSwgbikge1xuICB2YXIgaGggPSBuZXcgSW50MzJBcnJheSg4KSxcbiAgICAgIGhsID0gbmV3IEludDMyQXJyYXkoOCksXG4gICAgICB4ID0gbmV3IFVpbnQ4QXJyYXkoMjU2KSxcbiAgICAgIGksIGIgPSBuO1xuXG4gIGhoWzBdID0gMHg2YTA5ZTY2NztcbiAgaGhbMV0gPSAweGJiNjdhZTg1O1xuICBoaFsyXSA9IDB4M2M2ZWYzNzI7XG4gIGhoWzNdID0gMHhhNTRmZjUzYTtcbiAgaGhbNF0gPSAweDUxMGU1MjdmO1xuICBoaFs1XSA9IDB4OWIwNTY4OGM7XG4gIGhoWzZdID0gMHgxZjgzZDlhYjtcbiAgaGhbN10gPSAweDViZTBjZDE5O1xuXG4gIGhsWzBdID0gMHhmM2JjYzkwODtcbiAgaGxbMV0gPSAweDg0Y2FhNzNiO1xuICBobFsyXSA9IDB4ZmU5NGY4MmI7XG4gIGhsWzNdID0gMHg1ZjFkMzZmMTtcbiAgaGxbNF0gPSAweGFkZTY4MmQxO1xuICBobFs1XSA9IDB4MmIzZTZjMWY7XG4gIGhsWzZdID0gMHhmYjQxYmQ2YjtcbiAgaGxbN10gPSAweDEzN2UyMTc5O1xuXG4gIGNyeXB0b19oYXNoYmxvY2tzX2hsKGhoLCBobCwgbSwgbik7XG4gIG4gJT0gMTI4O1xuXG4gIGZvciAoaSA9IDA7IGkgPCBuOyBpKyspIHhbaV0gPSBtW2ItbitpXTtcbiAgeFtuXSA9IDEyODtcblxuICBuID0gMjU2LTEyOCoobjwxMTI/MTowKTtcbiAgeFtuLTldID0gMDtcbiAgdHM2NCh4LCBuLTgsICAoYiAvIDB4MjAwMDAwMDApIHwgMCwgYiA8PCAzKTtcbiAgY3J5cHRvX2hhc2hibG9ja3NfaGwoaGgsIGhsLCB4LCBuKTtcblxuICBmb3IgKGkgPSAwOyBpIDwgODsgaSsrKSB0czY0KG91dCwgOCppLCBoaFtpXSwgaGxbaV0pO1xuXG4gIHJldHVybiAwO1xufVxuXG5mdW5jdGlvbiBhZGQocCwgcSkge1xuICB2YXIgYSA9IGdmKCksIGIgPSBnZigpLCBjID0gZ2YoKSxcbiAgICAgIGQgPSBnZigpLCBlID0gZ2YoKSwgZiA9IGdmKCksXG4gICAgICBnID0gZ2YoKSwgaCA9IGdmKCksIHQgPSBnZigpO1xuXG4gIFooYSwgcFsxXSwgcFswXSk7XG4gIFoodCwgcVsxXSwgcVswXSk7XG4gIE0oYSwgYSwgdCk7XG4gIEEoYiwgcFswXSwgcFsxXSk7XG4gIEEodCwgcVswXSwgcVsxXSk7XG4gIE0oYiwgYiwgdCk7XG4gIE0oYywgcFszXSwgcVszXSk7XG4gIE0oYywgYywgRDIpO1xuICBNKGQsIHBbMl0sIHFbMl0pO1xuICBBKGQsIGQsIGQpO1xuICBaKGUsIGIsIGEpO1xuICBaKGYsIGQsIGMpO1xuICBBKGcsIGQsIGMpO1xuICBBKGgsIGIsIGEpO1xuXG4gIE0ocFswXSwgZSwgZik7XG4gIE0ocFsxXSwgaCwgZyk7XG4gIE0ocFsyXSwgZywgZik7XG4gIE0ocFszXSwgZSwgaCk7XG59XG5cbmZ1bmN0aW9uIGNzd2FwKHAsIHEsIGIpIHtcbiAgdmFyIGk7XG4gIGZvciAoaSA9IDA7IGkgPCA0OyBpKyspIHtcbiAgICBzZWwyNTUxOShwW2ldLCBxW2ldLCBiKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBwYWNrKHIsIHApIHtcbiAgdmFyIHR4ID0gZ2YoKSwgdHkgPSBnZigpLCB6aSA9IGdmKCk7XG4gIGludjI1NTE5KHppLCBwWzJdKTtcbiAgTSh0eCwgcFswXSwgemkpO1xuICBNKHR5LCBwWzFdLCB6aSk7XG4gIHBhY2syNTUxOShyLCB0eSk7XG4gIHJbMzFdIF49IHBhcjI1NTE5KHR4KSA8PCA3O1xufVxuXG5mdW5jdGlvbiBzY2FsYXJtdWx0KHAsIHEsIHMpIHtcbiAgdmFyIGIsIGk7XG4gIHNldDI1NTE5KHBbMF0sIGdmMCk7XG4gIHNldDI1NTE5KHBbMV0sIGdmMSk7XG4gIHNldDI1NTE5KHBbMl0sIGdmMSk7XG4gIHNldDI1NTE5KHBbM10sIGdmMCk7XG4gIGZvciAoaSA9IDI1NTsgaSA+PSAwOyAtLWkpIHtcbiAgICBiID0gKHNbKGkvOCl8MF0gPj4gKGkmNykpICYgMTtcbiAgICBjc3dhcChwLCBxLCBiKTtcbiAgICBhZGQocSwgcCk7XG4gICAgYWRkKHAsIHApO1xuICAgIGNzd2FwKHAsIHEsIGIpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHNjYWxhcmJhc2UocCwgcykge1xuICB2YXIgcSA9IFtnZigpLCBnZigpLCBnZigpLCBnZigpXTtcbiAgc2V0MjU1MTkocVswXSwgWCk7XG4gIHNldDI1NTE5KHFbMV0sIFkpO1xuICBzZXQyNTUxOShxWzJdLCBnZjEpO1xuICBNKHFbM10sIFgsIFkpO1xuICBzY2FsYXJtdWx0KHAsIHEsIHMpO1xufVxuXG5mdW5jdGlvbiBjcnlwdG9fc2lnbl9rZXlwYWlyKHBrLCBzaywgc2VlZGVkKSB7XG4gIHZhciBkID0gbmV3IFVpbnQ4QXJyYXkoNjQpO1xuICB2YXIgcCA9IFtnZigpLCBnZigpLCBnZigpLCBnZigpXTtcbiAgdmFyIGk7XG5cbiAgaWYgKCFzZWVkZWQpIHJhbmRvbWJ5dGVzKHNrLCAzMik7XG4gIGNyeXB0b19oYXNoKGQsIHNrLCAzMik7XG4gIGRbMF0gJj0gMjQ4O1xuICBkWzMxXSAmPSAxMjc7XG4gIGRbMzFdIHw9IDY0O1xuXG4gIHNjYWxhcmJhc2UocCwgZCk7XG4gIHBhY2socGssIHApO1xuXG4gIGZvciAoaSA9IDA7IGkgPCAzMjsgaSsrKSBza1tpKzMyXSA9IHBrW2ldO1xuICByZXR1cm4gMDtcbn1cblxudmFyIEwgPSBuZXcgRmxvYXQ2NEFycmF5KFsweGVkLCAweGQzLCAweGY1LCAweDVjLCAweDFhLCAweDYzLCAweDEyLCAweDU4LCAweGQ2LCAweDljLCAweGY3LCAweGEyLCAweGRlLCAweGY5LCAweGRlLCAweDE0LCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAweDEwXSk7XG5cbmZ1bmN0aW9uIG1vZEwociwgeCkge1xuICB2YXIgY2FycnksIGksIGosIGs7XG4gIGZvciAoaSA9IDYzOyBpID49IDMyOyAtLWkpIHtcbiAgICBjYXJyeSA9IDA7XG4gICAgZm9yIChqID0gaSAtIDMyLCBrID0gaSAtIDEyOyBqIDwgazsgKytqKSB7XG4gICAgICB4W2pdICs9IGNhcnJ5IC0gMTYgKiB4W2ldICogTFtqIC0gKGkgLSAzMildO1xuICAgICAgY2FycnkgPSAoeFtqXSArIDEyOCkgPj4gODtcbiAgICAgIHhbal0gLT0gY2FycnkgKiAyNTY7XG4gICAgfVxuICAgIHhbal0gKz0gY2Fycnk7XG4gICAgeFtpXSA9IDA7XG4gIH1cbiAgY2FycnkgPSAwO1xuICBmb3IgKGogPSAwOyBqIDwgMzI7IGorKykge1xuICAgIHhbal0gKz0gY2FycnkgLSAoeFszMV0gPj4gNCkgKiBMW2pdO1xuICAgIGNhcnJ5ID0geFtqXSA+PiA4O1xuICAgIHhbal0gJj0gMjU1O1xuICB9XG4gIGZvciAoaiA9IDA7IGogPCAzMjsgaisrKSB4W2pdIC09IGNhcnJ5ICogTFtqXTtcbiAgZm9yIChpID0gMDsgaSA8IDMyOyBpKyspIHtcbiAgICB4W2krMV0gKz0geFtpXSA+PiA4O1xuICAgIHJbaV0gPSB4W2ldICYgMjU1O1xuICB9XG59XG5cbmZ1bmN0aW9uIHJlZHVjZShyKSB7XG4gIHZhciB4ID0gbmV3IEZsb2F0NjRBcnJheSg2NCksIGk7XG4gIGZvciAoaSA9IDA7IGkgPCA2NDsgaSsrKSB4W2ldID0gcltpXTtcbiAgZm9yIChpID0gMDsgaSA8IDY0OyBpKyspIHJbaV0gPSAwO1xuICBtb2RMKHIsIHgpO1xufVxuXG4vLyBOb3RlOiBkaWZmZXJlbmNlIGZyb20gQyAtIHNtbGVuIHJldHVybmVkLCBub3QgcGFzc2VkIGFzIGFyZ3VtZW50LlxuZnVuY3Rpb24gY3J5cHRvX3NpZ24oc20sIG0sIG4sIHNrKSB7XG4gIHZhciBkID0gbmV3IFVpbnQ4QXJyYXkoNjQpLCBoID0gbmV3IFVpbnQ4QXJyYXkoNjQpLCByID0gbmV3IFVpbnQ4QXJyYXkoNjQpO1xuICB2YXIgaSwgaiwgeCA9IG5ldyBGbG9hdDY0QXJyYXkoNjQpO1xuICB2YXIgcCA9IFtnZigpLCBnZigpLCBnZigpLCBnZigpXTtcblxuICBjcnlwdG9faGFzaChkLCBzaywgMzIpO1xuICBkWzBdICY9IDI0ODtcbiAgZFszMV0gJj0gMTI3O1xuICBkWzMxXSB8PSA2NDtcblxuICB2YXIgc21sZW4gPSBuICsgNjQ7XG4gIGZvciAoaSA9IDA7IGkgPCBuOyBpKyspIHNtWzY0ICsgaV0gPSBtW2ldO1xuICBmb3IgKGkgPSAwOyBpIDwgMzI7IGkrKykgc21bMzIgKyBpXSA9IGRbMzIgKyBpXTtcblxuICBjcnlwdG9faGFzaChyLCBzbS5zdWJhcnJheSgzMiksIG4rMzIpO1xuICByZWR1Y2Uocik7XG4gIHNjYWxhcmJhc2UocCwgcik7XG4gIHBhY2soc20sIHApO1xuXG4gIGZvciAoaSA9IDMyOyBpIDwgNjQ7IGkrKykgc21baV0gPSBza1tpXTtcbiAgY3J5cHRvX2hhc2goaCwgc20sIG4gKyA2NCk7XG4gIHJlZHVjZShoKTtcblxuICBmb3IgKGkgPSAwOyBpIDwgNjQ7IGkrKykgeFtpXSA9IDA7XG4gIGZvciAoaSA9IDA7IGkgPCAzMjsgaSsrKSB4W2ldID0gcltpXTtcbiAgZm9yIChpID0gMDsgaSA8IDMyOyBpKyspIHtcbiAgICBmb3IgKGogPSAwOyBqIDwgMzI7IGorKykge1xuICAgICAgeFtpK2pdICs9IGhbaV0gKiBkW2pdO1xuICAgIH1cbiAgfVxuXG4gIG1vZEwoc20uc3ViYXJyYXkoMzIpLCB4KTtcbiAgcmV0dXJuIHNtbGVuO1xufVxuXG5mdW5jdGlvbiB1bnBhY2tuZWcociwgcCkge1xuICB2YXIgdCA9IGdmKCksIGNoayA9IGdmKCksIG51bSA9IGdmKCksXG4gICAgICBkZW4gPSBnZigpLCBkZW4yID0gZ2YoKSwgZGVuNCA9IGdmKCksXG4gICAgICBkZW42ID0gZ2YoKTtcblxuICBzZXQyNTUxOShyWzJdLCBnZjEpO1xuICB1bnBhY2syNTUxOShyWzFdLCBwKTtcbiAgUyhudW0sIHJbMV0pO1xuICBNKGRlbiwgbnVtLCBEKTtcbiAgWihudW0sIG51bSwgclsyXSk7XG4gIEEoZGVuLCByWzJdLCBkZW4pO1xuXG4gIFMoZGVuMiwgZGVuKTtcbiAgUyhkZW40LCBkZW4yKTtcbiAgTShkZW42LCBkZW40LCBkZW4yKTtcbiAgTSh0LCBkZW42LCBudW0pO1xuICBNKHQsIHQsIGRlbik7XG5cbiAgcG93MjUyMyh0LCB0KTtcbiAgTSh0LCB0LCBudW0pO1xuICBNKHQsIHQsIGRlbik7XG4gIE0odCwgdCwgZGVuKTtcbiAgTShyWzBdLCB0LCBkZW4pO1xuXG4gIFMoY2hrLCByWzBdKTtcbiAgTShjaGssIGNoaywgZGVuKTtcbiAgaWYgKG5lcTI1NTE5KGNoaywgbnVtKSkgTShyWzBdLCByWzBdLCBJKTtcblxuICBTKGNoaywgclswXSk7XG4gIE0oY2hrLCBjaGssIGRlbik7XG4gIGlmIChuZXEyNTUxOShjaGssIG51bSkpIHJldHVybiAtMTtcblxuICBpZiAocGFyMjU1MTkoclswXSkgPT09IChwWzMxXT4+NykpIFooclswXSwgZ2YwLCByWzBdKTtcblxuICBNKHJbM10sIHJbMF0sIHJbMV0pO1xuICByZXR1cm4gMDtcbn1cblxuZnVuY3Rpb24gY3J5cHRvX3NpZ25fb3BlbihtLCBzbSwgbiwgcGspIHtcbiAgdmFyIGksIG1sZW47XG4gIHZhciB0ID0gbmV3IFVpbnQ4QXJyYXkoMzIpLCBoID0gbmV3IFVpbnQ4QXJyYXkoNjQpO1xuICB2YXIgcCA9IFtnZigpLCBnZigpLCBnZigpLCBnZigpXSxcbiAgICAgIHEgPSBbZ2YoKSwgZ2YoKSwgZ2YoKSwgZ2YoKV07XG5cbiAgbWxlbiA9IC0xO1xuICBpZiAobiA8IDY0KSByZXR1cm4gLTE7XG5cbiAgaWYgKHVucGFja25lZyhxLCBwaykpIHJldHVybiAtMTtcblxuICBmb3IgKGkgPSAwOyBpIDwgbjsgaSsrKSBtW2ldID0gc21baV07XG4gIGZvciAoaSA9IDA7IGkgPCAzMjsgaSsrKSBtW2krMzJdID0gcGtbaV07XG4gIGNyeXB0b19oYXNoKGgsIG0sIG4pO1xuICByZWR1Y2UoaCk7XG4gIHNjYWxhcm11bHQocCwgcSwgaCk7XG5cbiAgc2NhbGFyYmFzZShxLCBzbS5zdWJhcnJheSgzMikpO1xuICBhZGQocCwgcSk7XG4gIHBhY2sodCwgcCk7XG5cbiAgbiAtPSA2NDtcbiAgaWYgKGNyeXB0b192ZXJpZnlfMzIoc20sIDAsIHQsIDApKSB7XG4gICAgZm9yIChpID0gMDsgaSA8IG47IGkrKykgbVtpXSA9IDA7XG4gICAgcmV0dXJuIC0xO1xuICB9XG5cbiAgZm9yIChpID0gMDsgaSA8IG47IGkrKykgbVtpXSA9IHNtW2kgKyA2NF07XG4gIG1sZW4gPSBuO1xuICByZXR1cm4gbWxlbjtcbn1cblxudmFyIGNyeXB0b19zZWNyZXRib3hfS0VZQllURVMgPSAzMixcbiAgICBjcnlwdG9fc2VjcmV0Ym94X05PTkNFQllURVMgPSAyNCxcbiAgICBjcnlwdG9fc2VjcmV0Ym94X1pFUk9CWVRFUyA9IDMyLFxuICAgIGNyeXB0b19zZWNyZXRib3hfQk9YWkVST0JZVEVTID0gMTYsXG4gICAgY3J5cHRvX3NjYWxhcm11bHRfQllURVMgPSAzMixcbiAgICBjcnlwdG9fc2NhbGFybXVsdF9TQ0FMQVJCWVRFUyA9IDMyLFxuICAgIGNyeXB0b19ib3hfUFVCTElDS0VZQllURVMgPSAzMixcbiAgICBjcnlwdG9fYm94X1NFQ1JFVEtFWUJZVEVTID0gMzIsXG4gICAgY3J5cHRvX2JveF9CRUZPUkVOTUJZVEVTID0gMzIsXG4gICAgY3J5cHRvX2JveF9OT05DRUJZVEVTID0gY3J5cHRvX3NlY3JldGJveF9OT05DRUJZVEVTLFxuICAgIGNyeXB0b19ib3hfWkVST0JZVEVTID0gY3J5cHRvX3NlY3JldGJveF9aRVJPQllURVMsXG4gICAgY3J5cHRvX2JveF9CT1haRVJPQllURVMgPSBjcnlwdG9fc2VjcmV0Ym94X0JPWFpFUk9CWVRFUyxcbiAgICBjcnlwdG9fc2lnbl9CWVRFUyA9IDY0LFxuICAgIGNyeXB0b19zaWduX1BVQkxJQ0tFWUJZVEVTID0gMzIsXG4gICAgY3J5cHRvX3NpZ25fU0VDUkVUS0VZQllURVMgPSA2NCxcbiAgICBjcnlwdG9fc2lnbl9TRUVEQllURVMgPSAzMixcbiAgICBjcnlwdG9faGFzaF9CWVRFUyA9IDY0O1xuXG5uYWNsLmxvd2xldmVsID0ge1xuICBjcnlwdG9fY29yZV9oc2Fsc2EyMDogY3J5cHRvX2NvcmVfaHNhbHNhMjAsXG4gIGNyeXB0b19zdHJlYW1feG9yOiBjcnlwdG9fc3RyZWFtX3hvcixcbiAgY3J5cHRvX3N0cmVhbTogY3J5cHRvX3N0cmVhbSxcbiAgY3J5cHRvX3N0cmVhbV9zYWxzYTIwX3hvcjogY3J5cHRvX3N0cmVhbV9zYWxzYTIwX3hvcixcbiAgY3J5cHRvX3N0cmVhbV9zYWxzYTIwOiBjcnlwdG9fc3RyZWFtX3NhbHNhMjAsXG4gIGNyeXB0b19vbmV0aW1lYXV0aDogY3J5cHRvX29uZXRpbWVhdXRoLFxuICBjcnlwdG9fb25ldGltZWF1dGhfdmVyaWZ5OiBjcnlwdG9fb25ldGltZWF1dGhfdmVyaWZ5LFxuICBjcnlwdG9fdmVyaWZ5XzE2OiBjcnlwdG9fdmVyaWZ5XzE2LFxuICBjcnlwdG9fdmVyaWZ5XzMyOiBjcnlwdG9fdmVyaWZ5XzMyLFxuICBjcnlwdG9fc2VjcmV0Ym94OiBjcnlwdG9fc2VjcmV0Ym94LFxuICBjcnlwdG9fc2VjcmV0Ym94X29wZW46IGNyeXB0b19zZWNyZXRib3hfb3BlbixcbiAgY3J5cHRvX3NjYWxhcm11bHQ6IGNyeXB0b19zY2FsYXJtdWx0LFxuICBjcnlwdG9fc2NhbGFybXVsdF9iYXNlOiBjcnlwdG9fc2NhbGFybXVsdF9iYXNlLFxuICBjcnlwdG9fYm94X2JlZm9yZW5tOiBjcnlwdG9fYm94X2JlZm9yZW5tLFxuICBjcnlwdG9fYm94X2FmdGVybm06IGNyeXB0b19ib3hfYWZ0ZXJubSxcbiAgY3J5cHRvX2JveDogY3J5cHRvX2JveCxcbiAgY3J5cHRvX2JveF9vcGVuOiBjcnlwdG9fYm94X29wZW4sXG4gIGNyeXB0b19ib3hfa2V5cGFpcjogY3J5cHRvX2JveF9rZXlwYWlyLFxuICBjcnlwdG9faGFzaDogY3J5cHRvX2hhc2gsXG4gIGNyeXB0b19zaWduOiBjcnlwdG9fc2lnbixcbiAgY3J5cHRvX3NpZ25fa2V5cGFpcjogY3J5cHRvX3NpZ25fa2V5cGFpcixcbiAgY3J5cHRvX3NpZ25fb3BlbjogY3J5cHRvX3NpZ25fb3BlbixcblxuICBjcnlwdG9fc2VjcmV0Ym94X0tFWUJZVEVTOiBjcnlwdG9fc2VjcmV0Ym94X0tFWUJZVEVTLFxuICBjcnlwdG9fc2VjcmV0Ym94X05PTkNFQllURVM6IGNyeXB0b19zZWNyZXRib3hfTk9OQ0VCWVRFUyxcbiAgY3J5cHRvX3NlY3JldGJveF9aRVJPQllURVM6IGNyeXB0b19zZWNyZXRib3hfWkVST0JZVEVTLFxuICBjcnlwdG9fc2VjcmV0Ym94X0JPWFpFUk9CWVRFUzogY3J5cHRvX3NlY3JldGJveF9CT1haRVJPQllURVMsXG4gIGNyeXB0b19zY2FsYXJtdWx0X0JZVEVTOiBjcnlwdG9fc2NhbGFybXVsdF9CWVRFUyxcbiAgY3J5cHRvX3NjYWxhcm11bHRfU0NBTEFSQllURVM6IGNyeXB0b19zY2FsYXJtdWx0X1NDQUxBUkJZVEVTLFxuICBjcnlwdG9fYm94X1BVQkxJQ0tFWUJZVEVTOiBjcnlwdG9fYm94X1BVQkxJQ0tFWUJZVEVTLFxuICBjcnlwdG9fYm94X1NFQ1JFVEtFWUJZVEVTOiBjcnlwdG9fYm94X1NFQ1JFVEtFWUJZVEVTLFxuICBjcnlwdG9fYm94X0JFRk9SRU5NQllURVM6IGNyeXB0b19ib3hfQkVGT1JFTk1CWVRFUyxcbiAgY3J5cHRvX2JveF9OT05DRUJZVEVTOiBjcnlwdG9fYm94X05PTkNFQllURVMsXG4gIGNyeXB0b19ib3hfWkVST0JZVEVTOiBjcnlwdG9fYm94X1pFUk9CWVRFUyxcbiAgY3J5cHRvX2JveF9CT1haRVJPQllURVM6IGNyeXB0b19ib3hfQk9YWkVST0JZVEVTLFxuICBjcnlwdG9fc2lnbl9CWVRFUzogY3J5cHRvX3NpZ25fQllURVMsXG4gIGNyeXB0b19zaWduX1BVQkxJQ0tFWUJZVEVTOiBjcnlwdG9fc2lnbl9QVUJMSUNLRVlCWVRFUyxcbiAgY3J5cHRvX3NpZ25fU0VDUkVUS0VZQllURVM6IGNyeXB0b19zaWduX1NFQ1JFVEtFWUJZVEVTLFxuICBjcnlwdG9fc2lnbl9TRUVEQllURVM6IGNyeXB0b19zaWduX1NFRURCWVRFUyxcbiAgY3J5cHRvX2hhc2hfQllURVM6IGNyeXB0b19oYXNoX0JZVEVTXG59O1xuXG4vKiBIaWdoLWxldmVsIEFQSSAqL1xuXG5mdW5jdGlvbiBjaGVja0xlbmd0aHMoaywgbikge1xuICBpZiAoay5sZW5ndGggIT09IGNyeXB0b19zZWNyZXRib3hfS0VZQllURVMpIHRocm93IG5ldyBFcnJvcignYmFkIGtleSBzaXplJyk7XG4gIGlmIChuLmxlbmd0aCAhPT0gY3J5cHRvX3NlY3JldGJveF9OT05DRUJZVEVTKSB0aHJvdyBuZXcgRXJyb3IoJ2JhZCBub25jZSBzaXplJyk7XG59XG5cbmZ1bmN0aW9uIGNoZWNrQm94TGVuZ3Rocyhwaywgc2spIHtcbiAgaWYgKHBrLmxlbmd0aCAhPT0gY3J5cHRvX2JveF9QVUJMSUNLRVlCWVRFUykgdGhyb3cgbmV3IEVycm9yKCdiYWQgcHVibGljIGtleSBzaXplJyk7XG4gIGlmIChzay5sZW5ndGggIT09IGNyeXB0b19ib3hfU0VDUkVUS0VZQllURVMpIHRocm93IG5ldyBFcnJvcignYmFkIHNlY3JldCBrZXkgc2l6ZScpO1xufVxuXG5mdW5jdGlvbiBjaGVja0FycmF5VHlwZXMoKSB7XG4gIHZhciB0LCBpO1xuICBmb3IgKGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgIGlmICgodCA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChhcmd1bWVudHNbaV0pKSAhPT0gJ1tvYmplY3QgVWludDhBcnJheV0nKVxuICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ3VuZXhwZWN0ZWQgdHlwZSAnICsgdCArICcsIHVzZSBVaW50OEFycmF5Jyk7XG4gIH1cbn1cblxuZnVuY3Rpb24gY2xlYW51cChhcnIpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyBpKyspIGFycltpXSA9IDA7XG59XG5cbi8vIFRPRE86IENvbXBsZXRlbHkgcmVtb3ZlIHRoaXMgaW4gdjAuMTUuXG5pZiAoIW5hY2wudXRpbCkge1xuICBuYWNsLnV0aWwgPSB7fTtcbiAgbmFjbC51dGlsLmRlY29kZVVURjggPSBuYWNsLnV0aWwuZW5jb2RlVVRGOCA9IG5hY2wudXRpbC5lbmNvZGVCYXNlNjQgPSBuYWNsLnV0aWwuZGVjb2RlQmFzZTY0ID0gZnVuY3Rpb24oKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCduYWNsLnV0aWwgbW92ZWQgaW50byBzZXBhcmF0ZSBwYWNrYWdlOiBodHRwczovL2dpdGh1Yi5jb20vZGNoZXN0L3R3ZWV0bmFjbC11dGlsLWpzJyk7XG4gIH07XG59XG5cbm5hY2wucmFuZG9tQnl0ZXMgPSBmdW5jdGlvbihuKSB7XG4gIHZhciBiID0gbmV3IFVpbnQ4QXJyYXkobik7XG4gIHJhbmRvbWJ5dGVzKGIsIG4pO1xuICByZXR1cm4gYjtcbn07XG5cbm5hY2wuc2VjcmV0Ym94ID0gZnVuY3Rpb24obXNnLCBub25jZSwga2V5KSB7XG4gIGNoZWNrQXJyYXlUeXBlcyhtc2csIG5vbmNlLCBrZXkpO1xuICBjaGVja0xlbmd0aHMoa2V5LCBub25jZSk7XG4gIHZhciBtID0gbmV3IFVpbnQ4QXJyYXkoY3J5cHRvX3NlY3JldGJveF9aRVJPQllURVMgKyBtc2cubGVuZ3RoKTtcbiAgdmFyIGMgPSBuZXcgVWludDhBcnJheShtLmxlbmd0aCk7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbXNnLmxlbmd0aDsgaSsrKSBtW2krY3J5cHRvX3NlY3JldGJveF9aRVJPQllURVNdID0gbXNnW2ldO1xuICBjcnlwdG9fc2VjcmV0Ym94KGMsIG0sIG0ubGVuZ3RoLCBub25jZSwga2V5KTtcbiAgcmV0dXJuIGMuc3ViYXJyYXkoY3J5cHRvX3NlY3JldGJveF9CT1haRVJPQllURVMpO1xufTtcblxubmFjbC5zZWNyZXRib3gub3BlbiA9IGZ1bmN0aW9uKGJveCwgbm9uY2UsIGtleSkge1xuICBjaGVja0FycmF5VHlwZXMoYm94LCBub25jZSwga2V5KTtcbiAgY2hlY2tMZW5ndGhzKGtleSwgbm9uY2UpO1xuICB2YXIgYyA9IG5ldyBVaW50OEFycmF5KGNyeXB0b19zZWNyZXRib3hfQk9YWkVST0JZVEVTICsgYm94Lmxlbmd0aCk7XG4gIHZhciBtID0gbmV3IFVpbnQ4QXJyYXkoYy5sZW5ndGgpO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGJveC5sZW5ndGg7IGkrKykgY1tpK2NyeXB0b19zZWNyZXRib3hfQk9YWkVST0JZVEVTXSA9IGJveFtpXTtcbiAgaWYgKGMubGVuZ3RoIDwgMzIpIHJldHVybiBmYWxzZTtcbiAgaWYgKGNyeXB0b19zZWNyZXRib3hfb3BlbihtLCBjLCBjLmxlbmd0aCwgbm9uY2UsIGtleSkgIT09IDApIHJldHVybiBmYWxzZTtcbiAgcmV0dXJuIG0uc3ViYXJyYXkoY3J5cHRvX3NlY3JldGJveF9aRVJPQllURVMpO1xufTtcblxubmFjbC5zZWNyZXRib3gua2V5TGVuZ3RoID0gY3J5cHRvX3NlY3JldGJveF9LRVlCWVRFUztcbm5hY2wuc2VjcmV0Ym94Lm5vbmNlTGVuZ3RoID0gY3J5cHRvX3NlY3JldGJveF9OT05DRUJZVEVTO1xubmFjbC5zZWNyZXRib3gub3ZlcmhlYWRMZW5ndGggPSBjcnlwdG9fc2VjcmV0Ym94X0JPWFpFUk9CWVRFUztcblxubmFjbC5zY2FsYXJNdWx0ID0gZnVuY3Rpb24obiwgcCkge1xuICBjaGVja0FycmF5VHlwZXMobiwgcCk7XG4gIGlmIChuLmxlbmd0aCAhPT0gY3J5cHRvX3NjYWxhcm11bHRfU0NBTEFSQllURVMpIHRocm93IG5ldyBFcnJvcignYmFkIG4gc2l6ZScpO1xuICBpZiAocC5sZW5ndGggIT09IGNyeXB0b19zY2FsYXJtdWx0X0JZVEVTKSB0aHJvdyBuZXcgRXJyb3IoJ2JhZCBwIHNpemUnKTtcbiAgdmFyIHEgPSBuZXcgVWludDhBcnJheShjcnlwdG9fc2NhbGFybXVsdF9CWVRFUyk7XG4gIGNyeXB0b19zY2FsYXJtdWx0KHEsIG4sIHApO1xuICByZXR1cm4gcTtcbn07XG5cbm5hY2wuc2NhbGFyTXVsdC5iYXNlID0gZnVuY3Rpb24obikge1xuICBjaGVja0FycmF5VHlwZXMobik7XG4gIGlmIChuLmxlbmd0aCAhPT0gY3J5cHRvX3NjYWxhcm11bHRfU0NBTEFSQllURVMpIHRocm93IG5ldyBFcnJvcignYmFkIG4gc2l6ZScpO1xuICB2YXIgcSA9IG5ldyBVaW50OEFycmF5KGNyeXB0b19zY2FsYXJtdWx0X0JZVEVTKTtcbiAgY3J5cHRvX3NjYWxhcm11bHRfYmFzZShxLCBuKTtcbiAgcmV0dXJuIHE7XG59O1xuXG5uYWNsLnNjYWxhck11bHQuc2NhbGFyTGVuZ3RoID0gY3J5cHRvX3NjYWxhcm11bHRfU0NBTEFSQllURVM7XG5uYWNsLnNjYWxhck11bHQuZ3JvdXBFbGVtZW50TGVuZ3RoID0gY3J5cHRvX3NjYWxhcm11bHRfQllURVM7XG5cbm5hY2wuYm94ID0gZnVuY3Rpb24obXNnLCBub25jZSwgcHVibGljS2V5LCBzZWNyZXRLZXkpIHtcbiAgdmFyIGsgPSBuYWNsLmJveC5iZWZvcmUocHVibGljS2V5LCBzZWNyZXRLZXkpO1xuICByZXR1cm4gbmFjbC5zZWNyZXRib3gobXNnLCBub25jZSwgayk7XG59O1xuXG5uYWNsLmJveC5iZWZvcmUgPSBmdW5jdGlvbihwdWJsaWNLZXksIHNlY3JldEtleSkge1xuICBjaGVja0FycmF5VHlwZXMocHVibGljS2V5LCBzZWNyZXRLZXkpO1xuICBjaGVja0JveExlbmd0aHMocHVibGljS2V5LCBzZWNyZXRLZXkpO1xuICB2YXIgayA9IG5ldyBVaW50OEFycmF5KGNyeXB0b19ib3hfQkVGT1JFTk1CWVRFUyk7XG4gIGNyeXB0b19ib3hfYmVmb3Jlbm0oaywgcHVibGljS2V5LCBzZWNyZXRLZXkpO1xuICByZXR1cm4gaztcbn07XG5cbm5hY2wuYm94LmFmdGVyID0gbmFjbC5zZWNyZXRib3g7XG5cbm5hY2wuYm94Lm9wZW4gPSBmdW5jdGlvbihtc2csIG5vbmNlLCBwdWJsaWNLZXksIHNlY3JldEtleSkge1xuICB2YXIgayA9IG5hY2wuYm94LmJlZm9yZShwdWJsaWNLZXksIHNlY3JldEtleSk7XG4gIHJldHVybiBuYWNsLnNlY3JldGJveC5vcGVuKG1zZywgbm9uY2UsIGspO1xufTtcblxubmFjbC5ib3gub3Blbi5hZnRlciA9IG5hY2wuc2VjcmV0Ym94Lm9wZW47XG5cbm5hY2wuYm94LmtleVBhaXIgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHBrID0gbmV3IFVpbnQ4QXJyYXkoY3J5cHRvX2JveF9QVUJMSUNLRVlCWVRFUyk7XG4gIHZhciBzayA9IG5ldyBVaW50OEFycmF5KGNyeXB0b19ib3hfU0VDUkVUS0VZQllURVMpO1xuICBjcnlwdG9fYm94X2tleXBhaXIocGssIHNrKTtcbiAgcmV0dXJuIHtwdWJsaWNLZXk6IHBrLCBzZWNyZXRLZXk6IHNrfTtcbn07XG5cbm5hY2wuYm94LmtleVBhaXIuZnJvbVNlY3JldEtleSA9IGZ1bmN0aW9uKHNlY3JldEtleSkge1xuICBjaGVja0FycmF5VHlwZXMoc2VjcmV0S2V5KTtcbiAgaWYgKHNlY3JldEtleS5sZW5ndGggIT09IGNyeXB0b19ib3hfU0VDUkVUS0VZQllURVMpXG4gICAgdGhyb3cgbmV3IEVycm9yKCdiYWQgc2VjcmV0IGtleSBzaXplJyk7XG4gIHZhciBwayA9IG5ldyBVaW50OEFycmF5KGNyeXB0b19ib3hfUFVCTElDS0VZQllURVMpO1xuICBjcnlwdG9fc2NhbGFybXVsdF9iYXNlKHBrLCBzZWNyZXRLZXkpO1xuICByZXR1cm4ge3B1YmxpY0tleTogcGssIHNlY3JldEtleTogbmV3IFVpbnQ4QXJyYXkoc2VjcmV0S2V5KX07XG59O1xuXG5uYWNsLmJveC5wdWJsaWNLZXlMZW5ndGggPSBjcnlwdG9fYm94X1BVQkxJQ0tFWUJZVEVTO1xubmFjbC5ib3guc2VjcmV0S2V5TGVuZ3RoID0gY3J5cHRvX2JveF9TRUNSRVRLRVlCWVRFUztcbm5hY2wuYm94LnNoYXJlZEtleUxlbmd0aCA9IGNyeXB0b19ib3hfQkVGT1JFTk1CWVRFUztcbm5hY2wuYm94Lm5vbmNlTGVuZ3RoID0gY3J5cHRvX2JveF9OT05DRUJZVEVTO1xubmFjbC5ib3gub3ZlcmhlYWRMZW5ndGggPSBuYWNsLnNlY3JldGJveC5vdmVyaGVhZExlbmd0aDtcblxubmFjbC5zaWduID0gZnVuY3Rpb24obXNnLCBzZWNyZXRLZXkpIHtcbiAgY2hlY2tBcnJheVR5cGVzKG1zZywgc2VjcmV0S2V5KTtcbiAgaWYgKHNlY3JldEtleS5sZW5ndGggIT09IGNyeXB0b19zaWduX1NFQ1JFVEtFWUJZVEVTKVxuICAgIHRocm93IG5ldyBFcnJvcignYmFkIHNlY3JldCBrZXkgc2l6ZScpO1xuICB2YXIgc2lnbmVkTXNnID0gbmV3IFVpbnQ4QXJyYXkoY3J5cHRvX3NpZ25fQllURVMrbXNnLmxlbmd0aCk7XG4gIGNyeXB0b19zaWduKHNpZ25lZE1zZywgbXNnLCBtc2cubGVuZ3RoLCBzZWNyZXRLZXkpO1xuICByZXR1cm4gc2lnbmVkTXNnO1xufTtcblxubmFjbC5zaWduLm9wZW4gPSBmdW5jdGlvbihzaWduZWRNc2csIHB1YmxpY0tleSkge1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCAhPT0gMilcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ25hY2wuc2lnbi5vcGVuIGFjY2VwdHMgMiBhcmd1bWVudHM7IGRpZCB5b3UgbWVhbiB0byB1c2UgbmFjbC5zaWduLmRldGFjaGVkLnZlcmlmeT8nKTtcbiAgY2hlY2tBcnJheVR5cGVzKHNpZ25lZE1zZywgcHVibGljS2V5KTtcbiAgaWYgKHB1YmxpY0tleS5sZW5ndGggIT09IGNyeXB0b19zaWduX1BVQkxJQ0tFWUJZVEVTKVxuICAgIHRocm93IG5ldyBFcnJvcignYmFkIHB1YmxpYyBrZXkgc2l6ZScpO1xuICB2YXIgdG1wID0gbmV3IFVpbnQ4QXJyYXkoc2lnbmVkTXNnLmxlbmd0aCk7XG4gIHZhciBtbGVuID0gY3J5cHRvX3NpZ25fb3Blbih0bXAsIHNpZ25lZE1zZywgc2lnbmVkTXNnLmxlbmd0aCwgcHVibGljS2V5KTtcbiAgaWYgKG1sZW4gPCAwKSByZXR1cm4gbnVsbDtcbiAgdmFyIG0gPSBuZXcgVWludDhBcnJheShtbGVuKTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBtLmxlbmd0aDsgaSsrKSBtW2ldID0gdG1wW2ldO1xuICByZXR1cm4gbTtcbn07XG5cbm5hY2wuc2lnbi5kZXRhY2hlZCA9IGZ1bmN0aW9uKG1zZywgc2VjcmV0S2V5KSB7XG4gIHZhciBzaWduZWRNc2cgPSBuYWNsLnNpZ24obXNnLCBzZWNyZXRLZXkpO1xuICB2YXIgc2lnID0gbmV3IFVpbnQ4QXJyYXkoY3J5cHRvX3NpZ25fQllURVMpO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHNpZy5sZW5ndGg7IGkrKykgc2lnW2ldID0gc2lnbmVkTXNnW2ldO1xuICByZXR1cm4gc2lnO1xufTtcblxubmFjbC5zaWduLmRldGFjaGVkLnZlcmlmeSA9IGZ1bmN0aW9uKG1zZywgc2lnLCBwdWJsaWNLZXkpIHtcbiAgY2hlY2tBcnJheVR5cGVzKG1zZywgc2lnLCBwdWJsaWNLZXkpO1xuICBpZiAoc2lnLmxlbmd0aCAhPT0gY3J5cHRvX3NpZ25fQllURVMpXG4gICAgdGhyb3cgbmV3IEVycm9yKCdiYWQgc2lnbmF0dXJlIHNpemUnKTtcbiAgaWYgKHB1YmxpY0tleS5sZW5ndGggIT09IGNyeXB0b19zaWduX1BVQkxJQ0tFWUJZVEVTKVxuICAgIHRocm93IG5ldyBFcnJvcignYmFkIHB1YmxpYyBrZXkgc2l6ZScpO1xuICB2YXIgc20gPSBuZXcgVWludDhBcnJheShjcnlwdG9fc2lnbl9CWVRFUyArIG1zZy5sZW5ndGgpO1xuICB2YXIgbSA9IG5ldyBVaW50OEFycmF5KGNyeXB0b19zaWduX0JZVEVTICsgbXNnLmxlbmd0aCk7XG4gIHZhciBpO1xuICBmb3IgKGkgPSAwOyBpIDwgY3J5cHRvX3NpZ25fQllURVM7IGkrKykgc21baV0gPSBzaWdbaV07XG4gIGZvciAoaSA9IDA7IGkgPCBtc2cubGVuZ3RoOyBpKyspIHNtW2krY3J5cHRvX3NpZ25fQllURVNdID0gbXNnW2ldO1xuICByZXR1cm4gKGNyeXB0b19zaWduX29wZW4obSwgc20sIHNtLmxlbmd0aCwgcHVibGljS2V5KSA+PSAwKTtcbn07XG5cbm5hY2wuc2lnbi5rZXlQYWlyID0gZnVuY3Rpb24oKSB7XG4gIHZhciBwayA9IG5ldyBVaW50OEFycmF5KGNyeXB0b19zaWduX1BVQkxJQ0tFWUJZVEVTKTtcbiAgdmFyIHNrID0gbmV3IFVpbnQ4QXJyYXkoY3J5cHRvX3NpZ25fU0VDUkVUS0VZQllURVMpO1xuICBjcnlwdG9fc2lnbl9rZXlwYWlyKHBrLCBzayk7XG4gIHJldHVybiB7cHVibGljS2V5OiBwaywgc2VjcmV0S2V5OiBza307XG59O1xuXG5uYWNsLnNpZ24ua2V5UGFpci5mcm9tU2VjcmV0S2V5ID0gZnVuY3Rpb24oc2VjcmV0S2V5KSB7XG4gIGNoZWNrQXJyYXlUeXBlcyhzZWNyZXRLZXkpO1xuICBpZiAoc2VjcmV0S2V5Lmxlbmd0aCAhPT0gY3J5cHRvX3NpZ25fU0VDUkVUS0VZQllURVMpXG4gICAgdGhyb3cgbmV3IEVycm9yKCdiYWQgc2VjcmV0IGtleSBzaXplJyk7XG4gIHZhciBwayA9IG5ldyBVaW50OEFycmF5KGNyeXB0b19zaWduX1BVQkxJQ0tFWUJZVEVTKTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBway5sZW5ndGg7IGkrKykgcGtbaV0gPSBzZWNyZXRLZXlbMzIraV07XG4gIHJldHVybiB7cHVibGljS2V5OiBwaywgc2VjcmV0S2V5OiBuZXcgVWludDhBcnJheShzZWNyZXRLZXkpfTtcbn07XG5cbm5hY2wuc2lnbi5rZXlQYWlyLmZyb21TZWVkID0gZnVuY3Rpb24oc2VlZCkge1xuICBjaGVja0FycmF5VHlwZXMoc2VlZCk7XG4gIGlmIChzZWVkLmxlbmd0aCAhPT0gY3J5cHRvX3NpZ25fU0VFREJZVEVTKVxuICAgIHRocm93IG5ldyBFcnJvcignYmFkIHNlZWQgc2l6ZScpO1xuICB2YXIgcGsgPSBuZXcgVWludDhBcnJheShjcnlwdG9fc2lnbl9QVUJMSUNLRVlCWVRFUyk7XG4gIHZhciBzayA9IG5ldyBVaW50OEFycmF5KGNyeXB0b19zaWduX1NFQ1JFVEtFWUJZVEVTKTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCAzMjsgaSsrKSBza1tpXSA9IHNlZWRbaV07XG4gIGNyeXB0b19zaWduX2tleXBhaXIocGssIHNrLCB0cnVlKTtcbiAgcmV0dXJuIHtwdWJsaWNLZXk6IHBrLCBzZWNyZXRLZXk6IHNrfTtcbn07XG5cbm5hY2wuc2lnbi5wdWJsaWNLZXlMZW5ndGggPSBjcnlwdG9fc2lnbl9QVUJMSUNLRVlCWVRFUztcbm5hY2wuc2lnbi5zZWNyZXRLZXlMZW5ndGggPSBjcnlwdG9fc2lnbl9TRUNSRVRLRVlCWVRFUztcbm5hY2wuc2lnbi5zZWVkTGVuZ3RoID0gY3J5cHRvX3NpZ25fU0VFREJZVEVTO1xubmFjbC5zaWduLnNpZ25hdHVyZUxlbmd0aCA9IGNyeXB0b19zaWduX0JZVEVTO1xuXG5uYWNsLmhhc2ggPSBmdW5jdGlvbihtc2cpIHtcbiAgY2hlY2tBcnJheVR5cGVzKG1zZyk7XG4gIHZhciBoID0gbmV3IFVpbnQ4QXJyYXkoY3J5cHRvX2hhc2hfQllURVMpO1xuICBjcnlwdG9faGFzaChoLCBtc2csIG1zZy5sZW5ndGgpO1xuICByZXR1cm4gaDtcbn07XG5cbm5hY2wuaGFzaC5oYXNoTGVuZ3RoID0gY3J5cHRvX2hhc2hfQllURVM7XG5cbm5hY2wudmVyaWZ5ID0gZnVuY3Rpb24oeCwgeSkge1xuICBjaGVja0FycmF5VHlwZXMoeCwgeSk7XG4gIC8vIFplcm8gbGVuZ3RoIGFyZ3VtZW50cyBhcmUgY29uc2lkZXJlZCBub3QgZXF1YWwuXG4gIGlmICh4Lmxlbmd0aCA9PT0gMCB8fCB5Lmxlbmd0aCA9PT0gMCkgcmV0dXJuIGZhbHNlO1xuICBpZiAoeC5sZW5ndGggIT09IHkubGVuZ3RoKSByZXR1cm4gZmFsc2U7XG4gIHJldHVybiAodm4oeCwgMCwgeSwgMCwgeC5sZW5ndGgpID09PSAwKSA/IHRydWUgOiBmYWxzZTtcbn07XG5cbm5hY2wuc2V0UFJORyA9IGZ1bmN0aW9uKGZuKSB7XG4gIHJhbmRvbWJ5dGVzID0gZm47XG59O1xuXG4oZnVuY3Rpb24oKSB7XG4gIC8vIEluaXRpYWxpemUgUFJORyBpZiBlbnZpcm9ubWVudCBwcm92aWRlcyBDU1BSTkcuXG4gIC8vIElmIG5vdCwgbWV0aG9kcyBjYWxsaW5nIHJhbmRvbWJ5dGVzIHdpbGwgdGhyb3cuXG4gIHZhciBjcnlwdG8gPSB0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcgPyAoc2VsZi5jcnlwdG8gfHwgc2VsZi5tc0NyeXB0bykgOiBudWxsO1xuICBpZiAoY3J5cHRvICYmIGNyeXB0by5nZXRSYW5kb21WYWx1ZXMpIHtcbiAgICAvLyBCcm93c2Vycy5cbiAgICB2YXIgUVVPVEEgPSA2NTUzNjtcbiAgICBuYWNsLnNldFBSTkcoZnVuY3Rpb24oeCwgbikge1xuICAgICAgdmFyIGksIHYgPSBuZXcgVWludDhBcnJheShuKTtcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBuOyBpICs9IFFVT1RBKSB7XG4gICAgICAgIGNyeXB0by5nZXRSYW5kb21WYWx1ZXModi5zdWJhcnJheShpLCBpICsgTWF0aC5taW4obiAtIGksIFFVT1RBKSkpO1xuICAgICAgfVxuICAgICAgZm9yIChpID0gMDsgaSA8IG47IGkrKykgeFtpXSA9IHZbaV07XG4gICAgICBjbGVhbnVwKHYpO1xuICAgIH0pO1xuICB9IGVsc2UgaWYgKHR5cGVvZiByZXF1aXJlICE9PSAndW5kZWZpbmVkJykge1xuICAgIC8vIE5vZGUuanMuXG4gICAgY3J5cHRvID0gcmVxdWlyZSgnY3J5cHRvJyk7XG4gICAgaWYgKGNyeXB0byAmJiBjcnlwdG8ucmFuZG9tQnl0ZXMpIHtcbiAgICAgIG5hY2wuc2V0UFJORyhmdW5jdGlvbih4LCBuKSB7XG4gICAgICAgIHZhciBpLCB2ID0gY3J5cHRvLnJhbmRvbUJ5dGVzKG4pO1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbjsgaSsrKSB4W2ldID0gdltpXTtcbiAgICAgICAgY2xlYW51cCh2KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufSkoKTtcblxufSkodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMgPyBtb2R1bGUuZXhwb3J0cyA6IChzZWxmLm5hY2wgPSBzZWxmLm5hY2wgfHwge30pKTtcbiJdLCJzb3VyY2VSb290IjoiIn0=