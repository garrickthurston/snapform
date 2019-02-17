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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZm9yZXZlci1hZ2VudC9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTtBQUNBOztBQUVBLFdBQVcsbUJBQU8sQ0FBQyxrQkFBTTtBQUN6QixZQUFZLG1CQUFPLENBQUMsa0JBQU07QUFDMUIsVUFBVSxtQkFBTyxDQUFDLGlCQUFLO0FBQ3ZCLFVBQVUsbUJBQU8sQ0FBQyxpQkFBSztBQUN2QixlQUFlLG1CQUFPLENBQUMsbUJBQU87O0FBRTlCLHdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTs7QUFFQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0EsR0FBRztBQUNIO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBIiwiZmlsZSI6InZlbmRvci92ZW5kb3IuZm9yZXZlci1hZ2VudC5jZWFkNWRiNDdkMzU2YWIyMTk0OS5jaHVuay5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gRm9yZXZlckFnZW50XG5Gb3JldmVyQWdlbnQuU1NMID0gRm9yZXZlckFnZW50U1NMXG5cbnZhciB1dGlsID0gcmVxdWlyZSgndXRpbCcpXG4gICwgQWdlbnQgPSByZXF1aXJlKCdodHRwJykuQWdlbnRcbiAgLCBuZXQgPSByZXF1aXJlKCduZXQnKVxuICAsIHRscyA9IHJlcXVpcmUoJ3RscycpXG4gICwgQWdlbnRTU0wgPSByZXF1aXJlKCdodHRwcycpLkFnZW50XG4gIFxuZnVuY3Rpb24gZ2V0Q29ubmVjdGlvbk5hbWUoaG9zdCwgcG9ydCkgeyAgXG4gIHZhciBuYW1lID0gJydcbiAgaWYgKHR5cGVvZiBob3N0ID09PSAnc3RyaW5nJykge1xuICAgIG5hbWUgPSBob3N0ICsgJzonICsgcG9ydFxuICB9IGVsc2Uge1xuICAgIC8vIEZvciBub2RlLmpzIHYwMTIuMCBhbmQgaW9qcy12MS41LjEsIGhvc3QgaXMgYW4gb2JqZWN0LiBBbmQgYW55IGV4aXN0aW5nIGxvY2FsQWRkcmVzcyBpcyBwYXJ0IG9mIHRoZSBjb25uZWN0aW9uIG5hbWUuXG4gICAgbmFtZSA9IGhvc3QuaG9zdCArICc6JyArIGhvc3QucG9ydCArICc6JyArIChob3N0LmxvY2FsQWRkcmVzcyA/IChob3N0LmxvY2FsQWRkcmVzcyArICc6JykgOiAnOicpXG4gIH1cbiAgcmV0dXJuIG5hbWVcbn0gICAgXG5cbmZ1bmN0aW9uIEZvcmV2ZXJBZ2VudChvcHRpb25zKSB7XG4gIHZhciBzZWxmID0gdGhpc1xuICBzZWxmLm9wdGlvbnMgPSBvcHRpb25zIHx8IHt9XG4gIHNlbGYucmVxdWVzdHMgPSB7fVxuICBzZWxmLnNvY2tldHMgPSB7fVxuICBzZWxmLmZyZWVTb2NrZXRzID0ge31cbiAgc2VsZi5tYXhTb2NrZXRzID0gc2VsZi5vcHRpb25zLm1heFNvY2tldHMgfHwgQWdlbnQuZGVmYXVsdE1heFNvY2tldHNcbiAgc2VsZi5taW5Tb2NrZXRzID0gc2VsZi5vcHRpb25zLm1pblNvY2tldHMgfHwgRm9yZXZlckFnZW50LmRlZmF1bHRNaW5Tb2NrZXRzXG4gIHNlbGYub24oJ2ZyZWUnLCBmdW5jdGlvbihzb2NrZXQsIGhvc3QsIHBvcnQpIHtcbiAgICB2YXIgbmFtZSA9IGdldENvbm5lY3Rpb25OYW1lKGhvc3QsIHBvcnQpXG5cbiAgICBpZiAoc2VsZi5yZXF1ZXN0c1tuYW1lXSAmJiBzZWxmLnJlcXVlc3RzW25hbWVdLmxlbmd0aCkge1xuICAgICAgc2VsZi5yZXF1ZXN0c1tuYW1lXS5zaGlmdCgpLm9uU29ja2V0KHNvY2tldClcbiAgICB9IGVsc2UgaWYgKHNlbGYuc29ja2V0c1tuYW1lXS5sZW5ndGggPCBzZWxmLm1pblNvY2tldHMpIHtcbiAgICAgIGlmICghc2VsZi5mcmVlU29ja2V0c1tuYW1lXSkgc2VsZi5mcmVlU29ja2V0c1tuYW1lXSA9IFtdXG4gICAgICBzZWxmLmZyZWVTb2NrZXRzW25hbWVdLnB1c2goc29ja2V0KVxuICAgICAgXG4gICAgICAvLyBpZiBhbiBlcnJvciBoYXBwZW5zIHdoaWxlIHdlIGRvbid0IHVzZSB0aGUgc29ja2V0IGFueXdheSwgbWVoLCB0aHJvdyB0aGUgc29ja2V0IGF3YXlcbiAgICAgIHZhciBvbklkbGVFcnJvciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBzb2NrZXQuZGVzdHJveSgpXG4gICAgICB9XG4gICAgICBzb2NrZXQuX29uSWRsZUVycm9yID0gb25JZGxlRXJyb3JcbiAgICAgIHNvY2tldC5vbignZXJyb3InLCBvbklkbGVFcnJvcilcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gSWYgdGhlcmUgYXJlIG5vIHBlbmRpbmcgcmVxdWVzdHMganVzdCBkZXN0cm95IHRoZVxuICAgICAgLy8gc29ja2V0IGFuZCBpdCB3aWxsIGdldCByZW1vdmVkIGZyb20gdGhlIHBvb2wuIFRoaXNcbiAgICAgIC8vIGdldHMgdXMgb3V0IG9mIHRpbWVvdXQgaXNzdWVzIGFuZCBhbGxvd3MgdXMgdG9cbiAgICAgIC8vIGRlZmF1bHQgdG8gQ29ubmVjdGlvbjprZWVwLWFsaXZlLlxuICAgICAgc29ja2V0LmRlc3Ryb3koKVxuICAgIH1cbiAgfSlcblxufVxudXRpbC5pbmhlcml0cyhGb3JldmVyQWdlbnQsIEFnZW50KVxuXG5Gb3JldmVyQWdlbnQuZGVmYXVsdE1pblNvY2tldHMgPSA1XG5cblxuRm9yZXZlckFnZW50LnByb3RvdHlwZS5jcmVhdGVDb25uZWN0aW9uID0gbmV0LmNyZWF0ZUNvbm5lY3Rpb25cbkZvcmV2ZXJBZ2VudC5wcm90b3R5cGUuYWRkUmVxdWVzdE5vcmV1c2UgPSBBZ2VudC5wcm90b3R5cGUuYWRkUmVxdWVzdFxuRm9yZXZlckFnZW50LnByb3RvdHlwZS5hZGRSZXF1ZXN0ID0gZnVuY3Rpb24ocmVxLCBob3N0LCBwb3J0KSB7XG4gIHZhciBuYW1lID0gZ2V0Q29ubmVjdGlvbk5hbWUoaG9zdCwgcG9ydClcbiAgXG4gIGlmICh0eXBlb2YgaG9zdCAhPT0gJ3N0cmluZycpIHtcbiAgICB2YXIgb3B0aW9ucyA9IGhvc3RcbiAgICBwb3J0ID0gb3B0aW9ucy5wb3J0XG4gICAgaG9zdCA9IG9wdGlvbnMuaG9zdFxuICB9XG5cbiAgaWYgKHRoaXMuZnJlZVNvY2tldHNbbmFtZV0gJiYgdGhpcy5mcmVlU29ja2V0c1tuYW1lXS5sZW5ndGggPiAwICYmICFyZXEudXNlQ2h1bmtlZEVuY29kaW5nQnlEZWZhdWx0KSB7XG4gICAgdmFyIGlkbGVTb2NrZXQgPSB0aGlzLmZyZWVTb2NrZXRzW25hbWVdLnBvcCgpXG4gICAgaWRsZVNvY2tldC5yZW1vdmVMaXN0ZW5lcignZXJyb3InLCBpZGxlU29ja2V0Ll9vbklkbGVFcnJvcilcbiAgICBkZWxldGUgaWRsZVNvY2tldC5fb25JZGxlRXJyb3JcbiAgICByZXEuX3JldXNlZFNvY2tldCA9IHRydWVcbiAgICByZXEub25Tb2NrZXQoaWRsZVNvY2tldClcbiAgfSBlbHNlIHtcbiAgICB0aGlzLmFkZFJlcXVlc3ROb3JldXNlKHJlcSwgaG9zdCwgcG9ydClcbiAgfVxufVxuXG5Gb3JldmVyQWdlbnQucHJvdG90eXBlLnJlbW92ZVNvY2tldCA9IGZ1bmN0aW9uKHMsIG5hbWUsIGhvc3QsIHBvcnQpIHtcbiAgaWYgKHRoaXMuc29ja2V0c1tuYW1lXSkge1xuICAgIHZhciBpbmRleCA9IHRoaXMuc29ja2V0c1tuYW1lXS5pbmRleE9mKHMpXG4gICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgdGhpcy5zb2NrZXRzW25hbWVdLnNwbGljZShpbmRleCwgMSlcbiAgICB9XG4gIH0gZWxzZSBpZiAodGhpcy5zb2NrZXRzW25hbWVdICYmIHRoaXMuc29ja2V0c1tuYW1lXS5sZW5ndGggPT09IDApIHtcbiAgICAvLyBkb24ndCBsZWFrXG4gICAgZGVsZXRlIHRoaXMuc29ja2V0c1tuYW1lXVxuICAgIGRlbGV0ZSB0aGlzLnJlcXVlc3RzW25hbWVdXG4gIH1cbiAgXG4gIGlmICh0aGlzLmZyZWVTb2NrZXRzW25hbWVdKSB7XG4gICAgdmFyIGluZGV4ID0gdGhpcy5mcmVlU29ja2V0c1tuYW1lXS5pbmRleE9mKHMpXG4gICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgdGhpcy5mcmVlU29ja2V0c1tuYW1lXS5zcGxpY2UoaW5kZXgsIDEpXG4gICAgICBpZiAodGhpcy5mcmVlU29ja2V0c1tuYW1lXS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgZGVsZXRlIHRoaXMuZnJlZVNvY2tldHNbbmFtZV1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpZiAodGhpcy5yZXF1ZXN0c1tuYW1lXSAmJiB0aGlzLnJlcXVlc3RzW25hbWVdLmxlbmd0aCkge1xuICAgIC8vIElmIHdlIGhhdmUgcGVuZGluZyByZXF1ZXN0cyBhbmQgYSBzb2NrZXQgZ2V0cyBjbG9zZWQgYSBuZXcgb25lXG4gICAgLy8gbmVlZHMgdG8gYmUgY3JlYXRlZCB0byB0YWtlIG92ZXIgaW4gdGhlIHBvb2wgZm9yIHRoZSBvbmUgdGhhdCBjbG9zZWQuXG4gICAgdGhpcy5jcmVhdGVTb2NrZXQobmFtZSwgaG9zdCwgcG9ydCkuZW1pdCgnZnJlZScpXG4gIH1cbn1cblxuZnVuY3Rpb24gRm9yZXZlckFnZW50U1NMIChvcHRpb25zKSB7XG4gIEZvcmV2ZXJBZ2VudC5jYWxsKHRoaXMsIG9wdGlvbnMpXG59XG51dGlsLmluaGVyaXRzKEZvcmV2ZXJBZ2VudFNTTCwgRm9yZXZlckFnZW50KVxuXG5Gb3JldmVyQWdlbnRTU0wucHJvdG90eXBlLmNyZWF0ZUNvbm5lY3Rpb24gPSBjcmVhdGVDb25uZWN0aW9uU1NMXG5Gb3JldmVyQWdlbnRTU0wucHJvdG90eXBlLmFkZFJlcXVlc3ROb3JldXNlID0gQWdlbnRTU0wucHJvdG90eXBlLmFkZFJlcXVlc3RcblxuZnVuY3Rpb24gY3JlYXRlQ29ubmVjdGlvblNTTCAocG9ydCwgaG9zdCwgb3B0aW9ucykge1xuICBpZiAodHlwZW9mIHBvcnQgPT09ICdvYmplY3QnKSB7XG4gICAgb3B0aW9ucyA9IHBvcnQ7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGhvc3QgPT09ICdvYmplY3QnKSB7XG4gICAgb3B0aW9ucyA9IGhvc3Q7XG4gIH0gZWxzZSBpZiAodHlwZW9mIG9wdGlvbnMgPT09ICdvYmplY3QnKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnM7XG4gIH0gZWxzZSB7XG4gICAgb3B0aW9ucyA9IHt9O1xuICB9XG5cbiAgaWYgKHR5cGVvZiBwb3J0ID09PSAnbnVtYmVyJykge1xuICAgIG9wdGlvbnMucG9ydCA9IHBvcnQ7XG4gIH1cblxuICBpZiAodHlwZW9mIGhvc3QgPT09ICdzdHJpbmcnKSB7XG4gICAgb3B0aW9ucy5ob3N0ID0gaG9zdDtcbiAgfVxuXG4gIHJldHVybiB0bHMuY29ubmVjdChvcHRpb25zKTtcbn1cbiJdLCJzb3VyY2VSb290IjoiIn0=