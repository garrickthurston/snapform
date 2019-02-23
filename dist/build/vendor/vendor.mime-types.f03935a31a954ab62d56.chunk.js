(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["vendor/vendor.mime-types"],{

/***/ "zB2q":
/*!******************************************!*\
  !*** ./node_modules/mime-types/index.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*!
 * mime-types
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */



/**
 * Module dependencies.
 * @private
 */

var db = __webpack_require__(/*! mime-db */ "tPXl")
var extname = __webpack_require__(/*! path */ "33yf").extname

/**
 * Module variables.
 * @private
 */

var EXTRACT_TYPE_REGEXP = /^\s*([^;\s]*)(?:;|\s|$)/
var TEXT_TYPE_REGEXP = /^text\//i

/**
 * Module exports.
 * @public
 */

exports.charset = charset
exports.charsets = { lookup: charset }
exports.contentType = contentType
exports.extension = extension
exports.extensions = Object.create(null)
exports.lookup = lookup
exports.types = Object.create(null)

// Populate the extensions/types maps
populateMaps(exports.extensions, exports.types)

/**
 * Get the default charset for a MIME type.
 *
 * @param {string} type
 * @return {boolean|string}
 */

function charset (type) {
  if (!type || typeof type !== 'string') {
    return false
  }

  // TODO: use media-typer
  var match = EXTRACT_TYPE_REGEXP.exec(type)
  var mime = match && db[match[1].toLowerCase()]

  if (mime && mime.charset) {
    return mime.charset
  }

  // default text/* to utf-8
  if (match && TEXT_TYPE_REGEXP.test(match[1])) {
    return 'UTF-8'
  }

  return false
}

/**
 * Create a full Content-Type header given a MIME type or extension.
 *
 * @param {string} str
 * @return {boolean|string}
 */

function contentType (str) {
  // TODO: should this even be in this module?
  if (!str || typeof str !== 'string') {
    return false
  }

  var mime = str.indexOf('/') === -1
    ? exports.lookup(str)
    : str

  if (!mime) {
    return false
  }

  // TODO: use content-type or other module
  if (mime.indexOf('charset') === -1) {
    var charset = exports.charset(mime)
    if (charset) mime += '; charset=' + charset.toLowerCase()
  }

  return mime
}

/**
 * Get the default extension for a MIME type.
 *
 * @param {string} type
 * @return {boolean|string}
 */

function extension (type) {
  if (!type || typeof type !== 'string') {
    return false
  }

  // TODO: use media-typer
  var match = EXTRACT_TYPE_REGEXP.exec(type)

  // get extensions
  var exts = match && exports.extensions[match[1].toLowerCase()]

  if (!exts || !exts.length) {
    return false
  }

  return exts[0]
}

/**
 * Lookup the MIME type for a file path/extension.
 *
 * @param {string} path
 * @return {boolean|string}
 */

function lookup (path) {
  if (!path || typeof path !== 'string') {
    return false
  }

  // get the extension ("ext" or ".ext" or full path)
  var extension = extname('x.' + path)
    .toLowerCase()
    .substr(1)

  if (!extension) {
    return false
  }

  return exports.types[extension] || false
}

/**
 * Populate the extensions and types maps.
 * @private
 */

function populateMaps (extensions, types) {
  // source preference (least -> most)
  var preference = ['nginx', 'apache', undefined, 'iana']

  Object.keys(db).forEach(function forEachMimeType (type) {
    var mime = db[type]
    var exts = mime.extensions

    if (!exts || !exts.length) {
      return
    }

    // mime -> extensions
    extensions[type] = exts

    // extension -> mime
    for (var i = 0; i < exts.length; i++) {
      var extension = exts[i]

      if (types[extension]) {
        var from = preference.indexOf(db[types[extension]].source)
        var to = preference.indexOf(mime.source)

        if (types[extension] !== 'application/octet-stream' &&
          (from > to || (from === to && types[extension].substr(0, 12) === 'application/'))) {
          // skip the remapping
          continue
        }
      }

      // set the extension -> mime
      types[extension] = type
    }
  })
}


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbWltZS10eXBlcy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVZOztBQUVaO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFNBQVMsbUJBQU8sQ0FBQyxxQkFBUztBQUMxQixjQUFjLG1CQUFPLENBQUMsa0JBQU07O0FBRTVCO0FBQ0E7QUFDQTtBQUNBOztBQUVBLG1DQUFtQyxTQUFTO0FBQzVDOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esb0JBQW9CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEIsWUFBWTtBQUNaOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEIsWUFBWTtBQUNaOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkI7QUFDM0I7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEIsWUFBWTtBQUNaOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEIsWUFBWTtBQUNaOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxtQkFBbUIsaUJBQWlCO0FBQ3BDOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIIiwiZmlsZSI6ImJ1aWxkL3ZlbmRvci92ZW5kb3IubWltZS10eXBlcy5mMDM5MzVhMzFhOTU0YWI2MmQ1Ni5jaHVuay5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxyXG4gKiBtaW1lLXR5cGVzXHJcbiAqIENvcHlyaWdodChjKSAyMDE0IEpvbmF0aGFuIE9uZ1xyXG4gKiBDb3B5cmlnaHQoYykgMjAxNSBEb3VnbGFzIENocmlzdG9waGVyIFdpbHNvblxyXG4gKiBNSVQgTGljZW5zZWRcclxuICovXHJcblxyXG4ndXNlIHN0cmljdCdcclxuXHJcbi8qKlxyXG4gKiBNb2R1bGUgZGVwZW5kZW5jaWVzLlxyXG4gKiBAcHJpdmF0ZVxyXG4gKi9cclxuXHJcbnZhciBkYiA9IHJlcXVpcmUoJ21pbWUtZGInKVxyXG52YXIgZXh0bmFtZSA9IHJlcXVpcmUoJ3BhdGgnKS5leHRuYW1lXHJcblxyXG4vKipcclxuICogTW9kdWxlIHZhcmlhYmxlcy5cclxuICogQHByaXZhdGVcclxuICovXHJcblxyXG52YXIgRVhUUkFDVF9UWVBFX1JFR0VYUCA9IC9eXFxzKihbXjtcXHNdKikoPzo7fFxcc3wkKS9cclxudmFyIFRFWFRfVFlQRV9SRUdFWFAgPSAvXnRleHRcXC8vaVxyXG5cclxuLyoqXHJcbiAqIE1vZHVsZSBleHBvcnRzLlxyXG4gKiBAcHVibGljXHJcbiAqL1xyXG5cclxuZXhwb3J0cy5jaGFyc2V0ID0gY2hhcnNldFxyXG5leHBvcnRzLmNoYXJzZXRzID0geyBsb29rdXA6IGNoYXJzZXQgfVxyXG5leHBvcnRzLmNvbnRlbnRUeXBlID0gY29udGVudFR5cGVcclxuZXhwb3J0cy5leHRlbnNpb24gPSBleHRlbnNpb25cclxuZXhwb3J0cy5leHRlbnNpb25zID0gT2JqZWN0LmNyZWF0ZShudWxsKVxyXG5leHBvcnRzLmxvb2t1cCA9IGxvb2t1cFxyXG5leHBvcnRzLnR5cGVzID0gT2JqZWN0LmNyZWF0ZShudWxsKVxyXG5cclxuLy8gUG9wdWxhdGUgdGhlIGV4dGVuc2lvbnMvdHlwZXMgbWFwc1xyXG5wb3B1bGF0ZU1hcHMoZXhwb3J0cy5leHRlbnNpb25zLCBleHBvcnRzLnR5cGVzKVxyXG5cclxuLyoqXHJcbiAqIEdldCB0aGUgZGVmYXVsdCBjaGFyc2V0IGZvciBhIE1JTUUgdHlwZS5cclxuICpcclxuICogQHBhcmFtIHtzdHJpbmd9IHR5cGVcclxuICogQHJldHVybiB7Ym9vbGVhbnxzdHJpbmd9XHJcbiAqL1xyXG5cclxuZnVuY3Rpb24gY2hhcnNldCAodHlwZSkge1xyXG4gIGlmICghdHlwZSB8fCB0eXBlb2YgdHlwZSAhPT0gJ3N0cmluZycpIHtcclxuICAgIHJldHVybiBmYWxzZVxyXG4gIH1cclxuXHJcbiAgLy8gVE9ETzogdXNlIG1lZGlhLXR5cGVyXHJcbiAgdmFyIG1hdGNoID0gRVhUUkFDVF9UWVBFX1JFR0VYUC5leGVjKHR5cGUpXHJcbiAgdmFyIG1pbWUgPSBtYXRjaCAmJiBkYlttYXRjaFsxXS50b0xvd2VyQ2FzZSgpXVxyXG5cclxuICBpZiAobWltZSAmJiBtaW1lLmNoYXJzZXQpIHtcclxuICAgIHJldHVybiBtaW1lLmNoYXJzZXRcclxuICB9XHJcblxyXG4gIC8vIGRlZmF1bHQgdGV4dC8qIHRvIHV0Zi04XHJcbiAgaWYgKG1hdGNoICYmIFRFWFRfVFlQRV9SRUdFWFAudGVzdChtYXRjaFsxXSkpIHtcclxuICAgIHJldHVybiAnVVRGLTgnXHJcbiAgfVxyXG5cclxuICByZXR1cm4gZmFsc2VcclxufVxyXG5cclxuLyoqXHJcbiAqIENyZWF0ZSBhIGZ1bGwgQ29udGVudC1UeXBlIGhlYWRlciBnaXZlbiBhIE1JTUUgdHlwZSBvciBleHRlbnNpb24uXHJcbiAqXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHJcclxuICogQHJldHVybiB7Ym9vbGVhbnxzdHJpbmd9XHJcbiAqL1xyXG5cclxuZnVuY3Rpb24gY29udGVudFR5cGUgKHN0cikge1xyXG4gIC8vIFRPRE86IHNob3VsZCB0aGlzIGV2ZW4gYmUgaW4gdGhpcyBtb2R1bGU/XHJcbiAgaWYgKCFzdHIgfHwgdHlwZW9mIHN0ciAhPT0gJ3N0cmluZycpIHtcclxuICAgIHJldHVybiBmYWxzZVxyXG4gIH1cclxuXHJcbiAgdmFyIG1pbWUgPSBzdHIuaW5kZXhPZignLycpID09PSAtMVxyXG4gICAgPyBleHBvcnRzLmxvb2t1cChzdHIpXHJcbiAgICA6IHN0clxyXG5cclxuICBpZiAoIW1pbWUpIHtcclxuICAgIHJldHVybiBmYWxzZVxyXG4gIH1cclxuXHJcbiAgLy8gVE9ETzogdXNlIGNvbnRlbnQtdHlwZSBvciBvdGhlciBtb2R1bGVcclxuICBpZiAobWltZS5pbmRleE9mKCdjaGFyc2V0JykgPT09IC0xKSB7XHJcbiAgICB2YXIgY2hhcnNldCA9IGV4cG9ydHMuY2hhcnNldChtaW1lKVxyXG4gICAgaWYgKGNoYXJzZXQpIG1pbWUgKz0gJzsgY2hhcnNldD0nICsgY2hhcnNldC50b0xvd2VyQ2FzZSgpXHJcbiAgfVxyXG5cclxuICByZXR1cm4gbWltZVxyXG59XHJcblxyXG4vKipcclxuICogR2V0IHRoZSBkZWZhdWx0IGV4dGVuc2lvbiBmb3IgYSBNSU1FIHR5cGUuXHJcbiAqXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSB0eXBlXHJcbiAqIEByZXR1cm4ge2Jvb2xlYW58c3RyaW5nfVxyXG4gKi9cclxuXHJcbmZ1bmN0aW9uIGV4dGVuc2lvbiAodHlwZSkge1xyXG4gIGlmICghdHlwZSB8fCB0eXBlb2YgdHlwZSAhPT0gJ3N0cmluZycpIHtcclxuICAgIHJldHVybiBmYWxzZVxyXG4gIH1cclxuXHJcbiAgLy8gVE9ETzogdXNlIG1lZGlhLXR5cGVyXHJcbiAgdmFyIG1hdGNoID0gRVhUUkFDVF9UWVBFX1JFR0VYUC5leGVjKHR5cGUpXHJcblxyXG4gIC8vIGdldCBleHRlbnNpb25zXHJcbiAgdmFyIGV4dHMgPSBtYXRjaCAmJiBleHBvcnRzLmV4dGVuc2lvbnNbbWF0Y2hbMV0udG9Mb3dlckNhc2UoKV1cclxuXHJcbiAgaWYgKCFleHRzIHx8ICFleHRzLmxlbmd0aCkge1xyXG4gICAgcmV0dXJuIGZhbHNlXHJcbiAgfVxyXG5cclxuICByZXR1cm4gZXh0c1swXVxyXG59XHJcblxyXG4vKipcclxuICogTG9va3VwIHRoZSBNSU1FIHR5cGUgZm9yIGEgZmlsZSBwYXRoL2V4dGVuc2lvbi5cclxuICpcclxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGhcclxuICogQHJldHVybiB7Ym9vbGVhbnxzdHJpbmd9XHJcbiAqL1xyXG5cclxuZnVuY3Rpb24gbG9va3VwIChwYXRoKSB7XHJcbiAgaWYgKCFwYXRoIHx8IHR5cGVvZiBwYXRoICE9PSAnc3RyaW5nJykge1xyXG4gICAgcmV0dXJuIGZhbHNlXHJcbiAgfVxyXG5cclxuICAvLyBnZXQgdGhlIGV4dGVuc2lvbiAoXCJleHRcIiBvciBcIi5leHRcIiBvciBmdWxsIHBhdGgpXHJcbiAgdmFyIGV4dGVuc2lvbiA9IGV4dG5hbWUoJ3guJyArIHBhdGgpXHJcbiAgICAudG9Mb3dlckNhc2UoKVxyXG4gICAgLnN1YnN0cigxKVxyXG5cclxuICBpZiAoIWV4dGVuc2lvbikge1xyXG4gICAgcmV0dXJuIGZhbHNlXHJcbiAgfVxyXG5cclxuICByZXR1cm4gZXhwb3J0cy50eXBlc1tleHRlbnNpb25dIHx8IGZhbHNlXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBQb3B1bGF0ZSB0aGUgZXh0ZW5zaW9ucyBhbmQgdHlwZXMgbWFwcy5cclxuICogQHByaXZhdGVcclxuICovXHJcblxyXG5mdW5jdGlvbiBwb3B1bGF0ZU1hcHMgKGV4dGVuc2lvbnMsIHR5cGVzKSB7XHJcbiAgLy8gc291cmNlIHByZWZlcmVuY2UgKGxlYXN0IC0+IG1vc3QpXHJcbiAgdmFyIHByZWZlcmVuY2UgPSBbJ25naW54JywgJ2FwYWNoZScsIHVuZGVmaW5lZCwgJ2lhbmEnXVxyXG5cclxuICBPYmplY3Qua2V5cyhkYikuZm9yRWFjaChmdW5jdGlvbiBmb3JFYWNoTWltZVR5cGUgKHR5cGUpIHtcclxuICAgIHZhciBtaW1lID0gZGJbdHlwZV1cclxuICAgIHZhciBleHRzID0gbWltZS5leHRlbnNpb25zXHJcblxyXG4gICAgaWYgKCFleHRzIHx8ICFleHRzLmxlbmd0aCkge1xyXG4gICAgICByZXR1cm5cclxuICAgIH1cclxuXHJcbiAgICAvLyBtaW1lIC0+IGV4dGVuc2lvbnNcclxuICAgIGV4dGVuc2lvbnNbdHlwZV0gPSBleHRzXHJcblxyXG4gICAgLy8gZXh0ZW5zaW9uIC0+IG1pbWVcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZXh0cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICB2YXIgZXh0ZW5zaW9uID0gZXh0c1tpXVxyXG5cclxuICAgICAgaWYgKHR5cGVzW2V4dGVuc2lvbl0pIHtcclxuICAgICAgICB2YXIgZnJvbSA9IHByZWZlcmVuY2UuaW5kZXhPZihkYlt0eXBlc1tleHRlbnNpb25dXS5zb3VyY2UpXHJcbiAgICAgICAgdmFyIHRvID0gcHJlZmVyZW5jZS5pbmRleE9mKG1pbWUuc291cmNlKVxyXG5cclxuICAgICAgICBpZiAodHlwZXNbZXh0ZW5zaW9uXSAhPT0gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbScgJiZcclxuICAgICAgICAgIChmcm9tID4gdG8gfHwgKGZyb20gPT09IHRvICYmIHR5cGVzW2V4dGVuc2lvbl0uc3Vic3RyKDAsIDEyKSA9PT0gJ2FwcGxpY2F0aW9uLycpKSkge1xyXG4gICAgICAgICAgLy8gc2tpcCB0aGUgcmVtYXBwaW5nXHJcbiAgICAgICAgICBjb250aW51ZVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gc2V0IHRoZSBleHRlbnNpb24gLT4gbWltZVxyXG4gICAgICB0eXBlc1tleHRlbnNpb25dID0gdHlwZVxyXG4gICAgfVxyXG4gIH0pXHJcbn1cclxuIl0sInNvdXJjZVJvb3QiOiIifQ==