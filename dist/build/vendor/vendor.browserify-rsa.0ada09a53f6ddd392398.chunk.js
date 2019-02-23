(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["vendor/vendor.browserify-rsa"],{

/***/ "qVij":
/*!**********************************************!*\
  !*** ./node_modules/browserify-rsa/index.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer) {var bn = __webpack_require__(/*! bn.js */ "OZ/i");
var randomBytes = __webpack_require__(/*! randombytes */ "Edxu");
module.exports = crt;
function blind(priv) {
  var r = getr(priv);
  var blinder = r.toRed(bn.mont(priv.modulus))
  .redPow(new bn(priv.publicExponent)).fromRed();
  return {
    blinder: blinder,
    unblinder:r.invm(priv.modulus)
  };
}
function crt(msg, priv) {
  var blinds = blind(priv);
  var len = priv.modulus.byteLength();
  var mod = bn.mont(priv.modulus);
  var blinded = new bn(msg).mul(blinds.blinder).umod(priv.modulus);
  var c1 = blinded.toRed(bn.mont(priv.prime1));
  var c2 = blinded.toRed(bn.mont(priv.prime2));
  var qinv = priv.coefficient;
  var p = priv.prime1;
  var q = priv.prime2;
  var m1 = c1.redPow(priv.exponent1);
  var m2 = c2.redPow(priv.exponent2);
  m1 = m1.fromRed();
  m2 = m2.fromRed();
  var h = m1.isub(m2).imul(qinv).umod(p);
  h.imul(q);
  m2.iadd(h);
  return new Buffer(m2.imul(blinds.unblinder).umod(priv.modulus).toArray(false, len));
}
crt.getr = getr;
function getr(priv) {
  var len = priv.modulus.byteLength();
  var r = new bn(randomBytes(len));
  while (r.cmp(priv.modulus) >=  0 || !r.umod(priv.prime1) || !r.umod(priv.prime2)) {
    r = new bn(randomBytes(len));
  }
  return r;
}

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../buffer/index.js */ "tjlA").Buffer))

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS1yc2EvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsdURBQVMsbUJBQU8sQ0FBQyxtQkFBTztBQUN4QixrQkFBa0IsbUJBQU8sQ0FBQyx5QkFBYTtBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImJ1aWxkL3ZlbmRvci92ZW5kb3IuYnJvd3NlcmlmeS1yc2EuMGFkYTA5YTUzZjZkZGQzOTIzOTguY2h1bmsuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgYm4gPSByZXF1aXJlKCdibi5qcycpO1xyXG52YXIgcmFuZG9tQnl0ZXMgPSByZXF1aXJlKCdyYW5kb21ieXRlcycpO1xyXG5tb2R1bGUuZXhwb3J0cyA9IGNydDtcclxuZnVuY3Rpb24gYmxpbmQocHJpdikge1xyXG4gIHZhciByID0gZ2V0cihwcml2KTtcclxuICB2YXIgYmxpbmRlciA9IHIudG9SZWQoYm4ubW9udChwcml2Lm1vZHVsdXMpKVxyXG4gIC5yZWRQb3cobmV3IGJuKHByaXYucHVibGljRXhwb25lbnQpKS5mcm9tUmVkKCk7XHJcbiAgcmV0dXJuIHtcclxuICAgIGJsaW5kZXI6IGJsaW5kZXIsXHJcbiAgICB1bmJsaW5kZXI6ci5pbnZtKHByaXYubW9kdWx1cylcclxuICB9O1xyXG59XHJcbmZ1bmN0aW9uIGNydChtc2csIHByaXYpIHtcclxuICB2YXIgYmxpbmRzID0gYmxpbmQocHJpdik7XHJcbiAgdmFyIGxlbiA9IHByaXYubW9kdWx1cy5ieXRlTGVuZ3RoKCk7XHJcbiAgdmFyIG1vZCA9IGJuLm1vbnQocHJpdi5tb2R1bHVzKTtcclxuICB2YXIgYmxpbmRlZCA9IG5ldyBibihtc2cpLm11bChibGluZHMuYmxpbmRlcikudW1vZChwcml2Lm1vZHVsdXMpO1xyXG4gIHZhciBjMSA9IGJsaW5kZWQudG9SZWQoYm4ubW9udChwcml2LnByaW1lMSkpO1xyXG4gIHZhciBjMiA9IGJsaW5kZWQudG9SZWQoYm4ubW9udChwcml2LnByaW1lMikpO1xyXG4gIHZhciBxaW52ID0gcHJpdi5jb2VmZmljaWVudDtcclxuICB2YXIgcCA9IHByaXYucHJpbWUxO1xyXG4gIHZhciBxID0gcHJpdi5wcmltZTI7XHJcbiAgdmFyIG0xID0gYzEucmVkUG93KHByaXYuZXhwb25lbnQxKTtcclxuICB2YXIgbTIgPSBjMi5yZWRQb3cocHJpdi5leHBvbmVudDIpO1xyXG4gIG0xID0gbTEuZnJvbVJlZCgpO1xyXG4gIG0yID0gbTIuZnJvbVJlZCgpO1xyXG4gIHZhciBoID0gbTEuaXN1YihtMikuaW11bChxaW52KS51bW9kKHApO1xyXG4gIGguaW11bChxKTtcclxuICBtMi5pYWRkKGgpO1xyXG4gIHJldHVybiBuZXcgQnVmZmVyKG0yLmltdWwoYmxpbmRzLnVuYmxpbmRlcikudW1vZChwcml2Lm1vZHVsdXMpLnRvQXJyYXkoZmFsc2UsIGxlbikpO1xyXG59XHJcbmNydC5nZXRyID0gZ2V0cjtcclxuZnVuY3Rpb24gZ2V0cihwcml2KSB7XHJcbiAgdmFyIGxlbiA9IHByaXYubW9kdWx1cy5ieXRlTGVuZ3RoKCk7XHJcbiAgdmFyIHIgPSBuZXcgYm4ocmFuZG9tQnl0ZXMobGVuKSk7XHJcbiAgd2hpbGUgKHIuY21wKHByaXYubW9kdWx1cykgPj0gIDAgfHwgIXIudW1vZChwcml2LnByaW1lMSkgfHwgIXIudW1vZChwcml2LnByaW1lMikpIHtcclxuICAgIHIgPSBuZXcgYm4ocmFuZG9tQnl0ZXMobGVuKSk7XHJcbiAgfVxyXG4gIHJldHVybiByO1xyXG59XHJcbiJdLCJzb3VyY2VSb290IjoiIn0=