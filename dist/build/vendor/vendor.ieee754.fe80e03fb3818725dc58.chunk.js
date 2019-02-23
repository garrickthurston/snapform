(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["vendor/vendor.ieee754"],{

/***/ "kVK+":
/*!***************************************!*\
  !*** ./node_modules/ieee754/index.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvaWVlZTc1NC9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsUUFBUSxXQUFXOztBQUVuQjtBQUNBO0FBQ0E7QUFDQSxRQUFRLFdBQVc7O0FBRW5CO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxRQUFRLFdBQVc7O0FBRW5CO0FBQ0E7QUFDQSxRQUFRLFVBQVU7O0FBRWxCO0FBQ0EiLCJmaWxlIjoiYnVpbGQvdmVuZG9yL3ZlbmRvci5pZWVlNzU0LmZlODBlMDNmYjM4MTg3MjVkYzU4LmNodW5rLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0cy5yZWFkID0gZnVuY3Rpb24gKGJ1ZmZlciwgb2Zmc2V0LCBpc0xFLCBtTGVuLCBuQnl0ZXMpIHtcclxuICB2YXIgZSwgbVxyXG4gIHZhciBlTGVuID0gKG5CeXRlcyAqIDgpIC0gbUxlbiAtIDFcclxuICB2YXIgZU1heCA9ICgxIDw8IGVMZW4pIC0gMVxyXG4gIHZhciBlQmlhcyA9IGVNYXggPj4gMVxyXG4gIHZhciBuQml0cyA9IC03XHJcbiAgdmFyIGkgPSBpc0xFID8gKG5CeXRlcyAtIDEpIDogMFxyXG4gIHZhciBkID0gaXNMRSA/IC0xIDogMVxyXG4gIHZhciBzID0gYnVmZmVyW29mZnNldCArIGldXHJcblxyXG4gIGkgKz0gZFxyXG5cclxuICBlID0gcyAmICgoMSA8PCAoLW5CaXRzKSkgLSAxKVxyXG4gIHMgPj49ICgtbkJpdHMpXHJcbiAgbkJpdHMgKz0gZUxlblxyXG4gIGZvciAoOyBuQml0cyA+IDA7IGUgPSAoZSAqIDI1NikgKyBidWZmZXJbb2Zmc2V0ICsgaV0sIGkgKz0gZCwgbkJpdHMgLT0gOCkge31cclxuXHJcbiAgbSA9IGUgJiAoKDEgPDwgKC1uQml0cykpIC0gMSlcclxuICBlID4+PSAoLW5CaXRzKVxyXG4gIG5CaXRzICs9IG1MZW5cclxuICBmb3IgKDsgbkJpdHMgPiAwOyBtID0gKG0gKiAyNTYpICsgYnVmZmVyW29mZnNldCArIGldLCBpICs9IGQsIG5CaXRzIC09IDgpIHt9XHJcblxyXG4gIGlmIChlID09PSAwKSB7XHJcbiAgICBlID0gMSAtIGVCaWFzXHJcbiAgfSBlbHNlIGlmIChlID09PSBlTWF4KSB7XHJcbiAgICByZXR1cm4gbSA/IE5hTiA6ICgocyA/IC0xIDogMSkgKiBJbmZpbml0eSlcclxuICB9IGVsc2Uge1xyXG4gICAgbSA9IG0gKyBNYXRoLnBvdygyLCBtTGVuKVxyXG4gICAgZSA9IGUgLSBlQmlhc1xyXG4gIH1cclxuICByZXR1cm4gKHMgPyAtMSA6IDEpICogbSAqIE1hdGgucG93KDIsIGUgLSBtTGVuKVxyXG59XHJcblxyXG5leHBvcnRzLndyaXRlID0gZnVuY3Rpb24gKGJ1ZmZlciwgdmFsdWUsIG9mZnNldCwgaXNMRSwgbUxlbiwgbkJ5dGVzKSB7XHJcbiAgdmFyIGUsIG0sIGNcclxuICB2YXIgZUxlbiA9IChuQnl0ZXMgKiA4KSAtIG1MZW4gLSAxXHJcbiAgdmFyIGVNYXggPSAoMSA8PCBlTGVuKSAtIDFcclxuICB2YXIgZUJpYXMgPSBlTWF4ID4+IDFcclxuICB2YXIgcnQgPSAobUxlbiA9PT0gMjMgPyBNYXRoLnBvdygyLCAtMjQpIC0gTWF0aC5wb3coMiwgLTc3KSA6IDApXHJcbiAgdmFyIGkgPSBpc0xFID8gMCA6IChuQnl0ZXMgLSAxKVxyXG4gIHZhciBkID0gaXNMRSA/IDEgOiAtMVxyXG4gIHZhciBzID0gdmFsdWUgPCAwIHx8ICh2YWx1ZSA9PT0gMCAmJiAxIC8gdmFsdWUgPCAwKSA/IDEgOiAwXHJcblxyXG4gIHZhbHVlID0gTWF0aC5hYnModmFsdWUpXHJcblxyXG4gIGlmIChpc05hTih2YWx1ZSkgfHwgdmFsdWUgPT09IEluZmluaXR5KSB7XHJcbiAgICBtID0gaXNOYU4odmFsdWUpID8gMSA6IDBcclxuICAgIGUgPSBlTWF4XHJcbiAgfSBlbHNlIHtcclxuICAgIGUgPSBNYXRoLmZsb29yKE1hdGgubG9nKHZhbHVlKSAvIE1hdGguTE4yKVxyXG4gICAgaWYgKHZhbHVlICogKGMgPSBNYXRoLnBvdygyLCAtZSkpIDwgMSkge1xyXG4gICAgICBlLS1cclxuICAgICAgYyAqPSAyXHJcbiAgICB9XHJcbiAgICBpZiAoZSArIGVCaWFzID49IDEpIHtcclxuICAgICAgdmFsdWUgKz0gcnQgLyBjXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB2YWx1ZSArPSBydCAqIE1hdGgucG93KDIsIDEgLSBlQmlhcylcclxuICAgIH1cclxuICAgIGlmICh2YWx1ZSAqIGMgPj0gMikge1xyXG4gICAgICBlKytcclxuICAgICAgYyAvPSAyXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGUgKyBlQmlhcyA+PSBlTWF4KSB7XHJcbiAgICAgIG0gPSAwXHJcbiAgICAgIGUgPSBlTWF4XHJcbiAgICB9IGVsc2UgaWYgKGUgKyBlQmlhcyA+PSAxKSB7XHJcbiAgICAgIG0gPSAoKHZhbHVlICogYykgLSAxKSAqIE1hdGgucG93KDIsIG1MZW4pXHJcbiAgICAgIGUgPSBlICsgZUJpYXNcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIG0gPSB2YWx1ZSAqIE1hdGgucG93KDIsIGVCaWFzIC0gMSkgKiBNYXRoLnBvdygyLCBtTGVuKVxyXG4gICAgICBlID0gMFxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZm9yICg7IG1MZW4gPj0gODsgYnVmZmVyW29mZnNldCArIGldID0gbSAmIDB4ZmYsIGkgKz0gZCwgbSAvPSAyNTYsIG1MZW4gLT0gOCkge31cclxuXHJcbiAgZSA9IChlIDw8IG1MZW4pIHwgbVxyXG4gIGVMZW4gKz0gbUxlblxyXG4gIGZvciAoOyBlTGVuID4gMDsgYnVmZmVyW29mZnNldCArIGldID0gZSAmIDB4ZmYsIGkgKz0gZCwgZSAvPSAyNTYsIGVMZW4gLT0gOCkge31cclxuXHJcbiAgYnVmZmVyW29mZnNldCArIGkgLSBkXSB8PSBzICogMTI4XHJcbn1cclxuIl0sInNvdXJjZVJvb3QiOiIifQ==