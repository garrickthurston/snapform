(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["vendor/vendor.parse-asn1"],{

/***/ "1w4i":
/*!********************************************!*\
  !*** ./node_modules/parse-asn1/aesid.json ***!
  \********************************************/
/*! exports provided: 2.16.840.1.101.3.4.1.1, 2.16.840.1.101.3.4.1.2, 2.16.840.1.101.3.4.1.3, 2.16.840.1.101.3.4.1.4, 2.16.840.1.101.3.4.1.21, 2.16.840.1.101.3.4.1.22, 2.16.840.1.101.3.4.1.23, 2.16.840.1.101.3.4.1.24, 2.16.840.1.101.3.4.1.41, 2.16.840.1.101.3.4.1.42, 2.16.840.1.101.3.4.1.43, 2.16.840.1.101.3.4.1.44, default */
/***/ (function(module) {

module.exports = {"2.16.840.1.101.3.4.1.1":"aes-128-ecb","2.16.840.1.101.3.4.1.2":"aes-128-cbc","2.16.840.1.101.3.4.1.3":"aes-128-ofb","2.16.840.1.101.3.4.1.4":"aes-128-cfb","2.16.840.1.101.3.4.1.21":"aes-192-ecb","2.16.840.1.101.3.4.1.22":"aes-192-cbc","2.16.840.1.101.3.4.1.23":"aes-192-ofb","2.16.840.1.101.3.4.1.24":"aes-192-cfb","2.16.840.1.101.3.4.1.41":"aes-256-ecb","2.16.840.1.101.3.4.1.42":"aes-256-cbc","2.16.840.1.101.3.4.1.43":"aes-256-ofb","2.16.840.1.101.3.4.1.44":"aes-256-cfb"};

/***/ }),

/***/ "Ku4m":
/*!******************************************!*\
  !*** ./node_modules/parse-asn1/index.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var asn1 = __webpack_require__(/*! ./asn1 */ "QRH4")
var aesid = __webpack_require__(/*! ./aesid.json */ "1w4i")
var fixProc = __webpack_require__(/*! ./fixProc */ "TdD3")
var ciphers = __webpack_require__(/*! browserify-aes */ "/ab2")
var compat = __webpack_require__(/*! pbkdf2 */ "oJl4")
var Buffer = __webpack_require__(/*! safe-buffer */ "hwdV").Buffer
module.exports = parseKeys

function parseKeys (buffer) {
  var password
  if (typeof buffer === 'object' && !Buffer.isBuffer(buffer)) {
    password = buffer.passphrase
    buffer = buffer.key
  }
  if (typeof buffer === 'string') {
    buffer = Buffer.from(buffer)
  }

  var stripped = fixProc(buffer, password)

  var type = stripped.tag
  var data = stripped.data
  var subtype, ndata
  switch (type) {
    case 'CERTIFICATE':
      ndata = asn1.certificate.decode(data, 'der').tbsCertificate.subjectPublicKeyInfo
      // falls through
    case 'PUBLIC KEY':
      if (!ndata) {
        ndata = asn1.PublicKey.decode(data, 'der')
      }
      subtype = ndata.algorithm.algorithm.join('.')
      switch (subtype) {
        case '1.2.840.113549.1.1.1':
          return asn1.RSAPublicKey.decode(ndata.subjectPublicKey.data, 'der')
        case '1.2.840.10045.2.1':
          ndata.subjectPrivateKey = ndata.subjectPublicKey
          return {
            type: 'ec',
            data: ndata
          }
        case '1.2.840.10040.4.1':
          ndata.algorithm.params.pub_key = asn1.DSAparam.decode(ndata.subjectPublicKey.data, 'der')
          return {
            type: 'dsa',
            data: ndata.algorithm.params
          }
        default: throw new Error('unknown key id ' + subtype)
      }
      throw new Error('unknown key type ' + type)
    case 'ENCRYPTED PRIVATE KEY':
      data = asn1.EncryptedPrivateKey.decode(data, 'der')
      data = decrypt(data, password)
      // falls through
    case 'PRIVATE KEY':
      ndata = asn1.PrivateKey.decode(data, 'der')
      subtype = ndata.algorithm.algorithm.join('.')
      switch (subtype) {
        case '1.2.840.113549.1.1.1':
          return asn1.RSAPrivateKey.decode(ndata.subjectPrivateKey, 'der')
        case '1.2.840.10045.2.1':
          return {
            curve: ndata.algorithm.curve,
            privateKey: asn1.ECPrivateKey.decode(ndata.subjectPrivateKey, 'der').privateKey
          }
        case '1.2.840.10040.4.1':
          ndata.algorithm.params.priv_key = asn1.DSAparam.decode(ndata.subjectPrivateKey, 'der')
          return {
            type: 'dsa',
            params: ndata.algorithm.params
          }
        default: throw new Error('unknown key id ' + subtype)
      }
      throw new Error('unknown key type ' + type)
    case 'RSA PUBLIC KEY':
      return asn1.RSAPublicKey.decode(data, 'der')
    case 'RSA PRIVATE KEY':
      return asn1.RSAPrivateKey.decode(data, 'der')
    case 'DSA PRIVATE KEY':
      return {
        type: 'dsa',
        params: asn1.DSAPrivateKey.decode(data, 'der')
      }
    case 'EC PRIVATE KEY':
      data = asn1.ECPrivateKey.decode(data, 'der')
      return {
        curve: data.parameters.value,
        privateKey: data.privateKey
      }
    default: throw new Error('unknown key type ' + type)
  }
}
parseKeys.signature = asn1.signature
function decrypt (data, password) {
  var salt = data.algorithm.decrypt.kde.kdeparams.salt
  var iters = parseInt(data.algorithm.decrypt.kde.kdeparams.iters.toString(), 10)
  var algo = aesid[data.algorithm.decrypt.cipher.algo.join('.')]
  var iv = data.algorithm.decrypt.cipher.iv
  var cipherText = data.subjectPrivateKey
  var keylen = parseInt(algo.split('-')[1], 10) / 8
  var key = compat.pbkdf2Sync(password, salt, iters, keylen, 'sha1')
  var cipher = ciphers.createDecipheriv(algo, key, iv)
  var out = []
  out.push(cipher.update(cipherText))
  out.push(cipher.final())
  return Buffer.concat(out)
}


/***/ }),

/***/ "QRH4":
/*!*****************************************!*\
  !*** ./node_modules/parse-asn1/asn1.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// from https://github.com/indutny/self-signed/blob/gh-pages/lib/asn1.js
// Fedor, you are amazing.


var asn1 = __webpack_require__(/*! asn1.js */ "f3pb")

exports.certificate = __webpack_require__(/*! ./certificate */ "VrUr")

var RSAPrivateKey = asn1.define('RSAPrivateKey', function () {
  this.seq().obj(
    this.key('version').int(),
    this.key('modulus').int(),
    this.key('publicExponent').int(),
    this.key('privateExponent').int(),
    this.key('prime1').int(),
    this.key('prime2').int(),
    this.key('exponent1').int(),
    this.key('exponent2').int(),
    this.key('coefficient').int()
  )
})
exports.RSAPrivateKey = RSAPrivateKey

var RSAPublicKey = asn1.define('RSAPublicKey', function () {
  this.seq().obj(
    this.key('modulus').int(),
    this.key('publicExponent').int()
  )
})
exports.RSAPublicKey = RSAPublicKey

var PublicKey = asn1.define('SubjectPublicKeyInfo', function () {
  this.seq().obj(
    this.key('algorithm').use(AlgorithmIdentifier),
    this.key('subjectPublicKey').bitstr()
  )
})
exports.PublicKey = PublicKey

var AlgorithmIdentifier = asn1.define('AlgorithmIdentifier', function () {
  this.seq().obj(
    this.key('algorithm').objid(),
    this.key('none').null_().optional(),
    this.key('curve').objid().optional(),
    this.key('params').seq().obj(
      this.key('p').int(),
      this.key('q').int(),
      this.key('g').int()
    ).optional()
  )
})

var PrivateKeyInfo = asn1.define('PrivateKeyInfo', function () {
  this.seq().obj(
    this.key('version').int(),
    this.key('algorithm').use(AlgorithmIdentifier),
    this.key('subjectPrivateKey').octstr()
  )
})
exports.PrivateKey = PrivateKeyInfo
var EncryptedPrivateKeyInfo = asn1.define('EncryptedPrivateKeyInfo', function () {
  this.seq().obj(
    this.key('algorithm').seq().obj(
      this.key('id').objid(),
      this.key('decrypt').seq().obj(
        this.key('kde').seq().obj(
          this.key('id').objid(),
          this.key('kdeparams').seq().obj(
            this.key('salt').octstr(),
            this.key('iters').int()
          )
        ),
        this.key('cipher').seq().obj(
          this.key('algo').objid(),
          this.key('iv').octstr()
        )
      )
    ),
    this.key('subjectPrivateKey').octstr()
  )
})

exports.EncryptedPrivateKey = EncryptedPrivateKeyInfo

var DSAPrivateKey = asn1.define('DSAPrivateKey', function () {
  this.seq().obj(
    this.key('version').int(),
    this.key('p').int(),
    this.key('q').int(),
    this.key('g').int(),
    this.key('pub_key').int(),
    this.key('priv_key').int()
  )
})
exports.DSAPrivateKey = DSAPrivateKey

exports.DSAparam = asn1.define('DSAparam', function () {
  this.int()
})

var ECPrivateKey = asn1.define('ECPrivateKey', function () {
  this.seq().obj(
    this.key('version').int(),
    this.key('privateKey').octstr(),
    this.key('parameters').optional().explicit(0).use(ECParameters),
    this.key('publicKey').optional().explicit(1).bitstr()
  )
})
exports.ECPrivateKey = ECPrivateKey

var ECParameters = asn1.define('ECParameters', function () {
  this.choice({
    namedCurve: this.objid()
  })
})

exports.signature = asn1.define('signature', function () {
  this.seq().obj(
    this.key('r').int(),
    this.key('s').int()
  )
})


/***/ }),

/***/ "TdD3":
/*!********************************************!*\
  !*** ./node_modules/parse-asn1/fixProc.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer) {// adapted from https://github.com/apatil/pemstrip
var findProc = /Proc-Type: 4,ENCRYPTED[\n\r]+DEK-Info: AES-((?:128)|(?:192)|(?:256))-CBC,([0-9A-H]+)[\n\r]+([0-9A-z\n\r\+\/\=]+)[\n\r]+/m
var startRegex = /^-----BEGIN ((?:.* KEY)|CERTIFICATE)-----/m
var fullRegex = /^-----BEGIN ((?:.* KEY)|CERTIFICATE)-----([0-9A-z\n\r\+\/\=]+)-----END \1-----$/m
var evp = __webpack_require__(/*! evp_bytestokey */ "roQf")
var ciphers = __webpack_require__(/*! browserify-aes */ "/ab2")
module.exports = function (okey, password) {
  var key = okey.toString()
  var match = key.match(findProc)
  var decrypted
  if (!match) {
    var match2 = key.match(fullRegex)
    decrypted = new Buffer(match2[2].replace(/[\r\n]/g, ''), 'base64')
  } else {
    var suite = 'aes' + match[1]
    var iv = new Buffer(match[2], 'hex')
    var cipherText = new Buffer(match[3].replace(/[\r\n]/g, ''), 'base64')
    var cipherKey = evp(password, iv.slice(0, 8), parseInt(match[1], 10)).key
    var out = []
    var cipher = ciphers.createDecipheriv(suite, cipherKey, iv)
    out.push(cipher.update(cipherText))
    out.push(cipher.final())
    decrypted = Buffer.concat(out)
  }
  var tag = key.match(startRegex)[1]
  return {
    tag: tag,
    data: decrypted
  }
}

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../buffer/index.js */ "tjlA").Buffer))

/***/ }),

/***/ "VrUr":
/*!************************************************!*\
  !*** ./node_modules/parse-asn1/certificate.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// from https://github.com/Rantanen/node-dtls/blob/25a7dc861bda38cfeac93a723500eea4f0ac2e86/Certificate.js
// thanks to @Rantanen



var asn = __webpack_require__(/*! asn1.js */ "f3pb")

var Time = asn.define('Time', function () {
  this.choice({
    utcTime: this.utctime(),
    generalTime: this.gentime()
  })
})

var AttributeTypeValue = asn.define('AttributeTypeValue', function () {
  this.seq().obj(
    this.key('type').objid(),
    this.key('value').any()
  )
})

var AlgorithmIdentifier = asn.define('AlgorithmIdentifier', function () {
  this.seq().obj(
    this.key('algorithm').objid(),
    this.key('parameters').optional(),
    this.key('curve').objid().optional()
  )
})

var SubjectPublicKeyInfo = asn.define('SubjectPublicKeyInfo', function () {
  this.seq().obj(
    this.key('algorithm').use(AlgorithmIdentifier),
    this.key('subjectPublicKey').bitstr()
  )
})

var RelativeDistinguishedName = asn.define('RelativeDistinguishedName', function () {
  this.setof(AttributeTypeValue)
})

var RDNSequence = asn.define('RDNSequence', function () {
  this.seqof(RelativeDistinguishedName)
})

var Name = asn.define('Name', function () {
  this.choice({
    rdnSequence: this.use(RDNSequence)
  })
})

var Validity = asn.define('Validity', function () {
  this.seq().obj(
    this.key('notBefore').use(Time),
    this.key('notAfter').use(Time)
  )
})

var Extension = asn.define('Extension', function () {
  this.seq().obj(
    this.key('extnID').objid(),
    this.key('critical').bool().def(false),
    this.key('extnValue').octstr()
  )
})

var TBSCertificate = asn.define('TBSCertificate', function () {
  this.seq().obj(
    this.key('version').explicit(0).int().optional(),
    this.key('serialNumber').int(),
    this.key('signature').use(AlgorithmIdentifier),
    this.key('issuer').use(Name),
    this.key('validity').use(Validity),
    this.key('subject').use(Name),
    this.key('subjectPublicKeyInfo').use(SubjectPublicKeyInfo),
    this.key('issuerUniqueID').implicit(1).bitstr().optional(),
    this.key('subjectUniqueID').implicit(2).bitstr().optional(),
    this.key('extensions').explicit(3).seqof(Extension).optional()
  )
})

var X509Certificate = asn.define('X509Certificate', function () {
  this.seq().obj(
    this.key('tbsCertificate').use(TBSCertificate),
    this.key('signatureAlgorithm').use(AlgorithmIdentifier),
    this.key('signatureValue').bitstr()
  )
})

module.exports = X509Certificate


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcGFyc2UtYXNuMS9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcGFyc2UtYXNuMS9hc24xLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9wYXJzZS1hc24xL2ZpeFByb2MuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3BhcnNlLWFzbjEvY2VydGlmaWNhdGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxXQUFXLG1CQUFPLENBQUMsb0JBQVE7QUFDM0IsWUFBWSxtQkFBTyxDQUFDLDBCQUFjO0FBQ2xDLGNBQWMsbUJBQU8sQ0FBQyx1QkFBVztBQUNqQyxjQUFjLG1CQUFPLENBQUMsNEJBQWdCO0FBQ3RDLGFBQWEsbUJBQU8sQ0FBQyxvQkFBUTtBQUM3QixhQUFhLG1CQUFPLENBQUMseUJBQWE7QUFDbEM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7OztBQzFHQTtBQUNBO0FBQ1k7O0FBRVosV0FBVyxtQkFBTyxDQUFDLHFCQUFTOztBQUU1QixzQkFBc0IsbUJBQU8sQ0FBQywyQkFBZTs7QUFFN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7O0FBRUE7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNILENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7Ozs7Ozs7Ozs7OztBQ3pIRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVUsbUJBQU8sQ0FBQyw0QkFBZ0I7QUFDbEMsY0FBYyxtQkFBTyxDQUFDLDRCQUFnQjtBQUN0QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7QUM3QkE7QUFDQTs7QUFFWTs7QUFFWixVQUFVLG1CQUFPLENBQUMscUJBQVM7O0FBRTNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNILENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEIiwiZmlsZSI6ImJ1aWxkL3ZlbmRvci92ZW5kb3IucGFyc2UtYXNuMS4yZWNhOGI1NWYyZTNhYWYxZTRhNC5jaHVuay5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBhc24xID0gcmVxdWlyZSgnLi9hc24xJylcclxudmFyIGFlc2lkID0gcmVxdWlyZSgnLi9hZXNpZC5qc29uJylcclxudmFyIGZpeFByb2MgPSByZXF1aXJlKCcuL2ZpeFByb2MnKVxyXG52YXIgY2lwaGVycyA9IHJlcXVpcmUoJ2Jyb3dzZXJpZnktYWVzJylcclxudmFyIGNvbXBhdCA9IHJlcXVpcmUoJ3Bia2RmMicpXHJcbnZhciBCdWZmZXIgPSByZXF1aXJlKCdzYWZlLWJ1ZmZlcicpLkJ1ZmZlclxyXG5tb2R1bGUuZXhwb3J0cyA9IHBhcnNlS2V5c1xyXG5cclxuZnVuY3Rpb24gcGFyc2VLZXlzIChidWZmZXIpIHtcclxuICB2YXIgcGFzc3dvcmRcclxuICBpZiAodHlwZW9mIGJ1ZmZlciA9PT0gJ29iamVjdCcgJiYgIUJ1ZmZlci5pc0J1ZmZlcihidWZmZXIpKSB7XHJcbiAgICBwYXNzd29yZCA9IGJ1ZmZlci5wYXNzcGhyYXNlXHJcbiAgICBidWZmZXIgPSBidWZmZXIua2V5XHJcbiAgfVxyXG4gIGlmICh0eXBlb2YgYnVmZmVyID09PSAnc3RyaW5nJykge1xyXG4gICAgYnVmZmVyID0gQnVmZmVyLmZyb20oYnVmZmVyKVxyXG4gIH1cclxuXHJcbiAgdmFyIHN0cmlwcGVkID0gZml4UHJvYyhidWZmZXIsIHBhc3N3b3JkKVxyXG5cclxuICB2YXIgdHlwZSA9IHN0cmlwcGVkLnRhZ1xyXG4gIHZhciBkYXRhID0gc3RyaXBwZWQuZGF0YVxyXG4gIHZhciBzdWJ0eXBlLCBuZGF0YVxyXG4gIHN3aXRjaCAodHlwZSkge1xyXG4gICAgY2FzZSAnQ0VSVElGSUNBVEUnOlxyXG4gICAgICBuZGF0YSA9IGFzbjEuY2VydGlmaWNhdGUuZGVjb2RlKGRhdGEsICdkZXInKS50YnNDZXJ0aWZpY2F0ZS5zdWJqZWN0UHVibGljS2V5SW5mb1xyXG4gICAgICAvLyBmYWxscyB0aHJvdWdoXHJcbiAgICBjYXNlICdQVUJMSUMgS0VZJzpcclxuICAgICAgaWYgKCFuZGF0YSkge1xyXG4gICAgICAgIG5kYXRhID0gYXNuMS5QdWJsaWNLZXkuZGVjb2RlKGRhdGEsICdkZXInKVxyXG4gICAgICB9XHJcbiAgICAgIHN1YnR5cGUgPSBuZGF0YS5hbGdvcml0aG0uYWxnb3JpdGhtLmpvaW4oJy4nKVxyXG4gICAgICBzd2l0Y2ggKHN1YnR5cGUpIHtcclxuICAgICAgICBjYXNlICcxLjIuODQwLjExMzU0OS4xLjEuMSc6XHJcbiAgICAgICAgICByZXR1cm4gYXNuMS5SU0FQdWJsaWNLZXkuZGVjb2RlKG5kYXRhLnN1YmplY3RQdWJsaWNLZXkuZGF0YSwgJ2RlcicpXHJcbiAgICAgICAgY2FzZSAnMS4yLjg0MC4xMDA0NS4yLjEnOlxyXG4gICAgICAgICAgbmRhdGEuc3ViamVjdFByaXZhdGVLZXkgPSBuZGF0YS5zdWJqZWN0UHVibGljS2V5XHJcbiAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICB0eXBlOiAnZWMnLFxyXG4gICAgICAgICAgICBkYXRhOiBuZGF0YVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIGNhc2UgJzEuMi44NDAuMTAwNDAuNC4xJzpcclxuICAgICAgICAgIG5kYXRhLmFsZ29yaXRobS5wYXJhbXMucHViX2tleSA9IGFzbjEuRFNBcGFyYW0uZGVjb2RlKG5kYXRhLnN1YmplY3RQdWJsaWNLZXkuZGF0YSwgJ2RlcicpXHJcbiAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICB0eXBlOiAnZHNhJyxcclxuICAgICAgICAgICAgZGF0YTogbmRhdGEuYWxnb3JpdGhtLnBhcmFtc1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIGRlZmF1bHQ6IHRocm93IG5ldyBFcnJvcigndW5rbm93biBrZXkgaWQgJyArIHN1YnR5cGUpXHJcbiAgICAgIH1cclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCd1bmtub3duIGtleSB0eXBlICcgKyB0eXBlKVxyXG4gICAgY2FzZSAnRU5DUllQVEVEIFBSSVZBVEUgS0VZJzpcclxuICAgICAgZGF0YSA9IGFzbjEuRW5jcnlwdGVkUHJpdmF0ZUtleS5kZWNvZGUoZGF0YSwgJ2RlcicpXHJcbiAgICAgIGRhdGEgPSBkZWNyeXB0KGRhdGEsIHBhc3N3b3JkKVxyXG4gICAgICAvLyBmYWxscyB0aHJvdWdoXHJcbiAgICBjYXNlICdQUklWQVRFIEtFWSc6XHJcbiAgICAgIG5kYXRhID0gYXNuMS5Qcml2YXRlS2V5LmRlY29kZShkYXRhLCAnZGVyJylcclxuICAgICAgc3VidHlwZSA9IG5kYXRhLmFsZ29yaXRobS5hbGdvcml0aG0uam9pbignLicpXHJcbiAgICAgIHN3aXRjaCAoc3VidHlwZSkge1xyXG4gICAgICAgIGNhc2UgJzEuMi44NDAuMTEzNTQ5LjEuMS4xJzpcclxuICAgICAgICAgIHJldHVybiBhc24xLlJTQVByaXZhdGVLZXkuZGVjb2RlKG5kYXRhLnN1YmplY3RQcml2YXRlS2V5LCAnZGVyJylcclxuICAgICAgICBjYXNlICcxLjIuODQwLjEwMDQ1LjIuMSc6XHJcbiAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBjdXJ2ZTogbmRhdGEuYWxnb3JpdGhtLmN1cnZlLFxyXG4gICAgICAgICAgICBwcml2YXRlS2V5OiBhc24xLkVDUHJpdmF0ZUtleS5kZWNvZGUobmRhdGEuc3ViamVjdFByaXZhdGVLZXksICdkZXInKS5wcml2YXRlS2V5XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgY2FzZSAnMS4yLjg0MC4xMDA0MC40LjEnOlxyXG4gICAgICAgICAgbmRhdGEuYWxnb3JpdGhtLnBhcmFtcy5wcml2X2tleSA9IGFzbjEuRFNBcGFyYW0uZGVjb2RlKG5kYXRhLnN1YmplY3RQcml2YXRlS2V5LCAnZGVyJylcclxuICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHR5cGU6ICdkc2EnLFxyXG4gICAgICAgICAgICBwYXJhbXM6IG5kYXRhLmFsZ29yaXRobS5wYXJhbXNcclxuICAgICAgICAgIH1cclxuICAgICAgICBkZWZhdWx0OiB0aHJvdyBuZXcgRXJyb3IoJ3Vua25vd24ga2V5IGlkICcgKyBzdWJ0eXBlKVxyXG4gICAgICB9XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcigndW5rbm93biBrZXkgdHlwZSAnICsgdHlwZSlcclxuICAgIGNhc2UgJ1JTQSBQVUJMSUMgS0VZJzpcclxuICAgICAgcmV0dXJuIGFzbjEuUlNBUHVibGljS2V5LmRlY29kZShkYXRhLCAnZGVyJylcclxuICAgIGNhc2UgJ1JTQSBQUklWQVRFIEtFWSc6XHJcbiAgICAgIHJldHVybiBhc24xLlJTQVByaXZhdGVLZXkuZGVjb2RlKGRhdGEsICdkZXInKVxyXG4gICAgY2FzZSAnRFNBIFBSSVZBVEUgS0VZJzpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiAnZHNhJyxcclxuICAgICAgICBwYXJhbXM6IGFzbjEuRFNBUHJpdmF0ZUtleS5kZWNvZGUoZGF0YSwgJ2RlcicpXHJcbiAgICAgIH1cclxuICAgIGNhc2UgJ0VDIFBSSVZBVEUgS0VZJzpcclxuICAgICAgZGF0YSA9IGFzbjEuRUNQcml2YXRlS2V5LmRlY29kZShkYXRhLCAnZGVyJylcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICBjdXJ2ZTogZGF0YS5wYXJhbWV0ZXJzLnZhbHVlLFxyXG4gICAgICAgIHByaXZhdGVLZXk6IGRhdGEucHJpdmF0ZUtleVxyXG4gICAgICB9XHJcbiAgICBkZWZhdWx0OiB0aHJvdyBuZXcgRXJyb3IoJ3Vua25vd24ga2V5IHR5cGUgJyArIHR5cGUpXHJcbiAgfVxyXG59XHJcbnBhcnNlS2V5cy5zaWduYXR1cmUgPSBhc24xLnNpZ25hdHVyZVxyXG5mdW5jdGlvbiBkZWNyeXB0IChkYXRhLCBwYXNzd29yZCkge1xyXG4gIHZhciBzYWx0ID0gZGF0YS5hbGdvcml0aG0uZGVjcnlwdC5rZGUua2RlcGFyYW1zLnNhbHRcclxuICB2YXIgaXRlcnMgPSBwYXJzZUludChkYXRhLmFsZ29yaXRobS5kZWNyeXB0LmtkZS5rZGVwYXJhbXMuaXRlcnMudG9TdHJpbmcoKSwgMTApXHJcbiAgdmFyIGFsZ28gPSBhZXNpZFtkYXRhLmFsZ29yaXRobS5kZWNyeXB0LmNpcGhlci5hbGdvLmpvaW4oJy4nKV1cclxuICB2YXIgaXYgPSBkYXRhLmFsZ29yaXRobS5kZWNyeXB0LmNpcGhlci5pdlxyXG4gIHZhciBjaXBoZXJUZXh0ID0gZGF0YS5zdWJqZWN0UHJpdmF0ZUtleVxyXG4gIHZhciBrZXlsZW4gPSBwYXJzZUludChhbGdvLnNwbGl0KCctJylbMV0sIDEwKSAvIDhcclxuICB2YXIga2V5ID0gY29tcGF0LnBia2RmMlN5bmMocGFzc3dvcmQsIHNhbHQsIGl0ZXJzLCBrZXlsZW4sICdzaGExJylcclxuICB2YXIgY2lwaGVyID0gY2lwaGVycy5jcmVhdGVEZWNpcGhlcml2KGFsZ28sIGtleSwgaXYpXHJcbiAgdmFyIG91dCA9IFtdXHJcbiAgb3V0LnB1c2goY2lwaGVyLnVwZGF0ZShjaXBoZXJUZXh0KSlcclxuICBvdXQucHVzaChjaXBoZXIuZmluYWwoKSlcclxuICByZXR1cm4gQnVmZmVyLmNvbmNhdChvdXQpXHJcbn1cclxuIiwiLy8gZnJvbSBodHRwczovL2dpdGh1Yi5jb20vaW5kdXRueS9zZWxmLXNpZ25lZC9ibG9iL2doLXBhZ2VzL2xpYi9hc24xLmpzXHJcbi8vIEZlZG9yLCB5b3UgYXJlIGFtYXppbmcuXHJcbid1c2Ugc3RyaWN0J1xyXG5cclxudmFyIGFzbjEgPSByZXF1aXJlKCdhc24xLmpzJylcclxuXHJcbmV4cG9ydHMuY2VydGlmaWNhdGUgPSByZXF1aXJlKCcuL2NlcnRpZmljYXRlJylcclxuXHJcbnZhciBSU0FQcml2YXRlS2V5ID0gYXNuMS5kZWZpbmUoJ1JTQVByaXZhdGVLZXknLCBmdW5jdGlvbiAoKSB7XHJcbiAgdGhpcy5zZXEoKS5vYmooXHJcbiAgICB0aGlzLmtleSgndmVyc2lvbicpLmludCgpLFxyXG4gICAgdGhpcy5rZXkoJ21vZHVsdXMnKS5pbnQoKSxcclxuICAgIHRoaXMua2V5KCdwdWJsaWNFeHBvbmVudCcpLmludCgpLFxyXG4gICAgdGhpcy5rZXkoJ3ByaXZhdGVFeHBvbmVudCcpLmludCgpLFxyXG4gICAgdGhpcy5rZXkoJ3ByaW1lMScpLmludCgpLFxyXG4gICAgdGhpcy5rZXkoJ3ByaW1lMicpLmludCgpLFxyXG4gICAgdGhpcy5rZXkoJ2V4cG9uZW50MScpLmludCgpLFxyXG4gICAgdGhpcy5rZXkoJ2V4cG9uZW50MicpLmludCgpLFxyXG4gICAgdGhpcy5rZXkoJ2NvZWZmaWNpZW50JykuaW50KClcclxuICApXHJcbn0pXHJcbmV4cG9ydHMuUlNBUHJpdmF0ZUtleSA9IFJTQVByaXZhdGVLZXlcclxuXHJcbnZhciBSU0FQdWJsaWNLZXkgPSBhc24xLmRlZmluZSgnUlNBUHVibGljS2V5JywgZnVuY3Rpb24gKCkge1xyXG4gIHRoaXMuc2VxKCkub2JqKFxyXG4gICAgdGhpcy5rZXkoJ21vZHVsdXMnKS5pbnQoKSxcclxuICAgIHRoaXMua2V5KCdwdWJsaWNFeHBvbmVudCcpLmludCgpXHJcbiAgKVxyXG59KVxyXG5leHBvcnRzLlJTQVB1YmxpY0tleSA9IFJTQVB1YmxpY0tleVxyXG5cclxudmFyIFB1YmxpY0tleSA9IGFzbjEuZGVmaW5lKCdTdWJqZWN0UHVibGljS2V5SW5mbycsIGZ1bmN0aW9uICgpIHtcclxuICB0aGlzLnNlcSgpLm9iaihcclxuICAgIHRoaXMua2V5KCdhbGdvcml0aG0nKS51c2UoQWxnb3JpdGhtSWRlbnRpZmllciksXHJcbiAgICB0aGlzLmtleSgnc3ViamVjdFB1YmxpY0tleScpLmJpdHN0cigpXHJcbiAgKVxyXG59KVxyXG5leHBvcnRzLlB1YmxpY0tleSA9IFB1YmxpY0tleVxyXG5cclxudmFyIEFsZ29yaXRobUlkZW50aWZpZXIgPSBhc24xLmRlZmluZSgnQWxnb3JpdGhtSWRlbnRpZmllcicsIGZ1bmN0aW9uICgpIHtcclxuICB0aGlzLnNlcSgpLm9iaihcclxuICAgIHRoaXMua2V5KCdhbGdvcml0aG0nKS5vYmppZCgpLFxyXG4gICAgdGhpcy5rZXkoJ25vbmUnKS5udWxsXygpLm9wdGlvbmFsKCksXHJcbiAgICB0aGlzLmtleSgnY3VydmUnKS5vYmppZCgpLm9wdGlvbmFsKCksXHJcbiAgICB0aGlzLmtleSgncGFyYW1zJykuc2VxKCkub2JqKFxyXG4gICAgICB0aGlzLmtleSgncCcpLmludCgpLFxyXG4gICAgICB0aGlzLmtleSgncScpLmludCgpLFxyXG4gICAgICB0aGlzLmtleSgnZycpLmludCgpXHJcbiAgICApLm9wdGlvbmFsKClcclxuICApXHJcbn0pXHJcblxyXG52YXIgUHJpdmF0ZUtleUluZm8gPSBhc24xLmRlZmluZSgnUHJpdmF0ZUtleUluZm8nLCBmdW5jdGlvbiAoKSB7XHJcbiAgdGhpcy5zZXEoKS5vYmooXHJcbiAgICB0aGlzLmtleSgndmVyc2lvbicpLmludCgpLFxyXG4gICAgdGhpcy5rZXkoJ2FsZ29yaXRobScpLnVzZShBbGdvcml0aG1JZGVudGlmaWVyKSxcclxuICAgIHRoaXMua2V5KCdzdWJqZWN0UHJpdmF0ZUtleScpLm9jdHN0cigpXHJcbiAgKVxyXG59KVxyXG5leHBvcnRzLlByaXZhdGVLZXkgPSBQcml2YXRlS2V5SW5mb1xyXG52YXIgRW5jcnlwdGVkUHJpdmF0ZUtleUluZm8gPSBhc24xLmRlZmluZSgnRW5jcnlwdGVkUHJpdmF0ZUtleUluZm8nLCBmdW5jdGlvbiAoKSB7XHJcbiAgdGhpcy5zZXEoKS5vYmooXHJcbiAgICB0aGlzLmtleSgnYWxnb3JpdGhtJykuc2VxKCkub2JqKFxyXG4gICAgICB0aGlzLmtleSgnaWQnKS5vYmppZCgpLFxyXG4gICAgICB0aGlzLmtleSgnZGVjcnlwdCcpLnNlcSgpLm9iaihcclxuICAgICAgICB0aGlzLmtleSgna2RlJykuc2VxKCkub2JqKFxyXG4gICAgICAgICAgdGhpcy5rZXkoJ2lkJykub2JqaWQoKSxcclxuICAgICAgICAgIHRoaXMua2V5KCdrZGVwYXJhbXMnKS5zZXEoKS5vYmooXHJcbiAgICAgICAgICAgIHRoaXMua2V5KCdzYWx0Jykub2N0c3RyKCksXHJcbiAgICAgICAgICAgIHRoaXMua2V5KCdpdGVycycpLmludCgpXHJcbiAgICAgICAgICApXHJcbiAgICAgICAgKSxcclxuICAgICAgICB0aGlzLmtleSgnY2lwaGVyJykuc2VxKCkub2JqKFxyXG4gICAgICAgICAgdGhpcy5rZXkoJ2FsZ28nKS5vYmppZCgpLFxyXG4gICAgICAgICAgdGhpcy5rZXkoJ2l2Jykub2N0c3RyKClcclxuICAgICAgICApXHJcbiAgICAgIClcclxuICAgICksXHJcbiAgICB0aGlzLmtleSgnc3ViamVjdFByaXZhdGVLZXknKS5vY3RzdHIoKVxyXG4gIClcclxufSlcclxuXHJcbmV4cG9ydHMuRW5jcnlwdGVkUHJpdmF0ZUtleSA9IEVuY3J5cHRlZFByaXZhdGVLZXlJbmZvXHJcblxyXG52YXIgRFNBUHJpdmF0ZUtleSA9IGFzbjEuZGVmaW5lKCdEU0FQcml2YXRlS2V5JywgZnVuY3Rpb24gKCkge1xyXG4gIHRoaXMuc2VxKCkub2JqKFxyXG4gICAgdGhpcy5rZXkoJ3ZlcnNpb24nKS5pbnQoKSxcclxuICAgIHRoaXMua2V5KCdwJykuaW50KCksXHJcbiAgICB0aGlzLmtleSgncScpLmludCgpLFxyXG4gICAgdGhpcy5rZXkoJ2cnKS5pbnQoKSxcclxuICAgIHRoaXMua2V5KCdwdWJfa2V5JykuaW50KCksXHJcbiAgICB0aGlzLmtleSgncHJpdl9rZXknKS5pbnQoKVxyXG4gIClcclxufSlcclxuZXhwb3J0cy5EU0FQcml2YXRlS2V5ID0gRFNBUHJpdmF0ZUtleVxyXG5cclxuZXhwb3J0cy5EU0FwYXJhbSA9IGFzbjEuZGVmaW5lKCdEU0FwYXJhbScsIGZ1bmN0aW9uICgpIHtcclxuICB0aGlzLmludCgpXHJcbn0pXHJcblxyXG52YXIgRUNQcml2YXRlS2V5ID0gYXNuMS5kZWZpbmUoJ0VDUHJpdmF0ZUtleScsIGZ1bmN0aW9uICgpIHtcclxuICB0aGlzLnNlcSgpLm9iaihcclxuICAgIHRoaXMua2V5KCd2ZXJzaW9uJykuaW50KCksXHJcbiAgICB0aGlzLmtleSgncHJpdmF0ZUtleScpLm9jdHN0cigpLFxyXG4gICAgdGhpcy5rZXkoJ3BhcmFtZXRlcnMnKS5vcHRpb25hbCgpLmV4cGxpY2l0KDApLnVzZShFQ1BhcmFtZXRlcnMpLFxyXG4gICAgdGhpcy5rZXkoJ3B1YmxpY0tleScpLm9wdGlvbmFsKCkuZXhwbGljaXQoMSkuYml0c3RyKClcclxuICApXHJcbn0pXHJcbmV4cG9ydHMuRUNQcml2YXRlS2V5ID0gRUNQcml2YXRlS2V5XHJcblxyXG52YXIgRUNQYXJhbWV0ZXJzID0gYXNuMS5kZWZpbmUoJ0VDUGFyYW1ldGVycycsIGZ1bmN0aW9uICgpIHtcclxuICB0aGlzLmNob2ljZSh7XHJcbiAgICBuYW1lZEN1cnZlOiB0aGlzLm9iamlkKClcclxuICB9KVxyXG59KVxyXG5cclxuZXhwb3J0cy5zaWduYXR1cmUgPSBhc24xLmRlZmluZSgnc2lnbmF0dXJlJywgZnVuY3Rpb24gKCkge1xyXG4gIHRoaXMuc2VxKCkub2JqKFxyXG4gICAgdGhpcy5rZXkoJ3InKS5pbnQoKSxcclxuICAgIHRoaXMua2V5KCdzJykuaW50KClcclxuICApXHJcbn0pXHJcbiIsIi8vIGFkYXB0ZWQgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vYXBhdGlsL3BlbXN0cmlwXHJcbnZhciBmaW5kUHJvYyA9IC9Qcm9jLVR5cGU6IDQsRU5DUllQVEVEW1xcblxccl0rREVLLUluZm86IEFFUy0oKD86MTI4KXwoPzoxOTIpfCg/OjI1NikpLUNCQywoWzAtOUEtSF0rKVtcXG5cXHJdKyhbMC05QS16XFxuXFxyXFwrXFwvXFw9XSspW1xcblxccl0rL21cclxudmFyIHN0YXJ0UmVnZXggPSAvXi0tLS0tQkVHSU4gKCg/Oi4qIEtFWSl8Q0VSVElGSUNBVEUpLS0tLS0vbVxyXG52YXIgZnVsbFJlZ2V4ID0gL14tLS0tLUJFR0lOICgoPzouKiBLRVkpfENFUlRJRklDQVRFKS0tLS0tKFswLTlBLXpcXG5cXHJcXCtcXC9cXD1dKyktLS0tLUVORCBcXDEtLS0tLSQvbVxyXG52YXIgZXZwID0gcmVxdWlyZSgnZXZwX2J5dGVzdG9rZXknKVxyXG52YXIgY2lwaGVycyA9IHJlcXVpcmUoJ2Jyb3dzZXJpZnktYWVzJylcclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob2tleSwgcGFzc3dvcmQpIHtcclxuICB2YXIga2V5ID0gb2tleS50b1N0cmluZygpXHJcbiAgdmFyIG1hdGNoID0ga2V5Lm1hdGNoKGZpbmRQcm9jKVxyXG4gIHZhciBkZWNyeXB0ZWRcclxuICBpZiAoIW1hdGNoKSB7XHJcbiAgICB2YXIgbWF0Y2gyID0ga2V5Lm1hdGNoKGZ1bGxSZWdleClcclxuICAgIGRlY3J5cHRlZCA9IG5ldyBCdWZmZXIobWF0Y2gyWzJdLnJlcGxhY2UoL1tcXHJcXG5dL2csICcnKSwgJ2Jhc2U2NCcpXHJcbiAgfSBlbHNlIHtcclxuICAgIHZhciBzdWl0ZSA9ICdhZXMnICsgbWF0Y2hbMV1cclxuICAgIHZhciBpdiA9IG5ldyBCdWZmZXIobWF0Y2hbMl0sICdoZXgnKVxyXG4gICAgdmFyIGNpcGhlclRleHQgPSBuZXcgQnVmZmVyKG1hdGNoWzNdLnJlcGxhY2UoL1tcXHJcXG5dL2csICcnKSwgJ2Jhc2U2NCcpXHJcbiAgICB2YXIgY2lwaGVyS2V5ID0gZXZwKHBhc3N3b3JkLCBpdi5zbGljZSgwLCA4KSwgcGFyc2VJbnQobWF0Y2hbMV0sIDEwKSkua2V5XHJcbiAgICB2YXIgb3V0ID0gW11cclxuICAgIHZhciBjaXBoZXIgPSBjaXBoZXJzLmNyZWF0ZURlY2lwaGVyaXYoc3VpdGUsIGNpcGhlcktleSwgaXYpXHJcbiAgICBvdXQucHVzaChjaXBoZXIudXBkYXRlKGNpcGhlclRleHQpKVxyXG4gICAgb3V0LnB1c2goY2lwaGVyLmZpbmFsKCkpXHJcbiAgICBkZWNyeXB0ZWQgPSBCdWZmZXIuY29uY2F0KG91dClcclxuICB9XHJcbiAgdmFyIHRhZyA9IGtleS5tYXRjaChzdGFydFJlZ2V4KVsxXVxyXG4gIHJldHVybiB7XHJcbiAgICB0YWc6IHRhZyxcclxuICAgIGRhdGE6IGRlY3J5cHRlZFxyXG4gIH1cclxufVxyXG4iLCIvLyBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9SYW50YW5lbi9ub2RlLWR0bHMvYmxvYi8yNWE3ZGM4NjFiZGEzOGNmZWFjOTNhNzIzNTAwZWVhNGYwYWMyZTg2L0NlcnRpZmljYXRlLmpzXHJcbi8vIHRoYW5rcyB0byBAUmFudGFuZW5cclxuXHJcbid1c2Ugc3RyaWN0J1xyXG5cclxudmFyIGFzbiA9IHJlcXVpcmUoJ2FzbjEuanMnKVxyXG5cclxudmFyIFRpbWUgPSBhc24uZGVmaW5lKCdUaW1lJywgZnVuY3Rpb24gKCkge1xyXG4gIHRoaXMuY2hvaWNlKHtcclxuICAgIHV0Y1RpbWU6IHRoaXMudXRjdGltZSgpLFxyXG4gICAgZ2VuZXJhbFRpbWU6IHRoaXMuZ2VudGltZSgpXHJcbiAgfSlcclxufSlcclxuXHJcbnZhciBBdHRyaWJ1dGVUeXBlVmFsdWUgPSBhc24uZGVmaW5lKCdBdHRyaWJ1dGVUeXBlVmFsdWUnLCBmdW5jdGlvbiAoKSB7XHJcbiAgdGhpcy5zZXEoKS5vYmooXHJcbiAgICB0aGlzLmtleSgndHlwZScpLm9iamlkKCksXHJcbiAgICB0aGlzLmtleSgndmFsdWUnKS5hbnkoKVxyXG4gIClcclxufSlcclxuXHJcbnZhciBBbGdvcml0aG1JZGVudGlmaWVyID0gYXNuLmRlZmluZSgnQWxnb3JpdGhtSWRlbnRpZmllcicsIGZ1bmN0aW9uICgpIHtcclxuICB0aGlzLnNlcSgpLm9iaihcclxuICAgIHRoaXMua2V5KCdhbGdvcml0aG0nKS5vYmppZCgpLFxyXG4gICAgdGhpcy5rZXkoJ3BhcmFtZXRlcnMnKS5vcHRpb25hbCgpLFxyXG4gICAgdGhpcy5rZXkoJ2N1cnZlJykub2JqaWQoKS5vcHRpb25hbCgpXHJcbiAgKVxyXG59KVxyXG5cclxudmFyIFN1YmplY3RQdWJsaWNLZXlJbmZvID0gYXNuLmRlZmluZSgnU3ViamVjdFB1YmxpY0tleUluZm8nLCBmdW5jdGlvbiAoKSB7XHJcbiAgdGhpcy5zZXEoKS5vYmooXHJcbiAgICB0aGlzLmtleSgnYWxnb3JpdGhtJykudXNlKEFsZ29yaXRobUlkZW50aWZpZXIpLFxyXG4gICAgdGhpcy5rZXkoJ3N1YmplY3RQdWJsaWNLZXknKS5iaXRzdHIoKVxyXG4gIClcclxufSlcclxuXHJcbnZhciBSZWxhdGl2ZURpc3Rpbmd1aXNoZWROYW1lID0gYXNuLmRlZmluZSgnUmVsYXRpdmVEaXN0aW5ndWlzaGVkTmFtZScsIGZ1bmN0aW9uICgpIHtcclxuICB0aGlzLnNldG9mKEF0dHJpYnV0ZVR5cGVWYWx1ZSlcclxufSlcclxuXHJcbnZhciBSRE5TZXF1ZW5jZSA9IGFzbi5kZWZpbmUoJ1JETlNlcXVlbmNlJywgZnVuY3Rpb24gKCkge1xyXG4gIHRoaXMuc2Vxb2YoUmVsYXRpdmVEaXN0aW5ndWlzaGVkTmFtZSlcclxufSlcclxuXHJcbnZhciBOYW1lID0gYXNuLmRlZmluZSgnTmFtZScsIGZ1bmN0aW9uICgpIHtcclxuICB0aGlzLmNob2ljZSh7XHJcbiAgICByZG5TZXF1ZW5jZTogdGhpcy51c2UoUkROU2VxdWVuY2UpXHJcbiAgfSlcclxufSlcclxuXHJcbnZhciBWYWxpZGl0eSA9IGFzbi5kZWZpbmUoJ1ZhbGlkaXR5JywgZnVuY3Rpb24gKCkge1xyXG4gIHRoaXMuc2VxKCkub2JqKFxyXG4gICAgdGhpcy5rZXkoJ25vdEJlZm9yZScpLnVzZShUaW1lKSxcclxuICAgIHRoaXMua2V5KCdub3RBZnRlcicpLnVzZShUaW1lKVxyXG4gIClcclxufSlcclxuXHJcbnZhciBFeHRlbnNpb24gPSBhc24uZGVmaW5lKCdFeHRlbnNpb24nLCBmdW5jdGlvbiAoKSB7XHJcbiAgdGhpcy5zZXEoKS5vYmooXHJcbiAgICB0aGlzLmtleSgnZXh0bklEJykub2JqaWQoKSxcclxuICAgIHRoaXMua2V5KCdjcml0aWNhbCcpLmJvb2woKS5kZWYoZmFsc2UpLFxyXG4gICAgdGhpcy5rZXkoJ2V4dG5WYWx1ZScpLm9jdHN0cigpXHJcbiAgKVxyXG59KVxyXG5cclxudmFyIFRCU0NlcnRpZmljYXRlID0gYXNuLmRlZmluZSgnVEJTQ2VydGlmaWNhdGUnLCBmdW5jdGlvbiAoKSB7XHJcbiAgdGhpcy5zZXEoKS5vYmooXHJcbiAgICB0aGlzLmtleSgndmVyc2lvbicpLmV4cGxpY2l0KDApLmludCgpLm9wdGlvbmFsKCksXHJcbiAgICB0aGlzLmtleSgnc2VyaWFsTnVtYmVyJykuaW50KCksXHJcbiAgICB0aGlzLmtleSgnc2lnbmF0dXJlJykudXNlKEFsZ29yaXRobUlkZW50aWZpZXIpLFxyXG4gICAgdGhpcy5rZXkoJ2lzc3VlcicpLnVzZShOYW1lKSxcclxuICAgIHRoaXMua2V5KCd2YWxpZGl0eScpLnVzZShWYWxpZGl0eSksXHJcbiAgICB0aGlzLmtleSgnc3ViamVjdCcpLnVzZShOYW1lKSxcclxuICAgIHRoaXMua2V5KCdzdWJqZWN0UHVibGljS2V5SW5mbycpLnVzZShTdWJqZWN0UHVibGljS2V5SW5mbyksXHJcbiAgICB0aGlzLmtleSgnaXNzdWVyVW5pcXVlSUQnKS5pbXBsaWNpdCgxKS5iaXRzdHIoKS5vcHRpb25hbCgpLFxyXG4gICAgdGhpcy5rZXkoJ3N1YmplY3RVbmlxdWVJRCcpLmltcGxpY2l0KDIpLmJpdHN0cigpLm9wdGlvbmFsKCksXHJcbiAgICB0aGlzLmtleSgnZXh0ZW5zaW9ucycpLmV4cGxpY2l0KDMpLnNlcW9mKEV4dGVuc2lvbikub3B0aW9uYWwoKVxyXG4gIClcclxufSlcclxuXHJcbnZhciBYNTA5Q2VydGlmaWNhdGUgPSBhc24uZGVmaW5lKCdYNTA5Q2VydGlmaWNhdGUnLCBmdW5jdGlvbiAoKSB7XHJcbiAgdGhpcy5zZXEoKS5vYmooXHJcbiAgICB0aGlzLmtleSgndGJzQ2VydGlmaWNhdGUnKS51c2UoVEJTQ2VydGlmaWNhdGUpLFxyXG4gICAgdGhpcy5rZXkoJ3NpZ25hdHVyZUFsZ29yaXRobScpLnVzZShBbGdvcml0aG1JZGVudGlmaWVyKSxcclxuICAgIHRoaXMua2V5KCdzaWduYXR1cmVWYWx1ZScpLmJpdHN0cigpXHJcbiAgKVxyXG59KVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBYNTA5Q2VydGlmaWNhdGVcclxuIl0sInNvdXJjZVJvb3QiOiIifQ==