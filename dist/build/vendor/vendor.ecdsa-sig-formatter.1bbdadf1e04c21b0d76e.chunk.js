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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZWNkc2Etc2lnLWZvcm1hdHRlci9zcmMvcGFyYW0tYnl0ZXMtZm9yLWFsZy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZWNkc2Etc2lnLWZvcm1hdHRlci9zcmMvZWNkc2Etc2lnLWZvcm1hdHRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQWE7O0FBRWI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7Ozs7QUN0QmE7O0FBRWIsYUFBYSxtQkFBTyxDQUFDLHlCQUFhOztBQUVsQywwQkFBMEIsbUJBQU8sQ0FBQyxtQ0FBdUI7O0FBRXpEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQSxpQkFBaUIsbUJBQW1CO0FBQ3BDO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxxQkFBcUIsdUJBQXVCO0FBQzVDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYnVpbGQvdmVuZG9yL3ZlbmRvci5lY2RzYS1zaWctZm9ybWF0dGVyLjFiYmRhZGYxZTA0YzIxYjBkNzZlLmNodW5rLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBnZXRQYXJhbVNpemUoa2V5U2l6ZSkge1xuXHR2YXIgcmVzdWx0ID0gKChrZXlTaXplIC8gOCkgfCAwKSArIChrZXlTaXplICUgOCA9PT0gMCA/IDAgOiAxKTtcblx0cmV0dXJuIHJlc3VsdDtcbn1cblxudmFyIHBhcmFtQnl0ZXNGb3JBbGcgPSB7XG5cdEVTMjU2OiBnZXRQYXJhbVNpemUoMjU2KSxcblx0RVMzODQ6IGdldFBhcmFtU2l6ZSgzODQpLFxuXHRFUzUxMjogZ2V0UGFyYW1TaXplKDUyMSlcbn07XG5cbmZ1bmN0aW9uIGdldFBhcmFtQnl0ZXNGb3JBbGcoYWxnKSB7XG5cdHZhciBwYXJhbUJ5dGVzID0gcGFyYW1CeXRlc0ZvckFsZ1thbGddO1xuXHRpZiAocGFyYW1CeXRlcykge1xuXHRcdHJldHVybiBwYXJhbUJ5dGVzO1xuXHR9XG5cblx0dGhyb3cgbmV3IEVycm9yKCdVbmtub3duIGFsZ29yaXRobSBcIicgKyBhbGcgKyAnXCInKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXRQYXJhbUJ5dGVzRm9yQWxnO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgQnVmZmVyID0gcmVxdWlyZSgnc2FmZS1idWZmZXInKS5CdWZmZXI7XG5cbnZhciBnZXRQYXJhbUJ5dGVzRm9yQWxnID0gcmVxdWlyZSgnLi9wYXJhbS1ieXRlcy1mb3ItYWxnJyk7XG5cbnZhciBNQVhfT0NURVQgPSAweDgwLFxuXHRDTEFTU19VTklWRVJTQUwgPSAwLFxuXHRQUklNSVRJVkVfQklUID0gMHgyMCxcblx0VEFHX1NFUSA9IDB4MTAsXG5cdFRBR19JTlQgPSAweDAyLFxuXHRFTkNPREVEX1RBR19TRVEgPSAoVEFHX1NFUSB8IFBSSU1JVElWRV9CSVQpIHwgKENMQVNTX1VOSVZFUlNBTCA8PCA2KSxcblx0RU5DT0RFRF9UQUdfSU5UID0gVEFHX0lOVCB8IChDTEFTU19VTklWRVJTQUwgPDwgNik7XG5cbmZ1bmN0aW9uIGJhc2U2NFVybChiYXNlNjQpIHtcblx0cmV0dXJuIGJhc2U2NFxuXHRcdC5yZXBsYWNlKC89L2csICcnKVxuXHRcdC5yZXBsYWNlKC9cXCsvZywgJy0nKVxuXHRcdC5yZXBsYWNlKC9cXC8vZywgJ18nKTtcbn1cblxuZnVuY3Rpb24gc2lnbmF0dXJlQXNCdWZmZXIoc2lnbmF0dXJlKSB7XG5cdGlmIChCdWZmZXIuaXNCdWZmZXIoc2lnbmF0dXJlKSkge1xuXHRcdHJldHVybiBzaWduYXR1cmU7XG5cdH0gZWxzZSBpZiAoJ3N0cmluZycgPT09IHR5cGVvZiBzaWduYXR1cmUpIHtcblx0XHRyZXR1cm4gQnVmZmVyLmZyb20oc2lnbmF0dXJlLCAnYmFzZTY0Jyk7XG5cdH1cblxuXHR0aHJvdyBuZXcgVHlwZUVycm9yKCdFQ0RTQSBzaWduYXR1cmUgbXVzdCBiZSBhIEJhc2U2NCBzdHJpbmcgb3IgYSBCdWZmZXInKTtcbn1cblxuZnVuY3Rpb24gZGVyVG9Kb3NlKHNpZ25hdHVyZSwgYWxnKSB7XG5cdHNpZ25hdHVyZSA9IHNpZ25hdHVyZUFzQnVmZmVyKHNpZ25hdHVyZSk7XG5cdHZhciBwYXJhbUJ5dGVzID0gZ2V0UGFyYW1CeXRlc0ZvckFsZyhhbGcpO1xuXG5cdC8vIHRoZSBERVIgZW5jb2RlZCBwYXJhbSBzaG91bGQgYXQgbW9zdCBiZSB0aGUgcGFyYW0gc2l6ZSwgcGx1cyBhIHBhZGRpbmdcblx0Ly8gemVybywgc2luY2UgZHVlIHRvIGJlaW5nIGEgc2lnbmVkIGludGVnZXJcblx0dmFyIG1heEVuY29kZWRQYXJhbUxlbmd0aCA9IHBhcmFtQnl0ZXMgKyAxO1xuXG5cdHZhciBpbnB1dExlbmd0aCA9IHNpZ25hdHVyZS5sZW5ndGg7XG5cblx0dmFyIG9mZnNldCA9IDA7XG5cdGlmIChzaWduYXR1cmVbb2Zmc2V0KytdICE9PSBFTkNPREVEX1RBR19TRVEpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ0NvdWxkIG5vdCBmaW5kIGV4cGVjdGVkIFwic2VxXCInKTtcblx0fVxuXG5cdHZhciBzZXFMZW5ndGggPSBzaWduYXR1cmVbb2Zmc2V0KytdO1xuXHRpZiAoc2VxTGVuZ3RoID09PSAoTUFYX09DVEVUIHwgMSkpIHtcblx0XHRzZXFMZW5ndGggPSBzaWduYXR1cmVbb2Zmc2V0KytdO1xuXHR9XG5cblx0aWYgKGlucHV0TGVuZ3RoIC0gb2Zmc2V0IDwgc2VxTGVuZ3RoKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKCdcInNlcVwiIHNwZWNpZmllZCBsZW5ndGggb2YgXCInICsgc2VxTGVuZ3RoICsgJ1wiLCBvbmx5IFwiJyArIChpbnB1dExlbmd0aCAtIG9mZnNldCkgKyAnXCIgcmVtYWluaW5nJyk7XG5cdH1cblxuXHRpZiAoc2lnbmF0dXJlW29mZnNldCsrXSAhPT0gRU5DT0RFRF9UQUdfSU5UKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKCdDb3VsZCBub3QgZmluZCBleHBlY3RlZCBcImludFwiIGZvciBcInJcIicpO1xuXHR9XG5cblx0dmFyIHJMZW5ndGggPSBzaWduYXR1cmVbb2Zmc2V0KytdO1xuXG5cdGlmIChpbnB1dExlbmd0aCAtIG9mZnNldCAtIDIgPCByTGVuZ3RoKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKCdcInJcIiBzcGVjaWZpZWQgbGVuZ3RoIG9mIFwiJyArIHJMZW5ndGggKyAnXCIsIG9ubHkgXCInICsgKGlucHV0TGVuZ3RoIC0gb2Zmc2V0IC0gMikgKyAnXCIgYXZhaWxhYmxlJyk7XG5cdH1cblxuXHRpZiAobWF4RW5jb2RlZFBhcmFtTGVuZ3RoIDwgckxlbmd0aCkge1xuXHRcdHRocm93IG5ldyBFcnJvcignXCJyXCIgc3BlY2lmaWVkIGxlbmd0aCBvZiBcIicgKyByTGVuZ3RoICsgJ1wiLCBtYXggb2YgXCInICsgbWF4RW5jb2RlZFBhcmFtTGVuZ3RoICsgJ1wiIGlzIGFjY2VwdGFibGUnKTtcblx0fVxuXG5cdHZhciByT2Zmc2V0ID0gb2Zmc2V0O1xuXHRvZmZzZXQgKz0gckxlbmd0aDtcblxuXHRpZiAoc2lnbmF0dXJlW29mZnNldCsrXSAhPT0gRU5DT0RFRF9UQUdfSU5UKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKCdDb3VsZCBub3QgZmluZCBleHBlY3RlZCBcImludFwiIGZvciBcInNcIicpO1xuXHR9XG5cblx0dmFyIHNMZW5ndGggPSBzaWduYXR1cmVbb2Zmc2V0KytdO1xuXG5cdGlmIChpbnB1dExlbmd0aCAtIG9mZnNldCAhPT0gc0xlbmd0aCkge1xuXHRcdHRocm93IG5ldyBFcnJvcignXCJzXCIgc3BlY2lmaWVkIGxlbmd0aCBvZiBcIicgKyBzTGVuZ3RoICsgJ1wiLCBleHBlY3RlZCBcIicgKyAoaW5wdXRMZW5ndGggLSBvZmZzZXQpICsgJ1wiJyk7XG5cdH1cblxuXHRpZiAobWF4RW5jb2RlZFBhcmFtTGVuZ3RoIDwgc0xlbmd0aCkge1xuXHRcdHRocm93IG5ldyBFcnJvcignXCJzXCIgc3BlY2lmaWVkIGxlbmd0aCBvZiBcIicgKyBzTGVuZ3RoICsgJ1wiLCBtYXggb2YgXCInICsgbWF4RW5jb2RlZFBhcmFtTGVuZ3RoICsgJ1wiIGlzIGFjY2VwdGFibGUnKTtcblx0fVxuXG5cdHZhciBzT2Zmc2V0ID0gb2Zmc2V0O1xuXHRvZmZzZXQgKz0gc0xlbmd0aDtcblxuXHRpZiAob2Zmc2V0ICE9PSBpbnB1dExlbmd0aCkge1xuXHRcdHRocm93IG5ldyBFcnJvcignRXhwZWN0ZWQgdG8gY29uc3VtZSBlbnRpcmUgYnVmZmVyLCBidXQgXCInICsgKGlucHV0TGVuZ3RoIC0gb2Zmc2V0KSArICdcIiBieXRlcyByZW1haW4nKTtcblx0fVxuXG5cdHZhciByUGFkZGluZyA9IHBhcmFtQnl0ZXMgLSByTGVuZ3RoLFxuXHRcdHNQYWRkaW5nID0gcGFyYW1CeXRlcyAtIHNMZW5ndGg7XG5cblx0dmFyIGRzdCA9IEJ1ZmZlci5hbGxvY1Vuc2FmZShyUGFkZGluZyArIHJMZW5ndGggKyBzUGFkZGluZyArIHNMZW5ndGgpO1xuXG5cdGZvciAob2Zmc2V0ID0gMDsgb2Zmc2V0IDwgclBhZGRpbmc7ICsrb2Zmc2V0KSB7XG5cdFx0ZHN0W29mZnNldF0gPSAwO1xuXHR9XG5cdHNpZ25hdHVyZS5jb3B5KGRzdCwgb2Zmc2V0LCByT2Zmc2V0ICsgTWF0aC5tYXgoLXJQYWRkaW5nLCAwKSwgck9mZnNldCArIHJMZW5ndGgpO1xuXG5cdG9mZnNldCA9IHBhcmFtQnl0ZXM7XG5cblx0Zm9yICh2YXIgbyA9IG9mZnNldDsgb2Zmc2V0IDwgbyArIHNQYWRkaW5nOyArK29mZnNldCkge1xuXHRcdGRzdFtvZmZzZXRdID0gMDtcblx0fVxuXHRzaWduYXR1cmUuY29weShkc3QsIG9mZnNldCwgc09mZnNldCArIE1hdGgubWF4KC1zUGFkZGluZywgMCksIHNPZmZzZXQgKyBzTGVuZ3RoKTtcblxuXHRkc3QgPSBkc3QudG9TdHJpbmcoJ2Jhc2U2NCcpO1xuXHRkc3QgPSBiYXNlNjRVcmwoZHN0KTtcblxuXHRyZXR1cm4gZHN0O1xufVxuXG5mdW5jdGlvbiBjb3VudFBhZGRpbmcoYnVmLCBzdGFydCwgc3RvcCkge1xuXHR2YXIgcGFkZGluZyA9IDA7XG5cdHdoaWxlIChzdGFydCArIHBhZGRpbmcgPCBzdG9wICYmIGJ1ZltzdGFydCArIHBhZGRpbmddID09PSAwKSB7XG5cdFx0KytwYWRkaW5nO1xuXHR9XG5cblx0dmFyIG5lZWRzU2lnbiA9IGJ1ZltzdGFydCArIHBhZGRpbmddID49IE1BWF9PQ1RFVDtcblx0aWYgKG5lZWRzU2lnbikge1xuXHRcdC0tcGFkZGluZztcblx0fVxuXG5cdHJldHVybiBwYWRkaW5nO1xufVxuXG5mdW5jdGlvbiBqb3NlVG9EZXIoc2lnbmF0dXJlLCBhbGcpIHtcblx0c2lnbmF0dXJlID0gc2lnbmF0dXJlQXNCdWZmZXIoc2lnbmF0dXJlKTtcblx0dmFyIHBhcmFtQnl0ZXMgPSBnZXRQYXJhbUJ5dGVzRm9yQWxnKGFsZyk7XG5cblx0dmFyIHNpZ25hdHVyZUJ5dGVzID0gc2lnbmF0dXJlLmxlbmd0aDtcblx0aWYgKHNpZ25hdHVyZUJ5dGVzICE9PSBwYXJhbUJ5dGVzICogMikge1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ1wiJyArIGFsZyArICdcIiBzaWduYXR1cmVzIG11c3QgYmUgXCInICsgcGFyYW1CeXRlcyAqIDIgKyAnXCIgYnl0ZXMsIHNhdyBcIicgKyBzaWduYXR1cmVCeXRlcyArICdcIicpO1xuXHR9XG5cblx0dmFyIHJQYWRkaW5nID0gY291bnRQYWRkaW5nKHNpZ25hdHVyZSwgMCwgcGFyYW1CeXRlcyk7XG5cdHZhciBzUGFkZGluZyA9IGNvdW50UGFkZGluZyhzaWduYXR1cmUsIHBhcmFtQnl0ZXMsIHNpZ25hdHVyZS5sZW5ndGgpO1xuXHR2YXIgckxlbmd0aCA9IHBhcmFtQnl0ZXMgLSByUGFkZGluZztcblx0dmFyIHNMZW5ndGggPSBwYXJhbUJ5dGVzIC0gc1BhZGRpbmc7XG5cblx0dmFyIHJzQnl0ZXMgPSAxICsgMSArIHJMZW5ndGggKyAxICsgMSArIHNMZW5ndGg7XG5cblx0dmFyIHNob3J0TGVuZ3RoID0gcnNCeXRlcyA8IE1BWF9PQ1RFVDtcblxuXHR2YXIgZHN0ID0gQnVmZmVyLmFsbG9jVW5zYWZlKChzaG9ydExlbmd0aCA/IDIgOiAzKSArIHJzQnl0ZXMpO1xuXG5cdHZhciBvZmZzZXQgPSAwO1xuXHRkc3Rbb2Zmc2V0KytdID0gRU5DT0RFRF9UQUdfU0VRO1xuXHRpZiAoc2hvcnRMZW5ndGgpIHtcblx0XHQvLyBCaXQgOCBoYXMgdmFsdWUgXCIwXCJcblx0XHQvLyBiaXRzIDctMSBnaXZlIHRoZSBsZW5ndGguXG5cdFx0ZHN0W29mZnNldCsrXSA9IHJzQnl0ZXM7XG5cdH0gZWxzZSB7XG5cdFx0Ly8gQml0IDggb2YgZmlyc3Qgb2N0ZXQgaGFzIHZhbHVlIFwiMVwiXG5cdFx0Ly8gYml0cyA3LTEgZ2l2ZSB0aGUgbnVtYmVyIG9mIGFkZGl0aW9uYWwgbGVuZ3RoIG9jdGV0cy5cblx0XHRkc3Rbb2Zmc2V0KytdID0gTUFYX09DVEVUXHR8IDE7XG5cdFx0Ly8gbGVuZ3RoLCBiYXNlIDI1NlxuXHRcdGRzdFtvZmZzZXQrK10gPSByc0J5dGVzICYgMHhmZjtcblx0fVxuXHRkc3Rbb2Zmc2V0KytdID0gRU5DT0RFRF9UQUdfSU5UO1xuXHRkc3Rbb2Zmc2V0KytdID0gckxlbmd0aDtcblx0aWYgKHJQYWRkaW5nIDwgMCkge1xuXHRcdGRzdFtvZmZzZXQrK10gPSAwO1xuXHRcdG9mZnNldCArPSBzaWduYXR1cmUuY29weShkc3QsIG9mZnNldCwgMCwgcGFyYW1CeXRlcyk7XG5cdH0gZWxzZSB7XG5cdFx0b2Zmc2V0ICs9IHNpZ25hdHVyZS5jb3B5KGRzdCwgb2Zmc2V0LCByUGFkZGluZywgcGFyYW1CeXRlcyk7XG5cdH1cblx0ZHN0W29mZnNldCsrXSA9IEVOQ09ERURfVEFHX0lOVDtcblx0ZHN0W29mZnNldCsrXSA9IHNMZW5ndGg7XG5cdGlmIChzUGFkZGluZyA8IDApIHtcblx0XHRkc3Rbb2Zmc2V0KytdID0gMDtcblx0XHRzaWduYXR1cmUuY29weShkc3QsIG9mZnNldCwgcGFyYW1CeXRlcyk7XG5cdH0gZWxzZSB7XG5cdFx0c2lnbmF0dXJlLmNvcHkoZHN0LCBvZmZzZXQsIHBhcmFtQnl0ZXMgKyBzUGFkZGluZyk7XG5cdH1cblxuXHRyZXR1cm4gZHN0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0ZGVyVG9Kb3NlOiBkZXJUb0pvc2UsXG5cdGpvc2VUb0Rlcjogam9zZVRvRGVyXG59O1xuIl0sInNvdXJjZVJvb3QiOiIifQ==