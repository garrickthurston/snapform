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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcGFyc2UtYXNuMS9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcGFyc2UtYXNuMS9hc24xLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9wYXJzZS1hc24xL2ZpeFByb2MuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3BhcnNlLWFzbjEvY2VydGlmaWNhdGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxXQUFXLG1CQUFPLENBQUMsb0JBQVE7QUFDM0IsWUFBWSxtQkFBTyxDQUFDLDBCQUFjO0FBQ2xDLGNBQWMsbUJBQU8sQ0FBQyx1QkFBVztBQUNqQyxjQUFjLG1CQUFPLENBQUMsNEJBQWdCO0FBQ3RDLGFBQWEsbUJBQU8sQ0FBQyxvQkFBUTtBQUM3QixhQUFhLG1CQUFPLENBQUMseUJBQWE7QUFDbEM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7OztBQzFHQTtBQUNBO0FBQ1k7O0FBRVosV0FBVyxtQkFBTyxDQUFDLHFCQUFTOztBQUU1QixzQkFBc0IsbUJBQU8sQ0FBQywyQkFBZTs7QUFFN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7O0FBRUE7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNILENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7Ozs7Ozs7Ozs7OztBQ3pIRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVUsbUJBQU8sQ0FBQyw0QkFBZ0I7QUFDbEMsY0FBYyxtQkFBTyxDQUFDLDRCQUFnQjtBQUN0QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7QUM3QkE7QUFDQTs7QUFFWTs7QUFFWixVQUFVLG1CQUFPLENBQUMscUJBQVM7O0FBRTNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNILENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEIiwiZmlsZSI6InZlbmRvci92ZW5kb3IucGFyc2UtYXNuMS4xYjA5OWNmMmU1OWQxZjU2YzEzZS5jaHVuay5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBhc24xID0gcmVxdWlyZSgnLi9hc24xJylcbnZhciBhZXNpZCA9IHJlcXVpcmUoJy4vYWVzaWQuanNvbicpXG52YXIgZml4UHJvYyA9IHJlcXVpcmUoJy4vZml4UHJvYycpXG52YXIgY2lwaGVycyA9IHJlcXVpcmUoJ2Jyb3dzZXJpZnktYWVzJylcbnZhciBjb21wYXQgPSByZXF1aXJlKCdwYmtkZjInKVxudmFyIEJ1ZmZlciA9IHJlcXVpcmUoJ3NhZmUtYnVmZmVyJykuQnVmZmVyXG5tb2R1bGUuZXhwb3J0cyA9IHBhcnNlS2V5c1xuXG5mdW5jdGlvbiBwYXJzZUtleXMgKGJ1ZmZlcikge1xuICB2YXIgcGFzc3dvcmRcbiAgaWYgKHR5cGVvZiBidWZmZXIgPT09ICdvYmplY3QnICYmICFCdWZmZXIuaXNCdWZmZXIoYnVmZmVyKSkge1xuICAgIHBhc3N3b3JkID0gYnVmZmVyLnBhc3NwaHJhc2VcbiAgICBidWZmZXIgPSBidWZmZXIua2V5XG4gIH1cbiAgaWYgKHR5cGVvZiBidWZmZXIgPT09ICdzdHJpbmcnKSB7XG4gICAgYnVmZmVyID0gQnVmZmVyLmZyb20oYnVmZmVyKVxuICB9XG5cbiAgdmFyIHN0cmlwcGVkID0gZml4UHJvYyhidWZmZXIsIHBhc3N3b3JkKVxuXG4gIHZhciB0eXBlID0gc3RyaXBwZWQudGFnXG4gIHZhciBkYXRhID0gc3RyaXBwZWQuZGF0YVxuICB2YXIgc3VidHlwZSwgbmRhdGFcbiAgc3dpdGNoICh0eXBlKSB7XG4gICAgY2FzZSAnQ0VSVElGSUNBVEUnOlxuICAgICAgbmRhdGEgPSBhc24xLmNlcnRpZmljYXRlLmRlY29kZShkYXRhLCAnZGVyJykudGJzQ2VydGlmaWNhdGUuc3ViamVjdFB1YmxpY0tleUluZm9cbiAgICAgIC8vIGZhbGxzIHRocm91Z2hcbiAgICBjYXNlICdQVUJMSUMgS0VZJzpcbiAgICAgIGlmICghbmRhdGEpIHtcbiAgICAgICAgbmRhdGEgPSBhc24xLlB1YmxpY0tleS5kZWNvZGUoZGF0YSwgJ2RlcicpXG4gICAgICB9XG4gICAgICBzdWJ0eXBlID0gbmRhdGEuYWxnb3JpdGhtLmFsZ29yaXRobS5qb2luKCcuJylcbiAgICAgIHN3aXRjaCAoc3VidHlwZSkge1xuICAgICAgICBjYXNlICcxLjIuODQwLjExMzU0OS4xLjEuMSc6XG4gICAgICAgICAgcmV0dXJuIGFzbjEuUlNBUHVibGljS2V5LmRlY29kZShuZGF0YS5zdWJqZWN0UHVibGljS2V5LmRhdGEsICdkZXInKVxuICAgICAgICBjYXNlICcxLjIuODQwLjEwMDQ1LjIuMSc6XG4gICAgICAgICAgbmRhdGEuc3ViamVjdFByaXZhdGVLZXkgPSBuZGF0YS5zdWJqZWN0UHVibGljS2V5XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHR5cGU6ICdlYycsXG4gICAgICAgICAgICBkYXRhOiBuZGF0YVxuICAgICAgICAgIH1cbiAgICAgICAgY2FzZSAnMS4yLjg0MC4xMDA0MC40LjEnOlxuICAgICAgICAgIG5kYXRhLmFsZ29yaXRobS5wYXJhbXMucHViX2tleSA9IGFzbjEuRFNBcGFyYW0uZGVjb2RlKG5kYXRhLnN1YmplY3RQdWJsaWNLZXkuZGF0YSwgJ2RlcicpXG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHR5cGU6ICdkc2EnLFxuICAgICAgICAgICAgZGF0YTogbmRhdGEuYWxnb3JpdGhtLnBhcmFtc1xuICAgICAgICAgIH1cbiAgICAgICAgZGVmYXVsdDogdGhyb3cgbmV3IEVycm9yKCd1bmtub3duIGtleSBpZCAnICsgc3VidHlwZSlcbiAgICAgIH1cbiAgICAgIHRocm93IG5ldyBFcnJvcigndW5rbm93biBrZXkgdHlwZSAnICsgdHlwZSlcbiAgICBjYXNlICdFTkNSWVBURUQgUFJJVkFURSBLRVknOlxuICAgICAgZGF0YSA9IGFzbjEuRW5jcnlwdGVkUHJpdmF0ZUtleS5kZWNvZGUoZGF0YSwgJ2RlcicpXG4gICAgICBkYXRhID0gZGVjcnlwdChkYXRhLCBwYXNzd29yZClcbiAgICAgIC8vIGZhbGxzIHRocm91Z2hcbiAgICBjYXNlICdQUklWQVRFIEtFWSc6XG4gICAgICBuZGF0YSA9IGFzbjEuUHJpdmF0ZUtleS5kZWNvZGUoZGF0YSwgJ2RlcicpXG4gICAgICBzdWJ0eXBlID0gbmRhdGEuYWxnb3JpdGhtLmFsZ29yaXRobS5qb2luKCcuJylcbiAgICAgIHN3aXRjaCAoc3VidHlwZSkge1xuICAgICAgICBjYXNlICcxLjIuODQwLjExMzU0OS4xLjEuMSc6XG4gICAgICAgICAgcmV0dXJuIGFzbjEuUlNBUHJpdmF0ZUtleS5kZWNvZGUobmRhdGEuc3ViamVjdFByaXZhdGVLZXksICdkZXInKVxuICAgICAgICBjYXNlICcxLjIuODQwLjEwMDQ1LjIuMSc6XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGN1cnZlOiBuZGF0YS5hbGdvcml0aG0uY3VydmUsXG4gICAgICAgICAgICBwcml2YXRlS2V5OiBhc24xLkVDUHJpdmF0ZUtleS5kZWNvZGUobmRhdGEuc3ViamVjdFByaXZhdGVLZXksICdkZXInKS5wcml2YXRlS2V5XG4gICAgICAgICAgfVxuICAgICAgICBjYXNlICcxLjIuODQwLjEwMDQwLjQuMSc6XG4gICAgICAgICAgbmRhdGEuYWxnb3JpdGhtLnBhcmFtcy5wcml2X2tleSA9IGFzbjEuRFNBcGFyYW0uZGVjb2RlKG5kYXRhLnN1YmplY3RQcml2YXRlS2V5LCAnZGVyJylcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdHlwZTogJ2RzYScsXG4gICAgICAgICAgICBwYXJhbXM6IG5kYXRhLmFsZ29yaXRobS5wYXJhbXNcbiAgICAgICAgICB9XG4gICAgICAgIGRlZmF1bHQ6IHRocm93IG5ldyBFcnJvcigndW5rbm93biBrZXkgaWQgJyArIHN1YnR5cGUpXG4gICAgICB9XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ3Vua25vd24ga2V5IHR5cGUgJyArIHR5cGUpXG4gICAgY2FzZSAnUlNBIFBVQkxJQyBLRVknOlxuICAgICAgcmV0dXJuIGFzbjEuUlNBUHVibGljS2V5LmRlY29kZShkYXRhLCAnZGVyJylcbiAgICBjYXNlICdSU0EgUFJJVkFURSBLRVknOlxuICAgICAgcmV0dXJuIGFzbjEuUlNBUHJpdmF0ZUtleS5kZWNvZGUoZGF0YSwgJ2RlcicpXG4gICAgY2FzZSAnRFNBIFBSSVZBVEUgS0VZJzpcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHR5cGU6ICdkc2EnLFxuICAgICAgICBwYXJhbXM6IGFzbjEuRFNBUHJpdmF0ZUtleS5kZWNvZGUoZGF0YSwgJ2RlcicpXG4gICAgICB9XG4gICAgY2FzZSAnRUMgUFJJVkFURSBLRVknOlxuICAgICAgZGF0YSA9IGFzbjEuRUNQcml2YXRlS2V5LmRlY29kZShkYXRhLCAnZGVyJylcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGN1cnZlOiBkYXRhLnBhcmFtZXRlcnMudmFsdWUsXG4gICAgICAgIHByaXZhdGVLZXk6IGRhdGEucHJpdmF0ZUtleVxuICAgICAgfVxuICAgIGRlZmF1bHQ6IHRocm93IG5ldyBFcnJvcigndW5rbm93biBrZXkgdHlwZSAnICsgdHlwZSlcbiAgfVxufVxucGFyc2VLZXlzLnNpZ25hdHVyZSA9IGFzbjEuc2lnbmF0dXJlXG5mdW5jdGlvbiBkZWNyeXB0IChkYXRhLCBwYXNzd29yZCkge1xuICB2YXIgc2FsdCA9IGRhdGEuYWxnb3JpdGhtLmRlY3J5cHQua2RlLmtkZXBhcmFtcy5zYWx0XG4gIHZhciBpdGVycyA9IHBhcnNlSW50KGRhdGEuYWxnb3JpdGhtLmRlY3J5cHQua2RlLmtkZXBhcmFtcy5pdGVycy50b1N0cmluZygpLCAxMClcbiAgdmFyIGFsZ28gPSBhZXNpZFtkYXRhLmFsZ29yaXRobS5kZWNyeXB0LmNpcGhlci5hbGdvLmpvaW4oJy4nKV1cbiAgdmFyIGl2ID0gZGF0YS5hbGdvcml0aG0uZGVjcnlwdC5jaXBoZXIuaXZcbiAgdmFyIGNpcGhlclRleHQgPSBkYXRhLnN1YmplY3RQcml2YXRlS2V5XG4gIHZhciBrZXlsZW4gPSBwYXJzZUludChhbGdvLnNwbGl0KCctJylbMV0sIDEwKSAvIDhcbiAgdmFyIGtleSA9IGNvbXBhdC5wYmtkZjJTeW5jKHBhc3N3b3JkLCBzYWx0LCBpdGVycywga2V5bGVuLCAnc2hhMScpXG4gIHZhciBjaXBoZXIgPSBjaXBoZXJzLmNyZWF0ZURlY2lwaGVyaXYoYWxnbywga2V5LCBpdilcbiAgdmFyIG91dCA9IFtdXG4gIG91dC5wdXNoKGNpcGhlci51cGRhdGUoY2lwaGVyVGV4dCkpXG4gIG91dC5wdXNoKGNpcGhlci5maW5hbCgpKVxuICByZXR1cm4gQnVmZmVyLmNvbmNhdChvdXQpXG59XG4iLCIvLyBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9pbmR1dG55L3NlbGYtc2lnbmVkL2Jsb2IvZ2gtcGFnZXMvbGliL2FzbjEuanNcbi8vIEZlZG9yLCB5b3UgYXJlIGFtYXppbmcuXG4ndXNlIHN0cmljdCdcblxudmFyIGFzbjEgPSByZXF1aXJlKCdhc24xLmpzJylcblxuZXhwb3J0cy5jZXJ0aWZpY2F0ZSA9IHJlcXVpcmUoJy4vY2VydGlmaWNhdGUnKVxuXG52YXIgUlNBUHJpdmF0ZUtleSA9IGFzbjEuZGVmaW5lKCdSU0FQcml2YXRlS2V5JywgZnVuY3Rpb24gKCkge1xuICB0aGlzLnNlcSgpLm9iaihcbiAgICB0aGlzLmtleSgndmVyc2lvbicpLmludCgpLFxuICAgIHRoaXMua2V5KCdtb2R1bHVzJykuaW50KCksXG4gICAgdGhpcy5rZXkoJ3B1YmxpY0V4cG9uZW50JykuaW50KCksXG4gICAgdGhpcy5rZXkoJ3ByaXZhdGVFeHBvbmVudCcpLmludCgpLFxuICAgIHRoaXMua2V5KCdwcmltZTEnKS5pbnQoKSxcbiAgICB0aGlzLmtleSgncHJpbWUyJykuaW50KCksXG4gICAgdGhpcy5rZXkoJ2V4cG9uZW50MScpLmludCgpLFxuICAgIHRoaXMua2V5KCdleHBvbmVudDInKS5pbnQoKSxcbiAgICB0aGlzLmtleSgnY29lZmZpY2llbnQnKS5pbnQoKVxuICApXG59KVxuZXhwb3J0cy5SU0FQcml2YXRlS2V5ID0gUlNBUHJpdmF0ZUtleVxuXG52YXIgUlNBUHVibGljS2V5ID0gYXNuMS5kZWZpbmUoJ1JTQVB1YmxpY0tleScsIGZ1bmN0aW9uICgpIHtcbiAgdGhpcy5zZXEoKS5vYmooXG4gICAgdGhpcy5rZXkoJ21vZHVsdXMnKS5pbnQoKSxcbiAgICB0aGlzLmtleSgncHVibGljRXhwb25lbnQnKS5pbnQoKVxuICApXG59KVxuZXhwb3J0cy5SU0FQdWJsaWNLZXkgPSBSU0FQdWJsaWNLZXlcblxudmFyIFB1YmxpY0tleSA9IGFzbjEuZGVmaW5lKCdTdWJqZWN0UHVibGljS2V5SW5mbycsIGZ1bmN0aW9uICgpIHtcbiAgdGhpcy5zZXEoKS5vYmooXG4gICAgdGhpcy5rZXkoJ2FsZ29yaXRobScpLnVzZShBbGdvcml0aG1JZGVudGlmaWVyKSxcbiAgICB0aGlzLmtleSgnc3ViamVjdFB1YmxpY0tleScpLmJpdHN0cigpXG4gIClcbn0pXG5leHBvcnRzLlB1YmxpY0tleSA9IFB1YmxpY0tleVxuXG52YXIgQWxnb3JpdGhtSWRlbnRpZmllciA9IGFzbjEuZGVmaW5lKCdBbGdvcml0aG1JZGVudGlmaWVyJywgZnVuY3Rpb24gKCkge1xuICB0aGlzLnNlcSgpLm9iaihcbiAgICB0aGlzLmtleSgnYWxnb3JpdGhtJykub2JqaWQoKSxcbiAgICB0aGlzLmtleSgnbm9uZScpLm51bGxfKCkub3B0aW9uYWwoKSxcbiAgICB0aGlzLmtleSgnY3VydmUnKS5vYmppZCgpLm9wdGlvbmFsKCksXG4gICAgdGhpcy5rZXkoJ3BhcmFtcycpLnNlcSgpLm9iaihcbiAgICAgIHRoaXMua2V5KCdwJykuaW50KCksXG4gICAgICB0aGlzLmtleSgncScpLmludCgpLFxuICAgICAgdGhpcy5rZXkoJ2cnKS5pbnQoKVxuICAgICkub3B0aW9uYWwoKVxuICApXG59KVxuXG52YXIgUHJpdmF0ZUtleUluZm8gPSBhc24xLmRlZmluZSgnUHJpdmF0ZUtleUluZm8nLCBmdW5jdGlvbiAoKSB7XG4gIHRoaXMuc2VxKCkub2JqKFxuICAgIHRoaXMua2V5KCd2ZXJzaW9uJykuaW50KCksXG4gICAgdGhpcy5rZXkoJ2FsZ29yaXRobScpLnVzZShBbGdvcml0aG1JZGVudGlmaWVyKSxcbiAgICB0aGlzLmtleSgnc3ViamVjdFByaXZhdGVLZXknKS5vY3RzdHIoKVxuICApXG59KVxuZXhwb3J0cy5Qcml2YXRlS2V5ID0gUHJpdmF0ZUtleUluZm9cbnZhciBFbmNyeXB0ZWRQcml2YXRlS2V5SW5mbyA9IGFzbjEuZGVmaW5lKCdFbmNyeXB0ZWRQcml2YXRlS2V5SW5mbycsIGZ1bmN0aW9uICgpIHtcbiAgdGhpcy5zZXEoKS5vYmooXG4gICAgdGhpcy5rZXkoJ2FsZ29yaXRobScpLnNlcSgpLm9iaihcbiAgICAgIHRoaXMua2V5KCdpZCcpLm9iamlkKCksXG4gICAgICB0aGlzLmtleSgnZGVjcnlwdCcpLnNlcSgpLm9iaihcbiAgICAgICAgdGhpcy5rZXkoJ2tkZScpLnNlcSgpLm9iaihcbiAgICAgICAgICB0aGlzLmtleSgnaWQnKS5vYmppZCgpLFxuICAgICAgICAgIHRoaXMua2V5KCdrZGVwYXJhbXMnKS5zZXEoKS5vYmooXG4gICAgICAgICAgICB0aGlzLmtleSgnc2FsdCcpLm9jdHN0cigpLFxuICAgICAgICAgICAgdGhpcy5rZXkoJ2l0ZXJzJykuaW50KClcbiAgICAgICAgICApXG4gICAgICAgICksXG4gICAgICAgIHRoaXMua2V5KCdjaXBoZXInKS5zZXEoKS5vYmooXG4gICAgICAgICAgdGhpcy5rZXkoJ2FsZ28nKS5vYmppZCgpLFxuICAgICAgICAgIHRoaXMua2V5KCdpdicpLm9jdHN0cigpXG4gICAgICAgIClcbiAgICAgIClcbiAgICApLFxuICAgIHRoaXMua2V5KCdzdWJqZWN0UHJpdmF0ZUtleScpLm9jdHN0cigpXG4gIClcbn0pXG5cbmV4cG9ydHMuRW5jcnlwdGVkUHJpdmF0ZUtleSA9IEVuY3J5cHRlZFByaXZhdGVLZXlJbmZvXG5cbnZhciBEU0FQcml2YXRlS2V5ID0gYXNuMS5kZWZpbmUoJ0RTQVByaXZhdGVLZXknLCBmdW5jdGlvbiAoKSB7XG4gIHRoaXMuc2VxKCkub2JqKFxuICAgIHRoaXMua2V5KCd2ZXJzaW9uJykuaW50KCksXG4gICAgdGhpcy5rZXkoJ3AnKS5pbnQoKSxcbiAgICB0aGlzLmtleSgncScpLmludCgpLFxuICAgIHRoaXMua2V5KCdnJykuaW50KCksXG4gICAgdGhpcy5rZXkoJ3B1Yl9rZXknKS5pbnQoKSxcbiAgICB0aGlzLmtleSgncHJpdl9rZXknKS5pbnQoKVxuICApXG59KVxuZXhwb3J0cy5EU0FQcml2YXRlS2V5ID0gRFNBUHJpdmF0ZUtleVxuXG5leHBvcnRzLkRTQXBhcmFtID0gYXNuMS5kZWZpbmUoJ0RTQXBhcmFtJywgZnVuY3Rpb24gKCkge1xuICB0aGlzLmludCgpXG59KVxuXG52YXIgRUNQcml2YXRlS2V5ID0gYXNuMS5kZWZpbmUoJ0VDUHJpdmF0ZUtleScsIGZ1bmN0aW9uICgpIHtcbiAgdGhpcy5zZXEoKS5vYmooXG4gICAgdGhpcy5rZXkoJ3ZlcnNpb24nKS5pbnQoKSxcbiAgICB0aGlzLmtleSgncHJpdmF0ZUtleScpLm9jdHN0cigpLFxuICAgIHRoaXMua2V5KCdwYXJhbWV0ZXJzJykub3B0aW9uYWwoKS5leHBsaWNpdCgwKS51c2UoRUNQYXJhbWV0ZXJzKSxcbiAgICB0aGlzLmtleSgncHVibGljS2V5Jykub3B0aW9uYWwoKS5leHBsaWNpdCgxKS5iaXRzdHIoKVxuICApXG59KVxuZXhwb3J0cy5FQ1ByaXZhdGVLZXkgPSBFQ1ByaXZhdGVLZXlcblxudmFyIEVDUGFyYW1ldGVycyA9IGFzbjEuZGVmaW5lKCdFQ1BhcmFtZXRlcnMnLCBmdW5jdGlvbiAoKSB7XG4gIHRoaXMuY2hvaWNlKHtcbiAgICBuYW1lZEN1cnZlOiB0aGlzLm9iamlkKClcbiAgfSlcbn0pXG5cbmV4cG9ydHMuc2lnbmF0dXJlID0gYXNuMS5kZWZpbmUoJ3NpZ25hdHVyZScsIGZ1bmN0aW9uICgpIHtcbiAgdGhpcy5zZXEoKS5vYmooXG4gICAgdGhpcy5rZXkoJ3InKS5pbnQoKSxcbiAgICB0aGlzLmtleSgncycpLmludCgpXG4gIClcbn0pXG4iLCIvLyBhZGFwdGVkIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL2FwYXRpbC9wZW1zdHJpcFxudmFyIGZpbmRQcm9jID0gL1Byb2MtVHlwZTogNCxFTkNSWVBURURbXFxuXFxyXStERUstSW5mbzogQUVTLSgoPzoxMjgpfCg/OjE5Mil8KD86MjU2KSktQ0JDLChbMC05QS1IXSspW1xcblxccl0rKFswLTlBLXpcXG5cXHJcXCtcXC9cXD1dKylbXFxuXFxyXSsvbVxudmFyIHN0YXJ0UmVnZXggPSAvXi0tLS0tQkVHSU4gKCg/Oi4qIEtFWSl8Q0VSVElGSUNBVEUpLS0tLS0vbVxudmFyIGZ1bGxSZWdleCA9IC9eLS0tLS1CRUdJTiAoKD86LiogS0VZKXxDRVJUSUZJQ0FURSktLS0tLShbMC05QS16XFxuXFxyXFwrXFwvXFw9XSspLS0tLS1FTkQgXFwxLS0tLS0kL21cbnZhciBldnAgPSByZXF1aXJlKCdldnBfYnl0ZXN0b2tleScpXG52YXIgY2lwaGVycyA9IHJlcXVpcmUoJ2Jyb3dzZXJpZnktYWVzJylcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG9rZXksIHBhc3N3b3JkKSB7XG4gIHZhciBrZXkgPSBva2V5LnRvU3RyaW5nKClcbiAgdmFyIG1hdGNoID0ga2V5Lm1hdGNoKGZpbmRQcm9jKVxuICB2YXIgZGVjcnlwdGVkXG4gIGlmICghbWF0Y2gpIHtcbiAgICB2YXIgbWF0Y2gyID0ga2V5Lm1hdGNoKGZ1bGxSZWdleClcbiAgICBkZWNyeXB0ZWQgPSBuZXcgQnVmZmVyKG1hdGNoMlsyXS5yZXBsYWNlKC9bXFxyXFxuXS9nLCAnJyksICdiYXNlNjQnKVxuICB9IGVsc2Uge1xuICAgIHZhciBzdWl0ZSA9ICdhZXMnICsgbWF0Y2hbMV1cbiAgICB2YXIgaXYgPSBuZXcgQnVmZmVyKG1hdGNoWzJdLCAnaGV4JylcbiAgICB2YXIgY2lwaGVyVGV4dCA9IG5ldyBCdWZmZXIobWF0Y2hbM10ucmVwbGFjZSgvW1xcclxcbl0vZywgJycpLCAnYmFzZTY0JylcbiAgICB2YXIgY2lwaGVyS2V5ID0gZXZwKHBhc3N3b3JkLCBpdi5zbGljZSgwLCA4KSwgcGFyc2VJbnQobWF0Y2hbMV0sIDEwKSkua2V5XG4gICAgdmFyIG91dCA9IFtdXG4gICAgdmFyIGNpcGhlciA9IGNpcGhlcnMuY3JlYXRlRGVjaXBoZXJpdihzdWl0ZSwgY2lwaGVyS2V5LCBpdilcbiAgICBvdXQucHVzaChjaXBoZXIudXBkYXRlKGNpcGhlclRleHQpKVxuICAgIG91dC5wdXNoKGNpcGhlci5maW5hbCgpKVxuICAgIGRlY3J5cHRlZCA9IEJ1ZmZlci5jb25jYXQob3V0KVxuICB9XG4gIHZhciB0YWcgPSBrZXkubWF0Y2goc3RhcnRSZWdleClbMV1cbiAgcmV0dXJuIHtcbiAgICB0YWc6IHRhZyxcbiAgICBkYXRhOiBkZWNyeXB0ZWRcbiAgfVxufVxuIiwiLy8gZnJvbSBodHRwczovL2dpdGh1Yi5jb20vUmFudGFuZW4vbm9kZS1kdGxzL2Jsb2IvMjVhN2RjODYxYmRhMzhjZmVhYzkzYTcyMzUwMGVlYTRmMGFjMmU4Ni9DZXJ0aWZpY2F0ZS5qc1xuLy8gdGhhbmtzIHRvIEBSYW50YW5lblxuXG4ndXNlIHN0cmljdCdcblxudmFyIGFzbiA9IHJlcXVpcmUoJ2FzbjEuanMnKVxuXG52YXIgVGltZSA9IGFzbi5kZWZpbmUoJ1RpbWUnLCBmdW5jdGlvbiAoKSB7XG4gIHRoaXMuY2hvaWNlKHtcbiAgICB1dGNUaW1lOiB0aGlzLnV0Y3RpbWUoKSxcbiAgICBnZW5lcmFsVGltZTogdGhpcy5nZW50aW1lKClcbiAgfSlcbn0pXG5cbnZhciBBdHRyaWJ1dGVUeXBlVmFsdWUgPSBhc24uZGVmaW5lKCdBdHRyaWJ1dGVUeXBlVmFsdWUnLCBmdW5jdGlvbiAoKSB7XG4gIHRoaXMuc2VxKCkub2JqKFxuICAgIHRoaXMua2V5KCd0eXBlJykub2JqaWQoKSxcbiAgICB0aGlzLmtleSgndmFsdWUnKS5hbnkoKVxuICApXG59KVxuXG52YXIgQWxnb3JpdGhtSWRlbnRpZmllciA9IGFzbi5kZWZpbmUoJ0FsZ29yaXRobUlkZW50aWZpZXInLCBmdW5jdGlvbiAoKSB7XG4gIHRoaXMuc2VxKCkub2JqKFxuICAgIHRoaXMua2V5KCdhbGdvcml0aG0nKS5vYmppZCgpLFxuICAgIHRoaXMua2V5KCdwYXJhbWV0ZXJzJykub3B0aW9uYWwoKSxcbiAgICB0aGlzLmtleSgnY3VydmUnKS5vYmppZCgpLm9wdGlvbmFsKClcbiAgKVxufSlcblxudmFyIFN1YmplY3RQdWJsaWNLZXlJbmZvID0gYXNuLmRlZmluZSgnU3ViamVjdFB1YmxpY0tleUluZm8nLCBmdW5jdGlvbiAoKSB7XG4gIHRoaXMuc2VxKCkub2JqKFxuICAgIHRoaXMua2V5KCdhbGdvcml0aG0nKS51c2UoQWxnb3JpdGhtSWRlbnRpZmllciksXG4gICAgdGhpcy5rZXkoJ3N1YmplY3RQdWJsaWNLZXknKS5iaXRzdHIoKVxuICApXG59KVxuXG52YXIgUmVsYXRpdmVEaXN0aW5ndWlzaGVkTmFtZSA9IGFzbi5kZWZpbmUoJ1JlbGF0aXZlRGlzdGluZ3Vpc2hlZE5hbWUnLCBmdW5jdGlvbiAoKSB7XG4gIHRoaXMuc2V0b2YoQXR0cmlidXRlVHlwZVZhbHVlKVxufSlcblxudmFyIFJETlNlcXVlbmNlID0gYXNuLmRlZmluZSgnUkROU2VxdWVuY2UnLCBmdW5jdGlvbiAoKSB7XG4gIHRoaXMuc2Vxb2YoUmVsYXRpdmVEaXN0aW5ndWlzaGVkTmFtZSlcbn0pXG5cbnZhciBOYW1lID0gYXNuLmRlZmluZSgnTmFtZScsIGZ1bmN0aW9uICgpIHtcbiAgdGhpcy5jaG9pY2Uoe1xuICAgIHJkblNlcXVlbmNlOiB0aGlzLnVzZShSRE5TZXF1ZW5jZSlcbiAgfSlcbn0pXG5cbnZhciBWYWxpZGl0eSA9IGFzbi5kZWZpbmUoJ1ZhbGlkaXR5JywgZnVuY3Rpb24gKCkge1xuICB0aGlzLnNlcSgpLm9iaihcbiAgICB0aGlzLmtleSgnbm90QmVmb3JlJykudXNlKFRpbWUpLFxuICAgIHRoaXMua2V5KCdub3RBZnRlcicpLnVzZShUaW1lKVxuICApXG59KVxuXG52YXIgRXh0ZW5zaW9uID0gYXNuLmRlZmluZSgnRXh0ZW5zaW9uJywgZnVuY3Rpb24gKCkge1xuICB0aGlzLnNlcSgpLm9iaihcbiAgICB0aGlzLmtleSgnZXh0bklEJykub2JqaWQoKSxcbiAgICB0aGlzLmtleSgnY3JpdGljYWwnKS5ib29sKCkuZGVmKGZhbHNlKSxcbiAgICB0aGlzLmtleSgnZXh0blZhbHVlJykub2N0c3RyKClcbiAgKVxufSlcblxudmFyIFRCU0NlcnRpZmljYXRlID0gYXNuLmRlZmluZSgnVEJTQ2VydGlmaWNhdGUnLCBmdW5jdGlvbiAoKSB7XG4gIHRoaXMuc2VxKCkub2JqKFxuICAgIHRoaXMua2V5KCd2ZXJzaW9uJykuZXhwbGljaXQoMCkuaW50KCkub3B0aW9uYWwoKSxcbiAgICB0aGlzLmtleSgnc2VyaWFsTnVtYmVyJykuaW50KCksXG4gICAgdGhpcy5rZXkoJ3NpZ25hdHVyZScpLnVzZShBbGdvcml0aG1JZGVudGlmaWVyKSxcbiAgICB0aGlzLmtleSgnaXNzdWVyJykudXNlKE5hbWUpLFxuICAgIHRoaXMua2V5KCd2YWxpZGl0eScpLnVzZShWYWxpZGl0eSksXG4gICAgdGhpcy5rZXkoJ3N1YmplY3QnKS51c2UoTmFtZSksXG4gICAgdGhpcy5rZXkoJ3N1YmplY3RQdWJsaWNLZXlJbmZvJykudXNlKFN1YmplY3RQdWJsaWNLZXlJbmZvKSxcbiAgICB0aGlzLmtleSgnaXNzdWVyVW5pcXVlSUQnKS5pbXBsaWNpdCgxKS5iaXRzdHIoKS5vcHRpb25hbCgpLFxuICAgIHRoaXMua2V5KCdzdWJqZWN0VW5pcXVlSUQnKS5pbXBsaWNpdCgyKS5iaXRzdHIoKS5vcHRpb25hbCgpLFxuICAgIHRoaXMua2V5KCdleHRlbnNpb25zJykuZXhwbGljaXQoMykuc2Vxb2YoRXh0ZW5zaW9uKS5vcHRpb25hbCgpXG4gIClcbn0pXG5cbnZhciBYNTA5Q2VydGlmaWNhdGUgPSBhc24uZGVmaW5lKCdYNTA5Q2VydGlmaWNhdGUnLCBmdW5jdGlvbiAoKSB7XG4gIHRoaXMuc2VxKCkub2JqKFxuICAgIHRoaXMua2V5KCd0YnNDZXJ0aWZpY2F0ZScpLnVzZShUQlNDZXJ0aWZpY2F0ZSksXG4gICAgdGhpcy5rZXkoJ3NpZ25hdHVyZUFsZ29yaXRobScpLnVzZShBbGdvcml0aG1JZGVudGlmaWVyKSxcbiAgICB0aGlzLmtleSgnc2lnbmF0dXJlVmFsdWUnKS5iaXRzdHIoKVxuICApXG59KVxuXG5tb2R1bGUuZXhwb3J0cyA9IFg1MDlDZXJ0aWZpY2F0ZVxuIl0sInNvdXJjZVJvb3QiOiIifQ==