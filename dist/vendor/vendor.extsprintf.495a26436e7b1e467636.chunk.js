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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZXh0c3ByaW50Zi9saWIvZXh0c3ByaW50Zi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7O0FBRUEsaUJBQWlCLG1CQUFPLENBQUMsb0JBQVE7QUFDakMsZUFBZSxtQkFBTyxDQUFDLGtCQUFNOztBQUU3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBIiwiZmlsZSI6InZlbmRvci92ZW5kb3IuZXh0c3ByaW50Zi40OTVhMjY0MzZlN2IxZTQ2NzYzNi5jaHVuay5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBleHRzcHJpbnRmLmpzOiBleHRlbmRlZCBQT1NJWC1zdHlsZSBzcHJpbnRmXG4gKi9cblxudmFyIG1vZF9hc3NlcnQgPSByZXF1aXJlKCdhc3NlcnQnKTtcbnZhciBtb2RfdXRpbCA9IHJlcXVpcmUoJ3V0aWwnKTtcblxuLypcbiAqIFB1YmxpYyBpbnRlcmZhY2VcbiAqL1xuZXhwb3J0cy5zcHJpbnRmID0ganNTcHJpbnRmO1xuZXhwb3J0cy5wcmludGYgPSBqc1ByaW50ZjtcbmV4cG9ydHMuZnByaW50ZiA9IGpzRnByaW50ZjtcblxuLypcbiAqIFN0cmlwcGVkIGRvd24gdmVyc2lvbiBvZiBzW25dcHJpbnRmKDNjKS4gIFdlIG1ha2UgYSBiZXN0IGVmZm9ydCB0byB0aHJvdyBhblxuICogZXhjZXB0aW9uIHdoZW4gZ2l2ZW4gYSBmb3JtYXQgc3RyaW5nIHdlIGRvbid0IHVuZGVyc3RhbmQsIHJhdGhlciB0aGFuXG4gKiBpZ25vcmluZyBpdCwgc28gdGhhdCB3ZSB3b24ndCBicmVhayBleGlzdGluZyBwcm9ncmFtcyBpZi93aGVuIHdlIGdvIGltcGxlbWVudFxuICogdGhlIHJlc3Qgb2YgdGhpcy5cbiAqXG4gKiBUaGlzIGltcGxlbWVudGF0aW9uIGN1cnJlbnRseSBzdXBwb3J0cyBzcGVjaWZ5aW5nXG4gKlx0LSBmaWVsZCBhbGlnbm1lbnQgKCctJyBmbGFnKSxcbiAqIFx0LSB6ZXJvLXBhZCAoJzAnIGZsYWcpXG4gKlx0LSBhbHdheXMgc2hvdyBudW1lcmljIHNpZ24gKCcrJyBmbGFnKSxcbiAqXHQtIGZpZWxkIHdpZHRoXG4gKlx0LSBjb252ZXJzaW9ucyBmb3Igc3RyaW5ncywgZGVjaW1hbCBpbnRlZ2VycywgYW5kIGZsb2F0cyAobnVtYmVycykuXG4gKlx0LSBhcmd1bWVudCBzaXplIHNwZWNpZmllcnMuICBUaGVzZSBhcmUgYWxsIGFjY2VwdGVkIGJ1dCBpZ25vcmVkLCBzaW5jZVxuICpcdCAgSmF2YXNjcmlwdCBoYXMgbm8gbm90aW9uIG9mIHRoZSBwaHlzaWNhbCBzaXplIG9mIGFuIGFyZ3VtZW50LlxuICpcbiAqIEV2ZXJ5dGhpbmcgZWxzZSBpcyBjdXJyZW50bHkgdW5zdXBwb3J0ZWQsIG1vc3Qgbm90YWJseSBwcmVjaXNpb24sIHVuc2lnbmVkXG4gKiBudW1iZXJzLCBub24tZGVjaW1hbCBudW1iZXJzLCBhbmQgY2hhcmFjdGVycy5cbiAqL1xuZnVuY3Rpb24ganNTcHJpbnRmKGZtdClcbntcblx0dmFyIHJlZ2V4ID0gW1xuXHQgICAgJyhbXiVdKiknLFx0XHRcdFx0Lyogbm9ybWFsIHRleHQgKi9cblx0ICAgICclJyxcdFx0XHRcdC8qIHN0YXJ0IG9mIGZvcm1hdCAqL1xuXHQgICAgJyhbXFwnXFxcXC0rICMwXSo/KScsXHRcdFx0LyogZmxhZ3MgKG9wdGlvbmFsKSAqL1xuXHQgICAgJyhbMS05XVxcXFxkKik/JyxcdFx0XHQvKiB3aWR0aCAob3B0aW9uYWwpICovXG5cdCAgICAnKFxcXFwuKFsxLTldXFxcXGQqKSk/JyxcdFx0LyogcHJlY2lzaW9uIChvcHRpb25hbCkgKi9cblx0ICAgICdbbGhqenRMXSo/JyxcdFx0XHQvKiBsZW5ndGggbW9kcyAoaWdub3JlZCkgKi9cblx0ICAgICcoW2Rpb3V4WGZGZUVnR2FBY0NzU3AlanJdKSdcdC8qIGNvbnZlcnNpb24gKi9cblx0XS5qb2luKCcnKTtcblxuXHR2YXIgcmUgPSBuZXcgUmVnRXhwKHJlZ2V4KTtcblx0dmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuXHR2YXIgZmxhZ3MsIHdpZHRoLCBwcmVjaXNpb24sIGNvbnZlcnNpb247XG5cdHZhciBsZWZ0LCBwYWQsIHNpZ24sIGFyZywgbWF0Y2g7XG5cdHZhciByZXQgPSAnJztcblx0dmFyIGFyZ24gPSAxO1xuXG5cdG1vZF9hc3NlcnQuZXF1YWwoJ3N0cmluZycsIHR5cGVvZiAoZm10KSk7XG5cblx0d2hpbGUgKChtYXRjaCA9IHJlLmV4ZWMoZm10KSkgIT09IG51bGwpIHtcblx0XHRyZXQgKz0gbWF0Y2hbMV07XG5cdFx0Zm10ID0gZm10LnN1YnN0cmluZyhtYXRjaFswXS5sZW5ndGgpO1xuXG5cdFx0ZmxhZ3MgPSBtYXRjaFsyXSB8fCAnJztcblx0XHR3aWR0aCA9IG1hdGNoWzNdIHx8IDA7XG5cdFx0cHJlY2lzaW9uID0gbWF0Y2hbNF0gfHwgJyc7XG5cdFx0Y29udmVyc2lvbiA9IG1hdGNoWzZdO1xuXHRcdGxlZnQgPSBmYWxzZTtcblx0XHRzaWduID0gZmFsc2U7XG5cdFx0cGFkID0gJyAnO1xuXG5cdFx0aWYgKGNvbnZlcnNpb24gPT0gJyUnKSB7XG5cdFx0XHRyZXQgKz0gJyUnO1xuXHRcdFx0Y29udGludWU7XG5cdFx0fVxuXG5cdFx0aWYgKGFyZ3MubGVuZ3RoID09PSAwKVxuXHRcdFx0dGhyb3cgKG5ldyBFcnJvcigndG9vIGZldyBhcmdzIHRvIHNwcmludGYnKSk7XG5cblx0XHRhcmcgPSBhcmdzLnNoaWZ0KCk7XG5cdFx0YXJnbisrO1xuXG5cdFx0aWYgKGZsYWdzLm1hdGNoKC9bXFwnICNdLykpXG5cdFx0XHR0aHJvdyAobmV3IEVycm9yKFxuXHRcdFx0ICAgICd1bnN1cHBvcnRlZCBmbGFnczogJyArIGZsYWdzKSk7XG5cblx0XHRpZiAocHJlY2lzaW9uLmxlbmd0aCA+IDApXG5cdFx0XHR0aHJvdyAobmV3IEVycm9yKFxuXHRcdFx0ICAgICdub24temVybyBwcmVjaXNpb24gbm90IHN1cHBvcnRlZCcpKTtcblxuXHRcdGlmIChmbGFncy5tYXRjaCgvLS8pKVxuXHRcdFx0bGVmdCA9IHRydWU7XG5cblx0XHRpZiAoZmxhZ3MubWF0Y2goLzAvKSlcblx0XHRcdHBhZCA9ICcwJztcblxuXHRcdGlmIChmbGFncy5tYXRjaCgvXFwrLykpXG5cdFx0XHRzaWduID0gdHJ1ZTtcblxuXHRcdHN3aXRjaCAoY29udmVyc2lvbikge1xuXHRcdGNhc2UgJ3MnOlxuXHRcdFx0aWYgKGFyZyA9PT0gdW5kZWZpbmVkIHx8IGFyZyA9PT0gbnVsbClcblx0XHRcdFx0dGhyb3cgKG5ldyBFcnJvcignYXJndW1lbnQgJyArIGFyZ24gK1xuXHRcdFx0XHQgICAgJzogYXR0ZW1wdGVkIHRvIHByaW50IHVuZGVmaW5lZCBvciBudWxsICcgK1xuXHRcdFx0XHQgICAgJ2FzIGEgc3RyaW5nJykpO1xuXHRcdFx0cmV0ICs9IGRvUGFkKHBhZCwgd2lkdGgsIGxlZnQsIGFyZy50b1N0cmluZygpKTtcblx0XHRcdGJyZWFrO1xuXG5cdFx0Y2FzZSAnZCc6XG5cdFx0XHRhcmcgPSBNYXRoLmZsb29yKGFyZyk7XG5cdFx0XHQvKmpzbDpmYWxsdGhydSovXG5cdFx0Y2FzZSAnZic6XG5cdFx0XHRzaWduID0gc2lnbiAmJiBhcmcgPiAwID8gJysnIDogJyc7XG5cdFx0XHRyZXQgKz0gc2lnbiArIGRvUGFkKHBhZCwgd2lkdGgsIGxlZnQsXG5cdFx0XHQgICAgYXJnLnRvU3RyaW5nKCkpO1xuXHRcdFx0YnJlYWs7XG5cblx0XHRjYXNlICd4Jzpcblx0XHRcdHJldCArPSBkb1BhZChwYWQsIHdpZHRoLCBsZWZ0LCBhcmcudG9TdHJpbmcoMTYpKTtcblx0XHRcdGJyZWFrO1xuXG5cdFx0Y2FzZSAnaic6IC8qIG5vbi1zdGFuZGFyZCAqL1xuXHRcdFx0aWYgKHdpZHRoID09PSAwKVxuXHRcdFx0XHR3aWR0aCA9IDEwO1xuXHRcdFx0cmV0ICs9IG1vZF91dGlsLmluc3BlY3QoYXJnLCBmYWxzZSwgd2lkdGgpO1xuXHRcdFx0YnJlYWs7XG5cblx0XHRjYXNlICdyJzogLyogbm9uLXN0YW5kYXJkICovXG5cdFx0XHRyZXQgKz0gZHVtcEV4Y2VwdGlvbihhcmcpO1xuXHRcdFx0YnJlYWs7XG5cblx0XHRkZWZhdWx0OlxuXHRcdFx0dGhyb3cgKG5ldyBFcnJvcigndW5zdXBwb3J0ZWQgY29udmVyc2lvbjogJyArXG5cdFx0XHQgICAgY29udmVyc2lvbikpO1xuXHRcdH1cblx0fVxuXG5cdHJldCArPSBmbXQ7XG5cdHJldHVybiAocmV0KTtcbn1cblxuZnVuY3Rpb24ganNQcmludGYoKSB7XG5cdHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcblx0YXJncy51bnNoaWZ0KHByb2Nlc3Muc3Rkb3V0KTtcblx0anNGcHJpbnRmLmFwcGx5KG51bGwsIGFyZ3MpO1xufVxuXG5mdW5jdGlvbiBqc0ZwcmludGYoc3RyZWFtKSB7XG5cdHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcblx0cmV0dXJuIChzdHJlYW0ud3JpdGUoanNTcHJpbnRmLmFwcGx5KHRoaXMsIGFyZ3MpKSk7XG59XG5cbmZ1bmN0aW9uIGRvUGFkKGNociwgd2lkdGgsIGxlZnQsIHN0cilcbntcblx0dmFyIHJldCA9IHN0cjtcblxuXHR3aGlsZSAocmV0Lmxlbmd0aCA8IHdpZHRoKSB7XG5cdFx0aWYgKGxlZnQpXG5cdFx0XHRyZXQgKz0gY2hyO1xuXHRcdGVsc2Vcblx0XHRcdHJldCA9IGNociArIHJldDtcblx0fVxuXG5cdHJldHVybiAocmV0KTtcbn1cblxuLypcbiAqIFRoaXMgZnVuY3Rpb24gZHVtcHMgbG9uZyBzdGFjayB0cmFjZXMgZm9yIGV4Y2VwdGlvbnMgaGF2aW5nIGEgY2F1c2UoKSBtZXRob2QuXG4gKiBTZWUgbm9kZS12ZXJyb3IgZm9yIGFuIGV4YW1wbGUuXG4gKi9cbmZ1bmN0aW9uIGR1bXBFeGNlcHRpb24oZXgpXG57XG5cdHZhciByZXQ7XG5cblx0aWYgKCEoZXggaW5zdGFuY2VvZiBFcnJvcikpXG5cdFx0dGhyb3cgKG5ldyBFcnJvcihqc1NwcmludGYoJ2ludmFsaWQgdHlwZSBmb3IgJSVyOiAlaicsIGV4KSkpO1xuXG5cdC8qIE5vdGUgdGhhdCBWOCBwcmVwZW5kcyBcImV4LnN0YWNrXCIgd2l0aCBleC50b1N0cmluZygpLiAqL1xuXHRyZXQgPSAnRVhDRVBUSU9OOiAnICsgZXguY29uc3RydWN0b3IubmFtZSArICc6ICcgKyBleC5zdGFjaztcblxuXHRpZiAoZXguY2F1c2UgJiYgdHlwZW9mIChleC5jYXVzZSkgPT09ICdmdW5jdGlvbicpIHtcblx0XHR2YXIgY2V4ID0gZXguY2F1c2UoKTtcblx0XHRpZiAoY2V4KSB7XG5cdFx0XHRyZXQgKz0gJ1xcbkNhdXNlZCBieTogJyArIGR1bXBFeGNlcHRpb24oY2V4KTtcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gKHJldCk7XG59XG4iXSwic291cmNlUm9vdCI6IiJ9