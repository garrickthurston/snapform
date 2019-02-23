(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["vendor/vendor.extsprintf"],{

/***/ "6Iok":
/*!***************************************************!*\
  !*** ./node_modules/extsprintf/lib/extsprintf.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {/*
 * extsprintf.js: extended POSIX-style sprintf
 */

var mod_assert = __webpack_require__(/*! assert */ "9lTW");
var mod_util = __webpack_require__(/*! util */ "7tlc");

/*
 * Public interface
 */
exports.sprintf = jsSprintf;
exports.printf = jsPrintf;
exports.fprintf = jsFprintf;

/*
 * Stripped down version of s[n]printf(3c).  We make a best effort to throw an
 * exception when given a format string we don't understand, rather than
 * ignoring it, so that we won't break existing programs if/when we go implement
 * the rest of this.
 *
 * This implementation currently supports specifying
 *	- field alignment ('-' flag),
 * 	- zero-pad ('0' flag)
 *	- always show numeric sign ('+' flag),
 *	- field width
 *	- conversions for strings, decimal integers, and floats (numbers).
 *	- argument size specifiers.  These are all accepted but ignored, since
 *	  Javascript has no notion of the physical size of an argument.
 *
 * Everything else is currently unsupported, most notably precision, unsigned
 * numbers, non-decimal numbers, and characters.
 */
function jsSprintf(fmt)
{
	var regex = [
	    '([^%]*)',				/* normal text */
	    '%',				/* start of format */
	    '([\'\\-+ #0]*?)',			/* flags (optional) */
	    '([1-9]\\d*)?',			/* width (optional) */
	    '(\\.([1-9]\\d*))?',		/* precision (optional) */
	    '[lhjztL]*?',			/* length mods (ignored) */
	    '([diouxXfFeEgGaAcCsSp%jr])'	/* conversion */
	].join('');

	var re = new RegExp(regex);
	var args = Array.prototype.slice.call(arguments, 1);
	var flags, width, precision, conversion;
	var left, pad, sign, arg, match;
	var ret = '';
	var argn = 1;

	mod_assert.equal('string', typeof (fmt));

	while ((match = re.exec(fmt)) !== null) {
		ret += match[1];
		fmt = fmt.substring(match[0].length);

		flags = match[2] || '';
		width = match[3] || 0;
		precision = match[4] || '';
		conversion = match[6];
		left = false;
		sign = false;
		pad = ' ';

		if (conversion == '%') {
			ret += '%';
			continue;
		}

		if (args.length === 0)
			throw (new Error('too few args to sprintf'));

		arg = args.shift();
		argn++;

		if (flags.match(/[\' #]/))
			throw (new Error(
			    'unsupported flags: ' + flags));

		if (precision.length > 0)
			throw (new Error(
			    'non-zero precision not supported'));

		if (flags.match(/-/))
			left = true;

		if (flags.match(/0/))
			pad = '0';

		if (flags.match(/\+/))
			sign = true;

		switch (conversion) {
		case 's':
			if (arg === undefined || arg === null)
				throw (new Error('argument ' + argn +
				    ': attempted to print undefined or null ' +
				    'as a string'));
			ret += doPad(pad, width, left, arg.toString());
			break;

		case 'd':
			arg = Math.floor(arg);
			/*jsl:fallthru*/
		case 'f':
			sign = sign && arg > 0 ? '+' : '';
			ret += sign + doPad(pad, width, left,
			    arg.toString());
			break;

		case 'x':
			ret += doPad(pad, width, left, arg.toString(16));
			break;

		case 'j': /* non-standard */
			if (width === 0)
				width = 10;
			ret += mod_util.inspect(arg, false, width);
			break;

		case 'r': /* non-standard */
			ret += dumpException(arg);
			break;

		default:
			throw (new Error('unsupported conversion: ' +
			    conversion));
		}
	}

	ret += fmt;
	return (ret);
}

function jsPrintf() {
	var args = Array.prototype.slice.call(arguments);
	args.unshift(process.stdout);
	jsFprintf.apply(null, args);
}

function jsFprintf(stream) {
	var args = Array.prototype.slice.call(arguments, 1);
	return (stream.write(jsSprintf.apply(this, args)));
}

function doPad(chr, width, left, str)
{
	var ret = str;

	while (ret.length < width) {
		if (left)
			ret += chr;
		else
			ret = chr + ret;
	}

	return (ret);
}

/*
 * This function dumps long stack traces for exceptions having a cause() method.
 * See node-verror for an example.
 */
function dumpException(ex)
{
	var ret;

	if (!(ex instanceof Error))
		throw (new Error(jsSprintf('invalid type for %%r: %j', ex)));

	/* Note that V8 prepends "ex.stack" with ex.toString(). */
	ret = 'EXCEPTION: ' + ex.constructor.name + ': ' + ex.stack;

	if (ex.cause && typeof (ex.cause) === 'function') {
		var cex = ex.cause();
		if (cex) {
			ret += '\nCaused by: ' + dumpException(cex);
		}
	}

	return (ret);
}

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../process/browser.js */ "8oxB")))

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZXh0c3ByaW50Zi9saWIvZXh0c3ByaW50Zi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7O0FBRUEsaUJBQWlCLG1CQUFPLENBQUMsb0JBQVE7QUFDakMsZUFBZSxtQkFBTyxDQUFDLGtCQUFNOztBQUU3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBIiwiZmlsZSI6ImJ1aWxkL3ZlbmRvci92ZW5kb3IuZXh0c3ByaW50Zi45OTY4ZjA3MmRjYzIzOWIwM2YyNC5jaHVuay5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiAqIGV4dHNwcmludGYuanM6IGV4dGVuZGVkIFBPU0lYLXN0eWxlIHNwcmludGZcclxuICovXHJcblxyXG52YXIgbW9kX2Fzc2VydCA9IHJlcXVpcmUoJ2Fzc2VydCcpO1xyXG52YXIgbW9kX3V0aWwgPSByZXF1aXJlKCd1dGlsJyk7XHJcblxyXG4vKlxyXG4gKiBQdWJsaWMgaW50ZXJmYWNlXHJcbiAqL1xyXG5leHBvcnRzLnNwcmludGYgPSBqc1NwcmludGY7XHJcbmV4cG9ydHMucHJpbnRmID0ganNQcmludGY7XHJcbmV4cG9ydHMuZnByaW50ZiA9IGpzRnByaW50ZjtcclxuXHJcbi8qXHJcbiAqIFN0cmlwcGVkIGRvd24gdmVyc2lvbiBvZiBzW25dcHJpbnRmKDNjKS4gIFdlIG1ha2UgYSBiZXN0IGVmZm9ydCB0byB0aHJvdyBhblxyXG4gKiBleGNlcHRpb24gd2hlbiBnaXZlbiBhIGZvcm1hdCBzdHJpbmcgd2UgZG9uJ3QgdW5kZXJzdGFuZCwgcmF0aGVyIHRoYW5cclxuICogaWdub3JpbmcgaXQsIHNvIHRoYXQgd2Ugd29uJ3QgYnJlYWsgZXhpc3RpbmcgcHJvZ3JhbXMgaWYvd2hlbiB3ZSBnbyBpbXBsZW1lbnRcclxuICogdGhlIHJlc3Qgb2YgdGhpcy5cclxuICpcclxuICogVGhpcyBpbXBsZW1lbnRhdGlvbiBjdXJyZW50bHkgc3VwcG9ydHMgc3BlY2lmeWluZ1xyXG4gKlx0LSBmaWVsZCBhbGlnbm1lbnQgKCctJyBmbGFnKSxcclxuICogXHQtIHplcm8tcGFkICgnMCcgZmxhZylcclxuICpcdC0gYWx3YXlzIHNob3cgbnVtZXJpYyBzaWduICgnKycgZmxhZyksXHJcbiAqXHQtIGZpZWxkIHdpZHRoXHJcbiAqXHQtIGNvbnZlcnNpb25zIGZvciBzdHJpbmdzLCBkZWNpbWFsIGludGVnZXJzLCBhbmQgZmxvYXRzIChudW1iZXJzKS5cclxuICpcdC0gYXJndW1lbnQgc2l6ZSBzcGVjaWZpZXJzLiAgVGhlc2UgYXJlIGFsbCBhY2NlcHRlZCBidXQgaWdub3JlZCwgc2luY2VcclxuICpcdCAgSmF2YXNjcmlwdCBoYXMgbm8gbm90aW9uIG9mIHRoZSBwaHlzaWNhbCBzaXplIG9mIGFuIGFyZ3VtZW50LlxyXG4gKlxyXG4gKiBFdmVyeXRoaW5nIGVsc2UgaXMgY3VycmVudGx5IHVuc3VwcG9ydGVkLCBtb3N0IG5vdGFibHkgcHJlY2lzaW9uLCB1bnNpZ25lZFxyXG4gKiBudW1iZXJzLCBub24tZGVjaW1hbCBudW1iZXJzLCBhbmQgY2hhcmFjdGVycy5cclxuICovXHJcbmZ1bmN0aW9uIGpzU3ByaW50ZihmbXQpXHJcbntcclxuXHR2YXIgcmVnZXggPSBbXHJcblx0ICAgICcoW14lXSopJyxcdFx0XHRcdC8qIG5vcm1hbCB0ZXh0ICovXHJcblx0ICAgICclJyxcdFx0XHRcdC8qIHN0YXJ0IG9mIGZvcm1hdCAqL1xyXG5cdCAgICAnKFtcXCdcXFxcLSsgIzBdKj8pJyxcdFx0XHQvKiBmbGFncyAob3B0aW9uYWwpICovXHJcblx0ICAgICcoWzEtOV1cXFxcZCopPycsXHRcdFx0Lyogd2lkdGggKG9wdGlvbmFsKSAqL1xyXG5cdCAgICAnKFxcXFwuKFsxLTldXFxcXGQqKSk/JyxcdFx0LyogcHJlY2lzaW9uIChvcHRpb25hbCkgKi9cclxuXHQgICAgJ1tsaGp6dExdKj8nLFx0XHRcdC8qIGxlbmd0aCBtb2RzIChpZ25vcmVkKSAqL1xyXG5cdCAgICAnKFtkaW91eFhmRmVFZ0dhQWNDc1NwJWpyXSknXHQvKiBjb252ZXJzaW9uICovXHJcblx0XS5qb2luKCcnKTtcclxuXHJcblx0dmFyIHJlID0gbmV3IFJlZ0V4cChyZWdleCk7XHJcblx0dmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xyXG5cdHZhciBmbGFncywgd2lkdGgsIHByZWNpc2lvbiwgY29udmVyc2lvbjtcclxuXHR2YXIgbGVmdCwgcGFkLCBzaWduLCBhcmcsIG1hdGNoO1xyXG5cdHZhciByZXQgPSAnJztcclxuXHR2YXIgYXJnbiA9IDE7XHJcblxyXG5cdG1vZF9hc3NlcnQuZXF1YWwoJ3N0cmluZycsIHR5cGVvZiAoZm10KSk7XHJcblxyXG5cdHdoaWxlICgobWF0Y2ggPSByZS5leGVjKGZtdCkpICE9PSBudWxsKSB7XHJcblx0XHRyZXQgKz0gbWF0Y2hbMV07XHJcblx0XHRmbXQgPSBmbXQuc3Vic3RyaW5nKG1hdGNoWzBdLmxlbmd0aCk7XHJcblxyXG5cdFx0ZmxhZ3MgPSBtYXRjaFsyXSB8fCAnJztcclxuXHRcdHdpZHRoID0gbWF0Y2hbM10gfHwgMDtcclxuXHRcdHByZWNpc2lvbiA9IG1hdGNoWzRdIHx8ICcnO1xyXG5cdFx0Y29udmVyc2lvbiA9IG1hdGNoWzZdO1xyXG5cdFx0bGVmdCA9IGZhbHNlO1xyXG5cdFx0c2lnbiA9IGZhbHNlO1xyXG5cdFx0cGFkID0gJyAnO1xyXG5cclxuXHRcdGlmIChjb252ZXJzaW9uID09ICclJykge1xyXG5cdFx0XHRyZXQgKz0gJyUnO1xyXG5cdFx0XHRjb250aW51ZTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoYXJncy5sZW5ndGggPT09IDApXHJcblx0XHRcdHRocm93IChuZXcgRXJyb3IoJ3RvbyBmZXcgYXJncyB0byBzcHJpbnRmJykpO1xyXG5cclxuXHRcdGFyZyA9IGFyZ3Muc2hpZnQoKTtcclxuXHRcdGFyZ24rKztcclxuXHJcblx0XHRpZiAoZmxhZ3MubWF0Y2goL1tcXCcgI10vKSlcclxuXHRcdFx0dGhyb3cgKG5ldyBFcnJvcihcclxuXHRcdFx0ICAgICd1bnN1cHBvcnRlZCBmbGFnczogJyArIGZsYWdzKSk7XHJcblxyXG5cdFx0aWYgKHByZWNpc2lvbi5sZW5ndGggPiAwKVxyXG5cdFx0XHR0aHJvdyAobmV3IEVycm9yKFxyXG5cdFx0XHQgICAgJ25vbi16ZXJvIHByZWNpc2lvbiBub3Qgc3VwcG9ydGVkJykpO1xyXG5cclxuXHRcdGlmIChmbGFncy5tYXRjaCgvLS8pKVxyXG5cdFx0XHRsZWZ0ID0gdHJ1ZTtcclxuXHJcblx0XHRpZiAoZmxhZ3MubWF0Y2goLzAvKSlcclxuXHRcdFx0cGFkID0gJzAnO1xyXG5cclxuXHRcdGlmIChmbGFncy5tYXRjaCgvXFwrLykpXHJcblx0XHRcdHNpZ24gPSB0cnVlO1xyXG5cclxuXHRcdHN3aXRjaCAoY29udmVyc2lvbikge1xyXG5cdFx0Y2FzZSAncyc6XHJcblx0XHRcdGlmIChhcmcgPT09IHVuZGVmaW5lZCB8fCBhcmcgPT09IG51bGwpXHJcblx0XHRcdFx0dGhyb3cgKG5ldyBFcnJvcignYXJndW1lbnQgJyArIGFyZ24gK1xyXG5cdFx0XHRcdCAgICAnOiBhdHRlbXB0ZWQgdG8gcHJpbnQgdW5kZWZpbmVkIG9yIG51bGwgJyArXHJcblx0XHRcdFx0ICAgICdhcyBhIHN0cmluZycpKTtcclxuXHRcdFx0cmV0ICs9IGRvUGFkKHBhZCwgd2lkdGgsIGxlZnQsIGFyZy50b1N0cmluZygpKTtcclxuXHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0Y2FzZSAnZCc6XHJcblx0XHRcdGFyZyA9IE1hdGguZmxvb3IoYXJnKTtcclxuXHRcdFx0Lypqc2w6ZmFsbHRocnUqL1xyXG5cdFx0Y2FzZSAnZic6XHJcblx0XHRcdHNpZ24gPSBzaWduICYmIGFyZyA+IDAgPyAnKycgOiAnJztcclxuXHRcdFx0cmV0ICs9IHNpZ24gKyBkb1BhZChwYWQsIHdpZHRoLCBsZWZ0LFxyXG5cdFx0XHQgICAgYXJnLnRvU3RyaW5nKCkpO1xyXG5cdFx0XHRicmVhaztcclxuXHJcblx0XHRjYXNlICd4JzpcclxuXHRcdFx0cmV0ICs9IGRvUGFkKHBhZCwgd2lkdGgsIGxlZnQsIGFyZy50b1N0cmluZygxNikpO1xyXG5cdFx0XHRicmVhaztcclxuXHJcblx0XHRjYXNlICdqJzogLyogbm9uLXN0YW5kYXJkICovXHJcblx0XHRcdGlmICh3aWR0aCA9PT0gMClcclxuXHRcdFx0XHR3aWR0aCA9IDEwO1xyXG5cdFx0XHRyZXQgKz0gbW9kX3V0aWwuaW5zcGVjdChhcmcsIGZhbHNlLCB3aWR0aCk7XHJcblx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdGNhc2UgJ3InOiAvKiBub24tc3RhbmRhcmQgKi9cclxuXHRcdFx0cmV0ICs9IGR1bXBFeGNlcHRpb24oYXJnKTtcclxuXHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0ZGVmYXVsdDpcclxuXHRcdFx0dGhyb3cgKG5ldyBFcnJvcigndW5zdXBwb3J0ZWQgY29udmVyc2lvbjogJyArXHJcblx0XHRcdCAgICBjb252ZXJzaW9uKSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRyZXQgKz0gZm10O1xyXG5cdHJldHVybiAocmV0KTtcclxufVxyXG5cclxuZnVuY3Rpb24ganNQcmludGYoKSB7XHJcblx0dmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xyXG5cdGFyZ3MudW5zaGlmdChwcm9jZXNzLnN0ZG91dCk7XHJcblx0anNGcHJpbnRmLmFwcGx5KG51bGwsIGFyZ3MpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBqc0ZwcmludGYoc3RyZWFtKSB7XHJcblx0dmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xyXG5cdHJldHVybiAoc3RyZWFtLndyaXRlKGpzU3ByaW50Zi5hcHBseSh0aGlzLCBhcmdzKSkpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBkb1BhZChjaHIsIHdpZHRoLCBsZWZ0LCBzdHIpXHJcbntcclxuXHR2YXIgcmV0ID0gc3RyO1xyXG5cclxuXHR3aGlsZSAocmV0Lmxlbmd0aCA8IHdpZHRoKSB7XHJcblx0XHRpZiAobGVmdClcclxuXHRcdFx0cmV0ICs9IGNocjtcclxuXHRcdGVsc2VcclxuXHRcdFx0cmV0ID0gY2hyICsgcmV0O1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIChyZXQpO1xyXG59XHJcblxyXG4vKlxyXG4gKiBUaGlzIGZ1bmN0aW9uIGR1bXBzIGxvbmcgc3RhY2sgdHJhY2VzIGZvciBleGNlcHRpb25zIGhhdmluZyBhIGNhdXNlKCkgbWV0aG9kLlxyXG4gKiBTZWUgbm9kZS12ZXJyb3IgZm9yIGFuIGV4YW1wbGUuXHJcbiAqL1xyXG5mdW5jdGlvbiBkdW1wRXhjZXB0aW9uKGV4KVxyXG57XHJcblx0dmFyIHJldDtcclxuXHJcblx0aWYgKCEoZXggaW5zdGFuY2VvZiBFcnJvcikpXHJcblx0XHR0aHJvdyAobmV3IEVycm9yKGpzU3ByaW50ZignaW52YWxpZCB0eXBlIGZvciAlJXI6ICVqJywgZXgpKSk7XHJcblxyXG5cdC8qIE5vdGUgdGhhdCBWOCBwcmVwZW5kcyBcImV4LnN0YWNrXCIgd2l0aCBleC50b1N0cmluZygpLiAqL1xyXG5cdHJldCA9ICdFWENFUFRJT046ICcgKyBleC5jb25zdHJ1Y3Rvci5uYW1lICsgJzogJyArIGV4LnN0YWNrO1xyXG5cclxuXHRpZiAoZXguY2F1c2UgJiYgdHlwZW9mIChleC5jYXVzZSkgPT09ICdmdW5jdGlvbicpIHtcclxuXHRcdHZhciBjZXggPSBleC5jYXVzZSgpO1xyXG5cdFx0aWYgKGNleCkge1xyXG5cdFx0XHRyZXQgKz0gJ1xcbkNhdXNlZCBieTogJyArIGR1bXBFeGNlcHRpb24oY2V4KTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHJldHVybiAocmV0KTtcclxufVxyXG4iXSwic291cmNlUm9vdCI6IiJ9