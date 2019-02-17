(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["vendor/vendor.browserify-des"],{

/***/ "C+gy":
/*!**********************************************!*\
  !*** ./node_modules/browserify-des/modes.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

exports['des-ecb'] = {
  key: 8,
  iv: 0
}
exports['des-cbc'] = exports.des = {
  key: 8,
  iv: 8
}
exports['des-ede3-cbc'] = exports.des3 = {
  key: 24,
  iv: 8
}
exports['des-ede3'] = {
  key: 24,
  iv: 0
}
exports['des-ede-cbc'] = {
  key: 16,
  iv: 8
}
exports['des-ede'] = {
  key: 16,
  iv: 0
}


/***/ }),

/***/ "Hjy1":
/*!**********************************************!*\
  !*** ./node_modules/browserify-des/index.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var CipherBase = __webpack_require__(/*! cipher-base */ "ZDAU")
var des = __webpack_require__(/*! des.js */ "FUXG")
var inherits = __webpack_require__(/*! inherits */ "P7XM")
var Buffer = __webpack_require__(/*! safe-buffer */ "hwdV").Buffer

var modes = {
  'des-ede3-cbc': des.CBC.instantiate(des.EDE),
  'des-ede3': des.EDE,
  'des-ede-cbc': des.CBC.instantiate(des.EDE),
  'des-ede': des.EDE,
  'des-cbc': des.CBC.instantiate(des.DES),
  'des-ecb': des.DES
}
modes.des = modes['des-cbc']
modes.des3 = modes['des-ede3-cbc']
module.exports = DES
inherits(DES, CipherBase)
function DES (opts) {
  CipherBase.call(this)
  var modeName = opts.mode.toLowerCase()
  var mode = modes[modeName]
  var type
  if (opts.decrypt) {
    type = 'decrypt'
  } else {
    type = 'encrypt'
  }
  var key = opts.key
  if (!Buffer.isBuffer(key)) {
    key = Buffer.from(key)
  }
  if (modeName === 'des-ede' || modeName === 'des-ede-cbc') {
    key = Buffer.concat([key, key.slice(0, 8)])
  }
  var iv = opts.iv
  if (!Buffer.isBuffer(iv)) {
    iv = Buffer.from(iv)
  }
  this._des = mode.create({
    key: key,
    iv: iv,
    type: type
  })
}
DES.prototype._update = function (data) {
  return Buffer.from(this._des.update(data))
}
DES.prototype._final = function () {
  return Buffer.from(this._des.final())
}


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS1kZXMvbW9kZXMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnktZGVzL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDdkJBLGlCQUFpQixtQkFBTyxDQUFDLHlCQUFhO0FBQ3RDLFVBQVUsbUJBQU8sQ0FBQyxvQkFBUTtBQUMxQixlQUFlLG1CQUFPLENBQUMsc0JBQVU7QUFDakMsYUFBYSxtQkFBTyxDQUFDLHlCQUFhOztBQUVsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6InZlbmRvci92ZW5kb3IuYnJvd3NlcmlmeS1kZXMuNjliYTJkMWNjNWY4NTM1MzljODQuY2h1bmsuanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnRzWydkZXMtZWNiJ10gPSB7XG4gIGtleTogOCxcbiAgaXY6IDBcbn1cbmV4cG9ydHNbJ2Rlcy1jYmMnXSA9IGV4cG9ydHMuZGVzID0ge1xuICBrZXk6IDgsXG4gIGl2OiA4XG59XG5leHBvcnRzWydkZXMtZWRlMy1jYmMnXSA9IGV4cG9ydHMuZGVzMyA9IHtcbiAga2V5OiAyNCxcbiAgaXY6IDhcbn1cbmV4cG9ydHNbJ2Rlcy1lZGUzJ10gPSB7XG4gIGtleTogMjQsXG4gIGl2OiAwXG59XG5leHBvcnRzWydkZXMtZWRlLWNiYyddID0ge1xuICBrZXk6IDE2LFxuICBpdjogOFxufVxuZXhwb3J0c1snZGVzLWVkZSddID0ge1xuICBrZXk6IDE2LFxuICBpdjogMFxufVxuIiwidmFyIENpcGhlckJhc2UgPSByZXF1aXJlKCdjaXBoZXItYmFzZScpXG52YXIgZGVzID0gcmVxdWlyZSgnZGVzLmpzJylcbnZhciBpbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJylcbnZhciBCdWZmZXIgPSByZXF1aXJlKCdzYWZlLWJ1ZmZlcicpLkJ1ZmZlclxuXG52YXIgbW9kZXMgPSB7XG4gICdkZXMtZWRlMy1jYmMnOiBkZXMuQ0JDLmluc3RhbnRpYXRlKGRlcy5FREUpLFxuICAnZGVzLWVkZTMnOiBkZXMuRURFLFxuICAnZGVzLWVkZS1jYmMnOiBkZXMuQ0JDLmluc3RhbnRpYXRlKGRlcy5FREUpLFxuICAnZGVzLWVkZSc6IGRlcy5FREUsXG4gICdkZXMtY2JjJzogZGVzLkNCQy5pbnN0YW50aWF0ZShkZXMuREVTKSxcbiAgJ2Rlcy1lY2InOiBkZXMuREVTXG59XG5tb2Rlcy5kZXMgPSBtb2Rlc1snZGVzLWNiYyddXG5tb2Rlcy5kZXMzID0gbW9kZXNbJ2Rlcy1lZGUzLWNiYyddXG5tb2R1bGUuZXhwb3J0cyA9IERFU1xuaW5oZXJpdHMoREVTLCBDaXBoZXJCYXNlKVxuZnVuY3Rpb24gREVTIChvcHRzKSB7XG4gIENpcGhlckJhc2UuY2FsbCh0aGlzKVxuICB2YXIgbW9kZU5hbWUgPSBvcHRzLm1vZGUudG9Mb3dlckNhc2UoKVxuICB2YXIgbW9kZSA9IG1vZGVzW21vZGVOYW1lXVxuICB2YXIgdHlwZVxuICBpZiAob3B0cy5kZWNyeXB0KSB7XG4gICAgdHlwZSA9ICdkZWNyeXB0J1xuICB9IGVsc2Uge1xuICAgIHR5cGUgPSAnZW5jcnlwdCdcbiAgfVxuICB2YXIga2V5ID0gb3B0cy5rZXlcbiAgaWYgKCFCdWZmZXIuaXNCdWZmZXIoa2V5KSkge1xuICAgIGtleSA9IEJ1ZmZlci5mcm9tKGtleSlcbiAgfVxuICBpZiAobW9kZU5hbWUgPT09ICdkZXMtZWRlJyB8fCBtb2RlTmFtZSA9PT0gJ2Rlcy1lZGUtY2JjJykge1xuICAgIGtleSA9IEJ1ZmZlci5jb25jYXQoW2tleSwga2V5LnNsaWNlKDAsIDgpXSlcbiAgfVxuICB2YXIgaXYgPSBvcHRzLml2XG4gIGlmICghQnVmZmVyLmlzQnVmZmVyKGl2KSkge1xuICAgIGl2ID0gQnVmZmVyLmZyb20oaXYpXG4gIH1cbiAgdGhpcy5fZGVzID0gbW9kZS5jcmVhdGUoe1xuICAgIGtleToga2V5LFxuICAgIGl2OiBpdixcbiAgICB0eXBlOiB0eXBlXG4gIH0pXG59XG5ERVMucHJvdG90eXBlLl91cGRhdGUgPSBmdW5jdGlvbiAoZGF0YSkge1xuICByZXR1cm4gQnVmZmVyLmZyb20odGhpcy5fZGVzLnVwZGF0ZShkYXRhKSlcbn1cbkRFUy5wcm90b3R5cGUuX2ZpbmFsID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gQnVmZmVyLmZyb20odGhpcy5fZGVzLmZpbmFsKCkpXG59XG4iXSwic291cmNlUm9vdCI6IiJ9