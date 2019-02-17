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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdG91Z2gtY29va2llL2xpYi9wYXRoTWF0Y2guanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3RvdWdoLWNvb2tpZS9saWIvcHVic3VmZml4LXBzbC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdG91Z2gtY29va2llL2xpYi9tZW1zdG9yZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdG91Z2gtY29va2llL2xpYi9zdG9yZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdG91Z2gtY29va2llL2xpYi9jb29raWUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3RvdWdoLWNvb2tpZS9saWIvcGVybXV0ZURvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0NBQWdDLCtCQUErQjtBQUMvRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ2E7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7OztBQzVEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQ0FBZ0MsK0JBQStCO0FBQy9EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDYTtBQUNiLFVB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TDtBQUNBLG9DQUFvQztBQUNwQztBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSw4REFBOEQsRUFBRTtBQUNoRTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCOztBQUU1QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQSwyQkFBMkI7QUFDM0I7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHdEQUF3RDtBQUN4RDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBEQUEwRDtBQUMxRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLG1CQUFPLENBQUMsNkJBQWlCO0FBQ2pEO0FBQ0E7Ozs7Ozs7Ozs7Ozs7O0FDdDVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQ0FBZ0MsK0JBQStCO0FBQy9EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDYTtBQUNiLGdCQUFnQixtQkFBTyxDQUFDLDZCQUFpQjs7QUFFekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEscURBQXFEO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSIsImZpbGUiOiJ2ZW5kb3IvdmVuZG9yLnRvdWdoLWNvb2tpZS5jOGU5Yzk0ZTU2YTBlZTIzN2YyNS5jaHVuay5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogQ29weXJpZ2h0IChjKSAyMDE1LCBTYWxlc2ZvcmNlLmNvbSwgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBSZWRpc3RyaWJ1dGlvbiBhbmQgdXNlIGluIHNvdXJjZSBhbmQgYmluYXJ5IGZvcm1zLCB3aXRoIG9yIHdpdGhvdXRcbiAqIG1vZGlmaWNhdGlvbiwgYXJlIHBlcm1pdHRlZCBwcm92aWRlZCB0aGF0IHRoZSBmb2xsb3dpbmcgY29uZGl0aW9ucyBhcmUgbWV0OlxuICpcbiAqIDEuIFJlZGlzdHJpYnV0aW9ucyBvZiBzb3VyY2UgY29kZSBtdXN0IHJldGFpbiB0aGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSxcbiAqIHRoaXMgbGlzdCBvZiBjb25kaXRpb25zIGFuZCB0aGUgZm9sbG93aW5nIGRpc2NsYWltZXIuXG4gKlxuICogMi4gUmVkaXN0cmlidXRpb25zIGluIGJpbmFyeSBmb3JtIG11c3QgcmVwcm9kdWNlIHRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlLFxuICogdGhpcyBsaXN0IG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lciBpbiB0aGUgZG9jdW1lbnRhdGlvblxuICogYW5kL29yIG90aGVyIG1hdGVyaWFscyBwcm92aWRlZCB3aXRoIHRoZSBkaXN0cmlidXRpb24uXG4gKlxuICogMy4gTmVpdGhlciB0aGUgbmFtZSBvZiBTYWxlc2ZvcmNlLmNvbSBub3IgdGhlIG5hbWVzIG9mIGl0cyBjb250cmlidXRvcnMgbWF5XG4gKiBiZSB1c2VkIHRvIGVuZG9yc2Ugb3IgcHJvbW90ZSBwcm9kdWN0cyBkZXJpdmVkIGZyb20gdGhpcyBzb2Z0d2FyZSB3aXRob3V0XG4gKiBzcGVjaWZpYyBwcmlvciB3cml0dGVuIHBlcm1pc3Npb24uXG4gKlxuICogVEhJUyBTT0ZUV0FSRSBJUyBQUk9WSURFRCBCWSBUSEUgQ09QWVJJR0hUIEhPTERFUlMgQU5EIENPTlRSSUJVVE9SUyBcIkFTIElTXCJcbiAqIEFORCBBTlkgRVhQUkVTUyBPUiBJTVBMSUVEIFdBUlJBTlRJRVMsIElOQ0xVRElORywgQlVUIE5PVCBMSU1JVEVEIFRPLCBUSEVcbiAqIElNUExJRUQgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFkgQU5EIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFXG4gKiBBUkUgRElTQ0xBSU1FRC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIENPUFlSSUdIVCBIT0xERVIgT1IgQ09OVFJJQlVUT1JTIEJFXG4gKiBMSUFCTEUgRk9SIEFOWSBESVJFQ1QsIElORElSRUNULCBJTkNJREVOVEFMLCBTUEVDSUFMLCBFWEVNUExBUlksIE9SXG4gKiBDT05TRVFVRU5USUFMIERBTUFHRVMgKElOQ0xVRElORywgQlVUIE5PVCBMSU1JVEVEIFRPLCBQUk9DVVJFTUVOVCBPRlxuICogU1VCU1RJVFVURSBHT09EUyBPUiBTRVJWSUNFUzsgTE9TUyBPRiBVU0UsIERBVEEsIE9SIFBST0ZJVFM7IE9SIEJVU0lORVNTXG4gKiBJTlRFUlJVUFRJT04pIEhPV0VWRVIgQ0FVU0VEIEFORCBPTiBBTlkgVEhFT1JZIE9GIExJQUJJTElUWSwgV0hFVEhFUiBJTlxuICogQ09OVFJBQ1QsIFNUUklDVCBMSUFCSUxJVFksIE9SIFRPUlQgKElOQ0xVRElORyBORUdMSUdFTkNFIE9SIE9USEVSV0lTRSlcbiAqIEFSSVNJTkcgSU4gQU5ZIFdBWSBPVVQgT0YgVEhFIFVTRSBPRiBUSElTIFNPRlRXQVJFLCBFVkVOIElGIEFEVklTRUQgT0YgVEhFXG4gKiBQT1NTSUJJTElUWSBPRiBTVUNIIERBTUFHRS5cbiAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG4vKlxuICogXCJBIHJlcXVlc3QtcGF0aCBwYXRoLW1hdGNoZXMgYSBnaXZlbiBjb29raWUtcGF0aCBpZiBhdCBsZWFzdCBvbmUgb2YgdGhlXG4gKiBmb2xsb3dpbmcgY29uZGl0aW9ucyBob2xkczpcIlxuICovXG5mdW5jdGlvbiBwYXRoTWF0Y2ggKHJlcVBhdGgsIGNvb2tpZVBhdGgpIHtcbiAgLy8gXCJvICBUaGUgY29va2llLXBhdGggYW5kIHRoZSByZXF1ZXN0LXBhdGggYXJlIGlkZW50aWNhbC5cIlxuICBpZiAoY29va2llUGF0aCA9PT0gcmVxUGF0aCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgdmFyIGlkeCA9IHJlcVBhdGguaW5kZXhPZihjb29raWVQYXRoKTtcbiAgaWYgKGlkeCA9PT0gMCkge1xuICAgIC8vIFwibyAgVGhlIGNvb2tpZS1wYXRoIGlzIGEgcHJlZml4IG9mIHRoZSByZXF1ZXN0LXBhdGgsIGFuZCB0aGUgbGFzdFxuICAgIC8vIGNoYXJhY3RlciBvZiB0aGUgY29va2llLXBhdGggaXMgJXgyRiAoXCIvXCIpLlwiXG4gICAgaWYgKGNvb2tpZVBhdGguc3Vic3RyKC0xKSA9PT0gXCIvXCIpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIC8vIFwiIG8gIFRoZSBjb29raWUtcGF0aCBpcyBhIHByZWZpeCBvZiB0aGUgcmVxdWVzdC1wYXRoLCBhbmQgdGhlIGZpcnN0XG4gICAgLy8gY2hhcmFjdGVyIG9mIHRoZSByZXF1ZXN0LXBhdGggdGhhdCBpcyBub3QgaW5jbHVkZWQgaW4gdGhlIGNvb2tpZS0gcGF0aFxuICAgIC8vIGlzIGEgJXgyRiAoXCIvXCIpIGNoYXJhY3Rlci5cIlxuICAgIGlmIChyZXFQYXRoLnN1YnN0cihjb29raWVQYXRoLmxlbmd0aCwgMSkgPT09IFwiL1wiKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59XG5cbmV4cG9ydHMucGF0aE1hdGNoID0gcGF0aE1hdGNoO1xuIiwiLyohXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTgsIFNhbGVzZm9yY2UuY29tLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFJlZGlzdHJpYnV0aW9uIGFuZCB1c2UgaW4gc291cmNlIGFuZCBiaW5hcnkgZm9ybXMsIHdpdGggb3Igd2l0aG91dFxuICogbW9kaWZpY2F0aW9uLCBhcmUgcGVybWl0dGVkIHByb3ZpZGVkIHRoYXQgdGhlIGZvbGxvd2luZyBjb25kaXRpb25zIGFyZSBtZXQ6XG4gKlxuICogMS4gUmVkaXN0cmlidXRpb25zIG9mIHNvdXJjZSBjb2RlIG11c3QgcmV0YWluIHRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlLFxuICogdGhpcyBsaXN0IG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lci5cbiAqXG4gKiAyLiBSZWRpc3RyaWJ1dGlvbnMgaW4gYmluYXJ5IGZvcm0gbXVzdCByZXByb2R1Y2UgdGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UsXG4gKiB0aGlzIGxpc3Qgb2YgY29uZGl0aW9ucyBhbmQgdGhlIGZvbGxvd2luZyBkaXNjbGFpbWVyIGluIHRoZSBkb2N1bWVudGF0aW9uXG4gKiBhbmQvb3Igb3RoZXIgbWF0ZXJpYWxzIHByb3ZpZGVkIHdpdGggdGhlIGRpc3RyaWJ1dGlvbi5cbiAqXG4gKiAzLiBOZWl0aGVyIHRoZSBuYW1lIG9mIFNhbGVzZm9yY2UuY29tIG5vciB0aGUgbmFtZXMgb2YgaXRzIGNvbnRyaWJ1dG9ycyBtYXlcbiAqIGJlIHVzZWQgdG8gZW5kb3JzZSBvciBwcm9tb3RlIHByb2R1Y3RzIGRlcml2ZWQgZnJvbSB0aGlzIHNvZnR3YXJlIHdpdGhvdXRcbiAqIHNwZWNpZmljIHByaW9yIHdyaXR0ZW4gcGVybWlzc2lvbi5cbiAqXG4gKiBUSElTIFNPRlRXQVJFIElTIFBST1ZJREVEIEJZIFRIRSBDT1BZUklHSFQgSE9MREVSUyBBTkQgQ09OVFJJQlVUT1JTIFwiQVMgSVNcIlxuICogQU5EIEFOWSBFWFBSRVNTIE9SIElNUExJRUQgV0FSUkFOVElFUywgSU5DTFVESU5HLCBCVVQgTk9UIExJTUlURUQgVE8sIFRIRVxuICogSU1QTElFRCBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSBBTkQgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0VcbiAqIEFSRSBESVNDTEFJTUVELiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQ09QWVJJR0hUIEhPTERFUiBPUiBDT05UUklCVVRPUlMgQkVcbiAqIExJQUJMRSBGT1IgQU5ZIERJUkVDVCwgSU5ESVJFQ1QsIElOQ0lERU5UQUwsIFNQRUNJQUwsIEVYRU1QTEFSWSwgT1JcbiAqIENPTlNFUVVFTlRJQUwgREFNQUdFUyAoSU5DTFVESU5HLCBCVVQgTk9UIExJTUlURUQgVE8sIFBST0NVUkVNRU5UIE9GXG4gKiBTVUJTVElUVVRFIEdPT0RTIE9SIFNFUlZJQ0VTOyBMT1NTIE9GIFVTRSwgREFUQSwgT1IgUFJPRklUUzsgT1IgQlVTSU5FU1NcbiAqIElOVEVSUlVQVElPTikgSE9XRVZFUiBDQVVTRUQgQU5EIE9OIEFOWSBUSEVPUlkgT0YgTElBQklMSVRZLCBXSEVUSEVSIElOXG4gKiBDT05UUkFDVCwgU1RSSUNUIExJQUJJTElUWSwgT1IgVE9SVCAoSU5DTFVESU5HIE5FR0xJR0VOQ0UgT1IgT1RIRVJXSVNFKVxuICogQVJJU0lORyBJTiBBTlkgV0FZIE9VVCBPRiBUSEUgVVNFIE9GIFRISVMgU09GVFdBUkUsIEVWRU4gSUYgQURWSVNFRCBPRiBUSEVcbiAqIFBPU1NJQklMSVRZIE9GIFNVQ0ggREFNQUdFLlxuICovXG4ndXNlIHN0cmljdCc7XG52YXIgcHNsID0gcmVxdWlyZSgncHNsJyk7XG5cbmZ1bmN0aW9uIGdldFB1YmxpY1N1ZmZpeChkb21haW4pIHtcbiAgcmV0dXJuIHBzbC5nZXQoZG9tYWluKTtcbn1cblxuZXhwb3J0cy5nZXRQdWJsaWNTdWZmaXggPSBnZXRQdWJsaWNTdWZmaXg7XG4iLCIvKiFcbiAqIENvcHlyaWdodCAoYykgMjAxNSwgU2FsZXNmb3JjZS5jb20sIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogUmVkaXN0cmlidXRpb24gYW5kIHVzZSBpbiBzb3VyY2UgYW5kIGJpbmFyeSBmb3Jtcywgd2l0aCBvciB3aXRob3V0XG4gKiBtb2RpZmljYXRpb24sIGFyZSBwZXJtaXR0ZWQgcHJvdmlkZWQgdGhhdCB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnMgYXJlIG1ldDpcbiAqXG4gKiAxLiBSZWRpc3RyaWJ1dGlvbnMgb2Ygc291cmNlIGNvZGUgbXVzdCByZXRhaW4gdGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UsXG4gKiB0aGlzIGxpc3Qgb2YgY29uZGl0aW9ucyBhbmQgdGhlIGZvbGxvd2luZyBkaXNjbGFpbWVyLlxuICpcbiAqIDIuIFJlZGlzdHJpYnV0aW9ucyBpbiBiaW5hcnkgZm9ybSBtdXN0IHJlcHJvZHVjZSB0aGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSxcbiAqIHRoaXMgbGlzdCBvZiBjb25kaXRpb25zIGFuZCB0aGUgZm9sbG93aW5nIGRpc2NsYWltZXIgaW4gdGhlIGRvY3VtZW50YXRpb25cbiAqIGFuZC9vciBvdGhlciBtYXRlcmlhbHMgcHJvdmlkZWQgd2l0aCB0aGUgZGlzdHJpYnV0aW9uLlxuICpcbiAqIDMuIE5laXRoZXIgdGhlIG5hbWUgb2YgU2FsZXNmb3JjZS5jb20gbm9yIHRoZSBuYW1lcyBvZiBpdHMgY29udHJpYnV0b3JzIG1heVxuICogYmUgdXNlZCB0byBlbmRvcnNlIG9yIHByb21vdGUgcHJvZHVjdHMgZGVyaXZlZCBmcm9tIHRoaXMgc29mdHdhcmUgd2l0aG91dFxuICogc3BlY2lmaWMgcHJpb3Igd3JpdHRlbiBwZXJtaXNzaW9uLlxuICpcbiAqIFRISVMgU09GVFdBUkUgSVMgUFJPVklERUQgQlkgVEhFIENPUFlSSUdIVCBIT0xERVJTIEFORCBDT05UUklCVVRPUlMgXCJBUyBJU1wiXG4gKiBBTkQgQU5ZIEVYUFJFU1MgT1IgSU1QTElFRCBXQVJSQU5USUVTLCBJTkNMVURJTkcsIEJVVCBOT1QgTElNSVRFRCBUTywgVEhFXG4gKiBJTVBMSUVEIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZIEFORCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRVxuICogQVJFIERJU0NMQUlNRUQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBDT1BZUklHSFQgSE9MREVSIE9SIENPTlRSSUJVVE9SUyBCRVxuICogTElBQkxFIEZPUiBBTlkgRElSRUNULCBJTkRJUkVDVCwgSU5DSURFTlRBTCwgU1BFQ0lBTCwgRVhFTVBMQVJZLCBPUlxuICogQ09OU0VRVUVOVElBTCBEQU1BR0VTIChJTkNMVURJTkcsIEJVVCBOT1QgTElNSVRFRCBUTywgUFJPQ1VSRU1FTlQgT0ZcbiAqIFNVQlNUSVRVVEUgR09PRFMgT1IgU0VSVklDRVM7IExPU1MgT0YgVVNFLCBEQVRBLCBPUiBQUk9GSVRTOyBPUiBCVVNJTkVTU1xuICogSU5URVJSVVBUSU9OKSBIT1dFVkVSIENBVVNFRCBBTkQgT04gQU5ZIFRIRU9SWSBPRiBMSUFCSUxJVFksIFdIRVRIRVIgSU5cbiAqIENPTlRSQUNULCBTVFJJQ1QgTElBQklMSVRZLCBPUiBUT1JUIChJTkNMVURJTkcgTkVHTElHRU5DRSBPUiBPVEhFUldJU0UpXG4gKiBBUklTSU5HIElOIEFOWSBXQVkgT1VUIE9GIFRIRSBVU0UgT0YgVEhJUyBTT0ZUV0FSRSwgRVZFTiBJRiBBRFZJU0VEIE9GIFRIRVxuICogUE9TU0lCSUxJVFkgT0YgU1VDSCBEQU1BR0UuXG4gKi9cbid1c2Ugc3RyaWN0JztcbnZhciBTdG9yZSA9IHJlcXVpcmUoJy4vc3RvcmUnKS5TdG9yZTtcbnZhciBwZXJtdXRlRG9tYWluID0gcmVxdWlyZSgnLi9wZXJtdXRlRG9tYWluJykucGVybXV0ZURvbWFpbjtcbnZhciBwYXRoTWF0Y2ggPSByZXF1aXJlKCcuL3BhdGhNYXRjaCcpLnBhdGhNYXRjaDtcbnZhciB1dGlsID0gcmVxdWlyZSgndXRpbCcpO1xuXG5mdW5jdGlvbiBNZW1vcnlDb29raWVTdG9yZSgpIHtcbiAgU3RvcmUuY2FsbCh0aGlzKTtcbiAgdGhpcy5pZHggPSB7fTtcbn1cbnV0aWwuaW5oZXJpdHMoTWVtb3J5Q29va2llU3RvcmUsIFN0b3JlKTtcbmV4cG9ydHMuTWVtb3J5Q29va2llU3RvcmUgPSBNZW1vcnlDb29raWVTdG9yZTtcbk1lbW9yeUNvb2tpZVN0b3JlLnByb3RvdHlwZS5pZHggPSBudWxsO1xuXG4vLyBTaW5jZSBpdCdzIGp1c3QgYSBzdHJ1Y3QgaW4gUkFNLCB0aGlzIFN0b3JlIGlzIHN5bmNocm9ub3VzXG5NZW1vcnlDb29raWVTdG9yZS5wcm90b3R5cGUuc3luY2hyb25vdXMgPSB0cnVlO1xuXG4vLyBmb3JjZSBhIGRlZmF1bHQgZGVwdGg6XG5NZW1vcnlDb29raWVTdG9yZS5wcm90b3R5cGUuaW5zcGVjdCA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gXCJ7IGlkeDogXCIrdXRpbC5pbnNwZWN0KHRoaXMuaWR4LCBmYWxzZSwgMikrJyB9Jztcbn07XG5cbi8vIFVzZSB0aGUgbmV3IGN1c3RvbSBpbnNwZWN0aW9uIHN5bWJvbCB0byBhZGQgdGhlIGN1c3RvbSBpbnNwZWN0IGZ1bmN0aW9uIGlmXG4vLyBhdmFpbGFibGUuXG5pZiAodXRpbC5pbnNwZWN0LmN1c3RvbSkge1xuICBNZW1vcnlDb29raWVTdG9yZS5wcm90b3R5cGVbdXRpbC5pbnNwZWN0LmN1c3RvbV0gPSBNZW1vcnlDb29raWVTdG9yZS5wcm90b3R5cGUuaW5zcGVjdDtcbn1cblxuTWVtb3J5Q29va2llU3RvcmUucHJvdG90eXBlLmZpbmRDb29raWUgPSBmdW5jdGlvbihkb21haW4sIHBhdGgsIGtleSwgY2IpIHtcbiAgaWYgKCF0aGlzLmlkeFtkb21haW5dKSB7XG4gICAgcmV0dXJuIGNiKG51bGwsdW5kZWZpbmVkKTtcbiAgfVxuICBpZiAoIXRoaXMuaWR4W2RvbWFpbl1bcGF0aF0pIHtcbiAgICByZXR1cm4gY2IobnVsbCx1bmRlZmluZWQpO1xuICB9XG4gIHJldHVybiBjYihudWxsLHRoaXMuaWR4W2RvbWFpbl1bcGF0aF1ba2V5XXx8bnVsbCk7XG59O1xuXG5NZW1vcnlDb29raWVTdG9yZS5wcm90b3R5cGUuZmluZENvb2tpZXMgPSBmdW5jdGlvbihkb21haW4sIHBhdGgsIGNiKSB7XG4gIHZhciByZXN1bHRzID0gW107XG4gIGlmICghZG9tYWluKSB7XG4gICAgcmV0dXJuIGNiKG51bGwsW10pO1xuICB9XG5cbiAgdmFyIHBhdGhNYXRjaGVyO1xuICBpZiAoIXBhdGgpIHtcbiAgICAvLyBudWxsIG1lYW5zIFwiYWxsIHBhdGhzXCJcbiAgICBwYXRoTWF0Y2hlciA9IGZ1bmN0aW9uIG1hdGNoQWxsKGRvbWFpbkluZGV4KSB7XG4gICAgICBmb3IgKHZhciBjdXJQYXRoIGluIGRvbWFpbkluZGV4KSB7XG4gICAgICAgIHZhciBwYXRoSW5kZXggPSBkb21haW5JbmRleFtjdXJQYXRoXTtcbiAgICAgICAgZm9yICh2YXIga2V5IGluIHBhdGhJbmRleCkge1xuICAgICAgICAgIHJlc3VsdHMucHVzaChwYXRoSW5kZXhba2V5XSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gIH0gZWxzZSB7XG4gICAgcGF0aE1hdGNoZXIgPSBmdW5jdGlvbiBtYXRjaFJGQyhkb21haW5JbmRleCkge1xuICAgICAgIC8vTk9URTogd2Ugc2hvdWxkIHVzZSBwYXRoLW1hdGNoIGFsZ29yaXRobSBmcm9tIFM1LjEuNCBoZXJlXG4gICAgICAgLy8oc2VlIDogaHR0cHM6Ly9naXRodWIuY29tL0Nocm9taXVtV2ViQXBwcy9jaHJvbWl1bS9ibG9iL2IzZDNiNGRhOGJiOTRjMWIyZTA2MTYwMGRmMTA2ZDU5MGZkYTM2MjAvbmV0L2Nvb2tpZXMvY2Fub25pY2FsX2Nvb2tpZS5jYyNMMjk5KVxuICAgICAgIE9iamVjdC5rZXlzKGRvbWFpbkluZGV4KS5mb3JFYWNoKGZ1bmN0aW9uIChjb29raWVQYXRoKSB7XG4gICAgICAgICBpZiAocGF0aE1hdGNoKHBhdGgsIGNvb2tpZVBhdGgpKSB7XG4gICAgICAgICAgIHZhciBwYXRoSW5kZXggPSBkb21haW5JbmRleFtjb29raWVQYXRoXTtcblxuICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gcGF0aEluZGV4KSB7XG4gICAgICAgICAgICAgcmVzdWx0cy5wdXNoKHBhdGhJbmRleFtrZXldKTtcbiAgICAgICAgICAgfVxuICAgICAgICAgfVxuICAgICAgIH0pO1xuICAgICB9O1xuICB9XG5cbiAgdmFyIGRvbWFpbnMgPSBwZXJtdXRlRG9tYWluKGRvbWFpbikgfHwgW2RvbWFpbl07XG4gIHZhciBpZHggPSB0aGlzLmlkeDtcbiAgZG9tYWlucy5mb3JFYWNoKGZ1bmN0aW9uKGN1ckRvbWFpbikge1xuICAgIHZhciBkb21haW5JbmRleCA9IGlkeFtjdXJEb21haW5dO1xuICAgIGlmICghZG9tYWluSW5kZXgpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgcGF0aE1hdGNoZXIoZG9tYWluSW5kZXgpO1xuICB9KTtcblxuICBjYihudWxsLHJlc3VsdHMpO1xufTtcblxuTWVtb3J5Q29va2llU3RvcmUucHJvdG90eXBlLnB1dENvb2tpZSA9IGZ1bmN0aW9uKGNvb2tpZSwgY2IpIHtcbiAgaWYgKCF0aGlzLmlkeFtjb29raWUuZG9tYWluXSkge1xuICAgIHRoaXMuaWR4W2Nvb2tpZS5kb21haW5dID0ge307XG4gIH1cbiAgaWYgKCF0aGlzLmlkeFtjb29raWUuZG9tYWluXVtjb29raWUucGF0aF0pIHtcbiAgICB0aGlzLmlkeFtjb29raWUuZG9tYWluXVtjb29raWUucGF0aF0gPSB7fTtcbiAgfVxuICB0aGlzLmlkeFtjb29raWUuZG9tYWluXVtjb29raWUucGF0aF1bY29va2llLmtleV0gPSBjb29raWU7XG4gIGNiKG51bGwpO1xufTtcblxuTWVtb3J5Q29va2llU3RvcmUucHJvdG90eXBlLnVwZGF0ZUNvb2tpZSA9IGZ1bmN0aW9uKG9sZENvb2tpZSwgbmV3Q29va2llLCBjYikge1xuICAvLyB1cGRhdGVDb29raWUoKSBtYXkgYXZvaWQgdXBkYXRpbmcgY29va2llcyB0aGF0IGFyZSBpZGVudGljYWwuICBGb3IgZXhhbXBsZSxcbiAgLy8gbGFzdEFjY2Vzc2VkIG1heSBub3QgYmUgaW1wb3J0YW50IHRvIHNvbWUgc3RvcmVzIGFuZCBhbiBlcXVhbGl0eVxuICAvLyBjb21wYXJpc29uIGNvdWxkIGV4Y2x1ZGUgdGhhdCBmaWVsZC5cbiAgdGhpcy5wdXRDb29raWUobmV3Q29va2llLGNiKTtcbn07XG5cbk1lbW9yeUNvb2tpZVN0b3JlLnByb3RvdHlwZS5yZW1vdmVDb29raWUgPSBmdW5jdGlvbihkb21haW4sIHBhdGgsIGtleSwgY2IpIHtcbiAgaWYgKHRoaXMuaWR4W2RvbWFpbl0gJiYgdGhpcy5pZHhbZG9tYWluXVtwYXRoXSAmJiB0aGlzLmlkeFtkb21haW5dW3BhdGhdW2tleV0pIHtcbiAgICBkZWxldGUgdGhpcy5pZHhbZG9tYWluXVtwYXRoXVtrZXldO1xuICB9XG4gIGNiKG51bGwpO1xufTtcblxuTWVtb3J5Q29va2llU3RvcmUucHJvdG90eXBlLnJlbW92ZUNvb2tpZXMgPSBmdW5jdGlvbihkb21haW4sIHBhdGgsIGNiKSB7XG4gIGlmICh0aGlzLmlkeFtkb21haW5dKSB7XG4gICAgaWYgKHBhdGgpIHtcbiAgICAgIGRlbGV0ZSB0aGlzLmlkeFtkb21haW5dW3BhdGhdO1xuICAgIH0gZWxzZSB7XG4gICAgICBkZWxldGUgdGhpcy5pZHhbZG9tYWluXTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGNiKG51bGwpO1xufTtcblxuTWVtb3J5Q29va2llU3RvcmUucHJvdG90eXBlLmdldEFsbENvb2tpZXMgPSBmdW5jdGlvbihjYikge1xuICB2YXIgY29va2llcyA9IFtdO1xuICB2YXIgaWR4ID0gdGhpcy5pZHg7XG5cbiAgdmFyIGRvbWFpbnMgPSBPYmplY3Qua2V5cyhpZHgpO1xuICBkb21haW5zLmZvckVhY2goZnVuY3Rpb24oZG9tYWluKSB7XG4gICAgdmFyIHBhdGhzID0gT2JqZWN0LmtleXMoaWR4W2RvbWFpbl0pO1xuICAgIHBhdGhzLmZvckVhY2goZnVuY3Rpb24ocGF0aCkge1xuICAgICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhpZHhbZG9tYWluXVtwYXRoXSk7XG4gICAgICBrZXlzLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgIGlmIChrZXkgIT09IG51bGwpIHtcbiAgICAgICAgICBjb29raWVzLnB1c2goaWR4W2RvbWFpbl1bcGF0aF1ba2V5XSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuICAvLyBTb3J0IGJ5IGNyZWF0aW9uSW5kZXggc28gZGVzZXJpYWxpemluZyByZXRhaW5zIHRoZSBjcmVhdGlvbiBvcmRlci5cbiAgLy8gV2hlbiBpbXBsZW1lbnRpbmcgeW91ciBvd24gc3RvcmUsIHRoaXMgU0hPVUxEIHJldGFpbiB0aGUgb3JkZXIgdG9vXG4gIGNvb2tpZXMuc29ydChmdW5jdGlvbihhLGIpIHtcbiAgICByZXR1cm4gKGEuY3JlYXRpb25JbmRleHx8MCkgLSAoYi5jcmVhdGlvbkluZGV4fHwwKTtcbiAgfSk7XG5cbiAgY2IobnVsbCwgY29va2llcyk7XG59O1xuIiwiLyohXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTUsIFNhbGVzZm9yY2UuY29tLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFJlZGlzdHJpYnV0aW9uIGFuZCB1c2UgaW4gc291cmNlIGFuZCBiaW5hcnkgZm9ybXMsIHdpdGggb3Igd2l0aG91dFxuICogbW9kaWZpY2F0aW9uLCBhcmUgcGVybWl0dGVkIHByb3ZpZGVkIHRoYXQgdGhlIGZvbGxvd2luZyBjb25kaXRpb25zIGFyZSBtZXQ6XG4gKlxuICogMS4gUmVkaXN0cmlidXRpb25zIG9mIHNvdXJjZSBjb2RlIG11c3QgcmV0YWluIHRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlLFxuICogdGhpcyBsaXN0IG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lci5cbiAqXG4gKiAyLiBSZWRpc3RyaWJ1dGlvbnMgaW4gYmluYXJ5IGZvcm0gbXVzdCByZXByb2R1Y2UgdGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UsXG4gKiB0aGlzIGxpc3Qgb2YgY29uZGl0aW9ucyBhbmQgdGhlIGZvbGxvd2luZyBkaXNjbGFpbWVyIGluIHRoZSBkb2N1bWVudGF0aW9uXG4gKiBhbmQvb3Igb3RoZXIgbWF0ZXJpYWxzIHByb3ZpZGVkIHdpdGggdGhlIGRpc3RyaWJ1dGlvbi5cbiAqXG4gKiAzLiBOZWl0aGVyIHRoZSBuYW1lIG9mIFNhbGVzZm9yY2UuY29tIG5vciB0aGUgbmFtZXMgb2YgaXRzIGNvbnRyaWJ1dG9ycyBtYXlcbiAqIGJlIHVzZWQgdG8gZW5kb3JzZSBvciBwcm9tb3RlIHByb2R1Y3RzIGRlcml2ZWQgZnJvbSB0aGlzIHNvZnR3YXJlIHdpdGhvdXRcbiAqIHNwZWNpZmljIHByaW9yIHdyaXR0ZW4gcGVybWlzc2lvbi5cbiAqXG4gKiBUSElTIFNPRlRXQVJFIElTIFBST1ZJREVEIEJZIFRIRSBDT1BZUklHSFQgSE9MREVSUyBBTkQgQ09OVFJJQlVUT1JTIFwiQVMgSVNcIlxuICogQU5EIEFOWSBFWFBSRVNTIE9SIElNUExJRUQgV0FSUkFOVElFUywgSU5DTFVESU5HLCBCVVQgTk9UIExJTUlURUQgVE8sIFRIRVxuICogSU1QTElFRCBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSBBTkQgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0VcbiAqIEFSRSBESVNDTEFJTUVELiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQ09QWVJJR0hUIEhPTERFUiBPUiBDT05UUklCVVRPUlMgQkVcbiAqIExJQUJMRSBGT1IgQU5ZIERJUkVDVCwgSU5ESVJFQ1QsIElOQ0lERU5UQUwsIFNQRUNJQUwsIEVYRU1QTEFSWSwgT1JcbiAqIENPTlNFUVVFTlRJQUwgREFNQUdFUyAoSU5DTFVESU5HLCBCVVQgTk9UIExJTUlURUQgVE8sIFBST0NVUkVNRU5UIE9GXG4gKiBTVUJTVElUVVRFIEdPT0RTIE9SIFNFUlZJQ0VTOyBMT1NTIE9GIFVTRSwgREFUQSwgT1IgUFJPRklUUzsgT1IgQlVTSU5FU1NcbiAqIElOVEVSUlVQVElPTikgSE9XRVZFUiBDQVVTRUQgQU5EIE9OIEFOWSBUSEVPUlkgT0YgTElBQklMSVRZLCBXSEVUSEVSIElOXG4gKiBDT05UUkFDVCwgU1RSSUNUIExJQUJJTElUWSwgT1IgVE9SVCAoSU5DTFVESU5HIE5FR0xJR0VOQ0UgT1IgT1RIRVJXSVNFKVxuICogQVJJU0lORyBJTiBBTlkgV0FZIE9VVCBPRiBUSEUgVVNFIE9GIFRISVMgU09GVFdBUkUsIEVWRU4gSUYgQURWSVNFRCBPRiBUSEVcbiAqIFBPU1NJQklMSVRZIE9GIFNVQ0ggREFNQUdFLlxuICovXG4ndXNlIHN0cmljdCc7XG4vKmpzaGludCB1bnVzZWQ6ZmFsc2UgKi9cblxuZnVuY3Rpb24gU3RvcmUoKSB7XG59XG5leHBvcnRzLlN0b3JlID0gU3RvcmU7XG5cbi8vIFN0b3JlcyBtYXkgYmUgc3luY2hyb25vdXMsIGJ1dCBhcmUgc3RpbGwgcmVxdWlyZWQgdG8gdXNlIGFcbi8vIENvbnRpbnVhdGlvbi1QYXNzaW5nIFN0eWxlIEFQSS4gIFRoZSBDb29raWVKYXIgaXRzZWxmIHdpbGwgZXhwb3NlIGEgXCIqU3luY1wiXG4vLyBBUEkgdGhhdCBjb252ZXJ0cyBmcm9tIHN5bmNocm9ub3VzLWNhbGxiYWNrcyB0byBpbXBlcmF0aXZlIHN0eWxlLlxuU3RvcmUucHJvdG90eXBlLnN5bmNocm9ub3VzID0gZmFsc2U7XG5cblN0b3JlLnByb3RvdHlwZS5maW5kQ29va2llID0gZnVuY3Rpb24oZG9tYWluLCBwYXRoLCBrZXksIGNiKSB7XG4gIHRocm93IG5ldyBFcnJvcignZmluZENvb2tpZSBpcyBub3QgaW1wbGVtZW50ZWQnKTtcbn07XG5cblN0b3JlLnByb3RvdHlwZS5maW5kQ29va2llcyA9IGZ1bmN0aW9uKGRvbWFpbiwgcGF0aCwgY2IpIHtcbiAgdGhyb3cgbmV3IEVycm9yKCdmaW5kQ29va2llcyBpcyBub3QgaW1wbGVtZW50ZWQnKTtcbn07XG5cblN0b3JlLnByb3RvdHlwZS5wdXRDb29raWUgPSBmdW5jdGlvbihjb29raWUsIGNiKSB7XG4gIHRocm93IG5ldyBFcnJvcigncHV0Q29va2llIGlzIG5vdCBpbXBsZW1lbnRlZCcpO1xufTtcblxuU3RvcmUucHJvdG90eXBlLnVwZGF0ZUNvb2tpZSA9IGZ1bmN0aW9uKG9sZENvb2tpZSwgbmV3Q29va2llLCBjYikge1xuICAvLyByZWNvbW1lbmRlZCBkZWZhdWx0IGltcGxlbWVudGF0aW9uOlxuICAvLyByZXR1cm4gdGhpcy5wdXRDb29raWUobmV3Q29va2llLCBjYik7XG4gIHRocm93IG5ldyBFcnJvcigndXBkYXRlQ29va2llIGlzIG5vdCBpbXBsZW1lbnRlZCcpO1xufTtcblxuU3RvcmUucHJvdG90eXBlLnJlbW92ZUNvb2tpZSA9IGZ1bmN0aW9uKGRvbWFpbiwgcGF0aCwga2V5LCBjYikge1xuICB0aHJvdyBuZXcgRXJyb3IoJ3JlbW92ZUNvb2tpZSBpcyBub3QgaW1wbGVtZW50ZWQnKTtcbn07XG5cblN0b3JlLnByb3RvdHlwZS5yZW1vdmVDb29raWVzID0gZnVuY3Rpb24oZG9tYWluLCBwYXRoLCBjYikge1xuICB0aHJvdyBuZXcgRXJyb3IoJ3JlbW92ZUNvb2tpZXMgaXMgbm90IGltcGxlbWVudGVkJyk7XG59O1xuXG5TdG9yZS5wcm90b3R5cGUuZ2V0QWxsQ29va2llcyA9IGZ1bmN0aW9uKGNiKSB7XG4gIHRocm93IG5ldyBFcnJvcignZ2V0QWxsQ29va2llcyBpcyBub3QgaW1wbGVtZW50ZWQgKHRoZXJlZm9yZSBqYXIgY2Fubm90IGJlIHNlcmlhbGl6ZWQpJyk7XG59O1xuIiwiLyohXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTUsIFNhbGVzZm9yY2UuY29tLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFJlZGlzdHJpYnV0aW9uIGFuZCB1c2UgaW4gc291cmNlIGFuZCBiaW5hcnkgZm9ybXMsIHdpdGggb3Igd2l0aG91dFxuICogbW9kaWZpY2F0aW9uLCBhcmUgcGVybWl0dGVkIHByb3ZpZGVkIHRoYXQgdGhlIGZvbGxvd2luZyBjb25kaXRpb25zIGFyZSBtZXQ6XG4gKlxuICogMS4gUmVkaXN0cmlidXRpb25zIG9mIHNvdXJjZSBjb2RlIG11c3QgcmV0YWluIHRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlLFxuICogdGhpcyBsaXN0IG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lci5cbiAqXG4gKiAyLiBSZWRpc3RyaWJ1dGlvbnMgaW4gYmluYXJ5IGZvcm0gbXVzdCByZXByb2R1Y2UgdGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UsXG4gKiB0aGlzIGxpc3Qgb2YgY29uZGl0aW9ucyBhbmQgdGhlIGZvbGxvd2luZyBkaXNjbGFpbWVyIGluIHRoZSBkb2N1bWVudGF0aW9uXG4gKiBhbmQvb3Igb3RoZXIgbWF0ZXJpYWxzIHByb3ZpZGVkIHdpdGggdGhlIGRpc3RyaWJ1dGlvbi5cbiAqXG4gKiAzLiBOZWl0aGVyIHRoZSBuYW1lIG9mIFNhbGVzZm9yY2UuY29tIG5vciB0aGUgbmFtZXMgb2YgaXRzIGNvbnRyaWJ1dG9ycyBtYXlcbiAqIGJlIHVzZWQgdG8gZW5kb3JzZSBvciBwcm9tb3RlIHByb2R1Y3RzIGRlcml2ZWQgZnJvbSB0aGlzIHNvZnR3YXJlIHdpdGhvdXRcbiAqIHNwZWNpZmljIHByaW9yIHdyaXR0ZW4gcGVybWlzc2lvbi5cbiAqXG4gKiBUSElTIFNPRlRXQVJFIElTIFBST1ZJREVEIEJZIFRIRSBDT1BZUklHSFQgSE9MREVSUyBBTkQgQ09OVFJJQlVUT1JTIFwiQVMgSVNcIlxuICogQU5EIEFOWSBFWFBSRVNTIE9SIElNUExJRUQgV0FSUkFOVElFUywgSU5DTFVESU5HLCBCVVQgTk9UIExJTUlURUQgVE8sIFRIRVxuICogSU1QTElFRCBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSBBTkQgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0VcbiAqIEFSRSBESVNDTEFJTUVELiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQ09QWVJJR0hUIEhPTERFUiBPUiBDT05UUklCVVRPUlMgQkVcbiAqIExJQUJMRSBGT1IgQU5ZIERJUkVDVCwgSU5ESVJFQ1QsIElOQ0lERU5UQUwsIFNQRUNJQUwsIEVYRU1QTEFSWSwgT1JcbiAqIENPTlNFUVVFTlRJQUwgREFNQUdFUyAoSU5DTFVESU5HLCBCVVQgTk9UIExJTUlURUQgVE8sIFBST0NVUkVNRU5UIE9GXG4gKiBTVUJTVElUVVRFIEdPT0RTIE9SIFNFUlZJQ0VTOyBMT1NTIE9GIFVTRSwgREFUQSwgT1IgUFJPRklUUzsgT1IgQlVTSU5FU1NcbiAqIElOVEVSUlVQVElPTikgSE9XRVZFUiBDQVVTRUQgQU5EIE9OIEFOWSBUSEVPUlkgT0YgTElBQklMSVRZLCBXSEVUSEVSIElOXG4gKiBDT05UUkFDVCwgU1RSSUNUIExJQUJJTElUWSwgT1IgVE9SVCAoSU5DTFVESU5HIE5FR0xJR0VOQ0UgT1IgT1RIRVJXSVNFKVxuICogQVJJU0lORyBJTiBBTlkgV0FZIE9VVCBPRiBUSEUgVVNFIE9GIFRISVMgU09GVFdBUkUsIEVWRU4gSUYgQURWSVNFRCBPRiBUSEVcbiAqIFBPU1NJQklMSVRZIE9GIFNVQ0ggREFNQUdFLlxuICovXG4ndXNlIHN0cmljdCc7XG52YXIgbmV0ID0gcmVxdWlyZSgnbmV0Jyk7XG52YXIgdXJsUGFyc2UgPSByZXF1aXJlKCd1cmwnKS5wYXJzZTtcbnZhciB1dGlsID0gcmVxdWlyZSgndXRpbCcpO1xudmFyIHB1YnN1ZmZpeCA9IHJlcXVpcmUoJy4vcHVic3VmZml4LXBzbCcpO1xudmFyIFN0b3JlID0gcmVxdWlyZSgnLi9zdG9yZScpLlN0b3JlO1xudmFyIE1lbW9yeUNvb2tpZVN0b3JlID0gcmVxdWlyZSgnLi9tZW1zdG9yZScpLk1lbW9yeUNvb2tpZVN0b3JlO1xudmFyIHBhdGhNYXRjaCA9IHJlcXVpcmUoJy4vcGF0aE1hdGNoJykucGF0aE1hdGNoO1xudmFyIFZFUlNJT04gPSByZXF1aXJlKCcuLi9wYWNrYWdlLmpzb24nKS52ZXJzaW9uO1xuXG52YXIgcHVueWNvZGU7XG50cnkge1xuICBwdW55Y29kZSA9IHJlcXVpcmUoJ3B1bnljb2RlJyk7XG59IGNhdGNoKGUpIHtcbiAgY29uc29sZS53YXJuKFwidG91Z2gtY29va2llOiBjYW4ndCBsb2FkIHB1bnljb2RlOyB3b24ndCB1c2UgcHVueWNvZGUgZm9yIGRvbWFpbiBub3JtYWxpemF0aW9uXCIpO1xufVxuXG4vLyBGcm9tIFJGQzYyNjUgUzQuMS4xXG4vLyBub3RlIHRoYXQgaXQgZXhjbHVkZXMgXFx4M0IgXCI7XCJcbnZhciBDT09LSUVfT0NURVRTID0gL15bXFx4MjFcXHgyMy1cXHgyQlxceDJELVxceDNBXFx4M0MtXFx4NUJcXHg1RC1cXHg3RV0rJC87XG5cbnZhciBDT05UUk9MX0NIQVJTID0gL1tcXHgwMC1cXHgxRl0vO1xuXG4vLyBGcm9tIENocm9taXVtIC8vICdcXHInLCAnXFxuJyBhbmQgJ1xcMCcgc2hvdWxkIGJlIHRyZWF0ZWQgYXMgYSB0ZXJtaW5hdG9yIGluXG4vLyB0aGUgXCJyZWxheGVkXCIgbW9kZSwgc2VlOlxuLy8gaHR0cHM6Ly9naXRodWIuY29tL0Nocm9taXVtV2ViQXBwcy9jaHJvbWl1bS9ibG9iL2IzZDNiNGRhOGJiOTRjMWIyZTA2MTYwMGRmMTA2ZDU5MGZkYTM2MjAvbmV0L2Nvb2tpZXMvcGFyc2VkX2Nvb2tpZS5jYyNMNjBcbnZhciBURVJNSU5BVE9SUyA9IFsnXFxuJywgJ1xccicsICdcXDAnXTtcblxuLy8gUkZDNjI2NSBTNC4xLjEgZGVmaW5lcyBwYXRoIHZhbHVlIGFzICdhbnkgQ0hBUiBleGNlcHQgQ1RMcyBvciBcIjtcIidcbi8vIE5vdGUgJzsnIGlzIFxceDNCXG52YXIgUEFUSF9WQUxVRSA9IC9bXFx4MjAtXFx4M0FcXHgzQy1cXHg3RV0rLztcblxuLy8gZGF0ZS10aW1lIHBhcnNpbmcgY29uc3RhbnRzIChSRkM2MjY1IFM1LjEuMSlcblxudmFyIERBVEVfREVMSU0gPSAvW1xceDA5XFx4MjAtXFx4MkZcXHgzQi1cXHg0MFxceDVCLVxceDYwXFx4N0ItXFx4N0VdLztcblxudmFyIE1PTlRIX1RPX05VTSA9IHtcbiAgamFuOjAsIGZlYjoxLCBtYXI6MiwgYXByOjMsIG1heTo0LCBqdW46NSxcbiAganVsOjYsIGF1Zzo3LCBzZXA6OCwgb2N0OjksIG5vdjoxMCwgZGVjOjExXG59O1xudmFyIE5VTV9UT19NT05USCA9IFtcbiAgJ0phbicsJ0ZlYicsJ01hcicsJ0FwcicsJ01heScsJ0p1bicsJ0p1bCcsJ0F1ZycsJ1NlcCcsJ09jdCcsJ05vdicsJ0RlYydcbl07XG52YXIgTlVNX1RPX0RBWSA9IFtcbiAgJ1N1bicsJ01vbicsJ1R1ZScsJ1dlZCcsJ1RodScsJ0ZyaScsJ1NhdCdcbl07XG5cbnZhciBNQVhfVElNRSA9IDIxNDc0ODM2NDcwMDA7IC8vIDMxLWJpdCBtYXhcbnZhciBNSU5fVElNRSA9IDA7IC8vIDMxLWJpdCBtaW5cblxuLypcbiAqIFBhcnNlcyBhIE5hdHVyYWwgbnVtYmVyIChpLmUuLCBub24tbmVnYXRpdmUgaW50ZWdlcikgd2l0aCBlaXRoZXIgdGhlXG4gKiAgICA8bWluPio8bWF4PkRJR0lUICggbm9uLWRpZ2l0ICpPQ1RFVCApXG4gKiBvclxuICogICAgPG1pbj4qPG1heD5ESUdJVFxuICogZ3JhbW1hciAoUkZDNjI2NSBTNS4xLjEpLlxuICpcbiAqIFRoZSBcInRyYWlsaW5nT0tcIiBib29sZWFuIGNvbnRyb2xzIGlmIHRoZSBncmFtbWFyIGFjY2VwdHMgYVxuICogXCIoIG5vbi1kaWdpdCAqT0NURVQgKVwiIHRyYWlsZXIuXG4gKi9cbmZ1bmN0aW9uIHBhcnNlRGlnaXRzKHRva2VuLCBtaW5EaWdpdHMsIG1heERpZ2l0cywgdHJhaWxpbmdPSykge1xuICB2YXIgY291bnQgPSAwO1xuICB3aGlsZSAoY291bnQgPCB0b2tlbi5sZW5ndGgpIHtcbiAgICB2YXIgYyA9IHRva2VuLmNoYXJDb2RlQXQoY291bnQpO1xuICAgIC8vIFwibm9uLWRpZ2l0ID0gJXgwMC0yRiAvICV4M0EtRkZcIlxuICAgIGlmIChjIDw9IDB4MkYgfHwgYyA+PSAweDNBKSB7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgY291bnQrKztcbiAgfVxuXG4gIC8vIGNvbnN0cmFpbiB0byBhIG1pbmltdW0gYW5kIG1heGltdW0gbnVtYmVyIG9mIGRpZ2l0cy5cbiAgaWYgKGNvdW50IDwgbWluRGlnaXRzIHx8IGNvdW50ID4gbWF4RGlnaXRzKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBpZiAoIXRyYWlsaW5nT0sgJiYgY291bnQgIT0gdG9rZW4ubGVuZ3RoKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICByZXR1cm4gcGFyc2VJbnQodG9rZW4uc3Vic3RyKDAsY291bnQpLCAxMCk7XG59XG5cbmZ1bmN0aW9uIHBhcnNlVGltZSh0b2tlbikge1xuICB2YXIgcGFydHMgPSB0b2tlbi5zcGxpdCgnOicpO1xuICB2YXIgcmVzdWx0ID0gWzAsMCwwXTtcblxuICAvKiBSRjYyNTYgUzUuMS4xOlxuICAgKiAgICAgIHRpbWUgICAgICAgICAgICA9IGhtcy10aW1lICggbm9uLWRpZ2l0ICpPQ1RFVCApXG4gICAqICAgICAgaG1zLXRpbWUgICAgICAgID0gdGltZS1maWVsZCBcIjpcIiB0aW1lLWZpZWxkIFwiOlwiIHRpbWUtZmllbGRcbiAgICogICAgICB0aW1lLWZpZWxkICAgICAgPSAxKjJESUdJVFxuICAgKi9cblxuICBpZiAocGFydHMubGVuZ3RoICE9PSAzKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBmb3IgKHZhciBpID0gMDsgaSA8IDM7IGkrKykge1xuICAgIC8vIFwidGltZS1maWVsZFwiIG11c3QgYmUgc3RyaWN0bHkgXCIxKjJESUdJVFwiLCBIT1dFVkVSLCBcImhtcy10aW1lXCIgY2FuIGJlXG4gICAgLy8gZm9sbG93ZWQgYnkgXCIoIG5vbi1kaWdpdCAqT0NURVQgKVwiIHNvIHRoZXJlZm9yZSB0aGUgbGFzdCB0aW1lLWZpZWxkIGNhblxuICAgIC8vIGhhdmUgYSB0cmFpbGVyXG4gICAgdmFyIHRyYWlsaW5nT0sgPSAoaSA9PSAyKTtcbiAgICB2YXIgbnVtID0gcGFyc2VEaWdpdHMocGFydHNbaV0sIDEsIDIsIHRyYWlsaW5nT0spO1xuICAgIGlmIChudW0gPT09IG51bGwpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXN1bHRbaV0gPSBudW07XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiBwYXJzZU1vbnRoKHRva2VuKSB7XG4gIHRva2VuID0gU3RyaW5nKHRva2VuKS5zdWJzdHIoMCwzKS50b0xvd2VyQ2FzZSgpO1xuICB2YXIgbnVtID0gTU9OVEhfVE9fTlVNW3Rva2VuXTtcbiAgcmV0dXJuIG51bSA+PSAwID8gbnVtIDogbnVsbDtcbn1cblxuLypcbiAqIFJGQzYyNjUgUzUuMS4xIGRhdGUgcGFyc2VyIChzZWUgUkZDIGZvciBmdWxsIGdyYW1tYXIpXG4gKi9cbmZ1bmN0aW9uIHBhcnNlRGF0ZShzdHIpIHtcbiAgaWYgKCFzdHIpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICAvKiBSRkM2MjY1IFM1LjEuMTpcbiAgICogMi4gUHJvY2VzcyBlYWNoIGRhdGUtdG9rZW4gc2VxdWVudGlhbGx5IGluIHRoZSBvcmRlciB0aGUgZGF0ZS10b2tlbnNcbiAgICogYXBwZWFyIGluIHRoZSBjb29raWUtZGF0ZVxuICAgKi9cbiAgdmFyIHRva2VucyA9IHN0ci5zcGxpdChEQVRFX0RFTElNKTtcbiAgaWYgKCF0b2tlbnMpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICB2YXIgaG91ciA9IG51bGw7XG4gIHZhciBtaW51dGUgPSBudWxsO1xuICB2YXIgc2Vjb25kID0gbnVsbDtcbiAgdmFyIGRheU9mTW9udGggPSBudWxsO1xuICB2YXIgbW9udGggPSBudWxsO1xuICB2YXIgeWVhciA9IG51bGw7XG5cbiAgZm9yICh2YXIgaT0wOyBpPHRva2Vucy5sZW5ndGg7IGkrKykge1xuICAgIHZhciB0b2tlbiA9IHRva2Vuc1tpXS50cmltKCk7XG4gICAgaWYgKCF0b2tlbi5sZW5ndGgpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIHZhciByZXN1bHQ7XG5cbiAgICAvKiAyLjEuIElmIHRoZSBmb3VuZC10aW1lIGZsYWcgaXMgbm90IHNldCBhbmQgdGhlIHRva2VuIG1hdGNoZXMgdGhlIHRpbWVcbiAgICAgKiBwcm9kdWN0aW9uLCBzZXQgdGhlIGZvdW5kLXRpbWUgZmxhZyBhbmQgc2V0IHRoZSBob3VyLSB2YWx1ZSxcbiAgICAgKiBtaW51dGUtdmFsdWUsIGFuZCBzZWNvbmQtdmFsdWUgdG8gdGhlIG51bWJlcnMgZGVub3RlZCBieSB0aGUgZGlnaXRzIGluXG4gICAgICogdGhlIGRhdGUtdG9rZW4sIHJlc3BlY3RpdmVseS4gIFNraXAgdGhlIHJlbWFpbmluZyBzdWItc3RlcHMgYW5kIGNvbnRpbnVlXG4gICAgICogdG8gdGhlIG5leHQgZGF0ZS10b2tlbi5cbiAgICAgKi9cbiAgICBpZiAoc2Vjb25kID09PSBudWxsKSB7XG4gICAgICByZXN1bHQgPSBwYXJzZVRpbWUodG9rZW4pO1xuICAgICAgaWYgKHJlc3VsdCkge1xuICAgICAgICBob3VyID0gcmVzdWx0WzBdO1xuICAgICAgICBtaW51dGUgPSByZXN1bHRbMV07XG4gICAgICAgIHNlY29uZCA9IHJlc3VsdFsyXTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyogMi4yLiBJZiB0aGUgZm91bmQtZGF5LW9mLW1vbnRoIGZsYWcgaXMgbm90IHNldCBhbmQgdGhlIGRhdGUtdG9rZW4gbWF0Y2hlc1xuICAgICAqIHRoZSBkYXktb2YtbW9udGggcHJvZHVjdGlvbiwgc2V0IHRoZSBmb3VuZC1kYXktb2YtIG1vbnRoIGZsYWcgYW5kIHNldFxuICAgICAqIHRoZSBkYXktb2YtbW9udGgtdmFsdWUgdG8gdGhlIG51bWJlciBkZW5vdGVkIGJ5IHRoZSBkYXRlLXRva2VuLiAgU2tpcFxuICAgICAqIHRoZSByZW1haW5pbmcgc3ViLXN0ZXBzIGFuZCBjb250aW51ZSB0byB0aGUgbmV4dCBkYXRlLXRva2VuLlxuICAgICAqL1xuICAgIGlmIChkYXlPZk1vbnRoID09PSBudWxsKSB7XG4gICAgICAvLyBcImRheS1vZi1tb250aCA9IDEqMkRJR0lUICggbm9uLWRpZ2l0ICpPQ1RFVCApXCJcbiAgICAgIHJlc3VsdCA9IHBhcnNlRGlnaXRzKHRva2VuLCAxLCAyLCB0cnVlKTtcbiAgICAgIGlmIChyZXN1bHQgIT09IG51bGwpIHtcbiAgICAgICAgZGF5T2ZNb250aCA9IHJlc3VsdDtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyogMi4zLiBJZiB0aGUgZm91bmQtbW9udGggZmxhZyBpcyBub3Qgc2V0IGFuZCB0aGUgZGF0ZS10b2tlbiBtYXRjaGVzIHRoZVxuICAgICAqIG1vbnRoIHByb2R1Y3Rpb24sIHNldCB0aGUgZm91bmQtbW9udGggZmxhZyBhbmQgc2V0IHRoZSBtb250aC12YWx1ZSB0b1xuICAgICAqIHRoZSBtb250aCBkZW5vdGVkIGJ5IHRoZSBkYXRlLXRva2VuLiAgU2tpcCB0aGUgcmVtYWluaW5nIHN1Yi1zdGVwcyBhbmRcbiAgICAgKiBjb250aW51ZSB0byB0aGUgbmV4dCBkYXRlLXRva2VuLlxuICAgICAqL1xuICAgIGlmIChtb250aCA9PT0gbnVsbCkge1xuICAgICAgcmVzdWx0ID0gcGFyc2VNb250aCh0b2tlbik7XG4gICAgICBpZiAocmVzdWx0ICE9PSBudWxsKSB7XG4gICAgICAgIG1vbnRoID0gcmVzdWx0O1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKiAyLjQuIElmIHRoZSBmb3VuZC15ZWFyIGZsYWcgaXMgbm90IHNldCBhbmQgdGhlIGRhdGUtdG9rZW4gbWF0Y2hlcyB0aGVcbiAgICAgKiB5ZWFyIHByb2R1Y3Rpb24sIHNldCB0aGUgZm91bmQteWVhciBmbGFnIGFuZCBzZXQgdGhlIHllYXItdmFsdWUgdG8gdGhlXG4gICAgICogbnVtYmVyIGRlbm90ZWQgYnkgdGhlIGRhdGUtdG9rZW4uICBTa2lwIHRoZSByZW1haW5pbmcgc3ViLXN0ZXBzIGFuZFxuICAgICAqIGNvbnRpbnVlIHRvIHRoZSBuZXh0IGRhdGUtdG9rZW4uXG4gICAgICovXG4gICAgaWYgKHllYXIgPT09IG51bGwpIHtcbiAgICAgIC8vIFwieWVhciA9IDIqNERJR0lUICggbm9uLWRpZ2l0ICpPQ1RFVCApXCJcbiAgICAgIHJlc3VsdCA9IHBhcnNlRGlnaXRzKHRva2VuLCAyLCA0LCB0cnVlKTtcbiAgICAgIGlmIChyZXN1bHQgIT09IG51bGwpIHtcbiAgICAgICAgeWVhciA9IHJlc3VsdDtcbiAgICAgICAgLyogRnJvbSBTNS4xLjE6XG4gICAgICAgICAqIDMuICBJZiB0aGUgeWVhci12YWx1ZSBpcyBncmVhdGVyIHRoYW4gb3IgZXF1YWwgdG8gNzAgYW5kIGxlc3NcbiAgICAgICAgICogdGhhbiBvciBlcXVhbCB0byA5OSwgaW5jcmVtZW50IHRoZSB5ZWFyLXZhbHVlIGJ5IDE5MDAuXG4gICAgICAgICAqIDQuICBJZiB0aGUgeWVhci12YWx1ZSBpcyBncmVhdGVyIHRoYW4gb3IgZXF1YWwgdG8gMCBhbmQgbGVzc1xuICAgICAgICAgKiB0aGFuIG9yIGVxdWFsIHRvIDY5LCBpbmNyZW1lbnQgdGhlIHllYXItdmFsdWUgYnkgMjAwMC5cbiAgICAgICAgICovXG4gICAgICAgIGlmICh5ZWFyID49IDcwICYmIHllYXIgPD0gOTkpIHtcbiAgICAgICAgICB5ZWFyICs9IDE5MDA7XG4gICAgICAgIH0gZWxzZSBpZiAoeWVhciA+PSAwICYmIHllYXIgPD0gNjkpIHtcbiAgICAgICAgICB5ZWFyICs9IDIwMDA7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKiBSRkMgNjI2NSBTNS4xLjFcbiAgICogXCI1LiBBYm9ydCB0aGVzZSBzdGVwcyBhbmQgZmFpbCB0byBwYXJzZSB0aGUgY29va2llLWRhdGUgaWY6XG4gICAqICAgICAqICBhdCBsZWFzdCBvbmUgb2YgdGhlIGZvdW5kLWRheS1vZi1tb250aCwgZm91bmQtbW9udGgsIGZvdW5kLVxuICAgKiAgICAgICAgeWVhciwgb3IgZm91bmQtdGltZSBmbGFncyBpcyBub3Qgc2V0LFxuICAgKiAgICAgKiAgdGhlIGRheS1vZi1tb250aC12YWx1ZSBpcyBsZXNzIHRoYW4gMSBvciBncmVhdGVyIHRoYW4gMzEsXG4gICAqICAgICAqICB0aGUgeWVhci12YWx1ZSBpcyBsZXNzIHRoYW4gMTYwMSxcbiAgICogICAgICogIHRoZSBob3VyLXZhbHVlIGlzIGdyZWF0ZXIgdGhhbiAyMyxcbiAgICogICAgICogIHRoZSBtaW51dGUtdmFsdWUgaXMgZ3JlYXRlciB0aGFuIDU5LCBvclxuICAgKiAgICAgKiAgdGhlIHNlY29uZC12YWx1ZSBpcyBncmVhdGVyIHRoYW4gNTkuXG4gICAqICAgICAoTm90ZSB0aGF0IGxlYXAgc2Vjb25kcyBjYW5ub3QgYmUgcmVwcmVzZW50ZWQgaW4gdGhpcyBzeW50YXguKVwiXG4gICAqXG4gICAqIFNvLCBpbiBvcmRlciBhcyBhYm92ZTpcbiAgICovXG4gIGlmIChcbiAgICBkYXlPZk1vbnRoID09PSBudWxsIHx8IG1vbnRoID09PSBudWxsIHx8IHllYXIgPT09IG51bGwgfHwgc2Vjb25kID09PSBudWxsIHx8XG4gICAgZGF5T2ZNb250aCA8IDEgfHwgZGF5T2ZNb250aCA+IDMxIHx8XG4gICAgeWVhciA8IDE2MDEgfHxcbiAgICBob3VyID4gMjMgfHxcbiAgICBtaW51dGUgPiA1OSB8fFxuICAgIHNlY29uZCA+IDU5XG4gICkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHJldHVybiBuZXcgRGF0ZShEYXRlLlVUQyh5ZWFyLCBtb250aCwgZGF5T2ZNb250aCwgaG91ciwgbWludXRlLCBzZWNvbmQpKTtcbn1cblxuZnVuY3Rpb24gZm9ybWF0RGF0ZShkYXRlKSB7XG4gIHZhciBkID0gZGF0ZS5nZXRVVENEYXRlKCk7IGQgPSBkID49IDEwID8gZCA6ICcwJytkO1xuICB2YXIgaCA9IGRhdGUuZ2V0VVRDSG91cnMoKTsgaCA9IGggPj0gMTAgPyBoIDogJzAnK2g7XG4gIHZhciBtID0gZGF0ZS5nZXRVVENNaW51dGVzKCk7IG0gPSBtID49IDEwID8gbSA6ICcwJyttO1xuICB2YXIgcyA9IGRhdGUuZ2V0VVRDU2Vjb25kcygpOyBzID0gcyA+PSAxMCA/IHMgOiAnMCcrcztcbiAgcmV0dXJuIE5VTV9UT19EQVlbZGF0ZS5nZXRVVENEYXkoKV0gKyAnLCAnICtcbiAgICBkKycgJysgTlVNX1RPX01PTlRIW2RhdGUuZ2V0VVRDTW9udGgoKV0gKycgJysgZGF0ZS5nZXRVVENGdWxsWWVhcigpICsnICcrXG4gICAgaCsnOicrbSsnOicrcysnIEdNVCc7XG59XG5cbi8vIFM1LjEuMiBDYW5vbmljYWxpemVkIEhvc3QgTmFtZXNcbmZ1bmN0aW9uIGNhbm9uaWNhbERvbWFpbihzdHIpIHtcbiAgaWYgKHN0ciA9PSBudWxsKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgc3RyID0gc3RyLnRyaW0oKS5yZXBsYWNlKC9eXFwuLywnJyk7IC8vIFM0LjEuMi4zICYgUzUuMi4zOiBpZ25vcmUgbGVhZGluZyAuXG5cbiAgLy8gY29udmVydCB0byBJRE4gaWYgYW55IG5vbi1BU0NJSSBjaGFyYWN0ZXJzXG4gIGlmIChwdW55Y29kZSAmJiAvW15cXHUwMDAxLVxcdTAwN2ZdLy50ZXN0KHN0cikpIHtcbiAgICBzdHIgPSBwdW55Y29kZS50b0FTQ0lJKHN0cik7XG4gIH1cblxuICByZXR1cm4gc3RyLnRvTG93ZXJDYXNlKCk7XG59XG5cbi8vIFM1LjEuMyBEb21haW4gTWF0Y2hpbmdcbmZ1bmN0aW9uIGRvbWFpbk1hdGNoKHN0ciwgZG9tU3RyLCBjYW5vbmljYWxpemUpIHtcbiAgaWYgKHN0ciA9PSBudWxsIHx8IGRvbVN0ciA9PSBudWxsKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgaWYgKGNhbm9uaWNhbGl6ZSAhPT0gZmFsc2UpIHtcbiAgICBzdHIgPSBjYW5vbmljYWxEb21haW4oc3RyKTtcbiAgICBkb21TdHIgPSBjYW5vbmljYWxEb21haW4oZG9tU3RyKTtcbiAgfVxuXG4gIC8qXG4gICAqIFwiVGhlIGRvbWFpbiBzdHJpbmcgYW5kIHRoZSBzdHJpbmcgYXJlIGlkZW50aWNhbC4gKE5vdGUgdGhhdCBib3RoIHRoZVxuICAgKiBkb21haW4gc3RyaW5nIGFuZCB0aGUgc3RyaW5nIHdpbGwgaGF2ZSBiZWVuIGNhbm9uaWNhbGl6ZWQgdG8gbG93ZXIgY2FzZSBhdFxuICAgKiB0aGlzIHBvaW50KVwiXG4gICAqL1xuICBpZiAoc3RyID09IGRvbVN0cikge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLyogXCJBbGwgb2YgdGhlIGZvbGxvd2luZyBbdGhyZWVdIGNvbmRpdGlvbnMgaG9sZDpcIiAob3JkZXIgYWRqdXN0ZWQgZnJvbSB0aGUgUkZDKSAqL1xuXG4gIC8qIFwiKiBUaGUgc3RyaW5nIGlzIGEgaG9zdCBuYW1lIChpLmUuLCBub3QgYW4gSVAgYWRkcmVzcykuXCIgKi9cbiAgaWYgKG5ldC5pc0lQKHN0cikpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKiBcIiogVGhlIGRvbWFpbiBzdHJpbmcgaXMgYSBzdWZmaXggb2YgdGhlIHN0cmluZ1wiICovXG4gIHZhciBpZHggPSBzdHIuaW5kZXhPZihkb21TdHIpO1xuICBpZiAoaWR4IDw9IDApIHtcbiAgICByZXR1cm4gZmFsc2U7IC8vIGl0J3MgYSBub24tbWF0Y2ggKC0xKSBvciBwcmVmaXggKDApXG4gIH1cblxuICAvLyBlLmcgXCJhLmIuY1wiLmluZGV4T2YoXCJiLmNcIikgPT09IDJcbiAgLy8gNSA9PT0gMysyXG4gIGlmIChzdHIubGVuZ3RoICE9PSBkb21TdHIubGVuZ3RoICsgaWR4KSB7IC8vIGl0J3Mgbm90IGEgc3VmZml4XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLyogXCIqIFRoZSBsYXN0IGNoYXJhY3RlciBvZiB0aGUgc3RyaW5nIHRoYXQgaXMgbm90IGluY2x1ZGVkIGluIHRoZSBkb21haW5cbiAgKiBzdHJpbmcgaXMgYSAleDJFIChcIi5cIikgY2hhcmFjdGVyLlwiICovXG4gIGlmIChzdHIuc3Vic3RyKGlkeC0xLDEpICE9PSAnLicpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuXG4vLyBSRkM2MjY1IFM1LjEuNCBQYXRocyBhbmQgUGF0aC1NYXRjaFxuXG4vKlxuICogXCJUaGUgdXNlciBhZ2VudCBNVVNUIHVzZSBhbiBhbGdvcml0aG0gZXF1aXZhbGVudCB0byB0aGUgZm9sbG93aW5nIGFsZ29yaXRobVxuICogdG8gY29tcHV0ZSB0aGUgZGVmYXVsdC1wYXRoIG9mIGEgY29va2llOlwiXG4gKlxuICogQXNzdW1wdGlvbjogdGhlIHBhdGggKGFuZCBub3QgcXVlcnkgcGFydCBvciBhYnNvbHV0ZSB1cmkpIGlzIHBhc3NlZCBpbi5cbiAqL1xuZnVuY3Rpb24gZGVmYXVsdFBhdGgocGF0aCkge1xuICAvLyBcIjIuIElmIHRoZSB1cmktcGF0aCBpcyBlbXB0eSBvciBpZiB0aGUgZmlyc3QgY2hhcmFjdGVyIG9mIHRoZSB1cmktcGF0aCBpcyBub3RcbiAgLy8gYSAleDJGIChcIi9cIikgY2hhcmFjdGVyLCBvdXRwdXQgJXgyRiAoXCIvXCIpIGFuZCBza2lwIHRoZSByZW1haW5pbmcgc3RlcHMuXG4gIGlmICghcGF0aCB8fCBwYXRoLnN1YnN0cigwLDEpICE9PSBcIi9cIikge1xuICAgIHJldHVybiBcIi9cIjtcbiAgfVxuXG4gIC8vIFwiMy4gSWYgdGhlIHVyaS1wYXRoIGNvbnRhaW5zIG5vIG1vcmUgdGhhbiBvbmUgJXgyRiAoXCIvXCIpIGNoYXJhY3Rlciwgb3V0cHV0XG4gIC8vICV4MkYgKFwiL1wiKSBhbmQgc2tpcCB0aGUgcmVtYWluaW5nIHN0ZXAuXCJcbiAgaWYgKHBhdGggPT09IFwiL1wiKSB7XG4gICAgcmV0dXJuIHBhdGg7XG4gIH1cblxuICB2YXIgcmlnaHRTbGFzaCA9IHBhdGgubGFzdEluZGV4T2YoXCIvXCIpO1xuICBpZiAocmlnaHRTbGFzaCA9PT0gMCkge1xuICAgIHJldHVybiBcIi9cIjtcbiAgfVxuXG4gIC8vIFwiNC4gT3V0cHV0IHRoZSBjaGFyYWN0ZXJzIG9mIHRoZSB1cmktcGF0aCBmcm9tIHRoZSBmaXJzdCBjaGFyYWN0ZXIgdXAgdG8sXG4gIC8vIGJ1dCBub3QgaW5jbHVkaW5nLCB0aGUgcmlnaHQtbW9zdCAleDJGIChcIi9cIikuXCJcbiAgcmV0dXJuIHBhdGguc2xpY2UoMCwgcmlnaHRTbGFzaCk7XG59XG5cbmZ1bmN0aW9uIHRyaW1UZXJtaW5hdG9yKHN0cikge1xuICBmb3IgKHZhciB0ID0gMDsgdCA8IFRFUk1JTkFUT1JTLmxlbmd0aDsgdCsrKSB7XG4gICAgdmFyIHRlcm1pbmF0b3JJZHggPSBzdHIuaW5kZXhPZihURVJNSU5BVE9SU1t0XSk7XG4gICAgaWYgKHRlcm1pbmF0b3JJZHggIT09IC0xKSB7XG4gICAgICBzdHIgPSBzdHIuc3Vic3RyKDAsdGVybWluYXRvcklkeCk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHN0cjtcbn1cblxuZnVuY3Rpb24gcGFyc2VDb29raWVQYWlyKGNvb2tpZVBhaXIsIGxvb3NlTW9kZSkge1xuICBjb29raWVQYWlyID0gdHJpbVRlcm1pbmF0b3IoY29va2llUGFpcik7XG5cbiAgdmFyIGZpcnN0RXEgPSBjb29raWVQYWlyLmluZGV4T2YoJz0nKTtcbiAgaWYgKGxvb3NlTW9kZSkge1xuICAgIGlmIChmaXJzdEVxID09PSAwKSB7IC8vICc9JyBpcyBpbW1lZGlhdGVseSBhdCBzdGFydFxuICAgICAgY29va2llUGFpciA9IGNvb2tpZVBhaXIuc3Vic3RyKDEpO1xuICAgICAgZmlyc3RFcSA9IGNvb2tpZVBhaXIuaW5kZXhPZignPScpOyAvLyBtaWdodCBzdGlsbCBuZWVkIHRvIHNwbGl0IG9uICc9J1xuICAgIH1cbiAgfSBlbHNlIHsgLy8gbm9uLWxvb3NlIG1vZGVcbiAgICBpZiAoZmlyc3RFcSA8PSAwKSB7IC8vIG5vICc9JyBvciBpcyBhdCBzdGFydFxuICAgICAgcmV0dXJuOyAvLyBuZWVkcyB0byBoYXZlIG5vbi1lbXB0eSBcImNvb2tpZS1uYW1lXCJcbiAgICB9XG4gIH1cblxuICB2YXIgY29va2llTmFtZSwgY29va2llVmFsdWU7XG4gIGlmIChmaXJzdEVxIDw9IDApIHtcbiAgICBjb29raWVOYW1lID0gXCJcIjtcbiAgICBjb29raWVWYWx1ZSA9IGNvb2tpZVBhaXIudHJpbSgpO1xuICB9IGVsc2Uge1xuICAgIGNvb2tpZU5hbWUgPSBjb29raWVQYWlyLnN1YnN0cigwLCBmaXJzdEVxKS50cmltKCk7XG4gICAgY29va2llVmFsdWUgPSBjb29raWVQYWlyLnN1YnN0cihmaXJzdEVxKzEpLnRyaW0oKTtcbiAgfVxuXG4gIGlmIChDT05UUk9MX0NIQVJTLnRlc3QoY29va2llTmFtZSkgfHwgQ09OVFJPTF9DSEFSUy50ZXN0KGNvb2tpZVZhbHVlKSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHZhciBjID0gbmV3IENvb2tpZSgpO1xuICBjLmtleSA9IGNvb2tpZU5hbWU7XG4gIGMudmFsdWUgPSBjb29raWVWYWx1ZTtcbiAgcmV0dXJuIGM7XG59XG5cbmZ1bmN0aW9uIHBhcnNlKHN0ciwgb3B0aW9ucykge1xuICBpZiAoIW9wdGlvbnMgfHwgdHlwZW9mIG9wdGlvbnMgIT09ICdvYmplY3QnKSB7XG4gICAgb3B0aW9ucyA9IHt9O1xuICB9XG4gIHN0ciA9IHN0ci50cmltKCk7XG5cbiAgLy8gV2UgdXNlIGEgcmVnZXggdG8gcGFyc2UgdGhlIFwibmFtZS12YWx1ZS1wYWlyXCIgcGFydCBvZiBTNS4yXG4gIHZhciBmaXJzdFNlbWkgPSBzdHIuaW5kZXhPZignOycpOyAvLyBTNS4yIHN0ZXAgMVxuICB2YXIgY29va2llUGFpciA9IChmaXJzdFNlbWkgPT09IC0xKSA/IHN0ciA6IHN0ci5zdWJzdHIoMCwgZmlyc3RTZW1pKTtcbiAgdmFyIGMgPSBwYXJzZUNvb2tpZVBhaXIoY29va2llUGFpciwgISFvcHRpb25zLmxvb3NlKTtcbiAgaWYgKCFjKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKGZpcnN0U2VtaSA9PT0gLTEpIHtcbiAgICByZXR1cm4gYztcbiAgfVxuXG4gIC8vIFM1LjIuMyBcInVucGFyc2VkLWF0dHJpYnV0ZXMgY29uc2lzdCBvZiB0aGUgcmVtYWluZGVyIG9mIHRoZSBzZXQtY29va2llLXN0cmluZ1xuICAvLyAoaW5jbHVkaW5nIHRoZSAleDNCIChcIjtcIikgaW4gcXVlc3Rpb24pLlwiIHBsdXMgbGF0ZXIgb24gaW4gdGhlIHNhbWUgc2VjdGlvblxuICAvLyBcImRpc2NhcmQgdGhlIGZpcnN0IFwiO1wiIGFuZCB0cmltXCIuXG4gIHZhciB1bnBhcnNlZCA9IHN0ci5zbGljZShmaXJzdFNlbWkgKyAxKS50cmltKCk7XG5cbiAgLy8gXCJJZiB0aGUgdW5wYXJzZWQtYXR0cmlidXRlcyBzdHJpbmcgaXMgZW1wdHksIHNraXAgdGhlIHJlc3Qgb2YgdGhlc2VcbiAgLy8gc3RlcHMuXCJcbiAgaWYgKHVucGFyc2VkLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBjO1xuICB9XG5cbiAgLypcbiAgICogUzUuMiBzYXlzIHRoYXQgd2hlbiBsb29waW5nIG92ZXIgdGhlIGl0ZW1zIFwiW3Bdcm9jZXNzIHRoZSBhdHRyaWJ1dGUtbmFtZVxuICAgKiBhbmQgYXR0cmlidXRlLXZhbHVlIGFjY29yZGluZyB0byB0aGUgcmVxdWlyZW1lbnRzIGluIHRoZSBmb2xsb3dpbmdcbiAgICogc3Vic2VjdGlvbnNcIiBmb3IgZXZlcnkgaXRlbS4gIFBsdXMsIGZvciBtYW55IG9mIHRoZSBpbmRpdmlkdWFsIGF0dHJpYnV0ZXNcbiAgICogaW4gUzUuMyBpdCBzYXlzIHRvIHVzZSB0aGUgXCJhdHRyaWJ1dGUtdmFsdWUgb2YgdGhlIGxhc3QgYXR0cmlidXRlIGluIHRoZVxuICAgKiBjb29raWUtYXR0cmlidXRlLWxpc3RcIi4gIFRoZXJlZm9yZSwgaW4gdGhpcyBpbXBsZW1lbnRhdGlvbiwgd2Ugb3ZlcndyaXRlXG4gICAqIHRoZSBwcmV2aW91cyB2YWx1ZS5cbiAgICovXG4gIHZhciBjb29raWVfYXZzID0gdW5wYXJzZWQuc3BsaXQoJzsnKTtcbiAgd2hpbGUgKGNvb2tpZV9hdnMubGVuZ3RoKSB7XG4gICAgdmFyIGF2ID0gY29va2llX2F2cy5zaGlmdCgpLnRyaW0oKTtcbiAgICBpZiAoYXYubGVuZ3RoID09PSAwKSB7IC8vIGhhcHBlbnMgaWYgXCI7O1wiIGFwcGVhcnNcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICB2YXIgYXZfc2VwID0gYXYuaW5kZXhPZignPScpO1xuICAgIHZhciBhdl9rZXksIGF2X3ZhbHVlO1xuXG4gICAgaWYgKGF2X3NlcCA9PT0gLTEpIHtcbiAgICAgIGF2X2tleSA9IGF2O1xuICAgICAgYXZfdmFsdWUgPSBudWxsO1xuICAgIH0gZWxzZSB7XG4gICAgICBhdl9rZXkgPSBhdi5zdWJzdHIoMCxhdl9zZXApO1xuICAgICAgYXZfdmFsdWUgPSBhdi5zdWJzdHIoYXZfc2VwKzEpO1xuICAgIH1cblxuICAgIGF2X2tleSA9IGF2X2tleS50cmltKCkudG9Mb3dlckNhc2UoKTtcblxuICAgIGlmIChhdl92YWx1ZSkge1xuICAgICAgYXZfdmFsdWUgPSBhdl92YWx1ZS50cmltKCk7XG4gICAgfVxuXG4gICAgc3dpdGNoKGF2X2tleSkge1xuICAgIGNhc2UgJ2V4cGlyZXMnOiAvLyBTNS4yLjFcbiAgICAgIGlmIChhdl92YWx1ZSkge1xuICAgICAgICB2YXIgZXhwID0gcGFyc2VEYXRlKGF2X3ZhbHVlKTtcbiAgICAgICAgLy8gXCJJZiB0aGUgYXR0cmlidXRlLXZhbHVlIGZhaWxlZCB0byBwYXJzZSBhcyBhIGNvb2tpZSBkYXRlLCBpZ25vcmUgdGhlXG4gICAgICAgIC8vIGNvb2tpZS1hdi5cIlxuICAgICAgICBpZiAoZXhwKSB7XG4gICAgICAgICAgLy8gb3ZlciBhbmQgdW5kZXJmbG93IG5vdCByZWFsaXN0aWNhbGx5IGEgY29uY2VybjogVjgncyBnZXRUaW1lKCkgc2VlbXMgdG9cbiAgICAgICAgICAvLyBzdG9yZSBzb21ldGhpbmcgbGFyZ2VyIHRoYW4gYSAzMi1iaXQgdGltZV90IChldmVuIHdpdGggMzItYml0IG5vZGUpXG4gICAgICAgICAgYy5leHBpcmVzID0gZXhwO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgJ21heC1hZ2UnOiAvLyBTNS4yLjJcbiAgICAgIGlmIChhdl92YWx1ZSkge1xuICAgICAgICAvLyBcIklmIHRoZSBmaXJzdCBjaGFyYWN0ZXIgb2YgdGhlIGF0dHJpYnV0ZS12YWx1ZSBpcyBub3QgYSBESUdJVCBvciBhIFwiLVwiXG4gICAgICAgIC8vIGNoYXJhY3RlciAuLi5bb3JdLi4uIElmIHRoZSByZW1haW5kZXIgb2YgYXR0cmlidXRlLXZhbHVlIGNvbnRhaW5zIGFcbiAgICAgICAgLy8gbm9uLURJR0lUIGNoYXJhY3RlciwgaWdub3JlIHRoZSBjb29raWUtYXYuXCJcbiAgICAgICAgaWYgKC9eLT9bMC05XSskLy50ZXN0KGF2X3ZhbHVlKSkge1xuICAgICAgICAgIHZhciBkZWx0YSA9IHBhcnNlSW50KGF2X3ZhbHVlLCAxMCk7XG4gICAgICAgICAgLy8gXCJJZiBkZWx0YS1zZWNvbmRzIGlzIGxlc3MgdGhhbiBvciBlcXVhbCB0byB6ZXJvICgwKSwgbGV0IGV4cGlyeS10aW1lXG4gICAgICAgICAgLy8gYmUgdGhlIGVhcmxpZXN0IHJlcHJlc2VudGFibGUgZGF0ZSBhbmQgdGltZS5cIlxuICAgICAgICAgIGMuc2V0TWF4QWdlKGRlbHRhKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlICdkb21haW4nOiAvLyBTNS4yLjNcbiAgICAgIC8vIFwiSWYgdGhlIGF0dHJpYnV0ZS12YWx1ZSBpcyBlbXB0eSwgdGhlIGJlaGF2aW9yIGlzIHVuZGVmaW5lZC4gIEhvd2V2ZXIsXG4gICAgICAvLyB0aGUgdXNlciBhZ2VudCBTSE9VTEQgaWdub3JlIHRoZSBjb29raWUtYXYgZW50aXJlbHkuXCJcbiAgICAgIGlmIChhdl92YWx1ZSkge1xuICAgICAgICAvLyBTNS4yLjMgXCJMZXQgY29va2llLWRvbWFpbiBiZSB0aGUgYXR0cmlidXRlLXZhbHVlIHdpdGhvdXQgdGhlIGxlYWRpbmcgJXgyRVxuICAgICAgICAvLyAoXCIuXCIpIGNoYXJhY3Rlci5cIlxuICAgICAgICB2YXIgZG9tYWluID0gYXZfdmFsdWUudHJpbSgpLnJlcGxhY2UoL15cXC4vLCAnJyk7XG4gICAgICAgIGlmIChkb21haW4pIHtcbiAgICAgICAgICAvLyBcIkNvbnZlcnQgdGhlIGNvb2tpZS1kb21haW4gdG8gbG93ZXIgY2FzZS5cIlxuICAgICAgICAgIGMuZG9tYWluID0gZG9tYWluLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSAncGF0aCc6IC8vIFM1LjIuNFxuICAgICAgLypcbiAgICAgICAqIFwiSWYgdGhlIGF0dHJpYnV0ZS12YWx1ZSBpcyBlbXB0eSBvciBpZiB0aGUgZmlyc3QgY2hhcmFjdGVyIG9mIHRoZVxuICAgICAgICogYXR0cmlidXRlLXZhbHVlIGlzIG5vdCAleDJGIChcIi9cIik6XG4gICAgICAgKiAgIExldCBjb29raWUtcGF0aCBiZSB0aGUgZGVmYXVsdC1wYXRoLlxuICAgICAgICogT3RoZXJ3aXNlOlxuICAgICAgICogICBMZXQgY29va2llLXBhdGggYmUgdGhlIGF0dHJpYnV0ZS12YWx1ZS5cIlxuICAgICAgICpcbiAgICAgICAqIFdlJ2xsIHJlcHJlc2VudCB0aGUgZGVmYXVsdC1wYXRoIGFzIG51bGwgc2luY2UgaXQgZGVwZW5kcyBvbiB0aGVcbiAgICAgICAqIGNvbnRleHQgb2YgdGhlIHBhcnNpbmcuXG4gICAgICAgKi9cbiAgICAgIGMucGF0aCA9IGF2X3ZhbHVlICYmIGF2X3ZhbHVlWzBdID09PSBcIi9cIiA/IGF2X3ZhbHVlIDogbnVsbDtcbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSAnc2VjdXJlJzogLy8gUzUuMi41XG4gICAgICAvKlxuICAgICAgICogXCJJZiB0aGUgYXR0cmlidXRlLW5hbWUgY2FzZS1pbnNlbnNpdGl2ZWx5IG1hdGNoZXMgdGhlIHN0cmluZyBcIlNlY3VyZVwiLFxuICAgICAgICogdGhlIHVzZXIgYWdlbnQgTVVTVCBhcHBlbmQgYW4gYXR0cmlidXRlIHRvIHRoZSBjb29raWUtYXR0cmlidXRlLWxpc3RcbiAgICAgICAqIHdpdGggYW4gYXR0cmlidXRlLW5hbWUgb2YgU2VjdXJlIGFuZCBhbiBlbXB0eSBhdHRyaWJ1dGUtdmFsdWUuXCJcbiAgICAgICAqL1xuICAgICAgYy5zZWN1cmUgPSB0cnVlO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlICdodHRwb25seSc6IC8vIFM1LjIuNiAtLSBlZmZlY3RpdmVseSB0aGUgc2FtZSBhcyAnc2VjdXJlJ1xuICAgICAgYy5odHRwT25seSA9IHRydWU7XG4gICAgICBicmVhaztcblxuICAgIGRlZmF1bHQ6XG4gICAgICBjLmV4dGVuc2lvbnMgPSBjLmV4dGVuc2lvbnMgfHwgW107XG4gICAgICBjLmV4dGVuc2lvbnMucHVzaChhdik7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICByZXR1cm4gYztcbn1cblxuLy8gYXZvaWQgdGhlIFY4IGRlb3B0aW1pemF0aW9uIG1vbnN0ZXIhXG5mdW5jdGlvbiBqc29uUGFyc2Uoc3RyKSB7XG4gIHZhciBvYmo7XG4gIHRyeSB7XG4gICAgb2JqID0gSlNPTi5wYXJzZShzdHIpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIGU7XG4gIH1cbiAgcmV0dXJuIG9iajtcbn1cblxuZnVuY3Rpb24gZnJvbUpTT04oc3RyKSB7XG4gIGlmICghc3RyKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICB2YXIgb2JqO1xuICBpZiAodHlwZW9mIHN0ciA9PT0gJ3N0cmluZycpIHtcbiAgICBvYmogPSBqc29uUGFyc2Uoc3RyKTtcbiAgICBpZiAob2JqIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICAvLyBhc3N1bWUgaXQncyBhbiBPYmplY3RcbiAgICBvYmogPSBzdHI7XG4gIH1cblxuICB2YXIgYyA9IG5ldyBDb29raWUoKTtcbiAgZm9yICh2YXIgaT0wOyBpPENvb2tpZS5zZXJpYWxpemFibGVQcm9wZXJ0aWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIHByb3AgPSBDb29raWUuc2VyaWFsaXphYmxlUHJvcGVydGllc1tpXTtcbiAgICBpZiAob2JqW3Byb3BdID09PSB1bmRlZmluZWQgfHxcbiAgICAgICAgb2JqW3Byb3BdID09PSBDb29raWUucHJvdG90eXBlW3Byb3BdKVxuICAgIHtcbiAgICAgIGNvbnRpbnVlOyAvLyBsZWF2ZSBhcyBwcm90b3R5cGUgZGVmYXVsdFxuICAgIH1cblxuICAgIGlmIChwcm9wID09PSAnZXhwaXJlcycgfHxcbiAgICAgICAgcHJvcCA9PT0gJ2NyZWF0aW9uJyB8fFxuICAgICAgICBwcm9wID09PSAnbGFzdEFjY2Vzc2VkJylcbiAgICB7XG4gICAgICBpZiAob2JqW3Byb3BdID09PSBudWxsKSB7XG4gICAgICAgIGNbcHJvcF0gPSBudWxsO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY1twcm9wXSA9IG9ialtwcm9wXSA9PSBcIkluZmluaXR5XCIgP1xuICAgICAgICAgIFwiSW5maW5pdHlcIiA6IG5ldyBEYXRlKG9ialtwcm9wXSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGNbcHJvcF0gPSBvYmpbcHJvcF07XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGM7XG59XG5cbi8qIFNlY3Rpb24gNS40IHBhcnQgMjpcbiAqIFwiKiAgQ29va2llcyB3aXRoIGxvbmdlciBwYXRocyBhcmUgbGlzdGVkIGJlZm9yZSBjb29raWVzIHdpdGhcbiAqICAgICBzaG9ydGVyIHBhdGhzLlxuICpcbiAqICAqICBBbW9uZyBjb29raWVzIHRoYXQgaGF2ZSBlcXVhbC1sZW5ndGggcGF0aCBmaWVsZHMsIGNvb2tpZXMgd2l0aFxuICogICAgIGVhcmxpZXIgY3JlYXRpb24tdGltZXMgYXJlIGxpc3RlZCBiZWZvcmUgY29va2llcyB3aXRoIGxhdGVyXG4gKiAgICAgY3JlYXRpb24tdGltZXMuXCJcbiAqL1xuXG5mdW5jdGlvbiBjb29raWVDb21wYXJlKGEsYikge1xuICB2YXIgY21wID0gMDtcblxuICAvLyBkZXNjZW5kaW5nIGZvciBsZW5ndGg6IGIgQ01QIGFcbiAgdmFyIGFQYXRoTGVuID0gYS5wYXRoID8gYS5wYXRoLmxlbmd0aCA6IDA7XG4gIHZhciBiUGF0aExlbiA9IGIucGF0aCA/IGIucGF0aC5sZW5ndGggOiAwO1xuICBjbXAgPSBiUGF0aExlbiAtIGFQYXRoTGVuO1xuICBpZiAoY21wICE9PSAwKSB7XG4gICAgcmV0dXJuIGNtcDtcbiAgfVxuXG4gIC8vIGFzY2VuZGluZyBmb3IgdGltZTogYSBDTVAgYlxuICB2YXIgYVRpbWUgPSBhLmNyZWF0aW9uID8gYS5jcmVhdGlvbi5nZXRUaW1lKCkgOiBNQVhfVElNRTtcbiAgdmFyIGJUaW1lID0gYi5jcmVhdGlvbiA/IGIuY3JlYXRpb24uZ2V0VGltZSgpIDogTUFYX1RJTUU7XG4gIGNtcCA9IGFUaW1lIC0gYlRpbWU7XG4gIGlmIChjbXAgIT09IDApIHtcbiAgICByZXR1cm4gY21wO1xuICB9XG5cbiAgLy8gYnJlYWsgdGllcyBmb3IgdGhlIHNhbWUgbWlsbGlzZWNvbmQgKHByZWNpc2lvbiBvZiBKYXZhU2NyaXB0J3MgY2xvY2spXG4gIGNtcCA9IGEuY3JlYXRpb25JbmRleCAtIGIuY3JlYXRpb25JbmRleDtcblxuICByZXR1cm4gY21wO1xufVxuXG4vLyBHaXZlcyB0aGUgcGVybXV0YXRpb24gb2YgYWxsIHBvc3NpYmxlIHBhdGhNYXRjaCgpZXMgb2YgYSBnaXZlbiBwYXRoLiBUaGVcbi8vIGFycmF5IGlzIGluIGxvbmdlc3QtdG8tc2hvcnRlc3Qgb3JkZXIuICBIYW5keSBmb3IgaW5kZXhpbmcuXG5mdW5jdGlvbiBwZXJtdXRlUGF0aChwYXRoKSB7XG4gIGlmIChwYXRoID09PSAnLycpIHtcbiAgICByZXR1cm4gWycvJ107XG4gIH1cbiAgaWYgKHBhdGgubGFzdEluZGV4T2YoJy8nKSA9PT0gcGF0aC5sZW5ndGgtMSkge1xuICAgIHBhdGggPSBwYXRoLnN1YnN0cigwLHBhdGgubGVuZ3RoLTEpO1xuICB9XG4gIHZhciBwZXJtdXRhdGlvbnMgPSBbcGF0aF07XG4gIHdoaWxlIChwYXRoLmxlbmd0aCA+IDEpIHtcbiAgICB2YXIgbGluZGV4ID0gcGF0aC5sYXN0SW5kZXhPZignLycpO1xuICAgIGlmIChsaW5kZXggPT09IDApIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBwYXRoID0gcGF0aC5zdWJzdHIoMCxsaW5kZXgpO1xuICAgIHBlcm11dGF0aW9ucy5wdXNoKHBhdGgpO1xuICB9XG4gIHBlcm11dGF0aW9ucy5wdXNoKCcvJyk7XG4gIHJldHVybiBwZXJtdXRhdGlvbnM7XG59XG5cbmZ1bmN0aW9uIGdldENvb2tpZUNvbnRleHQodXJsKSB7XG4gIGlmICh1cmwgaW5zdGFuY2VvZiBPYmplY3QpIHtcbiAgICByZXR1cm4gdXJsO1xuICB9XG4gIC8vIE5PVEU6IGRlY29kZVVSSSB3aWxsIHRocm93IG9uIG1hbGZvcm1lZCBVUklzIChzZWUgR0gtMzIpLlxuICAvLyBUaGVyZWZvcmUsIHdlIHdpbGwganVzdCBza2lwIGRlY29kaW5nIGZvciBzdWNoIFVSSXMuXG4gIHRyeSB7XG4gICAgdXJsID0gZGVjb2RlVVJJKHVybCk7XG4gIH1cbiAgY2F0Y2goZXJyKSB7XG4gICAgLy8gU2lsZW50bHkgc3dhbGxvdyBlcnJvclxuICB9XG5cbiAgcmV0dXJuIHVybFBhcnNlKHVybCk7XG59XG5cbmZ1bmN0aW9uIENvb2tpZShvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gIE9iamVjdC5rZXlzKG9wdGlvbnMpLmZvckVhY2goZnVuY3Rpb24ocHJvcCkge1xuICAgIGlmIChDb29raWUucHJvdG90eXBlLmhhc093blByb3BlcnR5KHByb3ApICYmXG4gICAgICAgIENvb2tpZS5wcm90b3R5cGVbcHJvcF0gIT09IG9wdGlvbnNbcHJvcF0gJiZcbiAgICAgICAgcHJvcC5zdWJzdHIoMCwxKSAhPT0gJ18nKVxuICAgIHtcbiAgICAgIHRoaXNbcHJvcF0gPSBvcHRpb25zW3Byb3BdO1xuICAgIH1cbiAgfSwgdGhpcyk7XG5cbiAgdGhpcy5jcmVhdGlvbiA9IHRoaXMuY3JlYXRpb24gfHwgbmV3IERhdGUoKTtcblxuICAvLyB1c2VkIHRvIGJyZWFrIGNyZWF0aW9uIHRpZXMgaW4gY29va2llQ29tcGFyZSgpOlxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ2NyZWF0aW9uSW5kZXgnLCB7XG4gICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICBlbnVtZXJhYmxlOiBmYWxzZSwgLy8gaW1wb3J0YW50IGZvciBhc3NlcnQuZGVlcEVxdWFsIGNoZWNrc1xuICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgIHZhbHVlOiArK0Nvb2tpZS5jb29raWVzQ3JlYXRlZFxuICB9KTtcbn1cblxuQ29va2llLmNvb2tpZXNDcmVhdGVkID0gMDsgLy8gaW5jcmVtZW50ZWQgZWFjaCB0aW1lIGEgY29va2llIGlzIGNyZWF0ZWRcblxuQ29va2llLnBhcnNlID0gcGFyc2U7XG5Db29raWUuZnJvbUpTT04gPSBmcm9tSlNPTjtcblxuQ29va2llLnByb3RvdHlwZS5rZXkgPSBcIlwiO1xuQ29va2llLnByb3RvdHlwZS52YWx1ZSA9IFwiXCI7XG5cbi8vIHRoZSBvcmRlciBpbiB3aGljaCB0aGUgUkZDIGhhcyB0aGVtOlxuQ29va2llLnByb3RvdHlwZS5leHBpcmVzID0gXCJJbmZpbml0eVwiOyAvLyBjb2VyY2VzIHRvIGxpdGVyYWwgSW5maW5pdHlcbkNvb2tpZS5wcm90b3R5cGUubWF4QWdlID0gbnVsbDsgLy8gdGFrZXMgcHJlY2VkZW5jZSBvdmVyIGV4cGlyZXMgZm9yIFRUTFxuQ29va2llLnByb3RvdHlwZS5kb21haW4gPSBudWxsO1xuQ29va2llLnByb3RvdHlwZS5wYXRoID0gbnVsbDtcbkNvb2tpZS5wcm90b3R5cGUuc2VjdXJlID0gZmFsc2U7XG5Db29raWUucHJvdG90eXBlLmh0dHBPbmx5ID0gZmFsc2U7XG5Db29raWUucHJvdG90eXBlLmV4dGVuc2lvbnMgPSBudWxsO1xuXG4vLyBzZXQgYnkgdGhlIENvb2tpZUphcjpcbkNvb2tpZS5wcm90b3R5cGUuaG9zdE9ubHkgPSBudWxsOyAvLyBib29sZWFuIHdoZW4gc2V0XG5Db29raWUucHJvdG90eXBlLnBhdGhJc0RlZmF1bHQgPSBudWxsOyAvLyBib29sZWFuIHdoZW4gc2V0XG5Db29raWUucHJvdG90eXBlLmNyZWF0aW9uID0gbnVsbDsgLy8gRGF0ZSB3aGVuIHNldDsgZGVmYXVsdGVkIGJ5IENvb2tpZS5wYXJzZVxuQ29va2llLnByb3RvdHlwZS5sYXN0QWNjZXNzZWQgPSBudWxsOyAvLyBEYXRlIHdoZW4gc2V0XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoQ29va2llLnByb3RvdHlwZSwgJ2NyZWF0aW9uSW5kZXgnLCB7XG4gIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgZW51bWVyYWJsZTogZmFsc2UsXG4gIHdyaXRhYmxlOiB0cnVlLFxuICB2YWx1ZTogMFxufSk7XG5cbkNvb2tpZS5zZXJpYWxpemFibGVQcm9wZXJ0aWVzID0gT2JqZWN0LmtleXMoQ29va2llLnByb3RvdHlwZSlcbiAgLmZpbHRlcihmdW5jdGlvbihwcm9wKSB7XG4gICAgcmV0dXJuICEoXG4gICAgICBDb29raWUucHJvdG90eXBlW3Byb3BdIGluc3RhbmNlb2YgRnVuY3Rpb24gfHxcbiAgICAgIHByb3AgPT09ICdjcmVhdGlvbkluZGV4JyB8fFxuICAgICAgcHJvcC5zdWJzdHIoMCwxKSA9PT0gJ18nXG4gICAgKTtcbiAgfSk7XG5cbkNvb2tpZS5wcm90b3R5cGUuaW5zcGVjdCA9IGZ1bmN0aW9uIGluc3BlY3QoKSB7XG4gIHZhciBub3cgPSBEYXRlLm5vdygpO1xuICByZXR1cm4gJ0Nvb2tpZT1cIicrdGhpcy50b1N0cmluZygpICtcbiAgICAnOyBob3N0T25seT0nKyh0aGlzLmhvc3RPbmx5ICE9IG51bGwgPyB0aGlzLmhvc3RPbmx5IDogJz8nKSArXG4gICAgJzsgYUFnZT0nKyh0aGlzLmxhc3RBY2Nlc3NlZCA/IChub3ctdGhpcy5sYXN0QWNjZXNzZWQuZ2V0VGltZSgpKSsnbXMnIDogJz8nKSArXG4gICAgJzsgY0FnZT0nKyh0aGlzLmNyZWF0aW9uID8gKG5vdy10aGlzLmNyZWF0aW9uLmdldFRpbWUoKSkrJ21zJyA6ICc/JykgK1xuICAgICdcIic7XG59O1xuXG4vLyBVc2UgdGhlIG5ldyBjdXN0b20gaW5zcGVjdGlvbiBzeW1ib2wgdG8gYWRkIHRoZSBjdXN0b20gaW5zcGVjdCBmdW5jdGlvbiBpZlxuLy8gYXZhaWxhYmxlLlxuaWYgKHV0aWwuaW5zcGVjdC5jdXN0b20pIHtcbiAgQ29va2llLnByb3RvdHlwZVt1dGlsLmluc3BlY3QuY3VzdG9tXSA9IENvb2tpZS5wcm90b3R5cGUuaW5zcGVjdDtcbn1cblxuQ29va2llLnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbigpIHtcbiAgdmFyIG9iaiA9IHt9O1xuXG4gIHZhciBwcm9wcyA9IENvb2tpZS5zZXJpYWxpemFibGVQcm9wZXJ0aWVzO1xuICBmb3IgKHZhciBpPTA7IGk8cHJvcHMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgcHJvcCA9IHByb3BzW2ldO1xuICAgIGlmICh0aGlzW3Byb3BdID09PSBDb29raWUucHJvdG90eXBlW3Byb3BdKSB7XG4gICAgICBjb250aW51ZTsgLy8gbGVhdmUgYXMgcHJvdG90eXBlIGRlZmF1bHRcbiAgICB9XG5cbiAgICBpZiAocHJvcCA9PT0gJ2V4cGlyZXMnIHx8XG4gICAgICAgIHByb3AgPT09ICdjcmVhdGlvbicgfHxcbiAgICAgICAgcHJvcCA9PT0gJ2xhc3RBY2Nlc3NlZCcpXG4gICAge1xuICAgICAgaWYgKHRoaXNbcHJvcF0gPT09IG51bGwpIHtcbiAgICAgICAgb2JqW3Byb3BdID0gbnVsbDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG9ialtwcm9wXSA9IHRoaXNbcHJvcF0gPT0gXCJJbmZpbml0eVwiID8gLy8gaW50ZW50aW9uYWxseSBub3QgPT09XG4gICAgICAgICAgXCJJbmZpbml0eVwiIDogdGhpc1twcm9wXS50b0lTT1N0cmluZygpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAocHJvcCA9PT0gJ21heEFnZScpIHtcbiAgICAgIGlmICh0aGlzW3Byb3BdICE9PSBudWxsKSB7XG4gICAgICAgIC8vIGFnYWluLCBpbnRlbnRpb25hbGx5IG5vdCA9PT1cbiAgICAgICAgb2JqW3Byb3BdID0gKHRoaXNbcHJvcF0gPT0gSW5maW5pdHkgfHwgdGhpc1twcm9wXSA9PSAtSW5maW5pdHkpID9cbiAgICAgICAgICB0aGlzW3Byb3BdLnRvU3RyaW5nKCkgOiB0aGlzW3Byb3BdO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodGhpc1twcm9wXSAhPT0gQ29va2llLnByb3RvdHlwZVtwcm9wXSkge1xuICAgICAgICBvYmpbcHJvcF0gPSB0aGlzW3Byb3BdO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBvYmo7XG59O1xuXG5Db29raWUucHJvdG90eXBlLmNsb25lID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBmcm9tSlNPTih0aGlzLnRvSlNPTigpKTtcbn07XG5cbkNvb2tpZS5wcm90b3R5cGUudmFsaWRhdGUgPSBmdW5jdGlvbiB2YWxpZGF0ZSgpIHtcbiAgaWYgKCFDT09LSUVfT0NURVRTLnRlc3QodGhpcy52YWx1ZSkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgaWYgKHRoaXMuZXhwaXJlcyAhPSBJbmZpbml0eSAmJiAhKHRoaXMuZXhwaXJlcyBpbnN0YW5jZW9mIERhdGUpICYmICFwYXJzZURhdGUodGhpcy5leHBpcmVzKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBpZiAodGhpcy5tYXhBZ2UgIT0gbnVsbCAmJiB0aGlzLm1heEFnZSA8PSAwKSB7XG4gICAgcmV0dXJuIGZhbHNlOyAvLyBcIk1heC1BZ2U9XCIgbm9uLXplcm8tZGlnaXQgKkRJR0lUXG4gIH1cbiAgaWYgKHRoaXMucGF0aCAhPSBudWxsICYmICFQQVRIX1ZBTFVFLnRlc3QodGhpcy5wYXRoKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHZhciBjZG9tYWluID0gdGhpcy5jZG9tYWluKCk7XG4gIGlmIChjZG9tYWluKSB7XG4gICAgaWYgKGNkb21haW4ubWF0Y2goL1xcLiQvKSkge1xuICAgICAgcmV0dXJuIGZhbHNlOyAvLyBTNC4xLjIuMyBzdWdnZXN0cyB0aGF0IHRoaXMgaXMgYmFkLiBkb21haW5NYXRjaCgpIHRlc3RzIGNvbmZpcm0gdGhpc1xuICAgIH1cbiAgICB2YXIgc3VmZml4ID0gcHVic3VmZml4LmdldFB1YmxpY1N1ZmZpeChjZG9tYWluKTtcbiAgICBpZiAoc3VmZml4ID09IG51bGwpIHsgLy8gaXQncyBhIHB1YmxpYyBzdWZmaXhcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59O1xuXG5Db29raWUucHJvdG90eXBlLnNldEV4cGlyZXMgPSBmdW5jdGlvbiBzZXRFeHBpcmVzKGV4cCkge1xuICBpZiAoZXhwIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgIHRoaXMuZXhwaXJlcyA9IGV4cDtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLmV4cGlyZXMgPSBwYXJzZURhdGUoZXhwKSB8fCBcIkluZmluaXR5XCI7XG4gIH1cbn07XG5cbkNvb2tpZS5wcm90b3R5cGUuc2V0TWF4QWdlID0gZnVuY3Rpb24gc2V0TWF4QWdlKGFnZSkge1xuICBpZiAoYWdlID09PSBJbmZpbml0eSB8fCBhZ2UgPT09IC1JbmZpbml0eSkge1xuICAgIHRoaXMubWF4QWdlID0gYWdlLnRvU3RyaW5nKCk7IC8vIHNvIEpTT04uc3RyaW5naWZ5KCkgd29ya3NcbiAgfSBlbHNlIHtcbiAgICB0aGlzLm1heEFnZSA9IGFnZTtcbiAgfVxufTtcblxuLy8gZ2l2ZXMgQ29va2llIGhlYWRlciBmb3JtYXRcbkNvb2tpZS5wcm90b3R5cGUuY29va2llU3RyaW5nID0gZnVuY3Rpb24gY29va2llU3RyaW5nKCkge1xuICB2YXIgdmFsID0gdGhpcy52YWx1ZTtcbiAgaWYgKHZhbCA9PSBudWxsKSB7XG4gICAgdmFsID0gJyc7XG4gIH1cbiAgaWYgKHRoaXMua2V5ID09PSAnJykge1xuICAgIHJldHVybiB2YWw7XG4gIH1cbiAgcmV0dXJuIHRoaXMua2V5Kyc9Jyt2YWw7XG59O1xuXG4vLyBnaXZlcyBTZXQtQ29va2llIGhlYWRlciBmb3JtYXRcbkNvb2tpZS5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgdmFyIHN0ciA9IHRoaXMuY29va2llU3RyaW5nKCk7XG5cbiAgaWYgKHRoaXMuZXhwaXJlcyAhPSBJbmZpbml0eSkge1xuICAgIGlmICh0aGlzLmV4cGlyZXMgaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgICBzdHIgKz0gJzsgRXhwaXJlcz0nK2Zvcm1hdERhdGUodGhpcy5leHBpcmVzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RyICs9ICc7IEV4cGlyZXM9Jyt0aGlzLmV4cGlyZXM7XG4gICAgfVxuICB9XG5cbiAgaWYgKHRoaXMubWF4QWdlICE9IG51bGwgJiYgdGhpcy5tYXhBZ2UgIT0gSW5maW5pdHkpIHtcbiAgICBzdHIgKz0gJzsgTWF4LUFnZT0nK3RoaXMubWF4QWdlO1xuICB9XG5cbiAgaWYgKHRoaXMuZG9tYWluICYmICF0aGlzLmhvc3RPbmx5KSB7XG4gICAgc3RyICs9ICc7IERvbWFpbj0nK3RoaXMuZG9tYWluO1xuICB9XG4gIGlmICh0aGlzLnBhdGgpIHtcbiAgICBzdHIgKz0gJzsgUGF0aD0nK3RoaXMucGF0aDtcbiAgfVxuXG4gIGlmICh0aGlzLnNlY3VyZSkge1xuICAgIHN0ciArPSAnOyBTZWN1cmUnO1xuICB9XG4gIGlmICh0aGlzLmh0dHBPbmx5KSB7XG4gICAgc3RyICs9ICc7IEh0dHBPbmx5JztcbiAgfVxuICBpZiAodGhpcy5leHRlbnNpb25zKSB7XG4gICAgdGhpcy5leHRlbnNpb25zLmZvckVhY2goZnVuY3Rpb24oZXh0KSB7XG4gICAgICBzdHIgKz0gJzsgJytleHQ7XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gc3RyO1xufTtcblxuLy8gVFRMKCkgcGFydGlhbGx5IHJlcGxhY2VzIHRoZSBcImV4cGlyeS10aW1lXCIgcGFydHMgb2YgUzUuMyBzdGVwIDMgKHNldENvb2tpZSgpXG4vLyBlbHNld2hlcmUpXG4vLyBTNS4zIHNheXMgdG8gZ2l2ZSB0aGUgXCJsYXRlc3QgcmVwcmVzZW50YWJsZSBkYXRlXCIgZm9yIHdoaWNoIHdlIHVzZSBJbmZpbml0eVxuLy8gRm9yIFwiZXhwaXJlZFwiIHdlIHVzZSAwXG5Db29raWUucHJvdG90eXBlLlRUTCA9IGZ1bmN0aW9uIFRUTChub3cpIHtcbiAgLyogUkZDNjI2NSBTNC4xLjIuMiBJZiBhIGNvb2tpZSBoYXMgYm90aCB0aGUgTWF4LUFnZSBhbmQgdGhlIEV4cGlyZXNcbiAgICogYXR0cmlidXRlLCB0aGUgTWF4LUFnZSBhdHRyaWJ1dGUgaGFzIHByZWNlZGVuY2UgYW5kIGNvbnRyb2xzIHRoZVxuICAgKiBleHBpcmF0aW9uIGRhdGUgb2YgdGhlIGNvb2tpZS5cbiAgICogKENvbmN1cnMgd2l0aCBTNS4zIHN0ZXAgMylcbiAgICovXG4gIGlmICh0aGlzLm1heEFnZSAhPSBudWxsKSB7XG4gICAgcmV0dXJuIHRoaXMubWF4QWdlPD0wID8gMCA6IHRoaXMubWF4QWdlKjEwMDA7XG4gIH1cblxuICB2YXIgZXhwaXJlcyA9IHRoaXMuZXhwaXJlcztcbiAgaWYgKGV4cGlyZXMgIT0gSW5maW5pdHkpIHtcbiAgICBpZiAoIShleHBpcmVzIGluc3RhbmNlb2YgRGF0ZSkpIHtcbiAgICAgIGV4cGlyZXMgPSBwYXJzZURhdGUoZXhwaXJlcykgfHwgSW5maW5pdHk7XG4gICAgfVxuXG4gICAgaWYgKGV4cGlyZXMgPT0gSW5maW5pdHkpIHtcbiAgICAgIHJldHVybiBJbmZpbml0eTtcbiAgICB9XG5cbiAgICByZXR1cm4gZXhwaXJlcy5nZXRUaW1lKCkgLSAobm93IHx8IERhdGUubm93KCkpO1xuICB9XG5cbiAgcmV0dXJuIEluZmluaXR5O1xufTtcblxuLy8gZXhwaXJ5VGltZSgpIHJlcGxhY2VzIHRoZSBcImV4cGlyeS10aW1lXCIgcGFydHMgb2YgUzUuMyBzdGVwIDMgKHNldENvb2tpZSgpXG4vLyBlbHNld2hlcmUpXG5Db29raWUucHJvdG90eXBlLmV4cGlyeVRpbWUgPSBmdW5jdGlvbiBleHBpcnlUaW1lKG5vdykge1xuICBpZiAodGhpcy5tYXhBZ2UgIT0gbnVsbCkge1xuICAgIHZhciByZWxhdGl2ZVRvID0gbm93IHx8IHRoaXMuY3JlYXRpb24gfHwgbmV3IERhdGUoKTtcbiAgICB2YXIgYWdlID0gKHRoaXMubWF4QWdlIDw9IDApID8gLUluZmluaXR5IDogdGhpcy5tYXhBZ2UqMTAwMDtcbiAgICByZXR1cm4gcmVsYXRpdmVUby5nZXRUaW1lKCkgKyBhZ2U7XG4gIH1cblxuICBpZiAodGhpcy5leHBpcmVzID09IEluZmluaXR5KSB7XG4gICAgcmV0dXJuIEluZmluaXR5O1xuICB9XG4gIHJldHVybiB0aGlzLmV4cGlyZXMuZ2V0VGltZSgpO1xufTtcblxuLy8gZXhwaXJ5RGF0ZSgpIHJlcGxhY2VzIHRoZSBcImV4cGlyeS10aW1lXCIgcGFydHMgb2YgUzUuMyBzdGVwIDMgKHNldENvb2tpZSgpXG4vLyBlbHNld2hlcmUpLCBleGNlcHQgaXQgcmV0dXJucyBhIERhdGVcbkNvb2tpZS5wcm90b3R5cGUuZXhwaXJ5RGF0ZSA9IGZ1bmN0aW9uIGV4cGlyeURhdGUobm93KSB7XG4gIHZhciBtaWxsaXNlYyA9IHRoaXMuZXhwaXJ5VGltZShub3cpO1xuICBpZiAobWlsbGlzZWMgPT0gSW5maW5pdHkpIHtcbiAgICByZXR1cm4gbmV3IERhdGUoTUFYX1RJTUUpO1xuICB9IGVsc2UgaWYgKG1pbGxpc2VjID09IC1JbmZpbml0eSkge1xuICAgIHJldHVybiBuZXcgRGF0ZShNSU5fVElNRSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG5ldyBEYXRlKG1pbGxpc2VjKTtcbiAgfVxufTtcblxuLy8gVGhpcyByZXBsYWNlcyB0aGUgXCJwZXJzaXN0ZW50LWZsYWdcIiBwYXJ0cyBvZiBTNS4zIHN0ZXAgM1xuQ29va2llLnByb3RvdHlwZS5pc1BlcnNpc3RlbnQgPSBmdW5jdGlvbiBpc1BlcnNpc3RlbnQoKSB7XG4gIHJldHVybiAodGhpcy5tYXhBZ2UgIT0gbnVsbCB8fCB0aGlzLmV4cGlyZXMgIT0gSW5maW5pdHkpO1xufTtcblxuLy8gTW9zdGx5IFM1LjEuMiBhbmQgUzUuMi4zOlxuQ29va2llLnByb3RvdHlwZS5jZG9tYWluID1cbkNvb2tpZS5wcm90b3R5cGUuY2Fub25pY2FsaXplZERvbWFpbiA9IGZ1bmN0aW9uIGNhbm9uaWNhbGl6ZWREb21haW4oKSB7XG4gIGlmICh0aGlzLmRvbWFpbiA9PSBudWxsKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgcmV0dXJuIGNhbm9uaWNhbERvbWFpbih0aGlzLmRvbWFpbik7XG59O1xuXG5mdW5jdGlvbiBDb29raWVKYXIoc3RvcmUsIG9wdGlvbnMpIHtcbiAgaWYgKHR5cGVvZiBvcHRpb25zID09PSBcImJvb2xlYW5cIikge1xuICAgIG9wdGlvbnMgPSB7cmVqZWN0UHVibGljU3VmZml4ZXM6IG9wdGlvbnN9O1xuICB9IGVsc2UgaWYgKG9wdGlvbnMgPT0gbnVsbCkge1xuICAgIG9wdGlvbnMgPSB7fTtcbiAgfVxuICBpZiAob3B0aW9ucy5yZWplY3RQdWJsaWNTdWZmaXhlcyAhPSBudWxsKSB7XG4gICAgdGhpcy5yZWplY3RQdWJsaWNTdWZmaXhlcyA9IG9wdGlvbnMucmVqZWN0UHVibGljU3VmZml4ZXM7XG4gIH1cbiAgaWYgKG9wdGlvbnMubG9vc2VNb2RlICE9IG51bGwpIHtcbiAgICB0aGlzLmVuYWJsZUxvb3NlTW9kZSA9IG9wdGlvbnMubG9vc2VNb2RlO1xuICB9XG5cbiAgaWYgKCFzdG9yZSkge1xuICAgIHN0b3JlID0gbmV3IE1lbW9yeUNvb2tpZVN0b3JlKCk7XG4gIH1cbiAgdGhpcy5zdG9yZSA9IHN0b3JlO1xufVxuQ29va2llSmFyLnByb3RvdHlwZS5zdG9yZSA9IG51bGw7XG5Db29raWVKYXIucHJvdG90eXBlLnJlamVjdFB1YmxpY1N1ZmZpeGVzID0gdHJ1ZTtcbkNvb2tpZUphci5wcm90b3R5cGUuZW5hYmxlTG9vc2VNb2RlID0gZmFsc2U7XG52YXIgQ0FOX0JFX1NZTkMgPSBbXTtcblxuQ0FOX0JFX1NZTkMucHVzaCgnc2V0Q29va2llJyk7XG5Db29raWVKYXIucHJvdG90eXBlLnNldENvb2tpZSA9IGZ1bmN0aW9uKGNvb2tpZSwgdXJsLCBvcHRpb25zLCBjYikge1xuICB2YXIgZXJyO1xuICB2YXIgY29udGV4dCA9IGdldENvb2tpZUNvbnRleHQodXJsKTtcbiAgaWYgKG9wdGlvbnMgaW5zdGFuY2VvZiBGdW5jdGlvbikge1xuICAgIGNiID0gb3B0aW9ucztcbiAgICBvcHRpb25zID0ge307XG4gIH1cblxuICB2YXIgaG9zdCA9IGNhbm9uaWNhbERvbWFpbihjb250ZXh0Lmhvc3RuYW1lKTtcbiAgdmFyIGxvb3NlID0gdGhpcy5lbmFibGVMb29zZU1vZGU7XG4gIGlmIChvcHRpb25zLmxvb3NlICE9IG51bGwpIHtcbiAgICBsb29zZSA9IG9wdGlvbnMubG9vc2U7XG4gIH1cblxuICAvLyBTNS4zIHN0ZXAgMVxuICBpZiAoIShjb29raWUgaW5zdGFuY2VvZiBDb29raWUpKSB7XG4gICAgY29va2llID0gQ29va2llLnBhcnNlKGNvb2tpZSwgeyBsb29zZTogbG9vc2UgfSk7XG4gIH1cbiAgaWYgKCFjb29raWUpIHtcbiAgICBlcnIgPSBuZXcgRXJyb3IoXCJDb29raWUgZmFpbGVkIHRvIHBhcnNlXCIpO1xuICAgIHJldHVybiBjYihvcHRpb25zLmlnbm9yZUVycm9yID8gbnVsbCA6IGVycik7XG4gIH1cblxuICAvLyBTNS4zIHN0ZXAgMlxuICB2YXIgbm93ID0gb3B0aW9ucy5ub3cgfHwgbmV3IERhdGUoKTsgLy8gd2lsbCBhc3NpZ24gbGF0ZXIgdG8gc2F2ZSBlZmZvcnQgaW4gdGhlIGZhY2Ugb2YgZXJyb3JzXG5cbiAgLy8gUzUuMyBzdGVwIDM6IE5PT1A7IHBlcnNpc3RlbnQtZmxhZyBhbmQgZXhwaXJ5LXRpbWUgaXMgaGFuZGxlZCBieSBnZXRDb29raWUoKVxuXG4gIC8vIFM1LjMgc3RlcCA0OiBOT09QOyBkb21haW4gaXMgbnVsbCBieSBkZWZhdWx0XG5cbiAgLy8gUzUuMyBzdGVwIDU6IHB1YmxpYyBzdWZmaXhlc1xuICBpZiAodGhpcy5yZWplY3RQdWJsaWNTdWZmaXhlcyAmJiBjb29raWUuZG9tYWluKSB7XG4gICAgdmFyIHN1ZmZpeCA9IHB1YnN1ZmZpeC5nZXRQdWJsaWNTdWZmaXgoY29va2llLmNkb21haW4oKSk7XG4gICAgaWYgKHN1ZmZpeCA9PSBudWxsKSB7IC8vIGUuZy4gXCJjb21cIlxuICAgICAgZXJyID0gbmV3IEVycm9yKFwiQ29va2llIGhhcyBkb21haW4gc2V0IHRvIGEgcHVibGljIHN1ZmZpeFwiKTtcbiAgICAgIHJldHVybiBjYihvcHRpb25zLmlnbm9yZUVycm9yID8gbnVsbCA6IGVycik7XG4gICAgfVxuICB9XG5cbiAgLy8gUzUuMyBzdGVwIDY6XG4gIGlmIChjb29raWUuZG9tYWluKSB7XG4gICAgaWYgKCFkb21haW5NYXRjaChob3N0LCBjb29raWUuY2RvbWFpbigpLCBmYWxzZSkpIHtcbiAgICAgIGVyciA9IG5ldyBFcnJvcihcIkNvb2tpZSBub3QgaW4gdGhpcyBob3N0J3MgZG9tYWluLiBDb29raWU6XCIrY29va2llLmNkb21haW4oKStcIiBSZXF1ZXN0OlwiK2hvc3QpO1xuICAgICAgcmV0dXJuIGNiKG9wdGlvbnMuaWdub3JlRXJyb3IgPyBudWxsIDogZXJyKTtcbiAgICB9XG5cbiAgICBpZiAoY29va2llLmhvc3RPbmx5ID09IG51bGwpIHsgLy8gZG9uJ3QgcmVzZXQgaWYgYWxyZWFkeSBzZXRcbiAgICAgIGNvb2tpZS5ob3N0T25seSA9IGZhbHNlO1xuICAgIH1cblxuICB9IGVsc2Uge1xuICAgIGNvb2tpZS5ob3N0T25seSA9IHRydWU7XG4gICAgY29va2llLmRvbWFpbiA9IGhvc3Q7XG4gIH1cblxuICAvL1M1LjIuNCBJZiB0aGUgYXR0cmlidXRlLXZhbHVlIGlzIGVtcHR5IG9yIGlmIHRoZSBmaXJzdCBjaGFyYWN0ZXIgb2YgdGhlXG4gIC8vYXR0cmlidXRlLXZhbHVlIGlzIG5vdCAleDJGIChcIi9cIik6XG4gIC8vTGV0IGNvb2tpZS1wYXRoIGJlIHRoZSBkZWZhdWx0LXBhdGguXG4gIGlmICghY29va2llLnBhdGggfHwgY29va2llLnBhdGhbMF0gIT09ICcvJykge1xuICAgIGNvb2tpZS5wYXRoID0gZGVmYXVsdFBhdGgoY29udGV4dC5wYXRobmFtZSk7XG4gICAgY29va2llLnBhdGhJc0RlZmF1bHQgPSB0cnVlO1xuICB9XG5cbiAgLy8gUzUuMyBzdGVwIDg6IE5PT1A7IHNlY3VyZSBhdHRyaWJ1dGVcbiAgLy8gUzUuMyBzdGVwIDk6IE5PT1A7IGh0dHBPbmx5IGF0dHJpYnV0ZVxuXG4gIC8vIFM1LjMgc3RlcCAxMFxuICBpZiAob3B0aW9ucy5odHRwID09PSBmYWxzZSAmJiBjb29raWUuaHR0cE9ubHkpIHtcbiAgICBlcnIgPSBuZXcgRXJyb3IoXCJDb29raWUgaXMgSHR0cE9ubHkgYW5kIHRoaXMgaXNuJ3QgYW4gSFRUUCBBUElcIik7XG4gICAgcmV0dXJuIGNiKG9wdGlvbnMuaWdub3JlRXJyb3IgPyBudWxsIDogZXJyKTtcbiAgfVxuXG4gIHZhciBzdG9yZSA9IHRoaXMuc3RvcmU7XG5cbiAgaWYgKCFzdG9yZS51cGRhdGVDb29raWUpIHtcbiAgICBzdG9yZS51cGRhdGVDb29raWUgPSBmdW5jdGlvbihvbGRDb29raWUsIG5ld0Nvb2tpZSwgY2IpIHtcbiAgICAgIHRoaXMucHV0Q29va2llKG5ld0Nvb2tpZSwgY2IpO1xuICAgIH07XG4gIH1cblxuICBmdW5jdGlvbiB3aXRoQ29va2llKGVyciwgb2xkQ29va2llKSB7XG4gICAgaWYgKGVycikge1xuICAgICAgcmV0dXJuIGNiKGVycik7XG4gICAgfVxuXG4gICAgdmFyIG5leHQgPSBmdW5jdGlvbihlcnIpIHtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgcmV0dXJuIGNiKGVycik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjYihudWxsLCBjb29raWUpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBpZiAob2xkQ29va2llKSB7XG4gICAgICAvLyBTNS4zIHN0ZXAgMTEgLSBcIklmIHRoZSBjb29raWUgc3RvcmUgY29udGFpbnMgYSBjb29raWUgd2l0aCB0aGUgc2FtZSBuYW1lLFxuICAgICAgLy8gZG9tYWluLCBhbmQgcGF0aCBhcyB0aGUgbmV3bHkgY3JlYXRlZCBjb29raWU6XCJcbiAgICAgIGlmIChvcHRpb25zLmh0dHAgPT09IGZhbHNlICYmIG9sZENvb2tpZS5odHRwT25seSkgeyAvLyBzdGVwIDExLjJcbiAgICAgICAgZXJyID0gbmV3IEVycm9yKFwib2xkIENvb2tpZSBpcyBIdHRwT25seSBhbmQgdGhpcyBpc24ndCBhbiBIVFRQIEFQSVwiKTtcbiAgICAgICAgcmV0dXJuIGNiKG9wdGlvbnMuaWdub3JlRXJyb3IgPyBudWxsIDogZXJyKTtcbiAgICAgIH1cbiAgICAgIGNvb2tpZS5jcmVhdGlvbiA9IG9sZENvb2tpZS5jcmVhdGlvbjsgLy8gc3RlcCAxMS4zXG4gICAgICBjb29raWUuY3JlYXRpb25JbmRleCA9IG9sZENvb2tpZS5jcmVhdGlvbkluZGV4OyAvLyBwcmVzZXJ2ZSB0aWUtYnJlYWtlclxuICAgICAgY29va2llLmxhc3RBY2Nlc3NlZCA9IG5vdztcbiAgICAgIC8vIFN0ZXAgMTEuNCAoZGVsZXRlIGNvb2tpZSkgaXMgaW1wbGllZCBieSBqdXN0IHNldHRpbmcgdGhlIG5ldyBvbmU6XG4gICAgICBzdG9yZS51cGRhdGVDb29raWUob2xkQ29va2llLCBjb29raWUsIG5leHQpOyAvLyBzdGVwIDEyXG5cbiAgICB9IGVsc2Uge1xuICAgICAgY29va2llLmNyZWF0aW9uID0gY29va2llLmxhc3RBY2Nlc3NlZCA9IG5vdztcbiAgICAgIHN0b3JlLnB1dENvb2tpZShjb29raWUsIG5leHQpOyAvLyBzdGVwIDEyXG4gICAgfVxuICB9XG5cbiAgc3RvcmUuZmluZENvb2tpZShjb29raWUuZG9tYWluLCBjb29raWUucGF0aCwgY29va2llLmtleSwgd2l0aENvb2tpZSk7XG59O1xuXG4vLyBSRkM2MzY1IFM1LjRcbkNBTl9CRV9TWU5DLnB1c2goJ2dldENvb2tpZXMnKTtcbkNvb2tpZUphci5wcm90b3R5cGUuZ2V0Q29va2llcyA9IGZ1bmN0aW9uKHVybCwgb3B0aW9ucywgY2IpIHtcbiAgdmFyIGNvbnRleHQgPSBnZXRDb29raWVDb250ZXh0KHVybCk7XG4gIGlmIChvcHRpb25zIGluc3RhbmNlb2YgRnVuY3Rpb24pIHtcbiAgICBjYiA9IG9wdGlvbnM7XG4gICAgb3B0aW9ucyA9IHt9O1xuICB9XG5cbiAgdmFyIGhvc3QgPSBjYW5vbmljYWxEb21haW4oY29udGV4dC5ob3N0bmFtZSk7XG4gIHZhciBwYXRoID0gY29udGV4dC5wYXRobmFtZSB8fCAnLyc7XG5cbiAgdmFyIHNlY3VyZSA9IG9wdGlvbnMuc2VjdXJlO1xuICBpZiAoc2VjdXJlID09IG51bGwgJiYgY29udGV4dC5wcm90b2NvbCAmJlxuICAgICAgKGNvbnRleHQucHJvdG9jb2wgPT0gJ2h0dHBzOicgfHwgY29udGV4dC5wcm90b2NvbCA9PSAnd3NzOicpKVxuICB7XG4gICAgc2VjdXJlID0gdHJ1ZTtcbiAgfVxuXG4gIHZhciBodHRwID0gb3B0aW9ucy5odHRwO1xuICBpZiAoaHR0cCA9PSBudWxsKSB7XG4gICAgaHR0cCA9IHRydWU7XG4gIH1cblxuICB2YXIgbm93ID0gb3B0aW9ucy5ub3cgfHwgRGF0ZS5ub3coKTtcbiAgdmFyIGV4cGlyZUNoZWNrID0gb3B0aW9ucy5leHBpcmUgIT09IGZhbHNlO1xuICB2YXIgYWxsUGF0aHMgPSAhIW9wdGlvbnMuYWxsUGF0aHM7XG4gIHZhciBzdG9yZSA9IHRoaXMuc3RvcmU7XG5cbiAgZnVuY3Rpb24gbWF0Y2hpbmdDb29raWUoYykge1xuICAgIC8vIFwiRWl0aGVyOlxuICAgIC8vICAgVGhlIGNvb2tpZSdzIGhvc3Qtb25seS1mbGFnIGlzIHRydWUgYW5kIHRoZSBjYW5vbmljYWxpemVkXG4gICAgLy8gICByZXF1ZXN0LWhvc3QgaXMgaWRlbnRpY2FsIHRvIHRoZSBjb29raWUncyBkb21haW4uXG4gICAgLy8gT3I6XG4gICAgLy8gICBUaGUgY29va2llJ3MgaG9zdC1vbmx5LWZsYWcgaXMgZmFsc2UgYW5kIHRoZSBjYW5vbmljYWxpemVkXG4gICAgLy8gICByZXF1ZXN0LWhvc3QgZG9tYWluLW1hdGNoZXMgdGhlIGNvb2tpZSdzIGRvbWFpbi5cIlxuICAgIGlmIChjLmhvc3RPbmx5KSB7XG4gICAgICBpZiAoYy5kb21haW4gIT0gaG9zdCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICghZG9tYWluTWF0Y2goaG9zdCwgYy5kb21haW4sIGZhbHNlKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gXCJUaGUgcmVxdWVzdC11cmkncyBwYXRoIHBhdGgtbWF0Y2hlcyB0aGUgY29va2llJ3MgcGF0aC5cIlxuICAgIGlmICghYWxsUGF0aHMgJiYgIXBhdGhNYXRjaChwYXRoLCBjLnBhdGgpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gXCJJZiB0aGUgY29va2llJ3Mgc2VjdXJlLW9ubHktZmxhZyBpcyB0cnVlLCB0aGVuIHRoZSByZXF1ZXN0LXVyaSdzXG4gICAgLy8gc2NoZW1lIG11c3QgZGVub3RlIGEgXCJzZWN1cmVcIiBwcm90b2NvbFwiXG4gICAgaWYgKGMuc2VjdXJlICYmICFzZWN1cmUpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyBcIklmIHRoZSBjb29raWUncyBodHRwLW9ubHktZmxhZyBpcyB0cnVlLCB0aGVuIGV4Y2x1ZGUgdGhlIGNvb2tpZSBpZiB0aGVcbiAgICAvLyBjb29raWUtc3RyaW5nIGlzIGJlaW5nIGdlbmVyYXRlZCBmb3IgYSBcIm5vbi1IVFRQXCIgQVBJXCJcbiAgICBpZiAoYy5odHRwT25seSAmJiAhaHR0cCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8vIGRlZmVycmVkIGZyb20gUzUuM1xuICAgIC8vIG5vbi1SRkM6IGFsbG93IHJldGVudGlvbiBvZiBleHBpcmVkIGNvb2tpZXMgYnkgY2hvaWNlXG4gICAgaWYgKGV4cGlyZUNoZWNrICYmIGMuZXhwaXJ5VGltZSgpIDw9IG5vdykge1xuICAgICAgc3RvcmUucmVtb3ZlQ29va2llKGMuZG9tYWluLCBjLnBhdGgsIGMua2V5LCBmdW5jdGlvbigpe30pOyAvLyByZXN1bHQgaWdub3JlZFxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgc3RvcmUuZmluZENvb2tpZXMoaG9zdCwgYWxsUGF0aHMgPyBudWxsIDogcGF0aCwgZnVuY3Rpb24oZXJyLGNvb2tpZXMpIHtcbiAgICBpZiAoZXJyKSB7XG4gICAgICByZXR1cm4gY2IoZXJyKTtcbiAgICB9XG5cbiAgICBjb29raWVzID0gY29va2llcy5maWx0ZXIobWF0Y2hpbmdDb29raWUpO1xuXG4gICAgLy8gc29ydGluZyBvZiBTNS40IHBhcnQgMlxuICAgIGlmIChvcHRpb25zLnNvcnQgIT09IGZhbHNlKSB7XG4gICAgICBjb29raWVzID0gY29va2llcy5zb3J0KGNvb2tpZUNvbXBhcmUpO1xuICAgIH1cblxuICAgIC8vIFM1LjQgcGFydCAzXG4gICAgdmFyIG5vdyA9IG5ldyBEYXRlKCk7XG4gICAgY29va2llcy5mb3JFYWNoKGZ1bmN0aW9uKGMpIHtcbiAgICAgIGMubGFzdEFjY2Vzc2VkID0gbm93O1xuICAgIH0pO1xuICAgIC8vIFRPRE8gcGVyc2lzdCBsYXN0QWNjZXNzZWRcblxuICAgIGNiKG51bGwsY29va2llcyk7XG4gIH0pO1xufTtcblxuQ0FOX0JFX1NZTkMucHVzaCgnZ2V0Q29va2llU3RyaW5nJyk7XG5Db29raWVKYXIucHJvdG90eXBlLmdldENvb2tpZVN0cmluZyA9IGZ1bmN0aW9uKC8qLi4uLCBjYiovKSB7XG4gIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLDApO1xuICB2YXIgY2IgPSBhcmdzLnBvcCgpO1xuICB2YXIgbmV4dCA9IGZ1bmN0aW9uKGVycixjb29raWVzKSB7XG4gICAgaWYgKGVycikge1xuICAgICAgY2IoZXJyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY2IobnVsbCwgY29va2llc1xuICAgICAgICAuc29ydChjb29raWVDb21wYXJlKVxuICAgICAgICAubWFwKGZ1bmN0aW9uKGMpe1xuICAgICAgICAgIHJldHVybiBjLmNvb2tpZVN0cmluZygpO1xuICAgICAgICB9KVxuICAgICAgICAuam9pbignOyAnKSk7XG4gICAgfVxuICB9O1xuICBhcmdzLnB1c2gobmV4dCk7XG4gIHRoaXMuZ2V0Q29va2llcy5hcHBseSh0aGlzLGFyZ3MpO1xufTtcblxuQ0FOX0JFX1NZTkMucHVzaCgnZ2V0U2V0Q29va2llU3RyaW5ncycpO1xuQ29va2llSmFyLnByb3RvdHlwZS5nZXRTZXRDb29raWVTdHJpbmdzID0gZnVuY3Rpb24oLyouLi4sIGNiKi8pIHtcbiAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsMCk7XG4gIHZhciBjYiA9IGFyZ3MucG9wKCk7XG4gIHZhciBuZXh0ID0gZnVuY3Rpb24oZXJyLGNvb2tpZXMpIHtcbiAgICBpZiAoZXJyKSB7XG4gICAgICBjYihlcnIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjYihudWxsLCBjb29raWVzLm1hcChmdW5jdGlvbihjKXtcbiAgICAgICAgcmV0dXJuIGMudG9TdHJpbmcoKTtcbiAgICAgIH0pKTtcbiAgICB9XG4gIH07XG4gIGFyZ3MucHVzaChuZXh0KTtcbiAgdGhpcy5nZXRDb29raWVzLmFwcGx5KHRoaXMsYXJncyk7XG59O1xuXG5DQU5fQkVfU1lOQy5wdXNoKCdzZXJpYWxpemUnKTtcbkNvb2tpZUphci5wcm90b3R5cGUuc2VyaWFsaXplID0gZnVuY3Rpb24oY2IpIHtcbiAgdmFyIHR5cGUgPSB0aGlzLnN0b3JlLmNvbnN0cnVjdG9yLm5hbWU7XG4gIGlmICh0eXBlID09PSAnT2JqZWN0Jykge1xuICAgIHR5cGUgPSBudWxsO1xuICB9XG5cbiAgLy8gdXBkYXRlIFJFQURNRS5tZCBcIlNlcmlhbGl6YXRpb24gRm9ybWF0XCIgaWYgeW91IGNoYW5nZSB0aGlzLCBwbGVhc2UhXG4gIHZhciBzZXJpYWxpemVkID0ge1xuICAgIC8vIFRoZSB2ZXJzaW9uIG9mIHRvdWdoLWNvb2tpZSB0aGF0IHNlcmlhbGl6ZWQgdGhpcyBqYXIuIEdlbmVyYWxseSBhIGdvb2RcbiAgICAvLyBwcmFjdGljZSBzaW5jZSBmdXR1cmUgdmVyc2lvbnMgY2FuIG1ha2UgZGF0YSBpbXBvcnQgZGVjaXNpb25zIGJhc2VkIG9uXG4gICAgLy8ga25vd24gcGFzdCBiZWhhdmlvci4gV2hlbi9pZiB0aGlzIG1hdHRlcnMsIHVzZSBgc2VtdmVyYC5cbiAgICB2ZXJzaW9uOiAndG91Z2gtY29va2llQCcrVkVSU0lPTixcblxuICAgIC8vIGFkZCB0aGUgc3RvcmUgdHlwZSwgdG8gbWFrZSBodW1hbnMgaGFwcHk6XG4gICAgc3RvcmVUeXBlOiB0eXBlLFxuXG4gICAgLy8gQ29va2llSmFyIGNvbmZpZ3VyYXRpb246XG4gICAgcmVqZWN0UHVibGljU3VmZml4ZXM6ICEhdGhpcy5yZWplY3RQdWJsaWNTdWZmaXhlcyxcblxuICAgIC8vIHRoaXMgZ2V0cyBmaWxsZWQgZnJvbSBnZXRBbGxDb29raWVzOlxuICAgIGNvb2tpZXM6IFtdXG4gIH07XG5cbiAgaWYgKCEodGhpcy5zdG9yZS5nZXRBbGxDb29raWVzICYmXG4gICAgICAgIHR5cGVvZiB0aGlzLnN0b3JlLmdldEFsbENvb2tpZXMgPT09ICdmdW5jdGlvbicpKVxuICB7XG4gICAgcmV0dXJuIGNiKG5ldyBFcnJvcignc3RvcmUgZG9lcyBub3Qgc3VwcG9ydCBnZXRBbGxDb29raWVzIGFuZCBjYW5ub3QgYmUgc2VyaWFsaXplZCcpKTtcbiAgfVxuXG4gIHRoaXMuc3RvcmUuZ2V0QWxsQ29va2llcyhmdW5jdGlvbihlcnIsY29va2llcykge1xuICAgIGlmIChlcnIpIHtcbiAgICAgIHJldHVybiBjYihlcnIpO1xuICAgIH1cblxuICAgIHNlcmlhbGl6ZWQuY29va2llcyA9IGNvb2tpZXMubWFwKGZ1bmN0aW9uKGNvb2tpZSkge1xuICAgICAgLy8gY29udmVydCB0byBzZXJpYWxpemVkICdyYXcnIGNvb2tpZXNcbiAgICAgIGNvb2tpZSA9IChjb29raWUgaW5zdGFuY2VvZiBDb29raWUpID8gY29va2llLnRvSlNPTigpIDogY29va2llO1xuXG4gICAgICAvLyBSZW1vdmUgdGhlIGluZGV4IHNvIG5ldyBvbmVzIGdldCBhc3NpZ25lZCBkdXJpbmcgZGVzZXJpYWxpemF0aW9uXG4gICAgICBkZWxldGUgY29va2llLmNyZWF0aW9uSW5kZXg7XG5cbiAgICAgIHJldHVybiBjb29raWU7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gY2IobnVsbCwgc2VyaWFsaXplZCk7XG4gIH0pO1xufTtcblxuLy8gd2VsbC1rbm93biBuYW1lIHRoYXQgSlNPTi5zdHJpbmdpZnkgY2FsbHNcbkNvb2tpZUphci5wcm90b3R5cGUudG9KU09OID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLnNlcmlhbGl6ZVN5bmMoKTtcbn07XG5cbi8vIHVzZSB0aGUgY2xhc3MgbWV0aG9kIENvb2tpZUphci5kZXNlcmlhbGl6ZSBpbnN0ZWFkIG9mIGNhbGxpbmcgdGhpcyBkaXJlY3RseVxuQ0FOX0JFX1NZTkMucHVzaCgnX2ltcG9ydENvb2tpZXMnKTtcbkNvb2tpZUphci5wcm90b3R5cGUuX2ltcG9ydENvb2tpZXMgPSBmdW5jdGlvbihzZXJpYWxpemVkLCBjYikge1xuICB2YXIgamFyID0gdGhpcztcbiAgdmFyIGNvb2tpZXMgPSBzZXJpYWxpemVkLmNvb2tpZXM7XG4gIGlmICghY29va2llcyB8fCAhQXJyYXkuaXNBcnJheShjb29raWVzKSkge1xuICAgIHJldHVybiBjYihuZXcgRXJyb3IoJ3NlcmlhbGl6ZWQgamFyIGhhcyBubyBjb29raWVzIGFycmF5JykpO1xuICB9XG4gIGNvb2tpZXMgPSBjb29raWVzLnNsaWNlKCk7IC8vIGRvIG5vdCBtb2RpZnkgdGhlIG9yaWdpbmFsXG5cbiAgZnVuY3Rpb24gcHV0TmV4dChlcnIpIHtcbiAgICBpZiAoZXJyKSB7XG4gICAgICByZXR1cm4gY2IoZXJyKTtcbiAgICB9XG5cbiAgICBpZiAoIWNvb2tpZXMubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gY2IoZXJyLCBqYXIpO1xuICAgIH1cblxuICAgIHZhciBjb29raWU7XG4gICAgdHJ5IHtcbiAgICAgIGNvb2tpZSA9IGZyb21KU09OKGNvb2tpZXMuc2hpZnQoKSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcmV0dXJuIGNiKGUpO1xuICAgIH1cblxuICAgIGlmIChjb29raWUgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiBwdXROZXh0KG51bGwpOyAvLyBza2lwIHRoaXMgY29va2llXG4gICAgfVxuXG4gICAgamFyLnN0b3JlLnB1dENvb2tpZShjb29raWUsIHB1dE5leHQpO1xuICB9XG5cbiAgcHV0TmV4dCgpO1xufTtcblxuQ29va2llSmFyLmRlc2VyaWFsaXplID0gZnVuY3Rpb24oc3RyT3JPYmosIHN0b3JlLCBjYikge1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCAhPT0gMykge1xuICAgIC8vIHN0b3JlIGlzIG9wdGlvbmFsXG4gICAgY2IgPSBzdG9yZTtcbiAgICBzdG9yZSA9IG51bGw7XG4gIH1cblxuICB2YXIgc2VyaWFsaXplZDtcbiAgaWYgKHR5cGVvZiBzdHJPck9iaiA9PT0gJ3N0cmluZycpIHtcbiAgICBzZXJpYWxpemVkID0ganNvblBhcnNlKHN0ck9yT2JqKTtcbiAgICBpZiAoc2VyaWFsaXplZCBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICByZXR1cm4gY2Ioc2VyaWFsaXplZCk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHNlcmlhbGl6ZWQgPSBzdHJPck9iajtcbiAgfVxuXG4gIHZhciBqYXIgPSBuZXcgQ29va2llSmFyKHN0b3JlLCBzZXJpYWxpemVkLnJlamVjdFB1YmxpY1N1ZmZpeGVzKTtcbiAgamFyLl9pbXBvcnRDb29raWVzKHNlcmlhbGl6ZWQsIGZ1bmN0aW9uKGVycikge1xuICAgIGlmIChlcnIpIHtcbiAgICAgIHJldHVybiBjYihlcnIpO1xuICAgIH1cbiAgICBjYihudWxsLCBqYXIpO1xuICB9KTtcbn07XG5cbkNvb2tpZUphci5kZXNlcmlhbGl6ZVN5bmMgPSBmdW5jdGlvbihzdHJPck9iaiwgc3RvcmUpIHtcbiAgdmFyIHNlcmlhbGl6ZWQgPSB0eXBlb2Ygc3RyT3JPYmogPT09ICdzdHJpbmcnID9cbiAgICBKU09OLnBhcnNlKHN0ck9yT2JqKSA6IHN0ck9yT2JqO1xuICB2YXIgamFyID0gbmV3IENvb2tpZUphcihzdG9yZSwgc2VyaWFsaXplZC5yZWplY3RQdWJsaWNTdWZmaXhlcyk7XG5cbiAgLy8gY2F0Y2ggdGhpcyBtaXN0YWtlIGVhcmx5OlxuICBpZiAoIWphci5zdG9yZS5zeW5jaHJvbm91cykge1xuICAgIHRocm93IG5ldyBFcnJvcignQ29va2llSmFyIHN0b3JlIGlzIG5vdCBzeW5jaHJvbm91czsgdXNlIGFzeW5jIEFQSSBpbnN0ZWFkLicpO1xuICB9XG5cbiAgamFyLl9pbXBvcnRDb29raWVzU3luYyhzZXJpYWxpemVkKTtcbiAgcmV0dXJuIGphcjtcbn07XG5Db29raWVKYXIuZnJvbUpTT04gPSBDb29raWVKYXIuZGVzZXJpYWxpemVTeW5jO1xuXG5DQU5fQkVfU1lOQy5wdXNoKCdjbG9uZScpO1xuQ29va2llSmFyLnByb3RvdHlwZS5jbG9uZSA9IGZ1bmN0aW9uKG5ld1N0b3JlLCBjYikge1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgIGNiID0gbmV3U3RvcmU7XG4gICAgbmV3U3RvcmUgPSBudWxsO1xuICB9XG5cbiAgdGhpcy5zZXJpYWxpemUoZnVuY3Rpb24oZXJyLHNlcmlhbGl6ZWQpIHtcbiAgICBpZiAoZXJyKSB7XG4gICAgICByZXR1cm4gY2IoZXJyKTtcbiAgICB9XG4gICAgQ29va2llSmFyLmRlc2VyaWFsaXplKG5ld1N0b3JlLCBzZXJpYWxpemVkLCBjYik7XG4gIH0pO1xufTtcblxuLy8gVXNlIGEgY2xvc3VyZSB0byBwcm92aWRlIGEgdHJ1ZSBpbXBlcmF0aXZlIEFQSSBmb3Igc3luY2hyb25vdXMgc3RvcmVzLlxuZnVuY3Rpb24gc3luY1dyYXAobWV0aG9kKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICBpZiAoIXRoaXMuc3RvcmUuc3luY2hyb25vdXMpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ29va2llSmFyIHN0b3JlIGlzIG5vdCBzeW5jaHJvbm91czsgdXNlIGFzeW5jIEFQSSBpbnN0ZWFkLicpO1xuICAgIH1cblxuICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICB2YXIgc3luY0Vyciwgc3luY1Jlc3VsdDtcbiAgICBhcmdzLnB1c2goZnVuY3Rpb24gc3luY0NiKGVyciwgcmVzdWx0KSB7XG4gICAgICBzeW5jRXJyID0gZXJyO1xuICAgICAgc3luY1Jlc3VsdCA9IHJlc3VsdDtcbiAgICB9KTtcbiAgICB0aGlzW21ldGhvZF0uYXBwbHkodGhpcywgYXJncyk7XG5cbiAgICBpZiAoc3luY0Vycikge1xuICAgICAgdGhyb3cgc3luY0VycjtcbiAgICB9XG4gICAgcmV0dXJuIHN5bmNSZXN1bHQ7XG4gIH07XG59XG5cbi8vIHdyYXAgYWxsIGRlY2xhcmVkIENBTl9CRV9TWU5DIG1ldGhvZHMgaW4gdGhlIHN5bmMgd3JhcHBlclxuQ0FOX0JFX1NZTkMuZm9yRWFjaChmdW5jdGlvbihtZXRob2QpIHtcbiAgQ29va2llSmFyLnByb3RvdHlwZVttZXRob2QrJ1N5bmMnXSA9IHN5bmNXcmFwKG1ldGhvZCk7XG59KTtcblxuZXhwb3J0cy5Db29raWVKYXIgPSBDb29raWVKYXI7XG5leHBvcnRzLkNvb2tpZSA9IENvb2tpZTtcbmV4cG9ydHMuU3RvcmUgPSBTdG9yZTtcbmV4cG9ydHMuTWVtb3J5Q29va2llU3RvcmUgPSBNZW1vcnlDb29raWVTdG9yZTtcbmV4cG9ydHMucGFyc2VEYXRlID0gcGFyc2VEYXRlO1xuZXhwb3J0cy5mb3JtYXREYXRlID0gZm9ybWF0RGF0ZTtcbmV4cG9ydHMucGFyc2UgPSBwYXJzZTtcbmV4cG9ydHMuZnJvbUpTT04gPSBmcm9tSlNPTjtcbmV4cG9ydHMuZG9tYWluTWF0Y2ggPSBkb21haW5NYXRjaDtcbmV4cG9ydHMuZGVmYXVsdFBhdGggPSBkZWZhdWx0UGF0aDtcbmV4cG9ydHMucGF0aE1hdGNoID0gcGF0aE1hdGNoO1xuZXhwb3J0cy5nZXRQdWJsaWNTdWZmaXggPSBwdWJzdWZmaXguZ2V0UHVibGljU3VmZml4O1xuZXhwb3J0cy5jb29raWVDb21wYXJlID0gY29va2llQ29tcGFyZTtcbmV4cG9ydHMucGVybXV0ZURvbWFpbiA9IHJlcXVpcmUoJy4vcGVybXV0ZURvbWFpbicpLnBlcm11dGVEb21haW47XG5leHBvcnRzLnBlcm11dGVQYXRoID0gcGVybXV0ZVBhdGg7XG5leHBvcnRzLmNhbm9uaWNhbERvbWFpbiA9IGNhbm9uaWNhbERvbWFpbjtcbiIsIi8qIVxuICogQ29weXJpZ2h0IChjKSAyMDE1LCBTYWxlc2ZvcmNlLmNvbSwgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBSZWRpc3RyaWJ1dGlvbiBhbmQgdXNlIGluIHNvdXJjZSBhbmQgYmluYXJ5IGZvcm1zLCB3aXRoIG9yIHdpdGhvdXRcbiAqIG1vZGlmaWNhdGlvbiwgYXJlIHBlcm1pdHRlZCBwcm92aWRlZCB0aGF0IHRoZSBmb2xsb3dpbmcgY29uZGl0aW9ucyBhcmUgbWV0OlxuICpcbiAqIDEuIFJlZGlzdHJpYnV0aW9ucyBvZiBzb3VyY2UgY29kZSBtdXN0IHJldGFpbiB0aGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSxcbiAqIHRoaXMgbGlzdCBvZiBjb25kaXRpb25zIGFuZCB0aGUgZm9sbG93aW5nIGRpc2NsYWltZXIuXG4gKlxuICogMi4gUmVkaXN0cmlidXRpb25zIGluIGJpbmFyeSBmb3JtIG11c3QgcmVwcm9kdWNlIHRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlLFxuICogdGhpcyBsaXN0IG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lciBpbiB0aGUgZG9jdW1lbnRhdGlvblxuICogYW5kL29yIG90aGVyIG1hdGVyaWFscyBwcm92aWRlZCB3aXRoIHRoZSBkaXN0cmlidXRpb24uXG4gKlxuICogMy4gTmVpdGhlciB0aGUgbmFtZSBvZiBTYWxlc2ZvcmNlLmNvbSBub3IgdGhlIG5hbWVzIG9mIGl0cyBjb250cmlidXRvcnMgbWF5XG4gKiBiZSB1c2VkIHRvIGVuZG9yc2Ugb3IgcHJvbW90ZSBwcm9kdWN0cyBkZXJpdmVkIGZyb20gdGhpcyBzb2Z0d2FyZSB3aXRob3V0XG4gKiBzcGVjaWZpYyBwcmlvciB3cml0dGVuIHBlcm1pc3Npb24uXG4gKlxuICogVEhJUyBTT0ZUV0FSRSBJUyBQUk9WSURFRCBCWSBUSEUgQ09QWVJJR0hUIEhPTERFUlMgQU5EIENPTlRSSUJVVE9SUyBcIkFTIElTXCJcbiAqIEFORCBBTlkgRVhQUkVTUyBPUiBJTVBMSUVEIFdBUlJBTlRJRVMsIElOQ0xVRElORywgQlVUIE5PVCBMSU1JVEVEIFRPLCBUSEVcbiAqIElNUExJRUQgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFkgQU5EIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFXG4gKiBBUkUgRElTQ0xBSU1FRC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIENPUFlSSUdIVCBIT0xERVIgT1IgQ09OVFJJQlVUT1JTIEJFXG4gKiBMSUFCTEUgRk9SIEFOWSBESVJFQ1QsIElORElSRUNULCBJTkNJREVOVEFMLCBTUEVDSUFMLCBFWEVNUExBUlksIE9SXG4gKiBDT05TRVFVRU5USUFMIERBTUFHRVMgKElOQ0xVRElORywgQlVUIE5PVCBMSU1JVEVEIFRPLCBQUk9DVVJFTUVOVCBPRlxuICogU1VCU1RJVFVURSBHT09EUyBPUiBTRVJWSUNFUzsgTE9TUyBPRiBVU0UsIERBVEEsIE9SIFBST0ZJVFM7IE9SIEJVU0lORVNTXG4gKiBJTlRFUlJVUFRJT04pIEhPV0VWRVIgQ0FVU0VEIEFORCBPTiBBTlkgVEhFT1JZIE9GIExJQUJJTElUWSwgV0hFVEhFUiBJTlxuICogQ09OVFJBQ1QsIFNUUklDVCBMSUFCSUxJVFksIE9SIFRPUlQgKElOQ0xVRElORyBORUdMSUdFTkNFIE9SIE9USEVSV0lTRSlcbiAqIEFSSVNJTkcgSU4gQU5ZIFdBWSBPVVQgT0YgVEhFIFVTRSBPRiBUSElTIFNPRlRXQVJFLCBFVkVOIElGIEFEVklTRUQgT0YgVEhFXG4gKiBQT1NTSUJJTElUWSBPRiBTVUNIIERBTUFHRS5cbiAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG52YXIgcHVic3VmZml4ID0gcmVxdWlyZSgnLi9wdWJzdWZmaXgtcHNsJyk7XG5cbi8vIEdpdmVzIHRoZSBwZXJtdXRhdGlvbiBvZiBhbGwgcG9zc2libGUgZG9tYWluTWF0Y2goKWVzIG9mIGEgZ2l2ZW4gZG9tYWluLiBUaGVcbi8vIGFycmF5IGlzIGluIHNob3J0ZXN0LXRvLWxvbmdlc3Qgb3JkZXIuICBIYW5keSBmb3IgaW5kZXhpbmcuXG5mdW5jdGlvbiBwZXJtdXRlRG9tYWluIChkb21haW4pIHtcbiAgdmFyIHB1YlN1ZiA9IHB1YnN1ZmZpeC5nZXRQdWJsaWNTdWZmaXgoZG9tYWluKTtcbiAgaWYgKCFwdWJTdWYpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICBpZiAocHViU3VmID09IGRvbWFpbikge1xuICAgIHJldHVybiBbZG9tYWluXTtcbiAgfVxuXG4gIHZhciBwcmVmaXggPSBkb21haW4uc2xpY2UoMCwgLShwdWJTdWYubGVuZ3RoICsgMSkpOyAvLyBcIi5leGFtcGxlLmNvbVwiXG4gIHZhciBwYXJ0cyA9IHByZWZpeC5zcGxpdCgnLicpLnJldmVyc2UoKTtcbiAgdmFyIGN1ciA9IHB1YlN1ZjtcbiAgdmFyIHBlcm11dGF0aW9ucyA9IFtjdXJdO1xuICB3aGlsZSAocGFydHMubGVuZ3RoKSB7XG4gICAgY3VyID0gcGFydHMuc2hpZnQoKSArICcuJyArIGN1cjtcbiAgICBwZXJtdXRhdGlvbnMucHVzaChjdXIpO1xuICB9XG4gIHJldHVybiBwZXJtdXRhdGlvbnM7XG59XG5cbmV4cG9ydHMucGVybXV0ZURvbWFpbiA9IHBlcm11dGVEb21haW47XG4iXSwic291cmNlUm9vdCI6IiJ9