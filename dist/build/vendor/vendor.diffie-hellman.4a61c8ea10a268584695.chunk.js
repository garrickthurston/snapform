(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["vendor/vendor.diffie-hellman"],{

/***/ "ANxK":
/*!************************************************!*\
  !*** ./node_modules/diffie-hellman/browser.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer) {var generatePrime = __webpack_require__(/*! ./lib/generatePrime */ "WKKt")
var primes = __webpack_require__(/*! ./lib/primes.json */ "wk3p")

var DH = __webpack_require__(/*! ./lib/dh */ "Vh22")

function getDiffieHellman (mod) {
  var prime = new Buffer(primes[mod].prime, 'hex')
  var gen = new Buffer(primes[mod].gen, 'hex')

  return new DH(prime, gen)
}

var ENCODINGS = {
  'binary': true, 'hex': true, 'base64': true
}

function createDiffieHellman (prime, enc, generator, genc) {
  if (Buffer.isBuffer(enc) || ENCODINGS[enc] === undefined) {
    return createDiffieHellman(prime, 'binary', enc, generator)
  }

  enc = enc || 'binary'
  genc = genc || 'binary'
  generator = generator || new Buffer([2])

  if (!Buffer.isBuffer(generator)) {
    generator = new Buffer(generator, genc)
  }

  if (typeof prime === 'number') {
    return new DH(generatePrime(prime, generator), generator, true)
  }

  if (!Buffer.isBuffer(prime)) {
    prime = new Buffer(prime, enc)
  }

  return new DH(prime, generator, true)
}

exports.DiffieHellmanGroup = exports.createDiffieHellmanGroup = exports.getDiffieHellman = getDiffieHellman
exports.createDiffieHellman = exports.DiffieHellman = createDiffieHellman

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../buffer/index.js */ "tjlA").Buffer))

/***/ }),

/***/ "Vh22":
/*!***********************************************!*\
  !*** ./node_modules/diffie-hellman/lib/dh.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer) {var BN = __webpack_require__(/*! bn.js */ "OZ/i");
var MillerRabin = __webpack_require__(/*! miller-rabin */ "ehAg");
var millerRabin = new MillerRabin();
var TWENTYFOUR = new BN(24);
var ELEVEN = new BN(11);
var TEN = new BN(10);
var THREE = new BN(3);
var SEVEN = new BN(7);
var primes = __webpack_require__(/*! ./generatePrime */ "WKKt");
var randomBytes = __webpack_require__(/*! randombytes */ "Edxu");
module.exports = DH;

function setPublicKey(pub, enc) {
  enc = enc || 'utf8';
  if (!Buffer.isBuffer(pub)) {
    pub = new Buffer(pub, enc);
  }
  this._pub = new BN(pub);
  return this;
}

function setPrivateKey(priv, enc) {
  enc = enc || 'utf8';
  if (!Buffer.isBuffer(priv)) {
    priv = new Buffer(priv, enc);
  }
  this._priv = new BN(priv);
  return this;
}

var primeCache = {};
function checkPrime(prime, generator) {
  var gen = generator.toString('hex');
  var hex = [gen, prime.toString(16)].join('_');
  if (hex in primeCache) {
    return primeCache[hex];
  }
  var error = 0;

  if (prime.isEven() ||
    !primes.simpleSieve ||
    !primes.fermatTest(prime) ||
    !millerRabin.test(prime)) {
    //not a prime so +1
    error += 1;

    if (gen === '02' || gen === '05') {
      // we'd be able to check the generator
      // it would fail so +8
      error += 8;
    } else {
      //we wouldn't be able to test the generator
      // so +4
      error += 4;
    }
    primeCache[hex] = error;
    return error;
  }
  if (!millerRabin.test(prime.shrn(1))) {
    //not a safe prime
    error += 2;
  }
  var rem;
  switch (gen) {
    case '02':
      if (prime.mod(TWENTYFOUR).cmp(ELEVEN)) {
        // unsuidable generator
        error += 8;
      }
      break;
    case '05':
      rem = prime.mod(TEN);
      if (rem.cmp(THREE) && rem.cmp(SEVEN)) {
        // prime mod 10 needs to equal 3 or 7
        error += 8;
      }
      break;
    default:
      error += 4;
  }
  primeCache[hex] = error;
  return error;
}

function DH(prime, generator, malleable) {
  this.setGenerator(generator);
  this.__prime = new BN(prime);
  this._prime = BN.mont(this.__prime);
  this._primeLen = prime.length;
  this._pub = undefined;
  this._priv = undefined;
  this._primeCode = undefined;
  if (malleable) {
    this.setPublicKey = setPublicKey;
    this.setPrivateKey = setPrivateKey;
  } else {
    this._primeCode = 8;
  }
}
Object.defineProperty(DH.prototype, 'verifyError', {
  enumerable: true,
  get: function () {
    if (typeof this._primeCode !== 'number') {
      this._primeCode = checkPrime(this.__prime, this.__gen);
    }
    return this._primeCode;
  }
});
DH.prototype.generateKeys = function () {
  if (!this._priv) {
    this._priv = new BN(randomBytes(this._primeLen));
  }
  this._pub = this._gen.toRed(this._prime).redPow(this._priv).fromRed();
  return this.getPublicKey();
};

DH.prototype.computeSecret = function (other) {
  other = new BN(other);
  other = other.toRed(this._prime);
  var secret = other.redPow(this._priv).fromRed();
  var out = new Buffer(secret.toArray());
  var prime = this.getPrime();
  if (out.length < prime.length) {
    var front = new Buffer(prime.length - out.length);
    front.fill(0);
    out = Buffer.concat([front, out]);
  }
  return out;
};

DH.prototype.getPublicKey = function getPublicKey(enc) {
  return formatReturnValue(this._pub, enc);
};

DH.prototype.getPrivateKey = function getPrivateKey(enc) {
  return formatReturnValue(this._priv, enc);
};

DH.prototype.getPrime = function (enc) {
  return formatReturnValue(this.__prime, enc);
};

DH.prototype.getGenerator = function (enc) {
  return formatReturnValue(this._gen, enc);
};

DH.prototype.setGenerator = function (gen, enc) {
  enc = enc || 'utf8';
  if (!Buffer.isBuffer(gen)) {
    gen = new Buffer(gen, enc);
  }
  this.__gen = gen;
  this._gen = new BN(gen);
  return this;
};

function formatReturnValue(bn, enc) {
  var buf = new Buffer(bn.toArray());
  if (!enc) {
    return buf;
  } else {
    return buf.toString(enc);
  }
}

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../buffer/index.js */ "tjlA").Buffer))

/***/ }),

/***/ "WKKt":
/*!**********************************************************!*\
  !*** ./node_modules/diffie-hellman/lib/generatePrime.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var randomBytes = __webpack_require__(/*! randombytes */ "Edxu");
module.exports = findPrime;
findPrime.simpleSieve = simpleSieve;
findPrime.fermatTest = fermatTest;
var BN = __webpack_require__(/*! bn.js */ "OZ/i");
var TWENTYFOUR = new BN(24);
var MillerRabin = __webpack_require__(/*! miller-rabin */ "ehAg");
var millerRabin = new MillerRabin();
var ONE = new BN(1);
var TWO = new BN(2);
var FIVE = new BN(5);
var SIXTEEN = new BN(16);
var EIGHT = new BN(8);
var TEN = new BN(10);
var THREE = new BN(3);
var SEVEN = new BN(7);
var ELEVEN = new BN(11);
var FOUR = new BN(4);
var TWELVE = new BN(12);
var primes = null;

function _getPrimes() {
  if (primes !== null)
    return primes;

  var limit = 0x100000;
  var res = [];
  res[0] = 2;
  for (var i = 1, k = 3; k < limit; k += 2) {
    var sqrt = Math.ceil(Math.sqrt(k));
    for (var j = 0; j < i && res[j] <= sqrt; j++)
      if (k % res[j] === 0)
        break;

    if (i !== j && res[j] <= sqrt)
      continue;

    res[i++] = k;
  }
  primes = res;
  return res;
}

function simpleSieve(p) {
  var primes = _getPrimes();

  for (var i = 0; i < primes.length; i++)
    if (p.modn(primes[i]) === 0) {
      if (p.cmpn(primes[i]) === 0) {
        return true;
      } else {
        return false;
      }
    }

  return true;
}

function fermatTest(p) {
  var red = BN.mont(p);
  return TWO.toRed(red).redPow(p.subn(1)).fromRed().cmpn(1) === 0;
}

function findPrime(bits, gen) {
  if (bits < 16) {
    // this is what openssl does
    if (gen === 2 || gen === 5) {
      return new BN([0x8c, 0x7b]);
    } else {
      return new BN([0x8c, 0x27]);
    }
  }
  gen = new BN(gen);

  var num, n2;

  while (true) {
    num = new BN(randomBytes(Math.ceil(bits / 8)));
    while (num.bitLength() > bits) {
      num.ishrn(1);
    }
    if (num.isEven()) {
      num.iadd(ONE);
    }
    if (!num.testn(1)) {
      num.iadd(TWO);
    }
    if (!gen.cmp(TWO)) {
      while (num.mod(TWENTYFOUR).cmp(ELEVEN)) {
        num.iadd(FOUR);
      }
    } else if (!gen.cmp(FIVE)) {
      while (num.mod(TEN).cmp(THREE)) {
        num.iadd(FOUR);
      }
    }
    n2 = num.shrn(1);
    if (simpleSieve(n2) && simpleSieve(num) &&
      fermatTest(n2) && fermatTest(num) &&
      millerRabin.test(n2) && millerRabin.test(num)) {
      return num;
    }
  }

}


/***/ }),

/***/ "wk3p":
/*!*****************************************************!*\
  !*** ./node_modules/diffie-hellman/lib/primes.json ***!
  \*****************************************************/
/*! exports provided: modp1, modp2, modp5, modp14, modp15, modp16, modp17, modp18, default */
/***/ (function(module) {

module.exports = {"modp1":{"gen":"02","prime":"ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a63a3620ffffffffffffffff"},"modp2":{"gen":"02","prime":"ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece65381ffffffffffffffff"},"modp5":{"gen":"02","prime":"ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca237327ffffffffffffffff"},"modp14":{"gen":"02","prime":"ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aacaa68ffffffffffffffff"},"modp15":{"gen":"02","prime":"ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aaac42dad33170d04507a33a85521abdf1cba64ecfb850458dbef0a8aea71575d060c7db3970f85a6e1e4c7abf5ae8cdb0933d71e8c94e04a25619dcee3d2261ad2ee6bf12ffa06d98a0864d87602733ec86a64521f2b18177b200cbbe117577a615d6c770988c0bad946e208e24fa074e5ab3143db5bfce0fd108e4b82d120a93ad2caffffffffffffffff"},"modp16":{"gen":"02","prime":"ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aaac42dad33170d04507a33a85521abdf1cba64ecfb850458dbef0a8aea71575d060c7db3970f85a6e1e4c7abf5ae8cdb0933d71e8c94e04a25619dcee3d2261ad2ee6bf12ffa06d98a0864d87602733ec86a64521f2b18177b200cbbe117577a615d6c770988c0bad946e208e24fa074e5ab3143db5bfce0fd108e4b82d120a92108011a723c12a787e6d788719a10bdba5b2699c327186af4e23c1a946834b6150bda2583e9ca2ad44ce8dbbbc2db04de8ef92e8efc141fbecaa6287c59474e6bc05d99b2964fa090c3a2233ba186515be7ed1f612970cee2d7afb81bdd762170481cd0069127d5b05aa993b4ea988d8fddc186ffb7dc90a6c08f4df435c934063199ffffffffffffffff"},"modp17":{"gen":"02","prime":"ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aaac42dad33170d04507a33a85521abdf1cba64ecfb850458dbef0a8aea71575d060c7db3970f85a6e1e4c7abf5ae8cdb0933d71e8c94e04a25619dcee3d2261ad2ee6bf12ffa06d98a0864d87602733ec86a64521f2b18177b200cbbe117577a615d6c770988c0bad946e208e24fa074e5ab3143db5bfce0fd108e4b82d120a92108011a723c12a787e6d788719a10bdba5b2699c327186af4e23c1a946834b6150bda2583e9ca2ad44ce8dbbbc2db04de8ef92e8efc141fbecaa6287c59474e6bc05d99b2964fa090c3a2233ba186515be7ed1f612970cee2d7afb81bdd762170481cd0069127d5b05aa993b4ea988d8fddc186ffb7dc90a6c08f4df435c93402849236c3fab4d27c7026c1d4dcb2602646dec9751e763dba37bdf8ff9406ad9e530ee5db382f413001aeb06a53ed9027d831179727b0865a8918da3edbebcf9b14ed44ce6cbaced4bb1bdb7f1447e6cc254b332051512bd7af426fb8f401378cd2bf5983ca01c64b92ecf032ea15d1721d03f482d7ce6e74fef6d55e702f46980c82b5a84031900b1c9e59e7c97fbec7e8f323a97a7e36cc88be0f1d45b7ff585ac54bd407b22b4154aacc8f6d7ebf48e1d814cc5ed20f8037e0a79715eef29be32806a1d58bb7c5da76f550aa3d8a1fbff0eb19ccb1a313d55cda56c9ec2ef29632387fe8d76e3c0468043e8f663f4860ee12bf2d5b0b7474d6e694f91e6dcc4024ffffffffffffffff"},"modp18":{"gen":"02","prime":"ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aaac42dad33170d04507a33a85521abdf1cba64ecfb850458dbef0a8aea71575d060c7db3970f85a6e1e4c7abf5ae8cdb0933d71e8c94e04a25619dcee3d2261ad2ee6bf12ffa06d98a0864d87602733ec86a64521f2b18177b200cbbe117577a615d6c770988c0bad946e208e24fa074e5ab3143db5bfce0fd108e4b82d120a92108011a723c12a787e6d788719a10bdba5b2699c327186af4e23c1a946834b6150bda2583e9ca2ad44ce8dbbbc2db04de8ef92e8efc141fbecaa6287c59474e6bc05d99b2964fa090c3a2233ba186515be7ed1f612970cee2d7afb81bdd762170481cd0069127d5b05aa993b4ea988d8fddc186ffb7dc90a6c08f4df435c93402849236c3fab4d27c7026c1d4dcb2602646dec9751e763dba37bdf8ff9406ad9e530ee5db382f413001aeb06a53ed9027d831179727b0865a8918da3edbebcf9b14ed44ce6cbaced4bb1bdb7f1447e6cc254b332051512bd7af426fb8f401378cd2bf5983ca01c64b92ecf032ea15d1721d03f482d7ce6e74fef6d55e702f46980c82b5a84031900b1c9e59e7c97fbec7e8f323a97a7e36cc88be0f1d45b7ff585ac54bd407b22b4154aacc8f6d7ebf48e1d814cc5ed20f8037e0a79715eef29be32806a1d58bb7c5da76f550aa3d8a1fbff0eb19ccb1a313d55cda56c9ec2ef29632387fe8d76e3c0468043e8f663f4860ee12bf2d5b0b7474d6e694f91e6dbe115974a3926f12fee5e438777cb6a932df8cd8bec4d073b931ba3bc832b68d9dd300741fa7bf8afc47ed2576f6936ba424663aab639c5ae4f5683423b4742bf1c978238f16cbe39d652de3fdb8befc848ad922222e04a4037c0713eb57a81a23f0c73473fc646cea306b4bcbc8862f8385ddfa9d4b7fa2c087e879683303ed5bdd3a062b3cf5b3a278a66d2a13f83f44f82ddf310ee074ab6a364597e899a0255dc164f31cc50846851df9ab48195ded7ea1b1d510bd7ee74d73faf36bc31ecfa268359046f4eb879f924009438b481c6cd7889a002ed5ee382bc9190da6fc026e479558e4475677e9aa9e3050e2765694dfc81f56e880b96e7160c980dd98edd3dfffffffffffffffff"}};

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZGlmZmllLWhlbGxtYW4vYnJvd3Nlci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZGlmZmllLWhlbGxtYW4vbGliL2RoLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9kaWZmaWUtaGVsbG1hbi9saWIvZ2VuZXJhdGVQcmltZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSxrRUFBb0IsbUJBQU8sQ0FBQyxpQ0FBcUI7QUFDakQsYUFBYSxtQkFBTyxDQUFDLCtCQUFtQjs7QUFFeEMsU0FBUyxtQkFBTyxDQUFDLHNCQUFVOztBQUUzQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7OztBQ3pDQSx1REFBUyxtQkFBTyxDQUFDLG1CQUFPO0FBQ3hCLGtCQUFrQixtQkFBTyxDQUFDLDBCQUFjO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsbUJBQU8sQ0FBQyw2QkFBaUI7QUFDdEMsa0JBQWtCLG1CQUFPLENBQUMseUJBQWE7QUFDdkM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDbktBLGtCQUFrQixtQkFBTyxDQUFDLHlCQUFhO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBLFNBQVMsbUJBQU8sQ0FBQyxtQkFBTztBQUN4QjtBQUNBLGtCQUFrQixtQkFBTyxDQUFDLDBCQUFjO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsV0FBVztBQUNuQztBQUNBLG1CQUFtQix5QkFBeUI7QUFDNUM7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxpQkFBaUIsbUJBQW1CO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBIiwiZmlsZSI6ImJ1aWxkL3ZlbmRvci92ZW5kb3IuZGlmZmllLWhlbGxtYW4uNGE2MWM4ZWExMGEyNjg1ODQ2OTUuY2h1bmsuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgZ2VuZXJhdGVQcmltZSA9IHJlcXVpcmUoJy4vbGliL2dlbmVyYXRlUHJpbWUnKVxyXG52YXIgcHJpbWVzID0gcmVxdWlyZSgnLi9saWIvcHJpbWVzLmpzb24nKVxyXG5cclxudmFyIERIID0gcmVxdWlyZSgnLi9saWIvZGgnKVxyXG5cclxuZnVuY3Rpb24gZ2V0RGlmZmllSGVsbG1hbiAobW9kKSB7XHJcbiAgdmFyIHByaW1lID0gbmV3IEJ1ZmZlcihwcmltZXNbbW9kXS5wcmltZSwgJ2hleCcpXHJcbiAgdmFyIGdlbiA9IG5ldyBCdWZmZXIocHJpbWVzW21vZF0uZ2VuLCAnaGV4JylcclxuXHJcbiAgcmV0dXJuIG5ldyBESChwcmltZSwgZ2VuKVxyXG59XHJcblxyXG52YXIgRU5DT0RJTkdTID0ge1xyXG4gICdiaW5hcnknOiB0cnVlLCAnaGV4JzogdHJ1ZSwgJ2Jhc2U2NCc6IHRydWVcclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlRGlmZmllSGVsbG1hbiAocHJpbWUsIGVuYywgZ2VuZXJhdG9yLCBnZW5jKSB7XHJcbiAgaWYgKEJ1ZmZlci5pc0J1ZmZlcihlbmMpIHx8IEVOQ09ESU5HU1tlbmNdID09PSB1bmRlZmluZWQpIHtcclxuICAgIHJldHVybiBjcmVhdGVEaWZmaWVIZWxsbWFuKHByaW1lLCAnYmluYXJ5JywgZW5jLCBnZW5lcmF0b3IpXHJcbiAgfVxyXG5cclxuICBlbmMgPSBlbmMgfHwgJ2JpbmFyeSdcclxuICBnZW5jID0gZ2VuYyB8fCAnYmluYXJ5J1xyXG4gIGdlbmVyYXRvciA9IGdlbmVyYXRvciB8fCBuZXcgQnVmZmVyKFsyXSlcclxuXHJcbiAgaWYgKCFCdWZmZXIuaXNCdWZmZXIoZ2VuZXJhdG9yKSkge1xyXG4gICAgZ2VuZXJhdG9yID0gbmV3IEJ1ZmZlcihnZW5lcmF0b3IsIGdlbmMpXHJcbiAgfVxyXG5cclxuICBpZiAodHlwZW9mIHByaW1lID09PSAnbnVtYmVyJykge1xyXG4gICAgcmV0dXJuIG5ldyBESChnZW5lcmF0ZVByaW1lKHByaW1lLCBnZW5lcmF0b3IpLCBnZW5lcmF0b3IsIHRydWUpXHJcbiAgfVxyXG5cclxuICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcihwcmltZSkpIHtcclxuICAgIHByaW1lID0gbmV3IEJ1ZmZlcihwcmltZSwgZW5jKVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIG5ldyBESChwcmltZSwgZ2VuZXJhdG9yLCB0cnVlKVxyXG59XHJcblxyXG5leHBvcnRzLkRpZmZpZUhlbGxtYW5Hcm91cCA9IGV4cG9ydHMuY3JlYXRlRGlmZmllSGVsbG1hbkdyb3VwID0gZXhwb3J0cy5nZXREaWZmaWVIZWxsbWFuID0gZ2V0RGlmZmllSGVsbG1hblxyXG5leHBvcnRzLmNyZWF0ZURpZmZpZUhlbGxtYW4gPSBleHBvcnRzLkRpZmZpZUhlbGxtYW4gPSBjcmVhdGVEaWZmaWVIZWxsbWFuXHJcbiIsInZhciBCTiA9IHJlcXVpcmUoJ2JuLmpzJyk7XHJcbnZhciBNaWxsZXJSYWJpbiA9IHJlcXVpcmUoJ21pbGxlci1yYWJpbicpO1xyXG52YXIgbWlsbGVyUmFiaW4gPSBuZXcgTWlsbGVyUmFiaW4oKTtcclxudmFyIFRXRU5UWUZPVVIgPSBuZXcgQk4oMjQpO1xyXG52YXIgRUxFVkVOID0gbmV3IEJOKDExKTtcclxudmFyIFRFTiA9IG5ldyBCTigxMCk7XHJcbnZhciBUSFJFRSA9IG5ldyBCTigzKTtcclxudmFyIFNFVkVOID0gbmV3IEJOKDcpO1xyXG52YXIgcHJpbWVzID0gcmVxdWlyZSgnLi9nZW5lcmF0ZVByaW1lJyk7XHJcbnZhciByYW5kb21CeXRlcyA9IHJlcXVpcmUoJ3JhbmRvbWJ5dGVzJyk7XHJcbm1vZHVsZS5leHBvcnRzID0gREg7XHJcblxyXG5mdW5jdGlvbiBzZXRQdWJsaWNLZXkocHViLCBlbmMpIHtcclxuICBlbmMgPSBlbmMgfHwgJ3V0ZjgnO1xyXG4gIGlmICghQnVmZmVyLmlzQnVmZmVyKHB1YikpIHtcclxuICAgIHB1YiA9IG5ldyBCdWZmZXIocHViLCBlbmMpO1xyXG4gIH1cclxuICB0aGlzLl9wdWIgPSBuZXcgQk4ocHViKTtcclxuICByZXR1cm4gdGhpcztcclxufVxyXG5cclxuZnVuY3Rpb24gc2V0UHJpdmF0ZUtleShwcml2LCBlbmMpIHtcclxuICBlbmMgPSBlbmMgfHwgJ3V0ZjgnO1xyXG4gIGlmICghQnVmZmVyLmlzQnVmZmVyKHByaXYpKSB7XHJcbiAgICBwcml2ID0gbmV3IEJ1ZmZlcihwcml2LCBlbmMpO1xyXG4gIH1cclxuICB0aGlzLl9wcml2ID0gbmV3IEJOKHByaXYpO1xyXG4gIHJldHVybiB0aGlzO1xyXG59XHJcblxyXG52YXIgcHJpbWVDYWNoZSA9IHt9O1xyXG5mdW5jdGlvbiBjaGVja1ByaW1lKHByaW1lLCBnZW5lcmF0b3IpIHtcclxuICB2YXIgZ2VuID0gZ2VuZXJhdG9yLnRvU3RyaW5nKCdoZXgnKTtcclxuICB2YXIgaGV4ID0gW2dlbiwgcHJpbWUudG9TdHJpbmcoMTYpXS5qb2luKCdfJyk7XHJcbiAgaWYgKGhleCBpbiBwcmltZUNhY2hlKSB7XHJcbiAgICByZXR1cm4gcHJpbWVDYWNoZVtoZXhdO1xyXG4gIH1cclxuICB2YXIgZXJyb3IgPSAwO1xyXG5cclxuICBpZiAocHJpbWUuaXNFdmVuKCkgfHxcclxuICAgICFwcmltZXMuc2ltcGxlU2lldmUgfHxcclxuICAgICFwcmltZXMuZmVybWF0VGVzdChwcmltZSkgfHxcclxuICAgICFtaWxsZXJSYWJpbi50ZXN0KHByaW1lKSkge1xyXG4gICAgLy9ub3QgYSBwcmltZSBzbyArMVxyXG4gICAgZXJyb3IgKz0gMTtcclxuXHJcbiAgICBpZiAoZ2VuID09PSAnMDInIHx8IGdlbiA9PT0gJzA1Jykge1xyXG4gICAgICAvLyB3ZSdkIGJlIGFibGUgdG8gY2hlY2sgdGhlIGdlbmVyYXRvclxyXG4gICAgICAvLyBpdCB3b3VsZCBmYWlsIHNvICs4XHJcbiAgICAgIGVycm9yICs9IDg7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAvL3dlIHdvdWxkbid0IGJlIGFibGUgdG8gdGVzdCB0aGUgZ2VuZXJhdG9yXHJcbiAgICAgIC8vIHNvICs0XHJcbiAgICAgIGVycm9yICs9IDQ7XHJcbiAgICB9XHJcbiAgICBwcmltZUNhY2hlW2hleF0gPSBlcnJvcjtcclxuICAgIHJldHVybiBlcnJvcjtcclxuICB9XHJcbiAgaWYgKCFtaWxsZXJSYWJpbi50ZXN0KHByaW1lLnNocm4oMSkpKSB7XHJcbiAgICAvL25vdCBhIHNhZmUgcHJpbWVcclxuICAgIGVycm9yICs9IDI7XHJcbiAgfVxyXG4gIHZhciByZW07XHJcbiAgc3dpdGNoIChnZW4pIHtcclxuICAgIGNhc2UgJzAyJzpcclxuICAgICAgaWYgKHByaW1lLm1vZChUV0VOVFlGT1VSKS5jbXAoRUxFVkVOKSkge1xyXG4gICAgICAgIC8vIHVuc3VpZGFibGUgZ2VuZXJhdG9yXHJcbiAgICAgICAgZXJyb3IgKz0gODtcclxuICAgICAgfVxyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgJzA1JzpcclxuICAgICAgcmVtID0gcHJpbWUubW9kKFRFTik7XHJcbiAgICAgIGlmIChyZW0uY21wKFRIUkVFKSAmJiByZW0uY21wKFNFVkVOKSkge1xyXG4gICAgICAgIC8vIHByaW1lIG1vZCAxMCBuZWVkcyB0byBlcXVhbCAzIG9yIDdcclxuICAgICAgICBlcnJvciArPSA4O1xyXG4gICAgICB9XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgZGVmYXVsdDpcclxuICAgICAgZXJyb3IgKz0gNDtcclxuICB9XHJcbiAgcHJpbWVDYWNoZVtoZXhdID0gZXJyb3I7XHJcbiAgcmV0dXJuIGVycm9yO1xyXG59XHJcblxyXG5mdW5jdGlvbiBESChwcmltZSwgZ2VuZXJhdG9yLCBtYWxsZWFibGUpIHtcclxuICB0aGlzLnNldEdlbmVyYXRvcihnZW5lcmF0b3IpO1xyXG4gIHRoaXMuX19wcmltZSA9IG5ldyBCTihwcmltZSk7XHJcbiAgdGhpcy5fcHJpbWUgPSBCTi5tb250KHRoaXMuX19wcmltZSk7XHJcbiAgdGhpcy5fcHJpbWVMZW4gPSBwcmltZS5sZW5ndGg7XHJcbiAgdGhpcy5fcHViID0gdW5kZWZpbmVkO1xyXG4gIHRoaXMuX3ByaXYgPSB1bmRlZmluZWQ7XHJcbiAgdGhpcy5fcHJpbWVDb2RlID0gdW5kZWZpbmVkO1xyXG4gIGlmIChtYWxsZWFibGUpIHtcclxuICAgIHRoaXMuc2V0UHVibGljS2V5ID0gc2V0UHVibGljS2V5O1xyXG4gICAgdGhpcy5zZXRQcml2YXRlS2V5ID0gc2V0UHJpdmF0ZUtleTtcclxuICB9IGVsc2Uge1xyXG4gICAgdGhpcy5fcHJpbWVDb2RlID0gODtcclxuICB9XHJcbn1cclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KERILnByb3RvdHlwZSwgJ3ZlcmlmeUVycm9yJywge1xyXG4gIGVudW1lcmFibGU6IHRydWUsXHJcbiAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICBpZiAodHlwZW9mIHRoaXMuX3ByaW1lQ29kZSAhPT0gJ251bWJlcicpIHtcclxuICAgICAgdGhpcy5fcHJpbWVDb2RlID0gY2hlY2tQcmltZSh0aGlzLl9fcHJpbWUsIHRoaXMuX19nZW4pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXMuX3ByaW1lQ29kZTtcclxuICB9XHJcbn0pO1xyXG5ESC5wcm90b3R5cGUuZ2VuZXJhdGVLZXlzID0gZnVuY3Rpb24gKCkge1xyXG4gIGlmICghdGhpcy5fcHJpdikge1xyXG4gICAgdGhpcy5fcHJpdiA9IG5ldyBCTihyYW5kb21CeXRlcyh0aGlzLl9wcmltZUxlbikpO1xyXG4gIH1cclxuICB0aGlzLl9wdWIgPSB0aGlzLl9nZW4udG9SZWQodGhpcy5fcHJpbWUpLnJlZFBvdyh0aGlzLl9wcml2KS5mcm9tUmVkKCk7XHJcbiAgcmV0dXJuIHRoaXMuZ2V0UHVibGljS2V5KCk7XHJcbn07XHJcblxyXG5ESC5wcm90b3R5cGUuY29tcHV0ZVNlY3JldCA9IGZ1bmN0aW9uIChvdGhlcikge1xyXG4gIG90aGVyID0gbmV3IEJOKG90aGVyKTtcclxuICBvdGhlciA9IG90aGVyLnRvUmVkKHRoaXMuX3ByaW1lKTtcclxuICB2YXIgc2VjcmV0ID0gb3RoZXIucmVkUG93KHRoaXMuX3ByaXYpLmZyb21SZWQoKTtcclxuICB2YXIgb3V0ID0gbmV3IEJ1ZmZlcihzZWNyZXQudG9BcnJheSgpKTtcclxuICB2YXIgcHJpbWUgPSB0aGlzLmdldFByaW1lKCk7XHJcbiAgaWYgKG91dC5sZW5ndGggPCBwcmltZS5sZW5ndGgpIHtcclxuICAgIHZhciBmcm9udCA9IG5ldyBCdWZmZXIocHJpbWUubGVuZ3RoIC0gb3V0Lmxlbmd0aCk7XHJcbiAgICBmcm9udC5maWxsKDApO1xyXG4gICAgb3V0ID0gQnVmZmVyLmNvbmNhdChbZnJvbnQsIG91dF0pO1xyXG4gIH1cclxuICByZXR1cm4gb3V0O1xyXG59O1xyXG5cclxuREgucHJvdG90eXBlLmdldFB1YmxpY0tleSA9IGZ1bmN0aW9uIGdldFB1YmxpY0tleShlbmMpIHtcclxuICByZXR1cm4gZm9ybWF0UmV0dXJuVmFsdWUodGhpcy5fcHViLCBlbmMpO1xyXG59O1xyXG5cclxuREgucHJvdG90eXBlLmdldFByaXZhdGVLZXkgPSBmdW5jdGlvbiBnZXRQcml2YXRlS2V5KGVuYykge1xyXG4gIHJldHVybiBmb3JtYXRSZXR1cm5WYWx1ZSh0aGlzLl9wcml2LCBlbmMpO1xyXG59O1xyXG5cclxuREgucHJvdG90eXBlLmdldFByaW1lID0gZnVuY3Rpb24gKGVuYykge1xyXG4gIHJldHVybiBmb3JtYXRSZXR1cm5WYWx1ZSh0aGlzLl9fcHJpbWUsIGVuYyk7XHJcbn07XHJcblxyXG5ESC5wcm90b3R5cGUuZ2V0R2VuZXJhdG9yID0gZnVuY3Rpb24gKGVuYykge1xyXG4gIHJldHVybiBmb3JtYXRSZXR1cm5WYWx1ZSh0aGlzLl9nZW4sIGVuYyk7XHJcbn07XHJcblxyXG5ESC5wcm90b3R5cGUuc2V0R2VuZXJhdG9yID0gZnVuY3Rpb24gKGdlbiwgZW5jKSB7XHJcbiAgZW5jID0gZW5jIHx8ICd1dGY4JztcclxuICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcihnZW4pKSB7XHJcbiAgICBnZW4gPSBuZXcgQnVmZmVyKGdlbiwgZW5jKTtcclxuICB9XHJcbiAgdGhpcy5fX2dlbiA9IGdlbjtcclxuICB0aGlzLl9nZW4gPSBuZXcgQk4oZ2VuKTtcclxuICByZXR1cm4gdGhpcztcclxufTtcclxuXHJcbmZ1bmN0aW9uIGZvcm1hdFJldHVyblZhbHVlKGJuLCBlbmMpIHtcclxuICB2YXIgYnVmID0gbmV3IEJ1ZmZlcihibi50b0FycmF5KCkpO1xyXG4gIGlmICghZW5jKSB7XHJcbiAgICByZXR1cm4gYnVmO1xyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4gYnVmLnRvU3RyaW5nKGVuYyk7XHJcbiAgfVxyXG59XHJcbiIsInZhciByYW5kb21CeXRlcyA9IHJlcXVpcmUoJ3JhbmRvbWJ5dGVzJyk7XHJcbm1vZHVsZS5leHBvcnRzID0gZmluZFByaW1lO1xyXG5maW5kUHJpbWUuc2ltcGxlU2lldmUgPSBzaW1wbGVTaWV2ZTtcclxuZmluZFByaW1lLmZlcm1hdFRlc3QgPSBmZXJtYXRUZXN0O1xyXG52YXIgQk4gPSByZXF1aXJlKCdibi5qcycpO1xyXG52YXIgVFdFTlRZRk9VUiA9IG5ldyBCTigyNCk7XHJcbnZhciBNaWxsZXJSYWJpbiA9IHJlcXVpcmUoJ21pbGxlci1yYWJpbicpO1xyXG52YXIgbWlsbGVyUmFiaW4gPSBuZXcgTWlsbGVyUmFiaW4oKTtcclxudmFyIE9ORSA9IG5ldyBCTigxKTtcclxudmFyIFRXTyA9IG5ldyBCTigyKTtcclxudmFyIEZJVkUgPSBuZXcgQk4oNSk7XHJcbnZhciBTSVhURUVOID0gbmV3IEJOKDE2KTtcclxudmFyIEVJR0hUID0gbmV3IEJOKDgpO1xyXG52YXIgVEVOID0gbmV3IEJOKDEwKTtcclxudmFyIFRIUkVFID0gbmV3IEJOKDMpO1xyXG52YXIgU0VWRU4gPSBuZXcgQk4oNyk7XHJcbnZhciBFTEVWRU4gPSBuZXcgQk4oMTEpO1xyXG52YXIgRk9VUiA9IG5ldyBCTig0KTtcclxudmFyIFRXRUxWRSA9IG5ldyBCTigxMik7XHJcbnZhciBwcmltZXMgPSBudWxsO1xyXG5cclxuZnVuY3Rpb24gX2dldFByaW1lcygpIHtcclxuICBpZiAocHJpbWVzICE9PSBudWxsKVxyXG4gICAgcmV0dXJuIHByaW1lcztcclxuXHJcbiAgdmFyIGxpbWl0ID0gMHgxMDAwMDA7XHJcbiAgdmFyIHJlcyA9IFtdO1xyXG4gIHJlc1swXSA9IDI7XHJcbiAgZm9yICh2YXIgaSA9IDEsIGsgPSAzOyBrIDwgbGltaXQ7IGsgKz0gMikge1xyXG4gICAgdmFyIHNxcnQgPSBNYXRoLmNlaWwoTWF0aC5zcXJ0KGspKTtcclxuICAgIGZvciAodmFyIGogPSAwOyBqIDwgaSAmJiByZXNbal0gPD0gc3FydDsgaisrKVxyXG4gICAgICBpZiAoayAlIHJlc1tqXSA9PT0gMClcclxuICAgICAgICBicmVhaztcclxuXHJcbiAgICBpZiAoaSAhPT0gaiAmJiByZXNbal0gPD0gc3FydClcclxuICAgICAgY29udGludWU7XHJcblxyXG4gICAgcmVzW2krK10gPSBrO1xyXG4gIH1cclxuICBwcmltZXMgPSByZXM7XHJcbiAgcmV0dXJuIHJlcztcclxufVxyXG5cclxuZnVuY3Rpb24gc2ltcGxlU2lldmUocCkge1xyXG4gIHZhciBwcmltZXMgPSBfZ2V0UHJpbWVzKCk7XHJcblxyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgcHJpbWVzLmxlbmd0aDsgaSsrKVxyXG4gICAgaWYgKHAubW9kbihwcmltZXNbaV0pID09PSAwKSB7XHJcbiAgICAgIGlmIChwLmNtcG4ocHJpbWVzW2ldKSA9PT0gMCkge1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICByZXR1cm4gdHJ1ZTtcclxufVxyXG5cclxuZnVuY3Rpb24gZmVybWF0VGVzdChwKSB7XHJcbiAgdmFyIHJlZCA9IEJOLm1vbnQocCk7XHJcbiAgcmV0dXJuIFRXTy50b1JlZChyZWQpLnJlZFBvdyhwLnN1Ym4oMSkpLmZyb21SZWQoKS5jbXBuKDEpID09PSAwO1xyXG59XHJcblxyXG5mdW5jdGlvbiBmaW5kUHJpbWUoYml0cywgZ2VuKSB7XHJcbiAgaWYgKGJpdHMgPCAxNikge1xyXG4gICAgLy8gdGhpcyBpcyB3aGF0IG9wZW5zc2wgZG9lc1xyXG4gICAgaWYgKGdlbiA9PT0gMiB8fCBnZW4gPT09IDUpIHtcclxuICAgICAgcmV0dXJuIG5ldyBCTihbMHg4YywgMHg3Yl0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIG5ldyBCTihbMHg4YywgMHgyN10pO1xyXG4gICAgfVxyXG4gIH1cclxuICBnZW4gPSBuZXcgQk4oZ2VuKTtcclxuXHJcbiAgdmFyIG51bSwgbjI7XHJcblxyXG4gIHdoaWxlICh0cnVlKSB7XHJcbiAgICBudW0gPSBuZXcgQk4ocmFuZG9tQnl0ZXMoTWF0aC5jZWlsKGJpdHMgLyA4KSkpO1xyXG4gICAgd2hpbGUgKG51bS5iaXRMZW5ndGgoKSA+IGJpdHMpIHtcclxuICAgICAgbnVtLmlzaHJuKDEpO1xyXG4gICAgfVxyXG4gICAgaWYgKG51bS5pc0V2ZW4oKSkge1xyXG4gICAgICBudW0uaWFkZChPTkUpO1xyXG4gICAgfVxyXG4gICAgaWYgKCFudW0udGVzdG4oMSkpIHtcclxuICAgICAgbnVtLmlhZGQoVFdPKTtcclxuICAgIH1cclxuICAgIGlmICghZ2VuLmNtcChUV08pKSB7XHJcbiAgICAgIHdoaWxlIChudW0ubW9kKFRXRU5UWUZPVVIpLmNtcChFTEVWRU4pKSB7XHJcbiAgICAgICAgbnVtLmlhZGQoRk9VUik7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSBpZiAoIWdlbi5jbXAoRklWRSkpIHtcclxuICAgICAgd2hpbGUgKG51bS5tb2QoVEVOKS5jbXAoVEhSRUUpKSB7XHJcbiAgICAgICAgbnVtLmlhZGQoRk9VUik7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIG4yID0gbnVtLnNocm4oMSk7XHJcbiAgICBpZiAoc2ltcGxlU2lldmUobjIpICYmIHNpbXBsZVNpZXZlKG51bSkgJiZcclxuICAgICAgZmVybWF0VGVzdChuMikgJiYgZmVybWF0VGVzdChudW0pICYmXHJcbiAgICAgIG1pbGxlclJhYmluLnRlc3QobjIpICYmIG1pbGxlclJhYmluLnRlc3QobnVtKSkge1xyXG4gICAgICByZXR1cm4gbnVtO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbn1cclxuIl0sInNvdXJjZVJvb3QiOiIifQ==