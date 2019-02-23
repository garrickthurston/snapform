(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["vendor/vendor.tunnel-agent"],{

/***/ "CQoD":
/*!********************************************!*\
  !*** ./node_modules/tunnel-agent/index.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process, console) {

var net = __webpack_require__(/*! net */ "Po9p")
  , tls = __webpack_require__(/*! tls */ "Po9p")
  , http = __webpack_require__(/*! http */ "lJCZ")
  , https = __webpack_require__(/*! https */ "JPgR")
  , events = __webpack_require__(/*! events */ "+qE3")
  , assert = __webpack_require__(/*! assert */ "9lTW")
  , util = __webpack_require__(/*! util */ "7tlc")
  , Buffer = __webpack_require__(/*! safe-buffer */ "hwdV").Buffer
  ;

exports.httpOverHttp = httpOverHttp
exports.httpsOverHttp = httpsOverHttp
exports.httpOverHttps = httpOverHttps
exports.httpsOverHttps = httpsOverHttps


function httpOverHttp(options) {
  var agent = new TunnelingAgent(options)
  agent.request = http.request
  return agent
}

function httpsOverHttp(options) {
  var agent = new TunnelingAgent(options)
  agent.request = http.request
  agent.createSocket = createSecureSocket
  agent.defaultPort = 443
  return agent
}

function httpOverHttps(options) {
  var agent = new TunnelingAgent(options)
  agent.request = https.request
  return agent
}

function httpsOverHttps(options) {
  var agent = new TunnelingAgent(options)
  agent.request = https.request
  agent.createSocket = createSecureSocket
  agent.defaultPort = 443
  return agent
}


function TunnelingAgent(options) {
  var self = this
  self.options = options || {}
  self.proxyOptions = self.options.proxy || {}
  self.maxSockets = self.options.maxSockets || http.Agent.defaultMaxSockets
  self.requests = []
  self.sockets = []

  self.on('free', function onFree(socket, host, port) {
    for (var i = 0, len = self.requests.length; i < len; ++i) {
      var pending = self.requests[i]
      if (pending.host === host && pending.port === port) {
        // Detect the request to connect same origin server,
        // reuse the connection.
        self.requests.splice(i, 1)
        pending.request.onSocket(socket)
        return
      }
    }
    socket.destroy()
    self.removeSocket(socket)
  })
}
util.inherits(TunnelingAgent, events.EventEmitter)

TunnelingAgent.prototype.addRequest = function addRequest(req, options) {
  var self = this

   // Legacy API: addRequest(req, host, port, path)
  if (typeof options === 'string') {
    options = {
      host: options,
      port: arguments[2],
      path: arguments[3]
    };
  }

  if (self.sockets.length >= this.maxSockets) {
    // We are over limit so we'll add it to the queue.
    self.requests.push({host: options.host, port: options.port, request: req})
    return
  }

  // If we are under maxSockets create a new one.
  self.createConnection({host: options.host, port: options.port, request: req})
}

TunnelingAgent.prototype.createConnection = function createConnection(pending) {
  var self = this

  self.createSocket(pending, function(socket) {
    socket.on('free', onFree)
    socket.on('close', onCloseOrRemove)
    socket.on('agentRemove', onCloseOrRemove)
    pending.request.onSocket(socket)

    function onFree() {
      self.emit('free', socket, pending.host, pending.port)
    }

    function onCloseOrRemove(err) {
      self.removeSocket(socket)
      socket.removeListener('free', onFree)
      socket.removeListener('close', onCloseOrRemove)
      socket.removeListener('agentRemove', onCloseOrRemove)
    }
  })
}

TunnelingAgent.prototype.createSocket = function createSocket(options, cb) {
  var self = this
  var placeholder = {}
  self.sockets.push(placeholder)

  var connectOptions = mergeOptions({}, self.proxyOptions,
    { method: 'CONNECT'
    , path: options.host + ':' + options.port
    , agent: false
    }
  )
  if (connectOptions.proxyAuth) {
    connectOptions.headers = connectOptions.headers || {}
    connectOptions.headers['Proxy-Authorization'] = 'Basic ' +
        Buffer.from(connectOptions.proxyAuth).toString('base64')
  }

  debug('making CONNECT request')
  var connectReq = self.request(connectOptions)
  connectReq.useChunkedEncodingByDefault = false // for v0.6
  connectReq.once('response', onResponse) // for v0.6
  connectReq.once('upgrade', onUpgrade)   // for v0.6
  connectReq.once('connect', onConnect)   // for v0.7 or later
  connectReq.once('error', onError)
  connectReq.end()

  function onResponse(res) {
    // Very hacky. This is necessary to avoid http-parser leaks.
    res.upgrade = true
  }

  function onUpgrade(res, socket, head) {
    // Hacky.
    process.nextTick(function() {
      onConnect(res, socket, head)
    })
  }

  function onConnect(res, socket, head) {
    connectReq.removeAllListeners()
    socket.removeAllListeners()

    if (res.statusCode === 200) {
      assert.equal(head.length, 0)
      debug('tunneling connection has established')
      self.sockets[self.sockets.indexOf(placeholder)] = socket
      cb(socket)
    } else {
      debug('tunneling socket could not be established, statusCode=%d', res.statusCode)
      var error = new Error('tunneling socket could not be established, ' + 'statusCode=' + res.statusCode)
      error.code = 'ECONNRESET'
      options.request.emit('error', error)
      self.removeSocket(placeholder)
    }
  }

  function onError(cause) {
    connectReq.removeAllListeners()

    debug('tunneling socket could not be established, cause=%s\n', cause.message, cause.stack)
    var error = new Error('tunneling socket could not be established, ' + 'cause=' + cause.message)
    error.code = 'ECONNRESET'
    options.request.emit('error', error)
    self.removeSocket(placeholder)
  }
}

TunnelingAgent.prototype.removeSocket = function removeSocket(socket) {
  var pos = this.sockets.indexOf(socket)
  if (pos === -1) return

  this.sockets.splice(pos, 1)

  var pending = this.requests.shift()
  if (pending) {
    // If we have pending requests and a socket gets closed a new one
    // needs to be created to take over in the pool for the one that closed.
    this.createConnection(pending)
  }
}

function createSecureSocket(options, cb) {
  var self = this
  TunnelingAgent.prototype.createSocket.call(self, options, function(socket) {
    // 0 is dummy port for v0.6
    var secureSocket = tls.connect(0, mergeOptions({}, self.options,
      { servername: options.host
      , socket: socket
      }
    ))
    self.sockets[self.sockets.indexOf(socket)] = secureSocket
    cb(secureSocket)
  })
}


function mergeOptions(target) {
  for (var i = 1, len = arguments.length; i < len; ++i) {
    var overrides = arguments[i]
    if (typeof overrides === 'object') {
      var keys = Object.keys(overrides)
      for (var j = 0, keyLen = keys.length; j < keyLen; ++j) {
        var k = keys[j]
        if (overrides[k] !== undefined) {
          target[k] = overrides[k]
        }
      }
    }
  }
  return target
}


var debug
if (process.env.NODE_DEBUG && /\btunnel\b/.test(process.env.NODE_DEBUG)) {
  debug = function() {
    var args = Array.prototype.slice.call(arguments)
    if (typeof args[0] === 'string') {
      args[0] = 'TUNNEL: ' + args[0]
    } else {
      args.unshift('TUNNEL:')
    }
    console.error.apply(console, args)
  }
} else {
  debug = function() {}
}
exports.debug = debug // for test

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../process/browser.js */ "8oxB"), __webpack_require__(/*! ./../console-browserify/index.js */ "ziTh")))

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdHVubmVsLWFnZW50L2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSx3REFBWTs7QUFFWixVQUFVLG1CQUFPLENBQUMsaUJBQUs7QUFDdkIsVUFBVSxtQkFBTyxDQUFDLGlCQUFLO0FBQ3ZCLFdBQVcsbUJBQU8sQ0FBQyxrQkFBTTtBQUN6QixZQUFZLG1CQUFPLENBQUMsbUJBQU87QUFDM0IsYUFBYSxtQkFBTyxDQUFDLG9CQUFRO0FBQzdCLGFBQWEsbUJBQU8sQ0FBQyxvQkFBUTtBQUM3QixXQUFXLG1CQUFPLENBQUMsa0JBQU07QUFDekIsYUFBYSxtQkFBTyxDQUFDLHlCQUFhO0FBQ2xDOztBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsK0NBQStDLFNBQVM7QUFDeEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esd0JBQXdCLHFEQUFxRDtBQUM3RTtBQUNBOztBQUVBO0FBQ0EseUJBQXlCLHFEQUFxRDtBQUM5RTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxzQ0FBc0M7QUFDdEMsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscURBQXFEO0FBQ3JELE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOzs7QUFHQTtBQUNBLHlDQUF5QyxTQUFTO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBLDJDQUEyQyxZQUFZO0FBQ3ZEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQSIsImZpbGUiOiJidWlsZC92ZW5kb3IvdmVuZG9yLnR1bm5lbC1hZ2VudC5lMzExOWE4MTdhMzgzZTA3MWFiMi5jaHVuay5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0J1xyXG5cclxudmFyIG5ldCA9IHJlcXVpcmUoJ25ldCcpXHJcbiAgLCB0bHMgPSByZXF1aXJlKCd0bHMnKVxyXG4gICwgaHR0cCA9IHJlcXVpcmUoJ2h0dHAnKVxyXG4gICwgaHR0cHMgPSByZXF1aXJlKCdodHRwcycpXHJcbiAgLCBldmVudHMgPSByZXF1aXJlKCdldmVudHMnKVxyXG4gICwgYXNzZXJ0ID0gcmVxdWlyZSgnYXNzZXJ0JylcclxuICAsIHV0aWwgPSByZXF1aXJlKCd1dGlsJylcclxuICAsIEJ1ZmZlciA9IHJlcXVpcmUoJ3NhZmUtYnVmZmVyJykuQnVmZmVyXHJcbiAgO1xyXG5cclxuZXhwb3J0cy5odHRwT3Zlckh0dHAgPSBodHRwT3Zlckh0dHBcclxuZXhwb3J0cy5odHRwc092ZXJIdHRwID0gaHR0cHNPdmVySHR0cFxyXG5leHBvcnRzLmh0dHBPdmVySHR0cHMgPSBodHRwT3Zlckh0dHBzXHJcbmV4cG9ydHMuaHR0cHNPdmVySHR0cHMgPSBodHRwc092ZXJIdHRwc1xyXG5cclxuXHJcbmZ1bmN0aW9uIGh0dHBPdmVySHR0cChvcHRpb25zKSB7XHJcbiAgdmFyIGFnZW50ID0gbmV3IFR1bm5lbGluZ0FnZW50KG9wdGlvbnMpXHJcbiAgYWdlbnQucmVxdWVzdCA9IGh0dHAucmVxdWVzdFxyXG4gIHJldHVybiBhZ2VudFxyXG59XHJcblxyXG5mdW5jdGlvbiBodHRwc092ZXJIdHRwKG9wdGlvbnMpIHtcclxuICB2YXIgYWdlbnQgPSBuZXcgVHVubmVsaW5nQWdlbnQob3B0aW9ucylcclxuICBhZ2VudC5yZXF1ZXN0ID0gaHR0cC5yZXF1ZXN0XHJcbiAgYWdlbnQuY3JlYXRlU29ja2V0ID0gY3JlYXRlU2VjdXJlU29ja2V0XHJcbiAgYWdlbnQuZGVmYXVsdFBvcnQgPSA0NDNcclxuICByZXR1cm4gYWdlbnRcclxufVxyXG5cclxuZnVuY3Rpb24gaHR0cE92ZXJIdHRwcyhvcHRpb25zKSB7XHJcbiAgdmFyIGFnZW50ID0gbmV3IFR1bm5lbGluZ0FnZW50KG9wdGlvbnMpXHJcbiAgYWdlbnQucmVxdWVzdCA9IGh0dHBzLnJlcXVlc3RcclxuICByZXR1cm4gYWdlbnRcclxufVxyXG5cclxuZnVuY3Rpb24gaHR0cHNPdmVySHR0cHMob3B0aW9ucykge1xyXG4gIHZhciBhZ2VudCA9IG5ldyBUdW5uZWxpbmdBZ2VudChvcHRpb25zKVxyXG4gIGFnZW50LnJlcXVlc3QgPSBodHRwcy5yZXF1ZXN0XHJcbiAgYWdlbnQuY3JlYXRlU29ja2V0ID0gY3JlYXRlU2VjdXJlU29ja2V0XHJcbiAgYWdlbnQuZGVmYXVsdFBvcnQgPSA0NDNcclxuICByZXR1cm4gYWdlbnRcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIFR1bm5lbGluZ0FnZW50KG9wdGlvbnMpIHtcclxuICB2YXIgc2VsZiA9IHRoaXNcclxuICBzZWxmLm9wdGlvbnMgPSBvcHRpb25zIHx8IHt9XHJcbiAgc2VsZi5wcm94eU9wdGlvbnMgPSBzZWxmLm9wdGlvbnMucHJveHkgfHwge31cclxuICBzZWxmLm1heFNvY2tldHMgPSBzZWxmLm9wdGlvbnMubWF4U29ja2V0cyB8fCBodHRwLkFnZW50LmRlZmF1bHRNYXhTb2NrZXRzXHJcbiAgc2VsZi5yZXF1ZXN0cyA9IFtdXHJcbiAgc2VsZi5zb2NrZXRzID0gW11cclxuXHJcbiAgc2VsZi5vbignZnJlZScsIGZ1bmN0aW9uIG9uRnJlZShzb2NrZXQsIGhvc3QsIHBvcnQpIHtcclxuICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBzZWxmLnJlcXVlc3RzLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XHJcbiAgICAgIHZhciBwZW5kaW5nID0gc2VsZi5yZXF1ZXN0c1tpXVxyXG4gICAgICBpZiAocGVuZGluZy5ob3N0ID09PSBob3N0ICYmIHBlbmRpbmcucG9ydCA9PT0gcG9ydCkge1xyXG4gICAgICAgIC8vIERldGVjdCB0aGUgcmVxdWVzdCB0byBjb25uZWN0IHNhbWUgb3JpZ2luIHNlcnZlcixcclxuICAgICAgICAvLyByZXVzZSB0aGUgY29ubmVjdGlvbi5cclxuICAgICAgICBzZWxmLnJlcXVlc3RzLnNwbGljZShpLCAxKVxyXG4gICAgICAgIHBlbmRpbmcucmVxdWVzdC5vblNvY2tldChzb2NrZXQpXHJcbiAgICAgICAgcmV0dXJuXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHNvY2tldC5kZXN0cm95KClcclxuICAgIHNlbGYucmVtb3ZlU29ja2V0KHNvY2tldClcclxuICB9KVxyXG59XHJcbnV0aWwuaW5oZXJpdHMoVHVubmVsaW5nQWdlbnQsIGV2ZW50cy5FdmVudEVtaXR0ZXIpXHJcblxyXG5UdW5uZWxpbmdBZ2VudC5wcm90b3R5cGUuYWRkUmVxdWVzdCA9IGZ1bmN0aW9uIGFkZFJlcXVlc3QocmVxLCBvcHRpb25zKSB7XHJcbiAgdmFyIHNlbGYgPSB0aGlzXHJcblxyXG4gICAvLyBMZWdhY3kgQVBJOiBhZGRSZXF1ZXN0KHJlcSwgaG9zdCwgcG9ydCwgcGF0aClcclxuICBpZiAodHlwZW9mIG9wdGlvbnMgPT09ICdzdHJpbmcnKSB7XHJcbiAgICBvcHRpb25zID0ge1xyXG4gICAgICBob3N0OiBvcHRpb25zLFxyXG4gICAgICBwb3J0OiBhcmd1bWVudHNbMl0sXHJcbiAgICAgIHBhdGg6IGFyZ3VtZW50c1szXVxyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIGlmIChzZWxmLnNvY2tldHMubGVuZ3RoID49IHRoaXMubWF4U29ja2V0cykge1xyXG4gICAgLy8gV2UgYXJlIG92ZXIgbGltaXQgc28gd2UnbGwgYWRkIGl0IHRvIHRoZSBxdWV1ZS5cclxuICAgIHNlbGYucmVxdWVzdHMucHVzaCh7aG9zdDogb3B0aW9ucy5ob3N0LCBwb3J0OiBvcHRpb25zLnBvcnQsIHJlcXVlc3Q6IHJlcX0pXHJcbiAgICByZXR1cm5cclxuICB9XHJcblxyXG4gIC8vIElmIHdlIGFyZSB1bmRlciBtYXhTb2NrZXRzIGNyZWF0ZSBhIG5ldyBvbmUuXHJcbiAgc2VsZi5jcmVhdGVDb25uZWN0aW9uKHtob3N0OiBvcHRpb25zLmhvc3QsIHBvcnQ6IG9wdGlvbnMucG9ydCwgcmVxdWVzdDogcmVxfSlcclxufVxyXG5cclxuVHVubmVsaW5nQWdlbnQucHJvdG90eXBlLmNyZWF0ZUNvbm5lY3Rpb24gPSBmdW5jdGlvbiBjcmVhdGVDb25uZWN0aW9uKHBlbmRpbmcpIHtcclxuICB2YXIgc2VsZiA9IHRoaXNcclxuXHJcbiAgc2VsZi5jcmVhdGVTb2NrZXQocGVuZGluZywgZnVuY3Rpb24oc29ja2V0KSB7XHJcbiAgICBzb2NrZXQub24oJ2ZyZWUnLCBvbkZyZWUpXHJcbiAgICBzb2NrZXQub24oJ2Nsb3NlJywgb25DbG9zZU9yUmVtb3ZlKVxyXG4gICAgc29ja2V0Lm9uKCdhZ2VudFJlbW92ZScsIG9uQ2xvc2VPclJlbW92ZSlcclxuICAgIHBlbmRpbmcucmVxdWVzdC5vblNvY2tldChzb2NrZXQpXHJcblxyXG4gICAgZnVuY3Rpb24gb25GcmVlKCkge1xyXG4gICAgICBzZWxmLmVtaXQoJ2ZyZWUnLCBzb2NrZXQsIHBlbmRpbmcuaG9zdCwgcGVuZGluZy5wb3J0KVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIG9uQ2xvc2VPclJlbW92ZShlcnIpIHtcclxuICAgICAgc2VsZi5yZW1vdmVTb2NrZXQoc29ja2V0KVxyXG4gICAgICBzb2NrZXQucmVtb3ZlTGlzdGVuZXIoJ2ZyZWUnLCBvbkZyZWUpXHJcbiAgICAgIHNvY2tldC5yZW1vdmVMaXN0ZW5lcignY2xvc2UnLCBvbkNsb3NlT3JSZW1vdmUpXHJcbiAgICAgIHNvY2tldC5yZW1vdmVMaXN0ZW5lcignYWdlbnRSZW1vdmUnLCBvbkNsb3NlT3JSZW1vdmUpXHJcbiAgICB9XHJcbiAgfSlcclxufVxyXG5cclxuVHVubmVsaW5nQWdlbnQucHJvdG90eXBlLmNyZWF0ZVNvY2tldCA9IGZ1bmN0aW9uIGNyZWF0ZVNvY2tldChvcHRpb25zLCBjYikge1xyXG4gIHZhciBzZWxmID0gdGhpc1xyXG4gIHZhciBwbGFjZWhvbGRlciA9IHt9XHJcbiAgc2VsZi5zb2NrZXRzLnB1c2gocGxhY2Vob2xkZXIpXHJcblxyXG4gIHZhciBjb25uZWN0T3B0aW9ucyA9IG1lcmdlT3B0aW9ucyh7fSwgc2VsZi5wcm94eU9wdGlvbnMsXHJcbiAgICB7IG1ldGhvZDogJ0NPTk5FQ1QnXHJcbiAgICAsIHBhdGg6IG9wdGlvbnMuaG9zdCArICc6JyArIG9wdGlvbnMucG9ydFxyXG4gICAgLCBhZ2VudDogZmFsc2VcclxuICAgIH1cclxuICApXHJcbiAgaWYgKGNvbm5lY3RPcHRpb25zLnByb3h5QXV0aCkge1xyXG4gICAgY29ubmVjdE9wdGlvbnMuaGVhZGVycyA9IGNvbm5lY3RPcHRpb25zLmhlYWRlcnMgfHwge31cclxuICAgIGNvbm5lY3RPcHRpb25zLmhlYWRlcnNbJ1Byb3h5LUF1dGhvcml6YXRpb24nXSA9ICdCYXNpYyAnICtcclxuICAgICAgICBCdWZmZXIuZnJvbShjb25uZWN0T3B0aW9ucy5wcm94eUF1dGgpLnRvU3RyaW5nKCdiYXNlNjQnKVxyXG4gIH1cclxuXHJcbiAgZGVidWcoJ21ha2luZyBDT05ORUNUIHJlcXVlc3QnKVxyXG4gIHZhciBjb25uZWN0UmVxID0gc2VsZi5yZXF1ZXN0KGNvbm5lY3RPcHRpb25zKVxyXG4gIGNvbm5lY3RSZXEudXNlQ2h1bmtlZEVuY29kaW5nQnlEZWZhdWx0ID0gZmFsc2UgLy8gZm9yIHYwLjZcclxuICBjb25uZWN0UmVxLm9uY2UoJ3Jlc3BvbnNlJywgb25SZXNwb25zZSkgLy8gZm9yIHYwLjZcclxuICBjb25uZWN0UmVxLm9uY2UoJ3VwZ3JhZGUnLCBvblVwZ3JhZGUpICAgLy8gZm9yIHYwLjZcclxuICBjb25uZWN0UmVxLm9uY2UoJ2Nvbm5lY3QnLCBvbkNvbm5lY3QpICAgLy8gZm9yIHYwLjcgb3IgbGF0ZXJcclxuICBjb25uZWN0UmVxLm9uY2UoJ2Vycm9yJywgb25FcnJvcilcclxuICBjb25uZWN0UmVxLmVuZCgpXHJcblxyXG4gIGZ1bmN0aW9uIG9uUmVzcG9uc2UocmVzKSB7XHJcbiAgICAvLyBWZXJ5IGhhY2t5LiBUaGlzIGlzIG5lY2Vzc2FyeSB0byBhdm9pZCBodHRwLXBhcnNlciBsZWFrcy5cclxuICAgIHJlcy51cGdyYWRlID0gdHJ1ZVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gb25VcGdyYWRlKHJlcywgc29ja2V0LCBoZWFkKSB7XHJcbiAgICAvLyBIYWNreS5cclxuICAgIHByb2Nlc3MubmV4dFRpY2soZnVuY3Rpb24oKSB7XHJcbiAgICAgIG9uQ29ubmVjdChyZXMsIHNvY2tldCwgaGVhZClcclxuICAgIH0pXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBvbkNvbm5lY3QocmVzLCBzb2NrZXQsIGhlYWQpIHtcclxuICAgIGNvbm5lY3RSZXEucmVtb3ZlQWxsTGlzdGVuZXJzKClcclxuICAgIHNvY2tldC5yZW1vdmVBbGxMaXN0ZW5lcnMoKVxyXG5cclxuICAgIGlmIChyZXMuc3RhdHVzQ29kZSA9PT0gMjAwKSB7XHJcbiAgICAgIGFzc2VydC5lcXVhbChoZWFkLmxlbmd0aCwgMClcclxuICAgICAgZGVidWcoJ3R1bm5lbGluZyBjb25uZWN0aW9uIGhhcyBlc3RhYmxpc2hlZCcpXHJcbiAgICAgIHNlbGYuc29ja2V0c1tzZWxmLnNvY2tldHMuaW5kZXhPZihwbGFjZWhvbGRlcildID0gc29ja2V0XHJcbiAgICAgIGNiKHNvY2tldClcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGRlYnVnKCd0dW5uZWxpbmcgc29ja2V0IGNvdWxkIG5vdCBiZSBlc3RhYmxpc2hlZCwgc3RhdHVzQ29kZT0lZCcsIHJlcy5zdGF0dXNDb2RlKVxyXG4gICAgICB2YXIgZXJyb3IgPSBuZXcgRXJyb3IoJ3R1bm5lbGluZyBzb2NrZXQgY291bGQgbm90IGJlIGVzdGFibGlzaGVkLCAnICsgJ3N0YXR1c0NvZGU9JyArIHJlcy5zdGF0dXNDb2RlKVxyXG4gICAgICBlcnJvci5jb2RlID0gJ0VDT05OUkVTRVQnXHJcbiAgICAgIG9wdGlvbnMucmVxdWVzdC5lbWl0KCdlcnJvcicsIGVycm9yKVxyXG4gICAgICBzZWxmLnJlbW92ZVNvY2tldChwbGFjZWhvbGRlcilcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIG9uRXJyb3IoY2F1c2UpIHtcclxuICAgIGNvbm5lY3RSZXEucmVtb3ZlQWxsTGlzdGVuZXJzKClcclxuXHJcbiAgICBkZWJ1ZygndHVubmVsaW5nIHNvY2tldCBjb3VsZCBub3QgYmUgZXN0YWJsaXNoZWQsIGNhdXNlPSVzXFxuJywgY2F1c2UubWVzc2FnZSwgY2F1c2Uuc3RhY2spXHJcbiAgICB2YXIgZXJyb3IgPSBuZXcgRXJyb3IoJ3R1bm5lbGluZyBzb2NrZXQgY291bGQgbm90IGJlIGVzdGFibGlzaGVkLCAnICsgJ2NhdXNlPScgKyBjYXVzZS5tZXNzYWdlKVxyXG4gICAgZXJyb3IuY29kZSA9ICdFQ09OTlJFU0VUJ1xyXG4gICAgb3B0aW9ucy5yZXF1ZXN0LmVtaXQoJ2Vycm9yJywgZXJyb3IpXHJcbiAgICBzZWxmLnJlbW92ZVNvY2tldChwbGFjZWhvbGRlcilcclxuICB9XHJcbn1cclxuXHJcblR1bm5lbGluZ0FnZW50LnByb3RvdHlwZS5yZW1vdmVTb2NrZXQgPSBmdW5jdGlvbiByZW1vdmVTb2NrZXQoc29ja2V0KSB7XHJcbiAgdmFyIHBvcyA9IHRoaXMuc29ja2V0cy5pbmRleE9mKHNvY2tldClcclxuICBpZiAocG9zID09PSAtMSkgcmV0dXJuXHJcblxyXG4gIHRoaXMuc29ja2V0cy5zcGxpY2UocG9zLCAxKVxyXG5cclxuICB2YXIgcGVuZGluZyA9IHRoaXMucmVxdWVzdHMuc2hpZnQoKVxyXG4gIGlmIChwZW5kaW5nKSB7XHJcbiAgICAvLyBJZiB3ZSBoYXZlIHBlbmRpbmcgcmVxdWVzdHMgYW5kIGEgc29ja2V0IGdldHMgY2xvc2VkIGEgbmV3IG9uZVxyXG4gICAgLy8gbmVlZHMgdG8gYmUgY3JlYXRlZCB0byB0YWtlIG92ZXIgaW4gdGhlIHBvb2wgZm9yIHRoZSBvbmUgdGhhdCBjbG9zZWQuXHJcbiAgICB0aGlzLmNyZWF0ZUNvbm5lY3Rpb24ocGVuZGluZylcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZVNlY3VyZVNvY2tldChvcHRpb25zLCBjYikge1xyXG4gIHZhciBzZWxmID0gdGhpc1xyXG4gIFR1bm5lbGluZ0FnZW50LnByb3RvdHlwZS5jcmVhdGVTb2NrZXQuY2FsbChzZWxmLCBvcHRpb25zLCBmdW5jdGlvbihzb2NrZXQpIHtcclxuICAgIC8vIDAgaXMgZHVtbXkgcG9ydCBmb3IgdjAuNlxyXG4gICAgdmFyIHNlY3VyZVNvY2tldCA9IHRscy5jb25uZWN0KDAsIG1lcmdlT3B0aW9ucyh7fSwgc2VsZi5vcHRpb25zLFxyXG4gICAgICB7IHNlcnZlcm5hbWU6IG9wdGlvbnMuaG9zdFxyXG4gICAgICAsIHNvY2tldDogc29ja2V0XHJcbiAgICAgIH1cclxuICAgICkpXHJcbiAgICBzZWxmLnNvY2tldHNbc2VsZi5zb2NrZXRzLmluZGV4T2Yoc29ja2V0KV0gPSBzZWN1cmVTb2NrZXRcclxuICAgIGNiKHNlY3VyZVNvY2tldClcclxuICB9KVxyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gbWVyZ2VPcHRpb25zKHRhcmdldCkge1xyXG4gIGZvciAodmFyIGkgPSAxLCBsZW4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcclxuICAgIHZhciBvdmVycmlkZXMgPSBhcmd1bWVudHNbaV1cclxuICAgIGlmICh0eXBlb2Ygb3ZlcnJpZGVzID09PSAnb2JqZWN0Jykge1xyXG4gICAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKG92ZXJyaWRlcylcclxuICAgICAgZm9yICh2YXIgaiA9IDAsIGtleUxlbiA9IGtleXMubGVuZ3RoOyBqIDwga2V5TGVuOyArK2opIHtcclxuICAgICAgICB2YXIgayA9IGtleXNbal1cclxuICAgICAgICBpZiAob3ZlcnJpZGVzW2tdICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgIHRhcmdldFtrXSA9IG92ZXJyaWRlc1trXVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gdGFyZ2V0XHJcbn1cclxuXHJcblxyXG52YXIgZGVidWdcclxuaWYgKHByb2Nlc3MuZW52Lk5PREVfREVCVUcgJiYgL1xcYnR1bm5lbFxcYi8udGVzdChwcm9jZXNzLmVudi5OT0RFX0RFQlVHKSkge1xyXG4gIGRlYnVnID0gZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cylcclxuICAgIGlmICh0eXBlb2YgYXJnc1swXSA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgYXJnc1swXSA9ICdUVU5ORUw6ICcgKyBhcmdzWzBdXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBhcmdzLnVuc2hpZnQoJ1RVTk5FTDonKVxyXG4gICAgfVxyXG4gICAgY29uc29sZS5lcnJvci5hcHBseShjb25zb2xlLCBhcmdzKVxyXG4gIH1cclxufSBlbHNlIHtcclxuICBkZWJ1ZyA9IGZ1bmN0aW9uKCkge31cclxufVxyXG5leHBvcnRzLmRlYnVnID0gZGVidWcgLy8gZm9yIHRlc3RcclxuIl0sInNvdXJjZVJvb3QiOiIifQ==