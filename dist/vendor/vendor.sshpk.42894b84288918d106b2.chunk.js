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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvc3NocGsvbGliL2Zvcm1hdHMvcGtjczEuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3NzaHBrL2xpYi9mb3JtYXRzL29wZW5zc2gtY2VydC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvc3NocGsvbGliL2Zvcm1hdHMvc3NoLXByaXZhdGUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3NzaHBrL2xpYi9mb3JtYXRzL2F1dG8uanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3NzaHBrL2xpYi91dGlscy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvc3NocGsvbGliL2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9zc2hway9saWIvZm9ybWF0cy94NTA5LXBlbS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvc3NocGsvbGliL2Vycm9ycy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvc3NocGsvbGliL2Zvcm1hdHMveDUwOS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvc3NocGsvbGliL3ByaXZhdGUta2V5LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9zc2hway9saWIvZm9ybWF0cy9wZW0uanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3NzaHBrL2xpYi9lZC1jb21wYXQuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3NzaHBrL2xpYi9mb3JtYXRzL2Ruc3NlYy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvc3NocGsvbGliL2Zvcm1hdHMvcGtjczguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3NzaHBrL2xpYi9zaWduYXR1cmUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3NzaHBrL2xpYi9mb3JtYXRzL3B1dHR5LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9zc2hway9saWIvc3NoLWJ1ZmZlci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvc3NocGsvbGliL2Zvcm1hdHMvc3NoLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9zc2hway9saWIvZm9ybWF0cy9yZmM0MjUzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9zc2hway9saWIvY2VydGlmaWNhdGUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3NzaHBrL2xpYi9rZXkuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3NzaHBrL2xpYi9hbGdzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9zc2hway9saWIvZmluZ2VycHJpbnQuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3NzaHBrL2xpYi9kaGUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3NzaHBrL2xpYi9pZGVudGl0eS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsYUFBYSxtQkFBTyxDQUFDLHlCQUFhO0FBQ2xDLFdBQVcsbUJBQU8sQ0FBQyxrQkFBTTtBQUN6QixhQUFhLG1CQUFPLENBQUMsMEJBQWM7QUFDbkMsV0FBVyxtQkFBTyxDQUFDLHFCQUFTO0FBQzVCLFlBQVksbUJBQU8sQ0FBQyxzQkFBVTs7QUFFOUIsVUFBVSxtQkFBTyxDQUFDLG9CQUFRO0FBQzFCLGlCQUFpQixtQkFBTyxDQUFDLDRCQUFnQjtBQUN6QyxVQUFVLG1CQUFPLENBQUMsbUJBQU87O0FBRXpCLFlBQVksbUJBQU8sQ0FBQyxxQkFBUztBQUM3Qjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLHFCQUFxQjtBQUN6QixJQUFJO0FBQ0o7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLHFCQUFxQjtBQUN6QixJQUFJLHFCQUFxQjtBQUN6QixJQUFJLHFCQUFxQjtBQUN6QixJQUFJLDJCQUEyQjtBQUMvQixJQUFJLHFCQUFxQjtBQUN6QixJQUFJLHFCQUFxQjtBQUN6QixJQUFJLDZCQUE2QjtBQUNqQyxJQUFJO0FBQ0o7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxxQkFBcUI7QUFDekIsSUFBSSxxQkFBcUI7QUFDekIsSUFBSSxxQkFBcUI7QUFDekIsSUFBSSxxQkFBcUI7QUFDekIsSUFBSTtBQUNKO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLGdEQUFnRDtBQUNwRCxJQUFJO0FBQ0o7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsSUFBSSxxQkFBcUI7QUFDekIsSUFBSSxxQkFBcUI7QUFDekIsSUFBSSxxQkFBcUI7QUFDekIsSUFBSTtBQUNKO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLGdCQUFnQixtQkFBbUI7QUFDbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUksMENBQTBDO0FBQzlDLElBQUk7QUFDSjtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLDBDQUEwQztBQUM5QyxJQUFJLHFCQUFxQjtBQUN6QixJQUFJO0FBQ0o7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLG1DQUFtQztBQUNuQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNwWEE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGFBQWEsbUJBQU8sQ0FBQyx5QkFBYTtBQUNsQyxnQkFBZ0IsbUJBQU8sQ0FBQywyQkFBZTtBQUN2QyxhQUFhLG1CQUFPLENBQUMsb0JBQVE7QUFDN0IsYUFBYSxtQkFBTyxDQUFDLDBCQUFjO0FBQ25DLFdBQVcsbUJBQU8sQ0FBQyxxQkFBUztBQUM1QixVQUFVLG1CQUFPLENBQUMsb0JBQVE7QUFDMUIsaUJBQWlCLG1CQUFPLENBQUMsNEJBQWdCO0FBQ3pDLGVBQWUsbUJBQU8sQ0FBQyx5QkFBYTtBQUNwQyxjQUFjLG1CQUFPLENBQUMsdUJBQVc7QUFDakMsZ0JBQWdCLG1CQUFPLENBQUMsMEJBQWM7QUFDdEMsWUFBWSxtQkFBTyxDQUFDLHNCQUFVO0FBQzlCLGtCQUFrQixtQkFBTyxDQUFDLDRCQUFnQjs7QUFFMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5Q0FBeUMscUJBQXFCLEVBQUU7O0FBRWhFOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDZCQUE2QixlQUFlO0FBQzVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsZ0JBQWdCLDBCQUEwQjtBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSw4QkFBOEIsZUFBZTtBQUM3QztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFOztBQUVGO0FBQ0E7O0FBRUE7QUFDQSw2QkFBNkIsOEJBQThCO0FBQzNEO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUIsOEJBQThCO0FBQ3ZEO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDJCQUEyQjtBQUMzQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTs7QUFFRjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsMkJBQTJCO0FBQzNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsOEJBQThCO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7O0FBRUEsMEJBQTBCO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FB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QUFlO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0IsZ0JBQWdCO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxvQkFBb0I7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLG9CQUFvQjtBQUNwQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtB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Q0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSixHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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O0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxzQkFBc0I7O0FBRXRCLHNCQUFzQjtBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsc0JBQXNCO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxFQUFFO0FBQ0Y7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0IsZ0JBQWdCO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7O0FDalNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFdBQVcsbUJBQU8sQ0FBQyx1QkFBVztBQUM5QixhQUFhLG1CQUFPLENBQUMsb0JBQVE7QUFDN0IsV0FBVyxtQkFBTyxDQUFDLGtCQUFNO0FBQ3pCLGFBQWEsbUJBQU8sQ0FBQyx5QkFBYTtBQUNsQyxhQUFhLG1CQUFPLENBQUMsMEJBQWM7QUFDbkMsZ0JBQWdCLG1CQUFPLENBQUMseUJBQWE7O0FBRXJDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsOEJBQThCO0FBQzlCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsRUFBRTtBQUNGOztBQUVBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsOEJBQThCO0FBQzlCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDM0ZBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGFBQWEsbUJBQU8sQ0FBQyx5QkFBYTtBQUNsQyxhQUFhLG1CQUFPLENBQUMsMEJBQWM7QUFDbkMsVUFBVSxtQkFBTyxDQUFDLG9CQUFRO0FBQzFCLGlCQUFpQixtQkFBTyxDQUFDLDRCQUFnQjtBQUN6QyxZQUFZLG1CQUFPLENBQUMsc0JBQVU7QUFDOUIsZ0JBQWdCLG1CQUFPLENBQUMsMkJBQWU7QUFDdkMsVUFBVSxtQkFBTyxDQUFDLG9CQUFROztBQUUxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLDhCQUE4QjtBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIsaUNBQWlDO0FBQ3RELHFCQUFxQiwwQkFBMEI7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUsseUNBQXlDO0FBQzlDLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLG9EQUFvRDtBQUN4RCxJQUFJLG9EQUFvRDtBQUN4RCxJQUFJLG9EQUFvRDtBQUN4RCxJQUFJLG9EQUFvRDtBQUN4RCxJQUFJLG9EQUFvRDtBQUN4RCxJQUFJO0FBQ0osbURBQW1EO0FBQ25ELElBQUk7QUFDSixtREFBbUQ7QUFDbkQsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSyx5Q0FBeUM7QUFDOUMsS0FBSyxvQkFBb0I7QUFDekIsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLG9DQUFvQztBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUM5UkE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxhQUFhLG1CQUFPLENBQUMseUJBQWE7QUFDbEMsV0FBVyxtQkFBTyxDQUFDLGtCQUFNO0FBQ3pCLGFBQWEsbUJBQU8sQ0FBQywwQkFBYztBQUNuQyxXQUFXLG1CQUFPLENBQUMscUJBQVM7QUFDNUIsWUFBWSxtQkFBTyxDQUFDLHNCQUFVO0FBQzlCLFVBQVUsbUJBQU8sQ0FBQyxvQkFBUTtBQUMxQixpQkFBaUIsbUJBQU8sQ0FBQyw0QkFBZ0I7QUFDekMsVUFBVSxtQkFBTyxDQUFDLG1CQUFPOztBQUV6QjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxxQkFBcUI7QUFDekIsSUFBSTtBQUNKO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLHFCQUFxQjtBQUN6QixJQUFJLHFCQUFxQjtBQUN6QixJQUFJLHFCQUFxQjtBQUN6QixJQUFJLDJCQUEyQjtBQUMvQixJQUFJLHFCQUFxQjtBQUN6QixJQUFJLHFCQUFxQjtBQUN6QixJQUFJLDZCQUE2QjtBQUNqQyxJQUFJO0FBQ0o7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUkscUJBQXFCO0FBQ3pCLElBQUkscUJBQXFCO0FBQ3pCLElBQUkscUJBQXFCO0FBQ3pCLElBQUk7QUFDSjtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUkscUJBQXFCO0FBQ3pCLElBQUkscUJBQXFCO0FBQ3pCLElBQUkscUJBQXFCO0FBQ3pCLElBQUkscUJBQXFCO0FBQ3pCLElBQUk7QUFDSjtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxhQUFhLHVCQUF1QjtBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxhQUFhLHVCQUF1QjtBQUNwQztBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsZUFBZTtBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFD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QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLGlCQUFpQjtBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxFQUFFOztBQUVGOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQjtBQUNoQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7O0FBRUY7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7OztBQ3JTQTs7QUFFQSxhQUFhLG1CQUFPLENBQUMsMEJBQWM7O0FBRW5DO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ3ZLQTs7QUFFQTs7QUFFQSxhQUFhLG1CQUFPLENBQUMseUJBQWE7QUFDbEMsYUFBYSxtQkFBTyxDQUFDLDBCQUFjO0FBQ25DLFdBQVcsbUJBQU8sQ0FBQyxvQkFBUTtBQUMzQixhQUFhLG1CQUFPLENBQUMsb0JBQVE7QUFDN0IsV0FBVyxtQkFBTyxDQUFDLHNCQUFVO0FBQzdCLFVBQVUsbUJBQU8sQ0FBQyxtQkFBTztBQUN6QixpQkFBaUIsbUJBQU8sQ0FBQywyQkFBZTtBQUN4QyxrQkFBa0IsbUJBQU8sQ0FBQywyQkFBZTtBQUN6QyxZQUFZLG1CQUFPLENBQUMscUJBQVM7O0FBRTdCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0Esb0NBQW9DLHdCQUF3QixFQUFFO0FBQzlEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGOztBQUVBO0FBQ0E7QUFDQSx1QkFBdUIsRUFBRTtBQUN6Qjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLHlDQUF5QztBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSIsImZpbGUiOiJ2ZW5kb3IvdmVuZG9yLnNzaHBrLjQyODk0Yjg0Mjg4OTE4ZDEwNmIyLmNodW5rLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IDIwMTUgSm95ZW50LCBJbmMuXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRyZWFkOiByZWFkLFxuXHRyZWFkUGtjczE6IHJlYWRQa2NzMSxcblx0d3JpdGU6IHdyaXRlLFxuXHR3cml0ZVBrY3MxOiB3cml0ZVBrY3MxXG59O1xuXG52YXIgYXNzZXJ0ID0gcmVxdWlyZSgnYXNzZXJ0LXBsdXMnKTtcbnZhciBhc24xID0gcmVxdWlyZSgnYXNuMScpO1xudmFyIEJ1ZmZlciA9IHJlcXVpcmUoJ3NhZmVyLWJ1ZmZlcicpLkJ1ZmZlcjtcbnZhciBhbGdzID0gcmVxdWlyZSgnLi4vYWxncycpO1xudmFyIHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbHMnKTtcblxudmFyIEtleSA9IHJlcXVpcmUoJy4uL2tleScpO1xudmFyIFByaXZhdGVLZXkgPSByZXF1aXJlKCcuLi9wcml2YXRlLWtleScpO1xudmFyIHBlbSA9IHJlcXVpcmUoJy4vcGVtJyk7XG5cbnZhciBwa2NzOCA9IHJlcXVpcmUoJy4vcGtjczgnKTtcbnZhciByZWFkRUNEU0FDdXJ2ZSA9IHBrY3M4LnJlYWRFQ0RTQUN1cnZlO1xuXG5mdW5jdGlvbiByZWFkKGJ1Ziwgb3B0aW9ucykge1xuXHRyZXR1cm4gKHBlbS5yZWFkKGJ1Ziwgb3B0aW9ucywgJ3BrY3MxJykpO1xufVxuXG5mdW5jdGlvbiB3cml0ZShrZXksIG9wdGlvbnMpIHtcblx0cmV0dXJuIChwZW0ud3JpdGUoa2V5LCBvcHRpb25zLCAncGtjczEnKSk7XG59XG5cbi8qIEhlbHBlciB0byByZWFkIGluIGEgc2luZ2xlIG1waW50ICovXG5mdW5jdGlvbiByZWFkTVBJbnQoZGVyLCBubSkge1xuXHRhc3NlcnQuc3RyaWN0RXF1YWwoZGVyLnBlZWsoKSwgYXNuMS5CZXIuSW50ZWdlcixcblx0ICAgIG5tICsgJyBpcyBub3QgYW4gSW50ZWdlcicpO1xuXHRyZXR1cm4gKHV0aWxzLm1wTm9ybWFsaXplKGRlci5yZWFkU3RyaW5nKGFzbjEuQmVyLkludGVnZXIsIHRydWUpKSk7XG59XG5cbmZ1bmN0aW9uIHJlYWRQa2NzMShhbGcsIHR5cGUsIGRlcikge1xuXHRzd2l0Y2ggKGFsZykge1xuXHRjYXNlICdSU0EnOlxuXHRcdGlmICh0eXBlID09PSAncHVibGljJylcblx0XHRcdHJldHVybiAocmVhZFBrY3MxUlNBUHVibGljKGRlcikpO1xuXHRcdGVsc2UgaWYgKHR5cGUgPT09ICdwcml2YXRlJylcblx0XHRcdHJldHVybiAocmVhZFBrY3MxUlNBUHJpdmF0ZShkZXIpKTtcblx0XHR0aHJvdyAobmV3IEVycm9yKCdVbmtub3duIGtleSB0eXBlOiAnICsgdHlwZSkpO1xuXHRjYXNlICdEU0EnOlxuXHRcdGlmICh0eXBlID09PSAncHVibGljJylcblx0XHRcdHJldHVybiAocmVhZFBrY3MxRFNBUHVibGljKGRlcikpO1xuXHRcdGVsc2UgaWYgKHR5cGUgPT09ICdwcml2YXRlJylcblx0XHRcdHJldHVybiAocmVhZFBrY3MxRFNBUHJpdmF0ZShkZXIpKTtcblx0XHR0aHJvdyAobmV3IEVycm9yKCdVbmtub3duIGtleSB0eXBlOiAnICsgdHlwZSkpO1xuXHRjYXNlICdFQyc6XG5cdGNhc2UgJ0VDRFNBJzpcblx0XHRpZiAodHlwZSA9PT0gJ3ByaXZhdGUnKVxuXHRcdFx0cmV0dXJuIChyZWFkUGtjczFFQ0RTQVByaXZhdGUoZGVyKSk7XG5cdFx0ZWxzZSBpZiAodHlwZSA9PT0gJ3B1YmxpYycpXG5cdFx0XHRyZXR1cm4gKHJlYWRQa2NzMUVDRFNBUHVibGljKGRlcikpO1xuXHRcdHRocm93IChuZXcgRXJyb3IoJ1Vua25vd24ga2V5IHR5cGU6ICcgKyB0eXBlKSk7XG5cdGNhc2UgJ0VERFNBJzpcblx0Y2FzZSAnRWREU0EnOlxuXHRcdGlmICh0eXBlID09PSAncHJpdmF0ZScpXG5cdFx0XHRyZXR1cm4gKHJlYWRQa2NzMUVkRFNBUHJpdmF0ZShkZXIpKTtcblx0XHR0aHJvdyAobmV3IEVycm9yKHR5cGUgKyAnIGtleXMgbm90IHN1cHBvcnRlZCB3aXRoIEVkRFNBJykpO1xuXHRkZWZhdWx0OlxuXHRcdHRocm93IChuZXcgRXJyb3IoJ1Vua25vd24ga2V5IGFsZ286ICcgKyBhbGcpKTtcblx0fVxufVxuXG5mdW5jdGlvbiByZWFkUGtjczFSU0FQdWJsaWMoZGVyKSB7XG5cdC8vIG1vZHVsdXMgYW5kIGV4cG9uZW50XG5cdHZhciBuID0gcmVhZE1QSW50KGRlciwgJ21vZHVsdXMnKTtcblx0dmFyIGUgPSByZWFkTVBJbnQoZGVyLCAnZXhwb25lbnQnKTtcblxuXHQvLyBub3csIG1ha2UgdGhlIGtleVxuXHR2YXIga2V5ID0ge1xuXHRcdHR5cGU6ICdyc2EnLFxuXHRcdHBhcnRzOiBbXG5cdFx0XHR7IG5hbWU6ICdlJywgZGF0YTogZSB9LFxuXHRcdFx0eyBuYW1lOiAnbicsIGRhdGE6IG4gfVxuXHRcdF1cblx0fTtcblxuXHRyZXR1cm4gKG5ldyBLZXkoa2V5KSk7XG59XG5cbmZ1bmN0aW9uIHJlYWRQa2NzMVJTQVByaXZhdGUoZGVyKSB7XG5cdHZhciB2ZXJzaW9uID0gcmVhZE1QSW50KGRlciwgJ3ZlcnNpb24nKTtcblx0YXNzZXJ0LnN0cmljdEVxdWFsKHZlcnNpb25bMF0sIDApO1xuXG5cdC8vIG1vZHVsdXMgdGhlbiBwdWJsaWMgZXhwb25lbnRcblx0dmFyIG4gPSByZWFkTVBJbnQoZGVyLCAnbW9kdWx1cycpO1xuXHR2YXIgZSA9IHJlYWRNUEludChkZXIsICdwdWJsaWMgZXhwb25lbnQnKTtcblx0dmFyIGQgPSByZWFkTVBJbnQoZGVyLCAncHJpdmF0ZSBleHBvbmVudCcpO1xuXHR2YXIgcCA9IHJlYWRNUEludChkZXIsICdwcmltZTEnKTtcblx0dmFyIHEgPSByZWFkTVBJbnQoZGVyLCAncHJpbWUyJyk7XG5cdHZhciBkbW9kcCA9IHJlYWRNUEludChkZXIsICdleHBvbmVudDEnKTtcblx0dmFyIGRtb2RxID0gcmVhZE1QSW50KGRlciwgJ2V4cG9uZW50MicpO1xuXHR2YXIgaXFtcCA9IHJlYWRNUEludChkZXIsICdpcW1wJyk7XG5cblx0Ly8gbm93LCBtYWtlIHRoZSBrZXlcblx0dmFyIGtleSA9IHtcblx0XHR0eXBlOiAncnNhJyxcblx0XHRwYXJ0czogW1xuXHRcdFx0eyBuYW1lOiAnbicsIGRhdGE6IG4gfSxcblx0XHRcdHsgbmFtZTogJ2UnLCBkYXRhOiBlIH0sXG5cdFx0XHR7IG5hbWU6ICdkJywgZGF0YTogZCB9LFxuXHRcdFx0eyBuYW1lOiAnaXFtcCcsIGRhdGE6IGlxbXAgfSxcblx0XHRcdHsgbmFtZTogJ3AnLCBkYXRhOiBwIH0sXG5cdFx0XHR7IG5hbWU6ICdxJywgZGF0YTogcSB9LFxuXHRcdFx0eyBuYW1lOiAnZG1vZHAnLCBkYXRhOiBkbW9kcCB9LFxuXHRcdFx0eyBuYW1lOiAnZG1vZHEnLCBkYXRhOiBkbW9kcSB9XG5cdFx0XVxuXHR9O1xuXG5cdHJldHVybiAobmV3IFByaXZhdGVLZXkoa2V5KSk7XG59XG5cbmZ1bmN0aW9uIHJlYWRQa2NzMURTQVByaXZhdGUoZGVyKSB7XG5cdHZhciB2ZXJzaW9uID0gcmVhZE1QSW50KGRlciwgJ3ZlcnNpb24nKTtcblx0YXNzZXJ0LnN0cmljdEVxdWFsKHZlcnNpb24ucmVhZFVJbnQ4KDApLCAwKTtcblxuXHR2YXIgcCA9IHJlYWRNUEludChkZXIsICdwJyk7XG5cdHZhciBxID0gcmVhZE1QSW50KGRlciwgJ3EnKTtcblx0dmFyIGcgPSByZWFkTVBJbnQoZGVyLCAnZycpO1xuXHR2YXIgeSA9IHJlYWRNUEludChkZXIsICd5Jyk7XG5cdHZhciB4ID0gcmVhZE1QSW50KGRlciwgJ3gnKTtcblxuXHQvLyBub3csIG1ha2UgdGhlIGtleVxuXHR2YXIga2V5ID0ge1xuXHRcdHR5cGU6ICdkc2EnLFxuXHRcdHBhcnRzOiBbXG5cdFx0XHR7IG5hbWU6ICdwJywgZGF0YTogcCB9LFxuXHRcdFx0eyBuYW1lOiAncScsIGRhdGE6IHEgfSxcblx0XHRcdHsgbmFtZTogJ2cnLCBkYXRhOiBnIH0sXG5cdFx0XHR7IG5hbWU6ICd5JywgZGF0YTogeSB9LFxuXHRcdFx0eyBuYW1lOiAneCcsIGRhdGE6IHggfVxuXHRcdF1cblx0fTtcblxuXHRyZXR1cm4gKG5ldyBQcml2YXRlS2V5KGtleSkpO1xufVxuXG5mdW5jdGlvbiByZWFkUGtjczFFZERTQVByaXZhdGUoZGVyKSB7XG5cdHZhciB2ZXJzaW9uID0gcmVhZE1QSW50KGRlciwgJ3ZlcnNpb24nKTtcblx0YXNzZXJ0LnN0cmljdEVxdWFsKHZlcnNpb24ucmVhZFVJbnQ4KDApLCAxKTtcblxuXHQvLyBwcml2YXRlIGtleVxuXHR2YXIgayA9IGRlci5yZWFkU3RyaW5nKGFzbjEuQmVyLk9jdGV0U3RyaW5nLCB0cnVlKTtcblxuXHRkZXIucmVhZFNlcXVlbmNlKDB4YTApO1xuXHR2YXIgb2lkID0gZGVyLnJlYWRPSUQoKTtcblx0YXNzZXJ0LnN0cmljdEVxdWFsKG9pZCwgJzEuMy4xMDEuMTEyJywgJ3RoZSBlZDI1NTE5IGN1cnZlIGlkZW50aWZpZXInKTtcblxuXHRkZXIucmVhZFNlcXVlbmNlKDB4YTEpO1xuXHR2YXIgQSA9IHV0aWxzLnJlYWRCaXRTdHJpbmcoZGVyKTtcblxuXHR2YXIga2V5ID0ge1xuXHRcdHR5cGU6ICdlZDI1NTE5Jyxcblx0XHRwYXJ0czogW1xuXHRcdFx0eyBuYW1lOiAnQScsIGRhdGE6IHV0aWxzLnplcm9QYWRUb0xlbmd0aChBLCAzMikgfSxcblx0XHRcdHsgbmFtZTogJ2snLCBkYXRhOiBrIH1cblx0XHRdXG5cdH07XG5cblx0cmV0dXJuIChuZXcgUHJpdmF0ZUtleShrZXkpKTtcbn1cblxuZnVuY3Rpb24gcmVhZFBrY3MxRFNBUHVibGljKGRlcikge1xuXHR2YXIgeSA9IHJlYWRNUEludChkZXIsICd5Jyk7XG5cdHZhciBwID0gcmVhZE1QSW50KGRlciwgJ3AnKTtcblx0dmFyIHEgPSByZWFkTVBJbnQoZGVyLCAncScpO1xuXHR2YXIgZyA9IHJlYWRNUEludChkZXIsICdnJyk7XG5cblx0dmFyIGtleSA9IHtcblx0XHR0eXBlOiAnZHNhJyxcblx0XHRwYXJ0czogW1xuXHRcdFx0eyBuYW1lOiAneScsIGRhdGE6IHkgfSxcblx0XHRcdHsgbmFtZTogJ3AnLCBkYXRhOiBwIH0sXG5cdFx0XHR7IG5hbWU6ICdxJywgZGF0YTogcSB9LFxuXHRcdFx0eyBuYW1lOiAnZycsIGRhdGE6IGcgfVxuXHRcdF1cblx0fTtcblxuXHRyZXR1cm4gKG5ldyBLZXkoa2V5KSk7XG59XG5cbmZ1bmN0aW9uIHJlYWRQa2NzMUVDRFNBUHVibGljKGRlcikge1xuXHRkZXIucmVhZFNlcXVlbmNlKCk7XG5cblx0dmFyIG9pZCA9IGRlci5yZWFkT0lEKCk7XG5cdGFzc2VydC5zdHJpY3RFcXVhbChvaWQsICcxLjIuODQwLjEwMDQ1LjIuMScsICdtdXN0IGJlIGVjUHVibGljS2V5Jyk7XG5cblx0dmFyIGN1cnZlT2lkID0gZGVyLnJlYWRPSUQoKTtcblxuXHR2YXIgY3VydmU7XG5cdHZhciBjdXJ2ZXMgPSBPYmplY3Qua2V5cyhhbGdzLmN1cnZlcyk7XG5cdGZvciAodmFyIGogPSAwOyBqIDwgY3VydmVzLmxlbmd0aDsgKytqKSB7XG5cdFx0dmFyIGMgPSBjdXJ2ZXNbal07XG5cdFx0dmFyIGNkID0gYWxncy5jdXJ2ZXNbY107XG5cdFx0aWYgKGNkLnBrY3M4b2lkID09PSBjdXJ2ZU9pZCkge1xuXHRcdFx0Y3VydmUgPSBjO1xuXHRcdFx0YnJlYWs7XG5cdFx0fVxuXHR9XG5cdGFzc2VydC5zdHJpbmcoY3VydmUsICdhIGtub3duIEVDRFNBIG5hbWVkIGN1cnZlJyk7XG5cblx0dmFyIFEgPSBkZXIucmVhZFN0cmluZyhhc24xLkJlci5CaXRTdHJpbmcsIHRydWUpO1xuXHRRID0gdXRpbHMuZWNOb3JtYWxpemUoUSk7XG5cblx0dmFyIGtleSA9IHtcblx0XHR0eXBlOiAnZWNkc2EnLFxuXHRcdHBhcnRzOiBbXG5cdFx0XHR7IG5hbWU6ICdjdXJ2ZScsIGRhdGE6IEJ1ZmZlci5mcm9tKGN1cnZlKSB9LFxuXHRcdFx0eyBuYW1lOiAnUScsIGRhdGE6IFEgfVxuXHRcdF1cblx0fTtcblxuXHRyZXR1cm4gKG5ldyBLZXkoa2V5KSk7XG59XG5cbmZ1bmN0aW9uIHJlYWRQa2NzMUVDRFNBUHJpdmF0ZShkZXIpIHtcblx0dmFyIHZlcnNpb24gPSByZWFkTVBJbnQoZGVyLCAndmVyc2lvbicpO1xuXHRhc3NlcnQuc3RyaWN0RXF1YWwodmVyc2lvbi5yZWFkVUludDgoMCksIDEpO1xuXG5cdC8vIHByaXZhdGUga2V5XG5cdHZhciBkID0gZGVyLnJlYWRTdHJpbmcoYXNuMS5CZXIuT2N0ZXRTdHJpbmcsIHRydWUpO1xuXG5cdGRlci5yZWFkU2VxdWVuY2UoMHhhMCk7XG5cdHZhciBjdXJ2ZSA9IHJlYWRFQ0RTQUN1cnZlKGRlcik7XG5cdGFzc2VydC5zdHJpbmcoY3VydmUsICdhIGtub3duIGVsbGlwdGljIGN1cnZlJyk7XG5cblx0ZGVyLnJlYWRTZXF1ZW5jZSgweGExKTtcblx0dmFyIFEgPSBkZXIucmVhZFN0cmluZyhhc24xLkJlci5CaXRTdHJpbmcsIHRydWUpO1xuXHRRID0gdXRpbHMuZWNOb3JtYWxpemUoUSk7XG5cblx0dmFyIGtleSA9IHtcblx0XHR0eXBlOiAnZWNkc2EnLFxuXHRcdHBhcnRzOiBbXG5cdFx0XHR7IG5hbWU6ICdjdXJ2ZScsIGRhdGE6IEJ1ZmZlci5mcm9tKGN1cnZlKSB9LFxuXHRcdFx0eyBuYW1lOiAnUScsIGRhdGE6IFEgfSxcblx0XHRcdHsgbmFtZTogJ2QnLCBkYXRhOiBkIH1cblx0XHRdXG5cdH07XG5cblx0cmV0dXJuIChuZXcgUHJpdmF0ZUtleShrZXkpKTtcbn1cblxuZnVuY3Rpb24gd3JpdGVQa2NzMShkZXIsIGtleSkge1xuXHRkZXIuc3RhcnRTZXF1ZW5jZSgpO1xuXG5cdHN3aXRjaCAoa2V5LnR5cGUpIHtcblx0Y2FzZSAncnNhJzpcblx0XHRpZiAoUHJpdmF0ZUtleS5pc1ByaXZhdGVLZXkoa2V5KSlcblx0XHRcdHdyaXRlUGtjczFSU0FQcml2YXRlKGRlciwga2V5KTtcblx0XHRlbHNlXG5cdFx0XHR3cml0ZVBrY3MxUlNBUHVibGljKGRlciwga2V5KTtcblx0XHRicmVhaztcblx0Y2FzZSAnZHNhJzpcblx0XHRpZiAoUHJpdmF0ZUtleS5pc1ByaXZhdGVLZXkoa2V5KSlcblx0XHRcdHdyaXRlUGtjczFEU0FQcml2YXRlKGRlciwga2V5KTtcblx0XHRlbHNlXG5cdFx0XHR3cml0ZVBrY3MxRFNBUHVibGljKGRlciwga2V5KTtcblx0XHRicmVhaztcblx0Y2FzZSAnZWNkc2EnOlxuXHRcdGlmIChQcml2YXRlS2V5LmlzUHJpdmF0ZUtleShrZXkpKVxuXHRcdFx0d3JpdGVQa2NzMUVDRFNBUHJpdmF0ZShkZXIsIGtleSk7XG5cdFx0ZWxzZVxuXHRcdFx0d3JpdGVQa2NzMUVDRFNBUHVibGljKGRlciwga2V5KTtcblx0XHRicmVhaztcblx0Y2FzZSAnZWQyNTUxOSc6XG5cdFx0aWYgKFByaXZhdGVLZXkuaXNQcml2YXRlS2V5KGtleSkpXG5cdFx0XHR3cml0ZVBrY3MxRWREU0FQcml2YXRlKGRlciwga2V5KTtcblx0XHRlbHNlXG5cdFx0XHR3cml0ZVBrY3MxRWREU0FQdWJsaWMoZGVyLCBrZXkpO1xuXHRcdGJyZWFrO1xuXHRkZWZhdWx0OlxuXHRcdHRocm93IChuZXcgRXJyb3IoJ1Vua25vd24ga2V5IGFsZ286ICcgKyBrZXkudHlwZSkpO1xuXHR9XG5cblx0ZGVyLmVuZFNlcXVlbmNlKCk7XG59XG5cbmZ1bmN0aW9uIHdyaXRlUGtjczFSU0FQdWJsaWMoZGVyLCBrZXkpIHtcblx0ZGVyLndyaXRlQnVmZmVyKGtleS5wYXJ0Lm4uZGF0YSwgYXNuMS5CZXIuSW50ZWdlcik7XG5cdGRlci53cml0ZUJ1ZmZlcihrZXkucGFydC5lLmRhdGEsIGFzbjEuQmVyLkludGVnZXIpO1xufVxuXG5mdW5jdGlvbiB3cml0ZVBrY3MxUlNBUHJpdmF0ZShkZXIsIGtleSkge1xuXHR2YXIgdmVyID0gQnVmZmVyLmZyb20oWzBdKTtcblx0ZGVyLndyaXRlQnVmZmVyKHZlciwgYXNuMS5CZXIuSW50ZWdlcik7XG5cblx0ZGVyLndyaXRlQnVmZmVyKGtleS5wYXJ0Lm4uZGF0YSwgYXNuMS5CZXIuSW50ZWdlcik7XG5cdGRlci53cml0ZUJ1ZmZlcihrZXkucGFydC5lLmRhdGEsIGFzbjEuQmVyLkludGVnZXIpO1xuXHRkZXIud3JpdGVCdWZmZXIoa2V5LnBhcnQuZC5kYXRhLCBhc24xLkJlci5JbnRlZ2VyKTtcblx0ZGVyLndyaXRlQnVmZmVyKGtleS5wYXJ0LnAuZGF0YSwgYXNuMS5CZXIuSW50ZWdlcik7XG5cdGRlci53cml0ZUJ1ZmZlcihrZXkucGFydC5xLmRhdGEsIGFzbjEuQmVyLkludGVnZXIpO1xuXHRpZiAoIWtleS5wYXJ0LmRtb2RwIHx8ICFrZXkucGFydC5kbW9kcSlcblx0XHR1dGlscy5hZGRSU0FNaXNzaW5nKGtleSk7XG5cdGRlci53cml0ZUJ1ZmZlcihrZXkucGFydC5kbW9kcC5kYXRhLCBhc24xLkJlci5JbnRlZ2VyKTtcblx0ZGVyLndyaXRlQnVmZmVyKGtleS5wYXJ0LmRtb2RxLmRhdGEsIGFzbjEuQmVyLkludGVnZXIpO1xuXHRkZXIud3JpdGVCdWZmZXIoa2V5LnBhcnQuaXFtcC5kYXRhLCBhc24xLkJlci5JbnRlZ2VyKTtcbn1cblxuZnVuY3Rpb24gd3JpdGVQa2NzMURTQVByaXZhdGUoZGVyLCBrZXkpIHtcblx0dmFyIHZlciA9IEJ1ZmZlci5mcm9tKFswXSk7XG5cdGRlci53cml0ZUJ1ZmZlcih2ZXIsIGFzbjEuQmVyLkludGVnZXIpO1xuXG5cdGRlci53cml0ZUJ1ZmZlcihrZXkucGFydC5wLmRhdGEsIGFzbjEuQmVyLkludGVnZXIpO1xuXHRkZXIud3JpdGVCdWZmZXIoa2V5LnBhcnQucS5kYXRhLCBhc24xLkJlci5JbnRlZ2VyKTtcblx0ZGVyLndyaXRlQnVmZmVyKGtleS5wYXJ0LmcuZGF0YSwgYXNuMS5CZXIuSW50ZWdlcik7XG5cdGRlci53cml0ZUJ1ZmZlcihrZXkucGFydC55LmRhdGEsIGFzbjEuQmVyLkludGVnZXIpO1xuXHRkZXIud3JpdGVCdWZmZXIoa2V5LnBhcnQueC5kYXRhLCBhc24xLkJlci5JbnRlZ2VyKTtcbn1cblxuZnVuY3Rpb24gd3JpdGVQa2NzMURTQVB1YmxpYyhkZXIsIGtleSkge1xuXHRkZXIud3JpdGVCdWZmZXIoa2V5LnBhcnQueS5kYXRhLCBhc24xLkJlci5JbnRlZ2VyKTtcblx0ZGVyLndyaXRlQnVmZmVyKGtleS5wYXJ0LnAuZGF0YSwgYXNuMS5CZXIuSW50ZWdlcik7XG5cdGRlci53cml0ZUJ1ZmZlcihrZXkucGFydC5xLmRhdGEsIGFzbjEuQmVyLkludGVnZXIpO1xuXHRkZXIud3JpdGVCdWZmZXIoa2V5LnBhcnQuZy5kYXRhLCBhc24xLkJlci5JbnRlZ2VyKTtcbn1cblxuZnVuY3Rpb24gd3JpdGVQa2NzMUVDRFNBUHVibGljKGRlciwga2V5KSB7XG5cdGRlci5zdGFydFNlcXVlbmNlKCk7XG5cblx0ZGVyLndyaXRlT0lEKCcxLjIuODQwLjEwMDQ1LjIuMScpOyAvKiBlY1B1YmxpY0tleSAqL1xuXHR2YXIgY3VydmUgPSBrZXkucGFydC5jdXJ2ZS5kYXRhLnRvU3RyaW5nKCk7XG5cdHZhciBjdXJ2ZU9pZCA9IGFsZ3MuY3VydmVzW2N1cnZlXS5wa2NzOG9pZDtcblx0YXNzZXJ0LnN0cmluZyhjdXJ2ZU9pZCwgJ2Ega25vd24gRUNEU0EgbmFtZWQgY3VydmUnKTtcblx0ZGVyLndyaXRlT0lEKGN1cnZlT2lkKTtcblxuXHRkZXIuZW5kU2VxdWVuY2UoKTtcblxuXHR2YXIgUSA9IHV0aWxzLmVjTm9ybWFsaXplKGtleS5wYXJ0LlEuZGF0YSwgdHJ1ZSk7XG5cdGRlci53cml0ZUJ1ZmZlcihRLCBhc24xLkJlci5CaXRTdHJpbmcpO1xufVxuXG5mdW5jdGlvbiB3cml0ZVBrY3MxRUNEU0FQcml2YXRlKGRlciwga2V5KSB7XG5cdHZhciB2ZXIgPSBCdWZmZXIuZnJvbShbMV0pO1xuXHRkZXIud3JpdGVCdWZmZXIodmVyLCBhc24xLkJlci5JbnRlZ2VyKTtcblxuXHRkZXIud3JpdGVCdWZmZXIoa2V5LnBhcnQuZC5kYXRhLCBhc24xLkJlci5PY3RldFN0cmluZyk7XG5cblx0ZGVyLnN0YXJ0U2VxdWVuY2UoMHhhMCk7XG5cdHZhciBjdXJ2ZSA9IGtleS5wYXJ0LmN1cnZlLmRhdGEudG9TdHJpbmcoKTtcblx0dmFyIGN1cnZlT2lkID0gYWxncy5jdXJ2ZXNbY3VydmVdLnBrY3M4b2lkO1xuXHRhc3NlcnQuc3RyaW5nKGN1cnZlT2lkLCAnYSBrbm93biBFQ0RTQSBuYW1lZCBjdXJ2ZScpO1xuXHRkZXIud3JpdGVPSUQoY3VydmVPaWQpO1xuXHRkZXIuZW5kU2VxdWVuY2UoKTtcblxuXHRkZXIuc3RhcnRTZXF1ZW5jZSgweGExKTtcblx0dmFyIFEgPSB1dGlscy5lY05vcm1hbGl6ZShrZXkucGFydC5RLmRhdGEsIHRydWUpO1xuXHRkZXIud3JpdGVCdWZmZXIoUSwgYXNuMS5CZXIuQml0U3RyaW5nKTtcblx0ZGVyLmVuZFNlcXVlbmNlKCk7XG59XG5cbmZ1bmN0aW9uIHdyaXRlUGtjczFFZERTQVByaXZhdGUoZGVyLCBrZXkpIHtcblx0dmFyIHZlciA9IEJ1ZmZlci5mcm9tKFsxXSk7XG5cdGRlci53cml0ZUJ1ZmZlcih2ZXIsIGFzbjEuQmVyLkludGVnZXIpO1xuXG5cdGRlci53cml0ZUJ1ZmZlcihrZXkucGFydC5rLmRhdGEsIGFzbjEuQmVyLk9jdGV0U3RyaW5nKTtcblxuXHRkZXIuc3RhcnRTZXF1ZW5jZSgweGEwKTtcblx0ZGVyLndyaXRlT0lEKCcxLjMuMTAxLjExMicpO1xuXHRkZXIuZW5kU2VxdWVuY2UoKTtcblxuXHRkZXIuc3RhcnRTZXF1ZW5jZSgweGExKTtcblx0dXRpbHMud3JpdGVCaXRTdHJpbmcoZGVyLCBrZXkucGFydC5BLmRhdGEpO1xuXHRkZXIuZW5kU2VxdWVuY2UoKTtcbn1cblxuZnVuY3Rpb24gd3JpdGVQa2NzMUVkRFNBUHVibGljKGRlciwga2V5KSB7XG5cdHRocm93IChuZXcgRXJyb3IoJ1B1YmxpYyBrZXlzIGFyZSBub3Qgc3VwcG9ydGVkIGZvciBFZERTQSBQS0NTIzEnKSk7XG59XG4iLCIvLyBDb3B5cmlnaHQgMjAxNyBKb3llbnQsIEluYy5cblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdHJlYWQ6IHJlYWQsXG5cdHZlcmlmeTogdmVyaWZ5LFxuXHRzaWduOiBzaWduLFxuXHRzaWduQXN5bmM6IHNpZ25Bc3luYyxcblx0d3JpdGU6IHdyaXRlLFxuXG5cdC8qIEludGVybmFsIHByaXZhdGUgQVBJICovXG5cdGZyb21CdWZmZXI6IGZyb21CdWZmZXIsXG5cdHRvQnVmZmVyOiB0b0J1ZmZlclxufTtcblxudmFyIGFzc2VydCA9IHJlcXVpcmUoJ2Fzc2VydC1wbHVzJyk7XG52YXIgU1NIQnVmZmVyID0gcmVxdWlyZSgnLi4vc3NoLWJ1ZmZlcicpO1xudmFyIGNyeXB0byA9IHJlcXVpcmUoJ2NyeXB0bycpO1xudmFyIEJ1ZmZlciA9IHJlcXVpcmUoJ3NhZmVyLWJ1ZmZlcicpLkJ1ZmZlcjtcbnZhciBhbGdzID0gcmVxdWlyZSgnLi4vYWxncycpO1xudmFyIEtleSA9IHJlcXVpcmUoJy4uL2tleScpO1xudmFyIFByaXZhdGVLZXkgPSByZXF1aXJlKCcuLi9wcml2YXRlLWtleScpO1xudmFyIElkZW50aXR5ID0gcmVxdWlyZSgnLi4vaWRlbnRpdHknKTtcbnZhciByZmM0MjUzID0gcmVxdWlyZSgnLi9yZmM0MjUzJyk7XG52YXIgU2lnbmF0dXJlID0gcmVxdWlyZSgnLi4vc2lnbmF0dXJlJyk7XG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlscycpO1xudmFyIENlcnRpZmljYXRlID0gcmVxdWlyZSgnLi4vY2VydGlmaWNhdGUnKTtcblxuZnVuY3Rpb24gdmVyaWZ5KGNlcnQsIGtleSkge1xuXHQvKlxuXHQgKiBXZSBhbHdheXMgZ2l2ZSBhbiBpc3N1ZXJLZXksIHNvIGlmIG91ciB2ZXJpZnkoKSBpcyBiZWluZyBjYWxsZWQgdGhlblxuXHQgKiB0aGVyZSB3YXMgbm8gc2lnbmF0dXJlLiBSZXR1cm4gZmFsc2UuXG5cdCAqL1xuXHRyZXR1cm4gKGZhbHNlKTtcbn1cblxudmFyIFRZUEVTID0ge1xuXHQndXNlcic6IDEsXG5cdCdob3N0JzogMlxufTtcbk9iamVjdC5rZXlzKFRZUEVTKS5mb3JFYWNoKGZ1bmN0aW9uIChrKSB7IFRZUEVTW1RZUEVTW2tdXSA9IGs7IH0pO1xuXG52YXIgRUNEU0FfQUxHTyA9IC9eZWNkc2Etc2hhMi0oW15ALV0rKS1jZXJ0LXYwMUBvcGVuc3NoLmNvbSQvO1xuXG5mdW5jdGlvbiByZWFkKGJ1Ziwgb3B0aW9ucykge1xuXHRpZiAoQnVmZmVyLmlzQnVmZmVyKGJ1ZikpXG5cdFx0YnVmID0gYnVmLnRvU3RyaW5nKCdhc2NpaScpO1xuXHR2YXIgcGFydHMgPSBidWYudHJpbSgpLnNwbGl0KC9bIFxcdFxcbl0rL2cpO1xuXHRpZiAocGFydHMubGVuZ3RoIDwgMiB8fCBwYXJ0cy5sZW5ndGggPiAzKVxuXHRcdHRocm93IChuZXcgRXJyb3IoJ05vdCBhIHZhbGlkIFNTSCBjZXJ0aWZpY2F0ZSBsaW5lJykpO1xuXG5cdHZhciBhbGdvID0gcGFydHNbMF07XG5cdHZhciBkYXRhID0gcGFydHNbMV07XG5cblx0ZGF0YSA9IEJ1ZmZlci5mcm9tKGRhdGEsICdiYXNlNjQnKTtcblx0cmV0dXJuIChmcm9tQnVmZmVyKGRhdGEsIGFsZ28pKTtcbn1cblxuZnVuY3Rpb24gZnJvbUJ1ZmZlcihkYXRhLCBhbGdvLCBwYXJ0aWFsKSB7XG5cdHZhciBzc2hidWYgPSBuZXcgU1NIQnVmZmVyKHsgYnVmZmVyOiBkYXRhIH0pO1xuXHR2YXIgaW5uZXJBbGdvID0gc3NoYnVmLnJlYWRTdHJpbmcoKTtcblx0aWYgKGFsZ28gIT09IHVuZGVmaW5lZCAmJiBpbm5lckFsZ28gIT09IGFsZ28pXG5cdFx0dGhyb3cgKG5ldyBFcnJvcignU1NIIGNlcnRpZmljYXRlIGFsZ29yaXRobSBtaXNtYXRjaCcpKTtcblx0aWYgKGFsZ28gPT09IHVuZGVmaW5lZClcblx0XHRhbGdvID0gaW5uZXJBbGdvO1xuXG5cdHZhciBjZXJ0ID0ge307XG5cdGNlcnQuc2lnbmF0dXJlcyA9IHt9O1xuXHRjZXJ0LnNpZ25hdHVyZXMub3BlbnNzaCA9IHt9O1xuXG5cdGNlcnQuc2lnbmF0dXJlcy5vcGVuc3NoLm5vbmNlID0gc3NoYnVmLnJlYWRCdWZmZXIoKTtcblxuXHR2YXIga2V5ID0ge307XG5cdHZhciBwYXJ0cyA9IChrZXkucGFydHMgPSBbXSk7XG5cdGtleS50eXBlID0gZ2V0QWxnKGFsZ28pO1xuXG5cdHZhciBwYXJ0Q291bnQgPSBhbGdzLmluZm9ba2V5LnR5cGVdLnBhcnRzLmxlbmd0aDtcblx0d2hpbGUgKHBhcnRzLmxlbmd0aCA8IHBhcnRDb3VudClcblx0XHRwYXJ0cy5wdXNoKHNzaGJ1Zi5yZWFkUGFydCgpKTtcblx0YXNzZXJ0Lm9rKHBhcnRzLmxlbmd0aCA+PSAxLCAna2V5IG11c3QgaGF2ZSBhdCBsZWFzdCBvbmUgcGFydCcpO1xuXG5cdHZhciBhbGdJbmZvID0gYWxncy5pbmZvW2tleS50eXBlXTtcblx0aWYgKGtleS50eXBlID09PSAnZWNkc2EnKSB7XG5cdFx0dmFyIHJlcyA9IEVDRFNBX0FMR08uZXhlYyhhbGdvKTtcblx0XHRhc3NlcnQub2socmVzICE9PSBudWxsKTtcblx0XHRhc3NlcnQuc3RyaWN0RXF1YWwocmVzWzFdLCBwYXJ0c1swXS5kYXRhLnRvU3RyaW5nKCkpO1xuXHR9XG5cblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBhbGdJbmZvLnBhcnRzLmxlbmd0aDsgKytpKSB7XG5cdFx0cGFydHNbaV0ubmFtZSA9IGFsZ0luZm8ucGFydHNbaV07XG5cdFx0aWYgKHBhcnRzW2ldLm5hbWUgIT09ICdjdXJ2ZScgJiZcblx0XHQgICAgYWxnSW5mby5ub3JtYWxpemUgIT09IGZhbHNlKSB7XG5cdFx0XHR2YXIgcCA9IHBhcnRzW2ldO1xuXHRcdFx0cC5kYXRhID0gdXRpbHMubXBOb3JtYWxpemUocC5kYXRhKTtcblx0XHR9XG5cdH1cblxuXHRjZXJ0LnN1YmplY3RLZXkgPSBuZXcgS2V5KGtleSk7XG5cblx0Y2VydC5zZXJpYWwgPSBzc2hidWYucmVhZEludDY0KCk7XG5cblx0dmFyIHR5cGUgPSBUWVBFU1tzc2hidWYucmVhZEludCgpXTtcblx0YXNzZXJ0LnN0cmluZyh0eXBlLCAndmFsaWQgY2VydCB0eXBlJyk7XG5cblx0Y2VydC5zaWduYXR1cmVzLm9wZW5zc2gua2V5SWQgPSBzc2hidWYucmVhZFN0cmluZygpO1xuXG5cdHZhciBwcmluY2lwYWxzID0gW107XG5cdHZhciBwYnVmID0gc3NoYnVmLnJlYWRCdWZmZXIoKTtcblx0dmFyIHBzc2hidWYgPSBuZXcgU1NIQnVmZmVyKHsgYnVmZmVyOiBwYnVmIH0pO1xuXHR3aGlsZSAoIXBzc2hidWYuYXRFbmQoKSlcblx0XHRwcmluY2lwYWxzLnB1c2gocHNzaGJ1Zi5yZWFkU3RyaW5nKCkpO1xuXHRpZiAocHJpbmNpcGFscy5sZW5ndGggPT09IDApXG5cdFx0cHJpbmNpcGFscyA9IFsnKiddO1xuXG5cdGNlcnQuc3ViamVjdHMgPSBwcmluY2lwYWxzLm1hcChmdW5jdGlvbiAocHIpIHtcblx0XHRpZiAodHlwZSA9PT0gJ3VzZXInKVxuXHRcdFx0cmV0dXJuIChJZGVudGl0eS5mb3JVc2VyKHByKSk7XG5cdFx0ZWxzZSBpZiAodHlwZSA9PT0gJ2hvc3QnKVxuXHRcdFx0cmV0dXJuIChJZGVudGl0eS5mb3JIb3N0KHByKSk7XG5cdFx0dGhyb3cgKG5ldyBFcnJvcignVW5rbm93biBpZGVudGl0eSB0eXBlICcgKyB0eXBlKSk7XG5cdH0pO1xuXG5cdGNlcnQudmFsaWRGcm9tID0gaW50NjRUb0RhdGUoc3NoYnVmLnJlYWRJbnQ2NCgpKTtcblx0Y2VydC52YWxpZFVudGlsID0gaW50NjRUb0RhdGUoc3NoYnVmLnJlYWRJbnQ2NCgpKTtcblxuXHR2YXIgZXh0cyA9IFtdO1xuXHR2YXIgZXh0YnVmID0gbmV3IFNTSEJ1ZmZlcih7IGJ1ZmZlcjogc3NoYnVmLnJlYWRCdWZmZXIoKSB9KTtcblx0dmFyIGV4dDtcblx0d2hpbGUgKCFleHRidWYuYXRFbmQoKSkge1xuXHRcdGV4dCA9IHsgY3JpdGljYWw6IHRydWUgfTtcblx0XHRleHQubmFtZSA9IGV4dGJ1Zi5yZWFkU3RyaW5nKCk7XG5cdFx0ZXh0LmRhdGEgPSBleHRidWYucmVhZEJ1ZmZlcigpO1xuXHRcdGV4dHMucHVzaChleHQpO1xuXHR9XG5cdGV4dGJ1ZiA9IG5ldyBTU0hCdWZmZXIoeyBidWZmZXI6IHNzaGJ1Zi5yZWFkQnVmZmVyKCkgfSk7XG5cdHdoaWxlICghZXh0YnVmLmF0RW5kKCkpIHtcblx0XHRleHQgPSB7IGNyaXRpY2FsOiBmYWxzZSB9O1xuXHRcdGV4dC5uYW1lID0gZXh0YnVmLnJlYWRTdHJpbmcoKTtcblx0XHRleHQuZGF0YSA9IGV4dGJ1Zi5yZWFkQnVmZmVyKCk7XG5cdFx0ZXh0cy5wdXNoKGV4dCk7XG5cdH1cblx0Y2VydC5zaWduYXR1cmVzLm9wZW5zc2guZXh0cyA9IGV4dHM7XG5cblx0LyogcmVzZXJ2ZWQgKi9cblx0c3NoYnVmLnJlYWRCdWZmZXIoKTtcblxuXHR2YXIgc2lnbmluZ0tleUJ1ZiA9IHNzaGJ1Zi5yZWFkQnVmZmVyKCk7XG5cdGNlcnQuaXNzdWVyS2V5ID0gcmZjNDI1My5yZWFkKHNpZ25pbmdLZXlCdWYpO1xuXG5cdC8qXG5cdCAqIE9wZW5TU0ggY2VydHMgZG9uJ3QgZ2l2ZSB0aGUgaWRlbnRpdHkgb2YgdGhlIGlzc3VlciwganVzdCB0aGVpclxuXHQgKiBwdWJsaWMga2V5LiBTbywgd2UgdXNlIGFuIElkZW50aXR5IHRoYXQgbWF0Y2hlcyBhbnl0aGluZy4gVGhlXG5cdCAqIGlzU2lnbmVkQnkoKSBmdW5jdGlvbiB3aWxsIGxhdGVyIHRlbGwgeW91IGlmIHRoZSBrZXkgbWF0Y2hlcy5cblx0ICovXG5cdGNlcnQuaXNzdWVyID0gSWRlbnRpdHkuZm9ySG9zdCgnKionKTtcblxuXHR2YXIgc2lnQnVmID0gc3NoYnVmLnJlYWRCdWZmZXIoKTtcblx0Y2VydC5zaWduYXR1cmVzLm9wZW5zc2guc2lnbmF0dXJlID1cblx0ICAgIFNpZ25hdHVyZS5wYXJzZShzaWdCdWYsIGNlcnQuaXNzdWVyS2V5LnR5cGUsICdzc2gnKTtcblxuXHRpZiAocGFydGlhbCAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cGFydGlhbC5yZW1haW5kZXIgPSBzc2hidWYucmVtYWluZGVyKCk7XG5cdFx0cGFydGlhbC5jb25zdW1lZCA9IHNzaGJ1Zi5fb2Zmc2V0O1xuXHR9XG5cblx0cmV0dXJuIChuZXcgQ2VydGlmaWNhdGUoY2VydCkpO1xufVxuXG5mdW5jdGlvbiBpbnQ2NFRvRGF0ZShidWYpIHtcblx0dmFyIGkgPSBidWYucmVhZFVJbnQzMkJFKDApICogNDI5NDk2NzI5Njtcblx0aSArPSBidWYucmVhZFVJbnQzMkJFKDQpO1xuXHR2YXIgZCA9IG5ldyBEYXRlKCk7XG5cdGQuc2V0VGltZShpICogMTAwMCk7XG5cdGQuc291cmNlSW50NjQgPSBidWY7XG5cdHJldHVybiAoZCk7XG59XG5cbmZ1bmN0aW9uIGRhdGVUb0ludDY0KGRhdGUpIHtcblx0aWYgKGRhdGUuc291cmNlSW50NjQgIT09IHVuZGVmaW5lZClcblx0XHRyZXR1cm4gKGRhdGUuc291cmNlSW50NjQpO1xuXHR2YXIgaSA9IE1hdGgucm91bmQoZGF0ZS5nZXRUaW1lKCkgLyAxMDAwKTtcblx0dmFyIHVwcGVyID0gTWF0aC5mbG9vcihpIC8gNDI5NDk2NzI5Nik7XG5cdHZhciBsb3dlciA9IE1hdGguZmxvb3IoaSAlIDQyOTQ5NjcyOTYpO1xuXHR2YXIgYnVmID0gQnVmZmVyLmFsbG9jKDgpO1xuXHRidWYud3JpdGVVSW50MzJCRSh1cHBlciwgMCk7XG5cdGJ1Zi53cml0ZVVJbnQzMkJFKGxvd2VyLCA0KTtcblx0cmV0dXJuIChidWYpO1xufVxuXG5mdW5jdGlvbiBzaWduKGNlcnQsIGtleSkge1xuXHRpZiAoY2VydC5zaWduYXR1cmVzLm9wZW5zc2ggPT09IHVuZGVmaW5lZClcblx0XHRjZXJ0LnNpZ25hdHVyZXMub3BlbnNzaCA9IHt9O1xuXHR0cnkge1xuXHRcdHZhciBibG9iID0gdG9CdWZmZXIoY2VydCwgdHJ1ZSk7XG5cdH0gY2F0Y2ggKGUpIHtcblx0XHRkZWxldGUgKGNlcnQuc2lnbmF0dXJlcy5vcGVuc3NoKTtcblx0XHRyZXR1cm4gKGZhbHNlKTtcblx0fVxuXHR2YXIgc2lnID0gY2VydC5zaWduYXR1cmVzLm9wZW5zc2g7XG5cdHZhciBoYXNoQWxnbyA9IHVuZGVmaW5lZDtcblx0aWYgKGtleS50eXBlID09PSAncnNhJyB8fCBrZXkudHlwZSA9PT0gJ2RzYScpXG5cdFx0aGFzaEFsZ28gPSAnc2hhMSc7XG5cdHZhciBzaWduZXIgPSBrZXkuY3JlYXRlU2lnbihoYXNoQWxnbyk7XG5cdHNpZ25lci53cml0ZShibG9iKTtcblx0c2lnLnNpZ25hdHVyZSA9IHNpZ25lci5zaWduKCk7XG5cdHJldHVybiAodHJ1ZSk7XG59XG5cbmZ1bmN0aW9uIHNpZ25Bc3luYyhjZXJ0LCBzaWduZXIsIGRvbmUpIHtcblx0aWYgKGNlcnQuc2lnbmF0dXJlcy5vcGVuc3NoID09PSB1bmRlZmluZWQpXG5cdFx0Y2VydC5zaWduYXR1cmVzLm9wZW5zc2ggPSB7fTtcblx0dHJ5IHtcblx0XHR2YXIgYmxvYiA9IHRvQnVmZmVyKGNlcnQsIHRydWUpO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0ZGVsZXRlIChjZXJ0LnNpZ25hdHVyZXMub3BlbnNzaCk7XG5cdFx0ZG9uZShlKTtcblx0XHRyZXR1cm47XG5cdH1cblx0dmFyIHNpZyA9IGNlcnQuc2lnbmF0dXJlcy5vcGVuc3NoO1xuXG5cdHNpZ25lcihibG9iLCBmdW5jdGlvbiAoZXJyLCBzaWduYXR1cmUpIHtcblx0XHRpZiAoZXJyKSB7XG5cdFx0XHRkb25lKGVycik7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdHRyeSB7XG5cdFx0XHQvKlxuXHRcdFx0ICogVGhpcyB3aWxsIHRocm93IGlmIHRoZSBzaWduYXR1cmUgaXNuJ3Qgb2YgYVxuXHRcdFx0ICogdHlwZS9hbGdvIHRoYXQgY2FuIGJlIHVzZWQgZm9yIFNTSC5cblx0XHRcdCAqL1xuXHRcdFx0c2lnbmF0dXJlLnRvQnVmZmVyKCdzc2gnKTtcblx0XHR9IGNhdGNoIChlKSB7XG5cdFx0XHRkb25lKGUpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRzaWcuc2lnbmF0dXJlID0gc2lnbmF0dXJlO1xuXHRcdGRvbmUoKTtcblx0fSk7XG59XG5cbmZ1bmN0aW9uIHdyaXRlKGNlcnQsIG9wdGlvbnMpIHtcblx0aWYgKG9wdGlvbnMgPT09IHVuZGVmaW5lZClcblx0XHRvcHRpb25zID0ge307XG5cblx0dmFyIGJsb2IgPSB0b0J1ZmZlcihjZXJ0KTtcblx0dmFyIG91dCA9IGdldENlcnRUeXBlKGNlcnQuc3ViamVjdEtleSkgKyAnICcgKyBibG9iLnRvU3RyaW5nKCdiYXNlNjQnKTtcblx0aWYgKG9wdGlvbnMuY29tbWVudClcblx0XHRvdXQgPSBvdXQgKyAnICcgKyBvcHRpb25zLmNvbW1lbnQ7XG5cdHJldHVybiAob3V0KTtcbn1cblxuXG5mdW5jdGlvbiB0b0J1ZmZlcihjZXJ0LCBub1NpZykge1xuXHRhc3NlcnQub2JqZWN0KGNlcnQuc2lnbmF0dXJlcy5vcGVuc3NoLCAnc2lnbmF0dXJlIGZvciBvcGVuc3NoIGZvcm1hdCcpO1xuXHR2YXIgc2lnID0gY2VydC5zaWduYXR1cmVzLm9wZW5zc2g7XG5cblx0aWYgKHNpZy5ub25jZSA9PT0gdW5kZWZpbmVkKVxuXHRcdHNpZy5ub25jZSA9IGNyeXB0by5yYW5kb21CeXRlcygxNik7XG5cdHZhciBidWYgPSBuZXcgU1NIQnVmZmVyKHt9KTtcblx0YnVmLndyaXRlU3RyaW5nKGdldENlcnRUeXBlKGNlcnQuc3ViamVjdEtleSkpO1xuXHRidWYud3JpdGVCdWZmZXIoc2lnLm5vbmNlKTtcblxuXHR2YXIga2V5ID0gY2VydC5zdWJqZWN0S2V5O1xuXHR2YXIgYWxnSW5mbyA9IGFsZ3MuaW5mb1trZXkudHlwZV07XG5cdGFsZ0luZm8ucGFydHMuZm9yRWFjaChmdW5jdGlvbiAocGFydCkge1xuXHRcdGJ1Zi53cml0ZVBhcnQoa2V5LnBhcnRbcGFydF0pO1xuXHR9KTtcblxuXHRidWYud3JpdGVJbnQ2NChjZXJ0LnNlcmlhbCk7XG5cblx0dmFyIHR5cGUgPSBjZXJ0LnN1YmplY3RzWzBdLnR5cGU7XG5cdGFzc2VydC5ub3RTdHJpY3RFcXVhbCh0eXBlLCAndW5rbm93bicpO1xuXHRjZXJ0LnN1YmplY3RzLmZvckVhY2goZnVuY3Rpb24gKGlkKSB7XG5cdFx0YXNzZXJ0LnN0cmljdEVxdWFsKGlkLnR5cGUsIHR5cGUpO1xuXHR9KTtcblx0dHlwZSA9IFRZUEVTW3R5cGVdO1xuXHRidWYud3JpdGVJbnQodHlwZSk7XG5cblx0aWYgKHNpZy5rZXlJZCA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0c2lnLmtleUlkID0gY2VydC5zdWJqZWN0c1swXS50eXBlICsgJ18nICtcblx0XHQgICAgKGNlcnQuc3ViamVjdHNbMF0udWlkIHx8IGNlcnQuc3ViamVjdHNbMF0uaG9zdG5hbWUpO1xuXHR9XG5cdGJ1Zi53cml0ZVN0cmluZyhzaWcua2V5SWQpO1xuXG5cdHZhciBzdWIgPSBuZXcgU1NIQnVmZmVyKHt9KTtcblx0Y2VydC5zdWJqZWN0cy5mb3JFYWNoKGZ1bmN0aW9uIChpZCkge1xuXHRcdGlmICh0eXBlID09PSBUWVBFUy5ob3N0KVxuXHRcdFx0c3ViLndyaXRlU3RyaW5nKGlkLmhvc3RuYW1lKTtcblx0XHRlbHNlIGlmICh0eXBlID09PSBUWVBFUy51c2VyKVxuXHRcdFx0c3ViLndyaXRlU3RyaW5nKGlkLnVpZCk7XG5cdH0pO1xuXHRidWYud3JpdGVCdWZmZXIoc3ViLnRvQnVmZmVyKCkpO1xuXG5cdGJ1Zi53cml0ZUludDY0KGRhdGVUb0ludDY0KGNlcnQudmFsaWRGcm9tKSk7XG5cdGJ1Zi53cml0ZUludDY0KGRhdGVUb0ludDY0KGNlcnQudmFsaWRVbnRpbCkpO1xuXG5cdHZhciBleHRzID0gc2lnLmV4dHM7XG5cdGlmIChleHRzID09PSB1bmRlZmluZWQpXG5cdFx0ZXh0cyA9IFtdO1xuXG5cdHZhciBleHRidWYgPSBuZXcgU1NIQnVmZmVyKHt9KTtcblx0ZXh0cy5mb3JFYWNoKGZ1bmN0aW9uIChleHQpIHtcblx0XHRpZiAoZXh0LmNyaXRpY2FsICE9PSB0cnVlKVxuXHRcdFx0cmV0dXJuO1xuXHRcdGV4dGJ1Zi53cml0ZVN0cmluZyhleHQubmFtZSk7XG5cdFx0ZXh0YnVmLndyaXRlQnVmZmVyKGV4dC5kYXRhKTtcblx0fSk7XG5cdGJ1Zi53cml0ZUJ1ZmZlcihleHRidWYudG9CdWZmZXIoKSk7XG5cblx0ZXh0YnVmID0gbmV3IFNTSEJ1ZmZlcih7fSk7XG5cdGV4dHMuZm9yRWFjaChmdW5jdGlvbiAoZXh0KSB7XG5cdFx0aWYgKGV4dC5jcml0aWNhbCA9PT0gdHJ1ZSlcblx0XHRcdHJldHVybjtcblx0XHRleHRidWYud3JpdGVTdHJpbmcoZXh0Lm5hbWUpO1xuXHRcdGV4dGJ1Zi53cml0ZUJ1ZmZlcihleHQuZGF0YSk7XG5cdH0pO1xuXHRidWYud3JpdGVCdWZmZXIoZXh0YnVmLnRvQnVmZmVyKCkpO1xuXG5cdC8qIHJlc2VydmVkICovXG5cdGJ1Zi53cml0ZUJ1ZmZlcihCdWZmZXIuYWxsb2MoMCkpO1xuXG5cdHN1YiA9IHJmYzQyNTMud3JpdGUoY2VydC5pc3N1ZXJLZXkpO1xuXHRidWYud3JpdGVCdWZmZXIoc3ViKTtcblxuXHRpZiAoIW5vU2lnKVxuXHRcdGJ1Zi53cml0ZUJ1ZmZlcihzaWcuc2lnbmF0dXJlLnRvQnVmZmVyKCdzc2gnKSk7XG5cblx0cmV0dXJuIChidWYudG9CdWZmZXIoKSk7XG59XG5cbmZ1bmN0aW9uIGdldEFsZyhjZXJ0VHlwZSkge1xuXHRpZiAoY2VydFR5cGUgPT09ICdzc2gtcnNhLWNlcnQtdjAxQG9wZW5zc2guY29tJylcblx0XHRyZXR1cm4gKCdyc2EnKTtcblx0aWYgKGNlcnRUeXBlID09PSAnc3NoLWRzcy1jZXJ0LXYwMUBvcGVuc3NoLmNvbScpXG5cdFx0cmV0dXJuICgnZHNhJyk7XG5cdGlmIChjZXJ0VHlwZS5tYXRjaChFQ0RTQV9BTEdPKSlcblx0XHRyZXR1cm4gKCdlY2RzYScpO1xuXHRpZiAoY2VydFR5cGUgPT09ICdzc2gtZWQyNTUxOS1jZXJ0LXYwMUBvcGVuc3NoLmNvbScpXG5cdFx0cmV0dXJuICgnZWQyNTUxOScpO1xuXHR0aHJvdyAobmV3IEVycm9yKCdVbnN1cHBvcnRlZCBjZXJ0IHR5cGUgJyArIGNlcnRUeXBlKSk7XG59XG5cbmZ1bmN0aW9uIGdldENlcnRUeXBlKGtleSkge1xuXHRpZiAoa2V5LnR5cGUgPT09ICdyc2EnKVxuXHRcdHJldHVybiAoJ3NzaC1yc2EtY2VydC12MDFAb3BlbnNzaC5jb20nKTtcblx0aWYgKGtleS50eXBlID09PSAnZHNhJylcblx0XHRyZXR1cm4gKCdzc2gtZHNzLWNlcnQtdjAxQG9wZW5zc2guY29tJyk7XG5cdGlmIChrZXkudHlwZSA9PT0gJ2VjZHNhJylcblx0XHRyZXR1cm4gKCdlY2RzYS1zaGEyLScgKyBrZXkuY3VydmUgKyAnLWNlcnQtdjAxQG9wZW5zc2guY29tJyk7XG5cdGlmIChrZXkudHlwZSA9PT0gJ2VkMjU1MTknKVxuXHRcdHJldHVybiAoJ3NzaC1lZDI1NTE5LWNlcnQtdjAxQG9wZW5zc2guY29tJyk7XG5cdHRocm93IChuZXcgRXJyb3IoJ1Vuc3VwcG9ydGVkIGtleSB0eXBlICcgKyBrZXkudHlwZSkpO1xufVxuIiwiLy8gQ29weXJpZ2h0IDIwMTUgSm95ZW50LCBJbmMuXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRyZWFkOiByZWFkLFxuXHRyZWFkU1NIUHJpdmF0ZTogcmVhZFNTSFByaXZhdGUsXG5cdHdyaXRlOiB3cml0ZVxufTtcblxudmFyIGFzc2VydCA9IHJlcXVpcmUoJ2Fzc2VydC1wbHVzJyk7XG52YXIgYXNuMSA9IHJlcXVpcmUoJ2FzbjEnKTtcbnZhciBCdWZmZXIgPSByZXF1aXJlKCdzYWZlci1idWZmZXInKS5CdWZmZXI7XG52YXIgYWxncyA9IHJlcXVpcmUoJy4uL2FsZ3MnKTtcbnZhciB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWxzJyk7XG52YXIgY3J5cHRvID0gcmVxdWlyZSgnY3J5cHRvJyk7XG5cbnZhciBLZXkgPSByZXF1aXJlKCcuLi9rZXknKTtcbnZhciBQcml2YXRlS2V5ID0gcmVxdWlyZSgnLi4vcHJpdmF0ZS1rZXknKTtcbnZhciBwZW0gPSByZXF1aXJlKCcuL3BlbScpO1xudmFyIHJmYzQyNTMgPSByZXF1aXJlKCcuL3JmYzQyNTMnKTtcbnZhciBTU0hCdWZmZXIgPSByZXF1aXJlKCcuLi9zc2gtYnVmZmVyJyk7XG52YXIgZXJyb3JzID0gcmVxdWlyZSgnLi4vZXJyb3JzJyk7XG5cbnZhciBiY3J5cHQ7XG5cbmZ1bmN0aW9uIHJlYWQoYnVmLCBvcHRpb25zKSB7XG5cdHJldHVybiAocGVtLnJlYWQoYnVmLCBvcHRpb25zKSk7XG59XG5cbnZhciBNQUdJQyA9ICdvcGVuc3NoLWtleS12MSc7XG5cbmZ1bmN0aW9uIHJlYWRTU0hQcml2YXRlKHR5cGUsIGJ1Ziwgb3B0aW9ucykge1xuXHRidWYgPSBuZXcgU1NIQnVmZmVyKHtidWZmZXI6IGJ1Zn0pO1xuXG5cdHZhciBtYWdpYyA9IGJ1Zi5yZWFkQ1N0cmluZygpO1xuXHRhc3NlcnQuc3RyaWN0RXF1YWwobWFnaWMsIE1BR0lDLCAnYmFkIG1hZ2ljIHN0cmluZycpO1xuXG5cdHZhciBjaXBoZXIgPSBidWYucmVhZFN0cmluZygpO1xuXHR2YXIga2RmID0gYnVmLnJlYWRTdHJpbmcoKTtcblx0dmFyIGtkZk9wdHMgPSBidWYucmVhZEJ1ZmZlcigpO1xuXG5cdHZhciBua2V5cyA9IGJ1Zi5yZWFkSW50KCk7XG5cdGlmIChua2V5cyAhPT0gMSkge1xuXHRcdHRocm93IChuZXcgRXJyb3IoJ09wZW5TU0gtZm9ybWF0IGtleSBmaWxlIGNvbnRhaW5zICcgK1xuXHRcdCAgICAnbXVsdGlwbGUga2V5czogdGhpcyBpcyB1bnN1cHBvcnRlZC4nKSk7XG5cdH1cblxuXHR2YXIgcHViS2V5ID0gYnVmLnJlYWRCdWZmZXIoKTtcblxuXHRpZiAodHlwZSA9PT0gJ3B1YmxpYycpIHtcblx0XHRhc3NlcnQub2soYnVmLmF0RW5kKCksICdleGNlc3MgYnl0ZXMgbGVmdCBhZnRlciBrZXknKTtcblx0XHRyZXR1cm4gKHJmYzQyNTMucmVhZChwdWJLZXkpKTtcblx0fVxuXG5cdHZhciBwcml2S2V5QmxvYiA9IGJ1Zi5yZWFkQnVmZmVyKCk7XG5cdGFzc2VydC5vayhidWYuYXRFbmQoKSwgJ2V4Y2VzcyBieXRlcyBsZWZ0IGFmdGVyIGtleScpO1xuXG5cdHZhciBrZGZPcHRzQnVmID0gbmV3IFNTSEJ1ZmZlcih7IGJ1ZmZlcjoga2RmT3B0cyB9KTtcblx0c3dpdGNoIChrZGYpIHtcblx0Y2FzZSAnbm9uZSc6XG5cdFx0aWYgKGNpcGhlciAhPT0gJ25vbmUnKSB7XG5cdFx0XHR0aHJvdyAobmV3IEVycm9yKCdPcGVuU1NILWZvcm1hdCBrZXkgdXNlcyBLREYgXCJub25lXCIgJyArXG5cdFx0XHQgICAgICdidXQgc3BlY2lmaWVzIGEgY2lwaGVyIG90aGVyIHRoYW4gXCJub25lXCInKSk7XG5cdFx0fVxuXHRcdGJyZWFrO1xuXHRjYXNlICdiY3J5cHQnOlxuXHRcdHZhciBzYWx0ID0ga2RmT3B0c0J1Zi5yZWFkQnVmZmVyKCk7XG5cdFx0dmFyIHJvdW5kcyA9IGtkZk9wdHNCdWYucmVhZEludCgpO1xuXHRcdHZhciBjaW5mID0gdXRpbHMub3BlbnNzaENpcGhlckluZm8oY2lwaGVyKTtcblx0XHRpZiAoYmNyeXB0ID09PSB1bmRlZmluZWQpIHtcblx0XHRcdGJjcnlwdCA9IHJlcXVpcmUoJ2JjcnlwdC1wYmtkZicpO1xuXHRcdH1cblxuXHRcdGlmICh0eXBlb2YgKG9wdGlvbnMucGFzc3BocmFzZSkgPT09ICdzdHJpbmcnKSB7XG5cdFx0XHRvcHRpb25zLnBhc3NwaHJhc2UgPSBCdWZmZXIuZnJvbShvcHRpb25zLnBhc3NwaHJhc2UsXG5cdFx0XHQgICAgJ3V0Zi04Jyk7XG5cdFx0fVxuXHRcdGlmICghQnVmZmVyLmlzQnVmZmVyKG9wdGlvbnMucGFzc3BocmFzZSkpIHtcblx0XHRcdHRocm93IChuZXcgZXJyb3JzLktleUVuY3J5cHRlZEVycm9yKFxuXHRcdFx0ICAgIG9wdGlvbnMuZmlsZW5hbWUsICdPcGVuU1NIJykpO1xuXHRcdH1cblxuXHRcdHZhciBwYXNzID0gbmV3IFVpbnQ4QXJyYXkob3B0aW9ucy5wYXNzcGhyYXNlKTtcblx0XHR2YXIgc2FsdGkgPSBuZXcgVWludDhBcnJheShzYWx0KTtcblx0XHQvKiBVc2UgdGhlIHBia2RmIHRvIGRlcml2ZSBib3RoIHRoZSBrZXkgYW5kIHRoZSBJVi4gKi9cblx0XHR2YXIgb3V0ID0gbmV3IFVpbnQ4QXJyYXkoY2luZi5rZXlTaXplICsgY2luZi5ibG9ja1NpemUpO1xuXHRcdHZhciByZXMgPSBiY3J5cHQucGJrZGYocGFzcywgcGFzcy5sZW5ndGgsIHNhbHRpLCBzYWx0aS5sZW5ndGgsXG5cdFx0ICAgIG91dCwgb3V0Lmxlbmd0aCwgcm91bmRzKTtcblx0XHRpZiAocmVzICE9PSAwKSB7XG5cdFx0XHR0aHJvdyAobmV3IEVycm9yKCdiY3J5cHRfcGJrZGYgZnVuY3Rpb24gcmV0dXJuZWQgJyArXG5cdFx0XHQgICAgJ2ZhaWx1cmUsIHBhcmFtZXRlcnMgaW52YWxpZCcpKTtcblx0XHR9XG5cdFx0b3V0ID0gQnVmZmVyLmZyb20ob3V0KTtcblx0XHR2YXIgY2tleSA9IG91dC5zbGljZSgwLCBjaW5mLmtleVNpemUpO1xuXHRcdHZhciBpdiA9IG91dC5zbGljZShjaW5mLmtleVNpemUsIGNpbmYua2V5U2l6ZSArIGNpbmYuYmxvY2tTaXplKTtcblx0XHR2YXIgY2lwaGVyU3RyZWFtID0gY3J5cHRvLmNyZWF0ZURlY2lwaGVyaXYoY2luZi5vcGVuc3NsTmFtZSxcblx0XHQgICAgY2tleSwgaXYpO1xuXHRcdGNpcGhlclN0cmVhbS5zZXRBdXRvUGFkZGluZyhmYWxzZSk7XG5cdFx0dmFyIGNodW5rLCBjaHVua3MgPSBbXTtcblx0XHRjaXBoZXJTdHJlYW0ub25jZSgnZXJyb3InLCBmdW5jdGlvbiAoZSkge1xuXHRcdFx0aWYgKGUudG9TdHJpbmcoKS5pbmRleE9mKCdiYWQgZGVjcnlwdCcpICE9PSAtMSkge1xuXHRcdFx0XHR0aHJvdyAobmV3IEVycm9yKCdJbmNvcnJlY3QgcGFzc3BocmFzZSAnICtcblx0XHRcdFx0ICAgICdzdXBwbGllZCwgY291bGQgbm90IGRlY3J5cHQga2V5JykpO1xuXHRcdFx0fVxuXHRcdFx0dGhyb3cgKGUpO1xuXHRcdH0pO1xuXHRcdGNpcGhlclN0cmVhbS53cml0ZShwcml2S2V5QmxvYik7XG5cdFx0Y2lwaGVyU3RyZWFtLmVuZCgpO1xuXHRcdHdoaWxlICgoY2h1bmsgPSBjaXBoZXJTdHJlYW0ucmVhZCgpKSAhPT0gbnVsbClcblx0XHRcdGNodW5rcy5wdXNoKGNodW5rKTtcblx0XHRwcml2S2V5QmxvYiA9IEJ1ZmZlci5jb25jYXQoY2h1bmtzKTtcblx0XHRicmVhaztcblx0ZGVmYXVsdDpcblx0XHR0aHJvdyAobmV3IEVycm9yKFxuXHRcdCAgICAnT3BlblNTSC1mb3JtYXQga2V5IHVzZXMgdW5rbm93biBLREYgXCInICsga2RmICsgJ1wiJykpO1xuXHR9XG5cblx0YnVmID0gbmV3IFNTSEJ1ZmZlcih7YnVmZmVyOiBwcml2S2V5QmxvYn0pO1xuXG5cdHZhciBjaGVja0ludDEgPSBidWYucmVhZEludCgpO1xuXHR2YXIgY2hlY2tJbnQyID0gYnVmLnJlYWRJbnQoKTtcblx0aWYgKGNoZWNrSW50MSAhPT0gY2hlY2tJbnQyKSB7XG5cdFx0dGhyb3cgKG5ldyBFcnJvcignSW5jb3JyZWN0IHBhc3NwaHJhc2Ugc3VwcGxpZWQsIGNvdWxkIG5vdCAnICtcblx0XHQgICAgJ2RlY3J5cHQga2V5JykpO1xuXHR9XG5cblx0dmFyIHJldCA9IHt9O1xuXHR2YXIga2V5ID0gcmZjNDI1My5yZWFkSW50ZXJuYWwocmV0LCAncHJpdmF0ZScsIGJ1Zi5yZW1haW5kZXIoKSk7XG5cblx0YnVmLnNraXAocmV0LmNvbnN1bWVkKTtcblxuXHR2YXIgY29tbWVudCA9IGJ1Zi5yZWFkU3RyaW5nKCk7XG5cdGtleS5jb21tZW50ID0gY29tbWVudDtcblxuXHRyZXR1cm4gKGtleSk7XG59XG5cbmZ1bmN0aW9uIHdyaXRlKGtleSwgb3B0aW9ucykge1xuXHR2YXIgcHViS2V5O1xuXHRpZiAoUHJpdmF0ZUtleS5pc1ByaXZhdGVLZXkoa2V5KSlcblx0XHRwdWJLZXkgPSBrZXkudG9QdWJsaWMoKTtcblx0ZWxzZVxuXHRcdHB1YktleSA9IGtleTtcblxuXHR2YXIgY2lwaGVyID0gJ25vbmUnO1xuXHR2YXIga2RmID0gJ25vbmUnO1xuXHR2YXIga2Rmb3B0cyA9IEJ1ZmZlci5hbGxvYygwKTtcblx0dmFyIGNpbmYgPSB7IGJsb2NrU2l6ZTogOCB9O1xuXHR2YXIgcGFzc3BocmFzZTtcblx0aWYgKG9wdGlvbnMgIT09IHVuZGVmaW5lZCkge1xuXHRcdHBhc3NwaHJhc2UgPSBvcHRpb25zLnBhc3NwaHJhc2U7XG5cdFx0aWYgKHR5cGVvZiAocGFzc3BocmFzZSkgPT09ICdzdHJpbmcnKVxuXHRcdFx0cGFzc3BocmFzZSA9IEJ1ZmZlci5mcm9tKHBhc3NwaHJhc2UsICd1dGYtOCcpO1xuXHRcdGlmIChwYXNzcGhyYXNlICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdGFzc2VydC5idWZmZXIocGFzc3BocmFzZSwgJ29wdGlvbnMucGFzc3BocmFzZScpO1xuXHRcdFx0YXNzZXJ0Lm9wdGlvbmFsU3RyaW5nKG9wdGlvbnMuY2lwaGVyLCAnb3B0aW9ucy5jaXBoZXInKTtcblx0XHRcdGNpcGhlciA9IG9wdGlvbnMuY2lwaGVyO1xuXHRcdFx0aWYgKGNpcGhlciA9PT0gdW5kZWZpbmVkKVxuXHRcdFx0XHRjaXBoZXIgPSAnYWVzMTI4LWN0cic7XG5cdFx0XHRjaW5mID0gdXRpbHMub3BlbnNzaENpcGhlckluZm8oY2lwaGVyKTtcblx0XHRcdGtkZiA9ICdiY3J5cHQnO1xuXHRcdH1cblx0fVxuXG5cdHZhciBwcml2QnVmO1xuXHRpZiAoUHJpdmF0ZUtleS5pc1ByaXZhdGVLZXkoa2V5KSkge1xuXHRcdHByaXZCdWYgPSBuZXcgU1NIQnVmZmVyKHt9KTtcblx0XHR2YXIgY2hlY2tJbnQgPSBjcnlwdG8ucmFuZG9tQnl0ZXMoNCkucmVhZFVJbnQzMkJFKDApO1xuXHRcdHByaXZCdWYud3JpdGVJbnQoY2hlY2tJbnQpO1xuXHRcdHByaXZCdWYud3JpdGVJbnQoY2hlY2tJbnQpO1xuXHRcdHByaXZCdWYud3JpdGUoa2V5LnRvQnVmZmVyKCdyZmM0MjUzJykpO1xuXHRcdHByaXZCdWYud3JpdGVTdHJpbmcoa2V5LmNvbW1lbnQgfHwgJycpO1xuXG5cdFx0dmFyIG4gPSAxO1xuXHRcdHdoaWxlIChwcml2QnVmLl9vZmZzZXQgJSBjaW5mLmJsb2NrU2l6ZSAhPT0gMClcblx0XHRcdHByaXZCdWYud3JpdGVDaGFyKG4rKyk7XG5cdFx0cHJpdkJ1ZiA9IHByaXZCdWYudG9CdWZmZXIoKTtcblx0fVxuXG5cdHN3aXRjaCAoa2RmKSB7XG5cdGNhc2UgJ25vbmUnOlxuXHRcdGJyZWFrO1xuXHRjYXNlICdiY3J5cHQnOlxuXHRcdHZhciBzYWx0ID0gY3J5cHRvLnJhbmRvbUJ5dGVzKDE2KTtcblx0XHR2YXIgcm91bmRzID0gMTY7XG5cdFx0dmFyIGtkZnNzaCA9IG5ldyBTU0hCdWZmZXIoe30pO1xuXHRcdGtkZnNzaC53cml0ZUJ1ZmZlcihzYWx0KTtcblx0XHRrZGZzc2gud3JpdGVJbnQocm91bmRzKTtcblx0XHRrZGZvcHRzID0ga2Rmc3NoLnRvQnVmZmVyKCk7XG5cblx0XHRpZiAoYmNyeXB0ID09PSB1bmRlZmluZWQpIHtcblx0XHRcdGJjcnlwdCA9IHJlcXVpcmUoJ2JjcnlwdC1wYmtkZicpO1xuXHRcdH1cblx0XHR2YXIgcGFzcyA9IG5ldyBVaW50OEFycmF5KHBhc3NwaHJhc2UpO1xuXHRcdHZhciBzYWx0aSA9IG5ldyBVaW50OEFycmF5KHNhbHQpO1xuXHRcdC8qIFVzZSB0aGUgcGJrZGYgdG8gZGVyaXZlIGJvdGggdGhlIGtleSBhbmQgdGhlIElWLiAqL1xuXHRcdHZhciBvdXQgPSBuZXcgVWludDhBcnJheShjaW5mLmtleVNpemUgKyBjaW5mLmJsb2NrU2l6ZSk7XG5cdFx0dmFyIHJlcyA9IGJjcnlwdC5wYmtkZihwYXNzLCBwYXNzLmxlbmd0aCwgc2FsdGksIHNhbHRpLmxlbmd0aCxcblx0XHQgICAgb3V0LCBvdXQubGVuZ3RoLCByb3VuZHMpO1xuXHRcdGlmIChyZXMgIT09IDApIHtcblx0XHRcdHRocm93IChuZXcgRXJyb3IoJ2JjcnlwdF9wYmtkZiBmdW5jdGlvbiByZXR1cm5lZCAnICtcblx0XHRcdCAgICAnZmFpbHVyZSwgcGFyYW1ldGVycyBpbnZhbGlkJykpO1xuXHRcdH1cblx0XHRvdXQgPSBCdWZmZXIuZnJvbShvdXQpO1xuXHRcdHZhciBja2V5ID0gb3V0LnNsaWNlKDAsIGNpbmYua2V5U2l6ZSk7XG5cdFx0dmFyIGl2ID0gb3V0LnNsaWNlKGNpbmYua2V5U2l6ZSwgY2luZi5rZXlTaXplICsgY2luZi5ibG9ja1NpemUpO1xuXG5cdFx0dmFyIGNpcGhlclN0cmVhbSA9IGNyeXB0by5jcmVhdGVDaXBoZXJpdihjaW5mLm9wZW5zc2xOYW1lLFxuXHRcdCAgICBja2V5LCBpdik7XG5cdFx0Y2lwaGVyU3RyZWFtLnNldEF1dG9QYWRkaW5nKGZhbHNlKTtcblx0XHR2YXIgY2h1bmssIGNodW5rcyA9IFtdO1xuXHRcdGNpcGhlclN0cmVhbS5vbmNlKCdlcnJvcicsIGZ1bmN0aW9uIChlKSB7XG5cdFx0XHR0aHJvdyAoZSk7XG5cdFx0fSk7XG5cdFx0Y2lwaGVyU3RyZWFtLndyaXRlKHByaXZCdWYpO1xuXHRcdGNpcGhlclN0cmVhbS5lbmQoKTtcblx0XHR3aGlsZSAoKGNodW5rID0gY2lwaGVyU3RyZWFtLnJlYWQoKSkgIT09IG51bGwpXG5cdFx0XHRjaHVua3MucHVzaChjaHVuayk7XG5cdFx0cHJpdkJ1ZiA9IEJ1ZmZlci5jb25jYXQoY2h1bmtzKTtcblx0XHRicmVhaztcblx0ZGVmYXVsdDpcblx0XHR0aHJvdyAobmV3IEVycm9yKCdVbnN1cHBvcnRlZCBrZGYgJyArIGtkZikpO1xuXHR9XG5cblx0dmFyIGJ1ZiA9IG5ldyBTU0hCdWZmZXIoe30pO1xuXG5cdGJ1Zi53cml0ZUNTdHJpbmcoTUFHSUMpO1xuXHRidWYud3JpdGVTdHJpbmcoY2lwaGVyKTtcdC8qIGNpcGhlciAqL1xuXHRidWYud3JpdGVTdHJpbmcoa2RmKTtcdFx0Lyoga2RmICovXG5cdGJ1Zi53cml0ZUJ1ZmZlcihrZGZvcHRzKTtcdC8qIGtkZm9wdGlvbnMgKi9cblxuXHRidWYud3JpdGVJbnQoMSk7XHRcdC8qIG5rZXlzICovXG5cdGJ1Zi53cml0ZUJ1ZmZlcihwdWJLZXkudG9CdWZmZXIoJ3JmYzQyNTMnKSk7XG5cblx0aWYgKHByaXZCdWYpXG5cdFx0YnVmLndyaXRlQnVmZmVyKHByaXZCdWYpO1xuXG5cdGJ1ZiA9IGJ1Zi50b0J1ZmZlcigpO1xuXG5cdHZhciBoZWFkZXI7XG5cdGlmIChQcml2YXRlS2V5LmlzUHJpdmF0ZUtleShrZXkpKVxuXHRcdGhlYWRlciA9ICdPUEVOU1NIIFBSSVZBVEUgS0VZJztcblx0ZWxzZVxuXHRcdGhlYWRlciA9ICdPUEVOU1NIIFBVQkxJQyBLRVknO1xuXG5cdHZhciB0bXAgPSBidWYudG9TdHJpbmcoJ2Jhc2U2NCcpO1xuXHR2YXIgbGVuID0gdG1wLmxlbmd0aCArICh0bXAubGVuZ3RoIC8gNzApICtcblx0ICAgIDE4ICsgMTYgKyBoZWFkZXIubGVuZ3RoKjIgKyAxMDtcblx0YnVmID0gQnVmZmVyLmFsbG9jKGxlbik7XG5cdHZhciBvID0gMDtcblx0byArPSBidWYud3JpdGUoJy0tLS0tQkVHSU4gJyArIGhlYWRlciArICctLS0tLVxcbicsIG8pO1xuXHRmb3IgKHZhciBpID0gMDsgaSA8IHRtcC5sZW5ndGg7ICkge1xuXHRcdHZhciBsaW1pdCA9IGkgKyA3MDtcblx0XHRpZiAobGltaXQgPiB0bXAubGVuZ3RoKVxuXHRcdFx0bGltaXQgPSB0bXAubGVuZ3RoO1xuXHRcdG8gKz0gYnVmLndyaXRlKHRtcC5zbGljZShpLCBsaW1pdCksIG8pO1xuXHRcdGJ1ZltvKytdID0gMTA7XG5cdFx0aSA9IGxpbWl0O1xuXHR9XG5cdG8gKz0gYnVmLndyaXRlKCctLS0tLUVORCAnICsgaGVhZGVyICsgJy0tLS0tXFxuJywgbyk7XG5cblx0cmV0dXJuIChidWYuc2xpY2UoMCwgbykpO1xufVxuIiwiLy8gQ29weXJpZ2h0IDIwMTggSm95ZW50LCBJbmMuXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRyZWFkOiByZWFkLFxuXHR3cml0ZTogd3JpdGVcbn07XG5cbnZhciBhc3NlcnQgPSByZXF1aXJlKCdhc3NlcnQtcGx1cycpO1xudmFyIEJ1ZmZlciA9IHJlcXVpcmUoJ3NhZmVyLWJ1ZmZlcicpLkJ1ZmZlcjtcbnZhciB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWxzJyk7XG52YXIgS2V5ID0gcmVxdWlyZSgnLi4va2V5Jyk7XG52YXIgUHJpdmF0ZUtleSA9IHJlcXVpcmUoJy4uL3ByaXZhdGUta2V5Jyk7XG5cbnZhciBwZW0gPSByZXF1aXJlKCcuL3BlbScpO1xudmFyIHNzaCA9IHJlcXVpcmUoJy4vc3NoJyk7XG52YXIgcmZjNDI1MyA9IHJlcXVpcmUoJy4vcmZjNDI1MycpO1xudmFyIGRuc3NlYyA9IHJlcXVpcmUoJy4vZG5zc2VjJyk7XG52YXIgcHV0dHkgPSByZXF1aXJlKCcuL3B1dHR5Jyk7XG5cbnZhciBETlNTRUNfUFJJVktFWV9IRUFERVJfUFJFRklYID0gJ1ByaXZhdGUta2V5LWZvcm1hdDogdjEnO1xuXG5mdW5jdGlvbiByZWFkKGJ1Ziwgb3B0aW9ucykge1xuXHRpZiAodHlwZW9mIChidWYpID09PSAnc3RyaW5nJykge1xuXHRcdGlmIChidWYudHJpbSgpLm1hdGNoKC9eWy1dK1sgXSpCRUdJTi8pKVxuXHRcdFx0cmV0dXJuIChwZW0ucmVhZChidWYsIG9wdGlvbnMpKTtcblx0XHRpZiAoYnVmLm1hdGNoKC9eXFxzKnNzaC1bYS16XS8pKVxuXHRcdFx0cmV0dXJuIChzc2gucmVhZChidWYsIG9wdGlvbnMpKTtcblx0XHRpZiAoYnVmLm1hdGNoKC9eXFxzKmVjZHNhLS8pKVxuXHRcdFx0cmV0dXJuIChzc2gucmVhZChidWYsIG9wdGlvbnMpKTtcblx0XHRpZiAoYnVmLm1hdGNoKC9ecHV0dHktdXNlci1rZXktZmlsZS0yOi9pKSlcblx0XHRcdHJldHVybiAocHV0dHkucmVhZChidWYsIG9wdGlvbnMpKTtcblx0XHRpZiAoZmluZEROU1NFQ0hlYWRlcihidWYpKVxuXHRcdFx0cmV0dXJuIChkbnNzZWMucmVhZChidWYsIG9wdGlvbnMpKTtcblx0XHRidWYgPSBCdWZmZXIuZnJvbShidWYsICdiaW5hcnknKTtcblx0fSBlbHNlIHtcblx0XHRhc3NlcnQuYnVmZmVyKGJ1Zik7XG5cdFx0aWYgKGZpbmRQRU1IZWFkZXIoYnVmKSlcblx0XHRcdHJldHVybiAocGVtLnJlYWQoYnVmLCBvcHRpb25zKSk7XG5cdFx0aWYgKGZpbmRTU0hIZWFkZXIoYnVmKSlcblx0XHRcdHJldHVybiAoc3NoLnJlYWQoYnVmLCBvcHRpb25zKSk7XG5cdFx0aWYgKGZpbmRQdVRUWUhlYWRlcihidWYpKVxuXHRcdFx0cmV0dXJuIChwdXR0eS5yZWFkKGJ1Ziwgb3B0aW9ucykpO1xuXHRcdGlmIChmaW5kRE5TU0VDSGVhZGVyKGJ1ZikpXG5cdFx0XHRyZXR1cm4gKGRuc3NlYy5yZWFkKGJ1Ziwgb3B0aW9ucykpO1xuXHR9XG5cdGlmIChidWYucmVhZFVJbnQzMkJFKDApIDwgYnVmLmxlbmd0aClcblx0XHRyZXR1cm4gKHJmYzQyNTMucmVhZChidWYsIG9wdGlvbnMpKTtcblx0dGhyb3cgKG5ldyBFcnJvcignRmFpbGVkIHRvIGF1dG8tZGV0ZWN0IGZvcm1hdCBvZiBrZXknKSk7XG59XG5cbmZ1bmN0aW9uIGZpbmRQdVRUWUhlYWRlcihidWYpIHtcblx0dmFyIG9mZnNldCA9IDA7XG5cdHdoaWxlIChvZmZzZXQgPCBidWYubGVuZ3RoICYmXG5cdCAgICAoYnVmW29mZnNldF0gPT09IDMyIHx8IGJ1ZltvZmZzZXRdID09PSAxMCB8fCBidWZbb2Zmc2V0XSA9PT0gOSkpXG5cdFx0KytvZmZzZXQ7XG5cdGlmIChvZmZzZXQgKyAyMiA8PSBidWYubGVuZ3RoICYmXG5cdCAgICBidWYuc2xpY2Uob2Zmc2V0LCBvZmZzZXQgKyAyMikudG9TdHJpbmcoJ2FzY2lpJykudG9Mb3dlckNhc2UoKSA9PT1cblx0ICAgICdwdXR0eS11c2VyLWtleS1maWxlLTI6Jylcblx0XHRyZXR1cm4gKHRydWUpO1xuXHRyZXR1cm4gKGZhbHNlKTtcbn1cblxuZnVuY3Rpb24gZmluZFNTSEhlYWRlcihidWYpIHtcblx0dmFyIG9mZnNldCA9IDA7XG5cdHdoaWxlIChvZmZzZXQgPCBidWYubGVuZ3RoICYmXG5cdCAgICAoYnVmW29mZnNldF0gPT09IDMyIHx8IGJ1ZltvZmZzZXRdID09PSAxMCB8fCBidWZbb2Zmc2V0XSA9PT0gOSkpXG5cdFx0KytvZmZzZXQ7XG5cdGlmIChvZmZzZXQgKyA0IDw9IGJ1Zi5sZW5ndGggJiZcblx0ICAgIGJ1Zi5zbGljZShvZmZzZXQsIG9mZnNldCArIDQpLnRvU3RyaW5nKCdhc2NpaScpID09PSAnc3NoLScpXG5cdFx0cmV0dXJuICh0cnVlKTtcblx0aWYgKG9mZnNldCArIDYgPD0gYnVmLmxlbmd0aCAmJlxuXHQgICAgYnVmLnNsaWNlKG9mZnNldCwgb2Zmc2V0ICsgNikudG9TdHJpbmcoJ2FzY2lpJykgPT09ICdlY2RzYS0nKVxuXHRcdHJldHVybiAodHJ1ZSk7XG5cdHJldHVybiAoZmFsc2UpO1xufVxuXG5mdW5jdGlvbiBmaW5kUEVNSGVhZGVyKGJ1Zikge1xuXHR2YXIgb2Zmc2V0ID0gMDtcblx0d2hpbGUgKG9mZnNldCA8IGJ1Zi5sZW5ndGggJiZcblx0ICAgIChidWZbb2Zmc2V0XSA9PT0gMzIgfHwgYnVmW29mZnNldF0gPT09IDEwKSlcblx0XHQrK29mZnNldDtcblx0aWYgKGJ1ZltvZmZzZXRdICE9PSA0NSlcblx0XHRyZXR1cm4gKGZhbHNlKTtcblx0d2hpbGUgKG9mZnNldCA8IGJ1Zi5sZW5ndGggJiZcblx0ICAgIChidWZbb2Zmc2V0XSA9PT0gNDUpKVxuXHRcdCsrb2Zmc2V0O1xuXHR3aGlsZSAob2Zmc2V0IDwgYnVmLmxlbmd0aCAmJlxuXHQgICAgKGJ1ZltvZmZzZXRdID09PSAzMikpXG5cdFx0KytvZmZzZXQ7XG5cdGlmIChvZmZzZXQgKyA1ID4gYnVmLmxlbmd0aCB8fFxuXHQgICAgYnVmLnNsaWNlKG9mZnNldCwgb2Zmc2V0ICsgNSkudG9TdHJpbmcoJ2FzY2lpJykgIT09ICdCRUdJTicpXG5cdFx0cmV0dXJuIChmYWxzZSk7XG5cdHJldHVybiAodHJ1ZSk7XG59XG5cbmZ1bmN0aW9uIGZpbmRETlNTRUNIZWFkZXIoYnVmKSB7XG5cdC8vIHByaXZhdGUgY2FzZSBmaXJzdFxuXHRpZiAoYnVmLmxlbmd0aCA8PSBETlNTRUNfUFJJVktFWV9IRUFERVJfUFJFRklYLmxlbmd0aClcblx0XHRyZXR1cm4gKGZhbHNlKTtcblx0dmFyIGhlYWRlckNoZWNrID0gYnVmLnNsaWNlKDAsIEROU1NFQ19QUklWS0VZX0hFQURFUl9QUkVGSVgubGVuZ3RoKTtcblx0aWYgKGhlYWRlckNoZWNrLnRvU3RyaW5nKCdhc2NpaScpID09PSBETlNTRUNfUFJJVktFWV9IRUFERVJfUFJFRklYKVxuXHRcdHJldHVybiAodHJ1ZSk7XG5cblx0Ly8gcHVibGljLWtleSBSRkMzMTEwID9cblx0Ly8gJ2RvbWFpbi5jb20uIElOIEtFWSAuLi4nIG9yICdkb21haW4uY29tLiBJTiBETlNLRVkgLi4uJ1xuXHQvLyBza2lwIGFueSBjb21tZW50LWxpbmVzXG5cdGlmICh0eXBlb2YgKGJ1ZikgIT09ICdzdHJpbmcnKSB7XG5cdFx0YnVmID0gYnVmLnRvU3RyaW5nKCdhc2NpaScpO1xuXHR9XG5cdHZhciBsaW5lcyA9IGJ1Zi5zcGxpdCgnXFxuJyk7XG5cdHZhciBsaW5lID0gMDtcblx0LyogSlNTVFlMRUQgKi9cblx0d2hpbGUgKGxpbmVzW2xpbmVdLm1hdGNoKC9eXFw7LykpXG5cdFx0bGluZSsrO1xuXHRpZiAobGluZXNbbGluZV0udG9TdHJpbmcoJ2FzY2lpJykubWF0Y2goL1xcLiBJTiBLRVkgLykpXG5cdFx0cmV0dXJuICh0cnVlKTtcblx0aWYgKGxpbmVzW2xpbmVdLnRvU3RyaW5nKCdhc2NpaScpLm1hdGNoKC9cXC4gSU4gRE5TS0VZIC8pKVxuXHRcdHJldHVybiAodHJ1ZSk7XG5cdHJldHVybiAoZmFsc2UpO1xufVxuXG5mdW5jdGlvbiB3cml0ZShrZXksIG9wdGlvbnMpIHtcblx0dGhyb3cgKG5ldyBFcnJvcignXCJhdXRvXCIgZm9ybWF0IGNhbm5vdCBiZSB1c2VkIGZvciB3cml0aW5nJykpO1xufVxuIiwiLy8gQ29weXJpZ2h0IDIwMTUgSm95ZW50LCBJbmMuXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRidWZmZXJTcGxpdDogYnVmZmVyU3BsaXQsXG5cdGFkZFJTQU1pc3Npbmc6IGFkZFJTQU1pc3NpbmcsXG5cdGNhbGN1bGF0ZURTQVB1YmxpYzogY2FsY3VsYXRlRFNBUHVibGljLFxuXHRjYWxjdWxhdGVFRDI1NTE5UHVibGljOiBjYWxjdWxhdGVFRDI1NTE5UHVibGljLFxuXHRjYWxjdWxhdGVYMjU1MTlQdWJsaWM6IGNhbGN1bGF0ZVgyNTUxOVB1YmxpYyxcblx0bXBOb3JtYWxpemU6IG1wTm9ybWFsaXplLFxuXHRtcERlbm9ybWFsaXplOiBtcERlbm9ybWFsaXplLFxuXHRlY05vcm1hbGl6ZTogZWNOb3JtYWxpemUsXG5cdGNvdW50WmVyb3M6IGNvdW50WmVyb3MsXG5cdGFzc2VydENvbXBhdGlibGU6IGFzc2VydENvbXBhdGlibGUsXG5cdGlzQ29tcGF0aWJsZTogaXNDb21wYXRpYmxlLFxuXHRvcGVuc3NsS2V5RGVyaXY6IG9wZW5zc2xLZXlEZXJpdixcblx0b3BlbnNzaENpcGhlckluZm86IG9wZW5zc2hDaXBoZXJJbmZvLFxuXHRwdWJsaWNGcm9tUHJpdmF0ZUVDRFNBOiBwdWJsaWNGcm9tUHJpdmF0ZUVDRFNBLFxuXHR6ZXJvUGFkVG9MZW5ndGg6IHplcm9QYWRUb0xlbmd0aCxcblx0d3JpdGVCaXRTdHJpbmc6IHdyaXRlQml0U3RyaW5nLFxuXHRyZWFkQml0U3RyaW5nOiByZWFkQml0U3RyaW5nLFxuXHRwYmtkZjI6IHBia2RmMlxufTtcblxudmFyIGFzc2VydCA9IHJlcXVpcmUoJ2Fzc2VydC1wbHVzJyk7XG52YXIgQnVmZmVyID0gcmVxdWlyZSgnc2FmZXItYnVmZmVyJykuQnVmZmVyO1xudmFyIFByaXZhdGVLZXkgPSByZXF1aXJlKCcuL3ByaXZhdGUta2V5Jyk7XG52YXIgS2V5ID0gcmVxdWlyZSgnLi9rZXknKTtcbnZhciBjcnlwdG8gPSByZXF1aXJlKCdjcnlwdG8nKTtcbnZhciBhbGdzID0gcmVxdWlyZSgnLi9hbGdzJyk7XG52YXIgYXNuMSA9IHJlcXVpcmUoJ2FzbjEnKTtcblxudmFyIGVjID0gcmVxdWlyZSgnZWNjLWpzYm4vbGliL2VjJyk7XG52YXIganNibiA9IHJlcXVpcmUoJ2pzYm4nKS5CaWdJbnRlZ2VyO1xudmFyIG5hY2wgPSByZXF1aXJlKCd0d2VldG5hY2wnKTtcblxudmFyIE1BWF9DTEFTU19ERVBUSCA9IDM7XG5cbmZ1bmN0aW9uIGlzQ29tcGF0aWJsZShvYmosIGtsYXNzLCBuZWVkVmVyKSB7XG5cdGlmIChvYmogPT09IG51bGwgfHwgdHlwZW9mIChvYmopICE9PSAnb2JqZWN0Jylcblx0XHRyZXR1cm4gKGZhbHNlKTtcblx0aWYgKG5lZWRWZXIgPT09IHVuZGVmaW5lZClcblx0XHRuZWVkVmVyID0ga2xhc3MucHJvdG90eXBlLl9zc2hwa0FwaVZlcnNpb247XG5cdGlmIChvYmogaW5zdGFuY2VvZiBrbGFzcyAmJlxuXHQgICAga2xhc3MucHJvdG90eXBlLl9zc2hwa0FwaVZlcnNpb25bMF0gPT0gbmVlZFZlclswXSlcblx0XHRyZXR1cm4gKHRydWUpO1xuXHR2YXIgcHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Yob2JqKTtcblx0dmFyIGRlcHRoID0gMDtcblx0d2hpbGUgKHByb3RvLmNvbnN0cnVjdG9yLm5hbWUgIT09IGtsYXNzLm5hbWUpIHtcblx0XHRwcm90byA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihwcm90byk7XG5cdFx0aWYgKCFwcm90byB8fCArK2RlcHRoID4gTUFYX0NMQVNTX0RFUFRIKVxuXHRcdFx0cmV0dXJuIChmYWxzZSk7XG5cdH1cblx0aWYgKHByb3RvLmNvbnN0cnVjdG9yLm5hbWUgIT09IGtsYXNzLm5hbWUpXG5cdFx0cmV0dXJuIChmYWxzZSk7XG5cdHZhciB2ZXIgPSBwcm90by5fc3NocGtBcGlWZXJzaW9uO1xuXHRpZiAodmVyID09PSB1bmRlZmluZWQpXG5cdFx0dmVyID0ga2xhc3MuX29sZFZlcnNpb25EZXRlY3Qob2JqKTtcblx0aWYgKHZlclswXSAhPSBuZWVkVmVyWzBdIHx8IHZlclsxXSA8IG5lZWRWZXJbMV0pXG5cdFx0cmV0dXJuIChmYWxzZSk7XG5cdHJldHVybiAodHJ1ZSk7XG59XG5cbmZ1bmN0aW9uIGFzc2VydENvbXBhdGlibGUob2JqLCBrbGFzcywgbmVlZFZlciwgbmFtZSkge1xuXHRpZiAobmFtZSA9PT0gdW5kZWZpbmVkKVxuXHRcdG5hbWUgPSAnb2JqZWN0Jztcblx0YXNzZXJ0Lm9rKG9iaiwgbmFtZSArICcgbXVzdCBub3QgYmUgbnVsbCcpO1xuXHRhc3NlcnQub2JqZWN0KG9iaiwgbmFtZSArICcgbXVzdCBiZSBhbiBvYmplY3QnKTtcblx0aWYgKG5lZWRWZXIgPT09IHVuZGVmaW5lZClcblx0XHRuZWVkVmVyID0ga2xhc3MucHJvdG90eXBlLl9zc2hwa0FwaVZlcnNpb247XG5cdGlmIChvYmogaW5zdGFuY2VvZiBrbGFzcyAmJlxuXHQgICAga2xhc3MucHJvdG90eXBlLl9zc2hwa0FwaVZlcnNpb25bMF0gPT0gbmVlZFZlclswXSlcblx0XHRyZXR1cm47XG5cdHZhciBwcm90byA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihvYmopO1xuXHR2YXIgZGVwdGggPSAwO1xuXHR3aGlsZSAocHJvdG8uY29uc3RydWN0b3IubmFtZSAhPT0ga2xhc3MubmFtZSkge1xuXHRcdHByb3RvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHByb3RvKTtcblx0XHRhc3NlcnQub2socHJvdG8gJiYgKytkZXB0aCA8PSBNQVhfQ0xBU1NfREVQVEgsXG5cdFx0ICAgIG5hbWUgKyAnIG11c3QgYmUgYSAnICsga2xhc3MubmFtZSArICcgaW5zdGFuY2UnKTtcblx0fVxuXHRhc3NlcnQuc3RyaWN0RXF1YWwocHJvdG8uY29uc3RydWN0b3IubmFtZSwga2xhc3MubmFtZSxcblx0ICAgIG5hbWUgKyAnIG11c3QgYmUgYSAnICsga2xhc3MubmFtZSArICcgaW5zdGFuY2UnKTtcblx0dmFyIHZlciA9IHByb3RvLl9zc2hwa0FwaVZlcnNpb247XG5cdGlmICh2ZXIgPT09IHVuZGVmaW5lZClcblx0XHR2ZXIgPSBrbGFzcy5fb2xkVmVyc2lvbkRldGVjdChvYmopO1xuXHRhc3NlcnQub2sodmVyWzBdID09IG5lZWRWZXJbMF0gJiYgdmVyWzFdID49IG5lZWRWZXJbMV0sXG5cdCAgICBuYW1lICsgJyBtdXN0IGJlIGNvbXBhdGlibGUgd2l0aCAnICsga2xhc3MubmFtZSArICcga2xhc3MgJyArXG5cdCAgICAndmVyc2lvbiAnICsgbmVlZFZlclswXSArICcuJyArIG5lZWRWZXJbMV0pO1xufVxuXG52YXIgQ0lQSEVSX0xFTiA9IHtcblx0J2Rlcy1lZGUzLWNiYyc6IHsga2V5OiAyNCwgaXY6IDggfSxcblx0J2Flcy0xMjgtY2JjJzogeyBrZXk6IDE2LCBpdjogMTYgfSxcblx0J2Flcy0yNTYtY2JjJzogeyBrZXk6IDMyLCBpdjogMTYgfVxufTtcbnZhciBQS0NTNV9TQUxUX0xFTiA9IDg7XG5cbmZ1bmN0aW9uIG9wZW5zc2xLZXlEZXJpdihjaXBoZXIsIHNhbHQsIHBhc3NwaHJhc2UsIGNvdW50KSB7XG5cdGFzc2VydC5idWZmZXIoc2FsdCwgJ3NhbHQnKTtcblx0YXNzZXJ0LmJ1ZmZlcihwYXNzcGhyYXNlLCAncGFzc3BocmFzZScpO1xuXHRhc3NlcnQubnVtYmVyKGNvdW50LCAnaXRlcmF0aW9uIGNvdW50Jyk7XG5cblx0dmFyIGNsZW4gPSBDSVBIRVJfTEVOW2NpcGhlcl07XG5cdGFzc2VydC5vYmplY3QoY2xlbiwgJ3N1cHBvcnRlZCBjaXBoZXInKTtcblxuXHRzYWx0ID0gc2FsdC5zbGljZSgwLCBQS0NTNV9TQUxUX0xFTik7XG5cblx0dmFyIEQsIERfcHJldiwgYnVmcztcblx0dmFyIG1hdGVyaWFsID0gQnVmZmVyLmFsbG9jKDApO1xuXHR3aGlsZSAobWF0ZXJpYWwubGVuZ3RoIDwgY2xlbi5rZXkgKyBjbGVuLml2KSB7XG5cdFx0YnVmcyA9IFtdO1xuXHRcdGlmIChEX3ByZXYpXG5cdFx0XHRidWZzLnB1c2goRF9wcmV2KTtcblx0XHRidWZzLnB1c2gocGFzc3BocmFzZSk7XG5cdFx0YnVmcy5wdXNoKHNhbHQpO1xuXHRcdEQgPSBCdWZmZXIuY29uY2F0KGJ1ZnMpO1xuXHRcdGZvciAodmFyIGogPSAwOyBqIDwgY291bnQ7ICsrailcblx0XHRcdEQgPSBjcnlwdG8uY3JlYXRlSGFzaCgnbWQ1JykudXBkYXRlKEQpLmRpZ2VzdCgpO1xuXHRcdG1hdGVyaWFsID0gQnVmZmVyLmNvbmNhdChbbWF0ZXJpYWwsIERdKTtcblx0XHREX3ByZXYgPSBEO1xuXHR9XG5cblx0cmV0dXJuICh7XG5cdCAgICBrZXk6IG1hdGVyaWFsLnNsaWNlKDAsIGNsZW4ua2V5KSxcblx0ICAgIGl2OiBtYXRlcmlhbC5zbGljZShjbGVuLmtleSwgY2xlbi5rZXkgKyBjbGVuLml2KVxuXHR9KTtcbn1cblxuLyogU2VlOiBSRkMyODk4ICovXG5mdW5jdGlvbiBwYmtkZjIoaGFzaEFsZywgc2FsdCwgaXRlcmF0aW9ucywgc2l6ZSwgcGFzc3BocmFzZSkge1xuXHR2YXIgaGtleSA9IEJ1ZmZlci5hbGxvYyhzYWx0Lmxlbmd0aCArIDQpO1xuXHRzYWx0LmNvcHkoaGtleSk7XG5cblx0dmFyIGdlbiA9IDAsIHRzID0gW107XG5cdHZhciBpID0gMTtcblx0d2hpbGUgKGdlbiA8IHNpemUpIHtcblx0XHR2YXIgdCA9IFQoaSsrKTtcblx0XHRnZW4gKz0gdC5sZW5ndGg7XG5cdFx0dHMucHVzaCh0KTtcblx0fVxuXHRyZXR1cm4gKEJ1ZmZlci5jb25jYXQodHMpLnNsaWNlKDAsIHNpemUpKTtcblxuXHRmdW5jdGlvbiBUKEkpIHtcblx0XHRoa2V5LndyaXRlVUludDMyQkUoSSwgaGtleS5sZW5ndGggLSA0KTtcblxuXHRcdHZhciBobWFjID0gY3J5cHRvLmNyZWF0ZUhtYWMoaGFzaEFsZywgcGFzc3BocmFzZSk7XG5cdFx0aG1hYy51cGRhdGUoaGtleSk7XG5cblx0XHR2YXIgVGkgPSBobWFjLmRpZ2VzdCgpO1xuXHRcdHZhciBVYyA9IFRpO1xuXHRcdHZhciBjID0gMTtcblx0XHR3aGlsZSAoYysrIDwgaXRlcmF0aW9ucykge1xuXHRcdFx0aG1hYyA9IGNyeXB0by5jcmVhdGVIbWFjKGhhc2hBbGcsIHBhc3NwaHJhc2UpO1xuXHRcdFx0aG1hYy51cGRhdGUoVWMpO1xuXHRcdFx0VWMgPSBobWFjLmRpZ2VzdCgpO1xuXHRcdFx0Zm9yICh2YXIgeCA9IDA7IHggPCBUaS5sZW5ndGg7ICsreClcblx0XHRcdFx0VGlbeF0gXj0gVWNbeF07XG5cdFx0fVxuXHRcdHJldHVybiAoVGkpO1xuXHR9XG59XG5cbi8qIENvdW50IGxlYWRpbmcgemVybyBiaXRzIG9uIGEgYnVmZmVyICovXG5mdW5jdGlvbiBjb3VudFplcm9zKGJ1Zikge1xuXHR2YXIgbyA9IDAsIG9iaXQgPSA4O1xuXHR3aGlsZSAobyA8IGJ1Zi5sZW5ndGgpIHtcblx0XHR2YXIgbWFzayA9ICgxIDw8IG9iaXQpO1xuXHRcdGlmICgoYnVmW29dICYgbWFzaykgPT09IG1hc2spXG5cdFx0XHRicmVhaztcblx0XHRvYml0LS07XG5cdFx0aWYgKG9iaXQgPCAwKSB7XG5cdFx0XHRvKys7XG5cdFx0XHRvYml0ID0gODtcblx0XHR9XG5cdH1cblx0cmV0dXJuIChvKjggKyAoOCAtIG9iaXQpIC0gMSk7XG59XG5cbmZ1bmN0aW9uIGJ1ZmZlclNwbGl0KGJ1ZiwgY2hyKSB7XG5cdGFzc2VydC5idWZmZXIoYnVmKTtcblx0YXNzZXJ0LnN0cmluZyhjaHIpO1xuXG5cdHZhciBwYXJ0cyA9IFtdO1xuXHR2YXIgbGFzdFBhcnQgPSAwO1xuXHR2YXIgbWF0Y2hlcyA9IDA7XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgYnVmLmxlbmd0aDsgKytpKSB7XG5cdFx0aWYgKGJ1ZltpXSA9PT0gY2hyLmNoYXJDb2RlQXQobWF0Y2hlcykpXG5cdFx0XHQrK21hdGNoZXM7XG5cdFx0ZWxzZSBpZiAoYnVmW2ldID09PSBjaHIuY2hhckNvZGVBdCgwKSlcblx0XHRcdG1hdGNoZXMgPSAxO1xuXHRcdGVsc2Vcblx0XHRcdG1hdGNoZXMgPSAwO1xuXG5cdFx0aWYgKG1hdGNoZXMgPj0gY2hyLmxlbmd0aCkge1xuXHRcdFx0dmFyIG5ld1BhcnQgPSBpICsgMTtcblx0XHRcdHBhcnRzLnB1c2goYnVmLnNsaWNlKGxhc3RQYXJ0LCBuZXdQYXJ0IC0gbWF0Y2hlcykpO1xuXHRcdFx0bGFzdFBhcnQgPSBuZXdQYXJ0O1xuXHRcdFx0bWF0Y2hlcyA9IDA7XG5cdFx0fVxuXHR9XG5cdGlmIChsYXN0UGFydCA8PSBidWYubGVuZ3RoKVxuXHRcdHBhcnRzLnB1c2goYnVmLnNsaWNlKGxhc3RQYXJ0LCBidWYubGVuZ3RoKSk7XG5cblx0cmV0dXJuIChwYXJ0cyk7XG59XG5cbmZ1bmN0aW9uIGVjTm9ybWFsaXplKGJ1ZiwgYWRkWmVybykge1xuXHRhc3NlcnQuYnVmZmVyKGJ1Zik7XG5cdGlmIChidWZbMF0gPT09IDB4MDAgJiYgYnVmWzFdID09PSAweDA0KSB7XG5cdFx0aWYgKGFkZFplcm8pXG5cdFx0XHRyZXR1cm4gKGJ1Zik7XG5cdFx0cmV0dXJuIChidWYuc2xpY2UoMSkpO1xuXHR9IGVsc2UgaWYgKGJ1ZlswXSA9PT0gMHgwNCkge1xuXHRcdGlmICghYWRkWmVybylcblx0XHRcdHJldHVybiAoYnVmKTtcblx0fSBlbHNlIHtcblx0XHR3aGlsZSAoYnVmWzBdID09PSAweDAwKVxuXHRcdFx0YnVmID0gYnVmLnNsaWNlKDEpO1xuXHRcdGlmIChidWZbMF0gPT09IDB4MDIgfHwgYnVmWzBdID09PSAweDAzKVxuXHRcdFx0dGhyb3cgKG5ldyBFcnJvcignQ29tcHJlc3NlZCBlbGxpcHRpYyBjdXJ2ZSBwb2ludHMgJyArXG5cdFx0XHQgICAgJ2FyZSBub3Qgc3VwcG9ydGVkJykpO1xuXHRcdGlmIChidWZbMF0gIT09IDB4MDQpXG5cdFx0XHR0aHJvdyAobmV3IEVycm9yKCdOb3QgYSB2YWxpZCBlbGxpcHRpYyBjdXJ2ZSBwb2ludCcpKTtcblx0XHRpZiAoIWFkZFplcm8pXG5cdFx0XHRyZXR1cm4gKGJ1Zik7XG5cdH1cblx0dmFyIGIgPSBCdWZmZXIuYWxsb2MoYnVmLmxlbmd0aCArIDEpO1xuXHRiWzBdID0gMHgwO1xuXHRidWYuY29weShiLCAxKTtcblx0cmV0dXJuIChiKTtcbn1cblxuZnVuY3Rpb24gcmVhZEJpdFN0cmluZyhkZXIsIHRhZykge1xuXHRpZiAodGFnID09PSB1bmRlZmluZWQpXG5cdFx0dGFnID0gYXNuMS5CZXIuQml0U3RyaW5nO1xuXHR2YXIgYnVmID0gZGVyLnJlYWRTdHJpbmcodGFnLCB0cnVlKTtcblx0YXNzZXJ0LnN0cmljdEVxdWFsKGJ1ZlswXSwgMHgwMCwgJ2JpdCBzdHJpbmdzIHdpdGggdW51c2VkIGJpdHMgYXJlICcgK1xuXHQgICAgJ25vdCBzdXBwb3J0ZWQgKDB4JyArIGJ1ZlswXS50b1N0cmluZygxNikgKyAnKScpO1xuXHRyZXR1cm4gKGJ1Zi5zbGljZSgxKSk7XG59XG5cbmZ1bmN0aW9uIHdyaXRlQml0U3RyaW5nKGRlciwgYnVmLCB0YWcpIHtcblx0aWYgKHRhZyA9PT0gdW5kZWZpbmVkKVxuXHRcdHRhZyA9IGFzbjEuQmVyLkJpdFN0cmluZztcblx0dmFyIGIgPSBCdWZmZXIuYWxsb2MoYnVmLmxlbmd0aCArIDEpO1xuXHRiWzBdID0gMHgwMDtcblx0YnVmLmNvcHkoYiwgMSk7XG5cdGRlci53cml0ZUJ1ZmZlcihiLCB0YWcpO1xufVxuXG5mdW5jdGlvbiBtcE5vcm1hbGl6ZShidWYpIHtcblx0YXNzZXJ0LmJ1ZmZlcihidWYpO1xuXHR3aGlsZSAoYnVmLmxlbmd0aCA+IDEgJiYgYnVmWzBdID09PSAweDAwICYmIChidWZbMV0gJiAweDgwKSA9PT0gMHgwMClcblx0XHRidWYgPSBidWYuc2xpY2UoMSk7XG5cdGlmICgoYnVmWzBdICYgMHg4MCkgPT09IDB4ODApIHtcblx0XHR2YXIgYiA9IEJ1ZmZlci5hbGxvYyhidWYubGVuZ3RoICsgMSk7XG5cdFx0YlswXSA9IDB4MDA7XG5cdFx0YnVmLmNvcHkoYiwgMSk7XG5cdFx0YnVmID0gYjtcblx0fVxuXHRyZXR1cm4gKGJ1Zik7XG59XG5cbmZ1bmN0aW9uIG1wRGVub3JtYWxpemUoYnVmKSB7XG5cdGFzc2VydC5idWZmZXIoYnVmKTtcblx0d2hpbGUgKGJ1Zi5sZW5ndGggPiAxICYmIGJ1ZlswXSA9PT0gMHgwMClcblx0XHRidWYgPSBidWYuc2xpY2UoMSk7XG5cdHJldHVybiAoYnVmKTtcbn1cblxuZnVuY3Rpb24gemVyb1BhZFRvTGVuZ3RoKGJ1ZiwgbGVuKSB7XG5cdGFzc2VydC5idWZmZXIoYnVmKTtcblx0YXNzZXJ0Lm51bWJlcihsZW4pO1xuXHR3aGlsZSAoYnVmLmxlbmd0aCA+IGxlbikge1xuXHRcdGFzc2VydC5lcXVhbChidWZbMF0sIDB4MDApO1xuXHRcdGJ1ZiA9IGJ1Zi5zbGljZSgxKTtcblx0fVxuXHR3aGlsZSAoYnVmLmxlbmd0aCA8IGxlbikge1xuXHRcdHZhciBiID0gQnVmZmVyLmFsbG9jKGJ1Zi5sZW5ndGggKyAxKTtcblx0XHRiWzBdID0gMHgwMDtcblx0XHRidWYuY29weShiLCAxKTtcblx0XHRidWYgPSBiO1xuXHR9XG5cdHJldHVybiAoYnVmKTtcbn1cblxuZnVuY3Rpb24gYmlnaW50VG9NcEJ1ZihiaWdpbnQpIHtcblx0dmFyIGJ1ZiA9IEJ1ZmZlci5mcm9tKGJpZ2ludC50b0J5dGVBcnJheSgpKTtcblx0YnVmID0gbXBOb3JtYWxpemUoYnVmKTtcblx0cmV0dXJuIChidWYpO1xufVxuXG5mdW5jdGlvbiBjYWxjdWxhdGVEU0FQdWJsaWMoZywgcCwgeCkge1xuXHRhc3NlcnQuYnVmZmVyKGcpO1xuXHRhc3NlcnQuYnVmZmVyKHApO1xuXHRhc3NlcnQuYnVmZmVyKHgpO1xuXHRnID0gbmV3IGpzYm4oZyk7XG5cdHAgPSBuZXcganNibihwKTtcblx0eCA9IG5ldyBqc2JuKHgpO1xuXHR2YXIgeSA9IGcubW9kUG93KHgsIHApO1xuXHR2YXIgeWJ1ZiA9IGJpZ2ludFRvTXBCdWYoeSk7XG5cdHJldHVybiAoeWJ1Zik7XG59XG5cbmZ1bmN0aW9uIGNhbGN1bGF0ZUVEMjU1MTlQdWJsaWMoaykge1xuXHRhc3NlcnQuYnVmZmVyKGspO1xuXG5cdHZhciBrcCA9IG5hY2wuc2lnbi5rZXlQYWlyLmZyb21TZWVkKG5ldyBVaW50OEFycmF5KGspKTtcblx0cmV0dXJuIChCdWZmZXIuZnJvbShrcC5wdWJsaWNLZXkpKTtcbn1cblxuZnVuY3Rpb24gY2FsY3VsYXRlWDI1NTE5UHVibGljKGspIHtcblx0YXNzZXJ0LmJ1ZmZlcihrKTtcblxuXHR2YXIga3AgPSBuYWNsLmJveC5rZXlQYWlyLmZyb21TZWVkKG5ldyBVaW50OEFycmF5KGspKTtcblx0cmV0dXJuIChCdWZmZXIuZnJvbShrcC5wdWJsaWNLZXkpKTtcbn1cblxuZnVuY3Rpb24gYWRkUlNBTWlzc2luZyhrZXkpIHtcblx0YXNzZXJ0Lm9iamVjdChrZXkpO1xuXHRhc3NlcnRDb21wYXRpYmxlKGtleSwgUHJpdmF0ZUtleSwgWzEsIDFdKTtcblxuXHR2YXIgZCA9IG5ldyBqc2JuKGtleS5wYXJ0LmQuZGF0YSk7XG5cdHZhciBidWY7XG5cblx0aWYgKCFrZXkucGFydC5kbW9kcCkge1xuXHRcdHZhciBwID0gbmV3IGpzYm4oa2V5LnBhcnQucC5kYXRhKTtcblx0XHR2YXIgZG1vZHAgPSBkLm1vZChwLnN1YnRyYWN0KDEpKTtcblxuXHRcdGJ1ZiA9IGJpZ2ludFRvTXBCdWYoZG1vZHApO1xuXHRcdGtleS5wYXJ0LmRtb2RwID0ge25hbWU6ICdkbW9kcCcsIGRhdGE6IGJ1Zn07XG5cdFx0a2V5LnBhcnRzLnB1c2goa2V5LnBhcnQuZG1vZHApO1xuXHR9XG5cdGlmICgha2V5LnBhcnQuZG1vZHEpIHtcblx0XHR2YXIgcSA9IG5ldyBqc2JuKGtleS5wYXJ0LnEuZGF0YSk7XG5cdFx0dmFyIGRtb2RxID0gZC5tb2QocS5zdWJ0cmFjdCgxKSk7XG5cblx0XHRidWYgPSBiaWdpbnRUb01wQnVmKGRtb2RxKTtcblx0XHRrZXkucGFydC5kbW9kcSA9IHtuYW1lOiAnZG1vZHEnLCBkYXRhOiBidWZ9O1xuXHRcdGtleS5wYXJ0cy5wdXNoKGtleS5wYXJ0LmRtb2RxKTtcblx0fVxufVxuXG5mdW5jdGlvbiBwdWJsaWNGcm9tUHJpdmF0ZUVDRFNBKGN1cnZlTmFtZSwgcHJpdikge1xuXHRhc3NlcnQuc3RyaW5nKGN1cnZlTmFtZSwgJ2N1cnZlTmFtZScpO1xuXHRhc3NlcnQuYnVmZmVyKHByaXYpO1xuXHR2YXIgcGFyYW1zID0gYWxncy5jdXJ2ZXNbY3VydmVOYW1lXTtcblx0dmFyIHAgPSBuZXcganNibihwYXJhbXMucCk7XG5cdHZhciBhID0gbmV3IGpzYm4ocGFyYW1zLmEpO1xuXHR2YXIgYiA9IG5ldyBqc2JuKHBhcmFtcy5iKTtcblx0dmFyIGN1cnZlID0gbmV3IGVjLkVDQ3VydmVGcChwLCBhLCBiKTtcblx0dmFyIEcgPSBjdXJ2ZS5kZWNvZGVQb2ludEhleChwYXJhbXMuRy50b1N0cmluZygnaGV4JykpO1xuXG5cdHZhciBkID0gbmV3IGpzYm4obXBOb3JtYWxpemUocHJpdikpO1xuXHR2YXIgcHViID0gRy5tdWx0aXBseShkKTtcblx0cHViID0gQnVmZmVyLmZyb20oY3VydmUuZW5jb2RlUG9pbnRIZXgocHViKSwgJ2hleCcpO1xuXG5cdHZhciBwYXJ0cyA9IFtdO1xuXHRwYXJ0cy5wdXNoKHtuYW1lOiAnY3VydmUnLCBkYXRhOiBCdWZmZXIuZnJvbShjdXJ2ZU5hbWUpfSk7XG5cdHBhcnRzLnB1c2goe25hbWU6ICdRJywgZGF0YTogcHVifSk7XG5cblx0dmFyIGtleSA9IG5ldyBLZXkoe3R5cGU6ICdlY2RzYScsIGN1cnZlOiBjdXJ2ZSwgcGFydHM6IHBhcnRzfSk7XG5cdHJldHVybiAoa2V5KTtcbn1cblxuZnVuY3Rpb24gb3BlbnNzaENpcGhlckluZm8oY2lwaGVyKSB7XG5cdHZhciBpbmYgPSB7fTtcblx0c3dpdGNoIChjaXBoZXIpIHtcblx0Y2FzZSAnM2Rlcy1jYmMnOlxuXHRcdGluZi5rZXlTaXplID0gMjQ7XG5cdFx0aW5mLmJsb2NrU2l6ZSA9IDg7XG5cdFx0aW5mLm9wZW5zc2xOYW1lID0gJ2Rlcy1lZGUzLWNiYyc7XG5cdFx0YnJlYWs7XG5cdGNhc2UgJ2Jsb3dmaXNoLWNiYyc6XG5cdFx0aW5mLmtleVNpemUgPSAxNjtcblx0XHRpbmYuYmxvY2tTaXplID0gODtcblx0XHRpbmYub3BlbnNzbE5hbWUgPSAnYmYtY2JjJztcblx0XHRicmVhaztcblx0Y2FzZSAnYWVzMTI4LWNiYyc6XG5cdGNhc2UgJ2FlczEyOC1jdHInOlxuXHRjYXNlICdhZXMxMjgtZ2NtQG9wZW5zc2guY29tJzpcblx0XHRpbmYua2V5U2l6ZSA9IDE2O1xuXHRcdGluZi5ibG9ja1NpemUgPSAxNjtcblx0XHRpbmYub3BlbnNzbE5hbWUgPSAnYWVzLTEyOC0nICsgY2lwaGVyLnNsaWNlKDcsIDEwKTtcblx0XHRicmVhaztcblx0Y2FzZSAnYWVzMTkyLWNiYyc6XG5cdGNhc2UgJ2FlczE5Mi1jdHInOlxuXHRjYXNlICdhZXMxOTItZ2NtQG9wZW5zc2guY29tJzpcblx0XHRpbmYua2V5U2l6ZSA9IDI0O1xuXHRcdGluZi5ibG9ja1NpemUgPSAxNjtcblx0XHRpbmYub3BlbnNzbE5hbWUgPSAnYWVzLTE5Mi0nICsgY2lwaGVyLnNsaWNlKDcsIDEwKTtcblx0XHRicmVhaztcblx0Y2FzZSAnYWVzMjU2LWNiYyc6XG5cdGNhc2UgJ2FlczI1Ni1jdHInOlxuXHRjYXNlICdhZXMyNTYtZ2NtQG9wZW5zc2guY29tJzpcblx0XHRpbmYua2V5U2l6ZSA9IDMyO1xuXHRcdGluZi5ibG9ja1NpemUgPSAxNjtcblx0XHRpbmYub3BlbnNzbE5hbWUgPSAnYWVzLTI1Ni0nICsgY2lwaGVyLnNsaWNlKDcsIDEwKTtcblx0XHRicmVhaztcblx0ZGVmYXVsdDpcblx0XHR0aHJvdyAobmV3IEVycm9yKFxuXHRcdCAgICAnVW5zdXBwb3J0ZWQgb3BlbnNzbCBjaXBoZXIgXCInICsgY2lwaGVyICsgJ1wiJykpO1xuXHR9XG5cdHJldHVybiAoaW5mKTtcbn1cbiIsIi8vIENvcHlyaWdodCAyMDE1IEpveWVudCwgSW5jLlxuXG52YXIgS2V5ID0gcmVxdWlyZSgnLi9rZXknKTtcbnZhciBGaW5nZXJwcmludCA9IHJlcXVpcmUoJy4vZmluZ2VycHJpbnQnKTtcbnZhciBTaWduYXR1cmUgPSByZXF1aXJlKCcuL3NpZ25hdHVyZScpO1xudmFyIFByaXZhdGVLZXkgPSByZXF1aXJlKCcuL3ByaXZhdGUta2V5Jyk7XG52YXIgQ2VydGlmaWNhdGUgPSByZXF1aXJlKCcuL2NlcnRpZmljYXRlJyk7XG52YXIgSWRlbnRpdHkgPSByZXF1aXJlKCcuL2lkZW50aXR5Jyk7XG52YXIgZXJycyA9IHJlcXVpcmUoJy4vZXJyb3JzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHQvKiB0b3AtbGV2ZWwgY2xhc3NlcyAqL1xuXHRLZXk6IEtleSxcblx0cGFyc2VLZXk6IEtleS5wYXJzZSxcblx0RmluZ2VycHJpbnQ6IEZpbmdlcnByaW50LFxuXHRwYXJzZUZpbmdlcnByaW50OiBGaW5nZXJwcmludC5wYXJzZSxcblx0U2lnbmF0dXJlOiBTaWduYXR1cmUsXG5cdHBhcnNlU2lnbmF0dXJlOiBTaWduYXR1cmUucGFyc2UsXG5cdFByaXZhdGVLZXk6IFByaXZhdGVLZXksXG5cdHBhcnNlUHJpdmF0ZUtleTogUHJpdmF0ZUtleS5wYXJzZSxcblx0Z2VuZXJhdGVQcml2YXRlS2V5OiBQcml2YXRlS2V5LmdlbmVyYXRlLFxuXHRDZXJ0aWZpY2F0ZTogQ2VydGlmaWNhdGUsXG5cdHBhcnNlQ2VydGlmaWNhdGU6IENlcnRpZmljYXRlLnBhcnNlLFxuXHRjcmVhdGVTZWxmU2lnbmVkQ2VydGlmaWNhdGU6IENlcnRpZmljYXRlLmNyZWF0ZVNlbGZTaWduZWQsXG5cdGNyZWF0ZUNlcnRpZmljYXRlOiBDZXJ0aWZpY2F0ZS5jcmVhdGUsXG5cdElkZW50aXR5OiBJZGVudGl0eSxcblx0aWRlbnRpdHlGcm9tRE46IElkZW50aXR5LnBhcnNlRE4sXG5cdGlkZW50aXR5Rm9ySG9zdDogSWRlbnRpdHkuZm9ySG9zdCxcblx0aWRlbnRpdHlGb3JVc2VyOiBJZGVudGl0eS5mb3JVc2VyLFxuXHRpZGVudGl0eUZvckVtYWlsOiBJZGVudGl0eS5mb3JFbWFpbCxcblx0aWRlbnRpdHlGcm9tQXJyYXk6IElkZW50aXR5LmZyb21BcnJheSxcblxuXHQvKiBlcnJvcnMgKi9cblx0RmluZ2VycHJpbnRGb3JtYXRFcnJvcjogZXJycy5GaW5nZXJwcmludEZvcm1hdEVycm9yLFxuXHRJbnZhbGlkQWxnb3JpdGhtRXJyb3I6IGVycnMuSW52YWxpZEFsZ29yaXRobUVycm9yLFxuXHRLZXlQYXJzZUVycm9yOiBlcnJzLktleVBhcnNlRXJyb3IsXG5cdFNpZ25hdHVyZVBhcnNlRXJyb3I6IGVycnMuU2lnbmF0dXJlUGFyc2VFcnJvcixcblx0S2V5RW5jcnlwdGVkRXJyb3I6IGVycnMuS2V5RW5jcnlwdGVkRXJyb3IsXG5cdENlcnRpZmljYXRlUGFyc2VFcnJvcjogZXJycy5DZXJ0aWZpY2F0ZVBhcnNlRXJyb3Jcbn07XG4iLCIvLyBDb3B5cmlnaHQgMjAxNiBKb3llbnQsIEluYy5cblxudmFyIHg1MDkgPSByZXF1aXJlKCcuL3g1MDknKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdHJlYWQ6IHJlYWQsXG5cdHZlcmlmeTogeDUwOS52ZXJpZnksXG5cdHNpZ246IHg1MDkuc2lnbixcblx0d3JpdGU6IHdyaXRlXG59O1xuXG52YXIgYXNzZXJ0ID0gcmVxdWlyZSgnYXNzZXJ0LXBsdXMnKTtcbnZhciBhc24xID0gcmVxdWlyZSgnYXNuMScpO1xudmFyIEJ1ZmZlciA9IHJlcXVpcmUoJ3NhZmVyLWJ1ZmZlcicpLkJ1ZmZlcjtcbnZhciBhbGdzID0gcmVxdWlyZSgnLi4vYWxncycpO1xudmFyIHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbHMnKTtcbnZhciBLZXkgPSByZXF1aXJlKCcuLi9rZXknKTtcbnZhciBQcml2YXRlS2V5ID0gcmVxdWlyZSgnLi4vcHJpdmF0ZS1rZXknKTtcbnZhciBwZW0gPSByZXF1aXJlKCcuL3BlbScpO1xudmFyIElkZW50aXR5ID0gcmVxdWlyZSgnLi4vaWRlbnRpdHknKTtcbnZhciBTaWduYXR1cmUgPSByZXF1aXJlKCcuLi9zaWduYXR1cmUnKTtcbnZhciBDZXJ0aWZpY2F0ZSA9IHJlcXVpcmUoJy4uL2NlcnRpZmljYXRlJyk7XG5cbmZ1bmN0aW9uIHJlYWQoYnVmLCBvcHRpb25zKSB7XG5cdGlmICh0eXBlb2YgKGJ1ZikgIT09ICdzdHJpbmcnKSB7XG5cdFx0YXNzZXJ0LmJ1ZmZlcihidWYsICdidWYnKTtcblx0XHRidWYgPSBidWYudG9TdHJpbmcoJ2FzY2lpJyk7XG5cdH1cblxuXHR2YXIgbGluZXMgPSBidWYudHJpbSgpLnNwbGl0KC9bXFxyXFxuXSsvZyk7XG5cblx0dmFyIG07XG5cdHZhciBzaSA9IC0xO1xuXHR3aGlsZSAoIW0gJiYgc2kgPCBsaW5lcy5sZW5ndGgpIHtcblx0XHRtID0gbGluZXNbKytzaV0ubWF0Y2goLypKU1NUWUxFRCovXG5cdFx0ICAgIC9bLV0rWyBdKkJFR0lOIENFUlRJRklDQVRFWyBdKlstXSsvKTtcblx0fVxuXHRhc3NlcnQub2sobSwgJ2ludmFsaWQgUEVNIGhlYWRlcicpO1xuXG5cdHZhciBtMjtcblx0dmFyIGVpID0gbGluZXMubGVuZ3RoO1xuXHR3aGlsZSAoIW0yICYmIGVpID4gMCkge1xuXHRcdG0yID0gbGluZXNbLS1laV0ubWF0Y2goLypKU1NUWUxFRCovXG5cdFx0ICAgIC9bLV0rWyBdKkVORCBDRVJUSUZJQ0FURVsgXSpbLV0rLyk7XG5cdH1cblx0YXNzZXJ0Lm9rKG0yLCAnaW52YWxpZCBQRU0gZm9vdGVyJyk7XG5cblx0bGluZXMgPSBsaW5lcy5zbGljZShzaSwgZWkgKyAxKTtcblxuXHR2YXIgaGVhZGVycyA9IHt9O1xuXHR3aGlsZSAodHJ1ZSkge1xuXHRcdGxpbmVzID0gbGluZXMuc2xpY2UoMSk7XG5cdFx0bSA9IGxpbmVzWzBdLm1hdGNoKC8qSlNTVFlMRUQqL1xuXHRcdCAgICAvXihbQS1aYS16MC05LV0rKTogKC4rKSQvKTtcblx0XHRpZiAoIW0pXG5cdFx0XHRicmVhaztcblx0XHRoZWFkZXJzW21bMV0udG9Mb3dlckNhc2UoKV0gPSBtWzJdO1xuXHR9XG5cblx0LyogQ2hvcCBvZmYgdGhlIGZpcnN0IGFuZCBsYXN0IGxpbmVzICovXG5cdGxpbmVzID0gbGluZXMuc2xpY2UoMCwgLTEpLmpvaW4oJycpO1xuXHRidWYgPSBCdWZmZXIuZnJvbShsaW5lcywgJ2Jhc2U2NCcpO1xuXG5cdHJldHVybiAoeDUwOS5yZWFkKGJ1Ziwgb3B0aW9ucykpO1xufVxuXG5mdW5jdGlvbiB3cml0ZShjZXJ0LCBvcHRpb25zKSB7XG5cdHZhciBkYnVmID0geDUwOS53cml0ZShjZXJ0LCBvcHRpb25zKTtcblxuXHR2YXIgaGVhZGVyID0gJ0NFUlRJRklDQVRFJztcblx0dmFyIHRtcCA9IGRidWYudG9TdHJpbmcoJ2Jhc2U2NCcpO1xuXHR2YXIgbGVuID0gdG1wLmxlbmd0aCArICh0bXAubGVuZ3RoIC8gNjQpICtcblx0ICAgIDE4ICsgMTYgKyBoZWFkZXIubGVuZ3RoKjIgKyAxMDtcblx0dmFyIGJ1ZiA9IEJ1ZmZlci5hbGxvYyhsZW4pO1xuXHR2YXIgbyA9IDA7XG5cdG8gKz0gYnVmLndyaXRlKCctLS0tLUJFR0lOICcgKyBoZWFkZXIgKyAnLS0tLS1cXG4nLCBvKTtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCB0bXAubGVuZ3RoOyApIHtcblx0XHR2YXIgbGltaXQgPSBpICsgNjQ7XG5cdFx0aWYgKGxpbWl0ID4gdG1wLmxlbmd0aClcblx0XHRcdGxpbWl0ID0gdG1wLmxlbmd0aDtcblx0XHRvICs9IGJ1Zi53cml0ZSh0bXAuc2xpY2UoaSwgbGltaXQpLCBvKTtcblx0XHRidWZbbysrXSA9IDEwO1xuXHRcdGkgPSBsaW1pdDtcblx0fVxuXHRvICs9IGJ1Zi53cml0ZSgnLS0tLS1FTkQgJyArIGhlYWRlciArICctLS0tLVxcbicsIG8pO1xuXG5cdHJldHVybiAoYnVmLnNsaWNlKDAsIG8pKTtcbn1cbiIsIi8vIENvcHlyaWdodCAyMDE1IEpveWVudCwgSW5jLlxuXG52YXIgYXNzZXJ0ID0gcmVxdWlyZSgnYXNzZXJ0LXBsdXMnKTtcbnZhciB1dGlsID0gcmVxdWlyZSgndXRpbCcpO1xuXG5mdW5jdGlvbiBGaW5nZXJwcmludEZvcm1hdEVycm9yKGZwLCBmb3JtYXQpIHtcblx0aWYgKEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKVxuXHRcdEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKHRoaXMsIEZpbmdlcnByaW50Rm9ybWF0RXJyb3IpO1xuXHR0aGlzLm5hbWUgPSAnRmluZ2VycHJpbnRGb3JtYXRFcnJvcic7XG5cdHRoaXMuZmluZ2VycHJpbnQgPSBmcDtcblx0dGhpcy5mb3JtYXQgPSBmb3JtYXQ7XG5cdHRoaXMubWVzc2FnZSA9ICdGaW5nZXJwcmludCBmb3JtYXQgaXMgbm90IHN1cHBvcnRlZCwgb3IgaXMgaW52YWxpZDogJztcblx0aWYgKGZwICE9PSB1bmRlZmluZWQpXG5cdFx0dGhpcy5tZXNzYWdlICs9ICcgZmluZ2VycHJpbnQgPSAnICsgZnA7XG5cdGlmIChmb3JtYXQgIT09IHVuZGVmaW5lZClcblx0XHR0aGlzLm1lc3NhZ2UgKz0gJyBmb3JtYXQgPSAnICsgZm9ybWF0O1xufVxudXRpbC5pbmhlcml0cyhGaW5nZXJwcmludEZvcm1hdEVycm9yLCBFcnJvcik7XG5cbmZ1bmN0aW9uIEludmFsaWRBbGdvcml0aG1FcnJvcihhbGcpIHtcblx0aWYgKEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKVxuXHRcdEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKHRoaXMsIEludmFsaWRBbGdvcml0aG1FcnJvcik7XG5cdHRoaXMubmFtZSA9ICdJbnZhbGlkQWxnb3JpdGhtRXJyb3InO1xuXHR0aGlzLmFsZ29yaXRobSA9IGFsZztcblx0dGhpcy5tZXNzYWdlID0gJ0FsZ29yaXRobSBcIicgKyBhbGcgKyAnXCIgaXMgbm90IHN1cHBvcnRlZCc7XG59XG51dGlsLmluaGVyaXRzKEludmFsaWRBbGdvcml0aG1FcnJvciwgRXJyb3IpO1xuXG5mdW5jdGlvbiBLZXlQYXJzZUVycm9yKG5hbWUsIGZvcm1hdCwgaW5uZXJFcnIpIHtcblx0aWYgKEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKVxuXHRcdEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKHRoaXMsIEtleVBhcnNlRXJyb3IpO1xuXHR0aGlzLm5hbWUgPSAnS2V5UGFyc2VFcnJvcic7XG5cdHRoaXMuZm9ybWF0ID0gZm9ybWF0O1xuXHR0aGlzLmtleU5hbWUgPSBuYW1lO1xuXHR0aGlzLmlubmVyRXJyID0gaW5uZXJFcnI7XG5cdHRoaXMubWVzc2FnZSA9ICdGYWlsZWQgdG8gcGFyc2UgJyArIG5hbWUgKyAnIGFzIGEgdmFsaWQgJyArIGZvcm1hdCArXG5cdCAgICAnIGZvcm1hdCBrZXk6ICcgKyBpbm5lckVyci5tZXNzYWdlO1xufVxudXRpbC5pbmhlcml0cyhLZXlQYXJzZUVycm9yLCBFcnJvcik7XG5cbmZ1bmN0aW9uIFNpZ25hdHVyZVBhcnNlRXJyb3IodHlwZSwgZm9ybWF0LCBpbm5lckVycikge1xuXHRpZiAoRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UpXG5cdFx0RXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UodGhpcywgU2lnbmF0dXJlUGFyc2VFcnJvcik7XG5cdHRoaXMubmFtZSA9ICdTaWduYXR1cmVQYXJzZUVycm9yJztcblx0dGhpcy50eXBlID0gdHlwZTtcblx0dGhpcy5mb3JtYXQgPSBmb3JtYXQ7XG5cdHRoaXMuaW5uZXJFcnIgPSBpbm5lckVycjtcblx0dGhpcy5tZXNzYWdlID0gJ0ZhaWxlZCB0byBwYXJzZSB0aGUgZ2l2ZW4gZGF0YSBhcyBhICcgKyB0eXBlICtcblx0ICAgICcgc2lnbmF0dXJlIGluICcgKyBmb3JtYXQgKyAnIGZvcm1hdDogJyArIGlubmVyRXJyLm1lc3NhZ2U7XG59XG51dGlsLmluaGVyaXRzKFNpZ25hdHVyZVBhcnNlRXJyb3IsIEVycm9yKTtcblxuZnVuY3Rpb24gQ2VydGlmaWNhdGVQYXJzZUVycm9yKG5hbWUsIGZvcm1hdCwgaW5uZXJFcnIpIHtcblx0aWYgKEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKVxuXHRcdEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKHRoaXMsIENlcnRpZmljYXRlUGFyc2VFcnJvcik7XG5cdHRoaXMubmFtZSA9ICdDZXJ0aWZpY2F0ZVBhcnNlRXJyb3InO1xuXHR0aGlzLmZvcm1hdCA9IGZvcm1hdDtcblx0dGhpcy5jZXJ0TmFtZSA9IG5hbWU7XG5cdHRoaXMuaW5uZXJFcnIgPSBpbm5lckVycjtcblx0dGhpcy5tZXNzYWdlID0gJ0ZhaWxlZCB0byBwYXJzZSAnICsgbmFtZSArICcgYXMgYSB2YWxpZCAnICsgZm9ybWF0ICtcblx0ICAgICcgZm9ybWF0IGNlcnRpZmljYXRlOiAnICsgaW5uZXJFcnIubWVzc2FnZTtcbn1cbnV0aWwuaW5oZXJpdHMoQ2VydGlmaWNhdGVQYXJzZUVycm9yLCBFcnJvcik7XG5cbmZ1bmN0aW9uIEtleUVuY3J5cHRlZEVycm9yKG5hbWUsIGZvcm1hdCkge1xuXHRpZiAoRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UpXG5cdFx0RXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UodGhpcywgS2V5RW5jcnlwdGVkRXJyb3IpO1xuXHR0aGlzLm5hbWUgPSAnS2V5RW5jcnlwdGVkRXJyb3InO1xuXHR0aGlzLmZvcm1hdCA9IGZvcm1hdDtcblx0dGhpcy5rZXlOYW1lID0gbmFtZTtcblx0dGhpcy5tZXNzYWdlID0gJ1RoZSAnICsgZm9ybWF0ICsgJyBmb3JtYXQga2V5ICcgKyBuYW1lICsgJyBpcyAnICtcblx0ICAgICdlbmNyeXB0ZWQgKHBhc3N3b3JkLXByb3RlY3RlZCksIGFuZCBubyBwYXNzcGhyYXNlIHdhcyAnICtcblx0ICAgICdwcm92aWRlZCBpbiBgb3B0aW9uc2AnO1xufVxudXRpbC5pbmhlcml0cyhLZXlFbmNyeXB0ZWRFcnJvciwgRXJyb3IpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0RmluZ2VycHJpbnRGb3JtYXRFcnJvcjogRmluZ2VycHJpbnRGb3JtYXRFcnJvcixcblx0SW52YWxpZEFsZ29yaXRobUVycm9yOiBJbnZhbGlkQWxnb3JpdGhtRXJyb3IsXG5cdEtleVBhcnNlRXJyb3I6IEtleVBhcnNlRXJyb3IsXG5cdFNpZ25hdHVyZVBhcnNlRXJyb3I6IFNpZ25hdHVyZVBhcnNlRXJyb3IsXG5cdEtleUVuY3J5cHRlZEVycm9yOiBLZXlFbmNyeXB0ZWRFcnJvcixcblx0Q2VydGlmaWNhdGVQYXJzZUVycm9yOiBDZXJ0aWZpY2F0ZVBhcnNlRXJyb3Jcbn07XG4iLCIvLyBDb3B5cmlnaHQgMjAxNyBKb3llbnQsIEluYy5cblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdHJlYWQ6IHJlYWQsXG5cdHZlcmlmeTogdmVyaWZ5LFxuXHRzaWduOiBzaWduLFxuXHRzaWduQXN5bmM6IHNpZ25Bc3luYyxcblx0d3JpdGU6IHdyaXRlXG59O1xuXG52YXIgYXNzZXJ0ID0gcmVxdWlyZSgnYXNzZXJ0LXBsdXMnKTtcbnZhciBhc24xID0gcmVxdWlyZSgnYXNuMScpO1xudmFyIEJ1ZmZlciA9IHJlcXVpcmUoJ3NhZmVyLWJ1ZmZlcicpLkJ1ZmZlcjtcbnZhciBhbGdzID0gcmVxdWlyZSgnLi4vYWxncycpO1xudmFyIHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbHMnKTtcbnZhciBLZXkgPSByZXF1aXJlKCcuLi9rZXknKTtcbnZhciBQcml2YXRlS2V5ID0gcmVxdWlyZSgnLi4vcHJpdmF0ZS1rZXknKTtcbnZhciBwZW0gPSByZXF1aXJlKCcuL3BlbScpO1xudmFyIElkZW50aXR5ID0gcmVxdWlyZSgnLi4vaWRlbnRpdHknKTtcbnZhciBTaWduYXR1cmUgPSByZXF1aXJlKCcuLi9zaWduYXR1cmUnKTtcbnZhciBDZXJ0aWZpY2F0ZSA9IHJlcXVpcmUoJy4uL2NlcnRpZmljYXRlJyk7XG52YXIgcGtjczggPSByZXF1aXJlKCcuL3BrY3M4Jyk7XG5cbi8qXG4gKiBUaGlzIGZpbGUgaXMgYmFzZWQgb24gUkZDNTI4MCAoWC41MDkpLlxuICovXG5cbi8qIEhlbHBlciB0byByZWFkIGluIGEgc2luZ2xlIG1waW50ICovXG5mdW5jdGlvbiByZWFkTVBJbnQoZGVyLCBubSkge1xuXHRhc3NlcnQuc3RyaWN0RXF1YWwoZGVyLnBlZWsoKSwgYXNuMS5CZXIuSW50ZWdlcixcblx0ICAgIG5tICsgJyBpcyBub3QgYW4gSW50ZWdlcicpO1xuXHRyZXR1cm4gKHV0aWxzLm1wTm9ybWFsaXplKGRlci5yZWFkU3RyaW5nKGFzbjEuQmVyLkludGVnZXIsIHRydWUpKSk7XG59XG5cbmZ1bmN0aW9uIHZlcmlmeShjZXJ0LCBrZXkpIHtcblx0dmFyIHNpZyA9IGNlcnQuc2lnbmF0dXJlcy54NTA5O1xuXHRhc3NlcnQub2JqZWN0KHNpZywgJ3g1MDkgc2lnbmF0dXJlJyk7XG5cblx0dmFyIGFsZ1BhcnRzID0gc2lnLmFsZ28uc3BsaXQoJy0nKTtcblx0aWYgKGFsZ1BhcnRzWzBdICE9PSBrZXkudHlwZSlcblx0XHRyZXR1cm4gKGZhbHNlKTtcblxuXHR2YXIgYmxvYiA9IHNpZy5jYWNoZTtcblx0aWYgKGJsb2IgPT09IHVuZGVmaW5lZCkge1xuXHRcdHZhciBkZXIgPSBuZXcgYXNuMS5CZXJXcml0ZXIoKTtcblx0XHR3cml0ZVRCU0NlcnQoY2VydCwgZGVyKTtcblx0XHRibG9iID0gZGVyLmJ1ZmZlcjtcblx0fVxuXG5cdHZhciB2ZXJpZmllciA9IGtleS5jcmVhdGVWZXJpZnkoYWxnUGFydHNbMV0pO1xuXHR2ZXJpZmllci53cml0ZShibG9iKTtcblx0cmV0dXJuICh2ZXJpZmllci52ZXJpZnkoc2lnLnNpZ25hdHVyZSkpO1xufVxuXG5mdW5jdGlvbiBMb2NhbChpKSB7XG5cdHJldHVybiAoYXNuMS5CZXIuQ29udGV4dCB8IGFzbjEuQmVyLkNvbnN0cnVjdG9yIHwgaSk7XG59XG5cbmZ1bmN0aW9uIENvbnRleHQoaSkge1xuXHRyZXR1cm4gKGFzbjEuQmVyLkNvbnRleHQgfCBpKTtcbn1cblxudmFyIFNJR05fQUxHUyA9IHtcblx0J3JzYS1tZDUnOiAnMS4yLjg0MC4xMTM1NDkuMS4xLjQnLFxuXHQncnNhLXNoYTEnOiAnMS4yLjg0MC4xMTM1NDkuMS4xLjUnLFxuXHQncnNhLXNoYTI1Nic6ICcxLjIuODQwLjExMzU0OS4xLjEuMTEnLFxuXHQncnNhLXNoYTM4NCc6ICcxLjIuODQwLjExMzU0OS4xLjEuMTInLFxuXHQncnNhLXNoYTUxMic6ICcxLjIuODQwLjExMzU0OS4xLjEuMTMnLFxuXHQnZHNhLXNoYTEnOiAnMS4yLjg0MC4xMDA0MC40LjMnLFxuXHQnZHNhLXNoYTI1Nic6ICcyLjE2Ljg0MC4xLjEwMS4zLjQuMy4yJyxcblx0J2VjZHNhLXNoYTEnOiAnMS4yLjg0MC4xMDA0NS40LjEnLFxuXHQnZWNkc2Etc2hhMjU2JzogJzEuMi44NDAuMTAwNDUuNC4zLjInLFxuXHQnZWNkc2Etc2hhMzg0JzogJzEuMi44NDAuMTAwNDUuNC4zLjMnLFxuXHQnZWNkc2Etc2hhNTEyJzogJzEuMi44NDAuMTAwNDUuNC4zLjQnLFxuXHQnZWQyNTUxOS1zaGE1MTInOiAnMS4zLjEwMS4xMTInXG59O1xuT2JqZWN0LmtleXMoU0lHTl9BTEdTKS5mb3JFYWNoKGZ1bmN0aW9uIChrKSB7XG5cdFNJR05fQUxHU1tTSUdOX0FMR1Nba11dID0gaztcbn0pO1xuU0lHTl9BTEdTWycxLjMuMTQuMy4yLjMnXSA9ICdyc2EtbWQ1JztcblNJR05fQUxHU1snMS4zLjE0LjMuMi4yOSddID0gJ3JzYS1zaGExJztcblxudmFyIEVYVFMgPSB7XG5cdCdpc3N1ZXJLZXlJZCc6ICcyLjUuMjkuMzUnLFxuXHQnYWx0TmFtZSc6ICcyLjUuMjkuMTcnLFxuXHQnYmFzaWNDb25zdHJhaW50cyc6ICcyLjUuMjkuMTknLFxuXHQna2V5VXNhZ2UnOiAnMi41LjI5LjE1Jyxcblx0J2V4dEtleVVzYWdlJzogJzIuNS4yOS4zNydcbn07XG5cbmZ1bmN0aW9uIHJlYWQoYnVmLCBvcHRpb25zKSB7XG5cdGlmICh0eXBlb2YgKGJ1ZikgPT09ICdzdHJpbmcnKSB7XG5cdFx0YnVmID0gQnVmZmVyLmZyb20oYnVmLCAnYmluYXJ5Jyk7XG5cdH1cblx0YXNzZXJ0LmJ1ZmZlcihidWYsICdidWYnKTtcblxuXHR2YXIgZGVyID0gbmV3IGFzbjEuQmVyUmVhZGVyKGJ1Zik7XG5cblx0ZGVyLnJlYWRTZXF1ZW5jZSgpO1xuXHRpZiAoTWF0aC5hYnMoZGVyLmxlbmd0aCAtIGRlci5yZW1haW4pID4gMSkge1xuXHRcdHRocm93IChuZXcgRXJyb3IoJ0RFUiBzZXF1ZW5jZSBkb2VzIG5vdCBjb250YWluIHdob2xlIGJ5dGUgJyArXG5cdFx0ICAgICdzdHJlYW0nKSk7XG5cdH1cblxuXHR2YXIgdGJzU3RhcnQgPSBkZXIub2Zmc2V0O1xuXHRkZXIucmVhZFNlcXVlbmNlKCk7XG5cdHZhciBzaWdPZmZzZXQgPSBkZXIub2Zmc2V0ICsgZGVyLmxlbmd0aDtcblx0dmFyIHRic0VuZCA9IHNpZ09mZnNldDtcblxuXHRpZiAoZGVyLnBlZWsoKSA9PT0gTG9jYWwoMCkpIHtcblx0XHRkZXIucmVhZFNlcXVlbmNlKExvY2FsKDApKTtcblx0XHR2YXIgdmVyc2lvbiA9IGRlci5yZWFkSW50KCk7XG5cdFx0YXNzZXJ0Lm9rKHZlcnNpb24gPD0gMyxcblx0XHQgICAgJ29ubHkgeC41MDkgdmVyc2lvbnMgdXAgdG8gdjMgc3VwcG9ydGVkJyk7XG5cdH1cblxuXHR2YXIgY2VydCA9IHt9O1xuXHRjZXJ0LnNpZ25hdHVyZXMgPSB7fTtcblx0dmFyIHNpZyA9IChjZXJ0LnNpZ25hdHVyZXMueDUwOSA9IHt9KTtcblx0c2lnLmV4dHJhcyA9IHt9O1xuXG5cdGNlcnQuc2VyaWFsID0gcmVhZE1QSW50KGRlciwgJ3NlcmlhbCcpO1xuXG5cdGRlci5yZWFkU2VxdWVuY2UoKTtcblx0dmFyIGFmdGVyID0gZGVyLm9mZnNldCArIGRlci5sZW5ndGg7XG5cdHZhciBjZXJ0QWxnT2lkID0gZGVyLnJlYWRPSUQoKTtcblx0dmFyIGNlcnRBbGcgPSBTSUdOX0FMR1NbY2VydEFsZ09pZF07XG5cdGlmIChjZXJ0QWxnID09PSB1bmRlZmluZWQpXG5cdFx0dGhyb3cgKG5ldyBFcnJvcigndW5rbm93biBzaWduYXR1cmUgYWxnb3JpdGhtICcgKyBjZXJ0QWxnT2lkKSk7XG5cblx0ZGVyLl9vZmZzZXQgPSBhZnRlcjtcblx0Y2VydC5pc3N1ZXIgPSBJZGVudGl0eS5wYXJzZUFzbjEoZGVyKTtcblxuXHRkZXIucmVhZFNlcXVlbmNlKCk7XG5cdGNlcnQudmFsaWRGcm9tID0gcmVhZERhdGUoZGVyKTtcblx0Y2VydC52YWxpZFVudGlsID0gcmVhZERhdGUoZGVyKTtcblxuXHRjZXJ0LnN1YmplY3RzID0gW0lkZW50aXR5LnBhcnNlQXNuMShkZXIpXTtcblxuXHRkZXIucmVhZFNlcXVlbmNlKCk7XG5cdGFmdGVyID0gZGVyLm9mZnNldCArIGRlci5sZW5ndGg7XG5cdGNlcnQuc3ViamVjdEtleSA9IHBrY3M4LnJlYWRQa2NzOCh1bmRlZmluZWQsICdwdWJsaWMnLCBkZXIpO1xuXHRkZXIuX29mZnNldCA9IGFmdGVyO1xuXG5cdC8qIGlzc3VlclVuaXF1ZUlEICovXG5cdGlmIChkZXIucGVlaygpID09PSBMb2NhbCgxKSkge1xuXHRcdGRlci5yZWFkU2VxdWVuY2UoTG9jYWwoMSkpO1xuXHRcdHNpZy5leHRyYXMuaXNzdWVyVW5pcXVlSUQgPVxuXHRcdCAgICBidWYuc2xpY2UoZGVyLm9mZnNldCwgZGVyLm9mZnNldCArIGRlci5sZW5ndGgpO1xuXHRcdGRlci5fb2Zmc2V0ICs9IGRlci5sZW5ndGg7XG5cdH1cblxuXHQvKiBzdWJqZWN0VW5pcXVlSUQgKi9cblx0aWYgKGRlci5wZWVrKCkgPT09IExvY2FsKDIpKSB7XG5cdFx0ZGVyLnJlYWRTZXF1ZW5jZShMb2NhbCgyKSk7XG5cdFx0c2lnLmV4dHJhcy5zdWJqZWN0VW5pcXVlSUQgPVxuXHRcdCAgICBidWYuc2xpY2UoZGVyLm9mZnNldCwgZGVyLm9mZnNldCArIGRlci5sZW5ndGgpO1xuXHRcdGRlci5fb2Zmc2V0ICs9IGRlci5sZW5ndGg7XG5cdH1cblxuXHQvKiBleHRlbnNpb25zICovXG5cdGlmIChkZXIucGVlaygpID09PSBMb2NhbCgzKSkge1xuXHRcdGRlci5yZWFkU2VxdWVuY2UoTG9jYWwoMykpO1xuXHRcdHZhciBleHRFbmQgPSBkZXIub2Zmc2V0ICsgZGVyLmxlbmd0aDtcblx0XHRkZXIucmVhZFNlcXVlbmNlKCk7XG5cblx0XHR3aGlsZSAoZGVyLm9mZnNldCA8IGV4dEVuZClcblx0XHRcdHJlYWRFeHRlbnNpb24oY2VydCwgYnVmLCBkZXIpO1xuXG5cdFx0YXNzZXJ0LnN0cmljdEVxdWFsKGRlci5vZmZzZXQsIGV4dEVuZCk7XG5cdH1cblxuXHRhc3NlcnQuc3RyaWN0RXF1YWwoZGVyLm9mZnNldCwgc2lnT2Zmc2V0KTtcblxuXHRkZXIucmVhZFNlcXVlbmNlKCk7XG5cdGFmdGVyID0gZGVyLm9mZnNldCArIGRlci5sZW5ndGg7XG5cdHZhciBzaWdBbGdPaWQgPSBkZXIucmVhZE9JRCgpO1xuXHR2YXIgc2lnQWxnID0gU0lHTl9BTEdTW3NpZ0FsZ09pZF07XG5cdGlmIChzaWdBbGcgPT09IHVuZGVmaW5lZClcblx0XHR0aHJvdyAobmV3IEVycm9yKCd1bmtub3duIHNpZ25hdHVyZSBhbGdvcml0aG0gJyArIHNpZ0FsZ09pZCkpO1xuXHRkZXIuX29mZnNldCA9IGFmdGVyO1xuXG5cdHZhciBzaWdEYXRhID0gZGVyLnJlYWRTdHJpbmcoYXNuMS5CZXIuQml0U3RyaW5nLCB0cnVlKTtcblx0aWYgKHNpZ0RhdGFbMF0gPT09IDApXG5cdFx0c2lnRGF0YSA9IHNpZ0RhdGEuc2xpY2UoMSk7XG5cdHZhciBhbGdQYXJ0cyA9IHNpZ0FsZy5zcGxpdCgnLScpO1xuXG5cdHNpZy5zaWduYXR1cmUgPSBTaWduYXR1cmUucGFyc2Uoc2lnRGF0YSwgYWxnUGFydHNbMF0sICdhc24xJyk7XG5cdHNpZy5zaWduYXR1cmUuaGFzaEFsZ29yaXRobSA9IGFsZ1BhcnRzWzFdO1xuXHRzaWcuYWxnbyA9IHNpZ0FsZztcblx0c2lnLmNhY2hlID0gYnVmLnNsaWNlKHRic1N0YXJ0LCB0YnNFbmQpO1xuXG5cdHJldHVybiAobmV3IENlcnRpZmljYXRlKGNlcnQpKTtcbn1cblxuZnVuY3Rpb24gcmVhZERhdGUoZGVyKSB7XG5cdGlmIChkZXIucGVlaygpID09PSBhc24xLkJlci5VVENUaW1lKSB7XG5cdFx0cmV0dXJuICh1dGNUaW1lVG9EYXRlKGRlci5yZWFkU3RyaW5nKGFzbjEuQmVyLlVUQ1RpbWUpKSk7XG5cdH0gZWxzZSBpZiAoZGVyLnBlZWsoKSA9PT0gYXNuMS5CZXIuR2VuZXJhbGl6ZWRUaW1lKSB7XG5cdFx0cmV0dXJuIChnVGltZVRvRGF0ZShkZXIucmVhZFN0cmluZyhhc24xLkJlci5HZW5lcmFsaXplZFRpbWUpKSk7XG5cdH0gZWxzZSB7XG5cdFx0dGhyb3cgKG5ldyBFcnJvcignVW5zdXBwb3J0ZWQgZGF0ZSBmb3JtYXQnKSk7XG5cdH1cbn1cblxuZnVuY3Rpb24gd3JpdGVEYXRlKGRlciwgZGF0ZSkge1xuXHRpZiAoZGF0ZS5nZXRVVENGdWxsWWVhcigpID49IDIwNTAgfHwgZGF0ZS5nZXRVVENGdWxsWWVhcigpIDwgMTk1MCkge1xuXHRcdGRlci53cml0ZVN0cmluZyhkYXRlVG9HVGltZShkYXRlKSwgYXNuMS5CZXIuR2VuZXJhbGl6ZWRUaW1lKTtcblx0fSBlbHNlIHtcblx0XHRkZXIud3JpdGVTdHJpbmcoZGF0ZVRvVVRDVGltZShkYXRlKSwgYXNuMS5CZXIuVVRDVGltZSk7XG5cdH1cbn1cblxuLyogUkZDNTI4MCwgc2VjdGlvbiA0LjIuMS42IChHZW5lcmFsTmFtZSB0eXBlKSAqL1xudmFyIEFMVE5BTUUgPSB7XG5cdE90aGVyTmFtZTogTG9jYWwoMCksXG5cdFJGQzgyMk5hbWU6IENvbnRleHQoMSksXG5cdEROU05hbWU6IENvbnRleHQoMiksXG5cdFg0MDBBZGRyZXNzOiBMb2NhbCgzKSxcblx0RGlyZWN0b3J5TmFtZTogTG9jYWwoNCksXG5cdEVESVBhcnR5TmFtZTogTG9jYWwoNSksXG5cdFVSSTogQ29udGV4dCg2KSxcblx0SVBBZGRyZXNzOiBDb250ZXh0KDcpLFxuXHRPSUQ6IENvbnRleHQoOClcbn07XG5cbi8qIFJGQzUyODAsIHNlY3Rpb24gNC4yLjEuMTIgKEtleVB1cnBvc2VJZCkgKi9cbnZhciBFWFRQVVJQT1NFID0ge1xuXHQnc2VydmVyQXV0aCc6ICcxLjMuNi4xLjUuNS43LjMuMScsXG5cdCdjbGllbnRBdXRoJzogJzEuMy42LjEuNS41LjcuMy4yJyxcblx0J2NvZGVTaWduaW5nJzogJzEuMy42LjEuNS41LjcuMy4zJyxcblxuXHQvKiBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2pveWVudC9vaWQtZG9jcy9ibG9iL21hc3Rlci9yb290Lm1kICovXG5cdCdqb3llbnREb2NrZXInOiAnMS4zLjYuMS40LjEuMzg2NzguMS40LjEnLFxuXHQnam95ZW50Q21vbic6ICcxLjMuNi4xLjQuMS4zODY3OC4xLjQuMidcbn07XG52YXIgRVhUUFVSUE9TRV9SRVYgPSB7fTtcbk9iamVjdC5rZXlzKEVYVFBVUlBPU0UpLmZvckVhY2goZnVuY3Rpb24gKGspIHtcblx0RVhUUFVSUE9TRV9SRVZbRVhUUFVSUE9TRVtrXV0gPSBrO1xufSk7XG5cbnZhciBLRVlVU0VCSVRTID0gW1xuXHQnc2lnbmF0dXJlJywgJ2lkZW50aXR5JywgJ2tleUVuY3J5cHRpb24nLFxuXHQnZW5jcnlwdGlvbicsICdrZXlBZ3JlZW1lbnQnLCAnY2EnLCAnY3JsJ1xuXTtcblxuZnVuY3Rpb24gcmVhZEV4dGVuc2lvbihjZXJ0LCBidWYsIGRlcikge1xuXHRkZXIucmVhZFNlcXVlbmNlKCk7XG5cdHZhciBhZnRlciA9IGRlci5vZmZzZXQgKyBkZXIubGVuZ3RoO1xuXHR2YXIgZXh0SWQgPSBkZXIucmVhZE9JRCgpO1xuXHR2YXIgaWQ7XG5cdHZhciBzaWcgPSBjZXJ0LnNpZ25hdHVyZXMueDUwOTtcblx0aWYgKCFzaWcuZXh0cmFzLmV4dHMpXG5cdFx0c2lnLmV4dHJhcy5leHRzID0gW107XG5cblx0dmFyIGNyaXRpY2FsO1xuXHRpZiAoZGVyLnBlZWsoKSA9PT0gYXNuMS5CZXIuQm9vbGVhbilcblx0XHRjcml0aWNhbCA9IGRlci5yZWFkQm9vbGVhbigpO1xuXG5cdHN3aXRjaCAoZXh0SWQpIHtcblx0Y2FzZSAoRVhUUy5iYXNpY0NvbnN0cmFpbnRzKTpcblx0XHRkZXIucmVhZFNlcXVlbmNlKGFzbjEuQmVyLk9jdGV0U3RyaW5nKTtcblx0XHRkZXIucmVhZFNlcXVlbmNlKCk7XG5cdFx0dmFyIGJjRW5kID0gZGVyLm9mZnNldCArIGRlci5sZW5ndGg7XG5cdFx0dmFyIGNhID0gZmFsc2U7XG5cdFx0aWYgKGRlci5wZWVrKCkgPT09IGFzbjEuQmVyLkJvb2xlYW4pXG5cdFx0XHRjYSA9IGRlci5yZWFkQm9vbGVhbigpO1xuXHRcdGlmIChjZXJ0LnB1cnBvc2VzID09PSB1bmRlZmluZWQpXG5cdFx0XHRjZXJ0LnB1cnBvc2VzID0gW107XG5cdFx0aWYgKGNhID09PSB0cnVlKVxuXHRcdFx0Y2VydC5wdXJwb3Nlcy5wdXNoKCdjYScpO1xuXHRcdHZhciBiYyA9IHsgb2lkOiBleHRJZCwgY3JpdGljYWw6IGNyaXRpY2FsIH07XG5cdFx0aWYgKGRlci5vZmZzZXQgPCBiY0VuZCAmJiBkZXIucGVlaygpID09PSBhc24xLkJlci5JbnRlZ2VyKVxuXHRcdFx0YmMucGF0aExlbiA9IGRlci5yZWFkSW50KCk7XG5cdFx0c2lnLmV4dHJhcy5leHRzLnB1c2goYmMpO1xuXHRcdGJyZWFrO1xuXHRjYXNlIChFWFRTLmV4dEtleVVzYWdlKTpcblx0XHRkZXIucmVhZFNlcXVlbmNlKGFzbjEuQmVyLk9jdGV0U3RyaW5nKTtcblx0XHRkZXIucmVhZFNlcXVlbmNlKCk7XG5cdFx0aWYgKGNlcnQucHVycG9zZXMgPT09IHVuZGVmaW5lZClcblx0XHRcdGNlcnQucHVycG9zZXMgPSBbXTtcblx0XHR2YXIgZWtFbmQgPSBkZXIub2Zmc2V0ICsgZGVyLmxlbmd0aDtcblx0XHR3aGlsZSAoZGVyLm9mZnNldCA8IGVrRW5kKSB7XG5cdFx0XHR2YXIgb2lkID0gZGVyLnJlYWRPSUQoKTtcblx0XHRcdGNlcnQucHVycG9zZXMucHVzaChFWFRQVVJQT1NFX1JFVltvaWRdIHx8IG9pZCk7XG5cdFx0fVxuXHRcdC8qXG5cdFx0ICogVGhpcyBpcyBhIGJpdCBvZiBhIGhhY2s6IGluIHRoZSBjYXNlIHdoZXJlIHdlIGhhdmUgYSBjZXJ0XG5cdFx0ICogdGhhdCdzIG9ubHkgYWxsb3dlZCB0byBkbyBzZXJ2ZXJBdXRoIG9yIGNsaWVudEF1dGggKGFuZCBub3Rcblx0XHQgKiB0aGUgb3RoZXIpLCB3ZSB3YW50IHRvIG1ha2Ugc3VyZSBhbGwgb3VyIFN1YmplY3RzIGFyZSBvZlxuXHRcdCAqIHRoZSByaWdodCB0eXBlLiBCdXQgd2UgYWxyZWFkeSBwYXJzZWQgb3VyIFN1YmplY3RzIGFuZFxuXHRcdCAqIGRlY2lkZWQgaWYgdGhleSB3ZXJlIGhvc3RzIG9yIHVzZXJzIGVhcmxpZXIgKHNpbmNlIGl0IGFwcGVhcnNcblx0XHQgKiBmaXJzdCBpbiB0aGUgY2VydCkuXG5cdFx0ICpcblx0XHQgKiBTbyB3ZSBnbyB0aHJvdWdoIGFuZCBtdXRhdGUgdGhlbSBpbnRvIHRoZSByaWdodCBraW5kIGhlcmUgaWZcblx0XHQgKiBpdCBkb2Vzbid0IG1hdGNoLiBUaGlzIG1pZ2h0IG5vdCBiZSBodWdlbHkgYmVuZWZpY2lhbCwgYXMgaXRcblx0XHQgKiBzZWVtcyB0aGF0IHNpbmdsZS1wdXJwb3NlIGNlcnRzIGFyZSBub3Qgb2Z0ZW4gc2VlbiBpbiB0aGVcblx0XHQgKiB3aWxkLlxuXHRcdCAqL1xuXHRcdGlmIChjZXJ0LnB1cnBvc2VzLmluZGV4T2YoJ3NlcnZlckF1dGgnKSAhPT0gLTEgJiZcblx0XHQgICAgY2VydC5wdXJwb3Nlcy5pbmRleE9mKCdjbGllbnRBdXRoJykgPT09IC0xKSB7XG5cdFx0XHRjZXJ0LnN1YmplY3RzLmZvckVhY2goZnVuY3Rpb24gKGlkZSkge1xuXHRcdFx0XHRpZiAoaWRlLnR5cGUgIT09ICdob3N0Jykge1xuXHRcdFx0XHRcdGlkZS50eXBlID0gJ2hvc3QnO1xuXHRcdFx0XHRcdGlkZS5ob3N0bmFtZSA9IGlkZS51aWQgfHxcblx0XHRcdFx0XHQgICAgaWRlLmVtYWlsIHx8XG5cdFx0XHRcdFx0ICAgIGlkZS5jb21wb25lbnRzWzBdLnZhbHVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9IGVsc2UgaWYgKGNlcnQucHVycG9zZXMuaW5kZXhPZignY2xpZW50QXV0aCcpICE9PSAtMSAmJlxuXHRcdCAgICBjZXJ0LnB1cnBvc2VzLmluZGV4T2YoJ3NlcnZlckF1dGgnKSA9PT0gLTEpIHtcblx0XHRcdGNlcnQuc3ViamVjdHMuZm9yRWFjaChmdW5jdGlvbiAoaWRlKSB7XG5cdFx0XHRcdGlmIChpZGUudHlwZSAhPT0gJ3VzZXInKSB7XG5cdFx0XHRcdFx0aWRlLnR5cGUgPSAndXNlcic7XG5cdFx0XHRcdFx0aWRlLnVpZCA9IGlkZS5ob3N0bmFtZSB8fFxuXHRcdFx0XHRcdCAgICBpZGUuZW1haWwgfHxcblx0XHRcdFx0XHQgICAgaWRlLmNvbXBvbmVudHNbMF0udmFsdWU7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblx0XHRzaWcuZXh0cmFzLmV4dHMucHVzaCh7IG9pZDogZXh0SWQsIGNyaXRpY2FsOiBjcml0aWNhbCB9KTtcblx0XHRicmVhaztcblx0Y2FzZSAoRVhUUy5rZXlVc2FnZSk6XG5cdFx0ZGVyLnJlYWRTZXF1ZW5jZShhc24xLkJlci5PY3RldFN0cmluZyk7XG5cdFx0dmFyIGJpdHMgPSBkZXIucmVhZFN0cmluZyhhc24xLkJlci5CaXRTdHJpbmcsIHRydWUpO1xuXHRcdHZhciBzZXRCaXRzID0gcmVhZEJpdEZpZWxkKGJpdHMsIEtFWVVTRUJJVFMpO1xuXHRcdHNldEJpdHMuZm9yRWFjaChmdW5jdGlvbiAoYml0KSB7XG5cdFx0XHRpZiAoY2VydC5wdXJwb3NlcyA9PT0gdW5kZWZpbmVkKVxuXHRcdFx0XHRjZXJ0LnB1cnBvc2VzID0gW107XG5cdFx0XHRpZiAoY2VydC5wdXJwb3Nlcy5pbmRleE9mKGJpdCkgPT09IC0xKVxuXHRcdFx0XHRjZXJ0LnB1cnBvc2VzLnB1c2goYml0KTtcblx0XHR9KTtcblx0XHRzaWcuZXh0cmFzLmV4dHMucHVzaCh7IG9pZDogZXh0SWQsIGNyaXRpY2FsOiBjcml0aWNhbCxcblx0XHQgICAgYml0czogYml0cyB9KTtcblx0XHRicmVhaztcblx0Y2FzZSAoRVhUUy5hbHROYW1lKTpcblx0XHRkZXIucmVhZFNlcXVlbmNlKGFzbjEuQmVyLk9jdGV0U3RyaW5nKTtcblx0XHRkZXIucmVhZFNlcXVlbmNlKCk7XG5cdFx0dmFyIGFlRW5kID0gZGVyLm9mZnNldCArIGRlci5sZW5ndGg7XG5cdFx0d2hpbGUgKGRlci5vZmZzZXQgPCBhZUVuZCkge1xuXHRcdFx0c3dpdGNoIChkZXIucGVlaygpKSB7XG5cdFx0XHRjYXNlIEFMVE5BTUUuT3RoZXJOYW1lOlxuXHRcdFx0Y2FzZSBBTFROQU1FLkVESVBhcnR5TmFtZTpcblx0XHRcdFx0ZGVyLnJlYWRTZXF1ZW5jZSgpO1xuXHRcdFx0XHRkZXIuX29mZnNldCArPSBkZXIubGVuZ3RoO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgQUxUTkFNRS5PSUQ6XG5cdFx0XHRcdGRlci5yZWFkT0lEKEFMVE5BTUUuT0lEKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIEFMVE5BTUUuUkZDODIyTmFtZTpcblx0XHRcdFx0LyogUkZDODIyIHNwZWNpZmllcyBlbWFpbCBhZGRyZXNzZXMgKi9cblx0XHRcdFx0dmFyIGVtYWlsID0gZGVyLnJlYWRTdHJpbmcoQUxUTkFNRS5SRkM4MjJOYW1lKTtcblx0XHRcdFx0aWQgPSBJZGVudGl0eS5mb3JFbWFpbChlbWFpbCk7XG5cdFx0XHRcdGlmICghY2VydC5zdWJqZWN0c1swXS5lcXVhbHMoaWQpKVxuXHRcdFx0XHRcdGNlcnQuc3ViamVjdHMucHVzaChpZCk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBBTFROQU1FLkRpcmVjdG9yeU5hbWU6XG5cdFx0XHRcdGRlci5yZWFkU2VxdWVuY2UoQUxUTkFNRS5EaXJlY3RvcnlOYW1lKTtcblx0XHRcdFx0aWQgPSBJZGVudGl0eS5wYXJzZUFzbjEoZGVyKTtcblx0XHRcdFx0aWYgKCFjZXJ0LnN1YmplY3RzWzBdLmVxdWFscyhpZCkpXG5cdFx0XHRcdFx0Y2VydC5zdWJqZWN0cy5wdXNoKGlkKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIEFMVE5BTUUuRE5TTmFtZTpcblx0XHRcdFx0dmFyIGhvc3QgPSBkZXIucmVhZFN0cmluZyhcblx0XHRcdFx0ICAgIEFMVE5BTUUuRE5TTmFtZSk7XG5cdFx0XHRcdGlkID0gSWRlbnRpdHkuZm9ySG9zdChob3N0KTtcblx0XHRcdFx0aWYgKCFjZXJ0LnN1YmplY3RzWzBdLmVxdWFscyhpZCkpXG5cdFx0XHRcdFx0Y2VydC5zdWJqZWN0cy5wdXNoKGlkKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRkZXIucmVhZFN0cmluZyhkZXIucGVlaygpKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHNpZy5leHRyYXMuZXh0cy5wdXNoKHsgb2lkOiBleHRJZCwgY3JpdGljYWw6IGNyaXRpY2FsIH0pO1xuXHRcdGJyZWFrO1xuXHRkZWZhdWx0OlxuXHRcdHNpZy5leHRyYXMuZXh0cy5wdXNoKHtcblx0XHRcdG9pZDogZXh0SWQsXG5cdFx0XHRjcml0aWNhbDogY3JpdGljYWwsXG5cdFx0XHRkYXRhOiBkZXIucmVhZFN0cmluZyhhc24xLkJlci5PY3RldFN0cmluZywgdHJ1ZSlcblx0XHR9KTtcblx0XHRicmVhaztcblx0fVxuXG5cdGRlci5fb2Zmc2V0ID0gYWZ0ZXI7XG59XG5cbnZhciBVVENUSU1FX1JFID1cbiAgICAvXihbMC05XXsyfSkoWzAtOV17Mn0pKFswLTldezJ9KShbMC05XXsyfSkoWzAtOV17Mn0pKFswLTldezJ9KT9aJC87XG5mdW5jdGlvbiB1dGNUaW1lVG9EYXRlKHQpIHtcblx0dmFyIG0gPSB0Lm1hdGNoKFVUQ1RJTUVfUkUpO1xuXHRhc3NlcnQub2sobSwgJ3RpbWVzdGFtcHMgbXVzdCBiZSBpbiBVVEMnKTtcblx0dmFyIGQgPSBuZXcgRGF0ZSgpO1xuXG5cdHZhciB0aGlzWWVhciA9IGQuZ2V0VVRDRnVsbFllYXIoKTtcblx0dmFyIGNlbnR1cnkgPSBNYXRoLmZsb29yKHRoaXNZZWFyIC8gMTAwKSAqIDEwMDtcblxuXHR2YXIgeWVhciA9IHBhcnNlSW50KG1bMV0sIDEwKTtcblx0aWYgKHRoaXNZZWFyICUgMTAwIDwgNTAgJiYgeWVhciA+PSA2MClcblx0XHR5ZWFyICs9IChjZW50dXJ5IC0gMSk7XG5cdGVsc2Vcblx0XHR5ZWFyICs9IGNlbnR1cnk7XG5cdGQuc2V0VVRDRnVsbFllYXIoeWVhciwgcGFyc2VJbnQobVsyXSwgMTApIC0gMSwgcGFyc2VJbnQobVszXSwgMTApKTtcblx0ZC5zZXRVVENIb3VycyhwYXJzZUludChtWzRdLCAxMCksIHBhcnNlSW50KG1bNV0sIDEwKSk7XG5cdGlmIChtWzZdICYmIG1bNl0ubGVuZ3RoID4gMClcblx0XHRkLnNldFVUQ1NlY29uZHMocGFyc2VJbnQobVs2XSwgMTApKTtcblx0cmV0dXJuIChkKTtcbn1cblxudmFyIEdUSU1FX1JFID1cbiAgICAvXihbMC05XXs0fSkoWzAtOV17Mn0pKFswLTldezJ9KShbMC05XXsyfSkoWzAtOV17Mn0pKFswLTldezJ9KT9aJC87XG5mdW5jdGlvbiBnVGltZVRvRGF0ZSh0KSB7XG5cdHZhciBtID0gdC5tYXRjaChHVElNRV9SRSk7XG5cdGFzc2VydC5vayhtKTtcblx0dmFyIGQgPSBuZXcgRGF0ZSgpO1xuXG5cdGQuc2V0VVRDRnVsbFllYXIocGFyc2VJbnQobVsxXSwgMTApLCBwYXJzZUludChtWzJdLCAxMCkgLSAxLFxuXHQgICAgcGFyc2VJbnQobVszXSwgMTApKTtcblx0ZC5zZXRVVENIb3VycyhwYXJzZUludChtWzRdLCAxMCksIHBhcnNlSW50KG1bNV0sIDEwKSk7XG5cdGlmIChtWzZdICYmIG1bNl0ubGVuZ3RoID4gMClcblx0XHRkLnNldFVUQ1NlY29uZHMocGFyc2VJbnQobVs2XSwgMTApKTtcblx0cmV0dXJuIChkKTtcbn1cblxuZnVuY3Rpb24gemVyb1BhZChuLCBtKSB7XG5cdGlmIChtID09PSB1bmRlZmluZWQpXG5cdFx0bSA9IDI7XG5cdHZhciBzID0gJycgKyBuO1xuXHR3aGlsZSAocy5sZW5ndGggPCBtKVxuXHRcdHMgPSAnMCcgKyBzO1xuXHRyZXR1cm4gKHMpO1xufVxuXG5mdW5jdGlvbiBkYXRlVG9VVENUaW1lKGQpIHtcblx0dmFyIHMgPSAnJztcblx0cyArPSB6ZXJvUGFkKGQuZ2V0VVRDRnVsbFllYXIoKSAlIDEwMCk7XG5cdHMgKz0gemVyb1BhZChkLmdldFVUQ01vbnRoKCkgKyAxKTtcblx0cyArPSB6ZXJvUGFkKGQuZ2V0VVRDRGF0ZSgpKTtcblx0cyArPSB6ZXJvUGFkKGQuZ2V0VVRDSG91cnMoKSk7XG5cdHMgKz0gemVyb1BhZChkLmdldFVUQ01pbnV0ZXMoKSk7XG5cdHMgKz0gemVyb1BhZChkLmdldFVUQ1NlY29uZHMoKSk7XG5cdHMgKz0gJ1onO1xuXHRyZXR1cm4gKHMpO1xufVxuXG5mdW5jdGlvbiBkYXRlVG9HVGltZShkKSB7XG5cdHZhciBzID0gJyc7XG5cdHMgKz0gemVyb1BhZChkLmdldFVUQ0Z1bGxZZWFyKCksIDQpO1xuXHRzICs9IHplcm9QYWQoZC5nZXRVVENNb250aCgpICsgMSk7XG5cdHMgKz0gemVyb1BhZChkLmdldFVUQ0RhdGUoKSk7XG5cdHMgKz0gemVyb1BhZChkLmdldFVUQ0hvdXJzKCkpO1xuXHRzICs9IHplcm9QYWQoZC5nZXRVVENNaW51dGVzKCkpO1xuXHRzICs9IHplcm9QYWQoZC5nZXRVVENTZWNvbmRzKCkpO1xuXHRzICs9ICdaJztcblx0cmV0dXJuIChzKTtcbn1cblxuZnVuY3Rpb24gc2lnbihjZXJ0LCBrZXkpIHtcblx0aWYgKGNlcnQuc2lnbmF0dXJlcy54NTA5ID09PSB1bmRlZmluZWQpXG5cdFx0Y2VydC5zaWduYXR1cmVzLng1MDkgPSB7fTtcblx0dmFyIHNpZyA9IGNlcnQuc2lnbmF0dXJlcy54NTA5O1xuXG5cdHNpZy5hbGdvID0ga2V5LnR5cGUgKyAnLScgKyBrZXkuZGVmYXVsdEhhc2hBbGdvcml0aG0oKTtcblx0aWYgKFNJR05fQUxHU1tzaWcuYWxnb10gPT09IHVuZGVmaW5lZClcblx0XHRyZXR1cm4gKGZhbHNlKTtcblxuXHR2YXIgZGVyID0gbmV3IGFzbjEuQmVyV3JpdGVyKCk7XG5cdHdyaXRlVEJTQ2VydChjZXJ0LCBkZXIpO1xuXHR2YXIgYmxvYiA9IGRlci5idWZmZXI7XG5cdHNpZy5jYWNoZSA9IGJsb2I7XG5cblx0dmFyIHNpZ25lciA9IGtleS5jcmVhdGVTaWduKCk7XG5cdHNpZ25lci53cml0ZShibG9iKTtcblx0Y2VydC5zaWduYXR1cmVzLng1MDkuc2lnbmF0dXJlID0gc2lnbmVyLnNpZ24oKTtcblxuXHRyZXR1cm4gKHRydWUpO1xufVxuXG5mdW5jdGlvbiBzaWduQXN5bmMoY2VydCwgc2lnbmVyLCBkb25lKSB7XG5cdGlmIChjZXJ0LnNpZ25hdHVyZXMueDUwOSA9PT0gdW5kZWZpbmVkKVxuXHRcdGNlcnQuc2lnbmF0dXJlcy54NTA5ID0ge307XG5cdHZhciBzaWcgPSBjZXJ0LnNpZ25hdHVyZXMueDUwOTtcblxuXHR2YXIgZGVyID0gbmV3IGFzbjEuQmVyV3JpdGVyKCk7XG5cdHdyaXRlVEJTQ2VydChjZXJ0LCBkZXIpO1xuXHR2YXIgYmxvYiA9IGRlci5idWZmZXI7XG5cdHNpZy5jYWNoZSA9IGJsb2I7XG5cblx0c2lnbmVyKGJsb2IsIGZ1bmN0aW9uIChlcnIsIHNpZ25hdHVyZSkge1xuXHRcdGlmIChlcnIpIHtcblx0XHRcdGRvbmUoZXJyKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0c2lnLmFsZ28gPSBzaWduYXR1cmUudHlwZSArICctJyArIHNpZ25hdHVyZS5oYXNoQWxnb3JpdGhtO1xuXHRcdGlmIChTSUdOX0FMR1Nbc2lnLmFsZ29dID09PSB1bmRlZmluZWQpIHtcblx0XHRcdGRvbmUobmV3IEVycm9yKCdJbnZhbGlkIHNpZ25pbmcgYWxnb3JpdGhtIFwiJyArXG5cdFx0XHQgICAgc2lnLmFsZ28gKyAnXCInKSk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdHNpZy5zaWduYXR1cmUgPSBzaWduYXR1cmU7XG5cdFx0ZG9uZSgpO1xuXHR9KTtcbn1cblxuZnVuY3Rpb24gd3JpdGUoY2VydCwgb3B0aW9ucykge1xuXHR2YXIgc2lnID0gY2VydC5zaWduYXR1cmVzLng1MDk7XG5cdGFzc2VydC5vYmplY3Qoc2lnLCAneDUwOSBzaWduYXR1cmUnKTtcblxuXHR2YXIgZGVyID0gbmV3IGFzbjEuQmVyV3JpdGVyKCk7XG5cdGRlci5zdGFydFNlcXVlbmNlKCk7XG5cdGlmIChzaWcuY2FjaGUpIHtcblx0XHRkZXIuX2Vuc3VyZShzaWcuY2FjaGUubGVuZ3RoKTtcblx0XHRzaWcuY2FjaGUuY29weShkZXIuX2J1ZiwgZGVyLl9vZmZzZXQpO1xuXHRcdGRlci5fb2Zmc2V0ICs9IHNpZy5jYWNoZS5sZW5ndGg7XG5cdH0gZWxzZSB7XG5cdFx0d3JpdGVUQlNDZXJ0KGNlcnQsIGRlcik7XG5cdH1cblxuXHRkZXIuc3RhcnRTZXF1ZW5jZSgpO1xuXHRkZXIud3JpdGVPSUQoU0lHTl9BTEdTW3NpZy5hbGdvXSk7XG5cdGlmIChzaWcuYWxnby5tYXRjaCgvXnJzYS0vKSlcblx0XHRkZXIud3JpdGVOdWxsKCk7XG5cdGRlci5lbmRTZXF1ZW5jZSgpO1xuXG5cdHZhciBzaWdEYXRhID0gc2lnLnNpZ25hdHVyZS50b0J1ZmZlcignYXNuMScpO1xuXHR2YXIgZGF0YSA9IEJ1ZmZlci5hbGxvYyhzaWdEYXRhLmxlbmd0aCArIDEpO1xuXHRkYXRhWzBdID0gMDtcblx0c2lnRGF0YS5jb3B5KGRhdGEsIDEpO1xuXHRkZXIud3JpdGVCdWZmZXIoZGF0YSwgYXNuMS5CZXIuQml0U3RyaW5nKTtcblx0ZGVyLmVuZFNlcXVlbmNlKCk7XG5cblx0cmV0dXJuIChkZXIuYnVmZmVyKTtcbn1cblxuZnVuY3Rpb24gd3JpdGVUQlNDZXJ0KGNlcnQsIGRlcikge1xuXHR2YXIgc2lnID0gY2VydC5zaWduYXR1cmVzLng1MDk7XG5cdGFzc2VydC5vYmplY3Qoc2lnLCAneDUwOSBzaWduYXR1cmUnKTtcblxuXHRkZXIuc3RhcnRTZXF1ZW5jZSgpO1xuXG5cdGRlci5zdGFydFNlcXVlbmNlKExvY2FsKDApKTtcblx0ZGVyLndyaXRlSW50KDIpO1xuXHRkZXIuZW5kU2VxdWVuY2UoKTtcblxuXHRkZXIud3JpdGVCdWZmZXIodXRpbHMubXBOb3JtYWxpemUoY2VydC5zZXJpYWwpLCBhc24xLkJlci5JbnRlZ2VyKTtcblxuXHRkZXIuc3RhcnRTZXF1ZW5jZSgpO1xuXHRkZXIud3JpdGVPSUQoU0lHTl9BTEdTW3NpZy5hbGdvXSk7XG5cdGlmIChzaWcuYWxnby5tYXRjaCgvXnJzYS0vKSlcblx0XHRkZXIud3JpdGVOdWxsKCk7XG5cdGRlci5lbmRTZXF1ZW5jZSgpO1xuXG5cdGNlcnQuaXNzdWVyLnRvQXNuMShkZXIpO1xuXG5cdGRlci5zdGFydFNlcXVlbmNlKCk7XG5cdHdyaXRlRGF0ZShkZXIsIGNlcnQudmFsaWRGcm9tKTtcblx0d3JpdGVEYXRlKGRlciwgY2VydC52YWxpZFVudGlsKTtcblx0ZGVyLmVuZFNlcXVlbmNlKCk7XG5cblx0dmFyIHN1YmplY3QgPSBjZXJ0LnN1YmplY3RzWzBdO1xuXHR2YXIgYWx0TmFtZXMgPSBjZXJ0LnN1YmplY3RzLnNsaWNlKDEpO1xuXHRzdWJqZWN0LnRvQXNuMShkZXIpO1xuXG5cdHBrY3M4LndyaXRlUGtjczgoZGVyLCBjZXJ0LnN1YmplY3RLZXkpO1xuXG5cdGlmIChzaWcuZXh0cmFzICYmIHNpZy5leHRyYXMuaXNzdWVyVW5pcXVlSUQpIHtcblx0XHRkZXIud3JpdGVCdWZmZXIoc2lnLmV4dHJhcy5pc3N1ZXJVbmlxdWVJRCwgTG9jYWwoMSkpO1xuXHR9XG5cblx0aWYgKHNpZy5leHRyYXMgJiYgc2lnLmV4dHJhcy5zdWJqZWN0VW5pcXVlSUQpIHtcblx0XHRkZXIud3JpdGVCdWZmZXIoc2lnLmV4dHJhcy5zdWJqZWN0VW5pcXVlSUQsIExvY2FsKDIpKTtcblx0fVxuXG5cdGlmIChhbHROYW1lcy5sZW5ndGggPiAwIHx8IHN1YmplY3QudHlwZSA9PT0gJ2hvc3QnIHx8XG5cdCAgICAoY2VydC5wdXJwb3NlcyAhPT0gdW5kZWZpbmVkICYmIGNlcnQucHVycG9zZXMubGVuZ3RoID4gMCkgfHxcblx0ICAgIChzaWcuZXh0cmFzICYmIHNpZy5leHRyYXMuZXh0cykpIHtcblx0XHRkZXIuc3RhcnRTZXF1ZW5jZShMb2NhbCgzKSk7XG5cdFx0ZGVyLnN0YXJ0U2VxdWVuY2UoKTtcblxuXHRcdHZhciBleHRzID0gW107XG5cdFx0aWYgKGNlcnQucHVycG9zZXMgIT09IHVuZGVmaW5lZCAmJiBjZXJ0LnB1cnBvc2VzLmxlbmd0aCA+IDApIHtcblx0XHRcdGV4dHMucHVzaCh7XG5cdFx0XHRcdG9pZDogRVhUUy5iYXNpY0NvbnN0cmFpbnRzLFxuXHRcdFx0XHRjcml0aWNhbDogdHJ1ZVxuXHRcdFx0fSk7XG5cdFx0XHRleHRzLnB1c2goe1xuXHRcdFx0XHRvaWQ6IEVYVFMua2V5VXNhZ2UsXG5cdFx0XHRcdGNyaXRpY2FsOiB0cnVlXG5cdFx0XHR9KTtcblx0XHRcdGV4dHMucHVzaCh7XG5cdFx0XHRcdG9pZDogRVhUUy5leHRLZXlVc2FnZSxcblx0XHRcdFx0Y3JpdGljYWw6IHRydWVcblx0XHRcdH0pO1xuXHRcdH1cblx0XHRleHRzLnB1c2goeyBvaWQ6IEVYVFMuYWx0TmFtZSB9KTtcblx0XHRpZiAoc2lnLmV4dHJhcyAmJiBzaWcuZXh0cmFzLmV4dHMpXG5cdFx0XHRleHRzID0gc2lnLmV4dHJhcy5leHRzO1xuXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBleHRzLmxlbmd0aDsgKytpKSB7XG5cdFx0XHRkZXIuc3RhcnRTZXF1ZW5jZSgpO1xuXHRcdFx0ZGVyLndyaXRlT0lEKGV4dHNbaV0ub2lkKTtcblxuXHRcdFx0aWYgKGV4dHNbaV0uY3JpdGljYWwgIT09IHVuZGVmaW5lZClcblx0XHRcdFx0ZGVyLndyaXRlQm9vbGVhbihleHRzW2ldLmNyaXRpY2FsKTtcblxuXHRcdFx0aWYgKGV4dHNbaV0ub2lkID09PSBFWFRTLmFsdE5hbWUpIHtcblx0XHRcdFx0ZGVyLnN0YXJ0U2VxdWVuY2UoYXNuMS5CZXIuT2N0ZXRTdHJpbmcpO1xuXHRcdFx0XHRkZXIuc3RhcnRTZXF1ZW5jZSgpO1xuXHRcdFx0XHRpZiAoc3ViamVjdC50eXBlID09PSAnaG9zdCcpIHtcblx0XHRcdFx0XHRkZXIud3JpdGVTdHJpbmcoc3ViamVjdC5ob3N0bmFtZSxcblx0XHRcdFx0XHQgICAgQ29udGV4dCgyKSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0Zm9yICh2YXIgaiA9IDA7IGogPCBhbHROYW1lcy5sZW5ndGg7ICsraikge1xuXHRcdFx0XHRcdGlmIChhbHROYW1lc1tqXS50eXBlID09PSAnaG9zdCcpIHtcblx0XHRcdFx0XHRcdGRlci53cml0ZVN0cmluZyhcblx0XHRcdFx0XHRcdCAgICBhbHROYW1lc1tqXS5ob3N0bmFtZSxcblx0XHRcdFx0XHRcdCAgICBBTFROQU1FLkROU05hbWUpO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAoYWx0TmFtZXNbal0udHlwZSA9PT1cblx0XHRcdFx0XHQgICAgJ2VtYWlsJykge1xuXHRcdFx0XHRcdFx0ZGVyLndyaXRlU3RyaW5nKFxuXHRcdFx0XHRcdFx0ICAgIGFsdE5hbWVzW2pdLmVtYWlsLFxuXHRcdFx0XHRcdFx0ICAgIEFMVE5BTUUuUkZDODIyTmFtZSk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdC8qXG5cdFx0XHRcdFx0XHQgKiBFbmNvZGUgYW55dGhpbmcgZWxzZSBhcyBhXG5cdFx0XHRcdFx0XHQgKiBETiBzdHlsZSBuYW1lIGZvciBub3cuXG5cdFx0XHRcdFx0XHQgKi9cblx0XHRcdFx0XHRcdGRlci5zdGFydFNlcXVlbmNlKFxuXHRcdFx0XHRcdFx0ICAgIEFMVE5BTUUuRGlyZWN0b3J5TmFtZSk7XG5cdFx0XHRcdFx0XHRhbHROYW1lc1tqXS50b0FzbjEoZGVyKTtcblx0XHRcdFx0XHRcdGRlci5lbmRTZXF1ZW5jZSgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRkZXIuZW5kU2VxdWVuY2UoKTtcblx0XHRcdFx0ZGVyLmVuZFNlcXVlbmNlKCk7XG5cdFx0XHR9IGVsc2UgaWYgKGV4dHNbaV0ub2lkID09PSBFWFRTLmJhc2ljQ29uc3RyYWludHMpIHtcblx0XHRcdFx0ZGVyLnN0YXJ0U2VxdWVuY2UoYXNuMS5CZXIuT2N0ZXRTdHJpbmcpO1xuXHRcdFx0XHRkZXIuc3RhcnRTZXF1ZW5jZSgpO1xuXHRcdFx0XHR2YXIgY2EgPSAoY2VydC5wdXJwb3Nlcy5pbmRleE9mKCdjYScpICE9PSAtMSk7XG5cdFx0XHRcdHZhciBwYXRoTGVuID0gZXh0c1tpXS5wYXRoTGVuO1xuXHRcdFx0XHRkZXIud3JpdGVCb29sZWFuKGNhKTtcblx0XHRcdFx0aWYgKHBhdGhMZW4gIT09IHVuZGVmaW5lZClcblx0XHRcdFx0XHRkZXIud3JpdGVJbnQocGF0aExlbik7XG5cdFx0XHRcdGRlci5lbmRTZXF1ZW5jZSgpO1xuXHRcdFx0XHRkZXIuZW5kU2VxdWVuY2UoKTtcblx0XHRcdH0gZWxzZSBpZiAoZXh0c1tpXS5vaWQgPT09IEVYVFMuZXh0S2V5VXNhZ2UpIHtcblx0XHRcdFx0ZGVyLnN0YXJ0U2VxdWVuY2UoYXNuMS5CZXIuT2N0ZXRTdHJpbmcpO1xuXHRcdFx0XHRkZXIuc3RhcnRTZXF1ZW5jZSgpO1xuXHRcdFx0XHRjZXJ0LnB1cnBvc2VzLmZvckVhY2goZnVuY3Rpb24gKHB1cnBvc2UpIHtcblx0XHRcdFx0XHRpZiAocHVycG9zZSA9PT0gJ2NhJylcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHRpZiAoS0VZVVNFQklUUy5pbmRleE9mKHB1cnBvc2UpICE9PSAtMSlcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR2YXIgb2lkID0gcHVycG9zZTtcblx0XHRcdFx0XHRpZiAoRVhUUFVSUE9TRVtwdXJwb3NlXSAhPT0gdW5kZWZpbmVkKVxuXHRcdFx0XHRcdFx0b2lkID0gRVhUUFVSUE9TRVtwdXJwb3NlXTtcblx0XHRcdFx0XHRkZXIud3JpdGVPSUQob2lkKTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdGRlci5lbmRTZXF1ZW5jZSgpO1xuXHRcdFx0XHRkZXIuZW5kU2VxdWVuY2UoKTtcblx0XHRcdH0gZWxzZSBpZiAoZXh0c1tpXS5vaWQgPT09IEVYVFMua2V5VXNhZ2UpIHtcblx0XHRcdFx0ZGVyLnN0YXJ0U2VxdWVuY2UoYXNuMS5CZXIuT2N0ZXRTdHJpbmcpO1xuXHRcdFx0XHQvKlxuXHRcdFx0XHQgKiBJZiB3ZSBwYXJzZWQgdGhpcyBjZXJ0aWZpY2F0ZSBmcm9tIGEgYnl0ZVxuXHRcdFx0XHQgKiBzdHJlYW0gKGkuZS4gd2UgZGlkbid0IGdlbmVyYXRlIGl0IGluIHNzaHBrKVxuXHRcdFx0XHQgKiB0aGVuIHdlJ2xsIGhhdmUgYSBcIi5iaXRzXCIgcHJvcGVydHkgb24gdGhlXG5cdFx0XHRcdCAqIGV4dCB3aXRoIHRoZSBvcmlnaW5hbCByYXcgYnl0ZSBjb250ZW50cy5cblx0XHRcdFx0ICpcblx0XHRcdFx0ICogSWYgd2UgaGF2ZSB0aGlzLCB1c2UgaXQgaGVyZSBpbnN0ZWFkIG9mXG5cdFx0XHRcdCAqIHJlZ2VuZXJhdGluZyBpdC4gVGhpcyBndWFyYW50ZWVzIHdlIG91dHB1dFxuXHRcdFx0XHQgKiB0aGUgc2FtZSBkYXRhIHdlIHBhcnNlZCwgc28gc2lnbmF0dXJlcyBzdGlsbFxuXHRcdFx0XHQgKiB2YWxpZGF0ZS5cblx0XHRcdFx0ICovXG5cdFx0XHRcdGlmIChleHRzW2ldLmJpdHMgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdGRlci53cml0ZUJ1ZmZlcihleHRzW2ldLmJpdHMsXG5cdFx0XHRcdFx0ICAgIGFzbjEuQmVyLkJpdFN0cmluZyk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dmFyIGJpdHMgPSB3cml0ZUJpdEZpZWxkKGNlcnQucHVycG9zZXMsXG5cdFx0XHRcdFx0ICAgIEtFWVVTRUJJVFMpO1xuXHRcdFx0XHRcdGRlci53cml0ZUJ1ZmZlcihiaXRzLFxuXHRcdFx0XHRcdCAgICBhc24xLkJlci5CaXRTdHJpbmcpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGRlci5lbmRTZXF1ZW5jZSgpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZGVyLndyaXRlQnVmZmVyKGV4dHNbaV0uZGF0YSxcblx0XHRcdFx0ICAgIGFzbjEuQmVyLk9jdGV0U3RyaW5nKTtcblx0XHRcdH1cblxuXHRcdFx0ZGVyLmVuZFNlcXVlbmNlKCk7XG5cdFx0fVxuXG5cdFx0ZGVyLmVuZFNlcXVlbmNlKCk7XG5cdFx0ZGVyLmVuZFNlcXVlbmNlKCk7XG5cdH1cblxuXHRkZXIuZW5kU2VxdWVuY2UoKTtcbn1cblxuLypcbiAqIFJlYWRzIGFuIEFTTi4xIEJFUiBiaXRmaWVsZCBvdXQgb2YgdGhlIEJ1ZmZlciBwcm9kdWNlZCBieSBkb2luZ1xuICogYEJlclJlYWRlciNyZWFkU3RyaW5nKGFzbjEuQmVyLkJpdFN0cmluZylgLiBUaGF0IGZ1bmN0aW9uIGdpdmVzIHVzIHRoZSByYXdcbiAqIGNvbnRlbnRzIG9mIHRoZSBCaXRTdHJpbmcgdGFnLCB3aGljaCBpcyBhIGNvdW50IG9mIHVudXNlZCBiaXRzIGZvbGxvd2VkIGJ5XG4gKiB0aGUgYml0cyBhcyBhIHJpZ2h0LXBhZGRlZCBieXRlIHN0cmluZy5cbiAqXG4gKiBgYml0c2AgaXMgdGhlIEJ1ZmZlciwgYGJpdEluZGV4YCBzaG91bGQgY29udGFpbiBhbiBhcnJheSBvZiBzdHJpbmcgbmFtZXNcbiAqIGZvciB0aGUgYml0cyBpbiB0aGUgc3RyaW5nLCBvcmRlcmVkIHN0YXJ0aW5nIHdpdGggYml0ICMwIGluIHRoZSBBU04uMSBzcGVjLlxuICpcbiAqIFJldHVybnMgYW4gYXJyYXkgb2YgU3RyaW5ncywgdGhlIG5hbWVzIG9mIHRoZSBiaXRzIHRoYXQgd2VyZSBzZXQgdG8gMS5cbiAqL1xuZnVuY3Rpb24gcmVhZEJpdEZpZWxkKGJpdHMsIGJpdEluZGV4KSB7XG5cdHZhciBiaXRMZW4gPSA4ICogKGJpdHMubGVuZ3RoIC0gMSkgLSBiaXRzWzBdO1xuXHR2YXIgc2V0Qml0cyA9IHt9O1xuXHRmb3IgKHZhciBpID0gMDsgaSA8IGJpdExlbjsgKytpKSB7XG5cdFx0dmFyIGJ5dGVOID0gMSArIE1hdGguZmxvb3IoaSAvIDgpO1xuXHRcdHZhciBiaXQgPSA3IC0gKGkgJSA4KTtcblx0XHR2YXIgbWFzayA9IDEgPDwgYml0O1xuXHRcdHZhciBiaXRWYWwgPSAoKGJpdHNbYnl0ZU5dICYgbWFzaykgIT09IDApO1xuXHRcdHZhciBuYW1lID0gYml0SW5kZXhbaV07XG5cdFx0aWYgKGJpdFZhbCAmJiB0eXBlb2YgKG5hbWUpID09PSAnc3RyaW5nJykge1xuXHRcdFx0c2V0Qml0c1tuYW1lXSA9IHRydWU7XG5cdFx0fVxuXHR9XG5cdHJldHVybiAoT2JqZWN0LmtleXMoc2V0Qml0cykpO1xufVxuXG4vKlxuICogYHNldEJpdHNgIGlzIGFuIGFycmF5IG9mIHN0cmluZ3MsIGNvbnRhaW5pbmcgdGhlIG5hbWVzIGZvciBlYWNoIGJpdCB0aGF0XG4gKiBzb3VsZCBiZSBzZXQgdG8gMS4gYGJpdEluZGV4YCBpcyBzYW1lIGFzIGluIGByZWFkQml0RmllbGQoKWAuXG4gKlxuICogUmV0dXJucyBhIEJ1ZmZlciwgcmVhZHkgdG8gYmUgd3JpdHRlbiBvdXQgd2l0aCBgQmVyV3JpdGVyI3dyaXRlU3RyaW5nKClgLlxuICovXG5mdW5jdGlvbiB3cml0ZUJpdEZpZWxkKHNldEJpdHMsIGJpdEluZGV4KSB7XG5cdHZhciBiaXRMZW4gPSBiaXRJbmRleC5sZW5ndGg7XG5cdHZhciBibGVuID0gTWF0aC5jZWlsKGJpdExlbiAvIDgpO1xuXHR2YXIgdW51c2VkID0gYmxlbiAqIDggLSBiaXRMZW47XG5cdHZhciBiaXRzID0gQnVmZmVyLmFsbG9jKDEgKyBibGVuKTsgLy8gemVyby1maWxsZWRcblx0Yml0c1swXSA9IHVudXNlZDtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBiaXRMZW47ICsraSkge1xuXHRcdHZhciBieXRlTiA9IDEgKyBNYXRoLmZsb29yKGkgLyA4KTtcblx0XHR2YXIgYml0ID0gNyAtIChpICUgOCk7XG5cdFx0dmFyIG1hc2sgPSAxIDw8IGJpdDtcblx0XHR2YXIgbmFtZSA9IGJpdEluZGV4W2ldO1xuXHRcdGlmIChuYW1lID09PSB1bmRlZmluZWQpXG5cdFx0XHRjb250aW51ZTtcblx0XHR2YXIgYml0VmFsID0gKHNldEJpdHMuaW5kZXhPZihuYW1lKSAhPT0gLTEpO1xuXHRcdGlmIChiaXRWYWwpIHtcblx0XHRcdGJpdHNbYnl0ZU5dIHw9IG1hc2s7XG5cdFx0fVxuXHR9XG5cdHJldHVybiAoYml0cyk7XG59XG4iLCIvLyBDb3B5cmlnaHQgMjAxNyBKb3llbnQsIEluYy5cblxubW9kdWxlLmV4cG9ydHMgPSBQcml2YXRlS2V5O1xuXG52YXIgYXNzZXJ0ID0gcmVxdWlyZSgnYXNzZXJ0LXBsdXMnKTtcbnZhciBCdWZmZXIgPSByZXF1aXJlKCdzYWZlci1idWZmZXInKS5CdWZmZXI7XG52YXIgYWxncyA9IHJlcXVpcmUoJy4vYWxncycpO1xudmFyIGNyeXB0byA9IHJlcXVpcmUoJ2NyeXB0bycpO1xudmFyIEZpbmdlcnByaW50ID0gcmVxdWlyZSgnLi9maW5nZXJwcmludCcpO1xudmFyIFNpZ25hdHVyZSA9IHJlcXVpcmUoJy4vc2lnbmF0dXJlJyk7XG52YXIgZXJycyA9IHJlcXVpcmUoJy4vZXJyb3JzJyk7XG52YXIgdXRpbCA9IHJlcXVpcmUoJ3V0aWwnKTtcbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcbnZhciBkaGUgPSByZXF1aXJlKCcuL2RoZScpO1xudmFyIGdlbmVyYXRlRUNEU0EgPSBkaGUuZ2VuZXJhdGVFQ0RTQTtcbnZhciBnZW5lcmF0ZUVEMjU1MTkgPSBkaGUuZ2VuZXJhdGVFRDI1NTE5O1xudmFyIGVkQ29tcGF0ID0gcmVxdWlyZSgnLi9lZC1jb21wYXQnKTtcbnZhciBuYWNsID0gcmVxdWlyZSgndHdlZXRuYWNsJyk7XG5cbnZhciBLZXkgPSByZXF1aXJlKCcuL2tleScpO1xuXG52YXIgSW52YWxpZEFsZ29yaXRobUVycm9yID0gZXJycy5JbnZhbGlkQWxnb3JpdGhtRXJyb3I7XG52YXIgS2V5UGFyc2VFcnJvciA9IGVycnMuS2V5UGFyc2VFcnJvcjtcbnZhciBLZXlFbmNyeXB0ZWRFcnJvciA9IGVycnMuS2V5RW5jcnlwdGVkRXJyb3I7XG5cbnZhciBmb3JtYXRzID0ge307XG5mb3JtYXRzWydhdXRvJ10gPSByZXF1aXJlKCcuL2Zvcm1hdHMvYXV0bycpO1xuZm9ybWF0c1sncGVtJ10gPSByZXF1aXJlKCcuL2Zvcm1hdHMvcGVtJyk7XG5mb3JtYXRzWydwa2NzMSddID0gcmVxdWlyZSgnLi9mb3JtYXRzL3BrY3MxJyk7XG5mb3JtYXRzWydwa2NzOCddID0gcmVxdWlyZSgnLi9mb3JtYXRzL3BrY3M4Jyk7XG5mb3JtYXRzWydyZmM0MjUzJ10gPSByZXF1aXJlKCcuL2Zvcm1hdHMvcmZjNDI1MycpO1xuZm9ybWF0c1snc3NoLXByaXZhdGUnXSA9IHJlcXVpcmUoJy4vZm9ybWF0cy9zc2gtcHJpdmF0ZScpO1xuZm9ybWF0c1snb3BlbnNzaCddID0gZm9ybWF0c1snc3NoLXByaXZhdGUnXTtcbmZvcm1hdHNbJ3NzaCddID0gZm9ybWF0c1snc3NoLXByaXZhdGUnXTtcbmZvcm1hdHNbJ2Ruc3NlYyddID0gcmVxdWlyZSgnLi9mb3JtYXRzL2Ruc3NlYycpO1xuXG5mdW5jdGlvbiBQcml2YXRlS2V5KG9wdHMpIHtcblx0YXNzZXJ0Lm9iamVjdChvcHRzLCAnb3B0aW9ucycpO1xuXHRLZXkuY2FsbCh0aGlzLCBvcHRzKTtcblxuXHR0aGlzLl9wdWJDYWNoZSA9IHVuZGVmaW5lZDtcbn1cbnV0aWwuaW5oZXJpdHMoUHJpdmF0ZUtleSwgS2V5KTtcblxuUHJpdmF0ZUtleS5mb3JtYXRzID0gZm9ybWF0cztcblxuUHJpdmF0ZUtleS5wcm90b3R5cGUudG9CdWZmZXIgPSBmdW5jdGlvbiAoZm9ybWF0LCBvcHRpb25zKSB7XG5cdGlmIChmb3JtYXQgPT09IHVuZGVmaW5lZClcblx0XHRmb3JtYXQgPSAncGtjczEnO1xuXHRhc3NlcnQuc3RyaW5nKGZvcm1hdCwgJ2Zvcm1hdCcpO1xuXHRhc3NlcnQub2JqZWN0KGZvcm1hdHNbZm9ybWF0XSwgJ2Zvcm1hdHNbZm9ybWF0XScpO1xuXHRhc3NlcnQub3B0aW9uYWxPYmplY3Qob3B0aW9ucywgJ29wdGlvbnMnKTtcblxuXHRyZXR1cm4gKGZvcm1hdHNbZm9ybWF0XS53cml0ZSh0aGlzLCBvcHRpb25zKSk7XG59O1xuXG5Qcml2YXRlS2V5LnByb3RvdHlwZS5oYXNoID0gZnVuY3Rpb24gKGFsZ28sIHR5cGUpIHtcblx0cmV0dXJuICh0aGlzLnRvUHVibGljKCkuaGFzaChhbGdvLCB0eXBlKSk7XG59O1xuXG5Qcml2YXRlS2V5LnByb3RvdHlwZS5maW5nZXJwcmludCA9IGZ1bmN0aW9uIChhbGdvLCB0eXBlKSB7XG5cdHJldHVybiAodGhpcy50b1B1YmxpYygpLmZpbmdlcnByaW50KGFsZ28sIHR5cGUpKTtcbn07XG5cblByaXZhdGVLZXkucHJvdG90eXBlLnRvUHVibGljID0gZnVuY3Rpb24gKCkge1xuXHRpZiAodGhpcy5fcHViQ2FjaGUpXG5cdFx0cmV0dXJuICh0aGlzLl9wdWJDYWNoZSk7XG5cblx0dmFyIGFsZ0luZm8gPSBhbGdzLmluZm9bdGhpcy50eXBlXTtcblx0dmFyIHB1YlBhcnRzID0gW107XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgYWxnSW5mby5wYXJ0cy5sZW5ndGg7ICsraSkge1xuXHRcdHZhciBwID0gYWxnSW5mby5wYXJ0c1tpXTtcblx0XHRwdWJQYXJ0cy5wdXNoKHRoaXMucGFydFtwXSk7XG5cdH1cblxuXHR0aGlzLl9wdWJDYWNoZSA9IG5ldyBLZXkoe1xuXHRcdHR5cGU6IHRoaXMudHlwZSxcblx0XHRzb3VyY2U6IHRoaXMsXG5cdFx0cGFydHM6IHB1YlBhcnRzXG5cdH0pO1xuXHRpZiAodGhpcy5jb21tZW50KVxuXHRcdHRoaXMuX3B1YkNhY2hlLmNvbW1lbnQgPSB0aGlzLmNvbW1lbnQ7XG5cdHJldHVybiAodGhpcy5fcHViQ2FjaGUpO1xufTtcblxuUHJpdmF0ZUtleS5wcm90b3R5cGUuZGVyaXZlID0gZnVuY3Rpb24gKG5ld1R5cGUpIHtcblx0YXNzZXJ0LnN0cmluZyhuZXdUeXBlLCAndHlwZScpO1xuXHR2YXIgcHJpdiwgcHViLCBwYWlyO1xuXG5cdGlmICh0aGlzLnR5cGUgPT09ICdlZDI1NTE5JyAmJiBuZXdUeXBlID09PSAnY3VydmUyNTUxOScpIHtcblx0XHRwcml2ID0gdGhpcy5wYXJ0LmsuZGF0YTtcblx0XHRpZiAocHJpdlswXSA9PT0gMHgwMClcblx0XHRcdHByaXYgPSBwcml2LnNsaWNlKDEpO1xuXG5cdFx0cGFpciA9IG5hY2wuYm94LmtleVBhaXIuZnJvbVNlY3JldEtleShuZXcgVWludDhBcnJheShwcml2KSk7XG5cdFx0cHViID0gQnVmZmVyLmZyb20ocGFpci5wdWJsaWNLZXkpO1xuXG5cdFx0cmV0dXJuIChuZXcgUHJpdmF0ZUtleSh7XG5cdFx0XHR0eXBlOiAnY3VydmUyNTUxOScsXG5cdFx0XHRwYXJ0czogW1xuXHRcdFx0XHR7IG5hbWU6ICdBJywgZGF0YTogdXRpbHMubXBOb3JtYWxpemUocHViKSB9LFxuXHRcdFx0XHR7IG5hbWU6ICdrJywgZGF0YTogdXRpbHMubXBOb3JtYWxpemUocHJpdikgfVxuXHRcdFx0XVxuXHRcdH0pKTtcblx0fSBlbHNlIGlmICh0aGlzLnR5cGUgPT09ICdjdXJ2ZTI1NTE5JyAmJiBuZXdUeXBlID09PSAnZWQyNTUxOScpIHtcblx0XHRwcml2ID0gdGhpcy5wYXJ0LmsuZGF0YTtcblx0XHRpZiAocHJpdlswXSA9PT0gMHgwMClcblx0XHRcdHByaXYgPSBwcml2LnNsaWNlKDEpO1xuXG5cdFx0cGFpciA9IG5hY2wuc2lnbi5rZXlQYWlyLmZyb21TZWVkKG5ldyBVaW50OEFycmF5KHByaXYpKTtcblx0XHRwdWIgPSBCdWZmZXIuZnJvbShwYWlyLnB1YmxpY0tleSk7XG5cblx0XHRyZXR1cm4gKG5ldyBQcml2YXRlS2V5KHtcblx0XHRcdHR5cGU6ICdlZDI1NTE5Jyxcblx0XHRcdHBhcnRzOiBbXG5cdFx0XHRcdHsgbmFtZTogJ0EnLCBkYXRhOiB1dGlscy5tcE5vcm1hbGl6ZShwdWIpIH0sXG5cdFx0XHRcdHsgbmFtZTogJ2snLCBkYXRhOiB1dGlscy5tcE5vcm1hbGl6ZShwcml2KSB9XG5cdFx0XHRdXG5cdFx0fSkpO1xuXHR9XG5cdHRocm93IChuZXcgRXJyb3IoJ0tleSBkZXJpdmF0aW9uIG5vdCBzdXBwb3J0ZWQgZnJvbSAnICsgdGhpcy50eXBlICtcblx0ICAgICcgdG8gJyArIG5ld1R5cGUpKTtcbn07XG5cblByaXZhdGVLZXkucHJvdG90eXBlLmNyZWF0ZVZlcmlmeSA9IGZ1bmN0aW9uIChoYXNoQWxnbykge1xuXHRyZXR1cm4gKHRoaXMudG9QdWJsaWMoKS5jcmVhdGVWZXJpZnkoaGFzaEFsZ28pKTtcbn07XG5cblByaXZhdGVLZXkucHJvdG90eXBlLmNyZWF0ZVNpZ24gPSBmdW5jdGlvbiAoaGFzaEFsZ28pIHtcblx0aWYgKGhhc2hBbGdvID09PSB1bmRlZmluZWQpXG5cdFx0aGFzaEFsZ28gPSB0aGlzLmRlZmF1bHRIYXNoQWxnb3JpdGhtKCk7XG5cdGFzc2VydC5zdHJpbmcoaGFzaEFsZ28sICdoYXNoIGFsZ29yaXRobScpO1xuXG5cdC8qIEVEMjU1MTkgaXMgbm90IHN1cHBvcnRlZCBieSBPcGVuU1NMLCB1c2UgYSBqYXZhc2NyaXB0IGltcGwuICovXG5cdGlmICh0aGlzLnR5cGUgPT09ICdlZDI1NTE5JyAmJiBlZENvbXBhdCAhPT0gdW5kZWZpbmVkKVxuXHRcdHJldHVybiAobmV3IGVkQ29tcGF0LlNpZ25lcih0aGlzLCBoYXNoQWxnbykpO1xuXHRpZiAodGhpcy50eXBlID09PSAnY3VydmUyNTUxOScpXG5cdFx0dGhyb3cgKG5ldyBFcnJvcignQ3VydmUyNTUxOSBrZXlzIGFyZSBub3Qgc3VpdGFibGUgZm9yICcgK1xuXHRcdCAgICAnc2lnbmluZyBvciB2ZXJpZmljYXRpb24nKSk7XG5cblx0dmFyIHYsIG5tLCBlcnI7XG5cdHRyeSB7XG5cdFx0bm0gPSBoYXNoQWxnby50b1VwcGVyQ2FzZSgpO1xuXHRcdHYgPSBjcnlwdG8uY3JlYXRlU2lnbihubSk7XG5cdH0gY2F0Y2ggKGUpIHtcblx0XHRlcnIgPSBlO1xuXHR9XG5cdGlmICh2ID09PSB1bmRlZmluZWQgfHwgKGVyciBpbnN0YW5jZW9mIEVycm9yICYmXG5cdCAgICBlcnIubWVzc2FnZS5tYXRjaCgvVW5rbm93biBtZXNzYWdlIGRpZ2VzdC8pKSkge1xuXHRcdG5tID0gJ1JTQS0nO1xuXHRcdG5tICs9IGhhc2hBbGdvLnRvVXBwZXJDYXNlKCk7XG5cdFx0diA9IGNyeXB0by5jcmVhdGVTaWduKG5tKTtcblx0fVxuXHRhc3NlcnQub2sodiwgJ2ZhaWxlZCB0byBjcmVhdGUgdmVyaWZpZXInKTtcblx0dmFyIG9sZFNpZ24gPSB2LnNpZ24uYmluZCh2KTtcblx0dmFyIGtleSA9IHRoaXMudG9CdWZmZXIoJ3BrY3MxJyk7XG5cdHZhciB0eXBlID0gdGhpcy50eXBlO1xuXHR2YXIgY3VydmUgPSB0aGlzLmN1cnZlO1xuXHR2LnNpZ24gPSBmdW5jdGlvbiAoKSB7XG5cdFx0dmFyIHNpZyA9IG9sZFNpZ24oa2V5KTtcblx0XHRpZiAodHlwZW9mIChzaWcpID09PSAnc3RyaW5nJylcblx0XHRcdHNpZyA9IEJ1ZmZlci5mcm9tKHNpZywgJ2JpbmFyeScpO1xuXHRcdHNpZyA9IFNpZ25hdHVyZS5wYXJzZShzaWcsIHR5cGUsICdhc24xJyk7XG5cdFx0c2lnLmhhc2hBbGdvcml0aG0gPSBoYXNoQWxnbztcblx0XHRzaWcuY3VydmUgPSBjdXJ2ZTtcblx0XHRyZXR1cm4gKHNpZyk7XG5cdH07XG5cdHJldHVybiAodik7XG59O1xuXG5Qcml2YXRlS2V5LnBhcnNlID0gZnVuY3Rpb24gKGRhdGEsIGZvcm1hdCwgb3B0aW9ucykge1xuXHRpZiAodHlwZW9mIChkYXRhKSAhPT0gJ3N0cmluZycpXG5cdFx0YXNzZXJ0LmJ1ZmZlcihkYXRhLCAnZGF0YScpO1xuXHRpZiAoZm9ybWF0ID09PSB1bmRlZmluZWQpXG5cdFx0Zm9ybWF0ID0gJ2F1dG8nO1xuXHRhc3NlcnQuc3RyaW5nKGZvcm1hdCwgJ2Zvcm1hdCcpO1xuXHRpZiAodHlwZW9mIChvcHRpb25zKSA9PT0gJ3N0cmluZycpXG5cdFx0b3B0aW9ucyA9IHsgZmlsZW5hbWU6IG9wdGlvbnMgfTtcblx0YXNzZXJ0Lm9wdGlvbmFsT2JqZWN0KG9wdGlvbnMsICdvcHRpb25zJyk7XG5cdGlmIChvcHRpb25zID09PSB1bmRlZmluZWQpXG5cdFx0b3B0aW9ucyA9IHt9O1xuXHRhc3NlcnQub3B0aW9uYWxTdHJpbmcob3B0aW9ucy5maWxlbmFtZSwgJ29wdGlvbnMuZmlsZW5hbWUnKTtcblx0aWYgKG9wdGlvbnMuZmlsZW5hbWUgPT09IHVuZGVmaW5lZClcblx0XHRvcHRpb25zLmZpbGVuYW1lID0gJyh1bm5hbWVkKSc7XG5cblx0YXNzZXJ0Lm9iamVjdChmb3JtYXRzW2Zvcm1hdF0sICdmb3JtYXRzW2Zvcm1hdF0nKTtcblxuXHR0cnkge1xuXHRcdHZhciBrID0gZm9ybWF0c1tmb3JtYXRdLnJlYWQoZGF0YSwgb3B0aW9ucyk7XG5cdFx0YXNzZXJ0Lm9rKGsgaW5zdGFuY2VvZiBQcml2YXRlS2V5LCAna2V5IGlzIG5vdCBhIHByaXZhdGUga2V5Jyk7XG5cdFx0aWYgKCFrLmNvbW1lbnQpXG5cdFx0XHRrLmNvbW1lbnQgPSBvcHRpb25zLmZpbGVuYW1lO1xuXHRcdHJldHVybiAoayk7XG5cdH0gY2F0Y2ggKGUpIHtcblx0XHRpZiAoZS5uYW1lID09PSAnS2V5RW5jcnlwdGVkRXJyb3InKVxuXHRcdFx0dGhyb3cgKGUpO1xuXHRcdHRocm93IChuZXcgS2V5UGFyc2VFcnJvcihvcHRpb25zLmZpbGVuYW1lLCBmb3JtYXQsIGUpKTtcblx0fVxufTtcblxuUHJpdmF0ZUtleS5pc1ByaXZhdGVLZXkgPSBmdW5jdGlvbiAob2JqLCB2ZXIpIHtcblx0cmV0dXJuICh1dGlscy5pc0NvbXBhdGlibGUob2JqLCBQcml2YXRlS2V5LCB2ZXIpKTtcbn07XG5cblByaXZhdGVLZXkuZ2VuZXJhdGUgPSBmdW5jdGlvbiAodHlwZSwgb3B0aW9ucykge1xuXHRpZiAob3B0aW9ucyA9PT0gdW5kZWZpbmVkKVxuXHRcdG9wdGlvbnMgPSB7fTtcblx0YXNzZXJ0Lm9iamVjdChvcHRpb25zLCAnb3B0aW9ucycpO1xuXG5cdHN3aXRjaCAodHlwZSkge1xuXHRjYXNlICdlY2RzYSc6XG5cdFx0aWYgKG9wdGlvbnMuY3VydmUgPT09IHVuZGVmaW5lZClcblx0XHRcdG9wdGlvbnMuY3VydmUgPSAnbmlzdHAyNTYnO1xuXHRcdGFzc2VydC5zdHJpbmcob3B0aW9ucy5jdXJ2ZSwgJ29wdGlvbnMuY3VydmUnKTtcblx0XHRyZXR1cm4gKGdlbmVyYXRlRUNEU0Eob3B0aW9ucy5jdXJ2ZSkpO1xuXHRjYXNlICdlZDI1NTE5Jzpcblx0XHRyZXR1cm4gKGdlbmVyYXRlRUQyNTUxOSgpKTtcblx0ZGVmYXVsdDpcblx0XHR0aHJvdyAobmV3IEVycm9yKCdLZXkgZ2VuZXJhdGlvbiBub3Qgc3VwcG9ydGVkIHdpdGgga2V5ICcgK1xuXHRcdCAgICAndHlwZSBcIicgKyB0eXBlICsgJ1wiJykpO1xuXHR9XG59O1xuXG4vKlxuICogQVBJIHZlcnNpb25zIGZvciBQcml2YXRlS2V5OlxuICogWzEsMF0gLS0gaW5pdGlhbCB2ZXJcbiAqIFsxLDFdIC0tIGFkZGVkIGF1dG8sIHBrY3NbMThdLCBvcGVuc3NoL3NzaC1wcml2YXRlIGZvcm1hdHNcbiAqIFsxLDJdIC0tIGFkZGVkIGRlZmF1bHRIYXNoQWxnb3JpdGhtXG4gKiBbMSwzXSAtLSBhZGRlZCBkZXJpdmUsIGVkLCBjcmVhdGVESFxuICogWzEsNF0gLS0gZmlyc3QgdGFnZ2VkIHZlcnNpb25cbiAqIFsxLDVdIC0tIGNoYW5nZWQgZWQyNTUxOSBwYXJ0IG5hbWVzIGFuZCBmb3JtYXRcbiAqIFsxLDZdIC0tIHR5cGUgYXJndW1lbnRzIGZvciBoYXNoKCkgYW5kIGZpbmdlcnByaW50KClcbiAqL1xuUHJpdmF0ZUtleS5wcm90b3R5cGUuX3NzaHBrQXBpVmVyc2lvbiA9IFsxLCA2XTtcblxuUHJpdmF0ZUtleS5fb2xkVmVyc2lvbkRldGVjdCA9IGZ1bmN0aW9uIChvYmopIHtcblx0YXNzZXJ0LmZ1bmMob2JqLnRvUHVibGljKTtcblx0YXNzZXJ0LmZ1bmMob2JqLmNyZWF0ZVNpZ24pO1xuXHRpZiAob2JqLmRlcml2ZSlcblx0XHRyZXR1cm4gKFsxLCAzXSk7XG5cdGlmIChvYmouZGVmYXVsdEhhc2hBbGdvcml0aG0pXG5cdFx0cmV0dXJuIChbMSwgMl0pO1xuXHRpZiAob2JqLmZvcm1hdHNbJ2F1dG8nXSlcblx0XHRyZXR1cm4gKFsxLCAxXSk7XG5cdHJldHVybiAoWzEsIDBdKTtcbn07XG4iLCIvLyBDb3B5cmlnaHQgMjAxOCBKb3llbnQsIEluYy5cblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdHJlYWQ6IHJlYWQsXG5cdHdyaXRlOiB3cml0ZVxufTtcblxudmFyIGFzc2VydCA9IHJlcXVpcmUoJ2Fzc2VydC1wbHVzJyk7XG52YXIgYXNuMSA9IHJlcXVpcmUoJ2FzbjEnKTtcbnZhciBjcnlwdG8gPSByZXF1aXJlKCdjcnlwdG8nKTtcbnZhciBCdWZmZXIgPSByZXF1aXJlKCdzYWZlci1idWZmZXInKS5CdWZmZXI7XG52YXIgYWxncyA9IHJlcXVpcmUoJy4uL2FsZ3MnKTtcbnZhciB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWxzJyk7XG52YXIgS2V5ID0gcmVxdWlyZSgnLi4va2V5Jyk7XG52YXIgUHJpdmF0ZUtleSA9IHJlcXVpcmUoJy4uL3ByaXZhdGUta2V5Jyk7XG5cbnZhciBwa2NzMSA9IHJlcXVpcmUoJy4vcGtjczEnKTtcbnZhciBwa2NzOCA9IHJlcXVpcmUoJy4vcGtjczgnKTtcbnZhciBzc2hwcml2ID0gcmVxdWlyZSgnLi9zc2gtcHJpdmF0ZScpO1xudmFyIHJmYzQyNTMgPSByZXF1aXJlKCcuL3JmYzQyNTMnKTtcblxudmFyIGVycm9ycyA9IHJlcXVpcmUoJy4uL2Vycm9ycycpO1xuXG52YXIgT0lEX1BCRVMyID0gJzEuMi44NDAuMTEzNTQ5LjEuNS4xMyc7XG52YXIgT0lEX1BCS0RGMiA9ICcxLjIuODQwLjExMzU0OS4xLjUuMTInO1xuXG52YXIgT0lEX1RPX0NJUEhFUiA9IHtcblx0JzEuMi44NDAuMTEzNTQ5LjMuNyc6ICczZGVzLWNiYycsXG5cdCcyLjE2Ljg0MC4xLjEwMS4zLjQuMS4yJzogJ2FlczEyOC1jYmMnLFxuXHQnMi4xNi44NDAuMS4xMDEuMy40LjEuNDInOiAnYWVzMjU2LWNiYydcbn07XG52YXIgQ0lQSEVSX1RPX09JRCA9IHt9O1xuT2JqZWN0LmtleXMoT0lEX1RPX0NJUEhFUikuZm9yRWFjaChmdW5jdGlvbiAoaykge1xuXHRDSVBIRVJfVE9fT0lEW09JRF9UT19DSVBIRVJba11dID0gaztcbn0pO1xuXG52YXIgT0lEX1RPX0hBU0ggPSB7XG5cdCcxLjIuODQwLjExMzU0OS4yLjcnOiAnc2hhMScsXG5cdCcxLjIuODQwLjExMzU0OS4yLjknOiAnc2hhMjU2Jyxcblx0JzEuMi44NDAuMTEzNTQ5LjIuMTEnOiAnc2hhNTEyJ1xufTtcbnZhciBIQVNIX1RPX09JRCA9IHt9O1xuT2JqZWN0LmtleXMoT0lEX1RPX0hBU0gpLmZvckVhY2goZnVuY3Rpb24gKGspIHtcblx0SEFTSF9UT19PSURbT0lEX1RPX0hBU0hba11dID0gaztcbn0pO1xuXG4vKlxuICogRm9yIHJlYWRpbmcgd2Ugc3VwcG9ydCBib3RoIFBLQ1MjMSBhbmQgUEtDUyM4LiBJZiB3ZSBmaW5kIGEgcHJpdmF0ZSBrZXksXG4gKiB3ZSBqdXN0IHRha2UgdGhlIHB1YmxpYyBjb21wb25lbnQgb2YgaXQgYW5kIHVzZSB0aGF0LlxuICovXG5mdW5jdGlvbiByZWFkKGJ1Ziwgb3B0aW9ucywgZm9yY2VUeXBlKSB7XG5cdHZhciBpbnB1dCA9IGJ1Zjtcblx0aWYgKHR5cGVvZiAoYnVmKSAhPT0gJ3N0cmluZycpIHtcblx0XHRhc3NlcnQuYnVmZmVyKGJ1ZiwgJ2J1ZicpO1xuXHRcdGJ1ZiA9IGJ1Zi50b1N0cmluZygnYXNjaWknKTtcblx0fVxuXG5cdHZhciBsaW5lcyA9IGJ1Zi50cmltKCkuc3BsaXQoL1tcXHJcXG5dKy9nKTtcblxuXHR2YXIgbTtcblx0dmFyIHNpID0gLTE7XG5cdHdoaWxlICghbSAmJiBzaSA8IGxpbmVzLmxlbmd0aCkge1xuXHRcdG0gPSBsaW5lc1srK3NpXS5tYXRjaCgvKkpTU1RZTEVEKi9cblx0XHQgICAgL1stXStbIF0qQkVHSU4gKFtBLVowLTldW0EtWmEtejAtOV0rICk/KFBVQkxJQ3xQUklWQVRFKSBLRVlbIF0qWy1dKy8pO1xuXHR9XG5cdGFzc2VydC5vayhtLCAnaW52YWxpZCBQRU0gaGVhZGVyJyk7XG5cblx0dmFyIG0yO1xuXHR2YXIgZWkgPSBsaW5lcy5sZW5ndGg7XG5cdHdoaWxlICghbTIgJiYgZWkgPiAwKSB7XG5cdFx0bTIgPSBsaW5lc1stLWVpXS5tYXRjaCgvKkpTU1RZTEVEKi9cblx0XHQgICAgL1stXStbIF0qRU5EIChbQS1aMC05XVtBLVphLXowLTldKyApPyhQVUJMSUN8UFJJVkFURSkgS0VZWyBdKlstXSsvKTtcblx0fVxuXHRhc3NlcnQub2sobTIsICdpbnZhbGlkIFBFTSBmb290ZXInKTtcblxuXHQvKiBCZWdpbiBhbmQgZW5kIGJhbm5lcnMgbXVzdCBtYXRjaCBrZXkgdHlwZSAqL1xuXHRhc3NlcnQuZXF1YWwobVsyXSwgbTJbMl0pO1xuXHR2YXIgdHlwZSA9IG1bMl0udG9Mb3dlckNhc2UoKTtcblxuXHR2YXIgYWxnO1xuXHRpZiAobVsxXSkge1xuXHRcdC8qIFRoZXkgYWxzbyBtdXN0IG1hdGNoIGFsZ29yaXRobXMsIGlmIGdpdmVuICovXG5cdFx0YXNzZXJ0LmVxdWFsKG1bMV0sIG0yWzFdLCAnUEVNIGhlYWRlciBhbmQgZm9vdGVyIG1pc21hdGNoJyk7XG5cdFx0YWxnID0gbVsxXS50cmltKCk7XG5cdH1cblxuXHRsaW5lcyA9IGxpbmVzLnNsaWNlKHNpLCBlaSArIDEpO1xuXG5cdHZhciBoZWFkZXJzID0ge307XG5cdHdoaWxlICh0cnVlKSB7XG5cdFx0bGluZXMgPSBsaW5lcy5zbGljZSgxKTtcblx0XHRtID0gbGluZXNbMF0ubWF0Y2goLypKU1NUWUxFRCovXG5cdFx0ICAgIC9eKFtBLVphLXowLTktXSspOiAoLispJC8pO1xuXHRcdGlmICghbSlcblx0XHRcdGJyZWFrO1xuXHRcdGhlYWRlcnNbbVsxXS50b0xvd2VyQ2FzZSgpXSA9IG1bMl07XG5cdH1cblxuXHQvKiBDaG9wIG9mZiB0aGUgZmlyc3QgYW5kIGxhc3QgbGluZXMgKi9cblx0bGluZXMgPSBsaW5lcy5zbGljZSgwLCAtMSkuam9pbignJyk7XG5cdGJ1ZiA9IEJ1ZmZlci5mcm9tKGxpbmVzLCAnYmFzZTY0Jyk7XG5cblx0dmFyIGNpcGhlciwga2V5LCBpdjtcblx0aWYgKGhlYWRlcnNbJ3Byb2MtdHlwZSddKSB7XG5cdFx0dmFyIHBhcnRzID0gaGVhZGVyc1sncHJvYy10eXBlJ10uc3BsaXQoJywnKTtcblx0XHRpZiAocGFydHNbMF0gPT09ICc0JyAmJiBwYXJ0c1sxXSA9PT0gJ0VOQ1JZUFRFRCcpIHtcblx0XHRcdGlmICh0eXBlb2YgKG9wdGlvbnMucGFzc3BocmFzZSkgPT09ICdzdHJpbmcnKSB7XG5cdFx0XHRcdG9wdGlvbnMucGFzc3BocmFzZSA9IEJ1ZmZlci5mcm9tKFxuXHRcdFx0XHQgICAgb3B0aW9ucy5wYXNzcGhyYXNlLCAndXRmLTgnKTtcblx0XHRcdH1cblx0XHRcdGlmICghQnVmZmVyLmlzQnVmZmVyKG9wdGlvbnMucGFzc3BocmFzZSkpIHtcblx0XHRcdFx0dGhyb3cgKG5ldyBlcnJvcnMuS2V5RW5jcnlwdGVkRXJyb3IoXG5cdFx0XHRcdCAgICBvcHRpb25zLmZpbGVuYW1lLCAnUEVNJykpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cGFydHMgPSBoZWFkZXJzWydkZWstaW5mbyddLnNwbGl0KCcsJyk7XG5cdFx0XHRcdGFzc2VydC5vayhwYXJ0cy5sZW5ndGggPT09IDIpO1xuXHRcdFx0XHRjaXBoZXIgPSBwYXJ0c1swXS50b0xvd2VyQ2FzZSgpO1xuXHRcdFx0XHRpdiA9IEJ1ZmZlci5mcm9tKHBhcnRzWzFdLCAnaGV4Jyk7XG5cdFx0XHRcdGtleSA9IHV0aWxzLm9wZW5zc2xLZXlEZXJpdihjaXBoZXIsIGl2LFxuXHRcdFx0XHQgICAgb3B0aW9ucy5wYXNzcGhyYXNlLCAxKS5rZXk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0aWYgKGFsZyAmJiBhbGcudG9Mb3dlckNhc2UoKSA9PT0gJ2VuY3J5cHRlZCcpIHtcblx0XHR2YXIgZWRlciA9IG5ldyBhc24xLkJlclJlYWRlcihidWYpO1xuXHRcdHZhciBwYmVzRW5kO1xuXHRcdGVkZXIucmVhZFNlcXVlbmNlKCk7XG5cblx0XHRlZGVyLnJlYWRTZXF1ZW5jZSgpO1xuXHRcdHBiZXNFbmQgPSBlZGVyLm9mZnNldCArIGVkZXIubGVuZ3RoO1xuXG5cdFx0dmFyIG1ldGhvZCA9IGVkZXIucmVhZE9JRCgpO1xuXHRcdGlmIChtZXRob2QgIT09IE9JRF9QQkVTMikge1xuXHRcdFx0dGhyb3cgKG5ldyBFcnJvcignVW5zdXBwb3J0ZWQgUEVNL1BLQ1M4IGVuY3J5cHRpb24gJyArXG5cdFx0XHQgICAgJ3NjaGVtZTogJyArIG1ldGhvZCkpO1xuXHRcdH1cblxuXHRcdGVkZXIucmVhZFNlcXVlbmNlKCk7XHQvKiBQQkVTMi1wYXJhbXMgKi9cblxuXHRcdGVkZXIucmVhZFNlcXVlbmNlKCk7XHQvKiBrZXlEZXJpdmF0aW9uRnVuYyAqL1xuXHRcdHZhciBrZGZFbmQgPSBlZGVyLm9mZnNldCArIGVkZXIubGVuZ3RoO1xuXHRcdHZhciBrZGZPaWQgPSBlZGVyLnJlYWRPSUQoKTtcblx0XHRpZiAoa2RmT2lkICE9PSBPSURfUEJLREYyKVxuXHRcdFx0dGhyb3cgKG5ldyBFcnJvcignVW5zdXBwb3J0ZWQgUEJFUzIgS0RGOiAnICsga2RmT2lkKSk7XG5cdFx0ZWRlci5yZWFkU2VxdWVuY2UoKTtcblx0XHR2YXIgc2FsdCA9IGVkZXIucmVhZFN0cmluZyhhc24xLkJlci5PY3RldFN0cmluZywgdHJ1ZSk7XG5cdFx0dmFyIGl0ZXJhdGlvbnMgPSBlZGVyLnJlYWRJbnQoKTtcblx0XHR2YXIgaGFzaEFsZyA9ICdzaGExJztcblx0XHRpZiAoZWRlci5vZmZzZXQgPCBrZGZFbmQpIHtcblx0XHRcdGVkZXIucmVhZFNlcXVlbmNlKCk7XG5cdFx0XHR2YXIgaGFzaEFsZ09pZCA9IGVkZXIucmVhZE9JRCgpO1xuXHRcdFx0aGFzaEFsZyA9IE9JRF9UT19IQVNIW2hhc2hBbGdPaWRdO1xuXHRcdFx0aWYgKGhhc2hBbGcgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHR0aHJvdyAobmV3IEVycm9yKCdVbnN1cHBvcnRlZCBQQktERjIgaGFzaDogJyArXG5cdFx0XHRcdCAgICBoYXNoQWxnT2lkKSk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGVkZXIuX29mZnNldCA9IGtkZkVuZDtcblxuXHRcdGVkZXIucmVhZFNlcXVlbmNlKCk7XHQvKiBlbmNyeXB0aW9uU2NoZW1lICovXG5cdFx0dmFyIGNpcGhlck9pZCA9IGVkZXIucmVhZE9JRCgpO1xuXHRcdGNpcGhlciA9IE9JRF9UT19DSVBIRVJbY2lwaGVyT2lkXTtcblx0XHRpZiAoY2lwaGVyID09PSB1bmRlZmluZWQpIHtcblx0XHRcdHRocm93IChuZXcgRXJyb3IoJ1Vuc3VwcG9ydGVkIFBCRVMyIGNpcGhlcjogJyArXG5cdFx0XHQgICAgY2lwaGVyT2lkKSk7XG5cdFx0fVxuXHRcdGl2ID0gZWRlci5yZWFkU3RyaW5nKGFzbjEuQmVyLk9jdGV0U3RyaW5nLCB0cnVlKTtcblxuXHRcdGVkZXIuX29mZnNldCA9IHBiZXNFbmQ7XG5cdFx0YnVmID0gZWRlci5yZWFkU3RyaW5nKGFzbjEuQmVyLk9jdGV0U3RyaW5nLCB0cnVlKTtcblxuXHRcdGlmICh0eXBlb2YgKG9wdGlvbnMucGFzc3BocmFzZSkgPT09ICdzdHJpbmcnKSB7XG5cdFx0XHRvcHRpb25zLnBhc3NwaHJhc2UgPSBCdWZmZXIuZnJvbShcblx0XHRcdCAgICBvcHRpb25zLnBhc3NwaHJhc2UsICd1dGYtOCcpO1xuXHRcdH1cblx0XHRpZiAoIUJ1ZmZlci5pc0J1ZmZlcihvcHRpb25zLnBhc3NwaHJhc2UpKSB7XG5cdFx0XHR0aHJvdyAobmV3IGVycm9ycy5LZXlFbmNyeXB0ZWRFcnJvcihcblx0XHRcdCAgICBvcHRpb25zLmZpbGVuYW1lLCAnUEVNJykpO1xuXHRcdH1cblxuXHRcdHZhciBjaW5mbyA9IHV0aWxzLm9wZW5zc2hDaXBoZXJJbmZvKGNpcGhlcik7XG5cblx0XHRjaXBoZXIgPSBjaW5mby5vcGVuc3NsTmFtZTtcblx0XHRrZXkgPSB1dGlscy5wYmtkZjIoaGFzaEFsZywgc2FsdCwgaXRlcmF0aW9ucywgY2luZm8ua2V5U2l6ZSxcblx0XHQgICAgb3B0aW9ucy5wYXNzcGhyYXNlKTtcblx0XHRhbGcgPSB1bmRlZmluZWQ7XG5cdH1cblxuXHRpZiAoY2lwaGVyICYmIGtleSAmJiBpdikge1xuXHRcdHZhciBjaXBoZXJTdHJlYW0gPSBjcnlwdG8uY3JlYXRlRGVjaXBoZXJpdihjaXBoZXIsIGtleSwgaXYpO1xuXHRcdHZhciBjaHVuaywgY2h1bmtzID0gW107XG5cdFx0Y2lwaGVyU3RyZWFtLm9uY2UoJ2Vycm9yJywgZnVuY3Rpb24gKGUpIHtcblx0XHRcdGlmIChlLnRvU3RyaW5nKCkuaW5kZXhPZignYmFkIGRlY3J5cHQnKSAhPT0gLTEpIHtcblx0XHRcdFx0dGhyb3cgKG5ldyBFcnJvcignSW5jb3JyZWN0IHBhc3NwaHJhc2UgJyArXG5cdFx0XHRcdCAgICAnc3VwcGxpZWQsIGNvdWxkIG5vdCBkZWNyeXB0IGtleScpKTtcblx0XHRcdH1cblx0XHRcdHRocm93IChlKTtcblx0XHR9KTtcblx0XHRjaXBoZXJTdHJlYW0ud3JpdGUoYnVmKTtcblx0XHRjaXBoZXJTdHJlYW0uZW5kKCk7XG5cdFx0d2hpbGUgKChjaHVuayA9IGNpcGhlclN0cmVhbS5yZWFkKCkpICE9PSBudWxsKVxuXHRcdFx0Y2h1bmtzLnB1c2goY2h1bmspO1xuXHRcdGJ1ZiA9IEJ1ZmZlci5jb25jYXQoY2h1bmtzKTtcblx0fVxuXG5cdC8qIFRoZSBuZXcgT3BlblNTSCBpbnRlcm5hbCBmb3JtYXQgYWJ1c2VzIFBFTSBoZWFkZXJzICovXG5cdGlmIChhbGcgJiYgYWxnLnRvTG93ZXJDYXNlKCkgPT09ICdvcGVuc3NoJylcblx0XHRyZXR1cm4gKHNzaHByaXYucmVhZFNTSFByaXZhdGUodHlwZSwgYnVmLCBvcHRpb25zKSk7XG5cdGlmIChhbGcgJiYgYWxnLnRvTG93ZXJDYXNlKCkgPT09ICdzc2gyJylcblx0XHRyZXR1cm4gKHJmYzQyNTMucmVhZFR5cGUodHlwZSwgYnVmLCBvcHRpb25zKSk7XG5cblx0dmFyIGRlciA9IG5ldyBhc24xLkJlclJlYWRlcihidWYpO1xuXHRkZXIub3JpZ2luYWxJbnB1dCA9IGlucHV0O1xuXG5cdC8qXG5cdCAqIEFsbCBvZiB0aGUgUEVNIGZpbGUgdHlwZXMgc3RhcnQgd2l0aCBhIHNlcXVlbmNlIHRhZywgc28gY2hvcCBpdFxuXHQgKiBvZmYgaGVyZVxuXHQgKi9cblx0ZGVyLnJlYWRTZXF1ZW5jZSgpO1xuXG5cdC8qIFBLQ1MjMSB0eXBlIGtleXMgbmFtZSBhbiBhbGdvcml0aG0gaW4gdGhlIGJhbm5lciBleHBsaWNpdGx5ICovXG5cdGlmIChhbGcpIHtcblx0XHRpZiAoZm9yY2VUeXBlKVxuXHRcdFx0YXNzZXJ0LnN0cmljdEVxdWFsKGZvcmNlVHlwZSwgJ3BrY3MxJyk7XG5cdFx0cmV0dXJuIChwa2NzMS5yZWFkUGtjczEoYWxnLCB0eXBlLCBkZXIpKTtcblx0fSBlbHNlIHtcblx0XHRpZiAoZm9yY2VUeXBlKVxuXHRcdFx0YXNzZXJ0LnN0cmljdEVxdWFsKGZvcmNlVHlwZSwgJ3BrY3M4Jyk7XG5cdFx0cmV0dXJuIChwa2NzOC5yZWFkUGtjczgoYWxnLCB0eXBlLCBkZXIpKTtcblx0fVxufVxuXG5mdW5jdGlvbiB3cml0ZShrZXksIG9wdGlvbnMsIHR5cGUpIHtcblx0YXNzZXJ0Lm9iamVjdChrZXkpO1xuXG5cdHZhciBhbGcgPSB7XG5cdCAgICAnZWNkc2EnOiAnRUMnLFxuXHQgICAgJ3JzYSc6ICdSU0EnLFxuXHQgICAgJ2RzYSc6ICdEU0EnLFxuXHQgICAgJ2VkMjU1MTknOiAnRWREU0EnXG5cdH1ba2V5LnR5cGVdO1xuXHR2YXIgaGVhZGVyO1xuXG5cdHZhciBkZXIgPSBuZXcgYXNuMS5CZXJXcml0ZXIoKTtcblxuXHRpZiAoUHJpdmF0ZUtleS5pc1ByaXZhdGVLZXkoa2V5KSkge1xuXHRcdGlmICh0eXBlICYmIHR5cGUgPT09ICdwa2NzOCcpIHtcblx0XHRcdGhlYWRlciA9ICdQUklWQVRFIEtFWSc7XG5cdFx0XHRwa2NzOC53cml0ZVBrY3M4KGRlciwga2V5KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0aWYgKHR5cGUpXG5cdFx0XHRcdGFzc2VydC5zdHJpY3RFcXVhbCh0eXBlLCAncGtjczEnKTtcblx0XHRcdGhlYWRlciA9IGFsZyArICcgUFJJVkFURSBLRVknO1xuXHRcdFx0cGtjczEud3JpdGVQa2NzMShkZXIsIGtleSk7XG5cdFx0fVxuXG5cdH0gZWxzZSBpZiAoS2V5LmlzS2V5KGtleSkpIHtcblx0XHRpZiAodHlwZSAmJiB0eXBlID09PSAncGtjczEnKSB7XG5cdFx0XHRoZWFkZXIgPSBhbGcgKyAnIFBVQkxJQyBLRVknO1xuXHRcdFx0cGtjczEud3JpdGVQa2NzMShkZXIsIGtleSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGlmICh0eXBlKVxuXHRcdFx0XHRhc3NlcnQuc3RyaWN0RXF1YWwodHlwZSwgJ3BrY3M4Jyk7XG5cdFx0XHRoZWFkZXIgPSAnUFVCTElDIEtFWSc7XG5cdFx0XHRwa2NzOC53cml0ZVBrY3M4KGRlciwga2V5KTtcblx0XHR9XG5cblx0fSBlbHNlIHtcblx0XHR0aHJvdyAobmV3IEVycm9yKCdrZXkgaXMgbm90IGEgS2V5IG9yIFByaXZhdGVLZXknKSk7XG5cdH1cblxuXHR2YXIgdG1wID0gZGVyLmJ1ZmZlci50b1N0cmluZygnYmFzZTY0Jyk7XG5cdHZhciBsZW4gPSB0bXAubGVuZ3RoICsgKHRtcC5sZW5ndGggLyA2NCkgK1xuXHQgICAgMTggKyAxNiArIGhlYWRlci5sZW5ndGgqMiArIDEwO1xuXHR2YXIgYnVmID0gQnVmZmVyLmFsbG9jKGxlbik7XG5cdHZhciBvID0gMDtcblx0byArPSBidWYud3JpdGUoJy0tLS0tQkVHSU4gJyArIGhlYWRlciArICctLS0tLVxcbicsIG8pO1xuXHRmb3IgKHZhciBpID0gMDsgaSA8IHRtcC5sZW5ndGg7ICkge1xuXHRcdHZhciBsaW1pdCA9IGkgKyA2NDtcblx0XHRpZiAobGltaXQgPiB0bXAubGVuZ3RoKVxuXHRcdFx0bGltaXQgPSB0bXAubGVuZ3RoO1xuXHRcdG8gKz0gYnVmLndyaXRlKHRtcC5zbGljZShpLCBsaW1pdCksIG8pO1xuXHRcdGJ1ZltvKytdID0gMTA7XG5cdFx0aSA9IGxpbWl0O1xuXHR9XG5cdG8gKz0gYnVmLndyaXRlKCctLS0tLUVORCAnICsgaGVhZGVyICsgJy0tLS0tXFxuJywgbyk7XG5cblx0cmV0dXJuIChidWYuc2xpY2UoMCwgbykpO1xufVxuIiwiLy8gQ29weXJpZ2h0IDIwMTUgSm95ZW50LCBJbmMuXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRWZXJpZmllcjogVmVyaWZpZXIsXG5cdFNpZ25lcjogU2lnbmVyXG59O1xuXG52YXIgbmFjbCA9IHJlcXVpcmUoJ3R3ZWV0bmFjbCcpO1xudmFyIHN0cmVhbSA9IHJlcXVpcmUoJ3N0cmVhbScpO1xudmFyIHV0aWwgPSByZXF1aXJlKCd1dGlsJyk7XG52YXIgYXNzZXJ0ID0gcmVxdWlyZSgnYXNzZXJ0LXBsdXMnKTtcbnZhciBCdWZmZXIgPSByZXF1aXJlKCdzYWZlci1idWZmZXInKS5CdWZmZXI7XG52YXIgU2lnbmF0dXJlID0gcmVxdWlyZSgnLi9zaWduYXR1cmUnKTtcblxuZnVuY3Rpb24gVmVyaWZpZXIoa2V5LCBoYXNoQWxnbykge1xuXHRpZiAoaGFzaEFsZ28udG9Mb3dlckNhc2UoKSAhPT0gJ3NoYTUxMicpXG5cdFx0dGhyb3cgKG5ldyBFcnJvcignRUQyNTUxOSBvbmx5IHN1cHBvcnRzIHRoZSB1c2Ugb2YgJyArXG5cdFx0ICAgICdTSEEtNTEyIGhhc2hlcycpKTtcblxuXHR0aGlzLmtleSA9IGtleTtcblx0dGhpcy5jaHVua3MgPSBbXTtcblxuXHRzdHJlYW0uV3JpdGFibGUuY2FsbCh0aGlzLCB7fSk7XG59XG51dGlsLmluaGVyaXRzKFZlcmlmaWVyLCBzdHJlYW0uV3JpdGFibGUpO1xuXG5WZXJpZmllci5wcm90b3R5cGUuX3dyaXRlID0gZnVuY3Rpb24gKGNodW5rLCBlbmMsIGNiKSB7XG5cdHRoaXMuY2h1bmtzLnB1c2goY2h1bmspO1xuXHRjYigpO1xufTtcblxuVmVyaWZpZXIucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uIChjaHVuaykge1xuXHRpZiAodHlwZW9mIChjaHVuaykgPT09ICdzdHJpbmcnKVxuXHRcdGNodW5rID0gQnVmZmVyLmZyb20oY2h1bmssICdiaW5hcnknKTtcblx0dGhpcy5jaHVua3MucHVzaChjaHVuayk7XG59O1xuXG5WZXJpZmllci5wcm90b3R5cGUudmVyaWZ5ID0gZnVuY3Rpb24gKHNpZ25hdHVyZSwgZm10KSB7XG5cdHZhciBzaWc7XG5cdGlmIChTaWduYXR1cmUuaXNTaWduYXR1cmUoc2lnbmF0dXJlLCBbMiwgMF0pKSB7XG5cdFx0aWYgKHNpZ25hdHVyZS50eXBlICE9PSAnZWQyNTUxOScpXG5cdFx0XHRyZXR1cm4gKGZhbHNlKTtcblx0XHRzaWcgPSBzaWduYXR1cmUudG9CdWZmZXIoJ3JhdycpO1xuXG5cdH0gZWxzZSBpZiAodHlwZW9mIChzaWduYXR1cmUpID09PSAnc3RyaW5nJykge1xuXHRcdHNpZyA9IEJ1ZmZlci5mcm9tKHNpZ25hdHVyZSwgJ2Jhc2U2NCcpO1xuXG5cdH0gZWxzZSBpZiAoU2lnbmF0dXJlLmlzU2lnbmF0dXJlKHNpZ25hdHVyZSwgWzEsIDBdKSkge1xuXHRcdHRocm93IChuZXcgRXJyb3IoJ3NpZ25hdHVyZSB3YXMgY3JlYXRlZCBieSB0b28gb2xkICcgK1xuXHRcdCAgICAnYSB2ZXJzaW9uIG9mIHNzaHBrIGFuZCBjYW5ub3QgYmUgdmVyaWZpZWQnKSk7XG5cdH1cblxuXHRhc3NlcnQuYnVmZmVyKHNpZyk7XG5cdHJldHVybiAobmFjbC5zaWduLmRldGFjaGVkLnZlcmlmeShcblx0ICAgIG5ldyBVaW50OEFycmF5KEJ1ZmZlci5jb25jYXQodGhpcy5jaHVua3MpKSxcblx0ICAgIG5ldyBVaW50OEFycmF5KHNpZyksXG5cdCAgICBuZXcgVWludDhBcnJheSh0aGlzLmtleS5wYXJ0LkEuZGF0YSkpKTtcbn07XG5cbmZ1bmN0aW9uIFNpZ25lcihrZXksIGhhc2hBbGdvKSB7XG5cdGlmIChoYXNoQWxnby50b0xvd2VyQ2FzZSgpICE9PSAnc2hhNTEyJylcblx0XHR0aHJvdyAobmV3IEVycm9yKCdFRDI1NTE5IG9ubHkgc3VwcG9ydHMgdGhlIHVzZSBvZiAnICtcblx0XHQgICAgJ1NIQS01MTIgaGFzaGVzJykpO1xuXG5cdHRoaXMua2V5ID0ga2V5O1xuXHR0aGlzLmNodW5rcyA9IFtdO1xuXG5cdHN0cmVhbS5Xcml0YWJsZS5jYWxsKHRoaXMsIHt9KTtcbn1cbnV0aWwuaW5oZXJpdHMoU2lnbmVyLCBzdHJlYW0uV3JpdGFibGUpO1xuXG5TaWduZXIucHJvdG90eXBlLl93cml0ZSA9IGZ1bmN0aW9uIChjaHVuaywgZW5jLCBjYikge1xuXHR0aGlzLmNodW5rcy5wdXNoKGNodW5rKTtcblx0Y2IoKTtcbn07XG5cblNpZ25lci5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gKGNodW5rKSB7XG5cdGlmICh0eXBlb2YgKGNodW5rKSA9PT0gJ3N0cmluZycpXG5cdFx0Y2h1bmsgPSBCdWZmZXIuZnJvbShjaHVuaywgJ2JpbmFyeScpO1xuXHR0aGlzLmNodW5rcy5wdXNoKGNodW5rKTtcbn07XG5cblNpZ25lci5wcm90b3R5cGUuc2lnbiA9IGZ1bmN0aW9uICgpIHtcblx0dmFyIHNpZyA9IG5hY2wuc2lnbi5kZXRhY2hlZChcblx0ICAgIG5ldyBVaW50OEFycmF5KEJ1ZmZlci5jb25jYXQodGhpcy5jaHVua3MpKSxcblx0ICAgIG5ldyBVaW50OEFycmF5KEJ1ZmZlci5jb25jYXQoW1xuXHRcdHRoaXMua2V5LnBhcnQuay5kYXRhLCB0aGlzLmtleS5wYXJ0LkEuZGF0YV0pKSk7XG5cdHZhciBzaWdCdWYgPSBCdWZmZXIuZnJvbShzaWcpO1xuXHR2YXIgc2lnT2JqID0gU2lnbmF0dXJlLnBhcnNlKHNpZ0J1ZiwgJ2VkMjU1MTknLCAncmF3Jyk7XG5cdHNpZ09iai5oYXNoQWxnb3JpdGhtID0gJ3NoYTUxMic7XG5cdHJldHVybiAoc2lnT2JqKTtcbn07XG4iLCIvLyBDb3B5cmlnaHQgMjAxNyBKb3llbnQsIEluYy5cblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdHJlYWQ6IHJlYWQsXG5cdHdyaXRlOiB3cml0ZVxufTtcblxudmFyIGFzc2VydCA9IHJlcXVpcmUoJ2Fzc2VydC1wbHVzJyk7XG52YXIgQnVmZmVyID0gcmVxdWlyZSgnc2FmZXItYnVmZmVyJykuQnVmZmVyO1xudmFyIEtleSA9IHJlcXVpcmUoJy4uL2tleScpO1xudmFyIFByaXZhdGVLZXkgPSByZXF1aXJlKCcuLi9wcml2YXRlLWtleScpO1xudmFyIHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbHMnKTtcbnZhciBTU0hCdWZmZXIgPSByZXF1aXJlKCcuLi9zc2gtYnVmZmVyJyk7XG52YXIgRGhlID0gcmVxdWlyZSgnLi4vZGhlJyk7XG5cbnZhciBzdXBwb3J0ZWRBbGdvcyA9IHtcblx0J3JzYS1zaGExJyA6IDUsXG5cdCdyc2Etc2hhMjU2JyA6IDgsXG5cdCdyc2Etc2hhNTEyJyA6IDEwLFxuXHQnZWNkc2EtcDI1Ni1zaGEyNTYnIDogMTMsXG5cdCdlY2RzYS1wMzg0LXNoYTM4NCcgOiAxNFxuXHQvKlxuXHQgKiBlZDI1NTE5IGlzIGh5cG90aGV0aWNhbGx5IHN1cHBvcnRlZCB3aXRoIGlkIDE1XG5cdCAqIGJ1dCB0aGUgY29tbW9uIHRvb2xzIGF2YWlsYWJsZSBkb24ndCBhcHBlYXIgdG8gYmVcblx0ICogY2FwYWJsZSBvZiBnZW5lcmF0aW5nL3VzaW5nIGVkMjU1MTkga2V5c1xuXHQgKi9cbn07XG5cbnZhciBzdXBwb3J0ZWRBbGdvc0J5SWQgPSB7fTtcbk9iamVjdC5rZXlzKHN1cHBvcnRlZEFsZ29zKS5mb3JFYWNoKGZ1bmN0aW9uIChrKSB7XG5cdHN1cHBvcnRlZEFsZ29zQnlJZFtzdXBwb3J0ZWRBbGdvc1trXV0gPSBrLnRvVXBwZXJDYXNlKCk7XG59KTtcblxuZnVuY3Rpb24gcmVhZChidWYsIG9wdGlvbnMpIHtcblx0aWYgKHR5cGVvZiAoYnVmKSAhPT0gJ3N0cmluZycpIHtcblx0XHRhc3NlcnQuYnVmZmVyKGJ1ZiwgJ2J1ZicpO1xuXHRcdGJ1ZiA9IGJ1Zi50b1N0cmluZygnYXNjaWknKTtcblx0fVxuXHR2YXIgbGluZXMgPSBidWYuc3BsaXQoJ1xcbicpO1xuXHRpZiAobGluZXNbMF0ubWF0Y2goL15Qcml2YXRlLWtleS1mb3JtYXRcXDogdjEvKSkge1xuXHRcdHZhciBhbGdFbGVtcyA9IGxpbmVzWzFdLnNwbGl0KCcgJyk7XG5cdFx0dmFyIGFsZ29OdW0gPSBwYXJzZUludChhbGdFbGVtc1sxXSwgMTApO1xuXHRcdHZhciBhbGdvTmFtZSA9IGFsZ0VsZW1zWzJdO1xuXHRcdGlmICghc3VwcG9ydGVkQWxnb3NCeUlkW2FsZ29OdW1dKVxuXHRcdFx0dGhyb3cgKG5ldyBFcnJvcignVW5zdXBwb3J0ZWQgYWxnb3JpdGhtOiAnICsgYWxnb05hbWUpKTtcblx0XHRyZXR1cm4gKHJlYWRETlNTRUNQcml2YXRlS2V5KGFsZ29OdW0sIGxpbmVzLnNsaWNlKDIpKSk7XG5cdH1cblxuXHQvLyBza2lwIGFueSBjb21tZW50LWxpbmVzXG5cdHZhciBsaW5lID0gMDtcblx0LyogSlNTVFlMRUQgKi9cblx0d2hpbGUgKGxpbmVzW2xpbmVdLm1hdGNoKC9eXFw7LykpXG5cdFx0bGluZSsrO1xuXHQvLyB3ZSBzaG91bGQgbm93IGhhdmUgKm9uZSBzaW5nbGUqIGxpbmUgbGVmdCB3aXRoIG91ciBLRVkgb24gaXQuXG5cdGlmICgobGluZXNbbGluZV0ubWF0Y2goL1xcLiBJTiBLRVkgLykgfHxcblx0ICAgIGxpbmVzW2xpbmVdLm1hdGNoKC9cXC4gSU4gRE5TS0VZIC8pKSAmJiBsaW5lc1tsaW5lKzFdLmxlbmd0aCA9PT0gMCkge1xuXHRcdHJldHVybiAocmVhZFJGQzMxMTAobGluZXNbbGluZV0pKTtcblx0fVxuXHR0aHJvdyAobmV3IEVycm9yKCdDYW5ub3QgcGFyc2UgZG5zc2VjIGtleScpKTtcbn1cblxuZnVuY3Rpb24gcmVhZFJGQzMxMTAoa2V5U3RyaW5nKSB7XG5cdHZhciBlbGVtcyA9IGtleVN0cmluZy5zcGxpdCgnICcpO1xuXHQvL3VudXNlZCB2YXIgZmxhZ3MgPSBwYXJzZUludChlbGVtc1szXSwgMTApO1xuXHQvL3VudXNlZCB2YXIgcHJvdG9jb2wgPSBwYXJzZUludChlbGVtc1s0XSwgMTApO1xuXHR2YXIgYWxnb3JpdGhtID0gcGFyc2VJbnQoZWxlbXNbNV0sIDEwKTtcblx0aWYgKCFzdXBwb3J0ZWRBbGdvc0J5SWRbYWxnb3JpdGhtXSlcblx0XHR0aHJvdyAobmV3IEVycm9yKCdVbnN1cHBvcnRlZCBhbGdvcml0aG06ICcgKyBhbGdvcml0aG0pKTtcblx0dmFyIGJhc2U2NGtleSA9IGVsZW1zLnNsaWNlKDYsIGVsZW1zLmxlbmd0aCkuam9pbigpO1xuXHR2YXIga2V5QnVmZmVyID0gQnVmZmVyLmZyb20oYmFzZTY0a2V5LCAnYmFzZTY0Jyk7XG5cdGlmIChzdXBwb3J0ZWRBbGdvc0J5SWRbYWxnb3JpdGhtXS5tYXRjaCgvXlJTQS0vKSkge1xuXHRcdC8vIGpvaW4gdGhlIHJlc3Qgb2YgdGhlIGJvZHkgaW50byBhIHNpbmdsZSBiYXNlNjQtYmxvYlxuXHRcdHZhciBwdWJsaWNFeHBvbmVudExlbiA9IGtleUJ1ZmZlci5yZWFkVUludDgoMCk7XG5cdFx0aWYgKHB1YmxpY0V4cG9uZW50TGVuICE9IDMgJiYgcHVibGljRXhwb25lbnRMZW4gIT0gMSlcblx0XHRcdHRocm93IChuZXcgRXJyb3IoJ0Nhbm5vdCBwYXJzZSBkbnNzZWMga2V5OiAnICtcblx0XHRcdCAgICAndW5zdXBwb3J0ZWQgZXhwb25lbnQgbGVuZ3RoJykpO1xuXG5cdFx0dmFyIHB1YmxpY0V4cG9uZW50ID0ga2V5QnVmZmVyLnNsaWNlKDEsIHB1YmxpY0V4cG9uZW50TGVuKzEpO1xuXHRcdHB1YmxpY0V4cG9uZW50ID0gdXRpbHMubXBOb3JtYWxpemUocHVibGljRXhwb25lbnQpO1xuXHRcdHZhciBtb2R1bHVzID0ga2V5QnVmZmVyLnNsaWNlKDErcHVibGljRXhwb25lbnRMZW4pO1xuXHRcdG1vZHVsdXMgPSB1dGlscy5tcE5vcm1hbGl6ZShtb2R1bHVzKTtcblx0XHQvLyBub3csIG1ha2UgdGhlIGtleVxuXHRcdHZhciByc2FLZXkgPSB7XG5cdFx0XHR0eXBlOiAncnNhJyxcblx0XHRcdHBhcnRzOiBbXVxuXHRcdH07XG5cdFx0cnNhS2V5LnBhcnRzLnB1c2goeyBuYW1lOiAnZScsIGRhdGE6IHB1YmxpY0V4cG9uZW50fSk7XG5cdFx0cnNhS2V5LnBhcnRzLnB1c2goeyBuYW1lOiAnbicsIGRhdGE6IG1vZHVsdXN9KTtcblx0XHRyZXR1cm4gKG5ldyBLZXkocnNhS2V5KSk7XG5cdH1cblx0aWYgKHN1cHBvcnRlZEFsZ29zQnlJZFthbGdvcml0aG1dID09PSAnRUNEU0EtUDM4NC1TSEEzODQnIHx8XG5cdCAgICBzdXBwb3J0ZWRBbGdvc0J5SWRbYWxnb3JpdGhtXSA9PT0gJ0VDRFNBLVAyNTYtU0hBMjU2Jykge1xuXHRcdHZhciBjdXJ2ZSA9ICduaXN0cDM4NCc7XG5cdFx0dmFyIHNpemUgPSAzODQ7XG5cdFx0aWYgKHN1cHBvcnRlZEFsZ29zQnlJZFthbGdvcml0aG1dLm1hdGNoKC9eRUNEU0EtUDI1Ni1TSEEyNTYvKSkge1xuXHRcdFx0Y3VydmUgPSAnbmlzdHAyNTYnO1xuXHRcdFx0c2l6ZSA9IDI1Njtcblx0XHR9XG5cblx0XHR2YXIgZWNkc2FLZXkgPSB7XG5cdFx0XHR0eXBlOiAnZWNkc2EnLFxuXHRcdFx0Y3VydmU6IGN1cnZlLFxuXHRcdFx0c2l6ZTogc2l6ZSxcblx0XHRcdHBhcnRzOiBbXG5cdFx0XHRcdHtuYW1lOiAnY3VydmUnLCBkYXRhOiBCdWZmZXIuZnJvbShjdXJ2ZSkgfSxcblx0XHRcdFx0e25hbWU6ICdRJywgZGF0YTogdXRpbHMuZWNOb3JtYWxpemUoa2V5QnVmZmVyKSB9XG5cdFx0XHRdXG5cdFx0fTtcblx0XHRyZXR1cm4gKG5ldyBLZXkoZWNkc2FLZXkpKTtcblx0fVxuXHR0aHJvdyAobmV3IEVycm9yKCdVbnN1cHBvcnRlZCBhbGdvcml0aG06ICcgK1xuXHQgICAgc3VwcG9ydGVkQWxnb3NCeUlkW2FsZ29yaXRobV0pKTtcbn1cblxuZnVuY3Rpb24gZWxlbWVudFRvQnVmKGUpIHtcblx0cmV0dXJuIChCdWZmZXIuZnJvbShlLnNwbGl0KCcgJylbMV0sICdiYXNlNjQnKSk7XG59XG5cbmZ1bmN0aW9uIHJlYWRETlNTRUNSU0FQcml2YXRlS2V5KGVsZW1lbnRzKSB7XG5cdHZhciByc2FQYXJhbXMgPSB7fTtcblx0ZWxlbWVudHMuZm9yRWFjaChmdW5jdGlvbiAoZWxlbWVudCkge1xuXHRcdGlmIChlbGVtZW50LnNwbGl0KCcgJylbMF0gPT09ICdNb2R1bHVzOicpXG5cdFx0XHRyc2FQYXJhbXNbJ24nXSA9IGVsZW1lbnRUb0J1ZihlbGVtZW50KTtcblx0XHRlbHNlIGlmIChlbGVtZW50LnNwbGl0KCcgJylbMF0gPT09ICdQdWJsaWNFeHBvbmVudDonKVxuXHRcdFx0cnNhUGFyYW1zWydlJ10gPSBlbGVtZW50VG9CdWYoZWxlbWVudCk7XG5cdFx0ZWxzZSBpZiAoZWxlbWVudC5zcGxpdCgnICcpWzBdID09PSAnUHJpdmF0ZUV4cG9uZW50OicpXG5cdFx0XHRyc2FQYXJhbXNbJ2QnXSA9IGVsZW1lbnRUb0J1ZihlbGVtZW50KTtcblx0XHRlbHNlIGlmIChlbGVtZW50LnNwbGl0KCcgJylbMF0gPT09ICdQcmltZTE6Jylcblx0XHRcdHJzYVBhcmFtc1sncCddID0gZWxlbWVudFRvQnVmKGVsZW1lbnQpO1xuXHRcdGVsc2UgaWYgKGVsZW1lbnQuc3BsaXQoJyAnKVswXSA9PT0gJ1ByaW1lMjonKVxuXHRcdFx0cnNhUGFyYW1zWydxJ10gPSBlbGVtZW50VG9CdWYoZWxlbWVudCk7XG5cdFx0ZWxzZSBpZiAoZWxlbWVudC5zcGxpdCgnICcpWzBdID09PSAnRXhwb25lbnQxOicpXG5cdFx0XHRyc2FQYXJhbXNbJ2Rtb2RwJ10gPSBlbGVtZW50VG9CdWYoZWxlbWVudCk7XG5cdFx0ZWxzZSBpZiAoZWxlbWVudC5zcGxpdCgnICcpWzBdID09PSAnRXhwb25lbnQyOicpXG5cdFx0XHRyc2FQYXJhbXNbJ2Rtb2RxJ10gPSBlbGVtZW50VG9CdWYoZWxlbWVudCk7XG5cdFx0ZWxzZSBpZiAoZWxlbWVudC5zcGxpdCgnICcpWzBdID09PSAnQ29lZmZpY2llbnQ6Jylcblx0XHRcdHJzYVBhcmFtc1snaXFtcCddID0gZWxlbWVudFRvQnVmKGVsZW1lbnQpO1xuXHR9KTtcblx0Ly8gbm93LCBtYWtlIHRoZSBrZXlcblx0dmFyIGtleSA9IHtcblx0XHR0eXBlOiAncnNhJyxcblx0XHRwYXJ0czogW1xuXHRcdFx0eyBuYW1lOiAnZScsIGRhdGE6IHV0aWxzLm1wTm9ybWFsaXplKHJzYVBhcmFtc1snZSddKX0sXG5cdFx0XHR7IG5hbWU6ICduJywgZGF0YTogdXRpbHMubXBOb3JtYWxpemUocnNhUGFyYW1zWyduJ10pfSxcblx0XHRcdHsgbmFtZTogJ2QnLCBkYXRhOiB1dGlscy5tcE5vcm1hbGl6ZShyc2FQYXJhbXNbJ2QnXSl9LFxuXHRcdFx0eyBuYW1lOiAncCcsIGRhdGE6IHV0aWxzLm1wTm9ybWFsaXplKHJzYVBhcmFtc1sncCddKX0sXG5cdFx0XHR7IG5hbWU6ICdxJywgZGF0YTogdXRpbHMubXBOb3JtYWxpemUocnNhUGFyYW1zWydxJ10pfSxcblx0XHRcdHsgbmFtZTogJ2Rtb2RwJyxcblx0XHRcdCAgICBkYXRhOiB1dGlscy5tcE5vcm1hbGl6ZShyc2FQYXJhbXNbJ2Rtb2RwJ10pfSxcblx0XHRcdHsgbmFtZTogJ2Rtb2RxJyxcblx0XHRcdCAgICBkYXRhOiB1dGlscy5tcE5vcm1hbGl6ZShyc2FQYXJhbXNbJ2Rtb2RxJ10pfSxcblx0XHRcdHsgbmFtZTogJ2lxbXAnLFxuXHRcdFx0ICAgIGRhdGE6IHV0aWxzLm1wTm9ybWFsaXplKHJzYVBhcmFtc1snaXFtcCddKX1cblx0XHRdXG5cdH07XG5cdHJldHVybiAobmV3IFByaXZhdGVLZXkoa2V5KSk7XG59XG5cbmZ1bmN0aW9uIHJlYWRETlNTRUNQcml2YXRlS2V5KGFsZywgZWxlbWVudHMpIHtcblx0aWYgKHN1cHBvcnRlZEFsZ29zQnlJZFthbGddLm1hdGNoKC9eUlNBLS8pKSB7XG5cdFx0cmV0dXJuIChyZWFkRE5TU0VDUlNBUHJpdmF0ZUtleShlbGVtZW50cykpO1xuXHR9XG5cdGlmIChzdXBwb3J0ZWRBbGdvc0J5SWRbYWxnXSA9PT0gJ0VDRFNBLVAzODQtU0hBMzg0JyB8fFxuXHQgICAgc3VwcG9ydGVkQWxnb3NCeUlkW2FsZ10gPT09ICdFQ0RTQS1QMjU2LVNIQTI1NicpIHtcblx0XHR2YXIgZCA9IEJ1ZmZlci5mcm9tKGVsZW1lbnRzWzBdLnNwbGl0KCcgJylbMV0sICdiYXNlNjQnKTtcblx0XHR2YXIgY3VydmUgPSAnbmlzdHAzODQnO1xuXHRcdHZhciBzaXplID0gMzg0O1xuXHRcdGlmIChzdXBwb3J0ZWRBbGdvc0J5SWRbYWxnXSA9PT0gJ0VDRFNBLVAyNTYtU0hBMjU2Jykge1xuXHRcdFx0Y3VydmUgPSAnbmlzdHAyNTYnO1xuXHRcdFx0c2l6ZSA9IDI1Njtcblx0XHR9XG5cdFx0Ly8gRE5TU0VDIGdlbmVyYXRlcyB0aGUgcHVibGljLWtleSBvbiB0aGUgZmx5IChnbyBjYWxjdWxhdGUgaXQpXG5cdFx0dmFyIHB1YmxpY0tleSA9IHV0aWxzLnB1YmxpY0Zyb21Qcml2YXRlRUNEU0EoY3VydmUsIGQpO1xuXHRcdHZhciBRID0gcHVibGljS2V5LnBhcnRbJ1EnXS5kYXRhO1xuXHRcdHZhciBlY2RzYUtleSA9IHtcblx0XHRcdHR5cGU6ICdlY2RzYScsXG5cdFx0XHRjdXJ2ZTogY3VydmUsXG5cdFx0XHRzaXplOiBzaXplLFxuXHRcdFx0cGFydHM6IFtcblx0XHRcdFx0e25hbWU6ICdjdXJ2ZScsIGRhdGE6IEJ1ZmZlci5mcm9tKGN1cnZlKSB9LFxuXHRcdFx0XHR7bmFtZTogJ2QnLCBkYXRhOiBkIH0sXG5cdFx0XHRcdHtuYW1lOiAnUScsIGRhdGE6IFEgfVxuXHRcdFx0XVxuXHRcdH07XG5cdFx0cmV0dXJuIChuZXcgUHJpdmF0ZUtleShlY2RzYUtleSkpO1xuXHR9XG5cdHRocm93IChuZXcgRXJyb3IoJ1Vuc3VwcG9ydGVkIGFsZ29yaXRobTogJyArIHN1cHBvcnRlZEFsZ29zQnlJZFthbGddKSk7XG59XG5cbmZ1bmN0aW9uIGRuc3NlY1RpbWVzdGFtcChkYXRlKSB7XG5cdHZhciB5ZWFyID0gZGF0ZS5nZXRGdWxsWWVhcigpICsgJyc7IC8vc3RyaW5naWZ5XG5cdHZhciBtb250aCA9IChkYXRlLmdldE1vbnRoKCkgKyAxKTtcblx0dmFyIHRpbWVzdGFtcFN0ciA9IHllYXIgKyBtb250aCArIGRhdGUuZ2V0VVRDRGF0ZSgpO1xuXHR0aW1lc3RhbXBTdHIgKz0gJycgKyBkYXRlLmdldFVUQ0hvdXJzKCkgKyBkYXRlLmdldFVUQ01pbnV0ZXMoKTtcblx0dGltZXN0YW1wU3RyICs9IGRhdGUuZ2V0VVRDU2Vjb25kcygpO1xuXHRyZXR1cm4gKHRpbWVzdGFtcFN0cik7XG59XG5cbmZ1bmN0aW9uIHJzYUFsZ0Zyb21PcHRpb25zKG9wdHMpIHtcblx0aWYgKCFvcHRzIHx8ICFvcHRzLmhhc2hBbGdvIHx8IG9wdHMuaGFzaEFsZ28gPT09ICdzaGExJylcblx0XHRyZXR1cm4gKCc1IChSU0FTSEExKScpO1xuXHRlbHNlIGlmIChvcHRzLmhhc2hBbGdvID09PSAnc2hhMjU2Jylcblx0XHRyZXR1cm4gKCc4IChSU0FTSEEyNTYpJyk7XG5cdGVsc2UgaWYgKG9wdHMuaGFzaEFsZ28gPT09ICdzaGE1MTInKVxuXHRcdHJldHVybiAoJzEwIChSU0FTSEE1MTIpJyk7XG5cdGVsc2Vcblx0XHR0aHJvdyAobmV3IEVycm9yKCdVbmtub3duIG9yIHVuc3VwcG9ydGVkIGhhc2g6ICcgK1xuXHRcdCAgICBvcHRzLmhhc2hBbGdvKSk7XG59XG5cbmZ1bmN0aW9uIHdyaXRlUlNBKGtleSwgb3B0aW9ucykge1xuXHQvLyBpZiB3ZSdyZSBtaXNzaW5nIHBhcnRzLCBhZGQgdGhlbS5cblx0aWYgKCFrZXkucGFydC5kbW9kcCB8fCAha2V5LnBhcnQuZG1vZHEpIHtcblx0XHR1dGlscy5hZGRSU0FNaXNzaW5nKGtleSk7XG5cdH1cblxuXHR2YXIgb3V0ID0gJyc7XG5cdG91dCArPSAnUHJpdmF0ZS1rZXktZm9ybWF0OiB2MS4zXFxuJztcblx0b3V0ICs9ICdBbGdvcml0aG06ICcgKyByc2FBbGdGcm9tT3B0aW9ucyhvcHRpb25zKSArICdcXG4nO1xuXHR2YXIgbiA9IHV0aWxzLm1wRGVub3JtYWxpemUoa2V5LnBhcnRbJ24nXS5kYXRhKTtcblx0b3V0ICs9ICdNb2R1bHVzOiAnICsgbi50b1N0cmluZygnYmFzZTY0JykgKyAnXFxuJztcblx0dmFyIGUgPSB1dGlscy5tcERlbm9ybWFsaXplKGtleS5wYXJ0WydlJ10uZGF0YSk7XG5cdG91dCArPSAnUHVibGljRXhwb25lbnQ6ICcgKyBlLnRvU3RyaW5nKCdiYXNlNjQnKSArICdcXG4nO1xuXHR2YXIgZCA9IHV0aWxzLm1wRGVub3JtYWxpemUoa2V5LnBhcnRbJ2QnXS5kYXRhKTtcblx0b3V0ICs9ICdQcml2YXRlRXhwb25lbnQ6ICcgKyBkLnRvU3RyaW5nKCdiYXNlNjQnKSArICdcXG4nO1xuXHR2YXIgcCA9IHV0aWxzLm1wRGVub3JtYWxpemUoa2V5LnBhcnRbJ3AnXS5kYXRhKTtcblx0b3V0ICs9ICdQcmltZTE6ICcgKyBwLnRvU3RyaW5nKCdiYXNlNjQnKSArICdcXG4nO1xuXHR2YXIgcSA9IHV0aWxzLm1wRGVub3JtYWxpemUoa2V5LnBhcnRbJ3EnXS5kYXRhKTtcblx0b3V0ICs9ICdQcmltZTI6ICcgKyBxLnRvU3RyaW5nKCdiYXNlNjQnKSArICdcXG4nO1xuXHR2YXIgZG1vZHAgPSB1dGlscy5tcERlbm9ybWFsaXplKGtleS5wYXJ0WydkbW9kcCddLmRhdGEpO1xuXHRvdXQgKz0gJ0V4cG9uZW50MTogJyArIGRtb2RwLnRvU3RyaW5nKCdiYXNlNjQnKSArICdcXG4nO1xuXHR2YXIgZG1vZHEgPSB1dGlscy5tcERlbm9ybWFsaXplKGtleS5wYXJ0WydkbW9kcSddLmRhdGEpO1xuXHRvdXQgKz0gJ0V4cG9uZW50MjogJyArIGRtb2RxLnRvU3RyaW5nKCdiYXNlNjQnKSArICdcXG4nO1xuXHR2YXIgaXFtcCA9IHV0aWxzLm1wRGVub3JtYWxpemUoa2V5LnBhcnRbJ2lxbXAnXS5kYXRhKTtcblx0b3V0ICs9ICdDb2VmZmljaWVudDogJyArIGlxbXAudG9TdHJpbmcoJ2Jhc2U2NCcpICsgJ1xcbic7XG5cdC8vIEFzc3VtZSB0aGF0IHdlJ3JlIHZhbGlkIGFzLW9mIG5vd1xuXHR2YXIgdGltZXN0YW1wID0gbmV3IERhdGUoKTtcblx0b3V0ICs9ICdDcmVhdGVkOiAnICsgZG5zc2VjVGltZXN0YW1wKHRpbWVzdGFtcCkgKyAnXFxuJztcblx0b3V0ICs9ICdQdWJsaXNoOiAnICsgZG5zc2VjVGltZXN0YW1wKHRpbWVzdGFtcCkgKyAnXFxuJztcblx0b3V0ICs9ICdBY3RpdmF0ZTogJyArIGRuc3NlY1RpbWVzdGFtcCh0aW1lc3RhbXApICsgJ1xcbic7XG5cdHJldHVybiAoQnVmZmVyLmZyb20ob3V0LCAnYXNjaWknKSk7XG59XG5cbmZ1bmN0aW9uIHdyaXRlRUNEU0Eoa2V5LCBvcHRpb25zKSB7XG5cdHZhciBvdXQgPSAnJztcblx0b3V0ICs9ICdQcml2YXRlLWtleS1mb3JtYXQ6IHYxLjNcXG4nO1xuXG5cdGlmIChrZXkuY3VydmUgPT09ICduaXN0cDI1NicpIHtcblx0XHRvdXQgKz0gJ0FsZ29yaXRobTogMTMgKEVDRFNBUDI1NlNIQTI1NilcXG4nO1xuXHR9IGVsc2UgaWYgKGtleS5jdXJ2ZSA9PT0gJ25pc3RwMzg0Jykge1xuXHRcdG91dCArPSAnQWxnb3JpdGhtOiAxNCAoRUNEU0FQMzg0U0hBMzg0KVxcbic7XG5cdH0gZWxzZSB7XG5cdFx0dGhyb3cgKG5ldyBFcnJvcignVW5zdXBwb3J0ZWQgY3VydmUnKSk7XG5cdH1cblx0dmFyIGJhc2U2NEtleSA9IGtleS5wYXJ0WydkJ10uZGF0YS50b1N0cmluZygnYmFzZTY0Jyk7XG5cdG91dCArPSAnUHJpdmF0ZUtleTogJyArIGJhc2U2NEtleSArICdcXG4nO1xuXG5cdC8vIEFzc3VtZSB0aGF0IHdlJ3JlIHZhbGlkIGFzLW9mIG5vd1xuXHR2YXIgdGltZXN0YW1wID0gbmV3IERhdGUoKTtcblx0b3V0ICs9ICdDcmVhdGVkOiAnICsgZG5zc2VjVGltZXN0YW1wKHRpbWVzdGFtcCkgKyAnXFxuJztcblx0b3V0ICs9ICdQdWJsaXNoOiAnICsgZG5zc2VjVGltZXN0YW1wKHRpbWVzdGFtcCkgKyAnXFxuJztcblx0b3V0ICs9ICdBY3RpdmF0ZTogJyArIGRuc3NlY1RpbWVzdGFtcCh0aW1lc3RhbXApICsgJ1xcbic7XG5cblx0cmV0dXJuIChCdWZmZXIuZnJvbShvdXQsICdhc2NpaScpKTtcbn1cblxuZnVuY3Rpb24gd3JpdGUoa2V5LCBvcHRpb25zKSB7XG5cdGlmIChQcml2YXRlS2V5LmlzUHJpdmF0ZUtleShrZXkpKSB7XG5cdFx0aWYgKGtleS50eXBlID09PSAncnNhJykge1xuXHRcdFx0cmV0dXJuICh3cml0ZVJTQShrZXksIG9wdGlvbnMpKTtcblx0XHR9IGVsc2UgaWYgKGtleS50eXBlID09PSAnZWNkc2EnKSB7XG5cdFx0XHRyZXR1cm4gKHdyaXRlRUNEU0Eoa2V5LCBvcHRpb25zKSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRocm93IChuZXcgRXJyb3IoJ1Vuc3VwcG9ydGVkIGFsZ29yaXRobTogJyArIGtleS50eXBlKSk7XG5cdFx0fVxuXHR9IGVsc2UgaWYgKEtleS5pc0tleShrZXkpKSB7XG5cdFx0Lypcblx0XHQgKiBSRkMzMTEwIHJlcXVpcmVzIGEga2V5bmFtZSwgYW5kIGEga2V5dHlwZSwgd2hpY2ggd2Vcblx0XHQgKiBkb24ndCByZWFsbHkgaGF2ZSBhIG1lY2hhbmlzbSBmb3Igc3BlY2lmeWluZyBzdWNoXG5cdFx0ICogYWRkaXRpb25hbCBtZXRhZGF0YS5cblx0XHQgKi9cblx0XHR0aHJvdyAobmV3IEVycm9yKCdGb3JtYXQgXCJkbnNzZWNcIiBvbmx5IHN1cHBvcnRzICcgK1xuXHRcdCAgICAnd3JpdGluZyBwcml2YXRlIGtleXMnKSk7XG5cdH0gZWxzZSB7XG5cdFx0dGhyb3cgKG5ldyBFcnJvcigna2V5IGlzIG5vdCBhIEtleSBvciBQcml2YXRlS2V5JykpO1xuXHR9XG59XG4iLCIvLyBDb3B5cmlnaHQgMjAxOCBKb3llbnQsIEluYy5cblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdHJlYWQ6IHJlYWQsXG5cdHJlYWRQa2NzODogcmVhZFBrY3M4LFxuXHR3cml0ZTogd3JpdGUsXG5cdHdyaXRlUGtjczg6IHdyaXRlUGtjczgsXG5cdHBrY3M4VG9CdWZmZXI6IHBrY3M4VG9CdWZmZXIsXG5cblx0cmVhZEVDRFNBQ3VydmU6IHJlYWRFQ0RTQUN1cnZlLFxuXHR3cml0ZUVDRFNBQ3VydmU6IHdyaXRlRUNEU0FDdXJ2ZVxufTtcblxudmFyIGFzc2VydCA9IHJlcXVpcmUoJ2Fzc2VydC1wbHVzJyk7XG52YXIgYXNuMSA9IHJlcXVpcmUoJ2FzbjEnKTtcbnZhciBCdWZmZXIgPSByZXF1aXJlKCdzYWZlci1idWZmZXInKS5CdWZmZXI7XG52YXIgYWxncyA9IHJlcXVpcmUoJy4uL2FsZ3MnKTtcbnZhciB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWxzJyk7XG52YXIgS2V5ID0gcmVxdWlyZSgnLi4va2V5Jyk7XG52YXIgUHJpdmF0ZUtleSA9IHJlcXVpcmUoJy4uL3ByaXZhdGUta2V5Jyk7XG52YXIgcGVtID0gcmVxdWlyZSgnLi9wZW0nKTtcblxuZnVuY3Rpb24gcmVhZChidWYsIG9wdGlvbnMpIHtcblx0cmV0dXJuIChwZW0ucmVhZChidWYsIG9wdGlvbnMsICdwa2NzOCcpKTtcbn1cblxuZnVuY3Rpb24gd3JpdGUoa2V5LCBvcHRpb25zKSB7XG5cdHJldHVybiAocGVtLndyaXRlKGtleSwgb3B0aW9ucywgJ3BrY3M4JykpO1xufVxuXG4vKiBIZWxwZXIgdG8gcmVhZCBpbiBhIHNpbmdsZSBtcGludCAqL1xuZnVuY3Rpb24gcmVhZE1QSW50KGRlciwgbm0pIHtcblx0YXNzZXJ0LnN0cmljdEVxdWFsKGRlci5wZWVrKCksIGFzbjEuQmVyLkludGVnZXIsXG5cdCAgICBubSArICcgaXMgbm90IGFuIEludGVnZXInKTtcblx0cmV0dXJuICh1dGlscy5tcE5vcm1hbGl6ZShkZXIucmVhZFN0cmluZyhhc24xLkJlci5JbnRlZ2VyLCB0cnVlKSkpO1xufVxuXG5mdW5jdGlvbiByZWFkUGtjczgoYWxnLCB0eXBlLCBkZXIpIHtcblx0LyogUHJpdmF0ZSBrZXlzIGluIHBrY3MjOCBmb3JtYXQgaGF2ZSBhIHdlaXJkIGV4dHJhIGludCAqL1xuXHRpZiAoZGVyLnBlZWsoKSA9PT0gYXNuMS5CZXIuSW50ZWdlcikge1xuXHRcdGFzc2VydC5zdHJpY3RFcXVhbCh0eXBlLCAncHJpdmF0ZScsXG5cdFx0ICAgICd1bmV4cGVjdGVkIEludGVnZXIgYXQgc3RhcnQgb2YgcHVibGljIGtleScpO1xuXHRcdGRlci5yZWFkU3RyaW5nKGFzbjEuQmVyLkludGVnZXIsIHRydWUpO1xuXHR9XG5cblx0ZGVyLnJlYWRTZXF1ZW5jZSgpO1xuXHR2YXIgbmV4dCA9IGRlci5vZmZzZXQgKyBkZXIubGVuZ3RoO1xuXG5cdHZhciBvaWQgPSBkZXIucmVhZE9JRCgpO1xuXHRzd2l0Y2ggKG9pZCkge1xuXHRjYXNlICcxLjIuODQwLjExMzU0OS4xLjEuMSc6XG5cdFx0ZGVyLl9vZmZzZXQgPSBuZXh0O1xuXHRcdGlmICh0eXBlID09PSAncHVibGljJylcblx0XHRcdHJldHVybiAocmVhZFBrY3M4UlNBUHVibGljKGRlcikpO1xuXHRcdGVsc2Vcblx0XHRcdHJldHVybiAocmVhZFBrY3M4UlNBUHJpdmF0ZShkZXIpKTtcblx0Y2FzZSAnMS4yLjg0MC4xMDA0MC40LjEnOlxuXHRcdGlmICh0eXBlID09PSAncHVibGljJylcblx0XHRcdHJldHVybiAocmVhZFBrY3M4RFNBUHVibGljKGRlcikpO1xuXHRcdGVsc2Vcblx0XHRcdHJldHVybiAocmVhZFBrY3M4RFNBUHJpdmF0ZShkZXIpKTtcblx0Y2FzZSAnMS4yLjg0MC4xMDA0NS4yLjEnOlxuXHRcdGlmICh0eXBlID09PSAncHVibGljJylcblx0XHRcdHJldHVybiAocmVhZFBrY3M4RUNEU0FQdWJsaWMoZGVyKSk7XG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIChyZWFkUGtjczhFQ0RTQVByaXZhdGUoZGVyKSk7XG5cdGNhc2UgJzEuMy4xMDEuMTEyJzpcblx0XHRpZiAodHlwZSA9PT0gJ3B1YmxpYycpIHtcblx0XHRcdHJldHVybiAocmVhZFBrY3M4RWREU0FQdWJsaWMoZGVyKSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiAocmVhZFBrY3M4RWREU0FQcml2YXRlKGRlcikpO1xuXHRcdH1cblx0Y2FzZSAnMS4zLjEwMS4xMTAnOlxuXHRcdGlmICh0eXBlID09PSAncHVibGljJykge1xuXHRcdFx0cmV0dXJuIChyZWFkUGtjczhYMjU1MTlQdWJsaWMoZGVyKSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiAocmVhZFBrY3M4WDI1NTE5UHJpdmF0ZShkZXIpKTtcblx0XHR9XG5cdGRlZmF1bHQ6XG5cdFx0dGhyb3cgKG5ldyBFcnJvcignVW5rbm93biBrZXkgdHlwZSBPSUQgJyArIG9pZCkpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHJlYWRQa2NzOFJTQVB1YmxpYyhkZXIpIHtcblx0Ly8gYml0IHN0cmluZyBzZXF1ZW5jZVxuXHRkZXIucmVhZFNlcXVlbmNlKGFzbjEuQmVyLkJpdFN0cmluZyk7XG5cdGRlci5yZWFkQnl0ZSgpO1xuXHRkZXIucmVhZFNlcXVlbmNlKCk7XG5cblx0Ly8gbW9kdWx1c1xuXHR2YXIgbiA9IHJlYWRNUEludChkZXIsICdtb2R1bHVzJyk7XG5cdHZhciBlID0gcmVhZE1QSW50KGRlciwgJ2V4cG9uZW50Jyk7XG5cblx0Ly8gbm93LCBtYWtlIHRoZSBrZXlcblx0dmFyIGtleSA9IHtcblx0XHR0eXBlOiAncnNhJyxcblx0XHRzb3VyY2U6IGRlci5vcmlnaW5hbElucHV0LFxuXHRcdHBhcnRzOiBbXG5cdFx0XHR7IG5hbWU6ICdlJywgZGF0YTogZSB9LFxuXHRcdFx0eyBuYW1lOiAnbicsIGRhdGE6IG4gfVxuXHRcdF1cblx0fTtcblxuXHRyZXR1cm4gKG5ldyBLZXkoa2V5KSk7XG59XG5cbmZ1bmN0aW9uIHJlYWRQa2NzOFJTQVByaXZhdGUoZGVyKSB7XG5cdGRlci5yZWFkU2VxdWVuY2UoYXNuMS5CZXIuT2N0ZXRTdHJpbmcpO1xuXHRkZXIucmVhZFNlcXVlbmNlKCk7XG5cblx0dmFyIHZlciA9IHJlYWRNUEludChkZXIsICd2ZXJzaW9uJyk7XG5cdGFzc2VydC5lcXVhbCh2ZXJbMF0sIDB4MCwgJ3Vua25vd24gUlNBIHByaXZhdGUga2V5IHZlcnNpb24nKTtcblxuXHQvLyBtb2R1bHVzIHRoZW4gcHVibGljIGV4cG9uZW50XG5cdHZhciBuID0gcmVhZE1QSW50KGRlciwgJ21vZHVsdXMnKTtcblx0dmFyIGUgPSByZWFkTVBJbnQoZGVyLCAncHVibGljIGV4cG9uZW50Jyk7XG5cdHZhciBkID0gcmVhZE1QSW50KGRlciwgJ3ByaXZhdGUgZXhwb25lbnQnKTtcblx0dmFyIHAgPSByZWFkTVBJbnQoZGVyLCAncHJpbWUxJyk7XG5cdHZhciBxID0gcmVhZE1QSW50KGRlciwgJ3ByaW1lMicpO1xuXHR2YXIgZG1vZHAgPSByZWFkTVBJbnQoZGVyLCAnZXhwb25lbnQxJyk7XG5cdHZhciBkbW9kcSA9IHJlYWRNUEludChkZXIsICdleHBvbmVudDInKTtcblx0dmFyIGlxbXAgPSByZWFkTVBJbnQoZGVyLCAnaXFtcCcpO1xuXG5cdC8vIG5vdywgbWFrZSB0aGUga2V5XG5cdHZhciBrZXkgPSB7XG5cdFx0dHlwZTogJ3JzYScsXG5cdFx0cGFydHM6IFtcblx0XHRcdHsgbmFtZTogJ24nLCBkYXRhOiBuIH0sXG5cdFx0XHR7IG5hbWU6ICdlJywgZGF0YTogZSB9LFxuXHRcdFx0eyBuYW1lOiAnZCcsIGRhdGE6IGQgfSxcblx0XHRcdHsgbmFtZTogJ2lxbXAnLCBkYXRhOiBpcW1wIH0sXG5cdFx0XHR7IG5hbWU6ICdwJywgZGF0YTogcCB9LFxuXHRcdFx0eyBuYW1lOiAncScsIGRhdGE6IHEgfSxcblx0XHRcdHsgbmFtZTogJ2Rtb2RwJywgZGF0YTogZG1vZHAgfSxcblx0XHRcdHsgbmFtZTogJ2Rtb2RxJywgZGF0YTogZG1vZHEgfVxuXHRcdF1cblx0fTtcblxuXHRyZXR1cm4gKG5ldyBQcml2YXRlS2V5KGtleSkpO1xufVxuXG5mdW5jdGlvbiByZWFkUGtjczhEU0FQdWJsaWMoZGVyKSB7XG5cdGRlci5yZWFkU2VxdWVuY2UoKTtcblxuXHR2YXIgcCA9IHJlYWRNUEludChkZXIsICdwJyk7XG5cdHZhciBxID0gcmVhZE1QSW50KGRlciwgJ3EnKTtcblx0dmFyIGcgPSByZWFkTVBJbnQoZGVyLCAnZycpO1xuXG5cdC8vIGJpdCBzdHJpbmcgc2VxdWVuY2Vcblx0ZGVyLnJlYWRTZXF1ZW5jZShhc24xLkJlci5CaXRTdHJpbmcpO1xuXHRkZXIucmVhZEJ5dGUoKTtcblxuXHR2YXIgeSA9IHJlYWRNUEludChkZXIsICd5Jyk7XG5cblx0Ly8gbm93LCBtYWtlIHRoZSBrZXlcblx0dmFyIGtleSA9IHtcblx0XHR0eXBlOiAnZHNhJyxcblx0XHRwYXJ0czogW1xuXHRcdFx0eyBuYW1lOiAncCcsIGRhdGE6IHAgfSxcblx0XHRcdHsgbmFtZTogJ3EnLCBkYXRhOiBxIH0sXG5cdFx0XHR7IG5hbWU6ICdnJywgZGF0YTogZyB9LFxuXHRcdFx0eyBuYW1lOiAneScsIGRhdGE6IHkgfVxuXHRcdF1cblx0fTtcblxuXHRyZXR1cm4gKG5ldyBLZXkoa2V5KSk7XG59XG5cbmZ1bmN0aW9uIHJlYWRQa2NzOERTQVByaXZhdGUoZGVyKSB7XG5cdGRlci5yZWFkU2VxdWVuY2UoKTtcblxuXHR2YXIgcCA9IHJlYWRNUEludChkZXIsICdwJyk7XG5cdHZhciBxID0gcmVhZE1QSW50KGRlciwgJ3EnKTtcblx0dmFyIGcgPSByZWFkTVBJbnQoZGVyLCAnZycpO1xuXG5cdGRlci5yZWFkU2VxdWVuY2UoYXNuMS5CZXIuT2N0ZXRTdHJpbmcpO1xuXHR2YXIgeCA9IHJlYWRNUEludChkZXIsICd4Jyk7XG5cblx0LyogVGhlIHBrY3MjOCBmb3JtYXQgZG9lcyBub3QgaW5jbHVkZSB0aGUgcHVibGljIGtleSAqL1xuXHR2YXIgeSA9IHV0aWxzLmNhbGN1bGF0ZURTQVB1YmxpYyhnLCBwLCB4KTtcblxuXHR2YXIga2V5ID0ge1xuXHRcdHR5cGU6ICdkc2EnLFxuXHRcdHBhcnRzOiBbXG5cdFx0XHR7IG5hbWU6ICdwJywgZGF0YTogcCB9LFxuXHRcdFx0eyBuYW1lOiAncScsIGRhdGE6IHEgfSxcblx0XHRcdHsgbmFtZTogJ2cnLCBkYXRhOiBnIH0sXG5cdFx0XHR7IG5hbWU6ICd5JywgZGF0YTogeSB9LFxuXHRcdFx0eyBuYW1lOiAneCcsIGRhdGE6IHggfVxuXHRcdF1cblx0fTtcblxuXHRyZXR1cm4gKG5ldyBQcml2YXRlS2V5KGtleSkpO1xufVxuXG5mdW5jdGlvbiByZWFkRUNEU0FDdXJ2ZShkZXIpIHtcblx0dmFyIGN1cnZlTmFtZSwgY3VydmVOYW1lcztcblx0dmFyIGosIGMsIGNkO1xuXG5cdGlmIChkZXIucGVlaygpID09PSBhc24xLkJlci5PSUQpIHtcblx0XHR2YXIgb2lkID0gZGVyLnJlYWRPSUQoKTtcblxuXHRcdGN1cnZlTmFtZXMgPSBPYmplY3Qua2V5cyhhbGdzLmN1cnZlcyk7XG5cdFx0Zm9yIChqID0gMDsgaiA8IGN1cnZlTmFtZXMubGVuZ3RoOyArK2opIHtcblx0XHRcdGMgPSBjdXJ2ZU5hbWVzW2pdO1xuXHRcdFx0Y2QgPSBhbGdzLmN1cnZlc1tjXTtcblx0XHRcdGlmIChjZC5wa2NzOG9pZCA9PT0gb2lkKSB7XG5cdFx0XHRcdGN1cnZlTmFtZSA9IGM7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblxuXHR9IGVsc2Uge1xuXHRcdC8vIEVDUGFyYW1ldGVycyBzZXF1ZW5jZVxuXHRcdGRlci5yZWFkU2VxdWVuY2UoKTtcblx0XHR2YXIgdmVyc2lvbiA9IGRlci5yZWFkU3RyaW5nKGFzbjEuQmVyLkludGVnZXIsIHRydWUpO1xuXHRcdGFzc2VydC5zdHJpY3RFcXVhbCh2ZXJzaW9uWzBdLCAxLCAnRUNEU0Ega2V5IG5vdCB2ZXJzaW9uIDEnKTtcblxuXHRcdHZhciBjdXJ2ZSA9IHt9O1xuXG5cdFx0Ly8gRmllbGRJRCBzZXF1ZW5jZVxuXHRcdGRlci5yZWFkU2VxdWVuY2UoKTtcblx0XHR2YXIgZmllbGRUeXBlT2lkID0gZGVyLnJlYWRPSUQoKTtcblx0XHRhc3NlcnQuc3RyaWN0RXF1YWwoZmllbGRUeXBlT2lkLCAnMS4yLjg0MC4xMDA0NS4xLjEnLFxuXHRcdCAgICAnRUNEU0Ega2V5IGlzIG5vdCBmcm9tIGEgcHJpbWUtZmllbGQnKTtcblx0XHR2YXIgcCA9IGN1cnZlLnAgPSB1dGlscy5tcE5vcm1hbGl6ZShcblx0XHQgICAgZGVyLnJlYWRTdHJpbmcoYXNuMS5CZXIuSW50ZWdlciwgdHJ1ZSkpO1xuXHRcdC8qXG5cdFx0ICogcCBhbHdheXMgc3RhcnRzIHdpdGggYSAxIGJpdCwgc28gY291bnQgdGhlIHplcm9zIHRvIGdldCBpdHNcblx0XHQgKiByZWFsIHNpemUuXG5cdFx0ICovXG5cdFx0Y3VydmUuc2l6ZSA9IHAubGVuZ3RoICogOCAtIHV0aWxzLmNvdW50WmVyb3MocCk7XG5cblx0XHQvLyBDdXJ2ZSBzZXF1ZW5jZVxuXHRcdGRlci5yZWFkU2VxdWVuY2UoKTtcblx0XHRjdXJ2ZS5hID0gdXRpbHMubXBOb3JtYWxpemUoXG5cdFx0ICAgIGRlci5yZWFkU3RyaW5nKGFzbjEuQmVyLk9jdGV0U3RyaW5nLCB0cnVlKSk7XG5cdFx0Y3VydmUuYiA9IHV0aWxzLm1wTm9ybWFsaXplKFxuXHRcdCAgICBkZXIucmVhZFN0cmluZyhhc24xLkJlci5PY3RldFN0cmluZywgdHJ1ZSkpO1xuXHRcdGlmIChkZXIucGVlaygpID09PSBhc24xLkJlci5CaXRTdHJpbmcpXG5cdFx0XHRjdXJ2ZS5zID0gZGVyLnJlYWRTdHJpbmcoYXNuMS5CZXIuQml0U3RyaW5nLCB0cnVlKTtcblxuXHRcdC8vIENvbWJpbmVkIEd4IGFuZCBHeVxuXHRcdGN1cnZlLkcgPSBkZXIucmVhZFN0cmluZyhhc24xLkJlci5PY3RldFN0cmluZywgdHJ1ZSk7XG5cdFx0YXNzZXJ0LnN0cmljdEVxdWFsKGN1cnZlLkdbMF0sIDB4NCxcblx0XHQgICAgJ3VuY29tcHJlc3NlZCBHIGlzIHJlcXVpcmVkJyk7XG5cblx0XHRjdXJ2ZS5uID0gdXRpbHMubXBOb3JtYWxpemUoXG5cdFx0ICAgIGRlci5yZWFkU3RyaW5nKGFzbjEuQmVyLkludGVnZXIsIHRydWUpKTtcblx0XHRjdXJ2ZS5oID0gdXRpbHMubXBOb3JtYWxpemUoXG5cdFx0ICAgIGRlci5yZWFkU3RyaW5nKGFzbjEuQmVyLkludGVnZXIsIHRydWUpKTtcblx0XHRhc3NlcnQuc3RyaWN0RXF1YWwoY3VydmUuaFswXSwgMHgxLCAnYSBjb2ZhY3Rvcj0xIGN1cnZlIGlzICcgK1xuXHRcdCAgICAncmVxdWlyZWQnKTtcblxuXHRcdGN1cnZlTmFtZXMgPSBPYmplY3Qua2V5cyhhbGdzLmN1cnZlcyk7XG5cdFx0dmFyIGtzID0gT2JqZWN0LmtleXMoY3VydmUpO1xuXHRcdGZvciAoaiA9IDA7IGogPCBjdXJ2ZU5hbWVzLmxlbmd0aDsgKytqKSB7XG5cdFx0XHRjID0gY3VydmVOYW1lc1tqXTtcblx0XHRcdGNkID0gYWxncy5jdXJ2ZXNbY107XG5cdFx0XHR2YXIgZXF1YWwgPSB0cnVlO1xuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBrcy5sZW5ndGg7ICsraSkge1xuXHRcdFx0XHR2YXIgayA9IGtzW2ldO1xuXHRcdFx0XHRpZiAoY2Rba10gPT09IHVuZGVmaW5lZClcblx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0aWYgKHR5cGVvZiAoY2Rba10pID09PSAnb2JqZWN0JyAmJlxuXHRcdFx0XHQgICAgY2Rba10uZXF1YWxzICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRpZiAoIWNkW2tdLmVxdWFscyhjdXJ2ZVtrXSkpIHtcblx0XHRcdFx0XHRcdGVxdWFsID0gZmFsc2U7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSBpZiAoQnVmZmVyLmlzQnVmZmVyKGNkW2tdKSkge1xuXHRcdFx0XHRcdGlmIChjZFtrXS50b1N0cmluZygnYmluYXJ5Jylcblx0XHRcdFx0XHQgICAgIT09IGN1cnZlW2tdLnRvU3RyaW5nKCdiaW5hcnknKSkge1xuXHRcdFx0XHRcdFx0ZXF1YWwgPSBmYWxzZTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRpZiAoY2Rba10gIT09IGN1cnZlW2tdKSB7XG5cdFx0XHRcdFx0XHRlcXVhbCA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRpZiAoZXF1YWwpIHtcblx0XHRcdFx0Y3VydmVOYW1lID0gYztcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cdHJldHVybiAoY3VydmVOYW1lKTtcbn1cblxuZnVuY3Rpb24gcmVhZFBrY3M4RUNEU0FQcml2YXRlKGRlcikge1xuXHR2YXIgY3VydmVOYW1lID0gcmVhZEVDRFNBQ3VydmUoZGVyKTtcblx0YXNzZXJ0LnN0cmluZyhjdXJ2ZU5hbWUsICdhIGtub3duIGVsbGlwdGljIGN1cnZlJyk7XG5cblx0ZGVyLnJlYWRTZXF1ZW5jZShhc24xLkJlci5PY3RldFN0cmluZyk7XG5cdGRlci5yZWFkU2VxdWVuY2UoKTtcblxuXHR2YXIgdmVyc2lvbiA9IHJlYWRNUEludChkZXIsICd2ZXJzaW9uJyk7XG5cdGFzc2VydC5lcXVhbCh2ZXJzaW9uWzBdLCAxLCAndW5rbm93biB2ZXJzaW9uIG9mIEVDRFNBIGtleScpO1xuXG5cdHZhciBkID0gZGVyLnJlYWRTdHJpbmcoYXNuMS5CZXIuT2N0ZXRTdHJpbmcsIHRydWUpO1xuXHR2YXIgUTtcblxuXHRpZiAoZGVyLnBlZWsoKSA9PSAweGEwKSB7XG5cdFx0ZGVyLnJlYWRTZXF1ZW5jZSgweGEwKTtcblx0XHRkZXIuX29mZnNldCArPSBkZXIubGVuZ3RoO1xuXHR9XG5cdGlmIChkZXIucGVlaygpID09IDB4YTEpIHtcblx0XHRkZXIucmVhZFNlcXVlbmNlKDB4YTEpO1xuXHRcdFEgPSBkZXIucmVhZFN0cmluZyhhc24xLkJlci5CaXRTdHJpbmcsIHRydWUpO1xuXHRcdFEgPSB1dGlscy5lY05vcm1hbGl6ZShRKTtcblx0fVxuXG5cdGlmIChRID09PSB1bmRlZmluZWQpIHtcblx0XHR2YXIgcHViID0gdXRpbHMucHVibGljRnJvbVByaXZhdGVFQ0RTQShjdXJ2ZU5hbWUsIGQpO1xuXHRcdFEgPSBwdWIucGFydC5RLmRhdGE7XG5cdH1cblxuXHR2YXIga2V5ID0ge1xuXHRcdHR5cGU6ICdlY2RzYScsXG5cdFx0cGFydHM6IFtcblx0XHRcdHsgbmFtZTogJ2N1cnZlJywgZGF0YTogQnVmZmVyLmZyb20oY3VydmVOYW1lKSB9LFxuXHRcdFx0eyBuYW1lOiAnUScsIGRhdGE6IFEgfSxcblx0XHRcdHsgbmFtZTogJ2QnLCBkYXRhOiBkIH1cblx0XHRdXG5cdH07XG5cblx0cmV0dXJuIChuZXcgUHJpdmF0ZUtleShrZXkpKTtcbn1cblxuZnVuY3Rpb24gcmVhZFBrY3M4RUNEU0FQdWJsaWMoZGVyKSB7XG5cdHZhciBjdXJ2ZU5hbWUgPSByZWFkRUNEU0FDdXJ2ZShkZXIpO1xuXHRhc3NlcnQuc3RyaW5nKGN1cnZlTmFtZSwgJ2Ega25vd24gZWxsaXB0aWMgY3VydmUnKTtcblxuXHR2YXIgUSA9IGRlci5yZWFkU3RyaW5nKGFzbjEuQmVyLkJpdFN0cmluZywgdHJ1ZSk7XG5cdFEgPSB1dGlscy5lY05vcm1hbGl6ZShRKTtcblxuXHR2YXIga2V5ID0ge1xuXHRcdHR5cGU6ICdlY2RzYScsXG5cdFx0cGFydHM6IFtcblx0XHRcdHsgbmFtZTogJ2N1cnZlJywgZGF0YTogQnVmZmVyLmZyb20oY3VydmVOYW1lKSB9LFxuXHRcdFx0eyBuYW1lOiAnUScsIGRhdGE6IFEgfVxuXHRcdF1cblx0fTtcblxuXHRyZXR1cm4gKG5ldyBLZXkoa2V5KSk7XG59XG5cbmZ1bmN0aW9uIHJlYWRQa2NzOEVkRFNBUHVibGljKGRlcikge1xuXHRpZiAoZGVyLnBlZWsoKSA9PT0gMHgwMClcblx0XHRkZXIucmVhZEJ5dGUoKTtcblxuXHR2YXIgQSA9IHV0aWxzLnJlYWRCaXRTdHJpbmcoZGVyKTtcblxuXHR2YXIga2V5ID0ge1xuXHRcdHR5cGU6ICdlZDI1NTE5Jyxcblx0XHRwYXJ0czogW1xuXHRcdFx0eyBuYW1lOiAnQScsIGRhdGE6IHV0aWxzLnplcm9QYWRUb0xlbmd0aChBLCAzMikgfVxuXHRcdF1cblx0fTtcblxuXHRyZXR1cm4gKG5ldyBLZXkoa2V5KSk7XG59XG5cbmZ1bmN0aW9uIHJlYWRQa2NzOFgyNTUxOVB1YmxpYyhkZXIpIHtcblx0dmFyIEEgPSB1dGlscy5yZWFkQml0U3RyaW5nKGRlcik7XG5cblx0dmFyIGtleSA9IHtcblx0XHR0eXBlOiAnY3VydmUyNTUxOScsXG5cdFx0cGFydHM6IFtcblx0XHRcdHsgbmFtZTogJ0EnLCBkYXRhOiB1dGlscy56ZXJvUGFkVG9MZW5ndGgoQSwgMzIpIH1cblx0XHRdXG5cdH07XG5cblx0cmV0dXJuIChuZXcgS2V5KGtleSkpO1xufVxuXG5mdW5jdGlvbiByZWFkUGtjczhFZERTQVByaXZhdGUoZGVyKSB7XG5cdGlmIChkZXIucGVlaygpID09PSAweDAwKVxuXHRcdGRlci5yZWFkQnl0ZSgpO1xuXG5cdGRlci5yZWFkU2VxdWVuY2UoYXNuMS5CZXIuT2N0ZXRTdHJpbmcpO1xuXHR2YXIgayA9IGRlci5yZWFkU3RyaW5nKGFzbjEuQmVyLk9jdGV0U3RyaW5nLCB0cnVlKTtcblx0ayA9IHV0aWxzLnplcm9QYWRUb0xlbmd0aChrLCAzMik7XG5cblx0dmFyIEE7XG5cdGlmIChkZXIucGVlaygpID09PSBhc24xLkJlci5CaXRTdHJpbmcpIHtcblx0XHRBID0gdXRpbHMucmVhZEJpdFN0cmluZyhkZXIpO1xuXHRcdEEgPSB1dGlscy56ZXJvUGFkVG9MZW5ndGgoQSwgMzIpO1xuXHR9IGVsc2Uge1xuXHRcdEEgPSB1dGlscy5jYWxjdWxhdGVFRDI1NTE5UHVibGljKGspO1xuXHR9XG5cblx0dmFyIGtleSA9IHtcblx0XHR0eXBlOiAnZWQyNTUxOScsXG5cdFx0cGFydHM6IFtcblx0XHRcdHsgbmFtZTogJ0EnLCBkYXRhOiB1dGlscy56ZXJvUGFkVG9MZW5ndGgoQSwgMzIpIH0sXG5cdFx0XHR7IG5hbWU6ICdrJywgZGF0YTogdXRpbHMuemVyb1BhZFRvTGVuZ3RoKGssIDMyKSB9XG5cdFx0XVxuXHR9O1xuXG5cdHJldHVybiAobmV3IFByaXZhdGVLZXkoa2V5KSk7XG59XG5cbmZ1bmN0aW9uIHJlYWRQa2NzOFgyNTUxOVByaXZhdGUoZGVyKSB7XG5cdGlmIChkZXIucGVlaygpID09PSAweDAwKVxuXHRcdGRlci5yZWFkQnl0ZSgpO1xuXG5cdGRlci5yZWFkU2VxdWVuY2UoYXNuMS5CZXIuT2N0ZXRTdHJpbmcpO1xuXHR2YXIgayA9IGRlci5yZWFkU3RyaW5nKGFzbjEuQmVyLk9jdGV0U3RyaW5nLCB0cnVlKTtcblx0ayA9IHV0aWxzLnplcm9QYWRUb0xlbmd0aChrLCAzMik7XG5cblx0dmFyIEEgPSB1dGlscy5jYWxjdWxhdGVYMjU1MTlQdWJsaWMoayk7XG5cblx0dmFyIGtleSA9IHtcblx0XHR0eXBlOiAnY3VydmUyNTUxOScsXG5cdFx0cGFydHM6IFtcblx0XHRcdHsgbmFtZTogJ0EnLCBkYXRhOiB1dGlscy56ZXJvUGFkVG9MZW5ndGgoQSwgMzIpIH0sXG5cdFx0XHR7IG5hbWU6ICdrJywgZGF0YTogdXRpbHMuemVyb1BhZFRvTGVuZ3RoKGssIDMyKSB9XG5cdFx0XVxuXHR9O1xuXG5cdHJldHVybiAobmV3IFByaXZhdGVLZXkoa2V5KSk7XG59XG5cbmZ1bmN0aW9uIHBrY3M4VG9CdWZmZXIoa2V5KSB7XG5cdHZhciBkZXIgPSBuZXcgYXNuMS5CZXJXcml0ZXIoKTtcblx0d3JpdGVQa2NzOChkZXIsIGtleSk7XG5cdHJldHVybiAoZGVyLmJ1ZmZlcik7XG59XG5cbmZ1bmN0aW9uIHdyaXRlUGtjczgoZGVyLCBrZXkpIHtcblx0ZGVyLnN0YXJ0U2VxdWVuY2UoKTtcblxuXHRpZiAoUHJpdmF0ZUtleS5pc1ByaXZhdGVLZXkoa2V5KSkge1xuXHRcdHZhciBzaWxseUludCA9IEJ1ZmZlci5mcm9tKFswXSk7XG5cdFx0ZGVyLndyaXRlQnVmZmVyKHNpbGx5SW50LCBhc24xLkJlci5JbnRlZ2VyKTtcblx0fVxuXG5cdGRlci5zdGFydFNlcXVlbmNlKCk7XG5cdHN3aXRjaCAoa2V5LnR5cGUpIHtcblx0Y2FzZSAncnNhJzpcblx0XHRkZXIud3JpdGVPSUQoJzEuMi44NDAuMTEzNTQ5LjEuMS4xJyk7XG5cdFx0aWYgKFByaXZhdGVLZXkuaXNQcml2YXRlS2V5KGtleSkpXG5cdFx0XHR3cml0ZVBrY3M4UlNBUHJpdmF0ZShrZXksIGRlcik7XG5cdFx0ZWxzZVxuXHRcdFx0d3JpdGVQa2NzOFJTQVB1YmxpYyhrZXksIGRlcik7XG5cdFx0YnJlYWs7XG5cdGNhc2UgJ2RzYSc6XG5cdFx0ZGVyLndyaXRlT0lEKCcxLjIuODQwLjEwMDQwLjQuMScpO1xuXHRcdGlmIChQcml2YXRlS2V5LmlzUHJpdmF0ZUtleShrZXkpKVxuXHRcdFx0d3JpdGVQa2NzOERTQVByaXZhdGUoa2V5LCBkZXIpO1xuXHRcdGVsc2Vcblx0XHRcdHdyaXRlUGtjczhEU0FQdWJsaWMoa2V5LCBkZXIpO1xuXHRcdGJyZWFrO1xuXHRjYXNlICdlY2RzYSc6XG5cdFx0ZGVyLndyaXRlT0lEKCcxLjIuODQwLjEwMDQ1LjIuMScpO1xuXHRcdGlmIChQcml2YXRlS2V5LmlzUHJpdmF0ZUtleShrZXkpKVxuXHRcdFx0d3JpdGVQa2NzOEVDRFNBUHJpdmF0ZShrZXksIGRlcik7XG5cdFx0ZWxzZVxuXHRcdFx0d3JpdGVQa2NzOEVDRFNBUHVibGljKGtleSwgZGVyKTtcblx0XHRicmVhaztcblx0Y2FzZSAnZWQyNTUxOSc6XG5cdFx0ZGVyLndyaXRlT0lEKCcxLjMuMTAxLjExMicpO1xuXHRcdGlmIChQcml2YXRlS2V5LmlzUHJpdmF0ZUtleShrZXkpKVxuXHRcdFx0dGhyb3cgKG5ldyBFcnJvcignRWQyNTUxOSBwcml2YXRlIGtleXMgaW4gcGtjczggJyArXG5cdFx0XHQgICAgJ2Zvcm1hdCBhcmUgbm90IHN1cHBvcnRlZCcpKTtcblx0XHR3cml0ZVBrY3M4RWREU0FQdWJsaWMoa2V5LCBkZXIpO1xuXHRcdGJyZWFrO1xuXHRkZWZhdWx0OlxuXHRcdHRocm93IChuZXcgRXJyb3IoJ1Vuc3VwcG9ydGVkIGtleSB0eXBlOiAnICsga2V5LnR5cGUpKTtcblx0fVxuXG5cdGRlci5lbmRTZXF1ZW5jZSgpO1xufVxuXG5mdW5jdGlvbiB3cml0ZVBrY3M4UlNBUHJpdmF0ZShrZXksIGRlcikge1xuXHRkZXIud3JpdGVOdWxsKCk7XG5cdGRlci5lbmRTZXF1ZW5jZSgpO1xuXG5cdGRlci5zdGFydFNlcXVlbmNlKGFzbjEuQmVyLk9jdGV0U3RyaW5nKTtcblx0ZGVyLnN0YXJ0U2VxdWVuY2UoKTtcblxuXHR2YXIgdmVyc2lvbiA9IEJ1ZmZlci5mcm9tKFswXSk7XG5cdGRlci53cml0ZUJ1ZmZlcih2ZXJzaW9uLCBhc24xLkJlci5JbnRlZ2VyKTtcblxuXHRkZXIud3JpdGVCdWZmZXIoa2V5LnBhcnQubi5kYXRhLCBhc24xLkJlci5JbnRlZ2VyKTtcblx0ZGVyLndyaXRlQnVmZmVyKGtleS5wYXJ0LmUuZGF0YSwgYXNuMS5CZXIuSW50ZWdlcik7XG5cdGRlci53cml0ZUJ1ZmZlcihrZXkucGFydC5kLmRhdGEsIGFzbjEuQmVyLkludGVnZXIpO1xuXHRkZXIud3JpdGVCdWZmZXIoa2V5LnBhcnQucC5kYXRhLCBhc24xLkJlci5JbnRlZ2VyKTtcblx0ZGVyLndyaXRlQnVmZmVyKGtleS5wYXJ0LnEuZGF0YSwgYXNuMS5CZXIuSW50ZWdlcik7XG5cdGlmICgha2V5LnBhcnQuZG1vZHAgfHwgIWtleS5wYXJ0LmRtb2RxKVxuXHRcdHV0aWxzLmFkZFJTQU1pc3Npbmcoa2V5KTtcblx0ZGVyLndyaXRlQnVmZmVyKGtleS5wYXJ0LmRtb2RwLmRhdGEsIGFzbjEuQmVyLkludGVnZXIpO1xuXHRkZXIud3JpdGVCdWZmZXIoa2V5LnBhcnQuZG1vZHEuZGF0YSwgYXNuMS5CZXIuSW50ZWdlcik7XG5cdGRlci53cml0ZUJ1ZmZlcihrZXkucGFydC5pcW1wLmRhdGEsIGFzbjEuQmVyLkludGVnZXIpO1xuXG5cdGRlci5lbmRTZXF1ZW5jZSgpO1xuXHRkZXIuZW5kU2VxdWVuY2UoKTtcbn1cblxuZnVuY3Rpb24gd3JpdGVQa2NzOFJTQVB1YmxpYyhrZXksIGRlcikge1xuXHRkZXIud3JpdGVOdWxsKCk7XG5cdGRlci5lbmRTZXF1ZW5jZSgpO1xuXG5cdGRlci5zdGFydFNlcXVlbmNlKGFzbjEuQmVyLkJpdFN0cmluZyk7XG5cdGRlci53cml0ZUJ5dGUoMHgwMCk7XG5cblx0ZGVyLnN0YXJ0U2VxdWVuY2UoKTtcblx0ZGVyLndyaXRlQnVmZmVyKGtleS5wYXJ0Lm4uZGF0YSwgYXNuMS5CZXIuSW50ZWdlcik7XG5cdGRlci53cml0ZUJ1ZmZlcihrZXkucGFydC5lLmRhdGEsIGFzbjEuQmVyLkludGVnZXIpO1xuXHRkZXIuZW5kU2VxdWVuY2UoKTtcblxuXHRkZXIuZW5kU2VxdWVuY2UoKTtcbn1cblxuZnVuY3Rpb24gd3JpdGVQa2NzOERTQVByaXZhdGUoa2V5LCBkZXIpIHtcblx0ZGVyLnN0YXJ0U2VxdWVuY2UoKTtcblx0ZGVyLndyaXRlQnVmZmVyKGtleS5wYXJ0LnAuZGF0YSwgYXNuMS5CZXIuSW50ZWdlcik7XG5cdGRlci53cml0ZUJ1ZmZlcihrZXkucGFydC5xLmRhdGEsIGFzbjEuQmVyLkludGVnZXIpO1xuXHRkZXIud3JpdGVCdWZmZXIoa2V5LnBhcnQuZy5kYXRhLCBhc24xLkJlci5JbnRlZ2VyKTtcblx0ZGVyLmVuZFNlcXVlbmNlKCk7XG5cblx0ZGVyLmVuZFNlcXVlbmNlKCk7XG5cblx0ZGVyLnN0YXJ0U2VxdWVuY2UoYXNuMS5CZXIuT2N0ZXRTdHJpbmcpO1xuXHRkZXIud3JpdGVCdWZmZXIoa2V5LnBhcnQueC5kYXRhLCBhc24xLkJlci5JbnRlZ2VyKTtcblx0ZGVyLmVuZFNlcXVlbmNlKCk7XG59XG5cbmZ1bmN0aW9uIHdyaXRlUGtjczhEU0FQdWJsaWMoa2V5LCBkZXIpIHtcblx0ZGVyLnN0YXJ0U2VxdWVuY2UoKTtcblx0ZGVyLndyaXRlQnVmZmVyKGtleS5wYXJ0LnAuZGF0YSwgYXNuMS5CZXIuSW50ZWdlcik7XG5cdGRlci53cml0ZUJ1ZmZlcihrZXkucGFydC5xLmRhdGEsIGFzbjEuQmVyLkludGVnZXIpO1xuXHRkZXIud3JpdGVCdWZmZXIoa2V5LnBhcnQuZy5kYXRhLCBhc24xLkJlci5JbnRlZ2VyKTtcblx0ZGVyLmVuZFNlcXVlbmNlKCk7XG5cdGRlci5lbmRTZXF1ZW5jZSgpO1xuXG5cdGRlci5zdGFydFNlcXVlbmNlKGFzbjEuQmVyLkJpdFN0cmluZyk7XG5cdGRlci53cml0ZUJ5dGUoMHgwMCk7XG5cdGRlci53cml0ZUJ1ZmZlcihrZXkucGFydC55LmRhdGEsIGFzbjEuQmVyLkludGVnZXIpO1xuXHRkZXIuZW5kU2VxdWVuY2UoKTtcbn1cblxuZnVuY3Rpb24gd3JpdGVFQ0RTQUN1cnZlKGtleSwgZGVyKSB7XG5cdHZhciBjdXJ2ZSA9IGFsZ3MuY3VydmVzW2tleS5jdXJ2ZV07XG5cdGlmIChjdXJ2ZS5wa2NzOG9pZCkge1xuXHRcdC8qIFRoaXMgb25lIGhhcyBhIG5hbWUgaW4gcGtjcyM4LCBzbyBqdXN0IHdyaXRlIHRoZSBvaWQgKi9cblx0XHRkZXIud3JpdGVPSUQoY3VydmUucGtjczhvaWQpO1xuXG5cdH0gZWxzZSB7XG5cdFx0Ly8gRUNQYXJhbWV0ZXJzIHNlcXVlbmNlXG5cdFx0ZGVyLnN0YXJ0U2VxdWVuY2UoKTtcblxuXHRcdHZhciB2ZXJzaW9uID0gQnVmZmVyLmZyb20oWzFdKTtcblx0XHRkZXIud3JpdGVCdWZmZXIodmVyc2lvbiwgYXNuMS5CZXIuSW50ZWdlcik7XG5cblx0XHQvLyBGaWVsZElEIHNlcXVlbmNlXG5cdFx0ZGVyLnN0YXJ0U2VxdWVuY2UoKTtcblx0XHRkZXIud3JpdGVPSUQoJzEuMi44NDAuMTAwNDUuMS4xJyk7IC8vIHByaW1lLWZpZWxkXG5cdFx0ZGVyLndyaXRlQnVmZmVyKGN1cnZlLnAsIGFzbjEuQmVyLkludGVnZXIpO1xuXHRcdGRlci5lbmRTZXF1ZW5jZSgpO1xuXG5cdFx0Ly8gQ3VydmUgc2VxdWVuY2Vcblx0XHRkZXIuc3RhcnRTZXF1ZW5jZSgpO1xuXHRcdHZhciBhID0gY3VydmUucDtcblx0XHRpZiAoYVswXSA9PT0gMHgwKVxuXHRcdFx0YSA9IGEuc2xpY2UoMSk7XG5cdFx0ZGVyLndyaXRlQnVmZmVyKGEsIGFzbjEuQmVyLk9jdGV0U3RyaW5nKTtcblx0XHRkZXIud3JpdGVCdWZmZXIoY3VydmUuYiwgYXNuMS5CZXIuT2N0ZXRTdHJpbmcpO1xuXHRcdGRlci53cml0ZUJ1ZmZlcihjdXJ2ZS5zLCBhc24xLkJlci5CaXRTdHJpbmcpO1xuXHRcdGRlci5lbmRTZXF1ZW5jZSgpO1xuXG5cdFx0ZGVyLndyaXRlQnVmZmVyKGN1cnZlLkcsIGFzbjEuQmVyLk9jdGV0U3RyaW5nKTtcblx0XHRkZXIud3JpdGVCdWZmZXIoY3VydmUubiwgYXNuMS5CZXIuSW50ZWdlcik7XG5cdFx0dmFyIGggPSBjdXJ2ZS5oO1xuXHRcdGlmICghaCkge1xuXHRcdFx0aCA9IEJ1ZmZlci5mcm9tKFsxXSk7XG5cdFx0fVxuXHRcdGRlci53cml0ZUJ1ZmZlcihoLCBhc24xLkJlci5JbnRlZ2VyKTtcblxuXHRcdC8vIEVDUGFyYW1ldGVyc1xuXHRcdGRlci5lbmRTZXF1ZW5jZSgpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHdyaXRlUGtjczhFQ0RTQVB1YmxpYyhrZXksIGRlcikge1xuXHR3cml0ZUVDRFNBQ3VydmUoa2V5LCBkZXIpO1xuXHRkZXIuZW5kU2VxdWVuY2UoKTtcblxuXHR2YXIgUSA9IHV0aWxzLmVjTm9ybWFsaXplKGtleS5wYXJ0LlEuZGF0YSwgdHJ1ZSk7XG5cdGRlci53cml0ZUJ1ZmZlcihRLCBhc24xLkJlci5CaXRTdHJpbmcpO1xufVxuXG5mdW5jdGlvbiB3cml0ZVBrY3M4RUNEU0FQcml2YXRlKGtleSwgZGVyKSB7XG5cdHdyaXRlRUNEU0FDdXJ2ZShrZXksIGRlcik7XG5cdGRlci5lbmRTZXF1ZW5jZSgpO1xuXG5cdGRlci5zdGFydFNlcXVlbmNlKGFzbjEuQmVyLk9jdGV0U3RyaW5nKTtcblx0ZGVyLnN0YXJ0U2VxdWVuY2UoKTtcblxuXHR2YXIgdmVyc2lvbiA9IEJ1ZmZlci5mcm9tKFsxXSk7XG5cdGRlci53cml0ZUJ1ZmZlcih2ZXJzaW9uLCBhc24xLkJlci5JbnRlZ2VyKTtcblxuXHRkZXIud3JpdGVCdWZmZXIoa2V5LnBhcnQuZC5kYXRhLCBhc24xLkJlci5PY3RldFN0cmluZyk7XG5cblx0ZGVyLnN0YXJ0U2VxdWVuY2UoMHhhMSk7XG5cdHZhciBRID0gdXRpbHMuZWNOb3JtYWxpemUoa2V5LnBhcnQuUS5kYXRhLCB0cnVlKTtcblx0ZGVyLndyaXRlQnVmZmVyKFEsIGFzbjEuQmVyLkJpdFN0cmluZyk7XG5cdGRlci5lbmRTZXF1ZW5jZSgpO1xuXG5cdGRlci5lbmRTZXF1ZW5jZSgpO1xuXHRkZXIuZW5kU2VxdWVuY2UoKTtcbn1cblxuZnVuY3Rpb24gd3JpdGVQa2NzOEVkRFNBUHVibGljKGtleSwgZGVyKSB7XG5cdGRlci5lbmRTZXF1ZW5jZSgpO1xuXG5cdHV0aWxzLndyaXRlQml0U3RyaW5nKGRlciwga2V5LnBhcnQuQS5kYXRhKTtcbn1cblxuZnVuY3Rpb24gd3JpdGVQa2NzOEVkRFNBUHJpdmF0ZShrZXksIGRlcikge1xuXHRkZXIuZW5kU2VxdWVuY2UoKTtcblxuXHR2YXIgayA9IHV0aWxzLm1wTm9ybWFsaXplKGtleS5wYXJ0LmsuZGF0YSwgdHJ1ZSk7XG5cdGRlci5zdGFydFNlcXVlbmNlKGFzbjEuQmVyLk9jdGV0U3RyaW5nKTtcblx0ZGVyLndyaXRlQnVmZmVyKGssIGFzbjEuQmVyLk9jdGV0U3RyaW5nKTtcblx0ZGVyLmVuZFNlcXVlbmNlKCk7XG59XG4iLCIvLyBDb3B5cmlnaHQgMjAxNSBKb3llbnQsIEluYy5cblxubW9kdWxlLmV4cG9ydHMgPSBTaWduYXR1cmU7XG5cbnZhciBhc3NlcnQgPSByZXF1aXJlKCdhc3NlcnQtcGx1cycpO1xudmFyIEJ1ZmZlciA9IHJlcXVpcmUoJ3NhZmVyLWJ1ZmZlcicpLkJ1ZmZlcjtcbnZhciBhbGdzID0gcmVxdWlyZSgnLi9hbGdzJyk7XG52YXIgY3J5cHRvID0gcmVxdWlyZSgnY3J5cHRvJyk7XG52YXIgZXJycyA9IHJlcXVpcmUoJy4vZXJyb3JzJyk7XG52YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XG52YXIgYXNuMSA9IHJlcXVpcmUoJ2FzbjEnKTtcbnZhciBTU0hCdWZmZXIgPSByZXF1aXJlKCcuL3NzaC1idWZmZXInKTtcblxudmFyIEludmFsaWRBbGdvcml0aG1FcnJvciA9IGVycnMuSW52YWxpZEFsZ29yaXRobUVycm9yO1xudmFyIFNpZ25hdHVyZVBhcnNlRXJyb3IgPSBlcnJzLlNpZ25hdHVyZVBhcnNlRXJyb3I7XG5cbmZ1bmN0aW9uIFNpZ25hdHVyZShvcHRzKSB7XG5cdGFzc2VydC5vYmplY3Qob3B0cywgJ29wdGlvbnMnKTtcblx0YXNzZXJ0LmFycmF5T2ZPYmplY3Qob3B0cy5wYXJ0cywgJ29wdGlvbnMucGFydHMnKTtcblx0YXNzZXJ0LnN0cmluZyhvcHRzLnR5cGUsICdvcHRpb25zLnR5cGUnKTtcblxuXHR2YXIgcGFydExvb2t1cCA9IHt9O1xuXHRmb3IgKHZhciBpID0gMDsgaSA8IG9wdHMucGFydHMubGVuZ3RoOyArK2kpIHtcblx0XHR2YXIgcGFydCA9IG9wdHMucGFydHNbaV07XG5cdFx0cGFydExvb2t1cFtwYXJ0Lm5hbWVdID0gcGFydDtcblx0fVxuXG5cdHRoaXMudHlwZSA9IG9wdHMudHlwZTtcblx0dGhpcy5oYXNoQWxnb3JpdGhtID0gb3B0cy5oYXNoQWxnbztcblx0dGhpcy5jdXJ2ZSA9IG9wdHMuY3VydmU7XG5cdHRoaXMucGFydHMgPSBvcHRzLnBhcnRzO1xuXHR0aGlzLnBhcnQgPSBwYXJ0TG9va3VwO1xufVxuXG5TaWduYXR1cmUucHJvdG90eXBlLnRvQnVmZmVyID0gZnVuY3Rpb24gKGZvcm1hdCkge1xuXHRpZiAoZm9ybWF0ID09PSB1bmRlZmluZWQpXG5cdFx0Zm9ybWF0ID0gJ2FzbjEnO1xuXHRhc3NlcnQuc3RyaW5nKGZvcm1hdCwgJ2Zvcm1hdCcpO1xuXG5cdHZhciBidWY7XG5cdHZhciBzdHlwZSA9ICdzc2gtJyArIHRoaXMudHlwZTtcblxuXHRzd2l0Y2ggKHRoaXMudHlwZSkge1xuXHRjYXNlICdyc2EnOlxuXHRcdHN3aXRjaCAodGhpcy5oYXNoQWxnb3JpdGhtKSB7XG5cdFx0Y2FzZSAnc2hhMjU2Jzpcblx0XHRcdHN0eXBlID0gJ3JzYS1zaGEyLTI1Nic7XG5cdFx0XHRicmVhaztcblx0XHRjYXNlICdzaGE1MTInOlxuXHRcdFx0c3R5cGUgPSAncnNhLXNoYTItNTEyJztcblx0XHRcdGJyZWFrO1xuXHRcdGNhc2UgJ3NoYTEnOlxuXHRcdGNhc2UgdW5kZWZpbmVkOlxuXHRcdFx0YnJlYWs7XG5cdFx0ZGVmYXVsdDpcblx0XHRcdHRocm93IChuZXcgRXJyb3IoJ1NTSCBzaWduYXR1cmUgJyArXG5cdFx0XHQgICAgJ2Zvcm1hdCBkb2VzIG5vdCBzdXBwb3J0IGhhc2ggJyArXG5cdFx0XHQgICAgJ2FsZ29yaXRobSAnICsgdGhpcy5oYXNoQWxnb3JpdGhtKSk7XG5cdFx0fVxuXHRcdGlmIChmb3JtYXQgPT09ICdzc2gnKSB7XG5cdFx0XHRidWYgPSBuZXcgU1NIQnVmZmVyKHt9KTtcblx0XHRcdGJ1Zi53cml0ZVN0cmluZyhzdHlwZSk7XG5cdFx0XHRidWYud3JpdGVQYXJ0KHRoaXMucGFydC5zaWcpO1xuXHRcdFx0cmV0dXJuIChidWYudG9CdWZmZXIoKSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiAodGhpcy5wYXJ0LnNpZy5kYXRhKTtcblx0XHR9XG5cdFx0YnJlYWs7XG5cblx0Y2FzZSAnZWQyNTUxOSc6XG5cdFx0aWYgKGZvcm1hdCA9PT0gJ3NzaCcpIHtcblx0XHRcdGJ1ZiA9IG5ldyBTU0hCdWZmZXIoe30pO1xuXHRcdFx0YnVmLndyaXRlU3RyaW5nKHN0eXBlKTtcblx0XHRcdGJ1Zi53cml0ZVBhcnQodGhpcy5wYXJ0LnNpZyk7XG5cdFx0XHRyZXR1cm4gKGJ1Zi50b0J1ZmZlcigpKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuICh0aGlzLnBhcnQuc2lnLmRhdGEpO1xuXHRcdH1cblx0XHRicmVhaztcblxuXHRjYXNlICdkc2EnOlxuXHRjYXNlICdlY2RzYSc6XG5cdFx0dmFyIHIsIHM7XG5cdFx0aWYgKGZvcm1hdCA9PT0gJ2FzbjEnKSB7XG5cdFx0XHR2YXIgZGVyID0gbmV3IGFzbjEuQmVyV3JpdGVyKCk7XG5cdFx0XHRkZXIuc3RhcnRTZXF1ZW5jZSgpO1xuXHRcdFx0ciA9IHV0aWxzLm1wTm9ybWFsaXplKHRoaXMucGFydC5yLmRhdGEpO1xuXHRcdFx0cyA9IHV0aWxzLm1wTm9ybWFsaXplKHRoaXMucGFydC5zLmRhdGEpO1xuXHRcdFx0ZGVyLndyaXRlQnVmZmVyKHIsIGFzbjEuQmVyLkludGVnZXIpO1xuXHRcdFx0ZGVyLndyaXRlQnVmZmVyKHMsIGFzbjEuQmVyLkludGVnZXIpO1xuXHRcdFx0ZGVyLmVuZFNlcXVlbmNlKCk7XG5cdFx0XHRyZXR1cm4gKGRlci5idWZmZXIpO1xuXHRcdH0gZWxzZSBpZiAoZm9ybWF0ID09PSAnc3NoJyAmJiB0aGlzLnR5cGUgPT09ICdkc2EnKSB7XG5cdFx0XHRidWYgPSBuZXcgU1NIQnVmZmVyKHt9KTtcblx0XHRcdGJ1Zi53cml0ZVN0cmluZygnc3NoLWRzcycpO1xuXHRcdFx0ciA9IHRoaXMucGFydC5yLmRhdGE7XG5cdFx0XHRpZiAoci5sZW5ndGggPiAyMCAmJiByWzBdID09PSAweDAwKVxuXHRcdFx0XHRyID0gci5zbGljZSgxKTtcblx0XHRcdHMgPSB0aGlzLnBhcnQucy5kYXRhO1xuXHRcdFx0aWYgKHMubGVuZ3RoID4gMjAgJiYgc1swXSA9PT0gMHgwMClcblx0XHRcdFx0cyA9IHMuc2xpY2UoMSk7XG5cdFx0XHRpZiAoKHRoaXMuaGFzaEFsZ29yaXRobSAmJlxuXHRcdFx0ICAgIHRoaXMuaGFzaEFsZ29yaXRobSAhPT0gJ3NoYTEnKSB8fFxuXHRcdFx0ICAgIHIubGVuZ3RoICsgcy5sZW5ndGggIT09IDQwKSB7XG5cdFx0XHRcdHRocm93IChuZXcgRXJyb3IoJ09wZW5TU0ggb25seSBzdXBwb3J0cyAnICtcblx0XHRcdFx0ICAgICdEU0Egc2lnbmF0dXJlcyB3aXRoIFNIQTEgaGFzaCcpKTtcblx0XHRcdH1cblx0XHRcdGJ1Zi53cml0ZUJ1ZmZlcihCdWZmZXIuY29uY2F0KFtyLCBzXSkpO1xuXHRcdFx0cmV0dXJuIChidWYudG9CdWZmZXIoKSk7XG5cdFx0fSBlbHNlIGlmIChmb3JtYXQgPT09ICdzc2gnICYmIHRoaXMudHlwZSA9PT0gJ2VjZHNhJykge1xuXHRcdFx0dmFyIGlubmVyID0gbmV3IFNTSEJ1ZmZlcih7fSk7XG5cdFx0XHRyID0gdGhpcy5wYXJ0LnIuZGF0YTtcblx0XHRcdGlubmVyLndyaXRlQnVmZmVyKHIpO1xuXHRcdFx0aW5uZXIud3JpdGVQYXJ0KHRoaXMucGFydC5zKTtcblxuXHRcdFx0YnVmID0gbmV3IFNTSEJ1ZmZlcih7fSk7XG5cdFx0XHQvKiBYWFg6IGZpbmQgYSBtb3JlIHByb3BlciB3YXkgdG8gZG8gdGhpcz8gKi9cblx0XHRcdHZhciBjdXJ2ZTtcblx0XHRcdGlmIChyWzBdID09PSAweDAwKVxuXHRcdFx0XHRyID0gci5zbGljZSgxKTtcblx0XHRcdHZhciBzeiA9IHIubGVuZ3RoICogODtcblx0XHRcdGlmIChzeiA9PT0gMjU2KVxuXHRcdFx0XHRjdXJ2ZSA9ICduaXN0cDI1Nic7XG5cdFx0XHRlbHNlIGlmIChzeiA9PT0gMzg0KVxuXHRcdFx0XHRjdXJ2ZSA9ICduaXN0cDM4NCc7XG5cdFx0XHRlbHNlIGlmIChzeiA9PT0gNTI4KVxuXHRcdFx0XHRjdXJ2ZSA9ICduaXN0cDUyMSc7XG5cdFx0XHRidWYud3JpdGVTdHJpbmcoJ2VjZHNhLXNoYTItJyArIGN1cnZlKTtcblx0XHRcdGJ1Zi53cml0ZUJ1ZmZlcihpbm5lci50b0J1ZmZlcigpKTtcblx0XHRcdHJldHVybiAoYnVmLnRvQnVmZmVyKCkpO1xuXHRcdH1cblx0XHR0aHJvdyAobmV3IEVycm9yKCdJbnZhbGlkIHNpZ25hdHVyZSBmb3JtYXQnKSk7XG5cdGRlZmF1bHQ6XG5cdFx0dGhyb3cgKG5ldyBFcnJvcignSW52YWxpZCBzaWduYXR1cmUgZGF0YScpKTtcblx0fVxufTtcblxuU2lnbmF0dXJlLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uIChmb3JtYXQpIHtcblx0YXNzZXJ0Lm9wdGlvbmFsU3RyaW5nKGZvcm1hdCwgJ2Zvcm1hdCcpO1xuXHRyZXR1cm4gKHRoaXMudG9CdWZmZXIoZm9ybWF0KS50b1N0cmluZygnYmFzZTY0JykpO1xufTtcblxuU2lnbmF0dXJlLnBhcnNlID0gZnVuY3Rpb24gKGRhdGEsIHR5cGUsIGZvcm1hdCkge1xuXHRpZiAodHlwZW9mIChkYXRhKSA9PT0gJ3N0cmluZycpXG5cdFx0ZGF0YSA9IEJ1ZmZlci5mcm9tKGRhdGEsICdiYXNlNjQnKTtcblx0YXNzZXJ0LmJ1ZmZlcihkYXRhLCAnZGF0YScpO1xuXHRhc3NlcnQuc3RyaW5nKGZvcm1hdCwgJ2Zvcm1hdCcpO1xuXHRhc3NlcnQuc3RyaW5nKHR5cGUsICd0eXBlJyk7XG5cblx0dmFyIG9wdHMgPSB7fTtcblx0b3B0cy50eXBlID0gdHlwZS50b0xvd2VyQ2FzZSgpO1xuXHRvcHRzLnBhcnRzID0gW107XG5cblx0dHJ5IHtcblx0XHRhc3NlcnQub2soZGF0YS5sZW5ndGggPiAwLCAnc2lnbmF0dXJlIG11c3Qgbm90IGJlIGVtcHR5Jyk7XG5cdFx0c3dpdGNoIChvcHRzLnR5cGUpIHtcblx0XHRjYXNlICdyc2EnOlxuXHRcdFx0cmV0dXJuIChwYXJzZU9uZU51bShkYXRhLCB0eXBlLCBmb3JtYXQsIG9wdHMpKTtcblx0XHRjYXNlICdlZDI1NTE5Jzpcblx0XHRcdHJldHVybiAocGFyc2VPbmVOdW0oZGF0YSwgdHlwZSwgZm9ybWF0LCBvcHRzKSk7XG5cblx0XHRjYXNlICdkc2EnOlxuXHRcdGNhc2UgJ2VjZHNhJzpcblx0XHRcdGlmIChmb3JtYXQgPT09ICdhc24xJylcblx0XHRcdFx0cmV0dXJuIChwYXJzZURTQWFzbjEoZGF0YSwgdHlwZSwgZm9ybWF0LCBvcHRzKSk7XG5cdFx0XHRlbHNlIGlmIChvcHRzLnR5cGUgPT09ICdkc2EnKVxuXHRcdFx0XHRyZXR1cm4gKHBhcnNlRFNBKGRhdGEsIHR5cGUsIGZvcm1hdCwgb3B0cykpO1xuXHRcdFx0ZWxzZVxuXHRcdFx0XHRyZXR1cm4gKHBhcnNlRUNEU0EoZGF0YSwgdHlwZSwgZm9ybWF0LCBvcHRzKSk7XG5cblx0XHRkZWZhdWx0OlxuXHRcdFx0dGhyb3cgKG5ldyBJbnZhbGlkQWxnb3JpdGhtRXJyb3IodHlwZSkpO1xuXHRcdH1cblxuXHR9IGNhdGNoIChlKSB7XG5cdFx0aWYgKGUgaW5zdGFuY2VvZiBJbnZhbGlkQWxnb3JpdGhtRXJyb3IpXG5cdFx0XHR0aHJvdyAoZSk7XG5cdFx0dGhyb3cgKG5ldyBTaWduYXR1cmVQYXJzZUVycm9yKHR5cGUsIGZvcm1hdCwgZSkpO1xuXHR9XG59O1xuXG5mdW5jdGlvbiBwYXJzZU9uZU51bShkYXRhLCB0eXBlLCBmb3JtYXQsIG9wdHMpIHtcblx0aWYgKGZvcm1hdCA9PT0gJ3NzaCcpIHtcblx0XHR0cnkge1xuXHRcdFx0dmFyIGJ1ZiA9IG5ldyBTU0hCdWZmZXIoe2J1ZmZlcjogZGF0YX0pO1xuXHRcdFx0dmFyIGhlYWQgPSBidWYucmVhZFN0cmluZygpO1xuXHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdC8qIGZhbGwgdGhyb3VnaCAqL1xuXHRcdH1cblx0XHRpZiAoYnVmICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdHZhciBtc2cgPSAnU1NIIHNpZ25hdHVyZSBkb2VzIG5vdCBtYXRjaCBleHBlY3RlZCAnICtcblx0XHRcdCAgICAndHlwZSAoZXhwZWN0ZWQgJyArIHR5cGUgKyAnLCBnb3QgJyArIGhlYWQgKyAnKSc7XG5cdFx0XHRzd2l0Y2ggKGhlYWQpIHtcblx0XHRcdGNhc2UgJ3NzaC1yc2EnOlxuXHRcdFx0XHRhc3NlcnQuc3RyaWN0RXF1YWwodHlwZSwgJ3JzYScsIG1zZyk7XG5cdFx0XHRcdG9wdHMuaGFzaEFsZ28gPSAnc2hhMSc7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSAncnNhLXNoYTItMjU2Jzpcblx0XHRcdFx0YXNzZXJ0LnN0cmljdEVxdWFsKHR5cGUsICdyc2EnLCBtc2cpO1xuXHRcdFx0XHRvcHRzLmhhc2hBbGdvID0gJ3NoYTI1Nic7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSAncnNhLXNoYTItNTEyJzpcblx0XHRcdFx0YXNzZXJ0LnN0cmljdEVxdWFsKHR5cGUsICdyc2EnLCBtc2cpO1xuXHRcdFx0XHRvcHRzLmhhc2hBbGdvID0gJ3NoYTUxMic7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSAnc3NoLWVkMjU1MTknOlxuXHRcdFx0XHRhc3NlcnQuc3RyaWN0RXF1YWwodHlwZSwgJ2VkMjU1MTknLCBtc2cpO1xuXHRcdFx0XHRvcHRzLmhhc2hBbGdvID0gJ3NoYTUxMic7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0dGhyb3cgKG5ldyBFcnJvcignVW5rbm93biBTU0ggc2lnbmF0dXJlICcgK1xuXHRcdFx0XHQgICAgJ3R5cGU6ICcgKyBoZWFkKSk7XG5cdFx0XHR9XG5cdFx0XHR2YXIgc2lnID0gYnVmLnJlYWRQYXJ0KCk7XG5cdFx0XHRhc3NlcnQub2soYnVmLmF0RW5kKCksICdleHRyYSB0cmFpbGluZyBieXRlcycpO1xuXHRcdFx0c2lnLm5hbWUgPSAnc2lnJztcblx0XHRcdG9wdHMucGFydHMucHVzaChzaWcpO1xuXHRcdFx0cmV0dXJuIChuZXcgU2lnbmF0dXJlKG9wdHMpKTtcblx0XHR9XG5cdH1cblx0b3B0cy5wYXJ0cy5wdXNoKHtuYW1lOiAnc2lnJywgZGF0YTogZGF0YX0pO1xuXHRyZXR1cm4gKG5ldyBTaWduYXR1cmUob3B0cykpO1xufVxuXG5mdW5jdGlvbiBwYXJzZURTQWFzbjEoZGF0YSwgdHlwZSwgZm9ybWF0LCBvcHRzKSB7XG5cdHZhciBkZXIgPSBuZXcgYXNuMS5CZXJSZWFkZXIoZGF0YSk7XG5cdGRlci5yZWFkU2VxdWVuY2UoKTtcblx0dmFyIHIgPSBkZXIucmVhZFN0cmluZyhhc24xLkJlci5JbnRlZ2VyLCB0cnVlKTtcblx0dmFyIHMgPSBkZXIucmVhZFN0cmluZyhhc24xLkJlci5JbnRlZ2VyLCB0cnVlKTtcblxuXHRvcHRzLnBhcnRzLnB1c2goe25hbWU6ICdyJywgZGF0YTogdXRpbHMubXBOb3JtYWxpemUocil9KTtcblx0b3B0cy5wYXJ0cy5wdXNoKHtuYW1lOiAncycsIGRhdGE6IHV0aWxzLm1wTm9ybWFsaXplKHMpfSk7XG5cblx0cmV0dXJuIChuZXcgU2lnbmF0dXJlKG9wdHMpKTtcbn1cblxuZnVuY3Rpb24gcGFyc2VEU0EoZGF0YSwgdHlwZSwgZm9ybWF0LCBvcHRzKSB7XG5cdGlmIChkYXRhLmxlbmd0aCAhPSA0MCkge1xuXHRcdHZhciBidWYgPSBuZXcgU1NIQnVmZmVyKHtidWZmZXI6IGRhdGF9KTtcblx0XHR2YXIgZCA9IGJ1Zi5yZWFkQnVmZmVyKCk7XG5cdFx0aWYgKGQudG9TdHJpbmcoJ2FzY2lpJykgPT09ICdzc2gtZHNzJylcblx0XHRcdGQgPSBidWYucmVhZEJ1ZmZlcigpO1xuXHRcdGFzc2VydC5vayhidWYuYXRFbmQoKSwgJ2V4dHJhIHRyYWlsaW5nIGJ5dGVzJyk7XG5cdFx0YXNzZXJ0LnN0cmljdEVxdWFsKGQubGVuZ3RoLCA0MCwgJ2ludmFsaWQgaW5uZXIgbGVuZ3RoJyk7XG5cdFx0ZGF0YSA9IGQ7XG5cdH1cblx0b3B0cy5wYXJ0cy5wdXNoKHtuYW1lOiAncicsIGRhdGE6IGRhdGEuc2xpY2UoMCwgMjApfSk7XG5cdG9wdHMucGFydHMucHVzaCh7bmFtZTogJ3MnLCBkYXRhOiBkYXRhLnNsaWNlKDIwLCA0MCl9KTtcblx0cmV0dXJuIChuZXcgU2lnbmF0dXJlKG9wdHMpKTtcbn1cblxuZnVuY3Rpb24gcGFyc2VFQ0RTQShkYXRhLCB0eXBlLCBmb3JtYXQsIG9wdHMpIHtcblx0dmFyIGJ1ZiA9IG5ldyBTU0hCdWZmZXIoe2J1ZmZlcjogZGF0YX0pO1xuXG5cdHZhciByLCBzO1xuXHR2YXIgaW5uZXIgPSBidWYucmVhZEJ1ZmZlcigpO1xuXHR2YXIgc3R5cGUgPSBpbm5lci50b1N0cmluZygnYXNjaWknKTtcblx0aWYgKHN0eXBlLnNsaWNlKDAsIDYpID09PSAnZWNkc2EtJykge1xuXHRcdHZhciBwYXJ0cyA9IHN0eXBlLnNwbGl0KCctJyk7XG5cdFx0YXNzZXJ0LnN0cmljdEVxdWFsKHBhcnRzWzBdLCAnZWNkc2EnKTtcblx0XHRhc3NlcnQuc3RyaWN0RXF1YWwocGFydHNbMV0sICdzaGEyJyk7XG5cdFx0b3B0cy5jdXJ2ZSA9IHBhcnRzWzJdO1xuXHRcdHN3aXRjaCAob3B0cy5jdXJ2ZSkge1xuXHRcdGNhc2UgJ25pc3RwMjU2Jzpcblx0XHRcdG9wdHMuaGFzaEFsZ28gPSAnc2hhMjU2Jztcblx0XHRcdGJyZWFrO1xuXHRcdGNhc2UgJ25pc3RwMzg0Jzpcblx0XHRcdG9wdHMuaGFzaEFsZ28gPSAnc2hhMzg0Jztcblx0XHRcdGJyZWFrO1xuXHRcdGNhc2UgJ25pc3RwNTIxJzpcblx0XHRcdG9wdHMuaGFzaEFsZ28gPSAnc2hhNTEyJztcblx0XHRcdGJyZWFrO1xuXHRcdGRlZmF1bHQ6XG5cdFx0XHR0aHJvdyAobmV3IEVycm9yKCdVbnN1cHBvcnRlZCBFQ0RTQSBjdXJ2ZTogJyArXG5cdFx0XHQgICAgb3B0cy5jdXJ2ZSkpO1xuXHRcdH1cblx0XHRpbm5lciA9IGJ1Zi5yZWFkQnVmZmVyKCk7XG5cdFx0YXNzZXJ0Lm9rKGJ1Zi5hdEVuZCgpLCAnZXh0cmEgdHJhaWxpbmcgYnl0ZXMgb24gb3V0ZXInKTtcblx0XHRidWYgPSBuZXcgU1NIQnVmZmVyKHtidWZmZXI6IGlubmVyfSk7XG5cdFx0ciA9IGJ1Zi5yZWFkUGFydCgpO1xuXHR9IGVsc2Uge1xuXHRcdHIgPSB7ZGF0YTogaW5uZXJ9O1xuXHR9XG5cblx0cyA9IGJ1Zi5yZWFkUGFydCgpO1xuXHRhc3NlcnQub2soYnVmLmF0RW5kKCksICdleHRyYSB0cmFpbGluZyBieXRlcycpO1xuXG5cdHIubmFtZSA9ICdyJztcblx0cy5uYW1lID0gJ3MnO1xuXG5cdG9wdHMucGFydHMucHVzaChyKTtcblx0b3B0cy5wYXJ0cy5wdXNoKHMpO1xuXHRyZXR1cm4gKG5ldyBTaWduYXR1cmUob3B0cykpO1xufVxuXG5TaWduYXR1cmUuaXNTaWduYXR1cmUgPSBmdW5jdGlvbiAob2JqLCB2ZXIpIHtcblx0cmV0dXJuICh1dGlscy5pc0NvbXBhdGlibGUob2JqLCBTaWduYXR1cmUsIHZlcikpO1xufTtcblxuLypcbiAqIEFQSSB2ZXJzaW9ucyBmb3IgU2lnbmF0dXJlOlxuICogWzEsMF0gLS0gaW5pdGlhbCB2ZXJcbiAqIFsyLDBdIC0tIHN1cHBvcnQgZm9yIHJzYSBpbiBmdWxsIHNzaCBmb3JtYXQsIGNvbXBhdCB3aXRoIHNzaHBrLWFnZW50XG4gKiAgICAgICAgICBoYXNoQWxnb3JpdGhtIHByb3BlcnR5XG4gKiBbMiwxXSAtLSBmaXJzdCB0YWdnZWQgdmVyc2lvblxuICovXG5TaWduYXR1cmUucHJvdG90eXBlLl9zc2hwa0FwaVZlcnNpb24gPSBbMiwgMV07XG5cblNpZ25hdHVyZS5fb2xkVmVyc2lvbkRldGVjdCA9IGZ1bmN0aW9uIChvYmopIHtcblx0YXNzZXJ0LmZ1bmMob2JqLnRvQnVmZmVyKTtcblx0aWYgKG9iai5oYXNPd25Qcm9wZXJ0eSgnaGFzaEFsZ29yaXRobScpKVxuXHRcdHJldHVybiAoWzIsIDBdKTtcblx0cmV0dXJuIChbMSwgMF0pO1xufTtcbiIsIi8vIENvcHlyaWdodCAyMDE4IEpveWVudCwgSW5jLlxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0cmVhZDogcmVhZCxcblx0d3JpdGU6IHdyaXRlXG59O1xuXG52YXIgYXNzZXJ0ID0gcmVxdWlyZSgnYXNzZXJ0LXBsdXMnKTtcbnZhciBCdWZmZXIgPSByZXF1aXJlKCdzYWZlci1idWZmZXInKS5CdWZmZXI7XG52YXIgcmZjNDI1MyA9IHJlcXVpcmUoJy4vcmZjNDI1MycpO1xudmFyIEtleSA9IHJlcXVpcmUoJy4uL2tleScpO1xuXG52YXIgZXJyb3JzID0gcmVxdWlyZSgnLi4vZXJyb3JzJyk7XG5cbmZ1bmN0aW9uIHJlYWQoYnVmLCBvcHRpb25zKSB7XG5cdHZhciBsaW5lcyA9IGJ1Zi50b1N0cmluZygnYXNjaWknKS5zcGxpdCgvW1xcclxcbl0rLyk7XG5cdHZhciBmb3VuZCA9IGZhbHNlO1xuXHR2YXIgcGFydHM7XG5cdHZhciBzaSA9IDA7XG5cdHdoaWxlIChzaSA8IGxpbmVzLmxlbmd0aCkge1xuXHRcdHBhcnRzID0gc3BsaXRIZWFkZXIobGluZXNbc2krK10pO1xuXHRcdGlmIChwYXJ0cyAmJlxuXHRcdCAgICBwYXJ0c1swXS50b0xvd2VyQ2FzZSgpID09PSAncHV0dHktdXNlci1rZXktZmlsZS0yJykge1xuXHRcdFx0Zm91bmQgPSB0cnVlO1xuXHRcdFx0YnJlYWs7XG5cdFx0fVxuXHR9XG5cdGlmICghZm91bmQpIHtcblx0XHR0aHJvdyAobmV3IEVycm9yKCdObyBQdVRUWSBmb3JtYXQgZmlyc3QgbGluZSBmb3VuZCcpKTtcblx0fVxuXHR2YXIgYWxnID0gcGFydHNbMV07XG5cblx0cGFydHMgPSBzcGxpdEhlYWRlcihsaW5lc1tzaSsrXSk7XG5cdGFzc2VydC5lcXVhbChwYXJ0c1swXS50b0xvd2VyQ2FzZSgpLCAnZW5jcnlwdGlvbicpO1xuXG5cdHBhcnRzID0gc3BsaXRIZWFkZXIobGluZXNbc2krK10pO1xuXHRhc3NlcnQuZXF1YWwocGFydHNbMF0udG9Mb3dlckNhc2UoKSwgJ2NvbW1lbnQnKTtcblx0dmFyIGNvbW1lbnQgPSBwYXJ0c1sxXTtcblxuXHRwYXJ0cyA9IHNwbGl0SGVhZGVyKGxpbmVzW3NpKytdKTtcblx0YXNzZXJ0LmVxdWFsKHBhcnRzWzBdLnRvTG93ZXJDYXNlKCksICdwdWJsaWMtbGluZXMnKTtcblx0dmFyIHB1YmxpY0xpbmVzID0gcGFyc2VJbnQocGFydHNbMV0sIDEwKTtcblx0aWYgKCFpc0Zpbml0ZShwdWJsaWNMaW5lcykgfHwgcHVibGljTGluZXMgPCAwIHx8XG5cdCAgICBwdWJsaWNMaW5lcyA+IGxpbmVzLmxlbmd0aCkge1xuXHRcdHRocm93IChuZXcgRXJyb3IoJ0ludmFsaWQgcHVibGljLWxpbmVzIGNvdW50JykpO1xuXHR9XG5cblx0dmFyIHB1YmxpY0J1ZiA9IEJ1ZmZlci5mcm9tKFxuXHQgICAgbGluZXMuc2xpY2Uoc2ksIHNpICsgcHVibGljTGluZXMpLmpvaW4oJycpLCAnYmFzZTY0Jyk7XG5cdHZhciBrZXlUeXBlID0gcmZjNDI1My5hbGdUb0tleVR5cGUoYWxnKTtcblx0dmFyIGtleSA9IHJmYzQyNTMucmVhZChwdWJsaWNCdWYpO1xuXHRpZiAoa2V5LnR5cGUgIT09IGtleVR5cGUpIHtcblx0XHR0aHJvdyAobmV3IEVycm9yKCdPdXRlciBrZXkgYWxnb3JpdGhtIG1pc21hdGNoJykpO1xuXHR9XG5cdGtleS5jb21tZW50ID0gY29tbWVudDtcblx0cmV0dXJuIChrZXkpO1xufVxuXG5mdW5jdGlvbiBzcGxpdEhlYWRlcihsaW5lKSB7XG5cdHZhciBpZHggPSBsaW5lLmluZGV4T2YoJzonKTtcblx0aWYgKGlkeCA9PT0gLTEpXG5cdFx0cmV0dXJuIChudWxsKTtcblx0dmFyIGhlYWRlciA9IGxpbmUuc2xpY2UoMCwgaWR4KTtcblx0KytpZHg7XG5cdHdoaWxlIChsaW5lW2lkeF0gPT09ICcgJylcblx0XHQrK2lkeDtcblx0dmFyIHJlc3QgPSBsaW5lLnNsaWNlKGlkeCk7XG5cdHJldHVybiAoW2hlYWRlciwgcmVzdF0pO1xufVxuXG5mdW5jdGlvbiB3cml0ZShrZXksIG9wdGlvbnMpIHtcblx0YXNzZXJ0Lm9iamVjdChrZXkpO1xuXHRpZiAoIUtleS5pc0tleShrZXkpKVxuXHRcdHRocm93IChuZXcgRXJyb3IoJ011c3QgYmUgYSBwdWJsaWMga2V5JykpO1xuXG5cdHZhciBhbGcgPSByZmM0MjUzLmtleVR5cGVUb0FsZyhrZXkpO1xuXHR2YXIgYnVmID0gcmZjNDI1My53cml0ZShrZXkpO1xuXHR2YXIgY29tbWVudCA9IGtleS5jb21tZW50IHx8ICcnO1xuXG5cdHZhciBiNjQgPSBidWYudG9TdHJpbmcoJ2Jhc2U2NCcpO1xuXHR2YXIgbGluZXMgPSB3cmFwKGI2NCwgNjQpO1xuXG5cdGxpbmVzLnVuc2hpZnQoJ1B1YmxpYy1MaW5lczogJyArIGxpbmVzLmxlbmd0aCk7XG5cdGxpbmVzLnVuc2hpZnQoJ0NvbW1lbnQ6ICcgKyBjb21tZW50KTtcblx0bGluZXMudW5zaGlmdCgnRW5jcnlwdGlvbjogbm9uZScpO1xuXHRsaW5lcy51bnNoaWZ0KCdQdVRUWS1Vc2VyLUtleS1GaWxlLTI6ICcgKyBhbGcpO1xuXG5cdHJldHVybiAoQnVmZmVyLmZyb20obGluZXMuam9pbignXFxuJykgKyAnXFxuJykpO1xufVxuXG5mdW5jdGlvbiB3cmFwKHR4dCwgbGVuKSB7XG5cdHZhciBsaW5lcyA9IFtdO1xuXHR2YXIgcG9zID0gMDtcblx0d2hpbGUgKHBvcyA8IHR4dC5sZW5ndGgpIHtcblx0XHRsaW5lcy5wdXNoKHR4dC5zbGljZShwb3MsIHBvcyArIDY0KSk7XG5cdFx0cG9zICs9IDY0O1xuXHR9XG5cdHJldHVybiAobGluZXMpO1xufVxuIiwiLy8gQ29weXJpZ2h0IDIwMTUgSm95ZW50LCBJbmMuXG5cbm1vZHVsZS5leHBvcnRzID0gU1NIQnVmZmVyO1xuXG52YXIgYXNzZXJ0ID0gcmVxdWlyZSgnYXNzZXJ0LXBsdXMnKTtcbnZhciBCdWZmZXIgPSByZXF1aXJlKCdzYWZlci1idWZmZXInKS5CdWZmZXI7XG5cbmZ1bmN0aW9uIFNTSEJ1ZmZlcihvcHRzKSB7XG5cdGFzc2VydC5vYmplY3Qob3B0cywgJ29wdGlvbnMnKTtcblx0aWYgKG9wdHMuYnVmZmVyICE9PSB1bmRlZmluZWQpXG5cdFx0YXNzZXJ0LmJ1ZmZlcihvcHRzLmJ1ZmZlciwgJ29wdGlvbnMuYnVmZmVyJyk7XG5cblx0dGhpcy5fc2l6ZSA9IG9wdHMuYnVmZmVyID8gb3B0cy5idWZmZXIubGVuZ3RoIDogMTAyNDtcblx0dGhpcy5fYnVmZmVyID0gb3B0cy5idWZmZXIgfHwgQnVmZmVyLmFsbG9jKHRoaXMuX3NpemUpO1xuXHR0aGlzLl9vZmZzZXQgPSAwO1xufVxuXG5TU0hCdWZmZXIucHJvdG90eXBlLnRvQnVmZmVyID0gZnVuY3Rpb24gKCkge1xuXHRyZXR1cm4gKHRoaXMuX2J1ZmZlci5zbGljZSgwLCB0aGlzLl9vZmZzZXQpKTtcbn07XG5cblNTSEJ1ZmZlci5wcm90b3R5cGUuYXRFbmQgPSBmdW5jdGlvbiAoKSB7XG5cdHJldHVybiAodGhpcy5fb2Zmc2V0ID49IHRoaXMuX2J1ZmZlci5sZW5ndGgpO1xufTtcblxuU1NIQnVmZmVyLnByb3RvdHlwZS5yZW1haW5kZXIgPSBmdW5jdGlvbiAoKSB7XG5cdHJldHVybiAodGhpcy5fYnVmZmVyLnNsaWNlKHRoaXMuX29mZnNldCkpO1xufTtcblxuU1NIQnVmZmVyLnByb3RvdHlwZS5za2lwID0gZnVuY3Rpb24gKG4pIHtcblx0dGhpcy5fb2Zmc2V0ICs9IG47XG59O1xuXG5TU0hCdWZmZXIucHJvdG90eXBlLmV4cGFuZCA9IGZ1bmN0aW9uICgpIHtcblx0dGhpcy5fc2l6ZSAqPSAyO1xuXHR2YXIgYnVmID0gQnVmZmVyLmFsbG9jKHRoaXMuX3NpemUpO1xuXHR0aGlzLl9idWZmZXIuY29weShidWYsIDApO1xuXHR0aGlzLl9idWZmZXIgPSBidWY7XG59O1xuXG5TU0hCdWZmZXIucHJvdG90eXBlLnJlYWRQYXJ0ID0gZnVuY3Rpb24gKCkge1xuXHRyZXR1cm4gKHtkYXRhOiB0aGlzLnJlYWRCdWZmZXIoKX0pO1xufTtcblxuU1NIQnVmZmVyLnByb3RvdHlwZS5yZWFkQnVmZmVyID0gZnVuY3Rpb24gKCkge1xuXHR2YXIgbGVuID0gdGhpcy5fYnVmZmVyLnJlYWRVSW50MzJCRSh0aGlzLl9vZmZzZXQpO1xuXHR0aGlzLl9vZmZzZXQgKz0gNDtcblx0YXNzZXJ0Lm9rKHRoaXMuX29mZnNldCArIGxlbiA8PSB0aGlzLl9idWZmZXIubGVuZ3RoLFxuXHQgICAgJ2xlbmd0aCBvdXQgb2YgYm91bmRzIGF0ICsweCcgKyB0aGlzLl9vZmZzZXQudG9TdHJpbmcoMTYpICtcblx0ICAgICcgKGRhdGEgdHJ1bmNhdGVkPyknKTtcblx0dmFyIGJ1ZiA9IHRoaXMuX2J1ZmZlci5zbGljZSh0aGlzLl9vZmZzZXQsIHRoaXMuX29mZnNldCArIGxlbik7XG5cdHRoaXMuX29mZnNldCArPSBsZW47XG5cdHJldHVybiAoYnVmKTtcbn07XG5cblNTSEJ1ZmZlci5wcm90b3R5cGUucmVhZFN0cmluZyA9IGZ1bmN0aW9uICgpIHtcblx0cmV0dXJuICh0aGlzLnJlYWRCdWZmZXIoKS50b1N0cmluZygpKTtcbn07XG5cblNTSEJ1ZmZlci5wcm90b3R5cGUucmVhZENTdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG5cdHZhciBvZmZzZXQgPSB0aGlzLl9vZmZzZXQ7XG5cdHdoaWxlIChvZmZzZXQgPCB0aGlzLl9idWZmZXIubGVuZ3RoICYmXG5cdCAgICB0aGlzLl9idWZmZXJbb2Zmc2V0XSAhPT0gMHgwMClcblx0XHRvZmZzZXQrKztcblx0YXNzZXJ0Lm9rKG9mZnNldCA8IHRoaXMuX2J1ZmZlci5sZW5ndGgsICdjIHN0cmluZyBkb2VzIG5vdCB0ZXJtaW5hdGUnKTtcblx0dmFyIHN0ciA9IHRoaXMuX2J1ZmZlci5zbGljZSh0aGlzLl9vZmZzZXQsIG9mZnNldCkudG9TdHJpbmcoKTtcblx0dGhpcy5fb2Zmc2V0ID0gb2Zmc2V0ICsgMTtcblx0cmV0dXJuIChzdHIpO1xufTtcblxuU1NIQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50ID0gZnVuY3Rpb24gKCkge1xuXHR2YXIgdiA9IHRoaXMuX2J1ZmZlci5yZWFkVUludDMyQkUodGhpcy5fb2Zmc2V0KTtcblx0dGhpcy5fb2Zmc2V0ICs9IDQ7XG5cdHJldHVybiAodik7XG59O1xuXG5TU0hCdWZmZXIucHJvdG90eXBlLnJlYWRJbnQ2NCA9IGZ1bmN0aW9uICgpIHtcblx0YXNzZXJ0Lm9rKHRoaXMuX29mZnNldCArIDggPCB0aGlzLl9idWZmZXIubGVuZ3RoLFxuXHQgICAgJ2J1ZmZlciBub3QgbG9uZyBlbm91Z2ggdG8gcmVhZCBJbnQ2NCcpO1xuXHR2YXIgdiA9IHRoaXMuX2J1ZmZlci5zbGljZSh0aGlzLl9vZmZzZXQsIHRoaXMuX29mZnNldCArIDgpO1xuXHR0aGlzLl9vZmZzZXQgKz0gODtcblx0cmV0dXJuICh2KTtcbn07XG5cblNTSEJ1ZmZlci5wcm90b3R5cGUucmVhZENoYXIgPSBmdW5jdGlvbiAoKSB7XG5cdHZhciB2ID0gdGhpcy5fYnVmZmVyW3RoaXMuX29mZnNldCsrXTtcblx0cmV0dXJuICh2KTtcbn07XG5cblNTSEJ1ZmZlci5wcm90b3R5cGUud3JpdGVCdWZmZXIgPSBmdW5jdGlvbiAoYnVmKSB7XG5cdHdoaWxlICh0aGlzLl9vZmZzZXQgKyA0ICsgYnVmLmxlbmd0aCA+IHRoaXMuX3NpemUpXG5cdFx0dGhpcy5leHBhbmQoKTtcblx0dGhpcy5fYnVmZmVyLndyaXRlVUludDMyQkUoYnVmLmxlbmd0aCwgdGhpcy5fb2Zmc2V0KTtcblx0dGhpcy5fb2Zmc2V0ICs9IDQ7XG5cdGJ1Zi5jb3B5KHRoaXMuX2J1ZmZlciwgdGhpcy5fb2Zmc2V0KTtcblx0dGhpcy5fb2Zmc2V0ICs9IGJ1Zi5sZW5ndGg7XG59O1xuXG5TU0hCdWZmZXIucHJvdG90eXBlLndyaXRlU3RyaW5nID0gZnVuY3Rpb24gKHN0cikge1xuXHR0aGlzLndyaXRlQnVmZmVyKEJ1ZmZlci5mcm9tKHN0ciwgJ3V0ZjgnKSk7XG59O1xuXG5TU0hCdWZmZXIucHJvdG90eXBlLndyaXRlQ1N0cmluZyA9IGZ1bmN0aW9uIChzdHIpIHtcblx0d2hpbGUgKHRoaXMuX29mZnNldCArIDEgKyBzdHIubGVuZ3RoID4gdGhpcy5fc2l6ZSlcblx0XHR0aGlzLmV4cGFuZCgpO1xuXHR0aGlzLl9idWZmZXIud3JpdGUoc3RyLCB0aGlzLl9vZmZzZXQpO1xuXHR0aGlzLl9vZmZzZXQgKz0gc3RyLmxlbmd0aDtcblx0dGhpcy5fYnVmZmVyW3RoaXMuX29mZnNldCsrXSA9IDA7XG59O1xuXG5TU0hCdWZmZXIucHJvdG90eXBlLndyaXRlSW50ID0gZnVuY3Rpb24gKHYpIHtcblx0d2hpbGUgKHRoaXMuX29mZnNldCArIDQgPiB0aGlzLl9zaXplKVxuXHRcdHRoaXMuZXhwYW5kKCk7XG5cdHRoaXMuX2J1ZmZlci53cml0ZVVJbnQzMkJFKHYsIHRoaXMuX29mZnNldCk7XG5cdHRoaXMuX29mZnNldCArPSA0O1xufTtcblxuU1NIQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDY0ID0gZnVuY3Rpb24gKHYpIHtcblx0YXNzZXJ0LmJ1ZmZlcih2LCAndmFsdWUnKTtcblx0aWYgKHYubGVuZ3RoID4gOCkge1xuXHRcdHZhciBsZWFkID0gdi5zbGljZSgwLCB2Lmxlbmd0aCAtIDgpO1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgbGVhZC5sZW5ndGg7ICsraSkge1xuXHRcdFx0YXNzZXJ0LnN0cmljdEVxdWFsKGxlYWRbaV0sIDAsXG5cdFx0XHQgICAgJ211c3QgZml0IGluIDY0IGJpdHMgb2YgcHJlY2lzaW9uJyk7XG5cdFx0fVxuXHRcdHYgPSB2LnNsaWNlKHYubGVuZ3RoIC0gOCwgdi5sZW5ndGgpO1xuXHR9XG5cdHdoaWxlICh0aGlzLl9vZmZzZXQgKyA4ID4gdGhpcy5fc2l6ZSlcblx0XHR0aGlzLmV4cGFuZCgpO1xuXHR2LmNvcHkodGhpcy5fYnVmZmVyLCB0aGlzLl9vZmZzZXQpO1xuXHR0aGlzLl9vZmZzZXQgKz0gODtcbn07XG5cblNTSEJ1ZmZlci5wcm90b3R5cGUud3JpdGVDaGFyID0gZnVuY3Rpb24gKHYpIHtcblx0d2hpbGUgKHRoaXMuX29mZnNldCArIDEgPiB0aGlzLl9zaXplKVxuXHRcdHRoaXMuZXhwYW5kKCk7XG5cdHRoaXMuX2J1ZmZlclt0aGlzLl9vZmZzZXQrK10gPSB2O1xufTtcblxuU1NIQnVmZmVyLnByb3RvdHlwZS53cml0ZVBhcnQgPSBmdW5jdGlvbiAocCkge1xuXHR0aGlzLndyaXRlQnVmZmVyKHAuZGF0YSk7XG59O1xuXG5TU0hCdWZmZXIucHJvdG90eXBlLndyaXRlID0gZnVuY3Rpb24gKGJ1Zikge1xuXHR3aGlsZSAodGhpcy5fb2Zmc2V0ICsgYnVmLmxlbmd0aCA+IHRoaXMuX3NpemUpXG5cdFx0dGhpcy5leHBhbmQoKTtcblx0YnVmLmNvcHkodGhpcy5fYnVmZmVyLCB0aGlzLl9vZmZzZXQpO1xuXHR0aGlzLl9vZmZzZXQgKz0gYnVmLmxlbmd0aDtcbn07XG4iLCIvLyBDb3B5cmlnaHQgMjAxNSBKb3llbnQsIEluYy5cblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdHJlYWQ6IHJlYWQsXG5cdHdyaXRlOiB3cml0ZVxufTtcblxudmFyIGFzc2VydCA9IHJlcXVpcmUoJ2Fzc2VydC1wbHVzJyk7XG52YXIgQnVmZmVyID0gcmVxdWlyZSgnc2FmZXItYnVmZmVyJykuQnVmZmVyO1xudmFyIHJmYzQyNTMgPSByZXF1aXJlKCcuL3JmYzQyNTMnKTtcbnZhciB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWxzJyk7XG52YXIgS2V5ID0gcmVxdWlyZSgnLi4va2V5Jyk7XG52YXIgUHJpdmF0ZUtleSA9IHJlcXVpcmUoJy4uL3ByaXZhdGUta2V5Jyk7XG5cbnZhciBzc2hwcml2ID0gcmVxdWlyZSgnLi9zc2gtcHJpdmF0ZScpO1xuXG4vKkpTU1RZTEVEKi9cbnZhciBTU0hLRVlfUkUgPSAvXihbYS16MC05LV0rKVsgXFx0XSsoW2EtekEtWjAtOStcXC9dK1s9XSopKFsgXFx0XSsoW14gXFx0XVteXFxuXSpbXFxuXSopPyk/JC87XG4vKkpTU1RZTEVEKi9cbnZhciBTU0hLRVlfUkUyID0gL14oW2EtejAtOS1dKylbIFxcdFxcbl0rKFthLXpBLVowLTkrXFwvXVthLXpBLVowLTkrXFwvIFxcdFxcbj1dKikoW15hLXpBLVowLTkrXFwvIFxcdFxcbj1dLiopPyQvO1xuXG5mdW5jdGlvbiByZWFkKGJ1Ziwgb3B0aW9ucykge1xuXHRpZiAodHlwZW9mIChidWYpICE9PSAnc3RyaW5nJykge1xuXHRcdGFzc2VydC5idWZmZXIoYnVmLCAnYnVmJyk7XG5cdFx0YnVmID0gYnVmLnRvU3RyaW5nKCdhc2NpaScpO1xuXHR9XG5cblx0dmFyIHRyaW1tZWQgPSBidWYudHJpbSgpLnJlcGxhY2UoL1tcXFxcXFxyXS9nLCAnJyk7XG5cdHZhciBtID0gdHJpbW1lZC5tYXRjaChTU0hLRVlfUkUpO1xuXHRpZiAoIW0pXG5cdFx0bSA9IHRyaW1tZWQubWF0Y2goU1NIS0VZX1JFMik7XG5cdGFzc2VydC5vayhtLCAna2V5IG11c3QgbWF0Y2ggcmVnZXgnKTtcblxuXHR2YXIgdHlwZSA9IHJmYzQyNTMuYWxnVG9LZXlUeXBlKG1bMV0pO1xuXHR2YXIga2J1ZiA9IEJ1ZmZlci5mcm9tKG1bMl0sICdiYXNlNjQnKTtcblxuXHQvKlxuXHQgKiBUaGlzIGlzIGEgYml0IHRyaWNreS4gSWYgd2UgbWFuYWdlZCB0byBwYXJzZSB0aGUga2V5IGFuZCBsb2NhdGUgdGhlXG5cdCAqIGtleSBjb21tZW50IHdpdGggdGhlIHJlZ2V4LCB0aGVuIGRvIGEgbm9uLXBhcnRpYWwgcmVhZCBhbmQgYXNzZXJ0XG5cdCAqIHRoYXQgd2UgaGF2ZSBjb25zdW1lZCBhbGwgYnl0ZXMuIElmIHdlIGNvdWxkbid0IGxvY2F0ZSB0aGUga2V5XG5cdCAqIGNvbW1lbnQsIHRob3VnaCwgdGhlcmUgbWF5IGJlIHdoaXRlc3BhY2Ugc2hlbmFuaWdhbnMgZ29pbmcgb24gdGhhdFxuXHQgKiBoYXZlIGNvbmpvaW5lZCB0aGUgY29tbWVudCB0byB0aGUgcmVzdCBvZiB0aGUga2V5LiBXZSBkbyBhIHBhcnRpYWxcblx0ICogcmVhZCBpbiB0aGlzIGNhc2UgdG8gdHJ5IHRvIG1ha2UgdGhlIGJlc3Qgb3V0IG9mIGEgc29ycnkgc2l0dWF0aW9uLlxuXHQgKi9cblx0dmFyIGtleTtcblx0dmFyIHJldCA9IHt9O1xuXHRpZiAobVs0XSkge1xuXHRcdHRyeSB7XG5cdFx0XHRrZXkgPSByZmM0MjUzLnJlYWQoa2J1Zik7XG5cblx0XHR9IGNhdGNoIChlKSB7XG5cdFx0XHRtID0gdHJpbW1lZC5tYXRjaChTU0hLRVlfUkUyKTtcblx0XHRcdGFzc2VydC5vayhtLCAna2V5IG11c3QgbWF0Y2ggcmVnZXgnKTtcblx0XHRcdGtidWYgPSBCdWZmZXIuZnJvbShtWzJdLCAnYmFzZTY0Jyk7XG5cdFx0XHRrZXkgPSByZmM0MjUzLnJlYWRJbnRlcm5hbChyZXQsICdwdWJsaWMnLCBrYnVmKTtcblx0XHR9XG5cdH0gZWxzZSB7XG5cdFx0a2V5ID0gcmZjNDI1My5yZWFkSW50ZXJuYWwocmV0LCAncHVibGljJywga2J1Zik7XG5cdH1cblxuXHRhc3NlcnQuc3RyaWN0RXF1YWwodHlwZSwga2V5LnR5cGUpO1xuXG5cdGlmIChtWzRdICYmIG1bNF0ubGVuZ3RoID4gMCkge1xuXHRcdGtleS5jb21tZW50ID0gbVs0XTtcblxuXHR9IGVsc2UgaWYgKHJldC5jb25zdW1lZCkge1xuXHRcdC8qXG5cdFx0ICogTm93IHRoZSBtYWdpYzogdHJ5aW5nIHRvIHJlY292ZXIgdGhlIGtleSBjb21tZW50IHdoZW4gaXQnc1xuXHRcdCAqIGdvdHRlbiBjb25qb2luZWQgdG8gdGhlIGtleSBvciBvdGhlcndpc2Ugc2hlbmFuaWdhbidkLlxuXHRcdCAqXG5cdFx0ICogV29yayBvdXQgaG93IG11Y2ggYmFzZTY0IHdlIHVzZWQsIHRoZW4gZHJvcCBhbGwgbm9uLWJhc2U2NFxuXHRcdCAqIGNoYXJzIGZyb20gdGhlIGJlZ2lubmluZyB1cCB0byB0aGlzIHBvaW50IGluIHRoZSB0aGUgc3RyaW5nLlxuXHRcdCAqIFRoZW4gb2Zmc2V0IGluIHRoaXMgYW5kIHRyeSB0byBtYWtlIHVwIGZvciBtaXNzaW5nID0gY2hhcnMuXG5cdFx0ICovXG5cdFx0dmFyIGRhdGEgPSBtWzJdICsgKG1bM10gPyBtWzNdIDogJycpO1xuXHRcdHZhciByZWFsT2Zmc2V0ID0gTWF0aC5jZWlsKHJldC5jb25zdW1lZCAvIDMpICogNDtcblx0XHRkYXRhID0gZGF0YS5zbGljZSgwLCByZWFsT2Zmc2V0IC0gMikuIC8qSlNTVFlMRUQqL1xuXHRcdCAgICByZXBsYWNlKC9bXmEtekEtWjAtOStcXC89XS9nLCAnJykgK1xuXHRcdCAgICBkYXRhLnNsaWNlKHJlYWxPZmZzZXQgLSAyKTtcblxuXHRcdHZhciBwYWRkaW5nID0gcmV0LmNvbnN1bWVkICUgMztcblx0XHRpZiAocGFkZGluZyA+IDAgJiZcblx0XHQgICAgZGF0YS5zbGljZShyZWFsT2Zmc2V0IC0gMSwgcmVhbE9mZnNldCkgIT09ICc9Jylcblx0XHRcdHJlYWxPZmZzZXQtLTtcblx0XHR3aGlsZSAoZGF0YS5zbGljZShyZWFsT2Zmc2V0LCByZWFsT2Zmc2V0ICsgMSkgPT09ICc9Jylcblx0XHRcdHJlYWxPZmZzZXQrKztcblxuXHRcdC8qIEZpbmFsbHksIGdyYWIgd2hhdCB3ZSB0aGluayBpcyB0aGUgY29tbWVudCAmIGNsZWFuIGl0IHVwLiAqL1xuXHRcdHZhciB0cmFpbGVyID0gZGF0YS5zbGljZShyZWFsT2Zmc2V0KTtcblx0XHR0cmFpbGVyID0gdHJhaWxlci5yZXBsYWNlKC9bXFxyXFxuXS9nLCAnICcpLlxuXHRcdCAgICByZXBsYWNlKC9eXFxzKy8sICcnKTtcblx0XHRpZiAodHJhaWxlci5tYXRjaCgvXlthLXpBLVowLTldLykpXG5cdFx0XHRrZXkuY29tbWVudCA9IHRyYWlsZXI7XG5cdH1cblxuXHRyZXR1cm4gKGtleSk7XG59XG5cbmZ1bmN0aW9uIHdyaXRlKGtleSwgb3B0aW9ucykge1xuXHRhc3NlcnQub2JqZWN0KGtleSk7XG5cdGlmICghS2V5LmlzS2V5KGtleSkpXG5cdFx0dGhyb3cgKG5ldyBFcnJvcignTXVzdCBiZSBhIHB1YmxpYyBrZXknKSk7XG5cblx0dmFyIHBhcnRzID0gW107XG5cdHZhciBhbGcgPSByZmM0MjUzLmtleVR5cGVUb0FsZyhrZXkpO1xuXHRwYXJ0cy5wdXNoKGFsZyk7XG5cblx0dmFyIGJ1ZiA9IHJmYzQyNTMud3JpdGUoa2V5KTtcblx0cGFydHMucHVzaChidWYudG9TdHJpbmcoJ2Jhc2U2NCcpKTtcblxuXHRpZiAoa2V5LmNvbW1lbnQpXG5cdFx0cGFydHMucHVzaChrZXkuY29tbWVudCk7XG5cblx0cmV0dXJuIChCdWZmZXIuZnJvbShwYXJ0cy5qb2luKCcgJykpKTtcbn1cbiIsIi8vIENvcHlyaWdodCAyMDE1IEpveWVudCwgSW5jLlxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0cmVhZDogcmVhZC5iaW5kKHVuZGVmaW5lZCwgZmFsc2UsIHVuZGVmaW5lZCksXG5cdHJlYWRUeXBlOiByZWFkLmJpbmQodW5kZWZpbmVkLCBmYWxzZSksXG5cdHdyaXRlOiB3cml0ZSxcblx0Lyogc2VtaS1wcml2YXRlIGFwaSwgdXNlZCBieSBzc2hway1hZ2VudCAqL1xuXHRyZWFkUGFydGlhbDogcmVhZC5iaW5kKHVuZGVmaW5lZCwgdHJ1ZSksXG5cblx0Lyogc2hhcmVkIHdpdGggc3NoIGZvcm1hdCAqL1xuXHRyZWFkSW50ZXJuYWw6IHJlYWQsXG5cdGtleVR5cGVUb0FsZzoga2V5VHlwZVRvQWxnLFxuXHRhbGdUb0tleVR5cGU6IGFsZ1RvS2V5VHlwZVxufTtcblxudmFyIGFzc2VydCA9IHJlcXVpcmUoJ2Fzc2VydC1wbHVzJyk7XG52YXIgQnVmZmVyID0gcmVxdWlyZSgnc2FmZXItYnVmZmVyJykuQnVmZmVyO1xudmFyIGFsZ3MgPSByZXF1aXJlKCcuLi9hbGdzJyk7XG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlscycpO1xudmFyIEtleSA9IHJlcXVpcmUoJy4uL2tleScpO1xudmFyIFByaXZhdGVLZXkgPSByZXF1aXJlKCcuLi9wcml2YXRlLWtleScpO1xudmFyIFNTSEJ1ZmZlciA9IHJlcXVpcmUoJy4uL3NzaC1idWZmZXInKTtcblxuZnVuY3Rpb24gYWxnVG9LZXlUeXBlKGFsZykge1xuXHRhc3NlcnQuc3RyaW5nKGFsZyk7XG5cdGlmIChhbGcgPT09ICdzc2gtZHNzJylcblx0XHRyZXR1cm4gKCdkc2EnKTtcblx0ZWxzZSBpZiAoYWxnID09PSAnc3NoLXJzYScpXG5cdFx0cmV0dXJuICgncnNhJyk7XG5cdGVsc2UgaWYgKGFsZyA9PT0gJ3NzaC1lZDI1NTE5Jylcblx0XHRyZXR1cm4gKCdlZDI1NTE5Jyk7XG5cdGVsc2UgaWYgKGFsZyA9PT0gJ3NzaC1jdXJ2ZTI1NTE5Jylcblx0XHRyZXR1cm4gKCdjdXJ2ZTI1NTE5Jyk7XG5cdGVsc2UgaWYgKGFsZy5tYXRjaCgvXmVjZHNhLXNoYTItLykpXG5cdFx0cmV0dXJuICgnZWNkc2EnKTtcblx0ZWxzZVxuXHRcdHRocm93IChuZXcgRXJyb3IoJ1Vua25vd24gYWxnb3JpdGhtICcgKyBhbGcpKTtcbn1cblxuZnVuY3Rpb24ga2V5VHlwZVRvQWxnKGtleSkge1xuXHRhc3NlcnQub2JqZWN0KGtleSk7XG5cdGlmIChrZXkudHlwZSA9PT0gJ2RzYScpXG5cdFx0cmV0dXJuICgnc3NoLWRzcycpO1xuXHRlbHNlIGlmIChrZXkudHlwZSA9PT0gJ3JzYScpXG5cdFx0cmV0dXJuICgnc3NoLXJzYScpO1xuXHRlbHNlIGlmIChrZXkudHlwZSA9PT0gJ2VkMjU1MTknKVxuXHRcdHJldHVybiAoJ3NzaC1lZDI1NTE5Jyk7XG5cdGVsc2UgaWYgKGtleS50eXBlID09PSAnY3VydmUyNTUxOScpXG5cdFx0cmV0dXJuICgnc3NoLWN1cnZlMjU1MTknKTtcblx0ZWxzZSBpZiAoa2V5LnR5cGUgPT09ICdlY2RzYScpXG5cdFx0cmV0dXJuICgnZWNkc2Etc2hhMi0nICsga2V5LnBhcnQuY3VydmUuZGF0YS50b1N0cmluZygpKTtcblx0ZWxzZVxuXHRcdHRocm93IChuZXcgRXJyb3IoJ1Vua25vd24ga2V5IHR5cGUgJyArIGtleS50eXBlKSk7XG59XG5cbmZ1bmN0aW9uIHJlYWQocGFydGlhbCwgdHlwZSwgYnVmLCBvcHRpb25zKSB7XG5cdGlmICh0eXBlb2YgKGJ1ZikgPT09ICdzdHJpbmcnKVxuXHRcdGJ1ZiA9IEJ1ZmZlci5mcm9tKGJ1Zik7XG5cdGFzc2VydC5idWZmZXIoYnVmLCAnYnVmJyk7XG5cblx0dmFyIGtleSA9IHt9O1xuXG5cdHZhciBwYXJ0cyA9IGtleS5wYXJ0cyA9IFtdO1xuXHR2YXIgc3NoYnVmID0gbmV3IFNTSEJ1ZmZlcih7YnVmZmVyOiBidWZ9KTtcblxuXHR2YXIgYWxnID0gc3NoYnVmLnJlYWRTdHJpbmcoKTtcblx0YXNzZXJ0Lm9rKCFzc2hidWYuYXRFbmQoKSwgJ2tleSBtdXN0IGhhdmUgYXQgbGVhc3Qgb25lIHBhcnQnKTtcblxuXHRrZXkudHlwZSA9IGFsZ1RvS2V5VHlwZShhbGcpO1xuXG5cdHZhciBwYXJ0Q291bnQgPSBhbGdzLmluZm9ba2V5LnR5cGVdLnBhcnRzLmxlbmd0aDtcblx0aWYgKHR5cGUgJiYgdHlwZSA9PT0gJ3ByaXZhdGUnKVxuXHRcdHBhcnRDb3VudCA9IGFsZ3MucHJpdkluZm9ba2V5LnR5cGVdLnBhcnRzLmxlbmd0aDtcblxuXHR3aGlsZSAoIXNzaGJ1Zi5hdEVuZCgpICYmIHBhcnRzLmxlbmd0aCA8IHBhcnRDb3VudClcblx0XHRwYXJ0cy5wdXNoKHNzaGJ1Zi5yZWFkUGFydCgpKTtcblx0d2hpbGUgKCFwYXJ0aWFsICYmICFzc2hidWYuYXRFbmQoKSlcblx0XHRwYXJ0cy5wdXNoKHNzaGJ1Zi5yZWFkUGFydCgpKTtcblxuXHRhc3NlcnQub2socGFydHMubGVuZ3RoID49IDEsXG5cdCAgICAna2V5IG11c3QgaGF2ZSBhdCBsZWFzdCBvbmUgcGFydCcpO1xuXHRhc3NlcnQub2socGFydGlhbCB8fCBzc2hidWYuYXRFbmQoKSxcblx0ICAgICdsZWZ0b3ZlciBieXRlcyBhdCBlbmQgb2Yga2V5Jyk7XG5cblx0dmFyIENvbnN0cnVjdG9yID0gS2V5O1xuXHR2YXIgYWxnSW5mbyA9IGFsZ3MuaW5mb1trZXkudHlwZV07XG5cdGlmICh0eXBlID09PSAncHJpdmF0ZScgfHwgYWxnSW5mby5wYXJ0cy5sZW5ndGggIT09IHBhcnRzLmxlbmd0aCkge1xuXHRcdGFsZ0luZm8gPSBhbGdzLnByaXZJbmZvW2tleS50eXBlXTtcblx0XHRDb25zdHJ1Y3RvciA9IFByaXZhdGVLZXk7XG5cdH1cblx0YXNzZXJ0LnN0cmljdEVxdWFsKGFsZ0luZm8ucGFydHMubGVuZ3RoLCBwYXJ0cy5sZW5ndGgpO1xuXG5cdGlmIChrZXkudHlwZSA9PT0gJ2VjZHNhJykge1xuXHRcdHZhciByZXMgPSAvXmVjZHNhLXNoYTItKC4rKSQvLmV4ZWMoYWxnKTtcblx0XHRhc3NlcnQub2socmVzICE9PSBudWxsKTtcblx0XHRhc3NlcnQuc3RyaWN0RXF1YWwocmVzWzFdLCBwYXJ0c1swXS5kYXRhLnRvU3RyaW5nKCkpO1xuXHR9XG5cblx0dmFyIG5vcm1hbGl6ZWQgPSB0cnVlO1xuXHRmb3IgKHZhciBpID0gMDsgaSA8IGFsZ0luZm8ucGFydHMubGVuZ3RoOyArK2kpIHtcblx0XHR2YXIgcCA9IHBhcnRzW2ldO1xuXHRcdHAubmFtZSA9IGFsZ0luZm8ucGFydHNbaV07XG5cdFx0Lypcblx0XHQgKiBPcGVuU1NIIHN0b3JlcyBlZDI1NTE5IFwicHJpdmF0ZVwiIGtleXMgYXMgc2VlZCArIHB1YmxpYyBrZXlcblx0XHQgKiBjb25jYXQnZCB0b2dldGhlciAoayBmb2xsb3dlZCBieSBBKS4gV2Ugd2FudCB0byBrZWVwIHRoZW1cblx0XHQgKiBzZXBhcmF0ZSBmb3Igb3RoZXIgZm9ybWF0cyB0aGF0IGRvbid0IGRvIHRoaXMuXG5cdFx0ICovXG5cdFx0aWYgKGtleS50eXBlID09PSAnZWQyNTUxOScgJiYgcC5uYW1lID09PSAnaycpXG5cdFx0XHRwLmRhdGEgPSBwLmRhdGEuc2xpY2UoMCwgMzIpO1xuXG5cdFx0aWYgKHAubmFtZSAhPT0gJ2N1cnZlJyAmJiBhbGdJbmZvLm5vcm1hbGl6ZSAhPT0gZmFsc2UpIHtcblx0XHRcdHZhciBuZDtcblx0XHRcdGlmIChrZXkudHlwZSA9PT0gJ2VkMjU1MTknKSB7XG5cdFx0XHRcdG5kID0gdXRpbHMuemVyb1BhZFRvTGVuZ3RoKHAuZGF0YSwgMzIpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0bmQgPSB1dGlscy5tcE5vcm1hbGl6ZShwLmRhdGEpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKG5kLnRvU3RyaW5nKCdiaW5hcnknKSAhPT1cblx0XHRcdCAgICBwLmRhdGEudG9TdHJpbmcoJ2JpbmFyeScpKSB7XG5cdFx0XHRcdHAuZGF0YSA9IG5kO1xuXHRcdFx0XHRub3JtYWxpemVkID0gZmFsc2U7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0aWYgKG5vcm1hbGl6ZWQpXG5cdFx0a2V5Ll9yZmM0MjUzQ2FjaGUgPSBzc2hidWYudG9CdWZmZXIoKTtcblxuXHRpZiAocGFydGlhbCAmJiB0eXBlb2YgKHBhcnRpYWwpID09PSAnb2JqZWN0Jykge1xuXHRcdHBhcnRpYWwucmVtYWluZGVyID0gc3NoYnVmLnJlbWFpbmRlcigpO1xuXHRcdHBhcnRpYWwuY29uc3VtZWQgPSBzc2hidWYuX29mZnNldDtcblx0fVxuXG5cdHJldHVybiAobmV3IENvbnN0cnVjdG9yKGtleSkpO1xufVxuXG5mdW5jdGlvbiB3cml0ZShrZXksIG9wdGlvbnMpIHtcblx0YXNzZXJ0Lm9iamVjdChrZXkpO1xuXG5cdHZhciBhbGcgPSBrZXlUeXBlVG9BbGcoa2V5KTtcblx0dmFyIGk7XG5cblx0dmFyIGFsZ0luZm8gPSBhbGdzLmluZm9ba2V5LnR5cGVdO1xuXHRpZiAoUHJpdmF0ZUtleS5pc1ByaXZhdGVLZXkoa2V5KSlcblx0XHRhbGdJbmZvID0gYWxncy5wcml2SW5mb1trZXkudHlwZV07XG5cdHZhciBwYXJ0cyA9IGFsZ0luZm8ucGFydHM7XG5cblx0dmFyIGJ1ZiA9IG5ldyBTU0hCdWZmZXIoe30pO1xuXG5cdGJ1Zi53cml0ZVN0cmluZyhhbGcpO1xuXG5cdGZvciAoaSA9IDA7IGkgPCBwYXJ0cy5sZW5ndGg7ICsraSkge1xuXHRcdHZhciBkYXRhID0ga2V5LnBhcnRbcGFydHNbaV1dLmRhdGE7XG5cdFx0aWYgKGFsZ0luZm8ubm9ybWFsaXplICE9PSBmYWxzZSkge1xuXHRcdFx0aWYgKGtleS50eXBlID09PSAnZWQyNTUxOScpXG5cdFx0XHRcdGRhdGEgPSB1dGlscy56ZXJvUGFkVG9MZW5ndGgoZGF0YSwgMzIpO1xuXHRcdFx0ZWxzZVxuXHRcdFx0XHRkYXRhID0gdXRpbHMubXBOb3JtYWxpemUoZGF0YSk7XG5cdFx0fVxuXHRcdGlmIChrZXkudHlwZSA9PT0gJ2VkMjU1MTknICYmIHBhcnRzW2ldID09PSAnaycpXG5cdFx0XHRkYXRhID0gQnVmZmVyLmNvbmNhdChbZGF0YSwga2V5LnBhcnQuQS5kYXRhXSk7XG5cdFx0YnVmLndyaXRlQnVmZmVyKGRhdGEpO1xuXHR9XG5cblx0cmV0dXJuIChidWYudG9CdWZmZXIoKSk7XG59XG4iLCIvLyBDb3B5cmlnaHQgMjAxNiBKb3llbnQsIEluYy5cblxubW9kdWxlLmV4cG9ydHMgPSBDZXJ0aWZpY2F0ZTtcblxudmFyIGFzc2VydCA9IHJlcXVpcmUoJ2Fzc2VydC1wbHVzJyk7XG52YXIgQnVmZmVyID0gcmVxdWlyZSgnc2FmZXItYnVmZmVyJykuQnVmZmVyO1xudmFyIGFsZ3MgPSByZXF1aXJlKCcuL2FsZ3MnKTtcbnZhciBjcnlwdG8gPSByZXF1aXJlKCdjcnlwdG8nKTtcbnZhciBGaW5nZXJwcmludCA9IHJlcXVpcmUoJy4vZmluZ2VycHJpbnQnKTtcbnZhciBTaWduYXR1cmUgPSByZXF1aXJlKCcuL3NpZ25hdHVyZScpO1xudmFyIGVycnMgPSByZXF1aXJlKCcuL2Vycm9ycycpO1xudmFyIHV0aWwgPSByZXF1aXJlKCd1dGlsJyk7XG52YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XG52YXIgS2V5ID0gcmVxdWlyZSgnLi9rZXknKTtcbnZhciBQcml2YXRlS2V5ID0gcmVxdWlyZSgnLi9wcml2YXRlLWtleScpO1xudmFyIElkZW50aXR5ID0gcmVxdWlyZSgnLi9pZGVudGl0eScpO1xuXG52YXIgZm9ybWF0cyA9IHt9O1xuZm9ybWF0c1snb3BlbnNzaCddID0gcmVxdWlyZSgnLi9mb3JtYXRzL29wZW5zc2gtY2VydCcpO1xuZm9ybWF0c1sneDUwOSddID0gcmVxdWlyZSgnLi9mb3JtYXRzL3g1MDknKTtcbmZvcm1hdHNbJ3BlbSddID0gcmVxdWlyZSgnLi9mb3JtYXRzL3g1MDktcGVtJyk7XG5cbnZhciBDZXJ0aWZpY2F0ZVBhcnNlRXJyb3IgPSBlcnJzLkNlcnRpZmljYXRlUGFyc2VFcnJvcjtcbnZhciBJbnZhbGlkQWxnb3JpdGhtRXJyb3IgPSBlcnJzLkludmFsaWRBbGdvcml0aG1FcnJvcjtcblxuZnVuY3Rpb24gQ2VydGlmaWNhdGUob3B0cykge1xuXHRhc3NlcnQub2JqZWN0KG9wdHMsICdvcHRpb25zJyk7XG5cdGFzc2VydC5hcnJheU9mT2JqZWN0KG9wdHMuc3ViamVjdHMsICdvcHRpb25zLnN1YmplY3RzJyk7XG5cdHV0aWxzLmFzc2VydENvbXBhdGlibGUob3B0cy5zdWJqZWN0c1swXSwgSWRlbnRpdHksIFsxLCAwXSxcblx0ICAgICdvcHRpb25zLnN1YmplY3RzJyk7XG5cdHV0aWxzLmFzc2VydENvbXBhdGlibGUob3B0cy5zdWJqZWN0S2V5LCBLZXksIFsxLCAwXSxcblx0ICAgICdvcHRpb25zLnN1YmplY3RLZXknKTtcblx0dXRpbHMuYXNzZXJ0Q29tcGF0aWJsZShvcHRzLmlzc3VlciwgSWRlbnRpdHksIFsxLCAwXSwgJ29wdGlvbnMuaXNzdWVyJyk7XG5cdGlmIChvcHRzLmlzc3VlcktleSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0dXRpbHMuYXNzZXJ0Q29tcGF0aWJsZShvcHRzLmlzc3VlcktleSwgS2V5LCBbMSwgMF0sXG5cdFx0ICAgICdvcHRpb25zLmlzc3VlcktleScpO1xuXHR9XG5cdGFzc2VydC5vYmplY3Qob3B0cy5zaWduYXR1cmVzLCAnb3B0aW9ucy5zaWduYXR1cmVzJyk7XG5cdGFzc2VydC5idWZmZXIob3B0cy5zZXJpYWwsICdvcHRpb25zLnNlcmlhbCcpO1xuXHRhc3NlcnQuZGF0ZShvcHRzLnZhbGlkRnJvbSwgJ29wdGlvbnMudmFsaWRGcm9tJyk7XG5cdGFzc2VydC5kYXRlKG9wdHMudmFsaWRVbnRpbCwgJ29wdG9ucy52YWxpZFVudGlsJyk7XG5cblx0YXNzZXJ0Lm9wdGlvbmFsQXJyYXlPZlN0cmluZyhvcHRzLnB1cnBvc2VzLCAnb3B0aW9ucy5wdXJwb3NlcycpO1xuXG5cdHRoaXMuX2hhc2hDYWNoZSA9IHt9O1xuXG5cdHRoaXMuc3ViamVjdHMgPSBvcHRzLnN1YmplY3RzO1xuXHR0aGlzLmlzc3VlciA9IG9wdHMuaXNzdWVyO1xuXHR0aGlzLnN1YmplY3RLZXkgPSBvcHRzLnN1YmplY3RLZXk7XG5cdHRoaXMuaXNzdWVyS2V5ID0gb3B0cy5pc3N1ZXJLZXk7XG5cdHRoaXMuc2lnbmF0dXJlcyA9IG9wdHMuc2lnbmF0dXJlcztcblx0dGhpcy5zZXJpYWwgPSBvcHRzLnNlcmlhbDtcblx0dGhpcy52YWxpZEZyb20gPSBvcHRzLnZhbGlkRnJvbTtcblx0dGhpcy52YWxpZFVudGlsID0gb3B0cy52YWxpZFVudGlsO1xuXHR0aGlzLnB1cnBvc2VzID0gb3B0cy5wdXJwb3Nlcztcbn1cblxuQ2VydGlmaWNhdGUuZm9ybWF0cyA9IGZvcm1hdHM7XG5cbkNlcnRpZmljYXRlLnByb3RvdHlwZS50b0J1ZmZlciA9IGZ1bmN0aW9uIChmb3JtYXQsIG9wdGlvbnMpIHtcblx0aWYgKGZvcm1hdCA9PT0gdW5kZWZpbmVkKVxuXHRcdGZvcm1hdCA9ICd4NTA5Jztcblx0YXNzZXJ0LnN0cmluZyhmb3JtYXQsICdmb3JtYXQnKTtcblx0YXNzZXJ0Lm9iamVjdChmb3JtYXRzW2Zvcm1hdF0sICdmb3JtYXRzW2Zvcm1hdF0nKTtcblx0YXNzZXJ0Lm9wdGlvbmFsT2JqZWN0KG9wdGlvbnMsICdvcHRpb25zJyk7XG5cblx0cmV0dXJuIChmb3JtYXRzW2Zvcm1hdF0ud3JpdGUodGhpcywgb3B0aW9ucykpO1xufTtcblxuQ2VydGlmaWNhdGUucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gKGZvcm1hdCwgb3B0aW9ucykge1xuXHRpZiAoZm9ybWF0ID09PSB1bmRlZmluZWQpXG5cdFx0Zm9ybWF0ID0gJ3BlbSc7XG5cdHJldHVybiAodGhpcy50b0J1ZmZlcihmb3JtYXQsIG9wdGlvbnMpLnRvU3RyaW5nKCkpO1xufTtcblxuQ2VydGlmaWNhdGUucHJvdG90eXBlLmZpbmdlcnByaW50ID0gZnVuY3Rpb24gKGFsZ28pIHtcblx0aWYgKGFsZ28gPT09IHVuZGVmaW5lZClcblx0XHRhbGdvID0gJ3NoYTI1Nic7XG5cdGFzc2VydC5zdHJpbmcoYWxnbywgJ2FsZ29yaXRobScpO1xuXHR2YXIgb3B0cyA9IHtcblx0XHR0eXBlOiAnY2VydGlmaWNhdGUnLFxuXHRcdGhhc2g6IHRoaXMuaGFzaChhbGdvKSxcblx0XHRhbGdvcml0aG06IGFsZ29cblx0fTtcblx0cmV0dXJuIChuZXcgRmluZ2VycHJpbnQob3B0cykpO1xufTtcblxuQ2VydGlmaWNhdGUucHJvdG90eXBlLmhhc2ggPSBmdW5jdGlvbiAoYWxnbykge1xuXHRhc3NlcnQuc3RyaW5nKGFsZ28sICdhbGdvcml0aG0nKTtcblx0YWxnbyA9IGFsZ28udG9Mb3dlckNhc2UoKTtcblx0aWYgKGFsZ3MuaGFzaEFsZ3NbYWxnb10gPT09IHVuZGVmaW5lZClcblx0XHR0aHJvdyAobmV3IEludmFsaWRBbGdvcml0aG1FcnJvcihhbGdvKSk7XG5cblx0aWYgKHRoaXMuX2hhc2hDYWNoZVthbGdvXSlcblx0XHRyZXR1cm4gKHRoaXMuX2hhc2hDYWNoZVthbGdvXSk7XG5cblx0dmFyIGhhc2ggPSBjcnlwdG8uY3JlYXRlSGFzaChhbGdvKS5cblx0ICAgIHVwZGF0ZSh0aGlzLnRvQnVmZmVyKCd4NTA5JykpLmRpZ2VzdCgpO1xuXHR0aGlzLl9oYXNoQ2FjaGVbYWxnb10gPSBoYXNoO1xuXHRyZXR1cm4gKGhhc2gpO1xufTtcblxuQ2VydGlmaWNhdGUucHJvdG90eXBlLmlzRXhwaXJlZCA9IGZ1bmN0aW9uICh3aGVuKSB7XG5cdGlmICh3aGVuID09PSB1bmRlZmluZWQpXG5cdFx0d2hlbiA9IG5ldyBEYXRlKCk7XG5cdHJldHVybiAoISgod2hlbi5nZXRUaW1lKCkgPj0gdGhpcy52YWxpZEZyb20uZ2V0VGltZSgpKSAmJlxuXHRcdCh3aGVuLmdldFRpbWUoKSA8IHRoaXMudmFsaWRVbnRpbC5nZXRUaW1lKCkpKSk7XG59O1xuXG5DZXJ0aWZpY2F0ZS5wcm90b3R5cGUuaXNTaWduZWRCeSA9IGZ1bmN0aW9uIChpc3N1ZXJDZXJ0KSB7XG5cdHV0aWxzLmFzc2VydENvbXBhdGlibGUoaXNzdWVyQ2VydCwgQ2VydGlmaWNhdGUsIFsxLCAwXSwgJ2lzc3VlcicpO1xuXG5cdGlmICghdGhpcy5pc3N1ZXIuZXF1YWxzKGlzc3VlckNlcnQuc3ViamVjdHNbMF0pKVxuXHRcdHJldHVybiAoZmFsc2UpO1xuXHRpZiAodGhpcy5pc3N1ZXIucHVycG9zZXMgJiYgdGhpcy5pc3N1ZXIucHVycG9zZXMubGVuZ3RoID4gMCAmJlxuXHQgICAgdGhpcy5pc3N1ZXIucHVycG9zZXMuaW5kZXhPZignY2EnKSA9PT0gLTEpIHtcblx0XHRyZXR1cm4gKGZhbHNlKTtcblx0fVxuXG5cdHJldHVybiAodGhpcy5pc1NpZ25lZEJ5S2V5KGlzc3VlckNlcnQuc3ViamVjdEtleSkpO1xufTtcblxuQ2VydGlmaWNhdGUucHJvdG90eXBlLmdldEV4dGVuc2lvbiA9IGZ1bmN0aW9uIChrZXlPck9pZCkge1xuXHRhc3NlcnQuc3RyaW5nKGtleU9yT2lkLCAna2V5T3JPaWQnKTtcblx0dmFyIGV4dCA9IHRoaXMuZ2V0RXh0ZW5zaW9ucygpLmZpbHRlcihmdW5jdGlvbiAobWF5YmVFeHQpIHtcblx0XHRpZiAobWF5YmVFeHQuZm9ybWF0ID09PSAneDUwOScpXG5cdFx0XHRyZXR1cm4gKG1heWJlRXh0Lm9pZCA9PT0ga2V5T3JPaWQpO1xuXHRcdGlmIChtYXliZUV4dC5mb3JtYXQgPT09ICdvcGVuc3NoJylcblx0XHRcdHJldHVybiAobWF5YmVFeHQubmFtZSA9PT0ga2V5T3JPaWQpO1xuXHRcdHJldHVybiAoZmFsc2UpO1xuXHR9KVswXTtcblx0cmV0dXJuIChleHQpO1xufTtcblxuQ2VydGlmaWNhdGUucHJvdG90eXBlLmdldEV4dGVuc2lvbnMgPSBmdW5jdGlvbiAoKSB7XG5cdHZhciBleHRzID0gW107XG5cdHZhciB4NTA5ID0gdGhpcy5zaWduYXR1cmVzLng1MDk7XG5cdGlmICh4NTA5ICYmIHg1MDkuZXh0cmFzICYmIHg1MDkuZXh0cmFzLmV4dHMpIHtcblx0XHR4NTA5LmV4dHJhcy5leHRzLmZvckVhY2goZnVuY3Rpb24gKGV4dCkge1xuXHRcdFx0ZXh0LmZvcm1hdCA9ICd4NTA5Jztcblx0XHRcdGV4dHMucHVzaChleHQpO1xuXHRcdH0pO1xuXHR9XG5cdHZhciBvcGVuc3NoID0gdGhpcy5zaWduYXR1cmVzLm9wZW5zc2g7XG5cdGlmIChvcGVuc3NoICYmIG9wZW5zc2guZXh0cykge1xuXHRcdG9wZW5zc2guZXh0cy5mb3JFYWNoKGZ1bmN0aW9uIChleHQpIHtcblx0XHRcdGV4dC5mb3JtYXQgPSAnb3BlbnNzaCc7XG5cdFx0XHRleHRzLnB1c2goZXh0KTtcblx0XHR9KTtcblx0fVxuXHRyZXR1cm4gKGV4dHMpO1xufTtcblxuQ2VydGlmaWNhdGUucHJvdG90eXBlLmlzU2lnbmVkQnlLZXkgPSBmdW5jdGlvbiAoaXNzdWVyS2V5KSB7XG5cdHV0aWxzLmFzc2VydENvbXBhdGlibGUoaXNzdWVyS2V5LCBLZXksIFsxLCAyXSwgJ2lzc3VlcktleScpO1xuXG5cdGlmICh0aGlzLmlzc3VlcktleSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuICh0aGlzLmlzc3VlcktleS5cblx0XHQgICAgZmluZ2VycHJpbnQoJ3NoYTUxMicpLm1hdGNoZXMoaXNzdWVyS2V5KSk7XG5cdH1cblxuXHR2YXIgZm10ID0gT2JqZWN0LmtleXModGhpcy5zaWduYXR1cmVzKVswXTtcblx0dmFyIHZhbGlkID0gZm9ybWF0c1tmbXRdLnZlcmlmeSh0aGlzLCBpc3N1ZXJLZXkpO1xuXHRpZiAodmFsaWQpXG5cdFx0dGhpcy5pc3N1ZXJLZXkgPSBpc3N1ZXJLZXk7XG5cdHJldHVybiAodmFsaWQpO1xufTtcblxuQ2VydGlmaWNhdGUucHJvdG90eXBlLnNpZ25XaXRoID0gZnVuY3Rpb24gKGtleSkge1xuXHR1dGlscy5hc3NlcnRDb21wYXRpYmxlKGtleSwgUHJpdmF0ZUtleSwgWzEsIDJdLCAna2V5Jyk7XG5cdHZhciBmbXRzID0gT2JqZWN0LmtleXMoZm9ybWF0cyk7XG5cdHZhciBkaWRPbmUgPSBmYWxzZTtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBmbXRzLmxlbmd0aDsgKytpKSB7XG5cdFx0aWYgKGZtdHNbaV0gIT09ICdwZW0nKSB7XG5cdFx0XHR2YXIgcmV0ID0gZm9ybWF0c1tmbXRzW2ldXS5zaWduKHRoaXMsIGtleSk7XG5cdFx0XHRpZiAocmV0ID09PSB0cnVlKVxuXHRcdFx0XHRkaWRPbmUgPSB0cnVlO1xuXHRcdH1cblx0fVxuXHRpZiAoIWRpZE9uZSkge1xuXHRcdHRocm93IChuZXcgRXJyb3IoJ0ZhaWxlZCB0byBzaWduIHRoZSBjZXJ0aWZpY2F0ZSBmb3IgYW55ICcgK1xuXHRcdCAgICAnYXZhaWxhYmxlIGNlcnRpZmljYXRlIGZvcm1hdHMnKSk7XG5cdH1cbn07XG5cbkNlcnRpZmljYXRlLmNyZWF0ZVNlbGZTaWduZWQgPSBmdW5jdGlvbiAoc3ViamVjdE9yU3ViamVjdHMsIGtleSwgb3B0aW9ucykge1xuXHR2YXIgc3ViamVjdHM7XG5cdGlmIChBcnJheS5pc0FycmF5KHN1YmplY3RPclN1YmplY3RzKSlcblx0XHRzdWJqZWN0cyA9IHN1YmplY3RPclN1YmplY3RzO1xuXHRlbHNlXG5cdFx0c3ViamVjdHMgPSBbc3ViamVjdE9yU3ViamVjdHNdO1xuXG5cdGFzc2VydC5hcnJheU9mT2JqZWN0KHN1YmplY3RzKTtcblx0c3ViamVjdHMuZm9yRWFjaChmdW5jdGlvbiAoc3ViamVjdCkge1xuXHRcdHV0aWxzLmFzc2VydENvbXBhdGlibGUoc3ViamVjdCwgSWRlbnRpdHksIFsxLCAwXSwgJ3N1YmplY3QnKTtcblx0fSk7XG5cblx0dXRpbHMuYXNzZXJ0Q29tcGF0aWJsZShrZXksIFByaXZhdGVLZXksIFsxLCAyXSwgJ3ByaXZhdGUga2V5Jyk7XG5cblx0YXNzZXJ0Lm9wdGlvbmFsT2JqZWN0KG9wdGlvbnMsICdvcHRpb25zJyk7XG5cdGlmIChvcHRpb25zID09PSB1bmRlZmluZWQpXG5cdFx0b3B0aW9ucyA9IHt9O1xuXHRhc3NlcnQub3B0aW9uYWxPYmplY3Qob3B0aW9ucy52YWxpZEZyb20sICdvcHRpb25zLnZhbGlkRnJvbScpO1xuXHRhc3NlcnQub3B0aW9uYWxPYmplY3Qob3B0aW9ucy52YWxpZFVudGlsLCAnb3B0aW9ucy52YWxpZFVudGlsJyk7XG5cdHZhciB2YWxpZEZyb20gPSBvcHRpb25zLnZhbGlkRnJvbTtcblx0dmFyIHZhbGlkVW50aWwgPSBvcHRpb25zLnZhbGlkVW50aWw7XG5cdGlmICh2YWxpZEZyb20gPT09IHVuZGVmaW5lZClcblx0XHR2YWxpZEZyb20gPSBuZXcgRGF0ZSgpO1xuXHRpZiAodmFsaWRVbnRpbCA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0YXNzZXJ0Lm9wdGlvbmFsTnVtYmVyKG9wdGlvbnMubGlmZXRpbWUsICdvcHRpb25zLmxpZmV0aW1lJyk7XG5cdFx0dmFyIGxpZmV0aW1lID0gb3B0aW9ucy5saWZldGltZTtcblx0XHRpZiAobGlmZXRpbWUgPT09IHVuZGVmaW5lZClcblx0XHRcdGxpZmV0aW1lID0gMTAqMzY1KjI0KjM2MDA7XG5cdFx0dmFsaWRVbnRpbCA9IG5ldyBEYXRlKCk7XG5cdFx0dmFsaWRVbnRpbC5zZXRUaW1lKHZhbGlkVW50aWwuZ2V0VGltZSgpICsgbGlmZXRpbWUqMTAwMCk7XG5cdH1cblx0YXNzZXJ0Lm9wdGlvbmFsQnVmZmVyKG9wdGlvbnMuc2VyaWFsLCAnb3B0aW9ucy5zZXJpYWwnKTtcblx0dmFyIHNlcmlhbCA9IG9wdGlvbnMuc2VyaWFsO1xuXHRpZiAoc2VyaWFsID09PSB1bmRlZmluZWQpXG5cdFx0c2VyaWFsID0gQnVmZmVyLmZyb20oJzAwMDAwMDAwMDAwMDAwMDEnLCAnaGV4Jyk7XG5cblx0dmFyIHB1cnBvc2VzID0gb3B0aW9ucy5wdXJwb3Nlcztcblx0aWYgKHB1cnBvc2VzID09PSB1bmRlZmluZWQpXG5cdFx0cHVycG9zZXMgPSBbXTtcblxuXHRpZiAocHVycG9zZXMuaW5kZXhPZignc2lnbmF0dXJlJykgPT09IC0xKVxuXHRcdHB1cnBvc2VzLnB1c2goJ3NpZ25hdHVyZScpO1xuXG5cdC8qIFNlbGYtc2lnbmVkIGNlcnRzIGFyZSBhbHdheXMgQ0FzLiAqL1xuXHRpZiAocHVycG9zZXMuaW5kZXhPZignY2EnKSA9PT0gLTEpXG5cdFx0cHVycG9zZXMucHVzaCgnY2EnKTtcblx0aWYgKHB1cnBvc2VzLmluZGV4T2YoJ2NybCcpID09PSAtMSlcblx0XHRwdXJwb3Nlcy5wdXNoKCdjcmwnKTtcblxuXHQvKlxuXHQgKiBJZiB3ZSB3ZXJlbid0IGV4cGxpY2l0bHkgZ2l2ZW4gYW55IG90aGVyIHB1cnBvc2VzLCBkbyB0aGUgc2Vuc2libGVcblx0ICogdGhpbmcgYW5kIGFkZCBzb21lIGJhc2ljIG9uZXMgZGVwZW5kaW5nIG9uIHRoZSBzdWJqZWN0IHR5cGUuXG5cdCAqL1xuXHRpZiAocHVycG9zZXMubGVuZ3RoIDw9IDMpIHtcblx0XHR2YXIgaG9zdFN1YmplY3RzID0gc3ViamVjdHMuZmlsdGVyKGZ1bmN0aW9uIChzdWJqZWN0KSB7XG5cdFx0XHRyZXR1cm4gKHN1YmplY3QudHlwZSA9PT0gJ2hvc3QnKTtcblx0XHR9KTtcblx0XHR2YXIgdXNlclN1YmplY3RzID0gc3ViamVjdHMuZmlsdGVyKGZ1bmN0aW9uIChzdWJqZWN0KSB7XG5cdFx0XHRyZXR1cm4gKHN1YmplY3QudHlwZSA9PT0gJ3VzZXInKTtcblx0XHR9KTtcblx0XHRpZiAoaG9zdFN1YmplY3RzLmxlbmd0aCA+IDApIHtcblx0XHRcdGlmIChwdXJwb3Nlcy5pbmRleE9mKCdzZXJ2ZXJBdXRoJykgPT09IC0xKVxuXHRcdFx0XHRwdXJwb3Nlcy5wdXNoKCdzZXJ2ZXJBdXRoJyk7XG5cdFx0fVxuXHRcdGlmICh1c2VyU3ViamVjdHMubGVuZ3RoID4gMCkge1xuXHRcdFx0aWYgKHB1cnBvc2VzLmluZGV4T2YoJ2NsaWVudEF1dGgnKSA9PT0gLTEpXG5cdFx0XHRcdHB1cnBvc2VzLnB1c2goJ2NsaWVudEF1dGgnKTtcblx0XHR9XG5cdFx0aWYgKHVzZXJTdWJqZWN0cy5sZW5ndGggPiAwIHx8IGhvc3RTdWJqZWN0cy5sZW5ndGggPiAwKSB7XG5cdFx0XHRpZiAocHVycG9zZXMuaW5kZXhPZigna2V5QWdyZWVtZW50JykgPT09IC0xKVxuXHRcdFx0XHRwdXJwb3Nlcy5wdXNoKCdrZXlBZ3JlZW1lbnQnKTtcblx0XHRcdGlmIChrZXkudHlwZSA9PT0gJ3JzYScgJiZcblx0XHRcdCAgICBwdXJwb3Nlcy5pbmRleE9mKCdlbmNyeXB0aW9uJykgPT09IC0xKVxuXHRcdFx0XHRwdXJwb3Nlcy5wdXNoKCdlbmNyeXB0aW9uJyk7XG5cdFx0fVxuXHR9XG5cblx0dmFyIGNlcnQgPSBuZXcgQ2VydGlmaWNhdGUoe1xuXHRcdHN1YmplY3RzOiBzdWJqZWN0cyxcblx0XHRpc3N1ZXI6IHN1YmplY3RzWzBdLFxuXHRcdHN1YmplY3RLZXk6IGtleS50b1B1YmxpYygpLFxuXHRcdGlzc3VlcktleToga2V5LnRvUHVibGljKCksXG5cdFx0c2lnbmF0dXJlczoge30sXG5cdFx0c2VyaWFsOiBzZXJpYWwsXG5cdFx0dmFsaWRGcm9tOiB2YWxpZEZyb20sXG5cdFx0dmFsaWRVbnRpbDogdmFsaWRVbnRpbCxcblx0XHRwdXJwb3NlczogcHVycG9zZXNcblx0fSk7XG5cdGNlcnQuc2lnbldpdGgoa2V5KTtcblxuXHRyZXR1cm4gKGNlcnQpO1xufTtcblxuQ2VydGlmaWNhdGUuY3JlYXRlID1cbiAgICBmdW5jdGlvbiAoc3ViamVjdE9yU3ViamVjdHMsIGtleSwgaXNzdWVyLCBpc3N1ZXJLZXksIG9wdGlvbnMpIHtcblx0dmFyIHN1YmplY3RzO1xuXHRpZiAoQXJyYXkuaXNBcnJheShzdWJqZWN0T3JTdWJqZWN0cykpXG5cdFx0c3ViamVjdHMgPSBzdWJqZWN0T3JTdWJqZWN0cztcblx0ZWxzZVxuXHRcdHN1YmplY3RzID0gW3N1YmplY3RPclN1YmplY3RzXTtcblxuXHRhc3NlcnQuYXJyYXlPZk9iamVjdChzdWJqZWN0cyk7XG5cdHN1YmplY3RzLmZvckVhY2goZnVuY3Rpb24gKHN1YmplY3QpIHtcblx0XHR1dGlscy5hc3NlcnRDb21wYXRpYmxlKHN1YmplY3QsIElkZW50aXR5LCBbMSwgMF0sICdzdWJqZWN0Jyk7XG5cdH0pO1xuXG5cdHV0aWxzLmFzc2VydENvbXBhdGlibGUoa2V5LCBLZXksIFsxLCAwXSwgJ2tleScpO1xuXHRpZiAoUHJpdmF0ZUtleS5pc1ByaXZhdGVLZXkoa2V5KSlcblx0XHRrZXkgPSBrZXkudG9QdWJsaWMoKTtcblx0dXRpbHMuYXNzZXJ0Q29tcGF0aWJsZShpc3N1ZXIsIElkZW50aXR5LCBbMSwgMF0sICdpc3N1ZXInKTtcblx0dXRpbHMuYXNzZXJ0Q29tcGF0aWJsZShpc3N1ZXJLZXksIFByaXZhdGVLZXksIFsxLCAyXSwgJ2lzc3VlciBrZXknKTtcblxuXHRhc3NlcnQub3B0aW9uYWxPYmplY3Qob3B0aW9ucywgJ29wdGlvbnMnKTtcblx0aWYgKG9wdGlvbnMgPT09IHVuZGVmaW5lZClcblx0XHRvcHRpb25zID0ge307XG5cdGFzc2VydC5vcHRpb25hbE9iamVjdChvcHRpb25zLnZhbGlkRnJvbSwgJ29wdGlvbnMudmFsaWRGcm9tJyk7XG5cdGFzc2VydC5vcHRpb25hbE9iamVjdChvcHRpb25zLnZhbGlkVW50aWwsICdvcHRpb25zLnZhbGlkVW50aWwnKTtcblx0dmFyIHZhbGlkRnJvbSA9IG9wdGlvbnMudmFsaWRGcm9tO1xuXHR2YXIgdmFsaWRVbnRpbCA9IG9wdGlvbnMudmFsaWRVbnRpbDtcblx0aWYgKHZhbGlkRnJvbSA9PT0gdW5kZWZpbmVkKVxuXHRcdHZhbGlkRnJvbSA9IG5ldyBEYXRlKCk7XG5cdGlmICh2YWxpZFVudGlsID09PSB1bmRlZmluZWQpIHtcblx0XHRhc3NlcnQub3B0aW9uYWxOdW1iZXIob3B0aW9ucy5saWZldGltZSwgJ29wdGlvbnMubGlmZXRpbWUnKTtcblx0XHR2YXIgbGlmZXRpbWUgPSBvcHRpb25zLmxpZmV0aW1lO1xuXHRcdGlmIChsaWZldGltZSA9PT0gdW5kZWZpbmVkKVxuXHRcdFx0bGlmZXRpbWUgPSAxMCozNjUqMjQqMzYwMDtcblx0XHR2YWxpZFVudGlsID0gbmV3IERhdGUoKTtcblx0XHR2YWxpZFVudGlsLnNldFRpbWUodmFsaWRVbnRpbC5nZXRUaW1lKCkgKyBsaWZldGltZSoxMDAwKTtcblx0fVxuXHRhc3NlcnQub3B0aW9uYWxCdWZmZXIob3B0aW9ucy5zZXJpYWwsICdvcHRpb25zLnNlcmlhbCcpO1xuXHR2YXIgc2VyaWFsID0gb3B0aW9ucy5zZXJpYWw7XG5cdGlmIChzZXJpYWwgPT09IHVuZGVmaW5lZClcblx0XHRzZXJpYWwgPSBCdWZmZXIuZnJvbSgnMDAwMDAwMDAwMDAwMDAwMScsICdoZXgnKTtcblxuXHR2YXIgcHVycG9zZXMgPSBvcHRpb25zLnB1cnBvc2VzO1xuXHRpZiAocHVycG9zZXMgPT09IHVuZGVmaW5lZClcblx0XHRwdXJwb3NlcyA9IFtdO1xuXG5cdGlmIChwdXJwb3Nlcy5pbmRleE9mKCdzaWduYXR1cmUnKSA9PT0gLTEpXG5cdFx0cHVycG9zZXMucHVzaCgnc2lnbmF0dXJlJyk7XG5cblx0aWYgKG9wdGlvbnMuY2EgPT09IHRydWUpIHtcblx0XHRpZiAocHVycG9zZXMuaW5kZXhPZignY2EnKSA9PT0gLTEpXG5cdFx0XHRwdXJwb3Nlcy5wdXNoKCdjYScpO1xuXHRcdGlmIChwdXJwb3Nlcy5pbmRleE9mKCdjcmwnKSA9PT0gLTEpXG5cdFx0XHRwdXJwb3Nlcy5wdXNoKCdjcmwnKTtcblx0fVxuXG5cdHZhciBob3N0U3ViamVjdHMgPSBzdWJqZWN0cy5maWx0ZXIoZnVuY3Rpb24gKHN1YmplY3QpIHtcblx0XHRyZXR1cm4gKHN1YmplY3QudHlwZSA9PT0gJ2hvc3QnKTtcblx0fSk7XG5cdHZhciB1c2VyU3ViamVjdHMgPSBzdWJqZWN0cy5maWx0ZXIoZnVuY3Rpb24gKHN1YmplY3QpIHtcblx0XHRyZXR1cm4gKHN1YmplY3QudHlwZSA9PT0gJ3VzZXInKTtcblx0fSk7XG5cdGlmIChob3N0U3ViamVjdHMubGVuZ3RoID4gMCkge1xuXHRcdGlmIChwdXJwb3Nlcy5pbmRleE9mKCdzZXJ2ZXJBdXRoJykgPT09IC0xKVxuXHRcdFx0cHVycG9zZXMucHVzaCgnc2VydmVyQXV0aCcpO1xuXHR9XG5cdGlmICh1c2VyU3ViamVjdHMubGVuZ3RoID4gMCkge1xuXHRcdGlmIChwdXJwb3Nlcy5pbmRleE9mKCdjbGllbnRBdXRoJykgPT09IC0xKVxuXHRcdFx0cHVycG9zZXMucHVzaCgnY2xpZW50QXV0aCcpO1xuXHR9XG5cdGlmICh1c2VyU3ViamVjdHMubGVuZ3RoID4gMCB8fCBob3N0U3ViamVjdHMubGVuZ3RoID4gMCkge1xuXHRcdGlmIChwdXJwb3Nlcy5pbmRleE9mKCdrZXlBZ3JlZW1lbnQnKSA9PT0gLTEpXG5cdFx0XHRwdXJwb3Nlcy5wdXNoKCdrZXlBZ3JlZW1lbnQnKTtcblx0XHRpZiAoa2V5LnR5cGUgPT09ICdyc2EnICYmXG5cdFx0ICAgIHB1cnBvc2VzLmluZGV4T2YoJ2VuY3J5cHRpb24nKSA9PT0gLTEpXG5cdFx0XHRwdXJwb3Nlcy5wdXNoKCdlbmNyeXB0aW9uJyk7XG5cdH1cblxuXHR2YXIgY2VydCA9IG5ldyBDZXJ0aWZpY2F0ZSh7XG5cdFx0c3ViamVjdHM6IHN1YmplY3RzLFxuXHRcdGlzc3VlcjogaXNzdWVyLFxuXHRcdHN1YmplY3RLZXk6IGtleSxcblx0XHRpc3N1ZXJLZXk6IGlzc3VlcktleS50b1B1YmxpYygpLFxuXHRcdHNpZ25hdHVyZXM6IHt9LFxuXHRcdHNlcmlhbDogc2VyaWFsLFxuXHRcdHZhbGlkRnJvbTogdmFsaWRGcm9tLFxuXHRcdHZhbGlkVW50aWw6IHZhbGlkVW50aWwsXG5cdFx0cHVycG9zZXM6IHB1cnBvc2VzXG5cdH0pO1xuXHRjZXJ0LnNpZ25XaXRoKGlzc3VlcktleSk7XG5cblx0cmV0dXJuIChjZXJ0KTtcbn07XG5cbkNlcnRpZmljYXRlLnBhcnNlID0gZnVuY3Rpb24gKGRhdGEsIGZvcm1hdCwgb3B0aW9ucykge1xuXHRpZiAodHlwZW9mIChkYXRhKSAhPT0gJ3N0cmluZycpXG5cdFx0YXNzZXJ0LmJ1ZmZlcihkYXRhLCAnZGF0YScpO1xuXHRpZiAoZm9ybWF0ID09PSB1bmRlZmluZWQpXG5cdFx0Zm9ybWF0ID0gJ2F1dG8nO1xuXHRhc3NlcnQuc3RyaW5nKGZvcm1hdCwgJ2Zvcm1hdCcpO1xuXHRpZiAodHlwZW9mIChvcHRpb25zKSA9PT0gJ3N0cmluZycpXG5cdFx0b3B0aW9ucyA9IHsgZmlsZW5hbWU6IG9wdGlvbnMgfTtcblx0YXNzZXJ0Lm9wdGlvbmFsT2JqZWN0KG9wdGlvbnMsICdvcHRpb25zJyk7XG5cdGlmIChvcHRpb25zID09PSB1bmRlZmluZWQpXG5cdFx0b3B0aW9ucyA9IHt9O1xuXHRhc3NlcnQub3B0aW9uYWxTdHJpbmcob3B0aW9ucy5maWxlbmFtZSwgJ29wdGlvbnMuZmlsZW5hbWUnKTtcblx0aWYgKG9wdGlvbnMuZmlsZW5hbWUgPT09IHVuZGVmaW5lZClcblx0XHRvcHRpb25zLmZpbGVuYW1lID0gJyh1bm5hbWVkKSc7XG5cblx0YXNzZXJ0Lm9iamVjdChmb3JtYXRzW2Zvcm1hdF0sICdmb3JtYXRzW2Zvcm1hdF0nKTtcblxuXHR0cnkge1xuXHRcdHZhciBrID0gZm9ybWF0c1tmb3JtYXRdLnJlYWQoZGF0YSwgb3B0aW9ucyk7XG5cdFx0cmV0dXJuIChrKTtcblx0fSBjYXRjaCAoZSkge1xuXHRcdHRocm93IChuZXcgQ2VydGlmaWNhdGVQYXJzZUVycm9yKG9wdGlvbnMuZmlsZW5hbWUsIGZvcm1hdCwgZSkpO1xuXHR9XG59O1xuXG5DZXJ0aWZpY2F0ZS5pc0NlcnRpZmljYXRlID0gZnVuY3Rpb24gKG9iaiwgdmVyKSB7XG5cdHJldHVybiAodXRpbHMuaXNDb21wYXRpYmxlKG9iaiwgQ2VydGlmaWNhdGUsIHZlcikpO1xufTtcblxuLypcbiAqIEFQSSB2ZXJzaW9ucyBmb3IgQ2VydGlmaWNhdGU6XG4gKiBbMSwwXSAtLSBpbml0aWFsIHZlclxuICogWzEsMV0gLS0gb3BlbnNzaCBmb3JtYXQgbm93IHVucGFja3MgZXh0ZW5zaW9uc1xuICovXG5DZXJ0aWZpY2F0ZS5wcm90b3R5cGUuX3NzaHBrQXBpVmVyc2lvbiA9IFsxLCAxXTtcblxuQ2VydGlmaWNhdGUuX29sZFZlcnNpb25EZXRlY3QgPSBmdW5jdGlvbiAob2JqKSB7XG5cdHJldHVybiAoWzEsIDBdKTtcbn07XG4iLCIvLyBDb3B5cmlnaHQgMjAxOCBKb3llbnQsIEluYy5cblxubW9kdWxlLmV4cG9ydHMgPSBLZXk7XG5cbnZhciBhc3NlcnQgPSByZXF1aXJlKCdhc3NlcnQtcGx1cycpO1xudmFyIGFsZ3MgPSByZXF1aXJlKCcuL2FsZ3MnKTtcbnZhciBjcnlwdG8gPSByZXF1aXJlKCdjcnlwdG8nKTtcbnZhciBGaW5nZXJwcmludCA9IHJlcXVpcmUoJy4vZmluZ2VycHJpbnQnKTtcbnZhciBTaWduYXR1cmUgPSByZXF1aXJlKCcuL3NpZ25hdHVyZScpO1xudmFyIERpZmZpZUhlbGxtYW4gPSByZXF1aXJlKCcuL2RoZScpLkRpZmZpZUhlbGxtYW47XG52YXIgZXJycyA9IHJlcXVpcmUoJy4vZXJyb3JzJyk7XG52YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XG52YXIgUHJpdmF0ZUtleSA9IHJlcXVpcmUoJy4vcHJpdmF0ZS1rZXknKTtcbnZhciBlZENvbXBhdDtcblxudHJ5IHtcblx0ZWRDb21wYXQgPSByZXF1aXJlKCcuL2VkLWNvbXBhdCcpO1xufSBjYXRjaCAoZSkge1xuXHQvKiBKdXN0IGNvbnRpbnVlIHRocm91Z2gsIGFuZCBiYWlsIG91dCBpZiB3ZSB0cnkgdG8gdXNlIGl0LiAqL1xufVxuXG52YXIgSW52YWxpZEFsZ29yaXRobUVycm9yID0gZXJycy5JbnZhbGlkQWxnb3JpdGhtRXJyb3I7XG52YXIgS2V5UGFyc2VFcnJvciA9IGVycnMuS2V5UGFyc2VFcnJvcjtcblxudmFyIGZvcm1hdHMgPSB7fTtcbmZvcm1hdHNbJ2F1dG8nXSA9IHJlcXVpcmUoJy4vZm9ybWF0cy9hdXRvJyk7XG5mb3JtYXRzWydwZW0nXSA9IHJlcXVpcmUoJy4vZm9ybWF0cy9wZW0nKTtcbmZvcm1hdHNbJ3BrY3MxJ10gPSByZXF1aXJlKCcuL2Zvcm1hdHMvcGtjczEnKTtcbmZvcm1hdHNbJ3BrY3M4J10gPSByZXF1aXJlKCcuL2Zvcm1hdHMvcGtjczgnKTtcbmZvcm1hdHNbJ3JmYzQyNTMnXSA9IHJlcXVpcmUoJy4vZm9ybWF0cy9yZmM0MjUzJyk7XG5mb3JtYXRzWydzc2gnXSA9IHJlcXVpcmUoJy4vZm9ybWF0cy9zc2gnKTtcbmZvcm1hdHNbJ3NzaC1wcml2YXRlJ10gPSByZXF1aXJlKCcuL2Zvcm1hdHMvc3NoLXByaXZhdGUnKTtcbmZvcm1hdHNbJ29wZW5zc2gnXSA9IGZvcm1hdHNbJ3NzaC1wcml2YXRlJ107XG5mb3JtYXRzWydkbnNzZWMnXSA9IHJlcXVpcmUoJy4vZm9ybWF0cy9kbnNzZWMnKTtcbmZvcm1hdHNbJ3B1dHR5J10gPSByZXF1aXJlKCcuL2Zvcm1hdHMvcHV0dHknKTtcbmZvcm1hdHNbJ3BwayddID0gZm9ybWF0c1sncHV0dHknXTtcblxuZnVuY3Rpb24gS2V5KG9wdHMpIHtcblx0YXNzZXJ0Lm9iamVjdChvcHRzLCAnb3B0aW9ucycpO1xuXHRhc3NlcnQuYXJyYXlPZk9iamVjdChvcHRzLnBhcnRzLCAnb3B0aW9ucy5wYXJ0cycpO1xuXHRhc3NlcnQuc3RyaW5nKG9wdHMudHlwZSwgJ29wdGlvbnMudHlwZScpO1xuXHRhc3NlcnQub3B0aW9uYWxTdHJpbmcob3B0cy5jb21tZW50LCAnb3B0aW9ucy5jb21tZW50Jyk7XG5cblx0dmFyIGFsZ0luZm8gPSBhbGdzLmluZm9bb3B0cy50eXBlXTtcblx0aWYgKHR5cGVvZiAoYWxnSW5mbykgIT09ICdvYmplY3QnKVxuXHRcdHRocm93IChuZXcgSW52YWxpZEFsZ29yaXRobUVycm9yKG9wdHMudHlwZSkpO1xuXG5cdHZhciBwYXJ0TG9va3VwID0ge307XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgb3B0cy5wYXJ0cy5sZW5ndGg7ICsraSkge1xuXHRcdHZhciBwYXJ0ID0gb3B0cy5wYXJ0c1tpXTtcblx0XHRwYXJ0TG9va3VwW3BhcnQubmFtZV0gPSBwYXJ0O1xuXHR9XG5cblx0dGhpcy50eXBlID0gb3B0cy50eXBlO1xuXHR0aGlzLnBhcnRzID0gb3B0cy5wYXJ0cztcblx0dGhpcy5wYXJ0ID0gcGFydExvb2t1cDtcblx0dGhpcy5jb21tZW50ID0gdW5kZWZpbmVkO1xuXHR0aGlzLnNvdXJjZSA9IG9wdHMuc291cmNlO1xuXG5cdC8qIGZvciBzcGVlZGluZyB1cCBoYXNoaW5nL2ZpbmdlcnByaW50IG9wZXJhdGlvbnMgKi9cblx0dGhpcy5fcmZjNDI1M0NhY2hlID0gb3B0cy5fcmZjNDI1M0NhY2hlO1xuXHR0aGlzLl9oYXNoQ2FjaGUgPSB7fTtcblxuXHR2YXIgc3o7XG5cdHRoaXMuY3VydmUgPSB1bmRlZmluZWQ7XG5cdGlmICh0aGlzLnR5cGUgPT09ICdlY2RzYScpIHtcblx0XHR2YXIgY3VydmUgPSB0aGlzLnBhcnQuY3VydmUuZGF0YS50b1N0cmluZygpO1xuXHRcdHRoaXMuY3VydmUgPSBjdXJ2ZTtcblx0XHRzeiA9IGFsZ3MuY3VydmVzW2N1cnZlXS5zaXplO1xuXHR9IGVsc2UgaWYgKHRoaXMudHlwZSA9PT0gJ2VkMjU1MTknIHx8IHRoaXMudHlwZSA9PT0gJ2N1cnZlMjU1MTknKSB7XG5cdFx0c3ogPSAyNTY7XG5cdFx0dGhpcy5jdXJ2ZSA9ICdjdXJ2ZTI1NTE5Jztcblx0fSBlbHNlIHtcblx0XHR2YXIgc3pQYXJ0ID0gdGhpcy5wYXJ0W2FsZ0luZm8uc2l6ZVBhcnRdO1xuXHRcdHN6ID0gc3pQYXJ0LmRhdGEubGVuZ3RoO1xuXHRcdHN6ID0gc3ogKiA4IC0gdXRpbHMuY291bnRaZXJvcyhzelBhcnQuZGF0YSk7XG5cdH1cblx0dGhpcy5zaXplID0gc3o7XG59XG5cbktleS5mb3JtYXRzID0gZm9ybWF0cztcblxuS2V5LnByb3RvdHlwZS50b0J1ZmZlciA9IGZ1bmN0aW9uIChmb3JtYXQsIG9wdGlvbnMpIHtcblx0aWYgKGZvcm1hdCA9PT0gdW5kZWZpbmVkKVxuXHRcdGZvcm1hdCA9ICdzc2gnO1xuXHRhc3NlcnQuc3RyaW5nKGZvcm1hdCwgJ2Zvcm1hdCcpO1xuXHRhc3NlcnQub2JqZWN0KGZvcm1hdHNbZm9ybWF0XSwgJ2Zvcm1hdHNbZm9ybWF0XScpO1xuXHRhc3NlcnQub3B0aW9uYWxPYmplY3Qob3B0aW9ucywgJ29wdGlvbnMnKTtcblxuXHRpZiAoZm9ybWF0ID09PSAncmZjNDI1MycpIHtcblx0XHRpZiAodGhpcy5fcmZjNDI1M0NhY2hlID09PSB1bmRlZmluZWQpXG5cdFx0XHR0aGlzLl9yZmM0MjUzQ2FjaGUgPSBmb3JtYXRzWydyZmM0MjUzJ10ud3JpdGUodGhpcyk7XG5cdFx0cmV0dXJuICh0aGlzLl9yZmM0MjUzQ2FjaGUpO1xuXHR9XG5cblx0cmV0dXJuIChmb3JtYXRzW2Zvcm1hdF0ud3JpdGUodGhpcywgb3B0aW9ucykpO1xufTtcblxuS2V5LnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uIChmb3JtYXQsIG9wdGlvbnMpIHtcblx0cmV0dXJuICh0aGlzLnRvQnVmZmVyKGZvcm1hdCwgb3B0aW9ucykudG9TdHJpbmcoKSk7XG59O1xuXG5LZXkucHJvdG90eXBlLmhhc2ggPSBmdW5jdGlvbiAoYWxnbywgdHlwZSkge1xuXHRhc3NlcnQuc3RyaW5nKGFsZ28sICdhbGdvcml0aG0nKTtcblx0YXNzZXJ0Lm9wdGlvbmFsU3RyaW5nKHR5cGUsICd0eXBlJyk7XG5cdGlmICh0eXBlID09PSB1bmRlZmluZWQpXG5cdFx0dHlwZSA9ICdzc2gnO1xuXHRhbGdvID0gYWxnby50b0xvd2VyQ2FzZSgpO1xuXHRpZiAoYWxncy5oYXNoQWxnc1thbGdvXSA9PT0gdW5kZWZpbmVkKVxuXHRcdHRocm93IChuZXcgSW52YWxpZEFsZ29yaXRobUVycm9yKGFsZ28pKTtcblxuXHR2YXIgY2FjaGVLZXkgPSBhbGdvICsgJ3x8JyArIHR5cGU7XG5cdGlmICh0aGlzLl9oYXNoQ2FjaGVbY2FjaGVLZXldKVxuXHRcdHJldHVybiAodGhpcy5faGFzaENhY2hlW2NhY2hlS2V5XSk7XG5cblx0dmFyIGJ1Zjtcblx0aWYgKHR5cGUgPT09ICdzc2gnKSB7XG5cdFx0YnVmID0gdGhpcy50b0J1ZmZlcigncmZjNDI1MycpO1xuXHR9IGVsc2UgaWYgKHR5cGUgPT09ICdzcGtpJykge1xuXHRcdGJ1ZiA9IGZvcm1hdHMucGtjczgucGtjczhUb0J1ZmZlcih0aGlzKTtcblx0fSBlbHNlIHtcblx0XHR0aHJvdyAobmV3IEVycm9yKCdIYXNoIHR5cGUgJyArIHR5cGUgKyAnIG5vdCBzdXBwb3J0ZWQnKSk7XG5cdH1cblx0dmFyIGhhc2ggPSBjcnlwdG8uY3JlYXRlSGFzaChhbGdvKS51cGRhdGUoYnVmKS5kaWdlc3QoKTtcblx0dGhpcy5faGFzaENhY2hlW2NhY2hlS2V5XSA9IGhhc2g7XG5cdHJldHVybiAoaGFzaCk7XG59O1xuXG5LZXkucHJvdG90eXBlLmZpbmdlcnByaW50ID0gZnVuY3Rpb24gKGFsZ28sIHR5cGUpIHtcblx0aWYgKGFsZ28gPT09IHVuZGVmaW5lZClcblx0XHRhbGdvID0gJ3NoYTI1Nic7XG5cdGlmICh0eXBlID09PSB1bmRlZmluZWQpXG5cdFx0dHlwZSA9ICdzc2gnO1xuXHRhc3NlcnQuc3RyaW5nKGFsZ28sICdhbGdvcml0aG0nKTtcblx0YXNzZXJ0LnN0cmluZyh0eXBlLCAndHlwZScpO1xuXHR2YXIgb3B0cyA9IHtcblx0XHR0eXBlOiAna2V5Jyxcblx0XHRoYXNoOiB0aGlzLmhhc2goYWxnbywgdHlwZSksXG5cdFx0YWxnb3JpdGhtOiBhbGdvLFxuXHRcdGhhc2hUeXBlOiB0eXBlXG5cdH07XG5cdHJldHVybiAobmV3IEZpbmdlcnByaW50KG9wdHMpKTtcbn07XG5cbktleS5wcm90b3R5cGUuZGVmYXVsdEhhc2hBbGdvcml0aG0gPSBmdW5jdGlvbiAoKSB7XG5cdHZhciBoYXNoQWxnbyA9ICdzaGExJztcblx0aWYgKHRoaXMudHlwZSA9PT0gJ3JzYScpXG5cdFx0aGFzaEFsZ28gPSAnc2hhMjU2Jztcblx0aWYgKHRoaXMudHlwZSA9PT0gJ2RzYScgJiYgdGhpcy5zaXplID4gMTAyNClcblx0XHRoYXNoQWxnbyA9ICdzaGEyNTYnO1xuXHRpZiAodGhpcy50eXBlID09PSAnZWQyNTUxOScpXG5cdFx0aGFzaEFsZ28gPSAnc2hhNTEyJztcblx0aWYgKHRoaXMudHlwZSA9PT0gJ2VjZHNhJykge1xuXHRcdGlmICh0aGlzLnNpemUgPD0gMjU2KVxuXHRcdFx0aGFzaEFsZ28gPSAnc2hhMjU2Jztcblx0XHRlbHNlIGlmICh0aGlzLnNpemUgPD0gMzg0KVxuXHRcdFx0aGFzaEFsZ28gPSAnc2hhMzg0Jztcblx0XHRlbHNlXG5cdFx0XHRoYXNoQWxnbyA9ICdzaGE1MTInO1xuXHR9XG5cdHJldHVybiAoaGFzaEFsZ28pO1xufTtcblxuS2V5LnByb3RvdHlwZS5jcmVhdGVWZXJpZnkgPSBmdW5jdGlvbiAoaGFzaEFsZ28pIHtcblx0aWYgKGhhc2hBbGdvID09PSB1bmRlZmluZWQpXG5cdFx0aGFzaEFsZ28gPSB0aGlzLmRlZmF1bHRIYXNoQWxnb3JpdGhtKCk7XG5cdGFzc2VydC5zdHJpbmcoaGFzaEFsZ28sICdoYXNoIGFsZ29yaXRobScpO1xuXG5cdC8qIEVEMjU1MTkgaXMgbm90IHN1cHBvcnRlZCBieSBPcGVuU1NMLCB1c2UgYSBqYXZhc2NyaXB0IGltcGwuICovXG5cdGlmICh0aGlzLnR5cGUgPT09ICdlZDI1NTE5JyAmJiBlZENvbXBhdCAhPT0gdW5kZWZpbmVkKVxuXHRcdHJldHVybiAobmV3IGVkQ29tcGF0LlZlcmlmaWVyKHRoaXMsIGhhc2hBbGdvKSk7XG5cdGlmICh0aGlzLnR5cGUgPT09ICdjdXJ2ZTI1NTE5Jylcblx0XHR0aHJvdyAobmV3IEVycm9yKCdDdXJ2ZTI1NTE5IGtleXMgYXJlIG5vdCBzdWl0YWJsZSBmb3IgJyArXG5cdFx0ICAgICdzaWduaW5nIG9yIHZlcmlmaWNhdGlvbicpKTtcblxuXHR2YXIgdiwgbm0sIGVycjtcblx0dHJ5IHtcblx0XHRubSA9IGhhc2hBbGdvLnRvVXBwZXJDYXNlKCk7XG5cdFx0diA9IGNyeXB0by5jcmVhdGVWZXJpZnkobm0pO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0ZXJyID0gZTtcblx0fVxuXHRpZiAodiA9PT0gdW5kZWZpbmVkIHx8IChlcnIgaW5zdGFuY2VvZiBFcnJvciAmJlxuXHQgICAgZXJyLm1lc3NhZ2UubWF0Y2goL1Vua25vd24gbWVzc2FnZSBkaWdlc3QvKSkpIHtcblx0XHRubSA9ICdSU0EtJztcblx0XHRubSArPSBoYXNoQWxnby50b1VwcGVyQ2FzZSgpO1xuXHRcdHYgPSBjcnlwdG8uY3JlYXRlVmVyaWZ5KG5tKTtcblx0fVxuXHRhc3NlcnQub2sodiwgJ2ZhaWxlZCB0byBjcmVhdGUgdmVyaWZpZXInKTtcblx0dmFyIG9sZFZlcmlmeSA9IHYudmVyaWZ5LmJpbmQodik7XG5cdHZhciBrZXkgPSB0aGlzLnRvQnVmZmVyKCdwa2NzOCcpO1xuXHR2YXIgY3VydmUgPSB0aGlzLmN1cnZlO1xuXHR2YXIgc2VsZiA9IHRoaXM7XG5cdHYudmVyaWZ5ID0gZnVuY3Rpb24gKHNpZ25hdHVyZSwgZm10KSB7XG5cdFx0aWYgKFNpZ25hdHVyZS5pc1NpZ25hdHVyZShzaWduYXR1cmUsIFsyLCAwXSkpIHtcblx0XHRcdGlmIChzaWduYXR1cmUudHlwZSAhPT0gc2VsZi50eXBlKVxuXHRcdFx0XHRyZXR1cm4gKGZhbHNlKTtcblx0XHRcdGlmIChzaWduYXR1cmUuaGFzaEFsZ29yaXRobSAmJlxuXHRcdFx0ICAgIHNpZ25hdHVyZS5oYXNoQWxnb3JpdGhtICE9PSBoYXNoQWxnbylcblx0XHRcdFx0cmV0dXJuIChmYWxzZSk7XG5cdFx0XHRpZiAoc2lnbmF0dXJlLmN1cnZlICYmIHNlbGYudHlwZSA9PT0gJ2VjZHNhJyAmJlxuXHRcdFx0ICAgIHNpZ25hdHVyZS5jdXJ2ZSAhPT0gY3VydmUpXG5cdFx0XHRcdHJldHVybiAoZmFsc2UpO1xuXHRcdFx0cmV0dXJuIChvbGRWZXJpZnkoa2V5LCBzaWduYXR1cmUudG9CdWZmZXIoJ2FzbjEnKSkpO1xuXG5cdFx0fSBlbHNlIGlmICh0eXBlb2YgKHNpZ25hdHVyZSkgPT09ICdzdHJpbmcnIHx8XG5cdFx0ICAgIEJ1ZmZlci5pc0J1ZmZlcihzaWduYXR1cmUpKSB7XG5cdFx0XHRyZXR1cm4gKG9sZFZlcmlmeShrZXksIHNpZ25hdHVyZSwgZm10KSk7XG5cblx0XHQvKlxuXHRcdCAqIEF2b2lkIGRvaW5nIHRoaXMgb24gdmFsaWQgYXJndW1lbnRzLCB3YWxraW5nIHRoZSBwcm90b3R5cGVcblx0XHQgKiBjaGFpbiBjYW4gYmUgcXVpdGUgc2xvdy5cblx0XHQgKi9cblx0XHR9IGVsc2UgaWYgKFNpZ25hdHVyZS5pc1NpZ25hdHVyZShzaWduYXR1cmUsIFsxLCAwXSkpIHtcblx0XHRcdHRocm93IChuZXcgRXJyb3IoJ3NpZ25hdHVyZSB3YXMgY3JlYXRlZCBieSB0b28gb2xkICcgK1xuXHRcdFx0ICAgICdhIHZlcnNpb24gb2Ygc3NocGsgYW5kIGNhbm5vdCBiZSB2ZXJpZmllZCcpKTtcblxuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aHJvdyAobmV3IFR5cGVFcnJvcignc2lnbmF0dXJlIG11c3QgYmUgYSBzdHJpbmcsICcgK1xuXHRcdFx0ICAgICdCdWZmZXIsIG9yIFNpZ25hdHVyZSBvYmplY3QnKSk7XG5cdFx0fVxuXHR9O1xuXHRyZXR1cm4gKHYpO1xufTtcblxuS2V5LnByb3RvdHlwZS5jcmVhdGVEaWZmaWVIZWxsbWFuID0gZnVuY3Rpb24gKCkge1xuXHRpZiAodGhpcy50eXBlID09PSAncnNhJylcblx0XHR0aHJvdyAobmV3IEVycm9yKCdSU0Ega2V5cyBkbyBub3Qgc3VwcG9ydCBEaWZmaWUtSGVsbG1hbicpKTtcblxuXHRyZXR1cm4gKG5ldyBEaWZmaWVIZWxsbWFuKHRoaXMpKTtcbn07XG5LZXkucHJvdG90eXBlLmNyZWF0ZURIID0gS2V5LnByb3RvdHlwZS5jcmVhdGVEaWZmaWVIZWxsbWFuO1xuXG5LZXkucGFyc2UgPSBmdW5jdGlvbiAoZGF0YSwgZm9ybWF0LCBvcHRpb25zKSB7XG5cdGlmICh0eXBlb2YgKGRhdGEpICE9PSAnc3RyaW5nJylcblx0XHRhc3NlcnQuYnVmZmVyKGRhdGEsICdkYXRhJyk7XG5cdGlmIChmb3JtYXQgPT09IHVuZGVmaW5lZClcblx0XHRmb3JtYXQgPSAnYXV0byc7XG5cdGFzc2VydC5zdHJpbmcoZm9ybWF0LCAnZm9ybWF0Jyk7XG5cdGlmICh0eXBlb2YgKG9wdGlvbnMpID09PSAnc3RyaW5nJylcblx0XHRvcHRpb25zID0geyBmaWxlbmFtZTogb3B0aW9ucyB9O1xuXHRhc3NlcnQub3B0aW9uYWxPYmplY3Qob3B0aW9ucywgJ29wdGlvbnMnKTtcblx0aWYgKG9wdGlvbnMgPT09IHVuZGVmaW5lZClcblx0XHRvcHRpb25zID0ge307XG5cdGFzc2VydC5vcHRpb25hbFN0cmluZyhvcHRpb25zLmZpbGVuYW1lLCAnb3B0aW9ucy5maWxlbmFtZScpO1xuXHRpZiAob3B0aW9ucy5maWxlbmFtZSA9PT0gdW5kZWZpbmVkKVxuXHRcdG9wdGlvbnMuZmlsZW5hbWUgPSAnKHVubmFtZWQpJztcblxuXHRhc3NlcnQub2JqZWN0KGZvcm1hdHNbZm9ybWF0XSwgJ2Zvcm1hdHNbZm9ybWF0XScpO1xuXG5cdHRyeSB7XG5cdFx0dmFyIGsgPSBmb3JtYXRzW2Zvcm1hdF0ucmVhZChkYXRhLCBvcHRpb25zKTtcblx0XHRpZiAoayBpbnN0YW5jZW9mIFByaXZhdGVLZXkpXG5cdFx0XHRrID0gay50b1B1YmxpYygpO1xuXHRcdGlmICghay5jb21tZW50KVxuXHRcdFx0ay5jb21tZW50ID0gb3B0aW9ucy5maWxlbmFtZTtcblx0XHRyZXR1cm4gKGspO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0aWYgKGUubmFtZSA9PT0gJ0tleUVuY3J5cHRlZEVycm9yJylcblx0XHRcdHRocm93IChlKTtcblx0XHR0aHJvdyAobmV3IEtleVBhcnNlRXJyb3Iob3B0aW9ucy5maWxlbmFtZSwgZm9ybWF0LCBlKSk7XG5cdH1cbn07XG5cbktleS5pc0tleSA9IGZ1bmN0aW9uIChvYmosIHZlcikge1xuXHRyZXR1cm4gKHV0aWxzLmlzQ29tcGF0aWJsZShvYmosIEtleSwgdmVyKSk7XG59O1xuXG4vKlxuICogQVBJIHZlcnNpb25zIGZvciBLZXk6XG4gKiBbMSwwXSAtLSBpbml0aWFsIHZlciwgbWF5IHRha2UgU2lnbmF0dXJlIGZvciBjcmVhdGVWZXJpZnkgb3IgbWF5IG5vdFxuICogWzEsMV0gLS0gYWRkZWQgcGtjczEsIHBrY3M4IGZvcm1hdHNcbiAqIFsxLDJdIC0tIGFkZGVkIGF1dG8sIHNzaC1wcml2YXRlLCBvcGVuc3NoIGZvcm1hdHNcbiAqIFsxLDNdIC0tIGFkZGVkIGRlZmF1bHRIYXNoQWxnb3JpdGhtXG4gKiBbMSw0XSAtLSBhZGRlZCBlZCBzdXBwb3J0LCBjcmVhdGVESFxuICogWzEsNV0gLS0gZmlyc3QgZXhwbGljaXRseSB0YWdnZWQgdmVyc2lvblxuICogWzEsNl0gLS0gY2hhbmdlZCBlZDI1NTE5IHBhcnQgbmFtZXNcbiAqIFsxLDddIC0tIHNwa2kgaGFzaCB0eXBlc1xuICovXG5LZXkucHJvdG90eXBlLl9zc2hwa0FwaVZlcnNpb24gPSBbMSwgN107XG5cbktleS5fb2xkVmVyc2lvbkRldGVjdCA9IGZ1bmN0aW9uIChvYmopIHtcblx0YXNzZXJ0LmZ1bmMob2JqLnRvQnVmZmVyKTtcblx0YXNzZXJ0LmZ1bmMob2JqLmZpbmdlcnByaW50KTtcblx0aWYgKG9iai5jcmVhdGVESClcblx0XHRyZXR1cm4gKFsxLCA0XSk7XG5cdGlmIChvYmouZGVmYXVsdEhhc2hBbGdvcml0aG0pXG5cdFx0cmV0dXJuIChbMSwgM10pO1xuXHRpZiAob2JqLmZvcm1hdHNbJ2F1dG8nXSlcblx0XHRyZXR1cm4gKFsxLCAyXSk7XG5cdGlmIChvYmouZm9ybWF0c1sncGtjczEnXSlcblx0XHRyZXR1cm4gKFsxLCAxXSk7XG5cdHJldHVybiAoWzEsIDBdKTtcbn07XG4iLCIvLyBDb3B5cmlnaHQgMjAxNSBKb3llbnQsIEluYy5cblxudmFyIEJ1ZmZlciA9IHJlcXVpcmUoJ3NhZmVyLWJ1ZmZlcicpLkJ1ZmZlcjtcblxudmFyIGFsZ0luZm8gPSB7XG5cdCdkc2EnOiB7XG5cdFx0cGFydHM6IFsncCcsICdxJywgJ2cnLCAneSddLFxuXHRcdHNpemVQYXJ0OiAncCdcblx0fSxcblx0J3JzYSc6IHtcblx0XHRwYXJ0czogWydlJywgJ24nXSxcblx0XHRzaXplUGFydDogJ24nXG5cdH0sXG5cdCdlY2RzYSc6IHtcblx0XHRwYXJ0czogWydjdXJ2ZScsICdRJ10sXG5cdFx0c2l6ZVBhcnQ6ICdRJ1xuXHR9LFxuXHQnZWQyNTUxOSc6IHtcblx0XHRwYXJ0czogWydBJ10sXG5cdFx0c2l6ZVBhcnQ6ICdBJ1xuXHR9XG59O1xuYWxnSW5mb1snY3VydmUyNTUxOSddID0gYWxnSW5mb1snZWQyNTUxOSddO1xuXG52YXIgYWxnUHJpdkluZm8gPSB7XG5cdCdkc2EnOiB7XG5cdFx0cGFydHM6IFsncCcsICdxJywgJ2cnLCAneScsICd4J11cblx0fSxcblx0J3JzYSc6IHtcblx0XHRwYXJ0czogWyduJywgJ2UnLCAnZCcsICdpcW1wJywgJ3AnLCAncSddXG5cdH0sXG5cdCdlY2RzYSc6IHtcblx0XHRwYXJ0czogWydjdXJ2ZScsICdRJywgJ2QnXVxuXHR9LFxuXHQnZWQyNTUxOSc6IHtcblx0XHRwYXJ0czogWydBJywgJ2snXVxuXHR9XG59O1xuYWxnUHJpdkluZm9bJ2N1cnZlMjU1MTknXSA9IGFsZ1ByaXZJbmZvWydlZDI1NTE5J107XG5cbnZhciBoYXNoQWxncyA9IHtcblx0J21kNSc6IHRydWUsXG5cdCdzaGExJzogdHJ1ZSxcblx0J3NoYTI1Nic6IHRydWUsXG5cdCdzaGEzODQnOiB0cnVlLFxuXHQnc2hhNTEyJzogdHJ1ZVxufTtcblxuLypcbiAqIFRha2VuIGZyb21cbiAqIGh0dHA6Ly9jc3JjLm5pc3QuZ292L2dyb3Vwcy9TVC90b29sa2l0L2RvY3VtZW50cy9kc3MvTklTVFJlQ3VyLnBkZlxuICovXG52YXIgY3VydmVzID0ge1xuXHQnbmlzdHAyNTYnOiB7XG5cdFx0c2l6ZTogMjU2LFxuXHRcdHBrY3M4b2lkOiAnMS4yLjg0MC4xMDA0NS4zLjEuNycsXG5cdFx0cDogQnVmZmVyLmZyb20oKCcwMCcgK1xuXHRcdCAgICAnZmZmZmZmZmYgMDAwMDAwMDEgMDAwMDAwMDAgMDAwMDAwMDAnICtcblx0XHQgICAgJzAwMDAwMDAwIGZmZmZmZmZmIGZmZmZmZmZmIGZmZmZmZmZmJykuXG5cdFx0ICAgIHJlcGxhY2UoLyAvZywgJycpLCAnaGV4JyksXG5cdFx0YTogQnVmZmVyLmZyb20oKCcwMCcgK1xuXHRcdCAgICAnRkZGRkZGRkYgMDAwMDAwMDEgMDAwMDAwMDAgMDAwMDAwMDAnICtcblx0XHQgICAgJzAwMDAwMDAwIEZGRkZGRkZGIEZGRkZGRkZGIEZGRkZGRkZDJykuXG5cdFx0ICAgIHJlcGxhY2UoLyAvZywgJycpLCAnaGV4JyksXG5cdFx0YjogQnVmZmVyLmZyb20oKFxuXHRcdCAgICAnNWFjNjM1ZDggYWEzYTkzZTcgYjNlYmJkNTUgNzY5ODg2YmMnICtcblx0XHQgICAgJzY1MWQwNmIwIGNjNTNiMGY2IDNiY2UzYzNlIDI3ZDI2MDRiJykuXG5cdFx0ICAgIHJlcGxhY2UoLyAvZywgJycpLCAnaGV4JyksXG5cdFx0czogQnVmZmVyLmZyb20oKCcwMCcgK1xuXHRcdCAgICAnYzQ5ZDM2MDggODZlNzA0OTMgNmE2Njc4ZTEgMTM5ZDI2YjcnICtcblx0XHQgICAgJzgxOWY3ZTkwJykuXG5cdFx0ICAgIHJlcGxhY2UoLyAvZywgJycpLCAnaGV4JyksXG5cdFx0bjogQnVmZmVyLmZyb20oKCcwMCcgK1xuXHRcdCAgICAnZmZmZmZmZmYgMDAwMDAwMDAgZmZmZmZmZmYgZmZmZmZmZmYnICtcblx0XHQgICAgJ2JjZTZmYWFkIGE3MTc5ZTg0IGYzYjljYWMyIGZjNjMyNTUxJykuXG5cdFx0ICAgIHJlcGxhY2UoLyAvZywgJycpLCAnaGV4JyksXG5cdFx0RzogQnVmZmVyLmZyb20oKCcwNCcgK1xuXHRcdCAgICAnNmIxN2QxZjIgZTEyYzQyNDcgZjhiY2U2ZTUgNjNhNDQwZjInICtcblx0XHQgICAgJzc3MDM3ZDgxIDJkZWIzM2EwIGY0YTEzOTQ1IGQ4OThjMjk2JyArXG5cdFx0ICAgICc0ZmUzNDJlMiBmZTFhN2Y5YiA4ZWU3ZWI0YSA3YzBmOWUxNicgK1xuXHRcdCAgICAnMmJjZTMzNTcgNmIzMTVlY2UgY2JiNjQwNjggMzdiZjUxZjUnKS5cblx0XHQgICAgcmVwbGFjZSgvIC9nLCAnJyksICdoZXgnKVxuXHR9LFxuXHQnbmlzdHAzODQnOiB7XG5cdFx0c2l6ZTogMzg0LFxuXHRcdHBrY3M4b2lkOiAnMS4zLjEzMi4wLjM0Jyxcblx0XHRwOiBCdWZmZXIuZnJvbSgoJzAwJyArXG5cdFx0ICAgICdmZmZmZmZmZiBmZmZmZmZmZiBmZmZmZmZmZiBmZmZmZmZmZicgK1xuXHRcdCAgICAnZmZmZmZmZmYgZmZmZmZmZmYgZmZmZmZmZmYgZmZmZmZmZmUnICtcblx0XHQgICAgJ2ZmZmZmZmZmIDAwMDAwMDAwIDAwMDAwMDAwIGZmZmZmZmZmJykuXG5cdFx0ICAgIHJlcGxhY2UoLyAvZywgJycpLCAnaGV4JyksXG5cdFx0YTogQnVmZmVyLmZyb20oKCcwMCcgK1xuXHRcdCAgICAnRkZGRkZGRkYgRkZGRkZGRkYgRkZGRkZGRkYgRkZGRkZGRkYnICtcblx0XHQgICAgJ0ZGRkZGRkZGIEZGRkZGRkZGIEZGRkZGRkZGIEZGRkZGRkZFJyArXG5cdFx0ICAgICdGRkZGRkZGRiAwMDAwMDAwMCAwMDAwMDAwMCBGRkZGRkZGQycpLlxuXHRcdCAgICByZXBsYWNlKC8gL2csICcnKSwgJ2hleCcpLFxuXHRcdGI6IEJ1ZmZlci5mcm9tKChcblx0XHQgICAgJ2IzMzEyZmE3IGUyM2VlN2U0IDk4OGUwNTZiIGUzZjgyZDE5JyArXG5cdFx0ICAgICcxODFkOWM2ZSBmZTgxNDExMiAwMzE0MDg4ZiA1MDEzODc1YScgK1xuXHRcdCAgICAnYzY1NjM5OGQgOGEyZWQxOWQgMmE4NWM4ZWQgZDNlYzJhZWYnKS5cblx0XHQgICAgcmVwbGFjZSgvIC9nLCAnJyksICdoZXgnKSxcblx0XHRzOiBCdWZmZXIuZnJvbSgoJzAwJyArXG5cdFx0ICAgICdhMzM1OTI2YSBhMzE5YTI3YSAxZDAwODk2YSA2NzczYTQ4MicgK1xuXHRcdCAgICAnN2FjZGFjNzMnKS5cblx0XHQgICAgcmVwbGFjZSgvIC9nLCAnJyksICdoZXgnKSxcblx0XHRuOiBCdWZmZXIuZnJvbSgoJzAwJyArXG5cdFx0ICAgICdmZmZmZmZmZiBmZmZmZmZmZiBmZmZmZmZmZiBmZmZmZmZmZicgK1xuXHRcdCAgICAnZmZmZmZmZmYgZmZmZmZmZmYgYzc2MzRkODEgZjQzNzJkZGYnICtcblx0XHQgICAgJzU4MWEwZGIyIDQ4YjBhNzdhIGVjZWMxOTZhIGNjYzUyOTczJykuXG5cdFx0ICAgIHJlcGxhY2UoLyAvZywgJycpLCAnaGV4JyksXG5cdFx0RzogQnVmZmVyLmZyb20oKCcwNCcgK1xuXHRcdCAgICAnYWE4N2NhMjIgYmU4YjA1MzcgOGViMWM3MWUgZjMyMGFkNzQnICtcblx0XHQgICAgJzZlMWQzYjYyIDhiYTc5Yjk4IDU5Zjc0MWUwIDgyNTQyYTM4JyArXG5cdFx0ICAgICc1NTAyZjI1ZCBiZjU1Mjk2YyAzYTU0NWUzOCA3Mjc2MGFiNycgK1xuXHRcdCAgICAnMzYxN2RlNGEgOTYyNjJjNmYgNWQ5ZTk4YmYgOTI5MmRjMjknICtcblx0XHQgICAgJ2Y4ZjQxZGJkIDI4OWExNDdjIGU5ZGEzMTEzIGI1ZjBiOGMwJyArXG5cdFx0ICAgICcwYTYwYjFjZSAxZDdlODE5ZCA3YTQzMWQ3YyA5MGVhMGU1ZicpLlxuXHRcdCAgICByZXBsYWNlKC8gL2csICcnKSwgJ2hleCcpXG5cdH0sXG5cdCduaXN0cDUyMSc6IHtcblx0XHRzaXplOiA1MjEsXG5cdFx0cGtjczhvaWQ6ICcxLjMuMTMyLjAuMzUnLFxuXHRcdHA6IEJ1ZmZlci5mcm9tKChcblx0XHQgICAgJzAxZmZmZmZmIGZmZmZmZmZmIGZmZmZmZmZmIGZmZmZmZmZmJyArXG5cdFx0ICAgICdmZmZmZmZmZiBmZmZmZmZmZiBmZmZmZmZmZiBmZmZmZmZmZicgK1xuXHRcdCAgICAnZmZmZmZmZmYgZmZmZmZmZmYgZmZmZmZmZmYgZmZmZmZmZmYnICtcblx0XHQgICAgJ2ZmZmZmZmZmIGZmZmZmZmZmIGZmZmZmZmZmIGZmZmZmZmZmJyArXG5cdFx0ICAgICdmZmZmJykucmVwbGFjZSgvIC9nLCAnJyksICdoZXgnKSxcblx0XHRhOiBCdWZmZXIuZnJvbSgoJzAxRkYnICtcblx0XHQgICAgJ0ZGRkZGRkZGIEZGRkZGRkZGIEZGRkZGRkZGIEZGRkZGRkZGJyArXG5cdFx0ICAgICdGRkZGRkZGRiBGRkZGRkZGRiBGRkZGRkZGRiBGRkZGRkZGRicgK1xuXHRcdCAgICAnRkZGRkZGRkYgRkZGRkZGRkYgRkZGRkZGRkYgRkZGRkZGRkYnICtcblx0XHQgICAgJ0ZGRkZGRkZGIEZGRkZGRkZGIEZGRkZGRkZGIEZGRkZGRkZDJykuXG5cdFx0ICAgIHJlcGxhY2UoLyAvZywgJycpLCAnaGV4JyksXG5cdFx0YjogQnVmZmVyLmZyb20oKCc1MScgK1xuXHRcdCAgICAnOTUzZWI5NjEgOGUxYzlhMWYgOTI5YTIxYTAgYjY4NTQwZWUnICtcblx0XHQgICAgJ2EyZGE3MjViIDk5YjMxNWYzIGI4YjQ4OTkxIDhlZjEwOWUxJyArXG5cdFx0ICAgICc1NjE5Mzk1MSBlYzdlOTM3YiAxNjUyYzBiZCAzYmIxYmYwNycgK1xuXHRcdCAgICAnMzU3M2RmODggM2QyYzM0ZjEgZWY0NTFmZDQgNmI1MDNmMDAnKS5cblx0XHQgICAgcmVwbGFjZSgvIC9nLCAnJyksICdoZXgnKSxcblx0XHRzOiBCdWZmZXIuZnJvbSgoJzAwJyArXG5cdFx0ICAgICdkMDllODgwMCAyOTFjYjg1MyA5NmNjNjcxNyAzOTMyODRhYScgK1xuXHRcdCAgICAnYTBkYTY0YmEnKS5yZXBsYWNlKC8gL2csICcnKSwgJ2hleCcpLFxuXHRcdG46IEJ1ZmZlci5mcm9tKCgnMDFmZicgK1xuXHRcdCAgICAnZmZmZmZmZmYgZmZmZmZmZmYgZmZmZmZmZmYgZmZmZmZmZmYnICtcblx0XHQgICAgJ2ZmZmZmZmZmIGZmZmZmZmZmIGZmZmZmZmZmIGZmZmZmZmZhJyArXG5cdFx0ICAgICc1MTg2ODc4MyBiZjJmOTY2YiA3ZmNjMDE0OCBmNzA5YTVkMCcgK1xuXHRcdCAgICAnM2JiNWM5YjggODk5YzQ3YWUgYmI2ZmI3MWUgOTEzODY0MDknKS5cblx0XHQgICAgcmVwbGFjZSgvIC9nLCAnJyksICdoZXgnKSxcblx0XHRHOiBCdWZmZXIuZnJvbSgoJzA0JyArXG5cdFx0ICAgICcwMGM2IDg1OGUwNmI3IDA0MDRlOWNkIDllM2VjYjY2IDIzOTViNDQyJyArXG5cdFx0ICAgICAgICAgJzljNjQ4MTM5IDA1M2ZiNTIxIGY4MjhhZjYwIDZiNGQzZGJhJyArXG5cdFx0ICAgICAgICAgJ2ExNGI1ZTc3IGVmZTc1OTI4IGZlMWRjMTI3IGEyZmZhOGRlJyArXG5cdFx0ICAgICAgICAgJzMzNDhiM2MxIDg1NmE0MjliIGY5N2U3ZTMxIGMyZTViZDY2JyArXG5cdFx0ICAgICcwMTE4IDM5Mjk2YTc4IDlhM2JjMDA0IDVjOGE1ZmI0IDJjN2QxYmQ5JyArXG5cdFx0ICAgICAgICAgJzk4ZjU0NDQ5IDU3OWI0NDY4IDE3YWZiZDE3IDI3M2U2NjJjJyArXG5cdFx0ICAgICAgICAgJzk3ZWU3Mjk5IDVlZjQyNjQwIGM1NTBiOTAxIDNmYWQwNzYxJyArXG5cdFx0ICAgICAgICAgJzM1M2M3MDg2IGEyNzJjMjQwIDg4YmU5NDc2IDlmZDE2NjUwJykuXG5cdFx0ICAgIHJlcGxhY2UoLyAvZywgJycpLCAnaGV4Jylcblx0fVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdGluZm86IGFsZ0luZm8sXG5cdHByaXZJbmZvOiBhbGdQcml2SW5mbyxcblx0aGFzaEFsZ3M6IGhhc2hBbGdzLFxuXHRjdXJ2ZXM6IGN1cnZlc1xufTtcbiIsIi8vIENvcHlyaWdodCAyMDE4IEpveWVudCwgSW5jLlxuXG5tb2R1bGUuZXhwb3J0cyA9IEZpbmdlcnByaW50O1xuXG52YXIgYXNzZXJ0ID0gcmVxdWlyZSgnYXNzZXJ0LXBsdXMnKTtcbnZhciBCdWZmZXIgPSByZXF1aXJlKCdzYWZlci1idWZmZXInKS5CdWZmZXI7XG52YXIgYWxncyA9IHJlcXVpcmUoJy4vYWxncycpO1xudmFyIGNyeXB0byA9IHJlcXVpcmUoJ2NyeXB0bycpO1xudmFyIGVycnMgPSByZXF1aXJlKCcuL2Vycm9ycycpO1xudmFyIEtleSA9IHJlcXVpcmUoJy4va2V5Jyk7XG52YXIgUHJpdmF0ZUtleSA9IHJlcXVpcmUoJy4vcHJpdmF0ZS1rZXknKTtcbnZhciBDZXJ0aWZpY2F0ZSA9IHJlcXVpcmUoJy4vY2VydGlmaWNhdGUnKTtcbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcblxudmFyIEZpbmdlcnByaW50Rm9ybWF0RXJyb3IgPSBlcnJzLkZpbmdlcnByaW50Rm9ybWF0RXJyb3I7XG52YXIgSW52YWxpZEFsZ29yaXRobUVycm9yID0gZXJycy5JbnZhbGlkQWxnb3JpdGhtRXJyb3I7XG5cbmZ1bmN0aW9uIEZpbmdlcnByaW50KG9wdHMpIHtcblx0YXNzZXJ0Lm9iamVjdChvcHRzLCAnb3B0aW9ucycpO1xuXHRhc3NlcnQuc3RyaW5nKG9wdHMudHlwZSwgJ29wdGlvbnMudHlwZScpO1xuXHRhc3NlcnQuYnVmZmVyKG9wdHMuaGFzaCwgJ29wdGlvbnMuaGFzaCcpO1xuXHRhc3NlcnQuc3RyaW5nKG9wdHMuYWxnb3JpdGhtLCAnb3B0aW9ucy5hbGdvcml0aG0nKTtcblxuXHR0aGlzLmFsZ29yaXRobSA9IG9wdHMuYWxnb3JpdGhtLnRvTG93ZXJDYXNlKCk7XG5cdGlmIChhbGdzLmhhc2hBbGdzW3RoaXMuYWxnb3JpdGhtXSAhPT0gdHJ1ZSlcblx0XHR0aHJvdyAobmV3IEludmFsaWRBbGdvcml0aG1FcnJvcih0aGlzLmFsZ29yaXRobSkpO1xuXG5cdHRoaXMuaGFzaCA9IG9wdHMuaGFzaDtcblx0dGhpcy50eXBlID0gb3B0cy50eXBlO1xuXHR0aGlzLmhhc2hUeXBlID0gb3B0cy5oYXNoVHlwZTtcbn1cblxuRmluZ2VycHJpbnQucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gKGZvcm1hdCkge1xuXHRpZiAoZm9ybWF0ID09PSB1bmRlZmluZWQpIHtcblx0XHRpZiAodGhpcy5hbGdvcml0aG0gPT09ICdtZDUnIHx8IHRoaXMuaGFzaFR5cGUgPT09ICdzcGtpJylcblx0XHRcdGZvcm1hdCA9ICdoZXgnO1xuXHRcdGVsc2Vcblx0XHRcdGZvcm1hdCA9ICdiYXNlNjQnO1xuXHR9XG5cdGFzc2VydC5zdHJpbmcoZm9ybWF0KTtcblxuXHRzd2l0Y2ggKGZvcm1hdCkge1xuXHRjYXNlICdoZXgnOlxuXHRcdGlmICh0aGlzLmhhc2hUeXBlID09PSAnc3BraScpXG5cdFx0XHRyZXR1cm4gKHRoaXMuaGFzaC50b1N0cmluZygnaGV4JykpO1xuXHRcdHJldHVybiAoYWRkQ29sb25zKHRoaXMuaGFzaC50b1N0cmluZygnaGV4JykpKTtcblx0Y2FzZSAnYmFzZTY0Jzpcblx0XHRpZiAodGhpcy5oYXNoVHlwZSA9PT0gJ3Nwa2knKVxuXHRcdFx0cmV0dXJuICh0aGlzLmhhc2gudG9TdHJpbmcoJ2Jhc2U2NCcpKTtcblx0XHRyZXR1cm4gKHNzaEJhc2U2NEZvcm1hdCh0aGlzLmFsZ29yaXRobSxcblx0XHQgICAgdGhpcy5oYXNoLnRvU3RyaW5nKCdiYXNlNjQnKSkpO1xuXHRkZWZhdWx0OlxuXHRcdHRocm93IChuZXcgRmluZ2VycHJpbnRGb3JtYXRFcnJvcih1bmRlZmluZWQsIGZvcm1hdCkpO1xuXHR9XG59O1xuXG5GaW5nZXJwcmludC5wcm90b3R5cGUubWF0Y2hlcyA9IGZ1bmN0aW9uIChvdGhlcikge1xuXHRhc3NlcnQub2JqZWN0KG90aGVyLCAna2V5IG9yIGNlcnRpZmljYXRlJyk7XG5cdGlmICh0aGlzLnR5cGUgPT09ICdrZXknICYmIHRoaXMuaGFzaFR5cGUgIT09ICdzc2gnKSB7XG5cdFx0dXRpbHMuYXNzZXJ0Q29tcGF0aWJsZShvdGhlciwgS2V5LCBbMSwgN10sICdrZXkgd2l0aCBzcGtpJyk7XG5cdFx0aWYgKFByaXZhdGVLZXkuaXNQcml2YXRlS2V5KG90aGVyKSkge1xuXHRcdFx0dXRpbHMuYXNzZXJ0Q29tcGF0aWJsZShvdGhlciwgUHJpdmF0ZUtleSwgWzEsIDZdLFxuXHRcdFx0ICAgICdwcml2YXRla2V5IHdpdGggc3BraSBzdXBwb3J0Jyk7XG5cdFx0fVxuXHR9IGVsc2UgaWYgKHRoaXMudHlwZSA9PT0gJ2tleScpIHtcblx0XHR1dGlscy5hc3NlcnRDb21wYXRpYmxlKG90aGVyLCBLZXksIFsxLCAwXSwgJ2tleScpO1xuXHR9IGVsc2Uge1xuXHRcdHV0aWxzLmFzc2VydENvbXBhdGlibGUob3RoZXIsIENlcnRpZmljYXRlLCBbMSwgMF0sXG5cdFx0ICAgICdjZXJ0aWZpY2F0ZScpO1xuXHR9XG5cblx0dmFyIHRoZWlySGFzaCA9IG90aGVyLmhhc2godGhpcy5hbGdvcml0aG0sIHRoaXMuaGFzaFR5cGUpO1xuXHR2YXIgdGhlaXJIYXNoMiA9IGNyeXB0by5jcmVhdGVIYXNoKHRoaXMuYWxnb3JpdGhtKS5cblx0ICAgIHVwZGF0ZSh0aGVpckhhc2gpLmRpZ2VzdCgnYmFzZTY0Jyk7XG5cblx0aWYgKHRoaXMuaGFzaDIgPT09IHVuZGVmaW5lZClcblx0XHR0aGlzLmhhc2gyID0gY3J5cHRvLmNyZWF0ZUhhc2godGhpcy5hbGdvcml0aG0pLlxuXHRcdCAgICB1cGRhdGUodGhpcy5oYXNoKS5kaWdlc3QoJ2Jhc2U2NCcpO1xuXG5cdHJldHVybiAodGhpcy5oYXNoMiA9PT0gdGhlaXJIYXNoMik7XG59O1xuXG4vKkpTU1RZTEVEKi9cbnZhciBiYXNlNjRSRSA9IC9eW0EtWmEtejAtOStcXC89XSskLztcbi8qSlNTVFlMRUQqL1xudmFyIGhleFJFID0gL15bYS1mQS1GMC05XSskLztcblxuRmluZ2VycHJpbnQucGFyc2UgPSBmdW5jdGlvbiAoZnAsIG9wdGlvbnMpIHtcblx0YXNzZXJ0LnN0cmluZyhmcCwgJ2ZpbmdlcnByaW50Jyk7XG5cblx0dmFyIGFsZywgaGFzaCwgZW5BbGdzO1xuXHRpZiAoQXJyYXkuaXNBcnJheShvcHRpb25zKSkge1xuXHRcdGVuQWxncyA9IG9wdGlvbnM7XG5cdFx0b3B0aW9ucyA9IHt9O1xuXHR9XG5cdGFzc2VydC5vcHRpb25hbE9iamVjdChvcHRpb25zLCAnb3B0aW9ucycpO1xuXHRpZiAob3B0aW9ucyA9PT0gdW5kZWZpbmVkKVxuXHRcdG9wdGlvbnMgPSB7fTtcblx0aWYgKG9wdGlvbnMuZW5BbGdzICE9PSB1bmRlZmluZWQpXG5cdFx0ZW5BbGdzID0gb3B0aW9ucy5lbkFsZ3M7XG5cdGlmIChvcHRpb25zLmFsZ29yaXRobXMgIT09IHVuZGVmaW5lZClcblx0XHRlbkFsZ3MgPSBvcHRpb25zLmFsZ29yaXRobXM7XG5cdGFzc2VydC5vcHRpb25hbEFycmF5T2ZTdHJpbmcoZW5BbGdzLCAnYWxnb3JpdGhtcycpO1xuXG5cdHZhciBoYXNoVHlwZSA9ICdzc2gnO1xuXHRpZiAob3B0aW9ucy5oYXNoVHlwZSAhPT0gdW5kZWZpbmVkKVxuXHRcdGhhc2hUeXBlID0gb3B0aW9ucy5oYXNoVHlwZTtcblx0YXNzZXJ0LnN0cmluZyhoYXNoVHlwZSwgJ29wdGlvbnMuaGFzaFR5cGUnKTtcblxuXHR2YXIgcGFydHMgPSBmcC5zcGxpdCgnOicpO1xuXHRpZiAocGFydHMubGVuZ3RoID09IDIpIHtcblx0XHRhbGcgPSBwYXJ0c1swXS50b0xvd2VyQ2FzZSgpO1xuXHRcdGlmICghYmFzZTY0UkUudGVzdChwYXJ0c1sxXSkpXG5cdFx0XHR0aHJvdyAobmV3IEZpbmdlcnByaW50Rm9ybWF0RXJyb3IoZnApKTtcblx0XHR0cnkge1xuXHRcdFx0aGFzaCA9IEJ1ZmZlci5mcm9tKHBhcnRzWzFdLCAnYmFzZTY0Jyk7XG5cdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0dGhyb3cgKG5ldyBGaW5nZXJwcmludEZvcm1hdEVycm9yKGZwKSk7XG5cdFx0fVxuXHR9IGVsc2UgaWYgKHBhcnRzLmxlbmd0aCA+IDIpIHtcblx0XHRhbGcgPSAnbWQ1Jztcblx0XHRpZiAocGFydHNbMF0udG9Mb3dlckNhc2UoKSA9PT0gJ21kNScpXG5cdFx0XHRwYXJ0cyA9IHBhcnRzLnNsaWNlKDEpO1xuXHRcdHBhcnRzID0gcGFydHMubWFwKGZ1bmN0aW9uIChwKSB7XG5cdFx0XHR3aGlsZSAocC5sZW5ndGggPCAyKVxuXHRcdFx0XHRwID0gJzAnICsgcDtcblx0XHRcdGlmIChwLmxlbmd0aCA+IDIpXG5cdFx0XHRcdHRocm93IChuZXcgRmluZ2VycHJpbnRGb3JtYXRFcnJvcihmcCkpO1xuXHRcdFx0cmV0dXJuIChwKTtcblx0XHR9KTtcblx0XHRwYXJ0cyA9IHBhcnRzLmpvaW4oJycpO1xuXHRcdGlmICghaGV4UkUudGVzdChwYXJ0cykgfHwgcGFydHMubGVuZ3RoICUgMiAhPT0gMClcblx0XHRcdHRocm93IChuZXcgRmluZ2VycHJpbnRGb3JtYXRFcnJvcihmcCkpO1xuXHRcdHRyeSB7XG5cdFx0XHRoYXNoID0gQnVmZmVyLmZyb20ocGFydHMsICdoZXgnKTtcblx0XHR9IGNhdGNoIChlKSB7XG5cdFx0XHR0aHJvdyAobmV3IEZpbmdlcnByaW50Rm9ybWF0RXJyb3IoZnApKTtcblx0XHR9XG5cdH0gZWxzZSB7XG5cdFx0aWYgKGhleFJFLnRlc3QoZnApKSB7XG5cdFx0XHRoYXNoID0gQnVmZmVyLmZyb20oZnAsICdoZXgnKTtcblx0XHR9IGVsc2UgaWYgKGJhc2U2NFJFLnRlc3QoZnApKSB7XG5cdFx0XHRoYXNoID0gQnVmZmVyLmZyb20oZnAsICdiYXNlNjQnKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhyb3cgKG5ldyBGaW5nZXJwcmludEZvcm1hdEVycm9yKGZwKSk7XG5cdFx0fVxuXG5cdFx0c3dpdGNoIChoYXNoLmxlbmd0aCkge1xuXHRcdGNhc2UgMzI6XG5cdFx0XHRhbGcgPSAnc2hhMjU2Jztcblx0XHRcdGJyZWFrO1xuXHRcdGNhc2UgMTY6XG5cdFx0XHRhbGcgPSAnbWQ1Jztcblx0XHRcdGJyZWFrO1xuXHRcdGNhc2UgMjA6XG5cdFx0XHRhbGcgPSAnc2hhMSc7XG5cdFx0XHRicmVhaztcblx0XHRjYXNlIDY0OlxuXHRcdFx0YWxnID0gJ3NoYTUxMic7XG5cdFx0XHRicmVhaztcblx0XHRkZWZhdWx0OlxuXHRcdFx0dGhyb3cgKG5ldyBGaW5nZXJwcmludEZvcm1hdEVycm9yKGZwKSk7XG5cdFx0fVxuXG5cdFx0LyogUGxhaW4gaGV4L2Jhc2U2NDogZ3Vlc3MgaXQncyBwcm9iYWJseSBTUEtJIHVubGVzcyB0b2xkLiAqL1xuXHRcdGlmIChvcHRpb25zLmhhc2hUeXBlID09PSB1bmRlZmluZWQpXG5cdFx0XHRoYXNoVHlwZSA9ICdzcGtpJztcblx0fVxuXG5cdGlmIChhbGcgPT09IHVuZGVmaW5lZClcblx0XHR0aHJvdyAobmV3IEZpbmdlcnByaW50Rm9ybWF0RXJyb3IoZnApKTtcblxuXHRpZiAoYWxncy5oYXNoQWxnc1thbGddID09PSB1bmRlZmluZWQpXG5cdFx0dGhyb3cgKG5ldyBJbnZhbGlkQWxnb3JpdGhtRXJyb3IoYWxnKSk7XG5cblx0aWYgKGVuQWxncyAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0ZW5BbGdzID0gZW5BbGdzLm1hcChmdW5jdGlvbiAoYSkgeyByZXR1cm4gYS50b0xvd2VyQ2FzZSgpOyB9KTtcblx0XHRpZiAoZW5BbGdzLmluZGV4T2YoYWxnKSA9PT0gLTEpXG5cdFx0XHR0aHJvdyAobmV3IEludmFsaWRBbGdvcml0aG1FcnJvcihhbGcpKTtcblx0fVxuXG5cdHJldHVybiAobmV3IEZpbmdlcnByaW50KHtcblx0XHRhbGdvcml0aG06IGFsZyxcblx0XHRoYXNoOiBoYXNoLFxuXHRcdHR5cGU6IG9wdGlvbnMudHlwZSB8fCAna2V5Jyxcblx0XHRoYXNoVHlwZTogaGFzaFR5cGVcblx0fSkpO1xufTtcblxuZnVuY3Rpb24gYWRkQ29sb25zKHMpIHtcblx0LypKU1NUWUxFRCovXG5cdHJldHVybiAocy5yZXBsYWNlKC8oLnsyfSkoPz0uKS9nLCAnJDE6JykpO1xufVxuXG5mdW5jdGlvbiBiYXNlNjRTdHJpcChzKSB7XG5cdC8qSlNTVFlMRUQqL1xuXHRyZXR1cm4gKHMucmVwbGFjZSgvPSokLywgJycpKTtcbn1cblxuZnVuY3Rpb24gc3NoQmFzZTY0Rm9ybWF0KGFsZywgaCkge1xuXHRyZXR1cm4gKGFsZy50b1VwcGVyQ2FzZSgpICsgJzonICsgYmFzZTY0U3RyaXAoaCkpO1xufVxuXG5GaW5nZXJwcmludC5pc0ZpbmdlcnByaW50ID0gZnVuY3Rpb24gKG9iaiwgdmVyKSB7XG5cdHJldHVybiAodXRpbHMuaXNDb21wYXRpYmxlKG9iaiwgRmluZ2VycHJpbnQsIHZlcikpO1xufTtcblxuLypcbiAqIEFQSSB2ZXJzaW9ucyBmb3IgRmluZ2VycHJpbnQ6XG4gKiBbMSwwXSAtLSBpbml0aWFsIHZlclxuICogWzEsMV0gLS0gZmlyc3QgdGFnZ2VkIHZlclxuICogWzEsMl0gLS0gaGFzaFR5cGUgYW5kIHNwa2kgc3VwcG9ydFxuICovXG5GaW5nZXJwcmludC5wcm90b3R5cGUuX3NzaHBrQXBpVmVyc2lvbiA9IFsxLCAyXTtcblxuRmluZ2VycHJpbnQuX29sZFZlcnNpb25EZXRlY3QgPSBmdW5jdGlvbiAob2JqKSB7XG5cdGFzc2VydC5mdW5jKG9iai50b1N0cmluZyk7XG5cdGFzc2VydC5mdW5jKG9iai5tYXRjaGVzKTtcblx0cmV0dXJuIChbMSwgMF0pO1xufTtcbiIsIi8vIENvcHlyaWdodCAyMDE3IEpveWVudCwgSW5jLlxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0RGlmZmllSGVsbG1hbjogRGlmZmllSGVsbG1hbixcblx0Z2VuZXJhdGVFQ0RTQTogZ2VuZXJhdGVFQ0RTQSxcblx0Z2VuZXJhdGVFRDI1NTE5OiBnZW5lcmF0ZUVEMjU1MTlcbn07XG5cbnZhciBhc3NlcnQgPSByZXF1aXJlKCdhc3NlcnQtcGx1cycpO1xudmFyIGNyeXB0byA9IHJlcXVpcmUoJ2NyeXB0bycpO1xudmFyIEJ1ZmZlciA9IHJlcXVpcmUoJ3NhZmVyLWJ1ZmZlcicpLkJ1ZmZlcjtcbnZhciBhbGdzID0gcmVxdWlyZSgnLi9hbGdzJyk7XG52YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XG52YXIgbmFjbCA9IHJlcXVpcmUoJ3R3ZWV0bmFjbCcpO1xuXG52YXIgS2V5ID0gcmVxdWlyZSgnLi9rZXknKTtcbnZhciBQcml2YXRlS2V5ID0gcmVxdWlyZSgnLi9wcml2YXRlLWtleScpO1xuXG52YXIgQ1JZUFRPX0hBVkVfRUNESCA9IChjcnlwdG8uY3JlYXRlRUNESCAhPT0gdW5kZWZpbmVkKTtcblxudmFyIGVjZGggPSByZXF1aXJlKCdlY2MtanNibicpO1xudmFyIGVjID0gcmVxdWlyZSgnZWNjLWpzYm4vbGliL2VjJyk7XG52YXIganNibiA9IHJlcXVpcmUoJ2pzYm4nKS5CaWdJbnRlZ2VyO1xuXG5mdW5jdGlvbiBEaWZmaWVIZWxsbWFuKGtleSkge1xuXHR1dGlscy5hc3NlcnRDb21wYXRpYmxlKGtleSwgS2V5LCBbMSwgNF0sICdrZXknKTtcblx0dGhpcy5faXNQcml2ID0gUHJpdmF0ZUtleS5pc1ByaXZhdGVLZXkoa2V5LCBbMSwgM10pO1xuXHR0aGlzLl9hbGdvID0ga2V5LnR5cGU7XG5cdHRoaXMuX2N1cnZlID0ga2V5LmN1cnZlO1xuXHR0aGlzLl9rZXkgPSBrZXk7XG5cdGlmIChrZXkudHlwZSA9PT0gJ2RzYScpIHtcblx0XHRpZiAoIUNSWVBUT19IQVZFX0VDREgpIHtcblx0XHRcdHRocm93IChuZXcgRXJyb3IoJ0R1ZSB0byBidWdzIGluIHRoZSBub2RlIDAuMTAgJyArXG5cdFx0XHQgICAgJ2NyeXB0byBBUEksIG5vZGUgMC4xMi54IG9yIGxhdGVyIGlzIHJlcXVpcmVkICcgK1xuXHRcdFx0ICAgICd0byB1c2UgREgnKSk7XG5cdFx0fVxuXHRcdHRoaXMuX2RoID0gY3J5cHRvLmNyZWF0ZURpZmZpZUhlbGxtYW4oXG5cdFx0ICAgIGtleS5wYXJ0LnAuZGF0YSwgdW5kZWZpbmVkLFxuXHRcdCAgICBrZXkucGFydC5nLmRhdGEsIHVuZGVmaW5lZCk7XG5cdFx0dGhpcy5fcCA9IGtleS5wYXJ0LnA7XG5cdFx0dGhpcy5fZyA9IGtleS5wYXJ0Lmc7XG5cdFx0aWYgKHRoaXMuX2lzUHJpdilcblx0XHRcdHRoaXMuX2RoLnNldFByaXZhdGVLZXkoa2V5LnBhcnQueC5kYXRhKTtcblx0XHR0aGlzLl9kaC5zZXRQdWJsaWNLZXkoa2V5LnBhcnQueS5kYXRhKTtcblxuXHR9IGVsc2UgaWYgKGtleS50eXBlID09PSAnZWNkc2EnKSB7XG5cdFx0aWYgKCFDUllQVE9fSEFWRV9FQ0RIKSB7XG5cdFx0XHR0aGlzLl9lY1BhcmFtcyA9IG5ldyBYOUVDUGFyYW1ldGVycyh0aGlzLl9jdXJ2ZSk7XG5cblx0XHRcdGlmICh0aGlzLl9pc1ByaXYpIHtcblx0XHRcdFx0dGhpcy5fcHJpdiA9IG5ldyBFQ1ByaXZhdGUoXG5cdFx0XHRcdCAgICB0aGlzLl9lY1BhcmFtcywga2V5LnBhcnQuZC5kYXRhKTtcblx0XHRcdH1cblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR2YXIgY3VydmUgPSB7XG5cdFx0XHQnbmlzdHAyNTYnOiAncHJpbWUyNTZ2MScsXG5cdFx0XHQnbmlzdHAzODQnOiAnc2VjcDM4NHIxJyxcblx0XHRcdCduaXN0cDUyMSc6ICdzZWNwNTIxcjEnXG5cdFx0fVtrZXkuY3VydmVdO1xuXHRcdHRoaXMuX2RoID0gY3J5cHRvLmNyZWF0ZUVDREgoY3VydmUpO1xuXHRcdGlmICh0eXBlb2YgKHRoaXMuX2RoKSAhPT0gJ29iamVjdCcgfHxcblx0XHQgICAgdHlwZW9mICh0aGlzLl9kaC5zZXRQcml2YXRlS2V5KSAhPT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0Q1JZUFRPX0hBVkVfRUNESCA9IGZhbHNlO1xuXHRcdFx0RGlmZmllSGVsbG1hbi5jYWxsKHRoaXMsIGtleSk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdGlmICh0aGlzLl9pc1ByaXYpXG5cdFx0XHR0aGlzLl9kaC5zZXRQcml2YXRlS2V5KGtleS5wYXJ0LmQuZGF0YSk7XG5cdFx0dGhpcy5fZGguc2V0UHVibGljS2V5KGtleS5wYXJ0LlEuZGF0YSk7XG5cblx0fSBlbHNlIGlmIChrZXkudHlwZSA9PT0gJ2N1cnZlMjU1MTknKSB7XG5cdFx0aWYgKHRoaXMuX2lzUHJpdikge1xuXHRcdFx0dXRpbHMuYXNzZXJ0Q29tcGF0aWJsZShrZXksIFByaXZhdGVLZXksIFsxLCA1XSwgJ2tleScpO1xuXHRcdFx0dGhpcy5fcHJpdiA9IGtleS5wYXJ0LmsuZGF0YTtcblx0XHR9XG5cblx0fSBlbHNlIHtcblx0XHR0aHJvdyAobmV3IEVycm9yKCdESCBub3Qgc3VwcG9ydGVkIGZvciAnICsga2V5LnR5cGUgKyAnIGtleXMnKSk7XG5cdH1cbn1cblxuRGlmZmllSGVsbG1hbi5wcm90b3R5cGUuZ2V0UHVibGljS2V5ID0gZnVuY3Rpb24gKCkge1xuXHRpZiAodGhpcy5faXNQcml2KVxuXHRcdHJldHVybiAodGhpcy5fa2V5LnRvUHVibGljKCkpO1xuXHRyZXR1cm4gKHRoaXMuX2tleSk7XG59O1xuXG5EaWZmaWVIZWxsbWFuLnByb3RvdHlwZS5nZXRQcml2YXRlS2V5ID0gZnVuY3Rpb24gKCkge1xuXHRpZiAodGhpcy5faXNQcml2KVxuXHRcdHJldHVybiAodGhpcy5fa2V5KTtcblx0ZWxzZVxuXHRcdHJldHVybiAodW5kZWZpbmVkKTtcbn07XG5EaWZmaWVIZWxsbWFuLnByb3RvdHlwZS5nZXRLZXkgPSBEaWZmaWVIZWxsbWFuLnByb3RvdHlwZS5nZXRQcml2YXRlS2V5O1xuXG5EaWZmaWVIZWxsbWFuLnByb3RvdHlwZS5fa2V5Q2hlY2sgPSBmdW5jdGlvbiAocGssIGlzUHViKSB7XG5cdGFzc2VydC5vYmplY3QocGssICdrZXknKTtcblx0aWYgKCFpc1B1Yilcblx0XHR1dGlscy5hc3NlcnRDb21wYXRpYmxlKHBrLCBQcml2YXRlS2V5LCBbMSwgM10sICdrZXknKTtcblx0dXRpbHMuYXNzZXJ0Q29tcGF0aWJsZShwaywgS2V5LCBbMSwgNF0sICdrZXknKTtcblxuXHRpZiAocGsudHlwZSAhPT0gdGhpcy5fYWxnbykge1xuXHRcdHRocm93IChuZXcgRXJyb3IoJ0EgJyArIHBrLnR5cGUgKyAnIGtleSBjYW5ub3QgYmUgdXNlZCBpbiAnICtcblx0XHQgICAgdGhpcy5fYWxnbyArICcgRGlmZmllLUhlbGxtYW4nKSk7XG5cdH1cblxuXHRpZiAocGsuY3VydmUgIT09IHRoaXMuX2N1cnZlKSB7XG5cdFx0dGhyb3cgKG5ldyBFcnJvcignQSBrZXkgZnJvbSB0aGUgJyArIHBrLmN1cnZlICsgJyBjdXJ2ZSAnICtcblx0XHQgICAgJ2Nhbm5vdCBiZSB1c2VkIHdpdGggYSAnICsgdGhpcy5fY3VydmUgK1xuXHRcdCAgICAnIERpZmZpZS1IZWxsbWFuJykpO1xuXHR9XG5cblx0aWYgKHBrLnR5cGUgPT09ICdkc2EnKSB7XG5cdFx0YXNzZXJ0LmRlZXBFcXVhbChway5wYXJ0LnAsIHRoaXMuX3AsXG5cdFx0ICAgICdEU0Ega2V5IHByaW1lIGRvZXMgbm90IG1hdGNoJyk7XG5cdFx0YXNzZXJ0LmRlZXBFcXVhbChway5wYXJ0LmcsIHRoaXMuX2csXG5cdFx0ICAgICdEU0Ega2V5IGdlbmVyYXRvciBkb2VzIG5vdCBtYXRjaCcpO1xuXHR9XG59O1xuXG5EaWZmaWVIZWxsbWFuLnByb3RvdHlwZS5zZXRLZXkgPSBmdW5jdGlvbiAocGspIHtcblx0dGhpcy5fa2V5Q2hlY2socGspO1xuXG5cdGlmIChway50eXBlID09PSAnZHNhJykge1xuXHRcdHRoaXMuX2RoLnNldFByaXZhdGVLZXkocGsucGFydC54LmRhdGEpO1xuXHRcdHRoaXMuX2RoLnNldFB1YmxpY0tleShway5wYXJ0LnkuZGF0YSk7XG5cblx0fSBlbHNlIGlmIChway50eXBlID09PSAnZWNkc2EnKSB7XG5cdFx0aWYgKENSWVBUT19IQVZFX0VDREgpIHtcblx0XHRcdHRoaXMuX2RoLnNldFByaXZhdGVLZXkocGsucGFydC5kLmRhdGEpO1xuXHRcdFx0dGhpcy5fZGguc2V0UHVibGljS2V5KHBrLnBhcnQuUS5kYXRhKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5fcHJpdiA9IG5ldyBFQ1ByaXZhdGUoXG5cdFx0XHQgICAgdGhpcy5fZWNQYXJhbXMsIHBrLnBhcnQuZC5kYXRhKTtcblx0XHR9XG5cblx0fSBlbHNlIGlmIChway50eXBlID09PSAnY3VydmUyNTUxOScpIHtcblx0XHR2YXIgayA9IHBrLnBhcnQuaztcblx0XHRpZiAoIXBrLnBhcnQuaylcblx0XHRcdGsgPSBway5wYXJ0LnI7XG5cdFx0dGhpcy5fcHJpdiA9IGsuZGF0YTtcblx0XHRpZiAodGhpcy5fcHJpdlswXSA9PT0gMHgwMClcblx0XHRcdHRoaXMuX3ByaXYgPSB0aGlzLl9wcml2LnNsaWNlKDEpO1xuXHRcdHRoaXMuX3ByaXYgPSB0aGlzLl9wcml2LnNsaWNlKDAsIDMyKTtcblx0fVxuXHR0aGlzLl9rZXkgPSBwaztcblx0dGhpcy5faXNQcml2ID0gdHJ1ZTtcbn07XG5EaWZmaWVIZWxsbWFuLnByb3RvdHlwZS5zZXRQcml2YXRlS2V5ID0gRGlmZmllSGVsbG1hbi5wcm90b3R5cGUuc2V0S2V5O1xuXG5EaWZmaWVIZWxsbWFuLnByb3RvdHlwZS5jb21wdXRlU2VjcmV0ID0gZnVuY3Rpb24gKG90aGVycGspIHtcblx0dGhpcy5fa2V5Q2hlY2sob3RoZXJwaywgdHJ1ZSk7XG5cdGlmICghdGhpcy5faXNQcml2KVxuXHRcdHRocm93IChuZXcgRXJyb3IoJ0RIIGV4Y2hhbmdlIGhhcyBub3QgYmVlbiBpbml0aWFsaXplZCB3aXRoICcgK1xuXHRcdCAgICAnYSBwcml2YXRlIGtleSB5ZXQnKSk7XG5cblx0dmFyIHB1Yjtcblx0aWYgKHRoaXMuX2FsZ28gPT09ICdkc2EnKSB7XG5cdFx0cmV0dXJuICh0aGlzLl9kaC5jb21wdXRlU2VjcmV0KFxuXHRcdCAgICBvdGhlcnBrLnBhcnQueS5kYXRhKSk7XG5cblx0fSBlbHNlIGlmICh0aGlzLl9hbGdvID09PSAnZWNkc2EnKSB7XG5cdFx0aWYgKENSWVBUT19IQVZFX0VDREgpIHtcblx0XHRcdHJldHVybiAodGhpcy5fZGguY29tcHV0ZVNlY3JldChcblx0XHRcdCAgICBvdGhlcnBrLnBhcnQuUS5kYXRhKSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHB1YiA9IG5ldyBFQ1B1YmxpYyhcblx0XHRcdCAgICB0aGlzLl9lY1BhcmFtcywgb3RoZXJway5wYXJ0LlEuZGF0YSk7XG5cdFx0XHRyZXR1cm4gKHRoaXMuX3ByaXYuZGVyaXZlU2hhcmVkU2VjcmV0KHB1YikpO1xuXHRcdH1cblxuXHR9IGVsc2UgaWYgKHRoaXMuX2FsZ28gPT09ICdjdXJ2ZTI1NTE5Jykge1xuXHRcdHB1YiA9IG90aGVycGsucGFydC5BLmRhdGE7XG5cdFx0d2hpbGUgKHB1YlswXSA9PT0gMHgwMCAmJiBwdWIubGVuZ3RoID4gMzIpXG5cdFx0XHRwdWIgPSBwdWIuc2xpY2UoMSk7XG5cdFx0dmFyIHByaXYgPSB0aGlzLl9wcml2O1xuXHRcdGFzc2VydC5zdHJpY3RFcXVhbChwdWIubGVuZ3RoLCAzMik7XG5cdFx0YXNzZXJ0LnN0cmljdEVxdWFsKHByaXYubGVuZ3RoLCAzMik7XG5cblx0XHR2YXIgc2VjcmV0ID0gbmFjbC5ib3guYmVmb3JlKG5ldyBVaW50OEFycmF5KHB1YiksXG5cdFx0ICAgIG5ldyBVaW50OEFycmF5KHByaXYpKTtcblxuXHRcdHJldHVybiAoQnVmZmVyLmZyb20oc2VjcmV0KSk7XG5cdH1cblxuXHR0aHJvdyAobmV3IEVycm9yKCdJbnZhbGlkIGFsZ29yaXRobTogJyArIHRoaXMuX2FsZ28pKTtcbn07XG5cbkRpZmZpZUhlbGxtYW4ucHJvdG90eXBlLmdlbmVyYXRlS2V5ID0gZnVuY3Rpb24gKCkge1xuXHR2YXIgcGFydHMgPSBbXTtcblx0dmFyIHByaXYsIHB1Yjtcblx0aWYgKHRoaXMuX2FsZ28gPT09ICdkc2EnKSB7XG5cdFx0dGhpcy5fZGguZ2VuZXJhdGVLZXlzKCk7XG5cblx0XHRwYXJ0cy5wdXNoKHtuYW1lOiAncCcsIGRhdGE6IHRoaXMuX3AuZGF0YX0pO1xuXHRcdHBhcnRzLnB1c2goe25hbWU6ICdxJywgZGF0YTogdGhpcy5fa2V5LnBhcnQucS5kYXRhfSk7XG5cdFx0cGFydHMucHVzaCh7bmFtZTogJ2cnLCBkYXRhOiB0aGlzLl9nLmRhdGF9KTtcblx0XHRwYXJ0cy5wdXNoKHtuYW1lOiAneScsIGRhdGE6IHRoaXMuX2RoLmdldFB1YmxpY0tleSgpfSk7XG5cdFx0cGFydHMucHVzaCh7bmFtZTogJ3gnLCBkYXRhOiB0aGlzLl9kaC5nZXRQcml2YXRlS2V5KCl9KTtcblx0XHR0aGlzLl9rZXkgPSBuZXcgUHJpdmF0ZUtleSh7XG5cdFx0XHR0eXBlOiAnZHNhJyxcblx0XHRcdHBhcnRzOiBwYXJ0c1xuXHRcdH0pO1xuXHRcdHRoaXMuX2lzUHJpdiA9IHRydWU7XG5cdFx0cmV0dXJuICh0aGlzLl9rZXkpO1xuXG5cdH0gZWxzZSBpZiAodGhpcy5fYWxnbyA9PT0gJ2VjZHNhJykge1xuXHRcdGlmIChDUllQVE9fSEFWRV9FQ0RIKSB7XG5cdFx0XHR0aGlzLl9kaC5nZW5lcmF0ZUtleXMoKTtcblxuXHRcdFx0cGFydHMucHVzaCh7bmFtZTogJ2N1cnZlJyxcblx0XHRcdCAgICBkYXRhOiBCdWZmZXIuZnJvbSh0aGlzLl9jdXJ2ZSl9KTtcblx0XHRcdHBhcnRzLnB1c2goe25hbWU6ICdRJywgZGF0YTogdGhpcy5fZGguZ2V0UHVibGljS2V5KCl9KTtcblx0XHRcdHBhcnRzLnB1c2goe25hbWU6ICdkJywgZGF0YTogdGhpcy5fZGguZ2V0UHJpdmF0ZUtleSgpfSk7XG5cdFx0XHR0aGlzLl9rZXkgPSBuZXcgUHJpdmF0ZUtleSh7XG5cdFx0XHRcdHR5cGU6ICdlY2RzYScsXG5cdFx0XHRcdGN1cnZlOiB0aGlzLl9jdXJ2ZSxcblx0XHRcdFx0cGFydHM6IHBhcnRzXG5cdFx0XHR9KTtcblx0XHRcdHRoaXMuX2lzUHJpdiA9IHRydWU7XG5cdFx0XHRyZXR1cm4gKHRoaXMuX2tleSk7XG5cblx0XHR9IGVsc2Uge1xuXHRcdFx0dmFyIG4gPSB0aGlzLl9lY1BhcmFtcy5nZXROKCk7XG5cdFx0XHR2YXIgciA9IG5ldyBqc2JuKGNyeXB0by5yYW5kb21CeXRlcyhuLmJpdExlbmd0aCgpKSk7XG5cdFx0XHR2YXIgbjEgPSBuLnN1YnRyYWN0KGpzYm4uT05FKTtcblx0XHRcdHByaXYgPSByLm1vZChuMSkuYWRkKGpzYm4uT05FKTtcblx0XHRcdHB1YiA9IHRoaXMuX2VjUGFyYW1zLmdldEcoKS5tdWx0aXBseShwcml2KTtcblxuXHRcdFx0cHJpdiA9IEJ1ZmZlci5mcm9tKHByaXYudG9CeXRlQXJyYXkoKSk7XG5cdFx0XHRwdWIgPSBCdWZmZXIuZnJvbSh0aGlzLl9lY1BhcmFtcy5nZXRDdXJ2ZSgpLlxuXHRcdFx0ICAgIGVuY29kZVBvaW50SGV4KHB1YiksICdoZXgnKTtcblxuXHRcdFx0dGhpcy5fcHJpdiA9IG5ldyBFQ1ByaXZhdGUodGhpcy5fZWNQYXJhbXMsIHByaXYpO1xuXG5cdFx0XHRwYXJ0cy5wdXNoKHtuYW1lOiAnY3VydmUnLFxuXHRcdFx0ICAgIGRhdGE6IEJ1ZmZlci5mcm9tKHRoaXMuX2N1cnZlKX0pO1xuXHRcdFx0cGFydHMucHVzaCh7bmFtZTogJ1EnLCBkYXRhOiBwdWJ9KTtcblx0XHRcdHBhcnRzLnB1c2goe25hbWU6ICdkJywgZGF0YTogcHJpdn0pO1xuXG5cdFx0XHR0aGlzLl9rZXkgPSBuZXcgUHJpdmF0ZUtleSh7XG5cdFx0XHRcdHR5cGU6ICdlY2RzYScsXG5cdFx0XHRcdGN1cnZlOiB0aGlzLl9jdXJ2ZSxcblx0XHRcdFx0cGFydHM6IHBhcnRzXG5cdFx0XHR9KTtcblx0XHRcdHRoaXMuX2lzUHJpdiA9IHRydWU7XG5cdFx0XHRyZXR1cm4gKHRoaXMuX2tleSk7XG5cdFx0fVxuXG5cdH0gZWxzZSBpZiAodGhpcy5fYWxnbyA9PT0gJ2N1cnZlMjU1MTknKSB7XG5cdFx0dmFyIHBhaXIgPSBuYWNsLmJveC5rZXlQYWlyKCk7XG5cdFx0cHJpdiA9IEJ1ZmZlci5mcm9tKHBhaXIuc2VjcmV0S2V5KTtcblx0XHRwdWIgPSBCdWZmZXIuZnJvbShwYWlyLnB1YmxpY0tleSk7XG5cdFx0cHJpdiA9IEJ1ZmZlci5jb25jYXQoW3ByaXYsIHB1Yl0pO1xuXHRcdGFzc2VydC5zdHJpY3RFcXVhbChwcml2Lmxlbmd0aCwgNjQpO1xuXHRcdGFzc2VydC5zdHJpY3RFcXVhbChwdWIubGVuZ3RoLCAzMik7XG5cblx0XHRwYXJ0cy5wdXNoKHtuYW1lOiAnQScsIGRhdGE6IHB1Yn0pO1xuXHRcdHBhcnRzLnB1c2goe25hbWU6ICdrJywgZGF0YTogcHJpdn0pO1xuXHRcdHRoaXMuX2tleSA9IG5ldyBQcml2YXRlS2V5KHtcblx0XHRcdHR5cGU6ICdjdXJ2ZTI1NTE5Jyxcblx0XHRcdHBhcnRzOiBwYXJ0c1xuXHRcdH0pO1xuXHRcdHRoaXMuX2lzUHJpdiA9IHRydWU7XG5cdFx0cmV0dXJuICh0aGlzLl9rZXkpO1xuXHR9XG5cblx0dGhyb3cgKG5ldyBFcnJvcignSW52YWxpZCBhbGdvcml0aG06ICcgKyB0aGlzLl9hbGdvKSk7XG59O1xuRGlmZmllSGVsbG1hbi5wcm90b3R5cGUuZ2VuZXJhdGVLZXlzID0gRGlmZmllSGVsbG1hbi5wcm90b3R5cGUuZ2VuZXJhdGVLZXk7XG5cbi8qIFRoZXNlIGFyZSBoZWxwZXJzIGZvciB1c2luZyBlY2MtanNibiAoZm9yIG5vZGUgMC4xMCBjb21wYXRpYmlsaXR5KS4gKi9cblxuZnVuY3Rpb24gWDlFQ1BhcmFtZXRlcnMobmFtZSkge1xuXHR2YXIgcGFyYW1zID0gYWxncy5jdXJ2ZXNbbmFtZV07XG5cdGFzc2VydC5vYmplY3QocGFyYW1zKTtcblxuXHR2YXIgcCA9IG5ldyBqc2JuKHBhcmFtcy5wKTtcblx0dmFyIGEgPSBuZXcganNibihwYXJhbXMuYSk7XG5cdHZhciBiID0gbmV3IGpzYm4ocGFyYW1zLmIpO1xuXHR2YXIgbiA9IG5ldyBqc2JuKHBhcmFtcy5uKTtcblx0dmFyIGggPSBqc2JuLk9ORTtcblx0dmFyIGN1cnZlID0gbmV3IGVjLkVDQ3VydmVGcChwLCBhLCBiKTtcblx0dmFyIEcgPSBjdXJ2ZS5kZWNvZGVQb2ludEhleChwYXJhbXMuRy50b1N0cmluZygnaGV4JykpO1xuXG5cdHRoaXMuY3VydmUgPSBjdXJ2ZTtcblx0dGhpcy5nID0gRztcblx0dGhpcy5uID0gbjtcblx0dGhpcy5oID0gaDtcbn1cblg5RUNQYXJhbWV0ZXJzLnByb3RvdHlwZS5nZXRDdXJ2ZSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICh0aGlzLmN1cnZlKTsgfTtcblg5RUNQYXJhbWV0ZXJzLnByb3RvdHlwZS5nZXRHID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gKHRoaXMuZyk7IH07XG5YOUVDUGFyYW1ldGVycy5wcm90b3R5cGUuZ2V0TiA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICh0aGlzLm4pOyB9O1xuWDlFQ1BhcmFtZXRlcnMucHJvdG90eXBlLmdldEggPSBmdW5jdGlvbiAoKSB7IHJldHVybiAodGhpcy5oKTsgfTtcblxuZnVuY3Rpb24gRUNQdWJsaWMocGFyYW1zLCBidWZmZXIpIHtcblx0dGhpcy5fcGFyYW1zID0gcGFyYW1zO1xuXHRpZiAoYnVmZmVyWzBdID09PSAweDAwKVxuXHRcdGJ1ZmZlciA9IGJ1ZmZlci5zbGljZSgxKTtcblx0dGhpcy5fcHViID0gcGFyYW1zLmdldEN1cnZlKCkuZGVjb2RlUG9pbnRIZXgoYnVmZmVyLnRvU3RyaW5nKCdoZXgnKSk7XG59XG5cbmZ1bmN0aW9uIEVDUHJpdmF0ZShwYXJhbXMsIGJ1ZmZlcikge1xuXHR0aGlzLl9wYXJhbXMgPSBwYXJhbXM7XG5cdHRoaXMuX3ByaXYgPSBuZXcganNibih1dGlscy5tcE5vcm1hbGl6ZShidWZmZXIpKTtcbn1cbkVDUHJpdmF0ZS5wcm90b3R5cGUuZGVyaXZlU2hhcmVkU2VjcmV0ID0gZnVuY3Rpb24gKHB1YktleSkge1xuXHRhc3NlcnQub2socHViS2V5IGluc3RhbmNlb2YgRUNQdWJsaWMpO1xuXHR2YXIgUyA9IHB1YktleS5fcHViLm11bHRpcGx5KHRoaXMuX3ByaXYpO1xuXHRyZXR1cm4gKEJ1ZmZlci5mcm9tKFMuZ2V0WCgpLnRvQmlnSW50ZWdlcigpLnRvQnl0ZUFycmF5KCkpKTtcbn07XG5cbmZ1bmN0aW9uIGdlbmVyYXRlRUQyNTUxOSgpIHtcblx0dmFyIHBhaXIgPSBuYWNsLnNpZ24ua2V5UGFpcigpO1xuXHR2YXIgcHJpdiA9IEJ1ZmZlci5mcm9tKHBhaXIuc2VjcmV0S2V5KTtcblx0dmFyIHB1YiA9IEJ1ZmZlci5mcm9tKHBhaXIucHVibGljS2V5KTtcblx0YXNzZXJ0LnN0cmljdEVxdWFsKHByaXYubGVuZ3RoLCA2NCk7XG5cdGFzc2VydC5zdHJpY3RFcXVhbChwdWIubGVuZ3RoLCAzMik7XG5cblx0dmFyIHBhcnRzID0gW107XG5cdHBhcnRzLnB1c2goe25hbWU6ICdBJywgZGF0YTogcHVifSk7XG5cdHBhcnRzLnB1c2goe25hbWU6ICdrJywgZGF0YTogcHJpdi5zbGljZSgwLCAzMil9KTtcblx0dmFyIGtleSA9IG5ldyBQcml2YXRlS2V5KHtcblx0XHR0eXBlOiAnZWQyNTUxOScsXG5cdFx0cGFydHM6IHBhcnRzXG5cdH0pO1xuXHRyZXR1cm4gKGtleSk7XG59XG5cbi8qIEdlbmVyYXRlcyBhIG5ldyBFQ0RTQSBwcml2YXRlIGtleSBvbiBhIGdpdmVuIGN1cnZlLiAqL1xuZnVuY3Rpb24gZ2VuZXJhdGVFQ0RTQShjdXJ2ZSkge1xuXHR2YXIgcGFydHMgPSBbXTtcblx0dmFyIGtleTtcblxuXHRpZiAoQ1JZUFRPX0hBVkVfRUNESCkge1xuXHRcdC8qXG5cdFx0ICogTm9kZSBjcnlwdG8gZG9lc24ndCBleHBvc2Uga2V5IGdlbmVyYXRpb24gZGlyZWN0bHksIGJ1dCB0aGVcblx0XHQgKiBFQ0RIIGluc3RhbmNlcyBjYW4gZ2VuZXJhdGUga2V5cy4gSXQgdHVybnMgb3V0IHRoaXMganVzdFxuXHRcdCAqIGNhbGxzIGludG8gdGhlIE9wZW5TU0wgZ2VuZXJpYyBrZXkgZ2VuZXJhdG9yLCBhbmQgd2UgY2FuXG5cdFx0ICogcmVhZCBpdHMgb3V0cHV0IGhhcHBpbHkgd2l0aG91dCBkb2luZyBhbiBhY3R1YWwgREguIFNvIHdlXG5cdFx0ICogdXNlIHRoYXQgaGVyZS5cblx0XHQgKi9cblx0XHR2YXIgb3NDdXJ2ZSA9IHtcblx0XHRcdCduaXN0cDI1Nic6ICdwcmltZTI1NnYxJyxcblx0XHRcdCduaXN0cDM4NCc6ICdzZWNwMzg0cjEnLFxuXHRcdFx0J25pc3RwNTIxJzogJ3NlY3A1MjFyMSdcblx0XHR9W2N1cnZlXTtcblxuXHRcdHZhciBkaCA9IGNyeXB0by5jcmVhdGVFQ0RIKG9zQ3VydmUpO1xuXHRcdGRoLmdlbmVyYXRlS2V5cygpO1xuXG5cdFx0cGFydHMucHVzaCh7bmFtZTogJ2N1cnZlJyxcblx0XHQgICAgZGF0YTogQnVmZmVyLmZyb20oY3VydmUpfSk7XG5cdFx0cGFydHMucHVzaCh7bmFtZTogJ1EnLCBkYXRhOiBkaC5nZXRQdWJsaWNLZXkoKX0pO1xuXHRcdHBhcnRzLnB1c2goe25hbWU6ICdkJywgZGF0YTogZGguZ2V0UHJpdmF0ZUtleSgpfSk7XG5cblx0XHRrZXkgPSBuZXcgUHJpdmF0ZUtleSh7XG5cdFx0XHR0eXBlOiAnZWNkc2EnLFxuXHRcdFx0Y3VydmU6IGN1cnZlLFxuXHRcdFx0cGFydHM6IHBhcnRzXG5cdFx0fSk7XG5cdFx0cmV0dXJuIChrZXkpO1xuXHR9IGVsc2Uge1xuXG5cdFx0dmFyIGVjUGFyYW1zID0gbmV3IFg5RUNQYXJhbWV0ZXJzKGN1cnZlKTtcblxuXHRcdC8qIFRoaXMgYWxnb3JpdGhtIHRha2VuIGZyb20gRklQUyBQVUIgMTg2LTQgKHNlY3Rpb24gQi40LjEpICovXG5cdFx0dmFyIG4gPSBlY1BhcmFtcy5nZXROKCk7XG5cdFx0Lypcblx0XHQgKiBUaGUgY3J5cHRvLnJhbmRvbUJ5dGVzKCkgZnVuY3Rpb24gY2FuIG9ubHkgZ2l2ZSB1cyB3aG9sZVxuXHRcdCAqIGJ5dGVzLCBzbyB0YWtpbmcgYSBub2QgZnJvbSBYOS42Miwgd2Ugcm91bmQgdXAuXG5cdFx0ICovXG5cdFx0dmFyIGNCeXRlTGVuID0gTWF0aC5jZWlsKChuLmJpdExlbmd0aCgpICsgNjQpIC8gOCk7XG5cdFx0dmFyIGMgPSBuZXcganNibihjcnlwdG8ucmFuZG9tQnl0ZXMoY0J5dGVMZW4pKTtcblxuXHRcdHZhciBuMSA9IG4uc3VidHJhY3QoanNibi5PTkUpO1xuXHRcdHZhciBwcml2ID0gYy5tb2QobjEpLmFkZChqc2JuLk9ORSk7XG5cdFx0dmFyIHB1YiA9IGVjUGFyYW1zLmdldEcoKS5tdWx0aXBseShwcml2KTtcblxuXHRcdHByaXYgPSBCdWZmZXIuZnJvbShwcml2LnRvQnl0ZUFycmF5KCkpO1xuXHRcdHB1YiA9IEJ1ZmZlci5mcm9tKGVjUGFyYW1zLmdldEN1cnZlKCkuXG5cdFx0ICAgIGVuY29kZVBvaW50SGV4KHB1YiksICdoZXgnKTtcblxuXHRcdHBhcnRzLnB1c2goe25hbWU6ICdjdXJ2ZScsIGRhdGE6IEJ1ZmZlci5mcm9tKGN1cnZlKX0pO1xuXHRcdHBhcnRzLnB1c2goe25hbWU6ICdRJywgZGF0YTogcHVifSk7XG5cdFx0cGFydHMucHVzaCh7bmFtZTogJ2QnLCBkYXRhOiBwcml2fSk7XG5cblx0XHRrZXkgPSBuZXcgUHJpdmF0ZUtleSh7XG5cdFx0XHR0eXBlOiAnZWNkc2EnLFxuXHRcdFx0Y3VydmU6IGN1cnZlLFxuXHRcdFx0cGFydHM6IHBhcnRzXG5cdFx0fSk7XG5cdFx0cmV0dXJuIChrZXkpO1xuXHR9XG59XG4iLCIvLyBDb3B5cmlnaHQgMjAxNyBKb3llbnQsIEluYy5cblxubW9kdWxlLmV4cG9ydHMgPSBJZGVudGl0eTtcblxudmFyIGFzc2VydCA9IHJlcXVpcmUoJ2Fzc2VydC1wbHVzJyk7XG52YXIgYWxncyA9IHJlcXVpcmUoJy4vYWxncycpO1xudmFyIGNyeXB0byA9IHJlcXVpcmUoJ2NyeXB0bycpO1xudmFyIEZpbmdlcnByaW50ID0gcmVxdWlyZSgnLi9maW5nZXJwcmludCcpO1xudmFyIFNpZ25hdHVyZSA9IHJlcXVpcmUoJy4vc2lnbmF0dXJlJyk7XG52YXIgZXJycyA9IHJlcXVpcmUoJy4vZXJyb3JzJyk7XG52YXIgdXRpbCA9IHJlcXVpcmUoJ3V0aWwnKTtcbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcbnZhciBhc24xID0gcmVxdWlyZSgnYXNuMScpO1xudmFyIEJ1ZmZlciA9IHJlcXVpcmUoJ3NhZmVyLWJ1ZmZlcicpLkJ1ZmZlcjtcblxuLypKU1NUWUxFRCovXG52YXIgRE5TX05BTUVfUkUgPSAvXihbKl18W2EtejAtOV1bYS16MC05XFwtXXswLDYyfSkoPzpcXC4oWypdfFthLXowLTldW2EtejAtOVxcLV17MCw2Mn0pKSokL2k7XG5cbnZhciBvaWRzID0ge307XG5vaWRzLmNuID0gJzIuNS40LjMnO1xub2lkcy5vID0gJzIuNS40LjEwJztcbm9pZHMub3UgPSAnMi41LjQuMTEnO1xub2lkcy5sID0gJzIuNS40LjcnO1xub2lkcy5zID0gJzIuNS40LjgnO1xub2lkcy5jID0gJzIuNS40LjYnO1xub2lkcy5zbiA9ICcyLjUuNC40Jztcbm9pZHMucG9zdGFsQ29kZSA9ICcyLjUuNC4xNyc7XG5vaWRzLnNlcmlhbE51bWJlciA9ICcyLjUuNC41Jztcbm9pZHMuc3RyZWV0ID0gJzIuNS40LjknO1xub2lkcy54NTAwVW5pcXVlSWRlbnRpZmllciA9ICcyLjUuNC40NSc7XG5vaWRzLnJvbGUgPSAnMi41LjQuNzInO1xub2lkcy50ZWxlcGhvbmVOdW1iZXIgPSAnMi41LjQuMjAnO1xub2lkcy5kZXNjcmlwdGlvbiA9ICcyLjUuNC4xMyc7XG5vaWRzLmRjID0gJzAuOS4yMzQyLjE5MjAwMzAwLjEwMC4xLjI1Jztcbm9pZHMudWlkID0gJzAuOS4yMzQyLjE5MjAwMzAwLjEwMC4xLjEnO1xub2lkcy5tYWlsID0gJzAuOS4yMzQyLjE5MjAwMzAwLjEwMC4xLjMnO1xub2lkcy50aXRsZSA9ICcyLjUuNC4xMic7XG5vaWRzLmduID0gJzIuNS40LjQyJztcbm9pZHMuaW5pdGlhbHMgPSAnMi41LjQuNDMnO1xub2lkcy5wc2V1ZG9ueW0gPSAnMi41LjQuNjUnO1xub2lkcy5lbWFpbEFkZHJlc3MgPSAnMS4yLjg0MC4xMTM1NDkuMS45LjEnO1xuXG52YXIgdW5vaWRzID0ge307XG5PYmplY3Qua2V5cyhvaWRzKS5mb3JFYWNoKGZ1bmN0aW9uIChrKSB7XG5cdHVub2lkc1tvaWRzW2tdXSA9IGs7XG59KTtcblxuZnVuY3Rpb24gSWRlbnRpdHkob3B0cykge1xuXHR2YXIgc2VsZiA9IHRoaXM7XG5cdGFzc2VydC5vYmplY3Qob3B0cywgJ29wdGlvbnMnKTtcblx0YXNzZXJ0LmFycmF5T2ZPYmplY3Qob3B0cy5jb21wb25lbnRzLCAnb3B0aW9ucy5jb21wb25lbnRzJyk7XG5cdHRoaXMuY29tcG9uZW50cyA9IG9wdHMuY29tcG9uZW50cztcblx0dGhpcy5jb21wb25lbnRMb29rdXAgPSB7fTtcblx0dGhpcy5jb21wb25lbnRzLmZvckVhY2goZnVuY3Rpb24gKGMpIHtcblx0XHRpZiAoYy5uYW1lICYmICFjLm9pZClcblx0XHRcdGMub2lkID0gb2lkc1tjLm5hbWVdO1xuXHRcdGlmIChjLm9pZCAmJiAhYy5uYW1lKVxuXHRcdFx0Yy5uYW1lID0gdW5vaWRzW2Mub2lkXTtcblx0XHRpZiAoc2VsZi5jb21wb25lbnRMb29rdXBbYy5uYW1lXSA9PT0gdW5kZWZpbmVkKVxuXHRcdFx0c2VsZi5jb21wb25lbnRMb29rdXBbYy5uYW1lXSA9IFtdO1xuXHRcdHNlbGYuY29tcG9uZW50TG9va3VwW2MubmFtZV0ucHVzaChjKTtcblx0fSk7XG5cdGlmICh0aGlzLmNvbXBvbmVudExvb2t1cC5jbiAmJiB0aGlzLmNvbXBvbmVudExvb2t1cC5jbi5sZW5ndGggPiAwKSB7XG5cdFx0dGhpcy5jbiA9IHRoaXMuY29tcG9uZW50TG9va3VwLmNuWzBdLnZhbHVlO1xuXHR9XG5cdGFzc2VydC5vcHRpb25hbFN0cmluZyhvcHRzLnR5cGUsICdvcHRpb25zLnR5cGUnKTtcblx0aWYgKG9wdHMudHlwZSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0aWYgKHRoaXMuY29tcG9uZW50cy5sZW5ndGggPT09IDEgJiZcblx0XHQgICAgdGhpcy5jb21wb25lbnRMb29rdXAuY24gJiZcblx0XHQgICAgdGhpcy5jb21wb25lbnRMb29rdXAuY24ubGVuZ3RoID09PSAxICYmXG5cdFx0ICAgIHRoaXMuY29tcG9uZW50TG9va3VwLmNuWzBdLnZhbHVlLm1hdGNoKEROU19OQU1FX1JFKSkge1xuXHRcdFx0dGhpcy50eXBlID0gJ2hvc3QnO1xuXHRcdFx0dGhpcy5ob3N0bmFtZSA9IHRoaXMuY29tcG9uZW50TG9va3VwLmNuWzBdLnZhbHVlO1xuXG5cdFx0fSBlbHNlIGlmICh0aGlzLmNvbXBvbmVudExvb2t1cC5kYyAmJlxuXHRcdCAgICB0aGlzLmNvbXBvbmVudHMubGVuZ3RoID09PSB0aGlzLmNvbXBvbmVudExvb2t1cC5kYy5sZW5ndGgpIHtcblx0XHRcdHRoaXMudHlwZSA9ICdob3N0Jztcblx0XHRcdHRoaXMuaG9zdG5hbWUgPSB0aGlzLmNvbXBvbmVudExvb2t1cC5kYy5tYXAoXG5cdFx0XHQgICAgZnVuY3Rpb24gKGMpIHtcblx0XHRcdFx0cmV0dXJuIChjLnZhbHVlKTtcblx0XHRcdH0pLmpvaW4oJy4nKTtcblxuXHRcdH0gZWxzZSBpZiAodGhpcy5jb21wb25lbnRMb29rdXAudWlkICYmXG5cdFx0ICAgIHRoaXMuY29tcG9uZW50cy5sZW5ndGggPT09XG5cdFx0ICAgIHRoaXMuY29tcG9uZW50TG9va3VwLnVpZC5sZW5ndGgpIHtcblx0XHRcdHRoaXMudHlwZSA9ICd1c2VyJztcblx0XHRcdHRoaXMudWlkID0gdGhpcy5jb21wb25lbnRMb29rdXAudWlkWzBdLnZhbHVlO1xuXG5cdFx0fSBlbHNlIGlmICh0aGlzLmNvbXBvbmVudExvb2t1cC5jbiAmJlxuXHRcdCAgICB0aGlzLmNvbXBvbmVudExvb2t1cC5jbi5sZW5ndGggPT09IDEgJiZcblx0XHQgICAgdGhpcy5jb21wb25lbnRMb29rdXAuY25bMF0udmFsdWUubWF0Y2goRE5TX05BTUVfUkUpKSB7XG5cdFx0XHR0aGlzLnR5cGUgPSAnaG9zdCc7XG5cdFx0XHR0aGlzLmhvc3RuYW1lID0gdGhpcy5jb21wb25lbnRMb29rdXAuY25bMF0udmFsdWU7XG5cblx0XHR9IGVsc2UgaWYgKHRoaXMuY29tcG9uZW50TG9va3VwLnVpZCAmJlxuXHRcdCAgICB0aGlzLmNvbXBvbmVudExvb2t1cC51aWQubGVuZ3RoID09PSAxKSB7XG5cdFx0XHR0aGlzLnR5cGUgPSAndXNlcic7XG5cdFx0XHR0aGlzLnVpZCA9IHRoaXMuY29tcG9uZW50TG9va3VwLnVpZFswXS52YWx1ZTtcblxuXHRcdH0gZWxzZSBpZiAodGhpcy5jb21wb25lbnRMb29rdXAubWFpbCAmJlxuXHRcdCAgICB0aGlzLmNvbXBvbmVudExvb2t1cC5tYWlsLmxlbmd0aCA9PT0gMSkge1xuXHRcdFx0dGhpcy50eXBlID0gJ2VtYWlsJztcblx0XHRcdHRoaXMuZW1haWwgPSB0aGlzLmNvbXBvbmVudExvb2t1cC5tYWlsWzBdLnZhbHVlO1xuXG5cdFx0fSBlbHNlIGlmICh0aGlzLmNvbXBvbmVudExvb2t1cC5jbiAmJlxuXHRcdCAgICB0aGlzLmNvbXBvbmVudExvb2t1cC5jbi5sZW5ndGggPT09IDEpIHtcblx0XHRcdHRoaXMudHlwZSA9ICd1c2VyJztcblx0XHRcdHRoaXMudWlkID0gdGhpcy5jb21wb25lbnRMb29rdXAuY25bMF0udmFsdWU7XG5cblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy50eXBlID0gJ3Vua25vd24nO1xuXHRcdH1cblx0fSBlbHNlIHtcblx0XHR0aGlzLnR5cGUgPSBvcHRzLnR5cGU7XG5cdFx0aWYgKHRoaXMudHlwZSA9PT0gJ2hvc3QnKVxuXHRcdFx0dGhpcy5ob3N0bmFtZSA9IG9wdHMuaG9zdG5hbWU7XG5cdFx0ZWxzZSBpZiAodGhpcy50eXBlID09PSAndXNlcicpXG5cdFx0XHR0aGlzLnVpZCA9IG9wdHMudWlkO1xuXHRcdGVsc2UgaWYgKHRoaXMudHlwZSA9PT0gJ2VtYWlsJylcblx0XHRcdHRoaXMuZW1haWwgPSBvcHRzLmVtYWlsO1xuXHRcdGVsc2Vcblx0XHRcdHRocm93IChuZXcgRXJyb3IoJ1Vua25vd24gdHlwZSAnICsgdGhpcy50eXBlKSk7XG5cdH1cbn1cblxuSWRlbnRpdHkucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuXHRyZXR1cm4gKHRoaXMuY29tcG9uZW50cy5tYXAoZnVuY3Rpb24gKGMpIHtcblx0XHR2YXIgbiA9IGMubmFtZS50b1VwcGVyQ2FzZSgpO1xuXHRcdC8qSlNTVFlMRUQqL1xuXHRcdG4gPSBuLnJlcGxhY2UoLz0vZywgJ1xcXFw9Jyk7XG5cdFx0dmFyIHYgPSBjLnZhbHVlO1xuXHRcdC8qSlNTVFlMRUQqL1xuXHRcdHYgPSB2LnJlcGxhY2UoLywvZywgJ1xcXFwsJyk7XG5cdFx0cmV0dXJuIChuICsgJz0nICsgdik7XG5cdH0pLmpvaW4oJywgJykpO1xufTtcblxuSWRlbnRpdHkucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uIChuYW1lLCBhc0FycmF5KSB7XG5cdGFzc2VydC5zdHJpbmcobmFtZSwgJ25hbWUnKTtcblx0dmFyIGFyciA9IHRoaXMuY29tcG9uZW50TG9va3VwW25hbWVdO1xuXHRpZiAoYXJyID09PSB1bmRlZmluZWQgfHwgYXJyLmxlbmd0aCA9PT0gMClcblx0XHRyZXR1cm4gKHVuZGVmaW5lZCk7XG5cdGlmICghYXNBcnJheSAmJiBhcnIubGVuZ3RoID4gMSlcblx0XHR0aHJvdyAobmV3IEVycm9yKCdNdWx0aXBsZSB2YWx1ZXMgZm9yIGF0dHJpYnV0ZSAnICsgbmFtZSkpO1xuXHRpZiAoIWFzQXJyYXkpXG5cdFx0cmV0dXJuIChhcnJbMF0udmFsdWUpO1xuXHRyZXR1cm4gKGFyci5tYXAoZnVuY3Rpb24gKGMpIHtcblx0XHRyZXR1cm4gKGMudmFsdWUpO1xuXHR9KSk7XG59O1xuXG5JZGVudGl0eS5wcm90b3R5cGUudG9BcnJheSA9IGZ1bmN0aW9uIChpZHgpIHtcblx0cmV0dXJuICh0aGlzLmNvbXBvbmVudHMubWFwKGZ1bmN0aW9uIChjKSB7XG5cdFx0cmV0dXJuICh7XG5cdFx0XHRuYW1lOiBjLm5hbWUsXG5cdFx0XHR2YWx1ZTogYy52YWx1ZVxuXHRcdH0pO1xuXHR9KSk7XG59O1xuXG4vKlxuICogVGhlc2UgYXJlIGZyb20gWC42ODAgLS0gUHJpbnRhYmxlU3RyaW5nIGFsbG93ZWQgY2hhcnMgYXJlIGluIHNlY3Rpb24gMzcuNFxuICogdGFibGUgOC4gU3BlYyBmb3IgSUE1U3RyaW5ncyBpcyBcIjEsNiArIFNQQUNFICsgREVMXCIgd2hlcmUgMSByZWZlcnMgdG9cbiAqIElTTyBJUiAjMDAxIChzdGFuZGFyZCBBU0NJSSBjb250cm9sIGNoYXJhY3RlcnMpIGFuZCA2IHJlZmVycyB0byBJU08gSVIgIzAwNlxuICogKHRoZSBiYXNpYyBBU0NJSSBjaGFyYWN0ZXIgc2V0KS5cbiAqL1xuLyogSlNTVFlMRUQgKi9cbnZhciBOT1RfUFJJTlRBQkxFID0gL1teYS16QS1aMC05ICcoKSwrLlxcLzo9Py1dLztcbi8qIEpTU1RZTEVEICovXG52YXIgTk9UX0lBNSA9IC9bXlxceDAwLVxceDdmXS87XG5cbklkZW50aXR5LnByb3RvdHlwZS50b0FzbjEgPSBmdW5jdGlvbiAoZGVyLCB0YWcpIHtcblx0ZGVyLnN0YXJ0U2VxdWVuY2UodGFnKTtcblx0dGhpcy5jb21wb25lbnRzLmZvckVhY2goZnVuY3Rpb24gKGMpIHtcblx0XHRkZXIuc3RhcnRTZXF1ZW5jZShhc24xLkJlci5Db25zdHJ1Y3RvciB8IGFzbjEuQmVyLlNldCk7XG5cdFx0ZGVyLnN0YXJ0U2VxdWVuY2UoKTtcblx0XHRkZXIud3JpdGVPSUQoYy5vaWQpO1xuXHRcdC8qXG5cdFx0ICogSWYgd2UgZml0IGluIGEgUHJpbnRhYmxlU3RyaW5nLCB1c2UgdGhhdC4gT3RoZXJ3aXNlIHVzZSBhblxuXHRcdCAqIElBNVN0cmluZyBvciBVVEY4U3RyaW5nLlxuXHRcdCAqXG5cdFx0ICogSWYgdGhpcyBpZGVudGl0eSB3YXMgcGFyc2VkIGZyb20gYSBETiwgdXNlIHRoZSBBU04uMSB0eXBlc1xuXHRcdCAqIGZyb20gdGhlIG9yaWdpbmFsIHJlcHJlc2VudGF0aW9uIChvdGhlcndpc2UgdGhpcyBtaWdodCBub3Rcblx0XHQgKiBiZSBhIGZ1bGwgbWF0Y2ggZm9yIHRoZSBvcmlnaW5hbCBpbiBzb21lIHZhbGlkYXRvcnMpLlxuXHRcdCAqL1xuXHRcdGlmIChjLmFzbjF0eXBlID09PSBhc24xLkJlci5VdGY4U3RyaW5nIHx8XG5cdFx0ICAgIGMudmFsdWUubWF0Y2goTk9UX0lBNSkpIHtcblx0XHRcdHZhciB2ID0gQnVmZmVyLmZyb20oYy52YWx1ZSwgJ3V0ZjgnKTtcblx0XHRcdGRlci53cml0ZUJ1ZmZlcih2LCBhc24xLkJlci5VdGY4U3RyaW5nKTtcblxuXHRcdH0gZWxzZSBpZiAoYy5hc24xdHlwZSA9PT0gYXNuMS5CZXIuSUE1U3RyaW5nIHx8XG5cdFx0ICAgIGMudmFsdWUubWF0Y2goTk9UX1BSSU5UQUJMRSkpIHtcblx0XHRcdGRlci53cml0ZVN0cmluZyhjLnZhbHVlLCBhc24xLkJlci5JQTVTdHJpbmcpO1xuXG5cdFx0fSBlbHNlIHtcblx0XHRcdHZhciB0eXBlID0gYXNuMS5CZXIuUHJpbnRhYmxlU3RyaW5nO1xuXHRcdFx0aWYgKGMuYXNuMXR5cGUgIT09IHVuZGVmaW5lZClcblx0XHRcdFx0dHlwZSA9IGMuYXNuMXR5cGU7XG5cdFx0XHRkZXIud3JpdGVTdHJpbmcoYy52YWx1ZSwgdHlwZSk7XG5cdFx0fVxuXHRcdGRlci5lbmRTZXF1ZW5jZSgpO1xuXHRcdGRlci5lbmRTZXF1ZW5jZSgpO1xuXHR9KTtcblx0ZGVyLmVuZFNlcXVlbmNlKCk7XG59O1xuXG5mdW5jdGlvbiBnbG9iTWF0Y2goYSwgYikge1xuXHRpZiAoYSA9PT0gJyoqJyB8fCBiID09PSAnKionKVxuXHRcdHJldHVybiAodHJ1ZSk7XG5cdHZhciBhUGFydHMgPSBhLnNwbGl0KCcuJyk7XG5cdHZhciBiUGFydHMgPSBiLnNwbGl0KCcuJyk7XG5cdGlmIChhUGFydHMubGVuZ3RoICE9PSBiUGFydHMubGVuZ3RoKVxuXHRcdHJldHVybiAoZmFsc2UpO1xuXHRmb3IgKHZhciBpID0gMDsgaSA8IGFQYXJ0cy5sZW5ndGg7ICsraSkge1xuXHRcdGlmIChhUGFydHNbaV0gPT09ICcqJyB8fCBiUGFydHNbaV0gPT09ICcqJylcblx0XHRcdGNvbnRpbnVlO1xuXHRcdGlmIChhUGFydHNbaV0gIT09IGJQYXJ0c1tpXSlcblx0XHRcdHJldHVybiAoZmFsc2UpO1xuXHR9XG5cdHJldHVybiAodHJ1ZSk7XG59XG5cbklkZW50aXR5LnByb3RvdHlwZS5lcXVhbHMgPSBmdW5jdGlvbiAob3RoZXIpIHtcblx0aWYgKCFJZGVudGl0eS5pc0lkZW50aXR5KG90aGVyLCBbMSwgMF0pKVxuXHRcdHJldHVybiAoZmFsc2UpO1xuXHRpZiAob3RoZXIuY29tcG9uZW50cy5sZW5ndGggIT09IHRoaXMuY29tcG9uZW50cy5sZW5ndGgpXG5cdFx0cmV0dXJuIChmYWxzZSk7XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5jb21wb25lbnRzLmxlbmd0aDsgKytpKSB7XG5cdFx0aWYgKHRoaXMuY29tcG9uZW50c1tpXS5vaWQgIT09IG90aGVyLmNvbXBvbmVudHNbaV0ub2lkKVxuXHRcdFx0cmV0dXJuIChmYWxzZSk7XG5cdFx0aWYgKCFnbG9iTWF0Y2godGhpcy5jb21wb25lbnRzW2ldLnZhbHVlLFxuXHRcdCAgICBvdGhlci5jb21wb25lbnRzW2ldLnZhbHVlKSkge1xuXHRcdFx0cmV0dXJuIChmYWxzZSk7XG5cdFx0fVxuXHR9XG5cdHJldHVybiAodHJ1ZSk7XG59O1xuXG5JZGVudGl0eS5mb3JIb3N0ID0gZnVuY3Rpb24gKGhvc3RuYW1lKSB7XG5cdGFzc2VydC5zdHJpbmcoaG9zdG5hbWUsICdob3N0bmFtZScpO1xuXHRyZXR1cm4gKG5ldyBJZGVudGl0eSh7XG5cdFx0dHlwZTogJ2hvc3QnLFxuXHRcdGhvc3RuYW1lOiBob3N0bmFtZSxcblx0XHRjb21wb25lbnRzOiBbIHsgbmFtZTogJ2NuJywgdmFsdWU6IGhvc3RuYW1lIH0gXVxuXHR9KSk7XG59O1xuXG5JZGVudGl0eS5mb3JVc2VyID0gZnVuY3Rpb24gKHVpZCkge1xuXHRhc3NlcnQuc3RyaW5nKHVpZCwgJ3VpZCcpO1xuXHRyZXR1cm4gKG5ldyBJZGVudGl0eSh7XG5cdFx0dHlwZTogJ3VzZXInLFxuXHRcdHVpZDogdWlkLFxuXHRcdGNvbXBvbmVudHM6IFsgeyBuYW1lOiAndWlkJywgdmFsdWU6IHVpZCB9IF1cblx0fSkpO1xufTtcblxuSWRlbnRpdHkuZm9yRW1haWwgPSBmdW5jdGlvbiAoZW1haWwpIHtcblx0YXNzZXJ0LnN0cmluZyhlbWFpbCwgJ2VtYWlsJyk7XG5cdHJldHVybiAobmV3IElkZW50aXR5KHtcblx0XHR0eXBlOiAnZW1haWwnLFxuXHRcdGVtYWlsOiBlbWFpbCxcblx0XHRjb21wb25lbnRzOiBbIHsgbmFtZTogJ21haWwnLCB2YWx1ZTogZW1haWwgfSBdXG5cdH0pKTtcbn07XG5cbklkZW50aXR5LnBhcnNlRE4gPSBmdW5jdGlvbiAoZG4pIHtcblx0YXNzZXJ0LnN0cmluZyhkbiwgJ2RuJyk7XG5cdHZhciBwYXJ0cyA9IFsnJ107XG5cdHZhciBpZHggPSAwO1xuXHR2YXIgcmVtID0gZG47XG5cdHdoaWxlIChyZW0ubGVuZ3RoID4gMCkge1xuXHRcdHZhciBtO1xuXHRcdC8qSlNTVFlMRUQqL1xuXHRcdGlmICgobSA9IC9eLC8uZXhlYyhyZW0pKSAhPT0gbnVsbCkge1xuXHRcdFx0cGFydHNbKytpZHhdID0gJyc7XG5cdFx0XHRyZW0gPSByZW0uc2xpY2UobVswXS5sZW5ndGgpO1xuXHRcdC8qSlNTVFlMRUQqL1xuXHRcdH0gZWxzZSBpZiAoKG0gPSAvXlxcXFwsLy5leGVjKHJlbSkpICE9PSBudWxsKSB7XG5cdFx0XHRwYXJ0c1tpZHhdICs9ICcsJztcblx0XHRcdHJlbSA9IHJlbS5zbGljZShtWzBdLmxlbmd0aCk7XG5cdFx0LypKU1NUWUxFRCovXG5cdFx0fSBlbHNlIGlmICgobSA9IC9eXFxcXC4vLmV4ZWMocmVtKSkgIT09IG51bGwpIHtcblx0XHRcdHBhcnRzW2lkeF0gKz0gbVswXTtcblx0XHRcdHJlbSA9IHJlbS5zbGljZShtWzBdLmxlbmd0aCk7XG5cdFx0LypKU1NUWUxFRCovXG5cdFx0fSBlbHNlIGlmICgobSA9IC9eW15cXFxcLF0rLy5leGVjKHJlbSkpICE9PSBudWxsKSB7XG5cdFx0XHRwYXJ0c1tpZHhdICs9IG1bMF07XG5cdFx0XHRyZW0gPSByZW0uc2xpY2UobVswXS5sZW5ndGgpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aHJvdyAobmV3IEVycm9yKCdGYWlsZWQgdG8gcGFyc2UgRE4nKSk7XG5cdFx0fVxuXHR9XG5cdHZhciBjbXBzID0gcGFydHMubWFwKGZ1bmN0aW9uIChjKSB7XG5cdFx0YyA9IGMudHJpbSgpO1xuXHRcdHZhciBlcVBvcyA9IGMuaW5kZXhPZignPScpO1xuXHRcdHdoaWxlIChlcVBvcyA+IDAgJiYgYy5jaGFyQXQoZXFQb3MgLSAxKSA9PT0gJ1xcXFwnKVxuXHRcdFx0ZXFQb3MgPSBjLmluZGV4T2YoJz0nLCBlcVBvcyArIDEpO1xuXHRcdGlmIChlcVBvcyA9PT0gLTEpIHtcblx0XHRcdHRocm93IChuZXcgRXJyb3IoJ0ZhaWxlZCB0byBwYXJzZSBETicpKTtcblx0XHR9XG5cdFx0LypKU1NUWUxFRCovXG5cdFx0dmFyIG5hbWUgPSBjLnNsaWNlKDAsIGVxUG9zKS50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoL1xcXFw9L2csICc9Jyk7XG5cdFx0dmFyIHZhbHVlID0gYy5zbGljZShlcVBvcyArIDEpO1xuXHRcdHJldHVybiAoeyBuYW1lOiBuYW1lLCB2YWx1ZTogdmFsdWUgfSk7XG5cdH0pO1xuXHRyZXR1cm4gKG5ldyBJZGVudGl0eSh7IGNvbXBvbmVudHM6IGNtcHMgfSkpO1xufTtcblxuSWRlbnRpdHkuZnJvbUFycmF5ID0gZnVuY3Rpb24gKGNvbXBvbmVudHMpIHtcblx0YXNzZXJ0LmFycmF5T2ZPYmplY3QoY29tcG9uZW50cywgJ2NvbXBvbmVudHMnKTtcblx0Y29tcG9uZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChjbXApIHtcblx0XHRhc3NlcnQub2JqZWN0KGNtcCwgJ2NvbXBvbmVudCcpO1xuXHRcdGFzc2VydC5zdHJpbmcoY21wLm5hbWUsICdjb21wb25lbnQubmFtZScpO1xuXHRcdGlmICghQnVmZmVyLmlzQnVmZmVyKGNtcC52YWx1ZSkgJiZcblx0XHQgICAgISh0eXBlb2YgKGNtcC52YWx1ZSkgPT09ICdzdHJpbmcnKSkge1xuXHRcdFx0dGhyb3cgKG5ldyBFcnJvcignSW52YWxpZCBjb21wb25lbnQgdmFsdWUnKSk7XG5cdFx0fVxuXHR9KTtcblx0cmV0dXJuIChuZXcgSWRlbnRpdHkoeyBjb21wb25lbnRzOiBjb21wb25lbnRzIH0pKTtcbn07XG5cbklkZW50aXR5LnBhcnNlQXNuMSA9IGZ1bmN0aW9uIChkZXIsIHRvcCkge1xuXHR2YXIgY29tcG9uZW50cyA9IFtdO1xuXHRkZXIucmVhZFNlcXVlbmNlKHRvcCk7XG5cdHZhciBlbmQgPSBkZXIub2Zmc2V0ICsgZGVyLmxlbmd0aDtcblx0d2hpbGUgKGRlci5vZmZzZXQgPCBlbmQpIHtcblx0XHRkZXIucmVhZFNlcXVlbmNlKGFzbjEuQmVyLkNvbnN0cnVjdG9yIHwgYXNuMS5CZXIuU2V0KTtcblx0XHR2YXIgYWZ0ZXIgPSBkZXIub2Zmc2V0ICsgZGVyLmxlbmd0aDtcblx0XHRkZXIucmVhZFNlcXVlbmNlKCk7XG5cdFx0dmFyIG9pZCA9IGRlci5yZWFkT0lEKCk7XG5cdFx0dmFyIHR5cGUgPSBkZXIucGVlaygpO1xuXHRcdHZhciB2YWx1ZTtcblx0XHRzd2l0Y2ggKHR5cGUpIHtcblx0XHRjYXNlIGFzbjEuQmVyLlByaW50YWJsZVN0cmluZzpcblx0XHRjYXNlIGFzbjEuQmVyLklBNVN0cmluZzpcblx0XHRjYXNlIGFzbjEuQmVyLk9jdGV0U3RyaW5nOlxuXHRcdGNhc2UgYXNuMS5CZXIuVDYxU3RyaW5nOlxuXHRcdFx0dmFsdWUgPSBkZXIucmVhZFN0cmluZyh0eXBlKTtcblx0XHRcdGJyZWFrO1xuXHRcdGNhc2UgYXNuMS5CZXIuVXRmOFN0cmluZzpcblx0XHRcdHZhbHVlID0gZGVyLnJlYWRTdHJpbmcodHlwZSwgdHJ1ZSk7XG5cdFx0XHR2YWx1ZSA9IHZhbHVlLnRvU3RyaW5nKCd1dGY4Jyk7XG5cdFx0XHRicmVhaztcblx0XHRjYXNlIGFzbjEuQmVyLkNoYXJhY3RlclN0cmluZzpcblx0XHRjYXNlIGFzbjEuQmVyLkJNUFN0cmluZzpcblx0XHRcdHZhbHVlID0gZGVyLnJlYWRTdHJpbmcodHlwZSwgdHJ1ZSk7XG5cdFx0XHR2YWx1ZSA9IHZhbHVlLnRvU3RyaW5nKCd1dGYxNmxlJyk7XG5cdFx0XHRicmVhaztcblx0XHRkZWZhdWx0OlxuXHRcdFx0dGhyb3cgKG5ldyBFcnJvcignVW5rbm93biBhc24xIHR5cGUgJyArIHR5cGUpKTtcblx0XHR9XG5cdFx0Y29tcG9uZW50cy5wdXNoKHsgb2lkOiBvaWQsIGFzbjF0eXBlOiB0eXBlLCB2YWx1ZTogdmFsdWUgfSk7XG5cdFx0ZGVyLl9vZmZzZXQgPSBhZnRlcjtcblx0fVxuXHRkZXIuX29mZnNldCA9IGVuZDtcblx0cmV0dXJuIChuZXcgSWRlbnRpdHkoe1xuXHRcdGNvbXBvbmVudHM6IGNvbXBvbmVudHNcblx0fSkpO1xufTtcblxuSWRlbnRpdHkuaXNJZGVudGl0eSA9IGZ1bmN0aW9uIChvYmosIHZlcikge1xuXHRyZXR1cm4gKHV0aWxzLmlzQ29tcGF0aWJsZShvYmosIElkZW50aXR5LCB2ZXIpKTtcbn07XG5cbi8qXG4gKiBBUEkgdmVyc2lvbnMgZm9yIElkZW50aXR5OlxuICogWzEsMF0gLS0gaW5pdGlhbCB2ZXJcbiAqL1xuSWRlbnRpdHkucHJvdG90eXBlLl9zc2hwa0FwaVZlcnNpb24gPSBbMSwgMF07XG5cbklkZW50aXR5Ll9vbGRWZXJzaW9uRGV0ZWN0ID0gZnVuY3Rpb24gKG9iaikge1xuXHRyZXR1cm4gKFsxLCAwXSk7XG59O1xuIl0sInNvdXJjZVJvb3QiOiIifQ==