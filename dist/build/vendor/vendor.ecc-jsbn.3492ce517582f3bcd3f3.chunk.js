(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["vendor/vendor.ecc-jsbn"],{

/***/ "ASEr":
/*!******************************************!*\
  !*** ./node_modules/ecc-jsbn/lib/sec.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// Named EC curves

// Requires ec.js, jsbn.js, and jsbn2.js
var BigInteger = __webpack_require__(/*! jsbn */ "8z4W").BigInteger
var ECCurveFp = __webpack_require__(/*! ./ec.js */ "mJl1").ECCurveFp


// ----------------
// X9ECParameters

// constructor
function X9ECParameters(curve,g,n,h) {
    this.curve = curve;
    this.g = g;
    this.n = n;
    this.h = h;
}

function x9getCurve() {
    return this.curve;
}

function x9getG() {
    return this.g;
}

function x9getN() {
    return this.n;
}

function x9getH() {
    return this.h;
}

X9ECParameters.prototype.getCurve = x9getCurve;
X9ECParameters.prototype.getG = x9getG;
X9ECParameters.prototype.getN = x9getN;
X9ECParameters.prototype.getH = x9getH;

// ----------------
// SECNamedCurves

function fromHex(s) { return new BigInteger(s, 16); }

function secp128r1() {
    // p = 2^128 - 2^97 - 1
    var p = fromHex("FFFFFFFDFFFFFFFFFFFFFFFFFFFFFFFF");
    var a = fromHex("FFFFFFFDFFFFFFFFFFFFFFFFFFFFFFFC");
    var b = fromHex("E87579C11079F43DD824993C2CEE5ED3");
    //byte[] S = Hex.decode("000E0D4D696E6768756151750CC03A4473D03679");
    var n = fromHex("FFFFFFFE0000000075A30D1B9038A115");
    var h = BigInteger.ONE;
    var curve = new ECCurveFp(p, a, b);
    var G = curve.decodePointHex("04"
                + "161FF7528B899B2D0C28607CA52C5B86"
		+ "CF5AC8395BAFEB13C02DA292DDED7A83");
    return new X9ECParameters(curve, G, n, h);
}

function secp160k1() {
    // p = 2^160 - 2^32 - 2^14 - 2^12 - 2^9 - 2^8 - 2^7 - 2^3 - 2^2 - 1
    var p = fromHex("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFAC73");
    var a = BigInteger.ZERO;
    var b = fromHex("7");
    //byte[] S = null;
    var n = fromHex("0100000000000000000001B8FA16DFAB9ACA16B6B3");
    var h = BigInteger.ONE;
    var curve = new ECCurveFp(p, a, b);
    var G = curve.decodePointHex("04"
                + "3B4C382CE37AA192A4019E763036F4F5DD4D7EBB"
                + "938CF935318FDCED6BC28286531733C3F03C4FEE");
    return new X9ECParameters(curve, G, n, h);
}

function secp160r1() {
    // p = 2^160 - 2^31 - 1
    var p = fromHex("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF7FFFFFFF");
    var a = fromHex("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF7FFFFFFC");
    var b = fromHex("1C97BEFC54BD7A8B65ACF89F81D4D4ADC565FA45");
    //byte[] S = Hex.decode("1053CDE42C14D696E67687561517533BF3F83345");
    var n = fromHex("0100000000000000000001F4C8F927AED3CA752257");
    var h = BigInteger.ONE;
    var curve = new ECCurveFp(p, a, b);
    var G = curve.decodePointHex("04"
		+ "4A96B5688EF573284664698968C38BB913CBFC82"
		+ "23A628553168947D59DCC912042351377AC5FB32");
    return new X9ECParameters(curve, G, n, h);
}

function secp192k1() {
    // p = 2^192 - 2^32 - 2^12 - 2^8 - 2^7 - 2^6 - 2^3 - 1
    var p = fromHex("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFEE37");
    var a = BigInteger.ZERO;
    var b = fromHex("3");
    //byte[] S = null;
    var n = fromHex("FFFFFFFFFFFFFFFFFFFFFFFE26F2FC170F69466A74DEFD8D");
    var h = BigInteger.ONE;
    var curve = new ECCurveFp(p, a, b);
    var G = curve.decodePointHex("04"
                + "DB4FF10EC057E9AE26B07D0280B7F4341DA5D1B1EAE06C7D"
                + "9B2F2F6D9C5628A7844163D015BE86344082AA88D95E2F9D");
    return new X9ECParameters(curve, G, n, h);
}

function secp192r1() {
    // p = 2^192 - 2^64 - 1
    var p = fromHex("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFFFFFFFFFFFF");
    var a = fromHex("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFFFFFFFFFFFC");
    var b = fromHex("64210519E59C80E70FA7E9AB72243049FEB8DEECC146B9B1");
    //byte[] S = Hex.decode("3045AE6FC8422F64ED579528D38120EAE12196D5");
    var n = fromHex("FFFFFFFFFFFFFFFFFFFFFFFF99DEF836146BC9B1B4D22831");
    var h = BigInteger.ONE;
    var curve = new ECCurveFp(p, a, b);
    var G = curve.decodePointHex("04"
                + "188DA80EB03090F67CBF20EB43A18800F4FF0AFD82FF1012"
                + "07192B95FFC8DA78631011ED6B24CDD573F977A11E794811");
    return new X9ECParameters(curve, G, n, h);
}

function secp224r1() {
    // p = 2^224 - 2^96 + 1
    var p = fromHex("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF000000000000000000000001");
    var a = fromHex("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFFFFFFFFFFFFFFFFFFFE");
    var b = fromHex("B4050A850C04B3ABF54132565044B0B7D7BFD8BA270B39432355FFB4");
    //byte[] S = Hex.decode("BD71344799D5C7FCDC45B59FA3B9AB8F6A948BC5");
    var n = fromHex("FFFFFFFFFFFFFFFFFFFFFFFFFFFF16A2E0B8F03E13DD29455C5C2A3D");
    var h = BigInteger.ONE;
    var curve = new ECCurveFp(p, a, b);
    var G = curve.decodePointHex("04"
                + "B70E0CBD6BB4BF7F321390B94A03C1D356C21122343280D6115C1D21"
                + "BD376388B5F723FB4C22DFE6CD4375A05A07476444D5819985007E34");
    return new X9ECParameters(curve, G, n, h);
}

function secp256r1() {
    // p = 2^224 (2^32 - 1) + 2^192 + 2^96 - 1
    var p = fromHex("FFFFFFFF00000001000000000000000000000000FFFFFFFFFFFFFFFFFFFFFFFF");
    var a = fromHex("FFFFFFFF00000001000000000000000000000000FFFFFFFFFFFFFFFFFFFFFFFC");
    var b = fromHex("5AC635D8AA3A93E7B3EBBD55769886BC651D06B0CC53B0F63BCE3C3E27D2604B");
    //byte[] S = Hex.decode("C49D360886E704936A6678E1139D26B7819F7E90");
    var n = fromHex("FFFFFFFF00000000FFFFFFFFFFFFFFFFBCE6FAADA7179E84F3B9CAC2FC632551");
    var h = BigInteger.ONE;
    var curve = new ECCurveFp(p, a, b);
    var G = curve.decodePointHex("04"
                + "6B17D1F2E12C4247F8BCE6E563A440F277037D812DEB33A0F4A13945D898C296"
		+ "4FE342E2FE1A7F9B8EE7EB4A7C0F9E162BCE33576B315ECECBB6406837BF51F5");
    return new X9ECParameters(curve, G, n, h);
}

// TODO: make this into a proper hashtable
function getSECCurveByName(name) {
    if(name == "secp128r1") return secp128r1();
    if(name == "secp160k1") return secp160k1();
    if(name == "secp160r1") return secp160r1();
    if(name == "secp192k1") return secp192k1();
    if(name == "secp192r1") return secp192r1();
    if(name == "secp224r1") return secp224r1();
    if(name == "secp256r1") return secp256r1();
    return null;
}

module.exports = {
  "secp128r1":secp128r1,
  "secp160k1":secp160k1,
  "secp160r1":secp160r1,
  "secp192k1":secp192k1,
  "secp192r1":secp192r1,
  "secp224r1":secp224r1,
  "secp256r1":secp256r1
}


/***/ }),

/***/ "YZtm":
/*!****************************************!*\
  !*** ./node_modules/ecc-jsbn/index.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var crypto = __webpack_require__(/*! crypto */ "HEbw");
var BigInteger = __webpack_require__(/*! jsbn */ "8z4W").BigInteger;
var ECPointFp = __webpack_require__(/*! ./lib/ec.js */ "mJl1").ECPointFp;
var Buffer = __webpack_require__(/*! safer-buffer */ "xZGU").Buffer;
exports.ECCurves = __webpack_require__(/*! ./lib/sec.js */ "ASEr");

// zero prepad
function unstupid(hex,len)
{
	return (hex.length >= len) ? hex : unstupid("0"+hex,len);
}

exports.ECKey = function(curve, key, isPublic)
{
  var priv;
	var c = curve();
	var n = c.getN();
  var bytes = Math.floor(n.bitLength()/8);

  if(key)
  {
    if(isPublic)
    {
      var curve = c.getCurve();
//      var x = key.slice(1,bytes+1); // skip the 04 for uncompressed format
//      var y = key.slice(bytes+1);
//      this.P = new ECPointFp(curve,
//        curve.fromBigInteger(new BigInteger(x.toString("hex"), 16)),
//        curve.fromBigInteger(new BigInteger(y.toString("hex"), 16)));      
      this.P = curve.decodePointHex(key.toString("hex"));
    }else{
      if(key.length != bytes) return false;
      priv = new BigInteger(key.toString("hex"), 16);      
    }
  }else{
    var n1 = n.subtract(BigInteger.ONE);
    var r = new BigInteger(crypto.randomBytes(n.bitLength()));
    priv = r.mod(n1).add(BigInteger.ONE);
    this.P = c.getG().multiply(priv);
  }
  if(this.P)
  {
//  var pubhex = unstupid(this.P.getX().toBigInteger().toString(16),bytes*2)+unstupid(this.P.getY().toBigInteger().toString(16),bytes*2);
//  this.PublicKey = Buffer.from("04"+pubhex,"hex");
    this.PublicKey = Buffer.from(c.getCurve().encodeCompressedPointHex(this.P),"hex");
  }
  if(priv)
  {
    this.PrivateKey = Buffer.from(unstupid(priv.toString(16),bytes*2),"hex");
    this.deriveSharedSecret = function(key)
    {
      if(!key || !key.P) return false;
      var S = key.P.multiply(priv);
      return Buffer.from(unstupid(S.getX().toBigInteger().toString(16),bytes*2),"hex");
   }     
  }
}



/***/ }),

/***/ "mJl1":
/*!*****************************************!*\
  !*** ./node_modules/ecc-jsbn/lib/ec.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// Basic Javascript Elliptic Curve implementation
// Ported loosely from BouncyCastle's Java EC code
// Only Fp curves implemented for now

// Requires jsbn.js and jsbn2.js
var BigInteger = __webpack_require__(/*! jsbn */ "8z4W").BigInteger
var Barrett = BigInteger.prototype.Barrett

// ----------------
// ECFieldElementFp

// constructor
function ECFieldElementFp(q,x) {
    this.x = x;
    // TODO if(x.compareTo(q) >= 0) error
    this.q = q;
}

function feFpEquals(other) {
    if(other == this) return true;
    return (this.q.equals(other.q) && this.x.equals(other.x));
}

function feFpToBigInteger() {
    return this.x;
}

function feFpNegate() {
    return new ECFieldElementFp(this.q, this.x.negate().mod(this.q));
}

function feFpAdd(b) {
    return new ECFieldElementFp(this.q, this.x.add(b.toBigInteger()).mod(this.q));
}

function feFpSubtract(b) {
    return new ECFieldElementFp(this.q, this.x.subtract(b.toBigInteger()).mod(this.q));
}

function feFpMultiply(b) {
    return new ECFieldElementFp(this.q, this.x.multiply(b.toBigInteger()).mod(this.q));
}

function feFpSquare() {
    return new ECFieldElementFp(this.q, this.x.square().mod(this.q));
}

function feFpDivide(b) {
    return new ECFieldElementFp(this.q, this.x.multiply(b.toBigInteger().modInverse(this.q)).mod(this.q));
}

ECFieldElementFp.prototype.equals = feFpEquals;
ECFieldElementFp.prototype.toBigInteger = feFpToBigInteger;
ECFieldElementFp.prototype.negate = feFpNegate;
ECFieldElementFp.prototype.add = feFpAdd;
ECFieldElementFp.prototype.subtract = feFpSubtract;
ECFieldElementFp.prototype.multiply = feFpMultiply;
ECFieldElementFp.prototype.square = feFpSquare;
ECFieldElementFp.prototype.divide = feFpDivide;

// ----------------
// ECPointFp

// constructor
function ECPointFp(curve,x,y,z) {
    this.curve = curve;
    this.x = x;
    this.y = y;
    // Projective coordinates: either zinv == null or z * zinv == 1
    // z and zinv are just BigIntegers, not fieldElements
    if(z == null) {
      this.z = BigInteger.ONE;
    }
    else {
      this.z = z;
    }
    this.zinv = null;
    //TODO: compression flag
}

function pointFpGetX() {
    if(this.zinv == null) {
      this.zinv = this.z.modInverse(this.curve.q);
    }
    var r = this.x.toBigInteger().multiply(this.zinv);
    this.curve.reduce(r);
    return this.curve.fromBigInteger(r);
}

function pointFpGetY() {
    if(this.zinv == null) {
      this.zinv = this.z.modInverse(this.curve.q);
    }
    var r = this.y.toBigInteger().multiply(this.zinv);
    this.curve.reduce(r);
    return this.curve.fromBigInteger(r);
}

function pointFpEquals(other) {
    if(other == this) return true;
    if(this.isInfinity()) return other.isInfinity();
    if(other.isInfinity()) return this.isInfinity();
    var u, v;
    // u = Y2 * Z1 - Y1 * Z2
    u = other.y.toBigInteger().multiply(this.z).subtract(this.y.toBigInteger().multiply(other.z)).mod(this.curve.q);
    if(!u.equals(BigInteger.ZERO)) return false;
    // v = X2 * Z1 - X1 * Z2
    v = other.x.toBigInteger().multiply(this.z).subtract(this.x.toBigInteger().multiply(other.z)).mod(this.curve.q);
    return v.equals(BigInteger.ZERO);
}

function pointFpIsInfinity() {
    if((this.x == null) && (this.y == null)) return true;
    return this.z.equals(BigInteger.ZERO) && !this.y.toBigInteger().equals(BigInteger.ZERO);
}

function pointFpNegate() {
    return new ECPointFp(this.curve, this.x, this.y.negate(), this.z);
}

function pointFpAdd(b) {
    if(this.isInfinity()) return b;
    if(b.isInfinity()) return this;

    // u = Y2 * Z1 - Y1 * Z2
    var u = b.y.toBigInteger().multiply(this.z).subtract(this.y.toBigInteger().multiply(b.z)).mod(this.curve.q);
    // v = X2 * Z1 - X1 * Z2
    var v = b.x.toBigInteger().multiply(this.z).subtract(this.x.toBigInteger().multiply(b.z)).mod(this.curve.q);

    if(BigInteger.ZERO.equals(v)) {
        if(BigInteger.ZERO.equals(u)) {
            return this.twice(); // this == b, so double
        }
	return this.curve.getInfinity(); // this = -b, so infinity
    }

    var THREE = new BigInteger("3");
    var x1 = this.x.toBigInteger();
    var y1 = this.y.toBigInteger();
    var x2 = b.x.toBigInteger();
    var y2 = b.y.toBigInteger();

    var v2 = v.square();
    var v3 = v2.multiply(v);
    var x1v2 = x1.multiply(v2);
    var zu2 = u.square().multiply(this.z);

    // x3 = v * (z2 * (z1 * u^2 - 2 * x1 * v^2) - v^3)
    var x3 = zu2.subtract(x1v2.shiftLeft(1)).multiply(b.z).subtract(v3).multiply(v).mod(this.curve.q);
    // y3 = z2 * (3 * x1 * u * v^2 - y1 * v^3 - z1 * u^3) + u * v^3
    var y3 = x1v2.multiply(THREE).multiply(u).subtract(y1.multiply(v3)).subtract(zu2.multiply(u)).multiply(b.z).add(u.multiply(v3)).mod(this.curve.q);
    // z3 = v^3 * z1 * z2
    var z3 = v3.multiply(this.z).multiply(b.z).mod(this.curve.q);

    return new ECPointFp(this.curve, this.curve.fromBigInteger(x3), this.curve.fromBigInteger(y3), z3);
}

function pointFpTwice() {
    if(this.isInfinity()) return this;
    if(this.y.toBigInteger().signum() == 0) return this.curve.getInfinity();

    // TODO: optimized handling of constants
    var THREE = new BigInteger("3");
    var x1 = this.x.toBigInteger();
    var y1 = this.y.toBigInteger();

    var y1z1 = y1.multiply(this.z);
    var y1sqz1 = y1z1.multiply(y1).mod(this.curve.q);
    var a = this.curve.a.toBigInteger();

    // w = 3 * x1^2 + a * z1^2
    var w = x1.square().multiply(THREE);
    if(!BigInteger.ZERO.equals(a)) {
      w = w.add(this.z.square().multiply(a));
    }
    w = w.mod(this.curve.q);
    //this.curve.reduce(w);
    // x3 = 2 * y1 * z1 * (w^2 - 8 * x1 * y1^2 * z1)
    var x3 = w.square().subtract(x1.shiftLeft(3).multiply(y1sqz1)).shiftLeft(1).multiply(y1z1).mod(this.curve.q);
    // y3 = 4 * y1^2 * z1 * (3 * w * x1 - 2 * y1^2 * z1) - w^3
    var y3 = w.multiply(THREE).multiply(x1).subtract(y1sqz1.shiftLeft(1)).shiftLeft(2).multiply(y1sqz1).subtract(w.square().multiply(w)).mod(this.curve.q);
    // z3 = 8 * (y1 * z1)^3
    var z3 = y1z1.square().multiply(y1z1).shiftLeft(3).mod(this.curve.q);

    return new ECPointFp(this.curve, this.curve.fromBigInteger(x3), this.curve.fromBigInteger(y3), z3);
}

// Simple NAF (Non-Adjacent Form) multiplication algorithm
// TODO: modularize the multiplication algorithm
function pointFpMultiply(k) {
    if(this.isInfinity()) return this;
    if(k.signum() == 0) return this.curve.getInfinity();

    var e = k;
    var h = e.multiply(new BigInteger("3"));

    var neg = this.negate();
    var R = this;

    var i;
    for(i = h.bitLength() - 2; i > 0; --i) {
	R = R.twice();

	var hBit = h.testBit(i);
	var eBit = e.testBit(i);

	if (hBit != eBit) {
	    R = R.add(hBit ? this : neg);
	}
    }

    return R;
}

// Compute this*j + x*k (simultaneous multiplication)
function pointFpMultiplyTwo(j,x,k) {
  var i;
  if(j.bitLength() > k.bitLength())
    i = j.bitLength() - 1;
  else
    i = k.bitLength() - 1;

  var R = this.curve.getInfinity();
  var both = this.add(x);
  while(i >= 0) {
    R = R.twice();
    if(j.testBit(i)) {
      if(k.testBit(i)) {
        R = R.add(both);
      }
      else {
        R = R.add(this);
      }
    }
    else {
      if(k.testBit(i)) {
        R = R.add(x);
      }
    }
    --i;
  }

  return R;
}

ECPointFp.prototype.getX = pointFpGetX;
ECPointFp.prototype.getY = pointFpGetY;
ECPointFp.prototype.equals = pointFpEquals;
ECPointFp.prototype.isInfinity = pointFpIsInfinity;
ECPointFp.prototype.negate = pointFpNegate;
ECPointFp.prototype.add = pointFpAdd;
ECPointFp.prototype.twice = pointFpTwice;
ECPointFp.prototype.multiply = pointFpMultiply;
ECPointFp.prototype.multiplyTwo = pointFpMultiplyTwo;

// ----------------
// ECCurveFp

// constructor
function ECCurveFp(q,a,b) {
    this.q = q;
    this.a = this.fromBigInteger(a);
    this.b = this.fromBigInteger(b);
    this.infinity = new ECPointFp(this, null, null);
    this.reducer = new Barrett(this.q);
}

function curveFpGetQ() {
    return this.q;
}

function curveFpGetA() {
    return this.a;
}

function curveFpGetB() {
    return this.b;
}

function curveFpEquals(other) {
    if(other == this) return true;
    return(this.q.equals(other.q) && this.a.equals(other.a) && this.b.equals(other.b));
}

function curveFpGetInfinity() {
    return this.infinity;
}

function curveFpFromBigInteger(x) {
    return new ECFieldElementFp(this.q, x);
}

function curveReduce(x) {
    this.reducer.reduce(x);
}

// for now, work with hex strings because they're easier in JS
function curveFpDecodePointHex(s) {
    switch(parseInt(s.substr(0,2), 16)) { // first byte
    case 0:
	return this.infinity;
    case 2:
    case 3:
	// point compression not supported yet
	return null;
    case 4:
    case 6:
    case 7:
	var len = (s.length - 2) / 2;
	var xHex = s.substr(2, len);
	var yHex = s.substr(len+2, len);

	return new ECPointFp(this,
			     this.fromBigInteger(new BigInteger(xHex, 16)),
			     this.fromBigInteger(new BigInteger(yHex, 16)));

    default: // unsupported
	return null;
    }
}

function curveFpEncodePointHex(p) {
	if (p.isInfinity()) return "00";
	var xHex = p.getX().toBigInteger().toString(16);
	var yHex = p.getY().toBigInteger().toString(16);
	var oLen = this.getQ().toString(16).length;
	if ((oLen % 2) != 0) oLen++;
	while (xHex.length < oLen) {
		xHex = "0" + xHex;
	}
	while (yHex.length < oLen) {
		yHex = "0" + yHex;
	}
	return "04" + xHex + yHex;
}

ECCurveFp.prototype.getQ = curveFpGetQ;
ECCurveFp.prototype.getA = curveFpGetA;
ECCurveFp.prototype.getB = curveFpGetB;
ECCurveFp.prototype.equals = curveFpEquals;
ECCurveFp.prototype.getInfinity = curveFpGetInfinity;
ECCurveFp.prototype.fromBigInteger = curveFpFromBigInteger;
ECCurveFp.prototype.reduce = curveReduce;
//ECCurveFp.prototype.decodePointHex = curveFpDecodePointHex;
ECCurveFp.prototype.encodePointHex = curveFpEncodePointHex;

// from: https://github.com/kaielvin/jsbn-ec-point-compression
ECCurveFp.prototype.decodePointHex = function(s)
{
	var yIsEven;
    switch(parseInt(s.substr(0,2), 16)) { // first byte
    case 0:
	return this.infinity;
    case 2:
	yIsEven = false;
    case 3:
	if(yIsEven == undefined) yIsEven = true;
	var len = s.length - 2;
	var xHex = s.substr(2, len);
	var x = this.fromBigInteger(new BigInteger(xHex,16));
	var alpha = x.multiply(x.square().add(this.getA())).add(this.getB());
	var beta = alpha.sqrt();

    if (beta == null) throw "Invalid point compression";

    var betaValue = beta.toBigInteger();
    if (betaValue.testBit(0) != yIsEven)
    {
        // Use the other root
        beta = this.fromBigInteger(this.getQ().subtract(betaValue));
    }
    return new ECPointFp(this,x,beta);
    case 4:
    case 6:
    case 7:
	var len = (s.length - 2) / 2;
	var xHex = s.substr(2, len);
	var yHex = s.substr(len+2, len);

	return new ECPointFp(this,
			     this.fromBigInteger(new BigInteger(xHex, 16)),
			     this.fromBigInteger(new BigInteger(yHex, 16)));

    default: // unsupported
	return null;
    }
}
ECCurveFp.prototype.encodeCompressedPointHex = function(p)
{
	if (p.isInfinity()) return "00";
	var xHex = p.getX().toBigInteger().toString(16);
	var oLen = this.getQ().toString(16).length;
	if ((oLen % 2) != 0) oLen++;
	while (xHex.length < oLen)
		xHex = "0" + xHex;
	var yPrefix;
	if(p.getY().toBigInteger().isEven()) yPrefix = "02";
	else                                 yPrefix = "03";

	return yPrefix + xHex;
}


ECFieldElementFp.prototype.getR = function()
{
	if(this.r != undefined) return this.r;

    this.r = null;
    var bitLength = this.q.bitLength();
    if (bitLength > 128)
    {
        var firstWord = this.q.shiftRight(bitLength - 64);
        if (firstWord.intValue() == -1)
        {
            this.r = BigInteger.ONE.shiftLeft(bitLength).subtract(this.q);
        }
    }
    return this.r;
}
ECFieldElementFp.prototype.modMult = function(x1,x2)
{
    return this.modReduce(x1.multiply(x2));
}
ECFieldElementFp.prototype.modReduce = function(x)
{
    if (this.getR() != null)
    {
        var qLen = q.bitLength();
        while (x.bitLength() > (qLen + 1))
        {
            var u = x.shiftRight(qLen);
            var v = x.subtract(u.shiftLeft(qLen));
            if (!this.getR().equals(BigInteger.ONE))
            {
                u = u.multiply(this.getR());
            }
            x = u.add(v); 
        }
        while (x.compareTo(q) >= 0)
        {
            x = x.subtract(q);
        }
    }
    else
    {
        x = x.mod(q);
    }
    return x;
}
ECFieldElementFp.prototype.sqrt = function()
{
    if (!this.q.testBit(0)) throw "unsupported";

    // p mod 4 == 3
    if (this.q.testBit(1))
    {
    	var z = new ECFieldElementFp(this.q,this.x.modPow(this.q.shiftRight(2).add(BigInteger.ONE),this.q));
    	return z.square().equals(this) ? z : null;
    }

    // p mod 4 == 1
    var qMinusOne = this.q.subtract(BigInteger.ONE);

    var legendreExponent = qMinusOne.shiftRight(1);
    if (!(this.x.modPow(legendreExponent, this.q).equals(BigInteger.ONE)))
    {
        return null;
    }

    var u = qMinusOne.shiftRight(2);
    var k = u.shiftLeft(1).add(BigInteger.ONE);

    var Q = this.x;
    var fourQ = modDouble(modDouble(Q));

    var U, V;
    do
    {
        var P;
        do
        {
            P = new BigInteger(this.q.bitLength(), new SecureRandom());
        }
        while (P.compareTo(this.q) >= 0
            || !(P.multiply(P).subtract(fourQ).modPow(legendreExponent, this.q).equals(qMinusOne)));

        var result = this.lucasSequence(P, Q, k);
        U = result[0];
        V = result[1];

        if (this.modMult(V, V).equals(fourQ))
        {
            // Integer division by 2, mod q
            if (V.testBit(0))
            {
                V = V.add(q);
            }

            V = V.shiftRight(1);

            return new ECFieldElementFp(q,V);
        }
    }
    while (U.equals(BigInteger.ONE) || U.equals(qMinusOne));

    return null;
}
ECFieldElementFp.prototype.lucasSequence = function(P,Q,k)
{
    var n = k.bitLength();
    var s = k.getLowestSetBit();

    var Uh = BigInteger.ONE;
    var Vl = BigInteger.TWO;
    var Vh = P;
    var Ql = BigInteger.ONE;
    var Qh = BigInteger.ONE;

    for (var j = n - 1; j >= s + 1; --j)
    {
        Ql = this.modMult(Ql, Qh);

        if (k.testBit(j))
        {
            Qh = this.modMult(Ql, Q);
            Uh = this.modMult(Uh, Vh);
            Vl = this.modReduce(Vh.multiply(Vl).subtract(P.multiply(Ql)));
            Vh = this.modReduce(Vh.multiply(Vh).subtract(Qh.shiftLeft(1)));
        }
        else
        {
            Qh = Ql;
            Uh = this.modReduce(Uh.multiply(Vl).subtract(Ql));
            Vh = this.modReduce(Vh.multiply(Vl).subtract(P.multiply(Ql)));
            Vl = this.modReduce(Vl.multiply(Vl).subtract(Ql.shiftLeft(1)));
        }
    }

    Ql = this.modMult(Ql, Qh);
    Qh = this.modMult(Ql, Q);
    Uh = this.modReduce(Uh.multiply(Vl).subtract(Ql));
    Vl = this.modReduce(Vh.multiply(Vl).subtract(P.multiply(Ql)));
    Ql = this.modMult(Ql, Qh);

    for (var j = 1; j <= s; ++j)
    {
        Uh = this.modMult(Uh, Vl);
        Vl = this.modReduce(Vl.multiply(Vl).subtract(Ql.shiftLeft(1)));
        Ql = this.modMult(Ql, Ql);
    }

    return [ Uh, Vl ];
}

var exports = {
  ECCurveFp: ECCurveFp,
  ECPointFp: ECPointFp,
  ECFieldElementFp: ECFieldElementFp
}

module.exports = exports


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZWNjLWpzYm4vbGliL3NlYy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZWNjLWpzYm4vaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2VjYy1qc2JuL2xpYi9lYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTs7QUFFQTtBQUNBLGlCQUFpQixtQkFBTyxDQUFDLGtCQUFNO0FBQy9CLGdCQUFnQixtQkFBTyxDQUFDLHFCQUFTOzs7QUFHakM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxxQkFBcUIsOEJBQThCOztBQUVuRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUN6S0EsYUFBYSxtQkFBTyxDQUFDLG9CQUFRO0FBQzdCLGlCQUFpQixtQkFBTyxDQUFDLGtCQUFNO0FBQy9CLGdCQUFnQixtQkFBTyxDQUFDLHlCQUFhO0FBQ3JDLGFBQWEsbUJBQU8sQ0FBQywwQkFBYztBQUNuQyxtQkFBbUIsbUJBQU8sQ0FBQywwQkFBYzs7QUFFekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFDQUFxQztBQUNyQztBQUNBO0FBQ0E7QUFDQSx1RTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EscUQ7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEk7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDeERBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGlCQUFpQixtQkFBTyxDQUFDLGtCQUFNO0FBQy9COztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxnQ0FBZ0M7QUFDaEM7QUFDQSxpQ0FBaUM7QUFDakM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSw4QkFBOEIsT0FBTztBQUNyQzs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx5Q0FBeUM7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlDQUF5QztBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7O0FBR0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsdUJBQXVCLFlBQVk7QUFDbkM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxtQkFBbUIsUUFBUTtBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSIsImZpbGUiOiJidWlsZC92ZW5kb3IvdmVuZG9yLmVjYy1qc2JuLjM0OTJjZTUxNzU4MmYzYmNkM2YzLmNodW5rLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gTmFtZWQgRUMgY3VydmVzXHJcblxyXG4vLyBSZXF1aXJlcyBlYy5qcywganNibi5qcywgYW5kIGpzYm4yLmpzXHJcbnZhciBCaWdJbnRlZ2VyID0gcmVxdWlyZSgnanNibicpLkJpZ0ludGVnZXJcclxudmFyIEVDQ3VydmVGcCA9IHJlcXVpcmUoJy4vZWMuanMnKS5FQ0N1cnZlRnBcclxuXHJcblxyXG4vLyAtLS0tLS0tLS0tLS0tLS0tXHJcbi8vIFg5RUNQYXJhbWV0ZXJzXHJcblxyXG4vLyBjb25zdHJ1Y3RvclxyXG5mdW5jdGlvbiBYOUVDUGFyYW1ldGVycyhjdXJ2ZSxnLG4saCkge1xyXG4gICAgdGhpcy5jdXJ2ZSA9IGN1cnZlO1xyXG4gICAgdGhpcy5nID0gZztcclxuICAgIHRoaXMubiA9IG47XHJcbiAgICB0aGlzLmggPSBoO1xyXG59XHJcblxyXG5mdW5jdGlvbiB4OWdldEN1cnZlKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuY3VydmU7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHg5Z2V0RygpIHtcclxuICAgIHJldHVybiB0aGlzLmc7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHg5Z2V0TigpIHtcclxuICAgIHJldHVybiB0aGlzLm47XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHg5Z2V0SCgpIHtcclxuICAgIHJldHVybiB0aGlzLmg7XHJcbn1cclxuXHJcblg5RUNQYXJhbWV0ZXJzLnByb3RvdHlwZS5nZXRDdXJ2ZSA9IHg5Z2V0Q3VydmU7XHJcblg5RUNQYXJhbWV0ZXJzLnByb3RvdHlwZS5nZXRHID0geDlnZXRHO1xyXG5YOUVDUGFyYW1ldGVycy5wcm90b3R5cGUuZ2V0TiA9IHg5Z2V0TjtcclxuWDlFQ1BhcmFtZXRlcnMucHJvdG90eXBlLmdldEggPSB4OWdldEg7XHJcblxyXG4vLyAtLS0tLS0tLS0tLS0tLS0tXHJcbi8vIFNFQ05hbWVkQ3VydmVzXHJcblxyXG5mdW5jdGlvbiBmcm9tSGV4KHMpIHsgcmV0dXJuIG5ldyBCaWdJbnRlZ2VyKHMsIDE2KTsgfVxyXG5cclxuZnVuY3Rpb24gc2VjcDEyOHIxKCkge1xyXG4gICAgLy8gcCA9IDJeMTI4IC0gMl45NyAtIDFcclxuICAgIHZhciBwID0gZnJvbUhleChcIkZGRkZGRkZERkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGXCIpO1xyXG4gICAgdmFyIGEgPSBmcm9tSGV4KFwiRkZGRkZGRkRGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkNcIik7XHJcbiAgICB2YXIgYiA9IGZyb21IZXgoXCJFODc1NzlDMTEwNzlGNDNERDgyNDk5M0MyQ0VFNUVEM1wiKTtcclxuICAgIC8vYnl0ZVtdIFMgPSBIZXguZGVjb2RlKFwiMDAwRTBENEQ2OTZFNjc2ODc1NjE1MTc1MENDMDNBNDQ3M0QwMzY3OVwiKTtcclxuICAgIHZhciBuID0gZnJvbUhleChcIkZGRkZGRkZFMDAwMDAwMDA3NUEzMEQxQjkwMzhBMTE1XCIpO1xyXG4gICAgdmFyIGggPSBCaWdJbnRlZ2VyLk9ORTtcclxuICAgIHZhciBjdXJ2ZSA9IG5ldyBFQ0N1cnZlRnAocCwgYSwgYik7XHJcbiAgICB2YXIgRyA9IGN1cnZlLmRlY29kZVBvaW50SGV4KFwiMDRcIlxyXG4gICAgICAgICAgICAgICAgKyBcIjE2MUZGNzUyOEI4OTlCMkQwQzI4NjA3Q0E1MkM1Qjg2XCJcclxuXHRcdCsgXCJDRjVBQzgzOTVCQUZFQjEzQzAyREEyOTJEREVEN0E4M1wiKTtcclxuICAgIHJldHVybiBuZXcgWDlFQ1BhcmFtZXRlcnMoY3VydmUsIEcsIG4sIGgpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBzZWNwMTYwazEoKSB7XHJcbiAgICAvLyBwID0gMl4xNjAgLSAyXjMyIC0gMl4xNCAtIDJeMTIgLSAyXjkgLSAyXjggLSAyXjcgLSAyXjMgLSAyXjIgLSAxXHJcbiAgICB2YXIgcCA9IGZyb21IZXgoXCJGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRUZGRkZBQzczXCIpO1xyXG4gICAgdmFyIGEgPSBCaWdJbnRlZ2VyLlpFUk87XHJcbiAgICB2YXIgYiA9IGZyb21IZXgoXCI3XCIpO1xyXG4gICAgLy9ieXRlW10gUyA9IG51bGw7XHJcbiAgICB2YXIgbiA9IGZyb21IZXgoXCIwMTAwMDAwMDAwMDAwMDAwMDAwMDAxQjhGQTE2REZBQjlBQ0ExNkI2QjNcIik7XHJcbiAgICB2YXIgaCA9IEJpZ0ludGVnZXIuT05FO1xyXG4gICAgdmFyIGN1cnZlID0gbmV3IEVDQ3VydmVGcChwLCBhLCBiKTtcclxuICAgIHZhciBHID0gY3VydmUuZGVjb2RlUG9pbnRIZXgoXCIwNFwiXHJcbiAgICAgICAgICAgICAgICArIFwiM0I0QzM4MkNFMzdBQTE5MkE0MDE5RTc2MzAzNkY0RjVERDREN0VCQlwiXHJcbiAgICAgICAgICAgICAgICArIFwiOTM4Q0Y5MzUzMThGRENFRDZCQzI4Mjg2NTMxNzMzQzNGMDNDNEZFRVwiKTtcclxuICAgIHJldHVybiBuZXcgWDlFQ1BhcmFtZXRlcnMoY3VydmUsIEcsIG4sIGgpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBzZWNwMTYwcjEoKSB7XHJcbiAgICAvLyBwID0gMl4xNjAgLSAyXjMxIC0gMVxyXG4gICAgdmFyIHAgPSBmcm9tSGV4KFwiRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkY3RkZGRkZGRlwiKTtcclxuICAgIHZhciBhID0gZnJvbUhleChcIkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGN0ZGRkZGRkNcIik7XHJcbiAgICB2YXIgYiA9IGZyb21IZXgoXCIxQzk3QkVGQzU0QkQ3QThCNjVBQ0Y4OUY4MUQ0RDRBREM1NjVGQTQ1XCIpO1xyXG4gICAgLy9ieXRlW10gUyA9IEhleC5kZWNvZGUoXCIxMDUzQ0RFNDJDMTRENjk2RTY3Njg3NTYxNTE3NTMzQkYzRjgzMzQ1XCIpO1xyXG4gICAgdmFyIG4gPSBmcm9tSGV4KFwiMDEwMDAwMDAwMDAwMDAwMDAwMDAwMUY0QzhGOTI3QUVEM0NBNzUyMjU3XCIpO1xyXG4gICAgdmFyIGggPSBCaWdJbnRlZ2VyLk9ORTtcclxuICAgIHZhciBjdXJ2ZSA9IG5ldyBFQ0N1cnZlRnAocCwgYSwgYik7XHJcbiAgICB2YXIgRyA9IGN1cnZlLmRlY29kZVBvaW50SGV4KFwiMDRcIlxyXG5cdFx0KyBcIjRBOTZCNTY4OEVGNTczMjg0NjY0Njk4OTY4QzM4QkI5MTNDQkZDODJcIlxyXG5cdFx0KyBcIjIzQTYyODU1MzE2ODk0N0Q1OURDQzkxMjA0MjM1MTM3N0FDNUZCMzJcIik7XHJcbiAgICByZXR1cm4gbmV3IFg5RUNQYXJhbWV0ZXJzKGN1cnZlLCBHLCBuLCBoKTtcclxufVxyXG5cclxuZnVuY3Rpb24gc2VjcDE5MmsxKCkge1xyXG4gICAgLy8gcCA9IDJeMTkyIC0gMl4zMiAtIDJeMTIgLSAyXjggLSAyXjcgLSAyXjYgLSAyXjMgLSAxXHJcbiAgICB2YXIgcCA9IGZyb21IZXgoXCJGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZFRkZGRkVFMzdcIik7XHJcbiAgICB2YXIgYSA9IEJpZ0ludGVnZXIuWkVSTztcclxuICAgIHZhciBiID0gZnJvbUhleChcIjNcIik7XHJcbiAgICAvL2J5dGVbXSBTID0gbnVsbDtcclxuICAgIHZhciBuID0gZnJvbUhleChcIkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRTI2RjJGQzE3MEY2OTQ2NkE3NERFRkQ4RFwiKTtcclxuICAgIHZhciBoID0gQmlnSW50ZWdlci5PTkU7XHJcbiAgICB2YXIgY3VydmUgPSBuZXcgRUNDdXJ2ZUZwKHAsIGEsIGIpO1xyXG4gICAgdmFyIEcgPSBjdXJ2ZS5kZWNvZGVQb2ludEhleChcIjA0XCJcclxuICAgICAgICAgICAgICAgICsgXCJEQjRGRjEwRUMwNTdFOUFFMjZCMDdEMDI4MEI3RjQzNDFEQTVEMUIxRUFFMDZDN0RcIlxyXG4gICAgICAgICAgICAgICAgKyBcIjlCMkYyRjZEOUM1NjI4QTc4NDQxNjNEMDE1QkU4NjM0NDA4MkFBODhEOTVFMkY5RFwiKTtcclxuICAgIHJldHVybiBuZXcgWDlFQ1BhcmFtZXRlcnMoY3VydmUsIEcsIG4sIGgpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBzZWNwMTkycjEoKSB7XHJcbiAgICAvLyBwID0gMl4xOTIgLSAyXjY0IC0gMVxyXG4gICAgdmFyIHAgPSBmcm9tSGV4KFwiRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkVGRkZGRkZGRkZGRkZGRkZGXCIpO1xyXG4gICAgdmFyIGEgPSBmcm9tSGV4KFwiRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkVGRkZGRkZGRkZGRkZGRkZDXCIpO1xyXG4gICAgdmFyIGIgPSBmcm9tSGV4KFwiNjQyMTA1MTlFNTlDODBFNzBGQTdFOUFCNzIyNDMwNDlGRUI4REVFQ0MxNDZCOUIxXCIpO1xyXG4gICAgLy9ieXRlW10gUyA9IEhleC5kZWNvZGUoXCIzMDQ1QUU2RkM4NDIyRjY0RUQ1Nzk1MjhEMzgxMjBFQUUxMjE5NkQ1XCIpO1xyXG4gICAgdmFyIG4gPSBmcm9tSGV4KFwiRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGOTlERUY4MzYxNDZCQzlCMUI0RDIyODMxXCIpO1xyXG4gICAgdmFyIGggPSBCaWdJbnRlZ2VyLk9ORTtcclxuICAgIHZhciBjdXJ2ZSA9IG5ldyBFQ0N1cnZlRnAocCwgYSwgYik7XHJcbiAgICB2YXIgRyA9IGN1cnZlLmRlY29kZVBvaW50SGV4KFwiMDRcIlxyXG4gICAgICAgICAgICAgICAgKyBcIjE4OERBODBFQjAzMDkwRjY3Q0JGMjBFQjQzQTE4ODAwRjRGRjBBRkQ4MkZGMTAxMlwiXHJcbiAgICAgICAgICAgICAgICArIFwiMDcxOTJCOTVGRkM4REE3ODYzMTAxMUVENkIyNENERDU3M0Y5NzdBMTFFNzk0ODExXCIpO1xyXG4gICAgcmV0dXJuIG5ldyBYOUVDUGFyYW1ldGVycyhjdXJ2ZSwgRywgbiwgaCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNlY3AyMjRyMSgpIHtcclxuICAgIC8vIHAgPSAyXjIyNCAtIDJeOTYgKyAxXHJcbiAgICB2YXIgcCA9IGZyb21IZXgoXCJGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRjAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMVwiKTtcclxuICAgIHZhciBhID0gZnJvbUhleChcIkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZFRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZFXCIpO1xyXG4gICAgdmFyIGIgPSBmcm9tSGV4KFwiQjQwNTBBODUwQzA0QjNBQkY1NDEzMjU2NTA0NEIwQjdEN0JGRDhCQTI3MEIzOTQzMjM1NUZGQjRcIik7XHJcbiAgICAvL2J5dGVbXSBTID0gSGV4LmRlY29kZShcIkJENzEzNDQ3OTlENUM3RkNEQzQ1QjU5RkEzQjlBQjhGNkE5NDhCQzVcIik7XHJcbiAgICB2YXIgbiA9IGZyb21IZXgoXCJGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGMTZBMkUwQjhGMDNFMTNERDI5NDU1QzVDMkEzRFwiKTtcclxuICAgIHZhciBoID0gQmlnSW50ZWdlci5PTkU7XHJcbiAgICB2YXIgY3VydmUgPSBuZXcgRUNDdXJ2ZUZwKHAsIGEsIGIpO1xyXG4gICAgdmFyIEcgPSBjdXJ2ZS5kZWNvZGVQb2ludEhleChcIjA0XCJcclxuICAgICAgICAgICAgICAgICsgXCJCNzBFMENCRDZCQjRCRjdGMzIxMzkwQjk0QTAzQzFEMzU2QzIxMTIyMzQzMjgwRDYxMTVDMUQyMVwiXHJcbiAgICAgICAgICAgICAgICArIFwiQkQzNzYzODhCNUY3MjNGQjRDMjJERkU2Q0Q0Mzc1QTA1QTA3NDc2NDQ0RDU4MTk5ODUwMDdFMzRcIik7XHJcbiAgICByZXR1cm4gbmV3IFg5RUNQYXJhbWV0ZXJzKGN1cnZlLCBHLCBuLCBoKTtcclxufVxyXG5cclxuZnVuY3Rpb24gc2VjcDI1NnIxKCkge1xyXG4gICAgLy8gcCA9IDJeMjI0ICgyXjMyIC0gMSkgKyAyXjE5MiArIDJeOTYgLSAxXHJcbiAgICB2YXIgcCA9IGZyb21IZXgoXCJGRkZGRkZGRjAwMDAwMDAxMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGXCIpO1xyXG4gICAgdmFyIGEgPSBmcm9tSGV4KFwiRkZGRkZGRkYwMDAwMDAwMTAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMEZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGQ1wiKTtcclxuICAgIHZhciBiID0gZnJvbUhleChcIjVBQzYzNUQ4QUEzQTkzRTdCM0VCQkQ1NTc2OTg4NkJDNjUxRDA2QjBDQzUzQjBGNjNCQ0UzQzNFMjdEMjYwNEJcIik7XHJcbiAgICAvL2J5dGVbXSBTID0gSGV4LmRlY29kZShcIkM0OUQzNjA4ODZFNzA0OTM2QTY2NzhFMTEzOUQyNkI3ODE5RjdFOTBcIik7XHJcbiAgICB2YXIgbiA9IGZyb21IZXgoXCJGRkZGRkZGRjAwMDAwMDAwRkZGRkZGRkZGRkZGRkZGRkJDRTZGQUFEQTcxNzlFODRGM0I5Q0FDMkZDNjMyNTUxXCIpO1xyXG4gICAgdmFyIGggPSBCaWdJbnRlZ2VyLk9ORTtcclxuICAgIHZhciBjdXJ2ZSA9IG5ldyBFQ0N1cnZlRnAocCwgYSwgYik7XHJcbiAgICB2YXIgRyA9IGN1cnZlLmRlY29kZVBvaW50SGV4KFwiMDRcIlxyXG4gICAgICAgICAgICAgICAgKyBcIjZCMTdEMUYyRTEyQzQyNDdGOEJDRTZFNTYzQTQ0MEYyNzcwMzdEODEyREVCMzNBMEY0QTEzOTQ1RDg5OEMyOTZcIlxyXG5cdFx0KyBcIjRGRTM0MkUyRkUxQTdGOUI4RUU3RUI0QTdDMEY5RTE2MkJDRTMzNTc2QjMxNUVDRUNCQjY0MDY4MzdCRjUxRjVcIik7XHJcbiAgICByZXR1cm4gbmV3IFg5RUNQYXJhbWV0ZXJzKGN1cnZlLCBHLCBuLCBoKTtcclxufVxyXG5cclxuLy8gVE9ETzogbWFrZSB0aGlzIGludG8gYSBwcm9wZXIgaGFzaHRhYmxlXHJcbmZ1bmN0aW9uIGdldFNFQ0N1cnZlQnlOYW1lKG5hbWUpIHtcclxuICAgIGlmKG5hbWUgPT0gXCJzZWNwMTI4cjFcIikgcmV0dXJuIHNlY3AxMjhyMSgpO1xyXG4gICAgaWYobmFtZSA9PSBcInNlY3AxNjBrMVwiKSByZXR1cm4gc2VjcDE2MGsxKCk7XHJcbiAgICBpZihuYW1lID09IFwic2VjcDE2MHIxXCIpIHJldHVybiBzZWNwMTYwcjEoKTtcclxuICAgIGlmKG5hbWUgPT0gXCJzZWNwMTkyazFcIikgcmV0dXJuIHNlY3AxOTJrMSgpO1xyXG4gICAgaWYobmFtZSA9PSBcInNlY3AxOTJyMVwiKSByZXR1cm4gc2VjcDE5MnIxKCk7XHJcbiAgICBpZihuYW1lID09IFwic2VjcDIyNHIxXCIpIHJldHVybiBzZWNwMjI0cjEoKTtcclxuICAgIGlmKG5hbWUgPT0gXCJzZWNwMjU2cjFcIikgcmV0dXJuIHNlY3AyNTZyMSgpO1xyXG4gICAgcmV0dXJuIG51bGw7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gIFwic2VjcDEyOHIxXCI6c2VjcDEyOHIxLFxyXG4gIFwic2VjcDE2MGsxXCI6c2VjcDE2MGsxLFxyXG4gIFwic2VjcDE2MHIxXCI6c2VjcDE2MHIxLFxyXG4gIFwic2VjcDE5MmsxXCI6c2VjcDE5MmsxLFxyXG4gIFwic2VjcDE5MnIxXCI6c2VjcDE5MnIxLFxyXG4gIFwic2VjcDIyNHIxXCI6c2VjcDIyNHIxLFxyXG4gIFwic2VjcDI1NnIxXCI6c2VjcDI1NnIxXHJcbn1cclxuIiwidmFyIGNyeXB0byA9IHJlcXVpcmUoXCJjcnlwdG9cIik7XHJcbnZhciBCaWdJbnRlZ2VyID0gcmVxdWlyZShcImpzYm5cIikuQmlnSW50ZWdlcjtcclxudmFyIEVDUG9pbnRGcCA9IHJlcXVpcmUoXCIuL2xpYi9lYy5qc1wiKS5FQ1BvaW50RnA7XHJcbnZhciBCdWZmZXIgPSByZXF1aXJlKFwic2FmZXItYnVmZmVyXCIpLkJ1ZmZlcjtcclxuZXhwb3J0cy5FQ0N1cnZlcyA9IHJlcXVpcmUoXCIuL2xpYi9zZWMuanNcIik7XHJcblxyXG4vLyB6ZXJvIHByZXBhZFxyXG5mdW5jdGlvbiB1bnN0dXBpZChoZXgsbGVuKVxyXG57XHJcblx0cmV0dXJuIChoZXgubGVuZ3RoID49IGxlbikgPyBoZXggOiB1bnN0dXBpZChcIjBcIitoZXgsbGVuKTtcclxufVxyXG5cclxuZXhwb3J0cy5FQ0tleSA9IGZ1bmN0aW9uKGN1cnZlLCBrZXksIGlzUHVibGljKVxyXG57XHJcbiAgdmFyIHByaXY7XHJcblx0dmFyIGMgPSBjdXJ2ZSgpO1xyXG5cdHZhciBuID0gYy5nZXROKCk7XHJcbiAgdmFyIGJ5dGVzID0gTWF0aC5mbG9vcihuLmJpdExlbmd0aCgpLzgpO1xyXG5cclxuICBpZihrZXkpXHJcbiAge1xyXG4gICAgaWYoaXNQdWJsaWMpXHJcbiAgICB7XHJcbiAgICAgIHZhciBjdXJ2ZSA9IGMuZ2V0Q3VydmUoKTtcclxuLy8gICAgICB2YXIgeCA9IGtleS5zbGljZSgxLGJ5dGVzKzEpOyAvLyBza2lwIHRoZSAwNCBmb3IgdW5jb21wcmVzc2VkIGZvcm1hdFxyXG4vLyAgICAgIHZhciB5ID0ga2V5LnNsaWNlKGJ5dGVzKzEpO1xyXG4vLyAgICAgIHRoaXMuUCA9IG5ldyBFQ1BvaW50RnAoY3VydmUsXHJcbi8vICAgICAgICBjdXJ2ZS5mcm9tQmlnSW50ZWdlcihuZXcgQmlnSW50ZWdlcih4LnRvU3RyaW5nKFwiaGV4XCIpLCAxNikpLFxyXG4vLyAgICAgICAgY3VydmUuZnJvbUJpZ0ludGVnZXIobmV3IEJpZ0ludGVnZXIoeS50b1N0cmluZyhcImhleFwiKSwgMTYpKSk7ICAgICAgXHJcbiAgICAgIHRoaXMuUCA9IGN1cnZlLmRlY29kZVBvaW50SGV4KGtleS50b1N0cmluZyhcImhleFwiKSk7XHJcbiAgICB9ZWxzZXtcclxuICAgICAgaWYoa2V5Lmxlbmd0aCAhPSBieXRlcykgcmV0dXJuIGZhbHNlO1xyXG4gICAgICBwcml2ID0gbmV3IEJpZ0ludGVnZXIoa2V5LnRvU3RyaW5nKFwiaGV4XCIpLCAxNik7ICAgICAgXHJcbiAgICB9XHJcbiAgfWVsc2V7XHJcbiAgICB2YXIgbjEgPSBuLnN1YnRyYWN0KEJpZ0ludGVnZXIuT05FKTtcclxuICAgIHZhciByID0gbmV3IEJpZ0ludGVnZXIoY3J5cHRvLnJhbmRvbUJ5dGVzKG4uYml0TGVuZ3RoKCkpKTtcclxuICAgIHByaXYgPSByLm1vZChuMSkuYWRkKEJpZ0ludGVnZXIuT05FKTtcclxuICAgIHRoaXMuUCA9IGMuZ2V0RygpLm11bHRpcGx5KHByaXYpO1xyXG4gIH1cclxuICBpZih0aGlzLlApXHJcbiAge1xyXG4vLyAgdmFyIHB1YmhleCA9IHVuc3R1cGlkKHRoaXMuUC5nZXRYKCkudG9CaWdJbnRlZ2VyKCkudG9TdHJpbmcoMTYpLGJ5dGVzKjIpK3Vuc3R1cGlkKHRoaXMuUC5nZXRZKCkudG9CaWdJbnRlZ2VyKCkudG9TdHJpbmcoMTYpLGJ5dGVzKjIpO1xyXG4vLyAgdGhpcy5QdWJsaWNLZXkgPSBCdWZmZXIuZnJvbShcIjA0XCIrcHViaGV4LFwiaGV4XCIpO1xyXG4gICAgdGhpcy5QdWJsaWNLZXkgPSBCdWZmZXIuZnJvbShjLmdldEN1cnZlKCkuZW5jb2RlQ29tcHJlc3NlZFBvaW50SGV4KHRoaXMuUCksXCJoZXhcIik7XHJcbiAgfVxyXG4gIGlmKHByaXYpXHJcbiAge1xyXG4gICAgdGhpcy5Qcml2YXRlS2V5ID0gQnVmZmVyLmZyb20odW5zdHVwaWQocHJpdi50b1N0cmluZygxNiksYnl0ZXMqMiksXCJoZXhcIik7XHJcbiAgICB0aGlzLmRlcml2ZVNoYXJlZFNlY3JldCA9IGZ1bmN0aW9uKGtleSlcclxuICAgIHtcclxuICAgICAgaWYoIWtleSB8fCAha2V5LlApIHJldHVybiBmYWxzZTtcclxuICAgICAgdmFyIFMgPSBrZXkuUC5tdWx0aXBseShwcml2KTtcclxuICAgICAgcmV0dXJuIEJ1ZmZlci5mcm9tKHVuc3R1cGlkKFMuZ2V0WCgpLnRvQmlnSW50ZWdlcigpLnRvU3RyaW5nKDE2KSxieXRlcyoyKSxcImhleFwiKTtcclxuICAgfSAgICAgXHJcbiAgfVxyXG59XHJcblxyXG4iLCIvLyBCYXNpYyBKYXZhc2NyaXB0IEVsbGlwdGljIEN1cnZlIGltcGxlbWVudGF0aW9uXHJcbi8vIFBvcnRlZCBsb29zZWx5IGZyb20gQm91bmN5Q2FzdGxlJ3MgSmF2YSBFQyBjb2RlXHJcbi8vIE9ubHkgRnAgY3VydmVzIGltcGxlbWVudGVkIGZvciBub3dcclxuXHJcbi8vIFJlcXVpcmVzIGpzYm4uanMgYW5kIGpzYm4yLmpzXHJcbnZhciBCaWdJbnRlZ2VyID0gcmVxdWlyZSgnanNibicpLkJpZ0ludGVnZXJcclxudmFyIEJhcnJldHQgPSBCaWdJbnRlZ2VyLnByb3RvdHlwZS5CYXJyZXR0XHJcblxyXG4vLyAtLS0tLS0tLS0tLS0tLS0tXHJcbi8vIEVDRmllbGRFbGVtZW50RnBcclxuXHJcbi8vIGNvbnN0cnVjdG9yXHJcbmZ1bmN0aW9uIEVDRmllbGRFbGVtZW50RnAocSx4KSB7XHJcbiAgICB0aGlzLnggPSB4O1xyXG4gICAgLy8gVE9ETyBpZih4LmNvbXBhcmVUbyhxKSA+PSAwKSBlcnJvclxyXG4gICAgdGhpcy5xID0gcTtcclxufVxyXG5cclxuZnVuY3Rpb24gZmVGcEVxdWFscyhvdGhlcikge1xyXG4gICAgaWYob3RoZXIgPT0gdGhpcykgcmV0dXJuIHRydWU7XHJcbiAgICByZXR1cm4gKHRoaXMucS5lcXVhbHMob3RoZXIucSkgJiYgdGhpcy54LmVxdWFscyhvdGhlci54KSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGZlRnBUb0JpZ0ludGVnZXIoKSB7XHJcbiAgICByZXR1cm4gdGhpcy54O1xyXG59XHJcblxyXG5mdW5jdGlvbiBmZUZwTmVnYXRlKCkge1xyXG4gICAgcmV0dXJuIG5ldyBFQ0ZpZWxkRWxlbWVudEZwKHRoaXMucSwgdGhpcy54Lm5lZ2F0ZSgpLm1vZCh0aGlzLnEpKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZmVGcEFkZChiKSB7XHJcbiAgICByZXR1cm4gbmV3IEVDRmllbGRFbGVtZW50RnAodGhpcy5xLCB0aGlzLnguYWRkKGIudG9CaWdJbnRlZ2VyKCkpLm1vZCh0aGlzLnEpKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZmVGcFN1YnRyYWN0KGIpIHtcclxuICAgIHJldHVybiBuZXcgRUNGaWVsZEVsZW1lbnRGcCh0aGlzLnEsIHRoaXMueC5zdWJ0cmFjdChiLnRvQmlnSW50ZWdlcigpKS5tb2QodGhpcy5xKSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGZlRnBNdWx0aXBseShiKSB7XHJcbiAgICByZXR1cm4gbmV3IEVDRmllbGRFbGVtZW50RnAodGhpcy5xLCB0aGlzLngubXVsdGlwbHkoYi50b0JpZ0ludGVnZXIoKSkubW9kKHRoaXMucSkpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBmZUZwU3F1YXJlKCkge1xyXG4gICAgcmV0dXJuIG5ldyBFQ0ZpZWxkRWxlbWVudEZwKHRoaXMucSwgdGhpcy54LnNxdWFyZSgpLm1vZCh0aGlzLnEpKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZmVGcERpdmlkZShiKSB7XHJcbiAgICByZXR1cm4gbmV3IEVDRmllbGRFbGVtZW50RnAodGhpcy5xLCB0aGlzLngubXVsdGlwbHkoYi50b0JpZ0ludGVnZXIoKS5tb2RJbnZlcnNlKHRoaXMucSkpLm1vZCh0aGlzLnEpKTtcclxufVxyXG5cclxuRUNGaWVsZEVsZW1lbnRGcC5wcm90b3R5cGUuZXF1YWxzID0gZmVGcEVxdWFscztcclxuRUNGaWVsZEVsZW1lbnRGcC5wcm90b3R5cGUudG9CaWdJbnRlZ2VyID0gZmVGcFRvQmlnSW50ZWdlcjtcclxuRUNGaWVsZEVsZW1lbnRGcC5wcm90b3R5cGUubmVnYXRlID0gZmVGcE5lZ2F0ZTtcclxuRUNGaWVsZEVsZW1lbnRGcC5wcm90b3R5cGUuYWRkID0gZmVGcEFkZDtcclxuRUNGaWVsZEVsZW1lbnRGcC5wcm90b3R5cGUuc3VidHJhY3QgPSBmZUZwU3VidHJhY3Q7XHJcbkVDRmllbGRFbGVtZW50RnAucHJvdG90eXBlLm11bHRpcGx5ID0gZmVGcE11bHRpcGx5O1xyXG5FQ0ZpZWxkRWxlbWVudEZwLnByb3RvdHlwZS5zcXVhcmUgPSBmZUZwU3F1YXJlO1xyXG5FQ0ZpZWxkRWxlbWVudEZwLnByb3RvdHlwZS5kaXZpZGUgPSBmZUZwRGl2aWRlO1xyXG5cclxuLy8gLS0tLS0tLS0tLS0tLS0tLVxyXG4vLyBFQ1BvaW50RnBcclxuXHJcbi8vIGNvbnN0cnVjdG9yXHJcbmZ1bmN0aW9uIEVDUG9pbnRGcChjdXJ2ZSx4LHkseikge1xyXG4gICAgdGhpcy5jdXJ2ZSA9IGN1cnZlO1xyXG4gICAgdGhpcy54ID0geDtcclxuICAgIHRoaXMueSA9IHk7XHJcbiAgICAvLyBQcm9qZWN0aXZlIGNvb3JkaW5hdGVzOiBlaXRoZXIgemludiA9PSBudWxsIG9yIHogKiB6aW52ID09IDFcclxuICAgIC8vIHogYW5kIHppbnYgYXJlIGp1c3QgQmlnSW50ZWdlcnMsIG5vdCBmaWVsZEVsZW1lbnRzXHJcbiAgICBpZih6ID09IG51bGwpIHtcclxuICAgICAgdGhpcy56ID0gQmlnSW50ZWdlci5PTkU7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgdGhpcy56ID0gejtcclxuICAgIH1cclxuICAgIHRoaXMuemludiA9IG51bGw7XHJcbiAgICAvL1RPRE86IGNvbXByZXNzaW9uIGZsYWdcclxufVxyXG5cclxuZnVuY3Rpb24gcG9pbnRGcEdldFgoKSB7XHJcbiAgICBpZih0aGlzLnppbnYgPT0gbnVsbCkge1xyXG4gICAgICB0aGlzLnppbnYgPSB0aGlzLnoubW9kSW52ZXJzZSh0aGlzLmN1cnZlLnEpO1xyXG4gICAgfVxyXG4gICAgdmFyIHIgPSB0aGlzLngudG9CaWdJbnRlZ2VyKCkubXVsdGlwbHkodGhpcy56aW52KTtcclxuICAgIHRoaXMuY3VydmUucmVkdWNlKHIpO1xyXG4gICAgcmV0dXJuIHRoaXMuY3VydmUuZnJvbUJpZ0ludGVnZXIocik7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHBvaW50RnBHZXRZKCkge1xyXG4gICAgaWYodGhpcy56aW52ID09IG51bGwpIHtcclxuICAgICAgdGhpcy56aW52ID0gdGhpcy56Lm1vZEludmVyc2UodGhpcy5jdXJ2ZS5xKTtcclxuICAgIH1cclxuICAgIHZhciByID0gdGhpcy55LnRvQmlnSW50ZWdlcigpLm11bHRpcGx5KHRoaXMuemludik7XHJcbiAgICB0aGlzLmN1cnZlLnJlZHVjZShyKTtcclxuICAgIHJldHVybiB0aGlzLmN1cnZlLmZyb21CaWdJbnRlZ2VyKHIpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBwb2ludEZwRXF1YWxzKG90aGVyKSB7XHJcbiAgICBpZihvdGhlciA9PSB0aGlzKSByZXR1cm4gdHJ1ZTtcclxuICAgIGlmKHRoaXMuaXNJbmZpbml0eSgpKSByZXR1cm4gb3RoZXIuaXNJbmZpbml0eSgpO1xyXG4gICAgaWYob3RoZXIuaXNJbmZpbml0eSgpKSByZXR1cm4gdGhpcy5pc0luZmluaXR5KCk7XHJcbiAgICB2YXIgdSwgdjtcclxuICAgIC8vIHUgPSBZMiAqIFoxIC0gWTEgKiBaMlxyXG4gICAgdSA9IG90aGVyLnkudG9CaWdJbnRlZ2VyKCkubXVsdGlwbHkodGhpcy56KS5zdWJ0cmFjdCh0aGlzLnkudG9CaWdJbnRlZ2VyKCkubXVsdGlwbHkob3RoZXIueikpLm1vZCh0aGlzLmN1cnZlLnEpO1xyXG4gICAgaWYoIXUuZXF1YWxzKEJpZ0ludGVnZXIuWkVSTykpIHJldHVybiBmYWxzZTtcclxuICAgIC8vIHYgPSBYMiAqIFoxIC0gWDEgKiBaMlxyXG4gICAgdiA9IG90aGVyLngudG9CaWdJbnRlZ2VyKCkubXVsdGlwbHkodGhpcy56KS5zdWJ0cmFjdCh0aGlzLngudG9CaWdJbnRlZ2VyKCkubXVsdGlwbHkob3RoZXIueikpLm1vZCh0aGlzLmN1cnZlLnEpO1xyXG4gICAgcmV0dXJuIHYuZXF1YWxzKEJpZ0ludGVnZXIuWkVSTyk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHBvaW50RnBJc0luZmluaXR5KCkge1xyXG4gICAgaWYoKHRoaXMueCA9PSBudWxsKSAmJiAodGhpcy55ID09IG51bGwpKSByZXR1cm4gdHJ1ZTtcclxuICAgIHJldHVybiB0aGlzLnouZXF1YWxzKEJpZ0ludGVnZXIuWkVSTykgJiYgIXRoaXMueS50b0JpZ0ludGVnZXIoKS5lcXVhbHMoQmlnSW50ZWdlci5aRVJPKTtcclxufVxyXG5cclxuZnVuY3Rpb24gcG9pbnRGcE5lZ2F0ZSgpIHtcclxuICAgIHJldHVybiBuZXcgRUNQb2ludEZwKHRoaXMuY3VydmUsIHRoaXMueCwgdGhpcy55Lm5lZ2F0ZSgpLCB0aGlzLnopO1xyXG59XHJcblxyXG5mdW5jdGlvbiBwb2ludEZwQWRkKGIpIHtcclxuICAgIGlmKHRoaXMuaXNJbmZpbml0eSgpKSByZXR1cm4gYjtcclxuICAgIGlmKGIuaXNJbmZpbml0eSgpKSByZXR1cm4gdGhpcztcclxuXHJcbiAgICAvLyB1ID0gWTIgKiBaMSAtIFkxICogWjJcclxuICAgIHZhciB1ID0gYi55LnRvQmlnSW50ZWdlcigpLm11bHRpcGx5KHRoaXMueikuc3VidHJhY3QodGhpcy55LnRvQmlnSW50ZWdlcigpLm11bHRpcGx5KGIueikpLm1vZCh0aGlzLmN1cnZlLnEpO1xyXG4gICAgLy8gdiA9IFgyICogWjEgLSBYMSAqIFoyXHJcbiAgICB2YXIgdiA9IGIueC50b0JpZ0ludGVnZXIoKS5tdWx0aXBseSh0aGlzLnopLnN1YnRyYWN0KHRoaXMueC50b0JpZ0ludGVnZXIoKS5tdWx0aXBseShiLnopKS5tb2QodGhpcy5jdXJ2ZS5xKTtcclxuXHJcbiAgICBpZihCaWdJbnRlZ2VyLlpFUk8uZXF1YWxzKHYpKSB7XHJcbiAgICAgICAgaWYoQmlnSW50ZWdlci5aRVJPLmVxdWFscyh1KSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy50d2ljZSgpOyAvLyB0aGlzID09IGIsIHNvIGRvdWJsZVxyXG4gICAgICAgIH1cclxuXHRyZXR1cm4gdGhpcy5jdXJ2ZS5nZXRJbmZpbml0eSgpOyAvLyB0aGlzID0gLWIsIHNvIGluZmluaXR5XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIFRIUkVFID0gbmV3IEJpZ0ludGVnZXIoXCIzXCIpO1xyXG4gICAgdmFyIHgxID0gdGhpcy54LnRvQmlnSW50ZWdlcigpO1xyXG4gICAgdmFyIHkxID0gdGhpcy55LnRvQmlnSW50ZWdlcigpO1xyXG4gICAgdmFyIHgyID0gYi54LnRvQmlnSW50ZWdlcigpO1xyXG4gICAgdmFyIHkyID0gYi55LnRvQmlnSW50ZWdlcigpO1xyXG5cclxuICAgIHZhciB2MiA9IHYuc3F1YXJlKCk7XHJcbiAgICB2YXIgdjMgPSB2Mi5tdWx0aXBseSh2KTtcclxuICAgIHZhciB4MXYyID0geDEubXVsdGlwbHkodjIpO1xyXG4gICAgdmFyIHp1MiA9IHUuc3F1YXJlKCkubXVsdGlwbHkodGhpcy56KTtcclxuXHJcbiAgICAvLyB4MyA9IHYgKiAoejIgKiAoejEgKiB1XjIgLSAyICogeDEgKiB2XjIpIC0gdl4zKVxyXG4gICAgdmFyIHgzID0genUyLnN1YnRyYWN0KHgxdjIuc2hpZnRMZWZ0KDEpKS5tdWx0aXBseShiLnopLnN1YnRyYWN0KHYzKS5tdWx0aXBseSh2KS5tb2QodGhpcy5jdXJ2ZS5xKTtcclxuICAgIC8vIHkzID0gejIgKiAoMyAqIHgxICogdSAqIHZeMiAtIHkxICogdl4zIC0gejEgKiB1XjMpICsgdSAqIHZeM1xyXG4gICAgdmFyIHkzID0geDF2Mi5tdWx0aXBseShUSFJFRSkubXVsdGlwbHkodSkuc3VidHJhY3QoeTEubXVsdGlwbHkodjMpKS5zdWJ0cmFjdCh6dTIubXVsdGlwbHkodSkpLm11bHRpcGx5KGIueikuYWRkKHUubXVsdGlwbHkodjMpKS5tb2QodGhpcy5jdXJ2ZS5xKTtcclxuICAgIC8vIHozID0gdl4zICogejEgKiB6MlxyXG4gICAgdmFyIHozID0gdjMubXVsdGlwbHkodGhpcy56KS5tdWx0aXBseShiLnopLm1vZCh0aGlzLmN1cnZlLnEpO1xyXG5cclxuICAgIHJldHVybiBuZXcgRUNQb2ludEZwKHRoaXMuY3VydmUsIHRoaXMuY3VydmUuZnJvbUJpZ0ludGVnZXIoeDMpLCB0aGlzLmN1cnZlLmZyb21CaWdJbnRlZ2VyKHkzKSwgejMpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBwb2ludEZwVHdpY2UoKSB7XHJcbiAgICBpZih0aGlzLmlzSW5maW5pdHkoKSkgcmV0dXJuIHRoaXM7XHJcbiAgICBpZih0aGlzLnkudG9CaWdJbnRlZ2VyKCkuc2lnbnVtKCkgPT0gMCkgcmV0dXJuIHRoaXMuY3VydmUuZ2V0SW5maW5pdHkoKTtcclxuXHJcbiAgICAvLyBUT0RPOiBvcHRpbWl6ZWQgaGFuZGxpbmcgb2YgY29uc3RhbnRzXHJcbiAgICB2YXIgVEhSRUUgPSBuZXcgQmlnSW50ZWdlcihcIjNcIik7XHJcbiAgICB2YXIgeDEgPSB0aGlzLngudG9CaWdJbnRlZ2VyKCk7XHJcbiAgICB2YXIgeTEgPSB0aGlzLnkudG9CaWdJbnRlZ2VyKCk7XHJcblxyXG4gICAgdmFyIHkxejEgPSB5MS5tdWx0aXBseSh0aGlzLnopO1xyXG4gICAgdmFyIHkxc3F6MSA9IHkxejEubXVsdGlwbHkoeTEpLm1vZCh0aGlzLmN1cnZlLnEpO1xyXG4gICAgdmFyIGEgPSB0aGlzLmN1cnZlLmEudG9CaWdJbnRlZ2VyKCk7XHJcblxyXG4gICAgLy8gdyA9IDMgKiB4MV4yICsgYSAqIHoxXjJcclxuICAgIHZhciB3ID0geDEuc3F1YXJlKCkubXVsdGlwbHkoVEhSRUUpO1xyXG4gICAgaWYoIUJpZ0ludGVnZXIuWkVSTy5lcXVhbHMoYSkpIHtcclxuICAgICAgdyA9IHcuYWRkKHRoaXMuei5zcXVhcmUoKS5tdWx0aXBseShhKSk7XHJcbiAgICB9XHJcbiAgICB3ID0gdy5tb2QodGhpcy5jdXJ2ZS5xKTtcclxuICAgIC8vdGhpcy5jdXJ2ZS5yZWR1Y2Uodyk7XHJcbiAgICAvLyB4MyA9IDIgKiB5MSAqIHoxICogKHdeMiAtIDggKiB4MSAqIHkxXjIgKiB6MSlcclxuICAgIHZhciB4MyA9IHcuc3F1YXJlKCkuc3VidHJhY3QoeDEuc2hpZnRMZWZ0KDMpLm11bHRpcGx5KHkxc3F6MSkpLnNoaWZ0TGVmdCgxKS5tdWx0aXBseSh5MXoxKS5tb2QodGhpcy5jdXJ2ZS5xKTtcclxuICAgIC8vIHkzID0gNCAqIHkxXjIgKiB6MSAqICgzICogdyAqIHgxIC0gMiAqIHkxXjIgKiB6MSkgLSB3XjNcclxuICAgIHZhciB5MyA9IHcubXVsdGlwbHkoVEhSRUUpLm11bHRpcGx5KHgxKS5zdWJ0cmFjdCh5MXNxejEuc2hpZnRMZWZ0KDEpKS5zaGlmdExlZnQoMikubXVsdGlwbHkoeTFzcXoxKS5zdWJ0cmFjdCh3LnNxdWFyZSgpLm11bHRpcGx5KHcpKS5tb2QodGhpcy5jdXJ2ZS5xKTtcclxuICAgIC8vIHozID0gOCAqICh5MSAqIHoxKV4zXHJcbiAgICB2YXIgejMgPSB5MXoxLnNxdWFyZSgpLm11bHRpcGx5KHkxejEpLnNoaWZ0TGVmdCgzKS5tb2QodGhpcy5jdXJ2ZS5xKTtcclxuXHJcbiAgICByZXR1cm4gbmV3IEVDUG9pbnRGcCh0aGlzLmN1cnZlLCB0aGlzLmN1cnZlLmZyb21CaWdJbnRlZ2VyKHgzKSwgdGhpcy5jdXJ2ZS5mcm9tQmlnSW50ZWdlcih5MyksIHozKTtcclxufVxyXG5cclxuLy8gU2ltcGxlIE5BRiAoTm9uLUFkamFjZW50IEZvcm0pIG11bHRpcGxpY2F0aW9uIGFsZ29yaXRobVxyXG4vLyBUT0RPOiBtb2R1bGFyaXplIHRoZSBtdWx0aXBsaWNhdGlvbiBhbGdvcml0aG1cclxuZnVuY3Rpb24gcG9pbnRGcE11bHRpcGx5KGspIHtcclxuICAgIGlmKHRoaXMuaXNJbmZpbml0eSgpKSByZXR1cm4gdGhpcztcclxuICAgIGlmKGsuc2lnbnVtKCkgPT0gMCkgcmV0dXJuIHRoaXMuY3VydmUuZ2V0SW5maW5pdHkoKTtcclxuXHJcbiAgICB2YXIgZSA9IGs7XHJcbiAgICB2YXIgaCA9IGUubXVsdGlwbHkobmV3IEJpZ0ludGVnZXIoXCIzXCIpKTtcclxuXHJcbiAgICB2YXIgbmVnID0gdGhpcy5uZWdhdGUoKTtcclxuICAgIHZhciBSID0gdGhpcztcclxuXHJcbiAgICB2YXIgaTtcclxuICAgIGZvcihpID0gaC5iaXRMZW5ndGgoKSAtIDI7IGkgPiAwOyAtLWkpIHtcclxuXHRSID0gUi50d2ljZSgpO1xyXG5cclxuXHR2YXIgaEJpdCA9IGgudGVzdEJpdChpKTtcclxuXHR2YXIgZUJpdCA9IGUudGVzdEJpdChpKTtcclxuXHJcblx0aWYgKGhCaXQgIT0gZUJpdCkge1xyXG5cdCAgICBSID0gUi5hZGQoaEJpdCA/IHRoaXMgOiBuZWcpO1xyXG5cdH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gUjtcclxufVxyXG5cclxuLy8gQ29tcHV0ZSB0aGlzKmogKyB4KmsgKHNpbXVsdGFuZW91cyBtdWx0aXBsaWNhdGlvbilcclxuZnVuY3Rpb24gcG9pbnRGcE11bHRpcGx5VHdvKGoseCxrKSB7XHJcbiAgdmFyIGk7XHJcbiAgaWYoai5iaXRMZW5ndGgoKSA+IGsuYml0TGVuZ3RoKCkpXHJcbiAgICBpID0gai5iaXRMZW5ndGgoKSAtIDE7XHJcbiAgZWxzZVxyXG4gICAgaSA9IGsuYml0TGVuZ3RoKCkgLSAxO1xyXG5cclxuICB2YXIgUiA9IHRoaXMuY3VydmUuZ2V0SW5maW5pdHkoKTtcclxuICB2YXIgYm90aCA9IHRoaXMuYWRkKHgpO1xyXG4gIHdoaWxlKGkgPj0gMCkge1xyXG4gICAgUiA9IFIudHdpY2UoKTtcclxuICAgIGlmKGoudGVzdEJpdChpKSkge1xyXG4gICAgICBpZihrLnRlc3RCaXQoaSkpIHtcclxuICAgICAgICBSID0gUi5hZGQoYm90aCk7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgUiA9IFIuYWRkKHRoaXMpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgaWYoay50ZXN0Qml0KGkpKSB7XHJcbiAgICAgICAgUiA9IFIuYWRkKHgpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICAtLWk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gUjtcclxufVxyXG5cclxuRUNQb2ludEZwLnByb3RvdHlwZS5nZXRYID0gcG9pbnRGcEdldFg7XHJcbkVDUG9pbnRGcC5wcm90b3R5cGUuZ2V0WSA9IHBvaW50RnBHZXRZO1xyXG5FQ1BvaW50RnAucHJvdG90eXBlLmVxdWFscyA9IHBvaW50RnBFcXVhbHM7XHJcbkVDUG9pbnRGcC5wcm90b3R5cGUuaXNJbmZpbml0eSA9IHBvaW50RnBJc0luZmluaXR5O1xyXG5FQ1BvaW50RnAucHJvdG90eXBlLm5lZ2F0ZSA9IHBvaW50RnBOZWdhdGU7XHJcbkVDUG9pbnRGcC5wcm90b3R5cGUuYWRkID0gcG9pbnRGcEFkZDtcclxuRUNQb2ludEZwLnByb3RvdHlwZS50d2ljZSA9IHBvaW50RnBUd2ljZTtcclxuRUNQb2ludEZwLnByb3RvdHlwZS5tdWx0aXBseSA9IHBvaW50RnBNdWx0aXBseTtcclxuRUNQb2ludEZwLnByb3RvdHlwZS5tdWx0aXBseVR3byA9IHBvaW50RnBNdWx0aXBseVR3bztcclxuXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS1cclxuLy8gRUNDdXJ2ZUZwXHJcblxyXG4vLyBjb25zdHJ1Y3RvclxyXG5mdW5jdGlvbiBFQ0N1cnZlRnAocSxhLGIpIHtcclxuICAgIHRoaXMucSA9IHE7XHJcbiAgICB0aGlzLmEgPSB0aGlzLmZyb21CaWdJbnRlZ2VyKGEpO1xyXG4gICAgdGhpcy5iID0gdGhpcy5mcm9tQmlnSW50ZWdlcihiKTtcclxuICAgIHRoaXMuaW5maW5pdHkgPSBuZXcgRUNQb2ludEZwKHRoaXMsIG51bGwsIG51bGwpO1xyXG4gICAgdGhpcy5yZWR1Y2VyID0gbmV3IEJhcnJldHQodGhpcy5xKTtcclxufVxyXG5cclxuZnVuY3Rpb24gY3VydmVGcEdldFEoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5xO1xyXG59XHJcblxyXG5mdW5jdGlvbiBjdXJ2ZUZwR2V0QSgpIHtcclxuICAgIHJldHVybiB0aGlzLmE7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGN1cnZlRnBHZXRCKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuYjtcclxufVxyXG5cclxuZnVuY3Rpb24gY3VydmVGcEVxdWFscyhvdGhlcikge1xyXG4gICAgaWYob3RoZXIgPT0gdGhpcykgcmV0dXJuIHRydWU7XHJcbiAgICByZXR1cm4odGhpcy5xLmVxdWFscyhvdGhlci5xKSAmJiB0aGlzLmEuZXF1YWxzKG90aGVyLmEpICYmIHRoaXMuYi5lcXVhbHMob3RoZXIuYikpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBjdXJ2ZUZwR2V0SW5maW5pdHkoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5pbmZpbml0eTtcclxufVxyXG5cclxuZnVuY3Rpb24gY3VydmVGcEZyb21CaWdJbnRlZ2VyKHgpIHtcclxuICAgIHJldHVybiBuZXcgRUNGaWVsZEVsZW1lbnRGcCh0aGlzLnEsIHgpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBjdXJ2ZVJlZHVjZSh4KSB7XHJcbiAgICB0aGlzLnJlZHVjZXIucmVkdWNlKHgpO1xyXG59XHJcblxyXG4vLyBmb3Igbm93LCB3b3JrIHdpdGggaGV4IHN0cmluZ3MgYmVjYXVzZSB0aGV5J3JlIGVhc2llciBpbiBKU1xyXG5mdW5jdGlvbiBjdXJ2ZUZwRGVjb2RlUG9pbnRIZXgocykge1xyXG4gICAgc3dpdGNoKHBhcnNlSW50KHMuc3Vic3RyKDAsMiksIDE2KSkgeyAvLyBmaXJzdCBieXRlXHJcbiAgICBjYXNlIDA6XHJcblx0cmV0dXJuIHRoaXMuaW5maW5pdHk7XHJcbiAgICBjYXNlIDI6XHJcbiAgICBjYXNlIDM6XHJcblx0Ly8gcG9pbnQgY29tcHJlc3Npb24gbm90IHN1cHBvcnRlZCB5ZXRcclxuXHRyZXR1cm4gbnVsbDtcclxuICAgIGNhc2UgNDpcclxuICAgIGNhc2UgNjpcclxuICAgIGNhc2UgNzpcclxuXHR2YXIgbGVuID0gKHMubGVuZ3RoIC0gMikgLyAyO1xyXG5cdHZhciB4SGV4ID0gcy5zdWJzdHIoMiwgbGVuKTtcclxuXHR2YXIgeUhleCA9IHMuc3Vic3RyKGxlbisyLCBsZW4pO1xyXG5cclxuXHRyZXR1cm4gbmV3IEVDUG9pbnRGcCh0aGlzLFxyXG5cdFx0XHQgICAgIHRoaXMuZnJvbUJpZ0ludGVnZXIobmV3IEJpZ0ludGVnZXIoeEhleCwgMTYpKSxcclxuXHRcdFx0ICAgICB0aGlzLmZyb21CaWdJbnRlZ2VyKG5ldyBCaWdJbnRlZ2VyKHlIZXgsIDE2KSkpO1xyXG5cclxuICAgIGRlZmF1bHQ6IC8vIHVuc3VwcG9ydGVkXHJcblx0cmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGN1cnZlRnBFbmNvZGVQb2ludEhleChwKSB7XHJcblx0aWYgKHAuaXNJbmZpbml0eSgpKSByZXR1cm4gXCIwMFwiO1xyXG5cdHZhciB4SGV4ID0gcC5nZXRYKCkudG9CaWdJbnRlZ2VyKCkudG9TdHJpbmcoMTYpO1xyXG5cdHZhciB5SGV4ID0gcC5nZXRZKCkudG9CaWdJbnRlZ2VyKCkudG9TdHJpbmcoMTYpO1xyXG5cdHZhciBvTGVuID0gdGhpcy5nZXRRKCkudG9TdHJpbmcoMTYpLmxlbmd0aDtcclxuXHRpZiAoKG9MZW4gJSAyKSAhPSAwKSBvTGVuKys7XHJcblx0d2hpbGUgKHhIZXgubGVuZ3RoIDwgb0xlbikge1xyXG5cdFx0eEhleCA9IFwiMFwiICsgeEhleDtcclxuXHR9XHJcblx0d2hpbGUgKHlIZXgubGVuZ3RoIDwgb0xlbikge1xyXG5cdFx0eUhleCA9IFwiMFwiICsgeUhleDtcclxuXHR9XHJcblx0cmV0dXJuIFwiMDRcIiArIHhIZXggKyB5SGV4O1xyXG59XHJcblxyXG5FQ0N1cnZlRnAucHJvdG90eXBlLmdldFEgPSBjdXJ2ZUZwR2V0UTtcclxuRUNDdXJ2ZUZwLnByb3RvdHlwZS5nZXRBID0gY3VydmVGcEdldEE7XHJcbkVDQ3VydmVGcC5wcm90b3R5cGUuZ2V0QiA9IGN1cnZlRnBHZXRCO1xyXG5FQ0N1cnZlRnAucHJvdG90eXBlLmVxdWFscyA9IGN1cnZlRnBFcXVhbHM7XHJcbkVDQ3VydmVGcC5wcm90b3R5cGUuZ2V0SW5maW5pdHkgPSBjdXJ2ZUZwR2V0SW5maW5pdHk7XHJcbkVDQ3VydmVGcC5wcm90b3R5cGUuZnJvbUJpZ0ludGVnZXIgPSBjdXJ2ZUZwRnJvbUJpZ0ludGVnZXI7XHJcbkVDQ3VydmVGcC5wcm90b3R5cGUucmVkdWNlID0gY3VydmVSZWR1Y2U7XHJcbi8vRUNDdXJ2ZUZwLnByb3RvdHlwZS5kZWNvZGVQb2ludEhleCA9IGN1cnZlRnBEZWNvZGVQb2ludEhleDtcclxuRUNDdXJ2ZUZwLnByb3RvdHlwZS5lbmNvZGVQb2ludEhleCA9IGN1cnZlRnBFbmNvZGVQb2ludEhleDtcclxuXHJcbi8vIGZyb206IGh0dHBzOi8vZ2l0aHViLmNvbS9rYWllbHZpbi9qc2JuLWVjLXBvaW50LWNvbXByZXNzaW9uXHJcbkVDQ3VydmVGcC5wcm90b3R5cGUuZGVjb2RlUG9pbnRIZXggPSBmdW5jdGlvbihzKVxyXG57XHJcblx0dmFyIHlJc0V2ZW47XHJcbiAgICBzd2l0Y2gocGFyc2VJbnQocy5zdWJzdHIoMCwyKSwgMTYpKSB7IC8vIGZpcnN0IGJ5dGVcclxuICAgIGNhc2UgMDpcclxuXHRyZXR1cm4gdGhpcy5pbmZpbml0eTtcclxuICAgIGNhc2UgMjpcclxuXHR5SXNFdmVuID0gZmFsc2U7XHJcbiAgICBjYXNlIDM6XHJcblx0aWYoeUlzRXZlbiA9PSB1bmRlZmluZWQpIHlJc0V2ZW4gPSB0cnVlO1xyXG5cdHZhciBsZW4gPSBzLmxlbmd0aCAtIDI7XHJcblx0dmFyIHhIZXggPSBzLnN1YnN0cigyLCBsZW4pO1xyXG5cdHZhciB4ID0gdGhpcy5mcm9tQmlnSW50ZWdlcihuZXcgQmlnSW50ZWdlcih4SGV4LDE2KSk7XHJcblx0dmFyIGFscGhhID0geC5tdWx0aXBseSh4LnNxdWFyZSgpLmFkZCh0aGlzLmdldEEoKSkpLmFkZCh0aGlzLmdldEIoKSk7XHJcblx0dmFyIGJldGEgPSBhbHBoYS5zcXJ0KCk7XHJcblxyXG4gICAgaWYgKGJldGEgPT0gbnVsbCkgdGhyb3cgXCJJbnZhbGlkIHBvaW50IGNvbXByZXNzaW9uXCI7XHJcblxyXG4gICAgdmFyIGJldGFWYWx1ZSA9IGJldGEudG9CaWdJbnRlZ2VyKCk7XHJcbiAgICBpZiAoYmV0YVZhbHVlLnRlc3RCaXQoMCkgIT0geUlzRXZlbilcclxuICAgIHtcclxuICAgICAgICAvLyBVc2UgdGhlIG90aGVyIHJvb3RcclxuICAgICAgICBiZXRhID0gdGhpcy5mcm9tQmlnSW50ZWdlcih0aGlzLmdldFEoKS5zdWJ0cmFjdChiZXRhVmFsdWUpKTtcclxuICAgIH1cclxuICAgIHJldHVybiBuZXcgRUNQb2ludEZwKHRoaXMseCxiZXRhKTtcclxuICAgIGNhc2UgNDpcclxuICAgIGNhc2UgNjpcclxuICAgIGNhc2UgNzpcclxuXHR2YXIgbGVuID0gKHMubGVuZ3RoIC0gMikgLyAyO1xyXG5cdHZhciB4SGV4ID0gcy5zdWJzdHIoMiwgbGVuKTtcclxuXHR2YXIgeUhleCA9IHMuc3Vic3RyKGxlbisyLCBsZW4pO1xyXG5cclxuXHRyZXR1cm4gbmV3IEVDUG9pbnRGcCh0aGlzLFxyXG5cdFx0XHQgICAgIHRoaXMuZnJvbUJpZ0ludGVnZXIobmV3IEJpZ0ludGVnZXIoeEhleCwgMTYpKSxcclxuXHRcdFx0ICAgICB0aGlzLmZyb21CaWdJbnRlZ2VyKG5ldyBCaWdJbnRlZ2VyKHlIZXgsIDE2KSkpO1xyXG5cclxuICAgIGRlZmF1bHQ6IC8vIHVuc3VwcG9ydGVkXHJcblx0cmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbn1cclxuRUNDdXJ2ZUZwLnByb3RvdHlwZS5lbmNvZGVDb21wcmVzc2VkUG9pbnRIZXggPSBmdW5jdGlvbihwKVxyXG57XHJcblx0aWYgKHAuaXNJbmZpbml0eSgpKSByZXR1cm4gXCIwMFwiO1xyXG5cdHZhciB4SGV4ID0gcC5nZXRYKCkudG9CaWdJbnRlZ2VyKCkudG9TdHJpbmcoMTYpO1xyXG5cdHZhciBvTGVuID0gdGhpcy5nZXRRKCkudG9TdHJpbmcoMTYpLmxlbmd0aDtcclxuXHRpZiAoKG9MZW4gJSAyKSAhPSAwKSBvTGVuKys7XHJcblx0d2hpbGUgKHhIZXgubGVuZ3RoIDwgb0xlbilcclxuXHRcdHhIZXggPSBcIjBcIiArIHhIZXg7XHJcblx0dmFyIHlQcmVmaXg7XHJcblx0aWYocC5nZXRZKCkudG9CaWdJbnRlZ2VyKCkuaXNFdmVuKCkpIHlQcmVmaXggPSBcIjAyXCI7XHJcblx0ZWxzZSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHlQcmVmaXggPSBcIjAzXCI7XHJcblxyXG5cdHJldHVybiB5UHJlZml4ICsgeEhleDtcclxufVxyXG5cclxuXHJcbkVDRmllbGRFbGVtZW50RnAucHJvdG90eXBlLmdldFIgPSBmdW5jdGlvbigpXHJcbntcclxuXHRpZih0aGlzLnIgIT0gdW5kZWZpbmVkKSByZXR1cm4gdGhpcy5yO1xyXG5cclxuICAgIHRoaXMuciA9IG51bGw7XHJcbiAgICB2YXIgYml0TGVuZ3RoID0gdGhpcy5xLmJpdExlbmd0aCgpO1xyXG4gICAgaWYgKGJpdExlbmd0aCA+IDEyOClcclxuICAgIHtcclxuICAgICAgICB2YXIgZmlyc3RXb3JkID0gdGhpcy5xLnNoaWZ0UmlnaHQoYml0TGVuZ3RoIC0gNjQpO1xyXG4gICAgICAgIGlmIChmaXJzdFdvcmQuaW50VmFsdWUoKSA9PSAtMSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuciA9IEJpZ0ludGVnZXIuT05FLnNoaWZ0TGVmdChiaXRMZW5ndGgpLnN1YnRyYWN0KHRoaXMucSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXMucjtcclxufVxyXG5FQ0ZpZWxkRWxlbWVudEZwLnByb3RvdHlwZS5tb2RNdWx0ID0gZnVuY3Rpb24oeDEseDIpXHJcbntcclxuICAgIHJldHVybiB0aGlzLm1vZFJlZHVjZSh4MS5tdWx0aXBseSh4MikpO1xyXG59XHJcbkVDRmllbGRFbGVtZW50RnAucHJvdG90eXBlLm1vZFJlZHVjZSA9IGZ1bmN0aW9uKHgpXHJcbntcclxuICAgIGlmICh0aGlzLmdldFIoKSAhPSBudWxsKVxyXG4gICAge1xyXG4gICAgICAgIHZhciBxTGVuID0gcS5iaXRMZW5ndGgoKTtcclxuICAgICAgICB3aGlsZSAoeC5iaXRMZW5ndGgoKSA+IChxTGVuICsgMSkpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgdSA9IHguc2hpZnRSaWdodChxTGVuKTtcclxuICAgICAgICAgICAgdmFyIHYgPSB4LnN1YnRyYWN0KHUuc2hpZnRMZWZ0KHFMZW4pKTtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmdldFIoKS5lcXVhbHMoQmlnSW50ZWdlci5PTkUpKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB1ID0gdS5tdWx0aXBseSh0aGlzLmdldFIoKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgeCA9IHUuYWRkKHYpOyBcclxuICAgICAgICB9XHJcbiAgICAgICAgd2hpbGUgKHguY29tcGFyZVRvKHEpID49IDApXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB4ID0geC5zdWJ0cmFjdChxKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBlbHNlXHJcbiAgICB7XHJcbiAgICAgICAgeCA9IHgubW9kKHEpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHg7XHJcbn1cclxuRUNGaWVsZEVsZW1lbnRGcC5wcm90b3R5cGUuc3FydCA9IGZ1bmN0aW9uKClcclxue1xyXG4gICAgaWYgKCF0aGlzLnEudGVzdEJpdCgwKSkgdGhyb3cgXCJ1bnN1cHBvcnRlZFwiO1xyXG5cclxuICAgIC8vIHAgbW9kIDQgPT0gM1xyXG4gICAgaWYgKHRoaXMucS50ZXN0Qml0KDEpKVxyXG4gICAge1xyXG4gICAgXHR2YXIgeiA9IG5ldyBFQ0ZpZWxkRWxlbWVudEZwKHRoaXMucSx0aGlzLngubW9kUG93KHRoaXMucS5zaGlmdFJpZ2h0KDIpLmFkZChCaWdJbnRlZ2VyLk9ORSksdGhpcy5xKSk7XHJcbiAgICBcdHJldHVybiB6LnNxdWFyZSgpLmVxdWFscyh0aGlzKSA/IHogOiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHAgbW9kIDQgPT0gMVxyXG4gICAgdmFyIHFNaW51c09uZSA9IHRoaXMucS5zdWJ0cmFjdChCaWdJbnRlZ2VyLk9ORSk7XHJcblxyXG4gICAgdmFyIGxlZ2VuZHJlRXhwb25lbnQgPSBxTWludXNPbmUuc2hpZnRSaWdodCgxKTtcclxuICAgIGlmICghKHRoaXMueC5tb2RQb3cobGVnZW5kcmVFeHBvbmVudCwgdGhpcy5xKS5lcXVhbHMoQmlnSW50ZWdlci5PTkUpKSlcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgdSA9IHFNaW51c09uZS5zaGlmdFJpZ2h0KDIpO1xyXG4gICAgdmFyIGsgPSB1LnNoaWZ0TGVmdCgxKS5hZGQoQmlnSW50ZWdlci5PTkUpO1xyXG5cclxuICAgIHZhciBRID0gdGhpcy54O1xyXG4gICAgdmFyIGZvdXJRID0gbW9kRG91YmxlKG1vZERvdWJsZShRKSk7XHJcblxyXG4gICAgdmFyIFUsIFY7XHJcbiAgICBkb1xyXG4gICAge1xyXG4gICAgICAgIHZhciBQO1xyXG4gICAgICAgIGRvXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBQID0gbmV3IEJpZ0ludGVnZXIodGhpcy5xLmJpdExlbmd0aCgpLCBuZXcgU2VjdXJlUmFuZG9tKCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB3aGlsZSAoUC5jb21wYXJlVG8odGhpcy5xKSA+PSAwXHJcbiAgICAgICAgICAgIHx8ICEoUC5tdWx0aXBseShQKS5zdWJ0cmFjdChmb3VyUSkubW9kUG93KGxlZ2VuZHJlRXhwb25lbnQsIHRoaXMucSkuZXF1YWxzKHFNaW51c09uZSkpKTtcclxuXHJcbiAgICAgICAgdmFyIHJlc3VsdCA9IHRoaXMubHVjYXNTZXF1ZW5jZShQLCBRLCBrKTtcclxuICAgICAgICBVID0gcmVzdWx0WzBdO1xyXG4gICAgICAgIFYgPSByZXN1bHRbMV07XHJcblxyXG4gICAgICAgIGlmICh0aGlzLm1vZE11bHQoViwgVikuZXF1YWxzKGZvdXJRKSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIC8vIEludGVnZXIgZGl2aXNpb24gYnkgMiwgbW9kIHFcclxuICAgICAgICAgICAgaWYgKFYudGVzdEJpdCgwKSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgViA9IFYuYWRkKHEpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBWID0gVi5zaGlmdFJpZ2h0KDEpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBFQ0ZpZWxkRWxlbWVudEZwKHEsVik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgd2hpbGUgKFUuZXF1YWxzKEJpZ0ludGVnZXIuT05FKSB8fCBVLmVxdWFscyhxTWludXNPbmUpKTtcclxuXHJcbiAgICByZXR1cm4gbnVsbDtcclxufVxyXG5FQ0ZpZWxkRWxlbWVudEZwLnByb3RvdHlwZS5sdWNhc1NlcXVlbmNlID0gZnVuY3Rpb24oUCxRLGspXHJcbntcclxuICAgIHZhciBuID0gay5iaXRMZW5ndGgoKTtcclxuICAgIHZhciBzID0gay5nZXRMb3dlc3RTZXRCaXQoKTtcclxuXHJcbiAgICB2YXIgVWggPSBCaWdJbnRlZ2VyLk9ORTtcclxuICAgIHZhciBWbCA9IEJpZ0ludGVnZXIuVFdPO1xyXG4gICAgdmFyIFZoID0gUDtcclxuICAgIHZhciBRbCA9IEJpZ0ludGVnZXIuT05FO1xyXG4gICAgdmFyIFFoID0gQmlnSW50ZWdlci5PTkU7XHJcblxyXG4gICAgZm9yICh2YXIgaiA9IG4gLSAxOyBqID49IHMgKyAxOyAtLWopXHJcbiAgICB7XHJcbiAgICAgICAgUWwgPSB0aGlzLm1vZE11bHQoUWwsIFFoKTtcclxuXHJcbiAgICAgICAgaWYgKGsudGVzdEJpdChqKSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFFoID0gdGhpcy5tb2RNdWx0KFFsLCBRKTtcclxuICAgICAgICAgICAgVWggPSB0aGlzLm1vZE11bHQoVWgsIFZoKTtcclxuICAgICAgICAgICAgVmwgPSB0aGlzLm1vZFJlZHVjZShWaC5tdWx0aXBseShWbCkuc3VidHJhY3QoUC5tdWx0aXBseShRbCkpKTtcclxuICAgICAgICAgICAgVmggPSB0aGlzLm1vZFJlZHVjZShWaC5tdWx0aXBseShWaCkuc3VidHJhY3QoUWguc2hpZnRMZWZ0KDEpKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFFoID0gUWw7XHJcbiAgICAgICAgICAgIFVoID0gdGhpcy5tb2RSZWR1Y2UoVWgubXVsdGlwbHkoVmwpLnN1YnRyYWN0KFFsKSk7XHJcbiAgICAgICAgICAgIFZoID0gdGhpcy5tb2RSZWR1Y2UoVmgubXVsdGlwbHkoVmwpLnN1YnRyYWN0KFAubXVsdGlwbHkoUWwpKSk7XHJcbiAgICAgICAgICAgIFZsID0gdGhpcy5tb2RSZWR1Y2UoVmwubXVsdGlwbHkoVmwpLnN1YnRyYWN0KFFsLnNoaWZ0TGVmdCgxKSkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBRbCA9IHRoaXMubW9kTXVsdChRbCwgUWgpO1xyXG4gICAgUWggPSB0aGlzLm1vZE11bHQoUWwsIFEpO1xyXG4gICAgVWggPSB0aGlzLm1vZFJlZHVjZShVaC5tdWx0aXBseShWbCkuc3VidHJhY3QoUWwpKTtcclxuICAgIFZsID0gdGhpcy5tb2RSZWR1Y2UoVmgubXVsdGlwbHkoVmwpLnN1YnRyYWN0KFAubXVsdGlwbHkoUWwpKSk7XHJcbiAgICBRbCA9IHRoaXMubW9kTXVsdChRbCwgUWgpO1xyXG5cclxuICAgIGZvciAodmFyIGogPSAxOyBqIDw9IHM7ICsrailcclxuICAgIHtcclxuICAgICAgICBVaCA9IHRoaXMubW9kTXVsdChVaCwgVmwpO1xyXG4gICAgICAgIFZsID0gdGhpcy5tb2RSZWR1Y2UoVmwubXVsdGlwbHkoVmwpLnN1YnRyYWN0KFFsLnNoaWZ0TGVmdCgxKSkpO1xyXG4gICAgICAgIFFsID0gdGhpcy5tb2RNdWx0KFFsLCBRbCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIFsgVWgsIFZsIF07XHJcbn1cclxuXHJcbnZhciBleHBvcnRzID0ge1xyXG4gIEVDQ3VydmVGcDogRUNDdXJ2ZUZwLFxyXG4gIEVDUG9pbnRGcDogRUNQb2ludEZwLFxyXG4gIEVDRmllbGRFbGVtZW50RnA6IEVDRmllbGRFbGVtZW50RnBcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzXHJcbiJdLCJzb3VyY2VSb290IjoiIn0=