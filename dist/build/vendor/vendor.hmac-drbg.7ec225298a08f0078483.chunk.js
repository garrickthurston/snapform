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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvaG1hYy1kcmJnL2xpYi9obWFjLWRyYmcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFhOztBQUViLFdBQVcsbUJBQU8sQ0FBQyxxQkFBUztBQUM1QixZQUFZLG1CQUFPLENBQUMsdUNBQTJCO0FBQy9DLGFBQWEsbUJBQU8sQ0FBQyxpQ0FBcUI7O0FBRTFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGlCQUFpQixtQkFBbUI7QUFDcEM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx3Q0FBd0M7QUFDeEM7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJidWlsZC92ZW5kb3IvdmVuZG9yLmhtYWMtZHJiZy43ZWMyMjUyOThhMDhmMDA3ODQ4My5jaHVuay5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBoYXNoID0gcmVxdWlyZSgnaGFzaC5qcycpO1xyXG52YXIgdXRpbHMgPSByZXF1aXJlKCdtaW5pbWFsaXN0aWMtY3J5cHRvLXV0aWxzJyk7XHJcbnZhciBhc3NlcnQgPSByZXF1aXJlKCdtaW5pbWFsaXN0aWMtYXNzZXJ0Jyk7XHJcblxyXG5mdW5jdGlvbiBIbWFjRFJCRyhvcHRpb25zKSB7XHJcbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIEhtYWNEUkJHKSlcclxuICAgIHJldHVybiBuZXcgSG1hY0RSQkcob3B0aW9ucyk7XHJcbiAgdGhpcy5oYXNoID0gb3B0aW9ucy5oYXNoO1xyXG4gIHRoaXMucHJlZFJlc2lzdCA9ICEhb3B0aW9ucy5wcmVkUmVzaXN0O1xyXG5cclxuICB0aGlzLm91dExlbiA9IHRoaXMuaGFzaC5vdXRTaXplO1xyXG4gIHRoaXMubWluRW50cm9weSA9IG9wdGlvbnMubWluRW50cm9weSB8fCB0aGlzLmhhc2guaG1hY1N0cmVuZ3RoO1xyXG5cclxuICB0aGlzLl9yZXNlZWQgPSBudWxsO1xyXG4gIHRoaXMucmVzZWVkSW50ZXJ2YWwgPSBudWxsO1xyXG4gIHRoaXMuSyA9IG51bGw7XHJcbiAgdGhpcy5WID0gbnVsbDtcclxuXHJcbiAgdmFyIGVudHJvcHkgPSB1dGlscy50b0FycmF5KG9wdGlvbnMuZW50cm9weSwgb3B0aW9ucy5lbnRyb3B5RW5jIHx8ICdoZXgnKTtcclxuICB2YXIgbm9uY2UgPSB1dGlscy50b0FycmF5KG9wdGlvbnMubm9uY2UsIG9wdGlvbnMubm9uY2VFbmMgfHwgJ2hleCcpO1xyXG4gIHZhciBwZXJzID0gdXRpbHMudG9BcnJheShvcHRpb25zLnBlcnMsIG9wdGlvbnMucGVyc0VuYyB8fCAnaGV4Jyk7XHJcbiAgYXNzZXJ0KGVudHJvcHkubGVuZ3RoID49ICh0aGlzLm1pbkVudHJvcHkgLyA4KSxcclxuICAgICAgICAgJ05vdCBlbm91Z2ggZW50cm9weS4gTWluaW11bSBpczogJyArIHRoaXMubWluRW50cm9weSArICcgYml0cycpO1xyXG4gIHRoaXMuX2luaXQoZW50cm9weSwgbm9uY2UsIHBlcnMpO1xyXG59XHJcbm1vZHVsZS5leHBvcnRzID0gSG1hY0RSQkc7XHJcblxyXG5IbWFjRFJCRy5wcm90b3R5cGUuX2luaXQgPSBmdW5jdGlvbiBpbml0KGVudHJvcHksIG5vbmNlLCBwZXJzKSB7XHJcbiAgdmFyIHNlZWQgPSBlbnRyb3B5LmNvbmNhdChub25jZSkuY29uY2F0KHBlcnMpO1xyXG5cclxuICB0aGlzLksgPSBuZXcgQXJyYXkodGhpcy5vdXRMZW4gLyA4KTtcclxuICB0aGlzLlYgPSBuZXcgQXJyYXkodGhpcy5vdXRMZW4gLyA4KTtcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuVi5sZW5ndGg7IGkrKykge1xyXG4gICAgdGhpcy5LW2ldID0gMHgwMDtcclxuICAgIHRoaXMuVltpXSA9IDB4MDE7XHJcbiAgfVxyXG5cclxuICB0aGlzLl91cGRhdGUoc2VlZCk7XHJcbiAgdGhpcy5fcmVzZWVkID0gMTtcclxuICB0aGlzLnJlc2VlZEludGVydmFsID0gMHgxMDAwMDAwMDAwMDAwOyAgLy8gMl40OFxyXG59O1xyXG5cclxuSG1hY0RSQkcucHJvdG90eXBlLl9obWFjID0gZnVuY3Rpb24gaG1hYygpIHtcclxuICByZXR1cm4gbmV3IGhhc2guaG1hYyh0aGlzLmhhc2gsIHRoaXMuSyk7XHJcbn07XHJcblxyXG5IbWFjRFJCRy5wcm90b3R5cGUuX3VwZGF0ZSA9IGZ1bmN0aW9uIHVwZGF0ZShzZWVkKSB7XHJcbiAgdmFyIGttYWMgPSB0aGlzLl9obWFjKClcclxuICAgICAgICAgICAgICAgICAudXBkYXRlKHRoaXMuVilcclxuICAgICAgICAgICAgICAgICAudXBkYXRlKFsgMHgwMCBdKTtcclxuICBpZiAoc2VlZClcclxuICAgIGttYWMgPSBrbWFjLnVwZGF0ZShzZWVkKTtcclxuICB0aGlzLksgPSBrbWFjLmRpZ2VzdCgpO1xyXG4gIHRoaXMuViA9IHRoaXMuX2htYWMoKS51cGRhdGUodGhpcy5WKS5kaWdlc3QoKTtcclxuICBpZiAoIXNlZWQpXHJcbiAgICByZXR1cm47XHJcblxyXG4gIHRoaXMuSyA9IHRoaXMuX2htYWMoKVxyXG4gICAgICAgICAgICAgICAudXBkYXRlKHRoaXMuVilcclxuICAgICAgICAgICAgICAgLnVwZGF0ZShbIDB4MDEgXSlcclxuICAgICAgICAgICAgICAgLnVwZGF0ZShzZWVkKVxyXG4gICAgICAgICAgICAgICAuZGlnZXN0KCk7XHJcbiAgdGhpcy5WID0gdGhpcy5faG1hYygpLnVwZGF0ZSh0aGlzLlYpLmRpZ2VzdCgpO1xyXG59O1xyXG5cclxuSG1hY0RSQkcucHJvdG90eXBlLnJlc2VlZCA9IGZ1bmN0aW9uIHJlc2VlZChlbnRyb3B5LCBlbnRyb3B5RW5jLCBhZGQsIGFkZEVuYykge1xyXG4gIC8vIE9wdGlvbmFsIGVudHJvcHkgZW5jXHJcbiAgaWYgKHR5cGVvZiBlbnRyb3B5RW5jICE9PSAnc3RyaW5nJykge1xyXG4gICAgYWRkRW5jID0gYWRkO1xyXG4gICAgYWRkID0gZW50cm9weUVuYztcclxuICAgIGVudHJvcHlFbmMgPSBudWxsO1xyXG4gIH1cclxuXHJcbiAgZW50cm9weSA9IHV0aWxzLnRvQXJyYXkoZW50cm9weSwgZW50cm9weUVuYyk7XHJcbiAgYWRkID0gdXRpbHMudG9BcnJheShhZGQsIGFkZEVuYyk7XHJcblxyXG4gIGFzc2VydChlbnRyb3B5Lmxlbmd0aCA+PSAodGhpcy5taW5FbnRyb3B5IC8gOCksXHJcbiAgICAgICAgICdOb3QgZW5vdWdoIGVudHJvcHkuIE1pbmltdW0gaXM6ICcgKyB0aGlzLm1pbkVudHJvcHkgKyAnIGJpdHMnKTtcclxuXHJcbiAgdGhpcy5fdXBkYXRlKGVudHJvcHkuY29uY2F0KGFkZCB8fCBbXSkpO1xyXG4gIHRoaXMuX3Jlc2VlZCA9IDE7XHJcbn07XHJcblxyXG5IbWFjRFJCRy5wcm90b3R5cGUuZ2VuZXJhdGUgPSBmdW5jdGlvbiBnZW5lcmF0ZShsZW4sIGVuYywgYWRkLCBhZGRFbmMpIHtcclxuICBpZiAodGhpcy5fcmVzZWVkID4gdGhpcy5yZXNlZWRJbnRlcnZhbClcclxuICAgIHRocm93IG5ldyBFcnJvcignUmVzZWVkIGlzIHJlcXVpcmVkJyk7XHJcblxyXG4gIC8vIE9wdGlvbmFsIGVuY29kaW5nXHJcbiAgaWYgKHR5cGVvZiBlbmMgIT09ICdzdHJpbmcnKSB7XHJcbiAgICBhZGRFbmMgPSBhZGQ7XHJcbiAgICBhZGQgPSBlbmM7XHJcbiAgICBlbmMgPSBudWxsO1xyXG4gIH1cclxuXHJcbiAgLy8gT3B0aW9uYWwgYWRkaXRpb25hbCBkYXRhXHJcbiAgaWYgKGFkZCkge1xyXG4gICAgYWRkID0gdXRpbHMudG9BcnJheShhZGQsIGFkZEVuYyB8fCAnaGV4Jyk7XHJcbiAgICB0aGlzLl91cGRhdGUoYWRkKTtcclxuICB9XHJcblxyXG4gIHZhciB0ZW1wID0gW107XHJcbiAgd2hpbGUgKHRlbXAubGVuZ3RoIDwgbGVuKSB7XHJcbiAgICB0aGlzLlYgPSB0aGlzLl9obWFjKCkudXBkYXRlKHRoaXMuVikuZGlnZXN0KCk7XHJcbiAgICB0ZW1wID0gdGVtcC5jb25jYXQodGhpcy5WKTtcclxuICB9XHJcblxyXG4gIHZhciByZXMgPSB0ZW1wLnNsaWNlKDAsIGxlbik7XHJcbiAgdGhpcy5fdXBkYXRlKGFkZCk7XHJcbiAgdGhpcy5fcmVzZWVkKys7XHJcbiAgcmV0dXJuIHV0aWxzLmVuY29kZShyZXMsIGVuYyk7XHJcbn07XHJcbiJdLCJzb3VyY2VSb290IjoiIn0=