(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["vendor/vendor.forever-agent"],{

/***/ "ZfmE":
/*!*********************************************!*\
  !*** ./node_modules/forever-agent/index.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = ForeverAgent
ForeverAgent.SSL = ForeverAgentSSL

var util = __webpack_require__(/*! util */ "7tlc")
  , Agent = __webpack_require__(/*! http */ "lJCZ").Agent
  , net = __webpack_require__(/*! net */ "Po9p")
  , tls = __webpack_require__(/*! tls */ "Po9p")
  , AgentSSL = __webpack_require__(/*! https */ "JPgR").Agent
  
function getConnectionName(host, port) {  
  var name = ''
  if (typeof host === 'string') {
    name = host + ':' + port
  } else {
    // For node.js v012.0 and iojs-v1.5.1, host is an object. And any existing localAddress is part of the connection name.
    name = host.host + ':' + host.port + ':' + (host.localAddress ? (host.localAddress + ':') : ':')
  }
  return name
}    

function ForeverAgent(options) {
  var self = this
  self.options = options || {}
  self.requests = {}
  self.sockets = {}
  self.freeSockets = {}
  self.maxSockets = self.options.maxSockets || Agent.defaultMaxSockets
  self.minSockets = self.options.minSockets || ForeverAgent.defaultMinSockets
  self.on('free', function(socket, host, port) {
    var name = getConnectionName(host, port)

    if (self.requests[name] && self.requests[name].length) {
      self.requests[name].shift().onSocket(socket)
    } else if (self.sockets[name].length < self.minSockets) {
      if (!self.freeSockets[name]) self.freeSockets[name] = []
      self.freeSockets[name].push(socket)
      
      // if an error happens while we don't use the socket anyway, meh, throw the socket away
      var onIdleError = function() {
        socket.destroy()
      }
      socket._onIdleError = onIdleError
      socket.on('error', onIdleError)
    } else {
      // If there are no pending requests just destroy the
      // socket and it will get removed from the pool. This
      // gets us out of timeout issues and allows us to
      // default to Connection:keep-alive.
      socket.destroy()
    }
  })

}
util.inherits(ForeverAgent, Agent)

ForeverAgent.defaultMinSockets = 5


ForeverAgent.prototype.createConnection = net.createConnection
ForeverAgent.prototype.addRequestNoreuse = Agent.prototype.addRequest
ForeverAgent.prototype.addRequest = function(req, host, port) {
  var name = getConnectionName(host, port)
  
  if (typeof host !== 'string') {
    var options = host
    port = options.port
    host = options.host
  }

  if (this.freeSockets[name] && this.freeSockets[name].length > 0 && !req.useChunkedEncodingByDefault) {
    var idleSocket = this.freeSockets[name].pop()
    idleSocket.removeListener('error', idleSocket._onIdleError)
    delete idleSocket._onIdleError
    req._reusedSocket = true
    req.onSocket(idleSocket)
  } else {
    this.addRequestNoreuse(req, host, port)
  }
}

ForeverAgent.prototype.removeSocket = function(s, name, host, port) {
  if (this.sockets[name]) {
    var index = this.sockets[name].indexOf(s)
    if (index !== -1) {
      this.sockets[name].splice(index, 1)
    }
  } else if (this.sockets[name] && this.sockets[name].length === 0) {
    // don't leak
    delete this.sockets[name]
    delete this.requests[name]
  }
  
  if (this.freeSockets[name]) {
    var index = this.freeSockets[name].indexOf(s)
    if (index !== -1) {
      this.freeSockets[name].splice(index, 1)
      if (this.freeSockets[name].length === 0) {
        delete this.freeSockets[name]
      }
    }
  }

  if (this.requests[name] && this.requests[name].length) {
    // If we have pending requests and a socket gets closed a new one
    // needs to be created to take over in the pool for the one that closed.
    this.createSocket(name, host, port).emit('free')
  }
}

function ForeverAgentSSL (options) {
  ForeverAgent.call(this, options)
}
util.inherits(ForeverAgentSSL, ForeverAgent)

ForeverAgentSSL.prototype.createConnection = createConnectionSSL
ForeverAgentSSL.prototype.addRequestNoreuse = AgentSSL.prototype.addRequest

function createConnectionSSL (port, host, options) {
  if (typeof port === 'object') {
    options = port;
  } else if (typeof host === 'object') {
    options = host;
  } else if (typeof options === 'object') {
    options = options;
  } else {
    options = {};
  }

  if (typeof port === 'number') {
    options.port = port;
  }

  if (typeof host === 'string') {
    options.host = host;
  }

  return tls.connect(options);
}


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZm9yZXZlci1hZ2VudC9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTtBQUNBOztBQUVBLFdBQVcsbUJBQU8sQ0FBQyxrQkFBTTtBQUN6QixZQUFZLG1CQUFPLENBQUMsa0JBQU07QUFDMUIsVUFBVSxtQkFBTyxDQUFDLGlCQUFLO0FBQ3ZCLFVBQVUsbUJBQU8sQ0FBQyxpQkFBSztBQUN2QixlQUFlLG1CQUFPLENBQUMsbUJBQU87O0FBRTlCLHdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTs7QUFFQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0EsR0FBRztBQUNIO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBIiwiZmlsZSI6ImJ1aWxkL3ZlbmRvci92ZW5kb3IuZm9yZXZlci1hZ2VudC5jMGUyN2FhYmVlMTNmMGFjYTc4My5jaHVuay5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gRm9yZXZlckFnZW50XHJcbkZvcmV2ZXJBZ2VudC5TU0wgPSBGb3JldmVyQWdlbnRTU0xcclxuXHJcbnZhciB1dGlsID0gcmVxdWlyZSgndXRpbCcpXHJcbiAgLCBBZ2VudCA9IHJlcXVpcmUoJ2h0dHAnKS5BZ2VudFxyXG4gICwgbmV0ID0gcmVxdWlyZSgnbmV0JylcclxuICAsIHRscyA9IHJlcXVpcmUoJ3RscycpXHJcbiAgLCBBZ2VudFNTTCA9IHJlcXVpcmUoJ2h0dHBzJykuQWdlbnRcclxuICBcclxuZnVuY3Rpb24gZ2V0Q29ubmVjdGlvbk5hbWUoaG9zdCwgcG9ydCkgeyAgXHJcbiAgdmFyIG5hbWUgPSAnJ1xyXG4gIGlmICh0eXBlb2YgaG9zdCA9PT0gJ3N0cmluZycpIHtcclxuICAgIG5hbWUgPSBob3N0ICsgJzonICsgcG9ydFxyXG4gIH0gZWxzZSB7XHJcbiAgICAvLyBGb3Igbm9kZS5qcyB2MDEyLjAgYW5kIGlvanMtdjEuNS4xLCBob3N0IGlzIGFuIG9iamVjdC4gQW5kIGFueSBleGlzdGluZyBsb2NhbEFkZHJlc3MgaXMgcGFydCBvZiB0aGUgY29ubmVjdGlvbiBuYW1lLlxyXG4gICAgbmFtZSA9IGhvc3QuaG9zdCArICc6JyArIGhvc3QucG9ydCArICc6JyArIChob3N0LmxvY2FsQWRkcmVzcyA/IChob3N0LmxvY2FsQWRkcmVzcyArICc6JykgOiAnOicpXHJcbiAgfVxyXG4gIHJldHVybiBuYW1lXHJcbn0gICAgXHJcblxyXG5mdW5jdGlvbiBGb3JldmVyQWdlbnQob3B0aW9ucykge1xyXG4gIHZhciBzZWxmID0gdGhpc1xyXG4gIHNlbGYub3B0aW9ucyA9IG9wdGlvbnMgfHwge31cclxuICBzZWxmLnJlcXVlc3RzID0ge31cclxuICBzZWxmLnNvY2tldHMgPSB7fVxyXG4gIHNlbGYuZnJlZVNvY2tldHMgPSB7fVxyXG4gIHNlbGYubWF4U29ja2V0cyA9IHNlbGYub3B0aW9ucy5tYXhTb2NrZXRzIHx8IEFnZW50LmRlZmF1bHRNYXhTb2NrZXRzXHJcbiAgc2VsZi5taW5Tb2NrZXRzID0gc2VsZi5vcHRpb25zLm1pblNvY2tldHMgfHwgRm9yZXZlckFnZW50LmRlZmF1bHRNaW5Tb2NrZXRzXHJcbiAgc2VsZi5vbignZnJlZScsIGZ1bmN0aW9uKHNvY2tldCwgaG9zdCwgcG9ydCkge1xyXG4gICAgdmFyIG5hbWUgPSBnZXRDb25uZWN0aW9uTmFtZShob3N0LCBwb3J0KVxyXG5cclxuICAgIGlmIChzZWxmLnJlcXVlc3RzW25hbWVdICYmIHNlbGYucmVxdWVzdHNbbmFtZV0ubGVuZ3RoKSB7XHJcbiAgICAgIHNlbGYucmVxdWVzdHNbbmFtZV0uc2hpZnQoKS5vblNvY2tldChzb2NrZXQpXHJcbiAgICB9IGVsc2UgaWYgKHNlbGYuc29ja2V0c1tuYW1lXS5sZW5ndGggPCBzZWxmLm1pblNvY2tldHMpIHtcclxuICAgICAgaWYgKCFzZWxmLmZyZWVTb2NrZXRzW25hbWVdKSBzZWxmLmZyZWVTb2NrZXRzW25hbWVdID0gW11cclxuICAgICAgc2VsZi5mcmVlU29ja2V0c1tuYW1lXS5wdXNoKHNvY2tldClcclxuICAgICAgXHJcbiAgICAgIC8vIGlmIGFuIGVycm9yIGhhcHBlbnMgd2hpbGUgd2UgZG9uJ3QgdXNlIHRoZSBzb2NrZXQgYW55d2F5LCBtZWgsIHRocm93IHRoZSBzb2NrZXQgYXdheVxyXG4gICAgICB2YXIgb25JZGxlRXJyb3IgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBzb2NrZXQuZGVzdHJveSgpXHJcbiAgICAgIH1cclxuICAgICAgc29ja2V0Ll9vbklkbGVFcnJvciA9IG9uSWRsZUVycm9yXHJcbiAgICAgIHNvY2tldC5vbignZXJyb3InLCBvbklkbGVFcnJvcilcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIC8vIElmIHRoZXJlIGFyZSBubyBwZW5kaW5nIHJlcXVlc3RzIGp1c3QgZGVzdHJveSB0aGVcclxuICAgICAgLy8gc29ja2V0IGFuZCBpdCB3aWxsIGdldCByZW1vdmVkIGZyb20gdGhlIHBvb2wuIFRoaXNcclxuICAgICAgLy8gZ2V0cyB1cyBvdXQgb2YgdGltZW91dCBpc3N1ZXMgYW5kIGFsbG93cyB1cyB0b1xyXG4gICAgICAvLyBkZWZhdWx0IHRvIENvbm5lY3Rpb246a2VlcC1hbGl2ZS5cclxuICAgICAgc29ja2V0LmRlc3Ryb3koKVxyXG4gICAgfVxyXG4gIH0pXHJcblxyXG59XHJcbnV0aWwuaW5oZXJpdHMoRm9yZXZlckFnZW50LCBBZ2VudClcclxuXHJcbkZvcmV2ZXJBZ2VudC5kZWZhdWx0TWluU29ja2V0cyA9IDVcclxuXHJcblxyXG5Gb3JldmVyQWdlbnQucHJvdG90eXBlLmNyZWF0ZUNvbm5lY3Rpb24gPSBuZXQuY3JlYXRlQ29ubmVjdGlvblxyXG5Gb3JldmVyQWdlbnQucHJvdG90eXBlLmFkZFJlcXVlc3ROb3JldXNlID0gQWdlbnQucHJvdG90eXBlLmFkZFJlcXVlc3RcclxuRm9yZXZlckFnZW50LnByb3RvdHlwZS5hZGRSZXF1ZXN0ID0gZnVuY3Rpb24ocmVxLCBob3N0LCBwb3J0KSB7XHJcbiAgdmFyIG5hbWUgPSBnZXRDb25uZWN0aW9uTmFtZShob3N0LCBwb3J0KVxyXG4gIFxyXG4gIGlmICh0eXBlb2YgaG9zdCAhPT0gJ3N0cmluZycpIHtcclxuICAgIHZhciBvcHRpb25zID0gaG9zdFxyXG4gICAgcG9ydCA9IG9wdGlvbnMucG9ydFxyXG4gICAgaG9zdCA9IG9wdGlvbnMuaG9zdFxyXG4gIH1cclxuXHJcbiAgaWYgKHRoaXMuZnJlZVNvY2tldHNbbmFtZV0gJiYgdGhpcy5mcmVlU29ja2V0c1tuYW1lXS5sZW5ndGggPiAwICYmICFyZXEudXNlQ2h1bmtlZEVuY29kaW5nQnlEZWZhdWx0KSB7XHJcbiAgICB2YXIgaWRsZVNvY2tldCA9IHRoaXMuZnJlZVNvY2tldHNbbmFtZV0ucG9wKClcclxuICAgIGlkbGVTb2NrZXQucmVtb3ZlTGlzdGVuZXIoJ2Vycm9yJywgaWRsZVNvY2tldC5fb25JZGxlRXJyb3IpXHJcbiAgICBkZWxldGUgaWRsZVNvY2tldC5fb25JZGxlRXJyb3JcclxuICAgIHJlcS5fcmV1c2VkU29ja2V0ID0gdHJ1ZVxyXG4gICAgcmVxLm9uU29ja2V0KGlkbGVTb2NrZXQpXHJcbiAgfSBlbHNlIHtcclxuICAgIHRoaXMuYWRkUmVxdWVzdE5vcmV1c2UocmVxLCBob3N0LCBwb3J0KVxyXG4gIH1cclxufVxyXG5cclxuRm9yZXZlckFnZW50LnByb3RvdHlwZS5yZW1vdmVTb2NrZXQgPSBmdW5jdGlvbihzLCBuYW1lLCBob3N0LCBwb3J0KSB7XHJcbiAgaWYgKHRoaXMuc29ja2V0c1tuYW1lXSkge1xyXG4gICAgdmFyIGluZGV4ID0gdGhpcy5zb2NrZXRzW25hbWVdLmluZGV4T2YocylcclxuICAgIGlmIChpbmRleCAhPT0gLTEpIHtcclxuICAgICAgdGhpcy5zb2NrZXRzW25hbWVdLnNwbGljZShpbmRleCwgMSlcclxuICAgIH1cclxuICB9IGVsc2UgaWYgKHRoaXMuc29ja2V0c1tuYW1lXSAmJiB0aGlzLnNvY2tldHNbbmFtZV0ubGVuZ3RoID09PSAwKSB7XHJcbiAgICAvLyBkb24ndCBsZWFrXHJcbiAgICBkZWxldGUgdGhpcy5zb2NrZXRzW25hbWVdXHJcbiAgICBkZWxldGUgdGhpcy5yZXF1ZXN0c1tuYW1lXVxyXG4gIH1cclxuICBcclxuICBpZiAodGhpcy5mcmVlU29ja2V0c1tuYW1lXSkge1xyXG4gICAgdmFyIGluZGV4ID0gdGhpcy5mcmVlU29ja2V0c1tuYW1lXS5pbmRleE9mKHMpXHJcbiAgICBpZiAoaW5kZXggIT09IC0xKSB7XHJcbiAgICAgIHRoaXMuZnJlZVNvY2tldHNbbmFtZV0uc3BsaWNlKGluZGV4LCAxKVxyXG4gICAgICBpZiAodGhpcy5mcmVlU29ja2V0c1tuYW1lXS5sZW5ndGggPT09IDApIHtcclxuICAgICAgICBkZWxldGUgdGhpcy5mcmVlU29ja2V0c1tuYW1lXVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBpZiAodGhpcy5yZXF1ZXN0c1tuYW1lXSAmJiB0aGlzLnJlcXVlc3RzW25hbWVdLmxlbmd0aCkge1xyXG4gICAgLy8gSWYgd2UgaGF2ZSBwZW5kaW5nIHJlcXVlc3RzIGFuZCBhIHNvY2tldCBnZXRzIGNsb3NlZCBhIG5ldyBvbmVcclxuICAgIC8vIG5lZWRzIHRvIGJlIGNyZWF0ZWQgdG8gdGFrZSBvdmVyIGluIHRoZSBwb29sIGZvciB0aGUgb25lIHRoYXQgY2xvc2VkLlxyXG4gICAgdGhpcy5jcmVhdGVTb2NrZXQobmFtZSwgaG9zdCwgcG9ydCkuZW1pdCgnZnJlZScpXHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBGb3JldmVyQWdlbnRTU0wgKG9wdGlvbnMpIHtcclxuICBGb3JldmVyQWdlbnQuY2FsbCh0aGlzLCBvcHRpb25zKVxyXG59XHJcbnV0aWwuaW5oZXJpdHMoRm9yZXZlckFnZW50U1NMLCBGb3JldmVyQWdlbnQpXHJcblxyXG5Gb3JldmVyQWdlbnRTU0wucHJvdG90eXBlLmNyZWF0ZUNvbm5lY3Rpb24gPSBjcmVhdGVDb25uZWN0aW9uU1NMXHJcbkZvcmV2ZXJBZ2VudFNTTC5wcm90b3R5cGUuYWRkUmVxdWVzdE5vcmV1c2UgPSBBZ2VudFNTTC5wcm90b3R5cGUuYWRkUmVxdWVzdFxyXG5cclxuZnVuY3Rpb24gY3JlYXRlQ29ubmVjdGlvblNTTCAocG9ydCwgaG9zdCwgb3B0aW9ucykge1xyXG4gIGlmICh0eXBlb2YgcG9ydCA9PT0gJ29iamVjdCcpIHtcclxuICAgIG9wdGlvbnMgPSBwb3J0O1xyXG4gIH0gZWxzZSBpZiAodHlwZW9mIGhvc3QgPT09ICdvYmplY3QnKSB7XHJcbiAgICBvcHRpb25zID0gaG9zdDtcclxuICB9IGVsc2UgaWYgKHR5cGVvZiBvcHRpb25zID09PSAnb2JqZWN0Jykge1xyXG4gICAgb3B0aW9ucyA9IG9wdGlvbnM7XHJcbiAgfSBlbHNlIHtcclxuICAgIG9wdGlvbnMgPSB7fTtcclxuICB9XHJcblxyXG4gIGlmICh0eXBlb2YgcG9ydCA9PT0gJ251bWJlcicpIHtcclxuICAgIG9wdGlvbnMucG9ydCA9IHBvcnQ7XHJcbiAgfVxyXG5cclxuICBpZiAodHlwZW9mIGhvc3QgPT09ICdzdHJpbmcnKSB7XHJcbiAgICBvcHRpb25zLmhvc3QgPSBob3N0O1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHRscy5jb25uZWN0KG9wdGlvbnMpO1xyXG59XHJcbiJdLCJzb3VyY2VSb290IjoiIn0=