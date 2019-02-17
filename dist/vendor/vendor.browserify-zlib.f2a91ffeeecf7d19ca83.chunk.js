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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS16bGliL2xpYi9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS16bGliL2xpYi9iaW5kaW5nLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSwrQ0FBYTs7QUFFYixhQUFhLG1CQUFPLENBQUMsb0JBQVE7QUFDN0IsZ0JBQWdCLG1CQUFPLENBQUMsb0JBQVE7QUFDaEMsY0FBYyxtQkFBTyxDQUFDLHVCQUFXO0FBQ2pDLFdBQVcsbUJBQU8sQ0FBQyxrQkFBTTtBQUN6QixhQUFhLG1CQUFPLENBQUMsb0JBQVE7QUFDN0IsaUJBQWlCLG1CQUFPLENBQUMsb0JBQVE7QUFDakM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZ0JBQWdCLG1CQUFtQjtBQUNuQztBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGdCQUFnQixtQkFBbUI7QUFDbkM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOENBQThDO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBc0I7QUFDdEIsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQjs7QUFFbEI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSxpQ0FBaUM7QUFDakM7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJCOzs7Ozs7Ozs7Ozs7O0FDaG1CQSx1REFBYTtBQUNiOztBQUVBLGFBQWEsbUJBQU8sQ0FBQyxvQkFBUTs7QUFFN0IsY0FBYyxtQkFBTyxDQUFDLG1DQUF1QjtBQUM3QyxtQkFBbUIsbUJBQU8sQ0FBQyxzQ0FBMEI7QUFDckQsbUJBQW1CLG1CQUFPLENBQUMsc0NBQTBCO0FBQ3JELGdCQUFnQixtQkFBTyxDQUFDLHFDQUF5Qjs7QUFFakQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLG9CIiwiZmlsZSI6InZlbmRvci92ZW5kb3IuYnJvd3NlcmlmeS16bGliLmYyYTkxZmZlZWVjZjdkMTljYTgzLmNodW5rLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG52YXIgQnVmZmVyID0gcmVxdWlyZSgnYnVmZmVyJykuQnVmZmVyO1xudmFyIFRyYW5zZm9ybSA9IHJlcXVpcmUoJ3N0cmVhbScpLlRyYW5zZm9ybTtcbnZhciBiaW5kaW5nID0gcmVxdWlyZSgnLi9iaW5kaW5nJyk7XG52YXIgdXRpbCA9IHJlcXVpcmUoJ3V0aWwnKTtcbnZhciBhc3NlcnQgPSByZXF1aXJlKCdhc3NlcnQnKS5vaztcbnZhciBrTWF4TGVuZ3RoID0gcmVxdWlyZSgnYnVmZmVyJykua01heExlbmd0aDtcbnZhciBrUmFuZ2VFcnJvck1lc3NhZ2UgPSAnQ2Fubm90IGNyZWF0ZSBmaW5hbCBCdWZmZXIuIEl0IHdvdWxkIGJlIGxhcmdlciAnICsgJ3RoYW4gMHgnICsga01heExlbmd0aC50b1N0cmluZygxNikgKyAnIGJ5dGVzJztcblxuLy8gemxpYiBkb2Vzbid0IHByb3ZpZGUgdGhlc2UsIHNvIGtsdWRnZSB0aGVtIGluIGZvbGxvd2luZyB0aGUgc2FtZVxuLy8gY29uc3QgbmFtaW5nIHNjaGVtZSB6bGliIHVzZXMuXG5iaW5kaW5nLlpfTUlOX1dJTkRPV0JJVFMgPSA4O1xuYmluZGluZy5aX01BWF9XSU5ET1dCSVRTID0gMTU7XG5iaW5kaW5nLlpfREVGQVVMVF9XSU5ET1dCSVRTID0gMTU7XG5cbi8vIGZld2VyIHRoYW4gNjQgYnl0ZXMgcGVyIGNodW5rIGlzIHN0dXBpZC5cbi8vIHRlY2huaWNhbGx5IGl0IGNvdWxkIHdvcmsgd2l0aCBhcyBmZXcgYXMgOCwgYnV0IGV2ZW4gNjQgYnl0ZXNcbi8vIGlzIGFic3VyZGx5IGxvdy4gIFVzdWFsbHkgYSBNQiBvciBtb3JlIGlzIGJlc3QuXG5iaW5kaW5nLlpfTUlOX0NIVU5LID0gNjQ7XG5iaW5kaW5nLlpfTUFYX0NIVU5LID0gSW5maW5pdHk7XG5iaW5kaW5nLlpfREVGQVVMVF9DSFVOSyA9IDE2ICogMTAyNDtcblxuYmluZGluZy5aX01JTl9NRU1MRVZFTCA9IDE7XG5iaW5kaW5nLlpfTUFYX01FTUxFVkVMID0gOTtcbmJpbmRpbmcuWl9ERUZBVUxUX01FTUxFVkVMID0gODtcblxuYmluZGluZy5aX01JTl9MRVZFTCA9IC0xO1xuYmluZGluZy5aX01BWF9MRVZFTCA9IDk7XG5iaW5kaW5nLlpfREVGQVVMVF9MRVZFTCA9IGJpbmRpbmcuWl9ERUZBVUxUX0NPTVBSRVNTSU9OO1xuXG4vLyBleHBvc2UgYWxsIHRoZSB6bGliIGNvbnN0YW50c1xudmFyIGJrZXlzID0gT2JqZWN0LmtleXMoYmluZGluZyk7XG5mb3IgKHZhciBiayA9IDA7IGJrIDwgYmtleXMubGVuZ3RoOyBiaysrKSB7XG4gIHZhciBia2V5ID0gYmtleXNbYmtdO1xuICBpZiAoYmtleS5tYXRjaCgvXlovKSkge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBia2V5LCB7XG4gICAgICBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogYmluZGluZ1tia2V5XSwgd3JpdGFibGU6IGZhbHNlXG4gICAgfSk7XG4gIH1cbn1cblxuLy8gdHJhbnNsYXRpb24gdGFibGUgZm9yIHJldHVybiBjb2Rlcy5cbnZhciBjb2RlcyA9IHtcbiAgWl9PSzogYmluZGluZy5aX09LLFxuICBaX1NUUkVBTV9FTkQ6IGJpbmRpbmcuWl9TVFJFQU1fRU5ELFxuICBaX05FRURfRElDVDogYmluZGluZy5aX05FRURfRElDVCxcbiAgWl9FUlJOTzogYmluZGluZy5aX0VSUk5PLFxuICBaX1NUUkVBTV9FUlJPUjogYmluZGluZy5aX1NUUkVBTV9FUlJPUixcbiAgWl9EQVRBX0VSUk9SOiBiaW5kaW5nLlpfREFUQV9FUlJPUixcbiAgWl9NRU1fRVJST1I6IGJpbmRpbmcuWl9NRU1fRVJST1IsXG4gIFpfQlVGX0VSUk9SOiBiaW5kaW5nLlpfQlVGX0VSUk9SLFxuICBaX1ZFUlNJT05fRVJST1I6IGJpbmRpbmcuWl9WRVJTSU9OX0VSUk9SXG59O1xuXG52YXIgY2tleXMgPSBPYmplY3Qua2V5cyhjb2Rlcyk7XG5mb3IgKHZhciBjayA9IDA7IGNrIDwgY2tleXMubGVuZ3RoOyBjaysrKSB7XG4gIHZhciBja2V5ID0gY2tleXNbY2tdO1xuICBjb2Rlc1tjb2Rlc1tja2V5XV0gPSBja2V5O1xufVxuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2NvZGVzJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogT2JqZWN0LmZyZWV6ZShjb2RlcyksIHdyaXRhYmxlOiBmYWxzZVxufSk7XG5cbmV4cG9ydHMuRGVmbGF0ZSA9IERlZmxhdGU7XG5leHBvcnRzLkluZmxhdGUgPSBJbmZsYXRlO1xuZXhwb3J0cy5HemlwID0gR3ppcDtcbmV4cG9ydHMuR3VuemlwID0gR3VuemlwO1xuZXhwb3J0cy5EZWZsYXRlUmF3ID0gRGVmbGF0ZVJhdztcbmV4cG9ydHMuSW5mbGF0ZVJhdyA9IEluZmxhdGVSYXc7XG5leHBvcnRzLlVuemlwID0gVW56aXA7XG5cbmV4cG9ydHMuY3JlYXRlRGVmbGF0ZSA9IGZ1bmN0aW9uIChvKSB7XG4gIHJldHVybiBuZXcgRGVmbGF0ZShvKTtcbn07XG5cbmV4cG9ydHMuY3JlYXRlSW5mbGF0ZSA9IGZ1bmN0aW9uIChvKSB7XG4gIHJldHVybiBuZXcgSW5mbGF0ZShvKTtcbn07XG5cbmV4cG9ydHMuY3JlYXRlRGVmbGF0ZVJhdyA9IGZ1bmN0aW9uIChvKSB7XG4gIHJldHVybiBuZXcgRGVmbGF0ZVJhdyhvKTtcbn07XG5cbmV4cG9ydHMuY3JlYXRlSW5mbGF0ZVJhdyA9IGZ1bmN0aW9uIChvKSB7XG4gIHJldHVybiBuZXcgSW5mbGF0ZVJhdyhvKTtcbn07XG5cbmV4cG9ydHMuY3JlYXRlR3ppcCA9IGZ1bmN0aW9uIChvKSB7XG4gIHJldHVybiBuZXcgR3ppcChvKTtcbn07XG5cbmV4cG9ydHMuY3JlYXRlR3VuemlwID0gZnVuY3Rpb24gKG8pIHtcbiAgcmV0dXJuIG5ldyBHdW56aXAobyk7XG59O1xuXG5leHBvcnRzLmNyZWF0ZVVuemlwID0gZnVuY3Rpb24gKG8pIHtcbiAgcmV0dXJuIG5ldyBVbnppcChvKTtcbn07XG5cbi8vIENvbnZlbmllbmNlIG1ldGhvZHMuXG4vLyBjb21wcmVzcy9kZWNvbXByZXNzIGEgc3RyaW5nIG9yIGJ1ZmZlciBpbiBvbmUgc3RlcC5cbmV4cG9ydHMuZGVmbGF0ZSA9IGZ1bmN0aW9uIChidWZmZXIsIG9wdHMsIGNhbGxiYWNrKSB7XG4gIGlmICh0eXBlb2Ygb3B0cyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGNhbGxiYWNrID0gb3B0cztcbiAgICBvcHRzID0ge307XG4gIH1cbiAgcmV0dXJuIHpsaWJCdWZmZXIobmV3IERlZmxhdGUob3B0cyksIGJ1ZmZlciwgY2FsbGJhY2spO1xufTtcblxuZXhwb3J0cy5kZWZsYXRlU3luYyA9IGZ1bmN0aW9uIChidWZmZXIsIG9wdHMpIHtcbiAgcmV0dXJuIHpsaWJCdWZmZXJTeW5jKG5ldyBEZWZsYXRlKG9wdHMpLCBidWZmZXIpO1xufTtcblxuZXhwb3J0cy5nemlwID0gZnVuY3Rpb24gKGJ1ZmZlciwgb3B0cywgY2FsbGJhY2spIHtcbiAgaWYgKHR5cGVvZiBvcHRzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgY2FsbGJhY2sgPSBvcHRzO1xuICAgIG9wdHMgPSB7fTtcbiAgfVxuICByZXR1cm4gemxpYkJ1ZmZlcihuZXcgR3ppcChvcHRzKSwgYnVmZmVyLCBjYWxsYmFjayk7XG59O1xuXG5leHBvcnRzLmd6aXBTeW5jID0gZnVuY3Rpb24gKGJ1ZmZlciwgb3B0cykge1xuICByZXR1cm4gemxpYkJ1ZmZlclN5bmMobmV3IEd6aXAob3B0cyksIGJ1ZmZlcik7XG59O1xuXG5leHBvcnRzLmRlZmxhdGVSYXcgPSBmdW5jdGlvbiAoYnVmZmVyLCBvcHRzLCBjYWxsYmFjaykge1xuICBpZiAodHlwZW9mIG9wdHMgPT09ICdmdW5jdGlvbicpIHtcbiAgICBjYWxsYmFjayA9IG9wdHM7XG4gICAgb3B0cyA9IHt9O1xuICB9XG4gIHJldHVybiB6bGliQnVmZmVyKG5ldyBEZWZsYXRlUmF3KG9wdHMpLCBidWZmZXIsIGNhbGxiYWNrKTtcbn07XG5cbmV4cG9ydHMuZGVmbGF0ZVJhd1N5bmMgPSBmdW5jdGlvbiAoYnVmZmVyLCBvcHRzKSB7XG4gIHJldHVybiB6bGliQnVmZmVyU3luYyhuZXcgRGVmbGF0ZVJhdyhvcHRzKSwgYnVmZmVyKTtcbn07XG5cbmV4cG9ydHMudW56aXAgPSBmdW5jdGlvbiAoYnVmZmVyLCBvcHRzLCBjYWxsYmFjaykge1xuICBpZiAodHlwZW9mIG9wdHMgPT09ICdmdW5jdGlvbicpIHtcbiAgICBjYWxsYmFjayA9IG9wdHM7XG4gICAgb3B0cyA9IHt9O1xuICB9XG4gIHJldHVybiB6bGliQnVmZmVyKG5ldyBVbnppcChvcHRzKSwgYnVmZmVyLCBjYWxsYmFjayk7XG59O1xuXG5leHBvcnRzLnVuemlwU3luYyA9IGZ1bmN0aW9uIChidWZmZXIsIG9wdHMpIHtcbiAgcmV0dXJuIHpsaWJCdWZmZXJTeW5jKG5ldyBVbnppcChvcHRzKSwgYnVmZmVyKTtcbn07XG5cbmV4cG9ydHMuaW5mbGF0ZSA9IGZ1bmN0aW9uIChidWZmZXIsIG9wdHMsIGNhbGxiYWNrKSB7XG4gIGlmICh0eXBlb2Ygb3B0cyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGNhbGxiYWNrID0gb3B0cztcbiAgICBvcHRzID0ge307XG4gIH1cbiAgcmV0dXJuIHpsaWJCdWZmZXIobmV3IEluZmxhdGUob3B0cyksIGJ1ZmZlciwgY2FsbGJhY2spO1xufTtcblxuZXhwb3J0cy5pbmZsYXRlU3luYyA9IGZ1bmN0aW9uIChidWZmZXIsIG9wdHMpIHtcbiAgcmV0dXJuIHpsaWJCdWZmZXJTeW5jKG5ldyBJbmZsYXRlKG9wdHMpLCBidWZmZXIpO1xufTtcblxuZXhwb3J0cy5ndW56aXAgPSBmdW5jdGlvbiAoYnVmZmVyLCBvcHRzLCBjYWxsYmFjaykge1xuICBpZiAodHlwZW9mIG9wdHMgPT09ICdmdW5jdGlvbicpIHtcbiAgICBjYWxsYmFjayA9IG9wdHM7XG4gICAgb3B0cyA9IHt9O1xuICB9XG4gIHJldHVybiB6bGliQnVmZmVyKG5ldyBHdW56aXAob3B0cyksIGJ1ZmZlciwgY2FsbGJhY2spO1xufTtcblxuZXhwb3J0cy5ndW56aXBTeW5jID0gZnVuY3Rpb24gKGJ1ZmZlciwgb3B0cykge1xuICByZXR1cm4gemxpYkJ1ZmZlclN5bmMobmV3IEd1bnppcChvcHRzKSwgYnVmZmVyKTtcbn07XG5cbmV4cG9ydHMuaW5mbGF0ZVJhdyA9IGZ1bmN0aW9uIChidWZmZXIsIG9wdHMsIGNhbGxiYWNrKSB7XG4gIGlmICh0eXBlb2Ygb3B0cyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGNhbGxiYWNrID0gb3B0cztcbiAgICBvcHRzID0ge307XG4gIH1cbiAgcmV0dXJuIHpsaWJCdWZmZXIobmV3IEluZmxhdGVSYXcob3B0cyksIGJ1ZmZlciwgY2FsbGJhY2spO1xufTtcblxuZXhwb3J0cy5pbmZsYXRlUmF3U3luYyA9IGZ1bmN0aW9uIChidWZmZXIsIG9wdHMpIHtcbiAgcmV0dXJuIHpsaWJCdWZmZXJTeW5jKG5ldyBJbmZsYXRlUmF3KG9wdHMpLCBidWZmZXIpO1xufTtcblxuZnVuY3Rpb24gemxpYkJ1ZmZlcihlbmdpbmUsIGJ1ZmZlciwgY2FsbGJhY2spIHtcbiAgdmFyIGJ1ZmZlcnMgPSBbXTtcbiAgdmFyIG5yZWFkID0gMDtcblxuICBlbmdpbmUub24oJ2Vycm9yJywgb25FcnJvcik7XG4gIGVuZ2luZS5vbignZW5kJywgb25FbmQpO1xuXG4gIGVuZ2luZS5lbmQoYnVmZmVyKTtcbiAgZmxvdygpO1xuXG4gIGZ1bmN0aW9uIGZsb3coKSB7XG4gICAgdmFyIGNodW5rO1xuICAgIHdoaWxlIChudWxsICE9PSAoY2h1bmsgPSBlbmdpbmUucmVhZCgpKSkge1xuICAgICAgYnVmZmVycy5wdXNoKGNodW5rKTtcbiAgICAgIG5yZWFkICs9IGNodW5rLmxlbmd0aDtcbiAgICB9XG4gICAgZW5naW5lLm9uY2UoJ3JlYWRhYmxlJywgZmxvdyk7XG4gIH1cblxuICBmdW5jdGlvbiBvbkVycm9yKGVycikge1xuICAgIGVuZ2luZS5yZW1vdmVMaXN0ZW5lcignZW5kJywgb25FbmQpO1xuICAgIGVuZ2luZS5yZW1vdmVMaXN0ZW5lcigncmVhZGFibGUnLCBmbG93KTtcbiAgICBjYWxsYmFjayhlcnIpO1xuICB9XG5cbiAgZnVuY3Rpb24gb25FbmQoKSB7XG4gICAgdmFyIGJ1ZjtcbiAgICB2YXIgZXJyID0gbnVsbDtcblxuICAgIGlmIChucmVhZCA+PSBrTWF4TGVuZ3RoKSB7XG4gICAgICBlcnIgPSBuZXcgUmFuZ2VFcnJvcihrUmFuZ2VFcnJvck1lc3NhZ2UpO1xuICAgIH0gZWxzZSB7XG4gICAgICBidWYgPSBCdWZmZXIuY29uY2F0KGJ1ZmZlcnMsIG5yZWFkKTtcbiAgICB9XG5cbiAgICBidWZmZXJzID0gW107XG4gICAgZW5naW5lLmNsb3NlKCk7XG4gICAgY2FsbGJhY2soZXJyLCBidWYpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHpsaWJCdWZmZXJTeW5jKGVuZ2luZSwgYnVmZmVyKSB7XG4gIGlmICh0eXBlb2YgYnVmZmVyID09PSAnc3RyaW5nJykgYnVmZmVyID0gQnVmZmVyLmZyb20oYnVmZmVyKTtcblxuICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcihidWZmZXIpKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdOb3QgYSBzdHJpbmcgb3IgYnVmZmVyJyk7XG5cbiAgdmFyIGZsdXNoRmxhZyA9IGVuZ2luZS5fZmluaXNoRmx1c2hGbGFnO1xuXG4gIHJldHVybiBlbmdpbmUuX3Byb2Nlc3NDaHVuayhidWZmZXIsIGZsdXNoRmxhZyk7XG59XG5cbi8vIGdlbmVyaWMgemxpYlxuLy8gbWluaW1hbCAyLWJ5dGUgaGVhZGVyXG5mdW5jdGlvbiBEZWZsYXRlKG9wdHMpIHtcbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIERlZmxhdGUpKSByZXR1cm4gbmV3IERlZmxhdGUob3B0cyk7XG4gIFpsaWIuY2FsbCh0aGlzLCBvcHRzLCBiaW5kaW5nLkRFRkxBVEUpO1xufVxuXG5mdW5jdGlvbiBJbmZsYXRlKG9wdHMpIHtcbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIEluZmxhdGUpKSByZXR1cm4gbmV3IEluZmxhdGUob3B0cyk7XG4gIFpsaWIuY2FsbCh0aGlzLCBvcHRzLCBiaW5kaW5nLklORkxBVEUpO1xufVxuXG4vLyBnemlwIC0gYmlnZ2VyIGhlYWRlciwgc2FtZSBkZWZsYXRlIGNvbXByZXNzaW9uXG5mdW5jdGlvbiBHemlwKG9wdHMpIHtcbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIEd6aXApKSByZXR1cm4gbmV3IEd6aXAob3B0cyk7XG4gIFpsaWIuY2FsbCh0aGlzLCBvcHRzLCBiaW5kaW5nLkdaSVApO1xufVxuXG5mdW5jdGlvbiBHdW56aXAob3B0cykge1xuICBpZiAoISh0aGlzIGluc3RhbmNlb2YgR3VuemlwKSkgcmV0dXJuIG5ldyBHdW56aXAob3B0cyk7XG4gIFpsaWIuY2FsbCh0aGlzLCBvcHRzLCBiaW5kaW5nLkdVTlpJUCk7XG59XG5cbi8vIHJhdyAtIG5vIGhlYWRlclxuZnVuY3Rpb24gRGVmbGF0ZVJhdyhvcHRzKSB7XG4gIGlmICghKHRoaXMgaW5zdGFuY2VvZiBEZWZsYXRlUmF3KSkgcmV0dXJuIG5ldyBEZWZsYXRlUmF3KG9wdHMpO1xuICBabGliLmNhbGwodGhpcywgb3B0cywgYmluZGluZy5ERUZMQVRFUkFXKTtcbn1cblxuZnVuY3Rpb24gSW5mbGF0ZVJhdyhvcHRzKSB7XG4gIGlmICghKHRoaXMgaW5zdGFuY2VvZiBJbmZsYXRlUmF3KSkgcmV0dXJuIG5ldyBJbmZsYXRlUmF3KG9wdHMpO1xuICBabGliLmNhbGwodGhpcywgb3B0cywgYmluZGluZy5JTkZMQVRFUkFXKTtcbn1cblxuLy8gYXV0by1kZXRlY3QgaGVhZGVyLlxuZnVuY3Rpb24gVW56aXAob3B0cykge1xuICBpZiAoISh0aGlzIGluc3RhbmNlb2YgVW56aXApKSByZXR1cm4gbmV3IFVuemlwKG9wdHMpO1xuICBabGliLmNhbGwodGhpcywgb3B0cywgYmluZGluZy5VTlpJUCk7XG59XG5cbmZ1bmN0aW9uIGlzVmFsaWRGbHVzaEZsYWcoZmxhZykge1xuICByZXR1cm4gZmxhZyA9PT0gYmluZGluZy5aX05PX0ZMVVNIIHx8IGZsYWcgPT09IGJpbmRpbmcuWl9QQVJUSUFMX0ZMVVNIIHx8IGZsYWcgPT09IGJpbmRpbmcuWl9TWU5DX0ZMVVNIIHx8IGZsYWcgPT09IGJpbmRpbmcuWl9GVUxMX0ZMVVNIIHx8IGZsYWcgPT09IGJpbmRpbmcuWl9GSU5JU0ggfHwgZmxhZyA9PT0gYmluZGluZy5aX0JMT0NLO1xufVxuXG4vLyB0aGUgWmxpYiBjbGFzcyB0aGV5IGFsbCBpbmhlcml0IGZyb21cbi8vIFRoaXMgdGhpbmcgbWFuYWdlcyB0aGUgcXVldWUgb2YgcmVxdWVzdHMsIGFuZCByZXR1cm5zXG4vLyB0cnVlIG9yIGZhbHNlIGlmIHRoZXJlIGlzIGFueXRoaW5nIGluIHRoZSBxdWV1ZSB3aGVuXG4vLyB5b3UgY2FsbCB0aGUgLndyaXRlKCkgbWV0aG9kLlxuXG5mdW5jdGlvbiBabGliKG9wdHMsIG1vZGUpIHtcbiAgdmFyIF90aGlzID0gdGhpcztcblxuICB0aGlzLl9vcHRzID0gb3B0cyA9IG9wdHMgfHwge307XG4gIHRoaXMuX2NodW5rU2l6ZSA9IG9wdHMuY2h1bmtTaXplIHx8IGV4cG9ydHMuWl9ERUZBVUxUX0NIVU5LO1xuXG4gIFRyYW5zZm9ybS5jYWxsKHRoaXMsIG9wdHMpO1xuXG4gIGlmIChvcHRzLmZsdXNoICYmICFpc1ZhbGlkRmx1c2hGbGFnKG9wdHMuZmx1c2gpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGZsdXNoIGZsYWc6ICcgKyBvcHRzLmZsdXNoKTtcbiAgfVxuICBpZiAob3B0cy5maW5pc2hGbHVzaCAmJiAhaXNWYWxpZEZsdXNoRmxhZyhvcHRzLmZpbmlzaEZsdXNoKSkge1xuICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBmbHVzaCBmbGFnOiAnICsgb3B0cy5maW5pc2hGbHVzaCk7XG4gIH1cblxuICB0aGlzLl9mbHVzaEZsYWcgPSBvcHRzLmZsdXNoIHx8IGJpbmRpbmcuWl9OT19GTFVTSDtcbiAgdGhpcy5fZmluaXNoRmx1c2hGbGFnID0gdHlwZW9mIG9wdHMuZmluaXNoRmx1c2ggIT09ICd1bmRlZmluZWQnID8gb3B0cy5maW5pc2hGbHVzaCA6IGJpbmRpbmcuWl9GSU5JU0g7XG5cbiAgaWYgKG9wdHMuY2h1bmtTaXplKSB7XG4gICAgaWYgKG9wdHMuY2h1bmtTaXplIDwgZXhwb3J0cy5aX01JTl9DSFVOSyB8fCBvcHRzLmNodW5rU2l6ZSA+IGV4cG9ydHMuWl9NQVhfQ0hVTkspIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBjaHVuayBzaXplOiAnICsgb3B0cy5jaHVua1NpemUpO1xuICAgIH1cbiAgfVxuXG4gIGlmIChvcHRzLndpbmRvd0JpdHMpIHtcbiAgICBpZiAob3B0cy53aW5kb3dCaXRzIDwgZXhwb3J0cy5aX01JTl9XSU5ET1dCSVRTIHx8IG9wdHMud2luZG93Qml0cyA+IGV4cG9ydHMuWl9NQVhfV0lORE9XQklUUykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIHdpbmRvd0JpdHM6ICcgKyBvcHRzLndpbmRvd0JpdHMpO1xuICAgIH1cbiAgfVxuXG4gIGlmIChvcHRzLmxldmVsKSB7XG4gICAgaWYgKG9wdHMubGV2ZWwgPCBleHBvcnRzLlpfTUlOX0xFVkVMIHx8IG9wdHMubGV2ZWwgPiBleHBvcnRzLlpfTUFYX0xFVkVMKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgY29tcHJlc3Npb24gbGV2ZWw6ICcgKyBvcHRzLmxldmVsKTtcbiAgICB9XG4gIH1cblxuICBpZiAob3B0cy5tZW1MZXZlbCkge1xuICAgIGlmIChvcHRzLm1lbUxldmVsIDwgZXhwb3J0cy5aX01JTl9NRU1MRVZFTCB8fCBvcHRzLm1lbUxldmVsID4gZXhwb3J0cy5aX01BWF9NRU1MRVZFTCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIG1lbUxldmVsOiAnICsgb3B0cy5tZW1MZXZlbCk7XG4gICAgfVxuICB9XG5cbiAgaWYgKG9wdHMuc3RyYXRlZ3kpIHtcbiAgICBpZiAob3B0cy5zdHJhdGVneSAhPSBleHBvcnRzLlpfRklMVEVSRUQgJiYgb3B0cy5zdHJhdGVneSAhPSBleHBvcnRzLlpfSFVGRk1BTl9PTkxZICYmIG9wdHMuc3RyYXRlZ3kgIT0gZXhwb3J0cy5aX1JMRSAmJiBvcHRzLnN0cmF0ZWd5ICE9IGV4cG9ydHMuWl9GSVhFRCAmJiBvcHRzLnN0cmF0ZWd5ICE9IGV4cG9ydHMuWl9ERUZBVUxUX1NUUkFURUdZKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgc3RyYXRlZ3k6ICcgKyBvcHRzLnN0cmF0ZWd5KTtcbiAgICB9XG4gIH1cblxuICBpZiAob3B0cy5kaWN0aW9uYXJ5KSB7XG4gICAgaWYgKCFCdWZmZXIuaXNCdWZmZXIob3B0cy5kaWN0aW9uYXJ5KSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGRpY3Rpb25hcnk6IGl0IHNob3VsZCBiZSBhIEJ1ZmZlciBpbnN0YW5jZScpO1xuICAgIH1cbiAgfVxuXG4gIHRoaXMuX2hhbmRsZSA9IG5ldyBiaW5kaW5nLlpsaWIobW9kZSk7XG5cbiAgdmFyIHNlbGYgPSB0aGlzO1xuICB0aGlzLl9oYWRFcnJvciA9IGZhbHNlO1xuICB0aGlzLl9oYW5kbGUub25lcnJvciA9IGZ1bmN0aW9uIChtZXNzYWdlLCBlcnJubykge1xuICAgIC8vIHRoZXJlIGlzIG5vIHdheSB0byBjbGVhbmx5IHJlY292ZXIuXG4gICAgLy8gY29udGludWluZyBvbmx5IG9ic2N1cmVzIHByb2JsZW1zLlxuICAgIF9jbG9zZShzZWxmKTtcbiAgICBzZWxmLl9oYWRFcnJvciA9IHRydWU7XG5cbiAgICB2YXIgZXJyb3IgPSBuZXcgRXJyb3IobWVzc2FnZSk7XG4gICAgZXJyb3IuZXJybm8gPSBlcnJubztcbiAgICBlcnJvci5jb2RlID0gZXhwb3J0cy5jb2Rlc1tlcnJub107XG4gICAgc2VsZi5lbWl0KCdlcnJvcicsIGVycm9yKTtcbiAgfTtcblxuICB2YXIgbGV2ZWwgPSBleHBvcnRzLlpfREVGQVVMVF9DT01QUkVTU0lPTjtcbiAgaWYgKHR5cGVvZiBvcHRzLmxldmVsID09PSAnbnVtYmVyJykgbGV2ZWwgPSBvcHRzLmxldmVsO1xuXG4gIHZhciBzdHJhdGVneSA9IGV4cG9ydHMuWl9ERUZBVUxUX1NUUkFURUdZO1xuICBpZiAodHlwZW9mIG9wdHMuc3RyYXRlZ3kgPT09ICdudW1iZXInKSBzdHJhdGVneSA9IG9wdHMuc3RyYXRlZ3k7XG5cbiAgdGhpcy5faGFuZGxlLmluaXQob3B0cy53aW5kb3dCaXRzIHx8IGV4cG9ydHMuWl9ERUZBVUxUX1dJTkRPV0JJVFMsIGxldmVsLCBvcHRzLm1lbUxldmVsIHx8IGV4cG9ydHMuWl9ERUZBVUxUX01FTUxFVkVMLCBzdHJhdGVneSwgb3B0cy5kaWN0aW9uYXJ5KTtcblxuICB0aGlzLl9idWZmZXIgPSBCdWZmZXIuYWxsb2NVbnNhZmUodGhpcy5fY2h1bmtTaXplKTtcbiAgdGhpcy5fb2Zmc2V0ID0gMDtcbiAgdGhpcy5fbGV2ZWwgPSBsZXZlbDtcbiAgdGhpcy5fc3RyYXRlZ3kgPSBzdHJhdGVneTtcblxuICB0aGlzLm9uY2UoJ2VuZCcsIHRoaXMuY2xvc2UpO1xuXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnX2Nsb3NlZCcsIHtcbiAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiAhX3RoaXMuX2hhbmRsZTtcbiAgICB9LFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICBlbnVtZXJhYmxlOiB0cnVlXG4gIH0pO1xufVxuXG51dGlsLmluaGVyaXRzKFpsaWIsIFRyYW5zZm9ybSk7XG5cblpsaWIucHJvdG90eXBlLnBhcmFtcyA9IGZ1bmN0aW9uIChsZXZlbCwgc3RyYXRlZ3ksIGNhbGxiYWNrKSB7XG4gIGlmIChsZXZlbCA8IGV4cG9ydHMuWl9NSU5fTEVWRUwgfHwgbGV2ZWwgPiBleHBvcnRzLlpfTUFYX0xFVkVMKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0ludmFsaWQgY29tcHJlc3Npb24gbGV2ZWw6ICcgKyBsZXZlbCk7XG4gIH1cbiAgaWYgKHN0cmF0ZWd5ICE9IGV4cG9ydHMuWl9GSUxURVJFRCAmJiBzdHJhdGVneSAhPSBleHBvcnRzLlpfSFVGRk1BTl9PTkxZICYmIHN0cmF0ZWd5ICE9IGV4cG9ydHMuWl9STEUgJiYgc3RyYXRlZ3kgIT0gZXhwb3J0cy5aX0ZJWEVEICYmIHN0cmF0ZWd5ICE9IGV4cG9ydHMuWl9ERUZBVUxUX1NUUkFURUdZKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignSW52YWxpZCBzdHJhdGVneTogJyArIHN0cmF0ZWd5KTtcbiAgfVxuXG4gIGlmICh0aGlzLl9sZXZlbCAhPT0gbGV2ZWwgfHwgdGhpcy5fc3RyYXRlZ3kgIT09IHN0cmF0ZWd5KSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHRoaXMuZmx1c2goYmluZGluZy5aX1NZTkNfRkxVU0gsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGFzc2VydChzZWxmLl9oYW5kbGUsICd6bGliIGJpbmRpbmcgY2xvc2VkJyk7XG4gICAgICBzZWxmLl9oYW5kbGUucGFyYW1zKGxldmVsLCBzdHJhdGVneSk7XG4gICAgICBpZiAoIXNlbGYuX2hhZEVycm9yKSB7XG4gICAgICAgIHNlbGYuX2xldmVsID0gbGV2ZWw7XG4gICAgICAgIHNlbGYuX3N0cmF0ZWd5ID0gc3RyYXRlZ3k7XG4gICAgICAgIGlmIChjYWxsYmFjaykgY2FsbGJhY2soKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBwcm9jZXNzLm5leHRUaWNrKGNhbGxiYWNrKTtcbiAgfVxufTtcblxuWmxpYi5wcm90b3R5cGUucmVzZXQgPSBmdW5jdGlvbiAoKSB7XG4gIGFzc2VydCh0aGlzLl9oYW5kbGUsICd6bGliIGJpbmRpbmcgY2xvc2VkJyk7XG4gIHJldHVybiB0aGlzLl9oYW5kbGUucmVzZXQoKTtcbn07XG5cbi8vIFRoaXMgaXMgdGhlIF9mbHVzaCBmdW5jdGlvbiBjYWxsZWQgYnkgdGhlIHRyYW5zZm9ybSBjbGFzcyxcbi8vIGludGVybmFsbHksIHdoZW4gdGhlIGxhc3QgY2h1bmsgaGFzIGJlZW4gd3JpdHRlbi5cblpsaWIucHJvdG90eXBlLl9mbHVzaCA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICB0aGlzLl90cmFuc2Zvcm0oQnVmZmVyLmFsbG9jKDApLCAnJywgY2FsbGJhY2spO1xufTtcblxuWmxpYi5wcm90b3R5cGUuZmx1c2ggPSBmdW5jdGlvbiAoa2luZCwgY2FsbGJhY2spIHtcbiAgdmFyIF90aGlzMiA9IHRoaXM7XG5cbiAgdmFyIHdzID0gdGhpcy5fd3JpdGFibGVTdGF0ZTtcblxuICBpZiAodHlwZW9mIGtpbmQgPT09ICdmdW5jdGlvbicgfHwga2luZCA9PT0gdW5kZWZpbmVkICYmICFjYWxsYmFjaykge1xuICAgIGNhbGxiYWNrID0ga2luZDtcbiAgICBraW5kID0gYmluZGluZy5aX0ZVTExfRkxVU0g7XG4gIH1cblxuICBpZiAod3MuZW5kZWQpIHtcbiAgICBpZiAoY2FsbGJhY2spIHByb2Nlc3MubmV4dFRpY2soY2FsbGJhY2spO1xuICB9IGVsc2UgaWYgKHdzLmVuZGluZykge1xuICAgIGlmIChjYWxsYmFjaykgdGhpcy5vbmNlKCdlbmQnLCBjYWxsYmFjayk7XG4gIH0gZWxzZSBpZiAod3MubmVlZERyYWluKSB7XG4gICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICB0aGlzLm9uY2UoJ2RyYWluJywgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gX3RoaXMyLmZsdXNoKGtpbmQsIGNhbGxiYWNrKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB0aGlzLl9mbHVzaEZsYWcgPSBraW5kO1xuICAgIHRoaXMud3JpdGUoQnVmZmVyLmFsbG9jKDApLCAnJywgY2FsbGJhY2spO1xuICB9XG59O1xuXG5abGliLnByb3RvdHlwZS5jbG9zZSA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICBfY2xvc2UodGhpcywgY2FsbGJhY2spO1xuICBwcm9jZXNzLm5leHRUaWNrKGVtaXRDbG9zZU5ULCB0aGlzKTtcbn07XG5cbmZ1bmN0aW9uIF9jbG9zZShlbmdpbmUsIGNhbGxiYWNrKSB7XG4gIGlmIChjYWxsYmFjaykgcHJvY2Vzcy5uZXh0VGljayhjYWxsYmFjayk7XG5cbiAgLy8gQ2FsbGVyIG1heSBpbnZva2UgLmNsb3NlIGFmdGVyIGEgemxpYiBlcnJvciAod2hpY2ggd2lsbCBudWxsIF9oYW5kbGUpLlxuICBpZiAoIWVuZ2luZS5faGFuZGxlKSByZXR1cm47XG5cbiAgZW5naW5lLl9oYW5kbGUuY2xvc2UoKTtcbiAgZW5naW5lLl9oYW5kbGUgPSBudWxsO1xufVxuXG5mdW5jdGlvbiBlbWl0Q2xvc2VOVChzZWxmKSB7XG4gIHNlbGYuZW1pdCgnY2xvc2UnKTtcbn1cblxuWmxpYi5wcm90b3R5cGUuX3RyYW5zZm9ybSA9IGZ1bmN0aW9uIChjaHVuaywgZW5jb2RpbmcsIGNiKSB7XG4gIHZhciBmbHVzaEZsYWc7XG4gIHZhciB3cyA9IHRoaXMuX3dyaXRhYmxlU3RhdGU7XG4gIHZhciBlbmRpbmcgPSB3cy5lbmRpbmcgfHwgd3MuZW5kZWQ7XG4gIHZhciBsYXN0ID0gZW5kaW5nICYmICghY2h1bmsgfHwgd3MubGVuZ3RoID09PSBjaHVuay5sZW5ndGgpO1xuXG4gIGlmIChjaHVuayAhPT0gbnVsbCAmJiAhQnVmZmVyLmlzQnVmZmVyKGNodW5rKSkgcmV0dXJuIGNiKG5ldyBFcnJvcignaW52YWxpZCBpbnB1dCcpKTtcblxuICBpZiAoIXRoaXMuX2hhbmRsZSkgcmV0dXJuIGNiKG5ldyBFcnJvcignemxpYiBiaW5kaW5nIGNsb3NlZCcpKTtcblxuICAvLyBJZiBpdCdzIHRoZSBsYXN0IGNodW5rLCBvciBhIGZpbmFsIGZsdXNoLCB3ZSB1c2UgdGhlIFpfRklOSVNIIGZsdXNoIGZsYWdcbiAgLy8gKG9yIHdoYXRldmVyIGZsYWcgd2FzIHByb3ZpZGVkIHVzaW5nIG9wdHMuZmluaXNoRmx1c2gpLlxuICAvLyBJZiBpdCdzIGV4cGxpY2l0bHkgZmx1c2hpbmcgYXQgc29tZSBvdGhlciB0aW1lLCB0aGVuIHdlIHVzZVxuICAvLyBaX0ZVTExfRkxVU0guIE90aGVyd2lzZSwgdXNlIFpfTk9fRkxVU0ggZm9yIG1heGltdW0gY29tcHJlc3Npb25cbiAgLy8gZ29vZG5lc3MuXG4gIGlmIChsYXN0KSBmbHVzaEZsYWcgPSB0aGlzLl9maW5pc2hGbHVzaEZsYWc7ZWxzZSB7XG4gICAgZmx1c2hGbGFnID0gdGhpcy5fZmx1c2hGbGFnO1xuICAgIC8vIG9uY2Ugd2UndmUgZmx1c2hlZCB0aGUgbGFzdCBvZiB0aGUgcXVldWUsIHN0b3AgZmx1c2hpbmcgYW5kXG4gICAgLy8gZ28gYmFjayB0byB0aGUgbm9ybWFsIGJlaGF2aW9yLlxuICAgIGlmIChjaHVuay5sZW5ndGggPj0gd3MubGVuZ3RoKSB7XG4gICAgICB0aGlzLl9mbHVzaEZsYWcgPSB0aGlzLl9vcHRzLmZsdXNoIHx8IGJpbmRpbmcuWl9OT19GTFVTSDtcbiAgICB9XG4gIH1cblxuICB0aGlzLl9wcm9jZXNzQ2h1bmsoY2h1bmssIGZsdXNoRmxhZywgY2IpO1xufTtcblxuWmxpYi5wcm90b3R5cGUuX3Byb2Nlc3NDaHVuayA9IGZ1bmN0aW9uIChjaHVuaywgZmx1c2hGbGFnLCBjYikge1xuICB2YXIgYXZhaWxJbkJlZm9yZSA9IGNodW5rICYmIGNodW5rLmxlbmd0aDtcbiAgdmFyIGF2YWlsT3V0QmVmb3JlID0gdGhpcy5fY2h1bmtTaXplIC0gdGhpcy5fb2Zmc2V0O1xuICB2YXIgaW5PZmYgPSAwO1xuXG4gIHZhciBzZWxmID0gdGhpcztcblxuICB2YXIgYXN5bmMgPSB0eXBlb2YgY2IgPT09ICdmdW5jdGlvbic7XG5cbiAgaWYgKCFhc3luYykge1xuICAgIHZhciBidWZmZXJzID0gW107XG4gICAgdmFyIG5yZWFkID0gMDtcblxuICAgIHZhciBlcnJvcjtcbiAgICB0aGlzLm9uKCdlcnJvcicsIGZ1bmN0aW9uIChlcikge1xuICAgICAgZXJyb3IgPSBlcjtcbiAgICB9KTtcblxuICAgIGFzc2VydCh0aGlzLl9oYW5kbGUsICd6bGliIGJpbmRpbmcgY2xvc2VkJyk7XG4gICAgZG8ge1xuICAgICAgdmFyIHJlcyA9IHRoaXMuX2hhbmRsZS53cml0ZVN5bmMoZmx1c2hGbGFnLCBjaHVuaywgLy8gaW5cbiAgICAgIGluT2ZmLCAvLyBpbl9vZmZcbiAgICAgIGF2YWlsSW5CZWZvcmUsIC8vIGluX2xlblxuICAgICAgdGhpcy5fYnVmZmVyLCAvLyBvdXRcbiAgICAgIHRoaXMuX29mZnNldCwgLy9vdXRfb2ZmXG4gICAgICBhdmFpbE91dEJlZm9yZSk7IC8vIG91dF9sZW5cbiAgICB9IHdoaWxlICghdGhpcy5faGFkRXJyb3IgJiYgY2FsbGJhY2socmVzWzBdLCByZXNbMV0pKTtcblxuICAgIGlmICh0aGlzLl9oYWRFcnJvcikge1xuICAgICAgdGhyb3cgZXJyb3I7XG4gICAgfVxuXG4gICAgaWYgKG5yZWFkID49IGtNYXhMZW5ndGgpIHtcbiAgICAgIF9jbG9zZSh0aGlzKTtcbiAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKGtSYW5nZUVycm9yTWVzc2FnZSk7XG4gICAgfVxuXG4gICAgdmFyIGJ1ZiA9IEJ1ZmZlci5jb25jYXQoYnVmZmVycywgbnJlYWQpO1xuICAgIF9jbG9zZSh0aGlzKTtcblxuICAgIHJldHVybiBidWY7XG4gIH1cblxuICBhc3NlcnQodGhpcy5faGFuZGxlLCAnemxpYiBiaW5kaW5nIGNsb3NlZCcpO1xuICB2YXIgcmVxID0gdGhpcy5faGFuZGxlLndyaXRlKGZsdXNoRmxhZywgY2h1bmssIC8vIGluXG4gIGluT2ZmLCAvLyBpbl9vZmZcbiAgYXZhaWxJbkJlZm9yZSwgLy8gaW5fbGVuXG4gIHRoaXMuX2J1ZmZlciwgLy8gb3V0XG4gIHRoaXMuX29mZnNldCwgLy9vdXRfb2ZmXG4gIGF2YWlsT3V0QmVmb3JlKTsgLy8gb3V0X2xlblxuXG4gIHJlcS5idWZmZXIgPSBjaHVuaztcbiAgcmVxLmNhbGxiYWNrID0gY2FsbGJhY2s7XG5cbiAgZnVuY3Rpb24gY2FsbGJhY2soYXZhaWxJbkFmdGVyLCBhdmFpbE91dEFmdGVyKSB7XG4gICAgLy8gV2hlbiB0aGUgY2FsbGJhY2sgaXMgdXNlZCBpbiBhbiBhc3luYyB3cml0ZSwgdGhlIGNhbGxiYWNrJ3NcbiAgICAvLyBjb250ZXh0IGlzIHRoZSBgcmVxYCBvYmplY3QgdGhhdCB3YXMgY3JlYXRlZC4gVGhlIHJlcSBvYmplY3RcbiAgICAvLyBpcyA9PT0gdGhpcy5faGFuZGxlLCBhbmQgdGhhdCdzIHdoeSBpdCdzIGltcG9ydGFudCB0byBudWxsXG4gICAgLy8gb3V0IHRoZSB2YWx1ZXMgYWZ0ZXIgdGhleSBhcmUgZG9uZSBiZWluZyB1c2VkLiBgdGhpcy5faGFuZGxlYFxuICAgIC8vIGNhbiBzdGF5IGluIG1lbW9yeSBsb25nZXIgdGhhbiB0aGUgY2FsbGJhY2sgYW5kIGJ1ZmZlciBhcmUgbmVlZGVkLlxuICAgIGlmICh0aGlzKSB7XG4gICAgICB0aGlzLmJ1ZmZlciA9IG51bGw7XG4gICAgICB0aGlzLmNhbGxiYWNrID0gbnVsbDtcbiAgICB9XG5cbiAgICBpZiAoc2VsZi5faGFkRXJyb3IpIHJldHVybjtcblxuICAgIHZhciBoYXZlID0gYXZhaWxPdXRCZWZvcmUgLSBhdmFpbE91dEFmdGVyO1xuICAgIGFzc2VydChoYXZlID49IDAsICdoYXZlIHNob3VsZCBub3QgZ28gZG93bicpO1xuXG4gICAgaWYgKGhhdmUgPiAwKSB7XG4gICAgICB2YXIgb3V0ID0gc2VsZi5fYnVmZmVyLnNsaWNlKHNlbGYuX29mZnNldCwgc2VsZi5fb2Zmc2V0ICsgaGF2ZSk7XG4gICAgICBzZWxmLl9vZmZzZXQgKz0gaGF2ZTtcbiAgICAgIC8vIHNlcnZlIHNvbWUgb3V0cHV0IHRvIHRoZSBjb25zdW1lci5cbiAgICAgIGlmIChhc3luYykge1xuICAgICAgICBzZWxmLnB1c2gob3V0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGJ1ZmZlcnMucHVzaChvdXQpO1xuICAgICAgICBucmVhZCArPSBvdXQubGVuZ3RoO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGV4aGF1c3RlZCB0aGUgb3V0cHV0IGJ1ZmZlciwgb3IgdXNlZCBhbGwgdGhlIGlucHV0IGNyZWF0ZSBhIG5ldyBvbmUuXG4gICAgaWYgKGF2YWlsT3V0QWZ0ZXIgPT09IDAgfHwgc2VsZi5fb2Zmc2V0ID49IHNlbGYuX2NodW5rU2l6ZSkge1xuICAgICAgYXZhaWxPdXRCZWZvcmUgPSBzZWxmLl9jaHVua1NpemU7XG4gICAgICBzZWxmLl9vZmZzZXQgPSAwO1xuICAgICAgc2VsZi5fYnVmZmVyID0gQnVmZmVyLmFsbG9jVW5zYWZlKHNlbGYuX2NodW5rU2l6ZSk7XG4gICAgfVxuXG4gICAgaWYgKGF2YWlsT3V0QWZ0ZXIgPT09IDApIHtcbiAgICAgIC8vIE5vdCBhY3R1YWxseSBkb25lLiAgTmVlZCB0byByZXByb2Nlc3MuXG4gICAgICAvLyBBbHNvLCB1cGRhdGUgdGhlIGF2YWlsSW5CZWZvcmUgdG8gdGhlIGF2YWlsSW5BZnRlciB2YWx1ZSxcbiAgICAgIC8vIHNvIHRoYXQgaWYgd2UgaGF2ZSB0byBoaXQgaXQgYSB0aGlyZCAoZm91cnRoLCBldGMuKSB0aW1lLFxuICAgICAgLy8gaXQnbGwgaGF2ZSB0aGUgY29ycmVjdCBieXRlIGNvdW50cy5cbiAgICAgIGluT2ZmICs9IGF2YWlsSW5CZWZvcmUgLSBhdmFpbEluQWZ0ZXI7XG4gICAgICBhdmFpbEluQmVmb3JlID0gYXZhaWxJbkFmdGVyO1xuXG4gICAgICBpZiAoIWFzeW5jKSByZXR1cm4gdHJ1ZTtcblxuICAgICAgdmFyIG5ld1JlcSA9IHNlbGYuX2hhbmRsZS53cml0ZShmbHVzaEZsYWcsIGNodW5rLCBpbk9mZiwgYXZhaWxJbkJlZm9yZSwgc2VsZi5fYnVmZmVyLCBzZWxmLl9vZmZzZXQsIHNlbGYuX2NodW5rU2l6ZSk7XG4gICAgICBuZXdSZXEuY2FsbGJhY2sgPSBjYWxsYmFjazsgLy8gdGhpcyBzYW1lIGZ1bmN0aW9uXG4gICAgICBuZXdSZXEuYnVmZmVyID0gY2h1bms7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCFhc3luYykgcmV0dXJuIGZhbHNlO1xuXG4gICAgLy8gZmluaXNoZWQgd2l0aCB0aGUgY2h1bmsuXG4gICAgY2IoKTtcbiAgfVxufTtcblxudXRpbC5pbmhlcml0cyhEZWZsYXRlLCBabGliKTtcbnV0aWwuaW5oZXJpdHMoSW5mbGF0ZSwgWmxpYik7XG51dGlsLmluaGVyaXRzKEd6aXAsIFpsaWIpO1xudXRpbC5pbmhlcml0cyhHdW56aXAsIFpsaWIpO1xudXRpbC5pbmhlcml0cyhEZWZsYXRlUmF3LCBabGliKTtcbnV0aWwuaW5oZXJpdHMoSW5mbGF0ZVJhdywgWmxpYik7XG51dGlsLmluaGVyaXRzKFVuemlwLCBabGliKTsiLCIndXNlIHN0cmljdCc7XG4vKiBlc2xpbnQgY2FtZWxjYXNlOiBcIm9mZlwiICovXG5cbnZhciBhc3NlcnQgPSByZXF1aXJlKCdhc3NlcnQnKTtcblxudmFyIFpzdHJlYW0gPSByZXF1aXJlKCdwYWtvL2xpYi96bGliL3pzdHJlYW0nKTtcbnZhciB6bGliX2RlZmxhdGUgPSByZXF1aXJlKCdwYWtvL2xpYi96bGliL2RlZmxhdGUuanMnKTtcbnZhciB6bGliX2luZmxhdGUgPSByZXF1aXJlKCdwYWtvL2xpYi96bGliL2luZmxhdGUuanMnKTtcbnZhciBjb25zdGFudHMgPSByZXF1aXJlKCdwYWtvL2xpYi96bGliL2NvbnN0YW50cycpO1xuXG5mb3IgKHZhciBrZXkgaW4gY29uc3RhbnRzKSB7XG4gIGV4cG9ydHNba2V5XSA9IGNvbnN0YW50c1trZXldO1xufVxuXG4vLyB6bGliIG1vZGVzXG5leHBvcnRzLk5PTkUgPSAwO1xuZXhwb3J0cy5ERUZMQVRFID0gMTtcbmV4cG9ydHMuSU5GTEFURSA9IDI7XG5leHBvcnRzLkdaSVAgPSAzO1xuZXhwb3J0cy5HVU5aSVAgPSA0O1xuZXhwb3J0cy5ERUZMQVRFUkFXID0gNTtcbmV4cG9ydHMuSU5GTEFURVJBVyA9IDY7XG5leHBvcnRzLlVOWklQID0gNztcblxudmFyIEdaSVBfSEVBREVSX0lEMSA9IDB4MWY7XG52YXIgR1pJUF9IRUFERVJfSUQyID0gMHg4YjtcblxuLyoqXG4gKiBFbXVsYXRlIE5vZGUncyB6bGliIEMrKyBsYXllciBmb3IgdXNlIGJ5IHRoZSBKUyBsYXllciBpbiBpbmRleC5qc1xuICovXG5mdW5jdGlvbiBabGliKG1vZGUpIHtcbiAgaWYgKHR5cGVvZiBtb2RlICE9PSAnbnVtYmVyJyB8fCBtb2RlIDwgZXhwb3J0cy5ERUZMQVRFIHx8IG1vZGUgPiBleHBvcnRzLlVOWklQKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQmFkIGFyZ3VtZW50Jyk7XG4gIH1cblxuICB0aGlzLmRpY3Rpb25hcnkgPSBudWxsO1xuICB0aGlzLmVyciA9IDA7XG4gIHRoaXMuZmx1c2ggPSAwO1xuICB0aGlzLmluaXRfZG9uZSA9IGZhbHNlO1xuICB0aGlzLmxldmVsID0gMDtcbiAgdGhpcy5tZW1MZXZlbCA9IDA7XG4gIHRoaXMubW9kZSA9IG1vZGU7XG4gIHRoaXMuc3RyYXRlZ3kgPSAwO1xuICB0aGlzLndpbmRvd0JpdHMgPSAwO1xuICB0aGlzLndyaXRlX2luX3Byb2dyZXNzID0gZmFsc2U7XG4gIHRoaXMucGVuZGluZ19jbG9zZSA9IGZhbHNlO1xuICB0aGlzLmd6aXBfaWRfYnl0ZXNfcmVhZCA9IDA7XG59XG5cblpsaWIucHJvdG90eXBlLmNsb3NlID0gZnVuY3Rpb24gKCkge1xuICBpZiAodGhpcy53cml0ZV9pbl9wcm9ncmVzcykge1xuICAgIHRoaXMucGVuZGluZ19jbG9zZSA9IHRydWU7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdGhpcy5wZW5kaW5nX2Nsb3NlID0gZmFsc2U7XG5cbiAgYXNzZXJ0KHRoaXMuaW5pdF9kb25lLCAnY2xvc2UgYmVmb3JlIGluaXQnKTtcbiAgYXNzZXJ0KHRoaXMubW9kZSA8PSBleHBvcnRzLlVOWklQKTtcblxuICBpZiAodGhpcy5tb2RlID09PSBleHBvcnRzLkRFRkxBVEUgfHwgdGhpcy5tb2RlID09PSBleHBvcnRzLkdaSVAgfHwgdGhpcy5tb2RlID09PSBleHBvcnRzLkRFRkxBVEVSQVcpIHtcbiAgICB6bGliX2RlZmxhdGUuZGVmbGF0ZUVuZCh0aGlzLnN0cm0pO1xuICB9IGVsc2UgaWYgKHRoaXMubW9kZSA9PT0gZXhwb3J0cy5JTkZMQVRFIHx8IHRoaXMubW9kZSA9PT0gZXhwb3J0cy5HVU5aSVAgfHwgdGhpcy5tb2RlID09PSBleHBvcnRzLklORkxBVEVSQVcgfHwgdGhpcy5tb2RlID09PSBleHBvcnRzLlVOWklQKSB7XG4gICAgemxpYl9pbmZsYXRlLmluZmxhdGVFbmQodGhpcy5zdHJtKTtcbiAgfVxuXG4gIHRoaXMubW9kZSA9IGV4cG9ydHMuTk9ORTtcblxuICB0aGlzLmRpY3Rpb25hcnkgPSBudWxsO1xufTtcblxuWmxpYi5wcm90b3R5cGUud3JpdGUgPSBmdW5jdGlvbiAoZmx1c2gsIGlucHV0LCBpbl9vZmYsIGluX2xlbiwgb3V0LCBvdXRfb2ZmLCBvdXRfbGVuKSB7XG4gIHJldHVybiB0aGlzLl93cml0ZSh0cnVlLCBmbHVzaCwgaW5wdXQsIGluX29mZiwgaW5fbGVuLCBvdXQsIG91dF9vZmYsIG91dF9sZW4pO1xufTtcblxuWmxpYi5wcm90b3R5cGUud3JpdGVTeW5jID0gZnVuY3Rpb24gKGZsdXNoLCBpbnB1dCwgaW5fb2ZmLCBpbl9sZW4sIG91dCwgb3V0X29mZiwgb3V0X2xlbikge1xuICByZXR1cm4gdGhpcy5fd3JpdGUoZmFsc2UsIGZsdXNoLCBpbnB1dCwgaW5fb2ZmLCBpbl9sZW4sIG91dCwgb3V0X29mZiwgb3V0X2xlbik7XG59O1xuXG5abGliLnByb3RvdHlwZS5fd3JpdGUgPSBmdW5jdGlvbiAoYXN5bmMsIGZsdXNoLCBpbnB1dCwgaW5fb2ZmLCBpbl9sZW4sIG91dCwgb3V0X29mZiwgb3V0X2xlbikge1xuICBhc3NlcnQuZXF1YWwoYXJndW1lbnRzLmxlbmd0aCwgOCk7XG5cbiAgYXNzZXJ0KHRoaXMuaW5pdF9kb25lLCAnd3JpdGUgYmVmb3JlIGluaXQnKTtcbiAgYXNzZXJ0KHRoaXMubW9kZSAhPT0gZXhwb3J0cy5OT05FLCAnYWxyZWFkeSBmaW5hbGl6ZWQnKTtcbiAgYXNzZXJ0LmVxdWFsKGZhbHNlLCB0aGlzLndyaXRlX2luX3Byb2dyZXNzLCAnd3JpdGUgYWxyZWFkeSBpbiBwcm9ncmVzcycpO1xuICBhc3NlcnQuZXF1YWwoZmFsc2UsIHRoaXMucGVuZGluZ19jbG9zZSwgJ2Nsb3NlIGlzIHBlbmRpbmcnKTtcblxuICB0aGlzLndyaXRlX2luX3Byb2dyZXNzID0gdHJ1ZTtcblxuICBhc3NlcnQuZXF1YWwoZmFsc2UsIGZsdXNoID09PSB1bmRlZmluZWQsICdtdXN0IHByb3ZpZGUgZmx1c2ggdmFsdWUnKTtcblxuICB0aGlzLndyaXRlX2luX3Byb2dyZXNzID0gdHJ1ZTtcblxuICBpZiAoZmx1c2ggIT09IGV4cG9ydHMuWl9OT19GTFVTSCAmJiBmbHVzaCAhPT0gZXhwb3J0cy5aX1BBUlRJQUxfRkxVU0ggJiYgZmx1c2ggIT09IGV4cG9ydHMuWl9TWU5DX0ZMVVNIICYmIGZsdXNoICE9PSBleHBvcnRzLlpfRlVMTF9GTFVTSCAmJiBmbHVzaCAhPT0gZXhwb3J0cy5aX0ZJTklTSCAmJiBmbHVzaCAhPT0gZXhwb3J0cy5aX0JMT0NLKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGZsdXNoIHZhbHVlJyk7XG4gIH1cblxuICBpZiAoaW5wdXQgPT0gbnVsbCkge1xuICAgIGlucHV0ID0gQnVmZmVyLmFsbG9jKDApO1xuICAgIGluX2xlbiA9IDA7XG4gICAgaW5fb2ZmID0gMDtcbiAgfVxuXG4gIHRoaXMuc3RybS5hdmFpbF9pbiA9IGluX2xlbjtcbiAgdGhpcy5zdHJtLmlucHV0ID0gaW5wdXQ7XG4gIHRoaXMuc3RybS5uZXh0X2luID0gaW5fb2ZmO1xuICB0aGlzLnN0cm0uYXZhaWxfb3V0ID0gb3V0X2xlbjtcbiAgdGhpcy5zdHJtLm91dHB1dCA9IG91dDtcbiAgdGhpcy5zdHJtLm5leHRfb3V0ID0gb3V0X29mZjtcbiAgdGhpcy5mbHVzaCA9IGZsdXNoO1xuXG4gIGlmICghYXN5bmMpIHtcbiAgICAvLyBzeW5jIHZlcnNpb25cbiAgICB0aGlzLl9wcm9jZXNzKCk7XG5cbiAgICBpZiAodGhpcy5fY2hlY2tFcnJvcigpKSB7XG4gICAgICByZXR1cm4gdGhpcy5fYWZ0ZXJTeW5jKCk7XG4gICAgfVxuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIGFzeW5jIHZlcnNpb25cbiAgdmFyIHNlbGYgPSB0aGlzO1xuICBwcm9jZXNzLm5leHRUaWNrKGZ1bmN0aW9uICgpIHtcbiAgICBzZWxmLl9wcm9jZXNzKCk7XG4gICAgc2VsZi5fYWZ0ZXIoKTtcbiAgfSk7XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5abGliLnByb3RvdHlwZS5fYWZ0ZXJTeW5jID0gZnVuY3Rpb24gKCkge1xuICB2YXIgYXZhaWxfb3V0ID0gdGhpcy5zdHJtLmF2YWlsX291dDtcbiAgdmFyIGF2YWlsX2luID0gdGhpcy5zdHJtLmF2YWlsX2luO1xuXG4gIHRoaXMud3JpdGVfaW5fcHJvZ3Jlc3MgPSBmYWxzZTtcblxuICByZXR1cm4gW2F2YWlsX2luLCBhdmFpbF9vdXRdO1xufTtcblxuWmxpYi5wcm90b3R5cGUuX3Byb2Nlc3MgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBuZXh0X2V4cGVjdGVkX2hlYWRlcl9ieXRlID0gbnVsbDtcblxuICAvLyBJZiB0aGUgYXZhaWxfb3V0IGlzIGxlZnQgYXQgMCwgdGhlbiBpdCBtZWFucyB0aGF0IGl0IHJhbiBvdXRcbiAgLy8gb2Ygcm9vbS4gIElmIHRoZXJlIHdhcyBhdmFpbF9vdXQgbGVmdCBvdmVyLCB0aGVuIGl0IG1lYW5zXG4gIC8vIHRoYXQgYWxsIG9mIHRoZSBpbnB1dCB3YXMgY29uc3VtZWQuXG4gIHN3aXRjaCAodGhpcy5tb2RlKSB7XG4gICAgY2FzZSBleHBvcnRzLkRFRkxBVEU6XG4gICAgY2FzZSBleHBvcnRzLkdaSVA6XG4gICAgY2FzZSBleHBvcnRzLkRFRkxBVEVSQVc6XG4gICAgICB0aGlzLmVyciA9IHpsaWJfZGVmbGF0ZS5kZWZsYXRlKHRoaXMuc3RybSwgdGhpcy5mbHVzaCk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIGV4cG9ydHMuVU5aSVA6XG4gICAgICBpZiAodGhpcy5zdHJtLmF2YWlsX2luID4gMCkge1xuICAgICAgICBuZXh0X2V4cGVjdGVkX2hlYWRlcl9ieXRlID0gdGhpcy5zdHJtLm5leHRfaW47XG4gICAgICB9XG5cbiAgICAgIHN3aXRjaCAodGhpcy5nemlwX2lkX2J5dGVzX3JlYWQpIHtcbiAgICAgICAgY2FzZSAwOlxuICAgICAgICAgIGlmIChuZXh0X2V4cGVjdGVkX2hlYWRlcl9ieXRlID09PSBudWxsKSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAodGhpcy5zdHJtLmlucHV0W25leHRfZXhwZWN0ZWRfaGVhZGVyX2J5dGVdID09PSBHWklQX0hFQURFUl9JRDEpIHtcbiAgICAgICAgICAgIHRoaXMuZ3ppcF9pZF9ieXRlc19yZWFkID0gMTtcbiAgICAgICAgICAgIG5leHRfZXhwZWN0ZWRfaGVhZGVyX2J5dGUrKztcblxuICAgICAgICAgICAgaWYgKHRoaXMuc3RybS5hdmFpbF9pbiA9PT0gMSkge1xuICAgICAgICAgICAgICAvLyBUaGUgb25seSBhdmFpbGFibGUgYnl0ZSB3YXMgYWxyZWFkeSByZWFkLlxuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5tb2RlID0gZXhwb3J0cy5JTkZMQVRFO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuXG4gICAgICAgIC8vIGZhbGx0aHJvdWdoXG4gICAgICAgIGNhc2UgMTpcbiAgICAgICAgICBpZiAobmV4dF9leHBlY3RlZF9oZWFkZXJfYnl0ZSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHRoaXMuc3RybS5pbnB1dFtuZXh0X2V4cGVjdGVkX2hlYWRlcl9ieXRlXSA9PT0gR1pJUF9IRUFERVJfSUQyKSB7XG4gICAgICAgICAgICB0aGlzLmd6aXBfaWRfYnl0ZXNfcmVhZCA9IDI7XG4gICAgICAgICAgICB0aGlzLm1vZGUgPSBleHBvcnRzLkdVTlpJUDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gVGhlcmUgaXMgbm8gYWN0dWFsIGRpZmZlcmVuY2UgYmV0d2VlbiBJTkZMQVRFIGFuZCBJTkZMQVRFUkFXXG4gICAgICAgICAgICAvLyAoYWZ0ZXIgaW5pdGlhbGl6YXRpb24pLlxuICAgICAgICAgICAgdGhpcy5tb2RlID0gZXhwb3J0cy5JTkZMQVRFO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCBudW1iZXIgb2YgZ3ppcCBtYWdpYyBudW1iZXIgYnl0ZXMgcmVhZCcpO1xuICAgICAgfVxuXG4gICAgLy8gZmFsbHRocm91Z2hcbiAgICBjYXNlIGV4cG9ydHMuSU5GTEFURTpcbiAgICBjYXNlIGV4cG9ydHMuR1VOWklQOlxuICAgIGNhc2UgZXhwb3J0cy5JTkZMQVRFUkFXOlxuICAgICAgdGhpcy5lcnIgPSB6bGliX2luZmxhdGUuaW5mbGF0ZSh0aGlzLnN0cm0sIHRoaXMuZmx1c2hcblxuICAgICAgLy8gSWYgZGF0YSB3YXMgZW5jb2RlZCB3aXRoIGRpY3Rpb25hcnlcbiAgICAgICk7aWYgKHRoaXMuZXJyID09PSBleHBvcnRzLlpfTkVFRF9ESUNUICYmIHRoaXMuZGljdGlvbmFyeSkge1xuICAgICAgICAvLyBMb2FkIGl0XG4gICAgICAgIHRoaXMuZXJyID0gemxpYl9pbmZsYXRlLmluZmxhdGVTZXREaWN0aW9uYXJ5KHRoaXMuc3RybSwgdGhpcy5kaWN0aW9uYXJ5KTtcbiAgICAgICAgaWYgKHRoaXMuZXJyID09PSBleHBvcnRzLlpfT0spIHtcbiAgICAgICAgICAvLyBBbmQgdHJ5IHRvIGRlY29kZSBhZ2FpblxuICAgICAgICAgIHRoaXMuZXJyID0gemxpYl9pbmZsYXRlLmluZmxhdGUodGhpcy5zdHJtLCB0aGlzLmZsdXNoKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmVyciA9PT0gZXhwb3J0cy5aX0RBVEFfRVJST1IpIHtcbiAgICAgICAgICAvLyBCb3RoIGluZmxhdGVTZXREaWN0aW9uYXJ5KCkgYW5kIGluZmxhdGUoKSByZXR1cm4gWl9EQVRBX0VSUk9SLlxuICAgICAgICAgIC8vIE1ha2UgaXQgcG9zc2libGUgZm9yIEFmdGVyKCkgdG8gdGVsbCBhIGJhZCBkaWN0aW9uYXJ5IGZyb20gYmFkXG4gICAgICAgICAgLy8gaW5wdXQuXG4gICAgICAgICAgdGhpcy5lcnIgPSBleHBvcnRzLlpfTkVFRF9ESUNUO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB3aGlsZSAodGhpcy5zdHJtLmF2YWlsX2luID4gMCAmJiB0aGlzLm1vZGUgPT09IGV4cG9ydHMuR1VOWklQICYmIHRoaXMuZXJyID09PSBleHBvcnRzLlpfU1RSRUFNX0VORCAmJiB0aGlzLnN0cm0ubmV4dF9pblswXSAhPT0gMHgwMCkge1xuICAgICAgICAvLyBCeXRlcyByZW1haW4gaW4gaW5wdXQgYnVmZmVyLiBQZXJoYXBzIHRoaXMgaXMgYW5vdGhlciBjb21wcmVzc2VkXG4gICAgICAgIC8vIG1lbWJlciBpbiB0aGUgc2FtZSBhcmNoaXZlLCBvciBqdXN0IHRyYWlsaW5nIGdhcmJhZ2UuXG4gICAgICAgIC8vIFRyYWlsaW5nIHplcm8gYnl0ZXMgYXJlIG9rYXksIHRob3VnaCwgc2luY2UgdGhleSBhcmUgZnJlcXVlbnRseVxuICAgICAgICAvLyB1c2VkIGZvciBwYWRkaW5nLlxuXG4gICAgICAgIHRoaXMucmVzZXQoKTtcbiAgICAgICAgdGhpcy5lcnIgPSB6bGliX2luZmxhdGUuaW5mbGF0ZSh0aGlzLnN0cm0sIHRoaXMuZmx1c2gpO1xuICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBFcnJvcignVW5rbm93biBtb2RlICcgKyB0aGlzLm1vZGUpO1xuICB9XG59O1xuXG5abGliLnByb3RvdHlwZS5fY2hlY2tFcnJvciA9IGZ1bmN0aW9uICgpIHtcbiAgLy8gQWNjZXB0YWJsZSBlcnJvciBzdGF0ZXMgZGVwZW5kIG9uIHRoZSB0eXBlIG9mIHpsaWIgc3RyZWFtLlxuICBzd2l0Y2ggKHRoaXMuZXJyKSB7XG4gICAgY2FzZSBleHBvcnRzLlpfT0s6XG4gICAgY2FzZSBleHBvcnRzLlpfQlVGX0VSUk9SOlxuICAgICAgaWYgKHRoaXMuc3RybS5hdmFpbF9vdXQgIT09IDAgJiYgdGhpcy5mbHVzaCA9PT0gZXhwb3J0cy5aX0ZJTklTSCkge1xuICAgICAgICB0aGlzLl9lcnJvcigndW5leHBlY3RlZCBlbmQgb2YgZmlsZScpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICBicmVhaztcbiAgICBjYXNlIGV4cG9ydHMuWl9TVFJFQU1fRU5EOlxuICAgICAgLy8gbm9ybWFsIHN0YXR1c2VzLCBub3QgZmF0YWxcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgZXhwb3J0cy5aX05FRURfRElDVDpcbiAgICAgIGlmICh0aGlzLmRpY3Rpb25hcnkgPT0gbnVsbCkge1xuICAgICAgICB0aGlzLl9lcnJvcignTWlzc2luZyBkaWN0aW9uYXJ5Jyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9lcnJvcignQmFkIGRpY3Rpb25hcnknKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICBkZWZhdWx0OlxuICAgICAgLy8gc29tZXRoaW5nIGVsc2UuXG4gICAgICB0aGlzLl9lcnJvcignWmxpYiBlcnJvcicpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuXG5abGliLnByb3RvdHlwZS5fYWZ0ZXIgPSBmdW5jdGlvbiAoKSB7XG4gIGlmICghdGhpcy5fY2hlY2tFcnJvcigpKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdmFyIGF2YWlsX291dCA9IHRoaXMuc3RybS5hdmFpbF9vdXQ7XG4gIHZhciBhdmFpbF9pbiA9IHRoaXMuc3RybS5hdmFpbF9pbjtcblxuICB0aGlzLndyaXRlX2luX3Byb2dyZXNzID0gZmFsc2U7XG5cbiAgLy8gY2FsbCB0aGUgd3JpdGUoKSBjYlxuICB0aGlzLmNhbGxiYWNrKGF2YWlsX2luLCBhdmFpbF9vdXQpO1xuXG4gIGlmICh0aGlzLnBlbmRpbmdfY2xvc2UpIHtcbiAgICB0aGlzLmNsb3NlKCk7XG4gIH1cbn07XG5cblpsaWIucHJvdG90eXBlLl9lcnJvciA9IGZ1bmN0aW9uIChtZXNzYWdlKSB7XG4gIGlmICh0aGlzLnN0cm0ubXNnKSB7XG4gICAgbWVzc2FnZSA9IHRoaXMuc3RybS5tc2c7XG4gIH1cbiAgdGhpcy5vbmVycm9yKG1lc3NhZ2UsIHRoaXMuZXJyXG5cbiAgLy8gbm8gaG9wZSBvZiByZXNjdWUuXG4gICk7dGhpcy53cml0ZV9pbl9wcm9ncmVzcyA9IGZhbHNlO1xuICBpZiAodGhpcy5wZW5kaW5nX2Nsb3NlKSB7XG4gICAgdGhpcy5jbG9zZSgpO1xuICB9XG59O1xuXG5abGliLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24gKHdpbmRvd0JpdHMsIGxldmVsLCBtZW1MZXZlbCwgc3RyYXRlZ3ksIGRpY3Rpb25hcnkpIHtcbiAgYXNzZXJ0KGFyZ3VtZW50cy5sZW5ndGggPT09IDQgfHwgYXJndW1lbnRzLmxlbmd0aCA9PT0gNSwgJ2luaXQod2luZG93Qml0cywgbGV2ZWwsIG1lbUxldmVsLCBzdHJhdGVneSwgW2RpY3Rpb25hcnldKScpO1xuXG4gIGFzc2VydCh3aW5kb3dCaXRzID49IDggJiYgd2luZG93Qml0cyA8PSAxNSwgJ2ludmFsaWQgd2luZG93Qml0cycpO1xuICBhc3NlcnQobGV2ZWwgPj0gLTEgJiYgbGV2ZWwgPD0gOSwgJ2ludmFsaWQgY29tcHJlc3Npb24gbGV2ZWwnKTtcblxuICBhc3NlcnQobWVtTGV2ZWwgPj0gMSAmJiBtZW1MZXZlbCA8PSA5LCAnaW52YWxpZCBtZW1sZXZlbCcpO1xuXG4gIGFzc2VydChzdHJhdGVneSA9PT0gZXhwb3J0cy5aX0ZJTFRFUkVEIHx8IHN0cmF0ZWd5ID09PSBleHBvcnRzLlpfSFVGRk1BTl9PTkxZIHx8IHN0cmF0ZWd5ID09PSBleHBvcnRzLlpfUkxFIHx8IHN0cmF0ZWd5ID09PSBleHBvcnRzLlpfRklYRUQgfHwgc3RyYXRlZ3kgPT09IGV4cG9ydHMuWl9ERUZBVUxUX1NUUkFURUdZLCAnaW52YWxpZCBzdHJhdGVneScpO1xuXG4gIHRoaXMuX2luaXQobGV2ZWwsIHdpbmRvd0JpdHMsIG1lbUxldmVsLCBzdHJhdGVneSwgZGljdGlvbmFyeSk7XG4gIHRoaXMuX3NldERpY3Rpb25hcnkoKTtcbn07XG5cblpsaWIucHJvdG90eXBlLnBhcmFtcyA9IGZ1bmN0aW9uICgpIHtcbiAgdGhyb3cgbmV3IEVycm9yKCdkZWZsYXRlUGFyYW1zIE5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cblpsaWIucHJvdG90eXBlLnJlc2V0ID0gZnVuY3Rpb24gKCkge1xuICB0aGlzLl9yZXNldCgpO1xuICB0aGlzLl9zZXREaWN0aW9uYXJ5KCk7XG59O1xuXG5abGliLnByb3RvdHlwZS5faW5pdCA9IGZ1bmN0aW9uIChsZXZlbCwgd2luZG93Qml0cywgbWVtTGV2ZWwsIHN0cmF0ZWd5LCBkaWN0aW9uYXJ5KSB7XG4gIHRoaXMubGV2ZWwgPSBsZXZlbDtcbiAgdGhpcy53aW5kb3dCaXRzID0gd2luZG93Qml0cztcbiAgdGhpcy5tZW1MZXZlbCA9IG1lbUxldmVsO1xuICB0aGlzLnN0cmF0ZWd5ID0gc3RyYXRlZ3k7XG5cbiAgdGhpcy5mbHVzaCA9IGV4cG9ydHMuWl9OT19GTFVTSDtcblxuICB0aGlzLmVyciA9IGV4cG9ydHMuWl9PSztcblxuICBpZiAodGhpcy5tb2RlID09PSBleHBvcnRzLkdaSVAgfHwgdGhpcy5tb2RlID09PSBleHBvcnRzLkdVTlpJUCkge1xuICAgIHRoaXMud2luZG93Qml0cyArPSAxNjtcbiAgfVxuXG4gIGlmICh0aGlzLm1vZGUgPT09IGV4cG9ydHMuVU5aSVApIHtcbiAgICB0aGlzLndpbmRvd0JpdHMgKz0gMzI7XG4gIH1cblxuICBpZiAodGhpcy5tb2RlID09PSBleHBvcnRzLkRFRkxBVEVSQVcgfHwgdGhpcy5tb2RlID09PSBleHBvcnRzLklORkxBVEVSQVcpIHtcbiAgICB0aGlzLndpbmRvd0JpdHMgPSAtMSAqIHRoaXMud2luZG93Qml0cztcbiAgfVxuXG4gIHRoaXMuc3RybSA9IG5ldyBac3RyZWFtKCk7XG5cbiAgc3dpdGNoICh0aGlzLm1vZGUpIHtcbiAgICBjYXNlIGV4cG9ydHMuREVGTEFURTpcbiAgICBjYXNlIGV4cG9ydHMuR1pJUDpcbiAgICBjYXNlIGV4cG9ydHMuREVGTEFURVJBVzpcbiAgICAgIHRoaXMuZXJyID0gemxpYl9kZWZsYXRlLmRlZmxhdGVJbml0Mih0aGlzLnN0cm0sIHRoaXMubGV2ZWwsIGV4cG9ydHMuWl9ERUZMQVRFRCwgdGhpcy53aW5kb3dCaXRzLCB0aGlzLm1lbUxldmVsLCB0aGlzLnN0cmF0ZWd5KTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgZXhwb3J0cy5JTkZMQVRFOlxuICAgIGNhc2UgZXhwb3J0cy5HVU5aSVA6XG4gICAgY2FzZSBleHBvcnRzLklORkxBVEVSQVc6XG4gICAgY2FzZSBleHBvcnRzLlVOWklQOlxuICAgICAgdGhpcy5lcnIgPSB6bGliX2luZmxhdGUuaW5mbGF0ZUluaXQyKHRoaXMuc3RybSwgdGhpcy53aW5kb3dCaXRzKTtcbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gbW9kZSAnICsgdGhpcy5tb2RlKTtcbiAgfVxuXG4gIGlmICh0aGlzLmVyciAhPT0gZXhwb3J0cy5aX09LKSB7XG4gICAgdGhpcy5fZXJyb3IoJ0luaXQgZXJyb3InKTtcbiAgfVxuXG4gIHRoaXMuZGljdGlvbmFyeSA9IGRpY3Rpb25hcnk7XG5cbiAgdGhpcy53cml0ZV9pbl9wcm9ncmVzcyA9IGZhbHNlO1xuICB0aGlzLmluaXRfZG9uZSA9IHRydWU7XG59O1xuXG5abGliLnByb3RvdHlwZS5fc2V0RGljdGlvbmFyeSA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKHRoaXMuZGljdGlvbmFyeSA9PSBudWxsKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdGhpcy5lcnIgPSBleHBvcnRzLlpfT0s7XG5cbiAgc3dpdGNoICh0aGlzLm1vZGUpIHtcbiAgICBjYXNlIGV4cG9ydHMuREVGTEFURTpcbiAgICBjYXNlIGV4cG9ydHMuREVGTEFURVJBVzpcbiAgICAgIHRoaXMuZXJyID0gemxpYl9kZWZsYXRlLmRlZmxhdGVTZXREaWN0aW9uYXJ5KHRoaXMuc3RybSwgdGhpcy5kaWN0aW9uYXJ5KTtcbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgICBicmVhaztcbiAgfVxuXG4gIGlmICh0aGlzLmVyciAhPT0gZXhwb3J0cy5aX09LKSB7XG4gICAgdGhpcy5fZXJyb3IoJ0ZhaWxlZCB0byBzZXQgZGljdGlvbmFyeScpO1xuICB9XG59O1xuXG5abGliLnByb3RvdHlwZS5fcmVzZXQgPSBmdW5jdGlvbiAoKSB7XG4gIHRoaXMuZXJyID0gZXhwb3J0cy5aX09LO1xuXG4gIHN3aXRjaCAodGhpcy5tb2RlKSB7XG4gICAgY2FzZSBleHBvcnRzLkRFRkxBVEU6XG4gICAgY2FzZSBleHBvcnRzLkRFRkxBVEVSQVc6XG4gICAgY2FzZSBleHBvcnRzLkdaSVA6XG4gICAgICB0aGlzLmVyciA9IHpsaWJfZGVmbGF0ZS5kZWZsYXRlUmVzZXQodGhpcy5zdHJtKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgZXhwb3J0cy5JTkZMQVRFOlxuICAgIGNhc2UgZXhwb3J0cy5JTkZMQVRFUkFXOlxuICAgIGNhc2UgZXhwb3J0cy5HVU5aSVA6XG4gICAgICB0aGlzLmVyciA9IHpsaWJfaW5mbGF0ZS5pbmZsYXRlUmVzZXQodGhpcy5zdHJtKTtcbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgICBicmVhaztcbiAgfVxuXG4gIGlmICh0aGlzLmVyciAhPT0gZXhwb3J0cy5aX09LKSB7XG4gICAgdGhpcy5fZXJyb3IoJ0ZhaWxlZCB0byByZXNldCBzdHJlYW0nKTtcbiAgfVxufTtcblxuZXhwb3J0cy5abGliID0gWmxpYjsiXSwic291cmNlUm9vdCI6IiJ9