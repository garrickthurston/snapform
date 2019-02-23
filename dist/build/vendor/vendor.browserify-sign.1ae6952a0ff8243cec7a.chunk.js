(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["vendor/vendor.browserify-sign"],{

/***/ "EW2V":
/*!***********************************************!*\
  !*** ./node_modules/browserify-sign/algos.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./browser/algorithms.json */ "tOiH")


/***/ }),

/***/ "b+dc":
/*!******************************************************!*\
  !*** ./node_modules/browserify-sign/browser/sign.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer) {// much of this based on https://github.com/indutny/self-signed/blob/gh-pages/lib/rsa.js
var createHmac = __webpack_require__(/*! create-hmac */ "Giow")
var crt = __webpack_require__(/*! browserify-rsa */ "qVij")
var EC = __webpack_require__(/*! elliptic */ "MzeL").ec
var BN = __webpack_require__(/*! bn.js */ "OZ/i")
var parseKeys = __webpack_require__(/*! parse-asn1 */ "Ku4m")
var curves = __webpack_require__(/*! ./curves.json */ "zZGF")

function sign (hash, key, hashType, signType, tag) {
  var priv = parseKeys(key)
  if (priv.curve) {
    // rsa keys can be interpreted as ecdsa ones in openssl
    if (signType !== 'ecdsa' && signType !== 'ecdsa/rsa') throw new Error('wrong private key type')
    return ecSign(hash, priv)
  } else if (priv.type === 'dsa') {
    if (signType !== 'dsa') throw new Error('wrong private key type')
    return dsaSign(hash, priv, hashType)
  } else {
    if (signType !== 'rsa' && signType !== 'ecdsa/rsa') throw new Error('wrong private key type')
  }
  hash = Buffer.concat([tag, hash])
  var len = priv.modulus.byteLength()
  var pad = [ 0, 1 ]
  while (hash.length + pad.length + 1 < len) pad.push(0xff)
  pad.push(0x00)
  var i = -1
  while (++i < hash.length) pad.push(hash[i])

  var out = crt(pad, priv)
  return out
}

function ecSign (hash, priv) {
  var curveId = curves[priv.curve.join('.')]
  if (!curveId) throw new Error('unknown curve ' + priv.curve.join('.'))

  var curve = new EC(curveId)
  var key = curve.keyFromPrivate(priv.privateKey)
  var out = key.sign(hash)

  return new Buffer(out.toDER())
}

function dsaSign (hash, priv, algo) {
  var x = priv.params.priv_key
  var p = priv.params.p
  var q = priv.params.q
  var g = priv.params.g
  var r = new BN(0)
  var k
  var H = bits2int(hash, q).mod(q)
  var s = false
  var kv = getKey(x, q, hash, algo)
  while (s === false) {
    k = makeKey(q, kv, algo)
    r = makeR(g, k, p, q)
    s = k.invm(q).imul(H.add(x.mul(r))).mod(q)
    if (s.cmpn(0) === 0) {
      s = false
      r = new BN(0)
    }
  }
  return toDER(r, s)
}

function toDER (r, s) {
  r = r.toArray()
  s = s.toArray()

  // Pad values
  if (r[0] & 0x80) r = [ 0 ].concat(r)
  if (s[0] & 0x80) s = [ 0 ].concat(s)

  var total = r.length + s.length + 4
  var res = [ 0x30, total, 0x02, r.length ]
  res = res.concat(r, [ 0x02, s.length ], s)
  return new Buffer(res)
}

function getKey (x, q, hash, algo) {
  x = new Buffer(x.toArray())
  if (x.length < q.byteLength()) {
    var zeros = new Buffer(q.byteLength() - x.length)
    zeros.fill(0)
    x = Buffer.concat([ zeros, x ])
  }
  var hlen = hash.length
  var hbits = bits2octets(hash, q)
  var v = new Buffer(hlen)
  v.fill(1)
  var k = new Buffer(hlen)
  k.fill(0)
  k = createHmac(algo, k).update(v).update(new Buffer([ 0 ])).update(x).update(hbits).digest()
  v = createHmac(algo, k).update(v).digest()
  k = createHmac(algo, k).update(v).update(new Buffer([ 1 ])).update(x).update(hbits).digest()
  v = createHmac(algo, k).update(v).digest()
  return { k: k, v: v }
}

function bits2int (obits, q) {
  var bits = new BN(obits)
  var shift = (obits.length << 3) - q.bitLength()
  if (shift > 0) bits.ishrn(shift)
  return bits
}

function bits2octets (bits, q) {
  bits = bits2int(bits, q)
  bits = bits.mod(q)
  var out = new Buffer(bits.toArray())
  if (out.length < q.byteLength()) {
    var zeros = new Buffer(q.byteLength() - out.length)
    zeros.fill(0)
    out = Buffer.concat([ zeros, out ])
  }
  return out
}

function makeKey (q, kv, algo) {
  var t
  var k

  do {
    t = new Buffer(0)

    while (t.length * 8 < q.bitLength()) {
      kv.v = createHmac(algo, kv.k).update(kv.v).digest()
      t = Buffer.concat([ t, kv.v ])
    }

    k = bits2int(t, q)
    kv.k = createHmac(algo, kv.k).update(kv.v).update(new Buffer([ 0 ])).digest()
    kv.v = createHmac(algo, kv.k).update(kv.v).digest()
  } while (k.cmp(q) !== -1)

  return k
}

function makeR (g, k, p, q) {
  return g.toRed(BN.mont(p)).redPow(k).fromRed().mod(q)
}

module.exports = sign
module.exports.getKey = getKey
module.exports.makeKey = makeKey

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../buffer/index.js */ "tjlA").Buffer))

/***/ }),

/***/ "mAz1":
/*!********************************************************!*\
  !*** ./node_modules/browserify-sign/browser/verify.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer) {// much of this based on https://github.com/indutny/self-signed/blob/gh-pages/lib/rsa.js
var BN = __webpack_require__(/*! bn.js */ "OZ/i")
var EC = __webpack_require__(/*! elliptic */ "MzeL").ec
var parseKeys = __webpack_require__(/*! parse-asn1 */ "Ku4m")
var curves = __webpack_require__(/*! ./curves.json */ "zZGF")

function verify (sig, hash, key, signType, tag) {
  var pub = parseKeys(key)
  if (pub.type === 'ec') {
    // rsa keys can be interpreted as ecdsa ones in openssl
    if (signType !== 'ecdsa' && signType !== 'ecdsa/rsa') throw new Error('wrong public key type')
    return ecVerify(sig, hash, pub)
  } else if (pub.type === 'dsa') {
    if (signType !== 'dsa') throw new Error('wrong public key type')
    return dsaVerify(sig, hash, pub)
  } else {
    if (signType !== 'rsa' && signType !== 'ecdsa/rsa') throw new Error('wrong public key type')
  }
  hash = Buffer.concat([tag, hash])
  var len = pub.modulus.byteLength()
  var pad = [ 1 ]
  var padNum = 0
  while (hash.length + pad.length + 2 < len) {
    pad.push(0xff)
    padNum++
  }
  pad.push(0x00)
  var i = -1
  while (++i < hash.length) {
    pad.push(hash[i])
  }
  pad = new Buffer(pad)
  var red = BN.mont(pub.modulus)
  sig = new BN(sig).toRed(red)

  sig = sig.redPow(new BN(pub.publicExponent))
  sig = new Buffer(sig.fromRed().toArray())
  var out = padNum < 8 ? 1 : 0
  len = Math.min(sig.length, pad.length)
  if (sig.length !== pad.length) out = 1

  i = -1
  while (++i < len) out |= sig[i] ^ pad[i]
  return out === 0
}

function ecVerify (sig, hash, pub) {
  var curveId = curves[pub.data.algorithm.curve.join('.')]
  if (!curveId) throw new Error('unknown curve ' + pub.data.algorithm.curve.join('.'))

  var curve = new EC(curveId)
  var pubkey = pub.data.subjectPrivateKey.data

  return curve.verify(hash, sig, pubkey)
}

function dsaVerify (sig, hash, pub) {
  var p = pub.data.p
  var q = pub.data.q
  var g = pub.data.g
  var y = pub.data.pub_key
  var unpacked = parseKeys.signature.decode(sig, 'der')
  var s = unpacked.s
  var r = unpacked.r
  checkValue(s, q)
  checkValue(r, q)
  var montp = BN.mont(p)
  var w = s.invm(q)
  var v = g.toRed(montp)
    .redPow(new BN(hash).mul(w).mod(q))
    .fromRed()
    .mul(y.toRed(montp).redPow(r.mul(w).mod(q)).fromRed())
    .mod(p)
    .mod(q)
  return v.cmp(r) === 0
}

function checkValue (b, q) {
  if (b.cmpn(0) <= 0) throw new Error('invalid sig')
  if (b.cmp(q) >= q) throw new Error('invalid sig')
}

module.exports = verify

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../buffer/index.js */ "tjlA").Buffer))

/***/ }),

/***/ "tOiH":
/*!**************************************************************!*\
  !*** ./node_modules/browserify-sign/browser/algorithms.json ***!
  \**************************************************************/
/*! exports provided: sha224WithRSAEncryption, RSA-SHA224, sha256WithRSAEncryption, RSA-SHA256, sha384WithRSAEncryption, RSA-SHA384, sha512WithRSAEncryption, RSA-SHA512, RSA-SHA1, ecdsa-with-SHA1, sha256, sha224, sha384, sha512, DSA-SHA, DSA-SHA1, DSA, DSA-WITH-SHA224, DSA-SHA224, DSA-WITH-SHA256, DSA-SHA256, DSA-WITH-SHA384, DSA-SHA384, DSA-WITH-SHA512, DSA-SHA512, DSA-RIPEMD160, ripemd160WithRSA, RSA-RIPEMD160, md5WithRSAEncryption, RSA-MD5, default */
/***/ (function(module) {

module.exports = {"sha224WithRSAEncryption":{"sign":"rsa","hash":"sha224","id":"302d300d06096086480165030402040500041c"},"RSA-SHA224":{"sign":"ecdsa/rsa","hash":"sha224","id":"302d300d06096086480165030402040500041c"},"sha256WithRSAEncryption":{"sign":"rsa","hash":"sha256","id":"3031300d060960864801650304020105000420"},"RSA-SHA256":{"sign":"ecdsa/rsa","hash":"sha256","id":"3031300d060960864801650304020105000420"},"sha384WithRSAEncryption":{"sign":"rsa","hash":"sha384","id":"3041300d060960864801650304020205000430"},"RSA-SHA384":{"sign":"ecdsa/rsa","hash":"sha384","id":"3041300d060960864801650304020205000430"},"sha512WithRSAEncryption":{"sign":"rsa","hash":"sha512","id":"3051300d060960864801650304020305000440"},"RSA-SHA512":{"sign":"ecdsa/rsa","hash":"sha512","id":"3051300d060960864801650304020305000440"},"RSA-SHA1":{"sign":"rsa","hash":"sha1","id":"3021300906052b0e03021a05000414"},"ecdsa-with-SHA1":{"sign":"ecdsa","hash":"sha1","id":""},"sha256":{"sign":"ecdsa","hash":"sha256","id":""},"sha224":{"sign":"ecdsa","hash":"sha224","id":""},"sha384":{"sign":"ecdsa","hash":"sha384","id":""},"sha512":{"sign":"ecdsa","hash":"sha512","id":""},"DSA-SHA":{"sign":"dsa","hash":"sha1","id":""},"DSA-SHA1":{"sign":"dsa","hash":"sha1","id":""},"DSA":{"sign":"dsa","hash":"sha1","id":""},"DSA-WITH-SHA224":{"sign":"dsa","hash":"sha224","id":""},"DSA-SHA224":{"sign":"dsa","hash":"sha224","id":""},"DSA-WITH-SHA256":{"sign":"dsa","hash":"sha256","id":""},"DSA-SHA256":{"sign":"dsa","hash":"sha256","id":""},"DSA-WITH-SHA384":{"sign":"dsa","hash":"sha384","id":""},"DSA-SHA384":{"sign":"dsa","hash":"sha384","id":""},"DSA-WITH-SHA512":{"sign":"dsa","hash":"sha512","id":""},"DSA-SHA512":{"sign":"dsa","hash":"sha512","id":""},"DSA-RIPEMD160":{"sign":"dsa","hash":"rmd160","id":""},"ripemd160WithRSA":{"sign":"rsa","hash":"rmd160","id":"3021300906052b2403020105000414"},"RSA-RIPEMD160":{"sign":"rsa","hash":"rmd160","id":"3021300906052b2403020105000414"},"md5WithRSAEncryption":{"sign":"rsa","hash":"md5","id":"3020300c06082a864886f70d020505000410"},"RSA-MD5":{"sign":"rsa","hash":"md5","id":"3020300c06082a864886f70d020505000410"}};

/***/ }),

/***/ "tpL1":
/*!*******************************************************!*\
  !*** ./node_modules/browserify-sign/browser/index.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer) {var createHash = __webpack_require__(/*! create-hash */ "mObS")
var stream = __webpack_require__(/*! stream */ "1IWx")
var inherits = __webpack_require__(/*! inherits */ "P7XM")
var sign = __webpack_require__(/*! ./sign */ "b+dc")
var verify = __webpack_require__(/*! ./verify */ "mAz1")

var algorithms = __webpack_require__(/*! ./algorithms.json */ "tOiH")
Object.keys(algorithms).forEach(function (key) {
  algorithms[key].id = new Buffer(algorithms[key].id, 'hex')
  algorithms[key.toLowerCase()] = algorithms[key]
})

function Sign (algorithm) {
  stream.Writable.call(this)

  var data = algorithms[algorithm]
  if (!data) throw new Error('Unknown message digest')

  this._hashType = data.hash
  this._hash = createHash(data.hash)
  this._tag = data.id
  this._signType = data.sign
}
inherits(Sign, stream.Writable)

Sign.prototype._write = function _write (data, _, done) {
  this._hash.update(data)
  done()
}

Sign.prototype.update = function update (data, enc) {
  if (typeof data === 'string') data = new Buffer(data, enc)

  this._hash.update(data)
  return this
}

Sign.prototype.sign = function signMethod (key, enc) {
  this.end()
  var hash = this._hash.digest()
  var sig = sign(hash, key, this._hashType, this._signType, this._tag)

  return enc ? sig.toString(enc) : sig
}

function Verify (algorithm) {
  stream.Writable.call(this)

  var data = algorithms[algorithm]
  if (!data) throw new Error('Unknown message digest')

  this._hash = createHash(data.hash)
  this._tag = data.id
  this._signType = data.sign
}
inherits(Verify, stream.Writable)

Verify.prototype._write = function _write (data, _, done) {
  this._hash.update(data)
  done()
}

Verify.prototype.update = function update (data, enc) {
  if (typeof data === 'string') data = new Buffer(data, enc)

  this._hash.update(data)
  return this
}

Verify.prototype.verify = function verifyMethod (key, sig, enc) {
  if (typeof sig === 'string') sig = new Buffer(sig, enc)

  this.end()
  var hash = this._hash.digest()
  return verify(sig, hash, key, this._signType, this._tag)
}

function createSign (algorithm) {
  return new Sign(algorithm)
}

function createVerify (algorithm) {
  return new Verify(algorithm)
}

module.exports = {
  Sign: createSign,
  Verify: createVerify,
  createSign: createSign,
  createVerify: createVerify
}

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../buffer/index.js */ "tjlA").Buffer))

/***/ }),

/***/ "zZGF":
/*!**********************************************************!*\
  !*** ./node_modules/browserify-sign/browser/curves.json ***!
  \**********************************************************/
/*! exports provided: 1.3.132.0.10, 1.3.132.0.33, 1.2.840.10045.3.1.1, 1.2.840.10045.3.1.7, 1.3.132.0.34, 1.3.132.0.35, default */
/***/ (function(module) {

module.exports = {"1.3.132.0.10":"secp256k1","1.3.132.0.33":"p224","1.2.840.10045.3.1.1":"p192","1.2.840.10045.3.1.7":"p256","1.3.132.0.34":"p384","1.3.132.0.35":"p521"};

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS1zaWduL2FsZ29zLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5LXNpZ24vYnJvd3Nlci9zaWduLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5LXNpZ24vYnJvd3Nlci92ZXJpZnkuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnktc2lnbi9icm93c2VyL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBLGlCQUFpQixtQkFBTyxDQUFDLHVDQUEyQjs7Ozs7Ozs7Ozs7O0FDQXBEO0FBQ0EsaUJBQWlCLG1CQUFPLENBQUMseUJBQWE7QUFDdEMsVUFBVSxtQkFBTyxDQUFDLDRCQUFnQjtBQUNsQyxTQUFTLG1CQUFPLENBQUMsc0JBQVU7QUFDM0IsU0FBUyxtQkFBTyxDQUFDLG1CQUFPO0FBQ3hCLGdCQUFnQixtQkFBTyxDQUFDLHdCQUFZO0FBQ3BDLGFBQWEsbUJBQU8sQ0FBQywyQkFBZTs7QUFFcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDaEpBO0FBQ0EsU0FBUyxtQkFBTyxDQUFDLG1CQUFPO0FBQ3hCLFNBQVMsbUJBQU8sQ0FBQyxzQkFBVTtBQUMzQixnQkFBZ0IsbUJBQU8sQ0FBQyx3QkFBWTtBQUNwQyxhQUFhLG1CQUFPLENBQUMsMkJBQWU7O0FBRXBDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDbEZBLCtEQUFpQixtQkFBTyxDQUFDLHlCQUFhO0FBQ3RDLGFBQWEsbUJBQU8sQ0FBQyxvQkFBUTtBQUM3QixlQUFlLG1CQUFPLENBQUMsc0JBQVU7QUFDakMsV0FBVyxtQkFBTyxDQUFDLG9CQUFRO0FBQzNCLGFBQWEsbUJBQU8sQ0FBQyxzQkFBVTs7QUFFL0IsaUJBQWlCLG1CQUFPLENBQUMsK0JBQW1CO0FBQzVDO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYnVpbGQvdmVuZG9yL3ZlbmRvci5icm93c2VyaWZ5LXNpZ24uMWFlNjk1MmEwZmY4MjQzY2VjN2EuY2h1bmsuanMiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vYnJvd3Nlci9hbGdvcml0aG1zLmpzb24nKVxyXG4iLCIvLyBtdWNoIG9mIHRoaXMgYmFzZWQgb24gaHR0cHM6Ly9naXRodWIuY29tL2luZHV0bnkvc2VsZi1zaWduZWQvYmxvYi9naC1wYWdlcy9saWIvcnNhLmpzXHJcbnZhciBjcmVhdGVIbWFjID0gcmVxdWlyZSgnY3JlYXRlLWhtYWMnKVxyXG52YXIgY3J0ID0gcmVxdWlyZSgnYnJvd3NlcmlmeS1yc2EnKVxyXG52YXIgRUMgPSByZXF1aXJlKCdlbGxpcHRpYycpLmVjXHJcbnZhciBCTiA9IHJlcXVpcmUoJ2JuLmpzJylcclxudmFyIHBhcnNlS2V5cyA9IHJlcXVpcmUoJ3BhcnNlLWFzbjEnKVxyXG52YXIgY3VydmVzID0gcmVxdWlyZSgnLi9jdXJ2ZXMuanNvbicpXHJcblxyXG5mdW5jdGlvbiBzaWduIChoYXNoLCBrZXksIGhhc2hUeXBlLCBzaWduVHlwZSwgdGFnKSB7XHJcbiAgdmFyIHByaXYgPSBwYXJzZUtleXMoa2V5KVxyXG4gIGlmIChwcml2LmN1cnZlKSB7XHJcbiAgICAvLyByc2Ega2V5cyBjYW4gYmUgaW50ZXJwcmV0ZWQgYXMgZWNkc2Egb25lcyBpbiBvcGVuc3NsXHJcbiAgICBpZiAoc2lnblR5cGUgIT09ICdlY2RzYScgJiYgc2lnblR5cGUgIT09ICdlY2RzYS9yc2EnKSB0aHJvdyBuZXcgRXJyb3IoJ3dyb25nIHByaXZhdGUga2V5IHR5cGUnKVxyXG4gICAgcmV0dXJuIGVjU2lnbihoYXNoLCBwcml2KVxyXG4gIH0gZWxzZSBpZiAocHJpdi50eXBlID09PSAnZHNhJykge1xyXG4gICAgaWYgKHNpZ25UeXBlICE9PSAnZHNhJykgdGhyb3cgbmV3IEVycm9yKCd3cm9uZyBwcml2YXRlIGtleSB0eXBlJylcclxuICAgIHJldHVybiBkc2FTaWduKGhhc2gsIHByaXYsIGhhc2hUeXBlKVxyXG4gIH0gZWxzZSB7XHJcbiAgICBpZiAoc2lnblR5cGUgIT09ICdyc2EnICYmIHNpZ25UeXBlICE9PSAnZWNkc2EvcnNhJykgdGhyb3cgbmV3IEVycm9yKCd3cm9uZyBwcml2YXRlIGtleSB0eXBlJylcclxuICB9XHJcbiAgaGFzaCA9IEJ1ZmZlci5jb25jYXQoW3RhZywgaGFzaF0pXHJcbiAgdmFyIGxlbiA9IHByaXYubW9kdWx1cy5ieXRlTGVuZ3RoKClcclxuICB2YXIgcGFkID0gWyAwLCAxIF1cclxuICB3aGlsZSAoaGFzaC5sZW5ndGggKyBwYWQubGVuZ3RoICsgMSA8IGxlbikgcGFkLnB1c2goMHhmZilcclxuICBwYWQucHVzaCgweDAwKVxyXG4gIHZhciBpID0gLTFcclxuICB3aGlsZSAoKytpIDwgaGFzaC5sZW5ndGgpIHBhZC5wdXNoKGhhc2hbaV0pXHJcblxyXG4gIHZhciBvdXQgPSBjcnQocGFkLCBwcml2KVxyXG4gIHJldHVybiBvdXRcclxufVxyXG5cclxuZnVuY3Rpb24gZWNTaWduIChoYXNoLCBwcml2KSB7XHJcbiAgdmFyIGN1cnZlSWQgPSBjdXJ2ZXNbcHJpdi5jdXJ2ZS5qb2luKCcuJyldXHJcbiAgaWYgKCFjdXJ2ZUlkKSB0aHJvdyBuZXcgRXJyb3IoJ3Vua25vd24gY3VydmUgJyArIHByaXYuY3VydmUuam9pbignLicpKVxyXG5cclxuICB2YXIgY3VydmUgPSBuZXcgRUMoY3VydmVJZClcclxuICB2YXIga2V5ID0gY3VydmUua2V5RnJvbVByaXZhdGUocHJpdi5wcml2YXRlS2V5KVxyXG4gIHZhciBvdXQgPSBrZXkuc2lnbihoYXNoKVxyXG5cclxuICByZXR1cm4gbmV3IEJ1ZmZlcihvdXQudG9ERVIoKSlcclxufVxyXG5cclxuZnVuY3Rpb24gZHNhU2lnbiAoaGFzaCwgcHJpdiwgYWxnbykge1xyXG4gIHZhciB4ID0gcHJpdi5wYXJhbXMucHJpdl9rZXlcclxuICB2YXIgcCA9IHByaXYucGFyYW1zLnBcclxuICB2YXIgcSA9IHByaXYucGFyYW1zLnFcclxuICB2YXIgZyA9IHByaXYucGFyYW1zLmdcclxuICB2YXIgciA9IG5ldyBCTigwKVxyXG4gIHZhciBrXHJcbiAgdmFyIEggPSBiaXRzMmludChoYXNoLCBxKS5tb2QocSlcclxuICB2YXIgcyA9IGZhbHNlXHJcbiAgdmFyIGt2ID0gZ2V0S2V5KHgsIHEsIGhhc2gsIGFsZ28pXHJcbiAgd2hpbGUgKHMgPT09IGZhbHNlKSB7XHJcbiAgICBrID0gbWFrZUtleShxLCBrdiwgYWxnbylcclxuICAgIHIgPSBtYWtlUihnLCBrLCBwLCBxKVxyXG4gICAgcyA9IGsuaW52bShxKS5pbXVsKEguYWRkKHgubXVsKHIpKSkubW9kKHEpXHJcbiAgICBpZiAocy5jbXBuKDApID09PSAwKSB7XHJcbiAgICAgIHMgPSBmYWxzZVxyXG4gICAgICByID0gbmV3IEJOKDApXHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiB0b0RFUihyLCBzKVxyXG59XHJcblxyXG5mdW5jdGlvbiB0b0RFUiAociwgcykge1xyXG4gIHIgPSByLnRvQXJyYXkoKVxyXG4gIHMgPSBzLnRvQXJyYXkoKVxyXG5cclxuICAvLyBQYWQgdmFsdWVzXHJcbiAgaWYgKHJbMF0gJiAweDgwKSByID0gWyAwIF0uY29uY2F0KHIpXHJcbiAgaWYgKHNbMF0gJiAweDgwKSBzID0gWyAwIF0uY29uY2F0KHMpXHJcblxyXG4gIHZhciB0b3RhbCA9IHIubGVuZ3RoICsgcy5sZW5ndGggKyA0XHJcbiAgdmFyIHJlcyA9IFsgMHgzMCwgdG90YWwsIDB4MDIsIHIubGVuZ3RoIF1cclxuICByZXMgPSByZXMuY29uY2F0KHIsIFsgMHgwMiwgcy5sZW5ndGggXSwgcylcclxuICByZXR1cm4gbmV3IEJ1ZmZlcihyZXMpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldEtleSAoeCwgcSwgaGFzaCwgYWxnbykge1xyXG4gIHggPSBuZXcgQnVmZmVyKHgudG9BcnJheSgpKVxyXG4gIGlmICh4Lmxlbmd0aCA8IHEuYnl0ZUxlbmd0aCgpKSB7XHJcbiAgICB2YXIgemVyb3MgPSBuZXcgQnVmZmVyKHEuYnl0ZUxlbmd0aCgpIC0geC5sZW5ndGgpXHJcbiAgICB6ZXJvcy5maWxsKDApXHJcbiAgICB4ID0gQnVmZmVyLmNvbmNhdChbIHplcm9zLCB4IF0pXHJcbiAgfVxyXG4gIHZhciBobGVuID0gaGFzaC5sZW5ndGhcclxuICB2YXIgaGJpdHMgPSBiaXRzMm9jdGV0cyhoYXNoLCBxKVxyXG4gIHZhciB2ID0gbmV3IEJ1ZmZlcihobGVuKVxyXG4gIHYuZmlsbCgxKVxyXG4gIHZhciBrID0gbmV3IEJ1ZmZlcihobGVuKVxyXG4gIGsuZmlsbCgwKVxyXG4gIGsgPSBjcmVhdGVIbWFjKGFsZ28sIGspLnVwZGF0ZSh2KS51cGRhdGUobmV3IEJ1ZmZlcihbIDAgXSkpLnVwZGF0ZSh4KS51cGRhdGUoaGJpdHMpLmRpZ2VzdCgpXHJcbiAgdiA9IGNyZWF0ZUhtYWMoYWxnbywgaykudXBkYXRlKHYpLmRpZ2VzdCgpXHJcbiAgayA9IGNyZWF0ZUhtYWMoYWxnbywgaykudXBkYXRlKHYpLnVwZGF0ZShuZXcgQnVmZmVyKFsgMSBdKSkudXBkYXRlKHgpLnVwZGF0ZShoYml0cykuZGlnZXN0KClcclxuICB2ID0gY3JlYXRlSG1hYyhhbGdvLCBrKS51cGRhdGUodikuZGlnZXN0KClcclxuICByZXR1cm4geyBrOiBrLCB2OiB2IH1cclxufVxyXG5cclxuZnVuY3Rpb24gYml0czJpbnQgKG9iaXRzLCBxKSB7XHJcbiAgdmFyIGJpdHMgPSBuZXcgQk4ob2JpdHMpXHJcbiAgdmFyIHNoaWZ0ID0gKG9iaXRzLmxlbmd0aCA8PCAzKSAtIHEuYml0TGVuZ3RoKClcclxuICBpZiAoc2hpZnQgPiAwKSBiaXRzLmlzaHJuKHNoaWZ0KVxyXG4gIHJldHVybiBiaXRzXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGJpdHMyb2N0ZXRzIChiaXRzLCBxKSB7XHJcbiAgYml0cyA9IGJpdHMyaW50KGJpdHMsIHEpXHJcbiAgYml0cyA9IGJpdHMubW9kKHEpXHJcbiAgdmFyIG91dCA9IG5ldyBCdWZmZXIoYml0cy50b0FycmF5KCkpXHJcbiAgaWYgKG91dC5sZW5ndGggPCBxLmJ5dGVMZW5ndGgoKSkge1xyXG4gICAgdmFyIHplcm9zID0gbmV3IEJ1ZmZlcihxLmJ5dGVMZW5ndGgoKSAtIG91dC5sZW5ndGgpXHJcbiAgICB6ZXJvcy5maWxsKDApXHJcbiAgICBvdXQgPSBCdWZmZXIuY29uY2F0KFsgemVyb3MsIG91dCBdKVxyXG4gIH1cclxuICByZXR1cm4gb3V0XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG1ha2VLZXkgKHEsIGt2LCBhbGdvKSB7XHJcbiAgdmFyIHRcclxuICB2YXIga1xyXG5cclxuICBkbyB7XHJcbiAgICB0ID0gbmV3IEJ1ZmZlcigwKVxyXG5cclxuICAgIHdoaWxlICh0Lmxlbmd0aCAqIDggPCBxLmJpdExlbmd0aCgpKSB7XHJcbiAgICAgIGt2LnYgPSBjcmVhdGVIbWFjKGFsZ28sIGt2LmspLnVwZGF0ZShrdi52KS5kaWdlc3QoKVxyXG4gICAgICB0ID0gQnVmZmVyLmNvbmNhdChbIHQsIGt2LnYgXSlcclxuICAgIH1cclxuXHJcbiAgICBrID0gYml0czJpbnQodCwgcSlcclxuICAgIGt2LmsgPSBjcmVhdGVIbWFjKGFsZ28sIGt2LmspLnVwZGF0ZShrdi52KS51cGRhdGUobmV3IEJ1ZmZlcihbIDAgXSkpLmRpZ2VzdCgpXHJcbiAgICBrdi52ID0gY3JlYXRlSG1hYyhhbGdvLCBrdi5rKS51cGRhdGUoa3YudikuZGlnZXN0KClcclxuICB9IHdoaWxlIChrLmNtcChxKSAhPT0gLTEpXHJcblxyXG4gIHJldHVybiBrXHJcbn1cclxuXHJcbmZ1bmN0aW9uIG1ha2VSIChnLCBrLCBwLCBxKSB7XHJcbiAgcmV0dXJuIGcudG9SZWQoQk4ubW9udChwKSkucmVkUG93KGspLmZyb21SZWQoKS5tb2QocSlcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBzaWduXHJcbm1vZHVsZS5leHBvcnRzLmdldEtleSA9IGdldEtleVxyXG5tb2R1bGUuZXhwb3J0cy5tYWtlS2V5ID0gbWFrZUtleVxyXG4iLCIvLyBtdWNoIG9mIHRoaXMgYmFzZWQgb24gaHR0cHM6Ly9naXRodWIuY29tL2luZHV0bnkvc2VsZi1zaWduZWQvYmxvYi9naC1wYWdlcy9saWIvcnNhLmpzXHJcbnZhciBCTiA9IHJlcXVpcmUoJ2JuLmpzJylcclxudmFyIEVDID0gcmVxdWlyZSgnZWxsaXB0aWMnKS5lY1xyXG52YXIgcGFyc2VLZXlzID0gcmVxdWlyZSgncGFyc2UtYXNuMScpXHJcbnZhciBjdXJ2ZXMgPSByZXF1aXJlKCcuL2N1cnZlcy5qc29uJylcclxuXHJcbmZ1bmN0aW9uIHZlcmlmeSAoc2lnLCBoYXNoLCBrZXksIHNpZ25UeXBlLCB0YWcpIHtcclxuICB2YXIgcHViID0gcGFyc2VLZXlzKGtleSlcclxuICBpZiAocHViLnR5cGUgPT09ICdlYycpIHtcclxuICAgIC8vIHJzYSBrZXlzIGNhbiBiZSBpbnRlcnByZXRlZCBhcyBlY2RzYSBvbmVzIGluIG9wZW5zc2xcclxuICAgIGlmIChzaWduVHlwZSAhPT0gJ2VjZHNhJyAmJiBzaWduVHlwZSAhPT0gJ2VjZHNhL3JzYScpIHRocm93IG5ldyBFcnJvcignd3JvbmcgcHVibGljIGtleSB0eXBlJylcclxuICAgIHJldHVybiBlY1ZlcmlmeShzaWcsIGhhc2gsIHB1YilcclxuICB9IGVsc2UgaWYgKHB1Yi50eXBlID09PSAnZHNhJykge1xyXG4gICAgaWYgKHNpZ25UeXBlICE9PSAnZHNhJykgdGhyb3cgbmV3IEVycm9yKCd3cm9uZyBwdWJsaWMga2V5IHR5cGUnKVxyXG4gICAgcmV0dXJuIGRzYVZlcmlmeShzaWcsIGhhc2gsIHB1YilcclxuICB9IGVsc2Uge1xyXG4gICAgaWYgKHNpZ25UeXBlICE9PSAncnNhJyAmJiBzaWduVHlwZSAhPT0gJ2VjZHNhL3JzYScpIHRocm93IG5ldyBFcnJvcignd3JvbmcgcHVibGljIGtleSB0eXBlJylcclxuICB9XHJcbiAgaGFzaCA9IEJ1ZmZlci5jb25jYXQoW3RhZywgaGFzaF0pXHJcbiAgdmFyIGxlbiA9IHB1Yi5tb2R1bHVzLmJ5dGVMZW5ndGgoKVxyXG4gIHZhciBwYWQgPSBbIDEgXVxyXG4gIHZhciBwYWROdW0gPSAwXHJcbiAgd2hpbGUgKGhhc2gubGVuZ3RoICsgcGFkLmxlbmd0aCArIDIgPCBsZW4pIHtcclxuICAgIHBhZC5wdXNoKDB4ZmYpXHJcbiAgICBwYWROdW0rK1xyXG4gIH1cclxuICBwYWQucHVzaCgweDAwKVxyXG4gIHZhciBpID0gLTFcclxuICB3aGlsZSAoKytpIDwgaGFzaC5sZW5ndGgpIHtcclxuICAgIHBhZC5wdXNoKGhhc2hbaV0pXHJcbiAgfVxyXG4gIHBhZCA9IG5ldyBCdWZmZXIocGFkKVxyXG4gIHZhciByZWQgPSBCTi5tb250KHB1Yi5tb2R1bHVzKVxyXG4gIHNpZyA9IG5ldyBCTihzaWcpLnRvUmVkKHJlZClcclxuXHJcbiAgc2lnID0gc2lnLnJlZFBvdyhuZXcgQk4ocHViLnB1YmxpY0V4cG9uZW50KSlcclxuICBzaWcgPSBuZXcgQnVmZmVyKHNpZy5mcm9tUmVkKCkudG9BcnJheSgpKVxyXG4gIHZhciBvdXQgPSBwYWROdW0gPCA4ID8gMSA6IDBcclxuICBsZW4gPSBNYXRoLm1pbihzaWcubGVuZ3RoLCBwYWQubGVuZ3RoKVxyXG4gIGlmIChzaWcubGVuZ3RoICE9PSBwYWQubGVuZ3RoKSBvdXQgPSAxXHJcblxyXG4gIGkgPSAtMVxyXG4gIHdoaWxlICgrK2kgPCBsZW4pIG91dCB8PSBzaWdbaV0gXiBwYWRbaV1cclxuICByZXR1cm4gb3V0ID09PSAwXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGVjVmVyaWZ5IChzaWcsIGhhc2gsIHB1Yikge1xyXG4gIHZhciBjdXJ2ZUlkID0gY3VydmVzW3B1Yi5kYXRhLmFsZ29yaXRobS5jdXJ2ZS5qb2luKCcuJyldXHJcbiAgaWYgKCFjdXJ2ZUlkKSB0aHJvdyBuZXcgRXJyb3IoJ3Vua25vd24gY3VydmUgJyArIHB1Yi5kYXRhLmFsZ29yaXRobS5jdXJ2ZS5qb2luKCcuJykpXHJcblxyXG4gIHZhciBjdXJ2ZSA9IG5ldyBFQyhjdXJ2ZUlkKVxyXG4gIHZhciBwdWJrZXkgPSBwdWIuZGF0YS5zdWJqZWN0UHJpdmF0ZUtleS5kYXRhXHJcblxyXG4gIHJldHVybiBjdXJ2ZS52ZXJpZnkoaGFzaCwgc2lnLCBwdWJrZXkpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRzYVZlcmlmeSAoc2lnLCBoYXNoLCBwdWIpIHtcclxuICB2YXIgcCA9IHB1Yi5kYXRhLnBcclxuICB2YXIgcSA9IHB1Yi5kYXRhLnFcclxuICB2YXIgZyA9IHB1Yi5kYXRhLmdcclxuICB2YXIgeSA9IHB1Yi5kYXRhLnB1Yl9rZXlcclxuICB2YXIgdW5wYWNrZWQgPSBwYXJzZUtleXMuc2lnbmF0dXJlLmRlY29kZShzaWcsICdkZXInKVxyXG4gIHZhciBzID0gdW5wYWNrZWQuc1xyXG4gIHZhciByID0gdW5wYWNrZWQuclxyXG4gIGNoZWNrVmFsdWUocywgcSlcclxuICBjaGVja1ZhbHVlKHIsIHEpXHJcbiAgdmFyIG1vbnRwID0gQk4ubW9udChwKVxyXG4gIHZhciB3ID0gcy5pbnZtKHEpXHJcbiAgdmFyIHYgPSBnLnRvUmVkKG1vbnRwKVxyXG4gICAgLnJlZFBvdyhuZXcgQk4oaGFzaCkubXVsKHcpLm1vZChxKSlcclxuICAgIC5mcm9tUmVkKClcclxuICAgIC5tdWwoeS50b1JlZChtb250cCkucmVkUG93KHIubXVsKHcpLm1vZChxKSkuZnJvbVJlZCgpKVxyXG4gICAgLm1vZChwKVxyXG4gICAgLm1vZChxKVxyXG4gIHJldHVybiB2LmNtcChyKSA9PT0gMFxyXG59XHJcblxyXG5mdW5jdGlvbiBjaGVja1ZhbHVlIChiLCBxKSB7XHJcbiAgaWYgKGIuY21wbigwKSA8PSAwKSB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgc2lnJylcclxuICBpZiAoYi5jbXAocSkgPj0gcSkgdGhyb3cgbmV3IEVycm9yKCdpbnZhbGlkIHNpZycpXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gdmVyaWZ5XHJcbiIsInZhciBjcmVhdGVIYXNoID0gcmVxdWlyZSgnY3JlYXRlLWhhc2gnKVxyXG52YXIgc3RyZWFtID0gcmVxdWlyZSgnc3RyZWFtJylcclxudmFyIGluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKVxyXG52YXIgc2lnbiA9IHJlcXVpcmUoJy4vc2lnbicpXHJcbnZhciB2ZXJpZnkgPSByZXF1aXJlKCcuL3ZlcmlmeScpXHJcblxyXG52YXIgYWxnb3JpdGhtcyA9IHJlcXVpcmUoJy4vYWxnb3JpdGhtcy5qc29uJylcclxuT2JqZWN0LmtleXMoYWxnb3JpdGhtcykuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XHJcbiAgYWxnb3JpdGhtc1trZXldLmlkID0gbmV3IEJ1ZmZlcihhbGdvcml0aG1zW2tleV0uaWQsICdoZXgnKVxyXG4gIGFsZ29yaXRobXNba2V5LnRvTG93ZXJDYXNlKCldID0gYWxnb3JpdGhtc1trZXldXHJcbn0pXHJcblxyXG5mdW5jdGlvbiBTaWduIChhbGdvcml0aG0pIHtcclxuICBzdHJlYW0uV3JpdGFibGUuY2FsbCh0aGlzKVxyXG5cclxuICB2YXIgZGF0YSA9IGFsZ29yaXRobXNbYWxnb3JpdGhtXVxyXG4gIGlmICghZGF0YSkgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIG1lc3NhZ2UgZGlnZXN0JylcclxuXHJcbiAgdGhpcy5faGFzaFR5cGUgPSBkYXRhLmhhc2hcclxuICB0aGlzLl9oYXNoID0gY3JlYXRlSGFzaChkYXRhLmhhc2gpXHJcbiAgdGhpcy5fdGFnID0gZGF0YS5pZFxyXG4gIHRoaXMuX3NpZ25UeXBlID0gZGF0YS5zaWduXHJcbn1cclxuaW5oZXJpdHMoU2lnbiwgc3RyZWFtLldyaXRhYmxlKVxyXG5cclxuU2lnbi5wcm90b3R5cGUuX3dyaXRlID0gZnVuY3Rpb24gX3dyaXRlIChkYXRhLCBfLCBkb25lKSB7XHJcbiAgdGhpcy5faGFzaC51cGRhdGUoZGF0YSlcclxuICBkb25lKClcclxufVxyXG5cclxuU2lnbi5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gdXBkYXRlIChkYXRhLCBlbmMpIHtcclxuICBpZiAodHlwZW9mIGRhdGEgPT09ICdzdHJpbmcnKSBkYXRhID0gbmV3IEJ1ZmZlcihkYXRhLCBlbmMpXHJcblxyXG4gIHRoaXMuX2hhc2gudXBkYXRlKGRhdGEpXHJcbiAgcmV0dXJuIHRoaXNcclxufVxyXG5cclxuU2lnbi5wcm90b3R5cGUuc2lnbiA9IGZ1bmN0aW9uIHNpZ25NZXRob2QgKGtleSwgZW5jKSB7XHJcbiAgdGhpcy5lbmQoKVxyXG4gIHZhciBoYXNoID0gdGhpcy5faGFzaC5kaWdlc3QoKVxyXG4gIHZhciBzaWcgPSBzaWduKGhhc2gsIGtleSwgdGhpcy5faGFzaFR5cGUsIHRoaXMuX3NpZ25UeXBlLCB0aGlzLl90YWcpXHJcblxyXG4gIHJldHVybiBlbmMgPyBzaWcudG9TdHJpbmcoZW5jKSA6IHNpZ1xyXG59XHJcblxyXG5mdW5jdGlvbiBWZXJpZnkgKGFsZ29yaXRobSkge1xyXG4gIHN0cmVhbS5Xcml0YWJsZS5jYWxsKHRoaXMpXHJcblxyXG4gIHZhciBkYXRhID0gYWxnb3JpdGhtc1thbGdvcml0aG1dXHJcbiAgaWYgKCFkYXRhKSB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gbWVzc2FnZSBkaWdlc3QnKVxyXG5cclxuICB0aGlzLl9oYXNoID0gY3JlYXRlSGFzaChkYXRhLmhhc2gpXHJcbiAgdGhpcy5fdGFnID0gZGF0YS5pZFxyXG4gIHRoaXMuX3NpZ25UeXBlID0gZGF0YS5zaWduXHJcbn1cclxuaW5oZXJpdHMoVmVyaWZ5LCBzdHJlYW0uV3JpdGFibGUpXHJcblxyXG5WZXJpZnkucHJvdG90eXBlLl93cml0ZSA9IGZ1bmN0aW9uIF93cml0ZSAoZGF0YSwgXywgZG9uZSkge1xyXG4gIHRoaXMuX2hhc2gudXBkYXRlKGRhdGEpXHJcbiAgZG9uZSgpXHJcbn1cclxuXHJcblZlcmlmeS5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gdXBkYXRlIChkYXRhLCBlbmMpIHtcclxuICBpZiAodHlwZW9mIGRhdGEgPT09ICdzdHJpbmcnKSBkYXRhID0gbmV3IEJ1ZmZlcihkYXRhLCBlbmMpXHJcblxyXG4gIHRoaXMuX2hhc2gudXBkYXRlKGRhdGEpXHJcbiAgcmV0dXJuIHRoaXNcclxufVxyXG5cclxuVmVyaWZ5LnByb3RvdHlwZS52ZXJpZnkgPSBmdW5jdGlvbiB2ZXJpZnlNZXRob2QgKGtleSwgc2lnLCBlbmMpIHtcclxuICBpZiAodHlwZW9mIHNpZyA9PT0gJ3N0cmluZycpIHNpZyA9IG5ldyBCdWZmZXIoc2lnLCBlbmMpXHJcblxyXG4gIHRoaXMuZW5kKClcclxuICB2YXIgaGFzaCA9IHRoaXMuX2hhc2guZGlnZXN0KClcclxuICByZXR1cm4gdmVyaWZ5KHNpZywgaGFzaCwga2V5LCB0aGlzLl9zaWduVHlwZSwgdGhpcy5fdGFnKVxyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVTaWduIChhbGdvcml0aG0pIHtcclxuICByZXR1cm4gbmV3IFNpZ24oYWxnb3JpdGhtKVxyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVWZXJpZnkgKGFsZ29yaXRobSkge1xyXG4gIHJldHVybiBuZXcgVmVyaWZ5KGFsZ29yaXRobSlcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgU2lnbjogY3JlYXRlU2lnbixcclxuICBWZXJpZnk6IGNyZWF0ZVZlcmlmeSxcclxuICBjcmVhdGVTaWduOiBjcmVhdGVTaWduLFxyXG4gIGNyZWF0ZVZlcmlmeTogY3JlYXRlVmVyaWZ5XHJcbn1cclxuIl0sInNvdXJjZVJvb3QiOiIifQ==