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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbWlsbGVyLXJhYmluL2xpYi9tci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSxTQUFTLG1CQUFPLENBQUMsbUJBQU87QUFDeEIsY0FBYyxtQkFBTyxDQUFDLHFCQUFTOztBQUUvQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGlCQUFpQixjQUFjO0FBQy9COztBQUVBOztBQUVBO0FBQ0EsUUFBUSxPQUFPO0FBQ2Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxtQkFBbUIsT0FBTztBQUMxQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGlCQUFpQixjQUFjO0FBQy9COztBQUVBOztBQUVBLFFBQVEsT0FBTztBQUNmOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsbUJBQW1CLE9BQU87QUFDMUI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EiLCJmaWxlIjoidmVuZG9yL3ZlbmRvci5taWxsZXItcmFiaW4uZDk3ZWJiODg4ZWEyMWUzYjhhYWQuY2h1bmsuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgYm4gPSByZXF1aXJlKCdibi5qcycpO1xudmFyIGJyb3JhbmQgPSByZXF1aXJlKCdicm9yYW5kJyk7XG5cbmZ1bmN0aW9uIE1pbGxlclJhYmluKHJhbmQpIHtcbiAgdGhpcy5yYW5kID0gcmFuZCB8fCBuZXcgYnJvcmFuZC5SYW5kKCk7XG59XG5tb2R1bGUuZXhwb3J0cyA9IE1pbGxlclJhYmluO1xuXG5NaWxsZXJSYWJpbi5jcmVhdGUgPSBmdW5jdGlvbiBjcmVhdGUocmFuZCkge1xuICByZXR1cm4gbmV3IE1pbGxlclJhYmluKHJhbmQpO1xufTtcblxuTWlsbGVyUmFiaW4ucHJvdG90eXBlLl9yYW5kYmVsb3cgPSBmdW5jdGlvbiBfcmFuZGJlbG93KG4pIHtcbiAgdmFyIGxlbiA9IG4uYml0TGVuZ3RoKCk7XG4gIHZhciBtaW5fYnl0ZXMgPSBNYXRoLmNlaWwobGVuIC8gOCk7XG5cbiAgLy8gR2VuZXJhZ2UgcmFuZG9tIGJ5dGVzIHVudGlsIGEgbnVtYmVyIGxlc3MgdGhhbiBuIGlzIGZvdW5kLlxuICAvLyBUaGlzIGVuc3VyZXMgdGhhdCAwLi5uLTEgaGF2ZSBhbiBlcXVhbCBwcm9iYWJpbGl0eSBvZiBiZWluZyBzZWxlY3RlZC5cbiAgZG9cbiAgICB2YXIgYSA9IG5ldyBibih0aGlzLnJhbmQuZ2VuZXJhdGUobWluX2J5dGVzKSk7XG4gIHdoaWxlIChhLmNtcChuKSA+PSAwKTtcblxuICByZXR1cm4gYTtcbn07XG5cbk1pbGxlclJhYmluLnByb3RvdHlwZS5fcmFuZHJhbmdlID0gZnVuY3Rpb24gX3JhbmRyYW5nZShzdGFydCwgc3RvcCkge1xuICAvLyBHZW5lcmF0ZSBhIHJhbmRvbSBudW1iZXIgZ3JlYXRlciB0aGFuIG9yIGVxdWFsIHRvIHN0YXJ0IGFuZCBsZXNzIHRoYW4gc3RvcC5cbiAgdmFyIHNpemUgPSBzdG9wLnN1YihzdGFydCk7XG4gIHJldHVybiBzdGFydC5hZGQodGhpcy5fcmFuZGJlbG93KHNpemUpKTtcbn07XG5cbk1pbGxlclJhYmluLnByb3RvdHlwZS50ZXN0ID0gZnVuY3Rpb24gdGVzdChuLCBrLCBjYikge1xuICB2YXIgbGVuID0gbi5iaXRMZW5ndGgoKTtcbiAgdmFyIHJlZCA9IGJuLm1vbnQobik7XG4gIHZhciByb25lID0gbmV3IGJuKDEpLnRvUmVkKHJlZCk7XG5cbiAgaWYgKCFrKVxuICAgIGsgPSBNYXRoLm1heCgxLCAobGVuIC8gNDgpIHwgMCk7XG5cbiAgLy8gRmluZCBkIGFuZCBzLCAobiAtIDEpID0gKDIgXiBzKSAqIGQ7XG4gIHZhciBuMSA9IG4uc3VibigxKTtcbiAgZm9yICh2YXIgcyA9IDA7ICFuMS50ZXN0bihzKTsgcysrKSB7fVxuICB2YXIgZCA9IG4uc2hybihzKTtcblxuICB2YXIgcm4xID0gbjEudG9SZWQocmVkKTtcblxuICB2YXIgcHJpbWUgPSB0cnVlO1xuICBmb3IgKDsgayA+IDA7IGstLSkge1xuICAgIHZhciBhID0gdGhpcy5fcmFuZHJhbmdlKG5ldyBibigyKSwgbjEpO1xuICAgIGlmIChjYilcbiAgICAgIGNiKGEpO1xuXG4gICAgdmFyIHggPSBhLnRvUmVkKHJlZCkucmVkUG93KGQpO1xuICAgIGlmICh4LmNtcChyb25lKSA9PT0gMCB8fCB4LmNtcChybjEpID09PSAwKVxuICAgICAgY29udGludWU7XG5cbiAgICBmb3IgKHZhciBpID0gMTsgaSA8IHM7IGkrKykge1xuICAgICAgeCA9IHgucmVkU3FyKCk7XG5cbiAgICAgIGlmICh4LmNtcChyb25lKSA9PT0gMClcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgaWYgKHguY21wKHJuMSkgPT09IDApXG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIGlmIChpID09PSBzKVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHByaW1lO1xufTtcblxuTWlsbGVyUmFiaW4ucHJvdG90eXBlLmdldERpdmlzb3IgPSBmdW5jdGlvbiBnZXREaXZpc29yKG4sIGspIHtcbiAgdmFyIGxlbiA9IG4uYml0TGVuZ3RoKCk7XG4gIHZhciByZWQgPSBibi5tb250KG4pO1xuICB2YXIgcm9uZSA9IG5ldyBibigxKS50b1JlZChyZWQpO1xuXG4gIGlmICghaylcbiAgICBrID0gTWF0aC5tYXgoMSwgKGxlbiAvIDQ4KSB8IDApO1xuXG4gIC8vIEZpbmQgZCBhbmQgcywgKG4gLSAxKSA9ICgyIF4gcykgKiBkO1xuICB2YXIgbjEgPSBuLnN1Ym4oMSk7XG4gIGZvciAodmFyIHMgPSAwOyAhbjEudGVzdG4ocyk7IHMrKykge31cbiAgdmFyIGQgPSBuLnNocm4ocyk7XG5cbiAgdmFyIHJuMSA9IG4xLnRvUmVkKHJlZCk7XG5cbiAgZm9yICg7IGsgPiAwOyBrLS0pIHtcbiAgICB2YXIgYSA9IHRoaXMuX3JhbmRyYW5nZShuZXcgYm4oMiksIG4xKTtcblxuICAgIHZhciBnID0gbi5nY2QoYSk7XG4gICAgaWYgKGcuY21wbigxKSAhPT0gMClcbiAgICAgIHJldHVybiBnO1xuXG4gICAgdmFyIHggPSBhLnRvUmVkKHJlZCkucmVkUG93KGQpO1xuICAgIGlmICh4LmNtcChyb25lKSA9PT0gMCB8fCB4LmNtcChybjEpID09PSAwKVxuICAgICAgY29udGludWU7XG5cbiAgICBmb3IgKHZhciBpID0gMTsgaSA8IHM7IGkrKykge1xuICAgICAgeCA9IHgucmVkU3FyKCk7XG5cbiAgICAgIGlmICh4LmNtcChyb25lKSA9PT0gMClcbiAgICAgICAgcmV0dXJuIHguZnJvbVJlZCgpLnN1Ym4oMSkuZ2NkKG4pO1xuICAgICAgaWYgKHguY21wKHJuMSkgPT09IDApXG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIGlmIChpID09PSBzKSB7XG4gICAgICB4ID0geC5yZWRTcXIoKTtcbiAgICAgIHJldHVybiB4LmZyb21SZWQoKS5zdWJuKDEpLmdjZChuKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59O1xuIl0sInNvdXJjZVJvb3QiOiIifQ==