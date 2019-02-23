(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["vendor/vendor.sshpk"],{

/***/ "/e07":
/*!*************************************************!*\
  !*** ./node_modules/sshpk/lib/formats/pkcs1.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// Copyright 2015 Joyent, Inc.

module.exports = {
	read: read,
	readPkcs1: readPkcs1,
	write: write,
	writePkcs1: writePkcs1
};

var assert = __webpack_require__(/*! assert-plus */ "60GX");
var asn1 = __webpack_require__(/*! asn1 */ "ZkxX");
var Buffer = __webpack_require__(/*! safer-buffer */ "xZGU").Buffer;
var algs = __webpack_require__(/*! ../algs */ "r++l");
var utils = __webpack_require__(/*! ../utils */ "43+q");

var Key = __webpack_require__(/*! ../key */ "qfPv");
var PrivateKey = __webpack_require__(/*! ../private-key */ "UtVk");
var pem = __webpack_require__(/*! ./pem */ "ViER");

var pkcs8 = __webpack_require__(/*! ./pkcs8 */ "ZLZ5");
var readECDSACurve = pkcs8.readECDSACurve;

function read(buf, options) {
	return (pem.read(buf, options, 'pkcs1'));
}

function write(key, options) {
	return (pem.write(key, options, 'pkcs1'));
}

/* Helper to read in a single mpint */
function readMPInt(der, nm) {
	assert.strictEqual(der.peek(), asn1.Ber.Integer,
	    nm + ' is not an Integer');
	return (utils.mpNormalize(der.readString(asn1.Ber.Integer, true)));
}

function readPkcs1(alg, type, der) {
	switch (alg) {
	case 'RSA':
		if (type === 'public')
			return (readPkcs1RSAPublic(der));
		else if (type === 'private')
			return (readPkcs1RSAPrivate(der));
		throw (new Error('Unknown key type: ' + type));
	case 'DSA':
		if (type === 'public')
			return (readPkcs1DSAPublic(der));
		else if (type === 'private')
			return (readPkcs1DSAPrivate(der));
		throw (new Error('Unknown key type: ' + type));
	case 'EC':
	case 'ECDSA':
		if (type === 'private')
			return (readPkcs1ECDSAPrivate(der));
		else if (type === 'public')
			return (readPkcs1ECDSAPublic(der));
		throw (new Error('Unknown key type: ' + type));
	case 'EDDSA':
	case 'EdDSA':
		if (type === 'private')
			return (readPkcs1EdDSAPrivate(der));
		throw (new Error(type + ' keys not supported with EdDSA'));
	default:
		throw (new Error('Unknown key algo: ' + alg));
	}
}

function readPkcs1RSAPublic(der) {
	// modulus and exponent
	var n = readMPInt(der, 'modulus');
	var e = readMPInt(der, 'exponent');

	// now, make the key
	var key = {
		type: 'rsa',
		parts: [
			{ name: 'e', data: e },
			{ name: 'n', data: n }
		]
	};

	return (new Key(key));
}

function readPkcs1RSAPrivate(der) {
	var version = readMPInt(der, 'version');
	assert.strictEqual(version[0], 0);

	// modulus then public exponent
	var n = readMPInt(der, 'modulus');
	var e = readMPInt(der, 'public exponent');
	var d = readMPInt(der, 'private exponent');
	var p = readMPInt(der, 'prime1');
	var q = readMPInt(der, 'prime2');
	var dmodp = readMPInt(der, 'exponent1');
	var dmodq = readMPInt(der, 'exponent2');
	var iqmp = readMPInt(der, 'iqmp');

	// now, make the key
	var key = {
		type: 'rsa',
		parts: [
			{ name: 'n', data: n },
			{ name: 'e', data: e },
			{ name: 'd', data: d },
			{ name: 'iqmp', data: iqmp },
			{ name: 'p', data: p },
			{ name: 'q', data: q },
			{ name: 'dmodp', data: dmodp },
			{ name: 'dmodq', data: dmodq }
		]
	};

	return (new PrivateKey(key));
}

function readPkcs1DSAPrivate(der) {
	var version = readMPInt(der, 'version');
	assert.strictEqual(version.readUInt8(0), 0);

	var p = readMPInt(der, 'p');
	var q = readMPInt(der, 'q');
	var g = readMPInt(der, 'g');
	var y = readMPInt(der, 'y');
	var x = readMPInt(der, 'x');

	// now, make the key
	var key = {
		type: 'dsa',
		parts: [
			{ name: 'p', data: p },
			{ name: 'q', data: q },
			{ name: 'g', data: g },
			{ name: 'y', data: y },
			{ name: 'x', data: x }
		]
	};

	return (new PrivateKey(key));
}

function readPkcs1EdDSAPrivate(der) {
	var version = readMPInt(der, 'version');
	assert.strictEqual(version.readUInt8(0), 1);

	// private key
	var k = der.readString(asn1.Ber.OctetString, true);

	der.readSequence(0xa0);
	var oid = der.readOID();
	assert.strictEqual(oid, '1.3.101.112', 'the ed25519 curve identifier');

	der.readSequence(0xa1);
	var A = utils.readBitString(der);

	var key = {
		type: 'ed25519',
		parts: [
			{ name: 'A', data: utils.zeroPadToLength(A, 32) },
			{ name: 'k', data: k }
		]
	};

	return (new PrivateKey(key));
}

function readPkcs1DSAPublic(der) {
	var y = readMPInt(der, 'y');
	var p = readMPInt(der, 'p');
	var q = readMPInt(der, 'q');
	var g = readMPInt(der, 'g');

	var key = {
		type: 'dsa',
		parts: [
			{ name: 'y', data: y },
			{ name: 'p', data: p },
			{ name: 'q', data: q },
			{ name: 'g', data: g }
		]
	};

	return (new Key(key));
}

function readPkcs1ECDSAPublic(der) {
	der.readSequence();

	var oid = der.readOID();
	assert.strictEqual(oid, '1.2.840.10045.2.1', 'must be ecPublicKey');

	var curveOid = der.readOID();

	var curve;
	var curves = Object.keys(algs.curves);
	for (var j = 0; j < curves.length; ++j) {
		var c = curves[j];
		var cd = algs.curves[c];
		if (cd.pkcs8oid === curveOid) {
			curve = c;
			break;
		}
	}
	assert.string(curve, 'a known ECDSA named curve');

	var Q = der.readString(asn1.Ber.BitString, true);
	Q = utils.ecNormalize(Q);

	var key = {
		type: 'ecdsa',
		parts: [
			{ name: 'curve', data: Buffer.from(curve) },
			{ name: 'Q', data: Q }
		]
	};

	return (new Key(key));
}

function readPkcs1ECDSAPrivate(der) {
	var version = readMPInt(der, 'version');
	assert.strictEqual(version.readUInt8(0), 1);

	// private key
	var d = der.readString(asn1.Ber.OctetString, true);

	der.readSequence(0xa0);
	var curve = readECDSACurve(der);
	assert.string(curve, 'a known elliptic curve');

	der.readSequence(0xa1);
	var Q = der.readString(asn1.Ber.BitString, true);
	Q = utils.ecNormalize(Q);

	var key = {
		type: 'ecdsa',
		parts: [
			{ name: 'curve', data: Buffer.from(curve) },
			{ name: 'Q', data: Q },
			{ name: 'd', data: d }
		]
	};

	return (new PrivateKey(key));
}

function writePkcs1(der, key) {
	der.startSequence();

	switch (key.type) {
	case 'rsa':
		if (PrivateKey.isPrivateKey(key))
			writePkcs1RSAPrivate(der, key);
		else
			writePkcs1RSAPublic(der, key);
		break;
	case 'dsa':
		if (PrivateKey.isPrivateKey(key))
			writePkcs1DSAPrivate(der, key);
		else
			writePkcs1DSAPublic(der, key);
		break;
	case 'ecdsa':
		if (PrivateKey.isPrivateKey(key))
			writePkcs1ECDSAPrivate(der, key);
		else
			writePkcs1ECDSAPublic(der, key);
		break;
	case 'ed25519':
		if (PrivateKey.isPrivateKey(key))
			writePkcs1EdDSAPrivate(der, key);
		else
			writePkcs1EdDSAPublic(der, key);
		break;
	default:
		throw (new Error('Unknown key algo: ' + key.type));
	}

	der.endSequence();
}

function writePkcs1RSAPublic(der, key) {
	der.writeBuffer(key.part.n.data, asn1.Ber.Integer);
	der.writeBuffer(key.part.e.data, asn1.Ber.Integer);
}

function writePkcs1RSAPrivate(der, key) {
	var ver = Buffer.from([0]);
	der.writeBuffer(ver, asn1.Ber.Integer);

	der.writeBuffer(key.part.n.data, asn1.Ber.Integer);
	der.writeBuffer(key.part.e.data, asn1.Ber.Integer);
	der.writeBuffer(key.part.d.data, asn1.Ber.Integer);
	der.writeBuffer(key.part.p.data, asn1.Ber.Integer);
	der.writeBuffer(key.part.q.data, asn1.Ber.Integer);
	if (!key.part.dmodp || !key.part.dmodq)
		utils.addRSAMissing(key);
	der.writeBuffer(key.part.dmodp.data, asn1.Ber.Integer);
	der.writeBuffer(key.part.dmodq.data, asn1.Ber.Integer);
	der.writeBuffer(key.part.iqmp.data, asn1.Ber.Integer);
}

function writePkcs1DSAPrivate(der, key) {
	var ver = Buffer.from([0]);
	der.writeBuffer(ver, asn1.Ber.Integer);

	der.writeBuffer(key.part.p.data, asn1.Ber.Integer);
	der.writeBuffer(key.part.q.data, asn1.Ber.Integer);
	der.writeBuffer(key.part.g.data, asn1.Ber.Integer);
	der.writeBuffer(key.part.y.data, asn1.Ber.Integer);
	der.writeBuffer(key.part.x.data, asn1.Ber.Integer);
}

function writePkcs1DSAPublic(der, key) {
	der.writeBuffer(key.part.y.data, asn1.Ber.Integer);
	der.writeBuffer(key.part.p.data, asn1.Ber.Integer);
	der.writeBuffer(key.part.q.data, asn1.Ber.Integer);
	der.writeBuffer(key.part.g.data, asn1.Ber.Integer);
}

function writePkcs1ECDSAPublic(der, key) {
	der.startSequence();

	der.writeOID('1.2.840.10045.2.1'); /* ecPublicKey */
	var curve = key.part.curve.data.toString();
	var curveOid = algs.curves[curve].pkcs8oid;
	assert.string(curveOid, 'a known ECDSA named curve');
	der.writeOID(curveOid);

	der.endSequence();

	var Q = utils.ecNormalize(key.part.Q.data, true);
	der.writeBuffer(Q, asn1.Ber.BitString);
}

function writePkcs1ECDSAPrivate(der, key) {
	var ver = Buffer.from([1]);
	der.writeBuffer(ver, asn1.Ber.Integer);

	der.writeBuffer(key.part.d.data, asn1.Ber.OctetString);

	der.startSequence(0xa0);
	var curve = key.part.curve.data.toString();
	var curveOid = algs.curves[curve].pkcs8oid;
	assert.string(curveOid, 'a known ECDSA named curve');
	der.writeOID(curveOid);
	der.endSequence();

	der.startSequence(0xa1);
	var Q = utils.ecNormalize(key.part.Q.data, true);
	der.writeBuffer(Q, asn1.Ber.BitString);
	der.endSequence();
}

function writePkcs1EdDSAPrivate(der, key) {
	var ver = Buffer.from([1]);
	der.writeBuffer(ver, asn1.Ber.Integer);

	der.writeBuffer(key.part.k.data, asn1.Ber.OctetString);

	der.startSequence(0xa0);
	der.writeOID('1.3.101.112');
	der.endSequence();

	der.startSequence(0xa1);
	utils.writeBitString(der, key.part.A.data);
	der.endSequence();
}

function writePkcs1EdDSAPublic(der, key) {
	throw (new Error('Public keys are not supported for EdDSA PKCS#1'));
}


/***/ }),

/***/ "0YyV":
/*!********************************************************!*\
  !*** ./node_modules/sshpk/lib/formats/openssh-cert.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// Copyright 2017 Joyent, Inc.

module.exports = {
	read: read,
	verify: verify,
	sign: sign,
	signAsync: signAsync,
	write: write,

	/* Internal private API */
	fromBuffer: fromBuffer,
	toBuffer: toBuffer
};

var assert = __webpack_require__(/*! assert-plus */ "60GX");
var SSHBuffer = __webpack_require__(/*! ../ssh-buffer */ "cPuN");
var crypto = __webpack_require__(/*! crypto */ "HEbw");
var Buffer = __webpack_require__(/*! safer-buffer */ "xZGU").Buffer;
var algs = __webpack_require__(/*! ../algs */ "r++l");
var Key = __webpack_require__(/*! ../key */ "qfPv");
var PrivateKey = __webpack_require__(/*! ../private-key */ "UtVk");
var Identity = __webpack_require__(/*! ../identity */ "vBLe");
var rfc4253 = __webpack_require__(/*! ./rfc4253 */ "hSbD");
var Signature = __webpack_require__(/*! ../signature */ "ZVj6");
var utils = __webpack_require__(/*! ../utils */ "43+q");
var Certificate = __webpack_require__(/*! ../certificate */ "m1HP");

function verify(cert, key) {
	/*
	 * We always give an issuerKey, so if our verify() is being called then
	 * there was no signature. Return false.
	 */
	return (false);
}

var TYPES = {
	'user': 1,
	'host': 2
};
Object.keys(TYPES).forEach(function (k) { TYPES[TYPES[k]] = k; });

var ECDSA_ALGO = /^ecdsa-sha2-([^@-]+)-cert-v01@openssh.com$/;

function read(buf, options) {
	if (Buffer.isBuffer(buf))
		buf = buf.toString('ascii');
	var parts = buf.trim().split(/[ \t\n]+/g);
	if (parts.length < 2 || parts.length > 3)
		throw (new Error('Not a valid SSH certificate line'));

	var algo = parts[0];
	var data = parts[1];

	data = Buffer.from(data, 'base64');
	return (fromBuffer(data, algo));
}

function fromBuffer(data, algo, partial) {
	var sshbuf = new SSHBuffer({ buffer: data });
	var innerAlgo = sshbuf.readString();
	if (algo !== undefined && innerAlgo !== algo)
		throw (new Error('SSH certificate algorithm mismatch'));
	if (algo === undefined)
		algo = innerAlgo;

	var cert = {};
	cert.signatures = {};
	cert.signatures.openssh = {};

	cert.signatures.openssh.nonce = sshbuf.readBuffer();

	var key = {};
	var parts = (key.parts = []);
	key.type = getAlg(algo);

	var partCount = algs.info[key.type].parts.length;
	while (parts.length < partCount)
		parts.push(sshbuf.readPart());
	assert.ok(parts.length >= 1, 'key must have at least one part');

	var algInfo = algs.info[key.type];
	if (key.type === 'ecdsa') {
		var res = ECDSA_ALGO.exec(algo);
		assert.ok(res !== null);
		assert.strictEqual(res[1], parts[0].data.toString());
	}

	for (var i = 0; i < algInfo.parts.length; ++i) {
		parts[i].name = algInfo.parts[i];
		if (parts[i].name !== 'curve' &&
		    algInfo.normalize !== false) {
			var p = parts[i];
			p.data = utils.mpNormalize(p.data);
		}
	}

	cert.subjectKey = new Key(key);

	cert.serial = sshbuf.readInt64();

	var type = TYPES[sshbuf.readInt()];
	assert.string(type, 'valid cert type');

	cert.signatures.openssh.keyId = sshbuf.readString();

	var principals = [];
	var pbuf = sshbuf.readBuffer();
	var psshbuf = new SSHBuffer({ buffer: pbuf });
	while (!psshbuf.atEnd())
		principals.push(psshbuf.readString());
	if (principals.length === 0)
		principals = ['*'];

	cert.subjects = principals.map(function (pr) {
		if (type === 'user')
			return (Identity.forUser(pr));
		else if (type === 'host')
			return (Identity.forHost(pr));
		throw (new Error('Unknown identity type ' + type));
	});

	cert.validFrom = int64ToDate(sshbuf.readInt64());
	cert.validUntil = int64ToDate(sshbuf.readInt64());

	var exts = [];
	var extbuf = new SSHBuffer({ buffer: sshbuf.readBuffer() });
	var ext;
	while (!extbuf.atEnd()) {
		ext = { critical: true };
		ext.name = extbuf.readString();
		ext.data = extbuf.readBuffer();
		exts.push(ext);
	}
	extbuf = new SSHBuffer({ buffer: sshbuf.readBuffer() });
	while (!extbuf.atEnd()) {
		ext = { critical: false };
		ext.name = extbuf.readString();
		ext.data = extbuf.readBuffer();
		exts.push(ext);
	}
	cert.signatures.openssh.exts = exts;

	/* reserved */
	sshbuf.readBuffer();

	var signingKeyBuf = sshbuf.readBuffer();
	cert.issuerKey = rfc4253.read(signingKeyBuf);

	/*
	 * OpenSSH certs don't give the identity of the issuer, just their
	 * public key. So, we use an Identity that matches anything. The
	 * isSignedBy() function will later tell you if the key matches.
	 */
	cert.issuer = Identity.forHost('**');

	var sigBuf = sshbuf.readBuffer();
	cert.signatures.openssh.signature =
	    Signature.parse(sigBuf, cert.issuerKey.type, 'ssh');

	if (partial !== undefined) {
		partial.remainder = sshbuf.remainder();
		partial.consumed = sshbuf._offset;
	}

	return (new Certificate(cert));
}

function int64ToDate(buf) {
	var i = buf.readUInt32BE(0) * 4294967296;
	i += buf.readUInt32BE(4);
	var d = new Date();
	d.setTime(i * 1000);
	d.sourceInt64 = buf;
	return (d);
}

function dateToInt64(date) {
	if (date.sourceInt64 !== undefined)
		return (date.sourceInt64);
	var i = Math.round(date.getTime() / 1000);
	var upper = Math.floor(i / 4294967296);
	var lower = Math.floor(i % 4294967296);
	var buf = Buffer.alloc(8);
	buf.writeUInt32BE(upper, 0);
	buf.writeUInt32BE(lower, 4);
	return (buf);
}

function sign(cert, key) {
	if (cert.signatures.openssh === undefined)
		cert.signatures.openssh = {};
	try {
		var blob = toBuffer(cert, true);
	} catch (e) {
		delete (cert.signatures.openssh);
		return (false);
	}
	var sig = cert.signatures.openssh;
	var hashAlgo = undefined;
	if (key.type === 'rsa' || key.type === 'dsa')
		hashAlgo = 'sha1';
	var signer = key.createSign(hashAlgo);
	signer.write(blob);
	sig.signature = signer.sign();
	return (true);
}

function signAsync(cert, signer, done) {
	if (cert.signatures.openssh === undefined)
		cert.signatures.openssh = {};
	try {
		var blob = toBuffer(cert, true);
	} catch (e) {
		delete (cert.signatures.openssh);
		done(e);
		return;
	}
	var sig = cert.signatures.openssh;

	signer(blob, function (err, signature) {
		if (err) {
			done(err);
			return;
		}
		try {
			/*
			 * This will throw if the signature isn't of a
			 * type/algo that can be used for SSH.
			 */
			signature.toBuffer('ssh');
		} catch (e) {
			done(e);
			return;
		}
		sig.signature = signature;
		done();
	});
}

function write(cert, options) {
	if (options === undefined)
		options = {};

	var blob = toBuffer(cert);
	var out = getCertType(cert.subjectKey) + ' ' + blob.toString('base64');
	if (options.comment)
		out = out + ' ' + options.comment;
	return (out);
}


function toBuffer(cert, noSig) {
	assert.object(cert.signatures.openssh, 'signature for openssh format');
	var sig = cert.signatures.openssh;

	if (sig.nonce === undefined)
		sig.nonce = crypto.randomBytes(16);
	var buf = new SSHBuffer({});
	buf.writeString(getCertType(cert.subjectKey));
	buf.writeBuffer(sig.nonce);

	var key = cert.subjectKey;
	var algInfo = algs.info[key.type];
	algInfo.parts.forEach(function (part) {
		buf.writePart(key.part[part]);
	});

	buf.writeInt64(cert.serial);

	var type = cert.subjects[0].type;
	assert.notStrictEqual(type, 'unknown');
	cert.subjects.forEach(function (id) {
		assert.strictEqual(id.type, type);
	});
	type = TYPES[type];
	buf.writeInt(type);

	if (sig.keyId === undefined) {
		sig.keyId = cert.subjects[0].type + '_' +
		    (cert.subjects[0].uid || cert.subjects[0].hostname);
	}
	buf.writeString(sig.keyId);

	var sub = new SSHBuffer({});
	cert.subjects.forEach(function (id) {
		if (type === TYPES.host)
			sub.writeString(id.hostname);
		else if (type === TYPES.user)
			sub.writeString(id.uid);
	});
	buf.writeBuffer(sub.toBuffer());

	buf.writeInt64(dateToInt64(cert.validFrom));
	buf.writeInt64(dateToInt64(cert.validUntil));

	var exts = sig.exts;
	if (exts === undefined)
		exts = [];

	var extbuf = new SSHBuffer({});
	exts.forEach(function (ext) {
		if (ext.critical !== true)
			return;
		extbuf.writeString(ext.name);
		extbuf.writeBuffer(ext.data);
	});
	buf.writeBuffer(extbuf.toBuffer());

	extbuf = new SSHBuffer({});
	exts.forEach(function (ext) {
		if (ext.critical === true)
			return;
		extbuf.writeString(ext.name);
		extbuf.writeBuffer(ext.data);
	});
	buf.writeBuffer(extbuf.toBuffer());

	/* reserved */
	buf.writeBuffer(Buffer.alloc(0));

	sub = rfc4253.write(cert.issuerKey);
	buf.writeBuffer(sub);

	if (!noSig)
		buf.writeBuffer(sig.signature.toBuffer('ssh'));

	return (buf.toBuffer());
}

function getAlg(certType) {
	if (certType === 'ssh-rsa-cert-v01@openssh.com')
		return ('rsa');
	if (certType === 'ssh-dss-cert-v01@openssh.com')
		return ('dsa');
	if (certType.match(ECDSA_ALGO))
		return ('ecdsa');
	if (certType === 'ssh-ed25519-cert-v01@openssh.com')
		return ('ed25519');
	throw (new Error('Unsupported cert type ' + certType));
}

function getCertType(key) {
	if (key.type === 'rsa')
		return ('ssh-rsa-cert-v01@openssh.com');
	if (key.type === 'dsa')
		return ('ssh-dss-cert-v01@openssh.com');
	if (key.type === 'ecdsa')
		return ('ecdsa-sha2-' + key.curve + '-cert-v01@openssh.com');
	if (key.type === 'ed25519')
		return ('ssh-ed25519-cert-v01@openssh.com');
	throw (new Error('Unsupported key type ' + key.type));
}


/***/ }),

/***/ "2LYn":
/*!*******************************************************!*\
  !*** ./node_modules/sshpk/lib/formats/ssh-private.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// Copyright 2015 Joyent, Inc.

module.exports = {
	read: read,
	readSSHPrivate: readSSHPrivate,
	write: write
};

var assert = __webpack_require__(/*! assert-plus */ "60GX");
var asn1 = __webpack_require__(/*! asn1 */ "ZkxX");
var Buffer = __webpack_require__(/*! safer-buffer */ "xZGU").Buffer;
var algs = __webpack_require__(/*! ../algs */ "r++l");
var utils = __webpack_require__(/*! ../utils */ "43+q");
var crypto = __webpack_require__(/*! crypto */ "HEbw");

var Key = __webpack_require__(/*! ../key */ "qfPv");
var PrivateKey = __webpack_require__(/*! ../private-key */ "UtVk");
var pem = __webpack_require__(/*! ./pem */ "ViER");
var rfc4253 = __webpack_require__(/*! ./rfc4253 */ "hSbD");
var SSHBuffer = __webpack_require__(/*! ../ssh-buffer */ "cPuN");
var errors = __webpack_require__(/*! ../errors */ "HvMK");

var bcrypt;

function read(buf, options) {
	return (pem.read(buf, options));
}

var MAGIC = 'openssh-key-v1';

function readSSHPrivate(type, buf, options) {
	buf = new SSHBuffer({buffer: buf});

	var magic = buf.readCString();
	assert.strictEqual(magic, MAGIC, 'bad magic string');

	var cipher = buf.readString();
	var kdf = buf.readString();
	var kdfOpts = buf.readBuffer();

	var nkeys = buf.readInt();
	if (nkeys !== 1) {
		throw (new Error('OpenSSH-format key file contains ' +
		    'multiple keys: this is unsupported.'));
	}

	var pubKey = buf.readBuffer();

	if (type === 'public') {
		assert.ok(buf.atEnd(), 'excess bytes left after key');
		return (rfc4253.read(pubKey));
	}

	var privKeyBlob = buf.readBuffer();
	assert.ok(buf.atEnd(), 'excess bytes left after key');

	var kdfOptsBuf = new SSHBuffer({ buffer: kdfOpts });
	switch (kdf) {
	case 'none':
		if (cipher !== 'none') {
			throw (new Error('OpenSSH-format key uses KDF "none" ' +
			     'but specifies a cipher other than "none"'));
		}
		break;
	case 'bcrypt':
		var salt = kdfOptsBuf.readBuffer();
		var rounds = kdfOptsBuf.readInt();
		var cinf = utils.opensshCipherInfo(cipher);
		if (bcrypt === undefined) {
			bcrypt = __webpack_require__(/*! bcrypt-pbkdf */ "ZBUn");
		}

		if (typeof (options.passphrase) === 'string') {
			options.passphrase = Buffer.from(options.passphrase,
			    'utf-8');
		}
		if (!Buffer.isBuffer(options.passphrase)) {
			throw (new errors.KeyEncryptedError(
			    options.filename, 'OpenSSH'));
		}

		var pass = new Uint8Array(options.passphrase);
		var salti = new Uint8Array(salt);
		/* Use the pbkdf to derive both the key and the IV. */
		var out = new Uint8Array(cinf.keySize + cinf.blockSize);
		var res = bcrypt.pbkdf(pass, pass.length, salti, salti.length,
		    out, out.length, rounds);
		if (res !== 0) {
			throw (new Error('bcrypt_pbkdf function returned ' +
			    'failure, parameters invalid'));
		}
		out = Buffer.from(out);
		var ckey = out.slice(0, cinf.keySize);
		var iv = out.slice(cinf.keySize, cinf.keySize + cinf.blockSize);
		var cipherStream = crypto.createDecipheriv(cinf.opensslName,
		    ckey, iv);
		cipherStream.setAutoPadding(false);
		var chunk, chunks = [];
		cipherStream.once('error', function (e) {
			if (e.toString().indexOf('bad decrypt') !== -1) {
				throw (new Error('Incorrect passphrase ' +
				    'supplied, could not decrypt key'));
			}
			throw (e);
		});
		cipherStream.write(privKeyBlob);
		cipherStream.end();
		while ((chunk = cipherStream.read()) !== null)
			chunks.push(chunk);
		privKeyBlob = Buffer.concat(chunks);
		break;
	default:
		throw (new Error(
		    'OpenSSH-format key uses unknown KDF "' + kdf + '"'));
	}

	buf = new SSHBuffer({buffer: privKeyBlob});

	var checkInt1 = buf.readInt();
	var checkInt2 = buf.readInt();
	if (checkInt1 !== checkInt2) {
		throw (new Error('Incorrect passphrase supplied, could not ' +
		    'decrypt key'));
	}

	var ret = {};
	var key = rfc4253.readInternal(ret, 'private', buf.remainder());

	buf.skip(ret.consumed);

	var comment = buf.readString();
	key.comment = comment;

	return (key);
}

function write(key, options) {
	var pubKey;
	if (PrivateKey.isPrivateKey(key))
		pubKey = key.toPublic();
	else
		pubKey = key;

	var cipher = 'none';
	var kdf = 'none';
	var kdfopts = Buffer.alloc(0);
	var cinf = { blockSize: 8 };
	var passphrase;
	if (options !== undefined) {
		passphrase = options.passphrase;
		if (typeof (passphrase) === 'string')
			passphrase = Buffer.from(passphrase, 'utf-8');
		if (passphrase !== undefined) {
			assert.buffer(passphrase, 'options.passphrase');
			assert.optionalString(options.cipher, 'options.cipher');
			cipher = options.cipher;
			if (cipher === undefined)
				cipher = 'aes128-ctr';
			cinf = utils.opensshCipherInfo(cipher);
			kdf = 'bcrypt';
		}
	}

	var privBuf;
	if (PrivateKey.isPrivateKey(key)) {
		privBuf = new SSHBuffer({});
		var checkInt = crypto.randomBytes(4).readUInt32BE(0);
		privBuf.writeInt(checkInt);
		privBuf.writeInt(checkInt);
		privBuf.write(key.toBuffer('rfc4253'));
		privBuf.writeString(key.comment || '');

		var n = 1;
		while (privBuf._offset % cinf.blockSize !== 0)
			privBuf.writeChar(n++);
		privBuf = privBuf.toBuffer();
	}

	switch (kdf) {
	case 'none':
		break;
	case 'bcrypt':
		var salt = crypto.randomBytes(16);
		var rounds = 16;
		var kdfssh = new SSHBuffer({});
		kdfssh.writeBuffer(salt);
		kdfssh.writeInt(rounds);
		kdfopts = kdfssh.toBuffer();

		if (bcrypt === undefined) {
			bcrypt = __webpack_require__(/*! bcrypt-pbkdf */ "ZBUn");
		}
		var pass = new Uint8Array(passphrase);
		var salti = new Uint8Array(salt);
		/* Use the pbkdf to derive both the key and the IV. */
		var out = new Uint8Array(cinf.keySize + cinf.blockSize);
		var res = bcrypt.pbkdf(pass, pass.length, salti, salti.length,
		    out, out.length, rounds);
		if (res !== 0) {
			throw (new Error('bcrypt_pbkdf function returned ' +
			    'failure, parameters invalid'));
		}
		out = Buffer.from(out);
		var ckey = out.slice(0, cinf.keySize);
		var iv = out.slice(cinf.keySize, cinf.keySize + cinf.blockSize);

		var cipherStream = crypto.createCipheriv(cinf.opensslName,
		    ckey, iv);
		cipherStream.setAutoPadding(false);
		var chunk, chunks = [];
		cipherStream.once('error', function (e) {
			throw (e);
		});
		cipherStream.write(privBuf);
		cipherStream.end();
		while ((chunk = cipherStream.read()) !== null)
			chunks.push(chunk);
		privBuf = Buffer.concat(chunks);
		break;
	default:
		throw (new Error('Unsupported kdf ' + kdf));
	}

	var buf = new SSHBuffer({});

	buf.writeCString(MAGIC);
	buf.writeString(cipher);	/* cipher */
	buf.writeString(kdf);		/* kdf */
	buf.writeBuffer(kdfopts);	/* kdfoptions */

	buf.writeInt(1);		/* nkeys */
	buf.writeBuffer(pubKey.toBuffer('rfc4253'));

	if (privBuf)
		buf.writeBuffer(privBuf);

	buf = buf.toBuffer();

	var header;
	if (PrivateKey.isPrivateKey(key))
		header = 'OPENSSH PRIVATE KEY';
	else
		header = 'OPENSSH PUBLIC KEY';

	var tmp = buf.toString('base64');
	var len = tmp.length + (tmp.length / 70) +
	    18 + 16 + header.length*2 + 10;
	buf = Buffer.alloc(len);
	var o = 0;
	o += buf.write('-----BEGIN ' + header + '-----\n', o);
	for (var i = 0; i < tmp.length; ) {
		var limit = i + 70;
		if (limit > tmp.length)
			limit = tmp.length;
		o += buf.write(tmp.slice(i, limit), o);
		buf[o++] = 10;
		i = limit;
	}
	o += buf.write('-----END ' + header + '-----\n', o);

	return (buf.slice(0, o));
}


/***/ }),

/***/ "30lM":
/*!************************************************!*\
  !*** ./node_modules/sshpk/lib/formats/auto.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// Copyright 2018 Joyent, Inc.

module.exports = {
	read: read,
	write: write
};

var assert = __webpack_require__(/*! assert-plus */ "60GX");
var Buffer = __webpack_require__(/*! safer-buffer */ "xZGU").Buffer;
var utils = __webpack_require__(/*! ../utils */ "43+q");
var Key = __webpack_require__(/*! ../key */ "qfPv");
var PrivateKey = __webpack_require__(/*! ../private-key */ "UtVk");

var pem = __webpack_require__(/*! ./pem */ "ViER");
var ssh = __webpack_require__(/*! ./ssh */ "gEnT");
var rfc4253 = __webpack_require__(/*! ./rfc4253 */ "hSbD");
var dnssec = __webpack_require__(/*! ./dnssec */ "YiDp");
var putty = __webpack_require__(/*! ./putty */ "c2cS");

var DNSSEC_PRIVKEY_HEADER_PREFIX = 'Private-key-format: v1';

function read(buf, options) {
	if (typeof (buf) === 'string') {
		if (buf.trim().match(/^[-]+[ ]*BEGIN/))
			return (pem.read(buf, options));
		if (buf.match(/^\s*ssh-[a-z]/))
			return (ssh.read(buf, options));
		if (buf.match(/^\s*ecdsa-/))
			return (ssh.read(buf, options));
		if (buf.match(/^putty-user-key-file-2:/i))
			return (putty.read(buf, options));
		if (findDNSSECHeader(buf))
			return (dnssec.read(buf, options));
		buf = Buffer.from(buf, 'binary');
	} else {
		assert.buffer(buf);
		if (findPEMHeader(buf))
			return (pem.read(buf, options));
		if (findSSHHeader(buf))
			return (ssh.read(buf, options));
		if (findPuTTYHeader(buf))
			return (putty.read(buf, options));
		if (findDNSSECHeader(buf))
			return (dnssec.read(buf, options));
	}
	if (buf.readUInt32BE(0) < buf.length)
		return (rfc4253.read(buf, options));
	throw (new Error('Failed to auto-detect format of key'));
}

function findPuTTYHeader(buf) {
	var offset = 0;
	while (offset < buf.length &&
	    (buf[offset] === 32 || buf[offset] === 10 || buf[offset] === 9))
		++offset;
	if (offset + 22 <= buf.length &&
	    buf.slice(offset, offset + 22).toString('ascii').toLowerCase() ===
	    'putty-user-key-file-2:')
		return (true);
	return (false);
}

function findSSHHeader(buf) {
	var offset = 0;
	while (offset < buf.length &&
	    (buf[offset] === 32 || buf[offset] === 10 || buf[offset] === 9))
		++offset;
	if (offset + 4 <= buf.length &&
	    buf.slice(offset, offset + 4).toString('ascii') === 'ssh-')
		return (true);
	if (offset + 6 <= buf.length &&
	    buf.slice(offset, offset + 6).toString('ascii') === 'ecdsa-')
		return (true);
	return (false);
}

function findPEMHeader(buf) {
	var offset = 0;
	while (offset < buf.length &&
	    (buf[offset] === 32 || buf[offset] === 10))
		++offset;
	if (buf[offset] !== 45)
		return (false);
	while (offset < buf.length &&
	    (buf[offset] === 45))
		++offset;
	while (offset < buf.length &&
	    (buf[offset] === 32))
		++offset;
	if (offset + 5 > buf.length ||
	    buf.slice(offset, offset + 5).toString('ascii') !== 'BEGIN')
		return (false);
	return (true);
}

function findDNSSECHeader(buf) {
	// private case first
	if (buf.length <= DNSSEC_PRIVKEY_HEADER_PREFIX.length)
		return (false);
	var headerCheck = buf.slice(0, DNSSEC_PRIVKEY_HEADER_PREFIX.length);
	if (headerCheck.toString('ascii') === DNSSEC_PRIVKEY_HEADER_PREFIX)
		return (true);

	// public-key RFC3110 ?
	// 'domain.com. IN KEY ...' or 'domain.com. IN DNSKEY ...'
	// skip any comment-lines
	if (typeof (buf) !== 'string') {
		buf = buf.toString('ascii');
	}
	var lines = buf.split('\n');
	var line = 0;
	/* JSSTYLED */
	while (lines[line].match(/^\;/))
		line++;
	if (lines[line].toString('ascii').match(/\. IN KEY /))
		return (true);
	if (lines[line].toString('ascii').match(/\. IN DNSKEY /))
		return (true);
	return (false);
}

function write(key, options) {
	throw (new Error('"auto" format cannot be used for writing'));
}


/***/ }),

/***/ "43+q":
/*!*****************************************!*\
  !*** ./node_modules/sshpk/lib/utils.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// Copyright 2015 Joyent, Inc.

module.exports = {
	bufferSplit: bufferSplit,
	addRSAMissing: addRSAMissing,
	calculateDSAPublic: calculateDSAPublic,
	calculateED25519Public: calculateED25519Public,
	calculateX25519Public: calculateX25519Public,
	mpNormalize: mpNormalize,
	mpDenormalize: mpDenormalize,
	ecNormalize: ecNormalize,
	countZeros: countZeros,
	assertCompatible: assertCompatible,
	isCompatible: isCompatible,
	opensslKeyDeriv: opensslKeyDeriv,
	opensshCipherInfo: opensshCipherInfo,
	publicFromPrivateECDSA: publicFromPrivateECDSA,
	zeroPadToLength: zeroPadToLength,
	writeBitString: writeBitString,
	readBitString: readBitString,
	pbkdf2: pbkdf2
};

var assert = __webpack_require__(/*! assert-plus */ "60GX");
var Buffer = __webpack_require__(/*! safer-buffer */ "xZGU").Buffer;
var PrivateKey = __webpack_require__(/*! ./private-key */ "UtVk");
var Key = __webpack_require__(/*! ./key */ "qfPv");
var crypto = __webpack_require__(/*! crypto */ "HEbw");
var algs = __webpack_require__(/*! ./algs */ "r++l");
var asn1 = __webpack_require__(/*! asn1 */ "ZkxX");

var ec = __webpack_require__(/*! ecc-jsbn/lib/ec */ "mJl1");
var jsbn = __webpack_require__(/*! jsbn */ "8z4W").BigInteger;
var nacl = __webpack_require__(/*! tweetnacl */ "WKRr");

var MAX_CLASS_DEPTH = 3;

function isCompatible(obj, klass, needVer) {
	if (obj === null || typeof (obj) !== 'object')
		return (false);
	if (needVer === undefined)
		needVer = klass.prototype._sshpkApiVersion;
	if (obj instanceof klass &&
	    klass.prototype._sshpkApiVersion[0] == needVer[0])
		return (true);
	var proto = Object.getPrototypeOf(obj);
	var depth = 0;
	while (proto.constructor.name !== klass.name) {
		proto = Object.getPrototypeOf(proto);
		if (!proto || ++depth > MAX_CLASS_DEPTH)
			return (false);
	}
	if (proto.constructor.name !== klass.name)
		return (false);
	var ver = proto._sshpkApiVersion;
	if (ver === undefined)
		ver = klass._oldVersionDetect(obj);
	if (ver[0] != needVer[0] || ver[1] < needVer[1])
		return (false);
	return (true);
}

function assertCompatible(obj, klass, needVer, name) {
	if (name === undefined)
		name = 'object';
	assert.ok(obj, name + ' must not be null');
	assert.object(obj, name + ' must be an object');
	if (needVer === undefined)
		needVer = klass.prototype._sshpkApiVersion;
	if (obj instanceof klass &&
	    klass.prototype._sshpkApiVersion[0] == needVer[0])
		return;
	var proto = Object.getPrototypeOf(obj);
	var depth = 0;
	while (proto.constructor.name !== klass.name) {
		proto = Object.getPrototypeOf(proto);
		assert.ok(proto && ++depth <= MAX_CLASS_DEPTH,
		    name + ' must be a ' + klass.name + ' instance');
	}
	assert.strictEqual(proto.constructor.name, klass.name,
	    name + ' must be a ' + klass.name + ' instance');
	var ver = proto._sshpkApiVersion;
	if (ver === undefined)
		ver = klass._oldVersionDetect(obj);
	assert.ok(ver[0] == needVer[0] && ver[1] >= needVer[1],
	    name + ' must be compatible with ' + klass.name + ' klass ' +
	    'version ' + needVer[0] + '.' + needVer[1]);
}

var CIPHER_LEN = {
	'des-ede3-cbc': { key: 24, iv: 8 },
	'aes-128-cbc': { key: 16, iv: 16 },
	'aes-256-cbc': { key: 32, iv: 16 }
};
var PKCS5_SALT_LEN = 8;

function opensslKeyDeriv(cipher, salt, passphrase, count) {
	assert.buffer(salt, 'salt');
	assert.buffer(passphrase, 'passphrase');
	assert.number(count, 'iteration count');

	var clen = CIPHER_LEN[cipher];
	assert.object(clen, 'supported cipher');

	salt = salt.slice(0, PKCS5_SALT_LEN);

	var D, D_prev, bufs;
	var material = Buffer.alloc(0);
	while (material.length < clen.key + clen.iv) {
		bufs = [];
		if (D_prev)
			bufs.push(D_prev);
		bufs.push(passphrase);
		bufs.push(salt);
		D = Buffer.concat(bufs);
		for (var j = 0; j < count; ++j)
			D = crypto.createHash('md5').update(D).digest();
		material = Buffer.concat([material, D]);
		D_prev = D;
	}

	return ({
	    key: material.slice(0, clen.key),
	    iv: material.slice(clen.key, clen.key + clen.iv)
	});
}

/* See: RFC2898 */
function pbkdf2(hashAlg, salt, iterations, size, passphrase) {
	var hkey = Buffer.alloc(salt.length + 4);
	salt.copy(hkey);

	var gen = 0, ts = [];
	var i = 1;
	while (gen < size) {
		var t = T(i++);
		gen += t.length;
		ts.push(t);
	}
	return (Buffer.concat(ts).slice(0, size));

	function T(I) {
		hkey.writeUInt32BE(I, hkey.length - 4);

		var hmac = crypto.createHmac(hashAlg, passphrase);
		hmac.update(hkey);

		var Ti = hmac.digest();
		var Uc = Ti;
		var c = 1;
		while (c++ < iterations) {
			hmac = crypto.createHmac(hashAlg, passphrase);
			hmac.update(Uc);
			Uc = hmac.digest();
			for (var x = 0; x < Ti.length; ++x)
				Ti[x] ^= Uc[x];
		}
		return (Ti);
	}
}

/* Count leading zero bits on a buffer */
function countZeros(buf) {
	var o = 0, obit = 8;
	while (o < buf.length) {
		var mask = (1 << obit);
		if ((buf[o] & mask) === mask)
			break;
		obit--;
		if (obit < 0) {
			o++;
			obit = 8;
		}
	}
	return (o*8 + (8 - obit) - 1);
}

function bufferSplit(buf, chr) {
	assert.buffer(buf);
	assert.string(chr);

	var parts = [];
	var lastPart = 0;
	var matches = 0;
	for (var i = 0; i < buf.length; ++i) {
		if (buf[i] === chr.charCodeAt(matches))
			++matches;
		else if (buf[i] === chr.charCodeAt(0))
			matches = 1;
		else
			matches = 0;

		if (matches >= chr.length) {
			var newPart = i + 1;
			parts.push(buf.slice(lastPart, newPart - matches));
			lastPart = newPart;
			matches = 0;
		}
	}
	if (lastPart <= buf.length)
		parts.push(buf.slice(lastPart, buf.length));

	return (parts);
}

function ecNormalize(buf, addZero) {
	assert.buffer(buf);
	if (buf[0] === 0x00 && buf[1] === 0x04) {
		if (addZero)
			return (buf);
		return (buf.slice(1));
	} else if (buf[0] === 0x04) {
		if (!addZero)
			return (buf);
	} else {
		while (buf[0] === 0x00)
			buf = buf.slice(1);
		if (buf[0] === 0x02 || buf[0] === 0x03)
			throw (new Error('Compressed elliptic curve points ' +
			    'are not supported'));
		if (buf[0] !== 0x04)
			throw (new Error('Not a valid elliptic curve point'));
		if (!addZero)
			return (buf);
	}
	var b = Buffer.alloc(buf.length + 1);
	b[0] = 0x0;
	buf.copy(b, 1);
	return (b);
}

function readBitString(der, tag) {
	if (tag === undefined)
		tag = asn1.Ber.BitString;
	var buf = der.readString(tag, true);
	assert.strictEqual(buf[0], 0x00, 'bit strings with unused bits are ' +
	    'not supported (0x' + buf[0].toString(16) + ')');
	return (buf.slice(1));
}

function writeBitString(der, buf, tag) {
	if (tag === undefined)
		tag = asn1.Ber.BitString;
	var b = Buffer.alloc(buf.length + 1);
	b[0] = 0x00;
	buf.copy(b, 1);
	der.writeBuffer(b, tag);
}

function mpNormalize(buf) {
	assert.buffer(buf);
	while (buf.length > 1 && buf[0] === 0x00 && (buf[1] & 0x80) === 0x00)
		buf = buf.slice(1);
	if ((buf[0] & 0x80) === 0x80) {
		var b = Buffer.alloc(buf.length + 1);
		b[0] = 0x00;
		buf.copy(b, 1);
		buf = b;
	}
	return (buf);
}

function mpDenormalize(buf) {
	assert.buffer(buf);
	while (buf.length > 1 && buf[0] === 0x00)
		buf = buf.slice(1);
	return (buf);
}

function zeroPadToLength(buf, len) {
	assert.buffer(buf);
	assert.number(len);
	while (buf.length > len) {
		assert.equal(buf[0], 0x00);
		buf = buf.slice(1);
	}
	while (buf.length < len) {
		var b = Buffer.alloc(buf.length + 1);
		b[0] = 0x00;
		buf.copy(b, 1);
		buf = b;
	}
	return (buf);
}

function bigintToMpBuf(bigint) {
	var buf = Buffer.from(bigint.toByteArray());
	buf = mpNormalize(buf);
	return (buf);
}

function calculateDSAPublic(g, p, x) {
	assert.buffer(g);
	assert.buffer(p);
	assert.buffer(x);
	g = new jsbn(g);
	p = new jsbn(p);
	x = new jsbn(x);
	var y = g.modPow(x, p);
	var ybuf = bigintToMpBuf(y);
	return (ybuf);
}

function calculateED25519Public(k) {
	assert.buffer(k);

	var kp = nacl.sign.keyPair.fromSeed(new Uint8Array(k));
	return (Buffer.from(kp.publicKey));
}

function calculateX25519Public(k) {
	assert.buffer(k);

	var kp = nacl.box.keyPair.fromSeed(new Uint8Array(k));
	return (Buffer.from(kp.publicKey));
}

function addRSAMissing(key) {
	assert.object(key);
	assertCompatible(key, PrivateKey, [1, 1]);

	var d = new jsbn(key.part.d.data);
	var buf;

	if (!key.part.dmodp) {
		var p = new jsbn(key.part.p.data);
		var dmodp = d.mod(p.subtract(1));

		buf = bigintToMpBuf(dmodp);
		key.part.dmodp = {name: 'dmodp', data: buf};
		key.parts.push(key.part.dmodp);
	}
	if (!key.part.dmodq) {
		var q = new jsbn(key.part.q.data);
		var dmodq = d.mod(q.subtract(1));

		buf = bigintToMpBuf(dmodq);
		key.part.dmodq = {name: 'dmodq', data: buf};
		key.parts.push(key.part.dmodq);
	}
}

function publicFromPrivateECDSA(curveName, priv) {
	assert.string(curveName, 'curveName');
	assert.buffer(priv);
	var params = algs.curves[curveName];
	var p = new jsbn(params.p);
	var a = new jsbn(params.a);
	var b = new jsbn(params.b);
	var curve = new ec.ECCurveFp(p, a, b);
	var G = curve.decodePointHex(params.G.toString('hex'));

	var d = new jsbn(mpNormalize(priv));
	var pub = G.multiply(d);
	pub = Buffer.from(curve.encodePointHex(pub), 'hex');

	var parts = [];
	parts.push({name: 'curve', data: Buffer.from(curveName)});
	parts.push({name: 'Q', data: pub});

	var key = new Key({type: 'ecdsa', curve: curve, parts: parts});
	return (key);
}

function opensshCipherInfo(cipher) {
	var inf = {};
	switch (cipher) {
	case '3des-cbc':
		inf.keySize = 24;
		inf.blockSize = 8;
		inf.opensslName = 'des-ede3-cbc';
		break;
	case 'blowfish-cbc':
		inf.keySize = 16;
		inf.blockSize = 8;
		inf.opensslName = 'bf-cbc';
		break;
	case 'aes128-cbc':
	case 'aes128-ctr':
	case 'aes128-gcm@openssh.com':
		inf.keySize = 16;
		inf.blockSize = 16;
		inf.opensslName = 'aes-128-' + cipher.slice(7, 10);
		break;
	case 'aes192-cbc':
	case 'aes192-ctr':
	case 'aes192-gcm@openssh.com':
		inf.keySize = 24;
		inf.blockSize = 16;
		inf.opensslName = 'aes-192-' + cipher.slice(7, 10);
		break;
	case 'aes256-cbc':
	case 'aes256-ctr':
	case 'aes256-gcm@openssh.com':
		inf.keySize = 32;
		inf.blockSize = 16;
		inf.opensslName = 'aes-256-' + cipher.slice(7, 10);
		break;
	default:
		throw (new Error(
		    'Unsupported openssl cipher "' + cipher + '"'));
	}
	return (inf);
}


/***/ }),

/***/ "5Q5X":
/*!*****************************************!*\
  !*** ./node_modules/sshpk/lib/index.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// Copyright 2015 Joyent, Inc.

var Key = __webpack_require__(/*! ./key */ "qfPv");
var Fingerprint = __webpack_require__(/*! ./fingerprint */ "s54N");
var Signature = __webpack_require__(/*! ./signature */ "ZVj6");
var PrivateKey = __webpack_require__(/*! ./private-key */ "UtVk");
var Certificate = __webpack_require__(/*! ./certificate */ "m1HP");
var Identity = __webpack_require__(/*! ./identity */ "vBLe");
var errs = __webpack_require__(/*! ./errors */ "HvMK");

module.exports = {
	/* top-level classes */
	Key: Key,
	parseKey: Key.parse,
	Fingerprint: Fingerprint,
	parseFingerprint: Fingerprint.parse,
	Signature: Signature,
	parseSignature: Signature.parse,
	PrivateKey: PrivateKey,
	parsePrivateKey: PrivateKey.parse,
	generatePrivateKey: PrivateKey.generate,
	Certificate: Certificate,
	parseCertificate: Certificate.parse,
	createSelfSignedCertificate: Certificate.createSelfSigned,
	createCertificate: Certificate.create,
	Identity: Identity,
	identityFromDN: Identity.parseDN,
	identityForHost: Identity.forHost,
	identityForUser: Identity.forUser,
	identityForEmail: Identity.forEmail,
	identityFromArray: Identity.fromArray,

	/* errors */
	FingerprintFormatError: errs.FingerprintFormatError,
	InvalidAlgorithmError: errs.InvalidAlgorithmError,
	KeyParseError: errs.KeyParseError,
	SignatureParseError: errs.SignatureParseError,
	KeyEncryptedError: errs.KeyEncryptedError,
	CertificateParseError: errs.CertificateParseError
};


/***/ }),

/***/ "CA38":
/*!****************************************************!*\
  !*** ./node_modules/sshpk/lib/formats/x509-pem.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// Copyright 2016 Joyent, Inc.

var x509 = __webpack_require__(/*! ./x509 */ "N1rP");

module.exports = {
	read: read,
	verify: x509.verify,
	sign: x509.sign,
	write: write
};

var assert = __webpack_require__(/*! assert-plus */ "60GX");
var asn1 = __webpack_require__(/*! asn1 */ "ZkxX");
var Buffer = __webpack_require__(/*! safer-buffer */ "xZGU").Buffer;
var algs = __webpack_require__(/*! ../algs */ "r++l");
var utils = __webpack_require__(/*! ../utils */ "43+q");
var Key = __webpack_require__(/*! ../key */ "qfPv");
var PrivateKey = __webpack_require__(/*! ../private-key */ "UtVk");
var pem = __webpack_require__(/*! ./pem */ "ViER");
var Identity = __webpack_require__(/*! ../identity */ "vBLe");
var Signature = __webpack_require__(/*! ../signature */ "ZVj6");
var Certificate = __webpack_require__(/*! ../certificate */ "m1HP");

function read(buf, options) {
	if (typeof (buf) !== 'string') {
		assert.buffer(buf, 'buf');
		buf = buf.toString('ascii');
	}

	var lines = buf.trim().split(/[\r\n]+/g);

	var m;
	var si = -1;
	while (!m && si < lines.length) {
		m = lines[++si].match(/*JSSTYLED*/
		    /[-]+[ ]*BEGIN CERTIFICATE[ ]*[-]+/);
	}
	assert.ok(m, 'invalid PEM header');

	var m2;
	var ei = lines.length;
	while (!m2 && ei > 0) {
		m2 = lines[--ei].match(/*JSSTYLED*/
		    /[-]+[ ]*END CERTIFICATE[ ]*[-]+/);
	}
	assert.ok(m2, 'invalid PEM footer');

	lines = lines.slice(si, ei + 1);

	var headers = {};
	while (true) {
		lines = lines.slice(1);
		m = lines[0].match(/*JSSTYLED*/
		    /^([A-Za-z0-9-]+): (.+)$/);
		if (!m)
			break;
		headers[m[1].toLowerCase()] = m[2];
	}

	/* Chop off the first and last lines */
	lines = lines.slice(0, -1).join('');
	buf = Buffer.from(lines, 'base64');

	return (x509.read(buf, options));
}

function write(cert, options) {
	var dbuf = x509.write(cert, options);

	var header = 'CERTIFICATE';
	var tmp = dbuf.toString('base64');
	var len = tmp.length + (tmp.length / 64) +
	    18 + 16 + header.length*2 + 10;
	var buf = Buffer.alloc(len);
	var o = 0;
	o += buf.write('-----BEGIN ' + header + '-----\n', o);
	for (var i = 0; i < tmp.length; ) {
		var limit = i + 64;
		if (limit > tmp.length)
			limit = tmp.length;
		o += buf.write(tmp.slice(i, limit), o);
		buf[o++] = 10;
		i = limit;
	}
	o += buf.write('-----END ' + header + '-----\n', o);

	return (buf.slice(0, o));
}


/***/ }),

/***/ "HvMK":
/*!******************************************!*\
  !*** ./node_modules/sshpk/lib/errors.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// Copyright 2015 Joyent, Inc.

var assert = __webpack_require__(/*! assert-plus */ "60GX");
var util = __webpack_require__(/*! util */ "7tlc");

function FingerprintFormatError(fp, format) {
	if (Error.captureStackTrace)
		Error.captureStackTrace(this, FingerprintFormatError);
	this.name = 'FingerprintFormatError';
	this.fingerprint = fp;
	this.format = format;
	this.message = 'Fingerprint format is not supported, or is invalid: ';
	if (fp !== undefined)
		this.message += ' fingerprint = ' + fp;
	if (format !== undefined)
		this.message += ' format = ' + format;
}
util.inherits(FingerprintFormatError, Error);

function InvalidAlgorithmError(alg) {
	if (Error.captureStackTrace)
		Error.captureStackTrace(this, InvalidAlgorithmError);
	this.name = 'InvalidAlgorithmError';
	this.algorithm = alg;
	this.message = 'Algorithm "' + alg + '" is not supported';
}
util.inherits(InvalidAlgorithmError, Error);

function KeyParseError(name, format, innerErr) {
	if (Error.captureStackTrace)
		Error.captureStackTrace(this, KeyParseError);
	this.name = 'KeyParseError';
	this.format = format;
	this.keyName = name;
	this.innerErr = innerErr;
	this.message = 'Failed to parse ' + name + ' as a valid ' + format +
	    ' format key: ' + innerErr.message;
}
util.inherits(KeyParseError, Error);

function SignatureParseError(type, format, innerErr) {
	if (Error.captureStackTrace)
		Error.captureStackTrace(this, SignatureParseError);
	this.name = 'SignatureParseError';
	this.type = type;
	this.format = format;
	this.innerErr = innerErr;
	this.message = 'Failed to parse the given data as a ' + type +
	    ' signature in ' + format + ' format: ' + innerErr.message;
}
util.inherits(SignatureParseError, Error);

function CertificateParseError(name, format, innerErr) {
	if (Error.captureStackTrace)
		Error.captureStackTrace(this, CertificateParseError);
	this.name = 'CertificateParseError';
	this.format = format;
	this.certName = name;
	this.innerErr = innerErr;
	this.message = 'Failed to parse ' + name + ' as a valid ' + format +
	    ' format certificate: ' + innerErr.message;
}
util.inherits(CertificateParseError, Error);

function KeyEncryptedError(name, format) {
	if (Error.captureStackTrace)
		Error.captureStackTrace(this, KeyEncryptedError);
	this.name = 'KeyEncryptedError';
	this.format = format;
	this.keyName = name;
	this.message = 'The ' + format + ' format key ' + name + ' is ' +
	    'encrypted (password-protected), and no passphrase was ' +
	    'provided in `options`';
}
util.inherits(KeyEncryptedError, Error);

module.exports = {
	FingerprintFormatError: FingerprintFormatError,
	InvalidAlgorithmError: InvalidAlgorithmError,
	KeyParseError: KeyParseError,
	SignatureParseError: SignatureParseError,
	KeyEncryptedError: KeyEncryptedError,
	CertificateParseError: CertificateParseError
};


/***/ }),

/***/ "N1rP":
/*!************************************************!*\
  !*** ./node_modules/sshpk/lib/formats/x509.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// Copyright 2017 Joyent, Inc.

module.exports = {
	read: read,
	verify: verify,
	sign: sign,
	signAsync: signAsync,
	write: write
};

var assert = __webpack_require__(/*! assert-plus */ "60GX");
var asn1 = __webpack_require__(/*! asn1 */ "ZkxX");
var Buffer = __webpack_require__(/*! safer-buffer */ "xZGU").Buffer;
var algs = __webpack_require__(/*! ../algs */ "r++l");
var utils = __webpack_require__(/*! ../utils */ "43+q");
var Key = __webpack_require__(/*! ../key */ "qfPv");
var PrivateKey = __webpack_require__(/*! ../private-key */ "UtVk");
var pem = __webpack_require__(/*! ./pem */ "ViER");
var Identity = __webpack_require__(/*! ../identity */ "vBLe");
var Signature = __webpack_require__(/*! ../signature */ "ZVj6");
var Certificate = __webpack_require__(/*! ../certificate */ "m1HP");
var pkcs8 = __webpack_require__(/*! ./pkcs8 */ "ZLZ5");

/*
 * This file is based on RFC5280 (X.509).
 */

/* Helper to read in a single mpint */
function readMPInt(der, nm) {
	assert.strictEqual(der.peek(), asn1.Ber.Integer,
	    nm + ' is not an Integer');
	return (utils.mpNormalize(der.readString(asn1.Ber.Integer, true)));
}

function verify(cert, key) {
	var sig = cert.signatures.x509;
	assert.object(sig, 'x509 signature');

	var algParts = sig.algo.split('-');
	if (algParts[0] !== key.type)
		return (false);

	var blob = sig.cache;
	if (blob === undefined) {
		var der = new asn1.BerWriter();
		writeTBSCert(cert, der);
		blob = der.buffer;
	}

	var verifier = key.createVerify(algParts[1]);
	verifier.write(blob);
	return (verifier.verify(sig.signature));
}

function Local(i) {
	return (asn1.Ber.Context | asn1.Ber.Constructor | i);
}

function Context(i) {
	return (asn1.Ber.Context | i);
}

var SIGN_ALGS = {
	'rsa-md5': '1.2.840.113549.1.1.4',
	'rsa-sha1': '1.2.840.113549.1.1.5',
	'rsa-sha256': '1.2.840.113549.1.1.11',
	'rsa-sha384': '1.2.840.113549.1.1.12',
	'rsa-sha512': '1.2.840.113549.1.1.13',
	'dsa-sha1': '1.2.840.10040.4.3',
	'dsa-sha256': '2.16.840.1.101.3.4.3.2',
	'ecdsa-sha1': '1.2.840.10045.4.1',
	'ecdsa-sha256': '1.2.840.10045.4.3.2',
	'ecdsa-sha384': '1.2.840.10045.4.3.3',
	'ecdsa-sha512': '1.2.840.10045.4.3.4',
	'ed25519-sha512': '1.3.101.112'
};
Object.keys(SIGN_ALGS).forEach(function (k) {
	SIGN_ALGS[SIGN_ALGS[k]] = k;
});
SIGN_ALGS['1.3.14.3.2.3'] = 'rsa-md5';
SIGN_ALGS['1.3.14.3.2.29'] = 'rsa-sha1';

var EXTS = {
	'issuerKeyId': '2.5.29.35',
	'altName': '2.5.29.17',
	'basicConstraints': '2.5.29.19',
	'keyUsage': '2.5.29.15',
	'extKeyUsage': '2.5.29.37'
};

function read(buf, options) {
	if (typeof (buf) === 'string') {
		buf = Buffer.from(buf, 'binary');
	}
	assert.buffer(buf, 'buf');

	var der = new asn1.BerReader(buf);

	der.readSequence();
	if (Math.abs(der.length - der.remain) > 1) {
		throw (new Error('DER sequence does not contain whole byte ' +
		    'stream'));
	}

	var tbsStart = der.offset;
	der.readSequence();
	var sigOffset = der.offset + der.length;
	var tbsEnd = sigOffset;

	if (der.peek() === Local(0)) {
		der.readSequence(Local(0));
		var version = der.readInt();
		assert.ok(version <= 3,
		    'only x.509 versions up to v3 supported');
	}

	var cert = {};
	cert.signatures = {};
	var sig = (cert.signatures.x509 = {});
	sig.extras = {};

	cert.serial = readMPInt(der, 'serial');

	der.readSequence();
	var after = der.offset + der.length;
	var certAlgOid = der.readOID();
	var certAlg = SIGN_ALGS[certAlgOid];
	if (certAlg === undefined)
		throw (new Error('unknown signature algorithm ' + certAlgOid));

	der._offset = after;
	cert.issuer = Identity.parseAsn1(der);

	der.readSequence();
	cert.validFrom = readDate(der);
	cert.validUntil = readDate(der);

	cert.subjects = [Identity.parseAsn1(der)];

	der.readSequence();
	after = der.offset + der.length;
	cert.subjectKey = pkcs8.readPkcs8(undefined, 'public', der);
	der._offset = after;

	/* issuerUniqueID */
	if (der.peek() === Local(1)) {
		der.readSequence(Local(1));
		sig.extras.issuerUniqueID =
		    buf.slice(der.offset, der.offset + der.length);
		der._offset += der.length;
	}

	/* subjectUniqueID */
	if (der.peek() === Local(2)) {
		der.readSequence(Local(2));
		sig.extras.subjectUniqueID =
		    buf.slice(der.offset, der.offset + der.length);
		der._offset += der.length;
	}

	/* extensions */
	if (der.peek() === Local(3)) {
		der.readSequence(Local(3));
		var extEnd = der.offset + der.length;
		der.readSequence();

		while (der.offset < extEnd)
			readExtension(cert, buf, der);

		assert.strictEqual(der.offset, extEnd);
	}

	assert.strictEqual(der.offset, sigOffset);

	der.readSequence();
	after = der.offset + der.length;
	var sigAlgOid = der.readOID();
	var sigAlg = SIGN_ALGS[sigAlgOid];
	if (sigAlg === undefined)
		throw (new Error('unknown signature algorithm ' + sigAlgOid));
	der._offset = after;

	var sigData = der.readString(asn1.Ber.BitString, true);
	if (sigData[0] === 0)
		sigData = sigData.slice(1);
	var algParts = sigAlg.split('-');

	sig.signature = Signature.parse(sigData, algParts[0], 'asn1');
	sig.signature.hashAlgorithm = algParts[1];
	sig.algo = sigAlg;
	sig.cache = buf.slice(tbsStart, tbsEnd);

	return (new Certificate(cert));
}

function readDate(der) {
	if (der.peek() === asn1.Ber.UTCTime) {
		return (utcTimeToDate(der.readString(asn1.Ber.UTCTime)));
	} else if (der.peek() === asn1.Ber.GeneralizedTime) {
		return (gTimeToDate(der.readString(asn1.Ber.GeneralizedTime)));
	} else {
		throw (new Error('Unsupported date format'));
	}
}

function writeDate(der, date) {
	if (date.getUTCFullYear() >= 2050 || date.getUTCFullYear() < 1950) {
		der.writeString(dateToGTime(date), asn1.Ber.GeneralizedTime);
	} else {
		der.writeString(dateToUTCTime(date), asn1.Ber.UTCTime);
	}
}

/* RFC5280, section 4.2.1.6 (GeneralName type) */
var ALTNAME = {
	OtherName: Local(0),
	RFC822Name: Context(1),
	DNSName: Context(2),
	X400Address: Local(3),
	DirectoryName: Local(4),
	EDIPartyName: Local(5),
	URI: Context(6),
	IPAddress: Context(7),
	OID: Context(8)
};

/* RFC5280, section 4.2.1.12 (KeyPurposeId) */
var EXTPURPOSE = {
	'serverAuth': '1.3.6.1.5.5.7.3.1',
	'clientAuth': '1.3.6.1.5.5.7.3.2',
	'codeSigning': '1.3.6.1.5.5.7.3.3',

	/* See https://github.com/joyent/oid-docs/blob/master/root.md */
	'joyentDocker': '1.3.6.1.4.1.38678.1.4.1',
	'joyentCmon': '1.3.6.1.4.1.38678.1.4.2'
};
var EXTPURPOSE_REV = {};
Object.keys(EXTPURPOSE).forEach(function (k) {
	EXTPURPOSE_REV[EXTPURPOSE[k]] = k;
});

var KEYUSEBITS = [
	'signature', 'identity', 'keyEncryption',
	'encryption', 'keyAgreement', 'ca', 'crl'
];

function readExtension(cert, buf, der) {
	der.readSequence();
	var after = der.offset + der.length;
	var extId = der.readOID();
	var id;
	var sig = cert.signatures.x509;
	if (!sig.extras.exts)
		sig.extras.exts = [];

	var critical;
	if (der.peek() === asn1.Ber.Boolean)
		critical = der.readBoolean();

	switch (extId) {
	case (EXTS.basicConstraints):
		der.readSequence(asn1.Ber.OctetString);
		der.readSequence();
		var bcEnd = der.offset + der.length;
		var ca = false;
		if (der.peek() === asn1.Ber.Boolean)
			ca = der.readBoolean();
		if (cert.purposes === undefined)
			cert.purposes = [];
		if (ca === true)
			cert.purposes.push('ca');
		var bc = { oid: extId, critical: critical };
		if (der.offset < bcEnd && der.peek() === asn1.Ber.Integer)
			bc.pathLen = der.readInt();
		sig.extras.exts.push(bc);
		break;
	case (EXTS.extKeyUsage):
		der.readSequence(asn1.Ber.OctetString);
		der.readSequence();
		if (cert.purposes === undefined)
			cert.purposes = [];
		var ekEnd = der.offset + der.length;
		while (der.offset < ekEnd) {
			var oid = der.readOID();
			cert.purposes.push(EXTPURPOSE_REV[oid] || oid);
		}
		/*
		 * This is a bit of a hack: in the case where we have a cert
		 * that's only allowed to do serverAuth or clientAuth (and not
		 * the other), we want to make sure all our Subjects are of
		 * the right type. But we already parsed our Subjects and
		 * decided if they were hosts or users earlier (since it appears
		 * first in the cert).
		 *
		 * So we go through and mutate them into the right kind here if
		 * it doesn't match. This might not be hugely beneficial, as it
		 * seems that single-purpose certs are not often seen in the
		 * wild.
		 */
		if (cert.purposes.indexOf('serverAuth') !== -1 &&
		    cert.purposes.indexOf('clientAuth') === -1) {
			cert.subjects.forEach(function (ide) {
				if (ide.type !== 'host') {
					ide.type = 'host';
					ide.hostname = ide.uid ||
					    ide.email ||
					    ide.components[0].value;
				}
			});
		} else if (cert.purposes.indexOf('clientAuth') !== -1 &&
		    cert.purposes.indexOf('serverAuth') === -1) {
			cert.subjects.forEach(function (ide) {
				if (ide.type !== 'user') {
					ide.type = 'user';
					ide.uid = ide.hostname ||
					    ide.email ||
					    ide.components[0].value;
				}
			});
		}
		sig.extras.exts.push({ oid: extId, critical: critical });
		break;
	case (EXTS.keyUsage):
		der.readSequence(asn1.Ber.OctetString);
		var bits = der.readString(asn1.Ber.BitString, true);
		var setBits = readBitField(bits, KEYUSEBITS);
		setBits.forEach(function (bit) {
			if (cert.purposes === undefined)
				cert.purposes = [];
			if (cert.purposes.indexOf(bit) === -1)
				cert.purposes.push(bit);
		});
		sig.extras.exts.push({ oid: extId, critical: critical,
		    bits: bits });
		break;
	case (EXTS.altName):
		der.readSequence(asn1.Ber.OctetString);
		der.readSequence();
		var aeEnd = der.offset + der.length;
		while (der.offset < aeEnd) {
			switch (der.peek()) {
			case ALTNAME.OtherName:
			case ALTNAME.EDIPartyName:
				der.readSequence();
				der._offset += der.length;
				break;
			case ALTNAME.OID:
				der.readOID(ALTNAME.OID);
				break;
			case ALTNAME.RFC822Name:
				/* RFC822 specifies email addresses */
				var email = der.readString(ALTNAME.RFC822Name);
				id = Identity.forEmail(email);
				if (!cert.subjects[0].equals(id))
					cert.subjects.push(id);
				break;
			case ALTNAME.DirectoryName:
				der.readSequence(ALTNAME.DirectoryName);
				id = Identity.parseAsn1(der);
				if (!cert.subjects[0].equals(id))
					cert.subjects.push(id);
				break;
			case ALTNAME.DNSName:
				var host = der.readString(
				    ALTNAME.DNSName);
				id = Identity.forHost(host);
				if (!cert.subjects[0].equals(id))
					cert.subjects.push(id);
				break;
			default:
				der.readString(der.peek());
				break;
			}
		}
		sig.extras.exts.push({ oid: extId, critical: critical });
		break;
	default:
		sig.extras.exts.push({
			oid: extId,
			critical: critical,
			data: der.readString(asn1.Ber.OctetString, true)
		});
		break;
	}

	der._offset = after;
}

var UTCTIME_RE =
    /^([0-9]{2})([0-9]{2})([0-9]{2})([0-9]{2})([0-9]{2})([0-9]{2})?Z$/;
function utcTimeToDate(t) {
	var m = t.match(UTCTIME_RE);
	assert.ok(m, 'timestamps must be in UTC');
	var d = new Date();

	var thisYear = d.getUTCFullYear();
	var century = Math.floor(thisYear / 100) * 100;

	var year = parseInt(m[1], 10);
	if (thisYear % 100 < 50 && year >= 60)
		year += (century - 1);
	else
		year += century;
	d.setUTCFullYear(year, parseInt(m[2], 10) - 1, parseInt(m[3], 10));
	d.setUTCHours(parseInt(m[4], 10), parseInt(m[5], 10));
	if (m[6] && m[6].length > 0)
		d.setUTCSeconds(parseInt(m[6], 10));
	return (d);
}

var GTIME_RE =
    /^([0-9]{4})([0-9]{2})([0-9]{2})([0-9]{2})([0-9]{2})([0-9]{2})?Z$/;
function gTimeToDate(t) {
	var m = t.match(GTIME_RE);
	assert.ok(m);
	var d = new Date();

	d.setUTCFullYear(parseInt(m[1], 10), parseInt(m[2], 10) - 1,
	    parseInt(m[3], 10));
	d.setUTCHours(parseInt(m[4], 10), parseInt(m[5], 10));
	if (m[6] && m[6].length > 0)
		d.setUTCSeconds(parseInt(m[6], 10));
	return (d);
}

function zeroPad(n, m) {
	if (m === undefined)
		m = 2;
	var s = '' + n;
	while (s.length < m)
		s = '0' + s;
	return (s);
}

function dateToUTCTime(d) {
	var s = '';
	s += zeroPad(d.getUTCFullYear() % 100);
	s += zeroPad(d.getUTCMonth() + 1);
	s += zeroPad(d.getUTCDate());
	s += zeroPad(d.getUTCHours());
	s += zeroPad(d.getUTCMinutes());
	s += zeroPad(d.getUTCSeconds());
	s += 'Z';
	return (s);
}

function dateToGTime(d) {
	var s = '';
	s += zeroPad(d.getUTCFullYear(), 4);
	s += zeroPad(d.getUTCMonth() + 1);
	s += zeroPad(d.getUTCDate());
	s += zeroPad(d.getUTCHours());
	s += zeroPad(d.getUTCMinutes());
	s += zeroPad(d.getUTCSeconds());
	s += 'Z';
	return (s);
}

function sign(cert, key) {
	if (cert.signatures.x509 === undefined)
		cert.signatures.x509 = {};
	var sig = cert.signatures.x509;

	sig.algo = key.type + '-' + key.defaultHashAlgorithm();
	if (SIGN_ALGS[sig.algo] === undefined)
		return (false);

	var der = new asn1.BerWriter();
	writeTBSCert(cert, der);
	var blob = der.buffer;
	sig.cache = blob;

	var signer = key.createSign();
	signer.write(blob);
	cert.signatures.x509.signature = signer.sign();

	return (true);
}

function signAsync(cert, signer, done) {
	if (cert.signatures.x509 === undefined)
		cert.signatures.x509 = {};
	var sig = cert.signatures.x509;

	var der = new asn1.BerWriter();
	writeTBSCert(cert, der);
	var blob = der.buffer;
	sig.cache = blob;

	signer(blob, function (err, signature) {
		if (err) {
			done(err);
			return;
		}
		sig.algo = signature.type + '-' + signature.hashAlgorithm;
		if (SIGN_ALGS[sig.algo] === undefined) {
			done(new Error('Invalid signing algorithm "' +
			    sig.algo + '"'));
			return;
		}
		sig.signature = signature;
		done();
	});
}

function write(cert, options) {
	var sig = cert.signatures.x509;
	assert.object(sig, 'x509 signature');

	var der = new asn1.BerWriter();
	der.startSequence();
	if (sig.cache) {
		der._ensure(sig.cache.length);
		sig.cache.copy(der._buf, der._offset);
		der._offset += sig.cache.length;
	} else {
		writeTBSCert(cert, der);
	}

	der.startSequence();
	der.writeOID(SIGN_ALGS[sig.algo]);
	if (sig.algo.match(/^rsa-/))
		der.writeNull();
	der.endSequence();

	var sigData = sig.signature.toBuffer('asn1');
	var data = Buffer.alloc(sigData.length + 1);
	data[0] = 0;
	sigData.copy(data, 1);
	der.writeBuffer(data, asn1.Ber.BitString);
	der.endSequence();

	return (der.buffer);
}

function writeTBSCert(cert, der) {
	var sig = cert.signatures.x509;
	assert.object(sig, 'x509 signature');

	der.startSequence();

	der.startSequence(Local(0));
	der.writeInt(2);
	der.endSequence();

	der.writeBuffer(utils.mpNormalize(cert.serial), asn1.Ber.Integer);

	der.startSequence();
	der.writeOID(SIGN_ALGS[sig.algo]);
	if (sig.algo.match(/^rsa-/))
		der.writeNull();
	der.endSequence();

	cert.issuer.toAsn1(der);

	der.startSequence();
	writeDate(der, cert.validFrom);
	writeDate(der, cert.validUntil);
	der.endSequence();

	var subject = cert.subjects[0];
	var altNames = cert.subjects.slice(1);
	subject.toAsn1(der);

	pkcs8.writePkcs8(der, cert.subjectKey);

	if (sig.extras && sig.extras.issuerUniqueID) {
		der.writeBuffer(sig.extras.issuerUniqueID, Local(1));
	}

	if (sig.extras && sig.extras.subjectUniqueID) {
		der.writeBuffer(sig.extras.subjectUniqueID, Local(2));
	}

	if (altNames.length > 0 || subject.type === 'host' ||
	    (cert.purposes !== undefined && cert.purposes.length > 0) ||
	    (sig.extras && sig.extras.exts)) {
		der.startSequence(Local(3));
		der.startSequence();

		var exts = [];
		if (cert.purposes !== undefined && cert.purposes.length > 0) {
			exts.push({
				oid: EXTS.basicConstraints,
				critical: true
			});
			exts.push({
				oid: EXTS.keyUsage,
				critical: true
			});
			exts.push({
				oid: EXTS.extKeyUsage,
				critical: true
			});
		}
		exts.push({ oid: EXTS.altName });
		if (sig.extras && sig.extras.exts)
			exts = sig.extras.exts;

		for (var i = 0; i < exts.length; ++i) {
			der.startSequence();
			der.writeOID(exts[i].oid);

			if (exts[i].critical !== undefined)
				der.writeBoolean(exts[i].critical);

			if (exts[i].oid === EXTS.altName) {
				der.startSequence(asn1.Ber.OctetString);
				der.startSequence();
				if (subject.type === 'host') {
					der.writeString(subject.hostname,
					    Context(2));
				}
				for (var j = 0; j < altNames.length; ++j) {
					if (altNames[j].type === 'host') {
						der.writeString(
						    altNames[j].hostname,
						    ALTNAME.DNSName);
					} else if (altNames[j].type ===
					    'email') {
						der.writeString(
						    altNames[j].email,
						    ALTNAME.RFC822Name);
					} else {
						/*
						 * Encode anything else as a
						 * DN style name for now.
						 */
						der.startSequence(
						    ALTNAME.DirectoryName);
						altNames[j].toAsn1(der);
						der.endSequence();
					}
				}
				der.endSequence();
				der.endSequence();
			} else if (exts[i].oid === EXTS.basicConstraints) {
				der.startSequence(asn1.Ber.OctetString);
				der.startSequence();
				var ca = (cert.purposes.indexOf('ca') !== -1);
				var pathLen = exts[i].pathLen;
				der.writeBoolean(ca);
				if (pathLen !== undefined)
					der.writeInt(pathLen);
				der.endSequence();
				der.endSequence();
			} else if (exts[i].oid === EXTS.extKeyUsage) {
				der.startSequence(asn1.Ber.OctetString);
				der.startSequence();
				cert.purposes.forEach(function (purpose) {
					if (purpose === 'ca')
						return;
					if (KEYUSEBITS.indexOf(purpose) !== -1)
						return;
					var oid = purpose;
					if (EXTPURPOSE[purpose] !== undefined)
						oid = EXTPURPOSE[purpose];
					der.writeOID(oid);
				});
				der.endSequence();
				der.endSequence();
			} else if (exts[i].oid === EXTS.keyUsage) {
				der.startSequence(asn1.Ber.OctetString);
				/*
				 * If we parsed this certificate from a byte
				 * stream (i.e. we didn't generate it in sshpk)
				 * then we'll have a ".bits" property on the
				 * ext with the original raw byte contents.
				 *
				 * If we have this, use it here instead of
				 * regenerating it. This guarantees we output
				 * the same data we parsed, so signatures still
				 * validate.
				 */
				if (exts[i].bits !== undefined) {
					der.writeBuffer(exts[i].bits,
					    asn1.Ber.BitString);
				} else {
					var bits = writeBitField(cert.purposes,
					    KEYUSEBITS);
					der.writeBuffer(bits,
					    asn1.Ber.BitString);
				}
				der.endSequence();
			} else {
				der.writeBuffer(exts[i].data,
				    asn1.Ber.OctetString);
			}

			der.endSequence();
		}

		der.endSequence();
		der.endSequence();
	}

	der.endSequence();
}

/*
 * Reads an ASN.1 BER bitfield out of the Buffer produced by doing
 * `BerReader#readString(asn1.Ber.BitString)`. That function gives us the raw
 * contents of the BitString tag, which is a count of unused bits followed by
 * the bits as a right-padded byte string.
 *
 * `bits` is the Buffer, `bitIndex` should contain an array of string names
 * for the bits in the string, ordered starting with bit #0 in the ASN.1 spec.
 *
 * Returns an array of Strings, the names of the bits that were set to 1.
 */
function readBitField(bits, bitIndex) {
	var bitLen = 8 * (bits.length - 1) - bits[0];
	var setBits = {};
	for (var i = 0; i < bitLen; ++i) {
		var byteN = 1 + Math.floor(i / 8);
		var bit = 7 - (i % 8);
		var mask = 1 << bit;
		var bitVal = ((bits[byteN] & mask) !== 0);
		var name = bitIndex[i];
		if (bitVal && typeof (name) === 'string') {
			setBits[name] = true;
		}
	}
	return (Object.keys(setBits));
}

/*
 * `setBits` is an array of strings, containing the names for each bit that
 * sould be set to 1. `bitIndex` is same as in `readBitField()`.
 *
 * Returns a Buffer, ready to be written out with `BerWriter#writeString()`.
 */
function writeBitField(setBits, bitIndex) {
	var bitLen = bitIndex.length;
	var blen = Math.ceil(bitLen / 8);
	var unused = blen * 8 - bitLen;
	var bits = Buffer.alloc(1 + blen); // zero-filled
	bits[0] = unused;
	for (var i = 0; i < bitLen; ++i) {
		var byteN = 1 + Math.floor(i / 8);
		var bit = 7 - (i % 8);
		var mask = 1 << bit;
		var name = bitIndex[i];
		if (name === undefined)
			continue;
		var bitVal = (setBits.indexOf(name) !== -1);
		if (bitVal) {
			bits[byteN] |= mask;
		}
	}
	return (bits);
}


/***/ }),

/***/ "UtVk":
/*!***********************************************!*\
  !*** ./node_modules/sshpk/lib/private-key.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// Copyright 2017 Joyent, Inc.

module.exports = PrivateKey;

var assert = __webpack_require__(/*! assert-plus */ "60GX");
var Buffer = __webpack_require__(/*! safer-buffer */ "xZGU").Buffer;
var algs = __webpack_require__(/*! ./algs */ "r++l");
var crypto = __webpack_require__(/*! crypto */ "HEbw");
var Fingerprint = __webpack_require__(/*! ./fingerprint */ "s54N");
var Signature = __webpack_require__(/*! ./signature */ "ZVj6");
var errs = __webpack_require__(/*! ./errors */ "HvMK");
var util = __webpack_require__(/*! util */ "7tlc");
var utils = __webpack_require__(/*! ./utils */ "43+q");
var dhe = __webpack_require__(/*! ./dhe */ "tfmF");
var generateECDSA = dhe.generateECDSA;
var generateED25519 = dhe.generateED25519;
var edCompat = __webpack_require__(/*! ./ed-compat */ "WKVI");
var nacl = __webpack_require__(/*! tweetnacl */ "WKRr");

var Key = __webpack_require__(/*! ./key */ "qfPv");

var InvalidAlgorithmError = errs.InvalidAlgorithmError;
var KeyParseError = errs.KeyParseError;
var KeyEncryptedError = errs.KeyEncryptedError;

var formats = {};
formats['auto'] = __webpack_require__(/*! ./formats/auto */ "30lM");
formats['pem'] = __webpack_require__(/*! ./formats/pem */ "ViER");
formats['pkcs1'] = __webpack_require__(/*! ./formats/pkcs1 */ "/e07");
formats['pkcs8'] = __webpack_require__(/*! ./formats/pkcs8 */ "ZLZ5");
formats['rfc4253'] = __webpack_require__(/*! ./formats/rfc4253 */ "hSbD");
formats['ssh-private'] = __webpack_require__(/*! ./formats/ssh-private */ "2LYn");
formats['openssh'] = formats['ssh-private'];
formats['ssh'] = formats['ssh-private'];
formats['dnssec'] = __webpack_require__(/*! ./formats/dnssec */ "YiDp");

function PrivateKey(opts) {
	assert.object(opts, 'options');
	Key.call(this, opts);

	this._pubCache = undefined;
}
util.inherits(PrivateKey, Key);

PrivateKey.formats = formats;

PrivateKey.prototype.toBuffer = function (format, options) {
	if (format === undefined)
		format = 'pkcs1';
	assert.string(format, 'format');
	assert.object(formats[format], 'formats[format]');
	assert.optionalObject(options, 'options');

	return (formats[format].write(this, options));
};

PrivateKey.prototype.hash = function (algo, type) {
	return (this.toPublic().hash(algo, type));
};

PrivateKey.prototype.fingerprint = function (algo, type) {
	return (this.toPublic().fingerprint(algo, type));
};

PrivateKey.prototype.toPublic = function () {
	if (this._pubCache)
		return (this._pubCache);

	var algInfo = algs.info[this.type];
	var pubParts = [];
	for (var i = 0; i < algInfo.parts.length; ++i) {
		var p = algInfo.parts[i];
		pubParts.push(this.part[p]);
	}

	this._pubCache = new Key({
		type: this.type,
		source: this,
		parts: pubParts
	});
	if (this.comment)
		this._pubCache.comment = this.comment;
	return (this._pubCache);
};

PrivateKey.prototype.derive = function (newType) {
	assert.string(newType, 'type');
	var priv, pub, pair;

	if (this.type === 'ed25519' && newType === 'curve25519') {
		priv = this.part.k.data;
		if (priv[0] === 0x00)
			priv = priv.slice(1);

		pair = nacl.box.keyPair.fromSecretKey(new Uint8Array(priv));
		pub = Buffer.from(pair.publicKey);

		return (new PrivateKey({
			type: 'curve25519',
			parts: [
				{ name: 'A', data: utils.mpNormalize(pub) },
				{ name: 'k', data: utils.mpNormalize(priv) }
			]
		}));
	} else if (this.type === 'curve25519' && newType === 'ed25519') {
		priv = this.part.k.data;
		if (priv[0] === 0x00)
			priv = priv.slice(1);

		pair = nacl.sign.keyPair.fromSeed(new Uint8Array(priv));
		pub = Buffer.from(pair.publicKey);

		return (new PrivateKey({
			type: 'ed25519',
			parts: [
				{ name: 'A', data: utils.mpNormalize(pub) },
				{ name: 'k', data: utils.mpNormalize(priv) }
			]
		}));
	}
	throw (new Error('Key derivation not supported from ' + this.type +
	    ' to ' + newType));
};

PrivateKey.prototype.createVerify = function (hashAlgo) {
	return (this.toPublic().createVerify(hashAlgo));
};

PrivateKey.prototype.createSign = function (hashAlgo) {
	if (hashAlgo === undefined)
		hashAlgo = this.defaultHashAlgorithm();
	assert.string(hashAlgo, 'hash algorithm');

	/* ED25519 is not supported by OpenSSL, use a javascript impl. */
	if (this.type === 'ed25519' && edCompat !== undefined)
		return (new edCompat.Signer(this, hashAlgo));
	if (this.type === 'curve25519')
		throw (new Error('Curve25519 keys are not suitable for ' +
		    'signing or verification'));

	var v, nm, err;
	try {
		nm = hashAlgo.toUpperCase();
		v = crypto.createSign(nm);
	} catch (e) {
		err = e;
	}
	if (v === undefined || (err instanceof Error &&
	    err.message.match(/Unknown message digest/))) {
		nm = 'RSA-';
		nm += hashAlgo.toUpperCase();
		v = crypto.createSign(nm);
	}
	assert.ok(v, 'failed to create verifier');
	var oldSign = v.sign.bind(v);
	var key = this.toBuffer('pkcs1');
	var type = this.type;
	var curve = this.curve;
	v.sign = function () {
		var sig = oldSign(key);
		if (typeof (sig) === 'string')
			sig = Buffer.from(sig, 'binary');
		sig = Signature.parse(sig, type, 'asn1');
		sig.hashAlgorithm = hashAlgo;
		sig.curve = curve;
		return (sig);
	};
	return (v);
};

PrivateKey.parse = function (data, format, options) {
	if (typeof (data) !== 'string')
		assert.buffer(data, 'data');
	if (format === undefined)
		format = 'auto';
	assert.string(format, 'format');
	if (typeof (options) === 'string')
		options = { filename: options };
	assert.optionalObject(options, 'options');
	if (options === undefined)
		options = {};
	assert.optionalString(options.filename, 'options.filename');
	if (options.filename === undefined)
		options.filename = '(unnamed)';

	assert.object(formats[format], 'formats[format]');

	try {
		var k = formats[format].read(data, options);
		assert.ok(k instanceof PrivateKey, 'key is not a private key');
		if (!k.comment)
			k.comment = options.filename;
		return (k);
	} catch (e) {
		if (e.name === 'KeyEncryptedError')
			throw (e);
		throw (new KeyParseError(options.filename, format, e));
	}
};

PrivateKey.isPrivateKey = function (obj, ver) {
	return (utils.isCompatible(obj, PrivateKey, ver));
};

PrivateKey.generate = function (type, options) {
	if (options === undefined)
		options = {};
	assert.object(options, 'options');

	switch (type) {
	case 'ecdsa':
		if (options.curve === undefined)
			options.curve = 'nistp256';
		assert.string(options.curve, 'options.curve');
		return (generateECDSA(options.curve));
	case 'ed25519':
		return (generateED25519());
	default:
		throw (new Error('Key generation not supported with key ' +
		    'type "' + type + '"'));
	}
};

/*
 * API versions for PrivateKey:
 * [1,0] -- initial ver
 * [1,1] -- added auto, pkcs[18], openssh/ssh-private formats
 * [1,2] -- added defaultHashAlgorithm
 * [1,3] -- added derive, ed, createDH
 * [1,4] -- first tagged version
 * [1,5] -- changed ed25519 part names and format
 * [1,6] -- type arguments for hash() and fingerprint()
 */
PrivateKey.prototype._sshpkApiVersion = [1, 6];

PrivateKey._oldVersionDetect = function (obj) {
	assert.func(obj.toPublic);
	assert.func(obj.createSign);
	if (obj.derive)
		return ([1, 3]);
	if (obj.defaultHashAlgorithm)
		return ([1, 2]);
	if (obj.formats['auto'])
		return ([1, 1]);
	return ([1, 0]);
};


/***/ }),

/***/ "ViER":
/*!***********************************************!*\
  !*** ./node_modules/sshpk/lib/formats/pem.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// Copyright 2018 Joyent, Inc.

module.exports = {
	read: read,
	write: write
};

var assert = __webpack_require__(/*! assert-plus */ "60GX");
var asn1 = __webpack_require__(/*! asn1 */ "ZkxX");
var crypto = __webpack_require__(/*! crypto */ "HEbw");
var Buffer = __webpack_require__(/*! safer-buffer */ "xZGU").Buffer;
var algs = __webpack_require__(/*! ../algs */ "r++l");
var utils = __webpack_require__(/*! ../utils */ "43+q");
var Key = __webpack_require__(/*! ../key */ "qfPv");
var PrivateKey = __webpack_require__(/*! ../private-key */ "UtVk");

var pkcs1 = __webpack_require__(/*! ./pkcs1 */ "/e07");
var pkcs8 = __webpack_require__(/*! ./pkcs8 */ "ZLZ5");
var sshpriv = __webpack_require__(/*! ./ssh-private */ "2LYn");
var rfc4253 = __webpack_require__(/*! ./rfc4253 */ "hSbD");

var errors = __webpack_require__(/*! ../errors */ "HvMK");

var OID_PBES2 = '1.2.840.113549.1.5.13';
var OID_PBKDF2 = '1.2.840.113549.1.5.12';

var OID_TO_CIPHER = {
	'1.2.840.113549.3.7': '3des-cbc',
	'2.16.840.1.101.3.4.1.2': 'aes128-cbc',
	'2.16.840.1.101.3.4.1.42': 'aes256-cbc'
};
var CIPHER_TO_OID = {};
Object.keys(OID_TO_CIPHER).forEach(function (k) {
	CIPHER_TO_OID[OID_TO_CIPHER[k]] = k;
});

var OID_TO_HASH = {
	'1.2.840.113549.2.7': 'sha1',
	'1.2.840.113549.2.9': 'sha256',
	'1.2.840.113549.2.11': 'sha512'
};
var HASH_TO_OID = {};
Object.keys(OID_TO_HASH).forEach(function (k) {
	HASH_TO_OID[OID_TO_HASH[k]] = k;
});

/*
 * For reading we support both PKCS#1 and PKCS#8. If we find a private key,
 * we just take the public component of it and use that.
 */
function read(buf, options, forceType) {
	var input = buf;
	if (typeof (buf) !== 'string') {
		assert.buffer(buf, 'buf');
		buf = buf.toString('ascii');
	}

	var lines = buf.trim().split(/[\r\n]+/g);

	var m;
	var si = -1;
	while (!m && si < lines.length) {
		m = lines[++si].match(/*JSSTYLED*/
		    /[-]+[ ]*BEGIN ([A-Z0-9][A-Za-z0-9]+ )?(PUBLIC|PRIVATE) KEY[ ]*[-]+/);
	}
	assert.ok(m, 'invalid PEM header');

	var m2;
	var ei = lines.length;
	while (!m2 && ei > 0) {
		m2 = lines[--ei].match(/*JSSTYLED*/
		    /[-]+[ ]*END ([A-Z0-9][A-Za-z0-9]+ )?(PUBLIC|PRIVATE) KEY[ ]*[-]+/);
	}
	assert.ok(m2, 'invalid PEM footer');

	/* Begin and end banners must match key type */
	assert.equal(m[2], m2[2]);
	var type = m[2].toLowerCase();

	var alg;
	if (m[1]) {
		/* They also must match algorithms, if given */
		assert.equal(m[1], m2[1], 'PEM header and footer mismatch');
		alg = m[1].trim();
	}

	lines = lines.slice(si, ei + 1);

	var headers = {};
	while (true) {
		lines = lines.slice(1);
		m = lines[0].match(/*JSSTYLED*/
		    /^([A-Za-z0-9-]+): (.+)$/);
		if (!m)
			break;
		headers[m[1].toLowerCase()] = m[2];
	}

	/* Chop off the first and last lines */
	lines = lines.slice(0, -1).join('');
	buf = Buffer.from(lines, 'base64');

	var cipher, key, iv;
	if (headers['proc-type']) {
		var parts = headers['proc-type'].split(',');
		if (parts[0] === '4' && parts[1] === 'ENCRYPTED') {
			if (typeof (options.passphrase) === 'string') {
				options.passphrase = Buffer.from(
				    options.passphrase, 'utf-8');
			}
			if (!Buffer.isBuffer(options.passphrase)) {
				throw (new errors.KeyEncryptedError(
				    options.filename, 'PEM'));
			} else {
				parts = headers['dek-info'].split(',');
				assert.ok(parts.length === 2);
				cipher = parts[0].toLowerCase();
				iv = Buffer.from(parts[1], 'hex');
				key = utils.opensslKeyDeriv(cipher, iv,
				    options.passphrase, 1).key;
			}
		}
	}

	if (alg && alg.toLowerCase() === 'encrypted') {
		var eder = new asn1.BerReader(buf);
		var pbesEnd;
		eder.readSequence();

		eder.readSequence();
		pbesEnd = eder.offset + eder.length;

		var method = eder.readOID();
		if (method !== OID_PBES2) {
			throw (new Error('Unsupported PEM/PKCS8 encryption ' +
			    'scheme: ' + method));
		}

		eder.readSequence();	/* PBES2-params */

		eder.readSequence();	/* keyDerivationFunc */
		var kdfEnd = eder.offset + eder.length;
		var kdfOid = eder.readOID();
		if (kdfOid !== OID_PBKDF2)
			throw (new Error('Unsupported PBES2 KDF: ' + kdfOid));
		eder.readSequence();
		var salt = eder.readString(asn1.Ber.OctetString, true);
		var iterations = eder.readInt();
		var hashAlg = 'sha1';
		if (eder.offset < kdfEnd) {
			eder.readSequence();
			var hashAlgOid = eder.readOID();
			hashAlg = OID_TO_HASH[hashAlgOid];
			if (hashAlg === undefined) {
				throw (new Error('Unsupported PBKDF2 hash: ' +
				    hashAlgOid));
			}
		}
		eder._offset = kdfEnd;

		eder.readSequence();	/* encryptionScheme */
		var cipherOid = eder.readOID();
		cipher = OID_TO_CIPHER[cipherOid];
		if (cipher === undefined) {
			throw (new Error('Unsupported PBES2 cipher: ' +
			    cipherOid));
		}
		iv = eder.readString(asn1.Ber.OctetString, true);

		eder._offset = pbesEnd;
		buf = eder.readString(asn1.Ber.OctetString, true);

		if (typeof (options.passphrase) === 'string') {
			options.passphrase = Buffer.from(
			    options.passphrase, 'utf-8');
		}
		if (!Buffer.isBuffer(options.passphrase)) {
			throw (new errors.KeyEncryptedError(
			    options.filename, 'PEM'));
		}

		var cinfo = utils.opensshCipherInfo(cipher);

		cipher = cinfo.opensslName;
		key = utils.pbkdf2(hashAlg, salt, iterations, cinfo.keySize,
		    options.passphrase);
		alg = undefined;
	}

	if (cipher && key && iv) {
		var cipherStream = crypto.createDecipheriv(cipher, key, iv);
		var chunk, chunks = [];
		cipherStream.once('error', function (e) {
			if (e.toString().indexOf('bad decrypt') !== -1) {
				throw (new Error('Incorrect passphrase ' +
				    'supplied, could not decrypt key'));
			}
			throw (e);
		});
		cipherStream.write(buf);
		cipherStream.end();
		while ((chunk = cipherStream.read()) !== null)
			chunks.push(chunk);
		buf = Buffer.concat(chunks);
	}

	/* The new OpenSSH internal format abuses PEM headers */
	if (alg && alg.toLowerCase() === 'openssh')
		return (sshpriv.readSSHPrivate(type, buf, options));
	if (alg && alg.toLowerCase() === 'ssh2')
		return (rfc4253.readType(type, buf, options));

	var der = new asn1.BerReader(buf);
	der.originalInput = input;

	/*
	 * All of the PEM file types start with a sequence tag, so chop it
	 * off here
	 */
	der.readSequence();

	/* PKCS#1 type keys name an algorithm in the banner explicitly */
	if (alg) {
		if (forceType)
			assert.strictEqual(forceType, 'pkcs1');
		return (pkcs1.readPkcs1(alg, type, der));
	} else {
		if (forceType)
			assert.strictEqual(forceType, 'pkcs8');
		return (pkcs8.readPkcs8(alg, type, der));
	}
}

function write(key, options, type) {
	assert.object(key);

	var alg = {
	    'ecdsa': 'EC',
	    'rsa': 'RSA',
	    'dsa': 'DSA',
	    'ed25519': 'EdDSA'
	}[key.type];
	var header;

	var der = new asn1.BerWriter();

	if (PrivateKey.isPrivateKey(key)) {
		if (type && type === 'pkcs8') {
			header = 'PRIVATE KEY';
			pkcs8.writePkcs8(der, key);
		} else {
			if (type)
				assert.strictEqual(type, 'pkcs1');
			header = alg + ' PRIVATE KEY';
			pkcs1.writePkcs1(der, key);
		}

	} else if (Key.isKey(key)) {
		if (type && type === 'pkcs1') {
			header = alg + ' PUBLIC KEY';
			pkcs1.writePkcs1(der, key);
		} else {
			if (type)
				assert.strictEqual(type, 'pkcs8');
			header = 'PUBLIC KEY';
			pkcs8.writePkcs8(der, key);
		}

	} else {
		throw (new Error('key is not a Key or PrivateKey'));
	}

	var tmp = der.buffer.toString('base64');
	var len = tmp.length + (tmp.length / 64) +
	    18 + 16 + header.length*2 + 10;
	var buf = Buffer.alloc(len);
	var o = 0;
	o += buf.write('-----BEGIN ' + header + '-----\n', o);
	for (var i = 0; i < tmp.length; ) {
		var limit = i + 64;
		if (limit > tmp.length)
			limit = tmp.length;
		o += buf.write(tmp.slice(i, limit), o);
		buf[o++] = 10;
		i = limit;
	}
	o += buf.write('-----END ' + header + '-----\n', o);

	return (buf.slice(0, o));
}


/***/ }),

/***/ "WKVI":
/*!*********************************************!*\
  !*** ./node_modules/sshpk/lib/ed-compat.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// Copyright 2015 Joyent, Inc.

module.exports = {
	Verifier: Verifier,
	Signer: Signer
};

var nacl = __webpack_require__(/*! tweetnacl */ "WKRr");
var stream = __webpack_require__(/*! stream */ "1IWx");
var util = __webpack_require__(/*! util */ "7tlc");
var assert = __webpack_require__(/*! assert-plus */ "60GX");
var Buffer = __webpack_require__(/*! safer-buffer */ "xZGU").Buffer;
var Signature = __webpack_require__(/*! ./signature */ "ZVj6");

function Verifier(key, hashAlgo) {
	if (hashAlgo.toLowerCase() !== 'sha512')
		throw (new Error('ED25519 only supports the use of ' +
		    'SHA-512 hashes'));

	this.key = key;
	this.chunks = [];

	stream.Writable.call(this, {});
}
util.inherits(Verifier, stream.Writable);

Verifier.prototype._write = function (chunk, enc, cb) {
	this.chunks.push(chunk);
	cb();
};

Verifier.prototype.update = function (chunk) {
	if (typeof (chunk) === 'string')
		chunk = Buffer.from(chunk, 'binary');
	this.chunks.push(chunk);
};

Verifier.prototype.verify = function (signature, fmt) {
	var sig;
	if (Signature.isSignature(signature, [2, 0])) {
		if (signature.type !== 'ed25519')
			return (false);
		sig = signature.toBuffer('raw');

	} else if (typeof (signature) === 'string') {
		sig = Buffer.from(signature, 'base64');

	} else if (Signature.isSignature(signature, [1, 0])) {
		throw (new Error('signature was created by too old ' +
		    'a version of sshpk and cannot be verified'));
	}

	assert.buffer(sig);
	return (nacl.sign.detached.verify(
	    new Uint8Array(Buffer.concat(this.chunks)),
	    new Uint8Array(sig),
	    new Uint8Array(this.key.part.A.data)));
};

function Signer(key, hashAlgo) {
	if (hashAlgo.toLowerCase() !== 'sha512')
		throw (new Error('ED25519 only supports the use of ' +
		    'SHA-512 hashes'));

	this.key = key;
	this.chunks = [];

	stream.Writable.call(this, {});
}
util.inherits(Signer, stream.Writable);

Signer.prototype._write = function (chunk, enc, cb) {
	this.chunks.push(chunk);
	cb();
};

Signer.prototype.update = function (chunk) {
	if (typeof (chunk) === 'string')
		chunk = Buffer.from(chunk, 'binary');
	this.chunks.push(chunk);
};

Signer.prototype.sign = function () {
	var sig = nacl.sign.detached(
	    new Uint8Array(Buffer.concat(this.chunks)),
	    new Uint8Array(Buffer.concat([
		this.key.part.k.data, this.key.part.A.data])));
	var sigBuf = Buffer.from(sig);
	var sigObj = Signature.parse(sigBuf, 'ed25519', 'raw');
	sigObj.hashAlgorithm = 'sha512';
	return (sigObj);
};


/***/ }),

/***/ "YiDp":
/*!**************************************************!*\
  !*** ./node_modules/sshpk/lib/formats/dnssec.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// Copyright 2017 Joyent, Inc.

module.exports = {
	read: read,
	write: write
};

var assert = __webpack_require__(/*! assert-plus */ "60GX");
var Buffer = __webpack_require__(/*! safer-buffer */ "xZGU").Buffer;
var Key = __webpack_require__(/*! ../key */ "qfPv");
var PrivateKey = __webpack_require__(/*! ../private-key */ "UtVk");
var utils = __webpack_require__(/*! ../utils */ "43+q");
var SSHBuffer = __webpack_require__(/*! ../ssh-buffer */ "cPuN");
var Dhe = __webpack_require__(/*! ../dhe */ "tfmF");

var supportedAlgos = {
	'rsa-sha1' : 5,
	'rsa-sha256' : 8,
	'rsa-sha512' : 10,
	'ecdsa-p256-sha256' : 13,
	'ecdsa-p384-sha384' : 14
	/*
	 * ed25519 is hypothetically supported with id 15
	 * but the common tools available don't appear to be
	 * capable of generating/using ed25519 keys
	 */
};

var supportedAlgosById = {};
Object.keys(supportedAlgos).forEach(function (k) {
	supportedAlgosById[supportedAlgos[k]] = k.toUpperCase();
});

function read(buf, options) {
	if (typeof (buf) !== 'string') {
		assert.buffer(buf, 'buf');
		buf = buf.toString('ascii');
	}
	var lines = buf.split('\n');
	if (lines[0].match(/^Private-key-format\: v1/)) {
		var algElems = lines[1].split(' ');
		var algoNum = parseInt(algElems[1], 10);
		var algoName = algElems[2];
		if (!supportedAlgosById[algoNum])
			throw (new Error('Unsupported algorithm: ' + algoName));
		return (readDNSSECPrivateKey(algoNum, lines.slice(2)));
	}

	// skip any comment-lines
	var line = 0;
	/* JSSTYLED */
	while (lines[line].match(/^\;/))
		line++;
	// we should now have *one single* line left with our KEY on it.
	if ((lines[line].match(/\. IN KEY /) ||
	    lines[line].match(/\. IN DNSKEY /)) && lines[line+1].length === 0) {
		return (readRFC3110(lines[line]));
	}
	throw (new Error('Cannot parse dnssec key'));
}

function readRFC3110(keyString) {
	var elems = keyString.split(' ');
	//unused var flags = parseInt(elems[3], 10);
	//unused var protocol = parseInt(elems[4], 10);
	var algorithm = parseInt(elems[5], 10);
	if (!supportedAlgosById[algorithm])
		throw (new Error('Unsupported algorithm: ' + algorithm));
	var base64key = elems.slice(6, elems.length).join();
	var keyBuffer = Buffer.from(base64key, 'base64');
	if (supportedAlgosById[algorithm].match(/^RSA-/)) {
		// join the rest of the body into a single base64-blob
		var publicExponentLen = keyBuffer.readUInt8(0);
		if (publicExponentLen != 3 && publicExponentLen != 1)
			throw (new Error('Cannot parse dnssec key: ' +
			    'unsupported exponent length'));

		var publicExponent = keyBuffer.slice(1, publicExponentLen+1);
		publicExponent = utils.mpNormalize(publicExponent);
		var modulus = keyBuffer.slice(1+publicExponentLen);
		modulus = utils.mpNormalize(modulus);
		// now, make the key
		var rsaKey = {
			type: 'rsa',
			parts: []
		};
		rsaKey.parts.push({ name: 'e', data: publicExponent});
		rsaKey.parts.push({ name: 'n', data: modulus});
		return (new Key(rsaKey));
	}
	if (supportedAlgosById[algorithm] === 'ECDSA-P384-SHA384' ||
	    supportedAlgosById[algorithm] === 'ECDSA-P256-SHA256') {
		var curve = 'nistp384';
		var size = 384;
		if (supportedAlgosById[algorithm].match(/^ECDSA-P256-SHA256/)) {
			curve = 'nistp256';
			size = 256;
		}

		var ecdsaKey = {
			type: 'ecdsa',
			curve: curve,
			size: size,
			parts: [
				{name: 'curve', data: Buffer.from(curve) },
				{name: 'Q', data: utils.ecNormalize(keyBuffer) }
			]
		};
		return (new Key(ecdsaKey));
	}
	throw (new Error('Unsupported algorithm: ' +
	    supportedAlgosById[algorithm]));
}

function elementToBuf(e) {
	return (Buffer.from(e.split(' ')[1], 'base64'));
}

function readDNSSECRSAPrivateKey(elements) {
	var rsaParams = {};
	elements.forEach(function (element) {
		if (element.split(' ')[0] === 'Modulus:')
			rsaParams['n'] = elementToBuf(element);
		else if (element.split(' ')[0] === 'PublicExponent:')
			rsaParams['e'] = elementToBuf(element);
		else if (element.split(' ')[0] === 'PrivateExponent:')
			rsaParams['d'] = elementToBuf(element);
		else if (element.split(' ')[0] === 'Prime1:')
			rsaParams['p'] = elementToBuf(element);
		else if (element.split(' ')[0] === 'Prime2:')
			rsaParams['q'] = elementToBuf(element);
		else if (element.split(' ')[0] === 'Exponent1:')
			rsaParams['dmodp'] = elementToBuf(element);
		else if (element.split(' ')[0] === 'Exponent2:')
			rsaParams['dmodq'] = elementToBuf(element);
		else if (element.split(' ')[0] === 'Coefficient:')
			rsaParams['iqmp'] = elementToBuf(element);
	});
	// now, make the key
	var key = {
		type: 'rsa',
		parts: [
			{ name: 'e', data: utils.mpNormalize(rsaParams['e'])},
			{ name: 'n', data: utils.mpNormalize(rsaParams['n'])},
			{ name: 'd', data: utils.mpNormalize(rsaParams['d'])},
			{ name: 'p', data: utils.mpNormalize(rsaParams['p'])},
			{ name: 'q', data: utils.mpNormalize(rsaParams['q'])},
			{ name: 'dmodp',
			    data: utils.mpNormalize(rsaParams['dmodp'])},
			{ name: 'dmodq',
			    data: utils.mpNormalize(rsaParams['dmodq'])},
			{ name: 'iqmp',
			    data: utils.mpNormalize(rsaParams['iqmp'])}
		]
	};
	return (new PrivateKey(key));
}

function readDNSSECPrivateKey(alg, elements) {
	if (supportedAlgosById[alg].match(/^RSA-/)) {
		return (readDNSSECRSAPrivateKey(elements));
	}
	if (supportedAlgosById[alg] === 'ECDSA-P384-SHA384' ||
	    supportedAlgosById[alg] === 'ECDSA-P256-SHA256') {
		var d = Buffer.from(elements[0].split(' ')[1], 'base64');
		var curve = 'nistp384';
		var size = 384;
		if (supportedAlgosById[alg] === 'ECDSA-P256-SHA256') {
			curve = 'nistp256';
			size = 256;
		}
		// DNSSEC generates the public-key on the fly (go calculate it)
		var publicKey = utils.publicFromPrivateECDSA(curve, d);
		var Q = publicKey.part['Q'].data;
		var ecdsaKey = {
			type: 'ecdsa',
			curve: curve,
			size: size,
			parts: [
				{name: 'curve', data: Buffer.from(curve) },
				{name: 'd', data: d },
				{name: 'Q', data: Q }
			]
		};
		return (new PrivateKey(ecdsaKey));
	}
	throw (new Error('Unsupported algorithm: ' + supportedAlgosById[alg]));
}

function dnssecTimestamp(date) {
	var year = date.getFullYear() + ''; //stringify
	var month = (date.getMonth() + 1);
	var timestampStr = year + month + date.getUTCDate();
	timestampStr += '' + date.getUTCHours() + date.getUTCMinutes();
	timestampStr += date.getUTCSeconds();
	return (timestampStr);
}

function rsaAlgFromOptions(opts) {
	if (!opts || !opts.hashAlgo || opts.hashAlgo === 'sha1')
		return ('5 (RSASHA1)');
	else if (opts.hashAlgo === 'sha256')
		return ('8 (RSASHA256)');
	else if (opts.hashAlgo === 'sha512')
		return ('10 (RSASHA512)');
	else
		throw (new Error('Unknown or unsupported hash: ' +
		    opts.hashAlgo));
}

function writeRSA(key, options) {
	// if we're missing parts, add them.
	if (!key.part.dmodp || !key.part.dmodq) {
		utils.addRSAMissing(key);
	}

	var out = '';
	out += 'Private-key-format: v1.3\n';
	out += 'Algorithm: ' + rsaAlgFromOptions(options) + '\n';
	var n = utils.mpDenormalize(key.part['n'].data);
	out += 'Modulus: ' + n.toString('base64') + '\n';
	var e = utils.mpDenormalize(key.part['e'].data);
	out += 'PublicExponent: ' + e.toString('base64') + '\n';
	var d = utils.mpDenormalize(key.part['d'].data);
	out += 'PrivateExponent: ' + d.toString('base64') + '\n';
	var p = utils.mpDenormalize(key.part['p'].data);
	out += 'Prime1: ' + p.toString('base64') + '\n';
	var q = utils.mpDenormalize(key.part['q'].data);
	out += 'Prime2: ' + q.toString('base64') + '\n';
	var dmodp = utils.mpDenormalize(key.part['dmodp'].data);
	out += 'Exponent1: ' + dmodp.toString('base64') + '\n';
	var dmodq = utils.mpDenormalize(key.part['dmodq'].data);
	out += 'Exponent2: ' + dmodq.toString('base64') + '\n';
	var iqmp = utils.mpDenormalize(key.part['iqmp'].data);
	out += 'Coefficient: ' + iqmp.toString('base64') + '\n';
	// Assume that we're valid as-of now
	var timestamp = new Date();
	out += 'Created: ' + dnssecTimestamp(timestamp) + '\n';
	out += 'Publish: ' + dnssecTimestamp(timestamp) + '\n';
	out += 'Activate: ' + dnssecTimestamp(timestamp) + '\n';
	return (Buffer.from(out, 'ascii'));
}

function writeECDSA(key, options) {
	var out = '';
	out += 'Private-key-format: v1.3\n';

	if (key.curve === 'nistp256') {
		out += 'Algorithm: 13 (ECDSAP256SHA256)\n';
	} else if (key.curve === 'nistp384') {
		out += 'Algorithm: 14 (ECDSAP384SHA384)\n';
	} else {
		throw (new Error('Unsupported curve'));
	}
	var base64Key = key.part['d'].data.toString('base64');
	out += 'PrivateKey: ' + base64Key + '\n';

	// Assume that we're valid as-of now
	var timestamp = new Date();
	out += 'Created: ' + dnssecTimestamp(timestamp) + '\n';
	out += 'Publish: ' + dnssecTimestamp(timestamp) + '\n';
	out += 'Activate: ' + dnssecTimestamp(timestamp) + '\n';

	return (Buffer.from(out, 'ascii'));
}

function write(key, options) {
	if (PrivateKey.isPrivateKey(key)) {
		if (key.type === 'rsa') {
			return (writeRSA(key, options));
		} else if (key.type === 'ecdsa') {
			return (writeECDSA(key, options));
		} else {
			throw (new Error('Unsupported algorithm: ' + key.type));
		}
	} else if (Key.isKey(key)) {
		/*
		 * RFC3110 requires a keyname, and a keytype, which we
		 * don't really have a mechanism for specifying such
		 * additional metadata.
		 */
		throw (new Error('Format "dnssec" only supports ' +
		    'writing private keys'));
	} else {
		throw (new Error('key is not a Key or PrivateKey'));
	}
}


/***/ }),

/***/ "ZLZ5":
/*!*************************************************!*\
  !*** ./node_modules/sshpk/lib/formats/pkcs8.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// Copyright 2018 Joyent, Inc.

module.exports = {
	read: read,
	readPkcs8: readPkcs8,
	write: write,
	writePkcs8: writePkcs8,
	pkcs8ToBuffer: pkcs8ToBuffer,

	readECDSACurve: readECDSACurve,
	writeECDSACurve: writeECDSACurve
};

var assert = __webpack_require__(/*! assert-plus */ "60GX");
var asn1 = __webpack_require__(/*! asn1 */ "ZkxX");
var Buffer = __webpack_require__(/*! safer-buffer */ "xZGU").Buffer;
var algs = __webpack_require__(/*! ../algs */ "r++l");
var utils = __webpack_require__(/*! ../utils */ "43+q");
var Key = __webpack_require__(/*! ../key */ "qfPv");
var PrivateKey = __webpack_require__(/*! ../private-key */ "UtVk");
var pem = __webpack_require__(/*! ./pem */ "ViER");

function read(buf, options) {
	return (pem.read(buf, options, 'pkcs8'));
}

function write(key, options) {
	return (pem.write(key, options, 'pkcs8'));
}

/* Helper to read in a single mpint */
function readMPInt(der, nm) {
	assert.strictEqual(der.peek(), asn1.Ber.Integer,
	    nm + ' is not an Integer');
	return (utils.mpNormalize(der.readString(asn1.Ber.Integer, true)));
}

function readPkcs8(alg, type, der) {
	/* Private keys in pkcs#8 format have a weird extra int */
	if (der.peek() === asn1.Ber.Integer) {
		assert.strictEqual(type, 'private',
		    'unexpected Integer at start of public key');
		der.readString(asn1.Ber.Integer, true);
	}

	der.readSequence();
	var next = der.offset + der.length;

	var oid = der.readOID();
	switch (oid) {
	case '1.2.840.113549.1.1.1':
		der._offset = next;
		if (type === 'public')
			return (readPkcs8RSAPublic(der));
		else
			return (readPkcs8RSAPrivate(der));
	case '1.2.840.10040.4.1':
		if (type === 'public')
			return (readPkcs8DSAPublic(der));
		else
			return (readPkcs8DSAPrivate(der));
	case '1.2.840.10045.2.1':
		if (type === 'public')
			return (readPkcs8ECDSAPublic(der));
		else
			return (readPkcs8ECDSAPrivate(der));
	case '1.3.101.112':
		if (type === 'public') {
			return (readPkcs8EdDSAPublic(der));
		} else {
			return (readPkcs8EdDSAPrivate(der));
		}
	case '1.3.101.110':
		if (type === 'public') {
			return (readPkcs8X25519Public(der));
		} else {
			return (readPkcs8X25519Private(der));
		}
	default:
		throw (new Error('Unknown key type OID ' + oid));
	}
}

function readPkcs8RSAPublic(der) {
	// bit string sequence
	der.readSequence(asn1.Ber.BitString);
	der.readByte();
	der.readSequence();

	// modulus
	var n = readMPInt(der, 'modulus');
	var e = readMPInt(der, 'exponent');

	// now, make the key
	var key = {
		type: 'rsa',
		source: der.originalInput,
		parts: [
			{ name: 'e', data: e },
			{ name: 'n', data: n }
		]
	};

	return (new Key(key));
}

function readPkcs8RSAPrivate(der) {
	der.readSequence(asn1.Ber.OctetString);
	der.readSequence();

	var ver = readMPInt(der, 'version');
	assert.equal(ver[0], 0x0, 'unknown RSA private key version');

	// modulus then public exponent
	var n = readMPInt(der, 'modulus');
	var e = readMPInt(der, 'public exponent');
	var d = readMPInt(der, 'private exponent');
	var p = readMPInt(der, 'prime1');
	var q = readMPInt(der, 'prime2');
	var dmodp = readMPInt(der, 'exponent1');
	var dmodq = readMPInt(der, 'exponent2');
	var iqmp = readMPInt(der, 'iqmp');

	// now, make the key
	var key = {
		type: 'rsa',
		parts: [
			{ name: 'n', data: n },
			{ name: 'e', data: e },
			{ name: 'd', data: d },
			{ name: 'iqmp', data: iqmp },
			{ name: 'p', data: p },
			{ name: 'q', data: q },
			{ name: 'dmodp', data: dmodp },
			{ name: 'dmodq', data: dmodq }
		]
	};

	return (new PrivateKey(key));
}

function readPkcs8DSAPublic(der) {
	der.readSequence();

	var p = readMPInt(der, 'p');
	var q = readMPInt(der, 'q');
	var g = readMPInt(der, 'g');

	// bit string sequence
	der.readSequence(asn1.Ber.BitString);
	der.readByte();

	var y = readMPInt(der, 'y');

	// now, make the key
	var key = {
		type: 'dsa',
		parts: [
			{ name: 'p', data: p },
			{ name: 'q', data: q },
			{ name: 'g', data: g },
			{ name: 'y', data: y }
		]
	};

	return (new Key(key));
}

function readPkcs8DSAPrivate(der) {
	der.readSequence();

	var p = readMPInt(der, 'p');
	var q = readMPInt(der, 'q');
	var g = readMPInt(der, 'g');

	der.readSequence(asn1.Ber.OctetString);
	var x = readMPInt(der, 'x');

	/* The pkcs#8 format does not include the public key */
	var y = utils.calculateDSAPublic(g, p, x);

	var key = {
		type: 'dsa',
		parts: [
			{ name: 'p', data: p },
			{ name: 'q', data: q },
			{ name: 'g', data: g },
			{ name: 'y', data: y },
			{ name: 'x', data: x }
		]
	};

	return (new PrivateKey(key));
}

function readECDSACurve(der) {
	var curveName, curveNames;
	var j, c, cd;

	if (der.peek() === asn1.Ber.OID) {
		var oid = der.readOID();

		curveNames = Object.keys(algs.curves);
		for (j = 0; j < curveNames.length; ++j) {
			c = curveNames[j];
			cd = algs.curves[c];
			if (cd.pkcs8oid === oid) {
				curveName = c;
				break;
			}
		}

	} else {
		// ECParameters sequence
		der.readSequence();
		var version = der.readString(asn1.Ber.Integer, true);
		assert.strictEqual(version[0], 1, 'ECDSA key not version 1');

		var curve = {};

		// FieldID sequence
		der.readSequence();
		var fieldTypeOid = der.readOID();
		assert.strictEqual(fieldTypeOid, '1.2.840.10045.1.1',
		    'ECDSA key is not from a prime-field');
		var p = curve.p = utils.mpNormalize(
		    der.readString(asn1.Ber.Integer, true));
		/*
		 * p always starts with a 1 bit, so count the zeros to get its
		 * real size.
		 */
		curve.size = p.length * 8 - utils.countZeros(p);

		// Curve sequence
		der.readSequence();
		curve.a = utils.mpNormalize(
		    der.readString(asn1.Ber.OctetString, true));
		curve.b = utils.mpNormalize(
		    der.readString(asn1.Ber.OctetString, true));
		if (der.peek() === asn1.Ber.BitString)
			curve.s = der.readString(asn1.Ber.BitString, true);

		// Combined Gx and Gy
		curve.G = der.readString(asn1.Ber.OctetString, true);
		assert.strictEqual(curve.G[0], 0x4,
		    'uncompressed G is required');

		curve.n = utils.mpNormalize(
		    der.readString(asn1.Ber.Integer, true));
		curve.h = utils.mpNormalize(
		    der.readString(asn1.Ber.Integer, true));
		assert.strictEqual(curve.h[0], 0x1, 'a cofactor=1 curve is ' +
		    'required');

		curveNames = Object.keys(algs.curves);
		var ks = Object.keys(curve);
		for (j = 0; j < curveNames.length; ++j) {
			c = curveNames[j];
			cd = algs.curves[c];
			var equal = true;
			for (var i = 0; i < ks.length; ++i) {
				var k = ks[i];
				if (cd[k] === undefined)
					continue;
				if (typeof (cd[k]) === 'object' &&
				    cd[k].equals !== undefined) {
					if (!cd[k].equals(curve[k])) {
						equal = false;
						break;
					}
				} else if (Buffer.isBuffer(cd[k])) {
					if (cd[k].toString('binary')
					    !== curve[k].toString('binary')) {
						equal = false;
						break;
					}
				} else {
					if (cd[k] !== curve[k]) {
						equal = false;
						break;
					}
				}
			}
			if (equal) {
				curveName = c;
				break;
			}
		}
	}
	return (curveName);
}

function readPkcs8ECDSAPrivate(der) {
	var curveName = readECDSACurve(der);
	assert.string(curveName, 'a known elliptic curve');

	der.readSequence(asn1.Ber.OctetString);
	der.readSequence();

	var version = readMPInt(der, 'version');
	assert.equal(version[0], 1, 'unknown version of ECDSA key');

	var d = der.readString(asn1.Ber.OctetString, true);
	var Q;

	if (der.peek() == 0xa0) {
		der.readSequence(0xa0);
		der._offset += der.length;
	}
	if (der.peek() == 0xa1) {
		der.readSequence(0xa1);
		Q = der.readString(asn1.Ber.BitString, true);
		Q = utils.ecNormalize(Q);
	}

	if (Q === undefined) {
		var pub = utils.publicFromPrivateECDSA(curveName, d);
		Q = pub.part.Q.data;
	}

	var key = {
		type: 'ecdsa',
		parts: [
			{ name: 'curve', data: Buffer.from(curveName) },
			{ name: 'Q', data: Q },
			{ name: 'd', data: d }
		]
	};

	return (new PrivateKey(key));
}

function readPkcs8ECDSAPublic(der) {
	var curveName = readECDSACurve(der);
	assert.string(curveName, 'a known elliptic curve');

	var Q = der.readString(asn1.Ber.BitString, true);
	Q = utils.ecNormalize(Q);

	var key = {
		type: 'ecdsa',
		parts: [
			{ name: 'curve', data: Buffer.from(curveName) },
			{ name: 'Q', data: Q }
		]
	};

	return (new Key(key));
}

function readPkcs8EdDSAPublic(der) {
	if (der.peek() === 0x00)
		der.readByte();

	var A = utils.readBitString(der);

	var key = {
		type: 'ed25519',
		parts: [
			{ name: 'A', data: utils.zeroPadToLength(A, 32) }
		]
	};

	return (new Key(key));
}

function readPkcs8X25519Public(der) {
	var A = utils.readBitString(der);

	var key = {
		type: 'curve25519',
		parts: [
			{ name: 'A', data: utils.zeroPadToLength(A, 32) }
		]
	};

	return (new Key(key));
}

function readPkcs8EdDSAPrivate(der) {
	if (der.peek() === 0x00)
		der.readByte();

	der.readSequence(asn1.Ber.OctetString);
	var k = der.readString(asn1.Ber.OctetString, true);
	k = utils.zeroPadToLength(k, 32);

	var A;
	if (der.peek() === asn1.Ber.BitString) {
		A = utils.readBitString(der);
		A = utils.zeroPadToLength(A, 32);
	} else {
		A = utils.calculateED25519Public(k);
	}

	var key = {
		type: 'ed25519',
		parts: [
			{ name: 'A', data: utils.zeroPadToLength(A, 32) },
			{ name: 'k', data: utils.zeroPadToLength(k, 32) }
		]
	};

	return (new PrivateKey(key));
}

function readPkcs8X25519Private(der) {
	if (der.peek() === 0x00)
		der.readByte();

	der.readSequence(asn1.Ber.OctetString);
	var k = der.readString(asn1.Ber.OctetString, true);
	k = utils.zeroPadToLength(k, 32);

	var A = utils.calculateX25519Public(k);

	var key = {
		type: 'curve25519',
		parts: [
			{ name: 'A', data: utils.zeroPadToLength(A, 32) },
			{ name: 'k', data: utils.zeroPadToLength(k, 32) }
		]
	};

	return (new PrivateKey(key));
}

function pkcs8ToBuffer(key) {
	var der = new asn1.BerWriter();
	writePkcs8(der, key);
	return (der.buffer);
}

function writePkcs8(der, key) {
	der.startSequence();

	if (PrivateKey.isPrivateKey(key)) {
		var sillyInt = Buffer.from([0]);
		der.writeBuffer(sillyInt, asn1.Ber.Integer);
	}

	der.startSequence();
	switch (key.type) {
	case 'rsa':
		der.writeOID('1.2.840.113549.1.1.1');
		if (PrivateKey.isPrivateKey(key))
			writePkcs8RSAPrivate(key, der);
		else
			writePkcs8RSAPublic(key, der);
		break;
	case 'dsa':
		der.writeOID('1.2.840.10040.4.1');
		if (PrivateKey.isPrivateKey(key))
			writePkcs8DSAPrivate(key, der);
		else
			writePkcs8DSAPublic(key, der);
		break;
	case 'ecdsa':
		der.writeOID('1.2.840.10045.2.1');
		if (PrivateKey.isPrivateKey(key))
			writePkcs8ECDSAPrivate(key, der);
		else
			writePkcs8ECDSAPublic(key, der);
		break;
	case 'ed25519':
		der.writeOID('1.3.101.112');
		if (PrivateKey.isPrivateKey(key))
			throw (new Error('Ed25519 private keys in pkcs8 ' +
			    'format are not supported'));
		writePkcs8EdDSAPublic(key, der);
		break;
	default:
		throw (new Error('Unsupported key type: ' + key.type));
	}

	der.endSequence();
}

function writePkcs8RSAPrivate(key, der) {
	der.writeNull();
	der.endSequence();

	der.startSequence(asn1.Ber.OctetString);
	der.startSequence();

	var version = Buffer.from([0]);
	der.writeBuffer(version, asn1.Ber.Integer);

	der.writeBuffer(key.part.n.data, asn1.Ber.Integer);
	der.writeBuffer(key.part.e.data, asn1.Ber.Integer);
	der.writeBuffer(key.part.d.data, asn1.Ber.Integer);
	der.writeBuffer(key.part.p.data, asn1.Ber.Integer);
	der.writeBuffer(key.part.q.data, asn1.Ber.Integer);
	if (!key.part.dmodp || !key.part.dmodq)
		utils.addRSAMissing(key);
	der.writeBuffer(key.part.dmodp.data, asn1.Ber.Integer);
	der.writeBuffer(key.part.dmodq.data, asn1.Ber.Integer);
	der.writeBuffer(key.part.iqmp.data, asn1.Ber.Integer);

	der.endSequence();
	der.endSequence();
}

function writePkcs8RSAPublic(key, der) {
	der.writeNull();
	der.endSequence();

	der.startSequence(asn1.Ber.BitString);
	der.writeByte(0x00);

	der.startSequence();
	der.writeBuffer(key.part.n.data, asn1.Ber.Integer);
	der.writeBuffer(key.part.e.data, asn1.Ber.Integer);
	der.endSequence();

	der.endSequence();
}

function writePkcs8DSAPrivate(key, der) {
	der.startSequence();
	der.writeBuffer(key.part.p.data, asn1.Ber.Integer);
	der.writeBuffer(key.part.q.data, asn1.Ber.Integer);
	der.writeBuffer(key.part.g.data, asn1.Ber.Integer);
	der.endSequence();

	der.endSequence();

	der.startSequence(asn1.Ber.OctetString);
	der.writeBuffer(key.part.x.data, asn1.Ber.Integer);
	der.endSequence();
}

function writePkcs8DSAPublic(key, der) {
	der.startSequence();
	der.writeBuffer(key.part.p.data, asn1.Ber.Integer);
	der.writeBuffer(key.part.q.data, asn1.Ber.Integer);
	der.writeBuffer(key.part.g.data, asn1.Ber.Integer);
	der.endSequence();
	der.endSequence();

	der.startSequence(asn1.Ber.BitString);
	der.writeByte(0x00);
	der.writeBuffer(key.part.y.data, asn1.Ber.Integer);
	der.endSequence();
}

function writeECDSACurve(key, der) {
	var curve = algs.curves[key.curve];
	if (curve.pkcs8oid) {
		/* This one has a name in pkcs#8, so just write the oid */
		der.writeOID(curve.pkcs8oid);

	} else {
		// ECParameters sequence
		der.startSequence();

		var version = Buffer.from([1]);
		der.writeBuffer(version, asn1.Ber.Integer);

		// FieldID sequence
		der.startSequence();
		der.writeOID('1.2.840.10045.1.1'); // prime-field
		der.writeBuffer(curve.p, asn1.Ber.Integer);
		der.endSequence();

		// Curve sequence
		der.startSequence();
		var a = curve.p;
		if (a[0] === 0x0)
			a = a.slice(1);
		der.writeBuffer(a, asn1.Ber.OctetString);
		der.writeBuffer(curve.b, asn1.Ber.OctetString);
		der.writeBuffer(curve.s, asn1.Ber.BitString);
		der.endSequence();

		der.writeBuffer(curve.G, asn1.Ber.OctetString);
		der.writeBuffer(curve.n, asn1.Ber.Integer);
		var h = curve.h;
		if (!h) {
			h = Buffer.from([1]);
		}
		der.writeBuffer(h, asn1.Ber.Integer);

		// ECParameters
		der.endSequence();
	}
}

function writePkcs8ECDSAPublic(key, der) {
	writeECDSACurve(key, der);
	der.endSequence();

	var Q = utils.ecNormalize(key.part.Q.data, true);
	der.writeBuffer(Q, asn1.Ber.BitString);
}

function writePkcs8ECDSAPrivate(key, der) {
	writeECDSACurve(key, der);
	der.endSequence();

	der.startSequence(asn1.Ber.OctetString);
	der.startSequence();

	var version = Buffer.from([1]);
	der.writeBuffer(version, asn1.Ber.Integer);

	der.writeBuffer(key.part.d.data, asn1.Ber.OctetString);

	der.startSequence(0xa1);
	var Q = utils.ecNormalize(key.part.Q.data, true);
	der.writeBuffer(Q, asn1.Ber.BitString);
	der.endSequence();

	der.endSequence();
	der.endSequence();
}

function writePkcs8EdDSAPublic(key, der) {
	der.endSequence();

	utils.writeBitString(der, key.part.A.data);
}

function writePkcs8EdDSAPrivate(key, der) {
	der.endSequence();

	var k = utils.mpNormalize(key.part.k.data, true);
	der.startSequence(asn1.Ber.OctetString);
	der.writeBuffer(k, asn1.Ber.OctetString);
	der.endSequence();
}


/***/ }),

/***/ "ZVj6":
/*!*********************************************!*\
  !*** ./node_modules/sshpk/lib/signature.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// Copyright 2015 Joyent, Inc.

module.exports = Signature;

var assert = __webpack_require__(/*! assert-plus */ "60GX");
var Buffer = __webpack_require__(/*! safer-buffer */ "xZGU").Buffer;
var algs = __webpack_require__(/*! ./algs */ "r++l");
var crypto = __webpack_require__(/*! crypto */ "HEbw");
var errs = __webpack_require__(/*! ./errors */ "HvMK");
var utils = __webpack_require__(/*! ./utils */ "43+q");
var asn1 = __webpack_require__(/*! asn1 */ "ZkxX");
var SSHBuffer = __webpack_require__(/*! ./ssh-buffer */ "cPuN");

var InvalidAlgorithmError = errs.InvalidAlgorithmError;
var SignatureParseError = errs.SignatureParseError;

function Signature(opts) {
	assert.object(opts, 'options');
	assert.arrayOfObject(opts.parts, 'options.parts');
	assert.string(opts.type, 'options.type');

	var partLookup = {};
	for (var i = 0; i < opts.parts.length; ++i) {
		var part = opts.parts[i];
		partLookup[part.name] = part;
	}

	this.type = opts.type;
	this.hashAlgorithm = opts.hashAlgo;
	this.curve = opts.curve;
	this.parts = opts.parts;
	this.part = partLookup;
}

Signature.prototype.toBuffer = function (format) {
	if (format === undefined)
		format = 'asn1';
	assert.string(format, 'format');

	var buf;
	var stype = 'ssh-' + this.type;

	switch (this.type) {
	case 'rsa':
		switch (this.hashAlgorithm) {
		case 'sha256':
			stype = 'rsa-sha2-256';
			break;
		case 'sha512':
			stype = 'rsa-sha2-512';
			break;
		case 'sha1':
		case undefined:
			break;
		default:
			throw (new Error('SSH signature ' +
			    'format does not support hash ' +
			    'algorithm ' + this.hashAlgorithm));
		}
		if (format === 'ssh') {
			buf = new SSHBuffer({});
			buf.writeString(stype);
			buf.writePart(this.part.sig);
			return (buf.toBuffer());
		} else {
			return (this.part.sig.data);
		}
		break;

	case 'ed25519':
		if (format === 'ssh') {
			buf = new SSHBuffer({});
			buf.writeString(stype);
			buf.writePart(this.part.sig);
			return (buf.toBuffer());
		} else {
			return (this.part.sig.data);
		}
		break;

	case 'dsa':
	case 'ecdsa':
		var r, s;
		if (format === 'asn1') {
			var der = new asn1.BerWriter();
			der.startSequence();
			r = utils.mpNormalize(this.part.r.data);
			s = utils.mpNormalize(this.part.s.data);
			der.writeBuffer(r, asn1.Ber.Integer);
			der.writeBuffer(s, asn1.Ber.Integer);
			der.endSequence();
			return (der.buffer);
		} else if (format === 'ssh' && this.type === 'dsa') {
			buf = new SSHBuffer({});
			buf.writeString('ssh-dss');
			r = this.part.r.data;
			if (r.length > 20 && r[0] === 0x00)
				r = r.slice(1);
			s = this.part.s.data;
			if (s.length > 20 && s[0] === 0x00)
				s = s.slice(1);
			if ((this.hashAlgorithm &&
			    this.hashAlgorithm !== 'sha1') ||
			    r.length + s.length !== 40) {
				throw (new Error('OpenSSH only supports ' +
				    'DSA signatures with SHA1 hash'));
			}
			buf.writeBuffer(Buffer.concat([r, s]));
			return (buf.toBuffer());
		} else if (format === 'ssh' && this.type === 'ecdsa') {
			var inner = new SSHBuffer({});
			r = this.part.r.data;
			inner.writeBuffer(r);
			inner.writePart(this.part.s);

			buf = new SSHBuffer({});
			/* XXX: find a more proper way to do this? */
			var curve;
			if (r[0] === 0x00)
				r = r.slice(1);
			var sz = r.length * 8;
			if (sz === 256)
				curve = 'nistp256';
			else if (sz === 384)
				curve = 'nistp384';
			else if (sz === 528)
				curve = 'nistp521';
			buf.writeString('ecdsa-sha2-' + curve);
			buf.writeBuffer(inner.toBuffer());
			return (buf.toBuffer());
		}
		throw (new Error('Invalid signature format'));
	default:
		throw (new Error('Invalid signature data'));
	}
};

Signature.prototype.toString = function (format) {
	assert.optionalString(format, 'format');
	return (this.toBuffer(format).toString('base64'));
};

Signature.parse = function (data, type, format) {
	if (typeof (data) === 'string')
		data = Buffer.from(data, 'base64');
	assert.buffer(data, 'data');
	assert.string(format, 'format');
	assert.string(type, 'type');

	var opts = {};
	opts.type = type.toLowerCase();
	opts.parts = [];

	try {
		assert.ok(data.length > 0, 'signature must not be empty');
		switch (opts.type) {
		case 'rsa':
			return (parseOneNum(data, type, format, opts));
		case 'ed25519':
			return (parseOneNum(data, type, format, opts));

		case 'dsa':
		case 'ecdsa':
			if (format === 'asn1')
				return (parseDSAasn1(data, type, format, opts));
			else if (opts.type === 'dsa')
				return (parseDSA(data, type, format, opts));
			else
				return (parseECDSA(data, type, format, opts));

		default:
			throw (new InvalidAlgorithmError(type));
		}

	} catch (e) {
		if (e instanceof InvalidAlgorithmError)
			throw (e);
		throw (new SignatureParseError(type, format, e));
	}
};

function parseOneNum(data, type, format, opts) {
	if (format === 'ssh') {
		try {
			var buf = new SSHBuffer({buffer: data});
			var head = buf.readString();
		} catch (e) {
			/* fall through */
		}
		if (buf !== undefined) {
			var msg = 'SSH signature does not match expected ' +
			    'type (expected ' + type + ', got ' + head + ')';
			switch (head) {
			case 'ssh-rsa':
				assert.strictEqual(type, 'rsa', msg);
				opts.hashAlgo = 'sha1';
				break;
			case 'rsa-sha2-256':
				assert.strictEqual(type, 'rsa', msg);
				opts.hashAlgo = 'sha256';
				break;
			case 'rsa-sha2-512':
				assert.strictEqual(type, 'rsa', msg);
				opts.hashAlgo = 'sha512';
				break;
			case 'ssh-ed25519':
				assert.strictEqual(type, 'ed25519', msg);
				opts.hashAlgo = 'sha512';
				break;
			default:
				throw (new Error('Unknown SSH signature ' +
				    'type: ' + head));
			}
			var sig = buf.readPart();
			assert.ok(buf.atEnd(), 'extra trailing bytes');
			sig.name = 'sig';
			opts.parts.push(sig);
			return (new Signature(opts));
		}
	}
	opts.parts.push({name: 'sig', data: data});
	return (new Signature(opts));
}

function parseDSAasn1(data, type, format, opts) {
	var der = new asn1.BerReader(data);
	der.readSequence();
	var r = der.readString(asn1.Ber.Integer, true);
	var s = der.readString(asn1.Ber.Integer, true);

	opts.parts.push({name: 'r', data: utils.mpNormalize(r)});
	opts.parts.push({name: 's', data: utils.mpNormalize(s)});

	return (new Signature(opts));
}

function parseDSA(data, type, format, opts) {
	if (data.length != 40) {
		var buf = new SSHBuffer({buffer: data});
		var d = buf.readBuffer();
		if (d.toString('ascii') === 'ssh-dss')
			d = buf.readBuffer();
		assert.ok(buf.atEnd(), 'extra trailing bytes');
		assert.strictEqual(d.length, 40, 'invalid inner length');
		data = d;
	}
	opts.parts.push({name: 'r', data: data.slice(0, 20)});
	opts.parts.push({name: 's', data: data.slice(20, 40)});
	return (new Signature(opts));
}

function parseECDSA(data, type, format, opts) {
	var buf = new SSHBuffer({buffer: data});

	var r, s;
	var inner = buf.readBuffer();
	var stype = inner.toString('ascii');
	if (stype.slice(0, 6) === 'ecdsa-') {
		var parts = stype.split('-');
		assert.strictEqual(parts[0], 'ecdsa');
		assert.strictEqual(parts[1], 'sha2');
		opts.curve = parts[2];
		switch (opts.curve) {
		case 'nistp256':
			opts.hashAlgo = 'sha256';
			break;
		case 'nistp384':
			opts.hashAlgo = 'sha384';
			break;
		case 'nistp521':
			opts.hashAlgo = 'sha512';
			break;
		default:
			throw (new Error('Unsupported ECDSA curve: ' +
			    opts.curve));
		}
		inner = buf.readBuffer();
		assert.ok(buf.atEnd(), 'extra trailing bytes on outer');
		buf = new SSHBuffer({buffer: inner});
		r = buf.readPart();
	} else {
		r = {data: inner};
	}

	s = buf.readPart();
	assert.ok(buf.atEnd(), 'extra trailing bytes');

	r.name = 'r';
	s.name = 's';

	opts.parts.push(r);
	opts.parts.push(s);
	return (new Signature(opts));
}

Signature.isSignature = function (obj, ver) {
	return (utils.isCompatible(obj, Signature, ver));
};

/*
 * API versions for Signature:
 * [1,0] -- initial ver
 * [2,0] -- support for rsa in full ssh format, compat with sshpk-agent
 *          hashAlgorithm property
 * [2,1] -- first tagged version
 */
Signature.prototype._sshpkApiVersion = [2, 1];

Signature._oldVersionDetect = function (obj) {
	assert.func(obj.toBuffer);
	if (obj.hasOwnProperty('hashAlgorithm'))
		return ([2, 0]);
	return ([1, 0]);
};


/***/ }),

/***/ "c2cS":
/*!*************************************************!*\
  !*** ./node_modules/sshpk/lib/formats/putty.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// Copyright 2018 Joyent, Inc.

module.exports = {
	read: read,
	write: write
};

var assert = __webpack_require__(/*! assert-plus */ "60GX");
var Buffer = __webpack_require__(/*! safer-buffer */ "xZGU").Buffer;
var rfc4253 = __webpack_require__(/*! ./rfc4253 */ "hSbD");
var Key = __webpack_require__(/*! ../key */ "qfPv");

var errors = __webpack_require__(/*! ../errors */ "HvMK");

function read(buf, options) {
	var lines = buf.toString('ascii').split(/[\r\n]+/);
	var found = false;
	var parts;
	var si = 0;
	while (si < lines.length) {
		parts = splitHeader(lines[si++]);
		if (parts &&
		    parts[0].toLowerCase() === 'putty-user-key-file-2') {
			found = true;
			break;
		}
	}
	if (!found) {
		throw (new Error('No PuTTY format first line found'));
	}
	var alg = parts[1];

	parts = splitHeader(lines[si++]);
	assert.equal(parts[0].toLowerCase(), 'encryption');

	parts = splitHeader(lines[si++]);
	assert.equal(parts[0].toLowerCase(), 'comment');
	var comment = parts[1];

	parts = splitHeader(lines[si++]);
	assert.equal(parts[0].toLowerCase(), 'public-lines');
	var publicLines = parseInt(parts[1], 10);
	if (!isFinite(publicLines) || publicLines < 0 ||
	    publicLines > lines.length) {
		throw (new Error('Invalid public-lines count'));
	}

	var publicBuf = Buffer.from(
	    lines.slice(si, si + publicLines).join(''), 'base64');
	var keyType = rfc4253.algToKeyType(alg);
	var key = rfc4253.read(publicBuf);
	if (key.type !== keyType) {
		throw (new Error('Outer key algorithm mismatch'));
	}
	key.comment = comment;
	return (key);
}

function splitHeader(line) {
	var idx = line.indexOf(':');
	if (idx === -1)
		return (null);
	var header = line.slice(0, idx);
	++idx;
	while (line[idx] === ' ')
		++idx;
	var rest = line.slice(idx);
	return ([header, rest]);
}

function write(key, options) {
	assert.object(key);
	if (!Key.isKey(key))
		throw (new Error('Must be a public key'));

	var alg = rfc4253.keyTypeToAlg(key);
	var buf = rfc4253.write(key);
	var comment = key.comment || '';

	var b64 = buf.toString('base64');
	var lines = wrap(b64, 64);

	lines.unshift('Public-Lines: ' + lines.length);
	lines.unshift('Comment: ' + comment);
	lines.unshift('Encryption: none');
	lines.unshift('PuTTY-User-Key-File-2: ' + alg);

	return (Buffer.from(lines.join('\n') + '\n'));
}

function wrap(txt, len) {
	var lines = [];
	var pos = 0;
	while (pos < txt.length) {
		lines.push(txt.slice(pos, pos + 64));
		pos += 64;
	}
	return (lines);
}


/***/ }),

/***/ "cPuN":
/*!**********************************************!*\
  !*** ./node_modules/sshpk/lib/ssh-buffer.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// Copyright 2015 Joyent, Inc.

module.exports = SSHBuffer;

var assert = __webpack_require__(/*! assert-plus */ "60GX");
var Buffer = __webpack_require__(/*! safer-buffer */ "xZGU").Buffer;

function SSHBuffer(opts) {
	assert.object(opts, 'options');
	if (opts.buffer !== undefined)
		assert.buffer(opts.buffer, 'options.buffer');

	this._size = opts.buffer ? opts.buffer.length : 1024;
	this._buffer = opts.buffer || Buffer.alloc(this._size);
	this._offset = 0;
}

SSHBuffer.prototype.toBuffer = function () {
	return (this._buffer.slice(0, this._offset));
};

SSHBuffer.prototype.atEnd = function () {
	return (this._offset >= this._buffer.length);
};

SSHBuffer.prototype.remainder = function () {
	return (this._buffer.slice(this._offset));
};

SSHBuffer.prototype.skip = function (n) {
	this._offset += n;
};

SSHBuffer.prototype.expand = function () {
	this._size *= 2;
	var buf = Buffer.alloc(this._size);
	this._buffer.copy(buf, 0);
	this._buffer = buf;
};

SSHBuffer.prototype.readPart = function () {
	return ({data: this.readBuffer()});
};

SSHBuffer.prototype.readBuffer = function () {
	var len = this._buffer.readUInt32BE(this._offset);
	this._offset += 4;
	assert.ok(this._offset + len <= this._buffer.length,
	    'length out of bounds at +0x' + this._offset.toString(16) +
	    ' (data truncated?)');
	var buf = this._buffer.slice(this._offset, this._offset + len);
	this._offset += len;
	return (buf);
};

SSHBuffer.prototype.readString = function () {
	return (this.readBuffer().toString());
};

SSHBuffer.prototype.readCString = function () {
	var offset = this._offset;
	while (offset < this._buffer.length &&
	    this._buffer[offset] !== 0x00)
		offset++;
	assert.ok(offset < this._buffer.length, 'c string does not terminate');
	var str = this._buffer.slice(this._offset, offset).toString();
	this._offset = offset + 1;
	return (str);
};

SSHBuffer.prototype.readInt = function () {
	var v = this._buffer.readUInt32BE(this._offset);
	this._offset += 4;
	return (v);
};

SSHBuffer.prototype.readInt64 = function () {
	assert.ok(this._offset + 8 < this._buffer.length,
	    'buffer not long enough to read Int64');
	var v = this._buffer.slice(this._offset, this._offset + 8);
	this._offset += 8;
	return (v);
};

SSHBuffer.prototype.readChar = function () {
	var v = this._buffer[this._offset++];
	return (v);
};

SSHBuffer.prototype.writeBuffer = function (buf) {
	while (this._offset + 4 + buf.length > this._size)
		this.expand();
	this._buffer.writeUInt32BE(buf.length, this._offset);
	this._offset += 4;
	buf.copy(this._buffer, this._offset);
	this._offset += buf.length;
};

SSHBuffer.prototype.writeString = function (str) {
	this.writeBuffer(Buffer.from(str, 'utf8'));
};

SSHBuffer.prototype.writeCString = function (str) {
	while (this._offset + 1 + str.length > this._size)
		this.expand();
	this._buffer.write(str, this._offset);
	this._offset += str.length;
	this._buffer[this._offset++] = 0;
};

SSHBuffer.prototype.writeInt = function (v) {
	while (this._offset + 4 > this._size)
		this.expand();
	this._buffer.writeUInt32BE(v, this._offset);
	this._offset += 4;
};

SSHBuffer.prototype.writeInt64 = function (v) {
	assert.buffer(v, 'value');
	if (v.length > 8) {
		var lead = v.slice(0, v.length - 8);
		for (var i = 0; i < lead.length; ++i) {
			assert.strictEqual(lead[i], 0,
			    'must fit in 64 bits of precision');
		}
		v = v.slice(v.length - 8, v.length);
	}
	while (this._offset + 8 > this._size)
		this.expand();
	v.copy(this._buffer, this._offset);
	this._offset += 8;
};

SSHBuffer.prototype.writeChar = function (v) {
	while (this._offset + 1 > this._size)
		this.expand();
	this._buffer[this._offset++] = v;
};

SSHBuffer.prototype.writePart = function (p) {
	this.writeBuffer(p.data);
};

SSHBuffer.prototype.write = function (buf) {
	while (this._offset + buf.length > this._size)
		this.expand();
	buf.copy(this._buffer, this._offset);
	this._offset += buf.length;
};


/***/ }),

/***/ "gEnT":
/*!***********************************************!*\
  !*** ./node_modules/sshpk/lib/formats/ssh.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// Copyright 2015 Joyent, Inc.

module.exports = {
	read: read,
	write: write
};

var assert = __webpack_require__(/*! assert-plus */ "60GX");
var Buffer = __webpack_require__(/*! safer-buffer */ "xZGU").Buffer;
var rfc4253 = __webpack_require__(/*! ./rfc4253 */ "hSbD");
var utils = __webpack_require__(/*! ../utils */ "43+q");
var Key = __webpack_require__(/*! ../key */ "qfPv");
var PrivateKey = __webpack_require__(/*! ../private-key */ "UtVk");

var sshpriv = __webpack_require__(/*! ./ssh-private */ "2LYn");

/*JSSTYLED*/
var SSHKEY_RE = /^([a-z0-9-]+)[ \t]+([a-zA-Z0-9+\/]+[=]*)([ \t]+([^ \t][^\n]*[\n]*)?)?$/;
/*JSSTYLED*/
var SSHKEY_RE2 = /^([a-z0-9-]+)[ \t\n]+([a-zA-Z0-9+\/][a-zA-Z0-9+\/ \t\n=]*)([^a-zA-Z0-9+\/ \t\n=].*)?$/;

function read(buf, options) {
	if (typeof (buf) !== 'string') {
		assert.buffer(buf, 'buf');
		buf = buf.toString('ascii');
	}

	var trimmed = buf.trim().replace(/[\\\r]/g, '');
	var m = trimmed.match(SSHKEY_RE);
	if (!m)
		m = trimmed.match(SSHKEY_RE2);
	assert.ok(m, 'key must match regex');

	var type = rfc4253.algToKeyType(m[1]);
	var kbuf = Buffer.from(m[2], 'base64');

	/*
	 * This is a bit tricky. If we managed to parse the key and locate the
	 * key comment with the regex, then do a non-partial read and assert
	 * that we have consumed all bytes. If we couldn't locate the key
	 * comment, though, there may be whitespace shenanigans going on that
	 * have conjoined the comment to the rest of the key. We do a partial
	 * read in this case to try to make the best out of a sorry situation.
	 */
	var key;
	var ret = {};
	if (m[4]) {
		try {
			key = rfc4253.read(kbuf);

		} catch (e) {
			m = trimmed.match(SSHKEY_RE2);
			assert.ok(m, 'key must match regex');
			kbuf = Buffer.from(m[2], 'base64');
			key = rfc4253.readInternal(ret, 'public', kbuf);
		}
	} else {
		key = rfc4253.readInternal(ret, 'public', kbuf);
	}

	assert.strictEqual(type, key.type);

	if (m[4] && m[4].length > 0) {
		key.comment = m[4];

	} else if (ret.consumed) {
		/*
		 * Now the magic: trying to recover the key comment when it's
		 * gotten conjoined to the key or otherwise shenanigan'd.
		 *
		 * Work out how much base64 we used, then drop all non-base64
		 * chars from the beginning up to this point in the the string.
		 * Then offset in this and try to make up for missing = chars.
		 */
		var data = m[2] + (m[3] ? m[3] : '');
		var realOffset = Math.ceil(ret.consumed / 3) * 4;
		data = data.slice(0, realOffset - 2). /*JSSTYLED*/
		    replace(/[^a-zA-Z0-9+\/=]/g, '') +
		    data.slice(realOffset - 2);

		var padding = ret.consumed % 3;
		if (padding > 0 &&
		    data.slice(realOffset - 1, realOffset) !== '=')
			realOffset--;
		while (data.slice(realOffset, realOffset + 1) === '=')
			realOffset++;

		/* Finally, grab what we think is the comment & clean it up. */
		var trailer = data.slice(realOffset);
		trailer = trailer.replace(/[\r\n]/g, ' ').
		    replace(/^\s+/, '');
		if (trailer.match(/^[a-zA-Z0-9]/))
			key.comment = trailer;
	}

	return (key);
}

function write(key, options) {
	assert.object(key);
	if (!Key.isKey(key))
		throw (new Error('Must be a public key'));

	var parts = [];
	var alg = rfc4253.keyTypeToAlg(key);
	parts.push(alg);

	var buf = rfc4253.write(key);
	parts.push(buf.toString('base64'));

	if (key.comment)
		parts.push(key.comment);

	return (Buffer.from(parts.join(' ')));
}


/***/ }),

/***/ "hSbD":
/*!***************************************************!*\
  !*** ./node_modules/sshpk/lib/formats/rfc4253.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// Copyright 2015 Joyent, Inc.

module.exports = {
	read: read.bind(undefined, false, undefined),
	readType: read.bind(undefined, false),
	write: write,
	/* semi-private api, used by sshpk-agent */
	readPartial: read.bind(undefined, true),

	/* shared with ssh format */
	readInternal: read,
	keyTypeToAlg: keyTypeToAlg,
	algToKeyType: algToKeyType
};

var assert = __webpack_require__(/*! assert-plus */ "60GX");
var Buffer = __webpack_require__(/*! safer-buffer */ "xZGU").Buffer;
var algs = __webpack_require__(/*! ../algs */ "r++l");
var utils = __webpack_require__(/*! ../utils */ "43+q");
var Key = __webpack_require__(/*! ../key */ "qfPv");
var PrivateKey = __webpack_require__(/*! ../private-key */ "UtVk");
var SSHBuffer = __webpack_require__(/*! ../ssh-buffer */ "cPuN");

function algToKeyType(alg) {
	assert.string(alg);
	if (alg === 'ssh-dss')
		return ('dsa');
	else if (alg === 'ssh-rsa')
		return ('rsa');
	else if (alg === 'ssh-ed25519')
		return ('ed25519');
	else if (alg === 'ssh-curve25519')
		return ('curve25519');
	else if (alg.match(/^ecdsa-sha2-/))
		return ('ecdsa');
	else
		throw (new Error('Unknown algorithm ' + alg));
}

function keyTypeToAlg(key) {
	assert.object(key);
	if (key.type === 'dsa')
		return ('ssh-dss');
	else if (key.type === 'rsa')
		return ('ssh-rsa');
	else if (key.type === 'ed25519')
		return ('ssh-ed25519');
	else if (key.type === 'curve25519')
		return ('ssh-curve25519');
	else if (key.type === 'ecdsa')
		return ('ecdsa-sha2-' + key.part.curve.data.toString());
	else
		throw (new Error('Unknown key type ' + key.type));
}

function read(partial, type, buf, options) {
	if (typeof (buf) === 'string')
		buf = Buffer.from(buf);
	assert.buffer(buf, 'buf');

	var key = {};

	var parts = key.parts = [];
	var sshbuf = new SSHBuffer({buffer: buf});

	var alg = sshbuf.readString();
	assert.ok(!sshbuf.atEnd(), 'key must have at least one part');

	key.type = algToKeyType(alg);

	var partCount = algs.info[key.type].parts.length;
	if (type && type === 'private')
		partCount = algs.privInfo[key.type].parts.length;

	while (!sshbuf.atEnd() && parts.length < partCount)
		parts.push(sshbuf.readPart());
	while (!partial && !sshbuf.atEnd())
		parts.push(sshbuf.readPart());

	assert.ok(parts.length >= 1,
	    'key must have at least one part');
	assert.ok(partial || sshbuf.atEnd(),
	    'leftover bytes at end of key');

	var Constructor = Key;
	var algInfo = algs.info[key.type];
	if (type === 'private' || algInfo.parts.length !== parts.length) {
		algInfo = algs.privInfo[key.type];
		Constructor = PrivateKey;
	}
	assert.strictEqual(algInfo.parts.length, parts.length);

	if (key.type === 'ecdsa') {
		var res = /^ecdsa-sha2-(.+)$/.exec(alg);
		assert.ok(res !== null);
		assert.strictEqual(res[1], parts[0].data.toString());
	}

	var normalized = true;
	for (var i = 0; i < algInfo.parts.length; ++i) {
		var p = parts[i];
		p.name = algInfo.parts[i];
		/*
		 * OpenSSH stores ed25519 "private" keys as seed + public key
		 * concat'd together (k followed by A). We want to keep them
		 * separate for other formats that don't do this.
		 */
		if (key.type === 'ed25519' && p.name === 'k')
			p.data = p.data.slice(0, 32);

		if (p.name !== 'curve' && algInfo.normalize !== false) {
			var nd;
			if (key.type === 'ed25519') {
				nd = utils.zeroPadToLength(p.data, 32);
			} else {
				nd = utils.mpNormalize(p.data);
			}
			if (nd.toString('binary') !==
			    p.data.toString('binary')) {
				p.data = nd;
				normalized = false;
			}
		}
	}

	if (normalized)
		key._rfc4253Cache = sshbuf.toBuffer();

	if (partial && typeof (partial) === 'object') {
		partial.remainder = sshbuf.remainder();
		partial.consumed = sshbuf._offset;
	}

	return (new Constructor(key));
}

function write(key, options) {
	assert.object(key);

	var alg = keyTypeToAlg(key);
	var i;

	var algInfo = algs.info[key.type];
	if (PrivateKey.isPrivateKey(key))
		algInfo = algs.privInfo[key.type];
	var parts = algInfo.parts;

	var buf = new SSHBuffer({});

	buf.writeString(alg);

	for (i = 0; i < parts.length; ++i) {
		var data = key.part[parts[i]].data;
		if (algInfo.normalize !== false) {
			if (key.type === 'ed25519')
				data = utils.zeroPadToLength(data, 32);
			else
				data = utils.mpNormalize(data);
		}
		if (key.type === 'ed25519' && parts[i] === 'k')
			data = Buffer.concat([data, key.part.A.data]);
		buf.writeBuffer(data);
	}

	return (buf.toBuffer());
}


/***/ }),

/***/ "m1HP":
/*!***********************************************!*\
  !*** ./node_modules/sshpk/lib/certificate.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// Copyright 2016 Joyent, Inc.

module.exports = Certificate;

var assert = __webpack_require__(/*! assert-plus */ "60GX");
var Buffer = __webpack_require__(/*! safer-buffer */ "xZGU").Buffer;
var algs = __webpack_require__(/*! ./algs */ "r++l");
var crypto = __webpack_require__(/*! crypto */ "HEbw");
var Fingerprint = __webpack_require__(/*! ./fingerprint */ "s54N");
var Signature = __webpack_require__(/*! ./signature */ "ZVj6");
var errs = __webpack_require__(/*! ./errors */ "HvMK");
var util = __webpack_require__(/*! util */ "7tlc");
var utils = __webpack_require__(/*! ./utils */ "43+q");
var Key = __webpack_require__(/*! ./key */ "qfPv");
var PrivateKey = __webpack_require__(/*! ./private-key */ "UtVk");
var Identity = __webpack_require__(/*! ./identity */ "vBLe");

var formats = {};
formats['openssh'] = __webpack_require__(/*! ./formats/openssh-cert */ "0YyV");
formats['x509'] = __webpack_require__(/*! ./formats/x509 */ "N1rP");
formats['pem'] = __webpack_require__(/*! ./formats/x509-pem */ "CA38");

var CertificateParseError = errs.CertificateParseError;
var InvalidAlgorithmError = errs.InvalidAlgorithmError;

function Certificate(opts) {
	assert.object(opts, 'options');
	assert.arrayOfObject(opts.subjects, 'options.subjects');
	utils.assertCompatible(opts.subjects[0], Identity, [1, 0],
	    'options.subjects');
	utils.assertCompatible(opts.subjectKey, Key, [1, 0],
	    'options.subjectKey');
	utils.assertCompatible(opts.issuer, Identity, [1, 0], 'options.issuer');
	if (opts.issuerKey !== undefined) {
		utils.assertCompatible(opts.issuerKey, Key, [1, 0],
		    'options.issuerKey');
	}
	assert.object(opts.signatures, 'options.signatures');
	assert.buffer(opts.serial, 'options.serial');
	assert.date(opts.validFrom, 'options.validFrom');
	assert.date(opts.validUntil, 'optons.validUntil');

	assert.optionalArrayOfString(opts.purposes, 'options.purposes');

	this._hashCache = {};

	this.subjects = opts.subjects;
	this.issuer = opts.issuer;
	this.subjectKey = opts.subjectKey;
	this.issuerKey = opts.issuerKey;
	this.signatures = opts.signatures;
	this.serial = opts.serial;
	this.validFrom = opts.validFrom;
	this.validUntil = opts.validUntil;
	this.purposes = opts.purposes;
}

Certificate.formats = formats;

Certificate.prototype.toBuffer = function (format, options) {
	if (format === undefined)
		format = 'x509';
	assert.string(format, 'format');
	assert.object(formats[format], 'formats[format]');
	assert.optionalObject(options, 'options');

	return (formats[format].write(this, options));
};

Certificate.prototype.toString = function (format, options) {
	if (format === undefined)
		format = 'pem';
	return (this.toBuffer(format, options).toString());
};

Certificate.prototype.fingerprint = function (algo) {
	if (algo === undefined)
		algo = 'sha256';
	assert.string(algo, 'algorithm');
	var opts = {
		type: 'certificate',
		hash: this.hash(algo),
		algorithm: algo
	};
	return (new Fingerprint(opts));
};

Certificate.prototype.hash = function (algo) {
	assert.string(algo, 'algorithm');
	algo = algo.toLowerCase();
	if (algs.hashAlgs[algo] === undefined)
		throw (new InvalidAlgorithmError(algo));

	if (this._hashCache[algo])
		return (this._hashCache[algo]);

	var hash = crypto.createHash(algo).
	    update(this.toBuffer('x509')).digest();
	this._hashCache[algo] = hash;
	return (hash);
};

Certificate.prototype.isExpired = function (when) {
	if (when === undefined)
		when = new Date();
	return (!((when.getTime() >= this.validFrom.getTime()) &&
		(when.getTime() < this.validUntil.getTime())));
};

Certificate.prototype.isSignedBy = function (issuerCert) {
	utils.assertCompatible(issuerCert, Certificate, [1, 0], 'issuer');

	if (!this.issuer.equals(issuerCert.subjects[0]))
		return (false);
	if (this.issuer.purposes && this.issuer.purposes.length > 0 &&
	    this.issuer.purposes.indexOf('ca') === -1) {
		return (false);
	}

	return (this.isSignedByKey(issuerCert.subjectKey));
};

Certificate.prototype.getExtension = function (keyOrOid) {
	assert.string(keyOrOid, 'keyOrOid');
	var ext = this.getExtensions().filter(function (maybeExt) {
		if (maybeExt.format === 'x509')
			return (maybeExt.oid === keyOrOid);
		if (maybeExt.format === 'openssh')
			return (maybeExt.name === keyOrOid);
		return (false);
	})[0];
	return (ext);
};

Certificate.prototype.getExtensions = function () {
	var exts = [];
	var x509 = this.signatures.x509;
	if (x509 && x509.extras && x509.extras.exts) {
		x509.extras.exts.forEach(function (ext) {
			ext.format = 'x509';
			exts.push(ext);
		});
	}
	var openssh = this.signatures.openssh;
	if (openssh && openssh.exts) {
		openssh.exts.forEach(function (ext) {
			ext.format = 'openssh';
			exts.push(ext);
		});
	}
	return (exts);
};

Certificate.prototype.isSignedByKey = function (issuerKey) {
	utils.assertCompatible(issuerKey, Key, [1, 2], 'issuerKey');

	if (this.issuerKey !== undefined) {
		return (this.issuerKey.
		    fingerprint('sha512').matches(issuerKey));
	}

	var fmt = Object.keys(this.signatures)[0];
	var valid = formats[fmt].verify(this, issuerKey);
	if (valid)
		this.issuerKey = issuerKey;
	return (valid);
};

Certificate.prototype.signWith = function (key) {
	utils.assertCompatible(key, PrivateKey, [1, 2], 'key');
	var fmts = Object.keys(formats);
	var didOne = false;
	for (var i = 0; i < fmts.length; ++i) {
		if (fmts[i] !== 'pem') {
			var ret = formats[fmts[i]].sign(this, key);
			if (ret === true)
				didOne = true;
		}
	}
	if (!didOne) {
		throw (new Error('Failed to sign the certificate for any ' +
		    'available certificate formats'));
	}
};

Certificate.createSelfSigned = function (subjectOrSubjects, key, options) {
	var subjects;
	if (Array.isArray(subjectOrSubjects))
		subjects = subjectOrSubjects;
	else
		subjects = [subjectOrSubjects];

	assert.arrayOfObject(subjects);
	subjects.forEach(function (subject) {
		utils.assertCompatible(subject, Identity, [1, 0], 'subject');
	});

	utils.assertCompatible(key, PrivateKey, [1, 2], 'private key');

	assert.optionalObject(options, 'options');
	if (options === undefined)
		options = {};
	assert.optionalObject(options.validFrom, 'options.validFrom');
	assert.optionalObject(options.validUntil, 'options.validUntil');
	var validFrom = options.validFrom;
	var validUntil = options.validUntil;
	if (validFrom === undefined)
		validFrom = new Date();
	if (validUntil === undefined) {
		assert.optionalNumber(options.lifetime, 'options.lifetime');
		var lifetime = options.lifetime;
		if (lifetime === undefined)
			lifetime = 10*365*24*3600;
		validUntil = new Date();
		validUntil.setTime(validUntil.getTime() + lifetime*1000);
	}
	assert.optionalBuffer(options.serial, 'options.serial');
	var serial = options.serial;
	if (serial === undefined)
		serial = Buffer.from('0000000000000001', 'hex');

	var purposes = options.purposes;
	if (purposes === undefined)
		purposes = [];

	if (purposes.indexOf('signature') === -1)
		purposes.push('signature');

	/* Self-signed certs are always CAs. */
	if (purposes.indexOf('ca') === -1)
		purposes.push('ca');
	if (purposes.indexOf('crl') === -1)
		purposes.push('crl');

	/*
	 * If we weren't explicitly given any other purposes, do the sensible
	 * thing and add some basic ones depending on the subject type.
	 */
	if (purposes.length <= 3) {
		var hostSubjects = subjects.filter(function (subject) {
			return (subject.type === 'host');
		});
		var userSubjects = subjects.filter(function (subject) {
			return (subject.type === 'user');
		});
		if (hostSubjects.length > 0) {
			if (purposes.indexOf('serverAuth') === -1)
				purposes.push('serverAuth');
		}
		if (userSubjects.length > 0) {
			if (purposes.indexOf('clientAuth') === -1)
				purposes.push('clientAuth');
		}
		if (userSubjects.length > 0 || hostSubjects.length > 0) {
			if (purposes.indexOf('keyAgreement') === -1)
				purposes.push('keyAgreement');
			if (key.type === 'rsa' &&
			    purposes.indexOf('encryption') === -1)
				purposes.push('encryption');
		}
	}

	var cert = new Certificate({
		subjects: subjects,
		issuer: subjects[0],
		subjectKey: key.toPublic(),
		issuerKey: key.toPublic(),
		signatures: {},
		serial: serial,
		validFrom: validFrom,
		validUntil: validUntil,
		purposes: purposes
	});
	cert.signWith(key);

	return (cert);
};

Certificate.create =
    function (subjectOrSubjects, key, issuer, issuerKey, options) {
	var subjects;
	if (Array.isArray(subjectOrSubjects))
		subjects = subjectOrSubjects;
	else
		subjects = [subjectOrSubjects];

	assert.arrayOfObject(subjects);
	subjects.forEach(function (subject) {
		utils.assertCompatible(subject, Identity, [1, 0], 'subject');
	});

	utils.assertCompatible(key, Key, [1, 0], 'key');
	if (PrivateKey.isPrivateKey(key))
		key = key.toPublic();
	utils.assertCompatible(issuer, Identity, [1, 0], 'issuer');
	utils.assertCompatible(issuerKey, PrivateKey, [1, 2], 'issuer key');

	assert.optionalObject(options, 'options');
	if (options === undefined)
		options = {};
	assert.optionalObject(options.validFrom, 'options.validFrom');
	assert.optionalObject(options.validUntil, 'options.validUntil');
	var validFrom = options.validFrom;
	var validUntil = options.validUntil;
	if (validFrom === undefined)
		validFrom = new Date();
	if (validUntil === undefined) {
		assert.optionalNumber(options.lifetime, 'options.lifetime');
		var lifetime = options.lifetime;
		if (lifetime === undefined)
			lifetime = 10*365*24*3600;
		validUntil = new Date();
		validUntil.setTime(validUntil.getTime() + lifetime*1000);
	}
	assert.optionalBuffer(options.serial, 'options.serial');
	var serial = options.serial;
	if (serial === undefined)
		serial = Buffer.from('0000000000000001', 'hex');

	var purposes = options.purposes;
	if (purposes === undefined)
		purposes = [];

	if (purposes.indexOf('signature') === -1)
		purposes.push('signature');

	if (options.ca === true) {
		if (purposes.indexOf('ca') === -1)
			purposes.push('ca');
		if (purposes.indexOf('crl') === -1)
			purposes.push('crl');
	}

	var hostSubjects = subjects.filter(function (subject) {
		return (subject.type === 'host');
	});
	var userSubjects = subjects.filter(function (subject) {
		return (subject.type === 'user');
	});
	if (hostSubjects.length > 0) {
		if (purposes.indexOf('serverAuth') === -1)
			purposes.push('serverAuth');
	}
	if (userSubjects.length > 0) {
		if (purposes.indexOf('clientAuth') === -1)
			purposes.push('clientAuth');
	}
	if (userSubjects.length > 0 || hostSubjects.length > 0) {
		if (purposes.indexOf('keyAgreement') === -1)
			purposes.push('keyAgreement');
		if (key.type === 'rsa' &&
		    purposes.indexOf('encryption') === -1)
			purposes.push('encryption');
	}

	var cert = new Certificate({
		subjects: subjects,
		issuer: issuer,
		subjectKey: key,
		issuerKey: issuerKey.toPublic(),
		signatures: {},
		serial: serial,
		validFrom: validFrom,
		validUntil: validUntil,
		purposes: purposes
	});
	cert.signWith(issuerKey);

	return (cert);
};

Certificate.parse = function (data, format, options) {
	if (typeof (data) !== 'string')
		assert.buffer(data, 'data');
	if (format === undefined)
		format = 'auto';
	assert.string(format, 'format');
	if (typeof (options) === 'string')
		options = { filename: options };
	assert.optionalObject(options, 'options');
	if (options === undefined)
		options = {};
	assert.optionalString(options.filename, 'options.filename');
	if (options.filename === undefined)
		options.filename = '(unnamed)';

	assert.object(formats[format], 'formats[format]');

	try {
		var k = formats[format].read(data, options);
		return (k);
	} catch (e) {
		throw (new CertificateParseError(options.filename, format, e));
	}
};

Certificate.isCertificate = function (obj, ver) {
	return (utils.isCompatible(obj, Certificate, ver));
};

/*
 * API versions for Certificate:
 * [1,0] -- initial ver
 * [1,1] -- openssh format now unpacks extensions
 */
Certificate.prototype._sshpkApiVersion = [1, 1];

Certificate._oldVersionDetect = function (obj) {
	return ([1, 0]);
};


/***/ }),

/***/ "qfPv":
/*!***************************************!*\
  !*** ./node_modules/sshpk/lib/key.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer) {// Copyright 2018 Joyent, Inc.

module.exports = Key;

var assert = __webpack_require__(/*! assert-plus */ "60GX");
var algs = __webpack_require__(/*! ./algs */ "r++l");
var crypto = __webpack_require__(/*! crypto */ "HEbw");
var Fingerprint = __webpack_require__(/*! ./fingerprint */ "s54N");
var Signature = __webpack_require__(/*! ./signature */ "ZVj6");
var DiffieHellman = __webpack_require__(/*! ./dhe */ "tfmF").DiffieHellman;
var errs = __webpack_require__(/*! ./errors */ "HvMK");
var utils = __webpack_require__(/*! ./utils */ "43+q");
var PrivateKey = __webpack_require__(/*! ./private-key */ "UtVk");
var edCompat;

try {
	edCompat = __webpack_require__(/*! ./ed-compat */ "WKVI");
} catch (e) {
	/* Just continue through, and bail out if we try to use it. */
}

var InvalidAlgorithmError = errs.InvalidAlgorithmError;
var KeyParseError = errs.KeyParseError;

var formats = {};
formats['auto'] = __webpack_require__(/*! ./formats/auto */ "30lM");
formats['pem'] = __webpack_require__(/*! ./formats/pem */ "ViER");
formats['pkcs1'] = __webpack_require__(/*! ./formats/pkcs1 */ "/e07");
formats['pkcs8'] = __webpack_require__(/*! ./formats/pkcs8 */ "ZLZ5");
formats['rfc4253'] = __webpack_require__(/*! ./formats/rfc4253 */ "hSbD");
formats['ssh'] = __webpack_require__(/*! ./formats/ssh */ "gEnT");
formats['ssh-private'] = __webpack_require__(/*! ./formats/ssh-private */ "2LYn");
formats['openssh'] = formats['ssh-private'];
formats['dnssec'] = __webpack_require__(/*! ./formats/dnssec */ "YiDp");
formats['putty'] = __webpack_require__(/*! ./formats/putty */ "c2cS");
formats['ppk'] = formats['putty'];

function Key(opts) {
	assert.object(opts, 'options');
	assert.arrayOfObject(opts.parts, 'options.parts');
	assert.string(opts.type, 'options.type');
	assert.optionalString(opts.comment, 'options.comment');

	var algInfo = algs.info[opts.type];
	if (typeof (algInfo) !== 'object')
		throw (new InvalidAlgorithmError(opts.type));

	var partLookup = {};
	for (var i = 0; i < opts.parts.length; ++i) {
		var part = opts.parts[i];
		partLookup[part.name] = part;
	}

	this.type = opts.type;
	this.parts = opts.parts;
	this.part = partLookup;
	this.comment = undefined;
	this.source = opts.source;

	/* for speeding up hashing/fingerprint operations */
	this._rfc4253Cache = opts._rfc4253Cache;
	this._hashCache = {};

	var sz;
	this.curve = undefined;
	if (this.type === 'ecdsa') {
		var curve = this.part.curve.data.toString();
		this.curve = curve;
		sz = algs.curves[curve].size;
	} else if (this.type === 'ed25519' || this.type === 'curve25519') {
		sz = 256;
		this.curve = 'curve25519';
	} else {
		var szPart = this.part[algInfo.sizePart];
		sz = szPart.data.length;
		sz = sz * 8 - utils.countZeros(szPart.data);
	}
	this.size = sz;
}

Key.formats = formats;

Key.prototype.toBuffer = function (format, options) {
	if (format === undefined)
		format = 'ssh';
	assert.string(format, 'format');
	assert.object(formats[format], 'formats[format]');
	assert.optionalObject(options, 'options');

	if (format === 'rfc4253') {
		if (this._rfc4253Cache === undefined)
			this._rfc4253Cache = formats['rfc4253'].write(this);
		return (this._rfc4253Cache);
	}

	return (formats[format].write(this, options));
};

Key.prototype.toString = function (format, options) {
	return (this.toBuffer(format, options).toString());
};

Key.prototype.hash = function (algo, type) {
	assert.string(algo, 'algorithm');
	assert.optionalString(type, 'type');
	if (type === undefined)
		type = 'ssh';
	algo = algo.toLowerCase();
	if (algs.hashAlgs[algo] === undefined)
		throw (new InvalidAlgorithmError(algo));

	var cacheKey = algo + '||' + type;
	if (this._hashCache[cacheKey])
		return (this._hashCache[cacheKey]);

	var buf;
	if (type === 'ssh') {
		buf = this.toBuffer('rfc4253');
	} else if (type === 'spki') {
		buf = formats.pkcs8.pkcs8ToBuffer(this);
	} else {
		throw (new Error('Hash type ' + type + ' not supported'));
	}
	var hash = crypto.createHash(algo).update(buf).digest();
	this._hashCache[cacheKey] = hash;
	return (hash);
};

Key.prototype.fingerprint = function (algo, type) {
	if (algo === undefined)
		algo = 'sha256';
	if (type === undefined)
		type = 'ssh';
	assert.string(algo, 'algorithm');
	assert.string(type, 'type');
	var opts = {
		type: 'key',
		hash: this.hash(algo, type),
		algorithm: algo,
		hashType: type
	};
	return (new Fingerprint(opts));
};

Key.prototype.defaultHashAlgorithm = function () {
	var hashAlgo = 'sha1';
	if (this.type === 'rsa')
		hashAlgo = 'sha256';
	if (this.type === 'dsa' && this.size > 1024)
		hashAlgo = 'sha256';
	if (this.type === 'ed25519')
		hashAlgo = 'sha512';
	if (this.type === 'ecdsa') {
		if (this.size <= 256)
			hashAlgo = 'sha256';
		else if (this.size <= 384)
			hashAlgo = 'sha384';
		else
			hashAlgo = 'sha512';
	}
	return (hashAlgo);
};

Key.prototype.createVerify = function (hashAlgo) {
	if (hashAlgo === undefined)
		hashAlgo = this.defaultHashAlgorithm();
	assert.string(hashAlgo, 'hash algorithm');

	/* ED25519 is not supported by OpenSSL, use a javascript impl. */
	if (this.type === 'ed25519' && edCompat !== undefined)
		return (new edCompat.Verifier(this, hashAlgo));
	if (this.type === 'curve25519')
		throw (new Error('Curve25519 keys are not suitable for ' +
		    'signing or verification'));

	var v, nm, err;
	try {
		nm = hashAlgo.toUpperCase();
		v = crypto.createVerify(nm);
	} catch (e) {
		err = e;
	}
	if (v === undefined || (err instanceof Error &&
	    err.message.match(/Unknown message digest/))) {
		nm = 'RSA-';
		nm += hashAlgo.toUpperCase();
		v = crypto.createVerify(nm);
	}
	assert.ok(v, 'failed to create verifier');
	var oldVerify = v.verify.bind(v);
	var key = this.toBuffer('pkcs8');
	var curve = this.curve;
	var self = this;
	v.verify = function (signature, fmt) {
		if (Signature.isSignature(signature, [2, 0])) {
			if (signature.type !== self.type)
				return (false);
			if (signature.hashAlgorithm &&
			    signature.hashAlgorithm !== hashAlgo)
				return (false);
			if (signature.curve && self.type === 'ecdsa' &&
			    signature.curve !== curve)
				return (false);
			return (oldVerify(key, signature.toBuffer('asn1')));

		} else if (typeof (signature) === 'string' ||
		    Buffer.isBuffer(signature)) {
			return (oldVerify(key, signature, fmt));

		/*
		 * Avoid doing this on valid arguments, walking the prototype
		 * chain can be quite slow.
		 */
		} else if (Signature.isSignature(signature, [1, 0])) {
			throw (new Error('signature was created by too old ' +
			    'a version of sshpk and cannot be verified'));

		} else {
			throw (new TypeError('signature must be a string, ' +
			    'Buffer, or Signature object'));
		}
	};
	return (v);
};

Key.prototype.createDiffieHellman = function () {
	if (this.type === 'rsa')
		throw (new Error('RSA keys do not support Diffie-Hellman'));

	return (new DiffieHellman(this));
};
Key.prototype.createDH = Key.prototype.createDiffieHellman;

Key.parse = function (data, format, options) {
	if (typeof (data) !== 'string')
		assert.buffer(data, 'data');
	if (format === undefined)
		format = 'auto';
	assert.string(format, 'format');
	if (typeof (options) === 'string')
		options = { filename: options };
	assert.optionalObject(options, 'options');
	if (options === undefined)
		options = {};
	assert.optionalString(options.filename, 'options.filename');
	if (options.filename === undefined)
		options.filename = '(unnamed)';

	assert.object(formats[format], 'formats[format]');

	try {
		var k = formats[format].read(data, options);
		if (k instanceof PrivateKey)
			k = k.toPublic();
		if (!k.comment)
			k.comment = options.filename;
		return (k);
	} catch (e) {
		if (e.name === 'KeyEncryptedError')
			throw (e);
		throw (new KeyParseError(options.filename, format, e));
	}
};

Key.isKey = function (obj, ver) {
	return (utils.isCompatible(obj, Key, ver));
};

/*
 * API versions for Key:
 * [1,0] -- initial ver, may take Signature for createVerify or may not
 * [1,1] -- added pkcs1, pkcs8 formats
 * [1,2] -- added auto, ssh-private, openssh formats
 * [1,3] -- added defaultHashAlgorithm
 * [1,4] -- added ed support, createDH
 * [1,5] -- first explicitly tagged version
 * [1,6] -- changed ed25519 part names
 * [1,7] -- spki hash types
 */
Key.prototype._sshpkApiVersion = [1, 7];

Key._oldVersionDetect = function (obj) {
	assert.func(obj.toBuffer);
	assert.func(obj.fingerprint);
	if (obj.createDH)
		return ([1, 4]);
	if (obj.defaultHashAlgorithm)
		return ([1, 3]);
	if (obj.formats['auto'])
		return ([1, 2]);
	if (obj.formats['pkcs1'])
		return ([1, 1]);
	return ([1, 0]);
};

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../buffer/index.js */ "tjlA").Buffer))

/***/ }),

/***/ "r++l":
/*!****************************************!*\
  !*** ./node_modules/sshpk/lib/algs.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// Copyright 2015 Joyent, Inc.

var Buffer = __webpack_require__(/*! safer-buffer */ "xZGU").Buffer;

var algInfo = {
	'dsa': {
		parts: ['p', 'q', 'g', 'y'],
		sizePart: 'p'
	},
	'rsa': {
		parts: ['e', 'n'],
		sizePart: 'n'
	},
	'ecdsa': {
		parts: ['curve', 'Q'],
		sizePart: 'Q'
	},
	'ed25519': {
		parts: ['A'],
		sizePart: 'A'
	}
};
algInfo['curve25519'] = algInfo['ed25519'];

var algPrivInfo = {
	'dsa': {
		parts: ['p', 'q', 'g', 'y', 'x']
	},
	'rsa': {
		parts: ['n', 'e', 'd', 'iqmp', 'p', 'q']
	},
	'ecdsa': {
		parts: ['curve', 'Q', 'd']
	},
	'ed25519': {
		parts: ['A', 'k']
	}
};
algPrivInfo['curve25519'] = algPrivInfo['ed25519'];

var hashAlgs = {
	'md5': true,
	'sha1': true,
	'sha256': true,
	'sha384': true,
	'sha512': true
};

/*
 * Taken from
 * http://csrc.nist.gov/groups/ST/toolkit/documents/dss/NISTReCur.pdf
 */
var curves = {
	'nistp256': {
		size: 256,
		pkcs8oid: '1.2.840.10045.3.1.7',
		p: Buffer.from(('00' +
		    'ffffffff 00000001 00000000 00000000' +
		    '00000000 ffffffff ffffffff ffffffff').
		    replace(/ /g, ''), 'hex'),
		a: Buffer.from(('00' +
		    'FFFFFFFF 00000001 00000000 00000000' +
		    '00000000 FFFFFFFF FFFFFFFF FFFFFFFC').
		    replace(/ /g, ''), 'hex'),
		b: Buffer.from((
		    '5ac635d8 aa3a93e7 b3ebbd55 769886bc' +
		    '651d06b0 cc53b0f6 3bce3c3e 27d2604b').
		    replace(/ /g, ''), 'hex'),
		s: Buffer.from(('00' +
		    'c49d3608 86e70493 6a6678e1 139d26b7' +
		    '819f7e90').
		    replace(/ /g, ''), 'hex'),
		n: Buffer.from(('00' +
		    'ffffffff 00000000 ffffffff ffffffff' +
		    'bce6faad a7179e84 f3b9cac2 fc632551').
		    replace(/ /g, ''), 'hex'),
		G: Buffer.from(('04' +
		    '6b17d1f2 e12c4247 f8bce6e5 63a440f2' +
		    '77037d81 2deb33a0 f4a13945 d898c296' +
		    '4fe342e2 fe1a7f9b 8ee7eb4a 7c0f9e16' +
		    '2bce3357 6b315ece cbb64068 37bf51f5').
		    replace(/ /g, ''), 'hex')
	},
	'nistp384': {
		size: 384,
		pkcs8oid: '1.3.132.0.34',
		p: Buffer.from(('00' +
		    'ffffffff ffffffff ffffffff ffffffff' +
		    'ffffffff ffffffff ffffffff fffffffe' +
		    'ffffffff 00000000 00000000 ffffffff').
		    replace(/ /g, ''), 'hex'),
		a: Buffer.from(('00' +
		    'FFFFFFFF FFFFFFFF FFFFFFFF FFFFFFFF' +
		    'FFFFFFFF FFFFFFFF FFFFFFFF FFFFFFFE' +
		    'FFFFFFFF 00000000 00000000 FFFFFFFC').
		    replace(/ /g, ''), 'hex'),
		b: Buffer.from((
		    'b3312fa7 e23ee7e4 988e056b e3f82d19' +
		    '181d9c6e fe814112 0314088f 5013875a' +
		    'c656398d 8a2ed19d 2a85c8ed d3ec2aef').
		    replace(/ /g, ''), 'hex'),
		s: Buffer.from(('00' +
		    'a335926a a319a27a 1d00896a 6773a482' +
		    '7acdac73').
		    replace(/ /g, ''), 'hex'),
		n: Buffer.from(('00' +
		    'ffffffff ffffffff ffffffff ffffffff' +
		    'ffffffff ffffffff c7634d81 f4372ddf' +
		    '581a0db2 48b0a77a ecec196a ccc52973').
		    replace(/ /g, ''), 'hex'),
		G: Buffer.from(('04' +
		    'aa87ca22 be8b0537 8eb1c71e f320ad74' +
		    '6e1d3b62 8ba79b98 59f741e0 82542a38' +
		    '5502f25d bf55296c 3a545e38 72760ab7' +
		    '3617de4a 96262c6f 5d9e98bf 9292dc29' +
		    'f8f41dbd 289a147c e9da3113 b5f0b8c0' +
		    '0a60b1ce 1d7e819d 7a431d7c 90ea0e5f').
		    replace(/ /g, ''), 'hex')
	},
	'nistp521': {
		size: 521,
		pkcs8oid: '1.3.132.0.35',
		p: Buffer.from((
		    '01ffffff ffffffff ffffffff ffffffff' +
		    'ffffffff ffffffff ffffffff ffffffff' +
		    'ffffffff ffffffff ffffffff ffffffff' +
		    'ffffffff ffffffff ffffffff ffffffff' +
		    'ffff').replace(/ /g, ''), 'hex'),
		a: Buffer.from(('01FF' +
		    'FFFFFFFF FFFFFFFF FFFFFFFF FFFFFFFF' +
		    'FFFFFFFF FFFFFFFF FFFFFFFF FFFFFFFF' +
		    'FFFFFFFF FFFFFFFF FFFFFFFF FFFFFFFF' +
		    'FFFFFFFF FFFFFFFF FFFFFFFF FFFFFFFC').
		    replace(/ /g, ''), 'hex'),
		b: Buffer.from(('51' +
		    '953eb961 8e1c9a1f 929a21a0 b68540ee' +
		    'a2da725b 99b315f3 b8b48991 8ef109e1' +
		    '56193951 ec7e937b 1652c0bd 3bb1bf07' +
		    '3573df88 3d2c34f1 ef451fd4 6b503f00').
		    replace(/ /g, ''), 'hex'),
		s: Buffer.from(('00' +
		    'd09e8800 291cb853 96cc6717 393284aa' +
		    'a0da64ba').replace(/ /g, ''), 'hex'),
		n: Buffer.from(('01ff' +
		    'ffffffff ffffffff ffffffff ffffffff' +
		    'ffffffff ffffffff ffffffff fffffffa' +
		    '51868783 bf2f966b 7fcc0148 f709a5d0' +
		    '3bb5c9b8 899c47ae bb6fb71e 91386409').
		    replace(/ /g, ''), 'hex'),
		G: Buffer.from(('04' +
		    '00c6 858e06b7 0404e9cd 9e3ecb66 2395b442' +
		         '9c648139 053fb521 f828af60 6b4d3dba' +
		         'a14b5e77 efe75928 fe1dc127 a2ffa8de' +
		         '3348b3c1 856a429b f97e7e31 c2e5bd66' +
		    '0118 39296a78 9a3bc004 5c8a5fb4 2c7d1bd9' +
		         '98f54449 579b4468 17afbd17 273e662c' +
		         '97ee7299 5ef42640 c550b901 3fad0761' +
		         '353c7086 a272c240 88be9476 9fd16650').
		    replace(/ /g, ''), 'hex')
	}
};

module.exports = {
	info: algInfo,
	privInfo: algPrivInfo,
	hashAlgs: hashAlgs,
	curves: curves
};


/***/ }),

/***/ "s54N":
/*!***********************************************!*\
  !*** ./node_modules/sshpk/lib/fingerprint.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// Copyright 2018 Joyent, Inc.

module.exports = Fingerprint;

var assert = __webpack_require__(/*! assert-plus */ "60GX");
var Buffer = __webpack_require__(/*! safer-buffer */ "xZGU").Buffer;
var algs = __webpack_require__(/*! ./algs */ "r++l");
var crypto = __webpack_require__(/*! crypto */ "HEbw");
var errs = __webpack_require__(/*! ./errors */ "HvMK");
var Key = __webpack_require__(/*! ./key */ "qfPv");
var PrivateKey = __webpack_require__(/*! ./private-key */ "UtVk");
var Certificate = __webpack_require__(/*! ./certificate */ "m1HP");
var utils = __webpack_require__(/*! ./utils */ "43+q");

var FingerprintFormatError = errs.FingerprintFormatError;
var InvalidAlgorithmError = errs.InvalidAlgorithmError;

function Fingerprint(opts) {
	assert.object(opts, 'options');
	assert.string(opts.type, 'options.type');
	assert.buffer(opts.hash, 'options.hash');
	assert.string(opts.algorithm, 'options.algorithm');

	this.algorithm = opts.algorithm.toLowerCase();
	if (algs.hashAlgs[this.algorithm] !== true)
		throw (new InvalidAlgorithmError(this.algorithm));

	this.hash = opts.hash;
	this.type = opts.type;
	this.hashType = opts.hashType;
}

Fingerprint.prototype.toString = function (format) {
	if (format === undefined) {
		if (this.algorithm === 'md5' || this.hashType === 'spki')
			format = 'hex';
		else
			format = 'base64';
	}
	assert.string(format);

	switch (format) {
	case 'hex':
		if (this.hashType === 'spki')
			return (this.hash.toString('hex'));
		return (addColons(this.hash.toString('hex')));
	case 'base64':
		if (this.hashType === 'spki')
			return (this.hash.toString('base64'));
		return (sshBase64Format(this.algorithm,
		    this.hash.toString('base64')));
	default:
		throw (new FingerprintFormatError(undefined, format));
	}
};

Fingerprint.prototype.matches = function (other) {
	assert.object(other, 'key or certificate');
	if (this.type === 'key' && this.hashType !== 'ssh') {
		utils.assertCompatible(other, Key, [1, 7], 'key with spki');
		if (PrivateKey.isPrivateKey(other)) {
			utils.assertCompatible(other, PrivateKey, [1, 6],
			    'privatekey with spki support');
		}
	} else if (this.type === 'key') {
		utils.assertCompatible(other, Key, [1, 0], 'key');
	} else {
		utils.assertCompatible(other, Certificate, [1, 0],
		    'certificate');
	}

	var theirHash = other.hash(this.algorithm, this.hashType);
	var theirHash2 = crypto.createHash(this.algorithm).
	    update(theirHash).digest('base64');

	if (this.hash2 === undefined)
		this.hash2 = crypto.createHash(this.algorithm).
		    update(this.hash).digest('base64');

	return (this.hash2 === theirHash2);
};

/*JSSTYLED*/
var base64RE = /^[A-Za-z0-9+\/=]+$/;
/*JSSTYLED*/
var hexRE = /^[a-fA-F0-9]+$/;

Fingerprint.parse = function (fp, options) {
	assert.string(fp, 'fingerprint');

	var alg, hash, enAlgs;
	if (Array.isArray(options)) {
		enAlgs = options;
		options = {};
	}
	assert.optionalObject(options, 'options');
	if (options === undefined)
		options = {};
	if (options.enAlgs !== undefined)
		enAlgs = options.enAlgs;
	if (options.algorithms !== undefined)
		enAlgs = options.algorithms;
	assert.optionalArrayOfString(enAlgs, 'algorithms');

	var hashType = 'ssh';
	if (options.hashType !== undefined)
		hashType = options.hashType;
	assert.string(hashType, 'options.hashType');

	var parts = fp.split(':');
	if (parts.length == 2) {
		alg = parts[0].toLowerCase();
		if (!base64RE.test(parts[1]))
			throw (new FingerprintFormatError(fp));
		try {
			hash = Buffer.from(parts[1], 'base64');
		} catch (e) {
			throw (new FingerprintFormatError(fp));
		}
	} else if (parts.length > 2) {
		alg = 'md5';
		if (parts[0].toLowerCase() === 'md5')
			parts = parts.slice(1);
		parts = parts.map(function (p) {
			while (p.length < 2)
				p = '0' + p;
			if (p.length > 2)
				throw (new FingerprintFormatError(fp));
			return (p);
		});
		parts = parts.join('');
		if (!hexRE.test(parts) || parts.length % 2 !== 0)
			throw (new FingerprintFormatError(fp));
		try {
			hash = Buffer.from(parts, 'hex');
		} catch (e) {
			throw (new FingerprintFormatError(fp));
		}
	} else {
		if (hexRE.test(fp)) {
			hash = Buffer.from(fp, 'hex');
		} else if (base64RE.test(fp)) {
			hash = Buffer.from(fp, 'base64');
		} else {
			throw (new FingerprintFormatError(fp));
		}

		switch (hash.length) {
		case 32:
			alg = 'sha256';
			break;
		case 16:
			alg = 'md5';
			break;
		case 20:
			alg = 'sha1';
			break;
		case 64:
			alg = 'sha512';
			break;
		default:
			throw (new FingerprintFormatError(fp));
		}

		/* Plain hex/base64: guess it's probably SPKI unless told. */
		if (options.hashType === undefined)
			hashType = 'spki';
	}

	if (alg === undefined)
		throw (new FingerprintFormatError(fp));

	if (algs.hashAlgs[alg] === undefined)
		throw (new InvalidAlgorithmError(alg));

	if (enAlgs !== undefined) {
		enAlgs = enAlgs.map(function (a) { return a.toLowerCase(); });
		if (enAlgs.indexOf(alg) === -1)
			throw (new InvalidAlgorithmError(alg));
	}

	return (new Fingerprint({
		algorithm: alg,
		hash: hash,
		type: options.type || 'key',
		hashType: hashType
	}));
};

function addColons(s) {
	/*JSSTYLED*/
	return (s.replace(/(.{2})(?=.)/g, '$1:'));
}

function base64Strip(s) {
	/*JSSTYLED*/
	return (s.replace(/=*$/, ''));
}

function sshBase64Format(alg, h) {
	return (alg.toUpperCase() + ':' + base64Strip(h));
}

Fingerprint.isFingerprint = function (obj, ver) {
	return (utils.isCompatible(obj, Fingerprint, ver));
};

/*
 * API versions for Fingerprint:
 * [1,0] -- initial ver
 * [1,1] -- first tagged ver
 * [1,2] -- hashType and spki support
 */
Fingerprint.prototype._sshpkApiVersion = [1, 2];

Fingerprint._oldVersionDetect = function (obj) {
	assert.func(obj.toString);
	assert.func(obj.matches);
	return ([1, 0]);
};


/***/ }),

/***/ "tfmF":
/*!***************************************!*\
  !*** ./node_modules/sshpk/lib/dhe.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// Copyright 2017 Joyent, Inc.

module.exports = {
	DiffieHellman: DiffieHellman,
	generateECDSA: generateECDSA,
	generateED25519: generateED25519
};

var assert = __webpack_require__(/*! assert-plus */ "60GX");
var crypto = __webpack_require__(/*! crypto */ "HEbw");
var Buffer = __webpack_require__(/*! safer-buffer */ "xZGU").Buffer;
var algs = __webpack_require__(/*! ./algs */ "r++l");
var utils = __webpack_require__(/*! ./utils */ "43+q");
var nacl = __webpack_require__(/*! tweetnacl */ "WKRr");

var Key = __webpack_require__(/*! ./key */ "qfPv");
var PrivateKey = __webpack_require__(/*! ./private-key */ "UtVk");

var CRYPTO_HAVE_ECDH = (crypto.createECDH !== undefined);

var ecdh = __webpack_require__(/*! ecc-jsbn */ "YZtm");
var ec = __webpack_require__(/*! ecc-jsbn/lib/ec */ "mJl1");
var jsbn = __webpack_require__(/*! jsbn */ "8z4W").BigInteger;

function DiffieHellman(key) {
	utils.assertCompatible(key, Key, [1, 4], 'key');
	this._isPriv = PrivateKey.isPrivateKey(key, [1, 3]);
	this._algo = key.type;
	this._curve = key.curve;
	this._key = key;
	if (key.type === 'dsa') {
		if (!CRYPTO_HAVE_ECDH) {
			throw (new Error('Due to bugs in the node 0.10 ' +
			    'crypto API, node 0.12.x or later is required ' +
			    'to use DH'));
		}
		this._dh = crypto.createDiffieHellman(
		    key.part.p.data, undefined,
		    key.part.g.data, undefined);
		this._p = key.part.p;
		this._g = key.part.g;
		if (this._isPriv)
			this._dh.setPrivateKey(key.part.x.data);
		this._dh.setPublicKey(key.part.y.data);

	} else if (key.type === 'ecdsa') {
		if (!CRYPTO_HAVE_ECDH) {
			this._ecParams = new X9ECParameters(this._curve);

			if (this._isPriv) {
				this._priv = new ECPrivate(
				    this._ecParams, key.part.d.data);
			}
			return;
		}

		var curve = {
			'nistp256': 'prime256v1',
			'nistp384': 'secp384r1',
			'nistp521': 'secp521r1'
		}[key.curve];
		this._dh = crypto.createECDH(curve);
		if (typeof (this._dh) !== 'object' ||
		    typeof (this._dh.setPrivateKey) !== 'function') {
			CRYPTO_HAVE_ECDH = false;
			DiffieHellman.call(this, key);
			return;
		}
		if (this._isPriv)
			this._dh.setPrivateKey(key.part.d.data);
		this._dh.setPublicKey(key.part.Q.data);

	} else if (key.type === 'curve25519') {
		if (this._isPriv) {
			utils.assertCompatible(key, PrivateKey, [1, 5], 'key');
			this._priv = key.part.k.data;
		}

	} else {
		throw (new Error('DH not supported for ' + key.type + ' keys'));
	}
}

DiffieHellman.prototype.getPublicKey = function () {
	if (this._isPriv)
		return (this._key.toPublic());
	return (this._key);
};

DiffieHellman.prototype.getPrivateKey = function () {
	if (this._isPriv)
		return (this._key);
	else
		return (undefined);
};
DiffieHellman.prototype.getKey = DiffieHellman.prototype.getPrivateKey;

DiffieHellman.prototype._keyCheck = function (pk, isPub) {
	assert.object(pk, 'key');
	if (!isPub)
		utils.assertCompatible(pk, PrivateKey, [1, 3], 'key');
	utils.assertCompatible(pk, Key, [1, 4], 'key');

	if (pk.type !== this._algo) {
		throw (new Error('A ' + pk.type + ' key cannot be used in ' +
		    this._algo + ' Diffie-Hellman'));
	}

	if (pk.curve !== this._curve) {
		throw (new Error('A key from the ' + pk.curve + ' curve ' +
		    'cannot be used with a ' + this._curve +
		    ' Diffie-Hellman'));
	}

	if (pk.type === 'dsa') {
		assert.deepEqual(pk.part.p, this._p,
		    'DSA key prime does not match');
		assert.deepEqual(pk.part.g, this._g,
		    'DSA key generator does not match');
	}
};

DiffieHellman.prototype.setKey = function (pk) {
	this._keyCheck(pk);

	if (pk.type === 'dsa') {
		this._dh.setPrivateKey(pk.part.x.data);
		this._dh.setPublicKey(pk.part.y.data);

	} else if (pk.type === 'ecdsa') {
		if (CRYPTO_HAVE_ECDH) {
			this._dh.setPrivateKey(pk.part.d.data);
			this._dh.setPublicKey(pk.part.Q.data);
		} else {
			this._priv = new ECPrivate(
			    this._ecParams, pk.part.d.data);
		}

	} else if (pk.type === 'curve25519') {
		var k = pk.part.k;
		if (!pk.part.k)
			k = pk.part.r;
		this._priv = k.data;
		if (this._priv[0] === 0x00)
			this._priv = this._priv.slice(1);
		this._priv = this._priv.slice(0, 32);
	}
	this._key = pk;
	this._isPriv = true;
};
DiffieHellman.prototype.setPrivateKey = DiffieHellman.prototype.setKey;

DiffieHellman.prototype.computeSecret = function (otherpk) {
	this._keyCheck(otherpk, true);
	if (!this._isPriv)
		throw (new Error('DH exchange has not been initialized with ' +
		    'a private key yet'));

	var pub;
	if (this._algo === 'dsa') {
		return (this._dh.computeSecret(
		    otherpk.part.y.data));

	} else if (this._algo === 'ecdsa') {
		if (CRYPTO_HAVE_ECDH) {
			return (this._dh.computeSecret(
			    otherpk.part.Q.data));
		} else {
			pub = new ECPublic(
			    this._ecParams, otherpk.part.Q.data);
			return (this._priv.deriveSharedSecret(pub));
		}

	} else if (this._algo === 'curve25519') {
		pub = otherpk.part.A.data;
		while (pub[0] === 0x00 && pub.length > 32)
			pub = pub.slice(1);
		var priv = this._priv;
		assert.strictEqual(pub.length, 32);
		assert.strictEqual(priv.length, 32);

		var secret = nacl.box.before(new Uint8Array(pub),
		    new Uint8Array(priv));

		return (Buffer.from(secret));
	}

	throw (new Error('Invalid algorithm: ' + this._algo));
};

DiffieHellman.prototype.generateKey = function () {
	var parts = [];
	var priv, pub;
	if (this._algo === 'dsa') {
		this._dh.generateKeys();

		parts.push({name: 'p', data: this._p.data});
		parts.push({name: 'q', data: this._key.part.q.data});
		parts.push({name: 'g', data: this._g.data});
		parts.push({name: 'y', data: this._dh.getPublicKey()});
		parts.push({name: 'x', data: this._dh.getPrivateKey()});
		this._key = new PrivateKey({
			type: 'dsa',
			parts: parts
		});
		this._isPriv = true;
		return (this._key);

	} else if (this._algo === 'ecdsa') {
		if (CRYPTO_HAVE_ECDH) {
			this._dh.generateKeys();

			parts.push({name: 'curve',
			    data: Buffer.from(this._curve)});
			parts.push({name: 'Q', data: this._dh.getPublicKey()});
			parts.push({name: 'd', data: this._dh.getPrivateKey()});
			this._key = new PrivateKey({
				type: 'ecdsa',
				curve: this._curve,
				parts: parts
			});
			this._isPriv = true;
			return (this._key);

		} else {
			var n = this._ecParams.getN();
			var r = new jsbn(crypto.randomBytes(n.bitLength()));
			var n1 = n.subtract(jsbn.ONE);
			priv = r.mod(n1).add(jsbn.ONE);
			pub = this._ecParams.getG().multiply(priv);

			priv = Buffer.from(priv.toByteArray());
			pub = Buffer.from(this._ecParams.getCurve().
			    encodePointHex(pub), 'hex');

			this._priv = new ECPrivate(this._ecParams, priv);

			parts.push({name: 'curve',
			    data: Buffer.from(this._curve)});
			parts.push({name: 'Q', data: pub});
			parts.push({name: 'd', data: priv});

			this._key = new PrivateKey({
				type: 'ecdsa',
				curve: this._curve,
				parts: parts
			});
			this._isPriv = true;
			return (this._key);
		}

	} else if (this._algo === 'curve25519') {
		var pair = nacl.box.keyPair();
		priv = Buffer.from(pair.secretKey);
		pub = Buffer.from(pair.publicKey);
		priv = Buffer.concat([priv, pub]);
		assert.strictEqual(priv.length, 64);
		assert.strictEqual(pub.length, 32);

		parts.push({name: 'A', data: pub});
		parts.push({name: 'k', data: priv});
		this._key = new PrivateKey({
			type: 'curve25519',
			parts: parts
		});
		this._isPriv = true;
		return (this._key);
	}

	throw (new Error('Invalid algorithm: ' + this._algo));
};
DiffieHellman.prototype.generateKeys = DiffieHellman.prototype.generateKey;

/* These are helpers for using ecc-jsbn (for node 0.10 compatibility). */

function X9ECParameters(name) {
	var params = algs.curves[name];
	assert.object(params);

	var p = new jsbn(params.p);
	var a = new jsbn(params.a);
	var b = new jsbn(params.b);
	var n = new jsbn(params.n);
	var h = jsbn.ONE;
	var curve = new ec.ECCurveFp(p, a, b);
	var G = curve.decodePointHex(params.G.toString('hex'));

	this.curve = curve;
	this.g = G;
	this.n = n;
	this.h = h;
}
X9ECParameters.prototype.getCurve = function () { return (this.curve); };
X9ECParameters.prototype.getG = function () { return (this.g); };
X9ECParameters.prototype.getN = function () { return (this.n); };
X9ECParameters.prototype.getH = function () { return (this.h); };

function ECPublic(params, buffer) {
	this._params = params;
	if (buffer[0] === 0x00)
		buffer = buffer.slice(1);
	this._pub = params.getCurve().decodePointHex(buffer.toString('hex'));
}

function ECPrivate(params, buffer) {
	this._params = params;
	this._priv = new jsbn(utils.mpNormalize(buffer));
}
ECPrivate.prototype.deriveSharedSecret = function (pubKey) {
	assert.ok(pubKey instanceof ECPublic);
	var S = pubKey._pub.multiply(this._priv);
	return (Buffer.from(S.getX().toBigInteger().toByteArray()));
};

function generateED25519() {
	var pair = nacl.sign.keyPair();
	var priv = Buffer.from(pair.secretKey);
	var pub = Buffer.from(pair.publicKey);
	assert.strictEqual(priv.length, 64);
	assert.strictEqual(pub.length, 32);

	var parts = [];
	parts.push({name: 'A', data: pub});
	parts.push({name: 'k', data: priv.slice(0, 32)});
	var key = new PrivateKey({
		type: 'ed25519',
		parts: parts
	});
	return (key);
}

/* Generates a new ECDSA private key on a given curve. */
function generateECDSA(curve) {
	var parts = [];
	var key;

	if (CRYPTO_HAVE_ECDH) {
		/*
		 * Node crypto doesn't expose key generation directly, but the
		 * ECDH instances can generate keys. It turns out this just
		 * calls into the OpenSSL generic key generator, and we can
		 * read its output happily without doing an actual DH. So we
		 * use that here.
		 */
		var osCurve = {
			'nistp256': 'prime256v1',
			'nistp384': 'secp384r1',
			'nistp521': 'secp521r1'
		}[curve];

		var dh = crypto.createECDH(osCurve);
		dh.generateKeys();

		parts.push({name: 'curve',
		    data: Buffer.from(curve)});
		parts.push({name: 'Q', data: dh.getPublicKey()});
		parts.push({name: 'd', data: dh.getPrivateKey()});

		key = new PrivateKey({
			type: 'ecdsa',
			curve: curve,
			parts: parts
		});
		return (key);
	} else {

		var ecParams = new X9ECParameters(curve);

		/* This algorithm taken from FIPS PUB 186-4 (section B.4.1) */
		var n = ecParams.getN();
		/*
		 * The crypto.randomBytes() function can only give us whole
		 * bytes, so taking a nod from X9.62, we round up.
		 */
		var cByteLen = Math.ceil((n.bitLength() + 64) / 8);
		var c = new jsbn(crypto.randomBytes(cByteLen));

		var n1 = n.subtract(jsbn.ONE);
		var priv = c.mod(n1).add(jsbn.ONE);
		var pub = ecParams.getG().multiply(priv);

		priv = Buffer.from(priv.toByteArray());
		pub = Buffer.from(ecParams.getCurve().
		    encodePointHex(pub), 'hex');

		parts.push({name: 'curve', data: Buffer.from(curve)});
		parts.push({name: 'Q', data: pub});
		parts.push({name: 'd', data: priv});

		key = new PrivateKey({
			type: 'ecdsa',
			curve: curve,
			parts: parts
		});
		return (key);
	}
}


/***/ }),

/***/ "vBLe":
/*!********************************************!*\
  !*** ./node_modules/sshpk/lib/identity.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// Copyright 2017 Joyent, Inc.

module.exports = Identity;

var assert = __webpack_require__(/*! assert-plus */ "60GX");
var algs = __webpack_require__(/*! ./algs */ "r++l");
var crypto = __webpack_require__(/*! crypto */ "HEbw");
var Fingerprint = __webpack_require__(/*! ./fingerprint */ "s54N");
var Signature = __webpack_require__(/*! ./signature */ "ZVj6");
var errs = __webpack_require__(/*! ./errors */ "HvMK");
var util = __webpack_require__(/*! util */ "7tlc");
var utils = __webpack_require__(/*! ./utils */ "43+q");
var asn1 = __webpack_require__(/*! asn1 */ "ZkxX");
var Buffer = __webpack_require__(/*! safer-buffer */ "xZGU").Buffer;

/*JSSTYLED*/
var DNS_NAME_RE = /^([*]|[a-z0-9][a-z0-9\-]{0,62})(?:\.([*]|[a-z0-9][a-z0-9\-]{0,62}))*$/i;

var oids = {};
oids.cn = '2.5.4.3';
oids.o = '2.5.4.10';
oids.ou = '2.5.4.11';
oids.l = '2.5.4.7';
oids.s = '2.5.4.8';
oids.c = '2.5.4.6';
oids.sn = '2.5.4.4';
oids.postalCode = '2.5.4.17';
oids.serialNumber = '2.5.4.5';
oids.street = '2.5.4.9';
oids.x500UniqueIdentifier = '2.5.4.45';
oids.role = '2.5.4.72';
oids.telephoneNumber = '2.5.4.20';
oids.description = '2.5.4.13';
oids.dc = '0.9.2342.19200300.100.1.25';
oids.uid = '0.9.2342.19200300.100.1.1';
oids.mail = '0.9.2342.19200300.100.1.3';
oids.title = '2.5.4.12';
oids.gn = '2.5.4.42';
oids.initials = '2.5.4.43';
oids.pseudonym = '2.5.4.65';
oids.emailAddress = '1.2.840.113549.1.9.1';

var unoids = {};
Object.keys(oids).forEach(function (k) {
	unoids[oids[k]] = k;
});

function Identity(opts) {
	var self = this;
	assert.object(opts, 'options');
	assert.arrayOfObject(opts.components, 'options.components');
	this.components = opts.components;
	this.componentLookup = {};
	this.components.forEach(function (c) {
		if (c.name && !c.oid)
			c.oid = oids[c.name];
		if (c.oid && !c.name)
			c.name = unoids[c.oid];
		if (self.componentLookup[c.name] === undefined)
			self.componentLookup[c.name] = [];
		self.componentLookup[c.name].push(c);
	});
	if (this.componentLookup.cn && this.componentLookup.cn.length > 0) {
		this.cn = this.componentLookup.cn[0].value;
	}
	assert.optionalString(opts.type, 'options.type');
	if (opts.type === undefined) {
		if (this.components.length === 1 &&
		    this.componentLookup.cn &&
		    this.componentLookup.cn.length === 1 &&
		    this.componentLookup.cn[0].value.match(DNS_NAME_RE)) {
			this.type = 'host';
			this.hostname = this.componentLookup.cn[0].value;

		} else if (this.componentLookup.dc &&
		    this.components.length === this.componentLookup.dc.length) {
			this.type = 'host';
			this.hostname = this.componentLookup.dc.map(
			    function (c) {
				return (c.value);
			}).join('.');

		} else if (this.componentLookup.uid &&
		    this.components.length ===
		    this.componentLookup.uid.length) {
			this.type = 'user';
			this.uid = this.componentLookup.uid[0].value;

		} else if (this.componentLookup.cn &&
		    this.componentLookup.cn.length === 1 &&
		    this.componentLookup.cn[0].value.match(DNS_NAME_RE)) {
			this.type = 'host';
			this.hostname = this.componentLookup.cn[0].value;

		} else if (this.componentLookup.uid &&
		    this.componentLookup.uid.length === 1) {
			this.type = 'user';
			this.uid = this.componentLookup.uid[0].value;

		} else if (this.componentLookup.mail &&
		    this.componentLookup.mail.length === 1) {
			this.type = 'email';
			this.email = this.componentLookup.mail[0].value;

		} else if (this.componentLookup.cn &&
		    this.componentLookup.cn.length === 1) {
			this.type = 'user';
			this.uid = this.componentLookup.cn[0].value;

		} else {
			this.type = 'unknown';
		}
	} else {
		this.type = opts.type;
		if (this.type === 'host')
			this.hostname = opts.hostname;
		else if (this.type === 'user')
			this.uid = opts.uid;
		else if (this.type === 'email')
			this.email = opts.email;
		else
			throw (new Error('Unknown type ' + this.type));
	}
}

Identity.prototype.toString = function () {
	return (this.components.map(function (c) {
		var n = c.name.toUpperCase();
		/*JSSTYLED*/
		n = n.replace(/=/g, '\\=');
		var v = c.value;
		/*JSSTYLED*/
		v = v.replace(/,/g, '\\,');
		return (n + '=' + v);
	}).join(', '));
};

Identity.prototype.get = function (name, asArray) {
	assert.string(name, 'name');
	var arr = this.componentLookup[name];
	if (arr === undefined || arr.length === 0)
		return (undefined);
	if (!asArray && arr.length > 1)
		throw (new Error('Multiple values for attribute ' + name));
	if (!asArray)
		return (arr[0].value);
	return (arr.map(function (c) {
		return (c.value);
	}));
};

Identity.prototype.toArray = function (idx) {
	return (this.components.map(function (c) {
		return ({
			name: c.name,
			value: c.value
		});
	}));
};

/*
 * These are from X.680 -- PrintableString allowed chars are in section 37.4
 * table 8. Spec for IA5Strings is "1,6 + SPACE + DEL" where 1 refers to
 * ISO IR #001 (standard ASCII control characters) and 6 refers to ISO IR #006
 * (the basic ASCII character set).
 */
/* JSSTYLED */
var NOT_PRINTABLE = /[^a-zA-Z0-9 '(),+.\/:=?-]/;
/* JSSTYLED */
var NOT_IA5 = /[^\x00-\x7f]/;

Identity.prototype.toAsn1 = function (der, tag) {
	der.startSequence(tag);
	this.components.forEach(function (c) {
		der.startSequence(asn1.Ber.Constructor | asn1.Ber.Set);
		der.startSequence();
		der.writeOID(c.oid);
		/*
		 * If we fit in a PrintableString, use that. Otherwise use an
		 * IA5String or UTF8String.
		 *
		 * If this identity was parsed from a DN, use the ASN.1 types
		 * from the original representation (otherwise this might not
		 * be a full match for the original in some validators).
		 */
		if (c.asn1type === asn1.Ber.Utf8String ||
		    c.value.match(NOT_IA5)) {
			var v = Buffer.from(c.value, 'utf8');
			der.writeBuffer(v, asn1.Ber.Utf8String);

		} else if (c.asn1type === asn1.Ber.IA5String ||
		    c.value.match(NOT_PRINTABLE)) {
			der.writeString(c.value, asn1.Ber.IA5String);

		} else {
			var type = asn1.Ber.PrintableString;
			if (c.asn1type !== undefined)
				type = c.asn1type;
			der.writeString(c.value, type);
		}
		der.endSequence();
		der.endSequence();
	});
	der.endSequence();
};

function globMatch(a, b) {
	if (a === '**' || b === '**')
		return (true);
	var aParts = a.split('.');
	var bParts = b.split('.');
	if (aParts.length !== bParts.length)
		return (false);
	for (var i = 0; i < aParts.length; ++i) {
		if (aParts[i] === '*' || bParts[i] === '*')
			continue;
		if (aParts[i] !== bParts[i])
			return (false);
	}
	return (true);
}

Identity.prototype.equals = function (other) {
	if (!Identity.isIdentity(other, [1, 0]))
		return (false);
	if (other.components.length !== this.components.length)
		return (false);
	for (var i = 0; i < this.components.length; ++i) {
		if (this.components[i].oid !== other.components[i].oid)
			return (false);
		if (!globMatch(this.components[i].value,
		    other.components[i].value)) {
			return (false);
		}
	}
	return (true);
};

Identity.forHost = function (hostname) {
	assert.string(hostname, 'hostname');
	return (new Identity({
		type: 'host',
		hostname: hostname,
		components: [ { name: 'cn', value: hostname } ]
	}));
};

Identity.forUser = function (uid) {
	assert.string(uid, 'uid');
	return (new Identity({
		type: 'user',
		uid: uid,
		components: [ { name: 'uid', value: uid } ]
	}));
};

Identity.forEmail = function (email) {
	assert.string(email, 'email');
	return (new Identity({
		type: 'email',
		email: email,
		components: [ { name: 'mail', value: email } ]
	}));
};

Identity.parseDN = function (dn) {
	assert.string(dn, 'dn');
	var parts = [''];
	var idx = 0;
	var rem = dn;
	while (rem.length > 0) {
		var m;
		/*JSSTYLED*/
		if ((m = /^,/.exec(rem)) !== null) {
			parts[++idx] = '';
			rem = rem.slice(m[0].length);
		/*JSSTYLED*/
		} else if ((m = /^\\,/.exec(rem)) !== null) {
			parts[idx] += ',';
			rem = rem.slice(m[0].length);
		/*JSSTYLED*/
		} else if ((m = /^\\./.exec(rem)) !== null) {
			parts[idx] += m[0];
			rem = rem.slice(m[0].length);
		/*JSSTYLED*/
		} else if ((m = /^[^\\,]+/.exec(rem)) !== null) {
			parts[idx] += m[0];
			rem = rem.slice(m[0].length);
		} else {
			throw (new Error('Failed to parse DN'));
		}
	}
	var cmps = parts.map(function (c) {
		c = c.trim();
		var eqPos = c.indexOf('=');
		while (eqPos > 0 && c.charAt(eqPos - 1) === '\\')
			eqPos = c.indexOf('=', eqPos + 1);
		if (eqPos === -1) {
			throw (new Error('Failed to parse DN'));
		}
		/*JSSTYLED*/
		var name = c.slice(0, eqPos).toLowerCase().replace(/\\=/g, '=');
		var value = c.slice(eqPos + 1);
		return ({ name: name, value: value });
	});
	return (new Identity({ components: cmps }));
};

Identity.fromArray = function (components) {
	assert.arrayOfObject(components, 'components');
	components.forEach(function (cmp) {
		assert.object(cmp, 'component');
		assert.string(cmp.name, 'component.name');
		if (!Buffer.isBuffer(cmp.value) &&
		    !(typeof (cmp.value) === 'string')) {
			throw (new Error('Invalid component value'));
		}
	});
	return (new Identity({ components: components }));
};

Identity.parseAsn1 = function (der, top) {
	var components = [];
	der.readSequence(top);
	var end = der.offset + der.length;
	while (der.offset < end) {
		der.readSequence(asn1.Ber.Constructor | asn1.Ber.Set);
		var after = der.offset + der.length;
		der.readSequence();
		var oid = der.readOID();
		var type = der.peek();
		var value;
		switch (type) {
		case asn1.Ber.PrintableString:
		case asn1.Ber.IA5String:
		case asn1.Ber.OctetString:
		case asn1.Ber.T61String:
			value = der.readString(type);
			break;
		case asn1.Ber.Utf8String:
			value = der.readString(type, true);
			value = value.toString('utf8');
			break;
		case asn1.Ber.CharacterString:
		case asn1.Ber.BMPString:
			value = der.readString(type, true);
			value = value.toString('utf16le');
			break;
		default:
			throw (new Error('Unknown asn1 type ' + type));
		}
		components.push({ oid: oid, asn1type: type, value: value });
		der._offset = after;
	}
	der._offset = end;
	return (new Identity({
		components: components
	}));
};

Identity.isIdentity = function (obj, ver) {
	return (utils.isCompatible(obj, Identity, ver));
};

/*
 * API versions for Identity:
 * [1,0] -- initial ver
 */
Identity.prototype._sshpkApiVersion = [1, 0];

Identity._oldVersionDetect = function (obj) {
	return ([1, 0]);
};


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvc3NocGsvbGliL2Zvcm1hdHMvcGtjczEuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3NzaHBrL2xpYi9mb3JtYXRzL29wZW5zc2gtY2VydC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvc3NocGsvbGliL2Zvcm1hdHMvc3NoLXByaXZhdGUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3NzaHBrL2xpYi9mb3JtYXRzL2F1dG8uanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3NzaHBrL2xpYi91dGlscy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvc3NocGsvbGliL2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9zc2hway9saWIvZm9ybWF0cy94NTA5LXBlbS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvc3NocGsvbGliL2Vycm9ycy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvc3NocGsvbGliL2Zvcm1hdHMveDUwOS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvc3NocGsvbGliL3ByaXZhdGUta2V5LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9zc2hway9saWIvZm9ybWF0cy9wZW0uanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3NzaHBrL2xpYi9lZC1jb21wYXQuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3NzaHBrL2xpYi9mb3JtYXRzL2Ruc3NlYy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvc3NocGsvbGliL2Zvcm1hdHMvcGtjczguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3NzaHBrL2xpYi9zaWduYXR1cmUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3NzaHBrL2xpYi9mb3JtYXRzL3B1dHR5LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9zc2hway9saWIvc3NoLWJ1ZmZlci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvc3NocGsvbGliL2Zvcm1hdHMvc3NoLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9zc2hway9saWIvZm9ybWF0cy9yZmM0MjUzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9zc2hway9saWIvY2VydGlmaWNhdGUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3NzaHBrL2xpYi9rZXkuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3NzaHBrL2xpYi9hbGdzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9zc2hway9saWIvZmluZ2VycHJpbnQuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3NzaHBrL2xpYi9kaGUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3NzaHBrL2xpYi9pZGVudGl0eS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsYUFBYSxtQkFBTyxDQUFDLHlCQUFhO0FBQ2xDLFdBQVcsbUJBQU8sQ0FBQyxrQkFBTTtBQUN6QixhQUFhLG1CQUFPLENBQUMsMEJBQWM7QUFDbkMsV0FBVyxtQkFBTyxDQUFDLHFCQUFTO0FBQzVCLFlBQVksbUJBQU8sQ0FBQyxzQkFBVTs7QUFFOUIsVUFBVSxtQkFBTyxDQUFDLG9CQUFRO0FBQzFCLGlCQUFpQixtQkFBTyxDQUFDLDRCQUFnQjtBQUN6QyxVQUFVLG1CQUFPLENBQUMsbUJBQU87O0FBRXpCLFlBQVksbUJBQU8sQ0FBQyxxQkFBUztBQUM3Qjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLHFCQUFxQjtBQUN6QixJQUFJO0FBQ0o7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLHFCQUFxQjtBQUN6QixJQUFJLHFCQUFxQjtBQUN6QixJQUFJLHFCQUFxQjtBQUN6QixJQUFJLDJCQUEyQjtBQUMvQixJQUFJLHFCQUFxQjtBQUN6QixJQUFJLHFCQUFxQjtBQUN6QixJQUFJLDZCQUE2QjtBQUNqQyxJQUFJO0FBQ0o7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxxQkFBcUI7QUFDekIsSUFBSSxxQkFBcUI7QUFDekIsSUFBSSxxQkFBcUI7QUFDekIsSUFBSSxxQkFBcUI7QUFDekIsSUFBSTtBQUNKO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLGdEQUFnRDtBQUNwRCxJQUFJO0FBQ0o7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsSUFBSSxxQkFBcUI7QUFDekIsSUFBSSxxQkFBcUI7QUFDekIsSUFBSSxxQkFBcUI7QUFDekIsSUFBSTtBQUNKO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLGdCQUFnQixtQkFBbUI7QUFDbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUksMENBQTBDO0FBQzlDLElBQUk7QUFDSjtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLDBDQUEwQztBQUM5QyxJQUFJLHFCQUFxQjtBQUN6QixJQUFJO0FBQ0o7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLG1DQUFtQztBQUNuQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNwWEE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGFBQWEsbUJBQU8sQ0FBQyx5QkFBYTtBQUNsQyxnQkFBZ0IsbUJBQU8sQ0FBQywyQkFBZTtBQUN2QyxhQUFhLG1CQUFPLENBQUMsb0JBQVE7QUFDN0IsYUFBYSxtQkFBTyxDQUFDLDBCQUFjO0FBQ25DLFdBQVcsbUJBQU8sQ0FBQyxxQkFBUztBQUM1QixVQUFVLG1CQUFPLENBQUMsb0JBQVE7QUFDMUIsaUJBQWlCLG1CQUFPLENBQUMsNEJBQWdCO0FBQ3pDLGVBQWUsbUJBQU8sQ0FBQyx5QkFBYTtBQUNwQyxjQUFjLG1CQUFPLENBQUMsdUJBQVc7QUFDakMsZ0JBQWdCLG1CQUFPLENBQUMsMEJBQWM7QUFDdEMsWUFBWSxtQkFBTyxDQUFDLHNCQUFVO0FBQzlCLGtCQUFrQixtQkFBTyxDQUFDLDRCQUFnQjs7QUFFMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5Q0FBeUMscUJBQXFCLEVBQUU7O0FBRWhFOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDZCQUE2QixlQUFlO0FBQzVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsZ0JBQWdCLDBCQUEwQjtBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSw4QkFBOEIsZUFBZTtBQUM3QztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFOztBQUVGO0FBQ0E7O0FBRUE7QUFDQSw2QkFBNkIsOEJBQThCO0FBQzNEO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUIsOEJBQThCO0FBQ3ZEO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDJCQUEyQjtBQUMzQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTs7QUFFRjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsMkJBQTJCO0FBQzNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsOEJBQThCO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7O0FBRUEsMEJBQTBCO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FB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QUFlO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0IsZ0JBQWdCO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxvQkFBb0I7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLG9CQUFvQjtBQUNwQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtB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Q0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSixHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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O0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxzQkFBc0I7O0FBRXRCLHNCQUFzQjtBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsc0JBQXNCO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVB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OztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUkscUJBQXFCO0FBQ3pCLElBQUkscUJBQXFCO0FBQ3pCLElBQUkscUJBQXFCO0FBQ3pCLElBQUk7QUFDSjtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUkscUJBQXFCO0FBQ3pCLElBQUkscUJBQXFCO0FBQ3pCLElBQUkscUJBQXFCO0FBQ3pCLElBQUkscUJBQXFCO0FBQ3pCLElBQUk7QUFDSjtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxhQUFhLHVCQUF1QjtBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxhQUFhLHVCQUF1QjtBQUNwQztBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsZUFBZTtBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsSUFBSSw4Q0FBOEM7QUFDbEQsSUFBSSxxQkFBcUI7QUFDekIsSUFBSTtBQUNKO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLDhDQUE4QztBQUNsRCxJQUFJO0FBQ0o7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsSUFBSSxnREFBZ0Q7QUFDcEQsSUFBSTtBQUNKO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUksZ0RBQWdEO0FBQ3BELElBQUk7QUFDSjtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxFQUFFO0FBQ0Y7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxvQ0FBb0M7QUFDcEM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUN0bkJBOztBQUVBOztBQUVBLGFBQWEsbUJBQU8sQ0FBQyx5QkFBYTtBQUNsQyxhQUFhLG1CQUFPLENBQUMsMEJBQWM7QUFDbkMsV0FBVyxtQkFBTyxDQUFDLG9CQUFRO0FBQzNCLGFBQWEsbUJBQU8sQ0FBQyxvQkFBUTtBQUM3QixXQUFXLG1CQUFPLENBQUMsc0JBQVU7QUFDN0IsWUFBWSxtQkFBTyxDQUFDLHFCQUFTO0FBQzdCLFdBQVcsbUJBQU8sQ0FBQyxrQkFBTTtBQUN6QixnQkFBZ0IsbUJBQU8sQ0FBQywwQkFBYzs7QUFFdEM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGdCQUFnQix1QkFBdUI7QUFDdkM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QjtBQUN6QjtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx5QkFBeUI7QUFDekI7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0gseUJBQXlCO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSCwrQkFBK0I7QUFDL0I7QUFDQTtBQUNBOztBQUVBLHlCQUF5QjtBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCLGFBQWE7QUFDekM7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLHdCQUF3QjtBQUMxQztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsa0JBQWtCLHNDQUFzQztBQUN4RCxrQkFBa0Isc0NBQXNDOztBQUV4RDtBQUNBOztBQUVBO0FBQ0E7QUFDQSwyQkFBMkIsYUFBYTtBQUN4QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQixtQ0FBbUM7QUFDckQsa0JBQWtCLG9DQUFvQztBQUN0RDtBQUNBOztBQUVBO0FBQ0EsMEJBQTBCLGFBQWE7O0FBRXZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixjQUFjO0FBQ3JDO0FBQ0EsRUFBRTtBQUNGLE9BQU87QUFDUDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUN6VEE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsYUFBYSxtQkFBTyxDQUFDLHlCQUFhO0FBQ2xDLGFBQWEsbUJBQU8sQ0FBQywwQkFBYztBQUNuQyxjQUFjLG1CQUFPLENBQUMsdUJBQVc7QUFDakMsVUFBVSxtQkFBTyxDQUFDLG9CQUFROztBQUUxQixhQUFhLG1CQUFPLENBQUMsdUJBQVc7O0FBRWhDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDbEdBOztBQUVBOztBQUVBLGFBQWEsbUJBQU8sQ0FBQyx5QkFBYTtBQUNsQyxhQUFhLG1CQUFPLENBQUMsMEJBQWM7O0FBRW5DO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxVQUFVLHdCQUF3QjtBQUNsQzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsaUJBQWlCO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDcEpBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGFBQWEsbUJBQU8sQ0FBQyx5QkFBYTtBQUNsQyxhQUFhLG1CQUFPLENBQUMsMEJBQWM7QUFDbkMsY0FBYyxtQkFBTyxDQUFDLHVCQUFXO0FBQ2pDLFlBQVksbUJBQU8sQ0FBQyxzQkFBVTtBQUM5QixVQUFVLG1CQUFPLENBQUMsb0JBQVE7QUFDMUIsaUJBQWlCLG1CQUFPLENBQUMsNEJBQWdCOztBQUV6QyxjQUFjLG1CQUFPLENBQUMsMkJBQWU7O0FBRXJDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNsSEE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsYUFBYSxtQkFBTyxDQUFDLHlCQUFhO0FBQ2xDLGFBQWEsbUJBQU8sQ0FBQywwQkFBYztBQUNuQyxXQUFXLG1CQUFPLENBQUMscUJBQVM7QUFDNUIsWUFBWSxtQkFBTyxDQUFDLHNCQUFVO0FBQzlCLFVBQVUsbUJBQU8sQ0FBQyxvQkFBUTtBQUMxQixpQkFBaUIsbUJBQU8sQ0FBQyw0QkFBZ0I7QUFDekMsZ0JBQWdCLG1CQUFPLENBQUMsMkJBQWU7O0FBRXZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSw2QkFBNkIsWUFBWTs7QUFFekM7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGdCQUFnQiwwQkFBMEI7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDJCQUEyQjs7QUFFM0I7O0FBRUEsWUFBWSxrQkFBa0I7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNyS0E7O0FBRUE7O0FBRUEsYUFBYSxtQkFBTyxDQUFDLHlCQUFhO0FBQ2xDLGFBQWEsbUJBQU8sQ0FBQywwQkFBYztBQUNuQyxXQUFXLG1CQUFPLENBQUMsb0JBQVE7QUFDM0IsYUFBYSxtQkFBTyxDQUFDLG9CQUFRO0FBQzdCLGtCQUFrQixtQkFBTyxDQUFDLDJCQUFlO0FBQ3pDLGdCQUFnQixtQkFBTyxDQUFDLHlCQUFhO0FBQ3JDLFdBQVcsbUJBQU8sQ0FBQyxzQkFBVTtBQUM3QixXQUFXLG1CQUFPLENBQUMsa0JBQU07QUFDekIsWUFBWSxtQkFBTyxDQUFDLHFCQUFTO0FBQzdCLFVBQVUsbUJBQU8sQ0FBQyxtQkFBTztBQUN6QixpQkFBaUIsbUJBQU8sQ0FBQywyQkFBZTtBQUN4QyxlQUFlLG1CQUFPLENBQUMsd0JBQVk7O0FBRW5DO0FBQ0EscUJBQXFCLG1CQUFPLENBQUMsb0NBQXdCO0FBQ3JELGtCQUFrQixtQkFBTyxDQUFDLDRCQUFnQjtBQUMxQyxpQkFBaUIsbUJBQU8sQ0FBQyxnQ0FBb0I7O0FBRTdDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLGlCQUFpQjtBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxFQUFFOztBQUVGOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQjtBQUNoQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7O0FBRUY7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7OztBQ3JTQTs7QUFFQSxhQUFhLG1CQUFPLENBQUMsMEJBQWM7O0FBRW5DO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ3ZLQTs7QUFFQTs7QUFFQSxhQUFhLG1CQUFPLENBQUMseUJBQWE7QUFDbEMsYUFBYSxtQkFBTyxDQUFDLDBCQUFjO0FBQ25DLFdBQVcsbUJBQU8sQ0FBQyxvQkFBUTtBQUMzQixhQUFhLG1CQUFPLENBQUMsb0JBQVE7QUFDN0IsV0FBVyxtQkFBTyxDQUFDLHNCQUFVO0FBQzdCLFVBQVUsbUJBQU8sQ0FBQyxtQkFBTztBQUN6QixpQkFBaUIsbUJBQU8sQ0FBQywyQkFBZTtBQUN4QyxrQkFBa0IsbUJBQU8sQ0FBQywyQkFBZTtBQUN6QyxZQUFZLG1CQUFPLENBQUMscUJBQVM7O0FBRTdCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0Esb0NBQW9DLHdCQUF3QixFQUFFO0FBQzlEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGOztBQUVBO0FBQ0E7QUFDQSx1QkFBdUIsRUFBRTtBQUN6Qjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLHlDQUF5QztBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSIsImZpbGUiOiJidWlsZC92ZW5kb3IvdmVuZG9yLnNzaHBrLmViNzZhYmQ3ZDUyZjQ2MjJhOTZkLmNodW5rLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IDIwMTUgSm95ZW50LCBJbmMuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuXHRyZWFkOiByZWFkLFxyXG5cdHJlYWRQa2NzMTogcmVhZFBrY3MxLFxyXG5cdHdyaXRlOiB3cml0ZSxcclxuXHR3cml0ZVBrY3MxOiB3cml0ZVBrY3MxXHJcbn07XHJcblxyXG52YXIgYXNzZXJ0ID0gcmVxdWlyZSgnYXNzZXJ0LXBsdXMnKTtcclxudmFyIGFzbjEgPSByZXF1aXJlKCdhc24xJyk7XHJcbnZhciBCdWZmZXIgPSByZXF1aXJlKCdzYWZlci1idWZmZXInKS5CdWZmZXI7XHJcbnZhciBhbGdzID0gcmVxdWlyZSgnLi4vYWxncycpO1xyXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlscycpO1xyXG5cclxudmFyIEtleSA9IHJlcXVpcmUoJy4uL2tleScpO1xyXG52YXIgUHJpdmF0ZUtleSA9IHJlcXVpcmUoJy4uL3ByaXZhdGUta2V5Jyk7XHJcbnZhciBwZW0gPSByZXF1aXJlKCcuL3BlbScpO1xyXG5cclxudmFyIHBrY3M4ID0gcmVxdWlyZSgnLi9wa2NzOCcpO1xyXG52YXIgcmVhZEVDRFNBQ3VydmUgPSBwa2NzOC5yZWFkRUNEU0FDdXJ2ZTtcclxuXHJcbmZ1bmN0aW9uIHJlYWQoYnVmLCBvcHRpb25zKSB7XHJcblx0cmV0dXJuIChwZW0ucmVhZChidWYsIG9wdGlvbnMsICdwa2NzMScpKTtcclxufVxyXG5cclxuZnVuY3Rpb24gd3JpdGUoa2V5LCBvcHRpb25zKSB7XHJcblx0cmV0dXJuIChwZW0ud3JpdGUoa2V5LCBvcHRpb25zLCAncGtjczEnKSk7XHJcbn1cclxuXHJcbi8qIEhlbHBlciB0byByZWFkIGluIGEgc2luZ2xlIG1waW50ICovXHJcbmZ1bmN0aW9uIHJlYWRNUEludChkZXIsIG5tKSB7XHJcblx0YXNzZXJ0LnN0cmljdEVxdWFsKGRlci5wZWVrKCksIGFzbjEuQmVyLkludGVnZXIsXHJcblx0ICAgIG5tICsgJyBpcyBub3QgYW4gSW50ZWdlcicpO1xyXG5cdHJldHVybiAodXRpbHMubXBOb3JtYWxpemUoZGVyLnJlYWRTdHJpbmcoYXNuMS5CZXIuSW50ZWdlciwgdHJ1ZSkpKTtcclxufVxyXG5cclxuZnVuY3Rpb24gcmVhZFBrY3MxKGFsZywgdHlwZSwgZGVyKSB7XHJcblx0c3dpdGNoIChhbGcpIHtcclxuXHRjYXNlICdSU0EnOlxyXG5cdFx0aWYgKHR5cGUgPT09ICdwdWJsaWMnKVxyXG5cdFx0XHRyZXR1cm4gKHJlYWRQa2NzMVJTQVB1YmxpYyhkZXIpKTtcclxuXHRcdGVsc2UgaWYgKHR5cGUgPT09ICdwcml2YXRlJylcclxuXHRcdFx0cmV0dXJuIChyZWFkUGtjczFSU0FQcml2YXRlKGRlcikpO1xyXG5cdFx0dGhyb3cgKG5ldyBFcnJvcignVW5rbm93biBrZXkgdHlwZTogJyArIHR5cGUpKTtcclxuXHRjYXNlICdEU0EnOlxyXG5cdFx0aWYgKHR5cGUgPT09ICdwdWJsaWMnKVxyXG5cdFx0XHRyZXR1cm4gKHJlYWRQa2NzMURTQVB1YmxpYyhkZXIpKTtcclxuXHRcdGVsc2UgaWYgKHR5cGUgPT09ICdwcml2YXRlJylcclxuXHRcdFx0cmV0dXJuIChyZWFkUGtjczFEU0FQcml2YXRlKGRlcikpO1xyXG5cdFx0dGhyb3cgKG5ldyBFcnJvcignVW5rbm93biBrZXkgdHlwZTogJyArIHR5cGUpKTtcclxuXHRjYXNlICdFQyc6XHJcblx0Y2FzZSAnRUNEU0EnOlxyXG5cdFx0aWYgKHR5cGUgPT09ICdwcml2YXRlJylcclxuXHRcdFx0cmV0dXJuIChyZWFkUGtjczFFQ0RTQVByaXZhdGUoZGVyKSk7XHJcblx0XHRlbHNlIGlmICh0eXBlID09PSAncHVibGljJylcclxuXHRcdFx0cmV0dXJuIChyZWFkUGtjczFFQ0RTQVB1YmxpYyhkZXIpKTtcclxuXHRcdHRocm93IChuZXcgRXJyb3IoJ1Vua25vd24ga2V5IHR5cGU6ICcgKyB0eXBlKSk7XHJcblx0Y2FzZSAnRUREU0EnOlxyXG5cdGNhc2UgJ0VkRFNBJzpcclxuXHRcdGlmICh0eXBlID09PSAncHJpdmF0ZScpXHJcblx0XHRcdHJldHVybiAocmVhZFBrY3MxRWREU0FQcml2YXRlKGRlcikpO1xyXG5cdFx0dGhyb3cgKG5ldyBFcnJvcih0eXBlICsgJyBrZXlzIG5vdCBzdXBwb3J0ZWQgd2l0aCBFZERTQScpKTtcclxuXHRkZWZhdWx0OlxyXG5cdFx0dGhyb3cgKG5ldyBFcnJvcignVW5rbm93biBrZXkgYWxnbzogJyArIGFsZykpO1xyXG5cdH1cclxufVxyXG5cclxuZnVuY3Rpb24gcmVhZFBrY3MxUlNBUHVibGljKGRlcikge1xyXG5cdC8vIG1vZHVsdXMgYW5kIGV4cG9uZW50XHJcblx0dmFyIG4gPSByZWFkTVBJbnQoZGVyLCAnbW9kdWx1cycpO1xyXG5cdHZhciBlID0gcmVhZE1QSW50KGRlciwgJ2V4cG9uZW50Jyk7XHJcblxyXG5cdC8vIG5vdywgbWFrZSB0aGUga2V5XHJcblx0dmFyIGtleSA9IHtcclxuXHRcdHR5cGU6ICdyc2EnLFxyXG5cdFx0cGFydHM6IFtcclxuXHRcdFx0eyBuYW1lOiAnZScsIGRhdGE6IGUgfSxcclxuXHRcdFx0eyBuYW1lOiAnbicsIGRhdGE6IG4gfVxyXG5cdFx0XVxyXG5cdH07XHJcblxyXG5cdHJldHVybiAobmV3IEtleShrZXkpKTtcclxufVxyXG5cclxuZnVuY3Rpb24gcmVhZFBrY3MxUlNBUHJpdmF0ZShkZXIpIHtcclxuXHR2YXIgdmVyc2lvbiA9IHJlYWRNUEludChkZXIsICd2ZXJzaW9uJyk7XHJcblx0YXNzZXJ0LnN0cmljdEVxdWFsKHZlcnNpb25bMF0sIDApO1xyXG5cclxuXHQvLyBtb2R1bHVzIHRoZW4gcHVibGljIGV4cG9uZW50XHJcblx0dmFyIG4gPSByZWFkTVBJbnQoZGVyLCAnbW9kdWx1cycpO1xyXG5cdHZhciBlID0gcmVhZE1QSW50KGRlciwgJ3B1YmxpYyBleHBvbmVudCcpO1xyXG5cdHZhciBkID0gcmVhZE1QSW50KGRlciwgJ3ByaXZhdGUgZXhwb25lbnQnKTtcclxuXHR2YXIgcCA9IHJlYWRNUEludChkZXIsICdwcmltZTEnKTtcclxuXHR2YXIgcSA9IHJlYWRNUEludChkZXIsICdwcmltZTInKTtcclxuXHR2YXIgZG1vZHAgPSByZWFkTVBJbnQoZGVyLCAnZXhwb25lbnQxJyk7XHJcblx0dmFyIGRtb2RxID0gcmVhZE1QSW50KGRlciwgJ2V4cG9uZW50MicpO1xyXG5cdHZhciBpcW1wID0gcmVhZE1QSW50KGRlciwgJ2lxbXAnKTtcclxuXHJcblx0Ly8gbm93LCBtYWtlIHRoZSBrZXlcclxuXHR2YXIga2V5ID0ge1xyXG5cdFx0dHlwZTogJ3JzYScsXHJcblx0XHRwYXJ0czogW1xyXG5cdFx0XHR7IG5hbWU6ICduJywgZGF0YTogbiB9LFxyXG5cdFx0XHR7IG5hbWU6ICdlJywgZGF0YTogZSB9LFxyXG5cdFx0XHR7IG5hbWU6ICdkJywgZGF0YTogZCB9LFxyXG5cdFx0XHR7IG5hbWU6ICdpcW1wJywgZGF0YTogaXFtcCB9LFxyXG5cdFx0XHR7IG5hbWU6ICdwJywgZGF0YTogcCB9LFxyXG5cdFx0XHR7IG5hbWU6ICdxJywgZGF0YTogcSB9LFxyXG5cdFx0XHR7IG5hbWU6ICdkbW9kcCcsIGRhdGE6IGRtb2RwIH0sXHJcblx0XHRcdHsgbmFtZTogJ2Rtb2RxJywgZGF0YTogZG1vZHEgfVxyXG5cdFx0XVxyXG5cdH07XHJcblxyXG5cdHJldHVybiAobmV3IFByaXZhdGVLZXkoa2V5KSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlYWRQa2NzMURTQVByaXZhdGUoZGVyKSB7XHJcblx0dmFyIHZlcnNpb24gPSByZWFkTVBJbnQoZGVyLCAndmVyc2lvbicpO1xyXG5cdGFzc2VydC5zdHJpY3RFcXVhbCh2ZXJzaW9uLnJlYWRVSW50OCgwKSwgMCk7XHJcblxyXG5cdHZhciBwID0gcmVhZE1QSW50KGRlciwgJ3AnKTtcclxuXHR2YXIgcSA9IHJlYWRNUEludChkZXIsICdxJyk7XHJcblx0dmFyIGcgPSByZWFkTVBJbnQoZGVyLCAnZycpO1xyXG5cdHZhciB5ID0gcmVhZE1QSW50KGRlciwgJ3knKTtcclxuXHR2YXIgeCA9IHJlYWRNUEludChkZXIsICd4Jyk7XHJcblxyXG5cdC8vIG5vdywgbWFrZSB0aGUga2V5XHJcblx0dmFyIGtleSA9IHtcclxuXHRcdHR5cGU6ICdkc2EnLFxyXG5cdFx0cGFydHM6IFtcclxuXHRcdFx0eyBuYW1lOiAncCcsIGRhdGE6IHAgfSxcclxuXHRcdFx0eyBuYW1lOiAncScsIGRhdGE6IHEgfSxcclxuXHRcdFx0eyBuYW1lOiAnZycsIGRhdGE6IGcgfSxcclxuXHRcdFx0eyBuYW1lOiAneScsIGRhdGE6IHkgfSxcclxuXHRcdFx0eyBuYW1lOiAneCcsIGRhdGE6IHggfVxyXG5cdFx0XVxyXG5cdH07XHJcblxyXG5cdHJldHVybiAobmV3IFByaXZhdGVLZXkoa2V5KSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlYWRQa2NzMUVkRFNBUHJpdmF0ZShkZXIpIHtcclxuXHR2YXIgdmVyc2lvbiA9IHJlYWRNUEludChkZXIsICd2ZXJzaW9uJyk7XHJcblx0YXNzZXJ0LnN0cmljdEVxdWFsKHZlcnNpb24ucmVhZFVJbnQ4KDApLCAxKTtcclxuXHJcblx0Ly8gcHJpdmF0ZSBrZXlcclxuXHR2YXIgayA9IGRlci5yZWFkU3RyaW5nKGFzbjEuQmVyLk9jdGV0U3RyaW5nLCB0cnVlKTtcclxuXHJcblx0ZGVyLnJlYWRTZXF1ZW5jZSgweGEwKTtcclxuXHR2YXIgb2lkID0gZGVyLnJlYWRPSUQoKTtcclxuXHRhc3NlcnQuc3RyaWN0RXF1YWwob2lkLCAnMS4zLjEwMS4xMTInLCAndGhlIGVkMjU1MTkgY3VydmUgaWRlbnRpZmllcicpO1xyXG5cclxuXHRkZXIucmVhZFNlcXVlbmNlKDB4YTEpO1xyXG5cdHZhciBBID0gdXRpbHMucmVhZEJpdFN0cmluZyhkZXIpO1xyXG5cclxuXHR2YXIga2V5ID0ge1xyXG5cdFx0dHlwZTogJ2VkMjU1MTknLFxyXG5cdFx0cGFydHM6IFtcclxuXHRcdFx0eyBuYW1lOiAnQScsIGRhdGE6IHV0aWxzLnplcm9QYWRUb0xlbmd0aChBLCAzMikgfSxcclxuXHRcdFx0eyBuYW1lOiAnaycsIGRhdGE6IGsgfVxyXG5cdFx0XVxyXG5cdH07XHJcblxyXG5cdHJldHVybiAobmV3IFByaXZhdGVLZXkoa2V5KSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlYWRQa2NzMURTQVB1YmxpYyhkZXIpIHtcclxuXHR2YXIgeSA9IHJlYWRNUEludChkZXIsICd5Jyk7XHJcblx0dmFyIHAgPSByZWFkTVBJbnQoZGVyLCAncCcpO1xyXG5cdHZhciBxID0gcmVhZE1QSW50KGRlciwgJ3EnKTtcclxuXHR2YXIgZyA9IHJlYWRNUEludChkZXIsICdnJyk7XHJcblxyXG5cdHZhciBrZXkgPSB7XHJcblx0XHR0eXBlOiAnZHNhJyxcclxuXHRcdHBhcnRzOiBbXHJcblx0XHRcdHsgbmFtZTogJ3knLCBkYXRhOiB5IH0sXHJcblx0XHRcdHsgbmFtZTogJ3AnLCBkYXRhOiBwIH0sXHJcblx0XHRcdHsgbmFtZTogJ3EnLCBkYXRhOiBxIH0sXHJcblx0XHRcdHsgbmFtZTogJ2cnLCBkYXRhOiBnIH1cclxuXHRcdF1cclxuXHR9O1xyXG5cclxuXHRyZXR1cm4gKG5ldyBLZXkoa2V5KSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlYWRQa2NzMUVDRFNBUHVibGljKGRlcikge1xyXG5cdGRlci5yZWFkU2VxdWVuY2UoKTtcclxuXHJcblx0dmFyIG9pZCA9IGRlci5yZWFkT0lEKCk7XHJcblx0YXNzZXJ0LnN0cmljdEVxdWFsKG9pZCwgJzEuMi44NDAuMTAwNDUuMi4xJywgJ211c3QgYmUgZWNQdWJsaWNLZXknKTtcclxuXHJcblx0dmFyIGN1cnZlT2lkID0gZGVyLnJlYWRPSUQoKTtcclxuXHJcblx0dmFyIGN1cnZlO1xyXG5cdHZhciBjdXJ2ZXMgPSBPYmplY3Qua2V5cyhhbGdzLmN1cnZlcyk7XHJcblx0Zm9yICh2YXIgaiA9IDA7IGogPCBjdXJ2ZXMubGVuZ3RoOyArK2opIHtcclxuXHRcdHZhciBjID0gY3VydmVzW2pdO1xyXG5cdFx0dmFyIGNkID0gYWxncy5jdXJ2ZXNbY107XHJcblx0XHRpZiAoY2QucGtjczhvaWQgPT09IGN1cnZlT2lkKSB7XHJcblx0XHRcdGN1cnZlID0gYztcclxuXHRcdFx0YnJlYWs7XHJcblx0XHR9XHJcblx0fVxyXG5cdGFzc2VydC5zdHJpbmcoY3VydmUsICdhIGtub3duIEVDRFNBIG5hbWVkIGN1cnZlJyk7XHJcblxyXG5cdHZhciBRID0gZGVyLnJlYWRTdHJpbmcoYXNuMS5CZXIuQml0U3RyaW5nLCB0cnVlKTtcclxuXHRRID0gdXRpbHMuZWNOb3JtYWxpemUoUSk7XHJcblxyXG5cdHZhciBrZXkgPSB7XHJcblx0XHR0eXBlOiAnZWNkc2EnLFxyXG5cdFx0cGFydHM6IFtcclxuXHRcdFx0eyBuYW1lOiAnY3VydmUnLCBkYXRhOiBCdWZmZXIuZnJvbShjdXJ2ZSkgfSxcclxuXHRcdFx0eyBuYW1lOiAnUScsIGRhdGE6IFEgfVxyXG5cdFx0XVxyXG5cdH07XHJcblxyXG5cdHJldHVybiAobmV3IEtleShrZXkpKTtcclxufVxyXG5cclxuZnVuY3Rpb24gcmVhZFBrY3MxRUNEU0FQcml2YXRlKGRlcikge1xyXG5cdHZhciB2ZXJzaW9uID0gcmVhZE1QSW50KGRlciwgJ3ZlcnNpb24nKTtcclxuXHRhc3NlcnQuc3RyaWN0RXF1YWwodmVyc2lvbi5yZWFkVUludDgoMCksIDEpO1xyXG5cclxuXHQvLyBwcml2YXRlIGtleVxyXG5cdHZhciBkID0gZGVyLnJlYWRTdHJpbmcoYXNuMS5CZXIuT2N0ZXRTdHJpbmcsIHRydWUpO1xyXG5cclxuXHRkZXIucmVhZFNlcXVlbmNlKDB4YTApO1xyXG5cdHZhciBjdXJ2ZSA9IHJlYWRFQ0RTQUN1cnZlKGRlcik7XHJcblx0YXNzZXJ0LnN0cmluZyhjdXJ2ZSwgJ2Ega25vd24gZWxsaXB0aWMgY3VydmUnKTtcclxuXHJcblx0ZGVyLnJlYWRTZXF1ZW5jZSgweGExKTtcclxuXHR2YXIgUSA9IGRlci5yZWFkU3RyaW5nKGFzbjEuQmVyLkJpdFN0cmluZywgdHJ1ZSk7XHJcblx0USA9IHV0aWxzLmVjTm9ybWFsaXplKFEpO1xyXG5cclxuXHR2YXIga2V5ID0ge1xyXG5cdFx0dHlwZTogJ2VjZHNhJyxcclxuXHRcdHBhcnRzOiBbXHJcblx0XHRcdHsgbmFtZTogJ2N1cnZlJywgZGF0YTogQnVmZmVyLmZyb20oY3VydmUpIH0sXHJcblx0XHRcdHsgbmFtZTogJ1EnLCBkYXRhOiBRIH0sXHJcblx0XHRcdHsgbmFtZTogJ2QnLCBkYXRhOiBkIH1cclxuXHRcdF1cclxuXHR9O1xyXG5cclxuXHRyZXR1cm4gKG5ldyBQcml2YXRlS2V5KGtleSkpO1xyXG59XHJcblxyXG5mdW5jdGlvbiB3cml0ZVBrY3MxKGRlciwga2V5KSB7XHJcblx0ZGVyLnN0YXJ0U2VxdWVuY2UoKTtcclxuXHJcblx0c3dpdGNoIChrZXkudHlwZSkge1xyXG5cdGNhc2UgJ3JzYSc6XHJcblx0XHRpZiAoUHJpdmF0ZUtleS5pc1ByaXZhdGVLZXkoa2V5KSlcclxuXHRcdFx0d3JpdGVQa2NzMVJTQVByaXZhdGUoZGVyLCBrZXkpO1xyXG5cdFx0ZWxzZVxyXG5cdFx0XHR3cml0ZVBrY3MxUlNBUHVibGljKGRlciwga2V5KTtcclxuXHRcdGJyZWFrO1xyXG5cdGNhc2UgJ2RzYSc6XHJcblx0XHRpZiAoUHJpdmF0ZUtleS5pc1ByaXZhdGVLZXkoa2V5KSlcclxuXHRcdFx0d3JpdGVQa2NzMURTQVByaXZhdGUoZGVyLCBrZXkpO1xyXG5cdFx0ZWxzZVxyXG5cdFx0XHR3cml0ZVBrY3MxRFNBUHVibGljKGRlciwga2V5KTtcclxuXHRcdGJyZWFrO1xyXG5cdGNhc2UgJ2VjZHNhJzpcclxuXHRcdGlmIChQcml2YXRlS2V5LmlzUHJpdmF0ZUtleShrZXkpKVxyXG5cdFx0XHR3cml0ZVBrY3MxRUNEU0FQcml2YXRlKGRlciwga2V5KTtcclxuXHRcdGVsc2VcclxuXHRcdFx0d3JpdGVQa2NzMUVDRFNBUHVibGljKGRlciwga2V5KTtcclxuXHRcdGJyZWFrO1xyXG5cdGNhc2UgJ2VkMjU1MTknOlxyXG5cdFx0aWYgKFByaXZhdGVLZXkuaXNQcml2YXRlS2V5KGtleSkpXHJcblx0XHRcdHdyaXRlUGtjczFFZERTQVByaXZhdGUoZGVyLCBrZXkpO1xyXG5cdFx0ZWxzZVxyXG5cdFx0XHR3cml0ZVBrY3MxRWREU0FQdWJsaWMoZGVyLCBrZXkpO1xyXG5cdFx0YnJlYWs7XHJcblx0ZGVmYXVsdDpcclxuXHRcdHRocm93IChuZXcgRXJyb3IoJ1Vua25vd24ga2V5IGFsZ286ICcgKyBrZXkudHlwZSkpO1xyXG5cdH1cclxuXHJcblx0ZGVyLmVuZFNlcXVlbmNlKCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHdyaXRlUGtjczFSU0FQdWJsaWMoZGVyLCBrZXkpIHtcclxuXHRkZXIud3JpdGVCdWZmZXIoa2V5LnBhcnQubi5kYXRhLCBhc24xLkJlci5JbnRlZ2VyKTtcclxuXHRkZXIud3JpdGVCdWZmZXIoa2V5LnBhcnQuZS5kYXRhLCBhc24xLkJlci5JbnRlZ2VyKTtcclxufVxyXG5cclxuZnVuY3Rpb24gd3JpdGVQa2NzMVJTQVByaXZhdGUoZGVyLCBrZXkpIHtcclxuXHR2YXIgdmVyID0gQnVmZmVyLmZyb20oWzBdKTtcclxuXHRkZXIud3JpdGVCdWZmZXIodmVyLCBhc24xLkJlci5JbnRlZ2VyKTtcclxuXHJcblx0ZGVyLndyaXRlQnVmZmVyKGtleS5wYXJ0Lm4uZGF0YSwgYXNuMS5CZXIuSW50ZWdlcik7XHJcblx0ZGVyLndyaXRlQnVmZmVyKGtleS5wYXJ0LmUuZGF0YSwgYXNuMS5CZXIuSW50ZWdlcik7XHJcblx0ZGVyLndyaXRlQnVmZmVyKGtleS5wYXJ0LmQuZGF0YSwgYXNuMS5CZXIuSW50ZWdlcik7XHJcblx0ZGVyLndyaXRlQnVmZmVyKGtleS5wYXJ0LnAuZGF0YSwgYXNuMS5CZXIuSW50ZWdlcik7XHJcblx0ZGVyLndyaXRlQnVmZmVyKGtleS5wYXJ0LnEuZGF0YSwgYXNuMS5CZXIuSW50ZWdlcik7XHJcblx0aWYgKCFrZXkucGFydC5kbW9kcCB8fCAha2V5LnBhcnQuZG1vZHEpXHJcblx0XHR1dGlscy5hZGRSU0FNaXNzaW5nKGtleSk7XHJcblx0ZGVyLndyaXRlQnVmZmVyKGtleS5wYXJ0LmRtb2RwLmRhdGEsIGFzbjEuQmVyLkludGVnZXIpO1xyXG5cdGRlci53cml0ZUJ1ZmZlcihrZXkucGFydC5kbW9kcS5kYXRhLCBhc24xLkJlci5JbnRlZ2VyKTtcclxuXHRkZXIud3JpdGVCdWZmZXIoa2V5LnBhcnQuaXFtcC5kYXRhLCBhc24xLkJlci5JbnRlZ2VyKTtcclxufVxyXG5cclxuZnVuY3Rpb24gd3JpdGVQa2NzMURTQVByaXZhdGUoZGVyLCBrZXkpIHtcclxuXHR2YXIgdmVyID0gQnVmZmVyLmZyb20oWzBdKTtcclxuXHRkZXIud3JpdGVCdWZmZXIodmVyLCBhc24xLkJlci5JbnRlZ2VyKTtcclxuXHJcblx0ZGVyLndyaXRlQnVmZmVyKGtleS5wYXJ0LnAuZGF0YSwgYXNuMS5CZXIuSW50ZWdlcik7XHJcblx0ZGVyLndyaXRlQnVmZmVyKGtleS5wYXJ0LnEuZGF0YSwgYXNuMS5CZXIuSW50ZWdlcik7XHJcblx0ZGVyLndyaXRlQnVmZmVyKGtleS5wYXJ0LmcuZGF0YSwgYXNuMS5CZXIuSW50ZWdlcik7XHJcblx0ZGVyLndyaXRlQnVmZmVyKGtleS5wYXJ0LnkuZGF0YSwgYXNuMS5CZXIuSW50ZWdlcik7XHJcblx0ZGVyLndyaXRlQnVmZmVyKGtleS5wYXJ0LnguZGF0YSwgYXNuMS5CZXIuSW50ZWdlcik7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHdyaXRlUGtjczFEU0FQdWJsaWMoZGVyLCBrZXkpIHtcclxuXHRkZXIud3JpdGVCdWZmZXIoa2V5LnBhcnQueS5kYXRhLCBhc24xLkJlci5JbnRlZ2VyKTtcclxuXHRkZXIud3JpdGVCdWZmZXIoa2V5LnBhcnQucC5kYXRhLCBhc24xLkJlci5JbnRlZ2VyKTtcclxuXHRkZXIud3JpdGVCdWZmZXIoa2V5LnBhcnQucS5kYXRhLCBhc24xLkJlci5JbnRlZ2VyKTtcclxuXHRkZXIud3JpdGVCdWZmZXIoa2V5LnBhcnQuZy5kYXRhLCBhc24xLkJlci5JbnRlZ2VyKTtcclxufVxyXG5cclxuZnVuY3Rpb24gd3JpdGVQa2NzMUVDRFNBUHVibGljKGRlciwga2V5KSB7XHJcblx0ZGVyLnN0YXJ0U2VxdWVuY2UoKTtcclxuXHJcblx0ZGVyLndyaXRlT0lEKCcxLjIuODQwLjEwMDQ1LjIuMScpOyAvKiBlY1B1YmxpY0tleSAqL1xyXG5cdHZhciBjdXJ2ZSA9IGtleS5wYXJ0LmN1cnZlLmRhdGEudG9TdHJpbmcoKTtcclxuXHR2YXIgY3VydmVPaWQgPSBhbGdzLmN1cnZlc1tjdXJ2ZV0ucGtjczhvaWQ7XHJcblx0YXNzZXJ0LnN0cmluZyhjdXJ2ZU9pZCwgJ2Ega25vd24gRUNEU0EgbmFtZWQgY3VydmUnKTtcclxuXHRkZXIud3JpdGVPSUQoY3VydmVPaWQpO1xyXG5cclxuXHRkZXIuZW5kU2VxdWVuY2UoKTtcclxuXHJcblx0dmFyIFEgPSB1dGlscy5lY05vcm1hbGl6ZShrZXkucGFydC5RLmRhdGEsIHRydWUpO1xyXG5cdGRlci53cml0ZUJ1ZmZlcihRLCBhc24xLkJlci5CaXRTdHJpbmcpO1xyXG59XHJcblxyXG5mdW5jdGlvbiB3cml0ZVBrY3MxRUNEU0FQcml2YXRlKGRlciwga2V5KSB7XHJcblx0dmFyIHZlciA9IEJ1ZmZlci5mcm9tKFsxXSk7XHJcblx0ZGVyLndyaXRlQnVmZmVyKHZlciwgYXNuMS5CZXIuSW50ZWdlcik7XHJcblxyXG5cdGRlci53cml0ZUJ1ZmZlcihrZXkucGFydC5kLmRhdGEsIGFzbjEuQmVyLk9jdGV0U3RyaW5nKTtcclxuXHJcblx0ZGVyLnN0YXJ0U2VxdWVuY2UoMHhhMCk7XHJcblx0dmFyIGN1cnZlID0ga2V5LnBhcnQuY3VydmUuZGF0YS50b1N0cmluZygpO1xyXG5cdHZhciBjdXJ2ZU9pZCA9IGFsZ3MuY3VydmVzW2N1cnZlXS5wa2NzOG9pZDtcclxuXHRhc3NlcnQuc3RyaW5nKGN1cnZlT2lkLCAnYSBrbm93biBFQ0RTQSBuYW1lZCBjdXJ2ZScpO1xyXG5cdGRlci53cml0ZU9JRChjdXJ2ZU9pZCk7XHJcblx0ZGVyLmVuZFNlcXVlbmNlKCk7XHJcblxyXG5cdGRlci5zdGFydFNlcXVlbmNlKDB4YTEpO1xyXG5cdHZhciBRID0gdXRpbHMuZWNOb3JtYWxpemUoa2V5LnBhcnQuUS5kYXRhLCB0cnVlKTtcclxuXHRkZXIud3JpdGVCdWZmZXIoUSwgYXNuMS5CZXIuQml0U3RyaW5nKTtcclxuXHRkZXIuZW5kU2VxdWVuY2UoKTtcclxufVxyXG5cclxuZnVuY3Rpb24gd3JpdGVQa2NzMUVkRFNBUHJpdmF0ZShkZXIsIGtleSkge1xyXG5cdHZhciB2ZXIgPSBCdWZmZXIuZnJvbShbMV0pO1xyXG5cdGRlci53cml0ZUJ1ZmZlcih2ZXIsIGFzbjEuQmVyLkludGVnZXIpO1xyXG5cclxuXHRkZXIud3JpdGVCdWZmZXIoa2V5LnBhcnQuay5kYXRhLCBhc24xLkJlci5PY3RldFN0cmluZyk7XHJcblxyXG5cdGRlci5zdGFydFNlcXVlbmNlKDB4YTApO1xyXG5cdGRlci53cml0ZU9JRCgnMS4zLjEwMS4xMTInKTtcclxuXHRkZXIuZW5kU2VxdWVuY2UoKTtcclxuXHJcblx0ZGVyLnN0YXJ0U2VxdWVuY2UoMHhhMSk7XHJcblx0dXRpbHMud3JpdGVCaXRTdHJpbmcoZGVyLCBrZXkucGFydC5BLmRhdGEpO1xyXG5cdGRlci5lbmRTZXF1ZW5jZSgpO1xyXG59XHJcblxyXG5mdW5jdGlvbiB3cml0ZVBrY3MxRWREU0FQdWJsaWMoZGVyLCBrZXkpIHtcclxuXHR0aHJvdyAobmV3IEVycm9yKCdQdWJsaWMga2V5cyBhcmUgbm90IHN1cHBvcnRlZCBmb3IgRWREU0EgUEtDUyMxJykpO1xyXG59XHJcbiIsIi8vIENvcHlyaWdodCAyMDE3IEpveWVudCwgSW5jLlxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcblx0cmVhZDogcmVhZCxcclxuXHR2ZXJpZnk6IHZlcmlmeSxcclxuXHRzaWduOiBzaWduLFxyXG5cdHNpZ25Bc3luYzogc2lnbkFzeW5jLFxyXG5cdHdyaXRlOiB3cml0ZSxcclxuXHJcblx0LyogSW50ZXJuYWwgcHJpdmF0ZSBBUEkgKi9cclxuXHRmcm9tQnVmZmVyOiBmcm9tQnVmZmVyLFxyXG5cdHRvQnVmZmVyOiB0b0J1ZmZlclxyXG59O1xyXG5cclxudmFyIGFzc2VydCA9IHJlcXVpcmUoJ2Fzc2VydC1wbHVzJyk7XHJcbnZhciBTU0hCdWZmZXIgPSByZXF1aXJlKCcuLi9zc2gtYnVmZmVyJyk7XHJcbnZhciBjcnlwdG8gPSByZXF1aXJlKCdjcnlwdG8nKTtcclxudmFyIEJ1ZmZlciA9IHJlcXVpcmUoJ3NhZmVyLWJ1ZmZlcicpLkJ1ZmZlcjtcclxudmFyIGFsZ3MgPSByZXF1aXJlKCcuLi9hbGdzJyk7XHJcbnZhciBLZXkgPSByZXF1aXJlKCcuLi9rZXknKTtcclxudmFyIFByaXZhdGVLZXkgPSByZXF1aXJlKCcuLi9wcml2YXRlLWtleScpO1xyXG52YXIgSWRlbnRpdHkgPSByZXF1aXJlKCcuLi9pZGVudGl0eScpO1xyXG52YXIgcmZjNDI1MyA9IHJlcXVpcmUoJy4vcmZjNDI1MycpO1xyXG52YXIgU2lnbmF0dXJlID0gcmVxdWlyZSgnLi4vc2lnbmF0dXJlJyk7XHJcbnZhciB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWxzJyk7XHJcbnZhciBDZXJ0aWZpY2F0ZSA9IHJlcXVpcmUoJy4uL2NlcnRpZmljYXRlJyk7XHJcblxyXG5mdW5jdGlvbiB2ZXJpZnkoY2VydCwga2V5KSB7XHJcblx0LypcclxuXHQgKiBXZSBhbHdheXMgZ2l2ZSBhbiBpc3N1ZXJLZXksIHNvIGlmIG91ciB2ZXJpZnkoKSBpcyBiZWluZyBjYWxsZWQgdGhlblxyXG5cdCAqIHRoZXJlIHdhcyBubyBzaWduYXR1cmUuIFJldHVybiBmYWxzZS5cclxuXHQgKi9cclxuXHRyZXR1cm4gKGZhbHNlKTtcclxufVxyXG5cclxudmFyIFRZUEVTID0ge1xyXG5cdCd1c2VyJzogMSxcclxuXHQnaG9zdCc6IDJcclxufTtcclxuT2JqZWN0LmtleXMoVFlQRVMpLmZvckVhY2goZnVuY3Rpb24gKGspIHsgVFlQRVNbVFlQRVNba11dID0gazsgfSk7XHJcblxyXG52YXIgRUNEU0FfQUxHTyA9IC9eZWNkc2Etc2hhMi0oW15ALV0rKS1jZXJ0LXYwMUBvcGVuc3NoLmNvbSQvO1xyXG5cclxuZnVuY3Rpb24gcmVhZChidWYsIG9wdGlvbnMpIHtcclxuXHRpZiAoQnVmZmVyLmlzQnVmZmVyKGJ1ZikpXHJcblx0XHRidWYgPSBidWYudG9TdHJpbmcoJ2FzY2lpJyk7XHJcblx0dmFyIHBhcnRzID0gYnVmLnRyaW0oKS5zcGxpdCgvWyBcXHRcXG5dKy9nKTtcclxuXHRpZiAocGFydHMubGVuZ3RoIDwgMiB8fCBwYXJ0cy5sZW5ndGggPiAzKVxyXG5cdFx0dGhyb3cgKG5ldyBFcnJvcignTm90IGEgdmFsaWQgU1NIIGNlcnRpZmljYXRlIGxpbmUnKSk7XHJcblxyXG5cdHZhciBhbGdvID0gcGFydHNbMF07XHJcblx0dmFyIGRhdGEgPSBwYXJ0c1sxXTtcclxuXHJcblx0ZGF0YSA9IEJ1ZmZlci5mcm9tKGRhdGEsICdiYXNlNjQnKTtcclxuXHRyZXR1cm4gKGZyb21CdWZmZXIoZGF0YSwgYWxnbykpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBmcm9tQnVmZmVyKGRhdGEsIGFsZ28sIHBhcnRpYWwpIHtcclxuXHR2YXIgc3NoYnVmID0gbmV3IFNTSEJ1ZmZlcih7IGJ1ZmZlcjogZGF0YSB9KTtcclxuXHR2YXIgaW5uZXJBbGdvID0gc3NoYnVmLnJlYWRTdHJpbmcoKTtcclxuXHRpZiAoYWxnbyAhPT0gdW5kZWZpbmVkICYmIGlubmVyQWxnbyAhPT0gYWxnbylcclxuXHRcdHRocm93IChuZXcgRXJyb3IoJ1NTSCBjZXJ0aWZpY2F0ZSBhbGdvcml0aG0gbWlzbWF0Y2gnKSk7XHJcblx0aWYgKGFsZ28gPT09IHVuZGVmaW5lZClcclxuXHRcdGFsZ28gPSBpbm5lckFsZ287XHJcblxyXG5cdHZhciBjZXJ0ID0ge307XHJcblx0Y2VydC5zaWduYXR1cmVzID0ge307XHJcblx0Y2VydC5zaWduYXR1cmVzLm9wZW5zc2ggPSB7fTtcclxuXHJcblx0Y2VydC5zaWduYXR1cmVzLm9wZW5zc2gubm9uY2UgPSBzc2hidWYucmVhZEJ1ZmZlcigpO1xyXG5cclxuXHR2YXIga2V5ID0ge307XHJcblx0dmFyIHBhcnRzID0gKGtleS5wYXJ0cyA9IFtdKTtcclxuXHRrZXkudHlwZSA9IGdldEFsZyhhbGdvKTtcclxuXHJcblx0dmFyIHBhcnRDb3VudCA9IGFsZ3MuaW5mb1trZXkudHlwZV0ucGFydHMubGVuZ3RoO1xyXG5cdHdoaWxlIChwYXJ0cy5sZW5ndGggPCBwYXJ0Q291bnQpXHJcblx0XHRwYXJ0cy5wdXNoKHNzaGJ1Zi5yZWFkUGFydCgpKTtcclxuXHRhc3NlcnQub2socGFydHMubGVuZ3RoID49IDEsICdrZXkgbXVzdCBoYXZlIGF0IGxlYXN0IG9uZSBwYXJ0Jyk7XHJcblxyXG5cdHZhciBhbGdJbmZvID0gYWxncy5pbmZvW2tleS50eXBlXTtcclxuXHRpZiAoa2V5LnR5cGUgPT09ICdlY2RzYScpIHtcclxuXHRcdHZhciByZXMgPSBFQ0RTQV9BTEdPLmV4ZWMoYWxnbyk7XHJcblx0XHRhc3NlcnQub2socmVzICE9PSBudWxsKTtcclxuXHRcdGFzc2VydC5zdHJpY3RFcXVhbChyZXNbMV0sIHBhcnRzWzBdLmRhdGEudG9TdHJpbmcoKSk7XHJcblx0fVxyXG5cclxuXHRmb3IgKHZhciBpID0gMDsgaSA8IGFsZ0luZm8ucGFydHMubGVuZ3RoOyArK2kpIHtcclxuXHRcdHBhcnRzW2ldLm5hbWUgPSBhbGdJbmZvLnBhcnRzW2ldO1xyXG5cdFx0aWYgKHBhcnRzW2ldLm5hbWUgIT09ICdjdXJ2ZScgJiZcclxuXHRcdCAgICBhbGdJbmZvLm5vcm1hbGl6ZSAhPT0gZmFsc2UpIHtcclxuXHRcdFx0dmFyIHAgPSBwYXJ0c1tpXTtcclxuXHRcdFx0cC5kYXRhID0gdXRpbHMubXBOb3JtYWxpemUocC5kYXRhKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGNlcnQuc3ViamVjdEtleSA9IG5ldyBLZXkoa2V5KTtcclxuXHJcblx0Y2VydC5zZXJpYWwgPSBzc2hidWYucmVhZEludDY0KCk7XHJcblxyXG5cdHZhciB0eXBlID0gVFlQRVNbc3NoYnVmLnJlYWRJbnQoKV07XHJcblx0YXNzZXJ0LnN0cmluZyh0eXBlLCAndmFsaWQgY2VydCB0eXBlJyk7XHJcblxyXG5cdGNlcnQuc2lnbmF0dXJlcy5vcGVuc3NoLmtleUlkID0gc3NoYnVmLnJlYWRTdHJpbmcoKTtcclxuXHJcblx0dmFyIHByaW5jaXBhbHMgPSBbXTtcclxuXHR2YXIgcGJ1ZiA9IHNzaGJ1Zi5yZWFkQnVmZmVyKCk7XHJcblx0dmFyIHBzc2hidWYgPSBuZXcgU1NIQnVmZmVyKHsgYnVmZmVyOiBwYnVmIH0pO1xyXG5cdHdoaWxlICghcHNzaGJ1Zi5hdEVuZCgpKVxyXG5cdFx0cHJpbmNpcGFscy5wdXNoKHBzc2hidWYucmVhZFN0cmluZygpKTtcclxuXHRpZiAocHJpbmNpcGFscy5sZW5ndGggPT09IDApXHJcblx0XHRwcmluY2lwYWxzID0gWycqJ107XHJcblxyXG5cdGNlcnQuc3ViamVjdHMgPSBwcmluY2lwYWxzLm1hcChmdW5jdGlvbiAocHIpIHtcclxuXHRcdGlmICh0eXBlID09PSAndXNlcicpXHJcblx0XHRcdHJldHVybiAoSWRlbnRpdHkuZm9yVXNlcihwcikpO1xyXG5cdFx0ZWxzZSBpZiAodHlwZSA9PT0gJ2hvc3QnKVxyXG5cdFx0XHRyZXR1cm4gKElkZW50aXR5LmZvckhvc3QocHIpKTtcclxuXHRcdHRocm93IChuZXcgRXJyb3IoJ1Vua25vd24gaWRlbnRpdHkgdHlwZSAnICsgdHlwZSkpO1xyXG5cdH0pO1xyXG5cclxuXHRjZXJ0LnZhbGlkRnJvbSA9IGludDY0VG9EYXRlKHNzaGJ1Zi5yZWFkSW50NjQoKSk7XHJcblx0Y2VydC52YWxpZFVudGlsID0gaW50NjRUb0RhdGUoc3NoYnVmLnJlYWRJbnQ2NCgpKTtcclxuXHJcblx0dmFyIGV4dHMgPSBbXTtcclxuXHR2YXIgZXh0YnVmID0gbmV3IFNTSEJ1ZmZlcih7IGJ1ZmZlcjogc3NoYnVmLnJlYWRCdWZmZXIoKSB9KTtcclxuXHR2YXIgZXh0O1xyXG5cdHdoaWxlICghZXh0YnVmLmF0RW5kKCkpIHtcclxuXHRcdGV4dCA9IHsgY3JpdGljYWw6IHRydWUgfTtcclxuXHRcdGV4dC5uYW1lID0gZXh0YnVmLnJlYWRTdHJpbmcoKTtcclxuXHRcdGV4dC5kYXRhID0gZXh0YnVmLnJlYWRCdWZmZXIoKTtcclxuXHRcdGV4dHMucHVzaChleHQpO1xyXG5cdH1cclxuXHRleHRidWYgPSBuZXcgU1NIQnVmZmVyKHsgYnVmZmVyOiBzc2hidWYucmVhZEJ1ZmZlcigpIH0pO1xyXG5cdHdoaWxlICghZXh0YnVmLmF0RW5kKCkpIHtcclxuXHRcdGV4dCA9IHsgY3JpdGljYWw6IGZhbHNlIH07XHJcblx0XHRleHQubmFtZSA9IGV4dGJ1Zi5yZWFkU3RyaW5nKCk7XHJcblx0XHRleHQuZGF0YSA9IGV4dGJ1Zi5yZWFkQnVmZmVyKCk7XHJcblx0XHRleHRzLnB1c2goZXh0KTtcclxuXHR9XHJcblx0Y2VydC5zaWduYXR1cmVzLm9wZW5zc2guZXh0cyA9IGV4dHM7XHJcblxyXG5cdC8qIHJlc2VydmVkICovXHJcblx0c3NoYnVmLnJlYWRCdWZmZXIoKTtcclxuXHJcblx0dmFyIHNpZ25pbmdLZXlCdWYgPSBzc2hidWYucmVhZEJ1ZmZlcigpO1xyXG5cdGNlcnQuaXNzdWVyS2V5ID0gcmZjNDI1My5yZWFkKHNpZ25pbmdLZXlCdWYpO1xyXG5cclxuXHQvKlxyXG5cdCAqIE9wZW5TU0ggY2VydHMgZG9uJ3QgZ2l2ZSB0aGUgaWRlbnRpdHkgb2YgdGhlIGlzc3VlciwganVzdCB0aGVpclxyXG5cdCAqIHB1YmxpYyBrZXkuIFNvLCB3ZSB1c2UgYW4gSWRlbnRpdHkgdGhhdCBtYXRjaGVzIGFueXRoaW5nLiBUaGVcclxuXHQgKiBpc1NpZ25lZEJ5KCkgZnVuY3Rpb24gd2lsbCBsYXRlciB0ZWxsIHlvdSBpZiB0aGUga2V5IG1hdGNoZXMuXHJcblx0ICovXHJcblx0Y2VydC5pc3N1ZXIgPSBJZGVudGl0eS5mb3JIb3N0KCcqKicpO1xyXG5cclxuXHR2YXIgc2lnQnVmID0gc3NoYnVmLnJlYWRCdWZmZXIoKTtcclxuXHRjZXJ0LnNpZ25hdHVyZXMub3BlbnNzaC5zaWduYXR1cmUgPVxyXG5cdCAgICBTaWduYXR1cmUucGFyc2Uoc2lnQnVmLCBjZXJ0Lmlzc3VlcktleS50eXBlLCAnc3NoJyk7XHJcblxyXG5cdGlmIChwYXJ0aWFsICE9PSB1bmRlZmluZWQpIHtcclxuXHRcdHBhcnRpYWwucmVtYWluZGVyID0gc3NoYnVmLnJlbWFpbmRlcigpO1xyXG5cdFx0cGFydGlhbC5jb25zdW1lZCA9IHNzaGJ1Zi5fb2Zmc2V0O1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIChuZXcgQ2VydGlmaWNhdGUoY2VydCkpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBpbnQ2NFRvRGF0ZShidWYpIHtcclxuXHR2YXIgaSA9IGJ1Zi5yZWFkVUludDMyQkUoMCkgKiA0Mjk0OTY3Mjk2O1xyXG5cdGkgKz0gYnVmLnJlYWRVSW50MzJCRSg0KTtcclxuXHR2YXIgZCA9IG5ldyBEYXRlKCk7XHJcblx0ZC5zZXRUaW1lKGkgKiAxMDAwKTtcclxuXHRkLnNvdXJjZUludDY0ID0gYnVmO1xyXG5cdHJldHVybiAoZCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRhdGVUb0ludDY0KGRhdGUpIHtcclxuXHRpZiAoZGF0ZS5zb3VyY2VJbnQ2NCAhPT0gdW5kZWZpbmVkKVxyXG5cdFx0cmV0dXJuIChkYXRlLnNvdXJjZUludDY0KTtcclxuXHR2YXIgaSA9IE1hdGgucm91bmQoZGF0ZS5nZXRUaW1lKCkgLyAxMDAwKTtcclxuXHR2YXIgdXBwZXIgPSBNYXRoLmZsb29yKGkgLyA0Mjk0OTY3Mjk2KTtcclxuXHR2YXIgbG93ZXIgPSBNYXRoLmZsb29yKGkgJSA0Mjk0OTY3Mjk2KTtcclxuXHR2YXIgYnVmID0gQnVmZmVyLmFsbG9jKDgpO1xyXG5cdGJ1Zi53cml0ZVVJbnQzMkJFKHVwcGVyLCAwKTtcclxuXHRidWYud3JpdGVVSW50MzJCRShsb3dlciwgNCk7XHJcblx0cmV0dXJuIChidWYpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBzaWduKGNlcnQsIGtleSkge1xyXG5cdGlmIChjZXJ0LnNpZ25hdHVyZXMub3BlbnNzaCA9PT0gdW5kZWZpbmVkKVxyXG5cdFx0Y2VydC5zaWduYXR1cmVzLm9wZW5zc2ggPSB7fTtcclxuXHR0cnkge1xyXG5cdFx0dmFyIGJsb2IgPSB0b0J1ZmZlcihjZXJ0LCB0cnVlKTtcclxuXHR9IGNhdGNoIChlKSB7XHJcblx0XHRkZWxldGUgKGNlcnQuc2lnbmF0dXJlcy5vcGVuc3NoKTtcclxuXHRcdHJldHVybiAoZmFsc2UpO1xyXG5cdH1cclxuXHR2YXIgc2lnID0gY2VydC5zaWduYXR1cmVzLm9wZW5zc2g7XHJcblx0dmFyIGhhc2hBbGdvID0gdW5kZWZpbmVkO1xyXG5cdGlmIChrZXkudHlwZSA9PT0gJ3JzYScgfHwga2V5LnR5cGUgPT09ICdkc2EnKVxyXG5cdFx0aGFzaEFsZ28gPSAnc2hhMSc7XHJcblx0dmFyIHNpZ25lciA9IGtleS5jcmVhdGVTaWduKGhhc2hBbGdvKTtcclxuXHRzaWduZXIud3JpdGUoYmxvYik7XHJcblx0c2lnLnNpZ25hdHVyZSA9IHNpZ25lci5zaWduKCk7XHJcblx0cmV0dXJuICh0cnVlKTtcclxufVxyXG5cclxuZnVuY3Rpb24gc2lnbkFzeW5jKGNlcnQsIHNpZ25lciwgZG9uZSkge1xyXG5cdGlmIChjZXJ0LnNpZ25hdHVyZXMub3BlbnNzaCA9PT0gdW5kZWZpbmVkKVxyXG5cdFx0Y2VydC5zaWduYXR1cmVzLm9wZW5zc2ggPSB7fTtcclxuXHR0cnkge1xyXG5cdFx0dmFyIGJsb2IgPSB0b0J1ZmZlcihjZXJ0LCB0cnVlKTtcclxuXHR9IGNhdGNoIChlKSB7XHJcblx0XHRkZWxldGUgKGNlcnQuc2lnbmF0dXJlcy5vcGVuc3NoKTtcclxuXHRcdGRvbmUoZSk7XHJcblx0XHRyZXR1cm47XHJcblx0fVxyXG5cdHZhciBzaWcgPSBjZXJ0LnNpZ25hdHVyZXMub3BlbnNzaDtcclxuXHJcblx0c2lnbmVyKGJsb2IsIGZ1bmN0aW9uIChlcnIsIHNpZ25hdHVyZSkge1xyXG5cdFx0aWYgKGVycikge1xyXG5cdFx0XHRkb25lKGVycik7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHRcdHRyeSB7XHJcblx0XHRcdC8qXHJcblx0XHRcdCAqIFRoaXMgd2lsbCB0aHJvdyBpZiB0aGUgc2lnbmF0dXJlIGlzbid0IG9mIGFcclxuXHRcdFx0ICogdHlwZS9hbGdvIHRoYXQgY2FuIGJlIHVzZWQgZm9yIFNTSC5cclxuXHRcdFx0ICovXHJcblx0XHRcdHNpZ25hdHVyZS50b0J1ZmZlcignc3NoJyk7XHJcblx0XHR9IGNhdGNoIChlKSB7XHJcblx0XHRcdGRvbmUoZSk7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHRcdHNpZy5zaWduYXR1cmUgPSBzaWduYXR1cmU7XHJcblx0XHRkb25lKCk7XHJcblx0fSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHdyaXRlKGNlcnQsIG9wdGlvbnMpIHtcclxuXHRpZiAob3B0aW9ucyA9PT0gdW5kZWZpbmVkKVxyXG5cdFx0b3B0aW9ucyA9IHt9O1xyXG5cclxuXHR2YXIgYmxvYiA9IHRvQnVmZmVyKGNlcnQpO1xyXG5cdHZhciBvdXQgPSBnZXRDZXJ0VHlwZShjZXJ0LnN1YmplY3RLZXkpICsgJyAnICsgYmxvYi50b1N0cmluZygnYmFzZTY0Jyk7XHJcblx0aWYgKG9wdGlvbnMuY29tbWVudClcclxuXHRcdG91dCA9IG91dCArICcgJyArIG9wdGlvbnMuY29tbWVudDtcclxuXHRyZXR1cm4gKG91dCk7XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiB0b0J1ZmZlcihjZXJ0LCBub1NpZykge1xyXG5cdGFzc2VydC5vYmplY3QoY2VydC5zaWduYXR1cmVzLm9wZW5zc2gsICdzaWduYXR1cmUgZm9yIG9wZW5zc2ggZm9ybWF0Jyk7XHJcblx0dmFyIHNpZyA9IGNlcnQuc2lnbmF0dXJlcy5vcGVuc3NoO1xyXG5cclxuXHRpZiAoc2lnLm5vbmNlID09PSB1bmRlZmluZWQpXHJcblx0XHRzaWcubm9uY2UgPSBjcnlwdG8ucmFuZG9tQnl0ZXMoMTYpO1xyXG5cdHZhciBidWYgPSBuZXcgU1NIQnVmZmVyKHt9KTtcclxuXHRidWYud3JpdGVTdHJpbmcoZ2V0Q2VydFR5cGUoY2VydC5zdWJqZWN0S2V5KSk7XHJcblx0YnVmLndyaXRlQnVmZmVyKHNpZy5ub25jZSk7XHJcblxyXG5cdHZhciBrZXkgPSBjZXJ0LnN1YmplY3RLZXk7XHJcblx0dmFyIGFsZ0luZm8gPSBhbGdzLmluZm9ba2V5LnR5cGVdO1xyXG5cdGFsZ0luZm8ucGFydHMuZm9yRWFjaChmdW5jdGlvbiAocGFydCkge1xyXG5cdFx0YnVmLndyaXRlUGFydChrZXkucGFydFtwYXJ0XSk7XHJcblx0fSk7XHJcblxyXG5cdGJ1Zi53cml0ZUludDY0KGNlcnQuc2VyaWFsKTtcclxuXHJcblx0dmFyIHR5cGUgPSBjZXJ0LnN1YmplY3RzWzBdLnR5cGU7XHJcblx0YXNzZXJ0Lm5vdFN0cmljdEVxdWFsKHR5cGUsICd1bmtub3duJyk7XHJcblx0Y2VydC5zdWJqZWN0cy5mb3JFYWNoKGZ1bmN0aW9uIChpZCkge1xyXG5cdFx0YXNzZXJ0LnN0cmljdEVxdWFsKGlkLnR5cGUsIHR5cGUpO1xyXG5cdH0pO1xyXG5cdHR5cGUgPSBUWVBFU1t0eXBlXTtcclxuXHRidWYud3JpdGVJbnQodHlwZSk7XHJcblxyXG5cdGlmIChzaWcua2V5SWQgPT09IHVuZGVmaW5lZCkge1xyXG5cdFx0c2lnLmtleUlkID0gY2VydC5zdWJqZWN0c1swXS50eXBlICsgJ18nICtcclxuXHRcdCAgICAoY2VydC5zdWJqZWN0c1swXS51aWQgfHwgY2VydC5zdWJqZWN0c1swXS5ob3N0bmFtZSk7XHJcblx0fVxyXG5cdGJ1Zi53cml0ZVN0cmluZyhzaWcua2V5SWQpO1xyXG5cclxuXHR2YXIgc3ViID0gbmV3IFNTSEJ1ZmZlcih7fSk7XHJcblx0Y2VydC5zdWJqZWN0cy5mb3JFYWNoKGZ1bmN0aW9uIChpZCkge1xyXG5cdFx0aWYgKHR5cGUgPT09IFRZUEVTLmhvc3QpXHJcblx0XHRcdHN1Yi53cml0ZVN0cmluZyhpZC5ob3N0bmFtZSk7XHJcblx0XHRlbHNlIGlmICh0eXBlID09PSBUWVBFUy51c2VyKVxyXG5cdFx0XHRzdWIud3JpdGVTdHJpbmcoaWQudWlkKTtcclxuXHR9KTtcclxuXHRidWYud3JpdGVCdWZmZXIoc3ViLnRvQnVmZmVyKCkpO1xyXG5cclxuXHRidWYud3JpdGVJbnQ2NChkYXRlVG9JbnQ2NChjZXJ0LnZhbGlkRnJvbSkpO1xyXG5cdGJ1Zi53cml0ZUludDY0KGRhdGVUb0ludDY0KGNlcnQudmFsaWRVbnRpbCkpO1xyXG5cclxuXHR2YXIgZXh0cyA9IHNpZy5leHRzO1xyXG5cdGlmIChleHRzID09PSB1bmRlZmluZWQpXHJcblx0XHRleHRzID0gW107XHJcblxyXG5cdHZhciBleHRidWYgPSBuZXcgU1NIQnVmZmVyKHt9KTtcclxuXHRleHRzLmZvckVhY2goZnVuY3Rpb24gKGV4dCkge1xyXG5cdFx0aWYgKGV4dC5jcml0aWNhbCAhPT0gdHJ1ZSlcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0ZXh0YnVmLndyaXRlU3RyaW5nKGV4dC5uYW1lKTtcclxuXHRcdGV4dGJ1Zi53cml0ZUJ1ZmZlcihleHQuZGF0YSk7XHJcblx0fSk7XHJcblx0YnVmLndyaXRlQnVmZmVyKGV4dGJ1Zi50b0J1ZmZlcigpKTtcclxuXHJcblx0ZXh0YnVmID0gbmV3IFNTSEJ1ZmZlcih7fSk7XHJcblx0ZXh0cy5mb3JFYWNoKGZ1bmN0aW9uIChleHQpIHtcclxuXHRcdGlmIChleHQuY3JpdGljYWwgPT09IHRydWUpXHJcblx0XHRcdHJldHVybjtcclxuXHRcdGV4dGJ1Zi53cml0ZVN0cmluZyhleHQubmFtZSk7XHJcblx0XHRleHRidWYud3JpdGVCdWZmZXIoZXh0LmRhdGEpO1xyXG5cdH0pO1xyXG5cdGJ1Zi53cml0ZUJ1ZmZlcihleHRidWYudG9CdWZmZXIoKSk7XHJcblxyXG5cdC8qIHJlc2VydmVkICovXHJcblx0YnVmLndyaXRlQnVmZmVyKEJ1ZmZlci5hbGxvYygwKSk7XHJcblxyXG5cdHN1YiA9IHJmYzQyNTMud3JpdGUoY2VydC5pc3N1ZXJLZXkpO1xyXG5cdGJ1Zi53cml0ZUJ1ZmZlcihzdWIpO1xyXG5cclxuXHRpZiAoIW5vU2lnKVxyXG5cdFx0YnVmLndyaXRlQnVmZmVyKHNpZy5zaWduYXR1cmUudG9CdWZmZXIoJ3NzaCcpKTtcclxuXHJcblx0cmV0dXJuIChidWYudG9CdWZmZXIoKSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldEFsZyhjZXJ0VHlwZSkge1xyXG5cdGlmIChjZXJ0VHlwZSA9PT0gJ3NzaC1yc2EtY2VydC12MDFAb3BlbnNzaC5jb20nKVxyXG5cdFx0cmV0dXJuICgncnNhJyk7XHJcblx0aWYgKGNlcnRUeXBlID09PSAnc3NoLWRzcy1jZXJ0LXYwMUBvcGVuc3NoLmNvbScpXHJcblx0XHRyZXR1cm4gKCdkc2EnKTtcclxuXHRpZiAoY2VydFR5cGUubWF0Y2goRUNEU0FfQUxHTykpXHJcblx0XHRyZXR1cm4gKCdlY2RzYScpO1xyXG5cdGlmIChjZXJ0VHlwZSA9PT0gJ3NzaC1lZDI1NTE5LWNlcnQtdjAxQG9wZW5zc2guY29tJylcclxuXHRcdHJldHVybiAoJ2VkMjU1MTknKTtcclxuXHR0aHJvdyAobmV3IEVycm9yKCdVbnN1cHBvcnRlZCBjZXJ0IHR5cGUgJyArIGNlcnRUeXBlKSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldENlcnRUeXBlKGtleSkge1xyXG5cdGlmIChrZXkudHlwZSA9PT0gJ3JzYScpXHJcblx0XHRyZXR1cm4gKCdzc2gtcnNhLWNlcnQtdjAxQG9wZW5zc2guY29tJyk7XHJcblx0aWYgKGtleS50eXBlID09PSAnZHNhJylcclxuXHRcdHJldHVybiAoJ3NzaC1kc3MtY2VydC12MDFAb3BlbnNzaC5jb20nKTtcclxuXHRpZiAoa2V5LnR5cGUgPT09ICdlY2RzYScpXHJcblx0XHRyZXR1cm4gKCdlY2RzYS1zaGEyLScgKyBrZXkuY3VydmUgKyAnLWNlcnQtdjAxQG9wZW5zc2guY29tJyk7XHJcblx0aWYgKGtleS50eXBlID09PSAnZWQyNTUxOScpXHJcblx0XHRyZXR1cm4gKCdzc2gtZWQyNTUxOS1jZXJ0LXYwMUBvcGVuc3NoLmNvbScpO1xyXG5cdHRocm93IChuZXcgRXJyb3IoJ1Vuc3VwcG9ydGVkIGtleSB0eXBlICcgKyBrZXkudHlwZSkpO1xyXG59XHJcbiIsIi8vIENvcHlyaWdodCAyMDE1IEpveWVudCwgSW5jLlxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcblx0cmVhZDogcmVhZCxcclxuXHRyZWFkU1NIUHJpdmF0ZTogcmVhZFNTSFByaXZhdGUsXHJcblx0d3JpdGU6IHdyaXRlXHJcbn07XHJcblxyXG52YXIgYXNzZXJ0ID0gcmVxdWlyZSgnYXNzZXJ0LXBsdXMnKTtcclxudmFyIGFzbjEgPSByZXF1aXJlKCdhc24xJyk7XHJcbnZhciBCdWZmZXIgPSByZXF1aXJlKCdzYWZlci1idWZmZXInKS5CdWZmZXI7XHJcbnZhciBhbGdzID0gcmVxdWlyZSgnLi4vYWxncycpO1xyXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlscycpO1xyXG52YXIgY3J5cHRvID0gcmVxdWlyZSgnY3J5cHRvJyk7XHJcblxyXG52YXIgS2V5ID0gcmVxdWlyZSgnLi4va2V5Jyk7XHJcbnZhciBQcml2YXRlS2V5ID0gcmVxdWlyZSgnLi4vcHJpdmF0ZS1rZXknKTtcclxudmFyIHBlbSA9IHJlcXVpcmUoJy4vcGVtJyk7XHJcbnZhciByZmM0MjUzID0gcmVxdWlyZSgnLi9yZmM0MjUzJyk7XHJcbnZhciBTU0hCdWZmZXIgPSByZXF1aXJlKCcuLi9zc2gtYnVmZmVyJyk7XHJcbnZhciBlcnJvcnMgPSByZXF1aXJlKCcuLi9lcnJvcnMnKTtcclxuXHJcbnZhciBiY3J5cHQ7XHJcblxyXG5mdW5jdGlvbiByZWFkKGJ1Ziwgb3B0aW9ucykge1xyXG5cdHJldHVybiAocGVtLnJlYWQoYnVmLCBvcHRpb25zKSk7XHJcbn1cclxuXHJcbnZhciBNQUdJQyA9ICdvcGVuc3NoLWtleS12MSc7XHJcblxyXG5mdW5jdGlvbiByZWFkU1NIUHJpdmF0ZSh0eXBlLCBidWYsIG9wdGlvbnMpIHtcclxuXHRidWYgPSBuZXcgU1NIQnVmZmVyKHtidWZmZXI6IGJ1Zn0pO1xyXG5cclxuXHR2YXIgbWFnaWMgPSBidWYucmVhZENTdHJpbmcoKTtcclxuXHRhc3NlcnQuc3RyaWN0RXF1YWwobWFnaWMsIE1BR0lDLCAnYmFkIG1hZ2ljIHN0cmluZycpO1xyXG5cclxuXHR2YXIgY2lwaGVyID0gYnVmLnJlYWRTdHJpbmcoKTtcclxuXHR2YXIga2RmID0gYnVmLnJlYWRTdHJpbmcoKTtcclxuXHR2YXIga2RmT3B0cyA9IGJ1Zi5yZWFkQnVmZmVyKCk7XHJcblxyXG5cdHZhciBua2V5cyA9IGJ1Zi5yZWFkSW50KCk7XHJcblx0aWYgKG5rZXlzICE9PSAxKSB7XHJcblx0XHR0aHJvdyAobmV3IEVycm9yKCdPcGVuU1NILWZvcm1hdCBrZXkgZmlsZSBjb250YWlucyAnICtcclxuXHRcdCAgICAnbXVsdGlwbGUga2V5czogdGhpcyBpcyB1bnN1cHBvcnRlZC4nKSk7XHJcblx0fVxyXG5cclxuXHR2YXIgcHViS2V5ID0gYnVmLnJlYWRCdWZmZXIoKTtcclxuXHJcblx0aWYgKHR5cGUgPT09ICdwdWJsaWMnKSB7XHJcblx0XHRhc3NlcnQub2soYnVmLmF0RW5kKCksICdleGNlc3MgYnl0ZXMgbGVmdCBhZnRlciBrZXknKTtcclxuXHRcdHJldHVybiAocmZjNDI1My5yZWFkKHB1YktleSkpO1xyXG5cdH1cclxuXHJcblx0dmFyIHByaXZLZXlCbG9iID0gYnVmLnJlYWRCdWZmZXIoKTtcclxuXHRhc3NlcnQub2soYnVmLmF0RW5kKCksICdleGNlc3MgYnl0ZXMgbGVmdCBhZnRlciBrZXknKTtcclxuXHJcblx0dmFyIGtkZk9wdHNCdWYgPSBuZXcgU1NIQnVmZmVyKHsgYnVmZmVyOiBrZGZPcHRzIH0pO1xyXG5cdHN3aXRjaCAoa2RmKSB7XHJcblx0Y2FzZSAnbm9uZSc6XHJcblx0XHRpZiAoY2lwaGVyICE9PSAnbm9uZScpIHtcclxuXHRcdFx0dGhyb3cgKG5ldyBFcnJvcignT3BlblNTSC1mb3JtYXQga2V5IHVzZXMgS0RGIFwibm9uZVwiICcgK1xyXG5cdFx0XHQgICAgICdidXQgc3BlY2lmaWVzIGEgY2lwaGVyIG90aGVyIHRoYW4gXCJub25lXCInKSk7XHJcblx0XHR9XHJcblx0XHRicmVhaztcclxuXHRjYXNlICdiY3J5cHQnOlxyXG5cdFx0dmFyIHNhbHQgPSBrZGZPcHRzQnVmLnJlYWRCdWZmZXIoKTtcclxuXHRcdHZhciByb3VuZHMgPSBrZGZPcHRzQnVmLnJlYWRJbnQoKTtcclxuXHRcdHZhciBjaW5mID0gdXRpbHMub3BlbnNzaENpcGhlckluZm8oY2lwaGVyKTtcclxuXHRcdGlmIChiY3J5cHQgPT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRiY3J5cHQgPSByZXF1aXJlKCdiY3J5cHQtcGJrZGYnKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAodHlwZW9mIChvcHRpb25zLnBhc3NwaHJhc2UpID09PSAnc3RyaW5nJykge1xyXG5cdFx0XHRvcHRpb25zLnBhc3NwaHJhc2UgPSBCdWZmZXIuZnJvbShvcHRpb25zLnBhc3NwaHJhc2UsXHJcblx0XHRcdCAgICAndXRmLTgnKTtcclxuXHRcdH1cclxuXHRcdGlmICghQnVmZmVyLmlzQnVmZmVyKG9wdGlvbnMucGFzc3BocmFzZSkpIHtcclxuXHRcdFx0dGhyb3cgKG5ldyBlcnJvcnMuS2V5RW5jcnlwdGVkRXJyb3IoXHJcblx0XHRcdCAgICBvcHRpb25zLmZpbGVuYW1lLCAnT3BlblNTSCcpKTtcclxuXHRcdH1cclxuXHJcblx0XHR2YXIgcGFzcyA9IG5ldyBVaW50OEFycmF5KG9wdGlvbnMucGFzc3BocmFzZSk7XHJcblx0XHR2YXIgc2FsdGkgPSBuZXcgVWludDhBcnJheShzYWx0KTtcclxuXHRcdC8qIFVzZSB0aGUgcGJrZGYgdG8gZGVyaXZlIGJvdGggdGhlIGtleSBhbmQgdGhlIElWLiAqL1xyXG5cdFx0dmFyIG91dCA9IG5ldyBVaW50OEFycmF5KGNpbmYua2V5U2l6ZSArIGNpbmYuYmxvY2tTaXplKTtcclxuXHRcdHZhciByZXMgPSBiY3J5cHQucGJrZGYocGFzcywgcGFzcy5sZW5ndGgsIHNhbHRpLCBzYWx0aS5sZW5ndGgsXHJcblx0XHQgICAgb3V0LCBvdXQubGVuZ3RoLCByb3VuZHMpO1xyXG5cdFx0aWYgKHJlcyAhPT0gMCkge1xyXG5cdFx0XHR0aHJvdyAobmV3IEVycm9yKCdiY3J5cHRfcGJrZGYgZnVuY3Rpb24gcmV0dXJuZWQgJyArXHJcblx0XHRcdCAgICAnZmFpbHVyZSwgcGFyYW1ldGVycyBpbnZhbGlkJykpO1xyXG5cdFx0fVxyXG5cdFx0b3V0ID0gQnVmZmVyLmZyb20ob3V0KTtcclxuXHRcdHZhciBja2V5ID0gb3V0LnNsaWNlKDAsIGNpbmYua2V5U2l6ZSk7XHJcblx0XHR2YXIgaXYgPSBvdXQuc2xpY2UoY2luZi5rZXlTaXplLCBjaW5mLmtleVNpemUgKyBjaW5mLmJsb2NrU2l6ZSk7XHJcblx0XHR2YXIgY2lwaGVyU3RyZWFtID0gY3J5cHRvLmNyZWF0ZURlY2lwaGVyaXYoY2luZi5vcGVuc3NsTmFtZSxcclxuXHRcdCAgICBja2V5LCBpdik7XHJcblx0XHRjaXBoZXJTdHJlYW0uc2V0QXV0b1BhZGRpbmcoZmFsc2UpO1xyXG5cdFx0dmFyIGNodW5rLCBjaHVua3MgPSBbXTtcclxuXHRcdGNpcGhlclN0cmVhbS5vbmNlKCdlcnJvcicsIGZ1bmN0aW9uIChlKSB7XHJcblx0XHRcdGlmIChlLnRvU3RyaW5nKCkuaW5kZXhPZignYmFkIGRlY3J5cHQnKSAhPT0gLTEpIHtcclxuXHRcdFx0XHR0aHJvdyAobmV3IEVycm9yKCdJbmNvcnJlY3QgcGFzc3BocmFzZSAnICtcclxuXHRcdFx0XHQgICAgJ3N1cHBsaWVkLCBjb3VsZCBub3QgZGVjcnlwdCBrZXknKSk7XHJcblx0XHRcdH1cclxuXHRcdFx0dGhyb3cgKGUpO1xyXG5cdFx0fSk7XHJcblx0XHRjaXBoZXJTdHJlYW0ud3JpdGUocHJpdktleUJsb2IpO1xyXG5cdFx0Y2lwaGVyU3RyZWFtLmVuZCgpO1xyXG5cdFx0d2hpbGUgKChjaHVuayA9IGNpcGhlclN0cmVhbS5yZWFkKCkpICE9PSBudWxsKVxyXG5cdFx0XHRjaHVua3MucHVzaChjaHVuayk7XHJcblx0XHRwcml2S2V5QmxvYiA9IEJ1ZmZlci5jb25jYXQoY2h1bmtzKTtcclxuXHRcdGJyZWFrO1xyXG5cdGRlZmF1bHQ6XHJcblx0XHR0aHJvdyAobmV3IEVycm9yKFxyXG5cdFx0ICAgICdPcGVuU1NILWZvcm1hdCBrZXkgdXNlcyB1bmtub3duIEtERiBcIicgKyBrZGYgKyAnXCInKSk7XHJcblx0fVxyXG5cclxuXHRidWYgPSBuZXcgU1NIQnVmZmVyKHtidWZmZXI6IHByaXZLZXlCbG9ifSk7XHJcblxyXG5cdHZhciBjaGVja0ludDEgPSBidWYucmVhZEludCgpO1xyXG5cdHZhciBjaGVja0ludDIgPSBidWYucmVhZEludCgpO1xyXG5cdGlmIChjaGVja0ludDEgIT09IGNoZWNrSW50Mikge1xyXG5cdFx0dGhyb3cgKG5ldyBFcnJvcignSW5jb3JyZWN0IHBhc3NwaHJhc2Ugc3VwcGxpZWQsIGNvdWxkIG5vdCAnICtcclxuXHRcdCAgICAnZGVjcnlwdCBrZXknKSk7XHJcblx0fVxyXG5cclxuXHR2YXIgcmV0ID0ge307XHJcblx0dmFyIGtleSA9IHJmYzQyNTMucmVhZEludGVybmFsKHJldCwgJ3ByaXZhdGUnLCBidWYucmVtYWluZGVyKCkpO1xyXG5cclxuXHRidWYuc2tpcChyZXQuY29uc3VtZWQpO1xyXG5cclxuXHR2YXIgY29tbWVudCA9IGJ1Zi5yZWFkU3RyaW5nKCk7XHJcblx0a2V5LmNvbW1lbnQgPSBjb21tZW50O1xyXG5cclxuXHRyZXR1cm4gKGtleSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHdyaXRlKGtleSwgb3B0aW9ucykge1xyXG5cdHZhciBwdWJLZXk7XHJcblx0aWYgKFByaXZhdGVLZXkuaXNQcml2YXRlS2V5KGtleSkpXHJcblx0XHRwdWJLZXkgPSBrZXkudG9QdWJsaWMoKTtcclxuXHRlbHNlXHJcblx0XHRwdWJLZXkgPSBrZXk7XHJcblxyXG5cdHZhciBjaXBoZXIgPSAnbm9uZSc7XHJcblx0dmFyIGtkZiA9ICdub25lJztcclxuXHR2YXIga2Rmb3B0cyA9IEJ1ZmZlci5hbGxvYygwKTtcclxuXHR2YXIgY2luZiA9IHsgYmxvY2tTaXplOiA4IH07XHJcblx0dmFyIHBhc3NwaHJhc2U7XHJcblx0aWYgKG9wdGlvbnMgIT09IHVuZGVmaW5lZCkge1xyXG5cdFx0cGFzc3BocmFzZSA9IG9wdGlvbnMucGFzc3BocmFzZTtcclxuXHRcdGlmICh0eXBlb2YgKHBhc3NwaHJhc2UpID09PSAnc3RyaW5nJylcclxuXHRcdFx0cGFzc3BocmFzZSA9IEJ1ZmZlci5mcm9tKHBhc3NwaHJhc2UsICd1dGYtOCcpO1xyXG5cdFx0aWYgKHBhc3NwaHJhc2UgIT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRhc3NlcnQuYnVmZmVyKHBhc3NwaHJhc2UsICdvcHRpb25zLnBhc3NwaHJhc2UnKTtcclxuXHRcdFx0YXNzZXJ0Lm9wdGlvbmFsU3RyaW5nKG9wdGlvbnMuY2lwaGVyLCAnb3B0aW9ucy5jaXBoZXInKTtcclxuXHRcdFx0Y2lwaGVyID0gb3B0aW9ucy5jaXBoZXI7XHJcblx0XHRcdGlmIChjaXBoZXIgPT09IHVuZGVmaW5lZClcclxuXHRcdFx0XHRjaXBoZXIgPSAnYWVzMTI4LWN0cic7XHJcblx0XHRcdGNpbmYgPSB1dGlscy5vcGVuc3NoQ2lwaGVySW5mbyhjaXBoZXIpO1xyXG5cdFx0XHRrZGYgPSAnYmNyeXB0JztcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHZhciBwcml2QnVmO1xyXG5cdGlmIChQcml2YXRlS2V5LmlzUHJpdmF0ZUtleShrZXkpKSB7XHJcblx0XHRwcml2QnVmID0gbmV3IFNTSEJ1ZmZlcih7fSk7XHJcblx0XHR2YXIgY2hlY2tJbnQgPSBjcnlwdG8ucmFuZG9tQnl0ZXMoNCkucmVhZFVJbnQzMkJFKDApO1xyXG5cdFx0cHJpdkJ1Zi53cml0ZUludChjaGVja0ludCk7XHJcblx0XHRwcml2QnVmLndyaXRlSW50KGNoZWNrSW50KTtcclxuXHRcdHByaXZCdWYud3JpdGUoa2V5LnRvQnVmZmVyKCdyZmM0MjUzJykpO1xyXG5cdFx0cHJpdkJ1Zi53cml0ZVN0cmluZyhrZXkuY29tbWVudCB8fCAnJyk7XHJcblxyXG5cdFx0dmFyIG4gPSAxO1xyXG5cdFx0d2hpbGUgKHByaXZCdWYuX29mZnNldCAlIGNpbmYuYmxvY2tTaXplICE9PSAwKVxyXG5cdFx0XHRwcml2QnVmLndyaXRlQ2hhcihuKyspO1xyXG5cdFx0cHJpdkJ1ZiA9IHByaXZCdWYudG9CdWZmZXIoKTtcclxuXHR9XHJcblxyXG5cdHN3aXRjaCAoa2RmKSB7XHJcblx0Y2FzZSAnbm9uZSc6XHJcblx0XHRicmVhaztcclxuXHRjYXNlICdiY3J5cHQnOlxyXG5cdFx0dmFyIHNhbHQgPSBjcnlwdG8ucmFuZG9tQnl0ZXMoMTYpO1xyXG5cdFx0dmFyIHJvdW5kcyA9IDE2O1xyXG5cdFx0dmFyIGtkZnNzaCA9IG5ldyBTU0hCdWZmZXIoe30pO1xyXG5cdFx0a2Rmc3NoLndyaXRlQnVmZmVyKHNhbHQpO1xyXG5cdFx0a2Rmc3NoLndyaXRlSW50KHJvdW5kcyk7XHJcblx0XHRrZGZvcHRzID0ga2Rmc3NoLnRvQnVmZmVyKCk7XHJcblxyXG5cdFx0aWYgKGJjcnlwdCA9PT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdGJjcnlwdCA9IHJlcXVpcmUoJ2JjcnlwdC1wYmtkZicpO1xyXG5cdFx0fVxyXG5cdFx0dmFyIHBhc3MgPSBuZXcgVWludDhBcnJheShwYXNzcGhyYXNlKTtcclxuXHRcdHZhciBzYWx0aSA9IG5ldyBVaW50OEFycmF5KHNhbHQpO1xyXG5cdFx0LyogVXNlIHRoZSBwYmtkZiB0byBkZXJpdmUgYm90aCB0aGUga2V5IGFuZCB0aGUgSVYuICovXHJcblx0XHR2YXIgb3V0ID0gbmV3IFVpbnQ4QXJyYXkoY2luZi5rZXlTaXplICsgY2luZi5ibG9ja1NpemUpO1xyXG5cdFx0dmFyIHJlcyA9IGJjcnlwdC5wYmtkZihwYXNzLCBwYXNzLmxlbmd0aCwgc2FsdGksIHNhbHRpLmxlbmd0aCxcclxuXHRcdCAgICBvdXQsIG91dC5sZW5ndGgsIHJvdW5kcyk7XHJcblx0XHRpZiAocmVzICE9PSAwKSB7XHJcblx0XHRcdHRocm93IChuZXcgRXJyb3IoJ2JjcnlwdF9wYmtkZiBmdW5jdGlvbiByZXR1cm5lZCAnICtcclxuXHRcdFx0ICAgICdmYWlsdXJlLCBwYXJhbWV0ZXJzIGludmFsaWQnKSk7XHJcblx0XHR9XHJcblx0XHRvdXQgPSBCdWZmZXIuZnJvbShvdXQpO1xyXG5cdFx0dmFyIGNrZXkgPSBvdXQuc2xpY2UoMCwgY2luZi5rZXlTaXplKTtcclxuXHRcdHZhciBpdiA9IG91dC5zbGljZShjaW5mLmtleVNpemUsIGNpbmYua2V5U2l6ZSArIGNpbmYuYmxvY2tTaXplKTtcclxuXHJcblx0XHR2YXIgY2lwaGVyU3RyZWFtID0gY3J5cHRvLmNyZWF0ZUNpcGhlcml2KGNpbmYub3BlbnNzbE5hbWUsXHJcblx0XHQgICAgY2tleSwgaXYpO1xyXG5cdFx0Y2lwaGVyU3RyZWFtLnNldEF1dG9QYWRkaW5nKGZhbHNlKTtcclxuXHRcdHZhciBjaHVuaywgY2h1bmtzID0gW107XHJcblx0XHRjaXBoZXJTdHJlYW0ub25jZSgnZXJyb3InLCBmdW5jdGlvbiAoZSkge1xyXG5cdFx0XHR0aHJvdyAoZSk7XHJcblx0XHR9KTtcclxuXHRcdGNpcGhlclN0cmVhbS53cml0ZShwcml2QnVmKTtcclxuXHRcdGNpcGhlclN0cmVhbS5lbmQoKTtcclxuXHRcdHdoaWxlICgoY2h1bmsgPSBjaXBoZXJTdHJlYW0ucmVhZCgpKSAhPT0gbnVsbClcclxuXHRcdFx0Y2h1bmtzLnB1c2goY2h1bmspO1xyXG5cdFx0cHJpdkJ1ZiA9IEJ1ZmZlci5jb25jYXQoY2h1bmtzKTtcclxuXHRcdGJyZWFrO1xyXG5cdGRlZmF1bHQ6XHJcblx0XHR0aHJvdyAobmV3IEVycm9yKCdVbnN1cHBvcnRlZCBrZGYgJyArIGtkZikpO1xyXG5cdH1cclxuXHJcblx0dmFyIGJ1ZiA9IG5ldyBTU0hCdWZmZXIoe30pO1xyXG5cclxuXHRidWYud3JpdGVDU3RyaW5nKE1BR0lDKTtcclxuXHRidWYud3JpdGVTdHJpbmcoY2lwaGVyKTtcdC8qIGNpcGhlciAqL1xyXG5cdGJ1Zi53cml0ZVN0cmluZyhrZGYpO1x0XHQvKiBrZGYgKi9cclxuXHRidWYud3JpdGVCdWZmZXIoa2Rmb3B0cyk7XHQvKiBrZGZvcHRpb25zICovXHJcblxyXG5cdGJ1Zi53cml0ZUludCgxKTtcdFx0LyogbmtleXMgKi9cclxuXHRidWYud3JpdGVCdWZmZXIocHViS2V5LnRvQnVmZmVyKCdyZmM0MjUzJykpO1xyXG5cclxuXHRpZiAocHJpdkJ1ZilcclxuXHRcdGJ1Zi53cml0ZUJ1ZmZlcihwcml2QnVmKTtcclxuXHJcblx0YnVmID0gYnVmLnRvQnVmZmVyKCk7XHJcblxyXG5cdHZhciBoZWFkZXI7XHJcblx0aWYgKFByaXZhdGVLZXkuaXNQcml2YXRlS2V5KGtleSkpXHJcblx0XHRoZWFkZXIgPSAnT1BFTlNTSCBQUklWQVRFIEtFWSc7XHJcblx0ZWxzZVxyXG5cdFx0aGVhZGVyID0gJ09QRU5TU0ggUFVCTElDIEtFWSc7XHJcblxyXG5cdHZhciB0bXAgPSBidWYudG9TdHJpbmcoJ2Jhc2U2NCcpO1xyXG5cdHZhciBsZW4gPSB0bXAubGVuZ3RoICsgKHRtcC5sZW5ndGggLyA3MCkgK1xyXG5cdCAgICAxOCArIDE2ICsgaGVhZGVyLmxlbmd0aCoyICsgMTA7XHJcblx0YnVmID0gQnVmZmVyLmFsbG9jKGxlbik7XHJcblx0dmFyIG8gPSAwO1xyXG5cdG8gKz0gYnVmLndyaXRlKCctLS0tLUJFR0lOICcgKyBoZWFkZXIgKyAnLS0tLS1cXG4nLCBvKTtcclxuXHRmb3IgKHZhciBpID0gMDsgaSA8IHRtcC5sZW5ndGg7ICkge1xyXG5cdFx0dmFyIGxpbWl0ID0gaSArIDcwO1xyXG5cdFx0aWYgKGxpbWl0ID4gdG1wLmxlbmd0aClcclxuXHRcdFx0bGltaXQgPSB0bXAubGVuZ3RoO1xyXG5cdFx0byArPSBidWYud3JpdGUodG1wLnNsaWNlKGksIGxpbWl0KSwgbyk7XHJcblx0XHRidWZbbysrXSA9IDEwO1xyXG5cdFx0aSA9IGxpbWl0O1xyXG5cdH1cclxuXHRvICs9IGJ1Zi53cml0ZSgnLS0tLS1FTkQgJyArIGhlYWRlciArICctLS0tLVxcbicsIG8pO1xyXG5cclxuXHRyZXR1cm4gKGJ1Zi5zbGljZSgwLCBvKSk7XHJcbn1cclxuIiwiLy8gQ29weXJpZ2h0IDIwMTggSm95ZW50LCBJbmMuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuXHRyZWFkOiByZWFkLFxyXG5cdHdyaXRlOiB3cml0ZVxyXG59O1xyXG5cclxudmFyIGFzc2VydCA9IHJlcXVpcmUoJ2Fzc2VydC1wbHVzJyk7XHJcbnZhciBCdWZmZXIgPSByZXF1aXJlKCdzYWZlci1idWZmZXInKS5CdWZmZXI7XHJcbnZhciB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWxzJyk7XHJcbnZhciBLZXkgPSByZXF1aXJlKCcuLi9rZXknKTtcclxudmFyIFByaXZhdGVLZXkgPSByZXF1aXJlKCcuLi9wcml2YXRlLWtleScpO1xyXG5cclxudmFyIHBlbSA9IHJlcXVpcmUoJy4vcGVtJyk7XHJcbnZhciBzc2ggPSByZXF1aXJlKCcuL3NzaCcpO1xyXG52YXIgcmZjNDI1MyA9IHJlcXVpcmUoJy4vcmZjNDI1MycpO1xyXG52YXIgZG5zc2VjID0gcmVxdWlyZSgnLi9kbnNzZWMnKTtcclxudmFyIHB1dHR5ID0gcmVxdWlyZSgnLi9wdXR0eScpO1xyXG5cclxudmFyIEROU1NFQ19QUklWS0VZX0hFQURFUl9QUkVGSVggPSAnUHJpdmF0ZS1rZXktZm9ybWF0OiB2MSc7XHJcblxyXG5mdW5jdGlvbiByZWFkKGJ1Ziwgb3B0aW9ucykge1xyXG5cdGlmICh0eXBlb2YgKGJ1ZikgPT09ICdzdHJpbmcnKSB7XHJcblx0XHRpZiAoYnVmLnRyaW0oKS5tYXRjaCgvXlstXStbIF0qQkVHSU4vKSlcclxuXHRcdFx0cmV0dXJuIChwZW0ucmVhZChidWYsIG9wdGlvbnMpKTtcclxuXHRcdGlmIChidWYubWF0Y2goL15cXHMqc3NoLVthLXpdLykpXHJcblx0XHRcdHJldHVybiAoc3NoLnJlYWQoYnVmLCBvcHRpb25zKSk7XHJcblx0XHRpZiAoYnVmLm1hdGNoKC9eXFxzKmVjZHNhLS8pKVxyXG5cdFx0XHRyZXR1cm4gKHNzaC5yZWFkKGJ1Ziwgb3B0aW9ucykpO1xyXG5cdFx0aWYgKGJ1Zi5tYXRjaCgvXnB1dHR5LXVzZXIta2V5LWZpbGUtMjovaSkpXHJcblx0XHRcdHJldHVybiAocHV0dHkucmVhZChidWYsIG9wdGlvbnMpKTtcclxuXHRcdGlmIChmaW5kRE5TU0VDSGVhZGVyKGJ1ZikpXHJcblx0XHRcdHJldHVybiAoZG5zc2VjLnJlYWQoYnVmLCBvcHRpb25zKSk7XHJcblx0XHRidWYgPSBCdWZmZXIuZnJvbShidWYsICdiaW5hcnknKTtcclxuXHR9IGVsc2Uge1xyXG5cdFx0YXNzZXJ0LmJ1ZmZlcihidWYpO1xyXG5cdFx0aWYgKGZpbmRQRU1IZWFkZXIoYnVmKSlcclxuXHRcdFx0cmV0dXJuIChwZW0ucmVhZChidWYsIG9wdGlvbnMpKTtcclxuXHRcdGlmIChmaW5kU1NISGVhZGVyKGJ1ZikpXHJcblx0XHRcdHJldHVybiAoc3NoLnJlYWQoYnVmLCBvcHRpb25zKSk7XHJcblx0XHRpZiAoZmluZFB1VFRZSGVhZGVyKGJ1ZikpXHJcblx0XHRcdHJldHVybiAocHV0dHkucmVhZChidWYsIG9wdGlvbnMpKTtcclxuXHRcdGlmIChmaW5kRE5TU0VDSGVhZGVyKGJ1ZikpXHJcblx0XHRcdHJldHVybiAoZG5zc2VjLnJlYWQoYnVmLCBvcHRpb25zKSk7XHJcblx0fVxyXG5cdGlmIChidWYucmVhZFVJbnQzMkJFKDApIDwgYnVmLmxlbmd0aClcclxuXHRcdHJldHVybiAocmZjNDI1My5yZWFkKGJ1Ziwgb3B0aW9ucykpO1xyXG5cdHRocm93IChuZXcgRXJyb3IoJ0ZhaWxlZCB0byBhdXRvLWRldGVjdCBmb3JtYXQgb2Yga2V5JykpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBmaW5kUHVUVFlIZWFkZXIoYnVmKSB7XHJcblx0dmFyIG9mZnNldCA9IDA7XHJcblx0d2hpbGUgKG9mZnNldCA8IGJ1Zi5sZW5ndGggJiZcclxuXHQgICAgKGJ1ZltvZmZzZXRdID09PSAzMiB8fCBidWZbb2Zmc2V0XSA9PT0gMTAgfHwgYnVmW29mZnNldF0gPT09IDkpKVxyXG5cdFx0KytvZmZzZXQ7XHJcblx0aWYgKG9mZnNldCArIDIyIDw9IGJ1Zi5sZW5ndGggJiZcclxuXHQgICAgYnVmLnNsaWNlKG9mZnNldCwgb2Zmc2V0ICsgMjIpLnRvU3RyaW5nKCdhc2NpaScpLnRvTG93ZXJDYXNlKCkgPT09XHJcblx0ICAgICdwdXR0eS11c2VyLWtleS1maWxlLTI6JylcclxuXHRcdHJldHVybiAodHJ1ZSk7XHJcblx0cmV0dXJuIChmYWxzZSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGZpbmRTU0hIZWFkZXIoYnVmKSB7XHJcblx0dmFyIG9mZnNldCA9IDA7XHJcblx0d2hpbGUgKG9mZnNldCA8IGJ1Zi5sZW5ndGggJiZcclxuXHQgICAgKGJ1ZltvZmZzZXRdID09PSAzMiB8fCBidWZbb2Zmc2V0XSA9PT0gMTAgfHwgYnVmW29mZnNldF0gPT09IDkpKVxyXG5cdFx0KytvZmZzZXQ7XHJcblx0aWYgKG9mZnNldCArIDQgPD0gYnVmLmxlbmd0aCAmJlxyXG5cdCAgICBidWYuc2xpY2Uob2Zmc2V0LCBvZmZzZXQgKyA0KS50b1N0cmluZygnYXNjaWknKSA9PT0gJ3NzaC0nKVxyXG5cdFx0cmV0dXJuICh0cnVlKTtcclxuXHRpZiAob2Zmc2V0ICsgNiA8PSBidWYubGVuZ3RoICYmXHJcblx0ICAgIGJ1Zi5zbGljZShvZmZzZXQsIG9mZnNldCArIDYpLnRvU3RyaW5nKCdhc2NpaScpID09PSAnZWNkc2EtJylcclxuXHRcdHJldHVybiAodHJ1ZSk7XHJcblx0cmV0dXJuIChmYWxzZSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGZpbmRQRU1IZWFkZXIoYnVmKSB7XHJcblx0dmFyIG9mZnNldCA9IDA7XHJcblx0d2hpbGUgKG9mZnNldCA8IGJ1Zi5sZW5ndGggJiZcclxuXHQgICAgKGJ1ZltvZmZzZXRdID09PSAzMiB8fCBidWZbb2Zmc2V0XSA9PT0gMTApKVxyXG5cdFx0KytvZmZzZXQ7XHJcblx0aWYgKGJ1ZltvZmZzZXRdICE9PSA0NSlcclxuXHRcdHJldHVybiAoZmFsc2UpO1xyXG5cdHdoaWxlIChvZmZzZXQgPCBidWYubGVuZ3RoICYmXHJcblx0ICAgIChidWZbb2Zmc2V0XSA9PT0gNDUpKVxyXG5cdFx0KytvZmZzZXQ7XHJcblx0d2hpbGUgKG9mZnNldCA8IGJ1Zi5sZW5ndGggJiZcclxuXHQgICAgKGJ1ZltvZmZzZXRdID09PSAzMikpXHJcblx0XHQrK29mZnNldDtcclxuXHRpZiAob2Zmc2V0ICsgNSA+IGJ1Zi5sZW5ndGggfHxcclxuXHQgICAgYnVmLnNsaWNlKG9mZnNldCwgb2Zmc2V0ICsgNSkudG9TdHJpbmcoJ2FzY2lpJykgIT09ICdCRUdJTicpXHJcblx0XHRyZXR1cm4gKGZhbHNlKTtcclxuXHRyZXR1cm4gKHRydWUpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBmaW5kRE5TU0VDSGVhZGVyKGJ1Zikge1xyXG5cdC8vIHByaXZhdGUgY2FzZSBmaXJzdFxyXG5cdGlmIChidWYubGVuZ3RoIDw9IEROU1NFQ19QUklWS0VZX0hFQURFUl9QUkVGSVgubGVuZ3RoKVxyXG5cdFx0cmV0dXJuIChmYWxzZSk7XHJcblx0dmFyIGhlYWRlckNoZWNrID0gYnVmLnNsaWNlKDAsIEROU1NFQ19QUklWS0VZX0hFQURFUl9QUkVGSVgubGVuZ3RoKTtcclxuXHRpZiAoaGVhZGVyQ2hlY2sudG9TdHJpbmcoJ2FzY2lpJykgPT09IEROU1NFQ19QUklWS0VZX0hFQURFUl9QUkVGSVgpXHJcblx0XHRyZXR1cm4gKHRydWUpO1xyXG5cclxuXHQvLyBwdWJsaWMta2V5IFJGQzMxMTAgP1xyXG5cdC8vICdkb21haW4uY29tLiBJTiBLRVkgLi4uJyBvciAnZG9tYWluLmNvbS4gSU4gRE5TS0VZIC4uLidcclxuXHQvLyBza2lwIGFueSBjb21tZW50LWxpbmVzXHJcblx0aWYgKHR5cGVvZiAoYnVmKSAhPT0gJ3N0cmluZycpIHtcclxuXHRcdGJ1ZiA9IGJ1Zi50b1N0cmluZygnYXNjaWknKTtcclxuXHR9XHJcblx0dmFyIGxpbmVzID0gYnVmLnNwbGl0KCdcXG4nKTtcclxuXHR2YXIgbGluZSA9IDA7XHJcblx0LyogSlNTVFlMRUQgKi9cclxuXHR3aGlsZSAobGluZXNbbGluZV0ubWF0Y2goL15cXDsvKSlcclxuXHRcdGxpbmUrKztcclxuXHRpZiAobGluZXNbbGluZV0udG9TdHJpbmcoJ2FzY2lpJykubWF0Y2goL1xcLiBJTiBLRVkgLykpXHJcblx0XHRyZXR1cm4gKHRydWUpO1xyXG5cdGlmIChsaW5lc1tsaW5lXS50b1N0cmluZygnYXNjaWknKS5tYXRjaCgvXFwuIElOIEROU0tFWSAvKSlcclxuXHRcdHJldHVybiAodHJ1ZSk7XHJcblx0cmV0dXJuIChmYWxzZSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHdyaXRlKGtleSwgb3B0aW9ucykge1xyXG5cdHRocm93IChuZXcgRXJyb3IoJ1wiYXV0b1wiIGZvcm1hdCBjYW5ub3QgYmUgdXNlZCBmb3Igd3JpdGluZycpKTtcclxufVxyXG4iLCIvLyBDb3B5cmlnaHQgMjAxNSBKb3llbnQsIEluYy5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG5cdGJ1ZmZlclNwbGl0OiBidWZmZXJTcGxpdCxcclxuXHRhZGRSU0FNaXNzaW5nOiBhZGRSU0FNaXNzaW5nLFxyXG5cdGNhbGN1bGF0ZURTQVB1YmxpYzogY2FsY3VsYXRlRFNBUHVibGljLFxyXG5cdGNhbGN1bGF0ZUVEMjU1MTlQdWJsaWM6IGNhbGN1bGF0ZUVEMjU1MTlQdWJsaWMsXHJcblx0Y2FsY3VsYXRlWDI1NTE5UHVibGljOiBjYWxjdWxhdGVYMjU1MTlQdWJsaWMsXHJcblx0bXBOb3JtYWxpemU6IG1wTm9ybWFsaXplLFxyXG5cdG1wRGVub3JtYWxpemU6IG1wRGVub3JtYWxpemUsXHJcblx0ZWNOb3JtYWxpemU6IGVjTm9ybWFsaXplLFxyXG5cdGNvdW50WmVyb3M6IGNvdW50WmVyb3MsXHJcblx0YXNzZXJ0Q29tcGF0aWJsZTogYXNzZXJ0Q29tcGF0aWJsZSxcclxuXHRpc0NvbXBhdGlibGU6IGlzQ29tcGF0aWJsZSxcclxuXHRvcGVuc3NsS2V5RGVyaXY6IG9wZW5zc2xLZXlEZXJpdixcclxuXHRvcGVuc3NoQ2lwaGVySW5mbzogb3BlbnNzaENpcGhlckluZm8sXHJcblx0cHVibGljRnJvbVByaXZhdGVFQ0RTQTogcHVibGljRnJvbVByaXZhdGVFQ0RTQSxcclxuXHR6ZXJvUGFkVG9MZW5ndGg6IHplcm9QYWRUb0xlbmd0aCxcclxuXHR3cml0ZUJpdFN0cmluZzogd3JpdGVCaXRTdHJpbmcsXHJcblx0cmVhZEJpdFN0cmluZzogcmVhZEJpdFN0cmluZyxcclxuXHRwYmtkZjI6IHBia2RmMlxyXG59O1xyXG5cclxudmFyIGFzc2VydCA9IHJlcXVpcmUoJ2Fzc2VydC1wbHVzJyk7XHJcbnZhciBCdWZmZXIgPSByZXF1aXJlKCdzYWZlci1idWZmZXInKS5CdWZmZXI7XHJcbnZhciBQcml2YXRlS2V5ID0gcmVxdWlyZSgnLi9wcml2YXRlLWtleScpO1xyXG52YXIgS2V5ID0gcmVxdWlyZSgnLi9rZXknKTtcclxudmFyIGNyeXB0byA9IHJlcXVpcmUoJ2NyeXB0bycpO1xyXG52YXIgYWxncyA9IHJlcXVpcmUoJy4vYWxncycpO1xyXG52YXIgYXNuMSA9IHJlcXVpcmUoJ2FzbjEnKTtcclxuXHJcbnZhciBlYyA9IHJlcXVpcmUoJ2VjYy1qc2JuL2xpYi9lYycpO1xyXG52YXIganNibiA9IHJlcXVpcmUoJ2pzYm4nKS5CaWdJbnRlZ2VyO1xyXG52YXIgbmFjbCA9IHJlcXVpcmUoJ3R3ZWV0bmFjbCcpO1xyXG5cclxudmFyIE1BWF9DTEFTU19ERVBUSCA9IDM7XHJcblxyXG5mdW5jdGlvbiBpc0NvbXBhdGlibGUob2JqLCBrbGFzcywgbmVlZFZlcikge1xyXG5cdGlmIChvYmogPT09IG51bGwgfHwgdHlwZW9mIChvYmopICE9PSAnb2JqZWN0JylcclxuXHRcdHJldHVybiAoZmFsc2UpO1xyXG5cdGlmIChuZWVkVmVyID09PSB1bmRlZmluZWQpXHJcblx0XHRuZWVkVmVyID0ga2xhc3MucHJvdG90eXBlLl9zc2hwa0FwaVZlcnNpb247XHJcblx0aWYgKG9iaiBpbnN0YW5jZW9mIGtsYXNzICYmXHJcblx0ICAgIGtsYXNzLnByb3RvdHlwZS5fc3NocGtBcGlWZXJzaW9uWzBdID09IG5lZWRWZXJbMF0pXHJcblx0XHRyZXR1cm4gKHRydWUpO1xyXG5cdHZhciBwcm90byA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihvYmopO1xyXG5cdHZhciBkZXB0aCA9IDA7XHJcblx0d2hpbGUgKHByb3RvLmNvbnN0cnVjdG9yLm5hbWUgIT09IGtsYXNzLm5hbWUpIHtcclxuXHRcdHByb3RvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHByb3RvKTtcclxuXHRcdGlmICghcHJvdG8gfHwgKytkZXB0aCA+IE1BWF9DTEFTU19ERVBUSClcclxuXHRcdFx0cmV0dXJuIChmYWxzZSk7XHJcblx0fVxyXG5cdGlmIChwcm90by5jb25zdHJ1Y3Rvci5uYW1lICE9PSBrbGFzcy5uYW1lKVxyXG5cdFx0cmV0dXJuIChmYWxzZSk7XHJcblx0dmFyIHZlciA9IHByb3RvLl9zc2hwa0FwaVZlcnNpb247XHJcblx0aWYgKHZlciA9PT0gdW5kZWZpbmVkKVxyXG5cdFx0dmVyID0ga2xhc3MuX29sZFZlcnNpb25EZXRlY3Qob2JqKTtcclxuXHRpZiAodmVyWzBdICE9IG5lZWRWZXJbMF0gfHwgdmVyWzFdIDwgbmVlZFZlclsxXSlcclxuXHRcdHJldHVybiAoZmFsc2UpO1xyXG5cdHJldHVybiAodHJ1ZSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGFzc2VydENvbXBhdGlibGUob2JqLCBrbGFzcywgbmVlZFZlciwgbmFtZSkge1xyXG5cdGlmIChuYW1lID09PSB1bmRlZmluZWQpXHJcblx0XHRuYW1lID0gJ29iamVjdCc7XHJcblx0YXNzZXJ0Lm9rKG9iaiwgbmFtZSArICcgbXVzdCBub3QgYmUgbnVsbCcpO1xyXG5cdGFzc2VydC5vYmplY3Qob2JqLCBuYW1lICsgJyBtdXN0IGJlIGFuIG9iamVjdCcpO1xyXG5cdGlmIChuZWVkVmVyID09PSB1bmRlZmluZWQpXHJcblx0XHRuZWVkVmVyID0ga2xhc3MucHJvdG90eXBlLl9zc2hwa0FwaVZlcnNpb247XHJcblx0aWYgKG9iaiBpbnN0YW5jZW9mIGtsYXNzICYmXHJcblx0ICAgIGtsYXNzLnByb3RvdHlwZS5fc3NocGtBcGlWZXJzaW9uWzBdID09IG5lZWRWZXJbMF0pXHJcblx0XHRyZXR1cm47XHJcblx0dmFyIHByb3RvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKG9iaik7XHJcblx0dmFyIGRlcHRoID0gMDtcclxuXHR3aGlsZSAocHJvdG8uY29uc3RydWN0b3IubmFtZSAhPT0ga2xhc3MubmFtZSkge1xyXG5cdFx0cHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YocHJvdG8pO1xyXG5cdFx0YXNzZXJ0Lm9rKHByb3RvICYmICsrZGVwdGggPD0gTUFYX0NMQVNTX0RFUFRILFxyXG5cdFx0ICAgIG5hbWUgKyAnIG11c3QgYmUgYSAnICsga2xhc3MubmFtZSArICcgaW5zdGFuY2UnKTtcclxuXHR9XHJcblx0YXNzZXJ0LnN0cmljdEVxdWFsKHByb3RvLmNvbnN0cnVjdG9yLm5hbWUsIGtsYXNzLm5hbWUsXHJcblx0ICAgIG5hbWUgKyAnIG11c3QgYmUgYSAnICsga2xhc3MubmFtZSArICcgaW5zdGFuY2UnKTtcclxuXHR2YXIgdmVyID0gcHJvdG8uX3NzaHBrQXBpVmVyc2lvbjtcclxuXHRpZiAodmVyID09PSB1bmRlZmluZWQpXHJcblx0XHR2ZXIgPSBrbGFzcy5fb2xkVmVyc2lvbkRldGVjdChvYmopO1xyXG5cdGFzc2VydC5vayh2ZXJbMF0gPT0gbmVlZFZlclswXSAmJiB2ZXJbMV0gPj0gbmVlZFZlclsxXSxcclxuXHQgICAgbmFtZSArICcgbXVzdCBiZSBjb21wYXRpYmxlIHdpdGggJyArIGtsYXNzLm5hbWUgKyAnIGtsYXNzICcgK1xyXG5cdCAgICAndmVyc2lvbiAnICsgbmVlZFZlclswXSArICcuJyArIG5lZWRWZXJbMV0pO1xyXG59XHJcblxyXG52YXIgQ0lQSEVSX0xFTiA9IHtcclxuXHQnZGVzLWVkZTMtY2JjJzogeyBrZXk6IDI0LCBpdjogOCB9LFxyXG5cdCdhZXMtMTI4LWNiYyc6IHsga2V5OiAxNiwgaXY6IDE2IH0sXHJcblx0J2Flcy0yNTYtY2JjJzogeyBrZXk6IDMyLCBpdjogMTYgfVxyXG59O1xyXG52YXIgUEtDUzVfU0FMVF9MRU4gPSA4O1xyXG5cclxuZnVuY3Rpb24gb3BlbnNzbEtleURlcml2KGNpcGhlciwgc2FsdCwgcGFzc3BocmFzZSwgY291bnQpIHtcclxuXHRhc3NlcnQuYnVmZmVyKHNhbHQsICdzYWx0Jyk7XHJcblx0YXNzZXJ0LmJ1ZmZlcihwYXNzcGhyYXNlLCAncGFzc3BocmFzZScpO1xyXG5cdGFzc2VydC5udW1iZXIoY291bnQsICdpdGVyYXRpb24gY291bnQnKTtcclxuXHJcblx0dmFyIGNsZW4gPSBDSVBIRVJfTEVOW2NpcGhlcl07XHJcblx0YXNzZXJ0Lm9iamVjdChjbGVuLCAnc3VwcG9ydGVkIGNpcGhlcicpO1xyXG5cclxuXHRzYWx0ID0gc2FsdC5zbGljZSgwLCBQS0NTNV9TQUxUX0xFTik7XHJcblxyXG5cdHZhciBELCBEX3ByZXYsIGJ1ZnM7XHJcblx0dmFyIG1hdGVyaWFsID0gQnVmZmVyLmFsbG9jKDApO1xyXG5cdHdoaWxlIChtYXRlcmlhbC5sZW5ndGggPCBjbGVuLmtleSArIGNsZW4uaXYpIHtcclxuXHRcdGJ1ZnMgPSBbXTtcclxuXHRcdGlmIChEX3ByZXYpXHJcblx0XHRcdGJ1ZnMucHVzaChEX3ByZXYpO1xyXG5cdFx0YnVmcy5wdXNoKHBhc3NwaHJhc2UpO1xyXG5cdFx0YnVmcy5wdXNoKHNhbHQpO1xyXG5cdFx0RCA9IEJ1ZmZlci5jb25jYXQoYnVmcyk7XHJcblx0XHRmb3IgKHZhciBqID0gMDsgaiA8IGNvdW50OyArK2opXHJcblx0XHRcdEQgPSBjcnlwdG8uY3JlYXRlSGFzaCgnbWQ1JykudXBkYXRlKEQpLmRpZ2VzdCgpO1xyXG5cdFx0bWF0ZXJpYWwgPSBCdWZmZXIuY29uY2F0KFttYXRlcmlhbCwgRF0pO1xyXG5cdFx0RF9wcmV2ID0gRDtcclxuXHR9XHJcblxyXG5cdHJldHVybiAoe1xyXG5cdCAgICBrZXk6IG1hdGVyaWFsLnNsaWNlKDAsIGNsZW4ua2V5KSxcclxuXHQgICAgaXY6IG1hdGVyaWFsLnNsaWNlKGNsZW4ua2V5LCBjbGVuLmtleSArIGNsZW4uaXYpXHJcblx0fSk7XHJcbn1cclxuXHJcbi8qIFNlZTogUkZDMjg5OCAqL1xyXG5mdW5jdGlvbiBwYmtkZjIoaGFzaEFsZywgc2FsdCwgaXRlcmF0aW9ucywgc2l6ZSwgcGFzc3BocmFzZSkge1xyXG5cdHZhciBoa2V5ID0gQnVmZmVyLmFsbG9jKHNhbHQubGVuZ3RoICsgNCk7XHJcblx0c2FsdC5jb3B5KGhrZXkpO1xyXG5cclxuXHR2YXIgZ2VuID0gMCwgdHMgPSBbXTtcclxuXHR2YXIgaSA9IDE7XHJcblx0d2hpbGUgKGdlbiA8IHNpemUpIHtcclxuXHRcdHZhciB0ID0gVChpKyspO1xyXG5cdFx0Z2VuICs9IHQubGVuZ3RoO1xyXG5cdFx0dHMucHVzaCh0KTtcclxuXHR9XHJcblx0cmV0dXJuIChCdWZmZXIuY29uY2F0KHRzKS5zbGljZSgwLCBzaXplKSk7XHJcblxyXG5cdGZ1bmN0aW9uIFQoSSkge1xyXG5cdFx0aGtleS53cml0ZVVJbnQzMkJFKEksIGhrZXkubGVuZ3RoIC0gNCk7XHJcblxyXG5cdFx0dmFyIGhtYWMgPSBjcnlwdG8uY3JlYXRlSG1hYyhoYXNoQWxnLCBwYXNzcGhyYXNlKTtcclxuXHRcdGhtYWMudXBkYXRlKGhrZXkpO1xyXG5cclxuXHRcdHZhciBUaSA9IGhtYWMuZGlnZXN0KCk7XHJcblx0XHR2YXIgVWMgPSBUaTtcclxuXHRcdHZhciBjID0gMTtcclxuXHRcdHdoaWxlIChjKysgPCBpdGVyYXRpb25zKSB7XHJcblx0XHRcdGhtYWMgPSBjcnlwdG8uY3JlYXRlSG1hYyhoYXNoQWxnLCBwYXNzcGhyYXNlKTtcclxuXHRcdFx0aG1hYy51cGRhdGUoVWMpO1xyXG5cdFx0XHRVYyA9IGhtYWMuZGlnZXN0KCk7XHJcblx0XHRcdGZvciAodmFyIHggPSAwOyB4IDwgVGkubGVuZ3RoOyArK3gpXHJcblx0XHRcdFx0VGlbeF0gXj0gVWNbeF07XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gKFRpKTtcclxuXHR9XHJcbn1cclxuXHJcbi8qIENvdW50IGxlYWRpbmcgemVybyBiaXRzIG9uIGEgYnVmZmVyICovXHJcbmZ1bmN0aW9uIGNvdW50WmVyb3MoYnVmKSB7XHJcblx0dmFyIG8gPSAwLCBvYml0ID0gODtcclxuXHR3aGlsZSAobyA8IGJ1Zi5sZW5ndGgpIHtcclxuXHRcdHZhciBtYXNrID0gKDEgPDwgb2JpdCk7XHJcblx0XHRpZiAoKGJ1ZltvXSAmIG1hc2spID09PSBtYXNrKVxyXG5cdFx0XHRicmVhaztcclxuXHRcdG9iaXQtLTtcclxuXHRcdGlmIChvYml0IDwgMCkge1xyXG5cdFx0XHRvKys7XHJcblx0XHRcdG9iaXQgPSA4O1xyXG5cdFx0fVxyXG5cdH1cclxuXHRyZXR1cm4gKG8qOCArICg4IC0gb2JpdCkgLSAxKTtcclxufVxyXG5cclxuZnVuY3Rpb24gYnVmZmVyU3BsaXQoYnVmLCBjaHIpIHtcclxuXHRhc3NlcnQuYnVmZmVyKGJ1Zik7XHJcblx0YXNzZXJ0LnN0cmluZyhjaHIpO1xyXG5cclxuXHR2YXIgcGFydHMgPSBbXTtcclxuXHR2YXIgbGFzdFBhcnQgPSAwO1xyXG5cdHZhciBtYXRjaGVzID0gMDtcclxuXHRmb3IgKHZhciBpID0gMDsgaSA8IGJ1Zi5sZW5ndGg7ICsraSkge1xyXG5cdFx0aWYgKGJ1ZltpXSA9PT0gY2hyLmNoYXJDb2RlQXQobWF0Y2hlcykpXHJcblx0XHRcdCsrbWF0Y2hlcztcclxuXHRcdGVsc2UgaWYgKGJ1ZltpXSA9PT0gY2hyLmNoYXJDb2RlQXQoMCkpXHJcblx0XHRcdG1hdGNoZXMgPSAxO1xyXG5cdFx0ZWxzZVxyXG5cdFx0XHRtYXRjaGVzID0gMDtcclxuXHJcblx0XHRpZiAobWF0Y2hlcyA+PSBjaHIubGVuZ3RoKSB7XHJcblx0XHRcdHZhciBuZXdQYXJ0ID0gaSArIDE7XHJcblx0XHRcdHBhcnRzLnB1c2goYnVmLnNsaWNlKGxhc3RQYXJ0LCBuZXdQYXJ0IC0gbWF0Y2hlcykpO1xyXG5cdFx0XHRsYXN0UGFydCA9IG5ld1BhcnQ7XHJcblx0XHRcdG1hdGNoZXMgPSAwO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRpZiAobGFzdFBhcnQgPD0gYnVmLmxlbmd0aClcclxuXHRcdHBhcnRzLnB1c2goYnVmLnNsaWNlKGxhc3RQYXJ0LCBidWYubGVuZ3RoKSk7XHJcblxyXG5cdHJldHVybiAocGFydHMpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBlY05vcm1hbGl6ZShidWYsIGFkZFplcm8pIHtcclxuXHRhc3NlcnQuYnVmZmVyKGJ1Zik7XHJcblx0aWYgKGJ1ZlswXSA9PT0gMHgwMCAmJiBidWZbMV0gPT09IDB4MDQpIHtcclxuXHRcdGlmIChhZGRaZXJvKVxyXG5cdFx0XHRyZXR1cm4gKGJ1Zik7XHJcblx0XHRyZXR1cm4gKGJ1Zi5zbGljZSgxKSk7XHJcblx0fSBlbHNlIGlmIChidWZbMF0gPT09IDB4MDQpIHtcclxuXHRcdGlmICghYWRkWmVybylcclxuXHRcdFx0cmV0dXJuIChidWYpO1xyXG5cdH0gZWxzZSB7XHJcblx0XHR3aGlsZSAoYnVmWzBdID09PSAweDAwKVxyXG5cdFx0XHRidWYgPSBidWYuc2xpY2UoMSk7XHJcblx0XHRpZiAoYnVmWzBdID09PSAweDAyIHx8IGJ1ZlswXSA9PT0gMHgwMylcclxuXHRcdFx0dGhyb3cgKG5ldyBFcnJvcignQ29tcHJlc3NlZCBlbGxpcHRpYyBjdXJ2ZSBwb2ludHMgJyArXHJcblx0XHRcdCAgICAnYXJlIG5vdCBzdXBwb3J0ZWQnKSk7XHJcblx0XHRpZiAoYnVmWzBdICE9PSAweDA0KVxyXG5cdFx0XHR0aHJvdyAobmV3IEVycm9yKCdOb3QgYSB2YWxpZCBlbGxpcHRpYyBjdXJ2ZSBwb2ludCcpKTtcclxuXHRcdGlmICghYWRkWmVybylcclxuXHRcdFx0cmV0dXJuIChidWYpO1xyXG5cdH1cclxuXHR2YXIgYiA9IEJ1ZmZlci5hbGxvYyhidWYubGVuZ3RoICsgMSk7XHJcblx0YlswXSA9IDB4MDtcclxuXHRidWYuY29weShiLCAxKTtcclxuXHRyZXR1cm4gKGIpO1xyXG59XHJcblxyXG5mdW5jdGlvbiByZWFkQml0U3RyaW5nKGRlciwgdGFnKSB7XHJcblx0aWYgKHRhZyA9PT0gdW5kZWZpbmVkKVxyXG5cdFx0dGFnID0gYXNuMS5CZXIuQml0U3RyaW5nO1xyXG5cdHZhciBidWYgPSBkZXIucmVhZFN0cmluZyh0YWcsIHRydWUpO1xyXG5cdGFzc2VydC5zdHJpY3RFcXVhbChidWZbMF0sIDB4MDAsICdiaXQgc3RyaW5ncyB3aXRoIHVudXNlZCBiaXRzIGFyZSAnICtcclxuXHQgICAgJ25vdCBzdXBwb3J0ZWQgKDB4JyArIGJ1ZlswXS50b1N0cmluZygxNikgKyAnKScpO1xyXG5cdHJldHVybiAoYnVmLnNsaWNlKDEpKTtcclxufVxyXG5cclxuZnVuY3Rpb24gd3JpdGVCaXRTdHJpbmcoZGVyLCBidWYsIHRhZykge1xyXG5cdGlmICh0YWcgPT09IHVuZGVmaW5lZClcclxuXHRcdHRhZyA9IGFzbjEuQmVyLkJpdFN0cmluZztcclxuXHR2YXIgYiA9IEJ1ZmZlci5hbGxvYyhidWYubGVuZ3RoICsgMSk7XHJcblx0YlswXSA9IDB4MDA7XHJcblx0YnVmLmNvcHkoYiwgMSk7XHJcblx0ZGVyLndyaXRlQnVmZmVyKGIsIHRhZyk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG1wTm9ybWFsaXplKGJ1Zikge1xyXG5cdGFzc2VydC5idWZmZXIoYnVmKTtcclxuXHR3aGlsZSAoYnVmLmxlbmd0aCA+IDEgJiYgYnVmWzBdID09PSAweDAwICYmIChidWZbMV0gJiAweDgwKSA9PT0gMHgwMClcclxuXHRcdGJ1ZiA9IGJ1Zi5zbGljZSgxKTtcclxuXHRpZiAoKGJ1ZlswXSAmIDB4ODApID09PSAweDgwKSB7XHJcblx0XHR2YXIgYiA9IEJ1ZmZlci5hbGxvYyhidWYubGVuZ3RoICsgMSk7XHJcblx0XHRiWzBdID0gMHgwMDtcclxuXHRcdGJ1Zi5jb3B5KGIsIDEpO1xyXG5cdFx0YnVmID0gYjtcclxuXHR9XHJcblx0cmV0dXJuIChidWYpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBtcERlbm9ybWFsaXplKGJ1Zikge1xyXG5cdGFzc2VydC5idWZmZXIoYnVmKTtcclxuXHR3aGlsZSAoYnVmLmxlbmd0aCA+IDEgJiYgYnVmWzBdID09PSAweDAwKVxyXG5cdFx0YnVmID0gYnVmLnNsaWNlKDEpO1xyXG5cdHJldHVybiAoYnVmKTtcclxufVxyXG5cclxuZnVuY3Rpb24gemVyb1BhZFRvTGVuZ3RoKGJ1ZiwgbGVuKSB7XHJcblx0YXNzZXJ0LmJ1ZmZlcihidWYpO1xyXG5cdGFzc2VydC5udW1iZXIobGVuKTtcclxuXHR3aGlsZSAoYnVmLmxlbmd0aCA+IGxlbikge1xyXG5cdFx0YXNzZXJ0LmVxdWFsKGJ1ZlswXSwgMHgwMCk7XHJcblx0XHRidWYgPSBidWYuc2xpY2UoMSk7XHJcblx0fVxyXG5cdHdoaWxlIChidWYubGVuZ3RoIDwgbGVuKSB7XHJcblx0XHR2YXIgYiA9IEJ1ZmZlci5hbGxvYyhidWYubGVuZ3RoICsgMSk7XHJcblx0XHRiWzBdID0gMHgwMDtcclxuXHRcdGJ1Zi5jb3B5KGIsIDEpO1xyXG5cdFx0YnVmID0gYjtcclxuXHR9XHJcblx0cmV0dXJuIChidWYpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBiaWdpbnRUb01wQnVmKGJpZ2ludCkge1xyXG5cdHZhciBidWYgPSBCdWZmZXIuZnJvbShiaWdpbnQudG9CeXRlQXJyYXkoKSk7XHJcblx0YnVmID0gbXBOb3JtYWxpemUoYnVmKTtcclxuXHRyZXR1cm4gKGJ1Zik7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNhbGN1bGF0ZURTQVB1YmxpYyhnLCBwLCB4KSB7XHJcblx0YXNzZXJ0LmJ1ZmZlcihnKTtcclxuXHRhc3NlcnQuYnVmZmVyKHApO1xyXG5cdGFzc2VydC5idWZmZXIoeCk7XHJcblx0ZyA9IG5ldyBqc2JuKGcpO1xyXG5cdHAgPSBuZXcganNibihwKTtcclxuXHR4ID0gbmV3IGpzYm4oeCk7XHJcblx0dmFyIHkgPSBnLm1vZFBvdyh4LCBwKTtcclxuXHR2YXIgeWJ1ZiA9IGJpZ2ludFRvTXBCdWYoeSk7XHJcblx0cmV0dXJuICh5YnVmKTtcclxufVxyXG5cclxuZnVuY3Rpb24gY2FsY3VsYXRlRUQyNTUxOVB1YmxpYyhrKSB7XHJcblx0YXNzZXJ0LmJ1ZmZlcihrKTtcclxuXHJcblx0dmFyIGtwID0gbmFjbC5zaWduLmtleVBhaXIuZnJvbVNlZWQobmV3IFVpbnQ4QXJyYXkoaykpO1xyXG5cdHJldHVybiAoQnVmZmVyLmZyb20oa3AucHVibGljS2V5KSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNhbGN1bGF0ZVgyNTUxOVB1YmxpYyhrKSB7XHJcblx0YXNzZXJ0LmJ1ZmZlcihrKTtcclxuXHJcblx0dmFyIGtwID0gbmFjbC5ib3gua2V5UGFpci5mcm9tU2VlZChuZXcgVWludDhBcnJheShrKSk7XHJcblx0cmV0dXJuIChCdWZmZXIuZnJvbShrcC5wdWJsaWNLZXkpKTtcclxufVxyXG5cclxuZnVuY3Rpb24gYWRkUlNBTWlzc2luZyhrZXkpIHtcclxuXHRhc3NlcnQub2JqZWN0KGtleSk7XHJcblx0YXNzZXJ0Q29tcGF0aWJsZShrZXksIFByaXZhdGVLZXksIFsxLCAxXSk7XHJcblxyXG5cdHZhciBkID0gbmV3IGpzYm4oa2V5LnBhcnQuZC5kYXRhKTtcclxuXHR2YXIgYnVmO1xyXG5cclxuXHRpZiAoIWtleS5wYXJ0LmRtb2RwKSB7XHJcblx0XHR2YXIgcCA9IG5ldyBqc2JuKGtleS5wYXJ0LnAuZGF0YSk7XHJcblx0XHR2YXIgZG1vZHAgPSBkLm1vZChwLnN1YnRyYWN0KDEpKTtcclxuXHJcblx0XHRidWYgPSBiaWdpbnRUb01wQnVmKGRtb2RwKTtcclxuXHRcdGtleS5wYXJ0LmRtb2RwID0ge25hbWU6ICdkbW9kcCcsIGRhdGE6IGJ1Zn07XHJcblx0XHRrZXkucGFydHMucHVzaChrZXkucGFydC5kbW9kcCk7XHJcblx0fVxyXG5cdGlmICgha2V5LnBhcnQuZG1vZHEpIHtcclxuXHRcdHZhciBxID0gbmV3IGpzYm4oa2V5LnBhcnQucS5kYXRhKTtcclxuXHRcdHZhciBkbW9kcSA9IGQubW9kKHEuc3VidHJhY3QoMSkpO1xyXG5cclxuXHRcdGJ1ZiA9IGJpZ2ludFRvTXBCdWYoZG1vZHEpO1xyXG5cdFx0a2V5LnBhcnQuZG1vZHEgPSB7bmFtZTogJ2Rtb2RxJywgZGF0YTogYnVmfTtcclxuXHRcdGtleS5wYXJ0cy5wdXNoKGtleS5wYXJ0LmRtb2RxKTtcclxuXHR9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHB1YmxpY0Zyb21Qcml2YXRlRUNEU0EoY3VydmVOYW1lLCBwcml2KSB7XHJcblx0YXNzZXJ0LnN0cmluZyhjdXJ2ZU5hbWUsICdjdXJ2ZU5hbWUnKTtcclxuXHRhc3NlcnQuYnVmZmVyKHByaXYpO1xyXG5cdHZhciBwYXJhbXMgPSBhbGdzLmN1cnZlc1tjdXJ2ZU5hbWVdO1xyXG5cdHZhciBwID0gbmV3IGpzYm4ocGFyYW1zLnApO1xyXG5cdHZhciBhID0gbmV3IGpzYm4ocGFyYW1zLmEpO1xyXG5cdHZhciBiID0gbmV3IGpzYm4ocGFyYW1zLmIpO1xyXG5cdHZhciBjdXJ2ZSA9IG5ldyBlYy5FQ0N1cnZlRnAocCwgYSwgYik7XHJcblx0dmFyIEcgPSBjdXJ2ZS5kZWNvZGVQb2ludEhleChwYXJhbXMuRy50b1N0cmluZygnaGV4JykpO1xyXG5cclxuXHR2YXIgZCA9IG5ldyBqc2JuKG1wTm9ybWFsaXplKHByaXYpKTtcclxuXHR2YXIgcHViID0gRy5tdWx0aXBseShkKTtcclxuXHRwdWIgPSBCdWZmZXIuZnJvbShjdXJ2ZS5lbmNvZGVQb2ludEhleChwdWIpLCAnaGV4Jyk7XHJcblxyXG5cdHZhciBwYXJ0cyA9IFtdO1xyXG5cdHBhcnRzLnB1c2goe25hbWU6ICdjdXJ2ZScsIGRhdGE6IEJ1ZmZlci5mcm9tKGN1cnZlTmFtZSl9KTtcclxuXHRwYXJ0cy5wdXNoKHtuYW1lOiAnUScsIGRhdGE6IHB1Yn0pO1xyXG5cclxuXHR2YXIga2V5ID0gbmV3IEtleSh7dHlwZTogJ2VjZHNhJywgY3VydmU6IGN1cnZlLCBwYXJ0czogcGFydHN9KTtcclxuXHRyZXR1cm4gKGtleSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG9wZW5zc2hDaXBoZXJJbmZvKGNpcGhlcikge1xyXG5cdHZhciBpbmYgPSB7fTtcclxuXHRzd2l0Y2ggKGNpcGhlcikge1xyXG5cdGNhc2UgJzNkZXMtY2JjJzpcclxuXHRcdGluZi5rZXlTaXplID0gMjQ7XHJcblx0XHRpbmYuYmxvY2tTaXplID0gODtcclxuXHRcdGluZi5vcGVuc3NsTmFtZSA9ICdkZXMtZWRlMy1jYmMnO1xyXG5cdFx0YnJlYWs7XHJcblx0Y2FzZSAnYmxvd2Zpc2gtY2JjJzpcclxuXHRcdGluZi5rZXlTaXplID0gMTY7XHJcblx0XHRpbmYuYmxvY2tTaXplID0gODtcclxuXHRcdGluZi5vcGVuc3NsTmFtZSA9ICdiZi1jYmMnO1xyXG5cdFx0YnJlYWs7XHJcblx0Y2FzZSAnYWVzMTI4LWNiYyc6XHJcblx0Y2FzZSAnYWVzMTI4LWN0cic6XHJcblx0Y2FzZSAnYWVzMTI4LWdjbUBvcGVuc3NoLmNvbSc6XHJcblx0XHRpbmYua2V5U2l6ZSA9IDE2O1xyXG5cdFx0aW5mLmJsb2NrU2l6ZSA9IDE2O1xyXG5cdFx0aW5mLm9wZW5zc2xOYW1lID0gJ2Flcy0xMjgtJyArIGNpcGhlci5zbGljZSg3LCAxMCk7XHJcblx0XHRicmVhaztcclxuXHRjYXNlICdhZXMxOTItY2JjJzpcclxuXHRjYXNlICdhZXMxOTItY3RyJzpcclxuXHRjYXNlICdhZXMxOTItZ2NtQG9wZW5zc2guY29tJzpcclxuXHRcdGluZi5rZXlTaXplID0gMjQ7XHJcblx0XHRpbmYuYmxvY2tTaXplID0gMTY7XHJcblx0XHRpbmYub3BlbnNzbE5hbWUgPSAnYWVzLTE5Mi0nICsgY2lwaGVyLnNsaWNlKDcsIDEwKTtcclxuXHRcdGJyZWFrO1xyXG5cdGNhc2UgJ2FlczI1Ni1jYmMnOlxyXG5cdGNhc2UgJ2FlczI1Ni1jdHInOlxyXG5cdGNhc2UgJ2FlczI1Ni1nY21Ab3BlbnNzaC5jb20nOlxyXG5cdFx0aW5mLmtleVNpemUgPSAzMjtcclxuXHRcdGluZi5ibG9ja1NpemUgPSAxNjtcclxuXHRcdGluZi5vcGVuc3NsTmFtZSA9ICdhZXMtMjU2LScgKyBjaXBoZXIuc2xpY2UoNywgMTApO1xyXG5cdFx0YnJlYWs7XHJcblx0ZGVmYXVsdDpcclxuXHRcdHRocm93IChuZXcgRXJyb3IoXHJcblx0XHQgICAgJ1Vuc3VwcG9ydGVkIG9wZW5zc2wgY2lwaGVyIFwiJyArIGNpcGhlciArICdcIicpKTtcclxuXHR9XHJcblx0cmV0dXJuIChpbmYpO1xyXG59XHJcbiIsIi8vIENvcHlyaWdodCAyMDE1IEpveWVudCwgSW5jLlxyXG5cclxudmFyIEtleSA9IHJlcXVpcmUoJy4va2V5Jyk7XHJcbnZhciBGaW5nZXJwcmludCA9IHJlcXVpcmUoJy4vZmluZ2VycHJpbnQnKTtcclxudmFyIFNpZ25hdHVyZSA9IHJlcXVpcmUoJy4vc2lnbmF0dXJlJyk7XHJcbnZhciBQcml2YXRlS2V5ID0gcmVxdWlyZSgnLi9wcml2YXRlLWtleScpO1xyXG52YXIgQ2VydGlmaWNhdGUgPSByZXF1aXJlKCcuL2NlcnRpZmljYXRlJyk7XHJcbnZhciBJZGVudGl0eSA9IHJlcXVpcmUoJy4vaWRlbnRpdHknKTtcclxudmFyIGVycnMgPSByZXF1aXJlKCcuL2Vycm9ycycpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcblx0LyogdG9wLWxldmVsIGNsYXNzZXMgKi9cclxuXHRLZXk6IEtleSxcclxuXHRwYXJzZUtleTogS2V5LnBhcnNlLFxyXG5cdEZpbmdlcnByaW50OiBGaW5nZXJwcmludCxcclxuXHRwYXJzZUZpbmdlcnByaW50OiBGaW5nZXJwcmludC5wYXJzZSxcclxuXHRTaWduYXR1cmU6IFNpZ25hdHVyZSxcclxuXHRwYXJzZVNpZ25hdHVyZTogU2lnbmF0dXJlLnBhcnNlLFxyXG5cdFByaXZhdGVLZXk6IFByaXZhdGVLZXksXHJcblx0cGFyc2VQcml2YXRlS2V5OiBQcml2YXRlS2V5LnBhcnNlLFxyXG5cdGdlbmVyYXRlUHJpdmF0ZUtleTogUHJpdmF0ZUtleS5nZW5lcmF0ZSxcclxuXHRDZXJ0aWZpY2F0ZTogQ2VydGlmaWNhdGUsXHJcblx0cGFyc2VDZXJ0aWZpY2F0ZTogQ2VydGlmaWNhdGUucGFyc2UsXHJcblx0Y3JlYXRlU2VsZlNpZ25lZENlcnRpZmljYXRlOiBDZXJ0aWZpY2F0ZS5jcmVhdGVTZWxmU2lnbmVkLFxyXG5cdGNyZWF0ZUNlcnRpZmljYXRlOiBDZXJ0aWZpY2F0ZS5jcmVhdGUsXHJcblx0SWRlbnRpdHk6IElkZW50aXR5LFxyXG5cdGlkZW50aXR5RnJvbUROOiBJZGVudGl0eS5wYXJzZUROLFxyXG5cdGlkZW50aXR5Rm9ySG9zdDogSWRlbnRpdHkuZm9ySG9zdCxcclxuXHRpZGVudGl0eUZvclVzZXI6IElkZW50aXR5LmZvclVzZXIsXHJcblx0aWRlbnRpdHlGb3JFbWFpbDogSWRlbnRpdHkuZm9yRW1haWwsXHJcblx0aWRlbnRpdHlGcm9tQXJyYXk6IElkZW50aXR5LmZyb21BcnJheSxcclxuXHJcblx0LyogZXJyb3JzICovXHJcblx0RmluZ2VycHJpbnRGb3JtYXRFcnJvcjogZXJycy5GaW5nZXJwcmludEZvcm1hdEVycm9yLFxyXG5cdEludmFsaWRBbGdvcml0aG1FcnJvcjogZXJycy5JbnZhbGlkQWxnb3JpdGhtRXJyb3IsXHJcblx0S2V5UGFyc2VFcnJvcjogZXJycy5LZXlQYXJzZUVycm9yLFxyXG5cdFNpZ25hdHVyZVBhcnNlRXJyb3I6IGVycnMuU2lnbmF0dXJlUGFyc2VFcnJvcixcclxuXHRLZXlFbmNyeXB0ZWRFcnJvcjogZXJycy5LZXlFbmNyeXB0ZWRFcnJvcixcclxuXHRDZXJ0aWZpY2F0ZVBhcnNlRXJyb3I6IGVycnMuQ2VydGlmaWNhdGVQYXJzZUVycm9yXHJcbn07XHJcbiIsIi8vIENvcHlyaWdodCAyMDE2IEpveWVudCwgSW5jLlxyXG5cclxudmFyIHg1MDkgPSByZXF1aXJlKCcuL3g1MDknKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG5cdHJlYWQ6IHJlYWQsXHJcblx0dmVyaWZ5OiB4NTA5LnZlcmlmeSxcclxuXHRzaWduOiB4NTA5LnNpZ24sXHJcblx0d3JpdGU6IHdyaXRlXHJcbn07XHJcblxyXG52YXIgYXNzZXJ0ID0gcmVxdWlyZSgnYXNzZXJ0LXBsdXMnKTtcclxudmFyIGFzbjEgPSByZXF1aXJlKCdhc24xJyk7XHJcbnZhciBCdWZmZXIgPSByZXF1aXJlKCdzYWZlci1idWZmZXInKS5CdWZmZXI7XHJcbnZhciBhbGdzID0gcmVxdWlyZSgnLi4vYWxncycpO1xyXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlscycpO1xyXG52YXIgS2V5ID0gcmVxdWlyZSgnLi4va2V5Jyk7XHJcbnZhciBQcml2YXRlS2V5ID0gcmVxdWlyZSgnLi4vcHJpdmF0ZS1rZXknKTtcclxudmFyIHBlbSA9IHJlcXVpcmUoJy4vcGVtJyk7XHJcbnZhciBJZGVudGl0eSA9IHJlcXVpcmUoJy4uL2lkZW50aXR5Jyk7XHJcbnZhciBTaWduYXR1cmUgPSByZXF1aXJlKCcuLi9zaWduYXR1cmUnKTtcclxudmFyIENlcnRpZmljYXRlID0gcmVxdWlyZSgnLi4vY2VydGlmaWNhdGUnKTtcclxuXHJcbmZ1bmN0aW9uIHJlYWQoYnVmLCBvcHRpb25zKSB7XHJcblx0aWYgKHR5cGVvZiAoYnVmKSAhPT0gJ3N0cmluZycpIHtcclxuXHRcdGFzc2VydC5idWZmZXIoYnVmLCAnYnVmJyk7XHJcblx0XHRidWYgPSBidWYudG9TdHJpbmcoJ2FzY2lpJyk7XHJcblx0fVxyXG5cclxuXHR2YXIgbGluZXMgPSBidWYudHJpbSgpLnNwbGl0KC9bXFxyXFxuXSsvZyk7XHJcblxyXG5cdHZhciBtO1xyXG5cdHZhciBzaSA9IC0xO1xyXG5cdHdoaWxlICghbSAmJiBzaSA8IGxpbmVzLmxlbmd0aCkge1xyXG5cdFx0bSA9IGxpbmVzWysrc2ldLm1hdGNoKC8qSlNTVFlMRUQqL1xyXG5cdFx0ICAgIC9bLV0rWyBdKkJFR0lOIENFUlRJRklDQVRFWyBdKlstXSsvKTtcclxuXHR9XHJcblx0YXNzZXJ0Lm9rKG0sICdpbnZhbGlkIFBFTSBoZWFkZXInKTtcclxuXHJcblx0dmFyIG0yO1xyXG5cdHZhciBlaSA9IGxpbmVzLmxlbmd0aDtcclxuXHR3aGlsZSAoIW0yICYmIGVpID4gMCkge1xyXG5cdFx0bTIgPSBsaW5lc1stLWVpXS5tYXRjaCgvKkpTU1RZTEVEKi9cclxuXHRcdCAgICAvWy1dK1sgXSpFTkQgQ0VSVElGSUNBVEVbIF0qWy1dKy8pO1xyXG5cdH1cclxuXHRhc3NlcnQub2sobTIsICdpbnZhbGlkIFBFTSBmb290ZXInKTtcclxuXHJcblx0bGluZXMgPSBsaW5lcy5zbGljZShzaSwgZWkgKyAxKTtcclxuXHJcblx0dmFyIGhlYWRlcnMgPSB7fTtcclxuXHR3aGlsZSAodHJ1ZSkge1xyXG5cdFx0bGluZXMgPSBsaW5lcy5zbGljZSgxKTtcclxuXHRcdG0gPSBsaW5lc1swXS5tYXRjaCgvKkpTU1RZTEVEKi9cclxuXHRcdCAgICAvXihbQS1aYS16MC05LV0rKTogKC4rKSQvKTtcclxuXHRcdGlmICghbSlcclxuXHRcdFx0YnJlYWs7XHJcblx0XHRoZWFkZXJzW21bMV0udG9Mb3dlckNhc2UoKV0gPSBtWzJdO1xyXG5cdH1cclxuXHJcblx0LyogQ2hvcCBvZmYgdGhlIGZpcnN0IGFuZCBsYXN0IGxpbmVzICovXHJcblx0bGluZXMgPSBsaW5lcy5zbGljZSgwLCAtMSkuam9pbignJyk7XHJcblx0YnVmID0gQnVmZmVyLmZyb20obGluZXMsICdiYXNlNjQnKTtcclxuXHJcblx0cmV0dXJuICh4NTA5LnJlYWQoYnVmLCBvcHRpb25zKSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHdyaXRlKGNlcnQsIG9wdGlvbnMpIHtcclxuXHR2YXIgZGJ1ZiA9IHg1MDkud3JpdGUoY2VydCwgb3B0aW9ucyk7XHJcblxyXG5cdHZhciBoZWFkZXIgPSAnQ0VSVElGSUNBVEUnO1xyXG5cdHZhciB0bXAgPSBkYnVmLnRvU3RyaW5nKCdiYXNlNjQnKTtcclxuXHR2YXIgbGVuID0gdG1wLmxlbmd0aCArICh0bXAubGVuZ3RoIC8gNjQpICtcclxuXHQgICAgMTggKyAxNiArIGhlYWRlci5sZW5ndGgqMiArIDEwO1xyXG5cdHZhciBidWYgPSBCdWZmZXIuYWxsb2MobGVuKTtcclxuXHR2YXIgbyA9IDA7XHJcblx0byArPSBidWYud3JpdGUoJy0tLS0tQkVHSU4gJyArIGhlYWRlciArICctLS0tLVxcbicsIG8pO1xyXG5cdGZvciAodmFyIGkgPSAwOyBpIDwgdG1wLmxlbmd0aDsgKSB7XHJcblx0XHR2YXIgbGltaXQgPSBpICsgNjQ7XHJcblx0XHRpZiAobGltaXQgPiB0bXAubGVuZ3RoKVxyXG5cdFx0XHRsaW1pdCA9IHRtcC5sZW5ndGg7XHJcblx0XHRvICs9IGJ1Zi53cml0ZSh0bXAuc2xpY2UoaSwgbGltaXQpLCBvKTtcclxuXHRcdGJ1ZltvKytdID0gMTA7XHJcblx0XHRpID0gbGltaXQ7XHJcblx0fVxyXG5cdG8gKz0gYnVmLndyaXRlKCctLS0tLUVORCAnICsgaGVhZGVyICsgJy0tLS0tXFxuJywgbyk7XHJcblxyXG5cdHJldHVybiAoYnVmLnNsaWNlKDAsIG8pKTtcclxufVxyXG4iLCIvLyBDb3B5cmlnaHQgMjAxNSBKb3llbnQsIEluYy5cclxuXHJcbnZhciBhc3NlcnQgPSByZXF1aXJlKCdhc3NlcnQtcGx1cycpO1xyXG52YXIgdXRpbCA9IHJlcXVpcmUoJ3V0aWwnKTtcclxuXHJcbmZ1bmN0aW9uIEZpbmdlcnByaW50Rm9ybWF0RXJyb3IoZnAsIGZvcm1hdCkge1xyXG5cdGlmIChFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSlcclxuXHRcdEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKHRoaXMsIEZpbmdlcnByaW50Rm9ybWF0RXJyb3IpO1xyXG5cdHRoaXMubmFtZSA9ICdGaW5nZXJwcmludEZvcm1hdEVycm9yJztcclxuXHR0aGlzLmZpbmdlcnByaW50ID0gZnA7XHJcblx0dGhpcy5mb3JtYXQgPSBmb3JtYXQ7XHJcblx0dGhpcy5tZXNzYWdlID0gJ0ZpbmdlcnByaW50IGZvcm1hdCBpcyBub3Qgc3VwcG9ydGVkLCBvciBpcyBpbnZhbGlkOiAnO1xyXG5cdGlmIChmcCAhPT0gdW5kZWZpbmVkKVxyXG5cdFx0dGhpcy5tZXNzYWdlICs9ICcgZmluZ2VycHJpbnQgPSAnICsgZnA7XHJcblx0aWYgKGZvcm1hdCAhPT0gdW5kZWZpbmVkKVxyXG5cdFx0dGhpcy5tZXNzYWdlICs9ICcgZm9ybWF0ID0gJyArIGZvcm1hdDtcclxufVxyXG51dGlsLmluaGVyaXRzKEZpbmdlcnByaW50Rm9ybWF0RXJyb3IsIEVycm9yKTtcclxuXHJcbmZ1bmN0aW9uIEludmFsaWRBbGdvcml0aG1FcnJvcihhbGcpIHtcclxuXHRpZiAoRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UpXHJcblx0XHRFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSh0aGlzLCBJbnZhbGlkQWxnb3JpdGhtRXJyb3IpO1xyXG5cdHRoaXMubmFtZSA9ICdJbnZhbGlkQWxnb3JpdGhtRXJyb3InO1xyXG5cdHRoaXMuYWxnb3JpdGhtID0gYWxnO1xyXG5cdHRoaXMubWVzc2FnZSA9ICdBbGdvcml0aG0gXCInICsgYWxnICsgJ1wiIGlzIG5vdCBzdXBwb3J0ZWQnO1xyXG59XHJcbnV0aWwuaW5oZXJpdHMoSW52YWxpZEFsZ29yaXRobUVycm9yLCBFcnJvcik7XHJcblxyXG5mdW5jdGlvbiBLZXlQYXJzZUVycm9yKG5hbWUsIGZvcm1hdCwgaW5uZXJFcnIpIHtcclxuXHRpZiAoRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UpXHJcblx0XHRFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSh0aGlzLCBLZXlQYXJzZUVycm9yKTtcclxuXHR0aGlzLm5hbWUgPSAnS2V5UGFyc2VFcnJvcic7XHJcblx0dGhpcy5mb3JtYXQgPSBmb3JtYXQ7XHJcblx0dGhpcy5rZXlOYW1lID0gbmFtZTtcclxuXHR0aGlzLmlubmVyRXJyID0gaW5uZXJFcnI7XHJcblx0dGhpcy5tZXNzYWdlID0gJ0ZhaWxlZCB0byBwYXJzZSAnICsgbmFtZSArICcgYXMgYSB2YWxpZCAnICsgZm9ybWF0ICtcclxuXHQgICAgJyBmb3JtYXQga2V5OiAnICsgaW5uZXJFcnIubWVzc2FnZTtcclxufVxyXG51dGlsLmluaGVyaXRzKEtleVBhcnNlRXJyb3IsIEVycm9yKTtcclxuXHJcbmZ1bmN0aW9uIFNpZ25hdHVyZVBhcnNlRXJyb3IodHlwZSwgZm9ybWF0LCBpbm5lckVycikge1xyXG5cdGlmIChFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSlcclxuXHRcdEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKHRoaXMsIFNpZ25hdHVyZVBhcnNlRXJyb3IpO1xyXG5cdHRoaXMubmFtZSA9ICdTaWduYXR1cmVQYXJzZUVycm9yJztcclxuXHR0aGlzLnR5cGUgPSB0eXBlO1xyXG5cdHRoaXMuZm9ybWF0ID0gZm9ybWF0O1xyXG5cdHRoaXMuaW5uZXJFcnIgPSBpbm5lckVycjtcclxuXHR0aGlzLm1lc3NhZ2UgPSAnRmFpbGVkIHRvIHBhcnNlIHRoZSBnaXZlbiBkYXRhIGFzIGEgJyArIHR5cGUgK1xyXG5cdCAgICAnIHNpZ25hdHVyZSBpbiAnICsgZm9ybWF0ICsgJyBmb3JtYXQ6ICcgKyBpbm5lckVyci5tZXNzYWdlO1xyXG59XHJcbnV0aWwuaW5oZXJpdHMoU2lnbmF0dXJlUGFyc2VFcnJvciwgRXJyb3IpO1xyXG5cclxuZnVuY3Rpb24gQ2VydGlmaWNhdGVQYXJzZUVycm9yKG5hbWUsIGZvcm1hdCwgaW5uZXJFcnIpIHtcclxuXHRpZiAoRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UpXHJcblx0XHRFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSh0aGlzLCBDZXJ0aWZpY2F0ZVBhcnNlRXJyb3IpO1xyXG5cdHRoaXMubmFtZSA9ICdDZXJ0aWZpY2F0ZVBhcnNlRXJyb3InO1xyXG5cdHRoaXMuZm9ybWF0ID0gZm9ybWF0O1xyXG5cdHRoaXMuY2VydE5hbWUgPSBuYW1lO1xyXG5cdHRoaXMuaW5uZXJFcnIgPSBpbm5lckVycjtcclxuXHR0aGlzLm1lc3NhZ2UgPSAnRmFpbGVkIHRvIHBhcnNlICcgKyBuYW1lICsgJyBhcyBhIHZhbGlkICcgKyBmb3JtYXQgK1xyXG5cdCAgICAnIGZvcm1hdCBjZXJ0aWZpY2F0ZTogJyArIGlubmVyRXJyLm1lc3NhZ2U7XHJcbn1cclxudXRpbC5pbmhlcml0cyhDZXJ0aWZpY2F0ZVBhcnNlRXJyb3IsIEVycm9yKTtcclxuXHJcbmZ1bmN0aW9uIEtleUVuY3J5cHRlZEVycm9yKG5hbWUsIGZvcm1hdCkge1xyXG5cdGlmIChFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSlcclxuXHRcdEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKHRoaXMsIEtleUVuY3J5cHRlZEVycm9yKTtcclxuXHR0aGlzLm5hbWUgPSAnS2V5RW5jcnlwdGVkRXJyb3InO1xyXG5cdHRoaXMuZm9ybWF0ID0gZm9ybWF0O1xyXG5cdHRoaXMua2V5TmFtZSA9IG5hbWU7XHJcblx0dGhpcy5tZXNzYWdlID0gJ1RoZSAnICsgZm9ybWF0ICsgJyBmb3JtYXQga2V5ICcgKyBuYW1lICsgJyBpcyAnICtcclxuXHQgICAgJ2VuY3J5cHRlZCAocGFzc3dvcmQtcHJvdGVjdGVkKSwgYW5kIG5vIHBhc3NwaHJhc2Ugd2FzICcgK1xyXG5cdCAgICAncHJvdmlkZWQgaW4gYG9wdGlvbnNgJztcclxufVxyXG51dGlsLmluaGVyaXRzKEtleUVuY3J5cHRlZEVycm9yLCBFcnJvcik7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuXHRGaW5nZXJwcmludEZvcm1hdEVycm9yOiBGaW5nZXJwcmludEZvcm1hdEVycm9yLFxyXG5cdEludmFsaWRBbGdvcml0aG1FcnJvcjogSW52YWxpZEFsZ29yaXRobUVycm9yLFxyXG5cdEtleVBhcnNlRXJyb3I6IEtleVBhcnNlRXJyb3IsXHJcblx0U2lnbmF0dXJlUGFyc2VFcnJvcjogU2lnbmF0dXJlUGFyc2VFcnJvcixcclxuXHRLZXlFbmNyeXB0ZWRFcnJvcjogS2V5RW5jcnlwdGVkRXJyb3IsXHJcblx0Q2VydGlmaWNhdGVQYXJzZUVycm9yOiBDZXJ0aWZpY2F0ZVBhcnNlRXJyb3JcclxufTtcclxuIiwiLy8gQ29weXJpZ2h0IDIwMTcgSm95ZW50LCBJbmMuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuXHRyZWFkOiByZWFkLFxyXG5cdHZlcmlmeTogdmVyaWZ5LFxyXG5cdHNpZ246IHNpZ24sXHJcblx0c2lnbkFzeW5jOiBzaWduQXN5bmMsXHJcblx0d3JpdGU6IHdyaXRlXHJcbn07XHJcblxyXG52YXIgYXNzZXJ0ID0gcmVxdWlyZSgnYXNzZXJ0LXBsdXMnKTtcclxudmFyIGFzbjEgPSByZXF1aXJlKCdhc24xJyk7XHJcbnZhciBCdWZmZXIgPSByZXF1aXJlKCdzYWZlci1idWZmZXInKS5CdWZmZXI7XHJcbnZhciBhbGdzID0gcmVxdWlyZSgnLi4vYWxncycpO1xyXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlscycpO1xyXG52YXIgS2V5ID0gcmVxdWlyZSgnLi4va2V5Jyk7XHJcbnZhciBQcml2YXRlS2V5ID0gcmVxdWlyZSgnLi4vcHJpdmF0ZS1rZXknKTtcclxudmFyIHBlbSA9IHJlcXVpcmUoJy4vcGVtJyk7XHJcbnZhciBJZGVudGl0eSA9IHJlcXVpcmUoJy4uL2lkZW50aXR5Jyk7XHJcbnZhciBTaWduYXR1cmUgPSByZXF1aXJlKCcuLi9zaWduYXR1cmUnKTtcclxudmFyIENlcnRpZmljYXRlID0gcmVxdWlyZSgnLi4vY2VydGlmaWNhdGUnKTtcclxudmFyIHBrY3M4ID0gcmVxdWlyZSgnLi9wa2NzOCcpO1xyXG5cclxuLypcclxuICogVGhpcyBmaWxlIGlzIGJhc2VkIG9uIFJGQzUyODAgKFguNTA5KS5cclxuICovXHJcblxyXG4vKiBIZWxwZXIgdG8gcmVhZCBpbiBhIHNpbmdsZSBtcGludCAqL1xyXG5mdW5jdGlvbiByZWFkTVBJbnQoZGVyLCBubSkge1xyXG5cdGFzc2VydC5zdHJpY3RFcXVhbChkZXIucGVlaygpLCBhc24xLkJlci5JbnRlZ2VyLFxyXG5cdCAgICBubSArICcgaXMgbm90IGFuIEludGVnZXInKTtcclxuXHRyZXR1cm4gKHV0aWxzLm1wTm9ybWFsaXplKGRlci5yZWFkU3RyaW5nKGFzbjEuQmVyLkludGVnZXIsIHRydWUpKSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHZlcmlmeShjZXJ0LCBrZXkpIHtcclxuXHR2YXIgc2lnID0gY2VydC5zaWduYXR1cmVzLng1MDk7XHJcblx0YXNzZXJ0Lm9iamVjdChzaWcsICd4NTA5IHNpZ25hdHVyZScpO1xyXG5cclxuXHR2YXIgYWxnUGFydHMgPSBzaWcuYWxnby5zcGxpdCgnLScpO1xyXG5cdGlmIChhbGdQYXJ0c1swXSAhPT0ga2V5LnR5cGUpXHJcblx0XHRyZXR1cm4gKGZhbHNlKTtcclxuXHJcblx0dmFyIGJsb2IgPSBzaWcuY2FjaGU7XHJcblx0aWYgKGJsb2IgPT09IHVuZGVmaW5lZCkge1xyXG5cdFx0dmFyIGRlciA9IG5ldyBhc24xLkJlcldyaXRlcigpO1xyXG5cdFx0d3JpdGVUQlNDZXJ0KGNlcnQsIGRlcik7XHJcblx0XHRibG9iID0gZGVyLmJ1ZmZlcjtcclxuXHR9XHJcblxyXG5cdHZhciB2ZXJpZmllciA9IGtleS5jcmVhdGVWZXJpZnkoYWxnUGFydHNbMV0pO1xyXG5cdHZlcmlmaWVyLndyaXRlKGJsb2IpO1xyXG5cdHJldHVybiAodmVyaWZpZXIudmVyaWZ5KHNpZy5zaWduYXR1cmUpKTtcclxufVxyXG5cclxuZnVuY3Rpb24gTG9jYWwoaSkge1xyXG5cdHJldHVybiAoYXNuMS5CZXIuQ29udGV4dCB8IGFzbjEuQmVyLkNvbnN0cnVjdG9yIHwgaSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIENvbnRleHQoaSkge1xyXG5cdHJldHVybiAoYXNuMS5CZXIuQ29udGV4dCB8IGkpO1xyXG59XHJcblxyXG52YXIgU0lHTl9BTEdTID0ge1xyXG5cdCdyc2EtbWQ1JzogJzEuMi44NDAuMTEzNTQ5LjEuMS40JyxcclxuXHQncnNhLXNoYTEnOiAnMS4yLjg0MC4xMTM1NDkuMS4xLjUnLFxyXG5cdCdyc2Etc2hhMjU2JzogJzEuMi44NDAuMTEzNTQ5LjEuMS4xMScsXHJcblx0J3JzYS1zaGEzODQnOiAnMS4yLjg0MC4xMTM1NDkuMS4xLjEyJyxcclxuXHQncnNhLXNoYTUxMic6ICcxLjIuODQwLjExMzU0OS4xLjEuMTMnLFxyXG5cdCdkc2Etc2hhMSc6ICcxLjIuODQwLjEwMDQwLjQuMycsXHJcblx0J2RzYS1zaGEyNTYnOiAnMi4xNi44NDAuMS4xMDEuMy40LjMuMicsXHJcblx0J2VjZHNhLXNoYTEnOiAnMS4yLjg0MC4xMDA0NS40LjEnLFxyXG5cdCdlY2RzYS1zaGEyNTYnOiAnMS4yLjg0MC4xMDA0NS40LjMuMicsXHJcblx0J2VjZHNhLXNoYTM4NCc6ICcxLjIuODQwLjEwMDQ1LjQuMy4zJyxcclxuXHQnZWNkc2Etc2hhNTEyJzogJzEuMi44NDAuMTAwNDUuNC4zLjQnLFxyXG5cdCdlZDI1NTE5LXNoYTUxMic6ICcxLjMuMTAxLjExMidcclxufTtcclxuT2JqZWN0LmtleXMoU0lHTl9BTEdTKS5mb3JFYWNoKGZ1bmN0aW9uIChrKSB7XHJcblx0U0lHTl9BTEdTW1NJR05fQUxHU1trXV0gPSBrO1xyXG59KTtcclxuU0lHTl9BTEdTWycxLjMuMTQuMy4yLjMnXSA9ICdyc2EtbWQ1JztcclxuU0lHTl9BTEdTWycxLjMuMTQuMy4yLjI5J10gPSAncnNhLXNoYTEnO1xyXG5cclxudmFyIEVYVFMgPSB7XHJcblx0J2lzc3VlcktleUlkJzogJzIuNS4yOS4zNScsXHJcblx0J2FsdE5hbWUnOiAnMi41LjI5LjE3JyxcclxuXHQnYmFzaWNDb25zdHJhaW50cyc6ICcyLjUuMjkuMTknLFxyXG5cdCdrZXlVc2FnZSc6ICcyLjUuMjkuMTUnLFxyXG5cdCdleHRLZXlVc2FnZSc6ICcyLjUuMjkuMzcnXHJcbn07XHJcblxyXG5mdW5jdGlvbiByZWFkKGJ1Ziwgb3B0aW9ucykge1xyXG5cdGlmICh0eXBlb2YgKGJ1ZikgPT09ICdzdHJpbmcnKSB7XHJcblx0XHRidWYgPSBCdWZmZXIuZnJvbShidWYsICdiaW5hcnknKTtcclxuXHR9XHJcblx0YXNzZXJ0LmJ1ZmZlcihidWYsICdidWYnKTtcclxuXHJcblx0dmFyIGRlciA9IG5ldyBhc24xLkJlclJlYWRlcihidWYpO1xyXG5cclxuXHRkZXIucmVhZFNlcXVlbmNlKCk7XHJcblx0aWYgKE1hdGguYWJzKGRlci5sZW5ndGggLSBkZXIucmVtYWluKSA+IDEpIHtcclxuXHRcdHRocm93IChuZXcgRXJyb3IoJ0RFUiBzZXF1ZW5jZSBkb2VzIG5vdCBjb250YWluIHdob2xlIGJ5dGUgJyArXHJcblx0XHQgICAgJ3N0cmVhbScpKTtcclxuXHR9XHJcblxyXG5cdHZhciB0YnNTdGFydCA9IGRlci5vZmZzZXQ7XHJcblx0ZGVyLnJlYWRTZXF1ZW5jZSgpO1xyXG5cdHZhciBzaWdPZmZzZXQgPSBkZXIub2Zmc2V0ICsgZGVyLmxlbmd0aDtcclxuXHR2YXIgdGJzRW5kID0gc2lnT2Zmc2V0O1xyXG5cclxuXHRpZiAoZGVyLnBlZWsoKSA9PT0gTG9jYWwoMCkpIHtcclxuXHRcdGRlci5yZWFkU2VxdWVuY2UoTG9jYWwoMCkpO1xyXG5cdFx0dmFyIHZlcnNpb24gPSBkZXIucmVhZEludCgpO1xyXG5cdFx0YXNzZXJ0Lm9rKHZlcnNpb24gPD0gMyxcclxuXHRcdCAgICAnb25seSB4LjUwOSB2ZXJzaW9ucyB1cCB0byB2MyBzdXBwb3J0ZWQnKTtcclxuXHR9XHJcblxyXG5cdHZhciBjZXJ0ID0ge307XHJcblx0Y2VydC5zaWduYXR1cmVzID0ge307XHJcblx0dmFyIHNpZyA9IChjZXJ0LnNpZ25hdHVyZXMueDUwOSA9IHt9KTtcclxuXHRzaWcuZXh0cmFzID0ge307XHJcblxyXG5cdGNlcnQuc2VyaWFsID0gcmVhZE1QSW50KGRlciwgJ3NlcmlhbCcpO1xyXG5cclxuXHRkZXIucmVhZFNlcXVlbmNlKCk7XHJcblx0dmFyIGFmdGVyID0gZGVyLm9mZnNldCArIGRlci5sZW5ndGg7XHJcblx0dmFyIGNlcnRBbGdPaWQgPSBkZXIucmVhZE9JRCgpO1xyXG5cdHZhciBjZXJ0QWxnID0gU0lHTl9BTEdTW2NlcnRBbGdPaWRdO1xyXG5cdGlmIChjZXJ0QWxnID09PSB1bmRlZmluZWQpXHJcblx0XHR0aHJvdyAobmV3IEVycm9yKCd1bmtub3duIHNpZ25hdHVyZSBhbGdvcml0aG0gJyArIGNlcnRBbGdPaWQpKTtcclxuXHJcblx0ZGVyLl9vZmZzZXQgPSBhZnRlcjtcclxuXHRjZXJ0Lmlzc3VlciA9IElkZW50aXR5LnBhcnNlQXNuMShkZXIpO1xyXG5cclxuXHRkZXIucmVhZFNlcXVlbmNlKCk7XHJcblx0Y2VydC52YWxpZEZyb20gPSByZWFkRGF0ZShkZXIpO1xyXG5cdGNlcnQudmFsaWRVbnRpbCA9IHJlYWREYXRlKGRlcik7XHJcblxyXG5cdGNlcnQuc3ViamVjdHMgPSBbSWRlbnRpdHkucGFyc2VBc24xKGRlcildO1xyXG5cclxuXHRkZXIucmVhZFNlcXVlbmNlKCk7XHJcblx0YWZ0ZXIgPSBkZXIub2Zmc2V0ICsgZGVyLmxlbmd0aDtcclxuXHRjZXJ0LnN1YmplY3RLZXkgPSBwa2NzOC5yZWFkUGtjczgodW5kZWZpbmVkLCAncHVibGljJywgZGVyKTtcclxuXHRkZXIuX29mZnNldCA9IGFmdGVyO1xyXG5cclxuXHQvKiBpc3N1ZXJVbmlxdWVJRCAqL1xyXG5cdGlmIChkZXIucGVlaygpID09PSBMb2NhbCgxKSkge1xyXG5cdFx0ZGVyLnJlYWRTZXF1ZW5jZShMb2NhbCgxKSk7XHJcblx0XHRzaWcuZXh0cmFzLmlzc3VlclVuaXF1ZUlEID1cclxuXHRcdCAgICBidWYuc2xpY2UoZGVyLm9mZnNldCwgZGVyLm9mZnNldCArIGRlci5sZW5ndGgpO1xyXG5cdFx0ZGVyLl9vZmZzZXQgKz0gZGVyLmxlbmd0aDtcclxuXHR9XHJcblxyXG5cdC8qIHN1YmplY3RVbmlxdWVJRCAqL1xyXG5cdGlmIChkZXIucGVlaygpID09PSBMb2NhbCgyKSkge1xyXG5cdFx0ZGVyLnJlYWRTZXF1ZW5jZShMb2NhbCgyKSk7XHJcblx0XHRzaWcuZXh0cmFzLnN1YmplY3RVbmlxdWVJRCA9XHJcblx0XHQgICAgYnVmLnNsaWNlKGRlci5vZmZzZXQsIGRlci5vZmZzZXQgKyBkZXIubGVuZ3RoKTtcclxuXHRcdGRlci5fb2Zmc2V0ICs9IGRlci5sZW5ndGg7XHJcblx0fVxyXG5cclxuXHQvKiBleHRlbnNpb25zICovXHJcblx0aWYgKGRlci5wZWVrKCkgPT09IExvY2FsKDMpKSB7XHJcblx0XHRkZXIucmVhZFNlcXVlbmNlKExvY2FsKDMpKTtcclxuXHRcdHZhciBleHRFbmQgPSBkZXIub2Zmc2V0ICsgZGVyLmxlbmd0aDtcclxuXHRcdGRlci5yZWFkU2VxdWVuY2UoKTtcclxuXHJcblx0XHR3aGlsZSAoZGVyLm9mZnNldCA8IGV4dEVuZClcclxuXHRcdFx0cmVhZEV4dGVuc2lvbihjZXJ0LCBidWYsIGRlcik7XHJcblxyXG5cdFx0YXNzZXJ0LnN0cmljdEVxdWFsKGRlci5vZmZzZXQsIGV4dEVuZCk7XHJcblx0fVxyXG5cclxuXHRhc3NlcnQuc3RyaWN0RXF1YWwoZGVyLm9mZnNldCwgc2lnT2Zmc2V0KTtcclxuXHJcblx0ZGVyLnJlYWRTZXF1ZW5jZSgpO1xyXG5cdGFmdGVyID0gZGVyLm9mZnNldCArIGRlci5sZW5ndGg7XHJcblx0dmFyIHNpZ0FsZ09pZCA9IGRlci5yZWFkT0lEKCk7XHJcblx0dmFyIHNpZ0FsZyA9IFNJR05fQUxHU1tzaWdBbGdPaWRdO1xyXG5cdGlmIChzaWdBbGcgPT09IHVuZGVmaW5lZClcclxuXHRcdHRocm93IChuZXcgRXJyb3IoJ3Vua25vd24gc2lnbmF0dXJlIGFsZ29yaXRobSAnICsgc2lnQWxnT2lkKSk7XHJcblx0ZGVyLl9vZmZzZXQgPSBhZnRlcjtcclxuXHJcblx0dmFyIHNpZ0RhdGEgPSBkZXIucmVhZFN0cmluZyhhc24xLkJlci5CaXRTdHJpbmcsIHRydWUpO1xyXG5cdGlmIChzaWdEYXRhWzBdID09PSAwKVxyXG5cdFx0c2lnRGF0YSA9IHNpZ0RhdGEuc2xpY2UoMSk7XHJcblx0dmFyIGFsZ1BhcnRzID0gc2lnQWxnLnNwbGl0KCctJyk7XHJcblxyXG5cdHNpZy5zaWduYXR1cmUgPSBTaWduYXR1cmUucGFyc2Uoc2lnRGF0YSwgYWxnUGFydHNbMF0sICdhc24xJyk7XHJcblx0c2lnLnNpZ25hdHVyZS5oYXNoQWxnb3JpdGhtID0gYWxnUGFydHNbMV07XHJcblx0c2lnLmFsZ28gPSBzaWdBbGc7XHJcblx0c2lnLmNhY2hlID0gYnVmLnNsaWNlKHRic1N0YXJ0LCB0YnNFbmQpO1xyXG5cclxuXHRyZXR1cm4gKG5ldyBDZXJ0aWZpY2F0ZShjZXJ0KSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlYWREYXRlKGRlcikge1xyXG5cdGlmIChkZXIucGVlaygpID09PSBhc24xLkJlci5VVENUaW1lKSB7XHJcblx0XHRyZXR1cm4gKHV0Y1RpbWVUb0RhdGUoZGVyLnJlYWRTdHJpbmcoYXNuMS5CZXIuVVRDVGltZSkpKTtcclxuXHR9IGVsc2UgaWYgKGRlci5wZWVrKCkgPT09IGFzbjEuQmVyLkdlbmVyYWxpemVkVGltZSkge1xyXG5cdFx0cmV0dXJuIChnVGltZVRvRGF0ZShkZXIucmVhZFN0cmluZyhhc24xLkJlci5HZW5lcmFsaXplZFRpbWUpKSk7XHJcblx0fSBlbHNlIHtcclxuXHRcdHRocm93IChuZXcgRXJyb3IoJ1Vuc3VwcG9ydGVkIGRhdGUgZm9ybWF0JykpO1xyXG5cdH1cclxufVxyXG5cclxuZnVuY3Rpb24gd3JpdGVEYXRlKGRlciwgZGF0ZSkge1xyXG5cdGlmIChkYXRlLmdldFVUQ0Z1bGxZZWFyKCkgPj0gMjA1MCB8fCBkYXRlLmdldFVUQ0Z1bGxZZWFyKCkgPCAxOTUwKSB7XHJcblx0XHRkZXIud3JpdGVTdHJpbmcoZGF0ZVRvR1RpbWUoZGF0ZSksIGFzbjEuQmVyLkdlbmVyYWxpemVkVGltZSk7XHJcblx0fSBlbHNlIHtcclxuXHRcdGRlci53cml0ZVN0cmluZyhkYXRlVG9VVENUaW1lKGRhdGUpLCBhc24xLkJlci5VVENUaW1lKTtcclxuXHR9XHJcbn1cclxuXHJcbi8qIFJGQzUyODAsIHNlY3Rpb24gNC4yLjEuNiAoR2VuZXJhbE5hbWUgdHlwZSkgKi9cclxudmFyIEFMVE5BTUUgPSB7XHJcblx0T3RoZXJOYW1lOiBMb2NhbCgwKSxcclxuXHRSRkM4MjJOYW1lOiBDb250ZXh0KDEpLFxyXG5cdEROU05hbWU6IENvbnRleHQoMiksXHJcblx0WDQwMEFkZHJlc3M6IExvY2FsKDMpLFxyXG5cdERpcmVjdG9yeU5hbWU6IExvY2FsKDQpLFxyXG5cdEVESVBhcnR5TmFtZTogTG9jYWwoNSksXHJcblx0VVJJOiBDb250ZXh0KDYpLFxyXG5cdElQQWRkcmVzczogQ29udGV4dCg3KSxcclxuXHRPSUQ6IENvbnRleHQoOClcclxufTtcclxuXHJcbi8qIFJGQzUyODAsIHNlY3Rpb24gNC4yLjEuMTIgKEtleVB1cnBvc2VJZCkgKi9cclxudmFyIEVYVFBVUlBPU0UgPSB7XHJcblx0J3NlcnZlckF1dGgnOiAnMS4zLjYuMS41LjUuNy4zLjEnLFxyXG5cdCdjbGllbnRBdXRoJzogJzEuMy42LjEuNS41LjcuMy4yJyxcclxuXHQnY29kZVNpZ25pbmcnOiAnMS4zLjYuMS41LjUuNy4zLjMnLFxyXG5cclxuXHQvKiBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2pveWVudC9vaWQtZG9jcy9ibG9iL21hc3Rlci9yb290Lm1kICovXHJcblx0J2pveWVudERvY2tlcic6ICcxLjMuNi4xLjQuMS4zODY3OC4xLjQuMScsXHJcblx0J2pveWVudENtb24nOiAnMS4zLjYuMS40LjEuMzg2NzguMS40LjInXHJcbn07XHJcbnZhciBFWFRQVVJQT1NFX1JFViA9IHt9O1xyXG5PYmplY3Qua2V5cyhFWFRQVVJQT1NFKS5mb3JFYWNoKGZ1bmN0aW9uIChrKSB7XHJcblx0RVhUUFVSUE9TRV9SRVZbRVhUUFVSUE9TRVtrXV0gPSBrO1xyXG59KTtcclxuXHJcbnZhciBLRVlVU0VCSVRTID0gW1xyXG5cdCdzaWduYXR1cmUnLCAnaWRlbnRpdHknLCAna2V5RW5jcnlwdGlvbicsXHJcblx0J2VuY3J5cHRpb24nLCAna2V5QWdyZWVtZW50JywgJ2NhJywgJ2NybCdcclxuXTtcclxuXHJcbmZ1bmN0aW9uIHJlYWRFeHRlbnNpb24oY2VydCwgYnVmLCBkZXIpIHtcclxuXHRkZXIucmVhZFNlcXVlbmNlKCk7XHJcblx0dmFyIGFmdGVyID0gZGVyLm9mZnNldCArIGRlci5sZW5ndGg7XHJcblx0dmFyIGV4dElkID0gZGVyLnJlYWRPSUQoKTtcclxuXHR2YXIgaWQ7XHJcblx0dmFyIHNpZyA9IGNlcnQuc2lnbmF0dXJlcy54NTA5O1xyXG5cdGlmICghc2lnLmV4dHJhcy5leHRzKVxyXG5cdFx0c2lnLmV4dHJhcy5leHRzID0gW107XHJcblxyXG5cdHZhciBjcml0aWNhbDtcclxuXHRpZiAoZGVyLnBlZWsoKSA9PT0gYXNuMS5CZXIuQm9vbGVhbilcclxuXHRcdGNyaXRpY2FsID0gZGVyLnJlYWRCb29sZWFuKCk7XHJcblxyXG5cdHN3aXRjaCAoZXh0SWQpIHtcclxuXHRjYXNlIChFWFRTLmJhc2ljQ29uc3RyYWludHMpOlxyXG5cdFx0ZGVyLnJlYWRTZXF1ZW5jZShhc24xLkJlci5PY3RldFN0cmluZyk7XHJcblx0XHRkZXIucmVhZFNlcXVlbmNlKCk7XHJcblx0XHR2YXIgYmNFbmQgPSBkZXIub2Zmc2V0ICsgZGVyLmxlbmd0aDtcclxuXHRcdHZhciBjYSA9IGZhbHNlO1xyXG5cdFx0aWYgKGRlci5wZWVrKCkgPT09IGFzbjEuQmVyLkJvb2xlYW4pXHJcblx0XHRcdGNhID0gZGVyLnJlYWRCb29sZWFuKCk7XHJcblx0XHRpZiAoY2VydC5wdXJwb3NlcyA9PT0gdW5kZWZpbmVkKVxyXG5cdFx0XHRjZXJ0LnB1cnBvc2VzID0gW107XHJcblx0XHRpZiAoY2EgPT09IHRydWUpXHJcblx0XHRcdGNlcnQucHVycG9zZXMucHVzaCgnY2EnKTtcclxuXHRcdHZhciBiYyA9IHsgb2lkOiBleHRJZCwgY3JpdGljYWw6IGNyaXRpY2FsIH07XHJcblx0XHRpZiAoZGVyLm9mZnNldCA8IGJjRW5kICYmIGRlci5wZWVrKCkgPT09IGFzbjEuQmVyLkludGVnZXIpXHJcblx0XHRcdGJjLnBhdGhMZW4gPSBkZXIucmVhZEludCgpO1xyXG5cdFx0c2lnLmV4dHJhcy5leHRzLnB1c2goYmMpO1xyXG5cdFx0YnJlYWs7XHJcblx0Y2FzZSAoRVhUUy5leHRLZXlVc2FnZSk6XHJcblx0XHRkZXIucmVhZFNlcXVlbmNlKGFzbjEuQmVyLk9jdGV0U3RyaW5nKTtcclxuXHRcdGRlci5yZWFkU2VxdWVuY2UoKTtcclxuXHRcdGlmIChjZXJ0LnB1cnBvc2VzID09PSB1bmRlZmluZWQpXHJcblx0XHRcdGNlcnQucHVycG9zZXMgPSBbXTtcclxuXHRcdHZhciBla0VuZCA9IGRlci5vZmZzZXQgKyBkZXIubGVuZ3RoO1xyXG5cdFx0d2hpbGUgKGRlci5vZmZzZXQgPCBla0VuZCkge1xyXG5cdFx0XHR2YXIgb2lkID0gZGVyLnJlYWRPSUQoKTtcclxuXHRcdFx0Y2VydC5wdXJwb3Nlcy5wdXNoKEVYVFBVUlBPU0VfUkVWW29pZF0gfHwgb2lkKTtcclxuXHRcdH1cclxuXHRcdC8qXHJcblx0XHQgKiBUaGlzIGlzIGEgYml0IG9mIGEgaGFjazogaW4gdGhlIGNhc2Ugd2hlcmUgd2UgaGF2ZSBhIGNlcnRcclxuXHRcdCAqIHRoYXQncyBvbmx5IGFsbG93ZWQgdG8gZG8gc2VydmVyQXV0aCBvciBjbGllbnRBdXRoIChhbmQgbm90XHJcblx0XHQgKiB0aGUgb3RoZXIpLCB3ZSB3YW50IHRvIG1ha2Ugc3VyZSBhbGwgb3VyIFN1YmplY3RzIGFyZSBvZlxyXG5cdFx0ICogdGhlIHJpZ2h0IHR5cGUuIEJ1dCB3ZSBhbHJlYWR5IHBhcnNlZCBvdXIgU3ViamVjdHMgYW5kXHJcblx0XHQgKiBkZWNpZGVkIGlmIHRoZXkgd2VyZSBob3N0cyBvciB1c2VycyBlYXJsaWVyIChzaW5jZSBpdCBhcHBlYXJzXHJcblx0XHQgKiBmaXJzdCBpbiB0aGUgY2VydCkuXHJcblx0XHQgKlxyXG5cdFx0ICogU28gd2UgZ28gdGhyb3VnaCBhbmQgbXV0YXRlIHRoZW0gaW50byB0aGUgcmlnaHQga2luZCBoZXJlIGlmXHJcblx0XHQgKiBpdCBkb2Vzbid0IG1hdGNoLiBUaGlzIG1pZ2h0IG5vdCBiZSBodWdlbHkgYmVuZWZpY2lhbCwgYXMgaXRcclxuXHRcdCAqIHNlZW1zIHRoYXQgc2luZ2xlLXB1cnBvc2UgY2VydHMgYXJlIG5vdCBvZnRlbiBzZWVuIGluIHRoZVxyXG5cdFx0ICogd2lsZC5cclxuXHRcdCAqL1xyXG5cdFx0aWYgKGNlcnQucHVycG9zZXMuaW5kZXhPZignc2VydmVyQXV0aCcpICE9PSAtMSAmJlxyXG5cdFx0ICAgIGNlcnQucHVycG9zZXMuaW5kZXhPZignY2xpZW50QXV0aCcpID09PSAtMSkge1xyXG5cdFx0XHRjZXJ0LnN1YmplY3RzLmZvckVhY2goZnVuY3Rpb24gKGlkZSkge1xyXG5cdFx0XHRcdGlmIChpZGUudHlwZSAhPT0gJ2hvc3QnKSB7XHJcblx0XHRcdFx0XHRpZGUudHlwZSA9ICdob3N0JztcclxuXHRcdFx0XHRcdGlkZS5ob3N0bmFtZSA9IGlkZS51aWQgfHxcclxuXHRcdFx0XHRcdCAgICBpZGUuZW1haWwgfHxcclxuXHRcdFx0XHRcdCAgICBpZGUuY29tcG9uZW50c1swXS52YWx1ZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fSBlbHNlIGlmIChjZXJ0LnB1cnBvc2VzLmluZGV4T2YoJ2NsaWVudEF1dGgnKSAhPT0gLTEgJiZcclxuXHRcdCAgICBjZXJ0LnB1cnBvc2VzLmluZGV4T2YoJ3NlcnZlckF1dGgnKSA9PT0gLTEpIHtcclxuXHRcdFx0Y2VydC5zdWJqZWN0cy5mb3JFYWNoKGZ1bmN0aW9uIChpZGUpIHtcclxuXHRcdFx0XHRpZiAoaWRlLnR5cGUgIT09ICd1c2VyJykge1xyXG5cdFx0XHRcdFx0aWRlLnR5cGUgPSAndXNlcic7XHJcblx0XHRcdFx0XHRpZGUudWlkID0gaWRlLmhvc3RuYW1lIHx8XHJcblx0XHRcdFx0XHQgICAgaWRlLmVtYWlsIHx8XHJcblx0XHRcdFx0XHQgICAgaWRlLmNvbXBvbmVudHNbMF0udmFsdWU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHRcdHNpZy5leHRyYXMuZXh0cy5wdXNoKHsgb2lkOiBleHRJZCwgY3JpdGljYWw6IGNyaXRpY2FsIH0pO1xyXG5cdFx0YnJlYWs7XHJcblx0Y2FzZSAoRVhUUy5rZXlVc2FnZSk6XHJcblx0XHRkZXIucmVhZFNlcXVlbmNlKGFzbjEuQmVyLk9jdGV0U3RyaW5nKTtcclxuXHRcdHZhciBiaXRzID0gZGVyLnJlYWRTdHJpbmcoYXNuMS5CZXIuQml0U3RyaW5nLCB0cnVlKTtcclxuXHRcdHZhciBzZXRCaXRzID0gcmVhZEJpdEZpZWxkKGJpdHMsIEtFWVVTRUJJVFMpO1xyXG5cdFx0c2V0Qml0cy5mb3JFYWNoKGZ1bmN0aW9uIChiaXQpIHtcclxuXHRcdFx0aWYgKGNlcnQucHVycG9zZXMgPT09IHVuZGVmaW5lZClcclxuXHRcdFx0XHRjZXJ0LnB1cnBvc2VzID0gW107XHJcblx0XHRcdGlmIChjZXJ0LnB1cnBvc2VzLmluZGV4T2YoYml0KSA9PT0gLTEpXHJcblx0XHRcdFx0Y2VydC5wdXJwb3Nlcy5wdXNoKGJpdCk7XHJcblx0XHR9KTtcclxuXHRcdHNpZy5leHRyYXMuZXh0cy5wdXNoKHsgb2lkOiBleHRJZCwgY3JpdGljYWw6IGNyaXRpY2FsLFxyXG5cdFx0ICAgIGJpdHM6IGJpdHMgfSk7XHJcblx0XHRicmVhaztcclxuXHRjYXNlIChFWFRTLmFsdE5hbWUpOlxyXG5cdFx0ZGVyLnJlYWRTZXF1ZW5jZShhc24xLkJlci5PY3RldFN0cmluZyk7XHJcblx0XHRkZXIucmVhZFNlcXVlbmNlKCk7XHJcblx0XHR2YXIgYWVFbmQgPSBkZXIub2Zmc2V0ICsgZGVyLmxlbmd0aDtcclxuXHRcdHdoaWxlIChkZXIub2Zmc2V0IDwgYWVFbmQpIHtcclxuXHRcdFx0c3dpdGNoIChkZXIucGVlaygpKSB7XHJcblx0XHRcdGNhc2UgQUxUTkFNRS5PdGhlck5hbWU6XHJcblx0XHRcdGNhc2UgQUxUTkFNRS5FRElQYXJ0eU5hbWU6XHJcblx0XHRcdFx0ZGVyLnJlYWRTZXF1ZW5jZSgpO1xyXG5cdFx0XHRcdGRlci5fb2Zmc2V0ICs9IGRlci5sZW5ndGg7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgQUxUTkFNRS5PSUQ6XHJcblx0XHRcdFx0ZGVyLnJlYWRPSUQoQUxUTkFNRS5PSUQpO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlIEFMVE5BTUUuUkZDODIyTmFtZTpcclxuXHRcdFx0XHQvKiBSRkM4MjIgc3BlY2lmaWVzIGVtYWlsIGFkZHJlc3NlcyAqL1xyXG5cdFx0XHRcdHZhciBlbWFpbCA9IGRlci5yZWFkU3RyaW5nKEFMVE5BTUUuUkZDODIyTmFtZSk7XHJcblx0XHRcdFx0aWQgPSBJZGVudGl0eS5mb3JFbWFpbChlbWFpbCk7XHJcblx0XHRcdFx0aWYgKCFjZXJ0LnN1YmplY3RzWzBdLmVxdWFscyhpZCkpXHJcblx0XHRcdFx0XHRjZXJ0LnN1YmplY3RzLnB1c2goaWQpO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlIEFMVE5BTUUuRGlyZWN0b3J5TmFtZTpcclxuXHRcdFx0XHRkZXIucmVhZFNlcXVlbmNlKEFMVE5BTUUuRGlyZWN0b3J5TmFtZSk7XHJcblx0XHRcdFx0aWQgPSBJZGVudGl0eS5wYXJzZUFzbjEoZGVyKTtcclxuXHRcdFx0XHRpZiAoIWNlcnQuc3ViamVjdHNbMF0uZXF1YWxzKGlkKSlcclxuXHRcdFx0XHRcdGNlcnQuc3ViamVjdHMucHVzaChpZCk7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgQUxUTkFNRS5ETlNOYW1lOlxyXG5cdFx0XHRcdHZhciBob3N0ID0gZGVyLnJlYWRTdHJpbmcoXHJcblx0XHRcdFx0ICAgIEFMVE5BTUUuRE5TTmFtZSk7XHJcblx0XHRcdFx0aWQgPSBJZGVudGl0eS5mb3JIb3N0KGhvc3QpO1xyXG5cdFx0XHRcdGlmICghY2VydC5zdWJqZWN0c1swXS5lcXVhbHMoaWQpKVxyXG5cdFx0XHRcdFx0Y2VydC5zdWJqZWN0cy5wdXNoKGlkKTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0ZGVmYXVsdDpcclxuXHRcdFx0XHRkZXIucmVhZFN0cmluZyhkZXIucGVlaygpKTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0c2lnLmV4dHJhcy5leHRzLnB1c2goeyBvaWQ6IGV4dElkLCBjcml0aWNhbDogY3JpdGljYWwgfSk7XHJcblx0XHRicmVhaztcclxuXHRkZWZhdWx0OlxyXG5cdFx0c2lnLmV4dHJhcy5leHRzLnB1c2goe1xyXG5cdFx0XHRvaWQ6IGV4dElkLFxyXG5cdFx0XHRjcml0aWNhbDogY3JpdGljYWwsXHJcblx0XHRcdGRhdGE6IGRlci5yZWFkU3RyaW5nKGFzbjEuQmVyLk9jdGV0U3RyaW5nLCB0cnVlKVxyXG5cdFx0fSk7XHJcblx0XHRicmVhaztcclxuXHR9XHJcblxyXG5cdGRlci5fb2Zmc2V0ID0gYWZ0ZXI7XHJcbn1cclxuXHJcbnZhciBVVENUSU1FX1JFID1cclxuICAgIC9eKFswLTldezJ9KShbMC05XXsyfSkoWzAtOV17Mn0pKFswLTldezJ9KShbMC05XXsyfSkoWzAtOV17Mn0pP1okLztcclxuZnVuY3Rpb24gdXRjVGltZVRvRGF0ZSh0KSB7XHJcblx0dmFyIG0gPSB0Lm1hdGNoKFVUQ1RJTUVfUkUpO1xyXG5cdGFzc2VydC5vayhtLCAndGltZXN0YW1wcyBtdXN0IGJlIGluIFVUQycpO1xyXG5cdHZhciBkID0gbmV3IERhdGUoKTtcclxuXHJcblx0dmFyIHRoaXNZZWFyID0gZC5nZXRVVENGdWxsWWVhcigpO1xyXG5cdHZhciBjZW50dXJ5ID0gTWF0aC5mbG9vcih0aGlzWWVhciAvIDEwMCkgKiAxMDA7XHJcblxyXG5cdHZhciB5ZWFyID0gcGFyc2VJbnQobVsxXSwgMTApO1xyXG5cdGlmICh0aGlzWWVhciAlIDEwMCA8IDUwICYmIHllYXIgPj0gNjApXHJcblx0XHR5ZWFyICs9IChjZW50dXJ5IC0gMSk7XHJcblx0ZWxzZVxyXG5cdFx0eWVhciArPSBjZW50dXJ5O1xyXG5cdGQuc2V0VVRDRnVsbFllYXIoeWVhciwgcGFyc2VJbnQobVsyXSwgMTApIC0gMSwgcGFyc2VJbnQobVszXSwgMTApKTtcclxuXHRkLnNldFVUQ0hvdXJzKHBhcnNlSW50KG1bNF0sIDEwKSwgcGFyc2VJbnQobVs1XSwgMTApKTtcclxuXHRpZiAobVs2XSAmJiBtWzZdLmxlbmd0aCA+IDApXHJcblx0XHRkLnNldFVUQ1NlY29uZHMocGFyc2VJbnQobVs2XSwgMTApKTtcclxuXHRyZXR1cm4gKGQpO1xyXG59XHJcblxyXG52YXIgR1RJTUVfUkUgPVxyXG4gICAgL14oWzAtOV17NH0pKFswLTldezJ9KShbMC05XXsyfSkoWzAtOV17Mn0pKFswLTldezJ9KShbMC05XXsyfSk/WiQvO1xyXG5mdW5jdGlvbiBnVGltZVRvRGF0ZSh0KSB7XHJcblx0dmFyIG0gPSB0Lm1hdGNoKEdUSU1FX1JFKTtcclxuXHRhc3NlcnQub2sobSk7XHJcblx0dmFyIGQgPSBuZXcgRGF0ZSgpO1xyXG5cclxuXHRkLnNldFVUQ0Z1bGxZZWFyKHBhcnNlSW50KG1bMV0sIDEwKSwgcGFyc2VJbnQobVsyXSwgMTApIC0gMSxcclxuXHQgICAgcGFyc2VJbnQobVszXSwgMTApKTtcclxuXHRkLnNldFVUQ0hvdXJzKHBhcnNlSW50KG1bNF0sIDEwKSwgcGFyc2VJbnQobVs1XSwgMTApKTtcclxuXHRpZiAobVs2XSAmJiBtWzZdLmxlbmd0aCA+IDApXHJcblx0XHRkLnNldFVUQ1NlY29uZHMocGFyc2VJbnQobVs2XSwgMTApKTtcclxuXHRyZXR1cm4gKGQpO1xyXG59XHJcblxyXG5mdW5jdGlvbiB6ZXJvUGFkKG4sIG0pIHtcclxuXHRpZiAobSA9PT0gdW5kZWZpbmVkKVxyXG5cdFx0bSA9IDI7XHJcblx0dmFyIHMgPSAnJyArIG47XHJcblx0d2hpbGUgKHMubGVuZ3RoIDwgbSlcclxuXHRcdHMgPSAnMCcgKyBzO1xyXG5cdHJldHVybiAocyk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRhdGVUb1VUQ1RpbWUoZCkge1xyXG5cdHZhciBzID0gJyc7XHJcblx0cyArPSB6ZXJvUGFkKGQuZ2V0VVRDRnVsbFllYXIoKSAlIDEwMCk7XHJcblx0cyArPSB6ZXJvUGFkKGQuZ2V0VVRDTW9udGgoKSArIDEpO1xyXG5cdHMgKz0gemVyb1BhZChkLmdldFVUQ0RhdGUoKSk7XHJcblx0cyArPSB6ZXJvUGFkKGQuZ2V0VVRDSG91cnMoKSk7XHJcblx0cyArPSB6ZXJvUGFkKGQuZ2V0VVRDTWludXRlcygpKTtcclxuXHRzICs9IHplcm9QYWQoZC5nZXRVVENTZWNvbmRzKCkpO1xyXG5cdHMgKz0gJ1onO1xyXG5cdHJldHVybiAocyk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRhdGVUb0dUaW1lKGQpIHtcclxuXHR2YXIgcyA9ICcnO1xyXG5cdHMgKz0gemVyb1BhZChkLmdldFVUQ0Z1bGxZZWFyKCksIDQpO1xyXG5cdHMgKz0gemVyb1BhZChkLmdldFVUQ01vbnRoKCkgKyAxKTtcclxuXHRzICs9IHplcm9QYWQoZC5nZXRVVENEYXRlKCkpO1xyXG5cdHMgKz0gemVyb1BhZChkLmdldFVUQ0hvdXJzKCkpO1xyXG5cdHMgKz0gemVyb1BhZChkLmdldFVUQ01pbnV0ZXMoKSk7XHJcblx0cyArPSB6ZXJvUGFkKGQuZ2V0VVRDU2Vjb25kcygpKTtcclxuXHRzICs9ICdaJztcclxuXHRyZXR1cm4gKHMpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBzaWduKGNlcnQsIGtleSkge1xyXG5cdGlmIChjZXJ0LnNpZ25hdHVyZXMueDUwOSA9PT0gdW5kZWZpbmVkKVxyXG5cdFx0Y2VydC5zaWduYXR1cmVzLng1MDkgPSB7fTtcclxuXHR2YXIgc2lnID0gY2VydC5zaWduYXR1cmVzLng1MDk7XHJcblxyXG5cdHNpZy5hbGdvID0ga2V5LnR5cGUgKyAnLScgKyBrZXkuZGVmYXVsdEhhc2hBbGdvcml0aG0oKTtcclxuXHRpZiAoU0lHTl9BTEdTW3NpZy5hbGdvXSA9PT0gdW5kZWZpbmVkKVxyXG5cdFx0cmV0dXJuIChmYWxzZSk7XHJcblxyXG5cdHZhciBkZXIgPSBuZXcgYXNuMS5CZXJXcml0ZXIoKTtcclxuXHR3cml0ZVRCU0NlcnQoY2VydCwgZGVyKTtcclxuXHR2YXIgYmxvYiA9IGRlci5idWZmZXI7XHJcblx0c2lnLmNhY2hlID0gYmxvYjtcclxuXHJcblx0dmFyIHNpZ25lciA9IGtleS5jcmVhdGVTaWduKCk7XHJcblx0c2lnbmVyLndyaXRlKGJsb2IpO1xyXG5cdGNlcnQuc2lnbmF0dXJlcy54NTA5LnNpZ25hdHVyZSA9IHNpZ25lci5zaWduKCk7XHJcblxyXG5cdHJldHVybiAodHJ1ZSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNpZ25Bc3luYyhjZXJ0LCBzaWduZXIsIGRvbmUpIHtcclxuXHRpZiAoY2VydC5zaWduYXR1cmVzLng1MDkgPT09IHVuZGVmaW5lZClcclxuXHRcdGNlcnQuc2lnbmF0dXJlcy54NTA5ID0ge307XHJcblx0dmFyIHNpZyA9IGNlcnQuc2lnbmF0dXJlcy54NTA5O1xyXG5cclxuXHR2YXIgZGVyID0gbmV3IGFzbjEuQmVyV3JpdGVyKCk7XHJcblx0d3JpdGVUQlNDZXJ0KGNlcnQsIGRlcik7XHJcblx0dmFyIGJsb2IgPSBkZXIuYnVmZmVyO1xyXG5cdHNpZy5jYWNoZSA9IGJsb2I7XHJcblxyXG5cdHNpZ25lcihibG9iLCBmdW5jdGlvbiAoZXJyLCBzaWduYXR1cmUpIHtcclxuXHRcdGlmIChlcnIpIHtcclxuXHRcdFx0ZG9uZShlcnIpO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblx0XHRzaWcuYWxnbyA9IHNpZ25hdHVyZS50eXBlICsgJy0nICsgc2lnbmF0dXJlLmhhc2hBbGdvcml0aG07XHJcblx0XHRpZiAoU0lHTl9BTEdTW3NpZy5hbGdvXSA9PT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdGRvbmUobmV3IEVycm9yKCdJbnZhbGlkIHNpZ25pbmcgYWxnb3JpdGhtIFwiJyArXHJcblx0XHRcdCAgICBzaWcuYWxnbyArICdcIicpKTtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cdFx0c2lnLnNpZ25hdHVyZSA9IHNpZ25hdHVyZTtcclxuXHRcdGRvbmUoKTtcclxuXHR9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gd3JpdGUoY2VydCwgb3B0aW9ucykge1xyXG5cdHZhciBzaWcgPSBjZXJ0LnNpZ25hdHVyZXMueDUwOTtcclxuXHRhc3NlcnQub2JqZWN0KHNpZywgJ3g1MDkgc2lnbmF0dXJlJyk7XHJcblxyXG5cdHZhciBkZXIgPSBuZXcgYXNuMS5CZXJXcml0ZXIoKTtcclxuXHRkZXIuc3RhcnRTZXF1ZW5jZSgpO1xyXG5cdGlmIChzaWcuY2FjaGUpIHtcclxuXHRcdGRlci5fZW5zdXJlKHNpZy5jYWNoZS5sZW5ndGgpO1xyXG5cdFx0c2lnLmNhY2hlLmNvcHkoZGVyLl9idWYsIGRlci5fb2Zmc2V0KTtcclxuXHRcdGRlci5fb2Zmc2V0ICs9IHNpZy5jYWNoZS5sZW5ndGg7XHJcblx0fSBlbHNlIHtcclxuXHRcdHdyaXRlVEJTQ2VydChjZXJ0LCBkZXIpO1xyXG5cdH1cclxuXHJcblx0ZGVyLnN0YXJ0U2VxdWVuY2UoKTtcclxuXHRkZXIud3JpdGVPSUQoU0lHTl9BTEdTW3NpZy5hbGdvXSk7XHJcblx0aWYgKHNpZy5hbGdvLm1hdGNoKC9ecnNhLS8pKVxyXG5cdFx0ZGVyLndyaXRlTnVsbCgpO1xyXG5cdGRlci5lbmRTZXF1ZW5jZSgpO1xyXG5cclxuXHR2YXIgc2lnRGF0YSA9IHNpZy5zaWduYXR1cmUudG9CdWZmZXIoJ2FzbjEnKTtcclxuXHR2YXIgZGF0YSA9IEJ1ZmZlci5hbGxvYyhzaWdEYXRhLmxlbmd0aCArIDEpO1xyXG5cdGRhdGFbMF0gPSAwO1xyXG5cdHNpZ0RhdGEuY29weShkYXRhLCAxKTtcclxuXHRkZXIud3JpdGVCdWZmZXIoZGF0YSwgYXNuMS5CZXIuQml0U3RyaW5nKTtcclxuXHRkZXIuZW5kU2VxdWVuY2UoKTtcclxuXHJcblx0cmV0dXJuIChkZXIuYnVmZmVyKTtcclxufVxyXG5cclxuZnVuY3Rpb24gd3JpdGVUQlNDZXJ0KGNlcnQsIGRlcikge1xyXG5cdHZhciBzaWcgPSBjZXJ0LnNpZ25hdHVyZXMueDUwOTtcclxuXHRhc3NlcnQub2JqZWN0KHNpZywgJ3g1MDkgc2lnbmF0dXJlJyk7XHJcblxyXG5cdGRlci5zdGFydFNlcXVlbmNlKCk7XHJcblxyXG5cdGRlci5zdGFydFNlcXVlbmNlKExvY2FsKDApKTtcclxuXHRkZXIud3JpdGVJbnQoMik7XHJcblx0ZGVyLmVuZFNlcXVlbmNlKCk7XHJcblxyXG5cdGRlci53cml0ZUJ1ZmZlcih1dGlscy5tcE5vcm1hbGl6ZShjZXJ0LnNlcmlhbCksIGFzbjEuQmVyLkludGVnZXIpO1xyXG5cclxuXHRkZXIuc3RhcnRTZXF1ZW5jZSgpO1xyXG5cdGRlci53cml0ZU9JRChTSUdOX0FMR1Nbc2lnLmFsZ29dKTtcclxuXHRpZiAoc2lnLmFsZ28ubWF0Y2goL15yc2EtLykpXHJcblx0XHRkZXIud3JpdGVOdWxsKCk7XHJcblx0ZGVyLmVuZFNlcXVlbmNlKCk7XHJcblxyXG5cdGNlcnQuaXNzdWVyLnRvQXNuMShkZXIpO1xyXG5cclxuXHRkZXIuc3RhcnRTZXF1ZW5jZSgpO1xyXG5cdHdyaXRlRGF0ZShkZXIsIGNlcnQudmFsaWRGcm9tKTtcclxuXHR3cml0ZURhdGUoZGVyLCBjZXJ0LnZhbGlkVW50aWwpO1xyXG5cdGRlci5lbmRTZXF1ZW5jZSgpO1xyXG5cclxuXHR2YXIgc3ViamVjdCA9IGNlcnQuc3ViamVjdHNbMF07XHJcblx0dmFyIGFsdE5hbWVzID0gY2VydC5zdWJqZWN0cy5zbGljZSgxKTtcclxuXHRzdWJqZWN0LnRvQXNuMShkZXIpO1xyXG5cclxuXHRwa2NzOC53cml0ZVBrY3M4KGRlciwgY2VydC5zdWJqZWN0S2V5KTtcclxuXHJcblx0aWYgKHNpZy5leHRyYXMgJiYgc2lnLmV4dHJhcy5pc3N1ZXJVbmlxdWVJRCkge1xyXG5cdFx0ZGVyLndyaXRlQnVmZmVyKHNpZy5leHRyYXMuaXNzdWVyVW5pcXVlSUQsIExvY2FsKDEpKTtcclxuXHR9XHJcblxyXG5cdGlmIChzaWcuZXh0cmFzICYmIHNpZy5leHRyYXMuc3ViamVjdFVuaXF1ZUlEKSB7XHJcblx0XHRkZXIud3JpdGVCdWZmZXIoc2lnLmV4dHJhcy5zdWJqZWN0VW5pcXVlSUQsIExvY2FsKDIpKTtcclxuXHR9XHJcblxyXG5cdGlmIChhbHROYW1lcy5sZW5ndGggPiAwIHx8IHN1YmplY3QudHlwZSA9PT0gJ2hvc3QnIHx8XHJcblx0ICAgIChjZXJ0LnB1cnBvc2VzICE9PSB1bmRlZmluZWQgJiYgY2VydC5wdXJwb3Nlcy5sZW5ndGggPiAwKSB8fFxyXG5cdCAgICAoc2lnLmV4dHJhcyAmJiBzaWcuZXh0cmFzLmV4dHMpKSB7XHJcblx0XHRkZXIuc3RhcnRTZXF1ZW5jZShMb2NhbCgzKSk7XHJcblx0XHRkZXIuc3RhcnRTZXF1ZW5jZSgpO1xyXG5cclxuXHRcdHZhciBleHRzID0gW107XHJcblx0XHRpZiAoY2VydC5wdXJwb3NlcyAhPT0gdW5kZWZpbmVkICYmIGNlcnQucHVycG9zZXMubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRleHRzLnB1c2goe1xyXG5cdFx0XHRcdG9pZDogRVhUUy5iYXNpY0NvbnN0cmFpbnRzLFxyXG5cdFx0XHRcdGNyaXRpY2FsOiB0cnVlXHJcblx0XHRcdH0pO1xyXG5cdFx0XHRleHRzLnB1c2goe1xyXG5cdFx0XHRcdG9pZDogRVhUUy5rZXlVc2FnZSxcclxuXHRcdFx0XHRjcml0aWNhbDogdHJ1ZVxyXG5cdFx0XHR9KTtcclxuXHRcdFx0ZXh0cy5wdXNoKHtcclxuXHRcdFx0XHRvaWQ6IEVYVFMuZXh0S2V5VXNhZ2UsXHJcblx0XHRcdFx0Y3JpdGljYWw6IHRydWVcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0XHRleHRzLnB1c2goeyBvaWQ6IEVYVFMuYWx0TmFtZSB9KTtcclxuXHRcdGlmIChzaWcuZXh0cmFzICYmIHNpZy5leHRyYXMuZXh0cylcclxuXHRcdFx0ZXh0cyA9IHNpZy5leHRyYXMuZXh0cztcclxuXHJcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGV4dHMubGVuZ3RoOyArK2kpIHtcclxuXHRcdFx0ZGVyLnN0YXJ0U2VxdWVuY2UoKTtcclxuXHRcdFx0ZGVyLndyaXRlT0lEKGV4dHNbaV0ub2lkKTtcclxuXHJcblx0XHRcdGlmIChleHRzW2ldLmNyaXRpY2FsICE9PSB1bmRlZmluZWQpXHJcblx0XHRcdFx0ZGVyLndyaXRlQm9vbGVhbihleHRzW2ldLmNyaXRpY2FsKTtcclxuXHJcblx0XHRcdGlmIChleHRzW2ldLm9pZCA9PT0gRVhUUy5hbHROYW1lKSB7XHJcblx0XHRcdFx0ZGVyLnN0YXJ0U2VxdWVuY2UoYXNuMS5CZXIuT2N0ZXRTdHJpbmcpO1xyXG5cdFx0XHRcdGRlci5zdGFydFNlcXVlbmNlKCk7XHJcblx0XHRcdFx0aWYgKHN1YmplY3QudHlwZSA9PT0gJ2hvc3QnKSB7XHJcblx0XHRcdFx0XHRkZXIud3JpdGVTdHJpbmcoc3ViamVjdC5ob3N0bmFtZSxcclxuXHRcdFx0XHRcdCAgICBDb250ZXh0KDIpKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Zm9yICh2YXIgaiA9IDA7IGogPCBhbHROYW1lcy5sZW5ndGg7ICsraikge1xyXG5cdFx0XHRcdFx0aWYgKGFsdE5hbWVzW2pdLnR5cGUgPT09ICdob3N0Jykge1xyXG5cdFx0XHRcdFx0XHRkZXIud3JpdGVTdHJpbmcoXHJcblx0XHRcdFx0XHRcdCAgICBhbHROYW1lc1tqXS5ob3N0bmFtZSxcclxuXHRcdFx0XHRcdFx0ICAgIEFMVE5BTUUuRE5TTmFtZSk7XHJcblx0XHRcdFx0XHR9IGVsc2UgaWYgKGFsdE5hbWVzW2pdLnR5cGUgPT09XHJcblx0XHRcdFx0XHQgICAgJ2VtYWlsJykge1xyXG5cdFx0XHRcdFx0XHRkZXIud3JpdGVTdHJpbmcoXHJcblx0XHRcdFx0XHRcdCAgICBhbHROYW1lc1tqXS5lbWFpbCxcclxuXHRcdFx0XHRcdFx0ICAgIEFMVE5BTUUuUkZDODIyTmFtZSk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHQvKlxyXG5cdFx0XHRcdFx0XHQgKiBFbmNvZGUgYW55dGhpbmcgZWxzZSBhcyBhXHJcblx0XHRcdFx0XHRcdCAqIEROIHN0eWxlIG5hbWUgZm9yIG5vdy5cclxuXHRcdFx0XHRcdFx0ICovXHJcblx0XHRcdFx0XHRcdGRlci5zdGFydFNlcXVlbmNlKFxyXG5cdFx0XHRcdFx0XHQgICAgQUxUTkFNRS5EaXJlY3RvcnlOYW1lKTtcclxuXHRcdFx0XHRcdFx0YWx0TmFtZXNbal0udG9Bc24xKGRlcik7XHJcblx0XHRcdFx0XHRcdGRlci5lbmRTZXF1ZW5jZSgpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRkZXIuZW5kU2VxdWVuY2UoKTtcclxuXHRcdFx0XHRkZXIuZW5kU2VxdWVuY2UoKTtcclxuXHRcdFx0fSBlbHNlIGlmIChleHRzW2ldLm9pZCA9PT0gRVhUUy5iYXNpY0NvbnN0cmFpbnRzKSB7XHJcblx0XHRcdFx0ZGVyLnN0YXJ0U2VxdWVuY2UoYXNuMS5CZXIuT2N0ZXRTdHJpbmcpO1xyXG5cdFx0XHRcdGRlci5zdGFydFNlcXVlbmNlKCk7XHJcblx0XHRcdFx0dmFyIGNhID0gKGNlcnQucHVycG9zZXMuaW5kZXhPZignY2EnKSAhPT0gLTEpO1xyXG5cdFx0XHRcdHZhciBwYXRoTGVuID0gZXh0c1tpXS5wYXRoTGVuO1xyXG5cdFx0XHRcdGRlci53cml0ZUJvb2xlYW4oY2EpO1xyXG5cdFx0XHRcdGlmIChwYXRoTGVuICE9PSB1bmRlZmluZWQpXHJcblx0XHRcdFx0XHRkZXIud3JpdGVJbnQocGF0aExlbik7XHJcblx0XHRcdFx0ZGVyLmVuZFNlcXVlbmNlKCk7XHJcblx0XHRcdFx0ZGVyLmVuZFNlcXVlbmNlKCk7XHJcblx0XHRcdH0gZWxzZSBpZiAoZXh0c1tpXS5vaWQgPT09IEVYVFMuZXh0S2V5VXNhZ2UpIHtcclxuXHRcdFx0XHRkZXIuc3RhcnRTZXF1ZW5jZShhc24xLkJlci5PY3RldFN0cmluZyk7XHJcblx0XHRcdFx0ZGVyLnN0YXJ0U2VxdWVuY2UoKTtcclxuXHRcdFx0XHRjZXJ0LnB1cnBvc2VzLmZvckVhY2goZnVuY3Rpb24gKHB1cnBvc2UpIHtcclxuXHRcdFx0XHRcdGlmIChwdXJwb3NlID09PSAnY2EnKVxyXG5cdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHRpZiAoS0VZVVNFQklUUy5pbmRleE9mKHB1cnBvc2UpICE9PSAtMSlcclxuXHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0dmFyIG9pZCA9IHB1cnBvc2U7XHJcblx0XHRcdFx0XHRpZiAoRVhUUFVSUE9TRVtwdXJwb3NlXSAhPT0gdW5kZWZpbmVkKVxyXG5cdFx0XHRcdFx0XHRvaWQgPSBFWFRQVVJQT1NFW3B1cnBvc2VdO1xyXG5cdFx0XHRcdFx0ZGVyLndyaXRlT0lEKG9pZCk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdFx0ZGVyLmVuZFNlcXVlbmNlKCk7XHJcblx0XHRcdFx0ZGVyLmVuZFNlcXVlbmNlKCk7XHJcblx0XHRcdH0gZWxzZSBpZiAoZXh0c1tpXS5vaWQgPT09IEVYVFMua2V5VXNhZ2UpIHtcclxuXHRcdFx0XHRkZXIuc3RhcnRTZXF1ZW5jZShhc24xLkJlci5PY3RldFN0cmluZyk7XHJcblx0XHRcdFx0LypcclxuXHRcdFx0XHQgKiBJZiB3ZSBwYXJzZWQgdGhpcyBjZXJ0aWZpY2F0ZSBmcm9tIGEgYnl0ZVxyXG5cdFx0XHRcdCAqIHN0cmVhbSAoaS5lLiB3ZSBkaWRuJ3QgZ2VuZXJhdGUgaXQgaW4gc3NocGspXHJcblx0XHRcdFx0ICogdGhlbiB3ZSdsbCBoYXZlIGEgXCIuYml0c1wiIHByb3BlcnR5IG9uIHRoZVxyXG5cdFx0XHRcdCAqIGV4dCB3aXRoIHRoZSBvcmlnaW5hbCByYXcgYnl0ZSBjb250ZW50cy5cclxuXHRcdFx0XHQgKlxyXG5cdFx0XHRcdCAqIElmIHdlIGhhdmUgdGhpcywgdXNlIGl0IGhlcmUgaW5zdGVhZCBvZlxyXG5cdFx0XHRcdCAqIHJlZ2VuZXJhdGluZyBpdC4gVGhpcyBndWFyYW50ZWVzIHdlIG91dHB1dFxyXG5cdFx0XHRcdCAqIHRoZSBzYW1lIGRhdGEgd2UgcGFyc2VkLCBzbyBzaWduYXR1cmVzIHN0aWxsXHJcblx0XHRcdFx0ICogdmFsaWRhdGUuXHJcblx0XHRcdFx0ICovXHJcblx0XHRcdFx0aWYgKGV4dHNbaV0uYml0cyAhPT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdFx0XHRkZXIud3JpdGVCdWZmZXIoZXh0c1tpXS5iaXRzLFxyXG5cdFx0XHRcdFx0ICAgIGFzbjEuQmVyLkJpdFN0cmluZyk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHZhciBiaXRzID0gd3JpdGVCaXRGaWVsZChjZXJ0LnB1cnBvc2VzLFxyXG5cdFx0XHRcdFx0ICAgIEtFWVVTRUJJVFMpO1xyXG5cdFx0XHRcdFx0ZGVyLndyaXRlQnVmZmVyKGJpdHMsXHJcblx0XHRcdFx0XHQgICAgYXNuMS5CZXIuQml0U3RyaW5nKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZGVyLmVuZFNlcXVlbmNlKCk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0ZGVyLndyaXRlQnVmZmVyKGV4dHNbaV0uZGF0YSxcclxuXHRcdFx0XHQgICAgYXNuMS5CZXIuT2N0ZXRTdHJpbmcpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRkZXIuZW5kU2VxdWVuY2UoKTtcclxuXHRcdH1cclxuXHJcblx0XHRkZXIuZW5kU2VxdWVuY2UoKTtcclxuXHRcdGRlci5lbmRTZXF1ZW5jZSgpO1xyXG5cdH1cclxuXHJcblx0ZGVyLmVuZFNlcXVlbmNlKCk7XHJcbn1cclxuXHJcbi8qXHJcbiAqIFJlYWRzIGFuIEFTTi4xIEJFUiBiaXRmaWVsZCBvdXQgb2YgdGhlIEJ1ZmZlciBwcm9kdWNlZCBieSBkb2luZ1xyXG4gKiBgQmVyUmVhZGVyI3JlYWRTdHJpbmcoYXNuMS5CZXIuQml0U3RyaW5nKWAuIFRoYXQgZnVuY3Rpb24gZ2l2ZXMgdXMgdGhlIHJhd1xyXG4gKiBjb250ZW50cyBvZiB0aGUgQml0U3RyaW5nIHRhZywgd2hpY2ggaXMgYSBjb3VudCBvZiB1bnVzZWQgYml0cyBmb2xsb3dlZCBieVxyXG4gKiB0aGUgYml0cyBhcyBhIHJpZ2h0LXBhZGRlZCBieXRlIHN0cmluZy5cclxuICpcclxuICogYGJpdHNgIGlzIHRoZSBCdWZmZXIsIGBiaXRJbmRleGAgc2hvdWxkIGNvbnRhaW4gYW4gYXJyYXkgb2Ygc3RyaW5nIG5hbWVzXHJcbiAqIGZvciB0aGUgYml0cyBpbiB0aGUgc3RyaW5nLCBvcmRlcmVkIHN0YXJ0aW5nIHdpdGggYml0ICMwIGluIHRoZSBBU04uMSBzcGVjLlxyXG4gKlxyXG4gKiBSZXR1cm5zIGFuIGFycmF5IG9mIFN0cmluZ3MsIHRoZSBuYW1lcyBvZiB0aGUgYml0cyB0aGF0IHdlcmUgc2V0IHRvIDEuXHJcbiAqL1xyXG5mdW5jdGlvbiByZWFkQml0RmllbGQoYml0cywgYml0SW5kZXgpIHtcclxuXHR2YXIgYml0TGVuID0gOCAqIChiaXRzLmxlbmd0aCAtIDEpIC0gYml0c1swXTtcclxuXHR2YXIgc2V0Qml0cyA9IHt9O1xyXG5cdGZvciAodmFyIGkgPSAwOyBpIDwgYml0TGVuOyArK2kpIHtcclxuXHRcdHZhciBieXRlTiA9IDEgKyBNYXRoLmZsb29yKGkgLyA4KTtcclxuXHRcdHZhciBiaXQgPSA3IC0gKGkgJSA4KTtcclxuXHRcdHZhciBtYXNrID0gMSA8PCBiaXQ7XHJcblx0XHR2YXIgYml0VmFsID0gKChiaXRzW2J5dGVOXSAmIG1hc2spICE9PSAwKTtcclxuXHRcdHZhciBuYW1lID0gYml0SW5kZXhbaV07XHJcblx0XHRpZiAoYml0VmFsICYmIHR5cGVvZiAobmFtZSkgPT09ICdzdHJpbmcnKSB7XHJcblx0XHRcdHNldEJpdHNbbmFtZV0gPSB0cnVlO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRyZXR1cm4gKE9iamVjdC5rZXlzKHNldEJpdHMpKTtcclxufVxyXG5cclxuLypcclxuICogYHNldEJpdHNgIGlzIGFuIGFycmF5IG9mIHN0cmluZ3MsIGNvbnRhaW5pbmcgdGhlIG5hbWVzIGZvciBlYWNoIGJpdCB0aGF0XHJcbiAqIHNvdWxkIGJlIHNldCB0byAxLiBgYml0SW5kZXhgIGlzIHNhbWUgYXMgaW4gYHJlYWRCaXRGaWVsZCgpYC5cclxuICpcclxuICogUmV0dXJucyBhIEJ1ZmZlciwgcmVhZHkgdG8gYmUgd3JpdHRlbiBvdXQgd2l0aCBgQmVyV3JpdGVyI3dyaXRlU3RyaW5nKClgLlxyXG4gKi9cclxuZnVuY3Rpb24gd3JpdGVCaXRGaWVsZChzZXRCaXRzLCBiaXRJbmRleCkge1xyXG5cdHZhciBiaXRMZW4gPSBiaXRJbmRleC5sZW5ndGg7XHJcblx0dmFyIGJsZW4gPSBNYXRoLmNlaWwoYml0TGVuIC8gOCk7XHJcblx0dmFyIHVudXNlZCA9IGJsZW4gKiA4IC0gYml0TGVuO1xyXG5cdHZhciBiaXRzID0gQnVmZmVyLmFsbG9jKDEgKyBibGVuKTsgLy8gemVyby1maWxsZWRcclxuXHRiaXRzWzBdID0gdW51c2VkO1xyXG5cdGZvciAodmFyIGkgPSAwOyBpIDwgYml0TGVuOyArK2kpIHtcclxuXHRcdHZhciBieXRlTiA9IDEgKyBNYXRoLmZsb29yKGkgLyA4KTtcclxuXHRcdHZhciBiaXQgPSA3IC0gKGkgJSA4KTtcclxuXHRcdHZhciBtYXNrID0gMSA8PCBiaXQ7XHJcblx0XHR2YXIgbmFtZSA9IGJpdEluZGV4W2ldO1xyXG5cdFx0aWYgKG5hbWUgPT09IHVuZGVmaW5lZClcclxuXHRcdFx0Y29udGludWU7XHJcblx0XHR2YXIgYml0VmFsID0gKHNldEJpdHMuaW5kZXhPZihuYW1lKSAhPT0gLTEpO1xyXG5cdFx0aWYgKGJpdFZhbCkge1xyXG5cdFx0XHRiaXRzW2J5dGVOXSB8PSBtYXNrO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRyZXR1cm4gKGJpdHMpO1xyXG59XHJcbiIsIi8vIENvcHlyaWdodCAyMDE3IEpveWVudCwgSW5jLlxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBQcml2YXRlS2V5O1xyXG5cclxudmFyIGFzc2VydCA9IHJlcXVpcmUoJ2Fzc2VydC1wbHVzJyk7XHJcbnZhciBCdWZmZXIgPSByZXF1aXJlKCdzYWZlci1idWZmZXInKS5CdWZmZXI7XHJcbnZhciBhbGdzID0gcmVxdWlyZSgnLi9hbGdzJyk7XHJcbnZhciBjcnlwdG8gPSByZXF1aXJlKCdjcnlwdG8nKTtcclxudmFyIEZpbmdlcnByaW50ID0gcmVxdWlyZSgnLi9maW5nZXJwcmludCcpO1xyXG52YXIgU2lnbmF0dXJlID0gcmVxdWlyZSgnLi9zaWduYXR1cmUnKTtcclxudmFyIGVycnMgPSByZXF1aXJlKCcuL2Vycm9ycycpO1xyXG52YXIgdXRpbCA9IHJlcXVpcmUoJ3V0aWwnKTtcclxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xyXG52YXIgZGhlID0gcmVxdWlyZSgnLi9kaGUnKTtcclxudmFyIGdlbmVyYXRlRUNEU0EgPSBkaGUuZ2VuZXJhdGVFQ0RTQTtcclxudmFyIGdlbmVyYXRlRUQyNTUxOSA9IGRoZS5nZW5lcmF0ZUVEMjU1MTk7XHJcbnZhciBlZENvbXBhdCA9IHJlcXVpcmUoJy4vZWQtY29tcGF0Jyk7XHJcbnZhciBuYWNsID0gcmVxdWlyZSgndHdlZXRuYWNsJyk7XHJcblxyXG52YXIgS2V5ID0gcmVxdWlyZSgnLi9rZXknKTtcclxuXHJcbnZhciBJbnZhbGlkQWxnb3JpdGhtRXJyb3IgPSBlcnJzLkludmFsaWRBbGdvcml0aG1FcnJvcjtcclxudmFyIEtleVBhcnNlRXJyb3IgPSBlcnJzLktleVBhcnNlRXJyb3I7XHJcbnZhciBLZXlFbmNyeXB0ZWRFcnJvciA9IGVycnMuS2V5RW5jcnlwdGVkRXJyb3I7XHJcblxyXG52YXIgZm9ybWF0cyA9IHt9O1xyXG5mb3JtYXRzWydhdXRvJ10gPSByZXF1aXJlKCcuL2Zvcm1hdHMvYXV0bycpO1xyXG5mb3JtYXRzWydwZW0nXSA9IHJlcXVpcmUoJy4vZm9ybWF0cy9wZW0nKTtcclxuZm9ybWF0c1sncGtjczEnXSA9IHJlcXVpcmUoJy4vZm9ybWF0cy9wa2NzMScpO1xyXG5mb3JtYXRzWydwa2NzOCddID0gcmVxdWlyZSgnLi9mb3JtYXRzL3BrY3M4Jyk7XHJcbmZvcm1hdHNbJ3JmYzQyNTMnXSA9IHJlcXVpcmUoJy4vZm9ybWF0cy9yZmM0MjUzJyk7XHJcbmZvcm1hdHNbJ3NzaC1wcml2YXRlJ10gPSByZXF1aXJlKCcuL2Zvcm1hdHMvc3NoLXByaXZhdGUnKTtcclxuZm9ybWF0c1snb3BlbnNzaCddID0gZm9ybWF0c1snc3NoLXByaXZhdGUnXTtcclxuZm9ybWF0c1snc3NoJ10gPSBmb3JtYXRzWydzc2gtcHJpdmF0ZSddO1xyXG5mb3JtYXRzWydkbnNzZWMnXSA9IHJlcXVpcmUoJy4vZm9ybWF0cy9kbnNzZWMnKTtcclxuXHJcbmZ1bmN0aW9uIFByaXZhdGVLZXkob3B0cykge1xyXG5cdGFzc2VydC5vYmplY3Qob3B0cywgJ29wdGlvbnMnKTtcclxuXHRLZXkuY2FsbCh0aGlzLCBvcHRzKTtcclxuXHJcblx0dGhpcy5fcHViQ2FjaGUgPSB1bmRlZmluZWQ7XHJcbn1cclxudXRpbC5pbmhlcml0cyhQcml2YXRlS2V5LCBLZXkpO1xyXG5cclxuUHJpdmF0ZUtleS5mb3JtYXRzID0gZm9ybWF0cztcclxuXHJcblByaXZhdGVLZXkucHJvdG90eXBlLnRvQnVmZmVyID0gZnVuY3Rpb24gKGZvcm1hdCwgb3B0aW9ucykge1xyXG5cdGlmIChmb3JtYXQgPT09IHVuZGVmaW5lZClcclxuXHRcdGZvcm1hdCA9ICdwa2NzMSc7XHJcblx0YXNzZXJ0LnN0cmluZyhmb3JtYXQsICdmb3JtYXQnKTtcclxuXHRhc3NlcnQub2JqZWN0KGZvcm1hdHNbZm9ybWF0XSwgJ2Zvcm1hdHNbZm9ybWF0XScpO1xyXG5cdGFzc2VydC5vcHRpb25hbE9iamVjdChvcHRpb25zLCAnb3B0aW9ucycpO1xyXG5cclxuXHRyZXR1cm4gKGZvcm1hdHNbZm9ybWF0XS53cml0ZSh0aGlzLCBvcHRpb25zKSk7XHJcbn07XHJcblxyXG5Qcml2YXRlS2V5LnByb3RvdHlwZS5oYXNoID0gZnVuY3Rpb24gKGFsZ28sIHR5cGUpIHtcclxuXHRyZXR1cm4gKHRoaXMudG9QdWJsaWMoKS5oYXNoKGFsZ28sIHR5cGUpKTtcclxufTtcclxuXHJcblByaXZhdGVLZXkucHJvdG90eXBlLmZpbmdlcnByaW50ID0gZnVuY3Rpb24gKGFsZ28sIHR5cGUpIHtcclxuXHRyZXR1cm4gKHRoaXMudG9QdWJsaWMoKS5maW5nZXJwcmludChhbGdvLCB0eXBlKSk7XHJcbn07XHJcblxyXG5Qcml2YXRlS2V5LnByb3RvdHlwZS50b1B1YmxpYyA9IGZ1bmN0aW9uICgpIHtcclxuXHRpZiAodGhpcy5fcHViQ2FjaGUpXHJcblx0XHRyZXR1cm4gKHRoaXMuX3B1YkNhY2hlKTtcclxuXHJcblx0dmFyIGFsZ0luZm8gPSBhbGdzLmluZm9bdGhpcy50eXBlXTtcclxuXHR2YXIgcHViUGFydHMgPSBbXTtcclxuXHRmb3IgKHZhciBpID0gMDsgaSA8IGFsZ0luZm8ucGFydHMubGVuZ3RoOyArK2kpIHtcclxuXHRcdHZhciBwID0gYWxnSW5mby5wYXJ0c1tpXTtcclxuXHRcdHB1YlBhcnRzLnB1c2godGhpcy5wYXJ0W3BdKTtcclxuXHR9XHJcblxyXG5cdHRoaXMuX3B1YkNhY2hlID0gbmV3IEtleSh7XHJcblx0XHR0eXBlOiB0aGlzLnR5cGUsXHJcblx0XHRzb3VyY2U6IHRoaXMsXHJcblx0XHRwYXJ0czogcHViUGFydHNcclxuXHR9KTtcclxuXHRpZiAodGhpcy5jb21tZW50KVxyXG5cdFx0dGhpcy5fcHViQ2FjaGUuY29tbWVudCA9IHRoaXMuY29tbWVudDtcclxuXHRyZXR1cm4gKHRoaXMuX3B1YkNhY2hlKTtcclxufTtcclxuXHJcblByaXZhdGVLZXkucHJvdG90eXBlLmRlcml2ZSA9IGZ1bmN0aW9uIChuZXdUeXBlKSB7XHJcblx0YXNzZXJ0LnN0cmluZyhuZXdUeXBlLCAndHlwZScpO1xyXG5cdHZhciBwcml2LCBwdWIsIHBhaXI7XHJcblxyXG5cdGlmICh0aGlzLnR5cGUgPT09ICdlZDI1NTE5JyAmJiBuZXdUeXBlID09PSAnY3VydmUyNTUxOScpIHtcclxuXHRcdHByaXYgPSB0aGlzLnBhcnQuay5kYXRhO1xyXG5cdFx0aWYgKHByaXZbMF0gPT09IDB4MDApXHJcblx0XHRcdHByaXYgPSBwcml2LnNsaWNlKDEpO1xyXG5cclxuXHRcdHBhaXIgPSBuYWNsLmJveC5rZXlQYWlyLmZyb21TZWNyZXRLZXkobmV3IFVpbnQ4QXJyYXkocHJpdikpO1xyXG5cdFx0cHViID0gQnVmZmVyLmZyb20ocGFpci5wdWJsaWNLZXkpO1xyXG5cclxuXHRcdHJldHVybiAobmV3IFByaXZhdGVLZXkoe1xyXG5cdFx0XHR0eXBlOiAnY3VydmUyNTUxOScsXHJcblx0XHRcdHBhcnRzOiBbXHJcblx0XHRcdFx0eyBuYW1lOiAnQScsIGRhdGE6IHV0aWxzLm1wTm9ybWFsaXplKHB1YikgfSxcclxuXHRcdFx0XHR7IG5hbWU6ICdrJywgZGF0YTogdXRpbHMubXBOb3JtYWxpemUocHJpdikgfVxyXG5cdFx0XHRdXHJcblx0XHR9KSk7XHJcblx0fSBlbHNlIGlmICh0aGlzLnR5cGUgPT09ICdjdXJ2ZTI1NTE5JyAmJiBuZXdUeXBlID09PSAnZWQyNTUxOScpIHtcclxuXHRcdHByaXYgPSB0aGlzLnBhcnQuay5kYXRhO1xyXG5cdFx0aWYgKHByaXZbMF0gPT09IDB4MDApXHJcblx0XHRcdHByaXYgPSBwcml2LnNsaWNlKDEpO1xyXG5cclxuXHRcdHBhaXIgPSBuYWNsLnNpZ24ua2V5UGFpci5mcm9tU2VlZChuZXcgVWludDhBcnJheShwcml2KSk7XHJcblx0XHRwdWIgPSBCdWZmZXIuZnJvbShwYWlyLnB1YmxpY0tleSk7XHJcblxyXG5cdFx0cmV0dXJuIChuZXcgUHJpdmF0ZUtleSh7XHJcblx0XHRcdHR5cGU6ICdlZDI1NTE5JyxcclxuXHRcdFx0cGFydHM6IFtcclxuXHRcdFx0XHR7IG5hbWU6ICdBJywgZGF0YTogdXRpbHMubXBOb3JtYWxpemUocHViKSB9LFxyXG5cdFx0XHRcdHsgbmFtZTogJ2snLCBkYXRhOiB1dGlscy5tcE5vcm1hbGl6ZShwcml2KSB9XHJcblx0XHRcdF1cclxuXHRcdH0pKTtcclxuXHR9XHJcblx0dGhyb3cgKG5ldyBFcnJvcignS2V5IGRlcml2YXRpb24gbm90IHN1cHBvcnRlZCBmcm9tICcgKyB0aGlzLnR5cGUgK1xyXG5cdCAgICAnIHRvICcgKyBuZXdUeXBlKSk7XHJcbn07XHJcblxyXG5Qcml2YXRlS2V5LnByb3RvdHlwZS5jcmVhdGVWZXJpZnkgPSBmdW5jdGlvbiAoaGFzaEFsZ28pIHtcclxuXHRyZXR1cm4gKHRoaXMudG9QdWJsaWMoKS5jcmVhdGVWZXJpZnkoaGFzaEFsZ28pKTtcclxufTtcclxuXHJcblByaXZhdGVLZXkucHJvdG90eXBlLmNyZWF0ZVNpZ24gPSBmdW5jdGlvbiAoaGFzaEFsZ28pIHtcclxuXHRpZiAoaGFzaEFsZ28gPT09IHVuZGVmaW5lZClcclxuXHRcdGhhc2hBbGdvID0gdGhpcy5kZWZhdWx0SGFzaEFsZ29yaXRobSgpO1xyXG5cdGFzc2VydC5zdHJpbmcoaGFzaEFsZ28sICdoYXNoIGFsZ29yaXRobScpO1xyXG5cclxuXHQvKiBFRDI1NTE5IGlzIG5vdCBzdXBwb3J0ZWQgYnkgT3BlblNTTCwgdXNlIGEgamF2YXNjcmlwdCBpbXBsLiAqL1xyXG5cdGlmICh0aGlzLnR5cGUgPT09ICdlZDI1NTE5JyAmJiBlZENvbXBhdCAhPT0gdW5kZWZpbmVkKVxyXG5cdFx0cmV0dXJuIChuZXcgZWRDb21wYXQuU2lnbmVyKHRoaXMsIGhhc2hBbGdvKSk7XHJcblx0aWYgKHRoaXMudHlwZSA9PT0gJ2N1cnZlMjU1MTknKVxyXG5cdFx0dGhyb3cgKG5ldyBFcnJvcignQ3VydmUyNTUxOSBrZXlzIGFyZSBub3Qgc3VpdGFibGUgZm9yICcgK1xyXG5cdFx0ICAgICdzaWduaW5nIG9yIHZlcmlmaWNhdGlvbicpKTtcclxuXHJcblx0dmFyIHYsIG5tLCBlcnI7XHJcblx0dHJ5IHtcclxuXHRcdG5tID0gaGFzaEFsZ28udG9VcHBlckNhc2UoKTtcclxuXHRcdHYgPSBjcnlwdG8uY3JlYXRlU2lnbihubSk7XHJcblx0fSBjYXRjaCAoZSkge1xyXG5cdFx0ZXJyID0gZTtcclxuXHR9XHJcblx0aWYgKHYgPT09IHVuZGVmaW5lZCB8fCAoZXJyIGluc3RhbmNlb2YgRXJyb3IgJiZcclxuXHQgICAgZXJyLm1lc3NhZ2UubWF0Y2goL1Vua25vd24gbWVzc2FnZSBkaWdlc3QvKSkpIHtcclxuXHRcdG5tID0gJ1JTQS0nO1xyXG5cdFx0bm0gKz0gaGFzaEFsZ28udG9VcHBlckNhc2UoKTtcclxuXHRcdHYgPSBjcnlwdG8uY3JlYXRlU2lnbihubSk7XHJcblx0fVxyXG5cdGFzc2VydC5vayh2LCAnZmFpbGVkIHRvIGNyZWF0ZSB2ZXJpZmllcicpO1xyXG5cdHZhciBvbGRTaWduID0gdi5zaWduLmJpbmQodik7XHJcblx0dmFyIGtleSA9IHRoaXMudG9CdWZmZXIoJ3BrY3MxJyk7XHJcblx0dmFyIHR5cGUgPSB0aGlzLnR5cGU7XHJcblx0dmFyIGN1cnZlID0gdGhpcy5jdXJ2ZTtcclxuXHR2LnNpZ24gPSBmdW5jdGlvbiAoKSB7XHJcblx0XHR2YXIgc2lnID0gb2xkU2lnbihrZXkpO1xyXG5cdFx0aWYgKHR5cGVvZiAoc2lnKSA9PT0gJ3N0cmluZycpXHJcblx0XHRcdHNpZyA9IEJ1ZmZlci5mcm9tKHNpZywgJ2JpbmFyeScpO1xyXG5cdFx0c2lnID0gU2lnbmF0dXJlLnBhcnNlKHNpZywgdHlwZSwgJ2FzbjEnKTtcclxuXHRcdHNpZy5oYXNoQWxnb3JpdGhtID0gaGFzaEFsZ287XHJcblx0XHRzaWcuY3VydmUgPSBjdXJ2ZTtcclxuXHRcdHJldHVybiAoc2lnKTtcclxuXHR9O1xyXG5cdHJldHVybiAodik7XHJcbn07XHJcblxyXG5Qcml2YXRlS2V5LnBhcnNlID0gZnVuY3Rpb24gKGRhdGEsIGZvcm1hdCwgb3B0aW9ucykge1xyXG5cdGlmICh0eXBlb2YgKGRhdGEpICE9PSAnc3RyaW5nJylcclxuXHRcdGFzc2VydC5idWZmZXIoZGF0YSwgJ2RhdGEnKTtcclxuXHRpZiAoZm9ybWF0ID09PSB1bmRlZmluZWQpXHJcblx0XHRmb3JtYXQgPSAnYXV0byc7XHJcblx0YXNzZXJ0LnN0cmluZyhmb3JtYXQsICdmb3JtYXQnKTtcclxuXHRpZiAodHlwZW9mIChvcHRpb25zKSA9PT0gJ3N0cmluZycpXHJcblx0XHRvcHRpb25zID0geyBmaWxlbmFtZTogb3B0aW9ucyB9O1xyXG5cdGFzc2VydC5vcHRpb25hbE9iamVjdChvcHRpb25zLCAnb3B0aW9ucycpO1xyXG5cdGlmIChvcHRpb25zID09PSB1bmRlZmluZWQpXHJcblx0XHRvcHRpb25zID0ge307XHJcblx0YXNzZXJ0Lm9wdGlvbmFsU3RyaW5nKG9wdGlvbnMuZmlsZW5hbWUsICdvcHRpb25zLmZpbGVuYW1lJyk7XHJcblx0aWYgKG9wdGlvbnMuZmlsZW5hbWUgPT09IHVuZGVmaW5lZClcclxuXHRcdG9wdGlvbnMuZmlsZW5hbWUgPSAnKHVubmFtZWQpJztcclxuXHJcblx0YXNzZXJ0Lm9iamVjdChmb3JtYXRzW2Zvcm1hdF0sICdmb3JtYXRzW2Zvcm1hdF0nKTtcclxuXHJcblx0dHJ5IHtcclxuXHRcdHZhciBrID0gZm9ybWF0c1tmb3JtYXRdLnJlYWQoZGF0YSwgb3B0aW9ucyk7XHJcblx0XHRhc3NlcnQub2soayBpbnN0YW5jZW9mIFByaXZhdGVLZXksICdrZXkgaXMgbm90IGEgcHJpdmF0ZSBrZXknKTtcclxuXHRcdGlmICghay5jb21tZW50KVxyXG5cdFx0XHRrLmNvbW1lbnQgPSBvcHRpb25zLmZpbGVuYW1lO1xyXG5cdFx0cmV0dXJuIChrKTtcclxuXHR9IGNhdGNoIChlKSB7XHJcblx0XHRpZiAoZS5uYW1lID09PSAnS2V5RW5jcnlwdGVkRXJyb3InKVxyXG5cdFx0XHR0aHJvdyAoZSk7XHJcblx0XHR0aHJvdyAobmV3IEtleVBhcnNlRXJyb3Iob3B0aW9ucy5maWxlbmFtZSwgZm9ybWF0LCBlKSk7XHJcblx0fVxyXG59O1xyXG5cclxuUHJpdmF0ZUtleS5pc1ByaXZhdGVLZXkgPSBmdW5jdGlvbiAob2JqLCB2ZXIpIHtcclxuXHRyZXR1cm4gKHV0aWxzLmlzQ29tcGF0aWJsZShvYmosIFByaXZhdGVLZXksIHZlcikpO1xyXG59O1xyXG5cclxuUHJpdmF0ZUtleS5nZW5lcmF0ZSA9IGZ1bmN0aW9uICh0eXBlLCBvcHRpb25zKSB7XHJcblx0aWYgKG9wdGlvbnMgPT09IHVuZGVmaW5lZClcclxuXHRcdG9wdGlvbnMgPSB7fTtcclxuXHRhc3NlcnQub2JqZWN0KG9wdGlvbnMsICdvcHRpb25zJyk7XHJcblxyXG5cdHN3aXRjaCAodHlwZSkge1xyXG5cdGNhc2UgJ2VjZHNhJzpcclxuXHRcdGlmIChvcHRpb25zLmN1cnZlID09PSB1bmRlZmluZWQpXHJcblx0XHRcdG9wdGlvbnMuY3VydmUgPSAnbmlzdHAyNTYnO1xyXG5cdFx0YXNzZXJ0LnN0cmluZyhvcHRpb25zLmN1cnZlLCAnb3B0aW9ucy5jdXJ2ZScpO1xyXG5cdFx0cmV0dXJuIChnZW5lcmF0ZUVDRFNBKG9wdGlvbnMuY3VydmUpKTtcclxuXHRjYXNlICdlZDI1NTE5JzpcclxuXHRcdHJldHVybiAoZ2VuZXJhdGVFRDI1NTE5KCkpO1xyXG5cdGRlZmF1bHQ6XHJcblx0XHR0aHJvdyAobmV3IEVycm9yKCdLZXkgZ2VuZXJhdGlvbiBub3Qgc3VwcG9ydGVkIHdpdGgga2V5ICcgK1xyXG5cdFx0ICAgICd0eXBlIFwiJyArIHR5cGUgKyAnXCInKSk7XHJcblx0fVxyXG59O1xyXG5cclxuLypcclxuICogQVBJIHZlcnNpb25zIGZvciBQcml2YXRlS2V5OlxyXG4gKiBbMSwwXSAtLSBpbml0aWFsIHZlclxyXG4gKiBbMSwxXSAtLSBhZGRlZCBhdXRvLCBwa2NzWzE4XSwgb3BlbnNzaC9zc2gtcHJpdmF0ZSBmb3JtYXRzXHJcbiAqIFsxLDJdIC0tIGFkZGVkIGRlZmF1bHRIYXNoQWxnb3JpdGhtXHJcbiAqIFsxLDNdIC0tIGFkZGVkIGRlcml2ZSwgZWQsIGNyZWF0ZURIXHJcbiAqIFsxLDRdIC0tIGZpcnN0IHRhZ2dlZCB2ZXJzaW9uXHJcbiAqIFsxLDVdIC0tIGNoYW5nZWQgZWQyNTUxOSBwYXJ0IG5hbWVzIGFuZCBmb3JtYXRcclxuICogWzEsNl0gLS0gdHlwZSBhcmd1bWVudHMgZm9yIGhhc2goKSBhbmQgZmluZ2VycHJpbnQoKVxyXG4gKi9cclxuUHJpdmF0ZUtleS5wcm90b3R5cGUuX3NzaHBrQXBpVmVyc2lvbiA9IFsxLCA2XTtcclxuXHJcblByaXZhdGVLZXkuX29sZFZlcnNpb25EZXRlY3QgPSBmdW5jdGlvbiAob2JqKSB7XHJcblx0YXNzZXJ0LmZ1bmMob2JqLnRvUHVibGljKTtcclxuXHRhc3NlcnQuZnVuYyhvYmouY3JlYXRlU2lnbik7XHJcblx0aWYgKG9iai5kZXJpdmUpXHJcblx0XHRyZXR1cm4gKFsxLCAzXSk7XHJcblx0aWYgKG9iai5kZWZhdWx0SGFzaEFsZ29yaXRobSlcclxuXHRcdHJldHVybiAoWzEsIDJdKTtcclxuXHRpZiAob2JqLmZvcm1hdHNbJ2F1dG8nXSlcclxuXHRcdHJldHVybiAoWzEsIDFdKTtcclxuXHRyZXR1cm4gKFsxLCAwXSk7XHJcbn07XHJcbiIsIi8vIENvcHlyaWdodCAyMDE4IEpveWVudCwgSW5jLlxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcblx0cmVhZDogcmVhZCxcclxuXHR3cml0ZTogd3JpdGVcclxufTtcclxuXHJcbnZhciBhc3NlcnQgPSByZXF1aXJlKCdhc3NlcnQtcGx1cycpO1xyXG52YXIgYXNuMSA9IHJlcXVpcmUoJ2FzbjEnKTtcclxudmFyIGNyeXB0byA9IHJlcXVpcmUoJ2NyeXB0bycpO1xyXG52YXIgQnVmZmVyID0gcmVxdWlyZSgnc2FmZXItYnVmZmVyJykuQnVmZmVyO1xyXG52YXIgYWxncyA9IHJlcXVpcmUoJy4uL2FsZ3MnKTtcclxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbHMnKTtcclxudmFyIEtleSA9IHJlcXVpcmUoJy4uL2tleScpO1xyXG52YXIgUHJpdmF0ZUtleSA9IHJlcXVpcmUoJy4uL3ByaXZhdGUta2V5Jyk7XHJcblxyXG52YXIgcGtjczEgPSByZXF1aXJlKCcuL3BrY3MxJyk7XHJcbnZhciBwa2NzOCA9IHJlcXVpcmUoJy4vcGtjczgnKTtcclxudmFyIHNzaHByaXYgPSByZXF1aXJlKCcuL3NzaC1wcml2YXRlJyk7XHJcbnZhciByZmM0MjUzID0gcmVxdWlyZSgnLi9yZmM0MjUzJyk7XHJcblxyXG52YXIgZXJyb3JzID0gcmVxdWlyZSgnLi4vZXJyb3JzJyk7XHJcblxyXG52YXIgT0lEX1BCRVMyID0gJzEuMi44NDAuMTEzNTQ5LjEuNS4xMyc7XHJcbnZhciBPSURfUEJLREYyID0gJzEuMi44NDAuMTEzNTQ5LjEuNS4xMic7XHJcblxyXG52YXIgT0lEX1RPX0NJUEhFUiA9IHtcclxuXHQnMS4yLjg0MC4xMTM1NDkuMy43JzogJzNkZXMtY2JjJyxcclxuXHQnMi4xNi44NDAuMS4xMDEuMy40LjEuMic6ICdhZXMxMjgtY2JjJyxcclxuXHQnMi4xNi44NDAuMS4xMDEuMy40LjEuNDInOiAnYWVzMjU2LWNiYydcclxufTtcclxudmFyIENJUEhFUl9UT19PSUQgPSB7fTtcclxuT2JqZWN0LmtleXMoT0lEX1RPX0NJUEhFUikuZm9yRWFjaChmdW5jdGlvbiAoaykge1xyXG5cdENJUEhFUl9UT19PSURbT0lEX1RPX0NJUEhFUltrXV0gPSBrO1xyXG59KTtcclxuXHJcbnZhciBPSURfVE9fSEFTSCA9IHtcclxuXHQnMS4yLjg0MC4xMTM1NDkuMi43JzogJ3NoYTEnLFxyXG5cdCcxLjIuODQwLjExMzU0OS4yLjknOiAnc2hhMjU2JyxcclxuXHQnMS4yLjg0MC4xMTM1NDkuMi4xMSc6ICdzaGE1MTInXHJcbn07XHJcbnZhciBIQVNIX1RPX09JRCA9IHt9O1xyXG5PYmplY3Qua2V5cyhPSURfVE9fSEFTSCkuZm9yRWFjaChmdW5jdGlvbiAoaykge1xyXG5cdEhBU0hfVE9fT0lEW09JRF9UT19IQVNIW2tdXSA9IGs7XHJcbn0pO1xyXG5cclxuLypcclxuICogRm9yIHJlYWRpbmcgd2Ugc3VwcG9ydCBib3RoIFBLQ1MjMSBhbmQgUEtDUyM4LiBJZiB3ZSBmaW5kIGEgcHJpdmF0ZSBrZXksXHJcbiAqIHdlIGp1c3QgdGFrZSB0aGUgcHVibGljIGNvbXBvbmVudCBvZiBpdCBhbmQgdXNlIHRoYXQuXHJcbiAqL1xyXG5mdW5jdGlvbiByZWFkKGJ1Ziwgb3B0aW9ucywgZm9yY2VUeXBlKSB7XHJcblx0dmFyIGlucHV0ID0gYnVmO1xyXG5cdGlmICh0eXBlb2YgKGJ1ZikgIT09ICdzdHJpbmcnKSB7XHJcblx0XHRhc3NlcnQuYnVmZmVyKGJ1ZiwgJ2J1ZicpO1xyXG5cdFx0YnVmID0gYnVmLnRvU3RyaW5nKCdhc2NpaScpO1xyXG5cdH1cclxuXHJcblx0dmFyIGxpbmVzID0gYnVmLnRyaW0oKS5zcGxpdCgvW1xcclxcbl0rL2cpO1xyXG5cclxuXHR2YXIgbTtcclxuXHR2YXIgc2kgPSAtMTtcclxuXHR3aGlsZSAoIW0gJiYgc2kgPCBsaW5lcy5sZW5ndGgpIHtcclxuXHRcdG0gPSBsaW5lc1srK3NpXS5tYXRjaCgvKkpTU1RZTEVEKi9cclxuXHRcdCAgICAvWy1dK1sgXSpCRUdJTiAoW0EtWjAtOV1bQS1aYS16MC05XSsgKT8oUFVCTElDfFBSSVZBVEUpIEtFWVsgXSpbLV0rLyk7XHJcblx0fVxyXG5cdGFzc2VydC5vayhtLCAnaW52YWxpZCBQRU0gaGVhZGVyJyk7XHJcblxyXG5cdHZhciBtMjtcclxuXHR2YXIgZWkgPSBsaW5lcy5sZW5ndGg7XHJcblx0d2hpbGUgKCFtMiAmJiBlaSA+IDApIHtcclxuXHRcdG0yID0gbGluZXNbLS1laV0ubWF0Y2goLypKU1NUWUxFRCovXHJcblx0XHQgICAgL1stXStbIF0qRU5EIChbQS1aMC05XVtBLVphLXowLTldKyApPyhQVUJMSUN8UFJJVkFURSkgS0VZWyBdKlstXSsvKTtcclxuXHR9XHJcblx0YXNzZXJ0Lm9rKG0yLCAnaW52YWxpZCBQRU0gZm9vdGVyJyk7XHJcblxyXG5cdC8qIEJlZ2luIGFuZCBlbmQgYmFubmVycyBtdXN0IG1hdGNoIGtleSB0eXBlICovXHJcblx0YXNzZXJ0LmVxdWFsKG1bMl0sIG0yWzJdKTtcclxuXHR2YXIgdHlwZSA9IG1bMl0udG9Mb3dlckNhc2UoKTtcclxuXHJcblx0dmFyIGFsZztcclxuXHRpZiAobVsxXSkge1xyXG5cdFx0LyogVGhleSBhbHNvIG11c3QgbWF0Y2ggYWxnb3JpdGhtcywgaWYgZ2l2ZW4gKi9cclxuXHRcdGFzc2VydC5lcXVhbChtWzFdLCBtMlsxXSwgJ1BFTSBoZWFkZXIgYW5kIGZvb3RlciBtaXNtYXRjaCcpO1xyXG5cdFx0YWxnID0gbVsxXS50cmltKCk7XHJcblx0fVxyXG5cclxuXHRsaW5lcyA9IGxpbmVzLnNsaWNlKHNpLCBlaSArIDEpO1xyXG5cclxuXHR2YXIgaGVhZGVycyA9IHt9O1xyXG5cdHdoaWxlICh0cnVlKSB7XHJcblx0XHRsaW5lcyA9IGxpbmVzLnNsaWNlKDEpO1xyXG5cdFx0bSA9IGxpbmVzWzBdLm1hdGNoKC8qSlNTVFlMRUQqL1xyXG5cdFx0ICAgIC9eKFtBLVphLXowLTktXSspOiAoLispJC8pO1xyXG5cdFx0aWYgKCFtKVxyXG5cdFx0XHRicmVhaztcclxuXHRcdGhlYWRlcnNbbVsxXS50b0xvd2VyQ2FzZSgpXSA9IG1bMl07XHJcblx0fVxyXG5cclxuXHQvKiBDaG9wIG9mZiB0aGUgZmlyc3QgYW5kIGxhc3QgbGluZXMgKi9cclxuXHRsaW5lcyA9IGxpbmVzLnNsaWNlKDAsIC0xKS5qb2luKCcnKTtcclxuXHRidWYgPSBCdWZmZXIuZnJvbShsaW5lcywgJ2Jhc2U2NCcpO1xyXG5cclxuXHR2YXIgY2lwaGVyLCBrZXksIGl2O1xyXG5cdGlmIChoZWFkZXJzWydwcm9jLXR5cGUnXSkge1xyXG5cdFx0dmFyIHBhcnRzID0gaGVhZGVyc1sncHJvYy10eXBlJ10uc3BsaXQoJywnKTtcclxuXHRcdGlmIChwYXJ0c1swXSA9PT0gJzQnICYmIHBhcnRzWzFdID09PSAnRU5DUllQVEVEJykge1xyXG5cdFx0XHRpZiAodHlwZW9mIChvcHRpb25zLnBhc3NwaHJhc2UpID09PSAnc3RyaW5nJykge1xyXG5cdFx0XHRcdG9wdGlvbnMucGFzc3BocmFzZSA9IEJ1ZmZlci5mcm9tKFxyXG5cdFx0XHRcdCAgICBvcHRpb25zLnBhc3NwaHJhc2UsICd1dGYtOCcpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmICghQnVmZmVyLmlzQnVmZmVyKG9wdGlvbnMucGFzc3BocmFzZSkpIHtcclxuXHRcdFx0XHR0aHJvdyAobmV3IGVycm9ycy5LZXlFbmNyeXB0ZWRFcnJvcihcclxuXHRcdFx0XHQgICAgb3B0aW9ucy5maWxlbmFtZSwgJ1BFTScpKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRwYXJ0cyA9IGhlYWRlcnNbJ2Rlay1pbmZvJ10uc3BsaXQoJywnKTtcclxuXHRcdFx0XHRhc3NlcnQub2socGFydHMubGVuZ3RoID09PSAyKTtcclxuXHRcdFx0XHRjaXBoZXIgPSBwYXJ0c1swXS50b0xvd2VyQ2FzZSgpO1xyXG5cdFx0XHRcdGl2ID0gQnVmZmVyLmZyb20ocGFydHNbMV0sICdoZXgnKTtcclxuXHRcdFx0XHRrZXkgPSB1dGlscy5vcGVuc3NsS2V5RGVyaXYoY2lwaGVyLCBpdixcclxuXHRcdFx0XHQgICAgb3B0aW9ucy5wYXNzcGhyYXNlLCAxKS5rZXk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGlmIChhbGcgJiYgYWxnLnRvTG93ZXJDYXNlKCkgPT09ICdlbmNyeXB0ZWQnKSB7XHJcblx0XHR2YXIgZWRlciA9IG5ldyBhc24xLkJlclJlYWRlcihidWYpO1xyXG5cdFx0dmFyIHBiZXNFbmQ7XHJcblx0XHRlZGVyLnJlYWRTZXF1ZW5jZSgpO1xyXG5cclxuXHRcdGVkZXIucmVhZFNlcXVlbmNlKCk7XHJcblx0XHRwYmVzRW5kID0gZWRlci5vZmZzZXQgKyBlZGVyLmxlbmd0aDtcclxuXHJcblx0XHR2YXIgbWV0aG9kID0gZWRlci5yZWFkT0lEKCk7XHJcblx0XHRpZiAobWV0aG9kICE9PSBPSURfUEJFUzIpIHtcclxuXHRcdFx0dGhyb3cgKG5ldyBFcnJvcignVW5zdXBwb3J0ZWQgUEVNL1BLQ1M4IGVuY3J5cHRpb24gJyArXHJcblx0XHRcdCAgICAnc2NoZW1lOiAnICsgbWV0aG9kKSk7XHJcblx0XHR9XHJcblxyXG5cdFx0ZWRlci5yZWFkU2VxdWVuY2UoKTtcdC8qIFBCRVMyLXBhcmFtcyAqL1xyXG5cclxuXHRcdGVkZXIucmVhZFNlcXVlbmNlKCk7XHQvKiBrZXlEZXJpdmF0aW9uRnVuYyAqL1xyXG5cdFx0dmFyIGtkZkVuZCA9IGVkZXIub2Zmc2V0ICsgZWRlci5sZW5ndGg7XHJcblx0XHR2YXIga2RmT2lkID0gZWRlci5yZWFkT0lEKCk7XHJcblx0XHRpZiAoa2RmT2lkICE9PSBPSURfUEJLREYyKVxyXG5cdFx0XHR0aHJvdyAobmV3IEVycm9yKCdVbnN1cHBvcnRlZCBQQkVTMiBLREY6ICcgKyBrZGZPaWQpKTtcclxuXHRcdGVkZXIucmVhZFNlcXVlbmNlKCk7XHJcblx0XHR2YXIgc2FsdCA9IGVkZXIucmVhZFN0cmluZyhhc24xLkJlci5PY3RldFN0cmluZywgdHJ1ZSk7XHJcblx0XHR2YXIgaXRlcmF0aW9ucyA9IGVkZXIucmVhZEludCgpO1xyXG5cdFx0dmFyIGhhc2hBbGcgPSAnc2hhMSc7XHJcblx0XHRpZiAoZWRlci5vZmZzZXQgPCBrZGZFbmQpIHtcclxuXHRcdFx0ZWRlci5yZWFkU2VxdWVuY2UoKTtcclxuXHRcdFx0dmFyIGhhc2hBbGdPaWQgPSBlZGVyLnJlYWRPSUQoKTtcclxuXHRcdFx0aGFzaEFsZyA9IE9JRF9UT19IQVNIW2hhc2hBbGdPaWRdO1xyXG5cdFx0XHRpZiAoaGFzaEFsZyA9PT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdFx0dGhyb3cgKG5ldyBFcnJvcignVW5zdXBwb3J0ZWQgUEJLREYyIGhhc2g6ICcgK1xyXG5cdFx0XHRcdCAgICBoYXNoQWxnT2lkKSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGVkZXIuX29mZnNldCA9IGtkZkVuZDtcclxuXHJcblx0XHRlZGVyLnJlYWRTZXF1ZW5jZSgpO1x0LyogZW5jcnlwdGlvblNjaGVtZSAqL1xyXG5cdFx0dmFyIGNpcGhlck9pZCA9IGVkZXIucmVhZE9JRCgpO1xyXG5cdFx0Y2lwaGVyID0gT0lEX1RPX0NJUEhFUltjaXBoZXJPaWRdO1xyXG5cdFx0aWYgKGNpcGhlciA9PT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdHRocm93IChuZXcgRXJyb3IoJ1Vuc3VwcG9ydGVkIFBCRVMyIGNpcGhlcjogJyArXHJcblx0XHRcdCAgICBjaXBoZXJPaWQpKTtcclxuXHRcdH1cclxuXHRcdGl2ID0gZWRlci5yZWFkU3RyaW5nKGFzbjEuQmVyLk9jdGV0U3RyaW5nLCB0cnVlKTtcclxuXHJcblx0XHRlZGVyLl9vZmZzZXQgPSBwYmVzRW5kO1xyXG5cdFx0YnVmID0gZWRlci5yZWFkU3RyaW5nKGFzbjEuQmVyLk9jdGV0U3RyaW5nLCB0cnVlKTtcclxuXHJcblx0XHRpZiAodHlwZW9mIChvcHRpb25zLnBhc3NwaHJhc2UpID09PSAnc3RyaW5nJykge1xyXG5cdFx0XHRvcHRpb25zLnBhc3NwaHJhc2UgPSBCdWZmZXIuZnJvbShcclxuXHRcdFx0ICAgIG9wdGlvbnMucGFzc3BocmFzZSwgJ3V0Zi04Jyk7XHJcblx0XHR9XHJcblx0XHRpZiAoIUJ1ZmZlci5pc0J1ZmZlcihvcHRpb25zLnBhc3NwaHJhc2UpKSB7XHJcblx0XHRcdHRocm93IChuZXcgZXJyb3JzLktleUVuY3J5cHRlZEVycm9yKFxyXG5cdFx0XHQgICAgb3B0aW9ucy5maWxlbmFtZSwgJ1BFTScpKTtcclxuXHRcdH1cclxuXHJcblx0XHR2YXIgY2luZm8gPSB1dGlscy5vcGVuc3NoQ2lwaGVySW5mbyhjaXBoZXIpO1xyXG5cclxuXHRcdGNpcGhlciA9IGNpbmZvLm9wZW5zc2xOYW1lO1xyXG5cdFx0a2V5ID0gdXRpbHMucGJrZGYyKGhhc2hBbGcsIHNhbHQsIGl0ZXJhdGlvbnMsIGNpbmZvLmtleVNpemUsXHJcblx0XHQgICAgb3B0aW9ucy5wYXNzcGhyYXNlKTtcclxuXHRcdGFsZyA9IHVuZGVmaW5lZDtcclxuXHR9XHJcblxyXG5cdGlmIChjaXBoZXIgJiYga2V5ICYmIGl2KSB7XHJcblx0XHR2YXIgY2lwaGVyU3RyZWFtID0gY3J5cHRvLmNyZWF0ZURlY2lwaGVyaXYoY2lwaGVyLCBrZXksIGl2KTtcclxuXHRcdHZhciBjaHVuaywgY2h1bmtzID0gW107XHJcblx0XHRjaXBoZXJTdHJlYW0ub25jZSgnZXJyb3InLCBmdW5jdGlvbiAoZSkge1xyXG5cdFx0XHRpZiAoZS50b1N0cmluZygpLmluZGV4T2YoJ2JhZCBkZWNyeXB0JykgIT09IC0xKSB7XHJcblx0XHRcdFx0dGhyb3cgKG5ldyBFcnJvcignSW5jb3JyZWN0IHBhc3NwaHJhc2UgJyArXHJcblx0XHRcdFx0ICAgICdzdXBwbGllZCwgY291bGQgbm90IGRlY3J5cHQga2V5JykpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHRocm93IChlKTtcclxuXHRcdH0pO1xyXG5cdFx0Y2lwaGVyU3RyZWFtLndyaXRlKGJ1Zik7XHJcblx0XHRjaXBoZXJTdHJlYW0uZW5kKCk7XHJcblx0XHR3aGlsZSAoKGNodW5rID0gY2lwaGVyU3RyZWFtLnJlYWQoKSkgIT09IG51bGwpXHJcblx0XHRcdGNodW5rcy5wdXNoKGNodW5rKTtcclxuXHRcdGJ1ZiA9IEJ1ZmZlci5jb25jYXQoY2h1bmtzKTtcclxuXHR9XHJcblxyXG5cdC8qIFRoZSBuZXcgT3BlblNTSCBpbnRlcm5hbCBmb3JtYXQgYWJ1c2VzIFBFTSBoZWFkZXJzICovXHJcblx0aWYgKGFsZyAmJiBhbGcudG9Mb3dlckNhc2UoKSA9PT0gJ29wZW5zc2gnKVxyXG5cdFx0cmV0dXJuIChzc2hwcml2LnJlYWRTU0hQcml2YXRlKHR5cGUsIGJ1Ziwgb3B0aW9ucykpO1xyXG5cdGlmIChhbGcgJiYgYWxnLnRvTG93ZXJDYXNlKCkgPT09ICdzc2gyJylcclxuXHRcdHJldHVybiAocmZjNDI1My5yZWFkVHlwZSh0eXBlLCBidWYsIG9wdGlvbnMpKTtcclxuXHJcblx0dmFyIGRlciA9IG5ldyBhc24xLkJlclJlYWRlcihidWYpO1xyXG5cdGRlci5vcmlnaW5hbElucHV0ID0gaW5wdXQ7XHJcblxyXG5cdC8qXHJcblx0ICogQWxsIG9mIHRoZSBQRU0gZmlsZSB0eXBlcyBzdGFydCB3aXRoIGEgc2VxdWVuY2UgdGFnLCBzbyBjaG9wIGl0XHJcblx0ICogb2ZmIGhlcmVcclxuXHQgKi9cclxuXHRkZXIucmVhZFNlcXVlbmNlKCk7XHJcblxyXG5cdC8qIFBLQ1MjMSB0eXBlIGtleXMgbmFtZSBhbiBhbGdvcml0aG0gaW4gdGhlIGJhbm5lciBleHBsaWNpdGx5ICovXHJcblx0aWYgKGFsZykge1xyXG5cdFx0aWYgKGZvcmNlVHlwZSlcclxuXHRcdFx0YXNzZXJ0LnN0cmljdEVxdWFsKGZvcmNlVHlwZSwgJ3BrY3MxJyk7XHJcblx0XHRyZXR1cm4gKHBrY3MxLnJlYWRQa2NzMShhbGcsIHR5cGUsIGRlcikpO1xyXG5cdH0gZWxzZSB7XHJcblx0XHRpZiAoZm9yY2VUeXBlKVxyXG5cdFx0XHRhc3NlcnQuc3RyaWN0RXF1YWwoZm9yY2VUeXBlLCAncGtjczgnKTtcclxuXHRcdHJldHVybiAocGtjczgucmVhZFBrY3M4KGFsZywgdHlwZSwgZGVyKSk7XHJcblx0fVxyXG59XHJcblxyXG5mdW5jdGlvbiB3cml0ZShrZXksIG9wdGlvbnMsIHR5cGUpIHtcclxuXHRhc3NlcnQub2JqZWN0KGtleSk7XHJcblxyXG5cdHZhciBhbGcgPSB7XHJcblx0ICAgICdlY2RzYSc6ICdFQycsXHJcblx0ICAgICdyc2EnOiAnUlNBJyxcclxuXHQgICAgJ2RzYSc6ICdEU0EnLFxyXG5cdCAgICAnZWQyNTUxOSc6ICdFZERTQSdcclxuXHR9W2tleS50eXBlXTtcclxuXHR2YXIgaGVhZGVyO1xyXG5cclxuXHR2YXIgZGVyID0gbmV3IGFzbjEuQmVyV3JpdGVyKCk7XHJcblxyXG5cdGlmIChQcml2YXRlS2V5LmlzUHJpdmF0ZUtleShrZXkpKSB7XHJcblx0XHRpZiAodHlwZSAmJiB0eXBlID09PSAncGtjczgnKSB7XHJcblx0XHRcdGhlYWRlciA9ICdQUklWQVRFIEtFWSc7XHJcblx0XHRcdHBrY3M4LndyaXRlUGtjczgoZGVyLCBrZXkpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0aWYgKHR5cGUpXHJcblx0XHRcdFx0YXNzZXJ0LnN0cmljdEVxdWFsKHR5cGUsICdwa2NzMScpO1xyXG5cdFx0XHRoZWFkZXIgPSBhbGcgKyAnIFBSSVZBVEUgS0VZJztcclxuXHRcdFx0cGtjczEud3JpdGVQa2NzMShkZXIsIGtleSk7XHJcblx0XHR9XHJcblxyXG5cdH0gZWxzZSBpZiAoS2V5LmlzS2V5KGtleSkpIHtcclxuXHRcdGlmICh0eXBlICYmIHR5cGUgPT09ICdwa2NzMScpIHtcclxuXHRcdFx0aGVhZGVyID0gYWxnICsgJyBQVUJMSUMgS0VZJztcclxuXHRcdFx0cGtjczEud3JpdGVQa2NzMShkZXIsIGtleSk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRpZiAodHlwZSlcclxuXHRcdFx0XHRhc3NlcnQuc3RyaWN0RXF1YWwodHlwZSwgJ3BrY3M4Jyk7XHJcblx0XHRcdGhlYWRlciA9ICdQVUJMSUMgS0VZJztcclxuXHRcdFx0cGtjczgud3JpdGVQa2NzOChkZXIsIGtleSk7XHJcblx0XHR9XHJcblxyXG5cdH0gZWxzZSB7XHJcblx0XHR0aHJvdyAobmV3IEVycm9yKCdrZXkgaXMgbm90IGEgS2V5IG9yIFByaXZhdGVLZXknKSk7XHJcblx0fVxyXG5cclxuXHR2YXIgdG1wID0gZGVyLmJ1ZmZlci50b1N0cmluZygnYmFzZTY0Jyk7XHJcblx0dmFyIGxlbiA9IHRtcC5sZW5ndGggKyAodG1wLmxlbmd0aCAvIDY0KSArXHJcblx0ICAgIDE4ICsgMTYgKyBoZWFkZXIubGVuZ3RoKjIgKyAxMDtcclxuXHR2YXIgYnVmID0gQnVmZmVyLmFsbG9jKGxlbik7XHJcblx0dmFyIG8gPSAwO1xyXG5cdG8gKz0gYnVmLndyaXRlKCctLS0tLUJFR0lOICcgKyBoZWFkZXIgKyAnLS0tLS1cXG4nLCBvKTtcclxuXHRmb3IgKHZhciBpID0gMDsgaSA8IHRtcC5sZW5ndGg7ICkge1xyXG5cdFx0dmFyIGxpbWl0ID0gaSArIDY0O1xyXG5cdFx0aWYgKGxpbWl0ID4gdG1wLmxlbmd0aClcclxuXHRcdFx0bGltaXQgPSB0bXAubGVuZ3RoO1xyXG5cdFx0byArPSBidWYud3JpdGUodG1wLnNsaWNlKGksIGxpbWl0KSwgbyk7XHJcblx0XHRidWZbbysrXSA9IDEwO1xyXG5cdFx0aSA9IGxpbWl0O1xyXG5cdH1cclxuXHRvICs9IGJ1Zi53cml0ZSgnLS0tLS1FTkQgJyArIGhlYWRlciArICctLS0tLVxcbicsIG8pO1xyXG5cclxuXHRyZXR1cm4gKGJ1Zi5zbGljZSgwLCBvKSk7XHJcbn1cclxuIiwiLy8gQ29weXJpZ2h0IDIwMTUgSm95ZW50LCBJbmMuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuXHRWZXJpZmllcjogVmVyaWZpZXIsXHJcblx0U2lnbmVyOiBTaWduZXJcclxufTtcclxuXHJcbnZhciBuYWNsID0gcmVxdWlyZSgndHdlZXRuYWNsJyk7XHJcbnZhciBzdHJlYW0gPSByZXF1aXJlKCdzdHJlYW0nKTtcclxudmFyIHV0aWwgPSByZXF1aXJlKCd1dGlsJyk7XHJcbnZhciBhc3NlcnQgPSByZXF1aXJlKCdhc3NlcnQtcGx1cycpO1xyXG52YXIgQnVmZmVyID0gcmVxdWlyZSgnc2FmZXItYnVmZmVyJykuQnVmZmVyO1xyXG52YXIgU2lnbmF0dXJlID0gcmVxdWlyZSgnLi9zaWduYXR1cmUnKTtcclxuXHJcbmZ1bmN0aW9uIFZlcmlmaWVyKGtleSwgaGFzaEFsZ28pIHtcclxuXHRpZiAoaGFzaEFsZ28udG9Mb3dlckNhc2UoKSAhPT0gJ3NoYTUxMicpXHJcblx0XHR0aHJvdyAobmV3IEVycm9yKCdFRDI1NTE5IG9ubHkgc3VwcG9ydHMgdGhlIHVzZSBvZiAnICtcclxuXHRcdCAgICAnU0hBLTUxMiBoYXNoZXMnKSk7XHJcblxyXG5cdHRoaXMua2V5ID0ga2V5O1xyXG5cdHRoaXMuY2h1bmtzID0gW107XHJcblxyXG5cdHN0cmVhbS5Xcml0YWJsZS5jYWxsKHRoaXMsIHt9KTtcclxufVxyXG51dGlsLmluaGVyaXRzKFZlcmlmaWVyLCBzdHJlYW0uV3JpdGFibGUpO1xyXG5cclxuVmVyaWZpZXIucHJvdG90eXBlLl93cml0ZSA9IGZ1bmN0aW9uIChjaHVuaywgZW5jLCBjYikge1xyXG5cdHRoaXMuY2h1bmtzLnB1c2goY2h1bmspO1xyXG5cdGNiKCk7XHJcbn07XHJcblxyXG5WZXJpZmllci5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gKGNodW5rKSB7XHJcblx0aWYgKHR5cGVvZiAoY2h1bmspID09PSAnc3RyaW5nJylcclxuXHRcdGNodW5rID0gQnVmZmVyLmZyb20oY2h1bmssICdiaW5hcnknKTtcclxuXHR0aGlzLmNodW5rcy5wdXNoKGNodW5rKTtcclxufTtcclxuXHJcblZlcmlmaWVyLnByb3RvdHlwZS52ZXJpZnkgPSBmdW5jdGlvbiAoc2lnbmF0dXJlLCBmbXQpIHtcclxuXHR2YXIgc2lnO1xyXG5cdGlmIChTaWduYXR1cmUuaXNTaWduYXR1cmUoc2lnbmF0dXJlLCBbMiwgMF0pKSB7XHJcblx0XHRpZiAoc2lnbmF0dXJlLnR5cGUgIT09ICdlZDI1NTE5JylcclxuXHRcdFx0cmV0dXJuIChmYWxzZSk7XHJcblx0XHRzaWcgPSBzaWduYXR1cmUudG9CdWZmZXIoJ3JhdycpO1xyXG5cclxuXHR9IGVsc2UgaWYgKHR5cGVvZiAoc2lnbmF0dXJlKSA9PT0gJ3N0cmluZycpIHtcclxuXHRcdHNpZyA9IEJ1ZmZlci5mcm9tKHNpZ25hdHVyZSwgJ2Jhc2U2NCcpO1xyXG5cclxuXHR9IGVsc2UgaWYgKFNpZ25hdHVyZS5pc1NpZ25hdHVyZShzaWduYXR1cmUsIFsxLCAwXSkpIHtcclxuXHRcdHRocm93IChuZXcgRXJyb3IoJ3NpZ25hdHVyZSB3YXMgY3JlYXRlZCBieSB0b28gb2xkICcgK1xyXG5cdFx0ICAgICdhIHZlcnNpb24gb2Ygc3NocGsgYW5kIGNhbm5vdCBiZSB2ZXJpZmllZCcpKTtcclxuXHR9XHJcblxyXG5cdGFzc2VydC5idWZmZXIoc2lnKTtcclxuXHRyZXR1cm4gKG5hY2wuc2lnbi5kZXRhY2hlZC52ZXJpZnkoXHJcblx0ICAgIG5ldyBVaW50OEFycmF5KEJ1ZmZlci5jb25jYXQodGhpcy5jaHVua3MpKSxcclxuXHQgICAgbmV3IFVpbnQ4QXJyYXkoc2lnKSxcclxuXHQgICAgbmV3IFVpbnQ4QXJyYXkodGhpcy5rZXkucGFydC5BLmRhdGEpKSk7XHJcbn07XHJcblxyXG5mdW5jdGlvbiBTaWduZXIoa2V5LCBoYXNoQWxnbykge1xyXG5cdGlmIChoYXNoQWxnby50b0xvd2VyQ2FzZSgpICE9PSAnc2hhNTEyJylcclxuXHRcdHRocm93IChuZXcgRXJyb3IoJ0VEMjU1MTkgb25seSBzdXBwb3J0cyB0aGUgdXNlIG9mICcgK1xyXG5cdFx0ICAgICdTSEEtNTEyIGhhc2hlcycpKTtcclxuXHJcblx0dGhpcy5rZXkgPSBrZXk7XHJcblx0dGhpcy5jaHVua3MgPSBbXTtcclxuXHJcblx0c3RyZWFtLldyaXRhYmxlLmNhbGwodGhpcywge30pO1xyXG59XHJcbnV0aWwuaW5oZXJpdHMoU2lnbmVyLCBzdHJlYW0uV3JpdGFibGUpO1xyXG5cclxuU2lnbmVyLnByb3RvdHlwZS5fd3JpdGUgPSBmdW5jdGlvbiAoY2h1bmssIGVuYywgY2IpIHtcclxuXHR0aGlzLmNodW5rcy5wdXNoKGNodW5rKTtcclxuXHRjYigpO1xyXG59O1xyXG5cclxuU2lnbmVyLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiAoY2h1bmspIHtcclxuXHRpZiAodHlwZW9mIChjaHVuaykgPT09ICdzdHJpbmcnKVxyXG5cdFx0Y2h1bmsgPSBCdWZmZXIuZnJvbShjaHVuaywgJ2JpbmFyeScpO1xyXG5cdHRoaXMuY2h1bmtzLnB1c2goY2h1bmspO1xyXG59O1xyXG5cclxuU2lnbmVyLnByb3RvdHlwZS5zaWduID0gZnVuY3Rpb24gKCkge1xyXG5cdHZhciBzaWcgPSBuYWNsLnNpZ24uZGV0YWNoZWQoXHJcblx0ICAgIG5ldyBVaW50OEFycmF5KEJ1ZmZlci5jb25jYXQodGhpcy5jaHVua3MpKSxcclxuXHQgICAgbmV3IFVpbnQ4QXJyYXkoQnVmZmVyLmNvbmNhdChbXHJcblx0XHR0aGlzLmtleS5wYXJ0LmsuZGF0YSwgdGhpcy5rZXkucGFydC5BLmRhdGFdKSkpO1xyXG5cdHZhciBzaWdCdWYgPSBCdWZmZXIuZnJvbShzaWcpO1xyXG5cdHZhciBzaWdPYmogPSBTaWduYXR1cmUucGFyc2Uoc2lnQnVmLCAnZWQyNTUxOScsICdyYXcnKTtcclxuXHRzaWdPYmouaGFzaEFsZ29yaXRobSA9ICdzaGE1MTInO1xyXG5cdHJldHVybiAoc2lnT2JqKTtcclxufTtcclxuIiwiLy8gQ29weXJpZ2h0IDIwMTcgSm95ZW50LCBJbmMuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuXHRyZWFkOiByZWFkLFxyXG5cdHdyaXRlOiB3cml0ZVxyXG59O1xyXG5cclxudmFyIGFzc2VydCA9IHJlcXVpcmUoJ2Fzc2VydC1wbHVzJyk7XHJcbnZhciBCdWZmZXIgPSByZXF1aXJlKCdzYWZlci1idWZmZXInKS5CdWZmZXI7XHJcbnZhciBLZXkgPSByZXF1aXJlKCcuLi9rZXknKTtcclxudmFyIFByaXZhdGVLZXkgPSByZXF1aXJlKCcuLi9wcml2YXRlLWtleScpO1xyXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlscycpO1xyXG52YXIgU1NIQnVmZmVyID0gcmVxdWlyZSgnLi4vc3NoLWJ1ZmZlcicpO1xyXG52YXIgRGhlID0gcmVxdWlyZSgnLi4vZGhlJyk7XHJcblxyXG52YXIgc3VwcG9ydGVkQWxnb3MgPSB7XHJcblx0J3JzYS1zaGExJyA6IDUsXHJcblx0J3JzYS1zaGEyNTYnIDogOCxcclxuXHQncnNhLXNoYTUxMicgOiAxMCxcclxuXHQnZWNkc2EtcDI1Ni1zaGEyNTYnIDogMTMsXHJcblx0J2VjZHNhLXAzODQtc2hhMzg0JyA6IDE0XHJcblx0LypcclxuXHQgKiBlZDI1NTE5IGlzIGh5cG90aGV0aWNhbGx5IHN1cHBvcnRlZCB3aXRoIGlkIDE1XHJcblx0ICogYnV0IHRoZSBjb21tb24gdG9vbHMgYXZhaWxhYmxlIGRvbid0IGFwcGVhciB0byBiZVxyXG5cdCAqIGNhcGFibGUgb2YgZ2VuZXJhdGluZy91c2luZyBlZDI1NTE5IGtleXNcclxuXHQgKi9cclxufTtcclxuXHJcbnZhciBzdXBwb3J0ZWRBbGdvc0J5SWQgPSB7fTtcclxuT2JqZWN0LmtleXMoc3VwcG9ydGVkQWxnb3MpLmZvckVhY2goZnVuY3Rpb24gKGspIHtcclxuXHRzdXBwb3J0ZWRBbGdvc0J5SWRbc3VwcG9ydGVkQWxnb3Nba11dID0gay50b1VwcGVyQ2FzZSgpO1xyXG59KTtcclxuXHJcbmZ1bmN0aW9uIHJlYWQoYnVmLCBvcHRpb25zKSB7XHJcblx0aWYgKHR5cGVvZiAoYnVmKSAhPT0gJ3N0cmluZycpIHtcclxuXHRcdGFzc2VydC5idWZmZXIoYnVmLCAnYnVmJyk7XHJcblx0XHRidWYgPSBidWYudG9TdHJpbmcoJ2FzY2lpJyk7XHJcblx0fVxyXG5cdHZhciBsaW5lcyA9IGJ1Zi5zcGxpdCgnXFxuJyk7XHJcblx0aWYgKGxpbmVzWzBdLm1hdGNoKC9eUHJpdmF0ZS1rZXktZm9ybWF0XFw6IHYxLykpIHtcclxuXHRcdHZhciBhbGdFbGVtcyA9IGxpbmVzWzFdLnNwbGl0KCcgJyk7XHJcblx0XHR2YXIgYWxnb051bSA9IHBhcnNlSW50KGFsZ0VsZW1zWzFdLCAxMCk7XHJcblx0XHR2YXIgYWxnb05hbWUgPSBhbGdFbGVtc1syXTtcclxuXHRcdGlmICghc3VwcG9ydGVkQWxnb3NCeUlkW2FsZ29OdW1dKVxyXG5cdFx0XHR0aHJvdyAobmV3IEVycm9yKCdVbnN1cHBvcnRlZCBhbGdvcml0aG06ICcgKyBhbGdvTmFtZSkpO1xyXG5cdFx0cmV0dXJuIChyZWFkRE5TU0VDUHJpdmF0ZUtleShhbGdvTnVtLCBsaW5lcy5zbGljZSgyKSkpO1xyXG5cdH1cclxuXHJcblx0Ly8gc2tpcCBhbnkgY29tbWVudC1saW5lc1xyXG5cdHZhciBsaW5lID0gMDtcclxuXHQvKiBKU1NUWUxFRCAqL1xyXG5cdHdoaWxlIChsaW5lc1tsaW5lXS5tYXRjaCgvXlxcOy8pKVxyXG5cdFx0bGluZSsrO1xyXG5cdC8vIHdlIHNob3VsZCBub3cgaGF2ZSAqb25lIHNpbmdsZSogbGluZSBsZWZ0IHdpdGggb3VyIEtFWSBvbiBpdC5cclxuXHRpZiAoKGxpbmVzW2xpbmVdLm1hdGNoKC9cXC4gSU4gS0VZIC8pIHx8XHJcblx0ICAgIGxpbmVzW2xpbmVdLm1hdGNoKC9cXC4gSU4gRE5TS0VZIC8pKSAmJiBsaW5lc1tsaW5lKzFdLmxlbmd0aCA9PT0gMCkge1xyXG5cdFx0cmV0dXJuIChyZWFkUkZDMzExMChsaW5lc1tsaW5lXSkpO1xyXG5cdH1cclxuXHR0aHJvdyAobmV3IEVycm9yKCdDYW5ub3QgcGFyc2UgZG5zc2VjIGtleScpKTtcclxufVxyXG5cclxuZnVuY3Rpb24gcmVhZFJGQzMxMTAoa2V5U3RyaW5nKSB7XHJcblx0dmFyIGVsZW1zID0ga2V5U3RyaW5nLnNwbGl0KCcgJyk7XHJcblx0Ly91bnVzZWQgdmFyIGZsYWdzID0gcGFyc2VJbnQoZWxlbXNbM10sIDEwKTtcclxuXHQvL3VudXNlZCB2YXIgcHJvdG9jb2wgPSBwYXJzZUludChlbGVtc1s0XSwgMTApO1xyXG5cdHZhciBhbGdvcml0aG0gPSBwYXJzZUludChlbGVtc1s1XSwgMTApO1xyXG5cdGlmICghc3VwcG9ydGVkQWxnb3NCeUlkW2FsZ29yaXRobV0pXHJcblx0XHR0aHJvdyAobmV3IEVycm9yKCdVbnN1cHBvcnRlZCBhbGdvcml0aG06ICcgKyBhbGdvcml0aG0pKTtcclxuXHR2YXIgYmFzZTY0a2V5ID0gZWxlbXMuc2xpY2UoNiwgZWxlbXMubGVuZ3RoKS5qb2luKCk7XHJcblx0dmFyIGtleUJ1ZmZlciA9IEJ1ZmZlci5mcm9tKGJhc2U2NGtleSwgJ2Jhc2U2NCcpO1xyXG5cdGlmIChzdXBwb3J0ZWRBbGdvc0J5SWRbYWxnb3JpdGhtXS5tYXRjaCgvXlJTQS0vKSkge1xyXG5cdFx0Ly8gam9pbiB0aGUgcmVzdCBvZiB0aGUgYm9keSBpbnRvIGEgc2luZ2xlIGJhc2U2NC1ibG9iXHJcblx0XHR2YXIgcHVibGljRXhwb25lbnRMZW4gPSBrZXlCdWZmZXIucmVhZFVJbnQ4KDApO1xyXG5cdFx0aWYgKHB1YmxpY0V4cG9uZW50TGVuICE9IDMgJiYgcHVibGljRXhwb25lbnRMZW4gIT0gMSlcclxuXHRcdFx0dGhyb3cgKG5ldyBFcnJvcignQ2Fubm90IHBhcnNlIGRuc3NlYyBrZXk6ICcgK1xyXG5cdFx0XHQgICAgJ3Vuc3VwcG9ydGVkIGV4cG9uZW50IGxlbmd0aCcpKTtcclxuXHJcblx0XHR2YXIgcHVibGljRXhwb25lbnQgPSBrZXlCdWZmZXIuc2xpY2UoMSwgcHVibGljRXhwb25lbnRMZW4rMSk7XHJcblx0XHRwdWJsaWNFeHBvbmVudCA9IHV0aWxzLm1wTm9ybWFsaXplKHB1YmxpY0V4cG9uZW50KTtcclxuXHRcdHZhciBtb2R1bHVzID0ga2V5QnVmZmVyLnNsaWNlKDErcHVibGljRXhwb25lbnRMZW4pO1xyXG5cdFx0bW9kdWx1cyA9IHV0aWxzLm1wTm9ybWFsaXplKG1vZHVsdXMpO1xyXG5cdFx0Ly8gbm93LCBtYWtlIHRoZSBrZXlcclxuXHRcdHZhciByc2FLZXkgPSB7XHJcblx0XHRcdHR5cGU6ICdyc2EnLFxyXG5cdFx0XHRwYXJ0czogW11cclxuXHRcdH07XHJcblx0XHRyc2FLZXkucGFydHMucHVzaCh7IG5hbWU6ICdlJywgZGF0YTogcHVibGljRXhwb25lbnR9KTtcclxuXHRcdHJzYUtleS5wYXJ0cy5wdXNoKHsgbmFtZTogJ24nLCBkYXRhOiBtb2R1bHVzfSk7XHJcblx0XHRyZXR1cm4gKG5ldyBLZXkocnNhS2V5KSk7XHJcblx0fVxyXG5cdGlmIChzdXBwb3J0ZWRBbGdvc0J5SWRbYWxnb3JpdGhtXSA9PT0gJ0VDRFNBLVAzODQtU0hBMzg0JyB8fFxyXG5cdCAgICBzdXBwb3J0ZWRBbGdvc0J5SWRbYWxnb3JpdGhtXSA9PT0gJ0VDRFNBLVAyNTYtU0hBMjU2Jykge1xyXG5cdFx0dmFyIGN1cnZlID0gJ25pc3RwMzg0JztcclxuXHRcdHZhciBzaXplID0gMzg0O1xyXG5cdFx0aWYgKHN1cHBvcnRlZEFsZ29zQnlJZFthbGdvcml0aG1dLm1hdGNoKC9eRUNEU0EtUDI1Ni1TSEEyNTYvKSkge1xyXG5cdFx0XHRjdXJ2ZSA9ICduaXN0cDI1Nic7XHJcblx0XHRcdHNpemUgPSAyNTY7XHJcblx0XHR9XHJcblxyXG5cdFx0dmFyIGVjZHNhS2V5ID0ge1xyXG5cdFx0XHR0eXBlOiAnZWNkc2EnLFxyXG5cdFx0XHRjdXJ2ZTogY3VydmUsXHJcblx0XHRcdHNpemU6IHNpemUsXHJcblx0XHRcdHBhcnRzOiBbXHJcblx0XHRcdFx0e25hbWU6ICdjdXJ2ZScsIGRhdGE6IEJ1ZmZlci5mcm9tKGN1cnZlKSB9LFxyXG5cdFx0XHRcdHtuYW1lOiAnUScsIGRhdGE6IHV0aWxzLmVjTm9ybWFsaXplKGtleUJ1ZmZlcikgfVxyXG5cdFx0XHRdXHJcblx0XHR9O1xyXG5cdFx0cmV0dXJuIChuZXcgS2V5KGVjZHNhS2V5KSk7XHJcblx0fVxyXG5cdHRocm93IChuZXcgRXJyb3IoJ1Vuc3VwcG9ydGVkIGFsZ29yaXRobTogJyArXHJcblx0ICAgIHN1cHBvcnRlZEFsZ29zQnlJZFthbGdvcml0aG1dKSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGVsZW1lbnRUb0J1ZihlKSB7XHJcblx0cmV0dXJuIChCdWZmZXIuZnJvbShlLnNwbGl0KCcgJylbMV0sICdiYXNlNjQnKSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlYWRETlNTRUNSU0FQcml2YXRlS2V5KGVsZW1lbnRzKSB7XHJcblx0dmFyIHJzYVBhcmFtcyA9IHt9O1xyXG5cdGVsZW1lbnRzLmZvckVhY2goZnVuY3Rpb24gKGVsZW1lbnQpIHtcclxuXHRcdGlmIChlbGVtZW50LnNwbGl0KCcgJylbMF0gPT09ICdNb2R1bHVzOicpXHJcblx0XHRcdHJzYVBhcmFtc1snbiddID0gZWxlbWVudFRvQnVmKGVsZW1lbnQpO1xyXG5cdFx0ZWxzZSBpZiAoZWxlbWVudC5zcGxpdCgnICcpWzBdID09PSAnUHVibGljRXhwb25lbnQ6JylcclxuXHRcdFx0cnNhUGFyYW1zWydlJ10gPSBlbGVtZW50VG9CdWYoZWxlbWVudCk7XHJcblx0XHRlbHNlIGlmIChlbGVtZW50LnNwbGl0KCcgJylbMF0gPT09ICdQcml2YXRlRXhwb25lbnQ6JylcclxuXHRcdFx0cnNhUGFyYW1zWydkJ10gPSBlbGVtZW50VG9CdWYoZWxlbWVudCk7XHJcblx0XHRlbHNlIGlmIChlbGVtZW50LnNwbGl0KCcgJylbMF0gPT09ICdQcmltZTE6JylcclxuXHRcdFx0cnNhUGFyYW1zWydwJ10gPSBlbGVtZW50VG9CdWYoZWxlbWVudCk7XHJcblx0XHRlbHNlIGlmIChlbGVtZW50LnNwbGl0KCcgJylbMF0gPT09ICdQcmltZTI6JylcclxuXHRcdFx0cnNhUGFyYW1zWydxJ10gPSBlbGVtZW50VG9CdWYoZWxlbWVudCk7XHJcblx0XHRlbHNlIGlmIChlbGVtZW50LnNwbGl0KCcgJylbMF0gPT09ICdFeHBvbmVudDE6JylcclxuXHRcdFx0cnNhUGFyYW1zWydkbW9kcCddID0gZWxlbWVudFRvQnVmKGVsZW1lbnQpO1xyXG5cdFx0ZWxzZSBpZiAoZWxlbWVudC5zcGxpdCgnICcpWzBdID09PSAnRXhwb25lbnQyOicpXHJcblx0XHRcdHJzYVBhcmFtc1snZG1vZHEnXSA9IGVsZW1lbnRUb0J1ZihlbGVtZW50KTtcclxuXHRcdGVsc2UgaWYgKGVsZW1lbnQuc3BsaXQoJyAnKVswXSA9PT0gJ0NvZWZmaWNpZW50OicpXHJcblx0XHRcdHJzYVBhcmFtc1snaXFtcCddID0gZWxlbWVudFRvQnVmKGVsZW1lbnQpO1xyXG5cdH0pO1xyXG5cdC8vIG5vdywgbWFrZSB0aGUga2V5XHJcblx0dmFyIGtleSA9IHtcclxuXHRcdHR5cGU6ICdyc2EnLFxyXG5cdFx0cGFydHM6IFtcclxuXHRcdFx0eyBuYW1lOiAnZScsIGRhdGE6IHV0aWxzLm1wTm9ybWFsaXplKHJzYVBhcmFtc1snZSddKX0sXHJcblx0XHRcdHsgbmFtZTogJ24nLCBkYXRhOiB1dGlscy5tcE5vcm1hbGl6ZShyc2FQYXJhbXNbJ24nXSl9LFxyXG5cdFx0XHR7IG5hbWU6ICdkJywgZGF0YTogdXRpbHMubXBOb3JtYWxpemUocnNhUGFyYW1zWydkJ10pfSxcclxuXHRcdFx0eyBuYW1lOiAncCcsIGRhdGE6IHV0aWxzLm1wTm9ybWFsaXplKHJzYVBhcmFtc1sncCddKX0sXHJcblx0XHRcdHsgbmFtZTogJ3EnLCBkYXRhOiB1dGlscy5tcE5vcm1hbGl6ZShyc2FQYXJhbXNbJ3EnXSl9LFxyXG5cdFx0XHR7IG5hbWU6ICdkbW9kcCcsXHJcblx0XHRcdCAgICBkYXRhOiB1dGlscy5tcE5vcm1hbGl6ZShyc2FQYXJhbXNbJ2Rtb2RwJ10pfSxcclxuXHRcdFx0eyBuYW1lOiAnZG1vZHEnLFxyXG5cdFx0XHQgICAgZGF0YTogdXRpbHMubXBOb3JtYWxpemUocnNhUGFyYW1zWydkbW9kcSddKX0sXHJcblx0XHRcdHsgbmFtZTogJ2lxbXAnLFxyXG5cdFx0XHQgICAgZGF0YTogdXRpbHMubXBOb3JtYWxpemUocnNhUGFyYW1zWydpcW1wJ10pfVxyXG5cdFx0XVxyXG5cdH07XHJcblx0cmV0dXJuIChuZXcgUHJpdmF0ZUtleShrZXkpKTtcclxufVxyXG5cclxuZnVuY3Rpb24gcmVhZEROU1NFQ1ByaXZhdGVLZXkoYWxnLCBlbGVtZW50cykge1xyXG5cdGlmIChzdXBwb3J0ZWRBbGdvc0J5SWRbYWxnXS5tYXRjaCgvXlJTQS0vKSkge1xyXG5cdFx0cmV0dXJuIChyZWFkRE5TU0VDUlNBUHJpdmF0ZUtleShlbGVtZW50cykpO1xyXG5cdH1cclxuXHRpZiAoc3VwcG9ydGVkQWxnb3NCeUlkW2FsZ10gPT09ICdFQ0RTQS1QMzg0LVNIQTM4NCcgfHxcclxuXHQgICAgc3VwcG9ydGVkQWxnb3NCeUlkW2FsZ10gPT09ICdFQ0RTQS1QMjU2LVNIQTI1NicpIHtcclxuXHRcdHZhciBkID0gQnVmZmVyLmZyb20oZWxlbWVudHNbMF0uc3BsaXQoJyAnKVsxXSwgJ2Jhc2U2NCcpO1xyXG5cdFx0dmFyIGN1cnZlID0gJ25pc3RwMzg0JztcclxuXHRcdHZhciBzaXplID0gMzg0O1xyXG5cdFx0aWYgKHN1cHBvcnRlZEFsZ29zQnlJZFthbGddID09PSAnRUNEU0EtUDI1Ni1TSEEyNTYnKSB7XHJcblx0XHRcdGN1cnZlID0gJ25pc3RwMjU2JztcclxuXHRcdFx0c2l6ZSA9IDI1NjtcclxuXHRcdH1cclxuXHRcdC8vIEROU1NFQyBnZW5lcmF0ZXMgdGhlIHB1YmxpYy1rZXkgb24gdGhlIGZseSAoZ28gY2FsY3VsYXRlIGl0KVxyXG5cdFx0dmFyIHB1YmxpY0tleSA9IHV0aWxzLnB1YmxpY0Zyb21Qcml2YXRlRUNEU0EoY3VydmUsIGQpO1xyXG5cdFx0dmFyIFEgPSBwdWJsaWNLZXkucGFydFsnUSddLmRhdGE7XHJcblx0XHR2YXIgZWNkc2FLZXkgPSB7XHJcblx0XHRcdHR5cGU6ICdlY2RzYScsXHJcblx0XHRcdGN1cnZlOiBjdXJ2ZSxcclxuXHRcdFx0c2l6ZTogc2l6ZSxcclxuXHRcdFx0cGFydHM6IFtcclxuXHRcdFx0XHR7bmFtZTogJ2N1cnZlJywgZGF0YTogQnVmZmVyLmZyb20oY3VydmUpIH0sXHJcblx0XHRcdFx0e25hbWU6ICdkJywgZGF0YTogZCB9LFxyXG5cdFx0XHRcdHtuYW1lOiAnUScsIGRhdGE6IFEgfVxyXG5cdFx0XHRdXHJcblx0XHR9O1xyXG5cdFx0cmV0dXJuIChuZXcgUHJpdmF0ZUtleShlY2RzYUtleSkpO1xyXG5cdH1cclxuXHR0aHJvdyAobmV3IEVycm9yKCdVbnN1cHBvcnRlZCBhbGdvcml0aG06ICcgKyBzdXBwb3J0ZWRBbGdvc0J5SWRbYWxnXSkpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBkbnNzZWNUaW1lc3RhbXAoZGF0ZSkge1xyXG5cdHZhciB5ZWFyID0gZGF0ZS5nZXRGdWxsWWVhcigpICsgJyc7IC8vc3RyaW5naWZ5XHJcblx0dmFyIG1vbnRoID0gKGRhdGUuZ2V0TW9udGgoKSArIDEpO1xyXG5cdHZhciB0aW1lc3RhbXBTdHIgPSB5ZWFyICsgbW9udGggKyBkYXRlLmdldFVUQ0RhdGUoKTtcclxuXHR0aW1lc3RhbXBTdHIgKz0gJycgKyBkYXRlLmdldFVUQ0hvdXJzKCkgKyBkYXRlLmdldFVUQ01pbnV0ZXMoKTtcclxuXHR0aW1lc3RhbXBTdHIgKz0gZGF0ZS5nZXRVVENTZWNvbmRzKCk7XHJcblx0cmV0dXJuICh0aW1lc3RhbXBTdHIpO1xyXG59XHJcblxyXG5mdW5jdGlvbiByc2FBbGdGcm9tT3B0aW9ucyhvcHRzKSB7XHJcblx0aWYgKCFvcHRzIHx8ICFvcHRzLmhhc2hBbGdvIHx8IG9wdHMuaGFzaEFsZ28gPT09ICdzaGExJylcclxuXHRcdHJldHVybiAoJzUgKFJTQVNIQTEpJyk7XHJcblx0ZWxzZSBpZiAob3B0cy5oYXNoQWxnbyA9PT0gJ3NoYTI1NicpXHJcblx0XHRyZXR1cm4gKCc4IChSU0FTSEEyNTYpJyk7XHJcblx0ZWxzZSBpZiAob3B0cy5oYXNoQWxnbyA9PT0gJ3NoYTUxMicpXHJcblx0XHRyZXR1cm4gKCcxMCAoUlNBU0hBNTEyKScpO1xyXG5cdGVsc2VcclxuXHRcdHRocm93IChuZXcgRXJyb3IoJ1Vua25vd24gb3IgdW5zdXBwb3J0ZWQgaGFzaDogJyArXHJcblx0XHQgICAgb3B0cy5oYXNoQWxnbykpO1xyXG59XHJcblxyXG5mdW5jdGlvbiB3cml0ZVJTQShrZXksIG9wdGlvbnMpIHtcclxuXHQvLyBpZiB3ZSdyZSBtaXNzaW5nIHBhcnRzLCBhZGQgdGhlbS5cclxuXHRpZiAoIWtleS5wYXJ0LmRtb2RwIHx8ICFrZXkucGFydC5kbW9kcSkge1xyXG5cdFx0dXRpbHMuYWRkUlNBTWlzc2luZyhrZXkpO1xyXG5cdH1cclxuXHJcblx0dmFyIG91dCA9ICcnO1xyXG5cdG91dCArPSAnUHJpdmF0ZS1rZXktZm9ybWF0OiB2MS4zXFxuJztcclxuXHRvdXQgKz0gJ0FsZ29yaXRobTogJyArIHJzYUFsZ0Zyb21PcHRpb25zKG9wdGlvbnMpICsgJ1xcbic7XHJcblx0dmFyIG4gPSB1dGlscy5tcERlbm9ybWFsaXplKGtleS5wYXJ0WyduJ10uZGF0YSk7XHJcblx0b3V0ICs9ICdNb2R1bHVzOiAnICsgbi50b1N0cmluZygnYmFzZTY0JykgKyAnXFxuJztcclxuXHR2YXIgZSA9IHV0aWxzLm1wRGVub3JtYWxpemUoa2V5LnBhcnRbJ2UnXS5kYXRhKTtcclxuXHRvdXQgKz0gJ1B1YmxpY0V4cG9uZW50OiAnICsgZS50b1N0cmluZygnYmFzZTY0JykgKyAnXFxuJztcclxuXHR2YXIgZCA9IHV0aWxzLm1wRGVub3JtYWxpemUoa2V5LnBhcnRbJ2QnXS5kYXRhKTtcclxuXHRvdXQgKz0gJ1ByaXZhdGVFeHBvbmVudDogJyArIGQudG9TdHJpbmcoJ2Jhc2U2NCcpICsgJ1xcbic7XHJcblx0dmFyIHAgPSB1dGlscy5tcERlbm9ybWFsaXplKGtleS5wYXJ0WydwJ10uZGF0YSk7XHJcblx0b3V0ICs9ICdQcmltZTE6ICcgKyBwLnRvU3RyaW5nKCdiYXNlNjQnKSArICdcXG4nO1xyXG5cdHZhciBxID0gdXRpbHMubXBEZW5vcm1hbGl6ZShrZXkucGFydFsncSddLmRhdGEpO1xyXG5cdG91dCArPSAnUHJpbWUyOiAnICsgcS50b1N0cmluZygnYmFzZTY0JykgKyAnXFxuJztcclxuXHR2YXIgZG1vZHAgPSB1dGlscy5tcERlbm9ybWFsaXplKGtleS5wYXJ0WydkbW9kcCddLmRhdGEpO1xyXG5cdG91dCArPSAnRXhwb25lbnQxOiAnICsgZG1vZHAudG9TdHJpbmcoJ2Jhc2U2NCcpICsgJ1xcbic7XHJcblx0dmFyIGRtb2RxID0gdXRpbHMubXBEZW5vcm1hbGl6ZShrZXkucGFydFsnZG1vZHEnXS5kYXRhKTtcclxuXHRvdXQgKz0gJ0V4cG9uZW50MjogJyArIGRtb2RxLnRvU3RyaW5nKCdiYXNlNjQnKSArICdcXG4nO1xyXG5cdHZhciBpcW1wID0gdXRpbHMubXBEZW5vcm1hbGl6ZShrZXkucGFydFsnaXFtcCddLmRhdGEpO1xyXG5cdG91dCArPSAnQ29lZmZpY2llbnQ6ICcgKyBpcW1wLnRvU3RyaW5nKCdiYXNlNjQnKSArICdcXG4nO1xyXG5cdC8vIEFzc3VtZSB0aGF0IHdlJ3JlIHZhbGlkIGFzLW9mIG5vd1xyXG5cdHZhciB0aW1lc3RhbXAgPSBuZXcgRGF0ZSgpO1xyXG5cdG91dCArPSAnQ3JlYXRlZDogJyArIGRuc3NlY1RpbWVzdGFtcCh0aW1lc3RhbXApICsgJ1xcbic7XHJcblx0b3V0ICs9ICdQdWJsaXNoOiAnICsgZG5zc2VjVGltZXN0YW1wKHRpbWVzdGFtcCkgKyAnXFxuJztcclxuXHRvdXQgKz0gJ0FjdGl2YXRlOiAnICsgZG5zc2VjVGltZXN0YW1wKHRpbWVzdGFtcCkgKyAnXFxuJztcclxuXHRyZXR1cm4gKEJ1ZmZlci5mcm9tKG91dCwgJ2FzY2lpJykpO1xyXG59XHJcblxyXG5mdW5jdGlvbiB3cml0ZUVDRFNBKGtleSwgb3B0aW9ucykge1xyXG5cdHZhciBvdXQgPSAnJztcclxuXHRvdXQgKz0gJ1ByaXZhdGUta2V5LWZvcm1hdDogdjEuM1xcbic7XHJcblxyXG5cdGlmIChrZXkuY3VydmUgPT09ICduaXN0cDI1NicpIHtcclxuXHRcdG91dCArPSAnQWxnb3JpdGhtOiAxMyAoRUNEU0FQMjU2U0hBMjU2KVxcbic7XHJcblx0fSBlbHNlIGlmIChrZXkuY3VydmUgPT09ICduaXN0cDM4NCcpIHtcclxuXHRcdG91dCArPSAnQWxnb3JpdGhtOiAxNCAoRUNEU0FQMzg0U0hBMzg0KVxcbic7XHJcblx0fSBlbHNlIHtcclxuXHRcdHRocm93IChuZXcgRXJyb3IoJ1Vuc3VwcG9ydGVkIGN1cnZlJykpO1xyXG5cdH1cclxuXHR2YXIgYmFzZTY0S2V5ID0ga2V5LnBhcnRbJ2QnXS5kYXRhLnRvU3RyaW5nKCdiYXNlNjQnKTtcclxuXHRvdXQgKz0gJ1ByaXZhdGVLZXk6ICcgKyBiYXNlNjRLZXkgKyAnXFxuJztcclxuXHJcblx0Ly8gQXNzdW1lIHRoYXQgd2UncmUgdmFsaWQgYXMtb2Ygbm93XHJcblx0dmFyIHRpbWVzdGFtcCA9IG5ldyBEYXRlKCk7XHJcblx0b3V0ICs9ICdDcmVhdGVkOiAnICsgZG5zc2VjVGltZXN0YW1wKHRpbWVzdGFtcCkgKyAnXFxuJztcclxuXHRvdXQgKz0gJ1B1Ymxpc2g6ICcgKyBkbnNzZWNUaW1lc3RhbXAodGltZXN0YW1wKSArICdcXG4nO1xyXG5cdG91dCArPSAnQWN0aXZhdGU6ICcgKyBkbnNzZWNUaW1lc3RhbXAodGltZXN0YW1wKSArICdcXG4nO1xyXG5cclxuXHRyZXR1cm4gKEJ1ZmZlci5mcm9tKG91dCwgJ2FzY2lpJykpO1xyXG59XHJcblxyXG5mdW5jdGlvbiB3cml0ZShrZXksIG9wdGlvbnMpIHtcclxuXHRpZiAoUHJpdmF0ZUtleS5pc1ByaXZhdGVLZXkoa2V5KSkge1xyXG5cdFx0aWYgKGtleS50eXBlID09PSAncnNhJykge1xyXG5cdFx0XHRyZXR1cm4gKHdyaXRlUlNBKGtleSwgb3B0aW9ucykpO1xyXG5cdFx0fSBlbHNlIGlmIChrZXkudHlwZSA9PT0gJ2VjZHNhJykge1xyXG5cdFx0XHRyZXR1cm4gKHdyaXRlRUNEU0Eoa2V5LCBvcHRpb25zKSk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0aHJvdyAobmV3IEVycm9yKCdVbnN1cHBvcnRlZCBhbGdvcml0aG06ICcgKyBrZXkudHlwZSkpO1xyXG5cdFx0fVxyXG5cdH0gZWxzZSBpZiAoS2V5LmlzS2V5KGtleSkpIHtcclxuXHRcdC8qXHJcblx0XHQgKiBSRkMzMTEwIHJlcXVpcmVzIGEga2V5bmFtZSwgYW5kIGEga2V5dHlwZSwgd2hpY2ggd2VcclxuXHRcdCAqIGRvbid0IHJlYWxseSBoYXZlIGEgbWVjaGFuaXNtIGZvciBzcGVjaWZ5aW5nIHN1Y2hcclxuXHRcdCAqIGFkZGl0aW9uYWwgbWV0YWRhdGEuXHJcblx0XHQgKi9cclxuXHRcdHRocm93IChuZXcgRXJyb3IoJ0Zvcm1hdCBcImRuc3NlY1wiIG9ubHkgc3VwcG9ydHMgJyArXHJcblx0XHQgICAgJ3dyaXRpbmcgcHJpdmF0ZSBrZXlzJykpO1xyXG5cdH0gZWxzZSB7XHJcblx0XHR0aHJvdyAobmV3IEVycm9yKCdrZXkgaXMgbm90IGEgS2V5IG9yIFByaXZhdGVLZXknKSk7XHJcblx0fVxyXG59XHJcbiIsIi8vIENvcHlyaWdodCAyMDE4IEpveWVudCwgSW5jLlxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcblx0cmVhZDogcmVhZCxcclxuXHRyZWFkUGtjczg6IHJlYWRQa2NzOCxcclxuXHR3cml0ZTogd3JpdGUsXHJcblx0d3JpdGVQa2NzODogd3JpdGVQa2NzOCxcclxuXHRwa2NzOFRvQnVmZmVyOiBwa2NzOFRvQnVmZmVyLFxyXG5cclxuXHRyZWFkRUNEU0FDdXJ2ZTogcmVhZEVDRFNBQ3VydmUsXHJcblx0d3JpdGVFQ0RTQUN1cnZlOiB3cml0ZUVDRFNBQ3VydmVcclxufTtcclxuXHJcbnZhciBhc3NlcnQgPSByZXF1aXJlKCdhc3NlcnQtcGx1cycpO1xyXG52YXIgYXNuMSA9IHJlcXVpcmUoJ2FzbjEnKTtcclxudmFyIEJ1ZmZlciA9IHJlcXVpcmUoJ3NhZmVyLWJ1ZmZlcicpLkJ1ZmZlcjtcclxudmFyIGFsZ3MgPSByZXF1aXJlKCcuLi9hbGdzJyk7XHJcbnZhciB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWxzJyk7XHJcbnZhciBLZXkgPSByZXF1aXJlKCcuLi9rZXknKTtcclxudmFyIFByaXZhdGVLZXkgPSByZXF1aXJlKCcuLi9wcml2YXRlLWtleScpO1xyXG52YXIgcGVtID0gcmVxdWlyZSgnLi9wZW0nKTtcclxuXHJcbmZ1bmN0aW9uIHJlYWQoYnVmLCBvcHRpb25zKSB7XHJcblx0cmV0dXJuIChwZW0ucmVhZChidWYsIG9wdGlvbnMsICdwa2NzOCcpKTtcclxufVxyXG5cclxuZnVuY3Rpb24gd3JpdGUoa2V5LCBvcHRpb25zKSB7XHJcblx0cmV0dXJuIChwZW0ud3JpdGUoa2V5LCBvcHRpb25zLCAncGtjczgnKSk7XHJcbn1cclxuXHJcbi8qIEhlbHBlciB0byByZWFkIGluIGEgc2luZ2xlIG1waW50ICovXHJcbmZ1bmN0aW9uIHJlYWRNUEludChkZXIsIG5tKSB7XHJcblx0YXNzZXJ0LnN0cmljdEVxdWFsKGRlci5wZWVrKCksIGFzbjEuQmVyLkludGVnZXIsXHJcblx0ICAgIG5tICsgJyBpcyBub3QgYW4gSW50ZWdlcicpO1xyXG5cdHJldHVybiAodXRpbHMubXBOb3JtYWxpemUoZGVyLnJlYWRTdHJpbmcoYXNuMS5CZXIuSW50ZWdlciwgdHJ1ZSkpKTtcclxufVxyXG5cclxuZnVuY3Rpb24gcmVhZFBrY3M4KGFsZywgdHlwZSwgZGVyKSB7XHJcblx0LyogUHJpdmF0ZSBrZXlzIGluIHBrY3MjOCBmb3JtYXQgaGF2ZSBhIHdlaXJkIGV4dHJhIGludCAqL1xyXG5cdGlmIChkZXIucGVlaygpID09PSBhc24xLkJlci5JbnRlZ2VyKSB7XHJcblx0XHRhc3NlcnQuc3RyaWN0RXF1YWwodHlwZSwgJ3ByaXZhdGUnLFxyXG5cdFx0ICAgICd1bmV4cGVjdGVkIEludGVnZXIgYXQgc3RhcnQgb2YgcHVibGljIGtleScpO1xyXG5cdFx0ZGVyLnJlYWRTdHJpbmcoYXNuMS5CZXIuSW50ZWdlciwgdHJ1ZSk7XHJcblx0fVxyXG5cclxuXHRkZXIucmVhZFNlcXVlbmNlKCk7XHJcblx0dmFyIG5leHQgPSBkZXIub2Zmc2V0ICsgZGVyLmxlbmd0aDtcclxuXHJcblx0dmFyIG9pZCA9IGRlci5yZWFkT0lEKCk7XHJcblx0c3dpdGNoIChvaWQpIHtcclxuXHRjYXNlICcxLjIuODQwLjExMzU0OS4xLjEuMSc6XHJcblx0XHRkZXIuX29mZnNldCA9IG5leHQ7XHJcblx0XHRpZiAodHlwZSA9PT0gJ3B1YmxpYycpXHJcblx0XHRcdHJldHVybiAocmVhZFBrY3M4UlNBUHVibGljKGRlcikpO1xyXG5cdFx0ZWxzZVxyXG5cdFx0XHRyZXR1cm4gKHJlYWRQa2NzOFJTQVByaXZhdGUoZGVyKSk7XHJcblx0Y2FzZSAnMS4yLjg0MC4xMDA0MC40LjEnOlxyXG5cdFx0aWYgKHR5cGUgPT09ICdwdWJsaWMnKVxyXG5cdFx0XHRyZXR1cm4gKHJlYWRQa2NzOERTQVB1YmxpYyhkZXIpKTtcclxuXHRcdGVsc2VcclxuXHRcdFx0cmV0dXJuIChyZWFkUGtjczhEU0FQcml2YXRlKGRlcikpO1xyXG5cdGNhc2UgJzEuMi44NDAuMTAwNDUuMi4xJzpcclxuXHRcdGlmICh0eXBlID09PSAncHVibGljJylcclxuXHRcdFx0cmV0dXJuIChyZWFkUGtjczhFQ0RTQVB1YmxpYyhkZXIpKTtcclxuXHRcdGVsc2VcclxuXHRcdFx0cmV0dXJuIChyZWFkUGtjczhFQ0RTQVByaXZhdGUoZGVyKSk7XHJcblx0Y2FzZSAnMS4zLjEwMS4xMTInOlxyXG5cdFx0aWYgKHR5cGUgPT09ICdwdWJsaWMnKSB7XHJcblx0XHRcdHJldHVybiAocmVhZFBrY3M4RWREU0FQdWJsaWMoZGVyKSk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRyZXR1cm4gKHJlYWRQa2NzOEVkRFNBUHJpdmF0ZShkZXIpKTtcclxuXHRcdH1cclxuXHRjYXNlICcxLjMuMTAxLjExMCc6XHJcblx0XHRpZiAodHlwZSA9PT0gJ3B1YmxpYycpIHtcclxuXHRcdFx0cmV0dXJuIChyZWFkUGtjczhYMjU1MTlQdWJsaWMoZGVyKSk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRyZXR1cm4gKHJlYWRQa2NzOFgyNTUxOVByaXZhdGUoZGVyKSk7XHJcblx0XHR9XHJcblx0ZGVmYXVsdDpcclxuXHRcdHRocm93IChuZXcgRXJyb3IoJ1Vua25vd24ga2V5IHR5cGUgT0lEICcgKyBvaWQpKTtcclxuXHR9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlYWRQa2NzOFJTQVB1YmxpYyhkZXIpIHtcclxuXHQvLyBiaXQgc3RyaW5nIHNlcXVlbmNlXHJcblx0ZGVyLnJlYWRTZXF1ZW5jZShhc24xLkJlci5CaXRTdHJpbmcpO1xyXG5cdGRlci5yZWFkQnl0ZSgpO1xyXG5cdGRlci5yZWFkU2VxdWVuY2UoKTtcclxuXHJcblx0Ly8gbW9kdWx1c1xyXG5cdHZhciBuID0gcmVhZE1QSW50KGRlciwgJ21vZHVsdXMnKTtcclxuXHR2YXIgZSA9IHJlYWRNUEludChkZXIsICdleHBvbmVudCcpO1xyXG5cclxuXHQvLyBub3csIG1ha2UgdGhlIGtleVxyXG5cdHZhciBrZXkgPSB7XHJcblx0XHR0eXBlOiAncnNhJyxcclxuXHRcdHNvdXJjZTogZGVyLm9yaWdpbmFsSW5wdXQsXHJcblx0XHRwYXJ0czogW1xyXG5cdFx0XHR7IG5hbWU6ICdlJywgZGF0YTogZSB9LFxyXG5cdFx0XHR7IG5hbWU6ICduJywgZGF0YTogbiB9XHJcblx0XHRdXHJcblx0fTtcclxuXHJcblx0cmV0dXJuIChuZXcgS2V5KGtleSkpO1xyXG59XHJcblxyXG5mdW5jdGlvbiByZWFkUGtjczhSU0FQcml2YXRlKGRlcikge1xyXG5cdGRlci5yZWFkU2VxdWVuY2UoYXNuMS5CZXIuT2N0ZXRTdHJpbmcpO1xyXG5cdGRlci5yZWFkU2VxdWVuY2UoKTtcclxuXHJcblx0dmFyIHZlciA9IHJlYWRNUEludChkZXIsICd2ZXJzaW9uJyk7XHJcblx0YXNzZXJ0LmVxdWFsKHZlclswXSwgMHgwLCAndW5rbm93biBSU0EgcHJpdmF0ZSBrZXkgdmVyc2lvbicpO1xyXG5cclxuXHQvLyBtb2R1bHVzIHRoZW4gcHVibGljIGV4cG9uZW50XHJcblx0dmFyIG4gPSByZWFkTVBJbnQoZGVyLCAnbW9kdWx1cycpO1xyXG5cdHZhciBlID0gcmVhZE1QSW50KGRlciwgJ3B1YmxpYyBleHBvbmVudCcpO1xyXG5cdHZhciBkID0gcmVhZE1QSW50KGRlciwgJ3ByaXZhdGUgZXhwb25lbnQnKTtcclxuXHR2YXIgcCA9IHJlYWRNUEludChkZXIsICdwcmltZTEnKTtcclxuXHR2YXIgcSA9IHJlYWRNUEludChkZXIsICdwcmltZTInKTtcclxuXHR2YXIgZG1vZHAgPSByZWFkTVBJbnQoZGVyLCAnZXhwb25lbnQxJyk7XHJcblx0dmFyIGRtb2RxID0gcmVhZE1QSW50KGRlciwgJ2V4cG9uZW50MicpO1xyXG5cdHZhciBpcW1wID0gcmVhZE1QSW50KGRlciwgJ2lxbXAnKTtcclxuXHJcblx0Ly8gbm93LCBtYWtlIHRoZSBrZXlcclxuXHR2YXIga2V5ID0ge1xyXG5cdFx0dHlwZTogJ3JzYScsXHJcblx0XHRwYXJ0czogW1xyXG5cdFx0XHR7IG5hbWU6ICduJywgZGF0YTogbiB9LFxyXG5cdFx0XHR7IG5hbWU6ICdlJywgZGF0YTogZSB9LFxyXG5cdFx0XHR7IG5hbWU6ICdkJywgZGF0YTogZCB9LFxyXG5cdFx0XHR7IG5hbWU6ICdpcW1wJywgZGF0YTogaXFtcCB9LFxyXG5cdFx0XHR7IG5hbWU6ICdwJywgZGF0YTogcCB9LFxyXG5cdFx0XHR7IG5hbWU6ICdxJywgZGF0YTogcSB9LFxyXG5cdFx0XHR7IG5hbWU6ICdkbW9kcCcsIGRhdGE6IGRtb2RwIH0sXHJcblx0XHRcdHsgbmFtZTogJ2Rtb2RxJywgZGF0YTogZG1vZHEgfVxyXG5cdFx0XVxyXG5cdH07XHJcblxyXG5cdHJldHVybiAobmV3IFByaXZhdGVLZXkoa2V5KSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlYWRQa2NzOERTQVB1YmxpYyhkZXIpIHtcclxuXHRkZXIucmVhZFNlcXVlbmNlKCk7XHJcblxyXG5cdHZhciBwID0gcmVhZE1QSW50KGRlciwgJ3AnKTtcclxuXHR2YXIgcSA9IHJlYWRNUEludChkZXIsICdxJyk7XHJcblx0dmFyIGcgPSByZWFkTVBJbnQoZGVyLCAnZycpO1xyXG5cclxuXHQvLyBiaXQgc3RyaW5nIHNlcXVlbmNlXHJcblx0ZGVyLnJlYWRTZXF1ZW5jZShhc24xLkJlci5CaXRTdHJpbmcpO1xyXG5cdGRlci5yZWFkQnl0ZSgpO1xyXG5cclxuXHR2YXIgeSA9IHJlYWRNUEludChkZXIsICd5Jyk7XHJcblxyXG5cdC8vIG5vdywgbWFrZSB0aGUga2V5XHJcblx0dmFyIGtleSA9IHtcclxuXHRcdHR5cGU6ICdkc2EnLFxyXG5cdFx0cGFydHM6IFtcclxuXHRcdFx0eyBuYW1lOiAncCcsIGRhdGE6IHAgfSxcclxuXHRcdFx0eyBuYW1lOiAncScsIGRhdGE6IHEgfSxcclxuXHRcdFx0eyBuYW1lOiAnZycsIGRhdGE6IGcgfSxcclxuXHRcdFx0eyBuYW1lOiAneScsIGRhdGE6IHkgfVxyXG5cdFx0XVxyXG5cdH07XHJcblxyXG5cdHJldHVybiAobmV3IEtleShrZXkpKTtcclxufVxyXG5cclxuZnVuY3Rpb24gcmVhZFBrY3M4RFNBUHJpdmF0ZShkZXIpIHtcclxuXHRkZXIucmVhZFNlcXVlbmNlKCk7XHJcblxyXG5cdHZhciBwID0gcmVhZE1QSW50KGRlciwgJ3AnKTtcclxuXHR2YXIgcSA9IHJlYWRNUEludChkZXIsICdxJyk7XHJcblx0dmFyIGcgPSByZWFkTVBJbnQoZGVyLCAnZycpO1xyXG5cclxuXHRkZXIucmVhZFNlcXVlbmNlKGFzbjEuQmVyLk9jdGV0U3RyaW5nKTtcclxuXHR2YXIgeCA9IHJlYWRNUEludChkZXIsICd4Jyk7XHJcblxyXG5cdC8qIFRoZSBwa2NzIzggZm9ybWF0IGRvZXMgbm90IGluY2x1ZGUgdGhlIHB1YmxpYyBrZXkgKi9cclxuXHR2YXIgeSA9IHV0aWxzLmNhbGN1bGF0ZURTQVB1YmxpYyhnLCBwLCB4KTtcclxuXHJcblx0dmFyIGtleSA9IHtcclxuXHRcdHR5cGU6ICdkc2EnLFxyXG5cdFx0cGFydHM6IFtcclxuXHRcdFx0eyBuYW1lOiAncCcsIGRhdGE6IHAgfSxcclxuXHRcdFx0eyBuYW1lOiAncScsIGRhdGE6IHEgfSxcclxuXHRcdFx0eyBuYW1lOiAnZycsIGRhdGE6IGcgfSxcclxuXHRcdFx0eyBuYW1lOiAneScsIGRhdGE6IHkgfSxcclxuXHRcdFx0eyBuYW1lOiAneCcsIGRhdGE6IHggfVxyXG5cdFx0XVxyXG5cdH07XHJcblxyXG5cdHJldHVybiAobmV3IFByaXZhdGVLZXkoa2V5KSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlYWRFQ0RTQUN1cnZlKGRlcikge1xyXG5cdHZhciBjdXJ2ZU5hbWUsIGN1cnZlTmFtZXM7XHJcblx0dmFyIGosIGMsIGNkO1xyXG5cclxuXHRpZiAoZGVyLnBlZWsoKSA9PT0gYXNuMS5CZXIuT0lEKSB7XHJcblx0XHR2YXIgb2lkID0gZGVyLnJlYWRPSUQoKTtcclxuXHJcblx0XHRjdXJ2ZU5hbWVzID0gT2JqZWN0LmtleXMoYWxncy5jdXJ2ZXMpO1xyXG5cdFx0Zm9yIChqID0gMDsgaiA8IGN1cnZlTmFtZXMubGVuZ3RoOyArK2opIHtcclxuXHRcdFx0YyA9IGN1cnZlTmFtZXNbal07XHJcblx0XHRcdGNkID0gYWxncy5jdXJ2ZXNbY107XHJcblx0XHRcdGlmIChjZC5wa2NzOG9pZCA9PT0gb2lkKSB7XHJcblx0XHRcdFx0Y3VydmVOYW1lID0gYztcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHR9IGVsc2Uge1xyXG5cdFx0Ly8gRUNQYXJhbWV0ZXJzIHNlcXVlbmNlXHJcblx0XHRkZXIucmVhZFNlcXVlbmNlKCk7XHJcblx0XHR2YXIgdmVyc2lvbiA9IGRlci5yZWFkU3RyaW5nKGFzbjEuQmVyLkludGVnZXIsIHRydWUpO1xyXG5cdFx0YXNzZXJ0LnN0cmljdEVxdWFsKHZlcnNpb25bMF0sIDEsICdFQ0RTQSBrZXkgbm90IHZlcnNpb24gMScpO1xyXG5cclxuXHRcdHZhciBjdXJ2ZSA9IHt9O1xyXG5cclxuXHRcdC8vIEZpZWxkSUQgc2VxdWVuY2VcclxuXHRcdGRlci5yZWFkU2VxdWVuY2UoKTtcclxuXHRcdHZhciBmaWVsZFR5cGVPaWQgPSBkZXIucmVhZE9JRCgpO1xyXG5cdFx0YXNzZXJ0LnN0cmljdEVxdWFsKGZpZWxkVHlwZU9pZCwgJzEuMi44NDAuMTAwNDUuMS4xJyxcclxuXHRcdCAgICAnRUNEU0Ega2V5IGlzIG5vdCBmcm9tIGEgcHJpbWUtZmllbGQnKTtcclxuXHRcdHZhciBwID0gY3VydmUucCA9IHV0aWxzLm1wTm9ybWFsaXplKFxyXG5cdFx0ICAgIGRlci5yZWFkU3RyaW5nKGFzbjEuQmVyLkludGVnZXIsIHRydWUpKTtcclxuXHRcdC8qXHJcblx0XHQgKiBwIGFsd2F5cyBzdGFydHMgd2l0aCBhIDEgYml0LCBzbyBjb3VudCB0aGUgemVyb3MgdG8gZ2V0IGl0c1xyXG5cdFx0ICogcmVhbCBzaXplLlxyXG5cdFx0ICovXHJcblx0XHRjdXJ2ZS5zaXplID0gcC5sZW5ndGggKiA4IC0gdXRpbHMuY291bnRaZXJvcyhwKTtcclxuXHJcblx0XHQvLyBDdXJ2ZSBzZXF1ZW5jZVxyXG5cdFx0ZGVyLnJlYWRTZXF1ZW5jZSgpO1xyXG5cdFx0Y3VydmUuYSA9IHV0aWxzLm1wTm9ybWFsaXplKFxyXG5cdFx0ICAgIGRlci5yZWFkU3RyaW5nKGFzbjEuQmVyLk9jdGV0U3RyaW5nLCB0cnVlKSk7XHJcblx0XHRjdXJ2ZS5iID0gdXRpbHMubXBOb3JtYWxpemUoXHJcblx0XHQgICAgZGVyLnJlYWRTdHJpbmcoYXNuMS5CZXIuT2N0ZXRTdHJpbmcsIHRydWUpKTtcclxuXHRcdGlmIChkZXIucGVlaygpID09PSBhc24xLkJlci5CaXRTdHJpbmcpXHJcblx0XHRcdGN1cnZlLnMgPSBkZXIucmVhZFN0cmluZyhhc24xLkJlci5CaXRTdHJpbmcsIHRydWUpO1xyXG5cclxuXHRcdC8vIENvbWJpbmVkIEd4IGFuZCBHeVxyXG5cdFx0Y3VydmUuRyA9IGRlci5yZWFkU3RyaW5nKGFzbjEuQmVyLk9jdGV0U3RyaW5nLCB0cnVlKTtcclxuXHRcdGFzc2VydC5zdHJpY3RFcXVhbChjdXJ2ZS5HWzBdLCAweDQsXHJcblx0XHQgICAgJ3VuY29tcHJlc3NlZCBHIGlzIHJlcXVpcmVkJyk7XHJcblxyXG5cdFx0Y3VydmUubiA9IHV0aWxzLm1wTm9ybWFsaXplKFxyXG5cdFx0ICAgIGRlci5yZWFkU3RyaW5nKGFzbjEuQmVyLkludGVnZXIsIHRydWUpKTtcclxuXHRcdGN1cnZlLmggPSB1dGlscy5tcE5vcm1hbGl6ZShcclxuXHRcdCAgICBkZXIucmVhZFN0cmluZyhhc24xLkJlci5JbnRlZ2VyLCB0cnVlKSk7XHJcblx0XHRhc3NlcnQuc3RyaWN0RXF1YWwoY3VydmUuaFswXSwgMHgxLCAnYSBjb2ZhY3Rvcj0xIGN1cnZlIGlzICcgK1xyXG5cdFx0ICAgICdyZXF1aXJlZCcpO1xyXG5cclxuXHRcdGN1cnZlTmFtZXMgPSBPYmplY3Qua2V5cyhhbGdzLmN1cnZlcyk7XHJcblx0XHR2YXIga3MgPSBPYmplY3Qua2V5cyhjdXJ2ZSk7XHJcblx0XHRmb3IgKGogPSAwOyBqIDwgY3VydmVOYW1lcy5sZW5ndGg7ICsraikge1xyXG5cdFx0XHRjID0gY3VydmVOYW1lc1tqXTtcclxuXHRcdFx0Y2QgPSBhbGdzLmN1cnZlc1tjXTtcclxuXHRcdFx0dmFyIGVxdWFsID0gdHJ1ZTtcclxuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBrcy5sZW5ndGg7ICsraSkge1xyXG5cdFx0XHRcdHZhciBrID0ga3NbaV07XHJcblx0XHRcdFx0aWYgKGNkW2tdID09PSB1bmRlZmluZWQpXHJcblx0XHRcdFx0XHRjb250aW51ZTtcclxuXHRcdFx0XHRpZiAodHlwZW9mIChjZFtrXSkgPT09ICdvYmplY3QnICYmXHJcblx0XHRcdFx0ICAgIGNkW2tdLmVxdWFscyAhPT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdFx0XHRpZiAoIWNkW2tdLmVxdWFscyhjdXJ2ZVtrXSkpIHtcclxuXHRcdFx0XHRcdFx0ZXF1YWwgPSBmYWxzZTtcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSBlbHNlIGlmIChCdWZmZXIuaXNCdWZmZXIoY2Rba10pKSB7XHJcblx0XHRcdFx0XHRpZiAoY2Rba10udG9TdHJpbmcoJ2JpbmFyeScpXHJcblx0XHRcdFx0XHQgICAgIT09IGN1cnZlW2tdLnRvU3RyaW5nKCdiaW5hcnknKSkge1xyXG5cdFx0XHRcdFx0XHRlcXVhbCA9IGZhbHNlO1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0aWYgKGNkW2tdICE9PSBjdXJ2ZVtrXSkge1xyXG5cdFx0XHRcdFx0XHRlcXVhbCA9IGZhbHNlO1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKGVxdWFsKSB7XHJcblx0XHRcdFx0Y3VydmVOYW1lID0gYztcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHRyZXR1cm4gKGN1cnZlTmFtZSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlYWRQa2NzOEVDRFNBUHJpdmF0ZShkZXIpIHtcclxuXHR2YXIgY3VydmVOYW1lID0gcmVhZEVDRFNBQ3VydmUoZGVyKTtcclxuXHRhc3NlcnQuc3RyaW5nKGN1cnZlTmFtZSwgJ2Ega25vd24gZWxsaXB0aWMgY3VydmUnKTtcclxuXHJcblx0ZGVyLnJlYWRTZXF1ZW5jZShhc24xLkJlci5PY3RldFN0cmluZyk7XHJcblx0ZGVyLnJlYWRTZXF1ZW5jZSgpO1xyXG5cclxuXHR2YXIgdmVyc2lvbiA9IHJlYWRNUEludChkZXIsICd2ZXJzaW9uJyk7XHJcblx0YXNzZXJ0LmVxdWFsKHZlcnNpb25bMF0sIDEsICd1bmtub3duIHZlcnNpb24gb2YgRUNEU0Ega2V5Jyk7XHJcblxyXG5cdHZhciBkID0gZGVyLnJlYWRTdHJpbmcoYXNuMS5CZXIuT2N0ZXRTdHJpbmcsIHRydWUpO1xyXG5cdHZhciBRO1xyXG5cclxuXHRpZiAoZGVyLnBlZWsoKSA9PSAweGEwKSB7XHJcblx0XHRkZXIucmVhZFNlcXVlbmNlKDB4YTApO1xyXG5cdFx0ZGVyLl9vZmZzZXQgKz0gZGVyLmxlbmd0aDtcclxuXHR9XHJcblx0aWYgKGRlci5wZWVrKCkgPT0gMHhhMSkge1xyXG5cdFx0ZGVyLnJlYWRTZXF1ZW5jZSgweGExKTtcclxuXHRcdFEgPSBkZXIucmVhZFN0cmluZyhhc24xLkJlci5CaXRTdHJpbmcsIHRydWUpO1xyXG5cdFx0USA9IHV0aWxzLmVjTm9ybWFsaXplKFEpO1xyXG5cdH1cclxuXHJcblx0aWYgKFEgPT09IHVuZGVmaW5lZCkge1xyXG5cdFx0dmFyIHB1YiA9IHV0aWxzLnB1YmxpY0Zyb21Qcml2YXRlRUNEU0EoY3VydmVOYW1lLCBkKTtcclxuXHRcdFEgPSBwdWIucGFydC5RLmRhdGE7XHJcblx0fVxyXG5cclxuXHR2YXIga2V5ID0ge1xyXG5cdFx0dHlwZTogJ2VjZHNhJyxcclxuXHRcdHBhcnRzOiBbXHJcblx0XHRcdHsgbmFtZTogJ2N1cnZlJywgZGF0YTogQnVmZmVyLmZyb20oY3VydmVOYW1lKSB9LFxyXG5cdFx0XHR7IG5hbWU6ICdRJywgZGF0YTogUSB9LFxyXG5cdFx0XHR7IG5hbWU6ICdkJywgZGF0YTogZCB9XHJcblx0XHRdXHJcblx0fTtcclxuXHJcblx0cmV0dXJuIChuZXcgUHJpdmF0ZUtleShrZXkpKTtcclxufVxyXG5cclxuZnVuY3Rpb24gcmVhZFBrY3M4RUNEU0FQdWJsaWMoZGVyKSB7XHJcblx0dmFyIGN1cnZlTmFtZSA9IHJlYWRFQ0RTQUN1cnZlKGRlcik7XHJcblx0YXNzZXJ0LnN0cmluZyhjdXJ2ZU5hbWUsICdhIGtub3duIGVsbGlwdGljIGN1cnZlJyk7XHJcblxyXG5cdHZhciBRID0gZGVyLnJlYWRTdHJpbmcoYXNuMS5CZXIuQml0U3RyaW5nLCB0cnVlKTtcclxuXHRRID0gdXRpbHMuZWNOb3JtYWxpemUoUSk7XHJcblxyXG5cdHZhciBrZXkgPSB7XHJcblx0XHR0eXBlOiAnZWNkc2EnLFxyXG5cdFx0cGFydHM6IFtcclxuXHRcdFx0eyBuYW1lOiAnY3VydmUnLCBkYXRhOiBCdWZmZXIuZnJvbShjdXJ2ZU5hbWUpIH0sXHJcblx0XHRcdHsgbmFtZTogJ1EnLCBkYXRhOiBRIH1cclxuXHRcdF1cclxuXHR9O1xyXG5cclxuXHRyZXR1cm4gKG5ldyBLZXkoa2V5KSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlYWRQa2NzOEVkRFNBUHVibGljKGRlcikge1xyXG5cdGlmIChkZXIucGVlaygpID09PSAweDAwKVxyXG5cdFx0ZGVyLnJlYWRCeXRlKCk7XHJcblxyXG5cdHZhciBBID0gdXRpbHMucmVhZEJpdFN0cmluZyhkZXIpO1xyXG5cclxuXHR2YXIga2V5ID0ge1xyXG5cdFx0dHlwZTogJ2VkMjU1MTknLFxyXG5cdFx0cGFydHM6IFtcclxuXHRcdFx0eyBuYW1lOiAnQScsIGRhdGE6IHV0aWxzLnplcm9QYWRUb0xlbmd0aChBLCAzMikgfVxyXG5cdFx0XVxyXG5cdH07XHJcblxyXG5cdHJldHVybiAobmV3IEtleShrZXkpKTtcclxufVxyXG5cclxuZnVuY3Rpb24gcmVhZFBrY3M4WDI1NTE5UHVibGljKGRlcikge1xyXG5cdHZhciBBID0gdXRpbHMucmVhZEJpdFN0cmluZyhkZXIpO1xyXG5cclxuXHR2YXIga2V5ID0ge1xyXG5cdFx0dHlwZTogJ2N1cnZlMjU1MTknLFxyXG5cdFx0cGFydHM6IFtcclxuXHRcdFx0eyBuYW1lOiAnQScsIGRhdGE6IHV0aWxzLnplcm9QYWRUb0xlbmd0aChBLCAzMikgfVxyXG5cdFx0XVxyXG5cdH07XHJcblxyXG5cdHJldHVybiAobmV3IEtleShrZXkpKTtcclxufVxyXG5cclxuZnVuY3Rpb24gcmVhZFBrY3M4RWREU0FQcml2YXRlKGRlcikge1xyXG5cdGlmIChkZXIucGVlaygpID09PSAweDAwKVxyXG5cdFx0ZGVyLnJlYWRCeXRlKCk7XHJcblxyXG5cdGRlci5yZWFkU2VxdWVuY2UoYXNuMS5CZXIuT2N0ZXRTdHJpbmcpO1xyXG5cdHZhciBrID0gZGVyLnJlYWRTdHJpbmcoYXNuMS5CZXIuT2N0ZXRTdHJpbmcsIHRydWUpO1xyXG5cdGsgPSB1dGlscy56ZXJvUGFkVG9MZW5ndGgoaywgMzIpO1xyXG5cclxuXHR2YXIgQTtcclxuXHRpZiAoZGVyLnBlZWsoKSA9PT0gYXNuMS5CZXIuQml0U3RyaW5nKSB7XHJcblx0XHRBID0gdXRpbHMucmVhZEJpdFN0cmluZyhkZXIpO1xyXG5cdFx0QSA9IHV0aWxzLnplcm9QYWRUb0xlbmd0aChBLCAzMik7XHJcblx0fSBlbHNlIHtcclxuXHRcdEEgPSB1dGlscy5jYWxjdWxhdGVFRDI1NTE5UHVibGljKGspO1xyXG5cdH1cclxuXHJcblx0dmFyIGtleSA9IHtcclxuXHRcdHR5cGU6ICdlZDI1NTE5JyxcclxuXHRcdHBhcnRzOiBbXHJcblx0XHRcdHsgbmFtZTogJ0EnLCBkYXRhOiB1dGlscy56ZXJvUGFkVG9MZW5ndGgoQSwgMzIpIH0sXHJcblx0XHRcdHsgbmFtZTogJ2snLCBkYXRhOiB1dGlscy56ZXJvUGFkVG9MZW5ndGgoaywgMzIpIH1cclxuXHRcdF1cclxuXHR9O1xyXG5cclxuXHRyZXR1cm4gKG5ldyBQcml2YXRlS2V5KGtleSkpO1xyXG59XHJcblxyXG5mdW5jdGlvbiByZWFkUGtjczhYMjU1MTlQcml2YXRlKGRlcikge1xyXG5cdGlmIChkZXIucGVlaygpID09PSAweDAwKVxyXG5cdFx0ZGVyLnJlYWRCeXRlKCk7XHJcblxyXG5cdGRlci5yZWFkU2VxdWVuY2UoYXNuMS5CZXIuT2N0ZXRTdHJpbmcpO1xyXG5cdHZhciBrID0gZGVyLnJlYWRTdHJpbmcoYXNuMS5CZXIuT2N0ZXRTdHJpbmcsIHRydWUpO1xyXG5cdGsgPSB1dGlscy56ZXJvUGFkVG9MZW5ndGgoaywgMzIpO1xyXG5cclxuXHR2YXIgQSA9IHV0aWxzLmNhbGN1bGF0ZVgyNTUxOVB1YmxpYyhrKTtcclxuXHJcblx0dmFyIGtleSA9IHtcclxuXHRcdHR5cGU6ICdjdXJ2ZTI1NTE5JyxcclxuXHRcdHBhcnRzOiBbXHJcblx0XHRcdHsgbmFtZTogJ0EnLCBkYXRhOiB1dGlscy56ZXJvUGFkVG9MZW5ndGgoQSwgMzIpIH0sXHJcblx0XHRcdHsgbmFtZTogJ2snLCBkYXRhOiB1dGlscy56ZXJvUGFkVG9MZW5ndGgoaywgMzIpIH1cclxuXHRcdF1cclxuXHR9O1xyXG5cclxuXHRyZXR1cm4gKG5ldyBQcml2YXRlS2V5KGtleSkpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBwa2NzOFRvQnVmZmVyKGtleSkge1xyXG5cdHZhciBkZXIgPSBuZXcgYXNuMS5CZXJXcml0ZXIoKTtcclxuXHR3cml0ZVBrY3M4KGRlciwga2V5KTtcclxuXHRyZXR1cm4gKGRlci5idWZmZXIpO1xyXG59XHJcblxyXG5mdW5jdGlvbiB3cml0ZVBrY3M4KGRlciwga2V5KSB7XHJcblx0ZGVyLnN0YXJ0U2VxdWVuY2UoKTtcclxuXHJcblx0aWYgKFByaXZhdGVLZXkuaXNQcml2YXRlS2V5KGtleSkpIHtcclxuXHRcdHZhciBzaWxseUludCA9IEJ1ZmZlci5mcm9tKFswXSk7XHJcblx0XHRkZXIud3JpdGVCdWZmZXIoc2lsbHlJbnQsIGFzbjEuQmVyLkludGVnZXIpO1xyXG5cdH1cclxuXHJcblx0ZGVyLnN0YXJ0U2VxdWVuY2UoKTtcclxuXHRzd2l0Y2ggKGtleS50eXBlKSB7XHJcblx0Y2FzZSAncnNhJzpcclxuXHRcdGRlci53cml0ZU9JRCgnMS4yLjg0MC4xMTM1NDkuMS4xLjEnKTtcclxuXHRcdGlmIChQcml2YXRlS2V5LmlzUHJpdmF0ZUtleShrZXkpKVxyXG5cdFx0XHR3cml0ZVBrY3M4UlNBUHJpdmF0ZShrZXksIGRlcik7XHJcblx0XHRlbHNlXHJcblx0XHRcdHdyaXRlUGtjczhSU0FQdWJsaWMoa2V5LCBkZXIpO1xyXG5cdFx0YnJlYWs7XHJcblx0Y2FzZSAnZHNhJzpcclxuXHRcdGRlci53cml0ZU9JRCgnMS4yLjg0MC4xMDA0MC40LjEnKTtcclxuXHRcdGlmIChQcml2YXRlS2V5LmlzUHJpdmF0ZUtleShrZXkpKVxyXG5cdFx0XHR3cml0ZVBrY3M4RFNBUHJpdmF0ZShrZXksIGRlcik7XHJcblx0XHRlbHNlXHJcblx0XHRcdHdyaXRlUGtjczhEU0FQdWJsaWMoa2V5LCBkZXIpO1xyXG5cdFx0YnJlYWs7XHJcblx0Y2FzZSAnZWNkc2EnOlxyXG5cdFx0ZGVyLndyaXRlT0lEKCcxLjIuODQwLjEwMDQ1LjIuMScpO1xyXG5cdFx0aWYgKFByaXZhdGVLZXkuaXNQcml2YXRlS2V5KGtleSkpXHJcblx0XHRcdHdyaXRlUGtjczhFQ0RTQVByaXZhdGUoa2V5LCBkZXIpO1xyXG5cdFx0ZWxzZVxyXG5cdFx0XHR3cml0ZVBrY3M4RUNEU0FQdWJsaWMoa2V5LCBkZXIpO1xyXG5cdFx0YnJlYWs7XHJcblx0Y2FzZSAnZWQyNTUxOSc6XHJcblx0XHRkZXIud3JpdGVPSUQoJzEuMy4xMDEuMTEyJyk7XHJcblx0XHRpZiAoUHJpdmF0ZUtleS5pc1ByaXZhdGVLZXkoa2V5KSlcclxuXHRcdFx0dGhyb3cgKG5ldyBFcnJvcignRWQyNTUxOSBwcml2YXRlIGtleXMgaW4gcGtjczggJyArXHJcblx0XHRcdCAgICAnZm9ybWF0IGFyZSBub3Qgc3VwcG9ydGVkJykpO1xyXG5cdFx0d3JpdGVQa2NzOEVkRFNBUHVibGljKGtleSwgZGVyKTtcclxuXHRcdGJyZWFrO1xyXG5cdGRlZmF1bHQ6XHJcblx0XHR0aHJvdyAobmV3IEVycm9yKCdVbnN1cHBvcnRlZCBrZXkgdHlwZTogJyArIGtleS50eXBlKSk7XHJcblx0fVxyXG5cclxuXHRkZXIuZW5kU2VxdWVuY2UoKTtcclxufVxyXG5cclxuZnVuY3Rpb24gd3JpdGVQa2NzOFJTQVByaXZhdGUoa2V5LCBkZXIpIHtcclxuXHRkZXIud3JpdGVOdWxsKCk7XHJcblx0ZGVyLmVuZFNlcXVlbmNlKCk7XHJcblxyXG5cdGRlci5zdGFydFNlcXVlbmNlKGFzbjEuQmVyLk9jdGV0U3RyaW5nKTtcclxuXHRkZXIuc3RhcnRTZXF1ZW5jZSgpO1xyXG5cclxuXHR2YXIgdmVyc2lvbiA9IEJ1ZmZlci5mcm9tKFswXSk7XHJcblx0ZGVyLndyaXRlQnVmZmVyKHZlcnNpb24sIGFzbjEuQmVyLkludGVnZXIpO1xyXG5cclxuXHRkZXIud3JpdGVCdWZmZXIoa2V5LnBhcnQubi5kYXRhLCBhc24xLkJlci5JbnRlZ2VyKTtcclxuXHRkZXIud3JpdGVCdWZmZXIoa2V5LnBhcnQuZS5kYXRhLCBhc24xLkJlci5JbnRlZ2VyKTtcclxuXHRkZXIud3JpdGVCdWZmZXIoa2V5LnBhcnQuZC5kYXRhLCBhc24xLkJlci5JbnRlZ2VyKTtcclxuXHRkZXIud3JpdGVCdWZmZXIoa2V5LnBhcnQucC5kYXRhLCBhc24xLkJlci5JbnRlZ2VyKTtcclxuXHRkZXIud3JpdGVCdWZmZXIoa2V5LnBhcnQucS5kYXRhLCBhc24xLkJlci5JbnRlZ2VyKTtcclxuXHRpZiAoIWtleS5wYXJ0LmRtb2RwIHx8ICFrZXkucGFydC5kbW9kcSlcclxuXHRcdHV0aWxzLmFkZFJTQU1pc3Npbmcoa2V5KTtcclxuXHRkZXIud3JpdGVCdWZmZXIoa2V5LnBhcnQuZG1vZHAuZGF0YSwgYXNuMS5CZXIuSW50ZWdlcik7XHJcblx0ZGVyLndyaXRlQnVmZmVyKGtleS5wYXJ0LmRtb2RxLmRhdGEsIGFzbjEuQmVyLkludGVnZXIpO1xyXG5cdGRlci53cml0ZUJ1ZmZlcihrZXkucGFydC5pcW1wLmRhdGEsIGFzbjEuQmVyLkludGVnZXIpO1xyXG5cclxuXHRkZXIuZW5kU2VxdWVuY2UoKTtcclxuXHRkZXIuZW5kU2VxdWVuY2UoKTtcclxufVxyXG5cclxuZnVuY3Rpb24gd3JpdGVQa2NzOFJTQVB1YmxpYyhrZXksIGRlcikge1xyXG5cdGRlci53cml0ZU51bGwoKTtcclxuXHRkZXIuZW5kU2VxdWVuY2UoKTtcclxuXHJcblx0ZGVyLnN0YXJ0U2VxdWVuY2UoYXNuMS5CZXIuQml0U3RyaW5nKTtcclxuXHRkZXIud3JpdGVCeXRlKDB4MDApO1xyXG5cclxuXHRkZXIuc3RhcnRTZXF1ZW5jZSgpO1xyXG5cdGRlci53cml0ZUJ1ZmZlcihrZXkucGFydC5uLmRhdGEsIGFzbjEuQmVyLkludGVnZXIpO1xyXG5cdGRlci53cml0ZUJ1ZmZlcihrZXkucGFydC5lLmRhdGEsIGFzbjEuQmVyLkludGVnZXIpO1xyXG5cdGRlci5lbmRTZXF1ZW5jZSgpO1xyXG5cclxuXHRkZXIuZW5kU2VxdWVuY2UoKTtcclxufVxyXG5cclxuZnVuY3Rpb24gd3JpdGVQa2NzOERTQVByaXZhdGUoa2V5LCBkZXIpIHtcclxuXHRkZXIuc3RhcnRTZXF1ZW5jZSgpO1xyXG5cdGRlci53cml0ZUJ1ZmZlcihrZXkucGFydC5wLmRhdGEsIGFzbjEuQmVyLkludGVnZXIpO1xyXG5cdGRlci53cml0ZUJ1ZmZlcihrZXkucGFydC5xLmRhdGEsIGFzbjEuQmVyLkludGVnZXIpO1xyXG5cdGRlci53cml0ZUJ1ZmZlcihrZXkucGFydC5nLmRhdGEsIGFzbjEuQmVyLkludGVnZXIpO1xyXG5cdGRlci5lbmRTZXF1ZW5jZSgpO1xyXG5cclxuXHRkZXIuZW5kU2VxdWVuY2UoKTtcclxuXHJcblx0ZGVyLnN0YXJ0U2VxdWVuY2UoYXNuMS5CZXIuT2N0ZXRTdHJpbmcpO1xyXG5cdGRlci53cml0ZUJ1ZmZlcihrZXkucGFydC54LmRhdGEsIGFzbjEuQmVyLkludGVnZXIpO1xyXG5cdGRlci5lbmRTZXF1ZW5jZSgpO1xyXG59XHJcblxyXG5mdW5jdGlvbiB3cml0ZVBrY3M4RFNBUHVibGljKGtleSwgZGVyKSB7XHJcblx0ZGVyLnN0YXJ0U2VxdWVuY2UoKTtcclxuXHRkZXIud3JpdGVCdWZmZXIoa2V5LnBhcnQucC5kYXRhLCBhc24xLkJlci5JbnRlZ2VyKTtcclxuXHRkZXIud3JpdGVCdWZmZXIoa2V5LnBhcnQucS5kYXRhLCBhc24xLkJlci5JbnRlZ2VyKTtcclxuXHRkZXIud3JpdGVCdWZmZXIoa2V5LnBhcnQuZy5kYXRhLCBhc24xLkJlci5JbnRlZ2VyKTtcclxuXHRkZXIuZW5kU2VxdWVuY2UoKTtcclxuXHRkZXIuZW5kU2VxdWVuY2UoKTtcclxuXHJcblx0ZGVyLnN0YXJ0U2VxdWVuY2UoYXNuMS5CZXIuQml0U3RyaW5nKTtcclxuXHRkZXIud3JpdGVCeXRlKDB4MDApO1xyXG5cdGRlci53cml0ZUJ1ZmZlcihrZXkucGFydC55LmRhdGEsIGFzbjEuQmVyLkludGVnZXIpO1xyXG5cdGRlci5lbmRTZXF1ZW5jZSgpO1xyXG59XHJcblxyXG5mdW5jdGlvbiB3cml0ZUVDRFNBQ3VydmUoa2V5LCBkZXIpIHtcclxuXHR2YXIgY3VydmUgPSBhbGdzLmN1cnZlc1trZXkuY3VydmVdO1xyXG5cdGlmIChjdXJ2ZS5wa2NzOG9pZCkge1xyXG5cdFx0LyogVGhpcyBvbmUgaGFzIGEgbmFtZSBpbiBwa2NzIzgsIHNvIGp1c3Qgd3JpdGUgdGhlIG9pZCAqL1xyXG5cdFx0ZGVyLndyaXRlT0lEKGN1cnZlLnBrY3M4b2lkKTtcclxuXHJcblx0fSBlbHNlIHtcclxuXHRcdC8vIEVDUGFyYW1ldGVycyBzZXF1ZW5jZVxyXG5cdFx0ZGVyLnN0YXJ0U2VxdWVuY2UoKTtcclxuXHJcblx0XHR2YXIgdmVyc2lvbiA9IEJ1ZmZlci5mcm9tKFsxXSk7XHJcblx0XHRkZXIud3JpdGVCdWZmZXIodmVyc2lvbiwgYXNuMS5CZXIuSW50ZWdlcik7XHJcblxyXG5cdFx0Ly8gRmllbGRJRCBzZXF1ZW5jZVxyXG5cdFx0ZGVyLnN0YXJ0U2VxdWVuY2UoKTtcclxuXHRcdGRlci53cml0ZU9JRCgnMS4yLjg0MC4xMDA0NS4xLjEnKTsgLy8gcHJpbWUtZmllbGRcclxuXHRcdGRlci53cml0ZUJ1ZmZlcihjdXJ2ZS5wLCBhc24xLkJlci5JbnRlZ2VyKTtcclxuXHRcdGRlci5lbmRTZXF1ZW5jZSgpO1xyXG5cclxuXHRcdC8vIEN1cnZlIHNlcXVlbmNlXHJcblx0XHRkZXIuc3RhcnRTZXF1ZW5jZSgpO1xyXG5cdFx0dmFyIGEgPSBjdXJ2ZS5wO1xyXG5cdFx0aWYgKGFbMF0gPT09IDB4MClcclxuXHRcdFx0YSA9IGEuc2xpY2UoMSk7XHJcblx0XHRkZXIud3JpdGVCdWZmZXIoYSwgYXNuMS5CZXIuT2N0ZXRTdHJpbmcpO1xyXG5cdFx0ZGVyLndyaXRlQnVmZmVyKGN1cnZlLmIsIGFzbjEuQmVyLk9jdGV0U3RyaW5nKTtcclxuXHRcdGRlci53cml0ZUJ1ZmZlcihjdXJ2ZS5zLCBhc24xLkJlci5CaXRTdHJpbmcpO1xyXG5cdFx0ZGVyLmVuZFNlcXVlbmNlKCk7XHJcblxyXG5cdFx0ZGVyLndyaXRlQnVmZmVyKGN1cnZlLkcsIGFzbjEuQmVyLk9jdGV0U3RyaW5nKTtcclxuXHRcdGRlci53cml0ZUJ1ZmZlcihjdXJ2ZS5uLCBhc24xLkJlci5JbnRlZ2VyKTtcclxuXHRcdHZhciBoID0gY3VydmUuaDtcclxuXHRcdGlmICghaCkge1xyXG5cdFx0XHRoID0gQnVmZmVyLmZyb20oWzFdKTtcclxuXHRcdH1cclxuXHRcdGRlci53cml0ZUJ1ZmZlcihoLCBhc24xLkJlci5JbnRlZ2VyKTtcclxuXHJcblx0XHQvLyBFQ1BhcmFtZXRlcnNcclxuXHRcdGRlci5lbmRTZXF1ZW5jZSgpO1xyXG5cdH1cclxufVxyXG5cclxuZnVuY3Rpb24gd3JpdGVQa2NzOEVDRFNBUHVibGljKGtleSwgZGVyKSB7XHJcblx0d3JpdGVFQ0RTQUN1cnZlKGtleSwgZGVyKTtcclxuXHRkZXIuZW5kU2VxdWVuY2UoKTtcclxuXHJcblx0dmFyIFEgPSB1dGlscy5lY05vcm1hbGl6ZShrZXkucGFydC5RLmRhdGEsIHRydWUpO1xyXG5cdGRlci53cml0ZUJ1ZmZlcihRLCBhc24xLkJlci5CaXRTdHJpbmcpO1xyXG59XHJcblxyXG5mdW5jdGlvbiB3cml0ZVBrY3M4RUNEU0FQcml2YXRlKGtleSwgZGVyKSB7XHJcblx0d3JpdGVFQ0RTQUN1cnZlKGtleSwgZGVyKTtcclxuXHRkZXIuZW5kU2VxdWVuY2UoKTtcclxuXHJcblx0ZGVyLnN0YXJ0U2VxdWVuY2UoYXNuMS5CZXIuT2N0ZXRTdHJpbmcpO1xyXG5cdGRlci5zdGFydFNlcXVlbmNlKCk7XHJcblxyXG5cdHZhciB2ZXJzaW9uID0gQnVmZmVyLmZyb20oWzFdKTtcclxuXHRkZXIud3JpdGVCdWZmZXIodmVyc2lvbiwgYXNuMS5CZXIuSW50ZWdlcik7XHJcblxyXG5cdGRlci53cml0ZUJ1ZmZlcihrZXkucGFydC5kLmRhdGEsIGFzbjEuQmVyLk9jdGV0U3RyaW5nKTtcclxuXHJcblx0ZGVyLnN0YXJ0U2VxdWVuY2UoMHhhMSk7XHJcblx0dmFyIFEgPSB1dGlscy5lY05vcm1hbGl6ZShrZXkucGFydC5RLmRhdGEsIHRydWUpO1xyXG5cdGRlci53cml0ZUJ1ZmZlcihRLCBhc24xLkJlci5CaXRTdHJpbmcpO1xyXG5cdGRlci5lbmRTZXF1ZW5jZSgpO1xyXG5cclxuXHRkZXIuZW5kU2VxdWVuY2UoKTtcclxuXHRkZXIuZW5kU2VxdWVuY2UoKTtcclxufVxyXG5cclxuZnVuY3Rpb24gd3JpdGVQa2NzOEVkRFNBUHVibGljKGtleSwgZGVyKSB7XHJcblx0ZGVyLmVuZFNlcXVlbmNlKCk7XHJcblxyXG5cdHV0aWxzLndyaXRlQml0U3RyaW5nKGRlciwga2V5LnBhcnQuQS5kYXRhKTtcclxufVxyXG5cclxuZnVuY3Rpb24gd3JpdGVQa2NzOEVkRFNBUHJpdmF0ZShrZXksIGRlcikge1xyXG5cdGRlci5lbmRTZXF1ZW5jZSgpO1xyXG5cclxuXHR2YXIgayA9IHV0aWxzLm1wTm9ybWFsaXplKGtleS5wYXJ0LmsuZGF0YSwgdHJ1ZSk7XHJcblx0ZGVyLnN0YXJ0U2VxdWVuY2UoYXNuMS5CZXIuT2N0ZXRTdHJpbmcpO1xyXG5cdGRlci53cml0ZUJ1ZmZlcihrLCBhc24xLkJlci5PY3RldFN0cmluZyk7XHJcblx0ZGVyLmVuZFNlcXVlbmNlKCk7XHJcbn1cclxuIiwiLy8gQ29weXJpZ2h0IDIwMTUgSm95ZW50LCBJbmMuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNpZ25hdHVyZTtcclxuXHJcbnZhciBhc3NlcnQgPSByZXF1aXJlKCdhc3NlcnQtcGx1cycpO1xyXG52YXIgQnVmZmVyID0gcmVxdWlyZSgnc2FmZXItYnVmZmVyJykuQnVmZmVyO1xyXG52YXIgYWxncyA9IHJlcXVpcmUoJy4vYWxncycpO1xyXG52YXIgY3J5cHRvID0gcmVxdWlyZSgnY3J5cHRvJyk7XHJcbnZhciBlcnJzID0gcmVxdWlyZSgnLi9lcnJvcnMnKTtcclxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xyXG52YXIgYXNuMSA9IHJlcXVpcmUoJ2FzbjEnKTtcclxudmFyIFNTSEJ1ZmZlciA9IHJlcXVpcmUoJy4vc3NoLWJ1ZmZlcicpO1xyXG5cclxudmFyIEludmFsaWRBbGdvcml0aG1FcnJvciA9IGVycnMuSW52YWxpZEFsZ29yaXRobUVycm9yO1xyXG52YXIgU2lnbmF0dXJlUGFyc2VFcnJvciA9IGVycnMuU2lnbmF0dXJlUGFyc2VFcnJvcjtcclxuXHJcbmZ1bmN0aW9uIFNpZ25hdHVyZShvcHRzKSB7XHJcblx0YXNzZXJ0Lm9iamVjdChvcHRzLCAnb3B0aW9ucycpO1xyXG5cdGFzc2VydC5hcnJheU9mT2JqZWN0KG9wdHMucGFydHMsICdvcHRpb25zLnBhcnRzJyk7XHJcblx0YXNzZXJ0LnN0cmluZyhvcHRzLnR5cGUsICdvcHRpb25zLnR5cGUnKTtcclxuXHJcblx0dmFyIHBhcnRMb29rdXAgPSB7fTtcclxuXHRmb3IgKHZhciBpID0gMDsgaSA8IG9wdHMucGFydHMubGVuZ3RoOyArK2kpIHtcclxuXHRcdHZhciBwYXJ0ID0gb3B0cy5wYXJ0c1tpXTtcclxuXHRcdHBhcnRMb29rdXBbcGFydC5uYW1lXSA9IHBhcnQ7XHJcblx0fVxyXG5cclxuXHR0aGlzLnR5cGUgPSBvcHRzLnR5cGU7XHJcblx0dGhpcy5oYXNoQWxnb3JpdGhtID0gb3B0cy5oYXNoQWxnbztcclxuXHR0aGlzLmN1cnZlID0gb3B0cy5jdXJ2ZTtcclxuXHR0aGlzLnBhcnRzID0gb3B0cy5wYXJ0cztcclxuXHR0aGlzLnBhcnQgPSBwYXJ0TG9va3VwO1xyXG59XHJcblxyXG5TaWduYXR1cmUucHJvdG90eXBlLnRvQnVmZmVyID0gZnVuY3Rpb24gKGZvcm1hdCkge1xyXG5cdGlmIChmb3JtYXQgPT09IHVuZGVmaW5lZClcclxuXHRcdGZvcm1hdCA9ICdhc24xJztcclxuXHRhc3NlcnQuc3RyaW5nKGZvcm1hdCwgJ2Zvcm1hdCcpO1xyXG5cclxuXHR2YXIgYnVmO1xyXG5cdHZhciBzdHlwZSA9ICdzc2gtJyArIHRoaXMudHlwZTtcclxuXHJcblx0c3dpdGNoICh0aGlzLnR5cGUpIHtcclxuXHRjYXNlICdyc2EnOlxyXG5cdFx0c3dpdGNoICh0aGlzLmhhc2hBbGdvcml0aG0pIHtcclxuXHRcdGNhc2UgJ3NoYTI1Nic6XHJcblx0XHRcdHN0eXBlID0gJ3JzYS1zaGEyLTI1Nic7XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0Y2FzZSAnc2hhNTEyJzpcclxuXHRcdFx0c3R5cGUgPSAncnNhLXNoYTItNTEyJztcclxuXHRcdFx0YnJlYWs7XHJcblx0XHRjYXNlICdzaGExJzpcclxuXHRcdGNhc2UgdW5kZWZpbmVkOlxyXG5cdFx0XHRicmVhaztcclxuXHRcdGRlZmF1bHQ6XHJcblx0XHRcdHRocm93IChuZXcgRXJyb3IoJ1NTSCBzaWduYXR1cmUgJyArXHJcblx0XHRcdCAgICAnZm9ybWF0IGRvZXMgbm90IHN1cHBvcnQgaGFzaCAnICtcclxuXHRcdFx0ICAgICdhbGdvcml0aG0gJyArIHRoaXMuaGFzaEFsZ29yaXRobSkpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKGZvcm1hdCA9PT0gJ3NzaCcpIHtcclxuXHRcdFx0YnVmID0gbmV3IFNTSEJ1ZmZlcih7fSk7XHJcblx0XHRcdGJ1Zi53cml0ZVN0cmluZyhzdHlwZSk7XHJcblx0XHRcdGJ1Zi53cml0ZVBhcnQodGhpcy5wYXJ0LnNpZyk7XHJcblx0XHRcdHJldHVybiAoYnVmLnRvQnVmZmVyKCkpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmV0dXJuICh0aGlzLnBhcnQuc2lnLmRhdGEpO1xyXG5cdFx0fVxyXG5cdFx0YnJlYWs7XHJcblxyXG5cdGNhc2UgJ2VkMjU1MTknOlxyXG5cdFx0aWYgKGZvcm1hdCA9PT0gJ3NzaCcpIHtcclxuXHRcdFx0YnVmID0gbmV3IFNTSEJ1ZmZlcih7fSk7XHJcblx0XHRcdGJ1Zi53cml0ZVN0cmluZyhzdHlwZSk7XHJcblx0XHRcdGJ1Zi53cml0ZVBhcnQodGhpcy5wYXJ0LnNpZyk7XHJcblx0XHRcdHJldHVybiAoYnVmLnRvQnVmZmVyKCkpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmV0dXJuICh0aGlzLnBhcnQuc2lnLmRhdGEpO1xyXG5cdFx0fVxyXG5cdFx0YnJlYWs7XHJcblxyXG5cdGNhc2UgJ2RzYSc6XHJcblx0Y2FzZSAnZWNkc2EnOlxyXG5cdFx0dmFyIHIsIHM7XHJcblx0XHRpZiAoZm9ybWF0ID09PSAnYXNuMScpIHtcclxuXHRcdFx0dmFyIGRlciA9IG5ldyBhc24xLkJlcldyaXRlcigpO1xyXG5cdFx0XHRkZXIuc3RhcnRTZXF1ZW5jZSgpO1xyXG5cdFx0XHRyID0gdXRpbHMubXBOb3JtYWxpemUodGhpcy5wYXJ0LnIuZGF0YSk7XHJcblx0XHRcdHMgPSB1dGlscy5tcE5vcm1hbGl6ZSh0aGlzLnBhcnQucy5kYXRhKTtcclxuXHRcdFx0ZGVyLndyaXRlQnVmZmVyKHIsIGFzbjEuQmVyLkludGVnZXIpO1xyXG5cdFx0XHRkZXIud3JpdGVCdWZmZXIocywgYXNuMS5CZXIuSW50ZWdlcik7XHJcblx0XHRcdGRlci5lbmRTZXF1ZW5jZSgpO1xyXG5cdFx0XHRyZXR1cm4gKGRlci5idWZmZXIpO1xyXG5cdFx0fSBlbHNlIGlmIChmb3JtYXQgPT09ICdzc2gnICYmIHRoaXMudHlwZSA9PT0gJ2RzYScpIHtcclxuXHRcdFx0YnVmID0gbmV3IFNTSEJ1ZmZlcih7fSk7XHJcblx0XHRcdGJ1Zi53cml0ZVN0cmluZygnc3NoLWRzcycpO1xyXG5cdFx0XHRyID0gdGhpcy5wYXJ0LnIuZGF0YTtcclxuXHRcdFx0aWYgKHIubGVuZ3RoID4gMjAgJiYgclswXSA9PT0gMHgwMClcclxuXHRcdFx0XHRyID0gci5zbGljZSgxKTtcclxuXHRcdFx0cyA9IHRoaXMucGFydC5zLmRhdGE7XHJcblx0XHRcdGlmIChzLmxlbmd0aCA+IDIwICYmIHNbMF0gPT09IDB4MDApXHJcblx0XHRcdFx0cyA9IHMuc2xpY2UoMSk7XHJcblx0XHRcdGlmICgodGhpcy5oYXNoQWxnb3JpdGhtICYmXHJcblx0XHRcdCAgICB0aGlzLmhhc2hBbGdvcml0aG0gIT09ICdzaGExJykgfHxcclxuXHRcdFx0ICAgIHIubGVuZ3RoICsgcy5sZW5ndGggIT09IDQwKSB7XHJcblx0XHRcdFx0dGhyb3cgKG5ldyBFcnJvcignT3BlblNTSCBvbmx5IHN1cHBvcnRzICcgK1xyXG5cdFx0XHRcdCAgICAnRFNBIHNpZ25hdHVyZXMgd2l0aCBTSEExIGhhc2gnKSk7XHJcblx0XHRcdH1cclxuXHRcdFx0YnVmLndyaXRlQnVmZmVyKEJ1ZmZlci5jb25jYXQoW3IsIHNdKSk7XHJcblx0XHRcdHJldHVybiAoYnVmLnRvQnVmZmVyKCkpO1xyXG5cdFx0fSBlbHNlIGlmIChmb3JtYXQgPT09ICdzc2gnICYmIHRoaXMudHlwZSA9PT0gJ2VjZHNhJykge1xyXG5cdFx0XHR2YXIgaW5uZXIgPSBuZXcgU1NIQnVmZmVyKHt9KTtcclxuXHRcdFx0ciA9IHRoaXMucGFydC5yLmRhdGE7XHJcblx0XHRcdGlubmVyLndyaXRlQnVmZmVyKHIpO1xyXG5cdFx0XHRpbm5lci53cml0ZVBhcnQodGhpcy5wYXJ0LnMpO1xyXG5cclxuXHRcdFx0YnVmID0gbmV3IFNTSEJ1ZmZlcih7fSk7XHJcblx0XHRcdC8qIFhYWDogZmluZCBhIG1vcmUgcHJvcGVyIHdheSB0byBkbyB0aGlzPyAqL1xyXG5cdFx0XHR2YXIgY3VydmU7XHJcblx0XHRcdGlmIChyWzBdID09PSAweDAwKVxyXG5cdFx0XHRcdHIgPSByLnNsaWNlKDEpO1xyXG5cdFx0XHR2YXIgc3ogPSByLmxlbmd0aCAqIDg7XHJcblx0XHRcdGlmIChzeiA9PT0gMjU2KVxyXG5cdFx0XHRcdGN1cnZlID0gJ25pc3RwMjU2JztcclxuXHRcdFx0ZWxzZSBpZiAoc3ogPT09IDM4NClcclxuXHRcdFx0XHRjdXJ2ZSA9ICduaXN0cDM4NCc7XHJcblx0XHRcdGVsc2UgaWYgKHN6ID09PSA1MjgpXHJcblx0XHRcdFx0Y3VydmUgPSAnbmlzdHA1MjEnO1xyXG5cdFx0XHRidWYud3JpdGVTdHJpbmcoJ2VjZHNhLXNoYTItJyArIGN1cnZlKTtcclxuXHRcdFx0YnVmLndyaXRlQnVmZmVyKGlubmVyLnRvQnVmZmVyKCkpO1xyXG5cdFx0XHRyZXR1cm4gKGJ1Zi50b0J1ZmZlcigpKTtcclxuXHRcdH1cclxuXHRcdHRocm93IChuZXcgRXJyb3IoJ0ludmFsaWQgc2lnbmF0dXJlIGZvcm1hdCcpKTtcclxuXHRkZWZhdWx0OlxyXG5cdFx0dGhyb3cgKG5ldyBFcnJvcignSW52YWxpZCBzaWduYXR1cmUgZGF0YScpKTtcclxuXHR9XHJcbn07XHJcblxyXG5TaWduYXR1cmUucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gKGZvcm1hdCkge1xyXG5cdGFzc2VydC5vcHRpb25hbFN0cmluZyhmb3JtYXQsICdmb3JtYXQnKTtcclxuXHRyZXR1cm4gKHRoaXMudG9CdWZmZXIoZm9ybWF0KS50b1N0cmluZygnYmFzZTY0JykpO1xyXG59O1xyXG5cclxuU2lnbmF0dXJlLnBhcnNlID0gZnVuY3Rpb24gKGRhdGEsIHR5cGUsIGZvcm1hdCkge1xyXG5cdGlmICh0eXBlb2YgKGRhdGEpID09PSAnc3RyaW5nJylcclxuXHRcdGRhdGEgPSBCdWZmZXIuZnJvbShkYXRhLCAnYmFzZTY0Jyk7XHJcblx0YXNzZXJ0LmJ1ZmZlcihkYXRhLCAnZGF0YScpO1xyXG5cdGFzc2VydC5zdHJpbmcoZm9ybWF0LCAnZm9ybWF0Jyk7XHJcblx0YXNzZXJ0LnN0cmluZyh0eXBlLCAndHlwZScpO1xyXG5cclxuXHR2YXIgb3B0cyA9IHt9O1xyXG5cdG9wdHMudHlwZSA9IHR5cGUudG9Mb3dlckNhc2UoKTtcclxuXHRvcHRzLnBhcnRzID0gW107XHJcblxyXG5cdHRyeSB7XHJcblx0XHRhc3NlcnQub2soZGF0YS5sZW5ndGggPiAwLCAnc2lnbmF0dXJlIG11c3Qgbm90IGJlIGVtcHR5Jyk7XHJcblx0XHRzd2l0Y2ggKG9wdHMudHlwZSkge1xyXG5cdFx0Y2FzZSAncnNhJzpcclxuXHRcdFx0cmV0dXJuIChwYXJzZU9uZU51bShkYXRhLCB0eXBlLCBmb3JtYXQsIG9wdHMpKTtcclxuXHRcdGNhc2UgJ2VkMjU1MTknOlxyXG5cdFx0XHRyZXR1cm4gKHBhcnNlT25lTnVtKGRhdGEsIHR5cGUsIGZvcm1hdCwgb3B0cykpO1xyXG5cclxuXHRcdGNhc2UgJ2RzYSc6XHJcblx0XHRjYXNlICdlY2RzYSc6XHJcblx0XHRcdGlmIChmb3JtYXQgPT09ICdhc24xJylcclxuXHRcdFx0XHRyZXR1cm4gKHBhcnNlRFNBYXNuMShkYXRhLCB0eXBlLCBmb3JtYXQsIG9wdHMpKTtcclxuXHRcdFx0ZWxzZSBpZiAob3B0cy50eXBlID09PSAnZHNhJylcclxuXHRcdFx0XHRyZXR1cm4gKHBhcnNlRFNBKGRhdGEsIHR5cGUsIGZvcm1hdCwgb3B0cykpO1xyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0cmV0dXJuIChwYXJzZUVDRFNBKGRhdGEsIHR5cGUsIGZvcm1hdCwgb3B0cykpO1xyXG5cclxuXHRcdGRlZmF1bHQ6XHJcblx0XHRcdHRocm93IChuZXcgSW52YWxpZEFsZ29yaXRobUVycm9yKHR5cGUpKTtcclxuXHRcdH1cclxuXHJcblx0fSBjYXRjaCAoZSkge1xyXG5cdFx0aWYgKGUgaW5zdGFuY2VvZiBJbnZhbGlkQWxnb3JpdGhtRXJyb3IpXHJcblx0XHRcdHRocm93IChlKTtcclxuXHRcdHRocm93IChuZXcgU2lnbmF0dXJlUGFyc2VFcnJvcih0eXBlLCBmb3JtYXQsIGUpKTtcclxuXHR9XHJcbn07XHJcblxyXG5mdW5jdGlvbiBwYXJzZU9uZU51bShkYXRhLCB0eXBlLCBmb3JtYXQsIG9wdHMpIHtcclxuXHRpZiAoZm9ybWF0ID09PSAnc3NoJykge1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0dmFyIGJ1ZiA9IG5ldyBTU0hCdWZmZXIoe2J1ZmZlcjogZGF0YX0pO1xyXG5cdFx0XHR2YXIgaGVhZCA9IGJ1Zi5yZWFkU3RyaW5nKCk7XHJcblx0XHR9IGNhdGNoIChlKSB7XHJcblx0XHRcdC8qIGZhbGwgdGhyb3VnaCAqL1xyXG5cdFx0fVxyXG5cdFx0aWYgKGJ1ZiAhPT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdHZhciBtc2cgPSAnU1NIIHNpZ25hdHVyZSBkb2VzIG5vdCBtYXRjaCBleHBlY3RlZCAnICtcclxuXHRcdFx0ICAgICd0eXBlIChleHBlY3RlZCAnICsgdHlwZSArICcsIGdvdCAnICsgaGVhZCArICcpJztcclxuXHRcdFx0c3dpdGNoIChoZWFkKSB7XHJcblx0XHRcdGNhc2UgJ3NzaC1yc2EnOlxyXG5cdFx0XHRcdGFzc2VydC5zdHJpY3RFcXVhbCh0eXBlLCAncnNhJywgbXNnKTtcclxuXHRcdFx0XHRvcHRzLmhhc2hBbGdvID0gJ3NoYTEnO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlICdyc2Etc2hhMi0yNTYnOlxyXG5cdFx0XHRcdGFzc2VydC5zdHJpY3RFcXVhbCh0eXBlLCAncnNhJywgbXNnKTtcclxuXHRcdFx0XHRvcHRzLmhhc2hBbGdvID0gJ3NoYTI1Nic7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgJ3JzYS1zaGEyLTUxMic6XHJcblx0XHRcdFx0YXNzZXJ0LnN0cmljdEVxdWFsKHR5cGUsICdyc2EnLCBtc2cpO1xyXG5cdFx0XHRcdG9wdHMuaGFzaEFsZ28gPSAnc2hhNTEyJztcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAnc3NoLWVkMjU1MTknOlxyXG5cdFx0XHRcdGFzc2VydC5zdHJpY3RFcXVhbCh0eXBlLCAnZWQyNTUxOScsIG1zZyk7XHJcblx0XHRcdFx0b3B0cy5oYXNoQWxnbyA9ICdzaGE1MTInO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRkZWZhdWx0OlxyXG5cdFx0XHRcdHRocm93IChuZXcgRXJyb3IoJ1Vua25vd24gU1NIIHNpZ25hdHVyZSAnICtcclxuXHRcdFx0XHQgICAgJ3R5cGU6ICcgKyBoZWFkKSk7XHJcblx0XHRcdH1cclxuXHRcdFx0dmFyIHNpZyA9IGJ1Zi5yZWFkUGFydCgpO1xyXG5cdFx0XHRhc3NlcnQub2soYnVmLmF0RW5kKCksICdleHRyYSB0cmFpbGluZyBieXRlcycpO1xyXG5cdFx0XHRzaWcubmFtZSA9ICdzaWcnO1xyXG5cdFx0XHRvcHRzLnBhcnRzLnB1c2goc2lnKTtcclxuXHRcdFx0cmV0dXJuIChuZXcgU2lnbmF0dXJlKG9wdHMpKTtcclxuXHRcdH1cclxuXHR9XHJcblx0b3B0cy5wYXJ0cy5wdXNoKHtuYW1lOiAnc2lnJywgZGF0YTogZGF0YX0pO1xyXG5cdHJldHVybiAobmV3IFNpZ25hdHVyZShvcHRzKSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHBhcnNlRFNBYXNuMShkYXRhLCB0eXBlLCBmb3JtYXQsIG9wdHMpIHtcclxuXHR2YXIgZGVyID0gbmV3IGFzbjEuQmVyUmVhZGVyKGRhdGEpO1xyXG5cdGRlci5yZWFkU2VxdWVuY2UoKTtcclxuXHR2YXIgciA9IGRlci5yZWFkU3RyaW5nKGFzbjEuQmVyLkludGVnZXIsIHRydWUpO1xyXG5cdHZhciBzID0gZGVyLnJlYWRTdHJpbmcoYXNuMS5CZXIuSW50ZWdlciwgdHJ1ZSk7XHJcblxyXG5cdG9wdHMucGFydHMucHVzaCh7bmFtZTogJ3InLCBkYXRhOiB1dGlscy5tcE5vcm1hbGl6ZShyKX0pO1xyXG5cdG9wdHMucGFydHMucHVzaCh7bmFtZTogJ3MnLCBkYXRhOiB1dGlscy5tcE5vcm1hbGl6ZShzKX0pO1xyXG5cclxuXHRyZXR1cm4gKG5ldyBTaWduYXR1cmUob3B0cykpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBwYXJzZURTQShkYXRhLCB0eXBlLCBmb3JtYXQsIG9wdHMpIHtcclxuXHRpZiAoZGF0YS5sZW5ndGggIT0gNDApIHtcclxuXHRcdHZhciBidWYgPSBuZXcgU1NIQnVmZmVyKHtidWZmZXI6IGRhdGF9KTtcclxuXHRcdHZhciBkID0gYnVmLnJlYWRCdWZmZXIoKTtcclxuXHRcdGlmIChkLnRvU3RyaW5nKCdhc2NpaScpID09PSAnc3NoLWRzcycpXHJcblx0XHRcdGQgPSBidWYucmVhZEJ1ZmZlcigpO1xyXG5cdFx0YXNzZXJ0Lm9rKGJ1Zi5hdEVuZCgpLCAnZXh0cmEgdHJhaWxpbmcgYnl0ZXMnKTtcclxuXHRcdGFzc2VydC5zdHJpY3RFcXVhbChkLmxlbmd0aCwgNDAsICdpbnZhbGlkIGlubmVyIGxlbmd0aCcpO1xyXG5cdFx0ZGF0YSA9IGQ7XHJcblx0fVxyXG5cdG9wdHMucGFydHMucHVzaCh7bmFtZTogJ3InLCBkYXRhOiBkYXRhLnNsaWNlKDAsIDIwKX0pO1xyXG5cdG9wdHMucGFydHMucHVzaCh7bmFtZTogJ3MnLCBkYXRhOiBkYXRhLnNsaWNlKDIwLCA0MCl9KTtcclxuXHRyZXR1cm4gKG5ldyBTaWduYXR1cmUob3B0cykpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBwYXJzZUVDRFNBKGRhdGEsIHR5cGUsIGZvcm1hdCwgb3B0cykge1xyXG5cdHZhciBidWYgPSBuZXcgU1NIQnVmZmVyKHtidWZmZXI6IGRhdGF9KTtcclxuXHJcblx0dmFyIHIsIHM7XHJcblx0dmFyIGlubmVyID0gYnVmLnJlYWRCdWZmZXIoKTtcclxuXHR2YXIgc3R5cGUgPSBpbm5lci50b1N0cmluZygnYXNjaWknKTtcclxuXHRpZiAoc3R5cGUuc2xpY2UoMCwgNikgPT09ICdlY2RzYS0nKSB7XHJcblx0XHR2YXIgcGFydHMgPSBzdHlwZS5zcGxpdCgnLScpO1xyXG5cdFx0YXNzZXJ0LnN0cmljdEVxdWFsKHBhcnRzWzBdLCAnZWNkc2EnKTtcclxuXHRcdGFzc2VydC5zdHJpY3RFcXVhbChwYXJ0c1sxXSwgJ3NoYTInKTtcclxuXHRcdG9wdHMuY3VydmUgPSBwYXJ0c1syXTtcclxuXHRcdHN3aXRjaCAob3B0cy5jdXJ2ZSkge1xyXG5cdFx0Y2FzZSAnbmlzdHAyNTYnOlxyXG5cdFx0XHRvcHRzLmhhc2hBbGdvID0gJ3NoYTI1Nic7XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0Y2FzZSAnbmlzdHAzODQnOlxyXG5cdFx0XHRvcHRzLmhhc2hBbGdvID0gJ3NoYTM4NCc7XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0Y2FzZSAnbmlzdHA1MjEnOlxyXG5cdFx0XHRvcHRzLmhhc2hBbGdvID0gJ3NoYTUxMic7XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0ZGVmYXVsdDpcclxuXHRcdFx0dGhyb3cgKG5ldyBFcnJvcignVW5zdXBwb3J0ZWQgRUNEU0EgY3VydmU6ICcgK1xyXG5cdFx0XHQgICAgb3B0cy5jdXJ2ZSkpO1xyXG5cdFx0fVxyXG5cdFx0aW5uZXIgPSBidWYucmVhZEJ1ZmZlcigpO1xyXG5cdFx0YXNzZXJ0Lm9rKGJ1Zi5hdEVuZCgpLCAnZXh0cmEgdHJhaWxpbmcgYnl0ZXMgb24gb3V0ZXInKTtcclxuXHRcdGJ1ZiA9IG5ldyBTU0hCdWZmZXIoe2J1ZmZlcjogaW5uZXJ9KTtcclxuXHRcdHIgPSBidWYucmVhZFBhcnQoKTtcclxuXHR9IGVsc2Uge1xyXG5cdFx0ciA9IHtkYXRhOiBpbm5lcn07XHJcblx0fVxyXG5cclxuXHRzID0gYnVmLnJlYWRQYXJ0KCk7XHJcblx0YXNzZXJ0Lm9rKGJ1Zi5hdEVuZCgpLCAnZXh0cmEgdHJhaWxpbmcgYnl0ZXMnKTtcclxuXHJcblx0ci5uYW1lID0gJ3InO1xyXG5cdHMubmFtZSA9ICdzJztcclxuXHJcblx0b3B0cy5wYXJ0cy5wdXNoKHIpO1xyXG5cdG9wdHMucGFydHMucHVzaChzKTtcclxuXHRyZXR1cm4gKG5ldyBTaWduYXR1cmUob3B0cykpO1xyXG59XHJcblxyXG5TaWduYXR1cmUuaXNTaWduYXR1cmUgPSBmdW5jdGlvbiAob2JqLCB2ZXIpIHtcclxuXHRyZXR1cm4gKHV0aWxzLmlzQ29tcGF0aWJsZShvYmosIFNpZ25hdHVyZSwgdmVyKSk7XHJcbn07XHJcblxyXG4vKlxyXG4gKiBBUEkgdmVyc2lvbnMgZm9yIFNpZ25hdHVyZTpcclxuICogWzEsMF0gLS0gaW5pdGlhbCB2ZXJcclxuICogWzIsMF0gLS0gc3VwcG9ydCBmb3IgcnNhIGluIGZ1bGwgc3NoIGZvcm1hdCwgY29tcGF0IHdpdGggc3NocGstYWdlbnRcclxuICogICAgICAgICAgaGFzaEFsZ29yaXRobSBwcm9wZXJ0eVxyXG4gKiBbMiwxXSAtLSBmaXJzdCB0YWdnZWQgdmVyc2lvblxyXG4gKi9cclxuU2lnbmF0dXJlLnByb3RvdHlwZS5fc3NocGtBcGlWZXJzaW9uID0gWzIsIDFdO1xyXG5cclxuU2lnbmF0dXJlLl9vbGRWZXJzaW9uRGV0ZWN0ID0gZnVuY3Rpb24gKG9iaikge1xyXG5cdGFzc2VydC5mdW5jKG9iai50b0J1ZmZlcik7XHJcblx0aWYgKG9iai5oYXNPd25Qcm9wZXJ0eSgnaGFzaEFsZ29yaXRobScpKVxyXG5cdFx0cmV0dXJuIChbMiwgMF0pO1xyXG5cdHJldHVybiAoWzEsIDBdKTtcclxufTtcclxuIiwiLy8gQ29weXJpZ2h0IDIwMTggSm95ZW50LCBJbmMuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuXHRyZWFkOiByZWFkLFxyXG5cdHdyaXRlOiB3cml0ZVxyXG59O1xyXG5cclxudmFyIGFzc2VydCA9IHJlcXVpcmUoJ2Fzc2VydC1wbHVzJyk7XHJcbnZhciBCdWZmZXIgPSByZXF1aXJlKCdzYWZlci1idWZmZXInKS5CdWZmZXI7XHJcbnZhciByZmM0MjUzID0gcmVxdWlyZSgnLi9yZmM0MjUzJyk7XHJcbnZhciBLZXkgPSByZXF1aXJlKCcuLi9rZXknKTtcclxuXHJcbnZhciBlcnJvcnMgPSByZXF1aXJlKCcuLi9lcnJvcnMnKTtcclxuXHJcbmZ1bmN0aW9uIHJlYWQoYnVmLCBvcHRpb25zKSB7XHJcblx0dmFyIGxpbmVzID0gYnVmLnRvU3RyaW5nKCdhc2NpaScpLnNwbGl0KC9bXFxyXFxuXSsvKTtcclxuXHR2YXIgZm91bmQgPSBmYWxzZTtcclxuXHR2YXIgcGFydHM7XHJcblx0dmFyIHNpID0gMDtcclxuXHR3aGlsZSAoc2kgPCBsaW5lcy5sZW5ndGgpIHtcclxuXHRcdHBhcnRzID0gc3BsaXRIZWFkZXIobGluZXNbc2krK10pO1xyXG5cdFx0aWYgKHBhcnRzICYmXHJcblx0XHQgICAgcGFydHNbMF0udG9Mb3dlckNhc2UoKSA9PT0gJ3B1dHR5LXVzZXIta2V5LWZpbGUtMicpIHtcclxuXHRcdFx0Zm91bmQgPSB0cnVlO1xyXG5cdFx0XHRicmVhaztcclxuXHRcdH1cclxuXHR9XHJcblx0aWYgKCFmb3VuZCkge1xyXG5cdFx0dGhyb3cgKG5ldyBFcnJvcignTm8gUHVUVFkgZm9ybWF0IGZpcnN0IGxpbmUgZm91bmQnKSk7XHJcblx0fVxyXG5cdHZhciBhbGcgPSBwYXJ0c1sxXTtcclxuXHJcblx0cGFydHMgPSBzcGxpdEhlYWRlcihsaW5lc1tzaSsrXSk7XHJcblx0YXNzZXJ0LmVxdWFsKHBhcnRzWzBdLnRvTG93ZXJDYXNlKCksICdlbmNyeXB0aW9uJyk7XHJcblxyXG5cdHBhcnRzID0gc3BsaXRIZWFkZXIobGluZXNbc2krK10pO1xyXG5cdGFzc2VydC5lcXVhbChwYXJ0c1swXS50b0xvd2VyQ2FzZSgpLCAnY29tbWVudCcpO1xyXG5cdHZhciBjb21tZW50ID0gcGFydHNbMV07XHJcblxyXG5cdHBhcnRzID0gc3BsaXRIZWFkZXIobGluZXNbc2krK10pO1xyXG5cdGFzc2VydC5lcXVhbChwYXJ0c1swXS50b0xvd2VyQ2FzZSgpLCAncHVibGljLWxpbmVzJyk7XHJcblx0dmFyIHB1YmxpY0xpbmVzID0gcGFyc2VJbnQocGFydHNbMV0sIDEwKTtcclxuXHRpZiAoIWlzRmluaXRlKHB1YmxpY0xpbmVzKSB8fCBwdWJsaWNMaW5lcyA8IDAgfHxcclxuXHQgICAgcHVibGljTGluZXMgPiBsaW5lcy5sZW5ndGgpIHtcclxuXHRcdHRocm93IChuZXcgRXJyb3IoJ0ludmFsaWQgcHVibGljLWxpbmVzIGNvdW50JykpO1xyXG5cdH1cclxuXHJcblx0dmFyIHB1YmxpY0J1ZiA9IEJ1ZmZlci5mcm9tKFxyXG5cdCAgICBsaW5lcy5zbGljZShzaSwgc2kgKyBwdWJsaWNMaW5lcykuam9pbignJyksICdiYXNlNjQnKTtcclxuXHR2YXIga2V5VHlwZSA9IHJmYzQyNTMuYWxnVG9LZXlUeXBlKGFsZyk7XHJcblx0dmFyIGtleSA9IHJmYzQyNTMucmVhZChwdWJsaWNCdWYpO1xyXG5cdGlmIChrZXkudHlwZSAhPT0ga2V5VHlwZSkge1xyXG5cdFx0dGhyb3cgKG5ldyBFcnJvcignT3V0ZXIga2V5IGFsZ29yaXRobSBtaXNtYXRjaCcpKTtcclxuXHR9XHJcblx0a2V5LmNvbW1lbnQgPSBjb21tZW50O1xyXG5cdHJldHVybiAoa2V5KTtcclxufVxyXG5cclxuZnVuY3Rpb24gc3BsaXRIZWFkZXIobGluZSkge1xyXG5cdHZhciBpZHggPSBsaW5lLmluZGV4T2YoJzonKTtcclxuXHRpZiAoaWR4ID09PSAtMSlcclxuXHRcdHJldHVybiAobnVsbCk7XHJcblx0dmFyIGhlYWRlciA9IGxpbmUuc2xpY2UoMCwgaWR4KTtcclxuXHQrK2lkeDtcclxuXHR3aGlsZSAobGluZVtpZHhdID09PSAnICcpXHJcblx0XHQrK2lkeDtcclxuXHR2YXIgcmVzdCA9IGxpbmUuc2xpY2UoaWR4KTtcclxuXHRyZXR1cm4gKFtoZWFkZXIsIHJlc3RdKTtcclxufVxyXG5cclxuZnVuY3Rpb24gd3JpdGUoa2V5LCBvcHRpb25zKSB7XHJcblx0YXNzZXJ0Lm9iamVjdChrZXkpO1xyXG5cdGlmICghS2V5LmlzS2V5KGtleSkpXHJcblx0XHR0aHJvdyAobmV3IEVycm9yKCdNdXN0IGJlIGEgcHVibGljIGtleScpKTtcclxuXHJcblx0dmFyIGFsZyA9IHJmYzQyNTMua2V5VHlwZVRvQWxnKGtleSk7XHJcblx0dmFyIGJ1ZiA9IHJmYzQyNTMud3JpdGUoa2V5KTtcclxuXHR2YXIgY29tbWVudCA9IGtleS5jb21tZW50IHx8ICcnO1xyXG5cclxuXHR2YXIgYjY0ID0gYnVmLnRvU3RyaW5nKCdiYXNlNjQnKTtcclxuXHR2YXIgbGluZXMgPSB3cmFwKGI2NCwgNjQpO1xyXG5cclxuXHRsaW5lcy51bnNoaWZ0KCdQdWJsaWMtTGluZXM6ICcgKyBsaW5lcy5sZW5ndGgpO1xyXG5cdGxpbmVzLnVuc2hpZnQoJ0NvbW1lbnQ6ICcgKyBjb21tZW50KTtcclxuXHRsaW5lcy51bnNoaWZ0KCdFbmNyeXB0aW9uOiBub25lJyk7XHJcblx0bGluZXMudW5zaGlmdCgnUHVUVFktVXNlci1LZXktRmlsZS0yOiAnICsgYWxnKTtcclxuXHJcblx0cmV0dXJuIChCdWZmZXIuZnJvbShsaW5lcy5qb2luKCdcXG4nKSArICdcXG4nKSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHdyYXAodHh0LCBsZW4pIHtcclxuXHR2YXIgbGluZXMgPSBbXTtcclxuXHR2YXIgcG9zID0gMDtcclxuXHR3aGlsZSAocG9zIDwgdHh0Lmxlbmd0aCkge1xyXG5cdFx0bGluZXMucHVzaCh0eHQuc2xpY2UocG9zLCBwb3MgKyA2NCkpO1xyXG5cdFx0cG9zICs9IDY0O1xyXG5cdH1cclxuXHRyZXR1cm4gKGxpbmVzKTtcclxufVxyXG4iLCIvLyBDb3B5cmlnaHQgMjAxNSBKb3llbnQsIEluYy5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU1NIQnVmZmVyO1xyXG5cclxudmFyIGFzc2VydCA9IHJlcXVpcmUoJ2Fzc2VydC1wbHVzJyk7XHJcbnZhciBCdWZmZXIgPSByZXF1aXJlKCdzYWZlci1idWZmZXInKS5CdWZmZXI7XHJcblxyXG5mdW5jdGlvbiBTU0hCdWZmZXIob3B0cykge1xyXG5cdGFzc2VydC5vYmplY3Qob3B0cywgJ29wdGlvbnMnKTtcclxuXHRpZiAob3B0cy5idWZmZXIgIT09IHVuZGVmaW5lZClcclxuXHRcdGFzc2VydC5idWZmZXIob3B0cy5idWZmZXIsICdvcHRpb25zLmJ1ZmZlcicpO1xyXG5cclxuXHR0aGlzLl9zaXplID0gb3B0cy5idWZmZXIgPyBvcHRzLmJ1ZmZlci5sZW5ndGggOiAxMDI0O1xyXG5cdHRoaXMuX2J1ZmZlciA9IG9wdHMuYnVmZmVyIHx8IEJ1ZmZlci5hbGxvYyh0aGlzLl9zaXplKTtcclxuXHR0aGlzLl9vZmZzZXQgPSAwO1xyXG59XHJcblxyXG5TU0hCdWZmZXIucHJvdG90eXBlLnRvQnVmZmVyID0gZnVuY3Rpb24gKCkge1xyXG5cdHJldHVybiAodGhpcy5fYnVmZmVyLnNsaWNlKDAsIHRoaXMuX29mZnNldCkpO1xyXG59O1xyXG5cclxuU1NIQnVmZmVyLnByb3RvdHlwZS5hdEVuZCA9IGZ1bmN0aW9uICgpIHtcclxuXHRyZXR1cm4gKHRoaXMuX29mZnNldCA+PSB0aGlzLl9idWZmZXIubGVuZ3RoKTtcclxufTtcclxuXHJcblNTSEJ1ZmZlci5wcm90b3R5cGUucmVtYWluZGVyID0gZnVuY3Rpb24gKCkge1xyXG5cdHJldHVybiAodGhpcy5fYnVmZmVyLnNsaWNlKHRoaXMuX29mZnNldCkpO1xyXG59O1xyXG5cclxuU1NIQnVmZmVyLnByb3RvdHlwZS5za2lwID0gZnVuY3Rpb24gKG4pIHtcclxuXHR0aGlzLl9vZmZzZXQgKz0gbjtcclxufTtcclxuXHJcblNTSEJ1ZmZlci5wcm90b3R5cGUuZXhwYW5kID0gZnVuY3Rpb24gKCkge1xyXG5cdHRoaXMuX3NpemUgKj0gMjtcclxuXHR2YXIgYnVmID0gQnVmZmVyLmFsbG9jKHRoaXMuX3NpemUpO1xyXG5cdHRoaXMuX2J1ZmZlci5jb3B5KGJ1ZiwgMCk7XHJcblx0dGhpcy5fYnVmZmVyID0gYnVmO1xyXG59O1xyXG5cclxuU1NIQnVmZmVyLnByb3RvdHlwZS5yZWFkUGFydCA9IGZ1bmN0aW9uICgpIHtcclxuXHRyZXR1cm4gKHtkYXRhOiB0aGlzLnJlYWRCdWZmZXIoKX0pO1xyXG59O1xyXG5cclxuU1NIQnVmZmVyLnByb3RvdHlwZS5yZWFkQnVmZmVyID0gZnVuY3Rpb24gKCkge1xyXG5cdHZhciBsZW4gPSB0aGlzLl9idWZmZXIucmVhZFVJbnQzMkJFKHRoaXMuX29mZnNldCk7XHJcblx0dGhpcy5fb2Zmc2V0ICs9IDQ7XHJcblx0YXNzZXJ0Lm9rKHRoaXMuX29mZnNldCArIGxlbiA8PSB0aGlzLl9idWZmZXIubGVuZ3RoLFxyXG5cdCAgICAnbGVuZ3RoIG91dCBvZiBib3VuZHMgYXQgKzB4JyArIHRoaXMuX29mZnNldC50b1N0cmluZygxNikgK1xyXG5cdCAgICAnIChkYXRhIHRydW5jYXRlZD8pJyk7XHJcblx0dmFyIGJ1ZiA9IHRoaXMuX2J1ZmZlci5zbGljZSh0aGlzLl9vZmZzZXQsIHRoaXMuX29mZnNldCArIGxlbik7XHJcblx0dGhpcy5fb2Zmc2V0ICs9IGxlbjtcclxuXHRyZXR1cm4gKGJ1Zik7XHJcbn07XHJcblxyXG5TU0hCdWZmZXIucHJvdG90eXBlLnJlYWRTdHJpbmcgPSBmdW5jdGlvbiAoKSB7XHJcblx0cmV0dXJuICh0aGlzLnJlYWRCdWZmZXIoKS50b1N0cmluZygpKTtcclxufTtcclxuXHJcblNTSEJ1ZmZlci5wcm90b3R5cGUucmVhZENTdHJpbmcgPSBmdW5jdGlvbiAoKSB7XHJcblx0dmFyIG9mZnNldCA9IHRoaXMuX29mZnNldDtcclxuXHR3aGlsZSAob2Zmc2V0IDwgdGhpcy5fYnVmZmVyLmxlbmd0aCAmJlxyXG5cdCAgICB0aGlzLl9idWZmZXJbb2Zmc2V0XSAhPT0gMHgwMClcclxuXHRcdG9mZnNldCsrO1xyXG5cdGFzc2VydC5vayhvZmZzZXQgPCB0aGlzLl9idWZmZXIubGVuZ3RoLCAnYyBzdHJpbmcgZG9lcyBub3QgdGVybWluYXRlJyk7XHJcblx0dmFyIHN0ciA9IHRoaXMuX2J1ZmZlci5zbGljZSh0aGlzLl9vZmZzZXQsIG9mZnNldCkudG9TdHJpbmcoKTtcclxuXHR0aGlzLl9vZmZzZXQgPSBvZmZzZXQgKyAxO1xyXG5cdHJldHVybiAoc3RyKTtcclxufTtcclxuXHJcblNTSEJ1ZmZlci5wcm90b3R5cGUucmVhZEludCA9IGZ1bmN0aW9uICgpIHtcclxuXHR2YXIgdiA9IHRoaXMuX2J1ZmZlci5yZWFkVUludDMyQkUodGhpcy5fb2Zmc2V0KTtcclxuXHR0aGlzLl9vZmZzZXQgKz0gNDtcclxuXHRyZXR1cm4gKHYpO1xyXG59O1xyXG5cclxuU1NIQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50NjQgPSBmdW5jdGlvbiAoKSB7XHJcblx0YXNzZXJ0Lm9rKHRoaXMuX29mZnNldCArIDggPCB0aGlzLl9idWZmZXIubGVuZ3RoLFxyXG5cdCAgICAnYnVmZmVyIG5vdCBsb25nIGVub3VnaCB0byByZWFkIEludDY0Jyk7XHJcblx0dmFyIHYgPSB0aGlzLl9idWZmZXIuc2xpY2UodGhpcy5fb2Zmc2V0LCB0aGlzLl9vZmZzZXQgKyA4KTtcclxuXHR0aGlzLl9vZmZzZXQgKz0gODtcclxuXHRyZXR1cm4gKHYpO1xyXG59O1xyXG5cclxuU1NIQnVmZmVyLnByb3RvdHlwZS5yZWFkQ2hhciA9IGZ1bmN0aW9uICgpIHtcclxuXHR2YXIgdiA9IHRoaXMuX2J1ZmZlclt0aGlzLl9vZmZzZXQrK107XHJcblx0cmV0dXJuICh2KTtcclxufTtcclxuXHJcblNTSEJ1ZmZlci5wcm90b3R5cGUud3JpdGVCdWZmZXIgPSBmdW5jdGlvbiAoYnVmKSB7XHJcblx0d2hpbGUgKHRoaXMuX29mZnNldCArIDQgKyBidWYubGVuZ3RoID4gdGhpcy5fc2l6ZSlcclxuXHRcdHRoaXMuZXhwYW5kKCk7XHJcblx0dGhpcy5fYnVmZmVyLndyaXRlVUludDMyQkUoYnVmLmxlbmd0aCwgdGhpcy5fb2Zmc2V0KTtcclxuXHR0aGlzLl9vZmZzZXQgKz0gNDtcclxuXHRidWYuY29weSh0aGlzLl9idWZmZXIsIHRoaXMuX29mZnNldCk7XHJcblx0dGhpcy5fb2Zmc2V0ICs9IGJ1Zi5sZW5ndGg7XHJcbn07XHJcblxyXG5TU0hCdWZmZXIucHJvdG90eXBlLndyaXRlU3RyaW5nID0gZnVuY3Rpb24gKHN0cikge1xyXG5cdHRoaXMud3JpdGVCdWZmZXIoQnVmZmVyLmZyb20oc3RyLCAndXRmOCcpKTtcclxufTtcclxuXHJcblNTSEJ1ZmZlci5wcm90b3R5cGUud3JpdGVDU3RyaW5nID0gZnVuY3Rpb24gKHN0cikge1xyXG5cdHdoaWxlICh0aGlzLl9vZmZzZXQgKyAxICsgc3RyLmxlbmd0aCA+IHRoaXMuX3NpemUpXHJcblx0XHR0aGlzLmV4cGFuZCgpO1xyXG5cdHRoaXMuX2J1ZmZlci53cml0ZShzdHIsIHRoaXMuX29mZnNldCk7XHJcblx0dGhpcy5fb2Zmc2V0ICs9IHN0ci5sZW5ndGg7XHJcblx0dGhpcy5fYnVmZmVyW3RoaXMuX29mZnNldCsrXSA9IDA7XHJcbn07XHJcblxyXG5TU0hCdWZmZXIucHJvdG90eXBlLndyaXRlSW50ID0gZnVuY3Rpb24gKHYpIHtcclxuXHR3aGlsZSAodGhpcy5fb2Zmc2V0ICsgNCA+IHRoaXMuX3NpemUpXHJcblx0XHR0aGlzLmV4cGFuZCgpO1xyXG5cdHRoaXMuX2J1ZmZlci53cml0ZVVJbnQzMkJFKHYsIHRoaXMuX29mZnNldCk7XHJcblx0dGhpcy5fb2Zmc2V0ICs9IDQ7XHJcbn07XHJcblxyXG5TU0hCdWZmZXIucHJvdG90eXBlLndyaXRlSW50NjQgPSBmdW5jdGlvbiAodikge1xyXG5cdGFzc2VydC5idWZmZXIodiwgJ3ZhbHVlJyk7XHJcblx0aWYgKHYubGVuZ3RoID4gOCkge1xyXG5cdFx0dmFyIGxlYWQgPSB2LnNsaWNlKDAsIHYubGVuZ3RoIC0gOCk7XHJcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGxlYWQubGVuZ3RoOyArK2kpIHtcclxuXHRcdFx0YXNzZXJ0LnN0cmljdEVxdWFsKGxlYWRbaV0sIDAsXHJcblx0XHRcdCAgICAnbXVzdCBmaXQgaW4gNjQgYml0cyBvZiBwcmVjaXNpb24nKTtcclxuXHRcdH1cclxuXHRcdHYgPSB2LnNsaWNlKHYubGVuZ3RoIC0gOCwgdi5sZW5ndGgpO1xyXG5cdH1cclxuXHR3aGlsZSAodGhpcy5fb2Zmc2V0ICsgOCA+IHRoaXMuX3NpemUpXHJcblx0XHR0aGlzLmV4cGFuZCgpO1xyXG5cdHYuY29weSh0aGlzLl9idWZmZXIsIHRoaXMuX29mZnNldCk7XHJcblx0dGhpcy5fb2Zmc2V0ICs9IDg7XHJcbn07XHJcblxyXG5TU0hCdWZmZXIucHJvdG90eXBlLndyaXRlQ2hhciA9IGZ1bmN0aW9uICh2KSB7XHJcblx0d2hpbGUgKHRoaXMuX29mZnNldCArIDEgPiB0aGlzLl9zaXplKVxyXG5cdFx0dGhpcy5leHBhbmQoKTtcclxuXHR0aGlzLl9idWZmZXJbdGhpcy5fb2Zmc2V0KytdID0gdjtcclxufTtcclxuXHJcblNTSEJ1ZmZlci5wcm90b3R5cGUud3JpdGVQYXJ0ID0gZnVuY3Rpb24gKHApIHtcclxuXHR0aGlzLndyaXRlQnVmZmVyKHAuZGF0YSk7XHJcbn07XHJcblxyXG5TU0hCdWZmZXIucHJvdG90eXBlLndyaXRlID0gZnVuY3Rpb24gKGJ1Zikge1xyXG5cdHdoaWxlICh0aGlzLl9vZmZzZXQgKyBidWYubGVuZ3RoID4gdGhpcy5fc2l6ZSlcclxuXHRcdHRoaXMuZXhwYW5kKCk7XHJcblx0YnVmLmNvcHkodGhpcy5fYnVmZmVyLCB0aGlzLl9vZmZzZXQpO1xyXG5cdHRoaXMuX29mZnNldCArPSBidWYubGVuZ3RoO1xyXG59O1xyXG4iLCIvLyBDb3B5cmlnaHQgMjAxNSBKb3llbnQsIEluYy5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG5cdHJlYWQ6IHJlYWQsXHJcblx0d3JpdGU6IHdyaXRlXHJcbn07XHJcblxyXG52YXIgYXNzZXJ0ID0gcmVxdWlyZSgnYXNzZXJ0LXBsdXMnKTtcclxudmFyIEJ1ZmZlciA9IHJlcXVpcmUoJ3NhZmVyLWJ1ZmZlcicpLkJ1ZmZlcjtcclxudmFyIHJmYzQyNTMgPSByZXF1aXJlKCcuL3JmYzQyNTMnKTtcclxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbHMnKTtcclxudmFyIEtleSA9IHJlcXVpcmUoJy4uL2tleScpO1xyXG52YXIgUHJpdmF0ZUtleSA9IHJlcXVpcmUoJy4uL3ByaXZhdGUta2V5Jyk7XHJcblxyXG52YXIgc3NocHJpdiA9IHJlcXVpcmUoJy4vc3NoLXByaXZhdGUnKTtcclxuXHJcbi8qSlNTVFlMRUQqL1xyXG52YXIgU1NIS0VZX1JFID0gL14oW2EtejAtOS1dKylbIFxcdF0rKFthLXpBLVowLTkrXFwvXStbPV0qKShbIFxcdF0rKFteIFxcdF1bXlxcbl0qW1xcbl0qKT8pPyQvO1xyXG4vKkpTU1RZTEVEKi9cclxudmFyIFNTSEtFWV9SRTIgPSAvXihbYS16MC05LV0rKVsgXFx0XFxuXSsoW2EtekEtWjAtOStcXC9dW2EtekEtWjAtOStcXC8gXFx0XFxuPV0qKShbXmEtekEtWjAtOStcXC8gXFx0XFxuPV0uKik/JC87XHJcblxyXG5mdW5jdGlvbiByZWFkKGJ1Ziwgb3B0aW9ucykge1xyXG5cdGlmICh0eXBlb2YgKGJ1ZikgIT09ICdzdHJpbmcnKSB7XHJcblx0XHRhc3NlcnQuYnVmZmVyKGJ1ZiwgJ2J1ZicpO1xyXG5cdFx0YnVmID0gYnVmLnRvU3RyaW5nKCdhc2NpaScpO1xyXG5cdH1cclxuXHJcblx0dmFyIHRyaW1tZWQgPSBidWYudHJpbSgpLnJlcGxhY2UoL1tcXFxcXFxyXS9nLCAnJyk7XHJcblx0dmFyIG0gPSB0cmltbWVkLm1hdGNoKFNTSEtFWV9SRSk7XHJcblx0aWYgKCFtKVxyXG5cdFx0bSA9IHRyaW1tZWQubWF0Y2goU1NIS0VZX1JFMik7XHJcblx0YXNzZXJ0Lm9rKG0sICdrZXkgbXVzdCBtYXRjaCByZWdleCcpO1xyXG5cclxuXHR2YXIgdHlwZSA9IHJmYzQyNTMuYWxnVG9LZXlUeXBlKG1bMV0pO1xyXG5cdHZhciBrYnVmID0gQnVmZmVyLmZyb20obVsyXSwgJ2Jhc2U2NCcpO1xyXG5cclxuXHQvKlxyXG5cdCAqIFRoaXMgaXMgYSBiaXQgdHJpY2t5LiBJZiB3ZSBtYW5hZ2VkIHRvIHBhcnNlIHRoZSBrZXkgYW5kIGxvY2F0ZSB0aGVcclxuXHQgKiBrZXkgY29tbWVudCB3aXRoIHRoZSByZWdleCwgdGhlbiBkbyBhIG5vbi1wYXJ0aWFsIHJlYWQgYW5kIGFzc2VydFxyXG5cdCAqIHRoYXQgd2UgaGF2ZSBjb25zdW1lZCBhbGwgYnl0ZXMuIElmIHdlIGNvdWxkbid0IGxvY2F0ZSB0aGUga2V5XHJcblx0ICogY29tbWVudCwgdGhvdWdoLCB0aGVyZSBtYXkgYmUgd2hpdGVzcGFjZSBzaGVuYW5pZ2FucyBnb2luZyBvbiB0aGF0XHJcblx0ICogaGF2ZSBjb25qb2luZWQgdGhlIGNvbW1lbnQgdG8gdGhlIHJlc3Qgb2YgdGhlIGtleS4gV2UgZG8gYSBwYXJ0aWFsXHJcblx0ICogcmVhZCBpbiB0aGlzIGNhc2UgdG8gdHJ5IHRvIG1ha2UgdGhlIGJlc3Qgb3V0IG9mIGEgc29ycnkgc2l0dWF0aW9uLlxyXG5cdCAqL1xyXG5cdHZhciBrZXk7XHJcblx0dmFyIHJldCA9IHt9O1xyXG5cdGlmIChtWzRdKSB7XHJcblx0XHR0cnkge1xyXG5cdFx0XHRrZXkgPSByZmM0MjUzLnJlYWQoa2J1Zik7XHJcblxyXG5cdFx0fSBjYXRjaCAoZSkge1xyXG5cdFx0XHRtID0gdHJpbW1lZC5tYXRjaChTU0hLRVlfUkUyKTtcclxuXHRcdFx0YXNzZXJ0Lm9rKG0sICdrZXkgbXVzdCBtYXRjaCByZWdleCcpO1xyXG5cdFx0XHRrYnVmID0gQnVmZmVyLmZyb20obVsyXSwgJ2Jhc2U2NCcpO1xyXG5cdFx0XHRrZXkgPSByZmM0MjUzLnJlYWRJbnRlcm5hbChyZXQsICdwdWJsaWMnLCBrYnVmKTtcclxuXHRcdH1cclxuXHR9IGVsc2Uge1xyXG5cdFx0a2V5ID0gcmZjNDI1My5yZWFkSW50ZXJuYWwocmV0LCAncHVibGljJywga2J1Zik7XHJcblx0fVxyXG5cclxuXHRhc3NlcnQuc3RyaWN0RXF1YWwodHlwZSwga2V5LnR5cGUpO1xyXG5cclxuXHRpZiAobVs0XSAmJiBtWzRdLmxlbmd0aCA+IDApIHtcclxuXHRcdGtleS5jb21tZW50ID0gbVs0XTtcclxuXHJcblx0fSBlbHNlIGlmIChyZXQuY29uc3VtZWQpIHtcclxuXHRcdC8qXHJcblx0XHQgKiBOb3cgdGhlIG1hZ2ljOiB0cnlpbmcgdG8gcmVjb3ZlciB0aGUga2V5IGNvbW1lbnQgd2hlbiBpdCdzXHJcblx0XHQgKiBnb3R0ZW4gY29uam9pbmVkIHRvIHRoZSBrZXkgb3Igb3RoZXJ3aXNlIHNoZW5hbmlnYW4nZC5cclxuXHRcdCAqXHJcblx0XHQgKiBXb3JrIG91dCBob3cgbXVjaCBiYXNlNjQgd2UgdXNlZCwgdGhlbiBkcm9wIGFsbCBub24tYmFzZTY0XHJcblx0XHQgKiBjaGFycyBmcm9tIHRoZSBiZWdpbm5pbmcgdXAgdG8gdGhpcyBwb2ludCBpbiB0aGUgdGhlIHN0cmluZy5cclxuXHRcdCAqIFRoZW4gb2Zmc2V0IGluIHRoaXMgYW5kIHRyeSB0byBtYWtlIHVwIGZvciBtaXNzaW5nID0gY2hhcnMuXHJcblx0XHQgKi9cclxuXHRcdHZhciBkYXRhID0gbVsyXSArIChtWzNdID8gbVszXSA6ICcnKTtcclxuXHRcdHZhciByZWFsT2Zmc2V0ID0gTWF0aC5jZWlsKHJldC5jb25zdW1lZCAvIDMpICogNDtcclxuXHRcdGRhdGEgPSBkYXRhLnNsaWNlKDAsIHJlYWxPZmZzZXQgLSAyKS4gLypKU1NUWUxFRCovXHJcblx0XHQgICAgcmVwbGFjZSgvW15hLXpBLVowLTkrXFwvPV0vZywgJycpICtcclxuXHRcdCAgICBkYXRhLnNsaWNlKHJlYWxPZmZzZXQgLSAyKTtcclxuXHJcblx0XHR2YXIgcGFkZGluZyA9IHJldC5jb25zdW1lZCAlIDM7XHJcblx0XHRpZiAocGFkZGluZyA+IDAgJiZcclxuXHRcdCAgICBkYXRhLnNsaWNlKHJlYWxPZmZzZXQgLSAxLCByZWFsT2Zmc2V0KSAhPT0gJz0nKVxyXG5cdFx0XHRyZWFsT2Zmc2V0LS07XHJcblx0XHR3aGlsZSAoZGF0YS5zbGljZShyZWFsT2Zmc2V0LCByZWFsT2Zmc2V0ICsgMSkgPT09ICc9JylcclxuXHRcdFx0cmVhbE9mZnNldCsrO1xyXG5cclxuXHRcdC8qIEZpbmFsbHksIGdyYWIgd2hhdCB3ZSB0aGluayBpcyB0aGUgY29tbWVudCAmIGNsZWFuIGl0IHVwLiAqL1xyXG5cdFx0dmFyIHRyYWlsZXIgPSBkYXRhLnNsaWNlKHJlYWxPZmZzZXQpO1xyXG5cdFx0dHJhaWxlciA9IHRyYWlsZXIucmVwbGFjZSgvW1xcclxcbl0vZywgJyAnKS5cclxuXHRcdCAgICByZXBsYWNlKC9eXFxzKy8sICcnKTtcclxuXHRcdGlmICh0cmFpbGVyLm1hdGNoKC9eW2EtekEtWjAtOV0vKSlcclxuXHRcdFx0a2V5LmNvbW1lbnQgPSB0cmFpbGVyO1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIChrZXkpO1xyXG59XHJcblxyXG5mdW5jdGlvbiB3cml0ZShrZXksIG9wdGlvbnMpIHtcclxuXHRhc3NlcnQub2JqZWN0KGtleSk7XHJcblx0aWYgKCFLZXkuaXNLZXkoa2V5KSlcclxuXHRcdHRocm93IChuZXcgRXJyb3IoJ011c3QgYmUgYSBwdWJsaWMga2V5JykpO1xyXG5cclxuXHR2YXIgcGFydHMgPSBbXTtcclxuXHR2YXIgYWxnID0gcmZjNDI1My5rZXlUeXBlVG9BbGcoa2V5KTtcclxuXHRwYXJ0cy5wdXNoKGFsZyk7XHJcblxyXG5cdHZhciBidWYgPSByZmM0MjUzLndyaXRlKGtleSk7XHJcblx0cGFydHMucHVzaChidWYudG9TdHJpbmcoJ2Jhc2U2NCcpKTtcclxuXHJcblx0aWYgKGtleS5jb21tZW50KVxyXG5cdFx0cGFydHMucHVzaChrZXkuY29tbWVudCk7XHJcblxyXG5cdHJldHVybiAoQnVmZmVyLmZyb20ocGFydHMuam9pbignICcpKSk7XHJcbn1cclxuIiwiLy8gQ29weXJpZ2h0IDIwMTUgSm95ZW50LCBJbmMuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuXHRyZWFkOiByZWFkLmJpbmQodW5kZWZpbmVkLCBmYWxzZSwgdW5kZWZpbmVkKSxcclxuXHRyZWFkVHlwZTogcmVhZC5iaW5kKHVuZGVmaW5lZCwgZmFsc2UpLFxyXG5cdHdyaXRlOiB3cml0ZSxcclxuXHQvKiBzZW1pLXByaXZhdGUgYXBpLCB1c2VkIGJ5IHNzaHBrLWFnZW50ICovXHJcblx0cmVhZFBhcnRpYWw6IHJlYWQuYmluZCh1bmRlZmluZWQsIHRydWUpLFxyXG5cclxuXHQvKiBzaGFyZWQgd2l0aCBzc2ggZm9ybWF0ICovXHJcblx0cmVhZEludGVybmFsOiByZWFkLFxyXG5cdGtleVR5cGVUb0FsZzoga2V5VHlwZVRvQWxnLFxyXG5cdGFsZ1RvS2V5VHlwZTogYWxnVG9LZXlUeXBlXHJcbn07XHJcblxyXG52YXIgYXNzZXJ0ID0gcmVxdWlyZSgnYXNzZXJ0LXBsdXMnKTtcclxudmFyIEJ1ZmZlciA9IHJlcXVpcmUoJ3NhZmVyLWJ1ZmZlcicpLkJ1ZmZlcjtcclxudmFyIGFsZ3MgPSByZXF1aXJlKCcuLi9hbGdzJyk7XHJcbnZhciB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWxzJyk7XHJcbnZhciBLZXkgPSByZXF1aXJlKCcuLi9rZXknKTtcclxudmFyIFByaXZhdGVLZXkgPSByZXF1aXJlKCcuLi9wcml2YXRlLWtleScpO1xyXG52YXIgU1NIQnVmZmVyID0gcmVxdWlyZSgnLi4vc3NoLWJ1ZmZlcicpO1xyXG5cclxuZnVuY3Rpb24gYWxnVG9LZXlUeXBlKGFsZykge1xyXG5cdGFzc2VydC5zdHJpbmcoYWxnKTtcclxuXHRpZiAoYWxnID09PSAnc3NoLWRzcycpXHJcblx0XHRyZXR1cm4gKCdkc2EnKTtcclxuXHRlbHNlIGlmIChhbGcgPT09ICdzc2gtcnNhJylcclxuXHRcdHJldHVybiAoJ3JzYScpO1xyXG5cdGVsc2UgaWYgKGFsZyA9PT0gJ3NzaC1lZDI1NTE5JylcclxuXHRcdHJldHVybiAoJ2VkMjU1MTknKTtcclxuXHRlbHNlIGlmIChhbGcgPT09ICdzc2gtY3VydmUyNTUxOScpXHJcblx0XHRyZXR1cm4gKCdjdXJ2ZTI1NTE5Jyk7XHJcblx0ZWxzZSBpZiAoYWxnLm1hdGNoKC9eZWNkc2Etc2hhMi0vKSlcclxuXHRcdHJldHVybiAoJ2VjZHNhJyk7XHJcblx0ZWxzZVxyXG5cdFx0dGhyb3cgKG5ldyBFcnJvcignVW5rbm93biBhbGdvcml0aG0gJyArIGFsZykpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBrZXlUeXBlVG9BbGcoa2V5KSB7XHJcblx0YXNzZXJ0Lm9iamVjdChrZXkpO1xyXG5cdGlmIChrZXkudHlwZSA9PT0gJ2RzYScpXHJcblx0XHRyZXR1cm4gKCdzc2gtZHNzJyk7XHJcblx0ZWxzZSBpZiAoa2V5LnR5cGUgPT09ICdyc2EnKVxyXG5cdFx0cmV0dXJuICgnc3NoLXJzYScpO1xyXG5cdGVsc2UgaWYgKGtleS50eXBlID09PSAnZWQyNTUxOScpXHJcblx0XHRyZXR1cm4gKCdzc2gtZWQyNTUxOScpO1xyXG5cdGVsc2UgaWYgKGtleS50eXBlID09PSAnY3VydmUyNTUxOScpXHJcblx0XHRyZXR1cm4gKCdzc2gtY3VydmUyNTUxOScpO1xyXG5cdGVsc2UgaWYgKGtleS50eXBlID09PSAnZWNkc2EnKVxyXG5cdFx0cmV0dXJuICgnZWNkc2Etc2hhMi0nICsga2V5LnBhcnQuY3VydmUuZGF0YS50b1N0cmluZygpKTtcclxuXHRlbHNlXHJcblx0XHR0aHJvdyAobmV3IEVycm9yKCdVbmtub3duIGtleSB0eXBlICcgKyBrZXkudHlwZSkpO1xyXG59XHJcblxyXG5mdW5jdGlvbiByZWFkKHBhcnRpYWwsIHR5cGUsIGJ1Ziwgb3B0aW9ucykge1xyXG5cdGlmICh0eXBlb2YgKGJ1ZikgPT09ICdzdHJpbmcnKVxyXG5cdFx0YnVmID0gQnVmZmVyLmZyb20oYnVmKTtcclxuXHRhc3NlcnQuYnVmZmVyKGJ1ZiwgJ2J1ZicpO1xyXG5cclxuXHR2YXIga2V5ID0ge307XHJcblxyXG5cdHZhciBwYXJ0cyA9IGtleS5wYXJ0cyA9IFtdO1xyXG5cdHZhciBzc2hidWYgPSBuZXcgU1NIQnVmZmVyKHtidWZmZXI6IGJ1Zn0pO1xyXG5cclxuXHR2YXIgYWxnID0gc3NoYnVmLnJlYWRTdHJpbmcoKTtcclxuXHRhc3NlcnQub2soIXNzaGJ1Zi5hdEVuZCgpLCAna2V5IG11c3QgaGF2ZSBhdCBsZWFzdCBvbmUgcGFydCcpO1xyXG5cclxuXHRrZXkudHlwZSA9IGFsZ1RvS2V5VHlwZShhbGcpO1xyXG5cclxuXHR2YXIgcGFydENvdW50ID0gYWxncy5pbmZvW2tleS50eXBlXS5wYXJ0cy5sZW5ndGg7XHJcblx0aWYgKHR5cGUgJiYgdHlwZSA9PT0gJ3ByaXZhdGUnKVxyXG5cdFx0cGFydENvdW50ID0gYWxncy5wcml2SW5mb1trZXkudHlwZV0ucGFydHMubGVuZ3RoO1xyXG5cclxuXHR3aGlsZSAoIXNzaGJ1Zi5hdEVuZCgpICYmIHBhcnRzLmxlbmd0aCA8IHBhcnRDb3VudClcclxuXHRcdHBhcnRzLnB1c2goc3NoYnVmLnJlYWRQYXJ0KCkpO1xyXG5cdHdoaWxlICghcGFydGlhbCAmJiAhc3NoYnVmLmF0RW5kKCkpXHJcblx0XHRwYXJ0cy5wdXNoKHNzaGJ1Zi5yZWFkUGFydCgpKTtcclxuXHJcblx0YXNzZXJ0Lm9rKHBhcnRzLmxlbmd0aCA+PSAxLFxyXG5cdCAgICAna2V5IG11c3QgaGF2ZSBhdCBsZWFzdCBvbmUgcGFydCcpO1xyXG5cdGFzc2VydC5vayhwYXJ0aWFsIHx8IHNzaGJ1Zi5hdEVuZCgpLFxyXG5cdCAgICAnbGVmdG92ZXIgYnl0ZXMgYXQgZW5kIG9mIGtleScpO1xyXG5cclxuXHR2YXIgQ29uc3RydWN0b3IgPSBLZXk7XHJcblx0dmFyIGFsZ0luZm8gPSBhbGdzLmluZm9ba2V5LnR5cGVdO1xyXG5cdGlmICh0eXBlID09PSAncHJpdmF0ZScgfHwgYWxnSW5mby5wYXJ0cy5sZW5ndGggIT09IHBhcnRzLmxlbmd0aCkge1xyXG5cdFx0YWxnSW5mbyA9IGFsZ3MucHJpdkluZm9ba2V5LnR5cGVdO1xyXG5cdFx0Q29uc3RydWN0b3IgPSBQcml2YXRlS2V5O1xyXG5cdH1cclxuXHRhc3NlcnQuc3RyaWN0RXF1YWwoYWxnSW5mby5wYXJ0cy5sZW5ndGgsIHBhcnRzLmxlbmd0aCk7XHJcblxyXG5cdGlmIChrZXkudHlwZSA9PT0gJ2VjZHNhJykge1xyXG5cdFx0dmFyIHJlcyA9IC9eZWNkc2Etc2hhMi0oLispJC8uZXhlYyhhbGcpO1xyXG5cdFx0YXNzZXJ0Lm9rKHJlcyAhPT0gbnVsbCk7XHJcblx0XHRhc3NlcnQuc3RyaWN0RXF1YWwocmVzWzFdLCBwYXJ0c1swXS5kYXRhLnRvU3RyaW5nKCkpO1xyXG5cdH1cclxuXHJcblx0dmFyIG5vcm1hbGl6ZWQgPSB0cnVlO1xyXG5cdGZvciAodmFyIGkgPSAwOyBpIDwgYWxnSW5mby5wYXJ0cy5sZW5ndGg7ICsraSkge1xyXG5cdFx0dmFyIHAgPSBwYXJ0c1tpXTtcclxuXHRcdHAubmFtZSA9IGFsZ0luZm8ucGFydHNbaV07XHJcblx0XHQvKlxyXG5cdFx0ICogT3BlblNTSCBzdG9yZXMgZWQyNTUxOSBcInByaXZhdGVcIiBrZXlzIGFzIHNlZWQgKyBwdWJsaWMga2V5XHJcblx0XHQgKiBjb25jYXQnZCB0b2dldGhlciAoayBmb2xsb3dlZCBieSBBKS4gV2Ugd2FudCB0byBrZWVwIHRoZW1cclxuXHRcdCAqIHNlcGFyYXRlIGZvciBvdGhlciBmb3JtYXRzIHRoYXQgZG9uJ3QgZG8gdGhpcy5cclxuXHRcdCAqL1xyXG5cdFx0aWYgKGtleS50eXBlID09PSAnZWQyNTUxOScgJiYgcC5uYW1lID09PSAnaycpXHJcblx0XHRcdHAuZGF0YSA9IHAuZGF0YS5zbGljZSgwLCAzMik7XHJcblxyXG5cdFx0aWYgKHAubmFtZSAhPT0gJ2N1cnZlJyAmJiBhbGdJbmZvLm5vcm1hbGl6ZSAhPT0gZmFsc2UpIHtcclxuXHRcdFx0dmFyIG5kO1xyXG5cdFx0XHRpZiAoa2V5LnR5cGUgPT09ICdlZDI1NTE5Jykge1xyXG5cdFx0XHRcdG5kID0gdXRpbHMuemVyb1BhZFRvTGVuZ3RoKHAuZGF0YSwgMzIpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdG5kID0gdXRpbHMubXBOb3JtYWxpemUocC5kYXRhKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAobmQudG9TdHJpbmcoJ2JpbmFyeScpICE9PVxyXG5cdFx0XHQgICAgcC5kYXRhLnRvU3RyaW5nKCdiaW5hcnknKSkge1xyXG5cdFx0XHRcdHAuZGF0YSA9IG5kO1xyXG5cdFx0XHRcdG5vcm1hbGl6ZWQgPSBmYWxzZTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0aWYgKG5vcm1hbGl6ZWQpXHJcblx0XHRrZXkuX3JmYzQyNTNDYWNoZSA9IHNzaGJ1Zi50b0J1ZmZlcigpO1xyXG5cclxuXHRpZiAocGFydGlhbCAmJiB0eXBlb2YgKHBhcnRpYWwpID09PSAnb2JqZWN0Jykge1xyXG5cdFx0cGFydGlhbC5yZW1haW5kZXIgPSBzc2hidWYucmVtYWluZGVyKCk7XHJcblx0XHRwYXJ0aWFsLmNvbnN1bWVkID0gc3NoYnVmLl9vZmZzZXQ7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gKG5ldyBDb25zdHJ1Y3RvcihrZXkpKTtcclxufVxyXG5cclxuZnVuY3Rpb24gd3JpdGUoa2V5LCBvcHRpb25zKSB7XHJcblx0YXNzZXJ0Lm9iamVjdChrZXkpO1xyXG5cclxuXHR2YXIgYWxnID0ga2V5VHlwZVRvQWxnKGtleSk7XHJcblx0dmFyIGk7XHJcblxyXG5cdHZhciBhbGdJbmZvID0gYWxncy5pbmZvW2tleS50eXBlXTtcclxuXHRpZiAoUHJpdmF0ZUtleS5pc1ByaXZhdGVLZXkoa2V5KSlcclxuXHRcdGFsZ0luZm8gPSBhbGdzLnByaXZJbmZvW2tleS50eXBlXTtcclxuXHR2YXIgcGFydHMgPSBhbGdJbmZvLnBhcnRzO1xyXG5cclxuXHR2YXIgYnVmID0gbmV3IFNTSEJ1ZmZlcih7fSk7XHJcblxyXG5cdGJ1Zi53cml0ZVN0cmluZyhhbGcpO1xyXG5cclxuXHRmb3IgKGkgPSAwOyBpIDwgcGFydHMubGVuZ3RoOyArK2kpIHtcclxuXHRcdHZhciBkYXRhID0ga2V5LnBhcnRbcGFydHNbaV1dLmRhdGE7XHJcblx0XHRpZiAoYWxnSW5mby5ub3JtYWxpemUgIT09IGZhbHNlKSB7XHJcblx0XHRcdGlmIChrZXkudHlwZSA9PT0gJ2VkMjU1MTknKVxyXG5cdFx0XHRcdGRhdGEgPSB1dGlscy56ZXJvUGFkVG9MZW5ndGgoZGF0YSwgMzIpO1xyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0ZGF0YSA9IHV0aWxzLm1wTm9ybWFsaXplKGRhdGEpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKGtleS50eXBlID09PSAnZWQyNTUxOScgJiYgcGFydHNbaV0gPT09ICdrJylcclxuXHRcdFx0ZGF0YSA9IEJ1ZmZlci5jb25jYXQoW2RhdGEsIGtleS5wYXJ0LkEuZGF0YV0pO1xyXG5cdFx0YnVmLndyaXRlQnVmZmVyKGRhdGEpO1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIChidWYudG9CdWZmZXIoKSk7XHJcbn1cclxuIiwiLy8gQ29weXJpZ2h0IDIwMTYgSm95ZW50LCBJbmMuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENlcnRpZmljYXRlO1xyXG5cclxudmFyIGFzc2VydCA9IHJlcXVpcmUoJ2Fzc2VydC1wbHVzJyk7XHJcbnZhciBCdWZmZXIgPSByZXF1aXJlKCdzYWZlci1idWZmZXInKS5CdWZmZXI7XHJcbnZhciBhbGdzID0gcmVxdWlyZSgnLi9hbGdzJyk7XHJcbnZhciBjcnlwdG8gPSByZXF1aXJlKCdjcnlwdG8nKTtcclxudmFyIEZpbmdlcnByaW50ID0gcmVxdWlyZSgnLi9maW5nZXJwcmludCcpO1xyXG52YXIgU2lnbmF0dXJlID0gcmVxdWlyZSgnLi9zaWduYXR1cmUnKTtcclxudmFyIGVycnMgPSByZXF1aXJlKCcuL2Vycm9ycycpO1xyXG52YXIgdXRpbCA9IHJlcXVpcmUoJ3V0aWwnKTtcclxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xyXG52YXIgS2V5ID0gcmVxdWlyZSgnLi9rZXknKTtcclxudmFyIFByaXZhdGVLZXkgPSByZXF1aXJlKCcuL3ByaXZhdGUta2V5Jyk7XHJcbnZhciBJZGVudGl0eSA9IHJlcXVpcmUoJy4vaWRlbnRpdHknKTtcclxuXHJcbnZhciBmb3JtYXRzID0ge307XHJcbmZvcm1hdHNbJ29wZW5zc2gnXSA9IHJlcXVpcmUoJy4vZm9ybWF0cy9vcGVuc3NoLWNlcnQnKTtcclxuZm9ybWF0c1sneDUwOSddID0gcmVxdWlyZSgnLi9mb3JtYXRzL3g1MDknKTtcclxuZm9ybWF0c1sncGVtJ10gPSByZXF1aXJlKCcuL2Zvcm1hdHMveDUwOS1wZW0nKTtcclxuXHJcbnZhciBDZXJ0aWZpY2F0ZVBhcnNlRXJyb3IgPSBlcnJzLkNlcnRpZmljYXRlUGFyc2VFcnJvcjtcclxudmFyIEludmFsaWRBbGdvcml0aG1FcnJvciA9IGVycnMuSW52YWxpZEFsZ29yaXRobUVycm9yO1xyXG5cclxuZnVuY3Rpb24gQ2VydGlmaWNhdGUob3B0cykge1xyXG5cdGFzc2VydC5vYmplY3Qob3B0cywgJ29wdGlvbnMnKTtcclxuXHRhc3NlcnQuYXJyYXlPZk9iamVjdChvcHRzLnN1YmplY3RzLCAnb3B0aW9ucy5zdWJqZWN0cycpO1xyXG5cdHV0aWxzLmFzc2VydENvbXBhdGlibGUob3B0cy5zdWJqZWN0c1swXSwgSWRlbnRpdHksIFsxLCAwXSxcclxuXHQgICAgJ29wdGlvbnMuc3ViamVjdHMnKTtcclxuXHR1dGlscy5hc3NlcnRDb21wYXRpYmxlKG9wdHMuc3ViamVjdEtleSwgS2V5LCBbMSwgMF0sXHJcblx0ICAgICdvcHRpb25zLnN1YmplY3RLZXknKTtcclxuXHR1dGlscy5hc3NlcnRDb21wYXRpYmxlKG9wdHMuaXNzdWVyLCBJZGVudGl0eSwgWzEsIDBdLCAnb3B0aW9ucy5pc3N1ZXInKTtcclxuXHRpZiAob3B0cy5pc3N1ZXJLZXkgIT09IHVuZGVmaW5lZCkge1xyXG5cdFx0dXRpbHMuYXNzZXJ0Q29tcGF0aWJsZShvcHRzLmlzc3VlcktleSwgS2V5LCBbMSwgMF0sXHJcblx0XHQgICAgJ29wdGlvbnMuaXNzdWVyS2V5Jyk7XHJcblx0fVxyXG5cdGFzc2VydC5vYmplY3Qob3B0cy5zaWduYXR1cmVzLCAnb3B0aW9ucy5zaWduYXR1cmVzJyk7XHJcblx0YXNzZXJ0LmJ1ZmZlcihvcHRzLnNlcmlhbCwgJ29wdGlvbnMuc2VyaWFsJyk7XHJcblx0YXNzZXJ0LmRhdGUob3B0cy52YWxpZEZyb20sICdvcHRpb25zLnZhbGlkRnJvbScpO1xyXG5cdGFzc2VydC5kYXRlKG9wdHMudmFsaWRVbnRpbCwgJ29wdG9ucy52YWxpZFVudGlsJyk7XHJcblxyXG5cdGFzc2VydC5vcHRpb25hbEFycmF5T2ZTdHJpbmcob3B0cy5wdXJwb3NlcywgJ29wdGlvbnMucHVycG9zZXMnKTtcclxuXHJcblx0dGhpcy5faGFzaENhY2hlID0ge307XHJcblxyXG5cdHRoaXMuc3ViamVjdHMgPSBvcHRzLnN1YmplY3RzO1xyXG5cdHRoaXMuaXNzdWVyID0gb3B0cy5pc3N1ZXI7XHJcblx0dGhpcy5zdWJqZWN0S2V5ID0gb3B0cy5zdWJqZWN0S2V5O1xyXG5cdHRoaXMuaXNzdWVyS2V5ID0gb3B0cy5pc3N1ZXJLZXk7XHJcblx0dGhpcy5zaWduYXR1cmVzID0gb3B0cy5zaWduYXR1cmVzO1xyXG5cdHRoaXMuc2VyaWFsID0gb3B0cy5zZXJpYWw7XHJcblx0dGhpcy52YWxpZEZyb20gPSBvcHRzLnZhbGlkRnJvbTtcclxuXHR0aGlzLnZhbGlkVW50aWwgPSBvcHRzLnZhbGlkVW50aWw7XHJcblx0dGhpcy5wdXJwb3NlcyA9IG9wdHMucHVycG9zZXM7XHJcbn1cclxuXHJcbkNlcnRpZmljYXRlLmZvcm1hdHMgPSBmb3JtYXRzO1xyXG5cclxuQ2VydGlmaWNhdGUucHJvdG90eXBlLnRvQnVmZmVyID0gZnVuY3Rpb24gKGZvcm1hdCwgb3B0aW9ucykge1xyXG5cdGlmIChmb3JtYXQgPT09IHVuZGVmaW5lZClcclxuXHRcdGZvcm1hdCA9ICd4NTA5JztcclxuXHRhc3NlcnQuc3RyaW5nKGZvcm1hdCwgJ2Zvcm1hdCcpO1xyXG5cdGFzc2VydC5vYmplY3QoZm9ybWF0c1tmb3JtYXRdLCAnZm9ybWF0c1tmb3JtYXRdJyk7XHJcblx0YXNzZXJ0Lm9wdGlvbmFsT2JqZWN0KG9wdGlvbnMsICdvcHRpb25zJyk7XHJcblxyXG5cdHJldHVybiAoZm9ybWF0c1tmb3JtYXRdLndyaXRlKHRoaXMsIG9wdGlvbnMpKTtcclxufTtcclxuXHJcbkNlcnRpZmljYXRlLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uIChmb3JtYXQsIG9wdGlvbnMpIHtcclxuXHRpZiAoZm9ybWF0ID09PSB1bmRlZmluZWQpXHJcblx0XHRmb3JtYXQgPSAncGVtJztcclxuXHRyZXR1cm4gKHRoaXMudG9CdWZmZXIoZm9ybWF0LCBvcHRpb25zKS50b1N0cmluZygpKTtcclxufTtcclxuXHJcbkNlcnRpZmljYXRlLnByb3RvdHlwZS5maW5nZXJwcmludCA9IGZ1bmN0aW9uIChhbGdvKSB7XHJcblx0aWYgKGFsZ28gPT09IHVuZGVmaW5lZClcclxuXHRcdGFsZ28gPSAnc2hhMjU2JztcclxuXHRhc3NlcnQuc3RyaW5nKGFsZ28sICdhbGdvcml0aG0nKTtcclxuXHR2YXIgb3B0cyA9IHtcclxuXHRcdHR5cGU6ICdjZXJ0aWZpY2F0ZScsXHJcblx0XHRoYXNoOiB0aGlzLmhhc2goYWxnbyksXHJcblx0XHRhbGdvcml0aG06IGFsZ29cclxuXHR9O1xyXG5cdHJldHVybiAobmV3IEZpbmdlcnByaW50KG9wdHMpKTtcclxufTtcclxuXHJcbkNlcnRpZmljYXRlLnByb3RvdHlwZS5oYXNoID0gZnVuY3Rpb24gKGFsZ28pIHtcclxuXHRhc3NlcnQuc3RyaW5nKGFsZ28sICdhbGdvcml0aG0nKTtcclxuXHRhbGdvID0gYWxnby50b0xvd2VyQ2FzZSgpO1xyXG5cdGlmIChhbGdzLmhhc2hBbGdzW2FsZ29dID09PSB1bmRlZmluZWQpXHJcblx0XHR0aHJvdyAobmV3IEludmFsaWRBbGdvcml0aG1FcnJvcihhbGdvKSk7XHJcblxyXG5cdGlmICh0aGlzLl9oYXNoQ2FjaGVbYWxnb10pXHJcblx0XHRyZXR1cm4gKHRoaXMuX2hhc2hDYWNoZVthbGdvXSk7XHJcblxyXG5cdHZhciBoYXNoID0gY3J5cHRvLmNyZWF0ZUhhc2goYWxnbykuXHJcblx0ICAgIHVwZGF0ZSh0aGlzLnRvQnVmZmVyKCd4NTA5JykpLmRpZ2VzdCgpO1xyXG5cdHRoaXMuX2hhc2hDYWNoZVthbGdvXSA9IGhhc2g7XHJcblx0cmV0dXJuIChoYXNoKTtcclxufTtcclxuXHJcbkNlcnRpZmljYXRlLnByb3RvdHlwZS5pc0V4cGlyZWQgPSBmdW5jdGlvbiAod2hlbikge1xyXG5cdGlmICh3aGVuID09PSB1bmRlZmluZWQpXHJcblx0XHR3aGVuID0gbmV3IERhdGUoKTtcclxuXHRyZXR1cm4gKCEoKHdoZW4uZ2V0VGltZSgpID49IHRoaXMudmFsaWRGcm9tLmdldFRpbWUoKSkgJiZcclxuXHRcdCh3aGVuLmdldFRpbWUoKSA8IHRoaXMudmFsaWRVbnRpbC5nZXRUaW1lKCkpKSk7XHJcbn07XHJcblxyXG5DZXJ0aWZpY2F0ZS5wcm90b3R5cGUuaXNTaWduZWRCeSA9IGZ1bmN0aW9uIChpc3N1ZXJDZXJ0KSB7XHJcblx0dXRpbHMuYXNzZXJ0Q29tcGF0aWJsZShpc3N1ZXJDZXJ0LCBDZXJ0aWZpY2F0ZSwgWzEsIDBdLCAnaXNzdWVyJyk7XHJcblxyXG5cdGlmICghdGhpcy5pc3N1ZXIuZXF1YWxzKGlzc3VlckNlcnQuc3ViamVjdHNbMF0pKVxyXG5cdFx0cmV0dXJuIChmYWxzZSk7XHJcblx0aWYgKHRoaXMuaXNzdWVyLnB1cnBvc2VzICYmIHRoaXMuaXNzdWVyLnB1cnBvc2VzLmxlbmd0aCA+IDAgJiZcclxuXHQgICAgdGhpcy5pc3N1ZXIucHVycG9zZXMuaW5kZXhPZignY2EnKSA9PT0gLTEpIHtcclxuXHRcdHJldHVybiAoZmFsc2UpO1xyXG5cdH1cclxuXHJcblx0cmV0dXJuICh0aGlzLmlzU2lnbmVkQnlLZXkoaXNzdWVyQ2VydC5zdWJqZWN0S2V5KSk7XHJcbn07XHJcblxyXG5DZXJ0aWZpY2F0ZS5wcm90b3R5cGUuZ2V0RXh0ZW5zaW9uID0gZnVuY3Rpb24gKGtleU9yT2lkKSB7XHJcblx0YXNzZXJ0LnN0cmluZyhrZXlPck9pZCwgJ2tleU9yT2lkJyk7XHJcblx0dmFyIGV4dCA9IHRoaXMuZ2V0RXh0ZW5zaW9ucygpLmZpbHRlcihmdW5jdGlvbiAobWF5YmVFeHQpIHtcclxuXHRcdGlmIChtYXliZUV4dC5mb3JtYXQgPT09ICd4NTA5JylcclxuXHRcdFx0cmV0dXJuIChtYXliZUV4dC5vaWQgPT09IGtleU9yT2lkKTtcclxuXHRcdGlmIChtYXliZUV4dC5mb3JtYXQgPT09ICdvcGVuc3NoJylcclxuXHRcdFx0cmV0dXJuIChtYXliZUV4dC5uYW1lID09PSBrZXlPck9pZCk7XHJcblx0XHRyZXR1cm4gKGZhbHNlKTtcclxuXHR9KVswXTtcclxuXHRyZXR1cm4gKGV4dCk7XHJcbn07XHJcblxyXG5DZXJ0aWZpY2F0ZS5wcm90b3R5cGUuZ2V0RXh0ZW5zaW9ucyA9IGZ1bmN0aW9uICgpIHtcclxuXHR2YXIgZXh0cyA9IFtdO1xyXG5cdHZhciB4NTA5ID0gdGhpcy5zaWduYXR1cmVzLng1MDk7XHJcblx0aWYgKHg1MDkgJiYgeDUwOS5leHRyYXMgJiYgeDUwOS5leHRyYXMuZXh0cykge1xyXG5cdFx0eDUwOS5leHRyYXMuZXh0cy5mb3JFYWNoKGZ1bmN0aW9uIChleHQpIHtcclxuXHRcdFx0ZXh0LmZvcm1hdCA9ICd4NTA5JztcclxuXHRcdFx0ZXh0cy5wdXNoKGV4dCk7XHJcblx0XHR9KTtcclxuXHR9XHJcblx0dmFyIG9wZW5zc2ggPSB0aGlzLnNpZ25hdHVyZXMub3BlbnNzaDtcclxuXHRpZiAob3BlbnNzaCAmJiBvcGVuc3NoLmV4dHMpIHtcclxuXHRcdG9wZW5zc2guZXh0cy5mb3JFYWNoKGZ1bmN0aW9uIChleHQpIHtcclxuXHRcdFx0ZXh0LmZvcm1hdCA9ICdvcGVuc3NoJztcclxuXHRcdFx0ZXh0cy5wdXNoKGV4dCk7XHJcblx0XHR9KTtcclxuXHR9XHJcblx0cmV0dXJuIChleHRzKTtcclxufTtcclxuXHJcbkNlcnRpZmljYXRlLnByb3RvdHlwZS5pc1NpZ25lZEJ5S2V5ID0gZnVuY3Rpb24gKGlzc3VlcktleSkge1xyXG5cdHV0aWxzLmFzc2VydENvbXBhdGlibGUoaXNzdWVyS2V5LCBLZXksIFsxLCAyXSwgJ2lzc3VlcktleScpO1xyXG5cclxuXHRpZiAodGhpcy5pc3N1ZXJLZXkgIT09IHVuZGVmaW5lZCkge1xyXG5cdFx0cmV0dXJuICh0aGlzLmlzc3VlcktleS5cclxuXHRcdCAgICBmaW5nZXJwcmludCgnc2hhNTEyJykubWF0Y2hlcyhpc3N1ZXJLZXkpKTtcclxuXHR9XHJcblxyXG5cdHZhciBmbXQgPSBPYmplY3Qua2V5cyh0aGlzLnNpZ25hdHVyZXMpWzBdO1xyXG5cdHZhciB2YWxpZCA9IGZvcm1hdHNbZm10XS52ZXJpZnkodGhpcywgaXNzdWVyS2V5KTtcclxuXHRpZiAodmFsaWQpXHJcblx0XHR0aGlzLmlzc3VlcktleSA9IGlzc3VlcktleTtcclxuXHRyZXR1cm4gKHZhbGlkKTtcclxufTtcclxuXHJcbkNlcnRpZmljYXRlLnByb3RvdHlwZS5zaWduV2l0aCA9IGZ1bmN0aW9uIChrZXkpIHtcclxuXHR1dGlscy5hc3NlcnRDb21wYXRpYmxlKGtleSwgUHJpdmF0ZUtleSwgWzEsIDJdLCAna2V5Jyk7XHJcblx0dmFyIGZtdHMgPSBPYmplY3Qua2V5cyhmb3JtYXRzKTtcclxuXHR2YXIgZGlkT25lID0gZmFsc2U7XHJcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBmbXRzLmxlbmd0aDsgKytpKSB7XHJcblx0XHRpZiAoZm10c1tpXSAhPT0gJ3BlbScpIHtcclxuXHRcdFx0dmFyIHJldCA9IGZvcm1hdHNbZm10c1tpXV0uc2lnbih0aGlzLCBrZXkpO1xyXG5cdFx0XHRpZiAocmV0ID09PSB0cnVlKVxyXG5cdFx0XHRcdGRpZE9uZSA9IHRydWU7XHJcblx0XHR9XHJcblx0fVxyXG5cdGlmICghZGlkT25lKSB7XHJcblx0XHR0aHJvdyAobmV3IEVycm9yKCdGYWlsZWQgdG8gc2lnbiB0aGUgY2VydGlmaWNhdGUgZm9yIGFueSAnICtcclxuXHRcdCAgICAnYXZhaWxhYmxlIGNlcnRpZmljYXRlIGZvcm1hdHMnKSk7XHJcblx0fVxyXG59O1xyXG5cclxuQ2VydGlmaWNhdGUuY3JlYXRlU2VsZlNpZ25lZCA9IGZ1bmN0aW9uIChzdWJqZWN0T3JTdWJqZWN0cywga2V5LCBvcHRpb25zKSB7XHJcblx0dmFyIHN1YmplY3RzO1xyXG5cdGlmIChBcnJheS5pc0FycmF5KHN1YmplY3RPclN1YmplY3RzKSlcclxuXHRcdHN1YmplY3RzID0gc3ViamVjdE9yU3ViamVjdHM7XHJcblx0ZWxzZVxyXG5cdFx0c3ViamVjdHMgPSBbc3ViamVjdE9yU3ViamVjdHNdO1xyXG5cclxuXHRhc3NlcnQuYXJyYXlPZk9iamVjdChzdWJqZWN0cyk7XHJcblx0c3ViamVjdHMuZm9yRWFjaChmdW5jdGlvbiAoc3ViamVjdCkge1xyXG5cdFx0dXRpbHMuYXNzZXJ0Q29tcGF0aWJsZShzdWJqZWN0LCBJZGVudGl0eSwgWzEsIDBdLCAnc3ViamVjdCcpO1xyXG5cdH0pO1xyXG5cclxuXHR1dGlscy5hc3NlcnRDb21wYXRpYmxlKGtleSwgUHJpdmF0ZUtleSwgWzEsIDJdLCAncHJpdmF0ZSBrZXknKTtcclxuXHJcblx0YXNzZXJ0Lm9wdGlvbmFsT2JqZWN0KG9wdGlvbnMsICdvcHRpb25zJyk7XHJcblx0aWYgKG9wdGlvbnMgPT09IHVuZGVmaW5lZClcclxuXHRcdG9wdGlvbnMgPSB7fTtcclxuXHRhc3NlcnQub3B0aW9uYWxPYmplY3Qob3B0aW9ucy52YWxpZEZyb20sICdvcHRpb25zLnZhbGlkRnJvbScpO1xyXG5cdGFzc2VydC5vcHRpb25hbE9iamVjdChvcHRpb25zLnZhbGlkVW50aWwsICdvcHRpb25zLnZhbGlkVW50aWwnKTtcclxuXHR2YXIgdmFsaWRGcm9tID0gb3B0aW9ucy52YWxpZEZyb207XHJcblx0dmFyIHZhbGlkVW50aWwgPSBvcHRpb25zLnZhbGlkVW50aWw7XHJcblx0aWYgKHZhbGlkRnJvbSA9PT0gdW5kZWZpbmVkKVxyXG5cdFx0dmFsaWRGcm9tID0gbmV3IERhdGUoKTtcclxuXHRpZiAodmFsaWRVbnRpbCA9PT0gdW5kZWZpbmVkKSB7XHJcblx0XHRhc3NlcnQub3B0aW9uYWxOdW1iZXIob3B0aW9ucy5saWZldGltZSwgJ29wdGlvbnMubGlmZXRpbWUnKTtcclxuXHRcdHZhciBsaWZldGltZSA9IG9wdGlvbnMubGlmZXRpbWU7XHJcblx0XHRpZiAobGlmZXRpbWUgPT09IHVuZGVmaW5lZClcclxuXHRcdFx0bGlmZXRpbWUgPSAxMCozNjUqMjQqMzYwMDtcclxuXHRcdHZhbGlkVW50aWwgPSBuZXcgRGF0ZSgpO1xyXG5cdFx0dmFsaWRVbnRpbC5zZXRUaW1lKHZhbGlkVW50aWwuZ2V0VGltZSgpICsgbGlmZXRpbWUqMTAwMCk7XHJcblx0fVxyXG5cdGFzc2VydC5vcHRpb25hbEJ1ZmZlcihvcHRpb25zLnNlcmlhbCwgJ29wdGlvbnMuc2VyaWFsJyk7XHJcblx0dmFyIHNlcmlhbCA9IG9wdGlvbnMuc2VyaWFsO1xyXG5cdGlmIChzZXJpYWwgPT09IHVuZGVmaW5lZClcclxuXHRcdHNlcmlhbCA9IEJ1ZmZlci5mcm9tKCcwMDAwMDAwMDAwMDAwMDAxJywgJ2hleCcpO1xyXG5cclxuXHR2YXIgcHVycG9zZXMgPSBvcHRpb25zLnB1cnBvc2VzO1xyXG5cdGlmIChwdXJwb3NlcyA9PT0gdW5kZWZpbmVkKVxyXG5cdFx0cHVycG9zZXMgPSBbXTtcclxuXHJcblx0aWYgKHB1cnBvc2VzLmluZGV4T2YoJ3NpZ25hdHVyZScpID09PSAtMSlcclxuXHRcdHB1cnBvc2VzLnB1c2goJ3NpZ25hdHVyZScpO1xyXG5cclxuXHQvKiBTZWxmLXNpZ25lZCBjZXJ0cyBhcmUgYWx3YXlzIENBcy4gKi9cclxuXHRpZiAocHVycG9zZXMuaW5kZXhPZignY2EnKSA9PT0gLTEpXHJcblx0XHRwdXJwb3Nlcy5wdXNoKCdjYScpO1xyXG5cdGlmIChwdXJwb3Nlcy5pbmRleE9mKCdjcmwnKSA9PT0gLTEpXHJcblx0XHRwdXJwb3Nlcy5wdXNoKCdjcmwnKTtcclxuXHJcblx0LypcclxuXHQgKiBJZiB3ZSB3ZXJlbid0IGV4cGxpY2l0bHkgZ2l2ZW4gYW55IG90aGVyIHB1cnBvc2VzLCBkbyB0aGUgc2Vuc2libGVcclxuXHQgKiB0aGluZyBhbmQgYWRkIHNvbWUgYmFzaWMgb25lcyBkZXBlbmRpbmcgb24gdGhlIHN1YmplY3QgdHlwZS5cclxuXHQgKi9cclxuXHRpZiAocHVycG9zZXMubGVuZ3RoIDw9IDMpIHtcclxuXHRcdHZhciBob3N0U3ViamVjdHMgPSBzdWJqZWN0cy5maWx0ZXIoZnVuY3Rpb24gKHN1YmplY3QpIHtcclxuXHRcdFx0cmV0dXJuIChzdWJqZWN0LnR5cGUgPT09ICdob3N0Jyk7XHJcblx0XHR9KTtcclxuXHRcdHZhciB1c2VyU3ViamVjdHMgPSBzdWJqZWN0cy5maWx0ZXIoZnVuY3Rpb24gKHN1YmplY3QpIHtcclxuXHRcdFx0cmV0dXJuIChzdWJqZWN0LnR5cGUgPT09ICd1c2VyJyk7XHJcblx0XHR9KTtcclxuXHRcdGlmIChob3N0U3ViamVjdHMubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRpZiAocHVycG9zZXMuaW5kZXhPZignc2VydmVyQXV0aCcpID09PSAtMSlcclxuXHRcdFx0XHRwdXJwb3Nlcy5wdXNoKCdzZXJ2ZXJBdXRoJyk7XHJcblx0XHR9XHJcblx0XHRpZiAodXNlclN1YmplY3RzLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0aWYgKHB1cnBvc2VzLmluZGV4T2YoJ2NsaWVudEF1dGgnKSA9PT0gLTEpXHJcblx0XHRcdFx0cHVycG9zZXMucHVzaCgnY2xpZW50QXV0aCcpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKHVzZXJTdWJqZWN0cy5sZW5ndGggPiAwIHx8IGhvc3RTdWJqZWN0cy5sZW5ndGggPiAwKSB7XHJcblx0XHRcdGlmIChwdXJwb3Nlcy5pbmRleE9mKCdrZXlBZ3JlZW1lbnQnKSA9PT0gLTEpXHJcblx0XHRcdFx0cHVycG9zZXMucHVzaCgna2V5QWdyZWVtZW50Jyk7XHJcblx0XHRcdGlmIChrZXkudHlwZSA9PT0gJ3JzYScgJiZcclxuXHRcdFx0ICAgIHB1cnBvc2VzLmluZGV4T2YoJ2VuY3J5cHRpb24nKSA9PT0gLTEpXHJcblx0XHRcdFx0cHVycG9zZXMucHVzaCgnZW5jcnlwdGlvbicpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0dmFyIGNlcnQgPSBuZXcgQ2VydGlmaWNhdGUoe1xyXG5cdFx0c3ViamVjdHM6IHN1YmplY3RzLFxyXG5cdFx0aXNzdWVyOiBzdWJqZWN0c1swXSxcclxuXHRcdHN1YmplY3RLZXk6IGtleS50b1B1YmxpYygpLFxyXG5cdFx0aXNzdWVyS2V5OiBrZXkudG9QdWJsaWMoKSxcclxuXHRcdHNpZ25hdHVyZXM6IHt9LFxyXG5cdFx0c2VyaWFsOiBzZXJpYWwsXHJcblx0XHR2YWxpZEZyb206IHZhbGlkRnJvbSxcclxuXHRcdHZhbGlkVW50aWw6IHZhbGlkVW50aWwsXHJcblx0XHRwdXJwb3NlczogcHVycG9zZXNcclxuXHR9KTtcclxuXHRjZXJ0LnNpZ25XaXRoKGtleSk7XHJcblxyXG5cdHJldHVybiAoY2VydCk7XHJcbn07XHJcblxyXG5DZXJ0aWZpY2F0ZS5jcmVhdGUgPVxyXG4gICAgZnVuY3Rpb24gKHN1YmplY3RPclN1YmplY3RzLCBrZXksIGlzc3VlciwgaXNzdWVyS2V5LCBvcHRpb25zKSB7XHJcblx0dmFyIHN1YmplY3RzO1xyXG5cdGlmIChBcnJheS5pc0FycmF5KHN1YmplY3RPclN1YmplY3RzKSlcclxuXHRcdHN1YmplY3RzID0gc3ViamVjdE9yU3ViamVjdHM7XHJcblx0ZWxzZVxyXG5cdFx0c3ViamVjdHMgPSBbc3ViamVjdE9yU3ViamVjdHNdO1xyXG5cclxuXHRhc3NlcnQuYXJyYXlPZk9iamVjdChzdWJqZWN0cyk7XHJcblx0c3ViamVjdHMuZm9yRWFjaChmdW5jdGlvbiAoc3ViamVjdCkge1xyXG5cdFx0dXRpbHMuYXNzZXJ0Q29tcGF0aWJsZShzdWJqZWN0LCBJZGVudGl0eSwgWzEsIDBdLCAnc3ViamVjdCcpO1xyXG5cdH0pO1xyXG5cclxuXHR1dGlscy5hc3NlcnRDb21wYXRpYmxlKGtleSwgS2V5LCBbMSwgMF0sICdrZXknKTtcclxuXHRpZiAoUHJpdmF0ZUtleS5pc1ByaXZhdGVLZXkoa2V5KSlcclxuXHRcdGtleSA9IGtleS50b1B1YmxpYygpO1xyXG5cdHV0aWxzLmFzc2VydENvbXBhdGlibGUoaXNzdWVyLCBJZGVudGl0eSwgWzEsIDBdLCAnaXNzdWVyJyk7XHJcblx0dXRpbHMuYXNzZXJ0Q29tcGF0aWJsZShpc3N1ZXJLZXksIFByaXZhdGVLZXksIFsxLCAyXSwgJ2lzc3VlciBrZXknKTtcclxuXHJcblx0YXNzZXJ0Lm9wdGlvbmFsT2JqZWN0KG9wdGlvbnMsICdvcHRpb25zJyk7XHJcblx0aWYgKG9wdGlvbnMgPT09IHVuZGVmaW5lZClcclxuXHRcdG9wdGlvbnMgPSB7fTtcclxuXHRhc3NlcnQub3B0aW9uYWxPYmplY3Qob3B0aW9ucy52YWxpZEZyb20sICdvcHRpb25zLnZhbGlkRnJvbScpO1xyXG5cdGFzc2VydC5vcHRpb25hbE9iamVjdChvcHRpb25zLnZhbGlkVW50aWwsICdvcHRpb25zLnZhbGlkVW50aWwnKTtcclxuXHR2YXIgdmFsaWRGcm9tID0gb3B0aW9ucy52YWxpZEZyb207XHJcblx0dmFyIHZhbGlkVW50aWwgPSBvcHRpb25zLnZhbGlkVW50aWw7XHJcblx0aWYgKHZhbGlkRnJvbSA9PT0gdW5kZWZpbmVkKVxyXG5cdFx0dmFsaWRGcm9tID0gbmV3IERhdGUoKTtcclxuXHRpZiAodmFsaWRVbnRpbCA9PT0gdW5kZWZpbmVkKSB7XHJcblx0XHRhc3NlcnQub3B0aW9uYWxOdW1iZXIob3B0aW9ucy5saWZldGltZSwgJ29wdGlvbnMubGlmZXRpbWUnKTtcclxuXHRcdHZhciBsaWZldGltZSA9IG9wdGlvbnMubGlmZXRpbWU7XHJcblx0XHRpZiAobGlmZXRpbWUgPT09IHVuZGVmaW5lZClcclxuXHRcdFx0bGlmZXRpbWUgPSAxMCozNjUqMjQqMzYwMDtcclxuXHRcdHZhbGlkVW50aWwgPSBuZXcgRGF0ZSgpO1xyXG5cdFx0dmFsaWRVbnRpbC5zZXRUaW1lKHZhbGlkVW50aWwuZ2V0VGltZSgpICsgbGlmZXRpbWUqMTAwMCk7XHJcblx0fVxyXG5cdGFzc2VydC5vcHRpb25hbEJ1ZmZlcihvcHRpb25zLnNlcmlhbCwgJ29wdGlvbnMuc2VyaWFsJyk7XHJcblx0dmFyIHNlcmlhbCA9IG9wdGlvbnMuc2VyaWFsO1xyXG5cdGlmIChzZXJpYWwgPT09IHVuZGVmaW5lZClcclxuXHRcdHNlcmlhbCA9IEJ1ZmZlci5mcm9tKCcwMDAwMDAwMDAwMDAwMDAxJywgJ2hleCcpO1xyXG5cclxuXHR2YXIgcHVycG9zZXMgPSBvcHRpb25zLnB1cnBvc2VzO1xyXG5cdGlmIChwdXJwb3NlcyA9PT0gdW5kZWZpbmVkKVxyXG5cdFx0cHVycG9zZXMgPSBbXTtcclxuXHJcblx0aWYgKHB1cnBvc2VzLmluZGV4T2YoJ3NpZ25hdHVyZScpID09PSAtMSlcclxuXHRcdHB1cnBvc2VzLnB1c2goJ3NpZ25hdHVyZScpO1xyXG5cclxuXHRpZiAob3B0aW9ucy5jYSA9PT0gdHJ1ZSkge1xyXG5cdFx0aWYgKHB1cnBvc2VzLmluZGV4T2YoJ2NhJykgPT09IC0xKVxyXG5cdFx0XHRwdXJwb3Nlcy5wdXNoKCdjYScpO1xyXG5cdFx0aWYgKHB1cnBvc2VzLmluZGV4T2YoJ2NybCcpID09PSAtMSlcclxuXHRcdFx0cHVycG9zZXMucHVzaCgnY3JsJyk7XHJcblx0fVxyXG5cclxuXHR2YXIgaG9zdFN1YmplY3RzID0gc3ViamVjdHMuZmlsdGVyKGZ1bmN0aW9uIChzdWJqZWN0KSB7XHJcblx0XHRyZXR1cm4gKHN1YmplY3QudHlwZSA9PT0gJ2hvc3QnKTtcclxuXHR9KTtcclxuXHR2YXIgdXNlclN1YmplY3RzID0gc3ViamVjdHMuZmlsdGVyKGZ1bmN0aW9uIChzdWJqZWN0KSB7XHJcblx0XHRyZXR1cm4gKHN1YmplY3QudHlwZSA9PT0gJ3VzZXInKTtcclxuXHR9KTtcclxuXHRpZiAoaG9zdFN1YmplY3RzLmxlbmd0aCA+IDApIHtcclxuXHRcdGlmIChwdXJwb3Nlcy5pbmRleE9mKCdzZXJ2ZXJBdXRoJykgPT09IC0xKVxyXG5cdFx0XHRwdXJwb3Nlcy5wdXNoKCdzZXJ2ZXJBdXRoJyk7XHJcblx0fVxyXG5cdGlmICh1c2VyU3ViamVjdHMubGVuZ3RoID4gMCkge1xyXG5cdFx0aWYgKHB1cnBvc2VzLmluZGV4T2YoJ2NsaWVudEF1dGgnKSA9PT0gLTEpXHJcblx0XHRcdHB1cnBvc2VzLnB1c2goJ2NsaWVudEF1dGgnKTtcclxuXHR9XHJcblx0aWYgKHVzZXJTdWJqZWN0cy5sZW5ndGggPiAwIHx8IGhvc3RTdWJqZWN0cy5sZW5ndGggPiAwKSB7XHJcblx0XHRpZiAocHVycG9zZXMuaW5kZXhPZigna2V5QWdyZWVtZW50JykgPT09IC0xKVxyXG5cdFx0XHRwdXJwb3Nlcy5wdXNoKCdrZXlBZ3JlZW1lbnQnKTtcclxuXHRcdGlmIChrZXkudHlwZSA9PT0gJ3JzYScgJiZcclxuXHRcdCAgICBwdXJwb3Nlcy5pbmRleE9mKCdlbmNyeXB0aW9uJykgPT09IC0xKVxyXG5cdFx0XHRwdXJwb3Nlcy5wdXNoKCdlbmNyeXB0aW9uJyk7XHJcblx0fVxyXG5cclxuXHR2YXIgY2VydCA9IG5ldyBDZXJ0aWZpY2F0ZSh7XHJcblx0XHRzdWJqZWN0czogc3ViamVjdHMsXHJcblx0XHRpc3N1ZXI6IGlzc3VlcixcclxuXHRcdHN1YmplY3RLZXk6IGtleSxcclxuXHRcdGlzc3VlcktleTogaXNzdWVyS2V5LnRvUHVibGljKCksXHJcblx0XHRzaWduYXR1cmVzOiB7fSxcclxuXHRcdHNlcmlhbDogc2VyaWFsLFxyXG5cdFx0dmFsaWRGcm9tOiB2YWxpZEZyb20sXHJcblx0XHR2YWxpZFVudGlsOiB2YWxpZFVudGlsLFxyXG5cdFx0cHVycG9zZXM6IHB1cnBvc2VzXHJcblx0fSk7XHJcblx0Y2VydC5zaWduV2l0aChpc3N1ZXJLZXkpO1xyXG5cclxuXHRyZXR1cm4gKGNlcnQpO1xyXG59O1xyXG5cclxuQ2VydGlmaWNhdGUucGFyc2UgPSBmdW5jdGlvbiAoZGF0YSwgZm9ybWF0LCBvcHRpb25zKSB7XHJcblx0aWYgKHR5cGVvZiAoZGF0YSkgIT09ICdzdHJpbmcnKVxyXG5cdFx0YXNzZXJ0LmJ1ZmZlcihkYXRhLCAnZGF0YScpO1xyXG5cdGlmIChmb3JtYXQgPT09IHVuZGVmaW5lZClcclxuXHRcdGZvcm1hdCA9ICdhdXRvJztcclxuXHRhc3NlcnQuc3RyaW5nKGZvcm1hdCwgJ2Zvcm1hdCcpO1xyXG5cdGlmICh0eXBlb2YgKG9wdGlvbnMpID09PSAnc3RyaW5nJylcclxuXHRcdG9wdGlvbnMgPSB7IGZpbGVuYW1lOiBvcHRpb25zIH07XHJcblx0YXNzZXJ0Lm9wdGlvbmFsT2JqZWN0KG9wdGlvbnMsICdvcHRpb25zJyk7XHJcblx0aWYgKG9wdGlvbnMgPT09IHVuZGVmaW5lZClcclxuXHRcdG9wdGlvbnMgPSB7fTtcclxuXHRhc3NlcnQub3B0aW9uYWxTdHJpbmcob3B0aW9ucy5maWxlbmFtZSwgJ29wdGlvbnMuZmlsZW5hbWUnKTtcclxuXHRpZiAob3B0aW9ucy5maWxlbmFtZSA9PT0gdW5kZWZpbmVkKVxyXG5cdFx0b3B0aW9ucy5maWxlbmFtZSA9ICcodW5uYW1lZCknO1xyXG5cclxuXHRhc3NlcnQub2JqZWN0KGZvcm1hdHNbZm9ybWF0XSwgJ2Zvcm1hdHNbZm9ybWF0XScpO1xyXG5cclxuXHR0cnkge1xyXG5cdFx0dmFyIGsgPSBmb3JtYXRzW2Zvcm1hdF0ucmVhZChkYXRhLCBvcHRpb25zKTtcclxuXHRcdHJldHVybiAoayk7XHJcblx0fSBjYXRjaCAoZSkge1xyXG5cdFx0dGhyb3cgKG5ldyBDZXJ0aWZpY2F0ZVBhcnNlRXJyb3Iob3B0aW9ucy5maWxlbmFtZSwgZm9ybWF0LCBlKSk7XHJcblx0fVxyXG59O1xyXG5cclxuQ2VydGlmaWNhdGUuaXNDZXJ0aWZpY2F0ZSA9IGZ1bmN0aW9uIChvYmosIHZlcikge1xyXG5cdHJldHVybiAodXRpbHMuaXNDb21wYXRpYmxlKG9iaiwgQ2VydGlmaWNhdGUsIHZlcikpO1xyXG59O1xyXG5cclxuLypcclxuICogQVBJIHZlcnNpb25zIGZvciBDZXJ0aWZpY2F0ZTpcclxuICogWzEsMF0gLS0gaW5pdGlhbCB2ZXJcclxuICogWzEsMV0gLS0gb3BlbnNzaCBmb3JtYXQgbm93IHVucGFja3MgZXh0ZW5zaW9uc1xyXG4gKi9cclxuQ2VydGlmaWNhdGUucHJvdG90eXBlLl9zc2hwa0FwaVZlcnNpb24gPSBbMSwgMV07XHJcblxyXG5DZXJ0aWZpY2F0ZS5fb2xkVmVyc2lvbkRldGVjdCA9IGZ1bmN0aW9uIChvYmopIHtcclxuXHRyZXR1cm4gKFsxLCAwXSk7XHJcbn07XHJcbiIsIi8vIENvcHlyaWdodCAyMDE4IEpveWVudCwgSW5jLlxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBLZXk7XHJcblxyXG52YXIgYXNzZXJ0ID0gcmVxdWlyZSgnYXNzZXJ0LXBsdXMnKTtcclxudmFyIGFsZ3MgPSByZXF1aXJlKCcuL2FsZ3MnKTtcclxudmFyIGNyeXB0byA9IHJlcXVpcmUoJ2NyeXB0bycpO1xyXG52YXIgRmluZ2VycHJpbnQgPSByZXF1aXJlKCcuL2ZpbmdlcnByaW50Jyk7XHJcbnZhciBTaWduYXR1cmUgPSByZXF1aXJlKCcuL3NpZ25hdHVyZScpO1xyXG52YXIgRGlmZmllSGVsbG1hbiA9IHJlcXVpcmUoJy4vZGhlJykuRGlmZmllSGVsbG1hbjtcclxudmFyIGVycnMgPSByZXF1aXJlKCcuL2Vycm9ycycpO1xyXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XHJcbnZhciBQcml2YXRlS2V5ID0gcmVxdWlyZSgnLi9wcml2YXRlLWtleScpO1xyXG52YXIgZWRDb21wYXQ7XHJcblxyXG50cnkge1xyXG5cdGVkQ29tcGF0ID0gcmVxdWlyZSgnLi9lZC1jb21wYXQnKTtcclxufSBjYXRjaCAoZSkge1xyXG5cdC8qIEp1c3QgY29udGludWUgdGhyb3VnaCwgYW5kIGJhaWwgb3V0IGlmIHdlIHRyeSB0byB1c2UgaXQuICovXHJcbn1cclxuXHJcbnZhciBJbnZhbGlkQWxnb3JpdGhtRXJyb3IgPSBlcnJzLkludmFsaWRBbGdvcml0aG1FcnJvcjtcclxudmFyIEtleVBhcnNlRXJyb3IgPSBlcnJzLktleVBhcnNlRXJyb3I7XHJcblxyXG52YXIgZm9ybWF0cyA9IHt9O1xyXG5mb3JtYXRzWydhdXRvJ10gPSByZXF1aXJlKCcuL2Zvcm1hdHMvYXV0bycpO1xyXG5mb3JtYXRzWydwZW0nXSA9IHJlcXVpcmUoJy4vZm9ybWF0cy9wZW0nKTtcclxuZm9ybWF0c1sncGtjczEnXSA9IHJlcXVpcmUoJy4vZm9ybWF0cy9wa2NzMScpO1xyXG5mb3JtYXRzWydwa2NzOCddID0gcmVxdWlyZSgnLi9mb3JtYXRzL3BrY3M4Jyk7XHJcbmZvcm1hdHNbJ3JmYzQyNTMnXSA9IHJlcXVpcmUoJy4vZm9ybWF0cy9yZmM0MjUzJyk7XHJcbmZvcm1hdHNbJ3NzaCddID0gcmVxdWlyZSgnLi9mb3JtYXRzL3NzaCcpO1xyXG5mb3JtYXRzWydzc2gtcHJpdmF0ZSddID0gcmVxdWlyZSgnLi9mb3JtYXRzL3NzaC1wcml2YXRlJyk7XHJcbmZvcm1hdHNbJ29wZW5zc2gnXSA9IGZvcm1hdHNbJ3NzaC1wcml2YXRlJ107XHJcbmZvcm1hdHNbJ2Ruc3NlYyddID0gcmVxdWlyZSgnLi9mb3JtYXRzL2Ruc3NlYycpO1xyXG5mb3JtYXRzWydwdXR0eSddID0gcmVxdWlyZSgnLi9mb3JtYXRzL3B1dHR5Jyk7XHJcbmZvcm1hdHNbJ3BwayddID0gZm9ybWF0c1sncHV0dHknXTtcclxuXHJcbmZ1bmN0aW9uIEtleShvcHRzKSB7XHJcblx0YXNzZXJ0Lm9iamVjdChvcHRzLCAnb3B0aW9ucycpO1xyXG5cdGFzc2VydC5hcnJheU9mT2JqZWN0KG9wdHMucGFydHMsICdvcHRpb25zLnBhcnRzJyk7XHJcblx0YXNzZXJ0LnN0cmluZyhvcHRzLnR5cGUsICdvcHRpb25zLnR5cGUnKTtcclxuXHRhc3NlcnQub3B0aW9uYWxTdHJpbmcob3B0cy5jb21tZW50LCAnb3B0aW9ucy5jb21tZW50Jyk7XHJcblxyXG5cdHZhciBhbGdJbmZvID0gYWxncy5pbmZvW29wdHMudHlwZV07XHJcblx0aWYgKHR5cGVvZiAoYWxnSW5mbykgIT09ICdvYmplY3QnKVxyXG5cdFx0dGhyb3cgKG5ldyBJbnZhbGlkQWxnb3JpdGhtRXJyb3Iob3B0cy50eXBlKSk7XHJcblxyXG5cdHZhciBwYXJ0TG9va3VwID0ge307XHJcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBvcHRzLnBhcnRzLmxlbmd0aDsgKytpKSB7XHJcblx0XHR2YXIgcGFydCA9IG9wdHMucGFydHNbaV07XHJcblx0XHRwYXJ0TG9va3VwW3BhcnQubmFtZV0gPSBwYXJ0O1xyXG5cdH1cclxuXHJcblx0dGhpcy50eXBlID0gb3B0cy50eXBlO1xyXG5cdHRoaXMucGFydHMgPSBvcHRzLnBhcnRzO1xyXG5cdHRoaXMucGFydCA9IHBhcnRMb29rdXA7XHJcblx0dGhpcy5jb21tZW50ID0gdW5kZWZpbmVkO1xyXG5cdHRoaXMuc291cmNlID0gb3B0cy5zb3VyY2U7XHJcblxyXG5cdC8qIGZvciBzcGVlZGluZyB1cCBoYXNoaW5nL2ZpbmdlcnByaW50IG9wZXJhdGlvbnMgKi9cclxuXHR0aGlzLl9yZmM0MjUzQ2FjaGUgPSBvcHRzLl9yZmM0MjUzQ2FjaGU7XHJcblx0dGhpcy5faGFzaENhY2hlID0ge307XHJcblxyXG5cdHZhciBzejtcclxuXHR0aGlzLmN1cnZlID0gdW5kZWZpbmVkO1xyXG5cdGlmICh0aGlzLnR5cGUgPT09ICdlY2RzYScpIHtcclxuXHRcdHZhciBjdXJ2ZSA9IHRoaXMucGFydC5jdXJ2ZS5kYXRhLnRvU3RyaW5nKCk7XHJcblx0XHR0aGlzLmN1cnZlID0gY3VydmU7XHJcblx0XHRzeiA9IGFsZ3MuY3VydmVzW2N1cnZlXS5zaXplO1xyXG5cdH0gZWxzZSBpZiAodGhpcy50eXBlID09PSAnZWQyNTUxOScgfHwgdGhpcy50eXBlID09PSAnY3VydmUyNTUxOScpIHtcclxuXHRcdHN6ID0gMjU2O1xyXG5cdFx0dGhpcy5jdXJ2ZSA9ICdjdXJ2ZTI1NTE5JztcclxuXHR9IGVsc2Uge1xyXG5cdFx0dmFyIHN6UGFydCA9IHRoaXMucGFydFthbGdJbmZvLnNpemVQYXJ0XTtcclxuXHRcdHN6ID0gc3pQYXJ0LmRhdGEubGVuZ3RoO1xyXG5cdFx0c3ogPSBzeiAqIDggLSB1dGlscy5jb3VudFplcm9zKHN6UGFydC5kYXRhKTtcclxuXHR9XHJcblx0dGhpcy5zaXplID0gc3o7XHJcbn1cclxuXHJcbktleS5mb3JtYXRzID0gZm9ybWF0cztcclxuXHJcbktleS5wcm90b3R5cGUudG9CdWZmZXIgPSBmdW5jdGlvbiAoZm9ybWF0LCBvcHRpb25zKSB7XHJcblx0aWYgKGZvcm1hdCA9PT0gdW5kZWZpbmVkKVxyXG5cdFx0Zm9ybWF0ID0gJ3NzaCc7XHJcblx0YXNzZXJ0LnN0cmluZyhmb3JtYXQsICdmb3JtYXQnKTtcclxuXHRhc3NlcnQub2JqZWN0KGZvcm1hdHNbZm9ybWF0XSwgJ2Zvcm1hdHNbZm9ybWF0XScpO1xyXG5cdGFzc2VydC5vcHRpb25hbE9iamVjdChvcHRpb25zLCAnb3B0aW9ucycpO1xyXG5cclxuXHRpZiAoZm9ybWF0ID09PSAncmZjNDI1MycpIHtcclxuXHRcdGlmICh0aGlzLl9yZmM0MjUzQ2FjaGUgPT09IHVuZGVmaW5lZClcclxuXHRcdFx0dGhpcy5fcmZjNDI1M0NhY2hlID0gZm9ybWF0c1sncmZjNDI1MyddLndyaXRlKHRoaXMpO1xyXG5cdFx0cmV0dXJuICh0aGlzLl9yZmM0MjUzQ2FjaGUpO1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIChmb3JtYXRzW2Zvcm1hdF0ud3JpdGUodGhpcywgb3B0aW9ucykpO1xyXG59O1xyXG5cclxuS2V5LnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uIChmb3JtYXQsIG9wdGlvbnMpIHtcclxuXHRyZXR1cm4gKHRoaXMudG9CdWZmZXIoZm9ybWF0LCBvcHRpb25zKS50b1N0cmluZygpKTtcclxufTtcclxuXHJcbktleS5wcm90b3R5cGUuaGFzaCA9IGZ1bmN0aW9uIChhbGdvLCB0eXBlKSB7XHJcblx0YXNzZXJ0LnN0cmluZyhhbGdvLCAnYWxnb3JpdGhtJyk7XHJcblx0YXNzZXJ0Lm9wdGlvbmFsU3RyaW5nKHR5cGUsICd0eXBlJyk7XHJcblx0aWYgKHR5cGUgPT09IHVuZGVmaW5lZClcclxuXHRcdHR5cGUgPSAnc3NoJztcclxuXHRhbGdvID0gYWxnby50b0xvd2VyQ2FzZSgpO1xyXG5cdGlmIChhbGdzLmhhc2hBbGdzW2FsZ29dID09PSB1bmRlZmluZWQpXHJcblx0XHR0aHJvdyAobmV3IEludmFsaWRBbGdvcml0aG1FcnJvcihhbGdvKSk7XHJcblxyXG5cdHZhciBjYWNoZUtleSA9IGFsZ28gKyAnfHwnICsgdHlwZTtcclxuXHRpZiAodGhpcy5faGFzaENhY2hlW2NhY2hlS2V5XSlcclxuXHRcdHJldHVybiAodGhpcy5faGFzaENhY2hlW2NhY2hlS2V5XSk7XHJcblxyXG5cdHZhciBidWY7XHJcblx0aWYgKHR5cGUgPT09ICdzc2gnKSB7XHJcblx0XHRidWYgPSB0aGlzLnRvQnVmZmVyKCdyZmM0MjUzJyk7XHJcblx0fSBlbHNlIGlmICh0eXBlID09PSAnc3BraScpIHtcclxuXHRcdGJ1ZiA9IGZvcm1hdHMucGtjczgucGtjczhUb0J1ZmZlcih0aGlzKTtcclxuXHR9IGVsc2Uge1xyXG5cdFx0dGhyb3cgKG5ldyBFcnJvcignSGFzaCB0eXBlICcgKyB0eXBlICsgJyBub3Qgc3VwcG9ydGVkJykpO1xyXG5cdH1cclxuXHR2YXIgaGFzaCA9IGNyeXB0by5jcmVhdGVIYXNoKGFsZ28pLnVwZGF0ZShidWYpLmRpZ2VzdCgpO1xyXG5cdHRoaXMuX2hhc2hDYWNoZVtjYWNoZUtleV0gPSBoYXNoO1xyXG5cdHJldHVybiAoaGFzaCk7XHJcbn07XHJcblxyXG5LZXkucHJvdG90eXBlLmZpbmdlcnByaW50ID0gZnVuY3Rpb24gKGFsZ28sIHR5cGUpIHtcclxuXHRpZiAoYWxnbyA9PT0gdW5kZWZpbmVkKVxyXG5cdFx0YWxnbyA9ICdzaGEyNTYnO1xyXG5cdGlmICh0eXBlID09PSB1bmRlZmluZWQpXHJcblx0XHR0eXBlID0gJ3NzaCc7XHJcblx0YXNzZXJ0LnN0cmluZyhhbGdvLCAnYWxnb3JpdGhtJyk7XHJcblx0YXNzZXJ0LnN0cmluZyh0eXBlLCAndHlwZScpO1xyXG5cdHZhciBvcHRzID0ge1xyXG5cdFx0dHlwZTogJ2tleScsXHJcblx0XHRoYXNoOiB0aGlzLmhhc2goYWxnbywgdHlwZSksXHJcblx0XHRhbGdvcml0aG06IGFsZ28sXHJcblx0XHRoYXNoVHlwZTogdHlwZVxyXG5cdH07XHJcblx0cmV0dXJuIChuZXcgRmluZ2VycHJpbnQob3B0cykpO1xyXG59O1xyXG5cclxuS2V5LnByb3RvdHlwZS5kZWZhdWx0SGFzaEFsZ29yaXRobSA9IGZ1bmN0aW9uICgpIHtcclxuXHR2YXIgaGFzaEFsZ28gPSAnc2hhMSc7XHJcblx0aWYgKHRoaXMudHlwZSA9PT0gJ3JzYScpXHJcblx0XHRoYXNoQWxnbyA9ICdzaGEyNTYnO1xyXG5cdGlmICh0aGlzLnR5cGUgPT09ICdkc2EnICYmIHRoaXMuc2l6ZSA+IDEwMjQpXHJcblx0XHRoYXNoQWxnbyA9ICdzaGEyNTYnO1xyXG5cdGlmICh0aGlzLnR5cGUgPT09ICdlZDI1NTE5JylcclxuXHRcdGhhc2hBbGdvID0gJ3NoYTUxMic7XHJcblx0aWYgKHRoaXMudHlwZSA9PT0gJ2VjZHNhJykge1xyXG5cdFx0aWYgKHRoaXMuc2l6ZSA8PSAyNTYpXHJcblx0XHRcdGhhc2hBbGdvID0gJ3NoYTI1Nic7XHJcblx0XHRlbHNlIGlmICh0aGlzLnNpemUgPD0gMzg0KVxyXG5cdFx0XHRoYXNoQWxnbyA9ICdzaGEzODQnO1xyXG5cdFx0ZWxzZVxyXG5cdFx0XHRoYXNoQWxnbyA9ICdzaGE1MTInO1xyXG5cdH1cclxuXHRyZXR1cm4gKGhhc2hBbGdvKTtcclxufTtcclxuXHJcbktleS5wcm90b3R5cGUuY3JlYXRlVmVyaWZ5ID0gZnVuY3Rpb24gKGhhc2hBbGdvKSB7XHJcblx0aWYgKGhhc2hBbGdvID09PSB1bmRlZmluZWQpXHJcblx0XHRoYXNoQWxnbyA9IHRoaXMuZGVmYXVsdEhhc2hBbGdvcml0aG0oKTtcclxuXHRhc3NlcnQuc3RyaW5nKGhhc2hBbGdvLCAnaGFzaCBhbGdvcml0aG0nKTtcclxuXHJcblx0LyogRUQyNTUxOSBpcyBub3Qgc3VwcG9ydGVkIGJ5IE9wZW5TU0wsIHVzZSBhIGphdmFzY3JpcHQgaW1wbC4gKi9cclxuXHRpZiAodGhpcy50eXBlID09PSAnZWQyNTUxOScgJiYgZWRDb21wYXQgIT09IHVuZGVmaW5lZClcclxuXHRcdHJldHVybiAobmV3IGVkQ29tcGF0LlZlcmlmaWVyKHRoaXMsIGhhc2hBbGdvKSk7XHJcblx0aWYgKHRoaXMudHlwZSA9PT0gJ2N1cnZlMjU1MTknKVxyXG5cdFx0dGhyb3cgKG5ldyBFcnJvcignQ3VydmUyNTUxOSBrZXlzIGFyZSBub3Qgc3VpdGFibGUgZm9yICcgK1xyXG5cdFx0ICAgICdzaWduaW5nIG9yIHZlcmlmaWNhdGlvbicpKTtcclxuXHJcblx0dmFyIHYsIG5tLCBlcnI7XHJcblx0dHJ5IHtcclxuXHRcdG5tID0gaGFzaEFsZ28udG9VcHBlckNhc2UoKTtcclxuXHRcdHYgPSBjcnlwdG8uY3JlYXRlVmVyaWZ5KG5tKTtcclxuXHR9IGNhdGNoIChlKSB7XHJcblx0XHRlcnIgPSBlO1xyXG5cdH1cclxuXHRpZiAodiA9PT0gdW5kZWZpbmVkIHx8IChlcnIgaW5zdGFuY2VvZiBFcnJvciAmJlxyXG5cdCAgICBlcnIubWVzc2FnZS5tYXRjaCgvVW5rbm93biBtZXNzYWdlIGRpZ2VzdC8pKSkge1xyXG5cdFx0bm0gPSAnUlNBLSc7XHJcblx0XHRubSArPSBoYXNoQWxnby50b1VwcGVyQ2FzZSgpO1xyXG5cdFx0diA9IGNyeXB0by5jcmVhdGVWZXJpZnkobm0pO1xyXG5cdH1cclxuXHRhc3NlcnQub2sodiwgJ2ZhaWxlZCB0byBjcmVhdGUgdmVyaWZpZXInKTtcclxuXHR2YXIgb2xkVmVyaWZ5ID0gdi52ZXJpZnkuYmluZCh2KTtcclxuXHR2YXIga2V5ID0gdGhpcy50b0J1ZmZlcigncGtjczgnKTtcclxuXHR2YXIgY3VydmUgPSB0aGlzLmN1cnZlO1xyXG5cdHZhciBzZWxmID0gdGhpcztcclxuXHR2LnZlcmlmeSA9IGZ1bmN0aW9uIChzaWduYXR1cmUsIGZtdCkge1xyXG5cdFx0aWYgKFNpZ25hdHVyZS5pc1NpZ25hdHVyZShzaWduYXR1cmUsIFsyLCAwXSkpIHtcclxuXHRcdFx0aWYgKHNpZ25hdHVyZS50eXBlICE9PSBzZWxmLnR5cGUpXHJcblx0XHRcdFx0cmV0dXJuIChmYWxzZSk7XHJcblx0XHRcdGlmIChzaWduYXR1cmUuaGFzaEFsZ29yaXRobSAmJlxyXG5cdFx0XHQgICAgc2lnbmF0dXJlLmhhc2hBbGdvcml0aG0gIT09IGhhc2hBbGdvKVxyXG5cdFx0XHRcdHJldHVybiAoZmFsc2UpO1xyXG5cdFx0XHRpZiAoc2lnbmF0dXJlLmN1cnZlICYmIHNlbGYudHlwZSA9PT0gJ2VjZHNhJyAmJlxyXG5cdFx0XHQgICAgc2lnbmF0dXJlLmN1cnZlICE9PSBjdXJ2ZSlcclxuXHRcdFx0XHRyZXR1cm4gKGZhbHNlKTtcclxuXHRcdFx0cmV0dXJuIChvbGRWZXJpZnkoa2V5LCBzaWduYXR1cmUudG9CdWZmZXIoJ2FzbjEnKSkpO1xyXG5cclxuXHRcdH0gZWxzZSBpZiAodHlwZW9mIChzaWduYXR1cmUpID09PSAnc3RyaW5nJyB8fFxyXG5cdFx0ICAgIEJ1ZmZlci5pc0J1ZmZlcihzaWduYXR1cmUpKSB7XHJcblx0XHRcdHJldHVybiAob2xkVmVyaWZ5KGtleSwgc2lnbmF0dXJlLCBmbXQpKTtcclxuXHJcblx0XHQvKlxyXG5cdFx0ICogQXZvaWQgZG9pbmcgdGhpcyBvbiB2YWxpZCBhcmd1bWVudHMsIHdhbGtpbmcgdGhlIHByb3RvdHlwZVxyXG5cdFx0ICogY2hhaW4gY2FuIGJlIHF1aXRlIHNsb3cuXHJcblx0XHQgKi9cclxuXHRcdH0gZWxzZSBpZiAoU2lnbmF0dXJlLmlzU2lnbmF0dXJlKHNpZ25hdHVyZSwgWzEsIDBdKSkge1xyXG5cdFx0XHR0aHJvdyAobmV3IEVycm9yKCdzaWduYXR1cmUgd2FzIGNyZWF0ZWQgYnkgdG9vIG9sZCAnICtcclxuXHRcdFx0ICAgICdhIHZlcnNpb24gb2Ygc3NocGsgYW5kIGNhbm5vdCBiZSB2ZXJpZmllZCcpKTtcclxuXHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0aHJvdyAobmV3IFR5cGVFcnJvcignc2lnbmF0dXJlIG11c3QgYmUgYSBzdHJpbmcsICcgK1xyXG5cdFx0XHQgICAgJ0J1ZmZlciwgb3IgU2lnbmF0dXJlIG9iamVjdCcpKTtcclxuXHRcdH1cclxuXHR9O1xyXG5cdHJldHVybiAodik7XHJcbn07XHJcblxyXG5LZXkucHJvdG90eXBlLmNyZWF0ZURpZmZpZUhlbGxtYW4gPSBmdW5jdGlvbiAoKSB7XHJcblx0aWYgKHRoaXMudHlwZSA9PT0gJ3JzYScpXHJcblx0XHR0aHJvdyAobmV3IEVycm9yKCdSU0Ega2V5cyBkbyBub3Qgc3VwcG9ydCBEaWZmaWUtSGVsbG1hbicpKTtcclxuXHJcblx0cmV0dXJuIChuZXcgRGlmZmllSGVsbG1hbih0aGlzKSk7XHJcbn07XHJcbktleS5wcm90b3R5cGUuY3JlYXRlREggPSBLZXkucHJvdG90eXBlLmNyZWF0ZURpZmZpZUhlbGxtYW47XHJcblxyXG5LZXkucGFyc2UgPSBmdW5jdGlvbiAoZGF0YSwgZm9ybWF0LCBvcHRpb25zKSB7XHJcblx0aWYgKHR5cGVvZiAoZGF0YSkgIT09ICdzdHJpbmcnKVxyXG5cdFx0YXNzZXJ0LmJ1ZmZlcihkYXRhLCAnZGF0YScpO1xyXG5cdGlmIChmb3JtYXQgPT09IHVuZGVmaW5lZClcclxuXHRcdGZvcm1hdCA9ICdhdXRvJztcclxuXHRhc3NlcnQuc3RyaW5nKGZvcm1hdCwgJ2Zvcm1hdCcpO1xyXG5cdGlmICh0eXBlb2YgKG9wdGlvbnMpID09PSAnc3RyaW5nJylcclxuXHRcdG9wdGlvbnMgPSB7IGZpbGVuYW1lOiBvcHRpb25zIH07XHJcblx0YXNzZXJ0Lm9wdGlvbmFsT2JqZWN0KG9wdGlvbnMsICdvcHRpb25zJyk7XHJcblx0aWYgKG9wdGlvbnMgPT09IHVuZGVmaW5lZClcclxuXHRcdG9wdGlvbnMgPSB7fTtcclxuXHRhc3NlcnQub3B0aW9uYWxTdHJpbmcob3B0aW9ucy5maWxlbmFtZSwgJ29wdGlvbnMuZmlsZW5hbWUnKTtcclxuXHRpZiAob3B0aW9ucy5maWxlbmFtZSA9PT0gdW5kZWZpbmVkKVxyXG5cdFx0b3B0aW9ucy5maWxlbmFtZSA9ICcodW5uYW1lZCknO1xyXG5cclxuXHRhc3NlcnQub2JqZWN0KGZvcm1hdHNbZm9ybWF0XSwgJ2Zvcm1hdHNbZm9ybWF0XScpO1xyXG5cclxuXHR0cnkge1xyXG5cdFx0dmFyIGsgPSBmb3JtYXRzW2Zvcm1hdF0ucmVhZChkYXRhLCBvcHRpb25zKTtcclxuXHRcdGlmIChrIGluc3RhbmNlb2YgUHJpdmF0ZUtleSlcclxuXHRcdFx0ayA9IGsudG9QdWJsaWMoKTtcclxuXHRcdGlmICghay5jb21tZW50KVxyXG5cdFx0XHRrLmNvbW1lbnQgPSBvcHRpb25zLmZpbGVuYW1lO1xyXG5cdFx0cmV0dXJuIChrKTtcclxuXHR9IGNhdGNoIChlKSB7XHJcblx0XHRpZiAoZS5uYW1lID09PSAnS2V5RW5jcnlwdGVkRXJyb3InKVxyXG5cdFx0XHR0aHJvdyAoZSk7XHJcblx0XHR0aHJvdyAobmV3IEtleVBhcnNlRXJyb3Iob3B0aW9ucy5maWxlbmFtZSwgZm9ybWF0LCBlKSk7XHJcblx0fVxyXG59O1xyXG5cclxuS2V5LmlzS2V5ID0gZnVuY3Rpb24gKG9iaiwgdmVyKSB7XHJcblx0cmV0dXJuICh1dGlscy5pc0NvbXBhdGlibGUob2JqLCBLZXksIHZlcikpO1xyXG59O1xyXG5cclxuLypcclxuICogQVBJIHZlcnNpb25zIGZvciBLZXk6XHJcbiAqIFsxLDBdIC0tIGluaXRpYWwgdmVyLCBtYXkgdGFrZSBTaWduYXR1cmUgZm9yIGNyZWF0ZVZlcmlmeSBvciBtYXkgbm90XHJcbiAqIFsxLDFdIC0tIGFkZGVkIHBrY3MxLCBwa2NzOCBmb3JtYXRzXHJcbiAqIFsxLDJdIC0tIGFkZGVkIGF1dG8sIHNzaC1wcml2YXRlLCBvcGVuc3NoIGZvcm1hdHNcclxuICogWzEsM10gLS0gYWRkZWQgZGVmYXVsdEhhc2hBbGdvcml0aG1cclxuICogWzEsNF0gLS0gYWRkZWQgZWQgc3VwcG9ydCwgY3JlYXRlREhcclxuICogWzEsNV0gLS0gZmlyc3QgZXhwbGljaXRseSB0YWdnZWQgdmVyc2lvblxyXG4gKiBbMSw2XSAtLSBjaGFuZ2VkIGVkMjU1MTkgcGFydCBuYW1lc1xyXG4gKiBbMSw3XSAtLSBzcGtpIGhhc2ggdHlwZXNcclxuICovXHJcbktleS5wcm90b3R5cGUuX3NzaHBrQXBpVmVyc2lvbiA9IFsxLCA3XTtcclxuXHJcbktleS5fb2xkVmVyc2lvbkRldGVjdCA9IGZ1bmN0aW9uIChvYmopIHtcclxuXHRhc3NlcnQuZnVuYyhvYmoudG9CdWZmZXIpO1xyXG5cdGFzc2VydC5mdW5jKG9iai5maW5nZXJwcmludCk7XHJcblx0aWYgKG9iai5jcmVhdGVESClcclxuXHRcdHJldHVybiAoWzEsIDRdKTtcclxuXHRpZiAob2JqLmRlZmF1bHRIYXNoQWxnb3JpdGhtKVxyXG5cdFx0cmV0dXJuIChbMSwgM10pO1xyXG5cdGlmIChvYmouZm9ybWF0c1snYXV0byddKVxyXG5cdFx0cmV0dXJuIChbMSwgMl0pO1xyXG5cdGlmIChvYmouZm9ybWF0c1sncGtjczEnXSlcclxuXHRcdHJldHVybiAoWzEsIDFdKTtcclxuXHRyZXR1cm4gKFsxLCAwXSk7XHJcbn07XHJcbiIsIi8vIENvcHlyaWdodCAyMDE1IEpveWVudCwgSW5jLlxyXG5cclxudmFyIEJ1ZmZlciA9IHJlcXVpcmUoJ3NhZmVyLWJ1ZmZlcicpLkJ1ZmZlcjtcclxuXHJcbnZhciBhbGdJbmZvID0ge1xyXG5cdCdkc2EnOiB7XHJcblx0XHRwYXJ0czogWydwJywgJ3EnLCAnZycsICd5J10sXHJcblx0XHRzaXplUGFydDogJ3AnXHJcblx0fSxcclxuXHQncnNhJzoge1xyXG5cdFx0cGFydHM6IFsnZScsICduJ10sXHJcblx0XHRzaXplUGFydDogJ24nXHJcblx0fSxcclxuXHQnZWNkc2EnOiB7XHJcblx0XHRwYXJ0czogWydjdXJ2ZScsICdRJ10sXHJcblx0XHRzaXplUGFydDogJ1EnXHJcblx0fSxcclxuXHQnZWQyNTUxOSc6IHtcclxuXHRcdHBhcnRzOiBbJ0EnXSxcclxuXHRcdHNpemVQYXJ0OiAnQSdcclxuXHR9XHJcbn07XHJcbmFsZ0luZm9bJ2N1cnZlMjU1MTknXSA9IGFsZ0luZm9bJ2VkMjU1MTknXTtcclxuXHJcbnZhciBhbGdQcml2SW5mbyA9IHtcclxuXHQnZHNhJzoge1xyXG5cdFx0cGFydHM6IFsncCcsICdxJywgJ2cnLCAneScsICd4J11cclxuXHR9LFxyXG5cdCdyc2EnOiB7XHJcblx0XHRwYXJ0czogWyduJywgJ2UnLCAnZCcsICdpcW1wJywgJ3AnLCAncSddXHJcblx0fSxcclxuXHQnZWNkc2EnOiB7XHJcblx0XHRwYXJ0czogWydjdXJ2ZScsICdRJywgJ2QnXVxyXG5cdH0sXHJcblx0J2VkMjU1MTknOiB7XHJcblx0XHRwYXJ0czogWydBJywgJ2snXVxyXG5cdH1cclxufTtcclxuYWxnUHJpdkluZm9bJ2N1cnZlMjU1MTknXSA9IGFsZ1ByaXZJbmZvWydlZDI1NTE5J107XHJcblxyXG52YXIgaGFzaEFsZ3MgPSB7XHJcblx0J21kNSc6IHRydWUsXHJcblx0J3NoYTEnOiB0cnVlLFxyXG5cdCdzaGEyNTYnOiB0cnVlLFxyXG5cdCdzaGEzODQnOiB0cnVlLFxyXG5cdCdzaGE1MTInOiB0cnVlXHJcbn07XHJcblxyXG4vKlxyXG4gKiBUYWtlbiBmcm9tXHJcbiAqIGh0dHA6Ly9jc3JjLm5pc3QuZ292L2dyb3Vwcy9TVC90b29sa2l0L2RvY3VtZW50cy9kc3MvTklTVFJlQ3VyLnBkZlxyXG4gKi9cclxudmFyIGN1cnZlcyA9IHtcclxuXHQnbmlzdHAyNTYnOiB7XHJcblx0XHRzaXplOiAyNTYsXHJcblx0XHRwa2NzOG9pZDogJzEuMi44NDAuMTAwNDUuMy4xLjcnLFxyXG5cdFx0cDogQnVmZmVyLmZyb20oKCcwMCcgK1xyXG5cdFx0ICAgICdmZmZmZmZmZiAwMDAwMDAwMSAwMDAwMDAwMCAwMDAwMDAwMCcgK1xyXG5cdFx0ICAgICcwMDAwMDAwMCBmZmZmZmZmZiBmZmZmZmZmZiBmZmZmZmZmZicpLlxyXG5cdFx0ICAgIHJlcGxhY2UoLyAvZywgJycpLCAnaGV4JyksXHJcblx0XHRhOiBCdWZmZXIuZnJvbSgoJzAwJyArXHJcblx0XHQgICAgJ0ZGRkZGRkZGIDAwMDAwMDAxIDAwMDAwMDAwIDAwMDAwMDAwJyArXHJcblx0XHQgICAgJzAwMDAwMDAwIEZGRkZGRkZGIEZGRkZGRkZGIEZGRkZGRkZDJykuXHJcblx0XHQgICAgcmVwbGFjZSgvIC9nLCAnJyksICdoZXgnKSxcclxuXHRcdGI6IEJ1ZmZlci5mcm9tKChcclxuXHRcdCAgICAnNWFjNjM1ZDggYWEzYTkzZTcgYjNlYmJkNTUgNzY5ODg2YmMnICtcclxuXHRcdCAgICAnNjUxZDA2YjAgY2M1M2IwZjYgM2JjZTNjM2UgMjdkMjYwNGInKS5cclxuXHRcdCAgICByZXBsYWNlKC8gL2csICcnKSwgJ2hleCcpLFxyXG5cdFx0czogQnVmZmVyLmZyb20oKCcwMCcgK1xyXG5cdFx0ICAgICdjNDlkMzYwOCA4NmU3MDQ5MyA2YTY2NzhlMSAxMzlkMjZiNycgK1xyXG5cdFx0ICAgICc4MTlmN2U5MCcpLlxyXG5cdFx0ICAgIHJlcGxhY2UoLyAvZywgJycpLCAnaGV4JyksXHJcblx0XHRuOiBCdWZmZXIuZnJvbSgoJzAwJyArXHJcblx0XHQgICAgJ2ZmZmZmZmZmIDAwMDAwMDAwIGZmZmZmZmZmIGZmZmZmZmZmJyArXHJcblx0XHQgICAgJ2JjZTZmYWFkIGE3MTc5ZTg0IGYzYjljYWMyIGZjNjMyNTUxJykuXHJcblx0XHQgICAgcmVwbGFjZSgvIC9nLCAnJyksICdoZXgnKSxcclxuXHRcdEc6IEJ1ZmZlci5mcm9tKCgnMDQnICtcclxuXHRcdCAgICAnNmIxN2QxZjIgZTEyYzQyNDcgZjhiY2U2ZTUgNjNhNDQwZjInICtcclxuXHRcdCAgICAnNzcwMzdkODEgMmRlYjMzYTAgZjRhMTM5NDUgZDg5OGMyOTYnICtcclxuXHRcdCAgICAnNGZlMzQyZTIgZmUxYTdmOWIgOGVlN2ViNGEgN2MwZjllMTYnICtcclxuXHRcdCAgICAnMmJjZTMzNTcgNmIzMTVlY2UgY2JiNjQwNjggMzdiZjUxZjUnKS5cclxuXHRcdCAgICByZXBsYWNlKC8gL2csICcnKSwgJ2hleCcpXHJcblx0fSxcclxuXHQnbmlzdHAzODQnOiB7XHJcblx0XHRzaXplOiAzODQsXHJcblx0XHRwa2NzOG9pZDogJzEuMy4xMzIuMC4zNCcsXHJcblx0XHRwOiBCdWZmZXIuZnJvbSgoJzAwJyArXHJcblx0XHQgICAgJ2ZmZmZmZmZmIGZmZmZmZmZmIGZmZmZmZmZmIGZmZmZmZmZmJyArXHJcblx0XHQgICAgJ2ZmZmZmZmZmIGZmZmZmZmZmIGZmZmZmZmZmIGZmZmZmZmZlJyArXHJcblx0XHQgICAgJ2ZmZmZmZmZmIDAwMDAwMDAwIDAwMDAwMDAwIGZmZmZmZmZmJykuXHJcblx0XHQgICAgcmVwbGFjZSgvIC9nLCAnJyksICdoZXgnKSxcclxuXHRcdGE6IEJ1ZmZlci5mcm9tKCgnMDAnICtcclxuXHRcdCAgICAnRkZGRkZGRkYgRkZGRkZGRkYgRkZGRkZGRkYgRkZGRkZGRkYnICtcclxuXHRcdCAgICAnRkZGRkZGRkYgRkZGRkZGRkYgRkZGRkZGRkYgRkZGRkZGRkUnICtcclxuXHRcdCAgICAnRkZGRkZGRkYgMDAwMDAwMDAgMDAwMDAwMDAgRkZGRkZGRkMnKS5cclxuXHRcdCAgICByZXBsYWNlKC8gL2csICcnKSwgJ2hleCcpLFxyXG5cdFx0YjogQnVmZmVyLmZyb20oKFxyXG5cdFx0ICAgICdiMzMxMmZhNyBlMjNlZTdlNCA5ODhlMDU2YiBlM2Y4MmQxOScgK1xyXG5cdFx0ICAgICcxODFkOWM2ZSBmZTgxNDExMiAwMzE0MDg4ZiA1MDEzODc1YScgK1xyXG5cdFx0ICAgICdjNjU2Mzk4ZCA4YTJlZDE5ZCAyYTg1YzhlZCBkM2VjMmFlZicpLlxyXG5cdFx0ICAgIHJlcGxhY2UoLyAvZywgJycpLCAnaGV4JyksXHJcblx0XHRzOiBCdWZmZXIuZnJvbSgoJzAwJyArXHJcblx0XHQgICAgJ2EzMzU5MjZhIGEzMTlhMjdhIDFkMDA4OTZhIDY3NzNhNDgyJyArXHJcblx0XHQgICAgJzdhY2RhYzczJykuXHJcblx0XHQgICAgcmVwbGFjZSgvIC9nLCAnJyksICdoZXgnKSxcclxuXHRcdG46IEJ1ZmZlci5mcm9tKCgnMDAnICtcclxuXHRcdCAgICAnZmZmZmZmZmYgZmZmZmZmZmYgZmZmZmZmZmYgZmZmZmZmZmYnICtcclxuXHRcdCAgICAnZmZmZmZmZmYgZmZmZmZmZmYgYzc2MzRkODEgZjQzNzJkZGYnICtcclxuXHRcdCAgICAnNTgxYTBkYjIgNDhiMGE3N2EgZWNlYzE5NmEgY2NjNTI5NzMnKS5cclxuXHRcdCAgICByZXBsYWNlKC8gL2csICcnKSwgJ2hleCcpLFxyXG5cdFx0RzogQnVmZmVyLmZyb20oKCcwNCcgK1xyXG5cdFx0ICAgICdhYTg3Y2EyMiBiZThiMDUzNyA4ZWIxYzcxZSBmMzIwYWQ3NCcgK1xyXG5cdFx0ICAgICc2ZTFkM2I2MiA4YmE3OWI5OCA1OWY3NDFlMCA4MjU0MmEzOCcgK1xyXG5cdFx0ICAgICc1NTAyZjI1ZCBiZjU1Mjk2YyAzYTU0NWUzOCA3Mjc2MGFiNycgK1xyXG5cdFx0ICAgICczNjE3ZGU0YSA5NjI2MmM2ZiA1ZDllOThiZiA5MjkyZGMyOScgK1xyXG5cdFx0ICAgICdmOGY0MWRiZCAyODlhMTQ3YyBlOWRhMzExMyBiNWYwYjhjMCcgK1xyXG5cdFx0ICAgICcwYTYwYjFjZSAxZDdlODE5ZCA3YTQzMWQ3YyA5MGVhMGU1ZicpLlxyXG5cdFx0ICAgIHJlcGxhY2UoLyAvZywgJycpLCAnaGV4JylcclxuXHR9LFxyXG5cdCduaXN0cDUyMSc6IHtcclxuXHRcdHNpemU6IDUyMSxcclxuXHRcdHBrY3M4b2lkOiAnMS4zLjEzMi4wLjM1JyxcclxuXHRcdHA6IEJ1ZmZlci5mcm9tKChcclxuXHRcdCAgICAnMDFmZmZmZmYgZmZmZmZmZmYgZmZmZmZmZmYgZmZmZmZmZmYnICtcclxuXHRcdCAgICAnZmZmZmZmZmYgZmZmZmZmZmYgZmZmZmZmZmYgZmZmZmZmZmYnICtcclxuXHRcdCAgICAnZmZmZmZmZmYgZmZmZmZmZmYgZmZmZmZmZmYgZmZmZmZmZmYnICtcclxuXHRcdCAgICAnZmZmZmZmZmYgZmZmZmZmZmYgZmZmZmZmZmYgZmZmZmZmZmYnICtcclxuXHRcdCAgICAnZmZmZicpLnJlcGxhY2UoLyAvZywgJycpLCAnaGV4JyksXHJcblx0XHRhOiBCdWZmZXIuZnJvbSgoJzAxRkYnICtcclxuXHRcdCAgICAnRkZGRkZGRkYgRkZGRkZGRkYgRkZGRkZGRkYgRkZGRkZGRkYnICtcclxuXHRcdCAgICAnRkZGRkZGRkYgRkZGRkZGRkYgRkZGRkZGRkYgRkZGRkZGRkYnICtcclxuXHRcdCAgICAnRkZGRkZGRkYgRkZGRkZGRkYgRkZGRkZGRkYgRkZGRkZGRkYnICtcclxuXHRcdCAgICAnRkZGRkZGRkYgRkZGRkZGRkYgRkZGRkZGRkYgRkZGRkZGRkMnKS5cclxuXHRcdCAgICByZXBsYWNlKC8gL2csICcnKSwgJ2hleCcpLFxyXG5cdFx0YjogQnVmZmVyLmZyb20oKCc1MScgK1xyXG5cdFx0ICAgICc5NTNlYjk2MSA4ZTFjOWExZiA5MjlhMjFhMCBiNjg1NDBlZScgK1xyXG5cdFx0ICAgICdhMmRhNzI1YiA5OWIzMTVmMyBiOGI0ODk5MSA4ZWYxMDllMScgK1xyXG5cdFx0ICAgICc1NjE5Mzk1MSBlYzdlOTM3YiAxNjUyYzBiZCAzYmIxYmYwNycgK1xyXG5cdFx0ICAgICczNTczZGY4OCAzZDJjMzRmMSBlZjQ1MWZkNCA2YjUwM2YwMCcpLlxyXG5cdFx0ICAgIHJlcGxhY2UoLyAvZywgJycpLCAnaGV4JyksXHJcblx0XHRzOiBCdWZmZXIuZnJvbSgoJzAwJyArXHJcblx0XHQgICAgJ2QwOWU4ODAwIDI5MWNiODUzIDk2Y2M2NzE3IDM5MzI4NGFhJyArXHJcblx0XHQgICAgJ2EwZGE2NGJhJykucmVwbGFjZSgvIC9nLCAnJyksICdoZXgnKSxcclxuXHRcdG46IEJ1ZmZlci5mcm9tKCgnMDFmZicgK1xyXG5cdFx0ICAgICdmZmZmZmZmZiBmZmZmZmZmZiBmZmZmZmZmZiBmZmZmZmZmZicgK1xyXG5cdFx0ICAgICdmZmZmZmZmZiBmZmZmZmZmZiBmZmZmZmZmZiBmZmZmZmZmYScgK1xyXG5cdFx0ICAgICc1MTg2ODc4MyBiZjJmOTY2YiA3ZmNjMDE0OCBmNzA5YTVkMCcgK1xyXG5cdFx0ICAgICczYmI1YzliOCA4OTljNDdhZSBiYjZmYjcxZSA5MTM4NjQwOScpLlxyXG5cdFx0ICAgIHJlcGxhY2UoLyAvZywgJycpLCAnaGV4JyksXHJcblx0XHRHOiBCdWZmZXIuZnJvbSgoJzA0JyArXHJcblx0XHQgICAgJzAwYzYgODU4ZTA2YjcgMDQwNGU5Y2QgOWUzZWNiNjYgMjM5NWI0NDInICtcclxuXHRcdCAgICAgICAgICc5YzY0ODEzOSAwNTNmYjUyMSBmODI4YWY2MCA2YjRkM2RiYScgK1xyXG5cdFx0ICAgICAgICAgJ2ExNGI1ZTc3IGVmZTc1OTI4IGZlMWRjMTI3IGEyZmZhOGRlJyArXHJcblx0XHQgICAgICAgICAnMzM0OGIzYzEgODU2YTQyOWIgZjk3ZTdlMzEgYzJlNWJkNjYnICtcclxuXHRcdCAgICAnMDExOCAzOTI5NmE3OCA5YTNiYzAwNCA1YzhhNWZiNCAyYzdkMWJkOScgK1xyXG5cdFx0ICAgICAgICAgJzk4ZjU0NDQ5IDU3OWI0NDY4IDE3YWZiZDE3IDI3M2U2NjJjJyArXHJcblx0XHQgICAgICAgICAnOTdlZTcyOTkgNWVmNDI2NDAgYzU1MGI5MDEgM2ZhZDA3NjEnICtcclxuXHRcdCAgICAgICAgICczNTNjNzA4NiBhMjcyYzI0MCA4OGJlOTQ3NiA5ZmQxNjY1MCcpLlxyXG5cdFx0ICAgIHJlcGxhY2UoLyAvZywgJycpLCAnaGV4JylcclxuXHR9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuXHRpbmZvOiBhbGdJbmZvLFxyXG5cdHByaXZJbmZvOiBhbGdQcml2SW5mbyxcclxuXHRoYXNoQWxnczogaGFzaEFsZ3MsXHJcblx0Y3VydmVzOiBjdXJ2ZXNcclxufTtcclxuIiwiLy8gQ29weXJpZ2h0IDIwMTggSm95ZW50LCBJbmMuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEZpbmdlcnByaW50O1xyXG5cclxudmFyIGFzc2VydCA9IHJlcXVpcmUoJ2Fzc2VydC1wbHVzJyk7XHJcbnZhciBCdWZmZXIgPSByZXF1aXJlKCdzYWZlci1idWZmZXInKS5CdWZmZXI7XHJcbnZhciBhbGdzID0gcmVxdWlyZSgnLi9hbGdzJyk7XHJcbnZhciBjcnlwdG8gPSByZXF1aXJlKCdjcnlwdG8nKTtcclxudmFyIGVycnMgPSByZXF1aXJlKCcuL2Vycm9ycycpO1xyXG52YXIgS2V5ID0gcmVxdWlyZSgnLi9rZXknKTtcclxudmFyIFByaXZhdGVLZXkgPSByZXF1aXJlKCcuL3ByaXZhdGUta2V5Jyk7XHJcbnZhciBDZXJ0aWZpY2F0ZSA9IHJlcXVpcmUoJy4vY2VydGlmaWNhdGUnKTtcclxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xyXG5cclxudmFyIEZpbmdlcnByaW50Rm9ybWF0RXJyb3IgPSBlcnJzLkZpbmdlcnByaW50Rm9ybWF0RXJyb3I7XHJcbnZhciBJbnZhbGlkQWxnb3JpdGhtRXJyb3IgPSBlcnJzLkludmFsaWRBbGdvcml0aG1FcnJvcjtcclxuXHJcbmZ1bmN0aW9uIEZpbmdlcnByaW50KG9wdHMpIHtcclxuXHRhc3NlcnQub2JqZWN0KG9wdHMsICdvcHRpb25zJyk7XHJcblx0YXNzZXJ0LnN0cmluZyhvcHRzLnR5cGUsICdvcHRpb25zLnR5cGUnKTtcclxuXHRhc3NlcnQuYnVmZmVyKG9wdHMuaGFzaCwgJ29wdGlvbnMuaGFzaCcpO1xyXG5cdGFzc2VydC5zdHJpbmcob3B0cy5hbGdvcml0aG0sICdvcHRpb25zLmFsZ29yaXRobScpO1xyXG5cclxuXHR0aGlzLmFsZ29yaXRobSA9IG9wdHMuYWxnb3JpdGhtLnRvTG93ZXJDYXNlKCk7XHJcblx0aWYgKGFsZ3MuaGFzaEFsZ3NbdGhpcy5hbGdvcml0aG1dICE9PSB0cnVlKVxyXG5cdFx0dGhyb3cgKG5ldyBJbnZhbGlkQWxnb3JpdGhtRXJyb3IodGhpcy5hbGdvcml0aG0pKTtcclxuXHJcblx0dGhpcy5oYXNoID0gb3B0cy5oYXNoO1xyXG5cdHRoaXMudHlwZSA9IG9wdHMudHlwZTtcclxuXHR0aGlzLmhhc2hUeXBlID0gb3B0cy5oYXNoVHlwZTtcclxufVxyXG5cclxuRmluZ2VycHJpbnQucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gKGZvcm1hdCkge1xyXG5cdGlmIChmb3JtYXQgPT09IHVuZGVmaW5lZCkge1xyXG5cdFx0aWYgKHRoaXMuYWxnb3JpdGhtID09PSAnbWQ1JyB8fCB0aGlzLmhhc2hUeXBlID09PSAnc3BraScpXHJcblx0XHRcdGZvcm1hdCA9ICdoZXgnO1xyXG5cdFx0ZWxzZVxyXG5cdFx0XHRmb3JtYXQgPSAnYmFzZTY0JztcclxuXHR9XHJcblx0YXNzZXJ0LnN0cmluZyhmb3JtYXQpO1xyXG5cclxuXHRzd2l0Y2ggKGZvcm1hdCkge1xyXG5cdGNhc2UgJ2hleCc6XHJcblx0XHRpZiAodGhpcy5oYXNoVHlwZSA9PT0gJ3Nwa2knKVxyXG5cdFx0XHRyZXR1cm4gKHRoaXMuaGFzaC50b1N0cmluZygnaGV4JykpO1xyXG5cdFx0cmV0dXJuIChhZGRDb2xvbnModGhpcy5oYXNoLnRvU3RyaW5nKCdoZXgnKSkpO1xyXG5cdGNhc2UgJ2Jhc2U2NCc6XHJcblx0XHRpZiAodGhpcy5oYXNoVHlwZSA9PT0gJ3Nwa2knKVxyXG5cdFx0XHRyZXR1cm4gKHRoaXMuaGFzaC50b1N0cmluZygnYmFzZTY0JykpO1xyXG5cdFx0cmV0dXJuIChzc2hCYXNlNjRGb3JtYXQodGhpcy5hbGdvcml0aG0sXHJcblx0XHQgICAgdGhpcy5oYXNoLnRvU3RyaW5nKCdiYXNlNjQnKSkpO1xyXG5cdGRlZmF1bHQ6XHJcblx0XHR0aHJvdyAobmV3IEZpbmdlcnByaW50Rm9ybWF0RXJyb3IodW5kZWZpbmVkLCBmb3JtYXQpKTtcclxuXHR9XHJcbn07XHJcblxyXG5GaW5nZXJwcmludC5wcm90b3R5cGUubWF0Y2hlcyA9IGZ1bmN0aW9uIChvdGhlcikge1xyXG5cdGFzc2VydC5vYmplY3Qob3RoZXIsICdrZXkgb3IgY2VydGlmaWNhdGUnKTtcclxuXHRpZiAodGhpcy50eXBlID09PSAna2V5JyAmJiB0aGlzLmhhc2hUeXBlICE9PSAnc3NoJykge1xyXG5cdFx0dXRpbHMuYXNzZXJ0Q29tcGF0aWJsZShvdGhlciwgS2V5LCBbMSwgN10sICdrZXkgd2l0aCBzcGtpJyk7XHJcblx0XHRpZiAoUHJpdmF0ZUtleS5pc1ByaXZhdGVLZXkob3RoZXIpKSB7XHJcblx0XHRcdHV0aWxzLmFzc2VydENvbXBhdGlibGUob3RoZXIsIFByaXZhdGVLZXksIFsxLCA2XSxcclxuXHRcdFx0ICAgICdwcml2YXRla2V5IHdpdGggc3BraSBzdXBwb3J0Jyk7XHJcblx0XHR9XHJcblx0fSBlbHNlIGlmICh0aGlzLnR5cGUgPT09ICdrZXknKSB7XHJcblx0XHR1dGlscy5hc3NlcnRDb21wYXRpYmxlKG90aGVyLCBLZXksIFsxLCAwXSwgJ2tleScpO1xyXG5cdH0gZWxzZSB7XHJcblx0XHR1dGlscy5hc3NlcnRDb21wYXRpYmxlKG90aGVyLCBDZXJ0aWZpY2F0ZSwgWzEsIDBdLFxyXG5cdFx0ICAgICdjZXJ0aWZpY2F0ZScpO1xyXG5cdH1cclxuXHJcblx0dmFyIHRoZWlySGFzaCA9IG90aGVyLmhhc2godGhpcy5hbGdvcml0aG0sIHRoaXMuaGFzaFR5cGUpO1xyXG5cdHZhciB0aGVpckhhc2gyID0gY3J5cHRvLmNyZWF0ZUhhc2godGhpcy5hbGdvcml0aG0pLlxyXG5cdCAgICB1cGRhdGUodGhlaXJIYXNoKS5kaWdlc3QoJ2Jhc2U2NCcpO1xyXG5cclxuXHRpZiAodGhpcy5oYXNoMiA9PT0gdW5kZWZpbmVkKVxyXG5cdFx0dGhpcy5oYXNoMiA9IGNyeXB0by5jcmVhdGVIYXNoKHRoaXMuYWxnb3JpdGhtKS5cclxuXHRcdCAgICB1cGRhdGUodGhpcy5oYXNoKS5kaWdlc3QoJ2Jhc2U2NCcpO1xyXG5cclxuXHRyZXR1cm4gKHRoaXMuaGFzaDIgPT09IHRoZWlySGFzaDIpO1xyXG59O1xyXG5cclxuLypKU1NUWUxFRCovXHJcbnZhciBiYXNlNjRSRSA9IC9eW0EtWmEtejAtOStcXC89XSskLztcclxuLypKU1NUWUxFRCovXHJcbnZhciBoZXhSRSA9IC9eW2EtZkEtRjAtOV0rJC87XHJcblxyXG5GaW5nZXJwcmludC5wYXJzZSA9IGZ1bmN0aW9uIChmcCwgb3B0aW9ucykge1xyXG5cdGFzc2VydC5zdHJpbmcoZnAsICdmaW5nZXJwcmludCcpO1xyXG5cclxuXHR2YXIgYWxnLCBoYXNoLCBlbkFsZ3M7XHJcblx0aWYgKEFycmF5LmlzQXJyYXkob3B0aW9ucykpIHtcclxuXHRcdGVuQWxncyA9IG9wdGlvbnM7XHJcblx0XHRvcHRpb25zID0ge307XHJcblx0fVxyXG5cdGFzc2VydC5vcHRpb25hbE9iamVjdChvcHRpb25zLCAnb3B0aW9ucycpO1xyXG5cdGlmIChvcHRpb25zID09PSB1bmRlZmluZWQpXHJcblx0XHRvcHRpb25zID0ge307XHJcblx0aWYgKG9wdGlvbnMuZW5BbGdzICE9PSB1bmRlZmluZWQpXHJcblx0XHRlbkFsZ3MgPSBvcHRpb25zLmVuQWxncztcclxuXHRpZiAob3B0aW9ucy5hbGdvcml0aG1zICE9PSB1bmRlZmluZWQpXHJcblx0XHRlbkFsZ3MgPSBvcHRpb25zLmFsZ29yaXRobXM7XHJcblx0YXNzZXJ0Lm9wdGlvbmFsQXJyYXlPZlN0cmluZyhlbkFsZ3MsICdhbGdvcml0aG1zJyk7XHJcblxyXG5cdHZhciBoYXNoVHlwZSA9ICdzc2gnO1xyXG5cdGlmIChvcHRpb25zLmhhc2hUeXBlICE9PSB1bmRlZmluZWQpXHJcblx0XHRoYXNoVHlwZSA9IG9wdGlvbnMuaGFzaFR5cGU7XHJcblx0YXNzZXJ0LnN0cmluZyhoYXNoVHlwZSwgJ29wdGlvbnMuaGFzaFR5cGUnKTtcclxuXHJcblx0dmFyIHBhcnRzID0gZnAuc3BsaXQoJzonKTtcclxuXHRpZiAocGFydHMubGVuZ3RoID09IDIpIHtcclxuXHRcdGFsZyA9IHBhcnRzWzBdLnRvTG93ZXJDYXNlKCk7XHJcblx0XHRpZiAoIWJhc2U2NFJFLnRlc3QocGFydHNbMV0pKVxyXG5cdFx0XHR0aHJvdyAobmV3IEZpbmdlcnByaW50Rm9ybWF0RXJyb3IoZnApKTtcclxuXHRcdHRyeSB7XHJcblx0XHRcdGhhc2ggPSBCdWZmZXIuZnJvbShwYXJ0c1sxXSwgJ2Jhc2U2NCcpO1xyXG5cdFx0fSBjYXRjaCAoZSkge1xyXG5cdFx0XHR0aHJvdyAobmV3IEZpbmdlcnByaW50Rm9ybWF0RXJyb3IoZnApKTtcclxuXHRcdH1cclxuXHR9IGVsc2UgaWYgKHBhcnRzLmxlbmd0aCA+IDIpIHtcclxuXHRcdGFsZyA9ICdtZDUnO1xyXG5cdFx0aWYgKHBhcnRzWzBdLnRvTG93ZXJDYXNlKCkgPT09ICdtZDUnKVxyXG5cdFx0XHRwYXJ0cyA9IHBhcnRzLnNsaWNlKDEpO1xyXG5cdFx0cGFydHMgPSBwYXJ0cy5tYXAoZnVuY3Rpb24gKHApIHtcclxuXHRcdFx0d2hpbGUgKHAubGVuZ3RoIDwgMilcclxuXHRcdFx0XHRwID0gJzAnICsgcDtcclxuXHRcdFx0aWYgKHAubGVuZ3RoID4gMilcclxuXHRcdFx0XHR0aHJvdyAobmV3IEZpbmdlcnByaW50Rm9ybWF0RXJyb3IoZnApKTtcclxuXHRcdFx0cmV0dXJuIChwKTtcclxuXHRcdH0pO1xyXG5cdFx0cGFydHMgPSBwYXJ0cy5qb2luKCcnKTtcclxuXHRcdGlmICghaGV4UkUudGVzdChwYXJ0cykgfHwgcGFydHMubGVuZ3RoICUgMiAhPT0gMClcclxuXHRcdFx0dGhyb3cgKG5ldyBGaW5nZXJwcmludEZvcm1hdEVycm9yKGZwKSk7XHJcblx0XHR0cnkge1xyXG5cdFx0XHRoYXNoID0gQnVmZmVyLmZyb20ocGFydHMsICdoZXgnKTtcclxuXHRcdH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0dGhyb3cgKG5ldyBGaW5nZXJwcmludEZvcm1hdEVycm9yKGZwKSk7XHJcblx0XHR9XHJcblx0fSBlbHNlIHtcclxuXHRcdGlmIChoZXhSRS50ZXN0KGZwKSkge1xyXG5cdFx0XHRoYXNoID0gQnVmZmVyLmZyb20oZnAsICdoZXgnKTtcclxuXHRcdH0gZWxzZSBpZiAoYmFzZTY0UkUudGVzdChmcCkpIHtcclxuXHRcdFx0aGFzaCA9IEJ1ZmZlci5mcm9tKGZwLCAnYmFzZTY0Jyk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0aHJvdyAobmV3IEZpbmdlcnByaW50Rm9ybWF0RXJyb3IoZnApKTtcclxuXHRcdH1cclxuXHJcblx0XHRzd2l0Y2ggKGhhc2gubGVuZ3RoKSB7XHJcblx0XHRjYXNlIDMyOlxyXG5cdFx0XHRhbGcgPSAnc2hhMjU2JztcclxuXHRcdFx0YnJlYWs7XHJcblx0XHRjYXNlIDE2OlxyXG5cdFx0XHRhbGcgPSAnbWQ1JztcclxuXHRcdFx0YnJlYWs7XHJcblx0XHRjYXNlIDIwOlxyXG5cdFx0XHRhbGcgPSAnc2hhMSc7XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0Y2FzZSA2NDpcclxuXHRcdFx0YWxnID0gJ3NoYTUxMic7XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0ZGVmYXVsdDpcclxuXHRcdFx0dGhyb3cgKG5ldyBGaW5nZXJwcmludEZvcm1hdEVycm9yKGZwKSk7XHJcblx0XHR9XHJcblxyXG5cdFx0LyogUGxhaW4gaGV4L2Jhc2U2NDogZ3Vlc3MgaXQncyBwcm9iYWJseSBTUEtJIHVubGVzcyB0b2xkLiAqL1xyXG5cdFx0aWYgKG9wdGlvbnMuaGFzaFR5cGUgPT09IHVuZGVmaW5lZClcclxuXHRcdFx0aGFzaFR5cGUgPSAnc3BraSc7XHJcblx0fVxyXG5cclxuXHRpZiAoYWxnID09PSB1bmRlZmluZWQpXHJcblx0XHR0aHJvdyAobmV3IEZpbmdlcnByaW50Rm9ybWF0RXJyb3IoZnApKTtcclxuXHJcblx0aWYgKGFsZ3MuaGFzaEFsZ3NbYWxnXSA9PT0gdW5kZWZpbmVkKVxyXG5cdFx0dGhyb3cgKG5ldyBJbnZhbGlkQWxnb3JpdGhtRXJyb3IoYWxnKSk7XHJcblxyXG5cdGlmIChlbkFsZ3MgIT09IHVuZGVmaW5lZCkge1xyXG5cdFx0ZW5BbGdzID0gZW5BbGdzLm1hcChmdW5jdGlvbiAoYSkgeyByZXR1cm4gYS50b0xvd2VyQ2FzZSgpOyB9KTtcclxuXHRcdGlmIChlbkFsZ3MuaW5kZXhPZihhbGcpID09PSAtMSlcclxuXHRcdFx0dGhyb3cgKG5ldyBJbnZhbGlkQWxnb3JpdGhtRXJyb3IoYWxnKSk7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gKG5ldyBGaW5nZXJwcmludCh7XHJcblx0XHRhbGdvcml0aG06IGFsZyxcclxuXHRcdGhhc2g6IGhhc2gsXHJcblx0XHR0eXBlOiBvcHRpb25zLnR5cGUgfHwgJ2tleScsXHJcblx0XHRoYXNoVHlwZTogaGFzaFR5cGVcclxuXHR9KSk7XHJcbn07XHJcblxyXG5mdW5jdGlvbiBhZGRDb2xvbnMocykge1xyXG5cdC8qSlNTVFlMRUQqL1xyXG5cdHJldHVybiAocy5yZXBsYWNlKC8oLnsyfSkoPz0uKS9nLCAnJDE6JykpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBiYXNlNjRTdHJpcChzKSB7XHJcblx0LypKU1NUWUxFRCovXHJcblx0cmV0dXJuIChzLnJlcGxhY2UoLz0qJC8sICcnKSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNzaEJhc2U2NEZvcm1hdChhbGcsIGgpIHtcclxuXHRyZXR1cm4gKGFsZy50b1VwcGVyQ2FzZSgpICsgJzonICsgYmFzZTY0U3RyaXAoaCkpO1xyXG59XHJcblxyXG5GaW5nZXJwcmludC5pc0ZpbmdlcnByaW50ID0gZnVuY3Rpb24gKG9iaiwgdmVyKSB7XHJcblx0cmV0dXJuICh1dGlscy5pc0NvbXBhdGlibGUob2JqLCBGaW5nZXJwcmludCwgdmVyKSk7XHJcbn07XHJcblxyXG4vKlxyXG4gKiBBUEkgdmVyc2lvbnMgZm9yIEZpbmdlcnByaW50OlxyXG4gKiBbMSwwXSAtLSBpbml0aWFsIHZlclxyXG4gKiBbMSwxXSAtLSBmaXJzdCB0YWdnZWQgdmVyXHJcbiAqIFsxLDJdIC0tIGhhc2hUeXBlIGFuZCBzcGtpIHN1cHBvcnRcclxuICovXHJcbkZpbmdlcnByaW50LnByb3RvdHlwZS5fc3NocGtBcGlWZXJzaW9uID0gWzEsIDJdO1xyXG5cclxuRmluZ2VycHJpbnQuX29sZFZlcnNpb25EZXRlY3QgPSBmdW5jdGlvbiAob2JqKSB7XHJcblx0YXNzZXJ0LmZ1bmMob2JqLnRvU3RyaW5nKTtcclxuXHRhc3NlcnQuZnVuYyhvYmoubWF0Y2hlcyk7XHJcblx0cmV0dXJuIChbMSwgMF0pO1xyXG59O1xyXG4iLCIvLyBDb3B5cmlnaHQgMjAxNyBKb3llbnQsIEluYy5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG5cdERpZmZpZUhlbGxtYW46IERpZmZpZUhlbGxtYW4sXHJcblx0Z2VuZXJhdGVFQ0RTQTogZ2VuZXJhdGVFQ0RTQSxcclxuXHRnZW5lcmF0ZUVEMjU1MTk6IGdlbmVyYXRlRUQyNTUxOVxyXG59O1xyXG5cclxudmFyIGFzc2VydCA9IHJlcXVpcmUoJ2Fzc2VydC1wbHVzJyk7XHJcbnZhciBjcnlwdG8gPSByZXF1aXJlKCdjcnlwdG8nKTtcclxudmFyIEJ1ZmZlciA9IHJlcXVpcmUoJ3NhZmVyLWJ1ZmZlcicpLkJ1ZmZlcjtcclxudmFyIGFsZ3MgPSByZXF1aXJlKCcuL2FsZ3MnKTtcclxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xyXG52YXIgbmFjbCA9IHJlcXVpcmUoJ3R3ZWV0bmFjbCcpO1xyXG5cclxudmFyIEtleSA9IHJlcXVpcmUoJy4va2V5Jyk7XHJcbnZhciBQcml2YXRlS2V5ID0gcmVxdWlyZSgnLi9wcml2YXRlLWtleScpO1xyXG5cclxudmFyIENSWVBUT19IQVZFX0VDREggPSAoY3J5cHRvLmNyZWF0ZUVDREggIT09IHVuZGVmaW5lZCk7XHJcblxyXG52YXIgZWNkaCA9IHJlcXVpcmUoJ2VjYy1qc2JuJyk7XHJcbnZhciBlYyA9IHJlcXVpcmUoJ2VjYy1qc2JuL2xpYi9lYycpO1xyXG52YXIganNibiA9IHJlcXVpcmUoJ2pzYm4nKS5CaWdJbnRlZ2VyO1xyXG5cclxuZnVuY3Rpb24gRGlmZmllSGVsbG1hbihrZXkpIHtcclxuXHR1dGlscy5hc3NlcnRDb21wYXRpYmxlKGtleSwgS2V5LCBbMSwgNF0sICdrZXknKTtcclxuXHR0aGlzLl9pc1ByaXYgPSBQcml2YXRlS2V5LmlzUHJpdmF0ZUtleShrZXksIFsxLCAzXSk7XHJcblx0dGhpcy5fYWxnbyA9IGtleS50eXBlO1xyXG5cdHRoaXMuX2N1cnZlID0ga2V5LmN1cnZlO1xyXG5cdHRoaXMuX2tleSA9IGtleTtcclxuXHRpZiAoa2V5LnR5cGUgPT09ICdkc2EnKSB7XHJcblx0XHRpZiAoIUNSWVBUT19IQVZFX0VDREgpIHtcclxuXHRcdFx0dGhyb3cgKG5ldyBFcnJvcignRHVlIHRvIGJ1Z3MgaW4gdGhlIG5vZGUgMC4xMCAnICtcclxuXHRcdFx0ICAgICdjcnlwdG8gQVBJLCBub2RlIDAuMTIueCBvciBsYXRlciBpcyByZXF1aXJlZCAnICtcclxuXHRcdFx0ICAgICd0byB1c2UgREgnKSk7XHJcblx0XHR9XHJcblx0XHR0aGlzLl9kaCA9IGNyeXB0by5jcmVhdGVEaWZmaWVIZWxsbWFuKFxyXG5cdFx0ICAgIGtleS5wYXJ0LnAuZGF0YSwgdW5kZWZpbmVkLFxyXG5cdFx0ICAgIGtleS5wYXJ0LmcuZGF0YSwgdW5kZWZpbmVkKTtcclxuXHRcdHRoaXMuX3AgPSBrZXkucGFydC5wO1xyXG5cdFx0dGhpcy5fZyA9IGtleS5wYXJ0Lmc7XHJcblx0XHRpZiAodGhpcy5faXNQcml2KVxyXG5cdFx0XHR0aGlzLl9kaC5zZXRQcml2YXRlS2V5KGtleS5wYXJ0LnguZGF0YSk7XHJcblx0XHR0aGlzLl9kaC5zZXRQdWJsaWNLZXkoa2V5LnBhcnQueS5kYXRhKTtcclxuXHJcblx0fSBlbHNlIGlmIChrZXkudHlwZSA9PT0gJ2VjZHNhJykge1xyXG5cdFx0aWYgKCFDUllQVE9fSEFWRV9FQ0RIKSB7XHJcblx0XHRcdHRoaXMuX2VjUGFyYW1zID0gbmV3IFg5RUNQYXJhbWV0ZXJzKHRoaXMuX2N1cnZlKTtcclxuXHJcblx0XHRcdGlmICh0aGlzLl9pc1ByaXYpIHtcclxuXHRcdFx0XHR0aGlzLl9wcml2ID0gbmV3IEVDUHJpdmF0ZShcclxuXHRcdFx0XHQgICAgdGhpcy5fZWNQYXJhbXMsIGtleS5wYXJ0LmQuZGF0YSk7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciBjdXJ2ZSA9IHtcclxuXHRcdFx0J25pc3RwMjU2JzogJ3ByaW1lMjU2djEnLFxyXG5cdFx0XHQnbmlzdHAzODQnOiAnc2VjcDM4NHIxJyxcclxuXHRcdFx0J25pc3RwNTIxJzogJ3NlY3A1MjFyMSdcclxuXHRcdH1ba2V5LmN1cnZlXTtcclxuXHRcdHRoaXMuX2RoID0gY3J5cHRvLmNyZWF0ZUVDREgoY3VydmUpO1xyXG5cdFx0aWYgKHR5cGVvZiAodGhpcy5fZGgpICE9PSAnb2JqZWN0JyB8fFxyXG5cdFx0ICAgIHR5cGVvZiAodGhpcy5fZGguc2V0UHJpdmF0ZUtleSkgIT09ICdmdW5jdGlvbicpIHtcclxuXHRcdFx0Q1JZUFRPX0hBVkVfRUNESCA9IGZhbHNlO1xyXG5cdFx0XHREaWZmaWVIZWxsbWFuLmNhbGwodGhpcywga2V5KTtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cdFx0aWYgKHRoaXMuX2lzUHJpdilcclxuXHRcdFx0dGhpcy5fZGguc2V0UHJpdmF0ZUtleShrZXkucGFydC5kLmRhdGEpO1xyXG5cdFx0dGhpcy5fZGguc2V0UHVibGljS2V5KGtleS5wYXJ0LlEuZGF0YSk7XHJcblxyXG5cdH0gZWxzZSBpZiAoa2V5LnR5cGUgPT09ICdjdXJ2ZTI1NTE5Jykge1xyXG5cdFx0aWYgKHRoaXMuX2lzUHJpdikge1xyXG5cdFx0XHR1dGlscy5hc3NlcnRDb21wYXRpYmxlKGtleSwgUHJpdmF0ZUtleSwgWzEsIDVdLCAna2V5Jyk7XHJcblx0XHRcdHRoaXMuX3ByaXYgPSBrZXkucGFydC5rLmRhdGE7XHJcblx0XHR9XHJcblxyXG5cdH0gZWxzZSB7XHJcblx0XHR0aHJvdyAobmV3IEVycm9yKCdESCBub3Qgc3VwcG9ydGVkIGZvciAnICsga2V5LnR5cGUgKyAnIGtleXMnKSk7XHJcblx0fVxyXG59XHJcblxyXG5EaWZmaWVIZWxsbWFuLnByb3RvdHlwZS5nZXRQdWJsaWNLZXkgPSBmdW5jdGlvbiAoKSB7XHJcblx0aWYgKHRoaXMuX2lzUHJpdilcclxuXHRcdHJldHVybiAodGhpcy5fa2V5LnRvUHVibGljKCkpO1xyXG5cdHJldHVybiAodGhpcy5fa2V5KTtcclxufTtcclxuXHJcbkRpZmZpZUhlbGxtYW4ucHJvdG90eXBlLmdldFByaXZhdGVLZXkgPSBmdW5jdGlvbiAoKSB7XHJcblx0aWYgKHRoaXMuX2lzUHJpdilcclxuXHRcdHJldHVybiAodGhpcy5fa2V5KTtcclxuXHRlbHNlXHJcblx0XHRyZXR1cm4gKHVuZGVmaW5lZCk7XHJcbn07XHJcbkRpZmZpZUhlbGxtYW4ucHJvdG90eXBlLmdldEtleSA9IERpZmZpZUhlbGxtYW4ucHJvdG90eXBlLmdldFByaXZhdGVLZXk7XHJcblxyXG5EaWZmaWVIZWxsbWFuLnByb3RvdHlwZS5fa2V5Q2hlY2sgPSBmdW5jdGlvbiAocGssIGlzUHViKSB7XHJcblx0YXNzZXJ0Lm9iamVjdChwaywgJ2tleScpO1xyXG5cdGlmICghaXNQdWIpXHJcblx0XHR1dGlscy5hc3NlcnRDb21wYXRpYmxlKHBrLCBQcml2YXRlS2V5LCBbMSwgM10sICdrZXknKTtcclxuXHR1dGlscy5hc3NlcnRDb21wYXRpYmxlKHBrLCBLZXksIFsxLCA0XSwgJ2tleScpO1xyXG5cclxuXHRpZiAocGsudHlwZSAhPT0gdGhpcy5fYWxnbykge1xyXG5cdFx0dGhyb3cgKG5ldyBFcnJvcignQSAnICsgcGsudHlwZSArICcga2V5IGNhbm5vdCBiZSB1c2VkIGluICcgK1xyXG5cdFx0ICAgIHRoaXMuX2FsZ28gKyAnIERpZmZpZS1IZWxsbWFuJykpO1xyXG5cdH1cclxuXHJcblx0aWYgKHBrLmN1cnZlICE9PSB0aGlzLl9jdXJ2ZSkge1xyXG5cdFx0dGhyb3cgKG5ldyBFcnJvcignQSBrZXkgZnJvbSB0aGUgJyArIHBrLmN1cnZlICsgJyBjdXJ2ZSAnICtcclxuXHRcdCAgICAnY2Fubm90IGJlIHVzZWQgd2l0aCBhICcgKyB0aGlzLl9jdXJ2ZSArXHJcblx0XHQgICAgJyBEaWZmaWUtSGVsbG1hbicpKTtcclxuXHR9XHJcblxyXG5cdGlmIChway50eXBlID09PSAnZHNhJykge1xyXG5cdFx0YXNzZXJ0LmRlZXBFcXVhbChway5wYXJ0LnAsIHRoaXMuX3AsXHJcblx0XHQgICAgJ0RTQSBrZXkgcHJpbWUgZG9lcyBub3QgbWF0Y2gnKTtcclxuXHRcdGFzc2VydC5kZWVwRXF1YWwocGsucGFydC5nLCB0aGlzLl9nLFxyXG5cdFx0ICAgICdEU0Ega2V5IGdlbmVyYXRvciBkb2VzIG5vdCBtYXRjaCcpO1xyXG5cdH1cclxufTtcclxuXHJcbkRpZmZpZUhlbGxtYW4ucHJvdG90eXBlLnNldEtleSA9IGZ1bmN0aW9uIChwaykge1xyXG5cdHRoaXMuX2tleUNoZWNrKHBrKTtcclxuXHJcblx0aWYgKHBrLnR5cGUgPT09ICdkc2EnKSB7XHJcblx0XHR0aGlzLl9kaC5zZXRQcml2YXRlS2V5KHBrLnBhcnQueC5kYXRhKTtcclxuXHRcdHRoaXMuX2RoLnNldFB1YmxpY0tleShway5wYXJ0LnkuZGF0YSk7XHJcblxyXG5cdH0gZWxzZSBpZiAocGsudHlwZSA9PT0gJ2VjZHNhJykge1xyXG5cdFx0aWYgKENSWVBUT19IQVZFX0VDREgpIHtcclxuXHRcdFx0dGhpcy5fZGguc2V0UHJpdmF0ZUtleShway5wYXJ0LmQuZGF0YSk7XHJcblx0XHRcdHRoaXMuX2RoLnNldFB1YmxpY0tleShway5wYXJ0LlEuZGF0YSk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0aGlzLl9wcml2ID0gbmV3IEVDUHJpdmF0ZShcclxuXHRcdFx0ICAgIHRoaXMuX2VjUGFyYW1zLCBway5wYXJ0LmQuZGF0YSk7XHJcblx0XHR9XHJcblxyXG5cdH0gZWxzZSBpZiAocGsudHlwZSA9PT0gJ2N1cnZlMjU1MTknKSB7XHJcblx0XHR2YXIgayA9IHBrLnBhcnQuaztcclxuXHRcdGlmICghcGsucGFydC5rKVxyXG5cdFx0XHRrID0gcGsucGFydC5yO1xyXG5cdFx0dGhpcy5fcHJpdiA9IGsuZGF0YTtcclxuXHRcdGlmICh0aGlzLl9wcml2WzBdID09PSAweDAwKVxyXG5cdFx0XHR0aGlzLl9wcml2ID0gdGhpcy5fcHJpdi5zbGljZSgxKTtcclxuXHRcdHRoaXMuX3ByaXYgPSB0aGlzLl9wcml2LnNsaWNlKDAsIDMyKTtcclxuXHR9XHJcblx0dGhpcy5fa2V5ID0gcGs7XHJcblx0dGhpcy5faXNQcml2ID0gdHJ1ZTtcclxufTtcclxuRGlmZmllSGVsbG1hbi5wcm90b3R5cGUuc2V0UHJpdmF0ZUtleSA9IERpZmZpZUhlbGxtYW4ucHJvdG90eXBlLnNldEtleTtcclxuXHJcbkRpZmZpZUhlbGxtYW4ucHJvdG90eXBlLmNvbXB1dGVTZWNyZXQgPSBmdW5jdGlvbiAob3RoZXJwaykge1xyXG5cdHRoaXMuX2tleUNoZWNrKG90aGVycGssIHRydWUpO1xyXG5cdGlmICghdGhpcy5faXNQcml2KVxyXG5cdFx0dGhyb3cgKG5ldyBFcnJvcignREggZXhjaGFuZ2UgaGFzIG5vdCBiZWVuIGluaXRpYWxpemVkIHdpdGggJyArXHJcblx0XHQgICAgJ2EgcHJpdmF0ZSBrZXkgeWV0JykpO1xyXG5cclxuXHR2YXIgcHViO1xyXG5cdGlmICh0aGlzLl9hbGdvID09PSAnZHNhJykge1xyXG5cdFx0cmV0dXJuICh0aGlzLl9kaC5jb21wdXRlU2VjcmV0KFxyXG5cdFx0ICAgIG90aGVycGsucGFydC55LmRhdGEpKTtcclxuXHJcblx0fSBlbHNlIGlmICh0aGlzLl9hbGdvID09PSAnZWNkc2EnKSB7XHJcblx0XHRpZiAoQ1JZUFRPX0hBVkVfRUNESCkge1xyXG5cdFx0XHRyZXR1cm4gKHRoaXMuX2RoLmNvbXB1dGVTZWNyZXQoXHJcblx0XHRcdCAgICBvdGhlcnBrLnBhcnQuUS5kYXRhKSk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRwdWIgPSBuZXcgRUNQdWJsaWMoXHJcblx0XHRcdCAgICB0aGlzLl9lY1BhcmFtcywgb3RoZXJway5wYXJ0LlEuZGF0YSk7XHJcblx0XHRcdHJldHVybiAodGhpcy5fcHJpdi5kZXJpdmVTaGFyZWRTZWNyZXQocHViKSk7XHJcblx0XHR9XHJcblxyXG5cdH0gZWxzZSBpZiAodGhpcy5fYWxnbyA9PT0gJ2N1cnZlMjU1MTknKSB7XHJcblx0XHRwdWIgPSBvdGhlcnBrLnBhcnQuQS5kYXRhO1xyXG5cdFx0d2hpbGUgKHB1YlswXSA9PT0gMHgwMCAmJiBwdWIubGVuZ3RoID4gMzIpXHJcblx0XHRcdHB1YiA9IHB1Yi5zbGljZSgxKTtcclxuXHRcdHZhciBwcml2ID0gdGhpcy5fcHJpdjtcclxuXHRcdGFzc2VydC5zdHJpY3RFcXVhbChwdWIubGVuZ3RoLCAzMik7XHJcblx0XHRhc3NlcnQuc3RyaWN0RXF1YWwocHJpdi5sZW5ndGgsIDMyKTtcclxuXHJcblx0XHR2YXIgc2VjcmV0ID0gbmFjbC5ib3guYmVmb3JlKG5ldyBVaW50OEFycmF5KHB1YiksXHJcblx0XHQgICAgbmV3IFVpbnQ4QXJyYXkocHJpdikpO1xyXG5cclxuXHRcdHJldHVybiAoQnVmZmVyLmZyb20oc2VjcmV0KSk7XHJcblx0fVxyXG5cclxuXHR0aHJvdyAobmV3IEVycm9yKCdJbnZhbGlkIGFsZ29yaXRobTogJyArIHRoaXMuX2FsZ28pKTtcclxufTtcclxuXHJcbkRpZmZpZUhlbGxtYW4ucHJvdG90eXBlLmdlbmVyYXRlS2V5ID0gZnVuY3Rpb24gKCkge1xyXG5cdHZhciBwYXJ0cyA9IFtdO1xyXG5cdHZhciBwcml2LCBwdWI7XHJcblx0aWYgKHRoaXMuX2FsZ28gPT09ICdkc2EnKSB7XHJcblx0XHR0aGlzLl9kaC5nZW5lcmF0ZUtleXMoKTtcclxuXHJcblx0XHRwYXJ0cy5wdXNoKHtuYW1lOiAncCcsIGRhdGE6IHRoaXMuX3AuZGF0YX0pO1xyXG5cdFx0cGFydHMucHVzaCh7bmFtZTogJ3EnLCBkYXRhOiB0aGlzLl9rZXkucGFydC5xLmRhdGF9KTtcclxuXHRcdHBhcnRzLnB1c2goe25hbWU6ICdnJywgZGF0YTogdGhpcy5fZy5kYXRhfSk7XHJcblx0XHRwYXJ0cy5wdXNoKHtuYW1lOiAneScsIGRhdGE6IHRoaXMuX2RoLmdldFB1YmxpY0tleSgpfSk7XHJcblx0XHRwYXJ0cy5wdXNoKHtuYW1lOiAneCcsIGRhdGE6IHRoaXMuX2RoLmdldFByaXZhdGVLZXkoKX0pO1xyXG5cdFx0dGhpcy5fa2V5ID0gbmV3IFByaXZhdGVLZXkoe1xyXG5cdFx0XHR0eXBlOiAnZHNhJyxcclxuXHRcdFx0cGFydHM6IHBhcnRzXHJcblx0XHR9KTtcclxuXHRcdHRoaXMuX2lzUHJpdiA9IHRydWU7XHJcblx0XHRyZXR1cm4gKHRoaXMuX2tleSk7XHJcblxyXG5cdH0gZWxzZSBpZiAodGhpcy5fYWxnbyA9PT0gJ2VjZHNhJykge1xyXG5cdFx0aWYgKENSWVBUT19IQVZFX0VDREgpIHtcclxuXHRcdFx0dGhpcy5fZGguZ2VuZXJhdGVLZXlzKCk7XHJcblxyXG5cdFx0XHRwYXJ0cy5wdXNoKHtuYW1lOiAnY3VydmUnLFxyXG5cdFx0XHQgICAgZGF0YTogQnVmZmVyLmZyb20odGhpcy5fY3VydmUpfSk7XHJcblx0XHRcdHBhcnRzLnB1c2goe25hbWU6ICdRJywgZGF0YTogdGhpcy5fZGguZ2V0UHVibGljS2V5KCl9KTtcclxuXHRcdFx0cGFydHMucHVzaCh7bmFtZTogJ2QnLCBkYXRhOiB0aGlzLl9kaC5nZXRQcml2YXRlS2V5KCl9KTtcclxuXHRcdFx0dGhpcy5fa2V5ID0gbmV3IFByaXZhdGVLZXkoe1xyXG5cdFx0XHRcdHR5cGU6ICdlY2RzYScsXHJcblx0XHRcdFx0Y3VydmU6IHRoaXMuX2N1cnZlLFxyXG5cdFx0XHRcdHBhcnRzOiBwYXJ0c1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0dGhpcy5faXNQcml2ID0gdHJ1ZTtcclxuXHRcdFx0cmV0dXJuICh0aGlzLl9rZXkpO1xyXG5cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHZhciBuID0gdGhpcy5fZWNQYXJhbXMuZ2V0TigpO1xyXG5cdFx0XHR2YXIgciA9IG5ldyBqc2JuKGNyeXB0by5yYW5kb21CeXRlcyhuLmJpdExlbmd0aCgpKSk7XHJcblx0XHRcdHZhciBuMSA9IG4uc3VidHJhY3QoanNibi5PTkUpO1xyXG5cdFx0XHRwcml2ID0gci5tb2QobjEpLmFkZChqc2JuLk9ORSk7XHJcblx0XHRcdHB1YiA9IHRoaXMuX2VjUGFyYW1zLmdldEcoKS5tdWx0aXBseShwcml2KTtcclxuXHJcblx0XHRcdHByaXYgPSBCdWZmZXIuZnJvbShwcml2LnRvQnl0ZUFycmF5KCkpO1xyXG5cdFx0XHRwdWIgPSBCdWZmZXIuZnJvbSh0aGlzLl9lY1BhcmFtcy5nZXRDdXJ2ZSgpLlxyXG5cdFx0XHQgICAgZW5jb2RlUG9pbnRIZXgocHViKSwgJ2hleCcpO1xyXG5cclxuXHRcdFx0dGhpcy5fcHJpdiA9IG5ldyBFQ1ByaXZhdGUodGhpcy5fZWNQYXJhbXMsIHByaXYpO1xyXG5cclxuXHRcdFx0cGFydHMucHVzaCh7bmFtZTogJ2N1cnZlJyxcclxuXHRcdFx0ICAgIGRhdGE6IEJ1ZmZlci5mcm9tKHRoaXMuX2N1cnZlKX0pO1xyXG5cdFx0XHRwYXJ0cy5wdXNoKHtuYW1lOiAnUScsIGRhdGE6IHB1Yn0pO1xyXG5cdFx0XHRwYXJ0cy5wdXNoKHtuYW1lOiAnZCcsIGRhdGE6IHByaXZ9KTtcclxuXHJcblx0XHRcdHRoaXMuX2tleSA9IG5ldyBQcml2YXRlS2V5KHtcclxuXHRcdFx0XHR0eXBlOiAnZWNkc2EnLFxyXG5cdFx0XHRcdGN1cnZlOiB0aGlzLl9jdXJ2ZSxcclxuXHRcdFx0XHRwYXJ0czogcGFydHNcclxuXHRcdFx0fSk7XHJcblx0XHRcdHRoaXMuX2lzUHJpdiA9IHRydWU7XHJcblx0XHRcdHJldHVybiAodGhpcy5fa2V5KTtcclxuXHRcdH1cclxuXHJcblx0fSBlbHNlIGlmICh0aGlzLl9hbGdvID09PSAnY3VydmUyNTUxOScpIHtcclxuXHRcdHZhciBwYWlyID0gbmFjbC5ib3gua2V5UGFpcigpO1xyXG5cdFx0cHJpdiA9IEJ1ZmZlci5mcm9tKHBhaXIuc2VjcmV0S2V5KTtcclxuXHRcdHB1YiA9IEJ1ZmZlci5mcm9tKHBhaXIucHVibGljS2V5KTtcclxuXHRcdHByaXYgPSBCdWZmZXIuY29uY2F0KFtwcml2LCBwdWJdKTtcclxuXHRcdGFzc2VydC5zdHJpY3RFcXVhbChwcml2Lmxlbmd0aCwgNjQpO1xyXG5cdFx0YXNzZXJ0LnN0cmljdEVxdWFsKHB1Yi5sZW5ndGgsIDMyKTtcclxuXHJcblx0XHRwYXJ0cy5wdXNoKHtuYW1lOiAnQScsIGRhdGE6IHB1Yn0pO1xyXG5cdFx0cGFydHMucHVzaCh7bmFtZTogJ2snLCBkYXRhOiBwcml2fSk7XHJcblx0XHR0aGlzLl9rZXkgPSBuZXcgUHJpdmF0ZUtleSh7XHJcblx0XHRcdHR5cGU6ICdjdXJ2ZTI1NTE5JyxcclxuXHRcdFx0cGFydHM6IHBhcnRzXHJcblx0XHR9KTtcclxuXHRcdHRoaXMuX2lzUHJpdiA9IHRydWU7XHJcblx0XHRyZXR1cm4gKHRoaXMuX2tleSk7XHJcblx0fVxyXG5cclxuXHR0aHJvdyAobmV3IEVycm9yKCdJbnZhbGlkIGFsZ29yaXRobTogJyArIHRoaXMuX2FsZ28pKTtcclxufTtcclxuRGlmZmllSGVsbG1hbi5wcm90b3R5cGUuZ2VuZXJhdGVLZXlzID0gRGlmZmllSGVsbG1hbi5wcm90b3R5cGUuZ2VuZXJhdGVLZXk7XHJcblxyXG4vKiBUaGVzZSBhcmUgaGVscGVycyBmb3IgdXNpbmcgZWNjLWpzYm4gKGZvciBub2RlIDAuMTAgY29tcGF0aWJpbGl0eSkuICovXHJcblxyXG5mdW5jdGlvbiBYOUVDUGFyYW1ldGVycyhuYW1lKSB7XHJcblx0dmFyIHBhcmFtcyA9IGFsZ3MuY3VydmVzW25hbWVdO1xyXG5cdGFzc2VydC5vYmplY3QocGFyYW1zKTtcclxuXHJcblx0dmFyIHAgPSBuZXcganNibihwYXJhbXMucCk7XHJcblx0dmFyIGEgPSBuZXcganNibihwYXJhbXMuYSk7XHJcblx0dmFyIGIgPSBuZXcganNibihwYXJhbXMuYik7XHJcblx0dmFyIG4gPSBuZXcganNibihwYXJhbXMubik7XHJcblx0dmFyIGggPSBqc2JuLk9ORTtcclxuXHR2YXIgY3VydmUgPSBuZXcgZWMuRUNDdXJ2ZUZwKHAsIGEsIGIpO1xyXG5cdHZhciBHID0gY3VydmUuZGVjb2RlUG9pbnRIZXgocGFyYW1zLkcudG9TdHJpbmcoJ2hleCcpKTtcclxuXHJcblx0dGhpcy5jdXJ2ZSA9IGN1cnZlO1xyXG5cdHRoaXMuZyA9IEc7XHJcblx0dGhpcy5uID0gbjtcclxuXHR0aGlzLmggPSBoO1xyXG59XHJcblg5RUNQYXJhbWV0ZXJzLnByb3RvdHlwZS5nZXRDdXJ2ZSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICh0aGlzLmN1cnZlKTsgfTtcclxuWDlFQ1BhcmFtZXRlcnMucHJvdG90eXBlLmdldEcgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAodGhpcy5nKTsgfTtcclxuWDlFQ1BhcmFtZXRlcnMucHJvdG90eXBlLmdldE4gPSBmdW5jdGlvbiAoKSB7IHJldHVybiAodGhpcy5uKTsgfTtcclxuWDlFQ1BhcmFtZXRlcnMucHJvdG90eXBlLmdldEggPSBmdW5jdGlvbiAoKSB7IHJldHVybiAodGhpcy5oKTsgfTtcclxuXHJcbmZ1bmN0aW9uIEVDUHVibGljKHBhcmFtcywgYnVmZmVyKSB7XHJcblx0dGhpcy5fcGFyYW1zID0gcGFyYW1zO1xyXG5cdGlmIChidWZmZXJbMF0gPT09IDB4MDApXHJcblx0XHRidWZmZXIgPSBidWZmZXIuc2xpY2UoMSk7XHJcblx0dGhpcy5fcHViID0gcGFyYW1zLmdldEN1cnZlKCkuZGVjb2RlUG9pbnRIZXgoYnVmZmVyLnRvU3RyaW5nKCdoZXgnKSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIEVDUHJpdmF0ZShwYXJhbXMsIGJ1ZmZlcikge1xyXG5cdHRoaXMuX3BhcmFtcyA9IHBhcmFtcztcclxuXHR0aGlzLl9wcml2ID0gbmV3IGpzYm4odXRpbHMubXBOb3JtYWxpemUoYnVmZmVyKSk7XHJcbn1cclxuRUNQcml2YXRlLnByb3RvdHlwZS5kZXJpdmVTaGFyZWRTZWNyZXQgPSBmdW5jdGlvbiAocHViS2V5KSB7XHJcblx0YXNzZXJ0Lm9rKHB1YktleSBpbnN0YW5jZW9mIEVDUHVibGljKTtcclxuXHR2YXIgUyA9IHB1YktleS5fcHViLm11bHRpcGx5KHRoaXMuX3ByaXYpO1xyXG5cdHJldHVybiAoQnVmZmVyLmZyb20oUy5nZXRYKCkudG9CaWdJbnRlZ2VyKCkudG9CeXRlQXJyYXkoKSkpO1xyXG59O1xyXG5cclxuZnVuY3Rpb24gZ2VuZXJhdGVFRDI1NTE5KCkge1xyXG5cdHZhciBwYWlyID0gbmFjbC5zaWduLmtleVBhaXIoKTtcclxuXHR2YXIgcHJpdiA9IEJ1ZmZlci5mcm9tKHBhaXIuc2VjcmV0S2V5KTtcclxuXHR2YXIgcHViID0gQnVmZmVyLmZyb20ocGFpci5wdWJsaWNLZXkpO1xyXG5cdGFzc2VydC5zdHJpY3RFcXVhbChwcml2Lmxlbmd0aCwgNjQpO1xyXG5cdGFzc2VydC5zdHJpY3RFcXVhbChwdWIubGVuZ3RoLCAzMik7XHJcblxyXG5cdHZhciBwYXJ0cyA9IFtdO1xyXG5cdHBhcnRzLnB1c2goe25hbWU6ICdBJywgZGF0YTogcHVifSk7XHJcblx0cGFydHMucHVzaCh7bmFtZTogJ2snLCBkYXRhOiBwcml2LnNsaWNlKDAsIDMyKX0pO1xyXG5cdHZhciBrZXkgPSBuZXcgUHJpdmF0ZUtleSh7XHJcblx0XHR0eXBlOiAnZWQyNTUxOScsXHJcblx0XHRwYXJ0czogcGFydHNcclxuXHR9KTtcclxuXHRyZXR1cm4gKGtleSk7XHJcbn1cclxuXHJcbi8qIEdlbmVyYXRlcyBhIG5ldyBFQ0RTQSBwcml2YXRlIGtleSBvbiBhIGdpdmVuIGN1cnZlLiAqL1xyXG5mdW5jdGlvbiBnZW5lcmF0ZUVDRFNBKGN1cnZlKSB7XHJcblx0dmFyIHBhcnRzID0gW107XHJcblx0dmFyIGtleTtcclxuXHJcblx0aWYgKENSWVBUT19IQVZFX0VDREgpIHtcclxuXHRcdC8qXHJcblx0XHQgKiBOb2RlIGNyeXB0byBkb2Vzbid0IGV4cG9zZSBrZXkgZ2VuZXJhdGlvbiBkaXJlY3RseSwgYnV0IHRoZVxyXG5cdFx0ICogRUNESCBpbnN0YW5jZXMgY2FuIGdlbmVyYXRlIGtleXMuIEl0IHR1cm5zIG91dCB0aGlzIGp1c3RcclxuXHRcdCAqIGNhbGxzIGludG8gdGhlIE9wZW5TU0wgZ2VuZXJpYyBrZXkgZ2VuZXJhdG9yLCBhbmQgd2UgY2FuXHJcblx0XHQgKiByZWFkIGl0cyBvdXRwdXQgaGFwcGlseSB3aXRob3V0IGRvaW5nIGFuIGFjdHVhbCBESC4gU28gd2VcclxuXHRcdCAqIHVzZSB0aGF0IGhlcmUuXHJcblx0XHQgKi9cclxuXHRcdHZhciBvc0N1cnZlID0ge1xyXG5cdFx0XHQnbmlzdHAyNTYnOiAncHJpbWUyNTZ2MScsXHJcblx0XHRcdCduaXN0cDM4NCc6ICdzZWNwMzg0cjEnLFxyXG5cdFx0XHQnbmlzdHA1MjEnOiAnc2VjcDUyMXIxJ1xyXG5cdFx0fVtjdXJ2ZV07XHJcblxyXG5cdFx0dmFyIGRoID0gY3J5cHRvLmNyZWF0ZUVDREgob3NDdXJ2ZSk7XHJcblx0XHRkaC5nZW5lcmF0ZUtleXMoKTtcclxuXHJcblx0XHRwYXJ0cy5wdXNoKHtuYW1lOiAnY3VydmUnLFxyXG5cdFx0ICAgIGRhdGE6IEJ1ZmZlci5mcm9tKGN1cnZlKX0pO1xyXG5cdFx0cGFydHMucHVzaCh7bmFtZTogJ1EnLCBkYXRhOiBkaC5nZXRQdWJsaWNLZXkoKX0pO1xyXG5cdFx0cGFydHMucHVzaCh7bmFtZTogJ2QnLCBkYXRhOiBkaC5nZXRQcml2YXRlS2V5KCl9KTtcclxuXHJcblx0XHRrZXkgPSBuZXcgUHJpdmF0ZUtleSh7XHJcblx0XHRcdHR5cGU6ICdlY2RzYScsXHJcblx0XHRcdGN1cnZlOiBjdXJ2ZSxcclxuXHRcdFx0cGFydHM6IHBhcnRzXHJcblx0XHR9KTtcclxuXHRcdHJldHVybiAoa2V5KTtcclxuXHR9IGVsc2Uge1xyXG5cclxuXHRcdHZhciBlY1BhcmFtcyA9IG5ldyBYOUVDUGFyYW1ldGVycyhjdXJ2ZSk7XHJcblxyXG5cdFx0LyogVGhpcyBhbGdvcml0aG0gdGFrZW4gZnJvbSBGSVBTIFBVQiAxODYtNCAoc2VjdGlvbiBCLjQuMSkgKi9cclxuXHRcdHZhciBuID0gZWNQYXJhbXMuZ2V0TigpO1xyXG5cdFx0LypcclxuXHRcdCAqIFRoZSBjcnlwdG8ucmFuZG9tQnl0ZXMoKSBmdW5jdGlvbiBjYW4gb25seSBnaXZlIHVzIHdob2xlXHJcblx0XHQgKiBieXRlcywgc28gdGFraW5nIGEgbm9kIGZyb20gWDkuNjIsIHdlIHJvdW5kIHVwLlxyXG5cdFx0ICovXHJcblx0XHR2YXIgY0J5dGVMZW4gPSBNYXRoLmNlaWwoKG4uYml0TGVuZ3RoKCkgKyA2NCkgLyA4KTtcclxuXHRcdHZhciBjID0gbmV3IGpzYm4oY3J5cHRvLnJhbmRvbUJ5dGVzKGNCeXRlTGVuKSk7XHJcblxyXG5cdFx0dmFyIG4xID0gbi5zdWJ0cmFjdChqc2JuLk9ORSk7XHJcblx0XHR2YXIgcHJpdiA9IGMubW9kKG4xKS5hZGQoanNibi5PTkUpO1xyXG5cdFx0dmFyIHB1YiA9IGVjUGFyYW1zLmdldEcoKS5tdWx0aXBseShwcml2KTtcclxuXHJcblx0XHRwcml2ID0gQnVmZmVyLmZyb20ocHJpdi50b0J5dGVBcnJheSgpKTtcclxuXHRcdHB1YiA9IEJ1ZmZlci5mcm9tKGVjUGFyYW1zLmdldEN1cnZlKCkuXHJcblx0XHQgICAgZW5jb2RlUG9pbnRIZXgocHViKSwgJ2hleCcpO1xyXG5cclxuXHRcdHBhcnRzLnB1c2goe25hbWU6ICdjdXJ2ZScsIGRhdGE6IEJ1ZmZlci5mcm9tKGN1cnZlKX0pO1xyXG5cdFx0cGFydHMucHVzaCh7bmFtZTogJ1EnLCBkYXRhOiBwdWJ9KTtcclxuXHRcdHBhcnRzLnB1c2goe25hbWU6ICdkJywgZGF0YTogcHJpdn0pO1xyXG5cclxuXHRcdGtleSA9IG5ldyBQcml2YXRlS2V5KHtcclxuXHRcdFx0dHlwZTogJ2VjZHNhJyxcclxuXHRcdFx0Y3VydmU6IGN1cnZlLFxyXG5cdFx0XHRwYXJ0czogcGFydHNcclxuXHRcdH0pO1xyXG5cdFx0cmV0dXJuIChrZXkpO1xyXG5cdH1cclxufVxyXG4iLCIvLyBDb3B5cmlnaHQgMjAxNyBKb3llbnQsIEluYy5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSWRlbnRpdHk7XHJcblxyXG52YXIgYXNzZXJ0ID0gcmVxdWlyZSgnYXNzZXJ0LXBsdXMnKTtcclxudmFyIGFsZ3MgPSByZXF1aXJlKCcuL2FsZ3MnKTtcclxudmFyIGNyeXB0byA9IHJlcXVpcmUoJ2NyeXB0bycpO1xyXG52YXIgRmluZ2VycHJpbnQgPSByZXF1aXJlKCcuL2ZpbmdlcnByaW50Jyk7XHJcbnZhciBTaWduYXR1cmUgPSByZXF1aXJlKCcuL3NpZ25hdHVyZScpO1xyXG52YXIgZXJycyA9IHJlcXVpcmUoJy4vZXJyb3JzJyk7XHJcbnZhciB1dGlsID0gcmVxdWlyZSgndXRpbCcpO1xyXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XHJcbnZhciBhc24xID0gcmVxdWlyZSgnYXNuMScpO1xyXG52YXIgQnVmZmVyID0gcmVxdWlyZSgnc2FmZXItYnVmZmVyJykuQnVmZmVyO1xyXG5cclxuLypKU1NUWUxFRCovXHJcbnZhciBETlNfTkFNRV9SRSA9IC9eKFsqXXxbYS16MC05XVthLXowLTlcXC1dezAsNjJ9KSg/OlxcLihbKl18W2EtejAtOV1bYS16MC05XFwtXXswLDYyfSkpKiQvaTtcclxuXHJcbnZhciBvaWRzID0ge307XHJcbm9pZHMuY24gPSAnMi41LjQuMyc7XHJcbm9pZHMubyA9ICcyLjUuNC4xMCc7XHJcbm9pZHMub3UgPSAnMi41LjQuMTEnO1xyXG5vaWRzLmwgPSAnMi41LjQuNyc7XHJcbm9pZHMucyA9ICcyLjUuNC44Jztcclxub2lkcy5jID0gJzIuNS40LjYnO1xyXG5vaWRzLnNuID0gJzIuNS40LjQnO1xyXG5vaWRzLnBvc3RhbENvZGUgPSAnMi41LjQuMTcnO1xyXG5vaWRzLnNlcmlhbE51bWJlciA9ICcyLjUuNC41Jztcclxub2lkcy5zdHJlZXQgPSAnMi41LjQuOSc7XHJcbm9pZHMueDUwMFVuaXF1ZUlkZW50aWZpZXIgPSAnMi41LjQuNDUnO1xyXG5vaWRzLnJvbGUgPSAnMi41LjQuNzInO1xyXG5vaWRzLnRlbGVwaG9uZU51bWJlciA9ICcyLjUuNC4yMCc7XHJcbm9pZHMuZGVzY3JpcHRpb24gPSAnMi41LjQuMTMnO1xyXG5vaWRzLmRjID0gJzAuOS4yMzQyLjE5MjAwMzAwLjEwMC4xLjI1Jztcclxub2lkcy51aWQgPSAnMC45LjIzNDIuMTkyMDAzMDAuMTAwLjEuMSc7XHJcbm9pZHMubWFpbCA9ICcwLjkuMjM0Mi4xOTIwMDMwMC4xMDAuMS4zJztcclxub2lkcy50aXRsZSA9ICcyLjUuNC4xMic7XHJcbm9pZHMuZ24gPSAnMi41LjQuNDInO1xyXG5vaWRzLmluaXRpYWxzID0gJzIuNS40LjQzJztcclxub2lkcy5wc2V1ZG9ueW0gPSAnMi41LjQuNjUnO1xyXG5vaWRzLmVtYWlsQWRkcmVzcyA9ICcxLjIuODQwLjExMzU0OS4xLjkuMSc7XHJcblxyXG52YXIgdW5vaWRzID0ge307XHJcbk9iamVjdC5rZXlzKG9pZHMpLmZvckVhY2goZnVuY3Rpb24gKGspIHtcclxuXHR1bm9pZHNbb2lkc1trXV0gPSBrO1xyXG59KTtcclxuXHJcbmZ1bmN0aW9uIElkZW50aXR5KG9wdHMpIHtcclxuXHR2YXIgc2VsZiA9IHRoaXM7XHJcblx0YXNzZXJ0Lm9iamVjdChvcHRzLCAnb3B0aW9ucycpO1xyXG5cdGFzc2VydC5hcnJheU9mT2JqZWN0KG9wdHMuY29tcG9uZW50cywgJ29wdGlvbnMuY29tcG9uZW50cycpO1xyXG5cdHRoaXMuY29tcG9uZW50cyA9IG9wdHMuY29tcG9uZW50cztcclxuXHR0aGlzLmNvbXBvbmVudExvb2t1cCA9IHt9O1xyXG5cdHRoaXMuY29tcG9uZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChjKSB7XHJcblx0XHRpZiAoYy5uYW1lICYmICFjLm9pZClcclxuXHRcdFx0Yy5vaWQgPSBvaWRzW2MubmFtZV07XHJcblx0XHRpZiAoYy5vaWQgJiYgIWMubmFtZSlcclxuXHRcdFx0Yy5uYW1lID0gdW5vaWRzW2Mub2lkXTtcclxuXHRcdGlmIChzZWxmLmNvbXBvbmVudExvb2t1cFtjLm5hbWVdID09PSB1bmRlZmluZWQpXHJcblx0XHRcdHNlbGYuY29tcG9uZW50TG9va3VwW2MubmFtZV0gPSBbXTtcclxuXHRcdHNlbGYuY29tcG9uZW50TG9va3VwW2MubmFtZV0ucHVzaChjKTtcclxuXHR9KTtcclxuXHRpZiAodGhpcy5jb21wb25lbnRMb29rdXAuY24gJiYgdGhpcy5jb21wb25lbnRMb29rdXAuY24ubGVuZ3RoID4gMCkge1xyXG5cdFx0dGhpcy5jbiA9IHRoaXMuY29tcG9uZW50TG9va3VwLmNuWzBdLnZhbHVlO1xyXG5cdH1cclxuXHRhc3NlcnQub3B0aW9uYWxTdHJpbmcob3B0cy50eXBlLCAnb3B0aW9ucy50eXBlJyk7XHJcblx0aWYgKG9wdHMudHlwZSA9PT0gdW5kZWZpbmVkKSB7XHJcblx0XHRpZiAodGhpcy5jb21wb25lbnRzLmxlbmd0aCA9PT0gMSAmJlxyXG5cdFx0ICAgIHRoaXMuY29tcG9uZW50TG9va3VwLmNuICYmXHJcblx0XHQgICAgdGhpcy5jb21wb25lbnRMb29rdXAuY24ubGVuZ3RoID09PSAxICYmXHJcblx0XHQgICAgdGhpcy5jb21wb25lbnRMb29rdXAuY25bMF0udmFsdWUubWF0Y2goRE5TX05BTUVfUkUpKSB7XHJcblx0XHRcdHRoaXMudHlwZSA9ICdob3N0JztcclxuXHRcdFx0dGhpcy5ob3N0bmFtZSA9IHRoaXMuY29tcG9uZW50TG9va3VwLmNuWzBdLnZhbHVlO1xyXG5cclxuXHRcdH0gZWxzZSBpZiAodGhpcy5jb21wb25lbnRMb29rdXAuZGMgJiZcclxuXHRcdCAgICB0aGlzLmNvbXBvbmVudHMubGVuZ3RoID09PSB0aGlzLmNvbXBvbmVudExvb2t1cC5kYy5sZW5ndGgpIHtcclxuXHRcdFx0dGhpcy50eXBlID0gJ2hvc3QnO1xyXG5cdFx0XHR0aGlzLmhvc3RuYW1lID0gdGhpcy5jb21wb25lbnRMb29rdXAuZGMubWFwKFxyXG5cdFx0XHQgICAgZnVuY3Rpb24gKGMpIHtcclxuXHRcdFx0XHRyZXR1cm4gKGMudmFsdWUpO1xyXG5cdFx0XHR9KS5qb2luKCcuJyk7XHJcblxyXG5cdFx0fSBlbHNlIGlmICh0aGlzLmNvbXBvbmVudExvb2t1cC51aWQgJiZcclxuXHRcdCAgICB0aGlzLmNvbXBvbmVudHMubGVuZ3RoID09PVxyXG5cdFx0ICAgIHRoaXMuY29tcG9uZW50TG9va3VwLnVpZC5sZW5ndGgpIHtcclxuXHRcdFx0dGhpcy50eXBlID0gJ3VzZXInO1xyXG5cdFx0XHR0aGlzLnVpZCA9IHRoaXMuY29tcG9uZW50TG9va3VwLnVpZFswXS52YWx1ZTtcclxuXHJcblx0XHR9IGVsc2UgaWYgKHRoaXMuY29tcG9uZW50TG9va3VwLmNuICYmXHJcblx0XHQgICAgdGhpcy5jb21wb25lbnRMb29rdXAuY24ubGVuZ3RoID09PSAxICYmXHJcblx0XHQgICAgdGhpcy5jb21wb25lbnRMb29rdXAuY25bMF0udmFsdWUubWF0Y2goRE5TX05BTUVfUkUpKSB7XHJcblx0XHRcdHRoaXMudHlwZSA9ICdob3N0JztcclxuXHRcdFx0dGhpcy5ob3N0bmFtZSA9IHRoaXMuY29tcG9uZW50TG9va3VwLmNuWzBdLnZhbHVlO1xyXG5cclxuXHRcdH0gZWxzZSBpZiAodGhpcy5jb21wb25lbnRMb29rdXAudWlkICYmXHJcblx0XHQgICAgdGhpcy5jb21wb25lbnRMb29rdXAudWlkLmxlbmd0aCA9PT0gMSkge1xyXG5cdFx0XHR0aGlzLnR5cGUgPSAndXNlcic7XHJcblx0XHRcdHRoaXMudWlkID0gdGhpcy5jb21wb25lbnRMb29rdXAudWlkWzBdLnZhbHVlO1xyXG5cclxuXHRcdH0gZWxzZSBpZiAodGhpcy5jb21wb25lbnRMb29rdXAubWFpbCAmJlxyXG5cdFx0ICAgIHRoaXMuY29tcG9uZW50TG9va3VwLm1haWwubGVuZ3RoID09PSAxKSB7XHJcblx0XHRcdHRoaXMudHlwZSA9ICdlbWFpbCc7XHJcblx0XHRcdHRoaXMuZW1haWwgPSB0aGlzLmNvbXBvbmVudExvb2t1cC5tYWlsWzBdLnZhbHVlO1xyXG5cclxuXHRcdH0gZWxzZSBpZiAodGhpcy5jb21wb25lbnRMb29rdXAuY24gJiZcclxuXHRcdCAgICB0aGlzLmNvbXBvbmVudExvb2t1cC5jbi5sZW5ndGggPT09IDEpIHtcclxuXHRcdFx0dGhpcy50eXBlID0gJ3VzZXInO1xyXG5cdFx0XHR0aGlzLnVpZCA9IHRoaXMuY29tcG9uZW50TG9va3VwLmNuWzBdLnZhbHVlO1xyXG5cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRoaXMudHlwZSA9ICd1bmtub3duJztcclxuXHRcdH1cclxuXHR9IGVsc2Uge1xyXG5cdFx0dGhpcy50eXBlID0gb3B0cy50eXBlO1xyXG5cdFx0aWYgKHRoaXMudHlwZSA9PT0gJ2hvc3QnKVxyXG5cdFx0XHR0aGlzLmhvc3RuYW1lID0gb3B0cy5ob3N0bmFtZTtcclxuXHRcdGVsc2UgaWYgKHRoaXMudHlwZSA9PT0gJ3VzZXInKVxyXG5cdFx0XHR0aGlzLnVpZCA9IG9wdHMudWlkO1xyXG5cdFx0ZWxzZSBpZiAodGhpcy50eXBlID09PSAnZW1haWwnKVxyXG5cdFx0XHR0aGlzLmVtYWlsID0gb3B0cy5lbWFpbDtcclxuXHRcdGVsc2VcclxuXHRcdFx0dGhyb3cgKG5ldyBFcnJvcignVW5rbm93biB0eXBlICcgKyB0aGlzLnR5cGUpKTtcclxuXHR9XHJcbn1cclxuXHJcbklkZW50aXR5LnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcclxuXHRyZXR1cm4gKHRoaXMuY29tcG9uZW50cy5tYXAoZnVuY3Rpb24gKGMpIHtcclxuXHRcdHZhciBuID0gYy5uYW1lLnRvVXBwZXJDYXNlKCk7XHJcblx0XHQvKkpTU1RZTEVEKi9cclxuXHRcdG4gPSBuLnJlcGxhY2UoLz0vZywgJ1xcXFw9Jyk7XHJcblx0XHR2YXIgdiA9IGMudmFsdWU7XHJcblx0XHQvKkpTU1RZTEVEKi9cclxuXHRcdHYgPSB2LnJlcGxhY2UoLywvZywgJ1xcXFwsJyk7XHJcblx0XHRyZXR1cm4gKG4gKyAnPScgKyB2KTtcclxuXHR9KS5qb2luKCcsICcpKTtcclxufTtcclxuXHJcbklkZW50aXR5LnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiAobmFtZSwgYXNBcnJheSkge1xyXG5cdGFzc2VydC5zdHJpbmcobmFtZSwgJ25hbWUnKTtcclxuXHR2YXIgYXJyID0gdGhpcy5jb21wb25lbnRMb29rdXBbbmFtZV07XHJcblx0aWYgKGFyciA9PT0gdW5kZWZpbmVkIHx8IGFyci5sZW5ndGggPT09IDApXHJcblx0XHRyZXR1cm4gKHVuZGVmaW5lZCk7XHJcblx0aWYgKCFhc0FycmF5ICYmIGFyci5sZW5ndGggPiAxKVxyXG5cdFx0dGhyb3cgKG5ldyBFcnJvcignTXVsdGlwbGUgdmFsdWVzIGZvciBhdHRyaWJ1dGUgJyArIG5hbWUpKTtcclxuXHRpZiAoIWFzQXJyYXkpXHJcblx0XHRyZXR1cm4gKGFyclswXS52YWx1ZSk7XHJcblx0cmV0dXJuIChhcnIubWFwKGZ1bmN0aW9uIChjKSB7XHJcblx0XHRyZXR1cm4gKGMudmFsdWUpO1xyXG5cdH0pKTtcclxufTtcclxuXHJcbklkZW50aXR5LnByb3RvdHlwZS50b0FycmF5ID0gZnVuY3Rpb24gKGlkeCkge1xyXG5cdHJldHVybiAodGhpcy5jb21wb25lbnRzLm1hcChmdW5jdGlvbiAoYykge1xyXG5cdFx0cmV0dXJuICh7XHJcblx0XHRcdG5hbWU6IGMubmFtZSxcclxuXHRcdFx0dmFsdWU6IGMudmFsdWVcclxuXHRcdH0pO1xyXG5cdH0pKTtcclxufTtcclxuXHJcbi8qXHJcbiAqIFRoZXNlIGFyZSBmcm9tIFguNjgwIC0tIFByaW50YWJsZVN0cmluZyBhbGxvd2VkIGNoYXJzIGFyZSBpbiBzZWN0aW9uIDM3LjRcclxuICogdGFibGUgOC4gU3BlYyBmb3IgSUE1U3RyaW5ncyBpcyBcIjEsNiArIFNQQUNFICsgREVMXCIgd2hlcmUgMSByZWZlcnMgdG9cclxuICogSVNPIElSICMwMDEgKHN0YW5kYXJkIEFTQ0lJIGNvbnRyb2wgY2hhcmFjdGVycykgYW5kIDYgcmVmZXJzIHRvIElTTyBJUiAjMDA2XHJcbiAqICh0aGUgYmFzaWMgQVNDSUkgY2hhcmFjdGVyIHNldCkuXHJcbiAqL1xyXG4vKiBKU1NUWUxFRCAqL1xyXG52YXIgTk9UX1BSSU5UQUJMRSA9IC9bXmEtekEtWjAtOSAnKCksKy5cXC86PT8tXS87XHJcbi8qIEpTU1RZTEVEICovXHJcbnZhciBOT1RfSUE1ID0gL1teXFx4MDAtXFx4N2ZdLztcclxuXHJcbklkZW50aXR5LnByb3RvdHlwZS50b0FzbjEgPSBmdW5jdGlvbiAoZGVyLCB0YWcpIHtcclxuXHRkZXIuc3RhcnRTZXF1ZW5jZSh0YWcpO1xyXG5cdHRoaXMuY29tcG9uZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChjKSB7XHJcblx0XHRkZXIuc3RhcnRTZXF1ZW5jZShhc24xLkJlci5Db25zdHJ1Y3RvciB8IGFzbjEuQmVyLlNldCk7XHJcblx0XHRkZXIuc3RhcnRTZXF1ZW5jZSgpO1xyXG5cdFx0ZGVyLndyaXRlT0lEKGMub2lkKTtcclxuXHRcdC8qXHJcblx0XHQgKiBJZiB3ZSBmaXQgaW4gYSBQcmludGFibGVTdHJpbmcsIHVzZSB0aGF0LiBPdGhlcndpc2UgdXNlIGFuXHJcblx0XHQgKiBJQTVTdHJpbmcgb3IgVVRGOFN0cmluZy5cclxuXHRcdCAqXHJcblx0XHQgKiBJZiB0aGlzIGlkZW50aXR5IHdhcyBwYXJzZWQgZnJvbSBhIEROLCB1c2UgdGhlIEFTTi4xIHR5cGVzXHJcblx0XHQgKiBmcm9tIHRoZSBvcmlnaW5hbCByZXByZXNlbnRhdGlvbiAob3RoZXJ3aXNlIHRoaXMgbWlnaHQgbm90XHJcblx0XHQgKiBiZSBhIGZ1bGwgbWF0Y2ggZm9yIHRoZSBvcmlnaW5hbCBpbiBzb21lIHZhbGlkYXRvcnMpLlxyXG5cdFx0ICovXHJcblx0XHRpZiAoYy5hc24xdHlwZSA9PT0gYXNuMS5CZXIuVXRmOFN0cmluZyB8fFxyXG5cdFx0ICAgIGMudmFsdWUubWF0Y2goTk9UX0lBNSkpIHtcclxuXHRcdFx0dmFyIHYgPSBCdWZmZXIuZnJvbShjLnZhbHVlLCAndXRmOCcpO1xyXG5cdFx0XHRkZXIud3JpdGVCdWZmZXIodiwgYXNuMS5CZXIuVXRmOFN0cmluZyk7XHJcblxyXG5cdFx0fSBlbHNlIGlmIChjLmFzbjF0eXBlID09PSBhc24xLkJlci5JQTVTdHJpbmcgfHxcclxuXHRcdCAgICBjLnZhbHVlLm1hdGNoKE5PVF9QUklOVEFCTEUpKSB7XHJcblx0XHRcdGRlci53cml0ZVN0cmluZyhjLnZhbHVlLCBhc24xLkJlci5JQTVTdHJpbmcpO1xyXG5cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHZhciB0eXBlID0gYXNuMS5CZXIuUHJpbnRhYmxlU3RyaW5nO1xyXG5cdFx0XHRpZiAoYy5hc24xdHlwZSAhPT0gdW5kZWZpbmVkKVxyXG5cdFx0XHRcdHR5cGUgPSBjLmFzbjF0eXBlO1xyXG5cdFx0XHRkZXIud3JpdGVTdHJpbmcoYy52YWx1ZSwgdHlwZSk7XHJcblx0XHR9XHJcblx0XHRkZXIuZW5kU2VxdWVuY2UoKTtcclxuXHRcdGRlci5lbmRTZXF1ZW5jZSgpO1xyXG5cdH0pO1xyXG5cdGRlci5lbmRTZXF1ZW5jZSgpO1xyXG59O1xyXG5cclxuZnVuY3Rpb24gZ2xvYk1hdGNoKGEsIGIpIHtcclxuXHRpZiAoYSA9PT0gJyoqJyB8fCBiID09PSAnKionKVxyXG5cdFx0cmV0dXJuICh0cnVlKTtcclxuXHR2YXIgYVBhcnRzID0gYS5zcGxpdCgnLicpO1xyXG5cdHZhciBiUGFydHMgPSBiLnNwbGl0KCcuJyk7XHJcblx0aWYgKGFQYXJ0cy5sZW5ndGggIT09IGJQYXJ0cy5sZW5ndGgpXHJcblx0XHRyZXR1cm4gKGZhbHNlKTtcclxuXHRmb3IgKHZhciBpID0gMDsgaSA8IGFQYXJ0cy5sZW5ndGg7ICsraSkge1xyXG5cdFx0aWYgKGFQYXJ0c1tpXSA9PT0gJyonIHx8IGJQYXJ0c1tpXSA9PT0gJyonKVxyXG5cdFx0XHRjb250aW51ZTtcclxuXHRcdGlmIChhUGFydHNbaV0gIT09IGJQYXJ0c1tpXSlcclxuXHRcdFx0cmV0dXJuIChmYWxzZSk7XHJcblx0fVxyXG5cdHJldHVybiAodHJ1ZSk7XHJcbn1cclxuXHJcbklkZW50aXR5LnByb3RvdHlwZS5lcXVhbHMgPSBmdW5jdGlvbiAob3RoZXIpIHtcclxuXHRpZiAoIUlkZW50aXR5LmlzSWRlbnRpdHkob3RoZXIsIFsxLCAwXSkpXHJcblx0XHRyZXR1cm4gKGZhbHNlKTtcclxuXHRpZiAob3RoZXIuY29tcG9uZW50cy5sZW5ndGggIT09IHRoaXMuY29tcG9uZW50cy5sZW5ndGgpXHJcblx0XHRyZXR1cm4gKGZhbHNlKTtcclxuXHRmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuY29tcG9uZW50cy5sZW5ndGg7ICsraSkge1xyXG5cdFx0aWYgKHRoaXMuY29tcG9uZW50c1tpXS5vaWQgIT09IG90aGVyLmNvbXBvbmVudHNbaV0ub2lkKVxyXG5cdFx0XHRyZXR1cm4gKGZhbHNlKTtcclxuXHRcdGlmICghZ2xvYk1hdGNoKHRoaXMuY29tcG9uZW50c1tpXS52YWx1ZSxcclxuXHRcdCAgICBvdGhlci5jb21wb25lbnRzW2ldLnZhbHVlKSkge1xyXG5cdFx0XHRyZXR1cm4gKGZhbHNlKTtcclxuXHRcdH1cclxuXHR9XHJcblx0cmV0dXJuICh0cnVlKTtcclxufTtcclxuXHJcbklkZW50aXR5LmZvckhvc3QgPSBmdW5jdGlvbiAoaG9zdG5hbWUpIHtcclxuXHRhc3NlcnQuc3RyaW5nKGhvc3RuYW1lLCAnaG9zdG5hbWUnKTtcclxuXHRyZXR1cm4gKG5ldyBJZGVudGl0eSh7XHJcblx0XHR0eXBlOiAnaG9zdCcsXHJcblx0XHRob3N0bmFtZTogaG9zdG5hbWUsXHJcblx0XHRjb21wb25lbnRzOiBbIHsgbmFtZTogJ2NuJywgdmFsdWU6IGhvc3RuYW1lIH0gXVxyXG5cdH0pKTtcclxufTtcclxuXHJcbklkZW50aXR5LmZvclVzZXIgPSBmdW5jdGlvbiAodWlkKSB7XHJcblx0YXNzZXJ0LnN0cmluZyh1aWQsICd1aWQnKTtcclxuXHRyZXR1cm4gKG5ldyBJZGVudGl0eSh7XHJcblx0XHR0eXBlOiAndXNlcicsXHJcblx0XHR1aWQ6IHVpZCxcclxuXHRcdGNvbXBvbmVudHM6IFsgeyBuYW1lOiAndWlkJywgdmFsdWU6IHVpZCB9IF1cclxuXHR9KSk7XHJcbn07XHJcblxyXG5JZGVudGl0eS5mb3JFbWFpbCA9IGZ1bmN0aW9uIChlbWFpbCkge1xyXG5cdGFzc2VydC5zdHJpbmcoZW1haWwsICdlbWFpbCcpO1xyXG5cdHJldHVybiAobmV3IElkZW50aXR5KHtcclxuXHRcdHR5cGU6ICdlbWFpbCcsXHJcblx0XHRlbWFpbDogZW1haWwsXHJcblx0XHRjb21wb25lbnRzOiBbIHsgbmFtZTogJ21haWwnLCB2YWx1ZTogZW1haWwgfSBdXHJcblx0fSkpO1xyXG59O1xyXG5cclxuSWRlbnRpdHkucGFyc2VETiA9IGZ1bmN0aW9uIChkbikge1xyXG5cdGFzc2VydC5zdHJpbmcoZG4sICdkbicpO1xyXG5cdHZhciBwYXJ0cyA9IFsnJ107XHJcblx0dmFyIGlkeCA9IDA7XHJcblx0dmFyIHJlbSA9IGRuO1xyXG5cdHdoaWxlIChyZW0ubGVuZ3RoID4gMCkge1xyXG5cdFx0dmFyIG07XHJcblx0XHQvKkpTU1RZTEVEKi9cclxuXHRcdGlmICgobSA9IC9eLC8uZXhlYyhyZW0pKSAhPT0gbnVsbCkge1xyXG5cdFx0XHRwYXJ0c1srK2lkeF0gPSAnJztcclxuXHRcdFx0cmVtID0gcmVtLnNsaWNlKG1bMF0ubGVuZ3RoKTtcclxuXHRcdC8qSlNTVFlMRUQqL1xyXG5cdFx0fSBlbHNlIGlmICgobSA9IC9eXFxcXCwvLmV4ZWMocmVtKSkgIT09IG51bGwpIHtcclxuXHRcdFx0cGFydHNbaWR4XSArPSAnLCc7XHJcblx0XHRcdHJlbSA9IHJlbS5zbGljZShtWzBdLmxlbmd0aCk7XHJcblx0XHQvKkpTU1RZTEVEKi9cclxuXHRcdH0gZWxzZSBpZiAoKG0gPSAvXlxcXFwuLy5leGVjKHJlbSkpICE9PSBudWxsKSB7XHJcblx0XHRcdHBhcnRzW2lkeF0gKz0gbVswXTtcclxuXHRcdFx0cmVtID0gcmVtLnNsaWNlKG1bMF0ubGVuZ3RoKTtcclxuXHRcdC8qSlNTVFlMRUQqL1xyXG5cdFx0fSBlbHNlIGlmICgobSA9IC9eW15cXFxcLF0rLy5leGVjKHJlbSkpICE9PSBudWxsKSB7XHJcblx0XHRcdHBhcnRzW2lkeF0gKz0gbVswXTtcclxuXHRcdFx0cmVtID0gcmVtLnNsaWNlKG1bMF0ubGVuZ3RoKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRocm93IChuZXcgRXJyb3IoJ0ZhaWxlZCB0byBwYXJzZSBETicpKTtcclxuXHRcdH1cclxuXHR9XHJcblx0dmFyIGNtcHMgPSBwYXJ0cy5tYXAoZnVuY3Rpb24gKGMpIHtcclxuXHRcdGMgPSBjLnRyaW0oKTtcclxuXHRcdHZhciBlcVBvcyA9IGMuaW5kZXhPZignPScpO1xyXG5cdFx0d2hpbGUgKGVxUG9zID4gMCAmJiBjLmNoYXJBdChlcVBvcyAtIDEpID09PSAnXFxcXCcpXHJcblx0XHRcdGVxUG9zID0gYy5pbmRleE9mKCc9JywgZXFQb3MgKyAxKTtcclxuXHRcdGlmIChlcVBvcyA9PT0gLTEpIHtcclxuXHRcdFx0dGhyb3cgKG5ldyBFcnJvcignRmFpbGVkIHRvIHBhcnNlIEROJykpO1xyXG5cdFx0fVxyXG5cdFx0LypKU1NUWUxFRCovXHJcblx0XHR2YXIgbmFtZSA9IGMuc2xpY2UoMCwgZXFQb3MpLnRvTG93ZXJDYXNlKCkucmVwbGFjZSgvXFxcXD0vZywgJz0nKTtcclxuXHRcdHZhciB2YWx1ZSA9IGMuc2xpY2UoZXFQb3MgKyAxKTtcclxuXHRcdHJldHVybiAoeyBuYW1lOiBuYW1lLCB2YWx1ZTogdmFsdWUgfSk7XHJcblx0fSk7XHJcblx0cmV0dXJuIChuZXcgSWRlbnRpdHkoeyBjb21wb25lbnRzOiBjbXBzIH0pKTtcclxufTtcclxuXHJcbklkZW50aXR5LmZyb21BcnJheSA9IGZ1bmN0aW9uIChjb21wb25lbnRzKSB7XHJcblx0YXNzZXJ0LmFycmF5T2ZPYmplY3QoY29tcG9uZW50cywgJ2NvbXBvbmVudHMnKTtcclxuXHRjb21wb25lbnRzLmZvckVhY2goZnVuY3Rpb24gKGNtcCkge1xyXG5cdFx0YXNzZXJ0Lm9iamVjdChjbXAsICdjb21wb25lbnQnKTtcclxuXHRcdGFzc2VydC5zdHJpbmcoY21wLm5hbWUsICdjb21wb25lbnQubmFtZScpO1xyXG5cdFx0aWYgKCFCdWZmZXIuaXNCdWZmZXIoY21wLnZhbHVlKSAmJlxyXG5cdFx0ICAgICEodHlwZW9mIChjbXAudmFsdWUpID09PSAnc3RyaW5nJykpIHtcclxuXHRcdFx0dGhyb3cgKG5ldyBFcnJvcignSW52YWxpZCBjb21wb25lbnQgdmFsdWUnKSk7XHJcblx0XHR9XHJcblx0fSk7XHJcblx0cmV0dXJuIChuZXcgSWRlbnRpdHkoeyBjb21wb25lbnRzOiBjb21wb25lbnRzIH0pKTtcclxufTtcclxuXHJcbklkZW50aXR5LnBhcnNlQXNuMSA9IGZ1bmN0aW9uIChkZXIsIHRvcCkge1xyXG5cdHZhciBjb21wb25lbnRzID0gW107XHJcblx0ZGVyLnJlYWRTZXF1ZW5jZSh0b3ApO1xyXG5cdHZhciBlbmQgPSBkZXIub2Zmc2V0ICsgZGVyLmxlbmd0aDtcclxuXHR3aGlsZSAoZGVyLm9mZnNldCA8IGVuZCkge1xyXG5cdFx0ZGVyLnJlYWRTZXF1ZW5jZShhc24xLkJlci5Db25zdHJ1Y3RvciB8IGFzbjEuQmVyLlNldCk7XHJcblx0XHR2YXIgYWZ0ZXIgPSBkZXIub2Zmc2V0ICsgZGVyLmxlbmd0aDtcclxuXHRcdGRlci5yZWFkU2VxdWVuY2UoKTtcclxuXHRcdHZhciBvaWQgPSBkZXIucmVhZE9JRCgpO1xyXG5cdFx0dmFyIHR5cGUgPSBkZXIucGVlaygpO1xyXG5cdFx0dmFyIHZhbHVlO1xyXG5cdFx0c3dpdGNoICh0eXBlKSB7XHJcblx0XHRjYXNlIGFzbjEuQmVyLlByaW50YWJsZVN0cmluZzpcclxuXHRcdGNhc2UgYXNuMS5CZXIuSUE1U3RyaW5nOlxyXG5cdFx0Y2FzZSBhc24xLkJlci5PY3RldFN0cmluZzpcclxuXHRcdGNhc2UgYXNuMS5CZXIuVDYxU3RyaW5nOlxyXG5cdFx0XHR2YWx1ZSA9IGRlci5yZWFkU3RyaW5nKHR5cGUpO1xyXG5cdFx0XHRicmVhaztcclxuXHRcdGNhc2UgYXNuMS5CZXIuVXRmOFN0cmluZzpcclxuXHRcdFx0dmFsdWUgPSBkZXIucmVhZFN0cmluZyh0eXBlLCB0cnVlKTtcclxuXHRcdFx0dmFsdWUgPSB2YWx1ZS50b1N0cmluZygndXRmOCcpO1xyXG5cdFx0XHRicmVhaztcclxuXHRcdGNhc2UgYXNuMS5CZXIuQ2hhcmFjdGVyU3RyaW5nOlxyXG5cdFx0Y2FzZSBhc24xLkJlci5CTVBTdHJpbmc6XHJcblx0XHRcdHZhbHVlID0gZGVyLnJlYWRTdHJpbmcodHlwZSwgdHJ1ZSk7XHJcblx0XHRcdHZhbHVlID0gdmFsdWUudG9TdHJpbmcoJ3V0ZjE2bGUnKTtcclxuXHRcdFx0YnJlYWs7XHJcblx0XHRkZWZhdWx0OlxyXG5cdFx0XHR0aHJvdyAobmV3IEVycm9yKCdVbmtub3duIGFzbjEgdHlwZSAnICsgdHlwZSkpO1xyXG5cdFx0fVxyXG5cdFx0Y29tcG9uZW50cy5wdXNoKHsgb2lkOiBvaWQsIGFzbjF0eXBlOiB0eXBlLCB2YWx1ZTogdmFsdWUgfSk7XHJcblx0XHRkZXIuX29mZnNldCA9IGFmdGVyO1xyXG5cdH1cclxuXHRkZXIuX29mZnNldCA9IGVuZDtcclxuXHRyZXR1cm4gKG5ldyBJZGVudGl0eSh7XHJcblx0XHRjb21wb25lbnRzOiBjb21wb25lbnRzXHJcblx0fSkpO1xyXG59O1xyXG5cclxuSWRlbnRpdHkuaXNJZGVudGl0eSA9IGZ1bmN0aW9uIChvYmosIHZlcikge1xyXG5cdHJldHVybiAodXRpbHMuaXNDb21wYXRpYmxlKG9iaiwgSWRlbnRpdHksIHZlcikpO1xyXG59O1xyXG5cclxuLypcclxuICogQVBJIHZlcnNpb25zIGZvciBJZGVudGl0eTpcclxuICogWzEsMF0gLS0gaW5pdGlhbCB2ZXJcclxuICovXHJcbklkZW50aXR5LnByb3RvdHlwZS5fc3NocGtBcGlWZXJzaW9uID0gWzEsIDBdO1xyXG5cclxuSWRlbnRpdHkuX29sZFZlcnNpb25EZXRlY3QgPSBmdW5jdGlvbiAob2JqKSB7XHJcblx0cmV0dXJuIChbMSwgMF0pO1xyXG59O1xyXG4iXSwic291cmNlUm9vdCI6IiJ9