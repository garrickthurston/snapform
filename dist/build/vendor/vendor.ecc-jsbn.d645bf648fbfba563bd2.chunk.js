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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZWNjLWpzYm4vbGliL3NlYy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZWNjLWpzYm4vaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2VjYy1qc2JuL2xpYi9lYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTs7QUFFQTtBQUNBLGlCQUFpQixtQkFBTyxDQUFDLGtCQUFNO0FBQy9CLGdCQUFnQixtQkFBTyxDQUFDLHFCQUFTOzs7QUFHakM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxxQkFBcUIsOEJBQThCOztBQUVuRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUN6S0EsYUFBYSxtQkFBTyxDQUFDLG9CQUFRO0FBQzdCLGlCQUFpQixtQkFBTyxDQUFDLGtCQUFNO0FBQy9CLGdCQUFnQixtQkFBTyxDQUFDLHlCQUFhO0FBQ3JDLGFBQWEsbUJBQU8sQ0FBQywwQkFBYztBQUNuQyxtQkFBbUIsbUJBQU8sQ0FBQywwQkFBYzs7QUFFekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFDQUFxQztBQUNyQztBQUNBO0FBQ0E7QUFDQSx1RTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EscUQ7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEk7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDeERBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGlCQUFpQixtQkFBTyxDQUFDLGtCQUFNO0FBQy9COztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxnQ0FBZ0M7QUFDaEM7QUFDQSxpQ0FBaUM7QUFDakM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSw4QkFBOEIsT0FBTztBQUNyQzs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx5Q0FBeUM7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlDQUF5QztBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7O0FBR0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsdUJBQXVCLFlBQVk7QUFDbkM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxtQkFBbUIsUUFBUTtBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSIsImZpbGUiOiJidWlsZC92ZW5kb3IvdmVuZG9yLmVjYy1qc2JuLmQ2NDViZjY0OGZiZmJhNTYzYmQyLmNodW5rLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gTmFtZWQgRUMgY3VydmVzXG5cbi8vIFJlcXVpcmVzIGVjLmpzLCBqc2JuLmpzLCBhbmQganNibjIuanNcbnZhciBCaWdJbnRlZ2VyID0gcmVxdWlyZSgnanNibicpLkJpZ0ludGVnZXJcbnZhciBFQ0N1cnZlRnAgPSByZXF1aXJlKCcuL2VjLmpzJykuRUNDdXJ2ZUZwXG5cblxuLy8gLS0tLS0tLS0tLS0tLS0tLVxuLy8gWDlFQ1BhcmFtZXRlcnNcblxuLy8gY29uc3RydWN0b3JcbmZ1bmN0aW9uIFg5RUNQYXJhbWV0ZXJzKGN1cnZlLGcsbixoKSB7XG4gICAgdGhpcy5jdXJ2ZSA9IGN1cnZlO1xuICAgIHRoaXMuZyA9IGc7XG4gICAgdGhpcy5uID0gbjtcbiAgICB0aGlzLmggPSBoO1xufVxuXG5mdW5jdGlvbiB4OWdldEN1cnZlKCkge1xuICAgIHJldHVybiB0aGlzLmN1cnZlO1xufVxuXG5mdW5jdGlvbiB4OWdldEcoKSB7XG4gICAgcmV0dXJuIHRoaXMuZztcbn1cblxuZnVuY3Rpb24geDlnZXROKCkge1xuICAgIHJldHVybiB0aGlzLm47XG59XG5cbmZ1bmN0aW9uIHg5Z2V0SCgpIHtcbiAgICByZXR1cm4gdGhpcy5oO1xufVxuXG5YOUVDUGFyYW1ldGVycy5wcm90b3R5cGUuZ2V0Q3VydmUgPSB4OWdldEN1cnZlO1xuWDlFQ1BhcmFtZXRlcnMucHJvdG90eXBlLmdldEcgPSB4OWdldEc7XG5YOUVDUGFyYW1ldGVycy5wcm90b3R5cGUuZ2V0TiA9IHg5Z2V0Tjtcblg5RUNQYXJhbWV0ZXJzLnByb3RvdHlwZS5nZXRIID0geDlnZXRIO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tXG4vLyBTRUNOYW1lZEN1cnZlc1xuXG5mdW5jdGlvbiBmcm9tSGV4KHMpIHsgcmV0dXJuIG5ldyBCaWdJbnRlZ2VyKHMsIDE2KTsgfVxuXG5mdW5jdGlvbiBzZWNwMTI4cjEoKSB7XG4gICAgLy8gcCA9IDJeMTI4IC0gMl45NyAtIDFcbiAgICB2YXIgcCA9IGZyb21IZXgoXCJGRkZGRkZGREZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRlwiKTtcbiAgICB2YXIgYSA9IGZyb21IZXgoXCJGRkZGRkZGREZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGQ1wiKTtcbiAgICB2YXIgYiA9IGZyb21IZXgoXCJFODc1NzlDMTEwNzlGNDNERDgyNDk5M0MyQ0VFNUVEM1wiKTtcbiAgICAvL2J5dGVbXSBTID0gSGV4LmRlY29kZShcIjAwMEUwRDRENjk2RTY3Njg3NTYxNTE3NTBDQzAzQTQ0NzNEMDM2NzlcIik7XG4gICAgdmFyIG4gPSBmcm9tSGV4KFwiRkZGRkZGRkUwMDAwMDAwMDc1QTMwRDFCOTAzOEExMTVcIik7XG4gICAgdmFyIGggPSBCaWdJbnRlZ2VyLk9ORTtcbiAgICB2YXIgY3VydmUgPSBuZXcgRUNDdXJ2ZUZwKHAsIGEsIGIpO1xuICAgIHZhciBHID0gY3VydmUuZGVjb2RlUG9pbnRIZXgoXCIwNFwiXG4gICAgICAgICAgICAgICAgKyBcIjE2MUZGNzUyOEI4OTlCMkQwQzI4NjA3Q0E1MkM1Qjg2XCJcblx0XHQrIFwiQ0Y1QUM4Mzk1QkFGRUIxM0MwMkRBMjkyRERFRDdBODNcIik7XG4gICAgcmV0dXJuIG5ldyBYOUVDUGFyYW1ldGVycyhjdXJ2ZSwgRywgbiwgaCk7XG59XG5cbmZ1bmN0aW9uIHNlY3AxNjBrMSgpIHtcbiAgICAvLyBwID0gMl4xNjAgLSAyXjMyIC0gMl4xNCAtIDJeMTIgLSAyXjkgLSAyXjggLSAyXjcgLSAyXjMgLSAyXjIgLSAxXG4gICAgdmFyIHAgPSBmcm9tSGV4KFwiRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkVGRkZGQUM3M1wiKTtcbiAgICB2YXIgYSA9IEJpZ0ludGVnZXIuWkVSTztcbiAgICB2YXIgYiA9IGZyb21IZXgoXCI3XCIpO1xuICAgIC8vYnl0ZVtdIFMgPSBudWxsO1xuICAgIHZhciBuID0gZnJvbUhleChcIjAxMDAwMDAwMDAwMDAwMDAwMDAwMDFCOEZBMTZERkFCOUFDQTE2QjZCM1wiKTtcbiAgICB2YXIgaCA9IEJpZ0ludGVnZXIuT05FO1xuICAgIHZhciBjdXJ2ZSA9IG5ldyBFQ0N1cnZlRnAocCwgYSwgYik7XG4gICAgdmFyIEcgPSBjdXJ2ZS5kZWNvZGVQb2ludEhleChcIjA0XCJcbiAgICAgICAgICAgICAgICArIFwiM0I0QzM4MkNFMzdBQTE5MkE0MDE5RTc2MzAzNkY0RjVERDREN0VCQlwiXG4gICAgICAgICAgICAgICAgKyBcIjkzOENGOTM1MzE4RkRDRUQ2QkMyODI4NjUzMTczM0MzRjAzQzRGRUVcIik7XG4gICAgcmV0dXJuIG5ldyBYOUVDUGFyYW1ldGVycyhjdXJ2ZSwgRywgbiwgaCk7XG59XG5cbmZ1bmN0aW9uIHNlY3AxNjByMSgpIHtcbiAgICAvLyBwID0gMl4xNjAgLSAyXjMxIC0gMVxuICAgIHZhciBwID0gZnJvbUhleChcIkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGN0ZGRkZGRkZcIik7XG4gICAgdmFyIGEgPSBmcm9tSGV4KFwiRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkY3RkZGRkZGQ1wiKTtcbiAgICB2YXIgYiA9IGZyb21IZXgoXCIxQzk3QkVGQzU0QkQ3QThCNjVBQ0Y4OUY4MUQ0RDRBREM1NjVGQTQ1XCIpO1xuICAgIC8vYnl0ZVtdIFMgPSBIZXguZGVjb2RlKFwiMTA1M0NERTQyQzE0RDY5NkU2NzY4NzU2MTUxNzUzM0JGM0Y4MzM0NVwiKTtcbiAgICB2YXIgbiA9IGZyb21IZXgoXCIwMTAwMDAwMDAwMDAwMDAwMDAwMDAxRjRDOEY5MjdBRUQzQ0E3NTIyNTdcIik7XG4gICAgdmFyIGggPSBCaWdJbnRlZ2VyLk9ORTtcbiAgICB2YXIgY3VydmUgPSBuZXcgRUNDdXJ2ZUZwKHAsIGEsIGIpO1xuICAgIHZhciBHID0gY3VydmUuZGVjb2RlUG9pbnRIZXgoXCIwNFwiXG5cdFx0KyBcIjRBOTZCNTY4OEVGNTczMjg0NjY0Njk4OTY4QzM4QkI5MTNDQkZDODJcIlxuXHRcdCsgXCIyM0E2Mjg1NTMxNjg5NDdENTlEQ0M5MTIwNDIzNTEzNzdBQzVGQjMyXCIpO1xuICAgIHJldHVybiBuZXcgWDlFQ1BhcmFtZXRlcnMoY3VydmUsIEcsIG4sIGgpO1xufVxuXG5mdW5jdGlvbiBzZWNwMTkyazEoKSB7XG4gICAgLy8gcCA9IDJeMTkyIC0gMl4zMiAtIDJeMTIgLSAyXjggLSAyXjcgLSAyXjYgLSAyXjMgLSAxXG4gICAgdmFyIHAgPSBmcm9tSGV4KFwiRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRUZGRkZFRTM3XCIpO1xuICAgIHZhciBhID0gQmlnSW50ZWdlci5aRVJPO1xuICAgIHZhciBiID0gZnJvbUhleChcIjNcIik7XG4gICAgLy9ieXRlW10gUyA9IG51bGw7XG4gICAgdmFyIG4gPSBmcm9tSGV4KFwiRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZFMjZGMkZDMTcwRjY5NDY2QTc0REVGRDhEXCIpO1xuICAgIHZhciBoID0gQmlnSW50ZWdlci5PTkU7XG4gICAgdmFyIGN1cnZlID0gbmV3IEVDQ3VydmVGcChwLCBhLCBiKTtcbiAgICB2YXIgRyA9IGN1cnZlLmRlY29kZVBvaW50SGV4KFwiMDRcIlxuICAgICAgICAgICAgICAgICsgXCJEQjRGRjEwRUMwNTdFOUFFMjZCMDdEMDI4MEI3RjQzNDFEQTVEMUIxRUFFMDZDN0RcIlxuICAgICAgICAgICAgICAgICsgXCI5QjJGMkY2RDlDNTYyOEE3ODQ0MTYzRDAxNUJFODYzNDQwODJBQTg4RDk1RTJGOURcIik7XG4gICAgcmV0dXJuIG5ldyBYOUVDUGFyYW1ldGVycyhjdXJ2ZSwgRywgbiwgaCk7XG59XG5cbmZ1bmN0aW9uIHNlY3AxOTJyMSgpIHtcbiAgICAvLyBwID0gMl4xOTIgLSAyXjY0IC0gMVxuICAgIHZhciBwID0gZnJvbUhleChcIkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZFRkZGRkZGRkZGRkZGRkZGRlwiKTtcbiAgICB2YXIgYSA9IGZyb21IZXgoXCJGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRUZGRkZGRkZGRkZGRkZGRkNcIik7XG4gICAgdmFyIGIgPSBmcm9tSGV4KFwiNjQyMTA1MTlFNTlDODBFNzBGQTdFOUFCNzIyNDMwNDlGRUI4REVFQ0MxNDZCOUIxXCIpO1xuICAgIC8vYnl0ZVtdIFMgPSBIZXguZGVjb2RlKFwiMzA0NUFFNkZDODQyMkY2NEVENTc5NTI4RDM4MTIwRUFFMTIxOTZENVwiKTtcbiAgICB2YXIgbiA9IGZyb21IZXgoXCJGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkY5OURFRjgzNjE0NkJDOUIxQjREMjI4MzFcIik7XG4gICAgdmFyIGggPSBCaWdJbnRlZ2VyLk9ORTtcbiAgICB2YXIgY3VydmUgPSBuZXcgRUNDdXJ2ZUZwKHAsIGEsIGIpO1xuICAgIHZhciBHID0gY3VydmUuZGVjb2RlUG9pbnRIZXgoXCIwNFwiXG4gICAgICAgICAgICAgICAgKyBcIjE4OERBODBFQjAzMDkwRjY3Q0JGMjBFQjQzQTE4ODAwRjRGRjBBRkQ4MkZGMTAxMlwiXG4gICAgICAgICAgICAgICAgKyBcIjA3MTkyQjk1RkZDOERBNzg2MzEwMTFFRDZCMjRDREQ1NzNGOTc3QTExRTc5NDgxMVwiKTtcbiAgICByZXR1cm4gbmV3IFg5RUNQYXJhbWV0ZXJzKGN1cnZlLCBHLCBuLCBoKTtcbn1cblxuZnVuY3Rpb24gc2VjcDIyNHIxKCkge1xuICAgIC8vIHAgPSAyXjIyNCAtIDJeOTYgKyAxXG4gICAgdmFyIHAgPSBmcm9tSGV4KFwiRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkYwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDFcIik7XG4gICAgdmFyIGEgPSBmcm9tSGV4KFwiRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkVGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkVcIik7XG4gICAgdmFyIGIgPSBmcm9tSGV4KFwiQjQwNTBBODUwQzA0QjNBQkY1NDEzMjU2NTA0NEIwQjdEN0JGRDhCQTI3MEIzOTQzMjM1NUZGQjRcIik7XG4gICAgLy9ieXRlW10gUyA9IEhleC5kZWNvZGUoXCJCRDcxMzQ0Nzk5RDVDN0ZDREM0NUI1OUZBM0I5QUI4RjZBOTQ4QkM1XCIpO1xuICAgIHZhciBuID0gZnJvbUhleChcIkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkYxNkEyRTBCOEYwM0UxM0REMjk0NTVDNUMyQTNEXCIpO1xuICAgIHZhciBoID0gQmlnSW50ZWdlci5PTkU7XG4gICAgdmFyIGN1cnZlID0gbmV3IEVDQ3VydmVGcChwLCBhLCBiKTtcbiAgICB2YXIgRyA9IGN1cnZlLmRlY29kZVBvaW50SGV4KFwiMDRcIlxuICAgICAgICAgICAgICAgICsgXCJCNzBFMENCRDZCQjRCRjdGMzIxMzkwQjk0QTAzQzFEMzU2QzIxMTIyMzQzMjgwRDYxMTVDMUQyMVwiXG4gICAgICAgICAgICAgICAgKyBcIkJEMzc2Mzg4QjVGNzIzRkI0QzIyREZFNkNENDM3NUEwNUEwNzQ3NjQ0NEQ1ODE5OTg1MDA3RTM0XCIpO1xuICAgIHJldHVybiBuZXcgWDlFQ1BhcmFtZXRlcnMoY3VydmUsIEcsIG4sIGgpO1xufVxuXG5mdW5jdGlvbiBzZWNwMjU2cjEoKSB7XG4gICAgLy8gcCA9IDJeMjI0ICgyXjMyIC0gMSkgKyAyXjE5MiArIDJeOTYgLSAxXG4gICAgdmFyIHAgPSBmcm9tSGV4KFwiRkZGRkZGRkYwMDAwMDAwMTAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMEZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRlwiKTtcbiAgICB2YXIgYSA9IGZyb21IZXgoXCJGRkZGRkZGRjAwMDAwMDAxMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZDXCIpO1xuICAgIHZhciBiID0gZnJvbUhleChcIjVBQzYzNUQ4QUEzQTkzRTdCM0VCQkQ1NTc2OTg4NkJDNjUxRDA2QjBDQzUzQjBGNjNCQ0UzQzNFMjdEMjYwNEJcIik7XG4gICAgLy9ieXRlW10gUyA9IEhleC5kZWNvZGUoXCJDNDlEMzYwODg2RTcwNDkzNkE2Njc4RTExMzlEMjZCNzgxOUY3RTkwXCIpO1xuICAgIHZhciBuID0gZnJvbUhleChcIkZGRkZGRkZGMDAwMDAwMDBGRkZGRkZGRkZGRkZGRkZGQkNFNkZBQURBNzE3OUU4NEYzQjlDQUMyRkM2MzI1NTFcIik7XG4gICAgdmFyIGggPSBCaWdJbnRlZ2VyLk9ORTtcbiAgICB2YXIgY3VydmUgPSBuZXcgRUNDdXJ2ZUZwKHAsIGEsIGIpO1xuICAgIHZhciBHID0gY3VydmUuZGVjb2RlUG9pbnRIZXgoXCIwNFwiXG4gICAgICAgICAgICAgICAgKyBcIjZCMTdEMUYyRTEyQzQyNDdGOEJDRTZFNTYzQTQ0MEYyNzcwMzdEODEyREVCMzNBMEY0QTEzOTQ1RDg5OEMyOTZcIlxuXHRcdCsgXCI0RkUzNDJFMkZFMUE3RjlCOEVFN0VCNEE3QzBGOUUxNjJCQ0UzMzU3NkIzMTVFQ0VDQkI2NDA2ODM3QkY1MUY1XCIpO1xuICAgIHJldHVybiBuZXcgWDlFQ1BhcmFtZXRlcnMoY3VydmUsIEcsIG4sIGgpO1xufVxuXG4vLyBUT0RPOiBtYWtlIHRoaXMgaW50byBhIHByb3BlciBoYXNodGFibGVcbmZ1bmN0aW9uIGdldFNFQ0N1cnZlQnlOYW1lKG5hbWUpIHtcbiAgICBpZihuYW1lID09IFwic2VjcDEyOHIxXCIpIHJldHVybiBzZWNwMTI4cjEoKTtcbiAgICBpZihuYW1lID09IFwic2VjcDE2MGsxXCIpIHJldHVybiBzZWNwMTYwazEoKTtcbiAgICBpZihuYW1lID09IFwic2VjcDE2MHIxXCIpIHJldHVybiBzZWNwMTYwcjEoKTtcbiAgICBpZihuYW1lID09IFwic2VjcDE5MmsxXCIpIHJldHVybiBzZWNwMTkyazEoKTtcbiAgICBpZihuYW1lID09IFwic2VjcDE5MnIxXCIpIHJldHVybiBzZWNwMTkycjEoKTtcbiAgICBpZihuYW1lID09IFwic2VjcDIyNHIxXCIpIHJldHVybiBzZWNwMjI0cjEoKTtcbiAgICBpZihuYW1lID09IFwic2VjcDI1NnIxXCIpIHJldHVybiBzZWNwMjU2cjEoKTtcbiAgICByZXR1cm4gbnVsbDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIFwic2VjcDEyOHIxXCI6c2VjcDEyOHIxLFxuICBcInNlY3AxNjBrMVwiOnNlY3AxNjBrMSxcbiAgXCJzZWNwMTYwcjFcIjpzZWNwMTYwcjEsXG4gIFwic2VjcDE5MmsxXCI6c2VjcDE5MmsxLFxuICBcInNlY3AxOTJyMVwiOnNlY3AxOTJyMSxcbiAgXCJzZWNwMjI0cjFcIjpzZWNwMjI0cjEsXG4gIFwic2VjcDI1NnIxXCI6c2VjcDI1NnIxXG59XG4iLCJ2YXIgY3J5cHRvID0gcmVxdWlyZShcImNyeXB0b1wiKTtcbnZhciBCaWdJbnRlZ2VyID0gcmVxdWlyZShcImpzYm5cIikuQmlnSW50ZWdlcjtcbnZhciBFQ1BvaW50RnAgPSByZXF1aXJlKFwiLi9saWIvZWMuanNcIikuRUNQb2ludEZwO1xudmFyIEJ1ZmZlciA9IHJlcXVpcmUoXCJzYWZlci1idWZmZXJcIikuQnVmZmVyO1xuZXhwb3J0cy5FQ0N1cnZlcyA9IHJlcXVpcmUoXCIuL2xpYi9zZWMuanNcIik7XG5cbi8vIHplcm8gcHJlcGFkXG5mdW5jdGlvbiB1bnN0dXBpZChoZXgsbGVuKVxue1xuXHRyZXR1cm4gKGhleC5sZW5ndGggPj0gbGVuKSA/IGhleCA6IHVuc3R1cGlkKFwiMFwiK2hleCxsZW4pO1xufVxuXG5leHBvcnRzLkVDS2V5ID0gZnVuY3Rpb24oY3VydmUsIGtleSwgaXNQdWJsaWMpXG57XG4gIHZhciBwcml2O1xuXHR2YXIgYyA9IGN1cnZlKCk7XG5cdHZhciBuID0gYy5nZXROKCk7XG4gIHZhciBieXRlcyA9IE1hdGguZmxvb3Iobi5iaXRMZW5ndGgoKS84KTtcblxuICBpZihrZXkpXG4gIHtcbiAgICBpZihpc1B1YmxpYylcbiAgICB7XG4gICAgICB2YXIgY3VydmUgPSBjLmdldEN1cnZlKCk7XG4vLyAgICAgIHZhciB4ID0ga2V5LnNsaWNlKDEsYnl0ZXMrMSk7IC8vIHNraXAgdGhlIDA0IGZvciB1bmNvbXByZXNzZWQgZm9ybWF0XG4vLyAgICAgIHZhciB5ID0ga2V5LnNsaWNlKGJ5dGVzKzEpO1xuLy8gICAgICB0aGlzLlAgPSBuZXcgRUNQb2ludEZwKGN1cnZlLFxuLy8gICAgICAgIGN1cnZlLmZyb21CaWdJbnRlZ2VyKG5ldyBCaWdJbnRlZ2VyKHgudG9TdHJpbmcoXCJoZXhcIiksIDE2KSksXG4vLyAgICAgICAgY3VydmUuZnJvbUJpZ0ludGVnZXIobmV3IEJpZ0ludGVnZXIoeS50b1N0cmluZyhcImhleFwiKSwgMTYpKSk7ICAgICAgXG4gICAgICB0aGlzLlAgPSBjdXJ2ZS5kZWNvZGVQb2ludEhleChrZXkudG9TdHJpbmcoXCJoZXhcIikpO1xuICAgIH1lbHNle1xuICAgICAgaWYoa2V5Lmxlbmd0aCAhPSBieXRlcykgcmV0dXJuIGZhbHNlO1xuICAgICAgcHJpdiA9IG5ldyBCaWdJbnRlZ2VyKGtleS50b1N0cmluZyhcImhleFwiKSwgMTYpOyAgICAgIFxuICAgIH1cbiAgfWVsc2V7XG4gICAgdmFyIG4xID0gbi5zdWJ0cmFjdChCaWdJbnRlZ2VyLk9ORSk7XG4gICAgdmFyIHIgPSBuZXcgQmlnSW50ZWdlcihjcnlwdG8ucmFuZG9tQnl0ZXMobi5iaXRMZW5ndGgoKSkpO1xuICAgIHByaXYgPSByLm1vZChuMSkuYWRkKEJpZ0ludGVnZXIuT05FKTtcbiAgICB0aGlzLlAgPSBjLmdldEcoKS5tdWx0aXBseShwcml2KTtcbiAgfVxuICBpZih0aGlzLlApXG4gIHtcbi8vICB2YXIgcHViaGV4ID0gdW5zdHVwaWQodGhpcy5QLmdldFgoKS50b0JpZ0ludGVnZXIoKS50b1N0cmluZygxNiksYnl0ZXMqMikrdW5zdHVwaWQodGhpcy5QLmdldFkoKS50b0JpZ0ludGVnZXIoKS50b1N0cmluZygxNiksYnl0ZXMqMik7XG4vLyAgdGhpcy5QdWJsaWNLZXkgPSBCdWZmZXIuZnJvbShcIjA0XCIrcHViaGV4LFwiaGV4XCIpO1xuICAgIHRoaXMuUHVibGljS2V5ID0gQnVmZmVyLmZyb20oYy5nZXRDdXJ2ZSgpLmVuY29kZUNvbXByZXNzZWRQb2ludEhleCh0aGlzLlApLFwiaGV4XCIpO1xuICB9XG4gIGlmKHByaXYpXG4gIHtcbiAgICB0aGlzLlByaXZhdGVLZXkgPSBCdWZmZXIuZnJvbSh1bnN0dXBpZChwcml2LnRvU3RyaW5nKDE2KSxieXRlcyoyKSxcImhleFwiKTtcbiAgICB0aGlzLmRlcml2ZVNoYXJlZFNlY3JldCA9IGZ1bmN0aW9uKGtleSlcbiAgICB7XG4gICAgICBpZigha2V5IHx8ICFrZXkuUCkgcmV0dXJuIGZhbHNlO1xuICAgICAgdmFyIFMgPSBrZXkuUC5tdWx0aXBseShwcml2KTtcbiAgICAgIHJldHVybiBCdWZmZXIuZnJvbSh1bnN0dXBpZChTLmdldFgoKS50b0JpZ0ludGVnZXIoKS50b1N0cmluZygxNiksYnl0ZXMqMiksXCJoZXhcIik7XG4gICB9ICAgICBcbiAgfVxufVxuXG4iLCIvLyBCYXNpYyBKYXZhc2NyaXB0IEVsbGlwdGljIEN1cnZlIGltcGxlbWVudGF0aW9uXG4vLyBQb3J0ZWQgbG9vc2VseSBmcm9tIEJvdW5jeUNhc3RsZSdzIEphdmEgRUMgY29kZVxuLy8gT25seSBGcCBjdXJ2ZXMgaW1wbGVtZW50ZWQgZm9yIG5vd1xuXG4vLyBSZXF1aXJlcyBqc2JuLmpzIGFuZCBqc2JuMi5qc1xudmFyIEJpZ0ludGVnZXIgPSByZXF1aXJlKCdqc2JuJykuQmlnSW50ZWdlclxudmFyIEJhcnJldHQgPSBCaWdJbnRlZ2VyLnByb3RvdHlwZS5CYXJyZXR0XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS1cbi8vIEVDRmllbGRFbGVtZW50RnBcblxuLy8gY29uc3RydWN0b3JcbmZ1bmN0aW9uIEVDRmllbGRFbGVtZW50RnAocSx4KSB7XG4gICAgdGhpcy54ID0geDtcbiAgICAvLyBUT0RPIGlmKHguY29tcGFyZVRvKHEpID49IDApIGVycm9yXG4gICAgdGhpcy5xID0gcTtcbn1cblxuZnVuY3Rpb24gZmVGcEVxdWFscyhvdGhlcikge1xuICAgIGlmKG90aGVyID09IHRoaXMpIHJldHVybiB0cnVlO1xuICAgIHJldHVybiAodGhpcy5xLmVxdWFscyhvdGhlci5xKSAmJiB0aGlzLnguZXF1YWxzKG90aGVyLngpKTtcbn1cblxuZnVuY3Rpb24gZmVGcFRvQmlnSW50ZWdlcigpIHtcbiAgICByZXR1cm4gdGhpcy54O1xufVxuXG5mdW5jdGlvbiBmZUZwTmVnYXRlKCkge1xuICAgIHJldHVybiBuZXcgRUNGaWVsZEVsZW1lbnRGcCh0aGlzLnEsIHRoaXMueC5uZWdhdGUoKS5tb2QodGhpcy5xKSk7XG59XG5cbmZ1bmN0aW9uIGZlRnBBZGQoYikge1xuICAgIHJldHVybiBuZXcgRUNGaWVsZEVsZW1lbnRGcCh0aGlzLnEsIHRoaXMueC5hZGQoYi50b0JpZ0ludGVnZXIoKSkubW9kKHRoaXMucSkpO1xufVxuXG5mdW5jdGlvbiBmZUZwU3VidHJhY3QoYikge1xuICAgIHJldHVybiBuZXcgRUNGaWVsZEVsZW1lbnRGcCh0aGlzLnEsIHRoaXMueC5zdWJ0cmFjdChiLnRvQmlnSW50ZWdlcigpKS5tb2QodGhpcy5xKSk7XG59XG5cbmZ1bmN0aW9uIGZlRnBNdWx0aXBseShiKSB7XG4gICAgcmV0dXJuIG5ldyBFQ0ZpZWxkRWxlbWVudEZwKHRoaXMucSwgdGhpcy54Lm11bHRpcGx5KGIudG9CaWdJbnRlZ2VyKCkpLm1vZCh0aGlzLnEpKTtcbn1cblxuZnVuY3Rpb24gZmVGcFNxdWFyZSgpIHtcbiAgICByZXR1cm4gbmV3IEVDRmllbGRFbGVtZW50RnAodGhpcy5xLCB0aGlzLnguc3F1YXJlKCkubW9kKHRoaXMucSkpO1xufVxuXG5mdW5jdGlvbiBmZUZwRGl2aWRlKGIpIHtcbiAgICByZXR1cm4gbmV3IEVDRmllbGRFbGVtZW50RnAodGhpcy5xLCB0aGlzLngubXVsdGlwbHkoYi50b0JpZ0ludGVnZXIoKS5tb2RJbnZlcnNlKHRoaXMucSkpLm1vZCh0aGlzLnEpKTtcbn1cblxuRUNGaWVsZEVsZW1lbnRGcC5wcm90b3R5cGUuZXF1YWxzID0gZmVGcEVxdWFscztcbkVDRmllbGRFbGVtZW50RnAucHJvdG90eXBlLnRvQmlnSW50ZWdlciA9IGZlRnBUb0JpZ0ludGVnZXI7XG5FQ0ZpZWxkRWxlbWVudEZwLnByb3RvdHlwZS5uZWdhdGUgPSBmZUZwTmVnYXRlO1xuRUNGaWVsZEVsZW1lbnRGcC5wcm90b3R5cGUuYWRkID0gZmVGcEFkZDtcbkVDRmllbGRFbGVtZW50RnAucHJvdG90eXBlLnN1YnRyYWN0ID0gZmVGcFN1YnRyYWN0O1xuRUNGaWVsZEVsZW1lbnRGcC5wcm90b3R5cGUubXVsdGlwbHkgPSBmZUZwTXVsdGlwbHk7XG5FQ0ZpZWxkRWxlbWVudEZwLnByb3RvdHlwZS5zcXVhcmUgPSBmZUZwU3F1YXJlO1xuRUNGaWVsZEVsZW1lbnRGcC5wcm90b3R5cGUuZGl2aWRlID0gZmVGcERpdmlkZTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLVxuLy8gRUNQb2ludEZwXG5cbi8vIGNvbnN0cnVjdG9yXG5mdW5jdGlvbiBFQ1BvaW50RnAoY3VydmUseCx5LHopIHtcbiAgICB0aGlzLmN1cnZlID0gY3VydmU7XG4gICAgdGhpcy54ID0geDtcbiAgICB0aGlzLnkgPSB5O1xuICAgIC8vIFByb2plY3RpdmUgY29vcmRpbmF0ZXM6IGVpdGhlciB6aW52ID09IG51bGwgb3IgeiAqIHppbnYgPT0gMVxuICAgIC8vIHogYW5kIHppbnYgYXJlIGp1c3QgQmlnSW50ZWdlcnMsIG5vdCBmaWVsZEVsZW1lbnRzXG4gICAgaWYoeiA9PSBudWxsKSB7XG4gICAgICB0aGlzLnogPSBCaWdJbnRlZ2VyLk9ORTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB0aGlzLnogPSB6O1xuICAgIH1cbiAgICB0aGlzLnppbnYgPSBudWxsO1xuICAgIC8vVE9ETzogY29tcHJlc3Npb24gZmxhZ1xufVxuXG5mdW5jdGlvbiBwb2ludEZwR2V0WCgpIHtcbiAgICBpZih0aGlzLnppbnYgPT0gbnVsbCkge1xuICAgICAgdGhpcy56aW52ID0gdGhpcy56Lm1vZEludmVyc2UodGhpcy5jdXJ2ZS5xKTtcbiAgICB9XG4gICAgdmFyIHIgPSB0aGlzLngudG9CaWdJbnRlZ2VyKCkubXVsdGlwbHkodGhpcy56aW52KTtcbiAgICB0aGlzLmN1cnZlLnJlZHVjZShyKTtcbiAgICByZXR1cm4gdGhpcy5jdXJ2ZS5mcm9tQmlnSW50ZWdlcihyKTtcbn1cblxuZnVuY3Rpb24gcG9pbnRGcEdldFkoKSB7XG4gICAgaWYodGhpcy56aW52ID09IG51bGwpIHtcbiAgICAgIHRoaXMuemludiA9IHRoaXMuei5tb2RJbnZlcnNlKHRoaXMuY3VydmUucSk7XG4gICAgfVxuICAgIHZhciByID0gdGhpcy55LnRvQmlnSW50ZWdlcigpLm11bHRpcGx5KHRoaXMuemludik7XG4gICAgdGhpcy5jdXJ2ZS5yZWR1Y2Uocik7XG4gICAgcmV0dXJuIHRoaXMuY3VydmUuZnJvbUJpZ0ludGVnZXIocik7XG59XG5cbmZ1bmN0aW9uIHBvaW50RnBFcXVhbHMob3RoZXIpIHtcbiAgICBpZihvdGhlciA9PSB0aGlzKSByZXR1cm4gdHJ1ZTtcbiAgICBpZih0aGlzLmlzSW5maW5pdHkoKSkgcmV0dXJuIG90aGVyLmlzSW5maW5pdHkoKTtcbiAgICBpZihvdGhlci5pc0luZmluaXR5KCkpIHJldHVybiB0aGlzLmlzSW5maW5pdHkoKTtcbiAgICB2YXIgdSwgdjtcbiAgICAvLyB1ID0gWTIgKiBaMSAtIFkxICogWjJcbiAgICB1ID0gb3RoZXIueS50b0JpZ0ludGVnZXIoKS5tdWx0aXBseSh0aGlzLnopLnN1YnRyYWN0KHRoaXMueS50b0JpZ0ludGVnZXIoKS5tdWx0aXBseShvdGhlci56KSkubW9kKHRoaXMuY3VydmUucSk7XG4gICAgaWYoIXUuZXF1YWxzKEJpZ0ludGVnZXIuWkVSTykpIHJldHVybiBmYWxzZTtcbiAgICAvLyB2ID0gWDIgKiBaMSAtIFgxICogWjJcbiAgICB2ID0gb3RoZXIueC50b0JpZ0ludGVnZXIoKS5tdWx0aXBseSh0aGlzLnopLnN1YnRyYWN0KHRoaXMueC50b0JpZ0ludGVnZXIoKS5tdWx0aXBseShvdGhlci56KSkubW9kKHRoaXMuY3VydmUucSk7XG4gICAgcmV0dXJuIHYuZXF1YWxzKEJpZ0ludGVnZXIuWkVSTyk7XG59XG5cbmZ1bmN0aW9uIHBvaW50RnBJc0luZmluaXR5KCkge1xuICAgIGlmKCh0aGlzLnggPT0gbnVsbCkgJiYgKHRoaXMueSA9PSBudWxsKSkgcmV0dXJuIHRydWU7XG4gICAgcmV0dXJuIHRoaXMuei5lcXVhbHMoQmlnSW50ZWdlci5aRVJPKSAmJiAhdGhpcy55LnRvQmlnSW50ZWdlcigpLmVxdWFscyhCaWdJbnRlZ2VyLlpFUk8pO1xufVxuXG5mdW5jdGlvbiBwb2ludEZwTmVnYXRlKCkge1xuICAgIHJldHVybiBuZXcgRUNQb2ludEZwKHRoaXMuY3VydmUsIHRoaXMueCwgdGhpcy55Lm5lZ2F0ZSgpLCB0aGlzLnopO1xufVxuXG5mdW5jdGlvbiBwb2ludEZwQWRkKGIpIHtcbiAgICBpZih0aGlzLmlzSW5maW5pdHkoKSkgcmV0dXJuIGI7XG4gICAgaWYoYi5pc0luZmluaXR5KCkpIHJldHVybiB0aGlzO1xuXG4gICAgLy8gdSA9IFkyICogWjEgLSBZMSAqIFoyXG4gICAgdmFyIHUgPSBiLnkudG9CaWdJbnRlZ2VyKCkubXVsdGlwbHkodGhpcy56KS5zdWJ0cmFjdCh0aGlzLnkudG9CaWdJbnRlZ2VyKCkubXVsdGlwbHkoYi56KSkubW9kKHRoaXMuY3VydmUucSk7XG4gICAgLy8gdiA9IFgyICogWjEgLSBYMSAqIFoyXG4gICAgdmFyIHYgPSBiLngudG9CaWdJbnRlZ2VyKCkubXVsdGlwbHkodGhpcy56KS5zdWJ0cmFjdCh0aGlzLngudG9CaWdJbnRlZ2VyKCkubXVsdGlwbHkoYi56KSkubW9kKHRoaXMuY3VydmUucSk7XG5cbiAgICBpZihCaWdJbnRlZ2VyLlpFUk8uZXF1YWxzKHYpKSB7XG4gICAgICAgIGlmKEJpZ0ludGVnZXIuWkVSTy5lcXVhbHModSkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnR3aWNlKCk7IC8vIHRoaXMgPT0gYiwgc28gZG91YmxlXG4gICAgICAgIH1cblx0cmV0dXJuIHRoaXMuY3VydmUuZ2V0SW5maW5pdHkoKTsgLy8gdGhpcyA9IC1iLCBzbyBpbmZpbml0eVxuICAgIH1cblxuICAgIHZhciBUSFJFRSA9IG5ldyBCaWdJbnRlZ2VyKFwiM1wiKTtcbiAgICB2YXIgeDEgPSB0aGlzLngudG9CaWdJbnRlZ2VyKCk7XG4gICAgdmFyIHkxID0gdGhpcy55LnRvQmlnSW50ZWdlcigpO1xuICAgIHZhciB4MiA9IGIueC50b0JpZ0ludGVnZXIoKTtcbiAgICB2YXIgeTIgPSBiLnkudG9CaWdJbnRlZ2VyKCk7XG5cbiAgICB2YXIgdjIgPSB2LnNxdWFyZSgpO1xuICAgIHZhciB2MyA9IHYyLm11bHRpcGx5KHYpO1xuICAgIHZhciB4MXYyID0geDEubXVsdGlwbHkodjIpO1xuICAgIHZhciB6dTIgPSB1LnNxdWFyZSgpLm11bHRpcGx5KHRoaXMueik7XG5cbiAgICAvLyB4MyA9IHYgKiAoejIgKiAoejEgKiB1XjIgLSAyICogeDEgKiB2XjIpIC0gdl4zKVxuICAgIHZhciB4MyA9IHp1Mi5zdWJ0cmFjdCh4MXYyLnNoaWZ0TGVmdCgxKSkubXVsdGlwbHkoYi56KS5zdWJ0cmFjdCh2MykubXVsdGlwbHkodikubW9kKHRoaXMuY3VydmUucSk7XG4gICAgLy8geTMgPSB6MiAqICgzICogeDEgKiB1ICogdl4yIC0geTEgKiB2XjMgLSB6MSAqIHVeMykgKyB1ICogdl4zXG4gICAgdmFyIHkzID0geDF2Mi5tdWx0aXBseShUSFJFRSkubXVsdGlwbHkodSkuc3VidHJhY3QoeTEubXVsdGlwbHkodjMpKS5zdWJ0cmFjdCh6dTIubXVsdGlwbHkodSkpLm11bHRpcGx5KGIueikuYWRkKHUubXVsdGlwbHkodjMpKS5tb2QodGhpcy5jdXJ2ZS5xKTtcbiAgICAvLyB6MyA9IHZeMyAqIHoxICogejJcbiAgICB2YXIgejMgPSB2My5tdWx0aXBseSh0aGlzLnopLm11bHRpcGx5KGIueikubW9kKHRoaXMuY3VydmUucSk7XG5cbiAgICByZXR1cm4gbmV3IEVDUG9pbnRGcCh0aGlzLmN1cnZlLCB0aGlzLmN1cnZlLmZyb21CaWdJbnRlZ2VyKHgzKSwgdGhpcy5jdXJ2ZS5mcm9tQmlnSW50ZWdlcih5MyksIHozKTtcbn1cblxuZnVuY3Rpb24gcG9pbnRGcFR3aWNlKCkge1xuICAgIGlmKHRoaXMuaXNJbmZpbml0eSgpKSByZXR1cm4gdGhpcztcbiAgICBpZih0aGlzLnkudG9CaWdJbnRlZ2VyKCkuc2lnbnVtKCkgPT0gMCkgcmV0dXJuIHRoaXMuY3VydmUuZ2V0SW5maW5pdHkoKTtcblxuICAgIC8vIFRPRE86IG9wdGltaXplZCBoYW5kbGluZyBvZiBjb25zdGFudHNcbiAgICB2YXIgVEhSRUUgPSBuZXcgQmlnSW50ZWdlcihcIjNcIik7XG4gICAgdmFyIHgxID0gdGhpcy54LnRvQmlnSW50ZWdlcigpO1xuICAgIHZhciB5MSA9IHRoaXMueS50b0JpZ0ludGVnZXIoKTtcblxuICAgIHZhciB5MXoxID0geTEubXVsdGlwbHkodGhpcy56KTtcbiAgICB2YXIgeTFzcXoxID0geTF6MS5tdWx0aXBseSh5MSkubW9kKHRoaXMuY3VydmUucSk7XG4gICAgdmFyIGEgPSB0aGlzLmN1cnZlLmEudG9CaWdJbnRlZ2VyKCk7XG5cbiAgICAvLyB3ID0gMyAqIHgxXjIgKyBhICogejFeMlxuICAgIHZhciB3ID0geDEuc3F1YXJlKCkubXVsdGlwbHkoVEhSRUUpO1xuICAgIGlmKCFCaWdJbnRlZ2VyLlpFUk8uZXF1YWxzKGEpKSB7XG4gICAgICB3ID0gdy5hZGQodGhpcy56LnNxdWFyZSgpLm11bHRpcGx5KGEpKTtcbiAgICB9XG4gICAgdyA9IHcubW9kKHRoaXMuY3VydmUucSk7XG4gICAgLy90aGlzLmN1cnZlLnJlZHVjZSh3KTtcbiAgICAvLyB4MyA9IDIgKiB5MSAqIHoxICogKHdeMiAtIDggKiB4MSAqIHkxXjIgKiB6MSlcbiAgICB2YXIgeDMgPSB3LnNxdWFyZSgpLnN1YnRyYWN0KHgxLnNoaWZ0TGVmdCgzKS5tdWx0aXBseSh5MXNxejEpKS5zaGlmdExlZnQoMSkubXVsdGlwbHkoeTF6MSkubW9kKHRoaXMuY3VydmUucSk7XG4gICAgLy8geTMgPSA0ICogeTFeMiAqIHoxICogKDMgKiB3ICogeDEgLSAyICogeTFeMiAqIHoxKSAtIHdeM1xuICAgIHZhciB5MyA9IHcubXVsdGlwbHkoVEhSRUUpLm11bHRpcGx5KHgxKS5zdWJ0cmFjdCh5MXNxejEuc2hpZnRMZWZ0KDEpKS5zaGlmdExlZnQoMikubXVsdGlwbHkoeTFzcXoxKS5zdWJ0cmFjdCh3LnNxdWFyZSgpLm11bHRpcGx5KHcpKS5tb2QodGhpcy5jdXJ2ZS5xKTtcbiAgICAvLyB6MyA9IDggKiAoeTEgKiB6MSleM1xuICAgIHZhciB6MyA9IHkxejEuc3F1YXJlKCkubXVsdGlwbHkoeTF6MSkuc2hpZnRMZWZ0KDMpLm1vZCh0aGlzLmN1cnZlLnEpO1xuXG4gICAgcmV0dXJuIG5ldyBFQ1BvaW50RnAodGhpcy5jdXJ2ZSwgdGhpcy5jdXJ2ZS5mcm9tQmlnSW50ZWdlcih4MyksIHRoaXMuY3VydmUuZnJvbUJpZ0ludGVnZXIoeTMpLCB6Myk7XG59XG5cbi8vIFNpbXBsZSBOQUYgKE5vbi1BZGphY2VudCBGb3JtKSBtdWx0aXBsaWNhdGlvbiBhbGdvcml0aG1cbi8vIFRPRE86IG1vZHVsYXJpemUgdGhlIG11bHRpcGxpY2F0aW9uIGFsZ29yaXRobVxuZnVuY3Rpb24gcG9pbnRGcE11bHRpcGx5KGspIHtcbiAgICBpZih0aGlzLmlzSW5maW5pdHkoKSkgcmV0dXJuIHRoaXM7XG4gICAgaWYoay5zaWdudW0oKSA9PSAwKSByZXR1cm4gdGhpcy5jdXJ2ZS5nZXRJbmZpbml0eSgpO1xuXG4gICAgdmFyIGUgPSBrO1xuICAgIHZhciBoID0gZS5tdWx0aXBseShuZXcgQmlnSW50ZWdlcihcIjNcIikpO1xuXG4gICAgdmFyIG5lZyA9IHRoaXMubmVnYXRlKCk7XG4gICAgdmFyIFIgPSB0aGlzO1xuXG4gICAgdmFyIGk7XG4gICAgZm9yKGkgPSBoLmJpdExlbmd0aCgpIC0gMjsgaSA+IDA7IC0taSkge1xuXHRSID0gUi50d2ljZSgpO1xuXG5cdHZhciBoQml0ID0gaC50ZXN0Qml0KGkpO1xuXHR2YXIgZUJpdCA9IGUudGVzdEJpdChpKTtcblxuXHRpZiAoaEJpdCAhPSBlQml0KSB7XG5cdCAgICBSID0gUi5hZGQoaEJpdCA/IHRoaXMgOiBuZWcpO1xuXHR9XG4gICAgfVxuXG4gICAgcmV0dXJuIFI7XG59XG5cbi8vIENvbXB1dGUgdGhpcypqICsgeCprIChzaW11bHRhbmVvdXMgbXVsdGlwbGljYXRpb24pXG5mdW5jdGlvbiBwb2ludEZwTXVsdGlwbHlUd28oaix4LGspIHtcbiAgdmFyIGk7XG4gIGlmKGouYml0TGVuZ3RoKCkgPiBrLmJpdExlbmd0aCgpKVxuICAgIGkgPSBqLmJpdExlbmd0aCgpIC0gMTtcbiAgZWxzZVxuICAgIGkgPSBrLmJpdExlbmd0aCgpIC0gMTtcblxuICB2YXIgUiA9IHRoaXMuY3VydmUuZ2V0SW5maW5pdHkoKTtcbiAgdmFyIGJvdGggPSB0aGlzLmFkZCh4KTtcbiAgd2hpbGUoaSA+PSAwKSB7XG4gICAgUiA9IFIudHdpY2UoKTtcbiAgICBpZihqLnRlc3RCaXQoaSkpIHtcbiAgICAgIGlmKGsudGVzdEJpdChpKSkge1xuICAgICAgICBSID0gUi5hZGQoYm90aCk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgUiA9IFIuYWRkKHRoaXMpO1xuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGlmKGsudGVzdEJpdChpKSkge1xuICAgICAgICBSID0gUi5hZGQoeCk7XG4gICAgICB9XG4gICAgfVxuICAgIC0taTtcbiAgfVxuXG4gIHJldHVybiBSO1xufVxuXG5FQ1BvaW50RnAucHJvdG90eXBlLmdldFggPSBwb2ludEZwR2V0WDtcbkVDUG9pbnRGcC5wcm90b3R5cGUuZ2V0WSA9IHBvaW50RnBHZXRZO1xuRUNQb2ludEZwLnByb3RvdHlwZS5lcXVhbHMgPSBwb2ludEZwRXF1YWxzO1xuRUNQb2ludEZwLnByb3RvdHlwZS5pc0luZmluaXR5ID0gcG9pbnRGcElzSW5maW5pdHk7XG5FQ1BvaW50RnAucHJvdG90eXBlLm5lZ2F0ZSA9IHBvaW50RnBOZWdhdGU7XG5FQ1BvaW50RnAucHJvdG90eXBlLmFkZCA9IHBvaW50RnBBZGQ7XG5FQ1BvaW50RnAucHJvdG90eXBlLnR3aWNlID0gcG9pbnRGcFR3aWNlO1xuRUNQb2ludEZwLnByb3RvdHlwZS5tdWx0aXBseSA9IHBvaW50RnBNdWx0aXBseTtcbkVDUG9pbnRGcC5wcm90b3R5cGUubXVsdGlwbHlUd28gPSBwb2ludEZwTXVsdGlwbHlUd287XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS1cbi8vIEVDQ3VydmVGcFxuXG4vLyBjb25zdHJ1Y3RvclxuZnVuY3Rpb24gRUNDdXJ2ZUZwKHEsYSxiKSB7XG4gICAgdGhpcy5xID0gcTtcbiAgICB0aGlzLmEgPSB0aGlzLmZyb21CaWdJbnRlZ2VyKGEpO1xuICAgIHRoaXMuYiA9IHRoaXMuZnJvbUJpZ0ludGVnZXIoYik7XG4gICAgdGhpcy5pbmZpbml0eSA9IG5ldyBFQ1BvaW50RnAodGhpcywgbnVsbCwgbnVsbCk7XG4gICAgdGhpcy5yZWR1Y2VyID0gbmV3IEJhcnJldHQodGhpcy5xKTtcbn1cblxuZnVuY3Rpb24gY3VydmVGcEdldFEoKSB7XG4gICAgcmV0dXJuIHRoaXMucTtcbn1cblxuZnVuY3Rpb24gY3VydmVGcEdldEEoKSB7XG4gICAgcmV0dXJuIHRoaXMuYTtcbn1cblxuZnVuY3Rpb24gY3VydmVGcEdldEIoKSB7XG4gICAgcmV0dXJuIHRoaXMuYjtcbn1cblxuZnVuY3Rpb24gY3VydmVGcEVxdWFscyhvdGhlcikge1xuICAgIGlmKG90aGVyID09IHRoaXMpIHJldHVybiB0cnVlO1xuICAgIHJldHVybih0aGlzLnEuZXF1YWxzKG90aGVyLnEpICYmIHRoaXMuYS5lcXVhbHMob3RoZXIuYSkgJiYgdGhpcy5iLmVxdWFscyhvdGhlci5iKSk7XG59XG5cbmZ1bmN0aW9uIGN1cnZlRnBHZXRJbmZpbml0eSgpIHtcbiAgICByZXR1cm4gdGhpcy5pbmZpbml0eTtcbn1cblxuZnVuY3Rpb24gY3VydmVGcEZyb21CaWdJbnRlZ2VyKHgpIHtcbiAgICByZXR1cm4gbmV3IEVDRmllbGRFbGVtZW50RnAodGhpcy5xLCB4KTtcbn1cblxuZnVuY3Rpb24gY3VydmVSZWR1Y2UoeCkge1xuICAgIHRoaXMucmVkdWNlci5yZWR1Y2UoeCk7XG59XG5cbi8vIGZvciBub3csIHdvcmsgd2l0aCBoZXggc3RyaW5ncyBiZWNhdXNlIHRoZXkncmUgZWFzaWVyIGluIEpTXG5mdW5jdGlvbiBjdXJ2ZUZwRGVjb2RlUG9pbnRIZXgocykge1xuICAgIHN3aXRjaChwYXJzZUludChzLnN1YnN0cigwLDIpLCAxNikpIHsgLy8gZmlyc3QgYnl0ZVxuICAgIGNhc2UgMDpcblx0cmV0dXJuIHRoaXMuaW5maW5pdHk7XG4gICAgY2FzZSAyOlxuICAgIGNhc2UgMzpcblx0Ly8gcG9pbnQgY29tcHJlc3Npb24gbm90IHN1cHBvcnRlZCB5ZXRcblx0cmV0dXJuIG51bGw7XG4gICAgY2FzZSA0OlxuICAgIGNhc2UgNjpcbiAgICBjYXNlIDc6XG5cdHZhciBsZW4gPSAocy5sZW5ndGggLSAyKSAvIDI7XG5cdHZhciB4SGV4ID0gcy5zdWJzdHIoMiwgbGVuKTtcblx0dmFyIHlIZXggPSBzLnN1YnN0cihsZW4rMiwgbGVuKTtcblxuXHRyZXR1cm4gbmV3IEVDUG9pbnRGcCh0aGlzLFxuXHRcdFx0ICAgICB0aGlzLmZyb21CaWdJbnRlZ2VyKG5ldyBCaWdJbnRlZ2VyKHhIZXgsIDE2KSksXG5cdFx0XHQgICAgIHRoaXMuZnJvbUJpZ0ludGVnZXIobmV3IEJpZ0ludGVnZXIoeUhleCwgMTYpKSk7XG5cbiAgICBkZWZhdWx0OiAvLyB1bnN1cHBvcnRlZFxuXHRyZXR1cm4gbnVsbDtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGN1cnZlRnBFbmNvZGVQb2ludEhleChwKSB7XG5cdGlmIChwLmlzSW5maW5pdHkoKSkgcmV0dXJuIFwiMDBcIjtcblx0dmFyIHhIZXggPSBwLmdldFgoKS50b0JpZ0ludGVnZXIoKS50b1N0cmluZygxNik7XG5cdHZhciB5SGV4ID0gcC5nZXRZKCkudG9CaWdJbnRlZ2VyKCkudG9TdHJpbmcoMTYpO1xuXHR2YXIgb0xlbiA9IHRoaXMuZ2V0USgpLnRvU3RyaW5nKDE2KS5sZW5ndGg7XG5cdGlmICgob0xlbiAlIDIpICE9IDApIG9MZW4rKztcblx0d2hpbGUgKHhIZXgubGVuZ3RoIDwgb0xlbikge1xuXHRcdHhIZXggPSBcIjBcIiArIHhIZXg7XG5cdH1cblx0d2hpbGUgKHlIZXgubGVuZ3RoIDwgb0xlbikge1xuXHRcdHlIZXggPSBcIjBcIiArIHlIZXg7XG5cdH1cblx0cmV0dXJuIFwiMDRcIiArIHhIZXggKyB5SGV4O1xufVxuXG5FQ0N1cnZlRnAucHJvdG90eXBlLmdldFEgPSBjdXJ2ZUZwR2V0UTtcbkVDQ3VydmVGcC5wcm90b3R5cGUuZ2V0QSA9IGN1cnZlRnBHZXRBO1xuRUNDdXJ2ZUZwLnByb3RvdHlwZS5nZXRCID0gY3VydmVGcEdldEI7XG5FQ0N1cnZlRnAucHJvdG90eXBlLmVxdWFscyA9IGN1cnZlRnBFcXVhbHM7XG5FQ0N1cnZlRnAucHJvdG90eXBlLmdldEluZmluaXR5ID0gY3VydmVGcEdldEluZmluaXR5O1xuRUNDdXJ2ZUZwLnByb3RvdHlwZS5mcm9tQmlnSW50ZWdlciA9IGN1cnZlRnBGcm9tQmlnSW50ZWdlcjtcbkVDQ3VydmVGcC5wcm90b3R5cGUucmVkdWNlID0gY3VydmVSZWR1Y2U7XG4vL0VDQ3VydmVGcC5wcm90b3R5cGUuZGVjb2RlUG9pbnRIZXggPSBjdXJ2ZUZwRGVjb2RlUG9pbnRIZXg7XG5FQ0N1cnZlRnAucHJvdG90eXBlLmVuY29kZVBvaW50SGV4ID0gY3VydmVGcEVuY29kZVBvaW50SGV4O1xuXG4vLyBmcm9tOiBodHRwczovL2dpdGh1Yi5jb20va2FpZWx2aW4vanNibi1lYy1wb2ludC1jb21wcmVzc2lvblxuRUNDdXJ2ZUZwLnByb3RvdHlwZS5kZWNvZGVQb2ludEhleCA9IGZ1bmN0aW9uKHMpXG57XG5cdHZhciB5SXNFdmVuO1xuICAgIHN3aXRjaChwYXJzZUludChzLnN1YnN0cigwLDIpLCAxNikpIHsgLy8gZmlyc3QgYnl0ZVxuICAgIGNhc2UgMDpcblx0cmV0dXJuIHRoaXMuaW5maW5pdHk7XG4gICAgY2FzZSAyOlxuXHR5SXNFdmVuID0gZmFsc2U7XG4gICAgY2FzZSAzOlxuXHRpZih5SXNFdmVuID09IHVuZGVmaW5lZCkgeUlzRXZlbiA9IHRydWU7XG5cdHZhciBsZW4gPSBzLmxlbmd0aCAtIDI7XG5cdHZhciB4SGV4ID0gcy5zdWJzdHIoMiwgbGVuKTtcblx0dmFyIHggPSB0aGlzLmZyb21CaWdJbnRlZ2VyKG5ldyBCaWdJbnRlZ2VyKHhIZXgsMTYpKTtcblx0dmFyIGFscGhhID0geC5tdWx0aXBseSh4LnNxdWFyZSgpLmFkZCh0aGlzLmdldEEoKSkpLmFkZCh0aGlzLmdldEIoKSk7XG5cdHZhciBiZXRhID0gYWxwaGEuc3FydCgpO1xuXG4gICAgaWYgKGJldGEgPT0gbnVsbCkgdGhyb3cgXCJJbnZhbGlkIHBvaW50IGNvbXByZXNzaW9uXCI7XG5cbiAgICB2YXIgYmV0YVZhbHVlID0gYmV0YS50b0JpZ0ludGVnZXIoKTtcbiAgICBpZiAoYmV0YVZhbHVlLnRlc3RCaXQoMCkgIT0geUlzRXZlbilcbiAgICB7XG4gICAgICAgIC8vIFVzZSB0aGUgb3RoZXIgcm9vdFxuICAgICAgICBiZXRhID0gdGhpcy5mcm9tQmlnSW50ZWdlcih0aGlzLmdldFEoKS5zdWJ0cmFjdChiZXRhVmFsdWUpKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBFQ1BvaW50RnAodGhpcyx4LGJldGEpO1xuICAgIGNhc2UgNDpcbiAgICBjYXNlIDY6XG4gICAgY2FzZSA3OlxuXHR2YXIgbGVuID0gKHMubGVuZ3RoIC0gMikgLyAyO1xuXHR2YXIgeEhleCA9IHMuc3Vic3RyKDIsIGxlbik7XG5cdHZhciB5SGV4ID0gcy5zdWJzdHIobGVuKzIsIGxlbik7XG5cblx0cmV0dXJuIG5ldyBFQ1BvaW50RnAodGhpcyxcblx0XHRcdCAgICAgdGhpcy5mcm9tQmlnSW50ZWdlcihuZXcgQmlnSW50ZWdlcih4SGV4LCAxNikpLFxuXHRcdFx0ICAgICB0aGlzLmZyb21CaWdJbnRlZ2VyKG5ldyBCaWdJbnRlZ2VyKHlIZXgsIDE2KSkpO1xuXG4gICAgZGVmYXVsdDogLy8gdW5zdXBwb3J0ZWRcblx0cmV0dXJuIG51bGw7XG4gICAgfVxufVxuRUNDdXJ2ZUZwLnByb3RvdHlwZS5lbmNvZGVDb21wcmVzc2VkUG9pbnRIZXggPSBmdW5jdGlvbihwKVxue1xuXHRpZiAocC5pc0luZmluaXR5KCkpIHJldHVybiBcIjAwXCI7XG5cdHZhciB4SGV4ID0gcC5nZXRYKCkudG9CaWdJbnRlZ2VyKCkudG9TdHJpbmcoMTYpO1xuXHR2YXIgb0xlbiA9IHRoaXMuZ2V0USgpLnRvU3RyaW5nKDE2KS5sZW5ndGg7XG5cdGlmICgob0xlbiAlIDIpICE9IDApIG9MZW4rKztcblx0d2hpbGUgKHhIZXgubGVuZ3RoIDwgb0xlbilcblx0XHR4SGV4ID0gXCIwXCIgKyB4SGV4O1xuXHR2YXIgeVByZWZpeDtcblx0aWYocC5nZXRZKCkudG9CaWdJbnRlZ2VyKCkuaXNFdmVuKCkpIHlQcmVmaXggPSBcIjAyXCI7XG5cdGVsc2UgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB5UHJlZml4ID0gXCIwM1wiO1xuXG5cdHJldHVybiB5UHJlZml4ICsgeEhleDtcbn1cblxuXG5FQ0ZpZWxkRWxlbWVudEZwLnByb3RvdHlwZS5nZXRSID0gZnVuY3Rpb24oKVxue1xuXHRpZih0aGlzLnIgIT0gdW5kZWZpbmVkKSByZXR1cm4gdGhpcy5yO1xuXG4gICAgdGhpcy5yID0gbnVsbDtcbiAgICB2YXIgYml0TGVuZ3RoID0gdGhpcy5xLmJpdExlbmd0aCgpO1xuICAgIGlmIChiaXRMZW5ndGggPiAxMjgpXG4gICAge1xuICAgICAgICB2YXIgZmlyc3RXb3JkID0gdGhpcy5xLnNoaWZ0UmlnaHQoYml0TGVuZ3RoIC0gNjQpO1xuICAgICAgICBpZiAoZmlyc3RXb3JkLmludFZhbHVlKCkgPT0gLTEpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuciA9IEJpZ0ludGVnZXIuT05FLnNoaWZ0TGVmdChiaXRMZW5ndGgpLnN1YnRyYWN0KHRoaXMucSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXMucjtcbn1cbkVDRmllbGRFbGVtZW50RnAucHJvdG90eXBlLm1vZE11bHQgPSBmdW5jdGlvbih4MSx4MilcbntcbiAgICByZXR1cm4gdGhpcy5tb2RSZWR1Y2UoeDEubXVsdGlwbHkoeDIpKTtcbn1cbkVDRmllbGRFbGVtZW50RnAucHJvdG90eXBlLm1vZFJlZHVjZSA9IGZ1bmN0aW9uKHgpXG57XG4gICAgaWYgKHRoaXMuZ2V0UigpICE9IG51bGwpXG4gICAge1xuICAgICAgICB2YXIgcUxlbiA9IHEuYml0TGVuZ3RoKCk7XG4gICAgICAgIHdoaWxlICh4LmJpdExlbmd0aCgpID4gKHFMZW4gKyAxKSlcbiAgICAgICAge1xuICAgICAgICAgICAgdmFyIHUgPSB4LnNoaWZ0UmlnaHQocUxlbik7XG4gICAgICAgICAgICB2YXIgdiA9IHguc3VidHJhY3QodS5zaGlmdExlZnQocUxlbikpO1xuICAgICAgICAgICAgaWYgKCF0aGlzLmdldFIoKS5lcXVhbHMoQmlnSW50ZWdlci5PTkUpKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHUgPSB1Lm11bHRpcGx5KHRoaXMuZ2V0UigpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHggPSB1LmFkZCh2KTsgXG4gICAgICAgIH1cbiAgICAgICAgd2hpbGUgKHguY29tcGFyZVRvKHEpID49IDApXG4gICAgICAgIHtcbiAgICAgICAgICAgIHggPSB4LnN1YnRyYWN0KHEpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2VcbiAgICB7XG4gICAgICAgIHggPSB4Lm1vZChxKTtcbiAgICB9XG4gICAgcmV0dXJuIHg7XG59XG5FQ0ZpZWxkRWxlbWVudEZwLnByb3RvdHlwZS5zcXJ0ID0gZnVuY3Rpb24oKVxue1xuICAgIGlmICghdGhpcy5xLnRlc3RCaXQoMCkpIHRocm93IFwidW5zdXBwb3J0ZWRcIjtcblxuICAgIC8vIHAgbW9kIDQgPT0gM1xuICAgIGlmICh0aGlzLnEudGVzdEJpdCgxKSlcbiAgICB7XG4gICAgXHR2YXIgeiA9IG5ldyBFQ0ZpZWxkRWxlbWVudEZwKHRoaXMucSx0aGlzLngubW9kUG93KHRoaXMucS5zaGlmdFJpZ2h0KDIpLmFkZChCaWdJbnRlZ2VyLk9ORSksdGhpcy5xKSk7XG4gICAgXHRyZXR1cm4gei5zcXVhcmUoKS5lcXVhbHModGhpcykgPyB6IDogbnVsbDtcbiAgICB9XG5cbiAgICAvLyBwIG1vZCA0ID09IDFcbiAgICB2YXIgcU1pbnVzT25lID0gdGhpcy5xLnN1YnRyYWN0KEJpZ0ludGVnZXIuT05FKTtcblxuICAgIHZhciBsZWdlbmRyZUV4cG9uZW50ID0gcU1pbnVzT25lLnNoaWZ0UmlnaHQoMSk7XG4gICAgaWYgKCEodGhpcy54Lm1vZFBvdyhsZWdlbmRyZUV4cG9uZW50LCB0aGlzLnEpLmVxdWFscyhCaWdJbnRlZ2VyLk9ORSkpKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgdmFyIHUgPSBxTWludXNPbmUuc2hpZnRSaWdodCgyKTtcbiAgICB2YXIgayA9IHUuc2hpZnRMZWZ0KDEpLmFkZChCaWdJbnRlZ2VyLk9ORSk7XG5cbiAgICB2YXIgUSA9IHRoaXMueDtcbiAgICB2YXIgZm91clEgPSBtb2REb3VibGUobW9kRG91YmxlKFEpKTtcblxuICAgIHZhciBVLCBWO1xuICAgIGRvXG4gICAge1xuICAgICAgICB2YXIgUDtcbiAgICAgICAgZG9cbiAgICAgICAge1xuICAgICAgICAgICAgUCA9IG5ldyBCaWdJbnRlZ2VyKHRoaXMucS5iaXRMZW5ndGgoKSwgbmV3IFNlY3VyZVJhbmRvbSgpKTtcbiAgICAgICAgfVxuICAgICAgICB3aGlsZSAoUC5jb21wYXJlVG8odGhpcy5xKSA+PSAwXG4gICAgICAgICAgICB8fCAhKFAubXVsdGlwbHkoUCkuc3VidHJhY3QoZm91clEpLm1vZFBvdyhsZWdlbmRyZUV4cG9uZW50LCB0aGlzLnEpLmVxdWFscyhxTWludXNPbmUpKSk7XG5cbiAgICAgICAgdmFyIHJlc3VsdCA9IHRoaXMubHVjYXNTZXF1ZW5jZShQLCBRLCBrKTtcbiAgICAgICAgVSA9IHJlc3VsdFswXTtcbiAgICAgICAgViA9IHJlc3VsdFsxXTtcblxuICAgICAgICBpZiAodGhpcy5tb2RNdWx0KFYsIFYpLmVxdWFscyhmb3VyUSkpXG4gICAgICAgIHtcbiAgICAgICAgICAgIC8vIEludGVnZXIgZGl2aXNpb24gYnkgMiwgbW9kIHFcbiAgICAgICAgICAgIGlmIChWLnRlc3RCaXQoMCkpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgViA9IFYuYWRkKHEpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBWID0gVi5zaGlmdFJpZ2h0KDEpO1xuXG4gICAgICAgICAgICByZXR1cm4gbmV3IEVDRmllbGRFbGVtZW50RnAocSxWKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICB3aGlsZSAoVS5lcXVhbHMoQmlnSW50ZWdlci5PTkUpIHx8IFUuZXF1YWxzKHFNaW51c09uZSkpO1xuXG4gICAgcmV0dXJuIG51bGw7XG59XG5FQ0ZpZWxkRWxlbWVudEZwLnByb3RvdHlwZS5sdWNhc1NlcXVlbmNlID0gZnVuY3Rpb24oUCxRLGspXG57XG4gICAgdmFyIG4gPSBrLmJpdExlbmd0aCgpO1xuICAgIHZhciBzID0gay5nZXRMb3dlc3RTZXRCaXQoKTtcblxuICAgIHZhciBVaCA9IEJpZ0ludGVnZXIuT05FO1xuICAgIHZhciBWbCA9IEJpZ0ludGVnZXIuVFdPO1xuICAgIHZhciBWaCA9IFA7XG4gICAgdmFyIFFsID0gQmlnSW50ZWdlci5PTkU7XG4gICAgdmFyIFFoID0gQmlnSW50ZWdlci5PTkU7XG5cbiAgICBmb3IgKHZhciBqID0gbiAtIDE7IGogPj0gcyArIDE7IC0tailcbiAgICB7XG4gICAgICAgIFFsID0gdGhpcy5tb2RNdWx0KFFsLCBRaCk7XG5cbiAgICAgICAgaWYgKGsudGVzdEJpdChqKSlcbiAgICAgICAge1xuICAgICAgICAgICAgUWggPSB0aGlzLm1vZE11bHQoUWwsIFEpO1xuICAgICAgICAgICAgVWggPSB0aGlzLm1vZE11bHQoVWgsIFZoKTtcbiAgICAgICAgICAgIFZsID0gdGhpcy5tb2RSZWR1Y2UoVmgubXVsdGlwbHkoVmwpLnN1YnRyYWN0KFAubXVsdGlwbHkoUWwpKSk7XG4gICAgICAgICAgICBWaCA9IHRoaXMubW9kUmVkdWNlKFZoLm11bHRpcGx5KFZoKS5zdWJ0cmFjdChRaC5zaGlmdExlZnQoMSkpKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgIHtcbiAgICAgICAgICAgIFFoID0gUWw7XG4gICAgICAgICAgICBVaCA9IHRoaXMubW9kUmVkdWNlKFVoLm11bHRpcGx5KFZsKS5zdWJ0cmFjdChRbCkpO1xuICAgICAgICAgICAgVmggPSB0aGlzLm1vZFJlZHVjZShWaC5tdWx0aXBseShWbCkuc3VidHJhY3QoUC5tdWx0aXBseShRbCkpKTtcbiAgICAgICAgICAgIFZsID0gdGhpcy5tb2RSZWR1Y2UoVmwubXVsdGlwbHkoVmwpLnN1YnRyYWN0KFFsLnNoaWZ0TGVmdCgxKSkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgUWwgPSB0aGlzLm1vZE11bHQoUWwsIFFoKTtcbiAgICBRaCA9IHRoaXMubW9kTXVsdChRbCwgUSk7XG4gICAgVWggPSB0aGlzLm1vZFJlZHVjZShVaC5tdWx0aXBseShWbCkuc3VidHJhY3QoUWwpKTtcbiAgICBWbCA9IHRoaXMubW9kUmVkdWNlKFZoLm11bHRpcGx5KFZsKS5zdWJ0cmFjdChQLm11bHRpcGx5KFFsKSkpO1xuICAgIFFsID0gdGhpcy5tb2RNdWx0KFFsLCBRaCk7XG5cbiAgICBmb3IgKHZhciBqID0gMTsgaiA8PSBzOyArK2opXG4gICAge1xuICAgICAgICBVaCA9IHRoaXMubW9kTXVsdChVaCwgVmwpO1xuICAgICAgICBWbCA9IHRoaXMubW9kUmVkdWNlKFZsLm11bHRpcGx5KFZsKS5zdWJ0cmFjdChRbC5zaGlmdExlZnQoMSkpKTtcbiAgICAgICAgUWwgPSB0aGlzLm1vZE11bHQoUWwsIFFsKTtcbiAgICB9XG5cbiAgICByZXR1cm4gWyBVaCwgVmwgXTtcbn1cblxudmFyIGV4cG9ydHMgPSB7XG4gIEVDQ3VydmVGcDogRUNDdXJ2ZUZwLFxuICBFQ1BvaW50RnA6IEVDUG9pbnRGcCxcbiAgRUNGaWVsZEVsZW1lbnRGcDogRUNGaWVsZEVsZW1lbnRGcFxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNcbiJdLCJzb3VyY2VSb290IjoiIn0=