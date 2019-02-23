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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdmVycm9yL2xpYi92ZXJyb3IuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBOztBQUVBLHFCQUFxQixtQkFBTyxDQUFDLHlCQUFhO0FBQzFDLGVBQWUsbUJBQU8sQ0FBQyxrQkFBTTs7QUFFN0IscUJBQXFCLG1CQUFPLENBQUMsd0JBQVk7QUFDekMsa0JBQWtCLG1CQUFPLENBQUMsMEJBQWM7QUFDeEM7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0YsYUFBYTtBQUNiO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0RBQStEO0FBQy9EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFOztBQUVGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLGtCQUFrQixnQkFBZ0I7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxFQUFFOztBQUVGO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOENBQThDLFNBQVMsRUFBRTtBQUN6RCxFQUFFO0FBQ0Y7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsRUFBRTs7QUFFRjtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsRUFBRTtBQUNGOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsRUFBRTs7QUFFRjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVzs7QUFFWDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSIsImZpbGUiOiJidWlsZC92ZW5kb3IvdmVuZG9yLnZlcnJvci5jZjJiOWVmMTE3MGYxZTBjZTVhMy5jaHVuay5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiAqIHZlcnJvci5qczogcmljaGVyIEphdmFTY3JpcHQgZXJyb3JzXHJcbiAqL1xyXG5cclxudmFyIG1vZF9hc3NlcnRwbHVzID0gcmVxdWlyZSgnYXNzZXJ0LXBsdXMnKTtcclxudmFyIG1vZF91dGlsID0gcmVxdWlyZSgndXRpbCcpO1xyXG5cclxudmFyIG1vZF9leHRzcHJpbnRmID0gcmVxdWlyZSgnZXh0c3ByaW50ZicpO1xyXG52YXIgbW9kX2lzRXJyb3IgPSByZXF1aXJlKCdjb3JlLXV0aWwtaXMnKS5pc0Vycm9yO1xyXG52YXIgc3ByaW50ZiA9IG1vZF9leHRzcHJpbnRmLnNwcmludGY7XHJcblxyXG4vKlxyXG4gKiBQdWJsaWMgaW50ZXJmYWNlXHJcbiAqL1xyXG5cclxuLyogU28geW91IGNhbiAndmFyIFZFcnJvciA9IHJlcXVpcmUoJ3ZlcnJvcicpJyAqL1xyXG5tb2R1bGUuZXhwb3J0cyA9IFZFcnJvcjtcclxuLyogRm9yIGNvbXBhdGliaWxpdHkgKi9cclxuVkVycm9yLlZFcnJvciA9IFZFcnJvcjtcclxuLyogT3RoZXIgZXhwb3J0ZWQgY2xhc3NlcyAqL1xyXG5WRXJyb3IuU0Vycm9yID0gU0Vycm9yO1xyXG5WRXJyb3IuV0Vycm9yID0gV0Vycm9yO1xyXG5WRXJyb3IuTXVsdGlFcnJvciA9IE11bHRpRXJyb3I7XHJcblxyXG4vKlxyXG4gKiBDb21tb24gZnVuY3Rpb24gdXNlZCB0byBwYXJzZSBjb25zdHJ1Y3RvciBhcmd1bWVudHMgZm9yIFZFcnJvciwgV0Vycm9yLCBhbmRcclxuICogU0Vycm9yLiAgTmFtZWQgYXJndW1lbnRzIHRvIHRoaXMgZnVuY3Rpb246XHJcbiAqXHJcbiAqICAgICBzdHJpY3RcdFx0Zm9yY2Ugc3RyaWN0IGludGVycHJldGF0aW9uIG9mIHNwcmludGYgYXJndW1lbnRzLCBldmVuXHJcbiAqICAgICBcdFx0XHRpZiB0aGUgb3B0aW9ucyBpbiBcImFyZ3ZcIiBkb24ndCBzYXkgc29cclxuICpcclxuICogICAgIGFyZ3ZcdFx0ZXJyb3IncyBjb25zdHJ1Y3RvciBhcmd1bWVudHMsIHdoaWNoIGFyZSB0byBiZVxyXG4gKiAgICAgXHRcdFx0aW50ZXJwcmV0ZWQgYXMgZGVzY3JpYmVkIGluIFJFQURNRS5tZC4gIEZvciBxdWlja1xyXG4gKiAgICAgXHRcdFx0cmVmZXJlbmNlLCBcImFyZ3ZcIiBoYXMgb25lIG9mIHRoZSBmb2xsb3dpbmcgZm9ybXM6XHJcbiAqXHJcbiAqICAgICAgICAgIFsgc3ByaW50Zl9hcmdzLi4uIF0gICAgICAgICAgIChhcmd2WzBdIGlzIGEgc3RyaW5nKVxyXG4gKiAgICAgICAgICBbIGNhdXNlLCBzcHJpbnRmX2FyZ3MuLi4gXSAgICAoYXJndlswXSBpcyBhbiBFcnJvcilcclxuICogICAgICAgICAgWyBvcHRpb25zLCBzcHJpbnRmX2FyZ3MuLi4gXSAgKGFyZ3ZbMF0gaXMgYW4gb2JqZWN0KVxyXG4gKlxyXG4gKiBUaGlzIGZ1bmN0aW9uIG5vcm1hbGl6ZXMgdGhlc2UgZm9ybXMsIHByb2R1Y2luZyBhbiBvYmplY3Qgd2l0aCB0aGUgZm9sbG93aW5nXHJcbiAqIHByb3BlcnRpZXM6XHJcbiAqXHJcbiAqICAgIG9wdGlvbnMgICAgICAgICAgIGVxdWl2YWxlbnQgdG8gXCJvcHRpb25zXCIgaW4gdGhpcmQgZm9ybS4gIFRoaXMgd2lsbCBuZXZlclxyXG4gKiAgICBcdFx0XHRiZSBhIGRpcmVjdCByZWZlcmVuY2UgdG8gd2hhdCB0aGUgY2FsbGVyIHBhc3NlZCBpblxyXG4gKiAgICBcdFx0XHQoaS5lLiwgaXQgbWF5IGJlIGEgc2hhbGxvdyBjb3B5KSwgc28gaXQgY2FuIGJlIGZyZWVseVxyXG4gKiAgICBcdFx0XHRtb2RpZmllZC5cclxuICpcclxuICogICAgc2hvcnRtZXNzYWdlICAgICAgcmVzdWx0IG9mIHNwcmludGYoc3ByaW50Zl9hcmdzKSwgdGFraW5nIG9wdGlvbnMuc3RyaWN0XHJcbiAqICAgIFx0XHRcdGludG8gYWNjb3VudCBhcyBkZXNjcmliZWQgaW4gUkVBRE1FLm1kLlxyXG4gKi9cclxuZnVuY3Rpb24gcGFyc2VDb25zdHJ1Y3RvckFyZ3VtZW50cyhhcmdzKVxyXG57XHJcblx0dmFyIGFyZ3YsIG9wdGlvbnMsIHNwcmludGZfYXJncywgc2hvcnRtZXNzYWdlLCBrO1xyXG5cclxuXHRtb2RfYXNzZXJ0cGx1cy5vYmplY3QoYXJncywgJ2FyZ3MnKTtcclxuXHRtb2RfYXNzZXJ0cGx1cy5ib29sKGFyZ3Muc3RyaWN0LCAnYXJncy5zdHJpY3QnKTtcclxuXHRtb2RfYXNzZXJ0cGx1cy5hcnJheShhcmdzLmFyZ3YsICdhcmdzLmFyZ3YnKTtcclxuXHRhcmd2ID0gYXJncy5hcmd2O1xyXG5cclxuXHQvKlxyXG5cdCAqIEZpcnN0LCBmaWd1cmUgb3V0IHdoaWNoIGZvcm0gb2YgaW52b2NhdGlvbiB3ZSd2ZSBiZWVuIGdpdmVuLlxyXG5cdCAqL1xyXG5cdGlmIChhcmd2Lmxlbmd0aCA9PT0gMCkge1xyXG5cdFx0b3B0aW9ucyA9IHt9O1xyXG5cdFx0c3ByaW50Zl9hcmdzID0gW107XHJcblx0fSBlbHNlIGlmIChtb2RfaXNFcnJvcihhcmd2WzBdKSkge1xyXG5cdFx0b3B0aW9ucyA9IHsgJ2NhdXNlJzogYXJndlswXSB9O1xyXG5cdFx0c3ByaW50Zl9hcmdzID0gYXJndi5zbGljZSgxKTtcclxuXHR9IGVsc2UgaWYgKHR5cGVvZiAoYXJndlswXSkgPT09ICdvYmplY3QnKSB7XHJcblx0XHRvcHRpb25zID0ge307XHJcblx0XHRmb3IgKGsgaW4gYXJndlswXSkge1xyXG5cdFx0XHRvcHRpb25zW2tdID0gYXJndlswXVtrXTtcclxuXHRcdH1cclxuXHRcdHNwcmludGZfYXJncyA9IGFyZ3Yuc2xpY2UoMSk7XHJcblx0fSBlbHNlIHtcclxuXHRcdG1vZF9hc3NlcnRwbHVzLnN0cmluZyhhcmd2WzBdLFxyXG5cdFx0ICAgICdmaXJzdCBhcmd1bWVudCB0byBWRXJyb3IsIFNFcnJvciwgb3IgV0Vycm9yICcgK1xyXG5cdFx0ICAgICdjb25zdHJ1Y3RvciBtdXN0IGJlIGEgc3RyaW5nLCBvYmplY3QsIG9yIEVycm9yJyk7XHJcblx0XHRvcHRpb25zID0ge307XHJcblx0XHRzcHJpbnRmX2FyZ3MgPSBhcmd2O1xyXG5cdH1cclxuXHJcblx0LypcclxuXHQgKiBOb3cgY29uc3RydWN0IHRoZSBlcnJvcidzIG1lc3NhZ2UuXHJcblx0ICpcclxuXHQgKiBleHRzcHJpbnRmICh3aGljaCB3ZSBpbnZva2UgaGVyZSB3aXRoIG91ciBjYWxsZXIncyBhcmd1bWVudHMgaW4gb3JkZXJcclxuXHQgKiB0byBjb25zdHJ1Y3QgdGhpcyBFcnJvcidzIG1lc3NhZ2UpIGlzIHN0cmljdCBpbiBpdHMgaW50ZXJwcmV0YXRpb24gb2ZcclxuXHQgKiB2YWx1ZXMgdG8gYmUgcHJvY2Vzc2VkIGJ5IHRoZSBcIiVzXCIgc3BlY2lmaWVyLiAgVGhlIHZhbHVlIHBhc3NlZCB0b1xyXG5cdCAqIGV4dHNwcmludGYgbXVzdCBhY3R1YWxseSBiZSBhIHN0cmluZyBvciBzb21ldGhpbmcgY29udmVydGlibGUgdG8gYVxyXG5cdCAqIFN0cmluZyB1c2luZyAudG9TdHJpbmcoKS4gIFBhc3Npbmcgb3RoZXIgdmFsdWVzIChub3RhYmx5IFwibnVsbFwiIGFuZFxyXG5cdCAqIFwidW5kZWZpbmVkXCIpIGlzIGNvbnNpZGVyZWQgYSBwcm9ncmFtbWVyIGVycm9yLiAgVGhlIGFzc3VtcHRpb24gaXNcclxuXHQgKiB0aGF0IGlmIHlvdSBhY3R1YWxseSB3YW50IHRvIHByaW50IHRoZSBzdHJpbmcgXCJudWxsXCIgb3IgXCJ1bmRlZmluZWRcIixcclxuXHQgKiB0aGVuIHRoYXQncyBlYXN5IHRvIGRvIHRoYXQgd2hlbiB5b3UncmUgY2FsbGluZyBleHRzcHJpbnRmOyBvbiB0aGVcclxuXHQgKiBvdGhlciBoYW5kLCBpZiB5b3UgZGlkIE5PVCB3YW50IHRoYXQgKGkuZS4sIHRoZXJlJ3MgYWN0dWFsbHkgYSBidWdcclxuXHQgKiB3aGVyZSB0aGUgcHJvZ3JhbSBhc3N1bWVzIHNvbWUgdmFyaWFibGUgaXMgbm9uLW51bGwgYW5kIHRyaWVzIHRvXHJcblx0ICogcHJpbnQgaXQsIHdoaWNoIG1pZ2h0IGhhcHBlbiB3aGVuIGNvbnN0cnVjdGluZyBhIHBhY2tldCBvciBmaWxlIGluXHJcblx0ICogc29tZSBzcGVjaWZpYyBmb3JtYXQpLCB0aGVuIGl0J3MgYmV0dGVyIHRvIHN0b3AgaW1tZWRpYXRlbHkgdGhhblxyXG5cdCAqIHByb2R1Y2UgYm9ndXMgb3V0cHV0LlxyXG5cdCAqXHJcblx0ICogSG93ZXZlciwgc29tZXRpbWVzIHRoZSBidWcgaXMgb25seSBpbiB0aGUgY29kZSBjYWxsaW5nIFZFcnJvciwgYW5kIGFcclxuXHQgKiBwcm9ncmFtbWVyIG1pZ2h0IHByZWZlciB0byBoYXZlIHRoZSBlcnJvciBtZXNzYWdlIGNvbnRhaW4gXCJudWxsXCIgb3JcclxuXHQgKiBcInVuZGVmaW5lZFwiIHJhdGhlciB0aGFuIGhhdmUgdGhlIGJ1ZyBpbiB0aGUgZXJyb3IgcGF0aCBjcmFzaCB0aGVcclxuXHQgKiBwcm9ncmFtIChtYWtpbmcgdGhlIGZpcnN0IGJ1ZyBoYXJkZXIgdG8gaWRlbnRpZnkpLiAgRm9yIHRoYXQgcmVhc29uLFxyXG5cdCAqIGJ5IGRlZmF1bHQgVkVycm9yIGNvbnZlcnRzIFwibnVsbFwiIG9yIFwidW5kZWZpbmVkXCIgYXJndW1lbnRzIHRvIHRoZWlyXHJcblx0ICogc3RyaW5nIHJlcHJlc2VudGF0aW9ucyBhbmQgcGFzc2VzIHRob3NlIHRvIGV4dHNwcmludGYuICBQcm9ncmFtbWVyc1xyXG5cdCAqIGRlc2lyaW5nIHRoZSBzdHJpY3QgYmVoYXZpb3IgY2FuIHVzZSB0aGUgU0Vycm9yIGNsYXNzIG9yIHBhc3MgdGhlXHJcblx0ICogXCJzdHJpY3RcIiBvcHRpb24gdG8gdGhlIFZFcnJvciBjb25zdHJ1Y3Rvci5cclxuXHQgKi9cclxuXHRtb2RfYXNzZXJ0cGx1cy5vYmplY3Qob3B0aW9ucyk7XHJcblx0aWYgKCFvcHRpb25zLnN0cmljdCAmJiAhYXJncy5zdHJpY3QpIHtcclxuXHRcdHNwcmludGZfYXJncyA9IHNwcmludGZfYXJncy5tYXAoZnVuY3Rpb24gKGEpIHtcclxuXHRcdFx0cmV0dXJuIChhID09PSBudWxsID8gJ251bGwnIDpcclxuXHRcdFx0ICAgIGEgPT09IHVuZGVmaW5lZCA/ICd1bmRlZmluZWQnIDogYSk7XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdGlmIChzcHJpbnRmX2FyZ3MubGVuZ3RoID09PSAwKSB7XHJcblx0XHRzaG9ydG1lc3NhZ2UgPSAnJztcclxuXHR9IGVsc2Uge1xyXG5cdFx0c2hvcnRtZXNzYWdlID0gc3ByaW50Zi5hcHBseShudWxsLCBzcHJpbnRmX2FyZ3MpO1xyXG5cdH1cclxuXHJcblx0cmV0dXJuICh7XHJcblx0ICAgICdvcHRpb25zJzogb3B0aW9ucyxcclxuXHQgICAgJ3Nob3J0bWVzc2FnZSc6IHNob3J0bWVzc2FnZVxyXG5cdH0pO1xyXG59XHJcblxyXG4vKlxyXG4gKiBTZWUgUkVBRE1FLm1kIGZvciByZWZlcmVuY2UgZG9jdW1lbnRhdGlvbi5cclxuICovXHJcbmZ1bmN0aW9uIFZFcnJvcigpXHJcbntcclxuXHR2YXIgYXJncywgb2JqLCBwYXJzZWQsIGNhdXNlLCBjdG9yLCBtZXNzYWdlLCBrO1xyXG5cclxuXHRhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKTtcclxuXHJcblx0LypcclxuXHQgKiBUaGlzIGlzIGEgcmVncmV0dGFibGUgcGF0dGVybiwgYnV0IEphdmFTY3JpcHQncyBidWlsdC1pbiBFcnJvciBjbGFzc1xyXG5cdCAqIGlzIGRlZmluZWQgdG8gd29yayB0aGlzIHdheSwgc28gd2UgYWxsb3cgdGhlIGNvbnN0cnVjdG9yIHRvIGJlIGNhbGxlZFxyXG5cdCAqIHdpdGhvdXQgXCJuZXdcIi5cclxuXHQgKi9cclxuXHRpZiAoISh0aGlzIGluc3RhbmNlb2YgVkVycm9yKSkge1xyXG5cdFx0b2JqID0gT2JqZWN0LmNyZWF0ZShWRXJyb3IucHJvdG90eXBlKTtcclxuXHRcdFZFcnJvci5hcHBseShvYmosIGFyZ3VtZW50cyk7XHJcblx0XHRyZXR1cm4gKG9iaik7XHJcblx0fVxyXG5cclxuXHQvKlxyXG5cdCAqIEZvciBjb252ZW5pZW5jZSBhbmQgYmFja3dhcmRzIGNvbXBhdGliaWxpdHksIHdlIHN1cHBvcnQgc2V2ZXJhbFxyXG5cdCAqIGRpZmZlcmVudCBjYWxsaW5nIGZvcm1zLiAgTm9ybWFsaXplIHRoZW0gaGVyZS5cclxuXHQgKi9cclxuXHRwYXJzZWQgPSBwYXJzZUNvbnN0cnVjdG9yQXJndW1lbnRzKHtcclxuXHQgICAgJ2FyZ3YnOiBhcmdzLFxyXG5cdCAgICAnc3RyaWN0JzogZmFsc2VcclxuXHR9KTtcclxuXHJcblx0LypcclxuXHQgKiBJZiB3ZSd2ZSBiZWVuIGdpdmVuIGEgbmFtZSwgYXBwbHkgaXQgbm93LlxyXG5cdCAqL1xyXG5cdGlmIChwYXJzZWQub3B0aW9ucy5uYW1lKSB7XHJcblx0XHRtb2RfYXNzZXJ0cGx1cy5zdHJpbmcocGFyc2VkLm9wdGlvbnMubmFtZSxcclxuXHRcdCAgICAnZXJyb3JcXCdzIFwibmFtZVwiIG11c3QgYmUgYSBzdHJpbmcnKTtcclxuXHRcdHRoaXMubmFtZSA9IHBhcnNlZC5vcHRpb25zLm5hbWU7XHJcblx0fVxyXG5cclxuXHQvKlxyXG5cdCAqIEZvciBkZWJ1Z2dpbmcsIHdlIGtlZXAgdHJhY2sgb2YgdGhlIG9yaWdpbmFsIHNob3J0IG1lc3NhZ2UgKGF0dGFjaGVkXHJcblx0ICogdGhpcyBFcnJvciBwYXJ0aWN1bGFybHkpIHNlcGFyYXRlbHkgZnJvbSB0aGUgY29tcGxldGUgbWVzc2FnZSAod2hpY2hcclxuXHQgKiBpbmNsdWRlcyB0aGUgbWVzc2FnZXMgb2Ygb3VyIGNhdXNlIGNoYWluKS5cclxuXHQgKi9cclxuXHR0aGlzLmpzZV9zaG9ydG1zZyA9IHBhcnNlZC5zaG9ydG1lc3NhZ2U7XHJcblx0bWVzc2FnZSA9IHBhcnNlZC5zaG9ydG1lc3NhZ2U7XHJcblxyXG5cdC8qXHJcblx0ICogSWYgd2UndmUgYmVlbiBnaXZlbiBhIGNhdXNlLCByZWNvcmQgYSByZWZlcmVuY2UgdG8gaXQgYW5kIHVwZGF0ZSBvdXJcclxuXHQgKiBtZXNzYWdlIGFwcHJvcHJpYXRlbHkuXHJcblx0ICovXHJcblx0Y2F1c2UgPSBwYXJzZWQub3B0aW9ucy5jYXVzZTtcclxuXHRpZiAoY2F1c2UpIHtcclxuXHRcdG1vZF9hc3NlcnRwbHVzLm9rKG1vZF9pc0Vycm9yKGNhdXNlKSwgJ2NhdXNlIGlzIG5vdCBhbiBFcnJvcicpO1xyXG5cdFx0dGhpcy5qc2VfY2F1c2UgPSBjYXVzZTtcclxuXHJcblx0XHRpZiAoIXBhcnNlZC5vcHRpb25zLnNraXBDYXVzZU1lc3NhZ2UpIHtcclxuXHRcdFx0bWVzc2FnZSArPSAnOiAnICsgY2F1c2UubWVzc2FnZTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8qXHJcblx0ICogSWYgd2UndmUgYmVlbiBnaXZlbiBhbiBvYmplY3Qgd2l0aCBwcm9wZXJ0aWVzLCBzaGFsbG93LWNvcHkgdGhhdFxyXG5cdCAqIGhlcmUuICBXZSBkb24ndCB3YW50IHRvIHVzZSBhIGRlZXAgY29weSBpbiBjYXNlIHRoZXJlIGFyZSBub24tcGxhaW5cclxuXHQgKiBvYmplY3RzIGhlcmUsIGJ1dCB3ZSBkb24ndCB3YW50IHRvIHVzZSB0aGUgb3JpZ2luYWwgb2JqZWN0IGluIGNhc2VcclxuXHQgKiB0aGUgY2FsbGVyIG1vZGlmaWVzIGl0IGxhdGVyLlxyXG5cdCAqL1xyXG5cdHRoaXMuanNlX2luZm8gPSB7fTtcclxuXHRpZiAocGFyc2VkLm9wdGlvbnMuaW5mbykge1xyXG5cdFx0Zm9yIChrIGluIHBhcnNlZC5vcHRpb25zLmluZm8pIHtcclxuXHRcdFx0dGhpcy5qc2VfaW5mb1trXSA9IHBhcnNlZC5vcHRpb25zLmluZm9ba107XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHR0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xyXG5cdEVycm9yLmNhbGwodGhpcywgbWVzc2FnZSk7XHJcblxyXG5cdGlmIChFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSkge1xyXG5cdFx0Y3RvciA9IHBhcnNlZC5vcHRpb25zLmNvbnN0cnVjdG9yT3B0IHx8IHRoaXMuY29uc3RydWN0b3I7XHJcblx0XHRFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSh0aGlzLCBjdG9yKTtcclxuXHR9XHJcblxyXG5cdHJldHVybiAodGhpcyk7XHJcbn1cclxuXHJcbm1vZF91dGlsLmluaGVyaXRzKFZFcnJvciwgRXJyb3IpO1xyXG5WRXJyb3IucHJvdG90eXBlLm5hbWUgPSAnVkVycm9yJztcclxuXHJcblZFcnJvci5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiB2ZV90b1N0cmluZygpXHJcbntcclxuXHR2YXIgc3RyID0gKHRoaXMuaGFzT3duUHJvcGVydHkoJ25hbWUnKSAmJiB0aGlzLm5hbWUgfHxcclxuXHRcdHRoaXMuY29uc3RydWN0b3IubmFtZSB8fCB0aGlzLmNvbnN0cnVjdG9yLnByb3RvdHlwZS5uYW1lKTtcclxuXHRpZiAodGhpcy5tZXNzYWdlKVxyXG5cdFx0c3RyICs9ICc6ICcgKyB0aGlzLm1lc3NhZ2U7XHJcblxyXG5cdHJldHVybiAoc3RyKTtcclxufTtcclxuXHJcbi8qXHJcbiAqIFRoaXMgbWV0aG9kIGlzIHByb3ZpZGVkIGZvciBjb21wYXRpYmlsaXR5LiAgTmV3IGNhbGxlcnMgc2hvdWxkIHVzZVxyXG4gKiBWRXJyb3IuY2F1c2UoKSBpbnN0ZWFkLiAgVGhhdCBtZXRob2QgYWxzbyB1c2VzIHRoZSBzYW5lciBgbnVsbGAgcmV0dXJuIHZhbHVlXHJcbiAqIHdoZW4gdGhlcmUgaXMgbm8gY2F1c2UuXHJcbiAqL1xyXG5WRXJyb3IucHJvdG90eXBlLmNhdXNlID0gZnVuY3Rpb24gdmVfY2F1c2UoKVxyXG57XHJcblx0dmFyIGNhdXNlID0gVkVycm9yLmNhdXNlKHRoaXMpO1xyXG5cdHJldHVybiAoY2F1c2UgPT09IG51bGwgPyB1bmRlZmluZWQgOiBjYXVzZSk7XHJcbn07XHJcblxyXG4vKlxyXG4gKiBTdGF0aWMgbWV0aG9kc1xyXG4gKlxyXG4gKiBUaGVzZSBjbGFzcy1sZXZlbCBtZXRob2RzIGFyZSBwcm92aWRlZCBzbyB0aGF0IGNhbGxlcnMgY2FuIHVzZSB0aGVtIG9uXHJcbiAqIGluc3RhbmNlcyBvZiBFcnJvcnMgdGhhdCBhcmUgbm90IFZFcnJvcnMuICBOZXcgaW50ZXJmYWNlcyBzaG91bGQgYmUgcHJvdmlkZWRcclxuICogb25seSB1c2luZyBzdGF0aWMgbWV0aG9kcyB0byBlbGltaW5hdGUgdGhlIGNsYXNzIG9mIHByb2dyYW1taW5nIG1pc3Rha2Ugd2hlcmVcclxuICogcGVvcGxlIGZhaWwgdG8gY2hlY2sgd2hldGhlciB0aGUgRXJyb3Igb2JqZWN0IGhhcyB0aGUgY29ycmVzcG9uZGluZyBtZXRob2RzLlxyXG4gKi9cclxuXHJcblZFcnJvci5jYXVzZSA9IGZ1bmN0aW9uIChlcnIpXHJcbntcclxuXHRtb2RfYXNzZXJ0cGx1cy5vayhtb2RfaXNFcnJvcihlcnIpLCAnZXJyIG11c3QgYmUgYW4gRXJyb3InKTtcclxuXHRyZXR1cm4gKG1vZF9pc0Vycm9yKGVyci5qc2VfY2F1c2UpID8gZXJyLmpzZV9jYXVzZSA6IG51bGwpO1xyXG59O1xyXG5cclxuVkVycm9yLmluZm8gPSBmdW5jdGlvbiAoZXJyKVxyXG57XHJcblx0dmFyIHJ2LCBjYXVzZSwgaztcclxuXHJcblx0bW9kX2Fzc2VydHBsdXMub2sobW9kX2lzRXJyb3IoZXJyKSwgJ2VyciBtdXN0IGJlIGFuIEVycm9yJyk7XHJcblx0Y2F1c2UgPSBWRXJyb3IuY2F1c2UoZXJyKTtcclxuXHRpZiAoY2F1c2UgIT09IG51bGwpIHtcclxuXHRcdHJ2ID0gVkVycm9yLmluZm8oY2F1c2UpO1xyXG5cdH0gZWxzZSB7XHJcblx0XHRydiA9IHt9O1xyXG5cdH1cclxuXHJcblx0aWYgKHR5cGVvZiAoZXJyLmpzZV9pbmZvKSA9PSAnb2JqZWN0JyAmJiBlcnIuanNlX2luZm8gIT09IG51bGwpIHtcclxuXHRcdGZvciAoayBpbiBlcnIuanNlX2luZm8pIHtcclxuXHRcdFx0cnZba10gPSBlcnIuanNlX2luZm9ba107XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gKHJ2KTtcclxufTtcclxuXHJcblZFcnJvci5maW5kQ2F1c2VCeU5hbWUgPSBmdW5jdGlvbiAoZXJyLCBuYW1lKVxyXG57XHJcblx0dmFyIGNhdXNlO1xyXG5cclxuXHRtb2RfYXNzZXJ0cGx1cy5vayhtb2RfaXNFcnJvcihlcnIpLCAnZXJyIG11c3QgYmUgYW4gRXJyb3InKTtcclxuXHRtb2RfYXNzZXJ0cGx1cy5zdHJpbmcobmFtZSwgJ25hbWUnKTtcclxuXHRtb2RfYXNzZXJ0cGx1cy5vayhuYW1lLmxlbmd0aCA+IDAsICduYW1lIGNhbm5vdCBiZSBlbXB0eScpO1xyXG5cclxuXHRmb3IgKGNhdXNlID0gZXJyOyBjYXVzZSAhPT0gbnVsbDsgY2F1c2UgPSBWRXJyb3IuY2F1c2UoY2F1c2UpKSB7XHJcblx0XHRtb2RfYXNzZXJ0cGx1cy5vayhtb2RfaXNFcnJvcihjYXVzZSkpO1xyXG5cdFx0aWYgKGNhdXNlLm5hbWUgPT0gbmFtZSkge1xyXG5cdFx0XHRyZXR1cm4gKGNhdXNlKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHJldHVybiAobnVsbCk7XHJcbn07XHJcblxyXG5WRXJyb3IuaGFzQ2F1c2VXaXRoTmFtZSA9IGZ1bmN0aW9uIChlcnIsIG5hbWUpXHJcbntcclxuXHRyZXR1cm4gKFZFcnJvci5maW5kQ2F1c2VCeU5hbWUoZXJyLCBuYW1lKSAhPT0gbnVsbCk7XHJcbn07XHJcblxyXG5WRXJyb3IuZnVsbFN0YWNrID0gZnVuY3Rpb24gKGVycilcclxue1xyXG5cdG1vZF9hc3NlcnRwbHVzLm9rKG1vZF9pc0Vycm9yKGVyciksICdlcnIgbXVzdCBiZSBhbiBFcnJvcicpO1xyXG5cclxuXHR2YXIgY2F1c2UgPSBWRXJyb3IuY2F1c2UoZXJyKTtcclxuXHJcblx0aWYgKGNhdXNlKSB7XHJcblx0XHRyZXR1cm4gKGVyci5zdGFjayArICdcXG5jYXVzZWQgYnk6ICcgKyBWRXJyb3IuZnVsbFN0YWNrKGNhdXNlKSk7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gKGVyci5zdGFjayk7XHJcbn07XHJcblxyXG5WRXJyb3IuZXJyb3JGcm9tTGlzdCA9IGZ1bmN0aW9uIChlcnJvcnMpXHJcbntcclxuXHRtb2RfYXNzZXJ0cGx1cy5hcnJheU9mT2JqZWN0KGVycm9ycywgJ2Vycm9ycycpO1xyXG5cclxuXHRpZiAoZXJyb3JzLmxlbmd0aCA9PT0gMCkge1xyXG5cdFx0cmV0dXJuIChudWxsKTtcclxuXHR9XHJcblxyXG5cdGVycm9ycy5mb3JFYWNoKGZ1bmN0aW9uIChlKSB7XHJcblx0XHRtb2RfYXNzZXJ0cGx1cy5vayhtb2RfaXNFcnJvcihlKSk7XHJcblx0fSk7XHJcblxyXG5cdGlmIChlcnJvcnMubGVuZ3RoID09IDEpIHtcclxuXHRcdHJldHVybiAoZXJyb3JzWzBdKTtcclxuXHR9XHJcblxyXG5cdHJldHVybiAobmV3IE11bHRpRXJyb3IoZXJyb3JzKSk7XHJcbn07XHJcblxyXG5WRXJyb3IuZXJyb3JGb3JFYWNoID0gZnVuY3Rpb24gKGVyciwgZnVuYylcclxue1xyXG5cdG1vZF9hc3NlcnRwbHVzLm9rKG1vZF9pc0Vycm9yKGVyciksICdlcnIgbXVzdCBiZSBhbiBFcnJvcicpO1xyXG5cdG1vZF9hc3NlcnRwbHVzLmZ1bmMoZnVuYywgJ2Z1bmMnKTtcclxuXHJcblx0aWYgKGVyciBpbnN0YW5jZW9mIE11bHRpRXJyb3IpIHtcclxuXHRcdGVyci5lcnJvcnMoKS5mb3JFYWNoKGZ1bmN0aW9uIGl0ZXJFcnJvcihlKSB7IGZ1bmMoZSk7IH0pO1xyXG5cdH0gZWxzZSB7XHJcblx0XHRmdW5jKGVycik7XHJcblx0fVxyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFNFcnJvciBpcyBsaWtlIFZFcnJvciwgYnV0IHN0cmljdGVyIGFib3V0IHR5cGVzLiAgWW91IGNhbm5vdCBwYXNzIFwibnVsbFwiIG9yXHJcbiAqIFwidW5kZWZpbmVkXCIgYXMgc3RyaW5nIGFyZ3VtZW50cyB0byB0aGUgZm9ybWF0dGVyLlxyXG4gKi9cclxuZnVuY3Rpb24gU0Vycm9yKClcclxue1xyXG5cdHZhciBhcmdzLCBvYmosIHBhcnNlZCwgb3B0aW9ucztcclxuXHJcblx0YXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMCk7XHJcblx0aWYgKCEodGhpcyBpbnN0YW5jZW9mIFNFcnJvcikpIHtcclxuXHRcdG9iaiA9IE9iamVjdC5jcmVhdGUoU0Vycm9yLnByb3RvdHlwZSk7XHJcblx0XHRTRXJyb3IuYXBwbHkob2JqLCBhcmd1bWVudHMpO1xyXG5cdFx0cmV0dXJuIChvYmopO1xyXG5cdH1cclxuXHJcblx0cGFyc2VkID0gcGFyc2VDb25zdHJ1Y3RvckFyZ3VtZW50cyh7XHJcblx0ICAgICdhcmd2JzogYXJncyxcclxuXHQgICAgJ3N0cmljdCc6IHRydWVcclxuXHR9KTtcclxuXHJcblx0b3B0aW9ucyA9IHBhcnNlZC5vcHRpb25zO1xyXG5cdFZFcnJvci5jYWxsKHRoaXMsIG9wdGlvbnMsICclcycsIHBhcnNlZC5zaG9ydG1lc3NhZ2UpO1xyXG5cclxuXHRyZXR1cm4gKHRoaXMpO1xyXG59XHJcblxyXG4vKlxyXG4gKiBXZSBkb24ndCBib3RoZXIgc2V0dGluZyBTRXJyb3IucHJvdG90eXBlLm5hbWUgYmVjYXVzZSBvbmNlIGNvbnN0cnVjdGVkLFxyXG4gKiBTRXJyb3JzIGFyZSBqdXN0IGxpa2UgVkVycm9ycy5cclxuICovXHJcbm1vZF91dGlsLmluaGVyaXRzKFNFcnJvciwgVkVycm9yKTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXByZXNlbnRzIGEgY29sbGVjdGlvbiBvZiBlcnJvcnMgZm9yIHRoZSBwdXJwb3NlIG9mIGNvbnN1bWVycyB0aGF0IGdlbmVyYWxseVxyXG4gKiBvbmx5IGRlYWwgd2l0aCBvbmUgZXJyb3IuICBDYWxsZXJzIGNhbiBleHRyYWN0IHRoZSBpbmRpdmlkdWFsIGVycm9yc1xyXG4gKiBjb250YWluZWQgaW4gdGhpcyBvYmplY3QsIGJ1dCBtYXkgYWxzbyBqdXN0IHRyZWF0IGl0IGFzIGEgbm9ybWFsIHNpbmdsZVxyXG4gKiBlcnJvciwgaW4gd2hpY2ggY2FzZSBhIHN1bW1hcnkgbWVzc2FnZSB3aWxsIGJlIHByaW50ZWQuXHJcbiAqL1xyXG5mdW5jdGlvbiBNdWx0aUVycm9yKGVycm9ycylcclxue1xyXG5cdG1vZF9hc3NlcnRwbHVzLmFycmF5KGVycm9ycywgJ2xpc3Qgb2YgZXJyb3JzJyk7XHJcblx0bW9kX2Fzc2VydHBsdXMub2soZXJyb3JzLmxlbmd0aCA+IDAsICdtdXN0IGJlIGF0IGxlYXN0IG9uZSBlcnJvcicpO1xyXG5cdHRoaXMuYXNlX2Vycm9ycyA9IGVycm9ycztcclxuXHJcblx0VkVycm9yLmNhbGwodGhpcywge1xyXG5cdCAgICAnY2F1c2UnOiBlcnJvcnNbMF1cclxuXHR9LCAnZmlyc3Qgb2YgJWQgZXJyb3IlcycsIGVycm9ycy5sZW5ndGgsIGVycm9ycy5sZW5ndGggPT0gMSA/ICcnIDogJ3MnKTtcclxufVxyXG5cclxubW9kX3V0aWwuaW5oZXJpdHMoTXVsdGlFcnJvciwgVkVycm9yKTtcclxuTXVsdGlFcnJvci5wcm90b3R5cGUubmFtZSA9ICdNdWx0aUVycm9yJztcclxuXHJcbk11bHRpRXJyb3IucHJvdG90eXBlLmVycm9ycyA9IGZ1bmN0aW9uIG1lX2Vycm9ycygpXHJcbntcclxuXHRyZXR1cm4gKHRoaXMuYXNlX2Vycm9ycy5zbGljZSgwKSk7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogU2VlIFJFQURNRS5tZCBmb3IgcmVmZXJlbmNlIGRldGFpbHMuXHJcbiAqL1xyXG5mdW5jdGlvbiBXRXJyb3IoKVxyXG57XHJcblx0dmFyIGFyZ3MsIG9iaiwgcGFyc2VkLCBvcHRpb25zO1xyXG5cclxuXHRhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKTtcclxuXHRpZiAoISh0aGlzIGluc3RhbmNlb2YgV0Vycm9yKSkge1xyXG5cdFx0b2JqID0gT2JqZWN0LmNyZWF0ZShXRXJyb3IucHJvdG90eXBlKTtcclxuXHRcdFdFcnJvci5hcHBseShvYmosIGFyZ3MpO1xyXG5cdFx0cmV0dXJuIChvYmopO1xyXG5cdH1cclxuXHJcblx0cGFyc2VkID0gcGFyc2VDb25zdHJ1Y3RvckFyZ3VtZW50cyh7XHJcblx0ICAgICdhcmd2JzogYXJncyxcclxuXHQgICAgJ3N0cmljdCc6IGZhbHNlXHJcblx0fSk7XHJcblxyXG5cdG9wdGlvbnMgPSBwYXJzZWQub3B0aW9ucztcclxuXHRvcHRpb25zWydza2lwQ2F1c2VNZXNzYWdlJ10gPSB0cnVlO1xyXG5cdFZFcnJvci5jYWxsKHRoaXMsIG9wdGlvbnMsICclcycsIHBhcnNlZC5zaG9ydG1lc3NhZ2UpO1xyXG5cclxuXHRyZXR1cm4gKHRoaXMpO1xyXG59XHJcblxyXG5tb2RfdXRpbC5pbmhlcml0cyhXRXJyb3IsIFZFcnJvcik7XHJcbldFcnJvci5wcm90b3R5cGUubmFtZSA9ICdXRXJyb3InO1xyXG5cclxuV0Vycm9yLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uIHdlX3RvU3RyaW5nKClcclxue1xyXG5cdHZhciBzdHIgPSAodGhpcy5oYXNPd25Qcm9wZXJ0eSgnbmFtZScpICYmIHRoaXMubmFtZSB8fFxyXG5cdFx0dGhpcy5jb25zdHJ1Y3Rvci5uYW1lIHx8IHRoaXMuY29uc3RydWN0b3IucHJvdG90eXBlLm5hbWUpO1xyXG5cdGlmICh0aGlzLm1lc3NhZ2UpXHJcblx0XHRzdHIgKz0gJzogJyArIHRoaXMubWVzc2FnZTtcclxuXHRpZiAodGhpcy5qc2VfY2F1c2UgJiYgdGhpcy5qc2VfY2F1c2UubWVzc2FnZSlcclxuXHRcdHN0ciArPSAnOyBjYXVzZWQgYnkgJyArIHRoaXMuanNlX2NhdXNlLnRvU3RyaW5nKCk7XHJcblxyXG5cdHJldHVybiAoc3RyKTtcclxufTtcclxuXHJcbi8qXHJcbiAqIEZvciBwdXJlbHkgaGlzdG9yaWNhbCByZWFzb25zLCBXRXJyb3IncyBjYXVzZSgpIGZ1bmN0aW9uIGFsbG93cyB5b3UgdG8gc2V0XHJcbiAqIHRoZSBjYXVzZS5cclxuICovXHJcbldFcnJvci5wcm90b3R5cGUuY2F1c2UgPSBmdW5jdGlvbiB3ZV9jYXVzZShjKVxyXG57XHJcblx0aWYgKG1vZF9pc0Vycm9yKGMpKVxyXG5cdFx0dGhpcy5qc2VfY2F1c2UgPSBjO1xyXG5cclxuXHRyZXR1cm4gKHRoaXMuanNlX2NhdXNlKTtcclxufTtcclxuIl0sInNvdXJjZVJvb3QiOiIifQ==