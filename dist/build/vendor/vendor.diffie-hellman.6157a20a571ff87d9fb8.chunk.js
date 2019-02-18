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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZGlmZmllLWhlbGxtYW4vYnJvd3Nlci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZGlmZmllLWhlbGxtYW4vbGliL2RoLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9kaWZmaWUtaGVsbG1hbi9saWIvZ2VuZXJhdGVQcmltZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSxrRUFBb0IsbUJBQU8sQ0FBQyxpQ0FBcUI7QUFDakQsYUFBYSxtQkFBTyxDQUFDLCtCQUFtQjs7QUFFeEMsU0FBUyxtQkFBTyxDQUFDLHNCQUFVOztBQUUzQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7OztBQ3pDQSx1REFBUyxtQkFBTyxDQUFDLG1CQUFPO0FBQ3hCLGtCQUFrQixtQkFBTyxDQUFDLDBCQUFjO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsbUJBQU8sQ0FBQyw2QkFBaUI7QUFDdEMsa0JBQWtCLG1CQUFPLENBQUMseUJBQWE7QUFDdkM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDbktBLGtCQUFrQixtQkFBTyxDQUFDLHlCQUFhO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBLFNBQVMsbUJBQU8sQ0FBQyxtQkFBTztBQUN4QjtBQUNBLGtCQUFrQixtQkFBTyxDQUFDLDBCQUFjO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsV0FBVztBQUNuQztBQUNBLG1CQUFtQix5QkFBeUI7QUFDNUM7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxpQkFBaUIsbUJBQW1CO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBIiwiZmlsZSI6ImJ1aWxkL3ZlbmRvci92ZW5kb3IuZGlmZmllLWhlbGxtYW4uNjE1N2EyMGE1NzFmZjg3ZDlmYjguY2h1bmsuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgZ2VuZXJhdGVQcmltZSA9IHJlcXVpcmUoJy4vbGliL2dlbmVyYXRlUHJpbWUnKVxudmFyIHByaW1lcyA9IHJlcXVpcmUoJy4vbGliL3ByaW1lcy5qc29uJylcblxudmFyIERIID0gcmVxdWlyZSgnLi9saWIvZGgnKVxuXG5mdW5jdGlvbiBnZXREaWZmaWVIZWxsbWFuIChtb2QpIHtcbiAgdmFyIHByaW1lID0gbmV3IEJ1ZmZlcihwcmltZXNbbW9kXS5wcmltZSwgJ2hleCcpXG4gIHZhciBnZW4gPSBuZXcgQnVmZmVyKHByaW1lc1ttb2RdLmdlbiwgJ2hleCcpXG5cbiAgcmV0dXJuIG5ldyBESChwcmltZSwgZ2VuKVxufVxuXG52YXIgRU5DT0RJTkdTID0ge1xuICAnYmluYXJ5JzogdHJ1ZSwgJ2hleCc6IHRydWUsICdiYXNlNjQnOiB0cnVlXG59XG5cbmZ1bmN0aW9uIGNyZWF0ZURpZmZpZUhlbGxtYW4gKHByaW1lLCBlbmMsIGdlbmVyYXRvciwgZ2VuYykge1xuICBpZiAoQnVmZmVyLmlzQnVmZmVyKGVuYykgfHwgRU5DT0RJTkdTW2VuY10gPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBjcmVhdGVEaWZmaWVIZWxsbWFuKHByaW1lLCAnYmluYXJ5JywgZW5jLCBnZW5lcmF0b3IpXG4gIH1cblxuICBlbmMgPSBlbmMgfHwgJ2JpbmFyeSdcbiAgZ2VuYyA9IGdlbmMgfHwgJ2JpbmFyeSdcbiAgZ2VuZXJhdG9yID0gZ2VuZXJhdG9yIHx8IG5ldyBCdWZmZXIoWzJdKVxuXG4gIGlmICghQnVmZmVyLmlzQnVmZmVyKGdlbmVyYXRvcikpIHtcbiAgICBnZW5lcmF0b3IgPSBuZXcgQnVmZmVyKGdlbmVyYXRvciwgZ2VuYylcbiAgfVxuXG4gIGlmICh0eXBlb2YgcHJpbWUgPT09ICdudW1iZXInKSB7XG4gICAgcmV0dXJuIG5ldyBESChnZW5lcmF0ZVByaW1lKHByaW1lLCBnZW5lcmF0b3IpLCBnZW5lcmF0b3IsIHRydWUpXG4gIH1cblxuICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcihwcmltZSkpIHtcbiAgICBwcmltZSA9IG5ldyBCdWZmZXIocHJpbWUsIGVuYylcbiAgfVxuXG4gIHJldHVybiBuZXcgREgocHJpbWUsIGdlbmVyYXRvciwgdHJ1ZSlcbn1cblxuZXhwb3J0cy5EaWZmaWVIZWxsbWFuR3JvdXAgPSBleHBvcnRzLmNyZWF0ZURpZmZpZUhlbGxtYW5Hcm91cCA9IGV4cG9ydHMuZ2V0RGlmZmllSGVsbG1hbiA9IGdldERpZmZpZUhlbGxtYW5cbmV4cG9ydHMuY3JlYXRlRGlmZmllSGVsbG1hbiA9IGV4cG9ydHMuRGlmZmllSGVsbG1hbiA9IGNyZWF0ZURpZmZpZUhlbGxtYW5cbiIsInZhciBCTiA9IHJlcXVpcmUoJ2JuLmpzJyk7XG52YXIgTWlsbGVyUmFiaW4gPSByZXF1aXJlKCdtaWxsZXItcmFiaW4nKTtcbnZhciBtaWxsZXJSYWJpbiA9IG5ldyBNaWxsZXJSYWJpbigpO1xudmFyIFRXRU5UWUZPVVIgPSBuZXcgQk4oMjQpO1xudmFyIEVMRVZFTiA9IG5ldyBCTigxMSk7XG52YXIgVEVOID0gbmV3IEJOKDEwKTtcbnZhciBUSFJFRSA9IG5ldyBCTigzKTtcbnZhciBTRVZFTiA9IG5ldyBCTig3KTtcbnZhciBwcmltZXMgPSByZXF1aXJlKCcuL2dlbmVyYXRlUHJpbWUnKTtcbnZhciByYW5kb21CeXRlcyA9IHJlcXVpcmUoJ3JhbmRvbWJ5dGVzJyk7XG5tb2R1bGUuZXhwb3J0cyA9IERIO1xuXG5mdW5jdGlvbiBzZXRQdWJsaWNLZXkocHViLCBlbmMpIHtcbiAgZW5jID0gZW5jIHx8ICd1dGY4JztcbiAgaWYgKCFCdWZmZXIuaXNCdWZmZXIocHViKSkge1xuICAgIHB1YiA9IG5ldyBCdWZmZXIocHViLCBlbmMpO1xuICB9XG4gIHRoaXMuX3B1YiA9IG5ldyBCTihwdWIpO1xuICByZXR1cm4gdGhpcztcbn1cblxuZnVuY3Rpb24gc2V0UHJpdmF0ZUtleShwcml2LCBlbmMpIHtcbiAgZW5jID0gZW5jIHx8ICd1dGY4JztcbiAgaWYgKCFCdWZmZXIuaXNCdWZmZXIocHJpdikpIHtcbiAgICBwcml2ID0gbmV3IEJ1ZmZlcihwcml2LCBlbmMpO1xuICB9XG4gIHRoaXMuX3ByaXYgPSBuZXcgQk4ocHJpdik7XG4gIHJldHVybiB0aGlzO1xufVxuXG52YXIgcHJpbWVDYWNoZSA9IHt9O1xuZnVuY3Rpb24gY2hlY2tQcmltZShwcmltZSwgZ2VuZXJhdG9yKSB7XG4gIHZhciBnZW4gPSBnZW5lcmF0b3IudG9TdHJpbmcoJ2hleCcpO1xuICB2YXIgaGV4ID0gW2dlbiwgcHJpbWUudG9TdHJpbmcoMTYpXS5qb2luKCdfJyk7XG4gIGlmIChoZXggaW4gcHJpbWVDYWNoZSkge1xuICAgIHJldHVybiBwcmltZUNhY2hlW2hleF07XG4gIH1cbiAgdmFyIGVycm9yID0gMDtcblxuICBpZiAocHJpbWUuaXNFdmVuKCkgfHxcbiAgICAhcHJpbWVzLnNpbXBsZVNpZXZlIHx8XG4gICAgIXByaW1lcy5mZXJtYXRUZXN0KHByaW1lKSB8fFxuICAgICFtaWxsZXJSYWJpbi50ZXN0KHByaW1lKSkge1xuICAgIC8vbm90IGEgcHJpbWUgc28gKzFcbiAgICBlcnJvciArPSAxO1xuXG4gICAgaWYgKGdlbiA9PT0gJzAyJyB8fCBnZW4gPT09ICcwNScpIHtcbiAgICAgIC8vIHdlJ2QgYmUgYWJsZSB0byBjaGVjayB0aGUgZ2VuZXJhdG9yXG4gICAgICAvLyBpdCB3b3VsZCBmYWlsIHNvICs4XG4gICAgICBlcnJvciArPSA4O1xuICAgIH0gZWxzZSB7XG4gICAgICAvL3dlIHdvdWxkbid0IGJlIGFibGUgdG8gdGVzdCB0aGUgZ2VuZXJhdG9yXG4gICAgICAvLyBzbyArNFxuICAgICAgZXJyb3IgKz0gNDtcbiAgICB9XG4gICAgcHJpbWVDYWNoZVtoZXhdID0gZXJyb3I7XG4gICAgcmV0dXJuIGVycm9yO1xuICB9XG4gIGlmICghbWlsbGVyUmFiaW4udGVzdChwcmltZS5zaHJuKDEpKSkge1xuICAgIC8vbm90IGEgc2FmZSBwcmltZVxuICAgIGVycm9yICs9IDI7XG4gIH1cbiAgdmFyIHJlbTtcbiAgc3dpdGNoIChnZW4pIHtcbiAgICBjYXNlICcwMic6XG4gICAgICBpZiAocHJpbWUubW9kKFRXRU5UWUZPVVIpLmNtcChFTEVWRU4pKSB7XG4gICAgICAgIC8vIHVuc3VpZGFibGUgZ2VuZXJhdG9yXG4gICAgICAgIGVycm9yICs9IDg7XG4gICAgICB9XG4gICAgICBicmVhaztcbiAgICBjYXNlICcwNSc6XG4gICAgICByZW0gPSBwcmltZS5tb2QoVEVOKTtcbiAgICAgIGlmIChyZW0uY21wKFRIUkVFKSAmJiByZW0uY21wKFNFVkVOKSkge1xuICAgICAgICAvLyBwcmltZSBtb2QgMTAgbmVlZHMgdG8gZXF1YWwgMyBvciA3XG4gICAgICAgIGVycm9yICs9IDg7XG4gICAgICB9XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgZXJyb3IgKz0gNDtcbiAgfVxuICBwcmltZUNhY2hlW2hleF0gPSBlcnJvcjtcbiAgcmV0dXJuIGVycm9yO1xufVxuXG5mdW5jdGlvbiBESChwcmltZSwgZ2VuZXJhdG9yLCBtYWxsZWFibGUpIHtcbiAgdGhpcy5zZXRHZW5lcmF0b3IoZ2VuZXJhdG9yKTtcbiAgdGhpcy5fX3ByaW1lID0gbmV3IEJOKHByaW1lKTtcbiAgdGhpcy5fcHJpbWUgPSBCTi5tb250KHRoaXMuX19wcmltZSk7XG4gIHRoaXMuX3ByaW1lTGVuID0gcHJpbWUubGVuZ3RoO1xuICB0aGlzLl9wdWIgPSB1bmRlZmluZWQ7XG4gIHRoaXMuX3ByaXYgPSB1bmRlZmluZWQ7XG4gIHRoaXMuX3ByaW1lQ29kZSA9IHVuZGVmaW5lZDtcbiAgaWYgKG1hbGxlYWJsZSkge1xuICAgIHRoaXMuc2V0UHVibGljS2V5ID0gc2V0UHVibGljS2V5O1xuICAgIHRoaXMuc2V0UHJpdmF0ZUtleSA9IHNldFByaXZhdGVLZXk7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5fcHJpbWVDb2RlID0gODtcbiAgfVxufVxuT2JqZWN0LmRlZmluZVByb3BlcnR5KERILnByb3RvdHlwZSwgJ3ZlcmlmeUVycm9yJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodHlwZW9mIHRoaXMuX3ByaW1lQ29kZSAhPT0gJ251bWJlcicpIHtcbiAgICAgIHRoaXMuX3ByaW1lQ29kZSA9IGNoZWNrUHJpbWUodGhpcy5fX3ByaW1lLCB0aGlzLl9fZ2VuKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX3ByaW1lQ29kZTtcbiAgfVxufSk7XG5ESC5wcm90b3R5cGUuZ2VuZXJhdGVLZXlzID0gZnVuY3Rpb24gKCkge1xuICBpZiAoIXRoaXMuX3ByaXYpIHtcbiAgICB0aGlzLl9wcml2ID0gbmV3IEJOKHJhbmRvbUJ5dGVzKHRoaXMuX3ByaW1lTGVuKSk7XG4gIH1cbiAgdGhpcy5fcHViID0gdGhpcy5fZ2VuLnRvUmVkKHRoaXMuX3ByaW1lKS5yZWRQb3codGhpcy5fcHJpdikuZnJvbVJlZCgpO1xuICByZXR1cm4gdGhpcy5nZXRQdWJsaWNLZXkoKTtcbn07XG5cbkRILnByb3RvdHlwZS5jb21wdXRlU2VjcmV0ID0gZnVuY3Rpb24gKG90aGVyKSB7XG4gIG90aGVyID0gbmV3IEJOKG90aGVyKTtcbiAgb3RoZXIgPSBvdGhlci50b1JlZCh0aGlzLl9wcmltZSk7XG4gIHZhciBzZWNyZXQgPSBvdGhlci5yZWRQb3codGhpcy5fcHJpdikuZnJvbVJlZCgpO1xuICB2YXIgb3V0ID0gbmV3IEJ1ZmZlcihzZWNyZXQudG9BcnJheSgpKTtcbiAgdmFyIHByaW1lID0gdGhpcy5nZXRQcmltZSgpO1xuICBpZiAob3V0Lmxlbmd0aCA8IHByaW1lLmxlbmd0aCkge1xuICAgIHZhciBmcm9udCA9IG5ldyBCdWZmZXIocHJpbWUubGVuZ3RoIC0gb3V0Lmxlbmd0aCk7XG4gICAgZnJvbnQuZmlsbCgwKTtcbiAgICBvdXQgPSBCdWZmZXIuY29uY2F0KFtmcm9udCwgb3V0XSk7XG4gIH1cbiAgcmV0dXJuIG91dDtcbn07XG5cbkRILnByb3RvdHlwZS5nZXRQdWJsaWNLZXkgPSBmdW5jdGlvbiBnZXRQdWJsaWNLZXkoZW5jKSB7XG4gIHJldHVybiBmb3JtYXRSZXR1cm5WYWx1ZSh0aGlzLl9wdWIsIGVuYyk7XG59O1xuXG5ESC5wcm90b3R5cGUuZ2V0UHJpdmF0ZUtleSA9IGZ1bmN0aW9uIGdldFByaXZhdGVLZXkoZW5jKSB7XG4gIHJldHVybiBmb3JtYXRSZXR1cm5WYWx1ZSh0aGlzLl9wcml2LCBlbmMpO1xufTtcblxuREgucHJvdG90eXBlLmdldFByaW1lID0gZnVuY3Rpb24gKGVuYykge1xuICByZXR1cm4gZm9ybWF0UmV0dXJuVmFsdWUodGhpcy5fX3ByaW1lLCBlbmMpO1xufTtcblxuREgucHJvdG90eXBlLmdldEdlbmVyYXRvciA9IGZ1bmN0aW9uIChlbmMpIHtcbiAgcmV0dXJuIGZvcm1hdFJldHVyblZhbHVlKHRoaXMuX2dlbiwgZW5jKTtcbn07XG5cbkRILnByb3RvdHlwZS5zZXRHZW5lcmF0b3IgPSBmdW5jdGlvbiAoZ2VuLCBlbmMpIHtcbiAgZW5jID0gZW5jIHx8ICd1dGY4JztcbiAgaWYgKCFCdWZmZXIuaXNCdWZmZXIoZ2VuKSkge1xuICAgIGdlbiA9IG5ldyBCdWZmZXIoZ2VuLCBlbmMpO1xuICB9XG4gIHRoaXMuX19nZW4gPSBnZW47XG4gIHRoaXMuX2dlbiA9IG5ldyBCTihnZW4pO1xuICByZXR1cm4gdGhpcztcbn07XG5cbmZ1bmN0aW9uIGZvcm1hdFJldHVyblZhbHVlKGJuLCBlbmMpIHtcbiAgdmFyIGJ1ZiA9IG5ldyBCdWZmZXIoYm4udG9BcnJheSgpKTtcbiAgaWYgKCFlbmMpIHtcbiAgICByZXR1cm4gYnVmO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBidWYudG9TdHJpbmcoZW5jKTtcbiAgfVxufVxuIiwidmFyIHJhbmRvbUJ5dGVzID0gcmVxdWlyZSgncmFuZG9tYnl0ZXMnKTtcbm1vZHVsZS5leHBvcnRzID0gZmluZFByaW1lO1xuZmluZFByaW1lLnNpbXBsZVNpZXZlID0gc2ltcGxlU2lldmU7XG5maW5kUHJpbWUuZmVybWF0VGVzdCA9IGZlcm1hdFRlc3Q7XG52YXIgQk4gPSByZXF1aXJlKCdibi5qcycpO1xudmFyIFRXRU5UWUZPVVIgPSBuZXcgQk4oMjQpO1xudmFyIE1pbGxlclJhYmluID0gcmVxdWlyZSgnbWlsbGVyLXJhYmluJyk7XG52YXIgbWlsbGVyUmFiaW4gPSBuZXcgTWlsbGVyUmFiaW4oKTtcbnZhciBPTkUgPSBuZXcgQk4oMSk7XG52YXIgVFdPID0gbmV3IEJOKDIpO1xudmFyIEZJVkUgPSBuZXcgQk4oNSk7XG52YXIgU0lYVEVFTiA9IG5ldyBCTigxNik7XG52YXIgRUlHSFQgPSBuZXcgQk4oOCk7XG52YXIgVEVOID0gbmV3IEJOKDEwKTtcbnZhciBUSFJFRSA9IG5ldyBCTigzKTtcbnZhciBTRVZFTiA9IG5ldyBCTig3KTtcbnZhciBFTEVWRU4gPSBuZXcgQk4oMTEpO1xudmFyIEZPVVIgPSBuZXcgQk4oNCk7XG52YXIgVFdFTFZFID0gbmV3IEJOKDEyKTtcbnZhciBwcmltZXMgPSBudWxsO1xuXG5mdW5jdGlvbiBfZ2V0UHJpbWVzKCkge1xuICBpZiAocHJpbWVzICE9PSBudWxsKVxuICAgIHJldHVybiBwcmltZXM7XG5cbiAgdmFyIGxpbWl0ID0gMHgxMDAwMDA7XG4gIHZhciByZXMgPSBbXTtcbiAgcmVzWzBdID0gMjtcbiAgZm9yICh2YXIgaSA9IDEsIGsgPSAzOyBrIDwgbGltaXQ7IGsgKz0gMikge1xuICAgIHZhciBzcXJ0ID0gTWF0aC5jZWlsKE1hdGguc3FydChrKSk7XG4gICAgZm9yICh2YXIgaiA9IDA7IGogPCBpICYmIHJlc1tqXSA8PSBzcXJ0OyBqKyspXG4gICAgICBpZiAoayAlIHJlc1tqXSA9PT0gMClcbiAgICAgICAgYnJlYWs7XG5cbiAgICBpZiAoaSAhPT0gaiAmJiByZXNbal0gPD0gc3FydClcbiAgICAgIGNvbnRpbnVlO1xuXG4gICAgcmVzW2krK10gPSBrO1xuICB9XG4gIHByaW1lcyA9IHJlcztcbiAgcmV0dXJuIHJlcztcbn1cblxuZnVuY3Rpb24gc2ltcGxlU2lldmUocCkge1xuICB2YXIgcHJpbWVzID0gX2dldFByaW1lcygpO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgcHJpbWVzLmxlbmd0aDsgaSsrKVxuICAgIGlmIChwLm1vZG4ocHJpbWVzW2ldKSA9PT0gMCkge1xuICAgICAgaWYgKHAuY21wbihwcmltZXNbaV0pID09PSAwKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gZmVybWF0VGVzdChwKSB7XG4gIHZhciByZWQgPSBCTi5tb250KHApO1xuICByZXR1cm4gVFdPLnRvUmVkKHJlZCkucmVkUG93KHAuc3VibigxKSkuZnJvbVJlZCgpLmNtcG4oMSkgPT09IDA7XG59XG5cbmZ1bmN0aW9uIGZpbmRQcmltZShiaXRzLCBnZW4pIHtcbiAgaWYgKGJpdHMgPCAxNikge1xuICAgIC8vIHRoaXMgaXMgd2hhdCBvcGVuc3NsIGRvZXNcbiAgICBpZiAoZ2VuID09PSAyIHx8IGdlbiA9PT0gNSkge1xuICAgICAgcmV0dXJuIG5ldyBCTihbMHg4YywgMHg3Yl0pO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbmV3IEJOKFsweDhjLCAweDI3XSk7XG4gICAgfVxuICB9XG4gIGdlbiA9IG5ldyBCTihnZW4pO1xuXG4gIHZhciBudW0sIG4yO1xuXG4gIHdoaWxlICh0cnVlKSB7XG4gICAgbnVtID0gbmV3IEJOKHJhbmRvbUJ5dGVzKE1hdGguY2VpbChiaXRzIC8gOCkpKTtcbiAgICB3aGlsZSAobnVtLmJpdExlbmd0aCgpID4gYml0cykge1xuICAgICAgbnVtLmlzaHJuKDEpO1xuICAgIH1cbiAgICBpZiAobnVtLmlzRXZlbigpKSB7XG4gICAgICBudW0uaWFkZChPTkUpO1xuICAgIH1cbiAgICBpZiAoIW51bS50ZXN0bigxKSkge1xuICAgICAgbnVtLmlhZGQoVFdPKTtcbiAgICB9XG4gICAgaWYgKCFnZW4uY21wKFRXTykpIHtcbiAgICAgIHdoaWxlIChudW0ubW9kKFRXRU5UWUZPVVIpLmNtcChFTEVWRU4pKSB7XG4gICAgICAgIG51bS5pYWRkKEZPVVIpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoIWdlbi5jbXAoRklWRSkpIHtcbiAgICAgIHdoaWxlIChudW0ubW9kKFRFTikuY21wKFRIUkVFKSkge1xuICAgICAgICBudW0uaWFkZChGT1VSKTtcbiAgICAgIH1cbiAgICB9XG4gICAgbjIgPSBudW0uc2hybigxKTtcbiAgICBpZiAoc2ltcGxlU2lldmUobjIpICYmIHNpbXBsZVNpZXZlKG51bSkgJiZcbiAgICAgIGZlcm1hdFRlc3QobjIpICYmIGZlcm1hdFRlc3QobnVtKSAmJlxuICAgICAgbWlsbGVyUmFiaW4udGVzdChuMikgJiYgbWlsbGVyUmFiaW4udGVzdChudW0pKSB7XG4gICAgICByZXR1cm4gbnVtO1xuICAgIH1cbiAgfVxuXG59XG4iXSwic291cmNlUm9vdCI6IiJ9