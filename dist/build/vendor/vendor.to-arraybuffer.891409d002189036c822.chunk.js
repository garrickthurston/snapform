(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["vendor/vendor.to-arraybuffer"],{

/***/ "2Tiy":
/*!**********************************************!*\
  !*** ./node_modules/to-arraybuffer/index.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Buffer = __webpack_require__(/*! buffer */ "tjlA").Buffer

module.exports = function (buf) {
	// If the buffer is backed by a Uint8Array, a faster version will work
	if (buf instanceof Uint8Array) {
		// If the buffer isn't a subarray, return the underlying ArrayBuffer
		if (buf.byteOffset === 0 && buf.byteLength === buf.buffer.byteLength) {
			return buf.buffer
		} else if (typeof buf.buffer.slice === 'function') {
			// Otherwise we need to get a proper copy
			return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength)
		}
	}

	if (Buffer.isBuffer(buf)) {
		// This is the slow version that will work with any Buffer
		// implementation (even in old browsers)
		var arrayCopy = new Uint8Array(buf.length)
		var len = buf.length
		for (var i = 0; i < len; i++) {
			arrayCopy[i] = buf[i]
		}
		return arrayCopy.buffer
	} else {
		throw new Error('Argument must be a Buffer')
	}
}


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdG8tYXJyYXlidWZmZXIvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsYUFBYSxtQkFBTyxDQUFDLG9CQUFROztBQUU3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQixTQUFTO0FBQzFCO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0EiLCJmaWxlIjoiYnVpbGQvdmVuZG9yL3ZlbmRvci50by1hcnJheWJ1ZmZlci44OTE0MDlkMDAyMTg5MDM2YzgyMi5jaHVuay5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBCdWZmZXIgPSByZXF1aXJlKCdidWZmZXInKS5CdWZmZXJcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGJ1Zikge1xyXG5cdC8vIElmIHRoZSBidWZmZXIgaXMgYmFja2VkIGJ5IGEgVWludDhBcnJheSwgYSBmYXN0ZXIgdmVyc2lvbiB3aWxsIHdvcmtcclxuXHRpZiAoYnVmIGluc3RhbmNlb2YgVWludDhBcnJheSkge1xyXG5cdFx0Ly8gSWYgdGhlIGJ1ZmZlciBpc24ndCBhIHN1YmFycmF5LCByZXR1cm4gdGhlIHVuZGVybHlpbmcgQXJyYXlCdWZmZXJcclxuXHRcdGlmIChidWYuYnl0ZU9mZnNldCA9PT0gMCAmJiBidWYuYnl0ZUxlbmd0aCA9PT0gYnVmLmJ1ZmZlci5ieXRlTGVuZ3RoKSB7XHJcblx0XHRcdHJldHVybiBidWYuYnVmZmVyXHJcblx0XHR9IGVsc2UgaWYgKHR5cGVvZiBidWYuYnVmZmVyLnNsaWNlID09PSAnZnVuY3Rpb24nKSB7XHJcblx0XHRcdC8vIE90aGVyd2lzZSB3ZSBuZWVkIHRvIGdldCBhIHByb3BlciBjb3B5XHJcblx0XHRcdHJldHVybiBidWYuYnVmZmVyLnNsaWNlKGJ1Zi5ieXRlT2Zmc2V0LCBidWYuYnl0ZU9mZnNldCArIGJ1Zi5ieXRlTGVuZ3RoKVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0aWYgKEJ1ZmZlci5pc0J1ZmZlcihidWYpKSB7XHJcblx0XHQvLyBUaGlzIGlzIHRoZSBzbG93IHZlcnNpb24gdGhhdCB3aWxsIHdvcmsgd2l0aCBhbnkgQnVmZmVyXHJcblx0XHQvLyBpbXBsZW1lbnRhdGlvbiAoZXZlbiBpbiBvbGQgYnJvd3NlcnMpXHJcblx0XHR2YXIgYXJyYXlDb3B5ID0gbmV3IFVpbnQ4QXJyYXkoYnVmLmxlbmd0aClcclxuXHRcdHZhciBsZW4gPSBidWYubGVuZ3RoXHJcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XHJcblx0XHRcdGFycmF5Q29weVtpXSA9IGJ1ZltpXVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGFycmF5Q29weS5idWZmZXJcclxuXHR9IGVsc2Uge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKCdBcmd1bWVudCBtdXN0IGJlIGEgQnVmZmVyJylcclxuXHR9XHJcbn1cclxuIl0sInNvdXJjZVJvb3QiOiIifQ==