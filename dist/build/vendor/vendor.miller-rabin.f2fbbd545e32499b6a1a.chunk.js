(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["vendor/vendor.miller-rabin"],{

/***/ "ehAg":
/*!*********************************************!*\
  !*** ./node_modules/miller-rabin/lib/mr.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var bn = __webpack_require__(/*! bn.js */ "OZ/i");
var brorand = __webpack_require__(/*! brorand */ "/ayr");

function MillerRabin(rand) {
  this.rand = rand || new brorand.Rand();
}
module.exports = MillerRabin;

MillerRabin.create = function create(rand) {
  return new MillerRabin(rand);
};

MillerRabin.prototype._randbelow = function _randbelow(n) {
  var len = n.bitLength();
  var min_bytes = Math.ceil(len / 8);

  // Generage random bytes until a number less than n is found.
  // This ensures that 0..n-1 have an equal probability of being selected.
  do
    var a = new bn(this.rand.generate(min_bytes));
  while (a.cmp(n) >= 0);

  return a;
};

MillerRabin.prototype._randrange = function _randrange(start, stop) {
  // Generate a random number greater than or equal to start and less than stop.
  var size = stop.sub(start);
  return start.add(this._randbelow(size));
};

MillerRabin.prototype.test = function test(n, k, cb) {
  var len = n.bitLength();
  var red = bn.mont(n);
  var rone = new bn(1).toRed(red);

  if (!k)
    k = Math.max(1, (len / 48) | 0);

  // Find d and s, (n - 1) = (2 ^ s) * d;
  var n1 = n.subn(1);
  for (var s = 0; !n1.testn(s); s++) {}
  var d = n.shrn(s);

  var rn1 = n1.toRed(red);

  var prime = true;
  for (; k > 0; k--) {
    var a = this._randrange(new bn(2), n1);
    if (cb)
      cb(a);

    var x = a.toRed(red).redPow(d);
    if (x.cmp(rone) === 0 || x.cmp(rn1) === 0)
      continue;

    for (var i = 1; i < s; i++) {
      x = x.redSqr();

      if (x.cmp(rone) === 0)
        return false;
      if (x.cmp(rn1) === 0)
        break;
    }

    if (i === s)
      return false;
  }

  return prime;
};

MillerRabin.prototype.getDivisor = function getDivisor(n, k) {
  var len = n.bitLength();
  var red = bn.mont(n);
  var rone = new bn(1).toRed(red);

  if (!k)
    k = Math.max(1, (len / 48) | 0);

  // Find d and s, (n - 1) = (2 ^ s) * d;
  var n1 = n.subn(1);
  for (var s = 0; !n1.testn(s); s++) {}
  var d = n.shrn(s);

  var rn1 = n1.toRed(red);

  for (; k > 0; k--) {
    var a = this._randrange(new bn(2), n1);

    var g = n.gcd(a);
    if (g.cmpn(1) !== 0)
      return g;

    var x = a.toRed(red).redPow(d);
    if (x.cmp(rone) === 0 || x.cmp(rn1) === 0)
      continue;

    for (var i = 1; i < s; i++) {
      x = x.redSqr();

      if (x.cmp(rone) === 0)
        return x.fromRed().subn(1).gcd(n);
      if (x.cmp(rn1) === 0)
        break;
    }

    if (i === s) {
      x = x.redSqr();
      return x.fromRed().subn(1).gcd(n);
    }
  }

  return false;
};


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbWlsbGVyLXJhYmluL2xpYi9tci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSxTQUFTLG1CQUFPLENBQUMsbUJBQU87QUFDeEIsY0FBYyxtQkFBTyxDQUFDLHFCQUFTOztBQUUvQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGlCQUFpQixjQUFjO0FBQy9COztBQUVBOztBQUVBO0FBQ0EsUUFBUSxPQUFPO0FBQ2Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxtQkFBbUIsT0FBTztBQUMxQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGlCQUFpQixjQUFjO0FBQy9COztBQUVBOztBQUVBLFFBQVEsT0FBTztBQUNmOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsbUJBQW1CLE9BQU87QUFDMUI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EiLCJmaWxlIjoiYnVpbGQvdmVuZG9yL3ZlbmRvci5taWxsZXItcmFiaW4uZjJmYmJkNTQ1ZTMyNDk5YjZhMWEuY2h1bmsuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgYm4gPSByZXF1aXJlKCdibi5qcycpO1xyXG52YXIgYnJvcmFuZCA9IHJlcXVpcmUoJ2Jyb3JhbmQnKTtcclxuXHJcbmZ1bmN0aW9uIE1pbGxlclJhYmluKHJhbmQpIHtcclxuICB0aGlzLnJhbmQgPSByYW5kIHx8IG5ldyBicm9yYW5kLlJhbmQoKTtcclxufVxyXG5tb2R1bGUuZXhwb3J0cyA9IE1pbGxlclJhYmluO1xyXG5cclxuTWlsbGVyUmFiaW4uY3JlYXRlID0gZnVuY3Rpb24gY3JlYXRlKHJhbmQpIHtcclxuICByZXR1cm4gbmV3IE1pbGxlclJhYmluKHJhbmQpO1xyXG59O1xyXG5cclxuTWlsbGVyUmFiaW4ucHJvdG90eXBlLl9yYW5kYmVsb3cgPSBmdW5jdGlvbiBfcmFuZGJlbG93KG4pIHtcclxuICB2YXIgbGVuID0gbi5iaXRMZW5ndGgoKTtcclxuICB2YXIgbWluX2J5dGVzID0gTWF0aC5jZWlsKGxlbiAvIDgpO1xyXG5cclxuICAvLyBHZW5lcmFnZSByYW5kb20gYnl0ZXMgdW50aWwgYSBudW1iZXIgbGVzcyB0aGFuIG4gaXMgZm91bmQuXHJcbiAgLy8gVGhpcyBlbnN1cmVzIHRoYXQgMC4ubi0xIGhhdmUgYW4gZXF1YWwgcHJvYmFiaWxpdHkgb2YgYmVpbmcgc2VsZWN0ZWQuXHJcbiAgZG9cclxuICAgIHZhciBhID0gbmV3IGJuKHRoaXMucmFuZC5nZW5lcmF0ZShtaW5fYnl0ZXMpKTtcclxuICB3aGlsZSAoYS5jbXAobikgPj0gMCk7XHJcblxyXG4gIHJldHVybiBhO1xyXG59O1xyXG5cclxuTWlsbGVyUmFiaW4ucHJvdG90eXBlLl9yYW5kcmFuZ2UgPSBmdW5jdGlvbiBfcmFuZHJhbmdlKHN0YXJ0LCBzdG9wKSB7XHJcbiAgLy8gR2VuZXJhdGUgYSByYW5kb20gbnVtYmVyIGdyZWF0ZXIgdGhhbiBvciBlcXVhbCB0byBzdGFydCBhbmQgbGVzcyB0aGFuIHN0b3AuXHJcbiAgdmFyIHNpemUgPSBzdG9wLnN1YihzdGFydCk7XHJcbiAgcmV0dXJuIHN0YXJ0LmFkZCh0aGlzLl9yYW5kYmVsb3coc2l6ZSkpO1xyXG59O1xyXG5cclxuTWlsbGVyUmFiaW4ucHJvdG90eXBlLnRlc3QgPSBmdW5jdGlvbiB0ZXN0KG4sIGssIGNiKSB7XHJcbiAgdmFyIGxlbiA9IG4uYml0TGVuZ3RoKCk7XHJcbiAgdmFyIHJlZCA9IGJuLm1vbnQobik7XHJcbiAgdmFyIHJvbmUgPSBuZXcgYm4oMSkudG9SZWQocmVkKTtcclxuXHJcbiAgaWYgKCFrKVxyXG4gICAgayA9IE1hdGgubWF4KDEsIChsZW4gLyA0OCkgfCAwKTtcclxuXHJcbiAgLy8gRmluZCBkIGFuZCBzLCAobiAtIDEpID0gKDIgXiBzKSAqIGQ7XHJcbiAgdmFyIG4xID0gbi5zdWJuKDEpO1xyXG4gIGZvciAodmFyIHMgPSAwOyAhbjEudGVzdG4ocyk7IHMrKykge31cclxuICB2YXIgZCA9IG4uc2hybihzKTtcclxuXHJcbiAgdmFyIHJuMSA9IG4xLnRvUmVkKHJlZCk7XHJcblxyXG4gIHZhciBwcmltZSA9IHRydWU7XHJcbiAgZm9yICg7IGsgPiAwOyBrLS0pIHtcclxuICAgIHZhciBhID0gdGhpcy5fcmFuZHJhbmdlKG5ldyBibigyKSwgbjEpO1xyXG4gICAgaWYgKGNiKVxyXG4gICAgICBjYihhKTtcclxuXHJcbiAgICB2YXIgeCA9IGEudG9SZWQocmVkKS5yZWRQb3coZCk7XHJcbiAgICBpZiAoeC5jbXAocm9uZSkgPT09IDAgfHwgeC5jbXAocm4xKSA9PT0gMClcclxuICAgICAgY29udGludWU7XHJcblxyXG4gICAgZm9yICh2YXIgaSA9IDE7IGkgPCBzOyBpKyspIHtcclxuICAgICAgeCA9IHgucmVkU3FyKCk7XHJcblxyXG4gICAgICBpZiAoeC5jbXAocm9uZSkgPT09IDApXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICBpZiAoeC5jbXAocm4xKSA9PT0gMClcclxuICAgICAgICBicmVhaztcclxuICAgIH1cclxuXHJcbiAgICBpZiAoaSA9PT0gcylcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHByaW1lO1xyXG59O1xyXG5cclxuTWlsbGVyUmFiaW4ucHJvdG90eXBlLmdldERpdmlzb3IgPSBmdW5jdGlvbiBnZXREaXZpc29yKG4sIGspIHtcclxuICB2YXIgbGVuID0gbi5iaXRMZW5ndGgoKTtcclxuICB2YXIgcmVkID0gYm4ubW9udChuKTtcclxuICB2YXIgcm9uZSA9IG5ldyBibigxKS50b1JlZChyZWQpO1xyXG5cclxuICBpZiAoIWspXHJcbiAgICBrID0gTWF0aC5tYXgoMSwgKGxlbiAvIDQ4KSB8IDApO1xyXG5cclxuICAvLyBGaW5kIGQgYW5kIHMsIChuIC0gMSkgPSAoMiBeIHMpICogZDtcclxuICB2YXIgbjEgPSBuLnN1Ym4oMSk7XHJcbiAgZm9yICh2YXIgcyA9IDA7ICFuMS50ZXN0bihzKTsgcysrKSB7fVxyXG4gIHZhciBkID0gbi5zaHJuKHMpO1xyXG5cclxuICB2YXIgcm4xID0gbjEudG9SZWQocmVkKTtcclxuXHJcbiAgZm9yICg7IGsgPiAwOyBrLS0pIHtcclxuICAgIHZhciBhID0gdGhpcy5fcmFuZHJhbmdlKG5ldyBibigyKSwgbjEpO1xyXG5cclxuICAgIHZhciBnID0gbi5nY2QoYSk7XHJcbiAgICBpZiAoZy5jbXBuKDEpICE9PSAwKVxyXG4gICAgICByZXR1cm4gZztcclxuXHJcbiAgICB2YXIgeCA9IGEudG9SZWQocmVkKS5yZWRQb3coZCk7XHJcbiAgICBpZiAoeC5jbXAocm9uZSkgPT09IDAgfHwgeC5jbXAocm4xKSA9PT0gMClcclxuICAgICAgY29udGludWU7XHJcblxyXG4gICAgZm9yICh2YXIgaSA9IDE7IGkgPCBzOyBpKyspIHtcclxuICAgICAgeCA9IHgucmVkU3FyKCk7XHJcblxyXG4gICAgICBpZiAoeC5jbXAocm9uZSkgPT09IDApXHJcbiAgICAgICAgcmV0dXJuIHguZnJvbVJlZCgpLnN1Ym4oMSkuZ2NkKG4pO1xyXG4gICAgICBpZiAoeC5jbXAocm4xKSA9PT0gMClcclxuICAgICAgICBicmVhaztcclxuICAgIH1cclxuXHJcbiAgICBpZiAoaSA9PT0gcykge1xyXG4gICAgICB4ID0geC5yZWRTcXIoKTtcclxuICAgICAgcmV0dXJuIHguZnJvbVJlZCgpLnN1Ym4oMSkuZ2NkKG4pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGZhbHNlO1xyXG59O1xyXG4iXSwic291cmNlUm9vdCI6IiJ9