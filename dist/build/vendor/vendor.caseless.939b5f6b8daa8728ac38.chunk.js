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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY2FzZWxlc3MvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsY0FBYztBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGtDQUFrQztBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYnVpbGQvdmVuZG9yL3ZlbmRvci5jYXNlbGVzcy45MzliNWY2YjhkYWE4NzI4YWMzOC5jaHVuay5qcyIsInNvdXJjZXNDb250ZW50IjpbImZ1bmN0aW9uIENhc2VsZXNzIChkaWN0KSB7XG4gIHRoaXMuZGljdCA9IGRpY3QgfHwge31cbn1cbkNhc2VsZXNzLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbiAobmFtZSwgdmFsdWUsIGNsb2JiZXIpIHtcbiAgaWYgKHR5cGVvZiBuYW1lID09PSAnb2JqZWN0Jykge1xuICAgIGZvciAodmFyIGkgaW4gbmFtZSkge1xuICAgICAgdGhpcy5zZXQoaSwgbmFtZVtpXSwgdmFsdWUpXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmICh0eXBlb2YgY2xvYmJlciA9PT0gJ3VuZGVmaW5lZCcpIGNsb2JiZXIgPSB0cnVlXG4gICAgdmFyIGhhcyA9IHRoaXMuaGFzKG5hbWUpXG5cbiAgICBpZiAoIWNsb2JiZXIgJiYgaGFzKSB0aGlzLmRpY3RbaGFzXSA9IHRoaXMuZGljdFtoYXNdICsgJywnICsgdmFsdWVcbiAgICBlbHNlIHRoaXMuZGljdFtoYXMgfHwgbmFtZV0gPSB2YWx1ZVxuICAgIHJldHVybiBoYXNcbiAgfVxufVxuQ2FzZWxlc3MucHJvdG90eXBlLmhhcyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gIHZhciBrZXlzID0gT2JqZWN0LmtleXModGhpcy5kaWN0KVxuICAgICwgbmFtZSA9IG5hbWUudG9Mb3dlckNhc2UoKVxuICAgIDtcbiAgZm9yICh2YXIgaT0wO2k8a2V5cy5sZW5ndGg7aSsrKSB7XG4gICAgaWYgKGtleXNbaV0udG9Mb3dlckNhc2UoKSA9PT0gbmFtZSkgcmV0dXJuIGtleXNbaV1cbiAgfVxuICByZXR1cm4gZmFsc2Vcbn1cbkNhc2VsZXNzLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiAobmFtZSkge1xuICBuYW1lID0gbmFtZS50b0xvd2VyQ2FzZSgpXG4gIHZhciByZXN1bHQsIF9rZXlcbiAgdmFyIGhlYWRlcnMgPSB0aGlzLmRpY3RcbiAgT2JqZWN0LmtleXMoaGVhZGVycykuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgX2tleSA9IGtleS50b0xvd2VyQ2FzZSgpXG4gICAgaWYgKG5hbWUgPT09IF9rZXkpIHJlc3VsdCA9IGhlYWRlcnNba2V5XVxuICB9KVxuICByZXR1cm4gcmVzdWx0XG59XG5DYXNlbGVzcy5wcm90b3R5cGUuc3dhcCA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gIHZhciBoYXMgPSB0aGlzLmhhcyhuYW1lKVxuICBpZiAoaGFzID09PSBuYW1lKSByZXR1cm5cbiAgaWYgKCFoYXMpIHRocm93IG5ldyBFcnJvcignVGhlcmUgaXMgbm8gaGVhZGVyIHRoYW4gbWF0Y2hlcyBcIicrbmFtZSsnXCInKVxuICB0aGlzLmRpY3RbbmFtZV0gPSB0aGlzLmRpY3RbaGFzXVxuICBkZWxldGUgdGhpcy5kaWN0W2hhc11cbn1cbkNhc2VsZXNzLnByb3RvdHlwZS5kZWwgPSBmdW5jdGlvbiAobmFtZSkge1xuICB2YXIgaGFzID0gdGhpcy5oYXMobmFtZSlcbiAgcmV0dXJuIGRlbGV0ZSB0aGlzLmRpY3RbaGFzIHx8IG5hbWVdXG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGRpY3QpIHtyZXR1cm4gbmV3IENhc2VsZXNzKGRpY3QpfVxubW9kdWxlLmV4cG9ydHMuaHR0cGlmeSA9IGZ1bmN0aW9uIChyZXNwLCBoZWFkZXJzKSB7XG4gIHZhciBjID0gbmV3IENhc2VsZXNzKGhlYWRlcnMpXG4gIHJlc3Auc2V0SGVhZGVyID0gZnVuY3Rpb24gKGtleSwgdmFsdWUsIGNsb2JiZXIpIHtcbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSAndW5kZWZpbmVkJykgcmV0dXJuXG4gICAgcmV0dXJuIGMuc2V0KGtleSwgdmFsdWUsIGNsb2JiZXIpXG4gIH1cbiAgcmVzcC5oYXNIZWFkZXIgPSBmdW5jdGlvbiAoa2V5KSB7XG4gICAgcmV0dXJuIGMuaGFzKGtleSlcbiAgfVxuICByZXNwLmdldEhlYWRlciA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgICByZXR1cm4gYy5nZXQoa2V5KVxuICB9XG4gIHJlc3AucmVtb3ZlSGVhZGVyID0gZnVuY3Rpb24gKGtleSkge1xuICAgIHJldHVybiBjLmRlbChrZXkpXG4gIH1cbiAgcmVzcC5oZWFkZXJzID0gYy5kaWN0XG4gIHJldHVybiBjXG59XG4iXSwic291cmNlUm9vdCI6IiJ9