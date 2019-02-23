(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["vendor/vendor.elliptic"],{

/***/ "6lN/":
/*!**********************************************************!*\
  !*** ./node_modules/elliptic/lib/elliptic/curve/base.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var BN = __webpack_require__(/*! bn.js */ "OZ/i");
var elliptic = __webpack_require__(/*! ../../elliptic */ "MzeL");
var utils = elliptic.utils;
var getNAF = utils.getNAF;
var getJSF = utils.getJSF;
var assert = utils.assert;

function BaseCurve(type, conf) {
  this.type = type;
  this.p = new BN(conf.p, 16);

  // Use Montgomery, when there is no fast reduction for the prime
  this.red = conf.prime ? BN.red(conf.prime) : BN.mont(this.p);

  // Useful for many curves
  this.zero = new BN(0).toRed(this.red);
  this.one = new BN(1).toRed(this.red);
  this.two = new BN(2).toRed(this.red);

  // Curve configuration, optional
  this.n = conf.n && new BN(conf.n, 16);
  this.g = conf.g && this.pointFromJSON(conf.g, conf.gRed);

  // Temporary arrays
  this._wnafT1 = new Array(4);
  this._wnafT2 = new Array(4);
  this._wnafT3 = new Array(4);
  this._wnafT4 = new Array(4);

  // Generalized Greg Maxwell's trick
  var adjustCount = this.n && this.p.div(this.n);
  if (!adjustCount || adjustCount.cmpn(100) > 0) {
    this.redN = null;
  } else {
    this._maxwellTrick = true;
    this.redN = this.n.toRed(this.red);
  }
}
module.exports = BaseCurve;

BaseCurve.prototype.point = function point() {
  throw new Error('Not implemented');
};

BaseCurve.prototype.validate = function validate() {
  throw new Error('Not implemented');
};

BaseCurve.prototype._fixedNafMul = function _fixedNafMul(p, k) {
  assert(p.precomputed);
  var doubles = p._getDoubles();

  var naf = getNAF(k, 1);
  var I = (1 << (doubles.step + 1)) - (doubles.step % 2 === 0 ? 2 : 1);
  I /= 3;

  // Translate into more windowed form
  var repr = [];
  for (var j = 0; j < naf.length; j += doubles.step) {
    var nafW = 0;
    for (var k = j + doubles.step - 1; k >= j; k--)
      nafW = (nafW << 1) + naf[k];
    repr.push(nafW);
  }

  var a = this.jpoint(null, null, null);
  var b = this.jpoint(null, null, null);
  for (var i = I; i > 0; i--) {
    for (var j = 0; j < repr.length; j++) {
      var nafW = repr[j];
      if (nafW === i)
        b = b.mixedAdd(doubles.points[j]);
      else if (nafW === -i)
        b = b.mixedAdd(doubles.points[j].neg());
    }
    a = a.add(b);
  }
  return a.toP();
};

BaseCurve.prototype._wnafMul = function _wnafMul(p, k) {
  var w = 4;

  // Precompute window
  var nafPoints = p._getNAFPoints(w);
  w = nafPoints.wnd;
  var wnd = nafPoints.points;

  // Get NAF form
  var naf = getNAF(k, w);

  // Add `this`*(N+1) for every w-NAF index
  var acc = this.jpoint(null, null, null);
  for (var i = naf.length - 1; i >= 0; i--) {
    // Count zeroes
    for (var k = 0; i >= 0 && naf[i] === 0; i--)
      k++;
    if (i >= 0)
      k++;
    acc = acc.dblp(k);

    if (i < 0)
      break;
    var z = naf[i];
    assert(z !== 0);
    if (p.type === 'affine') {
      // J +- P
      if (z > 0)
        acc = acc.mixedAdd(wnd[(z - 1) >> 1]);
      else
        acc = acc.mixedAdd(wnd[(-z - 1) >> 1].neg());
    } else {
      // J +- J
      if (z > 0)
        acc = acc.add(wnd[(z - 1) >> 1]);
      else
        acc = acc.add(wnd[(-z - 1) >> 1].neg());
    }
  }
  return p.type === 'affine' ? acc.toP() : acc;
};

BaseCurve.prototype._wnafMulAdd = function _wnafMulAdd(defW,
                                                       points,
                                                       coeffs,
                                                       len,
                                                       jacobianResult) {
  var wndWidth = this._wnafT1;
  var wnd = this._wnafT2;
  var naf = this._wnafT3;

  // Fill all arrays
  var max = 0;
  for (var i = 0; i < len; i++) {
    var p = points[i];
    var nafPoints = p._getNAFPoints(defW);
    wndWidth[i] = nafPoints.wnd;
    wnd[i] = nafPoints.points;
  }

  // Comb small window NAFs
  for (var i = len - 1; i >= 1; i -= 2) {
    var a = i - 1;
    var b = i;
    if (wndWidth[a] !== 1 || wndWidth[b] !== 1) {
      naf[a] = getNAF(coeffs[a], wndWidth[a]);
      naf[b] = getNAF(coeffs[b], wndWidth[b]);
      max = Math.max(naf[a].length, max);
      max = Math.max(naf[b].length, max);
      continue;
    }

    var comb = [
      points[a], /* 1 */
      null, /* 3 */
      null, /* 5 */
      points[b] /* 7 */
    ];

    // Try to avoid Projective points, if possible
    if (points[a].y.cmp(points[b].y) === 0) {
      comb[1] = points[a].add(points[b]);
      comb[2] = points[a].toJ().mixedAdd(points[b].neg());
    } else if (points[a].y.cmp(points[b].y.redNeg()) === 0) {
      comb[1] = points[a].toJ().mixedAdd(points[b]);
      comb[2] = points[a].add(points[b].neg());
    } else {
      comb[1] = points[a].toJ().mixedAdd(points[b]);
      comb[2] = points[a].toJ().mixedAdd(points[b].neg());
    }

    var index = [
      -3, /* -1 -1 */
      -1, /* -1 0 */
      -5, /* -1 1 */
      -7, /* 0 -1 */
      0, /* 0 0 */
      7, /* 0 1 */
      5, /* 1 -1 */
      1, /* 1 0 */
      3  /* 1 1 */
    ];

    var jsf = getJSF(coeffs[a], coeffs[b]);
    max = Math.max(jsf[0].length, max);
    naf[a] = new Array(max);
    naf[b] = new Array(max);
    for (var j = 0; j < max; j++) {
      var ja = jsf[0][j] | 0;
      var jb = jsf[1][j] | 0;

      naf[a][j] = index[(ja + 1) * 3 + (jb + 1)];
      naf[b][j] = 0;
      wnd[a] = comb;
    }
  }

  var acc = this.jpoint(null, null, null);
  var tmp = this._wnafT4;
  for (var i = max; i >= 0; i--) {
    var k = 0;

    while (i >= 0) {
      var zero = true;
      for (var j = 0; j < len; j++) {
        tmp[j] = naf[j][i] | 0;
        if (tmp[j] !== 0)
          zero = false;
      }
      if (!zero)
        break;
      k++;
      i--;
    }
    if (i >= 0)
      k++;
    acc = acc.dblp(k);
    if (i < 0)
      break;

    for (var j = 0; j < len; j++) {
      var z = tmp[j];
      var p;
      if (z === 0)
        continue;
      else if (z > 0)
        p = wnd[j][(z - 1) >> 1];
      else if (z < 0)
        p = wnd[j][(-z - 1) >> 1].neg();

      if (p.type === 'affine')
        acc = acc.mixedAdd(p);
      else
        acc = acc.add(p);
    }
  }
  // Zeroify references
  for (var i = 0; i < len; i++)
    wnd[i] = null;

  if (jacobianResult)
    return acc;
  else
    return acc.toP();
};

function BasePoint(curve, type) {
  this.curve = curve;
  this.type = type;
  this.precomputed = null;
}
BaseCurve.BasePoint = BasePoint;

BasePoint.prototype.eq = function eq(/*other*/) {
  throw new Error('Not implemented');
};

BasePoint.prototype.validate = function validate() {
  return this.curve.validate(this);
};

BaseCurve.prototype.decodePoint = function decodePoint(bytes, enc) {
  bytes = utils.toArray(bytes, enc);

  var len = this.p.byteLength();

  // uncompressed, hybrid-odd, hybrid-even
  if ((bytes[0] === 0x04 || bytes[0] === 0x06 || bytes[0] === 0x07) &&
      bytes.length - 1 === 2 * len) {
    if (bytes[0] === 0x06)
      assert(bytes[bytes.length - 1] % 2 === 0);
    else if (bytes[0] === 0x07)
      assert(bytes[bytes.length - 1] % 2 === 1);

    var res =  this.point(bytes.slice(1, 1 + len),
                          bytes.slice(1 + len, 1 + 2 * len));

    return res;
  } else if ((bytes[0] === 0x02 || bytes[0] === 0x03) &&
              bytes.length - 1 === len) {
    return this.pointFromX(bytes.slice(1, 1 + len), bytes[0] === 0x03);
  }
  throw new Error('Unknown point format');
};

BasePoint.prototype.encodeCompressed = function encodeCompressed(enc) {
  return this.encode(enc, true);
};

BasePoint.prototype._encode = function _encode(compact) {
  var len = this.curve.p.byteLength();
  var x = this.getX().toArray('be', len);

  if (compact)
    return [ this.getY().isEven() ? 0x02 : 0x03 ].concat(x);

  return [ 0x04 ].concat(x, this.getY().toArray('be', len)) ;
};

BasePoint.prototype.encode = function encode(enc, compact) {
  return utils.encode(this._encode(compact), enc);
};

BasePoint.prototype.precompute = function precompute(power) {
  if (this.precomputed)
    return this;

  var precomputed = {
    doubles: null,
    naf: null,
    beta: null
  };
  precomputed.naf = this._getNAFPoints(8);
  precomputed.doubles = this._getDoubles(4, power);
  precomputed.beta = this._getBeta();
  this.precomputed = precomputed;

  return this;
};

BasePoint.prototype._hasDoubles = function _hasDoubles(k) {
  if (!this.precomputed)
    return false;

  var doubles = this.precomputed.doubles;
  if (!doubles)
    return false;

  return doubles.points.length >= Math.ceil((k.bitLength() + 1) / doubles.step);
};

BasePoint.prototype._getDoubles = function _getDoubles(step, power) {
  if (this.precomputed && this.precomputed.doubles)
    return this.precomputed.doubles;

  var doubles = [ this ];
  var acc = this;
  for (var i = 0; i < power; i += step) {
    for (var j = 0; j < step; j++)
      acc = acc.dbl();
    doubles.push(acc);
  }
  return {
    step: step,
    points: doubles
  };
};

BasePoint.prototype._getNAFPoints = function _getNAFPoints(wnd) {
  if (this.precomputed && this.precomputed.naf)
    return this.precomputed.naf;

  var res = [ this ];
  var max = (1 << wnd) - 1;
  var dbl = max === 1 ? null : this.dbl();
  for (var i = 1; i < max; i++)
    res[i] = res[i - 1].add(dbl);
  return {
    wnd: wnd,
    points: res
  };
};

BasePoint.prototype._getBeta = function _getBeta() {
  return null;
};

BasePoint.prototype.dblp = function dblp(k) {
  var r = this;
  for (var i = 0; i < k; i++)
    r = r.dbl();
  return r;
};


/***/ }),

/***/ "86MQ":
/*!*****************************************************!*\
  !*** ./node_modules/elliptic/lib/elliptic/utils.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = exports;
var BN = __webpack_require__(/*! bn.js */ "OZ/i");
var minAssert = __webpack_require__(/*! minimalistic-assert */ "2j6C");
var minUtils = __webpack_require__(/*! minimalistic-crypto-utils */ "dlgc");

utils.assert = minAssert;
utils.toArray = minUtils.toArray;
utils.zero2 = minUtils.zero2;
utils.toHex = minUtils.toHex;
utils.encode = minUtils.encode;

// Represent num in a w-NAF form
function getNAF(num, w) {
  var naf = [];
  var ws = 1 << (w + 1);
  var k = num.clone();
  while (k.cmpn(1) >= 0) {
    var z;
    if (k.isOdd()) {
      var mod = k.andln(ws - 1);
      if (mod > (ws >> 1) - 1)
        z = (ws >> 1) - mod;
      else
        z = mod;
      k.isubn(z);
    } else {
      z = 0;
    }
    naf.push(z);

    // Optimization, shift by word if possible
    var shift = (k.cmpn(0) !== 0 && k.andln(ws - 1) === 0) ? (w + 1) : 1;
    for (var i = 1; i < shift; i++)
      naf.push(0);
    k.iushrn(shift);
  }

  return naf;
}
utils.getNAF = getNAF;

// Represent k1, k2 in a Joint Sparse Form
function getJSF(k1, k2) {
  var jsf = [
    [],
    []
  ];

  k1 = k1.clone();
  k2 = k2.clone();
  var d1 = 0;
  var d2 = 0;
  while (k1.cmpn(-d1) > 0 || k2.cmpn(-d2) > 0) {

    // First phase
    var m14 = (k1.andln(3) + d1) & 3;
    var m24 = (k2.andln(3) + d2) & 3;
    if (m14 === 3)
      m14 = -1;
    if (m24 === 3)
      m24 = -1;
    var u1;
    if ((m14 & 1) === 0) {
      u1 = 0;
    } else {
      var m8 = (k1.andln(7) + d1) & 7;
      if ((m8 === 3 || m8 === 5) && m24 === 2)
        u1 = -m14;
      else
        u1 = m14;
    }
    jsf[0].push(u1);

    var u2;
    if ((m24 & 1) === 0) {
      u2 = 0;
    } else {
      var m8 = (k2.andln(7) + d2) & 7;
      if ((m8 === 3 || m8 === 5) && m14 === 2)
        u2 = -m24;
      else
        u2 = m24;
    }
    jsf[1].push(u2);

    // Second phase
    if (2 * d1 === u1 + 1)
      d1 = 1 - d1;
    if (2 * d2 === u2 + 1)
      d2 = 1 - d2;
    k1.iushrn(1);
    k2.iushrn(1);
  }

  return jsf;
}
utils.getJSF = getJSF;

function cachedProperty(obj, name, computer) {
  var key = '_' + name;
  obj.prototype[name] = function cachedProperty() {
    return this[key] !== undefined ? this[key] :
           this[key] = computer.call(this);
  };
}
utils.cachedProperty = cachedProperty;

function parseBytes(bytes) {
  return typeof bytes === 'string' ? utils.toArray(bytes, 'hex') :
                                     bytes;
}
utils.parseBytes = parseBytes;

function intFromLE(bytes) {
  return new BN(bytes, 'hex', 'le');
}
utils.intFromLE = intFromLE;



/***/ }),

/***/ "DLvh":
/*!******************************************************!*\
  !*** ./node_modules/elliptic/lib/elliptic/curves.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var curves = exports;

var hash = __webpack_require__(/*! hash.js */ "fZJM");
var elliptic = __webpack_require__(/*! ../elliptic */ "MzeL");

var assert = elliptic.utils.assert;

function PresetCurve(options) {
  if (options.type === 'short')
    this.curve = new elliptic.curve.short(options);
  else if (options.type === 'edwards')
    this.curve = new elliptic.curve.edwards(options);
  else
    this.curve = new elliptic.curve.mont(options);
  this.g = this.curve.g;
  this.n = this.curve.n;
  this.hash = options.hash;

  assert(this.g.validate(), 'Invalid curve');
  assert(this.g.mul(this.n).isInfinity(), 'Invalid curve, G*N != O');
}
curves.PresetCurve = PresetCurve;

function defineCurve(name, options) {
  Object.defineProperty(curves, name, {
    configurable: true,
    enumerable: true,
    get: function() {
      var curve = new PresetCurve(options);
      Object.defineProperty(curves, name, {
        configurable: true,
        enumerable: true,
        value: curve
      });
      return curve;
    }
  });
}

defineCurve('p192', {
  type: 'short',
  prime: 'p192',
  p: 'ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff',
  a: 'ffffffff ffffffff ffffffff fffffffe ffffffff fffffffc',
  b: '64210519 e59c80e7 0fa7e9ab 72243049 feb8deec c146b9b1',
  n: 'ffffffff ffffffff ffffffff 99def836 146bc9b1 b4d22831',
  hash: hash.sha256,
  gRed: false,
  g: [
    '188da80e b03090f6 7cbf20eb 43a18800 f4ff0afd 82ff1012',
    '07192b95 ffc8da78 631011ed 6b24cdd5 73f977a1 1e794811'
  ]
});

defineCurve('p224', {
  type: 'short',
  prime: 'p224',
  p: 'ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001',
  a: 'ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff fffffffe',
  b: 'b4050a85 0c04b3ab f5413256 5044b0b7 d7bfd8ba 270b3943 2355ffb4',
  n: 'ffffffff ffffffff ffffffff ffff16a2 e0b8f03e 13dd2945 5c5c2a3d',
  hash: hash.sha256,
  gRed: false,
  g: [
    'b70e0cbd 6bb4bf7f 321390b9 4a03c1d3 56c21122 343280d6 115c1d21',
    'bd376388 b5f723fb 4c22dfe6 cd4375a0 5a074764 44d58199 85007e34'
  ]
});

defineCurve('p256', {
  type: 'short',
  prime: null,
  p: 'ffffffff 00000001 00000000 00000000 00000000 ffffffff ffffffff ffffffff',
  a: 'ffffffff 00000001 00000000 00000000 00000000 ffffffff ffffffff fffffffc',
  b: '5ac635d8 aa3a93e7 b3ebbd55 769886bc 651d06b0 cc53b0f6 3bce3c3e 27d2604b',
  n: 'ffffffff 00000000 ffffffff ffffffff bce6faad a7179e84 f3b9cac2 fc632551',
  hash: hash.sha256,
  gRed: false,
  g: [
    '6b17d1f2 e12c4247 f8bce6e5 63a440f2 77037d81 2deb33a0 f4a13945 d898c296',
    '4fe342e2 fe1a7f9b 8ee7eb4a 7c0f9e16 2bce3357 6b315ece cbb64068 37bf51f5'
  ]
});

defineCurve('p384', {
  type: 'short',
  prime: null,
  p: 'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ' +
     'fffffffe ffffffff 00000000 00000000 ffffffff',
  a: 'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ' +
     'fffffffe ffffffff 00000000 00000000 fffffffc',
  b: 'b3312fa7 e23ee7e4 988e056b e3f82d19 181d9c6e fe814112 0314088f ' +
     '5013875a c656398d 8a2ed19d 2a85c8ed d3ec2aef',
  n: 'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff c7634d81 ' +
     'f4372ddf 581a0db2 48b0a77a ecec196a ccc52973',
  hash: hash.sha384,
  gRed: false,
  g: [
    'aa87ca22 be8b0537 8eb1c71e f320ad74 6e1d3b62 8ba79b98 59f741e0 82542a38 ' +
    '5502f25d bf55296c 3a545e38 72760ab7',
    '3617de4a 96262c6f 5d9e98bf 9292dc29 f8f41dbd 289a147c e9da3113 b5f0b8c0 ' +
    '0a60b1ce 1d7e819d 7a431d7c 90ea0e5f'
  ]
});

defineCurve('p521', {
  type: 'short',
  prime: null,
  p: '000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ' +
     'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ' +
     'ffffffff ffffffff ffffffff ffffffff ffffffff',
  a: '000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ' +
     'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ' +
     'ffffffff ffffffff ffffffff ffffffff fffffffc',
  b: '00000051 953eb961 8e1c9a1f 929a21a0 b68540ee a2da725b ' +
     '99b315f3 b8b48991 8ef109e1 56193951 ec7e937b 1652c0bd ' +
     '3bb1bf07 3573df88 3d2c34f1 ef451fd4 6b503f00',
  n: '000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ' +
     'ffffffff ffffffff fffffffa 51868783 bf2f966b 7fcc0148 ' +
     'f709a5d0 3bb5c9b8 899c47ae bb6fb71e 91386409',
  hash: hash.sha512,
  gRed: false,
  g: [
    '000000c6 858e06b7 0404e9cd 9e3ecb66 2395b442 9c648139 ' +
    '053fb521 f828af60 6b4d3dba a14b5e77 efe75928 fe1dc127 ' +
    'a2ffa8de 3348b3c1 856a429b f97e7e31 c2e5bd66',
    '00000118 39296a78 9a3bc004 5c8a5fb4 2c7d1bd9 98f54449 ' +
    '579b4468 17afbd17 273e662c 97ee7299 5ef42640 c550b901 ' +
    '3fad0761 353c7086 a272c240 88be9476 9fd16650'
  ]
});

defineCurve('curve25519', {
  type: 'mont',
  prime: 'p25519',
  p: '7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed',
  a: '76d06',
  b: '1',
  n: '1000000000000000 0000000000000000 14def9dea2f79cd6 5812631a5cf5d3ed',
  hash: hash.sha256,
  gRed: false,
  g: [
    '9'
  ]
});

defineCurve('ed25519', {
  type: 'edwards',
  prime: 'p25519',
  p: '7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed',
  a: '-1',
  c: '1',
  // -121665 * (121666^(-1)) (mod P)
  d: '52036cee2b6ffe73 8cc740797779e898 00700a4d4141d8ab 75eb4dca135978a3',
  n: '1000000000000000 0000000000000000 14def9dea2f79cd6 5812631a5cf5d3ed',
  hash: hash.sha256,
  gRed: false,
  g: [
    '216936d3cd6e53fec0a4e231fdd6dc5c692cc7609525a7b2c9562d608f25d51a',

    // 4/5
    '6666666666666666666666666666666666666666666666666666666666666658'
  ]
});

var pre;
try {
  pre = __webpack_require__(/*! ./precomputed/secp256k1 */ "QJsb");
} catch (e) {
  pre = undefined;
}

defineCurve('secp256k1', {
  type: 'short',
  prime: 'k256',
  p: 'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f',
  a: '0',
  b: '7',
  n: 'ffffffff ffffffff ffffffff fffffffe baaedce6 af48a03b bfd25e8c d0364141',
  h: '1',
  hash: hash.sha256,

  // Precomputed endomorphism
  beta: '7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee',
  lambda: '5363ad4cc05c30e0a5261c028812645a122e22ea20816678df02967c1b23bd72',
  basis: [
    {
      a: '3086d221a7d46bcde86c90e49284eb15',
      b: '-e4437ed6010e88286f547fa90abfe4c3'
    },
    {
      a: '114ca50f7a8e2f3f657c1108d9d44cfd8',
      b: '3086d221a7d46bcde86c90e49284eb15'
    }
  ],

  gRed: false,
  g: [
    '79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798',
    '483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8',
    pre
  ]
});


/***/ }),

/***/ "KAEN":
/*!********************************************!*\
  !*** ./node_modules/elliptic/package.json ***!
  \********************************************/
/*! exports provided: _from, _id, _inBundle, _integrity, _location, _phantomChildren, _requested, _requiredBy, _resolved, _shasum, _spec, _where, author, bugs, bundleDependencies, dependencies, deprecated, description, devDependencies, files, homepage, keywords, license, main, name, repository, scripts, version, default */
/***/ (function(module) {

module.exports = {"_from":"elliptic@^6.0.0","_id":"elliptic@6.4.1","_inBundle":false,"_integrity":"sha512-BsXLz5sqX8OHcsh7CqBMztyXARmGQ3LWPtGjJi6DiJHq5C/qvi9P3OqgswKSDftbu8+IoI/QDTAm2fFnQ9SZSQ==","_location":"/elliptic","_phantomChildren":{},"_requested":{"type":"range","registry":true,"raw":"elliptic@^6.0.0","name":"elliptic","escapedName":"elliptic","rawSpec":"^6.0.0","saveSpec":null,"fetchSpec":"^6.0.0"},"_requiredBy":["/browserify-sign","/create-ecdh"],"_resolved":"https://registry.npmjs.org/elliptic/-/elliptic-6.4.1.tgz","_shasum":"c2d0b7776911b86722c632c3c06c60f2f819939a","_spec":"elliptic@^6.0.0","_where":"C:\\Users\\garrick\\source\\repos\\snapform\\node_modules\\browserify-sign","author":{"name":"Fedor Indutny","email":"fedor@indutny.com"},"bugs":{"url":"https://github.com/indutny/elliptic/issues"},"bundleDependencies":false,"dependencies":{"bn.js":"^4.4.0","brorand":"^1.0.1","hash.js":"^1.0.0","hmac-drbg":"^1.0.0","inherits":"^2.0.1","minimalistic-assert":"^1.0.0","minimalistic-crypto-utils":"^1.0.0"},"deprecated":false,"description":"EC cryptography","devDependencies":{"brfs":"^1.4.3","coveralls":"^2.11.3","grunt":"^0.4.5","grunt-browserify":"^5.0.0","grunt-cli":"^1.2.0","grunt-contrib-connect":"^1.0.0","grunt-contrib-copy":"^1.0.0","grunt-contrib-uglify":"^1.0.1","grunt-mocha-istanbul":"^3.0.1","grunt-saucelabs":"^8.6.2","istanbul":"^0.4.2","jscs":"^2.9.0","jshint":"^2.6.0","mocha":"^2.1.0"},"files":["lib"],"homepage":"https://github.com/indutny/elliptic","keywords":["EC","Elliptic","curve","Cryptography"],"license":"MIT","main":"lib/elliptic.js","name":"elliptic","repository":{"type":"git","url":"git+ssh://git@github.com/indutny/elliptic.git"},"scripts":{"jscs":"jscs benchmarks/*.js lib/*.js lib/**/*.js lib/**/**/*.js test/index.js","jshint":"jscs benchmarks/*.js lib/*.js lib/**/*.js lib/**/**/*.js test/index.js","lint":"npm run jscs && npm run jshint","test":"npm run lint && npm run unit","unit":"istanbul test _mocha --reporter=spec test/index.js","version":"grunt dist && git add dist/"},"version":"6.4.1"};

/***/ }),

/***/ "MwBp":
/*!***********************************************************!*\
  !*** ./node_modules/elliptic/lib/elliptic/curve/short.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var curve = __webpack_require__(/*! ../curve */ "QTa/");
var elliptic = __webpack_require__(/*! ../../elliptic */ "MzeL");
var BN = __webpack_require__(/*! bn.js */ "OZ/i");
var inherits = __webpack_require__(/*! inherits */ "P7XM");
var Base = curve.base;

var assert = elliptic.utils.assert;

function ShortCurve(conf) {
  Base.call(this, 'short', conf);

  this.a = new BN(conf.a, 16).toRed(this.red);
  this.b = new BN(conf.b, 16).toRed(this.red);
  this.tinv = this.two.redInvm();

  this.zeroA = this.a.fromRed().cmpn(0) === 0;
  this.threeA = this.a.fromRed().sub(this.p).cmpn(-3) === 0;

  // If the curve is endomorphic, precalculate beta and lambda
  this.endo = this._getEndomorphism(conf);
  this._endoWnafT1 = new Array(4);
  this._endoWnafT2 = new Array(4);
}
inherits(ShortCurve, Base);
module.exports = ShortCurve;

ShortCurve.prototype._getEndomorphism = function _getEndomorphism(conf) {
  // No efficient endomorphism
  if (!this.zeroA || !this.g || !this.n || this.p.modn(3) !== 1)
    return;

  // Compute beta and lambda, that lambda * P = (beta * Px; Py)
  var beta;
  var lambda;
  if (conf.beta) {
    beta = new BN(conf.beta, 16).toRed(this.red);
  } else {
    var betas = this._getEndoRoots(this.p);
    // Choose the smallest beta
    beta = betas[0].cmp(betas[1]) < 0 ? betas[0] : betas[1];
    beta = beta.toRed(this.red);
  }
  if (conf.lambda) {
    lambda = new BN(conf.lambda, 16);
  } else {
    // Choose the lambda that is matching selected beta
    var lambdas = this._getEndoRoots(this.n);
    if (this.g.mul(lambdas[0]).x.cmp(this.g.x.redMul(beta)) === 0) {
      lambda = lambdas[0];
    } else {
      lambda = lambdas[1];
      assert(this.g.mul(lambda).x.cmp(this.g.x.redMul(beta)) === 0);
    }
  }

  // Get basis vectors, used for balanced length-two representation
  var basis;
  if (conf.basis) {
    basis = conf.basis.map(function(vec) {
      return {
        a: new BN(vec.a, 16),
        b: new BN(vec.b, 16)
      };
    });
  } else {
    basis = this._getEndoBasis(lambda);
  }

  return {
    beta: beta,
    lambda: lambda,
    basis: basis
  };
};

ShortCurve.prototype._getEndoRoots = function _getEndoRoots(num) {
  // Find roots of for x^2 + x + 1 in F
  // Root = (-1 +- Sqrt(-3)) / 2
  //
  var red = num === this.p ? this.red : BN.mont(num);
  var tinv = new BN(2).toRed(red).redInvm();
  var ntinv = tinv.redNeg();

  var s = new BN(3).toRed(red).redNeg().redSqrt().redMul(tinv);

  var l1 = ntinv.redAdd(s).fromRed();
  var l2 = ntinv.redSub(s).fromRed();
  return [ l1, l2 ];
};

ShortCurve.prototype._getEndoBasis = function _getEndoBasis(lambda) {
  // aprxSqrt >= sqrt(this.n)
  var aprxSqrt = this.n.ushrn(Math.floor(this.n.bitLength() / 2));

  // 3.74
  // Run EGCD, until r(L + 1) < aprxSqrt
  var u = lambda;
  var v = this.n.clone();
  var x1 = new BN(1);
  var y1 = new BN(0);
  var x2 = new BN(0);
  var y2 = new BN(1);

  // NOTE: all vectors are roots of: a + b * lambda = 0 (mod n)
  var a0;
  var b0;
  // First vector
  var a1;
  var b1;
  // Second vector
  var a2;
  var b2;

  var prevR;
  var i = 0;
  var r;
  var x;
  while (u.cmpn(0) !== 0) {
    var q = v.div(u);
    r = v.sub(q.mul(u));
    x = x2.sub(q.mul(x1));
    var y = y2.sub(q.mul(y1));

    if (!a1 && r.cmp(aprxSqrt) < 0) {
      a0 = prevR.neg();
      b0 = x1;
      a1 = r.neg();
      b1 = x;
    } else if (a1 && ++i === 2) {
      break;
    }
    prevR = r;

    v = u;
    u = r;
    x2 = x1;
    x1 = x;
    y2 = y1;
    y1 = y;
  }
  a2 = r.neg();
  b2 = x;

  var len1 = a1.sqr().add(b1.sqr());
  var len2 = a2.sqr().add(b2.sqr());
  if (len2.cmp(len1) >= 0) {
    a2 = a0;
    b2 = b0;
  }

  // Normalize signs
  if (a1.negative) {
    a1 = a1.neg();
    b1 = b1.neg();
  }
  if (a2.negative) {
    a2 = a2.neg();
    b2 = b2.neg();
  }

  return [
    { a: a1, b: b1 },
    { a: a2, b: b2 }
  ];
};

ShortCurve.prototype._endoSplit = function _endoSplit(k) {
  var basis = this.endo.basis;
  var v1 = basis[0];
  var v2 = basis[1];

  var c1 = v2.b.mul(k).divRound(this.n);
  var c2 = v1.b.neg().mul(k).divRound(this.n);

  var p1 = c1.mul(v1.a);
  var p2 = c2.mul(v2.a);
  var q1 = c1.mul(v1.b);
  var q2 = c2.mul(v2.b);

  // Calculate answer
  var k1 = k.sub(p1).sub(p2);
  var k2 = q1.add(q2).neg();
  return { k1: k1, k2: k2 };
};

ShortCurve.prototype.pointFromX = function pointFromX(x, odd) {
  x = new BN(x, 16);
  if (!x.red)
    x = x.toRed(this.red);

  var y2 = x.redSqr().redMul(x).redIAdd(x.redMul(this.a)).redIAdd(this.b);
  var y = y2.redSqrt();
  if (y.redSqr().redSub(y2).cmp(this.zero) !== 0)
    throw new Error('invalid point');

  // XXX Is there any way to tell if the number is odd without converting it
  // to non-red form?
  var isOdd = y.fromRed().isOdd();
  if (odd && !isOdd || !odd && isOdd)
    y = y.redNeg();

  return this.point(x, y);
};

ShortCurve.prototype.validate = function validate(point) {
  if (point.inf)
    return true;

  var x = point.x;
  var y = point.y;

  var ax = this.a.redMul(x);
  var rhs = x.redSqr().redMul(x).redIAdd(ax).redIAdd(this.b);
  return y.redSqr().redISub(rhs).cmpn(0) === 0;
};

ShortCurve.prototype._endoWnafMulAdd =
    function _endoWnafMulAdd(points, coeffs, jacobianResult) {
  var npoints = this._endoWnafT1;
  var ncoeffs = this._endoWnafT2;
  for (var i = 0; i < points.length; i++) {
    var split = this._endoSplit(coeffs[i]);
    var p = points[i];
    var beta = p._getBeta();

    if (split.k1.negative) {
      split.k1.ineg();
      p = p.neg(true);
    }
    if (split.k2.negative) {
      split.k2.ineg();
      beta = beta.neg(true);
    }

    npoints[i * 2] = p;
    npoints[i * 2 + 1] = beta;
    ncoeffs[i * 2] = split.k1;
    ncoeffs[i * 2 + 1] = split.k2;
  }
  var res = this._wnafMulAdd(1, npoints, ncoeffs, i * 2, jacobianResult);

  // Clean-up references to points and coefficients
  for (var j = 0; j < i * 2; j++) {
    npoints[j] = null;
    ncoeffs[j] = null;
  }
  return res;
};

function Point(curve, x, y, isRed) {
  Base.BasePoint.call(this, curve, 'affine');
  if (x === null && y === null) {
    this.x = null;
    this.y = null;
    this.inf = true;
  } else {
    this.x = new BN(x, 16);
    this.y = new BN(y, 16);
    // Force redgomery representation when loading from JSON
    if (isRed) {
      this.x.forceRed(this.curve.red);
      this.y.forceRed(this.curve.red);
    }
    if (!this.x.red)
      this.x = this.x.toRed(this.curve.red);
    if (!this.y.red)
      this.y = this.y.toRed(this.curve.red);
    this.inf = false;
  }
}
inherits(Point, Base.BasePoint);

ShortCurve.prototype.point = function point(x, y, isRed) {
  return new Point(this, x, y, isRed);
};

ShortCurve.prototype.pointFromJSON = function pointFromJSON(obj, red) {
  return Point.fromJSON(this, obj, red);
};

Point.prototype._getBeta = function _getBeta() {
  if (!this.curve.endo)
    return;

  var pre = this.precomputed;
  if (pre && pre.beta)
    return pre.beta;

  var beta = this.curve.point(this.x.redMul(this.curve.endo.beta), this.y);
  if (pre) {
    var curve = this.curve;
    var endoMul = function(p) {
      return curve.point(p.x.redMul(curve.endo.beta), p.y);
    };
    pre.beta = beta;
    beta.precomputed = {
      beta: null,
      naf: pre.naf && {
        wnd: pre.naf.wnd,
        points: pre.naf.points.map(endoMul)
      },
      doubles: pre.doubles && {
        step: pre.doubles.step,
        points: pre.doubles.points.map(endoMul)
      }
    };
  }
  return beta;
};

Point.prototype.toJSON = function toJSON() {
  if (!this.precomputed)
    return [ this.x, this.y ];

  return [ this.x, this.y, this.precomputed && {
    doubles: this.precomputed.doubles && {
      step: this.precomputed.doubles.step,
      points: this.precomputed.doubles.points.slice(1)
    },
    naf: this.precomputed.naf && {
      wnd: this.precomputed.naf.wnd,
      points: this.precomputed.naf.points.slice(1)
    }
  } ];
};

Point.fromJSON = function fromJSON(curve, obj, red) {
  if (typeof obj === 'string')
    obj = JSON.parse(obj);
  var res = curve.point(obj[0], obj[1], red);
  if (!obj[2])
    return res;

  function obj2point(obj) {
    return curve.point(obj[0], obj[1], red);
  }

  var pre = obj[2];
  res.precomputed = {
    beta: null,
    doubles: pre.doubles && {
      step: pre.doubles.step,
      points: [ res ].concat(pre.doubles.points.map(obj2point))
    },
    naf: pre.naf && {
      wnd: pre.naf.wnd,
      points: [ res ].concat(pre.naf.points.map(obj2point))
    }
  };
  return res;
};

Point.prototype.inspect = function inspect() {
  if (this.isInfinity())
    return '<EC Point Infinity>';
  return '<EC Point x: ' + this.x.fromRed().toString(16, 2) +
      ' y: ' + this.y.fromRed().toString(16, 2) + '>';
};

Point.prototype.isInfinity = function isInfinity() {
  return this.inf;
};

Point.prototype.add = function add(p) {
  // O + P = P
  if (this.inf)
    return p;

  // P + O = P
  if (p.inf)
    return this;

  // P + P = 2P
  if (this.eq(p))
    return this.dbl();

  // P + (-P) = O
  if (this.neg().eq(p))
    return this.curve.point(null, null);

  // P + Q = O
  if (this.x.cmp(p.x) === 0)
    return this.curve.point(null, null);

  var c = this.y.redSub(p.y);
  if (c.cmpn(0) !== 0)
    c = c.redMul(this.x.redSub(p.x).redInvm());
  var nx = c.redSqr().redISub(this.x).redISub(p.x);
  var ny = c.redMul(this.x.redSub(nx)).redISub(this.y);
  return this.curve.point(nx, ny);
};

Point.prototype.dbl = function dbl() {
  if (this.inf)
    return this;

  // 2P = O
  var ys1 = this.y.redAdd(this.y);
  if (ys1.cmpn(0) === 0)
    return this.curve.point(null, null);

  var a = this.curve.a;

  var x2 = this.x.redSqr();
  var dyinv = ys1.redInvm();
  var c = x2.redAdd(x2).redIAdd(x2).redIAdd(a).redMul(dyinv);

  var nx = c.redSqr().redISub(this.x.redAdd(this.x));
  var ny = c.redMul(this.x.redSub(nx)).redISub(this.y);
  return this.curve.point(nx, ny);
};

Point.prototype.getX = function getX() {
  return this.x.fromRed();
};

Point.prototype.getY = function getY() {
  return this.y.fromRed();
};

Point.prototype.mul = function mul(k) {
  k = new BN(k, 16);

  if (this._hasDoubles(k))
    return this.curve._fixedNafMul(this, k);
  else if (this.curve.endo)
    return this.curve._endoWnafMulAdd([ this ], [ k ]);
  else
    return this.curve._wnafMul(this, k);
};

Point.prototype.mulAdd = function mulAdd(k1, p2, k2) {
  var points = [ this, p2 ];
  var coeffs = [ k1, k2 ];
  if (this.curve.endo)
    return this.curve._endoWnafMulAdd(points, coeffs);
  else
    return this.curve._wnafMulAdd(1, points, coeffs, 2);
};

Point.prototype.jmulAdd = function jmulAdd(k1, p2, k2) {
  var points = [ this, p2 ];
  var coeffs = [ k1, k2 ];
  if (this.curve.endo)
    return this.curve._endoWnafMulAdd(points, coeffs, true);
  else
    return this.curve._wnafMulAdd(1, points, coeffs, 2, true);
};

Point.prototype.eq = function eq(p) {
  return this === p ||
         this.inf === p.inf &&
             (this.inf || this.x.cmp(p.x) === 0 && this.y.cmp(p.y) === 0);
};

Point.prototype.neg = function neg(_precompute) {
  if (this.inf)
    return this;

  var res = this.curve.point(this.x, this.y.redNeg());
  if (_precompute && this.precomputed) {
    var pre = this.precomputed;
    var negate = function(p) {
      return p.neg();
    };
    res.precomputed = {
      naf: pre.naf && {
        wnd: pre.naf.wnd,
        points: pre.naf.points.map(negate)
      },
      doubles: pre.doubles && {
        step: pre.doubles.step,
        points: pre.doubles.points.map(negate)
      }
    };
  }
  return res;
};

Point.prototype.toJ = function toJ() {
  if (this.inf)
    return this.curve.jpoint(null, null, null);

  var res = this.curve.jpoint(this.x, this.y, this.curve.one);
  return res;
};

function JPoint(curve, x, y, z) {
  Base.BasePoint.call(this, curve, 'jacobian');
  if (x === null && y === null && z === null) {
    this.x = this.curve.one;
    this.y = this.curve.one;
    this.z = new BN(0);
  } else {
    this.x = new BN(x, 16);
    this.y = new BN(y, 16);
    this.z = new BN(z, 16);
  }
  if (!this.x.red)
    this.x = this.x.toRed(this.curve.red);
  if (!this.y.red)
    this.y = this.y.toRed(this.curve.red);
  if (!this.z.red)
    this.z = this.z.toRed(this.curve.red);

  this.zOne = this.z === this.curve.one;
}
inherits(JPoint, Base.BasePoint);

ShortCurve.prototype.jpoint = function jpoint(x, y, z) {
  return new JPoint(this, x, y, z);
};

JPoint.prototype.toP = function toP() {
  if (this.isInfinity())
    return this.curve.point(null, null);

  var zinv = this.z.redInvm();
  var zinv2 = zinv.redSqr();
  var ax = this.x.redMul(zinv2);
  var ay = this.y.redMul(zinv2).redMul(zinv);

  return this.curve.point(ax, ay);
};

JPoint.prototype.neg = function neg() {
  return this.curve.jpoint(this.x, this.y.redNeg(), this.z);
};

JPoint.prototype.add = function add(p) {
  // O + P = P
  if (this.isInfinity())
    return p;

  // P + O = P
  if (p.isInfinity())
    return this;

  // 12M + 4S + 7A
  var pz2 = p.z.redSqr();
  var z2 = this.z.redSqr();
  var u1 = this.x.redMul(pz2);
  var u2 = p.x.redMul(z2);
  var s1 = this.y.redMul(pz2.redMul(p.z));
  var s2 = p.y.redMul(z2.redMul(this.z));

  var h = u1.redSub(u2);
  var r = s1.redSub(s2);
  if (h.cmpn(0) === 0) {
    if (r.cmpn(0) !== 0)
      return this.curve.jpoint(null, null, null);
    else
      return this.dbl();
  }

  var h2 = h.redSqr();
  var h3 = h2.redMul(h);
  var v = u1.redMul(h2);

  var nx = r.redSqr().redIAdd(h3).redISub(v).redISub(v);
  var ny = r.redMul(v.redISub(nx)).redISub(s1.redMul(h3));
  var nz = this.z.redMul(p.z).redMul(h);

  return this.curve.jpoint(nx, ny, nz);
};

JPoint.prototype.mixedAdd = function mixedAdd(p) {
  // O + P = P
  if (this.isInfinity())
    return p.toJ();

  // P + O = P
  if (p.isInfinity())
    return this;

  // 8M + 3S + 7A
  var z2 = this.z.redSqr();
  var u1 = this.x;
  var u2 = p.x.redMul(z2);
  var s1 = this.y;
  var s2 = p.y.redMul(z2).redMul(this.z);

  var h = u1.redSub(u2);
  var r = s1.redSub(s2);
  if (h.cmpn(0) === 0) {
    if (r.cmpn(0) !== 0)
      return this.curve.jpoint(null, null, null);
    else
      return this.dbl();
  }

  var h2 = h.redSqr();
  var h3 = h2.redMul(h);
  var v = u1.redMul(h2);

  var nx = r.redSqr().redIAdd(h3).redISub(v).redISub(v);
  var ny = r.redMul(v.redISub(nx)).redISub(s1.redMul(h3));
  var nz = this.z.redMul(h);

  return this.curve.jpoint(nx, ny, nz);
};

JPoint.prototype.dblp = function dblp(pow) {
  if (pow === 0)
    return this;
  if (this.isInfinity())
    return this;
  if (!pow)
    return this.dbl();

  if (this.curve.zeroA || this.curve.threeA) {
    var r = this;
    for (var i = 0; i < pow; i++)
      r = r.dbl();
    return r;
  }

  // 1M + 2S + 1A + N * (4S + 5M + 8A)
  // N = 1 => 6M + 6S + 9A
  var a = this.curve.a;
  var tinv = this.curve.tinv;

  var jx = this.x;
  var jy = this.y;
  var jz = this.z;
  var jz4 = jz.redSqr().redSqr();

  // Reuse results
  var jyd = jy.redAdd(jy);
  for (var i = 0; i < pow; i++) {
    var jx2 = jx.redSqr();
    var jyd2 = jyd.redSqr();
    var jyd4 = jyd2.redSqr();
    var c = jx2.redAdd(jx2).redIAdd(jx2).redIAdd(a.redMul(jz4));

    var t1 = jx.redMul(jyd2);
    var nx = c.redSqr().redISub(t1.redAdd(t1));
    var t2 = t1.redISub(nx);
    var dny = c.redMul(t2);
    dny = dny.redIAdd(dny).redISub(jyd4);
    var nz = jyd.redMul(jz);
    if (i + 1 < pow)
      jz4 = jz4.redMul(jyd4);

    jx = nx;
    jz = nz;
    jyd = dny;
  }

  return this.curve.jpoint(jx, jyd.redMul(tinv), jz);
};

JPoint.prototype.dbl = function dbl() {
  if (this.isInfinity())
    return this;

  if (this.curve.zeroA)
    return this._zeroDbl();
  else if (this.curve.threeA)
    return this._threeDbl();
  else
    return this._dbl();
};

JPoint.prototype._zeroDbl = function _zeroDbl() {
  var nx;
  var ny;
  var nz;
  // Z = 1
  if (this.zOne) {
    // hyperelliptic.org/EFD/g1p/auto-shortw-jacobian-0.html
    //     #doubling-mdbl-2007-bl
    // 1M + 5S + 14A

    // XX = X1^2
    var xx = this.x.redSqr();
    // YY = Y1^2
    var yy = this.y.redSqr();
    // YYYY = YY^2
    var yyyy = yy.redSqr();
    // S = 2 * ((X1 + YY)^2 - XX - YYYY)
    var s = this.x.redAdd(yy).redSqr().redISub(xx).redISub(yyyy);
    s = s.redIAdd(s);
    // M = 3 * XX + a; a = 0
    var m = xx.redAdd(xx).redIAdd(xx);
    // T = M ^ 2 - 2*S
    var t = m.redSqr().redISub(s).redISub(s);

    // 8 * YYYY
    var yyyy8 = yyyy.redIAdd(yyyy);
    yyyy8 = yyyy8.redIAdd(yyyy8);
    yyyy8 = yyyy8.redIAdd(yyyy8);

    // X3 = T
    nx = t;
    // Y3 = M * (S - T) - 8 * YYYY
    ny = m.redMul(s.redISub(t)).redISub(yyyy8);
    // Z3 = 2*Y1
    nz = this.y.redAdd(this.y);
  } else {
    // hyperelliptic.org/EFD/g1p/auto-shortw-jacobian-0.html
    //     #doubling-dbl-2009-l
    // 2M + 5S + 13A

    // A = X1^2
    var a = this.x.redSqr();
    // B = Y1^2
    var b = this.y.redSqr();
    // C = B^2
    var c = b.redSqr();
    // D = 2 * ((X1 + B)^2 - A - C)
    var d = this.x.redAdd(b).redSqr().redISub(a).redISub(c);
    d = d.redIAdd(d);
    // E = 3 * A
    var e = a.redAdd(a).redIAdd(a);
    // F = E^2
    var f = e.redSqr();

    // 8 * C
    var c8 = c.redIAdd(c);
    c8 = c8.redIAdd(c8);
    c8 = c8.redIAdd(c8);

    // X3 = F - 2 * D
    nx = f.redISub(d).redISub(d);
    // Y3 = E * (D - X3) - 8 * C
    ny = e.redMul(d.redISub(nx)).redISub(c8);
    // Z3 = 2 * Y1 * Z1
    nz = this.y.redMul(this.z);
    nz = nz.redIAdd(nz);
  }

  return this.curve.jpoint(nx, ny, nz);
};

JPoint.prototype._threeDbl = function _threeDbl() {
  var nx;
  var ny;
  var nz;
  // Z = 1
  if (this.zOne) {
    // hyperelliptic.org/EFD/g1p/auto-shortw-jacobian-3.html
    //     #doubling-mdbl-2007-bl
    // 1M + 5S + 15A

    // XX = X1^2
    var xx = this.x.redSqr();
    // YY = Y1^2
    var yy = this.y.redSqr();
    // YYYY = YY^2
    var yyyy = yy.redSqr();
    // S = 2 * ((X1 + YY)^2 - XX - YYYY)
    var s = this.x.redAdd(yy).redSqr().redISub(xx).redISub(yyyy);
    s = s.redIAdd(s);
    // M = 3 * XX + a
    var m = xx.redAdd(xx).redIAdd(xx).redIAdd(this.curve.a);
    // T = M^2 - 2 * S
    var t = m.redSqr().redISub(s).redISub(s);
    // X3 = T
    nx = t;
    // Y3 = M * (S - T) - 8 * YYYY
    var yyyy8 = yyyy.redIAdd(yyyy);
    yyyy8 = yyyy8.redIAdd(yyyy8);
    yyyy8 = yyyy8.redIAdd(yyyy8);
    ny = m.redMul(s.redISub(t)).redISub(yyyy8);
    // Z3 = 2 * Y1
    nz = this.y.redAdd(this.y);
  } else {
    // hyperelliptic.org/EFD/g1p/auto-shortw-jacobian-3.html#doubling-dbl-2001-b
    // 3M + 5S

    // delta = Z1^2
    var delta = this.z.redSqr();
    // gamma = Y1^2
    var gamma = this.y.redSqr();
    // beta = X1 * gamma
    var beta = this.x.redMul(gamma);
    // alpha = 3 * (X1 - delta) * (X1 + delta)
    var alpha = this.x.redSub(delta).redMul(this.x.redAdd(delta));
    alpha = alpha.redAdd(alpha).redIAdd(alpha);
    // X3 = alpha^2 - 8 * beta
    var beta4 = beta.redIAdd(beta);
    beta4 = beta4.redIAdd(beta4);
    var beta8 = beta4.redAdd(beta4);
    nx = alpha.redSqr().redISub(beta8);
    // Z3 = (Y1 + Z1)^2 - gamma - delta
    nz = this.y.redAdd(this.z).redSqr().redISub(gamma).redISub(delta);
    // Y3 = alpha * (4 * beta - X3) - 8 * gamma^2
    var ggamma8 = gamma.redSqr();
    ggamma8 = ggamma8.redIAdd(ggamma8);
    ggamma8 = ggamma8.redIAdd(ggamma8);
    ggamma8 = ggamma8.redIAdd(ggamma8);
    ny = alpha.redMul(beta4.redISub(nx)).redISub(ggamma8);
  }

  return this.curve.jpoint(nx, ny, nz);
};

JPoint.prototype._dbl = function _dbl() {
  var a = this.curve.a;

  // 4M + 6S + 10A
  var jx = this.x;
  var jy = this.y;
  var jz = this.z;
  var jz4 = jz.redSqr().redSqr();

  var jx2 = jx.redSqr();
  var jy2 = jy.redSqr();

  var c = jx2.redAdd(jx2).redIAdd(jx2).redIAdd(a.redMul(jz4));

  var jxd4 = jx.redAdd(jx);
  jxd4 = jxd4.redIAdd(jxd4);
  var t1 = jxd4.redMul(jy2);
  var nx = c.redSqr().redISub(t1.redAdd(t1));
  var t2 = t1.redISub(nx);

  var jyd8 = jy2.redSqr();
  jyd8 = jyd8.redIAdd(jyd8);
  jyd8 = jyd8.redIAdd(jyd8);
  jyd8 = jyd8.redIAdd(jyd8);
  var ny = c.redMul(t2).redISub(jyd8);
  var nz = jy.redAdd(jy).redMul(jz);

  return this.curve.jpoint(nx, ny, nz);
};

JPoint.prototype.trpl = function trpl() {
  if (!this.curve.zeroA)
    return this.dbl().add(this);

  // hyperelliptic.org/EFD/g1p/auto-shortw-jacobian-0.html#tripling-tpl-2007-bl
  // 5M + 10S + ...

  // XX = X1^2
  var xx = this.x.redSqr();
  // YY = Y1^2
  var yy = this.y.redSqr();
  // ZZ = Z1^2
  var zz = this.z.redSqr();
  // YYYY = YY^2
  var yyyy = yy.redSqr();
  // M = 3 * XX + a * ZZ2; a = 0
  var m = xx.redAdd(xx).redIAdd(xx);
  // MM = M^2
  var mm = m.redSqr();
  // E = 6 * ((X1 + YY)^2 - XX - YYYY) - MM
  var e = this.x.redAdd(yy).redSqr().redISub(xx).redISub(yyyy);
  e = e.redIAdd(e);
  e = e.redAdd(e).redIAdd(e);
  e = e.redISub(mm);
  // EE = E^2
  var ee = e.redSqr();
  // T = 16*YYYY
  var t = yyyy.redIAdd(yyyy);
  t = t.redIAdd(t);
  t = t.redIAdd(t);
  t = t.redIAdd(t);
  // U = (M + E)^2 - MM - EE - T
  var u = m.redIAdd(e).redSqr().redISub(mm).redISub(ee).redISub(t);
  // X3 = 4 * (X1 * EE - 4 * YY * U)
  var yyu4 = yy.redMul(u);
  yyu4 = yyu4.redIAdd(yyu4);
  yyu4 = yyu4.redIAdd(yyu4);
  var nx = this.x.redMul(ee).redISub(yyu4);
  nx = nx.redIAdd(nx);
  nx = nx.redIAdd(nx);
  // Y3 = 8 * Y1 * (U * (T - U) - E * EE)
  var ny = this.y.redMul(u.redMul(t.redISub(u)).redISub(e.redMul(ee)));
  ny = ny.redIAdd(ny);
  ny = ny.redIAdd(ny);
  ny = ny.redIAdd(ny);
  // Z3 = (Z1 + E)^2 - ZZ - EE
  var nz = this.z.redAdd(e).redSqr().redISub(zz).redISub(ee);

  return this.curve.jpoint(nx, ny, nz);
};

JPoint.prototype.mul = function mul(k, kbase) {
  k = new BN(k, kbase);

  return this.curve._wnafMul(this, k);
};

JPoint.prototype.eq = function eq(p) {
  if (p.type === 'affine')
    return this.eq(p.toJ());

  if (this === p)
    return true;

  // x1 * z2^2 == x2 * z1^2
  var z2 = this.z.redSqr();
  var pz2 = p.z.redSqr();
  if (this.x.redMul(pz2).redISub(p.x.redMul(z2)).cmpn(0) !== 0)
    return false;

  // y1 * z2^3 == y2 * z1^3
  var z3 = z2.redMul(this.z);
  var pz3 = pz2.redMul(p.z);
  return this.y.redMul(pz3).redISub(p.y.redMul(z3)).cmpn(0) === 0;
};

JPoint.prototype.eqXToP = function eqXToP(x) {
  var zs = this.z.redSqr();
  var rx = x.toRed(this.curve.red).redMul(zs);
  if (this.x.cmp(rx) === 0)
    return true;

  var xc = x.clone();
  var t = this.curve.redN.redMul(zs);
  for (;;) {
    xc.iadd(this.curve.n);
    if (xc.cmp(this.curve.p) >= 0)
      return false;

    rx.redIAdd(t);
    if (this.x.cmp(rx) === 0)
      return true;
  }
};

JPoint.prototype.inspect = function inspect() {
  if (this.isInfinity())
    return '<EC JPoint Infinity>';
  return '<EC JPoint x: ' + this.x.toString(16, 2) +
      ' y: ' + this.y.toString(16, 2) +
      ' z: ' + this.z.toString(16, 2) + '>';
};

JPoint.prototype.isInfinity = function isInfinity() {
  // XXX This code assumes that zero is always zero in red
  return this.z.cmpn(0) === 0;
};


/***/ }),

/***/ "MzeL":
/*!***********************************************!*\
  !*** ./node_modules/elliptic/lib/elliptic.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var elliptic = exports;

elliptic.version = __webpack_require__(/*! ../package.json */ "KAEN").version;
elliptic.utils = __webpack_require__(/*! ./elliptic/utils */ "86MQ");
elliptic.rand = __webpack_require__(/*! brorand */ "/ayr");
elliptic.curve = __webpack_require__(/*! ./elliptic/curve */ "QTa/");
elliptic.curves = __webpack_require__(/*! ./elliptic/curves */ "DLvh");

// Protocols
elliptic.ec = __webpack_require__(/*! ./elliptic/ec */ "uagp");
elliptic.eddsa = __webpack_require__(/*! ./elliptic/eddsa */ "lF1L");


/***/ }),

/***/ "OA+I":
/*!*********************************************************!*\
  !*** ./node_modules/elliptic/lib/elliptic/eddsa/key.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var elliptic = __webpack_require__(/*! ../../elliptic */ "MzeL");
var utils = elliptic.utils;
var assert = utils.assert;
var parseBytes = utils.parseBytes;
var cachedProperty = utils.cachedProperty;

/**
* @param {EDDSA} eddsa - instance
* @param {Object} params - public/private key parameters
*
* @param {Array<Byte>} [params.secret] - secret seed bytes
* @param {Point} [params.pub] - public key point (aka `A` in eddsa terms)
* @param {Array<Byte>} [params.pub] - public key point encoded as bytes
*
*/
function KeyPair(eddsa, params) {
  this.eddsa = eddsa;
  this._secret = parseBytes(params.secret);
  if (eddsa.isPoint(params.pub))
    this._pub = params.pub;
  else
    this._pubBytes = parseBytes(params.pub);
}

KeyPair.fromPublic = function fromPublic(eddsa, pub) {
  if (pub instanceof KeyPair)
    return pub;
  return new KeyPair(eddsa, { pub: pub });
};

KeyPair.fromSecret = function fromSecret(eddsa, secret) {
  if (secret instanceof KeyPair)
    return secret;
  return new KeyPair(eddsa, { secret: secret });
};

KeyPair.prototype.secret = function secret() {
  return this._secret;
};

cachedProperty(KeyPair, 'pubBytes', function pubBytes() {
  return this.eddsa.encodePoint(this.pub());
});

cachedProperty(KeyPair, 'pub', function pub() {
  if (this._pubBytes)
    return this.eddsa.decodePoint(this._pubBytes);
  return this.eddsa.g.mul(this.priv());
});

cachedProperty(KeyPair, 'privBytes', function privBytes() {
  var eddsa = this.eddsa;
  var hash = this.hash();
  var lastIx = eddsa.encodingLength - 1;

  var a = hash.slice(0, eddsa.encodingLength);
  a[0] &= 248;
  a[lastIx] &= 127;
  a[lastIx] |= 64;

  return a;
});

cachedProperty(KeyPair, 'priv', function priv() {
  return this.eddsa.decodeInt(this.privBytes());
});

cachedProperty(KeyPair, 'hash', function hash() {
  return this.eddsa.hash().update(this.secret()).digest();
});

cachedProperty(KeyPair, 'messagePrefix', function messagePrefix() {
  return this.hash().slice(this.eddsa.encodingLength);
});

KeyPair.prototype.sign = function sign(message) {
  assert(this._secret, 'KeyPair can only verify');
  return this.eddsa.sign(message, this);
};

KeyPair.prototype.verify = function verify(message, sig) {
  return this.eddsa.verify(message, sig, this);
};

KeyPair.prototype.getSecret = function getSecret(enc) {
  assert(this._secret, 'KeyPair is public only');
  return utils.encode(this.secret(), enc);
};

KeyPair.prototype.getPublic = function getPublic(enc) {
  return utils.encode(this.pubBytes(), enc);
};

module.exports = KeyPair;


/***/ }),

/***/ "Pa+m":
/*!*************************************************************!*\
  !*** ./node_modules/elliptic/lib/elliptic/curve/edwards.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var curve = __webpack_require__(/*! ../curve */ "QTa/");
var elliptic = __webpack_require__(/*! ../../elliptic */ "MzeL");
var BN = __webpack_require__(/*! bn.js */ "OZ/i");
var inherits = __webpack_require__(/*! inherits */ "P7XM");
var Base = curve.base;

var assert = elliptic.utils.assert;

function EdwardsCurve(conf) {
  // NOTE: Important as we are creating point in Base.call()
  this.twisted = (conf.a | 0) !== 1;
  this.mOneA = this.twisted && (conf.a | 0) === -1;
  this.extended = this.mOneA;

  Base.call(this, 'edwards', conf);

  this.a = new BN(conf.a, 16).umod(this.red.m);
  this.a = this.a.toRed(this.red);
  this.c = new BN(conf.c, 16).toRed(this.red);
  this.c2 = this.c.redSqr();
  this.d = new BN(conf.d, 16).toRed(this.red);
  this.dd = this.d.redAdd(this.d);

  assert(!this.twisted || this.c.fromRed().cmpn(1) === 0);
  this.oneC = (conf.c | 0) === 1;
}
inherits(EdwardsCurve, Base);
module.exports = EdwardsCurve;

EdwardsCurve.prototype._mulA = function _mulA(num) {
  if (this.mOneA)
    return num.redNeg();
  else
    return this.a.redMul(num);
};

EdwardsCurve.prototype._mulC = function _mulC(num) {
  if (this.oneC)
    return num;
  else
    return this.c.redMul(num);
};

// Just for compatibility with Short curve
EdwardsCurve.prototype.jpoint = function jpoint(x, y, z, t) {
  return this.point(x, y, z, t);
};

EdwardsCurve.prototype.pointFromX = function pointFromX(x, odd) {
  x = new BN(x, 16);
  if (!x.red)
    x = x.toRed(this.red);

  var x2 = x.redSqr();
  var rhs = this.c2.redSub(this.a.redMul(x2));
  var lhs = this.one.redSub(this.c2.redMul(this.d).redMul(x2));

  var y2 = rhs.redMul(lhs.redInvm());
  var y = y2.redSqrt();
  if (y.redSqr().redSub(y2).cmp(this.zero) !== 0)
    throw new Error('invalid point');

  var isOdd = y.fromRed().isOdd();
  if (odd && !isOdd || !odd && isOdd)
    y = y.redNeg();

  return this.point(x, y);
};

EdwardsCurve.prototype.pointFromY = function pointFromY(y, odd) {
  y = new BN(y, 16);
  if (!y.red)
    y = y.toRed(this.red);

  // x^2 = (y^2 - c^2) / (c^2 d y^2 - a)
  var y2 = y.redSqr();
  var lhs = y2.redSub(this.c2);
  var rhs = y2.redMul(this.d).redMul(this.c2).redSub(this.a);
  var x2 = lhs.redMul(rhs.redInvm());

  if (x2.cmp(this.zero) === 0) {
    if (odd)
      throw new Error('invalid point');
    else
      return this.point(this.zero, y);
  }

  var x = x2.redSqrt();
  if (x.redSqr().redSub(x2).cmp(this.zero) !== 0)
    throw new Error('invalid point');

  if (x.fromRed().isOdd() !== odd)
    x = x.redNeg();

  return this.point(x, y);
};

EdwardsCurve.prototype.validate = function validate(point) {
  if (point.isInfinity())
    return true;

  // Curve: A * X^2 + Y^2 = C^2 * (1 + D * X^2 * Y^2)
  point.normalize();

  var x2 = point.x.redSqr();
  var y2 = point.y.redSqr();
  var lhs = x2.redMul(this.a).redAdd(y2);
  var rhs = this.c2.redMul(this.one.redAdd(this.d.redMul(x2).redMul(y2)));

  return lhs.cmp(rhs) === 0;
};

function Point(curve, x, y, z, t) {
  Base.BasePoint.call(this, curve, 'projective');
  if (x === null && y === null && z === null) {
    this.x = this.curve.zero;
    this.y = this.curve.one;
    this.z = this.curve.one;
    this.t = this.curve.zero;
    this.zOne = true;
  } else {
    this.x = new BN(x, 16);
    this.y = new BN(y, 16);
    this.z = z ? new BN(z, 16) : this.curve.one;
    this.t = t && new BN(t, 16);
    if (!this.x.red)
      this.x = this.x.toRed(this.curve.red);
    if (!this.y.red)
      this.y = this.y.toRed(this.curve.red);
    if (!this.z.red)
      this.z = this.z.toRed(this.curve.red);
    if (this.t && !this.t.red)
      this.t = this.t.toRed(this.curve.red);
    this.zOne = this.z === this.curve.one;

    // Use extended coordinates
    if (this.curve.extended && !this.t) {
      this.t = this.x.redMul(this.y);
      if (!this.zOne)
        this.t = this.t.redMul(this.z.redInvm());
    }
  }
}
inherits(Point, Base.BasePoint);

EdwardsCurve.prototype.pointFromJSON = function pointFromJSON(obj) {
  return Point.fromJSON(this, obj);
};

EdwardsCurve.prototype.point = function point(x, y, z, t) {
  return new Point(this, x, y, z, t);
};

Point.fromJSON = function fromJSON(curve, obj) {
  return new Point(curve, obj[0], obj[1], obj[2]);
};

Point.prototype.inspect = function inspect() {
  if (this.isInfinity())
    return '<EC Point Infinity>';
  return '<EC Point x: ' + this.x.fromRed().toString(16, 2) +
      ' y: ' + this.y.fromRed().toString(16, 2) +
      ' z: ' + this.z.fromRed().toString(16, 2) + '>';
};

Point.prototype.isInfinity = function isInfinity() {
  // XXX This code assumes that zero is always zero in red
  return this.x.cmpn(0) === 0 &&
    (this.y.cmp(this.z) === 0 ||
    (this.zOne && this.y.cmp(this.curve.c) === 0));
};

Point.prototype._extDbl = function _extDbl() {
  // hyperelliptic.org/EFD/g1p/auto-twisted-extended-1.html
  //     #doubling-dbl-2008-hwcd
  // 4M + 4S

  // A = X1^2
  var a = this.x.redSqr();
  // B = Y1^2
  var b = this.y.redSqr();
  // C = 2 * Z1^2
  var c = this.z.redSqr();
  c = c.redIAdd(c);
  // D = a * A
  var d = this.curve._mulA(a);
  // E = (X1 + Y1)^2 - A - B
  var e = this.x.redAdd(this.y).redSqr().redISub(a).redISub(b);
  // G = D + B
  var g = d.redAdd(b);
  // F = G - C
  var f = g.redSub(c);
  // H = D - B
  var h = d.redSub(b);
  // X3 = E * F
  var nx = e.redMul(f);
  // Y3 = G * H
  var ny = g.redMul(h);
  // T3 = E * H
  var nt = e.redMul(h);
  // Z3 = F * G
  var nz = f.redMul(g);
  return this.curve.point(nx, ny, nz, nt);
};

Point.prototype._projDbl = function _projDbl() {
  // hyperelliptic.org/EFD/g1p/auto-twisted-projective.html
  //     #doubling-dbl-2008-bbjlp
  //     #doubling-dbl-2007-bl
  // and others
  // Generally 3M + 4S or 2M + 4S

  // B = (X1 + Y1)^2
  var b = this.x.redAdd(this.y).redSqr();
  // C = X1^2
  var c = this.x.redSqr();
  // D = Y1^2
  var d = this.y.redSqr();

  var nx;
  var ny;
  var nz;
  if (this.curve.twisted) {
    // E = a * C
    var e = this.curve._mulA(c);
    // F = E + D
    var f = e.redAdd(d);
    if (this.zOne) {
      // X3 = (B - C - D) * (F - 2)
      nx = b.redSub(c).redSub(d).redMul(f.redSub(this.curve.two));
      // Y3 = F * (E - D)
      ny = f.redMul(e.redSub(d));
      // Z3 = F^2 - 2 * F
      nz = f.redSqr().redSub(f).redSub(f);
    } else {
      // H = Z1^2
      var h = this.z.redSqr();
      // J = F - 2 * H
      var j = f.redSub(h).redISub(h);
      // X3 = (B-C-D)*J
      nx = b.redSub(c).redISub(d).redMul(j);
      // Y3 = F * (E - D)
      ny = f.redMul(e.redSub(d));
      // Z3 = F * J
      nz = f.redMul(j);
    }
  } else {
    // E = C + D
    var e = c.redAdd(d);
    // H = (c * Z1)^2
    var h = this.curve._mulC(this.z).redSqr();
    // J = E - 2 * H
    var j = e.redSub(h).redSub(h);
    // X3 = c * (B - E) * J
    nx = this.curve._mulC(b.redISub(e)).redMul(j);
    // Y3 = c * E * (C - D)
    ny = this.curve._mulC(e).redMul(c.redISub(d));
    // Z3 = E * J
    nz = e.redMul(j);
  }
  return this.curve.point(nx, ny, nz);
};

Point.prototype.dbl = function dbl() {
  if (this.isInfinity())
    return this;

  // Double in extended coordinates
  if (this.curve.extended)
    return this._extDbl();
  else
    return this._projDbl();
};

Point.prototype._extAdd = function _extAdd(p) {
  // hyperelliptic.org/EFD/g1p/auto-twisted-extended-1.html
  //     #addition-add-2008-hwcd-3
  // 8M

  // A = (Y1 - X1) * (Y2 - X2)
  var a = this.y.redSub(this.x).redMul(p.y.redSub(p.x));
  // B = (Y1 + X1) * (Y2 + X2)
  var b = this.y.redAdd(this.x).redMul(p.y.redAdd(p.x));
  // C = T1 * k * T2
  var c = this.t.redMul(this.curve.dd).redMul(p.t);
  // D = Z1 * 2 * Z2
  var d = this.z.redMul(p.z.redAdd(p.z));
  // E = B - A
  var e = b.redSub(a);
  // F = D - C
  var f = d.redSub(c);
  // G = D + C
  var g = d.redAdd(c);
  // H = B + A
  var h = b.redAdd(a);
  // X3 = E * F
  var nx = e.redMul(f);
  // Y3 = G * H
  var ny = g.redMul(h);
  // T3 = E * H
  var nt = e.redMul(h);
  // Z3 = F * G
  var nz = f.redMul(g);
  return this.curve.point(nx, ny, nz, nt);
};

Point.prototype._projAdd = function _projAdd(p) {
  // hyperelliptic.org/EFD/g1p/auto-twisted-projective.html
  //     #addition-add-2008-bbjlp
  //     #addition-add-2007-bl
  // 10M + 1S

  // A = Z1 * Z2
  var a = this.z.redMul(p.z);
  // B = A^2
  var b = a.redSqr();
  // C = X1 * X2
  var c = this.x.redMul(p.x);
  // D = Y1 * Y2
  var d = this.y.redMul(p.y);
  // E = d * C * D
  var e = this.curve.d.redMul(c).redMul(d);
  // F = B - E
  var f = b.redSub(e);
  // G = B + E
  var g = b.redAdd(e);
  // X3 = A * F * ((X1 + Y1) * (X2 + Y2) - C - D)
  var tmp = this.x.redAdd(this.y).redMul(p.x.redAdd(p.y)).redISub(c).redISub(d);
  var nx = a.redMul(f).redMul(tmp);
  var ny;
  var nz;
  if (this.curve.twisted) {
    // Y3 = A * G * (D - a * C)
    ny = a.redMul(g).redMul(d.redSub(this.curve._mulA(c)));
    // Z3 = F * G
    nz = f.redMul(g);
  } else {
    // Y3 = A * G * (D - C)
    ny = a.redMul(g).redMul(d.redSub(c));
    // Z3 = c * F * G
    nz = this.curve._mulC(f).redMul(g);
  }
  return this.curve.point(nx, ny, nz);
};

Point.prototype.add = function add(p) {
  if (this.isInfinity())
    return p;
  if (p.isInfinity())
    return this;

  if (this.curve.extended)
    return this._extAdd(p);
  else
    return this._projAdd(p);
};

Point.prototype.mul = function mul(k) {
  if (this._hasDoubles(k))
    return this.curve._fixedNafMul(this, k);
  else
    return this.curve._wnafMul(this, k);
};

Point.prototype.mulAdd = function mulAdd(k1, p, k2) {
  return this.curve._wnafMulAdd(1, [ this, p ], [ k1, k2 ], 2, false);
};

Point.prototype.jmulAdd = function jmulAdd(k1, p, k2) {
  return this.curve._wnafMulAdd(1, [ this, p ], [ k1, k2 ], 2, true);
};

Point.prototype.normalize = function normalize() {
  if (this.zOne)
    return this;

  // Normalize coordinates
  var zi = this.z.redInvm();
  this.x = this.x.redMul(zi);
  this.y = this.y.redMul(zi);
  if (this.t)
    this.t = this.t.redMul(zi);
  this.z = this.curve.one;
  this.zOne = true;
  return this;
};

Point.prototype.neg = function neg() {
  return this.curve.point(this.x.redNeg(),
                          this.y,
                          this.z,
                          this.t && this.t.redNeg());
};

Point.prototype.getX = function getX() {
  this.normalize();
  return this.x.fromRed();
};

Point.prototype.getY = function getY() {
  this.normalize();
  return this.y.fromRed();
};

Point.prototype.eq = function eq(other) {
  return this === other ||
         this.getX().cmp(other.getX()) === 0 &&
         this.getY().cmp(other.getY()) === 0;
};

Point.prototype.eqXToP = function eqXToP(x) {
  var rx = x.toRed(this.curve.red).redMul(this.z);
  if (this.x.cmp(rx) === 0)
    return true;

  var xc = x.clone();
  var t = this.curve.redN.redMul(this.z);
  for (;;) {
    xc.iadd(this.curve.n);
    if (xc.cmp(this.curve.p) >= 0)
      return false;

    rx.redIAdd(t);
    if (this.x.cmp(rx) === 0)
      return true;
  }
};

// Compatibility with BaseCurve
Point.prototype.toP = Point.prototype.normalize;
Point.prototype.mixedAdd = Point.prototype.add;


/***/ }),

/***/ "QJsb":
/*!*********************************************************************!*\
  !*** ./node_modules/elliptic/lib/elliptic/precomputed/secp256k1.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {
  doubles: {
    step: 4,
    points: [
      [
        'e60fce93b59e9ec53011aabc21c23e97b2a31369b87a5ae9c44ee89e2a6dec0a',
        'f7e3507399e595929db99f34f57937101296891e44d23f0be1f32cce69616821'
      ],
      [
        '8282263212c609d9ea2a6e3e172de238d8c39cabd5ac1ca10646e23fd5f51508',
        '11f8a8098557dfe45e8256e830b60ace62d613ac2f7b17bed31b6eaff6e26caf'
      ],
      [
        '175e159f728b865a72f99cc6c6fc846de0b93833fd2222ed73fce5b551e5b739',
        'd3506e0d9e3c79eba4ef97a51ff71f5eacb5955add24345c6efa6ffee9fed695'
      ],
      [
        '363d90d447b00c9c99ceac05b6262ee053441c7e55552ffe526bad8f83ff4640',
        '4e273adfc732221953b445397f3363145b9a89008199ecb62003c7f3bee9de9'
      ],
      [
        '8b4b5f165df3c2be8c6244b5b745638843e4a781a15bcd1b69f79a55dffdf80c',
        '4aad0a6f68d308b4b3fbd7813ab0da04f9e336546162ee56b3eff0c65fd4fd36'
      ],
      [
        '723cbaa6e5db996d6bf771c00bd548c7b700dbffa6c0e77bcb6115925232fcda',
        '96e867b5595cc498a921137488824d6e2660a0653779494801dc069d9eb39f5f'
      ],
      [
        'eebfa4d493bebf98ba5feec812c2d3b50947961237a919839a533eca0e7dd7fa',
        '5d9a8ca3970ef0f269ee7edaf178089d9ae4cdc3a711f712ddfd4fdae1de8999'
      ],
      [
        '100f44da696e71672791d0a09b7bde459f1215a29b3c03bfefd7835b39a48db0',
        'cdd9e13192a00b772ec8f3300c090666b7ff4a18ff5195ac0fbd5cd62bc65a09'
      ],
      [
        'e1031be262c7ed1b1dc9227a4a04c017a77f8d4464f3b3852c8acde6e534fd2d',
        '9d7061928940405e6bb6a4176597535af292dd419e1ced79a44f18f29456a00d'
      ],
      [
        'feea6cae46d55b530ac2839f143bd7ec5cf8b266a41d6af52d5e688d9094696d',
        'e57c6b6c97dce1bab06e4e12bf3ecd5c981c8957cc41442d3155debf18090088'
      ],
      [
        'da67a91d91049cdcb367be4be6ffca3cfeed657d808583de33fa978bc1ec6cb1',
        '9bacaa35481642bc41f463f7ec9780e5dec7adc508f740a17e9ea8e27a68be1d'
      ],
      [
        '53904faa0b334cdda6e000935ef22151ec08d0f7bb11069f57545ccc1a37b7c0',
        '5bc087d0bc80106d88c9eccac20d3c1c13999981e14434699dcb096b022771c8'
      ],
      [
        '8e7bcd0bd35983a7719cca7764ca906779b53a043a9b8bcaeff959f43ad86047',
        '10b7770b2a3da4b3940310420ca9514579e88e2e47fd68b3ea10047e8460372a'
      ],
      [
        '385eed34c1cdff21e6d0818689b81bde71a7f4f18397e6690a841e1599c43862',
        '283bebc3e8ea23f56701de19e9ebf4576b304eec2086dc8cc0458fe5542e5453'
      ],
      [
        '6f9d9b803ecf191637c73a4413dfa180fddf84a5947fbc9c606ed86c3fac3a7',
        '7c80c68e603059ba69b8e2a30e45c4d47ea4dd2f5c281002d86890603a842160'
      ],
      [
        '3322d401243c4e2582a2147c104d6ecbf774d163db0f5e5313b7e0e742d0e6bd',
        '56e70797e9664ef5bfb019bc4ddaf9b72805f63ea2873af624f3a2e96c28b2a0'
      ],
      [
        '85672c7d2de0b7da2bd1770d89665868741b3f9af7643397721d74d28134ab83',
        '7c481b9b5b43b2eb6374049bfa62c2e5e77f17fcc5298f44c8e3094f790313a6'
      ],
      [
        '948bf809b1988a46b06c9f1919413b10f9226c60f668832ffd959af60c82a0a',
        '53a562856dcb6646dc6b74c5d1c3418c6d4dff08c97cd2bed4cb7f88d8c8e589'
      ],
      [
        '6260ce7f461801c34f067ce0f02873a8f1b0e44dfc69752accecd819f38fd8e8',
        'bc2da82b6fa5b571a7f09049776a1ef7ecd292238051c198c1a84e95b2b4ae17'
      ],
      [
        'e5037de0afc1d8d43d8348414bbf4103043ec8f575bfdc432953cc8d2037fa2d',
        '4571534baa94d3b5f9f98d09fb990bddbd5f5b03ec481f10e0e5dc841d755bda'
      ],
      [
        'e06372b0f4a207adf5ea905e8f1771b4e7e8dbd1c6a6c5b725866a0ae4fce725',
        '7a908974bce18cfe12a27bb2ad5a488cd7484a7787104870b27034f94eee31dd'
      ],
      [
        '213c7a715cd5d45358d0bbf9dc0ce02204b10bdde2a3f58540ad6908d0559754',
        '4b6dad0b5ae462507013ad06245ba190bb4850f5f36a7eeddff2c27534b458f2'
      ],
      [
        '4e7c272a7af4b34e8dbb9352a5419a87e2838c70adc62cddf0cc3a3b08fbd53c',
        '17749c766c9d0b18e16fd09f6def681b530b9614bff7dd33e0b3941817dcaae6'
      ],
      [
        'fea74e3dbe778b1b10f238ad61686aa5c76e3db2be43057632427e2840fb27b6',
        '6e0568db9b0b13297cf674deccb6af93126b596b973f7b77701d3db7f23cb96f'
      ],
      [
        '76e64113f677cf0e10a2570d599968d31544e179b760432952c02a4417bdde39',
        'c90ddf8dee4e95cf577066d70681f0d35e2a33d2b56d2032b4b1752d1901ac01'
      ],
      [
        'c738c56b03b2abe1e8281baa743f8f9a8f7cc643df26cbee3ab150242bcbb891',
        '893fb578951ad2537f718f2eacbfbbbb82314eef7880cfe917e735d9699a84c3'
      ],
      [
        'd895626548b65b81e264c7637c972877d1d72e5f3a925014372e9f6588f6c14b',
        'febfaa38f2bc7eae728ec60818c340eb03428d632bb067e179363ed75d7d991f'
      ],
      [
        'b8da94032a957518eb0f6433571e8761ceffc73693e84edd49150a564f676e03',
        '2804dfa44805a1e4d7c99cc9762808b092cc584d95ff3b511488e4e74efdf6e7'
      ],
      [
        'e80fea14441fb33a7d8adab9475d7fab2019effb5156a792f1a11778e3c0df5d',
        'eed1de7f638e00771e89768ca3ca94472d155e80af322ea9fcb4291b6ac9ec78'
      ],
      [
        'a301697bdfcd704313ba48e51d567543f2a182031efd6915ddc07bbcc4e16070',
        '7370f91cfb67e4f5081809fa25d40f9b1735dbf7c0a11a130c0d1a041e177ea1'
      ],
      [
        '90ad85b389d6b936463f9d0512678de208cc330b11307fffab7ac63e3fb04ed4',
        'e507a3620a38261affdcbd9427222b839aefabe1582894d991d4d48cb6ef150'
      ],
      [
        '8f68b9d2f63b5f339239c1ad981f162ee88c5678723ea3351b7b444c9ec4c0da',
        '662a9f2dba063986de1d90c2b6be215dbbea2cfe95510bfdf23cbf79501fff82'
      ],
      [
        'e4f3fb0176af85d65ff99ff9198c36091f48e86503681e3e6686fd5053231e11',
        '1e63633ad0ef4f1c1661a6d0ea02b7286cc7e74ec951d1c9822c38576feb73bc'
      ],
      [
        '8c00fa9b18ebf331eb961537a45a4266c7034f2f0d4e1d0716fb6eae20eae29e',
        'efa47267fea521a1a9dc343a3736c974c2fadafa81e36c54e7d2a4c66702414b'
      ],
      [
        'e7a26ce69dd4829f3e10cec0a9e98ed3143d084f308b92c0997fddfc60cb3e41',
        '2a758e300fa7984b471b006a1aafbb18d0a6b2c0420e83e20e8a9421cf2cfd51'
      ],
      [
        'b6459e0ee3662ec8d23540c223bcbdc571cbcb967d79424f3cf29eb3de6b80ef',
        '67c876d06f3e06de1dadf16e5661db3c4b3ae6d48e35b2ff30bf0b61a71ba45'
      ],
      [
        'd68a80c8280bb840793234aa118f06231d6f1fc67e73c5a5deda0f5b496943e8',
        'db8ba9fff4b586d00c4b1f9177b0e28b5b0e7b8f7845295a294c84266b133120'
      ],
      [
        '324aed7df65c804252dc0270907a30b09612aeb973449cea4095980fc28d3d5d',
        '648a365774b61f2ff130c0c35aec1f4f19213b0c7e332843967224af96ab7c84'
      ],
      [
        '4df9c14919cde61f6d51dfdbe5fee5dceec4143ba8d1ca888e8bd373fd054c96',
        '35ec51092d8728050974c23a1d85d4b5d506cdc288490192ebac06cad10d5d'
      ],
      [
        '9c3919a84a474870faed8a9c1cc66021523489054d7f0308cbfc99c8ac1f98cd',
        'ddb84f0f4a4ddd57584f044bf260e641905326f76c64c8e6be7e5e03d4fc599d'
      ],
      [
        '6057170b1dd12fdf8de05f281d8e06bb91e1493a8b91d4cc5a21382120a959e5',
        '9a1af0b26a6a4807add9a2daf71df262465152bc3ee24c65e899be932385a2a8'
      ],
      [
        'a576df8e23a08411421439a4518da31880cef0fba7d4df12b1a6973eecb94266',
        '40a6bf20e76640b2c92b97afe58cd82c432e10a7f514d9f3ee8be11ae1b28ec8'
      ],
      [
        '7778a78c28dec3e30a05fe9629de8c38bb30d1f5cf9a3a208f763889be58ad71',
        '34626d9ab5a5b22ff7098e12f2ff580087b38411ff24ac563b513fc1fd9f43ac'
      ],
      [
        '928955ee637a84463729fd30e7afd2ed5f96274e5ad7e5cb09eda9c06d903ac',
        'c25621003d3f42a827b78a13093a95eeac3d26efa8a8d83fc5180e935bcd091f'
      ],
      [
        '85d0fef3ec6db109399064f3a0e3b2855645b4a907ad354527aae75163d82751',
        '1f03648413a38c0be29d496e582cf5663e8751e96877331582c237a24eb1f962'
      ],
      [
        'ff2b0dce97eece97c1c9b6041798b85dfdfb6d8882da20308f5404824526087e',
        '493d13fef524ba188af4c4dc54d07936c7b7ed6fb90e2ceb2c951e01f0c29907'
      ],
      [
        '827fbbe4b1e880ea9ed2b2e6301b212b57f1ee148cd6dd28780e5e2cf856e241',
        'c60f9c923c727b0b71bef2c67d1d12687ff7a63186903166d605b68baec293ec'
      ],
      [
        'eaa649f21f51bdbae7be4ae34ce6e5217a58fdce7f47f9aa7f3b58fa2120e2b3',
        'be3279ed5bbbb03ac69a80f89879aa5a01a6b965f13f7e59d47a5305ba5ad93d'
      ],
      [
        'e4a42d43c5cf169d9391df6decf42ee541b6d8f0c9a137401e23632dda34d24f',
        '4d9f92e716d1c73526fc99ccfb8ad34ce886eedfa8d8e4f13a7f7131deba9414'
      ],
      [
        '1ec80fef360cbdd954160fadab352b6b92b53576a88fea4947173b9d4300bf19',
        'aeefe93756b5340d2f3a4958a7abbf5e0146e77f6295a07b671cdc1cc107cefd'
      ],
      [
        '146a778c04670c2f91b00af4680dfa8bce3490717d58ba889ddb5928366642be',
        'b318e0ec3354028add669827f9d4b2870aaa971d2f7e5ed1d0b297483d83efd0'
      ],
      [
        'fa50c0f61d22e5f07e3acebb1aa07b128d0012209a28b9776d76a8793180eef9',
        '6b84c6922397eba9b72cd2872281a68a5e683293a57a213b38cd8d7d3f4f2811'
      ],
      [
        'da1d61d0ca721a11b1a5bf6b7d88e8421a288ab5d5bba5220e53d32b5f067ec2',
        '8157f55a7c99306c79c0766161c91e2966a73899d279b48a655fba0f1ad836f1'
      ],
      [
        'a8e282ff0c9706907215ff98e8fd416615311de0446f1e062a73b0610d064e13',
        '7f97355b8db81c09abfb7f3c5b2515888b679a3e50dd6bd6cef7c73111f4cc0c'
      ],
      [
        '174a53b9c9a285872d39e56e6913cab15d59b1fa512508c022f382de8319497c',
        'ccc9dc37abfc9c1657b4155f2c47f9e6646b3a1d8cb9854383da13ac079afa73'
      ],
      [
        '959396981943785c3d3e57edf5018cdbe039e730e4918b3d884fdff09475b7ba',
        '2e7e552888c331dd8ba0386a4b9cd6849c653f64c8709385e9b8abf87524f2fd'
      ],
      [
        'd2a63a50ae401e56d645a1153b109a8fcca0a43d561fba2dbb51340c9d82b151',
        'e82d86fb6443fcb7565aee58b2948220a70f750af484ca52d4142174dcf89405'
      ],
      [
        '64587e2335471eb890ee7896d7cfdc866bacbdbd3839317b3436f9b45617e073',
        'd99fcdd5bf6902e2ae96dd6447c299a185b90a39133aeab358299e5e9faf6589'
      ],
      [
        '8481bde0e4e4d885b3a546d3e549de042f0aa6cea250e7fd358d6c86dd45e458',
        '38ee7b8cba5404dd84a25bf39cecb2ca900a79c42b262e556d64b1b59779057e'
      ],
      [
        '13464a57a78102aa62b6979ae817f4637ffcfed3c4b1ce30bcd6303f6caf666b',
        '69be159004614580ef7e433453ccb0ca48f300a81d0942e13f495a907f6ecc27'
      ],
      [
        'bc4a9df5b713fe2e9aef430bcc1dc97a0cd9ccede2f28588cada3a0d2d83f366',
        'd3a81ca6e785c06383937adf4b798caa6e8a9fbfa547b16d758d666581f33c1'
      ],
      [
        '8c28a97bf8298bc0d23d8c749452a32e694b65e30a9472a3954ab30fe5324caa',
        '40a30463a3305193378fedf31f7cc0eb7ae784f0451cb9459e71dc73cbef9482'
      ],
      [
        '8ea9666139527a8c1dd94ce4f071fd23c8b350c5a4bb33748c4ba111faccae0',
        '620efabbc8ee2782e24e7c0cfb95c5d735b783be9cf0f8e955af34a30e62b945'
      ],
      [
        'dd3625faef5ba06074669716bbd3788d89bdde815959968092f76cc4eb9a9787',
        '7a188fa3520e30d461da2501045731ca941461982883395937f68d00c644a573'
      ],
      [
        'f710d79d9eb962297e4f6232b40e8f7feb2bc63814614d692c12de752408221e',
        'ea98e67232d3b3295d3b535532115ccac8612c721851617526ae47a9c77bfc82'
      ]
    ]
  },
  naf: {
    wnd: 7,
    points: [
      [
        'f9308a019258c31049344f85f89d5229b531c845836f99b08601f113bce036f9',
        '388f7b0f632de8140fe337e62a37f3566500a99934c2231b6cb9fd7584b8e672'
      ],
      [
        '2f8bde4d1a07209355b4a7250a5c5128e88b84bddc619ab7cba8d569b240efe4',
        'd8ac222636e5e3d6d4dba9dda6c9c426f788271bab0d6840dca87d3aa6ac62d6'
      ],
      [
        '5cbdf0646e5db4eaa398f365f2ea7a0e3d419b7e0330e39ce92bddedcac4f9bc',
        '6aebca40ba255960a3178d6d861a54dba813d0b813fde7b5a5082628087264da'
      ],
      [
        'acd484e2f0c7f65309ad178a9f559abde09796974c57e714c35f110dfc27ccbe',
        'cc338921b0a7d9fd64380971763b61e9add888a4375f8e0f05cc262ac64f9c37'
      ],
      [
        '774ae7f858a9411e5ef4246b70c65aac5649980be5c17891bbec17895da008cb',
        'd984a032eb6b5e190243dd56d7b7b365372db1e2dff9d6a8301d74c9c953c61b'
      ],
      [
        'f28773c2d975288bc7d1d205c3748651b075fbc6610e58cddeeddf8f19405aa8',
        'ab0902e8d880a89758212eb65cdaf473a1a06da521fa91f29b5cb52db03ed81'
      ],
      [
        'd7924d4f7d43ea965a465ae3095ff41131e5946f3c85f79e44adbcf8e27e080e',
        '581e2872a86c72a683842ec228cc6defea40af2bd896d3a5c504dc9ff6a26b58'
      ],
      [
        'defdea4cdb677750a420fee807eacf21eb9898ae79b9768766e4faa04a2d4a34',
        '4211ab0694635168e997b0ead2a93daeced1f4a04a95c0f6cfb199f69e56eb77'
      ],
      [
        '2b4ea0a797a443d293ef5cff444f4979f06acfebd7e86d277475656138385b6c',
        '85e89bc037945d93b343083b5a1c86131a01f60c50269763b570c854e5c09b7a'
      ],
      [
        '352bbf4a4cdd12564f93fa332ce333301d9ad40271f8107181340aef25be59d5',
        '321eb4075348f534d59c18259dda3e1f4a1b3b2e71b1039c67bd3d8bcf81998c'
      ],
      [
        '2fa2104d6b38d11b0230010559879124e42ab8dfeff5ff29dc9cdadd4ecacc3f',
        '2de1068295dd865b64569335bd5dd80181d70ecfc882648423ba76b532b7d67'
      ],
      [
        '9248279b09b4d68dab21a9b066edda83263c3d84e09572e269ca0cd7f5453714',
        '73016f7bf234aade5d1aa71bdea2b1ff3fc0de2a887912ffe54a32ce97cb3402'
      ],
      [
        'daed4f2be3a8bf278e70132fb0beb7522f570e144bf615c07e996d443dee8729',
        'a69dce4a7d6c98e8d4a1aca87ef8d7003f83c230f3afa726ab40e52290be1c55'
      ],
      [
        'c44d12c7065d812e8acf28d7cbb19f9011ecd9e9fdf281b0e6a3b5e87d22e7db',
        '2119a460ce326cdc76c45926c982fdac0e106e861edf61c5a039063f0e0e6482'
      ],
      [
        '6a245bf6dc698504c89a20cfded60853152b695336c28063b61c65cbd269e6b4',
        'e022cf42c2bd4a708b3f5126f16a24ad8b33ba48d0423b6efd5e6348100d8a82'
      ],
      [
        '1697ffa6fd9de627c077e3d2fe541084ce13300b0bec1146f95ae57f0d0bd6a5',
        'b9c398f186806f5d27561506e4557433a2cf15009e498ae7adee9d63d01b2396'
      ],
      [
        '605bdb019981718b986d0f07e834cb0d9deb8360ffb7f61df982345ef27a7479',
        '2972d2de4f8d20681a78d93ec96fe23c26bfae84fb14db43b01e1e9056b8c49'
      ],
      [
        '62d14dab4150bf497402fdc45a215e10dcb01c354959b10cfe31c7e9d87ff33d',
        '80fc06bd8cc5b01098088a1950eed0db01aa132967ab472235f5642483b25eaf'
      ],
      [
        '80c60ad0040f27dade5b4b06c408e56b2c50e9f56b9b8b425e555c2f86308b6f',
        '1c38303f1cc5c30f26e66bad7fe72f70a65eed4cbe7024eb1aa01f56430bd57a'
      ],
      [
        '7a9375ad6167ad54aa74c6348cc54d344cc5dc9487d847049d5eabb0fa03c8fb',
        'd0e3fa9eca8726909559e0d79269046bdc59ea10c70ce2b02d499ec224dc7f7'
      ],
      [
        'd528ecd9b696b54c907a9ed045447a79bb408ec39b68df504bb51f459bc3ffc9',
        'eecf41253136e5f99966f21881fd656ebc4345405c520dbc063465b521409933'
      ],
      [
        '49370a4b5f43412ea25f514e8ecdad05266115e4a7ecb1387231808f8b45963',
        '758f3f41afd6ed428b3081b0512fd62a54c3f3afbb5b6764b653052a12949c9a'
      ],
      [
        '77f230936ee88cbbd73df930d64702ef881d811e0e1498e2f1c13eb1fc345d74',
        '958ef42a7886b6400a08266e9ba1b37896c95330d97077cbbe8eb3c7671c60d6'
      ],
      [
        'f2dac991cc4ce4b9ea44887e5c7c0bce58c80074ab9d4dbaeb28531b7739f530',
        'e0dedc9b3b2f8dad4da1f32dec2531df9eb5fbeb0598e4fd1a117dba703a3c37'
      ],
      [
        '463b3d9f662621fb1b4be8fbbe2520125a216cdfc9dae3debcba4850c690d45b',
        '5ed430d78c296c3543114306dd8622d7c622e27c970a1de31cb377b01af7307e'
      ],
      [
        'f16f804244e46e2a09232d4aff3b59976b98fac14328a2d1a32496b49998f247',
        'cedabd9b82203f7e13d206fcdf4e33d92a6c53c26e5cce26d6579962c4e31df6'
      ],
      [
        'caf754272dc84563b0352b7a14311af55d245315ace27c65369e15f7151d41d1',
        'cb474660ef35f5f2a41b643fa5e460575f4fa9b7962232a5c32f908318a04476'
      ],
      [
        '2600ca4b282cb986f85d0f1709979d8b44a09c07cb86d7c124497bc86f082120',
        '4119b88753c15bd6a693b03fcddbb45d5ac6be74ab5f0ef44b0be9475a7e4b40'
      ],
      [
        '7635ca72d7e8432c338ec53cd12220bc01c48685e24f7dc8c602a7746998e435',
        '91b649609489d613d1d5e590f78e6d74ecfc061d57048bad9e76f302c5b9c61'
      ],
      [
        '754e3239f325570cdbbf4a87deee8a66b7f2b33479d468fbc1a50743bf56cc18',
        '673fb86e5bda30fb3cd0ed304ea49a023ee33d0197a695d0c5d98093c536683'
      ],
      [
        'e3e6bd1071a1e96aff57859c82d570f0330800661d1c952f9fe2694691d9b9e8',
        '59c9e0bba394e76f40c0aa58379a3cb6a5a2283993e90c4167002af4920e37f5'
      ],
      [
        '186b483d056a033826ae73d88f732985c4ccb1f32ba35f4b4cc47fdcf04aa6eb',
        '3b952d32c67cf77e2e17446e204180ab21fb8090895138b4a4a797f86e80888b'
      ],
      [
        'df9d70a6b9876ce544c98561f4be4f725442e6d2b737d9c91a8321724ce0963f',
        '55eb2dafd84d6ccd5f862b785dc39d4ab157222720ef9da217b8c45cf2ba2417'
      ],
      [
        '5edd5cc23c51e87a497ca815d5dce0f8ab52554f849ed8995de64c5f34ce7143',
        'efae9c8dbc14130661e8cec030c89ad0c13c66c0d17a2905cdc706ab7399a868'
      ],
      [
        '290798c2b6476830da12fe02287e9e777aa3fba1c355b17a722d362f84614fba',
        'e38da76dcd440621988d00bcf79af25d5b29c094db2a23146d003afd41943e7a'
      ],
      [
        'af3c423a95d9f5b3054754efa150ac39cd29552fe360257362dfdecef4053b45',
        'f98a3fd831eb2b749a93b0e6f35cfb40c8cd5aa667a15581bc2feded498fd9c6'
      ],
      [
        '766dbb24d134e745cccaa28c99bf274906bb66b26dcf98df8d2fed50d884249a',
        '744b1152eacbe5e38dcc887980da38b897584a65fa06cedd2c924f97cbac5996'
      ],
      [
        '59dbf46f8c94759ba21277c33784f41645f7b44f6c596a58ce92e666191abe3e',
        'c534ad44175fbc300f4ea6ce648309a042ce739a7919798cd85e216c4a307f6e'
      ],
      [
        'f13ada95103c4537305e691e74e9a4a8dd647e711a95e73cb62dc6018cfd87b8',
        'e13817b44ee14de663bf4bc808341f326949e21a6a75c2570778419bdaf5733d'
      ],
      [
        '7754b4fa0e8aced06d4167a2c59cca4cda1869c06ebadfb6488550015a88522c',
        '30e93e864e669d82224b967c3020b8fa8d1e4e350b6cbcc537a48b57841163a2'
      ],
      [
        '948dcadf5990e048aa3874d46abef9d701858f95de8041d2a6828c99e2262519',
        'e491a42537f6e597d5d28a3224b1bc25df9154efbd2ef1d2cbba2cae5347d57e'
      ],
      [
        '7962414450c76c1689c7b48f8202ec37fb224cf5ac0bfa1570328a8a3d7c77ab',
        '100b610ec4ffb4760d5c1fc133ef6f6b12507a051f04ac5760afa5b29db83437'
      ],
      [
        '3514087834964b54b15b160644d915485a16977225b8847bb0dd085137ec47ca',
        'ef0afbb2056205448e1652c48e8127fc6039e77c15c2378b7e7d15a0de293311'
      ],
      [
        'd3cc30ad6b483e4bc79ce2c9dd8bc54993e947eb8df787b442943d3f7b527eaf',
        '8b378a22d827278d89c5e9be8f9508ae3c2ad46290358630afb34db04eede0a4'
      ],
      [
        '1624d84780732860ce1c78fcbfefe08b2b29823db913f6493975ba0ff4847610',
        '68651cf9b6da903e0914448c6cd9d4ca896878f5282be4c8cc06e2a404078575'
      ],
      [
        '733ce80da955a8a26902c95633e62a985192474b5af207da6df7b4fd5fc61cd4',
        'f5435a2bd2badf7d485a4d8b8db9fcce3e1ef8e0201e4578c54673bc1dc5ea1d'
      ],
      [
        '15d9441254945064cf1a1c33bbd3b49f8966c5092171e699ef258dfab81c045c',
        'd56eb30b69463e7234f5137b73b84177434800bacebfc685fc37bbe9efe4070d'
      ],
      [
        'a1d0fcf2ec9de675b612136e5ce70d271c21417c9d2b8aaaac138599d0717940',
        'edd77f50bcb5a3cab2e90737309667f2641462a54070f3d519212d39c197a629'
      ],
      [
        'e22fbe15c0af8ccc5780c0735f84dbe9a790badee8245c06c7ca37331cb36980',
        'a855babad5cd60c88b430a69f53a1a7a38289154964799be43d06d77d31da06'
      ],
      [
        '311091dd9860e8e20ee13473c1155f5f69635e394704eaa74009452246cfa9b3',
        '66db656f87d1f04fffd1f04788c06830871ec5a64feee685bd80f0b1286d8374'
      ],
      [
        '34c1fd04d301be89b31c0442d3e6ac24883928b45a9340781867d4232ec2dbdf',
        '9414685e97b1b5954bd46f730174136d57f1ceeb487443dc5321857ba73abee'
      ],
      [
        'f219ea5d6b54701c1c14de5b557eb42a8d13f3abbcd08affcc2a5e6b049b8d63',
        '4cb95957e83d40b0f73af4544cccf6b1f4b08d3c07b27fb8d8c2962a400766d1'
      ],
      [
        'd7b8740f74a8fbaab1f683db8f45de26543a5490bca627087236912469a0b448',
        'fa77968128d9c92ee1010f337ad4717eff15db5ed3c049b3411e0315eaa4593b'
      ],
      [
        '32d31c222f8f6f0ef86f7c98d3a3335ead5bcd32abdd94289fe4d3091aa824bf',
        '5f3032f5892156e39ccd3d7915b9e1da2e6dac9e6f26e961118d14b8462e1661'
      ],
      [
        '7461f371914ab32671045a155d9831ea8793d77cd59592c4340f86cbc18347b5',
        '8ec0ba238b96bec0cbdddcae0aa442542eee1ff50c986ea6b39847b3cc092ff6'
      ],
      [
        'ee079adb1df1860074356a25aa38206a6d716b2c3e67453d287698bad7b2b2d6',
        '8dc2412aafe3be5c4c5f37e0ecc5f9f6a446989af04c4e25ebaac479ec1c8c1e'
      ],
      [
        '16ec93e447ec83f0467b18302ee620f7e65de331874c9dc72bfd8616ba9da6b5',
        '5e4631150e62fb40d0e8c2a7ca5804a39d58186a50e497139626778e25b0674d'
      ],
      [
        'eaa5f980c245f6f038978290afa70b6bd8855897f98b6aa485b96065d537bd99',
        'f65f5d3e292c2e0819a528391c994624d784869d7e6ea67fb18041024edc07dc'
      ],
      [
        '78c9407544ac132692ee1910a02439958ae04877151342ea96c4b6b35a49f51',
        'f3e0319169eb9b85d5404795539a5e68fa1fbd583c064d2462b675f194a3ddb4'
      ],
      [
        '494f4be219a1a77016dcd838431aea0001cdc8ae7a6fc688726578d9702857a5',
        '42242a969283a5f339ba7f075e36ba2af925ce30d767ed6e55f4b031880d562c'
      ],
      [
        'a598a8030da6d86c6bc7f2f5144ea549d28211ea58faa70ebf4c1e665c1fe9b5',
        '204b5d6f84822c307e4b4a7140737aec23fc63b65b35f86a10026dbd2d864e6b'
      ],
      [
        'c41916365abb2b5d09192f5f2dbeafec208f020f12570a184dbadc3e58595997',
        '4f14351d0087efa49d245b328984989d5caf9450f34bfc0ed16e96b58fa9913'
      ],
      [
        '841d6063a586fa475a724604da03bc5b92a2e0d2e0a36acfe4c73a5514742881',
        '73867f59c0659e81904f9a1c7543698e62562d6744c169ce7a36de01a8d6154'
      ],
      [
        '5e95bb399a6971d376026947f89bde2f282b33810928be4ded112ac4d70e20d5',
        '39f23f366809085beebfc71181313775a99c9aed7d8ba38b161384c746012865'
      ],
      [
        '36e4641a53948fd476c39f8a99fd974e5ec07564b5315d8bf99471bca0ef2f66',
        'd2424b1b1abe4eb8164227b085c9aa9456ea13493fd563e06fd51cf5694c78fc'
      ],
      [
        '336581ea7bfbbb290c191a2f507a41cf5643842170e914faeab27c2c579f726',
        'ead12168595fe1be99252129b6e56b3391f7ab1410cd1e0ef3dcdcabd2fda224'
      ],
      [
        '8ab89816dadfd6b6a1f2634fcf00ec8403781025ed6890c4849742706bd43ede',
        '6fdcef09f2f6d0a044e654aef624136f503d459c3e89845858a47a9129cdd24e'
      ],
      [
        '1e33f1a746c9c5778133344d9299fcaa20b0938e8acff2544bb40284b8c5fb94',
        '60660257dd11b3aa9c8ed618d24edff2306d320f1d03010e33a7d2057f3b3b6'
      ],
      [
        '85b7c1dcb3cec1b7ee7f30ded79dd20a0ed1f4cc18cbcfcfa410361fd8f08f31',
        '3d98a9cdd026dd43f39048f25a8847f4fcafad1895d7a633c6fed3c35e999511'
      ],
      [
        '29df9fbd8d9e46509275f4b125d6d45d7fbe9a3b878a7af872a2800661ac5f51',
        'b4c4fe99c775a606e2d8862179139ffda61dc861c019e55cd2876eb2a27d84b'
      ],
      [
        'a0b1cae06b0a847a3fea6e671aaf8adfdfe58ca2f768105c8082b2e449fce252',
        'ae434102edde0958ec4b19d917a6a28e6b72da1834aff0e650f049503a296cf2'
      ],
      [
        '4e8ceafb9b3e9a136dc7ff67e840295b499dfb3b2133e4ba113f2e4c0e121e5',
        'cf2174118c8b6d7a4b48f6d534ce5c79422c086a63460502b827ce62a326683c'
      ],
      [
        'd24a44e047e19b6f5afb81c7ca2f69080a5076689a010919f42725c2b789a33b',
        '6fb8d5591b466f8fc63db50f1c0f1c69013f996887b8244d2cdec417afea8fa3'
      ],
      [
        'ea01606a7a6c9cdd249fdfcfacb99584001edd28abbab77b5104e98e8e3b35d4',
        '322af4908c7312b0cfbfe369f7a7b3cdb7d4494bc2823700cfd652188a3ea98d'
      ],
      [
        'af8addbf2b661c8a6c6328655eb96651252007d8c5ea31be4ad196de8ce2131f',
        '6749e67c029b85f52a034eafd096836b2520818680e26ac8f3dfbcdb71749700'
      ],
      [
        'e3ae1974566ca06cc516d47e0fb165a674a3dabcfca15e722f0e3450f45889',
        '2aeabe7e4531510116217f07bf4d07300de97e4874f81f533420a72eeb0bd6a4'
      ],
      [
        '591ee355313d99721cf6993ffed1e3e301993ff3ed258802075ea8ced397e246',
        'b0ea558a113c30bea60fc4775460c7901ff0b053d25ca2bdeee98f1a4be5d196'
      ],
      [
        '11396d55fda54c49f19aa97318d8da61fa8584e47b084945077cf03255b52984',
        '998c74a8cd45ac01289d5833a7beb4744ff536b01b257be4c5767bea93ea57a4'
      ],
      [
        '3c5d2a1ba39c5a1790000738c9e0c40b8dcdfd5468754b6405540157e017aa7a',
        'b2284279995a34e2f9d4de7396fc18b80f9b8b9fdd270f6661f79ca4c81bd257'
      ],
      [
        'cc8704b8a60a0defa3a99a7299f2e9c3fbc395afb04ac078425ef8a1793cc030',
        'bdd46039feed17881d1e0862db347f8cf395b74fc4bcdc4e940b74e3ac1f1b13'
      ],
      [
        'c533e4f7ea8555aacd9777ac5cad29b97dd4defccc53ee7ea204119b2889b197',
        '6f0a256bc5efdf429a2fb6242f1a43a2d9b925bb4a4b3a26bb8e0f45eb596096'
      ],
      [
        'c14f8f2ccb27d6f109f6d08d03cc96a69ba8c34eec07bbcf566d48e33da6593',
        'c359d6923bb398f7fd4473e16fe1c28475b740dd098075e6c0e8649113dc3a38'
      ],
      [
        'a6cbc3046bc6a450bac24789fa17115a4c9739ed75f8f21ce441f72e0b90e6ef',
        '21ae7f4680e889bb130619e2c0f95a360ceb573c70603139862afd617fa9b9f'
      ],
      [
        '347d6d9a02c48927ebfb86c1359b1caf130a3c0267d11ce6344b39f99d43cc38',
        '60ea7f61a353524d1c987f6ecec92f086d565ab687870cb12689ff1e31c74448'
      ],
      [
        'da6545d2181db8d983f7dcb375ef5866d47c67b1bf31c8cf855ef7437b72656a',
        '49b96715ab6878a79e78f07ce5680c5d6673051b4935bd897fea824b77dc208a'
      ],
      [
        'c40747cc9d012cb1a13b8148309c6de7ec25d6945d657146b9d5994b8feb1111',
        '5ca560753be2a12fc6de6caf2cb489565db936156b9514e1bb5e83037e0fa2d4'
      ],
      [
        '4e42c8ec82c99798ccf3a610be870e78338c7f713348bd34c8203ef4037f3502',
        '7571d74ee5e0fb92a7a8b33a07783341a5492144cc54bcc40a94473693606437'
      ],
      [
        '3775ab7089bc6af823aba2e1af70b236d251cadb0c86743287522a1b3b0dedea',
        'be52d107bcfa09d8bcb9736a828cfa7fac8db17bf7a76a2c42ad961409018cf7'
      ],
      [
        'cee31cbf7e34ec379d94fb814d3d775ad954595d1314ba8846959e3e82f74e26',
        '8fd64a14c06b589c26b947ae2bcf6bfa0149ef0be14ed4d80f448a01c43b1c6d'
      ],
      [
        'b4f9eaea09b6917619f6ea6a4eb5464efddb58fd45b1ebefcdc1a01d08b47986',
        '39e5c9925b5a54b07433a4f18c61726f8bb131c012ca542eb24a8ac07200682a'
      ],
      [
        'd4263dfc3d2df923a0179a48966d30ce84e2515afc3dccc1b77907792ebcc60e',
        '62dfaf07a0f78feb30e30d6295853ce189e127760ad6cf7fae164e122a208d54'
      ],
      [
        '48457524820fa65a4f8d35eb6930857c0032acc0a4a2de422233eeda897612c4',
        '25a748ab367979d98733c38a1fa1c2e7dc6cc07db2d60a9ae7a76aaa49bd0f77'
      ],
      [
        'dfeeef1881101f2cb11644f3a2afdfc2045e19919152923f367a1767c11cceda',
        'ecfb7056cf1de042f9420bab396793c0c390bde74b4bbdff16a83ae09a9a7517'
      ],
      [
        '6d7ef6b17543f8373c573f44e1f389835d89bcbc6062ced36c82df83b8fae859',
        'cd450ec335438986dfefa10c57fea9bcc521a0959b2d80bbf74b190dca712d10'
      ],
      [
        'e75605d59102a5a2684500d3b991f2e3f3c88b93225547035af25af66e04541f',
        'f5c54754a8f71ee540b9b48728473e314f729ac5308b06938360990e2bfad125'
      ],
      [
        'eb98660f4c4dfaa06a2be453d5020bc99a0c2e60abe388457dd43fefb1ed620c',
        '6cb9a8876d9cb8520609af3add26cd20a0a7cd8a9411131ce85f44100099223e'
      ],
      [
        '13e87b027d8514d35939f2e6892b19922154596941888336dc3563e3b8dba942',
        'fef5a3c68059a6dec5d624114bf1e91aac2b9da568d6abeb2570d55646b8adf1'
      ],
      [
        'ee163026e9fd6fe017c38f06a5be6fc125424b371ce2708e7bf4491691e5764a',
        '1acb250f255dd61c43d94ccc670d0f58f49ae3fa15b96623e5430da0ad6c62b2'
      ],
      [
        'b268f5ef9ad51e4d78de3a750c2dc89b1e626d43505867999932e5db33af3d80',
        '5f310d4b3c99b9ebb19f77d41c1dee018cf0d34fd4191614003e945a1216e423'
      ],
      [
        'ff07f3118a9df035e9fad85eb6c7bfe42b02f01ca99ceea3bf7ffdba93c4750d',
        '438136d603e858a3a5c440c38eccbaddc1d2942114e2eddd4740d098ced1f0d8'
      ],
      [
        '8d8b9855c7c052a34146fd20ffb658bea4b9f69e0d825ebec16e8c3ce2b526a1',
        'cdb559eedc2d79f926baf44fb84ea4d44bcf50fee51d7ceb30e2e7f463036758'
      ],
      [
        '52db0b5384dfbf05bfa9d472d7ae26dfe4b851ceca91b1eba54263180da32b63',
        'c3b997d050ee5d423ebaf66a6db9f57b3180c902875679de924b69d84a7b375'
      ],
      [
        'e62f9490d3d51da6395efd24e80919cc7d0f29c3f3fa48c6fff543becbd43352',
        '6d89ad7ba4876b0b22c2ca280c682862f342c8591f1daf5170e07bfd9ccafa7d'
      ],
      [
        '7f30ea2476b399b4957509c88f77d0191afa2ff5cb7b14fd6d8e7d65aaab1193',
        'ca5ef7d4b231c94c3b15389a5f6311e9daff7bb67b103e9880ef4bff637acaec'
      ],
      [
        '5098ff1e1d9f14fb46a210fada6c903fef0fb7b4a1dd1d9ac60a0361800b7a00',
        '9731141d81fc8f8084d37c6e7542006b3ee1b40d60dfe5362a5b132fd17ddc0'
      ],
      [
        '32b78c7de9ee512a72895be6b9cbefa6e2f3c4ccce445c96b9f2c81e2778ad58',
        'ee1849f513df71e32efc3896ee28260c73bb80547ae2275ba497237794c8753c'
      ],
      [
        'e2cb74fddc8e9fbcd076eef2a7c72b0ce37d50f08269dfc074b581550547a4f7',
        'd3aa2ed71c9dd2247a62df062736eb0baddea9e36122d2be8641abcb005cc4a4'
      ],
      [
        '8438447566d4d7bedadc299496ab357426009a35f235cb141be0d99cd10ae3a8',
        'c4e1020916980a4da5d01ac5e6ad330734ef0d7906631c4f2390426b2edd791f'
      ],
      [
        '4162d488b89402039b584c6fc6c308870587d9c46f660b878ab65c82c711d67e',
        '67163e903236289f776f22c25fb8a3afc1732f2b84b4e95dbda47ae5a0852649'
      ],
      [
        '3fad3fa84caf0f34f0f89bfd2dcf54fc175d767aec3e50684f3ba4a4bf5f683d',
        'cd1bc7cb6cc407bb2f0ca647c718a730cf71872e7d0d2a53fa20efcdfe61826'
      ],
      [
        '674f2600a3007a00568c1a7ce05d0816c1fb84bf1370798f1c69532faeb1a86b',
        '299d21f9413f33b3edf43b257004580b70db57da0b182259e09eecc69e0d38a5'
      ],
      [
        'd32f4da54ade74abb81b815ad1fb3b263d82d6c692714bcff87d29bd5ee9f08f',
        'f9429e738b8e53b968e99016c059707782e14f4535359d582fc416910b3eea87'
      ],
      [
        '30e4e670435385556e593657135845d36fbb6931f72b08cb1ed954f1e3ce3ff6',
        '462f9bce619898638499350113bbc9b10a878d35da70740dc695a559eb88db7b'
      ],
      [
        'be2062003c51cc3004682904330e4dee7f3dcd10b01e580bf1971b04d4cad297',
        '62188bc49d61e5428573d48a74e1c655b1c61090905682a0d5558ed72dccb9bc'
      ],
      [
        '93144423ace3451ed29e0fb9ac2af211cb6e84a601df5993c419859fff5df04a',
        '7c10dfb164c3425f5c71a3f9d7992038f1065224f72bb9d1d902a6d13037b47c'
      ],
      [
        'b015f8044f5fcbdcf21ca26d6c34fb8197829205c7b7d2a7cb66418c157b112c',
        'ab8c1e086d04e813744a655b2df8d5f83b3cdc6faa3088c1d3aea1454e3a1d5f'
      ],
      [
        'd5e9e1da649d97d89e4868117a465a3a4f8a18de57a140d36b3f2af341a21b52',
        '4cb04437f391ed73111a13cc1d4dd0db1693465c2240480d8955e8592f27447a'
      ],
      [
        'd3ae41047dd7ca065dbf8ed77b992439983005cd72e16d6f996a5316d36966bb',
        'bd1aeb21ad22ebb22a10f0303417c6d964f8cdd7df0aca614b10dc14d125ac46'
      ],
      [
        '463e2763d885f958fc66cdd22800f0a487197d0a82e377b49f80af87c897b065',
        'bfefacdb0e5d0fd7df3a311a94de062b26b80c61fbc97508b79992671ef7ca7f'
      ],
      [
        '7985fdfd127c0567c6f53ec1bb63ec3158e597c40bfe747c83cddfc910641917',
        '603c12daf3d9862ef2b25fe1de289aed24ed291e0ec6708703a5bd567f32ed03'
      ],
      [
        '74a1ad6b5f76e39db2dd249410eac7f99e74c59cb83d2d0ed5ff1543da7703e9',
        'cc6157ef18c9c63cd6193d83631bbea0093e0968942e8c33d5737fd790e0db08'
      ],
      [
        '30682a50703375f602d416664ba19b7fc9bab42c72747463a71d0896b22f6da3',
        '553e04f6b018b4fa6c8f39e7f311d3176290d0e0f19ca73f17714d9977a22ff8'
      ],
      [
        '9e2158f0d7c0d5f26c3791efefa79597654e7a2b2464f52b1ee6c1347769ef57',
        '712fcdd1b9053f09003a3481fa7762e9ffd7c8ef35a38509e2fbf2629008373'
      ],
      [
        '176e26989a43c9cfeba4029c202538c28172e566e3c4fce7322857f3be327d66',
        'ed8cc9d04b29eb877d270b4878dc43c19aefd31f4eee09ee7b47834c1fa4b1c3'
      ],
      [
        '75d46efea3771e6e68abb89a13ad747ecf1892393dfc4f1b7004788c50374da8',
        '9852390a99507679fd0b86fd2b39a868d7efc22151346e1a3ca4726586a6bed8'
      ],
      [
        '809a20c67d64900ffb698c4c825f6d5f2310fb0451c869345b7319f645605721',
        '9e994980d9917e22b76b061927fa04143d096ccc54963e6a5ebfa5f3f8e286c1'
      ],
      [
        '1b38903a43f7f114ed4500b4eac7083fdefece1cf29c63528d563446f972c180',
        '4036edc931a60ae889353f77fd53de4a2708b26b6f5da72ad3394119daf408f9'
      ]
    ]
  }
};


/***/ }),

/***/ "QTa/":
/*!***********************************************************!*\
  !*** ./node_modules/elliptic/lib/elliptic/curve/index.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var curve = exports;

curve.base = __webpack_require__(/*! ./base */ "6lN/");
curve.short = __webpack_require__(/*! ./short */ "MwBp");
curve.mont = __webpack_require__(/*! ./mont */ "Z2+3");
curve.edwards = __webpack_require__(/*! ./edwards */ "Pa+m");


/***/ }),

/***/ "RKMU":
/*!***************************************************************!*\
  !*** ./node_modules/elliptic/lib/elliptic/eddsa/signature.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var BN = __webpack_require__(/*! bn.js */ "OZ/i");
var elliptic = __webpack_require__(/*! ../../elliptic */ "MzeL");
var utils = elliptic.utils;
var assert = utils.assert;
var cachedProperty = utils.cachedProperty;
var parseBytes = utils.parseBytes;

/**
* @param {EDDSA} eddsa - eddsa instance
* @param {Array<Bytes>|Object} sig -
* @param {Array<Bytes>|Point} [sig.R] - R point as Point or bytes
* @param {Array<Bytes>|bn} [sig.S] - S scalar as bn or bytes
* @param {Array<Bytes>} [sig.Rencoded] - R point encoded
* @param {Array<Bytes>} [sig.Sencoded] - S scalar encoded
*/
function Signature(eddsa, sig) {
  this.eddsa = eddsa;

  if (typeof sig !== 'object')
    sig = parseBytes(sig);

  if (Array.isArray(sig)) {
    sig = {
      R: sig.slice(0, eddsa.encodingLength),
      S: sig.slice(eddsa.encodingLength)
    };
  }

  assert(sig.R && sig.S, 'Signature without R or S');

  if (eddsa.isPoint(sig.R))
    this._R = sig.R;
  if (sig.S instanceof BN)
    this._S = sig.S;

  this._Rencoded = Array.isArray(sig.R) ? sig.R : sig.Rencoded;
  this._Sencoded = Array.isArray(sig.S) ? sig.S : sig.Sencoded;
}

cachedProperty(Signature, 'S', function S() {
  return this.eddsa.decodeInt(this.Sencoded());
});

cachedProperty(Signature, 'R', function R() {
  return this.eddsa.decodePoint(this.Rencoded());
});

cachedProperty(Signature, 'Rencoded', function Rencoded() {
  return this.eddsa.encodePoint(this.R());
});

cachedProperty(Signature, 'Sencoded', function Sencoded() {
  return this.eddsa.encodeInt(this.S());
});

Signature.prototype.toBytes = function toBytes() {
  return this.Rencoded().concat(this.Sencoded());
};

Signature.prototype.toHex = function toHex() {
  return utils.encode(this.toBytes(), 'hex').toUpperCase();
};

module.exports = Signature;


/***/ }),

/***/ "Z2+3":
/*!**********************************************************!*\
  !*** ./node_modules/elliptic/lib/elliptic/curve/mont.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var curve = __webpack_require__(/*! ../curve */ "QTa/");
var BN = __webpack_require__(/*! bn.js */ "OZ/i");
var inherits = __webpack_require__(/*! inherits */ "P7XM");
var Base = curve.base;

var elliptic = __webpack_require__(/*! ../../elliptic */ "MzeL");
var utils = elliptic.utils;

function MontCurve(conf) {
  Base.call(this, 'mont', conf);

  this.a = new BN(conf.a, 16).toRed(this.red);
  this.b = new BN(conf.b, 16).toRed(this.red);
  this.i4 = new BN(4).toRed(this.red).redInvm();
  this.two = new BN(2).toRed(this.red);
  this.a24 = this.i4.redMul(this.a.redAdd(this.two));
}
inherits(MontCurve, Base);
module.exports = MontCurve;

MontCurve.prototype.validate = function validate(point) {
  var x = point.normalize().x;
  var x2 = x.redSqr();
  var rhs = x2.redMul(x).redAdd(x2.redMul(this.a)).redAdd(x);
  var y = rhs.redSqrt();

  return y.redSqr().cmp(rhs) === 0;
};

function Point(curve, x, z) {
  Base.BasePoint.call(this, curve, 'projective');
  if (x === null && z === null) {
    this.x = this.curve.one;
    this.z = this.curve.zero;
  } else {
    this.x = new BN(x, 16);
    this.z = new BN(z, 16);
    if (!this.x.red)
      this.x = this.x.toRed(this.curve.red);
    if (!this.z.red)
      this.z = this.z.toRed(this.curve.red);
  }
}
inherits(Point, Base.BasePoint);

MontCurve.prototype.decodePoint = function decodePoint(bytes, enc) {
  return this.point(utils.toArray(bytes, enc), 1);
};

MontCurve.prototype.point = function point(x, z) {
  return new Point(this, x, z);
};

MontCurve.prototype.pointFromJSON = function pointFromJSON(obj) {
  return Point.fromJSON(this, obj);
};

Point.prototype.precompute = function precompute() {
  // No-op
};

Point.prototype._encode = function _encode() {
  return this.getX().toArray('be', this.curve.p.byteLength());
};

Point.fromJSON = function fromJSON(curve, obj) {
  return new Point(curve, obj[0], obj[1] || curve.one);
};

Point.prototype.inspect = function inspect() {
  if (this.isInfinity())
    return '<EC Point Infinity>';
  return '<EC Point x: ' + this.x.fromRed().toString(16, 2) +
      ' z: ' + this.z.fromRed().toString(16, 2) + '>';
};

Point.prototype.isInfinity = function isInfinity() {
  // XXX This code assumes that zero is always zero in red
  return this.z.cmpn(0) === 0;
};

Point.prototype.dbl = function dbl() {
  // http://hyperelliptic.org/EFD/g1p/auto-montgom-xz.html#doubling-dbl-1987-m-3
  // 2M + 2S + 4A

  // A = X1 + Z1
  var a = this.x.redAdd(this.z);
  // AA = A^2
  var aa = a.redSqr();
  // B = X1 - Z1
  var b = this.x.redSub(this.z);
  // BB = B^2
  var bb = b.redSqr();
  // C = AA - BB
  var c = aa.redSub(bb);
  // X3 = AA * BB
  var nx = aa.redMul(bb);
  // Z3 = C * (BB + A24 * C)
  var nz = c.redMul(bb.redAdd(this.curve.a24.redMul(c)));
  return this.curve.point(nx, nz);
};

Point.prototype.add = function add() {
  throw new Error('Not supported on Montgomery curve');
};

Point.prototype.diffAdd = function diffAdd(p, diff) {
  // http://hyperelliptic.org/EFD/g1p/auto-montgom-xz.html#diffadd-dadd-1987-m-3
  // 4M + 2S + 6A

  // A = X2 + Z2
  var a = this.x.redAdd(this.z);
  // B = X2 - Z2
  var b = this.x.redSub(this.z);
  // C = X3 + Z3
  var c = p.x.redAdd(p.z);
  // D = X3 - Z3
  var d = p.x.redSub(p.z);
  // DA = D * A
  var da = d.redMul(a);
  // CB = C * B
  var cb = c.redMul(b);
  // X5 = Z1 * (DA + CB)^2
  var nx = diff.z.redMul(da.redAdd(cb).redSqr());
  // Z5 = X1 * (DA - CB)^2
  var nz = diff.x.redMul(da.redISub(cb).redSqr());
  return this.curve.point(nx, nz);
};

Point.prototype.mul = function mul(k) {
  var t = k.clone();
  var a = this; // (N / 2) * Q + Q
  var b = this.curve.point(null, null); // (N / 2) * Q
  var c = this; // Q

  for (var bits = []; t.cmpn(0) !== 0; t.iushrn(1))
    bits.push(t.andln(1));

  for (var i = bits.length - 1; i >= 0; i--) {
    if (bits[i] === 0) {
      // N * Q + Q = ((N / 2) * Q + Q)) + (N / 2) * Q
      a = a.diffAdd(b, c);
      // N * Q = 2 * ((N / 2) * Q + Q))
      b = b.dbl();
    } else {
      // N * Q = ((N / 2) * Q + Q) + ((N / 2) * Q)
      b = a.diffAdd(b, c);
      // N * Q + Q = 2 * ((N / 2) * Q + Q)
      a = a.dbl();
    }
  }
  return b;
};

Point.prototype.mulAdd = function mulAdd() {
  throw new Error('Not supported on Montgomery curve');
};

Point.prototype.jumlAdd = function jumlAdd() {
  throw new Error('Not supported on Montgomery curve');
};

Point.prototype.eq = function eq(other) {
  return this.getX().cmp(other.getX()) === 0;
};

Point.prototype.normalize = function normalize() {
  this.x = this.x.redMul(this.z.redInvm());
  this.z = this.curve.one;
  return this;
};

Point.prototype.getX = function getX() {
  // Normalize coordinates
  this.normalize();

  return this.x.fromRed();
};


/***/ }),

/***/ "lF1L":
/*!***********************************************************!*\
  !*** ./node_modules/elliptic/lib/elliptic/eddsa/index.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var hash = __webpack_require__(/*! hash.js */ "fZJM");
var elliptic = __webpack_require__(/*! ../../elliptic */ "MzeL");
var utils = elliptic.utils;
var assert = utils.assert;
var parseBytes = utils.parseBytes;
var KeyPair = __webpack_require__(/*! ./key */ "OA+I");
var Signature = __webpack_require__(/*! ./signature */ "RKMU");

function EDDSA(curve) {
  assert(curve === 'ed25519', 'only tested with ed25519 so far');

  if (!(this instanceof EDDSA))
    return new EDDSA(curve);

  var curve = elliptic.curves[curve].curve;
  this.curve = curve;
  this.g = curve.g;
  this.g.precompute(curve.n.bitLength() + 1);

  this.pointClass = curve.point().constructor;
  this.encodingLength = Math.ceil(curve.n.bitLength() / 8);
  this.hash = hash.sha512;
}

module.exports = EDDSA;

/**
* @param {Array|String} message - message bytes
* @param {Array|String|KeyPair} secret - secret bytes or a keypair
* @returns {Signature} - signature
*/
EDDSA.prototype.sign = function sign(message, secret) {
  message = parseBytes(message);
  var key = this.keyFromSecret(secret);
  var r = this.hashInt(key.messagePrefix(), message);
  var R = this.g.mul(r);
  var Rencoded = this.encodePoint(R);
  var s_ = this.hashInt(Rencoded, key.pubBytes(), message)
               .mul(key.priv());
  var S = r.add(s_).umod(this.curve.n);
  return this.makeSignature({ R: R, S: S, Rencoded: Rencoded });
};

/**
* @param {Array} message - message bytes
* @param {Array|String|Signature} sig - sig bytes
* @param {Array|String|Point|KeyPair} pub - public key
* @returns {Boolean} - true if public key matches sig of message
*/
EDDSA.prototype.verify = function verify(message, sig, pub) {
  message = parseBytes(message);
  sig = this.makeSignature(sig);
  var key = this.keyFromPublic(pub);
  var h = this.hashInt(sig.Rencoded(), key.pubBytes(), message);
  var SG = this.g.mul(sig.S());
  var RplusAh = sig.R().add(key.pub().mul(h));
  return RplusAh.eq(SG);
};

EDDSA.prototype.hashInt = function hashInt() {
  var hash = this.hash();
  for (var i = 0; i < arguments.length; i++)
    hash.update(arguments[i]);
  return utils.intFromLE(hash.digest()).umod(this.curve.n);
};

EDDSA.prototype.keyFromPublic = function keyFromPublic(pub) {
  return KeyPair.fromPublic(this, pub);
};

EDDSA.prototype.keyFromSecret = function keyFromSecret(secret) {
  return KeyPair.fromSecret(this, secret);
};

EDDSA.prototype.makeSignature = function makeSignature(sig) {
  if (sig instanceof Signature)
    return sig;
  return new Signature(this, sig);
};

/**
* * https://tools.ietf.org/html/draft-josefsson-eddsa-ed25519-03#section-5.2
*
* EDDSA defines methods for encoding and decoding points and integers. These are
* helper convenience methods, that pass along to utility functions implied
* parameters.
*
*/
EDDSA.prototype.encodePoint = function encodePoint(point) {
  var enc = point.getY().toArray('le', this.encodingLength);
  enc[this.encodingLength - 1] |= point.getX().isOdd() ? 0x80 : 0;
  return enc;
};

EDDSA.prototype.decodePoint = function decodePoint(bytes) {
  bytes = utils.parseBytes(bytes);

  var lastIx = bytes.length - 1;
  var normed = bytes.slice(0, lastIx).concat(bytes[lastIx] & ~0x80);
  var xIsOdd = (bytes[lastIx] & 0x80) !== 0;

  var y = utils.intFromLE(normed);
  return this.curve.pointFromY(y, xIsOdd);
};

EDDSA.prototype.encodeInt = function encodeInt(num) {
  return num.toArray('le', this.encodingLength);
};

EDDSA.prototype.decodeInt = function decodeInt(bytes) {
  return utils.intFromLE(bytes);
};

EDDSA.prototype.isPoint = function isPoint(val) {
  return val instanceof this.pointClass;
};


/***/ }),

/***/ "tz+M":
/*!************************************************************!*\
  !*** ./node_modules/elliptic/lib/elliptic/ec/signature.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var BN = __webpack_require__(/*! bn.js */ "OZ/i");

var elliptic = __webpack_require__(/*! ../../elliptic */ "MzeL");
var utils = elliptic.utils;
var assert = utils.assert;

function Signature(options, enc) {
  if (options instanceof Signature)
    return options;

  if (this._importDER(options, enc))
    return;

  assert(options.r && options.s, 'Signature without r or s');
  this.r = new BN(options.r, 16);
  this.s = new BN(options.s, 16);
  if (options.recoveryParam === undefined)
    this.recoveryParam = null;
  else
    this.recoveryParam = options.recoveryParam;
}
module.exports = Signature;

function Position() {
  this.place = 0;
}

function getLength(buf, p) {
  var initial = buf[p.place++];
  if (!(initial & 0x80)) {
    return initial;
  }
  var octetLen = initial & 0xf;
  var val = 0;
  for (var i = 0, off = p.place; i < octetLen; i++, off++) {
    val <<= 8;
    val |= buf[off];
  }
  p.place = off;
  return val;
}

function rmPadding(buf) {
  var i = 0;
  var len = buf.length - 1;
  while (!buf[i] && !(buf[i + 1] & 0x80) && i < len) {
    i++;
  }
  if (i === 0) {
    return buf;
  }
  return buf.slice(i);
}

Signature.prototype._importDER = function _importDER(data, enc) {
  data = utils.toArray(data, enc);
  var p = new Position();
  if (data[p.place++] !== 0x30) {
    return false;
  }
  var len = getLength(data, p);
  if ((len + p.place) !== data.length) {
    return false;
  }
  if (data[p.place++] !== 0x02) {
    return false;
  }
  var rlen = getLength(data, p);
  var r = data.slice(p.place, rlen + p.place);
  p.place += rlen;
  if (data[p.place++] !== 0x02) {
    return false;
  }
  var slen = getLength(data, p);
  if (data.length !== slen + p.place) {
    return false;
  }
  var s = data.slice(p.place, slen + p.place);
  if (r[0] === 0 && (r[1] & 0x80)) {
    r = r.slice(1);
  }
  if (s[0] === 0 && (s[1] & 0x80)) {
    s = s.slice(1);
  }

  this.r = new BN(r);
  this.s = new BN(s);
  this.recoveryParam = null;

  return true;
};

function constructLength(arr, len) {
  if (len < 0x80) {
    arr.push(len);
    return;
  }
  var octets = 1 + (Math.log(len) / Math.LN2 >>> 3);
  arr.push(octets | 0x80);
  while (--octets) {
    arr.push((len >>> (octets << 3)) & 0xff);
  }
  arr.push(len);
}

Signature.prototype.toDER = function toDER(enc) {
  var r = this.r.toArray();
  var s = this.s.toArray();

  // Pad values
  if (r[0] & 0x80)
    r = [ 0 ].concat(r);
  // Pad values
  if (s[0] & 0x80)
    s = [ 0 ].concat(s);

  r = rmPadding(r);
  s = rmPadding(s);

  while (!s[0] && !(s[1] & 0x80)) {
    s = s.slice(1);
  }
  var arr = [ 0x02 ];
  constructLength(arr, r.length);
  arr = arr.concat(r);
  arr.push(0x02);
  constructLength(arr, s.length);
  var backHalf = arr.concat(s);
  var res = [ 0x30 ];
  constructLength(res, backHalf.length);
  res = res.concat(backHalf);
  return utils.encode(res, enc);
};


/***/ }),

/***/ "uagp":
/*!********************************************************!*\
  !*** ./node_modules/elliptic/lib/elliptic/ec/index.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var BN = __webpack_require__(/*! bn.js */ "OZ/i");
var HmacDRBG = __webpack_require__(/*! hmac-drbg */ "aqI/");
var elliptic = __webpack_require__(/*! ../../elliptic */ "MzeL");
var utils = elliptic.utils;
var assert = utils.assert;

var KeyPair = __webpack_require__(/*! ./key */ "uzSA");
var Signature = __webpack_require__(/*! ./signature */ "tz+M");

function EC(options) {
  if (!(this instanceof EC))
    return new EC(options);

  // Shortcut `elliptic.ec(curve-name)`
  if (typeof options === 'string') {
    assert(elliptic.curves.hasOwnProperty(options), 'Unknown curve ' + options);

    options = elliptic.curves[options];
  }

  // Shortcut for `elliptic.ec(elliptic.curves.curveName)`
  if (options instanceof elliptic.curves.PresetCurve)
    options = { curve: options };

  this.curve = options.curve.curve;
  this.n = this.curve.n;
  this.nh = this.n.ushrn(1);
  this.g = this.curve.g;

  // Point on curve
  this.g = options.curve.g;
  this.g.precompute(options.curve.n.bitLength() + 1);

  // Hash for function for DRBG
  this.hash = options.hash || options.curve.hash;
}
module.exports = EC;

EC.prototype.keyPair = function keyPair(options) {
  return new KeyPair(this, options);
};

EC.prototype.keyFromPrivate = function keyFromPrivate(priv, enc) {
  return KeyPair.fromPrivate(this, priv, enc);
};

EC.prototype.keyFromPublic = function keyFromPublic(pub, enc) {
  return KeyPair.fromPublic(this, pub, enc);
};

EC.prototype.genKeyPair = function genKeyPair(options) {
  if (!options)
    options = {};

  // Instantiate Hmac_DRBG
  var drbg = new HmacDRBG({
    hash: this.hash,
    pers: options.pers,
    persEnc: options.persEnc || 'utf8',
    entropy: options.entropy || elliptic.rand(this.hash.hmacStrength),
    entropyEnc: options.entropy && options.entropyEnc || 'utf8',
    nonce: this.n.toArray()
  });

  var bytes = this.n.byteLength();
  var ns2 = this.n.sub(new BN(2));
  do {
    var priv = new BN(drbg.generate(bytes));
    if (priv.cmp(ns2) > 0)
      continue;

    priv.iaddn(1);
    return this.keyFromPrivate(priv);
  } while (true);
};

EC.prototype._truncateToN = function truncateToN(msg, truncOnly) {
  var delta = msg.byteLength() * 8 - this.n.bitLength();
  if (delta > 0)
    msg = msg.ushrn(delta);
  if (!truncOnly && msg.cmp(this.n) >= 0)
    return msg.sub(this.n);
  else
    return msg;
};

EC.prototype.sign = function sign(msg, key, enc, options) {
  if (typeof enc === 'object') {
    options = enc;
    enc = null;
  }
  if (!options)
    options = {};

  key = this.keyFromPrivate(key, enc);
  msg = this._truncateToN(new BN(msg, 16));

  // Zero-extend key to provide enough entropy
  var bytes = this.n.byteLength();
  var bkey = key.getPrivate().toArray('be', bytes);

  // Zero-extend nonce to have the same byte size as N
  var nonce = msg.toArray('be', bytes);

  // Instantiate Hmac_DRBG
  var drbg = new HmacDRBG({
    hash: this.hash,
    entropy: bkey,
    nonce: nonce,
    pers: options.pers,
    persEnc: options.persEnc || 'utf8'
  });

  // Number of bytes to generate
  var ns1 = this.n.sub(new BN(1));

  for (var iter = 0; true; iter++) {
    var k = options.k ?
        options.k(iter) :
        new BN(drbg.generate(this.n.byteLength()));
    k = this._truncateToN(k, true);
    if (k.cmpn(1) <= 0 || k.cmp(ns1) >= 0)
      continue;

    var kp = this.g.mul(k);
    if (kp.isInfinity())
      continue;

    var kpX = kp.getX();
    var r = kpX.umod(this.n);
    if (r.cmpn(0) === 0)
      continue;

    var s = k.invm(this.n).mul(r.mul(key.getPrivate()).iadd(msg));
    s = s.umod(this.n);
    if (s.cmpn(0) === 0)
      continue;

    var recoveryParam = (kp.getY().isOdd() ? 1 : 0) |
                        (kpX.cmp(r) !== 0 ? 2 : 0);

    // Use complement of `s`, if it is > `n / 2`
    if (options.canonical && s.cmp(this.nh) > 0) {
      s = this.n.sub(s);
      recoveryParam ^= 1;
    }

    return new Signature({ r: r, s: s, recoveryParam: recoveryParam });
  }
};

EC.prototype.verify = function verify(msg, signature, key, enc) {
  msg = this._truncateToN(new BN(msg, 16));
  key = this.keyFromPublic(key, enc);
  signature = new Signature(signature, 'hex');

  // Perform primitive values validation
  var r = signature.r;
  var s = signature.s;
  if (r.cmpn(1) < 0 || r.cmp(this.n) >= 0)
    return false;
  if (s.cmpn(1) < 0 || s.cmp(this.n) >= 0)
    return false;

  // Validate signature
  var sinv = s.invm(this.n);
  var u1 = sinv.mul(msg).umod(this.n);
  var u2 = sinv.mul(r).umod(this.n);

  if (!this.curve._maxwellTrick) {
    var p = this.g.mulAdd(u1, key.getPublic(), u2);
    if (p.isInfinity())
      return false;

    return p.getX().umod(this.n).cmp(r) === 0;
  }

  // NOTE: Greg Maxwell's trick, inspired by:
  // https://git.io/vad3K

  var p = this.g.jmulAdd(u1, key.getPublic(), u2);
  if (p.isInfinity())
    return false;

  // Compare `p.x` of Jacobian point with `r`,
  // this will do `p.x == r * p.z^2` instead of multiplying `p.x` by the
  // inverse of `p.z^2`
  return p.eqXToP(r);
};

EC.prototype.recoverPubKey = function(msg, signature, j, enc) {
  assert((3 & j) === j, 'The recovery param is more than two bits');
  signature = new Signature(signature, enc);

  var n = this.n;
  var e = new BN(msg);
  var r = signature.r;
  var s = signature.s;

  // A set LSB signifies that the y-coordinate is odd
  var isYOdd = j & 1;
  var isSecondKey = j >> 1;
  if (r.cmp(this.curve.p.umod(this.curve.n)) >= 0 && isSecondKey)
    throw new Error('Unable to find sencond key candinate');

  // 1.1. Let x = r + jn.
  if (isSecondKey)
    r = this.curve.pointFromX(r.add(this.curve.n), isYOdd);
  else
    r = this.curve.pointFromX(r, isYOdd);

  var rInv = signature.r.invm(n);
  var s1 = n.sub(e).mul(rInv).umod(n);
  var s2 = s.mul(rInv).umod(n);

  // 1.6.1 Compute Q = r^-1 (sR -  eG)
  //               Q = r^-1 (sR + -eG)
  return this.g.mulAdd(s1, r, s2);
};

EC.prototype.getKeyRecoveryParam = function(e, signature, Q, enc) {
  signature = new Signature(signature, enc);
  if (signature.recoveryParam !== null)
    return signature.recoveryParam;

  for (var i = 0; i < 4; i++) {
    var Qprime;
    try {
      Qprime = this.recoverPubKey(e, signature, i);
    } catch (e) {
      continue;
    }

    if (Qprime.eq(Q))
      return i;
  }
  throw new Error('Unable to find valid recovery factor');
};


/***/ }),

/***/ "uzSA":
/*!******************************************************!*\
  !*** ./node_modules/elliptic/lib/elliptic/ec/key.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var BN = __webpack_require__(/*! bn.js */ "OZ/i");
var elliptic = __webpack_require__(/*! ../../elliptic */ "MzeL");
var utils = elliptic.utils;
var assert = utils.assert;

function KeyPair(ec, options) {
  this.ec = ec;
  this.priv = null;
  this.pub = null;

  // KeyPair(ec, { priv: ..., pub: ... })
  if (options.priv)
    this._importPrivate(options.priv, options.privEnc);
  if (options.pub)
    this._importPublic(options.pub, options.pubEnc);
}
module.exports = KeyPair;

KeyPair.fromPublic = function fromPublic(ec, pub, enc) {
  if (pub instanceof KeyPair)
    return pub;

  return new KeyPair(ec, {
    pub: pub,
    pubEnc: enc
  });
};

KeyPair.fromPrivate = function fromPrivate(ec, priv, enc) {
  if (priv instanceof KeyPair)
    return priv;

  return new KeyPair(ec, {
    priv: priv,
    privEnc: enc
  });
};

KeyPair.prototype.validate = function validate() {
  var pub = this.getPublic();

  if (pub.isInfinity())
    return { result: false, reason: 'Invalid public key' };
  if (!pub.validate())
    return { result: false, reason: 'Public key is not a point' };
  if (!pub.mul(this.ec.curve.n).isInfinity())
    return { result: false, reason: 'Public key * N != O' };

  return { result: true, reason: null };
};

KeyPair.prototype.getPublic = function getPublic(compact, enc) {
  // compact is optional argument
  if (typeof compact === 'string') {
    enc = compact;
    compact = null;
  }

  if (!this.pub)
    this.pub = this.ec.g.mul(this.priv);

  if (!enc)
    return this.pub;

  return this.pub.encode(enc, compact);
};

KeyPair.prototype.getPrivate = function getPrivate(enc) {
  if (enc === 'hex')
    return this.priv.toString(16, 2);
  else
    return this.priv;
};

KeyPair.prototype._importPrivate = function _importPrivate(key, enc) {
  this.priv = new BN(key, enc || 16);

  // Ensure that the priv won't be bigger than n, otherwise we may fail
  // in fixed multiplication method
  this.priv = this.priv.umod(this.ec.curve.n);
};

KeyPair.prototype._importPublic = function _importPublic(key, enc) {
  if (key.x || key.y) {
    // Montgomery points only have an `x` coordinate.
    // Weierstrass/Edwards points on the other hand have both `x` and
    // `y` coordinates.
    if (this.ec.curve.type === 'mont') {
      assert(key.x, 'Need x coordinate');
    } else if (this.ec.curve.type === 'short' ||
               this.ec.curve.type === 'edwards') {
      assert(key.x && key.y, 'Need both x and y coordinate');
    }
    this.pub = this.ec.curve.point(key.x, key.y);
    return;
  }
  this.pub = this.ec.curve.decodePoint(key, enc);
};

// ECDH
KeyPair.prototype.derive = function derive(pub) {
  return pub.mul(this.priv).getX();
};

// ECDSA
KeyPair.prototype.sign = function sign(msg, enc, options) {
  return this.ec.sign(msg, this, enc, options);
};

KeyPair.prototype.verify = function verify(msg, signature) {
  return this.ec.verify(msg, signature, this);
};

KeyPair.prototype.inspect = function inspect() {
  return '<Key priv: ' + (this.priv && this.priv.toString(16, 2)) +
         ' pub: ' + (this.pub && this.pub.inspect()) + ' >';
};


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZWxsaXB0aWMvbGliL2VsbGlwdGljL2N1cnZlL2Jhc2UuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2VsbGlwdGljL2xpYi9lbGxpcHRpYy91dGlscy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZWxsaXB0aWMvbGliL2VsbGlwdGljL2N1cnZlcy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZWxsaXB0aWMvbGliL2VsbGlwdGljL2N1cnZlL3Nob3J0LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9lbGxpcHRpYy9saWIvZWxsaXB0aWMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2VsbGlwdGljL2xpYi9lbGxpcHRpYy9lZGRzYS9rZXkuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2VsbGlwdGljL2xpYi9lbGxpcHRpYy9jdXJ2ZS9lZHdhcmRzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9lbGxpcHRpYy9saWIvZWxsaXB0aWMvcHJlY29tcHV0ZWQvc2VjcDI1NmsxLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9lbGxpcHRpYy9saWIvZWxsaXB0aWMvY3VydmUvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2VsbGlwdGljL2xpYi9lbGxpcHRpYy9lZGRzYS9zaWduYXR1cmUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2VsbGlwdGljL2xpYi9lbGxpcHRpYy9jdXJ2ZS9tb250LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9lbGxpcHRpYy9saWIvZWxsaXB0aWMvZWRkc2EvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2VsbGlwdGljL2xpYi9lbGxpcHRpYy9lYy9zaWduYXR1cmUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2VsbGlwdGljL2xpYi9lbGxpcHRpYy9lYy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZWxsaXB0aWMvbGliL2VsbGlwdGljL2VjL2tleS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQWE7O0FBRWIsU0FBUyxtQkFBTyxDQUFDLG1CQUFPO0FBQ3hCLGVBQWUsbUJBQU8sQ0FBQyw0QkFBZ0I7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGlCQUFpQixnQkFBZ0I7QUFDakM7QUFDQSxzQ0FBc0MsUUFBUTtBQUM5QztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGlCQUFpQixPQUFPO0FBQ3hCLG1CQUFtQixpQkFBaUI7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSw4QkFBOEIsUUFBUTtBQUN0QztBQUNBLG1CQUFtQix3QkFBd0I7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGlCQUFpQixTQUFTO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSx1QkFBdUIsUUFBUTtBQUMvQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsU0FBUztBQUM1QjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG1CQUFtQixRQUFRO0FBQzNCOztBQUVBO0FBQ0E7QUFDQSxxQkFBcUIsU0FBUztBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLG1CQUFtQixTQUFTO0FBQzVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsU0FBUztBQUMxQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsaUJBQWlCLFdBQVc7QUFDNUIsbUJBQW1CLFVBQVU7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLFNBQVM7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsaUJBQWlCLE9BQU87QUFDeEI7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDdFhhOztBQUViO0FBQ0EsU0FBUyxtQkFBTyxDQUFDLG1CQUFPO0FBQ3hCLGdCQUFnQixtQkFBTyxDQUFDLGlDQUFxQjtBQUM3QyxlQUFlLG1CQUFPLENBQUMsdUNBQTJCOztBQUVsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxtQkFBbUIsV0FBVztBQUM5QjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7O0FDdEhhOztBQUViOztBQUVBLFdBQVcsbUJBQU8sQ0FBQyxxQkFBUztBQUM1QixlQUFlLG1CQUFPLENBQUMseUJBQWE7O0FBRXBDOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBLFFBQVEsbUJBQU8sQ0FBQyxxQ0FBeUI7QUFDekMsQ0FBQztBQUNEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDNU1ZOztBQUViLFlBQVksbUJBQU8sQ0FBQyxzQkFBVTtBQUM5QixlQUFlLG1CQUFPLENBQUMsNEJBQWdCO0FBQ3ZDLFNBQVMsbUJBQU8sQ0FBQyxtQkFBTztBQUN4QixlQUFlLG1CQUFPLENBQUMsc0JBQVU7QUFDakM7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSwyREFBMkQ7QUFDM0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEtBQUssZUFBZTtBQUNwQixLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsbUJBQW1CO0FBQ3BDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGlCQUFpQixXQUFXO0FBQzVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxtQkFBbUIsU0FBUztBQUM1QjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGlCQUFpQixTQUFTO0FBQzFCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQjtBQUN0QjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQjtBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDeDZCYTs7QUFFYjs7QUFFQSxtQkFBbUIsbUJBQU8sQ0FBQyw2QkFBaUI7QUFDNUMsaUJBQWlCLG1CQUFPLENBQUMsOEJBQWtCO0FBQzNDLGdCQUFnQixtQkFBTyxDQUFDLHFCQUFTO0FBQ2pDLGlCQUFpQixtQkFBTyxDQUFDLDhCQUFrQjtBQUMzQyxrQkFBa0IsbUJBQU8sQ0FBQywrQkFBbUI7O0FBRTdDO0FBQ0EsY0FBYyxtQkFBTyxDQUFDLDJCQUFlO0FBQ3JDLGlCQUFpQixtQkFBTyxDQUFDLDhCQUFrQjs7Ozs7Ozs7Ozs7OztBQ1o5Qjs7QUFFYixlQUFlLG1CQUFPLENBQUMsNEJBQWdCO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsVUFBVSxNQUFNO0FBQ2hCLFVBQVUsT0FBTztBQUNqQjtBQUNBLFVBQVUsWUFBWTtBQUN0QixVQUFVLE1BQU07QUFDaEIsVUFBVSxZQUFZO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLDZCQUE2QixXQUFXO0FBQ3hDOztBQUVBO0FBQ0E7QUFDQTtBQUNBLDZCQUE2QixpQkFBaUI7QUFDOUM7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7OztBQy9GYTs7QUFFYixZQUFZLG1CQUFPLENBQUMsc0JBQVU7QUFDOUIsZUFBZSxtQkFBTyxDQUFDLDRCQUFnQjtBQUN2QyxTQUFTLG1CQUFPLENBQUMsbUJBQU87QUFDeEIsZUFBZSxtQkFBTyxDQUFDLHNCQUFVO0FBQ2pDOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ2hiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7OztBQzN3QmE7O0FBRWI7O0FBRUEsYUFBYSxtQkFBTyxDQUFDLG9CQUFRO0FBQzdCLGNBQWMsbUJBQU8sQ0FBQyxxQkFBUztBQUMvQixhQUFhLG1CQUFPLENBQUMsb0JBQVE7QUFDN0IsZ0JBQWdCLG1CQUFPLENBQUMsdUJBQVc7Ozs7Ozs7Ozs7Ozs7QUNQdEI7O0FBRWIsU0FBUyxtQkFBTyxDQUFDLG1CQUFPO0FBQ3hCLGVBQWUsbUJBQU8sQ0FBQyw0QkFBZ0I7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxVQUFVLE1BQU07QUFDaEIsVUFBVSxvQkFBb0I7QUFDOUIsVUFBVSxtQkFBbUI7QUFDN0IsVUFBVSxnQkFBZ0I7QUFDMUIsVUFBVSxhQUFhO0FBQ3ZCLFVBQVUsYUFBYTtBQUN2QjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7Ozs7QUNqRWE7O0FBRWIsWUFBWSxtQkFBTyxDQUFDLHNCQUFVO0FBQzlCLFNBQVMsbUJBQU8sQ0FBQyxtQkFBTztBQUN4QixlQUFlLG1CQUFPLENBQUMsc0JBQVU7QUFDakM7O0FBRUEsZUFBZSxtQkFBTyxDQUFDLDRCQUFnQjtBQUN2Qzs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGVBQWU7QUFDZix1Q0FBdUM7QUFDdkMsZUFBZTs7QUFFZixxQkFBcUIsaUJBQWlCO0FBQ3RDOztBQUVBLCtCQUErQixRQUFRO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDbkxhOztBQUViLFdBQVcsbUJBQU8sQ0FBQyxxQkFBUztBQUM1QixlQUFlLG1CQUFPLENBQUMsNEJBQWdCO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBLGNBQWMsbUJBQU8sQ0FBQyxtQkFBTztBQUM3QixnQkFBZ0IsbUJBQU8sQ0FBQyx5QkFBYTs7QUFFckM7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0EsVUFBVSxhQUFhO0FBQ3ZCLFVBQVUscUJBQXFCO0FBQy9CLFlBQVksVUFBVTtBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZCQUE2QixpQ0FBaUM7QUFDOUQ7O0FBRUE7QUFDQSxVQUFVLE1BQU07QUFDaEIsVUFBVSx1QkFBdUI7QUFDakMsVUFBVSwyQkFBMkI7QUFDckMsWUFBWSxRQUFRO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxpQkFBaUIsc0JBQXNCO0FBQ3ZDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDckhhOztBQUViLFNBQVMsbUJBQU8sQ0FBQyxtQkFBTzs7QUFFeEIsZUFBZSxtQkFBTyxDQUFDLDRCQUFnQjtBQUN2QztBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQ0FBZ0MsY0FBYztBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDdElhOztBQUViLFNBQVMsbUJBQU8sQ0FBQyxtQkFBTztBQUN4QixlQUFlLG1CQUFPLENBQUMsdUJBQVc7QUFDbEMsZUFBZSxtQkFBTyxDQUFDLDRCQUFnQjtBQUN2QztBQUNBOztBQUVBLGNBQWMsbUJBQU8sQ0FBQyxtQkFBTztBQUM3QixnQkFBZ0IsbUJBQU8sQ0FBQyx5QkFBYTs7QUFFckM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxlQUFlOztBQUVmO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7O0FBRUEsb0JBQW9CLE1BQU07QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsMEJBQTBCLDJDQUEyQztBQUNyRTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxpQkFBaUIsT0FBTztBQUN4QjtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDL09hOztBQUViLFNBQVMsbUJBQU8sQ0FBQyxtQkFBTztBQUN4QixlQUFlLG1CQUFPLENBQUMsNEJBQWdCO0FBQ3ZDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsa0JBQWtCLHNCQUFzQjtBQUN4QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxZQUFZO0FBQ1o7QUFDQSxZQUFZO0FBQ1o7QUFDQSxZQUFZOztBQUVaLFVBQVU7QUFDVjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYnVpbGQvdmVuZG9yL3ZlbmRvci5lbGxpcHRpYy43NDJkNjcyZDg3NzFjNTVjODA1ZC5jaHVuay5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBCTiA9IHJlcXVpcmUoJ2JuLmpzJyk7XHJcbnZhciBlbGxpcHRpYyA9IHJlcXVpcmUoJy4uLy4uL2VsbGlwdGljJyk7XHJcbnZhciB1dGlscyA9IGVsbGlwdGljLnV0aWxzO1xyXG52YXIgZ2V0TkFGID0gdXRpbHMuZ2V0TkFGO1xyXG52YXIgZ2V0SlNGID0gdXRpbHMuZ2V0SlNGO1xyXG52YXIgYXNzZXJ0ID0gdXRpbHMuYXNzZXJ0O1xyXG5cclxuZnVuY3Rpb24gQmFzZUN1cnZlKHR5cGUsIGNvbmYpIHtcclxuICB0aGlzLnR5cGUgPSB0eXBlO1xyXG4gIHRoaXMucCA9IG5ldyBCTihjb25mLnAsIDE2KTtcclxuXHJcbiAgLy8gVXNlIE1vbnRnb21lcnksIHdoZW4gdGhlcmUgaXMgbm8gZmFzdCByZWR1Y3Rpb24gZm9yIHRoZSBwcmltZVxyXG4gIHRoaXMucmVkID0gY29uZi5wcmltZSA/IEJOLnJlZChjb25mLnByaW1lKSA6IEJOLm1vbnQodGhpcy5wKTtcclxuXHJcbiAgLy8gVXNlZnVsIGZvciBtYW55IGN1cnZlc1xyXG4gIHRoaXMuemVybyA9IG5ldyBCTigwKS50b1JlZCh0aGlzLnJlZCk7XHJcbiAgdGhpcy5vbmUgPSBuZXcgQk4oMSkudG9SZWQodGhpcy5yZWQpO1xyXG4gIHRoaXMudHdvID0gbmV3IEJOKDIpLnRvUmVkKHRoaXMucmVkKTtcclxuXHJcbiAgLy8gQ3VydmUgY29uZmlndXJhdGlvbiwgb3B0aW9uYWxcclxuICB0aGlzLm4gPSBjb25mLm4gJiYgbmV3IEJOKGNvbmYubiwgMTYpO1xyXG4gIHRoaXMuZyA9IGNvbmYuZyAmJiB0aGlzLnBvaW50RnJvbUpTT04oY29uZi5nLCBjb25mLmdSZWQpO1xyXG5cclxuICAvLyBUZW1wb3JhcnkgYXJyYXlzXHJcbiAgdGhpcy5fd25hZlQxID0gbmV3IEFycmF5KDQpO1xyXG4gIHRoaXMuX3duYWZUMiA9IG5ldyBBcnJheSg0KTtcclxuICB0aGlzLl93bmFmVDMgPSBuZXcgQXJyYXkoNCk7XHJcbiAgdGhpcy5fd25hZlQ0ID0gbmV3IEFycmF5KDQpO1xyXG5cclxuICAvLyBHZW5lcmFsaXplZCBHcmVnIE1heHdlbGwncyB0cmlja1xyXG4gIHZhciBhZGp1c3RDb3VudCA9IHRoaXMubiAmJiB0aGlzLnAuZGl2KHRoaXMubik7XHJcbiAgaWYgKCFhZGp1c3RDb3VudCB8fCBhZGp1c3RDb3VudC5jbXBuKDEwMCkgPiAwKSB7XHJcbiAgICB0aGlzLnJlZE4gPSBudWxsO1xyXG4gIH0gZWxzZSB7XHJcbiAgICB0aGlzLl9tYXh3ZWxsVHJpY2sgPSB0cnVlO1xyXG4gICAgdGhpcy5yZWROID0gdGhpcy5uLnRvUmVkKHRoaXMucmVkKTtcclxuICB9XHJcbn1cclxubW9kdWxlLmV4cG9ydHMgPSBCYXNlQ3VydmU7XHJcblxyXG5CYXNlQ3VydmUucHJvdG90eXBlLnBvaW50ID0gZnVuY3Rpb24gcG9pbnQoKSB7XHJcbiAgdGhyb3cgbmV3IEVycm9yKCdOb3QgaW1wbGVtZW50ZWQnKTtcclxufTtcclxuXHJcbkJhc2VDdXJ2ZS5wcm90b3R5cGUudmFsaWRhdGUgPSBmdW5jdGlvbiB2YWxpZGF0ZSgpIHtcclxuICB0aHJvdyBuZXcgRXJyb3IoJ05vdCBpbXBsZW1lbnRlZCcpO1xyXG59O1xyXG5cclxuQmFzZUN1cnZlLnByb3RvdHlwZS5fZml4ZWROYWZNdWwgPSBmdW5jdGlvbiBfZml4ZWROYWZNdWwocCwgaykge1xyXG4gIGFzc2VydChwLnByZWNvbXB1dGVkKTtcclxuICB2YXIgZG91YmxlcyA9IHAuX2dldERvdWJsZXMoKTtcclxuXHJcbiAgdmFyIG5hZiA9IGdldE5BRihrLCAxKTtcclxuICB2YXIgSSA9ICgxIDw8IChkb3VibGVzLnN0ZXAgKyAxKSkgLSAoZG91Ymxlcy5zdGVwICUgMiA9PT0gMCA/IDIgOiAxKTtcclxuICBJIC89IDM7XHJcblxyXG4gIC8vIFRyYW5zbGF0ZSBpbnRvIG1vcmUgd2luZG93ZWQgZm9ybVxyXG4gIHZhciByZXByID0gW107XHJcbiAgZm9yICh2YXIgaiA9IDA7IGogPCBuYWYubGVuZ3RoOyBqICs9IGRvdWJsZXMuc3RlcCkge1xyXG4gICAgdmFyIG5hZlcgPSAwO1xyXG4gICAgZm9yICh2YXIgayA9IGogKyBkb3VibGVzLnN0ZXAgLSAxOyBrID49IGo7IGstLSlcclxuICAgICAgbmFmVyA9IChuYWZXIDw8IDEpICsgbmFmW2tdO1xyXG4gICAgcmVwci5wdXNoKG5hZlcpO1xyXG4gIH1cclxuXHJcbiAgdmFyIGEgPSB0aGlzLmpwb2ludChudWxsLCBudWxsLCBudWxsKTtcclxuICB2YXIgYiA9IHRoaXMuanBvaW50KG51bGwsIG51bGwsIG51bGwpO1xyXG4gIGZvciAodmFyIGkgPSBJOyBpID4gMDsgaS0tKSB7XHJcbiAgICBmb3IgKHZhciBqID0gMDsgaiA8IHJlcHIubGVuZ3RoOyBqKyspIHtcclxuICAgICAgdmFyIG5hZlcgPSByZXByW2pdO1xyXG4gICAgICBpZiAobmFmVyA9PT0gaSlcclxuICAgICAgICBiID0gYi5taXhlZEFkZChkb3VibGVzLnBvaW50c1tqXSk7XHJcbiAgICAgIGVsc2UgaWYgKG5hZlcgPT09IC1pKVxyXG4gICAgICAgIGIgPSBiLm1peGVkQWRkKGRvdWJsZXMucG9pbnRzW2pdLm5lZygpKTtcclxuICAgIH1cclxuICAgIGEgPSBhLmFkZChiKTtcclxuICB9XHJcbiAgcmV0dXJuIGEudG9QKCk7XHJcbn07XHJcblxyXG5CYXNlQ3VydmUucHJvdG90eXBlLl93bmFmTXVsID0gZnVuY3Rpb24gX3duYWZNdWwocCwgaykge1xyXG4gIHZhciB3ID0gNDtcclxuXHJcbiAgLy8gUHJlY29tcHV0ZSB3aW5kb3dcclxuICB2YXIgbmFmUG9pbnRzID0gcC5fZ2V0TkFGUG9pbnRzKHcpO1xyXG4gIHcgPSBuYWZQb2ludHMud25kO1xyXG4gIHZhciB3bmQgPSBuYWZQb2ludHMucG9pbnRzO1xyXG5cclxuICAvLyBHZXQgTkFGIGZvcm1cclxuICB2YXIgbmFmID0gZ2V0TkFGKGssIHcpO1xyXG5cclxuICAvLyBBZGQgYHRoaXNgKihOKzEpIGZvciBldmVyeSB3LU5BRiBpbmRleFxyXG4gIHZhciBhY2MgPSB0aGlzLmpwb2ludChudWxsLCBudWxsLCBudWxsKTtcclxuICBmb3IgKHZhciBpID0gbmFmLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XHJcbiAgICAvLyBDb3VudCB6ZXJvZXNcclxuICAgIGZvciAodmFyIGsgPSAwOyBpID49IDAgJiYgbmFmW2ldID09PSAwOyBpLS0pXHJcbiAgICAgIGsrKztcclxuICAgIGlmIChpID49IDApXHJcbiAgICAgIGsrKztcclxuICAgIGFjYyA9IGFjYy5kYmxwKGspO1xyXG5cclxuICAgIGlmIChpIDwgMClcclxuICAgICAgYnJlYWs7XHJcbiAgICB2YXIgeiA9IG5hZltpXTtcclxuICAgIGFzc2VydCh6ICE9PSAwKTtcclxuICAgIGlmIChwLnR5cGUgPT09ICdhZmZpbmUnKSB7XHJcbiAgICAgIC8vIEogKy0gUFxyXG4gICAgICBpZiAoeiA+IDApXHJcbiAgICAgICAgYWNjID0gYWNjLm1peGVkQWRkKHduZFsoeiAtIDEpID4+IDFdKTtcclxuICAgICAgZWxzZVxyXG4gICAgICAgIGFjYyA9IGFjYy5taXhlZEFkZCh3bmRbKC16IC0gMSkgPj4gMV0ubmVnKCkpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgLy8gSiArLSBKXHJcbiAgICAgIGlmICh6ID4gMClcclxuICAgICAgICBhY2MgPSBhY2MuYWRkKHduZFsoeiAtIDEpID4+IDFdKTtcclxuICAgICAgZWxzZVxyXG4gICAgICAgIGFjYyA9IGFjYy5hZGQod25kWygteiAtIDEpID4+IDFdLm5lZygpKTtcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIHAudHlwZSA9PT0gJ2FmZmluZScgPyBhY2MudG9QKCkgOiBhY2M7XHJcbn07XHJcblxyXG5CYXNlQ3VydmUucHJvdG90eXBlLl93bmFmTXVsQWRkID0gZnVuY3Rpb24gX3duYWZNdWxBZGQoZGVmVyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50cyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvZWZmcyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxlbixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGphY29iaWFuUmVzdWx0KSB7XHJcbiAgdmFyIHduZFdpZHRoID0gdGhpcy5fd25hZlQxO1xyXG4gIHZhciB3bmQgPSB0aGlzLl93bmFmVDI7XHJcbiAgdmFyIG5hZiA9IHRoaXMuX3duYWZUMztcclxuXHJcbiAgLy8gRmlsbCBhbGwgYXJyYXlzXHJcbiAgdmFyIG1heCA9IDA7XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykge1xyXG4gICAgdmFyIHAgPSBwb2ludHNbaV07XHJcbiAgICB2YXIgbmFmUG9pbnRzID0gcC5fZ2V0TkFGUG9pbnRzKGRlZlcpO1xyXG4gICAgd25kV2lkdGhbaV0gPSBuYWZQb2ludHMud25kO1xyXG4gICAgd25kW2ldID0gbmFmUG9pbnRzLnBvaW50cztcclxuICB9XHJcblxyXG4gIC8vIENvbWIgc21hbGwgd2luZG93IE5BRnNcclxuICBmb3IgKHZhciBpID0gbGVuIC0gMTsgaSA+PSAxOyBpIC09IDIpIHtcclxuICAgIHZhciBhID0gaSAtIDE7XHJcbiAgICB2YXIgYiA9IGk7XHJcbiAgICBpZiAod25kV2lkdGhbYV0gIT09IDEgfHwgd25kV2lkdGhbYl0gIT09IDEpIHtcclxuICAgICAgbmFmW2FdID0gZ2V0TkFGKGNvZWZmc1thXSwgd25kV2lkdGhbYV0pO1xyXG4gICAgICBuYWZbYl0gPSBnZXROQUYoY29lZmZzW2JdLCB3bmRXaWR0aFtiXSk7XHJcbiAgICAgIG1heCA9IE1hdGgubWF4KG5hZlthXS5sZW5ndGgsIG1heCk7XHJcbiAgICAgIG1heCA9IE1hdGgubWF4KG5hZltiXS5sZW5ndGgsIG1heCk7XHJcbiAgICAgIGNvbnRpbnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBjb21iID0gW1xyXG4gICAgICBwb2ludHNbYV0sIC8qIDEgKi9cclxuICAgICAgbnVsbCwgLyogMyAqL1xyXG4gICAgICBudWxsLCAvKiA1ICovXHJcbiAgICAgIHBvaW50c1tiXSAvKiA3ICovXHJcbiAgICBdO1xyXG5cclxuICAgIC8vIFRyeSB0byBhdm9pZCBQcm9qZWN0aXZlIHBvaW50cywgaWYgcG9zc2libGVcclxuICAgIGlmIChwb2ludHNbYV0ueS5jbXAocG9pbnRzW2JdLnkpID09PSAwKSB7XHJcbiAgICAgIGNvbWJbMV0gPSBwb2ludHNbYV0uYWRkKHBvaW50c1tiXSk7XHJcbiAgICAgIGNvbWJbMl0gPSBwb2ludHNbYV0udG9KKCkubWl4ZWRBZGQocG9pbnRzW2JdLm5lZygpKTtcclxuICAgIH0gZWxzZSBpZiAocG9pbnRzW2FdLnkuY21wKHBvaW50c1tiXS55LnJlZE5lZygpKSA9PT0gMCkge1xyXG4gICAgICBjb21iWzFdID0gcG9pbnRzW2FdLnRvSigpLm1peGVkQWRkKHBvaW50c1tiXSk7XHJcbiAgICAgIGNvbWJbMl0gPSBwb2ludHNbYV0uYWRkKHBvaW50c1tiXS5uZWcoKSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjb21iWzFdID0gcG9pbnRzW2FdLnRvSigpLm1peGVkQWRkKHBvaW50c1tiXSk7XHJcbiAgICAgIGNvbWJbMl0gPSBwb2ludHNbYV0udG9KKCkubWl4ZWRBZGQocG9pbnRzW2JdLm5lZygpKTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgaW5kZXggPSBbXHJcbiAgICAgIC0zLCAvKiAtMSAtMSAqL1xyXG4gICAgICAtMSwgLyogLTEgMCAqL1xyXG4gICAgICAtNSwgLyogLTEgMSAqL1xyXG4gICAgICAtNywgLyogMCAtMSAqL1xyXG4gICAgICAwLCAvKiAwIDAgKi9cclxuICAgICAgNywgLyogMCAxICovXHJcbiAgICAgIDUsIC8qIDEgLTEgKi9cclxuICAgICAgMSwgLyogMSAwICovXHJcbiAgICAgIDMgIC8qIDEgMSAqL1xyXG4gICAgXTtcclxuXHJcbiAgICB2YXIganNmID0gZ2V0SlNGKGNvZWZmc1thXSwgY29lZmZzW2JdKTtcclxuICAgIG1heCA9IE1hdGgubWF4KGpzZlswXS5sZW5ndGgsIG1heCk7XHJcbiAgICBuYWZbYV0gPSBuZXcgQXJyYXkobWF4KTtcclxuICAgIG5hZltiXSA9IG5ldyBBcnJheShtYXgpO1xyXG4gICAgZm9yICh2YXIgaiA9IDA7IGogPCBtYXg7IGorKykge1xyXG4gICAgICB2YXIgamEgPSBqc2ZbMF1bal0gfCAwO1xyXG4gICAgICB2YXIgamIgPSBqc2ZbMV1bal0gfCAwO1xyXG5cclxuICAgICAgbmFmW2FdW2pdID0gaW5kZXhbKGphICsgMSkgKiAzICsgKGpiICsgMSldO1xyXG4gICAgICBuYWZbYl1bal0gPSAwO1xyXG4gICAgICB3bmRbYV0gPSBjb21iO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdmFyIGFjYyA9IHRoaXMuanBvaW50KG51bGwsIG51bGwsIG51bGwpO1xyXG4gIHZhciB0bXAgPSB0aGlzLl93bmFmVDQ7XHJcbiAgZm9yICh2YXIgaSA9IG1heDsgaSA+PSAwOyBpLS0pIHtcclxuICAgIHZhciBrID0gMDtcclxuXHJcbiAgICB3aGlsZSAoaSA+PSAwKSB7XHJcbiAgICAgIHZhciB6ZXJvID0gdHJ1ZTtcclxuICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBsZW47IGorKykge1xyXG4gICAgICAgIHRtcFtqXSA9IG5hZltqXVtpXSB8IDA7XHJcbiAgICAgICAgaWYgKHRtcFtqXSAhPT0gMClcclxuICAgICAgICAgIHplcm8gPSBmYWxzZTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoIXplcm8pXHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGsrKztcclxuICAgICAgaS0tO1xyXG4gICAgfVxyXG4gICAgaWYgKGkgPj0gMClcclxuICAgICAgaysrO1xyXG4gICAgYWNjID0gYWNjLmRibHAoayk7XHJcbiAgICBpZiAoaSA8IDApXHJcbiAgICAgIGJyZWFrO1xyXG5cclxuICAgIGZvciAodmFyIGogPSAwOyBqIDwgbGVuOyBqKyspIHtcclxuICAgICAgdmFyIHogPSB0bXBbal07XHJcbiAgICAgIHZhciBwO1xyXG4gICAgICBpZiAoeiA9PT0gMClcclxuICAgICAgICBjb250aW51ZTtcclxuICAgICAgZWxzZSBpZiAoeiA+IDApXHJcbiAgICAgICAgcCA9IHduZFtqXVsoeiAtIDEpID4+IDFdO1xyXG4gICAgICBlbHNlIGlmICh6IDwgMClcclxuICAgICAgICBwID0gd25kW2pdWygteiAtIDEpID4+IDFdLm5lZygpO1xyXG5cclxuICAgICAgaWYgKHAudHlwZSA9PT0gJ2FmZmluZScpXHJcbiAgICAgICAgYWNjID0gYWNjLm1peGVkQWRkKHApO1xyXG4gICAgICBlbHNlXHJcbiAgICAgICAgYWNjID0gYWNjLmFkZChwKTtcclxuICAgIH1cclxuICB9XHJcbiAgLy8gWmVyb2lmeSByZWZlcmVuY2VzXHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKylcclxuICAgIHduZFtpXSA9IG51bGw7XHJcblxyXG4gIGlmIChqYWNvYmlhblJlc3VsdClcclxuICAgIHJldHVybiBhY2M7XHJcbiAgZWxzZVxyXG4gICAgcmV0dXJuIGFjYy50b1AoKTtcclxufTtcclxuXHJcbmZ1bmN0aW9uIEJhc2VQb2ludChjdXJ2ZSwgdHlwZSkge1xyXG4gIHRoaXMuY3VydmUgPSBjdXJ2ZTtcclxuICB0aGlzLnR5cGUgPSB0eXBlO1xyXG4gIHRoaXMucHJlY29tcHV0ZWQgPSBudWxsO1xyXG59XHJcbkJhc2VDdXJ2ZS5CYXNlUG9pbnQgPSBCYXNlUG9pbnQ7XHJcblxyXG5CYXNlUG9pbnQucHJvdG90eXBlLmVxID0gZnVuY3Rpb24gZXEoLypvdGhlciovKSB7XHJcbiAgdGhyb3cgbmV3IEVycm9yKCdOb3QgaW1wbGVtZW50ZWQnKTtcclxufTtcclxuXHJcbkJhc2VQb2ludC5wcm90b3R5cGUudmFsaWRhdGUgPSBmdW5jdGlvbiB2YWxpZGF0ZSgpIHtcclxuICByZXR1cm4gdGhpcy5jdXJ2ZS52YWxpZGF0ZSh0aGlzKTtcclxufTtcclxuXHJcbkJhc2VDdXJ2ZS5wcm90b3R5cGUuZGVjb2RlUG9pbnQgPSBmdW5jdGlvbiBkZWNvZGVQb2ludChieXRlcywgZW5jKSB7XHJcbiAgYnl0ZXMgPSB1dGlscy50b0FycmF5KGJ5dGVzLCBlbmMpO1xyXG5cclxuICB2YXIgbGVuID0gdGhpcy5wLmJ5dGVMZW5ndGgoKTtcclxuXHJcbiAgLy8gdW5jb21wcmVzc2VkLCBoeWJyaWQtb2RkLCBoeWJyaWQtZXZlblxyXG4gIGlmICgoYnl0ZXNbMF0gPT09IDB4MDQgfHwgYnl0ZXNbMF0gPT09IDB4MDYgfHwgYnl0ZXNbMF0gPT09IDB4MDcpICYmXHJcbiAgICAgIGJ5dGVzLmxlbmd0aCAtIDEgPT09IDIgKiBsZW4pIHtcclxuICAgIGlmIChieXRlc1swXSA9PT0gMHgwNilcclxuICAgICAgYXNzZXJ0KGJ5dGVzW2J5dGVzLmxlbmd0aCAtIDFdICUgMiA9PT0gMCk7XHJcbiAgICBlbHNlIGlmIChieXRlc1swXSA9PT0gMHgwNylcclxuICAgICAgYXNzZXJ0KGJ5dGVzW2J5dGVzLmxlbmd0aCAtIDFdICUgMiA9PT0gMSk7XHJcblxyXG4gICAgdmFyIHJlcyA9ICB0aGlzLnBvaW50KGJ5dGVzLnNsaWNlKDEsIDEgKyBsZW4pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGJ5dGVzLnNsaWNlKDEgKyBsZW4sIDEgKyAyICogbGVuKSk7XHJcblxyXG4gICAgcmV0dXJuIHJlcztcclxuICB9IGVsc2UgaWYgKChieXRlc1swXSA9PT0gMHgwMiB8fCBieXRlc1swXSA9PT0gMHgwMykgJiZcclxuICAgICAgICAgICAgICBieXRlcy5sZW5ndGggLSAxID09PSBsZW4pIHtcclxuICAgIHJldHVybiB0aGlzLnBvaW50RnJvbVgoYnl0ZXMuc2xpY2UoMSwgMSArIGxlbiksIGJ5dGVzWzBdID09PSAweDAzKTtcclxuICB9XHJcbiAgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIHBvaW50IGZvcm1hdCcpO1xyXG59O1xyXG5cclxuQmFzZVBvaW50LnByb3RvdHlwZS5lbmNvZGVDb21wcmVzc2VkID0gZnVuY3Rpb24gZW5jb2RlQ29tcHJlc3NlZChlbmMpIHtcclxuICByZXR1cm4gdGhpcy5lbmNvZGUoZW5jLCB0cnVlKTtcclxufTtcclxuXHJcbkJhc2VQb2ludC5wcm90b3R5cGUuX2VuY29kZSA9IGZ1bmN0aW9uIF9lbmNvZGUoY29tcGFjdCkge1xyXG4gIHZhciBsZW4gPSB0aGlzLmN1cnZlLnAuYnl0ZUxlbmd0aCgpO1xyXG4gIHZhciB4ID0gdGhpcy5nZXRYKCkudG9BcnJheSgnYmUnLCBsZW4pO1xyXG5cclxuICBpZiAoY29tcGFjdClcclxuICAgIHJldHVybiBbIHRoaXMuZ2V0WSgpLmlzRXZlbigpID8gMHgwMiA6IDB4MDMgXS5jb25jYXQoeCk7XHJcblxyXG4gIHJldHVybiBbIDB4MDQgXS5jb25jYXQoeCwgdGhpcy5nZXRZKCkudG9BcnJheSgnYmUnLCBsZW4pKSA7XHJcbn07XHJcblxyXG5CYXNlUG9pbnQucHJvdG90eXBlLmVuY29kZSA9IGZ1bmN0aW9uIGVuY29kZShlbmMsIGNvbXBhY3QpIHtcclxuICByZXR1cm4gdXRpbHMuZW5jb2RlKHRoaXMuX2VuY29kZShjb21wYWN0KSwgZW5jKTtcclxufTtcclxuXHJcbkJhc2VQb2ludC5wcm90b3R5cGUucHJlY29tcHV0ZSA9IGZ1bmN0aW9uIHByZWNvbXB1dGUocG93ZXIpIHtcclxuICBpZiAodGhpcy5wcmVjb21wdXRlZClcclxuICAgIHJldHVybiB0aGlzO1xyXG5cclxuICB2YXIgcHJlY29tcHV0ZWQgPSB7XHJcbiAgICBkb3VibGVzOiBudWxsLFxyXG4gICAgbmFmOiBudWxsLFxyXG4gICAgYmV0YTogbnVsbFxyXG4gIH07XHJcbiAgcHJlY29tcHV0ZWQubmFmID0gdGhpcy5fZ2V0TkFGUG9pbnRzKDgpO1xyXG4gIHByZWNvbXB1dGVkLmRvdWJsZXMgPSB0aGlzLl9nZXREb3VibGVzKDQsIHBvd2VyKTtcclxuICBwcmVjb21wdXRlZC5iZXRhID0gdGhpcy5fZ2V0QmV0YSgpO1xyXG4gIHRoaXMucHJlY29tcHV0ZWQgPSBwcmVjb21wdXRlZDtcclxuXHJcbiAgcmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5CYXNlUG9pbnQucHJvdG90eXBlLl9oYXNEb3VibGVzID0gZnVuY3Rpb24gX2hhc0RvdWJsZXMoaykge1xyXG4gIGlmICghdGhpcy5wcmVjb21wdXRlZClcclxuICAgIHJldHVybiBmYWxzZTtcclxuXHJcbiAgdmFyIGRvdWJsZXMgPSB0aGlzLnByZWNvbXB1dGVkLmRvdWJsZXM7XHJcbiAgaWYgKCFkb3VibGVzKVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG5cclxuICByZXR1cm4gZG91Ymxlcy5wb2ludHMubGVuZ3RoID49IE1hdGguY2VpbCgoay5iaXRMZW5ndGgoKSArIDEpIC8gZG91Ymxlcy5zdGVwKTtcclxufTtcclxuXHJcbkJhc2VQb2ludC5wcm90b3R5cGUuX2dldERvdWJsZXMgPSBmdW5jdGlvbiBfZ2V0RG91YmxlcyhzdGVwLCBwb3dlcikge1xyXG4gIGlmICh0aGlzLnByZWNvbXB1dGVkICYmIHRoaXMucHJlY29tcHV0ZWQuZG91YmxlcylcclxuICAgIHJldHVybiB0aGlzLnByZWNvbXB1dGVkLmRvdWJsZXM7XHJcblxyXG4gIHZhciBkb3VibGVzID0gWyB0aGlzIF07XHJcbiAgdmFyIGFjYyA9IHRoaXM7XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBwb3dlcjsgaSArPSBzdGVwKSB7XHJcbiAgICBmb3IgKHZhciBqID0gMDsgaiA8IHN0ZXA7IGorKylcclxuICAgICAgYWNjID0gYWNjLmRibCgpO1xyXG4gICAgZG91Ymxlcy5wdXNoKGFjYyk7XHJcbiAgfVxyXG4gIHJldHVybiB7XHJcbiAgICBzdGVwOiBzdGVwLFxyXG4gICAgcG9pbnRzOiBkb3VibGVzXHJcbiAgfTtcclxufTtcclxuXHJcbkJhc2VQb2ludC5wcm90b3R5cGUuX2dldE5BRlBvaW50cyA9IGZ1bmN0aW9uIF9nZXROQUZQb2ludHMod25kKSB7XHJcbiAgaWYgKHRoaXMucHJlY29tcHV0ZWQgJiYgdGhpcy5wcmVjb21wdXRlZC5uYWYpXHJcbiAgICByZXR1cm4gdGhpcy5wcmVjb21wdXRlZC5uYWY7XHJcblxyXG4gIHZhciByZXMgPSBbIHRoaXMgXTtcclxuICB2YXIgbWF4ID0gKDEgPDwgd25kKSAtIDE7XHJcbiAgdmFyIGRibCA9IG1heCA9PT0gMSA/IG51bGwgOiB0aGlzLmRibCgpO1xyXG4gIGZvciAodmFyIGkgPSAxOyBpIDwgbWF4OyBpKyspXHJcbiAgICByZXNbaV0gPSByZXNbaSAtIDFdLmFkZChkYmwpO1xyXG4gIHJldHVybiB7XHJcbiAgICB3bmQ6IHduZCxcclxuICAgIHBvaW50czogcmVzXHJcbiAgfTtcclxufTtcclxuXHJcbkJhc2VQb2ludC5wcm90b3R5cGUuX2dldEJldGEgPSBmdW5jdGlvbiBfZ2V0QmV0YSgpIHtcclxuICByZXR1cm4gbnVsbDtcclxufTtcclxuXHJcbkJhc2VQb2ludC5wcm90b3R5cGUuZGJscCA9IGZ1bmN0aW9uIGRibHAoaykge1xyXG4gIHZhciByID0gdGhpcztcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IGs7IGkrKylcclxuICAgIHIgPSByLmRibCgpO1xyXG4gIHJldHVybiByO1xyXG59O1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgdXRpbHMgPSBleHBvcnRzO1xyXG52YXIgQk4gPSByZXF1aXJlKCdibi5qcycpO1xyXG52YXIgbWluQXNzZXJ0ID0gcmVxdWlyZSgnbWluaW1hbGlzdGljLWFzc2VydCcpO1xyXG52YXIgbWluVXRpbHMgPSByZXF1aXJlKCdtaW5pbWFsaXN0aWMtY3J5cHRvLXV0aWxzJyk7XHJcblxyXG51dGlscy5hc3NlcnQgPSBtaW5Bc3NlcnQ7XHJcbnV0aWxzLnRvQXJyYXkgPSBtaW5VdGlscy50b0FycmF5O1xyXG51dGlscy56ZXJvMiA9IG1pblV0aWxzLnplcm8yO1xyXG51dGlscy50b0hleCA9IG1pblV0aWxzLnRvSGV4O1xyXG51dGlscy5lbmNvZGUgPSBtaW5VdGlscy5lbmNvZGU7XHJcblxyXG4vLyBSZXByZXNlbnQgbnVtIGluIGEgdy1OQUYgZm9ybVxyXG5mdW5jdGlvbiBnZXROQUYobnVtLCB3KSB7XHJcbiAgdmFyIG5hZiA9IFtdO1xyXG4gIHZhciB3cyA9IDEgPDwgKHcgKyAxKTtcclxuICB2YXIgayA9IG51bS5jbG9uZSgpO1xyXG4gIHdoaWxlIChrLmNtcG4oMSkgPj0gMCkge1xyXG4gICAgdmFyIHo7XHJcbiAgICBpZiAoay5pc09kZCgpKSB7XHJcbiAgICAgIHZhciBtb2QgPSBrLmFuZGxuKHdzIC0gMSk7XHJcbiAgICAgIGlmIChtb2QgPiAod3MgPj4gMSkgLSAxKVxyXG4gICAgICAgIHogPSAod3MgPj4gMSkgLSBtb2Q7XHJcbiAgICAgIGVsc2VcclxuICAgICAgICB6ID0gbW9kO1xyXG4gICAgICBrLmlzdWJuKHopO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgeiA9IDA7XHJcbiAgICB9XHJcbiAgICBuYWYucHVzaCh6KTtcclxuXHJcbiAgICAvLyBPcHRpbWl6YXRpb24sIHNoaWZ0IGJ5IHdvcmQgaWYgcG9zc2libGVcclxuICAgIHZhciBzaGlmdCA9IChrLmNtcG4oMCkgIT09IDAgJiYgay5hbmRsbih3cyAtIDEpID09PSAwKSA/ICh3ICsgMSkgOiAxO1xyXG4gICAgZm9yICh2YXIgaSA9IDE7IGkgPCBzaGlmdDsgaSsrKVxyXG4gICAgICBuYWYucHVzaCgwKTtcclxuICAgIGsuaXVzaHJuKHNoaWZ0KTtcclxuICB9XHJcblxyXG4gIHJldHVybiBuYWY7XHJcbn1cclxudXRpbHMuZ2V0TkFGID0gZ2V0TkFGO1xyXG5cclxuLy8gUmVwcmVzZW50IGsxLCBrMiBpbiBhIEpvaW50IFNwYXJzZSBGb3JtXHJcbmZ1bmN0aW9uIGdldEpTRihrMSwgazIpIHtcclxuICB2YXIganNmID0gW1xyXG4gICAgW10sXHJcbiAgICBbXVxyXG4gIF07XHJcblxyXG4gIGsxID0gazEuY2xvbmUoKTtcclxuICBrMiA9IGsyLmNsb25lKCk7XHJcbiAgdmFyIGQxID0gMDtcclxuICB2YXIgZDIgPSAwO1xyXG4gIHdoaWxlIChrMS5jbXBuKC1kMSkgPiAwIHx8IGsyLmNtcG4oLWQyKSA+IDApIHtcclxuXHJcbiAgICAvLyBGaXJzdCBwaGFzZVxyXG4gICAgdmFyIG0xNCA9IChrMS5hbmRsbigzKSArIGQxKSAmIDM7XHJcbiAgICB2YXIgbTI0ID0gKGsyLmFuZGxuKDMpICsgZDIpICYgMztcclxuICAgIGlmIChtMTQgPT09IDMpXHJcbiAgICAgIG0xNCA9IC0xO1xyXG4gICAgaWYgKG0yNCA9PT0gMylcclxuICAgICAgbTI0ID0gLTE7XHJcbiAgICB2YXIgdTE7XHJcbiAgICBpZiAoKG0xNCAmIDEpID09PSAwKSB7XHJcbiAgICAgIHUxID0gMDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHZhciBtOCA9IChrMS5hbmRsbig3KSArIGQxKSAmIDc7XHJcbiAgICAgIGlmICgobTggPT09IDMgfHwgbTggPT09IDUpICYmIG0yNCA9PT0gMilcclxuICAgICAgICB1MSA9IC1tMTQ7XHJcbiAgICAgIGVsc2VcclxuICAgICAgICB1MSA9IG0xNDtcclxuICAgIH1cclxuICAgIGpzZlswXS5wdXNoKHUxKTtcclxuXHJcbiAgICB2YXIgdTI7XHJcbiAgICBpZiAoKG0yNCAmIDEpID09PSAwKSB7XHJcbiAgICAgIHUyID0gMDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHZhciBtOCA9IChrMi5hbmRsbig3KSArIGQyKSAmIDc7XHJcbiAgICAgIGlmICgobTggPT09IDMgfHwgbTggPT09IDUpICYmIG0xNCA9PT0gMilcclxuICAgICAgICB1MiA9IC1tMjQ7XHJcbiAgICAgIGVsc2VcclxuICAgICAgICB1MiA9IG0yNDtcclxuICAgIH1cclxuICAgIGpzZlsxXS5wdXNoKHUyKTtcclxuXHJcbiAgICAvLyBTZWNvbmQgcGhhc2VcclxuICAgIGlmICgyICogZDEgPT09IHUxICsgMSlcclxuICAgICAgZDEgPSAxIC0gZDE7XHJcbiAgICBpZiAoMiAqIGQyID09PSB1MiArIDEpXHJcbiAgICAgIGQyID0gMSAtIGQyO1xyXG4gICAgazEuaXVzaHJuKDEpO1xyXG4gICAgazIuaXVzaHJuKDEpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGpzZjtcclxufVxyXG51dGlscy5nZXRKU0YgPSBnZXRKU0Y7XHJcblxyXG5mdW5jdGlvbiBjYWNoZWRQcm9wZXJ0eShvYmosIG5hbWUsIGNvbXB1dGVyKSB7XHJcbiAgdmFyIGtleSA9ICdfJyArIG5hbWU7XHJcbiAgb2JqLnByb3RvdHlwZVtuYW1lXSA9IGZ1bmN0aW9uIGNhY2hlZFByb3BlcnR5KCkge1xyXG4gICAgcmV0dXJuIHRoaXNba2V5XSAhPT0gdW5kZWZpbmVkID8gdGhpc1trZXldIDpcclxuICAgICAgICAgICB0aGlzW2tleV0gPSBjb21wdXRlci5jYWxsKHRoaXMpO1xyXG4gIH07XHJcbn1cclxudXRpbHMuY2FjaGVkUHJvcGVydHkgPSBjYWNoZWRQcm9wZXJ0eTtcclxuXHJcbmZ1bmN0aW9uIHBhcnNlQnl0ZXMoYnl0ZXMpIHtcclxuICByZXR1cm4gdHlwZW9mIGJ5dGVzID09PSAnc3RyaW5nJyA/IHV0aWxzLnRvQXJyYXkoYnl0ZXMsICdoZXgnKSA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBieXRlcztcclxufVxyXG51dGlscy5wYXJzZUJ5dGVzID0gcGFyc2VCeXRlcztcclxuXHJcbmZ1bmN0aW9uIGludEZyb21MRShieXRlcykge1xyXG4gIHJldHVybiBuZXcgQk4oYnl0ZXMsICdoZXgnLCAnbGUnKTtcclxufVxyXG51dGlscy5pbnRGcm9tTEUgPSBpbnRGcm9tTEU7XHJcblxyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgY3VydmVzID0gZXhwb3J0cztcclxuXHJcbnZhciBoYXNoID0gcmVxdWlyZSgnaGFzaC5qcycpO1xyXG52YXIgZWxsaXB0aWMgPSByZXF1aXJlKCcuLi9lbGxpcHRpYycpO1xyXG5cclxudmFyIGFzc2VydCA9IGVsbGlwdGljLnV0aWxzLmFzc2VydDtcclxuXHJcbmZ1bmN0aW9uIFByZXNldEN1cnZlKG9wdGlvbnMpIHtcclxuICBpZiAob3B0aW9ucy50eXBlID09PSAnc2hvcnQnKVxyXG4gICAgdGhpcy5jdXJ2ZSA9IG5ldyBlbGxpcHRpYy5jdXJ2ZS5zaG9ydChvcHRpb25zKTtcclxuICBlbHNlIGlmIChvcHRpb25zLnR5cGUgPT09ICdlZHdhcmRzJylcclxuICAgIHRoaXMuY3VydmUgPSBuZXcgZWxsaXB0aWMuY3VydmUuZWR3YXJkcyhvcHRpb25zKTtcclxuICBlbHNlXHJcbiAgICB0aGlzLmN1cnZlID0gbmV3IGVsbGlwdGljLmN1cnZlLm1vbnQob3B0aW9ucyk7XHJcbiAgdGhpcy5nID0gdGhpcy5jdXJ2ZS5nO1xyXG4gIHRoaXMubiA9IHRoaXMuY3VydmUubjtcclxuICB0aGlzLmhhc2ggPSBvcHRpb25zLmhhc2g7XHJcblxyXG4gIGFzc2VydCh0aGlzLmcudmFsaWRhdGUoKSwgJ0ludmFsaWQgY3VydmUnKTtcclxuICBhc3NlcnQodGhpcy5nLm11bCh0aGlzLm4pLmlzSW5maW5pdHkoKSwgJ0ludmFsaWQgY3VydmUsIEcqTiAhPSBPJyk7XHJcbn1cclxuY3VydmVzLlByZXNldEN1cnZlID0gUHJlc2V0Q3VydmU7XHJcblxyXG5mdW5jdGlvbiBkZWZpbmVDdXJ2ZShuYW1lLCBvcHRpb25zKSB7XHJcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGN1cnZlcywgbmFtZSwge1xyXG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxyXG4gICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgIGdldDogZnVuY3Rpb24oKSB7XHJcbiAgICAgIHZhciBjdXJ2ZSA9IG5ldyBQcmVzZXRDdXJ2ZShvcHRpb25zKTtcclxuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGN1cnZlcywgbmFtZSwge1xyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcclxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgIHZhbHVlOiBjdXJ2ZVxyXG4gICAgICB9KTtcclxuICAgICAgcmV0dXJuIGN1cnZlO1xyXG4gICAgfVxyXG4gIH0pO1xyXG59XHJcblxyXG5kZWZpbmVDdXJ2ZSgncDE5MicsIHtcclxuICB0eXBlOiAnc2hvcnQnLFxyXG4gIHByaW1lOiAncDE5MicsXHJcbiAgcDogJ2ZmZmZmZmZmIGZmZmZmZmZmIGZmZmZmZmZmIGZmZmZmZmZlIGZmZmZmZmZmIGZmZmZmZmZmJyxcclxuICBhOiAnZmZmZmZmZmYgZmZmZmZmZmYgZmZmZmZmZmYgZmZmZmZmZmUgZmZmZmZmZmYgZmZmZmZmZmMnLFxyXG4gIGI6ICc2NDIxMDUxOSBlNTljODBlNyAwZmE3ZTlhYiA3MjI0MzA0OSBmZWI4ZGVlYyBjMTQ2YjliMScsXHJcbiAgbjogJ2ZmZmZmZmZmIGZmZmZmZmZmIGZmZmZmZmZmIDk5ZGVmODM2IDE0NmJjOWIxIGI0ZDIyODMxJyxcclxuICBoYXNoOiBoYXNoLnNoYTI1NixcclxuICBnUmVkOiBmYWxzZSxcclxuICBnOiBbXHJcbiAgICAnMTg4ZGE4MGUgYjAzMDkwZjYgN2NiZjIwZWIgNDNhMTg4MDAgZjRmZjBhZmQgODJmZjEwMTInLFxyXG4gICAgJzA3MTkyYjk1IGZmYzhkYTc4IDYzMTAxMWVkIDZiMjRjZGQ1IDczZjk3N2ExIDFlNzk0ODExJ1xyXG4gIF1cclxufSk7XHJcblxyXG5kZWZpbmVDdXJ2ZSgncDIyNCcsIHtcclxuICB0eXBlOiAnc2hvcnQnLFxyXG4gIHByaW1lOiAncDIyNCcsXHJcbiAgcDogJ2ZmZmZmZmZmIGZmZmZmZmZmIGZmZmZmZmZmIGZmZmZmZmZmIDAwMDAwMDAwIDAwMDAwMDAwIDAwMDAwMDAxJyxcclxuICBhOiAnZmZmZmZmZmYgZmZmZmZmZmYgZmZmZmZmZmYgZmZmZmZmZmUgZmZmZmZmZmYgZmZmZmZmZmYgZmZmZmZmZmUnLFxyXG4gIGI6ICdiNDA1MGE4NSAwYzA0YjNhYiBmNTQxMzI1NiA1MDQ0YjBiNyBkN2JmZDhiYSAyNzBiMzk0MyAyMzU1ZmZiNCcsXHJcbiAgbjogJ2ZmZmZmZmZmIGZmZmZmZmZmIGZmZmZmZmZmIGZmZmYxNmEyIGUwYjhmMDNlIDEzZGQyOTQ1IDVjNWMyYTNkJyxcclxuICBoYXNoOiBoYXNoLnNoYTI1NixcclxuICBnUmVkOiBmYWxzZSxcclxuICBnOiBbXHJcbiAgICAnYjcwZTBjYmQgNmJiNGJmN2YgMzIxMzkwYjkgNGEwM2MxZDMgNTZjMjExMjIgMzQzMjgwZDYgMTE1YzFkMjEnLFxyXG4gICAgJ2JkMzc2Mzg4IGI1ZjcyM2ZiIDRjMjJkZmU2IGNkNDM3NWEwIDVhMDc0NzY0IDQ0ZDU4MTk5IDg1MDA3ZTM0J1xyXG4gIF1cclxufSk7XHJcblxyXG5kZWZpbmVDdXJ2ZSgncDI1NicsIHtcclxuICB0eXBlOiAnc2hvcnQnLFxyXG4gIHByaW1lOiBudWxsLFxyXG4gIHA6ICdmZmZmZmZmZiAwMDAwMDAwMSAwMDAwMDAwMCAwMDAwMDAwMCAwMDAwMDAwMCBmZmZmZmZmZiBmZmZmZmZmZiBmZmZmZmZmZicsXHJcbiAgYTogJ2ZmZmZmZmZmIDAwMDAwMDAxIDAwMDAwMDAwIDAwMDAwMDAwIDAwMDAwMDAwIGZmZmZmZmZmIGZmZmZmZmZmIGZmZmZmZmZjJyxcclxuICBiOiAnNWFjNjM1ZDggYWEzYTkzZTcgYjNlYmJkNTUgNzY5ODg2YmMgNjUxZDA2YjAgY2M1M2IwZjYgM2JjZTNjM2UgMjdkMjYwNGInLFxyXG4gIG46ICdmZmZmZmZmZiAwMDAwMDAwMCBmZmZmZmZmZiBmZmZmZmZmZiBiY2U2ZmFhZCBhNzE3OWU4NCBmM2I5Y2FjMiBmYzYzMjU1MScsXHJcbiAgaGFzaDogaGFzaC5zaGEyNTYsXHJcbiAgZ1JlZDogZmFsc2UsXHJcbiAgZzogW1xyXG4gICAgJzZiMTdkMWYyIGUxMmM0MjQ3IGY4YmNlNmU1IDYzYTQ0MGYyIDc3MDM3ZDgxIDJkZWIzM2EwIGY0YTEzOTQ1IGQ4OThjMjk2JyxcclxuICAgICc0ZmUzNDJlMiBmZTFhN2Y5YiA4ZWU3ZWI0YSA3YzBmOWUxNiAyYmNlMzM1NyA2YjMxNWVjZSBjYmI2NDA2OCAzN2JmNTFmNSdcclxuICBdXHJcbn0pO1xyXG5cclxuZGVmaW5lQ3VydmUoJ3AzODQnLCB7XHJcbiAgdHlwZTogJ3Nob3J0JyxcclxuICBwcmltZTogbnVsbCxcclxuICBwOiAnZmZmZmZmZmYgZmZmZmZmZmYgZmZmZmZmZmYgZmZmZmZmZmYgZmZmZmZmZmYgZmZmZmZmZmYgZmZmZmZmZmYgJyArXHJcbiAgICAgJ2ZmZmZmZmZlIGZmZmZmZmZmIDAwMDAwMDAwIDAwMDAwMDAwIGZmZmZmZmZmJyxcclxuICBhOiAnZmZmZmZmZmYgZmZmZmZmZmYgZmZmZmZmZmYgZmZmZmZmZmYgZmZmZmZmZmYgZmZmZmZmZmYgZmZmZmZmZmYgJyArXHJcbiAgICAgJ2ZmZmZmZmZlIGZmZmZmZmZmIDAwMDAwMDAwIDAwMDAwMDAwIGZmZmZmZmZjJyxcclxuICBiOiAnYjMzMTJmYTcgZTIzZWU3ZTQgOTg4ZTA1NmIgZTNmODJkMTkgMTgxZDljNmUgZmU4MTQxMTIgMDMxNDA4OGYgJyArXHJcbiAgICAgJzUwMTM4NzVhIGM2NTYzOThkIDhhMmVkMTlkIDJhODVjOGVkIGQzZWMyYWVmJyxcclxuICBuOiAnZmZmZmZmZmYgZmZmZmZmZmYgZmZmZmZmZmYgZmZmZmZmZmYgZmZmZmZmZmYgZmZmZmZmZmYgYzc2MzRkODEgJyArXHJcbiAgICAgJ2Y0MzcyZGRmIDU4MWEwZGIyIDQ4YjBhNzdhIGVjZWMxOTZhIGNjYzUyOTczJyxcclxuICBoYXNoOiBoYXNoLnNoYTM4NCxcclxuICBnUmVkOiBmYWxzZSxcclxuICBnOiBbXHJcbiAgICAnYWE4N2NhMjIgYmU4YjA1MzcgOGViMWM3MWUgZjMyMGFkNzQgNmUxZDNiNjIgOGJhNzliOTggNTlmNzQxZTAgODI1NDJhMzggJyArXHJcbiAgICAnNTUwMmYyNWQgYmY1NTI5NmMgM2E1NDVlMzggNzI3NjBhYjcnLFxyXG4gICAgJzM2MTdkZTRhIDk2MjYyYzZmIDVkOWU5OGJmIDkyOTJkYzI5IGY4ZjQxZGJkIDI4OWExNDdjIGU5ZGEzMTEzIGI1ZjBiOGMwICcgK1xyXG4gICAgJzBhNjBiMWNlIDFkN2U4MTlkIDdhNDMxZDdjIDkwZWEwZTVmJ1xyXG4gIF1cclxufSk7XHJcblxyXG5kZWZpbmVDdXJ2ZSgncDUyMScsIHtcclxuICB0eXBlOiAnc2hvcnQnLFxyXG4gIHByaW1lOiBudWxsLFxyXG4gIHA6ICcwMDAwMDFmZiBmZmZmZmZmZiBmZmZmZmZmZiBmZmZmZmZmZiBmZmZmZmZmZiBmZmZmZmZmZiAnICtcclxuICAgICAnZmZmZmZmZmYgZmZmZmZmZmYgZmZmZmZmZmYgZmZmZmZmZmYgZmZmZmZmZmYgZmZmZmZmZmYgJyArXHJcbiAgICAgJ2ZmZmZmZmZmIGZmZmZmZmZmIGZmZmZmZmZmIGZmZmZmZmZmIGZmZmZmZmZmJyxcclxuICBhOiAnMDAwMDAxZmYgZmZmZmZmZmYgZmZmZmZmZmYgZmZmZmZmZmYgZmZmZmZmZmYgZmZmZmZmZmYgJyArXHJcbiAgICAgJ2ZmZmZmZmZmIGZmZmZmZmZmIGZmZmZmZmZmIGZmZmZmZmZmIGZmZmZmZmZmIGZmZmZmZmZmICcgK1xyXG4gICAgICdmZmZmZmZmZiBmZmZmZmZmZiBmZmZmZmZmZiBmZmZmZmZmZiBmZmZmZmZmYycsXHJcbiAgYjogJzAwMDAwMDUxIDk1M2ViOTYxIDhlMWM5YTFmIDkyOWEyMWEwIGI2ODU0MGVlIGEyZGE3MjViICcgK1xyXG4gICAgICc5OWIzMTVmMyBiOGI0ODk5MSA4ZWYxMDllMSA1NjE5Mzk1MSBlYzdlOTM3YiAxNjUyYzBiZCAnICtcclxuICAgICAnM2JiMWJmMDcgMzU3M2RmODggM2QyYzM0ZjEgZWY0NTFmZDQgNmI1MDNmMDAnLFxyXG4gIG46ICcwMDAwMDFmZiBmZmZmZmZmZiBmZmZmZmZmZiBmZmZmZmZmZiBmZmZmZmZmZiBmZmZmZmZmZiAnICtcclxuICAgICAnZmZmZmZmZmYgZmZmZmZmZmYgZmZmZmZmZmEgNTE4Njg3ODMgYmYyZjk2NmIgN2ZjYzAxNDggJyArXHJcbiAgICAgJ2Y3MDlhNWQwIDNiYjVjOWI4IDg5OWM0N2FlIGJiNmZiNzFlIDkxMzg2NDA5JyxcclxuICBoYXNoOiBoYXNoLnNoYTUxMixcclxuICBnUmVkOiBmYWxzZSxcclxuICBnOiBbXHJcbiAgICAnMDAwMDAwYzYgODU4ZTA2YjcgMDQwNGU5Y2QgOWUzZWNiNjYgMjM5NWI0NDIgOWM2NDgxMzkgJyArXHJcbiAgICAnMDUzZmI1MjEgZjgyOGFmNjAgNmI0ZDNkYmEgYTE0YjVlNzcgZWZlNzU5MjggZmUxZGMxMjcgJyArXHJcbiAgICAnYTJmZmE4ZGUgMzM0OGIzYzEgODU2YTQyOWIgZjk3ZTdlMzEgYzJlNWJkNjYnLFxyXG4gICAgJzAwMDAwMTE4IDM5Mjk2YTc4IDlhM2JjMDA0IDVjOGE1ZmI0IDJjN2QxYmQ5IDk4ZjU0NDQ5ICcgK1xyXG4gICAgJzU3OWI0NDY4IDE3YWZiZDE3IDI3M2U2NjJjIDk3ZWU3Mjk5IDVlZjQyNjQwIGM1NTBiOTAxICcgK1xyXG4gICAgJzNmYWQwNzYxIDM1M2M3MDg2IGEyNzJjMjQwIDg4YmU5NDc2IDlmZDE2NjUwJ1xyXG4gIF1cclxufSk7XHJcblxyXG5kZWZpbmVDdXJ2ZSgnY3VydmUyNTUxOScsIHtcclxuICB0eXBlOiAnbW9udCcsXHJcbiAgcHJpbWU6ICdwMjU1MTknLFxyXG4gIHA6ICc3ZmZmZmZmZmZmZmZmZmZmIGZmZmZmZmZmZmZmZmZmZmYgZmZmZmZmZmZmZmZmZmZmZiBmZmZmZmZmZmZmZmZmZmVkJyxcclxuICBhOiAnNzZkMDYnLFxyXG4gIGI6ICcxJyxcclxuICBuOiAnMTAwMDAwMDAwMDAwMDAwMCAwMDAwMDAwMDAwMDAwMDAwIDE0ZGVmOWRlYTJmNzljZDYgNTgxMjYzMWE1Y2Y1ZDNlZCcsXHJcbiAgaGFzaDogaGFzaC5zaGEyNTYsXHJcbiAgZ1JlZDogZmFsc2UsXHJcbiAgZzogW1xyXG4gICAgJzknXHJcbiAgXVxyXG59KTtcclxuXHJcbmRlZmluZUN1cnZlKCdlZDI1NTE5Jywge1xyXG4gIHR5cGU6ICdlZHdhcmRzJyxcclxuICBwcmltZTogJ3AyNTUxOScsXHJcbiAgcDogJzdmZmZmZmZmZmZmZmZmZmYgZmZmZmZmZmZmZmZmZmZmZiBmZmZmZmZmZmZmZmZmZmZmIGZmZmZmZmZmZmZmZmZmZWQnLFxyXG4gIGE6ICctMScsXHJcbiAgYzogJzEnLFxyXG4gIC8vIC0xMjE2NjUgKiAoMTIxNjY2XigtMSkpIChtb2QgUClcclxuICBkOiAnNTIwMzZjZWUyYjZmZmU3MyA4Y2M3NDA3OTc3NzllODk4IDAwNzAwYTRkNDE0MWQ4YWIgNzVlYjRkY2ExMzU5NzhhMycsXHJcbiAgbjogJzEwMDAwMDAwMDAwMDAwMDAgMDAwMDAwMDAwMDAwMDAwMCAxNGRlZjlkZWEyZjc5Y2Q2IDU4MTI2MzFhNWNmNWQzZWQnLFxyXG4gIGhhc2g6IGhhc2guc2hhMjU2LFxyXG4gIGdSZWQ6IGZhbHNlLFxyXG4gIGc6IFtcclxuICAgICcyMTY5MzZkM2NkNmU1M2ZlYzBhNGUyMzFmZGQ2ZGM1YzY5MmNjNzYwOTUyNWE3YjJjOTU2MmQ2MDhmMjVkNTFhJyxcclxuXHJcbiAgICAvLyA0LzVcclxuICAgICc2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjU4J1xyXG4gIF1cclxufSk7XHJcblxyXG52YXIgcHJlO1xyXG50cnkge1xyXG4gIHByZSA9IHJlcXVpcmUoJy4vcHJlY29tcHV0ZWQvc2VjcDI1NmsxJyk7XHJcbn0gY2F0Y2ggKGUpIHtcclxuICBwcmUgPSB1bmRlZmluZWQ7XHJcbn1cclxuXHJcbmRlZmluZUN1cnZlKCdzZWNwMjU2azEnLCB7XHJcbiAgdHlwZTogJ3Nob3J0JyxcclxuICBwcmltZTogJ2syNTYnLFxyXG4gIHA6ICdmZmZmZmZmZiBmZmZmZmZmZiBmZmZmZmZmZiBmZmZmZmZmZiBmZmZmZmZmZiBmZmZmZmZmZiBmZmZmZmZmZSBmZmZmZmMyZicsXHJcbiAgYTogJzAnLFxyXG4gIGI6ICc3JyxcclxuICBuOiAnZmZmZmZmZmYgZmZmZmZmZmYgZmZmZmZmZmYgZmZmZmZmZmUgYmFhZWRjZTYgYWY0OGEwM2IgYmZkMjVlOGMgZDAzNjQxNDEnLFxyXG4gIGg6ICcxJyxcclxuICBoYXNoOiBoYXNoLnNoYTI1NixcclxuXHJcbiAgLy8gUHJlY29tcHV0ZWQgZW5kb21vcnBoaXNtXHJcbiAgYmV0YTogJzdhZTk2YTJiNjU3YzA3MTA2ZTY0NDc5ZWFjMzQzNGU5OWNmMDQ5NzUxMmY1ODk5NWMxMzk2YzI4NzE5NTAxZWUnLFxyXG4gIGxhbWJkYTogJzUzNjNhZDRjYzA1YzMwZTBhNTI2MWMwMjg4MTI2NDVhMTIyZTIyZWEyMDgxNjY3OGRmMDI5NjdjMWIyM2JkNzInLFxyXG4gIGJhc2lzOiBbXHJcbiAgICB7XHJcbiAgICAgIGE6ICczMDg2ZDIyMWE3ZDQ2YmNkZTg2YzkwZTQ5Mjg0ZWIxNScsXHJcbiAgICAgIGI6ICctZTQ0MzdlZDYwMTBlODgyODZmNTQ3ZmE5MGFiZmU0YzMnXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBhOiAnMTE0Y2E1MGY3YThlMmYzZjY1N2MxMTA4ZDlkNDRjZmQ4JyxcclxuICAgICAgYjogJzMwODZkMjIxYTdkNDZiY2RlODZjOTBlNDkyODRlYjE1J1xyXG4gICAgfVxyXG4gIF0sXHJcblxyXG4gIGdSZWQ6IGZhbHNlLFxyXG4gIGc6IFtcclxuICAgICc3OWJlNjY3ZWY5ZGNiYmFjNTVhMDYyOTVjZTg3MGIwNzAyOWJmY2RiMmRjZTI4ZDk1OWYyODE1YjE2ZjgxNzk4JyxcclxuICAgICc0ODNhZGE3NzI2YTNjNDY1NWRhNGZiZmMwZTExMDhhOGZkMTdiNDQ4YTY4NTU0MTk5YzQ3ZDA4ZmZiMTBkNGI4JyxcclxuICAgIHByZVxyXG4gIF1cclxufSk7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBjdXJ2ZSA9IHJlcXVpcmUoJy4uL2N1cnZlJyk7XHJcbnZhciBlbGxpcHRpYyA9IHJlcXVpcmUoJy4uLy4uL2VsbGlwdGljJyk7XHJcbnZhciBCTiA9IHJlcXVpcmUoJ2JuLmpzJyk7XHJcbnZhciBpbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJyk7XHJcbnZhciBCYXNlID0gY3VydmUuYmFzZTtcclxuXHJcbnZhciBhc3NlcnQgPSBlbGxpcHRpYy51dGlscy5hc3NlcnQ7XHJcblxyXG5mdW5jdGlvbiBTaG9ydEN1cnZlKGNvbmYpIHtcclxuICBCYXNlLmNhbGwodGhpcywgJ3Nob3J0JywgY29uZik7XHJcblxyXG4gIHRoaXMuYSA9IG5ldyBCTihjb25mLmEsIDE2KS50b1JlZCh0aGlzLnJlZCk7XHJcbiAgdGhpcy5iID0gbmV3IEJOKGNvbmYuYiwgMTYpLnRvUmVkKHRoaXMucmVkKTtcclxuICB0aGlzLnRpbnYgPSB0aGlzLnR3by5yZWRJbnZtKCk7XHJcblxyXG4gIHRoaXMuemVyb0EgPSB0aGlzLmEuZnJvbVJlZCgpLmNtcG4oMCkgPT09IDA7XHJcbiAgdGhpcy50aHJlZUEgPSB0aGlzLmEuZnJvbVJlZCgpLnN1Yih0aGlzLnApLmNtcG4oLTMpID09PSAwO1xyXG5cclxuICAvLyBJZiB0aGUgY3VydmUgaXMgZW5kb21vcnBoaWMsIHByZWNhbGN1bGF0ZSBiZXRhIGFuZCBsYW1iZGFcclxuICB0aGlzLmVuZG8gPSB0aGlzLl9nZXRFbmRvbW9ycGhpc20oY29uZik7XHJcbiAgdGhpcy5fZW5kb1duYWZUMSA9IG5ldyBBcnJheSg0KTtcclxuICB0aGlzLl9lbmRvV25hZlQyID0gbmV3IEFycmF5KDQpO1xyXG59XHJcbmluaGVyaXRzKFNob3J0Q3VydmUsIEJhc2UpO1xyXG5tb2R1bGUuZXhwb3J0cyA9IFNob3J0Q3VydmU7XHJcblxyXG5TaG9ydEN1cnZlLnByb3RvdHlwZS5fZ2V0RW5kb21vcnBoaXNtID0gZnVuY3Rpb24gX2dldEVuZG9tb3JwaGlzbShjb25mKSB7XHJcbiAgLy8gTm8gZWZmaWNpZW50IGVuZG9tb3JwaGlzbVxyXG4gIGlmICghdGhpcy56ZXJvQSB8fCAhdGhpcy5nIHx8ICF0aGlzLm4gfHwgdGhpcy5wLm1vZG4oMykgIT09IDEpXHJcbiAgICByZXR1cm47XHJcblxyXG4gIC8vIENvbXB1dGUgYmV0YSBhbmQgbGFtYmRhLCB0aGF0IGxhbWJkYSAqIFAgPSAoYmV0YSAqIFB4OyBQeSlcclxuICB2YXIgYmV0YTtcclxuICB2YXIgbGFtYmRhO1xyXG4gIGlmIChjb25mLmJldGEpIHtcclxuICAgIGJldGEgPSBuZXcgQk4oY29uZi5iZXRhLCAxNikudG9SZWQodGhpcy5yZWQpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICB2YXIgYmV0YXMgPSB0aGlzLl9nZXRFbmRvUm9vdHModGhpcy5wKTtcclxuICAgIC8vIENob29zZSB0aGUgc21hbGxlc3QgYmV0YVxyXG4gICAgYmV0YSA9IGJldGFzWzBdLmNtcChiZXRhc1sxXSkgPCAwID8gYmV0YXNbMF0gOiBiZXRhc1sxXTtcclxuICAgIGJldGEgPSBiZXRhLnRvUmVkKHRoaXMucmVkKTtcclxuICB9XHJcbiAgaWYgKGNvbmYubGFtYmRhKSB7XHJcbiAgICBsYW1iZGEgPSBuZXcgQk4oY29uZi5sYW1iZGEsIDE2KTtcclxuICB9IGVsc2Uge1xyXG4gICAgLy8gQ2hvb3NlIHRoZSBsYW1iZGEgdGhhdCBpcyBtYXRjaGluZyBzZWxlY3RlZCBiZXRhXHJcbiAgICB2YXIgbGFtYmRhcyA9IHRoaXMuX2dldEVuZG9Sb290cyh0aGlzLm4pO1xyXG4gICAgaWYgKHRoaXMuZy5tdWwobGFtYmRhc1swXSkueC5jbXAodGhpcy5nLngucmVkTXVsKGJldGEpKSA9PT0gMCkge1xyXG4gICAgICBsYW1iZGEgPSBsYW1iZGFzWzBdO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgbGFtYmRhID0gbGFtYmRhc1sxXTtcclxuICAgICAgYXNzZXJ0KHRoaXMuZy5tdWwobGFtYmRhKS54LmNtcCh0aGlzLmcueC5yZWRNdWwoYmV0YSkpID09PSAwKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIEdldCBiYXNpcyB2ZWN0b3JzLCB1c2VkIGZvciBiYWxhbmNlZCBsZW5ndGgtdHdvIHJlcHJlc2VudGF0aW9uXHJcbiAgdmFyIGJhc2lzO1xyXG4gIGlmIChjb25mLmJhc2lzKSB7XHJcbiAgICBiYXNpcyA9IGNvbmYuYmFzaXMubWFwKGZ1bmN0aW9uKHZlYykge1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIGE6IG5ldyBCTih2ZWMuYSwgMTYpLFxyXG4gICAgICAgIGI6IG5ldyBCTih2ZWMuYiwgMTYpXHJcbiAgICAgIH07XHJcbiAgICB9KTtcclxuICB9IGVsc2Uge1xyXG4gICAgYmFzaXMgPSB0aGlzLl9nZXRFbmRvQmFzaXMobGFtYmRhKTtcclxuICB9XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBiZXRhOiBiZXRhLFxyXG4gICAgbGFtYmRhOiBsYW1iZGEsXHJcbiAgICBiYXNpczogYmFzaXNcclxuICB9O1xyXG59O1xyXG5cclxuU2hvcnRDdXJ2ZS5wcm90b3R5cGUuX2dldEVuZG9Sb290cyA9IGZ1bmN0aW9uIF9nZXRFbmRvUm9vdHMobnVtKSB7XHJcbiAgLy8gRmluZCByb290cyBvZiBmb3IgeF4yICsgeCArIDEgaW4gRlxyXG4gIC8vIFJvb3QgPSAoLTEgKy0gU3FydCgtMykpIC8gMlxyXG4gIC8vXHJcbiAgdmFyIHJlZCA9IG51bSA9PT0gdGhpcy5wID8gdGhpcy5yZWQgOiBCTi5tb250KG51bSk7XHJcbiAgdmFyIHRpbnYgPSBuZXcgQk4oMikudG9SZWQocmVkKS5yZWRJbnZtKCk7XHJcbiAgdmFyIG50aW52ID0gdGludi5yZWROZWcoKTtcclxuXHJcbiAgdmFyIHMgPSBuZXcgQk4oMykudG9SZWQocmVkKS5yZWROZWcoKS5yZWRTcXJ0KCkucmVkTXVsKHRpbnYpO1xyXG5cclxuICB2YXIgbDEgPSBudGludi5yZWRBZGQocykuZnJvbVJlZCgpO1xyXG4gIHZhciBsMiA9IG50aW52LnJlZFN1YihzKS5mcm9tUmVkKCk7XHJcbiAgcmV0dXJuIFsgbDEsIGwyIF07XHJcbn07XHJcblxyXG5TaG9ydEN1cnZlLnByb3RvdHlwZS5fZ2V0RW5kb0Jhc2lzID0gZnVuY3Rpb24gX2dldEVuZG9CYXNpcyhsYW1iZGEpIHtcclxuICAvLyBhcHJ4U3FydCA+PSBzcXJ0KHRoaXMubilcclxuICB2YXIgYXByeFNxcnQgPSB0aGlzLm4udXNocm4oTWF0aC5mbG9vcih0aGlzLm4uYml0TGVuZ3RoKCkgLyAyKSk7XHJcblxyXG4gIC8vIDMuNzRcclxuICAvLyBSdW4gRUdDRCwgdW50aWwgcihMICsgMSkgPCBhcHJ4U3FydFxyXG4gIHZhciB1ID0gbGFtYmRhO1xyXG4gIHZhciB2ID0gdGhpcy5uLmNsb25lKCk7XHJcbiAgdmFyIHgxID0gbmV3IEJOKDEpO1xyXG4gIHZhciB5MSA9IG5ldyBCTigwKTtcclxuICB2YXIgeDIgPSBuZXcgQk4oMCk7XHJcbiAgdmFyIHkyID0gbmV3IEJOKDEpO1xyXG5cclxuICAvLyBOT1RFOiBhbGwgdmVjdG9ycyBhcmUgcm9vdHMgb2Y6IGEgKyBiICogbGFtYmRhID0gMCAobW9kIG4pXHJcbiAgdmFyIGEwO1xyXG4gIHZhciBiMDtcclxuICAvLyBGaXJzdCB2ZWN0b3JcclxuICB2YXIgYTE7XHJcbiAgdmFyIGIxO1xyXG4gIC8vIFNlY29uZCB2ZWN0b3JcclxuICB2YXIgYTI7XHJcbiAgdmFyIGIyO1xyXG5cclxuICB2YXIgcHJldlI7XHJcbiAgdmFyIGkgPSAwO1xyXG4gIHZhciByO1xyXG4gIHZhciB4O1xyXG4gIHdoaWxlICh1LmNtcG4oMCkgIT09IDApIHtcclxuICAgIHZhciBxID0gdi5kaXYodSk7XHJcbiAgICByID0gdi5zdWIocS5tdWwodSkpO1xyXG4gICAgeCA9IHgyLnN1YihxLm11bCh4MSkpO1xyXG4gICAgdmFyIHkgPSB5Mi5zdWIocS5tdWwoeTEpKTtcclxuXHJcbiAgICBpZiAoIWExICYmIHIuY21wKGFwcnhTcXJ0KSA8IDApIHtcclxuICAgICAgYTAgPSBwcmV2Ui5uZWcoKTtcclxuICAgICAgYjAgPSB4MTtcclxuICAgICAgYTEgPSByLm5lZygpO1xyXG4gICAgICBiMSA9IHg7XHJcbiAgICB9IGVsc2UgaWYgKGExICYmICsraSA9PT0gMikge1xyXG4gICAgICBicmVhaztcclxuICAgIH1cclxuICAgIHByZXZSID0gcjtcclxuXHJcbiAgICB2ID0gdTtcclxuICAgIHUgPSByO1xyXG4gICAgeDIgPSB4MTtcclxuICAgIHgxID0geDtcclxuICAgIHkyID0geTE7XHJcbiAgICB5MSA9IHk7XHJcbiAgfVxyXG4gIGEyID0gci5uZWcoKTtcclxuICBiMiA9IHg7XHJcblxyXG4gIHZhciBsZW4xID0gYTEuc3FyKCkuYWRkKGIxLnNxcigpKTtcclxuICB2YXIgbGVuMiA9IGEyLnNxcigpLmFkZChiMi5zcXIoKSk7XHJcbiAgaWYgKGxlbjIuY21wKGxlbjEpID49IDApIHtcclxuICAgIGEyID0gYTA7XHJcbiAgICBiMiA9IGIwO1xyXG4gIH1cclxuXHJcbiAgLy8gTm9ybWFsaXplIHNpZ25zXHJcbiAgaWYgKGExLm5lZ2F0aXZlKSB7XHJcbiAgICBhMSA9IGExLm5lZygpO1xyXG4gICAgYjEgPSBiMS5uZWcoKTtcclxuICB9XHJcbiAgaWYgKGEyLm5lZ2F0aXZlKSB7XHJcbiAgICBhMiA9IGEyLm5lZygpO1xyXG4gICAgYjIgPSBiMi5uZWcoKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBbXHJcbiAgICB7IGE6IGExLCBiOiBiMSB9LFxyXG4gICAgeyBhOiBhMiwgYjogYjIgfVxyXG4gIF07XHJcbn07XHJcblxyXG5TaG9ydEN1cnZlLnByb3RvdHlwZS5fZW5kb1NwbGl0ID0gZnVuY3Rpb24gX2VuZG9TcGxpdChrKSB7XHJcbiAgdmFyIGJhc2lzID0gdGhpcy5lbmRvLmJhc2lzO1xyXG4gIHZhciB2MSA9IGJhc2lzWzBdO1xyXG4gIHZhciB2MiA9IGJhc2lzWzFdO1xyXG5cclxuICB2YXIgYzEgPSB2Mi5iLm11bChrKS5kaXZSb3VuZCh0aGlzLm4pO1xyXG4gIHZhciBjMiA9IHYxLmIubmVnKCkubXVsKGspLmRpdlJvdW5kKHRoaXMubik7XHJcblxyXG4gIHZhciBwMSA9IGMxLm11bCh2MS5hKTtcclxuICB2YXIgcDIgPSBjMi5tdWwodjIuYSk7XHJcbiAgdmFyIHExID0gYzEubXVsKHYxLmIpO1xyXG4gIHZhciBxMiA9IGMyLm11bCh2Mi5iKTtcclxuXHJcbiAgLy8gQ2FsY3VsYXRlIGFuc3dlclxyXG4gIHZhciBrMSA9IGsuc3ViKHAxKS5zdWIocDIpO1xyXG4gIHZhciBrMiA9IHExLmFkZChxMikubmVnKCk7XHJcbiAgcmV0dXJuIHsgazE6IGsxLCBrMjogazIgfTtcclxufTtcclxuXHJcblNob3J0Q3VydmUucHJvdG90eXBlLnBvaW50RnJvbVggPSBmdW5jdGlvbiBwb2ludEZyb21YKHgsIG9kZCkge1xyXG4gIHggPSBuZXcgQk4oeCwgMTYpO1xyXG4gIGlmICgheC5yZWQpXHJcbiAgICB4ID0geC50b1JlZCh0aGlzLnJlZCk7XHJcblxyXG4gIHZhciB5MiA9IHgucmVkU3FyKCkucmVkTXVsKHgpLnJlZElBZGQoeC5yZWRNdWwodGhpcy5hKSkucmVkSUFkZCh0aGlzLmIpO1xyXG4gIHZhciB5ID0geTIucmVkU3FydCgpO1xyXG4gIGlmICh5LnJlZFNxcigpLnJlZFN1Yih5MikuY21wKHRoaXMuemVybykgIT09IDApXHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgcG9pbnQnKTtcclxuXHJcbiAgLy8gWFhYIElzIHRoZXJlIGFueSB3YXkgdG8gdGVsbCBpZiB0aGUgbnVtYmVyIGlzIG9kZCB3aXRob3V0IGNvbnZlcnRpbmcgaXRcclxuICAvLyB0byBub24tcmVkIGZvcm0/XHJcbiAgdmFyIGlzT2RkID0geS5mcm9tUmVkKCkuaXNPZGQoKTtcclxuICBpZiAob2RkICYmICFpc09kZCB8fCAhb2RkICYmIGlzT2RkKVxyXG4gICAgeSA9IHkucmVkTmVnKCk7XHJcblxyXG4gIHJldHVybiB0aGlzLnBvaW50KHgsIHkpO1xyXG59O1xyXG5cclxuU2hvcnRDdXJ2ZS5wcm90b3R5cGUudmFsaWRhdGUgPSBmdW5jdGlvbiB2YWxpZGF0ZShwb2ludCkge1xyXG4gIGlmIChwb2ludC5pbmYpXHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuXHJcbiAgdmFyIHggPSBwb2ludC54O1xyXG4gIHZhciB5ID0gcG9pbnQueTtcclxuXHJcbiAgdmFyIGF4ID0gdGhpcy5hLnJlZE11bCh4KTtcclxuICB2YXIgcmhzID0geC5yZWRTcXIoKS5yZWRNdWwoeCkucmVkSUFkZChheCkucmVkSUFkZCh0aGlzLmIpO1xyXG4gIHJldHVybiB5LnJlZFNxcigpLnJlZElTdWIocmhzKS5jbXBuKDApID09PSAwO1xyXG59O1xyXG5cclxuU2hvcnRDdXJ2ZS5wcm90b3R5cGUuX2VuZG9XbmFmTXVsQWRkID1cclxuICAgIGZ1bmN0aW9uIF9lbmRvV25hZk11bEFkZChwb2ludHMsIGNvZWZmcywgamFjb2JpYW5SZXN1bHQpIHtcclxuICB2YXIgbnBvaW50cyA9IHRoaXMuX2VuZG9XbmFmVDE7XHJcbiAgdmFyIG5jb2VmZnMgPSB0aGlzLl9lbmRvV25hZlQyO1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgcG9pbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICB2YXIgc3BsaXQgPSB0aGlzLl9lbmRvU3BsaXQoY29lZmZzW2ldKTtcclxuICAgIHZhciBwID0gcG9pbnRzW2ldO1xyXG4gICAgdmFyIGJldGEgPSBwLl9nZXRCZXRhKCk7XHJcblxyXG4gICAgaWYgKHNwbGl0LmsxLm5lZ2F0aXZlKSB7XHJcbiAgICAgIHNwbGl0LmsxLmluZWcoKTtcclxuICAgICAgcCA9IHAubmVnKHRydWUpO1xyXG4gICAgfVxyXG4gICAgaWYgKHNwbGl0LmsyLm5lZ2F0aXZlKSB7XHJcbiAgICAgIHNwbGl0LmsyLmluZWcoKTtcclxuICAgICAgYmV0YSA9IGJldGEubmVnKHRydWUpO1xyXG4gICAgfVxyXG5cclxuICAgIG5wb2ludHNbaSAqIDJdID0gcDtcclxuICAgIG5wb2ludHNbaSAqIDIgKyAxXSA9IGJldGE7XHJcbiAgICBuY29lZmZzW2kgKiAyXSA9IHNwbGl0LmsxO1xyXG4gICAgbmNvZWZmc1tpICogMiArIDFdID0gc3BsaXQuazI7XHJcbiAgfVxyXG4gIHZhciByZXMgPSB0aGlzLl93bmFmTXVsQWRkKDEsIG5wb2ludHMsIG5jb2VmZnMsIGkgKiAyLCBqYWNvYmlhblJlc3VsdCk7XHJcblxyXG4gIC8vIENsZWFuLXVwIHJlZmVyZW5jZXMgdG8gcG9pbnRzIGFuZCBjb2VmZmljaWVudHNcclxuICBmb3IgKHZhciBqID0gMDsgaiA8IGkgKiAyOyBqKyspIHtcclxuICAgIG5wb2ludHNbal0gPSBudWxsO1xyXG4gICAgbmNvZWZmc1tqXSA9IG51bGw7XHJcbiAgfVxyXG4gIHJldHVybiByZXM7XHJcbn07XHJcblxyXG5mdW5jdGlvbiBQb2ludChjdXJ2ZSwgeCwgeSwgaXNSZWQpIHtcclxuICBCYXNlLkJhc2VQb2ludC5jYWxsKHRoaXMsIGN1cnZlLCAnYWZmaW5lJyk7XHJcbiAgaWYgKHggPT09IG51bGwgJiYgeSA9PT0gbnVsbCkge1xyXG4gICAgdGhpcy54ID0gbnVsbDtcclxuICAgIHRoaXMueSA9IG51bGw7XHJcbiAgICB0aGlzLmluZiA9IHRydWU7XHJcbiAgfSBlbHNlIHtcclxuICAgIHRoaXMueCA9IG5ldyBCTih4LCAxNik7XHJcbiAgICB0aGlzLnkgPSBuZXcgQk4oeSwgMTYpO1xyXG4gICAgLy8gRm9yY2UgcmVkZ29tZXJ5IHJlcHJlc2VudGF0aW9uIHdoZW4gbG9hZGluZyBmcm9tIEpTT05cclxuICAgIGlmIChpc1JlZCkge1xyXG4gICAgICB0aGlzLnguZm9yY2VSZWQodGhpcy5jdXJ2ZS5yZWQpO1xyXG4gICAgICB0aGlzLnkuZm9yY2VSZWQodGhpcy5jdXJ2ZS5yZWQpO1xyXG4gICAgfVxyXG4gICAgaWYgKCF0aGlzLngucmVkKVxyXG4gICAgICB0aGlzLnggPSB0aGlzLngudG9SZWQodGhpcy5jdXJ2ZS5yZWQpO1xyXG4gICAgaWYgKCF0aGlzLnkucmVkKVxyXG4gICAgICB0aGlzLnkgPSB0aGlzLnkudG9SZWQodGhpcy5jdXJ2ZS5yZWQpO1xyXG4gICAgdGhpcy5pbmYgPSBmYWxzZTtcclxuICB9XHJcbn1cclxuaW5oZXJpdHMoUG9pbnQsIEJhc2UuQmFzZVBvaW50KTtcclxuXHJcblNob3J0Q3VydmUucHJvdG90eXBlLnBvaW50ID0gZnVuY3Rpb24gcG9pbnQoeCwgeSwgaXNSZWQpIHtcclxuICByZXR1cm4gbmV3IFBvaW50KHRoaXMsIHgsIHksIGlzUmVkKTtcclxufTtcclxuXHJcblNob3J0Q3VydmUucHJvdG90eXBlLnBvaW50RnJvbUpTT04gPSBmdW5jdGlvbiBwb2ludEZyb21KU09OKG9iaiwgcmVkKSB7XHJcbiAgcmV0dXJuIFBvaW50LmZyb21KU09OKHRoaXMsIG9iaiwgcmVkKTtcclxufTtcclxuXHJcblBvaW50LnByb3RvdHlwZS5fZ2V0QmV0YSA9IGZ1bmN0aW9uIF9nZXRCZXRhKCkge1xyXG4gIGlmICghdGhpcy5jdXJ2ZS5lbmRvKVxyXG4gICAgcmV0dXJuO1xyXG5cclxuICB2YXIgcHJlID0gdGhpcy5wcmVjb21wdXRlZDtcclxuICBpZiAocHJlICYmIHByZS5iZXRhKVxyXG4gICAgcmV0dXJuIHByZS5iZXRhO1xyXG5cclxuICB2YXIgYmV0YSA9IHRoaXMuY3VydmUucG9pbnQodGhpcy54LnJlZE11bCh0aGlzLmN1cnZlLmVuZG8uYmV0YSksIHRoaXMueSk7XHJcbiAgaWYgKHByZSkge1xyXG4gICAgdmFyIGN1cnZlID0gdGhpcy5jdXJ2ZTtcclxuICAgIHZhciBlbmRvTXVsID0gZnVuY3Rpb24ocCkge1xyXG4gICAgICByZXR1cm4gY3VydmUucG9pbnQocC54LnJlZE11bChjdXJ2ZS5lbmRvLmJldGEpLCBwLnkpO1xyXG4gICAgfTtcclxuICAgIHByZS5iZXRhID0gYmV0YTtcclxuICAgIGJldGEucHJlY29tcHV0ZWQgPSB7XHJcbiAgICAgIGJldGE6IG51bGwsXHJcbiAgICAgIG5hZjogcHJlLm5hZiAmJiB7XHJcbiAgICAgICAgd25kOiBwcmUubmFmLnduZCxcclxuICAgICAgICBwb2ludHM6IHByZS5uYWYucG9pbnRzLm1hcChlbmRvTXVsKVxyXG4gICAgICB9LFxyXG4gICAgICBkb3VibGVzOiBwcmUuZG91YmxlcyAmJiB7XHJcbiAgICAgICAgc3RlcDogcHJlLmRvdWJsZXMuc3RlcCxcclxuICAgICAgICBwb2ludHM6IHByZS5kb3VibGVzLnBvaW50cy5tYXAoZW5kb011bClcclxuICAgICAgfVxyXG4gICAgfTtcclxuICB9XHJcbiAgcmV0dXJuIGJldGE7XHJcbn07XHJcblxyXG5Qb2ludC5wcm90b3R5cGUudG9KU09OID0gZnVuY3Rpb24gdG9KU09OKCkge1xyXG4gIGlmICghdGhpcy5wcmVjb21wdXRlZClcclxuICAgIHJldHVybiBbIHRoaXMueCwgdGhpcy55IF07XHJcblxyXG4gIHJldHVybiBbIHRoaXMueCwgdGhpcy55LCB0aGlzLnByZWNvbXB1dGVkICYmIHtcclxuICAgIGRvdWJsZXM6IHRoaXMucHJlY29tcHV0ZWQuZG91YmxlcyAmJiB7XHJcbiAgICAgIHN0ZXA6IHRoaXMucHJlY29tcHV0ZWQuZG91Ymxlcy5zdGVwLFxyXG4gICAgICBwb2ludHM6IHRoaXMucHJlY29tcHV0ZWQuZG91Ymxlcy5wb2ludHMuc2xpY2UoMSlcclxuICAgIH0sXHJcbiAgICBuYWY6IHRoaXMucHJlY29tcHV0ZWQubmFmICYmIHtcclxuICAgICAgd25kOiB0aGlzLnByZWNvbXB1dGVkLm5hZi53bmQsXHJcbiAgICAgIHBvaW50czogdGhpcy5wcmVjb21wdXRlZC5uYWYucG9pbnRzLnNsaWNlKDEpXHJcbiAgICB9XHJcbiAgfSBdO1xyXG59O1xyXG5cclxuUG9pbnQuZnJvbUpTT04gPSBmdW5jdGlvbiBmcm9tSlNPTihjdXJ2ZSwgb2JqLCByZWQpIHtcclxuICBpZiAodHlwZW9mIG9iaiA9PT0gJ3N0cmluZycpXHJcbiAgICBvYmogPSBKU09OLnBhcnNlKG9iaik7XHJcbiAgdmFyIHJlcyA9IGN1cnZlLnBvaW50KG9ialswXSwgb2JqWzFdLCByZWQpO1xyXG4gIGlmICghb2JqWzJdKVxyXG4gICAgcmV0dXJuIHJlcztcclxuXHJcbiAgZnVuY3Rpb24gb2JqMnBvaW50KG9iaikge1xyXG4gICAgcmV0dXJuIGN1cnZlLnBvaW50KG9ialswXSwgb2JqWzFdLCByZWQpO1xyXG4gIH1cclxuXHJcbiAgdmFyIHByZSA9IG9ialsyXTtcclxuICByZXMucHJlY29tcHV0ZWQgPSB7XHJcbiAgICBiZXRhOiBudWxsLFxyXG4gICAgZG91YmxlczogcHJlLmRvdWJsZXMgJiYge1xyXG4gICAgICBzdGVwOiBwcmUuZG91Ymxlcy5zdGVwLFxyXG4gICAgICBwb2ludHM6IFsgcmVzIF0uY29uY2F0KHByZS5kb3VibGVzLnBvaW50cy5tYXAob2JqMnBvaW50KSlcclxuICAgIH0sXHJcbiAgICBuYWY6IHByZS5uYWYgJiYge1xyXG4gICAgICB3bmQ6IHByZS5uYWYud25kLFxyXG4gICAgICBwb2ludHM6IFsgcmVzIF0uY29uY2F0KHByZS5uYWYucG9pbnRzLm1hcChvYmoycG9pbnQpKVxyXG4gICAgfVxyXG4gIH07XHJcbiAgcmV0dXJuIHJlcztcclxufTtcclxuXHJcblBvaW50LnByb3RvdHlwZS5pbnNwZWN0ID0gZnVuY3Rpb24gaW5zcGVjdCgpIHtcclxuICBpZiAodGhpcy5pc0luZmluaXR5KCkpXHJcbiAgICByZXR1cm4gJzxFQyBQb2ludCBJbmZpbml0eT4nO1xyXG4gIHJldHVybiAnPEVDIFBvaW50IHg6ICcgKyB0aGlzLnguZnJvbVJlZCgpLnRvU3RyaW5nKDE2LCAyKSArXHJcbiAgICAgICcgeTogJyArIHRoaXMueS5mcm9tUmVkKCkudG9TdHJpbmcoMTYsIDIpICsgJz4nO1xyXG59O1xyXG5cclxuUG9pbnQucHJvdG90eXBlLmlzSW5maW5pdHkgPSBmdW5jdGlvbiBpc0luZmluaXR5KCkge1xyXG4gIHJldHVybiB0aGlzLmluZjtcclxufTtcclxuXHJcblBvaW50LnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiBhZGQocCkge1xyXG4gIC8vIE8gKyBQID0gUFxyXG4gIGlmICh0aGlzLmluZilcclxuICAgIHJldHVybiBwO1xyXG5cclxuICAvLyBQICsgTyA9IFBcclxuICBpZiAocC5pbmYpXHJcbiAgICByZXR1cm4gdGhpcztcclxuXHJcbiAgLy8gUCArIFAgPSAyUFxyXG4gIGlmICh0aGlzLmVxKHApKVxyXG4gICAgcmV0dXJuIHRoaXMuZGJsKCk7XHJcblxyXG4gIC8vIFAgKyAoLVApID0gT1xyXG4gIGlmICh0aGlzLm5lZygpLmVxKHApKVxyXG4gICAgcmV0dXJuIHRoaXMuY3VydmUucG9pbnQobnVsbCwgbnVsbCk7XHJcblxyXG4gIC8vIFAgKyBRID0gT1xyXG4gIGlmICh0aGlzLnguY21wKHAueCkgPT09IDApXHJcbiAgICByZXR1cm4gdGhpcy5jdXJ2ZS5wb2ludChudWxsLCBudWxsKTtcclxuXHJcbiAgdmFyIGMgPSB0aGlzLnkucmVkU3ViKHAueSk7XHJcbiAgaWYgKGMuY21wbigwKSAhPT0gMClcclxuICAgIGMgPSBjLnJlZE11bCh0aGlzLngucmVkU3ViKHAueCkucmVkSW52bSgpKTtcclxuICB2YXIgbnggPSBjLnJlZFNxcigpLnJlZElTdWIodGhpcy54KS5yZWRJU3ViKHAueCk7XHJcbiAgdmFyIG55ID0gYy5yZWRNdWwodGhpcy54LnJlZFN1YihueCkpLnJlZElTdWIodGhpcy55KTtcclxuICByZXR1cm4gdGhpcy5jdXJ2ZS5wb2ludChueCwgbnkpO1xyXG59O1xyXG5cclxuUG9pbnQucHJvdG90eXBlLmRibCA9IGZ1bmN0aW9uIGRibCgpIHtcclxuICBpZiAodGhpcy5pbmYpXHJcbiAgICByZXR1cm4gdGhpcztcclxuXHJcbiAgLy8gMlAgPSBPXHJcbiAgdmFyIHlzMSA9IHRoaXMueS5yZWRBZGQodGhpcy55KTtcclxuICBpZiAoeXMxLmNtcG4oMCkgPT09IDApXHJcbiAgICByZXR1cm4gdGhpcy5jdXJ2ZS5wb2ludChudWxsLCBudWxsKTtcclxuXHJcbiAgdmFyIGEgPSB0aGlzLmN1cnZlLmE7XHJcblxyXG4gIHZhciB4MiA9IHRoaXMueC5yZWRTcXIoKTtcclxuICB2YXIgZHlpbnYgPSB5czEucmVkSW52bSgpO1xyXG4gIHZhciBjID0geDIucmVkQWRkKHgyKS5yZWRJQWRkKHgyKS5yZWRJQWRkKGEpLnJlZE11bChkeWludik7XHJcblxyXG4gIHZhciBueCA9IGMucmVkU3FyKCkucmVkSVN1Yih0aGlzLngucmVkQWRkKHRoaXMueCkpO1xyXG4gIHZhciBueSA9IGMucmVkTXVsKHRoaXMueC5yZWRTdWIobngpKS5yZWRJU3ViKHRoaXMueSk7XHJcbiAgcmV0dXJuIHRoaXMuY3VydmUucG9pbnQobngsIG55KTtcclxufTtcclxuXHJcblBvaW50LnByb3RvdHlwZS5nZXRYID0gZnVuY3Rpb24gZ2V0WCgpIHtcclxuICByZXR1cm4gdGhpcy54LmZyb21SZWQoKTtcclxufTtcclxuXHJcblBvaW50LnByb3RvdHlwZS5nZXRZID0gZnVuY3Rpb24gZ2V0WSgpIHtcclxuICByZXR1cm4gdGhpcy55LmZyb21SZWQoKTtcclxufTtcclxuXHJcblBvaW50LnByb3RvdHlwZS5tdWwgPSBmdW5jdGlvbiBtdWwoaykge1xyXG4gIGsgPSBuZXcgQk4oaywgMTYpO1xyXG5cclxuICBpZiAodGhpcy5faGFzRG91YmxlcyhrKSlcclxuICAgIHJldHVybiB0aGlzLmN1cnZlLl9maXhlZE5hZk11bCh0aGlzLCBrKTtcclxuICBlbHNlIGlmICh0aGlzLmN1cnZlLmVuZG8pXHJcbiAgICByZXR1cm4gdGhpcy5jdXJ2ZS5fZW5kb1duYWZNdWxBZGQoWyB0aGlzIF0sIFsgayBdKTtcclxuICBlbHNlXHJcbiAgICByZXR1cm4gdGhpcy5jdXJ2ZS5fd25hZk11bCh0aGlzLCBrKTtcclxufTtcclxuXHJcblBvaW50LnByb3RvdHlwZS5tdWxBZGQgPSBmdW5jdGlvbiBtdWxBZGQoazEsIHAyLCBrMikge1xyXG4gIHZhciBwb2ludHMgPSBbIHRoaXMsIHAyIF07XHJcbiAgdmFyIGNvZWZmcyA9IFsgazEsIGsyIF07XHJcbiAgaWYgKHRoaXMuY3VydmUuZW5kbylcclxuICAgIHJldHVybiB0aGlzLmN1cnZlLl9lbmRvV25hZk11bEFkZChwb2ludHMsIGNvZWZmcyk7XHJcbiAgZWxzZVxyXG4gICAgcmV0dXJuIHRoaXMuY3VydmUuX3duYWZNdWxBZGQoMSwgcG9pbnRzLCBjb2VmZnMsIDIpO1xyXG59O1xyXG5cclxuUG9pbnQucHJvdG90eXBlLmptdWxBZGQgPSBmdW5jdGlvbiBqbXVsQWRkKGsxLCBwMiwgazIpIHtcclxuICB2YXIgcG9pbnRzID0gWyB0aGlzLCBwMiBdO1xyXG4gIHZhciBjb2VmZnMgPSBbIGsxLCBrMiBdO1xyXG4gIGlmICh0aGlzLmN1cnZlLmVuZG8pXHJcbiAgICByZXR1cm4gdGhpcy5jdXJ2ZS5fZW5kb1duYWZNdWxBZGQocG9pbnRzLCBjb2VmZnMsIHRydWUpO1xyXG4gIGVsc2VcclxuICAgIHJldHVybiB0aGlzLmN1cnZlLl93bmFmTXVsQWRkKDEsIHBvaW50cywgY29lZmZzLCAyLCB0cnVlKTtcclxufTtcclxuXHJcblBvaW50LnByb3RvdHlwZS5lcSA9IGZ1bmN0aW9uIGVxKHApIHtcclxuICByZXR1cm4gdGhpcyA9PT0gcCB8fFxyXG4gICAgICAgICB0aGlzLmluZiA9PT0gcC5pbmYgJiZcclxuICAgICAgICAgICAgICh0aGlzLmluZiB8fCB0aGlzLnguY21wKHAueCkgPT09IDAgJiYgdGhpcy55LmNtcChwLnkpID09PSAwKTtcclxufTtcclxuXHJcblBvaW50LnByb3RvdHlwZS5uZWcgPSBmdW5jdGlvbiBuZWcoX3ByZWNvbXB1dGUpIHtcclxuICBpZiAodGhpcy5pbmYpXHJcbiAgICByZXR1cm4gdGhpcztcclxuXHJcbiAgdmFyIHJlcyA9IHRoaXMuY3VydmUucG9pbnQodGhpcy54LCB0aGlzLnkucmVkTmVnKCkpO1xyXG4gIGlmIChfcHJlY29tcHV0ZSAmJiB0aGlzLnByZWNvbXB1dGVkKSB7XHJcbiAgICB2YXIgcHJlID0gdGhpcy5wcmVjb21wdXRlZDtcclxuICAgIHZhciBuZWdhdGUgPSBmdW5jdGlvbihwKSB7XHJcbiAgICAgIHJldHVybiBwLm5lZygpO1xyXG4gICAgfTtcclxuICAgIHJlcy5wcmVjb21wdXRlZCA9IHtcclxuICAgICAgbmFmOiBwcmUubmFmICYmIHtcclxuICAgICAgICB3bmQ6IHByZS5uYWYud25kLFxyXG4gICAgICAgIHBvaW50czogcHJlLm5hZi5wb2ludHMubWFwKG5lZ2F0ZSlcclxuICAgICAgfSxcclxuICAgICAgZG91YmxlczogcHJlLmRvdWJsZXMgJiYge1xyXG4gICAgICAgIHN0ZXA6IHByZS5kb3VibGVzLnN0ZXAsXHJcbiAgICAgICAgcG9pbnRzOiBwcmUuZG91Ymxlcy5wb2ludHMubWFwKG5lZ2F0ZSlcclxuICAgICAgfVxyXG4gICAgfTtcclxuICB9XHJcbiAgcmV0dXJuIHJlcztcclxufTtcclxuXHJcblBvaW50LnByb3RvdHlwZS50b0ogPSBmdW5jdGlvbiB0b0ooKSB7XHJcbiAgaWYgKHRoaXMuaW5mKVxyXG4gICAgcmV0dXJuIHRoaXMuY3VydmUuanBvaW50KG51bGwsIG51bGwsIG51bGwpO1xyXG5cclxuICB2YXIgcmVzID0gdGhpcy5jdXJ2ZS5qcG9pbnQodGhpcy54LCB0aGlzLnksIHRoaXMuY3VydmUub25lKTtcclxuICByZXR1cm4gcmVzO1xyXG59O1xyXG5cclxuZnVuY3Rpb24gSlBvaW50KGN1cnZlLCB4LCB5LCB6KSB7XHJcbiAgQmFzZS5CYXNlUG9pbnQuY2FsbCh0aGlzLCBjdXJ2ZSwgJ2phY29iaWFuJyk7XHJcbiAgaWYgKHggPT09IG51bGwgJiYgeSA9PT0gbnVsbCAmJiB6ID09PSBudWxsKSB7XHJcbiAgICB0aGlzLnggPSB0aGlzLmN1cnZlLm9uZTtcclxuICAgIHRoaXMueSA9IHRoaXMuY3VydmUub25lO1xyXG4gICAgdGhpcy56ID0gbmV3IEJOKDApO1xyXG4gIH0gZWxzZSB7XHJcbiAgICB0aGlzLnggPSBuZXcgQk4oeCwgMTYpO1xyXG4gICAgdGhpcy55ID0gbmV3IEJOKHksIDE2KTtcclxuICAgIHRoaXMueiA9IG5ldyBCTih6LCAxNik7XHJcbiAgfVxyXG4gIGlmICghdGhpcy54LnJlZClcclxuICAgIHRoaXMueCA9IHRoaXMueC50b1JlZCh0aGlzLmN1cnZlLnJlZCk7XHJcbiAgaWYgKCF0aGlzLnkucmVkKVxyXG4gICAgdGhpcy55ID0gdGhpcy55LnRvUmVkKHRoaXMuY3VydmUucmVkKTtcclxuICBpZiAoIXRoaXMuei5yZWQpXHJcbiAgICB0aGlzLnogPSB0aGlzLnoudG9SZWQodGhpcy5jdXJ2ZS5yZWQpO1xyXG5cclxuICB0aGlzLnpPbmUgPSB0aGlzLnogPT09IHRoaXMuY3VydmUub25lO1xyXG59XHJcbmluaGVyaXRzKEpQb2ludCwgQmFzZS5CYXNlUG9pbnQpO1xyXG5cclxuU2hvcnRDdXJ2ZS5wcm90b3R5cGUuanBvaW50ID0gZnVuY3Rpb24ganBvaW50KHgsIHksIHopIHtcclxuICByZXR1cm4gbmV3IEpQb2ludCh0aGlzLCB4LCB5LCB6KTtcclxufTtcclxuXHJcbkpQb2ludC5wcm90b3R5cGUudG9QID0gZnVuY3Rpb24gdG9QKCkge1xyXG4gIGlmICh0aGlzLmlzSW5maW5pdHkoKSlcclxuICAgIHJldHVybiB0aGlzLmN1cnZlLnBvaW50KG51bGwsIG51bGwpO1xyXG5cclxuICB2YXIgemludiA9IHRoaXMuei5yZWRJbnZtKCk7XHJcbiAgdmFyIHppbnYyID0gemludi5yZWRTcXIoKTtcclxuICB2YXIgYXggPSB0aGlzLngucmVkTXVsKHppbnYyKTtcclxuICB2YXIgYXkgPSB0aGlzLnkucmVkTXVsKHppbnYyKS5yZWRNdWwoemludik7XHJcblxyXG4gIHJldHVybiB0aGlzLmN1cnZlLnBvaW50KGF4LCBheSk7XHJcbn07XHJcblxyXG5KUG9pbnQucHJvdG90eXBlLm5lZyA9IGZ1bmN0aW9uIG5lZygpIHtcclxuICByZXR1cm4gdGhpcy5jdXJ2ZS5qcG9pbnQodGhpcy54LCB0aGlzLnkucmVkTmVnKCksIHRoaXMueik7XHJcbn07XHJcblxyXG5KUG9pbnQucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uIGFkZChwKSB7XHJcbiAgLy8gTyArIFAgPSBQXHJcbiAgaWYgKHRoaXMuaXNJbmZpbml0eSgpKVxyXG4gICAgcmV0dXJuIHA7XHJcblxyXG4gIC8vIFAgKyBPID0gUFxyXG4gIGlmIChwLmlzSW5maW5pdHkoKSlcclxuICAgIHJldHVybiB0aGlzO1xyXG5cclxuICAvLyAxMk0gKyA0UyArIDdBXHJcbiAgdmFyIHB6MiA9IHAuei5yZWRTcXIoKTtcclxuICB2YXIgejIgPSB0aGlzLnoucmVkU3FyKCk7XHJcbiAgdmFyIHUxID0gdGhpcy54LnJlZE11bChwejIpO1xyXG4gIHZhciB1MiA9IHAueC5yZWRNdWwoejIpO1xyXG4gIHZhciBzMSA9IHRoaXMueS5yZWRNdWwocHoyLnJlZE11bChwLnopKTtcclxuICB2YXIgczIgPSBwLnkucmVkTXVsKHoyLnJlZE11bCh0aGlzLnopKTtcclxuXHJcbiAgdmFyIGggPSB1MS5yZWRTdWIodTIpO1xyXG4gIHZhciByID0gczEucmVkU3ViKHMyKTtcclxuICBpZiAoaC5jbXBuKDApID09PSAwKSB7XHJcbiAgICBpZiAoci5jbXBuKDApICE9PSAwKVxyXG4gICAgICByZXR1cm4gdGhpcy5jdXJ2ZS5qcG9pbnQobnVsbCwgbnVsbCwgbnVsbCk7XHJcbiAgICBlbHNlXHJcbiAgICAgIHJldHVybiB0aGlzLmRibCgpO1xyXG4gIH1cclxuXHJcbiAgdmFyIGgyID0gaC5yZWRTcXIoKTtcclxuICB2YXIgaDMgPSBoMi5yZWRNdWwoaCk7XHJcbiAgdmFyIHYgPSB1MS5yZWRNdWwoaDIpO1xyXG5cclxuICB2YXIgbnggPSByLnJlZFNxcigpLnJlZElBZGQoaDMpLnJlZElTdWIodikucmVkSVN1Yih2KTtcclxuICB2YXIgbnkgPSByLnJlZE11bCh2LnJlZElTdWIobngpKS5yZWRJU3ViKHMxLnJlZE11bChoMykpO1xyXG4gIHZhciBueiA9IHRoaXMuei5yZWRNdWwocC56KS5yZWRNdWwoaCk7XHJcblxyXG4gIHJldHVybiB0aGlzLmN1cnZlLmpwb2ludChueCwgbnksIG56KTtcclxufTtcclxuXHJcbkpQb2ludC5wcm90b3R5cGUubWl4ZWRBZGQgPSBmdW5jdGlvbiBtaXhlZEFkZChwKSB7XHJcbiAgLy8gTyArIFAgPSBQXHJcbiAgaWYgKHRoaXMuaXNJbmZpbml0eSgpKVxyXG4gICAgcmV0dXJuIHAudG9KKCk7XHJcblxyXG4gIC8vIFAgKyBPID0gUFxyXG4gIGlmIChwLmlzSW5maW5pdHkoKSlcclxuICAgIHJldHVybiB0aGlzO1xyXG5cclxuICAvLyA4TSArIDNTICsgN0FcclxuICB2YXIgejIgPSB0aGlzLnoucmVkU3FyKCk7XHJcbiAgdmFyIHUxID0gdGhpcy54O1xyXG4gIHZhciB1MiA9IHAueC5yZWRNdWwoejIpO1xyXG4gIHZhciBzMSA9IHRoaXMueTtcclxuICB2YXIgczIgPSBwLnkucmVkTXVsKHoyKS5yZWRNdWwodGhpcy56KTtcclxuXHJcbiAgdmFyIGggPSB1MS5yZWRTdWIodTIpO1xyXG4gIHZhciByID0gczEucmVkU3ViKHMyKTtcclxuICBpZiAoaC5jbXBuKDApID09PSAwKSB7XHJcbiAgICBpZiAoci5jbXBuKDApICE9PSAwKVxyXG4gICAgICByZXR1cm4gdGhpcy5jdXJ2ZS5qcG9pbnQobnVsbCwgbnVsbCwgbnVsbCk7XHJcbiAgICBlbHNlXHJcbiAgICAgIHJldHVybiB0aGlzLmRibCgpO1xyXG4gIH1cclxuXHJcbiAgdmFyIGgyID0gaC5yZWRTcXIoKTtcclxuICB2YXIgaDMgPSBoMi5yZWRNdWwoaCk7XHJcbiAgdmFyIHYgPSB1MS5yZWRNdWwoaDIpO1xyXG5cclxuICB2YXIgbnggPSByLnJlZFNxcigpLnJlZElBZGQoaDMpLnJlZElTdWIodikucmVkSVN1Yih2KTtcclxuICB2YXIgbnkgPSByLnJlZE11bCh2LnJlZElTdWIobngpKS5yZWRJU3ViKHMxLnJlZE11bChoMykpO1xyXG4gIHZhciBueiA9IHRoaXMuei5yZWRNdWwoaCk7XHJcblxyXG4gIHJldHVybiB0aGlzLmN1cnZlLmpwb2ludChueCwgbnksIG56KTtcclxufTtcclxuXHJcbkpQb2ludC5wcm90b3R5cGUuZGJscCA9IGZ1bmN0aW9uIGRibHAocG93KSB7XHJcbiAgaWYgKHBvdyA9PT0gMClcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIGlmICh0aGlzLmlzSW5maW5pdHkoKSlcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIGlmICghcG93KVxyXG4gICAgcmV0dXJuIHRoaXMuZGJsKCk7XHJcblxyXG4gIGlmICh0aGlzLmN1cnZlLnplcm9BIHx8IHRoaXMuY3VydmUudGhyZWVBKSB7XHJcbiAgICB2YXIgciA9IHRoaXM7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBvdzsgaSsrKVxyXG4gICAgICByID0gci5kYmwoKTtcclxuICAgIHJldHVybiByO1xyXG4gIH1cclxuXHJcbiAgLy8gMU0gKyAyUyArIDFBICsgTiAqICg0UyArIDVNICsgOEEpXHJcbiAgLy8gTiA9IDEgPT4gNk0gKyA2UyArIDlBXHJcbiAgdmFyIGEgPSB0aGlzLmN1cnZlLmE7XHJcbiAgdmFyIHRpbnYgPSB0aGlzLmN1cnZlLnRpbnY7XHJcblxyXG4gIHZhciBqeCA9IHRoaXMueDtcclxuICB2YXIgankgPSB0aGlzLnk7XHJcbiAgdmFyIGp6ID0gdGhpcy56O1xyXG4gIHZhciBqejQgPSBqei5yZWRTcXIoKS5yZWRTcXIoKTtcclxuXHJcbiAgLy8gUmV1c2UgcmVzdWx0c1xyXG4gIHZhciBqeWQgPSBqeS5yZWRBZGQoankpO1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgcG93OyBpKyspIHtcclxuICAgIHZhciBqeDIgPSBqeC5yZWRTcXIoKTtcclxuICAgIHZhciBqeWQyID0ganlkLnJlZFNxcigpO1xyXG4gICAgdmFyIGp5ZDQgPSBqeWQyLnJlZFNxcigpO1xyXG4gICAgdmFyIGMgPSBqeDIucmVkQWRkKGp4MikucmVkSUFkZChqeDIpLnJlZElBZGQoYS5yZWRNdWwoano0KSk7XHJcblxyXG4gICAgdmFyIHQxID0gangucmVkTXVsKGp5ZDIpO1xyXG4gICAgdmFyIG54ID0gYy5yZWRTcXIoKS5yZWRJU3ViKHQxLnJlZEFkZCh0MSkpO1xyXG4gICAgdmFyIHQyID0gdDEucmVkSVN1YihueCk7XHJcbiAgICB2YXIgZG55ID0gYy5yZWRNdWwodDIpO1xyXG4gICAgZG55ID0gZG55LnJlZElBZGQoZG55KS5yZWRJU3ViKGp5ZDQpO1xyXG4gICAgdmFyIG56ID0ganlkLnJlZE11bChqeik7XHJcbiAgICBpZiAoaSArIDEgPCBwb3cpXHJcbiAgICAgIGp6NCA9IGp6NC5yZWRNdWwoanlkNCk7XHJcblxyXG4gICAganggPSBueDtcclxuICAgIGp6ID0gbno7XHJcbiAgICBqeWQgPSBkbnk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gdGhpcy5jdXJ2ZS5qcG9pbnQoangsIGp5ZC5yZWRNdWwodGludiksIGp6KTtcclxufTtcclxuXHJcbkpQb2ludC5wcm90b3R5cGUuZGJsID0gZnVuY3Rpb24gZGJsKCkge1xyXG4gIGlmICh0aGlzLmlzSW5maW5pdHkoKSlcclxuICAgIHJldHVybiB0aGlzO1xyXG5cclxuICBpZiAodGhpcy5jdXJ2ZS56ZXJvQSlcclxuICAgIHJldHVybiB0aGlzLl96ZXJvRGJsKCk7XHJcbiAgZWxzZSBpZiAodGhpcy5jdXJ2ZS50aHJlZUEpXHJcbiAgICByZXR1cm4gdGhpcy5fdGhyZWVEYmwoKTtcclxuICBlbHNlXHJcbiAgICByZXR1cm4gdGhpcy5fZGJsKCk7XHJcbn07XHJcblxyXG5KUG9pbnQucHJvdG90eXBlLl96ZXJvRGJsID0gZnVuY3Rpb24gX3plcm9EYmwoKSB7XHJcbiAgdmFyIG54O1xyXG4gIHZhciBueTtcclxuICB2YXIgbno7XHJcbiAgLy8gWiA9IDFcclxuICBpZiAodGhpcy56T25lKSB7XHJcbiAgICAvLyBoeXBlcmVsbGlwdGljLm9yZy9FRkQvZzFwL2F1dG8tc2hvcnR3LWphY29iaWFuLTAuaHRtbFxyXG4gICAgLy8gICAgICNkb3VibGluZy1tZGJsLTIwMDctYmxcclxuICAgIC8vIDFNICsgNVMgKyAxNEFcclxuXHJcbiAgICAvLyBYWCA9IFgxXjJcclxuICAgIHZhciB4eCA9IHRoaXMueC5yZWRTcXIoKTtcclxuICAgIC8vIFlZID0gWTFeMlxyXG4gICAgdmFyIHl5ID0gdGhpcy55LnJlZFNxcigpO1xyXG4gICAgLy8gWVlZWSA9IFlZXjJcclxuICAgIHZhciB5eXl5ID0geXkucmVkU3FyKCk7XHJcbiAgICAvLyBTID0gMiAqICgoWDEgKyBZWSleMiAtIFhYIC0gWVlZWSlcclxuICAgIHZhciBzID0gdGhpcy54LnJlZEFkZCh5eSkucmVkU3FyKCkucmVkSVN1Yih4eCkucmVkSVN1Yih5eXl5KTtcclxuICAgIHMgPSBzLnJlZElBZGQocyk7XHJcbiAgICAvLyBNID0gMyAqIFhYICsgYTsgYSA9IDBcclxuICAgIHZhciBtID0geHgucmVkQWRkKHh4KS5yZWRJQWRkKHh4KTtcclxuICAgIC8vIFQgPSBNIF4gMiAtIDIqU1xyXG4gICAgdmFyIHQgPSBtLnJlZFNxcigpLnJlZElTdWIocykucmVkSVN1YihzKTtcclxuXHJcbiAgICAvLyA4ICogWVlZWVxyXG4gICAgdmFyIHl5eXk4ID0geXl5eS5yZWRJQWRkKHl5eXkpO1xyXG4gICAgeXl5eTggPSB5eXl5OC5yZWRJQWRkKHl5eXk4KTtcclxuICAgIHl5eXk4ID0geXl5eTgucmVkSUFkZCh5eXl5OCk7XHJcblxyXG4gICAgLy8gWDMgPSBUXHJcbiAgICBueCA9IHQ7XHJcbiAgICAvLyBZMyA9IE0gKiAoUyAtIFQpIC0gOCAqIFlZWVlcclxuICAgIG55ID0gbS5yZWRNdWwocy5yZWRJU3ViKHQpKS5yZWRJU3ViKHl5eXk4KTtcclxuICAgIC8vIFozID0gMipZMVxyXG4gICAgbnogPSB0aGlzLnkucmVkQWRkKHRoaXMueSk7XHJcbiAgfSBlbHNlIHtcclxuICAgIC8vIGh5cGVyZWxsaXB0aWMub3JnL0VGRC9nMXAvYXV0by1zaG9ydHctamFjb2JpYW4tMC5odG1sXHJcbiAgICAvLyAgICAgI2RvdWJsaW5nLWRibC0yMDA5LWxcclxuICAgIC8vIDJNICsgNVMgKyAxM0FcclxuXHJcbiAgICAvLyBBID0gWDFeMlxyXG4gICAgdmFyIGEgPSB0aGlzLngucmVkU3FyKCk7XHJcbiAgICAvLyBCID0gWTFeMlxyXG4gICAgdmFyIGIgPSB0aGlzLnkucmVkU3FyKCk7XHJcbiAgICAvLyBDID0gQl4yXHJcbiAgICB2YXIgYyA9IGIucmVkU3FyKCk7XHJcbiAgICAvLyBEID0gMiAqICgoWDEgKyBCKV4yIC0gQSAtIEMpXHJcbiAgICB2YXIgZCA9IHRoaXMueC5yZWRBZGQoYikucmVkU3FyKCkucmVkSVN1YihhKS5yZWRJU3ViKGMpO1xyXG4gICAgZCA9IGQucmVkSUFkZChkKTtcclxuICAgIC8vIEUgPSAzICogQVxyXG4gICAgdmFyIGUgPSBhLnJlZEFkZChhKS5yZWRJQWRkKGEpO1xyXG4gICAgLy8gRiA9IEVeMlxyXG4gICAgdmFyIGYgPSBlLnJlZFNxcigpO1xyXG5cclxuICAgIC8vIDggKiBDXHJcbiAgICB2YXIgYzggPSBjLnJlZElBZGQoYyk7XHJcbiAgICBjOCA9IGM4LnJlZElBZGQoYzgpO1xyXG4gICAgYzggPSBjOC5yZWRJQWRkKGM4KTtcclxuXHJcbiAgICAvLyBYMyA9IEYgLSAyICogRFxyXG4gICAgbnggPSBmLnJlZElTdWIoZCkucmVkSVN1YihkKTtcclxuICAgIC8vIFkzID0gRSAqIChEIC0gWDMpIC0gOCAqIENcclxuICAgIG55ID0gZS5yZWRNdWwoZC5yZWRJU3ViKG54KSkucmVkSVN1YihjOCk7XHJcbiAgICAvLyBaMyA9IDIgKiBZMSAqIFoxXHJcbiAgICBueiA9IHRoaXMueS5yZWRNdWwodGhpcy56KTtcclxuICAgIG56ID0gbnoucmVkSUFkZChueik7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gdGhpcy5jdXJ2ZS5qcG9pbnQobngsIG55LCBueik7XHJcbn07XHJcblxyXG5KUG9pbnQucHJvdG90eXBlLl90aHJlZURibCA9IGZ1bmN0aW9uIF90aHJlZURibCgpIHtcclxuICB2YXIgbng7XHJcbiAgdmFyIG55O1xyXG4gIHZhciBuejtcclxuICAvLyBaID0gMVxyXG4gIGlmICh0aGlzLnpPbmUpIHtcclxuICAgIC8vIGh5cGVyZWxsaXB0aWMub3JnL0VGRC9nMXAvYXV0by1zaG9ydHctamFjb2JpYW4tMy5odG1sXHJcbiAgICAvLyAgICAgI2RvdWJsaW5nLW1kYmwtMjAwNy1ibFxyXG4gICAgLy8gMU0gKyA1UyArIDE1QVxyXG5cclxuICAgIC8vIFhYID0gWDFeMlxyXG4gICAgdmFyIHh4ID0gdGhpcy54LnJlZFNxcigpO1xyXG4gICAgLy8gWVkgPSBZMV4yXHJcbiAgICB2YXIgeXkgPSB0aGlzLnkucmVkU3FyKCk7XHJcbiAgICAvLyBZWVlZID0gWVleMlxyXG4gICAgdmFyIHl5eXkgPSB5eS5yZWRTcXIoKTtcclxuICAgIC8vIFMgPSAyICogKChYMSArIFlZKV4yIC0gWFggLSBZWVlZKVxyXG4gICAgdmFyIHMgPSB0aGlzLngucmVkQWRkKHl5KS5yZWRTcXIoKS5yZWRJU3ViKHh4KS5yZWRJU3ViKHl5eXkpO1xyXG4gICAgcyA9IHMucmVkSUFkZChzKTtcclxuICAgIC8vIE0gPSAzICogWFggKyBhXHJcbiAgICB2YXIgbSA9IHh4LnJlZEFkZCh4eCkucmVkSUFkZCh4eCkucmVkSUFkZCh0aGlzLmN1cnZlLmEpO1xyXG4gICAgLy8gVCA9IE1eMiAtIDIgKiBTXHJcbiAgICB2YXIgdCA9IG0ucmVkU3FyKCkucmVkSVN1YihzKS5yZWRJU3ViKHMpO1xyXG4gICAgLy8gWDMgPSBUXHJcbiAgICBueCA9IHQ7XHJcbiAgICAvLyBZMyA9IE0gKiAoUyAtIFQpIC0gOCAqIFlZWVlcclxuICAgIHZhciB5eXl5OCA9IHl5eXkucmVkSUFkZCh5eXl5KTtcclxuICAgIHl5eXk4ID0geXl5eTgucmVkSUFkZCh5eXl5OCk7XHJcbiAgICB5eXl5OCA9IHl5eXk4LnJlZElBZGQoeXl5eTgpO1xyXG4gICAgbnkgPSBtLnJlZE11bChzLnJlZElTdWIodCkpLnJlZElTdWIoeXl5eTgpO1xyXG4gICAgLy8gWjMgPSAyICogWTFcclxuICAgIG56ID0gdGhpcy55LnJlZEFkZCh0aGlzLnkpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICAvLyBoeXBlcmVsbGlwdGljLm9yZy9FRkQvZzFwL2F1dG8tc2hvcnR3LWphY29iaWFuLTMuaHRtbCNkb3VibGluZy1kYmwtMjAwMS1iXHJcbiAgICAvLyAzTSArIDVTXHJcblxyXG4gICAgLy8gZGVsdGEgPSBaMV4yXHJcbiAgICB2YXIgZGVsdGEgPSB0aGlzLnoucmVkU3FyKCk7XHJcbiAgICAvLyBnYW1tYSA9IFkxXjJcclxuICAgIHZhciBnYW1tYSA9IHRoaXMueS5yZWRTcXIoKTtcclxuICAgIC8vIGJldGEgPSBYMSAqIGdhbW1hXHJcbiAgICB2YXIgYmV0YSA9IHRoaXMueC5yZWRNdWwoZ2FtbWEpO1xyXG4gICAgLy8gYWxwaGEgPSAzICogKFgxIC0gZGVsdGEpICogKFgxICsgZGVsdGEpXHJcbiAgICB2YXIgYWxwaGEgPSB0aGlzLngucmVkU3ViKGRlbHRhKS5yZWRNdWwodGhpcy54LnJlZEFkZChkZWx0YSkpO1xyXG4gICAgYWxwaGEgPSBhbHBoYS5yZWRBZGQoYWxwaGEpLnJlZElBZGQoYWxwaGEpO1xyXG4gICAgLy8gWDMgPSBhbHBoYV4yIC0gOCAqIGJldGFcclxuICAgIHZhciBiZXRhNCA9IGJldGEucmVkSUFkZChiZXRhKTtcclxuICAgIGJldGE0ID0gYmV0YTQucmVkSUFkZChiZXRhNCk7XHJcbiAgICB2YXIgYmV0YTggPSBiZXRhNC5yZWRBZGQoYmV0YTQpO1xyXG4gICAgbnggPSBhbHBoYS5yZWRTcXIoKS5yZWRJU3ViKGJldGE4KTtcclxuICAgIC8vIFozID0gKFkxICsgWjEpXjIgLSBnYW1tYSAtIGRlbHRhXHJcbiAgICBueiA9IHRoaXMueS5yZWRBZGQodGhpcy56KS5yZWRTcXIoKS5yZWRJU3ViKGdhbW1hKS5yZWRJU3ViKGRlbHRhKTtcclxuICAgIC8vIFkzID0gYWxwaGEgKiAoNCAqIGJldGEgLSBYMykgLSA4ICogZ2FtbWFeMlxyXG4gICAgdmFyIGdnYW1tYTggPSBnYW1tYS5yZWRTcXIoKTtcclxuICAgIGdnYW1tYTggPSBnZ2FtbWE4LnJlZElBZGQoZ2dhbW1hOCk7XHJcbiAgICBnZ2FtbWE4ID0gZ2dhbW1hOC5yZWRJQWRkKGdnYW1tYTgpO1xyXG4gICAgZ2dhbW1hOCA9IGdnYW1tYTgucmVkSUFkZChnZ2FtbWE4KTtcclxuICAgIG55ID0gYWxwaGEucmVkTXVsKGJldGE0LnJlZElTdWIobngpKS5yZWRJU3ViKGdnYW1tYTgpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHRoaXMuY3VydmUuanBvaW50KG54LCBueSwgbnopO1xyXG59O1xyXG5cclxuSlBvaW50LnByb3RvdHlwZS5fZGJsID0gZnVuY3Rpb24gX2RibCgpIHtcclxuICB2YXIgYSA9IHRoaXMuY3VydmUuYTtcclxuXHJcbiAgLy8gNE0gKyA2UyArIDEwQVxyXG4gIHZhciBqeCA9IHRoaXMueDtcclxuICB2YXIgankgPSB0aGlzLnk7XHJcbiAgdmFyIGp6ID0gdGhpcy56O1xyXG4gIHZhciBqejQgPSBqei5yZWRTcXIoKS5yZWRTcXIoKTtcclxuXHJcbiAgdmFyIGp4MiA9IGp4LnJlZFNxcigpO1xyXG4gIHZhciBqeTIgPSBqeS5yZWRTcXIoKTtcclxuXHJcbiAgdmFyIGMgPSBqeDIucmVkQWRkKGp4MikucmVkSUFkZChqeDIpLnJlZElBZGQoYS5yZWRNdWwoano0KSk7XHJcblxyXG4gIHZhciBqeGQ0ID0gangucmVkQWRkKGp4KTtcclxuICBqeGQ0ID0ganhkNC5yZWRJQWRkKGp4ZDQpO1xyXG4gIHZhciB0MSA9IGp4ZDQucmVkTXVsKGp5Mik7XHJcbiAgdmFyIG54ID0gYy5yZWRTcXIoKS5yZWRJU3ViKHQxLnJlZEFkZCh0MSkpO1xyXG4gIHZhciB0MiA9IHQxLnJlZElTdWIobngpO1xyXG5cclxuICB2YXIganlkOCA9IGp5Mi5yZWRTcXIoKTtcclxuICBqeWQ4ID0ganlkOC5yZWRJQWRkKGp5ZDgpO1xyXG4gIGp5ZDggPSBqeWQ4LnJlZElBZGQoanlkOCk7XHJcbiAganlkOCA9IGp5ZDgucmVkSUFkZChqeWQ4KTtcclxuICB2YXIgbnkgPSBjLnJlZE11bCh0MikucmVkSVN1YihqeWQ4KTtcclxuICB2YXIgbnogPSBqeS5yZWRBZGQoankpLnJlZE11bChqeik7XHJcblxyXG4gIHJldHVybiB0aGlzLmN1cnZlLmpwb2ludChueCwgbnksIG56KTtcclxufTtcclxuXHJcbkpQb2ludC5wcm90b3R5cGUudHJwbCA9IGZ1bmN0aW9uIHRycGwoKSB7XHJcbiAgaWYgKCF0aGlzLmN1cnZlLnplcm9BKVxyXG4gICAgcmV0dXJuIHRoaXMuZGJsKCkuYWRkKHRoaXMpO1xyXG5cclxuICAvLyBoeXBlcmVsbGlwdGljLm9yZy9FRkQvZzFwL2F1dG8tc2hvcnR3LWphY29iaWFuLTAuaHRtbCN0cmlwbGluZy10cGwtMjAwNy1ibFxyXG4gIC8vIDVNICsgMTBTICsgLi4uXHJcblxyXG4gIC8vIFhYID0gWDFeMlxyXG4gIHZhciB4eCA9IHRoaXMueC5yZWRTcXIoKTtcclxuICAvLyBZWSA9IFkxXjJcclxuICB2YXIgeXkgPSB0aGlzLnkucmVkU3FyKCk7XHJcbiAgLy8gWlogPSBaMV4yXHJcbiAgdmFyIHp6ID0gdGhpcy56LnJlZFNxcigpO1xyXG4gIC8vIFlZWVkgPSBZWV4yXHJcbiAgdmFyIHl5eXkgPSB5eS5yZWRTcXIoKTtcclxuICAvLyBNID0gMyAqIFhYICsgYSAqIFpaMjsgYSA9IDBcclxuICB2YXIgbSA9IHh4LnJlZEFkZCh4eCkucmVkSUFkZCh4eCk7XHJcbiAgLy8gTU0gPSBNXjJcclxuICB2YXIgbW0gPSBtLnJlZFNxcigpO1xyXG4gIC8vIEUgPSA2ICogKChYMSArIFlZKV4yIC0gWFggLSBZWVlZKSAtIE1NXHJcbiAgdmFyIGUgPSB0aGlzLngucmVkQWRkKHl5KS5yZWRTcXIoKS5yZWRJU3ViKHh4KS5yZWRJU3ViKHl5eXkpO1xyXG4gIGUgPSBlLnJlZElBZGQoZSk7XHJcbiAgZSA9IGUucmVkQWRkKGUpLnJlZElBZGQoZSk7XHJcbiAgZSA9IGUucmVkSVN1YihtbSk7XHJcbiAgLy8gRUUgPSBFXjJcclxuICB2YXIgZWUgPSBlLnJlZFNxcigpO1xyXG4gIC8vIFQgPSAxNipZWVlZXHJcbiAgdmFyIHQgPSB5eXl5LnJlZElBZGQoeXl5eSk7XHJcbiAgdCA9IHQucmVkSUFkZCh0KTtcclxuICB0ID0gdC5yZWRJQWRkKHQpO1xyXG4gIHQgPSB0LnJlZElBZGQodCk7XHJcbiAgLy8gVSA9IChNICsgRSleMiAtIE1NIC0gRUUgLSBUXHJcbiAgdmFyIHUgPSBtLnJlZElBZGQoZSkucmVkU3FyKCkucmVkSVN1YihtbSkucmVkSVN1YihlZSkucmVkSVN1Yih0KTtcclxuICAvLyBYMyA9IDQgKiAoWDEgKiBFRSAtIDQgKiBZWSAqIFUpXHJcbiAgdmFyIHl5dTQgPSB5eS5yZWRNdWwodSk7XHJcbiAgeXl1NCA9IHl5dTQucmVkSUFkZCh5eXU0KTtcclxuICB5eXU0ID0geXl1NC5yZWRJQWRkKHl5dTQpO1xyXG4gIHZhciBueCA9IHRoaXMueC5yZWRNdWwoZWUpLnJlZElTdWIoeXl1NCk7XHJcbiAgbnggPSBueC5yZWRJQWRkKG54KTtcclxuICBueCA9IG54LnJlZElBZGQobngpO1xyXG4gIC8vIFkzID0gOCAqIFkxICogKFUgKiAoVCAtIFUpIC0gRSAqIEVFKVxyXG4gIHZhciBueSA9IHRoaXMueS5yZWRNdWwodS5yZWRNdWwodC5yZWRJU3ViKHUpKS5yZWRJU3ViKGUucmVkTXVsKGVlKSkpO1xyXG4gIG55ID0gbnkucmVkSUFkZChueSk7XHJcbiAgbnkgPSBueS5yZWRJQWRkKG55KTtcclxuICBueSA9IG55LnJlZElBZGQobnkpO1xyXG4gIC8vIFozID0gKFoxICsgRSleMiAtIFpaIC0gRUVcclxuICB2YXIgbnogPSB0aGlzLnoucmVkQWRkKGUpLnJlZFNxcigpLnJlZElTdWIoenopLnJlZElTdWIoZWUpO1xyXG5cclxuICByZXR1cm4gdGhpcy5jdXJ2ZS5qcG9pbnQobngsIG55LCBueik7XHJcbn07XHJcblxyXG5KUG9pbnQucHJvdG90eXBlLm11bCA9IGZ1bmN0aW9uIG11bChrLCBrYmFzZSkge1xyXG4gIGsgPSBuZXcgQk4oaywga2Jhc2UpO1xyXG5cclxuICByZXR1cm4gdGhpcy5jdXJ2ZS5fd25hZk11bCh0aGlzLCBrKTtcclxufTtcclxuXHJcbkpQb2ludC5wcm90b3R5cGUuZXEgPSBmdW5jdGlvbiBlcShwKSB7XHJcbiAgaWYgKHAudHlwZSA9PT0gJ2FmZmluZScpXHJcbiAgICByZXR1cm4gdGhpcy5lcShwLnRvSigpKTtcclxuXHJcbiAgaWYgKHRoaXMgPT09IHApXHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuXHJcbiAgLy8geDEgKiB6Ml4yID09IHgyICogejFeMlxyXG4gIHZhciB6MiA9IHRoaXMuei5yZWRTcXIoKTtcclxuICB2YXIgcHoyID0gcC56LnJlZFNxcigpO1xyXG4gIGlmICh0aGlzLngucmVkTXVsKHB6MikucmVkSVN1YihwLngucmVkTXVsKHoyKSkuY21wbigwKSAhPT0gMClcclxuICAgIHJldHVybiBmYWxzZTtcclxuXHJcbiAgLy8geTEgKiB6Ml4zID09IHkyICogejFeM1xyXG4gIHZhciB6MyA9IHoyLnJlZE11bCh0aGlzLnopO1xyXG4gIHZhciBwejMgPSBwejIucmVkTXVsKHAueik7XHJcbiAgcmV0dXJuIHRoaXMueS5yZWRNdWwocHozKS5yZWRJU3ViKHAueS5yZWRNdWwoejMpKS5jbXBuKDApID09PSAwO1xyXG59O1xyXG5cclxuSlBvaW50LnByb3RvdHlwZS5lcVhUb1AgPSBmdW5jdGlvbiBlcVhUb1AoeCkge1xyXG4gIHZhciB6cyA9IHRoaXMuei5yZWRTcXIoKTtcclxuICB2YXIgcnggPSB4LnRvUmVkKHRoaXMuY3VydmUucmVkKS5yZWRNdWwoenMpO1xyXG4gIGlmICh0aGlzLnguY21wKHJ4KSA9PT0gMClcclxuICAgIHJldHVybiB0cnVlO1xyXG5cclxuICB2YXIgeGMgPSB4LmNsb25lKCk7XHJcbiAgdmFyIHQgPSB0aGlzLmN1cnZlLnJlZE4ucmVkTXVsKHpzKTtcclxuICBmb3IgKDs7KSB7XHJcbiAgICB4Yy5pYWRkKHRoaXMuY3VydmUubik7XHJcbiAgICBpZiAoeGMuY21wKHRoaXMuY3VydmUucCkgPj0gMClcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG5cclxuICAgIHJ4LnJlZElBZGQodCk7XHJcbiAgICBpZiAodGhpcy54LmNtcChyeCkgPT09IDApXHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxufTtcclxuXHJcbkpQb2ludC5wcm90b3R5cGUuaW5zcGVjdCA9IGZ1bmN0aW9uIGluc3BlY3QoKSB7XHJcbiAgaWYgKHRoaXMuaXNJbmZpbml0eSgpKVxyXG4gICAgcmV0dXJuICc8RUMgSlBvaW50IEluZmluaXR5Pic7XHJcbiAgcmV0dXJuICc8RUMgSlBvaW50IHg6ICcgKyB0aGlzLngudG9TdHJpbmcoMTYsIDIpICtcclxuICAgICAgJyB5OiAnICsgdGhpcy55LnRvU3RyaW5nKDE2LCAyKSArXHJcbiAgICAgICcgejogJyArIHRoaXMuei50b1N0cmluZygxNiwgMikgKyAnPic7XHJcbn07XHJcblxyXG5KUG9pbnQucHJvdG90eXBlLmlzSW5maW5pdHkgPSBmdW5jdGlvbiBpc0luZmluaXR5KCkge1xyXG4gIC8vIFhYWCBUaGlzIGNvZGUgYXNzdW1lcyB0aGF0IHplcm8gaXMgYWx3YXlzIHplcm8gaW4gcmVkXHJcbiAgcmV0dXJuIHRoaXMuei5jbXBuKDApID09PSAwO1xyXG59O1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgZWxsaXB0aWMgPSBleHBvcnRzO1xyXG5cclxuZWxsaXB0aWMudmVyc2lvbiA9IHJlcXVpcmUoJy4uL3BhY2thZ2UuanNvbicpLnZlcnNpb247XHJcbmVsbGlwdGljLnV0aWxzID0gcmVxdWlyZSgnLi9lbGxpcHRpYy91dGlscycpO1xyXG5lbGxpcHRpYy5yYW5kID0gcmVxdWlyZSgnYnJvcmFuZCcpO1xyXG5lbGxpcHRpYy5jdXJ2ZSA9IHJlcXVpcmUoJy4vZWxsaXB0aWMvY3VydmUnKTtcclxuZWxsaXB0aWMuY3VydmVzID0gcmVxdWlyZSgnLi9lbGxpcHRpYy9jdXJ2ZXMnKTtcclxuXHJcbi8vIFByb3RvY29sc1xyXG5lbGxpcHRpYy5lYyA9IHJlcXVpcmUoJy4vZWxsaXB0aWMvZWMnKTtcclxuZWxsaXB0aWMuZWRkc2EgPSByZXF1aXJlKCcuL2VsbGlwdGljL2VkZHNhJyk7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBlbGxpcHRpYyA9IHJlcXVpcmUoJy4uLy4uL2VsbGlwdGljJyk7XHJcbnZhciB1dGlscyA9IGVsbGlwdGljLnV0aWxzO1xyXG52YXIgYXNzZXJ0ID0gdXRpbHMuYXNzZXJ0O1xyXG52YXIgcGFyc2VCeXRlcyA9IHV0aWxzLnBhcnNlQnl0ZXM7XHJcbnZhciBjYWNoZWRQcm9wZXJ0eSA9IHV0aWxzLmNhY2hlZFByb3BlcnR5O1xyXG5cclxuLyoqXHJcbiogQHBhcmFtIHtFRERTQX0gZWRkc2EgLSBpbnN0YW5jZVxyXG4qIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXMgLSBwdWJsaWMvcHJpdmF0ZSBrZXkgcGFyYW1ldGVyc1xyXG4qXHJcbiogQHBhcmFtIHtBcnJheTxCeXRlPn0gW3BhcmFtcy5zZWNyZXRdIC0gc2VjcmV0IHNlZWQgYnl0ZXNcclxuKiBAcGFyYW0ge1BvaW50fSBbcGFyYW1zLnB1Yl0gLSBwdWJsaWMga2V5IHBvaW50IChha2EgYEFgIGluIGVkZHNhIHRlcm1zKVxyXG4qIEBwYXJhbSB7QXJyYXk8Qnl0ZT59IFtwYXJhbXMucHViXSAtIHB1YmxpYyBrZXkgcG9pbnQgZW5jb2RlZCBhcyBieXRlc1xyXG4qXHJcbiovXHJcbmZ1bmN0aW9uIEtleVBhaXIoZWRkc2EsIHBhcmFtcykge1xyXG4gIHRoaXMuZWRkc2EgPSBlZGRzYTtcclxuICB0aGlzLl9zZWNyZXQgPSBwYXJzZUJ5dGVzKHBhcmFtcy5zZWNyZXQpO1xyXG4gIGlmIChlZGRzYS5pc1BvaW50KHBhcmFtcy5wdWIpKVxyXG4gICAgdGhpcy5fcHViID0gcGFyYW1zLnB1YjtcclxuICBlbHNlXHJcbiAgICB0aGlzLl9wdWJCeXRlcyA9IHBhcnNlQnl0ZXMocGFyYW1zLnB1Yik7XHJcbn1cclxuXHJcbktleVBhaXIuZnJvbVB1YmxpYyA9IGZ1bmN0aW9uIGZyb21QdWJsaWMoZWRkc2EsIHB1Yikge1xyXG4gIGlmIChwdWIgaW5zdGFuY2VvZiBLZXlQYWlyKVxyXG4gICAgcmV0dXJuIHB1YjtcclxuICByZXR1cm4gbmV3IEtleVBhaXIoZWRkc2EsIHsgcHViOiBwdWIgfSk7XHJcbn07XHJcblxyXG5LZXlQYWlyLmZyb21TZWNyZXQgPSBmdW5jdGlvbiBmcm9tU2VjcmV0KGVkZHNhLCBzZWNyZXQpIHtcclxuICBpZiAoc2VjcmV0IGluc3RhbmNlb2YgS2V5UGFpcilcclxuICAgIHJldHVybiBzZWNyZXQ7XHJcbiAgcmV0dXJuIG5ldyBLZXlQYWlyKGVkZHNhLCB7IHNlY3JldDogc2VjcmV0IH0pO1xyXG59O1xyXG5cclxuS2V5UGFpci5wcm90b3R5cGUuc2VjcmV0ID0gZnVuY3Rpb24gc2VjcmV0KCkge1xyXG4gIHJldHVybiB0aGlzLl9zZWNyZXQ7XHJcbn07XHJcblxyXG5jYWNoZWRQcm9wZXJ0eShLZXlQYWlyLCAncHViQnl0ZXMnLCBmdW5jdGlvbiBwdWJCeXRlcygpIHtcclxuICByZXR1cm4gdGhpcy5lZGRzYS5lbmNvZGVQb2ludCh0aGlzLnB1YigpKTtcclxufSk7XHJcblxyXG5jYWNoZWRQcm9wZXJ0eShLZXlQYWlyLCAncHViJywgZnVuY3Rpb24gcHViKCkge1xyXG4gIGlmICh0aGlzLl9wdWJCeXRlcylcclxuICAgIHJldHVybiB0aGlzLmVkZHNhLmRlY29kZVBvaW50KHRoaXMuX3B1YkJ5dGVzKTtcclxuICByZXR1cm4gdGhpcy5lZGRzYS5nLm11bCh0aGlzLnByaXYoKSk7XHJcbn0pO1xyXG5cclxuY2FjaGVkUHJvcGVydHkoS2V5UGFpciwgJ3ByaXZCeXRlcycsIGZ1bmN0aW9uIHByaXZCeXRlcygpIHtcclxuICB2YXIgZWRkc2EgPSB0aGlzLmVkZHNhO1xyXG4gIHZhciBoYXNoID0gdGhpcy5oYXNoKCk7XHJcbiAgdmFyIGxhc3RJeCA9IGVkZHNhLmVuY29kaW5nTGVuZ3RoIC0gMTtcclxuXHJcbiAgdmFyIGEgPSBoYXNoLnNsaWNlKDAsIGVkZHNhLmVuY29kaW5nTGVuZ3RoKTtcclxuICBhWzBdICY9IDI0ODtcclxuICBhW2xhc3RJeF0gJj0gMTI3O1xyXG4gIGFbbGFzdEl4XSB8PSA2NDtcclxuXHJcbiAgcmV0dXJuIGE7XHJcbn0pO1xyXG5cclxuY2FjaGVkUHJvcGVydHkoS2V5UGFpciwgJ3ByaXYnLCBmdW5jdGlvbiBwcml2KCkge1xyXG4gIHJldHVybiB0aGlzLmVkZHNhLmRlY29kZUludCh0aGlzLnByaXZCeXRlcygpKTtcclxufSk7XHJcblxyXG5jYWNoZWRQcm9wZXJ0eShLZXlQYWlyLCAnaGFzaCcsIGZ1bmN0aW9uIGhhc2goKSB7XHJcbiAgcmV0dXJuIHRoaXMuZWRkc2EuaGFzaCgpLnVwZGF0ZSh0aGlzLnNlY3JldCgpKS5kaWdlc3QoKTtcclxufSk7XHJcblxyXG5jYWNoZWRQcm9wZXJ0eShLZXlQYWlyLCAnbWVzc2FnZVByZWZpeCcsIGZ1bmN0aW9uIG1lc3NhZ2VQcmVmaXgoKSB7XHJcbiAgcmV0dXJuIHRoaXMuaGFzaCgpLnNsaWNlKHRoaXMuZWRkc2EuZW5jb2RpbmdMZW5ndGgpO1xyXG59KTtcclxuXHJcbktleVBhaXIucHJvdG90eXBlLnNpZ24gPSBmdW5jdGlvbiBzaWduKG1lc3NhZ2UpIHtcclxuICBhc3NlcnQodGhpcy5fc2VjcmV0LCAnS2V5UGFpciBjYW4gb25seSB2ZXJpZnknKTtcclxuICByZXR1cm4gdGhpcy5lZGRzYS5zaWduKG1lc3NhZ2UsIHRoaXMpO1xyXG59O1xyXG5cclxuS2V5UGFpci5wcm90b3R5cGUudmVyaWZ5ID0gZnVuY3Rpb24gdmVyaWZ5KG1lc3NhZ2UsIHNpZykge1xyXG4gIHJldHVybiB0aGlzLmVkZHNhLnZlcmlmeShtZXNzYWdlLCBzaWcsIHRoaXMpO1xyXG59O1xyXG5cclxuS2V5UGFpci5wcm90b3R5cGUuZ2V0U2VjcmV0ID0gZnVuY3Rpb24gZ2V0U2VjcmV0KGVuYykge1xyXG4gIGFzc2VydCh0aGlzLl9zZWNyZXQsICdLZXlQYWlyIGlzIHB1YmxpYyBvbmx5Jyk7XHJcbiAgcmV0dXJuIHV0aWxzLmVuY29kZSh0aGlzLnNlY3JldCgpLCBlbmMpO1xyXG59O1xyXG5cclxuS2V5UGFpci5wcm90b3R5cGUuZ2V0UHVibGljID0gZnVuY3Rpb24gZ2V0UHVibGljKGVuYykge1xyXG4gIHJldHVybiB1dGlscy5lbmNvZGUodGhpcy5wdWJCeXRlcygpLCBlbmMpO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBLZXlQYWlyO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgY3VydmUgPSByZXF1aXJlKCcuLi9jdXJ2ZScpO1xyXG52YXIgZWxsaXB0aWMgPSByZXF1aXJlKCcuLi8uLi9lbGxpcHRpYycpO1xyXG52YXIgQk4gPSByZXF1aXJlKCdibi5qcycpO1xyXG52YXIgaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xyXG52YXIgQmFzZSA9IGN1cnZlLmJhc2U7XHJcblxyXG52YXIgYXNzZXJ0ID0gZWxsaXB0aWMudXRpbHMuYXNzZXJ0O1xyXG5cclxuZnVuY3Rpb24gRWR3YXJkc0N1cnZlKGNvbmYpIHtcclxuICAvLyBOT1RFOiBJbXBvcnRhbnQgYXMgd2UgYXJlIGNyZWF0aW5nIHBvaW50IGluIEJhc2UuY2FsbCgpXHJcbiAgdGhpcy50d2lzdGVkID0gKGNvbmYuYSB8IDApICE9PSAxO1xyXG4gIHRoaXMubU9uZUEgPSB0aGlzLnR3aXN0ZWQgJiYgKGNvbmYuYSB8IDApID09PSAtMTtcclxuICB0aGlzLmV4dGVuZGVkID0gdGhpcy5tT25lQTtcclxuXHJcbiAgQmFzZS5jYWxsKHRoaXMsICdlZHdhcmRzJywgY29uZik7XHJcblxyXG4gIHRoaXMuYSA9IG5ldyBCTihjb25mLmEsIDE2KS51bW9kKHRoaXMucmVkLm0pO1xyXG4gIHRoaXMuYSA9IHRoaXMuYS50b1JlZCh0aGlzLnJlZCk7XHJcbiAgdGhpcy5jID0gbmV3IEJOKGNvbmYuYywgMTYpLnRvUmVkKHRoaXMucmVkKTtcclxuICB0aGlzLmMyID0gdGhpcy5jLnJlZFNxcigpO1xyXG4gIHRoaXMuZCA9IG5ldyBCTihjb25mLmQsIDE2KS50b1JlZCh0aGlzLnJlZCk7XHJcbiAgdGhpcy5kZCA9IHRoaXMuZC5yZWRBZGQodGhpcy5kKTtcclxuXHJcbiAgYXNzZXJ0KCF0aGlzLnR3aXN0ZWQgfHwgdGhpcy5jLmZyb21SZWQoKS5jbXBuKDEpID09PSAwKTtcclxuICB0aGlzLm9uZUMgPSAoY29uZi5jIHwgMCkgPT09IDE7XHJcbn1cclxuaW5oZXJpdHMoRWR3YXJkc0N1cnZlLCBCYXNlKTtcclxubW9kdWxlLmV4cG9ydHMgPSBFZHdhcmRzQ3VydmU7XHJcblxyXG5FZHdhcmRzQ3VydmUucHJvdG90eXBlLl9tdWxBID0gZnVuY3Rpb24gX211bEEobnVtKSB7XHJcbiAgaWYgKHRoaXMubU9uZUEpXHJcbiAgICByZXR1cm4gbnVtLnJlZE5lZygpO1xyXG4gIGVsc2VcclxuICAgIHJldHVybiB0aGlzLmEucmVkTXVsKG51bSk7XHJcbn07XHJcblxyXG5FZHdhcmRzQ3VydmUucHJvdG90eXBlLl9tdWxDID0gZnVuY3Rpb24gX211bEMobnVtKSB7XHJcbiAgaWYgKHRoaXMub25lQylcclxuICAgIHJldHVybiBudW07XHJcbiAgZWxzZVxyXG4gICAgcmV0dXJuIHRoaXMuYy5yZWRNdWwobnVtKTtcclxufTtcclxuXHJcbi8vIEp1c3QgZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBTaG9ydCBjdXJ2ZVxyXG5FZHdhcmRzQ3VydmUucHJvdG90eXBlLmpwb2ludCA9IGZ1bmN0aW9uIGpwb2ludCh4LCB5LCB6LCB0KSB7XHJcbiAgcmV0dXJuIHRoaXMucG9pbnQoeCwgeSwgeiwgdCk7XHJcbn07XHJcblxyXG5FZHdhcmRzQ3VydmUucHJvdG90eXBlLnBvaW50RnJvbVggPSBmdW5jdGlvbiBwb2ludEZyb21YKHgsIG9kZCkge1xyXG4gIHggPSBuZXcgQk4oeCwgMTYpO1xyXG4gIGlmICgheC5yZWQpXHJcbiAgICB4ID0geC50b1JlZCh0aGlzLnJlZCk7XHJcblxyXG4gIHZhciB4MiA9IHgucmVkU3FyKCk7XHJcbiAgdmFyIHJocyA9IHRoaXMuYzIucmVkU3ViKHRoaXMuYS5yZWRNdWwoeDIpKTtcclxuICB2YXIgbGhzID0gdGhpcy5vbmUucmVkU3ViKHRoaXMuYzIucmVkTXVsKHRoaXMuZCkucmVkTXVsKHgyKSk7XHJcblxyXG4gIHZhciB5MiA9IHJocy5yZWRNdWwobGhzLnJlZEludm0oKSk7XHJcbiAgdmFyIHkgPSB5Mi5yZWRTcXJ0KCk7XHJcbiAgaWYgKHkucmVkU3FyKCkucmVkU3ViKHkyKS5jbXAodGhpcy56ZXJvKSAhPT0gMClcclxuICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCBwb2ludCcpO1xyXG5cclxuICB2YXIgaXNPZGQgPSB5LmZyb21SZWQoKS5pc09kZCgpO1xyXG4gIGlmIChvZGQgJiYgIWlzT2RkIHx8ICFvZGQgJiYgaXNPZGQpXHJcbiAgICB5ID0geS5yZWROZWcoKTtcclxuXHJcbiAgcmV0dXJuIHRoaXMucG9pbnQoeCwgeSk7XHJcbn07XHJcblxyXG5FZHdhcmRzQ3VydmUucHJvdG90eXBlLnBvaW50RnJvbVkgPSBmdW5jdGlvbiBwb2ludEZyb21ZKHksIG9kZCkge1xyXG4gIHkgPSBuZXcgQk4oeSwgMTYpO1xyXG4gIGlmICgheS5yZWQpXHJcbiAgICB5ID0geS50b1JlZCh0aGlzLnJlZCk7XHJcblxyXG4gIC8vIHheMiA9ICh5XjIgLSBjXjIpIC8gKGNeMiBkIHleMiAtIGEpXHJcbiAgdmFyIHkyID0geS5yZWRTcXIoKTtcclxuICB2YXIgbGhzID0geTIucmVkU3ViKHRoaXMuYzIpO1xyXG4gIHZhciByaHMgPSB5Mi5yZWRNdWwodGhpcy5kKS5yZWRNdWwodGhpcy5jMikucmVkU3ViKHRoaXMuYSk7XHJcbiAgdmFyIHgyID0gbGhzLnJlZE11bChyaHMucmVkSW52bSgpKTtcclxuXHJcbiAgaWYgKHgyLmNtcCh0aGlzLnplcm8pID09PSAwKSB7XHJcbiAgICBpZiAob2RkKVxyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgcG9pbnQnKTtcclxuICAgIGVsc2VcclxuICAgICAgcmV0dXJuIHRoaXMucG9pbnQodGhpcy56ZXJvLCB5KTtcclxuICB9XHJcblxyXG4gIHZhciB4ID0geDIucmVkU3FydCgpO1xyXG4gIGlmICh4LnJlZFNxcigpLnJlZFN1Yih4MikuY21wKHRoaXMuemVybykgIT09IDApXHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgcG9pbnQnKTtcclxuXHJcbiAgaWYgKHguZnJvbVJlZCgpLmlzT2RkKCkgIT09IG9kZClcclxuICAgIHggPSB4LnJlZE5lZygpO1xyXG5cclxuICByZXR1cm4gdGhpcy5wb2ludCh4LCB5KTtcclxufTtcclxuXHJcbkVkd2FyZHNDdXJ2ZS5wcm90b3R5cGUudmFsaWRhdGUgPSBmdW5jdGlvbiB2YWxpZGF0ZShwb2ludCkge1xyXG4gIGlmIChwb2ludC5pc0luZmluaXR5KCkpXHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuXHJcbiAgLy8gQ3VydmU6IEEgKiBYXjIgKyBZXjIgPSBDXjIgKiAoMSArIEQgKiBYXjIgKiBZXjIpXHJcbiAgcG9pbnQubm9ybWFsaXplKCk7XHJcblxyXG4gIHZhciB4MiA9IHBvaW50LngucmVkU3FyKCk7XHJcbiAgdmFyIHkyID0gcG9pbnQueS5yZWRTcXIoKTtcclxuICB2YXIgbGhzID0geDIucmVkTXVsKHRoaXMuYSkucmVkQWRkKHkyKTtcclxuICB2YXIgcmhzID0gdGhpcy5jMi5yZWRNdWwodGhpcy5vbmUucmVkQWRkKHRoaXMuZC5yZWRNdWwoeDIpLnJlZE11bCh5MikpKTtcclxuXHJcbiAgcmV0dXJuIGxocy5jbXAocmhzKSA9PT0gMDtcclxufTtcclxuXHJcbmZ1bmN0aW9uIFBvaW50KGN1cnZlLCB4LCB5LCB6LCB0KSB7XHJcbiAgQmFzZS5CYXNlUG9pbnQuY2FsbCh0aGlzLCBjdXJ2ZSwgJ3Byb2plY3RpdmUnKTtcclxuICBpZiAoeCA9PT0gbnVsbCAmJiB5ID09PSBudWxsICYmIHogPT09IG51bGwpIHtcclxuICAgIHRoaXMueCA9IHRoaXMuY3VydmUuemVybztcclxuICAgIHRoaXMueSA9IHRoaXMuY3VydmUub25lO1xyXG4gICAgdGhpcy56ID0gdGhpcy5jdXJ2ZS5vbmU7XHJcbiAgICB0aGlzLnQgPSB0aGlzLmN1cnZlLnplcm87XHJcbiAgICB0aGlzLnpPbmUgPSB0cnVlO1xyXG4gIH0gZWxzZSB7XHJcbiAgICB0aGlzLnggPSBuZXcgQk4oeCwgMTYpO1xyXG4gICAgdGhpcy55ID0gbmV3IEJOKHksIDE2KTtcclxuICAgIHRoaXMueiA9IHogPyBuZXcgQk4oeiwgMTYpIDogdGhpcy5jdXJ2ZS5vbmU7XHJcbiAgICB0aGlzLnQgPSB0ICYmIG5ldyBCTih0LCAxNik7XHJcbiAgICBpZiAoIXRoaXMueC5yZWQpXHJcbiAgICAgIHRoaXMueCA9IHRoaXMueC50b1JlZCh0aGlzLmN1cnZlLnJlZCk7XHJcbiAgICBpZiAoIXRoaXMueS5yZWQpXHJcbiAgICAgIHRoaXMueSA9IHRoaXMueS50b1JlZCh0aGlzLmN1cnZlLnJlZCk7XHJcbiAgICBpZiAoIXRoaXMuei5yZWQpXHJcbiAgICAgIHRoaXMueiA9IHRoaXMuei50b1JlZCh0aGlzLmN1cnZlLnJlZCk7XHJcbiAgICBpZiAodGhpcy50ICYmICF0aGlzLnQucmVkKVxyXG4gICAgICB0aGlzLnQgPSB0aGlzLnQudG9SZWQodGhpcy5jdXJ2ZS5yZWQpO1xyXG4gICAgdGhpcy56T25lID0gdGhpcy56ID09PSB0aGlzLmN1cnZlLm9uZTtcclxuXHJcbiAgICAvLyBVc2UgZXh0ZW5kZWQgY29vcmRpbmF0ZXNcclxuICAgIGlmICh0aGlzLmN1cnZlLmV4dGVuZGVkICYmICF0aGlzLnQpIHtcclxuICAgICAgdGhpcy50ID0gdGhpcy54LnJlZE11bCh0aGlzLnkpO1xyXG4gICAgICBpZiAoIXRoaXMuek9uZSlcclxuICAgICAgICB0aGlzLnQgPSB0aGlzLnQucmVkTXVsKHRoaXMuei5yZWRJbnZtKCkpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5pbmhlcml0cyhQb2ludCwgQmFzZS5CYXNlUG9pbnQpO1xyXG5cclxuRWR3YXJkc0N1cnZlLnByb3RvdHlwZS5wb2ludEZyb21KU09OID0gZnVuY3Rpb24gcG9pbnRGcm9tSlNPTihvYmopIHtcclxuICByZXR1cm4gUG9pbnQuZnJvbUpTT04odGhpcywgb2JqKTtcclxufTtcclxuXHJcbkVkd2FyZHNDdXJ2ZS5wcm90b3R5cGUucG9pbnQgPSBmdW5jdGlvbiBwb2ludCh4LCB5LCB6LCB0KSB7XHJcbiAgcmV0dXJuIG5ldyBQb2ludCh0aGlzLCB4LCB5LCB6LCB0KTtcclxufTtcclxuXHJcblBvaW50LmZyb21KU09OID0gZnVuY3Rpb24gZnJvbUpTT04oY3VydmUsIG9iaikge1xyXG4gIHJldHVybiBuZXcgUG9pbnQoY3VydmUsIG9ialswXSwgb2JqWzFdLCBvYmpbMl0pO1xyXG59O1xyXG5cclxuUG9pbnQucHJvdG90eXBlLmluc3BlY3QgPSBmdW5jdGlvbiBpbnNwZWN0KCkge1xyXG4gIGlmICh0aGlzLmlzSW5maW5pdHkoKSlcclxuICAgIHJldHVybiAnPEVDIFBvaW50IEluZmluaXR5Pic7XHJcbiAgcmV0dXJuICc8RUMgUG9pbnQgeDogJyArIHRoaXMueC5mcm9tUmVkKCkudG9TdHJpbmcoMTYsIDIpICtcclxuICAgICAgJyB5OiAnICsgdGhpcy55LmZyb21SZWQoKS50b1N0cmluZygxNiwgMikgK1xyXG4gICAgICAnIHo6ICcgKyB0aGlzLnouZnJvbVJlZCgpLnRvU3RyaW5nKDE2LCAyKSArICc+JztcclxufTtcclxuXHJcblBvaW50LnByb3RvdHlwZS5pc0luZmluaXR5ID0gZnVuY3Rpb24gaXNJbmZpbml0eSgpIHtcclxuICAvLyBYWFggVGhpcyBjb2RlIGFzc3VtZXMgdGhhdCB6ZXJvIGlzIGFsd2F5cyB6ZXJvIGluIHJlZFxyXG4gIHJldHVybiB0aGlzLnguY21wbigwKSA9PT0gMCAmJlxyXG4gICAgKHRoaXMueS5jbXAodGhpcy56KSA9PT0gMCB8fFxyXG4gICAgKHRoaXMuek9uZSAmJiB0aGlzLnkuY21wKHRoaXMuY3VydmUuYykgPT09IDApKTtcclxufTtcclxuXHJcblBvaW50LnByb3RvdHlwZS5fZXh0RGJsID0gZnVuY3Rpb24gX2V4dERibCgpIHtcclxuICAvLyBoeXBlcmVsbGlwdGljLm9yZy9FRkQvZzFwL2F1dG8tdHdpc3RlZC1leHRlbmRlZC0xLmh0bWxcclxuICAvLyAgICAgI2RvdWJsaW5nLWRibC0yMDA4LWh3Y2RcclxuICAvLyA0TSArIDRTXHJcblxyXG4gIC8vIEEgPSBYMV4yXHJcbiAgdmFyIGEgPSB0aGlzLngucmVkU3FyKCk7XHJcbiAgLy8gQiA9IFkxXjJcclxuICB2YXIgYiA9IHRoaXMueS5yZWRTcXIoKTtcclxuICAvLyBDID0gMiAqIFoxXjJcclxuICB2YXIgYyA9IHRoaXMuei5yZWRTcXIoKTtcclxuICBjID0gYy5yZWRJQWRkKGMpO1xyXG4gIC8vIEQgPSBhICogQVxyXG4gIHZhciBkID0gdGhpcy5jdXJ2ZS5fbXVsQShhKTtcclxuICAvLyBFID0gKFgxICsgWTEpXjIgLSBBIC0gQlxyXG4gIHZhciBlID0gdGhpcy54LnJlZEFkZCh0aGlzLnkpLnJlZFNxcigpLnJlZElTdWIoYSkucmVkSVN1YihiKTtcclxuICAvLyBHID0gRCArIEJcclxuICB2YXIgZyA9IGQucmVkQWRkKGIpO1xyXG4gIC8vIEYgPSBHIC0gQ1xyXG4gIHZhciBmID0gZy5yZWRTdWIoYyk7XHJcbiAgLy8gSCA9IEQgLSBCXHJcbiAgdmFyIGggPSBkLnJlZFN1YihiKTtcclxuICAvLyBYMyA9IEUgKiBGXHJcbiAgdmFyIG54ID0gZS5yZWRNdWwoZik7XHJcbiAgLy8gWTMgPSBHICogSFxyXG4gIHZhciBueSA9IGcucmVkTXVsKGgpO1xyXG4gIC8vIFQzID0gRSAqIEhcclxuICB2YXIgbnQgPSBlLnJlZE11bChoKTtcclxuICAvLyBaMyA9IEYgKiBHXHJcbiAgdmFyIG56ID0gZi5yZWRNdWwoZyk7XHJcbiAgcmV0dXJuIHRoaXMuY3VydmUucG9pbnQobngsIG55LCBueiwgbnQpO1xyXG59O1xyXG5cclxuUG9pbnQucHJvdG90eXBlLl9wcm9qRGJsID0gZnVuY3Rpb24gX3Byb2pEYmwoKSB7XHJcbiAgLy8gaHlwZXJlbGxpcHRpYy5vcmcvRUZEL2cxcC9hdXRvLXR3aXN0ZWQtcHJvamVjdGl2ZS5odG1sXHJcbiAgLy8gICAgICNkb3VibGluZy1kYmwtMjAwOC1iYmpscFxyXG4gIC8vICAgICAjZG91YmxpbmctZGJsLTIwMDctYmxcclxuICAvLyBhbmQgb3RoZXJzXHJcbiAgLy8gR2VuZXJhbGx5IDNNICsgNFMgb3IgMk0gKyA0U1xyXG5cclxuICAvLyBCID0gKFgxICsgWTEpXjJcclxuICB2YXIgYiA9IHRoaXMueC5yZWRBZGQodGhpcy55KS5yZWRTcXIoKTtcclxuICAvLyBDID0gWDFeMlxyXG4gIHZhciBjID0gdGhpcy54LnJlZFNxcigpO1xyXG4gIC8vIEQgPSBZMV4yXHJcbiAgdmFyIGQgPSB0aGlzLnkucmVkU3FyKCk7XHJcblxyXG4gIHZhciBueDtcclxuICB2YXIgbnk7XHJcbiAgdmFyIG56O1xyXG4gIGlmICh0aGlzLmN1cnZlLnR3aXN0ZWQpIHtcclxuICAgIC8vIEUgPSBhICogQ1xyXG4gICAgdmFyIGUgPSB0aGlzLmN1cnZlLl9tdWxBKGMpO1xyXG4gICAgLy8gRiA9IEUgKyBEXHJcbiAgICB2YXIgZiA9IGUucmVkQWRkKGQpO1xyXG4gICAgaWYgKHRoaXMuek9uZSkge1xyXG4gICAgICAvLyBYMyA9IChCIC0gQyAtIEQpICogKEYgLSAyKVxyXG4gICAgICBueCA9IGIucmVkU3ViKGMpLnJlZFN1YihkKS5yZWRNdWwoZi5yZWRTdWIodGhpcy5jdXJ2ZS50d28pKTtcclxuICAgICAgLy8gWTMgPSBGICogKEUgLSBEKVxyXG4gICAgICBueSA9IGYucmVkTXVsKGUucmVkU3ViKGQpKTtcclxuICAgICAgLy8gWjMgPSBGXjIgLSAyICogRlxyXG4gICAgICBueiA9IGYucmVkU3FyKCkucmVkU3ViKGYpLnJlZFN1YihmKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIC8vIEggPSBaMV4yXHJcbiAgICAgIHZhciBoID0gdGhpcy56LnJlZFNxcigpO1xyXG4gICAgICAvLyBKID0gRiAtIDIgKiBIXHJcbiAgICAgIHZhciBqID0gZi5yZWRTdWIoaCkucmVkSVN1YihoKTtcclxuICAgICAgLy8gWDMgPSAoQi1DLUQpKkpcclxuICAgICAgbnggPSBiLnJlZFN1YihjKS5yZWRJU3ViKGQpLnJlZE11bChqKTtcclxuICAgICAgLy8gWTMgPSBGICogKEUgLSBEKVxyXG4gICAgICBueSA9IGYucmVkTXVsKGUucmVkU3ViKGQpKTtcclxuICAgICAgLy8gWjMgPSBGICogSlxyXG4gICAgICBueiA9IGYucmVkTXVsKGopO1xyXG4gICAgfVxyXG4gIH0gZWxzZSB7XHJcbiAgICAvLyBFID0gQyArIERcclxuICAgIHZhciBlID0gYy5yZWRBZGQoZCk7XHJcbiAgICAvLyBIID0gKGMgKiBaMSleMlxyXG4gICAgdmFyIGggPSB0aGlzLmN1cnZlLl9tdWxDKHRoaXMueikucmVkU3FyKCk7XHJcbiAgICAvLyBKID0gRSAtIDIgKiBIXHJcbiAgICB2YXIgaiA9IGUucmVkU3ViKGgpLnJlZFN1YihoKTtcclxuICAgIC8vIFgzID0gYyAqIChCIC0gRSkgKiBKXHJcbiAgICBueCA9IHRoaXMuY3VydmUuX211bEMoYi5yZWRJU3ViKGUpKS5yZWRNdWwoaik7XHJcbiAgICAvLyBZMyA9IGMgKiBFICogKEMgLSBEKVxyXG4gICAgbnkgPSB0aGlzLmN1cnZlLl9tdWxDKGUpLnJlZE11bChjLnJlZElTdWIoZCkpO1xyXG4gICAgLy8gWjMgPSBFICogSlxyXG4gICAgbnogPSBlLnJlZE11bChqKTtcclxuICB9XHJcbiAgcmV0dXJuIHRoaXMuY3VydmUucG9pbnQobngsIG55LCBueik7XHJcbn07XHJcblxyXG5Qb2ludC5wcm90b3R5cGUuZGJsID0gZnVuY3Rpb24gZGJsKCkge1xyXG4gIGlmICh0aGlzLmlzSW5maW5pdHkoKSlcclxuICAgIHJldHVybiB0aGlzO1xyXG5cclxuICAvLyBEb3VibGUgaW4gZXh0ZW5kZWQgY29vcmRpbmF0ZXNcclxuICBpZiAodGhpcy5jdXJ2ZS5leHRlbmRlZClcclxuICAgIHJldHVybiB0aGlzLl9leHREYmwoKTtcclxuICBlbHNlXHJcbiAgICByZXR1cm4gdGhpcy5fcHJvakRibCgpO1xyXG59O1xyXG5cclxuUG9pbnQucHJvdG90eXBlLl9leHRBZGQgPSBmdW5jdGlvbiBfZXh0QWRkKHApIHtcclxuICAvLyBoeXBlcmVsbGlwdGljLm9yZy9FRkQvZzFwL2F1dG8tdHdpc3RlZC1leHRlbmRlZC0xLmh0bWxcclxuICAvLyAgICAgI2FkZGl0aW9uLWFkZC0yMDA4LWh3Y2QtM1xyXG4gIC8vIDhNXHJcblxyXG4gIC8vIEEgPSAoWTEgLSBYMSkgKiAoWTIgLSBYMilcclxuICB2YXIgYSA9IHRoaXMueS5yZWRTdWIodGhpcy54KS5yZWRNdWwocC55LnJlZFN1YihwLngpKTtcclxuICAvLyBCID0gKFkxICsgWDEpICogKFkyICsgWDIpXHJcbiAgdmFyIGIgPSB0aGlzLnkucmVkQWRkKHRoaXMueCkucmVkTXVsKHAueS5yZWRBZGQocC54KSk7XHJcbiAgLy8gQyA9IFQxICogayAqIFQyXHJcbiAgdmFyIGMgPSB0aGlzLnQucmVkTXVsKHRoaXMuY3VydmUuZGQpLnJlZE11bChwLnQpO1xyXG4gIC8vIEQgPSBaMSAqIDIgKiBaMlxyXG4gIHZhciBkID0gdGhpcy56LnJlZE11bChwLnoucmVkQWRkKHAueikpO1xyXG4gIC8vIEUgPSBCIC0gQVxyXG4gIHZhciBlID0gYi5yZWRTdWIoYSk7XHJcbiAgLy8gRiA9IEQgLSBDXHJcbiAgdmFyIGYgPSBkLnJlZFN1YihjKTtcclxuICAvLyBHID0gRCArIENcclxuICB2YXIgZyA9IGQucmVkQWRkKGMpO1xyXG4gIC8vIEggPSBCICsgQVxyXG4gIHZhciBoID0gYi5yZWRBZGQoYSk7XHJcbiAgLy8gWDMgPSBFICogRlxyXG4gIHZhciBueCA9IGUucmVkTXVsKGYpO1xyXG4gIC8vIFkzID0gRyAqIEhcclxuICB2YXIgbnkgPSBnLnJlZE11bChoKTtcclxuICAvLyBUMyA9IEUgKiBIXHJcbiAgdmFyIG50ID0gZS5yZWRNdWwoaCk7XHJcbiAgLy8gWjMgPSBGICogR1xyXG4gIHZhciBueiA9IGYucmVkTXVsKGcpO1xyXG4gIHJldHVybiB0aGlzLmN1cnZlLnBvaW50KG54LCBueSwgbnosIG50KTtcclxufTtcclxuXHJcblBvaW50LnByb3RvdHlwZS5fcHJvakFkZCA9IGZ1bmN0aW9uIF9wcm9qQWRkKHApIHtcclxuICAvLyBoeXBlcmVsbGlwdGljLm9yZy9FRkQvZzFwL2F1dG8tdHdpc3RlZC1wcm9qZWN0aXZlLmh0bWxcclxuICAvLyAgICAgI2FkZGl0aW9uLWFkZC0yMDA4LWJiamxwXHJcbiAgLy8gICAgICNhZGRpdGlvbi1hZGQtMjAwNy1ibFxyXG4gIC8vIDEwTSArIDFTXHJcblxyXG4gIC8vIEEgPSBaMSAqIFoyXHJcbiAgdmFyIGEgPSB0aGlzLnoucmVkTXVsKHAueik7XHJcbiAgLy8gQiA9IEFeMlxyXG4gIHZhciBiID0gYS5yZWRTcXIoKTtcclxuICAvLyBDID0gWDEgKiBYMlxyXG4gIHZhciBjID0gdGhpcy54LnJlZE11bChwLngpO1xyXG4gIC8vIEQgPSBZMSAqIFkyXHJcbiAgdmFyIGQgPSB0aGlzLnkucmVkTXVsKHAueSk7XHJcbiAgLy8gRSA9IGQgKiBDICogRFxyXG4gIHZhciBlID0gdGhpcy5jdXJ2ZS5kLnJlZE11bChjKS5yZWRNdWwoZCk7XHJcbiAgLy8gRiA9IEIgLSBFXHJcbiAgdmFyIGYgPSBiLnJlZFN1YihlKTtcclxuICAvLyBHID0gQiArIEVcclxuICB2YXIgZyA9IGIucmVkQWRkKGUpO1xyXG4gIC8vIFgzID0gQSAqIEYgKiAoKFgxICsgWTEpICogKFgyICsgWTIpIC0gQyAtIEQpXHJcbiAgdmFyIHRtcCA9IHRoaXMueC5yZWRBZGQodGhpcy55KS5yZWRNdWwocC54LnJlZEFkZChwLnkpKS5yZWRJU3ViKGMpLnJlZElTdWIoZCk7XHJcbiAgdmFyIG54ID0gYS5yZWRNdWwoZikucmVkTXVsKHRtcCk7XHJcbiAgdmFyIG55O1xyXG4gIHZhciBuejtcclxuICBpZiAodGhpcy5jdXJ2ZS50d2lzdGVkKSB7XHJcbiAgICAvLyBZMyA9IEEgKiBHICogKEQgLSBhICogQylcclxuICAgIG55ID0gYS5yZWRNdWwoZykucmVkTXVsKGQucmVkU3ViKHRoaXMuY3VydmUuX211bEEoYykpKTtcclxuICAgIC8vIFozID0gRiAqIEdcclxuICAgIG56ID0gZi5yZWRNdWwoZyk7XHJcbiAgfSBlbHNlIHtcclxuICAgIC8vIFkzID0gQSAqIEcgKiAoRCAtIEMpXHJcbiAgICBueSA9IGEucmVkTXVsKGcpLnJlZE11bChkLnJlZFN1YihjKSk7XHJcbiAgICAvLyBaMyA9IGMgKiBGICogR1xyXG4gICAgbnogPSB0aGlzLmN1cnZlLl9tdWxDKGYpLnJlZE11bChnKTtcclxuICB9XHJcbiAgcmV0dXJuIHRoaXMuY3VydmUucG9pbnQobngsIG55LCBueik7XHJcbn07XHJcblxyXG5Qb2ludC5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gYWRkKHApIHtcclxuICBpZiAodGhpcy5pc0luZmluaXR5KCkpXHJcbiAgICByZXR1cm4gcDtcclxuICBpZiAocC5pc0luZmluaXR5KCkpXHJcbiAgICByZXR1cm4gdGhpcztcclxuXHJcbiAgaWYgKHRoaXMuY3VydmUuZXh0ZW5kZWQpXHJcbiAgICByZXR1cm4gdGhpcy5fZXh0QWRkKHApO1xyXG4gIGVsc2VcclxuICAgIHJldHVybiB0aGlzLl9wcm9qQWRkKHApO1xyXG59O1xyXG5cclxuUG9pbnQucHJvdG90eXBlLm11bCA9IGZ1bmN0aW9uIG11bChrKSB7XHJcbiAgaWYgKHRoaXMuX2hhc0RvdWJsZXMoaykpXHJcbiAgICByZXR1cm4gdGhpcy5jdXJ2ZS5fZml4ZWROYWZNdWwodGhpcywgayk7XHJcbiAgZWxzZVxyXG4gICAgcmV0dXJuIHRoaXMuY3VydmUuX3duYWZNdWwodGhpcywgayk7XHJcbn07XHJcblxyXG5Qb2ludC5wcm90b3R5cGUubXVsQWRkID0gZnVuY3Rpb24gbXVsQWRkKGsxLCBwLCBrMikge1xyXG4gIHJldHVybiB0aGlzLmN1cnZlLl93bmFmTXVsQWRkKDEsIFsgdGhpcywgcCBdLCBbIGsxLCBrMiBdLCAyLCBmYWxzZSk7XHJcbn07XHJcblxyXG5Qb2ludC5wcm90b3R5cGUuam11bEFkZCA9IGZ1bmN0aW9uIGptdWxBZGQoazEsIHAsIGsyKSB7XHJcbiAgcmV0dXJuIHRoaXMuY3VydmUuX3duYWZNdWxBZGQoMSwgWyB0aGlzLCBwIF0sIFsgazEsIGsyIF0sIDIsIHRydWUpO1xyXG59O1xyXG5cclxuUG9pbnQucHJvdG90eXBlLm5vcm1hbGl6ZSA9IGZ1bmN0aW9uIG5vcm1hbGl6ZSgpIHtcclxuICBpZiAodGhpcy56T25lKVxyXG4gICAgcmV0dXJuIHRoaXM7XHJcblxyXG4gIC8vIE5vcm1hbGl6ZSBjb29yZGluYXRlc1xyXG4gIHZhciB6aSA9IHRoaXMuei5yZWRJbnZtKCk7XHJcbiAgdGhpcy54ID0gdGhpcy54LnJlZE11bCh6aSk7XHJcbiAgdGhpcy55ID0gdGhpcy55LnJlZE11bCh6aSk7XHJcbiAgaWYgKHRoaXMudClcclxuICAgIHRoaXMudCA9IHRoaXMudC5yZWRNdWwoemkpO1xyXG4gIHRoaXMueiA9IHRoaXMuY3VydmUub25lO1xyXG4gIHRoaXMuek9uZSA9IHRydWU7XHJcbiAgcmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5Qb2ludC5wcm90b3R5cGUubmVnID0gZnVuY3Rpb24gbmVnKCkge1xyXG4gIHJldHVybiB0aGlzLmN1cnZlLnBvaW50KHRoaXMueC5yZWROZWcoKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy56LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudCAmJiB0aGlzLnQucmVkTmVnKCkpO1xyXG59O1xyXG5cclxuUG9pbnQucHJvdG90eXBlLmdldFggPSBmdW5jdGlvbiBnZXRYKCkge1xyXG4gIHRoaXMubm9ybWFsaXplKCk7XHJcbiAgcmV0dXJuIHRoaXMueC5mcm9tUmVkKCk7XHJcbn07XHJcblxyXG5Qb2ludC5wcm90b3R5cGUuZ2V0WSA9IGZ1bmN0aW9uIGdldFkoKSB7XHJcbiAgdGhpcy5ub3JtYWxpemUoKTtcclxuICByZXR1cm4gdGhpcy55LmZyb21SZWQoKTtcclxufTtcclxuXHJcblBvaW50LnByb3RvdHlwZS5lcSA9IGZ1bmN0aW9uIGVxKG90aGVyKSB7XHJcbiAgcmV0dXJuIHRoaXMgPT09IG90aGVyIHx8XHJcbiAgICAgICAgIHRoaXMuZ2V0WCgpLmNtcChvdGhlci5nZXRYKCkpID09PSAwICYmXHJcbiAgICAgICAgIHRoaXMuZ2V0WSgpLmNtcChvdGhlci5nZXRZKCkpID09PSAwO1xyXG59O1xyXG5cclxuUG9pbnQucHJvdG90eXBlLmVxWFRvUCA9IGZ1bmN0aW9uIGVxWFRvUCh4KSB7XHJcbiAgdmFyIHJ4ID0geC50b1JlZCh0aGlzLmN1cnZlLnJlZCkucmVkTXVsKHRoaXMueik7XHJcbiAgaWYgKHRoaXMueC5jbXAocngpID09PSAwKVxyXG4gICAgcmV0dXJuIHRydWU7XHJcblxyXG4gIHZhciB4YyA9IHguY2xvbmUoKTtcclxuICB2YXIgdCA9IHRoaXMuY3VydmUucmVkTi5yZWRNdWwodGhpcy56KTtcclxuICBmb3IgKDs7KSB7XHJcbiAgICB4Yy5pYWRkKHRoaXMuY3VydmUubik7XHJcbiAgICBpZiAoeGMuY21wKHRoaXMuY3VydmUucCkgPj0gMClcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG5cclxuICAgIHJ4LnJlZElBZGQodCk7XHJcbiAgICBpZiAodGhpcy54LmNtcChyeCkgPT09IDApXHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxufTtcclxuXHJcbi8vIENvbXBhdGliaWxpdHkgd2l0aCBCYXNlQ3VydmVcclxuUG9pbnQucHJvdG90eXBlLnRvUCA9IFBvaW50LnByb3RvdHlwZS5ub3JtYWxpemU7XHJcblBvaW50LnByb3RvdHlwZS5taXhlZEFkZCA9IFBvaW50LnByb3RvdHlwZS5hZGQ7XHJcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xyXG4gIGRvdWJsZXM6IHtcclxuICAgIHN0ZXA6IDQsXHJcbiAgICBwb2ludHM6IFtcclxuICAgICAgW1xyXG4gICAgICAgICdlNjBmY2U5M2I1OWU5ZWM1MzAxMWFhYmMyMWMyM2U5N2IyYTMxMzY5Yjg3YTVhZTljNDRlZTg5ZTJhNmRlYzBhJyxcclxuICAgICAgICAnZjdlMzUwNzM5OWU1OTU5MjlkYjk5ZjM0ZjU3OTM3MTAxMjk2ODkxZTQ0ZDIzZjBiZTFmMzJjY2U2OTYxNjgyMSdcclxuICAgICAgXSxcclxuICAgICAgW1xyXG4gICAgICAgICc4MjgyMjYzMjEyYzYwOWQ5ZWEyYTZlM2UxNzJkZTIzOGQ4YzM5Y2FiZDVhYzFjYTEwNjQ2ZTIzZmQ1ZjUxNTA4JyxcclxuICAgICAgICAnMTFmOGE4MDk4NTU3ZGZlNDVlODI1NmU4MzBiNjBhY2U2MmQ2MTNhYzJmN2IxN2JlZDMxYjZlYWZmNmUyNmNhZidcclxuICAgICAgXSxcclxuICAgICAgW1xyXG4gICAgICAgICcxNzVlMTU5ZjcyOGI4NjVhNzJmOTljYzZjNmZjODQ2ZGUwYjkzODMzZmQyMjIyZWQ3M2ZjZTViNTUxZTViNzM5JyxcclxuICAgICAgICAnZDM1MDZlMGQ5ZTNjNzllYmE0ZWY5N2E1MWZmNzFmNWVhY2I1OTU1YWRkMjQzNDVjNmVmYTZmZmVlOWZlZDY5NSdcclxuICAgICAgXSxcclxuICAgICAgW1xyXG4gICAgICAgICczNjNkOTBkNDQ3YjAwYzljOTljZWFjMDViNjI2MmVlMDUzNDQxYzdlNTU1NTJmZmU1MjZiYWQ4ZjgzZmY0NjQwJyxcclxuICAgICAgICAnNGUyNzNhZGZjNzMyMjIxOTUzYjQ0NTM5N2YzMzYzMTQ1YjlhODkwMDgxOTllY2I2MjAwM2M3ZjNiZWU5ZGU5J1xyXG4gICAgICBdLFxyXG4gICAgICBbXHJcbiAgICAgICAgJzhiNGI1ZjE2NWRmM2MyYmU4YzYyNDRiNWI3NDU2Mzg4NDNlNGE3ODFhMTViY2QxYjY5Zjc5YTU1ZGZmZGY4MGMnLFxyXG4gICAgICAgICc0YWFkMGE2ZjY4ZDMwOGI0YjNmYmQ3ODEzYWIwZGEwNGY5ZTMzNjU0NjE2MmVlNTZiM2VmZjBjNjVmZDRmZDM2J1xyXG4gICAgICBdLFxyXG4gICAgICBbXHJcbiAgICAgICAgJzcyM2NiYWE2ZTVkYjk5NmQ2YmY3NzFjMDBiZDU0OGM3YjcwMGRiZmZhNmMwZTc3YmNiNjExNTkyNTIzMmZjZGEnLFxyXG4gICAgICAgICc5NmU4NjdiNTU5NWNjNDk4YTkyMTEzNzQ4ODgyNGQ2ZTI2NjBhMDY1Mzc3OTQ5NDgwMWRjMDY5ZDllYjM5ZjVmJ1xyXG4gICAgICBdLFxyXG4gICAgICBbXHJcbiAgICAgICAgJ2VlYmZhNGQ0OTNiZWJmOThiYTVmZWVjODEyYzJkM2I1MDk0Nzk2MTIzN2E5MTk4MzlhNTMzZWNhMGU3ZGQ3ZmEnLFxyXG4gICAgICAgICc1ZDlhOGNhMzk3MGVmMGYyNjllZTdlZGFmMTc4MDg5ZDlhZTRjZGMzYTcxMWY3MTJkZGZkNGZkYWUxZGU4OTk5J1xyXG4gICAgICBdLFxyXG4gICAgICBbXHJcbiAgICAgICAgJzEwMGY0NGRhNjk2ZTcxNjcyNzkxZDBhMDliN2JkZTQ1OWYxMjE1YTI5YjNjMDNiZmVmZDc4MzViMzlhNDhkYjAnLFxyXG4gICAgICAgICdjZGQ5ZTEzMTkyYTAwYjc3MmVjOGYzMzAwYzA5MDY2NmI3ZmY0YTE4ZmY1MTk1YWMwZmJkNWNkNjJiYzY1YTA5J1xyXG4gICAgICBdLFxyXG4gICAgICBbXHJcbiAgICAgICAgJ2UxMDMxYmUyNjJjN2VkMWIxZGM5MjI3YTRhMDRjMDE3YTc3ZjhkNDQ2NGYzYjM4NTJjOGFjZGU2ZTUzNGZkMmQnLFxyXG4gICAgICAgICc5ZDcwNjE5Mjg5NDA0MDVlNmJiNmE0MTc2NTk3NTM1YWYyOTJkZDQxOWUxY2VkNzlhNDRmMThmMjk0NTZhMDBkJ1xyXG4gICAgICBdLFxyXG4gICAgICBbXHJcbiAgICAgICAgJ2ZlZWE2Y2FlNDZkNTViNTMwYWMyODM5ZjE0M2JkN2VjNWNmOGIyNjZhNDFkNmFmNTJkNWU2ODhkOTA5NDY5NmQnLFxyXG4gICAgICAgICdlNTdjNmI2Yzk3ZGNlMWJhYjA2ZTRlMTJiZjNlY2Q1Yzk4MWM4OTU3Y2M0MTQ0MmQzMTU1ZGViZjE4MDkwMDg4J1xyXG4gICAgICBdLFxyXG4gICAgICBbXHJcbiAgICAgICAgJ2RhNjdhOTFkOTEwNDljZGNiMzY3YmU0YmU2ZmZjYTNjZmVlZDY1N2Q4MDg1ODNkZTMzZmE5NzhiYzFlYzZjYjEnLFxyXG4gICAgICAgICc5YmFjYWEzNTQ4MTY0MmJjNDFmNDYzZjdlYzk3ODBlNWRlYzdhZGM1MDhmNzQwYTE3ZTllYThlMjdhNjhiZTFkJ1xyXG4gICAgICBdLFxyXG4gICAgICBbXHJcbiAgICAgICAgJzUzOTA0ZmFhMGIzMzRjZGRhNmUwMDA5MzVlZjIyMTUxZWMwOGQwZjdiYjExMDY5ZjU3NTQ1Y2NjMWEzN2I3YzAnLFxyXG4gICAgICAgICc1YmMwODdkMGJjODAxMDZkODhjOWVjY2FjMjBkM2MxYzEzOTk5OTgxZTE0NDM0Njk5ZGNiMDk2YjAyMjc3MWM4J1xyXG4gICAgICBdLFxyXG4gICAgICBbXHJcbiAgICAgICAgJzhlN2JjZDBiZDM1OTgzYTc3MTljY2E3NzY0Y2E5MDY3NzliNTNhMDQzYTliOGJjYWVmZjk1OWY0M2FkODYwNDcnLFxyXG4gICAgICAgICcxMGI3NzcwYjJhM2RhNGIzOTQwMzEwNDIwY2E5NTE0NTc5ZTg4ZTJlNDdmZDY4YjNlYTEwMDQ3ZTg0NjAzNzJhJ1xyXG4gICAgICBdLFxyXG4gICAgICBbXHJcbiAgICAgICAgJzM4NWVlZDM0YzFjZGZmMjFlNmQwODE4Njg5YjgxYmRlNzFhN2Y0ZjE4Mzk3ZTY2OTBhODQxZTE1OTljNDM4NjInLFxyXG4gICAgICAgICcyODNiZWJjM2U4ZWEyM2Y1NjcwMWRlMTllOWViZjQ1NzZiMzA0ZWVjMjA4NmRjOGNjMDQ1OGZlNTU0MmU1NDUzJ1xyXG4gICAgICBdLFxyXG4gICAgICBbXHJcbiAgICAgICAgJzZmOWQ5YjgwM2VjZjE5MTYzN2M3M2E0NDEzZGZhMTgwZmRkZjg0YTU5NDdmYmM5YzYwNmVkODZjM2ZhYzNhNycsXHJcbiAgICAgICAgJzdjODBjNjhlNjAzMDU5YmE2OWI4ZTJhMzBlNDVjNGQ0N2VhNGRkMmY1YzI4MTAwMmQ4Njg5MDYwM2E4NDIxNjAnXHJcbiAgICAgIF0sXHJcbiAgICAgIFtcclxuICAgICAgICAnMzMyMmQ0MDEyNDNjNGUyNTgyYTIxNDdjMTA0ZDZlY2JmNzc0ZDE2M2RiMGY1ZTUzMTNiN2UwZTc0MmQwZTZiZCcsXHJcbiAgICAgICAgJzU2ZTcwNzk3ZTk2NjRlZjViZmIwMTliYzRkZGFmOWI3MjgwNWY2M2VhMjg3M2FmNjI0ZjNhMmU5NmMyOGIyYTAnXHJcbiAgICAgIF0sXHJcbiAgICAgIFtcclxuICAgICAgICAnODU2NzJjN2QyZGUwYjdkYTJiZDE3NzBkODk2NjU4Njg3NDFiM2Y5YWY3NjQzMzk3NzIxZDc0ZDI4MTM0YWI4MycsXHJcbiAgICAgICAgJzdjNDgxYjliNWI0M2IyZWI2Mzc0MDQ5YmZhNjJjMmU1ZTc3ZjE3ZmNjNTI5OGY0NGM4ZTMwOTRmNzkwMzEzYTYnXHJcbiAgICAgIF0sXHJcbiAgICAgIFtcclxuICAgICAgICAnOTQ4YmY4MDliMTk4OGE0NmIwNmM5ZjE5MTk0MTNiMTBmOTIyNmM2MGY2Njg4MzJmZmQ5NTlhZjYwYzgyYTBhJyxcclxuICAgICAgICAnNTNhNTYyODU2ZGNiNjY0NmRjNmI3NGM1ZDFjMzQxOGM2ZDRkZmYwOGM5N2NkMmJlZDRjYjdmODhkOGM4ZTU4OSdcclxuICAgICAgXSxcclxuICAgICAgW1xyXG4gICAgICAgICc2MjYwY2U3ZjQ2MTgwMWMzNGYwNjdjZTBmMDI4NzNhOGYxYjBlNDRkZmM2OTc1MmFjY2VjZDgxOWYzOGZkOGU4JyxcclxuICAgICAgICAnYmMyZGE4MmI2ZmE1YjU3MWE3ZjA5MDQ5Nzc2YTFlZjdlY2QyOTIyMzgwNTFjMTk4YzFhODRlOTViMmI0YWUxNydcclxuICAgICAgXSxcclxuICAgICAgW1xyXG4gICAgICAgICdlNTAzN2RlMGFmYzFkOGQ0M2Q4MzQ4NDE0YmJmNDEwMzA0M2VjOGY1NzViZmRjNDMyOTUzY2M4ZDIwMzdmYTJkJyxcclxuICAgICAgICAnNDU3MTUzNGJhYTk0ZDNiNWY5Zjk4ZDA5ZmI5OTBiZGRiZDVmNWIwM2VjNDgxZjEwZTBlNWRjODQxZDc1NWJkYSdcclxuICAgICAgXSxcclxuICAgICAgW1xyXG4gICAgICAgICdlMDYzNzJiMGY0YTIwN2FkZjVlYTkwNWU4ZjE3NzFiNGU3ZThkYmQxYzZhNmM1YjcyNTg2NmEwYWU0ZmNlNzI1JyxcclxuICAgICAgICAnN2E5MDg5NzRiY2UxOGNmZTEyYTI3YmIyYWQ1YTQ4OGNkNzQ4NGE3Nzg3MTA0ODcwYjI3MDM0Zjk0ZWVlMzFkZCdcclxuICAgICAgXSxcclxuICAgICAgW1xyXG4gICAgICAgICcyMTNjN2E3MTVjZDVkNDUzNThkMGJiZjlkYzBjZTAyMjA0YjEwYmRkZTJhM2Y1ODU0MGFkNjkwOGQwNTU5NzU0JyxcclxuICAgICAgICAnNGI2ZGFkMGI1YWU0NjI1MDcwMTNhZDA2MjQ1YmExOTBiYjQ4NTBmNWYzNmE3ZWVkZGZmMmMyNzUzNGI0NThmMidcclxuICAgICAgXSxcclxuICAgICAgW1xyXG4gICAgICAgICc0ZTdjMjcyYTdhZjRiMzRlOGRiYjkzNTJhNTQxOWE4N2UyODM4YzcwYWRjNjJjZGRmMGNjM2EzYjA4ZmJkNTNjJyxcclxuICAgICAgICAnMTc3NDljNzY2YzlkMGIxOGUxNmZkMDlmNmRlZjY4MWI1MzBiOTYxNGJmZjdkZDMzZTBiMzk0MTgxN2RjYWFlNidcclxuICAgICAgXSxcclxuICAgICAgW1xyXG4gICAgICAgICdmZWE3NGUzZGJlNzc4YjFiMTBmMjM4YWQ2MTY4NmFhNWM3NmUzZGIyYmU0MzA1NzYzMjQyN2UyODQwZmIyN2I2JyxcclxuICAgICAgICAnNmUwNTY4ZGI5YjBiMTMyOTdjZjY3NGRlY2NiNmFmOTMxMjZiNTk2Yjk3M2Y3Yjc3NzAxZDNkYjdmMjNjYjk2ZidcclxuICAgICAgXSxcclxuICAgICAgW1xyXG4gICAgICAgICc3NmU2NDExM2Y2NzdjZjBlMTBhMjU3MGQ1OTk5NjhkMzE1NDRlMTc5Yjc2MDQzMjk1MmMwMmE0NDE3YmRkZTM5JyxcclxuICAgICAgICAnYzkwZGRmOGRlZTRlOTVjZjU3NzA2NmQ3MDY4MWYwZDM1ZTJhMzNkMmI1NmQyMDMyYjRiMTc1MmQxOTAxYWMwMSdcclxuICAgICAgXSxcclxuICAgICAgW1xyXG4gICAgICAgICdjNzM4YzU2YjAzYjJhYmUxZTgyODFiYWE3NDNmOGY5YThmN2NjNjQzZGYyNmNiZWUzYWIxNTAyNDJiY2JiODkxJyxcclxuICAgICAgICAnODkzZmI1Nzg5NTFhZDI1MzdmNzE4ZjJlYWNiZmJiYmI4MjMxNGVlZjc4ODBjZmU5MTdlNzM1ZDk2OTlhODRjMydcclxuICAgICAgXSxcclxuICAgICAgW1xyXG4gICAgICAgICdkODk1NjI2NTQ4YjY1YjgxZTI2NGM3NjM3Yzk3Mjg3N2QxZDcyZTVmM2E5MjUwMTQzNzJlOWY2NTg4ZjZjMTRiJyxcclxuICAgICAgICAnZmViZmFhMzhmMmJjN2VhZTcyOGVjNjA4MThjMzQwZWIwMzQyOGQ2MzJiYjA2N2UxNzkzNjNlZDc1ZDdkOTkxZidcclxuICAgICAgXSxcclxuICAgICAgW1xyXG4gICAgICAgICdiOGRhOTQwMzJhOTU3NTE4ZWIwZjY0MzM1NzFlODc2MWNlZmZjNzM2OTNlODRlZGQ0OTE1MGE1NjRmNjc2ZTAzJyxcclxuICAgICAgICAnMjgwNGRmYTQ0ODA1YTFlNGQ3Yzk5Y2M5NzYyODA4YjA5MmNjNTg0ZDk1ZmYzYjUxMTQ4OGU0ZTc0ZWZkZjZlNydcclxuICAgICAgXSxcclxuICAgICAgW1xyXG4gICAgICAgICdlODBmZWExNDQ0MWZiMzNhN2Q4YWRhYjk0NzVkN2ZhYjIwMTllZmZiNTE1NmE3OTJmMWExMTc3OGUzYzBkZjVkJyxcclxuICAgICAgICAnZWVkMWRlN2Y2MzhlMDA3NzFlODk3NjhjYTNjYTk0NDcyZDE1NWU4MGFmMzIyZWE5ZmNiNDI5MWI2YWM5ZWM3OCdcclxuICAgICAgXSxcclxuICAgICAgW1xyXG4gICAgICAgICdhMzAxNjk3YmRmY2Q3MDQzMTNiYTQ4ZTUxZDU2NzU0M2YyYTE4MjAzMWVmZDY5MTVkZGMwN2JiY2M0ZTE2MDcwJyxcclxuICAgICAgICAnNzM3MGY5MWNmYjY3ZTRmNTA4MTgwOWZhMjVkNDBmOWIxNzM1ZGJmN2MwYTExYTEzMGMwZDFhMDQxZTE3N2VhMSdcclxuICAgICAgXSxcclxuICAgICAgW1xyXG4gICAgICAgICc5MGFkODViMzg5ZDZiOTM2NDYzZjlkMDUxMjY3OGRlMjA4Y2MzMzBiMTEzMDdmZmZhYjdhYzYzZTNmYjA0ZWQ0JyxcclxuICAgICAgICAnZTUwN2EzNjIwYTM4MjYxYWZmZGNiZDk0MjcyMjJiODM5YWVmYWJlMTU4Mjg5NGQ5OTFkNGQ0OGNiNmVmMTUwJ1xyXG4gICAgICBdLFxyXG4gICAgICBbXHJcbiAgICAgICAgJzhmNjhiOWQyZjYzYjVmMzM5MjM5YzFhZDk4MWYxNjJlZTg4YzU2Nzg3MjNlYTMzNTFiN2I0NDRjOWVjNGMwZGEnLFxyXG4gICAgICAgICc2NjJhOWYyZGJhMDYzOTg2ZGUxZDkwYzJiNmJlMjE1ZGJiZWEyY2ZlOTU1MTBiZmRmMjNjYmY3OTUwMWZmZjgyJ1xyXG4gICAgICBdLFxyXG4gICAgICBbXHJcbiAgICAgICAgJ2U0ZjNmYjAxNzZhZjg1ZDY1ZmY5OWZmOTE5OGMzNjA5MWY0OGU4NjUwMzY4MWUzZTY2ODZmZDUwNTMyMzFlMTEnLFxyXG4gICAgICAgICcxZTYzNjMzYWQwZWY0ZjFjMTY2MWE2ZDBlYTAyYjcyODZjYzdlNzRlYzk1MWQxYzk4MjJjMzg1NzZmZWI3M2JjJ1xyXG4gICAgICBdLFxyXG4gICAgICBbXHJcbiAgICAgICAgJzhjMDBmYTliMThlYmYzMzFlYjk2MTUzN2E0NWE0MjY2YzcwMzRmMmYwZDRlMWQwNzE2ZmI2ZWFlMjBlYWUyOWUnLFxyXG4gICAgICAgICdlZmE0NzI2N2ZlYTUyMWExYTlkYzM0M2EzNzM2Yzk3NGMyZmFkYWZhODFlMzZjNTRlN2QyYTRjNjY3MDI0MTRiJ1xyXG4gICAgICBdLFxyXG4gICAgICBbXHJcbiAgICAgICAgJ2U3YTI2Y2U2OWRkNDgyOWYzZTEwY2VjMGE5ZTk4ZWQzMTQzZDA4NGYzMDhiOTJjMDk5N2ZkZGZjNjBjYjNlNDEnLFxyXG4gICAgICAgICcyYTc1OGUzMDBmYTc5ODRiNDcxYjAwNmExYWFmYmIxOGQwYTZiMmMwNDIwZTgzZTIwZThhOTQyMWNmMmNmZDUxJ1xyXG4gICAgICBdLFxyXG4gICAgICBbXHJcbiAgICAgICAgJ2I2NDU5ZTBlZTM2NjJlYzhkMjM1NDBjMjIzYmNiZGM1NzFjYmNiOTY3ZDc5NDI0ZjNjZjI5ZWIzZGU2YjgwZWYnLFxyXG4gICAgICAgICc2N2M4NzZkMDZmM2UwNmRlMWRhZGYxNmU1NjYxZGIzYzRiM2FlNmQ0OGUzNWIyZmYzMGJmMGI2MWE3MWJhNDUnXHJcbiAgICAgIF0sXHJcbiAgICAgIFtcclxuICAgICAgICAnZDY4YTgwYzgyODBiYjg0MDc5MzIzNGFhMTE4ZjA2MjMxZDZmMWZjNjdlNzNjNWE1ZGVkYTBmNWI0OTY5NDNlOCcsXHJcbiAgICAgICAgJ2RiOGJhOWZmZjRiNTg2ZDAwYzRiMWY5MTc3YjBlMjhiNWIwZTdiOGY3ODQ1Mjk1YTI5NGM4NDI2NmIxMzMxMjAnXHJcbiAgICAgIF0sXHJcbiAgICAgIFtcclxuICAgICAgICAnMzI0YWVkN2RmNjVjODA0MjUyZGMwMjcwOTA3YTMwYjA5NjEyYWViOTczNDQ5Y2VhNDA5NTk4MGZjMjhkM2Q1ZCcsXHJcbiAgICAgICAgJzY0OGEzNjU3NzRiNjFmMmZmMTMwYzBjMzVhZWMxZjRmMTkyMTNiMGM3ZTMzMjg0Mzk2NzIyNGFmOTZhYjdjODQnXHJcbiAgICAgIF0sXHJcbiAgICAgIFtcclxuICAgICAgICAnNGRmOWMxNDkxOWNkZTYxZjZkNTFkZmRiZTVmZWU1ZGNlZWM0MTQzYmE4ZDFjYTg4OGU4YmQzNzNmZDA1NGM5NicsXHJcbiAgICAgICAgJzM1ZWM1MTA5MmQ4NzI4MDUwOTc0YzIzYTFkODVkNGI1ZDUwNmNkYzI4ODQ5MDE5MmViYWMwNmNhZDEwZDVkJ1xyXG4gICAgICBdLFxyXG4gICAgICBbXHJcbiAgICAgICAgJzljMzkxOWE4NGE0NzQ4NzBmYWVkOGE5YzFjYzY2MDIxNTIzNDg5MDU0ZDdmMDMwOGNiZmM5OWM4YWMxZjk4Y2QnLFxyXG4gICAgICAgICdkZGI4NGYwZjRhNGRkZDU3NTg0ZjA0NGJmMjYwZTY0MTkwNTMyNmY3NmM2NGM4ZTZiZTdlNWUwM2Q0ZmM1OTlkJ1xyXG4gICAgICBdLFxyXG4gICAgICBbXHJcbiAgICAgICAgJzYwNTcxNzBiMWRkMTJmZGY4ZGUwNWYyODFkOGUwNmJiOTFlMTQ5M2E4YjkxZDRjYzVhMjEzODIxMjBhOTU5ZTUnLFxyXG4gICAgICAgICc5YTFhZjBiMjZhNmE0ODA3YWRkOWEyZGFmNzFkZjI2MjQ2NTE1MmJjM2VlMjRjNjVlODk5YmU5MzIzODVhMmE4J1xyXG4gICAgICBdLFxyXG4gICAgICBbXHJcbiAgICAgICAgJ2E1NzZkZjhlMjNhMDg0MTE0MjE0MzlhNDUxOGRhMzE4ODBjZWYwZmJhN2Q0ZGYxMmIxYTY5NzNlZWNiOTQyNjYnLFxyXG4gICAgICAgICc0MGE2YmYyMGU3NjY0MGIyYzkyYjk3YWZlNThjZDgyYzQzMmUxMGE3ZjUxNGQ5ZjNlZThiZTExYWUxYjI4ZWM4J1xyXG4gICAgICBdLFxyXG4gICAgICBbXHJcbiAgICAgICAgJzc3NzhhNzhjMjhkZWMzZTMwYTA1ZmU5NjI5ZGU4YzM4YmIzMGQxZjVjZjlhM2EyMDhmNzYzODg5YmU1OGFkNzEnLFxyXG4gICAgICAgICczNDYyNmQ5YWI1YTViMjJmZjcwOThlMTJmMmZmNTgwMDg3YjM4NDExZmYyNGFjNTYzYjUxM2ZjMWZkOWY0M2FjJ1xyXG4gICAgICBdLFxyXG4gICAgICBbXHJcbiAgICAgICAgJzkyODk1NWVlNjM3YTg0NDYzNzI5ZmQzMGU3YWZkMmVkNWY5NjI3NGU1YWQ3ZTVjYjA5ZWRhOWMwNmQ5MDNhYycsXHJcbiAgICAgICAgJ2MyNTYyMTAwM2QzZjQyYTgyN2I3OGExMzA5M2E5NWVlYWMzZDI2ZWZhOGE4ZDgzZmM1MTgwZTkzNWJjZDA5MWYnXHJcbiAgICAgIF0sXHJcbiAgICAgIFtcclxuICAgICAgICAnODVkMGZlZjNlYzZkYjEwOTM5OTA2NGYzYTBlM2IyODU1NjQ1YjRhOTA3YWQzNTQ1MjdhYWU3NTE2M2Q4Mjc1MScsXHJcbiAgICAgICAgJzFmMDM2NDg0MTNhMzhjMGJlMjlkNDk2ZTU4MmNmNTY2M2U4NzUxZTk2ODc3MzMxNTgyYzIzN2EyNGViMWY5NjInXHJcbiAgICAgIF0sXHJcbiAgICAgIFtcclxuICAgICAgICAnZmYyYjBkY2U5N2VlY2U5N2MxYzliNjA0MTc5OGI4NWRmZGZiNmQ4ODgyZGEyMDMwOGY1NDA0ODI0NTI2MDg3ZScsXHJcbiAgICAgICAgJzQ5M2QxM2ZlZjUyNGJhMTg4YWY0YzRkYzU0ZDA3OTM2YzdiN2VkNmZiOTBlMmNlYjJjOTUxZTAxZjBjMjk5MDcnXHJcbiAgICAgIF0sXHJcbiAgICAgIFtcclxuICAgICAgICAnODI3ZmJiZTRiMWU4ODBlYTllZDJiMmU2MzAxYjIxMmI1N2YxZWUxNDhjZDZkZDI4NzgwZTVlMmNmODU2ZTI0MScsXHJcbiAgICAgICAgJ2M2MGY5YzkyM2M3MjdiMGI3MWJlZjJjNjdkMWQxMjY4N2ZmN2E2MzE4NjkwMzE2NmQ2MDViNjhiYWVjMjkzZWMnXHJcbiAgICAgIF0sXHJcbiAgICAgIFtcclxuICAgICAgICAnZWFhNjQ5ZjIxZjUxYmRiYWU3YmU0YWUzNGNlNmU1MjE3YTU4ZmRjZTdmNDdmOWFhN2YzYjU4ZmEyMTIwZTJiMycsXHJcbiAgICAgICAgJ2JlMzI3OWVkNWJiYmIwM2FjNjlhODBmODk4NzlhYTVhMDFhNmI5NjVmMTNmN2U1OWQ0N2E1MzA1YmE1YWQ5M2QnXHJcbiAgICAgIF0sXHJcbiAgICAgIFtcclxuICAgICAgICAnZTRhNDJkNDNjNWNmMTY5ZDkzOTFkZjZkZWNmNDJlZTU0MWI2ZDhmMGM5YTEzNzQwMWUyMzYzMmRkYTM0ZDI0ZicsXHJcbiAgICAgICAgJzRkOWY5MmU3MTZkMWM3MzUyNmZjOTljY2ZiOGFkMzRjZTg4NmVlZGZhOGQ4ZTRmMTNhN2Y3MTMxZGViYTk0MTQnXHJcbiAgICAgIF0sXHJcbiAgICAgIFtcclxuICAgICAgICAnMWVjODBmZWYzNjBjYmRkOTU0MTYwZmFkYWIzNTJiNmI5MmI1MzU3NmE4OGZlYTQ5NDcxNzNiOWQ0MzAwYmYxOScsXHJcbiAgICAgICAgJ2FlZWZlOTM3NTZiNTM0MGQyZjNhNDk1OGE3YWJiZjVlMDE0NmU3N2Y2Mjk1YTA3YjY3MWNkYzFjYzEwN2NlZmQnXHJcbiAgICAgIF0sXHJcbiAgICAgIFtcclxuICAgICAgICAnMTQ2YTc3OGMwNDY3MGMyZjkxYjAwYWY0NjgwZGZhOGJjZTM0OTA3MTdkNThiYTg4OWRkYjU5MjgzNjY2NDJiZScsXHJcbiAgICAgICAgJ2IzMThlMGVjMzM1NDAyOGFkZDY2OTgyN2Y5ZDRiMjg3MGFhYTk3MWQyZjdlNWVkMWQwYjI5NzQ4M2Q4M2VmZDAnXHJcbiAgICAgIF0sXHJcbiAgICAgIFtcclxuICAgICAgICAnZmE1MGMwZjYxZDIyZTVmMDdlM2FjZWJiMWFhMDdiMTI4ZDAwMTIyMDlhMjhiOTc3NmQ3NmE4NzkzMTgwZWVmOScsXHJcbiAgICAgICAgJzZiODRjNjkyMjM5N2ViYTliNzJjZDI4NzIyODFhNjhhNWU2ODMyOTNhNTdhMjEzYjM4Y2Q4ZDdkM2Y0ZjI4MTEnXHJcbiAgICAgIF0sXHJcbiAgICAgIFtcclxuICAgICAgICAnZGExZDYxZDBjYTcyMWExMWIxYTViZjZiN2Q4OGU4NDIxYTI4OGFiNWQ1YmJhNTIyMGU1M2QzMmI1ZjA2N2VjMicsXHJcbiAgICAgICAgJzgxNTdmNTVhN2M5OTMwNmM3OWMwNzY2MTYxYzkxZTI5NjZhNzM4OTlkMjc5YjQ4YTY1NWZiYTBmMWFkODM2ZjEnXHJcbiAgICAgIF0sXHJcbiAgICAgIFtcclxuICAgICAgICAnYThlMjgyZmYwYzk3MDY5MDcyMTVmZjk4ZThmZDQxNjYxNTMxMWRlMDQ0NmYxZTA2MmE3M2IwNjEwZDA2NGUxMycsXHJcbiAgICAgICAgJzdmOTczNTViOGRiODFjMDlhYmZiN2YzYzViMjUxNTg4OGI2NzlhM2U1MGRkNmJkNmNlZjdjNzMxMTFmNGNjMGMnXHJcbiAgICAgIF0sXHJcbiAgICAgIFtcclxuICAgICAgICAnMTc0YTUzYjljOWEyODU4NzJkMzllNTZlNjkxM2NhYjE1ZDU5YjFmYTUxMjUwOGMwMjJmMzgyZGU4MzE5NDk3YycsXHJcbiAgICAgICAgJ2NjYzlkYzM3YWJmYzljMTY1N2I0MTU1ZjJjNDdmOWU2NjQ2YjNhMWQ4Y2I5ODU0MzgzZGExM2FjMDc5YWZhNzMnXHJcbiAgICAgIF0sXHJcbiAgICAgIFtcclxuICAgICAgICAnOTU5Mzk2OTgxOTQzNzg1YzNkM2U1N2VkZjUwMThjZGJlMDM5ZTczMGU0OTE4YjNkODg0ZmRmZjA5NDc1YjdiYScsXHJcbiAgICAgICAgJzJlN2U1NTI4ODhjMzMxZGQ4YmEwMzg2YTRiOWNkNjg0OWM2NTNmNjRjODcwOTM4NWU5YjhhYmY4NzUyNGYyZmQnXHJcbiAgICAgIF0sXHJcbiAgICAgIFtcclxuICAgICAgICAnZDJhNjNhNTBhZTQwMWU1NmQ2NDVhMTE1M2IxMDlhOGZjY2EwYTQzZDU2MWZiYTJkYmI1MTM0MGM5ZDgyYjE1MScsXHJcbiAgICAgICAgJ2U4MmQ4NmZiNjQ0M2ZjYjc1NjVhZWU1OGIyOTQ4MjIwYTcwZjc1MGFmNDg0Y2E1MmQ0MTQyMTc0ZGNmODk0MDUnXHJcbiAgICAgIF0sXHJcbiAgICAgIFtcclxuICAgICAgICAnNjQ1ODdlMjMzNTQ3MWViODkwZWU3ODk2ZDdjZmRjODY2YmFjYmRiZDM4MzkzMTdiMzQzNmY5YjQ1NjE3ZTA3MycsXHJcbiAgICAgICAgJ2Q5OWZjZGQ1YmY2OTAyZTJhZTk2ZGQ2NDQ3YzI5OWExODViOTBhMzkxMzNhZWFiMzU4Mjk5ZTVlOWZhZjY1ODknXHJcbiAgICAgIF0sXHJcbiAgICAgIFtcclxuICAgICAgICAnODQ4MWJkZTBlNGU0ZDg4NWIzYTU0NmQzZTU0OWRlMDQyZjBhYTZjZWEyNTBlN2ZkMzU4ZDZjODZkZDQ1ZTQ1OCcsXHJcbiAgICAgICAgJzM4ZWU3YjhjYmE1NDA0ZGQ4NGEyNWJmMzljZWNiMmNhOTAwYTc5YzQyYjI2MmU1NTZkNjRiMWI1OTc3OTA1N2UnXHJcbiAgICAgIF0sXHJcbiAgICAgIFtcclxuICAgICAgICAnMTM0NjRhNTdhNzgxMDJhYTYyYjY5NzlhZTgxN2Y0NjM3ZmZjZmVkM2M0YjFjZTMwYmNkNjMwM2Y2Y2FmNjY2YicsXHJcbiAgICAgICAgJzY5YmUxNTkwMDQ2MTQ1ODBlZjdlNDMzNDUzY2NiMGNhNDhmMzAwYTgxZDA5NDJlMTNmNDk1YTkwN2Y2ZWNjMjcnXHJcbiAgICAgIF0sXHJcbiAgICAgIFtcclxuICAgICAgICAnYmM0YTlkZjViNzEzZmUyZTlhZWY0MzBiY2MxZGM5N2EwY2Q5Y2NlZGUyZjI4NTg4Y2FkYTNhMGQyZDgzZjM2NicsXHJcbiAgICAgICAgJ2QzYTgxY2E2ZTc4NWMwNjM4MzkzN2FkZjRiNzk4Y2FhNmU4YTlmYmZhNTQ3YjE2ZDc1OGQ2NjY1ODFmMzNjMSdcclxuICAgICAgXSxcclxuICAgICAgW1xyXG4gICAgICAgICc4YzI4YTk3YmY4Mjk4YmMwZDIzZDhjNzQ5NDUyYTMyZTY5NGI2NWUzMGE5NDcyYTM5NTRhYjMwZmU1MzI0Y2FhJyxcclxuICAgICAgICAnNDBhMzA0NjNhMzMwNTE5MzM3OGZlZGYzMWY3Y2MwZWI3YWU3ODRmMDQ1MWNiOTQ1OWU3MWRjNzNjYmVmOTQ4MidcclxuICAgICAgXSxcclxuICAgICAgW1xyXG4gICAgICAgICc4ZWE5NjY2MTM5NTI3YThjMWRkOTRjZTRmMDcxZmQyM2M4YjM1MGM1YTRiYjMzNzQ4YzRiYTExMWZhY2NhZTAnLFxyXG4gICAgICAgICc2MjBlZmFiYmM4ZWUyNzgyZTI0ZTdjMGNmYjk1YzVkNzM1Yjc4M2JlOWNmMGY4ZTk1NWFmMzRhMzBlNjJiOTQ1J1xyXG4gICAgICBdLFxyXG4gICAgICBbXHJcbiAgICAgICAgJ2RkMzYyNWZhZWY1YmEwNjA3NDY2OTcxNmJiZDM3ODhkODliZGRlODE1OTU5OTY4MDkyZjc2Y2M0ZWI5YTk3ODcnLFxyXG4gICAgICAgICc3YTE4OGZhMzUyMGUzMGQ0NjFkYTI1MDEwNDU3MzFjYTk0MTQ2MTk4Mjg4MzM5NTkzN2Y2OGQwMGM2NDRhNTczJ1xyXG4gICAgICBdLFxyXG4gICAgICBbXHJcbiAgICAgICAgJ2Y3MTBkNzlkOWViOTYyMjk3ZTRmNjIzMmI0MGU4ZjdmZWIyYmM2MzgxNDYxNGQ2OTJjMTJkZTc1MjQwODIyMWUnLFxyXG4gICAgICAgICdlYTk4ZTY3MjMyZDNiMzI5NWQzYjUzNTUzMjExNWNjYWM4NjEyYzcyMTg1MTYxNzUyNmFlNDdhOWM3N2JmYzgyJ1xyXG4gICAgICBdXHJcbiAgICBdXHJcbiAgfSxcclxuICBuYWY6IHtcclxuICAgIHduZDogNyxcclxuICAgIHBvaW50czogW1xyXG4gICAgICBbXHJcbiAgICAgICAgJ2Y5MzA4YTAxOTI1OGMzMTA0OTM0NGY4NWY4OWQ1MjI5YjUzMWM4NDU4MzZmOTliMDg2MDFmMTEzYmNlMDM2ZjknLFxyXG4gICAgICAgICczODhmN2IwZjYzMmRlODE0MGZlMzM3ZTYyYTM3ZjM1NjY1MDBhOTk5MzRjMjIzMWI2Y2I5ZmQ3NTg0YjhlNjcyJ1xyXG4gICAgICBdLFxyXG4gICAgICBbXHJcbiAgICAgICAgJzJmOGJkZTRkMWEwNzIwOTM1NWI0YTcyNTBhNWM1MTI4ZTg4Yjg0YmRkYzYxOWFiN2NiYThkNTY5YjI0MGVmZTQnLFxyXG4gICAgICAgICdkOGFjMjIyNjM2ZTVlM2Q2ZDRkYmE5ZGRhNmM5YzQyNmY3ODgyNzFiYWIwZDY4NDBkY2E4N2QzYWE2YWM2MmQ2J1xyXG4gICAgICBdLFxyXG4gICAgICBbXHJcbiAgICAgICAgJzVjYmRmMDY0NmU1ZGI0ZWFhMzk4ZjM2NWYyZWE3YTBlM2Q0MTliN2UwMzMwZTM5Y2U5MmJkZGVkY2FjNGY5YmMnLFxyXG4gICAgICAgICc2YWViY2E0MGJhMjU1OTYwYTMxNzhkNmQ4NjFhNTRkYmE4MTNkMGI4MTNmZGU3YjVhNTA4MjYyODA4NzI2NGRhJ1xyXG4gICAgICBdLFxyXG4gICAgICBbXHJcbiAgICAgICAgJ2FjZDQ4NGUyZjBjN2Y2NTMwOWFkMTc4YTlmNTU5YWJkZTA5Nzk2OTc0YzU3ZTcxNGMzNWYxMTBkZmMyN2NjYmUnLFxyXG4gICAgICAgICdjYzMzODkyMWIwYTdkOWZkNjQzODA5NzE3NjNiNjFlOWFkZDg4OGE0Mzc1ZjhlMGYwNWNjMjYyYWM2NGY5YzM3J1xyXG4gICAgICBdLFxyXG4gICAgICBbXHJcbiAgICAgICAgJzc3NGFlN2Y4NThhOTQxMWU1ZWY0MjQ2YjcwYzY1YWFjNTY0OTk4MGJlNWMxNzg5MWJiZWMxNzg5NWRhMDA4Y2InLFxyXG4gICAgICAgICdkOTg0YTAzMmViNmI1ZTE5MDI0M2RkNTZkN2I3YjM2NTM3MmRiMWUyZGZmOWQ2YTgzMDFkNzRjOWM5NTNjNjFiJ1xyXG4gICAgICBdLFxyXG4gICAgICBbXHJcbiAgICAgICAgJ2YyODc3M2MyZDk3NTI4OGJjN2QxZDIwNWMzNzQ4NjUxYjA3NWZiYzY2MTBlNThjZGRlZWRkZjhmMTk0MDVhYTgnLFxyXG4gICAgICAgICdhYjA5MDJlOGQ4ODBhODk3NTgyMTJlYjY1Y2RhZjQ3M2ExYTA2ZGE1MjFmYTkxZjI5YjVjYjUyZGIwM2VkODEnXHJcbiAgICAgIF0sXHJcbiAgICAgIFtcclxuICAgICAgICAnZDc5MjRkNGY3ZDQzZWE5NjVhNDY1YWUzMDk1ZmY0MTEzMWU1OTQ2ZjNjODVmNzllNDRhZGJjZjhlMjdlMDgwZScsXHJcbiAgICAgICAgJzU4MWUyODcyYTg2YzcyYTY4Mzg0MmVjMjI4Y2M2ZGVmZWE0MGFmMmJkODk2ZDNhNWM1MDRkYzlmZjZhMjZiNTgnXHJcbiAgICAgIF0sXHJcbiAgICAgIFtcclxuICAgICAgICAnZGVmZGVhNGNkYjY3Nzc1MGE0MjBmZWU4MDdlYWNmMjFlYjk4OThhZTc5Yjk3Njg3NjZlNGZhYTA0YTJkNGEzNCcsXHJcbiAgICAgICAgJzQyMTFhYjA2OTQ2MzUxNjhlOTk3YjBlYWQyYTkzZGFlY2VkMWY0YTA0YTk1YzBmNmNmYjE5OWY2OWU1NmViNzcnXHJcbiAgICAgIF0sXHJcbiAgICAgIFtcclxuICAgICAgICAnMmI0ZWEwYTc5N2E0NDNkMjkzZWY1Y2ZmNDQ0ZjQ5NzlmMDZhY2ZlYmQ3ZTg2ZDI3NzQ3NTY1NjEzODM4NWI2YycsXHJcbiAgICAgICAgJzg1ZTg5YmMwMzc5NDVkOTNiMzQzMDgzYjVhMWM4NjEzMWEwMWY2MGM1MDI2OTc2M2I1NzBjODU0ZTVjMDliN2EnXHJcbiAgICAgIF0sXHJcbiAgICAgIFtcclxuICAgICAgICAnMzUyYmJmNGE0Y2RkMTI1NjRmOTNmYTMzMmNlMzMzMzAxZDlhZDQwMjcxZjgxMDcxODEzNDBhZWYyNWJlNTlkNScsXHJcbiAgICAgICAgJzMyMWViNDA3NTM0OGY1MzRkNTljMTgyNTlkZGEzZTFmNGExYjNiMmU3MWIxMDM5YzY3YmQzZDhiY2Y4MTk5OGMnXHJcbiAgICAgIF0sXHJcbiAgICAgIFtcclxuICAgICAgICAnMmZhMjEwNGQ2YjM4ZDExYjAyMzAwMTA1NTk4NzkxMjRlNDJhYjhkZmVmZjVmZjI5ZGM5Y2RhZGQ0ZWNhY2MzZicsXHJcbiAgICAgICAgJzJkZTEwNjgyOTVkZDg2NWI2NDU2OTMzNWJkNWRkODAxODFkNzBlY2ZjODgyNjQ4NDIzYmE3NmI1MzJiN2Q2NydcclxuICAgICAgXSxcclxuICAgICAgW1xyXG4gICAgICAgICc5MjQ4Mjc5YjA5YjRkNjhkYWIyMWE5YjA2NmVkZGE4MzI2M2MzZDg0ZTA5NTcyZTI2OWNhMGNkN2Y1NDUzNzE0JyxcclxuICAgICAgICAnNzMwMTZmN2JmMjM0YWFkZTVkMWFhNzFiZGVhMmIxZmYzZmMwZGUyYTg4NzkxMmZmZTU0YTMyY2U5N2NiMzQwMidcclxuICAgICAgXSxcclxuICAgICAgW1xyXG4gICAgICAgICdkYWVkNGYyYmUzYThiZjI3OGU3MDEzMmZiMGJlYjc1MjJmNTcwZTE0NGJmNjE1YzA3ZTk5NmQ0NDNkZWU4NzI5JyxcclxuICAgICAgICAnYTY5ZGNlNGE3ZDZjOThlOGQ0YTFhY2E4N2VmOGQ3MDAzZjgzYzIzMGYzYWZhNzI2YWI0MGU1MjI5MGJlMWM1NSdcclxuICAgICAgXSxcclxuICAgICAgW1xyXG4gICAgICAgICdjNDRkMTJjNzA2NWQ4MTJlOGFjZjI4ZDdjYmIxOWY5MDExZWNkOWU5ZmRmMjgxYjBlNmEzYjVlODdkMjJlN2RiJyxcclxuICAgICAgICAnMjExOWE0NjBjZTMyNmNkYzc2YzQ1OTI2Yzk4MmZkYWMwZTEwNmU4NjFlZGY2MWM1YTAzOTA2M2YwZTBlNjQ4MidcclxuICAgICAgXSxcclxuICAgICAgW1xyXG4gICAgICAgICc2YTI0NWJmNmRjNjk4NTA0Yzg5YTIwY2ZkZWQ2MDg1MzE1MmI2OTUzMzZjMjgwNjNiNjFjNjVjYmQyNjllNmI0JyxcclxuICAgICAgICAnZTAyMmNmNDJjMmJkNGE3MDhiM2Y1MTI2ZjE2YTI0YWQ4YjMzYmE0OGQwNDIzYjZlZmQ1ZTYzNDgxMDBkOGE4MidcclxuICAgICAgXSxcclxuICAgICAgW1xyXG4gICAgICAgICcxNjk3ZmZhNmZkOWRlNjI3YzA3N2UzZDJmZTU0MTA4NGNlMTMzMDBiMGJlYzExNDZmOTVhZTU3ZjBkMGJkNmE1JyxcclxuICAgICAgICAnYjljMzk4ZjE4NjgwNmY1ZDI3NTYxNTA2ZTQ1NTc0MzNhMmNmMTUwMDllNDk4YWU3YWRlZTlkNjNkMDFiMjM5NidcclxuICAgICAgXSxcclxuICAgICAgW1xyXG4gICAgICAgICc2MDViZGIwMTk5ODE3MThiOTg2ZDBmMDdlODM0Y2IwZDlkZWI4MzYwZmZiN2Y2MWRmOTgyMzQ1ZWYyN2E3NDc5JyxcclxuICAgICAgICAnMjk3MmQyZGU0ZjhkMjA2ODFhNzhkOTNlYzk2ZmUyM2MyNmJmYWU4NGZiMTRkYjQzYjAxZTFlOTA1NmI4YzQ5J1xyXG4gICAgICBdLFxyXG4gICAgICBbXHJcbiAgICAgICAgJzYyZDE0ZGFiNDE1MGJmNDk3NDAyZmRjNDVhMjE1ZTEwZGNiMDFjMzU0OTU5YjEwY2ZlMzFjN2U5ZDg3ZmYzM2QnLFxyXG4gICAgICAgICc4MGZjMDZiZDhjYzViMDEwOTgwODhhMTk1MGVlZDBkYjAxYWExMzI5NjdhYjQ3MjIzNWY1NjQyNDgzYjI1ZWFmJ1xyXG4gICAgICBdLFxyXG4gICAgICBbXHJcbiAgICAgICAgJzgwYzYwYWQwMDQwZjI3ZGFkZTViNGIwNmM0MDhlNTZiMmM1MGU5ZjU2YjliOGI0MjVlNTU1YzJmODYzMDhiNmYnLFxyXG4gICAgICAgICcxYzM4MzAzZjFjYzVjMzBmMjZlNjZiYWQ3ZmU3MmY3MGE2NWVlZDRjYmU3MDI0ZWIxYWEwMWY1NjQzMGJkNTdhJ1xyXG4gICAgICBdLFxyXG4gICAgICBbXHJcbiAgICAgICAgJzdhOTM3NWFkNjE2N2FkNTRhYTc0YzYzNDhjYzU0ZDM0NGNjNWRjOTQ4N2Q4NDcwNDlkNWVhYmIwZmEwM2M4ZmInLFxyXG4gICAgICAgICdkMGUzZmE5ZWNhODcyNjkwOTU1OWUwZDc5MjY5MDQ2YmRjNTllYTEwYzcwY2UyYjAyZDQ5OWVjMjI0ZGM3ZjcnXHJcbiAgICAgIF0sXHJcbiAgICAgIFtcclxuICAgICAgICAnZDUyOGVjZDliNjk2YjU0YzkwN2E5ZWQwNDU0NDdhNzliYjQwOGVjMzliNjhkZjUwNGJiNTFmNDU5YmMzZmZjOScsXHJcbiAgICAgICAgJ2VlY2Y0MTI1MzEzNmU1Zjk5OTY2ZjIxODgxZmQ2NTZlYmM0MzQ1NDA1YzUyMGRiYzA2MzQ2NWI1MjE0MDk5MzMnXHJcbiAgICAgIF0sXHJcbiAgICAgIFtcclxuICAgICAgICAnNDkzNzBhNGI1ZjQzNDEyZWEyNWY1MTRlOGVjZGFkMDUyNjYxMTVlNGE3ZWNiMTM4NzIzMTgwOGY4YjQ1OTYzJyxcclxuICAgICAgICAnNzU4ZjNmNDFhZmQ2ZWQ0MjhiMzA4MWIwNTEyZmQ2MmE1NGMzZjNhZmJiNWI2NzY0YjY1MzA1MmExMjk0OWM5YSdcclxuICAgICAgXSxcclxuICAgICAgW1xyXG4gICAgICAgICc3N2YyMzA5MzZlZTg4Y2JiZDczZGY5MzBkNjQ3MDJlZjg4MWQ4MTFlMGUxNDk4ZTJmMWMxM2ViMWZjMzQ1ZDc0JyxcclxuICAgICAgICAnOTU4ZWY0MmE3ODg2YjY0MDBhMDgyNjZlOWJhMWIzNzg5NmM5NTMzMGQ5NzA3N2NiYmU4ZWIzYzc2NzFjNjBkNidcclxuICAgICAgXSxcclxuICAgICAgW1xyXG4gICAgICAgICdmMmRhYzk5MWNjNGNlNGI5ZWE0NDg4N2U1YzdjMGJjZTU4YzgwMDc0YWI5ZDRkYmFlYjI4NTMxYjc3MzlmNTMwJyxcclxuICAgICAgICAnZTBkZWRjOWIzYjJmOGRhZDRkYTFmMzJkZWMyNTMxZGY5ZWI1ZmJlYjA1OThlNGZkMWExMTdkYmE3MDNhM2MzNydcclxuICAgICAgXSxcclxuICAgICAgW1xyXG4gICAgICAgICc0NjNiM2Q5ZjY2MjYyMWZiMWI0YmU4ZmJiZTI1MjAxMjVhMjE2Y2RmYzlkYWUzZGViY2JhNDg1MGM2OTBkNDViJyxcclxuICAgICAgICAnNWVkNDMwZDc4YzI5NmMzNTQzMTE0MzA2ZGQ4NjIyZDdjNjIyZTI3Yzk3MGExZGUzMWNiMzc3YjAxYWY3MzA3ZSdcclxuICAgICAgXSxcclxuICAgICAgW1xyXG4gICAgICAgICdmMTZmODA0MjQ0ZTQ2ZTJhMDkyMzJkNGFmZjNiNTk5NzZiOThmYWMxNDMyOGEyZDFhMzI0OTZiNDk5OThmMjQ3JyxcclxuICAgICAgICAnY2VkYWJkOWI4MjIwM2Y3ZTEzZDIwNmZjZGY0ZTMzZDkyYTZjNTNjMjZlNWNjZTI2ZDY1Nzk5NjJjNGUzMWRmNidcclxuICAgICAgXSxcclxuICAgICAgW1xyXG4gICAgICAgICdjYWY3NTQyNzJkYzg0NTYzYjAzNTJiN2ExNDMxMWFmNTVkMjQ1MzE1YWNlMjdjNjUzNjllMTVmNzE1MWQ0MWQxJyxcclxuICAgICAgICAnY2I0NzQ2NjBlZjM1ZjVmMmE0MWI2NDNmYTVlNDYwNTc1ZjRmYTliNzk2MjIzMmE1YzMyZjkwODMxOGEwNDQ3NidcclxuICAgICAgXSxcclxuICAgICAgW1xyXG4gICAgICAgICcyNjAwY2E0YjI4MmNiOTg2Zjg1ZDBmMTcwOTk3OWQ4YjQ0YTA5YzA3Y2I4NmQ3YzEyNDQ5N2JjODZmMDgyMTIwJyxcclxuICAgICAgICAnNDExOWI4ODc1M2MxNWJkNmE2OTNiMDNmY2RkYmI0NWQ1YWM2YmU3NGFiNWYwZWY0NGIwYmU5NDc1YTdlNGI0MCdcclxuICAgICAgXSxcclxuICAgICAgW1xyXG4gICAgICAgICc3NjM1Y2E3MmQ3ZTg0MzJjMzM4ZWM1M2NkMTIyMjBiYzAxYzQ4Njg1ZTI0ZjdkYzhjNjAyYTc3NDY5OThlNDM1JyxcclxuICAgICAgICAnOTFiNjQ5NjA5NDg5ZDYxM2QxZDVlNTkwZjc4ZTZkNzRlY2ZjMDYxZDU3MDQ4YmFkOWU3NmYzMDJjNWI5YzYxJ1xyXG4gICAgICBdLFxyXG4gICAgICBbXHJcbiAgICAgICAgJzc1NGUzMjM5ZjMyNTU3MGNkYmJmNGE4N2RlZWU4YTY2YjdmMmIzMzQ3OWQ0NjhmYmMxYTUwNzQzYmY1NmNjMTgnLFxyXG4gICAgICAgICc2NzNmYjg2ZTViZGEzMGZiM2NkMGVkMzA0ZWE0OWEwMjNlZTMzZDAxOTdhNjk1ZDBjNWQ5ODA5M2M1MzY2ODMnXHJcbiAgICAgIF0sXHJcbiAgICAgIFtcclxuICAgICAgICAnZTNlNmJkMTA3MWExZTk2YWZmNTc4NTljODJkNTcwZjAzMzA4MDA2NjFkMWM5NTJmOWZlMjY5NDY5MWQ5YjllOCcsXHJcbiAgICAgICAgJzU5YzllMGJiYTM5NGU3NmY0MGMwYWE1ODM3OWEzY2I2YTVhMjI4Mzk5M2U5MGM0MTY3MDAyYWY0OTIwZTM3ZjUnXHJcbiAgICAgIF0sXHJcbiAgICAgIFtcclxuICAgICAgICAnMTg2YjQ4M2QwNTZhMDMzODI2YWU3M2Q4OGY3MzI5ODVjNGNjYjFmMzJiYTM1ZjRiNGNjNDdmZGNmMDRhYTZlYicsXHJcbiAgICAgICAgJzNiOTUyZDMyYzY3Y2Y3N2UyZTE3NDQ2ZTIwNDE4MGFiMjFmYjgwOTA4OTUxMzhiNGE0YTc5N2Y4NmU4MDg4OGInXHJcbiAgICAgIF0sXHJcbiAgICAgIFtcclxuICAgICAgICAnZGY5ZDcwYTZiOTg3NmNlNTQ0Yzk4NTYxZjRiZTRmNzI1NDQyZTZkMmI3MzdkOWM5MWE4MzIxNzI0Y2UwOTYzZicsXHJcbiAgICAgICAgJzU1ZWIyZGFmZDg0ZDZjY2Q1Zjg2MmI3ODVkYzM5ZDRhYjE1NzIyMjcyMGVmOWRhMjE3YjhjNDVjZjJiYTI0MTcnXHJcbiAgICAgIF0sXHJcbiAgICAgIFtcclxuICAgICAgICAnNWVkZDVjYzIzYzUxZTg3YTQ5N2NhODE1ZDVkY2UwZjhhYjUyNTU0Zjg0OWVkODk5NWRlNjRjNWYzNGNlNzE0MycsXHJcbiAgICAgICAgJ2VmYWU5YzhkYmMxNDEzMDY2MWU4Y2VjMDMwYzg5YWQwYzEzYzY2YzBkMTdhMjkwNWNkYzcwNmFiNzM5OWE4NjgnXHJcbiAgICAgIF0sXHJcbiAgICAgIFtcclxuICAgICAgICAnMjkwNzk4YzJiNjQ3NjgzMGRhMTJmZTAyMjg3ZTllNzc3YWEzZmJhMWMzNTViMTdhNzIyZDM2MmY4NDYxNGZiYScsXHJcbiAgICAgICAgJ2UzOGRhNzZkY2Q0NDA2MjE5ODhkMDBiY2Y3OWFmMjVkNWIyOWMwOTRkYjJhMjMxNDZkMDAzYWZkNDE5NDNlN2EnXHJcbiAgICAgIF0sXHJcbiAgICAgIFtcclxuICAgICAgICAnYWYzYzQyM2E5NWQ5ZjViMzA1NDc1NGVmYTE1MGFjMzljZDI5NTUyZmUzNjAyNTczNjJkZmRlY2VmNDA1M2I0NScsXHJcbiAgICAgICAgJ2Y5OGEzZmQ4MzFlYjJiNzQ5YTkzYjBlNmYzNWNmYjQwYzhjZDVhYTY2N2ExNTU4MWJjMmZlZGVkNDk4ZmQ5YzYnXHJcbiAgICAgIF0sXHJcbiAgICAgIFtcclxuICAgICAgICAnNzY2ZGJiMjRkMTM0ZTc0NWNjY2FhMjhjOTliZjI3NDkwNmJiNjZiMjZkY2Y5OGRmOGQyZmVkNTBkODg0MjQ5YScsXHJcbiAgICAgICAgJzc0NGIxMTUyZWFjYmU1ZTM4ZGNjODg3OTgwZGEzOGI4OTc1ODRhNjVmYTA2Y2VkZDJjOTI0Zjk3Y2JhYzU5OTYnXHJcbiAgICAgIF0sXHJcbiAgICAgIFtcclxuICAgICAgICAnNTlkYmY0NmY4Yzk0NzU5YmEyMTI3N2MzMzc4NGY0MTY0NWY3YjQ0ZjZjNTk2YTU4Y2U5MmU2NjYxOTFhYmUzZScsXHJcbiAgICAgICAgJ2M1MzRhZDQ0MTc1ZmJjMzAwZjRlYTZjZTY0ODMwOWEwNDJjZTczOWE3OTE5Nzk4Y2Q4NWUyMTZjNGEzMDdmNmUnXHJcbiAgICAgIF0sXHJcbiAgICAgIFtcclxuICAgICAgICAnZjEzYWRhOTUxMDNjNDUzNzMwNWU2OTFlNzRlOWE0YThkZDY0N2U3MTFhOTVlNzNjYjYyZGM2MDE4Y2ZkODdiOCcsXHJcbiAgICAgICAgJ2UxMzgxN2I0NGVlMTRkZTY2M2JmNGJjODA4MzQxZjMyNjk0OWUyMWE2YTc1YzI1NzA3Nzg0MTliZGFmNTczM2QnXHJcbiAgICAgIF0sXHJcbiAgICAgIFtcclxuICAgICAgICAnNzc1NGI0ZmEwZThhY2VkMDZkNDE2N2EyYzU5Y2NhNGNkYTE4NjljMDZlYmFkZmI2NDg4NTUwMDE1YTg4NTIyYycsXHJcbiAgICAgICAgJzMwZTkzZTg2NGU2NjlkODIyMjRiOTY3YzMwMjBiOGZhOGQxZTRlMzUwYjZjYmNjNTM3YTQ4YjU3ODQxMTYzYTInXHJcbiAgICAgIF0sXHJcbiAgICAgIFtcclxuICAgICAgICAnOTQ4ZGNhZGY1OTkwZTA0OGFhMzg3NGQ0NmFiZWY5ZDcwMTg1OGY5NWRlODA0MWQyYTY4MjhjOTllMjI2MjUxOScsXHJcbiAgICAgICAgJ2U0OTFhNDI1MzdmNmU1OTdkNWQyOGEzMjI0YjFiYzI1ZGY5MTU0ZWZiZDJlZjFkMmNiYmEyY2FlNTM0N2Q1N2UnXHJcbiAgICAgIF0sXHJcbiAgICAgIFtcclxuICAgICAgICAnNzk2MjQxNDQ1MGM3NmMxNjg5YzdiNDhmODIwMmVjMzdmYjIyNGNmNWFjMGJmYTE1NzAzMjhhOGEzZDdjNzdhYicsXHJcbiAgICAgICAgJzEwMGI2MTBlYzRmZmI0NzYwZDVjMWZjMTMzZWY2ZjZiMTI1MDdhMDUxZjA0YWM1NzYwYWZhNWIyOWRiODM0MzcnXHJcbiAgICAgIF0sXHJcbiAgICAgIFtcclxuICAgICAgICAnMzUxNDA4NzgzNDk2NGI1NGIxNWIxNjA2NDRkOTE1NDg1YTE2OTc3MjI1Yjg4NDdiYjBkZDA4NTEzN2VjNDdjYScsXHJcbiAgICAgICAgJ2VmMGFmYmIyMDU2MjA1NDQ4ZTE2NTJjNDhlODEyN2ZjNjAzOWU3N2MxNWMyMzc4YjdlN2QxNWEwZGUyOTMzMTEnXHJcbiAgICAgIF0sXHJcbiAgICAgIFtcclxuICAgICAgICAnZDNjYzMwYWQ2YjQ4M2U0YmM3OWNlMmM5ZGQ4YmM1NDk5M2U5NDdlYjhkZjc4N2I0NDI5NDNkM2Y3YjUyN2VhZicsXHJcbiAgICAgICAgJzhiMzc4YTIyZDgyNzI3OGQ4OWM1ZTliZThmOTUwOGFlM2MyYWQ0NjI5MDM1ODYzMGFmYjM0ZGIwNGVlZGUwYTQnXHJcbiAgICAgIF0sXHJcbiAgICAgIFtcclxuICAgICAgICAnMTYyNGQ4NDc4MDczMjg2MGNlMWM3OGZjYmZlZmUwOGIyYjI5ODIzZGI5MTNmNjQ5Mzk3NWJhMGZmNDg0NzYxMCcsXHJcbiAgICAgICAgJzY4NjUxY2Y5YjZkYTkwM2UwOTE0NDQ4YzZjZDlkNGNhODk2ODc4ZjUyODJiZTRjOGNjMDZlMmE0MDQwNzg1NzUnXHJcbiAgICAgIF0sXHJcbiAgICAgIFtcclxuICAgICAgICAnNzMzY2U4MGRhOTU1YThhMjY5MDJjOTU2MzNlNjJhOTg1MTkyNDc0YjVhZjIwN2RhNmRmN2I0ZmQ1ZmM2MWNkNCcsXHJcbiAgICAgICAgJ2Y1NDM1YTJiZDJiYWRmN2Q0ODVhNGQ4YjhkYjlmY2NlM2UxZWY4ZTAyMDFlNDU3OGM1NDY3M2JjMWRjNWVhMWQnXHJcbiAgICAgIF0sXHJcbiAgICAgIFtcclxuICAgICAgICAnMTVkOTQ0MTI1NDk0NTA2NGNmMWExYzMzYmJkM2I0OWY4OTY2YzUwOTIxNzFlNjk5ZWYyNThkZmFiODFjMDQ1YycsXHJcbiAgICAgICAgJ2Q1NmViMzBiNjk0NjNlNzIzNGY1MTM3YjczYjg0MTc3NDM0ODAwYmFjZWJmYzY4NWZjMzdiYmU5ZWZlNDA3MGQnXHJcbiAgICAgIF0sXHJcbiAgICAgIFtcclxuICAgICAgICAnYTFkMGZjZjJlYzlkZTY3NWI2MTIxMzZlNWNlNzBkMjcxYzIxNDE3YzlkMmI4YWFhYWMxMzg1OTlkMDcxNzk0MCcsXHJcbiAgICAgICAgJ2VkZDc3ZjUwYmNiNWEzY2FiMmU5MDczNzMwOTY2N2YyNjQxNDYyYTU0MDcwZjNkNTE5MjEyZDM5YzE5N2E2MjknXHJcbiAgICAgIF0sXHJcbiAgICAgIFtcclxuICAgICAgICAnZTIyZmJlMTVjMGFmOGNjYzU3ODBjMDczNWY4NGRiZTlhNzkwYmFkZWU4MjQ1YzA2YzdjYTM3MzMxY2IzNjk4MCcsXHJcbiAgICAgICAgJ2E4NTViYWJhZDVjZDYwYzg4YjQzMGE2OWY1M2ExYTdhMzgyODkxNTQ5NjQ3OTliZTQzZDA2ZDc3ZDMxZGEwNidcclxuICAgICAgXSxcclxuICAgICAgW1xyXG4gICAgICAgICczMTEwOTFkZDk4NjBlOGUyMGVlMTM0NzNjMTE1NWY1ZjY5NjM1ZTM5NDcwNGVhYTc0MDA5NDUyMjQ2Y2ZhOWIzJyxcclxuICAgICAgICAnNjZkYjY1NmY4N2QxZjA0ZmZmZDFmMDQ3ODhjMDY4MzA4NzFlYzVhNjRmZWVlNjg1YmQ4MGYwYjEyODZkODM3NCdcclxuICAgICAgXSxcclxuICAgICAgW1xyXG4gICAgICAgICczNGMxZmQwNGQzMDFiZTg5YjMxYzA0NDJkM2U2YWMyNDg4MzkyOGI0NWE5MzQwNzgxODY3ZDQyMzJlYzJkYmRmJyxcclxuICAgICAgICAnOTQxNDY4NWU5N2IxYjU5NTRiZDQ2ZjczMDE3NDEzNmQ1N2YxY2VlYjQ4NzQ0M2RjNTMyMTg1N2JhNzNhYmVlJ1xyXG4gICAgICBdLFxyXG4gICAgICBbXHJcbiAgICAgICAgJ2YyMTllYTVkNmI1NDcwMWMxYzE0ZGU1YjU1N2ViNDJhOGQxM2YzYWJiY2QwOGFmZmNjMmE1ZTZiMDQ5YjhkNjMnLFxyXG4gICAgICAgICc0Y2I5NTk1N2U4M2Q0MGIwZjczYWY0NTQ0Y2NjZjZiMWY0YjA4ZDNjMDdiMjdmYjhkOGMyOTYyYTQwMDc2NmQxJ1xyXG4gICAgICBdLFxyXG4gICAgICBbXHJcbiAgICAgICAgJ2Q3Yjg3NDBmNzRhOGZiYWFiMWY2ODNkYjhmNDVkZTI2NTQzYTU0OTBiY2E2MjcwODcyMzY5MTI0NjlhMGI0NDgnLFxyXG4gICAgICAgICdmYTc3OTY4MTI4ZDljOTJlZTEwMTBmMzM3YWQ0NzE3ZWZmMTVkYjVlZDNjMDQ5YjM0MTFlMDMxNWVhYTQ1OTNiJ1xyXG4gICAgICBdLFxyXG4gICAgICBbXHJcbiAgICAgICAgJzMyZDMxYzIyMmY4ZjZmMGVmODZmN2M5OGQzYTMzMzVlYWQ1YmNkMzJhYmRkOTQyODlmZTRkMzA5MWFhODI0YmYnLFxyXG4gICAgICAgICc1ZjMwMzJmNTg5MjE1NmUzOWNjZDNkNzkxNWI5ZTFkYTJlNmRhYzllNmYyNmU5NjExMThkMTRiODQ2MmUxNjYxJ1xyXG4gICAgICBdLFxyXG4gICAgICBbXHJcbiAgICAgICAgJzc0NjFmMzcxOTE0YWIzMjY3MTA0NWExNTVkOTgzMWVhODc5M2Q3N2NkNTk1OTJjNDM0MGY4NmNiYzE4MzQ3YjUnLFxyXG4gICAgICAgICc4ZWMwYmEyMzhiOTZiZWMwY2JkZGRjYWUwYWE0NDI1NDJlZWUxZmY1MGM5ODZlYTZiMzk4NDdiM2NjMDkyZmY2J1xyXG4gICAgICBdLFxyXG4gICAgICBbXHJcbiAgICAgICAgJ2VlMDc5YWRiMWRmMTg2MDA3NDM1NmEyNWFhMzgyMDZhNmQ3MTZiMmMzZTY3NDUzZDI4NzY5OGJhZDdiMmIyZDYnLFxyXG4gICAgICAgICc4ZGMyNDEyYWFmZTNiZTVjNGM1ZjM3ZTBlY2M1ZjlmNmE0NDY5ODlhZjA0YzRlMjVlYmFhYzQ3OWVjMWM4YzFlJ1xyXG4gICAgICBdLFxyXG4gICAgICBbXHJcbiAgICAgICAgJzE2ZWM5M2U0NDdlYzgzZjA0NjdiMTgzMDJlZTYyMGY3ZTY1ZGUzMzE4NzRjOWRjNzJiZmQ4NjE2YmE5ZGE2YjUnLFxyXG4gICAgICAgICc1ZTQ2MzExNTBlNjJmYjQwZDBlOGMyYTdjYTU4MDRhMzlkNTgxODZhNTBlNDk3MTM5NjI2Nzc4ZTI1YjA2NzRkJ1xyXG4gICAgICBdLFxyXG4gICAgICBbXHJcbiAgICAgICAgJ2VhYTVmOTgwYzI0NWY2ZjAzODk3ODI5MGFmYTcwYjZiZDg4NTU4OTdmOThiNmFhNDg1Yjk2MDY1ZDUzN2JkOTknLFxyXG4gICAgICAgICdmNjVmNWQzZTI5MmMyZTA4MTlhNTI4MzkxYzk5NDYyNGQ3ODQ4NjlkN2U2ZWE2N2ZiMTgwNDEwMjRlZGMwN2RjJ1xyXG4gICAgICBdLFxyXG4gICAgICBbXHJcbiAgICAgICAgJzc4Yzk0MDc1NDRhYzEzMjY5MmVlMTkxMGEwMjQzOTk1OGFlMDQ4NzcxNTEzNDJlYTk2YzRiNmIzNWE0OWY1MScsXHJcbiAgICAgICAgJ2YzZTAzMTkxNjllYjliODVkNTQwNDc5NTUzOWE1ZTY4ZmExZmJkNTgzYzA2NGQyNDYyYjY3NWYxOTRhM2RkYjQnXHJcbiAgICAgIF0sXHJcbiAgICAgIFtcclxuICAgICAgICAnNDk0ZjRiZTIxOWExYTc3MDE2ZGNkODM4NDMxYWVhMDAwMWNkYzhhZTdhNmZjNjg4NzI2NTc4ZDk3MDI4NTdhNScsXHJcbiAgICAgICAgJzQyMjQyYTk2OTI4M2E1ZjMzOWJhN2YwNzVlMzZiYTJhZjkyNWNlMzBkNzY3ZWQ2ZTU1ZjRiMDMxODgwZDU2MmMnXHJcbiAgICAgIF0sXHJcbiAgICAgIFtcclxuICAgICAgICAnYTU5OGE4MDMwZGE2ZDg2YzZiYzdmMmY1MTQ0ZWE1NDlkMjgyMTFlYTU4ZmFhNzBlYmY0YzFlNjY1YzFmZTliNScsXHJcbiAgICAgICAgJzIwNGI1ZDZmODQ4MjJjMzA3ZTRiNGE3MTQwNzM3YWVjMjNmYzYzYjY1YjM1Zjg2YTEwMDI2ZGJkMmQ4NjRlNmInXHJcbiAgICAgIF0sXHJcbiAgICAgIFtcclxuICAgICAgICAnYzQxOTE2MzY1YWJiMmI1ZDA5MTkyZjVmMmRiZWFmZWMyMDhmMDIwZjEyNTcwYTE4NGRiYWRjM2U1ODU5NTk5NycsXHJcbiAgICAgICAgJzRmMTQzNTFkMDA4N2VmYTQ5ZDI0NWIzMjg5ODQ5ODlkNWNhZjk0NTBmMzRiZmMwZWQxNmU5NmI1OGZhOTkxMydcclxuICAgICAgXSxcclxuICAgICAgW1xyXG4gICAgICAgICc4NDFkNjA2M2E1ODZmYTQ3NWE3MjQ2MDRkYTAzYmM1YjkyYTJlMGQyZTBhMzZhY2ZlNGM3M2E1NTE0NzQyODgxJyxcclxuICAgICAgICAnNzM4NjdmNTljMDY1OWU4MTkwNGY5YTFjNzU0MzY5OGU2MjU2MmQ2NzQ0YzE2OWNlN2EzNmRlMDFhOGQ2MTU0J1xyXG4gICAgICBdLFxyXG4gICAgICBbXHJcbiAgICAgICAgJzVlOTViYjM5OWE2OTcxZDM3NjAyNjk0N2Y4OWJkZTJmMjgyYjMzODEwOTI4YmU0ZGVkMTEyYWM0ZDcwZTIwZDUnLFxyXG4gICAgICAgICczOWYyM2YzNjY4MDkwODViZWViZmM3MTE4MTMxMzc3NWE5OWM5YWVkN2Q4YmEzOGIxNjEzODRjNzQ2MDEyODY1J1xyXG4gICAgICBdLFxyXG4gICAgICBbXHJcbiAgICAgICAgJzM2ZTQ2NDFhNTM5NDhmZDQ3NmMzOWY4YTk5ZmQ5NzRlNWVjMDc1NjRiNTMxNWQ4YmY5OTQ3MWJjYTBlZjJmNjYnLFxyXG4gICAgICAgICdkMjQyNGIxYjFhYmU0ZWI4MTY0MjI3YjA4NWM5YWE5NDU2ZWExMzQ5M2ZkNTYzZTA2ZmQ1MWNmNTY5NGM3OGZjJ1xyXG4gICAgICBdLFxyXG4gICAgICBbXHJcbiAgICAgICAgJzMzNjU4MWVhN2JmYmJiMjkwYzE5MWEyZjUwN2E0MWNmNTY0Mzg0MjE3MGU5MTRmYWVhYjI3YzJjNTc5ZjcyNicsXHJcbiAgICAgICAgJ2VhZDEyMTY4NTk1ZmUxYmU5OTI1MjEyOWI2ZTU2YjMzOTFmN2FiMTQxMGNkMWUwZWYzZGNkY2FiZDJmZGEyMjQnXHJcbiAgICAgIF0sXHJcbiAgICAgIFtcclxuICAgICAgICAnOGFiODk4MTZkYWRmZDZiNmExZjI2MzRmY2YwMGVjODQwMzc4MTAyNWVkNjg5MGM0ODQ5NzQyNzA2YmQ0M2VkZScsXHJcbiAgICAgICAgJzZmZGNlZjA5ZjJmNmQwYTA0NGU2NTRhZWY2MjQxMzZmNTAzZDQ1OWMzZTg5ODQ1ODU4YTQ3YTkxMjljZGQyNGUnXHJcbiAgICAgIF0sXHJcbiAgICAgIFtcclxuICAgICAgICAnMWUzM2YxYTc0NmM5YzU3NzgxMzMzNDRkOTI5OWZjYWEyMGIwOTM4ZThhY2ZmMjU0NGJiNDAyODRiOGM1ZmI5NCcsXHJcbiAgICAgICAgJzYwNjYwMjU3ZGQxMWIzYWE5YzhlZDYxOGQyNGVkZmYyMzA2ZDMyMGYxZDAzMDEwZTMzYTdkMjA1N2YzYjNiNidcclxuICAgICAgXSxcclxuICAgICAgW1xyXG4gICAgICAgICc4NWI3YzFkY2IzY2VjMWI3ZWU3ZjMwZGVkNzlkZDIwYTBlZDFmNGNjMThjYmNmY2ZhNDEwMzYxZmQ4ZjA4ZjMxJyxcclxuICAgICAgICAnM2Q5OGE5Y2RkMDI2ZGQ0M2YzOTA0OGYyNWE4ODQ3ZjRmY2FmYWQxODk1ZDdhNjMzYzZmZWQzYzM1ZTk5OTUxMSdcclxuICAgICAgXSxcclxuICAgICAgW1xyXG4gICAgICAgICcyOWRmOWZiZDhkOWU0NjUwOTI3NWY0YjEyNWQ2ZDQ1ZDdmYmU5YTNiODc4YTdhZjg3MmEyODAwNjYxYWM1ZjUxJyxcclxuICAgICAgICAnYjRjNGZlOTljNzc1YTYwNmUyZDg4NjIxNzkxMzlmZmRhNjFkYzg2MWMwMTllNTVjZDI4NzZlYjJhMjdkODRiJ1xyXG4gICAgICBdLFxyXG4gICAgICBbXHJcbiAgICAgICAgJ2EwYjFjYWUwNmIwYTg0N2EzZmVhNmU2NzFhYWY4YWRmZGZlNThjYTJmNzY4MTA1YzgwODJiMmU0NDlmY2UyNTInLFxyXG4gICAgICAgICdhZTQzNDEwMmVkZGUwOTU4ZWM0YjE5ZDkxN2E2YTI4ZTZiNzJkYTE4MzRhZmYwZTY1MGYwNDk1MDNhMjk2Y2YyJ1xyXG4gICAgICBdLFxyXG4gICAgICBbXHJcbiAgICAgICAgJzRlOGNlYWZiOWIzZTlhMTM2ZGM3ZmY2N2U4NDAyOTViNDk5ZGZiM2IyMTMzZTRiYTExM2YyZTRjMGUxMjFlNScsXHJcbiAgICAgICAgJ2NmMjE3NDExOGM4YjZkN2E0YjQ4ZjZkNTM0Y2U1Yzc5NDIyYzA4NmE2MzQ2MDUwMmI4MjdjZTYyYTMyNjY4M2MnXHJcbiAgICAgIF0sXHJcbiAgICAgIFtcclxuICAgICAgICAnZDI0YTQ0ZTA0N2UxOWI2ZjVhZmI4MWM3Y2EyZjY5MDgwYTUwNzY2ODlhMDEwOTE5ZjQyNzI1YzJiNzg5YTMzYicsXHJcbiAgICAgICAgJzZmYjhkNTU5MWI0NjZmOGZjNjNkYjUwZjFjMGYxYzY5MDEzZjk5Njg4N2I4MjQ0ZDJjZGVjNDE3YWZlYThmYTMnXHJcbiAgICAgIF0sXHJcbiAgICAgIFtcclxuICAgICAgICAnZWEwMTYwNmE3YTZjOWNkZDI0OWZkZmNmYWNiOTk1ODQwMDFlZGQyOGFiYmFiNzdiNTEwNGU5OGU4ZTNiMzVkNCcsXHJcbiAgICAgICAgJzMyMmFmNDkwOGM3MzEyYjBjZmJmZTM2OWY3YTdiM2NkYjdkNDQ5NGJjMjgyMzcwMGNmZDY1MjE4OGEzZWE5OGQnXHJcbiAgICAgIF0sXHJcbiAgICAgIFtcclxuICAgICAgICAnYWY4YWRkYmYyYjY2MWM4YTZjNjMyODY1NWViOTY2NTEyNTIwMDdkOGM1ZWEzMWJlNGFkMTk2ZGU4Y2UyMTMxZicsXHJcbiAgICAgICAgJzY3NDllNjdjMDI5Yjg1ZjUyYTAzNGVhZmQwOTY4MzZiMjUyMDgxODY4MGUyNmFjOGYzZGZiY2RiNzE3NDk3MDAnXHJcbiAgICAgIF0sXHJcbiAgICAgIFtcclxuICAgICAgICAnZTNhZTE5NzQ1NjZjYTA2Y2M1MTZkNDdlMGZiMTY1YTY3NGEzZGFiY2ZjYTE1ZTcyMmYwZTM0NTBmNDU4ODknLFxyXG4gICAgICAgICcyYWVhYmU3ZTQ1MzE1MTAxMTYyMTdmMDdiZjRkMDczMDBkZTk3ZTQ4NzRmODFmNTMzNDIwYTcyZWViMGJkNmE0J1xyXG4gICAgICBdLFxyXG4gICAgICBbXHJcbiAgICAgICAgJzU5MWVlMzU1MzEzZDk5NzIxY2Y2OTkzZmZlZDFlM2UzMDE5OTNmZjNlZDI1ODgwMjA3NWVhOGNlZDM5N2UyNDYnLFxyXG4gICAgICAgICdiMGVhNTU4YTExM2MzMGJlYTYwZmM0Nzc1NDYwYzc5MDFmZjBiMDUzZDI1Y2EyYmRlZWU5OGYxYTRiZTVkMTk2J1xyXG4gICAgICBdLFxyXG4gICAgICBbXHJcbiAgICAgICAgJzExMzk2ZDU1ZmRhNTRjNDlmMTlhYTk3MzE4ZDhkYTYxZmE4NTg0ZTQ3YjA4NDk0NTA3N2NmMDMyNTViNTI5ODQnLFxyXG4gICAgICAgICc5OThjNzRhOGNkNDVhYzAxMjg5ZDU4MzNhN2JlYjQ3NDRmZjUzNmIwMWIyNTdiZTRjNTc2N2JlYTkzZWE1N2E0J1xyXG4gICAgICBdLFxyXG4gICAgICBbXHJcbiAgICAgICAgJzNjNWQyYTFiYTM5YzVhMTc5MDAwMDczOGM5ZTBjNDBiOGRjZGZkNTQ2ODc1NGI2NDA1NTQwMTU3ZTAxN2FhN2EnLFxyXG4gICAgICAgICdiMjI4NDI3OTk5NWEzNGUyZjlkNGRlNzM5NmZjMThiODBmOWI4YjlmZGQyNzBmNjY2MWY3OWNhNGM4MWJkMjU3J1xyXG4gICAgICBdLFxyXG4gICAgICBbXHJcbiAgICAgICAgJ2NjODcwNGI4YTYwYTBkZWZhM2E5OWE3Mjk5ZjJlOWMzZmJjMzk1YWZiMDRhYzA3ODQyNWVmOGExNzkzY2MwMzAnLFxyXG4gICAgICAgICdiZGQ0NjAzOWZlZWQxNzg4MWQxZTA4NjJkYjM0N2Y4Y2YzOTViNzRmYzRiY2RjNGU5NDBiNzRlM2FjMWYxYjEzJ1xyXG4gICAgICBdLFxyXG4gICAgICBbXHJcbiAgICAgICAgJ2M1MzNlNGY3ZWE4NTU1YWFjZDk3NzdhYzVjYWQyOWI5N2RkNGRlZmNjYzUzZWU3ZWEyMDQxMTliMjg4OWIxOTcnLFxyXG4gICAgICAgICc2ZjBhMjU2YmM1ZWZkZjQyOWEyZmI2MjQyZjFhNDNhMmQ5YjkyNWJiNGE0YjNhMjZiYjhlMGY0NWViNTk2MDk2J1xyXG4gICAgICBdLFxyXG4gICAgICBbXHJcbiAgICAgICAgJ2MxNGY4ZjJjY2IyN2Q2ZjEwOWY2ZDA4ZDAzY2M5NmE2OWJhOGMzNGVlYzA3YmJjZjU2NmQ0OGUzM2RhNjU5MycsXHJcbiAgICAgICAgJ2MzNTlkNjkyM2JiMzk4ZjdmZDQ0NzNlMTZmZTFjMjg0NzViNzQwZGQwOTgwNzVlNmMwZTg2NDkxMTNkYzNhMzgnXHJcbiAgICAgIF0sXHJcbiAgICAgIFtcclxuICAgICAgICAnYTZjYmMzMDQ2YmM2YTQ1MGJhYzI0Nzg5ZmExNzExNWE0Yzk3MzllZDc1ZjhmMjFjZTQ0MWY3MmUwYjkwZTZlZicsXHJcbiAgICAgICAgJzIxYWU3ZjQ2ODBlODg5YmIxMzA2MTllMmMwZjk1YTM2MGNlYjU3M2M3MDYwMzEzOTg2MmFmZDYxN2ZhOWI5ZidcclxuICAgICAgXSxcclxuICAgICAgW1xyXG4gICAgICAgICczNDdkNmQ5YTAyYzQ4OTI3ZWJmYjg2YzEzNTliMWNhZjEzMGEzYzAyNjdkMTFjZTYzNDRiMzlmOTlkNDNjYzM4JyxcclxuICAgICAgICAnNjBlYTdmNjFhMzUzNTI0ZDFjOTg3ZjZlY2VjOTJmMDg2ZDU2NWFiNjg3ODcwY2IxMjY4OWZmMWUzMWM3NDQ0OCdcclxuICAgICAgXSxcclxuICAgICAgW1xyXG4gICAgICAgICdkYTY1NDVkMjE4MWRiOGQ5ODNmN2RjYjM3NWVmNTg2NmQ0N2M2N2IxYmYzMWM4Y2Y4NTVlZjc0MzdiNzI2NTZhJyxcclxuICAgICAgICAnNDliOTY3MTVhYjY4NzhhNzllNzhmMDdjZTU2ODBjNWQ2NjczMDUxYjQ5MzViZDg5N2ZlYTgyNGI3N2RjMjA4YSdcclxuICAgICAgXSxcclxuICAgICAgW1xyXG4gICAgICAgICdjNDA3NDdjYzlkMDEyY2IxYTEzYjgxNDgzMDljNmRlN2VjMjVkNjk0NWQ2NTcxNDZiOWQ1OTk0YjhmZWIxMTExJyxcclxuICAgICAgICAnNWNhNTYwNzUzYmUyYTEyZmM2ZGU2Y2FmMmNiNDg5NTY1ZGI5MzYxNTZiOTUxNGUxYmI1ZTgzMDM3ZTBmYTJkNCdcclxuICAgICAgXSxcclxuICAgICAgW1xyXG4gICAgICAgICc0ZTQyYzhlYzgyYzk5Nzk4Y2NmM2E2MTBiZTg3MGU3ODMzOGM3ZjcxMzM0OGJkMzRjODIwM2VmNDAzN2YzNTAyJyxcclxuICAgICAgICAnNzU3MWQ3NGVlNWUwZmI5MmE3YThiMzNhMDc3ODMzNDFhNTQ5MjE0NGNjNTRiY2M0MGE5NDQ3MzY5MzYwNjQzNydcclxuICAgICAgXSxcclxuICAgICAgW1xyXG4gICAgICAgICczNzc1YWI3MDg5YmM2YWY4MjNhYmEyZTFhZjcwYjIzNmQyNTFjYWRiMGM4Njc0MzI4NzUyMmExYjNiMGRlZGVhJyxcclxuICAgICAgICAnYmU1MmQxMDdiY2ZhMDlkOGJjYjk3MzZhODI4Y2ZhN2ZhYzhkYjE3YmY3YTc2YTJjNDJhZDk2MTQwOTAxOGNmNydcclxuICAgICAgXSxcclxuICAgICAgW1xyXG4gICAgICAgICdjZWUzMWNiZjdlMzRlYzM3OWQ5NGZiODE0ZDNkNzc1YWQ5NTQ1OTVkMTMxNGJhODg0Njk1OWUzZTgyZjc0ZTI2JyxcclxuICAgICAgICAnOGZkNjRhMTRjMDZiNTg5YzI2Yjk0N2FlMmJjZjZiZmEwMTQ5ZWYwYmUxNGVkNGQ4MGY0NDhhMDFjNDNiMWM2ZCdcclxuICAgICAgXSxcclxuICAgICAgW1xyXG4gICAgICAgICdiNGY5ZWFlYTA5YjY5MTc2MTlmNmVhNmE0ZWI1NDY0ZWZkZGI1OGZkNDViMWViZWZjZGMxYTAxZDA4YjQ3OTg2JyxcclxuICAgICAgICAnMzllNWM5OTI1YjVhNTRiMDc0MzNhNGYxOGM2MTcyNmY4YmIxMzFjMDEyY2E1NDJlYjI0YThhYzA3MjAwNjgyYSdcclxuICAgICAgXSxcclxuICAgICAgW1xyXG4gICAgICAgICdkNDI2M2RmYzNkMmRmOTIzYTAxNzlhNDg5NjZkMzBjZTg0ZTI1MTVhZmMzZGNjYzFiNzc5MDc3OTJlYmNjNjBlJyxcclxuICAgICAgICAnNjJkZmFmMDdhMGY3OGZlYjMwZTMwZDYyOTU4NTNjZTE4OWUxMjc3NjBhZDZjZjdmYWUxNjRlMTIyYTIwOGQ1NCdcclxuICAgICAgXSxcclxuICAgICAgW1xyXG4gICAgICAgICc0ODQ1NzUyNDgyMGZhNjVhNGY4ZDM1ZWI2OTMwODU3YzAwMzJhY2MwYTRhMmRlNDIyMjMzZWVkYTg5NzYxMmM0JyxcclxuICAgICAgICAnMjVhNzQ4YWIzNjc5NzlkOTg3MzNjMzhhMWZhMWMyZTdkYzZjYzA3ZGIyZDYwYTlhZTdhNzZhYWE0OWJkMGY3NydcclxuICAgICAgXSxcclxuICAgICAgW1xyXG4gICAgICAgICdkZmVlZWYxODgxMTAxZjJjYjExNjQ0ZjNhMmFmZGZjMjA0NWUxOTkxOTE1MjkyM2YzNjdhMTc2N2MxMWNjZWRhJyxcclxuICAgICAgICAnZWNmYjcwNTZjZjFkZTA0MmY5NDIwYmFiMzk2NzkzYzBjMzkwYmRlNzRiNGJiZGZmMTZhODNhZTA5YTlhNzUxNydcclxuICAgICAgXSxcclxuICAgICAgW1xyXG4gICAgICAgICc2ZDdlZjZiMTc1NDNmODM3M2M1NzNmNDRlMWYzODk4MzVkODliY2JjNjA2MmNlZDM2YzgyZGY4M2I4ZmFlODU5JyxcclxuICAgICAgICAnY2Q0NTBlYzMzNTQzODk4NmRmZWZhMTBjNTdmZWE5YmNjNTIxYTA5NTliMmQ4MGJiZjc0YjE5MGRjYTcxMmQxMCdcclxuICAgICAgXSxcclxuICAgICAgW1xyXG4gICAgICAgICdlNzU2MDVkNTkxMDJhNWEyNjg0NTAwZDNiOTkxZjJlM2YzYzg4YjkzMjI1NTQ3MDM1YWYyNWFmNjZlMDQ1NDFmJyxcclxuICAgICAgICAnZjVjNTQ3NTRhOGY3MWVlNTQwYjliNDg3Mjg0NzNlMzE0ZjcyOWFjNTMwOGIwNjkzODM2MDk5MGUyYmZhZDEyNSdcclxuICAgICAgXSxcclxuICAgICAgW1xyXG4gICAgICAgICdlYjk4NjYwZjRjNGRmYWEwNmEyYmU0NTNkNTAyMGJjOTlhMGMyZTYwYWJlMzg4NDU3ZGQ0M2ZlZmIxZWQ2MjBjJyxcclxuICAgICAgICAnNmNiOWE4ODc2ZDljYjg1MjA2MDlhZjNhZGQyNmNkMjBhMGE3Y2Q4YTk0MTExMzFjZTg1ZjQ0MTAwMDk5MjIzZSdcclxuICAgICAgXSxcclxuICAgICAgW1xyXG4gICAgICAgICcxM2U4N2IwMjdkODUxNGQzNTkzOWYyZTY4OTJiMTk5MjIxNTQ1OTY5NDE4ODgzMzZkYzM1NjNlM2I4ZGJhOTQyJyxcclxuICAgICAgICAnZmVmNWEzYzY4MDU5YTZkZWM1ZDYyNDExNGJmMWU5MWFhYzJiOWRhNTY4ZDZhYmViMjU3MGQ1NTY0NmI4YWRmMSdcclxuICAgICAgXSxcclxuICAgICAgW1xyXG4gICAgICAgICdlZTE2MzAyNmU5ZmQ2ZmUwMTdjMzhmMDZhNWJlNmZjMTI1NDI0YjM3MWNlMjcwOGU3YmY0NDkxNjkxZTU3NjRhJyxcclxuICAgICAgICAnMWFjYjI1MGYyNTVkZDYxYzQzZDk0Y2NjNjcwZDBmNThmNDlhZTNmYTE1Yjk2NjIzZTU0MzBkYTBhZDZjNjJiMidcclxuICAgICAgXSxcclxuICAgICAgW1xyXG4gICAgICAgICdiMjY4ZjVlZjlhZDUxZTRkNzhkZTNhNzUwYzJkYzg5YjFlNjI2ZDQzNTA1ODY3OTk5OTMyZTVkYjMzYWYzZDgwJyxcclxuICAgICAgICAnNWYzMTBkNGIzYzk5YjllYmIxOWY3N2Q0MWMxZGVlMDE4Y2YwZDM0ZmQ0MTkxNjE0MDAzZTk0NWExMjE2ZTQyMydcclxuICAgICAgXSxcclxuICAgICAgW1xyXG4gICAgICAgICdmZjA3ZjMxMThhOWRmMDM1ZTlmYWQ4NWViNmM3YmZlNDJiMDJmMDFjYTk5Y2VlYTNiZjdmZmRiYTkzYzQ3NTBkJyxcclxuICAgICAgICAnNDM4MTM2ZDYwM2U4NThhM2E1YzQ0MGMzOGVjY2JhZGRjMWQyOTQyMTE0ZTJlZGRkNDc0MGQwOThjZWQxZjBkOCdcclxuICAgICAgXSxcclxuICAgICAgW1xyXG4gICAgICAgICc4ZDhiOTg1NWM3YzA1MmEzNDE0NmZkMjBmZmI2NThiZWE0YjlmNjllMGQ4MjVlYmVjMTZlOGMzY2UyYjUyNmExJyxcclxuICAgICAgICAnY2RiNTU5ZWVkYzJkNzlmOTI2YmFmNDRmYjg0ZWE0ZDQ0YmNmNTBmZWU1MWQ3Y2ViMzBlMmU3ZjQ2MzAzNjc1OCdcclxuICAgICAgXSxcclxuICAgICAgW1xyXG4gICAgICAgICc1MmRiMGI1Mzg0ZGZiZjA1YmZhOWQ0NzJkN2FlMjZkZmU0Yjg1MWNlY2E5MWIxZWJhNTQyNjMxODBkYTMyYjYzJyxcclxuICAgICAgICAnYzNiOTk3ZDA1MGVlNWQ0MjNlYmFmNjZhNmRiOWY1N2IzMTgwYzkwMjg3NTY3OWRlOTI0YjY5ZDg0YTdiMzc1J1xyXG4gICAgICBdLFxyXG4gICAgICBbXHJcbiAgICAgICAgJ2U2MmY5NDkwZDNkNTFkYTYzOTVlZmQyNGU4MDkxOWNjN2QwZjI5YzNmM2ZhNDhjNmZmZjU0M2JlY2JkNDMzNTInLFxyXG4gICAgICAgICc2ZDg5YWQ3YmE0ODc2YjBiMjJjMmNhMjgwYzY4Mjg2MmYzNDJjODU5MWYxZGFmNTE3MGUwN2JmZDljY2FmYTdkJ1xyXG4gICAgICBdLFxyXG4gICAgICBbXHJcbiAgICAgICAgJzdmMzBlYTI0NzZiMzk5YjQ5NTc1MDljODhmNzdkMDE5MWFmYTJmZjVjYjdiMTRmZDZkOGU3ZDY1YWFhYjExOTMnLFxyXG4gICAgICAgICdjYTVlZjdkNGIyMzFjOTRjM2IxNTM4OWE1ZjYzMTFlOWRhZmY3YmI2N2IxMDNlOTg4MGVmNGJmZjYzN2FjYWVjJ1xyXG4gICAgICBdLFxyXG4gICAgICBbXHJcbiAgICAgICAgJzUwOThmZjFlMWQ5ZjE0ZmI0NmEyMTBmYWRhNmM5MDNmZWYwZmI3YjRhMWRkMWQ5YWM2MGEwMzYxODAwYjdhMDAnLFxyXG4gICAgICAgICc5NzMxMTQxZDgxZmM4ZjgwODRkMzdjNmU3NTQyMDA2YjNlZTFiNDBkNjBkZmU1MzYyYTViMTMyZmQxN2RkYzAnXHJcbiAgICAgIF0sXHJcbiAgICAgIFtcclxuICAgICAgICAnMzJiNzhjN2RlOWVlNTEyYTcyODk1YmU2YjljYmVmYTZlMmYzYzRjY2NlNDQ1Yzk2YjlmMmM4MWUyNzc4YWQ1OCcsXHJcbiAgICAgICAgJ2VlMTg0OWY1MTNkZjcxZTMyZWZjMzg5NmVlMjgyNjBjNzNiYjgwNTQ3YWUyMjc1YmE0OTcyMzc3OTRjODc1M2MnXHJcbiAgICAgIF0sXHJcbiAgICAgIFtcclxuICAgICAgICAnZTJjYjc0ZmRkYzhlOWZiY2QwNzZlZWYyYTdjNzJiMGNlMzdkNTBmMDgyNjlkZmMwNzRiNTgxNTUwNTQ3YTRmNycsXHJcbiAgICAgICAgJ2QzYWEyZWQ3MWM5ZGQyMjQ3YTYyZGYwNjI3MzZlYjBiYWRkZWE5ZTM2MTIyZDJiZTg2NDFhYmNiMDA1Y2M0YTQnXHJcbiAgICAgIF0sXHJcbiAgICAgIFtcclxuICAgICAgICAnODQzODQ0NzU2NmQ0ZDdiZWRhZGMyOTk0OTZhYjM1NzQyNjAwOWEzNWYyMzVjYjE0MWJlMGQ5OWNkMTBhZTNhOCcsXHJcbiAgICAgICAgJ2M0ZTEwMjA5MTY5ODBhNGRhNWQwMWFjNWU2YWQzMzA3MzRlZjBkNzkwNjYzMWM0ZjIzOTA0MjZiMmVkZDc5MWYnXHJcbiAgICAgIF0sXHJcbiAgICAgIFtcclxuICAgICAgICAnNDE2MmQ0ODhiODk0MDIwMzliNTg0YzZmYzZjMzA4ODcwNTg3ZDljNDZmNjYwYjg3OGFiNjVjODJjNzExZDY3ZScsXHJcbiAgICAgICAgJzY3MTYzZTkwMzIzNjI4OWY3NzZmMjJjMjVmYjhhM2FmYzE3MzJmMmI4NGI0ZTk1ZGJkYTQ3YWU1YTA4NTI2NDknXHJcbiAgICAgIF0sXHJcbiAgICAgIFtcclxuICAgICAgICAnM2ZhZDNmYTg0Y2FmMGYzNGYwZjg5YmZkMmRjZjU0ZmMxNzVkNzY3YWVjM2U1MDY4NGYzYmE0YTRiZjVmNjgzZCcsXHJcbiAgICAgICAgJ2NkMWJjN2NiNmNjNDA3YmIyZjBjYTY0N2M3MThhNzMwY2Y3MTg3MmU3ZDBkMmE1M2ZhMjBlZmNkZmU2MTgyNidcclxuICAgICAgXSxcclxuICAgICAgW1xyXG4gICAgICAgICc2NzRmMjYwMGEzMDA3YTAwNTY4YzFhN2NlMDVkMDgxNmMxZmI4NGJmMTM3MDc5OGYxYzY5NTMyZmFlYjFhODZiJyxcclxuICAgICAgICAnMjk5ZDIxZjk0MTNmMzNiM2VkZjQzYjI1NzAwNDU4MGI3MGRiNTdkYTBiMTgyMjU5ZTA5ZWVjYzY5ZTBkMzhhNSdcclxuICAgICAgXSxcclxuICAgICAgW1xyXG4gICAgICAgICdkMzJmNGRhNTRhZGU3NGFiYjgxYjgxNWFkMWZiM2IyNjNkODJkNmM2OTI3MTRiY2ZmODdkMjliZDVlZTlmMDhmJyxcclxuICAgICAgICAnZjk0MjllNzM4YjhlNTNiOTY4ZTk5MDE2YzA1OTcwNzc4MmUxNGY0NTM1MzU5ZDU4MmZjNDE2OTEwYjNlZWE4NydcclxuICAgICAgXSxcclxuICAgICAgW1xyXG4gICAgICAgICczMGU0ZTY3MDQzNTM4NTU1NmU1OTM2NTcxMzU4NDVkMzZmYmI2OTMxZjcyYjA4Y2IxZWQ5NTRmMWUzY2UzZmY2JyxcclxuICAgICAgICAnNDYyZjliY2U2MTk4OTg2Mzg0OTkzNTAxMTNiYmM5YjEwYTg3OGQzNWRhNzA3NDBkYzY5NWE1NTllYjg4ZGI3YidcclxuICAgICAgXSxcclxuICAgICAgW1xyXG4gICAgICAgICdiZTIwNjIwMDNjNTFjYzMwMDQ2ODI5MDQzMzBlNGRlZTdmM2RjZDEwYjAxZTU4MGJmMTk3MWIwNGQ0Y2FkMjk3JyxcclxuICAgICAgICAnNjIxODhiYzQ5ZDYxZTU0Mjg1NzNkNDhhNzRlMWM2NTViMWM2MTA5MDkwNTY4MmEwZDU1NThlZDcyZGNjYjliYydcclxuICAgICAgXSxcclxuICAgICAgW1xyXG4gICAgICAgICc5MzE0NDQyM2FjZTM0NTFlZDI5ZTBmYjlhYzJhZjIxMWNiNmU4NGE2MDFkZjU5OTNjNDE5ODU5ZmZmNWRmMDRhJyxcclxuICAgICAgICAnN2MxMGRmYjE2NGMzNDI1ZjVjNzFhM2Y5ZDc5OTIwMzhmMTA2NTIyNGY3MmJiOWQxZDkwMmE2ZDEzMDM3YjQ3YydcclxuICAgICAgXSxcclxuICAgICAgW1xyXG4gICAgICAgICdiMDE1ZjgwNDRmNWZjYmRjZjIxY2EyNmQ2YzM0ZmI4MTk3ODI5MjA1YzdiN2QyYTdjYjY2NDE4YzE1N2IxMTJjJyxcclxuICAgICAgICAnYWI4YzFlMDg2ZDA0ZTgxMzc0NGE2NTViMmRmOGQ1ZjgzYjNjZGM2ZmFhMzA4OGMxZDNhZWExNDU0ZTNhMWQ1ZidcclxuICAgICAgXSxcclxuICAgICAgW1xyXG4gICAgICAgICdkNWU5ZTFkYTY0OWQ5N2Q4OWU0ODY4MTE3YTQ2NWEzYTRmOGExOGRlNTdhMTQwZDM2YjNmMmFmMzQxYTIxYjUyJyxcclxuICAgICAgICAnNGNiMDQ0MzdmMzkxZWQ3MzExMWExM2NjMWQ0ZGQwZGIxNjkzNDY1YzIyNDA0ODBkODk1NWU4NTkyZjI3NDQ3YSdcclxuICAgICAgXSxcclxuICAgICAgW1xyXG4gICAgICAgICdkM2FlNDEwNDdkZDdjYTA2NWRiZjhlZDc3Yjk5MjQzOTk4MzAwNWNkNzJlMTZkNmY5OTZhNTMxNmQzNjk2NmJiJyxcclxuICAgICAgICAnYmQxYWViMjFhZDIyZWJiMjJhMTBmMDMwMzQxN2M2ZDk2NGY4Y2RkN2RmMGFjYTYxNGIxMGRjMTRkMTI1YWM0NidcclxuICAgICAgXSxcclxuICAgICAgW1xyXG4gICAgICAgICc0NjNlMjc2M2Q4ODVmOTU4ZmM2NmNkZDIyODAwZjBhNDg3MTk3ZDBhODJlMzc3YjQ5ZjgwYWY4N2M4OTdiMDY1JyxcclxuICAgICAgICAnYmZlZmFjZGIwZTVkMGZkN2RmM2EzMTFhOTRkZTA2MmIyNmI4MGM2MWZiYzk3NTA4Yjc5OTkyNjcxZWY3Y2E3ZidcclxuICAgICAgXSxcclxuICAgICAgW1xyXG4gICAgICAgICc3OTg1ZmRmZDEyN2MwNTY3YzZmNTNlYzFiYjYzZWMzMTU4ZTU5N2M0MGJmZTc0N2M4M2NkZGZjOTEwNjQxOTE3JyxcclxuICAgICAgICAnNjAzYzEyZGFmM2Q5ODYyZWYyYjI1ZmUxZGUyODlhZWQyNGVkMjkxZTBlYzY3MDg3MDNhNWJkNTY3ZjMyZWQwMydcclxuICAgICAgXSxcclxuICAgICAgW1xyXG4gICAgICAgICc3NGExYWQ2YjVmNzZlMzlkYjJkZDI0OTQxMGVhYzdmOTllNzRjNTljYjgzZDJkMGVkNWZmMTU0M2RhNzcwM2U5JyxcclxuICAgICAgICAnY2M2MTU3ZWYxOGM5YzYzY2Q2MTkzZDgzNjMxYmJlYTAwOTNlMDk2ODk0MmU4YzMzZDU3MzdmZDc5MGUwZGIwOCdcclxuICAgICAgXSxcclxuICAgICAgW1xyXG4gICAgICAgICczMDY4MmE1MDcwMzM3NWY2MDJkNDE2NjY0YmExOWI3ZmM5YmFiNDJjNzI3NDc0NjNhNzFkMDg5NmIyMmY2ZGEzJyxcclxuICAgICAgICAnNTUzZTA0ZjZiMDE4YjRmYTZjOGYzOWU3ZjMxMWQzMTc2MjkwZDBlMGYxOWNhNzNmMTc3MTRkOTk3N2EyMmZmOCdcclxuICAgICAgXSxcclxuICAgICAgW1xyXG4gICAgICAgICc5ZTIxNThmMGQ3YzBkNWYyNmMzNzkxZWZlZmE3OTU5NzY1NGU3YTJiMjQ2NGY1MmIxZWU2YzEzNDc3NjllZjU3JyxcclxuICAgICAgICAnNzEyZmNkZDFiOTA1M2YwOTAwM2EzNDgxZmE3NzYyZTlmZmQ3YzhlZjM1YTM4NTA5ZTJmYmYyNjI5MDA4MzczJ1xyXG4gICAgICBdLFxyXG4gICAgICBbXHJcbiAgICAgICAgJzE3NmUyNjk4OWE0M2M5Y2ZlYmE0MDI5YzIwMjUzOGMyODE3MmU1NjZlM2M0ZmNlNzMyMjg1N2YzYmUzMjdkNjYnLFxyXG4gICAgICAgICdlZDhjYzlkMDRiMjllYjg3N2QyNzBiNDg3OGRjNDNjMTlhZWZkMzFmNGVlZTA5ZWU3YjQ3ODM0YzFmYTRiMWMzJ1xyXG4gICAgICBdLFxyXG4gICAgICBbXHJcbiAgICAgICAgJzc1ZDQ2ZWZlYTM3NzFlNmU2OGFiYjg5YTEzYWQ3NDdlY2YxODkyMzkzZGZjNGYxYjcwMDQ3ODhjNTAzNzRkYTgnLFxyXG4gICAgICAgICc5ODUyMzkwYTk5NTA3Njc5ZmQwYjg2ZmQyYjM5YTg2OGQ3ZWZjMjIxNTEzNDZlMWEzY2E0NzI2NTg2YTZiZWQ4J1xyXG4gICAgICBdLFxyXG4gICAgICBbXHJcbiAgICAgICAgJzgwOWEyMGM2N2Q2NDkwMGZmYjY5OGM0YzgyNWY2ZDVmMjMxMGZiMDQ1MWM4NjkzNDViNzMxOWY2NDU2MDU3MjEnLFxyXG4gICAgICAgICc5ZTk5NDk4MGQ5OTE3ZTIyYjc2YjA2MTkyN2ZhMDQxNDNkMDk2Y2NjNTQ5NjNlNmE1ZWJmYTVmM2Y4ZTI4NmMxJ1xyXG4gICAgICBdLFxyXG4gICAgICBbXHJcbiAgICAgICAgJzFiMzg5MDNhNDNmN2YxMTRlZDQ1MDBiNGVhYzcwODNmZGVmZWNlMWNmMjljNjM1MjhkNTYzNDQ2Zjk3MmMxODAnLFxyXG4gICAgICAgICc0MDM2ZWRjOTMxYTYwYWU4ODkzNTNmNzdmZDUzZGU0YTI3MDhiMjZiNmY1ZGE3MmFkMzM5NDExOWRhZjQwOGY5J1xyXG4gICAgICBdXHJcbiAgICBdXHJcbiAgfVxyXG59O1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgY3VydmUgPSBleHBvcnRzO1xyXG5cclxuY3VydmUuYmFzZSA9IHJlcXVpcmUoJy4vYmFzZScpO1xyXG5jdXJ2ZS5zaG9ydCA9IHJlcXVpcmUoJy4vc2hvcnQnKTtcclxuY3VydmUubW9udCA9IHJlcXVpcmUoJy4vbW9udCcpO1xyXG5jdXJ2ZS5lZHdhcmRzID0gcmVxdWlyZSgnLi9lZHdhcmRzJyk7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBCTiA9IHJlcXVpcmUoJ2JuLmpzJyk7XHJcbnZhciBlbGxpcHRpYyA9IHJlcXVpcmUoJy4uLy4uL2VsbGlwdGljJyk7XHJcbnZhciB1dGlscyA9IGVsbGlwdGljLnV0aWxzO1xyXG52YXIgYXNzZXJ0ID0gdXRpbHMuYXNzZXJ0O1xyXG52YXIgY2FjaGVkUHJvcGVydHkgPSB1dGlscy5jYWNoZWRQcm9wZXJ0eTtcclxudmFyIHBhcnNlQnl0ZXMgPSB1dGlscy5wYXJzZUJ5dGVzO1xyXG5cclxuLyoqXHJcbiogQHBhcmFtIHtFRERTQX0gZWRkc2EgLSBlZGRzYSBpbnN0YW5jZVxyXG4qIEBwYXJhbSB7QXJyYXk8Qnl0ZXM+fE9iamVjdH0gc2lnIC1cclxuKiBAcGFyYW0ge0FycmF5PEJ5dGVzPnxQb2ludH0gW3NpZy5SXSAtIFIgcG9pbnQgYXMgUG9pbnQgb3IgYnl0ZXNcclxuKiBAcGFyYW0ge0FycmF5PEJ5dGVzPnxibn0gW3NpZy5TXSAtIFMgc2NhbGFyIGFzIGJuIG9yIGJ5dGVzXHJcbiogQHBhcmFtIHtBcnJheTxCeXRlcz59IFtzaWcuUmVuY29kZWRdIC0gUiBwb2ludCBlbmNvZGVkXHJcbiogQHBhcmFtIHtBcnJheTxCeXRlcz59IFtzaWcuU2VuY29kZWRdIC0gUyBzY2FsYXIgZW5jb2RlZFxyXG4qL1xyXG5mdW5jdGlvbiBTaWduYXR1cmUoZWRkc2EsIHNpZykge1xyXG4gIHRoaXMuZWRkc2EgPSBlZGRzYTtcclxuXHJcbiAgaWYgKHR5cGVvZiBzaWcgIT09ICdvYmplY3QnKVxyXG4gICAgc2lnID0gcGFyc2VCeXRlcyhzaWcpO1xyXG5cclxuICBpZiAoQXJyYXkuaXNBcnJheShzaWcpKSB7XHJcbiAgICBzaWcgPSB7XHJcbiAgICAgIFI6IHNpZy5zbGljZSgwLCBlZGRzYS5lbmNvZGluZ0xlbmd0aCksXHJcbiAgICAgIFM6IHNpZy5zbGljZShlZGRzYS5lbmNvZGluZ0xlbmd0aClcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICBhc3NlcnQoc2lnLlIgJiYgc2lnLlMsICdTaWduYXR1cmUgd2l0aG91dCBSIG9yIFMnKTtcclxuXHJcbiAgaWYgKGVkZHNhLmlzUG9pbnQoc2lnLlIpKVxyXG4gICAgdGhpcy5fUiA9IHNpZy5SO1xyXG4gIGlmIChzaWcuUyBpbnN0YW5jZW9mIEJOKVxyXG4gICAgdGhpcy5fUyA9IHNpZy5TO1xyXG5cclxuICB0aGlzLl9SZW5jb2RlZCA9IEFycmF5LmlzQXJyYXkoc2lnLlIpID8gc2lnLlIgOiBzaWcuUmVuY29kZWQ7XHJcbiAgdGhpcy5fU2VuY29kZWQgPSBBcnJheS5pc0FycmF5KHNpZy5TKSA/IHNpZy5TIDogc2lnLlNlbmNvZGVkO1xyXG59XHJcblxyXG5jYWNoZWRQcm9wZXJ0eShTaWduYXR1cmUsICdTJywgZnVuY3Rpb24gUygpIHtcclxuICByZXR1cm4gdGhpcy5lZGRzYS5kZWNvZGVJbnQodGhpcy5TZW5jb2RlZCgpKTtcclxufSk7XHJcblxyXG5jYWNoZWRQcm9wZXJ0eShTaWduYXR1cmUsICdSJywgZnVuY3Rpb24gUigpIHtcclxuICByZXR1cm4gdGhpcy5lZGRzYS5kZWNvZGVQb2ludCh0aGlzLlJlbmNvZGVkKCkpO1xyXG59KTtcclxuXHJcbmNhY2hlZFByb3BlcnR5KFNpZ25hdHVyZSwgJ1JlbmNvZGVkJywgZnVuY3Rpb24gUmVuY29kZWQoKSB7XHJcbiAgcmV0dXJuIHRoaXMuZWRkc2EuZW5jb2RlUG9pbnQodGhpcy5SKCkpO1xyXG59KTtcclxuXHJcbmNhY2hlZFByb3BlcnR5KFNpZ25hdHVyZSwgJ1NlbmNvZGVkJywgZnVuY3Rpb24gU2VuY29kZWQoKSB7XHJcbiAgcmV0dXJuIHRoaXMuZWRkc2EuZW5jb2RlSW50KHRoaXMuUygpKTtcclxufSk7XHJcblxyXG5TaWduYXR1cmUucHJvdG90eXBlLnRvQnl0ZXMgPSBmdW5jdGlvbiB0b0J5dGVzKCkge1xyXG4gIHJldHVybiB0aGlzLlJlbmNvZGVkKCkuY29uY2F0KHRoaXMuU2VuY29kZWQoKSk7XHJcbn07XHJcblxyXG5TaWduYXR1cmUucHJvdG90eXBlLnRvSGV4ID0gZnVuY3Rpb24gdG9IZXgoKSB7XHJcbiAgcmV0dXJuIHV0aWxzLmVuY29kZSh0aGlzLnRvQnl0ZXMoKSwgJ2hleCcpLnRvVXBwZXJDYXNlKCk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNpZ25hdHVyZTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIGN1cnZlID0gcmVxdWlyZSgnLi4vY3VydmUnKTtcclxudmFyIEJOID0gcmVxdWlyZSgnYm4uanMnKTtcclxudmFyIGluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKTtcclxudmFyIEJhc2UgPSBjdXJ2ZS5iYXNlO1xyXG5cclxudmFyIGVsbGlwdGljID0gcmVxdWlyZSgnLi4vLi4vZWxsaXB0aWMnKTtcclxudmFyIHV0aWxzID0gZWxsaXB0aWMudXRpbHM7XHJcblxyXG5mdW5jdGlvbiBNb250Q3VydmUoY29uZikge1xyXG4gIEJhc2UuY2FsbCh0aGlzLCAnbW9udCcsIGNvbmYpO1xyXG5cclxuICB0aGlzLmEgPSBuZXcgQk4oY29uZi5hLCAxNikudG9SZWQodGhpcy5yZWQpO1xyXG4gIHRoaXMuYiA9IG5ldyBCTihjb25mLmIsIDE2KS50b1JlZCh0aGlzLnJlZCk7XHJcbiAgdGhpcy5pNCA9IG5ldyBCTig0KS50b1JlZCh0aGlzLnJlZCkucmVkSW52bSgpO1xyXG4gIHRoaXMudHdvID0gbmV3IEJOKDIpLnRvUmVkKHRoaXMucmVkKTtcclxuICB0aGlzLmEyNCA9IHRoaXMuaTQucmVkTXVsKHRoaXMuYS5yZWRBZGQodGhpcy50d28pKTtcclxufVxyXG5pbmhlcml0cyhNb250Q3VydmUsIEJhc2UpO1xyXG5tb2R1bGUuZXhwb3J0cyA9IE1vbnRDdXJ2ZTtcclxuXHJcbk1vbnRDdXJ2ZS5wcm90b3R5cGUudmFsaWRhdGUgPSBmdW5jdGlvbiB2YWxpZGF0ZShwb2ludCkge1xyXG4gIHZhciB4ID0gcG9pbnQubm9ybWFsaXplKCkueDtcclxuICB2YXIgeDIgPSB4LnJlZFNxcigpO1xyXG4gIHZhciByaHMgPSB4Mi5yZWRNdWwoeCkucmVkQWRkKHgyLnJlZE11bCh0aGlzLmEpKS5yZWRBZGQoeCk7XHJcbiAgdmFyIHkgPSByaHMucmVkU3FydCgpO1xyXG5cclxuICByZXR1cm4geS5yZWRTcXIoKS5jbXAocmhzKSA9PT0gMDtcclxufTtcclxuXHJcbmZ1bmN0aW9uIFBvaW50KGN1cnZlLCB4LCB6KSB7XHJcbiAgQmFzZS5CYXNlUG9pbnQuY2FsbCh0aGlzLCBjdXJ2ZSwgJ3Byb2plY3RpdmUnKTtcclxuICBpZiAoeCA9PT0gbnVsbCAmJiB6ID09PSBudWxsKSB7XHJcbiAgICB0aGlzLnggPSB0aGlzLmN1cnZlLm9uZTtcclxuICAgIHRoaXMueiA9IHRoaXMuY3VydmUuemVybztcclxuICB9IGVsc2Uge1xyXG4gICAgdGhpcy54ID0gbmV3IEJOKHgsIDE2KTtcclxuICAgIHRoaXMueiA9IG5ldyBCTih6LCAxNik7XHJcbiAgICBpZiAoIXRoaXMueC5yZWQpXHJcbiAgICAgIHRoaXMueCA9IHRoaXMueC50b1JlZCh0aGlzLmN1cnZlLnJlZCk7XHJcbiAgICBpZiAoIXRoaXMuei5yZWQpXHJcbiAgICAgIHRoaXMueiA9IHRoaXMuei50b1JlZCh0aGlzLmN1cnZlLnJlZCk7XHJcbiAgfVxyXG59XHJcbmluaGVyaXRzKFBvaW50LCBCYXNlLkJhc2VQb2ludCk7XHJcblxyXG5Nb250Q3VydmUucHJvdG90eXBlLmRlY29kZVBvaW50ID0gZnVuY3Rpb24gZGVjb2RlUG9pbnQoYnl0ZXMsIGVuYykge1xyXG4gIHJldHVybiB0aGlzLnBvaW50KHV0aWxzLnRvQXJyYXkoYnl0ZXMsIGVuYyksIDEpO1xyXG59O1xyXG5cclxuTW9udEN1cnZlLnByb3RvdHlwZS5wb2ludCA9IGZ1bmN0aW9uIHBvaW50KHgsIHopIHtcclxuICByZXR1cm4gbmV3IFBvaW50KHRoaXMsIHgsIHopO1xyXG59O1xyXG5cclxuTW9udEN1cnZlLnByb3RvdHlwZS5wb2ludEZyb21KU09OID0gZnVuY3Rpb24gcG9pbnRGcm9tSlNPTihvYmopIHtcclxuICByZXR1cm4gUG9pbnQuZnJvbUpTT04odGhpcywgb2JqKTtcclxufTtcclxuXHJcblBvaW50LnByb3RvdHlwZS5wcmVjb21wdXRlID0gZnVuY3Rpb24gcHJlY29tcHV0ZSgpIHtcclxuICAvLyBOby1vcFxyXG59O1xyXG5cclxuUG9pbnQucHJvdG90eXBlLl9lbmNvZGUgPSBmdW5jdGlvbiBfZW5jb2RlKCkge1xyXG4gIHJldHVybiB0aGlzLmdldFgoKS50b0FycmF5KCdiZScsIHRoaXMuY3VydmUucC5ieXRlTGVuZ3RoKCkpO1xyXG59O1xyXG5cclxuUG9pbnQuZnJvbUpTT04gPSBmdW5jdGlvbiBmcm9tSlNPTihjdXJ2ZSwgb2JqKSB7XHJcbiAgcmV0dXJuIG5ldyBQb2ludChjdXJ2ZSwgb2JqWzBdLCBvYmpbMV0gfHwgY3VydmUub25lKTtcclxufTtcclxuXHJcblBvaW50LnByb3RvdHlwZS5pbnNwZWN0ID0gZnVuY3Rpb24gaW5zcGVjdCgpIHtcclxuICBpZiAodGhpcy5pc0luZmluaXR5KCkpXHJcbiAgICByZXR1cm4gJzxFQyBQb2ludCBJbmZpbml0eT4nO1xyXG4gIHJldHVybiAnPEVDIFBvaW50IHg6ICcgKyB0aGlzLnguZnJvbVJlZCgpLnRvU3RyaW5nKDE2LCAyKSArXHJcbiAgICAgICcgejogJyArIHRoaXMuei5mcm9tUmVkKCkudG9TdHJpbmcoMTYsIDIpICsgJz4nO1xyXG59O1xyXG5cclxuUG9pbnQucHJvdG90eXBlLmlzSW5maW5pdHkgPSBmdW5jdGlvbiBpc0luZmluaXR5KCkge1xyXG4gIC8vIFhYWCBUaGlzIGNvZGUgYXNzdW1lcyB0aGF0IHplcm8gaXMgYWx3YXlzIHplcm8gaW4gcmVkXHJcbiAgcmV0dXJuIHRoaXMuei5jbXBuKDApID09PSAwO1xyXG59O1xyXG5cclxuUG9pbnQucHJvdG90eXBlLmRibCA9IGZ1bmN0aW9uIGRibCgpIHtcclxuICAvLyBodHRwOi8vaHlwZXJlbGxpcHRpYy5vcmcvRUZEL2cxcC9hdXRvLW1vbnRnb20teHouaHRtbCNkb3VibGluZy1kYmwtMTk4Ny1tLTNcclxuICAvLyAyTSArIDJTICsgNEFcclxuXHJcbiAgLy8gQSA9IFgxICsgWjFcclxuICB2YXIgYSA9IHRoaXMueC5yZWRBZGQodGhpcy56KTtcclxuICAvLyBBQSA9IEFeMlxyXG4gIHZhciBhYSA9IGEucmVkU3FyKCk7XHJcbiAgLy8gQiA9IFgxIC0gWjFcclxuICB2YXIgYiA9IHRoaXMueC5yZWRTdWIodGhpcy56KTtcclxuICAvLyBCQiA9IEJeMlxyXG4gIHZhciBiYiA9IGIucmVkU3FyKCk7XHJcbiAgLy8gQyA9IEFBIC0gQkJcclxuICB2YXIgYyA9IGFhLnJlZFN1YihiYik7XHJcbiAgLy8gWDMgPSBBQSAqIEJCXHJcbiAgdmFyIG54ID0gYWEucmVkTXVsKGJiKTtcclxuICAvLyBaMyA9IEMgKiAoQkIgKyBBMjQgKiBDKVxyXG4gIHZhciBueiA9IGMucmVkTXVsKGJiLnJlZEFkZCh0aGlzLmN1cnZlLmEyNC5yZWRNdWwoYykpKTtcclxuICByZXR1cm4gdGhpcy5jdXJ2ZS5wb2ludChueCwgbnopO1xyXG59O1xyXG5cclxuUG9pbnQucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uIGFkZCgpIHtcclxuICB0aHJvdyBuZXcgRXJyb3IoJ05vdCBzdXBwb3J0ZWQgb24gTW9udGdvbWVyeSBjdXJ2ZScpO1xyXG59O1xyXG5cclxuUG9pbnQucHJvdG90eXBlLmRpZmZBZGQgPSBmdW5jdGlvbiBkaWZmQWRkKHAsIGRpZmYpIHtcclxuICAvLyBodHRwOi8vaHlwZXJlbGxpcHRpYy5vcmcvRUZEL2cxcC9hdXRvLW1vbnRnb20teHouaHRtbCNkaWZmYWRkLWRhZGQtMTk4Ny1tLTNcclxuICAvLyA0TSArIDJTICsgNkFcclxuXHJcbiAgLy8gQSA9IFgyICsgWjJcclxuICB2YXIgYSA9IHRoaXMueC5yZWRBZGQodGhpcy56KTtcclxuICAvLyBCID0gWDIgLSBaMlxyXG4gIHZhciBiID0gdGhpcy54LnJlZFN1Yih0aGlzLnopO1xyXG4gIC8vIEMgPSBYMyArIFozXHJcbiAgdmFyIGMgPSBwLngucmVkQWRkKHAueik7XHJcbiAgLy8gRCA9IFgzIC0gWjNcclxuICB2YXIgZCA9IHAueC5yZWRTdWIocC56KTtcclxuICAvLyBEQSA9IEQgKiBBXHJcbiAgdmFyIGRhID0gZC5yZWRNdWwoYSk7XHJcbiAgLy8gQ0IgPSBDICogQlxyXG4gIHZhciBjYiA9IGMucmVkTXVsKGIpO1xyXG4gIC8vIFg1ID0gWjEgKiAoREEgKyBDQileMlxyXG4gIHZhciBueCA9IGRpZmYuei5yZWRNdWwoZGEucmVkQWRkKGNiKS5yZWRTcXIoKSk7XHJcbiAgLy8gWjUgPSBYMSAqIChEQSAtIENCKV4yXHJcbiAgdmFyIG56ID0gZGlmZi54LnJlZE11bChkYS5yZWRJU3ViKGNiKS5yZWRTcXIoKSk7XHJcbiAgcmV0dXJuIHRoaXMuY3VydmUucG9pbnQobngsIG56KTtcclxufTtcclxuXHJcblBvaW50LnByb3RvdHlwZS5tdWwgPSBmdW5jdGlvbiBtdWwoaykge1xyXG4gIHZhciB0ID0gay5jbG9uZSgpO1xyXG4gIHZhciBhID0gdGhpczsgLy8gKE4gLyAyKSAqIFEgKyBRXHJcbiAgdmFyIGIgPSB0aGlzLmN1cnZlLnBvaW50KG51bGwsIG51bGwpOyAvLyAoTiAvIDIpICogUVxyXG4gIHZhciBjID0gdGhpczsgLy8gUVxyXG5cclxuICBmb3IgKHZhciBiaXRzID0gW107IHQuY21wbigwKSAhPT0gMDsgdC5pdXNocm4oMSkpXHJcbiAgICBiaXRzLnB1c2godC5hbmRsbigxKSk7XHJcblxyXG4gIGZvciAodmFyIGkgPSBiaXRzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XHJcbiAgICBpZiAoYml0c1tpXSA9PT0gMCkge1xyXG4gICAgICAvLyBOICogUSArIFEgPSAoKE4gLyAyKSAqIFEgKyBRKSkgKyAoTiAvIDIpICogUVxyXG4gICAgICBhID0gYS5kaWZmQWRkKGIsIGMpO1xyXG4gICAgICAvLyBOICogUSA9IDIgKiAoKE4gLyAyKSAqIFEgKyBRKSlcclxuICAgICAgYiA9IGIuZGJsKCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAvLyBOICogUSA9ICgoTiAvIDIpICogUSArIFEpICsgKChOIC8gMikgKiBRKVxyXG4gICAgICBiID0gYS5kaWZmQWRkKGIsIGMpO1xyXG4gICAgICAvLyBOICogUSArIFEgPSAyICogKChOIC8gMikgKiBRICsgUSlcclxuICAgICAgYSA9IGEuZGJsKCk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiBiO1xyXG59O1xyXG5cclxuUG9pbnQucHJvdG90eXBlLm11bEFkZCA9IGZ1bmN0aW9uIG11bEFkZCgpIHtcclxuICB0aHJvdyBuZXcgRXJyb3IoJ05vdCBzdXBwb3J0ZWQgb24gTW9udGdvbWVyeSBjdXJ2ZScpO1xyXG59O1xyXG5cclxuUG9pbnQucHJvdG90eXBlLmp1bWxBZGQgPSBmdW5jdGlvbiBqdW1sQWRkKCkge1xyXG4gIHRocm93IG5ldyBFcnJvcignTm90IHN1cHBvcnRlZCBvbiBNb250Z29tZXJ5IGN1cnZlJyk7XHJcbn07XHJcblxyXG5Qb2ludC5wcm90b3R5cGUuZXEgPSBmdW5jdGlvbiBlcShvdGhlcikge1xyXG4gIHJldHVybiB0aGlzLmdldFgoKS5jbXAob3RoZXIuZ2V0WCgpKSA9PT0gMDtcclxufTtcclxuXHJcblBvaW50LnByb3RvdHlwZS5ub3JtYWxpemUgPSBmdW5jdGlvbiBub3JtYWxpemUoKSB7XHJcbiAgdGhpcy54ID0gdGhpcy54LnJlZE11bCh0aGlzLnoucmVkSW52bSgpKTtcclxuICB0aGlzLnogPSB0aGlzLmN1cnZlLm9uZTtcclxuICByZXR1cm4gdGhpcztcclxufTtcclxuXHJcblBvaW50LnByb3RvdHlwZS5nZXRYID0gZnVuY3Rpb24gZ2V0WCgpIHtcclxuICAvLyBOb3JtYWxpemUgY29vcmRpbmF0ZXNcclxuICB0aGlzLm5vcm1hbGl6ZSgpO1xyXG5cclxuICByZXR1cm4gdGhpcy54LmZyb21SZWQoKTtcclxufTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIGhhc2ggPSByZXF1aXJlKCdoYXNoLmpzJyk7XHJcbnZhciBlbGxpcHRpYyA9IHJlcXVpcmUoJy4uLy4uL2VsbGlwdGljJyk7XHJcbnZhciB1dGlscyA9IGVsbGlwdGljLnV0aWxzO1xyXG52YXIgYXNzZXJ0ID0gdXRpbHMuYXNzZXJ0O1xyXG52YXIgcGFyc2VCeXRlcyA9IHV0aWxzLnBhcnNlQnl0ZXM7XHJcbnZhciBLZXlQYWlyID0gcmVxdWlyZSgnLi9rZXknKTtcclxudmFyIFNpZ25hdHVyZSA9IHJlcXVpcmUoJy4vc2lnbmF0dXJlJyk7XHJcblxyXG5mdW5jdGlvbiBFRERTQShjdXJ2ZSkge1xyXG4gIGFzc2VydChjdXJ2ZSA9PT0gJ2VkMjU1MTknLCAnb25seSB0ZXN0ZWQgd2l0aCBlZDI1NTE5IHNvIGZhcicpO1xyXG5cclxuICBpZiAoISh0aGlzIGluc3RhbmNlb2YgRUREU0EpKVxyXG4gICAgcmV0dXJuIG5ldyBFRERTQShjdXJ2ZSk7XHJcblxyXG4gIHZhciBjdXJ2ZSA9IGVsbGlwdGljLmN1cnZlc1tjdXJ2ZV0uY3VydmU7XHJcbiAgdGhpcy5jdXJ2ZSA9IGN1cnZlO1xyXG4gIHRoaXMuZyA9IGN1cnZlLmc7XHJcbiAgdGhpcy5nLnByZWNvbXB1dGUoY3VydmUubi5iaXRMZW5ndGgoKSArIDEpO1xyXG5cclxuICB0aGlzLnBvaW50Q2xhc3MgPSBjdXJ2ZS5wb2ludCgpLmNvbnN0cnVjdG9yO1xyXG4gIHRoaXMuZW5jb2RpbmdMZW5ndGggPSBNYXRoLmNlaWwoY3VydmUubi5iaXRMZW5ndGgoKSAvIDgpO1xyXG4gIHRoaXMuaGFzaCA9IGhhc2guc2hhNTEyO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEVERFNBO1xyXG5cclxuLyoqXHJcbiogQHBhcmFtIHtBcnJheXxTdHJpbmd9IG1lc3NhZ2UgLSBtZXNzYWdlIGJ5dGVzXHJcbiogQHBhcmFtIHtBcnJheXxTdHJpbmd8S2V5UGFpcn0gc2VjcmV0IC0gc2VjcmV0IGJ5dGVzIG9yIGEga2V5cGFpclxyXG4qIEByZXR1cm5zIHtTaWduYXR1cmV9IC0gc2lnbmF0dXJlXHJcbiovXHJcbkVERFNBLnByb3RvdHlwZS5zaWduID0gZnVuY3Rpb24gc2lnbihtZXNzYWdlLCBzZWNyZXQpIHtcclxuICBtZXNzYWdlID0gcGFyc2VCeXRlcyhtZXNzYWdlKTtcclxuICB2YXIga2V5ID0gdGhpcy5rZXlGcm9tU2VjcmV0KHNlY3JldCk7XHJcbiAgdmFyIHIgPSB0aGlzLmhhc2hJbnQoa2V5Lm1lc3NhZ2VQcmVmaXgoKSwgbWVzc2FnZSk7XHJcbiAgdmFyIFIgPSB0aGlzLmcubXVsKHIpO1xyXG4gIHZhciBSZW5jb2RlZCA9IHRoaXMuZW5jb2RlUG9pbnQoUik7XHJcbiAgdmFyIHNfID0gdGhpcy5oYXNoSW50KFJlbmNvZGVkLCBrZXkucHViQnl0ZXMoKSwgbWVzc2FnZSlcclxuICAgICAgICAgICAgICAgLm11bChrZXkucHJpdigpKTtcclxuICB2YXIgUyA9IHIuYWRkKHNfKS51bW9kKHRoaXMuY3VydmUubik7XHJcbiAgcmV0dXJuIHRoaXMubWFrZVNpZ25hdHVyZSh7IFI6IFIsIFM6IFMsIFJlbmNvZGVkOiBSZW5jb2RlZCB9KTtcclxufTtcclxuXHJcbi8qKlxyXG4qIEBwYXJhbSB7QXJyYXl9IG1lc3NhZ2UgLSBtZXNzYWdlIGJ5dGVzXHJcbiogQHBhcmFtIHtBcnJheXxTdHJpbmd8U2lnbmF0dXJlfSBzaWcgLSBzaWcgYnl0ZXNcclxuKiBAcGFyYW0ge0FycmF5fFN0cmluZ3xQb2ludHxLZXlQYWlyfSBwdWIgLSBwdWJsaWMga2V5XHJcbiogQHJldHVybnMge0Jvb2xlYW59IC0gdHJ1ZSBpZiBwdWJsaWMga2V5IG1hdGNoZXMgc2lnIG9mIG1lc3NhZ2VcclxuKi9cclxuRUREU0EucHJvdG90eXBlLnZlcmlmeSA9IGZ1bmN0aW9uIHZlcmlmeShtZXNzYWdlLCBzaWcsIHB1Yikge1xyXG4gIG1lc3NhZ2UgPSBwYXJzZUJ5dGVzKG1lc3NhZ2UpO1xyXG4gIHNpZyA9IHRoaXMubWFrZVNpZ25hdHVyZShzaWcpO1xyXG4gIHZhciBrZXkgPSB0aGlzLmtleUZyb21QdWJsaWMocHViKTtcclxuICB2YXIgaCA9IHRoaXMuaGFzaEludChzaWcuUmVuY29kZWQoKSwga2V5LnB1YkJ5dGVzKCksIG1lc3NhZ2UpO1xyXG4gIHZhciBTRyA9IHRoaXMuZy5tdWwoc2lnLlMoKSk7XHJcbiAgdmFyIFJwbHVzQWggPSBzaWcuUigpLmFkZChrZXkucHViKCkubXVsKGgpKTtcclxuICByZXR1cm4gUnBsdXNBaC5lcShTRyk7XHJcbn07XHJcblxyXG5FRERTQS5wcm90b3R5cGUuaGFzaEludCA9IGZ1bmN0aW9uIGhhc2hJbnQoKSB7XHJcbiAgdmFyIGhhc2ggPSB0aGlzLmhhc2goKTtcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKylcclxuICAgIGhhc2gudXBkYXRlKGFyZ3VtZW50c1tpXSk7XHJcbiAgcmV0dXJuIHV0aWxzLmludEZyb21MRShoYXNoLmRpZ2VzdCgpKS51bW9kKHRoaXMuY3VydmUubik7XHJcbn07XHJcblxyXG5FRERTQS5wcm90b3R5cGUua2V5RnJvbVB1YmxpYyA9IGZ1bmN0aW9uIGtleUZyb21QdWJsaWMocHViKSB7XHJcbiAgcmV0dXJuIEtleVBhaXIuZnJvbVB1YmxpYyh0aGlzLCBwdWIpO1xyXG59O1xyXG5cclxuRUREU0EucHJvdG90eXBlLmtleUZyb21TZWNyZXQgPSBmdW5jdGlvbiBrZXlGcm9tU2VjcmV0KHNlY3JldCkge1xyXG4gIHJldHVybiBLZXlQYWlyLmZyb21TZWNyZXQodGhpcywgc2VjcmV0KTtcclxufTtcclxuXHJcbkVERFNBLnByb3RvdHlwZS5tYWtlU2lnbmF0dXJlID0gZnVuY3Rpb24gbWFrZVNpZ25hdHVyZShzaWcpIHtcclxuICBpZiAoc2lnIGluc3RhbmNlb2YgU2lnbmF0dXJlKVxyXG4gICAgcmV0dXJuIHNpZztcclxuICByZXR1cm4gbmV3IFNpZ25hdHVyZSh0aGlzLCBzaWcpO1xyXG59O1xyXG5cclxuLyoqXHJcbiogKiBodHRwczovL3Rvb2xzLmlldGYub3JnL2h0bWwvZHJhZnQtam9zZWZzc29uLWVkZHNhLWVkMjU1MTktMDMjc2VjdGlvbi01LjJcclxuKlxyXG4qIEVERFNBIGRlZmluZXMgbWV0aG9kcyBmb3IgZW5jb2RpbmcgYW5kIGRlY29kaW5nIHBvaW50cyBhbmQgaW50ZWdlcnMuIFRoZXNlIGFyZVxyXG4qIGhlbHBlciBjb252ZW5pZW5jZSBtZXRob2RzLCB0aGF0IHBhc3MgYWxvbmcgdG8gdXRpbGl0eSBmdW5jdGlvbnMgaW1wbGllZFxyXG4qIHBhcmFtZXRlcnMuXHJcbipcclxuKi9cclxuRUREU0EucHJvdG90eXBlLmVuY29kZVBvaW50ID0gZnVuY3Rpb24gZW5jb2RlUG9pbnQocG9pbnQpIHtcclxuICB2YXIgZW5jID0gcG9pbnQuZ2V0WSgpLnRvQXJyYXkoJ2xlJywgdGhpcy5lbmNvZGluZ0xlbmd0aCk7XHJcbiAgZW5jW3RoaXMuZW5jb2RpbmdMZW5ndGggLSAxXSB8PSBwb2ludC5nZXRYKCkuaXNPZGQoKSA/IDB4ODAgOiAwO1xyXG4gIHJldHVybiBlbmM7XHJcbn07XHJcblxyXG5FRERTQS5wcm90b3R5cGUuZGVjb2RlUG9pbnQgPSBmdW5jdGlvbiBkZWNvZGVQb2ludChieXRlcykge1xyXG4gIGJ5dGVzID0gdXRpbHMucGFyc2VCeXRlcyhieXRlcyk7XHJcblxyXG4gIHZhciBsYXN0SXggPSBieXRlcy5sZW5ndGggLSAxO1xyXG4gIHZhciBub3JtZWQgPSBieXRlcy5zbGljZSgwLCBsYXN0SXgpLmNvbmNhdChieXRlc1tsYXN0SXhdICYgfjB4ODApO1xyXG4gIHZhciB4SXNPZGQgPSAoYnl0ZXNbbGFzdEl4XSAmIDB4ODApICE9PSAwO1xyXG5cclxuICB2YXIgeSA9IHV0aWxzLmludEZyb21MRShub3JtZWQpO1xyXG4gIHJldHVybiB0aGlzLmN1cnZlLnBvaW50RnJvbVkoeSwgeElzT2RkKTtcclxufTtcclxuXHJcbkVERFNBLnByb3RvdHlwZS5lbmNvZGVJbnQgPSBmdW5jdGlvbiBlbmNvZGVJbnQobnVtKSB7XHJcbiAgcmV0dXJuIG51bS50b0FycmF5KCdsZScsIHRoaXMuZW5jb2RpbmdMZW5ndGgpO1xyXG59O1xyXG5cclxuRUREU0EucHJvdG90eXBlLmRlY29kZUludCA9IGZ1bmN0aW9uIGRlY29kZUludChieXRlcykge1xyXG4gIHJldHVybiB1dGlscy5pbnRGcm9tTEUoYnl0ZXMpO1xyXG59O1xyXG5cclxuRUREU0EucHJvdG90eXBlLmlzUG9pbnQgPSBmdW5jdGlvbiBpc1BvaW50KHZhbCkge1xyXG4gIHJldHVybiB2YWwgaW5zdGFuY2VvZiB0aGlzLnBvaW50Q2xhc3M7XHJcbn07XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBCTiA9IHJlcXVpcmUoJ2JuLmpzJyk7XHJcblxyXG52YXIgZWxsaXB0aWMgPSByZXF1aXJlKCcuLi8uLi9lbGxpcHRpYycpO1xyXG52YXIgdXRpbHMgPSBlbGxpcHRpYy51dGlscztcclxudmFyIGFzc2VydCA9IHV0aWxzLmFzc2VydDtcclxuXHJcbmZ1bmN0aW9uIFNpZ25hdHVyZShvcHRpb25zLCBlbmMpIHtcclxuICBpZiAob3B0aW9ucyBpbnN0YW5jZW9mIFNpZ25hdHVyZSlcclxuICAgIHJldHVybiBvcHRpb25zO1xyXG5cclxuICBpZiAodGhpcy5faW1wb3J0REVSKG9wdGlvbnMsIGVuYykpXHJcbiAgICByZXR1cm47XHJcblxyXG4gIGFzc2VydChvcHRpb25zLnIgJiYgb3B0aW9ucy5zLCAnU2lnbmF0dXJlIHdpdGhvdXQgciBvciBzJyk7XHJcbiAgdGhpcy5yID0gbmV3IEJOKG9wdGlvbnMuciwgMTYpO1xyXG4gIHRoaXMucyA9IG5ldyBCTihvcHRpb25zLnMsIDE2KTtcclxuICBpZiAob3B0aW9ucy5yZWNvdmVyeVBhcmFtID09PSB1bmRlZmluZWQpXHJcbiAgICB0aGlzLnJlY292ZXJ5UGFyYW0gPSBudWxsO1xyXG4gIGVsc2VcclxuICAgIHRoaXMucmVjb3ZlcnlQYXJhbSA9IG9wdGlvbnMucmVjb3ZlcnlQYXJhbTtcclxufVxyXG5tb2R1bGUuZXhwb3J0cyA9IFNpZ25hdHVyZTtcclxuXHJcbmZ1bmN0aW9uIFBvc2l0aW9uKCkge1xyXG4gIHRoaXMucGxhY2UgPSAwO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRMZW5ndGgoYnVmLCBwKSB7XHJcbiAgdmFyIGluaXRpYWwgPSBidWZbcC5wbGFjZSsrXTtcclxuICBpZiAoIShpbml0aWFsICYgMHg4MCkpIHtcclxuICAgIHJldHVybiBpbml0aWFsO1xyXG4gIH1cclxuICB2YXIgb2N0ZXRMZW4gPSBpbml0aWFsICYgMHhmO1xyXG4gIHZhciB2YWwgPSAwO1xyXG4gIGZvciAodmFyIGkgPSAwLCBvZmYgPSBwLnBsYWNlOyBpIDwgb2N0ZXRMZW47IGkrKywgb2ZmKyspIHtcclxuICAgIHZhbCA8PD0gODtcclxuICAgIHZhbCB8PSBidWZbb2ZmXTtcclxuICB9XHJcbiAgcC5wbGFjZSA9IG9mZjtcclxuICByZXR1cm4gdmFsO1xyXG59XHJcblxyXG5mdW5jdGlvbiBybVBhZGRpbmcoYnVmKSB7XHJcbiAgdmFyIGkgPSAwO1xyXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoIC0gMTtcclxuICB3aGlsZSAoIWJ1ZltpXSAmJiAhKGJ1ZltpICsgMV0gJiAweDgwKSAmJiBpIDwgbGVuKSB7XHJcbiAgICBpKys7XHJcbiAgfVxyXG4gIGlmIChpID09PSAwKSB7XHJcbiAgICByZXR1cm4gYnVmO1xyXG4gIH1cclxuICByZXR1cm4gYnVmLnNsaWNlKGkpO1xyXG59XHJcblxyXG5TaWduYXR1cmUucHJvdG90eXBlLl9pbXBvcnRERVIgPSBmdW5jdGlvbiBfaW1wb3J0REVSKGRhdGEsIGVuYykge1xyXG4gIGRhdGEgPSB1dGlscy50b0FycmF5KGRhdGEsIGVuYyk7XHJcbiAgdmFyIHAgPSBuZXcgUG9zaXRpb24oKTtcclxuICBpZiAoZGF0YVtwLnBsYWNlKytdICE9PSAweDMwKSB7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG4gIHZhciBsZW4gPSBnZXRMZW5ndGgoZGF0YSwgcCk7XHJcbiAgaWYgKChsZW4gKyBwLnBsYWNlKSAhPT0gZGF0YS5sZW5ndGgpIHtcclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcbiAgaWYgKGRhdGFbcC5wbGFjZSsrXSAhPT0gMHgwMikge1xyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuICB2YXIgcmxlbiA9IGdldExlbmd0aChkYXRhLCBwKTtcclxuICB2YXIgciA9IGRhdGEuc2xpY2UocC5wbGFjZSwgcmxlbiArIHAucGxhY2UpO1xyXG4gIHAucGxhY2UgKz0gcmxlbjtcclxuICBpZiAoZGF0YVtwLnBsYWNlKytdICE9PSAweDAyKSB7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG4gIHZhciBzbGVuID0gZ2V0TGVuZ3RoKGRhdGEsIHApO1xyXG4gIGlmIChkYXRhLmxlbmd0aCAhPT0gc2xlbiArIHAucGxhY2UpIHtcclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcbiAgdmFyIHMgPSBkYXRhLnNsaWNlKHAucGxhY2UsIHNsZW4gKyBwLnBsYWNlKTtcclxuICBpZiAoclswXSA9PT0gMCAmJiAoclsxXSAmIDB4ODApKSB7XHJcbiAgICByID0gci5zbGljZSgxKTtcclxuICB9XHJcbiAgaWYgKHNbMF0gPT09IDAgJiYgKHNbMV0gJiAweDgwKSkge1xyXG4gICAgcyA9IHMuc2xpY2UoMSk7XHJcbiAgfVxyXG5cclxuICB0aGlzLnIgPSBuZXcgQk4ocik7XHJcbiAgdGhpcy5zID0gbmV3IEJOKHMpO1xyXG4gIHRoaXMucmVjb3ZlcnlQYXJhbSA9IG51bGw7XHJcblxyXG4gIHJldHVybiB0cnVlO1xyXG59O1xyXG5cclxuZnVuY3Rpb24gY29uc3RydWN0TGVuZ3RoKGFyciwgbGVuKSB7XHJcbiAgaWYgKGxlbiA8IDB4ODApIHtcclxuICAgIGFyci5wdXNoKGxlbik7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG4gIHZhciBvY3RldHMgPSAxICsgKE1hdGgubG9nKGxlbikgLyBNYXRoLkxOMiA+Pj4gMyk7XHJcbiAgYXJyLnB1c2gob2N0ZXRzIHwgMHg4MCk7XHJcbiAgd2hpbGUgKC0tb2N0ZXRzKSB7XHJcbiAgICBhcnIucHVzaCgobGVuID4+PiAob2N0ZXRzIDw8IDMpKSAmIDB4ZmYpO1xyXG4gIH1cclxuICBhcnIucHVzaChsZW4pO1xyXG59XHJcblxyXG5TaWduYXR1cmUucHJvdG90eXBlLnRvREVSID0gZnVuY3Rpb24gdG9ERVIoZW5jKSB7XHJcbiAgdmFyIHIgPSB0aGlzLnIudG9BcnJheSgpO1xyXG4gIHZhciBzID0gdGhpcy5zLnRvQXJyYXkoKTtcclxuXHJcbiAgLy8gUGFkIHZhbHVlc1xyXG4gIGlmIChyWzBdICYgMHg4MClcclxuICAgIHIgPSBbIDAgXS5jb25jYXQocik7XHJcbiAgLy8gUGFkIHZhbHVlc1xyXG4gIGlmIChzWzBdICYgMHg4MClcclxuICAgIHMgPSBbIDAgXS5jb25jYXQocyk7XHJcblxyXG4gIHIgPSBybVBhZGRpbmcocik7XHJcbiAgcyA9IHJtUGFkZGluZyhzKTtcclxuXHJcbiAgd2hpbGUgKCFzWzBdICYmICEoc1sxXSAmIDB4ODApKSB7XHJcbiAgICBzID0gcy5zbGljZSgxKTtcclxuICB9XHJcbiAgdmFyIGFyciA9IFsgMHgwMiBdO1xyXG4gIGNvbnN0cnVjdExlbmd0aChhcnIsIHIubGVuZ3RoKTtcclxuICBhcnIgPSBhcnIuY29uY2F0KHIpO1xyXG4gIGFyci5wdXNoKDB4MDIpO1xyXG4gIGNvbnN0cnVjdExlbmd0aChhcnIsIHMubGVuZ3RoKTtcclxuICB2YXIgYmFja0hhbGYgPSBhcnIuY29uY2F0KHMpO1xyXG4gIHZhciByZXMgPSBbIDB4MzAgXTtcclxuICBjb25zdHJ1Y3RMZW5ndGgocmVzLCBiYWNrSGFsZi5sZW5ndGgpO1xyXG4gIHJlcyA9IHJlcy5jb25jYXQoYmFja0hhbGYpO1xyXG4gIHJldHVybiB1dGlscy5lbmNvZGUocmVzLCBlbmMpO1xyXG59O1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgQk4gPSByZXF1aXJlKCdibi5qcycpO1xyXG52YXIgSG1hY0RSQkcgPSByZXF1aXJlKCdobWFjLWRyYmcnKTtcclxudmFyIGVsbGlwdGljID0gcmVxdWlyZSgnLi4vLi4vZWxsaXB0aWMnKTtcclxudmFyIHV0aWxzID0gZWxsaXB0aWMudXRpbHM7XHJcbnZhciBhc3NlcnQgPSB1dGlscy5hc3NlcnQ7XHJcblxyXG52YXIgS2V5UGFpciA9IHJlcXVpcmUoJy4va2V5Jyk7XHJcbnZhciBTaWduYXR1cmUgPSByZXF1aXJlKCcuL3NpZ25hdHVyZScpO1xyXG5cclxuZnVuY3Rpb24gRUMob3B0aW9ucykge1xyXG4gIGlmICghKHRoaXMgaW5zdGFuY2VvZiBFQykpXHJcbiAgICByZXR1cm4gbmV3IEVDKG9wdGlvbnMpO1xyXG5cclxuICAvLyBTaG9ydGN1dCBgZWxsaXB0aWMuZWMoY3VydmUtbmFtZSlgXHJcbiAgaWYgKHR5cGVvZiBvcHRpb25zID09PSAnc3RyaW5nJykge1xyXG4gICAgYXNzZXJ0KGVsbGlwdGljLmN1cnZlcy5oYXNPd25Qcm9wZXJ0eShvcHRpb25zKSwgJ1Vua25vd24gY3VydmUgJyArIG9wdGlvbnMpO1xyXG5cclxuICAgIG9wdGlvbnMgPSBlbGxpcHRpYy5jdXJ2ZXNbb3B0aW9uc107XHJcbiAgfVxyXG5cclxuICAvLyBTaG9ydGN1dCBmb3IgYGVsbGlwdGljLmVjKGVsbGlwdGljLmN1cnZlcy5jdXJ2ZU5hbWUpYFxyXG4gIGlmIChvcHRpb25zIGluc3RhbmNlb2YgZWxsaXB0aWMuY3VydmVzLlByZXNldEN1cnZlKVxyXG4gICAgb3B0aW9ucyA9IHsgY3VydmU6IG9wdGlvbnMgfTtcclxuXHJcbiAgdGhpcy5jdXJ2ZSA9IG9wdGlvbnMuY3VydmUuY3VydmU7XHJcbiAgdGhpcy5uID0gdGhpcy5jdXJ2ZS5uO1xyXG4gIHRoaXMubmggPSB0aGlzLm4udXNocm4oMSk7XHJcbiAgdGhpcy5nID0gdGhpcy5jdXJ2ZS5nO1xyXG5cclxuICAvLyBQb2ludCBvbiBjdXJ2ZVxyXG4gIHRoaXMuZyA9IG9wdGlvbnMuY3VydmUuZztcclxuICB0aGlzLmcucHJlY29tcHV0ZShvcHRpb25zLmN1cnZlLm4uYml0TGVuZ3RoKCkgKyAxKTtcclxuXHJcbiAgLy8gSGFzaCBmb3IgZnVuY3Rpb24gZm9yIERSQkdcclxuICB0aGlzLmhhc2ggPSBvcHRpb25zLmhhc2ggfHwgb3B0aW9ucy5jdXJ2ZS5oYXNoO1xyXG59XHJcbm1vZHVsZS5leHBvcnRzID0gRUM7XHJcblxyXG5FQy5wcm90b3R5cGUua2V5UGFpciA9IGZ1bmN0aW9uIGtleVBhaXIob3B0aW9ucykge1xyXG4gIHJldHVybiBuZXcgS2V5UGFpcih0aGlzLCBvcHRpb25zKTtcclxufTtcclxuXHJcbkVDLnByb3RvdHlwZS5rZXlGcm9tUHJpdmF0ZSA9IGZ1bmN0aW9uIGtleUZyb21Qcml2YXRlKHByaXYsIGVuYykge1xyXG4gIHJldHVybiBLZXlQYWlyLmZyb21Qcml2YXRlKHRoaXMsIHByaXYsIGVuYyk7XHJcbn07XHJcblxyXG5FQy5wcm90b3R5cGUua2V5RnJvbVB1YmxpYyA9IGZ1bmN0aW9uIGtleUZyb21QdWJsaWMocHViLCBlbmMpIHtcclxuICByZXR1cm4gS2V5UGFpci5mcm9tUHVibGljKHRoaXMsIHB1YiwgZW5jKTtcclxufTtcclxuXHJcbkVDLnByb3RvdHlwZS5nZW5LZXlQYWlyID0gZnVuY3Rpb24gZ2VuS2V5UGFpcihvcHRpb25zKSB7XHJcbiAgaWYgKCFvcHRpb25zKVxyXG4gICAgb3B0aW9ucyA9IHt9O1xyXG5cclxuICAvLyBJbnN0YW50aWF0ZSBIbWFjX0RSQkdcclxuICB2YXIgZHJiZyA9IG5ldyBIbWFjRFJCRyh7XHJcbiAgICBoYXNoOiB0aGlzLmhhc2gsXHJcbiAgICBwZXJzOiBvcHRpb25zLnBlcnMsXHJcbiAgICBwZXJzRW5jOiBvcHRpb25zLnBlcnNFbmMgfHwgJ3V0ZjgnLFxyXG4gICAgZW50cm9weTogb3B0aW9ucy5lbnRyb3B5IHx8IGVsbGlwdGljLnJhbmQodGhpcy5oYXNoLmhtYWNTdHJlbmd0aCksXHJcbiAgICBlbnRyb3B5RW5jOiBvcHRpb25zLmVudHJvcHkgJiYgb3B0aW9ucy5lbnRyb3B5RW5jIHx8ICd1dGY4JyxcclxuICAgIG5vbmNlOiB0aGlzLm4udG9BcnJheSgpXHJcbiAgfSk7XHJcblxyXG4gIHZhciBieXRlcyA9IHRoaXMubi5ieXRlTGVuZ3RoKCk7XHJcbiAgdmFyIG5zMiA9IHRoaXMubi5zdWIobmV3IEJOKDIpKTtcclxuICBkbyB7XHJcbiAgICB2YXIgcHJpdiA9IG5ldyBCTihkcmJnLmdlbmVyYXRlKGJ5dGVzKSk7XHJcbiAgICBpZiAocHJpdi5jbXAobnMyKSA+IDApXHJcbiAgICAgIGNvbnRpbnVlO1xyXG5cclxuICAgIHByaXYuaWFkZG4oMSk7XHJcbiAgICByZXR1cm4gdGhpcy5rZXlGcm9tUHJpdmF0ZShwcml2KTtcclxuICB9IHdoaWxlICh0cnVlKTtcclxufTtcclxuXHJcbkVDLnByb3RvdHlwZS5fdHJ1bmNhdGVUb04gPSBmdW5jdGlvbiB0cnVuY2F0ZVRvTihtc2csIHRydW5jT25seSkge1xyXG4gIHZhciBkZWx0YSA9IG1zZy5ieXRlTGVuZ3RoKCkgKiA4IC0gdGhpcy5uLmJpdExlbmd0aCgpO1xyXG4gIGlmIChkZWx0YSA+IDApXHJcbiAgICBtc2cgPSBtc2cudXNocm4oZGVsdGEpO1xyXG4gIGlmICghdHJ1bmNPbmx5ICYmIG1zZy5jbXAodGhpcy5uKSA+PSAwKVxyXG4gICAgcmV0dXJuIG1zZy5zdWIodGhpcy5uKTtcclxuICBlbHNlXHJcbiAgICByZXR1cm4gbXNnO1xyXG59O1xyXG5cclxuRUMucHJvdG90eXBlLnNpZ24gPSBmdW5jdGlvbiBzaWduKG1zZywga2V5LCBlbmMsIG9wdGlvbnMpIHtcclxuICBpZiAodHlwZW9mIGVuYyA9PT0gJ29iamVjdCcpIHtcclxuICAgIG9wdGlvbnMgPSBlbmM7XHJcbiAgICBlbmMgPSBudWxsO1xyXG4gIH1cclxuICBpZiAoIW9wdGlvbnMpXHJcbiAgICBvcHRpb25zID0ge307XHJcblxyXG4gIGtleSA9IHRoaXMua2V5RnJvbVByaXZhdGUoa2V5LCBlbmMpO1xyXG4gIG1zZyA9IHRoaXMuX3RydW5jYXRlVG9OKG5ldyBCTihtc2csIDE2KSk7XHJcblxyXG4gIC8vIFplcm8tZXh0ZW5kIGtleSB0byBwcm92aWRlIGVub3VnaCBlbnRyb3B5XHJcbiAgdmFyIGJ5dGVzID0gdGhpcy5uLmJ5dGVMZW5ndGgoKTtcclxuICB2YXIgYmtleSA9IGtleS5nZXRQcml2YXRlKCkudG9BcnJheSgnYmUnLCBieXRlcyk7XHJcblxyXG4gIC8vIFplcm8tZXh0ZW5kIG5vbmNlIHRvIGhhdmUgdGhlIHNhbWUgYnl0ZSBzaXplIGFzIE5cclxuICB2YXIgbm9uY2UgPSBtc2cudG9BcnJheSgnYmUnLCBieXRlcyk7XHJcblxyXG4gIC8vIEluc3RhbnRpYXRlIEhtYWNfRFJCR1xyXG4gIHZhciBkcmJnID0gbmV3IEhtYWNEUkJHKHtcclxuICAgIGhhc2g6IHRoaXMuaGFzaCxcclxuICAgIGVudHJvcHk6IGJrZXksXHJcbiAgICBub25jZTogbm9uY2UsXHJcbiAgICBwZXJzOiBvcHRpb25zLnBlcnMsXHJcbiAgICBwZXJzRW5jOiBvcHRpb25zLnBlcnNFbmMgfHwgJ3V0ZjgnXHJcbiAgfSk7XHJcblxyXG4gIC8vIE51bWJlciBvZiBieXRlcyB0byBnZW5lcmF0ZVxyXG4gIHZhciBuczEgPSB0aGlzLm4uc3ViKG5ldyBCTigxKSk7XHJcblxyXG4gIGZvciAodmFyIGl0ZXIgPSAwOyB0cnVlOyBpdGVyKyspIHtcclxuICAgIHZhciBrID0gb3B0aW9ucy5rID9cclxuICAgICAgICBvcHRpb25zLmsoaXRlcikgOlxyXG4gICAgICAgIG5ldyBCTihkcmJnLmdlbmVyYXRlKHRoaXMubi5ieXRlTGVuZ3RoKCkpKTtcclxuICAgIGsgPSB0aGlzLl90cnVuY2F0ZVRvTihrLCB0cnVlKTtcclxuICAgIGlmIChrLmNtcG4oMSkgPD0gMCB8fCBrLmNtcChuczEpID49IDApXHJcbiAgICAgIGNvbnRpbnVlO1xyXG5cclxuICAgIHZhciBrcCA9IHRoaXMuZy5tdWwoayk7XHJcbiAgICBpZiAoa3AuaXNJbmZpbml0eSgpKVxyXG4gICAgICBjb250aW51ZTtcclxuXHJcbiAgICB2YXIga3BYID0ga3AuZ2V0WCgpO1xyXG4gICAgdmFyIHIgPSBrcFgudW1vZCh0aGlzLm4pO1xyXG4gICAgaWYgKHIuY21wbigwKSA9PT0gMClcclxuICAgICAgY29udGludWU7XHJcblxyXG4gICAgdmFyIHMgPSBrLmludm0odGhpcy5uKS5tdWwoci5tdWwoa2V5LmdldFByaXZhdGUoKSkuaWFkZChtc2cpKTtcclxuICAgIHMgPSBzLnVtb2QodGhpcy5uKTtcclxuICAgIGlmIChzLmNtcG4oMCkgPT09IDApXHJcbiAgICAgIGNvbnRpbnVlO1xyXG5cclxuICAgIHZhciByZWNvdmVyeVBhcmFtID0gKGtwLmdldFkoKS5pc09kZCgpID8gMSA6IDApIHxcclxuICAgICAgICAgICAgICAgICAgICAgICAgKGtwWC5jbXAocikgIT09IDAgPyAyIDogMCk7XHJcblxyXG4gICAgLy8gVXNlIGNvbXBsZW1lbnQgb2YgYHNgLCBpZiBpdCBpcyA+IGBuIC8gMmBcclxuICAgIGlmIChvcHRpb25zLmNhbm9uaWNhbCAmJiBzLmNtcCh0aGlzLm5oKSA+IDApIHtcclxuICAgICAgcyA9IHRoaXMubi5zdWIocyk7XHJcbiAgICAgIHJlY292ZXJ5UGFyYW0gXj0gMTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gbmV3IFNpZ25hdHVyZSh7IHI6IHIsIHM6IHMsIHJlY292ZXJ5UGFyYW06IHJlY292ZXJ5UGFyYW0gfSk7XHJcbiAgfVxyXG59O1xyXG5cclxuRUMucHJvdG90eXBlLnZlcmlmeSA9IGZ1bmN0aW9uIHZlcmlmeShtc2csIHNpZ25hdHVyZSwga2V5LCBlbmMpIHtcclxuICBtc2cgPSB0aGlzLl90cnVuY2F0ZVRvTihuZXcgQk4obXNnLCAxNikpO1xyXG4gIGtleSA9IHRoaXMua2V5RnJvbVB1YmxpYyhrZXksIGVuYyk7XHJcbiAgc2lnbmF0dXJlID0gbmV3IFNpZ25hdHVyZShzaWduYXR1cmUsICdoZXgnKTtcclxuXHJcbiAgLy8gUGVyZm9ybSBwcmltaXRpdmUgdmFsdWVzIHZhbGlkYXRpb25cclxuICB2YXIgciA9IHNpZ25hdHVyZS5yO1xyXG4gIHZhciBzID0gc2lnbmF0dXJlLnM7XHJcbiAgaWYgKHIuY21wbigxKSA8IDAgfHwgci5jbXAodGhpcy5uKSA+PSAwKVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIGlmIChzLmNtcG4oMSkgPCAwIHx8IHMuY21wKHRoaXMubikgPj0gMClcclxuICAgIHJldHVybiBmYWxzZTtcclxuXHJcbiAgLy8gVmFsaWRhdGUgc2lnbmF0dXJlXHJcbiAgdmFyIHNpbnYgPSBzLmludm0odGhpcy5uKTtcclxuICB2YXIgdTEgPSBzaW52Lm11bChtc2cpLnVtb2QodGhpcy5uKTtcclxuICB2YXIgdTIgPSBzaW52Lm11bChyKS51bW9kKHRoaXMubik7XHJcblxyXG4gIGlmICghdGhpcy5jdXJ2ZS5fbWF4d2VsbFRyaWNrKSB7XHJcbiAgICB2YXIgcCA9IHRoaXMuZy5tdWxBZGQodTEsIGtleS5nZXRQdWJsaWMoKSwgdTIpO1xyXG4gICAgaWYgKHAuaXNJbmZpbml0eSgpKVxyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcblxyXG4gICAgcmV0dXJuIHAuZ2V0WCgpLnVtb2QodGhpcy5uKS5jbXAocikgPT09IDA7XHJcbiAgfVxyXG5cclxuICAvLyBOT1RFOiBHcmVnIE1heHdlbGwncyB0cmljaywgaW5zcGlyZWQgYnk6XHJcbiAgLy8gaHR0cHM6Ly9naXQuaW8vdmFkM0tcclxuXHJcbiAgdmFyIHAgPSB0aGlzLmcuam11bEFkZCh1MSwga2V5LmdldFB1YmxpYygpLCB1Mik7XHJcbiAgaWYgKHAuaXNJbmZpbml0eSgpKVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG5cclxuICAvLyBDb21wYXJlIGBwLnhgIG9mIEphY29iaWFuIHBvaW50IHdpdGggYHJgLFxyXG4gIC8vIHRoaXMgd2lsbCBkbyBgcC54ID09IHIgKiBwLnpeMmAgaW5zdGVhZCBvZiBtdWx0aXBseWluZyBgcC54YCBieSB0aGVcclxuICAvLyBpbnZlcnNlIG9mIGBwLnpeMmBcclxuICByZXR1cm4gcC5lcVhUb1Aocik7XHJcbn07XHJcblxyXG5FQy5wcm90b3R5cGUucmVjb3ZlclB1YktleSA9IGZ1bmN0aW9uKG1zZywgc2lnbmF0dXJlLCBqLCBlbmMpIHtcclxuICBhc3NlcnQoKDMgJiBqKSA9PT0gaiwgJ1RoZSByZWNvdmVyeSBwYXJhbSBpcyBtb3JlIHRoYW4gdHdvIGJpdHMnKTtcclxuICBzaWduYXR1cmUgPSBuZXcgU2lnbmF0dXJlKHNpZ25hdHVyZSwgZW5jKTtcclxuXHJcbiAgdmFyIG4gPSB0aGlzLm47XHJcbiAgdmFyIGUgPSBuZXcgQk4obXNnKTtcclxuICB2YXIgciA9IHNpZ25hdHVyZS5yO1xyXG4gIHZhciBzID0gc2lnbmF0dXJlLnM7XHJcblxyXG4gIC8vIEEgc2V0IExTQiBzaWduaWZpZXMgdGhhdCB0aGUgeS1jb29yZGluYXRlIGlzIG9kZFxyXG4gIHZhciBpc1lPZGQgPSBqICYgMTtcclxuICB2YXIgaXNTZWNvbmRLZXkgPSBqID4+IDE7XHJcbiAgaWYgKHIuY21wKHRoaXMuY3VydmUucC51bW9kKHRoaXMuY3VydmUubikpID49IDAgJiYgaXNTZWNvbmRLZXkpXHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1VuYWJsZSB0byBmaW5kIHNlbmNvbmQga2V5IGNhbmRpbmF0ZScpO1xyXG5cclxuICAvLyAxLjEuIExldCB4ID0gciArIGpuLlxyXG4gIGlmIChpc1NlY29uZEtleSlcclxuICAgIHIgPSB0aGlzLmN1cnZlLnBvaW50RnJvbVgoci5hZGQodGhpcy5jdXJ2ZS5uKSwgaXNZT2RkKTtcclxuICBlbHNlXHJcbiAgICByID0gdGhpcy5jdXJ2ZS5wb2ludEZyb21YKHIsIGlzWU9kZCk7XHJcblxyXG4gIHZhciBySW52ID0gc2lnbmF0dXJlLnIuaW52bShuKTtcclxuICB2YXIgczEgPSBuLnN1YihlKS5tdWwockludikudW1vZChuKTtcclxuICB2YXIgczIgPSBzLm11bChySW52KS51bW9kKG4pO1xyXG5cclxuICAvLyAxLjYuMSBDb21wdXRlIFEgPSByXi0xIChzUiAtICBlRylcclxuICAvLyAgICAgICAgICAgICAgIFEgPSByXi0xIChzUiArIC1lRylcclxuICByZXR1cm4gdGhpcy5nLm11bEFkZChzMSwgciwgczIpO1xyXG59O1xyXG5cclxuRUMucHJvdG90eXBlLmdldEtleVJlY292ZXJ5UGFyYW0gPSBmdW5jdGlvbihlLCBzaWduYXR1cmUsIFEsIGVuYykge1xyXG4gIHNpZ25hdHVyZSA9IG5ldyBTaWduYXR1cmUoc2lnbmF0dXJlLCBlbmMpO1xyXG4gIGlmIChzaWduYXR1cmUucmVjb3ZlcnlQYXJhbSAhPT0gbnVsbClcclxuICAgIHJldHVybiBzaWduYXR1cmUucmVjb3ZlcnlQYXJhbTtcclxuXHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCA0OyBpKyspIHtcclxuICAgIHZhciBRcHJpbWU7XHJcbiAgICB0cnkge1xyXG4gICAgICBRcHJpbWUgPSB0aGlzLnJlY292ZXJQdWJLZXkoZSwgc2lnbmF0dXJlLCBpKTtcclxuICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgY29udGludWU7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKFFwcmltZS5lcShRKSlcclxuICAgICAgcmV0dXJuIGk7XHJcbiAgfVxyXG4gIHRocm93IG5ldyBFcnJvcignVW5hYmxlIHRvIGZpbmQgdmFsaWQgcmVjb3ZlcnkgZmFjdG9yJyk7XHJcbn07XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBCTiA9IHJlcXVpcmUoJ2JuLmpzJyk7XHJcbnZhciBlbGxpcHRpYyA9IHJlcXVpcmUoJy4uLy4uL2VsbGlwdGljJyk7XHJcbnZhciB1dGlscyA9IGVsbGlwdGljLnV0aWxzO1xyXG52YXIgYXNzZXJ0ID0gdXRpbHMuYXNzZXJ0O1xyXG5cclxuZnVuY3Rpb24gS2V5UGFpcihlYywgb3B0aW9ucykge1xyXG4gIHRoaXMuZWMgPSBlYztcclxuICB0aGlzLnByaXYgPSBudWxsO1xyXG4gIHRoaXMucHViID0gbnVsbDtcclxuXHJcbiAgLy8gS2V5UGFpcihlYywgeyBwcml2OiAuLi4sIHB1YjogLi4uIH0pXHJcbiAgaWYgKG9wdGlvbnMucHJpdilcclxuICAgIHRoaXMuX2ltcG9ydFByaXZhdGUob3B0aW9ucy5wcml2LCBvcHRpb25zLnByaXZFbmMpO1xyXG4gIGlmIChvcHRpb25zLnB1YilcclxuICAgIHRoaXMuX2ltcG9ydFB1YmxpYyhvcHRpb25zLnB1Yiwgb3B0aW9ucy5wdWJFbmMpO1xyXG59XHJcbm1vZHVsZS5leHBvcnRzID0gS2V5UGFpcjtcclxuXHJcbktleVBhaXIuZnJvbVB1YmxpYyA9IGZ1bmN0aW9uIGZyb21QdWJsaWMoZWMsIHB1YiwgZW5jKSB7XHJcbiAgaWYgKHB1YiBpbnN0YW5jZW9mIEtleVBhaXIpXHJcbiAgICByZXR1cm4gcHViO1xyXG5cclxuICByZXR1cm4gbmV3IEtleVBhaXIoZWMsIHtcclxuICAgIHB1YjogcHViLFxyXG4gICAgcHViRW5jOiBlbmNcclxuICB9KTtcclxufTtcclxuXHJcbktleVBhaXIuZnJvbVByaXZhdGUgPSBmdW5jdGlvbiBmcm9tUHJpdmF0ZShlYywgcHJpdiwgZW5jKSB7XHJcbiAgaWYgKHByaXYgaW5zdGFuY2VvZiBLZXlQYWlyKVxyXG4gICAgcmV0dXJuIHByaXY7XHJcblxyXG4gIHJldHVybiBuZXcgS2V5UGFpcihlYywge1xyXG4gICAgcHJpdjogcHJpdixcclxuICAgIHByaXZFbmM6IGVuY1xyXG4gIH0pO1xyXG59O1xyXG5cclxuS2V5UGFpci5wcm90b3R5cGUudmFsaWRhdGUgPSBmdW5jdGlvbiB2YWxpZGF0ZSgpIHtcclxuICB2YXIgcHViID0gdGhpcy5nZXRQdWJsaWMoKTtcclxuXHJcbiAgaWYgKHB1Yi5pc0luZmluaXR5KCkpXHJcbiAgICByZXR1cm4geyByZXN1bHQ6IGZhbHNlLCByZWFzb246ICdJbnZhbGlkIHB1YmxpYyBrZXknIH07XHJcbiAgaWYgKCFwdWIudmFsaWRhdGUoKSlcclxuICAgIHJldHVybiB7IHJlc3VsdDogZmFsc2UsIHJlYXNvbjogJ1B1YmxpYyBrZXkgaXMgbm90IGEgcG9pbnQnIH07XHJcbiAgaWYgKCFwdWIubXVsKHRoaXMuZWMuY3VydmUubikuaXNJbmZpbml0eSgpKVxyXG4gICAgcmV0dXJuIHsgcmVzdWx0OiBmYWxzZSwgcmVhc29uOiAnUHVibGljIGtleSAqIE4gIT0gTycgfTtcclxuXHJcbiAgcmV0dXJuIHsgcmVzdWx0OiB0cnVlLCByZWFzb246IG51bGwgfTtcclxufTtcclxuXHJcbktleVBhaXIucHJvdG90eXBlLmdldFB1YmxpYyA9IGZ1bmN0aW9uIGdldFB1YmxpYyhjb21wYWN0LCBlbmMpIHtcclxuICAvLyBjb21wYWN0IGlzIG9wdGlvbmFsIGFyZ3VtZW50XHJcbiAgaWYgKHR5cGVvZiBjb21wYWN0ID09PSAnc3RyaW5nJykge1xyXG4gICAgZW5jID0gY29tcGFjdDtcclxuICAgIGNvbXBhY3QgPSBudWxsO1xyXG4gIH1cclxuXHJcbiAgaWYgKCF0aGlzLnB1YilcclxuICAgIHRoaXMucHViID0gdGhpcy5lYy5nLm11bCh0aGlzLnByaXYpO1xyXG5cclxuICBpZiAoIWVuYylcclxuICAgIHJldHVybiB0aGlzLnB1YjtcclxuXHJcbiAgcmV0dXJuIHRoaXMucHViLmVuY29kZShlbmMsIGNvbXBhY3QpO1xyXG59O1xyXG5cclxuS2V5UGFpci5wcm90b3R5cGUuZ2V0UHJpdmF0ZSA9IGZ1bmN0aW9uIGdldFByaXZhdGUoZW5jKSB7XHJcbiAgaWYgKGVuYyA9PT0gJ2hleCcpXHJcbiAgICByZXR1cm4gdGhpcy5wcml2LnRvU3RyaW5nKDE2LCAyKTtcclxuICBlbHNlXHJcbiAgICByZXR1cm4gdGhpcy5wcml2O1xyXG59O1xyXG5cclxuS2V5UGFpci5wcm90b3R5cGUuX2ltcG9ydFByaXZhdGUgPSBmdW5jdGlvbiBfaW1wb3J0UHJpdmF0ZShrZXksIGVuYykge1xyXG4gIHRoaXMucHJpdiA9IG5ldyBCTihrZXksIGVuYyB8fCAxNik7XHJcblxyXG4gIC8vIEVuc3VyZSB0aGF0IHRoZSBwcml2IHdvbid0IGJlIGJpZ2dlciB0aGFuIG4sIG90aGVyd2lzZSB3ZSBtYXkgZmFpbFxyXG4gIC8vIGluIGZpeGVkIG11bHRpcGxpY2F0aW9uIG1ldGhvZFxyXG4gIHRoaXMucHJpdiA9IHRoaXMucHJpdi51bW9kKHRoaXMuZWMuY3VydmUubik7XHJcbn07XHJcblxyXG5LZXlQYWlyLnByb3RvdHlwZS5faW1wb3J0UHVibGljID0gZnVuY3Rpb24gX2ltcG9ydFB1YmxpYyhrZXksIGVuYykge1xyXG4gIGlmIChrZXkueCB8fCBrZXkueSkge1xyXG4gICAgLy8gTW9udGdvbWVyeSBwb2ludHMgb25seSBoYXZlIGFuIGB4YCBjb29yZGluYXRlLlxyXG4gICAgLy8gV2VpZXJzdHJhc3MvRWR3YXJkcyBwb2ludHMgb24gdGhlIG90aGVyIGhhbmQgaGF2ZSBib3RoIGB4YCBhbmRcclxuICAgIC8vIGB5YCBjb29yZGluYXRlcy5cclxuICAgIGlmICh0aGlzLmVjLmN1cnZlLnR5cGUgPT09ICdtb250Jykge1xyXG4gICAgICBhc3NlcnQoa2V5LngsICdOZWVkIHggY29vcmRpbmF0ZScpO1xyXG4gICAgfSBlbHNlIGlmICh0aGlzLmVjLmN1cnZlLnR5cGUgPT09ICdzaG9ydCcgfHxcclxuICAgICAgICAgICAgICAgdGhpcy5lYy5jdXJ2ZS50eXBlID09PSAnZWR3YXJkcycpIHtcclxuICAgICAgYXNzZXJ0KGtleS54ICYmIGtleS55LCAnTmVlZCBib3RoIHggYW5kIHkgY29vcmRpbmF0ZScpO1xyXG4gICAgfVxyXG4gICAgdGhpcy5wdWIgPSB0aGlzLmVjLmN1cnZlLnBvaW50KGtleS54LCBrZXkueSk7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG4gIHRoaXMucHViID0gdGhpcy5lYy5jdXJ2ZS5kZWNvZGVQb2ludChrZXksIGVuYyk7XHJcbn07XHJcblxyXG4vLyBFQ0RIXHJcbktleVBhaXIucHJvdG90eXBlLmRlcml2ZSA9IGZ1bmN0aW9uIGRlcml2ZShwdWIpIHtcclxuICByZXR1cm4gcHViLm11bCh0aGlzLnByaXYpLmdldFgoKTtcclxufTtcclxuXHJcbi8vIEVDRFNBXHJcbktleVBhaXIucHJvdG90eXBlLnNpZ24gPSBmdW5jdGlvbiBzaWduKG1zZywgZW5jLCBvcHRpb25zKSB7XHJcbiAgcmV0dXJuIHRoaXMuZWMuc2lnbihtc2csIHRoaXMsIGVuYywgb3B0aW9ucyk7XHJcbn07XHJcblxyXG5LZXlQYWlyLnByb3RvdHlwZS52ZXJpZnkgPSBmdW5jdGlvbiB2ZXJpZnkobXNnLCBzaWduYXR1cmUpIHtcclxuICByZXR1cm4gdGhpcy5lYy52ZXJpZnkobXNnLCBzaWduYXR1cmUsIHRoaXMpO1xyXG59O1xyXG5cclxuS2V5UGFpci5wcm90b3R5cGUuaW5zcGVjdCA9IGZ1bmN0aW9uIGluc3BlY3QoKSB7XHJcbiAgcmV0dXJuICc8S2V5IHByaXY6ICcgKyAodGhpcy5wcml2ICYmIHRoaXMucHJpdi50b1N0cmluZygxNiwgMikpICtcclxuICAgICAgICAgJyBwdWI6ICcgKyAodGhpcy5wdWIgJiYgdGhpcy5wdWIuaW5zcGVjdCgpKSArICcgPic7XHJcbn07XHJcbiJdLCJzb3VyY2VSb290IjoiIn0=