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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS1yc2EvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsdURBQVMsbUJBQU8sQ0FBQyxtQkFBTztBQUN4QixrQkFBa0IsbUJBQU8sQ0FBQyx5QkFBYTtBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImJ1aWxkL3ZlbmRvci92ZW5kb3IuYnJvd3NlcmlmeS1yc2EuZDJjMjNlZmY4ZjBmMDc2OGU5ZmMuY2h1bmsuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgYm4gPSByZXF1aXJlKCdibi5qcycpO1xudmFyIHJhbmRvbUJ5dGVzID0gcmVxdWlyZSgncmFuZG9tYnl0ZXMnKTtcbm1vZHVsZS5leHBvcnRzID0gY3J0O1xuZnVuY3Rpb24gYmxpbmQocHJpdikge1xuICB2YXIgciA9IGdldHIocHJpdik7XG4gIHZhciBibGluZGVyID0gci50b1JlZChibi5tb250KHByaXYubW9kdWx1cykpXG4gIC5yZWRQb3cobmV3IGJuKHByaXYucHVibGljRXhwb25lbnQpKS5mcm9tUmVkKCk7XG4gIHJldHVybiB7XG4gICAgYmxpbmRlcjogYmxpbmRlcixcbiAgICB1bmJsaW5kZXI6ci5pbnZtKHByaXYubW9kdWx1cylcbiAgfTtcbn1cbmZ1bmN0aW9uIGNydChtc2csIHByaXYpIHtcbiAgdmFyIGJsaW5kcyA9IGJsaW5kKHByaXYpO1xuICB2YXIgbGVuID0gcHJpdi5tb2R1bHVzLmJ5dGVMZW5ndGgoKTtcbiAgdmFyIG1vZCA9IGJuLm1vbnQocHJpdi5tb2R1bHVzKTtcbiAgdmFyIGJsaW5kZWQgPSBuZXcgYm4obXNnKS5tdWwoYmxpbmRzLmJsaW5kZXIpLnVtb2QocHJpdi5tb2R1bHVzKTtcbiAgdmFyIGMxID0gYmxpbmRlZC50b1JlZChibi5tb250KHByaXYucHJpbWUxKSk7XG4gIHZhciBjMiA9IGJsaW5kZWQudG9SZWQoYm4ubW9udChwcml2LnByaW1lMikpO1xuICB2YXIgcWludiA9IHByaXYuY29lZmZpY2llbnQ7XG4gIHZhciBwID0gcHJpdi5wcmltZTE7XG4gIHZhciBxID0gcHJpdi5wcmltZTI7XG4gIHZhciBtMSA9IGMxLnJlZFBvdyhwcml2LmV4cG9uZW50MSk7XG4gIHZhciBtMiA9IGMyLnJlZFBvdyhwcml2LmV4cG9uZW50Mik7XG4gIG0xID0gbTEuZnJvbVJlZCgpO1xuICBtMiA9IG0yLmZyb21SZWQoKTtcbiAgdmFyIGggPSBtMS5pc3ViKG0yKS5pbXVsKHFpbnYpLnVtb2QocCk7XG4gIGguaW11bChxKTtcbiAgbTIuaWFkZChoKTtcbiAgcmV0dXJuIG5ldyBCdWZmZXIobTIuaW11bChibGluZHMudW5ibGluZGVyKS51bW9kKHByaXYubW9kdWx1cykudG9BcnJheShmYWxzZSwgbGVuKSk7XG59XG5jcnQuZ2V0ciA9IGdldHI7XG5mdW5jdGlvbiBnZXRyKHByaXYpIHtcbiAgdmFyIGxlbiA9IHByaXYubW9kdWx1cy5ieXRlTGVuZ3RoKCk7XG4gIHZhciByID0gbmV3IGJuKHJhbmRvbUJ5dGVzKGxlbikpO1xuICB3aGlsZSAoci5jbXAocHJpdi5tb2R1bHVzKSA+PSAgMCB8fCAhci51bW9kKHByaXYucHJpbWUxKSB8fCAhci51bW9kKHByaXYucHJpbWUyKSkge1xuICAgIHIgPSBuZXcgYm4ocmFuZG9tQnl0ZXMobGVuKSk7XG4gIH1cbiAgcmV0dXJuIHI7XG59XG4iXSwic291cmNlUm9vdCI6IiJ9