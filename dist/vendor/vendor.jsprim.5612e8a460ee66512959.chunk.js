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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvanNwcmltL2xpYi9qc3ByaW0uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBOztBQUVBLGlCQUFpQixtQkFBTyxDQUFDLHlCQUFhO0FBQ3RDLGVBQWUsbUJBQU8sQ0FBQyxrQkFBTTs7QUFFN0IscUJBQXFCLG1CQUFPLENBQUMsd0JBQVk7QUFDekMsaUJBQWlCLG1CQUFPLENBQUMsb0JBQVE7QUFDakMscUJBQXFCLG1CQUFPLENBQUMseUJBQWE7O0FBRTFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxlQUFlLGtCQUFrQjtBQUNqQzs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGtCQUFrQixXQUFXO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLG9CQUFvQjtBQUNwQztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEVBQUU7QUFDRjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBIiwiZmlsZSI6InZlbmRvci92ZW5kb3IuanNwcmltLjU2MTJlOGE0NjBlZTY2NTEyOTU5LmNodW5rLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIGxpYi9qc3ByaW0uanM6IHV0aWxpdGllcyBmb3IgcHJpbWl0aXZlIEphdmFTY3JpcHQgdHlwZXNcbiAqL1xuXG52YXIgbW9kX2Fzc2VydCA9IHJlcXVpcmUoJ2Fzc2VydC1wbHVzJyk7XG52YXIgbW9kX3V0aWwgPSByZXF1aXJlKCd1dGlsJyk7XG5cbnZhciBtb2RfZXh0c3ByaW50ZiA9IHJlcXVpcmUoJ2V4dHNwcmludGYnKTtcbnZhciBtb2RfdmVycm9yID0gcmVxdWlyZSgndmVycm9yJyk7XG52YXIgbW9kX2pzb25zY2hlbWEgPSByZXF1aXJlKCdqc29uLXNjaGVtYScpO1xuXG4vKlxuICogUHVibGljIGludGVyZmFjZVxuICovXG5leHBvcnRzLmRlZXBDb3B5ID0gZGVlcENvcHk7XG5leHBvcnRzLmRlZXBFcXVhbCA9IGRlZXBFcXVhbDtcbmV4cG9ydHMuaXNFbXB0eSA9IGlzRW1wdHk7XG5leHBvcnRzLmhhc0tleSA9IGhhc0tleTtcbmV4cG9ydHMuZm9yRWFjaEtleSA9IGZvckVhY2hLZXk7XG5leHBvcnRzLnBsdWNrID0gcGx1Y2s7XG5leHBvcnRzLmZsYXR0ZW5PYmplY3QgPSBmbGF0dGVuT2JqZWN0O1xuZXhwb3J0cy5mbGF0dGVuSXRlciA9IGZsYXR0ZW5JdGVyO1xuZXhwb3J0cy52YWxpZGF0ZUpzb25PYmplY3QgPSB2YWxpZGF0ZUpzb25PYmplY3RKUztcbmV4cG9ydHMudmFsaWRhdGVKc29uT2JqZWN0SlMgPSB2YWxpZGF0ZUpzb25PYmplY3RKUztcbmV4cG9ydHMucmFuZEVsdCA9IHJhbmRFbHQ7XG5leHBvcnRzLmV4dHJhUHJvcGVydGllcyA9IGV4dHJhUHJvcGVydGllcztcbmV4cG9ydHMubWVyZ2VPYmplY3RzID0gbWVyZ2VPYmplY3RzO1xuXG5leHBvcnRzLnN0YXJ0c1dpdGggPSBzdGFydHNXaXRoO1xuZXhwb3J0cy5lbmRzV2l0aCA9IGVuZHNXaXRoO1xuXG5leHBvcnRzLnBhcnNlSW50ZWdlciA9IHBhcnNlSW50ZWdlcjtcblxuZXhwb3J0cy5pc284NjAxID0gaXNvODYwMTtcbmV4cG9ydHMucmZjMTEyMyA9IHJmYzExMjM7XG5leHBvcnRzLnBhcnNlRGF0ZVRpbWUgPSBwYXJzZURhdGVUaW1lO1xuXG5leHBvcnRzLmhydGltZWRpZmYgPSBocnRpbWVEaWZmO1xuZXhwb3J0cy5ocnRpbWVEaWZmID0gaHJ0aW1lRGlmZjtcbmV4cG9ydHMuaHJ0aW1lQWNjdW0gPSBocnRpbWVBY2N1bTtcbmV4cG9ydHMuaHJ0aW1lQWRkID0gaHJ0aW1lQWRkO1xuZXhwb3J0cy5ocnRpbWVOYW5vc2VjID0gaHJ0aW1lTmFub3NlYztcbmV4cG9ydHMuaHJ0aW1lTWljcm9zZWMgPSBocnRpbWVNaWNyb3NlYztcbmV4cG9ydHMuaHJ0aW1lTWlsbGlzZWMgPSBocnRpbWVNaWxsaXNlYztcblxuXG4vKlxuICogRGVlcCBjb3B5IGFuIGFjeWNsaWMgKmJhc2ljKiBKYXZhc2NyaXB0IG9iamVjdC4gIFRoaXMgb25seSBoYW5kbGVzIGJhc2ljXG4gKiBzY2FsYXJzIChzdHJpbmdzLCBudW1iZXJzLCBib29sZWFucykgYW5kIGFyYml0cmFyaWx5IGRlZXAgYXJyYXlzIGFuZCBvYmplY3RzXG4gKiBjb250YWluaW5nIHRoZXNlLiAgVGhpcyBkb2VzICpub3QqIGhhbmRsZSBpbnN0YW5jZXMgb2Ygb3RoZXIgY2xhc3Nlcy5cbiAqL1xuZnVuY3Rpb24gZGVlcENvcHkob2JqKVxue1xuXHR2YXIgcmV0LCBrZXk7XG5cdHZhciBtYXJrZXIgPSAnX19kZWVwQ29weSc7XG5cblx0aWYgKG9iaiAmJiBvYmpbbWFya2VyXSlcblx0XHR0aHJvdyAobmV3IEVycm9yKCdhdHRlbXB0ZWQgZGVlcCBjb3B5IG9mIGN5Y2xpYyBvYmplY3QnKSk7XG5cblx0aWYgKG9iaiAmJiBvYmouY29uc3RydWN0b3IgPT0gT2JqZWN0KSB7XG5cdFx0cmV0ID0ge307XG5cdFx0b2JqW21hcmtlcl0gPSB0cnVlO1xuXG5cdFx0Zm9yIChrZXkgaW4gb2JqKSB7XG5cdFx0XHRpZiAoa2V5ID09IG1hcmtlcilcblx0XHRcdFx0Y29udGludWU7XG5cblx0XHRcdHJldFtrZXldID0gZGVlcENvcHkob2JqW2tleV0pO1xuXHRcdH1cblxuXHRcdGRlbGV0ZSAob2JqW21hcmtlcl0pO1xuXHRcdHJldHVybiAocmV0KTtcblx0fVxuXG5cdGlmIChvYmogJiYgb2JqLmNvbnN0cnVjdG9yID09IEFycmF5KSB7XG5cdFx0cmV0ID0gW107XG5cdFx0b2JqW21hcmtlcl0gPSB0cnVlO1xuXG5cdFx0Zm9yIChrZXkgPSAwOyBrZXkgPCBvYmoubGVuZ3RoOyBrZXkrKylcblx0XHRcdHJldC5wdXNoKGRlZXBDb3B5KG9ialtrZXldKSk7XG5cblx0XHRkZWxldGUgKG9ialttYXJrZXJdKTtcblx0XHRyZXR1cm4gKHJldCk7XG5cdH1cblxuXHQvKlxuXHQgKiBJdCBtdXN0IGJlIGEgcHJpbWl0aXZlIHR5cGUgLS0ganVzdCByZXR1cm4gaXQuXG5cdCAqL1xuXHRyZXR1cm4gKG9iaik7XG59XG5cbmZ1bmN0aW9uIGRlZXBFcXVhbChvYmoxLCBvYmoyKVxue1xuXHRpZiAodHlwZW9mIChvYmoxKSAhPSB0eXBlb2YgKG9iajIpKVxuXHRcdHJldHVybiAoZmFsc2UpO1xuXG5cdGlmIChvYmoxID09PSBudWxsIHx8IG9iajIgPT09IG51bGwgfHwgdHlwZW9mIChvYmoxKSAhPSAnb2JqZWN0Jylcblx0XHRyZXR1cm4gKG9iajEgPT09IG9iajIpO1xuXG5cdGlmIChvYmoxLmNvbnN0cnVjdG9yICE9IG9iajIuY29uc3RydWN0b3IpXG5cdFx0cmV0dXJuIChmYWxzZSk7XG5cblx0dmFyIGs7XG5cdGZvciAoayBpbiBvYmoxKSB7XG5cdFx0aWYgKCFvYmoyLmhhc093blByb3BlcnR5KGspKVxuXHRcdFx0cmV0dXJuIChmYWxzZSk7XG5cblx0XHRpZiAoIWRlZXBFcXVhbChvYmoxW2tdLCBvYmoyW2tdKSlcblx0XHRcdHJldHVybiAoZmFsc2UpO1xuXHR9XG5cblx0Zm9yIChrIGluIG9iajIpIHtcblx0XHRpZiAoIW9iajEuaGFzT3duUHJvcGVydHkoaykpXG5cdFx0XHRyZXR1cm4gKGZhbHNlKTtcblx0fVxuXG5cdHJldHVybiAodHJ1ZSk7XG59XG5cbmZ1bmN0aW9uIGlzRW1wdHkob2JqKVxue1xuXHR2YXIga2V5O1xuXHRmb3IgKGtleSBpbiBvYmopXG5cdFx0cmV0dXJuIChmYWxzZSk7XG5cdHJldHVybiAodHJ1ZSk7XG59XG5cbmZ1bmN0aW9uIGhhc0tleShvYmosIGtleSlcbntcblx0bW9kX2Fzc2VydC5lcXVhbCh0eXBlb2YgKGtleSksICdzdHJpbmcnKTtcblx0cmV0dXJuIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpKTtcbn1cblxuZnVuY3Rpb24gZm9yRWFjaEtleShvYmosIGNhbGxiYWNrKVxue1xuXHRmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG5cdFx0aWYgKGhhc0tleShvYmosIGtleSkpIHtcblx0XHRcdGNhbGxiYWNrKGtleSwgb2JqW2tleV0pO1xuXHRcdH1cblx0fVxufVxuXG5mdW5jdGlvbiBwbHVjayhvYmosIGtleSlcbntcblx0bW9kX2Fzc2VydC5lcXVhbCh0eXBlb2YgKGtleSksICdzdHJpbmcnKTtcblx0cmV0dXJuIChwbHVja3Yob2JqLCBrZXkpKTtcbn1cblxuZnVuY3Rpb24gcGx1Y2t2KG9iaiwga2V5KVxue1xuXHRpZiAob2JqID09PSBudWxsIHx8IHR5cGVvZiAob2JqKSAhPT0gJ29iamVjdCcpXG5cdFx0cmV0dXJuICh1bmRlZmluZWQpO1xuXG5cdGlmIChvYmouaGFzT3duUHJvcGVydHkoa2V5KSlcblx0XHRyZXR1cm4gKG9ialtrZXldKTtcblxuXHR2YXIgaSA9IGtleS5pbmRleE9mKCcuJyk7XG5cdGlmIChpID09IC0xKVxuXHRcdHJldHVybiAodW5kZWZpbmVkKTtcblxuXHR2YXIga2V5MSA9IGtleS5zdWJzdHIoMCwgaSk7XG5cdGlmICghb2JqLmhhc093blByb3BlcnR5KGtleTEpKVxuXHRcdHJldHVybiAodW5kZWZpbmVkKTtcblxuXHRyZXR1cm4gKHBsdWNrdihvYmpba2V5MV0sIGtleS5zdWJzdHIoaSArIDEpKSk7XG59XG5cbi8qXG4gKiBJbnZva2UgY2FsbGJhY2socm93KSBmb3IgZWFjaCBlbnRyeSBpbiB0aGUgYXJyYXkgdGhhdCB3b3VsZCBiZSByZXR1cm5lZCBieVxuICogZmxhdHRlbk9iamVjdChkYXRhLCBkZXB0aCkuICBUaGlzIGlzIGp1c3QgbGlrZSBmbGF0dGVuT2JqZWN0KGRhdGEsXG4gKiBkZXB0aCkuZm9yRWFjaChjYWxsYmFjayksIGV4Y2VwdCB0aGF0IHRoZSBpbnRlcm1lZGlhdGUgYXJyYXkgaXMgbmV2ZXJcbiAqIGNyZWF0ZWQuXG4gKi9cbmZ1bmN0aW9uIGZsYXR0ZW5JdGVyKGRhdGEsIGRlcHRoLCBjYWxsYmFjaylcbntcblx0ZG9GbGF0dGVuSXRlcihkYXRhLCBkZXB0aCwgW10sIGNhbGxiYWNrKTtcbn1cblxuZnVuY3Rpb24gZG9GbGF0dGVuSXRlcihkYXRhLCBkZXB0aCwgYWNjdW0sIGNhbGxiYWNrKVxue1xuXHR2YXIgZWFjaDtcblx0dmFyIGtleTtcblxuXHRpZiAoZGVwdGggPT09IDApIHtcblx0XHRlYWNoID0gYWNjdW0uc2xpY2UoMCk7XG5cdFx0ZWFjaC5wdXNoKGRhdGEpO1xuXHRcdGNhbGxiYWNrKGVhY2gpO1xuXHRcdHJldHVybjtcblx0fVxuXG5cdG1vZF9hc3NlcnQub2soZGF0YSAhPT0gbnVsbCk7XG5cdG1vZF9hc3NlcnQuZXF1YWwodHlwZW9mIChkYXRhKSwgJ29iamVjdCcpO1xuXHRtb2RfYXNzZXJ0LmVxdWFsKHR5cGVvZiAoZGVwdGgpLCAnbnVtYmVyJyk7XG5cdG1vZF9hc3NlcnQub2soZGVwdGggPj0gMCk7XG5cblx0Zm9yIChrZXkgaW4gZGF0YSkge1xuXHRcdGVhY2ggPSBhY2N1bS5zbGljZSgwKTtcblx0XHRlYWNoLnB1c2goa2V5KTtcblx0XHRkb0ZsYXR0ZW5JdGVyKGRhdGFba2V5XSwgZGVwdGggLSAxLCBlYWNoLCBjYWxsYmFjayk7XG5cdH1cbn1cblxuZnVuY3Rpb24gZmxhdHRlbk9iamVjdChkYXRhLCBkZXB0aClcbntcblx0aWYgKGRlcHRoID09PSAwKVxuXHRcdHJldHVybiAoWyBkYXRhIF0pO1xuXG5cdG1vZF9hc3NlcnQub2soZGF0YSAhPT0gbnVsbCk7XG5cdG1vZF9hc3NlcnQuZXF1YWwodHlwZW9mIChkYXRhKSwgJ29iamVjdCcpO1xuXHRtb2RfYXNzZXJ0LmVxdWFsKHR5cGVvZiAoZGVwdGgpLCAnbnVtYmVyJyk7XG5cdG1vZF9hc3NlcnQub2soZGVwdGggPj0gMCk7XG5cblx0dmFyIHJ2ID0gW107XG5cdHZhciBrZXk7XG5cblx0Zm9yIChrZXkgaW4gZGF0YSkge1xuXHRcdGZsYXR0ZW5PYmplY3QoZGF0YVtrZXldLCBkZXB0aCAtIDEpLmZvckVhY2goZnVuY3Rpb24gKHApIHtcblx0XHRcdHJ2LnB1c2goWyBrZXkgXS5jb25jYXQocCkpO1xuXHRcdH0pO1xuXHR9XG5cblx0cmV0dXJuIChydik7XG59XG5cbmZ1bmN0aW9uIHN0YXJ0c1dpdGgoc3RyLCBwcmVmaXgpXG57XG5cdHJldHVybiAoc3RyLnN1YnN0cigwLCBwcmVmaXgubGVuZ3RoKSA9PSBwcmVmaXgpO1xufVxuXG5mdW5jdGlvbiBlbmRzV2l0aChzdHIsIHN1ZmZpeClcbntcblx0cmV0dXJuIChzdHIuc3Vic3RyKFxuXHQgICAgc3RyLmxlbmd0aCAtIHN1ZmZpeC5sZW5ndGgsIHN1ZmZpeC5sZW5ndGgpID09IHN1ZmZpeCk7XG59XG5cbmZ1bmN0aW9uIGlzbzg2MDEoZClcbntcblx0aWYgKHR5cGVvZiAoZCkgPT0gJ251bWJlcicpXG5cdFx0ZCA9IG5ldyBEYXRlKGQpO1xuXHRtb2RfYXNzZXJ0Lm9rKGQuY29uc3RydWN0b3IgPT09IERhdGUpO1xuXHRyZXR1cm4gKG1vZF9leHRzcHJpbnRmLnNwcmludGYoJyU0ZC0lMDJkLSUwMmRUJTAyZDolMDJkOiUwMmQuJTAzZFonLFxuXHQgICAgZC5nZXRVVENGdWxsWWVhcigpLCBkLmdldFVUQ01vbnRoKCkgKyAxLCBkLmdldFVUQ0RhdGUoKSxcblx0ICAgIGQuZ2V0VVRDSG91cnMoKSwgZC5nZXRVVENNaW51dGVzKCksIGQuZ2V0VVRDU2Vjb25kcygpLFxuXHQgICAgZC5nZXRVVENNaWxsaXNlY29uZHMoKSkpO1xufVxuXG52YXIgUkZDMTEyM19NT05USFMgPSBbXG4gICAgJ0phbicsICdGZWInLCAnTWFyJywgJ0FwcicsICdNYXknLCAnSnVuJyxcbiAgICAnSnVsJywgJ0F1ZycsICdTZXAnLCAnT2N0JywgJ05vdicsICdEZWMnXTtcbnZhciBSRkMxMTIzX0RBWVMgPSBbXG4gICAgJ1N1bicsICdNb24nLCAnVHVlJywgJ1dlZCcsICdUaHUnLCAnRnJpJywgJ1NhdCddO1xuXG5mdW5jdGlvbiByZmMxMTIzKGRhdGUpIHtcblx0cmV0dXJuIChtb2RfZXh0c3ByaW50Zi5zcHJpbnRmKCclcywgJTAyZCAlcyAlMDRkICUwMmQ6JTAyZDolMDJkIEdNVCcsXG5cdCAgICBSRkMxMTIzX0RBWVNbZGF0ZS5nZXRVVENEYXkoKV0sIGRhdGUuZ2V0VVRDRGF0ZSgpLFxuXHQgICAgUkZDMTEyM19NT05USFNbZGF0ZS5nZXRVVENNb250aCgpXSwgZGF0ZS5nZXRVVENGdWxsWWVhcigpLFxuXHQgICAgZGF0ZS5nZXRVVENIb3VycygpLCBkYXRlLmdldFVUQ01pbnV0ZXMoKSxcblx0ICAgIGRhdGUuZ2V0VVRDU2Vjb25kcygpKSk7XG59XG5cbi8qXG4gKiBQYXJzZXMgYSBkYXRlIGV4cHJlc3NlZCBhcyBhIHN0cmluZywgYXMgZWl0aGVyIGEgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyBzaW5jZVxuICogdGhlIGVwb2NoIG9yIGFueSBzdHJpbmcgZm9ybWF0IHRoYXQgRGF0ZSBhY2NlcHRzLCBnaXZpbmcgcHJlZmVyZW5jZSB0byB0aGVcbiAqIGZvcm1lciB3aGVyZSB0aGVzZSB0d28gc2V0cyBvdmVybGFwIChlLmcuLCBzbWFsbCBudW1iZXJzKS5cbiAqL1xuZnVuY3Rpb24gcGFyc2VEYXRlVGltZShzdHIpXG57XG5cdC8qXG5cdCAqIFRoaXMgaXMgaXJyaXRhdGluZ2x5IGltcGxpY2l0LCBidXQgc2lnbmlmaWNhbnRseSBtb3JlIGNvbmNpc2UgdGhhblxuXHQgKiBhbHRlcm5hdGl2ZXMuICBUaGUgXCIrc3RyXCIgd2lsbCBjb252ZXJ0IGEgc3RyaW5nIGNvbnRhaW5pbmcgb25seSBhXG5cdCAqIG51bWJlciBkaXJlY3RseSB0byBhIE51bWJlciwgb3IgTmFOIGZvciBvdGhlciBzdHJpbmdzLiAgVGh1cywgaWYgdGhlXG5cdCAqIGNvbnZlcnNpb24gc3VjY2VlZHMsIHdlIHVzZSBpdCAodGhpcyBpcyB0aGUgbWlsbGlzZWNvbmRzLXNpbmNlLWVwb2NoXG5cdCAqIGNhc2UpLiAgT3RoZXJ3aXNlLCB3ZSBwYXNzIHRoZSBzdHJpbmcgZGlyZWN0bHkgdG8gdGhlIERhdGVcblx0ICogY29uc3RydWN0b3IgdG8gcGFyc2UuXG5cdCAqL1xuXHR2YXIgbnVtZXJpYyA9ICtzdHI7XG5cdGlmICghaXNOYU4obnVtZXJpYykpIHtcblx0XHRyZXR1cm4gKG5ldyBEYXRlKG51bWVyaWMpKTtcblx0fSBlbHNlIHtcblx0XHRyZXR1cm4gKG5ldyBEYXRlKHN0cikpO1xuXHR9XG59XG5cblxuLypcbiAqIE51bWJlci4qX1NBRkVfSU5URUdFUiBpc24ndCBwcmVzZW50IGJlZm9yZSBub2RlIHYwLjEyLCBzbyB3ZSBoYXJkY29kZVxuICogdGhlIEVTNiBkZWZpbml0aW9ucyBoZXJlLCB3aGlsZSBhbGxvd2luZyBmb3IgdGhlbSB0byBzb21lZGF5IGJlIGhpZ2hlci5cbiAqL1xudmFyIE1BWF9TQUZFX0lOVEVHRVIgPSBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUiB8fCA5MDA3MTk5MjU0NzQwOTkxO1xudmFyIE1JTl9TQUZFX0lOVEVHRVIgPSBOdW1iZXIuTUlOX1NBRkVfSU5URUdFUiB8fCAtOTAwNzE5OTI1NDc0MDk5MTtcblxuXG4vKlxuICogRGVmYXVsdCBvcHRpb25zIGZvciBwYXJzZUludGVnZXIoKS5cbiAqL1xudmFyIFBJX0RFRkFVTFRTID0ge1xuXHRiYXNlOiAxMCxcblx0YWxsb3dTaWduOiB0cnVlLFxuXHRhbGxvd1ByZWZpeDogZmFsc2UsXG5cdGFsbG93VHJhaWxpbmc6IGZhbHNlLFxuXHRhbGxvd0ltcHJlY2lzZTogZmFsc2UsXG5cdHRyaW1XaGl0ZXNwYWNlOiBmYWxzZSxcblx0bGVhZGluZ1plcm9Jc09jdGFsOiBmYWxzZVxufTtcblxudmFyIENQXzAgPSAweDMwO1xudmFyIENQXzkgPSAweDM5O1xuXG52YXIgQ1BfQSA9IDB4NDE7XG52YXIgQ1BfQiA9IDB4NDI7XG52YXIgQ1BfTyA9IDB4NGY7XG52YXIgQ1BfVCA9IDB4NTQ7XG52YXIgQ1BfWCA9IDB4NTg7XG52YXIgQ1BfWiA9IDB4NWE7XG5cbnZhciBDUF9hID0gMHg2MTtcbnZhciBDUF9iID0gMHg2MjtcbnZhciBDUF9vID0gMHg2ZjtcbnZhciBDUF90ID0gMHg3NDtcbnZhciBDUF94ID0gMHg3ODtcbnZhciBDUF96ID0gMHg3YTtcblxudmFyIFBJX0NPTlZfREVDID0gMHgzMDtcbnZhciBQSV9DT05WX1VDID0gMHgzNztcbnZhciBQSV9DT05WX0xDID0gMHg1NztcblxuXG4vKlxuICogQSBzdHJpY3RlciB2ZXJzaW9uIG9mIHBhcnNlSW50KCkgdGhhdCBwcm92aWRlcyBvcHRpb25zIGZvciBjaGFuZ2luZyB3aGF0XG4gKiBpcyBhbiBhY2NlcHRhYmxlIHN0cmluZyAoZm9yIGV4YW1wbGUsIGRpc2FsbG93aW5nIHRyYWlsaW5nIGNoYXJhY3RlcnMpLlxuICovXG5mdW5jdGlvbiBwYXJzZUludGVnZXIoc3RyLCB1b3B0cylcbntcblx0bW9kX2Fzc2VydC5zdHJpbmcoc3RyLCAnc3RyJyk7XG5cdG1vZF9hc3NlcnQub3B0aW9uYWxPYmplY3QodW9wdHMsICdvcHRpb25zJyk7XG5cblx0dmFyIGJhc2VPdmVycmlkZSA9IGZhbHNlO1xuXHR2YXIgb3B0aW9ucyA9IFBJX0RFRkFVTFRTO1xuXG5cdGlmICh1b3B0cykge1xuXHRcdGJhc2VPdmVycmlkZSA9IGhhc0tleSh1b3B0cywgJ2Jhc2UnKTtcblx0XHRvcHRpb25zID0gbWVyZ2VPYmplY3RzKG9wdGlvbnMsIHVvcHRzKTtcblx0XHRtb2RfYXNzZXJ0Lm51bWJlcihvcHRpb25zLmJhc2UsICdvcHRpb25zLmJhc2UnKTtcblx0XHRtb2RfYXNzZXJ0Lm9rKG9wdGlvbnMuYmFzZSA+PSAyLCAnb3B0aW9ucy5iYXNlID49IDInKTtcblx0XHRtb2RfYXNzZXJ0Lm9rKG9wdGlvbnMuYmFzZSA8PSAzNiwgJ29wdGlvbnMuYmFzZSA8PSAzNicpO1xuXHRcdG1vZF9hc3NlcnQuYm9vbChvcHRpb25zLmFsbG93U2lnbiwgJ29wdGlvbnMuYWxsb3dTaWduJyk7XG5cdFx0bW9kX2Fzc2VydC5ib29sKG9wdGlvbnMuYWxsb3dQcmVmaXgsICdvcHRpb25zLmFsbG93UHJlZml4Jyk7XG5cdFx0bW9kX2Fzc2VydC5ib29sKG9wdGlvbnMuYWxsb3dUcmFpbGluZyxcblx0XHQgICAgJ29wdGlvbnMuYWxsb3dUcmFpbGluZycpO1xuXHRcdG1vZF9hc3NlcnQuYm9vbChvcHRpb25zLmFsbG93SW1wcmVjaXNlLFxuXHRcdCAgICAnb3B0aW9ucy5hbGxvd0ltcHJlY2lzZScpO1xuXHRcdG1vZF9hc3NlcnQuYm9vbChvcHRpb25zLnRyaW1XaGl0ZXNwYWNlLFxuXHRcdCAgICAnb3B0aW9ucy50cmltV2hpdGVzcGFjZScpO1xuXHRcdG1vZF9hc3NlcnQuYm9vbChvcHRpb25zLmxlYWRpbmdaZXJvSXNPY3RhbCxcblx0XHQgICAgJ29wdGlvbnMubGVhZGluZ1plcm9Jc09jdGFsJyk7XG5cblx0XHRpZiAob3B0aW9ucy5sZWFkaW5nWmVyb0lzT2N0YWwpIHtcblx0XHRcdG1vZF9hc3NlcnQub2soIWJhc2VPdmVycmlkZSxcblx0XHRcdCAgICAnXCJiYXNlXCIgYW5kIFwibGVhZGluZ1plcm9Jc09jdGFsXCIgYXJlICcgK1xuXHRcdFx0ICAgICdtdXR1YWxseSBleGNsdXNpdmUnKTtcblx0XHR9XG5cdH1cblxuXHR2YXIgYztcblx0dmFyIHBiYXNlID0gLTE7XG5cdHZhciBiYXNlID0gb3B0aW9ucy5iYXNlO1xuXHR2YXIgc3RhcnQ7XG5cdHZhciBtdWx0ID0gMTtcblx0dmFyIHZhbHVlID0gMDtcblx0dmFyIGlkeCA9IDA7XG5cdHZhciBsZW4gPSBzdHIubGVuZ3RoO1xuXG5cdC8qIFRyaW0gYW55IHdoaXRlc3BhY2Ugb24gdGhlIGxlZnQgc2lkZS4gKi9cblx0aWYgKG9wdGlvbnMudHJpbVdoaXRlc3BhY2UpIHtcblx0XHR3aGlsZSAoaWR4IDwgbGVuICYmIGlzU3BhY2Uoc3RyLmNoYXJDb2RlQXQoaWR4KSkpIHtcblx0XHRcdCsraWR4O1xuXHRcdH1cblx0fVxuXG5cdC8qIENoZWNrIHRoZSBudW1iZXIgZm9yIGEgbGVhZGluZyBzaWduLiAqL1xuXHRpZiAob3B0aW9ucy5hbGxvd1NpZ24pIHtcblx0XHRpZiAoc3RyW2lkeF0gPT09ICctJykge1xuXHRcdFx0aWR4ICs9IDE7XG5cdFx0XHRtdWx0ID0gLTE7XG5cdFx0fSBlbHNlIGlmIChzdHJbaWR4XSA9PT0gJysnKSB7XG5cdFx0XHRpZHggKz0gMTtcblx0XHR9XG5cdH1cblxuXHQvKiBQYXJzZSB0aGUgYmFzZS1pbmRpY2F0aW5nIHByZWZpeCBpZiB0aGVyZSBpcyBvbmUuICovXG5cdGlmIChzdHJbaWR4XSA9PT0gJzAnKSB7XG5cdFx0aWYgKG9wdGlvbnMuYWxsb3dQcmVmaXgpIHtcblx0XHRcdHBiYXNlID0gcHJlZml4VG9CYXNlKHN0ci5jaGFyQ29kZUF0KGlkeCArIDEpKTtcblx0XHRcdGlmIChwYmFzZSAhPT0gLTEgJiYgKCFiYXNlT3ZlcnJpZGUgfHwgcGJhc2UgPT09IGJhc2UpKSB7XG5cdFx0XHRcdGJhc2UgPSBwYmFzZTtcblx0XHRcdFx0aWR4ICs9IDI7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKHBiYXNlID09PSAtMSAmJiBvcHRpb25zLmxlYWRpbmdaZXJvSXNPY3RhbCkge1xuXHRcdFx0YmFzZSA9IDg7XG5cdFx0fVxuXHR9XG5cblx0LyogUGFyc2UgdGhlIGFjdHVhbCBkaWdpdHMuICovXG5cdGZvciAoc3RhcnQgPSBpZHg7IGlkeCA8IGxlbjsgKytpZHgpIHtcblx0XHRjID0gdHJhbnNsYXRlRGlnaXQoc3RyLmNoYXJDb2RlQXQoaWR4KSk7XG5cdFx0aWYgKGMgIT09IC0xICYmIGMgPCBiYXNlKSB7XG5cdFx0XHR2YWx1ZSAqPSBiYXNlO1xuXHRcdFx0dmFsdWUgKz0gYztcblx0XHR9IGVsc2Uge1xuXHRcdFx0YnJlYWs7XG5cdFx0fVxuXHR9XG5cblx0LyogSWYgd2UgZGlkbid0IHBhcnNlIGFueSBkaWdpdHMsIHdlIGhhdmUgYW4gaW52YWxpZCBudW1iZXIuICovXG5cdGlmIChzdGFydCA9PT0gaWR4KSB7XG5cdFx0cmV0dXJuIChuZXcgRXJyb3IoJ2ludmFsaWQgbnVtYmVyOiAnICsgSlNPTi5zdHJpbmdpZnkoc3RyKSkpO1xuXHR9XG5cblx0LyogVHJpbSBhbnkgd2hpdGVzcGFjZSBvbiB0aGUgcmlnaHQgc2lkZS4gKi9cblx0aWYgKG9wdGlvbnMudHJpbVdoaXRlc3BhY2UpIHtcblx0XHR3aGlsZSAoaWR4IDwgbGVuICYmIGlzU3BhY2Uoc3RyLmNoYXJDb2RlQXQoaWR4KSkpIHtcblx0XHRcdCsraWR4O1xuXHRcdH1cblx0fVxuXG5cdC8qIENoZWNrIGZvciB0cmFpbGluZyBjaGFyYWN0ZXJzLiAqL1xuXHRpZiAoaWR4IDwgbGVuICYmICFvcHRpb25zLmFsbG93VHJhaWxpbmcpIHtcblx0XHRyZXR1cm4gKG5ldyBFcnJvcigndHJhaWxpbmcgY2hhcmFjdGVycyBhZnRlciBudW1iZXI6ICcgK1xuXHRcdCAgICBKU09OLnN0cmluZ2lmeShzdHIuc2xpY2UoaWR4KSkpKTtcblx0fVxuXG5cdC8qIElmIG91ciB2YWx1ZSBpcyAwLCB3ZSByZXR1cm4gbm93LCB0byBhdm9pZCByZXR1cm5pbmcgLTAuICovXG5cdGlmICh2YWx1ZSA9PT0gMCkge1xuXHRcdHJldHVybiAoMCk7XG5cdH1cblxuXHQvKiBDYWxjdWxhdGUgb3VyIGZpbmFsIHZhbHVlLiAqL1xuXHR2YXIgcmVzdWx0ID0gdmFsdWUgKiBtdWx0O1xuXG5cdC8qXG5cdCAqIElmIHRoZSBzdHJpbmcgcmVwcmVzZW50cyBhIHZhbHVlIHRoYXQgY2Fubm90IGJlIHByZWNpc2VseSByZXByZXNlbnRlZFxuXHQgKiBieSBKYXZhU2NyaXB0LCB0aGVuIHdlIHdhbnQgdG8gY2hlY2sgdGhhdDpcblx0ICpcblx0ICogLSBXZSBuZXZlciBpbmNyZWFzZWQgdGhlIHZhbHVlIHBhc3QgTUFYX1NBRkVfSU5URUdFUlxuXHQgKiAtIFdlIGRvbid0IG1ha2UgdGhlIHJlc3VsdCBuZWdhdGl2ZSBhbmQgYmVsb3cgTUlOX1NBRkVfSU5URUdFUlxuXHQgKlxuXHQgKiBCZWNhdXNlIHdlIG9ubHkgZXZlciBpbmNyZW1lbnQgdGhlIHZhbHVlIGR1cmluZyBwYXJzaW5nLCB0aGVyZSdzIG5vXG5cdCAqIGNoYW5jZSBvZiBtb3ZpbmcgcGFzdCBNQVhfU0FGRV9JTlRFR0VSIGFuZCB0aGVuIGRyb3BwaW5nIGJlbG93IGl0XG5cdCAqIGFnYWluLCBsb3NpbmcgcHJlY2lzaW9uIGluIHRoZSBwcm9jZXNzLiBUaGlzIG1lYW5zIHRoYXQgd2Ugb25seSBuZWVkXG5cdCAqIHRvIGRvIG91ciBjaGVja3MgaGVyZSwgYXQgdGhlIGVuZC5cblx0ICovXG5cdGlmICghb3B0aW9ucy5hbGxvd0ltcHJlY2lzZSAmJlxuXHQgICAgKHZhbHVlID4gTUFYX1NBRkVfSU5URUdFUiB8fCByZXN1bHQgPCBNSU5fU0FGRV9JTlRFR0VSKSkge1xuXHRcdHJldHVybiAobmV3IEVycm9yKCdudW1iZXIgaXMgb3V0c2lkZSBvZiB0aGUgc3VwcG9ydGVkIHJhbmdlOiAnICtcblx0XHQgICAgSlNPTi5zdHJpbmdpZnkoc3RyLnNsaWNlKHN0YXJ0LCBpZHgpKSkpO1xuXHR9XG5cblx0cmV0dXJuIChyZXN1bHQpO1xufVxuXG5cbi8qXG4gKiBJbnRlcnByZXQgYSBjaGFyYWN0ZXIgY29kZSBhcyBhIGJhc2UtMzYgZGlnaXQuXG4gKi9cbmZ1bmN0aW9uIHRyYW5zbGF0ZURpZ2l0KGQpXG57XG5cdGlmIChkID49IENQXzAgJiYgZCA8PSBDUF85KSB7XG5cdFx0LyogJzAnIHRvICc5JyAtPiAwIHRvIDkgKi9cblx0XHRyZXR1cm4gKGQgLSBQSV9DT05WX0RFQyk7XG5cdH0gZWxzZSBpZiAoZCA+PSBDUF9BICYmIGQgPD0gQ1BfWikge1xuXHRcdC8qICdBJyAtICdaJyAtPiAxMCB0byAzNSAqL1xuXHRcdHJldHVybiAoZCAtIFBJX0NPTlZfVUMpO1xuXHR9IGVsc2UgaWYgKGQgPj0gQ1BfYSAmJiBkIDw9IENQX3opIHtcblx0XHQvKiAnYScgLSAneicgLT4gMTAgdG8gMzUgKi9cblx0XHRyZXR1cm4gKGQgLSBQSV9DT05WX0xDKTtcblx0fSBlbHNlIHtcblx0XHQvKiBJbnZhbGlkIGNoYXJhY3RlciBjb2RlICovXG5cdFx0cmV0dXJuICgtMSk7XG5cdH1cbn1cblxuXG4vKlxuICogVGVzdCBpZiBhIHZhbHVlIG1hdGNoZXMgdGhlIEVDTUFTY3JpcHQgZGVmaW5pdGlvbiBvZiB0cmltbWFibGUgd2hpdGVzcGFjZS5cbiAqL1xuZnVuY3Rpb24gaXNTcGFjZShjKVxue1xuXHRyZXR1cm4gKGMgPT09IDB4MjApIHx8XG5cdCAgICAoYyA+PSAweDAwMDkgJiYgYyA8PSAweDAwMGQpIHx8XG5cdCAgICAoYyA9PT0gMHgwMGEwKSB8fFxuXHQgICAgKGMgPT09IDB4MTY4MCkgfHxcblx0ICAgIChjID09PSAweDE4MGUpIHx8XG5cdCAgICAoYyA+PSAweDIwMDAgJiYgYyA8PSAweDIwMGEpIHx8XG5cdCAgICAoYyA9PT0gMHgyMDI4KSB8fFxuXHQgICAgKGMgPT09IDB4MjAyOSkgfHxcblx0ICAgIChjID09PSAweDIwMmYpIHx8XG5cdCAgICAoYyA9PT0gMHgyMDVmKSB8fFxuXHQgICAgKGMgPT09IDB4MzAwMCkgfHxcblx0ICAgIChjID09PSAweGZlZmYpO1xufVxuXG5cbi8qXG4gKiBEZXRlcm1pbmUgd2hpY2ggYmFzZSBhIGNoYXJhY3RlciBpbmRpY2F0ZXMgKGUuZy4sICd4JyBpbmRpY2F0ZXMgaGV4KS5cbiAqL1xuZnVuY3Rpb24gcHJlZml4VG9CYXNlKGMpXG57XG5cdGlmIChjID09PSBDUF9iIHx8IGMgPT09IENQX0IpIHtcblx0XHQvKiAwYi8wQiAoYmluYXJ5KSAqL1xuXHRcdHJldHVybiAoMik7XG5cdH0gZWxzZSBpZiAoYyA9PT0gQ1BfbyB8fCBjID09PSBDUF9PKSB7XG5cdFx0LyogMG8vME8gKG9jdGFsKSAqL1xuXHRcdHJldHVybiAoOCk7XG5cdH0gZWxzZSBpZiAoYyA9PT0gQ1BfdCB8fCBjID09PSBDUF9UKSB7XG5cdFx0LyogMHQvMFQgKGRlY2ltYWwpICovXG5cdFx0cmV0dXJuICgxMCk7XG5cdH0gZWxzZSBpZiAoYyA9PT0gQ1BfeCB8fCBjID09PSBDUF9YKSB7XG5cdFx0LyogMHgvMFggKGhleGFkZWNpbWFsKSAqL1xuXHRcdHJldHVybiAoMTYpO1xuXHR9IGVsc2Uge1xuXHRcdC8qIE5vdCBhIG1lYW5pbmdmdWwgY2hhcmFjdGVyICovXG5cdFx0cmV0dXJuICgtMSk7XG5cdH1cbn1cblxuXG5mdW5jdGlvbiB2YWxpZGF0ZUpzb25PYmplY3RKUyhzY2hlbWEsIGlucHV0KVxue1xuXHR2YXIgcmVwb3J0ID0gbW9kX2pzb25zY2hlbWEudmFsaWRhdGUoaW5wdXQsIHNjaGVtYSk7XG5cblx0aWYgKHJlcG9ydC5lcnJvcnMubGVuZ3RoID09PSAwKVxuXHRcdHJldHVybiAobnVsbCk7XG5cblx0LyogQ3VycmVudGx5LCB3ZSBvbmx5IGRvIGFueXRoaW5nIHVzZWZ1bCB3aXRoIHRoZSBmaXJzdCBlcnJvci4gKi9cblx0dmFyIGVycm9yID0gcmVwb3J0LmVycm9yc1swXTtcblxuXHQvKiBUaGUgZmFpbGVkIHByb3BlcnR5IGlzIGdpdmVuIGJ5IGEgVVJJIHdpdGggYW4gaXJyZWxldmFudCBwcmVmaXguICovXG5cdHZhciBwcm9wbmFtZSA9IGVycm9yWydwcm9wZXJ0eSddO1xuXHR2YXIgcmVhc29uID0gZXJyb3JbJ21lc3NhZ2UnXS50b0xvd2VyQ2FzZSgpO1xuXHR2YXIgaSwgajtcblxuXHQvKlxuXHQgKiBUaGVyZSdzIGF0IGxlYXN0IG9uZSBjYXNlIHdoZXJlIHRoZSBwcm9wZXJ0eSBlcnJvciBtZXNzYWdlIGlzXG5cdCAqIGNvbmZ1c2luZyBhdCBiZXN0LiAgV2Ugd29yayBhcm91bmQgdGhpcyBoZXJlLlxuXHQgKi9cblx0aWYgKChpID0gcmVhc29uLmluZGV4T2YoJ3RoZSBwcm9wZXJ0eSAnKSkgIT0gLTEgJiZcblx0ICAgIChqID0gcmVhc29uLmluZGV4T2YoJyBpcyBub3QgZGVmaW5lZCBpbiB0aGUgc2NoZW1hIGFuZCB0aGUgJyArXG5cdCAgICAnc2NoZW1hIGRvZXMgbm90IGFsbG93IGFkZGl0aW9uYWwgcHJvcGVydGllcycpKSAhPSAtMSkge1xuXHRcdGkgKz0gJ3RoZSBwcm9wZXJ0eSAnLmxlbmd0aDtcblx0XHRpZiAocHJvcG5hbWUgPT09ICcnKVxuXHRcdFx0cHJvcG5hbWUgPSByZWFzb24uc3Vic3RyKGksIGogLSBpKTtcblx0XHRlbHNlXG5cdFx0XHRwcm9wbmFtZSA9IHByb3BuYW1lICsgJy4nICsgcmVhc29uLnN1YnN0cihpLCBqIC0gaSk7XG5cblx0XHRyZWFzb24gPSAndW5zdXBwb3J0ZWQgcHJvcGVydHknO1xuXHR9XG5cblx0dmFyIHJ2ID0gbmV3IG1vZF92ZXJyb3IuVkVycm9yKCdwcm9wZXJ0eSBcIiVzXCI6ICVzJywgcHJvcG5hbWUsIHJlYXNvbik7XG5cdHJ2Lmpzdl9kZXRhaWxzID0gZXJyb3I7XG5cdHJldHVybiAocnYpO1xufVxuXG5mdW5jdGlvbiByYW5kRWx0KGFycilcbntcblx0bW9kX2Fzc2VydC5vayhBcnJheS5pc0FycmF5KGFycikgJiYgYXJyLmxlbmd0aCA+IDAsXG5cdCAgICAncmFuZEVsdCBhcmd1bWVudCBtdXN0IGJlIGEgbm9uLWVtcHR5IGFycmF5Jyk7XG5cblx0cmV0dXJuIChhcnJbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogYXJyLmxlbmd0aCldKTtcbn1cblxuZnVuY3Rpb24gYXNzZXJ0SHJ0aW1lKGEpXG57XG5cdG1vZF9hc3NlcnQub2soYVswXSA+PSAwICYmIGFbMV0gPj0gMCxcblx0ICAgICduZWdhdGl2ZSBudW1iZXJzIG5vdCBhbGxvd2VkIGluIGhydGltZXMnKTtcblx0bW9kX2Fzc2VydC5vayhhWzFdIDwgMWU5LCAnbmFub3NlY29uZHMgY29sdW1uIG92ZXJmbG93Jyk7XG59XG5cbi8qXG4gKiBDb21wdXRlIHRoZSB0aW1lIGVsYXBzZWQgYmV0d2VlbiBocnRpbWUgcmVhZGluZ3MgQSBhbmQgQiwgd2hlcmUgQSBpcyBsYXRlclxuICogdGhhbiBCLiAgaHJ0aW1lIHJlYWRpbmdzIGNvbWUgZnJvbSBOb2RlJ3MgcHJvY2Vzcy5ocnRpbWUoKS4gIFRoZXJlIGlzIG5vXG4gKiBkZWZpbmVkIHdheSB0byByZXByZXNlbnQgbmVnYXRpdmUgZGVsdGFzLCBzbyBpdCdzIGlsbGVnYWwgdG8gZGlmZiBCIGZyb20gQVxuICogd2hlcmUgdGhlIHRpbWUgZGVub3RlZCBieSBCIGlzIGxhdGVyIHRoYW4gdGhlIHRpbWUgZGVub3RlZCBieSBBLiAgSWYgdGhpc1xuICogYmVjb21lcyB2YWx1YWJsZSwgd2UgY2FuIGRlZmluZSBhIHJlcHJlc2VudGF0aW9uIGFuZCBleHRlbmQgdGhlXG4gKiBpbXBsZW1lbnRhdGlvbiB0byBzdXBwb3J0IGl0LlxuICovXG5mdW5jdGlvbiBocnRpbWVEaWZmKGEsIGIpXG57XG5cdGFzc2VydEhydGltZShhKTtcblx0YXNzZXJ0SHJ0aW1lKGIpO1xuXHRtb2RfYXNzZXJ0Lm9rKGFbMF0gPiBiWzBdIHx8IChhWzBdID09IGJbMF0gJiYgYVsxXSA+PSBiWzFdKSxcblx0ICAgICduZWdhdGl2ZSBkaWZmZXJlbmNlcyBub3QgYWxsb3dlZCcpO1xuXG5cdHZhciBydiA9IFsgYVswXSAtIGJbMF0sIDAgXTtcblxuXHRpZiAoYVsxXSA+PSBiWzFdKSB7XG5cdFx0cnZbMV0gPSBhWzFdIC0gYlsxXTtcblx0fSBlbHNlIHtcblx0XHRydlswXS0tO1xuXHRcdHJ2WzFdID0gMWU5IC0gKGJbMV0gLSBhWzFdKTtcblx0fVxuXG5cdHJldHVybiAocnYpO1xufVxuXG4vKlxuICogQ29udmVydCBhIGhydGltZSByZWFkaW5nIGZyb20gdGhlIGFycmF5IGZvcm1hdCByZXR1cm5lZCBieSBOb2RlJ3NcbiAqIHByb2Nlc3MuaHJ0aW1lKCkgaW50byBhIHNjYWxhciBudW1iZXIgb2YgbmFub3NlY29uZHMuXG4gKi9cbmZ1bmN0aW9uIGhydGltZU5hbm9zZWMoYSlcbntcblx0YXNzZXJ0SHJ0aW1lKGEpO1xuXG5cdHJldHVybiAoTWF0aC5mbG9vcihhWzBdICogMWU5ICsgYVsxXSkpO1xufVxuXG4vKlxuICogQ29udmVydCBhIGhydGltZSByZWFkaW5nIGZyb20gdGhlIGFycmF5IGZvcm1hdCByZXR1cm5lZCBieSBOb2RlJ3NcbiAqIHByb2Nlc3MuaHJ0aW1lKCkgaW50byBhIHNjYWxhciBudW1iZXIgb2YgbWljcm9zZWNvbmRzLlxuICovXG5mdW5jdGlvbiBocnRpbWVNaWNyb3NlYyhhKVxue1xuXHRhc3NlcnRIcnRpbWUoYSk7XG5cblx0cmV0dXJuIChNYXRoLmZsb29yKGFbMF0gKiAxZTYgKyBhWzFdIC8gMWUzKSk7XG59XG5cbi8qXG4gKiBDb252ZXJ0IGEgaHJ0aW1lIHJlYWRpbmcgZnJvbSB0aGUgYXJyYXkgZm9ybWF0IHJldHVybmVkIGJ5IE5vZGUnc1xuICogcHJvY2Vzcy5ocnRpbWUoKSBpbnRvIGEgc2NhbGFyIG51bWJlciBvZiBtaWxsaXNlY29uZHMuXG4gKi9cbmZ1bmN0aW9uIGhydGltZU1pbGxpc2VjKGEpXG57XG5cdGFzc2VydEhydGltZShhKTtcblxuXHRyZXR1cm4gKE1hdGguZmxvb3IoYVswXSAqIDFlMyArIGFbMV0gLyAxZTYpKTtcbn1cblxuLypcbiAqIEFkZCB0d28gaHJ0aW1lIHJlYWRpbmdzIEEgYW5kIEIsIG92ZXJ3cml0aW5nIEEgd2l0aCB0aGUgcmVzdWx0IG9mIHRoZVxuICogYWRkaXRpb24uICBUaGlzIGZ1bmN0aW9uIGlzIHVzZWZ1bCBmb3IgYWNjdW11bGF0aW5nIHNldmVyYWwgaHJ0aW1lIGludGVydmFsc1xuICogaW50byBhIGNvdW50ZXIuICBSZXR1cm5zIEEuXG4gKi9cbmZ1bmN0aW9uIGhydGltZUFjY3VtKGEsIGIpXG57XG5cdGFzc2VydEhydGltZShhKTtcblx0YXNzZXJ0SHJ0aW1lKGIpO1xuXG5cdC8qXG5cdCAqIEFjY3VtdWxhdGUgdGhlIG5hbm9zZWNvbmQgY29tcG9uZW50LlxuXHQgKi9cblx0YVsxXSArPSBiWzFdO1xuXHRpZiAoYVsxXSA+PSAxZTkpIHtcblx0XHQvKlxuXHRcdCAqIFRoZSBuYW5vc2Vjb25kIGNvbXBvbmVudCBvdmVyZmxvd2VkLCBzbyBjYXJyeSB0byB0aGUgc2Vjb25kc1xuXHRcdCAqIGZpZWxkLlxuXHRcdCAqL1xuXHRcdGFbMF0rKztcblx0XHRhWzFdIC09IDFlOTtcblx0fVxuXG5cdC8qXG5cdCAqIEFjY3VtdWxhdGUgdGhlIHNlY29uZHMgY29tcG9uZW50LlxuXHQgKi9cblx0YVswXSArPSBiWzBdO1xuXG5cdHJldHVybiAoYSk7XG59XG5cbi8qXG4gKiBBZGQgdHdvIGhydGltZSByZWFkaW5ncyBBIGFuZCBCLCByZXR1cm5pbmcgdGhlIHJlc3VsdCBhcyBhIG5ldyBocnRpbWUgYXJyYXkuXG4gKiBEb2VzIG5vdCBtb2RpZnkgZWl0aGVyIGlucHV0IGFyZ3VtZW50LlxuICovXG5mdW5jdGlvbiBocnRpbWVBZGQoYSwgYilcbntcblx0YXNzZXJ0SHJ0aW1lKGEpO1xuXG5cdHZhciBydiA9IFsgYVswXSwgYVsxXSBdO1xuXG5cdHJldHVybiAoaHJ0aW1lQWNjdW0ocnYsIGIpKTtcbn1cblxuXG4vKlxuICogQ2hlY2sgYW4gb2JqZWN0IGZvciB1bmV4cGVjdGVkIHByb3BlcnRpZXMuICBBY2NlcHRzIHRoZSBvYmplY3QgdG8gY2hlY2ssIGFuZFxuICogYW4gYXJyYXkgb2YgYWxsb3dlZCBwcm9wZXJ0eSBuYW1lcyAoc3RyaW5ncykuICBSZXR1cm5zIGFuIGFycmF5IG9mIGtleSBuYW1lc1xuICogdGhhdCB3ZXJlIGZvdW5kIG9uIHRoZSBvYmplY3QsIGJ1dCBkaWQgbm90IGFwcGVhciBpbiB0aGUgbGlzdCBvZiBhbGxvd2VkXG4gKiBwcm9wZXJ0aWVzLiAgSWYgbm8gcHJvcGVydGllcyB3ZXJlIGZvdW5kLCB0aGUgcmV0dXJuZWQgYXJyYXkgd2lsbCBiZSBvZlxuICogemVybyBsZW5ndGguXG4gKi9cbmZ1bmN0aW9uIGV4dHJhUHJvcGVydGllcyhvYmosIGFsbG93ZWQpXG57XG5cdG1vZF9hc3NlcnQub2sodHlwZW9mIChvYmopID09PSAnb2JqZWN0JyAmJiBvYmogIT09IG51bGwsXG5cdCAgICAnb2JqIGFyZ3VtZW50IG11c3QgYmUgYSBub24tbnVsbCBvYmplY3QnKTtcblx0bW9kX2Fzc2VydC5vayhBcnJheS5pc0FycmF5KGFsbG93ZWQpLFxuXHQgICAgJ2FsbG93ZWQgYXJndW1lbnQgbXVzdCBiZSBhbiBhcnJheSBvZiBzdHJpbmdzJyk7XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgYWxsb3dlZC5sZW5ndGg7IGkrKykge1xuXHRcdG1vZF9hc3NlcnQub2sodHlwZW9mIChhbGxvd2VkW2ldKSA9PT0gJ3N0cmluZycsXG5cdFx0ICAgICdhbGxvd2VkIGFyZ3VtZW50IG11c3QgYmUgYW4gYXJyYXkgb2Ygc3RyaW5ncycpO1xuXHR9XG5cblx0cmV0dXJuIChPYmplY3Qua2V5cyhvYmopLmZpbHRlcihmdW5jdGlvbiAoa2V5KSB7XG5cdFx0cmV0dXJuIChhbGxvd2VkLmluZGV4T2Yoa2V5KSA9PT0gLTEpO1xuXHR9KSk7XG59XG5cbi8qXG4gKiBHaXZlbiB0aHJlZSBzZXRzIG9mIHByb3BlcnRpZXMgXCJwcm92aWRlZFwiIChtYXkgYmUgdW5kZWZpbmVkKSwgXCJvdmVycmlkZXNcIlxuICogKHJlcXVpcmVkKSwgYW5kIFwiZGVmYXVsdHNcIiAobWF5IGJlIHVuZGVmaW5lZCksIGNvbnN0cnVjdCBhbiBvYmplY3QgY29udGFpbmluZ1xuICogdGhlIHVuaW9uIG9mIHRoZXNlIHNldHMgd2l0aCBcIm92ZXJyaWRlc1wiIG92ZXJyaWRpbmcgXCJwcm92aWRlZFwiLCBhbmRcbiAqIFwicHJvdmlkZWRcIiBvdmVycmlkaW5nIFwiZGVmYXVsdHNcIi4gIE5vbmUgb2YgdGhlIGlucHV0IG9iamVjdHMgYXJlIG1vZGlmaWVkLlxuICovXG5mdW5jdGlvbiBtZXJnZU9iamVjdHMocHJvdmlkZWQsIG92ZXJyaWRlcywgZGVmYXVsdHMpXG57XG5cdHZhciBydiwgaztcblxuXHRydiA9IHt9O1xuXHRpZiAoZGVmYXVsdHMpIHtcblx0XHRmb3IgKGsgaW4gZGVmYXVsdHMpXG5cdFx0XHRydltrXSA9IGRlZmF1bHRzW2tdO1xuXHR9XG5cblx0aWYgKHByb3ZpZGVkKSB7XG5cdFx0Zm9yIChrIGluIHByb3ZpZGVkKVxuXHRcdFx0cnZba10gPSBwcm92aWRlZFtrXTtcblx0fVxuXG5cdGlmIChvdmVycmlkZXMpIHtcblx0XHRmb3IgKGsgaW4gb3ZlcnJpZGVzKVxuXHRcdFx0cnZba10gPSBvdmVycmlkZXNba107XG5cdH1cblxuXHRyZXR1cm4gKHJ2KTtcbn1cbiJdLCJzb3VyY2VSb290IjoiIn0=