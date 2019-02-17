(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["vendor/vendor.hmac-drbg"],{

/***/ "aqI/":
/*!*************************************************!*\
  !*** ./node_modules/hmac-drbg/lib/hmac-drbg.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var hash = __webpack_require__(/*! hash.js */ "fZJM");
var utils = __webpack_require__(/*! minimalistic-crypto-utils */ "dlgc");
var assert = __webpack_require__(/*! minimalistic-assert */ "2j6C");

function HmacDRBG(options) {
  if (!(this instanceof HmacDRBG))
    return new HmacDRBG(options);
  this.hash = options.hash;
  this.predResist = !!options.predResist;

  this.outLen = this.hash.outSize;
  this.minEntropy = options.minEntropy || this.hash.hmacStrength;

  this._reseed = null;
  this.reseedInterval = null;
  this.K = null;
  this.V = null;

  var entropy = utils.toArray(options.entropy, options.entropyEnc || 'hex');
  var nonce = utils.toArray(options.nonce, options.nonceEnc || 'hex');
  var pers = utils.toArray(options.pers, options.persEnc || 'hex');
  assert(entropy.length >= (this.minEntropy / 8),
         'Not enough entropy. Minimum is: ' + this.minEntropy + ' bits');
  this._init(entropy, nonce, pers);
}
module.exports = HmacDRBG;

HmacDRBG.prototype._init = function init(entropy, nonce, pers) {
  var seed = entropy.concat(nonce).concat(pers);

  this.K = new Array(this.outLen / 8);
  this.V = new Array(this.outLen / 8);
  for (var i = 0; i < this.V.length; i++) {
    this.K[i] = 0x00;
    this.V[i] = 0x01;
  }

  this._update(seed);
  this._reseed = 1;
  this.reseedInterval = 0x1000000000000;  // 2^48
};

HmacDRBG.prototype._hmac = function hmac() {
  return new hash.hmac(this.hash, this.K);
};

HmacDRBG.prototype._update = function update(seed) {
  var kmac = this._hmac()
                 .update(this.V)
                 .update([ 0x00 ]);
  if (seed)
    kmac = kmac.update(seed);
  this.K = kmac.digest();
  this.V = this._hmac().update(this.V).digest();
  if (!seed)
    return;

  this.K = this._hmac()
               .update(this.V)
               .update([ 0x01 ])
               .update(seed)
               .digest();
  this.V = this._hmac().update(this.V).digest();
};

HmacDRBG.prototype.reseed = function reseed(entropy, entropyEnc, add, addEnc) {
  // Optional entropy enc
  if (typeof entropyEnc !== 'string') {
    addEnc = add;
    add = entropyEnc;
    entropyEnc = null;
  }

  entropy = utils.toArray(entropy, entropyEnc);
  add = utils.toArray(add, addEnc);

  assert(entropy.length >= (this.minEntropy / 8),
         'Not enough entropy. Minimum is: ' + this.minEntropy + ' bits');

  this._update(entropy.concat(add || []));
  this._reseed = 1;
};

HmacDRBG.prototype.generate = function generate(len, enc, add, addEnc) {
  if (this._reseed > this.reseedInterval)
    throw new Error('Reseed is required');

  // Optional encoding
  if (typeof enc !== 'string') {
    addEnc = add;
    add = enc;
    enc = null;
  }

  // Optional additional data
  if (add) {
    add = utils.toArray(add, addEnc || 'hex');
    this._update(add);
  }

  var temp = [];
  while (temp.length < len) {
    this.V = this._hmac().update(this.V).digest();
    temp = temp.concat(this.V);
  }

  var res = temp.slice(0, len);
  this._update(add);
  this._reseed++;
  return utils.encode(res, enc);
};


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvaG1hYy1kcmJnL2xpYi9obWFjLWRyYmcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFhOztBQUViLFdBQVcsbUJBQU8sQ0FBQyxxQkFBUztBQUM1QixZQUFZLG1CQUFPLENBQUMsdUNBQTJCO0FBQy9DLGFBQWEsbUJBQU8sQ0FBQyxpQ0FBcUI7O0FBRTFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGlCQUFpQixtQkFBbUI7QUFDcEM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx3Q0FBd0M7QUFDeEM7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJ2ZW5kb3IvdmVuZG9yLmhtYWMtZHJiZy45MWVmMWNjZTc4NmMyNDQxMWI2MS5jaHVuay5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxudmFyIGhhc2ggPSByZXF1aXJlKCdoYXNoLmpzJyk7XG52YXIgdXRpbHMgPSByZXF1aXJlKCdtaW5pbWFsaXN0aWMtY3J5cHRvLXV0aWxzJyk7XG52YXIgYXNzZXJ0ID0gcmVxdWlyZSgnbWluaW1hbGlzdGljLWFzc2VydCcpO1xuXG5mdW5jdGlvbiBIbWFjRFJCRyhvcHRpb25zKSB7XG4gIGlmICghKHRoaXMgaW5zdGFuY2VvZiBIbWFjRFJCRykpXG4gICAgcmV0dXJuIG5ldyBIbWFjRFJCRyhvcHRpb25zKTtcbiAgdGhpcy5oYXNoID0gb3B0aW9ucy5oYXNoO1xuICB0aGlzLnByZWRSZXNpc3QgPSAhIW9wdGlvbnMucHJlZFJlc2lzdDtcblxuICB0aGlzLm91dExlbiA9IHRoaXMuaGFzaC5vdXRTaXplO1xuICB0aGlzLm1pbkVudHJvcHkgPSBvcHRpb25zLm1pbkVudHJvcHkgfHwgdGhpcy5oYXNoLmhtYWNTdHJlbmd0aDtcblxuICB0aGlzLl9yZXNlZWQgPSBudWxsO1xuICB0aGlzLnJlc2VlZEludGVydmFsID0gbnVsbDtcbiAgdGhpcy5LID0gbnVsbDtcbiAgdGhpcy5WID0gbnVsbDtcblxuICB2YXIgZW50cm9weSA9IHV0aWxzLnRvQXJyYXkob3B0aW9ucy5lbnRyb3B5LCBvcHRpb25zLmVudHJvcHlFbmMgfHwgJ2hleCcpO1xuICB2YXIgbm9uY2UgPSB1dGlscy50b0FycmF5KG9wdGlvbnMubm9uY2UsIG9wdGlvbnMubm9uY2VFbmMgfHwgJ2hleCcpO1xuICB2YXIgcGVycyA9IHV0aWxzLnRvQXJyYXkob3B0aW9ucy5wZXJzLCBvcHRpb25zLnBlcnNFbmMgfHwgJ2hleCcpO1xuICBhc3NlcnQoZW50cm9weS5sZW5ndGggPj0gKHRoaXMubWluRW50cm9weSAvIDgpLFxuICAgICAgICAgJ05vdCBlbm91Z2ggZW50cm9weS4gTWluaW11bSBpczogJyArIHRoaXMubWluRW50cm9weSArICcgYml0cycpO1xuICB0aGlzLl9pbml0KGVudHJvcHksIG5vbmNlLCBwZXJzKTtcbn1cbm1vZHVsZS5leHBvcnRzID0gSG1hY0RSQkc7XG5cbkhtYWNEUkJHLnByb3RvdHlwZS5faW5pdCA9IGZ1bmN0aW9uIGluaXQoZW50cm9weSwgbm9uY2UsIHBlcnMpIHtcbiAgdmFyIHNlZWQgPSBlbnRyb3B5LmNvbmNhdChub25jZSkuY29uY2F0KHBlcnMpO1xuXG4gIHRoaXMuSyA9IG5ldyBBcnJheSh0aGlzLm91dExlbiAvIDgpO1xuICB0aGlzLlYgPSBuZXcgQXJyYXkodGhpcy5vdXRMZW4gLyA4KTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLlYubGVuZ3RoOyBpKyspIHtcbiAgICB0aGlzLktbaV0gPSAweDAwO1xuICAgIHRoaXMuVltpXSA9IDB4MDE7XG4gIH1cblxuICB0aGlzLl91cGRhdGUoc2VlZCk7XG4gIHRoaXMuX3Jlc2VlZCA9IDE7XG4gIHRoaXMucmVzZWVkSW50ZXJ2YWwgPSAweDEwMDAwMDAwMDAwMDA7ICAvLyAyXjQ4XG59O1xuXG5IbWFjRFJCRy5wcm90b3R5cGUuX2htYWMgPSBmdW5jdGlvbiBobWFjKCkge1xuICByZXR1cm4gbmV3IGhhc2guaG1hYyh0aGlzLmhhc2gsIHRoaXMuSyk7XG59O1xuXG5IbWFjRFJCRy5wcm90b3R5cGUuX3VwZGF0ZSA9IGZ1bmN0aW9uIHVwZGF0ZShzZWVkKSB7XG4gIHZhciBrbWFjID0gdGhpcy5faG1hYygpXG4gICAgICAgICAgICAgICAgIC51cGRhdGUodGhpcy5WKVxuICAgICAgICAgICAgICAgICAudXBkYXRlKFsgMHgwMCBdKTtcbiAgaWYgKHNlZWQpXG4gICAga21hYyA9IGttYWMudXBkYXRlKHNlZWQpO1xuICB0aGlzLksgPSBrbWFjLmRpZ2VzdCgpO1xuICB0aGlzLlYgPSB0aGlzLl9obWFjKCkudXBkYXRlKHRoaXMuVikuZGlnZXN0KCk7XG4gIGlmICghc2VlZClcbiAgICByZXR1cm47XG5cbiAgdGhpcy5LID0gdGhpcy5faG1hYygpXG4gICAgICAgICAgICAgICAudXBkYXRlKHRoaXMuVilcbiAgICAgICAgICAgICAgIC51cGRhdGUoWyAweDAxIF0pXG4gICAgICAgICAgICAgICAudXBkYXRlKHNlZWQpXG4gICAgICAgICAgICAgICAuZGlnZXN0KCk7XG4gIHRoaXMuViA9IHRoaXMuX2htYWMoKS51cGRhdGUodGhpcy5WKS5kaWdlc3QoKTtcbn07XG5cbkhtYWNEUkJHLnByb3RvdHlwZS5yZXNlZWQgPSBmdW5jdGlvbiByZXNlZWQoZW50cm9weSwgZW50cm9weUVuYywgYWRkLCBhZGRFbmMpIHtcbiAgLy8gT3B0aW9uYWwgZW50cm9weSBlbmNcbiAgaWYgKHR5cGVvZiBlbnRyb3B5RW5jICE9PSAnc3RyaW5nJykge1xuICAgIGFkZEVuYyA9IGFkZDtcbiAgICBhZGQgPSBlbnRyb3B5RW5jO1xuICAgIGVudHJvcHlFbmMgPSBudWxsO1xuICB9XG5cbiAgZW50cm9weSA9IHV0aWxzLnRvQXJyYXkoZW50cm9weSwgZW50cm9weUVuYyk7XG4gIGFkZCA9IHV0aWxzLnRvQXJyYXkoYWRkLCBhZGRFbmMpO1xuXG4gIGFzc2VydChlbnRyb3B5Lmxlbmd0aCA+PSAodGhpcy5taW5FbnRyb3B5IC8gOCksXG4gICAgICAgICAnTm90IGVub3VnaCBlbnRyb3B5LiBNaW5pbXVtIGlzOiAnICsgdGhpcy5taW5FbnRyb3B5ICsgJyBiaXRzJyk7XG5cbiAgdGhpcy5fdXBkYXRlKGVudHJvcHkuY29uY2F0KGFkZCB8fCBbXSkpO1xuICB0aGlzLl9yZXNlZWQgPSAxO1xufTtcblxuSG1hY0RSQkcucHJvdG90eXBlLmdlbmVyYXRlID0gZnVuY3Rpb24gZ2VuZXJhdGUobGVuLCBlbmMsIGFkZCwgYWRkRW5jKSB7XG4gIGlmICh0aGlzLl9yZXNlZWQgPiB0aGlzLnJlc2VlZEludGVydmFsKVxuICAgIHRocm93IG5ldyBFcnJvcignUmVzZWVkIGlzIHJlcXVpcmVkJyk7XG5cbiAgLy8gT3B0aW9uYWwgZW5jb2RpbmdcbiAgaWYgKHR5cGVvZiBlbmMgIT09ICdzdHJpbmcnKSB7XG4gICAgYWRkRW5jID0gYWRkO1xuICAgIGFkZCA9IGVuYztcbiAgICBlbmMgPSBudWxsO1xuICB9XG5cbiAgLy8gT3B0aW9uYWwgYWRkaXRpb25hbCBkYXRhXG4gIGlmIChhZGQpIHtcbiAgICBhZGQgPSB1dGlscy50b0FycmF5KGFkZCwgYWRkRW5jIHx8ICdoZXgnKTtcbiAgICB0aGlzLl91cGRhdGUoYWRkKTtcbiAgfVxuXG4gIHZhciB0ZW1wID0gW107XG4gIHdoaWxlICh0ZW1wLmxlbmd0aCA8IGxlbikge1xuICAgIHRoaXMuViA9IHRoaXMuX2htYWMoKS51cGRhdGUodGhpcy5WKS5kaWdlc3QoKTtcbiAgICB0ZW1wID0gdGVtcC5jb25jYXQodGhpcy5WKTtcbiAgfVxuXG4gIHZhciByZXMgPSB0ZW1wLnNsaWNlKDAsIGxlbik7XG4gIHRoaXMuX3VwZGF0ZShhZGQpO1xuICB0aGlzLl9yZXNlZWQrKztcbiAgcmV0dXJuIHV0aWxzLmVuY29kZShyZXMsIGVuYyk7XG59O1xuIl0sInNvdXJjZVJvb3QiOiIifQ==