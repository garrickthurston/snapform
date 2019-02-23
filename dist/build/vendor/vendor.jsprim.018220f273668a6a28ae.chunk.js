(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["vendor/vendor.jsprim"],{

/***/ "ef4q":
/*!*******************************************!*\
  !*** ./node_modules/jsprim/lib/jsprim.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
 * lib/jsprim.js: utilities for primitive JavaScript types
 */

var mod_assert = __webpack_require__(/*! assert-plus */ "60GX");
var mod_util = __webpack_require__(/*! util */ "7tlc");

var mod_extsprintf = __webpack_require__(/*! extsprintf */ "6Iok");
var mod_verror = __webpack_require__(/*! verror */ "HSFs");
var mod_jsonschema = __webpack_require__(/*! json-schema */ "jYNx");

/*
 * Public interface
 */
exports.deepCopy = deepCopy;
exports.deepEqual = deepEqual;
exports.isEmpty = isEmpty;
exports.hasKey = hasKey;
exports.forEachKey = forEachKey;
exports.pluck = pluck;
exports.flattenObject = flattenObject;
exports.flattenIter = flattenIter;
exports.validateJsonObject = validateJsonObjectJS;
exports.validateJsonObjectJS = validateJsonObjectJS;
exports.randElt = randElt;
exports.extraProperties = extraProperties;
exports.mergeObjects = mergeObjects;

exports.startsWith = startsWith;
exports.endsWith = endsWith;

exports.parseInteger = parseInteger;

exports.iso8601 = iso8601;
exports.rfc1123 = rfc1123;
exports.parseDateTime = parseDateTime;

exports.hrtimediff = hrtimeDiff;
exports.hrtimeDiff = hrtimeDiff;
exports.hrtimeAccum = hrtimeAccum;
exports.hrtimeAdd = hrtimeAdd;
exports.hrtimeNanosec = hrtimeNanosec;
exports.hrtimeMicrosec = hrtimeMicrosec;
exports.hrtimeMillisec = hrtimeMillisec;


/*
 * Deep copy an acyclic *basic* Javascript object.  This only handles basic
 * scalars (strings, numbers, booleans) and arbitrarily deep arrays and objects
 * containing these.  This does *not* handle instances of other classes.
 */
function deepCopy(obj)
{
	var ret, key;
	var marker = '__deepCopy';

	if (obj && obj[marker])
		throw (new Error('attempted deep copy of cyclic object'));

	if (obj && obj.constructor == Object) {
		ret = {};
		obj[marker] = true;

		for (key in obj) {
			if (key == marker)
				continue;

			ret[key] = deepCopy(obj[key]);
		}

		delete (obj[marker]);
		return (ret);
	}

	if (obj && obj.constructor == Array) {
		ret = [];
		obj[marker] = true;

		for (key = 0; key < obj.length; key++)
			ret.push(deepCopy(obj[key]));

		delete (obj[marker]);
		return (ret);
	}

	/*
	 * It must be a primitive type -- just return it.
	 */
	return (obj);
}

function deepEqual(obj1, obj2)
{
	if (typeof (obj1) != typeof (obj2))
		return (false);

	if (obj1 === null || obj2 === null || typeof (obj1) != 'object')
		return (obj1 === obj2);

	if (obj1.constructor != obj2.constructor)
		return (false);

	var k;
	for (k in obj1) {
		if (!obj2.hasOwnProperty(k))
			return (false);

		if (!deepEqual(obj1[k], obj2[k]))
			return (false);
	}

	for (k in obj2) {
		if (!obj1.hasOwnProperty(k))
			return (false);
	}

	return (true);
}

function isEmpty(obj)
{
	var key;
	for (key in obj)
		return (false);
	return (true);
}

function hasKey(obj, key)
{
	mod_assert.equal(typeof (key), 'string');
	return (Object.prototype.hasOwnProperty.call(obj, key));
}

function forEachKey(obj, callback)
{
	for (var key in obj) {
		if (hasKey(obj, key)) {
			callback(key, obj[key]);
		}
	}
}

function pluck(obj, key)
{
	mod_assert.equal(typeof (key), 'string');
	return (pluckv(obj, key));
}

function pluckv(obj, key)
{
	if (obj === null || typeof (obj) !== 'object')
		return (undefined);

	if (obj.hasOwnProperty(key))
		return (obj[key]);

	var i = key.indexOf('.');
	if (i == -1)
		return (undefined);

	var key1 = key.substr(0, i);
	if (!obj.hasOwnProperty(key1))
		return (undefined);

	return (pluckv(obj[key1], key.substr(i + 1)));
}

/*
 * Invoke callback(row) for each entry in the array that would be returned by
 * flattenObject(data, depth).  This is just like flattenObject(data,
 * depth).forEach(callback), except that the intermediate array is never
 * created.
 */
function flattenIter(data, depth, callback)
{
	doFlattenIter(data, depth, [], callback);
}

function doFlattenIter(data, depth, accum, callback)
{
	var each;
	var key;

	if (depth === 0) {
		each = accum.slice(0);
		each.push(data);
		callback(each);
		return;
	}

	mod_assert.ok(data !== null);
	mod_assert.equal(typeof (data), 'object');
	mod_assert.equal(typeof (depth), 'number');
	mod_assert.ok(depth >= 0);

	for (key in data) {
		each = accum.slice(0);
		each.push(key);
		doFlattenIter(data[key], depth - 1, each, callback);
	}
}

function flattenObject(data, depth)
{
	if (depth === 0)
		return ([ data ]);

	mod_assert.ok(data !== null);
	mod_assert.equal(typeof (data), 'object');
	mod_assert.equal(typeof (depth), 'number');
	mod_assert.ok(depth >= 0);

	var rv = [];
	var key;

	for (key in data) {
		flattenObject(data[key], depth - 1).forEach(function (p) {
			rv.push([ key ].concat(p));
		});
	}

	return (rv);
}

function startsWith(str, prefix)
{
	return (str.substr(0, prefix.length) == prefix);
}

function endsWith(str, suffix)
{
	return (str.substr(
	    str.length - suffix.length, suffix.length) == suffix);
}

function iso8601(d)
{
	if (typeof (d) == 'number')
		d = new Date(d);
	mod_assert.ok(d.constructor === Date);
	return (mod_extsprintf.sprintf('%4d-%02d-%02dT%02d:%02d:%02d.%03dZ',
	    d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate(),
	    d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds(),
	    d.getUTCMilliseconds()));
}

var RFC1123_MONTHS = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var RFC1123_DAYS = [
    'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function rfc1123(date) {
	return (mod_extsprintf.sprintf('%s, %02d %s %04d %02d:%02d:%02d GMT',
	    RFC1123_DAYS[date.getUTCDay()], date.getUTCDate(),
	    RFC1123_MONTHS[date.getUTCMonth()], date.getUTCFullYear(),
	    date.getUTCHours(), date.getUTCMinutes(),
	    date.getUTCSeconds()));
}

/*
 * Parses a date expressed as a string, as either a number of milliseconds since
 * the epoch or any string format that Date accepts, giving preference to the
 * former where these two sets overlap (e.g., small numbers).
 */
function parseDateTime(str)
{
	/*
	 * This is irritatingly implicit, but significantly more concise than
	 * alternatives.  The "+str" will convert a string containing only a
	 * number directly to a Number, or NaN for other strings.  Thus, if the
	 * conversion succeeds, we use it (this is the milliseconds-since-epoch
	 * case).  Otherwise, we pass the string directly to the Date
	 * constructor to parse.
	 */
	var numeric = +str;
	if (!isNaN(numeric)) {
		return (new Date(numeric));
	} else {
		return (new Date(str));
	}
}


/*
 * Number.*_SAFE_INTEGER isn't present before node v0.12, so we hardcode
 * the ES6 definitions here, while allowing for them to someday be higher.
 */
var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || 9007199254740991;
var MIN_SAFE_INTEGER = Number.MIN_SAFE_INTEGER || -9007199254740991;


/*
 * Default options for parseInteger().
 */
var PI_DEFAULTS = {
	base: 10,
	allowSign: true,
	allowPrefix: false,
	allowTrailing: false,
	allowImprecise: false,
	trimWhitespace: false,
	leadingZeroIsOctal: false
};

var CP_0 = 0x30;
var CP_9 = 0x39;

var CP_A = 0x41;
var CP_B = 0x42;
var CP_O = 0x4f;
var CP_T = 0x54;
var CP_X = 0x58;
var CP_Z = 0x5a;

var CP_a = 0x61;
var CP_b = 0x62;
var CP_o = 0x6f;
var CP_t = 0x74;
var CP_x = 0x78;
var CP_z = 0x7a;

var PI_CONV_DEC = 0x30;
var PI_CONV_UC = 0x37;
var PI_CONV_LC = 0x57;


/*
 * A stricter version of parseInt() that provides options for changing what
 * is an acceptable string (for example, disallowing trailing characters).
 */
function parseInteger(str, uopts)
{
	mod_assert.string(str, 'str');
	mod_assert.optionalObject(uopts, 'options');

	var baseOverride = false;
	var options = PI_DEFAULTS;

	if (uopts) {
		baseOverride = hasKey(uopts, 'base');
		options = mergeObjects(options, uopts);
		mod_assert.number(options.base, 'options.base');
		mod_assert.ok(options.base >= 2, 'options.base >= 2');
		mod_assert.ok(options.base <= 36, 'options.base <= 36');
		mod_assert.bool(options.allowSign, 'options.allowSign');
		mod_assert.bool(options.allowPrefix, 'options.allowPrefix');
		mod_assert.bool(options.allowTrailing,
		    'options.allowTrailing');
		mod_assert.bool(options.allowImprecise,
		    'options.allowImprecise');
		mod_assert.bool(options.trimWhitespace,
		    'options.trimWhitespace');
		mod_assert.bool(options.leadingZeroIsOctal,
		    'options.leadingZeroIsOctal');

		if (options.leadingZeroIsOctal) {
			mod_assert.ok(!baseOverride,
			    '"base" and "leadingZeroIsOctal" are ' +
			    'mutually exclusive');
		}
	}

	var c;
	var pbase = -1;
	var base = options.base;
	var start;
	var mult = 1;
	var value = 0;
	var idx = 0;
	var len = str.length;

	/* Trim any whitespace on the left side. */
	if (options.trimWhitespace) {
		while (idx < len && isSpace(str.charCodeAt(idx))) {
			++idx;
		}
	}

	/* Check the number for a leading sign. */
	if (options.allowSign) {
		if (str[idx] === '-') {
			idx += 1;
			mult = -1;
		} else if (str[idx] === '+') {
			idx += 1;
		}
	}

	/* Parse the base-indicating prefix if there is one. */
	if (str[idx] === '0') {
		if (options.allowPrefix) {
			pbase = prefixToBase(str.charCodeAt(idx + 1));
			if (pbase !== -1 && (!baseOverride || pbase === base)) {
				base = pbase;
				idx += 2;
			}
		}

		if (pbase === -1 && options.leadingZeroIsOctal) {
			base = 8;
		}
	}

	/* Parse the actual digits. */
	for (start = idx; idx < len; ++idx) {
		c = translateDigit(str.charCodeAt(idx));
		if (c !== -1 && c < base) {
			value *= base;
			value += c;
		} else {
			break;
		}
	}

	/* If we didn't parse any digits, we have an invalid number. */
	if (start === idx) {
		return (new Error('invalid number: ' + JSON.stringify(str)));
	}

	/* Trim any whitespace on the right side. */
	if (options.trimWhitespace) {
		while (idx < len && isSpace(str.charCodeAt(idx))) {
			++idx;
		}
	}

	/* Check for trailing characters. */
	if (idx < len && !options.allowTrailing) {
		return (new Error('trailing characters after number: ' +
		    JSON.stringify(str.slice(idx))));
	}

	/* If our value is 0, we return now, to avoid returning -0. */
	if (value === 0) {
		return (0);
	}

	/* Calculate our final value. */
	var result = value * mult;

	/*
	 * If the string represents a value that cannot be precisely represented
	 * by JavaScript, then we want to check that:
	 *
	 * - We never increased the value past MAX_SAFE_INTEGER
	 * - We don't make the result negative and below MIN_SAFE_INTEGER
	 *
	 * Because we only ever increment the value during parsing, there's no
	 * chance of moving past MAX_SAFE_INTEGER and then dropping below it
	 * again, losing precision in the process. This means that we only need
	 * to do our checks here, at the end.
	 */
	if (!options.allowImprecise &&
	    (value > MAX_SAFE_INTEGER || result < MIN_SAFE_INTEGER)) {
		return (new Error('number is outside of the supported range: ' +
		    JSON.stringify(str.slice(start, idx))));
	}

	return (result);
}


/*
 * Interpret a character code as a base-36 digit.
 */
function translateDigit(d)
{
	if (d >= CP_0 && d <= CP_9) {
		/* '0' to '9' -> 0 to 9 */
		return (d - PI_CONV_DEC);
	} else if (d >= CP_A && d <= CP_Z) {
		/* 'A' - 'Z' -> 10 to 35 */
		return (d - PI_CONV_UC);
	} else if (d >= CP_a && d <= CP_z) {
		/* 'a' - 'z' -> 10 to 35 */
		return (d - PI_CONV_LC);
	} else {
		/* Invalid character code */
		return (-1);
	}
}


/*
 * Test if a value matches the ECMAScript definition of trimmable whitespace.
 */
function isSpace(c)
{
	return (c === 0x20) ||
	    (c >= 0x0009 && c <= 0x000d) ||
	    (c === 0x00a0) ||
	    (c === 0x1680) ||
	    (c === 0x180e) ||
	    (c >= 0x2000 && c <= 0x200a) ||
	    (c === 0x2028) ||
	    (c === 0x2029) ||
	    (c === 0x202f) ||
	    (c === 0x205f) ||
	    (c === 0x3000) ||
	    (c === 0xfeff);
}


/*
 * Determine which base a character indicates (e.g., 'x' indicates hex).
 */
function prefixToBase(c)
{
	if (c === CP_b || c === CP_B) {
		/* 0b/0B (binary) */
		return (2);
	} else if (c === CP_o || c === CP_O) {
		/* 0o/0O (octal) */
		return (8);
	} else if (c === CP_t || c === CP_T) {
		/* 0t/0T (decimal) */
		return (10);
	} else if (c === CP_x || c === CP_X) {
		/* 0x/0X (hexadecimal) */
		return (16);
	} else {
		/* Not a meaningful character */
		return (-1);
	}
}


function validateJsonObjectJS(schema, input)
{
	var report = mod_jsonschema.validate(input, schema);

	if (report.errors.length === 0)
		return (null);

	/* Currently, we only do anything useful with the first error. */
	var error = report.errors[0];

	/* The failed property is given by a URI with an irrelevant prefix. */
	var propname = error['property'];
	var reason = error['message'].toLowerCase();
	var i, j;

	/*
	 * There's at least one case where the property error message is
	 * confusing at best.  We work around this here.
	 */
	if ((i = reason.indexOf('the property ')) != -1 &&
	    (j = reason.indexOf(' is not defined in the schema and the ' +
	    'schema does not allow additional properties')) != -1) {
		i += 'the property '.length;
		if (propname === '')
			propname = reason.substr(i, j - i);
		else
			propname = propname + '.' + reason.substr(i, j - i);

		reason = 'unsupported property';
	}

	var rv = new mod_verror.VError('property "%s": %s', propname, reason);
	rv.jsv_details = error;
	return (rv);
}

function randElt(arr)
{
	mod_assert.ok(Array.isArray(arr) && arr.length > 0,
	    'randElt argument must be a non-empty array');

	return (arr[Math.floor(Math.random() * arr.length)]);
}

function assertHrtime(a)
{
	mod_assert.ok(a[0] >= 0 && a[1] >= 0,
	    'negative numbers not allowed in hrtimes');
	mod_assert.ok(a[1] < 1e9, 'nanoseconds column overflow');
}

/*
 * Compute the time elapsed between hrtime readings A and B, where A is later
 * than B.  hrtime readings come from Node's process.hrtime().  There is no
 * defined way to represent negative deltas, so it's illegal to diff B from A
 * where the time denoted by B is later than the time denoted by A.  If this
 * becomes valuable, we can define a representation and extend the
 * implementation to support it.
 */
function hrtimeDiff(a, b)
{
	assertHrtime(a);
	assertHrtime(b);
	mod_assert.ok(a[0] > b[0] || (a[0] == b[0] && a[1] >= b[1]),
	    'negative differences not allowed');

	var rv = [ a[0] - b[0], 0 ];

	if (a[1] >= b[1]) {
		rv[1] = a[1] - b[1];
	} else {
		rv[0]--;
		rv[1] = 1e9 - (b[1] - a[1]);
	}

	return (rv);
}

/*
 * Convert a hrtime reading from the array format returned by Node's
 * process.hrtime() into a scalar number of nanoseconds.
 */
function hrtimeNanosec(a)
{
	assertHrtime(a);

	return (Math.floor(a[0] * 1e9 + a[1]));
}

/*
 * Convert a hrtime reading from the array format returned by Node's
 * process.hrtime() into a scalar number of microseconds.
 */
function hrtimeMicrosec(a)
{
	assertHrtime(a);

	return (Math.floor(a[0] * 1e6 + a[1] / 1e3));
}

/*
 * Convert a hrtime reading from the array format returned by Node's
 * process.hrtime() into a scalar number of milliseconds.
 */
function hrtimeMillisec(a)
{
	assertHrtime(a);

	return (Math.floor(a[0] * 1e3 + a[1] / 1e6));
}

/*
 * Add two hrtime readings A and B, overwriting A with the result of the
 * addition.  This function is useful for accumulating several hrtime intervals
 * into a counter.  Returns A.
 */
function hrtimeAccum(a, b)
{
	assertHrtime(a);
	assertHrtime(b);

	/*
	 * Accumulate the nanosecond component.
	 */
	a[1] += b[1];
	if (a[1] >= 1e9) {
		/*
		 * The nanosecond component overflowed, so carry to the seconds
		 * field.
		 */
		a[0]++;
		a[1] -= 1e9;
	}

	/*
	 * Accumulate the seconds component.
	 */
	a[0] += b[0];

	return (a);
}

/*
 * Add two hrtime readings A and B, returning the result as a new hrtime array.
 * Does not modify either input argument.
 */
function hrtimeAdd(a, b)
{
	assertHrtime(a);

	var rv = [ a[0], a[1] ];

	return (hrtimeAccum(rv, b));
}


/*
 * Check an object for unexpected properties.  Accepts the object to check, and
 * an array of allowed property names (strings).  Returns an array of key names
 * that were found on the object, but did not appear in the list of allowed
 * properties.  If no properties were found, the returned array will be of
 * zero length.
 */
function extraProperties(obj, allowed)
{
	mod_assert.ok(typeof (obj) === 'object' && obj !== null,
	    'obj argument must be a non-null object');
	mod_assert.ok(Array.isArray(allowed),
	    'allowed argument must be an array of strings');
	for (var i = 0; i < allowed.length; i++) {
		mod_assert.ok(typeof (allowed[i]) === 'string',
		    'allowed argument must be an array of strings');
	}

	return (Object.keys(obj).filter(function (key) {
		return (allowed.indexOf(key) === -1);
	}));
}

/*
 * Given three sets of properties "provided" (may be undefined), "overrides"
 * (required), and "defaults" (may be undefined), construct an object containing
 * the union of these sets with "overrides" overriding "provided", and
 * "provided" overriding "defaults".  None of the input objects are modified.
 */
function mergeObjects(provided, overrides, defaults)
{
	var rv, k;

	rv = {};
	if (defaults) {
		for (k in defaults)
			rv[k] = defaults[k];
	}

	if (provided) {
		for (k in provided)
			rv[k] = provided[k];
	}

	if (overrides) {
		for (k in overrides)
			rv[k] = overrides[k];
	}

	return (rv);
}


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvanNwcmltL2xpYi9qc3ByaW0uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBOztBQUVBLGlCQUFpQixtQkFBTyxDQUFDLHlCQUFhO0FBQ3RDLGVBQWUsbUJBQU8sQ0FBQyxrQkFBTTs7QUFFN0IscUJBQXFCLG1CQUFPLENBQUMsd0JBQVk7QUFDekMsaUJBQWlCLG1CQUFPLENBQUMsb0JBQVE7QUFDakMscUJBQXFCLG1CQUFPLENBQUMseUJBQWE7O0FBRTFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxlQUFlLGtCQUFrQjtBQUNqQzs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGtCQUFrQixXQUFXO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLG9CQUFvQjtBQUNwQztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEVBQUU7QUFDRjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBIiwiZmlsZSI6ImJ1aWxkL3ZlbmRvci92ZW5kb3IuanNwcmltLjAxODIyMGYyNzM2NjhhNmEyOGFlLmNodW5rLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcclxuICogbGliL2pzcHJpbS5qczogdXRpbGl0aWVzIGZvciBwcmltaXRpdmUgSmF2YVNjcmlwdCB0eXBlc1xyXG4gKi9cclxuXHJcbnZhciBtb2RfYXNzZXJ0ID0gcmVxdWlyZSgnYXNzZXJ0LXBsdXMnKTtcclxudmFyIG1vZF91dGlsID0gcmVxdWlyZSgndXRpbCcpO1xyXG5cclxudmFyIG1vZF9leHRzcHJpbnRmID0gcmVxdWlyZSgnZXh0c3ByaW50ZicpO1xyXG52YXIgbW9kX3ZlcnJvciA9IHJlcXVpcmUoJ3ZlcnJvcicpO1xyXG52YXIgbW9kX2pzb25zY2hlbWEgPSByZXF1aXJlKCdqc29uLXNjaGVtYScpO1xyXG5cclxuLypcclxuICogUHVibGljIGludGVyZmFjZVxyXG4gKi9cclxuZXhwb3J0cy5kZWVwQ29weSA9IGRlZXBDb3B5O1xyXG5leHBvcnRzLmRlZXBFcXVhbCA9IGRlZXBFcXVhbDtcclxuZXhwb3J0cy5pc0VtcHR5ID0gaXNFbXB0eTtcclxuZXhwb3J0cy5oYXNLZXkgPSBoYXNLZXk7XHJcbmV4cG9ydHMuZm9yRWFjaEtleSA9IGZvckVhY2hLZXk7XHJcbmV4cG9ydHMucGx1Y2sgPSBwbHVjaztcclxuZXhwb3J0cy5mbGF0dGVuT2JqZWN0ID0gZmxhdHRlbk9iamVjdDtcclxuZXhwb3J0cy5mbGF0dGVuSXRlciA9IGZsYXR0ZW5JdGVyO1xyXG5leHBvcnRzLnZhbGlkYXRlSnNvbk9iamVjdCA9IHZhbGlkYXRlSnNvbk9iamVjdEpTO1xyXG5leHBvcnRzLnZhbGlkYXRlSnNvbk9iamVjdEpTID0gdmFsaWRhdGVKc29uT2JqZWN0SlM7XHJcbmV4cG9ydHMucmFuZEVsdCA9IHJhbmRFbHQ7XHJcbmV4cG9ydHMuZXh0cmFQcm9wZXJ0aWVzID0gZXh0cmFQcm9wZXJ0aWVzO1xyXG5leHBvcnRzLm1lcmdlT2JqZWN0cyA9IG1lcmdlT2JqZWN0cztcclxuXHJcbmV4cG9ydHMuc3RhcnRzV2l0aCA9IHN0YXJ0c1dpdGg7XHJcbmV4cG9ydHMuZW5kc1dpdGggPSBlbmRzV2l0aDtcclxuXHJcbmV4cG9ydHMucGFyc2VJbnRlZ2VyID0gcGFyc2VJbnRlZ2VyO1xyXG5cclxuZXhwb3J0cy5pc284NjAxID0gaXNvODYwMTtcclxuZXhwb3J0cy5yZmMxMTIzID0gcmZjMTEyMztcclxuZXhwb3J0cy5wYXJzZURhdGVUaW1lID0gcGFyc2VEYXRlVGltZTtcclxuXHJcbmV4cG9ydHMuaHJ0aW1lZGlmZiA9IGhydGltZURpZmY7XHJcbmV4cG9ydHMuaHJ0aW1lRGlmZiA9IGhydGltZURpZmY7XHJcbmV4cG9ydHMuaHJ0aW1lQWNjdW0gPSBocnRpbWVBY2N1bTtcclxuZXhwb3J0cy5ocnRpbWVBZGQgPSBocnRpbWVBZGQ7XHJcbmV4cG9ydHMuaHJ0aW1lTmFub3NlYyA9IGhydGltZU5hbm9zZWM7XHJcbmV4cG9ydHMuaHJ0aW1lTWljcm9zZWMgPSBocnRpbWVNaWNyb3NlYztcclxuZXhwb3J0cy5ocnRpbWVNaWxsaXNlYyA9IGhydGltZU1pbGxpc2VjO1xyXG5cclxuXHJcbi8qXHJcbiAqIERlZXAgY29weSBhbiBhY3ljbGljICpiYXNpYyogSmF2YXNjcmlwdCBvYmplY3QuICBUaGlzIG9ubHkgaGFuZGxlcyBiYXNpY1xyXG4gKiBzY2FsYXJzIChzdHJpbmdzLCBudW1iZXJzLCBib29sZWFucykgYW5kIGFyYml0cmFyaWx5IGRlZXAgYXJyYXlzIGFuZCBvYmplY3RzXHJcbiAqIGNvbnRhaW5pbmcgdGhlc2UuICBUaGlzIGRvZXMgKm5vdCogaGFuZGxlIGluc3RhbmNlcyBvZiBvdGhlciBjbGFzc2VzLlxyXG4gKi9cclxuZnVuY3Rpb24gZGVlcENvcHkob2JqKVxyXG57XHJcblx0dmFyIHJldCwga2V5O1xyXG5cdHZhciBtYXJrZXIgPSAnX19kZWVwQ29weSc7XHJcblxyXG5cdGlmIChvYmogJiYgb2JqW21hcmtlcl0pXHJcblx0XHR0aHJvdyAobmV3IEVycm9yKCdhdHRlbXB0ZWQgZGVlcCBjb3B5IG9mIGN5Y2xpYyBvYmplY3QnKSk7XHJcblxyXG5cdGlmIChvYmogJiYgb2JqLmNvbnN0cnVjdG9yID09IE9iamVjdCkge1xyXG5cdFx0cmV0ID0ge307XHJcblx0XHRvYmpbbWFya2VyXSA9IHRydWU7XHJcblxyXG5cdFx0Zm9yIChrZXkgaW4gb2JqKSB7XHJcblx0XHRcdGlmIChrZXkgPT0gbWFya2VyKVxyXG5cdFx0XHRcdGNvbnRpbnVlO1xyXG5cclxuXHRcdFx0cmV0W2tleV0gPSBkZWVwQ29weShvYmpba2V5XSk7XHJcblx0XHR9XHJcblxyXG5cdFx0ZGVsZXRlIChvYmpbbWFya2VyXSk7XHJcblx0XHRyZXR1cm4gKHJldCk7XHJcblx0fVxyXG5cclxuXHRpZiAob2JqICYmIG9iai5jb25zdHJ1Y3RvciA9PSBBcnJheSkge1xyXG5cdFx0cmV0ID0gW107XHJcblx0XHRvYmpbbWFya2VyXSA9IHRydWU7XHJcblxyXG5cdFx0Zm9yIChrZXkgPSAwOyBrZXkgPCBvYmoubGVuZ3RoOyBrZXkrKylcclxuXHRcdFx0cmV0LnB1c2goZGVlcENvcHkob2JqW2tleV0pKTtcclxuXHJcblx0XHRkZWxldGUgKG9ialttYXJrZXJdKTtcclxuXHRcdHJldHVybiAocmV0KTtcclxuXHR9XHJcblxyXG5cdC8qXHJcblx0ICogSXQgbXVzdCBiZSBhIHByaW1pdGl2ZSB0eXBlIC0tIGp1c3QgcmV0dXJuIGl0LlxyXG5cdCAqL1xyXG5cdHJldHVybiAob2JqKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZGVlcEVxdWFsKG9iajEsIG9iajIpXHJcbntcclxuXHRpZiAodHlwZW9mIChvYmoxKSAhPSB0eXBlb2YgKG9iajIpKVxyXG5cdFx0cmV0dXJuIChmYWxzZSk7XHJcblxyXG5cdGlmIChvYmoxID09PSBudWxsIHx8IG9iajIgPT09IG51bGwgfHwgdHlwZW9mIChvYmoxKSAhPSAnb2JqZWN0JylcclxuXHRcdHJldHVybiAob2JqMSA9PT0gb2JqMik7XHJcblxyXG5cdGlmIChvYmoxLmNvbnN0cnVjdG9yICE9IG9iajIuY29uc3RydWN0b3IpXHJcblx0XHRyZXR1cm4gKGZhbHNlKTtcclxuXHJcblx0dmFyIGs7XHJcblx0Zm9yIChrIGluIG9iajEpIHtcclxuXHRcdGlmICghb2JqMi5oYXNPd25Qcm9wZXJ0eShrKSlcclxuXHRcdFx0cmV0dXJuIChmYWxzZSk7XHJcblxyXG5cdFx0aWYgKCFkZWVwRXF1YWwob2JqMVtrXSwgb2JqMltrXSkpXHJcblx0XHRcdHJldHVybiAoZmFsc2UpO1xyXG5cdH1cclxuXHJcblx0Zm9yIChrIGluIG9iajIpIHtcclxuXHRcdGlmICghb2JqMS5oYXNPd25Qcm9wZXJ0eShrKSlcclxuXHRcdFx0cmV0dXJuIChmYWxzZSk7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gKHRydWUpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBpc0VtcHR5KG9iailcclxue1xyXG5cdHZhciBrZXk7XHJcblx0Zm9yIChrZXkgaW4gb2JqKVxyXG5cdFx0cmV0dXJuIChmYWxzZSk7XHJcblx0cmV0dXJuICh0cnVlKTtcclxufVxyXG5cclxuZnVuY3Rpb24gaGFzS2V5KG9iaiwga2V5KVxyXG57XHJcblx0bW9kX2Fzc2VydC5lcXVhbCh0eXBlb2YgKGtleSksICdzdHJpbmcnKTtcclxuXHRyZXR1cm4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBmb3JFYWNoS2V5KG9iaiwgY2FsbGJhY2spXHJcbntcclxuXHRmb3IgKHZhciBrZXkgaW4gb2JqKSB7XHJcblx0XHRpZiAoaGFzS2V5KG9iaiwga2V5KSkge1xyXG5cdFx0XHRjYWxsYmFjayhrZXksIG9ialtrZXldKTtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHBsdWNrKG9iaiwga2V5KVxyXG57XHJcblx0bW9kX2Fzc2VydC5lcXVhbCh0eXBlb2YgKGtleSksICdzdHJpbmcnKTtcclxuXHRyZXR1cm4gKHBsdWNrdihvYmosIGtleSkpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBwbHVja3Yob2JqLCBrZXkpXHJcbntcclxuXHRpZiAob2JqID09PSBudWxsIHx8IHR5cGVvZiAob2JqKSAhPT0gJ29iamVjdCcpXHJcblx0XHRyZXR1cm4gKHVuZGVmaW5lZCk7XHJcblxyXG5cdGlmIChvYmouaGFzT3duUHJvcGVydHkoa2V5KSlcclxuXHRcdHJldHVybiAob2JqW2tleV0pO1xyXG5cclxuXHR2YXIgaSA9IGtleS5pbmRleE9mKCcuJyk7XHJcblx0aWYgKGkgPT0gLTEpXHJcblx0XHRyZXR1cm4gKHVuZGVmaW5lZCk7XHJcblxyXG5cdHZhciBrZXkxID0ga2V5LnN1YnN0cigwLCBpKTtcclxuXHRpZiAoIW9iai5oYXNPd25Qcm9wZXJ0eShrZXkxKSlcclxuXHRcdHJldHVybiAodW5kZWZpbmVkKTtcclxuXHJcblx0cmV0dXJuIChwbHVja3Yob2JqW2tleTFdLCBrZXkuc3Vic3RyKGkgKyAxKSkpO1xyXG59XHJcblxyXG4vKlxyXG4gKiBJbnZva2UgY2FsbGJhY2socm93KSBmb3IgZWFjaCBlbnRyeSBpbiB0aGUgYXJyYXkgdGhhdCB3b3VsZCBiZSByZXR1cm5lZCBieVxyXG4gKiBmbGF0dGVuT2JqZWN0KGRhdGEsIGRlcHRoKS4gIFRoaXMgaXMganVzdCBsaWtlIGZsYXR0ZW5PYmplY3QoZGF0YSxcclxuICogZGVwdGgpLmZvckVhY2goY2FsbGJhY2spLCBleGNlcHQgdGhhdCB0aGUgaW50ZXJtZWRpYXRlIGFycmF5IGlzIG5ldmVyXHJcbiAqIGNyZWF0ZWQuXHJcbiAqL1xyXG5mdW5jdGlvbiBmbGF0dGVuSXRlcihkYXRhLCBkZXB0aCwgY2FsbGJhY2spXHJcbntcclxuXHRkb0ZsYXR0ZW5JdGVyKGRhdGEsIGRlcHRoLCBbXSwgY2FsbGJhY2spO1xyXG59XHJcblxyXG5mdW5jdGlvbiBkb0ZsYXR0ZW5JdGVyKGRhdGEsIGRlcHRoLCBhY2N1bSwgY2FsbGJhY2spXHJcbntcclxuXHR2YXIgZWFjaDtcclxuXHR2YXIga2V5O1xyXG5cclxuXHRpZiAoZGVwdGggPT09IDApIHtcclxuXHRcdGVhY2ggPSBhY2N1bS5zbGljZSgwKTtcclxuXHRcdGVhY2gucHVzaChkYXRhKTtcclxuXHRcdGNhbGxiYWNrKGVhY2gpO1xyXG5cdFx0cmV0dXJuO1xyXG5cdH1cclxuXHJcblx0bW9kX2Fzc2VydC5vayhkYXRhICE9PSBudWxsKTtcclxuXHRtb2RfYXNzZXJ0LmVxdWFsKHR5cGVvZiAoZGF0YSksICdvYmplY3QnKTtcclxuXHRtb2RfYXNzZXJ0LmVxdWFsKHR5cGVvZiAoZGVwdGgpLCAnbnVtYmVyJyk7XHJcblx0bW9kX2Fzc2VydC5vayhkZXB0aCA+PSAwKTtcclxuXHJcblx0Zm9yIChrZXkgaW4gZGF0YSkge1xyXG5cdFx0ZWFjaCA9IGFjY3VtLnNsaWNlKDApO1xyXG5cdFx0ZWFjaC5wdXNoKGtleSk7XHJcblx0XHRkb0ZsYXR0ZW5JdGVyKGRhdGFba2V5XSwgZGVwdGggLSAxLCBlYWNoLCBjYWxsYmFjayk7XHJcblx0fVxyXG59XHJcblxyXG5mdW5jdGlvbiBmbGF0dGVuT2JqZWN0KGRhdGEsIGRlcHRoKVxyXG57XHJcblx0aWYgKGRlcHRoID09PSAwKVxyXG5cdFx0cmV0dXJuIChbIGRhdGEgXSk7XHJcblxyXG5cdG1vZF9hc3NlcnQub2soZGF0YSAhPT0gbnVsbCk7XHJcblx0bW9kX2Fzc2VydC5lcXVhbCh0eXBlb2YgKGRhdGEpLCAnb2JqZWN0Jyk7XHJcblx0bW9kX2Fzc2VydC5lcXVhbCh0eXBlb2YgKGRlcHRoKSwgJ251bWJlcicpO1xyXG5cdG1vZF9hc3NlcnQub2soZGVwdGggPj0gMCk7XHJcblxyXG5cdHZhciBydiA9IFtdO1xyXG5cdHZhciBrZXk7XHJcblxyXG5cdGZvciAoa2V5IGluIGRhdGEpIHtcclxuXHRcdGZsYXR0ZW5PYmplY3QoZGF0YVtrZXldLCBkZXB0aCAtIDEpLmZvckVhY2goZnVuY3Rpb24gKHApIHtcclxuXHRcdFx0cnYucHVzaChbIGtleSBdLmNvbmNhdChwKSk7XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdHJldHVybiAocnYpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBzdGFydHNXaXRoKHN0ciwgcHJlZml4KVxyXG57XHJcblx0cmV0dXJuIChzdHIuc3Vic3RyKDAsIHByZWZpeC5sZW5ndGgpID09IHByZWZpeCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGVuZHNXaXRoKHN0ciwgc3VmZml4KVxyXG57XHJcblx0cmV0dXJuIChzdHIuc3Vic3RyKFxyXG5cdCAgICBzdHIubGVuZ3RoIC0gc3VmZml4Lmxlbmd0aCwgc3VmZml4Lmxlbmd0aCkgPT0gc3VmZml4KTtcclxufVxyXG5cclxuZnVuY3Rpb24gaXNvODYwMShkKVxyXG57XHJcblx0aWYgKHR5cGVvZiAoZCkgPT0gJ251bWJlcicpXHJcblx0XHRkID0gbmV3IERhdGUoZCk7XHJcblx0bW9kX2Fzc2VydC5vayhkLmNvbnN0cnVjdG9yID09PSBEYXRlKTtcclxuXHRyZXR1cm4gKG1vZF9leHRzcHJpbnRmLnNwcmludGYoJyU0ZC0lMDJkLSUwMmRUJTAyZDolMDJkOiUwMmQuJTAzZFonLFxyXG5cdCAgICBkLmdldFVUQ0Z1bGxZZWFyKCksIGQuZ2V0VVRDTW9udGgoKSArIDEsIGQuZ2V0VVRDRGF0ZSgpLFxyXG5cdCAgICBkLmdldFVUQ0hvdXJzKCksIGQuZ2V0VVRDTWludXRlcygpLCBkLmdldFVUQ1NlY29uZHMoKSxcclxuXHQgICAgZC5nZXRVVENNaWxsaXNlY29uZHMoKSkpO1xyXG59XHJcblxyXG52YXIgUkZDMTEyM19NT05USFMgPSBbXHJcbiAgICAnSmFuJywgJ0ZlYicsICdNYXInLCAnQXByJywgJ01heScsICdKdW4nLFxyXG4gICAgJ0p1bCcsICdBdWcnLCAnU2VwJywgJ09jdCcsICdOb3YnLCAnRGVjJ107XHJcbnZhciBSRkMxMTIzX0RBWVMgPSBbXHJcbiAgICAnU3VuJywgJ01vbicsICdUdWUnLCAnV2VkJywgJ1RodScsICdGcmknLCAnU2F0J107XHJcblxyXG5mdW5jdGlvbiByZmMxMTIzKGRhdGUpIHtcclxuXHRyZXR1cm4gKG1vZF9leHRzcHJpbnRmLnNwcmludGYoJyVzLCAlMDJkICVzICUwNGQgJTAyZDolMDJkOiUwMmQgR01UJyxcclxuXHQgICAgUkZDMTEyM19EQVlTW2RhdGUuZ2V0VVRDRGF5KCldLCBkYXRlLmdldFVUQ0RhdGUoKSxcclxuXHQgICAgUkZDMTEyM19NT05USFNbZGF0ZS5nZXRVVENNb250aCgpXSwgZGF0ZS5nZXRVVENGdWxsWWVhcigpLFxyXG5cdCAgICBkYXRlLmdldFVUQ0hvdXJzKCksIGRhdGUuZ2V0VVRDTWludXRlcygpLFxyXG5cdCAgICBkYXRlLmdldFVUQ1NlY29uZHMoKSkpO1xyXG59XHJcblxyXG4vKlxyXG4gKiBQYXJzZXMgYSBkYXRlIGV4cHJlc3NlZCBhcyBhIHN0cmluZywgYXMgZWl0aGVyIGEgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyBzaW5jZVxyXG4gKiB0aGUgZXBvY2ggb3IgYW55IHN0cmluZyBmb3JtYXQgdGhhdCBEYXRlIGFjY2VwdHMsIGdpdmluZyBwcmVmZXJlbmNlIHRvIHRoZVxyXG4gKiBmb3JtZXIgd2hlcmUgdGhlc2UgdHdvIHNldHMgb3ZlcmxhcCAoZS5nLiwgc21hbGwgbnVtYmVycykuXHJcbiAqL1xyXG5mdW5jdGlvbiBwYXJzZURhdGVUaW1lKHN0cilcclxue1xyXG5cdC8qXHJcblx0ICogVGhpcyBpcyBpcnJpdGF0aW5nbHkgaW1wbGljaXQsIGJ1dCBzaWduaWZpY2FudGx5IG1vcmUgY29uY2lzZSB0aGFuXHJcblx0ICogYWx0ZXJuYXRpdmVzLiAgVGhlIFwiK3N0clwiIHdpbGwgY29udmVydCBhIHN0cmluZyBjb250YWluaW5nIG9ubHkgYVxyXG5cdCAqIG51bWJlciBkaXJlY3RseSB0byBhIE51bWJlciwgb3IgTmFOIGZvciBvdGhlciBzdHJpbmdzLiAgVGh1cywgaWYgdGhlXHJcblx0ICogY29udmVyc2lvbiBzdWNjZWVkcywgd2UgdXNlIGl0ICh0aGlzIGlzIHRoZSBtaWxsaXNlY29uZHMtc2luY2UtZXBvY2hcclxuXHQgKiBjYXNlKS4gIE90aGVyd2lzZSwgd2UgcGFzcyB0aGUgc3RyaW5nIGRpcmVjdGx5IHRvIHRoZSBEYXRlXHJcblx0ICogY29uc3RydWN0b3IgdG8gcGFyc2UuXHJcblx0ICovXHJcblx0dmFyIG51bWVyaWMgPSArc3RyO1xyXG5cdGlmICghaXNOYU4obnVtZXJpYykpIHtcclxuXHRcdHJldHVybiAobmV3IERhdGUobnVtZXJpYykpO1xyXG5cdH0gZWxzZSB7XHJcblx0XHRyZXR1cm4gKG5ldyBEYXRlKHN0cikpO1xyXG5cdH1cclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIE51bWJlci4qX1NBRkVfSU5URUdFUiBpc24ndCBwcmVzZW50IGJlZm9yZSBub2RlIHYwLjEyLCBzbyB3ZSBoYXJkY29kZVxyXG4gKiB0aGUgRVM2IGRlZmluaXRpb25zIGhlcmUsIHdoaWxlIGFsbG93aW5nIGZvciB0aGVtIHRvIHNvbWVkYXkgYmUgaGlnaGVyLlxyXG4gKi9cclxudmFyIE1BWF9TQUZFX0lOVEVHRVIgPSBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUiB8fCA5MDA3MTk5MjU0NzQwOTkxO1xyXG52YXIgTUlOX1NBRkVfSU5URUdFUiA9IE51bWJlci5NSU5fU0FGRV9JTlRFR0VSIHx8IC05MDA3MTk5MjU0NzQwOTkxO1xyXG5cclxuXHJcbi8qXHJcbiAqIERlZmF1bHQgb3B0aW9ucyBmb3IgcGFyc2VJbnRlZ2VyKCkuXHJcbiAqL1xyXG52YXIgUElfREVGQVVMVFMgPSB7XHJcblx0YmFzZTogMTAsXHJcblx0YWxsb3dTaWduOiB0cnVlLFxyXG5cdGFsbG93UHJlZml4OiBmYWxzZSxcclxuXHRhbGxvd1RyYWlsaW5nOiBmYWxzZSxcclxuXHRhbGxvd0ltcHJlY2lzZTogZmFsc2UsXHJcblx0dHJpbVdoaXRlc3BhY2U6IGZhbHNlLFxyXG5cdGxlYWRpbmdaZXJvSXNPY3RhbDogZmFsc2VcclxufTtcclxuXHJcbnZhciBDUF8wID0gMHgzMDtcclxudmFyIENQXzkgPSAweDM5O1xyXG5cclxudmFyIENQX0EgPSAweDQxO1xyXG52YXIgQ1BfQiA9IDB4NDI7XHJcbnZhciBDUF9PID0gMHg0ZjtcclxudmFyIENQX1QgPSAweDU0O1xyXG52YXIgQ1BfWCA9IDB4NTg7XHJcbnZhciBDUF9aID0gMHg1YTtcclxuXHJcbnZhciBDUF9hID0gMHg2MTtcclxudmFyIENQX2IgPSAweDYyO1xyXG52YXIgQ1BfbyA9IDB4NmY7XHJcbnZhciBDUF90ID0gMHg3NDtcclxudmFyIENQX3ggPSAweDc4O1xyXG52YXIgQ1BfeiA9IDB4N2E7XHJcblxyXG52YXIgUElfQ09OVl9ERUMgPSAweDMwO1xyXG52YXIgUElfQ09OVl9VQyA9IDB4Mzc7XHJcbnZhciBQSV9DT05WX0xDID0gMHg1NztcclxuXHJcblxyXG4vKlxyXG4gKiBBIHN0cmljdGVyIHZlcnNpb24gb2YgcGFyc2VJbnQoKSB0aGF0IHByb3ZpZGVzIG9wdGlvbnMgZm9yIGNoYW5naW5nIHdoYXRcclxuICogaXMgYW4gYWNjZXB0YWJsZSBzdHJpbmcgKGZvciBleGFtcGxlLCBkaXNhbGxvd2luZyB0cmFpbGluZyBjaGFyYWN0ZXJzKS5cclxuICovXHJcbmZ1bmN0aW9uIHBhcnNlSW50ZWdlcihzdHIsIHVvcHRzKVxyXG57XHJcblx0bW9kX2Fzc2VydC5zdHJpbmcoc3RyLCAnc3RyJyk7XHJcblx0bW9kX2Fzc2VydC5vcHRpb25hbE9iamVjdCh1b3B0cywgJ29wdGlvbnMnKTtcclxuXHJcblx0dmFyIGJhc2VPdmVycmlkZSA9IGZhbHNlO1xyXG5cdHZhciBvcHRpb25zID0gUElfREVGQVVMVFM7XHJcblxyXG5cdGlmICh1b3B0cykge1xyXG5cdFx0YmFzZU92ZXJyaWRlID0gaGFzS2V5KHVvcHRzLCAnYmFzZScpO1xyXG5cdFx0b3B0aW9ucyA9IG1lcmdlT2JqZWN0cyhvcHRpb25zLCB1b3B0cyk7XHJcblx0XHRtb2RfYXNzZXJ0Lm51bWJlcihvcHRpb25zLmJhc2UsICdvcHRpb25zLmJhc2UnKTtcclxuXHRcdG1vZF9hc3NlcnQub2sob3B0aW9ucy5iYXNlID49IDIsICdvcHRpb25zLmJhc2UgPj0gMicpO1xyXG5cdFx0bW9kX2Fzc2VydC5vayhvcHRpb25zLmJhc2UgPD0gMzYsICdvcHRpb25zLmJhc2UgPD0gMzYnKTtcclxuXHRcdG1vZF9hc3NlcnQuYm9vbChvcHRpb25zLmFsbG93U2lnbiwgJ29wdGlvbnMuYWxsb3dTaWduJyk7XHJcblx0XHRtb2RfYXNzZXJ0LmJvb2wob3B0aW9ucy5hbGxvd1ByZWZpeCwgJ29wdGlvbnMuYWxsb3dQcmVmaXgnKTtcclxuXHRcdG1vZF9hc3NlcnQuYm9vbChvcHRpb25zLmFsbG93VHJhaWxpbmcsXHJcblx0XHQgICAgJ29wdGlvbnMuYWxsb3dUcmFpbGluZycpO1xyXG5cdFx0bW9kX2Fzc2VydC5ib29sKG9wdGlvbnMuYWxsb3dJbXByZWNpc2UsXHJcblx0XHQgICAgJ29wdGlvbnMuYWxsb3dJbXByZWNpc2UnKTtcclxuXHRcdG1vZF9hc3NlcnQuYm9vbChvcHRpb25zLnRyaW1XaGl0ZXNwYWNlLFxyXG5cdFx0ICAgICdvcHRpb25zLnRyaW1XaGl0ZXNwYWNlJyk7XHJcblx0XHRtb2RfYXNzZXJ0LmJvb2wob3B0aW9ucy5sZWFkaW5nWmVyb0lzT2N0YWwsXHJcblx0XHQgICAgJ29wdGlvbnMubGVhZGluZ1plcm9Jc09jdGFsJyk7XHJcblxyXG5cdFx0aWYgKG9wdGlvbnMubGVhZGluZ1plcm9Jc09jdGFsKSB7XHJcblx0XHRcdG1vZF9hc3NlcnQub2soIWJhc2VPdmVycmlkZSxcclxuXHRcdFx0ICAgICdcImJhc2VcIiBhbmQgXCJsZWFkaW5nWmVyb0lzT2N0YWxcIiBhcmUgJyArXHJcblx0XHRcdCAgICAnbXV0dWFsbHkgZXhjbHVzaXZlJyk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHR2YXIgYztcclxuXHR2YXIgcGJhc2UgPSAtMTtcclxuXHR2YXIgYmFzZSA9IG9wdGlvbnMuYmFzZTtcclxuXHR2YXIgc3RhcnQ7XHJcblx0dmFyIG11bHQgPSAxO1xyXG5cdHZhciB2YWx1ZSA9IDA7XHJcblx0dmFyIGlkeCA9IDA7XHJcblx0dmFyIGxlbiA9IHN0ci5sZW5ndGg7XHJcblxyXG5cdC8qIFRyaW0gYW55IHdoaXRlc3BhY2Ugb24gdGhlIGxlZnQgc2lkZS4gKi9cclxuXHRpZiAob3B0aW9ucy50cmltV2hpdGVzcGFjZSkge1xyXG5cdFx0d2hpbGUgKGlkeCA8IGxlbiAmJiBpc1NwYWNlKHN0ci5jaGFyQ29kZUF0KGlkeCkpKSB7XHJcblx0XHRcdCsraWR4O1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0LyogQ2hlY2sgdGhlIG51bWJlciBmb3IgYSBsZWFkaW5nIHNpZ24uICovXHJcblx0aWYgKG9wdGlvbnMuYWxsb3dTaWduKSB7XHJcblx0XHRpZiAoc3RyW2lkeF0gPT09ICctJykge1xyXG5cdFx0XHRpZHggKz0gMTtcclxuXHRcdFx0bXVsdCA9IC0xO1xyXG5cdFx0fSBlbHNlIGlmIChzdHJbaWR4XSA9PT0gJysnKSB7XHJcblx0XHRcdGlkeCArPSAxO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0LyogUGFyc2UgdGhlIGJhc2UtaW5kaWNhdGluZyBwcmVmaXggaWYgdGhlcmUgaXMgb25lLiAqL1xyXG5cdGlmIChzdHJbaWR4XSA9PT0gJzAnKSB7XHJcblx0XHRpZiAob3B0aW9ucy5hbGxvd1ByZWZpeCkge1xyXG5cdFx0XHRwYmFzZSA9IHByZWZpeFRvQmFzZShzdHIuY2hhckNvZGVBdChpZHggKyAxKSk7XHJcblx0XHRcdGlmIChwYmFzZSAhPT0gLTEgJiYgKCFiYXNlT3ZlcnJpZGUgfHwgcGJhc2UgPT09IGJhc2UpKSB7XHJcblx0XHRcdFx0YmFzZSA9IHBiYXNlO1xyXG5cdFx0XHRcdGlkeCArPSAyO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHBiYXNlID09PSAtMSAmJiBvcHRpb25zLmxlYWRpbmdaZXJvSXNPY3RhbCkge1xyXG5cdFx0XHRiYXNlID0gODtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8qIFBhcnNlIHRoZSBhY3R1YWwgZGlnaXRzLiAqL1xyXG5cdGZvciAoc3RhcnQgPSBpZHg7IGlkeCA8IGxlbjsgKytpZHgpIHtcclxuXHRcdGMgPSB0cmFuc2xhdGVEaWdpdChzdHIuY2hhckNvZGVBdChpZHgpKTtcclxuXHRcdGlmIChjICE9PSAtMSAmJiBjIDwgYmFzZSkge1xyXG5cdFx0XHR2YWx1ZSAqPSBiYXNlO1xyXG5cdFx0XHR2YWx1ZSArPSBjO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0YnJlYWs7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvKiBJZiB3ZSBkaWRuJ3QgcGFyc2UgYW55IGRpZ2l0cywgd2UgaGF2ZSBhbiBpbnZhbGlkIG51bWJlci4gKi9cclxuXHRpZiAoc3RhcnQgPT09IGlkeCkge1xyXG5cdFx0cmV0dXJuIChuZXcgRXJyb3IoJ2ludmFsaWQgbnVtYmVyOiAnICsgSlNPTi5zdHJpbmdpZnkoc3RyKSkpO1xyXG5cdH1cclxuXHJcblx0LyogVHJpbSBhbnkgd2hpdGVzcGFjZSBvbiB0aGUgcmlnaHQgc2lkZS4gKi9cclxuXHRpZiAob3B0aW9ucy50cmltV2hpdGVzcGFjZSkge1xyXG5cdFx0d2hpbGUgKGlkeCA8IGxlbiAmJiBpc1NwYWNlKHN0ci5jaGFyQ29kZUF0KGlkeCkpKSB7XHJcblx0XHRcdCsraWR4O1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0LyogQ2hlY2sgZm9yIHRyYWlsaW5nIGNoYXJhY3RlcnMuICovXHJcblx0aWYgKGlkeCA8IGxlbiAmJiAhb3B0aW9ucy5hbGxvd1RyYWlsaW5nKSB7XHJcblx0XHRyZXR1cm4gKG5ldyBFcnJvcigndHJhaWxpbmcgY2hhcmFjdGVycyBhZnRlciBudW1iZXI6ICcgK1xyXG5cdFx0ICAgIEpTT04uc3RyaW5naWZ5KHN0ci5zbGljZShpZHgpKSkpO1xyXG5cdH1cclxuXHJcblx0LyogSWYgb3VyIHZhbHVlIGlzIDAsIHdlIHJldHVybiBub3csIHRvIGF2b2lkIHJldHVybmluZyAtMC4gKi9cclxuXHRpZiAodmFsdWUgPT09IDApIHtcclxuXHRcdHJldHVybiAoMCk7XHJcblx0fVxyXG5cclxuXHQvKiBDYWxjdWxhdGUgb3VyIGZpbmFsIHZhbHVlLiAqL1xyXG5cdHZhciByZXN1bHQgPSB2YWx1ZSAqIG11bHQ7XHJcblxyXG5cdC8qXHJcblx0ICogSWYgdGhlIHN0cmluZyByZXByZXNlbnRzIGEgdmFsdWUgdGhhdCBjYW5ub3QgYmUgcHJlY2lzZWx5IHJlcHJlc2VudGVkXHJcblx0ICogYnkgSmF2YVNjcmlwdCwgdGhlbiB3ZSB3YW50IHRvIGNoZWNrIHRoYXQ6XHJcblx0ICpcclxuXHQgKiAtIFdlIG5ldmVyIGluY3JlYXNlZCB0aGUgdmFsdWUgcGFzdCBNQVhfU0FGRV9JTlRFR0VSXHJcblx0ICogLSBXZSBkb24ndCBtYWtlIHRoZSByZXN1bHQgbmVnYXRpdmUgYW5kIGJlbG93IE1JTl9TQUZFX0lOVEVHRVJcclxuXHQgKlxyXG5cdCAqIEJlY2F1c2Ugd2Ugb25seSBldmVyIGluY3JlbWVudCB0aGUgdmFsdWUgZHVyaW5nIHBhcnNpbmcsIHRoZXJlJ3Mgbm9cclxuXHQgKiBjaGFuY2Ugb2YgbW92aW5nIHBhc3QgTUFYX1NBRkVfSU5URUdFUiBhbmQgdGhlbiBkcm9wcGluZyBiZWxvdyBpdFxyXG5cdCAqIGFnYWluLCBsb3NpbmcgcHJlY2lzaW9uIGluIHRoZSBwcm9jZXNzLiBUaGlzIG1lYW5zIHRoYXQgd2Ugb25seSBuZWVkXHJcblx0ICogdG8gZG8gb3VyIGNoZWNrcyBoZXJlLCBhdCB0aGUgZW5kLlxyXG5cdCAqL1xyXG5cdGlmICghb3B0aW9ucy5hbGxvd0ltcHJlY2lzZSAmJlxyXG5cdCAgICAodmFsdWUgPiBNQVhfU0FGRV9JTlRFR0VSIHx8IHJlc3VsdCA8IE1JTl9TQUZFX0lOVEVHRVIpKSB7XHJcblx0XHRyZXR1cm4gKG5ldyBFcnJvcignbnVtYmVyIGlzIG91dHNpZGUgb2YgdGhlIHN1cHBvcnRlZCByYW5nZTogJyArXHJcblx0XHQgICAgSlNPTi5zdHJpbmdpZnkoc3RyLnNsaWNlKHN0YXJ0LCBpZHgpKSkpO1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIChyZXN1bHQpO1xyXG59XHJcblxyXG5cclxuLypcclxuICogSW50ZXJwcmV0IGEgY2hhcmFjdGVyIGNvZGUgYXMgYSBiYXNlLTM2IGRpZ2l0LlxyXG4gKi9cclxuZnVuY3Rpb24gdHJhbnNsYXRlRGlnaXQoZClcclxue1xyXG5cdGlmIChkID49IENQXzAgJiYgZCA8PSBDUF85KSB7XHJcblx0XHQvKiAnMCcgdG8gJzknIC0+IDAgdG8gOSAqL1xyXG5cdFx0cmV0dXJuIChkIC0gUElfQ09OVl9ERUMpO1xyXG5cdH0gZWxzZSBpZiAoZCA+PSBDUF9BICYmIGQgPD0gQ1BfWikge1xyXG5cdFx0LyogJ0EnIC0gJ1onIC0+IDEwIHRvIDM1ICovXHJcblx0XHRyZXR1cm4gKGQgLSBQSV9DT05WX1VDKTtcclxuXHR9IGVsc2UgaWYgKGQgPj0gQ1BfYSAmJiBkIDw9IENQX3opIHtcclxuXHRcdC8qICdhJyAtICd6JyAtPiAxMCB0byAzNSAqL1xyXG5cdFx0cmV0dXJuIChkIC0gUElfQ09OVl9MQyk7XHJcblx0fSBlbHNlIHtcclxuXHRcdC8qIEludmFsaWQgY2hhcmFjdGVyIGNvZGUgKi9cclxuXHRcdHJldHVybiAoLTEpO1xyXG5cdH1cclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIFRlc3QgaWYgYSB2YWx1ZSBtYXRjaGVzIHRoZSBFQ01BU2NyaXB0IGRlZmluaXRpb24gb2YgdHJpbW1hYmxlIHdoaXRlc3BhY2UuXHJcbiAqL1xyXG5mdW5jdGlvbiBpc1NwYWNlKGMpXHJcbntcclxuXHRyZXR1cm4gKGMgPT09IDB4MjApIHx8XHJcblx0ICAgIChjID49IDB4MDAwOSAmJiBjIDw9IDB4MDAwZCkgfHxcclxuXHQgICAgKGMgPT09IDB4MDBhMCkgfHxcclxuXHQgICAgKGMgPT09IDB4MTY4MCkgfHxcclxuXHQgICAgKGMgPT09IDB4MTgwZSkgfHxcclxuXHQgICAgKGMgPj0gMHgyMDAwICYmIGMgPD0gMHgyMDBhKSB8fFxyXG5cdCAgICAoYyA9PT0gMHgyMDI4KSB8fFxyXG5cdCAgICAoYyA9PT0gMHgyMDI5KSB8fFxyXG5cdCAgICAoYyA9PT0gMHgyMDJmKSB8fFxyXG5cdCAgICAoYyA9PT0gMHgyMDVmKSB8fFxyXG5cdCAgICAoYyA9PT0gMHgzMDAwKSB8fFxyXG5cdCAgICAoYyA9PT0gMHhmZWZmKTtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIERldGVybWluZSB3aGljaCBiYXNlIGEgY2hhcmFjdGVyIGluZGljYXRlcyAoZS5nLiwgJ3gnIGluZGljYXRlcyBoZXgpLlxyXG4gKi9cclxuZnVuY3Rpb24gcHJlZml4VG9CYXNlKGMpXHJcbntcclxuXHRpZiAoYyA9PT0gQ1BfYiB8fCBjID09PSBDUF9CKSB7XHJcblx0XHQvKiAwYi8wQiAoYmluYXJ5KSAqL1xyXG5cdFx0cmV0dXJuICgyKTtcclxuXHR9IGVsc2UgaWYgKGMgPT09IENQX28gfHwgYyA9PT0gQ1BfTykge1xyXG5cdFx0LyogMG8vME8gKG9jdGFsKSAqL1xyXG5cdFx0cmV0dXJuICg4KTtcclxuXHR9IGVsc2UgaWYgKGMgPT09IENQX3QgfHwgYyA9PT0gQ1BfVCkge1xyXG5cdFx0LyogMHQvMFQgKGRlY2ltYWwpICovXHJcblx0XHRyZXR1cm4gKDEwKTtcclxuXHR9IGVsc2UgaWYgKGMgPT09IENQX3ggfHwgYyA9PT0gQ1BfWCkge1xyXG5cdFx0LyogMHgvMFggKGhleGFkZWNpbWFsKSAqL1xyXG5cdFx0cmV0dXJuICgxNik7XHJcblx0fSBlbHNlIHtcclxuXHRcdC8qIE5vdCBhIG1lYW5pbmdmdWwgY2hhcmFjdGVyICovXHJcblx0XHRyZXR1cm4gKC0xKTtcclxuXHR9XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiB2YWxpZGF0ZUpzb25PYmplY3RKUyhzY2hlbWEsIGlucHV0KVxyXG57XHJcblx0dmFyIHJlcG9ydCA9IG1vZF9qc29uc2NoZW1hLnZhbGlkYXRlKGlucHV0LCBzY2hlbWEpO1xyXG5cclxuXHRpZiAocmVwb3J0LmVycm9ycy5sZW5ndGggPT09IDApXHJcblx0XHRyZXR1cm4gKG51bGwpO1xyXG5cclxuXHQvKiBDdXJyZW50bHksIHdlIG9ubHkgZG8gYW55dGhpbmcgdXNlZnVsIHdpdGggdGhlIGZpcnN0IGVycm9yLiAqL1xyXG5cdHZhciBlcnJvciA9IHJlcG9ydC5lcnJvcnNbMF07XHJcblxyXG5cdC8qIFRoZSBmYWlsZWQgcHJvcGVydHkgaXMgZ2l2ZW4gYnkgYSBVUkkgd2l0aCBhbiBpcnJlbGV2YW50IHByZWZpeC4gKi9cclxuXHR2YXIgcHJvcG5hbWUgPSBlcnJvclsncHJvcGVydHknXTtcclxuXHR2YXIgcmVhc29uID0gZXJyb3JbJ21lc3NhZ2UnXS50b0xvd2VyQ2FzZSgpO1xyXG5cdHZhciBpLCBqO1xyXG5cclxuXHQvKlxyXG5cdCAqIFRoZXJlJ3MgYXQgbGVhc3Qgb25lIGNhc2Ugd2hlcmUgdGhlIHByb3BlcnR5IGVycm9yIG1lc3NhZ2UgaXNcclxuXHQgKiBjb25mdXNpbmcgYXQgYmVzdC4gIFdlIHdvcmsgYXJvdW5kIHRoaXMgaGVyZS5cclxuXHQgKi9cclxuXHRpZiAoKGkgPSByZWFzb24uaW5kZXhPZigndGhlIHByb3BlcnR5ICcpKSAhPSAtMSAmJlxyXG5cdCAgICAoaiA9IHJlYXNvbi5pbmRleE9mKCcgaXMgbm90IGRlZmluZWQgaW4gdGhlIHNjaGVtYSBhbmQgdGhlICcgK1xyXG5cdCAgICAnc2NoZW1hIGRvZXMgbm90IGFsbG93IGFkZGl0aW9uYWwgcHJvcGVydGllcycpKSAhPSAtMSkge1xyXG5cdFx0aSArPSAndGhlIHByb3BlcnR5ICcubGVuZ3RoO1xyXG5cdFx0aWYgKHByb3BuYW1lID09PSAnJylcclxuXHRcdFx0cHJvcG5hbWUgPSByZWFzb24uc3Vic3RyKGksIGogLSBpKTtcclxuXHRcdGVsc2VcclxuXHRcdFx0cHJvcG5hbWUgPSBwcm9wbmFtZSArICcuJyArIHJlYXNvbi5zdWJzdHIoaSwgaiAtIGkpO1xyXG5cclxuXHRcdHJlYXNvbiA9ICd1bnN1cHBvcnRlZCBwcm9wZXJ0eSc7XHJcblx0fVxyXG5cclxuXHR2YXIgcnYgPSBuZXcgbW9kX3ZlcnJvci5WRXJyb3IoJ3Byb3BlcnR5IFwiJXNcIjogJXMnLCBwcm9wbmFtZSwgcmVhc29uKTtcclxuXHRydi5qc3ZfZGV0YWlscyA9IGVycm9yO1xyXG5cdHJldHVybiAocnYpO1xyXG59XHJcblxyXG5mdW5jdGlvbiByYW5kRWx0KGFycilcclxue1xyXG5cdG1vZF9hc3NlcnQub2soQXJyYXkuaXNBcnJheShhcnIpICYmIGFyci5sZW5ndGggPiAwLFxyXG5cdCAgICAncmFuZEVsdCBhcmd1bWVudCBtdXN0IGJlIGEgbm9uLWVtcHR5IGFycmF5Jyk7XHJcblxyXG5cdHJldHVybiAoYXJyW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGFyci5sZW5ndGgpXSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGFzc2VydEhydGltZShhKVxyXG57XHJcblx0bW9kX2Fzc2VydC5vayhhWzBdID49IDAgJiYgYVsxXSA+PSAwLFxyXG5cdCAgICAnbmVnYXRpdmUgbnVtYmVycyBub3QgYWxsb3dlZCBpbiBocnRpbWVzJyk7XHJcblx0bW9kX2Fzc2VydC5vayhhWzFdIDwgMWU5LCAnbmFub3NlY29uZHMgY29sdW1uIG92ZXJmbG93Jyk7XHJcbn1cclxuXHJcbi8qXHJcbiAqIENvbXB1dGUgdGhlIHRpbWUgZWxhcHNlZCBiZXR3ZWVuIGhydGltZSByZWFkaW5ncyBBIGFuZCBCLCB3aGVyZSBBIGlzIGxhdGVyXHJcbiAqIHRoYW4gQi4gIGhydGltZSByZWFkaW5ncyBjb21lIGZyb20gTm9kZSdzIHByb2Nlc3MuaHJ0aW1lKCkuICBUaGVyZSBpcyBub1xyXG4gKiBkZWZpbmVkIHdheSB0byByZXByZXNlbnQgbmVnYXRpdmUgZGVsdGFzLCBzbyBpdCdzIGlsbGVnYWwgdG8gZGlmZiBCIGZyb20gQVxyXG4gKiB3aGVyZSB0aGUgdGltZSBkZW5vdGVkIGJ5IEIgaXMgbGF0ZXIgdGhhbiB0aGUgdGltZSBkZW5vdGVkIGJ5IEEuICBJZiB0aGlzXHJcbiAqIGJlY29tZXMgdmFsdWFibGUsIHdlIGNhbiBkZWZpbmUgYSByZXByZXNlbnRhdGlvbiBhbmQgZXh0ZW5kIHRoZVxyXG4gKiBpbXBsZW1lbnRhdGlvbiB0byBzdXBwb3J0IGl0LlxyXG4gKi9cclxuZnVuY3Rpb24gaHJ0aW1lRGlmZihhLCBiKVxyXG57XHJcblx0YXNzZXJ0SHJ0aW1lKGEpO1xyXG5cdGFzc2VydEhydGltZShiKTtcclxuXHRtb2RfYXNzZXJ0Lm9rKGFbMF0gPiBiWzBdIHx8IChhWzBdID09IGJbMF0gJiYgYVsxXSA+PSBiWzFdKSxcclxuXHQgICAgJ25lZ2F0aXZlIGRpZmZlcmVuY2VzIG5vdCBhbGxvd2VkJyk7XHJcblxyXG5cdHZhciBydiA9IFsgYVswXSAtIGJbMF0sIDAgXTtcclxuXHJcblx0aWYgKGFbMV0gPj0gYlsxXSkge1xyXG5cdFx0cnZbMV0gPSBhWzFdIC0gYlsxXTtcclxuXHR9IGVsc2Uge1xyXG5cdFx0cnZbMF0tLTtcclxuXHRcdHJ2WzFdID0gMWU5IC0gKGJbMV0gLSBhWzFdKTtcclxuXHR9XHJcblxyXG5cdHJldHVybiAocnYpO1xyXG59XHJcblxyXG4vKlxyXG4gKiBDb252ZXJ0IGEgaHJ0aW1lIHJlYWRpbmcgZnJvbSB0aGUgYXJyYXkgZm9ybWF0IHJldHVybmVkIGJ5IE5vZGUnc1xyXG4gKiBwcm9jZXNzLmhydGltZSgpIGludG8gYSBzY2FsYXIgbnVtYmVyIG9mIG5hbm9zZWNvbmRzLlxyXG4gKi9cclxuZnVuY3Rpb24gaHJ0aW1lTmFub3NlYyhhKVxyXG57XHJcblx0YXNzZXJ0SHJ0aW1lKGEpO1xyXG5cclxuXHRyZXR1cm4gKE1hdGguZmxvb3IoYVswXSAqIDFlOSArIGFbMV0pKTtcclxufVxyXG5cclxuLypcclxuICogQ29udmVydCBhIGhydGltZSByZWFkaW5nIGZyb20gdGhlIGFycmF5IGZvcm1hdCByZXR1cm5lZCBieSBOb2RlJ3NcclxuICogcHJvY2Vzcy5ocnRpbWUoKSBpbnRvIGEgc2NhbGFyIG51bWJlciBvZiBtaWNyb3NlY29uZHMuXHJcbiAqL1xyXG5mdW5jdGlvbiBocnRpbWVNaWNyb3NlYyhhKVxyXG57XHJcblx0YXNzZXJ0SHJ0aW1lKGEpO1xyXG5cclxuXHRyZXR1cm4gKE1hdGguZmxvb3IoYVswXSAqIDFlNiArIGFbMV0gLyAxZTMpKTtcclxufVxyXG5cclxuLypcclxuICogQ29udmVydCBhIGhydGltZSByZWFkaW5nIGZyb20gdGhlIGFycmF5IGZvcm1hdCByZXR1cm5lZCBieSBOb2RlJ3NcclxuICogcHJvY2Vzcy5ocnRpbWUoKSBpbnRvIGEgc2NhbGFyIG51bWJlciBvZiBtaWxsaXNlY29uZHMuXHJcbiAqL1xyXG5mdW5jdGlvbiBocnRpbWVNaWxsaXNlYyhhKVxyXG57XHJcblx0YXNzZXJ0SHJ0aW1lKGEpO1xyXG5cclxuXHRyZXR1cm4gKE1hdGguZmxvb3IoYVswXSAqIDFlMyArIGFbMV0gLyAxZTYpKTtcclxufVxyXG5cclxuLypcclxuICogQWRkIHR3byBocnRpbWUgcmVhZGluZ3MgQSBhbmQgQiwgb3ZlcndyaXRpbmcgQSB3aXRoIHRoZSByZXN1bHQgb2YgdGhlXHJcbiAqIGFkZGl0aW9uLiAgVGhpcyBmdW5jdGlvbiBpcyB1c2VmdWwgZm9yIGFjY3VtdWxhdGluZyBzZXZlcmFsIGhydGltZSBpbnRlcnZhbHNcclxuICogaW50byBhIGNvdW50ZXIuICBSZXR1cm5zIEEuXHJcbiAqL1xyXG5mdW5jdGlvbiBocnRpbWVBY2N1bShhLCBiKVxyXG57XHJcblx0YXNzZXJ0SHJ0aW1lKGEpO1xyXG5cdGFzc2VydEhydGltZShiKTtcclxuXHJcblx0LypcclxuXHQgKiBBY2N1bXVsYXRlIHRoZSBuYW5vc2Vjb25kIGNvbXBvbmVudC5cclxuXHQgKi9cclxuXHRhWzFdICs9IGJbMV07XHJcblx0aWYgKGFbMV0gPj0gMWU5KSB7XHJcblx0XHQvKlxyXG5cdFx0ICogVGhlIG5hbm9zZWNvbmQgY29tcG9uZW50IG92ZXJmbG93ZWQsIHNvIGNhcnJ5IHRvIHRoZSBzZWNvbmRzXHJcblx0XHQgKiBmaWVsZC5cclxuXHRcdCAqL1xyXG5cdFx0YVswXSsrO1xyXG5cdFx0YVsxXSAtPSAxZTk7XHJcblx0fVxyXG5cclxuXHQvKlxyXG5cdCAqIEFjY3VtdWxhdGUgdGhlIHNlY29uZHMgY29tcG9uZW50LlxyXG5cdCAqL1xyXG5cdGFbMF0gKz0gYlswXTtcclxuXHJcblx0cmV0dXJuIChhKTtcclxufVxyXG5cclxuLypcclxuICogQWRkIHR3byBocnRpbWUgcmVhZGluZ3MgQSBhbmQgQiwgcmV0dXJuaW5nIHRoZSByZXN1bHQgYXMgYSBuZXcgaHJ0aW1lIGFycmF5LlxyXG4gKiBEb2VzIG5vdCBtb2RpZnkgZWl0aGVyIGlucHV0IGFyZ3VtZW50LlxyXG4gKi9cclxuZnVuY3Rpb24gaHJ0aW1lQWRkKGEsIGIpXHJcbntcclxuXHRhc3NlcnRIcnRpbWUoYSk7XHJcblxyXG5cdHZhciBydiA9IFsgYVswXSwgYVsxXSBdO1xyXG5cclxuXHRyZXR1cm4gKGhydGltZUFjY3VtKHJ2LCBiKSk7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBDaGVjayBhbiBvYmplY3QgZm9yIHVuZXhwZWN0ZWQgcHJvcGVydGllcy4gIEFjY2VwdHMgdGhlIG9iamVjdCB0byBjaGVjaywgYW5kXHJcbiAqIGFuIGFycmF5IG9mIGFsbG93ZWQgcHJvcGVydHkgbmFtZXMgKHN0cmluZ3MpLiAgUmV0dXJucyBhbiBhcnJheSBvZiBrZXkgbmFtZXNcclxuICogdGhhdCB3ZXJlIGZvdW5kIG9uIHRoZSBvYmplY3QsIGJ1dCBkaWQgbm90IGFwcGVhciBpbiB0aGUgbGlzdCBvZiBhbGxvd2VkXHJcbiAqIHByb3BlcnRpZXMuICBJZiBubyBwcm9wZXJ0aWVzIHdlcmUgZm91bmQsIHRoZSByZXR1cm5lZCBhcnJheSB3aWxsIGJlIG9mXHJcbiAqIHplcm8gbGVuZ3RoLlxyXG4gKi9cclxuZnVuY3Rpb24gZXh0cmFQcm9wZXJ0aWVzKG9iaiwgYWxsb3dlZClcclxue1xyXG5cdG1vZF9hc3NlcnQub2sodHlwZW9mIChvYmopID09PSAnb2JqZWN0JyAmJiBvYmogIT09IG51bGwsXHJcblx0ICAgICdvYmogYXJndW1lbnQgbXVzdCBiZSBhIG5vbi1udWxsIG9iamVjdCcpO1xyXG5cdG1vZF9hc3NlcnQub2soQXJyYXkuaXNBcnJheShhbGxvd2VkKSxcclxuXHQgICAgJ2FsbG93ZWQgYXJndW1lbnQgbXVzdCBiZSBhbiBhcnJheSBvZiBzdHJpbmdzJyk7XHJcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBhbGxvd2VkLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRtb2RfYXNzZXJ0Lm9rKHR5cGVvZiAoYWxsb3dlZFtpXSkgPT09ICdzdHJpbmcnLFxyXG5cdFx0ICAgICdhbGxvd2VkIGFyZ3VtZW50IG11c3QgYmUgYW4gYXJyYXkgb2Ygc3RyaW5ncycpO1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIChPYmplY3Qua2V5cyhvYmopLmZpbHRlcihmdW5jdGlvbiAoa2V5KSB7XHJcblx0XHRyZXR1cm4gKGFsbG93ZWQuaW5kZXhPZihrZXkpID09PSAtMSk7XHJcblx0fSkpO1xyXG59XHJcblxyXG4vKlxyXG4gKiBHaXZlbiB0aHJlZSBzZXRzIG9mIHByb3BlcnRpZXMgXCJwcm92aWRlZFwiIChtYXkgYmUgdW5kZWZpbmVkKSwgXCJvdmVycmlkZXNcIlxyXG4gKiAocmVxdWlyZWQpLCBhbmQgXCJkZWZhdWx0c1wiIChtYXkgYmUgdW5kZWZpbmVkKSwgY29uc3RydWN0IGFuIG9iamVjdCBjb250YWluaW5nXHJcbiAqIHRoZSB1bmlvbiBvZiB0aGVzZSBzZXRzIHdpdGggXCJvdmVycmlkZXNcIiBvdmVycmlkaW5nIFwicHJvdmlkZWRcIiwgYW5kXHJcbiAqIFwicHJvdmlkZWRcIiBvdmVycmlkaW5nIFwiZGVmYXVsdHNcIi4gIE5vbmUgb2YgdGhlIGlucHV0IG9iamVjdHMgYXJlIG1vZGlmaWVkLlxyXG4gKi9cclxuZnVuY3Rpb24gbWVyZ2VPYmplY3RzKHByb3ZpZGVkLCBvdmVycmlkZXMsIGRlZmF1bHRzKVxyXG57XHJcblx0dmFyIHJ2LCBrO1xyXG5cclxuXHRydiA9IHt9O1xyXG5cdGlmIChkZWZhdWx0cykge1xyXG5cdFx0Zm9yIChrIGluIGRlZmF1bHRzKVxyXG5cdFx0XHRydltrXSA9IGRlZmF1bHRzW2tdO1xyXG5cdH1cclxuXHJcblx0aWYgKHByb3ZpZGVkKSB7XHJcblx0XHRmb3IgKGsgaW4gcHJvdmlkZWQpXHJcblx0XHRcdHJ2W2tdID0gcHJvdmlkZWRba107XHJcblx0fVxyXG5cclxuXHRpZiAob3ZlcnJpZGVzKSB7XHJcblx0XHRmb3IgKGsgaW4gb3ZlcnJpZGVzKVxyXG5cdFx0XHRydltrXSA9IG92ZXJyaWRlc1trXTtcclxuXHR9XHJcblxyXG5cdHJldHVybiAocnYpO1xyXG59XHJcbiJdLCJzb3VyY2VSb290IjoiIn0=