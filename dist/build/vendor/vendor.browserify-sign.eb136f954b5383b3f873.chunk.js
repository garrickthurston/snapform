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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS1zaWduL2FsZ29zLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5LXNpZ24vYnJvd3Nlci9zaWduLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5LXNpZ24vYnJvd3Nlci92ZXJpZnkuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnktc2lnbi9icm93c2VyL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBLGlCQUFpQixtQkFBTyxDQUFDLHVDQUEyQjs7Ozs7Ozs7Ozs7O0FDQXBEO0FBQ0EsaUJBQWlCLG1CQUFPLENBQUMseUJBQWE7QUFDdEMsVUFBVSxtQkFBTyxDQUFDLDRCQUFnQjtBQUNsQyxTQUFTLG1CQUFPLENBQUMsc0JBQVU7QUFDM0IsU0FBUyxtQkFBTyxDQUFDLG1CQUFPO0FBQ3hCLGdCQUFnQixtQkFBTyxDQUFDLHdCQUFZO0FBQ3BDLGFBQWEsbUJBQU8sQ0FBQywyQkFBZTs7QUFFcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDaEpBO0FBQ0EsU0FBUyxtQkFBTyxDQUFDLG1CQUFPO0FBQ3hCLFNBQVMsbUJBQU8sQ0FBQyxzQkFBVTtBQUMzQixnQkFBZ0IsbUJBQU8sQ0FBQyx3QkFBWTtBQUNwQyxhQUFhLG1CQUFPLENBQUMsMkJBQWU7O0FBRXBDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDbEZBLCtEQUFpQixtQkFBTyxDQUFDLHlCQUFhO0FBQ3RDLGFBQWEsbUJBQU8sQ0FBQyxvQkFBUTtBQUM3QixlQUFlLG1CQUFPLENBQUMsc0JBQVU7QUFDakMsV0FBVyxtQkFBTyxDQUFDLG9CQUFRO0FBQzNCLGFBQWEsbUJBQU8sQ0FBQyxzQkFBVTs7QUFFL0IsaUJBQWlCLG1CQUFPLENBQUMsK0JBQW1CO0FBQzVDO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYnVpbGQvdmVuZG9yL3ZlbmRvci5icm93c2VyaWZ5LXNpZ24uZWIxMzZmOTU0YjUzODNiM2Y4NzMuY2h1bmsuanMiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vYnJvd3Nlci9hbGdvcml0aG1zLmpzb24nKVxuIiwiLy8gbXVjaCBvZiB0aGlzIGJhc2VkIG9uIGh0dHBzOi8vZ2l0aHViLmNvbS9pbmR1dG55L3NlbGYtc2lnbmVkL2Jsb2IvZ2gtcGFnZXMvbGliL3JzYS5qc1xudmFyIGNyZWF0ZUhtYWMgPSByZXF1aXJlKCdjcmVhdGUtaG1hYycpXG52YXIgY3J0ID0gcmVxdWlyZSgnYnJvd3NlcmlmeS1yc2EnKVxudmFyIEVDID0gcmVxdWlyZSgnZWxsaXB0aWMnKS5lY1xudmFyIEJOID0gcmVxdWlyZSgnYm4uanMnKVxudmFyIHBhcnNlS2V5cyA9IHJlcXVpcmUoJ3BhcnNlLWFzbjEnKVxudmFyIGN1cnZlcyA9IHJlcXVpcmUoJy4vY3VydmVzLmpzb24nKVxuXG5mdW5jdGlvbiBzaWduIChoYXNoLCBrZXksIGhhc2hUeXBlLCBzaWduVHlwZSwgdGFnKSB7XG4gIHZhciBwcml2ID0gcGFyc2VLZXlzKGtleSlcbiAgaWYgKHByaXYuY3VydmUpIHtcbiAgICAvLyByc2Ega2V5cyBjYW4gYmUgaW50ZXJwcmV0ZWQgYXMgZWNkc2Egb25lcyBpbiBvcGVuc3NsXG4gICAgaWYgKHNpZ25UeXBlICE9PSAnZWNkc2EnICYmIHNpZ25UeXBlICE9PSAnZWNkc2EvcnNhJykgdGhyb3cgbmV3IEVycm9yKCd3cm9uZyBwcml2YXRlIGtleSB0eXBlJylcbiAgICByZXR1cm4gZWNTaWduKGhhc2gsIHByaXYpXG4gIH0gZWxzZSBpZiAocHJpdi50eXBlID09PSAnZHNhJykge1xuICAgIGlmIChzaWduVHlwZSAhPT0gJ2RzYScpIHRocm93IG5ldyBFcnJvcignd3JvbmcgcHJpdmF0ZSBrZXkgdHlwZScpXG4gICAgcmV0dXJuIGRzYVNpZ24oaGFzaCwgcHJpdiwgaGFzaFR5cGUpXG4gIH0gZWxzZSB7XG4gICAgaWYgKHNpZ25UeXBlICE9PSAncnNhJyAmJiBzaWduVHlwZSAhPT0gJ2VjZHNhL3JzYScpIHRocm93IG5ldyBFcnJvcignd3JvbmcgcHJpdmF0ZSBrZXkgdHlwZScpXG4gIH1cbiAgaGFzaCA9IEJ1ZmZlci5jb25jYXQoW3RhZywgaGFzaF0pXG4gIHZhciBsZW4gPSBwcml2Lm1vZHVsdXMuYnl0ZUxlbmd0aCgpXG4gIHZhciBwYWQgPSBbIDAsIDEgXVxuICB3aGlsZSAoaGFzaC5sZW5ndGggKyBwYWQubGVuZ3RoICsgMSA8IGxlbikgcGFkLnB1c2goMHhmZilcbiAgcGFkLnB1c2goMHgwMClcbiAgdmFyIGkgPSAtMVxuICB3aGlsZSAoKytpIDwgaGFzaC5sZW5ndGgpIHBhZC5wdXNoKGhhc2hbaV0pXG5cbiAgdmFyIG91dCA9IGNydChwYWQsIHByaXYpXG4gIHJldHVybiBvdXRcbn1cblxuZnVuY3Rpb24gZWNTaWduIChoYXNoLCBwcml2KSB7XG4gIHZhciBjdXJ2ZUlkID0gY3VydmVzW3ByaXYuY3VydmUuam9pbignLicpXVxuICBpZiAoIWN1cnZlSWQpIHRocm93IG5ldyBFcnJvcigndW5rbm93biBjdXJ2ZSAnICsgcHJpdi5jdXJ2ZS5qb2luKCcuJykpXG5cbiAgdmFyIGN1cnZlID0gbmV3IEVDKGN1cnZlSWQpXG4gIHZhciBrZXkgPSBjdXJ2ZS5rZXlGcm9tUHJpdmF0ZShwcml2LnByaXZhdGVLZXkpXG4gIHZhciBvdXQgPSBrZXkuc2lnbihoYXNoKVxuXG4gIHJldHVybiBuZXcgQnVmZmVyKG91dC50b0RFUigpKVxufVxuXG5mdW5jdGlvbiBkc2FTaWduIChoYXNoLCBwcml2LCBhbGdvKSB7XG4gIHZhciB4ID0gcHJpdi5wYXJhbXMucHJpdl9rZXlcbiAgdmFyIHAgPSBwcml2LnBhcmFtcy5wXG4gIHZhciBxID0gcHJpdi5wYXJhbXMucVxuICB2YXIgZyA9IHByaXYucGFyYW1zLmdcbiAgdmFyIHIgPSBuZXcgQk4oMClcbiAgdmFyIGtcbiAgdmFyIEggPSBiaXRzMmludChoYXNoLCBxKS5tb2QocSlcbiAgdmFyIHMgPSBmYWxzZVxuICB2YXIga3YgPSBnZXRLZXkoeCwgcSwgaGFzaCwgYWxnbylcbiAgd2hpbGUgKHMgPT09IGZhbHNlKSB7XG4gICAgayA9IG1ha2VLZXkocSwga3YsIGFsZ28pXG4gICAgciA9IG1ha2VSKGcsIGssIHAsIHEpXG4gICAgcyA9IGsuaW52bShxKS5pbXVsKEguYWRkKHgubXVsKHIpKSkubW9kKHEpXG4gICAgaWYgKHMuY21wbigwKSA9PT0gMCkge1xuICAgICAgcyA9IGZhbHNlXG4gICAgICByID0gbmV3IEJOKDApXG4gICAgfVxuICB9XG4gIHJldHVybiB0b0RFUihyLCBzKVxufVxuXG5mdW5jdGlvbiB0b0RFUiAociwgcykge1xuICByID0gci50b0FycmF5KClcbiAgcyA9IHMudG9BcnJheSgpXG5cbiAgLy8gUGFkIHZhbHVlc1xuICBpZiAoclswXSAmIDB4ODApIHIgPSBbIDAgXS5jb25jYXQocilcbiAgaWYgKHNbMF0gJiAweDgwKSBzID0gWyAwIF0uY29uY2F0KHMpXG5cbiAgdmFyIHRvdGFsID0gci5sZW5ndGggKyBzLmxlbmd0aCArIDRcbiAgdmFyIHJlcyA9IFsgMHgzMCwgdG90YWwsIDB4MDIsIHIubGVuZ3RoIF1cbiAgcmVzID0gcmVzLmNvbmNhdChyLCBbIDB4MDIsIHMubGVuZ3RoIF0sIHMpXG4gIHJldHVybiBuZXcgQnVmZmVyKHJlcylcbn1cblxuZnVuY3Rpb24gZ2V0S2V5ICh4LCBxLCBoYXNoLCBhbGdvKSB7XG4gIHggPSBuZXcgQnVmZmVyKHgudG9BcnJheSgpKVxuICBpZiAoeC5sZW5ndGggPCBxLmJ5dGVMZW5ndGgoKSkge1xuICAgIHZhciB6ZXJvcyA9IG5ldyBCdWZmZXIocS5ieXRlTGVuZ3RoKCkgLSB4Lmxlbmd0aClcbiAgICB6ZXJvcy5maWxsKDApXG4gICAgeCA9IEJ1ZmZlci5jb25jYXQoWyB6ZXJvcywgeCBdKVxuICB9XG4gIHZhciBobGVuID0gaGFzaC5sZW5ndGhcbiAgdmFyIGhiaXRzID0gYml0czJvY3RldHMoaGFzaCwgcSlcbiAgdmFyIHYgPSBuZXcgQnVmZmVyKGhsZW4pXG4gIHYuZmlsbCgxKVxuICB2YXIgayA9IG5ldyBCdWZmZXIoaGxlbilcbiAgay5maWxsKDApXG4gIGsgPSBjcmVhdGVIbWFjKGFsZ28sIGspLnVwZGF0ZSh2KS51cGRhdGUobmV3IEJ1ZmZlcihbIDAgXSkpLnVwZGF0ZSh4KS51cGRhdGUoaGJpdHMpLmRpZ2VzdCgpXG4gIHYgPSBjcmVhdGVIbWFjKGFsZ28sIGspLnVwZGF0ZSh2KS5kaWdlc3QoKVxuICBrID0gY3JlYXRlSG1hYyhhbGdvLCBrKS51cGRhdGUodikudXBkYXRlKG5ldyBCdWZmZXIoWyAxIF0pKS51cGRhdGUoeCkudXBkYXRlKGhiaXRzKS5kaWdlc3QoKVxuICB2ID0gY3JlYXRlSG1hYyhhbGdvLCBrKS51cGRhdGUodikuZGlnZXN0KClcbiAgcmV0dXJuIHsgazogaywgdjogdiB9XG59XG5cbmZ1bmN0aW9uIGJpdHMyaW50IChvYml0cywgcSkge1xuICB2YXIgYml0cyA9IG5ldyBCTihvYml0cylcbiAgdmFyIHNoaWZ0ID0gKG9iaXRzLmxlbmd0aCA8PCAzKSAtIHEuYml0TGVuZ3RoKClcbiAgaWYgKHNoaWZ0ID4gMCkgYml0cy5pc2hybihzaGlmdClcbiAgcmV0dXJuIGJpdHNcbn1cblxuZnVuY3Rpb24gYml0czJvY3RldHMgKGJpdHMsIHEpIHtcbiAgYml0cyA9IGJpdHMyaW50KGJpdHMsIHEpXG4gIGJpdHMgPSBiaXRzLm1vZChxKVxuICB2YXIgb3V0ID0gbmV3IEJ1ZmZlcihiaXRzLnRvQXJyYXkoKSlcbiAgaWYgKG91dC5sZW5ndGggPCBxLmJ5dGVMZW5ndGgoKSkge1xuICAgIHZhciB6ZXJvcyA9IG5ldyBCdWZmZXIocS5ieXRlTGVuZ3RoKCkgLSBvdXQubGVuZ3RoKVxuICAgIHplcm9zLmZpbGwoMClcbiAgICBvdXQgPSBCdWZmZXIuY29uY2F0KFsgemVyb3MsIG91dCBdKVxuICB9XG4gIHJldHVybiBvdXRcbn1cblxuZnVuY3Rpb24gbWFrZUtleSAocSwga3YsIGFsZ28pIHtcbiAgdmFyIHRcbiAgdmFyIGtcblxuICBkbyB7XG4gICAgdCA9IG5ldyBCdWZmZXIoMClcblxuICAgIHdoaWxlICh0Lmxlbmd0aCAqIDggPCBxLmJpdExlbmd0aCgpKSB7XG4gICAgICBrdi52ID0gY3JlYXRlSG1hYyhhbGdvLCBrdi5rKS51cGRhdGUoa3YudikuZGlnZXN0KClcbiAgICAgIHQgPSBCdWZmZXIuY29uY2F0KFsgdCwga3YudiBdKVxuICAgIH1cblxuICAgIGsgPSBiaXRzMmludCh0LCBxKVxuICAgIGt2LmsgPSBjcmVhdGVIbWFjKGFsZ28sIGt2LmspLnVwZGF0ZShrdi52KS51cGRhdGUobmV3IEJ1ZmZlcihbIDAgXSkpLmRpZ2VzdCgpXG4gICAga3YudiA9IGNyZWF0ZUhtYWMoYWxnbywga3YuaykudXBkYXRlKGt2LnYpLmRpZ2VzdCgpXG4gIH0gd2hpbGUgKGsuY21wKHEpICE9PSAtMSlcblxuICByZXR1cm4ga1xufVxuXG5mdW5jdGlvbiBtYWtlUiAoZywgaywgcCwgcSkge1xuICByZXR1cm4gZy50b1JlZChCTi5tb250KHApKS5yZWRQb3coaykuZnJvbVJlZCgpLm1vZChxKVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNpZ25cbm1vZHVsZS5leHBvcnRzLmdldEtleSA9IGdldEtleVxubW9kdWxlLmV4cG9ydHMubWFrZUtleSA9IG1ha2VLZXlcbiIsIi8vIG11Y2ggb2YgdGhpcyBiYXNlZCBvbiBodHRwczovL2dpdGh1Yi5jb20vaW5kdXRueS9zZWxmLXNpZ25lZC9ibG9iL2doLXBhZ2VzL2xpYi9yc2EuanNcbnZhciBCTiA9IHJlcXVpcmUoJ2JuLmpzJylcbnZhciBFQyA9IHJlcXVpcmUoJ2VsbGlwdGljJykuZWNcbnZhciBwYXJzZUtleXMgPSByZXF1aXJlKCdwYXJzZS1hc24xJylcbnZhciBjdXJ2ZXMgPSByZXF1aXJlKCcuL2N1cnZlcy5qc29uJylcblxuZnVuY3Rpb24gdmVyaWZ5IChzaWcsIGhhc2gsIGtleSwgc2lnblR5cGUsIHRhZykge1xuICB2YXIgcHViID0gcGFyc2VLZXlzKGtleSlcbiAgaWYgKHB1Yi50eXBlID09PSAnZWMnKSB7XG4gICAgLy8gcnNhIGtleXMgY2FuIGJlIGludGVycHJldGVkIGFzIGVjZHNhIG9uZXMgaW4gb3BlbnNzbFxuICAgIGlmIChzaWduVHlwZSAhPT0gJ2VjZHNhJyAmJiBzaWduVHlwZSAhPT0gJ2VjZHNhL3JzYScpIHRocm93IG5ldyBFcnJvcignd3JvbmcgcHVibGljIGtleSB0eXBlJylcbiAgICByZXR1cm4gZWNWZXJpZnkoc2lnLCBoYXNoLCBwdWIpXG4gIH0gZWxzZSBpZiAocHViLnR5cGUgPT09ICdkc2EnKSB7XG4gICAgaWYgKHNpZ25UeXBlICE9PSAnZHNhJykgdGhyb3cgbmV3IEVycm9yKCd3cm9uZyBwdWJsaWMga2V5IHR5cGUnKVxuICAgIHJldHVybiBkc2FWZXJpZnkoc2lnLCBoYXNoLCBwdWIpXG4gIH0gZWxzZSB7XG4gICAgaWYgKHNpZ25UeXBlICE9PSAncnNhJyAmJiBzaWduVHlwZSAhPT0gJ2VjZHNhL3JzYScpIHRocm93IG5ldyBFcnJvcignd3JvbmcgcHVibGljIGtleSB0eXBlJylcbiAgfVxuICBoYXNoID0gQnVmZmVyLmNvbmNhdChbdGFnLCBoYXNoXSlcbiAgdmFyIGxlbiA9IHB1Yi5tb2R1bHVzLmJ5dGVMZW5ndGgoKVxuICB2YXIgcGFkID0gWyAxIF1cbiAgdmFyIHBhZE51bSA9IDBcbiAgd2hpbGUgKGhhc2gubGVuZ3RoICsgcGFkLmxlbmd0aCArIDIgPCBsZW4pIHtcbiAgICBwYWQucHVzaCgweGZmKVxuICAgIHBhZE51bSsrXG4gIH1cbiAgcGFkLnB1c2goMHgwMClcbiAgdmFyIGkgPSAtMVxuICB3aGlsZSAoKytpIDwgaGFzaC5sZW5ndGgpIHtcbiAgICBwYWQucHVzaChoYXNoW2ldKVxuICB9XG4gIHBhZCA9IG5ldyBCdWZmZXIocGFkKVxuICB2YXIgcmVkID0gQk4ubW9udChwdWIubW9kdWx1cylcbiAgc2lnID0gbmV3IEJOKHNpZykudG9SZWQocmVkKVxuXG4gIHNpZyA9IHNpZy5yZWRQb3cobmV3IEJOKHB1Yi5wdWJsaWNFeHBvbmVudCkpXG4gIHNpZyA9IG5ldyBCdWZmZXIoc2lnLmZyb21SZWQoKS50b0FycmF5KCkpXG4gIHZhciBvdXQgPSBwYWROdW0gPCA4ID8gMSA6IDBcbiAgbGVuID0gTWF0aC5taW4oc2lnLmxlbmd0aCwgcGFkLmxlbmd0aClcbiAgaWYgKHNpZy5sZW5ndGggIT09IHBhZC5sZW5ndGgpIG91dCA9IDFcblxuICBpID0gLTFcbiAgd2hpbGUgKCsraSA8IGxlbikgb3V0IHw9IHNpZ1tpXSBeIHBhZFtpXVxuICByZXR1cm4gb3V0ID09PSAwXG59XG5cbmZ1bmN0aW9uIGVjVmVyaWZ5IChzaWcsIGhhc2gsIHB1Yikge1xuICB2YXIgY3VydmVJZCA9IGN1cnZlc1twdWIuZGF0YS5hbGdvcml0aG0uY3VydmUuam9pbignLicpXVxuICBpZiAoIWN1cnZlSWQpIHRocm93IG5ldyBFcnJvcigndW5rbm93biBjdXJ2ZSAnICsgcHViLmRhdGEuYWxnb3JpdGhtLmN1cnZlLmpvaW4oJy4nKSlcblxuICB2YXIgY3VydmUgPSBuZXcgRUMoY3VydmVJZClcbiAgdmFyIHB1YmtleSA9IHB1Yi5kYXRhLnN1YmplY3RQcml2YXRlS2V5LmRhdGFcblxuICByZXR1cm4gY3VydmUudmVyaWZ5KGhhc2gsIHNpZywgcHVia2V5KVxufVxuXG5mdW5jdGlvbiBkc2FWZXJpZnkgKHNpZywgaGFzaCwgcHViKSB7XG4gIHZhciBwID0gcHViLmRhdGEucFxuICB2YXIgcSA9IHB1Yi5kYXRhLnFcbiAgdmFyIGcgPSBwdWIuZGF0YS5nXG4gIHZhciB5ID0gcHViLmRhdGEucHViX2tleVxuICB2YXIgdW5wYWNrZWQgPSBwYXJzZUtleXMuc2lnbmF0dXJlLmRlY29kZShzaWcsICdkZXInKVxuICB2YXIgcyA9IHVucGFja2VkLnNcbiAgdmFyIHIgPSB1bnBhY2tlZC5yXG4gIGNoZWNrVmFsdWUocywgcSlcbiAgY2hlY2tWYWx1ZShyLCBxKVxuICB2YXIgbW9udHAgPSBCTi5tb250KHApXG4gIHZhciB3ID0gcy5pbnZtKHEpXG4gIHZhciB2ID0gZy50b1JlZChtb250cClcbiAgICAucmVkUG93KG5ldyBCTihoYXNoKS5tdWwodykubW9kKHEpKVxuICAgIC5mcm9tUmVkKClcbiAgICAubXVsKHkudG9SZWQobW9udHApLnJlZFBvdyhyLm11bCh3KS5tb2QocSkpLmZyb21SZWQoKSlcbiAgICAubW9kKHApXG4gICAgLm1vZChxKVxuICByZXR1cm4gdi5jbXAocikgPT09IDBcbn1cblxuZnVuY3Rpb24gY2hlY2tWYWx1ZSAoYiwgcSkge1xuICBpZiAoYi5jbXBuKDApIDw9IDApIHRocm93IG5ldyBFcnJvcignaW52YWxpZCBzaWcnKVxuICBpZiAoYi5jbXAocSkgPj0gcSkgdGhyb3cgbmV3IEVycm9yKCdpbnZhbGlkIHNpZycpXG59XG5cbm1vZHVsZS5leHBvcnRzID0gdmVyaWZ5XG4iLCJ2YXIgY3JlYXRlSGFzaCA9IHJlcXVpcmUoJ2NyZWF0ZS1oYXNoJylcbnZhciBzdHJlYW0gPSByZXF1aXJlKCdzdHJlYW0nKVxudmFyIGluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKVxudmFyIHNpZ24gPSByZXF1aXJlKCcuL3NpZ24nKVxudmFyIHZlcmlmeSA9IHJlcXVpcmUoJy4vdmVyaWZ5JylcblxudmFyIGFsZ29yaXRobXMgPSByZXF1aXJlKCcuL2FsZ29yaXRobXMuanNvbicpXG5PYmplY3Qua2V5cyhhbGdvcml0aG1zKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgYWxnb3JpdGhtc1trZXldLmlkID0gbmV3IEJ1ZmZlcihhbGdvcml0aG1zW2tleV0uaWQsICdoZXgnKVxuICBhbGdvcml0aG1zW2tleS50b0xvd2VyQ2FzZSgpXSA9IGFsZ29yaXRobXNba2V5XVxufSlcblxuZnVuY3Rpb24gU2lnbiAoYWxnb3JpdGhtKSB7XG4gIHN0cmVhbS5Xcml0YWJsZS5jYWxsKHRoaXMpXG5cbiAgdmFyIGRhdGEgPSBhbGdvcml0aG1zW2FsZ29yaXRobV1cbiAgaWYgKCFkYXRhKSB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gbWVzc2FnZSBkaWdlc3QnKVxuXG4gIHRoaXMuX2hhc2hUeXBlID0gZGF0YS5oYXNoXG4gIHRoaXMuX2hhc2ggPSBjcmVhdGVIYXNoKGRhdGEuaGFzaClcbiAgdGhpcy5fdGFnID0gZGF0YS5pZFxuICB0aGlzLl9zaWduVHlwZSA9IGRhdGEuc2lnblxufVxuaW5oZXJpdHMoU2lnbiwgc3RyZWFtLldyaXRhYmxlKVxuXG5TaWduLnByb3RvdHlwZS5fd3JpdGUgPSBmdW5jdGlvbiBfd3JpdGUgKGRhdGEsIF8sIGRvbmUpIHtcbiAgdGhpcy5faGFzaC51cGRhdGUoZGF0YSlcbiAgZG9uZSgpXG59XG5cblNpZ24ucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uIHVwZGF0ZSAoZGF0YSwgZW5jKSB7XG4gIGlmICh0eXBlb2YgZGF0YSA9PT0gJ3N0cmluZycpIGRhdGEgPSBuZXcgQnVmZmVyKGRhdGEsIGVuYylcblxuICB0aGlzLl9oYXNoLnVwZGF0ZShkYXRhKVxuICByZXR1cm4gdGhpc1xufVxuXG5TaWduLnByb3RvdHlwZS5zaWduID0gZnVuY3Rpb24gc2lnbk1ldGhvZCAoa2V5LCBlbmMpIHtcbiAgdGhpcy5lbmQoKVxuICB2YXIgaGFzaCA9IHRoaXMuX2hhc2guZGlnZXN0KClcbiAgdmFyIHNpZyA9IHNpZ24oaGFzaCwga2V5LCB0aGlzLl9oYXNoVHlwZSwgdGhpcy5fc2lnblR5cGUsIHRoaXMuX3RhZylcblxuICByZXR1cm4gZW5jID8gc2lnLnRvU3RyaW5nKGVuYykgOiBzaWdcbn1cblxuZnVuY3Rpb24gVmVyaWZ5IChhbGdvcml0aG0pIHtcbiAgc3RyZWFtLldyaXRhYmxlLmNhbGwodGhpcylcblxuICB2YXIgZGF0YSA9IGFsZ29yaXRobXNbYWxnb3JpdGhtXVxuICBpZiAoIWRhdGEpIHRocm93IG5ldyBFcnJvcignVW5rbm93biBtZXNzYWdlIGRpZ2VzdCcpXG5cbiAgdGhpcy5faGFzaCA9IGNyZWF0ZUhhc2goZGF0YS5oYXNoKVxuICB0aGlzLl90YWcgPSBkYXRhLmlkXG4gIHRoaXMuX3NpZ25UeXBlID0gZGF0YS5zaWduXG59XG5pbmhlcml0cyhWZXJpZnksIHN0cmVhbS5Xcml0YWJsZSlcblxuVmVyaWZ5LnByb3RvdHlwZS5fd3JpdGUgPSBmdW5jdGlvbiBfd3JpdGUgKGRhdGEsIF8sIGRvbmUpIHtcbiAgdGhpcy5faGFzaC51cGRhdGUoZGF0YSlcbiAgZG9uZSgpXG59XG5cblZlcmlmeS5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gdXBkYXRlIChkYXRhLCBlbmMpIHtcbiAgaWYgKHR5cGVvZiBkYXRhID09PSAnc3RyaW5nJykgZGF0YSA9IG5ldyBCdWZmZXIoZGF0YSwgZW5jKVxuXG4gIHRoaXMuX2hhc2gudXBkYXRlKGRhdGEpXG4gIHJldHVybiB0aGlzXG59XG5cblZlcmlmeS5wcm90b3R5cGUudmVyaWZ5ID0gZnVuY3Rpb24gdmVyaWZ5TWV0aG9kIChrZXksIHNpZywgZW5jKSB7XG4gIGlmICh0eXBlb2Ygc2lnID09PSAnc3RyaW5nJykgc2lnID0gbmV3IEJ1ZmZlcihzaWcsIGVuYylcblxuICB0aGlzLmVuZCgpXG4gIHZhciBoYXNoID0gdGhpcy5faGFzaC5kaWdlc3QoKVxuICByZXR1cm4gdmVyaWZ5KHNpZywgaGFzaCwga2V5LCB0aGlzLl9zaWduVHlwZSwgdGhpcy5fdGFnKVxufVxuXG5mdW5jdGlvbiBjcmVhdGVTaWduIChhbGdvcml0aG0pIHtcbiAgcmV0dXJuIG5ldyBTaWduKGFsZ29yaXRobSlcbn1cblxuZnVuY3Rpb24gY3JlYXRlVmVyaWZ5IChhbGdvcml0aG0pIHtcbiAgcmV0dXJuIG5ldyBWZXJpZnkoYWxnb3JpdGhtKVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgU2lnbjogY3JlYXRlU2lnbixcbiAgVmVyaWZ5OiBjcmVhdGVWZXJpZnksXG4gIGNyZWF0ZVNpZ246IGNyZWF0ZVNpZ24sXG4gIGNyZWF0ZVZlcmlmeTogY3JlYXRlVmVyaWZ5XG59XG4iXSwic291cmNlUm9vdCI6IiJ9