(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["vendor/vendor.ecdsa-sig-formatter"],{

/***/ "LgVm":
/*!*********************************************************************!*\
  !*** ./node_modules/ecdsa-sig-formatter/src/param-bytes-for-alg.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function getParamSize(keySize) {
	var result = ((keySize / 8) | 0) + (keySize % 8 === 0 ? 0 : 1);
	return result;
}

var paramBytesForAlg = {
	ES256: getParamSize(256),
	ES384: getParamSize(384),
	ES512: getParamSize(521)
};

function getParamBytesForAlg(alg) {
	var paramBytes = paramBytesForAlg[alg];
	if (paramBytes) {
		return paramBytes;
	}

	throw new Error('Unknown algorithm "' + alg + '"');
}

module.exports = getParamBytesForAlg;


/***/ }),

/***/ "ij2l":
/*!*********************************************************************!*\
  !*** ./node_modules/ecdsa-sig-formatter/src/ecdsa-sig-formatter.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Buffer = __webpack_require__(/*! safe-buffer */ "hwdV").Buffer;

var getParamBytesForAlg = __webpack_require__(/*! ./param-bytes-for-alg */ "LgVm");

var MAX_OCTET = 0x80,
	CLASS_UNIVERSAL = 0,
	PRIMITIVE_BIT = 0x20,
	TAG_SEQ = 0x10,
	TAG_INT = 0x02,
	ENCODED_TAG_SEQ = (TAG_SEQ | PRIMITIVE_BIT) | (CLASS_UNIVERSAL << 6),
	ENCODED_TAG_INT = TAG_INT | (CLASS_UNIVERSAL << 6);

function base64Url(base64) {
	return base64
		.replace(/=/g, '')
		.replace(/\+/g, '-')
		.replace(/\//g, '_');
}

function signatureAsBuffer(signature) {
	if (Buffer.isBuffer(signature)) {
		return signature;
	} else if ('string' === typeof signature) {
		return Buffer.from(signature, 'base64');
	}

	throw new TypeError('ECDSA signature must be a Base64 string or a Buffer');
}

function derToJose(signature, alg) {
	signature = signatureAsBuffer(signature);
	var paramBytes = getParamBytesForAlg(alg);

	// the DER encoded param should at most be the param size, plus a padding
	// zero, since due to being a signed integer
	var maxEncodedParamLength = paramBytes + 1;

	var inputLength = signature.length;

	var offset = 0;
	if (signature[offset++] !== ENCODED_TAG_SEQ) {
		throw new Error('Could not find expected "seq"');
	}

	var seqLength = signature[offset++];
	if (seqLength === (MAX_OCTET | 1)) {
		seqLength = signature[offset++];
	}

	if (inputLength - offset < seqLength) {
		throw new Error('"seq" specified length of "' + seqLength + '", only "' + (inputLength - offset) + '" remaining');
	}

	if (signature[offset++] !== ENCODED_TAG_INT) {
		throw new Error('Could not find expected "int" for "r"');
	}

	var rLength = signature[offset++];

	if (inputLength - offset - 2 < rLength) {
		throw new Error('"r" specified length of "' + rLength + '", only "' + (inputLength - offset - 2) + '" available');
	}

	if (maxEncodedParamLength < rLength) {
		throw new Error('"r" specified length of "' + rLength + '", max of "' + maxEncodedParamLength + '" is acceptable');
	}

	var rOffset = offset;
	offset += rLength;

	if (signature[offset++] !== ENCODED_TAG_INT) {
		throw new Error('Could not find expected "int" for "s"');
	}

	var sLength = signature[offset++];

	if (inputLength - offset !== sLength) {
		throw new Error('"s" specified length of "' + sLength + '", expected "' + (inputLength - offset) + '"');
	}

	if (maxEncodedParamLength < sLength) {
		throw new Error('"s" specified length of "' + sLength + '", max of "' + maxEncodedParamLength + '" is acceptable');
	}

	var sOffset = offset;
	offset += sLength;

	if (offset !== inputLength) {
		throw new Error('Expected to consume entire buffer, but "' + (inputLength - offset) + '" bytes remain');
	}

	var rPadding = paramBytes - rLength,
		sPadding = paramBytes - sLength;

	var dst = Buffer.allocUnsafe(rPadding + rLength + sPadding + sLength);

	for (offset = 0; offset < rPadding; ++offset) {
		dst[offset] = 0;
	}
	signature.copy(dst, offset, rOffset + Math.max(-rPadding, 0), rOffset + rLength);

	offset = paramBytes;

	for (var o = offset; offset < o + sPadding; ++offset) {
		dst[offset] = 0;
	}
	signature.copy(dst, offset, sOffset + Math.max(-sPadding, 0), sOffset + sLength);

	dst = dst.toString('base64');
	dst = base64Url(dst);

	return dst;
}

function countPadding(buf, start, stop) {
	var padding = 0;
	while (start + padding < stop && buf[start + padding] === 0) {
		++padding;
	}

	var needsSign = buf[start + padding] >= MAX_OCTET;
	if (needsSign) {
		--padding;
	}

	return padding;
}

function joseToDer(signature, alg) {
	signature = signatureAsBuffer(signature);
	var paramBytes = getParamBytesForAlg(alg);

	var signatureBytes = signature.length;
	if (signatureBytes !== paramBytes * 2) {
		throw new TypeError('"' + alg + '" signatures must be "' + paramBytes * 2 + '" bytes, saw "' + signatureBytes + '"');
	}

	var rPadding = countPadding(signature, 0, paramBytes);
	var sPadding = countPadding(signature, paramBytes, signature.length);
	var rLength = paramBytes - rPadding;
	var sLength = paramBytes - sPadding;

	var rsBytes = 1 + 1 + rLength + 1 + 1 + sLength;

	var shortLength = rsBytes < MAX_OCTET;

	var dst = Buffer.allocUnsafe((shortLength ? 2 : 3) + rsBytes);

	var offset = 0;
	dst[offset++] = ENCODED_TAG_SEQ;
	if (shortLength) {
		// Bit 8 has value "0"
		// bits 7-1 give the length.
		dst[offset++] = rsBytes;
	} else {
		// Bit 8 of first octet has value "1"
		// bits 7-1 give the number of additional length octets.
		dst[offset++] = MAX_OCTET	| 1;
		// length, base 256
		dst[offset++] = rsBytes & 0xff;
	}
	dst[offset++] = ENCODED_TAG_INT;
	dst[offset++] = rLength;
	if (rPadding < 0) {
		dst[offset++] = 0;
		offset += signature.copy(dst, offset, 0, paramBytes);
	} else {
		offset += signature.copy(dst, offset, rPadding, paramBytes);
	}
	dst[offset++] = ENCODED_TAG_INT;
	dst[offset++] = sLength;
	if (sPadding < 0) {
		dst[offset++] = 0;
		signature.copy(dst, offset, paramBytes);
	} else {
		signature.copy(dst, offset, paramBytes + sPadding);
	}

	return dst;
}

module.exports = {
	derToJose: derToJose,
	joseToDer: joseToDer
};


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZWNkc2Etc2lnLWZvcm1hdHRlci9zcmMvcGFyYW0tYnl0ZXMtZm9yLWFsZy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZWNkc2Etc2lnLWZvcm1hdHRlci9zcmMvZWNkc2Etc2lnLWZvcm1hdHRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQWE7O0FBRWI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7Ozs7QUN0QmE7O0FBRWIsYUFBYSxtQkFBTyxDQUFDLHlCQUFhOztBQUVsQywwQkFBMEIsbUJBQU8sQ0FBQyxtQ0FBdUI7O0FBRXpEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQSxpQkFBaUIsbUJBQW1CO0FBQ3BDO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxxQkFBcUIsdUJBQXVCO0FBQzVDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYnVpbGQvdmVuZG9yL3ZlbmRvci5lY2RzYS1zaWctZm9ybWF0dGVyLmNlMWQzZDMzMWQ0MjA0ZWM5YzU1LmNodW5rLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xyXG5cclxuZnVuY3Rpb24gZ2V0UGFyYW1TaXplKGtleVNpemUpIHtcclxuXHR2YXIgcmVzdWx0ID0gKChrZXlTaXplIC8gOCkgfCAwKSArIChrZXlTaXplICUgOCA9PT0gMCA/IDAgOiAxKTtcclxuXHRyZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG52YXIgcGFyYW1CeXRlc0ZvckFsZyA9IHtcclxuXHRFUzI1NjogZ2V0UGFyYW1TaXplKDI1NiksXHJcblx0RVMzODQ6IGdldFBhcmFtU2l6ZSgzODQpLFxyXG5cdEVTNTEyOiBnZXRQYXJhbVNpemUoNTIxKVxyXG59O1xyXG5cclxuZnVuY3Rpb24gZ2V0UGFyYW1CeXRlc0ZvckFsZyhhbGcpIHtcclxuXHR2YXIgcGFyYW1CeXRlcyA9IHBhcmFtQnl0ZXNGb3JBbGdbYWxnXTtcclxuXHRpZiAocGFyYW1CeXRlcykge1xyXG5cdFx0cmV0dXJuIHBhcmFtQnl0ZXM7XHJcblx0fVxyXG5cclxuXHR0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gYWxnb3JpdGhtIFwiJyArIGFsZyArICdcIicpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGdldFBhcmFtQnl0ZXNGb3JBbGc7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBCdWZmZXIgPSByZXF1aXJlKCdzYWZlLWJ1ZmZlcicpLkJ1ZmZlcjtcclxuXHJcbnZhciBnZXRQYXJhbUJ5dGVzRm9yQWxnID0gcmVxdWlyZSgnLi9wYXJhbS1ieXRlcy1mb3ItYWxnJyk7XHJcblxyXG52YXIgTUFYX09DVEVUID0gMHg4MCxcclxuXHRDTEFTU19VTklWRVJTQUwgPSAwLFxyXG5cdFBSSU1JVElWRV9CSVQgPSAweDIwLFxyXG5cdFRBR19TRVEgPSAweDEwLFxyXG5cdFRBR19JTlQgPSAweDAyLFxyXG5cdEVOQ09ERURfVEFHX1NFUSA9IChUQUdfU0VRIHwgUFJJTUlUSVZFX0JJVCkgfCAoQ0xBU1NfVU5JVkVSU0FMIDw8IDYpLFxyXG5cdEVOQ09ERURfVEFHX0lOVCA9IFRBR19JTlQgfCAoQ0xBU1NfVU5JVkVSU0FMIDw8IDYpO1xyXG5cclxuZnVuY3Rpb24gYmFzZTY0VXJsKGJhc2U2NCkge1xyXG5cdHJldHVybiBiYXNlNjRcclxuXHRcdC5yZXBsYWNlKC89L2csICcnKVxyXG5cdFx0LnJlcGxhY2UoL1xcKy9nLCAnLScpXHJcblx0XHQucmVwbGFjZSgvXFwvL2csICdfJyk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNpZ25hdHVyZUFzQnVmZmVyKHNpZ25hdHVyZSkge1xyXG5cdGlmIChCdWZmZXIuaXNCdWZmZXIoc2lnbmF0dXJlKSkge1xyXG5cdFx0cmV0dXJuIHNpZ25hdHVyZTtcclxuXHR9IGVsc2UgaWYgKCdzdHJpbmcnID09PSB0eXBlb2Ygc2lnbmF0dXJlKSB7XHJcblx0XHRyZXR1cm4gQnVmZmVyLmZyb20oc2lnbmF0dXJlLCAnYmFzZTY0Jyk7XHJcblx0fVxyXG5cclxuXHR0aHJvdyBuZXcgVHlwZUVycm9yKCdFQ0RTQSBzaWduYXR1cmUgbXVzdCBiZSBhIEJhc2U2NCBzdHJpbmcgb3IgYSBCdWZmZXInKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZGVyVG9Kb3NlKHNpZ25hdHVyZSwgYWxnKSB7XHJcblx0c2lnbmF0dXJlID0gc2lnbmF0dXJlQXNCdWZmZXIoc2lnbmF0dXJlKTtcclxuXHR2YXIgcGFyYW1CeXRlcyA9IGdldFBhcmFtQnl0ZXNGb3JBbGcoYWxnKTtcclxuXHJcblx0Ly8gdGhlIERFUiBlbmNvZGVkIHBhcmFtIHNob3VsZCBhdCBtb3N0IGJlIHRoZSBwYXJhbSBzaXplLCBwbHVzIGEgcGFkZGluZ1xyXG5cdC8vIHplcm8sIHNpbmNlIGR1ZSB0byBiZWluZyBhIHNpZ25lZCBpbnRlZ2VyXHJcblx0dmFyIG1heEVuY29kZWRQYXJhbUxlbmd0aCA9IHBhcmFtQnl0ZXMgKyAxO1xyXG5cclxuXHR2YXIgaW5wdXRMZW5ndGggPSBzaWduYXR1cmUubGVuZ3RoO1xyXG5cclxuXHR2YXIgb2Zmc2V0ID0gMDtcclxuXHRpZiAoc2lnbmF0dXJlW29mZnNldCsrXSAhPT0gRU5DT0RFRF9UQUdfU0VRKSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ0NvdWxkIG5vdCBmaW5kIGV4cGVjdGVkIFwic2VxXCInKTtcclxuXHR9XHJcblxyXG5cdHZhciBzZXFMZW5ndGggPSBzaWduYXR1cmVbb2Zmc2V0KytdO1xyXG5cdGlmIChzZXFMZW5ndGggPT09IChNQVhfT0NURVQgfCAxKSkge1xyXG5cdFx0c2VxTGVuZ3RoID0gc2lnbmF0dXJlW29mZnNldCsrXTtcclxuXHR9XHJcblxyXG5cdGlmIChpbnB1dExlbmd0aCAtIG9mZnNldCA8IHNlcUxlbmd0aCkge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKCdcInNlcVwiIHNwZWNpZmllZCBsZW5ndGggb2YgXCInICsgc2VxTGVuZ3RoICsgJ1wiLCBvbmx5IFwiJyArIChpbnB1dExlbmd0aCAtIG9mZnNldCkgKyAnXCIgcmVtYWluaW5nJyk7XHJcblx0fVxyXG5cclxuXHRpZiAoc2lnbmF0dXJlW29mZnNldCsrXSAhPT0gRU5DT0RFRF9UQUdfSU5UKSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ0NvdWxkIG5vdCBmaW5kIGV4cGVjdGVkIFwiaW50XCIgZm9yIFwiclwiJyk7XHJcblx0fVxyXG5cclxuXHR2YXIgckxlbmd0aCA9IHNpZ25hdHVyZVtvZmZzZXQrK107XHJcblxyXG5cdGlmIChpbnB1dExlbmd0aCAtIG9mZnNldCAtIDIgPCByTGVuZ3RoKSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ1wiclwiIHNwZWNpZmllZCBsZW5ndGggb2YgXCInICsgckxlbmd0aCArICdcIiwgb25seSBcIicgKyAoaW5wdXRMZW5ndGggLSBvZmZzZXQgLSAyKSArICdcIiBhdmFpbGFibGUnKTtcclxuXHR9XHJcblxyXG5cdGlmIChtYXhFbmNvZGVkUGFyYW1MZW5ndGggPCByTGVuZ3RoKSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ1wiclwiIHNwZWNpZmllZCBsZW5ndGggb2YgXCInICsgckxlbmd0aCArICdcIiwgbWF4IG9mIFwiJyArIG1heEVuY29kZWRQYXJhbUxlbmd0aCArICdcIiBpcyBhY2NlcHRhYmxlJyk7XHJcblx0fVxyXG5cclxuXHR2YXIgck9mZnNldCA9IG9mZnNldDtcclxuXHRvZmZzZXQgKz0gckxlbmd0aDtcclxuXHJcblx0aWYgKHNpZ25hdHVyZVtvZmZzZXQrK10gIT09IEVOQ09ERURfVEFHX0lOVCkge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKCdDb3VsZCBub3QgZmluZCBleHBlY3RlZCBcImludFwiIGZvciBcInNcIicpO1xyXG5cdH1cclxuXHJcblx0dmFyIHNMZW5ndGggPSBzaWduYXR1cmVbb2Zmc2V0KytdO1xyXG5cclxuXHRpZiAoaW5wdXRMZW5ndGggLSBvZmZzZXQgIT09IHNMZW5ndGgpIHtcclxuXHRcdHRocm93IG5ldyBFcnJvcignXCJzXCIgc3BlY2lmaWVkIGxlbmd0aCBvZiBcIicgKyBzTGVuZ3RoICsgJ1wiLCBleHBlY3RlZCBcIicgKyAoaW5wdXRMZW5ndGggLSBvZmZzZXQpICsgJ1wiJyk7XHJcblx0fVxyXG5cclxuXHRpZiAobWF4RW5jb2RlZFBhcmFtTGVuZ3RoIDwgc0xlbmd0aCkge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKCdcInNcIiBzcGVjaWZpZWQgbGVuZ3RoIG9mIFwiJyArIHNMZW5ndGggKyAnXCIsIG1heCBvZiBcIicgKyBtYXhFbmNvZGVkUGFyYW1MZW5ndGggKyAnXCIgaXMgYWNjZXB0YWJsZScpO1xyXG5cdH1cclxuXHJcblx0dmFyIHNPZmZzZXQgPSBvZmZzZXQ7XHJcblx0b2Zmc2V0ICs9IHNMZW5ndGg7XHJcblxyXG5cdGlmIChvZmZzZXQgIT09IGlucHV0TGVuZ3RoKSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ0V4cGVjdGVkIHRvIGNvbnN1bWUgZW50aXJlIGJ1ZmZlciwgYnV0IFwiJyArIChpbnB1dExlbmd0aCAtIG9mZnNldCkgKyAnXCIgYnl0ZXMgcmVtYWluJyk7XHJcblx0fVxyXG5cclxuXHR2YXIgclBhZGRpbmcgPSBwYXJhbUJ5dGVzIC0gckxlbmd0aCxcclxuXHRcdHNQYWRkaW5nID0gcGFyYW1CeXRlcyAtIHNMZW5ndGg7XHJcblxyXG5cdHZhciBkc3QgPSBCdWZmZXIuYWxsb2NVbnNhZmUoclBhZGRpbmcgKyByTGVuZ3RoICsgc1BhZGRpbmcgKyBzTGVuZ3RoKTtcclxuXHJcblx0Zm9yIChvZmZzZXQgPSAwOyBvZmZzZXQgPCByUGFkZGluZzsgKytvZmZzZXQpIHtcclxuXHRcdGRzdFtvZmZzZXRdID0gMDtcclxuXHR9XHJcblx0c2lnbmF0dXJlLmNvcHkoZHN0LCBvZmZzZXQsIHJPZmZzZXQgKyBNYXRoLm1heCgtclBhZGRpbmcsIDApLCByT2Zmc2V0ICsgckxlbmd0aCk7XHJcblxyXG5cdG9mZnNldCA9IHBhcmFtQnl0ZXM7XHJcblxyXG5cdGZvciAodmFyIG8gPSBvZmZzZXQ7IG9mZnNldCA8IG8gKyBzUGFkZGluZzsgKytvZmZzZXQpIHtcclxuXHRcdGRzdFtvZmZzZXRdID0gMDtcclxuXHR9XHJcblx0c2lnbmF0dXJlLmNvcHkoZHN0LCBvZmZzZXQsIHNPZmZzZXQgKyBNYXRoLm1heCgtc1BhZGRpbmcsIDApLCBzT2Zmc2V0ICsgc0xlbmd0aCk7XHJcblxyXG5cdGRzdCA9IGRzdC50b1N0cmluZygnYmFzZTY0Jyk7XHJcblx0ZHN0ID0gYmFzZTY0VXJsKGRzdCk7XHJcblxyXG5cdHJldHVybiBkc3Q7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNvdW50UGFkZGluZyhidWYsIHN0YXJ0LCBzdG9wKSB7XHJcblx0dmFyIHBhZGRpbmcgPSAwO1xyXG5cdHdoaWxlIChzdGFydCArIHBhZGRpbmcgPCBzdG9wICYmIGJ1ZltzdGFydCArIHBhZGRpbmddID09PSAwKSB7XHJcblx0XHQrK3BhZGRpbmc7XHJcblx0fVxyXG5cclxuXHR2YXIgbmVlZHNTaWduID0gYnVmW3N0YXJ0ICsgcGFkZGluZ10gPj0gTUFYX09DVEVUO1xyXG5cdGlmIChuZWVkc1NpZ24pIHtcclxuXHRcdC0tcGFkZGluZztcclxuXHR9XHJcblxyXG5cdHJldHVybiBwYWRkaW5nO1xyXG59XHJcblxyXG5mdW5jdGlvbiBqb3NlVG9EZXIoc2lnbmF0dXJlLCBhbGcpIHtcclxuXHRzaWduYXR1cmUgPSBzaWduYXR1cmVBc0J1ZmZlcihzaWduYXR1cmUpO1xyXG5cdHZhciBwYXJhbUJ5dGVzID0gZ2V0UGFyYW1CeXRlc0ZvckFsZyhhbGcpO1xyXG5cclxuXHR2YXIgc2lnbmF0dXJlQnl0ZXMgPSBzaWduYXR1cmUubGVuZ3RoO1xyXG5cdGlmIChzaWduYXR1cmVCeXRlcyAhPT0gcGFyYW1CeXRlcyAqIDIpIHtcclxuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ1wiJyArIGFsZyArICdcIiBzaWduYXR1cmVzIG11c3QgYmUgXCInICsgcGFyYW1CeXRlcyAqIDIgKyAnXCIgYnl0ZXMsIHNhdyBcIicgKyBzaWduYXR1cmVCeXRlcyArICdcIicpO1xyXG5cdH1cclxuXHJcblx0dmFyIHJQYWRkaW5nID0gY291bnRQYWRkaW5nKHNpZ25hdHVyZSwgMCwgcGFyYW1CeXRlcyk7XHJcblx0dmFyIHNQYWRkaW5nID0gY291bnRQYWRkaW5nKHNpZ25hdHVyZSwgcGFyYW1CeXRlcywgc2lnbmF0dXJlLmxlbmd0aCk7XHJcblx0dmFyIHJMZW5ndGggPSBwYXJhbUJ5dGVzIC0gclBhZGRpbmc7XHJcblx0dmFyIHNMZW5ndGggPSBwYXJhbUJ5dGVzIC0gc1BhZGRpbmc7XHJcblxyXG5cdHZhciByc0J5dGVzID0gMSArIDEgKyByTGVuZ3RoICsgMSArIDEgKyBzTGVuZ3RoO1xyXG5cclxuXHR2YXIgc2hvcnRMZW5ndGggPSByc0J5dGVzIDwgTUFYX09DVEVUO1xyXG5cclxuXHR2YXIgZHN0ID0gQnVmZmVyLmFsbG9jVW5zYWZlKChzaG9ydExlbmd0aCA/IDIgOiAzKSArIHJzQnl0ZXMpO1xyXG5cclxuXHR2YXIgb2Zmc2V0ID0gMDtcclxuXHRkc3Rbb2Zmc2V0KytdID0gRU5DT0RFRF9UQUdfU0VRO1xyXG5cdGlmIChzaG9ydExlbmd0aCkge1xyXG5cdFx0Ly8gQml0IDggaGFzIHZhbHVlIFwiMFwiXHJcblx0XHQvLyBiaXRzIDctMSBnaXZlIHRoZSBsZW5ndGguXHJcblx0XHRkc3Rbb2Zmc2V0KytdID0gcnNCeXRlcztcclxuXHR9IGVsc2Uge1xyXG5cdFx0Ly8gQml0IDggb2YgZmlyc3Qgb2N0ZXQgaGFzIHZhbHVlIFwiMVwiXHJcblx0XHQvLyBiaXRzIDctMSBnaXZlIHRoZSBudW1iZXIgb2YgYWRkaXRpb25hbCBsZW5ndGggb2N0ZXRzLlxyXG5cdFx0ZHN0W29mZnNldCsrXSA9IE1BWF9PQ1RFVFx0fCAxO1xyXG5cdFx0Ly8gbGVuZ3RoLCBiYXNlIDI1NlxyXG5cdFx0ZHN0W29mZnNldCsrXSA9IHJzQnl0ZXMgJiAweGZmO1xyXG5cdH1cclxuXHRkc3Rbb2Zmc2V0KytdID0gRU5DT0RFRF9UQUdfSU5UO1xyXG5cdGRzdFtvZmZzZXQrK10gPSByTGVuZ3RoO1xyXG5cdGlmIChyUGFkZGluZyA8IDApIHtcclxuXHRcdGRzdFtvZmZzZXQrK10gPSAwO1xyXG5cdFx0b2Zmc2V0ICs9IHNpZ25hdHVyZS5jb3B5KGRzdCwgb2Zmc2V0LCAwLCBwYXJhbUJ5dGVzKTtcclxuXHR9IGVsc2Uge1xyXG5cdFx0b2Zmc2V0ICs9IHNpZ25hdHVyZS5jb3B5KGRzdCwgb2Zmc2V0LCByUGFkZGluZywgcGFyYW1CeXRlcyk7XHJcblx0fVxyXG5cdGRzdFtvZmZzZXQrK10gPSBFTkNPREVEX1RBR19JTlQ7XHJcblx0ZHN0W29mZnNldCsrXSA9IHNMZW5ndGg7XHJcblx0aWYgKHNQYWRkaW5nIDwgMCkge1xyXG5cdFx0ZHN0W29mZnNldCsrXSA9IDA7XHJcblx0XHRzaWduYXR1cmUuY29weShkc3QsIG9mZnNldCwgcGFyYW1CeXRlcyk7XHJcblx0fSBlbHNlIHtcclxuXHRcdHNpZ25hdHVyZS5jb3B5KGRzdCwgb2Zmc2V0LCBwYXJhbUJ5dGVzICsgc1BhZGRpbmcpO1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIGRzdDtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcblx0ZGVyVG9Kb3NlOiBkZXJUb0pvc2UsXHJcblx0am9zZVRvRGVyOiBqb3NlVG9EZXJcclxufTtcclxuIl0sInNvdXJjZVJvb3QiOiIifQ==