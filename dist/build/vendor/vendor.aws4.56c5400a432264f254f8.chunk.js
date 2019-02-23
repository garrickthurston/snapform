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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYXdzNC9scnUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2F3czQvYXdzNC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQy9GQTtBQUNBLFVBQVUsbUJBQU8sQ0FBQyxpQkFBSztBQUN2QixrQkFBa0IsbUJBQU8sQ0FBQyx5QkFBYTtBQUN2QyxhQUFhLG1CQUFPLENBQUMsb0JBQVE7QUFDN0IsVUFBVSxtQkFBTyxDQUFDLG1CQUFPO0FBQ3pCOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUEsYUFBYTtBQUNiLGlCQUFpQjtBQUNqQjs7QUFFQTs7QUFFQSx3REFBd0Q7QUFDeEQ7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsR0FBRzs7QUFFSDtBQUNBO0FBQ0EscUVBQXFFOztBQUVyRTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsMkRBQTJELEVBQUU7O0FBRTdEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSyxJQUFJO0FBQ1Q7QUFDQTtBQUNBLHFEQUFxRCxHQUFHO0FBQ3hEO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQixvREFBb0Q7QUFDOUUsd0JBQXdCLHlEQUF5RDtBQUNqRjtBQUNBOztBQUVBO0FBQ0E7QUFDQSx3QkFBd0IsMkJBQTJCO0FBQ25EO0FBQ0EsWUFBWTtBQUNaOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSIsImZpbGUiOiJidWlsZC92ZW5kb3IvdmVuZG9yLmF3czQuNTZjNTQwMGE0MzIyNjRmMjU0ZjguY2h1bmsuanMiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHNpemUpIHtcclxuICByZXR1cm4gbmV3IExydUNhY2hlKHNpemUpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIExydUNhY2hlKHNpemUpIHtcclxuICB0aGlzLmNhcGFjaXR5ID0gc2l6ZSB8IDBcclxuICB0aGlzLm1hcCA9IE9iamVjdC5jcmVhdGUobnVsbClcclxuICB0aGlzLmxpc3QgPSBuZXcgRG91Ymx5TGlua2VkTGlzdCgpXHJcbn1cclxuXHJcbkxydUNhY2hlLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbihrZXkpIHtcclxuICB2YXIgbm9kZSA9IHRoaXMubWFwW2tleV1cclxuICBpZiAobm9kZSA9PSBudWxsKSByZXR1cm4gdW5kZWZpbmVkXHJcbiAgdGhpcy51c2VkKG5vZGUpXHJcbiAgcmV0dXJuIG5vZGUudmFsXHJcbn1cclxuXHJcbkxydUNhY2hlLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbihrZXksIHZhbCkge1xyXG4gIHZhciBub2RlID0gdGhpcy5tYXBba2V5XVxyXG4gIGlmIChub2RlICE9IG51bGwpIHtcclxuICAgIG5vZGUudmFsID0gdmFsXHJcbiAgfSBlbHNlIHtcclxuICAgIGlmICghdGhpcy5jYXBhY2l0eSkgdGhpcy5wcnVuZSgpXHJcbiAgICBpZiAoIXRoaXMuY2FwYWNpdHkpIHJldHVybiBmYWxzZVxyXG4gICAgbm9kZSA9IG5ldyBEb3VibHlMaW5rZWROb2RlKGtleSwgdmFsKVxyXG4gICAgdGhpcy5tYXBba2V5XSA9IG5vZGVcclxuICAgIHRoaXMuY2FwYWNpdHktLVxyXG4gIH1cclxuICB0aGlzLnVzZWQobm9kZSlcclxuICByZXR1cm4gdHJ1ZVxyXG59XHJcblxyXG5McnVDYWNoZS5wcm90b3R5cGUudXNlZCA9IGZ1bmN0aW9uKG5vZGUpIHtcclxuICB0aGlzLmxpc3QubW92ZVRvRnJvbnQobm9kZSlcclxufVxyXG5cclxuTHJ1Q2FjaGUucHJvdG90eXBlLnBydW5lID0gZnVuY3Rpb24oKSB7XHJcbiAgdmFyIG5vZGUgPSB0aGlzLmxpc3QucG9wKClcclxuICBpZiAobm9kZSAhPSBudWxsKSB7XHJcbiAgICBkZWxldGUgdGhpcy5tYXBbbm9kZS5rZXldXHJcbiAgICB0aGlzLmNhcGFjaXR5KytcclxuICB9XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBEb3VibHlMaW5rZWRMaXN0KCkge1xyXG4gIHRoaXMuZmlyc3ROb2RlID0gbnVsbFxyXG4gIHRoaXMubGFzdE5vZGUgPSBudWxsXHJcbn1cclxuXHJcbkRvdWJseUxpbmtlZExpc3QucHJvdG90eXBlLm1vdmVUb0Zyb250ID0gZnVuY3Rpb24obm9kZSkge1xyXG4gIGlmICh0aGlzLmZpcnN0Tm9kZSA9PSBub2RlKSByZXR1cm5cclxuXHJcbiAgdGhpcy5yZW1vdmUobm9kZSlcclxuXHJcbiAgaWYgKHRoaXMuZmlyc3ROb2RlID09IG51bGwpIHtcclxuICAgIHRoaXMuZmlyc3ROb2RlID0gbm9kZVxyXG4gICAgdGhpcy5sYXN0Tm9kZSA9IG5vZGVcclxuICAgIG5vZGUucHJldiA9IG51bGxcclxuICAgIG5vZGUubmV4dCA9IG51bGxcclxuICB9IGVsc2Uge1xyXG4gICAgbm9kZS5wcmV2ID0gbnVsbFxyXG4gICAgbm9kZS5uZXh0ID0gdGhpcy5maXJzdE5vZGVcclxuICAgIG5vZGUubmV4dC5wcmV2ID0gbm9kZVxyXG4gICAgdGhpcy5maXJzdE5vZGUgPSBub2RlXHJcbiAgfVxyXG59XHJcblxyXG5Eb3VibHlMaW5rZWRMaXN0LnByb3RvdHlwZS5wb3AgPSBmdW5jdGlvbigpIHtcclxuICB2YXIgbGFzdE5vZGUgPSB0aGlzLmxhc3ROb2RlXHJcbiAgaWYgKGxhc3ROb2RlICE9IG51bGwpIHtcclxuICAgIHRoaXMucmVtb3ZlKGxhc3ROb2RlKVxyXG4gIH1cclxuICByZXR1cm4gbGFzdE5vZGVcclxufVxyXG5cclxuRG91Ymx5TGlua2VkTGlzdC5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24obm9kZSkge1xyXG4gIGlmICh0aGlzLmZpcnN0Tm9kZSA9PSBub2RlKSB7XHJcbiAgICB0aGlzLmZpcnN0Tm9kZSA9IG5vZGUubmV4dFxyXG4gIH0gZWxzZSBpZiAobm9kZS5wcmV2ICE9IG51bGwpIHtcclxuICAgIG5vZGUucHJldi5uZXh0ID0gbm9kZS5uZXh0XHJcbiAgfVxyXG4gIGlmICh0aGlzLmxhc3ROb2RlID09IG5vZGUpIHtcclxuICAgIHRoaXMubGFzdE5vZGUgPSBub2RlLnByZXZcclxuICB9IGVsc2UgaWYgKG5vZGUubmV4dCAhPSBudWxsKSB7XHJcbiAgICBub2RlLm5leHQucHJldiA9IG5vZGUucHJldlxyXG4gIH1cclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIERvdWJseUxpbmtlZE5vZGUoa2V5LCB2YWwpIHtcclxuICB0aGlzLmtleSA9IGtleVxyXG4gIHRoaXMudmFsID0gdmFsXHJcbiAgdGhpcy5wcmV2ID0gbnVsbFxyXG4gIHRoaXMubmV4dCA9IG51bGxcclxufVxyXG4iLCJ2YXIgYXdzNCA9IGV4cG9ydHMsXHJcbiAgICB1cmwgPSByZXF1aXJlKCd1cmwnKSxcclxuICAgIHF1ZXJ5c3RyaW5nID0gcmVxdWlyZSgncXVlcnlzdHJpbmcnKSxcclxuICAgIGNyeXB0byA9IHJlcXVpcmUoJ2NyeXB0bycpLFxyXG4gICAgbHJ1ID0gcmVxdWlyZSgnLi9scnUnKSxcclxuICAgIGNyZWRlbnRpYWxzQ2FjaGUgPSBscnUoMTAwMClcclxuXHJcbi8vIGh0dHA6Ly9kb2NzLmFtYXpvbndlYnNlcnZpY2VzLmNvbS9nZW5lcmFsL2xhdGVzdC9nci9zaWduYXR1cmUtdmVyc2lvbi00Lmh0bWxcclxuXHJcbmZ1bmN0aW9uIGhtYWMoa2V5LCBzdHJpbmcsIGVuY29kaW5nKSB7XHJcbiAgcmV0dXJuIGNyeXB0by5jcmVhdGVIbWFjKCdzaGEyNTYnLCBrZXkpLnVwZGF0ZShzdHJpbmcsICd1dGY4JykuZGlnZXN0KGVuY29kaW5nKVxyXG59XHJcblxyXG5mdW5jdGlvbiBoYXNoKHN0cmluZywgZW5jb2RpbmcpIHtcclxuICByZXR1cm4gY3J5cHRvLmNyZWF0ZUhhc2goJ3NoYTI1NicpLnVwZGF0ZShzdHJpbmcsICd1dGY4JykuZGlnZXN0KGVuY29kaW5nKVxyXG59XHJcblxyXG4vLyBUaGlzIGZ1bmN0aW9uIGFzc3VtZXMgdGhlIHN0cmluZyBoYXMgYWxyZWFkeSBiZWVuIHBlcmNlbnQgZW5jb2RlZFxyXG5mdW5jdGlvbiBlbmNvZGVSZmMzOTg2KHVybEVuY29kZWRTdHJpbmcpIHtcclxuICByZXR1cm4gdXJsRW5jb2RlZFN0cmluZy5yZXBsYWNlKC9bIScoKSpdL2csIGZ1bmN0aW9uKGMpIHtcclxuICAgIHJldHVybiAnJScgKyBjLmNoYXJDb2RlQXQoMCkudG9TdHJpbmcoMTYpLnRvVXBwZXJDYXNlKClcclxuICB9KVxyXG59XHJcblxyXG4vLyByZXF1ZXN0OiB7IHBhdGggfCBib2R5LCBbaG9zdF0sIFttZXRob2RdLCBbaGVhZGVyc10sIFtzZXJ2aWNlXSwgW3JlZ2lvbl0gfVxyXG4vLyBjcmVkZW50aWFsczogeyBhY2Nlc3NLZXlJZCwgc2VjcmV0QWNjZXNzS2V5LCBbc2Vzc2lvblRva2VuXSB9XHJcbmZ1bmN0aW9uIFJlcXVlc3RTaWduZXIocmVxdWVzdCwgY3JlZGVudGlhbHMpIHtcclxuXHJcbiAgaWYgKHR5cGVvZiByZXF1ZXN0ID09PSAnc3RyaW5nJykgcmVxdWVzdCA9IHVybC5wYXJzZShyZXF1ZXN0KVxyXG5cclxuICB2YXIgaGVhZGVycyA9IHJlcXVlc3QuaGVhZGVycyA9IChyZXF1ZXN0LmhlYWRlcnMgfHwge30pLFxyXG4gICAgICBob3N0UGFydHMgPSB0aGlzLm1hdGNoSG9zdChyZXF1ZXN0Lmhvc3RuYW1lIHx8IHJlcXVlc3QuaG9zdCB8fCBoZWFkZXJzLkhvc3QgfHwgaGVhZGVycy5ob3N0KVxyXG5cclxuICB0aGlzLnJlcXVlc3QgPSByZXF1ZXN0XHJcbiAgdGhpcy5jcmVkZW50aWFscyA9IGNyZWRlbnRpYWxzIHx8IHRoaXMuZGVmYXVsdENyZWRlbnRpYWxzKClcclxuXHJcbiAgdGhpcy5zZXJ2aWNlID0gcmVxdWVzdC5zZXJ2aWNlIHx8IGhvc3RQYXJ0c1swXSB8fCAnJ1xyXG4gIHRoaXMucmVnaW9uID0gcmVxdWVzdC5yZWdpb24gfHwgaG9zdFBhcnRzWzFdIHx8ICd1cy1lYXN0LTEnXHJcblxyXG4gIC8vIFNFUyB1c2VzIGEgZGlmZmVyZW50IGRvbWFpbiBmcm9tIHRoZSBzZXJ2aWNlIG5hbWVcclxuICBpZiAodGhpcy5zZXJ2aWNlID09PSAnZW1haWwnKSB0aGlzLnNlcnZpY2UgPSAnc2VzJ1xyXG5cclxuICBpZiAoIXJlcXVlc3QubWV0aG9kICYmIHJlcXVlc3QuYm9keSlcclxuICAgIHJlcXVlc3QubWV0aG9kID0gJ1BPU1QnXHJcblxyXG4gIGlmICghaGVhZGVycy5Ib3N0ICYmICFoZWFkZXJzLmhvc3QpIHtcclxuICAgIGhlYWRlcnMuSG9zdCA9IHJlcXVlc3QuaG9zdG5hbWUgfHwgcmVxdWVzdC5ob3N0IHx8IHRoaXMuY3JlYXRlSG9zdCgpXHJcblxyXG4gICAgLy8gSWYgYSBwb3J0IGlzIHNwZWNpZmllZCBleHBsaWNpdGx5LCB1c2UgaXQgYXMgaXNcclxuICAgIGlmIChyZXF1ZXN0LnBvcnQpXHJcbiAgICAgIGhlYWRlcnMuSG9zdCArPSAnOicgKyByZXF1ZXN0LnBvcnRcclxuICB9XHJcbiAgaWYgKCFyZXF1ZXN0Lmhvc3RuYW1lICYmICFyZXF1ZXN0Lmhvc3QpXHJcbiAgICByZXF1ZXN0Lmhvc3RuYW1lID0gaGVhZGVycy5Ib3N0IHx8IGhlYWRlcnMuaG9zdFxyXG5cclxuICB0aGlzLmlzQ29kZUNvbW1pdEdpdCA9IHRoaXMuc2VydmljZSA9PT0gJ2NvZGVjb21taXQnICYmIHJlcXVlc3QubWV0aG9kID09PSAnR0lUJ1xyXG59XHJcblxyXG5SZXF1ZXN0U2lnbmVyLnByb3RvdHlwZS5tYXRjaEhvc3QgPSBmdW5jdGlvbihob3N0KSB7XHJcbiAgdmFyIG1hdGNoID0gKGhvc3QgfHwgJycpLm1hdGNoKC8oW15cXC5dKylcXC4oPzooW15cXC5dKilcXC4pP2FtYXpvbmF3c1xcLmNvbShcXC5jbik/JC8pXHJcbiAgdmFyIGhvc3RQYXJ0cyA9IChtYXRjaCB8fCBbXSkuc2xpY2UoMSwgMylcclxuXHJcbiAgLy8gRVMncyBob3N0UGFydHMgYXJlIHNvbWV0aW1lcyB0aGUgb3RoZXIgd2F5IHJvdW5kLCBpZiB0aGUgdmFsdWUgdGhhdCBpcyBleHBlY3RlZFxyXG4gIC8vIHRvIGJlIHJlZ2lvbiBlcXVhbHMg4oCYZXPigJkgc3dpdGNoIHRoZW0gYmFja1xyXG4gIC8vIGUuZy4gc2VhcmNoLWNsdXN0ZXItbmFtZS1hYWFhMDBhYWFhMGFhYTBhYWFhYWFhMGFhYS51cy1lYXN0LTEuZXMuYW1hem9uYXdzLmNvbVxyXG4gIGlmIChob3N0UGFydHNbMV0gPT09ICdlcycpXHJcbiAgICBob3N0UGFydHMgPSBob3N0UGFydHMucmV2ZXJzZSgpXHJcblxyXG4gIHJldHVybiBob3N0UGFydHNcclxufVxyXG5cclxuLy8gaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vZ2VuZXJhbC9sYXRlc3QvZ3IvcmFuZGUuaHRtbFxyXG5SZXF1ZXN0U2lnbmVyLnByb3RvdHlwZS5pc1NpbmdsZVJlZ2lvbiA9IGZ1bmN0aW9uKCkge1xyXG4gIC8vIFNwZWNpYWwgY2FzZSBmb3IgUzMgYW5kIFNpbXBsZURCIGluIHVzLWVhc3QtMVxyXG4gIGlmIChbJ3MzJywgJ3NkYiddLmluZGV4T2YodGhpcy5zZXJ2aWNlKSA+PSAwICYmIHRoaXMucmVnaW9uID09PSAndXMtZWFzdC0xJykgcmV0dXJuIHRydWVcclxuXHJcbiAgcmV0dXJuIFsnY2xvdWRmcm9udCcsICdscycsICdyb3V0ZTUzJywgJ2lhbScsICdpbXBvcnRleHBvcnQnLCAnc3RzJ11cclxuICAgIC5pbmRleE9mKHRoaXMuc2VydmljZSkgPj0gMFxyXG59XHJcblxyXG5SZXF1ZXN0U2lnbmVyLnByb3RvdHlwZS5jcmVhdGVIb3N0ID0gZnVuY3Rpb24oKSB7XHJcbiAgdmFyIHJlZ2lvbiA9IHRoaXMuaXNTaW5nbGVSZWdpb24oKSA/ICcnIDpcclxuICAgICAgICAodGhpcy5zZXJ2aWNlID09PSAnczMnICYmIHRoaXMucmVnaW9uICE9PSAndXMtZWFzdC0xJyA/ICctJyA6ICcuJykgKyB0aGlzLnJlZ2lvbixcclxuICAgICAgc2VydmljZSA9IHRoaXMuc2VydmljZSA9PT0gJ3NlcycgPyAnZW1haWwnIDogdGhpcy5zZXJ2aWNlXHJcbiAgcmV0dXJuIHNlcnZpY2UgKyByZWdpb24gKyAnLmFtYXpvbmF3cy5jb20nXHJcbn1cclxuXHJcblJlcXVlc3RTaWduZXIucHJvdG90eXBlLnByZXBhcmVSZXF1ZXN0ID0gZnVuY3Rpb24oKSB7XHJcbiAgdGhpcy5wYXJzZVBhdGgoKVxyXG5cclxuICB2YXIgcmVxdWVzdCA9IHRoaXMucmVxdWVzdCwgaGVhZGVycyA9IHJlcXVlc3QuaGVhZGVycywgcXVlcnlcclxuXHJcbiAgaWYgKHJlcXVlc3Quc2lnblF1ZXJ5KSB7XHJcblxyXG4gICAgdGhpcy5wYXJzZWRQYXRoLnF1ZXJ5ID0gcXVlcnkgPSB0aGlzLnBhcnNlZFBhdGgucXVlcnkgfHwge31cclxuXHJcbiAgICBpZiAodGhpcy5jcmVkZW50aWFscy5zZXNzaW9uVG9rZW4pXHJcbiAgICAgIHF1ZXJ5WydYLUFtei1TZWN1cml0eS1Ub2tlbiddID0gdGhpcy5jcmVkZW50aWFscy5zZXNzaW9uVG9rZW5cclxuXHJcbiAgICBpZiAodGhpcy5zZXJ2aWNlID09PSAnczMnICYmICFxdWVyeVsnWC1BbXotRXhwaXJlcyddKVxyXG4gICAgICBxdWVyeVsnWC1BbXotRXhwaXJlcyddID0gODY0MDBcclxuXHJcbiAgICBpZiAocXVlcnlbJ1gtQW16LURhdGUnXSlcclxuICAgICAgdGhpcy5kYXRldGltZSA9IHF1ZXJ5WydYLUFtei1EYXRlJ11cclxuICAgIGVsc2VcclxuICAgICAgcXVlcnlbJ1gtQW16LURhdGUnXSA9IHRoaXMuZ2V0RGF0ZVRpbWUoKVxyXG5cclxuICAgIHF1ZXJ5WydYLUFtei1BbGdvcml0aG0nXSA9ICdBV1M0LUhNQUMtU0hBMjU2J1xyXG4gICAgcXVlcnlbJ1gtQW16LUNyZWRlbnRpYWwnXSA9IHRoaXMuY3JlZGVudGlhbHMuYWNjZXNzS2V5SWQgKyAnLycgKyB0aGlzLmNyZWRlbnRpYWxTdHJpbmcoKVxyXG4gICAgcXVlcnlbJ1gtQW16LVNpZ25lZEhlYWRlcnMnXSA9IHRoaXMuc2lnbmVkSGVhZGVycygpXHJcblxyXG4gIH0gZWxzZSB7XHJcblxyXG4gICAgaWYgKCFyZXF1ZXN0LmRvTm90TW9kaWZ5SGVhZGVycyAmJiAhdGhpcy5pc0NvZGVDb21taXRHaXQpIHtcclxuICAgICAgaWYgKHJlcXVlc3QuYm9keSAmJiAhaGVhZGVyc1snQ29udGVudC1UeXBlJ10gJiYgIWhlYWRlcnNbJ2NvbnRlbnQtdHlwZSddKVxyXG4gICAgICAgIGhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddID0gJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZDsgY2hhcnNldD11dGYtOCdcclxuXHJcbiAgICAgIGlmIChyZXF1ZXN0LmJvZHkgJiYgIWhlYWRlcnNbJ0NvbnRlbnQtTGVuZ3RoJ10gJiYgIWhlYWRlcnNbJ2NvbnRlbnQtbGVuZ3RoJ10pXHJcbiAgICAgICAgaGVhZGVyc1snQ29udGVudC1MZW5ndGgnXSA9IEJ1ZmZlci5ieXRlTGVuZ3RoKHJlcXVlc3QuYm9keSlcclxuXHJcbiAgICAgIGlmICh0aGlzLmNyZWRlbnRpYWxzLnNlc3Npb25Ub2tlbiAmJiAhaGVhZGVyc1snWC1BbXotU2VjdXJpdHktVG9rZW4nXSAmJiAhaGVhZGVyc1sneC1hbXotc2VjdXJpdHktdG9rZW4nXSlcclxuICAgICAgICBoZWFkZXJzWydYLUFtei1TZWN1cml0eS1Ub2tlbiddID0gdGhpcy5jcmVkZW50aWFscy5zZXNzaW9uVG9rZW5cclxuXHJcbiAgICAgIGlmICh0aGlzLnNlcnZpY2UgPT09ICdzMycgJiYgIWhlYWRlcnNbJ1gtQW16LUNvbnRlbnQtU2hhMjU2J10gJiYgIWhlYWRlcnNbJ3gtYW16LWNvbnRlbnQtc2hhMjU2J10pXHJcbiAgICAgICAgaGVhZGVyc1snWC1BbXotQ29udGVudC1TaGEyNTYnXSA9IGhhc2godGhpcy5yZXF1ZXN0LmJvZHkgfHwgJycsICdoZXgnKVxyXG5cclxuICAgICAgaWYgKGhlYWRlcnNbJ1gtQW16LURhdGUnXSB8fCBoZWFkZXJzWyd4LWFtei1kYXRlJ10pXHJcbiAgICAgICAgdGhpcy5kYXRldGltZSA9IGhlYWRlcnNbJ1gtQW16LURhdGUnXSB8fCBoZWFkZXJzWyd4LWFtei1kYXRlJ11cclxuICAgICAgZWxzZVxyXG4gICAgICAgIGhlYWRlcnNbJ1gtQW16LURhdGUnXSA9IHRoaXMuZ2V0RGF0ZVRpbWUoKVxyXG4gICAgfVxyXG5cclxuICAgIGRlbGV0ZSBoZWFkZXJzLkF1dGhvcml6YXRpb25cclxuICAgIGRlbGV0ZSBoZWFkZXJzLmF1dGhvcml6YXRpb25cclxuICB9XHJcbn1cclxuXHJcblJlcXVlc3RTaWduZXIucHJvdG90eXBlLnNpZ24gPSBmdW5jdGlvbigpIHtcclxuICBpZiAoIXRoaXMucGFyc2VkUGF0aCkgdGhpcy5wcmVwYXJlUmVxdWVzdCgpXHJcblxyXG4gIGlmICh0aGlzLnJlcXVlc3Quc2lnblF1ZXJ5KSB7XHJcbiAgICB0aGlzLnBhcnNlZFBhdGgucXVlcnlbJ1gtQW16LVNpZ25hdHVyZSddID0gdGhpcy5zaWduYXR1cmUoKVxyXG4gIH0gZWxzZSB7XHJcbiAgICB0aGlzLnJlcXVlc3QuaGVhZGVycy5BdXRob3JpemF0aW9uID0gdGhpcy5hdXRoSGVhZGVyKClcclxuICB9XHJcblxyXG4gIHRoaXMucmVxdWVzdC5wYXRoID0gdGhpcy5mb3JtYXRQYXRoKClcclxuXHJcbiAgcmV0dXJuIHRoaXMucmVxdWVzdFxyXG59XHJcblxyXG5SZXF1ZXN0U2lnbmVyLnByb3RvdHlwZS5nZXREYXRlVGltZSA9IGZ1bmN0aW9uKCkge1xyXG4gIGlmICghdGhpcy5kYXRldGltZSkge1xyXG4gICAgdmFyIGhlYWRlcnMgPSB0aGlzLnJlcXVlc3QuaGVhZGVycyxcclxuICAgICAgZGF0ZSA9IG5ldyBEYXRlKGhlYWRlcnMuRGF0ZSB8fCBoZWFkZXJzLmRhdGUgfHwgbmV3IERhdGUpXHJcblxyXG4gICAgdGhpcy5kYXRldGltZSA9IGRhdGUudG9JU09TdHJpbmcoKS5yZXBsYWNlKC9bOlxcLV18XFwuXFxkezN9L2csICcnKVxyXG5cclxuICAgIC8vIFJlbW92ZSB0aGUgdHJhaWxpbmcgJ1onIG9uIHRoZSB0aW1lc3RhbXAgc3RyaW5nIGZvciBDb2RlQ29tbWl0IGdpdCBhY2Nlc3NcclxuICAgIGlmICh0aGlzLmlzQ29kZUNvbW1pdEdpdCkgdGhpcy5kYXRldGltZSA9IHRoaXMuZGF0ZXRpbWUuc2xpY2UoMCwgLTEpXHJcbiAgfVxyXG4gIHJldHVybiB0aGlzLmRhdGV0aW1lXHJcbn1cclxuXHJcblJlcXVlc3RTaWduZXIucHJvdG90eXBlLmdldERhdGUgPSBmdW5jdGlvbigpIHtcclxuICByZXR1cm4gdGhpcy5nZXREYXRlVGltZSgpLnN1YnN0cigwLCA4KVxyXG59XHJcblxyXG5SZXF1ZXN0U2lnbmVyLnByb3RvdHlwZS5hdXRoSGVhZGVyID0gZnVuY3Rpb24oKSB7XHJcbiAgcmV0dXJuIFtcclxuICAgICdBV1M0LUhNQUMtU0hBMjU2IENyZWRlbnRpYWw9JyArIHRoaXMuY3JlZGVudGlhbHMuYWNjZXNzS2V5SWQgKyAnLycgKyB0aGlzLmNyZWRlbnRpYWxTdHJpbmcoKSxcclxuICAgICdTaWduZWRIZWFkZXJzPScgKyB0aGlzLnNpZ25lZEhlYWRlcnMoKSxcclxuICAgICdTaWduYXR1cmU9JyArIHRoaXMuc2lnbmF0dXJlKCksXHJcbiAgXS5qb2luKCcsICcpXHJcbn1cclxuXHJcblJlcXVlc3RTaWduZXIucHJvdG90eXBlLnNpZ25hdHVyZSA9IGZ1bmN0aW9uKCkge1xyXG4gIHZhciBkYXRlID0gdGhpcy5nZXREYXRlKCksXHJcbiAgICAgIGNhY2hlS2V5ID0gW3RoaXMuY3JlZGVudGlhbHMuc2VjcmV0QWNjZXNzS2V5LCBkYXRlLCB0aGlzLnJlZ2lvbiwgdGhpcy5zZXJ2aWNlXS5qb2luKCksXHJcbiAgICAgIGtEYXRlLCBrUmVnaW9uLCBrU2VydmljZSwga0NyZWRlbnRpYWxzID0gY3JlZGVudGlhbHNDYWNoZS5nZXQoY2FjaGVLZXkpXHJcbiAgaWYgKCFrQ3JlZGVudGlhbHMpIHtcclxuICAgIGtEYXRlID0gaG1hYygnQVdTNCcgKyB0aGlzLmNyZWRlbnRpYWxzLnNlY3JldEFjY2Vzc0tleSwgZGF0ZSlcclxuICAgIGtSZWdpb24gPSBobWFjKGtEYXRlLCB0aGlzLnJlZ2lvbilcclxuICAgIGtTZXJ2aWNlID0gaG1hYyhrUmVnaW9uLCB0aGlzLnNlcnZpY2UpXHJcbiAgICBrQ3JlZGVudGlhbHMgPSBobWFjKGtTZXJ2aWNlLCAnYXdzNF9yZXF1ZXN0JylcclxuICAgIGNyZWRlbnRpYWxzQ2FjaGUuc2V0KGNhY2hlS2V5LCBrQ3JlZGVudGlhbHMpXHJcbiAgfVxyXG4gIHJldHVybiBobWFjKGtDcmVkZW50aWFscywgdGhpcy5zdHJpbmdUb1NpZ24oKSwgJ2hleCcpXHJcbn1cclxuXHJcblJlcXVlc3RTaWduZXIucHJvdG90eXBlLnN0cmluZ1RvU2lnbiA9IGZ1bmN0aW9uKCkge1xyXG4gIHJldHVybiBbXHJcbiAgICAnQVdTNC1ITUFDLVNIQTI1NicsXHJcbiAgICB0aGlzLmdldERhdGVUaW1lKCksXHJcbiAgICB0aGlzLmNyZWRlbnRpYWxTdHJpbmcoKSxcclxuICAgIGhhc2godGhpcy5jYW5vbmljYWxTdHJpbmcoKSwgJ2hleCcpLFxyXG4gIF0uam9pbignXFxuJylcclxufVxyXG5cclxuUmVxdWVzdFNpZ25lci5wcm90b3R5cGUuY2Fub25pY2FsU3RyaW5nID0gZnVuY3Rpb24oKSB7XHJcbiAgaWYgKCF0aGlzLnBhcnNlZFBhdGgpIHRoaXMucHJlcGFyZVJlcXVlc3QoKVxyXG5cclxuICB2YXIgcGF0aFN0ciA9IHRoaXMucGFyc2VkUGF0aC5wYXRoLFxyXG4gICAgICBxdWVyeSA9IHRoaXMucGFyc2VkUGF0aC5xdWVyeSxcclxuICAgICAgaGVhZGVycyA9IHRoaXMucmVxdWVzdC5oZWFkZXJzLFxyXG4gICAgICBxdWVyeVN0ciA9ICcnLFxyXG4gICAgICBub3JtYWxpemVQYXRoID0gdGhpcy5zZXJ2aWNlICE9PSAnczMnLFxyXG4gICAgICBkZWNvZGVQYXRoID0gdGhpcy5zZXJ2aWNlID09PSAnczMnIHx8IHRoaXMucmVxdWVzdC5kb05vdEVuY29kZVBhdGgsXHJcbiAgICAgIGRlY29kZVNsYXNoZXNJblBhdGggPSB0aGlzLnNlcnZpY2UgPT09ICdzMycsXHJcbiAgICAgIGZpcnN0VmFsT25seSA9IHRoaXMuc2VydmljZSA9PT0gJ3MzJyxcclxuICAgICAgYm9keUhhc2hcclxuXHJcbiAgaWYgKHRoaXMuc2VydmljZSA9PT0gJ3MzJyAmJiB0aGlzLnJlcXVlc3Quc2lnblF1ZXJ5KSB7XHJcbiAgICBib2R5SGFzaCA9ICdVTlNJR05FRC1QQVlMT0FEJ1xyXG4gIH0gZWxzZSBpZiAodGhpcy5pc0NvZGVDb21taXRHaXQpIHtcclxuICAgIGJvZHlIYXNoID0gJydcclxuICB9IGVsc2Uge1xyXG4gICAgYm9keUhhc2ggPSBoZWFkZXJzWydYLUFtei1Db250ZW50LVNoYTI1NiddIHx8IGhlYWRlcnNbJ3gtYW16LWNvbnRlbnQtc2hhMjU2J10gfHxcclxuICAgICAgaGFzaCh0aGlzLnJlcXVlc3QuYm9keSB8fCAnJywgJ2hleCcpXHJcbiAgfVxyXG5cclxuICBpZiAocXVlcnkpIHtcclxuICAgIHF1ZXJ5U3RyID0gZW5jb2RlUmZjMzk4NihxdWVyeXN0cmluZy5zdHJpbmdpZnkoT2JqZWN0LmtleXMocXVlcnkpLnNvcnQoKS5yZWR1Y2UoZnVuY3Rpb24ob2JqLCBrZXkpIHtcclxuICAgICAgaWYgKCFrZXkpIHJldHVybiBvYmpcclxuICAgICAgb2JqW2tleV0gPSAhQXJyYXkuaXNBcnJheShxdWVyeVtrZXldKSA/IHF1ZXJ5W2tleV0gOlxyXG4gICAgICAgIChmaXJzdFZhbE9ubHkgPyBxdWVyeVtrZXldWzBdIDogcXVlcnlba2V5XS5zbGljZSgpLnNvcnQoKSlcclxuICAgICAgcmV0dXJuIG9ialxyXG4gICAgfSwge30pKSlcclxuICB9XHJcbiAgaWYgKHBhdGhTdHIgIT09ICcvJykge1xyXG4gICAgaWYgKG5vcm1hbGl6ZVBhdGgpIHBhdGhTdHIgPSBwYXRoU3RyLnJlcGxhY2UoL1xcL3syLH0vZywgJy8nKVxyXG4gICAgcGF0aFN0ciA9IHBhdGhTdHIuc3BsaXQoJy8nKS5yZWR1Y2UoZnVuY3Rpb24ocGF0aCwgcGllY2UpIHtcclxuICAgICAgaWYgKG5vcm1hbGl6ZVBhdGggJiYgcGllY2UgPT09ICcuLicpIHtcclxuICAgICAgICBwYXRoLnBvcCgpXHJcbiAgICAgIH0gZWxzZSBpZiAoIW5vcm1hbGl6ZVBhdGggfHwgcGllY2UgIT09ICcuJykge1xyXG4gICAgICAgIGlmIChkZWNvZGVQYXRoKSBwaWVjZSA9IGRlY29kZVVSSUNvbXBvbmVudChwaWVjZSlcclxuICAgICAgICBwYXRoLnB1c2goZW5jb2RlUmZjMzk4NihlbmNvZGVVUklDb21wb25lbnQocGllY2UpKSlcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gcGF0aFxyXG4gICAgfSwgW10pLmpvaW4oJy8nKVxyXG4gICAgaWYgKHBhdGhTdHJbMF0gIT09ICcvJykgcGF0aFN0ciA9ICcvJyArIHBhdGhTdHJcclxuICAgIGlmIChkZWNvZGVTbGFzaGVzSW5QYXRoKSBwYXRoU3RyID0gcGF0aFN0ci5yZXBsYWNlKC8lMkYvZywgJy8nKVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIFtcclxuICAgIHRoaXMucmVxdWVzdC5tZXRob2QgfHwgJ0dFVCcsXHJcbiAgICBwYXRoU3RyLFxyXG4gICAgcXVlcnlTdHIsXHJcbiAgICB0aGlzLmNhbm9uaWNhbEhlYWRlcnMoKSArICdcXG4nLFxyXG4gICAgdGhpcy5zaWduZWRIZWFkZXJzKCksXHJcbiAgICBib2R5SGFzaCxcclxuICBdLmpvaW4oJ1xcbicpXHJcbn1cclxuXHJcblJlcXVlc3RTaWduZXIucHJvdG90eXBlLmNhbm9uaWNhbEhlYWRlcnMgPSBmdW5jdGlvbigpIHtcclxuICB2YXIgaGVhZGVycyA9IHRoaXMucmVxdWVzdC5oZWFkZXJzXHJcbiAgZnVuY3Rpb24gdHJpbUFsbChoZWFkZXIpIHtcclxuICAgIHJldHVybiBoZWFkZXIudG9TdHJpbmcoKS50cmltKCkucmVwbGFjZSgvXFxzKy9nLCAnICcpXHJcbiAgfVxyXG4gIHJldHVybiBPYmplY3Qua2V5cyhoZWFkZXJzKVxyXG4gICAgLnNvcnQoZnVuY3Rpb24oYSwgYikgeyByZXR1cm4gYS50b0xvd2VyQ2FzZSgpIDwgYi50b0xvd2VyQ2FzZSgpID8gLTEgOiAxIH0pXHJcbiAgICAubWFwKGZ1bmN0aW9uKGtleSkgeyByZXR1cm4ga2V5LnRvTG93ZXJDYXNlKCkgKyAnOicgKyB0cmltQWxsKGhlYWRlcnNba2V5XSkgfSlcclxuICAgIC5qb2luKCdcXG4nKVxyXG59XHJcblxyXG5SZXF1ZXN0U2lnbmVyLnByb3RvdHlwZS5zaWduZWRIZWFkZXJzID0gZnVuY3Rpb24oKSB7XHJcbiAgcmV0dXJuIE9iamVjdC5rZXlzKHRoaXMucmVxdWVzdC5oZWFkZXJzKVxyXG4gICAgLm1hcChmdW5jdGlvbihrZXkpIHsgcmV0dXJuIGtleS50b0xvd2VyQ2FzZSgpIH0pXHJcbiAgICAuc29ydCgpXHJcbiAgICAuam9pbignOycpXHJcbn1cclxuXHJcblJlcXVlc3RTaWduZXIucHJvdG90eXBlLmNyZWRlbnRpYWxTdHJpbmcgPSBmdW5jdGlvbigpIHtcclxuICByZXR1cm4gW1xyXG4gICAgdGhpcy5nZXREYXRlKCksXHJcbiAgICB0aGlzLnJlZ2lvbixcclxuICAgIHRoaXMuc2VydmljZSxcclxuICAgICdhd3M0X3JlcXVlc3QnLFxyXG4gIF0uam9pbignLycpXHJcbn1cclxuXHJcblJlcXVlc3RTaWduZXIucHJvdG90eXBlLmRlZmF1bHRDcmVkZW50aWFscyA9IGZ1bmN0aW9uKCkge1xyXG4gIHZhciBlbnYgPSBwcm9jZXNzLmVudlxyXG4gIHJldHVybiB7XHJcbiAgICBhY2Nlc3NLZXlJZDogZW52LkFXU19BQ0NFU1NfS0VZX0lEIHx8IGVudi5BV1NfQUNDRVNTX0tFWSxcclxuICAgIHNlY3JldEFjY2Vzc0tleTogZW52LkFXU19TRUNSRVRfQUNDRVNTX0tFWSB8fCBlbnYuQVdTX1NFQ1JFVF9LRVksXHJcbiAgICBzZXNzaW9uVG9rZW46IGVudi5BV1NfU0VTU0lPTl9UT0tFTixcclxuICB9XHJcbn1cclxuXHJcblJlcXVlc3RTaWduZXIucHJvdG90eXBlLnBhcnNlUGF0aCA9IGZ1bmN0aW9uKCkge1xyXG4gIHZhciBwYXRoID0gdGhpcy5yZXF1ZXN0LnBhdGggfHwgJy8nLFxyXG4gICAgICBxdWVyeUl4ID0gcGF0aC5pbmRleE9mKCc/JyksXHJcbiAgICAgIHF1ZXJ5ID0gbnVsbFxyXG5cclxuICBpZiAocXVlcnlJeCA+PSAwKSB7XHJcbiAgICBxdWVyeSA9IHF1ZXJ5c3RyaW5nLnBhcnNlKHBhdGguc2xpY2UocXVlcnlJeCArIDEpKVxyXG4gICAgcGF0aCA9IHBhdGguc2xpY2UoMCwgcXVlcnlJeClcclxuICB9XHJcblxyXG4gIC8vIFMzIGRvZXNuJ3QgYWx3YXlzIGVuY29kZSBjaGFyYWN0ZXJzID4gMTI3IGNvcnJlY3RseSBhbmRcclxuICAvLyBhbGwgc2VydmljZXMgZG9uJ3QgZW5jb2RlIGNoYXJhY3RlcnMgPiAyNTUgY29ycmVjdGx5XHJcbiAgLy8gU28gaWYgdGhlcmUgYXJlIG5vbi1yZXNlcnZlZCBjaGFycyAoYW5kIGl0J3Mgbm90IGFscmVhZHkgYWxsICUgZW5jb2RlZCksIGp1c3QgZW5jb2RlIHRoZW0gYWxsXHJcbiAgaWYgKC9bXjAtOUEtWmEteiEnKCkqXFwtLl9+JS9dLy50ZXN0KHBhdGgpKSB7XHJcbiAgICBwYXRoID0gcGF0aC5zcGxpdCgnLycpLm1hcChmdW5jdGlvbihwaWVjZSkge1xyXG4gICAgICByZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KGRlY29kZVVSSUNvbXBvbmVudChwaWVjZSkpXHJcbiAgICB9KS5qb2luKCcvJylcclxuICB9XHJcblxyXG4gIHRoaXMucGFyc2VkUGF0aCA9IHtcclxuICAgIHBhdGg6IHBhdGgsXHJcbiAgICBxdWVyeTogcXVlcnksXHJcbiAgfVxyXG59XHJcblxyXG5SZXF1ZXN0U2lnbmVyLnByb3RvdHlwZS5mb3JtYXRQYXRoID0gZnVuY3Rpb24oKSB7XHJcbiAgdmFyIHBhdGggPSB0aGlzLnBhcnNlZFBhdGgucGF0aCxcclxuICAgICAgcXVlcnkgPSB0aGlzLnBhcnNlZFBhdGgucXVlcnlcclxuXHJcbiAgaWYgKCFxdWVyeSkgcmV0dXJuIHBhdGhcclxuXHJcbiAgLy8gU2VydmljZXMgZG9uJ3Qgc3VwcG9ydCBlbXB0eSBxdWVyeSBzdHJpbmcga2V5c1xyXG4gIGlmIChxdWVyeVsnJ10gIT0gbnVsbCkgZGVsZXRlIHF1ZXJ5WycnXVxyXG5cclxuICByZXR1cm4gcGF0aCArICc/JyArIGVuY29kZVJmYzM5ODYocXVlcnlzdHJpbmcuc3RyaW5naWZ5KHF1ZXJ5KSlcclxufVxyXG5cclxuYXdzNC5SZXF1ZXN0U2lnbmVyID0gUmVxdWVzdFNpZ25lclxyXG5cclxuYXdzNC5zaWduID0gZnVuY3Rpb24ocmVxdWVzdCwgY3JlZGVudGlhbHMpIHtcclxuICByZXR1cm4gbmV3IFJlcXVlc3RTaWduZXIocmVxdWVzdCwgY3JlZGVudGlhbHMpLnNpZ24oKVxyXG59XHJcbiJdLCJzb3VyY2VSb290IjoiIn0=