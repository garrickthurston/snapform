(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["vendor/vendor.caseless"],{

/***/ "2loA":
/*!****************************************!*\
  !*** ./node_modules/caseless/index.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function Caseless (dict) {
  this.dict = dict || {}
}
Caseless.prototype.set = function (name, value, clobber) {
  if (typeof name === 'object') {
    for (var i in name) {
      this.set(i, name[i], value)
    }
  } else {
    if (typeof clobber === 'undefined') clobber = true
    var has = this.has(name)

    if (!clobber && has) this.dict[has] = this.dict[has] + ',' + value
    else this.dict[has || name] = value
    return has
  }
}
Caseless.prototype.has = function (name) {
  var keys = Object.keys(this.dict)
    , name = name.toLowerCase()
    ;
  for (var i=0;i<keys.length;i++) {
    if (keys[i].toLowerCase() === name) return keys[i]
  }
  return false
}
Caseless.prototype.get = function (name) {
  name = name.toLowerCase()
  var result, _key
  var headers = this.dict
  Object.keys(headers).forEach(function (key) {
    _key = key.toLowerCase()
    if (name === _key) result = headers[key]
  })
  return result
}
Caseless.prototype.swap = function (name) {
  var has = this.has(name)
  if (has === name) return
  if (!has) throw new Error('There is no header than matches "'+name+'"')
  this.dict[name] = this.dict[has]
  delete this.dict[has]
}
Caseless.prototype.del = function (name) {
  var has = this.has(name)
  return delete this.dict[has || name]
}

module.exports = function (dict) {return new Caseless(dict)}
module.exports.httpify = function (resp, headers) {
  var c = new Caseless(headers)
  resp.setHeader = function (key, value, clobber) {
    if (typeof value === 'undefined') return
    return c.set(key, value, clobber)
  }
  resp.hasHeader = function (key) {
    return c.has(key)
  }
  resp.getHeader = function (key) {
    return c.get(key)
  }
  resp.removeHeader = function (key) {
    return c.del(key)
  }
  resp.headers = c.dict
  return c
}


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY2FzZWxlc3MvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsY0FBYztBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGtDQUFrQztBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYnVpbGQvdmVuZG9yL3ZlbmRvci5jYXNlbGVzcy4xNzY2NTFmN2JlNDAxN2FiNWJmOS5jaHVuay5qcyIsInNvdXJjZXNDb250ZW50IjpbImZ1bmN0aW9uIENhc2VsZXNzIChkaWN0KSB7XHJcbiAgdGhpcy5kaWN0ID0gZGljdCB8fCB7fVxyXG59XHJcbkNhc2VsZXNzLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbiAobmFtZSwgdmFsdWUsIGNsb2JiZXIpIHtcclxuICBpZiAodHlwZW9mIG5hbWUgPT09ICdvYmplY3QnKSB7XHJcbiAgICBmb3IgKHZhciBpIGluIG5hbWUpIHtcclxuICAgICAgdGhpcy5zZXQoaSwgbmFtZVtpXSwgdmFsdWUpXHJcbiAgICB9XHJcbiAgfSBlbHNlIHtcclxuICAgIGlmICh0eXBlb2YgY2xvYmJlciA9PT0gJ3VuZGVmaW5lZCcpIGNsb2JiZXIgPSB0cnVlXHJcbiAgICB2YXIgaGFzID0gdGhpcy5oYXMobmFtZSlcclxuXHJcbiAgICBpZiAoIWNsb2JiZXIgJiYgaGFzKSB0aGlzLmRpY3RbaGFzXSA9IHRoaXMuZGljdFtoYXNdICsgJywnICsgdmFsdWVcclxuICAgIGVsc2UgdGhpcy5kaWN0W2hhcyB8fCBuYW1lXSA9IHZhbHVlXHJcbiAgICByZXR1cm4gaGFzXHJcbiAgfVxyXG59XHJcbkNhc2VsZXNzLnByb3RvdHlwZS5oYXMgPSBmdW5jdGlvbiAobmFtZSkge1xyXG4gIHZhciBrZXlzID0gT2JqZWN0LmtleXModGhpcy5kaWN0KVxyXG4gICAgLCBuYW1lID0gbmFtZS50b0xvd2VyQ2FzZSgpXHJcbiAgICA7XHJcbiAgZm9yICh2YXIgaT0wO2k8a2V5cy5sZW5ndGg7aSsrKSB7XHJcbiAgICBpZiAoa2V5c1tpXS50b0xvd2VyQ2FzZSgpID09PSBuYW1lKSByZXR1cm4ga2V5c1tpXVxyXG4gIH1cclxuICByZXR1cm4gZmFsc2VcclxufVxyXG5DYXNlbGVzcy5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gKG5hbWUpIHtcclxuICBuYW1lID0gbmFtZS50b0xvd2VyQ2FzZSgpXHJcbiAgdmFyIHJlc3VsdCwgX2tleVxyXG4gIHZhciBoZWFkZXJzID0gdGhpcy5kaWN0XHJcbiAgT2JqZWN0LmtleXMoaGVhZGVycykuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICBfa2V5ID0ga2V5LnRvTG93ZXJDYXNlKClcclxuICAgIGlmIChuYW1lID09PSBfa2V5KSByZXN1bHQgPSBoZWFkZXJzW2tleV1cclxuICB9KVxyXG4gIHJldHVybiByZXN1bHRcclxufVxyXG5DYXNlbGVzcy5wcm90b3R5cGUuc3dhcCA9IGZ1bmN0aW9uIChuYW1lKSB7XHJcbiAgdmFyIGhhcyA9IHRoaXMuaGFzKG5hbWUpXHJcbiAgaWYgKGhhcyA9PT0gbmFtZSkgcmV0dXJuXHJcbiAgaWYgKCFoYXMpIHRocm93IG5ldyBFcnJvcignVGhlcmUgaXMgbm8gaGVhZGVyIHRoYW4gbWF0Y2hlcyBcIicrbmFtZSsnXCInKVxyXG4gIHRoaXMuZGljdFtuYW1lXSA9IHRoaXMuZGljdFtoYXNdXHJcbiAgZGVsZXRlIHRoaXMuZGljdFtoYXNdXHJcbn1cclxuQ2FzZWxlc3MucHJvdG90eXBlLmRlbCA9IGZ1bmN0aW9uIChuYW1lKSB7XHJcbiAgdmFyIGhhcyA9IHRoaXMuaGFzKG5hbWUpXHJcbiAgcmV0dXJuIGRlbGV0ZSB0aGlzLmRpY3RbaGFzIHx8IG5hbWVdXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGRpY3QpIHtyZXR1cm4gbmV3IENhc2VsZXNzKGRpY3QpfVxyXG5tb2R1bGUuZXhwb3J0cy5odHRwaWZ5ID0gZnVuY3Rpb24gKHJlc3AsIGhlYWRlcnMpIHtcclxuICB2YXIgYyA9IG5ldyBDYXNlbGVzcyhoZWFkZXJzKVxyXG4gIHJlc3Auc2V0SGVhZGVyID0gZnVuY3Rpb24gKGtleSwgdmFsdWUsIGNsb2JiZXIpIHtcclxuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICd1bmRlZmluZWQnKSByZXR1cm5cclxuICAgIHJldHVybiBjLnNldChrZXksIHZhbHVlLCBjbG9iYmVyKVxyXG4gIH1cclxuICByZXNwLmhhc0hlYWRlciA9IGZ1bmN0aW9uIChrZXkpIHtcclxuICAgIHJldHVybiBjLmhhcyhrZXkpXHJcbiAgfVxyXG4gIHJlc3AuZ2V0SGVhZGVyID0gZnVuY3Rpb24gKGtleSkge1xyXG4gICAgcmV0dXJuIGMuZ2V0KGtleSlcclxuICB9XHJcbiAgcmVzcC5yZW1vdmVIZWFkZXIgPSBmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICByZXR1cm4gYy5kZWwoa2V5KVxyXG4gIH1cclxuICByZXNwLmhlYWRlcnMgPSBjLmRpY3RcclxuICByZXR1cm4gY1xyXG59XHJcbiJdLCJzb3VyY2VSb290IjoiIn0=