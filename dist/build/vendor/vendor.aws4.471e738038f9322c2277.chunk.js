(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["vendor/vendor.aws4"],{

/***/ "Tldb":
/*!**********************************!*\
  !*** ./node_modules/aws4/lru.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function(size) {
  return new LruCache(size)
}

function LruCache(size) {
  this.capacity = size | 0
  this.map = Object.create(null)
  this.list = new DoublyLinkedList()
}

LruCache.prototype.get = function(key) {
  var node = this.map[key]
  if (node == null) return undefined
  this.used(node)
  return node.val
}

LruCache.prototype.set = function(key, val) {
  var node = this.map[key]
  if (node != null) {
    node.val = val
  } else {
    if (!this.capacity) this.prune()
    if (!this.capacity) return false
    node = new DoublyLinkedNode(key, val)
    this.map[key] = node
    this.capacity--
  }
  this.used(node)
  return true
}

LruCache.prototype.used = function(node) {
  this.list.moveToFront(node)
}

LruCache.prototype.prune = function() {
  var node = this.list.pop()
  if (node != null) {
    delete this.map[node.key]
    this.capacity++
  }
}


function DoublyLinkedList() {
  this.firstNode = null
  this.lastNode = null
}

DoublyLinkedList.prototype.moveToFront = function(node) {
  if (this.firstNode == node) return

  this.remove(node)

  if (this.firstNode == null) {
    this.firstNode = node
    this.lastNode = node
    node.prev = null
    node.next = null
  } else {
    node.prev = null
    node.next = this.firstNode
    node.next.prev = node
    this.firstNode = node
  }
}

DoublyLinkedList.prototype.pop = function() {
  var lastNode = this.lastNode
  if (lastNode != null) {
    this.remove(lastNode)
  }
  return lastNode
}

DoublyLinkedList.prototype.remove = function(node) {
  if (this.firstNode == node) {
    this.firstNode = node.next
  } else if (node.prev != null) {
    node.prev.next = node.next
  }
  if (this.lastNode == node) {
    this.lastNode = node.prev
  } else if (node.next != null) {
    node.next.prev = node.prev
  }
}


function DoublyLinkedNode(key, val) {
  this.key = key
  this.val = val
  this.prev = null
  this.next = null
}


/***/ }),

/***/ "Zq4/":
/*!***********************************!*\
  !*** ./node_modules/aws4/aws4.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer) {var aws4 = exports,
    url = __webpack_require__(/*! url */ "CxY0"),
    querystring = __webpack_require__(/*! querystring */ "s4NR"),
    crypto = __webpack_require__(/*! crypto */ "HEbw"),
    lru = __webpack_require__(/*! ./lru */ "Tldb"),
    credentialsCache = lru(1000)

// http://docs.amazonwebservices.com/general/latest/gr/signature-version-4.html

function hmac(key, string, encoding) {
  return crypto.createHmac('sha256', key).update(string, 'utf8').digest(encoding)
}

function hash(string, encoding) {
  return crypto.createHash('sha256').update(string, 'utf8').digest(encoding)
}

// This function assumes the string has already been percent encoded
function encodeRfc3986(urlEncodedString) {
  return urlEncodedString.replace(/[!'()*]/g, function(c) {
    return '%' + c.charCodeAt(0).toString(16).toUpperCase()
  })
}

// request: { path | body, [host], [method], [headers], [service], [region] }
// credentials: { accessKeyId, secretAccessKey, [sessionToken] }
function RequestSigner(request, credentials) {

  if (typeof request === 'string') request = url.parse(request)

  var headers = request.headers = (request.headers || {}),
      hostParts = this.matchHost(request.hostname || request.host || headers.Host || headers.host)

  this.request = request
  this.credentials = credentials || this.defaultCredentials()

  this.service = request.service || hostParts[0] || ''
  this.region = request.region || hostParts[1] || 'us-east-1'

  // SES uses a different domain from the service name
  if (this.service === 'email') this.service = 'ses'

  if (!request.method && request.body)
    request.method = 'POST'

  if (!headers.Host && !headers.host) {
    headers.Host = request.hostname || request.host || this.createHost()

    // If a port is specified explicitly, use it as is
    if (request.port)
      headers.Host += ':' + request.port
  }
  if (!request.hostname && !request.host)
    request.hostname = headers.Host || headers.host

  this.isCodeCommitGit = this.service === 'codecommit' && request.method === 'GIT'
}

RequestSigner.prototype.matchHost = function(host) {
  var match = (host || '').match(/([^\.]+)\.(?:([^\.]*)\.)?amazonaws\.com(\.cn)?$/)
  var hostParts = (match || []).slice(1, 3)

  // ES's hostParts are sometimes the other way round, if the value that is expected
  // to be region equals ‘es’ switch them back
  // e.g. search-cluster-name-aaaa00aaaa0aaa0aaaaaaa0aaa.us-east-1.es.amazonaws.com
  if (hostParts[1] === 'es')
    hostParts = hostParts.reverse()

  return hostParts
}

// http://docs.aws.amazon.com/general/latest/gr/rande.html
RequestSigner.prototype.isSingleRegion = function() {
  // Special case for S3 and SimpleDB in us-east-1
  if (['s3', 'sdb'].indexOf(this.service) >= 0 && this.region === 'us-east-1') return true

  return ['cloudfront', 'ls', 'route53', 'iam', 'importexport', 'sts']
    .indexOf(this.service) >= 0
}

RequestSigner.prototype.createHost = function() {
  var region = this.isSingleRegion() ? '' :
        (this.service === 's3' && this.region !== 'us-east-1' ? '-' : '.') + this.region,
      service = this.service === 'ses' ? 'email' : this.service
  return service + region + '.amazonaws.com'
}

RequestSigner.prototype.prepareRequest = function() {
  this.parsePath()

  var request = this.request, headers = request.headers, query

  if (request.signQuery) {

    this.parsedPath.query = query = this.parsedPath.query || {}

    if (this.credentials.sessionToken)
      query['X-Amz-Security-Token'] = this.credentials.sessionToken

    if (this.service === 's3' && !query['X-Amz-Expires'])
      query['X-Amz-Expires'] = 86400

    if (query['X-Amz-Date'])
      this.datetime = query['X-Amz-Date']
    else
      query['X-Amz-Date'] = this.getDateTime()

    query['X-Amz-Algorithm'] = 'AWS4-HMAC-SHA256'
    query['X-Amz-Credential'] = this.credentials.accessKeyId + '/' + this.credentialString()
    query['X-Amz-SignedHeaders'] = this.signedHeaders()

  } else {

    if (!request.doNotModifyHeaders && !this.isCodeCommitGit) {
      if (request.body && !headers['Content-Type'] && !headers['content-type'])
        headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=utf-8'

      if (request.body && !headers['Content-Length'] && !headers['content-length'])
        headers['Content-Length'] = Buffer.byteLength(request.body)

      if (this.credentials.sessionToken && !headers['X-Amz-Security-Token'] && !headers['x-amz-security-token'])
        headers['X-Amz-Security-Token'] = this.credentials.sessionToken

      if (this.service === 's3' && !headers['X-Amz-Content-Sha256'] && !headers['x-amz-content-sha256'])
        headers['X-Amz-Content-Sha256'] = hash(this.request.body || '', 'hex')

      if (headers['X-Amz-Date'] || headers['x-amz-date'])
        this.datetime = headers['X-Amz-Date'] || headers['x-amz-date']
      else
        headers['X-Amz-Date'] = this.getDateTime()
    }

    delete headers.Authorization
    delete headers.authorization
  }
}

RequestSigner.prototype.sign = function() {
  if (!this.parsedPath) this.prepareRequest()

  if (this.request.signQuery) {
    this.parsedPath.query['X-Amz-Signature'] = this.signature()
  } else {
    this.request.headers.Authorization = this.authHeader()
  }

  this.request.path = this.formatPath()

  return this.request
}

RequestSigner.prototype.getDateTime = function() {
  if (!this.datetime) {
    var headers = this.request.headers,
      date = new Date(headers.Date || headers.date || new Date)

    this.datetime = date.toISOString().replace(/[:\-]|\.\d{3}/g, '')

    // Remove the trailing 'Z' on the timestamp string for CodeCommit git access
    if (this.isCodeCommitGit) this.datetime = this.datetime.slice(0, -1)
  }
  return this.datetime
}

RequestSigner.prototype.getDate = function() {
  return this.getDateTime().substr(0, 8)
}

RequestSigner.prototype.authHeader = function() {
  return [
    'AWS4-HMAC-SHA256 Credential=' + this.credentials.accessKeyId + '/' + this.credentialString(),
    'SignedHeaders=' + this.signedHeaders(),
    'Signature=' + this.signature(),
  ].join(', ')
}

RequestSigner.prototype.signature = function() {
  var date = this.getDate(),
      cacheKey = [this.credentials.secretAccessKey, date, this.region, this.service].join(),
      kDate, kRegion, kService, kCredentials = credentialsCache.get(cacheKey)
  if (!kCredentials) {
    kDate = hmac('AWS4' + this.credentials.secretAccessKey, date)
    kRegion = hmac(kDate, this.region)
    kService = hmac(kRegion, this.service)
    kCredentials = hmac(kService, 'aws4_request')
    credentialsCache.set(cacheKey, kCredentials)
  }
  return hmac(kCredentials, this.stringToSign(), 'hex')
}

RequestSigner.prototype.stringToSign = function() {
  return [
    'AWS4-HMAC-SHA256',
    this.getDateTime(),
    this.credentialString(),
    hash(this.canonicalString(), 'hex'),
  ].join('\n')
}

RequestSigner.prototype.canonicalString = function() {
  if (!this.parsedPath) this.prepareRequest()

  var pathStr = this.parsedPath.path,
      query = this.parsedPath.query,
      headers = this.request.headers,
      queryStr = '',
      normalizePath = this.service !== 's3',
      decodePath = this.service === 's3' || this.request.doNotEncodePath,
      decodeSlashesInPath = this.service === 's3',
      firstValOnly = this.service === 's3',
      bodyHash

  if (this.service === 's3' && this.request.signQuery) {
    bodyHash = 'UNSIGNED-PAYLOAD'
  } else if (this.isCodeCommitGit) {
    bodyHash = ''
  } else {
    bodyHash = headers['X-Amz-Content-Sha256'] || headers['x-amz-content-sha256'] ||
      hash(this.request.body || '', 'hex')
  }

  if (query) {
    queryStr = encodeRfc3986(querystring.stringify(Object.keys(query).sort().reduce(function(obj, key) {
      if (!key) return obj
      obj[key] = !Array.isArray(query[key]) ? query[key] :
        (firstValOnly ? query[key][0] : query[key].slice().sort())
      return obj
    }, {})))
  }
  if (pathStr !== '/') {
    if (normalizePath) pathStr = pathStr.replace(/\/{2,}/g, '/')
    pathStr = pathStr.split('/').reduce(function(path, piece) {
      if (normalizePath && piece === '..') {
        path.pop()
      } else if (!normalizePath || piece !== '.') {
        if (decodePath) piece = decodeURIComponent(piece)
        path.push(encodeRfc3986(encodeURIComponent(piece)))
      }
      return path
    }, []).join('/')
    if (pathStr[0] !== '/') pathStr = '/' + pathStr
    if (decodeSlashesInPath) pathStr = pathStr.replace(/%2F/g, '/')
  }

  return [
    this.request.method || 'GET',
    pathStr,
    queryStr,
    this.canonicalHeaders() + '\n',
    this.signedHeaders(),
    bodyHash,
  ].join('\n')
}

RequestSigner.prototype.canonicalHeaders = function() {
  var headers = this.request.headers
  function trimAll(header) {
    return header.toString().trim().replace(/\s+/g, ' ')
  }
  return Object.keys(headers)
    .sort(function(a, b) { return a.toLowerCase() < b.toLowerCase() ? -1 : 1 })
    .map(function(key) { return key.toLowerCase() + ':' + trimAll(headers[key]) })
    .join('\n')
}

RequestSigner.prototype.signedHeaders = function() {
  return Object.keys(this.request.headers)
    .map(function(key) { return key.toLowerCase() })
    .sort()
    .join(';')
}

RequestSigner.prototype.credentialString = function() {
  return [
    this.getDate(),
    this.region,
    this.service,
    'aws4_request',
  ].join('/')
}

RequestSigner.prototype.defaultCredentials = function() {
  var env = process.env
  return {
    accessKeyId: env.AWS_ACCESS_KEY_ID || env.AWS_ACCESS_KEY,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY || env.AWS_SECRET_KEY,
    sessionToken: env.AWS_SESSION_TOKEN,
  }
}

RequestSigner.prototype.parsePath = function() {
  var path = this.request.path || '/',
      queryIx = path.indexOf('?'),
      query = null

  if (queryIx >= 0) {
    query = querystring.parse(path.slice(queryIx + 1))
    path = path.slice(0, queryIx)
  }

  // S3 doesn't always encode characters > 127 correctly and
  // all services don't encode characters > 255 correctly
  // So if there are non-reserved chars (and it's not already all % encoded), just encode them all
  if (/[^0-9A-Za-z!'()*\-._~%/]/.test(path)) {
    path = path.split('/').map(function(piece) {
      return encodeURIComponent(decodeURIComponent(piece))
    }).join('/')
  }

  this.parsedPath = {
    path: path,
    query: query,
  }
}

RequestSigner.prototype.formatPath = function() {
  var path = this.parsedPath.path,
      query = this.parsedPath.query

  if (!query) return path

  // Services don't support empty query string keys
  if (query[''] != null) delete query['']

  return path + '?' + encodeRfc3986(querystring.stringify(query))
}

aws4.RequestSigner = RequestSigner

aws4.sign = function(request, credentials) {
  return new RequestSigner(request, credentials).sign()
}

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../buffer/index.js */ "tjlA").Buffer))

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYXdzNC9scnUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2F3czQvYXdzNC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQy9GQTtBQUNBLFVBQVUsbUJBQU8sQ0FBQyxpQkFBSztBQUN2QixrQkFBa0IsbUJBQU8sQ0FBQyx5QkFBYTtBQUN2QyxhQUFhLG1CQUFPLENBQUMsb0JBQVE7QUFDN0IsVUFBVSxtQkFBTyxDQUFDLG1CQUFPO0FBQ3pCOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUEsYUFBYTtBQUNiLGlCQUFpQjtBQUNqQjs7QUFFQTs7QUFFQSx3REFBd0Q7QUFDeEQ7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsR0FBRzs7QUFFSDtBQUNBO0FBQ0EscUVBQXFFOztBQUVyRTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsMkRBQTJELEVBQUU7O0FBRTdEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSyxJQUFJO0FBQ1Q7QUFDQTtBQUNBLHFEQUFxRCxHQUFHO0FBQ3hEO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQixvREFBb0Q7QUFDOUUsd0JBQXdCLHlEQUF5RDtBQUNqRjtBQUNBOztBQUVBO0FBQ0E7QUFDQSx3QkFBd0IsMkJBQTJCO0FBQ25EO0FBQ0EsWUFBWTtBQUNaOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSIsImZpbGUiOiJidWlsZC92ZW5kb3IvdmVuZG9yLmF3czQuNDcxZTczODAzOGY5MzIyYzIyNzcuY2h1bmsuanMiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHNpemUpIHtcbiAgcmV0dXJuIG5ldyBMcnVDYWNoZShzaXplKVxufVxuXG5mdW5jdGlvbiBMcnVDYWNoZShzaXplKSB7XG4gIHRoaXMuY2FwYWNpdHkgPSBzaXplIHwgMFxuICB0aGlzLm1hcCA9IE9iamVjdC5jcmVhdGUobnVsbClcbiAgdGhpcy5saXN0ID0gbmV3IERvdWJseUxpbmtlZExpc3QoKVxufVxuXG5McnVDYWNoZS5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24oa2V5KSB7XG4gIHZhciBub2RlID0gdGhpcy5tYXBba2V5XVxuICBpZiAobm9kZSA9PSBudWxsKSByZXR1cm4gdW5kZWZpbmVkXG4gIHRoaXMudXNlZChub2RlKVxuICByZXR1cm4gbm9kZS52YWxcbn1cblxuTHJ1Q2FjaGUucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uKGtleSwgdmFsKSB7XG4gIHZhciBub2RlID0gdGhpcy5tYXBba2V5XVxuICBpZiAobm9kZSAhPSBudWxsKSB7XG4gICAgbm9kZS52YWwgPSB2YWxcbiAgfSBlbHNlIHtcbiAgICBpZiAoIXRoaXMuY2FwYWNpdHkpIHRoaXMucHJ1bmUoKVxuICAgIGlmICghdGhpcy5jYXBhY2l0eSkgcmV0dXJuIGZhbHNlXG4gICAgbm9kZSA9IG5ldyBEb3VibHlMaW5rZWROb2RlKGtleSwgdmFsKVxuICAgIHRoaXMubWFwW2tleV0gPSBub2RlXG4gICAgdGhpcy5jYXBhY2l0eS0tXG4gIH1cbiAgdGhpcy51c2VkKG5vZGUpXG4gIHJldHVybiB0cnVlXG59XG5cbkxydUNhY2hlLnByb3RvdHlwZS51c2VkID0gZnVuY3Rpb24obm9kZSkge1xuICB0aGlzLmxpc3QubW92ZVRvRnJvbnQobm9kZSlcbn1cblxuTHJ1Q2FjaGUucHJvdG90eXBlLnBydW5lID0gZnVuY3Rpb24oKSB7XG4gIHZhciBub2RlID0gdGhpcy5saXN0LnBvcCgpXG4gIGlmIChub2RlICE9IG51bGwpIHtcbiAgICBkZWxldGUgdGhpcy5tYXBbbm9kZS5rZXldXG4gICAgdGhpcy5jYXBhY2l0eSsrXG4gIH1cbn1cblxuXG5mdW5jdGlvbiBEb3VibHlMaW5rZWRMaXN0KCkge1xuICB0aGlzLmZpcnN0Tm9kZSA9IG51bGxcbiAgdGhpcy5sYXN0Tm9kZSA9IG51bGxcbn1cblxuRG91Ymx5TGlua2VkTGlzdC5wcm90b3R5cGUubW92ZVRvRnJvbnQgPSBmdW5jdGlvbihub2RlKSB7XG4gIGlmICh0aGlzLmZpcnN0Tm9kZSA9PSBub2RlKSByZXR1cm5cblxuICB0aGlzLnJlbW92ZShub2RlKVxuXG4gIGlmICh0aGlzLmZpcnN0Tm9kZSA9PSBudWxsKSB7XG4gICAgdGhpcy5maXJzdE5vZGUgPSBub2RlXG4gICAgdGhpcy5sYXN0Tm9kZSA9IG5vZGVcbiAgICBub2RlLnByZXYgPSBudWxsXG4gICAgbm9kZS5uZXh0ID0gbnVsbFxuICB9IGVsc2Uge1xuICAgIG5vZGUucHJldiA9IG51bGxcbiAgICBub2RlLm5leHQgPSB0aGlzLmZpcnN0Tm9kZVxuICAgIG5vZGUubmV4dC5wcmV2ID0gbm9kZVxuICAgIHRoaXMuZmlyc3ROb2RlID0gbm9kZVxuICB9XG59XG5cbkRvdWJseUxpbmtlZExpc3QucHJvdG90eXBlLnBvcCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgbGFzdE5vZGUgPSB0aGlzLmxhc3ROb2RlXG4gIGlmIChsYXN0Tm9kZSAhPSBudWxsKSB7XG4gICAgdGhpcy5yZW1vdmUobGFzdE5vZGUpXG4gIH1cbiAgcmV0dXJuIGxhc3ROb2RlXG59XG5cbkRvdWJseUxpbmtlZExpc3QucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uKG5vZGUpIHtcbiAgaWYgKHRoaXMuZmlyc3ROb2RlID09IG5vZGUpIHtcbiAgICB0aGlzLmZpcnN0Tm9kZSA9IG5vZGUubmV4dFxuICB9IGVsc2UgaWYgKG5vZGUucHJldiAhPSBudWxsKSB7XG4gICAgbm9kZS5wcmV2Lm5leHQgPSBub2RlLm5leHRcbiAgfVxuICBpZiAodGhpcy5sYXN0Tm9kZSA9PSBub2RlKSB7XG4gICAgdGhpcy5sYXN0Tm9kZSA9IG5vZGUucHJldlxuICB9IGVsc2UgaWYgKG5vZGUubmV4dCAhPSBudWxsKSB7XG4gICAgbm9kZS5uZXh0LnByZXYgPSBub2RlLnByZXZcbiAgfVxufVxuXG5cbmZ1bmN0aW9uIERvdWJseUxpbmtlZE5vZGUoa2V5LCB2YWwpIHtcbiAgdGhpcy5rZXkgPSBrZXlcbiAgdGhpcy52YWwgPSB2YWxcbiAgdGhpcy5wcmV2ID0gbnVsbFxuICB0aGlzLm5leHQgPSBudWxsXG59XG4iLCJ2YXIgYXdzNCA9IGV4cG9ydHMsXG4gICAgdXJsID0gcmVxdWlyZSgndXJsJyksXG4gICAgcXVlcnlzdHJpbmcgPSByZXF1aXJlKCdxdWVyeXN0cmluZycpLFxuICAgIGNyeXB0byA9IHJlcXVpcmUoJ2NyeXB0bycpLFxuICAgIGxydSA9IHJlcXVpcmUoJy4vbHJ1JyksXG4gICAgY3JlZGVudGlhbHNDYWNoZSA9IGxydSgxMDAwKVxuXG4vLyBodHRwOi8vZG9jcy5hbWF6b253ZWJzZXJ2aWNlcy5jb20vZ2VuZXJhbC9sYXRlc3QvZ3Ivc2lnbmF0dXJlLXZlcnNpb24tNC5odG1sXG5cbmZ1bmN0aW9uIGhtYWMoa2V5LCBzdHJpbmcsIGVuY29kaW5nKSB7XG4gIHJldHVybiBjcnlwdG8uY3JlYXRlSG1hYygnc2hhMjU2Jywga2V5KS51cGRhdGUoc3RyaW5nLCAndXRmOCcpLmRpZ2VzdChlbmNvZGluZylcbn1cblxuZnVuY3Rpb24gaGFzaChzdHJpbmcsIGVuY29kaW5nKSB7XG4gIHJldHVybiBjcnlwdG8uY3JlYXRlSGFzaCgnc2hhMjU2JykudXBkYXRlKHN0cmluZywgJ3V0ZjgnKS5kaWdlc3QoZW5jb2RpbmcpXG59XG5cbi8vIFRoaXMgZnVuY3Rpb24gYXNzdW1lcyB0aGUgc3RyaW5nIGhhcyBhbHJlYWR5IGJlZW4gcGVyY2VudCBlbmNvZGVkXG5mdW5jdGlvbiBlbmNvZGVSZmMzOTg2KHVybEVuY29kZWRTdHJpbmcpIHtcbiAgcmV0dXJuIHVybEVuY29kZWRTdHJpbmcucmVwbGFjZSgvWyEnKCkqXS9nLCBmdW5jdGlvbihjKSB7XG4gICAgcmV0dXJuICclJyArIGMuY2hhckNvZGVBdCgwKS50b1N0cmluZygxNikudG9VcHBlckNhc2UoKVxuICB9KVxufVxuXG4vLyByZXF1ZXN0OiB7IHBhdGggfCBib2R5LCBbaG9zdF0sIFttZXRob2RdLCBbaGVhZGVyc10sIFtzZXJ2aWNlXSwgW3JlZ2lvbl0gfVxuLy8gY3JlZGVudGlhbHM6IHsgYWNjZXNzS2V5SWQsIHNlY3JldEFjY2Vzc0tleSwgW3Nlc3Npb25Ub2tlbl0gfVxuZnVuY3Rpb24gUmVxdWVzdFNpZ25lcihyZXF1ZXN0LCBjcmVkZW50aWFscykge1xuXG4gIGlmICh0eXBlb2YgcmVxdWVzdCA9PT0gJ3N0cmluZycpIHJlcXVlc3QgPSB1cmwucGFyc2UocmVxdWVzdClcblxuICB2YXIgaGVhZGVycyA9IHJlcXVlc3QuaGVhZGVycyA9IChyZXF1ZXN0LmhlYWRlcnMgfHwge30pLFxuICAgICAgaG9zdFBhcnRzID0gdGhpcy5tYXRjaEhvc3QocmVxdWVzdC5ob3N0bmFtZSB8fCByZXF1ZXN0Lmhvc3QgfHwgaGVhZGVycy5Ib3N0IHx8IGhlYWRlcnMuaG9zdClcblxuICB0aGlzLnJlcXVlc3QgPSByZXF1ZXN0XG4gIHRoaXMuY3JlZGVudGlhbHMgPSBjcmVkZW50aWFscyB8fCB0aGlzLmRlZmF1bHRDcmVkZW50aWFscygpXG5cbiAgdGhpcy5zZXJ2aWNlID0gcmVxdWVzdC5zZXJ2aWNlIHx8IGhvc3RQYXJ0c1swXSB8fCAnJ1xuICB0aGlzLnJlZ2lvbiA9IHJlcXVlc3QucmVnaW9uIHx8IGhvc3RQYXJ0c1sxXSB8fCAndXMtZWFzdC0xJ1xuXG4gIC8vIFNFUyB1c2VzIGEgZGlmZmVyZW50IGRvbWFpbiBmcm9tIHRoZSBzZXJ2aWNlIG5hbWVcbiAgaWYgKHRoaXMuc2VydmljZSA9PT0gJ2VtYWlsJykgdGhpcy5zZXJ2aWNlID0gJ3NlcydcblxuICBpZiAoIXJlcXVlc3QubWV0aG9kICYmIHJlcXVlc3QuYm9keSlcbiAgICByZXF1ZXN0Lm1ldGhvZCA9ICdQT1NUJ1xuXG4gIGlmICghaGVhZGVycy5Ib3N0ICYmICFoZWFkZXJzLmhvc3QpIHtcbiAgICBoZWFkZXJzLkhvc3QgPSByZXF1ZXN0Lmhvc3RuYW1lIHx8IHJlcXVlc3QuaG9zdCB8fCB0aGlzLmNyZWF0ZUhvc3QoKVxuXG4gICAgLy8gSWYgYSBwb3J0IGlzIHNwZWNpZmllZCBleHBsaWNpdGx5LCB1c2UgaXQgYXMgaXNcbiAgICBpZiAocmVxdWVzdC5wb3J0KVxuICAgICAgaGVhZGVycy5Ib3N0ICs9ICc6JyArIHJlcXVlc3QucG9ydFxuICB9XG4gIGlmICghcmVxdWVzdC5ob3N0bmFtZSAmJiAhcmVxdWVzdC5ob3N0KVxuICAgIHJlcXVlc3QuaG9zdG5hbWUgPSBoZWFkZXJzLkhvc3QgfHwgaGVhZGVycy5ob3N0XG5cbiAgdGhpcy5pc0NvZGVDb21taXRHaXQgPSB0aGlzLnNlcnZpY2UgPT09ICdjb2RlY29tbWl0JyAmJiByZXF1ZXN0Lm1ldGhvZCA9PT0gJ0dJVCdcbn1cblxuUmVxdWVzdFNpZ25lci5wcm90b3R5cGUubWF0Y2hIb3N0ID0gZnVuY3Rpb24oaG9zdCkge1xuICB2YXIgbWF0Y2ggPSAoaG9zdCB8fCAnJykubWF0Y2goLyhbXlxcLl0rKVxcLig/OihbXlxcLl0qKVxcLik/YW1hem9uYXdzXFwuY29tKFxcLmNuKT8kLylcbiAgdmFyIGhvc3RQYXJ0cyA9IChtYXRjaCB8fCBbXSkuc2xpY2UoMSwgMylcblxuICAvLyBFUydzIGhvc3RQYXJ0cyBhcmUgc29tZXRpbWVzIHRoZSBvdGhlciB3YXkgcm91bmQsIGlmIHRoZSB2YWx1ZSB0aGF0IGlzIGV4cGVjdGVkXG4gIC8vIHRvIGJlIHJlZ2lvbiBlcXVhbHMg4oCYZXPigJkgc3dpdGNoIHRoZW0gYmFja1xuICAvLyBlLmcuIHNlYXJjaC1jbHVzdGVyLW5hbWUtYWFhYTAwYWFhYTBhYWEwYWFhYWFhYTBhYWEudXMtZWFzdC0xLmVzLmFtYXpvbmF3cy5jb21cbiAgaWYgKGhvc3RQYXJ0c1sxXSA9PT0gJ2VzJylcbiAgICBob3N0UGFydHMgPSBob3N0UGFydHMucmV2ZXJzZSgpXG5cbiAgcmV0dXJuIGhvc3RQYXJ0c1xufVxuXG4vLyBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9nZW5lcmFsL2xhdGVzdC9nci9yYW5kZS5odG1sXG5SZXF1ZXN0U2lnbmVyLnByb3RvdHlwZS5pc1NpbmdsZVJlZ2lvbiA9IGZ1bmN0aW9uKCkge1xuICAvLyBTcGVjaWFsIGNhc2UgZm9yIFMzIGFuZCBTaW1wbGVEQiBpbiB1cy1lYXN0LTFcbiAgaWYgKFsnczMnLCAnc2RiJ10uaW5kZXhPZih0aGlzLnNlcnZpY2UpID49IDAgJiYgdGhpcy5yZWdpb24gPT09ICd1cy1lYXN0LTEnKSByZXR1cm4gdHJ1ZVxuXG4gIHJldHVybiBbJ2Nsb3VkZnJvbnQnLCAnbHMnLCAncm91dGU1MycsICdpYW0nLCAnaW1wb3J0ZXhwb3J0JywgJ3N0cyddXG4gICAgLmluZGV4T2YodGhpcy5zZXJ2aWNlKSA+PSAwXG59XG5cblJlcXVlc3RTaWduZXIucHJvdG90eXBlLmNyZWF0ZUhvc3QgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHJlZ2lvbiA9IHRoaXMuaXNTaW5nbGVSZWdpb24oKSA/ICcnIDpcbiAgICAgICAgKHRoaXMuc2VydmljZSA9PT0gJ3MzJyAmJiB0aGlzLnJlZ2lvbiAhPT0gJ3VzLWVhc3QtMScgPyAnLScgOiAnLicpICsgdGhpcy5yZWdpb24sXG4gICAgICBzZXJ2aWNlID0gdGhpcy5zZXJ2aWNlID09PSAnc2VzJyA/ICdlbWFpbCcgOiB0aGlzLnNlcnZpY2VcbiAgcmV0dXJuIHNlcnZpY2UgKyByZWdpb24gKyAnLmFtYXpvbmF3cy5jb20nXG59XG5cblJlcXVlc3RTaWduZXIucHJvdG90eXBlLnByZXBhcmVSZXF1ZXN0ID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMucGFyc2VQYXRoKClcblxuICB2YXIgcmVxdWVzdCA9IHRoaXMucmVxdWVzdCwgaGVhZGVycyA9IHJlcXVlc3QuaGVhZGVycywgcXVlcnlcblxuICBpZiAocmVxdWVzdC5zaWduUXVlcnkpIHtcblxuICAgIHRoaXMucGFyc2VkUGF0aC5xdWVyeSA9IHF1ZXJ5ID0gdGhpcy5wYXJzZWRQYXRoLnF1ZXJ5IHx8IHt9XG5cbiAgICBpZiAodGhpcy5jcmVkZW50aWFscy5zZXNzaW9uVG9rZW4pXG4gICAgICBxdWVyeVsnWC1BbXotU2VjdXJpdHktVG9rZW4nXSA9IHRoaXMuY3JlZGVudGlhbHMuc2Vzc2lvblRva2VuXG5cbiAgICBpZiAodGhpcy5zZXJ2aWNlID09PSAnczMnICYmICFxdWVyeVsnWC1BbXotRXhwaXJlcyddKVxuICAgICAgcXVlcnlbJ1gtQW16LUV4cGlyZXMnXSA9IDg2NDAwXG5cbiAgICBpZiAocXVlcnlbJ1gtQW16LURhdGUnXSlcbiAgICAgIHRoaXMuZGF0ZXRpbWUgPSBxdWVyeVsnWC1BbXotRGF0ZSddXG4gICAgZWxzZVxuICAgICAgcXVlcnlbJ1gtQW16LURhdGUnXSA9IHRoaXMuZ2V0RGF0ZVRpbWUoKVxuXG4gICAgcXVlcnlbJ1gtQW16LUFsZ29yaXRobSddID0gJ0FXUzQtSE1BQy1TSEEyNTYnXG4gICAgcXVlcnlbJ1gtQW16LUNyZWRlbnRpYWwnXSA9IHRoaXMuY3JlZGVudGlhbHMuYWNjZXNzS2V5SWQgKyAnLycgKyB0aGlzLmNyZWRlbnRpYWxTdHJpbmcoKVxuICAgIHF1ZXJ5WydYLUFtei1TaWduZWRIZWFkZXJzJ10gPSB0aGlzLnNpZ25lZEhlYWRlcnMoKVxuXG4gIH0gZWxzZSB7XG5cbiAgICBpZiAoIXJlcXVlc3QuZG9Ob3RNb2RpZnlIZWFkZXJzICYmICF0aGlzLmlzQ29kZUNvbW1pdEdpdCkge1xuICAgICAgaWYgKHJlcXVlc3QuYm9keSAmJiAhaGVhZGVyc1snQ29udGVudC1UeXBlJ10gJiYgIWhlYWRlcnNbJ2NvbnRlbnQtdHlwZSddKVxuICAgICAgICBoZWFkZXJzWydDb250ZW50LVR5cGUnXSA9ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQ7IGNoYXJzZXQ9dXRmLTgnXG5cbiAgICAgIGlmIChyZXF1ZXN0LmJvZHkgJiYgIWhlYWRlcnNbJ0NvbnRlbnQtTGVuZ3RoJ10gJiYgIWhlYWRlcnNbJ2NvbnRlbnQtbGVuZ3RoJ10pXG4gICAgICAgIGhlYWRlcnNbJ0NvbnRlbnQtTGVuZ3RoJ10gPSBCdWZmZXIuYnl0ZUxlbmd0aChyZXF1ZXN0LmJvZHkpXG5cbiAgICAgIGlmICh0aGlzLmNyZWRlbnRpYWxzLnNlc3Npb25Ub2tlbiAmJiAhaGVhZGVyc1snWC1BbXotU2VjdXJpdHktVG9rZW4nXSAmJiAhaGVhZGVyc1sneC1hbXotc2VjdXJpdHktdG9rZW4nXSlcbiAgICAgICAgaGVhZGVyc1snWC1BbXotU2VjdXJpdHktVG9rZW4nXSA9IHRoaXMuY3JlZGVudGlhbHMuc2Vzc2lvblRva2VuXG5cbiAgICAgIGlmICh0aGlzLnNlcnZpY2UgPT09ICdzMycgJiYgIWhlYWRlcnNbJ1gtQW16LUNvbnRlbnQtU2hhMjU2J10gJiYgIWhlYWRlcnNbJ3gtYW16LWNvbnRlbnQtc2hhMjU2J10pXG4gICAgICAgIGhlYWRlcnNbJ1gtQW16LUNvbnRlbnQtU2hhMjU2J10gPSBoYXNoKHRoaXMucmVxdWVzdC5ib2R5IHx8ICcnLCAnaGV4JylcblxuICAgICAgaWYgKGhlYWRlcnNbJ1gtQW16LURhdGUnXSB8fCBoZWFkZXJzWyd4LWFtei1kYXRlJ10pXG4gICAgICAgIHRoaXMuZGF0ZXRpbWUgPSBoZWFkZXJzWydYLUFtei1EYXRlJ10gfHwgaGVhZGVyc1sneC1hbXotZGF0ZSddXG4gICAgICBlbHNlXG4gICAgICAgIGhlYWRlcnNbJ1gtQW16LURhdGUnXSA9IHRoaXMuZ2V0RGF0ZVRpbWUoKVxuICAgIH1cblxuICAgIGRlbGV0ZSBoZWFkZXJzLkF1dGhvcml6YXRpb25cbiAgICBkZWxldGUgaGVhZGVycy5hdXRob3JpemF0aW9uXG4gIH1cbn1cblxuUmVxdWVzdFNpZ25lci5wcm90b3R5cGUuc2lnbiA9IGZ1bmN0aW9uKCkge1xuICBpZiAoIXRoaXMucGFyc2VkUGF0aCkgdGhpcy5wcmVwYXJlUmVxdWVzdCgpXG5cbiAgaWYgKHRoaXMucmVxdWVzdC5zaWduUXVlcnkpIHtcbiAgICB0aGlzLnBhcnNlZFBhdGgucXVlcnlbJ1gtQW16LVNpZ25hdHVyZSddID0gdGhpcy5zaWduYXR1cmUoKVxuICB9IGVsc2Uge1xuICAgIHRoaXMucmVxdWVzdC5oZWFkZXJzLkF1dGhvcml6YXRpb24gPSB0aGlzLmF1dGhIZWFkZXIoKVxuICB9XG5cbiAgdGhpcy5yZXF1ZXN0LnBhdGggPSB0aGlzLmZvcm1hdFBhdGgoKVxuXG4gIHJldHVybiB0aGlzLnJlcXVlc3Rcbn1cblxuUmVxdWVzdFNpZ25lci5wcm90b3R5cGUuZ2V0RGF0ZVRpbWUgPSBmdW5jdGlvbigpIHtcbiAgaWYgKCF0aGlzLmRhdGV0aW1lKSB7XG4gICAgdmFyIGhlYWRlcnMgPSB0aGlzLnJlcXVlc3QuaGVhZGVycyxcbiAgICAgIGRhdGUgPSBuZXcgRGF0ZShoZWFkZXJzLkRhdGUgfHwgaGVhZGVycy5kYXRlIHx8IG5ldyBEYXRlKVxuXG4gICAgdGhpcy5kYXRldGltZSA9IGRhdGUudG9JU09TdHJpbmcoKS5yZXBsYWNlKC9bOlxcLV18XFwuXFxkezN9L2csICcnKVxuXG4gICAgLy8gUmVtb3ZlIHRoZSB0cmFpbGluZyAnWicgb24gdGhlIHRpbWVzdGFtcCBzdHJpbmcgZm9yIENvZGVDb21taXQgZ2l0IGFjY2Vzc1xuICAgIGlmICh0aGlzLmlzQ29kZUNvbW1pdEdpdCkgdGhpcy5kYXRldGltZSA9IHRoaXMuZGF0ZXRpbWUuc2xpY2UoMCwgLTEpXG4gIH1cbiAgcmV0dXJuIHRoaXMuZGF0ZXRpbWVcbn1cblxuUmVxdWVzdFNpZ25lci5wcm90b3R5cGUuZ2V0RGF0ZSA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5nZXREYXRlVGltZSgpLnN1YnN0cigwLCA4KVxufVxuXG5SZXF1ZXN0U2lnbmVyLnByb3RvdHlwZS5hdXRoSGVhZGVyID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBbXG4gICAgJ0FXUzQtSE1BQy1TSEEyNTYgQ3JlZGVudGlhbD0nICsgdGhpcy5jcmVkZW50aWFscy5hY2Nlc3NLZXlJZCArICcvJyArIHRoaXMuY3JlZGVudGlhbFN0cmluZygpLFxuICAgICdTaWduZWRIZWFkZXJzPScgKyB0aGlzLnNpZ25lZEhlYWRlcnMoKSxcbiAgICAnU2lnbmF0dXJlPScgKyB0aGlzLnNpZ25hdHVyZSgpLFxuICBdLmpvaW4oJywgJylcbn1cblxuUmVxdWVzdFNpZ25lci5wcm90b3R5cGUuc2lnbmF0dXJlID0gZnVuY3Rpb24oKSB7XG4gIHZhciBkYXRlID0gdGhpcy5nZXREYXRlKCksXG4gICAgICBjYWNoZUtleSA9IFt0aGlzLmNyZWRlbnRpYWxzLnNlY3JldEFjY2Vzc0tleSwgZGF0ZSwgdGhpcy5yZWdpb24sIHRoaXMuc2VydmljZV0uam9pbigpLFxuICAgICAga0RhdGUsIGtSZWdpb24sIGtTZXJ2aWNlLCBrQ3JlZGVudGlhbHMgPSBjcmVkZW50aWFsc0NhY2hlLmdldChjYWNoZUtleSlcbiAgaWYgKCFrQ3JlZGVudGlhbHMpIHtcbiAgICBrRGF0ZSA9IGhtYWMoJ0FXUzQnICsgdGhpcy5jcmVkZW50aWFscy5zZWNyZXRBY2Nlc3NLZXksIGRhdGUpXG4gICAga1JlZ2lvbiA9IGhtYWMoa0RhdGUsIHRoaXMucmVnaW9uKVxuICAgIGtTZXJ2aWNlID0gaG1hYyhrUmVnaW9uLCB0aGlzLnNlcnZpY2UpXG4gICAga0NyZWRlbnRpYWxzID0gaG1hYyhrU2VydmljZSwgJ2F3czRfcmVxdWVzdCcpXG4gICAgY3JlZGVudGlhbHNDYWNoZS5zZXQoY2FjaGVLZXksIGtDcmVkZW50aWFscylcbiAgfVxuICByZXR1cm4gaG1hYyhrQ3JlZGVudGlhbHMsIHRoaXMuc3RyaW5nVG9TaWduKCksICdoZXgnKVxufVxuXG5SZXF1ZXN0U2lnbmVyLnByb3RvdHlwZS5zdHJpbmdUb1NpZ24gPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIFtcbiAgICAnQVdTNC1ITUFDLVNIQTI1NicsXG4gICAgdGhpcy5nZXREYXRlVGltZSgpLFxuICAgIHRoaXMuY3JlZGVudGlhbFN0cmluZygpLFxuICAgIGhhc2godGhpcy5jYW5vbmljYWxTdHJpbmcoKSwgJ2hleCcpLFxuICBdLmpvaW4oJ1xcbicpXG59XG5cblJlcXVlc3RTaWduZXIucHJvdG90eXBlLmNhbm9uaWNhbFN0cmluZyA9IGZ1bmN0aW9uKCkge1xuICBpZiAoIXRoaXMucGFyc2VkUGF0aCkgdGhpcy5wcmVwYXJlUmVxdWVzdCgpXG5cbiAgdmFyIHBhdGhTdHIgPSB0aGlzLnBhcnNlZFBhdGgucGF0aCxcbiAgICAgIHF1ZXJ5ID0gdGhpcy5wYXJzZWRQYXRoLnF1ZXJ5LFxuICAgICAgaGVhZGVycyA9IHRoaXMucmVxdWVzdC5oZWFkZXJzLFxuICAgICAgcXVlcnlTdHIgPSAnJyxcbiAgICAgIG5vcm1hbGl6ZVBhdGggPSB0aGlzLnNlcnZpY2UgIT09ICdzMycsXG4gICAgICBkZWNvZGVQYXRoID0gdGhpcy5zZXJ2aWNlID09PSAnczMnIHx8IHRoaXMucmVxdWVzdC5kb05vdEVuY29kZVBhdGgsXG4gICAgICBkZWNvZGVTbGFzaGVzSW5QYXRoID0gdGhpcy5zZXJ2aWNlID09PSAnczMnLFxuICAgICAgZmlyc3RWYWxPbmx5ID0gdGhpcy5zZXJ2aWNlID09PSAnczMnLFxuICAgICAgYm9keUhhc2hcblxuICBpZiAodGhpcy5zZXJ2aWNlID09PSAnczMnICYmIHRoaXMucmVxdWVzdC5zaWduUXVlcnkpIHtcbiAgICBib2R5SGFzaCA9ICdVTlNJR05FRC1QQVlMT0FEJ1xuICB9IGVsc2UgaWYgKHRoaXMuaXNDb2RlQ29tbWl0R2l0KSB7XG4gICAgYm9keUhhc2ggPSAnJ1xuICB9IGVsc2Uge1xuICAgIGJvZHlIYXNoID0gaGVhZGVyc1snWC1BbXotQ29udGVudC1TaGEyNTYnXSB8fCBoZWFkZXJzWyd4LWFtei1jb250ZW50LXNoYTI1NiddIHx8XG4gICAgICBoYXNoKHRoaXMucmVxdWVzdC5ib2R5IHx8ICcnLCAnaGV4JylcbiAgfVxuXG4gIGlmIChxdWVyeSkge1xuICAgIHF1ZXJ5U3RyID0gZW5jb2RlUmZjMzk4NihxdWVyeXN0cmluZy5zdHJpbmdpZnkoT2JqZWN0LmtleXMocXVlcnkpLnNvcnQoKS5yZWR1Y2UoZnVuY3Rpb24ob2JqLCBrZXkpIHtcbiAgICAgIGlmICgha2V5KSByZXR1cm4gb2JqXG4gICAgICBvYmpba2V5XSA9ICFBcnJheS5pc0FycmF5KHF1ZXJ5W2tleV0pID8gcXVlcnlba2V5XSA6XG4gICAgICAgIChmaXJzdFZhbE9ubHkgPyBxdWVyeVtrZXldWzBdIDogcXVlcnlba2V5XS5zbGljZSgpLnNvcnQoKSlcbiAgICAgIHJldHVybiBvYmpcbiAgICB9LCB7fSkpKVxuICB9XG4gIGlmIChwYXRoU3RyICE9PSAnLycpIHtcbiAgICBpZiAobm9ybWFsaXplUGF0aCkgcGF0aFN0ciA9IHBhdGhTdHIucmVwbGFjZSgvXFwvezIsfS9nLCAnLycpXG4gICAgcGF0aFN0ciA9IHBhdGhTdHIuc3BsaXQoJy8nKS5yZWR1Y2UoZnVuY3Rpb24ocGF0aCwgcGllY2UpIHtcbiAgICAgIGlmIChub3JtYWxpemVQYXRoICYmIHBpZWNlID09PSAnLi4nKSB7XG4gICAgICAgIHBhdGgucG9wKClcbiAgICAgIH0gZWxzZSBpZiAoIW5vcm1hbGl6ZVBhdGggfHwgcGllY2UgIT09ICcuJykge1xuICAgICAgICBpZiAoZGVjb2RlUGF0aCkgcGllY2UgPSBkZWNvZGVVUklDb21wb25lbnQocGllY2UpXG4gICAgICAgIHBhdGgucHVzaChlbmNvZGVSZmMzOTg2KGVuY29kZVVSSUNvbXBvbmVudChwaWVjZSkpKVxuICAgICAgfVxuICAgICAgcmV0dXJuIHBhdGhcbiAgICB9LCBbXSkuam9pbignLycpXG4gICAgaWYgKHBhdGhTdHJbMF0gIT09ICcvJykgcGF0aFN0ciA9ICcvJyArIHBhdGhTdHJcbiAgICBpZiAoZGVjb2RlU2xhc2hlc0luUGF0aCkgcGF0aFN0ciA9IHBhdGhTdHIucmVwbGFjZSgvJTJGL2csICcvJylcbiAgfVxuXG4gIHJldHVybiBbXG4gICAgdGhpcy5yZXF1ZXN0Lm1ldGhvZCB8fCAnR0VUJyxcbiAgICBwYXRoU3RyLFxuICAgIHF1ZXJ5U3RyLFxuICAgIHRoaXMuY2Fub25pY2FsSGVhZGVycygpICsgJ1xcbicsXG4gICAgdGhpcy5zaWduZWRIZWFkZXJzKCksXG4gICAgYm9keUhhc2gsXG4gIF0uam9pbignXFxuJylcbn1cblxuUmVxdWVzdFNpZ25lci5wcm90b3R5cGUuY2Fub25pY2FsSGVhZGVycyA9IGZ1bmN0aW9uKCkge1xuICB2YXIgaGVhZGVycyA9IHRoaXMucmVxdWVzdC5oZWFkZXJzXG4gIGZ1bmN0aW9uIHRyaW1BbGwoaGVhZGVyKSB7XG4gICAgcmV0dXJuIGhlYWRlci50b1N0cmluZygpLnRyaW0oKS5yZXBsYWNlKC9cXHMrL2csICcgJylcbiAgfVxuICByZXR1cm4gT2JqZWN0LmtleXMoaGVhZGVycylcbiAgICAuc29ydChmdW5jdGlvbihhLCBiKSB7IHJldHVybiBhLnRvTG93ZXJDYXNlKCkgPCBiLnRvTG93ZXJDYXNlKCkgPyAtMSA6IDEgfSlcbiAgICAubWFwKGZ1bmN0aW9uKGtleSkgeyByZXR1cm4ga2V5LnRvTG93ZXJDYXNlKCkgKyAnOicgKyB0cmltQWxsKGhlYWRlcnNba2V5XSkgfSlcbiAgICAuam9pbignXFxuJylcbn1cblxuUmVxdWVzdFNpZ25lci5wcm90b3R5cGUuc2lnbmVkSGVhZGVycyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gT2JqZWN0LmtleXModGhpcy5yZXF1ZXN0LmhlYWRlcnMpXG4gICAgLm1hcChmdW5jdGlvbihrZXkpIHsgcmV0dXJuIGtleS50b0xvd2VyQ2FzZSgpIH0pXG4gICAgLnNvcnQoKVxuICAgIC5qb2luKCc7Jylcbn1cblxuUmVxdWVzdFNpZ25lci5wcm90b3R5cGUuY3JlZGVudGlhbFN0cmluZyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gW1xuICAgIHRoaXMuZ2V0RGF0ZSgpLFxuICAgIHRoaXMucmVnaW9uLFxuICAgIHRoaXMuc2VydmljZSxcbiAgICAnYXdzNF9yZXF1ZXN0JyxcbiAgXS5qb2luKCcvJylcbn1cblxuUmVxdWVzdFNpZ25lci5wcm90b3R5cGUuZGVmYXVsdENyZWRlbnRpYWxzID0gZnVuY3Rpb24oKSB7XG4gIHZhciBlbnYgPSBwcm9jZXNzLmVudlxuICByZXR1cm4ge1xuICAgIGFjY2Vzc0tleUlkOiBlbnYuQVdTX0FDQ0VTU19LRVlfSUQgfHwgZW52LkFXU19BQ0NFU1NfS0VZLFxuICAgIHNlY3JldEFjY2Vzc0tleTogZW52LkFXU19TRUNSRVRfQUNDRVNTX0tFWSB8fCBlbnYuQVdTX1NFQ1JFVF9LRVksXG4gICAgc2Vzc2lvblRva2VuOiBlbnYuQVdTX1NFU1NJT05fVE9LRU4sXG4gIH1cbn1cblxuUmVxdWVzdFNpZ25lci5wcm90b3R5cGUucGFyc2VQYXRoID0gZnVuY3Rpb24oKSB7XG4gIHZhciBwYXRoID0gdGhpcy5yZXF1ZXN0LnBhdGggfHwgJy8nLFxuICAgICAgcXVlcnlJeCA9IHBhdGguaW5kZXhPZignPycpLFxuICAgICAgcXVlcnkgPSBudWxsXG5cbiAgaWYgKHF1ZXJ5SXggPj0gMCkge1xuICAgIHF1ZXJ5ID0gcXVlcnlzdHJpbmcucGFyc2UocGF0aC5zbGljZShxdWVyeUl4ICsgMSkpXG4gICAgcGF0aCA9IHBhdGguc2xpY2UoMCwgcXVlcnlJeClcbiAgfVxuXG4gIC8vIFMzIGRvZXNuJ3QgYWx3YXlzIGVuY29kZSBjaGFyYWN0ZXJzID4gMTI3IGNvcnJlY3RseSBhbmRcbiAgLy8gYWxsIHNlcnZpY2VzIGRvbid0IGVuY29kZSBjaGFyYWN0ZXJzID4gMjU1IGNvcnJlY3RseVxuICAvLyBTbyBpZiB0aGVyZSBhcmUgbm9uLXJlc2VydmVkIGNoYXJzIChhbmQgaXQncyBub3QgYWxyZWFkeSBhbGwgJSBlbmNvZGVkKSwganVzdCBlbmNvZGUgdGhlbSBhbGxcbiAgaWYgKC9bXjAtOUEtWmEteiEnKCkqXFwtLl9+JS9dLy50ZXN0KHBhdGgpKSB7XG4gICAgcGF0aCA9IHBhdGguc3BsaXQoJy8nKS5tYXAoZnVuY3Rpb24ocGllY2UpIHtcbiAgICAgIHJldHVybiBlbmNvZGVVUklDb21wb25lbnQoZGVjb2RlVVJJQ29tcG9uZW50KHBpZWNlKSlcbiAgICB9KS5qb2luKCcvJylcbiAgfVxuXG4gIHRoaXMucGFyc2VkUGF0aCA9IHtcbiAgICBwYXRoOiBwYXRoLFxuICAgIHF1ZXJ5OiBxdWVyeSxcbiAgfVxufVxuXG5SZXF1ZXN0U2lnbmVyLnByb3RvdHlwZS5mb3JtYXRQYXRoID0gZnVuY3Rpb24oKSB7XG4gIHZhciBwYXRoID0gdGhpcy5wYXJzZWRQYXRoLnBhdGgsXG4gICAgICBxdWVyeSA9IHRoaXMucGFyc2VkUGF0aC5xdWVyeVxuXG4gIGlmICghcXVlcnkpIHJldHVybiBwYXRoXG5cbiAgLy8gU2VydmljZXMgZG9uJ3Qgc3VwcG9ydCBlbXB0eSBxdWVyeSBzdHJpbmcga2V5c1xuICBpZiAocXVlcnlbJyddICE9IG51bGwpIGRlbGV0ZSBxdWVyeVsnJ11cblxuICByZXR1cm4gcGF0aCArICc/JyArIGVuY29kZVJmYzM5ODYocXVlcnlzdHJpbmcuc3RyaW5naWZ5KHF1ZXJ5KSlcbn1cblxuYXdzNC5SZXF1ZXN0U2lnbmVyID0gUmVxdWVzdFNpZ25lclxuXG5hd3M0LnNpZ24gPSBmdW5jdGlvbihyZXF1ZXN0LCBjcmVkZW50aWFscykge1xuICByZXR1cm4gbmV3IFJlcXVlc3RTaWduZXIocmVxdWVzdCwgY3JlZGVudGlhbHMpLnNpZ24oKVxufVxuIl0sInNvdXJjZVJvb3QiOiIifQ==