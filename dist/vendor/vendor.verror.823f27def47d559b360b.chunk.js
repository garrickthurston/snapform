(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["vendor/vendor.verror"],{

/***/ "HSFs":
/*!*******************************************!*\
  !*** ./node_modules/verror/lib/verror.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
 * verror.js: richer JavaScript errors
 */

var mod_assertplus = __webpack_require__(/*! assert-plus */ "60GX");
var mod_util = __webpack_require__(/*! util */ "7tlc");

var mod_extsprintf = __webpack_require__(/*! extsprintf */ "6Iok");
var mod_isError = __webpack_require__(/*! core-util-is */ "Onz0").isError;
var sprintf = mod_extsprintf.sprintf;

/*
 * Public interface
 */

/* So you can 'var VError = require('verror')' */
module.exports = VError;
/* For compatibility */
VError.VError = VError;
/* Other exported classes */
VError.SError = SError;
VError.WError = WError;
VError.MultiError = MultiError;

/*
 * Common function used to parse constructor arguments for VError, WError, and
 * SError.  Named arguments to this function:
 *
 *     strict		force strict interpretation of sprintf arguments, even
 *     			if the options in "argv" don't say so
 *
 *     argv		error's constructor arguments, which are to be
 *     			interpreted as described in README.md.  For quick
 *     			reference, "argv" has one of the following forms:
 *
 *          [ sprintf_args... ]           (argv[0] is a string)
 *          [ cause, sprintf_args... ]    (argv[0] is an Error)
 *          [ options, sprintf_args... ]  (argv[0] is an object)
 *
 * This function normalizes these forms, producing an object with the following
 * properties:
 *
 *    options           equivalent to "options" in third form.  This will never
 *    			be a direct reference to what the caller passed in
 *    			(i.e., it may be a shallow copy), so it can be freely
 *    			modified.
 *
 *    shortmessage      result of sprintf(sprintf_args), taking options.strict
 *    			into account as described in README.md.
 */
function parseConstructorArguments(args)
{
	var argv, options, sprintf_args, shortmessage, k;

	mod_assertplus.object(args, 'args');
	mod_assertplus.bool(args.strict, 'args.strict');
	mod_assertplus.array(args.argv, 'args.argv');
	argv = args.argv;

	/*
	 * First, figure out which form of invocation we've been given.
	 */
	if (argv.length === 0) {
		options = {};
		sprintf_args = [];
	} else if (mod_isError(argv[0])) {
		options = { 'cause': argv[0] };
		sprintf_args = argv.slice(1);
	} else if (typeof (argv[0]) === 'object') {
		options = {};
		for (k in argv[0]) {
			options[k] = argv[0][k];
		}
		sprintf_args = argv.slice(1);
	} else {
		mod_assertplus.string(argv[0],
		    'first argument to VError, SError, or WError ' +
		    'constructor must be a string, object, or Error');
		options = {};
		sprintf_args = argv;
	}

	/*
	 * Now construct the error's message.
	 *
	 * extsprintf (which we invoke here with our caller's arguments in order
	 * to construct this Error's message) is strict in its interpretation of
	 * values to be processed by the "%s" specifier.  The value passed to
	 * extsprintf must actually be a string or something convertible to a
	 * String using .toString().  Passing other values (notably "null" and
	 * "undefined") is considered a programmer error.  The assumption is
	 * that if you actually want to print the string "null" or "undefined",
	 * then that's easy to do that when you're calling extsprintf; on the
	 * other hand, if you did NOT want that (i.e., there's actually a bug
	 * where the program assumes some variable is non-null and tries to
	 * print it, which might happen when constructing a packet or file in
	 * some specific format), then it's better to stop immediately than
	 * produce bogus output.
	 *
	 * However, sometimes the bug is only in the code calling VError, and a
	 * programmer might prefer to have the error message contain "null" or
	 * "undefined" rather than have the bug in the error path crash the
	 * program (making the first bug harder to identify).  For that reason,
	 * by default VError converts "null" or "undefined" arguments to their
	 * string representations and passes those to extsprintf.  Programmers
	 * desiring the strict behavior can use the SError class or pass the
	 * "strict" option to the VError constructor.
	 */
	mod_assertplus.object(options);
	if (!options.strict && !args.strict) {
		sprintf_args = sprintf_args.map(function (a) {
			return (a === null ? 'null' :
			    a === undefined ? 'undefined' : a);
		});
	}

	if (sprintf_args.length === 0) {
		shortmessage = '';
	} else {
		shortmessage = sprintf.apply(null, sprintf_args);
	}

	return ({
	    'options': options,
	    'shortmessage': shortmessage
	});
}

/*
 * See README.md for reference documentation.
 */
function VError()
{
	var args, obj, parsed, cause, ctor, message, k;

	args = Array.prototype.slice.call(arguments, 0);

	/*
	 * This is a regrettable pattern, but JavaScript's built-in Error class
	 * is defined to work this way, so we allow the constructor to be called
	 * without "new".
	 */
	if (!(this instanceof VError)) {
		obj = Object.create(VError.prototype);
		VError.apply(obj, arguments);
		return (obj);
	}

	/*
	 * For convenience and backwards compatibility, we support several
	 * different calling forms.  Normalize them here.
	 */
	parsed = parseConstructorArguments({
	    'argv': args,
	    'strict': false
	});

	/*
	 * If we've been given a name, apply it now.
	 */
	if (parsed.options.name) {
		mod_assertplus.string(parsed.options.name,
		    'error\'s "name" must be a string');
		this.name = parsed.options.name;
	}

	/*
	 * For debugging, we keep track of the original short message (attached
	 * this Error particularly) separately from the complete message (which
	 * includes the messages of our cause chain).
	 */
	this.jse_shortmsg = parsed.shortmessage;
	message = parsed.shortmessage;

	/*
	 * If we've been given a cause, record a reference to it and update our
	 * message appropriately.
	 */
	cause = parsed.options.cause;
	if (cause) {
		mod_assertplus.ok(mod_isError(cause), 'cause is not an Error');
		this.jse_cause = cause;

		if (!parsed.options.skipCauseMessage) {
			message += ': ' + cause.message;
		}
	}

	/*
	 * If we've been given an object with properties, shallow-copy that
	 * here.  We don't want to use a deep copy in case there are non-plain
	 * objects here, but we don't want to use the original object in case
	 * the caller modifies it later.
	 */
	this.jse_info = {};
	if (parsed.options.info) {
		for (k in parsed.options.info) {
			this.jse_info[k] = parsed.options.info[k];
		}
	}

	this.message = message;
	Error.call(this, message);

	if (Error.captureStackTrace) {
		ctor = parsed.options.constructorOpt || this.constructor;
		Error.captureStackTrace(this, ctor);
	}

	return (this);
}

mod_util.inherits(VError, Error);
VError.prototype.name = 'VError';

VError.prototype.toString = function ve_toString()
{
	var str = (this.hasOwnProperty('name') && this.name ||
		this.constructor.name || this.constructor.prototype.name);
	if (this.message)
		str += ': ' + this.message;

	return (str);
};

/*
 * This method is provided for compatibility.  New callers should use
 * VError.cause() instead.  That method also uses the saner `null` return value
 * when there is no cause.
 */
VError.prototype.cause = function ve_cause()
{
	var cause = VError.cause(this);
	return (cause === null ? undefined : cause);
};

/*
 * Static methods
 *
 * These class-level methods are provided so that callers can use them on
 * instances of Errors that are not VErrors.  New interfaces should be provided
 * only using static methods to eliminate the class of programming mistake where
 * people fail to check whether the Error object has the corresponding methods.
 */

VError.cause = function (err)
{
	mod_assertplus.ok(mod_isError(err), 'err must be an Error');
	return (mod_isError(err.jse_cause) ? err.jse_cause : null);
};

VError.info = function (err)
{
	var rv, cause, k;

	mod_assertplus.ok(mod_isError(err), 'err must be an Error');
	cause = VError.cause(err);
	if (cause !== null) {
		rv = VError.info(cause);
	} else {
		rv = {};
	}

	if (typeof (err.jse_info) == 'object' && err.jse_info !== null) {
		for (k in err.jse_info) {
			rv[k] = err.jse_info[k];
		}
	}

	return (rv);
};

VError.findCauseByName = function (err, name)
{
	var cause;

	mod_assertplus.ok(mod_isError(err), 'err must be an Error');
	mod_assertplus.string(name, 'name');
	mod_assertplus.ok(name.length > 0, 'name cannot be empty');

	for (cause = err; cause !== null; cause = VError.cause(cause)) {
		mod_assertplus.ok(mod_isError(cause));
		if (cause.name == name) {
			return (cause);
		}
	}

	return (null);
};

VError.hasCauseWithName = function (err, name)
{
	return (VError.findCauseByName(err, name) !== null);
};

VError.fullStack = function (err)
{
	mod_assertplus.ok(mod_isError(err), 'err must be an Error');

	var cause = VError.cause(err);

	if (cause) {
		return (err.stack + '\ncaused by: ' + VError.fullStack(cause));
	}

	return (err.stack);
};

VError.errorFromList = function (errors)
{
	mod_assertplus.arrayOfObject(errors, 'errors');

	if (errors.length === 0) {
		return (null);
	}

	errors.forEach(function (e) {
		mod_assertplus.ok(mod_isError(e));
	});

	if (errors.length == 1) {
		return (errors[0]);
	}

	return (new MultiError(errors));
};

VError.errorForEach = function (err, func)
{
	mod_assertplus.ok(mod_isError(err), 'err must be an Error');
	mod_assertplus.func(func, 'func');

	if (err instanceof MultiError) {
		err.errors().forEach(function iterError(e) { func(e); });
	} else {
		func(err);
	}
};


/*
 * SError is like VError, but stricter about types.  You cannot pass "null" or
 * "undefined" as string arguments to the formatter.
 */
function SError()
{
	var args, obj, parsed, options;

	args = Array.prototype.slice.call(arguments, 0);
	if (!(this instanceof SError)) {
		obj = Object.create(SError.prototype);
		SError.apply(obj, arguments);
		return (obj);
	}

	parsed = parseConstructorArguments({
	    'argv': args,
	    'strict': true
	});

	options = parsed.options;
	VError.call(this, options, '%s', parsed.shortmessage);

	return (this);
}

/*
 * We don't bother setting SError.prototype.name because once constructed,
 * SErrors are just like VErrors.
 */
mod_util.inherits(SError, VError);


/*
 * Represents a collection of errors for the purpose of consumers that generally
 * only deal with one error.  Callers can extract the individual errors
 * contained in this object, but may also just treat it as a normal single
 * error, in which case a summary message will be printed.
 */
function MultiError(errors)
{
	mod_assertplus.array(errors, 'list of errors');
	mod_assertplus.ok(errors.length > 0, 'must be at least one error');
	this.ase_errors = errors;

	VError.call(this, {
	    'cause': errors[0]
	}, 'first of %d error%s', errors.length, errors.length == 1 ? '' : 's');
}

mod_util.inherits(MultiError, VError);
MultiError.prototype.name = 'MultiError';

MultiError.prototype.errors = function me_errors()
{
	return (this.ase_errors.slice(0));
};


/*
 * See README.md for reference details.
 */
function WError()
{
	var args, obj, parsed, options;

	args = Array.prototype.slice.call(arguments, 0);
	if (!(this instanceof WError)) {
		obj = Object.create(WError.prototype);
		WError.apply(obj, args);
		return (obj);
	}

	parsed = parseConstructorArguments({
	    'argv': args,
	    'strict': false
	});

	options = parsed.options;
	options['skipCauseMessage'] = true;
	VError.call(this, options, '%s', parsed.shortmessage);

	return (this);
}

mod_util.inherits(WError, VError);
WError.prototype.name = 'WError';

WError.prototype.toString = function we_toString()
{
	var str = (this.hasOwnProperty('name') && this.name ||
		this.constructor.name || this.constructor.prototype.name);
	if (this.message)
		str += ': ' + this.message;
	if (this.jse_cause && this.jse_cause.message)
		str += '; caused by ' + this.jse_cause.toString();

	return (str);
};

/*
 * For purely historical reasons, WError's cause() function allows you to set
 * the cause.
 */
WError.prototype.cause = function we_cause(c)
{
	if (mod_isError(c))
		this.jse_cause = c;

	return (this.jse_cause);
};


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdmVycm9yL2xpYi92ZXJyb3IuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBOztBQUVBLHFCQUFxQixtQkFBTyxDQUFDLHlCQUFhO0FBQzFDLGVBQWUsbUJBQU8sQ0FBQyxrQkFBTTs7QUFFN0IscUJBQXFCLG1CQUFPLENBQUMsd0JBQVk7QUFDekMsa0JBQWtCLG1CQUFPLENBQUMsMEJBQWM7QUFDeEM7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0YsYUFBYTtBQUNiO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0RBQStEO0FBQy9EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFOztBQUVGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLGtCQUFrQixnQkFBZ0I7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxFQUFFOztBQUVGO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOENBQThDLFNBQVMsRUFBRTtBQUN6RCxFQUFFO0FBQ0Y7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsRUFBRTs7QUFFRjtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsRUFBRTtBQUNGOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsRUFBRTs7QUFFRjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVzs7QUFFWDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSIsImZpbGUiOiJ2ZW5kb3IvdmVuZG9yLnZlcnJvci44MjNmMjdkZWY0N2Q1NTliMzYwYi5jaHVuay5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiB2ZXJyb3IuanM6IHJpY2hlciBKYXZhU2NyaXB0IGVycm9yc1xuICovXG5cbnZhciBtb2RfYXNzZXJ0cGx1cyA9IHJlcXVpcmUoJ2Fzc2VydC1wbHVzJyk7XG52YXIgbW9kX3V0aWwgPSByZXF1aXJlKCd1dGlsJyk7XG5cbnZhciBtb2RfZXh0c3ByaW50ZiA9IHJlcXVpcmUoJ2V4dHNwcmludGYnKTtcbnZhciBtb2RfaXNFcnJvciA9IHJlcXVpcmUoJ2NvcmUtdXRpbC1pcycpLmlzRXJyb3I7XG52YXIgc3ByaW50ZiA9IG1vZF9leHRzcHJpbnRmLnNwcmludGY7XG5cbi8qXG4gKiBQdWJsaWMgaW50ZXJmYWNlXG4gKi9cblxuLyogU28geW91IGNhbiAndmFyIFZFcnJvciA9IHJlcXVpcmUoJ3ZlcnJvcicpJyAqL1xubW9kdWxlLmV4cG9ydHMgPSBWRXJyb3I7XG4vKiBGb3IgY29tcGF0aWJpbGl0eSAqL1xuVkVycm9yLlZFcnJvciA9IFZFcnJvcjtcbi8qIE90aGVyIGV4cG9ydGVkIGNsYXNzZXMgKi9cblZFcnJvci5TRXJyb3IgPSBTRXJyb3I7XG5WRXJyb3IuV0Vycm9yID0gV0Vycm9yO1xuVkVycm9yLk11bHRpRXJyb3IgPSBNdWx0aUVycm9yO1xuXG4vKlxuICogQ29tbW9uIGZ1bmN0aW9uIHVzZWQgdG8gcGFyc2UgY29uc3RydWN0b3IgYXJndW1lbnRzIGZvciBWRXJyb3IsIFdFcnJvciwgYW5kXG4gKiBTRXJyb3IuICBOYW1lZCBhcmd1bWVudHMgdG8gdGhpcyBmdW5jdGlvbjpcbiAqXG4gKiAgICAgc3RyaWN0XHRcdGZvcmNlIHN0cmljdCBpbnRlcnByZXRhdGlvbiBvZiBzcHJpbnRmIGFyZ3VtZW50cywgZXZlblxuICogICAgIFx0XHRcdGlmIHRoZSBvcHRpb25zIGluIFwiYXJndlwiIGRvbid0IHNheSBzb1xuICpcbiAqICAgICBhcmd2XHRcdGVycm9yJ3MgY29uc3RydWN0b3IgYXJndW1lbnRzLCB3aGljaCBhcmUgdG8gYmVcbiAqICAgICBcdFx0XHRpbnRlcnByZXRlZCBhcyBkZXNjcmliZWQgaW4gUkVBRE1FLm1kLiAgRm9yIHF1aWNrXG4gKiAgICAgXHRcdFx0cmVmZXJlbmNlLCBcImFyZ3ZcIiBoYXMgb25lIG9mIHRoZSBmb2xsb3dpbmcgZm9ybXM6XG4gKlxuICogICAgICAgICAgWyBzcHJpbnRmX2FyZ3MuLi4gXSAgICAgICAgICAgKGFyZ3ZbMF0gaXMgYSBzdHJpbmcpXG4gKiAgICAgICAgICBbIGNhdXNlLCBzcHJpbnRmX2FyZ3MuLi4gXSAgICAoYXJndlswXSBpcyBhbiBFcnJvcilcbiAqICAgICAgICAgIFsgb3B0aW9ucywgc3ByaW50Zl9hcmdzLi4uIF0gIChhcmd2WzBdIGlzIGFuIG9iamVjdClcbiAqXG4gKiBUaGlzIGZ1bmN0aW9uIG5vcm1hbGl6ZXMgdGhlc2UgZm9ybXMsIHByb2R1Y2luZyBhbiBvYmplY3Qgd2l0aCB0aGUgZm9sbG93aW5nXG4gKiBwcm9wZXJ0aWVzOlxuICpcbiAqICAgIG9wdGlvbnMgICAgICAgICAgIGVxdWl2YWxlbnQgdG8gXCJvcHRpb25zXCIgaW4gdGhpcmQgZm9ybS4gIFRoaXMgd2lsbCBuZXZlclxuICogICAgXHRcdFx0YmUgYSBkaXJlY3QgcmVmZXJlbmNlIHRvIHdoYXQgdGhlIGNhbGxlciBwYXNzZWQgaW5cbiAqICAgIFx0XHRcdChpLmUuLCBpdCBtYXkgYmUgYSBzaGFsbG93IGNvcHkpLCBzbyBpdCBjYW4gYmUgZnJlZWx5XG4gKiAgICBcdFx0XHRtb2RpZmllZC5cbiAqXG4gKiAgICBzaG9ydG1lc3NhZ2UgICAgICByZXN1bHQgb2Ygc3ByaW50ZihzcHJpbnRmX2FyZ3MpLCB0YWtpbmcgb3B0aW9ucy5zdHJpY3RcbiAqICAgIFx0XHRcdGludG8gYWNjb3VudCBhcyBkZXNjcmliZWQgaW4gUkVBRE1FLm1kLlxuICovXG5mdW5jdGlvbiBwYXJzZUNvbnN0cnVjdG9yQXJndW1lbnRzKGFyZ3MpXG57XG5cdHZhciBhcmd2LCBvcHRpb25zLCBzcHJpbnRmX2FyZ3MsIHNob3J0bWVzc2FnZSwgaztcblxuXHRtb2RfYXNzZXJ0cGx1cy5vYmplY3QoYXJncywgJ2FyZ3MnKTtcblx0bW9kX2Fzc2VydHBsdXMuYm9vbChhcmdzLnN0cmljdCwgJ2FyZ3Muc3RyaWN0Jyk7XG5cdG1vZF9hc3NlcnRwbHVzLmFycmF5KGFyZ3MuYXJndiwgJ2FyZ3MuYXJndicpO1xuXHRhcmd2ID0gYXJncy5hcmd2O1xuXG5cdC8qXG5cdCAqIEZpcnN0LCBmaWd1cmUgb3V0IHdoaWNoIGZvcm0gb2YgaW52b2NhdGlvbiB3ZSd2ZSBiZWVuIGdpdmVuLlxuXHQgKi9cblx0aWYgKGFyZ3YubGVuZ3RoID09PSAwKSB7XG5cdFx0b3B0aW9ucyA9IHt9O1xuXHRcdHNwcmludGZfYXJncyA9IFtdO1xuXHR9IGVsc2UgaWYgKG1vZF9pc0Vycm9yKGFyZ3ZbMF0pKSB7XG5cdFx0b3B0aW9ucyA9IHsgJ2NhdXNlJzogYXJndlswXSB9O1xuXHRcdHNwcmludGZfYXJncyA9IGFyZ3Yuc2xpY2UoMSk7XG5cdH0gZWxzZSBpZiAodHlwZW9mIChhcmd2WzBdKSA9PT0gJ29iamVjdCcpIHtcblx0XHRvcHRpb25zID0ge307XG5cdFx0Zm9yIChrIGluIGFyZ3ZbMF0pIHtcblx0XHRcdG9wdGlvbnNba10gPSBhcmd2WzBdW2tdO1xuXHRcdH1cblx0XHRzcHJpbnRmX2FyZ3MgPSBhcmd2LnNsaWNlKDEpO1xuXHR9IGVsc2Uge1xuXHRcdG1vZF9hc3NlcnRwbHVzLnN0cmluZyhhcmd2WzBdLFxuXHRcdCAgICAnZmlyc3QgYXJndW1lbnQgdG8gVkVycm9yLCBTRXJyb3IsIG9yIFdFcnJvciAnICtcblx0XHQgICAgJ2NvbnN0cnVjdG9yIG11c3QgYmUgYSBzdHJpbmcsIG9iamVjdCwgb3IgRXJyb3InKTtcblx0XHRvcHRpb25zID0ge307XG5cdFx0c3ByaW50Zl9hcmdzID0gYXJndjtcblx0fVxuXG5cdC8qXG5cdCAqIE5vdyBjb25zdHJ1Y3QgdGhlIGVycm9yJ3MgbWVzc2FnZS5cblx0ICpcblx0ICogZXh0c3ByaW50ZiAod2hpY2ggd2UgaW52b2tlIGhlcmUgd2l0aCBvdXIgY2FsbGVyJ3MgYXJndW1lbnRzIGluIG9yZGVyXG5cdCAqIHRvIGNvbnN0cnVjdCB0aGlzIEVycm9yJ3MgbWVzc2FnZSkgaXMgc3RyaWN0IGluIGl0cyBpbnRlcnByZXRhdGlvbiBvZlxuXHQgKiB2YWx1ZXMgdG8gYmUgcHJvY2Vzc2VkIGJ5IHRoZSBcIiVzXCIgc3BlY2lmaWVyLiAgVGhlIHZhbHVlIHBhc3NlZCB0b1xuXHQgKiBleHRzcHJpbnRmIG11c3QgYWN0dWFsbHkgYmUgYSBzdHJpbmcgb3Igc29tZXRoaW5nIGNvbnZlcnRpYmxlIHRvIGFcblx0ICogU3RyaW5nIHVzaW5nIC50b1N0cmluZygpLiAgUGFzc2luZyBvdGhlciB2YWx1ZXMgKG5vdGFibHkgXCJudWxsXCIgYW5kXG5cdCAqIFwidW5kZWZpbmVkXCIpIGlzIGNvbnNpZGVyZWQgYSBwcm9ncmFtbWVyIGVycm9yLiAgVGhlIGFzc3VtcHRpb24gaXNcblx0ICogdGhhdCBpZiB5b3UgYWN0dWFsbHkgd2FudCB0byBwcmludCB0aGUgc3RyaW5nIFwibnVsbFwiIG9yIFwidW5kZWZpbmVkXCIsXG5cdCAqIHRoZW4gdGhhdCdzIGVhc3kgdG8gZG8gdGhhdCB3aGVuIHlvdSdyZSBjYWxsaW5nIGV4dHNwcmludGY7IG9uIHRoZVxuXHQgKiBvdGhlciBoYW5kLCBpZiB5b3UgZGlkIE5PVCB3YW50IHRoYXQgKGkuZS4sIHRoZXJlJ3MgYWN0dWFsbHkgYSBidWdcblx0ICogd2hlcmUgdGhlIHByb2dyYW0gYXNzdW1lcyBzb21lIHZhcmlhYmxlIGlzIG5vbi1udWxsIGFuZCB0cmllcyB0b1xuXHQgKiBwcmludCBpdCwgd2hpY2ggbWlnaHQgaGFwcGVuIHdoZW4gY29uc3RydWN0aW5nIGEgcGFja2V0IG9yIGZpbGUgaW5cblx0ICogc29tZSBzcGVjaWZpYyBmb3JtYXQpLCB0aGVuIGl0J3MgYmV0dGVyIHRvIHN0b3AgaW1tZWRpYXRlbHkgdGhhblxuXHQgKiBwcm9kdWNlIGJvZ3VzIG91dHB1dC5cblx0ICpcblx0ICogSG93ZXZlciwgc29tZXRpbWVzIHRoZSBidWcgaXMgb25seSBpbiB0aGUgY29kZSBjYWxsaW5nIFZFcnJvciwgYW5kIGFcblx0ICogcHJvZ3JhbW1lciBtaWdodCBwcmVmZXIgdG8gaGF2ZSB0aGUgZXJyb3IgbWVzc2FnZSBjb250YWluIFwibnVsbFwiIG9yXG5cdCAqIFwidW5kZWZpbmVkXCIgcmF0aGVyIHRoYW4gaGF2ZSB0aGUgYnVnIGluIHRoZSBlcnJvciBwYXRoIGNyYXNoIHRoZVxuXHQgKiBwcm9ncmFtIChtYWtpbmcgdGhlIGZpcnN0IGJ1ZyBoYXJkZXIgdG8gaWRlbnRpZnkpLiAgRm9yIHRoYXQgcmVhc29uLFxuXHQgKiBieSBkZWZhdWx0IFZFcnJvciBjb252ZXJ0cyBcIm51bGxcIiBvciBcInVuZGVmaW5lZFwiIGFyZ3VtZW50cyB0byB0aGVpclxuXHQgKiBzdHJpbmcgcmVwcmVzZW50YXRpb25zIGFuZCBwYXNzZXMgdGhvc2UgdG8gZXh0c3ByaW50Zi4gIFByb2dyYW1tZXJzXG5cdCAqIGRlc2lyaW5nIHRoZSBzdHJpY3QgYmVoYXZpb3IgY2FuIHVzZSB0aGUgU0Vycm9yIGNsYXNzIG9yIHBhc3MgdGhlXG5cdCAqIFwic3RyaWN0XCIgb3B0aW9uIHRvIHRoZSBWRXJyb3IgY29uc3RydWN0b3IuXG5cdCAqL1xuXHRtb2RfYXNzZXJ0cGx1cy5vYmplY3Qob3B0aW9ucyk7XG5cdGlmICghb3B0aW9ucy5zdHJpY3QgJiYgIWFyZ3Muc3RyaWN0KSB7XG5cdFx0c3ByaW50Zl9hcmdzID0gc3ByaW50Zl9hcmdzLm1hcChmdW5jdGlvbiAoYSkge1xuXHRcdFx0cmV0dXJuIChhID09PSBudWxsID8gJ251bGwnIDpcblx0XHRcdCAgICBhID09PSB1bmRlZmluZWQgPyAndW5kZWZpbmVkJyA6IGEpO1xuXHRcdH0pO1xuXHR9XG5cblx0aWYgKHNwcmludGZfYXJncy5sZW5ndGggPT09IDApIHtcblx0XHRzaG9ydG1lc3NhZ2UgPSAnJztcblx0fSBlbHNlIHtcblx0XHRzaG9ydG1lc3NhZ2UgPSBzcHJpbnRmLmFwcGx5KG51bGwsIHNwcmludGZfYXJncyk7XG5cdH1cblxuXHRyZXR1cm4gKHtcblx0ICAgICdvcHRpb25zJzogb3B0aW9ucyxcblx0ICAgICdzaG9ydG1lc3NhZ2UnOiBzaG9ydG1lc3NhZ2Vcblx0fSk7XG59XG5cbi8qXG4gKiBTZWUgUkVBRE1FLm1kIGZvciByZWZlcmVuY2UgZG9jdW1lbnRhdGlvbi5cbiAqL1xuZnVuY3Rpb24gVkVycm9yKClcbntcblx0dmFyIGFyZ3MsIG9iaiwgcGFyc2VkLCBjYXVzZSwgY3RvciwgbWVzc2FnZSwgaztcblxuXHRhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKTtcblxuXHQvKlxuXHQgKiBUaGlzIGlzIGEgcmVncmV0dGFibGUgcGF0dGVybiwgYnV0IEphdmFTY3JpcHQncyBidWlsdC1pbiBFcnJvciBjbGFzc1xuXHQgKiBpcyBkZWZpbmVkIHRvIHdvcmsgdGhpcyB3YXksIHNvIHdlIGFsbG93IHRoZSBjb25zdHJ1Y3RvciB0byBiZSBjYWxsZWRcblx0ICogd2l0aG91dCBcIm5ld1wiLlxuXHQgKi9cblx0aWYgKCEodGhpcyBpbnN0YW5jZW9mIFZFcnJvcikpIHtcblx0XHRvYmogPSBPYmplY3QuY3JlYXRlKFZFcnJvci5wcm90b3R5cGUpO1xuXHRcdFZFcnJvci5hcHBseShvYmosIGFyZ3VtZW50cyk7XG5cdFx0cmV0dXJuIChvYmopO1xuXHR9XG5cblx0Lypcblx0ICogRm9yIGNvbnZlbmllbmNlIGFuZCBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eSwgd2Ugc3VwcG9ydCBzZXZlcmFsXG5cdCAqIGRpZmZlcmVudCBjYWxsaW5nIGZvcm1zLiAgTm9ybWFsaXplIHRoZW0gaGVyZS5cblx0ICovXG5cdHBhcnNlZCA9IHBhcnNlQ29uc3RydWN0b3JBcmd1bWVudHMoe1xuXHQgICAgJ2FyZ3YnOiBhcmdzLFxuXHQgICAgJ3N0cmljdCc6IGZhbHNlXG5cdH0pO1xuXG5cdC8qXG5cdCAqIElmIHdlJ3ZlIGJlZW4gZ2l2ZW4gYSBuYW1lLCBhcHBseSBpdCBub3cuXG5cdCAqL1xuXHRpZiAocGFyc2VkLm9wdGlvbnMubmFtZSkge1xuXHRcdG1vZF9hc3NlcnRwbHVzLnN0cmluZyhwYXJzZWQub3B0aW9ucy5uYW1lLFxuXHRcdCAgICAnZXJyb3JcXCdzIFwibmFtZVwiIG11c3QgYmUgYSBzdHJpbmcnKTtcblx0XHR0aGlzLm5hbWUgPSBwYXJzZWQub3B0aW9ucy5uYW1lO1xuXHR9XG5cblx0Lypcblx0ICogRm9yIGRlYnVnZ2luZywgd2Uga2VlcCB0cmFjayBvZiB0aGUgb3JpZ2luYWwgc2hvcnQgbWVzc2FnZSAoYXR0YWNoZWRcblx0ICogdGhpcyBFcnJvciBwYXJ0aWN1bGFybHkpIHNlcGFyYXRlbHkgZnJvbSB0aGUgY29tcGxldGUgbWVzc2FnZSAod2hpY2hcblx0ICogaW5jbHVkZXMgdGhlIG1lc3NhZ2VzIG9mIG91ciBjYXVzZSBjaGFpbikuXG5cdCAqL1xuXHR0aGlzLmpzZV9zaG9ydG1zZyA9IHBhcnNlZC5zaG9ydG1lc3NhZ2U7XG5cdG1lc3NhZ2UgPSBwYXJzZWQuc2hvcnRtZXNzYWdlO1xuXG5cdC8qXG5cdCAqIElmIHdlJ3ZlIGJlZW4gZ2l2ZW4gYSBjYXVzZSwgcmVjb3JkIGEgcmVmZXJlbmNlIHRvIGl0IGFuZCB1cGRhdGUgb3VyXG5cdCAqIG1lc3NhZ2UgYXBwcm9wcmlhdGVseS5cblx0ICovXG5cdGNhdXNlID0gcGFyc2VkLm9wdGlvbnMuY2F1c2U7XG5cdGlmIChjYXVzZSkge1xuXHRcdG1vZF9hc3NlcnRwbHVzLm9rKG1vZF9pc0Vycm9yKGNhdXNlKSwgJ2NhdXNlIGlzIG5vdCBhbiBFcnJvcicpO1xuXHRcdHRoaXMuanNlX2NhdXNlID0gY2F1c2U7XG5cblx0XHRpZiAoIXBhcnNlZC5vcHRpb25zLnNraXBDYXVzZU1lc3NhZ2UpIHtcblx0XHRcdG1lc3NhZ2UgKz0gJzogJyArIGNhdXNlLm1lc3NhZ2U7XG5cdFx0fVxuXHR9XG5cblx0Lypcblx0ICogSWYgd2UndmUgYmVlbiBnaXZlbiBhbiBvYmplY3Qgd2l0aCBwcm9wZXJ0aWVzLCBzaGFsbG93LWNvcHkgdGhhdFxuXHQgKiBoZXJlLiAgV2UgZG9uJ3Qgd2FudCB0byB1c2UgYSBkZWVwIGNvcHkgaW4gY2FzZSB0aGVyZSBhcmUgbm9uLXBsYWluXG5cdCAqIG9iamVjdHMgaGVyZSwgYnV0IHdlIGRvbid0IHdhbnQgdG8gdXNlIHRoZSBvcmlnaW5hbCBvYmplY3QgaW4gY2FzZVxuXHQgKiB0aGUgY2FsbGVyIG1vZGlmaWVzIGl0IGxhdGVyLlxuXHQgKi9cblx0dGhpcy5qc2VfaW5mbyA9IHt9O1xuXHRpZiAocGFyc2VkLm9wdGlvbnMuaW5mbykge1xuXHRcdGZvciAoayBpbiBwYXJzZWQub3B0aW9ucy5pbmZvKSB7XG5cdFx0XHR0aGlzLmpzZV9pbmZvW2tdID0gcGFyc2VkLm9wdGlvbnMuaW5mb1trXTtcblx0XHR9XG5cdH1cblxuXHR0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xuXHRFcnJvci5jYWxsKHRoaXMsIG1lc3NhZ2UpO1xuXG5cdGlmIChFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSkge1xuXHRcdGN0b3IgPSBwYXJzZWQub3B0aW9ucy5jb25zdHJ1Y3Rvck9wdCB8fCB0aGlzLmNvbnN0cnVjdG9yO1xuXHRcdEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKHRoaXMsIGN0b3IpO1xuXHR9XG5cblx0cmV0dXJuICh0aGlzKTtcbn1cblxubW9kX3V0aWwuaW5oZXJpdHMoVkVycm9yLCBFcnJvcik7XG5WRXJyb3IucHJvdG90eXBlLm5hbWUgPSAnVkVycm9yJztcblxuVkVycm9yLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uIHZlX3RvU3RyaW5nKClcbntcblx0dmFyIHN0ciA9ICh0aGlzLmhhc093blByb3BlcnR5KCduYW1lJykgJiYgdGhpcy5uYW1lIHx8XG5cdFx0dGhpcy5jb25zdHJ1Y3Rvci5uYW1lIHx8IHRoaXMuY29uc3RydWN0b3IucHJvdG90eXBlLm5hbWUpO1xuXHRpZiAodGhpcy5tZXNzYWdlKVxuXHRcdHN0ciArPSAnOiAnICsgdGhpcy5tZXNzYWdlO1xuXG5cdHJldHVybiAoc3RyKTtcbn07XG5cbi8qXG4gKiBUaGlzIG1ldGhvZCBpcyBwcm92aWRlZCBmb3IgY29tcGF0aWJpbGl0eS4gIE5ldyBjYWxsZXJzIHNob3VsZCB1c2VcbiAqIFZFcnJvci5jYXVzZSgpIGluc3RlYWQuICBUaGF0IG1ldGhvZCBhbHNvIHVzZXMgdGhlIHNhbmVyIGBudWxsYCByZXR1cm4gdmFsdWVcbiAqIHdoZW4gdGhlcmUgaXMgbm8gY2F1c2UuXG4gKi9cblZFcnJvci5wcm90b3R5cGUuY2F1c2UgPSBmdW5jdGlvbiB2ZV9jYXVzZSgpXG57XG5cdHZhciBjYXVzZSA9IFZFcnJvci5jYXVzZSh0aGlzKTtcblx0cmV0dXJuIChjYXVzZSA9PT0gbnVsbCA/IHVuZGVmaW5lZCA6IGNhdXNlKTtcbn07XG5cbi8qXG4gKiBTdGF0aWMgbWV0aG9kc1xuICpcbiAqIFRoZXNlIGNsYXNzLWxldmVsIG1ldGhvZHMgYXJlIHByb3ZpZGVkIHNvIHRoYXQgY2FsbGVycyBjYW4gdXNlIHRoZW0gb25cbiAqIGluc3RhbmNlcyBvZiBFcnJvcnMgdGhhdCBhcmUgbm90IFZFcnJvcnMuICBOZXcgaW50ZXJmYWNlcyBzaG91bGQgYmUgcHJvdmlkZWRcbiAqIG9ubHkgdXNpbmcgc3RhdGljIG1ldGhvZHMgdG8gZWxpbWluYXRlIHRoZSBjbGFzcyBvZiBwcm9ncmFtbWluZyBtaXN0YWtlIHdoZXJlXG4gKiBwZW9wbGUgZmFpbCB0byBjaGVjayB3aGV0aGVyIHRoZSBFcnJvciBvYmplY3QgaGFzIHRoZSBjb3JyZXNwb25kaW5nIG1ldGhvZHMuXG4gKi9cblxuVkVycm9yLmNhdXNlID0gZnVuY3Rpb24gKGVycilcbntcblx0bW9kX2Fzc2VydHBsdXMub2sobW9kX2lzRXJyb3IoZXJyKSwgJ2VyciBtdXN0IGJlIGFuIEVycm9yJyk7XG5cdHJldHVybiAobW9kX2lzRXJyb3IoZXJyLmpzZV9jYXVzZSkgPyBlcnIuanNlX2NhdXNlIDogbnVsbCk7XG59O1xuXG5WRXJyb3IuaW5mbyA9IGZ1bmN0aW9uIChlcnIpXG57XG5cdHZhciBydiwgY2F1c2UsIGs7XG5cblx0bW9kX2Fzc2VydHBsdXMub2sobW9kX2lzRXJyb3IoZXJyKSwgJ2VyciBtdXN0IGJlIGFuIEVycm9yJyk7XG5cdGNhdXNlID0gVkVycm9yLmNhdXNlKGVycik7XG5cdGlmIChjYXVzZSAhPT0gbnVsbCkge1xuXHRcdHJ2ID0gVkVycm9yLmluZm8oY2F1c2UpO1xuXHR9IGVsc2Uge1xuXHRcdHJ2ID0ge307XG5cdH1cblxuXHRpZiAodHlwZW9mIChlcnIuanNlX2luZm8pID09ICdvYmplY3QnICYmIGVyci5qc2VfaW5mbyAhPT0gbnVsbCkge1xuXHRcdGZvciAoayBpbiBlcnIuanNlX2luZm8pIHtcblx0XHRcdHJ2W2tdID0gZXJyLmpzZV9pbmZvW2tdO1xuXHRcdH1cblx0fVxuXG5cdHJldHVybiAocnYpO1xufTtcblxuVkVycm9yLmZpbmRDYXVzZUJ5TmFtZSA9IGZ1bmN0aW9uIChlcnIsIG5hbWUpXG57XG5cdHZhciBjYXVzZTtcblxuXHRtb2RfYXNzZXJ0cGx1cy5vayhtb2RfaXNFcnJvcihlcnIpLCAnZXJyIG11c3QgYmUgYW4gRXJyb3InKTtcblx0bW9kX2Fzc2VydHBsdXMuc3RyaW5nKG5hbWUsICduYW1lJyk7XG5cdG1vZF9hc3NlcnRwbHVzLm9rKG5hbWUubGVuZ3RoID4gMCwgJ25hbWUgY2Fubm90IGJlIGVtcHR5Jyk7XG5cblx0Zm9yIChjYXVzZSA9IGVycjsgY2F1c2UgIT09IG51bGw7IGNhdXNlID0gVkVycm9yLmNhdXNlKGNhdXNlKSkge1xuXHRcdG1vZF9hc3NlcnRwbHVzLm9rKG1vZF9pc0Vycm9yKGNhdXNlKSk7XG5cdFx0aWYgKGNhdXNlLm5hbWUgPT0gbmFtZSkge1xuXHRcdFx0cmV0dXJuIChjYXVzZSk7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIChudWxsKTtcbn07XG5cblZFcnJvci5oYXNDYXVzZVdpdGhOYW1lID0gZnVuY3Rpb24gKGVyciwgbmFtZSlcbntcblx0cmV0dXJuIChWRXJyb3IuZmluZENhdXNlQnlOYW1lKGVyciwgbmFtZSkgIT09IG51bGwpO1xufTtcblxuVkVycm9yLmZ1bGxTdGFjayA9IGZ1bmN0aW9uIChlcnIpXG57XG5cdG1vZF9hc3NlcnRwbHVzLm9rKG1vZF9pc0Vycm9yKGVyciksICdlcnIgbXVzdCBiZSBhbiBFcnJvcicpO1xuXG5cdHZhciBjYXVzZSA9IFZFcnJvci5jYXVzZShlcnIpO1xuXG5cdGlmIChjYXVzZSkge1xuXHRcdHJldHVybiAoZXJyLnN0YWNrICsgJ1xcbmNhdXNlZCBieTogJyArIFZFcnJvci5mdWxsU3RhY2soY2F1c2UpKTtcblx0fVxuXG5cdHJldHVybiAoZXJyLnN0YWNrKTtcbn07XG5cblZFcnJvci5lcnJvckZyb21MaXN0ID0gZnVuY3Rpb24gKGVycm9ycylcbntcblx0bW9kX2Fzc2VydHBsdXMuYXJyYXlPZk9iamVjdChlcnJvcnMsICdlcnJvcnMnKTtcblxuXHRpZiAoZXJyb3JzLmxlbmd0aCA9PT0gMCkge1xuXHRcdHJldHVybiAobnVsbCk7XG5cdH1cblxuXHRlcnJvcnMuZm9yRWFjaChmdW5jdGlvbiAoZSkge1xuXHRcdG1vZF9hc3NlcnRwbHVzLm9rKG1vZF9pc0Vycm9yKGUpKTtcblx0fSk7XG5cblx0aWYgKGVycm9ycy5sZW5ndGggPT0gMSkge1xuXHRcdHJldHVybiAoZXJyb3JzWzBdKTtcblx0fVxuXG5cdHJldHVybiAobmV3IE11bHRpRXJyb3IoZXJyb3JzKSk7XG59O1xuXG5WRXJyb3IuZXJyb3JGb3JFYWNoID0gZnVuY3Rpb24gKGVyciwgZnVuYylcbntcblx0bW9kX2Fzc2VydHBsdXMub2sobW9kX2lzRXJyb3IoZXJyKSwgJ2VyciBtdXN0IGJlIGFuIEVycm9yJyk7XG5cdG1vZF9hc3NlcnRwbHVzLmZ1bmMoZnVuYywgJ2Z1bmMnKTtcblxuXHRpZiAoZXJyIGluc3RhbmNlb2YgTXVsdGlFcnJvcikge1xuXHRcdGVyci5lcnJvcnMoKS5mb3JFYWNoKGZ1bmN0aW9uIGl0ZXJFcnJvcihlKSB7IGZ1bmMoZSk7IH0pO1xuXHR9IGVsc2Uge1xuXHRcdGZ1bmMoZXJyKTtcblx0fVxufTtcblxuXG4vKlxuICogU0Vycm9yIGlzIGxpa2UgVkVycm9yLCBidXQgc3RyaWN0ZXIgYWJvdXQgdHlwZXMuICBZb3UgY2Fubm90IHBhc3MgXCJudWxsXCIgb3JcbiAqIFwidW5kZWZpbmVkXCIgYXMgc3RyaW5nIGFyZ3VtZW50cyB0byB0aGUgZm9ybWF0dGVyLlxuICovXG5mdW5jdGlvbiBTRXJyb3IoKVxue1xuXHR2YXIgYXJncywgb2JqLCBwYXJzZWQsIG9wdGlvbnM7XG5cblx0YXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMCk7XG5cdGlmICghKHRoaXMgaW5zdGFuY2VvZiBTRXJyb3IpKSB7XG5cdFx0b2JqID0gT2JqZWN0LmNyZWF0ZShTRXJyb3IucHJvdG90eXBlKTtcblx0XHRTRXJyb3IuYXBwbHkob2JqLCBhcmd1bWVudHMpO1xuXHRcdHJldHVybiAob2JqKTtcblx0fVxuXG5cdHBhcnNlZCA9IHBhcnNlQ29uc3RydWN0b3JBcmd1bWVudHMoe1xuXHQgICAgJ2FyZ3YnOiBhcmdzLFxuXHQgICAgJ3N0cmljdCc6IHRydWVcblx0fSk7XG5cblx0b3B0aW9ucyA9IHBhcnNlZC5vcHRpb25zO1xuXHRWRXJyb3IuY2FsbCh0aGlzLCBvcHRpb25zLCAnJXMnLCBwYXJzZWQuc2hvcnRtZXNzYWdlKTtcblxuXHRyZXR1cm4gKHRoaXMpO1xufVxuXG4vKlxuICogV2UgZG9uJ3QgYm90aGVyIHNldHRpbmcgU0Vycm9yLnByb3RvdHlwZS5uYW1lIGJlY2F1c2Ugb25jZSBjb25zdHJ1Y3RlZCxcbiAqIFNFcnJvcnMgYXJlIGp1c3QgbGlrZSBWRXJyb3JzLlxuICovXG5tb2RfdXRpbC5pbmhlcml0cyhTRXJyb3IsIFZFcnJvcik7XG5cblxuLypcbiAqIFJlcHJlc2VudHMgYSBjb2xsZWN0aW9uIG9mIGVycm9ycyBmb3IgdGhlIHB1cnBvc2Ugb2YgY29uc3VtZXJzIHRoYXQgZ2VuZXJhbGx5XG4gKiBvbmx5IGRlYWwgd2l0aCBvbmUgZXJyb3IuICBDYWxsZXJzIGNhbiBleHRyYWN0IHRoZSBpbmRpdmlkdWFsIGVycm9yc1xuICogY29udGFpbmVkIGluIHRoaXMgb2JqZWN0LCBidXQgbWF5IGFsc28ganVzdCB0cmVhdCBpdCBhcyBhIG5vcm1hbCBzaW5nbGVcbiAqIGVycm9yLCBpbiB3aGljaCBjYXNlIGEgc3VtbWFyeSBtZXNzYWdlIHdpbGwgYmUgcHJpbnRlZC5cbiAqL1xuZnVuY3Rpb24gTXVsdGlFcnJvcihlcnJvcnMpXG57XG5cdG1vZF9hc3NlcnRwbHVzLmFycmF5KGVycm9ycywgJ2xpc3Qgb2YgZXJyb3JzJyk7XG5cdG1vZF9hc3NlcnRwbHVzLm9rKGVycm9ycy5sZW5ndGggPiAwLCAnbXVzdCBiZSBhdCBsZWFzdCBvbmUgZXJyb3InKTtcblx0dGhpcy5hc2VfZXJyb3JzID0gZXJyb3JzO1xuXG5cdFZFcnJvci5jYWxsKHRoaXMsIHtcblx0ICAgICdjYXVzZSc6IGVycm9yc1swXVxuXHR9LCAnZmlyc3Qgb2YgJWQgZXJyb3IlcycsIGVycm9ycy5sZW5ndGgsIGVycm9ycy5sZW5ndGggPT0gMSA/ICcnIDogJ3MnKTtcbn1cblxubW9kX3V0aWwuaW5oZXJpdHMoTXVsdGlFcnJvciwgVkVycm9yKTtcbk11bHRpRXJyb3IucHJvdG90eXBlLm5hbWUgPSAnTXVsdGlFcnJvcic7XG5cbk11bHRpRXJyb3IucHJvdG90eXBlLmVycm9ycyA9IGZ1bmN0aW9uIG1lX2Vycm9ycygpXG57XG5cdHJldHVybiAodGhpcy5hc2VfZXJyb3JzLnNsaWNlKDApKTtcbn07XG5cblxuLypcbiAqIFNlZSBSRUFETUUubWQgZm9yIHJlZmVyZW5jZSBkZXRhaWxzLlxuICovXG5mdW5jdGlvbiBXRXJyb3IoKVxue1xuXHR2YXIgYXJncywgb2JqLCBwYXJzZWQsIG9wdGlvbnM7XG5cblx0YXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMCk7XG5cdGlmICghKHRoaXMgaW5zdGFuY2VvZiBXRXJyb3IpKSB7XG5cdFx0b2JqID0gT2JqZWN0LmNyZWF0ZShXRXJyb3IucHJvdG90eXBlKTtcblx0XHRXRXJyb3IuYXBwbHkob2JqLCBhcmdzKTtcblx0XHRyZXR1cm4gKG9iaik7XG5cdH1cblxuXHRwYXJzZWQgPSBwYXJzZUNvbnN0cnVjdG9yQXJndW1lbnRzKHtcblx0ICAgICdhcmd2JzogYXJncyxcblx0ICAgICdzdHJpY3QnOiBmYWxzZVxuXHR9KTtcblxuXHRvcHRpb25zID0gcGFyc2VkLm9wdGlvbnM7XG5cdG9wdGlvbnNbJ3NraXBDYXVzZU1lc3NhZ2UnXSA9IHRydWU7XG5cdFZFcnJvci5jYWxsKHRoaXMsIG9wdGlvbnMsICclcycsIHBhcnNlZC5zaG9ydG1lc3NhZ2UpO1xuXG5cdHJldHVybiAodGhpcyk7XG59XG5cbm1vZF91dGlsLmluaGVyaXRzKFdFcnJvciwgVkVycm9yKTtcbldFcnJvci5wcm90b3R5cGUubmFtZSA9ICdXRXJyb3InO1xuXG5XRXJyb3IucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gd2VfdG9TdHJpbmcoKVxue1xuXHR2YXIgc3RyID0gKHRoaXMuaGFzT3duUHJvcGVydHkoJ25hbWUnKSAmJiB0aGlzLm5hbWUgfHxcblx0XHR0aGlzLmNvbnN0cnVjdG9yLm5hbWUgfHwgdGhpcy5jb25zdHJ1Y3Rvci5wcm90b3R5cGUubmFtZSk7XG5cdGlmICh0aGlzLm1lc3NhZ2UpXG5cdFx0c3RyICs9ICc6ICcgKyB0aGlzLm1lc3NhZ2U7XG5cdGlmICh0aGlzLmpzZV9jYXVzZSAmJiB0aGlzLmpzZV9jYXVzZS5tZXNzYWdlKVxuXHRcdHN0ciArPSAnOyBjYXVzZWQgYnkgJyArIHRoaXMuanNlX2NhdXNlLnRvU3RyaW5nKCk7XG5cblx0cmV0dXJuIChzdHIpO1xufTtcblxuLypcbiAqIEZvciBwdXJlbHkgaGlzdG9yaWNhbCByZWFzb25zLCBXRXJyb3IncyBjYXVzZSgpIGZ1bmN0aW9uIGFsbG93cyB5b3UgdG8gc2V0XG4gKiB0aGUgY2F1c2UuXG4gKi9cbldFcnJvci5wcm90b3R5cGUuY2F1c2UgPSBmdW5jdGlvbiB3ZV9jYXVzZShjKVxue1xuXHRpZiAobW9kX2lzRXJyb3IoYykpXG5cdFx0dGhpcy5qc2VfY2F1c2UgPSBjO1xuXG5cdHJldHVybiAodGhpcy5qc2VfY2F1c2UpO1xufTtcbiJdLCJzb3VyY2VSb290IjoiIn0=