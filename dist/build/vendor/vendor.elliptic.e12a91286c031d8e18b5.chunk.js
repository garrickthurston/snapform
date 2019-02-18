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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZWxsaXB0aWMvbGliL2VsbGlwdGljL2N1cnZlL2Jhc2UuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2VsbGlwdGljL2xpYi9lbGxpcHRpYy91dGlscy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZWxsaXB0aWMvbGliL2VsbGlwdGljL2N1cnZlcy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZWxsaXB0aWMvbGliL2VsbGlwdGljL2N1cnZlL3Nob3J0LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9lbGxpcHRpYy9saWIvZWxsaXB0aWMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2VsbGlwdGljL2xpYi9lbGxpcHRpYy9lZGRzYS9rZXkuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2VsbGlwdGljL2xpYi9lbGxpcHRpYy9jdXJ2ZS9lZHdhcmRzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9lbGxpcHRpYy9saWIvZWxsaXB0aWMvcHJlY29tcHV0ZWQvc2VjcDI1NmsxLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9lbGxpcHRpYy9saWIvZWxsaXB0aWMvY3VydmUvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2VsbGlwdGljL2xpYi9lbGxpcHRpYy9lZGRzYS9zaWduYXR1cmUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2VsbGlwdGljL2xpYi9lbGxpcHRpYy9jdXJ2ZS9tb250LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9lbGxpcHRpYy9saWIvZWxsaXB0aWMvZWRkc2EvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2VsbGlwdGljL2xpYi9lbGxpcHRpYy9lYy9zaWduYXR1cmUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2VsbGlwdGljL2xpYi9lbGxpcHRpYy9lYy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZWxsaXB0aWMvbGliL2VsbGlwdGljL2VjL2tleS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQWE7O0FBRWIsU0FBUyxtQkFBTyxDQUFDLG1CQUFPO0FBQ3hCLGVBQWUsbUJBQU8sQ0FBQyw0QkFBZ0I7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGlCQUFpQixnQkFBZ0I7QUFDakM7QUFDQSxzQ0FBc0MsUUFBUTtBQUM5QztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGlCQUFpQixPQUFPO0FBQ3hCLG1CQUFtQixpQkFBaUI7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSw4QkFBOEIsUUFBUTtBQUN0QztBQUNBLG1CQUFtQix3QkFBd0I7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGlCQUFpQixTQUFTO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSx1QkFBdUIsUUFBUTtBQUMvQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsU0FBUztBQUM1QjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG1CQUFtQixRQUFRO0FBQzNCOztBQUVBO0FBQ0E7QUFDQSxxQkFBcUIsU0FBUztBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLG1CQUFtQixTQUFTO0FBQzVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsU0FBUztBQUMxQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsaUJBQWlCLFdBQVc7QUFDNUIsbUJBQW1CLFVBQVU7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLFNBQVM7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsaUJBQWlCLE9BQU87QUFDeEI7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDdFhhOztBQUViO0FBQ0EsU0FBUyxtQkFBTyxDQUFDLG1CQUFPO0FBQ3hCLGdCQUFnQixtQkFBTyxDQUFDLGlDQUFxQjtBQUM3QyxlQUFlLG1CQUFPLENBQUMsdUNBQTJCOztBQUVsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxtQkFBbUIsV0FBVztBQUM5QjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7O0FDdEhhOztBQUViOztBQUVBLFdBQVcsbUJBQU8sQ0FBQyxxQkFBUztBQUM1QixlQUFlLG1CQUFPLENBQUMseUJBQWE7O0FBRXBDOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBLFFBQVEsbUJBQU8sQ0FBQyxxQ0FBeUI7QUFDekMsQ0FBQztBQUNEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDNU1ZOztBQUViLFlBQVksbUJBQU8sQ0FBQyxzQkFBVTtBQUM5QixlQUFlLG1CQUFPLENBQUMsNEJBQWdCO0FBQ3ZDLFNBQVMsbUJBQU8sQ0FBQyxtQkFBTztBQUN4QixlQUFlLG1CQUFPLENBQUMsc0JBQVU7QUFDakM7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSwyREFBMkQ7QUFDM0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEtBQUssZUFBZTtBQUNwQixLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsbUJBQW1CO0FBQ3BDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGlCQUFpQixXQUFXO0FBQzVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxtQkFBbUIsU0FBUztBQUM1QjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGlCQUFpQixTQUFTO0FBQzFCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQjtBQUN0QjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQjtBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDeDZCYTs7QUFFYjs7QUFFQSxtQkFBbUIsbUJBQU8sQ0FBQyw2QkFBaUI7QUFDNUMsaUJBQWlCLG1CQUFPLENBQUMsOEJBQWtCO0FBQzNDLGdCQUFnQixtQkFBTyxDQUFDLHFCQUFTO0FBQ2pDLGlCQUFpQixtQkFBTyxDQUFDLDhCQUFrQjtBQUMzQyxrQkFBa0IsbUJBQU8sQ0FBQywrQkFBbUI7O0FBRTdDO0FBQ0EsY0FBYyxtQkFBTyxDQUFDLDJCQUFlO0FBQ3JDLGlCQUFpQixtQkFBTyxDQUFDLDhCQUFrQjs7Ozs7Ozs7Ozs7OztBQ1o5Qjs7QUFFYixlQUFlLG1CQUFPLENBQUMsNEJBQWdCO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsVUFBVSxNQUFNO0FBQ2hCLFVBQVUsT0FBTztBQUNqQjtBQUNBLFVBQVUsWUFBWTtBQUN0QixVQUFVLE1BQU07QUFDaEIsVUFBVSxZQUFZO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLDZCQUE2QixXQUFXO0FBQ3hDOztBQUVBO0FBQ0E7QUFDQTtBQUNBLDZCQUE2QixpQkFBaUI7QUFDOUM7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7OztBQy9GYTs7QUFFYixZQUFZLG1CQUFPLENBQUMsc0JBQVU7QUFDOUIsZUFBZSxtQkFBTyxDQUFDLDRCQUFnQjtBQUN2QyxTQUFTLG1CQUFPLENBQUMsbUJBQU87QUFDeEIsZUFBZSxtQkFBTyxDQUFDLHNCQUFVO0FBQ2pDOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ2hiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7OztBQzN3QmE7O0FBRWI7O0FBRUEsYUFBYSxtQkFBTyxDQUFDLG9CQUFRO0FBQzdCLGNBQWMsbUJBQU8sQ0FBQyxxQkFBUztBQUMvQixhQUFhLG1CQUFPLENBQUMsb0JBQVE7QUFDN0IsZ0JBQWdCLG1CQUFPLENBQUMsdUJBQVc7Ozs7Ozs7Ozs7Ozs7QUNQdEI7O0FBRWIsU0FBUyxtQkFBTyxDQUFDLG1CQUFPO0FBQ3hCLGVBQWUsbUJBQU8sQ0FBQyw0QkFBZ0I7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxVQUFVLE1BQU07QUFDaEIsVUFBVSxvQkFBb0I7QUFDOUIsVUFBVSxtQkFBbUI7QUFDN0IsVUFBVSxnQkFBZ0I7QUFDMUIsVUFBVSxhQUFhO0FBQ3ZCLFVBQVUsYUFBYTtBQUN2QjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7Ozs7QUNqRWE7O0FBRWIsWUFBWSxtQkFBTyxDQUFDLHNCQUFVO0FBQzlCLFNBQVMsbUJBQU8sQ0FBQyxtQkFBTztBQUN4QixlQUFlLG1CQUFPLENBQUMsc0JBQVU7QUFDakM7O0FBRUEsZUFBZSxtQkFBTyxDQUFDLDRCQUFnQjtBQUN2Qzs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGVBQWU7QUFDZix1Q0FBdUM7QUFDdkMsZUFBZTs7QUFFZixxQkFBcUIsaUJBQWlCO0FBQ3RDOztBQUVBLCtCQUErQixRQUFRO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDbkxhOztBQUViLFdBQVcsbUJBQU8sQ0FBQyxxQkFBUztBQUM1QixlQUFlLG1CQUFPLENBQUMsNEJBQWdCO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBLGNBQWMsbUJBQU8sQ0FBQyxtQkFBTztBQUM3QixnQkFBZ0IsbUJBQU8sQ0FBQyx5QkFBYTs7QUFFckM7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0EsVUFBVSxhQUFhO0FBQ3ZCLFVBQVUscUJBQXFCO0FBQy9CLFlBQVksVUFBVTtBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZCQUE2QixpQ0FBaUM7QUFDOUQ7O0FBRUE7QUFDQSxVQUFVLE1BQU07QUFDaEIsVUFBVSx1QkFBdUI7QUFDakMsVUFBVSwyQkFBMkI7QUFDckMsWUFBWSxRQUFRO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxpQkFBaUIsc0JBQXNCO0FBQ3ZDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDckhhOztBQUViLFNBQVMsbUJBQU8sQ0FBQyxtQkFBTzs7QUFFeEIsZUFBZSxtQkFBTyxDQUFDLDRCQUFnQjtBQUN2QztBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQ0FBZ0MsY0FBYztBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDdElhOztBQUViLFNBQVMsbUJBQU8sQ0FBQyxtQkFBTztBQUN4QixlQUFlLG1CQUFPLENBQUMsdUJBQVc7QUFDbEMsZUFBZSxtQkFBTyxDQUFDLDRCQUFnQjtBQUN2QztBQUNBOztBQUVBLGNBQWMsbUJBQU8sQ0FBQyxtQkFBTztBQUM3QixnQkFBZ0IsbUJBQU8sQ0FBQyx5QkFBYTs7QUFFckM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxlQUFlOztBQUVmO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7O0FBRUEsb0JBQW9CLE1BQU07QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsMEJBQTBCLDJDQUEyQztBQUNyRTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxpQkFBaUIsT0FBTztBQUN4QjtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDL09hOztBQUViLFNBQVMsbUJBQU8sQ0FBQyxtQkFBTztBQUN4QixlQUFlLG1CQUFPLENBQUMsNEJBQWdCO0FBQ3ZDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsa0JBQWtCLHNCQUFzQjtBQUN4QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxZQUFZO0FBQ1o7QUFDQSxZQUFZO0FBQ1o7QUFDQSxZQUFZOztBQUVaLFVBQVU7QUFDVjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYnVpbGQvdmVuZG9yL3ZlbmRvci5lbGxpcHRpYy5lMTJhOTEyODZjMDMxZDhlMThiNS5jaHVuay5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxudmFyIEJOID0gcmVxdWlyZSgnYm4uanMnKTtcbnZhciBlbGxpcHRpYyA9IHJlcXVpcmUoJy4uLy4uL2VsbGlwdGljJyk7XG52YXIgdXRpbHMgPSBlbGxpcHRpYy51dGlscztcbnZhciBnZXROQUYgPSB1dGlscy5nZXROQUY7XG52YXIgZ2V0SlNGID0gdXRpbHMuZ2V0SlNGO1xudmFyIGFzc2VydCA9IHV0aWxzLmFzc2VydDtcblxuZnVuY3Rpb24gQmFzZUN1cnZlKHR5cGUsIGNvbmYpIHtcbiAgdGhpcy50eXBlID0gdHlwZTtcbiAgdGhpcy5wID0gbmV3IEJOKGNvbmYucCwgMTYpO1xuXG4gIC8vIFVzZSBNb250Z29tZXJ5LCB3aGVuIHRoZXJlIGlzIG5vIGZhc3QgcmVkdWN0aW9uIGZvciB0aGUgcHJpbWVcbiAgdGhpcy5yZWQgPSBjb25mLnByaW1lID8gQk4ucmVkKGNvbmYucHJpbWUpIDogQk4ubW9udCh0aGlzLnApO1xuXG4gIC8vIFVzZWZ1bCBmb3IgbWFueSBjdXJ2ZXNcbiAgdGhpcy56ZXJvID0gbmV3IEJOKDApLnRvUmVkKHRoaXMucmVkKTtcbiAgdGhpcy5vbmUgPSBuZXcgQk4oMSkudG9SZWQodGhpcy5yZWQpO1xuICB0aGlzLnR3byA9IG5ldyBCTigyKS50b1JlZCh0aGlzLnJlZCk7XG5cbiAgLy8gQ3VydmUgY29uZmlndXJhdGlvbiwgb3B0aW9uYWxcbiAgdGhpcy5uID0gY29uZi5uICYmIG5ldyBCTihjb25mLm4sIDE2KTtcbiAgdGhpcy5nID0gY29uZi5nICYmIHRoaXMucG9pbnRGcm9tSlNPTihjb25mLmcsIGNvbmYuZ1JlZCk7XG5cbiAgLy8gVGVtcG9yYXJ5IGFycmF5c1xuICB0aGlzLl93bmFmVDEgPSBuZXcgQXJyYXkoNCk7XG4gIHRoaXMuX3duYWZUMiA9IG5ldyBBcnJheSg0KTtcbiAgdGhpcy5fd25hZlQzID0gbmV3IEFycmF5KDQpO1xuICB0aGlzLl93bmFmVDQgPSBuZXcgQXJyYXkoNCk7XG5cbiAgLy8gR2VuZXJhbGl6ZWQgR3JlZyBNYXh3ZWxsJ3MgdHJpY2tcbiAgdmFyIGFkanVzdENvdW50ID0gdGhpcy5uICYmIHRoaXMucC5kaXYodGhpcy5uKTtcbiAgaWYgKCFhZGp1c3RDb3VudCB8fCBhZGp1c3RDb3VudC5jbXBuKDEwMCkgPiAwKSB7XG4gICAgdGhpcy5yZWROID0gbnVsbDtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLl9tYXh3ZWxsVHJpY2sgPSB0cnVlO1xuICAgIHRoaXMucmVkTiA9IHRoaXMubi50b1JlZCh0aGlzLnJlZCk7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gQmFzZUN1cnZlO1xuXG5CYXNlQ3VydmUucHJvdG90eXBlLnBvaW50ID0gZnVuY3Rpb24gcG9pbnQoKSB7XG4gIHRocm93IG5ldyBFcnJvcignTm90IGltcGxlbWVudGVkJyk7XG59O1xuXG5CYXNlQ3VydmUucHJvdG90eXBlLnZhbGlkYXRlID0gZnVuY3Rpb24gdmFsaWRhdGUoKSB7XG4gIHRocm93IG5ldyBFcnJvcignTm90IGltcGxlbWVudGVkJyk7XG59O1xuXG5CYXNlQ3VydmUucHJvdG90eXBlLl9maXhlZE5hZk11bCA9IGZ1bmN0aW9uIF9maXhlZE5hZk11bChwLCBrKSB7XG4gIGFzc2VydChwLnByZWNvbXB1dGVkKTtcbiAgdmFyIGRvdWJsZXMgPSBwLl9nZXREb3VibGVzKCk7XG5cbiAgdmFyIG5hZiA9IGdldE5BRihrLCAxKTtcbiAgdmFyIEkgPSAoMSA8PCAoZG91Ymxlcy5zdGVwICsgMSkpIC0gKGRvdWJsZXMuc3RlcCAlIDIgPT09IDAgPyAyIDogMSk7XG4gIEkgLz0gMztcblxuICAvLyBUcmFuc2xhdGUgaW50byBtb3JlIHdpbmRvd2VkIGZvcm1cbiAgdmFyIHJlcHIgPSBbXTtcbiAgZm9yICh2YXIgaiA9IDA7IGogPCBuYWYubGVuZ3RoOyBqICs9IGRvdWJsZXMuc3RlcCkge1xuICAgIHZhciBuYWZXID0gMDtcbiAgICBmb3IgKHZhciBrID0gaiArIGRvdWJsZXMuc3RlcCAtIDE7IGsgPj0gajsgay0tKVxuICAgICAgbmFmVyA9IChuYWZXIDw8IDEpICsgbmFmW2tdO1xuICAgIHJlcHIucHVzaChuYWZXKTtcbiAgfVxuXG4gIHZhciBhID0gdGhpcy5qcG9pbnQobnVsbCwgbnVsbCwgbnVsbCk7XG4gIHZhciBiID0gdGhpcy5qcG9pbnQobnVsbCwgbnVsbCwgbnVsbCk7XG4gIGZvciAodmFyIGkgPSBJOyBpID4gMDsgaS0tKSB7XG4gICAgZm9yICh2YXIgaiA9IDA7IGogPCByZXByLmxlbmd0aDsgaisrKSB7XG4gICAgICB2YXIgbmFmVyA9IHJlcHJbal07XG4gICAgICBpZiAobmFmVyA9PT0gaSlcbiAgICAgICAgYiA9IGIubWl4ZWRBZGQoZG91Ymxlcy5wb2ludHNbal0pO1xuICAgICAgZWxzZSBpZiAobmFmVyA9PT0gLWkpXG4gICAgICAgIGIgPSBiLm1peGVkQWRkKGRvdWJsZXMucG9pbnRzW2pdLm5lZygpKTtcbiAgICB9XG4gICAgYSA9IGEuYWRkKGIpO1xuICB9XG4gIHJldHVybiBhLnRvUCgpO1xufTtcblxuQmFzZUN1cnZlLnByb3RvdHlwZS5fd25hZk11bCA9IGZ1bmN0aW9uIF93bmFmTXVsKHAsIGspIHtcbiAgdmFyIHcgPSA0O1xuXG4gIC8vIFByZWNvbXB1dGUgd2luZG93XG4gIHZhciBuYWZQb2ludHMgPSBwLl9nZXROQUZQb2ludHModyk7XG4gIHcgPSBuYWZQb2ludHMud25kO1xuICB2YXIgd25kID0gbmFmUG9pbnRzLnBvaW50cztcblxuICAvLyBHZXQgTkFGIGZvcm1cbiAgdmFyIG5hZiA9IGdldE5BRihrLCB3KTtcblxuICAvLyBBZGQgYHRoaXNgKihOKzEpIGZvciBldmVyeSB3LU5BRiBpbmRleFxuICB2YXIgYWNjID0gdGhpcy5qcG9pbnQobnVsbCwgbnVsbCwgbnVsbCk7XG4gIGZvciAodmFyIGkgPSBuYWYubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAvLyBDb3VudCB6ZXJvZXNcbiAgICBmb3IgKHZhciBrID0gMDsgaSA+PSAwICYmIG5hZltpXSA9PT0gMDsgaS0tKVxuICAgICAgaysrO1xuICAgIGlmIChpID49IDApXG4gICAgICBrKys7XG4gICAgYWNjID0gYWNjLmRibHAoayk7XG5cbiAgICBpZiAoaSA8IDApXG4gICAgICBicmVhaztcbiAgICB2YXIgeiA9IG5hZltpXTtcbiAgICBhc3NlcnQoeiAhPT0gMCk7XG4gICAgaWYgKHAudHlwZSA9PT0gJ2FmZmluZScpIHtcbiAgICAgIC8vIEogKy0gUFxuICAgICAgaWYgKHogPiAwKVxuICAgICAgICBhY2MgPSBhY2MubWl4ZWRBZGQod25kWyh6IC0gMSkgPj4gMV0pO1xuICAgICAgZWxzZVxuICAgICAgICBhY2MgPSBhY2MubWl4ZWRBZGQod25kWygteiAtIDEpID4+IDFdLm5lZygpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gSiArLSBKXG4gICAgICBpZiAoeiA+IDApXG4gICAgICAgIGFjYyA9IGFjYy5hZGQod25kWyh6IC0gMSkgPj4gMV0pO1xuICAgICAgZWxzZVxuICAgICAgICBhY2MgPSBhY2MuYWRkKHduZFsoLXogLSAxKSA+PiAxXS5uZWcoKSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBwLnR5cGUgPT09ICdhZmZpbmUnID8gYWNjLnRvUCgpIDogYWNjO1xufTtcblxuQmFzZUN1cnZlLnByb3RvdHlwZS5fd25hZk11bEFkZCA9IGZ1bmN0aW9uIF93bmFmTXVsQWRkKGRlZlcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvZWZmcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgamFjb2JpYW5SZXN1bHQpIHtcbiAgdmFyIHduZFdpZHRoID0gdGhpcy5fd25hZlQxO1xuICB2YXIgd25kID0gdGhpcy5fd25hZlQyO1xuICB2YXIgbmFmID0gdGhpcy5fd25hZlQzO1xuXG4gIC8vIEZpbGwgYWxsIGFycmF5c1xuICB2YXIgbWF4ID0gMDtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgIHZhciBwID0gcG9pbnRzW2ldO1xuICAgIHZhciBuYWZQb2ludHMgPSBwLl9nZXROQUZQb2ludHMoZGVmVyk7XG4gICAgd25kV2lkdGhbaV0gPSBuYWZQb2ludHMud25kO1xuICAgIHduZFtpXSA9IG5hZlBvaW50cy5wb2ludHM7XG4gIH1cblxuICAvLyBDb21iIHNtYWxsIHdpbmRvdyBOQUZzXG4gIGZvciAodmFyIGkgPSBsZW4gLSAxOyBpID49IDE7IGkgLT0gMikge1xuICAgIHZhciBhID0gaSAtIDE7XG4gICAgdmFyIGIgPSBpO1xuICAgIGlmICh3bmRXaWR0aFthXSAhPT0gMSB8fCB3bmRXaWR0aFtiXSAhPT0gMSkge1xuICAgICAgbmFmW2FdID0gZ2V0TkFGKGNvZWZmc1thXSwgd25kV2lkdGhbYV0pO1xuICAgICAgbmFmW2JdID0gZ2V0TkFGKGNvZWZmc1tiXSwgd25kV2lkdGhbYl0pO1xuICAgICAgbWF4ID0gTWF0aC5tYXgobmFmW2FdLmxlbmd0aCwgbWF4KTtcbiAgICAgIG1heCA9IE1hdGgubWF4KG5hZltiXS5sZW5ndGgsIG1heCk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICB2YXIgY29tYiA9IFtcbiAgICAgIHBvaW50c1thXSwgLyogMSAqL1xuICAgICAgbnVsbCwgLyogMyAqL1xuICAgICAgbnVsbCwgLyogNSAqL1xuICAgICAgcG9pbnRzW2JdIC8qIDcgKi9cbiAgICBdO1xuXG4gICAgLy8gVHJ5IHRvIGF2b2lkIFByb2plY3RpdmUgcG9pbnRzLCBpZiBwb3NzaWJsZVxuICAgIGlmIChwb2ludHNbYV0ueS5jbXAocG9pbnRzW2JdLnkpID09PSAwKSB7XG4gICAgICBjb21iWzFdID0gcG9pbnRzW2FdLmFkZChwb2ludHNbYl0pO1xuICAgICAgY29tYlsyXSA9IHBvaW50c1thXS50b0ooKS5taXhlZEFkZChwb2ludHNbYl0ubmVnKCkpO1xuICAgIH0gZWxzZSBpZiAocG9pbnRzW2FdLnkuY21wKHBvaW50c1tiXS55LnJlZE5lZygpKSA9PT0gMCkge1xuICAgICAgY29tYlsxXSA9IHBvaW50c1thXS50b0ooKS5taXhlZEFkZChwb2ludHNbYl0pO1xuICAgICAgY29tYlsyXSA9IHBvaW50c1thXS5hZGQocG9pbnRzW2JdLm5lZygpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29tYlsxXSA9IHBvaW50c1thXS50b0ooKS5taXhlZEFkZChwb2ludHNbYl0pO1xuICAgICAgY29tYlsyXSA9IHBvaW50c1thXS50b0ooKS5taXhlZEFkZChwb2ludHNbYl0ubmVnKCkpO1xuICAgIH1cblxuICAgIHZhciBpbmRleCA9IFtcbiAgICAgIC0zLCAvKiAtMSAtMSAqL1xuICAgICAgLTEsIC8qIC0xIDAgKi9cbiAgICAgIC01LCAvKiAtMSAxICovXG4gICAgICAtNywgLyogMCAtMSAqL1xuICAgICAgMCwgLyogMCAwICovXG4gICAgICA3LCAvKiAwIDEgKi9cbiAgICAgIDUsIC8qIDEgLTEgKi9cbiAgICAgIDEsIC8qIDEgMCAqL1xuICAgICAgMyAgLyogMSAxICovXG4gICAgXTtcblxuICAgIHZhciBqc2YgPSBnZXRKU0YoY29lZmZzW2FdLCBjb2VmZnNbYl0pO1xuICAgIG1heCA9IE1hdGgubWF4KGpzZlswXS5sZW5ndGgsIG1heCk7XG4gICAgbmFmW2FdID0gbmV3IEFycmF5KG1heCk7XG4gICAgbmFmW2JdID0gbmV3IEFycmF5KG1heCk7XG4gICAgZm9yICh2YXIgaiA9IDA7IGogPCBtYXg7IGorKykge1xuICAgICAgdmFyIGphID0ganNmWzBdW2pdIHwgMDtcbiAgICAgIHZhciBqYiA9IGpzZlsxXVtqXSB8IDA7XG5cbiAgICAgIG5hZlthXVtqXSA9IGluZGV4WyhqYSArIDEpICogMyArIChqYiArIDEpXTtcbiAgICAgIG5hZltiXVtqXSA9IDA7XG4gICAgICB3bmRbYV0gPSBjb21iO1xuICAgIH1cbiAgfVxuXG4gIHZhciBhY2MgPSB0aGlzLmpwb2ludChudWxsLCBudWxsLCBudWxsKTtcbiAgdmFyIHRtcCA9IHRoaXMuX3duYWZUNDtcbiAgZm9yICh2YXIgaSA9IG1heDsgaSA+PSAwOyBpLS0pIHtcbiAgICB2YXIgayA9IDA7XG5cbiAgICB3aGlsZSAoaSA+PSAwKSB7XG4gICAgICB2YXIgemVybyA9IHRydWU7XG4gICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICAgIHRtcFtqXSA9IG5hZltqXVtpXSB8IDA7XG4gICAgICAgIGlmICh0bXBbal0gIT09IDApXG4gICAgICAgICAgemVybyA9IGZhbHNlO1xuICAgICAgfVxuICAgICAgaWYgKCF6ZXJvKVxuICAgICAgICBicmVhaztcbiAgICAgIGsrKztcbiAgICAgIGktLTtcbiAgICB9XG4gICAgaWYgKGkgPj0gMClcbiAgICAgIGsrKztcbiAgICBhY2MgPSBhY2MuZGJscChrKTtcbiAgICBpZiAoaSA8IDApXG4gICAgICBicmVhaztcblxuICAgIGZvciAodmFyIGogPSAwOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgIHZhciB6ID0gdG1wW2pdO1xuICAgICAgdmFyIHA7XG4gICAgICBpZiAoeiA9PT0gMClcbiAgICAgICAgY29udGludWU7XG4gICAgICBlbHNlIGlmICh6ID4gMClcbiAgICAgICAgcCA9IHduZFtqXVsoeiAtIDEpID4+IDFdO1xuICAgICAgZWxzZSBpZiAoeiA8IDApXG4gICAgICAgIHAgPSB3bmRbal1bKC16IC0gMSkgPj4gMV0ubmVnKCk7XG5cbiAgICAgIGlmIChwLnR5cGUgPT09ICdhZmZpbmUnKVxuICAgICAgICBhY2MgPSBhY2MubWl4ZWRBZGQocCk7XG4gICAgICBlbHNlXG4gICAgICAgIGFjYyA9IGFjYy5hZGQocCk7XG4gICAgfVxuICB9XG4gIC8vIFplcm9pZnkgcmVmZXJlbmNlc1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKVxuICAgIHduZFtpXSA9IG51bGw7XG5cbiAgaWYgKGphY29iaWFuUmVzdWx0KVxuICAgIHJldHVybiBhY2M7XG4gIGVsc2VcbiAgICByZXR1cm4gYWNjLnRvUCgpO1xufTtcblxuZnVuY3Rpb24gQmFzZVBvaW50KGN1cnZlLCB0eXBlKSB7XG4gIHRoaXMuY3VydmUgPSBjdXJ2ZTtcbiAgdGhpcy50eXBlID0gdHlwZTtcbiAgdGhpcy5wcmVjb21wdXRlZCA9IG51bGw7XG59XG5CYXNlQ3VydmUuQmFzZVBvaW50ID0gQmFzZVBvaW50O1xuXG5CYXNlUG9pbnQucHJvdG90eXBlLmVxID0gZnVuY3Rpb24gZXEoLypvdGhlciovKSB7XG4gIHRocm93IG5ldyBFcnJvcignTm90IGltcGxlbWVudGVkJyk7XG59O1xuXG5CYXNlUG9pbnQucHJvdG90eXBlLnZhbGlkYXRlID0gZnVuY3Rpb24gdmFsaWRhdGUoKSB7XG4gIHJldHVybiB0aGlzLmN1cnZlLnZhbGlkYXRlKHRoaXMpO1xufTtcblxuQmFzZUN1cnZlLnByb3RvdHlwZS5kZWNvZGVQb2ludCA9IGZ1bmN0aW9uIGRlY29kZVBvaW50KGJ5dGVzLCBlbmMpIHtcbiAgYnl0ZXMgPSB1dGlscy50b0FycmF5KGJ5dGVzLCBlbmMpO1xuXG4gIHZhciBsZW4gPSB0aGlzLnAuYnl0ZUxlbmd0aCgpO1xuXG4gIC8vIHVuY29tcHJlc3NlZCwgaHlicmlkLW9kZCwgaHlicmlkLWV2ZW5cbiAgaWYgKChieXRlc1swXSA9PT0gMHgwNCB8fCBieXRlc1swXSA9PT0gMHgwNiB8fCBieXRlc1swXSA9PT0gMHgwNykgJiZcbiAgICAgIGJ5dGVzLmxlbmd0aCAtIDEgPT09IDIgKiBsZW4pIHtcbiAgICBpZiAoYnl0ZXNbMF0gPT09IDB4MDYpXG4gICAgICBhc3NlcnQoYnl0ZXNbYnl0ZXMubGVuZ3RoIC0gMV0gJSAyID09PSAwKTtcbiAgICBlbHNlIGlmIChieXRlc1swXSA9PT0gMHgwNylcbiAgICAgIGFzc2VydChieXRlc1tieXRlcy5sZW5ndGggLSAxXSAlIDIgPT09IDEpO1xuXG4gICAgdmFyIHJlcyA9ICB0aGlzLnBvaW50KGJ5dGVzLnNsaWNlKDEsIDEgKyBsZW4pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBieXRlcy5zbGljZSgxICsgbGVuLCAxICsgMiAqIGxlbikpO1xuXG4gICAgcmV0dXJuIHJlcztcbiAgfSBlbHNlIGlmICgoYnl0ZXNbMF0gPT09IDB4MDIgfHwgYnl0ZXNbMF0gPT09IDB4MDMpICYmXG4gICAgICAgICAgICAgIGJ5dGVzLmxlbmd0aCAtIDEgPT09IGxlbikge1xuICAgIHJldHVybiB0aGlzLnBvaW50RnJvbVgoYnl0ZXMuc2xpY2UoMSwgMSArIGxlbiksIGJ5dGVzWzBdID09PSAweDAzKTtcbiAgfVxuICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gcG9pbnQgZm9ybWF0Jyk7XG59O1xuXG5CYXNlUG9pbnQucHJvdG90eXBlLmVuY29kZUNvbXByZXNzZWQgPSBmdW5jdGlvbiBlbmNvZGVDb21wcmVzc2VkKGVuYykge1xuICByZXR1cm4gdGhpcy5lbmNvZGUoZW5jLCB0cnVlKTtcbn07XG5cbkJhc2VQb2ludC5wcm90b3R5cGUuX2VuY29kZSA9IGZ1bmN0aW9uIF9lbmNvZGUoY29tcGFjdCkge1xuICB2YXIgbGVuID0gdGhpcy5jdXJ2ZS5wLmJ5dGVMZW5ndGgoKTtcbiAgdmFyIHggPSB0aGlzLmdldFgoKS50b0FycmF5KCdiZScsIGxlbik7XG5cbiAgaWYgKGNvbXBhY3QpXG4gICAgcmV0dXJuIFsgdGhpcy5nZXRZKCkuaXNFdmVuKCkgPyAweDAyIDogMHgwMyBdLmNvbmNhdCh4KTtcblxuICByZXR1cm4gWyAweDA0IF0uY29uY2F0KHgsIHRoaXMuZ2V0WSgpLnRvQXJyYXkoJ2JlJywgbGVuKSkgO1xufTtcblxuQmFzZVBvaW50LnByb3RvdHlwZS5lbmNvZGUgPSBmdW5jdGlvbiBlbmNvZGUoZW5jLCBjb21wYWN0KSB7XG4gIHJldHVybiB1dGlscy5lbmNvZGUodGhpcy5fZW5jb2RlKGNvbXBhY3QpLCBlbmMpO1xufTtcblxuQmFzZVBvaW50LnByb3RvdHlwZS5wcmVjb21wdXRlID0gZnVuY3Rpb24gcHJlY29tcHV0ZShwb3dlcikge1xuICBpZiAodGhpcy5wcmVjb21wdXRlZClcbiAgICByZXR1cm4gdGhpcztcblxuICB2YXIgcHJlY29tcHV0ZWQgPSB7XG4gICAgZG91YmxlczogbnVsbCxcbiAgICBuYWY6IG51bGwsXG4gICAgYmV0YTogbnVsbFxuICB9O1xuICBwcmVjb21wdXRlZC5uYWYgPSB0aGlzLl9nZXROQUZQb2ludHMoOCk7XG4gIHByZWNvbXB1dGVkLmRvdWJsZXMgPSB0aGlzLl9nZXREb3VibGVzKDQsIHBvd2VyKTtcbiAgcHJlY29tcHV0ZWQuYmV0YSA9IHRoaXMuX2dldEJldGEoKTtcbiAgdGhpcy5wcmVjb21wdXRlZCA9IHByZWNvbXB1dGVkO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuQmFzZVBvaW50LnByb3RvdHlwZS5faGFzRG91YmxlcyA9IGZ1bmN0aW9uIF9oYXNEb3VibGVzKGspIHtcbiAgaWYgKCF0aGlzLnByZWNvbXB1dGVkKVxuICAgIHJldHVybiBmYWxzZTtcblxuICB2YXIgZG91YmxlcyA9IHRoaXMucHJlY29tcHV0ZWQuZG91YmxlcztcbiAgaWYgKCFkb3VibGVzKVxuICAgIHJldHVybiBmYWxzZTtcblxuICByZXR1cm4gZG91Ymxlcy5wb2ludHMubGVuZ3RoID49IE1hdGguY2VpbCgoay5iaXRMZW5ndGgoKSArIDEpIC8gZG91Ymxlcy5zdGVwKTtcbn07XG5cbkJhc2VQb2ludC5wcm90b3R5cGUuX2dldERvdWJsZXMgPSBmdW5jdGlvbiBfZ2V0RG91YmxlcyhzdGVwLCBwb3dlcikge1xuICBpZiAodGhpcy5wcmVjb21wdXRlZCAmJiB0aGlzLnByZWNvbXB1dGVkLmRvdWJsZXMpXG4gICAgcmV0dXJuIHRoaXMucHJlY29tcHV0ZWQuZG91YmxlcztcblxuICB2YXIgZG91YmxlcyA9IFsgdGhpcyBdO1xuICB2YXIgYWNjID0gdGhpcztcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBwb3dlcjsgaSArPSBzdGVwKSB7XG4gICAgZm9yICh2YXIgaiA9IDA7IGogPCBzdGVwOyBqKyspXG4gICAgICBhY2MgPSBhY2MuZGJsKCk7XG4gICAgZG91Ymxlcy5wdXNoKGFjYyk7XG4gIH1cbiAgcmV0dXJuIHtcbiAgICBzdGVwOiBzdGVwLFxuICAgIHBvaW50czogZG91Ymxlc1xuICB9O1xufTtcblxuQmFzZVBvaW50LnByb3RvdHlwZS5fZ2V0TkFGUG9pbnRzID0gZnVuY3Rpb24gX2dldE5BRlBvaW50cyh3bmQpIHtcbiAgaWYgKHRoaXMucHJlY29tcHV0ZWQgJiYgdGhpcy5wcmVjb21wdXRlZC5uYWYpXG4gICAgcmV0dXJuIHRoaXMucHJlY29tcHV0ZWQubmFmO1xuXG4gIHZhciByZXMgPSBbIHRoaXMgXTtcbiAgdmFyIG1heCA9ICgxIDw8IHduZCkgLSAxO1xuICB2YXIgZGJsID0gbWF4ID09PSAxID8gbnVsbCA6IHRoaXMuZGJsKCk7XG4gIGZvciAodmFyIGkgPSAxOyBpIDwgbWF4OyBpKyspXG4gICAgcmVzW2ldID0gcmVzW2kgLSAxXS5hZGQoZGJsKTtcbiAgcmV0dXJuIHtcbiAgICB3bmQ6IHduZCxcbiAgICBwb2ludHM6IHJlc1xuICB9O1xufTtcblxuQmFzZVBvaW50LnByb3RvdHlwZS5fZ2V0QmV0YSA9IGZ1bmN0aW9uIF9nZXRCZXRhKCkge1xuICByZXR1cm4gbnVsbDtcbn07XG5cbkJhc2VQb2ludC5wcm90b3R5cGUuZGJscCA9IGZ1bmN0aW9uIGRibHAoaykge1xuICB2YXIgciA9IHRoaXM7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgazsgaSsrKVxuICAgIHIgPSByLmRibCgpO1xuICByZXR1cm4gcjtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IGV4cG9ydHM7XG52YXIgQk4gPSByZXF1aXJlKCdibi5qcycpO1xudmFyIG1pbkFzc2VydCA9IHJlcXVpcmUoJ21pbmltYWxpc3RpYy1hc3NlcnQnKTtcbnZhciBtaW5VdGlscyA9IHJlcXVpcmUoJ21pbmltYWxpc3RpYy1jcnlwdG8tdXRpbHMnKTtcblxudXRpbHMuYXNzZXJ0ID0gbWluQXNzZXJ0O1xudXRpbHMudG9BcnJheSA9IG1pblV0aWxzLnRvQXJyYXk7XG51dGlscy56ZXJvMiA9IG1pblV0aWxzLnplcm8yO1xudXRpbHMudG9IZXggPSBtaW5VdGlscy50b0hleDtcbnV0aWxzLmVuY29kZSA9IG1pblV0aWxzLmVuY29kZTtcblxuLy8gUmVwcmVzZW50IG51bSBpbiBhIHctTkFGIGZvcm1cbmZ1bmN0aW9uIGdldE5BRihudW0sIHcpIHtcbiAgdmFyIG5hZiA9IFtdO1xuICB2YXIgd3MgPSAxIDw8ICh3ICsgMSk7XG4gIHZhciBrID0gbnVtLmNsb25lKCk7XG4gIHdoaWxlIChrLmNtcG4oMSkgPj0gMCkge1xuICAgIHZhciB6O1xuICAgIGlmIChrLmlzT2RkKCkpIHtcbiAgICAgIHZhciBtb2QgPSBrLmFuZGxuKHdzIC0gMSk7XG4gICAgICBpZiAobW9kID4gKHdzID4+IDEpIC0gMSlcbiAgICAgICAgeiA9ICh3cyA+PiAxKSAtIG1vZDtcbiAgICAgIGVsc2VcbiAgICAgICAgeiA9IG1vZDtcbiAgICAgIGsuaXN1Ym4oeik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHogPSAwO1xuICAgIH1cbiAgICBuYWYucHVzaCh6KTtcblxuICAgIC8vIE9wdGltaXphdGlvbiwgc2hpZnQgYnkgd29yZCBpZiBwb3NzaWJsZVxuICAgIHZhciBzaGlmdCA9IChrLmNtcG4oMCkgIT09IDAgJiYgay5hbmRsbih3cyAtIDEpID09PSAwKSA/ICh3ICsgMSkgOiAxO1xuICAgIGZvciAodmFyIGkgPSAxOyBpIDwgc2hpZnQ7IGkrKylcbiAgICAgIG5hZi5wdXNoKDApO1xuICAgIGsuaXVzaHJuKHNoaWZ0KTtcbiAgfVxuXG4gIHJldHVybiBuYWY7XG59XG51dGlscy5nZXROQUYgPSBnZXROQUY7XG5cbi8vIFJlcHJlc2VudCBrMSwgazIgaW4gYSBKb2ludCBTcGFyc2UgRm9ybVxuZnVuY3Rpb24gZ2V0SlNGKGsxLCBrMikge1xuICB2YXIganNmID0gW1xuICAgIFtdLFxuICAgIFtdXG4gIF07XG5cbiAgazEgPSBrMS5jbG9uZSgpO1xuICBrMiA9IGsyLmNsb25lKCk7XG4gIHZhciBkMSA9IDA7XG4gIHZhciBkMiA9IDA7XG4gIHdoaWxlIChrMS5jbXBuKC1kMSkgPiAwIHx8IGsyLmNtcG4oLWQyKSA+IDApIHtcblxuICAgIC8vIEZpcnN0IHBoYXNlXG4gICAgdmFyIG0xNCA9IChrMS5hbmRsbigzKSArIGQxKSAmIDM7XG4gICAgdmFyIG0yNCA9IChrMi5hbmRsbigzKSArIGQyKSAmIDM7XG4gICAgaWYgKG0xNCA9PT0gMylcbiAgICAgIG0xNCA9IC0xO1xuICAgIGlmIChtMjQgPT09IDMpXG4gICAgICBtMjQgPSAtMTtcbiAgICB2YXIgdTE7XG4gICAgaWYgKChtMTQgJiAxKSA9PT0gMCkge1xuICAgICAgdTEgPSAwO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgbTggPSAoazEuYW5kbG4oNykgKyBkMSkgJiA3O1xuICAgICAgaWYgKChtOCA9PT0gMyB8fCBtOCA9PT0gNSkgJiYgbTI0ID09PSAyKVxuICAgICAgICB1MSA9IC1tMTQ7XG4gICAgICBlbHNlXG4gICAgICAgIHUxID0gbTE0O1xuICAgIH1cbiAgICBqc2ZbMF0ucHVzaCh1MSk7XG5cbiAgICB2YXIgdTI7XG4gICAgaWYgKChtMjQgJiAxKSA9PT0gMCkge1xuICAgICAgdTIgPSAwO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgbTggPSAoazIuYW5kbG4oNykgKyBkMikgJiA3O1xuICAgICAgaWYgKChtOCA9PT0gMyB8fCBtOCA9PT0gNSkgJiYgbTE0ID09PSAyKVxuICAgICAgICB1MiA9IC1tMjQ7XG4gICAgICBlbHNlXG4gICAgICAgIHUyID0gbTI0O1xuICAgIH1cbiAgICBqc2ZbMV0ucHVzaCh1Mik7XG5cbiAgICAvLyBTZWNvbmQgcGhhc2VcbiAgICBpZiAoMiAqIGQxID09PSB1MSArIDEpXG4gICAgICBkMSA9IDEgLSBkMTtcbiAgICBpZiAoMiAqIGQyID09PSB1MiArIDEpXG4gICAgICBkMiA9IDEgLSBkMjtcbiAgICBrMS5pdXNocm4oMSk7XG4gICAgazIuaXVzaHJuKDEpO1xuICB9XG5cbiAgcmV0dXJuIGpzZjtcbn1cbnV0aWxzLmdldEpTRiA9IGdldEpTRjtcblxuZnVuY3Rpb24gY2FjaGVkUHJvcGVydHkob2JqLCBuYW1lLCBjb21wdXRlcikge1xuICB2YXIga2V5ID0gJ18nICsgbmFtZTtcbiAgb2JqLnByb3RvdHlwZVtuYW1lXSA9IGZ1bmN0aW9uIGNhY2hlZFByb3BlcnR5KCkge1xuICAgIHJldHVybiB0aGlzW2tleV0gIT09IHVuZGVmaW5lZCA/IHRoaXNba2V5XSA6XG4gICAgICAgICAgIHRoaXNba2V5XSA9IGNvbXB1dGVyLmNhbGwodGhpcyk7XG4gIH07XG59XG51dGlscy5jYWNoZWRQcm9wZXJ0eSA9IGNhY2hlZFByb3BlcnR5O1xuXG5mdW5jdGlvbiBwYXJzZUJ5dGVzKGJ5dGVzKSB7XG4gIHJldHVybiB0eXBlb2YgYnl0ZXMgPT09ICdzdHJpbmcnID8gdXRpbHMudG9BcnJheShieXRlcywgJ2hleCcpIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBieXRlcztcbn1cbnV0aWxzLnBhcnNlQnl0ZXMgPSBwYXJzZUJ5dGVzO1xuXG5mdW5jdGlvbiBpbnRGcm9tTEUoYnl0ZXMpIHtcbiAgcmV0dXJuIG5ldyBCTihieXRlcywgJ2hleCcsICdsZScpO1xufVxudXRpbHMuaW50RnJvbUxFID0gaW50RnJvbUxFO1xuXG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBjdXJ2ZXMgPSBleHBvcnRzO1xuXG52YXIgaGFzaCA9IHJlcXVpcmUoJ2hhc2guanMnKTtcbnZhciBlbGxpcHRpYyA9IHJlcXVpcmUoJy4uL2VsbGlwdGljJyk7XG5cbnZhciBhc3NlcnQgPSBlbGxpcHRpYy51dGlscy5hc3NlcnQ7XG5cbmZ1bmN0aW9uIFByZXNldEN1cnZlKG9wdGlvbnMpIHtcbiAgaWYgKG9wdGlvbnMudHlwZSA9PT0gJ3Nob3J0JylcbiAgICB0aGlzLmN1cnZlID0gbmV3IGVsbGlwdGljLmN1cnZlLnNob3J0KG9wdGlvbnMpO1xuICBlbHNlIGlmIChvcHRpb25zLnR5cGUgPT09ICdlZHdhcmRzJylcbiAgICB0aGlzLmN1cnZlID0gbmV3IGVsbGlwdGljLmN1cnZlLmVkd2FyZHMob3B0aW9ucyk7XG4gIGVsc2VcbiAgICB0aGlzLmN1cnZlID0gbmV3IGVsbGlwdGljLmN1cnZlLm1vbnQob3B0aW9ucyk7XG4gIHRoaXMuZyA9IHRoaXMuY3VydmUuZztcbiAgdGhpcy5uID0gdGhpcy5jdXJ2ZS5uO1xuICB0aGlzLmhhc2ggPSBvcHRpb25zLmhhc2g7XG5cbiAgYXNzZXJ0KHRoaXMuZy52YWxpZGF0ZSgpLCAnSW52YWxpZCBjdXJ2ZScpO1xuICBhc3NlcnQodGhpcy5nLm11bCh0aGlzLm4pLmlzSW5maW5pdHkoKSwgJ0ludmFsaWQgY3VydmUsIEcqTiAhPSBPJyk7XG59XG5jdXJ2ZXMuUHJlc2V0Q3VydmUgPSBQcmVzZXRDdXJ2ZTtcblxuZnVuY3Rpb24gZGVmaW5lQ3VydmUobmFtZSwgb3B0aW9ucykge1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoY3VydmVzLCBuYW1lLCB7XG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBjdXJ2ZSA9IG5ldyBQcmVzZXRDdXJ2ZShvcHRpb25zKTtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjdXJ2ZXMsIG5hbWUsIHtcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICB2YWx1ZTogY3VydmVcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGN1cnZlO1xuICAgIH1cbiAgfSk7XG59XG5cbmRlZmluZUN1cnZlKCdwMTkyJywge1xuICB0eXBlOiAnc2hvcnQnLFxuICBwcmltZTogJ3AxOTInLFxuICBwOiAnZmZmZmZmZmYgZmZmZmZmZmYgZmZmZmZmZmYgZmZmZmZmZmUgZmZmZmZmZmYgZmZmZmZmZmYnLFxuICBhOiAnZmZmZmZmZmYgZmZmZmZmZmYgZmZmZmZmZmYgZmZmZmZmZmUgZmZmZmZmZmYgZmZmZmZmZmMnLFxuICBiOiAnNjQyMTA1MTkgZTU5YzgwZTcgMGZhN2U5YWIgNzIyNDMwNDkgZmViOGRlZWMgYzE0NmI5YjEnLFxuICBuOiAnZmZmZmZmZmYgZmZmZmZmZmYgZmZmZmZmZmYgOTlkZWY4MzYgMTQ2YmM5YjEgYjRkMjI4MzEnLFxuICBoYXNoOiBoYXNoLnNoYTI1NixcbiAgZ1JlZDogZmFsc2UsXG4gIGc6IFtcbiAgICAnMTg4ZGE4MGUgYjAzMDkwZjYgN2NiZjIwZWIgNDNhMTg4MDAgZjRmZjBhZmQgODJmZjEwMTInLFxuICAgICcwNzE5MmI5NSBmZmM4ZGE3OCA2MzEwMTFlZCA2YjI0Y2RkNSA3M2Y5NzdhMSAxZTc5NDgxMSdcbiAgXVxufSk7XG5cbmRlZmluZUN1cnZlKCdwMjI0Jywge1xuICB0eXBlOiAnc2hvcnQnLFxuICBwcmltZTogJ3AyMjQnLFxuICBwOiAnZmZmZmZmZmYgZmZmZmZmZmYgZmZmZmZmZmYgZmZmZmZmZmYgMDAwMDAwMDAgMDAwMDAwMDAgMDAwMDAwMDEnLFxuICBhOiAnZmZmZmZmZmYgZmZmZmZmZmYgZmZmZmZmZmYgZmZmZmZmZmUgZmZmZmZmZmYgZmZmZmZmZmYgZmZmZmZmZmUnLFxuICBiOiAnYjQwNTBhODUgMGMwNGIzYWIgZjU0MTMyNTYgNTA0NGIwYjcgZDdiZmQ4YmEgMjcwYjM5NDMgMjM1NWZmYjQnLFxuICBuOiAnZmZmZmZmZmYgZmZmZmZmZmYgZmZmZmZmZmYgZmZmZjE2YTIgZTBiOGYwM2UgMTNkZDI5NDUgNWM1YzJhM2QnLFxuICBoYXNoOiBoYXNoLnNoYTI1NixcbiAgZ1JlZDogZmFsc2UsXG4gIGc6IFtcbiAgICAnYjcwZTBjYmQgNmJiNGJmN2YgMzIxMzkwYjkgNGEwM2MxZDMgNTZjMjExMjIgMzQzMjgwZDYgMTE1YzFkMjEnLFxuICAgICdiZDM3NjM4OCBiNWY3MjNmYiA0YzIyZGZlNiBjZDQzNzVhMCA1YTA3NDc2NCA0NGQ1ODE5OSA4NTAwN2UzNCdcbiAgXVxufSk7XG5cbmRlZmluZUN1cnZlKCdwMjU2Jywge1xuICB0eXBlOiAnc2hvcnQnLFxuICBwcmltZTogbnVsbCxcbiAgcDogJ2ZmZmZmZmZmIDAwMDAwMDAxIDAwMDAwMDAwIDAwMDAwMDAwIDAwMDAwMDAwIGZmZmZmZmZmIGZmZmZmZmZmIGZmZmZmZmZmJyxcbiAgYTogJ2ZmZmZmZmZmIDAwMDAwMDAxIDAwMDAwMDAwIDAwMDAwMDAwIDAwMDAwMDAwIGZmZmZmZmZmIGZmZmZmZmZmIGZmZmZmZmZjJyxcbiAgYjogJzVhYzYzNWQ4IGFhM2E5M2U3IGIzZWJiZDU1IDc2OTg4NmJjIDY1MWQwNmIwIGNjNTNiMGY2IDNiY2UzYzNlIDI3ZDI2MDRiJyxcbiAgbjogJ2ZmZmZmZmZmIDAwMDAwMDAwIGZmZmZmZmZmIGZmZmZmZmZmIGJjZTZmYWFkIGE3MTc5ZTg0IGYzYjljYWMyIGZjNjMyNTUxJyxcbiAgaGFzaDogaGFzaC5zaGEyNTYsXG4gIGdSZWQ6IGZhbHNlLFxuICBnOiBbXG4gICAgJzZiMTdkMWYyIGUxMmM0MjQ3IGY4YmNlNmU1IDYzYTQ0MGYyIDc3MDM3ZDgxIDJkZWIzM2EwIGY0YTEzOTQ1IGQ4OThjMjk2JyxcbiAgICAnNGZlMzQyZTIgZmUxYTdmOWIgOGVlN2ViNGEgN2MwZjllMTYgMmJjZTMzNTcgNmIzMTVlY2UgY2JiNjQwNjggMzdiZjUxZjUnXG4gIF1cbn0pO1xuXG5kZWZpbmVDdXJ2ZSgncDM4NCcsIHtcbiAgdHlwZTogJ3Nob3J0JyxcbiAgcHJpbWU6IG51bGwsXG4gIHA6ICdmZmZmZmZmZiBmZmZmZmZmZiBmZmZmZmZmZiBmZmZmZmZmZiBmZmZmZmZmZiBmZmZmZmZmZiBmZmZmZmZmZiAnICtcbiAgICAgJ2ZmZmZmZmZlIGZmZmZmZmZmIDAwMDAwMDAwIDAwMDAwMDAwIGZmZmZmZmZmJyxcbiAgYTogJ2ZmZmZmZmZmIGZmZmZmZmZmIGZmZmZmZmZmIGZmZmZmZmZmIGZmZmZmZmZmIGZmZmZmZmZmIGZmZmZmZmZmICcgK1xuICAgICAnZmZmZmZmZmUgZmZmZmZmZmYgMDAwMDAwMDAgMDAwMDAwMDAgZmZmZmZmZmMnLFxuICBiOiAnYjMzMTJmYTcgZTIzZWU3ZTQgOTg4ZTA1NmIgZTNmODJkMTkgMTgxZDljNmUgZmU4MTQxMTIgMDMxNDA4OGYgJyArXG4gICAgICc1MDEzODc1YSBjNjU2Mzk4ZCA4YTJlZDE5ZCAyYTg1YzhlZCBkM2VjMmFlZicsXG4gIG46ICdmZmZmZmZmZiBmZmZmZmZmZiBmZmZmZmZmZiBmZmZmZmZmZiBmZmZmZmZmZiBmZmZmZmZmZiBjNzYzNGQ4MSAnICtcbiAgICAgJ2Y0MzcyZGRmIDU4MWEwZGIyIDQ4YjBhNzdhIGVjZWMxOTZhIGNjYzUyOTczJyxcbiAgaGFzaDogaGFzaC5zaGEzODQsXG4gIGdSZWQ6IGZhbHNlLFxuICBnOiBbXG4gICAgJ2FhODdjYTIyIGJlOGIwNTM3IDhlYjFjNzFlIGYzMjBhZDc0IDZlMWQzYjYyIDhiYTc5Yjk4IDU5Zjc0MWUwIDgyNTQyYTM4ICcgK1xuICAgICc1NTAyZjI1ZCBiZjU1Mjk2YyAzYTU0NWUzOCA3Mjc2MGFiNycsXG4gICAgJzM2MTdkZTRhIDk2MjYyYzZmIDVkOWU5OGJmIDkyOTJkYzI5IGY4ZjQxZGJkIDI4OWExNDdjIGU5ZGEzMTEzIGI1ZjBiOGMwICcgK1xuICAgICcwYTYwYjFjZSAxZDdlODE5ZCA3YTQzMWQ3YyA5MGVhMGU1ZidcbiAgXVxufSk7XG5cbmRlZmluZUN1cnZlKCdwNTIxJywge1xuICB0eXBlOiAnc2hvcnQnLFxuICBwcmltZTogbnVsbCxcbiAgcDogJzAwMDAwMWZmIGZmZmZmZmZmIGZmZmZmZmZmIGZmZmZmZmZmIGZmZmZmZmZmIGZmZmZmZmZmICcgK1xuICAgICAnZmZmZmZmZmYgZmZmZmZmZmYgZmZmZmZmZmYgZmZmZmZmZmYgZmZmZmZmZmYgZmZmZmZmZmYgJyArXG4gICAgICdmZmZmZmZmZiBmZmZmZmZmZiBmZmZmZmZmZiBmZmZmZmZmZiBmZmZmZmZmZicsXG4gIGE6ICcwMDAwMDFmZiBmZmZmZmZmZiBmZmZmZmZmZiBmZmZmZmZmZiBmZmZmZmZmZiBmZmZmZmZmZiAnICtcbiAgICAgJ2ZmZmZmZmZmIGZmZmZmZmZmIGZmZmZmZmZmIGZmZmZmZmZmIGZmZmZmZmZmIGZmZmZmZmZmICcgK1xuICAgICAnZmZmZmZmZmYgZmZmZmZmZmYgZmZmZmZmZmYgZmZmZmZmZmYgZmZmZmZmZmMnLFxuICBiOiAnMDAwMDAwNTEgOTUzZWI5NjEgOGUxYzlhMWYgOTI5YTIxYTAgYjY4NTQwZWUgYTJkYTcyNWIgJyArXG4gICAgICc5OWIzMTVmMyBiOGI0ODk5MSA4ZWYxMDllMSA1NjE5Mzk1MSBlYzdlOTM3YiAxNjUyYzBiZCAnICtcbiAgICAgJzNiYjFiZjA3IDM1NzNkZjg4IDNkMmMzNGYxIGVmNDUxZmQ0IDZiNTAzZjAwJyxcbiAgbjogJzAwMDAwMWZmIGZmZmZmZmZmIGZmZmZmZmZmIGZmZmZmZmZmIGZmZmZmZmZmIGZmZmZmZmZmICcgK1xuICAgICAnZmZmZmZmZmYgZmZmZmZmZmYgZmZmZmZmZmEgNTE4Njg3ODMgYmYyZjk2NmIgN2ZjYzAxNDggJyArXG4gICAgICdmNzA5YTVkMCAzYmI1YzliOCA4OTljNDdhZSBiYjZmYjcxZSA5MTM4NjQwOScsXG4gIGhhc2g6IGhhc2guc2hhNTEyLFxuICBnUmVkOiBmYWxzZSxcbiAgZzogW1xuICAgICcwMDAwMDBjNiA4NThlMDZiNyAwNDA0ZTljZCA5ZTNlY2I2NiAyMzk1YjQ0MiA5YzY0ODEzOSAnICtcbiAgICAnMDUzZmI1MjEgZjgyOGFmNjAgNmI0ZDNkYmEgYTE0YjVlNzcgZWZlNzU5MjggZmUxZGMxMjcgJyArXG4gICAgJ2EyZmZhOGRlIDMzNDhiM2MxIDg1NmE0MjliIGY5N2U3ZTMxIGMyZTViZDY2JyxcbiAgICAnMDAwMDAxMTggMzkyOTZhNzggOWEzYmMwMDQgNWM4YTVmYjQgMmM3ZDFiZDkgOThmNTQ0NDkgJyArXG4gICAgJzU3OWI0NDY4IDE3YWZiZDE3IDI3M2U2NjJjIDk3ZWU3Mjk5IDVlZjQyNjQwIGM1NTBiOTAxICcgK1xuICAgICczZmFkMDc2MSAzNTNjNzA4NiBhMjcyYzI0MCA4OGJlOTQ3NiA5ZmQxNjY1MCdcbiAgXVxufSk7XG5cbmRlZmluZUN1cnZlKCdjdXJ2ZTI1NTE5Jywge1xuICB0eXBlOiAnbW9udCcsXG4gIHByaW1lOiAncDI1NTE5JyxcbiAgcDogJzdmZmZmZmZmZmZmZmZmZmYgZmZmZmZmZmZmZmZmZmZmZiBmZmZmZmZmZmZmZmZmZmZmIGZmZmZmZmZmZmZmZmZmZWQnLFxuICBhOiAnNzZkMDYnLFxuICBiOiAnMScsXG4gIG46ICcxMDAwMDAwMDAwMDAwMDAwIDAwMDAwMDAwMDAwMDAwMDAgMTRkZWY5ZGVhMmY3OWNkNiA1ODEyNjMxYTVjZjVkM2VkJyxcbiAgaGFzaDogaGFzaC5zaGEyNTYsXG4gIGdSZWQ6IGZhbHNlLFxuICBnOiBbXG4gICAgJzknXG4gIF1cbn0pO1xuXG5kZWZpbmVDdXJ2ZSgnZWQyNTUxOScsIHtcbiAgdHlwZTogJ2Vkd2FyZHMnLFxuICBwcmltZTogJ3AyNTUxOScsXG4gIHA6ICc3ZmZmZmZmZmZmZmZmZmZmIGZmZmZmZmZmZmZmZmZmZmYgZmZmZmZmZmZmZmZmZmZmZiBmZmZmZmZmZmZmZmZmZmVkJyxcbiAgYTogJy0xJyxcbiAgYzogJzEnLFxuICAvLyAtMTIxNjY1ICogKDEyMTY2Nl4oLTEpKSAobW9kIFApXG4gIGQ6ICc1MjAzNmNlZTJiNmZmZTczIDhjYzc0MDc5Nzc3OWU4OTggMDA3MDBhNGQ0MTQxZDhhYiA3NWViNGRjYTEzNTk3OGEzJyxcbiAgbjogJzEwMDAwMDAwMDAwMDAwMDAgMDAwMDAwMDAwMDAwMDAwMCAxNGRlZjlkZWEyZjc5Y2Q2IDU4MTI2MzFhNWNmNWQzZWQnLFxuICBoYXNoOiBoYXNoLnNoYTI1NixcbiAgZ1JlZDogZmFsc2UsXG4gIGc6IFtcbiAgICAnMjE2OTM2ZDNjZDZlNTNmZWMwYTRlMjMxZmRkNmRjNWM2OTJjYzc2MDk1MjVhN2IyYzk1NjJkNjA4ZjI1ZDUxYScsXG5cbiAgICAvLyA0LzVcbiAgICAnNjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1OCdcbiAgXVxufSk7XG5cbnZhciBwcmU7XG50cnkge1xuICBwcmUgPSByZXF1aXJlKCcuL3ByZWNvbXB1dGVkL3NlY3AyNTZrMScpO1xufSBjYXRjaCAoZSkge1xuICBwcmUgPSB1bmRlZmluZWQ7XG59XG5cbmRlZmluZUN1cnZlKCdzZWNwMjU2azEnLCB7XG4gIHR5cGU6ICdzaG9ydCcsXG4gIHByaW1lOiAnazI1NicsXG4gIHA6ICdmZmZmZmZmZiBmZmZmZmZmZiBmZmZmZmZmZiBmZmZmZmZmZiBmZmZmZmZmZiBmZmZmZmZmZiBmZmZmZmZmZSBmZmZmZmMyZicsXG4gIGE6ICcwJyxcbiAgYjogJzcnLFxuICBuOiAnZmZmZmZmZmYgZmZmZmZmZmYgZmZmZmZmZmYgZmZmZmZmZmUgYmFhZWRjZTYgYWY0OGEwM2IgYmZkMjVlOGMgZDAzNjQxNDEnLFxuICBoOiAnMScsXG4gIGhhc2g6IGhhc2guc2hhMjU2LFxuXG4gIC8vIFByZWNvbXB1dGVkIGVuZG9tb3JwaGlzbVxuICBiZXRhOiAnN2FlOTZhMmI2NTdjMDcxMDZlNjQ0NzllYWMzNDM0ZTk5Y2YwNDk3NTEyZjU4OTk1YzEzOTZjMjg3MTk1MDFlZScsXG4gIGxhbWJkYTogJzUzNjNhZDRjYzA1YzMwZTBhNTI2MWMwMjg4MTI2NDVhMTIyZTIyZWEyMDgxNjY3OGRmMDI5NjdjMWIyM2JkNzInLFxuICBiYXNpczogW1xuICAgIHtcbiAgICAgIGE6ICczMDg2ZDIyMWE3ZDQ2YmNkZTg2YzkwZTQ5Mjg0ZWIxNScsXG4gICAgICBiOiAnLWU0NDM3ZWQ2MDEwZTg4Mjg2ZjU0N2ZhOTBhYmZlNGMzJ1xuICAgIH0sXG4gICAge1xuICAgICAgYTogJzExNGNhNTBmN2E4ZTJmM2Y2NTdjMTEwOGQ5ZDQ0Y2ZkOCcsXG4gICAgICBiOiAnMzA4NmQyMjFhN2Q0NmJjZGU4NmM5MGU0OTI4NGViMTUnXG4gICAgfVxuICBdLFxuXG4gIGdSZWQ6IGZhbHNlLFxuICBnOiBbXG4gICAgJzc5YmU2NjdlZjlkY2JiYWM1NWEwNjI5NWNlODcwYjA3MDI5YmZjZGIyZGNlMjhkOTU5ZjI4MTViMTZmODE3OTgnLFxuICAgICc0ODNhZGE3NzI2YTNjNDY1NWRhNGZiZmMwZTExMDhhOGZkMTdiNDQ4YTY4NTU0MTk5YzQ3ZDA4ZmZiMTBkNGI4JyxcbiAgICBwcmVcbiAgXVxufSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBjdXJ2ZSA9IHJlcXVpcmUoJy4uL2N1cnZlJyk7XG52YXIgZWxsaXB0aWMgPSByZXF1aXJlKCcuLi8uLi9lbGxpcHRpYycpO1xudmFyIEJOID0gcmVxdWlyZSgnYm4uanMnKTtcbnZhciBpbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJyk7XG52YXIgQmFzZSA9IGN1cnZlLmJhc2U7XG5cbnZhciBhc3NlcnQgPSBlbGxpcHRpYy51dGlscy5hc3NlcnQ7XG5cbmZ1bmN0aW9uIFNob3J0Q3VydmUoY29uZikge1xuICBCYXNlLmNhbGwodGhpcywgJ3Nob3J0JywgY29uZik7XG5cbiAgdGhpcy5hID0gbmV3IEJOKGNvbmYuYSwgMTYpLnRvUmVkKHRoaXMucmVkKTtcbiAgdGhpcy5iID0gbmV3IEJOKGNvbmYuYiwgMTYpLnRvUmVkKHRoaXMucmVkKTtcbiAgdGhpcy50aW52ID0gdGhpcy50d28ucmVkSW52bSgpO1xuXG4gIHRoaXMuemVyb0EgPSB0aGlzLmEuZnJvbVJlZCgpLmNtcG4oMCkgPT09IDA7XG4gIHRoaXMudGhyZWVBID0gdGhpcy5hLmZyb21SZWQoKS5zdWIodGhpcy5wKS5jbXBuKC0zKSA9PT0gMDtcblxuICAvLyBJZiB0aGUgY3VydmUgaXMgZW5kb21vcnBoaWMsIHByZWNhbGN1bGF0ZSBiZXRhIGFuZCBsYW1iZGFcbiAgdGhpcy5lbmRvID0gdGhpcy5fZ2V0RW5kb21vcnBoaXNtKGNvbmYpO1xuICB0aGlzLl9lbmRvV25hZlQxID0gbmV3IEFycmF5KDQpO1xuICB0aGlzLl9lbmRvV25hZlQyID0gbmV3IEFycmF5KDQpO1xufVxuaW5oZXJpdHMoU2hvcnRDdXJ2ZSwgQmFzZSk7XG5tb2R1bGUuZXhwb3J0cyA9IFNob3J0Q3VydmU7XG5cblNob3J0Q3VydmUucHJvdG90eXBlLl9nZXRFbmRvbW9ycGhpc20gPSBmdW5jdGlvbiBfZ2V0RW5kb21vcnBoaXNtKGNvbmYpIHtcbiAgLy8gTm8gZWZmaWNpZW50IGVuZG9tb3JwaGlzbVxuICBpZiAoIXRoaXMuemVyb0EgfHwgIXRoaXMuZyB8fCAhdGhpcy5uIHx8IHRoaXMucC5tb2RuKDMpICE9PSAxKVxuICAgIHJldHVybjtcblxuICAvLyBDb21wdXRlIGJldGEgYW5kIGxhbWJkYSwgdGhhdCBsYW1iZGEgKiBQID0gKGJldGEgKiBQeDsgUHkpXG4gIHZhciBiZXRhO1xuICB2YXIgbGFtYmRhO1xuICBpZiAoY29uZi5iZXRhKSB7XG4gICAgYmV0YSA9IG5ldyBCTihjb25mLmJldGEsIDE2KS50b1JlZCh0aGlzLnJlZCk7XG4gIH0gZWxzZSB7XG4gICAgdmFyIGJldGFzID0gdGhpcy5fZ2V0RW5kb1Jvb3RzKHRoaXMucCk7XG4gICAgLy8gQ2hvb3NlIHRoZSBzbWFsbGVzdCBiZXRhXG4gICAgYmV0YSA9IGJldGFzWzBdLmNtcChiZXRhc1sxXSkgPCAwID8gYmV0YXNbMF0gOiBiZXRhc1sxXTtcbiAgICBiZXRhID0gYmV0YS50b1JlZCh0aGlzLnJlZCk7XG4gIH1cbiAgaWYgKGNvbmYubGFtYmRhKSB7XG4gICAgbGFtYmRhID0gbmV3IEJOKGNvbmYubGFtYmRhLCAxNik7XG4gIH0gZWxzZSB7XG4gICAgLy8gQ2hvb3NlIHRoZSBsYW1iZGEgdGhhdCBpcyBtYXRjaGluZyBzZWxlY3RlZCBiZXRhXG4gICAgdmFyIGxhbWJkYXMgPSB0aGlzLl9nZXRFbmRvUm9vdHModGhpcy5uKTtcbiAgICBpZiAodGhpcy5nLm11bChsYW1iZGFzWzBdKS54LmNtcCh0aGlzLmcueC5yZWRNdWwoYmV0YSkpID09PSAwKSB7XG4gICAgICBsYW1iZGEgPSBsYW1iZGFzWzBdO1xuICAgIH0gZWxzZSB7XG4gICAgICBsYW1iZGEgPSBsYW1iZGFzWzFdO1xuICAgICAgYXNzZXJ0KHRoaXMuZy5tdWwobGFtYmRhKS54LmNtcCh0aGlzLmcueC5yZWRNdWwoYmV0YSkpID09PSAwKTtcbiAgICB9XG4gIH1cblxuICAvLyBHZXQgYmFzaXMgdmVjdG9ycywgdXNlZCBmb3IgYmFsYW5jZWQgbGVuZ3RoLXR3byByZXByZXNlbnRhdGlvblxuICB2YXIgYmFzaXM7XG4gIGlmIChjb25mLmJhc2lzKSB7XG4gICAgYmFzaXMgPSBjb25mLmJhc2lzLm1hcChmdW5jdGlvbih2ZWMpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGE6IG5ldyBCTih2ZWMuYSwgMTYpLFxuICAgICAgICBiOiBuZXcgQk4odmVjLmIsIDE2KVxuICAgICAgfTtcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBiYXNpcyA9IHRoaXMuX2dldEVuZG9CYXNpcyhsYW1iZGEpO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBiZXRhOiBiZXRhLFxuICAgIGxhbWJkYTogbGFtYmRhLFxuICAgIGJhc2lzOiBiYXNpc1xuICB9O1xufTtcblxuU2hvcnRDdXJ2ZS5wcm90b3R5cGUuX2dldEVuZG9Sb290cyA9IGZ1bmN0aW9uIF9nZXRFbmRvUm9vdHMobnVtKSB7XG4gIC8vIEZpbmQgcm9vdHMgb2YgZm9yIHheMiArIHggKyAxIGluIEZcbiAgLy8gUm9vdCA9ICgtMSArLSBTcXJ0KC0zKSkgLyAyXG4gIC8vXG4gIHZhciByZWQgPSBudW0gPT09IHRoaXMucCA/IHRoaXMucmVkIDogQk4ubW9udChudW0pO1xuICB2YXIgdGludiA9IG5ldyBCTigyKS50b1JlZChyZWQpLnJlZEludm0oKTtcbiAgdmFyIG50aW52ID0gdGludi5yZWROZWcoKTtcblxuICB2YXIgcyA9IG5ldyBCTigzKS50b1JlZChyZWQpLnJlZE5lZygpLnJlZFNxcnQoKS5yZWRNdWwodGludik7XG5cbiAgdmFyIGwxID0gbnRpbnYucmVkQWRkKHMpLmZyb21SZWQoKTtcbiAgdmFyIGwyID0gbnRpbnYucmVkU3ViKHMpLmZyb21SZWQoKTtcbiAgcmV0dXJuIFsgbDEsIGwyIF07XG59O1xuXG5TaG9ydEN1cnZlLnByb3RvdHlwZS5fZ2V0RW5kb0Jhc2lzID0gZnVuY3Rpb24gX2dldEVuZG9CYXNpcyhsYW1iZGEpIHtcbiAgLy8gYXByeFNxcnQgPj0gc3FydCh0aGlzLm4pXG4gIHZhciBhcHJ4U3FydCA9IHRoaXMubi51c2hybihNYXRoLmZsb29yKHRoaXMubi5iaXRMZW5ndGgoKSAvIDIpKTtcblxuICAvLyAzLjc0XG4gIC8vIFJ1biBFR0NELCB1bnRpbCByKEwgKyAxKSA8IGFwcnhTcXJ0XG4gIHZhciB1ID0gbGFtYmRhO1xuICB2YXIgdiA9IHRoaXMubi5jbG9uZSgpO1xuICB2YXIgeDEgPSBuZXcgQk4oMSk7XG4gIHZhciB5MSA9IG5ldyBCTigwKTtcbiAgdmFyIHgyID0gbmV3IEJOKDApO1xuICB2YXIgeTIgPSBuZXcgQk4oMSk7XG5cbiAgLy8gTk9URTogYWxsIHZlY3RvcnMgYXJlIHJvb3RzIG9mOiBhICsgYiAqIGxhbWJkYSA9IDAgKG1vZCBuKVxuICB2YXIgYTA7XG4gIHZhciBiMDtcbiAgLy8gRmlyc3QgdmVjdG9yXG4gIHZhciBhMTtcbiAgdmFyIGIxO1xuICAvLyBTZWNvbmQgdmVjdG9yXG4gIHZhciBhMjtcbiAgdmFyIGIyO1xuXG4gIHZhciBwcmV2UjtcbiAgdmFyIGkgPSAwO1xuICB2YXIgcjtcbiAgdmFyIHg7XG4gIHdoaWxlICh1LmNtcG4oMCkgIT09IDApIHtcbiAgICB2YXIgcSA9IHYuZGl2KHUpO1xuICAgIHIgPSB2LnN1YihxLm11bCh1KSk7XG4gICAgeCA9IHgyLnN1YihxLm11bCh4MSkpO1xuICAgIHZhciB5ID0geTIuc3ViKHEubXVsKHkxKSk7XG5cbiAgICBpZiAoIWExICYmIHIuY21wKGFwcnhTcXJ0KSA8IDApIHtcbiAgICAgIGEwID0gcHJldlIubmVnKCk7XG4gICAgICBiMCA9IHgxO1xuICAgICAgYTEgPSByLm5lZygpO1xuICAgICAgYjEgPSB4O1xuICAgIH0gZWxzZSBpZiAoYTEgJiYgKytpID09PSAyKSB7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgcHJldlIgPSByO1xuXG4gICAgdiA9IHU7XG4gICAgdSA9IHI7XG4gICAgeDIgPSB4MTtcbiAgICB4MSA9IHg7XG4gICAgeTIgPSB5MTtcbiAgICB5MSA9IHk7XG4gIH1cbiAgYTIgPSByLm5lZygpO1xuICBiMiA9IHg7XG5cbiAgdmFyIGxlbjEgPSBhMS5zcXIoKS5hZGQoYjEuc3FyKCkpO1xuICB2YXIgbGVuMiA9IGEyLnNxcigpLmFkZChiMi5zcXIoKSk7XG4gIGlmIChsZW4yLmNtcChsZW4xKSA+PSAwKSB7XG4gICAgYTIgPSBhMDtcbiAgICBiMiA9IGIwO1xuICB9XG5cbiAgLy8gTm9ybWFsaXplIHNpZ25zXG4gIGlmIChhMS5uZWdhdGl2ZSkge1xuICAgIGExID0gYTEubmVnKCk7XG4gICAgYjEgPSBiMS5uZWcoKTtcbiAgfVxuICBpZiAoYTIubmVnYXRpdmUpIHtcbiAgICBhMiA9IGEyLm5lZygpO1xuICAgIGIyID0gYjIubmVnKCk7XG4gIH1cblxuICByZXR1cm4gW1xuICAgIHsgYTogYTEsIGI6IGIxIH0sXG4gICAgeyBhOiBhMiwgYjogYjIgfVxuICBdO1xufTtcblxuU2hvcnRDdXJ2ZS5wcm90b3R5cGUuX2VuZG9TcGxpdCA9IGZ1bmN0aW9uIF9lbmRvU3BsaXQoaykge1xuICB2YXIgYmFzaXMgPSB0aGlzLmVuZG8uYmFzaXM7XG4gIHZhciB2MSA9IGJhc2lzWzBdO1xuICB2YXIgdjIgPSBiYXNpc1sxXTtcblxuICB2YXIgYzEgPSB2Mi5iLm11bChrKS5kaXZSb3VuZCh0aGlzLm4pO1xuICB2YXIgYzIgPSB2MS5iLm5lZygpLm11bChrKS5kaXZSb3VuZCh0aGlzLm4pO1xuXG4gIHZhciBwMSA9IGMxLm11bCh2MS5hKTtcbiAgdmFyIHAyID0gYzIubXVsKHYyLmEpO1xuICB2YXIgcTEgPSBjMS5tdWwodjEuYik7XG4gIHZhciBxMiA9IGMyLm11bCh2Mi5iKTtcblxuICAvLyBDYWxjdWxhdGUgYW5zd2VyXG4gIHZhciBrMSA9IGsuc3ViKHAxKS5zdWIocDIpO1xuICB2YXIgazIgPSBxMS5hZGQocTIpLm5lZygpO1xuICByZXR1cm4geyBrMTogazEsIGsyOiBrMiB9O1xufTtcblxuU2hvcnRDdXJ2ZS5wcm90b3R5cGUucG9pbnRGcm9tWCA9IGZ1bmN0aW9uIHBvaW50RnJvbVgoeCwgb2RkKSB7XG4gIHggPSBuZXcgQk4oeCwgMTYpO1xuICBpZiAoIXgucmVkKVxuICAgIHggPSB4LnRvUmVkKHRoaXMucmVkKTtcblxuICB2YXIgeTIgPSB4LnJlZFNxcigpLnJlZE11bCh4KS5yZWRJQWRkKHgucmVkTXVsKHRoaXMuYSkpLnJlZElBZGQodGhpcy5iKTtcbiAgdmFyIHkgPSB5Mi5yZWRTcXJ0KCk7XG4gIGlmICh5LnJlZFNxcigpLnJlZFN1Yih5MikuY21wKHRoaXMuemVybykgIT09IDApXG4gICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhbGlkIHBvaW50Jyk7XG5cbiAgLy8gWFhYIElzIHRoZXJlIGFueSB3YXkgdG8gdGVsbCBpZiB0aGUgbnVtYmVyIGlzIG9kZCB3aXRob3V0IGNvbnZlcnRpbmcgaXRcbiAgLy8gdG8gbm9uLXJlZCBmb3JtP1xuICB2YXIgaXNPZGQgPSB5LmZyb21SZWQoKS5pc09kZCgpO1xuICBpZiAob2RkICYmICFpc09kZCB8fCAhb2RkICYmIGlzT2RkKVxuICAgIHkgPSB5LnJlZE5lZygpO1xuXG4gIHJldHVybiB0aGlzLnBvaW50KHgsIHkpO1xufTtcblxuU2hvcnRDdXJ2ZS5wcm90b3R5cGUudmFsaWRhdGUgPSBmdW5jdGlvbiB2YWxpZGF0ZShwb2ludCkge1xuICBpZiAocG9pbnQuaW5mKVxuICAgIHJldHVybiB0cnVlO1xuXG4gIHZhciB4ID0gcG9pbnQueDtcbiAgdmFyIHkgPSBwb2ludC55O1xuXG4gIHZhciBheCA9IHRoaXMuYS5yZWRNdWwoeCk7XG4gIHZhciByaHMgPSB4LnJlZFNxcigpLnJlZE11bCh4KS5yZWRJQWRkKGF4KS5yZWRJQWRkKHRoaXMuYik7XG4gIHJldHVybiB5LnJlZFNxcigpLnJlZElTdWIocmhzKS5jbXBuKDApID09PSAwO1xufTtcblxuU2hvcnRDdXJ2ZS5wcm90b3R5cGUuX2VuZG9XbmFmTXVsQWRkID1cbiAgICBmdW5jdGlvbiBfZW5kb1duYWZNdWxBZGQocG9pbnRzLCBjb2VmZnMsIGphY29iaWFuUmVzdWx0KSB7XG4gIHZhciBucG9pbnRzID0gdGhpcy5fZW5kb1duYWZUMTtcbiAgdmFyIG5jb2VmZnMgPSB0aGlzLl9lbmRvV25hZlQyO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHBvaW50cy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBzcGxpdCA9IHRoaXMuX2VuZG9TcGxpdChjb2VmZnNbaV0pO1xuICAgIHZhciBwID0gcG9pbnRzW2ldO1xuICAgIHZhciBiZXRhID0gcC5fZ2V0QmV0YSgpO1xuXG4gICAgaWYgKHNwbGl0LmsxLm5lZ2F0aXZlKSB7XG4gICAgICBzcGxpdC5rMS5pbmVnKCk7XG4gICAgICBwID0gcC5uZWcodHJ1ZSk7XG4gICAgfVxuICAgIGlmIChzcGxpdC5rMi5uZWdhdGl2ZSkge1xuICAgICAgc3BsaXQuazIuaW5lZygpO1xuICAgICAgYmV0YSA9IGJldGEubmVnKHRydWUpO1xuICAgIH1cblxuICAgIG5wb2ludHNbaSAqIDJdID0gcDtcbiAgICBucG9pbnRzW2kgKiAyICsgMV0gPSBiZXRhO1xuICAgIG5jb2VmZnNbaSAqIDJdID0gc3BsaXQuazE7XG4gICAgbmNvZWZmc1tpICogMiArIDFdID0gc3BsaXQuazI7XG4gIH1cbiAgdmFyIHJlcyA9IHRoaXMuX3duYWZNdWxBZGQoMSwgbnBvaW50cywgbmNvZWZmcywgaSAqIDIsIGphY29iaWFuUmVzdWx0KTtcblxuICAvLyBDbGVhbi11cCByZWZlcmVuY2VzIHRvIHBvaW50cyBhbmQgY29lZmZpY2llbnRzXG4gIGZvciAodmFyIGogPSAwOyBqIDwgaSAqIDI7IGorKykge1xuICAgIG5wb2ludHNbal0gPSBudWxsO1xuICAgIG5jb2VmZnNbal0gPSBudWxsO1xuICB9XG4gIHJldHVybiByZXM7XG59O1xuXG5mdW5jdGlvbiBQb2ludChjdXJ2ZSwgeCwgeSwgaXNSZWQpIHtcbiAgQmFzZS5CYXNlUG9pbnQuY2FsbCh0aGlzLCBjdXJ2ZSwgJ2FmZmluZScpO1xuICBpZiAoeCA9PT0gbnVsbCAmJiB5ID09PSBudWxsKSB7XG4gICAgdGhpcy54ID0gbnVsbDtcbiAgICB0aGlzLnkgPSBudWxsO1xuICAgIHRoaXMuaW5mID0gdHJ1ZTtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLnggPSBuZXcgQk4oeCwgMTYpO1xuICAgIHRoaXMueSA9IG5ldyBCTih5LCAxNik7XG4gICAgLy8gRm9yY2UgcmVkZ29tZXJ5IHJlcHJlc2VudGF0aW9uIHdoZW4gbG9hZGluZyBmcm9tIEpTT05cbiAgICBpZiAoaXNSZWQpIHtcbiAgICAgIHRoaXMueC5mb3JjZVJlZCh0aGlzLmN1cnZlLnJlZCk7XG4gICAgICB0aGlzLnkuZm9yY2VSZWQodGhpcy5jdXJ2ZS5yZWQpO1xuICAgIH1cbiAgICBpZiAoIXRoaXMueC5yZWQpXG4gICAgICB0aGlzLnggPSB0aGlzLngudG9SZWQodGhpcy5jdXJ2ZS5yZWQpO1xuICAgIGlmICghdGhpcy55LnJlZClcbiAgICAgIHRoaXMueSA9IHRoaXMueS50b1JlZCh0aGlzLmN1cnZlLnJlZCk7XG4gICAgdGhpcy5pbmYgPSBmYWxzZTtcbiAgfVxufVxuaW5oZXJpdHMoUG9pbnQsIEJhc2UuQmFzZVBvaW50KTtcblxuU2hvcnRDdXJ2ZS5wcm90b3R5cGUucG9pbnQgPSBmdW5jdGlvbiBwb2ludCh4LCB5LCBpc1JlZCkge1xuICByZXR1cm4gbmV3IFBvaW50KHRoaXMsIHgsIHksIGlzUmVkKTtcbn07XG5cblNob3J0Q3VydmUucHJvdG90eXBlLnBvaW50RnJvbUpTT04gPSBmdW5jdGlvbiBwb2ludEZyb21KU09OKG9iaiwgcmVkKSB7XG4gIHJldHVybiBQb2ludC5mcm9tSlNPTih0aGlzLCBvYmosIHJlZCk7XG59O1xuXG5Qb2ludC5wcm90b3R5cGUuX2dldEJldGEgPSBmdW5jdGlvbiBfZ2V0QmV0YSgpIHtcbiAgaWYgKCF0aGlzLmN1cnZlLmVuZG8pXG4gICAgcmV0dXJuO1xuXG4gIHZhciBwcmUgPSB0aGlzLnByZWNvbXB1dGVkO1xuICBpZiAocHJlICYmIHByZS5iZXRhKVxuICAgIHJldHVybiBwcmUuYmV0YTtcblxuICB2YXIgYmV0YSA9IHRoaXMuY3VydmUucG9pbnQodGhpcy54LnJlZE11bCh0aGlzLmN1cnZlLmVuZG8uYmV0YSksIHRoaXMueSk7XG4gIGlmIChwcmUpIHtcbiAgICB2YXIgY3VydmUgPSB0aGlzLmN1cnZlO1xuICAgIHZhciBlbmRvTXVsID0gZnVuY3Rpb24ocCkge1xuICAgICAgcmV0dXJuIGN1cnZlLnBvaW50KHAueC5yZWRNdWwoY3VydmUuZW5kby5iZXRhKSwgcC55KTtcbiAgICB9O1xuICAgIHByZS5iZXRhID0gYmV0YTtcbiAgICBiZXRhLnByZWNvbXB1dGVkID0ge1xuICAgICAgYmV0YTogbnVsbCxcbiAgICAgIG5hZjogcHJlLm5hZiAmJiB7XG4gICAgICAgIHduZDogcHJlLm5hZi53bmQsXG4gICAgICAgIHBvaW50czogcHJlLm5hZi5wb2ludHMubWFwKGVuZG9NdWwpXG4gICAgICB9LFxuICAgICAgZG91YmxlczogcHJlLmRvdWJsZXMgJiYge1xuICAgICAgICBzdGVwOiBwcmUuZG91Ymxlcy5zdGVwLFxuICAgICAgICBwb2ludHM6IHByZS5kb3VibGVzLnBvaW50cy5tYXAoZW5kb011bClcbiAgICAgIH1cbiAgICB9O1xuICB9XG4gIHJldHVybiBiZXRhO1xufTtcblxuUG9pbnQucHJvdG90eXBlLnRvSlNPTiA9IGZ1bmN0aW9uIHRvSlNPTigpIHtcbiAgaWYgKCF0aGlzLnByZWNvbXB1dGVkKVxuICAgIHJldHVybiBbIHRoaXMueCwgdGhpcy55IF07XG5cbiAgcmV0dXJuIFsgdGhpcy54LCB0aGlzLnksIHRoaXMucHJlY29tcHV0ZWQgJiYge1xuICAgIGRvdWJsZXM6IHRoaXMucHJlY29tcHV0ZWQuZG91YmxlcyAmJiB7XG4gICAgICBzdGVwOiB0aGlzLnByZWNvbXB1dGVkLmRvdWJsZXMuc3RlcCxcbiAgICAgIHBvaW50czogdGhpcy5wcmVjb21wdXRlZC5kb3VibGVzLnBvaW50cy5zbGljZSgxKVxuICAgIH0sXG4gICAgbmFmOiB0aGlzLnByZWNvbXB1dGVkLm5hZiAmJiB7XG4gICAgICB3bmQ6IHRoaXMucHJlY29tcHV0ZWQubmFmLnduZCxcbiAgICAgIHBvaW50czogdGhpcy5wcmVjb21wdXRlZC5uYWYucG9pbnRzLnNsaWNlKDEpXG4gICAgfVxuICB9IF07XG59O1xuXG5Qb2ludC5mcm9tSlNPTiA9IGZ1bmN0aW9uIGZyb21KU09OKGN1cnZlLCBvYmosIHJlZCkge1xuICBpZiAodHlwZW9mIG9iaiA9PT0gJ3N0cmluZycpXG4gICAgb2JqID0gSlNPTi5wYXJzZShvYmopO1xuICB2YXIgcmVzID0gY3VydmUucG9pbnQob2JqWzBdLCBvYmpbMV0sIHJlZCk7XG4gIGlmICghb2JqWzJdKVxuICAgIHJldHVybiByZXM7XG5cbiAgZnVuY3Rpb24gb2JqMnBvaW50KG9iaikge1xuICAgIHJldHVybiBjdXJ2ZS5wb2ludChvYmpbMF0sIG9ialsxXSwgcmVkKTtcbiAgfVxuXG4gIHZhciBwcmUgPSBvYmpbMl07XG4gIHJlcy5wcmVjb21wdXRlZCA9IHtcbiAgICBiZXRhOiBudWxsLFxuICAgIGRvdWJsZXM6IHByZS5kb3VibGVzICYmIHtcbiAgICAgIHN0ZXA6IHByZS5kb3VibGVzLnN0ZXAsXG4gICAgICBwb2ludHM6IFsgcmVzIF0uY29uY2F0KHByZS5kb3VibGVzLnBvaW50cy5tYXAob2JqMnBvaW50KSlcbiAgICB9LFxuICAgIG5hZjogcHJlLm5hZiAmJiB7XG4gICAgICB3bmQ6IHByZS5uYWYud25kLFxuICAgICAgcG9pbnRzOiBbIHJlcyBdLmNvbmNhdChwcmUubmFmLnBvaW50cy5tYXAob2JqMnBvaW50KSlcbiAgICB9XG4gIH07XG4gIHJldHVybiByZXM7XG59O1xuXG5Qb2ludC5wcm90b3R5cGUuaW5zcGVjdCA9IGZ1bmN0aW9uIGluc3BlY3QoKSB7XG4gIGlmICh0aGlzLmlzSW5maW5pdHkoKSlcbiAgICByZXR1cm4gJzxFQyBQb2ludCBJbmZpbml0eT4nO1xuICByZXR1cm4gJzxFQyBQb2ludCB4OiAnICsgdGhpcy54LmZyb21SZWQoKS50b1N0cmluZygxNiwgMikgK1xuICAgICAgJyB5OiAnICsgdGhpcy55LmZyb21SZWQoKS50b1N0cmluZygxNiwgMikgKyAnPic7XG59O1xuXG5Qb2ludC5wcm90b3R5cGUuaXNJbmZpbml0eSA9IGZ1bmN0aW9uIGlzSW5maW5pdHkoKSB7XG4gIHJldHVybiB0aGlzLmluZjtcbn07XG5cblBvaW50LnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiBhZGQocCkge1xuICAvLyBPICsgUCA9IFBcbiAgaWYgKHRoaXMuaW5mKVxuICAgIHJldHVybiBwO1xuXG4gIC8vIFAgKyBPID0gUFxuICBpZiAocC5pbmYpXG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgLy8gUCArIFAgPSAyUFxuICBpZiAodGhpcy5lcShwKSlcbiAgICByZXR1cm4gdGhpcy5kYmwoKTtcblxuICAvLyBQICsgKC1QKSA9IE9cbiAgaWYgKHRoaXMubmVnKCkuZXEocCkpXG4gICAgcmV0dXJuIHRoaXMuY3VydmUucG9pbnQobnVsbCwgbnVsbCk7XG5cbiAgLy8gUCArIFEgPSBPXG4gIGlmICh0aGlzLnguY21wKHAueCkgPT09IDApXG4gICAgcmV0dXJuIHRoaXMuY3VydmUucG9pbnQobnVsbCwgbnVsbCk7XG5cbiAgdmFyIGMgPSB0aGlzLnkucmVkU3ViKHAueSk7XG4gIGlmIChjLmNtcG4oMCkgIT09IDApXG4gICAgYyA9IGMucmVkTXVsKHRoaXMueC5yZWRTdWIocC54KS5yZWRJbnZtKCkpO1xuICB2YXIgbnggPSBjLnJlZFNxcigpLnJlZElTdWIodGhpcy54KS5yZWRJU3ViKHAueCk7XG4gIHZhciBueSA9IGMucmVkTXVsKHRoaXMueC5yZWRTdWIobngpKS5yZWRJU3ViKHRoaXMueSk7XG4gIHJldHVybiB0aGlzLmN1cnZlLnBvaW50KG54LCBueSk7XG59O1xuXG5Qb2ludC5wcm90b3R5cGUuZGJsID0gZnVuY3Rpb24gZGJsKCkge1xuICBpZiAodGhpcy5pbmYpXG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgLy8gMlAgPSBPXG4gIHZhciB5czEgPSB0aGlzLnkucmVkQWRkKHRoaXMueSk7XG4gIGlmICh5czEuY21wbigwKSA9PT0gMClcbiAgICByZXR1cm4gdGhpcy5jdXJ2ZS5wb2ludChudWxsLCBudWxsKTtcblxuICB2YXIgYSA9IHRoaXMuY3VydmUuYTtcblxuICB2YXIgeDIgPSB0aGlzLngucmVkU3FyKCk7XG4gIHZhciBkeWludiA9IHlzMS5yZWRJbnZtKCk7XG4gIHZhciBjID0geDIucmVkQWRkKHgyKS5yZWRJQWRkKHgyKS5yZWRJQWRkKGEpLnJlZE11bChkeWludik7XG5cbiAgdmFyIG54ID0gYy5yZWRTcXIoKS5yZWRJU3ViKHRoaXMueC5yZWRBZGQodGhpcy54KSk7XG4gIHZhciBueSA9IGMucmVkTXVsKHRoaXMueC5yZWRTdWIobngpKS5yZWRJU3ViKHRoaXMueSk7XG4gIHJldHVybiB0aGlzLmN1cnZlLnBvaW50KG54LCBueSk7XG59O1xuXG5Qb2ludC5wcm90b3R5cGUuZ2V0WCA9IGZ1bmN0aW9uIGdldFgoKSB7XG4gIHJldHVybiB0aGlzLnguZnJvbVJlZCgpO1xufTtcblxuUG9pbnQucHJvdG90eXBlLmdldFkgPSBmdW5jdGlvbiBnZXRZKCkge1xuICByZXR1cm4gdGhpcy55LmZyb21SZWQoKTtcbn07XG5cblBvaW50LnByb3RvdHlwZS5tdWwgPSBmdW5jdGlvbiBtdWwoaykge1xuICBrID0gbmV3IEJOKGssIDE2KTtcblxuICBpZiAodGhpcy5faGFzRG91YmxlcyhrKSlcbiAgICByZXR1cm4gdGhpcy5jdXJ2ZS5fZml4ZWROYWZNdWwodGhpcywgayk7XG4gIGVsc2UgaWYgKHRoaXMuY3VydmUuZW5kbylcbiAgICByZXR1cm4gdGhpcy5jdXJ2ZS5fZW5kb1duYWZNdWxBZGQoWyB0aGlzIF0sIFsgayBdKTtcbiAgZWxzZVxuICAgIHJldHVybiB0aGlzLmN1cnZlLl93bmFmTXVsKHRoaXMsIGspO1xufTtcblxuUG9pbnQucHJvdG90eXBlLm11bEFkZCA9IGZ1bmN0aW9uIG11bEFkZChrMSwgcDIsIGsyKSB7XG4gIHZhciBwb2ludHMgPSBbIHRoaXMsIHAyIF07XG4gIHZhciBjb2VmZnMgPSBbIGsxLCBrMiBdO1xuICBpZiAodGhpcy5jdXJ2ZS5lbmRvKVxuICAgIHJldHVybiB0aGlzLmN1cnZlLl9lbmRvV25hZk11bEFkZChwb2ludHMsIGNvZWZmcyk7XG4gIGVsc2VcbiAgICByZXR1cm4gdGhpcy5jdXJ2ZS5fd25hZk11bEFkZCgxLCBwb2ludHMsIGNvZWZmcywgMik7XG59O1xuXG5Qb2ludC5wcm90b3R5cGUuam11bEFkZCA9IGZ1bmN0aW9uIGptdWxBZGQoazEsIHAyLCBrMikge1xuICB2YXIgcG9pbnRzID0gWyB0aGlzLCBwMiBdO1xuICB2YXIgY29lZmZzID0gWyBrMSwgazIgXTtcbiAgaWYgKHRoaXMuY3VydmUuZW5kbylcbiAgICByZXR1cm4gdGhpcy5jdXJ2ZS5fZW5kb1duYWZNdWxBZGQocG9pbnRzLCBjb2VmZnMsIHRydWUpO1xuICBlbHNlXG4gICAgcmV0dXJuIHRoaXMuY3VydmUuX3duYWZNdWxBZGQoMSwgcG9pbnRzLCBjb2VmZnMsIDIsIHRydWUpO1xufTtcblxuUG9pbnQucHJvdG90eXBlLmVxID0gZnVuY3Rpb24gZXEocCkge1xuICByZXR1cm4gdGhpcyA9PT0gcCB8fFxuICAgICAgICAgdGhpcy5pbmYgPT09IHAuaW5mICYmXG4gICAgICAgICAgICAgKHRoaXMuaW5mIHx8IHRoaXMueC5jbXAocC54KSA9PT0gMCAmJiB0aGlzLnkuY21wKHAueSkgPT09IDApO1xufTtcblxuUG9pbnQucHJvdG90eXBlLm5lZyA9IGZ1bmN0aW9uIG5lZyhfcHJlY29tcHV0ZSkge1xuICBpZiAodGhpcy5pbmYpXG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgdmFyIHJlcyA9IHRoaXMuY3VydmUucG9pbnQodGhpcy54LCB0aGlzLnkucmVkTmVnKCkpO1xuICBpZiAoX3ByZWNvbXB1dGUgJiYgdGhpcy5wcmVjb21wdXRlZCkge1xuICAgIHZhciBwcmUgPSB0aGlzLnByZWNvbXB1dGVkO1xuICAgIHZhciBuZWdhdGUgPSBmdW5jdGlvbihwKSB7XG4gICAgICByZXR1cm4gcC5uZWcoKTtcbiAgICB9O1xuICAgIHJlcy5wcmVjb21wdXRlZCA9IHtcbiAgICAgIG5hZjogcHJlLm5hZiAmJiB7XG4gICAgICAgIHduZDogcHJlLm5hZi53bmQsXG4gICAgICAgIHBvaW50czogcHJlLm5hZi5wb2ludHMubWFwKG5lZ2F0ZSlcbiAgICAgIH0sXG4gICAgICBkb3VibGVzOiBwcmUuZG91YmxlcyAmJiB7XG4gICAgICAgIHN0ZXA6IHByZS5kb3VibGVzLnN0ZXAsXG4gICAgICAgIHBvaW50czogcHJlLmRvdWJsZXMucG9pbnRzLm1hcChuZWdhdGUpXG4gICAgICB9XG4gICAgfTtcbiAgfVxuICByZXR1cm4gcmVzO1xufTtcblxuUG9pbnQucHJvdG90eXBlLnRvSiA9IGZ1bmN0aW9uIHRvSigpIHtcbiAgaWYgKHRoaXMuaW5mKVxuICAgIHJldHVybiB0aGlzLmN1cnZlLmpwb2ludChudWxsLCBudWxsLCBudWxsKTtcblxuICB2YXIgcmVzID0gdGhpcy5jdXJ2ZS5qcG9pbnQodGhpcy54LCB0aGlzLnksIHRoaXMuY3VydmUub25lKTtcbiAgcmV0dXJuIHJlcztcbn07XG5cbmZ1bmN0aW9uIEpQb2ludChjdXJ2ZSwgeCwgeSwgeikge1xuICBCYXNlLkJhc2VQb2ludC5jYWxsKHRoaXMsIGN1cnZlLCAnamFjb2JpYW4nKTtcbiAgaWYgKHggPT09IG51bGwgJiYgeSA9PT0gbnVsbCAmJiB6ID09PSBudWxsKSB7XG4gICAgdGhpcy54ID0gdGhpcy5jdXJ2ZS5vbmU7XG4gICAgdGhpcy55ID0gdGhpcy5jdXJ2ZS5vbmU7XG4gICAgdGhpcy56ID0gbmV3IEJOKDApO1xuICB9IGVsc2Uge1xuICAgIHRoaXMueCA9IG5ldyBCTih4LCAxNik7XG4gICAgdGhpcy55ID0gbmV3IEJOKHksIDE2KTtcbiAgICB0aGlzLnogPSBuZXcgQk4oeiwgMTYpO1xuICB9XG4gIGlmICghdGhpcy54LnJlZClcbiAgICB0aGlzLnggPSB0aGlzLngudG9SZWQodGhpcy5jdXJ2ZS5yZWQpO1xuICBpZiAoIXRoaXMueS5yZWQpXG4gICAgdGhpcy55ID0gdGhpcy55LnRvUmVkKHRoaXMuY3VydmUucmVkKTtcbiAgaWYgKCF0aGlzLnoucmVkKVxuICAgIHRoaXMueiA9IHRoaXMuei50b1JlZCh0aGlzLmN1cnZlLnJlZCk7XG5cbiAgdGhpcy56T25lID0gdGhpcy56ID09PSB0aGlzLmN1cnZlLm9uZTtcbn1cbmluaGVyaXRzKEpQb2ludCwgQmFzZS5CYXNlUG9pbnQpO1xuXG5TaG9ydEN1cnZlLnByb3RvdHlwZS5qcG9pbnQgPSBmdW5jdGlvbiBqcG9pbnQoeCwgeSwgeikge1xuICByZXR1cm4gbmV3IEpQb2ludCh0aGlzLCB4LCB5LCB6KTtcbn07XG5cbkpQb2ludC5wcm90b3R5cGUudG9QID0gZnVuY3Rpb24gdG9QKCkge1xuICBpZiAodGhpcy5pc0luZmluaXR5KCkpXG4gICAgcmV0dXJuIHRoaXMuY3VydmUucG9pbnQobnVsbCwgbnVsbCk7XG5cbiAgdmFyIHppbnYgPSB0aGlzLnoucmVkSW52bSgpO1xuICB2YXIgemludjIgPSB6aW52LnJlZFNxcigpO1xuICB2YXIgYXggPSB0aGlzLngucmVkTXVsKHppbnYyKTtcbiAgdmFyIGF5ID0gdGhpcy55LnJlZE11bCh6aW52MikucmVkTXVsKHppbnYpO1xuXG4gIHJldHVybiB0aGlzLmN1cnZlLnBvaW50KGF4LCBheSk7XG59O1xuXG5KUG9pbnQucHJvdG90eXBlLm5lZyA9IGZ1bmN0aW9uIG5lZygpIHtcbiAgcmV0dXJuIHRoaXMuY3VydmUuanBvaW50KHRoaXMueCwgdGhpcy55LnJlZE5lZygpLCB0aGlzLnopO1xufTtcblxuSlBvaW50LnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiBhZGQocCkge1xuICAvLyBPICsgUCA9IFBcbiAgaWYgKHRoaXMuaXNJbmZpbml0eSgpKVxuICAgIHJldHVybiBwO1xuXG4gIC8vIFAgKyBPID0gUFxuICBpZiAocC5pc0luZmluaXR5KCkpXG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgLy8gMTJNICsgNFMgKyA3QVxuICB2YXIgcHoyID0gcC56LnJlZFNxcigpO1xuICB2YXIgejIgPSB0aGlzLnoucmVkU3FyKCk7XG4gIHZhciB1MSA9IHRoaXMueC5yZWRNdWwocHoyKTtcbiAgdmFyIHUyID0gcC54LnJlZE11bCh6Mik7XG4gIHZhciBzMSA9IHRoaXMueS5yZWRNdWwocHoyLnJlZE11bChwLnopKTtcbiAgdmFyIHMyID0gcC55LnJlZE11bCh6Mi5yZWRNdWwodGhpcy56KSk7XG5cbiAgdmFyIGggPSB1MS5yZWRTdWIodTIpO1xuICB2YXIgciA9IHMxLnJlZFN1YihzMik7XG4gIGlmIChoLmNtcG4oMCkgPT09IDApIHtcbiAgICBpZiAoci5jbXBuKDApICE9PSAwKVxuICAgICAgcmV0dXJuIHRoaXMuY3VydmUuanBvaW50KG51bGwsIG51bGwsIG51bGwpO1xuICAgIGVsc2VcbiAgICAgIHJldHVybiB0aGlzLmRibCgpO1xuICB9XG5cbiAgdmFyIGgyID0gaC5yZWRTcXIoKTtcbiAgdmFyIGgzID0gaDIucmVkTXVsKGgpO1xuICB2YXIgdiA9IHUxLnJlZE11bChoMik7XG5cbiAgdmFyIG54ID0gci5yZWRTcXIoKS5yZWRJQWRkKGgzKS5yZWRJU3ViKHYpLnJlZElTdWIodik7XG4gIHZhciBueSA9IHIucmVkTXVsKHYucmVkSVN1YihueCkpLnJlZElTdWIoczEucmVkTXVsKGgzKSk7XG4gIHZhciBueiA9IHRoaXMuei5yZWRNdWwocC56KS5yZWRNdWwoaCk7XG5cbiAgcmV0dXJuIHRoaXMuY3VydmUuanBvaW50KG54LCBueSwgbnopO1xufTtcblxuSlBvaW50LnByb3RvdHlwZS5taXhlZEFkZCA9IGZ1bmN0aW9uIG1peGVkQWRkKHApIHtcbiAgLy8gTyArIFAgPSBQXG4gIGlmICh0aGlzLmlzSW5maW5pdHkoKSlcbiAgICByZXR1cm4gcC50b0ooKTtcblxuICAvLyBQICsgTyA9IFBcbiAgaWYgKHAuaXNJbmZpbml0eSgpKVxuICAgIHJldHVybiB0aGlzO1xuXG4gIC8vIDhNICsgM1MgKyA3QVxuICB2YXIgejIgPSB0aGlzLnoucmVkU3FyKCk7XG4gIHZhciB1MSA9IHRoaXMueDtcbiAgdmFyIHUyID0gcC54LnJlZE11bCh6Mik7XG4gIHZhciBzMSA9IHRoaXMueTtcbiAgdmFyIHMyID0gcC55LnJlZE11bCh6MikucmVkTXVsKHRoaXMueik7XG5cbiAgdmFyIGggPSB1MS5yZWRTdWIodTIpO1xuICB2YXIgciA9IHMxLnJlZFN1YihzMik7XG4gIGlmIChoLmNtcG4oMCkgPT09IDApIHtcbiAgICBpZiAoci5jbXBuKDApICE9PSAwKVxuICAgICAgcmV0dXJuIHRoaXMuY3VydmUuanBvaW50KG51bGwsIG51bGwsIG51bGwpO1xuICAgIGVsc2VcbiAgICAgIHJldHVybiB0aGlzLmRibCgpO1xuICB9XG5cbiAgdmFyIGgyID0gaC5yZWRTcXIoKTtcbiAgdmFyIGgzID0gaDIucmVkTXVsKGgpO1xuICB2YXIgdiA9IHUxLnJlZE11bChoMik7XG5cbiAgdmFyIG54ID0gci5yZWRTcXIoKS5yZWRJQWRkKGgzKS5yZWRJU3ViKHYpLnJlZElTdWIodik7XG4gIHZhciBueSA9IHIucmVkTXVsKHYucmVkSVN1YihueCkpLnJlZElTdWIoczEucmVkTXVsKGgzKSk7XG4gIHZhciBueiA9IHRoaXMuei5yZWRNdWwoaCk7XG5cbiAgcmV0dXJuIHRoaXMuY3VydmUuanBvaW50KG54LCBueSwgbnopO1xufTtcblxuSlBvaW50LnByb3RvdHlwZS5kYmxwID0gZnVuY3Rpb24gZGJscChwb3cpIHtcbiAgaWYgKHBvdyA9PT0gMClcbiAgICByZXR1cm4gdGhpcztcbiAgaWYgKHRoaXMuaXNJbmZpbml0eSgpKVxuICAgIHJldHVybiB0aGlzO1xuICBpZiAoIXBvdylcbiAgICByZXR1cm4gdGhpcy5kYmwoKTtcblxuICBpZiAodGhpcy5jdXJ2ZS56ZXJvQSB8fCB0aGlzLmN1cnZlLnRocmVlQSkge1xuICAgIHZhciByID0gdGhpcztcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBvdzsgaSsrKVxuICAgICAgciA9IHIuZGJsKCk7XG4gICAgcmV0dXJuIHI7XG4gIH1cblxuICAvLyAxTSArIDJTICsgMUEgKyBOICogKDRTICsgNU0gKyA4QSlcbiAgLy8gTiA9IDEgPT4gNk0gKyA2UyArIDlBXG4gIHZhciBhID0gdGhpcy5jdXJ2ZS5hO1xuICB2YXIgdGludiA9IHRoaXMuY3VydmUudGludjtcblxuICB2YXIganggPSB0aGlzLng7XG4gIHZhciBqeSA9IHRoaXMueTtcbiAgdmFyIGp6ID0gdGhpcy56O1xuICB2YXIgano0ID0ganoucmVkU3FyKCkucmVkU3FyKCk7XG5cbiAgLy8gUmV1c2UgcmVzdWx0c1xuICB2YXIganlkID0gankucmVkQWRkKGp5KTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBwb3c7IGkrKykge1xuICAgIHZhciBqeDIgPSBqeC5yZWRTcXIoKTtcbiAgICB2YXIganlkMiA9IGp5ZC5yZWRTcXIoKTtcbiAgICB2YXIganlkNCA9IGp5ZDIucmVkU3FyKCk7XG4gICAgdmFyIGMgPSBqeDIucmVkQWRkKGp4MikucmVkSUFkZChqeDIpLnJlZElBZGQoYS5yZWRNdWwoano0KSk7XG5cbiAgICB2YXIgdDEgPSBqeC5yZWRNdWwoanlkMik7XG4gICAgdmFyIG54ID0gYy5yZWRTcXIoKS5yZWRJU3ViKHQxLnJlZEFkZCh0MSkpO1xuICAgIHZhciB0MiA9IHQxLnJlZElTdWIobngpO1xuICAgIHZhciBkbnkgPSBjLnJlZE11bCh0Mik7XG4gICAgZG55ID0gZG55LnJlZElBZGQoZG55KS5yZWRJU3ViKGp5ZDQpO1xuICAgIHZhciBueiA9IGp5ZC5yZWRNdWwoanopO1xuICAgIGlmIChpICsgMSA8IHBvdylcbiAgICAgIGp6NCA9IGp6NC5yZWRNdWwoanlkNCk7XG5cbiAgICBqeCA9IG54O1xuICAgIGp6ID0gbno7XG4gICAganlkID0gZG55O1xuICB9XG5cbiAgcmV0dXJuIHRoaXMuY3VydmUuanBvaW50KGp4LCBqeWQucmVkTXVsKHRpbnYpLCBqeik7XG59O1xuXG5KUG9pbnQucHJvdG90eXBlLmRibCA9IGZ1bmN0aW9uIGRibCgpIHtcbiAgaWYgKHRoaXMuaXNJbmZpbml0eSgpKVxuICAgIHJldHVybiB0aGlzO1xuXG4gIGlmICh0aGlzLmN1cnZlLnplcm9BKVxuICAgIHJldHVybiB0aGlzLl96ZXJvRGJsKCk7XG4gIGVsc2UgaWYgKHRoaXMuY3VydmUudGhyZWVBKVxuICAgIHJldHVybiB0aGlzLl90aHJlZURibCgpO1xuICBlbHNlXG4gICAgcmV0dXJuIHRoaXMuX2RibCgpO1xufTtcblxuSlBvaW50LnByb3RvdHlwZS5femVyb0RibCA9IGZ1bmN0aW9uIF96ZXJvRGJsKCkge1xuICB2YXIgbng7XG4gIHZhciBueTtcbiAgdmFyIG56O1xuICAvLyBaID0gMVxuICBpZiAodGhpcy56T25lKSB7XG4gICAgLy8gaHlwZXJlbGxpcHRpYy5vcmcvRUZEL2cxcC9hdXRvLXNob3J0dy1qYWNvYmlhbi0wLmh0bWxcbiAgICAvLyAgICAgI2RvdWJsaW5nLW1kYmwtMjAwNy1ibFxuICAgIC8vIDFNICsgNVMgKyAxNEFcblxuICAgIC8vIFhYID0gWDFeMlxuICAgIHZhciB4eCA9IHRoaXMueC5yZWRTcXIoKTtcbiAgICAvLyBZWSA9IFkxXjJcbiAgICB2YXIgeXkgPSB0aGlzLnkucmVkU3FyKCk7XG4gICAgLy8gWVlZWSA9IFlZXjJcbiAgICB2YXIgeXl5eSA9IHl5LnJlZFNxcigpO1xuICAgIC8vIFMgPSAyICogKChYMSArIFlZKV4yIC0gWFggLSBZWVlZKVxuICAgIHZhciBzID0gdGhpcy54LnJlZEFkZCh5eSkucmVkU3FyKCkucmVkSVN1Yih4eCkucmVkSVN1Yih5eXl5KTtcbiAgICBzID0gcy5yZWRJQWRkKHMpO1xuICAgIC8vIE0gPSAzICogWFggKyBhOyBhID0gMFxuICAgIHZhciBtID0geHgucmVkQWRkKHh4KS5yZWRJQWRkKHh4KTtcbiAgICAvLyBUID0gTSBeIDIgLSAyKlNcbiAgICB2YXIgdCA9IG0ucmVkU3FyKCkucmVkSVN1YihzKS5yZWRJU3ViKHMpO1xuXG4gICAgLy8gOCAqIFlZWVlcbiAgICB2YXIgeXl5eTggPSB5eXl5LnJlZElBZGQoeXl5eSk7XG4gICAgeXl5eTggPSB5eXl5OC5yZWRJQWRkKHl5eXk4KTtcbiAgICB5eXl5OCA9IHl5eXk4LnJlZElBZGQoeXl5eTgpO1xuXG4gICAgLy8gWDMgPSBUXG4gICAgbnggPSB0O1xuICAgIC8vIFkzID0gTSAqIChTIC0gVCkgLSA4ICogWVlZWVxuICAgIG55ID0gbS5yZWRNdWwocy5yZWRJU3ViKHQpKS5yZWRJU3ViKHl5eXk4KTtcbiAgICAvLyBaMyA9IDIqWTFcbiAgICBueiA9IHRoaXMueS5yZWRBZGQodGhpcy55KTtcbiAgfSBlbHNlIHtcbiAgICAvLyBoeXBlcmVsbGlwdGljLm9yZy9FRkQvZzFwL2F1dG8tc2hvcnR3LWphY29iaWFuLTAuaHRtbFxuICAgIC8vICAgICAjZG91YmxpbmctZGJsLTIwMDktbFxuICAgIC8vIDJNICsgNVMgKyAxM0FcblxuICAgIC8vIEEgPSBYMV4yXG4gICAgdmFyIGEgPSB0aGlzLngucmVkU3FyKCk7XG4gICAgLy8gQiA9IFkxXjJcbiAgICB2YXIgYiA9IHRoaXMueS5yZWRTcXIoKTtcbiAgICAvLyBDID0gQl4yXG4gICAgdmFyIGMgPSBiLnJlZFNxcigpO1xuICAgIC8vIEQgPSAyICogKChYMSArIEIpXjIgLSBBIC0gQylcbiAgICB2YXIgZCA9IHRoaXMueC5yZWRBZGQoYikucmVkU3FyKCkucmVkSVN1YihhKS5yZWRJU3ViKGMpO1xuICAgIGQgPSBkLnJlZElBZGQoZCk7XG4gICAgLy8gRSA9IDMgKiBBXG4gICAgdmFyIGUgPSBhLnJlZEFkZChhKS5yZWRJQWRkKGEpO1xuICAgIC8vIEYgPSBFXjJcbiAgICB2YXIgZiA9IGUucmVkU3FyKCk7XG5cbiAgICAvLyA4ICogQ1xuICAgIHZhciBjOCA9IGMucmVkSUFkZChjKTtcbiAgICBjOCA9IGM4LnJlZElBZGQoYzgpO1xuICAgIGM4ID0gYzgucmVkSUFkZChjOCk7XG5cbiAgICAvLyBYMyA9IEYgLSAyICogRFxuICAgIG54ID0gZi5yZWRJU3ViKGQpLnJlZElTdWIoZCk7XG4gICAgLy8gWTMgPSBFICogKEQgLSBYMykgLSA4ICogQ1xuICAgIG55ID0gZS5yZWRNdWwoZC5yZWRJU3ViKG54KSkucmVkSVN1YihjOCk7XG4gICAgLy8gWjMgPSAyICogWTEgKiBaMVxuICAgIG56ID0gdGhpcy55LnJlZE11bCh0aGlzLnopO1xuICAgIG56ID0gbnoucmVkSUFkZChueik7XG4gIH1cblxuICByZXR1cm4gdGhpcy5jdXJ2ZS5qcG9pbnQobngsIG55LCBueik7XG59O1xuXG5KUG9pbnQucHJvdG90eXBlLl90aHJlZURibCA9IGZ1bmN0aW9uIF90aHJlZURibCgpIHtcbiAgdmFyIG54O1xuICB2YXIgbnk7XG4gIHZhciBuejtcbiAgLy8gWiA9IDFcbiAgaWYgKHRoaXMuek9uZSkge1xuICAgIC8vIGh5cGVyZWxsaXB0aWMub3JnL0VGRC9nMXAvYXV0by1zaG9ydHctamFjb2JpYW4tMy5odG1sXG4gICAgLy8gICAgICNkb3VibGluZy1tZGJsLTIwMDctYmxcbiAgICAvLyAxTSArIDVTICsgMTVBXG5cbiAgICAvLyBYWCA9IFgxXjJcbiAgICB2YXIgeHggPSB0aGlzLngucmVkU3FyKCk7XG4gICAgLy8gWVkgPSBZMV4yXG4gICAgdmFyIHl5ID0gdGhpcy55LnJlZFNxcigpO1xuICAgIC8vIFlZWVkgPSBZWV4yXG4gICAgdmFyIHl5eXkgPSB5eS5yZWRTcXIoKTtcbiAgICAvLyBTID0gMiAqICgoWDEgKyBZWSleMiAtIFhYIC0gWVlZWSlcbiAgICB2YXIgcyA9IHRoaXMueC5yZWRBZGQoeXkpLnJlZFNxcigpLnJlZElTdWIoeHgpLnJlZElTdWIoeXl5eSk7XG4gICAgcyA9IHMucmVkSUFkZChzKTtcbiAgICAvLyBNID0gMyAqIFhYICsgYVxuICAgIHZhciBtID0geHgucmVkQWRkKHh4KS5yZWRJQWRkKHh4KS5yZWRJQWRkKHRoaXMuY3VydmUuYSk7XG4gICAgLy8gVCA9IE1eMiAtIDIgKiBTXG4gICAgdmFyIHQgPSBtLnJlZFNxcigpLnJlZElTdWIocykucmVkSVN1YihzKTtcbiAgICAvLyBYMyA9IFRcbiAgICBueCA9IHQ7XG4gICAgLy8gWTMgPSBNICogKFMgLSBUKSAtIDggKiBZWVlZXG4gICAgdmFyIHl5eXk4ID0geXl5eS5yZWRJQWRkKHl5eXkpO1xuICAgIHl5eXk4ID0geXl5eTgucmVkSUFkZCh5eXl5OCk7XG4gICAgeXl5eTggPSB5eXl5OC5yZWRJQWRkKHl5eXk4KTtcbiAgICBueSA9IG0ucmVkTXVsKHMucmVkSVN1Yih0KSkucmVkSVN1Yih5eXl5OCk7XG4gICAgLy8gWjMgPSAyICogWTFcbiAgICBueiA9IHRoaXMueS5yZWRBZGQodGhpcy55KTtcbiAgfSBlbHNlIHtcbiAgICAvLyBoeXBlcmVsbGlwdGljLm9yZy9FRkQvZzFwL2F1dG8tc2hvcnR3LWphY29iaWFuLTMuaHRtbCNkb3VibGluZy1kYmwtMjAwMS1iXG4gICAgLy8gM00gKyA1U1xuXG4gICAgLy8gZGVsdGEgPSBaMV4yXG4gICAgdmFyIGRlbHRhID0gdGhpcy56LnJlZFNxcigpO1xuICAgIC8vIGdhbW1hID0gWTFeMlxuICAgIHZhciBnYW1tYSA9IHRoaXMueS5yZWRTcXIoKTtcbiAgICAvLyBiZXRhID0gWDEgKiBnYW1tYVxuICAgIHZhciBiZXRhID0gdGhpcy54LnJlZE11bChnYW1tYSk7XG4gICAgLy8gYWxwaGEgPSAzICogKFgxIC0gZGVsdGEpICogKFgxICsgZGVsdGEpXG4gICAgdmFyIGFscGhhID0gdGhpcy54LnJlZFN1YihkZWx0YSkucmVkTXVsKHRoaXMueC5yZWRBZGQoZGVsdGEpKTtcbiAgICBhbHBoYSA9IGFscGhhLnJlZEFkZChhbHBoYSkucmVkSUFkZChhbHBoYSk7XG4gICAgLy8gWDMgPSBhbHBoYV4yIC0gOCAqIGJldGFcbiAgICB2YXIgYmV0YTQgPSBiZXRhLnJlZElBZGQoYmV0YSk7XG4gICAgYmV0YTQgPSBiZXRhNC5yZWRJQWRkKGJldGE0KTtcbiAgICB2YXIgYmV0YTggPSBiZXRhNC5yZWRBZGQoYmV0YTQpO1xuICAgIG54ID0gYWxwaGEucmVkU3FyKCkucmVkSVN1YihiZXRhOCk7XG4gICAgLy8gWjMgPSAoWTEgKyBaMSleMiAtIGdhbW1hIC0gZGVsdGFcbiAgICBueiA9IHRoaXMueS5yZWRBZGQodGhpcy56KS5yZWRTcXIoKS5yZWRJU3ViKGdhbW1hKS5yZWRJU3ViKGRlbHRhKTtcbiAgICAvLyBZMyA9IGFscGhhICogKDQgKiBiZXRhIC0gWDMpIC0gOCAqIGdhbW1hXjJcbiAgICB2YXIgZ2dhbW1hOCA9IGdhbW1hLnJlZFNxcigpO1xuICAgIGdnYW1tYTggPSBnZ2FtbWE4LnJlZElBZGQoZ2dhbW1hOCk7XG4gICAgZ2dhbW1hOCA9IGdnYW1tYTgucmVkSUFkZChnZ2FtbWE4KTtcbiAgICBnZ2FtbWE4ID0gZ2dhbW1hOC5yZWRJQWRkKGdnYW1tYTgpO1xuICAgIG55ID0gYWxwaGEucmVkTXVsKGJldGE0LnJlZElTdWIobngpKS5yZWRJU3ViKGdnYW1tYTgpO1xuICB9XG5cbiAgcmV0dXJuIHRoaXMuY3VydmUuanBvaW50KG54LCBueSwgbnopO1xufTtcblxuSlBvaW50LnByb3RvdHlwZS5fZGJsID0gZnVuY3Rpb24gX2RibCgpIHtcbiAgdmFyIGEgPSB0aGlzLmN1cnZlLmE7XG5cbiAgLy8gNE0gKyA2UyArIDEwQVxuICB2YXIganggPSB0aGlzLng7XG4gIHZhciBqeSA9IHRoaXMueTtcbiAgdmFyIGp6ID0gdGhpcy56O1xuICB2YXIgano0ID0ganoucmVkU3FyKCkucmVkU3FyKCk7XG5cbiAgdmFyIGp4MiA9IGp4LnJlZFNxcigpO1xuICB2YXIgankyID0gankucmVkU3FyKCk7XG5cbiAgdmFyIGMgPSBqeDIucmVkQWRkKGp4MikucmVkSUFkZChqeDIpLnJlZElBZGQoYS5yZWRNdWwoano0KSk7XG5cbiAgdmFyIGp4ZDQgPSBqeC5yZWRBZGQoangpO1xuICBqeGQ0ID0ganhkNC5yZWRJQWRkKGp4ZDQpO1xuICB2YXIgdDEgPSBqeGQ0LnJlZE11bChqeTIpO1xuICB2YXIgbnggPSBjLnJlZFNxcigpLnJlZElTdWIodDEucmVkQWRkKHQxKSk7XG4gIHZhciB0MiA9IHQxLnJlZElTdWIobngpO1xuXG4gIHZhciBqeWQ4ID0gankyLnJlZFNxcigpO1xuICBqeWQ4ID0ganlkOC5yZWRJQWRkKGp5ZDgpO1xuICBqeWQ4ID0ganlkOC5yZWRJQWRkKGp5ZDgpO1xuICBqeWQ4ID0ganlkOC5yZWRJQWRkKGp5ZDgpO1xuICB2YXIgbnkgPSBjLnJlZE11bCh0MikucmVkSVN1YihqeWQ4KTtcbiAgdmFyIG56ID0gankucmVkQWRkKGp5KS5yZWRNdWwoanopO1xuXG4gIHJldHVybiB0aGlzLmN1cnZlLmpwb2ludChueCwgbnksIG56KTtcbn07XG5cbkpQb2ludC5wcm90b3R5cGUudHJwbCA9IGZ1bmN0aW9uIHRycGwoKSB7XG4gIGlmICghdGhpcy5jdXJ2ZS56ZXJvQSlcbiAgICByZXR1cm4gdGhpcy5kYmwoKS5hZGQodGhpcyk7XG5cbiAgLy8gaHlwZXJlbGxpcHRpYy5vcmcvRUZEL2cxcC9hdXRvLXNob3J0dy1qYWNvYmlhbi0wLmh0bWwjdHJpcGxpbmctdHBsLTIwMDctYmxcbiAgLy8gNU0gKyAxMFMgKyAuLi5cblxuICAvLyBYWCA9IFgxXjJcbiAgdmFyIHh4ID0gdGhpcy54LnJlZFNxcigpO1xuICAvLyBZWSA9IFkxXjJcbiAgdmFyIHl5ID0gdGhpcy55LnJlZFNxcigpO1xuICAvLyBaWiA9IFoxXjJcbiAgdmFyIHp6ID0gdGhpcy56LnJlZFNxcigpO1xuICAvLyBZWVlZID0gWVleMlxuICB2YXIgeXl5eSA9IHl5LnJlZFNxcigpO1xuICAvLyBNID0gMyAqIFhYICsgYSAqIFpaMjsgYSA9IDBcbiAgdmFyIG0gPSB4eC5yZWRBZGQoeHgpLnJlZElBZGQoeHgpO1xuICAvLyBNTSA9IE1eMlxuICB2YXIgbW0gPSBtLnJlZFNxcigpO1xuICAvLyBFID0gNiAqICgoWDEgKyBZWSleMiAtIFhYIC0gWVlZWSkgLSBNTVxuICB2YXIgZSA9IHRoaXMueC5yZWRBZGQoeXkpLnJlZFNxcigpLnJlZElTdWIoeHgpLnJlZElTdWIoeXl5eSk7XG4gIGUgPSBlLnJlZElBZGQoZSk7XG4gIGUgPSBlLnJlZEFkZChlKS5yZWRJQWRkKGUpO1xuICBlID0gZS5yZWRJU3ViKG1tKTtcbiAgLy8gRUUgPSBFXjJcbiAgdmFyIGVlID0gZS5yZWRTcXIoKTtcbiAgLy8gVCA9IDE2KllZWVlcbiAgdmFyIHQgPSB5eXl5LnJlZElBZGQoeXl5eSk7XG4gIHQgPSB0LnJlZElBZGQodCk7XG4gIHQgPSB0LnJlZElBZGQodCk7XG4gIHQgPSB0LnJlZElBZGQodCk7XG4gIC8vIFUgPSAoTSArIEUpXjIgLSBNTSAtIEVFIC0gVFxuICB2YXIgdSA9IG0ucmVkSUFkZChlKS5yZWRTcXIoKS5yZWRJU3ViKG1tKS5yZWRJU3ViKGVlKS5yZWRJU3ViKHQpO1xuICAvLyBYMyA9IDQgKiAoWDEgKiBFRSAtIDQgKiBZWSAqIFUpXG4gIHZhciB5eXU0ID0geXkucmVkTXVsKHUpO1xuICB5eXU0ID0geXl1NC5yZWRJQWRkKHl5dTQpO1xuICB5eXU0ID0geXl1NC5yZWRJQWRkKHl5dTQpO1xuICB2YXIgbnggPSB0aGlzLngucmVkTXVsKGVlKS5yZWRJU3ViKHl5dTQpO1xuICBueCA9IG54LnJlZElBZGQobngpO1xuICBueCA9IG54LnJlZElBZGQobngpO1xuICAvLyBZMyA9IDggKiBZMSAqIChVICogKFQgLSBVKSAtIEUgKiBFRSlcbiAgdmFyIG55ID0gdGhpcy55LnJlZE11bCh1LnJlZE11bCh0LnJlZElTdWIodSkpLnJlZElTdWIoZS5yZWRNdWwoZWUpKSk7XG4gIG55ID0gbnkucmVkSUFkZChueSk7XG4gIG55ID0gbnkucmVkSUFkZChueSk7XG4gIG55ID0gbnkucmVkSUFkZChueSk7XG4gIC8vIFozID0gKFoxICsgRSleMiAtIFpaIC0gRUVcbiAgdmFyIG56ID0gdGhpcy56LnJlZEFkZChlKS5yZWRTcXIoKS5yZWRJU3ViKHp6KS5yZWRJU3ViKGVlKTtcblxuICByZXR1cm4gdGhpcy5jdXJ2ZS5qcG9pbnQobngsIG55LCBueik7XG59O1xuXG5KUG9pbnQucHJvdG90eXBlLm11bCA9IGZ1bmN0aW9uIG11bChrLCBrYmFzZSkge1xuICBrID0gbmV3IEJOKGssIGtiYXNlKTtcblxuICByZXR1cm4gdGhpcy5jdXJ2ZS5fd25hZk11bCh0aGlzLCBrKTtcbn07XG5cbkpQb2ludC5wcm90b3R5cGUuZXEgPSBmdW5jdGlvbiBlcShwKSB7XG4gIGlmIChwLnR5cGUgPT09ICdhZmZpbmUnKVxuICAgIHJldHVybiB0aGlzLmVxKHAudG9KKCkpO1xuXG4gIGlmICh0aGlzID09PSBwKVxuICAgIHJldHVybiB0cnVlO1xuXG4gIC8vIHgxICogejJeMiA9PSB4MiAqIHoxXjJcbiAgdmFyIHoyID0gdGhpcy56LnJlZFNxcigpO1xuICB2YXIgcHoyID0gcC56LnJlZFNxcigpO1xuICBpZiAodGhpcy54LnJlZE11bChwejIpLnJlZElTdWIocC54LnJlZE11bCh6MikpLmNtcG4oMCkgIT09IDApXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIC8vIHkxICogejJeMyA9PSB5MiAqIHoxXjNcbiAgdmFyIHozID0gejIucmVkTXVsKHRoaXMueik7XG4gIHZhciBwejMgPSBwejIucmVkTXVsKHAueik7XG4gIHJldHVybiB0aGlzLnkucmVkTXVsKHB6MykucmVkSVN1YihwLnkucmVkTXVsKHozKSkuY21wbigwKSA9PT0gMDtcbn07XG5cbkpQb2ludC5wcm90b3R5cGUuZXFYVG9QID0gZnVuY3Rpb24gZXFYVG9QKHgpIHtcbiAgdmFyIHpzID0gdGhpcy56LnJlZFNxcigpO1xuICB2YXIgcnggPSB4LnRvUmVkKHRoaXMuY3VydmUucmVkKS5yZWRNdWwoenMpO1xuICBpZiAodGhpcy54LmNtcChyeCkgPT09IDApXG4gICAgcmV0dXJuIHRydWU7XG5cbiAgdmFyIHhjID0geC5jbG9uZSgpO1xuICB2YXIgdCA9IHRoaXMuY3VydmUucmVkTi5yZWRNdWwoenMpO1xuICBmb3IgKDs7KSB7XG4gICAgeGMuaWFkZCh0aGlzLmN1cnZlLm4pO1xuICAgIGlmICh4Yy5jbXAodGhpcy5jdXJ2ZS5wKSA+PSAwKVxuICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgcngucmVkSUFkZCh0KTtcbiAgICBpZiAodGhpcy54LmNtcChyeCkgPT09IDApXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufTtcblxuSlBvaW50LnByb3RvdHlwZS5pbnNwZWN0ID0gZnVuY3Rpb24gaW5zcGVjdCgpIHtcbiAgaWYgKHRoaXMuaXNJbmZpbml0eSgpKVxuICAgIHJldHVybiAnPEVDIEpQb2ludCBJbmZpbml0eT4nO1xuICByZXR1cm4gJzxFQyBKUG9pbnQgeDogJyArIHRoaXMueC50b1N0cmluZygxNiwgMikgK1xuICAgICAgJyB5OiAnICsgdGhpcy55LnRvU3RyaW5nKDE2LCAyKSArXG4gICAgICAnIHo6ICcgKyB0aGlzLnoudG9TdHJpbmcoMTYsIDIpICsgJz4nO1xufTtcblxuSlBvaW50LnByb3RvdHlwZS5pc0luZmluaXR5ID0gZnVuY3Rpb24gaXNJbmZpbml0eSgpIHtcbiAgLy8gWFhYIFRoaXMgY29kZSBhc3N1bWVzIHRoYXQgemVybyBpcyBhbHdheXMgemVybyBpbiByZWRcbiAgcmV0dXJuIHRoaXMuei5jbXBuKDApID09PSAwO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGVsbGlwdGljID0gZXhwb3J0cztcblxuZWxsaXB0aWMudmVyc2lvbiA9IHJlcXVpcmUoJy4uL3BhY2thZ2UuanNvbicpLnZlcnNpb247XG5lbGxpcHRpYy51dGlscyA9IHJlcXVpcmUoJy4vZWxsaXB0aWMvdXRpbHMnKTtcbmVsbGlwdGljLnJhbmQgPSByZXF1aXJlKCdicm9yYW5kJyk7XG5lbGxpcHRpYy5jdXJ2ZSA9IHJlcXVpcmUoJy4vZWxsaXB0aWMvY3VydmUnKTtcbmVsbGlwdGljLmN1cnZlcyA9IHJlcXVpcmUoJy4vZWxsaXB0aWMvY3VydmVzJyk7XG5cbi8vIFByb3RvY29sc1xuZWxsaXB0aWMuZWMgPSByZXF1aXJlKCcuL2VsbGlwdGljL2VjJyk7XG5lbGxpcHRpYy5lZGRzYSA9IHJlcXVpcmUoJy4vZWxsaXB0aWMvZWRkc2EnKTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGVsbGlwdGljID0gcmVxdWlyZSgnLi4vLi4vZWxsaXB0aWMnKTtcbnZhciB1dGlscyA9IGVsbGlwdGljLnV0aWxzO1xudmFyIGFzc2VydCA9IHV0aWxzLmFzc2VydDtcbnZhciBwYXJzZUJ5dGVzID0gdXRpbHMucGFyc2VCeXRlcztcbnZhciBjYWNoZWRQcm9wZXJ0eSA9IHV0aWxzLmNhY2hlZFByb3BlcnR5O1xuXG4vKipcbiogQHBhcmFtIHtFRERTQX0gZWRkc2EgLSBpbnN0YW5jZVxuKiBAcGFyYW0ge09iamVjdH0gcGFyYW1zIC0gcHVibGljL3ByaXZhdGUga2V5IHBhcmFtZXRlcnNcbipcbiogQHBhcmFtIHtBcnJheTxCeXRlPn0gW3BhcmFtcy5zZWNyZXRdIC0gc2VjcmV0IHNlZWQgYnl0ZXNcbiogQHBhcmFtIHtQb2ludH0gW3BhcmFtcy5wdWJdIC0gcHVibGljIGtleSBwb2ludCAoYWthIGBBYCBpbiBlZGRzYSB0ZXJtcylcbiogQHBhcmFtIHtBcnJheTxCeXRlPn0gW3BhcmFtcy5wdWJdIC0gcHVibGljIGtleSBwb2ludCBlbmNvZGVkIGFzIGJ5dGVzXG4qXG4qL1xuZnVuY3Rpb24gS2V5UGFpcihlZGRzYSwgcGFyYW1zKSB7XG4gIHRoaXMuZWRkc2EgPSBlZGRzYTtcbiAgdGhpcy5fc2VjcmV0ID0gcGFyc2VCeXRlcyhwYXJhbXMuc2VjcmV0KTtcbiAgaWYgKGVkZHNhLmlzUG9pbnQocGFyYW1zLnB1YikpXG4gICAgdGhpcy5fcHViID0gcGFyYW1zLnB1YjtcbiAgZWxzZVxuICAgIHRoaXMuX3B1YkJ5dGVzID0gcGFyc2VCeXRlcyhwYXJhbXMucHViKTtcbn1cblxuS2V5UGFpci5mcm9tUHVibGljID0gZnVuY3Rpb24gZnJvbVB1YmxpYyhlZGRzYSwgcHViKSB7XG4gIGlmIChwdWIgaW5zdGFuY2VvZiBLZXlQYWlyKVxuICAgIHJldHVybiBwdWI7XG4gIHJldHVybiBuZXcgS2V5UGFpcihlZGRzYSwgeyBwdWI6IHB1YiB9KTtcbn07XG5cbktleVBhaXIuZnJvbVNlY3JldCA9IGZ1bmN0aW9uIGZyb21TZWNyZXQoZWRkc2EsIHNlY3JldCkge1xuICBpZiAoc2VjcmV0IGluc3RhbmNlb2YgS2V5UGFpcilcbiAgICByZXR1cm4gc2VjcmV0O1xuICByZXR1cm4gbmV3IEtleVBhaXIoZWRkc2EsIHsgc2VjcmV0OiBzZWNyZXQgfSk7XG59O1xuXG5LZXlQYWlyLnByb3RvdHlwZS5zZWNyZXQgPSBmdW5jdGlvbiBzZWNyZXQoKSB7XG4gIHJldHVybiB0aGlzLl9zZWNyZXQ7XG59O1xuXG5jYWNoZWRQcm9wZXJ0eShLZXlQYWlyLCAncHViQnl0ZXMnLCBmdW5jdGlvbiBwdWJCeXRlcygpIHtcbiAgcmV0dXJuIHRoaXMuZWRkc2EuZW5jb2RlUG9pbnQodGhpcy5wdWIoKSk7XG59KTtcblxuY2FjaGVkUHJvcGVydHkoS2V5UGFpciwgJ3B1YicsIGZ1bmN0aW9uIHB1YigpIHtcbiAgaWYgKHRoaXMuX3B1YkJ5dGVzKVxuICAgIHJldHVybiB0aGlzLmVkZHNhLmRlY29kZVBvaW50KHRoaXMuX3B1YkJ5dGVzKTtcbiAgcmV0dXJuIHRoaXMuZWRkc2EuZy5tdWwodGhpcy5wcml2KCkpO1xufSk7XG5cbmNhY2hlZFByb3BlcnR5KEtleVBhaXIsICdwcml2Qnl0ZXMnLCBmdW5jdGlvbiBwcml2Qnl0ZXMoKSB7XG4gIHZhciBlZGRzYSA9IHRoaXMuZWRkc2E7XG4gIHZhciBoYXNoID0gdGhpcy5oYXNoKCk7XG4gIHZhciBsYXN0SXggPSBlZGRzYS5lbmNvZGluZ0xlbmd0aCAtIDE7XG5cbiAgdmFyIGEgPSBoYXNoLnNsaWNlKDAsIGVkZHNhLmVuY29kaW5nTGVuZ3RoKTtcbiAgYVswXSAmPSAyNDg7XG4gIGFbbGFzdEl4XSAmPSAxMjc7XG4gIGFbbGFzdEl4XSB8PSA2NDtcblxuICByZXR1cm4gYTtcbn0pO1xuXG5jYWNoZWRQcm9wZXJ0eShLZXlQYWlyLCAncHJpdicsIGZ1bmN0aW9uIHByaXYoKSB7XG4gIHJldHVybiB0aGlzLmVkZHNhLmRlY29kZUludCh0aGlzLnByaXZCeXRlcygpKTtcbn0pO1xuXG5jYWNoZWRQcm9wZXJ0eShLZXlQYWlyLCAnaGFzaCcsIGZ1bmN0aW9uIGhhc2goKSB7XG4gIHJldHVybiB0aGlzLmVkZHNhLmhhc2goKS51cGRhdGUodGhpcy5zZWNyZXQoKSkuZGlnZXN0KCk7XG59KTtcblxuY2FjaGVkUHJvcGVydHkoS2V5UGFpciwgJ21lc3NhZ2VQcmVmaXgnLCBmdW5jdGlvbiBtZXNzYWdlUHJlZml4KCkge1xuICByZXR1cm4gdGhpcy5oYXNoKCkuc2xpY2UodGhpcy5lZGRzYS5lbmNvZGluZ0xlbmd0aCk7XG59KTtcblxuS2V5UGFpci5wcm90b3R5cGUuc2lnbiA9IGZ1bmN0aW9uIHNpZ24obWVzc2FnZSkge1xuICBhc3NlcnQodGhpcy5fc2VjcmV0LCAnS2V5UGFpciBjYW4gb25seSB2ZXJpZnknKTtcbiAgcmV0dXJuIHRoaXMuZWRkc2Euc2lnbihtZXNzYWdlLCB0aGlzKTtcbn07XG5cbktleVBhaXIucHJvdG90eXBlLnZlcmlmeSA9IGZ1bmN0aW9uIHZlcmlmeShtZXNzYWdlLCBzaWcpIHtcbiAgcmV0dXJuIHRoaXMuZWRkc2EudmVyaWZ5KG1lc3NhZ2UsIHNpZywgdGhpcyk7XG59O1xuXG5LZXlQYWlyLnByb3RvdHlwZS5nZXRTZWNyZXQgPSBmdW5jdGlvbiBnZXRTZWNyZXQoZW5jKSB7XG4gIGFzc2VydCh0aGlzLl9zZWNyZXQsICdLZXlQYWlyIGlzIHB1YmxpYyBvbmx5Jyk7XG4gIHJldHVybiB1dGlscy5lbmNvZGUodGhpcy5zZWNyZXQoKSwgZW5jKTtcbn07XG5cbktleVBhaXIucHJvdG90eXBlLmdldFB1YmxpYyA9IGZ1bmN0aW9uIGdldFB1YmxpYyhlbmMpIHtcbiAgcmV0dXJuIHV0aWxzLmVuY29kZSh0aGlzLnB1YkJ5dGVzKCksIGVuYyk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEtleVBhaXI7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBjdXJ2ZSA9IHJlcXVpcmUoJy4uL2N1cnZlJyk7XG52YXIgZWxsaXB0aWMgPSByZXF1aXJlKCcuLi8uLi9lbGxpcHRpYycpO1xudmFyIEJOID0gcmVxdWlyZSgnYm4uanMnKTtcbnZhciBpbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJyk7XG52YXIgQmFzZSA9IGN1cnZlLmJhc2U7XG5cbnZhciBhc3NlcnQgPSBlbGxpcHRpYy51dGlscy5hc3NlcnQ7XG5cbmZ1bmN0aW9uIEVkd2FyZHNDdXJ2ZShjb25mKSB7XG4gIC8vIE5PVEU6IEltcG9ydGFudCBhcyB3ZSBhcmUgY3JlYXRpbmcgcG9pbnQgaW4gQmFzZS5jYWxsKClcbiAgdGhpcy50d2lzdGVkID0gKGNvbmYuYSB8IDApICE9PSAxO1xuICB0aGlzLm1PbmVBID0gdGhpcy50d2lzdGVkICYmIChjb25mLmEgfCAwKSA9PT0gLTE7XG4gIHRoaXMuZXh0ZW5kZWQgPSB0aGlzLm1PbmVBO1xuXG4gIEJhc2UuY2FsbCh0aGlzLCAnZWR3YXJkcycsIGNvbmYpO1xuXG4gIHRoaXMuYSA9IG5ldyBCTihjb25mLmEsIDE2KS51bW9kKHRoaXMucmVkLm0pO1xuICB0aGlzLmEgPSB0aGlzLmEudG9SZWQodGhpcy5yZWQpO1xuICB0aGlzLmMgPSBuZXcgQk4oY29uZi5jLCAxNikudG9SZWQodGhpcy5yZWQpO1xuICB0aGlzLmMyID0gdGhpcy5jLnJlZFNxcigpO1xuICB0aGlzLmQgPSBuZXcgQk4oY29uZi5kLCAxNikudG9SZWQodGhpcy5yZWQpO1xuICB0aGlzLmRkID0gdGhpcy5kLnJlZEFkZCh0aGlzLmQpO1xuXG4gIGFzc2VydCghdGhpcy50d2lzdGVkIHx8IHRoaXMuYy5mcm9tUmVkKCkuY21wbigxKSA9PT0gMCk7XG4gIHRoaXMub25lQyA9IChjb25mLmMgfCAwKSA9PT0gMTtcbn1cbmluaGVyaXRzKEVkd2FyZHNDdXJ2ZSwgQmFzZSk7XG5tb2R1bGUuZXhwb3J0cyA9IEVkd2FyZHNDdXJ2ZTtcblxuRWR3YXJkc0N1cnZlLnByb3RvdHlwZS5fbXVsQSA9IGZ1bmN0aW9uIF9tdWxBKG51bSkge1xuICBpZiAodGhpcy5tT25lQSlcbiAgICByZXR1cm4gbnVtLnJlZE5lZygpO1xuICBlbHNlXG4gICAgcmV0dXJuIHRoaXMuYS5yZWRNdWwobnVtKTtcbn07XG5cbkVkd2FyZHNDdXJ2ZS5wcm90b3R5cGUuX211bEMgPSBmdW5jdGlvbiBfbXVsQyhudW0pIHtcbiAgaWYgKHRoaXMub25lQylcbiAgICByZXR1cm4gbnVtO1xuICBlbHNlXG4gICAgcmV0dXJuIHRoaXMuYy5yZWRNdWwobnVtKTtcbn07XG5cbi8vIEp1c3QgZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBTaG9ydCBjdXJ2ZVxuRWR3YXJkc0N1cnZlLnByb3RvdHlwZS5qcG9pbnQgPSBmdW5jdGlvbiBqcG9pbnQoeCwgeSwgeiwgdCkge1xuICByZXR1cm4gdGhpcy5wb2ludCh4LCB5LCB6LCB0KTtcbn07XG5cbkVkd2FyZHNDdXJ2ZS5wcm90b3R5cGUucG9pbnRGcm9tWCA9IGZ1bmN0aW9uIHBvaW50RnJvbVgoeCwgb2RkKSB7XG4gIHggPSBuZXcgQk4oeCwgMTYpO1xuICBpZiAoIXgucmVkKVxuICAgIHggPSB4LnRvUmVkKHRoaXMucmVkKTtcblxuICB2YXIgeDIgPSB4LnJlZFNxcigpO1xuICB2YXIgcmhzID0gdGhpcy5jMi5yZWRTdWIodGhpcy5hLnJlZE11bCh4MikpO1xuICB2YXIgbGhzID0gdGhpcy5vbmUucmVkU3ViKHRoaXMuYzIucmVkTXVsKHRoaXMuZCkucmVkTXVsKHgyKSk7XG5cbiAgdmFyIHkyID0gcmhzLnJlZE11bChsaHMucmVkSW52bSgpKTtcbiAgdmFyIHkgPSB5Mi5yZWRTcXJ0KCk7XG4gIGlmICh5LnJlZFNxcigpLnJlZFN1Yih5MikuY21wKHRoaXMuemVybykgIT09IDApXG4gICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhbGlkIHBvaW50Jyk7XG5cbiAgdmFyIGlzT2RkID0geS5mcm9tUmVkKCkuaXNPZGQoKTtcbiAgaWYgKG9kZCAmJiAhaXNPZGQgfHwgIW9kZCAmJiBpc09kZClcbiAgICB5ID0geS5yZWROZWcoKTtcblxuICByZXR1cm4gdGhpcy5wb2ludCh4LCB5KTtcbn07XG5cbkVkd2FyZHNDdXJ2ZS5wcm90b3R5cGUucG9pbnRGcm9tWSA9IGZ1bmN0aW9uIHBvaW50RnJvbVkoeSwgb2RkKSB7XG4gIHkgPSBuZXcgQk4oeSwgMTYpO1xuICBpZiAoIXkucmVkKVxuICAgIHkgPSB5LnRvUmVkKHRoaXMucmVkKTtcblxuICAvLyB4XjIgPSAoeV4yIC0gY14yKSAvIChjXjIgZCB5XjIgLSBhKVxuICB2YXIgeTIgPSB5LnJlZFNxcigpO1xuICB2YXIgbGhzID0geTIucmVkU3ViKHRoaXMuYzIpO1xuICB2YXIgcmhzID0geTIucmVkTXVsKHRoaXMuZCkucmVkTXVsKHRoaXMuYzIpLnJlZFN1Yih0aGlzLmEpO1xuICB2YXIgeDIgPSBsaHMucmVkTXVsKHJocy5yZWRJbnZtKCkpO1xuXG4gIGlmICh4Mi5jbXAodGhpcy56ZXJvKSA9PT0gMCkge1xuICAgIGlmIChvZGQpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgcG9pbnQnKTtcbiAgICBlbHNlXG4gICAgICByZXR1cm4gdGhpcy5wb2ludCh0aGlzLnplcm8sIHkpO1xuICB9XG5cbiAgdmFyIHggPSB4Mi5yZWRTcXJ0KCk7XG4gIGlmICh4LnJlZFNxcigpLnJlZFN1Yih4MikuY21wKHRoaXMuemVybykgIT09IDApXG4gICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhbGlkIHBvaW50Jyk7XG5cbiAgaWYgKHguZnJvbVJlZCgpLmlzT2RkKCkgIT09IG9kZClcbiAgICB4ID0geC5yZWROZWcoKTtcblxuICByZXR1cm4gdGhpcy5wb2ludCh4LCB5KTtcbn07XG5cbkVkd2FyZHNDdXJ2ZS5wcm90b3R5cGUudmFsaWRhdGUgPSBmdW5jdGlvbiB2YWxpZGF0ZShwb2ludCkge1xuICBpZiAocG9pbnQuaXNJbmZpbml0eSgpKVxuICAgIHJldHVybiB0cnVlO1xuXG4gIC8vIEN1cnZlOiBBICogWF4yICsgWV4yID0gQ14yICogKDEgKyBEICogWF4yICogWV4yKVxuICBwb2ludC5ub3JtYWxpemUoKTtcblxuICB2YXIgeDIgPSBwb2ludC54LnJlZFNxcigpO1xuICB2YXIgeTIgPSBwb2ludC55LnJlZFNxcigpO1xuICB2YXIgbGhzID0geDIucmVkTXVsKHRoaXMuYSkucmVkQWRkKHkyKTtcbiAgdmFyIHJocyA9IHRoaXMuYzIucmVkTXVsKHRoaXMub25lLnJlZEFkZCh0aGlzLmQucmVkTXVsKHgyKS5yZWRNdWwoeTIpKSk7XG5cbiAgcmV0dXJuIGxocy5jbXAocmhzKSA9PT0gMDtcbn07XG5cbmZ1bmN0aW9uIFBvaW50KGN1cnZlLCB4LCB5LCB6LCB0KSB7XG4gIEJhc2UuQmFzZVBvaW50LmNhbGwodGhpcywgY3VydmUsICdwcm9qZWN0aXZlJyk7XG4gIGlmICh4ID09PSBudWxsICYmIHkgPT09IG51bGwgJiYgeiA9PT0gbnVsbCkge1xuICAgIHRoaXMueCA9IHRoaXMuY3VydmUuemVybztcbiAgICB0aGlzLnkgPSB0aGlzLmN1cnZlLm9uZTtcbiAgICB0aGlzLnogPSB0aGlzLmN1cnZlLm9uZTtcbiAgICB0aGlzLnQgPSB0aGlzLmN1cnZlLnplcm87XG4gICAgdGhpcy56T25lID0gdHJ1ZTtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLnggPSBuZXcgQk4oeCwgMTYpO1xuICAgIHRoaXMueSA9IG5ldyBCTih5LCAxNik7XG4gICAgdGhpcy56ID0geiA/IG5ldyBCTih6LCAxNikgOiB0aGlzLmN1cnZlLm9uZTtcbiAgICB0aGlzLnQgPSB0ICYmIG5ldyBCTih0LCAxNik7XG4gICAgaWYgKCF0aGlzLngucmVkKVxuICAgICAgdGhpcy54ID0gdGhpcy54LnRvUmVkKHRoaXMuY3VydmUucmVkKTtcbiAgICBpZiAoIXRoaXMueS5yZWQpXG4gICAgICB0aGlzLnkgPSB0aGlzLnkudG9SZWQodGhpcy5jdXJ2ZS5yZWQpO1xuICAgIGlmICghdGhpcy56LnJlZClcbiAgICAgIHRoaXMueiA9IHRoaXMuei50b1JlZCh0aGlzLmN1cnZlLnJlZCk7XG4gICAgaWYgKHRoaXMudCAmJiAhdGhpcy50LnJlZClcbiAgICAgIHRoaXMudCA9IHRoaXMudC50b1JlZCh0aGlzLmN1cnZlLnJlZCk7XG4gICAgdGhpcy56T25lID0gdGhpcy56ID09PSB0aGlzLmN1cnZlLm9uZTtcblxuICAgIC8vIFVzZSBleHRlbmRlZCBjb29yZGluYXRlc1xuICAgIGlmICh0aGlzLmN1cnZlLmV4dGVuZGVkICYmICF0aGlzLnQpIHtcbiAgICAgIHRoaXMudCA9IHRoaXMueC5yZWRNdWwodGhpcy55KTtcbiAgICAgIGlmICghdGhpcy56T25lKVxuICAgICAgICB0aGlzLnQgPSB0aGlzLnQucmVkTXVsKHRoaXMuei5yZWRJbnZtKCkpO1xuICAgIH1cbiAgfVxufVxuaW5oZXJpdHMoUG9pbnQsIEJhc2UuQmFzZVBvaW50KTtcblxuRWR3YXJkc0N1cnZlLnByb3RvdHlwZS5wb2ludEZyb21KU09OID0gZnVuY3Rpb24gcG9pbnRGcm9tSlNPTihvYmopIHtcbiAgcmV0dXJuIFBvaW50LmZyb21KU09OKHRoaXMsIG9iaik7XG59O1xuXG5FZHdhcmRzQ3VydmUucHJvdG90eXBlLnBvaW50ID0gZnVuY3Rpb24gcG9pbnQoeCwgeSwgeiwgdCkge1xuICByZXR1cm4gbmV3IFBvaW50KHRoaXMsIHgsIHksIHosIHQpO1xufTtcblxuUG9pbnQuZnJvbUpTT04gPSBmdW5jdGlvbiBmcm9tSlNPTihjdXJ2ZSwgb2JqKSB7XG4gIHJldHVybiBuZXcgUG9pbnQoY3VydmUsIG9ialswXSwgb2JqWzFdLCBvYmpbMl0pO1xufTtcblxuUG9pbnQucHJvdG90eXBlLmluc3BlY3QgPSBmdW5jdGlvbiBpbnNwZWN0KCkge1xuICBpZiAodGhpcy5pc0luZmluaXR5KCkpXG4gICAgcmV0dXJuICc8RUMgUG9pbnQgSW5maW5pdHk+JztcbiAgcmV0dXJuICc8RUMgUG9pbnQgeDogJyArIHRoaXMueC5mcm9tUmVkKCkudG9TdHJpbmcoMTYsIDIpICtcbiAgICAgICcgeTogJyArIHRoaXMueS5mcm9tUmVkKCkudG9TdHJpbmcoMTYsIDIpICtcbiAgICAgICcgejogJyArIHRoaXMuei5mcm9tUmVkKCkudG9TdHJpbmcoMTYsIDIpICsgJz4nO1xufTtcblxuUG9pbnQucHJvdG90eXBlLmlzSW5maW5pdHkgPSBmdW5jdGlvbiBpc0luZmluaXR5KCkge1xuICAvLyBYWFggVGhpcyBjb2RlIGFzc3VtZXMgdGhhdCB6ZXJvIGlzIGFsd2F5cyB6ZXJvIGluIHJlZFxuICByZXR1cm4gdGhpcy54LmNtcG4oMCkgPT09IDAgJiZcbiAgICAodGhpcy55LmNtcCh0aGlzLnopID09PSAwIHx8XG4gICAgKHRoaXMuek9uZSAmJiB0aGlzLnkuY21wKHRoaXMuY3VydmUuYykgPT09IDApKTtcbn07XG5cblBvaW50LnByb3RvdHlwZS5fZXh0RGJsID0gZnVuY3Rpb24gX2V4dERibCgpIHtcbiAgLy8gaHlwZXJlbGxpcHRpYy5vcmcvRUZEL2cxcC9hdXRvLXR3aXN0ZWQtZXh0ZW5kZWQtMS5odG1sXG4gIC8vICAgICAjZG91YmxpbmctZGJsLTIwMDgtaHdjZFxuICAvLyA0TSArIDRTXG5cbiAgLy8gQSA9IFgxXjJcbiAgdmFyIGEgPSB0aGlzLngucmVkU3FyKCk7XG4gIC8vIEIgPSBZMV4yXG4gIHZhciBiID0gdGhpcy55LnJlZFNxcigpO1xuICAvLyBDID0gMiAqIFoxXjJcbiAgdmFyIGMgPSB0aGlzLnoucmVkU3FyKCk7XG4gIGMgPSBjLnJlZElBZGQoYyk7XG4gIC8vIEQgPSBhICogQVxuICB2YXIgZCA9IHRoaXMuY3VydmUuX211bEEoYSk7XG4gIC8vIEUgPSAoWDEgKyBZMSleMiAtIEEgLSBCXG4gIHZhciBlID0gdGhpcy54LnJlZEFkZCh0aGlzLnkpLnJlZFNxcigpLnJlZElTdWIoYSkucmVkSVN1YihiKTtcbiAgLy8gRyA9IEQgKyBCXG4gIHZhciBnID0gZC5yZWRBZGQoYik7XG4gIC8vIEYgPSBHIC0gQ1xuICB2YXIgZiA9IGcucmVkU3ViKGMpO1xuICAvLyBIID0gRCAtIEJcbiAgdmFyIGggPSBkLnJlZFN1YihiKTtcbiAgLy8gWDMgPSBFICogRlxuICB2YXIgbnggPSBlLnJlZE11bChmKTtcbiAgLy8gWTMgPSBHICogSFxuICB2YXIgbnkgPSBnLnJlZE11bChoKTtcbiAgLy8gVDMgPSBFICogSFxuICB2YXIgbnQgPSBlLnJlZE11bChoKTtcbiAgLy8gWjMgPSBGICogR1xuICB2YXIgbnogPSBmLnJlZE11bChnKTtcbiAgcmV0dXJuIHRoaXMuY3VydmUucG9pbnQobngsIG55LCBueiwgbnQpO1xufTtcblxuUG9pbnQucHJvdG90eXBlLl9wcm9qRGJsID0gZnVuY3Rpb24gX3Byb2pEYmwoKSB7XG4gIC8vIGh5cGVyZWxsaXB0aWMub3JnL0VGRC9nMXAvYXV0by10d2lzdGVkLXByb2plY3RpdmUuaHRtbFxuICAvLyAgICAgI2RvdWJsaW5nLWRibC0yMDA4LWJiamxwXG4gIC8vICAgICAjZG91YmxpbmctZGJsLTIwMDctYmxcbiAgLy8gYW5kIG90aGVyc1xuICAvLyBHZW5lcmFsbHkgM00gKyA0UyBvciAyTSArIDRTXG5cbiAgLy8gQiA9IChYMSArIFkxKV4yXG4gIHZhciBiID0gdGhpcy54LnJlZEFkZCh0aGlzLnkpLnJlZFNxcigpO1xuICAvLyBDID0gWDFeMlxuICB2YXIgYyA9IHRoaXMueC5yZWRTcXIoKTtcbiAgLy8gRCA9IFkxXjJcbiAgdmFyIGQgPSB0aGlzLnkucmVkU3FyKCk7XG5cbiAgdmFyIG54O1xuICB2YXIgbnk7XG4gIHZhciBuejtcbiAgaWYgKHRoaXMuY3VydmUudHdpc3RlZCkge1xuICAgIC8vIEUgPSBhICogQ1xuICAgIHZhciBlID0gdGhpcy5jdXJ2ZS5fbXVsQShjKTtcbiAgICAvLyBGID0gRSArIERcbiAgICB2YXIgZiA9IGUucmVkQWRkKGQpO1xuICAgIGlmICh0aGlzLnpPbmUpIHtcbiAgICAgIC8vIFgzID0gKEIgLSBDIC0gRCkgKiAoRiAtIDIpXG4gICAgICBueCA9IGIucmVkU3ViKGMpLnJlZFN1YihkKS5yZWRNdWwoZi5yZWRTdWIodGhpcy5jdXJ2ZS50d28pKTtcbiAgICAgIC8vIFkzID0gRiAqIChFIC0gRClcbiAgICAgIG55ID0gZi5yZWRNdWwoZS5yZWRTdWIoZCkpO1xuICAgICAgLy8gWjMgPSBGXjIgLSAyICogRlxuICAgICAgbnogPSBmLnJlZFNxcigpLnJlZFN1YihmKS5yZWRTdWIoZik7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIEggPSBaMV4yXG4gICAgICB2YXIgaCA9IHRoaXMuei5yZWRTcXIoKTtcbiAgICAgIC8vIEogPSBGIC0gMiAqIEhcbiAgICAgIHZhciBqID0gZi5yZWRTdWIoaCkucmVkSVN1YihoKTtcbiAgICAgIC8vIFgzID0gKEItQy1EKSpKXG4gICAgICBueCA9IGIucmVkU3ViKGMpLnJlZElTdWIoZCkucmVkTXVsKGopO1xuICAgICAgLy8gWTMgPSBGICogKEUgLSBEKVxuICAgICAgbnkgPSBmLnJlZE11bChlLnJlZFN1YihkKSk7XG4gICAgICAvLyBaMyA9IEYgKiBKXG4gICAgICBueiA9IGYucmVkTXVsKGopO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICAvLyBFID0gQyArIERcbiAgICB2YXIgZSA9IGMucmVkQWRkKGQpO1xuICAgIC8vIEggPSAoYyAqIFoxKV4yXG4gICAgdmFyIGggPSB0aGlzLmN1cnZlLl9tdWxDKHRoaXMueikucmVkU3FyKCk7XG4gICAgLy8gSiA9IEUgLSAyICogSFxuICAgIHZhciBqID0gZS5yZWRTdWIoaCkucmVkU3ViKGgpO1xuICAgIC8vIFgzID0gYyAqIChCIC0gRSkgKiBKXG4gICAgbnggPSB0aGlzLmN1cnZlLl9tdWxDKGIucmVkSVN1YihlKSkucmVkTXVsKGopO1xuICAgIC8vIFkzID0gYyAqIEUgKiAoQyAtIEQpXG4gICAgbnkgPSB0aGlzLmN1cnZlLl9tdWxDKGUpLnJlZE11bChjLnJlZElTdWIoZCkpO1xuICAgIC8vIFozID0gRSAqIEpcbiAgICBueiA9IGUucmVkTXVsKGopO1xuICB9XG4gIHJldHVybiB0aGlzLmN1cnZlLnBvaW50KG54LCBueSwgbnopO1xufTtcblxuUG9pbnQucHJvdG90eXBlLmRibCA9IGZ1bmN0aW9uIGRibCgpIHtcbiAgaWYgKHRoaXMuaXNJbmZpbml0eSgpKVxuICAgIHJldHVybiB0aGlzO1xuXG4gIC8vIERvdWJsZSBpbiBleHRlbmRlZCBjb29yZGluYXRlc1xuICBpZiAodGhpcy5jdXJ2ZS5leHRlbmRlZClcbiAgICByZXR1cm4gdGhpcy5fZXh0RGJsKCk7XG4gIGVsc2VcbiAgICByZXR1cm4gdGhpcy5fcHJvakRibCgpO1xufTtcblxuUG9pbnQucHJvdG90eXBlLl9leHRBZGQgPSBmdW5jdGlvbiBfZXh0QWRkKHApIHtcbiAgLy8gaHlwZXJlbGxpcHRpYy5vcmcvRUZEL2cxcC9hdXRvLXR3aXN0ZWQtZXh0ZW5kZWQtMS5odG1sXG4gIC8vICAgICAjYWRkaXRpb24tYWRkLTIwMDgtaHdjZC0zXG4gIC8vIDhNXG5cbiAgLy8gQSA9IChZMSAtIFgxKSAqIChZMiAtIFgyKVxuICB2YXIgYSA9IHRoaXMueS5yZWRTdWIodGhpcy54KS5yZWRNdWwocC55LnJlZFN1YihwLngpKTtcbiAgLy8gQiA9IChZMSArIFgxKSAqIChZMiArIFgyKVxuICB2YXIgYiA9IHRoaXMueS5yZWRBZGQodGhpcy54KS5yZWRNdWwocC55LnJlZEFkZChwLngpKTtcbiAgLy8gQyA9IFQxICogayAqIFQyXG4gIHZhciBjID0gdGhpcy50LnJlZE11bCh0aGlzLmN1cnZlLmRkKS5yZWRNdWwocC50KTtcbiAgLy8gRCA9IFoxICogMiAqIFoyXG4gIHZhciBkID0gdGhpcy56LnJlZE11bChwLnoucmVkQWRkKHAueikpO1xuICAvLyBFID0gQiAtIEFcbiAgdmFyIGUgPSBiLnJlZFN1YihhKTtcbiAgLy8gRiA9IEQgLSBDXG4gIHZhciBmID0gZC5yZWRTdWIoYyk7XG4gIC8vIEcgPSBEICsgQ1xuICB2YXIgZyA9IGQucmVkQWRkKGMpO1xuICAvLyBIID0gQiArIEFcbiAgdmFyIGggPSBiLnJlZEFkZChhKTtcbiAgLy8gWDMgPSBFICogRlxuICB2YXIgbnggPSBlLnJlZE11bChmKTtcbiAgLy8gWTMgPSBHICogSFxuICB2YXIgbnkgPSBnLnJlZE11bChoKTtcbiAgLy8gVDMgPSBFICogSFxuICB2YXIgbnQgPSBlLnJlZE11bChoKTtcbiAgLy8gWjMgPSBGICogR1xuICB2YXIgbnogPSBmLnJlZE11bChnKTtcbiAgcmV0dXJuIHRoaXMuY3VydmUucG9pbnQobngsIG55LCBueiwgbnQpO1xufTtcblxuUG9pbnQucHJvdG90eXBlLl9wcm9qQWRkID0gZnVuY3Rpb24gX3Byb2pBZGQocCkge1xuICAvLyBoeXBlcmVsbGlwdGljLm9yZy9FRkQvZzFwL2F1dG8tdHdpc3RlZC1wcm9qZWN0aXZlLmh0bWxcbiAgLy8gICAgICNhZGRpdGlvbi1hZGQtMjAwOC1iYmpscFxuICAvLyAgICAgI2FkZGl0aW9uLWFkZC0yMDA3LWJsXG4gIC8vIDEwTSArIDFTXG5cbiAgLy8gQSA9IFoxICogWjJcbiAgdmFyIGEgPSB0aGlzLnoucmVkTXVsKHAueik7XG4gIC8vIEIgPSBBXjJcbiAgdmFyIGIgPSBhLnJlZFNxcigpO1xuICAvLyBDID0gWDEgKiBYMlxuICB2YXIgYyA9IHRoaXMueC5yZWRNdWwocC54KTtcbiAgLy8gRCA9IFkxICogWTJcbiAgdmFyIGQgPSB0aGlzLnkucmVkTXVsKHAueSk7XG4gIC8vIEUgPSBkICogQyAqIERcbiAgdmFyIGUgPSB0aGlzLmN1cnZlLmQucmVkTXVsKGMpLnJlZE11bChkKTtcbiAgLy8gRiA9IEIgLSBFXG4gIHZhciBmID0gYi5yZWRTdWIoZSk7XG4gIC8vIEcgPSBCICsgRVxuICB2YXIgZyA9IGIucmVkQWRkKGUpO1xuICAvLyBYMyA9IEEgKiBGICogKChYMSArIFkxKSAqIChYMiArIFkyKSAtIEMgLSBEKVxuICB2YXIgdG1wID0gdGhpcy54LnJlZEFkZCh0aGlzLnkpLnJlZE11bChwLngucmVkQWRkKHAueSkpLnJlZElTdWIoYykucmVkSVN1YihkKTtcbiAgdmFyIG54ID0gYS5yZWRNdWwoZikucmVkTXVsKHRtcCk7XG4gIHZhciBueTtcbiAgdmFyIG56O1xuICBpZiAodGhpcy5jdXJ2ZS50d2lzdGVkKSB7XG4gICAgLy8gWTMgPSBBICogRyAqIChEIC0gYSAqIEMpXG4gICAgbnkgPSBhLnJlZE11bChnKS5yZWRNdWwoZC5yZWRTdWIodGhpcy5jdXJ2ZS5fbXVsQShjKSkpO1xuICAgIC8vIFozID0gRiAqIEdcbiAgICBueiA9IGYucmVkTXVsKGcpO1xuICB9IGVsc2Uge1xuICAgIC8vIFkzID0gQSAqIEcgKiAoRCAtIEMpXG4gICAgbnkgPSBhLnJlZE11bChnKS5yZWRNdWwoZC5yZWRTdWIoYykpO1xuICAgIC8vIFozID0gYyAqIEYgKiBHXG4gICAgbnogPSB0aGlzLmN1cnZlLl9tdWxDKGYpLnJlZE11bChnKTtcbiAgfVxuICByZXR1cm4gdGhpcy5jdXJ2ZS5wb2ludChueCwgbnksIG56KTtcbn07XG5cblBvaW50LnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiBhZGQocCkge1xuICBpZiAodGhpcy5pc0luZmluaXR5KCkpXG4gICAgcmV0dXJuIHA7XG4gIGlmIChwLmlzSW5maW5pdHkoKSlcbiAgICByZXR1cm4gdGhpcztcblxuICBpZiAodGhpcy5jdXJ2ZS5leHRlbmRlZClcbiAgICByZXR1cm4gdGhpcy5fZXh0QWRkKHApO1xuICBlbHNlXG4gICAgcmV0dXJuIHRoaXMuX3Byb2pBZGQocCk7XG59O1xuXG5Qb2ludC5wcm90b3R5cGUubXVsID0gZnVuY3Rpb24gbXVsKGspIHtcbiAgaWYgKHRoaXMuX2hhc0RvdWJsZXMoaykpXG4gICAgcmV0dXJuIHRoaXMuY3VydmUuX2ZpeGVkTmFmTXVsKHRoaXMsIGspO1xuICBlbHNlXG4gICAgcmV0dXJuIHRoaXMuY3VydmUuX3duYWZNdWwodGhpcywgayk7XG59O1xuXG5Qb2ludC5wcm90b3R5cGUubXVsQWRkID0gZnVuY3Rpb24gbXVsQWRkKGsxLCBwLCBrMikge1xuICByZXR1cm4gdGhpcy5jdXJ2ZS5fd25hZk11bEFkZCgxLCBbIHRoaXMsIHAgXSwgWyBrMSwgazIgXSwgMiwgZmFsc2UpO1xufTtcblxuUG9pbnQucHJvdG90eXBlLmptdWxBZGQgPSBmdW5jdGlvbiBqbXVsQWRkKGsxLCBwLCBrMikge1xuICByZXR1cm4gdGhpcy5jdXJ2ZS5fd25hZk11bEFkZCgxLCBbIHRoaXMsIHAgXSwgWyBrMSwgazIgXSwgMiwgdHJ1ZSk7XG59O1xuXG5Qb2ludC5wcm90b3R5cGUubm9ybWFsaXplID0gZnVuY3Rpb24gbm9ybWFsaXplKCkge1xuICBpZiAodGhpcy56T25lKVxuICAgIHJldHVybiB0aGlzO1xuXG4gIC8vIE5vcm1hbGl6ZSBjb29yZGluYXRlc1xuICB2YXIgemkgPSB0aGlzLnoucmVkSW52bSgpO1xuICB0aGlzLnggPSB0aGlzLngucmVkTXVsKHppKTtcbiAgdGhpcy55ID0gdGhpcy55LnJlZE11bCh6aSk7XG4gIGlmICh0aGlzLnQpXG4gICAgdGhpcy50ID0gdGhpcy50LnJlZE11bCh6aSk7XG4gIHRoaXMueiA9IHRoaXMuY3VydmUub25lO1xuICB0aGlzLnpPbmUgPSB0cnVlO1xuICByZXR1cm4gdGhpcztcbn07XG5cblBvaW50LnByb3RvdHlwZS5uZWcgPSBmdW5jdGlvbiBuZWcoKSB7XG4gIHJldHVybiB0aGlzLmN1cnZlLnBvaW50KHRoaXMueC5yZWROZWcoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy55LFxuICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnosXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudCAmJiB0aGlzLnQucmVkTmVnKCkpO1xufTtcblxuUG9pbnQucHJvdG90eXBlLmdldFggPSBmdW5jdGlvbiBnZXRYKCkge1xuICB0aGlzLm5vcm1hbGl6ZSgpO1xuICByZXR1cm4gdGhpcy54LmZyb21SZWQoKTtcbn07XG5cblBvaW50LnByb3RvdHlwZS5nZXRZID0gZnVuY3Rpb24gZ2V0WSgpIHtcbiAgdGhpcy5ub3JtYWxpemUoKTtcbiAgcmV0dXJuIHRoaXMueS5mcm9tUmVkKCk7XG59O1xuXG5Qb2ludC5wcm90b3R5cGUuZXEgPSBmdW5jdGlvbiBlcShvdGhlcikge1xuICByZXR1cm4gdGhpcyA9PT0gb3RoZXIgfHxcbiAgICAgICAgIHRoaXMuZ2V0WCgpLmNtcChvdGhlci5nZXRYKCkpID09PSAwICYmXG4gICAgICAgICB0aGlzLmdldFkoKS5jbXAob3RoZXIuZ2V0WSgpKSA9PT0gMDtcbn07XG5cblBvaW50LnByb3RvdHlwZS5lcVhUb1AgPSBmdW5jdGlvbiBlcVhUb1AoeCkge1xuICB2YXIgcnggPSB4LnRvUmVkKHRoaXMuY3VydmUucmVkKS5yZWRNdWwodGhpcy56KTtcbiAgaWYgKHRoaXMueC5jbXAocngpID09PSAwKVxuICAgIHJldHVybiB0cnVlO1xuXG4gIHZhciB4YyA9IHguY2xvbmUoKTtcbiAgdmFyIHQgPSB0aGlzLmN1cnZlLnJlZE4ucmVkTXVsKHRoaXMueik7XG4gIGZvciAoOzspIHtcbiAgICB4Yy5pYWRkKHRoaXMuY3VydmUubik7XG4gICAgaWYgKHhjLmNtcCh0aGlzLmN1cnZlLnApID49IDApXG4gICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICByeC5yZWRJQWRkKHQpO1xuICAgIGlmICh0aGlzLnguY21wKHJ4KSA9PT0gMClcbiAgICAgIHJldHVybiB0cnVlO1xuICB9XG59O1xuXG4vLyBDb21wYXRpYmlsaXR5IHdpdGggQmFzZUN1cnZlXG5Qb2ludC5wcm90b3R5cGUudG9QID0gUG9pbnQucHJvdG90eXBlLm5vcm1hbGl6ZTtcblBvaW50LnByb3RvdHlwZS5taXhlZEFkZCA9IFBvaW50LnByb3RvdHlwZS5hZGQ7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgZG91Ymxlczoge1xuICAgIHN0ZXA6IDQsXG4gICAgcG9pbnRzOiBbXG4gICAgICBbXG4gICAgICAgICdlNjBmY2U5M2I1OWU5ZWM1MzAxMWFhYmMyMWMyM2U5N2IyYTMxMzY5Yjg3YTVhZTljNDRlZTg5ZTJhNmRlYzBhJyxcbiAgICAgICAgJ2Y3ZTM1MDczOTllNTk1OTI5ZGI5OWYzNGY1NzkzNzEwMTI5Njg5MWU0NGQyM2YwYmUxZjMyY2NlNjk2MTY4MjEnXG4gICAgICBdLFxuICAgICAgW1xuICAgICAgICAnODI4MjI2MzIxMmM2MDlkOWVhMmE2ZTNlMTcyZGUyMzhkOGMzOWNhYmQ1YWMxY2ExMDY0NmUyM2ZkNWY1MTUwOCcsXG4gICAgICAgICcxMWY4YTgwOTg1NTdkZmU0NWU4MjU2ZTgzMGI2MGFjZTYyZDYxM2FjMmY3YjE3YmVkMzFiNmVhZmY2ZTI2Y2FmJ1xuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgJzE3NWUxNTlmNzI4Yjg2NWE3MmY5OWNjNmM2ZmM4NDZkZTBiOTM4MzNmZDIyMjJlZDczZmNlNWI1NTFlNWI3MzknLFxuICAgICAgICAnZDM1MDZlMGQ5ZTNjNzllYmE0ZWY5N2E1MWZmNzFmNWVhY2I1OTU1YWRkMjQzNDVjNmVmYTZmZmVlOWZlZDY5NSdcbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgICczNjNkOTBkNDQ3YjAwYzljOTljZWFjMDViNjI2MmVlMDUzNDQxYzdlNTU1NTJmZmU1MjZiYWQ4ZjgzZmY0NjQwJyxcbiAgICAgICAgJzRlMjczYWRmYzczMjIyMTk1M2I0NDUzOTdmMzM2MzE0NWI5YTg5MDA4MTk5ZWNiNjIwMDNjN2YzYmVlOWRlOSdcbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgICc4YjRiNWYxNjVkZjNjMmJlOGM2MjQ0YjViNzQ1NjM4ODQzZTRhNzgxYTE1YmNkMWI2OWY3OWE1NWRmZmRmODBjJyxcbiAgICAgICAgJzRhYWQwYTZmNjhkMzA4YjRiM2ZiZDc4MTNhYjBkYTA0ZjllMzM2NTQ2MTYyZWU1NmIzZWZmMGM2NWZkNGZkMzYnXG4gICAgICBdLFxuICAgICAgW1xuICAgICAgICAnNzIzY2JhYTZlNWRiOTk2ZDZiZjc3MWMwMGJkNTQ4YzdiNzAwZGJmZmE2YzBlNzdiY2I2MTE1OTI1MjMyZmNkYScsXG4gICAgICAgICc5NmU4NjdiNTU5NWNjNDk4YTkyMTEzNzQ4ODgyNGQ2ZTI2NjBhMDY1Mzc3OTQ5NDgwMWRjMDY5ZDllYjM5ZjVmJ1xuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgJ2VlYmZhNGQ0OTNiZWJmOThiYTVmZWVjODEyYzJkM2I1MDk0Nzk2MTIzN2E5MTk4MzlhNTMzZWNhMGU3ZGQ3ZmEnLFxuICAgICAgICAnNWQ5YThjYTM5NzBlZjBmMjY5ZWU3ZWRhZjE3ODA4OWQ5YWU0Y2RjM2E3MTFmNzEyZGRmZDRmZGFlMWRlODk5OSdcbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgICcxMDBmNDRkYTY5NmU3MTY3Mjc5MWQwYTA5YjdiZGU0NTlmMTIxNWEyOWIzYzAzYmZlZmQ3ODM1YjM5YTQ4ZGIwJyxcbiAgICAgICAgJ2NkZDllMTMxOTJhMDBiNzcyZWM4ZjMzMDBjMDkwNjY2YjdmZjRhMThmZjUxOTVhYzBmYmQ1Y2Q2MmJjNjVhMDknXG4gICAgICBdLFxuICAgICAgW1xuICAgICAgICAnZTEwMzFiZTI2MmM3ZWQxYjFkYzkyMjdhNGEwNGMwMTdhNzdmOGQ0NDY0ZjNiMzg1MmM4YWNkZTZlNTM0ZmQyZCcsXG4gICAgICAgICc5ZDcwNjE5Mjg5NDA0MDVlNmJiNmE0MTc2NTk3NTM1YWYyOTJkZDQxOWUxY2VkNzlhNDRmMThmMjk0NTZhMDBkJ1xuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgJ2ZlZWE2Y2FlNDZkNTViNTMwYWMyODM5ZjE0M2JkN2VjNWNmOGIyNjZhNDFkNmFmNTJkNWU2ODhkOTA5NDY5NmQnLFxuICAgICAgICAnZTU3YzZiNmM5N2RjZTFiYWIwNmU0ZTEyYmYzZWNkNWM5ODFjODk1N2NjNDE0NDJkMzE1NWRlYmYxODA5MDA4OCdcbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgICdkYTY3YTkxZDkxMDQ5Y2RjYjM2N2JlNGJlNmZmY2EzY2ZlZWQ2NTdkODA4NTgzZGUzM2ZhOTc4YmMxZWM2Y2IxJyxcbiAgICAgICAgJzliYWNhYTM1NDgxNjQyYmM0MWY0NjNmN2VjOTc4MGU1ZGVjN2FkYzUwOGY3NDBhMTdlOWVhOGUyN2E2OGJlMWQnXG4gICAgICBdLFxuICAgICAgW1xuICAgICAgICAnNTM5MDRmYWEwYjMzNGNkZGE2ZTAwMDkzNWVmMjIxNTFlYzA4ZDBmN2JiMTEwNjlmNTc1NDVjY2MxYTM3YjdjMCcsXG4gICAgICAgICc1YmMwODdkMGJjODAxMDZkODhjOWVjY2FjMjBkM2MxYzEzOTk5OTgxZTE0NDM0Njk5ZGNiMDk2YjAyMjc3MWM4J1xuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgJzhlN2JjZDBiZDM1OTgzYTc3MTljY2E3NzY0Y2E5MDY3NzliNTNhMDQzYTliOGJjYWVmZjk1OWY0M2FkODYwNDcnLFxuICAgICAgICAnMTBiNzc3MGIyYTNkYTRiMzk0MDMxMDQyMGNhOTUxNDU3OWU4OGUyZTQ3ZmQ2OGIzZWExMDA0N2U4NDYwMzcyYSdcbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgICczODVlZWQzNGMxY2RmZjIxZTZkMDgxODY4OWI4MWJkZTcxYTdmNGYxODM5N2U2NjkwYTg0MWUxNTk5YzQzODYyJyxcbiAgICAgICAgJzI4M2JlYmMzZThlYTIzZjU2NzAxZGUxOWU5ZWJmNDU3NmIzMDRlZWMyMDg2ZGM4Y2MwNDU4ZmU1NTQyZTU0NTMnXG4gICAgICBdLFxuICAgICAgW1xuICAgICAgICAnNmY5ZDliODAzZWNmMTkxNjM3YzczYTQ0MTNkZmExODBmZGRmODRhNTk0N2ZiYzljNjA2ZWQ4NmMzZmFjM2E3JyxcbiAgICAgICAgJzdjODBjNjhlNjAzMDU5YmE2OWI4ZTJhMzBlNDVjNGQ0N2VhNGRkMmY1YzI4MTAwMmQ4Njg5MDYwM2E4NDIxNjAnXG4gICAgICBdLFxuICAgICAgW1xuICAgICAgICAnMzMyMmQ0MDEyNDNjNGUyNTgyYTIxNDdjMTA0ZDZlY2JmNzc0ZDE2M2RiMGY1ZTUzMTNiN2UwZTc0MmQwZTZiZCcsXG4gICAgICAgICc1NmU3MDc5N2U5NjY0ZWY1YmZiMDE5YmM0ZGRhZjliNzI4MDVmNjNlYTI4NzNhZjYyNGYzYTJlOTZjMjhiMmEwJ1xuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgJzg1NjcyYzdkMmRlMGI3ZGEyYmQxNzcwZDg5NjY1ODY4NzQxYjNmOWFmNzY0MzM5NzcyMWQ3NGQyODEzNGFiODMnLFxuICAgICAgICAnN2M0ODFiOWI1YjQzYjJlYjYzNzQwNDliZmE2MmMyZTVlNzdmMTdmY2M1Mjk4ZjQ0YzhlMzA5NGY3OTAzMTNhNidcbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgICc5NDhiZjgwOWIxOTg4YTQ2YjA2YzlmMTkxOTQxM2IxMGY5MjI2YzYwZjY2ODgzMmZmZDk1OWFmNjBjODJhMGEnLFxuICAgICAgICAnNTNhNTYyODU2ZGNiNjY0NmRjNmI3NGM1ZDFjMzQxOGM2ZDRkZmYwOGM5N2NkMmJlZDRjYjdmODhkOGM4ZTU4OSdcbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgICc2MjYwY2U3ZjQ2MTgwMWMzNGYwNjdjZTBmMDI4NzNhOGYxYjBlNDRkZmM2OTc1MmFjY2VjZDgxOWYzOGZkOGU4JyxcbiAgICAgICAgJ2JjMmRhODJiNmZhNWI1NzFhN2YwOTA0OTc3NmExZWY3ZWNkMjkyMjM4MDUxYzE5OGMxYTg0ZTk1YjJiNGFlMTcnXG4gICAgICBdLFxuICAgICAgW1xuICAgICAgICAnZTUwMzdkZTBhZmMxZDhkNDNkODM0ODQxNGJiZjQxMDMwNDNlYzhmNTc1YmZkYzQzMjk1M2NjOGQyMDM3ZmEyZCcsXG4gICAgICAgICc0NTcxNTM0YmFhOTRkM2I1ZjlmOThkMDlmYjk5MGJkZGJkNWY1YjAzZWM0ODFmMTBlMGU1ZGM4NDFkNzU1YmRhJ1xuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgJ2UwNjM3MmIwZjRhMjA3YWRmNWVhOTA1ZThmMTc3MWI0ZTdlOGRiZDFjNmE2YzViNzI1ODY2YTBhZTRmY2U3MjUnLFxuICAgICAgICAnN2E5MDg5NzRiY2UxOGNmZTEyYTI3YmIyYWQ1YTQ4OGNkNzQ4NGE3Nzg3MTA0ODcwYjI3MDM0Zjk0ZWVlMzFkZCdcbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgICcyMTNjN2E3MTVjZDVkNDUzNThkMGJiZjlkYzBjZTAyMjA0YjEwYmRkZTJhM2Y1ODU0MGFkNjkwOGQwNTU5NzU0JyxcbiAgICAgICAgJzRiNmRhZDBiNWFlNDYyNTA3MDEzYWQwNjI0NWJhMTkwYmI0ODUwZjVmMzZhN2VlZGRmZjJjMjc1MzRiNDU4ZjInXG4gICAgICBdLFxuICAgICAgW1xuICAgICAgICAnNGU3YzI3MmE3YWY0YjM0ZThkYmI5MzUyYTU0MTlhODdlMjgzOGM3MGFkYzYyY2RkZjBjYzNhM2IwOGZiZDUzYycsXG4gICAgICAgICcxNzc0OWM3NjZjOWQwYjE4ZTE2ZmQwOWY2ZGVmNjgxYjUzMGI5NjE0YmZmN2RkMzNlMGIzOTQxODE3ZGNhYWU2J1xuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgJ2ZlYTc0ZTNkYmU3NzhiMWIxMGYyMzhhZDYxNjg2YWE1Yzc2ZTNkYjJiZTQzMDU3NjMyNDI3ZTI4NDBmYjI3YjYnLFxuICAgICAgICAnNmUwNTY4ZGI5YjBiMTMyOTdjZjY3NGRlY2NiNmFmOTMxMjZiNTk2Yjk3M2Y3Yjc3NzAxZDNkYjdmMjNjYjk2ZidcbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgICc3NmU2NDExM2Y2NzdjZjBlMTBhMjU3MGQ1OTk5NjhkMzE1NDRlMTc5Yjc2MDQzMjk1MmMwMmE0NDE3YmRkZTM5JyxcbiAgICAgICAgJ2M5MGRkZjhkZWU0ZTk1Y2Y1NzcwNjZkNzA2ODFmMGQzNWUyYTMzZDJiNTZkMjAzMmI0YjE3NTJkMTkwMWFjMDEnXG4gICAgICBdLFxuICAgICAgW1xuICAgICAgICAnYzczOGM1NmIwM2IyYWJlMWU4MjgxYmFhNzQzZjhmOWE4ZjdjYzY0M2RmMjZjYmVlM2FiMTUwMjQyYmNiYjg5MScsXG4gICAgICAgICc4OTNmYjU3ODk1MWFkMjUzN2Y3MThmMmVhY2JmYmJiYjgyMzE0ZWVmNzg4MGNmZTkxN2U3MzVkOTY5OWE4NGMzJ1xuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgJ2Q4OTU2MjY1NDhiNjViODFlMjY0Yzc2MzdjOTcyODc3ZDFkNzJlNWYzYTkyNTAxNDM3MmU5ZjY1ODhmNmMxNGInLFxuICAgICAgICAnZmViZmFhMzhmMmJjN2VhZTcyOGVjNjA4MThjMzQwZWIwMzQyOGQ2MzJiYjA2N2UxNzkzNjNlZDc1ZDdkOTkxZidcbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgICdiOGRhOTQwMzJhOTU3NTE4ZWIwZjY0MzM1NzFlODc2MWNlZmZjNzM2OTNlODRlZGQ0OTE1MGE1NjRmNjc2ZTAzJyxcbiAgICAgICAgJzI4MDRkZmE0NDgwNWExZTRkN2M5OWNjOTc2MjgwOGIwOTJjYzU4NGQ5NWZmM2I1MTE0ODhlNGU3NGVmZGY2ZTcnXG4gICAgICBdLFxuICAgICAgW1xuICAgICAgICAnZTgwZmVhMTQ0NDFmYjMzYTdkOGFkYWI5NDc1ZDdmYWIyMDE5ZWZmYjUxNTZhNzkyZjFhMTE3NzhlM2MwZGY1ZCcsXG4gICAgICAgICdlZWQxZGU3ZjYzOGUwMDc3MWU4OTc2OGNhM2NhOTQ0NzJkMTU1ZTgwYWYzMjJlYTlmY2I0MjkxYjZhYzllYzc4J1xuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgJ2EzMDE2OTdiZGZjZDcwNDMxM2JhNDhlNTFkNTY3NTQzZjJhMTgyMDMxZWZkNjkxNWRkYzA3YmJjYzRlMTYwNzAnLFxuICAgICAgICAnNzM3MGY5MWNmYjY3ZTRmNTA4MTgwOWZhMjVkNDBmOWIxNzM1ZGJmN2MwYTExYTEzMGMwZDFhMDQxZTE3N2VhMSdcbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgICc5MGFkODViMzg5ZDZiOTM2NDYzZjlkMDUxMjY3OGRlMjA4Y2MzMzBiMTEzMDdmZmZhYjdhYzYzZTNmYjA0ZWQ0JyxcbiAgICAgICAgJ2U1MDdhMzYyMGEzODI2MWFmZmRjYmQ5NDI3MjIyYjgzOWFlZmFiZTE1ODI4OTRkOTkxZDRkNDhjYjZlZjE1MCdcbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgICc4ZjY4YjlkMmY2M2I1ZjMzOTIzOWMxYWQ5ODFmMTYyZWU4OGM1Njc4NzIzZWEzMzUxYjdiNDQ0YzllYzRjMGRhJyxcbiAgICAgICAgJzY2MmE5ZjJkYmEwNjM5ODZkZTFkOTBjMmI2YmUyMTVkYmJlYTJjZmU5NTUxMGJmZGYyM2NiZjc5NTAxZmZmODInXG4gICAgICBdLFxuICAgICAgW1xuICAgICAgICAnZTRmM2ZiMDE3NmFmODVkNjVmZjk5ZmY5MTk4YzM2MDkxZjQ4ZTg2NTAzNjgxZTNlNjY4NmZkNTA1MzIzMWUxMScsXG4gICAgICAgICcxZTYzNjMzYWQwZWY0ZjFjMTY2MWE2ZDBlYTAyYjcyODZjYzdlNzRlYzk1MWQxYzk4MjJjMzg1NzZmZWI3M2JjJ1xuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgJzhjMDBmYTliMThlYmYzMzFlYjk2MTUzN2E0NWE0MjY2YzcwMzRmMmYwZDRlMWQwNzE2ZmI2ZWFlMjBlYWUyOWUnLFxuICAgICAgICAnZWZhNDcyNjdmZWE1MjFhMWE5ZGMzNDNhMzczNmM5NzRjMmZhZGFmYTgxZTM2YzU0ZTdkMmE0YzY2NzAyNDE0YidcbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgICdlN2EyNmNlNjlkZDQ4MjlmM2UxMGNlYzBhOWU5OGVkMzE0M2QwODRmMzA4YjkyYzA5OTdmZGRmYzYwY2IzZTQxJyxcbiAgICAgICAgJzJhNzU4ZTMwMGZhNzk4NGI0NzFiMDA2YTFhYWZiYjE4ZDBhNmIyYzA0MjBlODNlMjBlOGE5NDIxY2YyY2ZkNTEnXG4gICAgICBdLFxuICAgICAgW1xuICAgICAgICAnYjY0NTllMGVlMzY2MmVjOGQyMzU0MGMyMjNiY2JkYzU3MWNiY2I5NjdkNzk0MjRmM2NmMjllYjNkZTZiODBlZicsXG4gICAgICAgICc2N2M4NzZkMDZmM2UwNmRlMWRhZGYxNmU1NjYxZGIzYzRiM2FlNmQ0OGUzNWIyZmYzMGJmMGI2MWE3MWJhNDUnXG4gICAgICBdLFxuICAgICAgW1xuICAgICAgICAnZDY4YTgwYzgyODBiYjg0MDc5MzIzNGFhMTE4ZjA2MjMxZDZmMWZjNjdlNzNjNWE1ZGVkYTBmNWI0OTY5NDNlOCcsXG4gICAgICAgICdkYjhiYTlmZmY0YjU4NmQwMGM0YjFmOTE3N2IwZTI4YjViMGU3YjhmNzg0NTI5NWEyOTRjODQyNjZiMTMzMTIwJ1xuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgJzMyNGFlZDdkZjY1YzgwNDI1MmRjMDI3MDkwN2EzMGIwOTYxMmFlYjk3MzQ0OWNlYTQwOTU5ODBmYzI4ZDNkNWQnLFxuICAgICAgICAnNjQ4YTM2NTc3NGI2MWYyZmYxMzBjMGMzNWFlYzFmNGYxOTIxM2IwYzdlMzMyODQzOTY3MjI0YWY5NmFiN2M4NCdcbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgICc0ZGY5YzE0OTE5Y2RlNjFmNmQ1MWRmZGJlNWZlZTVkY2VlYzQxNDNiYThkMWNhODg4ZThiZDM3M2ZkMDU0Yzk2JyxcbiAgICAgICAgJzM1ZWM1MTA5MmQ4NzI4MDUwOTc0YzIzYTFkODVkNGI1ZDUwNmNkYzI4ODQ5MDE5MmViYWMwNmNhZDEwZDVkJ1xuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgJzljMzkxOWE4NGE0NzQ4NzBmYWVkOGE5YzFjYzY2MDIxNTIzNDg5MDU0ZDdmMDMwOGNiZmM5OWM4YWMxZjk4Y2QnLFxuICAgICAgICAnZGRiODRmMGY0YTRkZGQ1NzU4NGYwNDRiZjI2MGU2NDE5MDUzMjZmNzZjNjRjOGU2YmU3ZTVlMDNkNGZjNTk5ZCdcbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgICc2MDU3MTcwYjFkZDEyZmRmOGRlMDVmMjgxZDhlMDZiYjkxZTE0OTNhOGI5MWQ0Y2M1YTIxMzgyMTIwYTk1OWU1JyxcbiAgICAgICAgJzlhMWFmMGIyNmE2YTQ4MDdhZGQ5YTJkYWY3MWRmMjYyNDY1MTUyYmMzZWUyNGM2NWU4OTliZTkzMjM4NWEyYTgnXG4gICAgICBdLFxuICAgICAgW1xuICAgICAgICAnYTU3NmRmOGUyM2EwODQxMTQyMTQzOWE0NTE4ZGEzMTg4MGNlZjBmYmE3ZDRkZjEyYjFhNjk3M2VlY2I5NDI2NicsXG4gICAgICAgICc0MGE2YmYyMGU3NjY0MGIyYzkyYjk3YWZlNThjZDgyYzQzMmUxMGE3ZjUxNGQ5ZjNlZThiZTExYWUxYjI4ZWM4J1xuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgJzc3NzhhNzhjMjhkZWMzZTMwYTA1ZmU5NjI5ZGU4YzM4YmIzMGQxZjVjZjlhM2EyMDhmNzYzODg5YmU1OGFkNzEnLFxuICAgICAgICAnMzQ2MjZkOWFiNWE1YjIyZmY3MDk4ZTEyZjJmZjU4MDA4N2IzODQxMWZmMjRhYzU2M2I1MTNmYzFmZDlmNDNhYydcbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgICc5Mjg5NTVlZTYzN2E4NDQ2MzcyOWZkMzBlN2FmZDJlZDVmOTYyNzRlNWFkN2U1Y2IwOWVkYTljMDZkOTAzYWMnLFxuICAgICAgICAnYzI1NjIxMDAzZDNmNDJhODI3Yjc4YTEzMDkzYTk1ZWVhYzNkMjZlZmE4YThkODNmYzUxODBlOTM1YmNkMDkxZidcbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgICc4NWQwZmVmM2VjNmRiMTA5Mzk5MDY0ZjNhMGUzYjI4NTU2NDViNGE5MDdhZDM1NDUyN2FhZTc1MTYzZDgyNzUxJyxcbiAgICAgICAgJzFmMDM2NDg0MTNhMzhjMGJlMjlkNDk2ZTU4MmNmNTY2M2U4NzUxZTk2ODc3MzMxNTgyYzIzN2EyNGViMWY5NjInXG4gICAgICBdLFxuICAgICAgW1xuICAgICAgICAnZmYyYjBkY2U5N2VlY2U5N2MxYzliNjA0MTc5OGI4NWRmZGZiNmQ4ODgyZGEyMDMwOGY1NDA0ODI0NTI2MDg3ZScsXG4gICAgICAgICc0OTNkMTNmZWY1MjRiYTE4OGFmNGM0ZGM1NGQwNzkzNmM3YjdlZDZmYjkwZTJjZWIyYzk1MWUwMWYwYzI5OTA3J1xuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgJzgyN2ZiYmU0YjFlODgwZWE5ZWQyYjJlNjMwMWIyMTJiNTdmMWVlMTQ4Y2Q2ZGQyODc4MGU1ZTJjZjg1NmUyNDEnLFxuICAgICAgICAnYzYwZjljOTIzYzcyN2IwYjcxYmVmMmM2N2QxZDEyNjg3ZmY3YTYzMTg2OTAzMTY2ZDYwNWI2OGJhZWMyOTNlYydcbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgICdlYWE2NDlmMjFmNTFiZGJhZTdiZTRhZTM0Y2U2ZTUyMTdhNThmZGNlN2Y0N2Y5YWE3ZjNiNThmYTIxMjBlMmIzJyxcbiAgICAgICAgJ2JlMzI3OWVkNWJiYmIwM2FjNjlhODBmODk4NzlhYTVhMDFhNmI5NjVmMTNmN2U1OWQ0N2E1MzA1YmE1YWQ5M2QnXG4gICAgICBdLFxuICAgICAgW1xuICAgICAgICAnZTRhNDJkNDNjNWNmMTY5ZDkzOTFkZjZkZWNmNDJlZTU0MWI2ZDhmMGM5YTEzNzQwMWUyMzYzMmRkYTM0ZDI0ZicsXG4gICAgICAgICc0ZDlmOTJlNzE2ZDFjNzM1MjZmYzk5Y2NmYjhhZDM0Y2U4ODZlZWRmYThkOGU0ZjEzYTdmNzEzMWRlYmE5NDE0J1xuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgJzFlYzgwZmVmMzYwY2JkZDk1NDE2MGZhZGFiMzUyYjZiOTJiNTM1NzZhODhmZWE0OTQ3MTczYjlkNDMwMGJmMTknLFxuICAgICAgICAnYWVlZmU5Mzc1NmI1MzQwZDJmM2E0OTU4YTdhYmJmNWUwMTQ2ZTc3ZjYyOTVhMDdiNjcxY2RjMWNjMTA3Y2VmZCdcbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgICcxNDZhNzc4YzA0NjcwYzJmOTFiMDBhZjQ2ODBkZmE4YmNlMzQ5MDcxN2Q1OGJhODg5ZGRiNTkyODM2NjY0MmJlJyxcbiAgICAgICAgJ2IzMThlMGVjMzM1NDAyOGFkZDY2OTgyN2Y5ZDRiMjg3MGFhYTk3MWQyZjdlNWVkMWQwYjI5NzQ4M2Q4M2VmZDAnXG4gICAgICBdLFxuICAgICAgW1xuICAgICAgICAnZmE1MGMwZjYxZDIyZTVmMDdlM2FjZWJiMWFhMDdiMTI4ZDAwMTIyMDlhMjhiOTc3NmQ3NmE4NzkzMTgwZWVmOScsXG4gICAgICAgICc2Yjg0YzY5MjIzOTdlYmE5YjcyY2QyODcyMjgxYTY4YTVlNjgzMjkzYTU3YTIxM2IzOGNkOGQ3ZDNmNGYyODExJ1xuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgJ2RhMWQ2MWQwY2E3MjFhMTFiMWE1YmY2YjdkODhlODQyMWEyODhhYjVkNWJiYTUyMjBlNTNkMzJiNWYwNjdlYzInLFxuICAgICAgICAnODE1N2Y1NWE3Yzk5MzA2Yzc5YzA3NjYxNjFjOTFlMjk2NmE3Mzg5OWQyNzliNDhhNjU1ZmJhMGYxYWQ4MzZmMSdcbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgICdhOGUyODJmZjBjOTcwNjkwNzIxNWZmOThlOGZkNDE2NjE1MzExZGUwNDQ2ZjFlMDYyYTczYjA2MTBkMDY0ZTEzJyxcbiAgICAgICAgJzdmOTczNTViOGRiODFjMDlhYmZiN2YzYzViMjUxNTg4OGI2NzlhM2U1MGRkNmJkNmNlZjdjNzMxMTFmNGNjMGMnXG4gICAgICBdLFxuICAgICAgW1xuICAgICAgICAnMTc0YTUzYjljOWEyODU4NzJkMzllNTZlNjkxM2NhYjE1ZDU5YjFmYTUxMjUwOGMwMjJmMzgyZGU4MzE5NDk3YycsXG4gICAgICAgICdjY2M5ZGMzN2FiZmM5YzE2NTdiNDE1NWYyYzQ3ZjllNjY0NmIzYTFkOGNiOTg1NDM4M2RhMTNhYzA3OWFmYTczJ1xuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgJzk1OTM5Njk4MTk0Mzc4NWMzZDNlNTdlZGY1MDE4Y2RiZTAzOWU3MzBlNDkxOGIzZDg4NGZkZmYwOTQ3NWI3YmEnLFxuICAgICAgICAnMmU3ZTU1Mjg4OGMzMzFkZDhiYTAzODZhNGI5Y2Q2ODQ5YzY1M2Y2NGM4NzA5Mzg1ZTliOGFiZjg3NTI0ZjJmZCdcbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgICdkMmE2M2E1MGFlNDAxZTU2ZDY0NWExMTUzYjEwOWE4ZmNjYTBhNDNkNTYxZmJhMmRiYjUxMzQwYzlkODJiMTUxJyxcbiAgICAgICAgJ2U4MmQ4NmZiNjQ0M2ZjYjc1NjVhZWU1OGIyOTQ4MjIwYTcwZjc1MGFmNDg0Y2E1MmQ0MTQyMTc0ZGNmODk0MDUnXG4gICAgICBdLFxuICAgICAgW1xuICAgICAgICAnNjQ1ODdlMjMzNTQ3MWViODkwZWU3ODk2ZDdjZmRjODY2YmFjYmRiZDM4MzkzMTdiMzQzNmY5YjQ1NjE3ZTA3MycsXG4gICAgICAgICdkOTlmY2RkNWJmNjkwMmUyYWU5NmRkNjQ0N2MyOTlhMTg1YjkwYTM5MTMzYWVhYjM1ODI5OWU1ZTlmYWY2NTg5J1xuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgJzg0ODFiZGUwZTRlNGQ4ODViM2E1NDZkM2U1NDlkZTA0MmYwYWE2Y2VhMjUwZTdmZDM1OGQ2Yzg2ZGQ0NWU0NTgnLFxuICAgICAgICAnMzhlZTdiOGNiYTU0MDRkZDg0YTI1YmYzOWNlY2IyY2E5MDBhNzljNDJiMjYyZTU1NmQ2NGIxYjU5Nzc5MDU3ZSdcbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgICcxMzQ2NGE1N2E3ODEwMmFhNjJiNjk3OWFlODE3ZjQ2MzdmZmNmZWQzYzRiMWNlMzBiY2Q2MzAzZjZjYWY2NjZiJyxcbiAgICAgICAgJzY5YmUxNTkwMDQ2MTQ1ODBlZjdlNDMzNDUzY2NiMGNhNDhmMzAwYTgxZDA5NDJlMTNmNDk1YTkwN2Y2ZWNjMjcnXG4gICAgICBdLFxuICAgICAgW1xuICAgICAgICAnYmM0YTlkZjViNzEzZmUyZTlhZWY0MzBiY2MxZGM5N2EwY2Q5Y2NlZGUyZjI4NTg4Y2FkYTNhMGQyZDgzZjM2NicsXG4gICAgICAgICdkM2E4MWNhNmU3ODVjMDYzODM5MzdhZGY0Yjc5OGNhYTZlOGE5ZmJmYTU0N2IxNmQ3NThkNjY2NTgxZjMzYzEnXG4gICAgICBdLFxuICAgICAgW1xuICAgICAgICAnOGMyOGE5N2JmODI5OGJjMGQyM2Q4Yzc0OTQ1MmEzMmU2OTRiNjVlMzBhOTQ3MmEzOTU0YWIzMGZlNTMyNGNhYScsXG4gICAgICAgICc0MGEzMDQ2M2EzMzA1MTkzMzc4ZmVkZjMxZjdjYzBlYjdhZTc4NGYwNDUxY2I5NDU5ZTcxZGM3M2NiZWY5NDgyJ1xuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgJzhlYTk2NjYxMzk1MjdhOGMxZGQ5NGNlNGYwNzFmZDIzYzhiMzUwYzVhNGJiMzM3NDhjNGJhMTExZmFjY2FlMCcsXG4gICAgICAgICc2MjBlZmFiYmM4ZWUyNzgyZTI0ZTdjMGNmYjk1YzVkNzM1Yjc4M2JlOWNmMGY4ZTk1NWFmMzRhMzBlNjJiOTQ1J1xuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgJ2RkMzYyNWZhZWY1YmEwNjA3NDY2OTcxNmJiZDM3ODhkODliZGRlODE1OTU5OTY4MDkyZjc2Y2M0ZWI5YTk3ODcnLFxuICAgICAgICAnN2ExODhmYTM1MjBlMzBkNDYxZGEyNTAxMDQ1NzMxY2E5NDE0NjE5ODI4ODMzOTU5MzdmNjhkMDBjNjQ0YTU3MydcbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgICdmNzEwZDc5ZDllYjk2MjI5N2U0ZjYyMzJiNDBlOGY3ZmViMmJjNjM4MTQ2MTRkNjkyYzEyZGU3NTI0MDgyMjFlJyxcbiAgICAgICAgJ2VhOThlNjcyMzJkM2IzMjk1ZDNiNTM1NTMyMTE1Y2NhYzg2MTJjNzIxODUxNjE3NTI2YWU0N2E5Yzc3YmZjODInXG4gICAgICBdXG4gICAgXVxuICB9LFxuICBuYWY6IHtcbiAgICB3bmQ6IDcsXG4gICAgcG9pbnRzOiBbXG4gICAgICBbXG4gICAgICAgICdmOTMwOGEwMTkyNThjMzEwNDkzNDRmODVmODlkNTIyOWI1MzFjODQ1ODM2Zjk5YjA4NjAxZjExM2JjZTAzNmY5JyxcbiAgICAgICAgJzM4OGY3YjBmNjMyZGU4MTQwZmUzMzdlNjJhMzdmMzU2NjUwMGE5OTkzNGMyMjMxYjZjYjlmZDc1ODRiOGU2NzInXG4gICAgICBdLFxuICAgICAgW1xuICAgICAgICAnMmY4YmRlNGQxYTA3MjA5MzU1YjRhNzI1MGE1YzUxMjhlODhiODRiZGRjNjE5YWI3Y2JhOGQ1NjliMjQwZWZlNCcsXG4gICAgICAgICdkOGFjMjIyNjM2ZTVlM2Q2ZDRkYmE5ZGRhNmM5YzQyNmY3ODgyNzFiYWIwZDY4NDBkY2E4N2QzYWE2YWM2MmQ2J1xuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgJzVjYmRmMDY0NmU1ZGI0ZWFhMzk4ZjM2NWYyZWE3YTBlM2Q0MTliN2UwMzMwZTM5Y2U5MmJkZGVkY2FjNGY5YmMnLFxuICAgICAgICAnNmFlYmNhNDBiYTI1NTk2MGEzMTc4ZDZkODYxYTU0ZGJhODEzZDBiODEzZmRlN2I1YTUwODI2MjgwODcyNjRkYSdcbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgICdhY2Q0ODRlMmYwYzdmNjUzMDlhZDE3OGE5ZjU1OWFiZGUwOTc5Njk3NGM1N2U3MTRjMzVmMTEwZGZjMjdjY2JlJyxcbiAgICAgICAgJ2NjMzM4OTIxYjBhN2Q5ZmQ2NDM4MDk3MTc2M2I2MWU5YWRkODg4YTQzNzVmOGUwZjA1Y2MyNjJhYzY0ZjljMzcnXG4gICAgICBdLFxuICAgICAgW1xuICAgICAgICAnNzc0YWU3Zjg1OGE5NDExZTVlZjQyNDZiNzBjNjVhYWM1NjQ5OTgwYmU1YzE3ODkxYmJlYzE3ODk1ZGEwMDhjYicsXG4gICAgICAgICdkOTg0YTAzMmViNmI1ZTE5MDI0M2RkNTZkN2I3YjM2NTM3MmRiMWUyZGZmOWQ2YTgzMDFkNzRjOWM5NTNjNjFiJ1xuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgJ2YyODc3M2MyZDk3NTI4OGJjN2QxZDIwNWMzNzQ4NjUxYjA3NWZiYzY2MTBlNThjZGRlZWRkZjhmMTk0MDVhYTgnLFxuICAgICAgICAnYWIwOTAyZThkODgwYTg5NzU4MjEyZWI2NWNkYWY0NzNhMWEwNmRhNTIxZmE5MWYyOWI1Y2I1MmRiMDNlZDgxJ1xuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgJ2Q3OTI0ZDRmN2Q0M2VhOTY1YTQ2NWFlMzA5NWZmNDExMzFlNTk0NmYzYzg1Zjc5ZTQ0YWRiY2Y4ZTI3ZTA4MGUnLFxuICAgICAgICAnNTgxZTI4NzJhODZjNzJhNjgzODQyZWMyMjhjYzZkZWZlYTQwYWYyYmQ4OTZkM2E1YzUwNGRjOWZmNmEyNmI1OCdcbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgICdkZWZkZWE0Y2RiNjc3NzUwYTQyMGZlZTgwN2VhY2YyMWViOTg5OGFlNzliOTc2ODc2NmU0ZmFhMDRhMmQ0YTM0JyxcbiAgICAgICAgJzQyMTFhYjA2OTQ2MzUxNjhlOTk3YjBlYWQyYTkzZGFlY2VkMWY0YTA0YTk1YzBmNmNmYjE5OWY2OWU1NmViNzcnXG4gICAgICBdLFxuICAgICAgW1xuICAgICAgICAnMmI0ZWEwYTc5N2E0NDNkMjkzZWY1Y2ZmNDQ0ZjQ5NzlmMDZhY2ZlYmQ3ZTg2ZDI3NzQ3NTY1NjEzODM4NWI2YycsXG4gICAgICAgICc4NWU4OWJjMDM3OTQ1ZDkzYjM0MzA4M2I1YTFjODYxMzFhMDFmNjBjNTAyNjk3NjNiNTcwYzg1NGU1YzA5YjdhJ1xuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgJzM1MmJiZjRhNGNkZDEyNTY0ZjkzZmEzMzJjZTMzMzMwMWQ5YWQ0MDI3MWY4MTA3MTgxMzQwYWVmMjViZTU5ZDUnLFxuICAgICAgICAnMzIxZWI0MDc1MzQ4ZjUzNGQ1OWMxODI1OWRkYTNlMWY0YTFiM2IyZTcxYjEwMzljNjdiZDNkOGJjZjgxOTk4YydcbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgICcyZmEyMTA0ZDZiMzhkMTFiMDIzMDAxMDU1OTg3OTEyNGU0MmFiOGRmZWZmNWZmMjlkYzljZGFkZDRlY2FjYzNmJyxcbiAgICAgICAgJzJkZTEwNjgyOTVkZDg2NWI2NDU2OTMzNWJkNWRkODAxODFkNzBlY2ZjODgyNjQ4NDIzYmE3NmI1MzJiN2Q2NydcbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgICc5MjQ4Mjc5YjA5YjRkNjhkYWIyMWE5YjA2NmVkZGE4MzI2M2MzZDg0ZTA5NTcyZTI2OWNhMGNkN2Y1NDUzNzE0JyxcbiAgICAgICAgJzczMDE2ZjdiZjIzNGFhZGU1ZDFhYTcxYmRlYTJiMWZmM2ZjMGRlMmE4ODc5MTJmZmU1NGEzMmNlOTdjYjM0MDInXG4gICAgICBdLFxuICAgICAgW1xuICAgICAgICAnZGFlZDRmMmJlM2E4YmYyNzhlNzAxMzJmYjBiZWI3NTIyZjU3MGUxNDRiZjYxNWMwN2U5OTZkNDQzZGVlODcyOScsXG4gICAgICAgICdhNjlkY2U0YTdkNmM5OGU4ZDRhMWFjYTg3ZWY4ZDcwMDNmODNjMjMwZjNhZmE3MjZhYjQwZTUyMjkwYmUxYzU1J1xuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgJ2M0NGQxMmM3MDY1ZDgxMmU4YWNmMjhkN2NiYjE5ZjkwMTFlY2Q5ZTlmZGYyODFiMGU2YTNiNWU4N2QyMmU3ZGInLFxuICAgICAgICAnMjExOWE0NjBjZTMyNmNkYzc2YzQ1OTI2Yzk4MmZkYWMwZTEwNmU4NjFlZGY2MWM1YTAzOTA2M2YwZTBlNjQ4MidcbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgICc2YTI0NWJmNmRjNjk4NTA0Yzg5YTIwY2ZkZWQ2MDg1MzE1MmI2OTUzMzZjMjgwNjNiNjFjNjVjYmQyNjllNmI0JyxcbiAgICAgICAgJ2UwMjJjZjQyYzJiZDRhNzA4YjNmNTEyNmYxNmEyNGFkOGIzM2JhNDhkMDQyM2I2ZWZkNWU2MzQ4MTAwZDhhODInXG4gICAgICBdLFxuICAgICAgW1xuICAgICAgICAnMTY5N2ZmYTZmZDlkZTYyN2MwNzdlM2QyZmU1NDEwODRjZTEzMzAwYjBiZWMxMTQ2Zjk1YWU1N2YwZDBiZDZhNScsXG4gICAgICAgICdiOWMzOThmMTg2ODA2ZjVkMjc1NjE1MDZlNDU1NzQzM2EyY2YxNTAwOWU0OThhZTdhZGVlOWQ2M2QwMWIyMzk2J1xuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgJzYwNWJkYjAxOTk4MTcxOGI5ODZkMGYwN2U4MzRjYjBkOWRlYjgzNjBmZmI3ZjYxZGY5ODIzNDVlZjI3YTc0NzknLFxuICAgICAgICAnMjk3MmQyZGU0ZjhkMjA2ODFhNzhkOTNlYzk2ZmUyM2MyNmJmYWU4NGZiMTRkYjQzYjAxZTFlOTA1NmI4YzQ5J1xuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgJzYyZDE0ZGFiNDE1MGJmNDk3NDAyZmRjNDVhMjE1ZTEwZGNiMDFjMzU0OTU5YjEwY2ZlMzFjN2U5ZDg3ZmYzM2QnLFxuICAgICAgICAnODBmYzA2YmQ4Y2M1YjAxMDk4MDg4YTE5NTBlZWQwZGIwMWFhMTMyOTY3YWI0NzIyMzVmNTY0MjQ4M2IyNWVhZidcbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgICc4MGM2MGFkMDA0MGYyN2RhZGU1YjRiMDZjNDA4ZTU2YjJjNTBlOWY1NmI5YjhiNDI1ZTU1NWMyZjg2MzA4YjZmJyxcbiAgICAgICAgJzFjMzgzMDNmMWNjNWMzMGYyNmU2NmJhZDdmZTcyZjcwYTY1ZWVkNGNiZTcwMjRlYjFhYTAxZjU2NDMwYmQ1N2EnXG4gICAgICBdLFxuICAgICAgW1xuICAgICAgICAnN2E5Mzc1YWQ2MTY3YWQ1NGFhNzRjNjM0OGNjNTRkMzQ0Y2M1ZGM5NDg3ZDg0NzA0OWQ1ZWFiYjBmYTAzYzhmYicsXG4gICAgICAgICdkMGUzZmE5ZWNhODcyNjkwOTU1OWUwZDc5MjY5MDQ2YmRjNTllYTEwYzcwY2UyYjAyZDQ5OWVjMjI0ZGM3ZjcnXG4gICAgICBdLFxuICAgICAgW1xuICAgICAgICAnZDUyOGVjZDliNjk2YjU0YzkwN2E5ZWQwNDU0NDdhNzliYjQwOGVjMzliNjhkZjUwNGJiNTFmNDU5YmMzZmZjOScsXG4gICAgICAgICdlZWNmNDEyNTMxMzZlNWY5OTk2NmYyMTg4MWZkNjU2ZWJjNDM0NTQwNWM1MjBkYmMwNjM0NjViNTIxNDA5OTMzJ1xuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgJzQ5MzcwYTRiNWY0MzQxMmVhMjVmNTE0ZThlY2RhZDA1MjY2MTE1ZTRhN2VjYjEzODcyMzE4MDhmOGI0NTk2MycsXG4gICAgICAgICc3NThmM2Y0MWFmZDZlZDQyOGIzMDgxYjA1MTJmZDYyYTU0YzNmM2FmYmI1YjY3NjRiNjUzMDUyYTEyOTQ5YzlhJ1xuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgJzc3ZjIzMDkzNmVlODhjYmJkNzNkZjkzMGQ2NDcwMmVmODgxZDgxMWUwZTE0OThlMmYxYzEzZWIxZmMzNDVkNzQnLFxuICAgICAgICAnOTU4ZWY0MmE3ODg2YjY0MDBhMDgyNjZlOWJhMWIzNzg5NmM5NTMzMGQ5NzA3N2NiYmU4ZWIzYzc2NzFjNjBkNidcbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgICdmMmRhYzk5MWNjNGNlNGI5ZWE0NDg4N2U1YzdjMGJjZTU4YzgwMDc0YWI5ZDRkYmFlYjI4NTMxYjc3MzlmNTMwJyxcbiAgICAgICAgJ2UwZGVkYzliM2IyZjhkYWQ0ZGExZjMyZGVjMjUzMWRmOWViNWZiZWIwNTk4ZTRmZDFhMTE3ZGJhNzAzYTNjMzcnXG4gICAgICBdLFxuICAgICAgW1xuICAgICAgICAnNDYzYjNkOWY2NjI2MjFmYjFiNGJlOGZiYmUyNTIwMTI1YTIxNmNkZmM5ZGFlM2RlYmNiYTQ4NTBjNjkwZDQ1YicsXG4gICAgICAgICc1ZWQ0MzBkNzhjMjk2YzM1NDMxMTQzMDZkZDg2MjJkN2M2MjJlMjdjOTcwYTFkZTMxY2IzNzdiMDFhZjczMDdlJ1xuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgJ2YxNmY4MDQyNDRlNDZlMmEwOTIzMmQ0YWZmM2I1OTk3NmI5OGZhYzE0MzI4YTJkMWEzMjQ5NmI0OTk5OGYyNDcnLFxuICAgICAgICAnY2VkYWJkOWI4MjIwM2Y3ZTEzZDIwNmZjZGY0ZTMzZDkyYTZjNTNjMjZlNWNjZTI2ZDY1Nzk5NjJjNGUzMWRmNidcbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgICdjYWY3NTQyNzJkYzg0NTYzYjAzNTJiN2ExNDMxMWFmNTVkMjQ1MzE1YWNlMjdjNjUzNjllMTVmNzE1MWQ0MWQxJyxcbiAgICAgICAgJ2NiNDc0NjYwZWYzNWY1ZjJhNDFiNjQzZmE1ZTQ2MDU3NWY0ZmE5Yjc5NjIyMzJhNWMzMmY5MDgzMThhMDQ0NzYnXG4gICAgICBdLFxuICAgICAgW1xuICAgICAgICAnMjYwMGNhNGIyODJjYjk4NmY4NWQwZjE3MDk5NzlkOGI0NGEwOWMwN2NiODZkN2MxMjQ0OTdiYzg2ZjA4MjEyMCcsXG4gICAgICAgICc0MTE5Yjg4NzUzYzE1YmQ2YTY5M2IwM2ZjZGRiYjQ1ZDVhYzZiZTc0YWI1ZjBlZjQ0YjBiZTk0NzVhN2U0YjQwJ1xuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgJzc2MzVjYTcyZDdlODQzMmMzMzhlYzUzY2QxMjIyMGJjMDFjNDg2ODVlMjRmN2RjOGM2MDJhNzc0Njk5OGU0MzUnLFxuICAgICAgICAnOTFiNjQ5NjA5NDg5ZDYxM2QxZDVlNTkwZjc4ZTZkNzRlY2ZjMDYxZDU3MDQ4YmFkOWU3NmYzMDJjNWI5YzYxJ1xuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgJzc1NGUzMjM5ZjMyNTU3MGNkYmJmNGE4N2RlZWU4YTY2YjdmMmIzMzQ3OWQ0NjhmYmMxYTUwNzQzYmY1NmNjMTgnLFxuICAgICAgICAnNjczZmI4NmU1YmRhMzBmYjNjZDBlZDMwNGVhNDlhMDIzZWUzM2QwMTk3YTY5NWQwYzVkOTgwOTNjNTM2NjgzJ1xuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgJ2UzZTZiZDEwNzFhMWU5NmFmZjU3ODU5YzgyZDU3MGYwMzMwODAwNjYxZDFjOTUyZjlmZTI2OTQ2OTFkOWI5ZTgnLFxuICAgICAgICAnNTljOWUwYmJhMzk0ZTc2ZjQwYzBhYTU4Mzc5YTNjYjZhNWEyMjgzOTkzZTkwYzQxNjcwMDJhZjQ5MjBlMzdmNSdcbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgICcxODZiNDgzZDA1NmEwMzM4MjZhZTczZDg4ZjczMjk4NWM0Y2NiMWYzMmJhMzVmNGI0Y2M0N2ZkY2YwNGFhNmViJyxcbiAgICAgICAgJzNiOTUyZDMyYzY3Y2Y3N2UyZTE3NDQ2ZTIwNDE4MGFiMjFmYjgwOTA4OTUxMzhiNGE0YTc5N2Y4NmU4MDg4OGInXG4gICAgICBdLFxuICAgICAgW1xuICAgICAgICAnZGY5ZDcwYTZiOTg3NmNlNTQ0Yzk4NTYxZjRiZTRmNzI1NDQyZTZkMmI3MzdkOWM5MWE4MzIxNzI0Y2UwOTYzZicsXG4gICAgICAgICc1NWViMmRhZmQ4NGQ2Y2NkNWY4NjJiNzg1ZGMzOWQ0YWIxNTcyMjI3MjBlZjlkYTIxN2I4YzQ1Y2YyYmEyNDE3J1xuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgJzVlZGQ1Y2MyM2M1MWU4N2E0OTdjYTgxNWQ1ZGNlMGY4YWI1MjU1NGY4NDllZDg5OTVkZTY0YzVmMzRjZTcxNDMnLFxuICAgICAgICAnZWZhZTljOGRiYzE0MTMwNjYxZThjZWMwMzBjODlhZDBjMTNjNjZjMGQxN2EyOTA1Y2RjNzA2YWI3Mzk5YTg2OCdcbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgICcyOTA3OThjMmI2NDc2ODMwZGExMmZlMDIyODdlOWU3NzdhYTNmYmExYzM1NWIxN2E3MjJkMzYyZjg0NjE0ZmJhJyxcbiAgICAgICAgJ2UzOGRhNzZkY2Q0NDA2MjE5ODhkMDBiY2Y3OWFmMjVkNWIyOWMwOTRkYjJhMjMxNDZkMDAzYWZkNDE5NDNlN2EnXG4gICAgICBdLFxuICAgICAgW1xuICAgICAgICAnYWYzYzQyM2E5NWQ5ZjViMzA1NDc1NGVmYTE1MGFjMzljZDI5NTUyZmUzNjAyNTczNjJkZmRlY2VmNDA1M2I0NScsXG4gICAgICAgICdmOThhM2ZkODMxZWIyYjc0OWE5M2IwZTZmMzVjZmI0MGM4Y2Q1YWE2NjdhMTU1ODFiYzJmZWRlZDQ5OGZkOWM2J1xuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgJzc2NmRiYjI0ZDEzNGU3NDVjY2NhYTI4Yzk5YmYyNzQ5MDZiYjY2YjI2ZGNmOThkZjhkMmZlZDUwZDg4NDI0OWEnLFxuICAgICAgICAnNzQ0YjExNTJlYWNiZTVlMzhkY2M4ODc5ODBkYTM4Yjg5NzU4NGE2NWZhMDZjZWRkMmM5MjRmOTdjYmFjNTk5NidcbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgICc1OWRiZjQ2ZjhjOTQ3NTliYTIxMjc3YzMzNzg0ZjQxNjQ1ZjdiNDRmNmM1OTZhNThjZTkyZTY2NjE5MWFiZTNlJyxcbiAgICAgICAgJ2M1MzRhZDQ0MTc1ZmJjMzAwZjRlYTZjZTY0ODMwOWEwNDJjZTczOWE3OTE5Nzk4Y2Q4NWUyMTZjNGEzMDdmNmUnXG4gICAgICBdLFxuICAgICAgW1xuICAgICAgICAnZjEzYWRhOTUxMDNjNDUzNzMwNWU2OTFlNzRlOWE0YThkZDY0N2U3MTFhOTVlNzNjYjYyZGM2MDE4Y2ZkODdiOCcsXG4gICAgICAgICdlMTM4MTdiNDRlZTE0ZGU2NjNiZjRiYzgwODM0MWYzMjY5NDllMjFhNmE3NWMyNTcwNzc4NDE5YmRhZjU3MzNkJ1xuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgJzc3NTRiNGZhMGU4YWNlZDA2ZDQxNjdhMmM1OWNjYTRjZGExODY5YzA2ZWJhZGZiNjQ4ODU1MDAxNWE4ODUyMmMnLFxuICAgICAgICAnMzBlOTNlODY0ZTY2OWQ4MjIyNGI5NjdjMzAyMGI4ZmE4ZDFlNGUzNTBiNmNiY2M1MzdhNDhiNTc4NDExNjNhMidcbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgICc5NDhkY2FkZjU5OTBlMDQ4YWEzODc0ZDQ2YWJlZjlkNzAxODU4Zjk1ZGU4MDQxZDJhNjgyOGM5OWUyMjYyNTE5JyxcbiAgICAgICAgJ2U0OTFhNDI1MzdmNmU1OTdkNWQyOGEzMjI0YjFiYzI1ZGY5MTU0ZWZiZDJlZjFkMmNiYmEyY2FlNTM0N2Q1N2UnXG4gICAgICBdLFxuICAgICAgW1xuICAgICAgICAnNzk2MjQxNDQ1MGM3NmMxNjg5YzdiNDhmODIwMmVjMzdmYjIyNGNmNWFjMGJmYTE1NzAzMjhhOGEzZDdjNzdhYicsXG4gICAgICAgICcxMDBiNjEwZWM0ZmZiNDc2MGQ1YzFmYzEzM2VmNmY2YjEyNTA3YTA1MWYwNGFjNTc2MGFmYTViMjlkYjgzNDM3J1xuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgJzM1MTQwODc4MzQ5NjRiNTRiMTViMTYwNjQ0ZDkxNTQ4NWExNjk3NzIyNWI4ODQ3YmIwZGQwODUxMzdlYzQ3Y2EnLFxuICAgICAgICAnZWYwYWZiYjIwNTYyMDU0NDhlMTY1MmM0OGU4MTI3ZmM2MDM5ZTc3YzE1YzIzNzhiN2U3ZDE1YTBkZTI5MzMxMSdcbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgICdkM2NjMzBhZDZiNDgzZTRiYzc5Y2UyYzlkZDhiYzU0OTkzZTk0N2ViOGRmNzg3YjQ0Mjk0M2QzZjdiNTI3ZWFmJyxcbiAgICAgICAgJzhiMzc4YTIyZDgyNzI3OGQ4OWM1ZTliZThmOTUwOGFlM2MyYWQ0NjI5MDM1ODYzMGFmYjM0ZGIwNGVlZGUwYTQnXG4gICAgICBdLFxuICAgICAgW1xuICAgICAgICAnMTYyNGQ4NDc4MDczMjg2MGNlMWM3OGZjYmZlZmUwOGIyYjI5ODIzZGI5MTNmNjQ5Mzk3NWJhMGZmNDg0NzYxMCcsXG4gICAgICAgICc2ODY1MWNmOWI2ZGE5MDNlMDkxNDQ0OGM2Y2Q5ZDRjYTg5Njg3OGY1MjgyYmU0YzhjYzA2ZTJhNDA0MDc4NTc1J1xuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgJzczM2NlODBkYTk1NWE4YTI2OTAyYzk1NjMzZTYyYTk4NTE5MjQ3NGI1YWYyMDdkYTZkZjdiNGZkNWZjNjFjZDQnLFxuICAgICAgICAnZjU0MzVhMmJkMmJhZGY3ZDQ4NWE0ZDhiOGRiOWZjY2UzZTFlZjhlMDIwMWU0NTc4YzU0NjczYmMxZGM1ZWExZCdcbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgICcxNWQ5NDQxMjU0OTQ1MDY0Y2YxYTFjMzNiYmQzYjQ5Zjg5NjZjNTA5MjE3MWU2OTllZjI1OGRmYWI4MWMwNDVjJyxcbiAgICAgICAgJ2Q1NmViMzBiNjk0NjNlNzIzNGY1MTM3YjczYjg0MTc3NDM0ODAwYmFjZWJmYzY4NWZjMzdiYmU5ZWZlNDA3MGQnXG4gICAgICBdLFxuICAgICAgW1xuICAgICAgICAnYTFkMGZjZjJlYzlkZTY3NWI2MTIxMzZlNWNlNzBkMjcxYzIxNDE3YzlkMmI4YWFhYWMxMzg1OTlkMDcxNzk0MCcsXG4gICAgICAgICdlZGQ3N2Y1MGJjYjVhM2NhYjJlOTA3MzczMDk2NjdmMjY0MTQ2MmE1NDA3MGYzZDUxOTIxMmQzOWMxOTdhNjI5J1xuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgJ2UyMmZiZTE1YzBhZjhjY2M1NzgwYzA3MzVmODRkYmU5YTc5MGJhZGVlODI0NWMwNmM3Y2EzNzMzMWNiMzY5ODAnLFxuICAgICAgICAnYTg1NWJhYmFkNWNkNjBjODhiNDMwYTY5ZjUzYTFhN2EzODI4OTE1NDk2NDc5OWJlNDNkMDZkNzdkMzFkYTA2J1xuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgJzMxMTA5MWRkOTg2MGU4ZTIwZWUxMzQ3M2MxMTU1ZjVmNjk2MzVlMzk0NzA0ZWFhNzQwMDk0NTIyNDZjZmE5YjMnLFxuICAgICAgICAnNjZkYjY1NmY4N2QxZjA0ZmZmZDFmMDQ3ODhjMDY4MzA4NzFlYzVhNjRmZWVlNjg1YmQ4MGYwYjEyODZkODM3NCdcbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgICczNGMxZmQwNGQzMDFiZTg5YjMxYzA0NDJkM2U2YWMyNDg4MzkyOGI0NWE5MzQwNzgxODY3ZDQyMzJlYzJkYmRmJyxcbiAgICAgICAgJzk0MTQ2ODVlOTdiMWI1OTU0YmQ0NmY3MzAxNzQxMzZkNTdmMWNlZWI0ODc0NDNkYzUzMjE4NTdiYTczYWJlZSdcbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgICdmMjE5ZWE1ZDZiNTQ3MDFjMWMxNGRlNWI1NTdlYjQyYThkMTNmM2FiYmNkMDhhZmZjYzJhNWU2YjA0OWI4ZDYzJyxcbiAgICAgICAgJzRjYjk1OTU3ZTgzZDQwYjBmNzNhZjQ1NDRjY2NmNmIxZjRiMDhkM2MwN2IyN2ZiOGQ4YzI5NjJhNDAwNzY2ZDEnXG4gICAgICBdLFxuICAgICAgW1xuICAgICAgICAnZDdiODc0MGY3NGE4ZmJhYWIxZjY4M2RiOGY0NWRlMjY1NDNhNTQ5MGJjYTYyNzA4NzIzNjkxMjQ2OWEwYjQ0OCcsXG4gICAgICAgICdmYTc3OTY4MTI4ZDljOTJlZTEwMTBmMzM3YWQ0NzE3ZWZmMTVkYjVlZDNjMDQ5YjM0MTFlMDMxNWVhYTQ1OTNiJ1xuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgJzMyZDMxYzIyMmY4ZjZmMGVmODZmN2M5OGQzYTMzMzVlYWQ1YmNkMzJhYmRkOTQyODlmZTRkMzA5MWFhODI0YmYnLFxuICAgICAgICAnNWYzMDMyZjU4OTIxNTZlMzljY2QzZDc5MTViOWUxZGEyZTZkYWM5ZTZmMjZlOTYxMTE4ZDE0Yjg0NjJlMTY2MSdcbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgICc3NDYxZjM3MTkxNGFiMzI2NzEwNDVhMTU1ZDk4MzFlYTg3OTNkNzdjZDU5NTkyYzQzNDBmODZjYmMxODM0N2I1JyxcbiAgICAgICAgJzhlYzBiYTIzOGI5NmJlYzBjYmRkZGNhZTBhYTQ0MjU0MmVlZTFmZjUwYzk4NmVhNmIzOTg0N2IzY2MwOTJmZjYnXG4gICAgICBdLFxuICAgICAgW1xuICAgICAgICAnZWUwNzlhZGIxZGYxODYwMDc0MzU2YTI1YWEzODIwNmE2ZDcxNmIyYzNlNjc0NTNkMjg3Njk4YmFkN2IyYjJkNicsXG4gICAgICAgICc4ZGMyNDEyYWFmZTNiZTVjNGM1ZjM3ZTBlY2M1ZjlmNmE0NDY5ODlhZjA0YzRlMjVlYmFhYzQ3OWVjMWM4YzFlJ1xuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgJzE2ZWM5M2U0NDdlYzgzZjA0NjdiMTgzMDJlZTYyMGY3ZTY1ZGUzMzE4NzRjOWRjNzJiZmQ4NjE2YmE5ZGE2YjUnLFxuICAgICAgICAnNWU0NjMxMTUwZTYyZmI0MGQwZThjMmE3Y2E1ODA0YTM5ZDU4MTg2YTUwZTQ5NzEzOTYyNjc3OGUyNWIwNjc0ZCdcbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgICdlYWE1Zjk4MGMyNDVmNmYwMzg5NzgyOTBhZmE3MGI2YmQ4ODU1ODk3Zjk4YjZhYTQ4NWI5NjA2NWQ1MzdiZDk5JyxcbiAgICAgICAgJ2Y2NWY1ZDNlMjkyYzJlMDgxOWE1MjgzOTFjOTk0NjI0ZDc4NDg2OWQ3ZTZlYTY3ZmIxODA0MTAyNGVkYzA3ZGMnXG4gICAgICBdLFxuICAgICAgW1xuICAgICAgICAnNzhjOTQwNzU0NGFjMTMyNjkyZWUxOTEwYTAyNDM5OTU4YWUwNDg3NzE1MTM0MmVhOTZjNGI2YjM1YTQ5ZjUxJyxcbiAgICAgICAgJ2YzZTAzMTkxNjllYjliODVkNTQwNDc5NTUzOWE1ZTY4ZmExZmJkNTgzYzA2NGQyNDYyYjY3NWYxOTRhM2RkYjQnXG4gICAgICBdLFxuICAgICAgW1xuICAgICAgICAnNDk0ZjRiZTIxOWExYTc3MDE2ZGNkODM4NDMxYWVhMDAwMWNkYzhhZTdhNmZjNjg4NzI2NTc4ZDk3MDI4NTdhNScsXG4gICAgICAgICc0MjI0MmE5NjkyODNhNWYzMzliYTdmMDc1ZTM2YmEyYWY5MjVjZTMwZDc2N2VkNmU1NWY0YjAzMTg4MGQ1NjJjJ1xuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgJ2E1OThhODAzMGRhNmQ4NmM2YmM3ZjJmNTE0NGVhNTQ5ZDI4MjExZWE1OGZhYTcwZWJmNGMxZTY2NWMxZmU5YjUnLFxuICAgICAgICAnMjA0YjVkNmY4NDgyMmMzMDdlNGI0YTcxNDA3MzdhZWMyM2ZjNjNiNjViMzVmODZhMTAwMjZkYmQyZDg2NGU2YidcbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgICdjNDE5MTYzNjVhYmIyYjVkMDkxOTJmNWYyZGJlYWZlYzIwOGYwMjBmMTI1NzBhMTg0ZGJhZGMzZTU4NTk1OTk3JyxcbiAgICAgICAgJzRmMTQzNTFkMDA4N2VmYTQ5ZDI0NWIzMjg5ODQ5ODlkNWNhZjk0NTBmMzRiZmMwZWQxNmU5NmI1OGZhOTkxMydcbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgICc4NDFkNjA2M2E1ODZmYTQ3NWE3MjQ2MDRkYTAzYmM1YjkyYTJlMGQyZTBhMzZhY2ZlNGM3M2E1NTE0NzQyODgxJyxcbiAgICAgICAgJzczODY3ZjU5YzA2NTllODE5MDRmOWExYzc1NDM2OThlNjI1NjJkNjc0NGMxNjljZTdhMzZkZTAxYThkNjE1NCdcbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgICc1ZTk1YmIzOTlhNjk3MWQzNzYwMjY5NDdmODliZGUyZjI4MmIzMzgxMDkyOGJlNGRlZDExMmFjNGQ3MGUyMGQ1JyxcbiAgICAgICAgJzM5ZjIzZjM2NjgwOTA4NWJlZWJmYzcxMTgxMzEzNzc1YTk5YzlhZWQ3ZDhiYTM4YjE2MTM4NGM3NDYwMTI4NjUnXG4gICAgICBdLFxuICAgICAgW1xuICAgICAgICAnMzZlNDY0MWE1Mzk0OGZkNDc2YzM5ZjhhOTlmZDk3NGU1ZWMwNzU2NGI1MzE1ZDhiZjk5NDcxYmNhMGVmMmY2NicsXG4gICAgICAgICdkMjQyNGIxYjFhYmU0ZWI4MTY0MjI3YjA4NWM5YWE5NDU2ZWExMzQ5M2ZkNTYzZTA2ZmQ1MWNmNTY5NGM3OGZjJ1xuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgJzMzNjU4MWVhN2JmYmJiMjkwYzE5MWEyZjUwN2E0MWNmNTY0Mzg0MjE3MGU5MTRmYWVhYjI3YzJjNTc5ZjcyNicsXG4gICAgICAgICdlYWQxMjE2ODU5NWZlMWJlOTkyNTIxMjliNmU1NmIzMzkxZjdhYjE0MTBjZDFlMGVmM2RjZGNhYmQyZmRhMjI0J1xuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgJzhhYjg5ODE2ZGFkZmQ2YjZhMWYyNjM0ZmNmMDBlYzg0MDM3ODEwMjVlZDY4OTBjNDg0OTc0MjcwNmJkNDNlZGUnLFxuICAgICAgICAnNmZkY2VmMDlmMmY2ZDBhMDQ0ZTY1NGFlZjYyNDEzNmY1MDNkNDU5YzNlODk4NDU4NThhNDdhOTEyOWNkZDI0ZSdcbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgICcxZTMzZjFhNzQ2YzljNTc3ODEzMzM0NGQ5Mjk5ZmNhYTIwYjA5MzhlOGFjZmYyNTQ0YmI0MDI4NGI4YzVmYjk0JyxcbiAgICAgICAgJzYwNjYwMjU3ZGQxMWIzYWE5YzhlZDYxOGQyNGVkZmYyMzA2ZDMyMGYxZDAzMDEwZTMzYTdkMjA1N2YzYjNiNidcbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgICc4NWI3YzFkY2IzY2VjMWI3ZWU3ZjMwZGVkNzlkZDIwYTBlZDFmNGNjMThjYmNmY2ZhNDEwMzYxZmQ4ZjA4ZjMxJyxcbiAgICAgICAgJzNkOThhOWNkZDAyNmRkNDNmMzkwNDhmMjVhODg0N2Y0ZmNhZmFkMTg5NWQ3YTYzM2M2ZmVkM2MzNWU5OTk1MTEnXG4gICAgICBdLFxuICAgICAgW1xuICAgICAgICAnMjlkZjlmYmQ4ZDllNDY1MDkyNzVmNGIxMjVkNmQ0NWQ3ZmJlOWEzYjg3OGE3YWY4NzJhMjgwMDY2MWFjNWY1MScsXG4gICAgICAgICdiNGM0ZmU5OWM3NzVhNjA2ZTJkODg2MjE3OTEzOWZmZGE2MWRjODYxYzAxOWU1NWNkMjg3NmViMmEyN2Q4NGInXG4gICAgICBdLFxuICAgICAgW1xuICAgICAgICAnYTBiMWNhZTA2YjBhODQ3YTNmZWE2ZTY3MWFhZjhhZGZkZmU1OGNhMmY3NjgxMDVjODA4MmIyZTQ0OWZjZTI1MicsXG4gICAgICAgICdhZTQzNDEwMmVkZGUwOTU4ZWM0YjE5ZDkxN2E2YTI4ZTZiNzJkYTE4MzRhZmYwZTY1MGYwNDk1MDNhMjk2Y2YyJ1xuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgJzRlOGNlYWZiOWIzZTlhMTM2ZGM3ZmY2N2U4NDAyOTViNDk5ZGZiM2IyMTMzZTRiYTExM2YyZTRjMGUxMjFlNScsXG4gICAgICAgICdjZjIxNzQxMThjOGI2ZDdhNGI0OGY2ZDUzNGNlNWM3OTQyMmMwODZhNjM0NjA1MDJiODI3Y2U2MmEzMjY2ODNjJ1xuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgJ2QyNGE0NGUwNDdlMTliNmY1YWZiODFjN2NhMmY2OTA4MGE1MDc2Njg5YTAxMDkxOWY0MjcyNWMyYjc4OWEzM2InLFxuICAgICAgICAnNmZiOGQ1NTkxYjQ2NmY4ZmM2M2RiNTBmMWMwZjFjNjkwMTNmOTk2ODg3YjgyNDRkMmNkZWM0MTdhZmVhOGZhMydcbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgICdlYTAxNjA2YTdhNmM5Y2RkMjQ5ZmRmY2ZhY2I5OTU4NDAwMWVkZDI4YWJiYWI3N2I1MTA0ZTk4ZThlM2IzNWQ0JyxcbiAgICAgICAgJzMyMmFmNDkwOGM3MzEyYjBjZmJmZTM2OWY3YTdiM2NkYjdkNDQ5NGJjMjgyMzcwMGNmZDY1MjE4OGEzZWE5OGQnXG4gICAgICBdLFxuICAgICAgW1xuICAgICAgICAnYWY4YWRkYmYyYjY2MWM4YTZjNjMyODY1NWViOTY2NTEyNTIwMDdkOGM1ZWEzMWJlNGFkMTk2ZGU4Y2UyMTMxZicsXG4gICAgICAgICc2NzQ5ZTY3YzAyOWI4NWY1MmEwMzRlYWZkMDk2ODM2YjI1MjA4MTg2ODBlMjZhYzhmM2RmYmNkYjcxNzQ5NzAwJ1xuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgJ2UzYWUxOTc0NTY2Y2EwNmNjNTE2ZDQ3ZTBmYjE2NWE2NzRhM2RhYmNmY2ExNWU3MjJmMGUzNDUwZjQ1ODg5JyxcbiAgICAgICAgJzJhZWFiZTdlNDUzMTUxMDExNjIxN2YwN2JmNGQwNzMwMGRlOTdlNDg3NGY4MWY1MzM0MjBhNzJlZWIwYmQ2YTQnXG4gICAgICBdLFxuICAgICAgW1xuICAgICAgICAnNTkxZWUzNTUzMTNkOTk3MjFjZjY5OTNmZmVkMWUzZTMwMTk5M2ZmM2VkMjU4ODAyMDc1ZWE4Y2VkMzk3ZTI0NicsXG4gICAgICAgICdiMGVhNTU4YTExM2MzMGJlYTYwZmM0Nzc1NDYwYzc5MDFmZjBiMDUzZDI1Y2EyYmRlZWU5OGYxYTRiZTVkMTk2J1xuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgJzExMzk2ZDU1ZmRhNTRjNDlmMTlhYTk3MzE4ZDhkYTYxZmE4NTg0ZTQ3YjA4NDk0NTA3N2NmMDMyNTViNTI5ODQnLFxuICAgICAgICAnOTk4Yzc0YThjZDQ1YWMwMTI4OWQ1ODMzYTdiZWI0NzQ0ZmY1MzZiMDFiMjU3YmU0YzU3NjdiZWE5M2VhNTdhNCdcbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgICczYzVkMmExYmEzOWM1YTE3OTAwMDA3MzhjOWUwYzQwYjhkY2RmZDU0Njg3NTRiNjQwNTU0MDE1N2UwMTdhYTdhJyxcbiAgICAgICAgJ2IyMjg0Mjc5OTk1YTM0ZTJmOWQ0ZGU3Mzk2ZmMxOGI4MGY5YjhiOWZkZDI3MGY2NjYxZjc5Y2E0YzgxYmQyNTcnXG4gICAgICBdLFxuICAgICAgW1xuICAgICAgICAnY2M4NzA0YjhhNjBhMGRlZmEzYTk5YTcyOTlmMmU5YzNmYmMzOTVhZmIwNGFjMDc4NDI1ZWY4YTE3OTNjYzAzMCcsXG4gICAgICAgICdiZGQ0NjAzOWZlZWQxNzg4MWQxZTA4NjJkYjM0N2Y4Y2YzOTViNzRmYzRiY2RjNGU5NDBiNzRlM2FjMWYxYjEzJ1xuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgJ2M1MzNlNGY3ZWE4NTU1YWFjZDk3NzdhYzVjYWQyOWI5N2RkNGRlZmNjYzUzZWU3ZWEyMDQxMTliMjg4OWIxOTcnLFxuICAgICAgICAnNmYwYTI1NmJjNWVmZGY0MjlhMmZiNjI0MmYxYTQzYTJkOWI5MjViYjRhNGIzYTI2YmI4ZTBmNDVlYjU5NjA5NidcbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgICdjMTRmOGYyY2NiMjdkNmYxMDlmNmQwOGQwM2NjOTZhNjliYThjMzRlZWMwN2JiY2Y1NjZkNDhlMzNkYTY1OTMnLFxuICAgICAgICAnYzM1OWQ2OTIzYmIzOThmN2ZkNDQ3M2UxNmZlMWMyODQ3NWI3NDBkZDA5ODA3NWU2YzBlODY0OTExM2RjM2EzOCdcbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgICdhNmNiYzMwNDZiYzZhNDUwYmFjMjQ3ODlmYTE3MTE1YTRjOTczOWVkNzVmOGYyMWNlNDQxZjcyZTBiOTBlNmVmJyxcbiAgICAgICAgJzIxYWU3ZjQ2ODBlODg5YmIxMzA2MTllMmMwZjk1YTM2MGNlYjU3M2M3MDYwMzEzOTg2MmFmZDYxN2ZhOWI5ZidcbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgICczNDdkNmQ5YTAyYzQ4OTI3ZWJmYjg2YzEzNTliMWNhZjEzMGEzYzAyNjdkMTFjZTYzNDRiMzlmOTlkNDNjYzM4JyxcbiAgICAgICAgJzYwZWE3ZjYxYTM1MzUyNGQxYzk4N2Y2ZWNlYzkyZjA4NmQ1NjVhYjY4Nzg3MGNiMTI2ODlmZjFlMzFjNzQ0NDgnXG4gICAgICBdLFxuICAgICAgW1xuICAgICAgICAnZGE2NTQ1ZDIxODFkYjhkOTgzZjdkY2IzNzVlZjU4NjZkNDdjNjdiMWJmMzFjOGNmODU1ZWY3NDM3YjcyNjU2YScsXG4gICAgICAgICc0OWI5NjcxNWFiNjg3OGE3OWU3OGYwN2NlNTY4MGM1ZDY2NzMwNTFiNDkzNWJkODk3ZmVhODI0Yjc3ZGMyMDhhJ1xuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgJ2M0MDc0N2NjOWQwMTJjYjFhMTNiODE0ODMwOWM2ZGU3ZWMyNWQ2OTQ1ZDY1NzE0NmI5ZDU5OTRiOGZlYjExMTEnLFxuICAgICAgICAnNWNhNTYwNzUzYmUyYTEyZmM2ZGU2Y2FmMmNiNDg5NTY1ZGI5MzYxNTZiOTUxNGUxYmI1ZTgzMDM3ZTBmYTJkNCdcbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgICc0ZTQyYzhlYzgyYzk5Nzk4Y2NmM2E2MTBiZTg3MGU3ODMzOGM3ZjcxMzM0OGJkMzRjODIwM2VmNDAzN2YzNTAyJyxcbiAgICAgICAgJzc1NzFkNzRlZTVlMGZiOTJhN2E4YjMzYTA3NzgzMzQxYTU0OTIxNDRjYzU0YmNjNDBhOTQ0NzM2OTM2MDY0MzcnXG4gICAgICBdLFxuICAgICAgW1xuICAgICAgICAnMzc3NWFiNzA4OWJjNmFmODIzYWJhMmUxYWY3MGIyMzZkMjUxY2FkYjBjODY3NDMyODc1MjJhMWIzYjBkZWRlYScsXG4gICAgICAgICdiZTUyZDEwN2JjZmEwOWQ4YmNiOTczNmE4MjhjZmE3ZmFjOGRiMTdiZjdhNzZhMmM0MmFkOTYxNDA5MDE4Y2Y3J1xuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgJ2NlZTMxY2JmN2UzNGVjMzc5ZDk0ZmI4MTRkM2Q3NzVhZDk1NDU5NWQxMzE0YmE4ODQ2OTU5ZTNlODJmNzRlMjYnLFxuICAgICAgICAnOGZkNjRhMTRjMDZiNTg5YzI2Yjk0N2FlMmJjZjZiZmEwMTQ5ZWYwYmUxNGVkNGQ4MGY0NDhhMDFjNDNiMWM2ZCdcbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgICdiNGY5ZWFlYTA5YjY5MTc2MTlmNmVhNmE0ZWI1NDY0ZWZkZGI1OGZkNDViMWViZWZjZGMxYTAxZDA4YjQ3OTg2JyxcbiAgICAgICAgJzM5ZTVjOTkyNWI1YTU0YjA3NDMzYTRmMThjNjE3MjZmOGJiMTMxYzAxMmNhNTQyZWIyNGE4YWMwNzIwMDY4MmEnXG4gICAgICBdLFxuICAgICAgW1xuICAgICAgICAnZDQyNjNkZmMzZDJkZjkyM2EwMTc5YTQ4OTY2ZDMwY2U4NGUyNTE1YWZjM2RjY2MxYjc3OTA3NzkyZWJjYzYwZScsXG4gICAgICAgICc2MmRmYWYwN2EwZjc4ZmViMzBlMzBkNjI5NTg1M2NlMTg5ZTEyNzc2MGFkNmNmN2ZhZTE2NGUxMjJhMjA4ZDU0J1xuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgJzQ4NDU3NTI0ODIwZmE2NWE0ZjhkMzVlYjY5MzA4NTdjMDAzMmFjYzBhNGEyZGU0MjIyMzNlZWRhODk3NjEyYzQnLFxuICAgICAgICAnMjVhNzQ4YWIzNjc5NzlkOTg3MzNjMzhhMWZhMWMyZTdkYzZjYzA3ZGIyZDYwYTlhZTdhNzZhYWE0OWJkMGY3NydcbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgICdkZmVlZWYxODgxMTAxZjJjYjExNjQ0ZjNhMmFmZGZjMjA0NWUxOTkxOTE1MjkyM2YzNjdhMTc2N2MxMWNjZWRhJyxcbiAgICAgICAgJ2VjZmI3MDU2Y2YxZGUwNDJmOTQyMGJhYjM5Njc5M2MwYzM5MGJkZTc0YjRiYmRmZjE2YTgzYWUwOWE5YTc1MTcnXG4gICAgICBdLFxuICAgICAgW1xuICAgICAgICAnNmQ3ZWY2YjE3NTQzZjgzNzNjNTczZjQ0ZTFmMzg5ODM1ZDg5YmNiYzYwNjJjZWQzNmM4MmRmODNiOGZhZTg1OScsXG4gICAgICAgICdjZDQ1MGVjMzM1NDM4OTg2ZGZlZmExMGM1N2ZlYTliY2M1MjFhMDk1OWIyZDgwYmJmNzRiMTkwZGNhNzEyZDEwJ1xuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgJ2U3NTYwNWQ1OTEwMmE1YTI2ODQ1MDBkM2I5OTFmMmUzZjNjODhiOTMyMjU1NDcwMzVhZjI1YWY2NmUwNDU0MWYnLFxuICAgICAgICAnZjVjNTQ3NTRhOGY3MWVlNTQwYjliNDg3Mjg0NzNlMzE0ZjcyOWFjNTMwOGIwNjkzODM2MDk5MGUyYmZhZDEyNSdcbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgICdlYjk4NjYwZjRjNGRmYWEwNmEyYmU0NTNkNTAyMGJjOTlhMGMyZTYwYWJlMzg4NDU3ZGQ0M2ZlZmIxZWQ2MjBjJyxcbiAgICAgICAgJzZjYjlhODg3NmQ5Y2I4NTIwNjA5YWYzYWRkMjZjZDIwYTBhN2NkOGE5NDExMTMxY2U4NWY0NDEwMDA5OTIyM2UnXG4gICAgICBdLFxuICAgICAgW1xuICAgICAgICAnMTNlODdiMDI3ZDg1MTRkMzU5MzlmMmU2ODkyYjE5OTIyMTU0NTk2OTQxODg4MzM2ZGMzNTYzZTNiOGRiYTk0MicsXG4gICAgICAgICdmZWY1YTNjNjgwNTlhNmRlYzVkNjI0MTE0YmYxZTkxYWFjMmI5ZGE1NjhkNmFiZWIyNTcwZDU1NjQ2YjhhZGYxJ1xuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgJ2VlMTYzMDI2ZTlmZDZmZTAxN2MzOGYwNmE1YmU2ZmMxMjU0MjRiMzcxY2UyNzA4ZTdiZjQ0OTE2OTFlNTc2NGEnLFxuICAgICAgICAnMWFjYjI1MGYyNTVkZDYxYzQzZDk0Y2NjNjcwZDBmNThmNDlhZTNmYTE1Yjk2NjIzZTU0MzBkYTBhZDZjNjJiMidcbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgICdiMjY4ZjVlZjlhZDUxZTRkNzhkZTNhNzUwYzJkYzg5YjFlNjI2ZDQzNTA1ODY3OTk5OTMyZTVkYjMzYWYzZDgwJyxcbiAgICAgICAgJzVmMzEwZDRiM2M5OWI5ZWJiMTlmNzdkNDFjMWRlZTAxOGNmMGQzNGZkNDE5MTYxNDAwM2U5NDVhMTIxNmU0MjMnXG4gICAgICBdLFxuICAgICAgW1xuICAgICAgICAnZmYwN2YzMTE4YTlkZjAzNWU5ZmFkODVlYjZjN2JmZTQyYjAyZjAxY2E5OWNlZWEzYmY3ZmZkYmE5M2M0NzUwZCcsXG4gICAgICAgICc0MzgxMzZkNjAzZTg1OGEzYTVjNDQwYzM4ZWNjYmFkZGMxZDI5NDIxMTRlMmVkZGQ0NzQwZDA5OGNlZDFmMGQ4J1xuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgJzhkOGI5ODU1YzdjMDUyYTM0MTQ2ZmQyMGZmYjY1OGJlYTRiOWY2OWUwZDgyNWViZWMxNmU4YzNjZTJiNTI2YTEnLFxuICAgICAgICAnY2RiNTU5ZWVkYzJkNzlmOTI2YmFmNDRmYjg0ZWE0ZDQ0YmNmNTBmZWU1MWQ3Y2ViMzBlMmU3ZjQ2MzAzNjc1OCdcbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgICc1MmRiMGI1Mzg0ZGZiZjA1YmZhOWQ0NzJkN2FlMjZkZmU0Yjg1MWNlY2E5MWIxZWJhNTQyNjMxODBkYTMyYjYzJyxcbiAgICAgICAgJ2MzYjk5N2QwNTBlZTVkNDIzZWJhZjY2YTZkYjlmNTdiMzE4MGM5MDI4NzU2NzlkZTkyNGI2OWQ4NGE3YjM3NSdcbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgICdlNjJmOTQ5MGQzZDUxZGE2Mzk1ZWZkMjRlODA5MTljYzdkMGYyOWMzZjNmYTQ4YzZmZmY1NDNiZWNiZDQzMzUyJyxcbiAgICAgICAgJzZkODlhZDdiYTQ4NzZiMGIyMmMyY2EyODBjNjgyODYyZjM0MmM4NTkxZjFkYWY1MTcwZTA3YmZkOWNjYWZhN2QnXG4gICAgICBdLFxuICAgICAgW1xuICAgICAgICAnN2YzMGVhMjQ3NmIzOTliNDk1NzUwOWM4OGY3N2QwMTkxYWZhMmZmNWNiN2IxNGZkNmQ4ZTdkNjVhYWFiMTE5MycsXG4gICAgICAgICdjYTVlZjdkNGIyMzFjOTRjM2IxNTM4OWE1ZjYzMTFlOWRhZmY3YmI2N2IxMDNlOTg4MGVmNGJmZjYzN2FjYWVjJ1xuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgJzUwOThmZjFlMWQ5ZjE0ZmI0NmEyMTBmYWRhNmM5MDNmZWYwZmI3YjRhMWRkMWQ5YWM2MGEwMzYxODAwYjdhMDAnLFxuICAgICAgICAnOTczMTE0MWQ4MWZjOGY4MDg0ZDM3YzZlNzU0MjAwNmIzZWUxYjQwZDYwZGZlNTM2MmE1YjEzMmZkMTdkZGMwJ1xuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgJzMyYjc4YzdkZTllZTUxMmE3Mjg5NWJlNmI5Y2JlZmE2ZTJmM2M0Y2NjZTQ0NWM5NmI5ZjJjODFlMjc3OGFkNTgnLFxuICAgICAgICAnZWUxODQ5ZjUxM2RmNzFlMzJlZmMzODk2ZWUyODI2MGM3M2JiODA1NDdhZTIyNzViYTQ5NzIzNzc5NGM4NzUzYydcbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgICdlMmNiNzRmZGRjOGU5ZmJjZDA3NmVlZjJhN2M3MmIwY2UzN2Q1MGYwODI2OWRmYzA3NGI1ODE1NTA1NDdhNGY3JyxcbiAgICAgICAgJ2QzYWEyZWQ3MWM5ZGQyMjQ3YTYyZGYwNjI3MzZlYjBiYWRkZWE5ZTM2MTIyZDJiZTg2NDFhYmNiMDA1Y2M0YTQnXG4gICAgICBdLFxuICAgICAgW1xuICAgICAgICAnODQzODQ0NzU2NmQ0ZDdiZWRhZGMyOTk0OTZhYjM1NzQyNjAwOWEzNWYyMzVjYjE0MWJlMGQ5OWNkMTBhZTNhOCcsXG4gICAgICAgICdjNGUxMDIwOTE2OTgwYTRkYTVkMDFhYzVlNmFkMzMwNzM0ZWYwZDc5MDY2MzFjNGYyMzkwNDI2YjJlZGQ3OTFmJ1xuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgJzQxNjJkNDg4Yjg5NDAyMDM5YjU4NGM2ZmM2YzMwODg3MDU4N2Q5YzQ2ZjY2MGI4NzhhYjY1YzgyYzcxMWQ2N2UnLFxuICAgICAgICAnNjcxNjNlOTAzMjM2Mjg5Zjc3NmYyMmMyNWZiOGEzYWZjMTczMmYyYjg0YjRlOTVkYmRhNDdhZTVhMDg1MjY0OSdcbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgICczZmFkM2ZhODRjYWYwZjM0ZjBmODliZmQyZGNmNTRmYzE3NWQ3NjdhZWMzZTUwNjg0ZjNiYTRhNGJmNWY2ODNkJyxcbiAgICAgICAgJ2NkMWJjN2NiNmNjNDA3YmIyZjBjYTY0N2M3MThhNzMwY2Y3MTg3MmU3ZDBkMmE1M2ZhMjBlZmNkZmU2MTgyNidcbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgICc2NzRmMjYwMGEzMDA3YTAwNTY4YzFhN2NlMDVkMDgxNmMxZmI4NGJmMTM3MDc5OGYxYzY5NTMyZmFlYjFhODZiJyxcbiAgICAgICAgJzI5OWQyMWY5NDEzZjMzYjNlZGY0M2IyNTcwMDQ1ODBiNzBkYjU3ZGEwYjE4MjI1OWUwOWVlY2M2OWUwZDM4YTUnXG4gICAgICBdLFxuICAgICAgW1xuICAgICAgICAnZDMyZjRkYTU0YWRlNzRhYmI4MWI4MTVhZDFmYjNiMjYzZDgyZDZjNjkyNzE0YmNmZjg3ZDI5YmQ1ZWU5ZjA4ZicsXG4gICAgICAgICdmOTQyOWU3MzhiOGU1M2I5NjhlOTkwMTZjMDU5NzA3NzgyZTE0ZjQ1MzUzNTlkNTgyZmM0MTY5MTBiM2VlYTg3J1xuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgJzMwZTRlNjcwNDM1Mzg1NTU2ZTU5MzY1NzEzNTg0NWQzNmZiYjY5MzFmNzJiMDhjYjFlZDk1NGYxZTNjZTNmZjYnLFxuICAgICAgICAnNDYyZjliY2U2MTk4OTg2Mzg0OTkzNTAxMTNiYmM5YjEwYTg3OGQzNWRhNzA3NDBkYzY5NWE1NTllYjg4ZGI3YidcbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgICdiZTIwNjIwMDNjNTFjYzMwMDQ2ODI5MDQzMzBlNGRlZTdmM2RjZDEwYjAxZTU4MGJmMTk3MWIwNGQ0Y2FkMjk3JyxcbiAgICAgICAgJzYyMTg4YmM0OWQ2MWU1NDI4NTczZDQ4YTc0ZTFjNjU1YjFjNjEwOTA5MDU2ODJhMGQ1NTU4ZWQ3MmRjY2I5YmMnXG4gICAgICBdLFxuICAgICAgW1xuICAgICAgICAnOTMxNDQ0MjNhY2UzNDUxZWQyOWUwZmI5YWMyYWYyMTFjYjZlODRhNjAxZGY1OTkzYzQxOTg1OWZmZjVkZjA0YScsXG4gICAgICAgICc3YzEwZGZiMTY0YzM0MjVmNWM3MWEzZjlkNzk5MjAzOGYxMDY1MjI0ZjcyYmI5ZDFkOTAyYTZkMTMwMzdiNDdjJ1xuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgJ2IwMTVmODA0NGY1ZmNiZGNmMjFjYTI2ZDZjMzRmYjgxOTc4MjkyMDVjN2I3ZDJhN2NiNjY0MThjMTU3YjExMmMnLFxuICAgICAgICAnYWI4YzFlMDg2ZDA0ZTgxMzc0NGE2NTViMmRmOGQ1ZjgzYjNjZGM2ZmFhMzA4OGMxZDNhZWExNDU0ZTNhMWQ1ZidcbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgICdkNWU5ZTFkYTY0OWQ5N2Q4OWU0ODY4MTE3YTQ2NWEzYTRmOGExOGRlNTdhMTQwZDM2YjNmMmFmMzQxYTIxYjUyJyxcbiAgICAgICAgJzRjYjA0NDM3ZjM5MWVkNzMxMTFhMTNjYzFkNGRkMGRiMTY5MzQ2NWMyMjQwNDgwZDg5NTVlODU5MmYyNzQ0N2EnXG4gICAgICBdLFxuICAgICAgW1xuICAgICAgICAnZDNhZTQxMDQ3ZGQ3Y2EwNjVkYmY4ZWQ3N2I5OTI0Mzk5ODMwMDVjZDcyZTE2ZDZmOTk2YTUzMTZkMzY5NjZiYicsXG4gICAgICAgICdiZDFhZWIyMWFkMjJlYmIyMmExMGYwMzAzNDE3YzZkOTY0ZjhjZGQ3ZGYwYWNhNjE0YjEwZGMxNGQxMjVhYzQ2J1xuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgJzQ2M2UyNzYzZDg4NWY5NThmYzY2Y2RkMjI4MDBmMGE0ODcxOTdkMGE4MmUzNzdiNDlmODBhZjg3Yzg5N2IwNjUnLFxuICAgICAgICAnYmZlZmFjZGIwZTVkMGZkN2RmM2EzMTFhOTRkZTA2MmIyNmI4MGM2MWZiYzk3NTA4Yjc5OTkyNjcxZWY3Y2E3ZidcbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgICc3OTg1ZmRmZDEyN2MwNTY3YzZmNTNlYzFiYjYzZWMzMTU4ZTU5N2M0MGJmZTc0N2M4M2NkZGZjOTEwNjQxOTE3JyxcbiAgICAgICAgJzYwM2MxMmRhZjNkOTg2MmVmMmIyNWZlMWRlMjg5YWVkMjRlZDI5MWUwZWM2NzA4NzAzYTViZDU2N2YzMmVkMDMnXG4gICAgICBdLFxuICAgICAgW1xuICAgICAgICAnNzRhMWFkNmI1Zjc2ZTM5ZGIyZGQyNDk0MTBlYWM3Zjk5ZTc0YzU5Y2I4M2QyZDBlZDVmZjE1NDNkYTc3MDNlOScsXG4gICAgICAgICdjYzYxNTdlZjE4YzljNjNjZDYxOTNkODM2MzFiYmVhMDA5M2UwOTY4OTQyZThjMzNkNTczN2ZkNzkwZTBkYjA4J1xuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgJzMwNjgyYTUwNzAzMzc1ZjYwMmQ0MTY2NjRiYTE5YjdmYzliYWI0MmM3Mjc0NzQ2M2E3MWQwODk2YjIyZjZkYTMnLFxuICAgICAgICAnNTUzZTA0ZjZiMDE4YjRmYTZjOGYzOWU3ZjMxMWQzMTc2MjkwZDBlMGYxOWNhNzNmMTc3MTRkOTk3N2EyMmZmOCdcbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgICc5ZTIxNThmMGQ3YzBkNWYyNmMzNzkxZWZlZmE3OTU5NzY1NGU3YTJiMjQ2NGY1MmIxZWU2YzEzNDc3NjllZjU3JyxcbiAgICAgICAgJzcxMmZjZGQxYjkwNTNmMDkwMDNhMzQ4MWZhNzc2MmU5ZmZkN2M4ZWYzNWEzODUwOWUyZmJmMjYyOTAwODM3MydcbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgICcxNzZlMjY5ODlhNDNjOWNmZWJhNDAyOWMyMDI1MzhjMjgxNzJlNTY2ZTNjNGZjZTczMjI4NTdmM2JlMzI3ZDY2JyxcbiAgICAgICAgJ2VkOGNjOWQwNGIyOWViODc3ZDI3MGI0ODc4ZGM0M2MxOWFlZmQzMWY0ZWVlMDllZTdiNDc4MzRjMWZhNGIxYzMnXG4gICAgICBdLFxuICAgICAgW1xuICAgICAgICAnNzVkNDZlZmVhMzc3MWU2ZTY4YWJiODlhMTNhZDc0N2VjZjE4OTIzOTNkZmM0ZjFiNzAwNDc4OGM1MDM3NGRhOCcsXG4gICAgICAgICc5ODUyMzkwYTk5NTA3Njc5ZmQwYjg2ZmQyYjM5YTg2OGQ3ZWZjMjIxNTEzNDZlMWEzY2E0NzI2NTg2YTZiZWQ4J1xuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgJzgwOWEyMGM2N2Q2NDkwMGZmYjY5OGM0YzgyNWY2ZDVmMjMxMGZiMDQ1MWM4NjkzNDViNzMxOWY2NDU2MDU3MjEnLFxuICAgICAgICAnOWU5OTQ5ODBkOTkxN2UyMmI3NmIwNjE5MjdmYTA0MTQzZDA5NmNjYzU0OTYzZTZhNWViZmE1ZjNmOGUyODZjMSdcbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgICcxYjM4OTAzYTQzZjdmMTE0ZWQ0NTAwYjRlYWM3MDgzZmRlZmVjZTFjZjI5YzYzNTI4ZDU2MzQ0NmY5NzJjMTgwJyxcbiAgICAgICAgJzQwMzZlZGM5MzFhNjBhZTg4OTM1M2Y3N2ZkNTNkZTRhMjcwOGIyNmI2ZjVkYTcyYWQzMzk0MTE5ZGFmNDA4ZjknXG4gICAgICBdXG4gICAgXVxuICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgY3VydmUgPSBleHBvcnRzO1xuXG5jdXJ2ZS5iYXNlID0gcmVxdWlyZSgnLi9iYXNlJyk7XG5jdXJ2ZS5zaG9ydCA9IHJlcXVpcmUoJy4vc2hvcnQnKTtcbmN1cnZlLm1vbnQgPSByZXF1aXJlKCcuL21vbnQnKTtcbmN1cnZlLmVkd2FyZHMgPSByZXF1aXJlKCcuL2Vkd2FyZHMnKTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIEJOID0gcmVxdWlyZSgnYm4uanMnKTtcbnZhciBlbGxpcHRpYyA9IHJlcXVpcmUoJy4uLy4uL2VsbGlwdGljJyk7XG52YXIgdXRpbHMgPSBlbGxpcHRpYy51dGlscztcbnZhciBhc3NlcnQgPSB1dGlscy5hc3NlcnQ7XG52YXIgY2FjaGVkUHJvcGVydHkgPSB1dGlscy5jYWNoZWRQcm9wZXJ0eTtcbnZhciBwYXJzZUJ5dGVzID0gdXRpbHMucGFyc2VCeXRlcztcblxuLyoqXG4qIEBwYXJhbSB7RUREU0F9IGVkZHNhIC0gZWRkc2EgaW5zdGFuY2VcbiogQHBhcmFtIHtBcnJheTxCeXRlcz58T2JqZWN0fSBzaWcgLVxuKiBAcGFyYW0ge0FycmF5PEJ5dGVzPnxQb2ludH0gW3NpZy5SXSAtIFIgcG9pbnQgYXMgUG9pbnQgb3IgYnl0ZXNcbiogQHBhcmFtIHtBcnJheTxCeXRlcz58Ym59IFtzaWcuU10gLSBTIHNjYWxhciBhcyBibiBvciBieXRlc1xuKiBAcGFyYW0ge0FycmF5PEJ5dGVzPn0gW3NpZy5SZW5jb2RlZF0gLSBSIHBvaW50IGVuY29kZWRcbiogQHBhcmFtIHtBcnJheTxCeXRlcz59IFtzaWcuU2VuY29kZWRdIC0gUyBzY2FsYXIgZW5jb2RlZFxuKi9cbmZ1bmN0aW9uIFNpZ25hdHVyZShlZGRzYSwgc2lnKSB7XG4gIHRoaXMuZWRkc2EgPSBlZGRzYTtcblxuICBpZiAodHlwZW9mIHNpZyAhPT0gJ29iamVjdCcpXG4gICAgc2lnID0gcGFyc2VCeXRlcyhzaWcpO1xuXG4gIGlmIChBcnJheS5pc0FycmF5KHNpZykpIHtcbiAgICBzaWcgPSB7XG4gICAgICBSOiBzaWcuc2xpY2UoMCwgZWRkc2EuZW5jb2RpbmdMZW5ndGgpLFxuICAgICAgUzogc2lnLnNsaWNlKGVkZHNhLmVuY29kaW5nTGVuZ3RoKVxuICAgIH07XG4gIH1cblxuICBhc3NlcnQoc2lnLlIgJiYgc2lnLlMsICdTaWduYXR1cmUgd2l0aG91dCBSIG9yIFMnKTtcblxuICBpZiAoZWRkc2EuaXNQb2ludChzaWcuUikpXG4gICAgdGhpcy5fUiA9IHNpZy5SO1xuICBpZiAoc2lnLlMgaW5zdGFuY2VvZiBCTilcbiAgICB0aGlzLl9TID0gc2lnLlM7XG5cbiAgdGhpcy5fUmVuY29kZWQgPSBBcnJheS5pc0FycmF5KHNpZy5SKSA/IHNpZy5SIDogc2lnLlJlbmNvZGVkO1xuICB0aGlzLl9TZW5jb2RlZCA9IEFycmF5LmlzQXJyYXkoc2lnLlMpID8gc2lnLlMgOiBzaWcuU2VuY29kZWQ7XG59XG5cbmNhY2hlZFByb3BlcnR5KFNpZ25hdHVyZSwgJ1MnLCBmdW5jdGlvbiBTKCkge1xuICByZXR1cm4gdGhpcy5lZGRzYS5kZWNvZGVJbnQodGhpcy5TZW5jb2RlZCgpKTtcbn0pO1xuXG5jYWNoZWRQcm9wZXJ0eShTaWduYXR1cmUsICdSJywgZnVuY3Rpb24gUigpIHtcbiAgcmV0dXJuIHRoaXMuZWRkc2EuZGVjb2RlUG9pbnQodGhpcy5SZW5jb2RlZCgpKTtcbn0pO1xuXG5jYWNoZWRQcm9wZXJ0eShTaWduYXR1cmUsICdSZW5jb2RlZCcsIGZ1bmN0aW9uIFJlbmNvZGVkKCkge1xuICByZXR1cm4gdGhpcy5lZGRzYS5lbmNvZGVQb2ludCh0aGlzLlIoKSk7XG59KTtcblxuY2FjaGVkUHJvcGVydHkoU2lnbmF0dXJlLCAnU2VuY29kZWQnLCBmdW5jdGlvbiBTZW5jb2RlZCgpIHtcbiAgcmV0dXJuIHRoaXMuZWRkc2EuZW5jb2RlSW50KHRoaXMuUygpKTtcbn0pO1xuXG5TaWduYXR1cmUucHJvdG90eXBlLnRvQnl0ZXMgPSBmdW5jdGlvbiB0b0J5dGVzKCkge1xuICByZXR1cm4gdGhpcy5SZW5jb2RlZCgpLmNvbmNhdCh0aGlzLlNlbmNvZGVkKCkpO1xufTtcblxuU2lnbmF0dXJlLnByb3RvdHlwZS50b0hleCA9IGZ1bmN0aW9uIHRvSGV4KCkge1xuICByZXR1cm4gdXRpbHMuZW5jb2RlKHRoaXMudG9CeXRlcygpLCAnaGV4JykudG9VcHBlckNhc2UoKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gU2lnbmF0dXJlO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgY3VydmUgPSByZXF1aXJlKCcuLi9jdXJ2ZScpO1xudmFyIEJOID0gcmVxdWlyZSgnYm4uanMnKTtcbnZhciBpbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJyk7XG52YXIgQmFzZSA9IGN1cnZlLmJhc2U7XG5cbnZhciBlbGxpcHRpYyA9IHJlcXVpcmUoJy4uLy4uL2VsbGlwdGljJyk7XG52YXIgdXRpbHMgPSBlbGxpcHRpYy51dGlscztcblxuZnVuY3Rpb24gTW9udEN1cnZlKGNvbmYpIHtcbiAgQmFzZS5jYWxsKHRoaXMsICdtb250JywgY29uZik7XG5cbiAgdGhpcy5hID0gbmV3IEJOKGNvbmYuYSwgMTYpLnRvUmVkKHRoaXMucmVkKTtcbiAgdGhpcy5iID0gbmV3IEJOKGNvbmYuYiwgMTYpLnRvUmVkKHRoaXMucmVkKTtcbiAgdGhpcy5pNCA9IG5ldyBCTig0KS50b1JlZCh0aGlzLnJlZCkucmVkSW52bSgpO1xuICB0aGlzLnR3byA9IG5ldyBCTigyKS50b1JlZCh0aGlzLnJlZCk7XG4gIHRoaXMuYTI0ID0gdGhpcy5pNC5yZWRNdWwodGhpcy5hLnJlZEFkZCh0aGlzLnR3bykpO1xufVxuaW5oZXJpdHMoTW9udEN1cnZlLCBCYXNlKTtcbm1vZHVsZS5leHBvcnRzID0gTW9udEN1cnZlO1xuXG5Nb250Q3VydmUucHJvdG90eXBlLnZhbGlkYXRlID0gZnVuY3Rpb24gdmFsaWRhdGUocG9pbnQpIHtcbiAgdmFyIHggPSBwb2ludC5ub3JtYWxpemUoKS54O1xuICB2YXIgeDIgPSB4LnJlZFNxcigpO1xuICB2YXIgcmhzID0geDIucmVkTXVsKHgpLnJlZEFkZCh4Mi5yZWRNdWwodGhpcy5hKSkucmVkQWRkKHgpO1xuICB2YXIgeSA9IHJocy5yZWRTcXJ0KCk7XG5cbiAgcmV0dXJuIHkucmVkU3FyKCkuY21wKHJocykgPT09IDA7XG59O1xuXG5mdW5jdGlvbiBQb2ludChjdXJ2ZSwgeCwgeikge1xuICBCYXNlLkJhc2VQb2ludC5jYWxsKHRoaXMsIGN1cnZlLCAncHJvamVjdGl2ZScpO1xuICBpZiAoeCA9PT0gbnVsbCAmJiB6ID09PSBudWxsKSB7XG4gICAgdGhpcy54ID0gdGhpcy5jdXJ2ZS5vbmU7XG4gICAgdGhpcy56ID0gdGhpcy5jdXJ2ZS56ZXJvO1xuICB9IGVsc2Uge1xuICAgIHRoaXMueCA9IG5ldyBCTih4LCAxNik7XG4gICAgdGhpcy56ID0gbmV3IEJOKHosIDE2KTtcbiAgICBpZiAoIXRoaXMueC5yZWQpXG4gICAgICB0aGlzLnggPSB0aGlzLngudG9SZWQodGhpcy5jdXJ2ZS5yZWQpO1xuICAgIGlmICghdGhpcy56LnJlZClcbiAgICAgIHRoaXMueiA9IHRoaXMuei50b1JlZCh0aGlzLmN1cnZlLnJlZCk7XG4gIH1cbn1cbmluaGVyaXRzKFBvaW50LCBCYXNlLkJhc2VQb2ludCk7XG5cbk1vbnRDdXJ2ZS5wcm90b3R5cGUuZGVjb2RlUG9pbnQgPSBmdW5jdGlvbiBkZWNvZGVQb2ludChieXRlcywgZW5jKSB7XG4gIHJldHVybiB0aGlzLnBvaW50KHV0aWxzLnRvQXJyYXkoYnl0ZXMsIGVuYyksIDEpO1xufTtcblxuTW9udEN1cnZlLnByb3RvdHlwZS5wb2ludCA9IGZ1bmN0aW9uIHBvaW50KHgsIHopIHtcbiAgcmV0dXJuIG5ldyBQb2ludCh0aGlzLCB4LCB6KTtcbn07XG5cbk1vbnRDdXJ2ZS5wcm90b3R5cGUucG9pbnRGcm9tSlNPTiA9IGZ1bmN0aW9uIHBvaW50RnJvbUpTT04ob2JqKSB7XG4gIHJldHVybiBQb2ludC5mcm9tSlNPTih0aGlzLCBvYmopO1xufTtcblxuUG9pbnQucHJvdG90eXBlLnByZWNvbXB1dGUgPSBmdW5jdGlvbiBwcmVjb21wdXRlKCkge1xuICAvLyBOby1vcFxufTtcblxuUG9pbnQucHJvdG90eXBlLl9lbmNvZGUgPSBmdW5jdGlvbiBfZW5jb2RlKCkge1xuICByZXR1cm4gdGhpcy5nZXRYKCkudG9BcnJheSgnYmUnLCB0aGlzLmN1cnZlLnAuYnl0ZUxlbmd0aCgpKTtcbn07XG5cblBvaW50LmZyb21KU09OID0gZnVuY3Rpb24gZnJvbUpTT04oY3VydmUsIG9iaikge1xuICByZXR1cm4gbmV3IFBvaW50KGN1cnZlLCBvYmpbMF0sIG9ialsxXSB8fCBjdXJ2ZS5vbmUpO1xufTtcblxuUG9pbnQucHJvdG90eXBlLmluc3BlY3QgPSBmdW5jdGlvbiBpbnNwZWN0KCkge1xuICBpZiAodGhpcy5pc0luZmluaXR5KCkpXG4gICAgcmV0dXJuICc8RUMgUG9pbnQgSW5maW5pdHk+JztcbiAgcmV0dXJuICc8RUMgUG9pbnQgeDogJyArIHRoaXMueC5mcm9tUmVkKCkudG9TdHJpbmcoMTYsIDIpICtcbiAgICAgICcgejogJyArIHRoaXMuei5mcm9tUmVkKCkudG9TdHJpbmcoMTYsIDIpICsgJz4nO1xufTtcblxuUG9pbnQucHJvdG90eXBlLmlzSW5maW5pdHkgPSBmdW5jdGlvbiBpc0luZmluaXR5KCkge1xuICAvLyBYWFggVGhpcyBjb2RlIGFzc3VtZXMgdGhhdCB6ZXJvIGlzIGFsd2F5cyB6ZXJvIGluIHJlZFxuICByZXR1cm4gdGhpcy56LmNtcG4oMCkgPT09IDA7XG59O1xuXG5Qb2ludC5wcm90b3R5cGUuZGJsID0gZnVuY3Rpb24gZGJsKCkge1xuICAvLyBodHRwOi8vaHlwZXJlbGxpcHRpYy5vcmcvRUZEL2cxcC9hdXRvLW1vbnRnb20teHouaHRtbCNkb3VibGluZy1kYmwtMTk4Ny1tLTNcbiAgLy8gMk0gKyAyUyArIDRBXG5cbiAgLy8gQSA9IFgxICsgWjFcbiAgdmFyIGEgPSB0aGlzLngucmVkQWRkKHRoaXMueik7XG4gIC8vIEFBID0gQV4yXG4gIHZhciBhYSA9IGEucmVkU3FyKCk7XG4gIC8vIEIgPSBYMSAtIFoxXG4gIHZhciBiID0gdGhpcy54LnJlZFN1Yih0aGlzLnopO1xuICAvLyBCQiA9IEJeMlxuICB2YXIgYmIgPSBiLnJlZFNxcigpO1xuICAvLyBDID0gQUEgLSBCQlxuICB2YXIgYyA9IGFhLnJlZFN1YihiYik7XG4gIC8vIFgzID0gQUEgKiBCQlxuICB2YXIgbnggPSBhYS5yZWRNdWwoYmIpO1xuICAvLyBaMyA9IEMgKiAoQkIgKyBBMjQgKiBDKVxuICB2YXIgbnogPSBjLnJlZE11bChiYi5yZWRBZGQodGhpcy5jdXJ2ZS5hMjQucmVkTXVsKGMpKSk7XG4gIHJldHVybiB0aGlzLmN1cnZlLnBvaW50KG54LCBueik7XG59O1xuXG5Qb2ludC5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gYWRkKCkge1xuICB0aHJvdyBuZXcgRXJyb3IoJ05vdCBzdXBwb3J0ZWQgb24gTW9udGdvbWVyeSBjdXJ2ZScpO1xufTtcblxuUG9pbnQucHJvdG90eXBlLmRpZmZBZGQgPSBmdW5jdGlvbiBkaWZmQWRkKHAsIGRpZmYpIHtcbiAgLy8gaHR0cDovL2h5cGVyZWxsaXB0aWMub3JnL0VGRC9nMXAvYXV0by1tb250Z29tLXh6Lmh0bWwjZGlmZmFkZC1kYWRkLTE5ODctbS0zXG4gIC8vIDRNICsgMlMgKyA2QVxuXG4gIC8vIEEgPSBYMiArIFoyXG4gIHZhciBhID0gdGhpcy54LnJlZEFkZCh0aGlzLnopO1xuICAvLyBCID0gWDIgLSBaMlxuICB2YXIgYiA9IHRoaXMueC5yZWRTdWIodGhpcy56KTtcbiAgLy8gQyA9IFgzICsgWjNcbiAgdmFyIGMgPSBwLngucmVkQWRkKHAueik7XG4gIC8vIEQgPSBYMyAtIFozXG4gIHZhciBkID0gcC54LnJlZFN1YihwLnopO1xuICAvLyBEQSA9IEQgKiBBXG4gIHZhciBkYSA9IGQucmVkTXVsKGEpO1xuICAvLyBDQiA9IEMgKiBCXG4gIHZhciBjYiA9IGMucmVkTXVsKGIpO1xuICAvLyBYNSA9IFoxICogKERBICsgQ0IpXjJcbiAgdmFyIG54ID0gZGlmZi56LnJlZE11bChkYS5yZWRBZGQoY2IpLnJlZFNxcigpKTtcbiAgLy8gWjUgPSBYMSAqIChEQSAtIENCKV4yXG4gIHZhciBueiA9IGRpZmYueC5yZWRNdWwoZGEucmVkSVN1YihjYikucmVkU3FyKCkpO1xuICByZXR1cm4gdGhpcy5jdXJ2ZS5wb2ludChueCwgbnopO1xufTtcblxuUG9pbnQucHJvdG90eXBlLm11bCA9IGZ1bmN0aW9uIG11bChrKSB7XG4gIHZhciB0ID0gay5jbG9uZSgpO1xuICB2YXIgYSA9IHRoaXM7IC8vIChOIC8gMikgKiBRICsgUVxuICB2YXIgYiA9IHRoaXMuY3VydmUucG9pbnQobnVsbCwgbnVsbCk7IC8vIChOIC8gMikgKiBRXG4gIHZhciBjID0gdGhpczsgLy8gUVxuXG4gIGZvciAodmFyIGJpdHMgPSBbXTsgdC5jbXBuKDApICE9PSAwOyB0Lml1c2hybigxKSlcbiAgICBiaXRzLnB1c2godC5hbmRsbigxKSk7XG5cbiAgZm9yICh2YXIgaSA9IGJpdHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICBpZiAoYml0c1tpXSA9PT0gMCkge1xuICAgICAgLy8gTiAqIFEgKyBRID0gKChOIC8gMikgKiBRICsgUSkpICsgKE4gLyAyKSAqIFFcbiAgICAgIGEgPSBhLmRpZmZBZGQoYiwgYyk7XG4gICAgICAvLyBOICogUSA9IDIgKiAoKE4gLyAyKSAqIFEgKyBRKSlcbiAgICAgIGIgPSBiLmRibCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBOICogUSA9ICgoTiAvIDIpICogUSArIFEpICsgKChOIC8gMikgKiBRKVxuICAgICAgYiA9IGEuZGlmZkFkZChiLCBjKTtcbiAgICAgIC8vIE4gKiBRICsgUSA9IDIgKiAoKE4gLyAyKSAqIFEgKyBRKVxuICAgICAgYSA9IGEuZGJsKCk7XG4gICAgfVxuICB9XG4gIHJldHVybiBiO1xufTtcblxuUG9pbnQucHJvdG90eXBlLm11bEFkZCA9IGZ1bmN0aW9uIG11bEFkZCgpIHtcbiAgdGhyb3cgbmV3IEVycm9yKCdOb3Qgc3VwcG9ydGVkIG9uIE1vbnRnb21lcnkgY3VydmUnKTtcbn07XG5cblBvaW50LnByb3RvdHlwZS5qdW1sQWRkID0gZnVuY3Rpb24ganVtbEFkZCgpIHtcbiAgdGhyb3cgbmV3IEVycm9yKCdOb3Qgc3VwcG9ydGVkIG9uIE1vbnRnb21lcnkgY3VydmUnKTtcbn07XG5cblBvaW50LnByb3RvdHlwZS5lcSA9IGZ1bmN0aW9uIGVxKG90aGVyKSB7XG4gIHJldHVybiB0aGlzLmdldFgoKS5jbXAob3RoZXIuZ2V0WCgpKSA9PT0gMDtcbn07XG5cblBvaW50LnByb3RvdHlwZS5ub3JtYWxpemUgPSBmdW5jdGlvbiBub3JtYWxpemUoKSB7XG4gIHRoaXMueCA9IHRoaXMueC5yZWRNdWwodGhpcy56LnJlZEludm0oKSk7XG4gIHRoaXMueiA9IHRoaXMuY3VydmUub25lO1xuICByZXR1cm4gdGhpcztcbn07XG5cblBvaW50LnByb3RvdHlwZS5nZXRYID0gZnVuY3Rpb24gZ2V0WCgpIHtcbiAgLy8gTm9ybWFsaXplIGNvb3JkaW5hdGVzXG4gIHRoaXMubm9ybWFsaXplKCk7XG5cbiAgcmV0dXJuIHRoaXMueC5mcm9tUmVkKCk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaGFzaCA9IHJlcXVpcmUoJ2hhc2guanMnKTtcbnZhciBlbGxpcHRpYyA9IHJlcXVpcmUoJy4uLy4uL2VsbGlwdGljJyk7XG52YXIgdXRpbHMgPSBlbGxpcHRpYy51dGlscztcbnZhciBhc3NlcnQgPSB1dGlscy5hc3NlcnQ7XG52YXIgcGFyc2VCeXRlcyA9IHV0aWxzLnBhcnNlQnl0ZXM7XG52YXIgS2V5UGFpciA9IHJlcXVpcmUoJy4va2V5Jyk7XG52YXIgU2lnbmF0dXJlID0gcmVxdWlyZSgnLi9zaWduYXR1cmUnKTtcblxuZnVuY3Rpb24gRUREU0EoY3VydmUpIHtcbiAgYXNzZXJ0KGN1cnZlID09PSAnZWQyNTUxOScsICdvbmx5IHRlc3RlZCB3aXRoIGVkMjU1MTkgc28gZmFyJyk7XG5cbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIEVERFNBKSlcbiAgICByZXR1cm4gbmV3IEVERFNBKGN1cnZlKTtcblxuICB2YXIgY3VydmUgPSBlbGxpcHRpYy5jdXJ2ZXNbY3VydmVdLmN1cnZlO1xuICB0aGlzLmN1cnZlID0gY3VydmU7XG4gIHRoaXMuZyA9IGN1cnZlLmc7XG4gIHRoaXMuZy5wcmVjb21wdXRlKGN1cnZlLm4uYml0TGVuZ3RoKCkgKyAxKTtcblxuICB0aGlzLnBvaW50Q2xhc3MgPSBjdXJ2ZS5wb2ludCgpLmNvbnN0cnVjdG9yO1xuICB0aGlzLmVuY29kaW5nTGVuZ3RoID0gTWF0aC5jZWlsKGN1cnZlLm4uYml0TGVuZ3RoKCkgLyA4KTtcbiAgdGhpcy5oYXNoID0gaGFzaC5zaGE1MTI7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gRUREU0E7XG5cbi8qKlxuKiBAcGFyYW0ge0FycmF5fFN0cmluZ30gbWVzc2FnZSAtIG1lc3NhZ2UgYnl0ZXNcbiogQHBhcmFtIHtBcnJheXxTdHJpbmd8S2V5UGFpcn0gc2VjcmV0IC0gc2VjcmV0IGJ5dGVzIG9yIGEga2V5cGFpclxuKiBAcmV0dXJucyB7U2lnbmF0dXJlfSAtIHNpZ25hdHVyZVxuKi9cbkVERFNBLnByb3RvdHlwZS5zaWduID0gZnVuY3Rpb24gc2lnbihtZXNzYWdlLCBzZWNyZXQpIHtcbiAgbWVzc2FnZSA9IHBhcnNlQnl0ZXMobWVzc2FnZSk7XG4gIHZhciBrZXkgPSB0aGlzLmtleUZyb21TZWNyZXQoc2VjcmV0KTtcbiAgdmFyIHIgPSB0aGlzLmhhc2hJbnQoa2V5Lm1lc3NhZ2VQcmVmaXgoKSwgbWVzc2FnZSk7XG4gIHZhciBSID0gdGhpcy5nLm11bChyKTtcbiAgdmFyIFJlbmNvZGVkID0gdGhpcy5lbmNvZGVQb2ludChSKTtcbiAgdmFyIHNfID0gdGhpcy5oYXNoSW50KFJlbmNvZGVkLCBrZXkucHViQnl0ZXMoKSwgbWVzc2FnZSlcbiAgICAgICAgICAgICAgIC5tdWwoa2V5LnByaXYoKSk7XG4gIHZhciBTID0gci5hZGQoc18pLnVtb2QodGhpcy5jdXJ2ZS5uKTtcbiAgcmV0dXJuIHRoaXMubWFrZVNpZ25hdHVyZSh7IFI6IFIsIFM6IFMsIFJlbmNvZGVkOiBSZW5jb2RlZCB9KTtcbn07XG5cbi8qKlxuKiBAcGFyYW0ge0FycmF5fSBtZXNzYWdlIC0gbWVzc2FnZSBieXRlc1xuKiBAcGFyYW0ge0FycmF5fFN0cmluZ3xTaWduYXR1cmV9IHNpZyAtIHNpZyBieXRlc1xuKiBAcGFyYW0ge0FycmF5fFN0cmluZ3xQb2ludHxLZXlQYWlyfSBwdWIgLSBwdWJsaWMga2V5XG4qIEByZXR1cm5zIHtCb29sZWFufSAtIHRydWUgaWYgcHVibGljIGtleSBtYXRjaGVzIHNpZyBvZiBtZXNzYWdlXG4qL1xuRUREU0EucHJvdG90eXBlLnZlcmlmeSA9IGZ1bmN0aW9uIHZlcmlmeShtZXNzYWdlLCBzaWcsIHB1Yikge1xuICBtZXNzYWdlID0gcGFyc2VCeXRlcyhtZXNzYWdlKTtcbiAgc2lnID0gdGhpcy5tYWtlU2lnbmF0dXJlKHNpZyk7XG4gIHZhciBrZXkgPSB0aGlzLmtleUZyb21QdWJsaWMocHViKTtcbiAgdmFyIGggPSB0aGlzLmhhc2hJbnQoc2lnLlJlbmNvZGVkKCksIGtleS5wdWJCeXRlcygpLCBtZXNzYWdlKTtcbiAgdmFyIFNHID0gdGhpcy5nLm11bChzaWcuUygpKTtcbiAgdmFyIFJwbHVzQWggPSBzaWcuUigpLmFkZChrZXkucHViKCkubXVsKGgpKTtcbiAgcmV0dXJuIFJwbHVzQWguZXEoU0cpO1xufTtcblxuRUREU0EucHJvdG90eXBlLmhhc2hJbnQgPSBmdW5jdGlvbiBoYXNoSW50KCkge1xuICB2YXIgaGFzaCA9IHRoaXMuaGFzaCgpO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKylcbiAgICBoYXNoLnVwZGF0ZShhcmd1bWVudHNbaV0pO1xuICByZXR1cm4gdXRpbHMuaW50RnJvbUxFKGhhc2guZGlnZXN0KCkpLnVtb2QodGhpcy5jdXJ2ZS5uKTtcbn07XG5cbkVERFNBLnByb3RvdHlwZS5rZXlGcm9tUHVibGljID0gZnVuY3Rpb24ga2V5RnJvbVB1YmxpYyhwdWIpIHtcbiAgcmV0dXJuIEtleVBhaXIuZnJvbVB1YmxpYyh0aGlzLCBwdWIpO1xufTtcblxuRUREU0EucHJvdG90eXBlLmtleUZyb21TZWNyZXQgPSBmdW5jdGlvbiBrZXlGcm9tU2VjcmV0KHNlY3JldCkge1xuICByZXR1cm4gS2V5UGFpci5mcm9tU2VjcmV0KHRoaXMsIHNlY3JldCk7XG59O1xuXG5FRERTQS5wcm90b3R5cGUubWFrZVNpZ25hdHVyZSA9IGZ1bmN0aW9uIG1ha2VTaWduYXR1cmUoc2lnKSB7XG4gIGlmIChzaWcgaW5zdGFuY2VvZiBTaWduYXR1cmUpXG4gICAgcmV0dXJuIHNpZztcbiAgcmV0dXJuIG5ldyBTaWduYXR1cmUodGhpcywgc2lnKTtcbn07XG5cbi8qKlxuKiAqIGh0dHBzOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9kcmFmdC1qb3NlZnNzb24tZWRkc2EtZWQyNTUxOS0wMyNzZWN0aW9uLTUuMlxuKlxuKiBFRERTQSBkZWZpbmVzIG1ldGhvZHMgZm9yIGVuY29kaW5nIGFuZCBkZWNvZGluZyBwb2ludHMgYW5kIGludGVnZXJzLiBUaGVzZSBhcmVcbiogaGVscGVyIGNvbnZlbmllbmNlIG1ldGhvZHMsIHRoYXQgcGFzcyBhbG9uZyB0byB1dGlsaXR5IGZ1bmN0aW9ucyBpbXBsaWVkXG4qIHBhcmFtZXRlcnMuXG4qXG4qL1xuRUREU0EucHJvdG90eXBlLmVuY29kZVBvaW50ID0gZnVuY3Rpb24gZW5jb2RlUG9pbnQocG9pbnQpIHtcbiAgdmFyIGVuYyA9IHBvaW50LmdldFkoKS50b0FycmF5KCdsZScsIHRoaXMuZW5jb2RpbmdMZW5ndGgpO1xuICBlbmNbdGhpcy5lbmNvZGluZ0xlbmd0aCAtIDFdIHw9IHBvaW50LmdldFgoKS5pc09kZCgpID8gMHg4MCA6IDA7XG4gIHJldHVybiBlbmM7XG59O1xuXG5FRERTQS5wcm90b3R5cGUuZGVjb2RlUG9pbnQgPSBmdW5jdGlvbiBkZWNvZGVQb2ludChieXRlcykge1xuICBieXRlcyA9IHV0aWxzLnBhcnNlQnl0ZXMoYnl0ZXMpO1xuXG4gIHZhciBsYXN0SXggPSBieXRlcy5sZW5ndGggLSAxO1xuICB2YXIgbm9ybWVkID0gYnl0ZXMuc2xpY2UoMCwgbGFzdEl4KS5jb25jYXQoYnl0ZXNbbGFzdEl4XSAmIH4weDgwKTtcbiAgdmFyIHhJc09kZCA9IChieXRlc1tsYXN0SXhdICYgMHg4MCkgIT09IDA7XG5cbiAgdmFyIHkgPSB1dGlscy5pbnRGcm9tTEUobm9ybWVkKTtcbiAgcmV0dXJuIHRoaXMuY3VydmUucG9pbnRGcm9tWSh5LCB4SXNPZGQpO1xufTtcblxuRUREU0EucHJvdG90eXBlLmVuY29kZUludCA9IGZ1bmN0aW9uIGVuY29kZUludChudW0pIHtcbiAgcmV0dXJuIG51bS50b0FycmF5KCdsZScsIHRoaXMuZW5jb2RpbmdMZW5ndGgpO1xufTtcblxuRUREU0EucHJvdG90eXBlLmRlY29kZUludCA9IGZ1bmN0aW9uIGRlY29kZUludChieXRlcykge1xuICByZXR1cm4gdXRpbHMuaW50RnJvbUxFKGJ5dGVzKTtcbn07XG5cbkVERFNBLnByb3RvdHlwZS5pc1BvaW50ID0gZnVuY3Rpb24gaXNQb2ludCh2YWwpIHtcbiAgcmV0dXJuIHZhbCBpbnN0YW5jZW9mIHRoaXMucG9pbnRDbGFzcztcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBCTiA9IHJlcXVpcmUoJ2JuLmpzJyk7XG5cbnZhciBlbGxpcHRpYyA9IHJlcXVpcmUoJy4uLy4uL2VsbGlwdGljJyk7XG52YXIgdXRpbHMgPSBlbGxpcHRpYy51dGlscztcbnZhciBhc3NlcnQgPSB1dGlscy5hc3NlcnQ7XG5cbmZ1bmN0aW9uIFNpZ25hdHVyZShvcHRpb25zLCBlbmMpIHtcbiAgaWYgKG9wdGlvbnMgaW5zdGFuY2VvZiBTaWduYXR1cmUpXG4gICAgcmV0dXJuIG9wdGlvbnM7XG5cbiAgaWYgKHRoaXMuX2ltcG9ydERFUihvcHRpb25zLCBlbmMpKVxuICAgIHJldHVybjtcblxuICBhc3NlcnQob3B0aW9ucy5yICYmIG9wdGlvbnMucywgJ1NpZ25hdHVyZSB3aXRob3V0IHIgb3IgcycpO1xuICB0aGlzLnIgPSBuZXcgQk4ob3B0aW9ucy5yLCAxNik7XG4gIHRoaXMucyA9IG5ldyBCTihvcHRpb25zLnMsIDE2KTtcbiAgaWYgKG9wdGlvbnMucmVjb3ZlcnlQYXJhbSA9PT0gdW5kZWZpbmVkKVxuICAgIHRoaXMucmVjb3ZlcnlQYXJhbSA9IG51bGw7XG4gIGVsc2VcbiAgICB0aGlzLnJlY292ZXJ5UGFyYW0gPSBvcHRpb25zLnJlY292ZXJ5UGFyYW07XG59XG5tb2R1bGUuZXhwb3J0cyA9IFNpZ25hdHVyZTtcblxuZnVuY3Rpb24gUG9zaXRpb24oKSB7XG4gIHRoaXMucGxhY2UgPSAwO1xufVxuXG5mdW5jdGlvbiBnZXRMZW5ndGgoYnVmLCBwKSB7XG4gIHZhciBpbml0aWFsID0gYnVmW3AucGxhY2UrK107XG4gIGlmICghKGluaXRpYWwgJiAweDgwKSkge1xuICAgIHJldHVybiBpbml0aWFsO1xuICB9XG4gIHZhciBvY3RldExlbiA9IGluaXRpYWwgJiAweGY7XG4gIHZhciB2YWwgPSAwO1xuICBmb3IgKHZhciBpID0gMCwgb2ZmID0gcC5wbGFjZTsgaSA8IG9jdGV0TGVuOyBpKyssIG9mZisrKSB7XG4gICAgdmFsIDw8PSA4O1xuICAgIHZhbCB8PSBidWZbb2ZmXTtcbiAgfVxuICBwLnBsYWNlID0gb2ZmO1xuICByZXR1cm4gdmFsO1xufVxuXG5mdW5jdGlvbiBybVBhZGRpbmcoYnVmKSB7XG4gIHZhciBpID0gMDtcbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGggLSAxO1xuICB3aGlsZSAoIWJ1ZltpXSAmJiAhKGJ1ZltpICsgMV0gJiAweDgwKSAmJiBpIDwgbGVuKSB7XG4gICAgaSsrO1xuICB9XG4gIGlmIChpID09PSAwKSB7XG4gICAgcmV0dXJuIGJ1ZjtcbiAgfVxuICByZXR1cm4gYnVmLnNsaWNlKGkpO1xufVxuXG5TaWduYXR1cmUucHJvdG90eXBlLl9pbXBvcnRERVIgPSBmdW5jdGlvbiBfaW1wb3J0REVSKGRhdGEsIGVuYykge1xuICBkYXRhID0gdXRpbHMudG9BcnJheShkYXRhLCBlbmMpO1xuICB2YXIgcCA9IG5ldyBQb3NpdGlvbigpO1xuICBpZiAoZGF0YVtwLnBsYWNlKytdICE9PSAweDMwKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHZhciBsZW4gPSBnZXRMZW5ndGgoZGF0YSwgcCk7XG4gIGlmICgobGVuICsgcC5wbGFjZSkgIT09IGRhdGEubGVuZ3RoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGlmIChkYXRhW3AucGxhY2UrK10gIT09IDB4MDIpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdmFyIHJsZW4gPSBnZXRMZW5ndGgoZGF0YSwgcCk7XG4gIHZhciByID0gZGF0YS5zbGljZShwLnBsYWNlLCBybGVuICsgcC5wbGFjZSk7XG4gIHAucGxhY2UgKz0gcmxlbjtcbiAgaWYgKGRhdGFbcC5wbGFjZSsrXSAhPT0gMHgwMikge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICB2YXIgc2xlbiA9IGdldExlbmd0aChkYXRhLCBwKTtcbiAgaWYgKGRhdGEubGVuZ3RoICE9PSBzbGVuICsgcC5wbGFjZSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICB2YXIgcyA9IGRhdGEuc2xpY2UocC5wbGFjZSwgc2xlbiArIHAucGxhY2UpO1xuICBpZiAoclswXSA9PT0gMCAmJiAoclsxXSAmIDB4ODApKSB7XG4gICAgciA9IHIuc2xpY2UoMSk7XG4gIH1cbiAgaWYgKHNbMF0gPT09IDAgJiYgKHNbMV0gJiAweDgwKSkge1xuICAgIHMgPSBzLnNsaWNlKDEpO1xuICB9XG5cbiAgdGhpcy5yID0gbmV3IEJOKHIpO1xuICB0aGlzLnMgPSBuZXcgQk4ocyk7XG4gIHRoaXMucmVjb3ZlcnlQYXJhbSA9IG51bGw7XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuXG5mdW5jdGlvbiBjb25zdHJ1Y3RMZW5ndGgoYXJyLCBsZW4pIHtcbiAgaWYgKGxlbiA8IDB4ODApIHtcbiAgICBhcnIucHVzaChsZW4pO1xuICAgIHJldHVybjtcbiAgfVxuICB2YXIgb2N0ZXRzID0gMSArIChNYXRoLmxvZyhsZW4pIC8gTWF0aC5MTjIgPj4+IDMpO1xuICBhcnIucHVzaChvY3RldHMgfCAweDgwKTtcbiAgd2hpbGUgKC0tb2N0ZXRzKSB7XG4gICAgYXJyLnB1c2goKGxlbiA+Pj4gKG9jdGV0cyA8PCAzKSkgJiAweGZmKTtcbiAgfVxuICBhcnIucHVzaChsZW4pO1xufVxuXG5TaWduYXR1cmUucHJvdG90eXBlLnRvREVSID0gZnVuY3Rpb24gdG9ERVIoZW5jKSB7XG4gIHZhciByID0gdGhpcy5yLnRvQXJyYXkoKTtcbiAgdmFyIHMgPSB0aGlzLnMudG9BcnJheSgpO1xuXG4gIC8vIFBhZCB2YWx1ZXNcbiAgaWYgKHJbMF0gJiAweDgwKVxuICAgIHIgPSBbIDAgXS5jb25jYXQocik7XG4gIC8vIFBhZCB2YWx1ZXNcbiAgaWYgKHNbMF0gJiAweDgwKVxuICAgIHMgPSBbIDAgXS5jb25jYXQocyk7XG5cbiAgciA9IHJtUGFkZGluZyhyKTtcbiAgcyA9IHJtUGFkZGluZyhzKTtcblxuICB3aGlsZSAoIXNbMF0gJiYgIShzWzFdICYgMHg4MCkpIHtcbiAgICBzID0gcy5zbGljZSgxKTtcbiAgfVxuICB2YXIgYXJyID0gWyAweDAyIF07XG4gIGNvbnN0cnVjdExlbmd0aChhcnIsIHIubGVuZ3RoKTtcbiAgYXJyID0gYXJyLmNvbmNhdChyKTtcbiAgYXJyLnB1c2goMHgwMik7XG4gIGNvbnN0cnVjdExlbmd0aChhcnIsIHMubGVuZ3RoKTtcbiAgdmFyIGJhY2tIYWxmID0gYXJyLmNvbmNhdChzKTtcbiAgdmFyIHJlcyA9IFsgMHgzMCBdO1xuICBjb25zdHJ1Y3RMZW5ndGgocmVzLCBiYWNrSGFsZi5sZW5ndGgpO1xuICByZXMgPSByZXMuY29uY2F0KGJhY2tIYWxmKTtcbiAgcmV0dXJuIHV0aWxzLmVuY29kZShyZXMsIGVuYyk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgQk4gPSByZXF1aXJlKCdibi5qcycpO1xudmFyIEhtYWNEUkJHID0gcmVxdWlyZSgnaG1hYy1kcmJnJyk7XG52YXIgZWxsaXB0aWMgPSByZXF1aXJlKCcuLi8uLi9lbGxpcHRpYycpO1xudmFyIHV0aWxzID0gZWxsaXB0aWMudXRpbHM7XG52YXIgYXNzZXJ0ID0gdXRpbHMuYXNzZXJ0O1xuXG52YXIgS2V5UGFpciA9IHJlcXVpcmUoJy4va2V5Jyk7XG52YXIgU2lnbmF0dXJlID0gcmVxdWlyZSgnLi9zaWduYXR1cmUnKTtcblxuZnVuY3Rpb24gRUMob3B0aW9ucykge1xuICBpZiAoISh0aGlzIGluc3RhbmNlb2YgRUMpKVxuICAgIHJldHVybiBuZXcgRUMob3B0aW9ucyk7XG5cbiAgLy8gU2hvcnRjdXQgYGVsbGlwdGljLmVjKGN1cnZlLW5hbWUpYFxuICBpZiAodHlwZW9mIG9wdGlvbnMgPT09ICdzdHJpbmcnKSB7XG4gICAgYXNzZXJ0KGVsbGlwdGljLmN1cnZlcy5oYXNPd25Qcm9wZXJ0eShvcHRpb25zKSwgJ1Vua25vd24gY3VydmUgJyArIG9wdGlvbnMpO1xuXG4gICAgb3B0aW9ucyA9IGVsbGlwdGljLmN1cnZlc1tvcHRpb25zXTtcbiAgfVxuXG4gIC8vIFNob3J0Y3V0IGZvciBgZWxsaXB0aWMuZWMoZWxsaXB0aWMuY3VydmVzLmN1cnZlTmFtZSlgXG4gIGlmIChvcHRpb25zIGluc3RhbmNlb2YgZWxsaXB0aWMuY3VydmVzLlByZXNldEN1cnZlKVxuICAgIG9wdGlvbnMgPSB7IGN1cnZlOiBvcHRpb25zIH07XG5cbiAgdGhpcy5jdXJ2ZSA9IG9wdGlvbnMuY3VydmUuY3VydmU7XG4gIHRoaXMubiA9IHRoaXMuY3VydmUubjtcbiAgdGhpcy5uaCA9IHRoaXMubi51c2hybigxKTtcbiAgdGhpcy5nID0gdGhpcy5jdXJ2ZS5nO1xuXG4gIC8vIFBvaW50IG9uIGN1cnZlXG4gIHRoaXMuZyA9IG9wdGlvbnMuY3VydmUuZztcbiAgdGhpcy5nLnByZWNvbXB1dGUob3B0aW9ucy5jdXJ2ZS5uLmJpdExlbmd0aCgpICsgMSk7XG5cbiAgLy8gSGFzaCBmb3IgZnVuY3Rpb24gZm9yIERSQkdcbiAgdGhpcy5oYXNoID0gb3B0aW9ucy5oYXNoIHx8IG9wdGlvbnMuY3VydmUuaGFzaDtcbn1cbm1vZHVsZS5leHBvcnRzID0gRUM7XG5cbkVDLnByb3RvdHlwZS5rZXlQYWlyID0gZnVuY3Rpb24ga2V5UGFpcihvcHRpb25zKSB7XG4gIHJldHVybiBuZXcgS2V5UGFpcih0aGlzLCBvcHRpb25zKTtcbn07XG5cbkVDLnByb3RvdHlwZS5rZXlGcm9tUHJpdmF0ZSA9IGZ1bmN0aW9uIGtleUZyb21Qcml2YXRlKHByaXYsIGVuYykge1xuICByZXR1cm4gS2V5UGFpci5mcm9tUHJpdmF0ZSh0aGlzLCBwcml2LCBlbmMpO1xufTtcblxuRUMucHJvdG90eXBlLmtleUZyb21QdWJsaWMgPSBmdW5jdGlvbiBrZXlGcm9tUHVibGljKHB1YiwgZW5jKSB7XG4gIHJldHVybiBLZXlQYWlyLmZyb21QdWJsaWModGhpcywgcHViLCBlbmMpO1xufTtcblxuRUMucHJvdG90eXBlLmdlbktleVBhaXIgPSBmdW5jdGlvbiBnZW5LZXlQYWlyKG9wdGlvbnMpIHtcbiAgaWYgKCFvcHRpb25zKVxuICAgIG9wdGlvbnMgPSB7fTtcblxuICAvLyBJbnN0YW50aWF0ZSBIbWFjX0RSQkdcbiAgdmFyIGRyYmcgPSBuZXcgSG1hY0RSQkcoe1xuICAgIGhhc2g6IHRoaXMuaGFzaCxcbiAgICBwZXJzOiBvcHRpb25zLnBlcnMsXG4gICAgcGVyc0VuYzogb3B0aW9ucy5wZXJzRW5jIHx8ICd1dGY4JyxcbiAgICBlbnRyb3B5OiBvcHRpb25zLmVudHJvcHkgfHwgZWxsaXB0aWMucmFuZCh0aGlzLmhhc2guaG1hY1N0cmVuZ3RoKSxcbiAgICBlbnRyb3B5RW5jOiBvcHRpb25zLmVudHJvcHkgJiYgb3B0aW9ucy5lbnRyb3B5RW5jIHx8ICd1dGY4JyxcbiAgICBub25jZTogdGhpcy5uLnRvQXJyYXkoKVxuICB9KTtcblxuICB2YXIgYnl0ZXMgPSB0aGlzLm4uYnl0ZUxlbmd0aCgpO1xuICB2YXIgbnMyID0gdGhpcy5uLnN1YihuZXcgQk4oMikpO1xuICBkbyB7XG4gICAgdmFyIHByaXYgPSBuZXcgQk4oZHJiZy5nZW5lcmF0ZShieXRlcykpO1xuICAgIGlmIChwcml2LmNtcChuczIpID4gMClcbiAgICAgIGNvbnRpbnVlO1xuXG4gICAgcHJpdi5pYWRkbigxKTtcbiAgICByZXR1cm4gdGhpcy5rZXlGcm9tUHJpdmF0ZShwcml2KTtcbiAgfSB3aGlsZSAodHJ1ZSk7XG59O1xuXG5FQy5wcm90b3R5cGUuX3RydW5jYXRlVG9OID0gZnVuY3Rpb24gdHJ1bmNhdGVUb04obXNnLCB0cnVuY09ubHkpIHtcbiAgdmFyIGRlbHRhID0gbXNnLmJ5dGVMZW5ndGgoKSAqIDggLSB0aGlzLm4uYml0TGVuZ3RoKCk7XG4gIGlmIChkZWx0YSA+IDApXG4gICAgbXNnID0gbXNnLnVzaHJuKGRlbHRhKTtcbiAgaWYgKCF0cnVuY09ubHkgJiYgbXNnLmNtcCh0aGlzLm4pID49IDApXG4gICAgcmV0dXJuIG1zZy5zdWIodGhpcy5uKTtcbiAgZWxzZVxuICAgIHJldHVybiBtc2c7XG59O1xuXG5FQy5wcm90b3R5cGUuc2lnbiA9IGZ1bmN0aW9uIHNpZ24obXNnLCBrZXksIGVuYywgb3B0aW9ucykge1xuICBpZiAodHlwZW9mIGVuYyA9PT0gJ29iamVjdCcpIHtcbiAgICBvcHRpb25zID0gZW5jO1xuICAgIGVuYyA9IG51bGw7XG4gIH1cbiAgaWYgKCFvcHRpb25zKVxuICAgIG9wdGlvbnMgPSB7fTtcblxuICBrZXkgPSB0aGlzLmtleUZyb21Qcml2YXRlKGtleSwgZW5jKTtcbiAgbXNnID0gdGhpcy5fdHJ1bmNhdGVUb04obmV3IEJOKG1zZywgMTYpKTtcblxuICAvLyBaZXJvLWV4dGVuZCBrZXkgdG8gcHJvdmlkZSBlbm91Z2ggZW50cm9weVxuICB2YXIgYnl0ZXMgPSB0aGlzLm4uYnl0ZUxlbmd0aCgpO1xuICB2YXIgYmtleSA9IGtleS5nZXRQcml2YXRlKCkudG9BcnJheSgnYmUnLCBieXRlcyk7XG5cbiAgLy8gWmVyby1leHRlbmQgbm9uY2UgdG8gaGF2ZSB0aGUgc2FtZSBieXRlIHNpemUgYXMgTlxuICB2YXIgbm9uY2UgPSBtc2cudG9BcnJheSgnYmUnLCBieXRlcyk7XG5cbiAgLy8gSW5zdGFudGlhdGUgSG1hY19EUkJHXG4gIHZhciBkcmJnID0gbmV3IEhtYWNEUkJHKHtcbiAgICBoYXNoOiB0aGlzLmhhc2gsXG4gICAgZW50cm9weTogYmtleSxcbiAgICBub25jZTogbm9uY2UsXG4gICAgcGVyczogb3B0aW9ucy5wZXJzLFxuICAgIHBlcnNFbmM6IG9wdGlvbnMucGVyc0VuYyB8fCAndXRmOCdcbiAgfSk7XG5cbiAgLy8gTnVtYmVyIG9mIGJ5dGVzIHRvIGdlbmVyYXRlXG4gIHZhciBuczEgPSB0aGlzLm4uc3ViKG5ldyBCTigxKSk7XG5cbiAgZm9yICh2YXIgaXRlciA9IDA7IHRydWU7IGl0ZXIrKykge1xuICAgIHZhciBrID0gb3B0aW9ucy5rID9cbiAgICAgICAgb3B0aW9ucy5rKGl0ZXIpIDpcbiAgICAgICAgbmV3IEJOKGRyYmcuZ2VuZXJhdGUodGhpcy5uLmJ5dGVMZW5ndGgoKSkpO1xuICAgIGsgPSB0aGlzLl90cnVuY2F0ZVRvTihrLCB0cnVlKTtcbiAgICBpZiAoay5jbXBuKDEpIDw9IDAgfHwgay5jbXAobnMxKSA+PSAwKVxuICAgICAgY29udGludWU7XG5cbiAgICB2YXIga3AgPSB0aGlzLmcubXVsKGspO1xuICAgIGlmIChrcC5pc0luZmluaXR5KCkpXG4gICAgICBjb250aW51ZTtcblxuICAgIHZhciBrcFggPSBrcC5nZXRYKCk7XG4gICAgdmFyIHIgPSBrcFgudW1vZCh0aGlzLm4pO1xuICAgIGlmIChyLmNtcG4oMCkgPT09IDApXG4gICAgICBjb250aW51ZTtcblxuICAgIHZhciBzID0gay5pbnZtKHRoaXMubikubXVsKHIubXVsKGtleS5nZXRQcml2YXRlKCkpLmlhZGQobXNnKSk7XG4gICAgcyA9IHMudW1vZCh0aGlzLm4pO1xuICAgIGlmIChzLmNtcG4oMCkgPT09IDApXG4gICAgICBjb250aW51ZTtcblxuICAgIHZhciByZWNvdmVyeVBhcmFtID0gKGtwLmdldFkoKS5pc09kZCgpID8gMSA6IDApIHxcbiAgICAgICAgICAgICAgICAgICAgICAgIChrcFguY21wKHIpICE9PSAwID8gMiA6IDApO1xuXG4gICAgLy8gVXNlIGNvbXBsZW1lbnQgb2YgYHNgLCBpZiBpdCBpcyA+IGBuIC8gMmBcbiAgICBpZiAob3B0aW9ucy5jYW5vbmljYWwgJiYgcy5jbXAodGhpcy5uaCkgPiAwKSB7XG4gICAgICBzID0gdGhpcy5uLnN1YihzKTtcbiAgICAgIHJlY292ZXJ5UGFyYW0gXj0gMTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFNpZ25hdHVyZSh7IHI6IHIsIHM6IHMsIHJlY292ZXJ5UGFyYW06IHJlY292ZXJ5UGFyYW0gfSk7XG4gIH1cbn07XG5cbkVDLnByb3RvdHlwZS52ZXJpZnkgPSBmdW5jdGlvbiB2ZXJpZnkobXNnLCBzaWduYXR1cmUsIGtleSwgZW5jKSB7XG4gIG1zZyA9IHRoaXMuX3RydW5jYXRlVG9OKG5ldyBCTihtc2csIDE2KSk7XG4gIGtleSA9IHRoaXMua2V5RnJvbVB1YmxpYyhrZXksIGVuYyk7XG4gIHNpZ25hdHVyZSA9IG5ldyBTaWduYXR1cmUoc2lnbmF0dXJlLCAnaGV4Jyk7XG5cbiAgLy8gUGVyZm9ybSBwcmltaXRpdmUgdmFsdWVzIHZhbGlkYXRpb25cbiAgdmFyIHIgPSBzaWduYXR1cmUucjtcbiAgdmFyIHMgPSBzaWduYXR1cmUucztcbiAgaWYgKHIuY21wbigxKSA8IDAgfHwgci5jbXAodGhpcy5uKSA+PSAwKVxuICAgIHJldHVybiBmYWxzZTtcbiAgaWYgKHMuY21wbigxKSA8IDAgfHwgcy5jbXAodGhpcy5uKSA+PSAwKVxuICAgIHJldHVybiBmYWxzZTtcblxuICAvLyBWYWxpZGF0ZSBzaWduYXR1cmVcbiAgdmFyIHNpbnYgPSBzLmludm0odGhpcy5uKTtcbiAgdmFyIHUxID0gc2ludi5tdWwobXNnKS51bW9kKHRoaXMubik7XG4gIHZhciB1MiA9IHNpbnYubXVsKHIpLnVtb2QodGhpcy5uKTtcblxuICBpZiAoIXRoaXMuY3VydmUuX21heHdlbGxUcmljaykge1xuICAgIHZhciBwID0gdGhpcy5nLm11bEFkZCh1MSwga2V5LmdldFB1YmxpYygpLCB1Mik7XG4gICAgaWYgKHAuaXNJbmZpbml0eSgpKVxuICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgcmV0dXJuIHAuZ2V0WCgpLnVtb2QodGhpcy5uKS5jbXAocikgPT09IDA7XG4gIH1cblxuICAvLyBOT1RFOiBHcmVnIE1heHdlbGwncyB0cmljaywgaW5zcGlyZWQgYnk6XG4gIC8vIGh0dHBzOi8vZ2l0LmlvL3ZhZDNLXG5cbiAgdmFyIHAgPSB0aGlzLmcuam11bEFkZCh1MSwga2V5LmdldFB1YmxpYygpLCB1Mik7XG4gIGlmIChwLmlzSW5maW5pdHkoKSlcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgLy8gQ29tcGFyZSBgcC54YCBvZiBKYWNvYmlhbiBwb2ludCB3aXRoIGByYCxcbiAgLy8gdGhpcyB3aWxsIGRvIGBwLnggPT0gciAqIHAuel4yYCBpbnN0ZWFkIG9mIG11bHRpcGx5aW5nIGBwLnhgIGJ5IHRoZVxuICAvLyBpbnZlcnNlIG9mIGBwLnpeMmBcbiAgcmV0dXJuIHAuZXFYVG9QKHIpO1xufTtcblxuRUMucHJvdG90eXBlLnJlY292ZXJQdWJLZXkgPSBmdW5jdGlvbihtc2csIHNpZ25hdHVyZSwgaiwgZW5jKSB7XG4gIGFzc2VydCgoMyAmIGopID09PSBqLCAnVGhlIHJlY292ZXJ5IHBhcmFtIGlzIG1vcmUgdGhhbiB0d28gYml0cycpO1xuICBzaWduYXR1cmUgPSBuZXcgU2lnbmF0dXJlKHNpZ25hdHVyZSwgZW5jKTtcblxuICB2YXIgbiA9IHRoaXMubjtcbiAgdmFyIGUgPSBuZXcgQk4obXNnKTtcbiAgdmFyIHIgPSBzaWduYXR1cmUucjtcbiAgdmFyIHMgPSBzaWduYXR1cmUucztcblxuICAvLyBBIHNldCBMU0Igc2lnbmlmaWVzIHRoYXQgdGhlIHktY29vcmRpbmF0ZSBpcyBvZGRcbiAgdmFyIGlzWU9kZCA9IGogJiAxO1xuICB2YXIgaXNTZWNvbmRLZXkgPSBqID4+IDE7XG4gIGlmIChyLmNtcCh0aGlzLmN1cnZlLnAudW1vZCh0aGlzLmN1cnZlLm4pKSA+PSAwICYmIGlzU2Vjb25kS2V5KVxuICAgIHRocm93IG5ldyBFcnJvcignVW5hYmxlIHRvIGZpbmQgc2VuY29uZCBrZXkgY2FuZGluYXRlJyk7XG5cbiAgLy8gMS4xLiBMZXQgeCA9IHIgKyBqbi5cbiAgaWYgKGlzU2Vjb25kS2V5KVxuICAgIHIgPSB0aGlzLmN1cnZlLnBvaW50RnJvbVgoci5hZGQodGhpcy5jdXJ2ZS5uKSwgaXNZT2RkKTtcbiAgZWxzZVxuICAgIHIgPSB0aGlzLmN1cnZlLnBvaW50RnJvbVgociwgaXNZT2RkKTtcblxuICB2YXIgckludiA9IHNpZ25hdHVyZS5yLmludm0obik7XG4gIHZhciBzMSA9IG4uc3ViKGUpLm11bChySW52KS51bW9kKG4pO1xuICB2YXIgczIgPSBzLm11bChySW52KS51bW9kKG4pO1xuXG4gIC8vIDEuNi4xIENvbXB1dGUgUSA9IHJeLTEgKHNSIC0gIGVHKVxuICAvLyAgICAgICAgICAgICAgIFEgPSByXi0xIChzUiArIC1lRylcbiAgcmV0dXJuIHRoaXMuZy5tdWxBZGQoczEsIHIsIHMyKTtcbn07XG5cbkVDLnByb3RvdHlwZS5nZXRLZXlSZWNvdmVyeVBhcmFtID0gZnVuY3Rpb24oZSwgc2lnbmF0dXJlLCBRLCBlbmMpIHtcbiAgc2lnbmF0dXJlID0gbmV3IFNpZ25hdHVyZShzaWduYXR1cmUsIGVuYyk7XG4gIGlmIChzaWduYXR1cmUucmVjb3ZlcnlQYXJhbSAhPT0gbnVsbClcbiAgICByZXR1cm4gc2lnbmF0dXJlLnJlY292ZXJ5UGFyYW07XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCA0OyBpKyspIHtcbiAgICB2YXIgUXByaW1lO1xuICAgIHRyeSB7XG4gICAgICBRcHJpbWUgPSB0aGlzLnJlY292ZXJQdWJLZXkoZSwgc2lnbmF0dXJlLCBpKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBpZiAoUXByaW1lLmVxKFEpKVxuICAgICAgcmV0dXJuIGk7XG4gIH1cbiAgdGhyb3cgbmV3IEVycm9yKCdVbmFibGUgdG8gZmluZCB2YWxpZCByZWNvdmVyeSBmYWN0b3InKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBCTiA9IHJlcXVpcmUoJ2JuLmpzJyk7XG52YXIgZWxsaXB0aWMgPSByZXF1aXJlKCcuLi8uLi9lbGxpcHRpYycpO1xudmFyIHV0aWxzID0gZWxsaXB0aWMudXRpbHM7XG52YXIgYXNzZXJ0ID0gdXRpbHMuYXNzZXJ0O1xuXG5mdW5jdGlvbiBLZXlQYWlyKGVjLCBvcHRpb25zKSB7XG4gIHRoaXMuZWMgPSBlYztcbiAgdGhpcy5wcml2ID0gbnVsbDtcbiAgdGhpcy5wdWIgPSBudWxsO1xuXG4gIC8vIEtleVBhaXIoZWMsIHsgcHJpdjogLi4uLCBwdWI6IC4uLiB9KVxuICBpZiAob3B0aW9ucy5wcml2KVxuICAgIHRoaXMuX2ltcG9ydFByaXZhdGUob3B0aW9ucy5wcml2LCBvcHRpb25zLnByaXZFbmMpO1xuICBpZiAob3B0aW9ucy5wdWIpXG4gICAgdGhpcy5faW1wb3J0UHVibGljKG9wdGlvbnMucHViLCBvcHRpb25zLnB1YkVuYyk7XG59XG5tb2R1bGUuZXhwb3J0cyA9IEtleVBhaXI7XG5cbktleVBhaXIuZnJvbVB1YmxpYyA9IGZ1bmN0aW9uIGZyb21QdWJsaWMoZWMsIHB1YiwgZW5jKSB7XG4gIGlmIChwdWIgaW5zdGFuY2VvZiBLZXlQYWlyKVxuICAgIHJldHVybiBwdWI7XG5cbiAgcmV0dXJuIG5ldyBLZXlQYWlyKGVjLCB7XG4gICAgcHViOiBwdWIsXG4gICAgcHViRW5jOiBlbmNcbiAgfSk7XG59O1xuXG5LZXlQYWlyLmZyb21Qcml2YXRlID0gZnVuY3Rpb24gZnJvbVByaXZhdGUoZWMsIHByaXYsIGVuYykge1xuICBpZiAocHJpdiBpbnN0YW5jZW9mIEtleVBhaXIpXG4gICAgcmV0dXJuIHByaXY7XG5cbiAgcmV0dXJuIG5ldyBLZXlQYWlyKGVjLCB7XG4gICAgcHJpdjogcHJpdixcbiAgICBwcml2RW5jOiBlbmNcbiAgfSk7XG59O1xuXG5LZXlQYWlyLnByb3RvdHlwZS52YWxpZGF0ZSA9IGZ1bmN0aW9uIHZhbGlkYXRlKCkge1xuICB2YXIgcHViID0gdGhpcy5nZXRQdWJsaWMoKTtcblxuICBpZiAocHViLmlzSW5maW5pdHkoKSlcbiAgICByZXR1cm4geyByZXN1bHQ6IGZhbHNlLCByZWFzb246ICdJbnZhbGlkIHB1YmxpYyBrZXknIH07XG4gIGlmICghcHViLnZhbGlkYXRlKCkpXG4gICAgcmV0dXJuIHsgcmVzdWx0OiBmYWxzZSwgcmVhc29uOiAnUHVibGljIGtleSBpcyBub3QgYSBwb2ludCcgfTtcbiAgaWYgKCFwdWIubXVsKHRoaXMuZWMuY3VydmUubikuaXNJbmZpbml0eSgpKVxuICAgIHJldHVybiB7IHJlc3VsdDogZmFsc2UsIHJlYXNvbjogJ1B1YmxpYyBrZXkgKiBOICE9IE8nIH07XG5cbiAgcmV0dXJuIHsgcmVzdWx0OiB0cnVlLCByZWFzb246IG51bGwgfTtcbn07XG5cbktleVBhaXIucHJvdG90eXBlLmdldFB1YmxpYyA9IGZ1bmN0aW9uIGdldFB1YmxpYyhjb21wYWN0LCBlbmMpIHtcbiAgLy8gY29tcGFjdCBpcyBvcHRpb25hbCBhcmd1bWVudFxuICBpZiAodHlwZW9mIGNvbXBhY3QgPT09ICdzdHJpbmcnKSB7XG4gICAgZW5jID0gY29tcGFjdDtcbiAgICBjb21wYWN0ID0gbnVsbDtcbiAgfVxuXG4gIGlmICghdGhpcy5wdWIpXG4gICAgdGhpcy5wdWIgPSB0aGlzLmVjLmcubXVsKHRoaXMucHJpdik7XG5cbiAgaWYgKCFlbmMpXG4gICAgcmV0dXJuIHRoaXMucHViO1xuXG4gIHJldHVybiB0aGlzLnB1Yi5lbmNvZGUoZW5jLCBjb21wYWN0KTtcbn07XG5cbktleVBhaXIucHJvdG90eXBlLmdldFByaXZhdGUgPSBmdW5jdGlvbiBnZXRQcml2YXRlKGVuYykge1xuICBpZiAoZW5jID09PSAnaGV4JylcbiAgICByZXR1cm4gdGhpcy5wcml2LnRvU3RyaW5nKDE2LCAyKTtcbiAgZWxzZVxuICAgIHJldHVybiB0aGlzLnByaXY7XG59O1xuXG5LZXlQYWlyLnByb3RvdHlwZS5faW1wb3J0UHJpdmF0ZSA9IGZ1bmN0aW9uIF9pbXBvcnRQcml2YXRlKGtleSwgZW5jKSB7XG4gIHRoaXMucHJpdiA9IG5ldyBCTihrZXksIGVuYyB8fCAxNik7XG5cbiAgLy8gRW5zdXJlIHRoYXQgdGhlIHByaXYgd29uJ3QgYmUgYmlnZ2VyIHRoYW4gbiwgb3RoZXJ3aXNlIHdlIG1heSBmYWlsXG4gIC8vIGluIGZpeGVkIG11bHRpcGxpY2F0aW9uIG1ldGhvZFxuICB0aGlzLnByaXYgPSB0aGlzLnByaXYudW1vZCh0aGlzLmVjLmN1cnZlLm4pO1xufTtcblxuS2V5UGFpci5wcm90b3R5cGUuX2ltcG9ydFB1YmxpYyA9IGZ1bmN0aW9uIF9pbXBvcnRQdWJsaWMoa2V5LCBlbmMpIHtcbiAgaWYgKGtleS54IHx8IGtleS55KSB7XG4gICAgLy8gTW9udGdvbWVyeSBwb2ludHMgb25seSBoYXZlIGFuIGB4YCBjb29yZGluYXRlLlxuICAgIC8vIFdlaWVyc3RyYXNzL0Vkd2FyZHMgcG9pbnRzIG9uIHRoZSBvdGhlciBoYW5kIGhhdmUgYm90aCBgeGAgYW5kXG4gICAgLy8gYHlgIGNvb3JkaW5hdGVzLlxuICAgIGlmICh0aGlzLmVjLmN1cnZlLnR5cGUgPT09ICdtb250Jykge1xuICAgICAgYXNzZXJ0KGtleS54LCAnTmVlZCB4IGNvb3JkaW5hdGUnKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuZWMuY3VydmUudHlwZSA9PT0gJ3Nob3J0JyB8fFxuICAgICAgICAgICAgICAgdGhpcy5lYy5jdXJ2ZS50eXBlID09PSAnZWR3YXJkcycpIHtcbiAgICAgIGFzc2VydChrZXkueCAmJiBrZXkueSwgJ05lZWQgYm90aCB4IGFuZCB5IGNvb3JkaW5hdGUnKTtcbiAgICB9XG4gICAgdGhpcy5wdWIgPSB0aGlzLmVjLmN1cnZlLnBvaW50KGtleS54LCBrZXkueSk7XG4gICAgcmV0dXJuO1xuICB9XG4gIHRoaXMucHViID0gdGhpcy5lYy5jdXJ2ZS5kZWNvZGVQb2ludChrZXksIGVuYyk7XG59O1xuXG4vLyBFQ0RIXG5LZXlQYWlyLnByb3RvdHlwZS5kZXJpdmUgPSBmdW5jdGlvbiBkZXJpdmUocHViKSB7XG4gIHJldHVybiBwdWIubXVsKHRoaXMucHJpdikuZ2V0WCgpO1xufTtcblxuLy8gRUNEU0FcbktleVBhaXIucHJvdG90eXBlLnNpZ24gPSBmdW5jdGlvbiBzaWduKG1zZywgZW5jLCBvcHRpb25zKSB7XG4gIHJldHVybiB0aGlzLmVjLnNpZ24obXNnLCB0aGlzLCBlbmMsIG9wdGlvbnMpO1xufTtcblxuS2V5UGFpci5wcm90b3R5cGUudmVyaWZ5ID0gZnVuY3Rpb24gdmVyaWZ5KG1zZywgc2lnbmF0dXJlKSB7XG4gIHJldHVybiB0aGlzLmVjLnZlcmlmeShtc2csIHNpZ25hdHVyZSwgdGhpcyk7XG59O1xuXG5LZXlQYWlyLnByb3RvdHlwZS5pbnNwZWN0ID0gZnVuY3Rpb24gaW5zcGVjdCgpIHtcbiAgcmV0dXJuICc8S2V5IHByaXY6ICcgKyAodGhpcy5wcml2ICYmIHRoaXMucHJpdi50b1N0cmluZygxNiwgMikpICtcbiAgICAgICAgICcgcHViOiAnICsgKHRoaXMucHViICYmIHRoaXMucHViLmluc3BlY3QoKSkgKyAnID4nO1xufTtcbiJdLCJzb3VyY2VSb290IjoiIn0=