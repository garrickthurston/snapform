(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["vendor/vendor.browserify-zlib"],{

/***/ "Rwuk":
/*!***************************************************!*\
  !*** ./node_modules/browserify-zlib/lib/index.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

var Buffer = __webpack_require__(/*! buffer */ "tjlA").Buffer;
var Transform = __webpack_require__(/*! stream */ "1IWx").Transform;
var binding = __webpack_require__(/*! ./binding */ "a3Xj");
var util = __webpack_require__(/*! util */ "7tlc");
var assert = __webpack_require__(/*! assert */ "9lTW").ok;
var kMaxLength = __webpack_require__(/*! buffer */ "tjlA").kMaxLength;
var kRangeErrorMessage = 'Cannot create final Buffer. It would be larger ' + 'than 0x' + kMaxLength.toString(16) + ' bytes';

// zlib doesn't provide these, so kludge them in following the same
// const naming scheme zlib uses.
binding.Z_MIN_WINDOWBITS = 8;
binding.Z_MAX_WINDOWBITS = 15;
binding.Z_DEFAULT_WINDOWBITS = 15;

// fewer than 64 bytes per chunk is stupid.
// technically it could work with as few as 8, but even 64 bytes
// is absurdly low.  Usually a MB or more is best.
binding.Z_MIN_CHUNK = 64;
binding.Z_MAX_CHUNK = Infinity;
binding.Z_DEFAULT_CHUNK = 16 * 1024;

binding.Z_MIN_MEMLEVEL = 1;
binding.Z_MAX_MEMLEVEL = 9;
binding.Z_DEFAULT_MEMLEVEL = 8;

binding.Z_MIN_LEVEL = -1;
binding.Z_MAX_LEVEL = 9;
binding.Z_DEFAULT_LEVEL = binding.Z_DEFAULT_COMPRESSION;

// expose all the zlib constants
var bkeys = Object.keys(binding);
for (var bk = 0; bk < bkeys.length; bk++) {
  var bkey = bkeys[bk];
  if (bkey.match(/^Z/)) {
    Object.defineProperty(exports, bkey, {
      enumerable: true, value: binding[bkey], writable: false
    });
  }
}

// translation table for return codes.
var codes = {
  Z_OK: binding.Z_OK,
  Z_STREAM_END: binding.Z_STREAM_END,
  Z_NEED_DICT: binding.Z_NEED_DICT,
  Z_ERRNO: binding.Z_ERRNO,
  Z_STREAM_ERROR: binding.Z_STREAM_ERROR,
  Z_DATA_ERROR: binding.Z_DATA_ERROR,
  Z_MEM_ERROR: binding.Z_MEM_ERROR,
  Z_BUF_ERROR: binding.Z_BUF_ERROR,
  Z_VERSION_ERROR: binding.Z_VERSION_ERROR
};

var ckeys = Object.keys(codes);
for (var ck = 0; ck < ckeys.length; ck++) {
  var ckey = ckeys[ck];
  codes[codes[ckey]] = ckey;
}

Object.defineProperty(exports, 'codes', {
  enumerable: true, value: Object.freeze(codes), writable: false
});

exports.Deflate = Deflate;
exports.Inflate = Inflate;
exports.Gzip = Gzip;
exports.Gunzip = Gunzip;
exports.DeflateRaw = DeflateRaw;
exports.InflateRaw = InflateRaw;
exports.Unzip = Unzip;

exports.createDeflate = function (o) {
  return new Deflate(o);
};

exports.createInflate = function (o) {
  return new Inflate(o);
};

exports.createDeflateRaw = function (o) {
  return new DeflateRaw(o);
};

exports.createInflateRaw = function (o) {
  return new InflateRaw(o);
};

exports.createGzip = function (o) {
  return new Gzip(o);
};

exports.createGunzip = function (o) {
  return new Gunzip(o);
};

exports.createUnzip = function (o) {
  return new Unzip(o);
};

// Convenience methods.
// compress/decompress a string or buffer in one step.
exports.deflate = function (buffer, opts, callback) {
  if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  }
  return zlibBuffer(new Deflate(opts), buffer, callback);
};

exports.deflateSync = function (buffer, opts) {
  return zlibBufferSync(new Deflate(opts), buffer);
};

exports.gzip = function (buffer, opts, callback) {
  if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  }
  return zlibBuffer(new Gzip(opts), buffer, callback);
};

exports.gzipSync = function (buffer, opts) {
  return zlibBufferSync(new Gzip(opts), buffer);
};

exports.deflateRaw = function (buffer, opts, callback) {
  if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  }
  return zlibBuffer(new DeflateRaw(opts), buffer, callback);
};

exports.deflateRawSync = function (buffer, opts) {
  return zlibBufferSync(new DeflateRaw(opts), buffer);
};

exports.unzip = function (buffer, opts, callback) {
  if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  }
  return zlibBuffer(new Unzip(opts), buffer, callback);
};

exports.unzipSync = function (buffer, opts) {
  return zlibBufferSync(new Unzip(opts), buffer);
};

exports.inflate = function (buffer, opts, callback) {
  if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  }
  return zlibBuffer(new Inflate(opts), buffer, callback);
};

exports.inflateSync = function (buffer, opts) {
  return zlibBufferSync(new Inflate(opts), buffer);
};

exports.gunzip = function (buffer, opts, callback) {
  if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  }
  return zlibBuffer(new Gunzip(opts), buffer, callback);
};

exports.gunzipSync = function (buffer, opts) {
  return zlibBufferSync(new Gunzip(opts), buffer);
};

exports.inflateRaw = function (buffer, opts, callback) {
  if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  }
  return zlibBuffer(new InflateRaw(opts), buffer, callback);
};

exports.inflateRawSync = function (buffer, opts) {
  return zlibBufferSync(new InflateRaw(opts), buffer);
};

function zlibBuffer(engine, buffer, callback) {
  var buffers = [];
  var nread = 0;

  engine.on('error', onError);
  engine.on('end', onEnd);

  engine.end(buffer);
  flow();

  function flow() {
    var chunk;
    while (null !== (chunk = engine.read())) {
      buffers.push(chunk);
      nread += chunk.length;
    }
    engine.once('readable', flow);
  }

  function onError(err) {
    engine.removeListener('end', onEnd);
    engine.removeListener('readable', flow);
    callback(err);
  }

  function onEnd() {
    var buf;
    var err = null;

    if (nread >= kMaxLength) {
      err = new RangeError(kRangeErrorMessage);
    } else {
      buf = Buffer.concat(buffers, nread);
    }

    buffers = [];
    engine.close();
    callback(err, buf);
  }
}

function zlibBufferSync(engine, buffer) {
  if (typeof buffer === 'string') buffer = Buffer.from(buffer);

  if (!Buffer.isBuffer(buffer)) throw new TypeError('Not a string or buffer');

  var flushFlag = engine._finishFlushFlag;

  return engine._processChunk(buffer, flushFlag);
}

// generic zlib
// minimal 2-byte header
function Deflate(opts) {
  if (!(this instanceof Deflate)) return new Deflate(opts);
  Zlib.call(this, opts, binding.DEFLATE);
}

function Inflate(opts) {
  if (!(this instanceof Inflate)) return new Inflate(opts);
  Zlib.call(this, opts, binding.INFLATE);
}

// gzip - bigger header, same deflate compression
function Gzip(opts) {
  if (!(this instanceof Gzip)) return new Gzip(opts);
  Zlib.call(this, opts, binding.GZIP);
}

function Gunzip(opts) {
  if (!(this instanceof Gunzip)) return new Gunzip(opts);
  Zlib.call(this, opts, binding.GUNZIP);
}

// raw - no header
function DeflateRaw(opts) {
  if (!(this instanceof DeflateRaw)) return new DeflateRaw(opts);
  Zlib.call(this, opts, binding.DEFLATERAW);
}

function InflateRaw(opts) {
  if (!(this instanceof InflateRaw)) return new InflateRaw(opts);
  Zlib.call(this, opts, binding.INFLATERAW);
}

// auto-detect header.
function Unzip(opts) {
  if (!(this instanceof Unzip)) return new Unzip(opts);
  Zlib.call(this, opts, binding.UNZIP);
}

function isValidFlushFlag(flag) {
  return flag === binding.Z_NO_FLUSH || flag === binding.Z_PARTIAL_FLUSH || flag === binding.Z_SYNC_FLUSH || flag === binding.Z_FULL_FLUSH || flag === binding.Z_FINISH || flag === binding.Z_BLOCK;
}

// the Zlib class they all inherit from
// This thing manages the queue of requests, and returns
// true or false if there is anything in the queue when
// you call the .write() method.

function Zlib(opts, mode) {
  var _this = this;

  this._opts = opts = opts || {};
  this._chunkSize = opts.chunkSize || exports.Z_DEFAULT_CHUNK;

  Transform.call(this, opts);

  if (opts.flush && !isValidFlushFlag(opts.flush)) {
    throw new Error('Invalid flush flag: ' + opts.flush);
  }
  if (opts.finishFlush && !isValidFlushFlag(opts.finishFlush)) {
    throw new Error('Invalid flush flag: ' + opts.finishFlush);
  }

  this._flushFlag = opts.flush || binding.Z_NO_FLUSH;
  this._finishFlushFlag = typeof opts.finishFlush !== 'undefined' ? opts.finishFlush : binding.Z_FINISH;

  if (opts.chunkSize) {
    if (opts.chunkSize < exports.Z_MIN_CHUNK || opts.chunkSize > exports.Z_MAX_CHUNK) {
      throw new Error('Invalid chunk size: ' + opts.chunkSize);
    }
  }

  if (opts.windowBits) {
    if (opts.windowBits < exports.Z_MIN_WINDOWBITS || opts.windowBits > exports.Z_MAX_WINDOWBITS) {
      throw new Error('Invalid windowBits: ' + opts.windowBits);
    }
  }

  if (opts.level) {
    if (opts.level < exports.Z_MIN_LEVEL || opts.level > exports.Z_MAX_LEVEL) {
      throw new Error('Invalid compression level: ' + opts.level);
    }
  }

  if (opts.memLevel) {
    if (opts.memLevel < exports.Z_MIN_MEMLEVEL || opts.memLevel > exports.Z_MAX_MEMLEVEL) {
      throw new Error('Invalid memLevel: ' + opts.memLevel);
    }
  }

  if (opts.strategy) {
    if (opts.strategy != exports.Z_FILTERED && opts.strategy != exports.Z_HUFFMAN_ONLY && opts.strategy != exports.Z_RLE && opts.strategy != exports.Z_FIXED && opts.strategy != exports.Z_DEFAULT_STRATEGY) {
      throw new Error('Invalid strategy: ' + opts.strategy);
    }
  }

  if (opts.dictionary) {
    if (!Buffer.isBuffer(opts.dictionary)) {
      throw new Error('Invalid dictionary: it should be a Buffer instance');
    }
  }

  this._handle = new binding.Zlib(mode);

  var self = this;
  this._hadError = false;
  this._handle.onerror = function (message, errno) {
    // there is no way to cleanly recover.
    // continuing only obscures problems.
    _close(self);
    self._hadError = true;

    var error = new Error(message);
    error.errno = errno;
    error.code = exports.codes[errno];
    self.emit('error', error);
  };

  var level = exports.Z_DEFAULT_COMPRESSION;
  if (typeof opts.level === 'number') level = opts.level;

  var strategy = exports.Z_DEFAULT_STRATEGY;
  if (typeof opts.strategy === 'number') strategy = opts.strategy;

  this._handle.init(opts.windowBits || exports.Z_DEFAULT_WINDOWBITS, level, opts.memLevel || exports.Z_DEFAULT_MEMLEVEL, strategy, opts.dictionary);

  this._buffer = Buffer.allocUnsafe(this._chunkSize);
  this._offset = 0;
  this._level = level;
  this._strategy = strategy;

  this.once('end', this.close);

  Object.defineProperty(this, '_closed', {
    get: function () {
      return !_this._handle;
    },
    configurable: true,
    enumerable: true
  });
}

util.inherits(Zlib, Transform);

Zlib.prototype.params = function (level, strategy, callback) {
  if (level < exports.Z_MIN_LEVEL || level > exports.Z_MAX_LEVEL) {
    throw new RangeError('Invalid compression level: ' + level);
  }
  if (strategy != exports.Z_FILTERED && strategy != exports.Z_HUFFMAN_ONLY && strategy != exports.Z_RLE && strategy != exports.Z_FIXED && strategy != exports.Z_DEFAULT_STRATEGY) {
    throw new TypeError('Invalid strategy: ' + strategy);
  }

  if (this._level !== level || this._strategy !== strategy) {
    var self = this;
    this.flush(binding.Z_SYNC_FLUSH, function () {
      assert(self._handle, 'zlib binding closed');
      self._handle.params(level, strategy);
      if (!self._hadError) {
        self._level = level;
        self._strategy = strategy;
        if (callback) callback();
      }
    });
  } else {
    process.nextTick(callback);
  }
};

Zlib.prototype.reset = function () {
  assert(this._handle, 'zlib binding closed');
  return this._handle.reset();
};

// This is the _flush function called by the transform class,
// internally, when the last chunk has been written.
Zlib.prototype._flush = function (callback) {
  this._transform(Buffer.alloc(0), '', callback);
};

Zlib.prototype.flush = function (kind, callback) {
  var _this2 = this;

  var ws = this._writableState;

  if (typeof kind === 'function' || kind === undefined && !callback) {
    callback = kind;
    kind = binding.Z_FULL_FLUSH;
  }

  if (ws.ended) {
    if (callback) process.nextTick(callback);
  } else if (ws.ending) {
    if (callback) this.once('end', callback);
  } else if (ws.needDrain) {
    if (callback) {
      this.once('drain', function () {
        return _this2.flush(kind, callback);
      });
    }
  } else {
    this._flushFlag = kind;
    this.write(Buffer.alloc(0), '', callback);
  }
};

Zlib.prototype.close = function (callback) {
  _close(this, callback);
  process.nextTick(emitCloseNT, this);
};

function _close(engine, callback) {
  if (callback) process.nextTick(callback);

  // Caller may invoke .close after a zlib error (which will null _handle).
  if (!engine._handle) return;

  engine._handle.close();
  engine._handle = null;
}

function emitCloseNT(self) {
  self.emit('close');
}

Zlib.prototype._transform = function (chunk, encoding, cb) {
  var flushFlag;
  var ws = this._writableState;
  var ending = ws.ending || ws.ended;
  var last = ending && (!chunk || ws.length === chunk.length);

  if (chunk !== null && !Buffer.isBuffer(chunk)) return cb(new Error('invalid input'));

  if (!this._handle) return cb(new Error('zlib binding closed'));

  // If it's the last chunk, or a final flush, we use the Z_FINISH flush flag
  // (or whatever flag was provided using opts.finishFlush).
  // If it's explicitly flushing at some other time, then we use
  // Z_FULL_FLUSH. Otherwise, use Z_NO_FLUSH for maximum compression
  // goodness.
  if (last) flushFlag = this._finishFlushFlag;else {
    flushFlag = this._flushFlag;
    // once we've flushed the last of the queue, stop flushing and
    // go back to the normal behavior.
    if (chunk.length >= ws.length) {
      this._flushFlag = this._opts.flush || binding.Z_NO_FLUSH;
    }
  }

  this._processChunk(chunk, flushFlag, cb);
};

Zlib.prototype._processChunk = function (chunk, flushFlag, cb) {
  var availInBefore = chunk && chunk.length;
  var availOutBefore = this._chunkSize - this._offset;
  var inOff = 0;

  var self = this;

  var async = typeof cb === 'function';

  if (!async) {
    var buffers = [];
    var nread = 0;

    var error;
    this.on('error', function (er) {
      error = er;
    });

    assert(this._handle, 'zlib binding closed');
    do {
      var res = this._handle.writeSync(flushFlag, chunk, // in
      inOff, // in_off
      availInBefore, // in_len
      this._buffer, // out
      this._offset, //out_off
      availOutBefore); // out_len
    } while (!this._hadError && callback(res[0], res[1]));

    if (this._hadError) {
      throw error;
    }

    if (nread >= kMaxLength) {
      _close(this);
      throw new RangeError(kRangeErrorMessage);
    }

    var buf = Buffer.concat(buffers, nread);
    _close(this);

    return buf;
  }

  assert(this._handle, 'zlib binding closed');
  var req = this._handle.write(flushFlag, chunk, // in
  inOff, // in_off
  availInBefore, // in_len
  this._buffer, // out
  this._offset, //out_off
  availOutBefore); // out_len

  req.buffer = chunk;
  req.callback = callback;

  function callback(availInAfter, availOutAfter) {
    // When the callback is used in an async write, the callback's
    // context is the `req` object that was created. The req object
    // is === this._handle, and that's why it's important to null
    // out the values after they are done being used. `this._handle`
    // can stay in memory longer than the callback and buffer are needed.
    if (this) {
      this.buffer = null;
      this.callback = null;
    }

    if (self._hadError) return;

    var have = availOutBefore - availOutAfter;
    assert(have >= 0, 'have should not go down');

    if (have > 0) {
      var out = self._buffer.slice(self._offset, self._offset + have);
      self._offset += have;
      // serve some output to the consumer.
      if (async) {
        self.push(out);
      } else {
        buffers.push(out);
        nread += out.length;
      }
    }

    // exhausted the output buffer, or used all the input create a new one.
    if (availOutAfter === 0 || self._offset >= self._chunkSize) {
      availOutBefore = self._chunkSize;
      self._offset = 0;
      self._buffer = Buffer.allocUnsafe(self._chunkSize);
    }

    if (availOutAfter === 0) {
      // Not actually done.  Need to reprocess.
      // Also, update the availInBefore to the availInAfter value,
      // so that if we have to hit it a third (fourth, etc.) time,
      // it'll have the correct byte counts.
      inOff += availInBefore - availInAfter;
      availInBefore = availInAfter;

      if (!async) return true;

      var newReq = self._handle.write(flushFlag, chunk, inOff, availInBefore, self._buffer, self._offset, self._chunkSize);
      newReq.callback = callback; // this same function
      newReq.buffer = chunk;
      return;
    }

    if (!async) return false;

    // finished with the chunk.
    cb();
  }
};

util.inherits(Deflate, Zlib);
util.inherits(Inflate, Zlib);
util.inherits(Gzip, Zlib);
util.inherits(Gunzip, Zlib);
util.inherits(DeflateRaw, Zlib);
util.inherits(InflateRaw, Zlib);
util.inherits(Unzip, Zlib);
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../process/browser.js */ "8oxB")))

/***/ }),

/***/ "a3Xj":
/*!*****************************************************!*\
  !*** ./node_modules/browserify-zlib/lib/binding.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Buffer, process) {
/* eslint camelcase: "off" */

var assert = __webpack_require__(/*! assert */ "9lTW");

var Zstream = __webpack_require__(/*! pako/lib/zlib/zstream */ "iTZm");
var zlib_deflate = __webpack_require__(/*! pako/lib/zlib/deflate.js */ "oXfm");
var zlib_inflate = __webpack_require__(/*! pako/lib/zlib/inflate.js */ "nm4c");
var constants = __webpack_require__(/*! pako/lib/zlib/constants */ "LOvY");

for (var key in constants) {
  exports[key] = constants[key];
}

// zlib modes
exports.NONE = 0;
exports.DEFLATE = 1;
exports.INFLATE = 2;
exports.GZIP = 3;
exports.GUNZIP = 4;
exports.DEFLATERAW = 5;
exports.INFLATERAW = 6;
exports.UNZIP = 7;

var GZIP_HEADER_ID1 = 0x1f;
var GZIP_HEADER_ID2 = 0x8b;

/**
 * Emulate Node's zlib C++ layer for use by the JS layer in index.js
 */
function Zlib(mode) {
  if (typeof mode !== 'number' || mode < exports.DEFLATE || mode > exports.UNZIP) {
    throw new TypeError('Bad argument');
  }

  this.dictionary = null;
  this.err = 0;
  this.flush = 0;
  this.init_done = false;
  this.level = 0;
  this.memLevel = 0;
  this.mode = mode;
  this.strategy = 0;
  this.windowBits = 0;
  this.write_in_progress = false;
  this.pending_close = false;
  this.gzip_id_bytes_read = 0;
}

Zlib.prototype.close = function () {
  if (this.write_in_progress) {
    this.pending_close = true;
    return;
  }

  this.pending_close = false;

  assert(this.init_done, 'close before init');
  assert(this.mode <= exports.UNZIP);

  if (this.mode === exports.DEFLATE || this.mode === exports.GZIP || this.mode === exports.DEFLATERAW) {
    zlib_deflate.deflateEnd(this.strm);
  } else if (this.mode === exports.INFLATE || this.mode === exports.GUNZIP || this.mode === exports.INFLATERAW || this.mode === exports.UNZIP) {
    zlib_inflate.inflateEnd(this.strm);
  }

  this.mode = exports.NONE;

  this.dictionary = null;
};

Zlib.prototype.write = function (flush, input, in_off, in_len, out, out_off, out_len) {
  return this._write(true, flush, input, in_off, in_len, out, out_off, out_len);
};

Zlib.prototype.writeSync = function (flush, input, in_off, in_len, out, out_off, out_len) {
  return this._write(false, flush, input, in_off, in_len, out, out_off, out_len);
};

Zlib.prototype._write = function (async, flush, input, in_off, in_len, out, out_off, out_len) {
  assert.equal(arguments.length, 8);

  assert(this.init_done, 'write before init');
  assert(this.mode !== exports.NONE, 'already finalized');
  assert.equal(false, this.write_in_progress, 'write already in progress');
  assert.equal(false, this.pending_close, 'close is pending');

  this.write_in_progress = true;

  assert.equal(false, flush === undefined, 'must provide flush value');

  this.write_in_progress = true;

  if (flush !== exports.Z_NO_FLUSH && flush !== exports.Z_PARTIAL_FLUSH && flush !== exports.Z_SYNC_FLUSH && flush !== exports.Z_FULL_FLUSH && flush !== exports.Z_FINISH && flush !== exports.Z_BLOCK) {
    throw new Error('Invalid flush value');
  }

  if (input == null) {
    input = Buffer.alloc(0);
    in_len = 0;
    in_off = 0;
  }

  this.strm.avail_in = in_len;
  this.strm.input = input;
  this.strm.next_in = in_off;
  this.strm.avail_out = out_len;
  this.strm.output = out;
  this.strm.next_out = out_off;
  this.flush = flush;

  if (!async) {
    // sync version
    this._process();

    if (this._checkError()) {
      return this._afterSync();
    }
    return;
  }

  // async version
  var self = this;
  process.nextTick(function () {
    self._process();
    self._after();
  });

  return this;
};

Zlib.prototype._afterSync = function () {
  var avail_out = this.strm.avail_out;
  var avail_in = this.strm.avail_in;

  this.write_in_progress = false;

  return [avail_in, avail_out];
};

Zlib.prototype._process = function () {
  var next_expected_header_byte = null;

  // If the avail_out is left at 0, then it means that it ran out
  // of room.  If there was avail_out left over, then it means
  // that all of the input was consumed.
  switch (this.mode) {
    case exports.DEFLATE:
    case exports.GZIP:
    case exports.DEFLATERAW:
      this.err = zlib_deflate.deflate(this.strm, this.flush);
      break;
    case exports.UNZIP:
      if (this.strm.avail_in > 0) {
        next_expected_header_byte = this.strm.next_in;
      }

      switch (this.gzip_id_bytes_read) {
        case 0:
          if (next_expected_header_byte === null) {
            break;
          }

          if (this.strm.input[next_expected_header_byte] === GZIP_HEADER_ID1) {
            this.gzip_id_bytes_read = 1;
            next_expected_header_byte++;

            if (this.strm.avail_in === 1) {
              // The only available byte was already read.
              break;
            }
          } else {
            this.mode = exports.INFLATE;
            break;
          }

        // fallthrough
        case 1:
          if (next_expected_header_byte === null) {
            break;
          }

          if (this.strm.input[next_expected_header_byte] === GZIP_HEADER_ID2) {
            this.gzip_id_bytes_read = 2;
            this.mode = exports.GUNZIP;
          } else {
            // There is no actual difference between INFLATE and INFLATERAW
            // (after initialization).
            this.mode = exports.INFLATE;
          }

          break;
        default:
          throw new Error('invalid number of gzip magic number bytes read');
      }

    // fallthrough
    case exports.INFLATE:
    case exports.GUNZIP:
    case exports.INFLATERAW:
      this.err = zlib_inflate.inflate(this.strm, this.flush

      // If data was encoded with dictionary
      );if (this.err === exports.Z_NEED_DICT && this.dictionary) {
        // Load it
        this.err = zlib_inflate.inflateSetDictionary(this.strm, this.dictionary);
        if (this.err === exports.Z_OK) {
          // And try to decode again
          this.err = zlib_inflate.inflate(this.strm, this.flush);
        } else if (this.err === exports.Z_DATA_ERROR) {
          // Both inflateSetDictionary() and inflate() return Z_DATA_ERROR.
          // Make it possible for After() to tell a bad dictionary from bad
          // input.
          this.err = exports.Z_NEED_DICT;
        }
      }
      while (this.strm.avail_in > 0 && this.mode === exports.GUNZIP && this.err === exports.Z_STREAM_END && this.strm.next_in[0] !== 0x00) {
        // Bytes remain in input buffer. Perhaps this is another compressed
        // member in the same archive, or just trailing garbage.
        // Trailing zero bytes are okay, though, since they are frequently
        // used for padding.

        this.reset();
        this.err = zlib_inflate.inflate(this.strm, this.flush);
      }
      break;
    default:
      throw new Error('Unknown mode ' + this.mode);
  }
};

Zlib.prototype._checkError = function () {
  // Acceptable error states depend on the type of zlib stream.
  switch (this.err) {
    case exports.Z_OK:
    case exports.Z_BUF_ERROR:
      if (this.strm.avail_out !== 0 && this.flush === exports.Z_FINISH) {
        this._error('unexpected end of file');
        return false;
      }
      break;
    case exports.Z_STREAM_END:
      // normal statuses, not fatal
      break;
    case exports.Z_NEED_DICT:
      if (this.dictionary == null) {
        this._error('Missing dictionary');
      } else {
        this._error('Bad dictionary');
      }
      return false;
    default:
      // something else.
      this._error('Zlib error');
      return false;
  }

  return true;
};

Zlib.prototype._after = function () {
  if (!this._checkError()) {
    return;
  }

  var avail_out = this.strm.avail_out;
  var avail_in = this.strm.avail_in;

  this.write_in_progress = false;

  // call the write() cb
  this.callback(avail_in, avail_out);

  if (this.pending_close) {
    this.close();
  }
};

Zlib.prototype._error = function (message) {
  if (this.strm.msg) {
    message = this.strm.msg;
  }
  this.onerror(message, this.err

  // no hope of rescue.
  );this.write_in_progress = false;
  if (this.pending_close) {
    this.close();
  }
};

Zlib.prototype.init = function (windowBits, level, memLevel, strategy, dictionary) {
  assert(arguments.length === 4 || arguments.length === 5, 'init(windowBits, level, memLevel, strategy, [dictionary])');

  assert(windowBits >= 8 && windowBits <= 15, 'invalid windowBits');
  assert(level >= -1 && level <= 9, 'invalid compression level');

  assert(memLevel >= 1 && memLevel <= 9, 'invalid memlevel');

  assert(strategy === exports.Z_FILTERED || strategy === exports.Z_HUFFMAN_ONLY || strategy === exports.Z_RLE || strategy === exports.Z_FIXED || strategy === exports.Z_DEFAULT_STRATEGY, 'invalid strategy');

  this._init(level, windowBits, memLevel, strategy, dictionary);
  this._setDictionary();
};

Zlib.prototype.params = function () {
  throw new Error('deflateParams Not supported');
};

Zlib.prototype.reset = function () {
  this._reset();
  this._setDictionary();
};

Zlib.prototype._init = function (level, windowBits, memLevel, strategy, dictionary) {
  this.level = level;
  this.windowBits = windowBits;
  this.memLevel = memLevel;
  this.strategy = strategy;

  this.flush = exports.Z_NO_FLUSH;

  this.err = exports.Z_OK;

  if (this.mode === exports.GZIP || this.mode === exports.GUNZIP) {
    this.windowBits += 16;
  }

  if (this.mode === exports.UNZIP) {
    this.windowBits += 32;
  }

  if (this.mode === exports.DEFLATERAW || this.mode === exports.INFLATERAW) {
    this.windowBits = -1 * this.windowBits;
  }

  this.strm = new Zstream();

  switch (this.mode) {
    case exports.DEFLATE:
    case exports.GZIP:
    case exports.DEFLATERAW:
      this.err = zlib_deflate.deflateInit2(this.strm, this.level, exports.Z_DEFLATED, this.windowBits, this.memLevel, this.strategy);
      break;
    case exports.INFLATE:
    case exports.GUNZIP:
    case exports.INFLATERAW:
    case exports.UNZIP:
      this.err = zlib_inflate.inflateInit2(this.strm, this.windowBits);
      break;
    default:
      throw new Error('Unknown mode ' + this.mode);
  }

  if (this.err !== exports.Z_OK) {
    this._error('Init error');
  }

  this.dictionary = dictionary;

  this.write_in_progress = false;
  this.init_done = true;
};

Zlib.prototype._setDictionary = function () {
  if (this.dictionary == null) {
    return;
  }

  this.err = exports.Z_OK;

  switch (this.mode) {
    case exports.DEFLATE:
    case exports.DEFLATERAW:
      this.err = zlib_deflate.deflateSetDictionary(this.strm, this.dictionary);
      break;
    default:
      break;
  }

  if (this.err !== exports.Z_OK) {
    this._error('Failed to set dictionary');
  }
};

Zlib.prototype._reset = function () {
  this.err = exports.Z_OK;

  switch (this.mode) {
    case exports.DEFLATE:
    case exports.DEFLATERAW:
    case exports.GZIP:
      this.err = zlib_deflate.deflateReset(this.strm);
      break;
    case exports.INFLATE:
    case exports.INFLATERAW:
    case exports.GUNZIP:
      this.err = zlib_inflate.inflateReset(this.strm);
      break;
    default:
      break;
  }

  if (this.err !== exports.Z_OK) {
    this._error('Failed to reset stream');
  }
};

exports.Zlib = Zlib;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../buffer/index.js */ "tjlA").Buffer, __webpack_require__(/*! ./../../process/browser.js */ "8oxB")))

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS16bGliL2xpYi9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS16bGliL2xpYi9iaW5kaW5nLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSwrQ0FBYTs7QUFFYixhQUFhLG1CQUFPLENBQUMsb0JBQVE7QUFDN0IsZ0JBQWdCLG1CQUFPLENBQUMsb0JBQVE7QUFDaEMsY0FBYyxtQkFBTyxDQUFDLHVCQUFXO0FBQ2pDLFdBQVcsbUJBQU8sQ0FBQyxrQkFBTTtBQUN6QixhQUFhLG1CQUFPLENBQUMsb0JBQVE7QUFDN0IsaUJBQWlCLG1CQUFPLENBQUMsb0JBQVE7QUFDakM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZ0JBQWdCLG1CQUFtQjtBQUNuQztBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGdCQUFnQixtQkFBbUI7QUFDbkM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOENBQThDO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBc0I7QUFDdEIsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQjs7QUFFbEI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSxpQ0FBaUM7QUFDakM7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJCOzs7Ozs7Ozs7Ozs7O0FDaG1CQSx1REFBYTtBQUNiOztBQUVBLGFBQWEsbUJBQU8sQ0FBQyxvQkFBUTs7QUFFN0IsY0FBYyxtQkFBTyxDQUFDLG1DQUF1QjtBQUM3QyxtQkFBbUIsbUJBQU8sQ0FBQyxzQ0FBMEI7QUFDckQsbUJBQW1CLG1CQUFPLENBQUMsc0NBQTBCO0FBQ3JELGdCQUFnQixtQkFBTyxDQUFDLHFDQUF5Qjs7QUFFakQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLG9CIiwiZmlsZSI6ImJ1aWxkL3ZlbmRvci92ZW5kb3IuYnJvd3NlcmlmeS16bGliLjk1YWNiMWMzZDM5ZDExZWU1NmYzLmNodW5rLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIEJ1ZmZlciA9IHJlcXVpcmUoJ2J1ZmZlcicpLkJ1ZmZlcjtcclxudmFyIFRyYW5zZm9ybSA9IHJlcXVpcmUoJ3N0cmVhbScpLlRyYW5zZm9ybTtcclxudmFyIGJpbmRpbmcgPSByZXF1aXJlKCcuL2JpbmRpbmcnKTtcclxudmFyIHV0aWwgPSByZXF1aXJlKCd1dGlsJyk7XHJcbnZhciBhc3NlcnQgPSByZXF1aXJlKCdhc3NlcnQnKS5vaztcclxudmFyIGtNYXhMZW5ndGggPSByZXF1aXJlKCdidWZmZXInKS5rTWF4TGVuZ3RoO1xyXG52YXIga1JhbmdlRXJyb3JNZXNzYWdlID0gJ0Nhbm5vdCBjcmVhdGUgZmluYWwgQnVmZmVyLiBJdCB3b3VsZCBiZSBsYXJnZXIgJyArICd0aGFuIDB4JyArIGtNYXhMZW5ndGgudG9TdHJpbmcoMTYpICsgJyBieXRlcyc7XHJcblxyXG4vLyB6bGliIGRvZXNuJ3QgcHJvdmlkZSB0aGVzZSwgc28ga2x1ZGdlIHRoZW0gaW4gZm9sbG93aW5nIHRoZSBzYW1lXHJcbi8vIGNvbnN0IG5hbWluZyBzY2hlbWUgemxpYiB1c2VzLlxyXG5iaW5kaW5nLlpfTUlOX1dJTkRPV0JJVFMgPSA4O1xyXG5iaW5kaW5nLlpfTUFYX1dJTkRPV0JJVFMgPSAxNTtcclxuYmluZGluZy5aX0RFRkFVTFRfV0lORE9XQklUUyA9IDE1O1xyXG5cclxuLy8gZmV3ZXIgdGhhbiA2NCBieXRlcyBwZXIgY2h1bmsgaXMgc3R1cGlkLlxyXG4vLyB0ZWNobmljYWxseSBpdCBjb3VsZCB3b3JrIHdpdGggYXMgZmV3IGFzIDgsIGJ1dCBldmVuIDY0IGJ5dGVzXHJcbi8vIGlzIGFic3VyZGx5IGxvdy4gIFVzdWFsbHkgYSBNQiBvciBtb3JlIGlzIGJlc3QuXHJcbmJpbmRpbmcuWl9NSU5fQ0hVTksgPSA2NDtcclxuYmluZGluZy5aX01BWF9DSFVOSyA9IEluZmluaXR5O1xyXG5iaW5kaW5nLlpfREVGQVVMVF9DSFVOSyA9IDE2ICogMTAyNDtcclxuXHJcbmJpbmRpbmcuWl9NSU5fTUVNTEVWRUwgPSAxO1xyXG5iaW5kaW5nLlpfTUFYX01FTUxFVkVMID0gOTtcclxuYmluZGluZy5aX0RFRkFVTFRfTUVNTEVWRUwgPSA4O1xyXG5cclxuYmluZGluZy5aX01JTl9MRVZFTCA9IC0xO1xyXG5iaW5kaW5nLlpfTUFYX0xFVkVMID0gOTtcclxuYmluZGluZy5aX0RFRkFVTFRfTEVWRUwgPSBiaW5kaW5nLlpfREVGQVVMVF9DT01QUkVTU0lPTjtcclxuXHJcbi8vIGV4cG9zZSBhbGwgdGhlIHpsaWIgY29uc3RhbnRzXHJcbnZhciBia2V5cyA9IE9iamVjdC5rZXlzKGJpbmRpbmcpO1xyXG5mb3IgKHZhciBiayA9IDA7IGJrIDwgYmtleXMubGVuZ3RoOyBiaysrKSB7XHJcbiAgdmFyIGJrZXkgPSBia2V5c1tia107XHJcbiAgaWYgKGJrZXkubWF0Y2goL15aLykpIHtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBia2V5LCB7XHJcbiAgICAgIGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiBiaW5kaW5nW2JrZXldLCB3cml0YWJsZTogZmFsc2VcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG5cclxuLy8gdHJhbnNsYXRpb24gdGFibGUgZm9yIHJldHVybiBjb2Rlcy5cclxudmFyIGNvZGVzID0ge1xyXG4gIFpfT0s6IGJpbmRpbmcuWl9PSyxcclxuICBaX1NUUkVBTV9FTkQ6IGJpbmRpbmcuWl9TVFJFQU1fRU5ELFxyXG4gIFpfTkVFRF9ESUNUOiBiaW5kaW5nLlpfTkVFRF9ESUNULFxyXG4gIFpfRVJSTk86IGJpbmRpbmcuWl9FUlJOTyxcclxuICBaX1NUUkVBTV9FUlJPUjogYmluZGluZy5aX1NUUkVBTV9FUlJPUixcclxuICBaX0RBVEFfRVJST1I6IGJpbmRpbmcuWl9EQVRBX0VSUk9SLFxyXG4gIFpfTUVNX0VSUk9SOiBiaW5kaW5nLlpfTUVNX0VSUk9SLFxyXG4gIFpfQlVGX0VSUk9SOiBiaW5kaW5nLlpfQlVGX0VSUk9SLFxyXG4gIFpfVkVSU0lPTl9FUlJPUjogYmluZGluZy5aX1ZFUlNJT05fRVJST1JcclxufTtcclxuXHJcbnZhciBja2V5cyA9IE9iamVjdC5rZXlzKGNvZGVzKTtcclxuZm9yICh2YXIgY2sgPSAwOyBjayA8IGNrZXlzLmxlbmd0aDsgY2srKykge1xyXG4gIHZhciBja2V5ID0gY2tleXNbY2tdO1xyXG4gIGNvZGVzW2NvZGVzW2NrZXldXSA9IGNrZXk7XHJcbn1cclxuXHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnY29kZXMnLCB7XHJcbiAgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IE9iamVjdC5mcmVlemUoY29kZXMpLCB3cml0YWJsZTogZmFsc2VcclxufSk7XHJcblxyXG5leHBvcnRzLkRlZmxhdGUgPSBEZWZsYXRlO1xyXG5leHBvcnRzLkluZmxhdGUgPSBJbmZsYXRlO1xyXG5leHBvcnRzLkd6aXAgPSBHemlwO1xyXG5leHBvcnRzLkd1bnppcCA9IEd1bnppcDtcclxuZXhwb3J0cy5EZWZsYXRlUmF3ID0gRGVmbGF0ZVJhdztcclxuZXhwb3J0cy5JbmZsYXRlUmF3ID0gSW5mbGF0ZVJhdztcclxuZXhwb3J0cy5VbnppcCA9IFVuemlwO1xyXG5cclxuZXhwb3J0cy5jcmVhdGVEZWZsYXRlID0gZnVuY3Rpb24gKG8pIHtcclxuICByZXR1cm4gbmV3IERlZmxhdGUobyk7XHJcbn07XHJcblxyXG5leHBvcnRzLmNyZWF0ZUluZmxhdGUgPSBmdW5jdGlvbiAobykge1xyXG4gIHJldHVybiBuZXcgSW5mbGF0ZShvKTtcclxufTtcclxuXHJcbmV4cG9ydHMuY3JlYXRlRGVmbGF0ZVJhdyA9IGZ1bmN0aW9uIChvKSB7XHJcbiAgcmV0dXJuIG5ldyBEZWZsYXRlUmF3KG8pO1xyXG59O1xyXG5cclxuZXhwb3J0cy5jcmVhdGVJbmZsYXRlUmF3ID0gZnVuY3Rpb24gKG8pIHtcclxuICByZXR1cm4gbmV3IEluZmxhdGVSYXcobyk7XHJcbn07XHJcblxyXG5leHBvcnRzLmNyZWF0ZUd6aXAgPSBmdW5jdGlvbiAobykge1xyXG4gIHJldHVybiBuZXcgR3ppcChvKTtcclxufTtcclxuXHJcbmV4cG9ydHMuY3JlYXRlR3VuemlwID0gZnVuY3Rpb24gKG8pIHtcclxuICByZXR1cm4gbmV3IEd1bnppcChvKTtcclxufTtcclxuXHJcbmV4cG9ydHMuY3JlYXRlVW56aXAgPSBmdW5jdGlvbiAobykge1xyXG4gIHJldHVybiBuZXcgVW56aXAobyk7XHJcbn07XHJcblxyXG4vLyBDb252ZW5pZW5jZSBtZXRob2RzLlxyXG4vLyBjb21wcmVzcy9kZWNvbXByZXNzIGEgc3RyaW5nIG9yIGJ1ZmZlciBpbiBvbmUgc3RlcC5cclxuZXhwb3J0cy5kZWZsYXRlID0gZnVuY3Rpb24gKGJ1ZmZlciwgb3B0cywgY2FsbGJhY2spIHtcclxuICBpZiAodHlwZW9mIG9wdHMgPT09ICdmdW5jdGlvbicpIHtcclxuICAgIGNhbGxiYWNrID0gb3B0cztcclxuICAgIG9wdHMgPSB7fTtcclxuICB9XHJcbiAgcmV0dXJuIHpsaWJCdWZmZXIobmV3IERlZmxhdGUob3B0cyksIGJ1ZmZlciwgY2FsbGJhY2spO1xyXG59O1xyXG5cclxuZXhwb3J0cy5kZWZsYXRlU3luYyA9IGZ1bmN0aW9uIChidWZmZXIsIG9wdHMpIHtcclxuICByZXR1cm4gemxpYkJ1ZmZlclN5bmMobmV3IERlZmxhdGUob3B0cyksIGJ1ZmZlcik7XHJcbn07XHJcblxyXG5leHBvcnRzLmd6aXAgPSBmdW5jdGlvbiAoYnVmZmVyLCBvcHRzLCBjYWxsYmFjaykge1xyXG4gIGlmICh0eXBlb2Ygb3B0cyA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgY2FsbGJhY2sgPSBvcHRzO1xyXG4gICAgb3B0cyA9IHt9O1xyXG4gIH1cclxuICByZXR1cm4gemxpYkJ1ZmZlcihuZXcgR3ppcChvcHRzKSwgYnVmZmVyLCBjYWxsYmFjayk7XHJcbn07XHJcblxyXG5leHBvcnRzLmd6aXBTeW5jID0gZnVuY3Rpb24gKGJ1ZmZlciwgb3B0cykge1xyXG4gIHJldHVybiB6bGliQnVmZmVyU3luYyhuZXcgR3ppcChvcHRzKSwgYnVmZmVyKTtcclxufTtcclxuXHJcbmV4cG9ydHMuZGVmbGF0ZVJhdyA9IGZ1bmN0aW9uIChidWZmZXIsIG9wdHMsIGNhbGxiYWNrKSB7XHJcbiAgaWYgKHR5cGVvZiBvcHRzID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICBjYWxsYmFjayA9IG9wdHM7XHJcbiAgICBvcHRzID0ge307XHJcbiAgfVxyXG4gIHJldHVybiB6bGliQnVmZmVyKG5ldyBEZWZsYXRlUmF3KG9wdHMpLCBidWZmZXIsIGNhbGxiYWNrKTtcclxufTtcclxuXHJcbmV4cG9ydHMuZGVmbGF0ZVJhd1N5bmMgPSBmdW5jdGlvbiAoYnVmZmVyLCBvcHRzKSB7XHJcbiAgcmV0dXJuIHpsaWJCdWZmZXJTeW5jKG5ldyBEZWZsYXRlUmF3KG9wdHMpLCBidWZmZXIpO1xyXG59O1xyXG5cclxuZXhwb3J0cy51bnppcCA9IGZ1bmN0aW9uIChidWZmZXIsIG9wdHMsIGNhbGxiYWNrKSB7XHJcbiAgaWYgKHR5cGVvZiBvcHRzID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICBjYWxsYmFjayA9IG9wdHM7XHJcbiAgICBvcHRzID0ge307XHJcbiAgfVxyXG4gIHJldHVybiB6bGliQnVmZmVyKG5ldyBVbnppcChvcHRzKSwgYnVmZmVyLCBjYWxsYmFjayk7XHJcbn07XHJcblxyXG5leHBvcnRzLnVuemlwU3luYyA9IGZ1bmN0aW9uIChidWZmZXIsIG9wdHMpIHtcclxuICByZXR1cm4gemxpYkJ1ZmZlclN5bmMobmV3IFVuemlwKG9wdHMpLCBidWZmZXIpO1xyXG59O1xyXG5cclxuZXhwb3J0cy5pbmZsYXRlID0gZnVuY3Rpb24gKGJ1ZmZlciwgb3B0cywgY2FsbGJhY2spIHtcclxuICBpZiAodHlwZW9mIG9wdHMgPT09ICdmdW5jdGlvbicpIHtcclxuICAgIGNhbGxiYWNrID0gb3B0cztcclxuICAgIG9wdHMgPSB7fTtcclxuICB9XHJcbiAgcmV0dXJuIHpsaWJCdWZmZXIobmV3IEluZmxhdGUob3B0cyksIGJ1ZmZlciwgY2FsbGJhY2spO1xyXG59O1xyXG5cclxuZXhwb3J0cy5pbmZsYXRlU3luYyA9IGZ1bmN0aW9uIChidWZmZXIsIG9wdHMpIHtcclxuICByZXR1cm4gemxpYkJ1ZmZlclN5bmMobmV3IEluZmxhdGUob3B0cyksIGJ1ZmZlcik7XHJcbn07XHJcblxyXG5leHBvcnRzLmd1bnppcCA9IGZ1bmN0aW9uIChidWZmZXIsIG9wdHMsIGNhbGxiYWNrKSB7XHJcbiAgaWYgKHR5cGVvZiBvcHRzID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICBjYWxsYmFjayA9IG9wdHM7XHJcbiAgICBvcHRzID0ge307XHJcbiAgfVxyXG4gIHJldHVybiB6bGliQnVmZmVyKG5ldyBHdW56aXAob3B0cyksIGJ1ZmZlciwgY2FsbGJhY2spO1xyXG59O1xyXG5cclxuZXhwb3J0cy5ndW56aXBTeW5jID0gZnVuY3Rpb24gKGJ1ZmZlciwgb3B0cykge1xyXG4gIHJldHVybiB6bGliQnVmZmVyU3luYyhuZXcgR3VuemlwKG9wdHMpLCBidWZmZXIpO1xyXG59O1xyXG5cclxuZXhwb3J0cy5pbmZsYXRlUmF3ID0gZnVuY3Rpb24gKGJ1ZmZlciwgb3B0cywgY2FsbGJhY2spIHtcclxuICBpZiAodHlwZW9mIG9wdHMgPT09ICdmdW5jdGlvbicpIHtcclxuICAgIGNhbGxiYWNrID0gb3B0cztcclxuICAgIG9wdHMgPSB7fTtcclxuICB9XHJcbiAgcmV0dXJuIHpsaWJCdWZmZXIobmV3IEluZmxhdGVSYXcob3B0cyksIGJ1ZmZlciwgY2FsbGJhY2spO1xyXG59O1xyXG5cclxuZXhwb3J0cy5pbmZsYXRlUmF3U3luYyA9IGZ1bmN0aW9uIChidWZmZXIsIG9wdHMpIHtcclxuICByZXR1cm4gemxpYkJ1ZmZlclN5bmMobmV3IEluZmxhdGVSYXcob3B0cyksIGJ1ZmZlcik7XHJcbn07XHJcblxyXG5mdW5jdGlvbiB6bGliQnVmZmVyKGVuZ2luZSwgYnVmZmVyLCBjYWxsYmFjaykge1xyXG4gIHZhciBidWZmZXJzID0gW107XHJcbiAgdmFyIG5yZWFkID0gMDtcclxuXHJcbiAgZW5naW5lLm9uKCdlcnJvcicsIG9uRXJyb3IpO1xyXG4gIGVuZ2luZS5vbignZW5kJywgb25FbmQpO1xyXG5cclxuICBlbmdpbmUuZW5kKGJ1ZmZlcik7XHJcbiAgZmxvdygpO1xyXG5cclxuICBmdW5jdGlvbiBmbG93KCkge1xyXG4gICAgdmFyIGNodW5rO1xyXG4gICAgd2hpbGUgKG51bGwgIT09IChjaHVuayA9IGVuZ2luZS5yZWFkKCkpKSB7XHJcbiAgICAgIGJ1ZmZlcnMucHVzaChjaHVuayk7XHJcbiAgICAgIG5yZWFkICs9IGNodW5rLmxlbmd0aDtcclxuICAgIH1cclxuICAgIGVuZ2luZS5vbmNlKCdyZWFkYWJsZScsIGZsb3cpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gb25FcnJvcihlcnIpIHtcclxuICAgIGVuZ2luZS5yZW1vdmVMaXN0ZW5lcignZW5kJywgb25FbmQpO1xyXG4gICAgZW5naW5lLnJlbW92ZUxpc3RlbmVyKCdyZWFkYWJsZScsIGZsb3cpO1xyXG4gICAgY2FsbGJhY2soZXJyKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIG9uRW5kKCkge1xyXG4gICAgdmFyIGJ1ZjtcclxuICAgIHZhciBlcnIgPSBudWxsO1xyXG5cclxuICAgIGlmIChucmVhZCA+PSBrTWF4TGVuZ3RoKSB7XHJcbiAgICAgIGVyciA9IG5ldyBSYW5nZUVycm9yKGtSYW5nZUVycm9yTWVzc2FnZSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBidWYgPSBCdWZmZXIuY29uY2F0KGJ1ZmZlcnMsIG5yZWFkKTtcclxuICAgIH1cclxuXHJcbiAgICBidWZmZXJzID0gW107XHJcbiAgICBlbmdpbmUuY2xvc2UoKTtcclxuICAgIGNhbGxiYWNrKGVyciwgYnVmKTtcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHpsaWJCdWZmZXJTeW5jKGVuZ2luZSwgYnVmZmVyKSB7XHJcbiAgaWYgKHR5cGVvZiBidWZmZXIgPT09ICdzdHJpbmcnKSBidWZmZXIgPSBCdWZmZXIuZnJvbShidWZmZXIpO1xyXG5cclxuICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcihidWZmZXIpKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdOb3QgYSBzdHJpbmcgb3IgYnVmZmVyJyk7XHJcblxyXG4gIHZhciBmbHVzaEZsYWcgPSBlbmdpbmUuX2ZpbmlzaEZsdXNoRmxhZztcclxuXHJcbiAgcmV0dXJuIGVuZ2luZS5fcHJvY2Vzc0NodW5rKGJ1ZmZlciwgZmx1c2hGbGFnKTtcclxufVxyXG5cclxuLy8gZ2VuZXJpYyB6bGliXHJcbi8vIG1pbmltYWwgMi1ieXRlIGhlYWRlclxyXG5mdW5jdGlvbiBEZWZsYXRlKG9wdHMpIHtcclxuICBpZiAoISh0aGlzIGluc3RhbmNlb2YgRGVmbGF0ZSkpIHJldHVybiBuZXcgRGVmbGF0ZShvcHRzKTtcclxuICBabGliLmNhbGwodGhpcywgb3B0cywgYmluZGluZy5ERUZMQVRFKTtcclxufVxyXG5cclxuZnVuY3Rpb24gSW5mbGF0ZShvcHRzKSB7XHJcbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIEluZmxhdGUpKSByZXR1cm4gbmV3IEluZmxhdGUob3B0cyk7XHJcbiAgWmxpYi5jYWxsKHRoaXMsIG9wdHMsIGJpbmRpbmcuSU5GTEFURSk7XHJcbn1cclxuXHJcbi8vIGd6aXAgLSBiaWdnZXIgaGVhZGVyLCBzYW1lIGRlZmxhdGUgY29tcHJlc3Npb25cclxuZnVuY3Rpb24gR3ppcChvcHRzKSB7XHJcbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIEd6aXApKSByZXR1cm4gbmV3IEd6aXAob3B0cyk7XHJcbiAgWmxpYi5jYWxsKHRoaXMsIG9wdHMsIGJpbmRpbmcuR1pJUCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIEd1bnppcChvcHRzKSB7XHJcbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIEd1bnppcCkpIHJldHVybiBuZXcgR3VuemlwKG9wdHMpO1xyXG4gIFpsaWIuY2FsbCh0aGlzLCBvcHRzLCBiaW5kaW5nLkdVTlpJUCk7XHJcbn1cclxuXHJcbi8vIHJhdyAtIG5vIGhlYWRlclxyXG5mdW5jdGlvbiBEZWZsYXRlUmF3KG9wdHMpIHtcclxuICBpZiAoISh0aGlzIGluc3RhbmNlb2YgRGVmbGF0ZVJhdykpIHJldHVybiBuZXcgRGVmbGF0ZVJhdyhvcHRzKTtcclxuICBabGliLmNhbGwodGhpcywgb3B0cywgYmluZGluZy5ERUZMQVRFUkFXKTtcclxufVxyXG5cclxuZnVuY3Rpb24gSW5mbGF0ZVJhdyhvcHRzKSB7XHJcbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIEluZmxhdGVSYXcpKSByZXR1cm4gbmV3IEluZmxhdGVSYXcob3B0cyk7XHJcbiAgWmxpYi5jYWxsKHRoaXMsIG9wdHMsIGJpbmRpbmcuSU5GTEFURVJBVyk7XHJcbn1cclxuXHJcbi8vIGF1dG8tZGV0ZWN0IGhlYWRlci5cclxuZnVuY3Rpb24gVW56aXAob3B0cykge1xyXG4gIGlmICghKHRoaXMgaW5zdGFuY2VvZiBVbnppcCkpIHJldHVybiBuZXcgVW56aXAob3B0cyk7XHJcbiAgWmxpYi5jYWxsKHRoaXMsIG9wdHMsIGJpbmRpbmcuVU5aSVApO1xyXG59XHJcblxyXG5mdW5jdGlvbiBpc1ZhbGlkRmx1c2hGbGFnKGZsYWcpIHtcclxuICByZXR1cm4gZmxhZyA9PT0gYmluZGluZy5aX05PX0ZMVVNIIHx8IGZsYWcgPT09IGJpbmRpbmcuWl9QQVJUSUFMX0ZMVVNIIHx8IGZsYWcgPT09IGJpbmRpbmcuWl9TWU5DX0ZMVVNIIHx8IGZsYWcgPT09IGJpbmRpbmcuWl9GVUxMX0ZMVVNIIHx8IGZsYWcgPT09IGJpbmRpbmcuWl9GSU5JU0ggfHwgZmxhZyA9PT0gYmluZGluZy5aX0JMT0NLO1xyXG59XHJcblxyXG4vLyB0aGUgWmxpYiBjbGFzcyB0aGV5IGFsbCBpbmhlcml0IGZyb21cclxuLy8gVGhpcyB0aGluZyBtYW5hZ2VzIHRoZSBxdWV1ZSBvZiByZXF1ZXN0cywgYW5kIHJldHVybnNcclxuLy8gdHJ1ZSBvciBmYWxzZSBpZiB0aGVyZSBpcyBhbnl0aGluZyBpbiB0aGUgcXVldWUgd2hlblxyXG4vLyB5b3UgY2FsbCB0aGUgLndyaXRlKCkgbWV0aG9kLlxyXG5cclxuZnVuY3Rpb24gWmxpYihvcHRzLCBtb2RlKSB7XHJcbiAgdmFyIF90aGlzID0gdGhpcztcclxuXHJcbiAgdGhpcy5fb3B0cyA9IG9wdHMgPSBvcHRzIHx8IHt9O1xyXG4gIHRoaXMuX2NodW5rU2l6ZSA9IG9wdHMuY2h1bmtTaXplIHx8IGV4cG9ydHMuWl9ERUZBVUxUX0NIVU5LO1xyXG5cclxuICBUcmFuc2Zvcm0uY2FsbCh0aGlzLCBvcHRzKTtcclxuXHJcbiAgaWYgKG9wdHMuZmx1c2ggJiYgIWlzVmFsaWRGbHVzaEZsYWcob3B0cy5mbHVzaCkpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBmbHVzaCBmbGFnOiAnICsgb3B0cy5mbHVzaCk7XHJcbiAgfVxyXG4gIGlmIChvcHRzLmZpbmlzaEZsdXNoICYmICFpc1ZhbGlkRmx1c2hGbGFnKG9wdHMuZmluaXNoRmx1c2gpKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgZmx1c2ggZmxhZzogJyArIG9wdHMuZmluaXNoRmx1c2gpO1xyXG4gIH1cclxuXHJcbiAgdGhpcy5fZmx1c2hGbGFnID0gb3B0cy5mbHVzaCB8fCBiaW5kaW5nLlpfTk9fRkxVU0g7XHJcbiAgdGhpcy5fZmluaXNoRmx1c2hGbGFnID0gdHlwZW9mIG9wdHMuZmluaXNoRmx1c2ggIT09ICd1bmRlZmluZWQnID8gb3B0cy5maW5pc2hGbHVzaCA6IGJpbmRpbmcuWl9GSU5JU0g7XHJcblxyXG4gIGlmIChvcHRzLmNodW5rU2l6ZSkge1xyXG4gICAgaWYgKG9wdHMuY2h1bmtTaXplIDwgZXhwb3J0cy5aX01JTl9DSFVOSyB8fCBvcHRzLmNodW5rU2l6ZSA+IGV4cG9ydHMuWl9NQVhfQ0hVTkspIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGNodW5rIHNpemU6ICcgKyBvcHRzLmNodW5rU2l6ZSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBpZiAob3B0cy53aW5kb3dCaXRzKSB7XHJcbiAgICBpZiAob3B0cy53aW5kb3dCaXRzIDwgZXhwb3J0cy5aX01JTl9XSU5ET1dCSVRTIHx8IG9wdHMud2luZG93Qml0cyA+IGV4cG9ydHMuWl9NQVhfV0lORE9XQklUUykge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgd2luZG93Qml0czogJyArIG9wdHMud2luZG93Qml0cyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBpZiAob3B0cy5sZXZlbCkge1xyXG4gICAgaWYgKG9wdHMubGV2ZWwgPCBleHBvcnRzLlpfTUlOX0xFVkVMIHx8IG9wdHMubGV2ZWwgPiBleHBvcnRzLlpfTUFYX0xFVkVMKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBjb21wcmVzc2lvbiBsZXZlbDogJyArIG9wdHMubGV2ZWwpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgaWYgKG9wdHMubWVtTGV2ZWwpIHtcclxuICAgIGlmIChvcHRzLm1lbUxldmVsIDwgZXhwb3J0cy5aX01JTl9NRU1MRVZFTCB8fCBvcHRzLm1lbUxldmVsID4gZXhwb3J0cy5aX01BWF9NRU1MRVZFTCkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgbWVtTGV2ZWw6ICcgKyBvcHRzLm1lbUxldmVsKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGlmIChvcHRzLnN0cmF0ZWd5KSB7XHJcbiAgICBpZiAob3B0cy5zdHJhdGVneSAhPSBleHBvcnRzLlpfRklMVEVSRUQgJiYgb3B0cy5zdHJhdGVneSAhPSBleHBvcnRzLlpfSFVGRk1BTl9PTkxZICYmIG9wdHMuc3RyYXRlZ3kgIT0gZXhwb3J0cy5aX1JMRSAmJiBvcHRzLnN0cmF0ZWd5ICE9IGV4cG9ydHMuWl9GSVhFRCAmJiBvcHRzLnN0cmF0ZWd5ICE9IGV4cG9ydHMuWl9ERUZBVUxUX1NUUkFURUdZKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBzdHJhdGVneTogJyArIG9wdHMuc3RyYXRlZ3kpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgaWYgKG9wdHMuZGljdGlvbmFyeSkge1xyXG4gICAgaWYgKCFCdWZmZXIuaXNCdWZmZXIob3B0cy5kaWN0aW9uYXJ5KSkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgZGljdGlvbmFyeTogaXQgc2hvdWxkIGJlIGEgQnVmZmVyIGluc3RhbmNlJyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB0aGlzLl9oYW5kbGUgPSBuZXcgYmluZGluZy5abGliKG1vZGUpO1xyXG5cclxuICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgdGhpcy5faGFkRXJyb3IgPSBmYWxzZTtcclxuICB0aGlzLl9oYW5kbGUub25lcnJvciA9IGZ1bmN0aW9uIChtZXNzYWdlLCBlcnJubykge1xyXG4gICAgLy8gdGhlcmUgaXMgbm8gd2F5IHRvIGNsZWFubHkgcmVjb3Zlci5cclxuICAgIC8vIGNvbnRpbnVpbmcgb25seSBvYnNjdXJlcyBwcm9ibGVtcy5cclxuICAgIF9jbG9zZShzZWxmKTtcclxuICAgIHNlbGYuX2hhZEVycm9yID0gdHJ1ZTtcclxuXHJcbiAgICB2YXIgZXJyb3IgPSBuZXcgRXJyb3IobWVzc2FnZSk7XHJcbiAgICBlcnJvci5lcnJubyA9IGVycm5vO1xyXG4gICAgZXJyb3IuY29kZSA9IGV4cG9ydHMuY29kZXNbZXJybm9dO1xyXG4gICAgc2VsZi5lbWl0KCdlcnJvcicsIGVycm9yKTtcclxuICB9O1xyXG5cclxuICB2YXIgbGV2ZWwgPSBleHBvcnRzLlpfREVGQVVMVF9DT01QUkVTU0lPTjtcclxuICBpZiAodHlwZW9mIG9wdHMubGV2ZWwgPT09ICdudW1iZXInKSBsZXZlbCA9IG9wdHMubGV2ZWw7XHJcblxyXG4gIHZhciBzdHJhdGVneSA9IGV4cG9ydHMuWl9ERUZBVUxUX1NUUkFURUdZO1xyXG4gIGlmICh0eXBlb2Ygb3B0cy5zdHJhdGVneSA9PT0gJ251bWJlcicpIHN0cmF0ZWd5ID0gb3B0cy5zdHJhdGVneTtcclxuXHJcbiAgdGhpcy5faGFuZGxlLmluaXQob3B0cy53aW5kb3dCaXRzIHx8IGV4cG9ydHMuWl9ERUZBVUxUX1dJTkRPV0JJVFMsIGxldmVsLCBvcHRzLm1lbUxldmVsIHx8IGV4cG9ydHMuWl9ERUZBVUxUX01FTUxFVkVMLCBzdHJhdGVneSwgb3B0cy5kaWN0aW9uYXJ5KTtcclxuXHJcbiAgdGhpcy5fYnVmZmVyID0gQnVmZmVyLmFsbG9jVW5zYWZlKHRoaXMuX2NodW5rU2l6ZSk7XHJcbiAgdGhpcy5fb2Zmc2V0ID0gMDtcclxuICB0aGlzLl9sZXZlbCA9IGxldmVsO1xyXG4gIHRoaXMuX3N0cmF0ZWd5ID0gc3RyYXRlZ3k7XHJcblxyXG4gIHRoaXMub25jZSgnZW5kJywgdGhpcy5jbG9zZSk7XHJcblxyXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnX2Nsb3NlZCcsIHtcclxuICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICByZXR1cm4gIV90aGlzLl9oYW5kbGU7XHJcbiAgICB9LFxyXG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxyXG4gICAgZW51bWVyYWJsZTogdHJ1ZVxyXG4gIH0pO1xyXG59XHJcblxyXG51dGlsLmluaGVyaXRzKFpsaWIsIFRyYW5zZm9ybSk7XHJcblxyXG5abGliLnByb3RvdHlwZS5wYXJhbXMgPSBmdW5jdGlvbiAobGV2ZWwsIHN0cmF0ZWd5LCBjYWxsYmFjaykge1xyXG4gIGlmIChsZXZlbCA8IGV4cG9ydHMuWl9NSU5fTEVWRUwgfHwgbGV2ZWwgPiBleHBvcnRzLlpfTUFYX0xFVkVMKSB7XHJcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignSW52YWxpZCBjb21wcmVzc2lvbiBsZXZlbDogJyArIGxldmVsKTtcclxuICB9XHJcbiAgaWYgKHN0cmF0ZWd5ICE9IGV4cG9ydHMuWl9GSUxURVJFRCAmJiBzdHJhdGVneSAhPSBleHBvcnRzLlpfSFVGRk1BTl9PTkxZICYmIHN0cmF0ZWd5ICE9IGV4cG9ydHMuWl9STEUgJiYgc3RyYXRlZ3kgIT0gZXhwb3J0cy5aX0ZJWEVEICYmIHN0cmF0ZWd5ICE9IGV4cG9ydHMuWl9ERUZBVUxUX1NUUkFURUdZKSB7XHJcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdJbnZhbGlkIHN0cmF0ZWd5OiAnICsgc3RyYXRlZ3kpO1xyXG4gIH1cclxuXHJcbiAgaWYgKHRoaXMuX2xldmVsICE9PSBsZXZlbCB8fCB0aGlzLl9zdHJhdGVneSAhPT0gc3RyYXRlZ3kpIHtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgIHRoaXMuZmx1c2goYmluZGluZy5aX1NZTkNfRkxVU0gsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgYXNzZXJ0KHNlbGYuX2hhbmRsZSwgJ3psaWIgYmluZGluZyBjbG9zZWQnKTtcclxuICAgICAgc2VsZi5faGFuZGxlLnBhcmFtcyhsZXZlbCwgc3RyYXRlZ3kpO1xyXG4gICAgICBpZiAoIXNlbGYuX2hhZEVycm9yKSB7XHJcbiAgICAgICAgc2VsZi5fbGV2ZWwgPSBsZXZlbDtcclxuICAgICAgICBzZWxmLl9zdHJhdGVneSA9IHN0cmF0ZWd5O1xyXG4gICAgICAgIGlmIChjYWxsYmFjaykgY2FsbGJhY2soKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfSBlbHNlIHtcclxuICAgIHByb2Nlc3MubmV4dFRpY2soY2FsbGJhY2spO1xyXG4gIH1cclxufTtcclxuXHJcblpsaWIucHJvdG90eXBlLnJlc2V0ID0gZnVuY3Rpb24gKCkge1xyXG4gIGFzc2VydCh0aGlzLl9oYW5kbGUsICd6bGliIGJpbmRpbmcgY2xvc2VkJyk7XHJcbiAgcmV0dXJuIHRoaXMuX2hhbmRsZS5yZXNldCgpO1xyXG59O1xyXG5cclxuLy8gVGhpcyBpcyB0aGUgX2ZsdXNoIGZ1bmN0aW9uIGNhbGxlZCBieSB0aGUgdHJhbnNmb3JtIGNsYXNzLFxyXG4vLyBpbnRlcm5hbGx5LCB3aGVuIHRoZSBsYXN0IGNodW5rIGhhcyBiZWVuIHdyaXR0ZW4uXHJcblpsaWIucHJvdG90eXBlLl9mbHVzaCA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xyXG4gIHRoaXMuX3RyYW5zZm9ybShCdWZmZXIuYWxsb2MoMCksICcnLCBjYWxsYmFjayk7XHJcbn07XHJcblxyXG5abGliLnByb3RvdHlwZS5mbHVzaCA9IGZ1bmN0aW9uIChraW5kLCBjYWxsYmFjaykge1xyXG4gIHZhciBfdGhpczIgPSB0aGlzO1xyXG5cclxuICB2YXIgd3MgPSB0aGlzLl93cml0YWJsZVN0YXRlO1xyXG5cclxuICBpZiAodHlwZW9mIGtpbmQgPT09ICdmdW5jdGlvbicgfHwga2luZCA9PT0gdW5kZWZpbmVkICYmICFjYWxsYmFjaykge1xyXG4gICAgY2FsbGJhY2sgPSBraW5kO1xyXG4gICAga2luZCA9IGJpbmRpbmcuWl9GVUxMX0ZMVVNIO1xyXG4gIH1cclxuXHJcbiAgaWYgKHdzLmVuZGVkKSB7XHJcbiAgICBpZiAoY2FsbGJhY2spIHByb2Nlc3MubmV4dFRpY2soY2FsbGJhY2spO1xyXG4gIH0gZWxzZSBpZiAod3MuZW5kaW5nKSB7XHJcbiAgICBpZiAoY2FsbGJhY2spIHRoaXMub25jZSgnZW5kJywgY2FsbGJhY2spO1xyXG4gIH0gZWxzZSBpZiAod3MubmVlZERyYWluKSB7XHJcbiAgICBpZiAoY2FsbGJhY2spIHtcclxuICAgICAgdGhpcy5vbmNlKCdkcmFpbicsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gX3RoaXMyLmZsdXNoKGtpbmQsIGNhbGxiYWNrKTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfSBlbHNlIHtcclxuICAgIHRoaXMuX2ZsdXNoRmxhZyA9IGtpbmQ7XHJcbiAgICB0aGlzLndyaXRlKEJ1ZmZlci5hbGxvYygwKSwgJycsIGNhbGxiYWNrKTtcclxuICB9XHJcbn07XHJcblxyXG5abGliLnByb3RvdHlwZS5jbG9zZSA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xyXG4gIF9jbG9zZSh0aGlzLCBjYWxsYmFjayk7XHJcbiAgcHJvY2Vzcy5uZXh0VGljayhlbWl0Q2xvc2VOVCwgdGhpcyk7XHJcbn07XHJcblxyXG5mdW5jdGlvbiBfY2xvc2UoZW5naW5lLCBjYWxsYmFjaykge1xyXG4gIGlmIChjYWxsYmFjaykgcHJvY2Vzcy5uZXh0VGljayhjYWxsYmFjayk7XHJcblxyXG4gIC8vIENhbGxlciBtYXkgaW52b2tlIC5jbG9zZSBhZnRlciBhIHpsaWIgZXJyb3IgKHdoaWNoIHdpbGwgbnVsbCBfaGFuZGxlKS5cclxuICBpZiAoIWVuZ2luZS5faGFuZGxlKSByZXR1cm47XHJcblxyXG4gIGVuZ2luZS5faGFuZGxlLmNsb3NlKCk7XHJcbiAgZW5naW5lLl9oYW5kbGUgPSBudWxsO1xyXG59XHJcblxyXG5mdW5jdGlvbiBlbWl0Q2xvc2VOVChzZWxmKSB7XHJcbiAgc2VsZi5lbWl0KCdjbG9zZScpO1xyXG59XHJcblxyXG5abGliLnByb3RvdHlwZS5fdHJhbnNmb3JtID0gZnVuY3Rpb24gKGNodW5rLCBlbmNvZGluZywgY2IpIHtcclxuICB2YXIgZmx1c2hGbGFnO1xyXG4gIHZhciB3cyA9IHRoaXMuX3dyaXRhYmxlU3RhdGU7XHJcbiAgdmFyIGVuZGluZyA9IHdzLmVuZGluZyB8fCB3cy5lbmRlZDtcclxuICB2YXIgbGFzdCA9IGVuZGluZyAmJiAoIWNodW5rIHx8IHdzLmxlbmd0aCA9PT0gY2h1bmsubGVuZ3RoKTtcclxuXHJcbiAgaWYgKGNodW5rICE9PSBudWxsICYmICFCdWZmZXIuaXNCdWZmZXIoY2h1bmspKSByZXR1cm4gY2IobmV3IEVycm9yKCdpbnZhbGlkIGlucHV0JykpO1xyXG5cclxuICBpZiAoIXRoaXMuX2hhbmRsZSkgcmV0dXJuIGNiKG5ldyBFcnJvcignemxpYiBiaW5kaW5nIGNsb3NlZCcpKTtcclxuXHJcbiAgLy8gSWYgaXQncyB0aGUgbGFzdCBjaHVuaywgb3IgYSBmaW5hbCBmbHVzaCwgd2UgdXNlIHRoZSBaX0ZJTklTSCBmbHVzaCBmbGFnXHJcbiAgLy8gKG9yIHdoYXRldmVyIGZsYWcgd2FzIHByb3ZpZGVkIHVzaW5nIG9wdHMuZmluaXNoRmx1c2gpLlxyXG4gIC8vIElmIGl0J3MgZXhwbGljaXRseSBmbHVzaGluZyBhdCBzb21lIG90aGVyIHRpbWUsIHRoZW4gd2UgdXNlXHJcbiAgLy8gWl9GVUxMX0ZMVVNILiBPdGhlcndpc2UsIHVzZSBaX05PX0ZMVVNIIGZvciBtYXhpbXVtIGNvbXByZXNzaW9uXHJcbiAgLy8gZ29vZG5lc3MuXHJcbiAgaWYgKGxhc3QpIGZsdXNoRmxhZyA9IHRoaXMuX2ZpbmlzaEZsdXNoRmxhZztlbHNlIHtcclxuICAgIGZsdXNoRmxhZyA9IHRoaXMuX2ZsdXNoRmxhZztcclxuICAgIC8vIG9uY2Ugd2UndmUgZmx1c2hlZCB0aGUgbGFzdCBvZiB0aGUgcXVldWUsIHN0b3AgZmx1c2hpbmcgYW5kXHJcbiAgICAvLyBnbyBiYWNrIHRvIHRoZSBub3JtYWwgYmVoYXZpb3IuXHJcbiAgICBpZiAoY2h1bmsubGVuZ3RoID49IHdzLmxlbmd0aCkge1xyXG4gICAgICB0aGlzLl9mbHVzaEZsYWcgPSB0aGlzLl9vcHRzLmZsdXNoIHx8IGJpbmRpbmcuWl9OT19GTFVTSDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHRoaXMuX3Byb2Nlc3NDaHVuayhjaHVuaywgZmx1c2hGbGFnLCBjYik7XHJcbn07XHJcblxyXG5abGliLnByb3RvdHlwZS5fcHJvY2Vzc0NodW5rID0gZnVuY3Rpb24gKGNodW5rLCBmbHVzaEZsYWcsIGNiKSB7XHJcbiAgdmFyIGF2YWlsSW5CZWZvcmUgPSBjaHVuayAmJiBjaHVuay5sZW5ndGg7XHJcbiAgdmFyIGF2YWlsT3V0QmVmb3JlID0gdGhpcy5fY2h1bmtTaXplIC0gdGhpcy5fb2Zmc2V0O1xyXG4gIHZhciBpbk9mZiA9IDA7XHJcblxyXG4gIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgdmFyIGFzeW5jID0gdHlwZW9mIGNiID09PSAnZnVuY3Rpb24nO1xyXG5cclxuICBpZiAoIWFzeW5jKSB7XHJcbiAgICB2YXIgYnVmZmVycyA9IFtdO1xyXG4gICAgdmFyIG5yZWFkID0gMDtcclxuXHJcbiAgICB2YXIgZXJyb3I7XHJcbiAgICB0aGlzLm9uKCdlcnJvcicsIGZ1bmN0aW9uIChlcikge1xyXG4gICAgICBlcnJvciA9IGVyO1xyXG4gICAgfSk7XHJcblxyXG4gICAgYXNzZXJ0KHRoaXMuX2hhbmRsZSwgJ3psaWIgYmluZGluZyBjbG9zZWQnKTtcclxuICAgIGRvIHtcclxuICAgICAgdmFyIHJlcyA9IHRoaXMuX2hhbmRsZS53cml0ZVN5bmMoZmx1c2hGbGFnLCBjaHVuaywgLy8gaW5cclxuICAgICAgaW5PZmYsIC8vIGluX29mZlxyXG4gICAgICBhdmFpbEluQmVmb3JlLCAvLyBpbl9sZW5cclxuICAgICAgdGhpcy5fYnVmZmVyLCAvLyBvdXRcclxuICAgICAgdGhpcy5fb2Zmc2V0LCAvL291dF9vZmZcclxuICAgICAgYXZhaWxPdXRCZWZvcmUpOyAvLyBvdXRfbGVuXHJcbiAgICB9IHdoaWxlICghdGhpcy5faGFkRXJyb3IgJiYgY2FsbGJhY2socmVzWzBdLCByZXNbMV0pKTtcclxuXHJcbiAgICBpZiAodGhpcy5faGFkRXJyb3IpIHtcclxuICAgICAgdGhyb3cgZXJyb3I7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKG5yZWFkID49IGtNYXhMZW5ndGgpIHtcclxuICAgICAgX2Nsb3NlKHRoaXMpO1xyXG4gICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcihrUmFuZ2VFcnJvck1lc3NhZ2UpO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBidWYgPSBCdWZmZXIuY29uY2F0KGJ1ZmZlcnMsIG5yZWFkKTtcclxuICAgIF9jbG9zZSh0aGlzKTtcclxuXHJcbiAgICByZXR1cm4gYnVmO1xyXG4gIH1cclxuXHJcbiAgYXNzZXJ0KHRoaXMuX2hhbmRsZSwgJ3psaWIgYmluZGluZyBjbG9zZWQnKTtcclxuICB2YXIgcmVxID0gdGhpcy5faGFuZGxlLndyaXRlKGZsdXNoRmxhZywgY2h1bmssIC8vIGluXHJcbiAgaW5PZmYsIC8vIGluX29mZlxyXG4gIGF2YWlsSW5CZWZvcmUsIC8vIGluX2xlblxyXG4gIHRoaXMuX2J1ZmZlciwgLy8gb3V0XHJcbiAgdGhpcy5fb2Zmc2V0LCAvL291dF9vZmZcclxuICBhdmFpbE91dEJlZm9yZSk7IC8vIG91dF9sZW5cclxuXHJcbiAgcmVxLmJ1ZmZlciA9IGNodW5rO1xyXG4gIHJlcS5jYWxsYmFjayA9IGNhbGxiYWNrO1xyXG5cclxuICBmdW5jdGlvbiBjYWxsYmFjayhhdmFpbEluQWZ0ZXIsIGF2YWlsT3V0QWZ0ZXIpIHtcclxuICAgIC8vIFdoZW4gdGhlIGNhbGxiYWNrIGlzIHVzZWQgaW4gYW4gYXN5bmMgd3JpdGUsIHRoZSBjYWxsYmFjaydzXHJcbiAgICAvLyBjb250ZXh0IGlzIHRoZSBgcmVxYCBvYmplY3QgdGhhdCB3YXMgY3JlYXRlZC4gVGhlIHJlcSBvYmplY3RcclxuICAgIC8vIGlzID09PSB0aGlzLl9oYW5kbGUsIGFuZCB0aGF0J3Mgd2h5IGl0J3MgaW1wb3J0YW50IHRvIG51bGxcclxuICAgIC8vIG91dCB0aGUgdmFsdWVzIGFmdGVyIHRoZXkgYXJlIGRvbmUgYmVpbmcgdXNlZC4gYHRoaXMuX2hhbmRsZWBcclxuICAgIC8vIGNhbiBzdGF5IGluIG1lbW9yeSBsb25nZXIgdGhhbiB0aGUgY2FsbGJhY2sgYW5kIGJ1ZmZlciBhcmUgbmVlZGVkLlxyXG4gICAgaWYgKHRoaXMpIHtcclxuICAgICAgdGhpcy5idWZmZXIgPSBudWxsO1xyXG4gICAgICB0aGlzLmNhbGxiYWNrID0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoc2VsZi5faGFkRXJyb3IpIHJldHVybjtcclxuXHJcbiAgICB2YXIgaGF2ZSA9IGF2YWlsT3V0QmVmb3JlIC0gYXZhaWxPdXRBZnRlcjtcclxuICAgIGFzc2VydChoYXZlID49IDAsICdoYXZlIHNob3VsZCBub3QgZ28gZG93bicpO1xyXG5cclxuICAgIGlmIChoYXZlID4gMCkge1xyXG4gICAgICB2YXIgb3V0ID0gc2VsZi5fYnVmZmVyLnNsaWNlKHNlbGYuX29mZnNldCwgc2VsZi5fb2Zmc2V0ICsgaGF2ZSk7XHJcbiAgICAgIHNlbGYuX29mZnNldCArPSBoYXZlO1xyXG4gICAgICAvLyBzZXJ2ZSBzb21lIG91dHB1dCB0byB0aGUgY29uc3VtZXIuXHJcbiAgICAgIGlmIChhc3luYykge1xyXG4gICAgICAgIHNlbGYucHVzaChvdXQpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGJ1ZmZlcnMucHVzaChvdXQpO1xyXG4gICAgICAgIG5yZWFkICs9IG91dC5sZW5ndGg7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBleGhhdXN0ZWQgdGhlIG91dHB1dCBidWZmZXIsIG9yIHVzZWQgYWxsIHRoZSBpbnB1dCBjcmVhdGUgYSBuZXcgb25lLlxyXG4gICAgaWYgKGF2YWlsT3V0QWZ0ZXIgPT09IDAgfHwgc2VsZi5fb2Zmc2V0ID49IHNlbGYuX2NodW5rU2l6ZSkge1xyXG4gICAgICBhdmFpbE91dEJlZm9yZSA9IHNlbGYuX2NodW5rU2l6ZTtcclxuICAgICAgc2VsZi5fb2Zmc2V0ID0gMDtcclxuICAgICAgc2VsZi5fYnVmZmVyID0gQnVmZmVyLmFsbG9jVW5zYWZlKHNlbGYuX2NodW5rU2l6ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGF2YWlsT3V0QWZ0ZXIgPT09IDApIHtcclxuICAgICAgLy8gTm90IGFjdHVhbGx5IGRvbmUuICBOZWVkIHRvIHJlcHJvY2Vzcy5cclxuICAgICAgLy8gQWxzbywgdXBkYXRlIHRoZSBhdmFpbEluQmVmb3JlIHRvIHRoZSBhdmFpbEluQWZ0ZXIgdmFsdWUsXHJcbiAgICAgIC8vIHNvIHRoYXQgaWYgd2UgaGF2ZSB0byBoaXQgaXQgYSB0aGlyZCAoZm91cnRoLCBldGMuKSB0aW1lLFxyXG4gICAgICAvLyBpdCdsbCBoYXZlIHRoZSBjb3JyZWN0IGJ5dGUgY291bnRzLlxyXG4gICAgICBpbk9mZiArPSBhdmFpbEluQmVmb3JlIC0gYXZhaWxJbkFmdGVyO1xyXG4gICAgICBhdmFpbEluQmVmb3JlID0gYXZhaWxJbkFmdGVyO1xyXG5cclxuICAgICAgaWYgKCFhc3luYykgcmV0dXJuIHRydWU7XHJcblxyXG4gICAgICB2YXIgbmV3UmVxID0gc2VsZi5faGFuZGxlLndyaXRlKGZsdXNoRmxhZywgY2h1bmssIGluT2ZmLCBhdmFpbEluQmVmb3JlLCBzZWxmLl9idWZmZXIsIHNlbGYuX29mZnNldCwgc2VsZi5fY2h1bmtTaXplKTtcclxuICAgICAgbmV3UmVxLmNhbGxiYWNrID0gY2FsbGJhY2s7IC8vIHRoaXMgc2FtZSBmdW5jdGlvblxyXG4gICAgICBuZXdSZXEuYnVmZmVyID0gY2h1bms7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoIWFzeW5jKSByZXR1cm4gZmFsc2U7XHJcblxyXG4gICAgLy8gZmluaXNoZWQgd2l0aCB0aGUgY2h1bmsuXHJcbiAgICBjYigpO1xyXG4gIH1cclxufTtcclxuXHJcbnV0aWwuaW5oZXJpdHMoRGVmbGF0ZSwgWmxpYik7XHJcbnV0aWwuaW5oZXJpdHMoSW5mbGF0ZSwgWmxpYik7XHJcbnV0aWwuaW5oZXJpdHMoR3ppcCwgWmxpYik7XHJcbnV0aWwuaW5oZXJpdHMoR3VuemlwLCBabGliKTtcclxudXRpbC5pbmhlcml0cyhEZWZsYXRlUmF3LCBabGliKTtcclxudXRpbC5pbmhlcml0cyhJbmZsYXRlUmF3LCBabGliKTtcclxudXRpbC5pbmhlcml0cyhVbnppcCwgWmxpYik7IiwiJ3VzZSBzdHJpY3QnO1xyXG4vKiBlc2xpbnQgY2FtZWxjYXNlOiBcIm9mZlwiICovXHJcblxyXG52YXIgYXNzZXJ0ID0gcmVxdWlyZSgnYXNzZXJ0Jyk7XHJcblxyXG52YXIgWnN0cmVhbSA9IHJlcXVpcmUoJ3Bha28vbGliL3psaWIvenN0cmVhbScpO1xyXG52YXIgemxpYl9kZWZsYXRlID0gcmVxdWlyZSgncGFrby9saWIvemxpYi9kZWZsYXRlLmpzJyk7XHJcbnZhciB6bGliX2luZmxhdGUgPSByZXF1aXJlKCdwYWtvL2xpYi96bGliL2luZmxhdGUuanMnKTtcclxudmFyIGNvbnN0YW50cyA9IHJlcXVpcmUoJ3Bha28vbGliL3psaWIvY29uc3RhbnRzJyk7XHJcblxyXG5mb3IgKHZhciBrZXkgaW4gY29uc3RhbnRzKSB7XHJcbiAgZXhwb3J0c1trZXldID0gY29uc3RhbnRzW2tleV07XHJcbn1cclxuXHJcbi8vIHpsaWIgbW9kZXNcclxuZXhwb3J0cy5OT05FID0gMDtcclxuZXhwb3J0cy5ERUZMQVRFID0gMTtcclxuZXhwb3J0cy5JTkZMQVRFID0gMjtcclxuZXhwb3J0cy5HWklQID0gMztcclxuZXhwb3J0cy5HVU5aSVAgPSA0O1xyXG5leHBvcnRzLkRFRkxBVEVSQVcgPSA1O1xyXG5leHBvcnRzLklORkxBVEVSQVcgPSA2O1xyXG5leHBvcnRzLlVOWklQID0gNztcclxuXHJcbnZhciBHWklQX0hFQURFUl9JRDEgPSAweDFmO1xyXG52YXIgR1pJUF9IRUFERVJfSUQyID0gMHg4YjtcclxuXHJcbi8qKlxyXG4gKiBFbXVsYXRlIE5vZGUncyB6bGliIEMrKyBsYXllciBmb3IgdXNlIGJ5IHRoZSBKUyBsYXllciBpbiBpbmRleC5qc1xyXG4gKi9cclxuZnVuY3Rpb24gWmxpYihtb2RlKSB7XHJcbiAgaWYgKHR5cGVvZiBtb2RlICE9PSAnbnVtYmVyJyB8fCBtb2RlIDwgZXhwb3J0cy5ERUZMQVRFIHx8IG1vZGUgPiBleHBvcnRzLlVOWklQKSB7XHJcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdCYWQgYXJndW1lbnQnKTtcclxuICB9XHJcblxyXG4gIHRoaXMuZGljdGlvbmFyeSA9IG51bGw7XHJcbiAgdGhpcy5lcnIgPSAwO1xyXG4gIHRoaXMuZmx1c2ggPSAwO1xyXG4gIHRoaXMuaW5pdF9kb25lID0gZmFsc2U7XHJcbiAgdGhpcy5sZXZlbCA9IDA7XHJcbiAgdGhpcy5tZW1MZXZlbCA9IDA7XHJcbiAgdGhpcy5tb2RlID0gbW9kZTtcclxuICB0aGlzLnN0cmF0ZWd5ID0gMDtcclxuICB0aGlzLndpbmRvd0JpdHMgPSAwO1xyXG4gIHRoaXMud3JpdGVfaW5fcHJvZ3Jlc3MgPSBmYWxzZTtcclxuICB0aGlzLnBlbmRpbmdfY2xvc2UgPSBmYWxzZTtcclxuICB0aGlzLmd6aXBfaWRfYnl0ZXNfcmVhZCA9IDA7XHJcbn1cclxuXHJcblpsaWIucHJvdG90eXBlLmNsb3NlID0gZnVuY3Rpb24gKCkge1xyXG4gIGlmICh0aGlzLndyaXRlX2luX3Byb2dyZXNzKSB7XHJcbiAgICB0aGlzLnBlbmRpbmdfY2xvc2UgPSB0cnVlO1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuXHJcbiAgdGhpcy5wZW5kaW5nX2Nsb3NlID0gZmFsc2U7XHJcblxyXG4gIGFzc2VydCh0aGlzLmluaXRfZG9uZSwgJ2Nsb3NlIGJlZm9yZSBpbml0Jyk7XHJcbiAgYXNzZXJ0KHRoaXMubW9kZSA8PSBleHBvcnRzLlVOWklQKTtcclxuXHJcbiAgaWYgKHRoaXMubW9kZSA9PT0gZXhwb3J0cy5ERUZMQVRFIHx8IHRoaXMubW9kZSA9PT0gZXhwb3J0cy5HWklQIHx8IHRoaXMubW9kZSA9PT0gZXhwb3J0cy5ERUZMQVRFUkFXKSB7XHJcbiAgICB6bGliX2RlZmxhdGUuZGVmbGF0ZUVuZCh0aGlzLnN0cm0pO1xyXG4gIH0gZWxzZSBpZiAodGhpcy5tb2RlID09PSBleHBvcnRzLklORkxBVEUgfHwgdGhpcy5tb2RlID09PSBleHBvcnRzLkdVTlpJUCB8fCB0aGlzLm1vZGUgPT09IGV4cG9ydHMuSU5GTEFURVJBVyB8fCB0aGlzLm1vZGUgPT09IGV4cG9ydHMuVU5aSVApIHtcclxuICAgIHpsaWJfaW5mbGF0ZS5pbmZsYXRlRW5kKHRoaXMuc3RybSk7XHJcbiAgfVxyXG5cclxuICB0aGlzLm1vZGUgPSBleHBvcnRzLk5PTkU7XHJcblxyXG4gIHRoaXMuZGljdGlvbmFyeSA9IG51bGw7XHJcbn07XHJcblxyXG5abGliLnByb3RvdHlwZS53cml0ZSA9IGZ1bmN0aW9uIChmbHVzaCwgaW5wdXQsIGluX29mZiwgaW5fbGVuLCBvdXQsIG91dF9vZmYsIG91dF9sZW4pIHtcclxuICByZXR1cm4gdGhpcy5fd3JpdGUodHJ1ZSwgZmx1c2gsIGlucHV0LCBpbl9vZmYsIGluX2xlbiwgb3V0LCBvdXRfb2ZmLCBvdXRfbGVuKTtcclxufTtcclxuXHJcblpsaWIucHJvdG90eXBlLndyaXRlU3luYyA9IGZ1bmN0aW9uIChmbHVzaCwgaW5wdXQsIGluX29mZiwgaW5fbGVuLCBvdXQsIG91dF9vZmYsIG91dF9sZW4pIHtcclxuICByZXR1cm4gdGhpcy5fd3JpdGUoZmFsc2UsIGZsdXNoLCBpbnB1dCwgaW5fb2ZmLCBpbl9sZW4sIG91dCwgb3V0X29mZiwgb3V0X2xlbik7XHJcbn07XHJcblxyXG5abGliLnByb3RvdHlwZS5fd3JpdGUgPSBmdW5jdGlvbiAoYXN5bmMsIGZsdXNoLCBpbnB1dCwgaW5fb2ZmLCBpbl9sZW4sIG91dCwgb3V0X29mZiwgb3V0X2xlbikge1xyXG4gIGFzc2VydC5lcXVhbChhcmd1bWVudHMubGVuZ3RoLCA4KTtcclxuXHJcbiAgYXNzZXJ0KHRoaXMuaW5pdF9kb25lLCAnd3JpdGUgYmVmb3JlIGluaXQnKTtcclxuICBhc3NlcnQodGhpcy5tb2RlICE9PSBleHBvcnRzLk5PTkUsICdhbHJlYWR5IGZpbmFsaXplZCcpO1xyXG4gIGFzc2VydC5lcXVhbChmYWxzZSwgdGhpcy53cml0ZV9pbl9wcm9ncmVzcywgJ3dyaXRlIGFscmVhZHkgaW4gcHJvZ3Jlc3MnKTtcclxuICBhc3NlcnQuZXF1YWwoZmFsc2UsIHRoaXMucGVuZGluZ19jbG9zZSwgJ2Nsb3NlIGlzIHBlbmRpbmcnKTtcclxuXHJcbiAgdGhpcy53cml0ZV9pbl9wcm9ncmVzcyA9IHRydWU7XHJcblxyXG4gIGFzc2VydC5lcXVhbChmYWxzZSwgZmx1c2ggPT09IHVuZGVmaW5lZCwgJ211c3QgcHJvdmlkZSBmbHVzaCB2YWx1ZScpO1xyXG5cclxuICB0aGlzLndyaXRlX2luX3Byb2dyZXNzID0gdHJ1ZTtcclxuXHJcbiAgaWYgKGZsdXNoICE9PSBleHBvcnRzLlpfTk9fRkxVU0ggJiYgZmx1c2ggIT09IGV4cG9ydHMuWl9QQVJUSUFMX0ZMVVNIICYmIGZsdXNoICE9PSBleHBvcnRzLlpfU1lOQ19GTFVTSCAmJiBmbHVzaCAhPT0gZXhwb3J0cy5aX0ZVTExfRkxVU0ggJiYgZmx1c2ggIT09IGV4cG9ydHMuWl9GSU5JU0ggJiYgZmx1c2ggIT09IGV4cG9ydHMuWl9CTE9DSykge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGZsdXNoIHZhbHVlJyk7XHJcbiAgfVxyXG5cclxuICBpZiAoaW5wdXQgPT0gbnVsbCkge1xyXG4gICAgaW5wdXQgPSBCdWZmZXIuYWxsb2MoMCk7XHJcbiAgICBpbl9sZW4gPSAwO1xyXG4gICAgaW5fb2ZmID0gMDtcclxuICB9XHJcblxyXG4gIHRoaXMuc3RybS5hdmFpbF9pbiA9IGluX2xlbjtcclxuICB0aGlzLnN0cm0uaW5wdXQgPSBpbnB1dDtcclxuICB0aGlzLnN0cm0ubmV4dF9pbiA9IGluX29mZjtcclxuICB0aGlzLnN0cm0uYXZhaWxfb3V0ID0gb3V0X2xlbjtcclxuICB0aGlzLnN0cm0ub3V0cHV0ID0gb3V0O1xyXG4gIHRoaXMuc3RybS5uZXh0X291dCA9IG91dF9vZmY7XHJcbiAgdGhpcy5mbHVzaCA9IGZsdXNoO1xyXG5cclxuICBpZiAoIWFzeW5jKSB7XHJcbiAgICAvLyBzeW5jIHZlcnNpb25cclxuICAgIHRoaXMuX3Byb2Nlc3MoKTtcclxuXHJcbiAgICBpZiAodGhpcy5fY2hlY2tFcnJvcigpKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLl9hZnRlclN5bmMoKTtcclxuICAgIH1cclxuICAgIHJldHVybjtcclxuICB9XHJcblxyXG4gIC8vIGFzeW5jIHZlcnNpb25cclxuICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgcHJvY2Vzcy5uZXh0VGljayhmdW5jdGlvbiAoKSB7XHJcbiAgICBzZWxmLl9wcm9jZXNzKCk7XHJcbiAgICBzZWxmLl9hZnRlcigpO1xyXG4gIH0pO1xyXG5cclxuICByZXR1cm4gdGhpcztcclxufTtcclxuXHJcblpsaWIucHJvdG90eXBlLl9hZnRlclN5bmMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgdmFyIGF2YWlsX291dCA9IHRoaXMuc3RybS5hdmFpbF9vdXQ7XHJcbiAgdmFyIGF2YWlsX2luID0gdGhpcy5zdHJtLmF2YWlsX2luO1xyXG5cclxuICB0aGlzLndyaXRlX2luX3Byb2dyZXNzID0gZmFsc2U7XHJcblxyXG4gIHJldHVybiBbYXZhaWxfaW4sIGF2YWlsX291dF07XHJcbn07XHJcblxyXG5abGliLnByb3RvdHlwZS5fcHJvY2VzcyA9IGZ1bmN0aW9uICgpIHtcclxuICB2YXIgbmV4dF9leHBlY3RlZF9oZWFkZXJfYnl0ZSA9IG51bGw7XHJcblxyXG4gIC8vIElmIHRoZSBhdmFpbF9vdXQgaXMgbGVmdCBhdCAwLCB0aGVuIGl0IG1lYW5zIHRoYXQgaXQgcmFuIG91dFxyXG4gIC8vIG9mIHJvb20uICBJZiB0aGVyZSB3YXMgYXZhaWxfb3V0IGxlZnQgb3ZlciwgdGhlbiBpdCBtZWFuc1xyXG4gIC8vIHRoYXQgYWxsIG9mIHRoZSBpbnB1dCB3YXMgY29uc3VtZWQuXHJcbiAgc3dpdGNoICh0aGlzLm1vZGUpIHtcclxuICAgIGNhc2UgZXhwb3J0cy5ERUZMQVRFOlxyXG4gICAgY2FzZSBleHBvcnRzLkdaSVA6XHJcbiAgICBjYXNlIGV4cG9ydHMuREVGTEFURVJBVzpcclxuICAgICAgdGhpcy5lcnIgPSB6bGliX2RlZmxhdGUuZGVmbGF0ZSh0aGlzLnN0cm0sIHRoaXMuZmx1c2gpO1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgZXhwb3J0cy5VTlpJUDpcclxuICAgICAgaWYgKHRoaXMuc3RybS5hdmFpbF9pbiA+IDApIHtcclxuICAgICAgICBuZXh0X2V4cGVjdGVkX2hlYWRlcl9ieXRlID0gdGhpcy5zdHJtLm5leHRfaW47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHN3aXRjaCAodGhpcy5nemlwX2lkX2J5dGVzX3JlYWQpIHtcclxuICAgICAgICBjYXNlIDA6XHJcbiAgICAgICAgICBpZiAobmV4dF9leHBlY3RlZF9oZWFkZXJfYnl0ZSA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBpZiAodGhpcy5zdHJtLmlucHV0W25leHRfZXhwZWN0ZWRfaGVhZGVyX2J5dGVdID09PSBHWklQX0hFQURFUl9JRDEpIHtcclxuICAgICAgICAgICAgdGhpcy5nemlwX2lkX2J5dGVzX3JlYWQgPSAxO1xyXG4gICAgICAgICAgICBuZXh0X2V4cGVjdGVkX2hlYWRlcl9ieXRlKys7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5zdHJtLmF2YWlsX2luID09PSAxKSB7XHJcbiAgICAgICAgICAgICAgLy8gVGhlIG9ubHkgYXZhaWxhYmxlIGJ5dGUgd2FzIGFscmVhZHkgcmVhZC5cclxuICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5tb2RlID0gZXhwb3J0cy5JTkZMQVRFO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gZmFsbHRocm91Z2hcclxuICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICBpZiAobmV4dF9leHBlY3RlZF9oZWFkZXJfYnl0ZSA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBpZiAodGhpcy5zdHJtLmlucHV0W25leHRfZXhwZWN0ZWRfaGVhZGVyX2J5dGVdID09PSBHWklQX0hFQURFUl9JRDIpIHtcclxuICAgICAgICAgICAgdGhpcy5nemlwX2lkX2J5dGVzX3JlYWQgPSAyO1xyXG4gICAgICAgICAgICB0aGlzLm1vZGUgPSBleHBvcnRzLkdVTlpJUDtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIFRoZXJlIGlzIG5vIGFjdHVhbCBkaWZmZXJlbmNlIGJldHdlZW4gSU5GTEFURSBhbmQgSU5GTEFURVJBV1xyXG4gICAgICAgICAgICAvLyAoYWZ0ZXIgaW5pdGlhbGl6YXRpb24pLlxyXG4gICAgICAgICAgICB0aGlzLm1vZGUgPSBleHBvcnRzLklORkxBVEU7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCBudW1iZXIgb2YgZ3ppcCBtYWdpYyBudW1iZXIgYnl0ZXMgcmVhZCcpO1xyXG4gICAgICB9XHJcblxyXG4gICAgLy8gZmFsbHRocm91Z2hcclxuICAgIGNhc2UgZXhwb3J0cy5JTkZMQVRFOlxyXG4gICAgY2FzZSBleHBvcnRzLkdVTlpJUDpcclxuICAgIGNhc2UgZXhwb3J0cy5JTkZMQVRFUkFXOlxyXG4gICAgICB0aGlzLmVyciA9IHpsaWJfaW5mbGF0ZS5pbmZsYXRlKHRoaXMuc3RybSwgdGhpcy5mbHVzaFxyXG5cclxuICAgICAgLy8gSWYgZGF0YSB3YXMgZW5jb2RlZCB3aXRoIGRpY3Rpb25hcnlcclxuICAgICAgKTtpZiAodGhpcy5lcnIgPT09IGV4cG9ydHMuWl9ORUVEX0RJQ1QgJiYgdGhpcy5kaWN0aW9uYXJ5KSB7XHJcbiAgICAgICAgLy8gTG9hZCBpdFxyXG4gICAgICAgIHRoaXMuZXJyID0gemxpYl9pbmZsYXRlLmluZmxhdGVTZXREaWN0aW9uYXJ5KHRoaXMuc3RybSwgdGhpcy5kaWN0aW9uYXJ5KTtcclxuICAgICAgICBpZiAodGhpcy5lcnIgPT09IGV4cG9ydHMuWl9PSykge1xyXG4gICAgICAgICAgLy8gQW5kIHRyeSB0byBkZWNvZGUgYWdhaW5cclxuICAgICAgICAgIHRoaXMuZXJyID0gemxpYl9pbmZsYXRlLmluZmxhdGUodGhpcy5zdHJtLCB0aGlzLmZsdXNoKTtcclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuZXJyID09PSBleHBvcnRzLlpfREFUQV9FUlJPUikge1xyXG4gICAgICAgICAgLy8gQm90aCBpbmZsYXRlU2V0RGljdGlvbmFyeSgpIGFuZCBpbmZsYXRlKCkgcmV0dXJuIFpfREFUQV9FUlJPUi5cclxuICAgICAgICAgIC8vIE1ha2UgaXQgcG9zc2libGUgZm9yIEFmdGVyKCkgdG8gdGVsbCBhIGJhZCBkaWN0aW9uYXJ5IGZyb20gYmFkXHJcbiAgICAgICAgICAvLyBpbnB1dC5cclxuICAgICAgICAgIHRoaXMuZXJyID0gZXhwb3J0cy5aX05FRURfRElDVDtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgd2hpbGUgKHRoaXMuc3RybS5hdmFpbF9pbiA+IDAgJiYgdGhpcy5tb2RlID09PSBleHBvcnRzLkdVTlpJUCAmJiB0aGlzLmVyciA9PT0gZXhwb3J0cy5aX1NUUkVBTV9FTkQgJiYgdGhpcy5zdHJtLm5leHRfaW5bMF0gIT09IDB4MDApIHtcclxuICAgICAgICAvLyBCeXRlcyByZW1haW4gaW4gaW5wdXQgYnVmZmVyLiBQZXJoYXBzIHRoaXMgaXMgYW5vdGhlciBjb21wcmVzc2VkXHJcbiAgICAgICAgLy8gbWVtYmVyIGluIHRoZSBzYW1lIGFyY2hpdmUsIG9yIGp1c3QgdHJhaWxpbmcgZ2FyYmFnZS5cclxuICAgICAgICAvLyBUcmFpbGluZyB6ZXJvIGJ5dGVzIGFyZSBva2F5LCB0aG91Z2gsIHNpbmNlIHRoZXkgYXJlIGZyZXF1ZW50bHlcclxuICAgICAgICAvLyB1c2VkIGZvciBwYWRkaW5nLlxyXG5cclxuICAgICAgICB0aGlzLnJlc2V0KCk7XHJcbiAgICAgICAgdGhpcy5lcnIgPSB6bGliX2luZmxhdGUuaW5mbGF0ZSh0aGlzLnN0cm0sIHRoaXMuZmx1c2gpO1xyXG4gICAgICB9XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgZGVmYXVsdDpcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIG1vZGUgJyArIHRoaXMubW9kZSk7XHJcbiAgfVxyXG59O1xyXG5cclxuWmxpYi5wcm90b3R5cGUuX2NoZWNrRXJyb3IgPSBmdW5jdGlvbiAoKSB7XHJcbiAgLy8gQWNjZXB0YWJsZSBlcnJvciBzdGF0ZXMgZGVwZW5kIG9uIHRoZSB0eXBlIG9mIHpsaWIgc3RyZWFtLlxyXG4gIHN3aXRjaCAodGhpcy5lcnIpIHtcclxuICAgIGNhc2UgZXhwb3J0cy5aX09LOlxyXG4gICAgY2FzZSBleHBvcnRzLlpfQlVGX0VSUk9SOlxyXG4gICAgICBpZiAodGhpcy5zdHJtLmF2YWlsX291dCAhPT0gMCAmJiB0aGlzLmZsdXNoID09PSBleHBvcnRzLlpfRklOSVNIKSB7XHJcbiAgICAgICAgdGhpcy5fZXJyb3IoJ3VuZXhwZWN0ZWQgZW5kIG9mIGZpbGUnKTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH1cclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlIGV4cG9ydHMuWl9TVFJFQU1fRU5EOlxyXG4gICAgICAvLyBub3JtYWwgc3RhdHVzZXMsIG5vdCBmYXRhbFxyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgZXhwb3J0cy5aX05FRURfRElDVDpcclxuICAgICAgaWYgKHRoaXMuZGljdGlvbmFyeSA9PSBudWxsKSB7XHJcbiAgICAgICAgdGhpcy5fZXJyb3IoJ01pc3NpbmcgZGljdGlvbmFyeScpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuX2Vycm9yKCdCYWQgZGljdGlvbmFyeScpO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIGRlZmF1bHQ6XHJcbiAgICAgIC8vIHNvbWV0aGluZyBlbHNlLlxyXG4gICAgICB0aGlzLl9lcnJvcignWmxpYiBlcnJvcicpO1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gdHJ1ZTtcclxufTtcclxuXHJcblpsaWIucHJvdG90eXBlLl9hZnRlciA9IGZ1bmN0aW9uICgpIHtcclxuICBpZiAoIXRoaXMuX2NoZWNrRXJyb3IoKSkge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuXHJcbiAgdmFyIGF2YWlsX291dCA9IHRoaXMuc3RybS5hdmFpbF9vdXQ7XHJcbiAgdmFyIGF2YWlsX2luID0gdGhpcy5zdHJtLmF2YWlsX2luO1xyXG5cclxuICB0aGlzLndyaXRlX2luX3Byb2dyZXNzID0gZmFsc2U7XHJcblxyXG4gIC8vIGNhbGwgdGhlIHdyaXRlKCkgY2JcclxuICB0aGlzLmNhbGxiYWNrKGF2YWlsX2luLCBhdmFpbF9vdXQpO1xyXG5cclxuICBpZiAodGhpcy5wZW5kaW5nX2Nsb3NlKSB7XHJcbiAgICB0aGlzLmNsb3NlKCk7XHJcbiAgfVxyXG59O1xyXG5cclxuWmxpYi5wcm90b3R5cGUuX2Vycm9yID0gZnVuY3Rpb24gKG1lc3NhZ2UpIHtcclxuICBpZiAodGhpcy5zdHJtLm1zZykge1xyXG4gICAgbWVzc2FnZSA9IHRoaXMuc3RybS5tc2c7XHJcbiAgfVxyXG4gIHRoaXMub25lcnJvcihtZXNzYWdlLCB0aGlzLmVyclxyXG5cclxuICAvLyBubyBob3BlIG9mIHJlc2N1ZS5cclxuICApO3RoaXMud3JpdGVfaW5fcHJvZ3Jlc3MgPSBmYWxzZTtcclxuICBpZiAodGhpcy5wZW5kaW5nX2Nsb3NlKSB7XHJcbiAgICB0aGlzLmNsb3NlKCk7XHJcbiAgfVxyXG59O1xyXG5cclxuWmxpYi5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uICh3aW5kb3dCaXRzLCBsZXZlbCwgbWVtTGV2ZWwsIHN0cmF0ZWd5LCBkaWN0aW9uYXJ5KSB7XHJcbiAgYXNzZXJ0KGFyZ3VtZW50cy5sZW5ndGggPT09IDQgfHwgYXJndW1lbnRzLmxlbmd0aCA9PT0gNSwgJ2luaXQod2luZG93Qml0cywgbGV2ZWwsIG1lbUxldmVsLCBzdHJhdGVneSwgW2RpY3Rpb25hcnldKScpO1xyXG5cclxuICBhc3NlcnQod2luZG93Qml0cyA+PSA4ICYmIHdpbmRvd0JpdHMgPD0gMTUsICdpbnZhbGlkIHdpbmRvd0JpdHMnKTtcclxuICBhc3NlcnQobGV2ZWwgPj0gLTEgJiYgbGV2ZWwgPD0gOSwgJ2ludmFsaWQgY29tcHJlc3Npb24gbGV2ZWwnKTtcclxuXHJcbiAgYXNzZXJ0KG1lbUxldmVsID49IDEgJiYgbWVtTGV2ZWwgPD0gOSwgJ2ludmFsaWQgbWVtbGV2ZWwnKTtcclxuXHJcbiAgYXNzZXJ0KHN0cmF0ZWd5ID09PSBleHBvcnRzLlpfRklMVEVSRUQgfHwgc3RyYXRlZ3kgPT09IGV4cG9ydHMuWl9IVUZGTUFOX09OTFkgfHwgc3RyYXRlZ3kgPT09IGV4cG9ydHMuWl9STEUgfHwgc3RyYXRlZ3kgPT09IGV4cG9ydHMuWl9GSVhFRCB8fCBzdHJhdGVneSA9PT0gZXhwb3J0cy5aX0RFRkFVTFRfU1RSQVRFR1ksICdpbnZhbGlkIHN0cmF0ZWd5Jyk7XHJcblxyXG4gIHRoaXMuX2luaXQobGV2ZWwsIHdpbmRvd0JpdHMsIG1lbUxldmVsLCBzdHJhdGVneSwgZGljdGlvbmFyeSk7XHJcbiAgdGhpcy5fc2V0RGljdGlvbmFyeSgpO1xyXG59O1xyXG5cclxuWmxpYi5wcm90b3R5cGUucGFyYW1zID0gZnVuY3Rpb24gKCkge1xyXG4gIHRocm93IG5ldyBFcnJvcignZGVmbGF0ZVBhcmFtcyBOb3Qgc3VwcG9ydGVkJyk7XHJcbn07XHJcblxyXG5abGliLnByb3RvdHlwZS5yZXNldCA9IGZ1bmN0aW9uICgpIHtcclxuICB0aGlzLl9yZXNldCgpO1xyXG4gIHRoaXMuX3NldERpY3Rpb25hcnkoKTtcclxufTtcclxuXHJcblpsaWIucHJvdG90eXBlLl9pbml0ID0gZnVuY3Rpb24gKGxldmVsLCB3aW5kb3dCaXRzLCBtZW1MZXZlbCwgc3RyYXRlZ3ksIGRpY3Rpb25hcnkpIHtcclxuICB0aGlzLmxldmVsID0gbGV2ZWw7XHJcbiAgdGhpcy53aW5kb3dCaXRzID0gd2luZG93Qml0cztcclxuICB0aGlzLm1lbUxldmVsID0gbWVtTGV2ZWw7XHJcbiAgdGhpcy5zdHJhdGVneSA9IHN0cmF0ZWd5O1xyXG5cclxuICB0aGlzLmZsdXNoID0gZXhwb3J0cy5aX05PX0ZMVVNIO1xyXG5cclxuICB0aGlzLmVyciA9IGV4cG9ydHMuWl9PSztcclxuXHJcbiAgaWYgKHRoaXMubW9kZSA9PT0gZXhwb3J0cy5HWklQIHx8IHRoaXMubW9kZSA9PT0gZXhwb3J0cy5HVU5aSVApIHtcclxuICAgIHRoaXMud2luZG93Qml0cyArPSAxNjtcclxuICB9XHJcblxyXG4gIGlmICh0aGlzLm1vZGUgPT09IGV4cG9ydHMuVU5aSVApIHtcclxuICAgIHRoaXMud2luZG93Qml0cyArPSAzMjtcclxuICB9XHJcblxyXG4gIGlmICh0aGlzLm1vZGUgPT09IGV4cG9ydHMuREVGTEFURVJBVyB8fCB0aGlzLm1vZGUgPT09IGV4cG9ydHMuSU5GTEFURVJBVykge1xyXG4gICAgdGhpcy53aW5kb3dCaXRzID0gLTEgKiB0aGlzLndpbmRvd0JpdHM7XHJcbiAgfVxyXG5cclxuICB0aGlzLnN0cm0gPSBuZXcgWnN0cmVhbSgpO1xyXG5cclxuICBzd2l0Y2ggKHRoaXMubW9kZSkge1xyXG4gICAgY2FzZSBleHBvcnRzLkRFRkxBVEU6XHJcbiAgICBjYXNlIGV4cG9ydHMuR1pJUDpcclxuICAgIGNhc2UgZXhwb3J0cy5ERUZMQVRFUkFXOlxyXG4gICAgICB0aGlzLmVyciA9IHpsaWJfZGVmbGF0ZS5kZWZsYXRlSW5pdDIodGhpcy5zdHJtLCB0aGlzLmxldmVsLCBleHBvcnRzLlpfREVGTEFURUQsIHRoaXMud2luZG93Qml0cywgdGhpcy5tZW1MZXZlbCwgdGhpcy5zdHJhdGVneSk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSBleHBvcnRzLklORkxBVEU6XHJcbiAgICBjYXNlIGV4cG9ydHMuR1VOWklQOlxyXG4gICAgY2FzZSBleHBvcnRzLklORkxBVEVSQVc6XHJcbiAgICBjYXNlIGV4cG9ydHMuVU5aSVA6XHJcbiAgICAgIHRoaXMuZXJyID0gemxpYl9pbmZsYXRlLmluZmxhdGVJbml0Mih0aGlzLnN0cm0sIHRoaXMud2luZG93Qml0cyk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgZGVmYXVsdDpcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIG1vZGUgJyArIHRoaXMubW9kZSk7XHJcbiAgfVxyXG5cclxuICBpZiAodGhpcy5lcnIgIT09IGV4cG9ydHMuWl9PSykge1xyXG4gICAgdGhpcy5fZXJyb3IoJ0luaXQgZXJyb3InKTtcclxuICB9XHJcblxyXG4gIHRoaXMuZGljdGlvbmFyeSA9IGRpY3Rpb25hcnk7XHJcblxyXG4gIHRoaXMud3JpdGVfaW5fcHJvZ3Jlc3MgPSBmYWxzZTtcclxuICB0aGlzLmluaXRfZG9uZSA9IHRydWU7XHJcbn07XHJcblxyXG5abGliLnByb3RvdHlwZS5fc2V0RGljdGlvbmFyeSA9IGZ1bmN0aW9uICgpIHtcclxuICBpZiAodGhpcy5kaWN0aW9uYXJ5ID09IG51bGwpIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcblxyXG4gIHRoaXMuZXJyID0gZXhwb3J0cy5aX09LO1xyXG5cclxuICBzd2l0Y2ggKHRoaXMubW9kZSkge1xyXG4gICAgY2FzZSBleHBvcnRzLkRFRkxBVEU6XHJcbiAgICBjYXNlIGV4cG9ydHMuREVGTEFURVJBVzpcclxuICAgICAgdGhpcy5lcnIgPSB6bGliX2RlZmxhdGUuZGVmbGF0ZVNldERpY3Rpb25hcnkodGhpcy5zdHJtLCB0aGlzLmRpY3Rpb25hcnkpO1xyXG4gICAgICBicmVhaztcclxuICAgIGRlZmF1bHQ6XHJcbiAgICAgIGJyZWFrO1xyXG4gIH1cclxuXHJcbiAgaWYgKHRoaXMuZXJyICE9PSBleHBvcnRzLlpfT0spIHtcclxuICAgIHRoaXMuX2Vycm9yKCdGYWlsZWQgdG8gc2V0IGRpY3Rpb25hcnknKTtcclxuICB9XHJcbn07XHJcblxyXG5abGliLnByb3RvdHlwZS5fcmVzZXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgdGhpcy5lcnIgPSBleHBvcnRzLlpfT0s7XHJcblxyXG4gIHN3aXRjaCAodGhpcy5tb2RlKSB7XHJcbiAgICBjYXNlIGV4cG9ydHMuREVGTEFURTpcclxuICAgIGNhc2UgZXhwb3J0cy5ERUZMQVRFUkFXOlxyXG4gICAgY2FzZSBleHBvcnRzLkdaSVA6XHJcbiAgICAgIHRoaXMuZXJyID0gemxpYl9kZWZsYXRlLmRlZmxhdGVSZXNldCh0aGlzLnN0cm0pO1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgZXhwb3J0cy5JTkZMQVRFOlxyXG4gICAgY2FzZSBleHBvcnRzLklORkxBVEVSQVc6XHJcbiAgICBjYXNlIGV4cG9ydHMuR1VOWklQOlxyXG4gICAgICB0aGlzLmVyciA9IHpsaWJfaW5mbGF0ZS5pbmZsYXRlUmVzZXQodGhpcy5zdHJtKTtcclxuICAgICAgYnJlYWs7XHJcbiAgICBkZWZhdWx0OlxyXG4gICAgICBicmVhaztcclxuICB9XHJcblxyXG4gIGlmICh0aGlzLmVyciAhPT0gZXhwb3J0cy5aX09LKSB7XHJcbiAgICB0aGlzLl9lcnJvcignRmFpbGVkIHRvIHJlc2V0IHN0cmVhbScpO1xyXG4gIH1cclxufTtcclxuXHJcbmV4cG9ydHMuWmxpYiA9IFpsaWI7Il0sInNvdXJjZVJvb3QiOiIifQ==