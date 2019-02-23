(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["vendor/vendor.tough-cookie"],{

/***/ "DhCA":
/*!****************************************************!*\
  !*** ./node_modules/tough-cookie/lib/pathMatch.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*!
 * Copyright (c) 2015, Salesforce.com, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice,
 * this list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the documentation
 * and/or other materials provided with the distribution.
 *
 * 3. Neither the name of Salesforce.com nor the names of its contributors may
 * be used to endorse or promote products derived from this software without
 * specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

/*
 * "A request-path path-matches a given cookie-path if at least one of the
 * following conditions holds:"
 */
function pathMatch (reqPath, cookiePath) {
  // "o  The cookie-path and the request-path are identical."
  if (cookiePath === reqPath) {
    return true;
  }

  var idx = reqPath.indexOf(cookiePath);
  if (idx === 0) {
    // "o  The cookie-path is a prefix of the request-path, and the last
    // character of the cookie-path is %x2F ("/")."
    if (cookiePath.substr(-1) === "/") {
      return true;
    }

    // " o  The cookie-path is a prefix of the request-path, and the first
    // character of the request-path that is not included in the cookie- path
    // is a %x2F ("/") character."
    if (reqPath.substr(cookiePath.length, 1) === "/") {
      return true;
    }
  }

  return false;
}

exports.pathMatch = pathMatch;


/***/ }),

/***/ "NaPP":
/*!********************************************************!*\
  !*** ./node_modules/tough-cookie/lib/pubsuffix-psl.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*!
 * Copyright (c) 2018, Salesforce.com, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice,
 * this list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the documentation
 * and/or other materials provided with the distribution.
 *
 * 3. Neither the name of Salesforce.com nor the names of its contributors may
 * be used to endorse or promote products derived from this software without
 * specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

var psl = __webpack_require__(/*! psl */ "I0DR");

function getPublicSuffix(domain) {
  return psl.get(domain);
}

exports.getPublicSuffix = getPublicSuffix;


/***/ }),

/***/ "Uipm":
/*!***************************************************!*\
  !*** ./node_modules/tough-cookie/lib/memstore.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*!
 * Copyright (c) 2015, Salesforce.com, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice,
 * this list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the documentation
 * and/or other materials provided with the distribution.
 *
 * 3. Neither the name of Salesforce.com nor the names of its contributors may
 * be used to endorse or promote products derived from this software without
 * specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

var Store = __webpack_require__(/*! ./store */ "eqUZ").Store;
var permuteDomain = __webpack_require__(/*! ./permuteDomain */ "yvLu").permuteDomain;
var pathMatch = __webpack_require__(/*! ./pathMatch */ "DhCA").pathMatch;
var util = __webpack_require__(/*! util */ "7tlc");

function MemoryCookieStore() {
  Store.call(this);
  this.idx = {};
}
util.inherits(MemoryCookieStore, Store);
exports.MemoryCookieStore = MemoryCookieStore;
MemoryCookieStore.prototype.idx = null;

// Since it's just a struct in RAM, this Store is synchronous
MemoryCookieStore.prototype.synchronous = true;

// force a default depth:
MemoryCookieStore.prototype.inspect = function() {
  return "{ idx: "+util.inspect(this.idx, false, 2)+' }';
};

// Use the new custom inspection symbol to add the custom inspect function if
// available.
if (util.inspect.custom) {
  MemoryCookieStore.prototype[util.inspect.custom] = MemoryCookieStore.prototype.inspect;
}

MemoryCookieStore.prototype.findCookie = function(domain, path, key, cb) {
  if (!this.idx[domain]) {
    return cb(null,undefined);
  }
  if (!this.idx[domain][path]) {
    return cb(null,undefined);
  }
  return cb(null,this.idx[domain][path][key]||null);
};

MemoryCookieStore.prototype.findCookies = function(domain, path, cb) {
  var results = [];
  if (!domain) {
    return cb(null,[]);
  }

  var pathMatcher;
  if (!path) {
    // null means "all paths"
    pathMatcher = function matchAll(domainIndex) {
      for (var curPath in domainIndex) {
        var pathIndex = domainIndex[curPath];
        for (var key in pathIndex) {
          results.push(pathIndex[key]);
        }
      }
    };

  } else {
    pathMatcher = function matchRFC(domainIndex) {
       //NOTE: we should use path-match algorithm from S5.1.4 here
       //(see : https://github.com/ChromiumWebApps/chromium/blob/b3d3b4da8bb94c1b2e061600df106d590fda3620/net/cookies/canonical_cookie.cc#L299)
       Object.keys(domainIndex).forEach(function (cookiePath) {
         if (pathMatch(path, cookiePath)) {
           var pathIndex = domainIndex[cookiePath];

           for (var key in pathIndex) {
             results.push(pathIndex[key]);
           }
         }
       });
     };
  }

  var domains = permuteDomain(domain) || [domain];
  var idx = this.idx;
  domains.forEach(function(curDomain) {
    var domainIndex = idx[curDomain];
    if (!domainIndex) {
      return;
    }
    pathMatcher(domainIndex);
  });

  cb(null,results);
};

MemoryCookieStore.prototype.putCookie = function(cookie, cb) {
  if (!this.idx[cookie.domain]) {
    this.idx[cookie.domain] = {};
  }
  if (!this.idx[cookie.domain][cookie.path]) {
    this.idx[cookie.domain][cookie.path] = {};
  }
  this.idx[cookie.domain][cookie.path][cookie.key] = cookie;
  cb(null);
};

MemoryCookieStore.prototype.updateCookie = function(oldCookie, newCookie, cb) {
  // updateCookie() may avoid updating cookies that are identical.  For example,
  // lastAccessed may not be important to some stores and an equality
  // comparison could exclude that field.
  this.putCookie(newCookie,cb);
};

MemoryCookieStore.prototype.removeCookie = function(domain, path, key, cb) {
  if (this.idx[domain] && this.idx[domain][path] && this.idx[domain][path][key]) {
    delete this.idx[domain][path][key];
  }
  cb(null);
};

MemoryCookieStore.prototype.removeCookies = function(domain, path, cb) {
  if (this.idx[domain]) {
    if (path) {
      delete this.idx[domain][path];
    } else {
      delete this.idx[domain];
    }
  }
  return cb(null);
};

MemoryCookieStore.prototype.getAllCookies = function(cb) {
  var cookies = [];
  var idx = this.idx;

  var domains = Object.keys(idx);
  domains.forEach(function(domain) {
    var paths = Object.keys(idx[domain]);
    paths.forEach(function(path) {
      var keys = Object.keys(idx[domain][path]);
      keys.forEach(function(key) {
        if (key !== null) {
          cookies.push(idx[domain][path][key]);
        }
      });
    });
  });

  // Sort by creationIndex so deserializing retains the creation order.
  // When implementing your own store, this SHOULD retain the order too
  cookies.sort(function(a,b) {
    return (a.creationIndex||0) - (b.creationIndex||0);
  });

  cb(null, cookies);
};


/***/ }),

/***/ "eqUZ":
/*!************************************************!*\
  !*** ./node_modules/tough-cookie/lib/store.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*!
 * Copyright (c) 2015, Salesforce.com, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice,
 * this list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the documentation
 * and/or other materials provided with the distribution.
 *
 * 3. Neither the name of Salesforce.com nor the names of its contributors may
 * be used to endorse or promote products derived from this software without
 * specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

/*jshint unused:false */

function Store() {
}
exports.Store = Store;

// Stores may be synchronous, but are still required to use a
// Continuation-Passing Style API.  The CookieJar itself will expose a "*Sync"
// API that converts from synchronous-callbacks to imperative style.
Store.prototype.synchronous = false;

Store.prototype.findCookie = function(domain, path, key, cb) {
  throw new Error('findCookie is not implemented');
};

Store.prototype.findCookies = function(domain, path, cb) {
  throw new Error('findCookies is not implemented');
};

Store.prototype.putCookie = function(cookie, cb) {
  throw new Error('putCookie is not implemented');
};

Store.prototype.updateCookie = function(oldCookie, newCookie, cb) {
  // recommended default implementation:
  // return this.putCookie(newCookie, cb);
  throw new Error('updateCookie is not implemented');
};

Store.prototype.removeCookie = function(domain, path, key, cb) {
  throw new Error('removeCookie is not implemented');
};

Store.prototype.removeCookies = function(domain, path, cb) {
  throw new Error('removeCookies is not implemented');
};

Store.prototype.getAllCookies = function(cb) {
  throw new Error('getAllCookies is not implemented (therefore jar cannot be serialized)');
};


/***/ }),

/***/ "km0I":
/*!************************************************!*\
  !*** ./node_modules/tough-cookie/package.json ***!
  \************************************************/
/*! exports provided: _from, _id, _inBundle, _integrity, _location, _phantomChildren, _requested, _requiredBy, _resolved, _shasum, _spec, _where, author, bugs, bundleDependencies, contributors, dependencies, deprecated, description, devDependencies, engines, files, homepage, keywords, license, main, name, repository, scripts, version, default */
/***/ (function(module) {

module.exports = {"_from":"tough-cookie@~2.4.3","_id":"tough-cookie@2.4.3","_inBundle":false,"_integrity":"sha512-Q5srk/4vDM54WJsJio3XNn6K2sCG+CQ8G5Wz6bZhRZoAe/+TxjWB/GlFAnYEbkYVlON9FMk/fE3h2RLpPXo4lQ==","_location":"/tough-cookie","_phantomChildren":{},"_requested":{"type":"range","registry":true,"raw":"tough-cookie@~2.4.3","name":"tough-cookie","escapedName":"tough-cookie","rawSpec":"~2.4.3","saveSpec":null,"fetchSpec":"~2.4.3"},"_requiredBy":["/request"],"_resolved":"https://registry.npmjs.org/tough-cookie/-/tough-cookie-2.4.3.tgz","_shasum":"53f36da3f47783b0925afa06ff9f3b165280f781","_spec":"tough-cookie@~2.4.3","_where":"C:\\Users\\garrick\\source\\repos\\snapform\\node_modules\\request","author":{"name":"Jeremy Stashewsky","email":"jstash@gmail.com"},"bugs":{"url":"https://github.com/salesforce/tough-cookie/issues"},"bundleDependencies":false,"contributors":[{"name":"Alexander Savin"},{"name":"Ian Livingstone"},{"name":"Ivan Nikulin"},{"name":"Lalit Kapoor"},{"name":"Sam Thompson"},{"name":"Sebastian Mayr"}],"dependencies":{"psl":"^1.1.24","punycode":"^1.4.1"},"deprecated":false,"description":"RFC6265 Cookies and Cookie Jar for node.js","devDependencies":{"async":"^1.4.2","nyc":"^11.6.0","string.prototype.repeat":"^0.2.0","vows":"^0.8.1"},"engines":{"node":">=0.8"},"files":["lib"],"homepage":"https://github.com/salesforce/tough-cookie","keywords":["HTTP","cookie","cookies","set-cookie","cookiejar","jar","RFC6265","RFC2965"],"license":"BSD-3-Clause","main":"./lib/cookie","name":"tough-cookie","repository":{"type":"git","url":"git://github.com/salesforce/tough-cookie.git"},"scripts":{"cover":"nyc --reporter=lcov --reporter=html vows test/*_test.js","test":"vows test/*_test.js"},"version":"2.4.3"};

/***/ }),

/***/ "n+Wf":
/*!*************************************************!*\
  !*** ./node_modules/tough-cookie/lib/cookie.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(console) {/*!
 * Copyright (c) 2015, Salesforce.com, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice,
 * this list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the documentation
 * and/or other materials provided with the distribution.
 *
 * 3. Neither the name of Salesforce.com nor the names of its contributors may
 * be used to endorse or promote products derived from this software without
 * specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

var net = __webpack_require__(/*! net */ "Po9p");
var urlParse = __webpack_require__(/*! url */ "CxY0").parse;
var util = __webpack_require__(/*! util */ "7tlc");
var pubsuffix = __webpack_require__(/*! ./pubsuffix-psl */ "NaPP");
var Store = __webpack_require__(/*! ./store */ "eqUZ").Store;
var MemoryCookieStore = __webpack_require__(/*! ./memstore */ "Uipm").MemoryCookieStore;
var pathMatch = __webpack_require__(/*! ./pathMatch */ "DhCA").pathMatch;
var VERSION = __webpack_require__(/*! ../package.json */ "km0I").version;

var punycode;
try {
  punycode = __webpack_require__(/*! punycode */ "GYWy");
} catch(e) {
  console.warn("tough-cookie: can't load punycode; won't use punycode for domain normalization");
}

// From RFC6265 S4.1.1
// note that it excludes \x3B ";"
var COOKIE_OCTETS = /^[\x21\x23-\x2B\x2D-\x3A\x3C-\x5B\x5D-\x7E]+$/;

var CONTROL_CHARS = /[\x00-\x1F]/;

// From Chromium // '\r', '\n' and '\0' should be treated as a terminator in
// the "relaxed" mode, see:
// https://github.com/ChromiumWebApps/chromium/blob/b3d3b4da8bb94c1b2e061600df106d590fda3620/net/cookies/parsed_cookie.cc#L60
var TERMINATORS = ['\n', '\r', '\0'];

// RFC6265 S4.1.1 defines path value as 'any CHAR except CTLs or ";"'
// Note ';' is \x3B
var PATH_VALUE = /[\x20-\x3A\x3C-\x7E]+/;

// date-time parsing constants (RFC6265 S5.1.1)

var DATE_DELIM = /[\x09\x20-\x2F\x3B-\x40\x5B-\x60\x7B-\x7E]/;

var MONTH_TO_NUM = {
  jan:0, feb:1, mar:2, apr:3, may:4, jun:5,
  jul:6, aug:7, sep:8, oct:9, nov:10, dec:11
};
var NUM_TO_MONTH = [
  'Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'
];
var NUM_TO_DAY = [
  'Sun','Mon','Tue','Wed','Thu','Fri','Sat'
];

var MAX_TIME = 2147483647000; // 31-bit max
var MIN_TIME = 0; // 31-bit min

/*
 * Parses a Natural number (i.e., non-negative integer) with either the
 *    <min>*<max>DIGIT ( non-digit *OCTET )
 * or
 *    <min>*<max>DIGIT
 * grammar (RFC6265 S5.1.1).
 *
 * The "trailingOK" boolean controls if the grammar accepts a
 * "( non-digit *OCTET )" trailer.
 */
function parseDigits(token, minDigits, maxDigits, trailingOK) {
  var count = 0;
  while (count < token.length) {
    var c = token.charCodeAt(count);
    // "non-digit = %x00-2F / %x3A-FF"
    if (c <= 0x2F || c >= 0x3A) {
      break;
    }
    count++;
  }

  // constrain to a minimum and maximum number of digits.
  if (count < minDigits || count > maxDigits) {
    return null;
  }

  if (!trailingOK && count != token.length) {
    return null;
  }

  return parseInt(token.substr(0,count), 10);
}

function parseTime(token) {
  var parts = token.split(':');
  var result = [0,0,0];

  /* RF6256 S5.1.1:
   *      time            = hms-time ( non-digit *OCTET )
   *      hms-time        = time-field ":" time-field ":" time-field
   *      time-field      = 1*2DIGIT
   */

  if (parts.length !== 3) {
    return null;
  }

  for (var i = 0; i < 3; i++) {
    // "time-field" must be strictly "1*2DIGIT", HOWEVER, "hms-time" can be
    // followed by "( non-digit *OCTET )" so therefore the last time-field can
    // have a trailer
    var trailingOK = (i == 2);
    var num = parseDigits(parts[i], 1, 2, trailingOK);
    if (num === null) {
      return null;
    }
    result[i] = num;
  }

  return result;
}

function parseMonth(token) {
  token = String(token).substr(0,3).toLowerCase();
  var num = MONTH_TO_NUM[token];
  return num >= 0 ? num : null;
}

/*
 * RFC6265 S5.1.1 date parser (see RFC for full grammar)
 */
function parseDate(str) {
  if (!str) {
    return;
  }

  /* RFC6265 S5.1.1:
   * 2. Process each date-token sequentially in the order the date-tokens
   * appear in the cookie-date
   */
  var tokens = str.split(DATE_DELIM);
  if (!tokens) {
    return;
  }

  var hour = null;
  var minute = null;
  var second = null;
  var dayOfMonth = null;
  var month = null;
  var year = null;

  for (var i=0; i<tokens.length; i++) {
    var token = tokens[i].trim();
    if (!token.length) {
      continue;
    }

    var result;

    /* 2.1. If the found-time flag is not set and the token matches the time
     * production, set the found-time flag and set the hour- value,
     * minute-value, and second-value to the numbers denoted by the digits in
     * the date-token, respectively.  Skip the remaining sub-steps and continue
     * to the next date-token.
     */
    if (second === null) {
      result = parseTime(token);
      if (result) {
        hour = result[0];
        minute = result[1];
        second = result[2];
        continue;
      }
    }

    /* 2.2. If the found-day-of-month flag is not set and the date-token matches
     * the day-of-month production, set the found-day-of- month flag and set
     * the day-of-month-value to the number denoted by the date-token.  Skip
     * the remaining sub-steps and continue to the next date-token.
     */
    if (dayOfMonth === null) {
      // "day-of-month = 1*2DIGIT ( non-digit *OCTET )"
      result = parseDigits(token, 1, 2, true);
      if (result !== null) {
        dayOfMonth = result;
        continue;
      }
    }

    /* 2.3. If the found-month flag is not set and the date-token matches the
     * month production, set the found-month flag and set the month-value to
     * the month denoted by the date-token.  Skip the remaining sub-steps and
     * continue to the next date-token.
     */
    if (month === null) {
      result = parseMonth(token);
      if (result !== null) {
        month = result;
        continue;
      }
    }

    /* 2.4. If the found-year flag is not set and the date-token matches the
     * year production, set the found-year flag and set the year-value to the
     * number denoted by the date-token.  Skip the remaining sub-steps and
     * continue to the next date-token.
     */
    if (year === null) {
      // "year = 2*4DIGIT ( non-digit *OCTET )"
      result = parseDigits(token, 2, 4, true);
      if (result !== null) {
        year = result;
        /* From S5.1.1:
         * 3.  If the year-value is greater than or equal to 70 and less
         * than or equal to 99, increment the year-value by 1900.
         * 4.  If the year-value is greater than or equal to 0 and less
         * than or equal to 69, increment the year-value by 2000.
         */
        if (year >= 70 && year <= 99) {
          year += 1900;
        } else if (year >= 0 && year <= 69) {
          year += 2000;
        }
      }
    }
  }

  /* RFC 6265 S5.1.1
   * "5. Abort these steps and fail to parse the cookie-date if:
   *     *  at least one of the found-day-of-month, found-month, found-
   *        year, or found-time flags is not set,
   *     *  the day-of-month-value is less than 1 or greater than 31,
   *     *  the year-value is less than 1601,
   *     *  the hour-value is greater than 23,
   *     *  the minute-value is greater than 59, or
   *     *  the second-value is greater than 59.
   *     (Note that leap seconds cannot be represented in this syntax.)"
   *
   * So, in order as above:
   */
  if (
    dayOfMonth === null || month === null || year === null || second === null ||
    dayOfMonth < 1 || dayOfMonth > 31 ||
    year < 1601 ||
    hour > 23 ||
    minute > 59 ||
    second > 59
  ) {
    return;
  }

  return new Date(Date.UTC(year, month, dayOfMonth, hour, minute, second));
}

function formatDate(date) {
  var d = date.getUTCDate(); d = d >= 10 ? d : '0'+d;
  var h = date.getUTCHours(); h = h >= 10 ? h : '0'+h;
  var m = date.getUTCMinutes(); m = m >= 10 ? m : '0'+m;
  var s = date.getUTCSeconds(); s = s >= 10 ? s : '0'+s;
  return NUM_TO_DAY[date.getUTCDay()] + ', ' +
    d+' '+ NUM_TO_MONTH[date.getUTCMonth()] +' '+ date.getUTCFullYear() +' '+
    h+':'+m+':'+s+' GMT';
}

// S5.1.2 Canonicalized Host Names
function canonicalDomain(str) {
  if (str == null) {
    return null;
  }
  str = str.trim().replace(/^\./,''); // S4.1.2.3 & S5.2.3: ignore leading .

  // convert to IDN if any non-ASCII characters
  if (punycode && /[^\u0001-\u007f]/.test(str)) {
    str = punycode.toASCII(str);
  }

  return str.toLowerCase();
}

// S5.1.3 Domain Matching
function domainMatch(str, domStr, canonicalize) {
  if (str == null || domStr == null) {
    return null;
  }
  if (canonicalize !== false) {
    str = canonicalDomain(str);
    domStr = canonicalDomain(domStr);
  }

  /*
   * "The domain string and the string are identical. (Note that both the
   * domain string and the string will have been canonicalized to lower case at
   * this point)"
   */
  if (str == domStr) {
    return true;
  }

  /* "All of the following [three] conditions hold:" (order adjusted from the RFC) */

  /* "* The string is a host name (i.e., not an IP address)." */
  if (net.isIP(str)) {
    return false;
  }

  /* "* The domain string is a suffix of the string" */
  var idx = str.indexOf(domStr);
  if (idx <= 0) {
    return false; // it's a non-match (-1) or prefix (0)
  }

  // e.g "a.b.c".indexOf("b.c") === 2
  // 5 === 3+2
  if (str.length !== domStr.length + idx) { // it's not a suffix
    return false;
  }

  /* "* The last character of the string that is not included in the domain
  * string is a %x2E (".") character." */
  if (str.substr(idx-1,1) !== '.') {
    return false;
  }

  return true;
}


// RFC6265 S5.1.4 Paths and Path-Match

/*
 * "The user agent MUST use an algorithm equivalent to the following algorithm
 * to compute the default-path of a cookie:"
 *
 * Assumption: the path (and not query part or absolute uri) is passed in.
 */
function defaultPath(path) {
  // "2. If the uri-path is empty or if the first character of the uri-path is not
  // a %x2F ("/") character, output %x2F ("/") and skip the remaining steps.
  if (!path || path.substr(0,1) !== "/") {
    return "/";
  }

  // "3. If the uri-path contains no more than one %x2F ("/") character, output
  // %x2F ("/") and skip the remaining step."
  if (path === "/") {
    return path;
  }

  var rightSlash = path.lastIndexOf("/");
  if (rightSlash === 0) {
    return "/";
  }

  // "4. Output the characters of the uri-path from the first character up to,
  // but not including, the right-most %x2F ("/")."
  return path.slice(0, rightSlash);
}

function trimTerminator(str) {
  for (var t = 0; t < TERMINATORS.length; t++) {
    var terminatorIdx = str.indexOf(TERMINATORS[t]);
    if (terminatorIdx !== -1) {
      str = str.substr(0,terminatorIdx);
    }
  }

  return str;
}

function parseCookiePair(cookiePair, looseMode) {
  cookiePair = trimTerminator(cookiePair);

  var firstEq = cookiePair.indexOf('=');
  if (looseMode) {
    if (firstEq === 0) { // '=' is immediately at start
      cookiePair = cookiePair.substr(1);
      firstEq = cookiePair.indexOf('='); // might still need to split on '='
    }
  } else { // non-loose mode
    if (firstEq <= 0) { // no '=' or is at start
      return; // needs to have non-empty "cookie-name"
    }
  }

  var cookieName, cookieValue;
  if (firstEq <= 0) {
    cookieName = "";
    cookieValue = cookiePair.trim();
  } else {
    cookieName = cookiePair.substr(0, firstEq).trim();
    cookieValue = cookiePair.substr(firstEq+1).trim();
  }

  if (CONTROL_CHARS.test(cookieName) || CONTROL_CHARS.test(cookieValue)) {
    return;
  }

  var c = new Cookie();
  c.key = cookieName;
  c.value = cookieValue;
  return c;
}

function parse(str, options) {
  if (!options || typeof options !== 'object') {
    options = {};
  }
  str = str.trim();

  // We use a regex to parse the "name-value-pair" part of S5.2
  var firstSemi = str.indexOf(';'); // S5.2 step 1
  var cookiePair = (firstSemi === -1) ? str : str.substr(0, firstSemi);
  var c = parseCookiePair(cookiePair, !!options.loose);
  if (!c) {
    return;
  }

  if (firstSemi === -1) {
    return c;
  }

  // S5.2.3 "unparsed-attributes consist of the remainder of the set-cookie-string
  // (including the %x3B (";") in question)." plus later on in the same section
  // "discard the first ";" and trim".
  var unparsed = str.slice(firstSemi + 1).trim();

  // "If the unparsed-attributes string is empty, skip the rest of these
  // steps."
  if (unparsed.length === 0) {
    return c;
  }

  /*
   * S5.2 says that when looping over the items "[p]rocess the attribute-name
   * and attribute-value according to the requirements in the following
   * subsections" for every item.  Plus, for many of the individual attributes
   * in S5.3 it says to use the "attribute-value of the last attribute in the
   * cookie-attribute-list".  Therefore, in this implementation, we overwrite
   * the previous value.
   */
  var cookie_avs = unparsed.split(';');
  while (cookie_avs.length) {
    var av = cookie_avs.shift().trim();
    if (av.length === 0) { // happens if ";;" appears
      continue;
    }
    var av_sep = av.indexOf('=');
    var av_key, av_value;

    if (av_sep === -1) {
      av_key = av;
      av_value = null;
    } else {
      av_key = av.substr(0,av_sep);
      av_value = av.substr(av_sep+1);
    }

    av_key = av_key.trim().toLowerCase();

    if (av_value) {
      av_value = av_value.trim();
    }

    switch(av_key) {
    case 'expires': // S5.2.1
      if (av_value) {
        var exp = parseDate(av_value);
        // "If the attribute-value failed to parse as a cookie date, ignore the
        // cookie-av."
        if (exp) {
          // over and underflow not realistically a concern: V8's getTime() seems to
          // store something larger than a 32-bit time_t (even with 32-bit node)
          c.expires = exp;
        }
      }
      break;

    case 'max-age': // S5.2.2
      if (av_value) {
        // "If the first character of the attribute-value is not a DIGIT or a "-"
        // character ...[or]... If the remainder of attribute-value contains a
        // non-DIGIT character, ignore the cookie-av."
        if (/^-?[0-9]+$/.test(av_value)) {
          var delta = parseInt(av_value, 10);
          // "If delta-seconds is less than or equal to zero (0), let expiry-time
          // be the earliest representable date and time."
          c.setMaxAge(delta);
        }
      }
      break;

    case 'domain': // S5.2.3
      // "If the attribute-value is empty, the behavior is undefined.  However,
      // the user agent SHOULD ignore the cookie-av entirely."
      if (av_value) {
        // S5.2.3 "Let cookie-domain be the attribute-value without the leading %x2E
        // (".") character."
        var domain = av_value.trim().replace(/^\./, '');
        if (domain) {
          // "Convert the cookie-domain to lower case."
          c.domain = domain.toLowerCase();
        }
      }
      break;

    case 'path': // S5.2.4
      /*
       * "If the attribute-value is empty or if the first character of the
       * attribute-value is not %x2F ("/"):
       *   Let cookie-path be the default-path.
       * Otherwise:
       *   Let cookie-path be the attribute-value."
       *
       * We'll represent the default-path as null since it depends on the
       * context of the parsing.
       */
      c.path = av_value && av_value[0] === "/" ? av_value : null;
      break;

    case 'secure': // S5.2.5
      /*
       * "If the attribute-name case-insensitively matches the string "Secure",
       * the user agent MUST append an attribute to the cookie-attribute-list
       * with an attribute-name of Secure and an empty attribute-value."
       */
      c.secure = true;
      break;

    case 'httponly': // S5.2.6 -- effectively the same as 'secure'
      c.httpOnly = true;
      break;

    default:
      c.extensions = c.extensions || [];
      c.extensions.push(av);
      break;
    }
  }

  return c;
}

// avoid the V8 deoptimization monster!
function jsonParse(str) {
  var obj;
  try {
    obj = JSON.parse(str);
  } catch (e) {
    return e;
  }
  return obj;
}

function fromJSON(str) {
  if (!str) {
    return null;
  }

  var obj;
  if (typeof str === 'string') {
    obj = jsonParse(str);
    if (obj instanceof Error) {
      return null;
    }
  } else {
    // assume it's an Object
    obj = str;
  }

  var c = new Cookie();
  for (var i=0; i<Cookie.serializableProperties.length; i++) {
    var prop = Cookie.serializableProperties[i];
    if (obj[prop] === undefined ||
        obj[prop] === Cookie.prototype[prop])
    {
      continue; // leave as prototype default
    }

    if (prop === 'expires' ||
        prop === 'creation' ||
        prop === 'lastAccessed')
    {
      if (obj[prop] === null) {
        c[prop] = null;
      } else {
        c[prop] = obj[prop] == "Infinity" ?
          "Infinity" : new Date(obj[prop]);
      }
    } else {
      c[prop] = obj[prop];
    }
  }

  return c;
}

/* Section 5.4 part 2:
 * "*  Cookies with longer paths are listed before cookies with
 *     shorter paths.
 *
 *  *  Among cookies that have equal-length path fields, cookies with
 *     earlier creation-times are listed before cookies with later
 *     creation-times."
 */

function cookieCompare(a,b) {
  var cmp = 0;

  // descending for length: b CMP a
  var aPathLen = a.path ? a.path.length : 0;
  var bPathLen = b.path ? b.path.length : 0;
  cmp = bPathLen - aPathLen;
  if (cmp !== 0) {
    return cmp;
  }

  // ascending for time: a CMP b
  var aTime = a.creation ? a.creation.getTime() : MAX_TIME;
  var bTime = b.creation ? b.creation.getTime() : MAX_TIME;
  cmp = aTime - bTime;
  if (cmp !== 0) {
    return cmp;
  }

  // break ties for the same millisecond (precision of JavaScript's clock)
  cmp = a.creationIndex - b.creationIndex;

  return cmp;
}

// Gives the permutation of all possible pathMatch()es of a given path. The
// array is in longest-to-shortest order.  Handy for indexing.
function permutePath(path) {
  if (path === '/') {
    return ['/'];
  }
  if (path.lastIndexOf('/') === path.length-1) {
    path = path.substr(0,path.length-1);
  }
  var permutations = [path];
  while (path.length > 1) {
    var lindex = path.lastIndexOf('/');
    if (lindex === 0) {
      break;
    }
    path = path.substr(0,lindex);
    permutations.push(path);
  }
  permutations.push('/');
  return permutations;
}

function getCookieContext(url) {
  if (url instanceof Object) {
    return url;
  }
  // NOTE: decodeURI will throw on malformed URIs (see GH-32).
  // Therefore, we will just skip decoding for such URIs.
  try {
    url = decodeURI(url);
  }
  catch(err) {
    // Silently swallow error
  }

  return urlParse(url);
}

function Cookie(options) {
  options = options || {};

  Object.keys(options).forEach(function(prop) {
    if (Cookie.prototype.hasOwnProperty(prop) &&
        Cookie.prototype[prop] !== options[prop] &&
        prop.substr(0,1) !== '_')
    {
      this[prop] = options[prop];
    }
  }, this);

  this.creation = this.creation || new Date();

  // used to break creation ties in cookieCompare():
  Object.defineProperty(this, 'creationIndex', {
    configurable: false,
    enumerable: false, // important for assert.deepEqual checks
    writable: true,
    value: ++Cookie.cookiesCreated
  });
}

Cookie.cookiesCreated = 0; // incremented each time a cookie is created

Cookie.parse = parse;
Cookie.fromJSON = fromJSON;

Cookie.prototype.key = "";
Cookie.prototype.value = "";

// the order in which the RFC has them:
Cookie.prototype.expires = "Infinity"; // coerces to literal Infinity
Cookie.prototype.maxAge = null; // takes precedence over expires for TTL
Cookie.prototype.domain = null;
Cookie.prototype.path = null;
Cookie.prototype.secure = false;
Cookie.prototype.httpOnly = false;
Cookie.prototype.extensions = null;

// set by the CookieJar:
Cookie.prototype.hostOnly = null; // boolean when set
Cookie.prototype.pathIsDefault = null; // boolean when set
Cookie.prototype.creation = null; // Date when set; defaulted by Cookie.parse
Cookie.prototype.lastAccessed = null; // Date when set
Object.defineProperty(Cookie.prototype, 'creationIndex', {
  configurable: true,
  enumerable: false,
  writable: true,
  value: 0
});

Cookie.serializableProperties = Object.keys(Cookie.prototype)
  .filter(function(prop) {
    return !(
      Cookie.prototype[prop] instanceof Function ||
      prop === 'creationIndex' ||
      prop.substr(0,1) === '_'
    );
  });

Cookie.prototype.inspect = function inspect() {
  var now = Date.now();
  return 'Cookie="'+this.toString() +
    '; hostOnly='+(this.hostOnly != null ? this.hostOnly : '?') +
    '; aAge='+(this.lastAccessed ? (now-this.lastAccessed.getTime())+'ms' : '?') +
    '; cAge='+(this.creation ? (now-this.creation.getTime())+'ms' : '?') +
    '"';
};

// Use the new custom inspection symbol to add the custom inspect function if
// available.
if (util.inspect.custom) {
  Cookie.prototype[util.inspect.custom] = Cookie.prototype.inspect;
}

Cookie.prototype.toJSON = function() {
  var obj = {};

  var props = Cookie.serializableProperties;
  for (var i=0; i<props.length; i++) {
    var prop = props[i];
    if (this[prop] === Cookie.prototype[prop]) {
      continue; // leave as prototype default
    }

    if (prop === 'expires' ||
        prop === 'creation' ||
        prop === 'lastAccessed')
    {
      if (this[prop] === null) {
        obj[prop] = null;
      } else {
        obj[prop] = this[prop] == "Infinity" ? // intentionally not ===
          "Infinity" : this[prop].toISOString();
      }
    } else if (prop === 'maxAge') {
      if (this[prop] !== null) {
        // again, intentionally not ===
        obj[prop] = (this[prop] == Infinity || this[prop] == -Infinity) ?
          this[prop].toString() : this[prop];
      }
    } else {
      if (this[prop] !== Cookie.prototype[prop]) {
        obj[prop] = this[prop];
      }
    }
  }

  return obj;
};

Cookie.prototype.clone = function() {
  return fromJSON(this.toJSON());
};

Cookie.prototype.validate = function validate() {
  if (!COOKIE_OCTETS.test(this.value)) {
    return false;
  }
  if (this.expires != Infinity && !(this.expires instanceof Date) && !parseDate(this.expires)) {
    return false;
  }
  if (this.maxAge != null && this.maxAge <= 0) {
    return false; // "Max-Age=" non-zero-digit *DIGIT
  }
  if (this.path != null && !PATH_VALUE.test(this.path)) {
    return false;
  }

  var cdomain = this.cdomain();
  if (cdomain) {
    if (cdomain.match(/\.$/)) {
      return false; // S4.1.2.3 suggests that this is bad. domainMatch() tests confirm this
    }
    var suffix = pubsuffix.getPublicSuffix(cdomain);
    if (suffix == null) { // it's a public suffix
      return false;
    }
  }
  return true;
};

Cookie.prototype.setExpires = function setExpires(exp) {
  if (exp instanceof Date) {
    this.expires = exp;
  } else {
    this.expires = parseDate(exp) || "Infinity";
  }
};

Cookie.prototype.setMaxAge = function setMaxAge(age) {
  if (age === Infinity || age === -Infinity) {
    this.maxAge = age.toString(); // so JSON.stringify() works
  } else {
    this.maxAge = age;
  }
};

// gives Cookie header format
Cookie.prototype.cookieString = function cookieString() {
  var val = this.value;
  if (val == null) {
    val = '';
  }
  if (this.key === '') {
    return val;
  }
  return this.key+'='+val;
};

// gives Set-Cookie header format
Cookie.prototype.toString = function toString() {
  var str = this.cookieString();

  if (this.expires != Infinity) {
    if (this.expires instanceof Date) {
      str += '; Expires='+formatDate(this.expires);
    } else {
      str += '; Expires='+this.expires;
    }
  }

  if (this.maxAge != null && this.maxAge != Infinity) {
    str += '; Max-Age='+this.maxAge;
  }

  if (this.domain && !this.hostOnly) {
    str += '; Domain='+this.domain;
  }
  if (this.path) {
    str += '; Path='+this.path;
  }

  if (this.secure) {
    str += '; Secure';
  }
  if (this.httpOnly) {
    str += '; HttpOnly';
  }
  if (this.extensions) {
    this.extensions.forEach(function(ext) {
      str += '; '+ext;
    });
  }

  return str;
};

// TTL() partially replaces the "expiry-time" parts of S5.3 step 3 (setCookie()
// elsewhere)
// S5.3 says to give the "latest representable date" for which we use Infinity
// For "expired" we use 0
Cookie.prototype.TTL = function TTL(now) {
  /* RFC6265 S4.1.2.2 If a cookie has both the Max-Age and the Expires
   * attribute, the Max-Age attribute has precedence and controls the
   * expiration date of the cookie.
   * (Concurs with S5.3 step 3)
   */
  if (this.maxAge != null) {
    return this.maxAge<=0 ? 0 : this.maxAge*1000;
  }

  var expires = this.expires;
  if (expires != Infinity) {
    if (!(expires instanceof Date)) {
      expires = parseDate(expires) || Infinity;
    }

    if (expires == Infinity) {
      return Infinity;
    }

    return expires.getTime() - (now || Date.now());
  }

  return Infinity;
};

// expiryTime() replaces the "expiry-time" parts of S5.3 step 3 (setCookie()
// elsewhere)
Cookie.prototype.expiryTime = function expiryTime(now) {
  if (this.maxAge != null) {
    var relativeTo = now || this.creation || new Date();
    var age = (this.maxAge <= 0) ? -Infinity : this.maxAge*1000;
    return relativeTo.getTime() + age;
  }

  if (this.expires == Infinity) {
    return Infinity;
  }
  return this.expires.getTime();
};

// expiryDate() replaces the "expiry-time" parts of S5.3 step 3 (setCookie()
// elsewhere), except it returns a Date
Cookie.prototype.expiryDate = function expiryDate(now) {
  var millisec = this.expiryTime(now);
  if (millisec == Infinity) {
    return new Date(MAX_TIME);
  } else if (millisec == -Infinity) {
    return new Date(MIN_TIME);
  } else {
    return new Date(millisec);
  }
};

// This replaces the "persistent-flag" parts of S5.3 step 3
Cookie.prototype.isPersistent = function isPersistent() {
  return (this.maxAge != null || this.expires != Infinity);
};

// Mostly S5.1.2 and S5.2.3:
Cookie.prototype.cdomain =
Cookie.prototype.canonicalizedDomain = function canonicalizedDomain() {
  if (this.domain == null) {
    return null;
  }
  return canonicalDomain(this.domain);
};

function CookieJar(store, options) {
  if (typeof options === "boolean") {
    options = {rejectPublicSuffixes: options};
  } else if (options == null) {
    options = {};
  }
  if (options.rejectPublicSuffixes != null) {
    this.rejectPublicSuffixes = options.rejectPublicSuffixes;
  }
  if (options.looseMode != null) {
    this.enableLooseMode = options.looseMode;
  }

  if (!store) {
    store = new MemoryCookieStore();
  }
  this.store = store;
}
CookieJar.prototype.store = null;
CookieJar.prototype.rejectPublicSuffixes = true;
CookieJar.prototype.enableLooseMode = false;
var CAN_BE_SYNC = [];

CAN_BE_SYNC.push('setCookie');
CookieJar.prototype.setCookie = function(cookie, url, options, cb) {
  var err;
  var context = getCookieContext(url);
  if (options instanceof Function) {
    cb = options;
    options = {};
  }

  var host = canonicalDomain(context.hostname);
  var loose = this.enableLooseMode;
  if (options.loose != null) {
    loose = options.loose;
  }

  // S5.3 step 1
  if (!(cookie instanceof Cookie)) {
    cookie = Cookie.parse(cookie, { loose: loose });
  }
  if (!cookie) {
    err = new Error("Cookie failed to parse");
    return cb(options.ignoreError ? null : err);
  }

  // S5.3 step 2
  var now = options.now || new Date(); // will assign later to save effort in the face of errors

  // S5.3 step 3: NOOP; persistent-flag and expiry-time is handled by getCookie()

  // S5.3 step 4: NOOP; domain is null by default

  // S5.3 step 5: public suffixes
  if (this.rejectPublicSuffixes && cookie.domain) {
    var suffix = pubsuffix.getPublicSuffix(cookie.cdomain());
    if (suffix == null) { // e.g. "com"
      err = new Error("Cookie has domain set to a public suffix");
      return cb(options.ignoreError ? null : err);
    }
  }

  // S5.3 step 6:
  if (cookie.domain) {
    if (!domainMatch(host, cookie.cdomain(), false)) {
      err = new Error("Cookie not in this host's domain. Cookie:"+cookie.cdomain()+" Request:"+host);
      return cb(options.ignoreError ? null : err);
    }

    if (cookie.hostOnly == null) { // don't reset if already set
      cookie.hostOnly = false;
    }

  } else {
    cookie.hostOnly = true;
    cookie.domain = host;
  }

  //S5.2.4 If the attribute-value is empty or if the first character of the
  //attribute-value is not %x2F ("/"):
  //Let cookie-path be the default-path.
  if (!cookie.path || cookie.path[0] !== '/') {
    cookie.path = defaultPath(context.pathname);
    cookie.pathIsDefault = true;
  }

  // S5.3 step 8: NOOP; secure attribute
  // S5.3 step 9: NOOP; httpOnly attribute

  // S5.3 step 10
  if (options.http === false && cookie.httpOnly) {
    err = new Error("Cookie is HttpOnly and this isn't an HTTP API");
    return cb(options.ignoreError ? null : err);
  }

  var store = this.store;

  if (!store.updateCookie) {
    store.updateCookie = function(oldCookie, newCookie, cb) {
      this.putCookie(newCookie, cb);
    };
  }

  function withCookie(err, oldCookie) {
    if (err) {
      return cb(err);
    }

    var next = function(err) {
      if (err) {
        return cb(err);
      } else {
        cb(null, cookie);
      }
    };

    if (oldCookie) {
      // S5.3 step 11 - "If the cookie store contains a cookie with the same name,
      // domain, and path as the newly created cookie:"
      if (options.http === false && oldCookie.httpOnly) { // step 11.2
        err = new Error("old Cookie is HttpOnly and this isn't an HTTP API");
        return cb(options.ignoreError ? null : err);
      }
      cookie.creation = oldCookie.creation; // step 11.3
      cookie.creationIndex = oldCookie.creationIndex; // preserve tie-breaker
      cookie.lastAccessed = now;
      // Step 11.4 (delete cookie) is implied by just setting the new one:
      store.updateCookie(oldCookie, cookie, next); // step 12

    } else {
      cookie.creation = cookie.lastAccessed = now;
      store.putCookie(cookie, next); // step 12
    }
  }

  store.findCookie(cookie.domain, cookie.path, cookie.key, withCookie);
};

// RFC6365 S5.4
CAN_BE_SYNC.push('getCookies');
CookieJar.prototype.getCookies = function(url, options, cb) {
  var context = getCookieContext(url);
  if (options instanceof Function) {
    cb = options;
    options = {};
  }

  var host = canonicalDomain(context.hostname);
  var path = context.pathname || '/';

  var secure = options.secure;
  if (secure == null && context.protocol &&
      (context.protocol == 'https:' || context.protocol == 'wss:'))
  {
    secure = true;
  }

  var http = options.http;
  if (http == null) {
    http = true;
  }

  var now = options.now || Date.now();
  var expireCheck = options.expire !== false;
  var allPaths = !!options.allPaths;
  var store = this.store;

  function matchingCookie(c) {
    // "Either:
    //   The cookie's host-only-flag is true and the canonicalized
    //   request-host is identical to the cookie's domain.
    // Or:
    //   The cookie's host-only-flag is false and the canonicalized
    //   request-host domain-matches the cookie's domain."
    if (c.hostOnly) {
      if (c.domain != host) {
        return false;
      }
    } else {
      if (!domainMatch(host, c.domain, false)) {
        return false;
      }
    }

    // "The request-uri's path path-matches the cookie's path."
    if (!allPaths && !pathMatch(path, c.path)) {
      return false;
    }

    // "If the cookie's secure-only-flag is true, then the request-uri's
    // scheme must denote a "secure" protocol"
    if (c.secure && !secure) {
      return false;
    }

    // "If the cookie's http-only-flag is true, then exclude the cookie if the
    // cookie-string is being generated for a "non-HTTP" API"
    if (c.httpOnly && !http) {
      return false;
    }

    // deferred from S5.3
    // non-RFC: allow retention of expired cookies by choice
    if (expireCheck && c.expiryTime() <= now) {
      store.removeCookie(c.domain, c.path, c.key, function(){}); // result ignored
      return false;
    }

    return true;
  }

  store.findCookies(host, allPaths ? null : path, function(err,cookies) {
    if (err) {
      return cb(err);
    }

    cookies = cookies.filter(matchingCookie);

    // sorting of S5.4 part 2
    if (options.sort !== false) {
      cookies = cookies.sort(cookieCompare);
    }

    // S5.4 part 3
    var now = new Date();
    cookies.forEach(function(c) {
      c.lastAccessed = now;
    });
    // TODO persist lastAccessed

    cb(null,cookies);
  });
};

CAN_BE_SYNC.push('getCookieString');
CookieJar.prototype.getCookieString = function(/*..., cb*/) {
  var args = Array.prototype.slice.call(arguments,0);
  var cb = args.pop();
  var next = function(err,cookies) {
    if (err) {
      cb(err);
    } else {
      cb(null, cookies
        .sort(cookieCompare)
        .map(function(c){
          return c.cookieString();
        })
        .join('; '));
    }
  };
  args.push(next);
  this.getCookies.apply(this,args);
};

CAN_BE_SYNC.push('getSetCookieStrings');
CookieJar.prototype.getSetCookieStrings = function(/*..., cb*/) {
  var args = Array.prototype.slice.call(arguments,0);
  var cb = args.pop();
  var next = function(err,cookies) {
    if (err) {
      cb(err);
    } else {
      cb(null, cookies.map(function(c){
        return c.toString();
      }));
    }
  };
  args.push(next);
  this.getCookies.apply(this,args);
};

CAN_BE_SYNC.push('serialize');
CookieJar.prototype.serialize = function(cb) {
  var type = this.store.constructor.name;
  if (type === 'Object') {
    type = null;
  }

  // update README.md "Serialization Format" if you change this, please!
  var serialized = {
    // The version of tough-cookie that serialized this jar. Generally a good
    // practice since future versions can make data import decisions based on
    // known past behavior. When/if this matters, use `semver`.
    version: 'tough-cookie@'+VERSION,

    // add the store type, to make humans happy:
    storeType: type,

    // CookieJar configuration:
    rejectPublicSuffixes: !!this.rejectPublicSuffixes,

    // this gets filled from getAllCookies:
    cookies: []
  };

  if (!(this.store.getAllCookies &&
        typeof this.store.getAllCookies === 'function'))
  {
    return cb(new Error('store does not support getAllCookies and cannot be serialized'));
  }

  this.store.getAllCookies(function(err,cookies) {
    if (err) {
      return cb(err);
    }

    serialized.cookies = cookies.map(function(cookie) {
      // convert to serialized 'raw' cookies
      cookie = (cookie instanceof Cookie) ? cookie.toJSON() : cookie;

      // Remove the index so new ones get assigned during deserialization
      delete cookie.creationIndex;

      return cookie;
    });

    return cb(null, serialized);
  });
};

// well-known name that JSON.stringify calls
CookieJar.prototype.toJSON = function() {
  return this.serializeSync();
};

// use the class method CookieJar.deserialize instead of calling this directly
CAN_BE_SYNC.push('_importCookies');
CookieJar.prototype._importCookies = function(serialized, cb) {
  var jar = this;
  var cookies = serialized.cookies;
  if (!cookies || !Array.isArray(cookies)) {
    return cb(new Error('serialized jar has no cookies array'));
  }
  cookies = cookies.slice(); // do not modify the original

  function putNext(err) {
    if (err) {
      return cb(err);
    }

    if (!cookies.length) {
      return cb(err, jar);
    }

    var cookie;
    try {
      cookie = fromJSON(cookies.shift());
    } catch (e) {
      return cb(e);
    }

    if (cookie === null) {
      return putNext(null); // skip this cookie
    }

    jar.store.putCookie(cookie, putNext);
  }

  putNext();
};

CookieJar.deserialize = function(strOrObj, store, cb) {
  if (arguments.length !== 3) {
    // store is optional
    cb = store;
    store = null;
  }

  var serialized;
  if (typeof strOrObj === 'string') {
    serialized = jsonParse(strOrObj);
    if (serialized instanceof Error) {
      return cb(serialized);
    }
  } else {
    serialized = strOrObj;
  }

  var jar = new CookieJar(store, serialized.rejectPublicSuffixes);
  jar._importCookies(serialized, function(err) {
    if (err) {
      return cb(err);
    }
    cb(null, jar);
  });
};

CookieJar.deserializeSync = function(strOrObj, store) {
  var serialized = typeof strOrObj === 'string' ?
    JSON.parse(strOrObj) : strOrObj;
  var jar = new CookieJar(store, serialized.rejectPublicSuffixes);

  // catch this mistake early:
  if (!jar.store.synchronous) {
    throw new Error('CookieJar store is not synchronous; use async API instead.');
  }

  jar._importCookiesSync(serialized);
  return jar;
};
CookieJar.fromJSON = CookieJar.deserializeSync;

CAN_BE_SYNC.push('clone');
CookieJar.prototype.clone = function(newStore, cb) {
  if (arguments.length === 1) {
    cb = newStore;
    newStore = null;
  }

  this.serialize(function(err,serialized) {
    if (err) {
      return cb(err);
    }
    CookieJar.deserialize(newStore, serialized, cb);
  });
};

// Use a closure to provide a true imperative API for synchronous stores.
function syncWrap(method) {
  return function() {
    if (!this.store.synchronous) {
      throw new Error('CookieJar store is not synchronous; use async API instead.');
    }

    var args = Array.prototype.slice.call(arguments);
    var syncErr, syncResult;
    args.push(function syncCb(err, result) {
      syncErr = err;
      syncResult = result;
    });
    this[method].apply(this, args);

    if (syncErr) {
      throw syncErr;
    }
    return syncResult;
  };
}

// wrap all declared CAN_BE_SYNC methods in the sync wrapper
CAN_BE_SYNC.forEach(function(method) {
  CookieJar.prototype[method+'Sync'] = syncWrap(method);
});

exports.CookieJar = CookieJar;
exports.Cookie = Cookie;
exports.Store = Store;
exports.MemoryCookieStore = MemoryCookieStore;
exports.parseDate = parseDate;
exports.formatDate = formatDate;
exports.parse = parse;
exports.fromJSON = fromJSON;
exports.domainMatch = domainMatch;
exports.defaultPath = defaultPath;
exports.pathMatch = pathMatch;
exports.getPublicSuffix = pubsuffix.getPublicSuffix;
exports.cookieCompare = cookieCompare;
exports.permuteDomain = __webpack_require__(/*! ./permuteDomain */ "yvLu").permuteDomain;
exports.permutePath = permutePath;
exports.canonicalDomain = canonicalDomain;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../console-browserify/index.js */ "ziTh")))

/***/ }),

/***/ "yvLu":
/*!********************************************************!*\
  !*** ./node_modules/tough-cookie/lib/permuteDomain.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*!
 * Copyright (c) 2015, Salesforce.com, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice,
 * this list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the documentation
 * and/or other materials provided with the distribution.
 *
 * 3. Neither the name of Salesforce.com nor the names of its contributors may
 * be used to endorse or promote products derived from this software without
 * specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

var pubsuffix = __webpack_require__(/*! ./pubsuffix-psl */ "NaPP");

// Gives the permutation of all possible domainMatch()es of a given domain. The
// array is in shortest-to-longest order.  Handy for indexing.
function permuteDomain (domain) {
  var pubSuf = pubsuffix.getPublicSuffix(domain);
  if (!pubSuf) {
    return null;
  }
  if (pubSuf == domain) {
    return [domain];
  }

  var prefix = domain.slice(0, -(pubSuf.length + 1)); // ".example.com"
  var parts = prefix.split('.').reverse();
  var cur = pubSuf;
  var permutations = [cur];
  while (parts.length) {
    cur = parts.shift() + '.' + cur;
    permutations.push(cur);
  }
  return permutations;
}

exports.permuteDomain = permuteDomain;


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdG91Z2gtY29va2llL2xpYi9wYXRoTWF0Y2guanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3RvdWdoLWNvb2tpZS9saWIvcHVic3VmZml4LXBzbC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdG91Z2gtY29va2llL2xpYi9tZW1zdG9yZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdG91Z2gtY29va2llL2xpYi9zdG9yZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdG91Z2gtY29va2llL2xpYi9jb29raWUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3RvdWdoLWNvb2tpZS9saWIvcGVybXV0ZURvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0NBQWdDLCtCQUErQjtBQUMvRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ2E7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7OztBQzVEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQ0FBZ0MsK0JBQStCO0FBQy9EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDYTtBQUNiLFVB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TDtBQUNBLG9DQUFvQztBQUNwQztBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSw4REFBOEQsRUFBRTtBQUNoRTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCOztBQUU1QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQSwyQkFBMkI7QUFDM0I7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHdEQUF3RDtBQUN4RDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBEQUEwRDtBQUMxRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLG1CQUFPLENBQUMsNkJBQWlCO0FBQ2pEO0FBQ0E7Ozs7Ozs7Ozs7Ozs7O0FDdDVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQ0FBZ0MsK0JBQStCO0FBQy9EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDYTtBQUNiLGdCQUFnQixtQkFBTyxDQUFDLDZCQUFpQjs7QUFFekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEscURBQXFEO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSIsImZpbGUiOiJidWlsZC92ZW5kb3IvdmVuZG9yLnRvdWdoLWNvb2tpZS4zMGNlMjcwNzNjNjU2NzU5ZWY0OC5jaHVuay5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxyXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTUsIFNhbGVzZm9yY2UuY29tLCBJbmMuXHJcbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXHJcbiAqXHJcbiAqIFJlZGlzdHJpYnV0aW9uIGFuZCB1c2UgaW4gc291cmNlIGFuZCBiaW5hcnkgZm9ybXMsIHdpdGggb3Igd2l0aG91dFxyXG4gKiBtb2RpZmljYXRpb24sIGFyZSBwZXJtaXR0ZWQgcHJvdmlkZWQgdGhhdCB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnMgYXJlIG1ldDpcclxuICpcclxuICogMS4gUmVkaXN0cmlidXRpb25zIG9mIHNvdXJjZSBjb2RlIG11c3QgcmV0YWluIHRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlLFxyXG4gKiB0aGlzIGxpc3Qgb2YgY29uZGl0aW9ucyBhbmQgdGhlIGZvbGxvd2luZyBkaXNjbGFpbWVyLlxyXG4gKlxyXG4gKiAyLiBSZWRpc3RyaWJ1dGlvbnMgaW4gYmluYXJ5IGZvcm0gbXVzdCByZXByb2R1Y2UgdGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UsXHJcbiAqIHRoaXMgbGlzdCBvZiBjb25kaXRpb25zIGFuZCB0aGUgZm9sbG93aW5nIGRpc2NsYWltZXIgaW4gdGhlIGRvY3VtZW50YXRpb25cclxuICogYW5kL29yIG90aGVyIG1hdGVyaWFscyBwcm92aWRlZCB3aXRoIHRoZSBkaXN0cmlidXRpb24uXHJcbiAqXHJcbiAqIDMuIE5laXRoZXIgdGhlIG5hbWUgb2YgU2FsZXNmb3JjZS5jb20gbm9yIHRoZSBuYW1lcyBvZiBpdHMgY29udHJpYnV0b3JzIG1heVxyXG4gKiBiZSB1c2VkIHRvIGVuZG9yc2Ugb3IgcHJvbW90ZSBwcm9kdWN0cyBkZXJpdmVkIGZyb20gdGhpcyBzb2Z0d2FyZSB3aXRob3V0XHJcbiAqIHNwZWNpZmljIHByaW9yIHdyaXR0ZW4gcGVybWlzc2lvbi5cclxuICpcclxuICogVEhJUyBTT0ZUV0FSRSBJUyBQUk9WSURFRCBCWSBUSEUgQ09QWVJJR0hUIEhPTERFUlMgQU5EIENPTlRSSUJVVE9SUyBcIkFTIElTXCJcclxuICogQU5EIEFOWSBFWFBSRVNTIE9SIElNUExJRUQgV0FSUkFOVElFUywgSU5DTFVESU5HLCBCVVQgTk9UIExJTUlURUQgVE8sIFRIRVxyXG4gKiBJTVBMSUVEIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZIEFORCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRVxyXG4gKiBBUkUgRElTQ0xBSU1FRC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIENPUFlSSUdIVCBIT0xERVIgT1IgQ09OVFJJQlVUT1JTIEJFXHJcbiAqIExJQUJMRSBGT1IgQU5ZIERJUkVDVCwgSU5ESVJFQ1QsIElOQ0lERU5UQUwsIFNQRUNJQUwsIEVYRU1QTEFSWSwgT1JcclxuICogQ09OU0VRVUVOVElBTCBEQU1BR0VTIChJTkNMVURJTkcsIEJVVCBOT1QgTElNSVRFRCBUTywgUFJPQ1VSRU1FTlQgT0ZcclxuICogU1VCU1RJVFVURSBHT09EUyBPUiBTRVJWSUNFUzsgTE9TUyBPRiBVU0UsIERBVEEsIE9SIFBST0ZJVFM7IE9SIEJVU0lORVNTXHJcbiAqIElOVEVSUlVQVElPTikgSE9XRVZFUiBDQVVTRUQgQU5EIE9OIEFOWSBUSEVPUlkgT0YgTElBQklMSVRZLCBXSEVUSEVSIElOXHJcbiAqIENPTlRSQUNULCBTVFJJQ1QgTElBQklMSVRZLCBPUiBUT1JUIChJTkNMVURJTkcgTkVHTElHRU5DRSBPUiBPVEhFUldJU0UpXHJcbiAqIEFSSVNJTkcgSU4gQU5ZIFdBWSBPVVQgT0YgVEhFIFVTRSBPRiBUSElTIFNPRlRXQVJFLCBFVkVOIElGIEFEVklTRUQgT0YgVEhFXHJcbiAqIFBPU1NJQklMSVRZIE9GIFNVQ0ggREFNQUdFLlxyXG4gKi9cclxuXCJ1c2Ugc3RyaWN0XCI7XHJcbi8qXHJcbiAqIFwiQSByZXF1ZXN0LXBhdGggcGF0aC1tYXRjaGVzIGEgZ2l2ZW4gY29va2llLXBhdGggaWYgYXQgbGVhc3Qgb25lIG9mIHRoZVxyXG4gKiBmb2xsb3dpbmcgY29uZGl0aW9ucyBob2xkczpcIlxyXG4gKi9cclxuZnVuY3Rpb24gcGF0aE1hdGNoIChyZXFQYXRoLCBjb29raWVQYXRoKSB7XHJcbiAgLy8gXCJvICBUaGUgY29va2llLXBhdGggYW5kIHRoZSByZXF1ZXN0LXBhdGggYXJlIGlkZW50aWNhbC5cIlxyXG4gIGlmIChjb29raWVQYXRoID09PSByZXFQYXRoKSB7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcblxyXG4gIHZhciBpZHggPSByZXFQYXRoLmluZGV4T2YoY29va2llUGF0aCk7XHJcbiAgaWYgKGlkeCA9PT0gMCkge1xyXG4gICAgLy8gXCJvICBUaGUgY29va2llLXBhdGggaXMgYSBwcmVmaXggb2YgdGhlIHJlcXVlc3QtcGF0aCwgYW5kIHRoZSBsYXN0XHJcbiAgICAvLyBjaGFyYWN0ZXIgb2YgdGhlIGNvb2tpZS1wYXRoIGlzICV4MkYgKFwiL1wiKS5cIlxyXG4gICAgaWYgKGNvb2tpZVBhdGguc3Vic3RyKC0xKSA9PT0gXCIvXCIpIHtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gXCIgbyAgVGhlIGNvb2tpZS1wYXRoIGlzIGEgcHJlZml4IG9mIHRoZSByZXF1ZXN0LXBhdGgsIGFuZCB0aGUgZmlyc3RcclxuICAgIC8vIGNoYXJhY3RlciBvZiB0aGUgcmVxdWVzdC1wYXRoIHRoYXQgaXMgbm90IGluY2x1ZGVkIGluIHRoZSBjb29raWUtIHBhdGhcclxuICAgIC8vIGlzIGEgJXgyRiAoXCIvXCIpIGNoYXJhY3Rlci5cIlxyXG4gICAgaWYgKHJlcVBhdGguc3Vic3RyKGNvb2tpZVBhdGgubGVuZ3RoLCAxKSA9PT0gXCIvXCIpIHtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gZmFsc2U7XHJcbn1cclxuXHJcbmV4cG9ydHMucGF0aE1hdGNoID0gcGF0aE1hdGNoO1xyXG4iLCIvKiFcclxuICogQ29weXJpZ2h0IChjKSAyMDE4LCBTYWxlc2ZvcmNlLmNvbSwgSW5jLlxyXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxyXG4gKlxyXG4gKiBSZWRpc3RyaWJ1dGlvbiBhbmQgdXNlIGluIHNvdXJjZSBhbmQgYmluYXJ5IGZvcm1zLCB3aXRoIG9yIHdpdGhvdXRcclxuICogbW9kaWZpY2F0aW9uLCBhcmUgcGVybWl0dGVkIHByb3ZpZGVkIHRoYXQgdGhlIGZvbGxvd2luZyBjb25kaXRpb25zIGFyZSBtZXQ6XHJcbiAqXHJcbiAqIDEuIFJlZGlzdHJpYnV0aW9ucyBvZiBzb3VyY2UgY29kZSBtdXN0IHJldGFpbiB0aGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSxcclxuICogdGhpcyBsaXN0IG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lci5cclxuICpcclxuICogMi4gUmVkaXN0cmlidXRpb25zIGluIGJpbmFyeSBmb3JtIG11c3QgcmVwcm9kdWNlIHRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlLFxyXG4gKiB0aGlzIGxpc3Qgb2YgY29uZGl0aW9ucyBhbmQgdGhlIGZvbGxvd2luZyBkaXNjbGFpbWVyIGluIHRoZSBkb2N1bWVudGF0aW9uXHJcbiAqIGFuZC9vciBvdGhlciBtYXRlcmlhbHMgcHJvdmlkZWQgd2l0aCB0aGUgZGlzdHJpYnV0aW9uLlxyXG4gKlxyXG4gKiAzLiBOZWl0aGVyIHRoZSBuYW1lIG9mIFNhbGVzZm9yY2UuY29tIG5vciB0aGUgbmFtZXMgb2YgaXRzIGNvbnRyaWJ1dG9ycyBtYXlcclxuICogYmUgdXNlZCB0byBlbmRvcnNlIG9yIHByb21vdGUgcHJvZHVjdHMgZGVyaXZlZCBmcm9tIHRoaXMgc29mdHdhcmUgd2l0aG91dFxyXG4gKiBzcGVjaWZpYyBwcmlvciB3cml0dGVuIHBlcm1pc3Npb24uXHJcbiAqXHJcbiAqIFRISVMgU09GVFdBUkUgSVMgUFJPVklERUQgQlkgVEhFIENPUFlSSUdIVCBIT0xERVJTIEFORCBDT05UUklCVVRPUlMgXCJBUyBJU1wiXHJcbiAqIEFORCBBTlkgRVhQUkVTUyBPUiBJTVBMSUVEIFdBUlJBTlRJRVMsIElOQ0xVRElORywgQlVUIE5PVCBMSU1JVEVEIFRPLCBUSEVcclxuICogSU1QTElFRCBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSBBTkQgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0VcclxuICogQVJFIERJU0NMQUlNRUQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBDT1BZUklHSFQgSE9MREVSIE9SIENPTlRSSUJVVE9SUyBCRVxyXG4gKiBMSUFCTEUgRk9SIEFOWSBESVJFQ1QsIElORElSRUNULCBJTkNJREVOVEFMLCBTUEVDSUFMLCBFWEVNUExBUlksIE9SXHJcbiAqIENPTlNFUVVFTlRJQUwgREFNQUdFUyAoSU5DTFVESU5HLCBCVVQgTk9UIExJTUlURUQgVE8sIFBST0NVUkVNRU5UIE9GXHJcbiAqIFNVQlNUSVRVVEUgR09PRFMgT1IgU0VSVklDRVM7IExPU1MgT0YgVVNFLCBEQVRBLCBPUiBQUk9GSVRTOyBPUiBCVVNJTkVTU1xyXG4gKiBJTlRFUlJVUFRJT04pIEhPV0VWRVIgQ0FVU0VEIEFORCBPTiBBTlkgVEhFT1JZIE9GIExJQUJJTElUWSwgV0hFVEhFUiBJTlxyXG4gKiBDT05UUkFDVCwgU1RSSUNUIExJQUJJTElUWSwgT1IgVE9SVCAoSU5DTFVESU5HIE5FR0xJR0VOQ0UgT1IgT1RIRVJXSVNFKVxyXG4gKiBBUklTSU5HIElOIEFOWSBXQVkgT1VUIE9GIFRIRSBVU0UgT0YgVEhJUyBTT0ZUV0FSRSwgRVZFTiBJRiBBRFZJU0VEIE9GIFRIRVxyXG4gKiBQT1NTSUJJTElUWSBPRiBTVUNIIERBTUFHRS5cclxuICovXHJcbid1c2Ugc3RyaWN0JztcclxudmFyIHBzbCA9IHJlcXVpcmUoJ3BzbCcpO1xyXG5cclxuZnVuY3Rpb24gZ2V0UHVibGljU3VmZml4KGRvbWFpbikge1xyXG4gIHJldHVybiBwc2wuZ2V0KGRvbWFpbik7XHJcbn1cclxuXHJcbmV4cG9ydHMuZ2V0UHVibGljU3VmZml4ID0gZ2V0UHVibGljU3VmZml4O1xyXG4iLCIvKiFcclxuICogQ29weXJpZ2h0IChjKSAyMDE1LCBTYWxlc2ZvcmNlLmNvbSwgSW5jLlxyXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxyXG4gKlxyXG4gKiBSZWRpc3RyaWJ1dGlvbiBhbmQgdXNlIGluIHNvdXJjZSBhbmQgYmluYXJ5IGZvcm1zLCB3aXRoIG9yIHdpdGhvdXRcclxuICogbW9kaWZpY2F0aW9uLCBhcmUgcGVybWl0dGVkIHByb3ZpZGVkIHRoYXQgdGhlIGZvbGxvd2luZyBjb25kaXRpb25zIGFyZSBtZXQ6XHJcbiAqXHJcbiAqIDEuIFJlZGlzdHJpYnV0aW9ucyBvZiBzb3VyY2UgY29kZSBtdXN0IHJldGFpbiB0aGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSxcclxuICogdGhpcyBsaXN0IG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lci5cclxuICpcclxuICogMi4gUmVkaXN0cmlidXRpb25zIGluIGJpbmFyeSBmb3JtIG11c3QgcmVwcm9kdWNlIHRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlLFxyXG4gKiB0aGlzIGxpc3Qgb2YgY29uZGl0aW9ucyBhbmQgdGhlIGZvbGxvd2luZyBkaXNjbGFpbWVyIGluIHRoZSBkb2N1bWVudGF0aW9uXHJcbiAqIGFuZC9vciBvdGhlciBtYXRlcmlhbHMgcHJvdmlkZWQgd2l0aCB0aGUgZGlzdHJpYnV0aW9uLlxyXG4gKlxyXG4gKiAzLiBOZWl0aGVyIHRoZSBuYW1lIG9mIFNhbGVzZm9yY2UuY29tIG5vciB0aGUgbmFtZXMgb2YgaXRzIGNvbnRyaWJ1dG9ycyBtYXlcclxuICogYmUgdXNlZCB0byBlbmRvcnNlIG9yIHByb21vdGUgcHJvZHVjdHMgZGVyaXZlZCBmcm9tIHRoaXMgc29mdHdhcmUgd2l0aG91dFxyXG4gKiBzcGVjaWZpYyBwcmlvciB3cml0dGVuIHBlcm1pc3Npb24uXHJcbiAqXHJcbiAqIFRISVMgU09GVFdBUkUgSVMgUFJPVklERUQgQlkgVEhFIENPUFlSSUdIVCBIT0xERVJTIEFORCBDT05UUklCVVRPUlMgXCJBUyBJU1wiXHJcbiAqIEFORCBBTlkgRVhQUkVTUyBPUiBJTVBMSUVEIFdBUlJBTlRJRVMsIElOQ0xVRElORywgQlVUIE5PVCBMSU1JVEVEIFRPLCBUSEVcclxuICogSU1QTElFRCBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSBBTkQgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0VcclxuICogQVJFIERJU0NMQUlNRUQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBDT1BZUklHSFQgSE9MREVSIE9SIENPTlRSSUJVVE9SUyBCRVxyXG4gKiBMSUFCTEUgRk9SIEFOWSBESVJFQ1QsIElORElSRUNULCBJTkNJREVOVEFMLCBTUEVDSUFMLCBFWEVNUExBUlksIE9SXHJcbiAqIENPTlNFUVVFTlRJQUwgREFNQUdFUyAoSU5DTFVESU5HLCBCVVQgTk9UIExJTUlURUQgVE8sIFBST0NVUkVNRU5UIE9GXHJcbiAqIFNVQlNUSVRVVEUgR09PRFMgT1IgU0VSVklDRVM7IExPU1MgT0YgVVNFLCBEQVRBLCBPUiBQUk9GSVRTOyBPUiBCVVNJTkVTU1xyXG4gKiBJTlRFUlJVUFRJT04pIEhPV0VWRVIgQ0FVU0VEIEFORCBPTiBBTlkgVEhFT1JZIE9GIExJQUJJTElUWSwgV0hFVEhFUiBJTlxyXG4gKiBDT05UUkFDVCwgU1RSSUNUIExJQUJJTElUWSwgT1IgVE9SVCAoSU5DTFVESU5HIE5FR0xJR0VOQ0UgT1IgT1RIRVJXSVNFKVxyXG4gKiBBUklTSU5HIElOIEFOWSBXQVkgT1VUIE9GIFRIRSBVU0UgT0YgVEhJUyBTT0ZUV0FSRSwgRVZFTiBJRiBBRFZJU0VEIE9GIFRIRVxyXG4gKiBQT1NTSUJJTElUWSBPRiBTVUNIIERBTUFHRS5cclxuICovXHJcbid1c2Ugc3RyaWN0JztcclxudmFyIFN0b3JlID0gcmVxdWlyZSgnLi9zdG9yZScpLlN0b3JlO1xyXG52YXIgcGVybXV0ZURvbWFpbiA9IHJlcXVpcmUoJy4vcGVybXV0ZURvbWFpbicpLnBlcm11dGVEb21haW47XHJcbnZhciBwYXRoTWF0Y2ggPSByZXF1aXJlKCcuL3BhdGhNYXRjaCcpLnBhdGhNYXRjaDtcclxudmFyIHV0aWwgPSByZXF1aXJlKCd1dGlsJyk7XHJcblxyXG5mdW5jdGlvbiBNZW1vcnlDb29raWVTdG9yZSgpIHtcclxuICBTdG9yZS5jYWxsKHRoaXMpO1xyXG4gIHRoaXMuaWR4ID0ge307XHJcbn1cclxudXRpbC5pbmhlcml0cyhNZW1vcnlDb29raWVTdG9yZSwgU3RvcmUpO1xyXG5leHBvcnRzLk1lbW9yeUNvb2tpZVN0b3JlID0gTWVtb3J5Q29va2llU3RvcmU7XHJcbk1lbW9yeUNvb2tpZVN0b3JlLnByb3RvdHlwZS5pZHggPSBudWxsO1xyXG5cclxuLy8gU2luY2UgaXQncyBqdXN0IGEgc3RydWN0IGluIFJBTSwgdGhpcyBTdG9yZSBpcyBzeW5jaHJvbm91c1xyXG5NZW1vcnlDb29raWVTdG9yZS5wcm90b3R5cGUuc3luY2hyb25vdXMgPSB0cnVlO1xyXG5cclxuLy8gZm9yY2UgYSBkZWZhdWx0IGRlcHRoOlxyXG5NZW1vcnlDb29raWVTdG9yZS5wcm90b3R5cGUuaW5zcGVjdCA9IGZ1bmN0aW9uKCkge1xyXG4gIHJldHVybiBcInsgaWR4OiBcIit1dGlsLmluc3BlY3QodGhpcy5pZHgsIGZhbHNlLCAyKSsnIH0nO1xyXG59O1xyXG5cclxuLy8gVXNlIHRoZSBuZXcgY3VzdG9tIGluc3BlY3Rpb24gc3ltYm9sIHRvIGFkZCB0aGUgY3VzdG9tIGluc3BlY3QgZnVuY3Rpb24gaWZcclxuLy8gYXZhaWxhYmxlLlxyXG5pZiAodXRpbC5pbnNwZWN0LmN1c3RvbSkge1xyXG4gIE1lbW9yeUNvb2tpZVN0b3JlLnByb3RvdHlwZVt1dGlsLmluc3BlY3QuY3VzdG9tXSA9IE1lbW9yeUNvb2tpZVN0b3JlLnByb3RvdHlwZS5pbnNwZWN0O1xyXG59XHJcblxyXG5NZW1vcnlDb29raWVTdG9yZS5wcm90b3R5cGUuZmluZENvb2tpZSA9IGZ1bmN0aW9uKGRvbWFpbiwgcGF0aCwga2V5LCBjYikge1xyXG4gIGlmICghdGhpcy5pZHhbZG9tYWluXSkge1xyXG4gICAgcmV0dXJuIGNiKG51bGwsdW5kZWZpbmVkKTtcclxuICB9XHJcbiAgaWYgKCF0aGlzLmlkeFtkb21haW5dW3BhdGhdKSB7XHJcbiAgICByZXR1cm4gY2IobnVsbCx1bmRlZmluZWQpO1xyXG4gIH1cclxuICByZXR1cm4gY2IobnVsbCx0aGlzLmlkeFtkb21haW5dW3BhdGhdW2tleV18fG51bGwpO1xyXG59O1xyXG5cclxuTWVtb3J5Q29va2llU3RvcmUucHJvdG90eXBlLmZpbmRDb29raWVzID0gZnVuY3Rpb24oZG9tYWluLCBwYXRoLCBjYikge1xyXG4gIHZhciByZXN1bHRzID0gW107XHJcbiAgaWYgKCFkb21haW4pIHtcclxuICAgIHJldHVybiBjYihudWxsLFtdKTtcclxuICB9XHJcblxyXG4gIHZhciBwYXRoTWF0Y2hlcjtcclxuICBpZiAoIXBhdGgpIHtcclxuICAgIC8vIG51bGwgbWVhbnMgXCJhbGwgcGF0aHNcIlxyXG4gICAgcGF0aE1hdGNoZXIgPSBmdW5jdGlvbiBtYXRjaEFsbChkb21haW5JbmRleCkge1xyXG4gICAgICBmb3IgKHZhciBjdXJQYXRoIGluIGRvbWFpbkluZGV4KSB7XHJcbiAgICAgICAgdmFyIHBhdGhJbmRleCA9IGRvbWFpbkluZGV4W2N1clBhdGhdO1xyXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBwYXRoSW5kZXgpIHtcclxuICAgICAgICAgIHJlc3VsdHMucHVzaChwYXRoSW5kZXhba2V5XSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICB9IGVsc2Uge1xyXG4gICAgcGF0aE1hdGNoZXIgPSBmdW5jdGlvbiBtYXRjaFJGQyhkb21haW5JbmRleCkge1xyXG4gICAgICAgLy9OT1RFOiB3ZSBzaG91bGQgdXNlIHBhdGgtbWF0Y2ggYWxnb3JpdGhtIGZyb20gUzUuMS40IGhlcmVcclxuICAgICAgIC8vKHNlZSA6IGh0dHBzOi8vZ2l0aHViLmNvbS9DaHJvbWl1bVdlYkFwcHMvY2hyb21pdW0vYmxvYi9iM2QzYjRkYThiYjk0YzFiMmUwNjE2MDBkZjEwNmQ1OTBmZGEzNjIwL25ldC9jb29raWVzL2Nhbm9uaWNhbF9jb29raWUuY2MjTDI5OSlcclxuICAgICAgIE9iamVjdC5rZXlzKGRvbWFpbkluZGV4KS5mb3JFYWNoKGZ1bmN0aW9uIChjb29raWVQYXRoKSB7XHJcbiAgICAgICAgIGlmIChwYXRoTWF0Y2gocGF0aCwgY29va2llUGF0aCkpIHtcclxuICAgICAgICAgICB2YXIgcGF0aEluZGV4ID0gZG9tYWluSW5kZXhbY29va2llUGF0aF07XHJcblxyXG4gICAgICAgICAgIGZvciAodmFyIGtleSBpbiBwYXRoSW5kZXgpIHtcclxuICAgICAgICAgICAgIHJlc3VsdHMucHVzaChwYXRoSW5kZXhba2V5XSk7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICB9XHJcbiAgICAgICB9KTtcclxuICAgICB9O1xyXG4gIH1cclxuXHJcbiAgdmFyIGRvbWFpbnMgPSBwZXJtdXRlRG9tYWluKGRvbWFpbikgfHwgW2RvbWFpbl07XHJcbiAgdmFyIGlkeCA9IHRoaXMuaWR4O1xyXG4gIGRvbWFpbnMuZm9yRWFjaChmdW5jdGlvbihjdXJEb21haW4pIHtcclxuICAgIHZhciBkb21haW5JbmRleCA9IGlkeFtjdXJEb21haW5dO1xyXG4gICAgaWYgKCFkb21haW5JbmRleCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBwYXRoTWF0Y2hlcihkb21haW5JbmRleCk7XHJcbiAgfSk7XHJcblxyXG4gIGNiKG51bGwscmVzdWx0cyk7XHJcbn07XHJcblxyXG5NZW1vcnlDb29raWVTdG9yZS5wcm90b3R5cGUucHV0Q29va2llID0gZnVuY3Rpb24oY29va2llLCBjYikge1xyXG4gIGlmICghdGhpcy5pZHhbY29va2llLmRvbWFpbl0pIHtcclxuICAgIHRoaXMuaWR4W2Nvb2tpZS5kb21haW5dID0ge307XHJcbiAgfVxyXG4gIGlmICghdGhpcy5pZHhbY29va2llLmRvbWFpbl1bY29va2llLnBhdGhdKSB7XHJcbiAgICB0aGlzLmlkeFtjb29raWUuZG9tYWluXVtjb29raWUucGF0aF0gPSB7fTtcclxuICB9XHJcbiAgdGhpcy5pZHhbY29va2llLmRvbWFpbl1bY29va2llLnBhdGhdW2Nvb2tpZS5rZXldID0gY29va2llO1xyXG4gIGNiKG51bGwpO1xyXG59O1xyXG5cclxuTWVtb3J5Q29va2llU3RvcmUucHJvdG90eXBlLnVwZGF0ZUNvb2tpZSA9IGZ1bmN0aW9uKG9sZENvb2tpZSwgbmV3Q29va2llLCBjYikge1xyXG4gIC8vIHVwZGF0ZUNvb2tpZSgpIG1heSBhdm9pZCB1cGRhdGluZyBjb29raWVzIHRoYXQgYXJlIGlkZW50aWNhbC4gIEZvciBleGFtcGxlLFxyXG4gIC8vIGxhc3RBY2Nlc3NlZCBtYXkgbm90IGJlIGltcG9ydGFudCB0byBzb21lIHN0b3JlcyBhbmQgYW4gZXF1YWxpdHlcclxuICAvLyBjb21wYXJpc29uIGNvdWxkIGV4Y2x1ZGUgdGhhdCBmaWVsZC5cclxuICB0aGlzLnB1dENvb2tpZShuZXdDb29raWUsY2IpO1xyXG59O1xyXG5cclxuTWVtb3J5Q29va2llU3RvcmUucHJvdG90eXBlLnJlbW92ZUNvb2tpZSA9IGZ1bmN0aW9uKGRvbWFpbiwgcGF0aCwga2V5LCBjYikge1xyXG4gIGlmICh0aGlzLmlkeFtkb21haW5dICYmIHRoaXMuaWR4W2RvbWFpbl1bcGF0aF0gJiYgdGhpcy5pZHhbZG9tYWluXVtwYXRoXVtrZXldKSB7XHJcbiAgICBkZWxldGUgdGhpcy5pZHhbZG9tYWluXVtwYXRoXVtrZXldO1xyXG4gIH1cclxuICBjYihudWxsKTtcclxufTtcclxuXHJcbk1lbW9yeUNvb2tpZVN0b3JlLnByb3RvdHlwZS5yZW1vdmVDb29raWVzID0gZnVuY3Rpb24oZG9tYWluLCBwYXRoLCBjYikge1xyXG4gIGlmICh0aGlzLmlkeFtkb21haW5dKSB7XHJcbiAgICBpZiAocGF0aCkge1xyXG4gICAgICBkZWxldGUgdGhpcy5pZHhbZG9tYWluXVtwYXRoXTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGRlbGV0ZSB0aGlzLmlkeFtkb21haW5dO1xyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gY2IobnVsbCk7XHJcbn07XHJcblxyXG5NZW1vcnlDb29raWVTdG9yZS5wcm90b3R5cGUuZ2V0QWxsQ29va2llcyA9IGZ1bmN0aW9uKGNiKSB7XHJcbiAgdmFyIGNvb2tpZXMgPSBbXTtcclxuICB2YXIgaWR4ID0gdGhpcy5pZHg7XHJcblxyXG4gIHZhciBkb21haW5zID0gT2JqZWN0LmtleXMoaWR4KTtcclxuICBkb21haW5zLmZvckVhY2goZnVuY3Rpb24oZG9tYWluKSB7XHJcbiAgICB2YXIgcGF0aHMgPSBPYmplY3Qua2V5cyhpZHhbZG9tYWluXSk7XHJcbiAgICBwYXRocy5mb3JFYWNoKGZ1bmN0aW9uKHBhdGgpIHtcclxuICAgICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhpZHhbZG9tYWluXVtwYXRoXSk7XHJcbiAgICAgIGtleXMuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcclxuICAgICAgICBpZiAoa2V5ICE9PSBudWxsKSB7XHJcbiAgICAgICAgICBjb29raWVzLnB1c2goaWR4W2RvbWFpbl1bcGF0aF1ba2V5XSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG5cclxuICAvLyBTb3J0IGJ5IGNyZWF0aW9uSW5kZXggc28gZGVzZXJpYWxpemluZyByZXRhaW5zIHRoZSBjcmVhdGlvbiBvcmRlci5cclxuICAvLyBXaGVuIGltcGxlbWVudGluZyB5b3VyIG93biBzdG9yZSwgdGhpcyBTSE9VTEQgcmV0YWluIHRoZSBvcmRlciB0b29cclxuICBjb29raWVzLnNvcnQoZnVuY3Rpb24oYSxiKSB7XHJcbiAgICByZXR1cm4gKGEuY3JlYXRpb25JbmRleHx8MCkgLSAoYi5jcmVhdGlvbkluZGV4fHwwKTtcclxuICB9KTtcclxuXHJcbiAgY2IobnVsbCwgY29va2llcyk7XHJcbn07XHJcbiIsIi8qIVxyXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTUsIFNhbGVzZm9yY2UuY29tLCBJbmMuXHJcbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXHJcbiAqXHJcbiAqIFJlZGlzdHJpYnV0aW9uIGFuZCB1c2UgaW4gc291cmNlIGFuZCBiaW5hcnkgZm9ybXMsIHdpdGggb3Igd2l0aG91dFxyXG4gKiBtb2RpZmljYXRpb24sIGFyZSBwZXJtaXR0ZWQgcHJvdmlkZWQgdGhhdCB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnMgYXJlIG1ldDpcclxuICpcclxuICogMS4gUmVkaXN0cmlidXRpb25zIG9mIHNvdXJjZSBjb2RlIG11c3QgcmV0YWluIHRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlLFxyXG4gKiB0aGlzIGxpc3Qgb2YgY29uZGl0aW9ucyBhbmQgdGhlIGZvbGxvd2luZyBkaXNjbGFpbWVyLlxyXG4gKlxyXG4gKiAyLiBSZWRpc3RyaWJ1dGlvbnMgaW4gYmluYXJ5IGZvcm0gbXVzdCByZXByb2R1Y2UgdGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UsXHJcbiAqIHRoaXMgbGlzdCBvZiBjb25kaXRpb25zIGFuZCB0aGUgZm9sbG93aW5nIGRpc2NsYWltZXIgaW4gdGhlIGRvY3VtZW50YXRpb25cclxuICogYW5kL29yIG90aGVyIG1hdGVyaWFscyBwcm92aWRlZCB3aXRoIHRoZSBkaXN0cmlidXRpb24uXHJcbiAqXHJcbiAqIDMuIE5laXRoZXIgdGhlIG5hbWUgb2YgU2FsZXNmb3JjZS5jb20gbm9yIHRoZSBuYW1lcyBvZiBpdHMgY29udHJpYnV0b3JzIG1heVxyXG4gKiBiZSB1c2VkIHRvIGVuZG9yc2Ugb3IgcHJvbW90ZSBwcm9kdWN0cyBkZXJpdmVkIGZyb20gdGhpcyBzb2Z0d2FyZSB3aXRob3V0XHJcbiAqIHNwZWNpZmljIHByaW9yIHdyaXR0ZW4gcGVybWlzc2lvbi5cclxuICpcclxuICogVEhJUyBTT0ZUV0FSRSBJUyBQUk9WSURFRCBCWSBUSEUgQ09QWVJJR0hUIEhPTERFUlMgQU5EIENPTlRSSUJVVE9SUyBcIkFTIElTXCJcclxuICogQU5EIEFOWSBFWFBSRVNTIE9SIElNUExJRUQgV0FSUkFOVElFUywgSU5DTFVESU5HLCBCVVQgTk9UIExJTUlURUQgVE8sIFRIRVxyXG4gKiBJTVBMSUVEIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZIEFORCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRVxyXG4gKiBBUkUgRElTQ0xBSU1FRC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIENPUFlSSUdIVCBIT0xERVIgT1IgQ09OVFJJQlVUT1JTIEJFXHJcbiAqIExJQUJMRSBGT1IgQU5ZIERJUkVDVCwgSU5ESVJFQ1QsIElOQ0lERU5UQUwsIFNQRUNJQUwsIEVYRU1QTEFSWSwgT1JcclxuICogQ09OU0VRVUVOVElBTCBEQU1BR0VTIChJTkNMVURJTkcsIEJVVCBOT1QgTElNSVRFRCBUTywgUFJPQ1VSRU1FTlQgT0ZcclxuICogU1VCU1RJVFVURSBHT09EUyBPUiBTRVJWSUNFUzsgTE9TUyBPRiBVU0UsIERBVEEsIE9SIFBST0ZJVFM7IE9SIEJVU0lORVNTXHJcbiAqIElOVEVSUlVQVElPTikgSE9XRVZFUiBDQVVTRUQgQU5EIE9OIEFOWSBUSEVPUlkgT0YgTElBQklMSVRZLCBXSEVUSEVSIElOXHJcbiAqIENPTlRSQUNULCBTVFJJQ1QgTElBQklMSVRZLCBPUiBUT1JUIChJTkNMVURJTkcgTkVHTElHRU5DRSBPUiBPVEhFUldJU0UpXHJcbiAqIEFSSVNJTkcgSU4gQU5ZIFdBWSBPVVQgT0YgVEhFIFVTRSBPRiBUSElTIFNPRlRXQVJFLCBFVkVOIElGIEFEVklTRUQgT0YgVEhFXHJcbiAqIFBPU1NJQklMSVRZIE9GIFNVQ0ggREFNQUdFLlxyXG4gKi9cclxuJ3VzZSBzdHJpY3QnO1xyXG4vKmpzaGludCB1bnVzZWQ6ZmFsc2UgKi9cclxuXHJcbmZ1bmN0aW9uIFN0b3JlKCkge1xyXG59XHJcbmV4cG9ydHMuU3RvcmUgPSBTdG9yZTtcclxuXHJcbi8vIFN0b3JlcyBtYXkgYmUgc3luY2hyb25vdXMsIGJ1dCBhcmUgc3RpbGwgcmVxdWlyZWQgdG8gdXNlIGFcclxuLy8gQ29udGludWF0aW9uLVBhc3NpbmcgU3R5bGUgQVBJLiAgVGhlIENvb2tpZUphciBpdHNlbGYgd2lsbCBleHBvc2UgYSBcIipTeW5jXCJcclxuLy8gQVBJIHRoYXQgY29udmVydHMgZnJvbSBzeW5jaHJvbm91cy1jYWxsYmFja3MgdG8gaW1wZXJhdGl2ZSBzdHlsZS5cclxuU3RvcmUucHJvdG90eXBlLnN5bmNocm9ub3VzID0gZmFsc2U7XHJcblxyXG5TdG9yZS5wcm90b3R5cGUuZmluZENvb2tpZSA9IGZ1bmN0aW9uKGRvbWFpbiwgcGF0aCwga2V5LCBjYikge1xyXG4gIHRocm93IG5ldyBFcnJvcignZmluZENvb2tpZSBpcyBub3QgaW1wbGVtZW50ZWQnKTtcclxufTtcclxuXHJcblN0b3JlLnByb3RvdHlwZS5maW5kQ29va2llcyA9IGZ1bmN0aW9uKGRvbWFpbiwgcGF0aCwgY2IpIHtcclxuICB0aHJvdyBuZXcgRXJyb3IoJ2ZpbmRDb29raWVzIGlzIG5vdCBpbXBsZW1lbnRlZCcpO1xyXG59O1xyXG5cclxuU3RvcmUucHJvdG90eXBlLnB1dENvb2tpZSA9IGZ1bmN0aW9uKGNvb2tpZSwgY2IpIHtcclxuICB0aHJvdyBuZXcgRXJyb3IoJ3B1dENvb2tpZSBpcyBub3QgaW1wbGVtZW50ZWQnKTtcclxufTtcclxuXHJcblN0b3JlLnByb3RvdHlwZS51cGRhdGVDb29raWUgPSBmdW5jdGlvbihvbGRDb29raWUsIG5ld0Nvb2tpZSwgY2IpIHtcclxuICAvLyByZWNvbW1lbmRlZCBkZWZhdWx0IGltcGxlbWVudGF0aW9uOlxyXG4gIC8vIHJldHVybiB0aGlzLnB1dENvb2tpZShuZXdDb29raWUsIGNiKTtcclxuICB0aHJvdyBuZXcgRXJyb3IoJ3VwZGF0ZUNvb2tpZSBpcyBub3QgaW1wbGVtZW50ZWQnKTtcclxufTtcclxuXHJcblN0b3JlLnByb3RvdHlwZS5yZW1vdmVDb29raWUgPSBmdW5jdGlvbihkb21haW4sIHBhdGgsIGtleSwgY2IpIHtcclxuICB0aHJvdyBuZXcgRXJyb3IoJ3JlbW92ZUNvb2tpZSBpcyBub3QgaW1wbGVtZW50ZWQnKTtcclxufTtcclxuXHJcblN0b3JlLnByb3RvdHlwZS5yZW1vdmVDb29raWVzID0gZnVuY3Rpb24oZG9tYWluLCBwYXRoLCBjYikge1xyXG4gIHRocm93IG5ldyBFcnJvcigncmVtb3ZlQ29va2llcyBpcyBub3QgaW1wbGVtZW50ZWQnKTtcclxufTtcclxuXHJcblN0b3JlLnByb3RvdHlwZS5nZXRBbGxDb29raWVzID0gZnVuY3Rpb24oY2IpIHtcclxuICB0aHJvdyBuZXcgRXJyb3IoJ2dldEFsbENvb2tpZXMgaXMgbm90IGltcGxlbWVudGVkICh0aGVyZWZvcmUgamFyIGNhbm5vdCBiZSBzZXJpYWxpemVkKScpO1xyXG59O1xyXG4iLCIvKiFcclxuICogQ29weXJpZ2h0IChjKSAyMDE1LCBTYWxlc2ZvcmNlLmNvbSwgSW5jLlxyXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxyXG4gKlxyXG4gKiBSZWRpc3RyaWJ1dGlvbiBhbmQgdXNlIGluIHNvdXJjZSBhbmQgYmluYXJ5IGZvcm1zLCB3aXRoIG9yIHdpdGhvdXRcclxuICogbW9kaWZpY2F0aW9uLCBhcmUgcGVybWl0dGVkIHByb3ZpZGVkIHRoYXQgdGhlIGZvbGxvd2luZyBjb25kaXRpb25zIGFyZSBtZXQ6XHJcbiAqXHJcbiAqIDEuIFJlZGlzdHJpYnV0aW9ucyBvZiBzb3VyY2UgY29kZSBtdXN0IHJldGFpbiB0aGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSxcclxuICogdGhpcyBsaXN0IG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lci5cclxuICpcclxuICogMi4gUmVkaXN0cmlidXRpb25zIGluIGJpbmFyeSBmb3JtIG11c3QgcmVwcm9kdWNlIHRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlLFxyXG4gKiB0aGlzIGxpc3Qgb2YgY29uZGl0aW9ucyBhbmQgdGhlIGZvbGxvd2luZyBkaXNjbGFpbWVyIGluIHRoZSBkb2N1bWVudGF0aW9uXHJcbiAqIGFuZC9vciBvdGhlciBtYXRlcmlhbHMgcHJvdmlkZWQgd2l0aCB0aGUgZGlzdHJpYnV0aW9uLlxyXG4gKlxyXG4gKiAzLiBOZWl0aGVyIHRoZSBuYW1lIG9mIFNhbGVzZm9yY2UuY29tIG5vciB0aGUgbmFtZXMgb2YgaXRzIGNvbnRyaWJ1dG9ycyBtYXlcclxuICogYmUgdXNlZCB0byBlbmRvcnNlIG9yIHByb21vdGUgcHJvZHVjdHMgZGVyaXZlZCBmcm9tIHRoaXMgc29mdHdhcmUgd2l0aG91dFxyXG4gKiBzcGVjaWZpYyBwcmlvciB3cml0dGVuIHBlcm1pc3Npb24uXHJcbiAqXHJcbiAqIFRISVMgU09GVFdBUkUgSVMgUFJPVklERUQgQlkgVEhFIENPUFlSSUdIVCBIT0xERVJTIEFORCBDT05UUklCVVRPUlMgXCJBUyBJU1wiXHJcbiAqIEFORCBBTlkgRVhQUkVTUyBPUiBJTVBMSUVEIFdBUlJBTlRJRVMsIElOQ0xVRElORywgQlVUIE5PVCBMSU1JVEVEIFRPLCBUSEVcclxuICogSU1QTElFRCBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSBBTkQgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0VcclxuICogQVJFIERJU0NMQUlNRUQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBDT1BZUklHSFQgSE9MREVSIE9SIENPTlRSSUJVVE9SUyBCRVxyXG4gKiBMSUFCTEUgRk9SIEFOWSBESVJFQ1QsIElORElSRUNULCBJTkNJREVOVEFMLCBTUEVDSUFMLCBFWEVNUExBUlksIE9SXHJcbiAqIENPTlNFUVVFTlRJQUwgREFNQUdFUyAoSU5DTFVESU5HLCBCVVQgTk9UIExJTUlURUQgVE8sIFBST0NVUkVNRU5UIE9GXHJcbiAqIFNVQlNUSVRVVEUgR09PRFMgT1IgU0VSVklDRVM7IExPU1MgT0YgVVNFLCBEQVRBLCBPUiBQUk9GSVRTOyBPUiBCVVNJTkVTU1xyXG4gKiBJTlRFUlJVUFRJT04pIEhPV0VWRVIgQ0FVU0VEIEFORCBPTiBBTlkgVEhFT1JZIE9GIExJQUJJTElUWSwgV0hFVEhFUiBJTlxyXG4gKiBDT05UUkFDVCwgU1RSSUNUIExJQUJJTElUWSwgT1IgVE9SVCAoSU5DTFVESU5HIE5FR0xJR0VOQ0UgT1IgT1RIRVJXSVNFKVxyXG4gKiBBUklTSU5HIElOIEFOWSBXQVkgT1VUIE9GIFRIRSBVU0UgT0YgVEhJUyBTT0ZUV0FSRSwgRVZFTiBJRiBBRFZJU0VEIE9GIFRIRVxyXG4gKiBQT1NTSUJJTElUWSBPRiBTVUNIIERBTUFHRS5cclxuICovXHJcbid1c2Ugc3RyaWN0JztcclxudmFyIG5ldCA9IHJlcXVpcmUoJ25ldCcpO1xyXG52YXIgdXJsUGFyc2UgPSByZXF1aXJlKCd1cmwnKS5wYXJzZTtcclxudmFyIHV0aWwgPSByZXF1aXJlKCd1dGlsJyk7XHJcbnZhciBwdWJzdWZmaXggPSByZXF1aXJlKCcuL3B1YnN1ZmZpeC1wc2wnKTtcclxudmFyIFN0b3JlID0gcmVxdWlyZSgnLi9zdG9yZScpLlN0b3JlO1xyXG52YXIgTWVtb3J5Q29va2llU3RvcmUgPSByZXF1aXJlKCcuL21lbXN0b3JlJykuTWVtb3J5Q29va2llU3RvcmU7XHJcbnZhciBwYXRoTWF0Y2ggPSByZXF1aXJlKCcuL3BhdGhNYXRjaCcpLnBhdGhNYXRjaDtcclxudmFyIFZFUlNJT04gPSByZXF1aXJlKCcuLi9wYWNrYWdlLmpzb24nKS52ZXJzaW9uO1xyXG5cclxudmFyIHB1bnljb2RlO1xyXG50cnkge1xyXG4gIHB1bnljb2RlID0gcmVxdWlyZSgncHVueWNvZGUnKTtcclxufSBjYXRjaChlKSB7XHJcbiAgY29uc29sZS53YXJuKFwidG91Z2gtY29va2llOiBjYW4ndCBsb2FkIHB1bnljb2RlOyB3b24ndCB1c2UgcHVueWNvZGUgZm9yIGRvbWFpbiBub3JtYWxpemF0aW9uXCIpO1xyXG59XHJcblxyXG4vLyBGcm9tIFJGQzYyNjUgUzQuMS4xXHJcbi8vIG5vdGUgdGhhdCBpdCBleGNsdWRlcyBcXHgzQiBcIjtcIlxyXG52YXIgQ09PS0lFX09DVEVUUyA9IC9eW1xceDIxXFx4MjMtXFx4MkJcXHgyRC1cXHgzQVxceDNDLVxceDVCXFx4NUQtXFx4N0VdKyQvO1xyXG5cclxudmFyIENPTlRST0xfQ0hBUlMgPSAvW1xceDAwLVxceDFGXS87XHJcblxyXG4vLyBGcm9tIENocm9taXVtIC8vICdcXHInLCAnXFxuJyBhbmQgJ1xcMCcgc2hvdWxkIGJlIHRyZWF0ZWQgYXMgYSB0ZXJtaW5hdG9yIGluXHJcbi8vIHRoZSBcInJlbGF4ZWRcIiBtb2RlLCBzZWU6XHJcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9DaHJvbWl1bVdlYkFwcHMvY2hyb21pdW0vYmxvYi9iM2QzYjRkYThiYjk0YzFiMmUwNjE2MDBkZjEwNmQ1OTBmZGEzNjIwL25ldC9jb29raWVzL3BhcnNlZF9jb29raWUuY2MjTDYwXHJcbnZhciBURVJNSU5BVE9SUyA9IFsnXFxuJywgJ1xccicsICdcXDAnXTtcclxuXHJcbi8vIFJGQzYyNjUgUzQuMS4xIGRlZmluZXMgcGF0aCB2YWx1ZSBhcyAnYW55IENIQVIgZXhjZXB0IENUTHMgb3IgXCI7XCInXHJcbi8vIE5vdGUgJzsnIGlzIFxceDNCXHJcbnZhciBQQVRIX1ZBTFVFID0gL1tcXHgyMC1cXHgzQVxceDNDLVxceDdFXSsvO1xyXG5cclxuLy8gZGF0ZS10aW1lIHBhcnNpbmcgY29uc3RhbnRzIChSRkM2MjY1IFM1LjEuMSlcclxuXHJcbnZhciBEQVRFX0RFTElNID0gL1tcXHgwOVxceDIwLVxceDJGXFx4M0ItXFx4NDBcXHg1Qi1cXHg2MFxceDdCLVxceDdFXS87XHJcblxyXG52YXIgTU9OVEhfVE9fTlVNID0ge1xyXG4gIGphbjowLCBmZWI6MSwgbWFyOjIsIGFwcjozLCBtYXk6NCwganVuOjUsXHJcbiAganVsOjYsIGF1Zzo3LCBzZXA6OCwgb2N0OjksIG5vdjoxMCwgZGVjOjExXHJcbn07XHJcbnZhciBOVU1fVE9fTU9OVEggPSBbXHJcbiAgJ0phbicsJ0ZlYicsJ01hcicsJ0FwcicsJ01heScsJ0p1bicsJ0p1bCcsJ0F1ZycsJ1NlcCcsJ09jdCcsJ05vdicsJ0RlYydcclxuXTtcclxudmFyIE5VTV9UT19EQVkgPSBbXHJcbiAgJ1N1bicsJ01vbicsJ1R1ZScsJ1dlZCcsJ1RodScsJ0ZyaScsJ1NhdCdcclxuXTtcclxuXHJcbnZhciBNQVhfVElNRSA9IDIxNDc0ODM2NDcwMDA7IC8vIDMxLWJpdCBtYXhcclxudmFyIE1JTl9USU1FID0gMDsgLy8gMzEtYml0IG1pblxyXG5cclxuLypcclxuICogUGFyc2VzIGEgTmF0dXJhbCBudW1iZXIgKGkuZS4sIG5vbi1uZWdhdGl2ZSBpbnRlZ2VyKSB3aXRoIGVpdGhlciB0aGVcclxuICogICAgPG1pbj4qPG1heD5ESUdJVCAoIG5vbi1kaWdpdCAqT0NURVQgKVxyXG4gKiBvclxyXG4gKiAgICA8bWluPio8bWF4PkRJR0lUXHJcbiAqIGdyYW1tYXIgKFJGQzYyNjUgUzUuMS4xKS5cclxuICpcclxuICogVGhlIFwidHJhaWxpbmdPS1wiIGJvb2xlYW4gY29udHJvbHMgaWYgdGhlIGdyYW1tYXIgYWNjZXB0cyBhXHJcbiAqIFwiKCBub24tZGlnaXQgKk9DVEVUIClcIiB0cmFpbGVyLlxyXG4gKi9cclxuZnVuY3Rpb24gcGFyc2VEaWdpdHModG9rZW4sIG1pbkRpZ2l0cywgbWF4RGlnaXRzLCB0cmFpbGluZ09LKSB7XHJcbiAgdmFyIGNvdW50ID0gMDtcclxuICB3aGlsZSAoY291bnQgPCB0b2tlbi5sZW5ndGgpIHtcclxuICAgIHZhciBjID0gdG9rZW4uY2hhckNvZGVBdChjb3VudCk7XHJcbiAgICAvLyBcIm5vbi1kaWdpdCA9ICV4MDAtMkYgLyAleDNBLUZGXCJcclxuICAgIGlmIChjIDw9IDB4MkYgfHwgYyA+PSAweDNBKSB7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gICAgY291bnQrKztcclxuICB9XHJcblxyXG4gIC8vIGNvbnN0cmFpbiB0byBhIG1pbmltdW0gYW5kIG1heGltdW0gbnVtYmVyIG9mIGRpZ2l0cy5cclxuICBpZiAoY291bnQgPCBtaW5EaWdpdHMgfHwgY291bnQgPiBtYXhEaWdpdHMpIHtcclxuICAgIHJldHVybiBudWxsO1xyXG4gIH1cclxuXHJcbiAgaWYgKCF0cmFpbGluZ09LICYmIGNvdW50ICE9IHRva2VuLmxlbmd0aCkge1xyXG4gICAgcmV0dXJuIG51bGw7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gcGFyc2VJbnQodG9rZW4uc3Vic3RyKDAsY291bnQpLCAxMCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHBhcnNlVGltZSh0b2tlbikge1xyXG4gIHZhciBwYXJ0cyA9IHRva2VuLnNwbGl0KCc6Jyk7XHJcbiAgdmFyIHJlc3VsdCA9IFswLDAsMF07XHJcblxyXG4gIC8qIFJGNjI1NiBTNS4xLjE6XHJcbiAgICogICAgICB0aW1lICAgICAgICAgICAgPSBobXMtdGltZSAoIG5vbi1kaWdpdCAqT0NURVQgKVxyXG4gICAqICAgICAgaG1zLXRpbWUgICAgICAgID0gdGltZS1maWVsZCBcIjpcIiB0aW1lLWZpZWxkIFwiOlwiIHRpbWUtZmllbGRcclxuICAgKiAgICAgIHRpbWUtZmllbGQgICAgICA9IDEqMkRJR0lUXHJcbiAgICovXHJcblxyXG4gIGlmIChwYXJ0cy5sZW5ndGggIT09IDMpIHtcclxuICAgIHJldHVybiBudWxsO1xyXG4gIH1cclxuXHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCAzOyBpKyspIHtcclxuICAgIC8vIFwidGltZS1maWVsZFwiIG11c3QgYmUgc3RyaWN0bHkgXCIxKjJESUdJVFwiLCBIT1dFVkVSLCBcImhtcy10aW1lXCIgY2FuIGJlXHJcbiAgICAvLyBmb2xsb3dlZCBieSBcIiggbm9uLWRpZ2l0ICpPQ1RFVCApXCIgc28gdGhlcmVmb3JlIHRoZSBsYXN0IHRpbWUtZmllbGQgY2FuXHJcbiAgICAvLyBoYXZlIGEgdHJhaWxlclxyXG4gICAgdmFyIHRyYWlsaW5nT0sgPSAoaSA9PSAyKTtcclxuICAgIHZhciBudW0gPSBwYXJzZURpZ2l0cyhwYXJ0c1tpXSwgMSwgMiwgdHJhaWxpbmdPSyk7XHJcbiAgICBpZiAobnVtID09PSBudWxsKSB7XHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gICAgcmVzdWx0W2ldID0gbnVtO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuZnVuY3Rpb24gcGFyc2VNb250aCh0b2tlbikge1xyXG4gIHRva2VuID0gU3RyaW5nKHRva2VuKS5zdWJzdHIoMCwzKS50b0xvd2VyQ2FzZSgpO1xyXG4gIHZhciBudW0gPSBNT05USF9UT19OVU1bdG9rZW5dO1xyXG4gIHJldHVybiBudW0gPj0gMCA/IG51bSA6IG51bGw7XHJcbn1cclxuXHJcbi8qXHJcbiAqIFJGQzYyNjUgUzUuMS4xIGRhdGUgcGFyc2VyIChzZWUgUkZDIGZvciBmdWxsIGdyYW1tYXIpXHJcbiAqL1xyXG5mdW5jdGlvbiBwYXJzZURhdGUoc3RyKSB7XHJcbiAgaWYgKCFzdHIpIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcblxyXG4gIC8qIFJGQzYyNjUgUzUuMS4xOlxyXG4gICAqIDIuIFByb2Nlc3MgZWFjaCBkYXRlLXRva2VuIHNlcXVlbnRpYWxseSBpbiB0aGUgb3JkZXIgdGhlIGRhdGUtdG9rZW5zXHJcbiAgICogYXBwZWFyIGluIHRoZSBjb29raWUtZGF0ZVxyXG4gICAqL1xyXG4gIHZhciB0b2tlbnMgPSBzdHIuc3BsaXQoREFURV9ERUxJTSk7XHJcbiAgaWYgKCF0b2tlbnMpIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcblxyXG4gIHZhciBob3VyID0gbnVsbDtcclxuICB2YXIgbWludXRlID0gbnVsbDtcclxuICB2YXIgc2Vjb25kID0gbnVsbDtcclxuICB2YXIgZGF5T2ZNb250aCA9IG51bGw7XHJcbiAgdmFyIG1vbnRoID0gbnVsbDtcclxuICB2YXIgeWVhciA9IG51bGw7XHJcblxyXG4gIGZvciAodmFyIGk9MDsgaTx0b2tlbnMubGVuZ3RoOyBpKyspIHtcclxuICAgIHZhciB0b2tlbiA9IHRva2Vuc1tpXS50cmltKCk7XHJcbiAgICBpZiAoIXRva2VuLmxlbmd0aCkge1xyXG4gICAgICBjb250aW51ZTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgcmVzdWx0O1xyXG5cclxuICAgIC8qIDIuMS4gSWYgdGhlIGZvdW5kLXRpbWUgZmxhZyBpcyBub3Qgc2V0IGFuZCB0aGUgdG9rZW4gbWF0Y2hlcyB0aGUgdGltZVxyXG4gICAgICogcHJvZHVjdGlvbiwgc2V0IHRoZSBmb3VuZC10aW1lIGZsYWcgYW5kIHNldCB0aGUgaG91ci0gdmFsdWUsXHJcbiAgICAgKiBtaW51dGUtdmFsdWUsIGFuZCBzZWNvbmQtdmFsdWUgdG8gdGhlIG51bWJlcnMgZGVub3RlZCBieSB0aGUgZGlnaXRzIGluXHJcbiAgICAgKiB0aGUgZGF0ZS10b2tlbiwgcmVzcGVjdGl2ZWx5LiAgU2tpcCB0aGUgcmVtYWluaW5nIHN1Yi1zdGVwcyBhbmQgY29udGludWVcclxuICAgICAqIHRvIHRoZSBuZXh0IGRhdGUtdG9rZW4uXHJcbiAgICAgKi9cclxuICAgIGlmIChzZWNvbmQgPT09IG51bGwpIHtcclxuICAgICAgcmVzdWx0ID0gcGFyc2VUaW1lKHRva2VuKTtcclxuICAgICAgaWYgKHJlc3VsdCkge1xyXG4gICAgICAgIGhvdXIgPSByZXN1bHRbMF07XHJcbiAgICAgICAgbWludXRlID0gcmVzdWx0WzFdO1xyXG4gICAgICAgIHNlY29uZCA9IHJlc3VsdFsyXTtcclxuICAgICAgICBjb250aW51ZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qIDIuMi4gSWYgdGhlIGZvdW5kLWRheS1vZi1tb250aCBmbGFnIGlzIG5vdCBzZXQgYW5kIHRoZSBkYXRlLXRva2VuIG1hdGNoZXNcclxuICAgICAqIHRoZSBkYXktb2YtbW9udGggcHJvZHVjdGlvbiwgc2V0IHRoZSBmb3VuZC1kYXktb2YtIG1vbnRoIGZsYWcgYW5kIHNldFxyXG4gICAgICogdGhlIGRheS1vZi1tb250aC12YWx1ZSB0byB0aGUgbnVtYmVyIGRlbm90ZWQgYnkgdGhlIGRhdGUtdG9rZW4uICBTa2lwXHJcbiAgICAgKiB0aGUgcmVtYWluaW5nIHN1Yi1zdGVwcyBhbmQgY29udGludWUgdG8gdGhlIG5leHQgZGF0ZS10b2tlbi5cclxuICAgICAqL1xyXG4gICAgaWYgKGRheU9mTW9udGggPT09IG51bGwpIHtcclxuICAgICAgLy8gXCJkYXktb2YtbW9udGggPSAxKjJESUdJVCAoIG5vbi1kaWdpdCAqT0NURVQgKVwiXHJcbiAgICAgIHJlc3VsdCA9IHBhcnNlRGlnaXRzKHRva2VuLCAxLCAyLCB0cnVlKTtcclxuICAgICAgaWYgKHJlc3VsdCAhPT0gbnVsbCkge1xyXG4gICAgICAgIGRheU9mTW9udGggPSByZXN1bHQ7XHJcbiAgICAgICAgY29udGludWU7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKiAyLjMuIElmIHRoZSBmb3VuZC1tb250aCBmbGFnIGlzIG5vdCBzZXQgYW5kIHRoZSBkYXRlLXRva2VuIG1hdGNoZXMgdGhlXHJcbiAgICAgKiBtb250aCBwcm9kdWN0aW9uLCBzZXQgdGhlIGZvdW5kLW1vbnRoIGZsYWcgYW5kIHNldCB0aGUgbW9udGgtdmFsdWUgdG9cclxuICAgICAqIHRoZSBtb250aCBkZW5vdGVkIGJ5IHRoZSBkYXRlLXRva2VuLiAgU2tpcCB0aGUgcmVtYWluaW5nIHN1Yi1zdGVwcyBhbmRcclxuICAgICAqIGNvbnRpbnVlIHRvIHRoZSBuZXh0IGRhdGUtdG9rZW4uXHJcbiAgICAgKi9cclxuICAgIGlmIChtb250aCA9PT0gbnVsbCkge1xyXG4gICAgICByZXN1bHQgPSBwYXJzZU1vbnRoKHRva2VuKTtcclxuICAgICAgaWYgKHJlc3VsdCAhPT0gbnVsbCkge1xyXG4gICAgICAgIG1vbnRoID0gcmVzdWx0O1xyXG4gICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyogMi40LiBJZiB0aGUgZm91bmQteWVhciBmbGFnIGlzIG5vdCBzZXQgYW5kIHRoZSBkYXRlLXRva2VuIG1hdGNoZXMgdGhlXHJcbiAgICAgKiB5ZWFyIHByb2R1Y3Rpb24sIHNldCB0aGUgZm91bmQteWVhciBmbGFnIGFuZCBzZXQgdGhlIHllYXItdmFsdWUgdG8gdGhlXHJcbiAgICAgKiBudW1iZXIgZGVub3RlZCBieSB0aGUgZGF0ZS10b2tlbi4gIFNraXAgdGhlIHJlbWFpbmluZyBzdWItc3RlcHMgYW5kXHJcbiAgICAgKiBjb250aW51ZSB0byB0aGUgbmV4dCBkYXRlLXRva2VuLlxyXG4gICAgICovXHJcbiAgICBpZiAoeWVhciA9PT0gbnVsbCkge1xyXG4gICAgICAvLyBcInllYXIgPSAyKjRESUdJVCAoIG5vbi1kaWdpdCAqT0NURVQgKVwiXHJcbiAgICAgIHJlc3VsdCA9IHBhcnNlRGlnaXRzKHRva2VuLCAyLCA0LCB0cnVlKTtcclxuICAgICAgaWYgKHJlc3VsdCAhPT0gbnVsbCkge1xyXG4gICAgICAgIHllYXIgPSByZXN1bHQ7XHJcbiAgICAgICAgLyogRnJvbSBTNS4xLjE6XHJcbiAgICAgICAgICogMy4gIElmIHRoZSB5ZWFyLXZhbHVlIGlzIGdyZWF0ZXIgdGhhbiBvciBlcXVhbCB0byA3MCBhbmQgbGVzc1xyXG4gICAgICAgICAqIHRoYW4gb3IgZXF1YWwgdG8gOTksIGluY3JlbWVudCB0aGUgeWVhci12YWx1ZSBieSAxOTAwLlxyXG4gICAgICAgICAqIDQuICBJZiB0aGUgeWVhci12YWx1ZSBpcyBncmVhdGVyIHRoYW4gb3IgZXF1YWwgdG8gMCBhbmQgbGVzc1xyXG4gICAgICAgICAqIHRoYW4gb3IgZXF1YWwgdG8gNjksIGluY3JlbWVudCB0aGUgeWVhci12YWx1ZSBieSAyMDAwLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGlmICh5ZWFyID49IDcwICYmIHllYXIgPD0gOTkpIHtcclxuICAgICAgICAgIHllYXIgKz0gMTkwMDtcclxuICAgICAgICB9IGVsc2UgaWYgKHllYXIgPj0gMCAmJiB5ZWFyIDw9IDY5KSB7XHJcbiAgICAgICAgICB5ZWFyICs9IDIwMDA7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKiBSRkMgNjI2NSBTNS4xLjFcclxuICAgKiBcIjUuIEFib3J0IHRoZXNlIHN0ZXBzIGFuZCBmYWlsIHRvIHBhcnNlIHRoZSBjb29raWUtZGF0ZSBpZjpcclxuICAgKiAgICAgKiAgYXQgbGVhc3Qgb25lIG9mIHRoZSBmb3VuZC1kYXktb2YtbW9udGgsIGZvdW5kLW1vbnRoLCBmb3VuZC1cclxuICAgKiAgICAgICAgeWVhciwgb3IgZm91bmQtdGltZSBmbGFncyBpcyBub3Qgc2V0LFxyXG4gICAqICAgICAqICB0aGUgZGF5LW9mLW1vbnRoLXZhbHVlIGlzIGxlc3MgdGhhbiAxIG9yIGdyZWF0ZXIgdGhhbiAzMSxcclxuICAgKiAgICAgKiAgdGhlIHllYXItdmFsdWUgaXMgbGVzcyB0aGFuIDE2MDEsXHJcbiAgICogICAgICogIHRoZSBob3VyLXZhbHVlIGlzIGdyZWF0ZXIgdGhhbiAyMyxcclxuICAgKiAgICAgKiAgdGhlIG1pbnV0ZS12YWx1ZSBpcyBncmVhdGVyIHRoYW4gNTksIG9yXHJcbiAgICogICAgICogIHRoZSBzZWNvbmQtdmFsdWUgaXMgZ3JlYXRlciB0aGFuIDU5LlxyXG4gICAqICAgICAoTm90ZSB0aGF0IGxlYXAgc2Vjb25kcyBjYW5ub3QgYmUgcmVwcmVzZW50ZWQgaW4gdGhpcyBzeW50YXguKVwiXHJcbiAgICpcclxuICAgKiBTbywgaW4gb3JkZXIgYXMgYWJvdmU6XHJcbiAgICovXHJcbiAgaWYgKFxyXG4gICAgZGF5T2ZNb250aCA9PT0gbnVsbCB8fCBtb250aCA9PT0gbnVsbCB8fCB5ZWFyID09PSBudWxsIHx8IHNlY29uZCA9PT0gbnVsbCB8fFxyXG4gICAgZGF5T2ZNb250aCA8IDEgfHwgZGF5T2ZNb250aCA+IDMxIHx8XHJcbiAgICB5ZWFyIDwgMTYwMSB8fFxyXG4gICAgaG91ciA+IDIzIHx8XHJcbiAgICBtaW51dGUgPiA1OSB8fFxyXG4gICAgc2Vjb25kID4gNTlcclxuICApIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcblxyXG4gIHJldHVybiBuZXcgRGF0ZShEYXRlLlVUQyh5ZWFyLCBtb250aCwgZGF5T2ZNb250aCwgaG91ciwgbWludXRlLCBzZWNvbmQpKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZm9ybWF0RGF0ZShkYXRlKSB7XHJcbiAgdmFyIGQgPSBkYXRlLmdldFVUQ0RhdGUoKTsgZCA9IGQgPj0gMTAgPyBkIDogJzAnK2Q7XHJcbiAgdmFyIGggPSBkYXRlLmdldFVUQ0hvdXJzKCk7IGggPSBoID49IDEwID8gaCA6ICcwJytoO1xyXG4gIHZhciBtID0gZGF0ZS5nZXRVVENNaW51dGVzKCk7IG0gPSBtID49IDEwID8gbSA6ICcwJyttO1xyXG4gIHZhciBzID0gZGF0ZS5nZXRVVENTZWNvbmRzKCk7IHMgPSBzID49IDEwID8gcyA6ICcwJytzO1xyXG4gIHJldHVybiBOVU1fVE9fREFZW2RhdGUuZ2V0VVRDRGF5KCldICsgJywgJyArXHJcbiAgICBkKycgJysgTlVNX1RPX01PTlRIW2RhdGUuZ2V0VVRDTW9udGgoKV0gKycgJysgZGF0ZS5nZXRVVENGdWxsWWVhcigpICsnICcrXHJcbiAgICBoKyc6JyttKyc6JytzKycgR01UJztcclxufVxyXG5cclxuLy8gUzUuMS4yIENhbm9uaWNhbGl6ZWQgSG9zdCBOYW1lc1xyXG5mdW5jdGlvbiBjYW5vbmljYWxEb21haW4oc3RyKSB7XHJcbiAgaWYgKHN0ciA9PSBudWxsKSB7XHJcbiAgICByZXR1cm4gbnVsbDtcclxuICB9XHJcbiAgc3RyID0gc3RyLnRyaW0oKS5yZXBsYWNlKC9eXFwuLywnJyk7IC8vIFM0LjEuMi4zICYgUzUuMi4zOiBpZ25vcmUgbGVhZGluZyAuXHJcblxyXG4gIC8vIGNvbnZlcnQgdG8gSUROIGlmIGFueSBub24tQVNDSUkgY2hhcmFjdGVyc1xyXG4gIGlmIChwdW55Y29kZSAmJiAvW15cXHUwMDAxLVxcdTAwN2ZdLy50ZXN0KHN0cikpIHtcclxuICAgIHN0ciA9IHB1bnljb2RlLnRvQVNDSUkoc3RyKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBzdHIudG9Mb3dlckNhc2UoKTtcclxufVxyXG5cclxuLy8gUzUuMS4zIERvbWFpbiBNYXRjaGluZ1xyXG5mdW5jdGlvbiBkb21haW5NYXRjaChzdHIsIGRvbVN0ciwgY2Fub25pY2FsaXplKSB7XHJcbiAgaWYgKHN0ciA9PSBudWxsIHx8IGRvbVN0ciA9PSBudWxsKSB7XHJcbiAgICByZXR1cm4gbnVsbDtcclxuICB9XHJcbiAgaWYgKGNhbm9uaWNhbGl6ZSAhPT0gZmFsc2UpIHtcclxuICAgIHN0ciA9IGNhbm9uaWNhbERvbWFpbihzdHIpO1xyXG4gICAgZG9tU3RyID0gY2Fub25pY2FsRG9tYWluKGRvbVN0cik7XHJcbiAgfVxyXG5cclxuICAvKlxyXG4gICAqIFwiVGhlIGRvbWFpbiBzdHJpbmcgYW5kIHRoZSBzdHJpbmcgYXJlIGlkZW50aWNhbC4gKE5vdGUgdGhhdCBib3RoIHRoZVxyXG4gICAqIGRvbWFpbiBzdHJpbmcgYW5kIHRoZSBzdHJpbmcgd2lsbCBoYXZlIGJlZW4gY2Fub25pY2FsaXplZCB0byBsb3dlciBjYXNlIGF0XHJcbiAgICogdGhpcyBwb2ludClcIlxyXG4gICAqL1xyXG4gIGlmIChzdHIgPT0gZG9tU3RyKSB7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcblxyXG4gIC8qIFwiQWxsIG9mIHRoZSBmb2xsb3dpbmcgW3RocmVlXSBjb25kaXRpb25zIGhvbGQ6XCIgKG9yZGVyIGFkanVzdGVkIGZyb20gdGhlIFJGQykgKi9cclxuXHJcbiAgLyogXCIqIFRoZSBzdHJpbmcgaXMgYSBob3N0IG5hbWUgKGkuZS4sIG5vdCBhbiBJUCBhZGRyZXNzKS5cIiAqL1xyXG4gIGlmIChuZXQuaXNJUChzdHIpKSB7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG5cclxuICAvKiBcIiogVGhlIGRvbWFpbiBzdHJpbmcgaXMgYSBzdWZmaXggb2YgdGhlIHN0cmluZ1wiICovXHJcbiAgdmFyIGlkeCA9IHN0ci5pbmRleE9mKGRvbVN0cik7XHJcbiAgaWYgKGlkeCA8PSAwKSB7XHJcbiAgICByZXR1cm4gZmFsc2U7IC8vIGl0J3MgYSBub24tbWF0Y2ggKC0xKSBvciBwcmVmaXggKDApXHJcbiAgfVxyXG5cclxuICAvLyBlLmcgXCJhLmIuY1wiLmluZGV4T2YoXCJiLmNcIikgPT09IDJcclxuICAvLyA1ID09PSAzKzJcclxuICBpZiAoc3RyLmxlbmd0aCAhPT0gZG9tU3RyLmxlbmd0aCArIGlkeCkgeyAvLyBpdCdzIG5vdCBhIHN1ZmZpeFxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgLyogXCIqIFRoZSBsYXN0IGNoYXJhY3RlciBvZiB0aGUgc3RyaW5nIHRoYXQgaXMgbm90IGluY2x1ZGVkIGluIHRoZSBkb21haW5cclxuICAqIHN0cmluZyBpcyBhICV4MkUgKFwiLlwiKSBjaGFyYWN0ZXIuXCIgKi9cclxuICBpZiAoc3RyLnN1YnN0cihpZHgtMSwxKSAhPT0gJy4nKSB7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gdHJ1ZTtcclxufVxyXG5cclxuXHJcbi8vIFJGQzYyNjUgUzUuMS40IFBhdGhzIGFuZCBQYXRoLU1hdGNoXHJcblxyXG4vKlxyXG4gKiBcIlRoZSB1c2VyIGFnZW50IE1VU1QgdXNlIGFuIGFsZ29yaXRobSBlcXVpdmFsZW50IHRvIHRoZSBmb2xsb3dpbmcgYWxnb3JpdGhtXHJcbiAqIHRvIGNvbXB1dGUgdGhlIGRlZmF1bHQtcGF0aCBvZiBhIGNvb2tpZTpcIlxyXG4gKlxyXG4gKiBBc3N1bXB0aW9uOiB0aGUgcGF0aCAoYW5kIG5vdCBxdWVyeSBwYXJ0IG9yIGFic29sdXRlIHVyaSkgaXMgcGFzc2VkIGluLlxyXG4gKi9cclxuZnVuY3Rpb24gZGVmYXVsdFBhdGgocGF0aCkge1xyXG4gIC8vIFwiMi4gSWYgdGhlIHVyaS1wYXRoIGlzIGVtcHR5IG9yIGlmIHRoZSBmaXJzdCBjaGFyYWN0ZXIgb2YgdGhlIHVyaS1wYXRoIGlzIG5vdFxyXG4gIC8vIGEgJXgyRiAoXCIvXCIpIGNoYXJhY3Rlciwgb3V0cHV0ICV4MkYgKFwiL1wiKSBhbmQgc2tpcCB0aGUgcmVtYWluaW5nIHN0ZXBzLlxyXG4gIGlmICghcGF0aCB8fCBwYXRoLnN1YnN0cigwLDEpICE9PSBcIi9cIikge1xyXG4gICAgcmV0dXJuIFwiL1wiO1xyXG4gIH1cclxuXHJcbiAgLy8gXCIzLiBJZiB0aGUgdXJpLXBhdGggY29udGFpbnMgbm8gbW9yZSB0aGFuIG9uZSAleDJGIChcIi9cIikgY2hhcmFjdGVyLCBvdXRwdXRcclxuICAvLyAleDJGIChcIi9cIikgYW5kIHNraXAgdGhlIHJlbWFpbmluZyBzdGVwLlwiXHJcbiAgaWYgKHBhdGggPT09IFwiL1wiKSB7XHJcbiAgICByZXR1cm4gcGF0aDtcclxuICB9XHJcblxyXG4gIHZhciByaWdodFNsYXNoID0gcGF0aC5sYXN0SW5kZXhPZihcIi9cIik7XHJcbiAgaWYgKHJpZ2h0U2xhc2ggPT09IDApIHtcclxuICAgIHJldHVybiBcIi9cIjtcclxuICB9XHJcblxyXG4gIC8vIFwiNC4gT3V0cHV0IHRoZSBjaGFyYWN0ZXJzIG9mIHRoZSB1cmktcGF0aCBmcm9tIHRoZSBmaXJzdCBjaGFyYWN0ZXIgdXAgdG8sXHJcbiAgLy8gYnV0IG5vdCBpbmNsdWRpbmcsIHRoZSByaWdodC1tb3N0ICV4MkYgKFwiL1wiKS5cIlxyXG4gIHJldHVybiBwYXRoLnNsaWNlKDAsIHJpZ2h0U2xhc2gpO1xyXG59XHJcblxyXG5mdW5jdGlvbiB0cmltVGVybWluYXRvcihzdHIpIHtcclxuICBmb3IgKHZhciB0ID0gMDsgdCA8IFRFUk1JTkFUT1JTLmxlbmd0aDsgdCsrKSB7XHJcbiAgICB2YXIgdGVybWluYXRvcklkeCA9IHN0ci5pbmRleE9mKFRFUk1JTkFUT1JTW3RdKTtcclxuICAgIGlmICh0ZXJtaW5hdG9ySWR4ICE9PSAtMSkge1xyXG4gICAgICBzdHIgPSBzdHIuc3Vic3RyKDAsdGVybWluYXRvcklkeCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gc3RyO1xyXG59XHJcblxyXG5mdW5jdGlvbiBwYXJzZUNvb2tpZVBhaXIoY29va2llUGFpciwgbG9vc2VNb2RlKSB7XHJcbiAgY29va2llUGFpciA9IHRyaW1UZXJtaW5hdG9yKGNvb2tpZVBhaXIpO1xyXG5cclxuICB2YXIgZmlyc3RFcSA9IGNvb2tpZVBhaXIuaW5kZXhPZignPScpO1xyXG4gIGlmIChsb29zZU1vZGUpIHtcclxuICAgIGlmIChmaXJzdEVxID09PSAwKSB7IC8vICc9JyBpcyBpbW1lZGlhdGVseSBhdCBzdGFydFxyXG4gICAgICBjb29raWVQYWlyID0gY29va2llUGFpci5zdWJzdHIoMSk7XHJcbiAgICAgIGZpcnN0RXEgPSBjb29raWVQYWlyLmluZGV4T2YoJz0nKTsgLy8gbWlnaHQgc3RpbGwgbmVlZCB0byBzcGxpdCBvbiAnPSdcclxuICAgIH1cclxuICB9IGVsc2UgeyAvLyBub24tbG9vc2UgbW9kZVxyXG4gICAgaWYgKGZpcnN0RXEgPD0gMCkgeyAvLyBubyAnPScgb3IgaXMgYXQgc3RhcnRcclxuICAgICAgcmV0dXJuOyAvLyBuZWVkcyB0byBoYXZlIG5vbi1lbXB0eSBcImNvb2tpZS1uYW1lXCJcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHZhciBjb29raWVOYW1lLCBjb29raWVWYWx1ZTtcclxuICBpZiAoZmlyc3RFcSA8PSAwKSB7XHJcbiAgICBjb29raWVOYW1lID0gXCJcIjtcclxuICAgIGNvb2tpZVZhbHVlID0gY29va2llUGFpci50cmltKCk7XHJcbiAgfSBlbHNlIHtcclxuICAgIGNvb2tpZU5hbWUgPSBjb29raWVQYWlyLnN1YnN0cigwLCBmaXJzdEVxKS50cmltKCk7XHJcbiAgICBjb29raWVWYWx1ZSA9IGNvb2tpZVBhaXIuc3Vic3RyKGZpcnN0RXErMSkudHJpbSgpO1xyXG4gIH1cclxuXHJcbiAgaWYgKENPTlRST0xfQ0hBUlMudGVzdChjb29raWVOYW1lKSB8fCBDT05UUk9MX0NIQVJTLnRlc3QoY29va2llVmFsdWUpKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG5cclxuICB2YXIgYyA9IG5ldyBDb29raWUoKTtcclxuICBjLmtleSA9IGNvb2tpZU5hbWU7XHJcbiAgYy52YWx1ZSA9IGNvb2tpZVZhbHVlO1xyXG4gIHJldHVybiBjO1xyXG59XHJcblxyXG5mdW5jdGlvbiBwYXJzZShzdHIsIG9wdGlvbnMpIHtcclxuICBpZiAoIW9wdGlvbnMgfHwgdHlwZW9mIG9wdGlvbnMgIT09ICdvYmplY3QnKSB7XHJcbiAgICBvcHRpb25zID0ge307XHJcbiAgfVxyXG4gIHN0ciA9IHN0ci50cmltKCk7XHJcblxyXG4gIC8vIFdlIHVzZSBhIHJlZ2V4IHRvIHBhcnNlIHRoZSBcIm5hbWUtdmFsdWUtcGFpclwiIHBhcnQgb2YgUzUuMlxyXG4gIHZhciBmaXJzdFNlbWkgPSBzdHIuaW5kZXhPZignOycpOyAvLyBTNS4yIHN0ZXAgMVxyXG4gIHZhciBjb29raWVQYWlyID0gKGZpcnN0U2VtaSA9PT0gLTEpID8gc3RyIDogc3RyLnN1YnN0cigwLCBmaXJzdFNlbWkpO1xyXG4gIHZhciBjID0gcGFyc2VDb29raWVQYWlyKGNvb2tpZVBhaXIsICEhb3B0aW9ucy5sb29zZSk7XHJcbiAgaWYgKCFjKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG5cclxuICBpZiAoZmlyc3RTZW1pID09PSAtMSkge1xyXG4gICAgcmV0dXJuIGM7XHJcbiAgfVxyXG5cclxuICAvLyBTNS4yLjMgXCJ1bnBhcnNlZC1hdHRyaWJ1dGVzIGNvbnNpc3Qgb2YgdGhlIHJlbWFpbmRlciBvZiB0aGUgc2V0LWNvb2tpZS1zdHJpbmdcclxuICAvLyAoaW5jbHVkaW5nIHRoZSAleDNCIChcIjtcIikgaW4gcXVlc3Rpb24pLlwiIHBsdXMgbGF0ZXIgb24gaW4gdGhlIHNhbWUgc2VjdGlvblxyXG4gIC8vIFwiZGlzY2FyZCB0aGUgZmlyc3QgXCI7XCIgYW5kIHRyaW1cIi5cclxuICB2YXIgdW5wYXJzZWQgPSBzdHIuc2xpY2UoZmlyc3RTZW1pICsgMSkudHJpbSgpO1xyXG5cclxuICAvLyBcIklmIHRoZSB1bnBhcnNlZC1hdHRyaWJ1dGVzIHN0cmluZyBpcyBlbXB0eSwgc2tpcCB0aGUgcmVzdCBvZiB0aGVzZVxyXG4gIC8vIHN0ZXBzLlwiXHJcbiAgaWYgKHVucGFyc2VkLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgcmV0dXJuIGM7XHJcbiAgfVxyXG5cclxuICAvKlxyXG4gICAqIFM1LjIgc2F5cyB0aGF0IHdoZW4gbG9vcGluZyBvdmVyIHRoZSBpdGVtcyBcIltwXXJvY2VzcyB0aGUgYXR0cmlidXRlLW5hbWVcclxuICAgKiBhbmQgYXR0cmlidXRlLXZhbHVlIGFjY29yZGluZyB0byB0aGUgcmVxdWlyZW1lbnRzIGluIHRoZSBmb2xsb3dpbmdcclxuICAgKiBzdWJzZWN0aW9uc1wiIGZvciBldmVyeSBpdGVtLiAgUGx1cywgZm9yIG1hbnkgb2YgdGhlIGluZGl2aWR1YWwgYXR0cmlidXRlc1xyXG4gICAqIGluIFM1LjMgaXQgc2F5cyB0byB1c2UgdGhlIFwiYXR0cmlidXRlLXZhbHVlIG9mIHRoZSBsYXN0IGF0dHJpYnV0ZSBpbiB0aGVcclxuICAgKiBjb29raWUtYXR0cmlidXRlLWxpc3RcIi4gIFRoZXJlZm9yZSwgaW4gdGhpcyBpbXBsZW1lbnRhdGlvbiwgd2Ugb3ZlcndyaXRlXHJcbiAgICogdGhlIHByZXZpb3VzIHZhbHVlLlxyXG4gICAqL1xyXG4gIHZhciBjb29raWVfYXZzID0gdW5wYXJzZWQuc3BsaXQoJzsnKTtcclxuICB3aGlsZSAoY29va2llX2F2cy5sZW5ndGgpIHtcclxuICAgIHZhciBhdiA9IGNvb2tpZV9hdnMuc2hpZnQoKS50cmltKCk7XHJcbiAgICBpZiAoYXYubGVuZ3RoID09PSAwKSB7IC8vIGhhcHBlbnMgaWYgXCI7O1wiIGFwcGVhcnNcclxuICAgICAgY29udGludWU7XHJcbiAgICB9XHJcbiAgICB2YXIgYXZfc2VwID0gYXYuaW5kZXhPZignPScpO1xyXG4gICAgdmFyIGF2X2tleSwgYXZfdmFsdWU7XHJcblxyXG4gICAgaWYgKGF2X3NlcCA9PT0gLTEpIHtcclxuICAgICAgYXZfa2V5ID0gYXY7XHJcbiAgICAgIGF2X3ZhbHVlID0gbnVsbDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGF2X2tleSA9IGF2LnN1YnN0cigwLGF2X3NlcCk7XHJcbiAgICAgIGF2X3ZhbHVlID0gYXYuc3Vic3RyKGF2X3NlcCsxKTtcclxuICAgIH1cclxuXHJcbiAgICBhdl9rZXkgPSBhdl9rZXkudHJpbSgpLnRvTG93ZXJDYXNlKCk7XHJcblxyXG4gICAgaWYgKGF2X3ZhbHVlKSB7XHJcbiAgICAgIGF2X3ZhbHVlID0gYXZfdmFsdWUudHJpbSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHN3aXRjaChhdl9rZXkpIHtcclxuICAgIGNhc2UgJ2V4cGlyZXMnOiAvLyBTNS4yLjFcclxuICAgICAgaWYgKGF2X3ZhbHVlKSB7XHJcbiAgICAgICAgdmFyIGV4cCA9IHBhcnNlRGF0ZShhdl92YWx1ZSk7XHJcbiAgICAgICAgLy8gXCJJZiB0aGUgYXR0cmlidXRlLXZhbHVlIGZhaWxlZCB0byBwYXJzZSBhcyBhIGNvb2tpZSBkYXRlLCBpZ25vcmUgdGhlXHJcbiAgICAgICAgLy8gY29va2llLWF2LlwiXHJcbiAgICAgICAgaWYgKGV4cCkge1xyXG4gICAgICAgICAgLy8gb3ZlciBhbmQgdW5kZXJmbG93IG5vdCByZWFsaXN0aWNhbGx5IGEgY29uY2VybjogVjgncyBnZXRUaW1lKCkgc2VlbXMgdG9cclxuICAgICAgICAgIC8vIHN0b3JlIHNvbWV0aGluZyBsYXJnZXIgdGhhbiBhIDMyLWJpdCB0aW1lX3QgKGV2ZW4gd2l0aCAzMi1iaXQgbm9kZSlcclxuICAgICAgICAgIGMuZXhwaXJlcyA9IGV4cDtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgYnJlYWs7XHJcblxyXG4gICAgY2FzZSAnbWF4LWFnZSc6IC8vIFM1LjIuMlxyXG4gICAgICBpZiAoYXZfdmFsdWUpIHtcclxuICAgICAgICAvLyBcIklmIHRoZSBmaXJzdCBjaGFyYWN0ZXIgb2YgdGhlIGF0dHJpYnV0ZS12YWx1ZSBpcyBub3QgYSBESUdJVCBvciBhIFwiLVwiXHJcbiAgICAgICAgLy8gY2hhcmFjdGVyIC4uLltvcl0uLi4gSWYgdGhlIHJlbWFpbmRlciBvZiBhdHRyaWJ1dGUtdmFsdWUgY29udGFpbnMgYVxyXG4gICAgICAgIC8vIG5vbi1ESUdJVCBjaGFyYWN0ZXIsIGlnbm9yZSB0aGUgY29va2llLWF2LlwiXHJcbiAgICAgICAgaWYgKC9eLT9bMC05XSskLy50ZXN0KGF2X3ZhbHVlKSkge1xyXG4gICAgICAgICAgdmFyIGRlbHRhID0gcGFyc2VJbnQoYXZfdmFsdWUsIDEwKTtcclxuICAgICAgICAgIC8vIFwiSWYgZGVsdGEtc2Vjb25kcyBpcyBsZXNzIHRoYW4gb3IgZXF1YWwgdG8gemVybyAoMCksIGxldCBleHBpcnktdGltZVxyXG4gICAgICAgICAgLy8gYmUgdGhlIGVhcmxpZXN0IHJlcHJlc2VudGFibGUgZGF0ZSBhbmQgdGltZS5cIlxyXG4gICAgICAgICAgYy5zZXRNYXhBZ2UoZGVsdGEpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBicmVhaztcclxuXHJcbiAgICBjYXNlICdkb21haW4nOiAvLyBTNS4yLjNcclxuICAgICAgLy8gXCJJZiB0aGUgYXR0cmlidXRlLXZhbHVlIGlzIGVtcHR5LCB0aGUgYmVoYXZpb3IgaXMgdW5kZWZpbmVkLiAgSG93ZXZlcixcclxuICAgICAgLy8gdGhlIHVzZXIgYWdlbnQgU0hPVUxEIGlnbm9yZSB0aGUgY29va2llLWF2IGVudGlyZWx5LlwiXHJcbiAgICAgIGlmIChhdl92YWx1ZSkge1xyXG4gICAgICAgIC8vIFM1LjIuMyBcIkxldCBjb29raWUtZG9tYWluIGJlIHRoZSBhdHRyaWJ1dGUtdmFsdWUgd2l0aG91dCB0aGUgbGVhZGluZyAleDJFXHJcbiAgICAgICAgLy8gKFwiLlwiKSBjaGFyYWN0ZXIuXCJcclxuICAgICAgICB2YXIgZG9tYWluID0gYXZfdmFsdWUudHJpbSgpLnJlcGxhY2UoL15cXC4vLCAnJyk7XHJcbiAgICAgICAgaWYgKGRvbWFpbikge1xyXG4gICAgICAgICAgLy8gXCJDb252ZXJ0IHRoZSBjb29raWUtZG9tYWluIHRvIGxvd2VyIGNhc2UuXCJcclxuICAgICAgICAgIGMuZG9tYWluID0gZG9tYWluLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGJyZWFrO1xyXG5cclxuICAgIGNhc2UgJ3BhdGgnOiAvLyBTNS4yLjRcclxuICAgICAgLypcclxuICAgICAgICogXCJJZiB0aGUgYXR0cmlidXRlLXZhbHVlIGlzIGVtcHR5IG9yIGlmIHRoZSBmaXJzdCBjaGFyYWN0ZXIgb2YgdGhlXHJcbiAgICAgICAqIGF0dHJpYnV0ZS12YWx1ZSBpcyBub3QgJXgyRiAoXCIvXCIpOlxyXG4gICAgICAgKiAgIExldCBjb29raWUtcGF0aCBiZSB0aGUgZGVmYXVsdC1wYXRoLlxyXG4gICAgICAgKiBPdGhlcndpc2U6XHJcbiAgICAgICAqICAgTGV0IGNvb2tpZS1wYXRoIGJlIHRoZSBhdHRyaWJ1dGUtdmFsdWUuXCJcclxuICAgICAgICpcclxuICAgICAgICogV2UnbGwgcmVwcmVzZW50IHRoZSBkZWZhdWx0LXBhdGggYXMgbnVsbCBzaW5jZSBpdCBkZXBlbmRzIG9uIHRoZVxyXG4gICAgICAgKiBjb250ZXh0IG9mIHRoZSBwYXJzaW5nLlxyXG4gICAgICAgKi9cclxuICAgICAgYy5wYXRoID0gYXZfdmFsdWUgJiYgYXZfdmFsdWVbMF0gPT09IFwiL1wiID8gYXZfdmFsdWUgOiBudWxsO1xyXG4gICAgICBicmVhaztcclxuXHJcbiAgICBjYXNlICdzZWN1cmUnOiAvLyBTNS4yLjVcclxuICAgICAgLypcclxuICAgICAgICogXCJJZiB0aGUgYXR0cmlidXRlLW5hbWUgY2FzZS1pbnNlbnNpdGl2ZWx5IG1hdGNoZXMgdGhlIHN0cmluZyBcIlNlY3VyZVwiLFxyXG4gICAgICAgKiB0aGUgdXNlciBhZ2VudCBNVVNUIGFwcGVuZCBhbiBhdHRyaWJ1dGUgdG8gdGhlIGNvb2tpZS1hdHRyaWJ1dGUtbGlzdFxyXG4gICAgICAgKiB3aXRoIGFuIGF0dHJpYnV0ZS1uYW1lIG9mIFNlY3VyZSBhbmQgYW4gZW1wdHkgYXR0cmlidXRlLXZhbHVlLlwiXHJcbiAgICAgICAqL1xyXG4gICAgICBjLnNlY3VyZSA9IHRydWU7XHJcbiAgICAgIGJyZWFrO1xyXG5cclxuICAgIGNhc2UgJ2h0dHBvbmx5JzogLy8gUzUuMi42IC0tIGVmZmVjdGl2ZWx5IHRoZSBzYW1lIGFzICdzZWN1cmUnXHJcbiAgICAgIGMuaHR0cE9ubHkgPSB0cnVlO1xyXG4gICAgICBicmVhaztcclxuXHJcbiAgICBkZWZhdWx0OlxyXG4gICAgICBjLmV4dGVuc2lvbnMgPSBjLmV4dGVuc2lvbnMgfHwgW107XHJcbiAgICAgIGMuZXh0ZW5zaW9ucy5wdXNoKGF2KTtcclxuICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gYztcclxufVxyXG5cclxuLy8gYXZvaWQgdGhlIFY4IGRlb3B0aW1pemF0aW9uIG1vbnN0ZXIhXHJcbmZ1bmN0aW9uIGpzb25QYXJzZShzdHIpIHtcclxuICB2YXIgb2JqO1xyXG4gIHRyeSB7XHJcbiAgICBvYmogPSBKU09OLnBhcnNlKHN0cik7XHJcbiAgfSBjYXRjaCAoZSkge1xyXG4gICAgcmV0dXJuIGU7XHJcbiAgfVxyXG4gIHJldHVybiBvYmo7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGZyb21KU09OKHN0cikge1xyXG4gIGlmICghc3RyKSB7XHJcbiAgICByZXR1cm4gbnVsbDtcclxuICB9XHJcblxyXG4gIHZhciBvYmo7XHJcbiAgaWYgKHR5cGVvZiBzdHIgPT09ICdzdHJpbmcnKSB7XHJcbiAgICBvYmogPSBqc29uUGFyc2Uoc3RyKTtcclxuICAgIGlmIChvYmogaW5zdGFuY2VvZiBFcnJvcikge1xyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICB9IGVsc2Uge1xyXG4gICAgLy8gYXNzdW1lIGl0J3MgYW4gT2JqZWN0XHJcbiAgICBvYmogPSBzdHI7XHJcbiAgfVxyXG5cclxuICB2YXIgYyA9IG5ldyBDb29raWUoKTtcclxuICBmb3IgKHZhciBpPTA7IGk8Q29va2llLnNlcmlhbGl6YWJsZVByb3BlcnRpZXMubGVuZ3RoOyBpKyspIHtcclxuICAgIHZhciBwcm9wID0gQ29va2llLnNlcmlhbGl6YWJsZVByb3BlcnRpZXNbaV07XHJcbiAgICBpZiAob2JqW3Byb3BdID09PSB1bmRlZmluZWQgfHxcclxuICAgICAgICBvYmpbcHJvcF0gPT09IENvb2tpZS5wcm90b3R5cGVbcHJvcF0pXHJcbiAgICB7XHJcbiAgICAgIGNvbnRpbnVlOyAvLyBsZWF2ZSBhcyBwcm90b3R5cGUgZGVmYXVsdFxyXG4gICAgfVxyXG5cclxuICAgIGlmIChwcm9wID09PSAnZXhwaXJlcycgfHxcclxuICAgICAgICBwcm9wID09PSAnY3JlYXRpb24nIHx8XHJcbiAgICAgICAgcHJvcCA9PT0gJ2xhc3RBY2Nlc3NlZCcpXHJcbiAgICB7XHJcbiAgICAgIGlmIChvYmpbcHJvcF0gPT09IG51bGwpIHtcclxuICAgICAgICBjW3Byb3BdID0gbnVsbDtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjW3Byb3BdID0gb2JqW3Byb3BdID09IFwiSW5maW5pdHlcIiA/XHJcbiAgICAgICAgICBcIkluZmluaXR5XCIgOiBuZXcgRGF0ZShvYmpbcHJvcF0pO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjW3Byb3BdID0gb2JqW3Byb3BdO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGM7XHJcbn1cclxuXHJcbi8qIFNlY3Rpb24gNS40IHBhcnQgMjpcclxuICogXCIqICBDb29raWVzIHdpdGggbG9uZ2VyIHBhdGhzIGFyZSBsaXN0ZWQgYmVmb3JlIGNvb2tpZXMgd2l0aFxyXG4gKiAgICAgc2hvcnRlciBwYXRocy5cclxuICpcclxuICogICogIEFtb25nIGNvb2tpZXMgdGhhdCBoYXZlIGVxdWFsLWxlbmd0aCBwYXRoIGZpZWxkcywgY29va2llcyB3aXRoXHJcbiAqICAgICBlYXJsaWVyIGNyZWF0aW9uLXRpbWVzIGFyZSBsaXN0ZWQgYmVmb3JlIGNvb2tpZXMgd2l0aCBsYXRlclxyXG4gKiAgICAgY3JlYXRpb24tdGltZXMuXCJcclxuICovXHJcblxyXG5mdW5jdGlvbiBjb29raWVDb21wYXJlKGEsYikge1xyXG4gIHZhciBjbXAgPSAwO1xyXG5cclxuICAvLyBkZXNjZW5kaW5nIGZvciBsZW5ndGg6IGIgQ01QIGFcclxuICB2YXIgYVBhdGhMZW4gPSBhLnBhdGggPyBhLnBhdGgubGVuZ3RoIDogMDtcclxuICB2YXIgYlBhdGhMZW4gPSBiLnBhdGggPyBiLnBhdGgubGVuZ3RoIDogMDtcclxuICBjbXAgPSBiUGF0aExlbiAtIGFQYXRoTGVuO1xyXG4gIGlmIChjbXAgIT09IDApIHtcclxuICAgIHJldHVybiBjbXA7XHJcbiAgfVxyXG5cclxuICAvLyBhc2NlbmRpbmcgZm9yIHRpbWU6IGEgQ01QIGJcclxuICB2YXIgYVRpbWUgPSBhLmNyZWF0aW9uID8gYS5jcmVhdGlvbi5nZXRUaW1lKCkgOiBNQVhfVElNRTtcclxuICB2YXIgYlRpbWUgPSBiLmNyZWF0aW9uID8gYi5jcmVhdGlvbi5nZXRUaW1lKCkgOiBNQVhfVElNRTtcclxuICBjbXAgPSBhVGltZSAtIGJUaW1lO1xyXG4gIGlmIChjbXAgIT09IDApIHtcclxuICAgIHJldHVybiBjbXA7XHJcbiAgfVxyXG5cclxuICAvLyBicmVhayB0aWVzIGZvciB0aGUgc2FtZSBtaWxsaXNlY29uZCAocHJlY2lzaW9uIG9mIEphdmFTY3JpcHQncyBjbG9jaylcclxuICBjbXAgPSBhLmNyZWF0aW9uSW5kZXggLSBiLmNyZWF0aW9uSW5kZXg7XHJcblxyXG4gIHJldHVybiBjbXA7XHJcbn1cclxuXHJcbi8vIEdpdmVzIHRoZSBwZXJtdXRhdGlvbiBvZiBhbGwgcG9zc2libGUgcGF0aE1hdGNoKCllcyBvZiBhIGdpdmVuIHBhdGguIFRoZVxyXG4vLyBhcnJheSBpcyBpbiBsb25nZXN0LXRvLXNob3J0ZXN0IG9yZGVyLiAgSGFuZHkgZm9yIGluZGV4aW5nLlxyXG5mdW5jdGlvbiBwZXJtdXRlUGF0aChwYXRoKSB7XHJcbiAgaWYgKHBhdGggPT09ICcvJykge1xyXG4gICAgcmV0dXJuIFsnLyddO1xyXG4gIH1cclxuICBpZiAocGF0aC5sYXN0SW5kZXhPZignLycpID09PSBwYXRoLmxlbmd0aC0xKSB7XHJcbiAgICBwYXRoID0gcGF0aC5zdWJzdHIoMCxwYXRoLmxlbmd0aC0xKTtcclxuICB9XHJcbiAgdmFyIHBlcm11dGF0aW9ucyA9IFtwYXRoXTtcclxuICB3aGlsZSAocGF0aC5sZW5ndGggPiAxKSB7XHJcbiAgICB2YXIgbGluZGV4ID0gcGF0aC5sYXN0SW5kZXhPZignLycpO1xyXG4gICAgaWYgKGxpbmRleCA9PT0gMCkge1xyXG4gICAgICBicmVhaztcclxuICAgIH1cclxuICAgIHBhdGggPSBwYXRoLnN1YnN0cigwLGxpbmRleCk7XHJcbiAgICBwZXJtdXRhdGlvbnMucHVzaChwYXRoKTtcclxuICB9XHJcbiAgcGVybXV0YXRpb25zLnB1c2goJy8nKTtcclxuICByZXR1cm4gcGVybXV0YXRpb25zO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRDb29raWVDb250ZXh0KHVybCkge1xyXG4gIGlmICh1cmwgaW5zdGFuY2VvZiBPYmplY3QpIHtcclxuICAgIHJldHVybiB1cmw7XHJcbiAgfVxyXG4gIC8vIE5PVEU6IGRlY29kZVVSSSB3aWxsIHRocm93IG9uIG1hbGZvcm1lZCBVUklzIChzZWUgR0gtMzIpLlxyXG4gIC8vIFRoZXJlZm9yZSwgd2Ugd2lsbCBqdXN0IHNraXAgZGVjb2RpbmcgZm9yIHN1Y2ggVVJJcy5cclxuICB0cnkge1xyXG4gICAgdXJsID0gZGVjb2RlVVJJKHVybCk7XHJcbiAgfVxyXG4gIGNhdGNoKGVycikge1xyXG4gICAgLy8gU2lsZW50bHkgc3dhbGxvdyBlcnJvclxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHVybFBhcnNlKHVybCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIENvb2tpZShvcHRpb25zKSB7XHJcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XHJcblxyXG4gIE9iamVjdC5rZXlzKG9wdGlvbnMpLmZvckVhY2goZnVuY3Rpb24ocHJvcCkge1xyXG4gICAgaWYgKENvb2tpZS5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkocHJvcCkgJiZcclxuICAgICAgICBDb29raWUucHJvdG90eXBlW3Byb3BdICE9PSBvcHRpb25zW3Byb3BdICYmXHJcbiAgICAgICAgcHJvcC5zdWJzdHIoMCwxKSAhPT0gJ18nKVxyXG4gICAge1xyXG4gICAgICB0aGlzW3Byb3BdID0gb3B0aW9uc1twcm9wXTtcclxuICAgIH1cclxuICB9LCB0aGlzKTtcclxuXHJcbiAgdGhpcy5jcmVhdGlvbiA9IHRoaXMuY3JlYXRpb24gfHwgbmV3IERhdGUoKTtcclxuXHJcbiAgLy8gdXNlZCB0byBicmVhayBjcmVhdGlvbiB0aWVzIGluIGNvb2tpZUNvbXBhcmUoKTpcclxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ2NyZWF0aW9uSW5kZXgnLCB7XHJcbiAgICBjb25maWd1cmFibGU6IGZhbHNlLFxyXG4gICAgZW51bWVyYWJsZTogZmFsc2UsIC8vIGltcG9ydGFudCBmb3IgYXNzZXJ0LmRlZXBFcXVhbCBjaGVja3NcclxuICAgIHdyaXRhYmxlOiB0cnVlLFxyXG4gICAgdmFsdWU6ICsrQ29va2llLmNvb2tpZXNDcmVhdGVkXHJcbiAgfSk7XHJcbn1cclxuXHJcbkNvb2tpZS5jb29raWVzQ3JlYXRlZCA9IDA7IC8vIGluY3JlbWVudGVkIGVhY2ggdGltZSBhIGNvb2tpZSBpcyBjcmVhdGVkXHJcblxyXG5Db29raWUucGFyc2UgPSBwYXJzZTtcclxuQ29va2llLmZyb21KU09OID0gZnJvbUpTT047XHJcblxyXG5Db29raWUucHJvdG90eXBlLmtleSA9IFwiXCI7XHJcbkNvb2tpZS5wcm90b3R5cGUudmFsdWUgPSBcIlwiO1xyXG5cclxuLy8gdGhlIG9yZGVyIGluIHdoaWNoIHRoZSBSRkMgaGFzIHRoZW06XHJcbkNvb2tpZS5wcm90b3R5cGUuZXhwaXJlcyA9IFwiSW5maW5pdHlcIjsgLy8gY29lcmNlcyB0byBsaXRlcmFsIEluZmluaXR5XHJcbkNvb2tpZS5wcm90b3R5cGUubWF4QWdlID0gbnVsbDsgLy8gdGFrZXMgcHJlY2VkZW5jZSBvdmVyIGV4cGlyZXMgZm9yIFRUTFxyXG5Db29raWUucHJvdG90eXBlLmRvbWFpbiA9IG51bGw7XHJcbkNvb2tpZS5wcm90b3R5cGUucGF0aCA9IG51bGw7XHJcbkNvb2tpZS5wcm90b3R5cGUuc2VjdXJlID0gZmFsc2U7XHJcbkNvb2tpZS5wcm90b3R5cGUuaHR0cE9ubHkgPSBmYWxzZTtcclxuQ29va2llLnByb3RvdHlwZS5leHRlbnNpb25zID0gbnVsbDtcclxuXHJcbi8vIHNldCBieSB0aGUgQ29va2llSmFyOlxyXG5Db29raWUucHJvdG90eXBlLmhvc3RPbmx5ID0gbnVsbDsgLy8gYm9vbGVhbiB3aGVuIHNldFxyXG5Db29raWUucHJvdG90eXBlLnBhdGhJc0RlZmF1bHQgPSBudWxsOyAvLyBib29sZWFuIHdoZW4gc2V0XHJcbkNvb2tpZS5wcm90b3R5cGUuY3JlYXRpb24gPSBudWxsOyAvLyBEYXRlIHdoZW4gc2V0OyBkZWZhdWx0ZWQgYnkgQ29va2llLnBhcnNlXHJcbkNvb2tpZS5wcm90b3R5cGUubGFzdEFjY2Vzc2VkID0gbnVsbDsgLy8gRGF0ZSB3aGVuIHNldFxyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoQ29va2llLnByb3RvdHlwZSwgJ2NyZWF0aW9uSW5kZXgnLCB7XHJcbiAgY29uZmlndXJhYmxlOiB0cnVlLFxyXG4gIGVudW1lcmFibGU6IGZhbHNlLFxyXG4gIHdyaXRhYmxlOiB0cnVlLFxyXG4gIHZhbHVlOiAwXHJcbn0pO1xyXG5cclxuQ29va2llLnNlcmlhbGl6YWJsZVByb3BlcnRpZXMgPSBPYmplY3Qua2V5cyhDb29raWUucHJvdG90eXBlKVxyXG4gIC5maWx0ZXIoZnVuY3Rpb24ocHJvcCkge1xyXG4gICAgcmV0dXJuICEoXHJcbiAgICAgIENvb2tpZS5wcm90b3R5cGVbcHJvcF0gaW5zdGFuY2VvZiBGdW5jdGlvbiB8fFxyXG4gICAgICBwcm9wID09PSAnY3JlYXRpb25JbmRleCcgfHxcclxuICAgICAgcHJvcC5zdWJzdHIoMCwxKSA9PT0gJ18nXHJcbiAgICApO1xyXG4gIH0pO1xyXG5cclxuQ29va2llLnByb3RvdHlwZS5pbnNwZWN0ID0gZnVuY3Rpb24gaW5zcGVjdCgpIHtcclxuICB2YXIgbm93ID0gRGF0ZS5ub3coKTtcclxuICByZXR1cm4gJ0Nvb2tpZT1cIicrdGhpcy50b1N0cmluZygpICtcclxuICAgICc7IGhvc3RPbmx5PScrKHRoaXMuaG9zdE9ubHkgIT0gbnVsbCA/IHRoaXMuaG9zdE9ubHkgOiAnPycpICtcclxuICAgICc7IGFBZ2U9JysodGhpcy5sYXN0QWNjZXNzZWQgPyAobm93LXRoaXMubGFzdEFjY2Vzc2VkLmdldFRpbWUoKSkrJ21zJyA6ICc/JykgK1xyXG4gICAgJzsgY0FnZT0nKyh0aGlzLmNyZWF0aW9uID8gKG5vdy10aGlzLmNyZWF0aW9uLmdldFRpbWUoKSkrJ21zJyA6ICc/JykgK1xyXG4gICAgJ1wiJztcclxufTtcclxuXHJcbi8vIFVzZSB0aGUgbmV3IGN1c3RvbSBpbnNwZWN0aW9uIHN5bWJvbCB0byBhZGQgdGhlIGN1c3RvbSBpbnNwZWN0IGZ1bmN0aW9uIGlmXHJcbi8vIGF2YWlsYWJsZS5cclxuaWYgKHV0aWwuaW5zcGVjdC5jdXN0b20pIHtcclxuICBDb29raWUucHJvdG90eXBlW3V0aWwuaW5zcGVjdC5jdXN0b21dID0gQ29va2llLnByb3RvdHlwZS5pbnNwZWN0O1xyXG59XHJcblxyXG5Db29raWUucHJvdG90eXBlLnRvSlNPTiA9IGZ1bmN0aW9uKCkge1xyXG4gIHZhciBvYmogPSB7fTtcclxuXHJcbiAgdmFyIHByb3BzID0gQ29va2llLnNlcmlhbGl6YWJsZVByb3BlcnRpZXM7XHJcbiAgZm9yICh2YXIgaT0wOyBpPHByb3BzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICB2YXIgcHJvcCA9IHByb3BzW2ldO1xyXG4gICAgaWYgKHRoaXNbcHJvcF0gPT09IENvb2tpZS5wcm90b3R5cGVbcHJvcF0pIHtcclxuICAgICAgY29udGludWU7IC8vIGxlYXZlIGFzIHByb3RvdHlwZSBkZWZhdWx0XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHByb3AgPT09ICdleHBpcmVzJyB8fFxyXG4gICAgICAgIHByb3AgPT09ICdjcmVhdGlvbicgfHxcclxuICAgICAgICBwcm9wID09PSAnbGFzdEFjY2Vzc2VkJylcclxuICAgIHtcclxuICAgICAgaWYgKHRoaXNbcHJvcF0gPT09IG51bGwpIHtcclxuICAgICAgICBvYmpbcHJvcF0gPSBudWxsO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIG9ialtwcm9wXSA9IHRoaXNbcHJvcF0gPT0gXCJJbmZpbml0eVwiID8gLy8gaW50ZW50aW9uYWxseSBub3QgPT09XHJcbiAgICAgICAgICBcIkluZmluaXR5XCIgOiB0aGlzW3Byb3BdLnRvSVNPU3RyaW5nKCk7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSBpZiAocHJvcCA9PT0gJ21heEFnZScpIHtcclxuICAgICAgaWYgKHRoaXNbcHJvcF0gIT09IG51bGwpIHtcclxuICAgICAgICAvLyBhZ2FpbiwgaW50ZW50aW9uYWxseSBub3QgPT09XHJcbiAgICAgICAgb2JqW3Byb3BdID0gKHRoaXNbcHJvcF0gPT0gSW5maW5pdHkgfHwgdGhpc1twcm9wXSA9PSAtSW5maW5pdHkpID9cclxuICAgICAgICAgIHRoaXNbcHJvcF0udG9TdHJpbmcoKSA6IHRoaXNbcHJvcF07XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGlmICh0aGlzW3Byb3BdICE9PSBDb29raWUucHJvdG90eXBlW3Byb3BdKSB7XHJcbiAgICAgICAgb2JqW3Byb3BdID0gdGhpc1twcm9wXTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIG9iajtcclxufTtcclxuXHJcbkNvb2tpZS5wcm90b3R5cGUuY2xvbmUgPSBmdW5jdGlvbigpIHtcclxuICByZXR1cm4gZnJvbUpTT04odGhpcy50b0pTT04oKSk7XHJcbn07XHJcblxyXG5Db29raWUucHJvdG90eXBlLnZhbGlkYXRlID0gZnVuY3Rpb24gdmFsaWRhdGUoKSB7XHJcbiAgaWYgKCFDT09LSUVfT0NURVRTLnRlc3QodGhpcy52YWx1ZSkpIHtcclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcbiAgaWYgKHRoaXMuZXhwaXJlcyAhPSBJbmZpbml0eSAmJiAhKHRoaXMuZXhwaXJlcyBpbnN0YW5jZW9mIERhdGUpICYmICFwYXJzZURhdGUodGhpcy5leHBpcmVzKSkge1xyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuICBpZiAodGhpcy5tYXhBZ2UgIT0gbnVsbCAmJiB0aGlzLm1heEFnZSA8PSAwKSB7XHJcbiAgICByZXR1cm4gZmFsc2U7IC8vIFwiTWF4LUFnZT1cIiBub24temVyby1kaWdpdCAqRElHSVRcclxuICB9XHJcbiAgaWYgKHRoaXMucGF0aCAhPSBudWxsICYmICFQQVRIX1ZBTFVFLnRlc3QodGhpcy5wYXRoKSkge1xyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgdmFyIGNkb21haW4gPSB0aGlzLmNkb21haW4oKTtcclxuICBpZiAoY2RvbWFpbikge1xyXG4gICAgaWYgKGNkb21haW4ubWF0Y2goL1xcLiQvKSkge1xyXG4gICAgICByZXR1cm4gZmFsc2U7IC8vIFM0LjEuMi4zIHN1Z2dlc3RzIHRoYXQgdGhpcyBpcyBiYWQuIGRvbWFpbk1hdGNoKCkgdGVzdHMgY29uZmlybSB0aGlzXHJcbiAgICB9XHJcbiAgICB2YXIgc3VmZml4ID0gcHVic3VmZml4LmdldFB1YmxpY1N1ZmZpeChjZG9tYWluKTtcclxuICAgIGlmIChzdWZmaXggPT0gbnVsbCkgeyAvLyBpdCdzIGEgcHVibGljIHN1ZmZpeFxyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiB0cnVlO1xyXG59O1xyXG5cclxuQ29va2llLnByb3RvdHlwZS5zZXRFeHBpcmVzID0gZnVuY3Rpb24gc2V0RXhwaXJlcyhleHApIHtcclxuICBpZiAoZXhwIGluc3RhbmNlb2YgRGF0ZSkge1xyXG4gICAgdGhpcy5leHBpcmVzID0gZXhwO1xyXG4gIH0gZWxzZSB7XHJcbiAgICB0aGlzLmV4cGlyZXMgPSBwYXJzZURhdGUoZXhwKSB8fCBcIkluZmluaXR5XCI7XHJcbiAgfVxyXG59O1xyXG5cclxuQ29va2llLnByb3RvdHlwZS5zZXRNYXhBZ2UgPSBmdW5jdGlvbiBzZXRNYXhBZ2UoYWdlKSB7XHJcbiAgaWYgKGFnZSA9PT0gSW5maW5pdHkgfHwgYWdlID09PSAtSW5maW5pdHkpIHtcclxuICAgIHRoaXMubWF4QWdlID0gYWdlLnRvU3RyaW5nKCk7IC8vIHNvIEpTT04uc3RyaW5naWZ5KCkgd29ya3NcclxuICB9IGVsc2Uge1xyXG4gICAgdGhpcy5tYXhBZ2UgPSBhZ2U7XHJcbiAgfVxyXG59O1xyXG5cclxuLy8gZ2l2ZXMgQ29va2llIGhlYWRlciBmb3JtYXRcclxuQ29va2llLnByb3RvdHlwZS5jb29raWVTdHJpbmcgPSBmdW5jdGlvbiBjb29raWVTdHJpbmcoKSB7XHJcbiAgdmFyIHZhbCA9IHRoaXMudmFsdWU7XHJcbiAgaWYgKHZhbCA9PSBudWxsKSB7XHJcbiAgICB2YWwgPSAnJztcclxuICB9XHJcbiAgaWYgKHRoaXMua2V5ID09PSAnJykge1xyXG4gICAgcmV0dXJuIHZhbDtcclxuICB9XHJcbiAgcmV0dXJuIHRoaXMua2V5Kyc9Jyt2YWw7XHJcbn07XHJcblxyXG4vLyBnaXZlcyBTZXQtQ29va2llIGhlYWRlciBmb3JtYXRcclxuQ29va2llLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xyXG4gIHZhciBzdHIgPSB0aGlzLmNvb2tpZVN0cmluZygpO1xyXG5cclxuICBpZiAodGhpcy5leHBpcmVzICE9IEluZmluaXR5KSB7XHJcbiAgICBpZiAodGhpcy5leHBpcmVzIGluc3RhbmNlb2YgRGF0ZSkge1xyXG4gICAgICBzdHIgKz0gJzsgRXhwaXJlcz0nK2Zvcm1hdERhdGUodGhpcy5leHBpcmVzKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHN0ciArPSAnOyBFeHBpcmVzPScrdGhpcy5leHBpcmVzO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgaWYgKHRoaXMubWF4QWdlICE9IG51bGwgJiYgdGhpcy5tYXhBZ2UgIT0gSW5maW5pdHkpIHtcclxuICAgIHN0ciArPSAnOyBNYXgtQWdlPScrdGhpcy5tYXhBZ2U7XHJcbiAgfVxyXG5cclxuICBpZiAodGhpcy5kb21haW4gJiYgIXRoaXMuaG9zdE9ubHkpIHtcclxuICAgIHN0ciArPSAnOyBEb21haW49Jyt0aGlzLmRvbWFpbjtcclxuICB9XHJcbiAgaWYgKHRoaXMucGF0aCkge1xyXG4gICAgc3RyICs9ICc7IFBhdGg9Jyt0aGlzLnBhdGg7XHJcbiAgfVxyXG5cclxuICBpZiAodGhpcy5zZWN1cmUpIHtcclxuICAgIHN0ciArPSAnOyBTZWN1cmUnO1xyXG4gIH1cclxuICBpZiAodGhpcy5odHRwT25seSkge1xyXG4gICAgc3RyICs9ICc7IEh0dHBPbmx5JztcclxuICB9XHJcbiAgaWYgKHRoaXMuZXh0ZW5zaW9ucykge1xyXG4gICAgdGhpcy5leHRlbnNpb25zLmZvckVhY2goZnVuY3Rpb24oZXh0KSB7XHJcbiAgICAgIHN0ciArPSAnOyAnK2V4dDtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHN0cjtcclxufTtcclxuXHJcbi8vIFRUTCgpIHBhcnRpYWxseSByZXBsYWNlcyB0aGUgXCJleHBpcnktdGltZVwiIHBhcnRzIG9mIFM1LjMgc3RlcCAzIChzZXRDb29raWUoKVxyXG4vLyBlbHNld2hlcmUpXHJcbi8vIFM1LjMgc2F5cyB0byBnaXZlIHRoZSBcImxhdGVzdCByZXByZXNlbnRhYmxlIGRhdGVcIiBmb3Igd2hpY2ggd2UgdXNlIEluZmluaXR5XHJcbi8vIEZvciBcImV4cGlyZWRcIiB3ZSB1c2UgMFxyXG5Db29raWUucHJvdG90eXBlLlRUTCA9IGZ1bmN0aW9uIFRUTChub3cpIHtcclxuICAvKiBSRkM2MjY1IFM0LjEuMi4yIElmIGEgY29va2llIGhhcyBib3RoIHRoZSBNYXgtQWdlIGFuZCB0aGUgRXhwaXJlc1xyXG4gICAqIGF0dHJpYnV0ZSwgdGhlIE1heC1BZ2UgYXR0cmlidXRlIGhhcyBwcmVjZWRlbmNlIGFuZCBjb250cm9scyB0aGVcclxuICAgKiBleHBpcmF0aW9uIGRhdGUgb2YgdGhlIGNvb2tpZS5cclxuICAgKiAoQ29uY3VycyB3aXRoIFM1LjMgc3RlcCAzKVxyXG4gICAqL1xyXG4gIGlmICh0aGlzLm1heEFnZSAhPSBudWxsKSB7XHJcbiAgICByZXR1cm4gdGhpcy5tYXhBZ2U8PTAgPyAwIDogdGhpcy5tYXhBZ2UqMTAwMDtcclxuICB9XHJcblxyXG4gIHZhciBleHBpcmVzID0gdGhpcy5leHBpcmVzO1xyXG4gIGlmIChleHBpcmVzICE9IEluZmluaXR5KSB7XHJcbiAgICBpZiAoIShleHBpcmVzIGluc3RhbmNlb2YgRGF0ZSkpIHtcclxuICAgICAgZXhwaXJlcyA9IHBhcnNlRGF0ZShleHBpcmVzKSB8fCBJbmZpbml0eTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoZXhwaXJlcyA9PSBJbmZpbml0eSkge1xyXG4gICAgICByZXR1cm4gSW5maW5pdHk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGV4cGlyZXMuZ2V0VGltZSgpIC0gKG5vdyB8fCBEYXRlLm5vdygpKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBJbmZpbml0eTtcclxufTtcclxuXHJcbi8vIGV4cGlyeVRpbWUoKSByZXBsYWNlcyB0aGUgXCJleHBpcnktdGltZVwiIHBhcnRzIG9mIFM1LjMgc3RlcCAzIChzZXRDb29raWUoKVxyXG4vLyBlbHNld2hlcmUpXHJcbkNvb2tpZS5wcm90b3R5cGUuZXhwaXJ5VGltZSA9IGZ1bmN0aW9uIGV4cGlyeVRpbWUobm93KSB7XHJcbiAgaWYgKHRoaXMubWF4QWdlICE9IG51bGwpIHtcclxuICAgIHZhciByZWxhdGl2ZVRvID0gbm93IHx8IHRoaXMuY3JlYXRpb24gfHwgbmV3IERhdGUoKTtcclxuICAgIHZhciBhZ2UgPSAodGhpcy5tYXhBZ2UgPD0gMCkgPyAtSW5maW5pdHkgOiB0aGlzLm1heEFnZSoxMDAwO1xyXG4gICAgcmV0dXJuIHJlbGF0aXZlVG8uZ2V0VGltZSgpICsgYWdlO1xyXG4gIH1cclxuXHJcbiAgaWYgKHRoaXMuZXhwaXJlcyA9PSBJbmZpbml0eSkge1xyXG4gICAgcmV0dXJuIEluZmluaXR5O1xyXG4gIH1cclxuICByZXR1cm4gdGhpcy5leHBpcmVzLmdldFRpbWUoKTtcclxufTtcclxuXHJcbi8vIGV4cGlyeURhdGUoKSByZXBsYWNlcyB0aGUgXCJleHBpcnktdGltZVwiIHBhcnRzIG9mIFM1LjMgc3RlcCAzIChzZXRDb29raWUoKVxyXG4vLyBlbHNld2hlcmUpLCBleGNlcHQgaXQgcmV0dXJucyBhIERhdGVcclxuQ29va2llLnByb3RvdHlwZS5leHBpcnlEYXRlID0gZnVuY3Rpb24gZXhwaXJ5RGF0ZShub3cpIHtcclxuICB2YXIgbWlsbGlzZWMgPSB0aGlzLmV4cGlyeVRpbWUobm93KTtcclxuICBpZiAobWlsbGlzZWMgPT0gSW5maW5pdHkpIHtcclxuICAgIHJldHVybiBuZXcgRGF0ZShNQVhfVElNRSk7XHJcbiAgfSBlbHNlIGlmIChtaWxsaXNlYyA9PSAtSW5maW5pdHkpIHtcclxuICAgIHJldHVybiBuZXcgRGF0ZShNSU5fVElNRSk7XHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiBuZXcgRGF0ZShtaWxsaXNlYyk7XHJcbiAgfVxyXG59O1xyXG5cclxuLy8gVGhpcyByZXBsYWNlcyB0aGUgXCJwZXJzaXN0ZW50LWZsYWdcIiBwYXJ0cyBvZiBTNS4zIHN0ZXAgM1xyXG5Db29raWUucHJvdG90eXBlLmlzUGVyc2lzdGVudCA9IGZ1bmN0aW9uIGlzUGVyc2lzdGVudCgpIHtcclxuICByZXR1cm4gKHRoaXMubWF4QWdlICE9IG51bGwgfHwgdGhpcy5leHBpcmVzICE9IEluZmluaXR5KTtcclxufTtcclxuXHJcbi8vIE1vc3RseSBTNS4xLjIgYW5kIFM1LjIuMzpcclxuQ29va2llLnByb3RvdHlwZS5jZG9tYWluID1cclxuQ29va2llLnByb3RvdHlwZS5jYW5vbmljYWxpemVkRG9tYWluID0gZnVuY3Rpb24gY2Fub25pY2FsaXplZERvbWFpbigpIHtcclxuICBpZiAodGhpcy5kb21haW4gPT0gbnVsbCkge1xyXG4gICAgcmV0dXJuIG51bGw7XHJcbiAgfVxyXG4gIHJldHVybiBjYW5vbmljYWxEb21haW4odGhpcy5kb21haW4pO1xyXG59O1xyXG5cclxuZnVuY3Rpb24gQ29va2llSmFyKHN0b3JlLCBvcHRpb25zKSB7XHJcbiAgaWYgKHR5cGVvZiBvcHRpb25zID09PSBcImJvb2xlYW5cIikge1xyXG4gICAgb3B0aW9ucyA9IHtyZWplY3RQdWJsaWNTdWZmaXhlczogb3B0aW9uc307XHJcbiAgfSBlbHNlIGlmIChvcHRpb25zID09IG51bGwpIHtcclxuICAgIG9wdGlvbnMgPSB7fTtcclxuICB9XHJcbiAgaWYgKG9wdGlvbnMucmVqZWN0UHVibGljU3VmZml4ZXMgIT0gbnVsbCkge1xyXG4gICAgdGhpcy5yZWplY3RQdWJsaWNTdWZmaXhlcyA9IG9wdGlvbnMucmVqZWN0UHVibGljU3VmZml4ZXM7XHJcbiAgfVxyXG4gIGlmIChvcHRpb25zLmxvb3NlTW9kZSAhPSBudWxsKSB7XHJcbiAgICB0aGlzLmVuYWJsZUxvb3NlTW9kZSA9IG9wdGlvbnMubG9vc2VNb2RlO1xyXG4gIH1cclxuXHJcbiAgaWYgKCFzdG9yZSkge1xyXG4gICAgc3RvcmUgPSBuZXcgTWVtb3J5Q29va2llU3RvcmUoKTtcclxuICB9XHJcbiAgdGhpcy5zdG9yZSA9IHN0b3JlO1xyXG59XHJcbkNvb2tpZUphci5wcm90b3R5cGUuc3RvcmUgPSBudWxsO1xyXG5Db29raWVKYXIucHJvdG90eXBlLnJlamVjdFB1YmxpY1N1ZmZpeGVzID0gdHJ1ZTtcclxuQ29va2llSmFyLnByb3RvdHlwZS5lbmFibGVMb29zZU1vZGUgPSBmYWxzZTtcclxudmFyIENBTl9CRV9TWU5DID0gW107XHJcblxyXG5DQU5fQkVfU1lOQy5wdXNoKCdzZXRDb29raWUnKTtcclxuQ29va2llSmFyLnByb3RvdHlwZS5zZXRDb29raWUgPSBmdW5jdGlvbihjb29raWUsIHVybCwgb3B0aW9ucywgY2IpIHtcclxuICB2YXIgZXJyO1xyXG4gIHZhciBjb250ZXh0ID0gZ2V0Q29va2llQ29udGV4dCh1cmwpO1xyXG4gIGlmIChvcHRpb25zIGluc3RhbmNlb2YgRnVuY3Rpb24pIHtcclxuICAgIGNiID0gb3B0aW9ucztcclxuICAgIG9wdGlvbnMgPSB7fTtcclxuICB9XHJcblxyXG4gIHZhciBob3N0ID0gY2Fub25pY2FsRG9tYWluKGNvbnRleHQuaG9zdG5hbWUpO1xyXG4gIHZhciBsb29zZSA9IHRoaXMuZW5hYmxlTG9vc2VNb2RlO1xyXG4gIGlmIChvcHRpb25zLmxvb3NlICE9IG51bGwpIHtcclxuICAgIGxvb3NlID0gb3B0aW9ucy5sb29zZTtcclxuICB9XHJcblxyXG4gIC8vIFM1LjMgc3RlcCAxXHJcbiAgaWYgKCEoY29va2llIGluc3RhbmNlb2YgQ29va2llKSkge1xyXG4gICAgY29va2llID0gQ29va2llLnBhcnNlKGNvb2tpZSwgeyBsb29zZTogbG9vc2UgfSk7XHJcbiAgfVxyXG4gIGlmICghY29va2llKSB7XHJcbiAgICBlcnIgPSBuZXcgRXJyb3IoXCJDb29raWUgZmFpbGVkIHRvIHBhcnNlXCIpO1xyXG4gICAgcmV0dXJuIGNiKG9wdGlvbnMuaWdub3JlRXJyb3IgPyBudWxsIDogZXJyKTtcclxuICB9XHJcblxyXG4gIC8vIFM1LjMgc3RlcCAyXHJcbiAgdmFyIG5vdyA9IG9wdGlvbnMubm93IHx8IG5ldyBEYXRlKCk7IC8vIHdpbGwgYXNzaWduIGxhdGVyIHRvIHNhdmUgZWZmb3J0IGluIHRoZSBmYWNlIG9mIGVycm9yc1xyXG5cclxuICAvLyBTNS4zIHN0ZXAgMzogTk9PUDsgcGVyc2lzdGVudC1mbGFnIGFuZCBleHBpcnktdGltZSBpcyBoYW5kbGVkIGJ5IGdldENvb2tpZSgpXHJcblxyXG4gIC8vIFM1LjMgc3RlcCA0OiBOT09QOyBkb21haW4gaXMgbnVsbCBieSBkZWZhdWx0XHJcblxyXG4gIC8vIFM1LjMgc3RlcCA1OiBwdWJsaWMgc3VmZml4ZXNcclxuICBpZiAodGhpcy5yZWplY3RQdWJsaWNTdWZmaXhlcyAmJiBjb29raWUuZG9tYWluKSB7XHJcbiAgICB2YXIgc3VmZml4ID0gcHVic3VmZml4LmdldFB1YmxpY1N1ZmZpeChjb29raWUuY2RvbWFpbigpKTtcclxuICAgIGlmIChzdWZmaXggPT0gbnVsbCkgeyAvLyBlLmcuIFwiY29tXCJcclxuICAgICAgZXJyID0gbmV3IEVycm9yKFwiQ29va2llIGhhcyBkb21haW4gc2V0IHRvIGEgcHVibGljIHN1ZmZpeFwiKTtcclxuICAgICAgcmV0dXJuIGNiKG9wdGlvbnMuaWdub3JlRXJyb3IgPyBudWxsIDogZXJyKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIFM1LjMgc3RlcCA2OlxyXG4gIGlmIChjb29raWUuZG9tYWluKSB7XHJcbiAgICBpZiAoIWRvbWFpbk1hdGNoKGhvc3QsIGNvb2tpZS5jZG9tYWluKCksIGZhbHNlKSkge1xyXG4gICAgICBlcnIgPSBuZXcgRXJyb3IoXCJDb29raWUgbm90IGluIHRoaXMgaG9zdCdzIGRvbWFpbi4gQ29va2llOlwiK2Nvb2tpZS5jZG9tYWluKCkrXCIgUmVxdWVzdDpcIitob3N0KTtcclxuICAgICAgcmV0dXJuIGNiKG9wdGlvbnMuaWdub3JlRXJyb3IgPyBudWxsIDogZXJyKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoY29va2llLmhvc3RPbmx5ID09IG51bGwpIHsgLy8gZG9uJ3QgcmVzZXQgaWYgYWxyZWFkeSBzZXRcclxuICAgICAgY29va2llLmhvc3RPbmx5ID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gIH0gZWxzZSB7XHJcbiAgICBjb29raWUuaG9zdE9ubHkgPSB0cnVlO1xyXG4gICAgY29va2llLmRvbWFpbiA9IGhvc3Q7XHJcbiAgfVxyXG5cclxuICAvL1M1LjIuNCBJZiB0aGUgYXR0cmlidXRlLXZhbHVlIGlzIGVtcHR5IG9yIGlmIHRoZSBmaXJzdCBjaGFyYWN0ZXIgb2YgdGhlXHJcbiAgLy9hdHRyaWJ1dGUtdmFsdWUgaXMgbm90ICV4MkYgKFwiL1wiKTpcclxuICAvL0xldCBjb29raWUtcGF0aCBiZSB0aGUgZGVmYXVsdC1wYXRoLlxyXG4gIGlmICghY29va2llLnBhdGggfHwgY29va2llLnBhdGhbMF0gIT09ICcvJykge1xyXG4gICAgY29va2llLnBhdGggPSBkZWZhdWx0UGF0aChjb250ZXh0LnBhdGhuYW1lKTtcclxuICAgIGNvb2tpZS5wYXRoSXNEZWZhdWx0ID0gdHJ1ZTtcclxuICB9XHJcblxyXG4gIC8vIFM1LjMgc3RlcCA4OiBOT09QOyBzZWN1cmUgYXR0cmlidXRlXHJcbiAgLy8gUzUuMyBzdGVwIDk6IE5PT1A7IGh0dHBPbmx5IGF0dHJpYnV0ZVxyXG5cclxuICAvLyBTNS4zIHN0ZXAgMTBcclxuICBpZiAob3B0aW9ucy5odHRwID09PSBmYWxzZSAmJiBjb29raWUuaHR0cE9ubHkpIHtcclxuICAgIGVyciA9IG5ldyBFcnJvcihcIkNvb2tpZSBpcyBIdHRwT25seSBhbmQgdGhpcyBpc24ndCBhbiBIVFRQIEFQSVwiKTtcclxuICAgIHJldHVybiBjYihvcHRpb25zLmlnbm9yZUVycm9yID8gbnVsbCA6IGVycik7XHJcbiAgfVxyXG5cclxuICB2YXIgc3RvcmUgPSB0aGlzLnN0b3JlO1xyXG5cclxuICBpZiAoIXN0b3JlLnVwZGF0ZUNvb2tpZSkge1xyXG4gICAgc3RvcmUudXBkYXRlQ29va2llID0gZnVuY3Rpb24ob2xkQ29va2llLCBuZXdDb29raWUsIGNiKSB7XHJcbiAgICAgIHRoaXMucHV0Q29va2llKG5ld0Nvb2tpZSwgY2IpO1xyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHdpdGhDb29raWUoZXJyLCBvbGRDb29raWUpIHtcclxuICAgIGlmIChlcnIpIHtcclxuICAgICAgcmV0dXJuIGNiKGVycik7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIG5leHQgPSBmdW5jdGlvbihlcnIpIHtcclxuICAgICAgaWYgKGVycikge1xyXG4gICAgICAgIHJldHVybiBjYihlcnIpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNiKG51bGwsIGNvb2tpZSk7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgaWYgKG9sZENvb2tpZSkge1xyXG4gICAgICAvLyBTNS4zIHN0ZXAgMTEgLSBcIklmIHRoZSBjb29raWUgc3RvcmUgY29udGFpbnMgYSBjb29raWUgd2l0aCB0aGUgc2FtZSBuYW1lLFxyXG4gICAgICAvLyBkb21haW4sIGFuZCBwYXRoIGFzIHRoZSBuZXdseSBjcmVhdGVkIGNvb2tpZTpcIlxyXG4gICAgICBpZiAob3B0aW9ucy5odHRwID09PSBmYWxzZSAmJiBvbGRDb29raWUuaHR0cE9ubHkpIHsgLy8gc3RlcCAxMS4yXHJcbiAgICAgICAgZXJyID0gbmV3IEVycm9yKFwib2xkIENvb2tpZSBpcyBIdHRwT25seSBhbmQgdGhpcyBpc24ndCBhbiBIVFRQIEFQSVwiKTtcclxuICAgICAgICByZXR1cm4gY2Iob3B0aW9ucy5pZ25vcmVFcnJvciA/IG51bGwgOiBlcnIpO1xyXG4gICAgICB9XHJcbiAgICAgIGNvb2tpZS5jcmVhdGlvbiA9IG9sZENvb2tpZS5jcmVhdGlvbjsgLy8gc3RlcCAxMS4zXHJcbiAgICAgIGNvb2tpZS5jcmVhdGlvbkluZGV4ID0gb2xkQ29va2llLmNyZWF0aW9uSW5kZXg7IC8vIHByZXNlcnZlIHRpZS1icmVha2VyXHJcbiAgICAgIGNvb2tpZS5sYXN0QWNjZXNzZWQgPSBub3c7XHJcbiAgICAgIC8vIFN0ZXAgMTEuNCAoZGVsZXRlIGNvb2tpZSkgaXMgaW1wbGllZCBieSBqdXN0IHNldHRpbmcgdGhlIG5ldyBvbmU6XHJcbiAgICAgIHN0b3JlLnVwZGF0ZUNvb2tpZShvbGRDb29raWUsIGNvb2tpZSwgbmV4dCk7IC8vIHN0ZXAgMTJcclxuXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjb29raWUuY3JlYXRpb24gPSBjb29raWUubGFzdEFjY2Vzc2VkID0gbm93O1xyXG4gICAgICBzdG9yZS5wdXRDb29raWUoY29va2llLCBuZXh0KTsgLy8gc3RlcCAxMlxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgc3RvcmUuZmluZENvb2tpZShjb29raWUuZG9tYWluLCBjb29raWUucGF0aCwgY29va2llLmtleSwgd2l0aENvb2tpZSk7XHJcbn07XHJcblxyXG4vLyBSRkM2MzY1IFM1LjRcclxuQ0FOX0JFX1NZTkMucHVzaCgnZ2V0Q29va2llcycpO1xyXG5Db29raWVKYXIucHJvdG90eXBlLmdldENvb2tpZXMgPSBmdW5jdGlvbih1cmwsIG9wdGlvbnMsIGNiKSB7XHJcbiAgdmFyIGNvbnRleHQgPSBnZXRDb29raWVDb250ZXh0KHVybCk7XHJcbiAgaWYgKG9wdGlvbnMgaW5zdGFuY2VvZiBGdW5jdGlvbikge1xyXG4gICAgY2IgPSBvcHRpb25zO1xyXG4gICAgb3B0aW9ucyA9IHt9O1xyXG4gIH1cclxuXHJcbiAgdmFyIGhvc3QgPSBjYW5vbmljYWxEb21haW4oY29udGV4dC5ob3N0bmFtZSk7XHJcbiAgdmFyIHBhdGggPSBjb250ZXh0LnBhdGhuYW1lIHx8ICcvJztcclxuXHJcbiAgdmFyIHNlY3VyZSA9IG9wdGlvbnMuc2VjdXJlO1xyXG4gIGlmIChzZWN1cmUgPT0gbnVsbCAmJiBjb250ZXh0LnByb3RvY29sICYmXHJcbiAgICAgIChjb250ZXh0LnByb3RvY29sID09ICdodHRwczonIHx8IGNvbnRleHQucHJvdG9jb2wgPT0gJ3dzczonKSlcclxuICB7XHJcbiAgICBzZWN1cmUgPSB0cnVlO1xyXG4gIH1cclxuXHJcbiAgdmFyIGh0dHAgPSBvcHRpb25zLmh0dHA7XHJcbiAgaWYgKGh0dHAgPT0gbnVsbCkge1xyXG4gICAgaHR0cCA9IHRydWU7XHJcbiAgfVxyXG5cclxuICB2YXIgbm93ID0gb3B0aW9ucy5ub3cgfHwgRGF0ZS5ub3coKTtcclxuICB2YXIgZXhwaXJlQ2hlY2sgPSBvcHRpb25zLmV4cGlyZSAhPT0gZmFsc2U7XHJcbiAgdmFyIGFsbFBhdGhzID0gISFvcHRpb25zLmFsbFBhdGhzO1xyXG4gIHZhciBzdG9yZSA9IHRoaXMuc3RvcmU7XHJcblxyXG4gIGZ1bmN0aW9uIG1hdGNoaW5nQ29va2llKGMpIHtcclxuICAgIC8vIFwiRWl0aGVyOlxyXG4gICAgLy8gICBUaGUgY29va2llJ3MgaG9zdC1vbmx5LWZsYWcgaXMgdHJ1ZSBhbmQgdGhlIGNhbm9uaWNhbGl6ZWRcclxuICAgIC8vICAgcmVxdWVzdC1ob3N0IGlzIGlkZW50aWNhbCB0byB0aGUgY29va2llJ3MgZG9tYWluLlxyXG4gICAgLy8gT3I6XHJcbiAgICAvLyAgIFRoZSBjb29raWUncyBob3N0LW9ubHktZmxhZyBpcyBmYWxzZSBhbmQgdGhlIGNhbm9uaWNhbGl6ZWRcclxuICAgIC8vICAgcmVxdWVzdC1ob3N0IGRvbWFpbi1tYXRjaGVzIHRoZSBjb29raWUncyBkb21haW4uXCJcclxuICAgIGlmIChjLmhvc3RPbmx5KSB7XHJcbiAgICAgIGlmIChjLmRvbWFpbiAhPSBob3N0KSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpZiAoIWRvbWFpbk1hdGNoKGhvc3QsIGMuZG9tYWluLCBmYWxzZSkpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBcIlRoZSByZXF1ZXN0LXVyaSdzIHBhdGggcGF0aC1tYXRjaGVzIHRoZSBjb29raWUncyBwYXRoLlwiXHJcbiAgICBpZiAoIWFsbFBhdGhzICYmICFwYXRoTWF0Y2gocGF0aCwgYy5wYXRoKSkge1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gXCJJZiB0aGUgY29va2llJ3Mgc2VjdXJlLW9ubHktZmxhZyBpcyB0cnVlLCB0aGVuIHRoZSByZXF1ZXN0LXVyaSdzXHJcbiAgICAvLyBzY2hlbWUgbXVzdCBkZW5vdGUgYSBcInNlY3VyZVwiIHByb3RvY29sXCJcclxuICAgIGlmIChjLnNlY3VyZSAmJiAhc2VjdXJlKSB7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBcIklmIHRoZSBjb29raWUncyBodHRwLW9ubHktZmxhZyBpcyB0cnVlLCB0aGVuIGV4Y2x1ZGUgdGhlIGNvb2tpZSBpZiB0aGVcclxuICAgIC8vIGNvb2tpZS1zdHJpbmcgaXMgYmVpbmcgZ2VuZXJhdGVkIGZvciBhIFwibm9uLUhUVFBcIiBBUElcIlxyXG4gICAgaWYgKGMuaHR0cE9ubHkgJiYgIWh0dHApIHtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGRlZmVycmVkIGZyb20gUzUuM1xyXG4gICAgLy8gbm9uLVJGQzogYWxsb3cgcmV0ZW50aW9uIG9mIGV4cGlyZWQgY29va2llcyBieSBjaG9pY2VcclxuICAgIGlmIChleHBpcmVDaGVjayAmJiBjLmV4cGlyeVRpbWUoKSA8PSBub3cpIHtcclxuICAgICAgc3RvcmUucmVtb3ZlQ29va2llKGMuZG9tYWluLCBjLnBhdGgsIGMua2V5LCBmdW5jdGlvbigpe30pOyAvLyByZXN1bHQgaWdub3JlZFxyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG5cclxuICBzdG9yZS5maW5kQ29va2llcyhob3N0LCBhbGxQYXRocyA/IG51bGwgOiBwYXRoLCBmdW5jdGlvbihlcnIsY29va2llcykge1xyXG4gICAgaWYgKGVycikge1xyXG4gICAgICByZXR1cm4gY2IoZXJyKTtcclxuICAgIH1cclxuXHJcbiAgICBjb29raWVzID0gY29va2llcy5maWx0ZXIobWF0Y2hpbmdDb29raWUpO1xyXG5cclxuICAgIC8vIHNvcnRpbmcgb2YgUzUuNCBwYXJ0IDJcclxuICAgIGlmIChvcHRpb25zLnNvcnQgIT09IGZhbHNlKSB7XHJcbiAgICAgIGNvb2tpZXMgPSBjb29raWVzLnNvcnQoY29va2llQ29tcGFyZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gUzUuNCBwYXJ0IDNcclxuICAgIHZhciBub3cgPSBuZXcgRGF0ZSgpO1xyXG4gICAgY29va2llcy5mb3JFYWNoKGZ1bmN0aW9uKGMpIHtcclxuICAgICAgYy5sYXN0QWNjZXNzZWQgPSBub3c7XHJcbiAgICB9KTtcclxuICAgIC8vIFRPRE8gcGVyc2lzdCBsYXN0QWNjZXNzZWRcclxuXHJcbiAgICBjYihudWxsLGNvb2tpZXMpO1xyXG4gIH0pO1xyXG59O1xyXG5cclxuQ0FOX0JFX1NZTkMucHVzaCgnZ2V0Q29va2llU3RyaW5nJyk7XHJcbkNvb2tpZUphci5wcm90b3R5cGUuZ2V0Q29va2llU3RyaW5nID0gZnVuY3Rpb24oLyouLi4sIGNiKi8pIHtcclxuICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywwKTtcclxuICB2YXIgY2IgPSBhcmdzLnBvcCgpO1xyXG4gIHZhciBuZXh0ID0gZnVuY3Rpb24oZXJyLGNvb2tpZXMpIHtcclxuICAgIGlmIChlcnIpIHtcclxuICAgICAgY2IoZXJyKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNiKG51bGwsIGNvb2tpZXNcclxuICAgICAgICAuc29ydChjb29raWVDb21wYXJlKVxyXG4gICAgICAgIC5tYXAoZnVuY3Rpb24oYyl7XHJcbiAgICAgICAgICByZXR1cm4gYy5jb29raWVTdHJpbmcoKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5qb2luKCc7ICcpKTtcclxuICAgIH1cclxuICB9O1xyXG4gIGFyZ3MucHVzaChuZXh0KTtcclxuICB0aGlzLmdldENvb2tpZXMuYXBwbHkodGhpcyxhcmdzKTtcclxufTtcclxuXHJcbkNBTl9CRV9TWU5DLnB1c2goJ2dldFNldENvb2tpZVN0cmluZ3MnKTtcclxuQ29va2llSmFyLnByb3RvdHlwZS5nZXRTZXRDb29raWVTdHJpbmdzID0gZnVuY3Rpb24oLyouLi4sIGNiKi8pIHtcclxuICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywwKTtcclxuICB2YXIgY2IgPSBhcmdzLnBvcCgpO1xyXG4gIHZhciBuZXh0ID0gZnVuY3Rpb24oZXJyLGNvb2tpZXMpIHtcclxuICAgIGlmIChlcnIpIHtcclxuICAgICAgY2IoZXJyKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNiKG51bGwsIGNvb2tpZXMubWFwKGZ1bmN0aW9uKGMpe1xyXG4gICAgICAgIHJldHVybiBjLnRvU3RyaW5nKCk7XHJcbiAgICAgIH0pKTtcclxuICAgIH1cclxuICB9O1xyXG4gIGFyZ3MucHVzaChuZXh0KTtcclxuICB0aGlzLmdldENvb2tpZXMuYXBwbHkodGhpcyxhcmdzKTtcclxufTtcclxuXHJcbkNBTl9CRV9TWU5DLnB1c2goJ3NlcmlhbGl6ZScpO1xyXG5Db29raWVKYXIucHJvdG90eXBlLnNlcmlhbGl6ZSA9IGZ1bmN0aW9uKGNiKSB7XHJcbiAgdmFyIHR5cGUgPSB0aGlzLnN0b3JlLmNvbnN0cnVjdG9yLm5hbWU7XHJcbiAgaWYgKHR5cGUgPT09ICdPYmplY3QnKSB7XHJcbiAgICB0eXBlID0gbnVsbDtcclxuICB9XHJcblxyXG4gIC8vIHVwZGF0ZSBSRUFETUUubWQgXCJTZXJpYWxpemF0aW9uIEZvcm1hdFwiIGlmIHlvdSBjaGFuZ2UgdGhpcywgcGxlYXNlIVxyXG4gIHZhciBzZXJpYWxpemVkID0ge1xyXG4gICAgLy8gVGhlIHZlcnNpb24gb2YgdG91Z2gtY29va2llIHRoYXQgc2VyaWFsaXplZCB0aGlzIGphci4gR2VuZXJhbGx5IGEgZ29vZFxyXG4gICAgLy8gcHJhY3RpY2Ugc2luY2UgZnV0dXJlIHZlcnNpb25zIGNhbiBtYWtlIGRhdGEgaW1wb3J0IGRlY2lzaW9ucyBiYXNlZCBvblxyXG4gICAgLy8ga25vd24gcGFzdCBiZWhhdmlvci4gV2hlbi9pZiB0aGlzIG1hdHRlcnMsIHVzZSBgc2VtdmVyYC5cclxuICAgIHZlcnNpb246ICd0b3VnaC1jb29raWVAJytWRVJTSU9OLFxyXG5cclxuICAgIC8vIGFkZCB0aGUgc3RvcmUgdHlwZSwgdG8gbWFrZSBodW1hbnMgaGFwcHk6XHJcbiAgICBzdG9yZVR5cGU6IHR5cGUsXHJcblxyXG4gICAgLy8gQ29va2llSmFyIGNvbmZpZ3VyYXRpb246XHJcbiAgICByZWplY3RQdWJsaWNTdWZmaXhlczogISF0aGlzLnJlamVjdFB1YmxpY1N1ZmZpeGVzLFxyXG5cclxuICAgIC8vIHRoaXMgZ2V0cyBmaWxsZWQgZnJvbSBnZXRBbGxDb29raWVzOlxyXG4gICAgY29va2llczogW11cclxuICB9O1xyXG5cclxuICBpZiAoISh0aGlzLnN0b3JlLmdldEFsbENvb2tpZXMgJiZcclxuICAgICAgICB0eXBlb2YgdGhpcy5zdG9yZS5nZXRBbGxDb29raWVzID09PSAnZnVuY3Rpb24nKSlcclxuICB7XHJcbiAgICByZXR1cm4gY2IobmV3IEVycm9yKCdzdG9yZSBkb2VzIG5vdCBzdXBwb3J0IGdldEFsbENvb2tpZXMgYW5kIGNhbm5vdCBiZSBzZXJpYWxpemVkJykpO1xyXG4gIH1cclxuXHJcbiAgdGhpcy5zdG9yZS5nZXRBbGxDb29raWVzKGZ1bmN0aW9uKGVycixjb29raWVzKSB7XHJcbiAgICBpZiAoZXJyKSB7XHJcbiAgICAgIHJldHVybiBjYihlcnIpO1xyXG4gICAgfVxyXG5cclxuICAgIHNlcmlhbGl6ZWQuY29va2llcyA9IGNvb2tpZXMubWFwKGZ1bmN0aW9uKGNvb2tpZSkge1xyXG4gICAgICAvLyBjb252ZXJ0IHRvIHNlcmlhbGl6ZWQgJ3JhdycgY29va2llc1xyXG4gICAgICBjb29raWUgPSAoY29va2llIGluc3RhbmNlb2YgQ29va2llKSA/IGNvb2tpZS50b0pTT04oKSA6IGNvb2tpZTtcclxuXHJcbiAgICAgIC8vIFJlbW92ZSB0aGUgaW5kZXggc28gbmV3IG9uZXMgZ2V0IGFzc2lnbmVkIGR1cmluZyBkZXNlcmlhbGl6YXRpb25cclxuICAgICAgZGVsZXRlIGNvb2tpZS5jcmVhdGlvbkluZGV4O1xyXG5cclxuICAgICAgcmV0dXJuIGNvb2tpZTtcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiBjYihudWxsLCBzZXJpYWxpemVkKTtcclxuICB9KTtcclxufTtcclxuXHJcbi8vIHdlbGwta25vd24gbmFtZSB0aGF0IEpTT04uc3RyaW5naWZ5IGNhbGxzXHJcbkNvb2tpZUphci5wcm90b3R5cGUudG9KU09OID0gZnVuY3Rpb24oKSB7XHJcbiAgcmV0dXJuIHRoaXMuc2VyaWFsaXplU3luYygpO1xyXG59O1xyXG5cclxuLy8gdXNlIHRoZSBjbGFzcyBtZXRob2QgQ29va2llSmFyLmRlc2VyaWFsaXplIGluc3RlYWQgb2YgY2FsbGluZyB0aGlzIGRpcmVjdGx5XHJcbkNBTl9CRV9TWU5DLnB1c2goJ19pbXBvcnRDb29raWVzJyk7XHJcbkNvb2tpZUphci5wcm90b3R5cGUuX2ltcG9ydENvb2tpZXMgPSBmdW5jdGlvbihzZXJpYWxpemVkLCBjYikge1xyXG4gIHZhciBqYXIgPSB0aGlzO1xyXG4gIHZhciBjb29raWVzID0gc2VyaWFsaXplZC5jb29raWVzO1xyXG4gIGlmICghY29va2llcyB8fCAhQXJyYXkuaXNBcnJheShjb29raWVzKSkge1xyXG4gICAgcmV0dXJuIGNiKG5ldyBFcnJvcignc2VyaWFsaXplZCBqYXIgaGFzIG5vIGNvb2tpZXMgYXJyYXknKSk7XHJcbiAgfVxyXG4gIGNvb2tpZXMgPSBjb29raWVzLnNsaWNlKCk7IC8vIGRvIG5vdCBtb2RpZnkgdGhlIG9yaWdpbmFsXHJcblxyXG4gIGZ1bmN0aW9uIHB1dE5leHQoZXJyKSB7XHJcbiAgICBpZiAoZXJyKSB7XHJcbiAgICAgIHJldHVybiBjYihlcnIpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICghY29va2llcy5sZW5ndGgpIHtcclxuICAgICAgcmV0dXJuIGNiKGVyciwgamFyKTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgY29va2llO1xyXG4gICAgdHJ5IHtcclxuICAgICAgY29va2llID0gZnJvbUpTT04oY29va2llcy5zaGlmdCgpKTtcclxuICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgcmV0dXJuIGNiKGUpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChjb29raWUgPT09IG51bGwpIHtcclxuICAgICAgcmV0dXJuIHB1dE5leHQobnVsbCk7IC8vIHNraXAgdGhpcyBjb29raWVcclxuICAgIH1cclxuXHJcbiAgICBqYXIuc3RvcmUucHV0Q29va2llKGNvb2tpZSwgcHV0TmV4dCk7XHJcbiAgfVxyXG5cclxuICBwdXROZXh0KCk7XHJcbn07XHJcblxyXG5Db29raWVKYXIuZGVzZXJpYWxpemUgPSBmdW5jdGlvbihzdHJPck9iaiwgc3RvcmUsIGNiKSB7XHJcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggIT09IDMpIHtcclxuICAgIC8vIHN0b3JlIGlzIG9wdGlvbmFsXHJcbiAgICBjYiA9IHN0b3JlO1xyXG4gICAgc3RvcmUgPSBudWxsO1xyXG4gIH1cclxuXHJcbiAgdmFyIHNlcmlhbGl6ZWQ7XHJcbiAgaWYgKHR5cGVvZiBzdHJPck9iaiA9PT0gJ3N0cmluZycpIHtcclxuICAgIHNlcmlhbGl6ZWQgPSBqc29uUGFyc2Uoc3RyT3JPYmopO1xyXG4gICAgaWYgKHNlcmlhbGl6ZWQgaW5zdGFuY2VvZiBFcnJvcikge1xyXG4gICAgICByZXR1cm4gY2Ioc2VyaWFsaXplZCk7XHJcbiAgICB9XHJcbiAgfSBlbHNlIHtcclxuICAgIHNlcmlhbGl6ZWQgPSBzdHJPck9iajtcclxuICB9XHJcblxyXG4gIHZhciBqYXIgPSBuZXcgQ29va2llSmFyKHN0b3JlLCBzZXJpYWxpemVkLnJlamVjdFB1YmxpY1N1ZmZpeGVzKTtcclxuICBqYXIuX2ltcG9ydENvb2tpZXMoc2VyaWFsaXplZCwgZnVuY3Rpb24oZXJyKSB7XHJcbiAgICBpZiAoZXJyKSB7XHJcbiAgICAgIHJldHVybiBjYihlcnIpO1xyXG4gICAgfVxyXG4gICAgY2IobnVsbCwgamFyKTtcclxuICB9KTtcclxufTtcclxuXHJcbkNvb2tpZUphci5kZXNlcmlhbGl6ZVN5bmMgPSBmdW5jdGlvbihzdHJPck9iaiwgc3RvcmUpIHtcclxuICB2YXIgc2VyaWFsaXplZCA9IHR5cGVvZiBzdHJPck9iaiA9PT0gJ3N0cmluZycgP1xyXG4gICAgSlNPTi5wYXJzZShzdHJPck9iaikgOiBzdHJPck9iajtcclxuICB2YXIgamFyID0gbmV3IENvb2tpZUphcihzdG9yZSwgc2VyaWFsaXplZC5yZWplY3RQdWJsaWNTdWZmaXhlcyk7XHJcblxyXG4gIC8vIGNhdGNoIHRoaXMgbWlzdGFrZSBlYXJseTpcclxuICBpZiAoIWphci5zdG9yZS5zeW5jaHJvbm91cykge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCdDb29raWVKYXIgc3RvcmUgaXMgbm90IHN5bmNocm9ub3VzOyB1c2UgYXN5bmMgQVBJIGluc3RlYWQuJyk7XHJcbiAgfVxyXG5cclxuICBqYXIuX2ltcG9ydENvb2tpZXNTeW5jKHNlcmlhbGl6ZWQpO1xyXG4gIHJldHVybiBqYXI7XHJcbn07XHJcbkNvb2tpZUphci5mcm9tSlNPTiA9IENvb2tpZUphci5kZXNlcmlhbGl6ZVN5bmM7XHJcblxyXG5DQU5fQkVfU1lOQy5wdXNoKCdjbG9uZScpO1xyXG5Db29raWVKYXIucHJvdG90eXBlLmNsb25lID0gZnVuY3Rpb24obmV3U3RvcmUsIGNiKSB7XHJcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcclxuICAgIGNiID0gbmV3U3RvcmU7XHJcbiAgICBuZXdTdG9yZSA9IG51bGw7XHJcbiAgfVxyXG5cclxuICB0aGlzLnNlcmlhbGl6ZShmdW5jdGlvbihlcnIsc2VyaWFsaXplZCkge1xyXG4gICAgaWYgKGVycikge1xyXG4gICAgICByZXR1cm4gY2IoZXJyKTtcclxuICAgIH1cclxuICAgIENvb2tpZUphci5kZXNlcmlhbGl6ZShuZXdTdG9yZSwgc2VyaWFsaXplZCwgY2IpO1xyXG4gIH0pO1xyXG59O1xyXG5cclxuLy8gVXNlIGEgY2xvc3VyZSB0byBwcm92aWRlIGEgdHJ1ZSBpbXBlcmF0aXZlIEFQSSBmb3Igc3luY2hyb25vdXMgc3RvcmVzLlxyXG5mdW5jdGlvbiBzeW5jV3JhcChtZXRob2QpIHtcclxuICByZXR1cm4gZnVuY3Rpb24oKSB7XHJcbiAgICBpZiAoIXRoaXMuc3RvcmUuc3luY2hyb25vdXMpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDb29raWVKYXIgc3RvcmUgaXMgbm90IHN5bmNocm9ub3VzOyB1c2UgYXN5bmMgQVBJIGluc3RlYWQuJyk7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xyXG4gICAgdmFyIHN5bmNFcnIsIHN5bmNSZXN1bHQ7XHJcbiAgICBhcmdzLnB1c2goZnVuY3Rpb24gc3luY0NiKGVyciwgcmVzdWx0KSB7XHJcbiAgICAgIHN5bmNFcnIgPSBlcnI7XHJcbiAgICAgIHN5bmNSZXN1bHQgPSByZXN1bHQ7XHJcbiAgICB9KTtcclxuICAgIHRoaXNbbWV0aG9kXS5hcHBseSh0aGlzLCBhcmdzKTtcclxuXHJcbiAgICBpZiAoc3luY0Vycikge1xyXG4gICAgICB0aHJvdyBzeW5jRXJyO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHN5bmNSZXN1bHQ7XHJcbiAgfTtcclxufVxyXG5cclxuLy8gd3JhcCBhbGwgZGVjbGFyZWQgQ0FOX0JFX1NZTkMgbWV0aG9kcyBpbiB0aGUgc3luYyB3cmFwcGVyXHJcbkNBTl9CRV9TWU5DLmZvckVhY2goZnVuY3Rpb24obWV0aG9kKSB7XHJcbiAgQ29va2llSmFyLnByb3RvdHlwZVttZXRob2QrJ1N5bmMnXSA9IHN5bmNXcmFwKG1ldGhvZCk7XHJcbn0pO1xyXG5cclxuZXhwb3J0cy5Db29raWVKYXIgPSBDb29raWVKYXI7XHJcbmV4cG9ydHMuQ29va2llID0gQ29va2llO1xyXG5leHBvcnRzLlN0b3JlID0gU3RvcmU7XHJcbmV4cG9ydHMuTWVtb3J5Q29va2llU3RvcmUgPSBNZW1vcnlDb29raWVTdG9yZTtcclxuZXhwb3J0cy5wYXJzZURhdGUgPSBwYXJzZURhdGU7XHJcbmV4cG9ydHMuZm9ybWF0RGF0ZSA9IGZvcm1hdERhdGU7XHJcbmV4cG9ydHMucGFyc2UgPSBwYXJzZTtcclxuZXhwb3J0cy5mcm9tSlNPTiA9IGZyb21KU09OO1xyXG5leHBvcnRzLmRvbWFpbk1hdGNoID0gZG9tYWluTWF0Y2g7XHJcbmV4cG9ydHMuZGVmYXVsdFBhdGggPSBkZWZhdWx0UGF0aDtcclxuZXhwb3J0cy5wYXRoTWF0Y2ggPSBwYXRoTWF0Y2g7XHJcbmV4cG9ydHMuZ2V0UHVibGljU3VmZml4ID0gcHVic3VmZml4LmdldFB1YmxpY1N1ZmZpeDtcclxuZXhwb3J0cy5jb29raWVDb21wYXJlID0gY29va2llQ29tcGFyZTtcclxuZXhwb3J0cy5wZXJtdXRlRG9tYWluID0gcmVxdWlyZSgnLi9wZXJtdXRlRG9tYWluJykucGVybXV0ZURvbWFpbjtcclxuZXhwb3J0cy5wZXJtdXRlUGF0aCA9IHBlcm11dGVQYXRoO1xyXG5leHBvcnRzLmNhbm9uaWNhbERvbWFpbiA9IGNhbm9uaWNhbERvbWFpbjtcclxuIiwiLyohXHJcbiAqIENvcHlyaWdodCAoYykgMjAxNSwgU2FsZXNmb3JjZS5jb20sIEluYy5cclxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cclxuICpcclxuICogUmVkaXN0cmlidXRpb24gYW5kIHVzZSBpbiBzb3VyY2UgYW5kIGJpbmFyeSBmb3Jtcywgd2l0aCBvciB3aXRob3V0XHJcbiAqIG1vZGlmaWNhdGlvbiwgYXJlIHBlcm1pdHRlZCBwcm92aWRlZCB0aGF0IHRoZSBmb2xsb3dpbmcgY29uZGl0aW9ucyBhcmUgbWV0OlxyXG4gKlxyXG4gKiAxLiBSZWRpc3RyaWJ1dGlvbnMgb2Ygc291cmNlIGNvZGUgbXVzdCByZXRhaW4gdGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UsXHJcbiAqIHRoaXMgbGlzdCBvZiBjb25kaXRpb25zIGFuZCB0aGUgZm9sbG93aW5nIGRpc2NsYWltZXIuXHJcbiAqXHJcbiAqIDIuIFJlZGlzdHJpYnV0aW9ucyBpbiBiaW5hcnkgZm9ybSBtdXN0IHJlcHJvZHVjZSB0aGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSxcclxuICogdGhpcyBsaXN0IG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lciBpbiB0aGUgZG9jdW1lbnRhdGlvblxyXG4gKiBhbmQvb3Igb3RoZXIgbWF0ZXJpYWxzIHByb3ZpZGVkIHdpdGggdGhlIGRpc3RyaWJ1dGlvbi5cclxuICpcclxuICogMy4gTmVpdGhlciB0aGUgbmFtZSBvZiBTYWxlc2ZvcmNlLmNvbSBub3IgdGhlIG5hbWVzIG9mIGl0cyBjb250cmlidXRvcnMgbWF5XHJcbiAqIGJlIHVzZWQgdG8gZW5kb3JzZSBvciBwcm9tb3RlIHByb2R1Y3RzIGRlcml2ZWQgZnJvbSB0aGlzIHNvZnR3YXJlIHdpdGhvdXRcclxuICogc3BlY2lmaWMgcHJpb3Igd3JpdHRlbiBwZXJtaXNzaW9uLlxyXG4gKlxyXG4gKiBUSElTIFNPRlRXQVJFIElTIFBST1ZJREVEIEJZIFRIRSBDT1BZUklHSFQgSE9MREVSUyBBTkQgQ09OVFJJQlVUT1JTIFwiQVMgSVNcIlxyXG4gKiBBTkQgQU5ZIEVYUFJFU1MgT1IgSU1QTElFRCBXQVJSQU5USUVTLCBJTkNMVURJTkcsIEJVVCBOT1QgTElNSVRFRCBUTywgVEhFXHJcbiAqIElNUExJRUQgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFkgQU5EIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFXHJcbiAqIEFSRSBESVNDTEFJTUVELiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQ09QWVJJR0hUIEhPTERFUiBPUiBDT05UUklCVVRPUlMgQkVcclxuICogTElBQkxFIEZPUiBBTlkgRElSRUNULCBJTkRJUkVDVCwgSU5DSURFTlRBTCwgU1BFQ0lBTCwgRVhFTVBMQVJZLCBPUlxyXG4gKiBDT05TRVFVRU5USUFMIERBTUFHRVMgKElOQ0xVRElORywgQlVUIE5PVCBMSU1JVEVEIFRPLCBQUk9DVVJFTUVOVCBPRlxyXG4gKiBTVUJTVElUVVRFIEdPT0RTIE9SIFNFUlZJQ0VTOyBMT1NTIE9GIFVTRSwgREFUQSwgT1IgUFJPRklUUzsgT1IgQlVTSU5FU1NcclxuICogSU5URVJSVVBUSU9OKSBIT1dFVkVSIENBVVNFRCBBTkQgT04gQU5ZIFRIRU9SWSBPRiBMSUFCSUxJVFksIFdIRVRIRVIgSU5cclxuICogQ09OVFJBQ1QsIFNUUklDVCBMSUFCSUxJVFksIE9SIFRPUlQgKElOQ0xVRElORyBORUdMSUdFTkNFIE9SIE9USEVSV0lTRSlcclxuICogQVJJU0lORyBJTiBBTlkgV0FZIE9VVCBPRiBUSEUgVVNFIE9GIFRISVMgU09GVFdBUkUsIEVWRU4gSUYgQURWSVNFRCBPRiBUSEVcclxuICogUE9TU0lCSUxJVFkgT0YgU1VDSCBEQU1BR0UuXHJcbiAqL1xyXG5cInVzZSBzdHJpY3RcIjtcclxudmFyIHB1YnN1ZmZpeCA9IHJlcXVpcmUoJy4vcHVic3VmZml4LXBzbCcpO1xyXG5cclxuLy8gR2l2ZXMgdGhlIHBlcm11dGF0aW9uIG9mIGFsbCBwb3NzaWJsZSBkb21haW5NYXRjaCgpZXMgb2YgYSBnaXZlbiBkb21haW4uIFRoZVxyXG4vLyBhcnJheSBpcyBpbiBzaG9ydGVzdC10by1sb25nZXN0IG9yZGVyLiAgSGFuZHkgZm9yIGluZGV4aW5nLlxyXG5mdW5jdGlvbiBwZXJtdXRlRG9tYWluIChkb21haW4pIHtcclxuICB2YXIgcHViU3VmID0gcHVic3VmZml4LmdldFB1YmxpY1N1ZmZpeChkb21haW4pO1xyXG4gIGlmICghcHViU3VmKSB7XHJcbiAgICByZXR1cm4gbnVsbDtcclxuICB9XHJcbiAgaWYgKHB1YlN1ZiA9PSBkb21haW4pIHtcclxuICAgIHJldHVybiBbZG9tYWluXTtcclxuICB9XHJcblxyXG4gIHZhciBwcmVmaXggPSBkb21haW4uc2xpY2UoMCwgLShwdWJTdWYubGVuZ3RoICsgMSkpOyAvLyBcIi5leGFtcGxlLmNvbVwiXHJcbiAgdmFyIHBhcnRzID0gcHJlZml4LnNwbGl0KCcuJykucmV2ZXJzZSgpO1xyXG4gIHZhciBjdXIgPSBwdWJTdWY7XHJcbiAgdmFyIHBlcm11dGF0aW9ucyA9IFtjdXJdO1xyXG4gIHdoaWxlIChwYXJ0cy5sZW5ndGgpIHtcclxuICAgIGN1ciA9IHBhcnRzLnNoaWZ0KCkgKyAnLicgKyBjdXI7XHJcbiAgICBwZXJtdXRhdGlvbnMucHVzaChjdXIpO1xyXG4gIH1cclxuICByZXR1cm4gcGVybXV0YXRpb25zO1xyXG59XHJcblxyXG5leHBvcnRzLnBlcm11dGVEb21haW4gPSBwZXJtdXRlRG9tYWluO1xyXG4iXSwic291cmNlUm9vdCI6IiJ9