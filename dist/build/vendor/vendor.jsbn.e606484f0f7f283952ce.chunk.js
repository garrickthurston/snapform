(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["vendor/vendor.jsbn"],{

/***/ "8z4W":
/*!************************************!*\
  !*** ./node_modules/jsbn/index.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

(function(){

    // Copyright (c) 2005  Tom Wu
    // All Rights Reserved.
    // See "LICENSE" for details.

    // Basic JavaScript BN library - subset useful for RSA encryption.

    // Bits per digit
    var dbits;

    // JavaScript engine analysis
    var canary = 0xdeadbeefcafe;
    var j_lm = ((canary&0xffffff)==0xefcafe);

    // (public) Constructor
    function BigInteger(a,b,c) {
      if(a != null)
        if("number" == typeof a) this.fromNumber(a,b,c);
        else if(b == null && "string" != typeof a) this.fromString(a,256);
        else this.fromString(a,b);
    }

    // return new, unset BigInteger
    function nbi() { return new BigInteger(null); }

    // am: Compute w_j += (x*this_i), propagate carries,
    // c is initial carry, returns final carry.
    // c < 3*dvalue, x < 2*dvalue, this_i < dvalue
    // We need to select the fastest one that works in this environment.

    // am1: use a single mult and divide to get the high bits,
    // max digit bits should be 26 because
    // max internal value = 2*dvalue^2-2*dvalue (< 2^53)
    function am1(i,x,w,j,c,n) {
      while(--n >= 0) {
        var v = x*this[i++]+w[j]+c;
        c = Math.floor(v/0x4000000);
        w[j++] = v&0x3ffffff;
      }
      return c;
    }
    // am2 avoids a big mult-and-extract completely.
    // Max digit bits should be <= 30 because we do bitwise ops
    // on values up to 2*hdvalue^2-hdvalue-1 (< 2^31)
    function am2(i,x,w,j,c,n) {
      var xl = x&0x7fff, xh = x>>15;
      while(--n >= 0) {
        var l = this[i]&0x7fff;
        var h = this[i++]>>15;
        var m = xh*l+h*xl;
        l = xl*l+((m&0x7fff)<<15)+w[j]+(c&0x3fffffff);
        c = (l>>>30)+(m>>>15)+xh*h+(c>>>30);
        w[j++] = l&0x3fffffff;
      }
      return c;
    }
    // Alternately, set max digit bits to 28 since some
    // browsers slow down when dealing with 32-bit numbers.
    function am3(i,x,w,j,c,n) {
      var xl = x&0x3fff, xh = x>>14;
      while(--n >= 0) {
        var l = this[i]&0x3fff;
        var h = this[i++]>>14;
        var m = xh*l+h*xl;
        l = xl*l+((m&0x3fff)<<14)+w[j]+c;
        c = (l>>28)+(m>>14)+xh*h;
        w[j++] = l&0xfffffff;
      }
      return c;
    }
    var inBrowser = typeof navigator !== "undefined";
    if(inBrowser && j_lm && (navigator.appName == "Microsoft Internet Explorer")) {
      BigInteger.prototype.am = am2;
      dbits = 30;
    }
    else if(inBrowser && j_lm && (navigator.appName != "Netscape")) {
      BigInteger.prototype.am = am1;
      dbits = 26;
    }
    else { // Mozilla/Netscape seems to prefer am3
      BigInteger.prototype.am = am3;
      dbits = 28;
    }

    BigInteger.prototype.DB = dbits;
    BigInteger.prototype.DM = ((1<<dbits)-1);
    BigInteger.prototype.DV = (1<<dbits);

    var BI_FP = 52;
    BigInteger.prototype.FV = Math.pow(2,BI_FP);
    BigInteger.prototype.F1 = BI_FP-dbits;
    BigInteger.prototype.F2 = 2*dbits-BI_FP;

    // Digit conversions
    var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz";
    var BI_RC = new Array();
    var rr,vv;
    rr = "0".charCodeAt(0);
    for(vv = 0; vv <= 9; ++vv) BI_RC[rr++] = vv;
    rr = "a".charCodeAt(0);
    for(vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;
    rr = "A".charCodeAt(0);
    for(vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;

    function int2char(n) { return BI_RM.charAt(n); }
    function intAt(s,i) {
      var c = BI_RC[s.charCodeAt(i)];
      return (c==null)?-1:c;
    }

    // (protected) copy this to r
    function bnpCopyTo(r) {
      for(var i = this.t-1; i >= 0; --i) r[i] = this[i];
      r.t = this.t;
      r.s = this.s;
    }

    // (protected) set from integer value x, -DV <= x < DV
    function bnpFromInt(x) {
      this.t = 1;
      this.s = (x<0)?-1:0;
      if(x > 0) this[0] = x;
      else if(x < -1) this[0] = x+this.DV;
      else this.t = 0;
    }

    // return bigint initialized to value
    function nbv(i) { var r = nbi(); r.fromInt(i); return r; }

    // (protected) set from string and radix
    function bnpFromString(s,b) {
      var k;
      if(b == 16) k = 4;
      else if(b == 8) k = 3;
      else if(b == 256) k = 8; // byte array
      else if(b == 2) k = 1;
      else if(b == 32) k = 5;
      else if(b == 4) k = 2;
      else { this.fromRadix(s,b); return; }
      this.t = 0;
      this.s = 0;
      var i = s.length, mi = false, sh = 0;
      while(--i >= 0) {
        var x = (k==8)?s[i]&0xff:intAt(s,i);
        if(x < 0) {
          if(s.charAt(i) == "-") mi = true;
          continue;
        }
        mi = false;
        if(sh == 0)
          this[this.t++] = x;
        else if(sh+k > this.DB) {
          this[this.t-1] |= (x&((1<<(this.DB-sh))-1))<<sh;
          this[this.t++] = (x>>(this.DB-sh));
        }
        else
          this[this.t-1] |= x<<sh;
        sh += k;
        if(sh >= this.DB) sh -= this.DB;
      }
      if(k == 8 && (s[0]&0x80) != 0) {
        this.s = -1;
        if(sh > 0) this[this.t-1] |= ((1<<(this.DB-sh))-1)<<sh;
      }
      this.clamp();
      if(mi) BigInteger.ZERO.subTo(this,this);
    }

    // (protected) clamp off excess high words
    function bnpClamp() {
      var c = this.s&this.DM;
      while(this.t > 0 && this[this.t-1] == c) --this.t;
    }

    // (public) return string representation in given radix
    function bnToString(b) {
      if(this.s < 0) return "-"+this.negate().toString(b);
      var k;
      if(b == 16) k = 4;
      else if(b == 8) k = 3;
      else if(b == 2) k = 1;
      else if(b == 32) k = 5;
      else if(b == 4) k = 2;
      else return this.toRadix(b);
      var km = (1<<k)-1, d, m = false, r = "", i = this.t;
      var p = this.DB-(i*this.DB)%k;
      if(i-- > 0) {
        if(p < this.DB && (d = this[i]>>p) > 0) { m = true; r = int2char(d); }
        while(i >= 0) {
          if(p < k) {
            d = (this[i]&((1<<p)-1))<<(k-p);
            d |= this[--i]>>(p+=this.DB-k);
          }
          else {
            d = (this[i]>>(p-=k))&km;
            if(p <= 0) { p += this.DB; --i; }
          }
          if(d > 0) m = true;
          if(m) r += int2char(d);
        }
      }
      return m?r:"0";
    }

    // (public) -this
    function bnNegate() { var r = nbi(); BigInteger.ZERO.subTo(this,r); return r; }

    // (public) |this|
    function bnAbs() { return (this.s<0)?this.negate():this; }

    // (public) return + if this > a, - if this < a, 0 if equal
    function bnCompareTo(a) {
      var r = this.s-a.s;
      if(r != 0) return r;
      var i = this.t;
      r = i-a.t;
      if(r != 0) return (this.s<0)?-r:r;
      while(--i >= 0) if((r=this[i]-a[i]) != 0) return r;
      return 0;
    }

    // returns bit length of the integer x
    function nbits(x) {
      var r = 1, t;
      if((t=x>>>16) != 0) { x = t; r += 16; }
      if((t=x>>8) != 0) { x = t; r += 8; }
      if((t=x>>4) != 0) { x = t; r += 4; }
      if((t=x>>2) != 0) { x = t; r += 2; }
      if((t=x>>1) != 0) { x = t; r += 1; }
      return r;
    }

    // (public) return the number of bits in "this"
    function bnBitLength() {
      if(this.t <= 0) return 0;
      return this.DB*(this.t-1)+nbits(this[this.t-1]^(this.s&this.DM));
    }

    // (protected) r = this << n*DB
    function bnpDLShiftTo(n,r) {
      var i;
      for(i = this.t-1; i >= 0; --i) r[i+n] = this[i];
      for(i = n-1; i >= 0; --i) r[i] = 0;
      r.t = this.t+n;
      r.s = this.s;
    }

    // (protected) r = this >> n*DB
    function bnpDRShiftTo(n,r) {
      for(var i = n; i < this.t; ++i) r[i-n] = this[i];
      r.t = Math.max(this.t-n,0);
      r.s = this.s;
    }

    // (protected) r = this << n
    function bnpLShiftTo(n,r) {
      var bs = n%this.DB;
      var cbs = this.DB-bs;
      var bm = (1<<cbs)-1;
      var ds = Math.floor(n/this.DB), c = (this.s<<bs)&this.DM, i;
      for(i = this.t-1; i >= 0; --i) {
        r[i+ds+1] = (this[i]>>cbs)|c;
        c = (this[i]&bm)<<bs;
      }
      for(i = ds-1; i >= 0; --i) r[i] = 0;
      r[ds] = c;
      r.t = this.t+ds+1;
      r.s = this.s;
      r.clamp();
    }

    // (protected) r = this >> n
    function bnpRShiftTo(n,r) {
      r.s = this.s;
      var ds = Math.floor(n/this.DB);
      if(ds >= this.t) { r.t = 0; return; }
      var bs = n%this.DB;
      var cbs = this.DB-bs;
      var bm = (1<<bs)-1;
      r[0] = this[ds]>>bs;
      for(var i = ds+1; i < this.t; ++i) {
        r[i-ds-1] |= (this[i]&bm)<<cbs;
        r[i-ds] = this[i]>>bs;
      }
      if(bs > 0) r[this.t-ds-1] |= (this.s&bm)<<cbs;
      r.t = this.t-ds;
      r.clamp();
    }

    // (protected) r = this - a
    function bnpSubTo(a,r) {
      var i = 0, c = 0, m = Math.min(a.t,this.t);
      while(i < m) {
        c += this[i]-a[i];
        r[i++] = c&this.DM;
        c >>= this.DB;
      }
      if(a.t < this.t) {
        c -= a.s;
        while(i < this.t) {
          c += this[i];
          r[i++] = c&this.DM;
          c >>= this.DB;
        }
        c += this.s;
      }
      else {
        c += this.s;
        while(i < a.t) {
          c -= a[i];
          r[i++] = c&this.DM;
          c >>= this.DB;
        }
        c -= a.s;
      }
      r.s = (c<0)?-1:0;
      if(c < -1) r[i++] = this.DV+c;
      else if(c > 0) r[i++] = c;
      r.t = i;
      r.clamp();
    }

    // (protected) r = this * a, r != this,a (HAC 14.12)
    // "this" should be the larger one if appropriate.
    function bnpMultiplyTo(a,r) {
      var x = this.abs(), y = a.abs();
      var i = x.t;
      r.t = i+y.t;
      while(--i >= 0) r[i] = 0;
      for(i = 0; i < y.t; ++i) r[i+x.t] = x.am(0,y[i],r,i,0,x.t);
      r.s = 0;
      r.clamp();
      if(this.s != a.s) BigInteger.ZERO.subTo(r,r);
    }

    // (protected) r = this^2, r != this (HAC 14.16)
    function bnpSquareTo(r) {
      var x = this.abs();
      var i = r.t = 2*x.t;
      while(--i >= 0) r[i] = 0;
      for(i = 0; i < x.t-1; ++i) {
        var c = x.am(i,x[i],r,2*i,0,1);
        if((r[i+x.t]+=x.am(i+1,2*x[i],r,2*i+1,c,x.t-i-1)) >= x.DV) {
          r[i+x.t] -= x.DV;
          r[i+x.t+1] = 1;
        }
      }
      if(r.t > 0) r[r.t-1] += x.am(i,x[i],r,2*i,0,1);
      r.s = 0;
      r.clamp();
    }

    // (protected) divide this by m, quotient and remainder to q, r (HAC 14.20)
    // r != q, this != m.  q or r may be null.
    function bnpDivRemTo(m,q,r) {
      var pm = m.abs();
      if(pm.t <= 0) return;
      var pt = this.abs();
      if(pt.t < pm.t) {
        if(q != null) q.fromInt(0);
        if(r != null) this.copyTo(r);
        return;
      }
      if(r == null) r = nbi();
      var y = nbi(), ts = this.s, ms = m.s;
      var nsh = this.DB-nbits(pm[pm.t-1]);   // normalize modulus
      if(nsh > 0) { pm.lShiftTo(nsh,y); pt.lShiftTo(nsh,r); }
      else { pm.copyTo(y); pt.copyTo(r); }
      var ys = y.t;
      var y0 = y[ys-1];
      if(y0 == 0) return;
      var yt = y0*(1<<this.F1)+((ys>1)?y[ys-2]>>this.F2:0);
      var d1 = this.FV/yt, d2 = (1<<this.F1)/yt, e = 1<<this.F2;
      var i = r.t, j = i-ys, t = (q==null)?nbi():q;
      y.dlShiftTo(j,t);
      if(r.compareTo(t) >= 0) {
        r[r.t++] = 1;
        r.subTo(t,r);
      }
      BigInteger.ONE.dlShiftTo(ys,t);
      t.subTo(y,y);  // "negative" y so we can replace sub with am later
      while(y.t < ys) y[y.t++] = 0;
      while(--j >= 0) {
        // Estimate quotient digit
        var qd = (r[--i]==y0)?this.DM:Math.floor(r[i]*d1+(r[i-1]+e)*d2);
        if((r[i]+=y.am(0,qd,r,j,0,ys)) < qd) {   // Try it out
          y.dlShiftTo(j,t);
          r.subTo(t,r);
          while(r[i] < --qd) r.subTo(t,r);
        }
      }
      if(q != null) {
        r.drShiftTo(ys,q);
        if(ts != ms) BigInteger.ZERO.subTo(q,q);
      }
      r.t = ys;
      r.clamp();
      if(nsh > 0) r.rShiftTo(nsh,r); // Denormalize remainder
      if(ts < 0) BigInteger.ZERO.subTo(r,r);
    }

    // (public) this mod a
    function bnMod(a) {
      var r = nbi();
      this.abs().divRemTo(a,null,r);
      if(this.s < 0 && r.compareTo(BigInteger.ZERO) > 0) a.subTo(r,r);
      return r;
    }

    // Modular reduction using "classic" algorithm
    function Classic(m) { this.m = m; }
    function cConvert(x) {
      if(x.s < 0 || x.compareTo(this.m) >= 0) return x.mod(this.m);
      else return x;
    }
    function cRevert(x) { return x; }
    function cReduce(x) { x.divRemTo(this.m,null,x); }
    function cMulTo(x,y,r) { x.multiplyTo(y,r); this.reduce(r); }
    function cSqrTo(x,r) { x.squareTo(r); this.reduce(r); }

    Classic.prototype.convert = cConvert;
    Classic.prototype.revert = cRevert;
    Classic.prototype.reduce = cReduce;
    Classic.prototype.mulTo = cMulTo;
    Classic.prototype.sqrTo = cSqrTo;

    // (protected) return "-1/this % 2^DB"; useful for Mont. reduction
    // justification:
    //         xy == 1 (mod m)
    //         xy =  1+km
    //   xy(2-xy) = (1+km)(1-km)
    // x[y(2-xy)] = 1-k^2m^2
    // x[y(2-xy)] == 1 (mod m^2)
    // if y is 1/x mod m, then y(2-xy) is 1/x mod m^2
    // should reduce x and y(2-xy) by m^2 at each step to keep size bounded.
    // JS multiply "overflows" differently from C/C++, so care is needed here.
    function bnpInvDigit() {
      if(this.t < 1) return 0;
      var x = this[0];
      if((x&1) == 0) return 0;
      var y = x&3;       // y == 1/x mod 2^2
      y = (y*(2-(x&0xf)*y))&0xf; // y == 1/x mod 2^4
      y = (y*(2-(x&0xff)*y))&0xff;   // y == 1/x mod 2^8
      y = (y*(2-(((x&0xffff)*y)&0xffff)))&0xffff;    // y == 1/x mod 2^16
      // last step - calculate inverse mod DV directly;
      // assumes 16 < DB <= 32 and assumes ability to handle 48-bit ints
      y = (y*(2-x*y%this.DV))%this.DV;       // y == 1/x mod 2^dbits
      // we really want the negative inverse, and -DV < y < DV
      return (y>0)?this.DV-y:-y;
    }

    // Montgomery reduction
    function Montgomery(m) {
      this.m = m;
      this.mp = m.invDigit();
      this.mpl = this.mp&0x7fff;
      this.mph = this.mp>>15;
      this.um = (1<<(m.DB-15))-1;
      this.mt2 = 2*m.t;
    }

    // xR mod m
    function montConvert(x) {
      var r = nbi();
      x.abs().dlShiftTo(this.m.t,r);
      r.divRemTo(this.m,null,r);
      if(x.s < 0 && r.compareTo(BigInteger.ZERO) > 0) this.m.subTo(r,r);
      return r;
    }

    // x/R mod m
    function montRevert(x) {
      var r = nbi();
      x.copyTo(r);
      this.reduce(r);
      return r;
    }

    // x = x/R mod m (HAC 14.32)
    function montReduce(x) {
      while(x.t <= this.mt2) // pad x so am has enough room later
        x[x.t++] = 0;
      for(var i = 0; i < this.m.t; ++i) {
        // faster way of calculating u0 = x[i]*mp mod DV
        var j = x[i]&0x7fff;
        var u0 = (j*this.mpl+(((j*this.mph+(x[i]>>15)*this.mpl)&this.um)<<15))&x.DM;
        // use am to combine the multiply-shift-add into one call
        j = i+this.m.t;
        x[j] += this.m.am(0,u0,x,i,0,this.m.t);
        // propagate carry
        while(x[j] >= x.DV) { x[j] -= x.DV; x[++j]++; }
      }
      x.clamp();
      x.drShiftTo(this.m.t,x);
      if(x.compareTo(this.m) >= 0) x.subTo(this.m,x);
    }

    // r = "x^2/R mod m"; x != r
    function montSqrTo(x,r) { x.squareTo(r); this.reduce(r); }

    // r = "xy/R mod m"; x,y != r
    function montMulTo(x,y,r) { x.multiplyTo(y,r); this.reduce(r); }

    Montgomery.prototype.convert = montConvert;
    Montgomery.prototype.revert = montRevert;
    Montgomery.prototype.reduce = montReduce;
    Montgomery.prototype.mulTo = montMulTo;
    Montgomery.prototype.sqrTo = montSqrTo;

    // (protected) true iff this is even
    function bnpIsEven() { return ((this.t>0)?(this[0]&1):this.s) == 0; }

    // (protected) this^e, e < 2^32, doing sqr and mul with "r" (HAC 14.79)
    function bnpExp(e,z) {
      if(e > 0xffffffff || e < 1) return BigInteger.ONE;
      var r = nbi(), r2 = nbi(), g = z.convert(this), i = nbits(e)-1;
      g.copyTo(r);
      while(--i >= 0) {
        z.sqrTo(r,r2);
        if((e&(1<<i)) > 0) z.mulTo(r2,g,r);
        else { var t = r; r = r2; r2 = t; }
      }
      return z.revert(r);
    }

    // (public) this^e % m, 0 <= e < 2^32
    function bnModPowInt(e,m) {
      var z;
      if(e < 256 || m.isEven()) z = new Classic(m); else z = new Montgomery(m);
      return this.exp(e,z);
    }

    // protected
    BigInteger.prototype.copyTo = bnpCopyTo;
    BigInteger.prototype.fromInt = bnpFromInt;
    BigInteger.prototype.fromString = bnpFromString;
    BigInteger.prototype.clamp = bnpClamp;
    BigInteger.prototype.dlShiftTo = bnpDLShiftTo;
    BigInteger.prototype.drShiftTo = bnpDRShiftTo;
    BigInteger.prototype.lShiftTo = bnpLShiftTo;
    BigInteger.prototype.rShiftTo = bnpRShiftTo;
    BigInteger.prototype.subTo = bnpSubTo;
    BigInteger.prototype.multiplyTo = bnpMultiplyTo;
    BigInteger.prototype.squareTo = bnpSquareTo;
    BigInteger.prototype.divRemTo = bnpDivRemTo;
    BigInteger.prototype.invDigit = bnpInvDigit;
    BigInteger.prototype.isEven = bnpIsEven;
    BigInteger.prototype.exp = bnpExp;

    // public
    BigInteger.prototype.toString = bnToString;
    BigInteger.prototype.negate = bnNegate;
    BigInteger.prototype.abs = bnAbs;
    BigInteger.prototype.compareTo = bnCompareTo;
    BigInteger.prototype.bitLength = bnBitLength;
    BigInteger.prototype.mod = bnMod;
    BigInteger.prototype.modPowInt = bnModPowInt;

    // "constants"
    BigInteger.ZERO = nbv(0);
    BigInteger.ONE = nbv(1);

    // Copyright (c) 2005-2009  Tom Wu
    // All Rights Reserved.
    // See "LICENSE" for details.

    // Extended JavaScript BN functions, required for RSA private ops.

    // Version 1.1: new BigInteger("0", 10) returns "proper" zero
    // Version 1.2: square() API, isProbablePrime fix

    // (public)
    function bnClone() { var r = nbi(); this.copyTo(r); return r; }

    // (public) return value as integer
    function bnIntValue() {
      if(this.s < 0) {
        if(this.t == 1) return this[0]-this.DV;
        else if(this.t == 0) return -1;
      }
      else if(this.t == 1) return this[0];
      else if(this.t == 0) return 0;
      // assumes 16 < DB < 32
      return ((this[1]&((1<<(32-this.DB))-1))<<this.DB)|this[0];
    }

    // (public) return value as byte
    function bnByteValue() { return (this.t==0)?this.s:(this[0]<<24)>>24; }

    // (public) return value as short (assumes DB>=16)
    function bnShortValue() { return (this.t==0)?this.s:(this[0]<<16)>>16; }

    // (protected) return x s.t. r^x < DV
    function bnpChunkSize(r) { return Math.floor(Math.LN2*this.DB/Math.log(r)); }

    // (public) 0 if this == 0, 1 if this > 0
    function bnSigNum() {
      if(this.s < 0) return -1;
      else if(this.t <= 0 || (this.t == 1 && this[0] <= 0)) return 0;
      else return 1;
    }

    // (protected) convert to radix string
    function bnpToRadix(b) {
      if(b == null) b = 10;
      if(this.signum() == 0 || b < 2 || b > 36) return "0";
      var cs = this.chunkSize(b);
      var a = Math.pow(b,cs);
      var d = nbv(a), y = nbi(), z = nbi(), r = "";
      this.divRemTo(d,y,z);
      while(y.signum() > 0) {
        r = (a+z.intValue()).toString(b).substr(1) + r;
        y.divRemTo(d,y,z);
      }
      return z.intValue().toString(b) + r;
    }

    // (protected) convert from radix string
    function bnpFromRadix(s,b) {
      this.fromInt(0);
      if(b == null) b = 10;
      var cs = this.chunkSize(b);
      var d = Math.pow(b,cs), mi = false, j = 0, w = 0;
      for(var i = 0; i < s.length; ++i) {
        var x = intAt(s,i);
        if(x < 0) {
          if(s.charAt(i) == "-" && this.signum() == 0) mi = true;
          continue;
        }
        w = b*w+x;
        if(++j >= cs) {
          this.dMultiply(d);
          this.dAddOffset(w,0);
          j = 0;
          w = 0;
        }
      }
      if(j > 0) {
        this.dMultiply(Math.pow(b,j));
        this.dAddOffset(w,0);
      }
      if(mi) BigInteger.ZERO.subTo(this,this);
    }

    // (protected) alternate constructor
    function bnpFromNumber(a,b,c) {
      if("number" == typeof b) {
        // new BigInteger(int,int,RNG)
        if(a < 2) this.fromInt(1);
        else {
          this.fromNumber(a,c);
          if(!this.testBit(a-1))	// force MSB set
            this.bitwiseTo(BigInteger.ONE.shiftLeft(a-1),op_or,this);
          if(this.isEven()) this.dAddOffset(1,0); // force odd
          while(!this.isProbablePrime(b)) {
            this.dAddOffset(2,0);
            if(this.bitLength() > a) this.subTo(BigInteger.ONE.shiftLeft(a-1),this);
          }
        }
      }
      else {
        // new BigInteger(int,RNG)
        var x = new Array(), t = a&7;
        x.length = (a>>3)+1;
        b.nextBytes(x);
        if(t > 0) x[0] &= ((1<<t)-1); else x[0] = 0;
        this.fromString(x,256);
      }
    }

    // (public) convert to bigendian byte array
    function bnToByteArray() {
      var i = this.t, r = new Array();
      r[0] = this.s;
      var p = this.DB-(i*this.DB)%8, d, k = 0;
      if(i-- > 0) {
        if(p < this.DB && (d = this[i]>>p) != (this.s&this.DM)>>p)
          r[k++] = d|(this.s<<(this.DB-p));
        while(i >= 0) {
          if(p < 8) {
            d = (this[i]&((1<<p)-1))<<(8-p);
            d |= this[--i]>>(p+=this.DB-8);
          }
          else {
            d = (this[i]>>(p-=8))&0xff;
            if(p <= 0) { p += this.DB; --i; }
          }
          if((d&0x80) != 0) d |= -256;
          if(k == 0 && (this.s&0x80) != (d&0x80)) ++k;
          if(k > 0 || d != this.s) r[k++] = d;
        }
      }
      return r;
    }

    function bnEquals(a) { return(this.compareTo(a)==0); }
    function bnMin(a) { return(this.compareTo(a)<0)?this:a; }
    function bnMax(a) { return(this.compareTo(a)>0)?this:a; }

    // (protected) r = this op a (bitwise)
    function bnpBitwiseTo(a,op,r) {
      var i, f, m = Math.min(a.t,this.t);
      for(i = 0; i < m; ++i) r[i] = op(this[i],a[i]);
      if(a.t < this.t) {
        f = a.s&this.DM;
        for(i = m; i < this.t; ++i) r[i] = op(this[i],f);
        r.t = this.t;
      }
      else {
        f = this.s&this.DM;
        for(i = m; i < a.t; ++i) r[i] = op(f,a[i]);
        r.t = a.t;
      }
      r.s = op(this.s,a.s);
      r.clamp();
    }

    // (public) this & a
    function op_and(x,y) { return x&y; }
    function bnAnd(a) { var r = nbi(); this.bitwiseTo(a,op_and,r); return r; }

    // (public) this | a
    function op_or(x,y) { return x|y; }
    function bnOr(a) { var r = nbi(); this.bitwiseTo(a,op_or,r); return r; }

    // (public) this ^ a
    function op_xor(x,y) { return x^y; }
    function bnXor(a) { var r = nbi(); this.bitwiseTo(a,op_xor,r); return r; }

    // (public) this & ~a
    function op_andnot(x,y) { return x&~y; }
    function bnAndNot(a) { var r = nbi(); this.bitwiseTo(a,op_andnot,r); return r; }

    // (public) ~this
    function bnNot() {
      var r = nbi();
      for(var i = 0; i < this.t; ++i) r[i] = this.DM&~this[i];
      r.t = this.t;
      r.s = ~this.s;
      return r;
    }

    // (public) this << n
    function bnShiftLeft(n) {
      var r = nbi();
      if(n < 0) this.rShiftTo(-n,r); else this.lShiftTo(n,r);
      return r;
    }

    // (public) this >> n
    function bnShiftRight(n) {
      var r = nbi();
      if(n < 0) this.lShiftTo(-n,r); else this.rShiftTo(n,r);
      return r;
    }

    // return index of lowest 1-bit in x, x < 2^31
    function lbit(x) {
      if(x == 0) return -1;
      var r = 0;
      if((x&0xffff) == 0) { x >>= 16; r += 16; }
      if((x&0xff) == 0) { x >>= 8; r += 8; }
      if((x&0xf) == 0) { x >>= 4; r += 4; }
      if((x&3) == 0) { x >>= 2; r += 2; }
      if((x&1) == 0) ++r;
      return r;
    }

    // (public) returns index of lowest 1-bit (or -1 if none)
    function bnGetLowestSetBit() {
      for(var i = 0; i < this.t; ++i)
        if(this[i] != 0) return i*this.DB+lbit(this[i]);
      if(this.s < 0) return this.t*this.DB;
      return -1;
    }

    // return number of 1 bits in x
    function cbit(x) {
      var r = 0;
      while(x != 0) { x &= x-1; ++r; }
      return r;
    }

    // (public) return number of set bits
    function bnBitCount() {
      var r = 0, x = this.s&this.DM;
      for(var i = 0; i < this.t; ++i) r += cbit(this[i]^x);
      return r;
    }

    // (public) true iff nth bit is set
    function bnTestBit(n) {
      var j = Math.floor(n/this.DB);
      if(j >= this.t) return(this.s!=0);
      return((this[j]&(1<<(n%this.DB)))!=0);
    }

    // (protected) this op (1<<n)
    function bnpChangeBit(n,op) {
      var r = BigInteger.ONE.shiftLeft(n);
      this.bitwiseTo(r,op,r);
      return r;
    }

    // (public) this | (1<<n)
    function bnSetBit(n) { return this.changeBit(n,op_or); }

    // (public) this & ~(1<<n)
    function bnClearBit(n) { return this.changeBit(n,op_andnot); }

    // (public) this ^ (1<<n)
    function bnFlipBit(n) { return this.changeBit(n,op_xor); }

    // (protected) r = this + a
    function bnpAddTo(a,r) {
      var i = 0, c = 0, m = Math.min(a.t,this.t);
      while(i < m) {
        c += this[i]+a[i];
        r[i++] = c&this.DM;
        c >>= this.DB;
      }
      if(a.t < this.t) {
        c += a.s;
        while(i < this.t) {
          c += this[i];
          r[i++] = c&this.DM;
          c >>= this.DB;
        }
        c += this.s;
      }
      else {
        c += this.s;
        while(i < a.t) {
          c += a[i];
          r[i++] = c&this.DM;
          c >>= this.DB;
        }
        c += a.s;
      }
      r.s = (c<0)?-1:0;
      if(c > 0) r[i++] = c;
      else if(c < -1) r[i++] = this.DV+c;
      r.t = i;
      r.clamp();
    }

    // (public) this + a
    function bnAdd(a) { var r = nbi(); this.addTo(a,r); return r; }

    // (public) this - a
    function bnSubtract(a) { var r = nbi(); this.subTo(a,r); return r; }

    // (public) this * a
    function bnMultiply(a) { var r = nbi(); this.multiplyTo(a,r); return r; }

    // (public) this^2
    function bnSquare() { var r = nbi(); this.squareTo(r); return r; }

    // (public) this / a
    function bnDivide(a) { var r = nbi(); this.divRemTo(a,r,null); return r; }

    // (public) this % a
    function bnRemainder(a) { var r = nbi(); this.divRemTo(a,null,r); return r; }

    // (public) [this/a,this%a]
    function bnDivideAndRemainder(a) {
      var q = nbi(), r = nbi();
      this.divRemTo(a,q,r);
      return new Array(q,r);
    }

    // (protected) this *= n, this >= 0, 1 < n < DV
    function bnpDMultiply(n) {
      this[this.t] = this.am(0,n-1,this,0,0,this.t);
      ++this.t;
      this.clamp();
    }

    // (protected) this += n << w words, this >= 0
    function bnpDAddOffset(n,w) {
      if(n == 0) return;
      while(this.t <= w) this[this.t++] = 0;
      this[w] += n;
      while(this[w] >= this.DV) {
        this[w] -= this.DV;
        if(++w >= this.t) this[this.t++] = 0;
        ++this[w];
      }
    }

    // A "null" reducer
    function NullExp() {}
    function nNop(x) { return x; }
    function nMulTo(x,y,r) { x.multiplyTo(y,r); }
    function nSqrTo(x,r) { x.squareTo(r); }

    NullExp.prototype.convert = nNop;
    NullExp.prototype.revert = nNop;
    NullExp.prototype.mulTo = nMulTo;
    NullExp.prototype.sqrTo = nSqrTo;

    // (public) this^e
    function bnPow(e) { return this.exp(e,new NullExp()); }

    // (protected) r = lower n words of "this * a", a.t <= n
    // "this" should be the larger one if appropriate.
    function bnpMultiplyLowerTo(a,n,r) {
      var i = Math.min(this.t+a.t,n);
      r.s = 0; // assumes a,this >= 0
      r.t = i;
      while(i > 0) r[--i] = 0;
      var j;
      for(j = r.t-this.t; i < j; ++i) r[i+this.t] = this.am(0,a[i],r,i,0,this.t);
      for(j = Math.min(a.t,n); i < j; ++i) this.am(0,a[i],r,i,0,n-i);
      r.clamp();
    }

    // (protected) r = "this * a" without lower n words, n > 0
    // "this" should be the larger one if appropriate.
    function bnpMultiplyUpperTo(a,n,r) {
      --n;
      var i = r.t = this.t+a.t-n;
      r.s = 0; // assumes a,this >= 0
      while(--i >= 0) r[i] = 0;
      for(i = Math.max(n-this.t,0); i < a.t; ++i)
        r[this.t+i-n] = this.am(n-i,a[i],r,0,0,this.t+i-n);
      r.clamp();
      r.drShiftTo(1,r);
    }

    // Barrett modular reduction
    function Barrett(m) {
      // setup Barrett
      this.r2 = nbi();
      this.q3 = nbi();
      BigInteger.ONE.dlShiftTo(2*m.t,this.r2);
      this.mu = this.r2.divide(m);
      this.m = m;
    }

    function barrettConvert(x) {
      if(x.s < 0 || x.t > 2*this.m.t) return x.mod(this.m);
      else if(x.compareTo(this.m) < 0) return x;
      else { var r = nbi(); x.copyTo(r); this.reduce(r); return r; }
    }

    function barrettRevert(x) { return x; }

    // x = x mod m (HAC 14.42)
    function barrettReduce(x) {
      x.drShiftTo(this.m.t-1,this.r2);
      if(x.t > this.m.t+1) { x.t = this.m.t+1; x.clamp(); }
      this.mu.multiplyUpperTo(this.r2,this.m.t+1,this.q3);
      this.m.multiplyLowerTo(this.q3,this.m.t+1,this.r2);
      while(x.compareTo(this.r2) < 0) x.dAddOffset(1,this.m.t+1);
      x.subTo(this.r2,x);
      while(x.compareTo(this.m) >= 0) x.subTo(this.m,x);
    }

    // r = x^2 mod m; x != r
    function barrettSqrTo(x,r) { x.squareTo(r); this.reduce(r); }

    // r = x*y mod m; x,y != r
    function barrettMulTo(x,y,r) { x.multiplyTo(y,r); this.reduce(r); }

    Barrett.prototype.convert = barrettConvert;
    Barrett.prototype.revert = barrettRevert;
    Barrett.prototype.reduce = barrettReduce;
    Barrett.prototype.mulTo = barrettMulTo;
    Barrett.prototype.sqrTo = barrettSqrTo;

    // (public) this^e % m (HAC 14.85)
    function bnModPow(e,m) {
      var i = e.bitLength(), k, r = nbv(1), z;
      if(i <= 0) return r;
      else if(i < 18) k = 1;
      else if(i < 48) k = 3;
      else if(i < 144) k = 4;
      else if(i < 768) k = 5;
      else k = 6;
      if(i < 8)
        z = new Classic(m);
      else if(m.isEven())
        z = new Barrett(m);
      else
        z = new Montgomery(m);

      // precomputation
      var g = new Array(), n = 3, k1 = k-1, km = (1<<k)-1;
      g[1] = z.convert(this);
      if(k > 1) {
        var g2 = nbi();
        z.sqrTo(g[1],g2);
        while(n <= km) {
          g[n] = nbi();
          z.mulTo(g2,g[n-2],g[n]);
          n += 2;
        }
      }

      var j = e.t-1, w, is1 = true, r2 = nbi(), t;
      i = nbits(e[j])-1;
      while(j >= 0) {
        if(i >= k1) w = (e[j]>>(i-k1))&km;
        else {
          w = (e[j]&((1<<(i+1))-1))<<(k1-i);
          if(j > 0) w |= e[j-1]>>(this.DB+i-k1);
        }

        n = k;
        while((w&1) == 0) { w >>= 1; --n; }
        if((i -= n) < 0) { i += this.DB; --j; }
        if(is1) {	// ret == 1, don't bother squaring or multiplying it
          g[w].copyTo(r);
          is1 = false;
        }
        else {
          while(n > 1) { z.sqrTo(r,r2); z.sqrTo(r2,r); n -= 2; }
          if(n > 0) z.sqrTo(r,r2); else { t = r; r = r2; r2 = t; }
          z.mulTo(r2,g[w],r);
        }

        while(j >= 0 && (e[j]&(1<<i)) == 0) {
          z.sqrTo(r,r2); t = r; r = r2; r2 = t;
          if(--i < 0) { i = this.DB-1; --j; }
        }
      }
      return z.revert(r);
    }

    // (public) gcd(this,a) (HAC 14.54)
    function bnGCD(a) {
      var x = (this.s<0)?this.negate():this.clone();
      var y = (a.s<0)?a.negate():a.clone();
      if(x.compareTo(y) < 0) { var t = x; x = y; y = t; }
      var i = x.getLowestSetBit(), g = y.getLowestSetBit();
      if(g < 0) return x;
      if(i < g) g = i;
      if(g > 0) {
        x.rShiftTo(g,x);
        y.rShiftTo(g,y);
      }
      while(x.signum() > 0) {
        if((i = x.getLowestSetBit()) > 0) x.rShiftTo(i,x);
        if((i = y.getLowestSetBit()) > 0) y.rShiftTo(i,y);
        if(x.compareTo(y) >= 0) {
          x.subTo(y,x);
          x.rShiftTo(1,x);
        }
        else {
          y.subTo(x,y);
          y.rShiftTo(1,y);
        }
      }
      if(g > 0) y.lShiftTo(g,y);
      return y;
    }

    // (protected) this % n, n < 2^26
    function bnpModInt(n) {
      if(n <= 0) return 0;
      var d = this.DV%n, r = (this.s<0)?n-1:0;
      if(this.t > 0)
        if(d == 0) r = this[0]%n;
        else for(var i = this.t-1; i >= 0; --i) r = (d*r+this[i])%n;
      return r;
    }

    // (public) 1/this % m (HAC 14.61)
    function bnModInverse(m) {
      var ac = m.isEven();
      if((this.isEven() && ac) || m.signum() == 0) return BigInteger.ZERO;
      var u = m.clone(), v = this.clone();
      var a = nbv(1), b = nbv(0), c = nbv(0), d = nbv(1);
      while(u.signum() != 0) {
        while(u.isEven()) {
          u.rShiftTo(1,u);
          if(ac) {
            if(!a.isEven() || !b.isEven()) { a.addTo(this,a); b.subTo(m,b); }
            a.rShiftTo(1,a);
          }
          else if(!b.isEven()) b.subTo(m,b);
          b.rShiftTo(1,b);
        }
        while(v.isEven()) {
          v.rShiftTo(1,v);
          if(ac) {
            if(!c.isEven() || !d.isEven()) { c.addTo(this,c); d.subTo(m,d); }
            c.rShiftTo(1,c);
          }
          else if(!d.isEven()) d.subTo(m,d);
          d.rShiftTo(1,d);
        }
        if(u.compareTo(v) >= 0) {
          u.subTo(v,u);
          if(ac) a.subTo(c,a);
          b.subTo(d,b);
        }
        else {
          v.subTo(u,v);
          if(ac) c.subTo(a,c);
          d.subTo(b,d);
        }
      }
      if(v.compareTo(BigInteger.ONE) != 0) return BigInteger.ZERO;
      if(d.compareTo(m) >= 0) return d.subtract(m);
      if(d.signum() < 0) d.addTo(m,d); else return d;
      if(d.signum() < 0) return d.add(m); else return d;
    }

    var lowprimes = [2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97,101,103,107,109,113,127,131,137,139,149,151,157,163,167,173,179,181,191,193,197,199,211,223,227,229,233,239,241,251,257,263,269,271,277,281,283,293,307,311,313,317,331,337,347,349,353,359,367,373,379,383,389,397,401,409,419,421,431,433,439,443,449,457,461,463,467,479,487,491,499,503,509,521,523,541,547,557,563,569,571,577,587,593,599,601,607,613,617,619,631,641,643,647,653,659,661,673,677,683,691,701,709,719,727,733,739,743,751,757,761,769,773,787,797,809,811,821,823,827,829,839,853,857,859,863,877,881,883,887,907,911,919,929,937,941,947,953,967,971,977,983,991,997];
    var lplim = (1<<26)/lowprimes[lowprimes.length-1];

    // (public) test primality with certainty >= 1-.5^t
    function bnIsProbablePrime(t) {
      var i, x = this.abs();
      if(x.t == 1 && x[0] <= lowprimes[lowprimes.length-1]) {
        for(i = 0; i < lowprimes.length; ++i)
          if(x[0] == lowprimes[i]) return true;
        return false;
      }
      if(x.isEven()) return false;
      i = 1;
      while(i < lowprimes.length) {
        var m = lowprimes[i], j = i+1;
        while(j < lowprimes.length && m < lplim) m *= lowprimes[j++];
        m = x.modInt(m);
        while(i < j) if(m%lowprimes[i++] == 0) return false;
      }
      return x.millerRabin(t);
    }

    // (protected) true if probably prime (HAC 4.24, Miller-Rabin)
    function bnpMillerRabin(t) {
      var n1 = this.subtract(BigInteger.ONE);
      var k = n1.getLowestSetBit();
      if(k <= 0) return false;
      var r = n1.shiftRight(k);
      t = (t+1)>>1;
      if(t > lowprimes.length) t = lowprimes.length;
      var a = nbi();
      for(var i = 0; i < t; ++i) {
        //Pick bases at random, instead of starting at 2
        a.fromInt(lowprimes[Math.floor(Math.random()*lowprimes.length)]);
        var y = a.modPow(r,this);
        if(y.compareTo(BigInteger.ONE) != 0 && y.compareTo(n1) != 0) {
          var j = 1;
          while(j++ < k && y.compareTo(n1) != 0) {
            y = y.modPowInt(2,this);
            if(y.compareTo(BigInteger.ONE) == 0) return false;
          }
          if(y.compareTo(n1) != 0) return false;
        }
      }
      return true;
    }

    // protected
    BigInteger.prototype.chunkSize = bnpChunkSize;
    BigInteger.prototype.toRadix = bnpToRadix;
    BigInteger.prototype.fromRadix = bnpFromRadix;
    BigInteger.prototype.fromNumber = bnpFromNumber;
    BigInteger.prototype.bitwiseTo = bnpBitwiseTo;
    BigInteger.prototype.changeBit = bnpChangeBit;
    BigInteger.prototype.addTo = bnpAddTo;
    BigInteger.prototype.dMultiply = bnpDMultiply;
    BigInteger.prototype.dAddOffset = bnpDAddOffset;
    BigInteger.prototype.multiplyLowerTo = bnpMultiplyLowerTo;
    BigInteger.prototype.multiplyUpperTo = bnpMultiplyUpperTo;
    BigInteger.prototype.modInt = bnpModInt;
    BigInteger.prototype.millerRabin = bnpMillerRabin;

    // public
    BigInteger.prototype.clone = bnClone;
    BigInteger.prototype.intValue = bnIntValue;
    BigInteger.prototype.byteValue = bnByteValue;
    BigInteger.prototype.shortValue = bnShortValue;
    BigInteger.prototype.signum = bnSigNum;
    BigInteger.prototype.toByteArray = bnToByteArray;
    BigInteger.prototype.equals = bnEquals;
    BigInteger.prototype.min = bnMin;
    BigInteger.prototype.max = bnMax;
    BigInteger.prototype.and = bnAnd;
    BigInteger.prototype.or = bnOr;
    BigInteger.prototype.xor = bnXor;
    BigInteger.prototype.andNot = bnAndNot;
    BigInteger.prototype.not = bnNot;
    BigInteger.prototype.shiftLeft = bnShiftLeft;
    BigInteger.prototype.shiftRight = bnShiftRight;
    BigInteger.prototype.getLowestSetBit = bnGetLowestSetBit;
    BigInteger.prototype.bitCount = bnBitCount;
    BigInteger.prototype.testBit = bnTestBit;
    BigInteger.prototype.setBit = bnSetBit;
    BigInteger.prototype.clearBit = bnClearBit;
    BigInteger.prototype.flipBit = bnFlipBit;
    BigInteger.prototype.add = bnAdd;
    BigInteger.prototype.subtract = bnSubtract;
    BigInteger.prototype.multiply = bnMultiply;
    BigInteger.prototype.divide = bnDivide;
    BigInteger.prototype.remainder = bnRemainder;
    BigInteger.prototype.divideAndRemainder = bnDivideAndRemainder;
    BigInteger.prototype.modPow = bnModPow;
    BigInteger.prototype.modInverse = bnModInverse;
    BigInteger.prototype.pow = bnPow;
    BigInteger.prototype.gcd = bnGCD;
    BigInteger.prototype.isProbablePrime = bnIsProbablePrime;

    // JSBN-specific extension
    BigInteger.prototype.square = bnSquare;

    // Expose the Barrett function
    BigInteger.prototype.Barrett = Barrett

    // BigInteger interfaces not implemented in jsbn:

    // BigInteger(int signum, byte[] magnitude)
    // double doubleValue()
    // float floatValue()
    // int hashCode()
    // long longValue()
    // static BigInteger valueOf(long val)

	// Random number generator - requires a PRNG backend, e.g. prng4.js

	// For best results, put code like
	// <body onClick='rng_seed_time();' onKeyPress='rng_seed_time();'>
	// in your main HTML document.

	var rng_state;
	var rng_pool;
	var rng_pptr;

	// Mix in a 32-bit integer into the pool
	function rng_seed_int(x) {
	  rng_pool[rng_pptr++] ^= x & 255;
	  rng_pool[rng_pptr++] ^= (x >> 8) & 255;
	  rng_pool[rng_pptr++] ^= (x >> 16) & 255;
	  rng_pool[rng_pptr++] ^= (x >> 24) & 255;
	  if(rng_pptr >= rng_psize) rng_pptr -= rng_psize;
	}

	// Mix in the current time (w/milliseconds) into the pool
	function rng_seed_time() {
	  rng_seed_int(new Date().getTime());
	}

	// Initialize the pool with junk if needed.
	if(rng_pool == null) {
	  rng_pool = new Array();
	  rng_pptr = 0;
	  var t;
	  if(typeof window !== "undefined" && window.crypto) {
		if (window.crypto.getRandomValues) {
		  // Use webcrypto if available
		  var ua = new Uint8Array(32);
		  window.crypto.getRandomValues(ua);
		  for(t = 0; t < 32; ++t)
			rng_pool[rng_pptr++] = ua[t];
		}
		else if(navigator.appName == "Netscape" && navigator.appVersion < "5") {
		  // Extract entropy (256 bits) from NS4 RNG if available
		  var z = window.crypto.random(32);
		  for(t = 0; t < z.length; ++t)
			rng_pool[rng_pptr++] = z.charCodeAt(t) & 255;
		}
	  }
	  while(rng_pptr < rng_psize) {  // extract some randomness from Math.random()
		t = Math.floor(65536 * Math.random());
		rng_pool[rng_pptr++] = t >>> 8;
		rng_pool[rng_pptr++] = t & 255;
	  }
	  rng_pptr = 0;
	  rng_seed_time();
	  //rng_seed_int(window.screenX);
	  //rng_seed_int(window.screenY);
	}

	function rng_get_byte() {
	  if(rng_state == null) {
		rng_seed_time();
		rng_state = prng_newstate();
		rng_state.init(rng_pool);
		for(rng_pptr = 0; rng_pptr < rng_pool.length; ++rng_pptr)
		  rng_pool[rng_pptr] = 0;
		rng_pptr = 0;
		//rng_pool = null;
	  }
	  // TODO: allow reseeding after first request
	  return rng_state.next();
	}

	function rng_get_bytes(ba) {
	  var i;
	  for(i = 0; i < ba.length; ++i) ba[i] = rng_get_byte();
	}

	function SecureRandom() {}

	SecureRandom.prototype.nextBytes = rng_get_bytes;

	// prng4.js - uses Arcfour as a PRNG

	function Arcfour() {
	  this.i = 0;
	  this.j = 0;
	  this.S = new Array();
	}

	// Initialize arcfour context from key, an array of ints, each from [0..255]
	function ARC4init(key) {
	  var i, j, t;
	  for(i = 0; i < 256; ++i)
		this.S[i] = i;
	  j = 0;
	  for(i = 0; i < 256; ++i) {
		j = (j + this.S[i] + key[i % key.length]) & 255;
		t = this.S[i];
		this.S[i] = this.S[j];
		this.S[j] = t;
	  }
	  this.i = 0;
	  this.j = 0;
	}

	function ARC4next() {
	  var t;
	  this.i = (this.i + 1) & 255;
	  this.j = (this.j + this.S[this.i]) & 255;
	  t = this.S[this.i];
	  this.S[this.i] = this.S[this.j];
	  this.S[this.j] = t;
	  return this.S[(t + this.S[this.i]) & 255];
	}

	Arcfour.prototype.init = ARC4init;
	Arcfour.prototype.next = ARC4next;

	// Plug in your RNG constructor here
	function prng_newstate() {
	  return new Arcfour();
	}

	// Pool size must be a multiple of 4 and greater than 32.
	// An array of bytes the size of the pool will be passed to init()
	var rng_psize = 256;

  BigInteger.SecureRandom = SecureRandom;
  BigInteger.BigInteger = BigInteger;
  if (true) {
    exports = module.exports = BigInteger;
  } else {}

}).call(this);


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvanNibi9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxvQkFBb0IsNkJBQTZCOztBQUVqRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLFNBQVM7QUFDeEI7QUFDQSxnQkFBZ0IsU0FBUztBQUN6QjtBQUNBLGdCQUFnQixTQUFTOztBQUV6QiwwQkFBMEIsd0JBQXdCO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSwyQkFBMkIsUUFBUTtBQUNuQztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHFCQUFxQixlQUFlLGNBQWMsVUFBVTs7QUFFNUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhCQUE4QjtBQUM5QjtBQUNBO0FBQ0E7QUFDQSxZQUFZLHFCQUFxQixRQUFRO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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O0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsU0FBUztBQUN0QjtBQUNBO0FBQ0EsYUFBYSxTQUFTO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxNQUFNLElBQThCO0FBQ3BDO0FBQ0EsR0FBRyxNQUFNLEVBR047O0FBRUgsQ0FBQyIsImZpbGUiOiJidWlsZC92ZW5kb3IvdmVuZG9yLmpzYm4uZTYwNjQ4NGYwZjdmMjgzOTUyY2UuY2h1bmsuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtcclxuXHJcbiAgICAvLyBDb3B5cmlnaHQgKGMpIDIwMDUgIFRvbSBXdVxyXG4gICAgLy8gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cclxuICAgIC8vIFNlZSBcIkxJQ0VOU0VcIiBmb3IgZGV0YWlscy5cclxuXHJcbiAgICAvLyBCYXNpYyBKYXZhU2NyaXB0IEJOIGxpYnJhcnkgLSBzdWJzZXQgdXNlZnVsIGZvciBSU0EgZW5jcnlwdGlvbi5cclxuXHJcbiAgICAvLyBCaXRzIHBlciBkaWdpdFxyXG4gICAgdmFyIGRiaXRzO1xyXG5cclxuICAgIC8vIEphdmFTY3JpcHQgZW5naW5lIGFuYWx5c2lzXHJcbiAgICB2YXIgY2FuYXJ5ID0gMHhkZWFkYmVlZmNhZmU7XHJcbiAgICB2YXIgal9sbSA9ICgoY2FuYXJ5JjB4ZmZmZmZmKT09MHhlZmNhZmUpO1xyXG5cclxuICAgIC8vIChwdWJsaWMpIENvbnN0cnVjdG9yXHJcbiAgICBmdW5jdGlvbiBCaWdJbnRlZ2VyKGEsYixjKSB7XHJcbiAgICAgIGlmKGEgIT0gbnVsbClcclxuICAgICAgICBpZihcIm51bWJlclwiID09IHR5cGVvZiBhKSB0aGlzLmZyb21OdW1iZXIoYSxiLGMpO1xyXG4gICAgICAgIGVsc2UgaWYoYiA9PSBudWxsICYmIFwic3RyaW5nXCIgIT0gdHlwZW9mIGEpIHRoaXMuZnJvbVN0cmluZyhhLDI1Nik7XHJcbiAgICAgICAgZWxzZSB0aGlzLmZyb21TdHJpbmcoYSxiKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyByZXR1cm4gbmV3LCB1bnNldCBCaWdJbnRlZ2VyXHJcbiAgICBmdW5jdGlvbiBuYmkoKSB7IHJldHVybiBuZXcgQmlnSW50ZWdlcihudWxsKTsgfVxyXG5cclxuICAgIC8vIGFtOiBDb21wdXRlIHdfaiArPSAoeCp0aGlzX2kpLCBwcm9wYWdhdGUgY2FycmllcyxcclxuICAgIC8vIGMgaXMgaW5pdGlhbCBjYXJyeSwgcmV0dXJucyBmaW5hbCBjYXJyeS5cclxuICAgIC8vIGMgPCAzKmR2YWx1ZSwgeCA8IDIqZHZhbHVlLCB0aGlzX2kgPCBkdmFsdWVcclxuICAgIC8vIFdlIG5lZWQgdG8gc2VsZWN0IHRoZSBmYXN0ZXN0IG9uZSB0aGF0IHdvcmtzIGluIHRoaXMgZW52aXJvbm1lbnQuXHJcblxyXG4gICAgLy8gYW0xOiB1c2UgYSBzaW5nbGUgbXVsdCBhbmQgZGl2aWRlIHRvIGdldCB0aGUgaGlnaCBiaXRzLFxyXG4gICAgLy8gbWF4IGRpZ2l0IGJpdHMgc2hvdWxkIGJlIDI2IGJlY2F1c2VcclxuICAgIC8vIG1heCBpbnRlcm5hbCB2YWx1ZSA9IDIqZHZhbHVlXjItMipkdmFsdWUgKDwgMl41MylcclxuICAgIGZ1bmN0aW9uIGFtMShpLHgsdyxqLGMsbikge1xyXG4gICAgICB3aGlsZSgtLW4gPj0gMCkge1xyXG4gICAgICAgIHZhciB2ID0geCp0aGlzW2krK10rd1tqXStjO1xyXG4gICAgICAgIGMgPSBNYXRoLmZsb29yKHYvMHg0MDAwMDAwKTtcclxuICAgICAgICB3W2orK10gPSB2JjB4M2ZmZmZmZjtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gYztcclxuICAgIH1cclxuICAgIC8vIGFtMiBhdm9pZHMgYSBiaWcgbXVsdC1hbmQtZXh0cmFjdCBjb21wbGV0ZWx5LlxyXG4gICAgLy8gTWF4IGRpZ2l0IGJpdHMgc2hvdWxkIGJlIDw9IDMwIGJlY2F1c2Ugd2UgZG8gYml0d2lzZSBvcHNcclxuICAgIC8vIG9uIHZhbHVlcyB1cCB0byAyKmhkdmFsdWVeMi1oZHZhbHVlLTEgKDwgMl4zMSlcclxuICAgIGZ1bmN0aW9uIGFtMihpLHgsdyxqLGMsbikge1xyXG4gICAgICB2YXIgeGwgPSB4JjB4N2ZmZiwgeGggPSB4Pj4xNTtcclxuICAgICAgd2hpbGUoLS1uID49IDApIHtcclxuICAgICAgICB2YXIgbCA9IHRoaXNbaV0mMHg3ZmZmO1xyXG4gICAgICAgIHZhciBoID0gdGhpc1tpKytdPj4xNTtcclxuICAgICAgICB2YXIgbSA9IHhoKmwraCp4bDtcclxuICAgICAgICBsID0geGwqbCsoKG0mMHg3ZmZmKTw8MTUpK3dbal0rKGMmMHgzZmZmZmZmZik7XHJcbiAgICAgICAgYyA9IChsPj4+MzApKyhtPj4+MTUpK3hoKmgrKGM+Pj4zMCk7XHJcbiAgICAgICAgd1tqKytdID0gbCYweDNmZmZmZmZmO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBjO1xyXG4gICAgfVxyXG4gICAgLy8gQWx0ZXJuYXRlbHksIHNldCBtYXggZGlnaXQgYml0cyB0byAyOCBzaW5jZSBzb21lXHJcbiAgICAvLyBicm93c2VycyBzbG93IGRvd24gd2hlbiBkZWFsaW5nIHdpdGggMzItYml0IG51bWJlcnMuXHJcbiAgICBmdW5jdGlvbiBhbTMoaSx4LHcsaixjLG4pIHtcclxuICAgICAgdmFyIHhsID0geCYweDNmZmYsIHhoID0geD4+MTQ7XHJcbiAgICAgIHdoaWxlKC0tbiA+PSAwKSB7XHJcbiAgICAgICAgdmFyIGwgPSB0aGlzW2ldJjB4M2ZmZjtcclxuICAgICAgICB2YXIgaCA9IHRoaXNbaSsrXT4+MTQ7XHJcbiAgICAgICAgdmFyIG0gPSB4aCpsK2gqeGw7XHJcbiAgICAgICAgbCA9IHhsKmwrKChtJjB4M2ZmZik8PDE0KSt3W2pdK2M7XHJcbiAgICAgICAgYyA9IChsPj4yOCkrKG0+PjE0KSt4aCpoO1xyXG4gICAgICAgIHdbaisrXSA9IGwmMHhmZmZmZmZmO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBjO1xyXG4gICAgfVxyXG4gICAgdmFyIGluQnJvd3NlciA9IHR5cGVvZiBuYXZpZ2F0b3IgIT09IFwidW5kZWZpbmVkXCI7XHJcbiAgICBpZihpbkJyb3dzZXIgJiYgal9sbSAmJiAobmF2aWdhdG9yLmFwcE5hbWUgPT0gXCJNaWNyb3NvZnQgSW50ZXJuZXQgRXhwbG9yZXJcIikpIHtcclxuICAgICAgQmlnSW50ZWdlci5wcm90b3R5cGUuYW0gPSBhbTI7XHJcbiAgICAgIGRiaXRzID0gMzA7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmKGluQnJvd3NlciAmJiBqX2xtICYmIChuYXZpZ2F0b3IuYXBwTmFtZSAhPSBcIk5ldHNjYXBlXCIpKSB7XHJcbiAgICAgIEJpZ0ludGVnZXIucHJvdG90eXBlLmFtID0gYW0xO1xyXG4gICAgICBkYml0cyA9IDI2O1xyXG4gICAgfVxyXG4gICAgZWxzZSB7IC8vIE1vemlsbGEvTmV0c2NhcGUgc2VlbXMgdG8gcHJlZmVyIGFtM1xyXG4gICAgICBCaWdJbnRlZ2VyLnByb3RvdHlwZS5hbSA9IGFtMztcclxuICAgICAgZGJpdHMgPSAyODtcclxuICAgIH1cclxuXHJcbiAgICBCaWdJbnRlZ2VyLnByb3RvdHlwZS5EQiA9IGRiaXRzO1xyXG4gICAgQmlnSW50ZWdlci5wcm90b3R5cGUuRE0gPSAoKDE8PGRiaXRzKS0xKTtcclxuICAgIEJpZ0ludGVnZXIucHJvdG90eXBlLkRWID0gKDE8PGRiaXRzKTtcclxuXHJcbiAgICB2YXIgQklfRlAgPSA1MjtcclxuICAgIEJpZ0ludGVnZXIucHJvdG90eXBlLkZWID0gTWF0aC5wb3coMixCSV9GUCk7XHJcbiAgICBCaWdJbnRlZ2VyLnByb3RvdHlwZS5GMSA9IEJJX0ZQLWRiaXRzO1xyXG4gICAgQmlnSW50ZWdlci5wcm90b3R5cGUuRjIgPSAyKmRiaXRzLUJJX0ZQO1xyXG5cclxuICAgIC8vIERpZ2l0IGNvbnZlcnNpb25zXHJcbiAgICB2YXIgQklfUk0gPSBcIjAxMjM0NTY3ODlhYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5elwiO1xyXG4gICAgdmFyIEJJX1JDID0gbmV3IEFycmF5KCk7XHJcbiAgICB2YXIgcnIsdnY7XHJcbiAgICByciA9IFwiMFwiLmNoYXJDb2RlQXQoMCk7XHJcbiAgICBmb3IodnYgPSAwOyB2diA8PSA5OyArK3Z2KSBCSV9SQ1tycisrXSA9IHZ2O1xyXG4gICAgcnIgPSBcImFcIi5jaGFyQ29kZUF0KDApO1xyXG4gICAgZm9yKHZ2ID0gMTA7IHZ2IDwgMzY7ICsrdnYpIEJJX1JDW3JyKytdID0gdnY7XHJcbiAgICByciA9IFwiQVwiLmNoYXJDb2RlQXQoMCk7XHJcbiAgICBmb3IodnYgPSAxMDsgdnYgPCAzNjsgKyt2dikgQklfUkNbcnIrK10gPSB2djtcclxuXHJcbiAgICBmdW5jdGlvbiBpbnQyY2hhcihuKSB7IHJldHVybiBCSV9STS5jaGFyQXQobik7IH1cclxuICAgIGZ1bmN0aW9uIGludEF0KHMsaSkge1xyXG4gICAgICB2YXIgYyA9IEJJX1JDW3MuY2hhckNvZGVBdChpKV07XHJcbiAgICAgIHJldHVybiAoYz09bnVsbCk/LTE6YztcclxuICAgIH1cclxuXHJcbiAgICAvLyAocHJvdGVjdGVkKSBjb3B5IHRoaXMgdG8gclxyXG4gICAgZnVuY3Rpb24gYm5wQ29weVRvKHIpIHtcclxuICAgICAgZm9yKHZhciBpID0gdGhpcy50LTE7IGkgPj0gMDsgLS1pKSByW2ldID0gdGhpc1tpXTtcclxuICAgICAgci50ID0gdGhpcy50O1xyXG4gICAgICByLnMgPSB0aGlzLnM7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gKHByb3RlY3RlZCkgc2V0IGZyb20gaW50ZWdlciB2YWx1ZSB4LCAtRFYgPD0geCA8IERWXHJcbiAgICBmdW5jdGlvbiBibnBGcm9tSW50KHgpIHtcclxuICAgICAgdGhpcy50ID0gMTtcclxuICAgICAgdGhpcy5zID0gKHg8MCk/LTE6MDtcclxuICAgICAgaWYoeCA+IDApIHRoaXNbMF0gPSB4O1xyXG4gICAgICBlbHNlIGlmKHggPCAtMSkgdGhpc1swXSA9IHgrdGhpcy5EVjtcclxuICAgICAgZWxzZSB0aGlzLnQgPSAwO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHJldHVybiBiaWdpbnQgaW5pdGlhbGl6ZWQgdG8gdmFsdWVcclxuICAgIGZ1bmN0aW9uIG5idihpKSB7IHZhciByID0gbmJpKCk7IHIuZnJvbUludChpKTsgcmV0dXJuIHI7IH1cclxuXHJcbiAgICAvLyAocHJvdGVjdGVkKSBzZXQgZnJvbSBzdHJpbmcgYW5kIHJhZGl4XHJcbiAgICBmdW5jdGlvbiBibnBGcm9tU3RyaW5nKHMsYikge1xyXG4gICAgICB2YXIgaztcclxuICAgICAgaWYoYiA9PSAxNikgayA9IDQ7XHJcbiAgICAgIGVsc2UgaWYoYiA9PSA4KSBrID0gMztcclxuICAgICAgZWxzZSBpZihiID09IDI1NikgayA9IDg7IC8vIGJ5dGUgYXJyYXlcclxuICAgICAgZWxzZSBpZihiID09IDIpIGsgPSAxO1xyXG4gICAgICBlbHNlIGlmKGIgPT0gMzIpIGsgPSA1O1xyXG4gICAgICBlbHNlIGlmKGIgPT0gNCkgayA9IDI7XHJcbiAgICAgIGVsc2UgeyB0aGlzLmZyb21SYWRpeChzLGIpOyByZXR1cm47IH1cclxuICAgICAgdGhpcy50ID0gMDtcclxuICAgICAgdGhpcy5zID0gMDtcclxuICAgICAgdmFyIGkgPSBzLmxlbmd0aCwgbWkgPSBmYWxzZSwgc2ggPSAwO1xyXG4gICAgICB3aGlsZSgtLWkgPj0gMCkge1xyXG4gICAgICAgIHZhciB4ID0gKGs9PTgpP3NbaV0mMHhmZjppbnRBdChzLGkpO1xyXG4gICAgICAgIGlmKHggPCAwKSB7XHJcbiAgICAgICAgICBpZihzLmNoYXJBdChpKSA9PSBcIi1cIikgbWkgPSB0cnVlO1xyXG4gICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG1pID0gZmFsc2U7XHJcbiAgICAgICAgaWYoc2ggPT0gMClcclxuICAgICAgICAgIHRoaXNbdGhpcy50KytdID0geDtcclxuICAgICAgICBlbHNlIGlmKHNoK2sgPiB0aGlzLkRCKSB7XHJcbiAgICAgICAgICB0aGlzW3RoaXMudC0xXSB8PSAoeCYoKDE8PCh0aGlzLkRCLXNoKSktMSkpPDxzaDtcclxuICAgICAgICAgIHRoaXNbdGhpcy50KytdID0gKHg+Pih0aGlzLkRCLXNoKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgIHRoaXNbdGhpcy50LTFdIHw9IHg8PHNoO1xyXG4gICAgICAgIHNoICs9IGs7XHJcbiAgICAgICAgaWYoc2ggPj0gdGhpcy5EQikgc2ggLT0gdGhpcy5EQjtcclxuICAgICAgfVxyXG4gICAgICBpZihrID09IDggJiYgKHNbMF0mMHg4MCkgIT0gMCkge1xyXG4gICAgICAgIHRoaXMucyA9IC0xO1xyXG4gICAgICAgIGlmKHNoID4gMCkgdGhpc1t0aGlzLnQtMV0gfD0gKCgxPDwodGhpcy5EQi1zaCkpLTEpPDxzaDtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLmNsYW1wKCk7XHJcbiAgICAgIGlmKG1pKSBCaWdJbnRlZ2VyLlpFUk8uc3ViVG8odGhpcyx0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyAocHJvdGVjdGVkKSBjbGFtcCBvZmYgZXhjZXNzIGhpZ2ggd29yZHNcclxuICAgIGZ1bmN0aW9uIGJucENsYW1wKCkge1xyXG4gICAgICB2YXIgYyA9IHRoaXMucyZ0aGlzLkRNO1xyXG4gICAgICB3aGlsZSh0aGlzLnQgPiAwICYmIHRoaXNbdGhpcy50LTFdID09IGMpIC0tdGhpcy50O1xyXG4gICAgfVxyXG5cclxuICAgIC8vIChwdWJsaWMpIHJldHVybiBzdHJpbmcgcmVwcmVzZW50YXRpb24gaW4gZ2l2ZW4gcmFkaXhcclxuICAgIGZ1bmN0aW9uIGJuVG9TdHJpbmcoYikge1xyXG4gICAgICBpZih0aGlzLnMgPCAwKSByZXR1cm4gXCItXCIrdGhpcy5uZWdhdGUoKS50b1N0cmluZyhiKTtcclxuICAgICAgdmFyIGs7XHJcbiAgICAgIGlmKGIgPT0gMTYpIGsgPSA0O1xyXG4gICAgICBlbHNlIGlmKGIgPT0gOCkgayA9IDM7XHJcbiAgICAgIGVsc2UgaWYoYiA9PSAyKSBrID0gMTtcclxuICAgICAgZWxzZSBpZihiID09IDMyKSBrID0gNTtcclxuICAgICAgZWxzZSBpZihiID09IDQpIGsgPSAyO1xyXG4gICAgICBlbHNlIHJldHVybiB0aGlzLnRvUmFkaXgoYik7XHJcbiAgICAgIHZhciBrbSA9ICgxPDxrKS0xLCBkLCBtID0gZmFsc2UsIHIgPSBcIlwiLCBpID0gdGhpcy50O1xyXG4gICAgICB2YXIgcCA9IHRoaXMuREItKGkqdGhpcy5EQiklaztcclxuICAgICAgaWYoaS0tID4gMCkge1xyXG4gICAgICAgIGlmKHAgPCB0aGlzLkRCICYmIChkID0gdGhpc1tpXT4+cCkgPiAwKSB7IG0gPSB0cnVlOyByID0gaW50MmNoYXIoZCk7IH1cclxuICAgICAgICB3aGlsZShpID49IDApIHtcclxuICAgICAgICAgIGlmKHAgPCBrKSB7XHJcbiAgICAgICAgICAgIGQgPSAodGhpc1tpXSYoKDE8PHApLTEpKTw8KGstcCk7XHJcbiAgICAgICAgICAgIGQgfD0gdGhpc1stLWldPj4ocCs9dGhpcy5EQi1rKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBkID0gKHRoaXNbaV0+PihwLT1rKSkma207XHJcbiAgICAgICAgICAgIGlmKHAgPD0gMCkgeyBwICs9IHRoaXMuREI7IC0taTsgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYoZCA+IDApIG0gPSB0cnVlO1xyXG4gICAgICAgICAgaWYobSkgciArPSBpbnQyY2hhcihkKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIG0/cjpcIjBcIjtcclxuICAgIH1cclxuXHJcbiAgICAvLyAocHVibGljKSAtdGhpc1xyXG4gICAgZnVuY3Rpb24gYm5OZWdhdGUoKSB7IHZhciByID0gbmJpKCk7IEJpZ0ludGVnZXIuWkVSTy5zdWJUbyh0aGlzLHIpOyByZXR1cm4gcjsgfVxyXG5cclxuICAgIC8vIChwdWJsaWMpIHx0aGlzfFxyXG4gICAgZnVuY3Rpb24gYm5BYnMoKSB7IHJldHVybiAodGhpcy5zPDApP3RoaXMubmVnYXRlKCk6dGhpczsgfVxyXG5cclxuICAgIC8vIChwdWJsaWMpIHJldHVybiArIGlmIHRoaXMgPiBhLCAtIGlmIHRoaXMgPCBhLCAwIGlmIGVxdWFsXHJcbiAgICBmdW5jdGlvbiBibkNvbXBhcmVUbyhhKSB7XHJcbiAgICAgIHZhciByID0gdGhpcy5zLWEucztcclxuICAgICAgaWYociAhPSAwKSByZXR1cm4gcjtcclxuICAgICAgdmFyIGkgPSB0aGlzLnQ7XHJcbiAgICAgIHIgPSBpLWEudDtcclxuICAgICAgaWYociAhPSAwKSByZXR1cm4gKHRoaXMuczwwKT8tcjpyO1xyXG4gICAgICB3aGlsZSgtLWkgPj0gMCkgaWYoKHI9dGhpc1tpXS1hW2ldKSAhPSAwKSByZXR1cm4gcjtcclxuICAgICAgcmV0dXJuIDA7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gcmV0dXJucyBiaXQgbGVuZ3RoIG9mIHRoZSBpbnRlZ2VyIHhcclxuICAgIGZ1bmN0aW9uIG5iaXRzKHgpIHtcclxuICAgICAgdmFyIHIgPSAxLCB0O1xyXG4gICAgICBpZigodD14Pj4+MTYpICE9IDApIHsgeCA9IHQ7IHIgKz0gMTY7IH1cclxuICAgICAgaWYoKHQ9eD4+OCkgIT0gMCkgeyB4ID0gdDsgciArPSA4OyB9XHJcbiAgICAgIGlmKCh0PXg+PjQpICE9IDApIHsgeCA9IHQ7IHIgKz0gNDsgfVxyXG4gICAgICBpZigodD14Pj4yKSAhPSAwKSB7IHggPSB0OyByICs9IDI7IH1cclxuICAgICAgaWYoKHQ9eD4+MSkgIT0gMCkgeyB4ID0gdDsgciArPSAxOyB9XHJcbiAgICAgIHJldHVybiByO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIChwdWJsaWMpIHJldHVybiB0aGUgbnVtYmVyIG9mIGJpdHMgaW4gXCJ0aGlzXCJcclxuICAgIGZ1bmN0aW9uIGJuQml0TGVuZ3RoKCkge1xyXG4gICAgICBpZih0aGlzLnQgPD0gMCkgcmV0dXJuIDA7XHJcbiAgICAgIHJldHVybiB0aGlzLkRCKih0aGlzLnQtMSkrbmJpdHModGhpc1t0aGlzLnQtMV1eKHRoaXMucyZ0aGlzLkRNKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gKHByb3RlY3RlZCkgciA9IHRoaXMgPDwgbipEQlxyXG4gICAgZnVuY3Rpb24gYm5wRExTaGlmdFRvKG4scikge1xyXG4gICAgICB2YXIgaTtcclxuICAgICAgZm9yKGkgPSB0aGlzLnQtMTsgaSA+PSAwOyAtLWkpIHJbaStuXSA9IHRoaXNbaV07XHJcbiAgICAgIGZvcihpID0gbi0xOyBpID49IDA7IC0taSkgcltpXSA9IDA7XHJcbiAgICAgIHIudCA9IHRoaXMudCtuO1xyXG4gICAgICByLnMgPSB0aGlzLnM7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gKHByb3RlY3RlZCkgciA9IHRoaXMgPj4gbipEQlxyXG4gICAgZnVuY3Rpb24gYm5wRFJTaGlmdFRvKG4scikge1xyXG4gICAgICBmb3IodmFyIGkgPSBuOyBpIDwgdGhpcy50OyArK2kpIHJbaS1uXSA9IHRoaXNbaV07XHJcbiAgICAgIHIudCA9IE1hdGgubWF4KHRoaXMudC1uLDApO1xyXG4gICAgICByLnMgPSB0aGlzLnM7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gKHByb3RlY3RlZCkgciA9IHRoaXMgPDwgblxyXG4gICAgZnVuY3Rpb24gYm5wTFNoaWZ0VG8obixyKSB7XHJcbiAgICAgIHZhciBicyA9IG4ldGhpcy5EQjtcclxuICAgICAgdmFyIGNicyA9IHRoaXMuREItYnM7XHJcbiAgICAgIHZhciBibSA9ICgxPDxjYnMpLTE7XHJcbiAgICAgIHZhciBkcyA9IE1hdGguZmxvb3Iobi90aGlzLkRCKSwgYyA9ICh0aGlzLnM8PGJzKSZ0aGlzLkRNLCBpO1xyXG4gICAgICBmb3IoaSA9IHRoaXMudC0xOyBpID49IDA7IC0taSkge1xyXG4gICAgICAgIHJbaStkcysxXSA9ICh0aGlzW2ldPj5jYnMpfGM7XHJcbiAgICAgICAgYyA9ICh0aGlzW2ldJmJtKTw8YnM7XHJcbiAgICAgIH1cclxuICAgICAgZm9yKGkgPSBkcy0xOyBpID49IDA7IC0taSkgcltpXSA9IDA7XHJcbiAgICAgIHJbZHNdID0gYztcclxuICAgICAgci50ID0gdGhpcy50K2RzKzE7XHJcbiAgICAgIHIucyA9IHRoaXMucztcclxuICAgICAgci5jbGFtcCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIChwcm90ZWN0ZWQpIHIgPSB0aGlzID4+IG5cclxuICAgIGZ1bmN0aW9uIGJucFJTaGlmdFRvKG4scikge1xyXG4gICAgICByLnMgPSB0aGlzLnM7XHJcbiAgICAgIHZhciBkcyA9IE1hdGguZmxvb3Iobi90aGlzLkRCKTtcclxuICAgICAgaWYoZHMgPj0gdGhpcy50KSB7IHIudCA9IDA7IHJldHVybjsgfVxyXG4gICAgICB2YXIgYnMgPSBuJXRoaXMuREI7XHJcbiAgICAgIHZhciBjYnMgPSB0aGlzLkRCLWJzO1xyXG4gICAgICB2YXIgYm0gPSAoMTw8YnMpLTE7XHJcbiAgICAgIHJbMF0gPSB0aGlzW2RzXT4+YnM7XHJcbiAgICAgIGZvcih2YXIgaSA9IGRzKzE7IGkgPCB0aGlzLnQ7ICsraSkge1xyXG4gICAgICAgIHJbaS1kcy0xXSB8PSAodGhpc1tpXSZibSk8PGNicztcclxuICAgICAgICByW2ktZHNdID0gdGhpc1tpXT4+YnM7XHJcbiAgICAgIH1cclxuICAgICAgaWYoYnMgPiAwKSByW3RoaXMudC1kcy0xXSB8PSAodGhpcy5zJmJtKTw8Y2JzO1xyXG4gICAgICByLnQgPSB0aGlzLnQtZHM7XHJcbiAgICAgIHIuY2xhbXAoKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyAocHJvdGVjdGVkKSByID0gdGhpcyAtIGFcclxuICAgIGZ1bmN0aW9uIGJucFN1YlRvKGEscikge1xyXG4gICAgICB2YXIgaSA9IDAsIGMgPSAwLCBtID0gTWF0aC5taW4oYS50LHRoaXMudCk7XHJcbiAgICAgIHdoaWxlKGkgPCBtKSB7XHJcbiAgICAgICAgYyArPSB0aGlzW2ldLWFbaV07XHJcbiAgICAgICAgcltpKytdID0gYyZ0aGlzLkRNO1xyXG4gICAgICAgIGMgPj49IHRoaXMuREI7XHJcbiAgICAgIH1cclxuICAgICAgaWYoYS50IDwgdGhpcy50KSB7XHJcbiAgICAgICAgYyAtPSBhLnM7XHJcbiAgICAgICAgd2hpbGUoaSA8IHRoaXMudCkge1xyXG4gICAgICAgICAgYyArPSB0aGlzW2ldO1xyXG4gICAgICAgICAgcltpKytdID0gYyZ0aGlzLkRNO1xyXG4gICAgICAgICAgYyA+Pj0gdGhpcy5EQjtcclxuICAgICAgICB9XHJcbiAgICAgICAgYyArPSB0aGlzLnM7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgYyArPSB0aGlzLnM7XHJcbiAgICAgICAgd2hpbGUoaSA8IGEudCkge1xyXG4gICAgICAgICAgYyAtPSBhW2ldO1xyXG4gICAgICAgICAgcltpKytdID0gYyZ0aGlzLkRNO1xyXG4gICAgICAgICAgYyA+Pj0gdGhpcy5EQjtcclxuICAgICAgICB9XHJcbiAgICAgICAgYyAtPSBhLnM7XHJcbiAgICAgIH1cclxuICAgICAgci5zID0gKGM8MCk/LTE6MDtcclxuICAgICAgaWYoYyA8IC0xKSByW2krK10gPSB0aGlzLkRWK2M7XHJcbiAgICAgIGVsc2UgaWYoYyA+IDApIHJbaSsrXSA9IGM7XHJcbiAgICAgIHIudCA9IGk7XHJcbiAgICAgIHIuY2xhbXAoKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyAocHJvdGVjdGVkKSByID0gdGhpcyAqIGEsIHIgIT0gdGhpcyxhIChIQUMgMTQuMTIpXHJcbiAgICAvLyBcInRoaXNcIiBzaG91bGQgYmUgdGhlIGxhcmdlciBvbmUgaWYgYXBwcm9wcmlhdGUuXHJcbiAgICBmdW5jdGlvbiBibnBNdWx0aXBseVRvKGEscikge1xyXG4gICAgICB2YXIgeCA9IHRoaXMuYWJzKCksIHkgPSBhLmFicygpO1xyXG4gICAgICB2YXIgaSA9IHgudDtcclxuICAgICAgci50ID0gaSt5LnQ7XHJcbiAgICAgIHdoaWxlKC0taSA+PSAwKSByW2ldID0gMDtcclxuICAgICAgZm9yKGkgPSAwOyBpIDwgeS50OyArK2kpIHJbaSt4LnRdID0geC5hbSgwLHlbaV0scixpLDAseC50KTtcclxuICAgICAgci5zID0gMDtcclxuICAgICAgci5jbGFtcCgpO1xyXG4gICAgICBpZih0aGlzLnMgIT0gYS5zKSBCaWdJbnRlZ2VyLlpFUk8uc3ViVG8ocixyKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyAocHJvdGVjdGVkKSByID0gdGhpc14yLCByICE9IHRoaXMgKEhBQyAxNC4xNilcclxuICAgIGZ1bmN0aW9uIGJucFNxdWFyZVRvKHIpIHtcclxuICAgICAgdmFyIHggPSB0aGlzLmFicygpO1xyXG4gICAgICB2YXIgaSA9IHIudCA9IDIqeC50O1xyXG4gICAgICB3aGlsZSgtLWkgPj0gMCkgcltpXSA9IDA7XHJcbiAgICAgIGZvcihpID0gMDsgaSA8IHgudC0xOyArK2kpIHtcclxuICAgICAgICB2YXIgYyA9IHguYW0oaSx4W2ldLHIsMippLDAsMSk7XHJcbiAgICAgICAgaWYoKHJbaSt4LnRdKz14LmFtKGkrMSwyKnhbaV0sciwyKmkrMSxjLHgudC1pLTEpKSA+PSB4LkRWKSB7XHJcbiAgICAgICAgICByW2kreC50XSAtPSB4LkRWO1xyXG4gICAgICAgICAgcltpK3gudCsxXSA9IDE7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGlmKHIudCA+IDApIHJbci50LTFdICs9IHguYW0oaSx4W2ldLHIsMippLDAsMSk7XHJcbiAgICAgIHIucyA9IDA7XHJcbiAgICAgIHIuY2xhbXAoKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyAocHJvdGVjdGVkKSBkaXZpZGUgdGhpcyBieSBtLCBxdW90aWVudCBhbmQgcmVtYWluZGVyIHRvIHEsIHIgKEhBQyAxNC4yMClcclxuICAgIC8vIHIgIT0gcSwgdGhpcyAhPSBtLiAgcSBvciByIG1heSBiZSBudWxsLlxyXG4gICAgZnVuY3Rpb24gYm5wRGl2UmVtVG8obSxxLHIpIHtcclxuICAgICAgdmFyIHBtID0gbS5hYnMoKTtcclxuICAgICAgaWYocG0udCA8PSAwKSByZXR1cm47XHJcbiAgICAgIHZhciBwdCA9IHRoaXMuYWJzKCk7XHJcbiAgICAgIGlmKHB0LnQgPCBwbS50KSB7XHJcbiAgICAgICAgaWYocSAhPSBudWxsKSBxLmZyb21JbnQoMCk7XHJcbiAgICAgICAgaWYociAhPSBudWxsKSB0aGlzLmNvcHlUbyhyKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuICAgICAgaWYociA9PSBudWxsKSByID0gbmJpKCk7XHJcbiAgICAgIHZhciB5ID0gbmJpKCksIHRzID0gdGhpcy5zLCBtcyA9IG0ucztcclxuICAgICAgdmFyIG5zaCA9IHRoaXMuREItbmJpdHMocG1bcG0udC0xXSk7ICAgLy8gbm9ybWFsaXplIG1vZHVsdXNcclxuICAgICAgaWYobnNoID4gMCkgeyBwbS5sU2hpZnRUbyhuc2gseSk7IHB0LmxTaGlmdFRvKG5zaCxyKTsgfVxyXG4gICAgICBlbHNlIHsgcG0uY29weVRvKHkpOyBwdC5jb3B5VG8ocik7IH1cclxuICAgICAgdmFyIHlzID0geS50O1xyXG4gICAgICB2YXIgeTAgPSB5W3lzLTFdO1xyXG4gICAgICBpZih5MCA9PSAwKSByZXR1cm47XHJcbiAgICAgIHZhciB5dCA9IHkwKigxPDx0aGlzLkYxKSsoKHlzPjEpP3lbeXMtMl0+PnRoaXMuRjI6MCk7XHJcbiAgICAgIHZhciBkMSA9IHRoaXMuRlYveXQsIGQyID0gKDE8PHRoaXMuRjEpL3l0LCBlID0gMTw8dGhpcy5GMjtcclxuICAgICAgdmFyIGkgPSByLnQsIGogPSBpLXlzLCB0ID0gKHE9PW51bGwpP25iaSgpOnE7XHJcbiAgICAgIHkuZGxTaGlmdFRvKGosdCk7XHJcbiAgICAgIGlmKHIuY29tcGFyZVRvKHQpID49IDApIHtcclxuICAgICAgICByW3IudCsrXSA9IDE7XHJcbiAgICAgICAgci5zdWJUbyh0LHIpO1xyXG4gICAgICB9XHJcbiAgICAgIEJpZ0ludGVnZXIuT05FLmRsU2hpZnRUbyh5cyx0KTtcclxuICAgICAgdC5zdWJUbyh5LHkpOyAgLy8gXCJuZWdhdGl2ZVwiIHkgc28gd2UgY2FuIHJlcGxhY2Ugc3ViIHdpdGggYW0gbGF0ZXJcclxuICAgICAgd2hpbGUoeS50IDwgeXMpIHlbeS50KytdID0gMDtcclxuICAgICAgd2hpbGUoLS1qID49IDApIHtcclxuICAgICAgICAvLyBFc3RpbWF0ZSBxdW90aWVudCBkaWdpdFxyXG4gICAgICAgIHZhciBxZCA9IChyWy0taV09PXkwKT90aGlzLkRNOk1hdGguZmxvb3IocltpXSpkMSsocltpLTFdK2UpKmQyKTtcclxuICAgICAgICBpZigocltpXSs9eS5hbSgwLHFkLHIsaiwwLHlzKSkgPCBxZCkgeyAgIC8vIFRyeSBpdCBvdXRcclxuICAgICAgICAgIHkuZGxTaGlmdFRvKGosdCk7XHJcbiAgICAgICAgICByLnN1YlRvKHQscik7XHJcbiAgICAgICAgICB3aGlsZShyW2ldIDwgLS1xZCkgci5zdWJUbyh0LHIpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBpZihxICE9IG51bGwpIHtcclxuICAgICAgICByLmRyU2hpZnRUbyh5cyxxKTtcclxuICAgICAgICBpZih0cyAhPSBtcykgQmlnSW50ZWdlci5aRVJPLnN1YlRvKHEscSk7XHJcbiAgICAgIH1cclxuICAgICAgci50ID0geXM7XHJcbiAgICAgIHIuY2xhbXAoKTtcclxuICAgICAgaWYobnNoID4gMCkgci5yU2hpZnRUbyhuc2gscik7IC8vIERlbm9ybWFsaXplIHJlbWFpbmRlclxyXG4gICAgICBpZih0cyA8IDApIEJpZ0ludGVnZXIuWkVSTy5zdWJUbyhyLHIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIChwdWJsaWMpIHRoaXMgbW9kIGFcclxuICAgIGZ1bmN0aW9uIGJuTW9kKGEpIHtcclxuICAgICAgdmFyIHIgPSBuYmkoKTtcclxuICAgICAgdGhpcy5hYnMoKS5kaXZSZW1UbyhhLG51bGwscik7XHJcbiAgICAgIGlmKHRoaXMucyA8IDAgJiYgci5jb21wYXJlVG8oQmlnSW50ZWdlci5aRVJPKSA+IDApIGEuc3ViVG8ocixyKTtcclxuICAgICAgcmV0dXJuIHI7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gTW9kdWxhciByZWR1Y3Rpb24gdXNpbmcgXCJjbGFzc2ljXCIgYWxnb3JpdGhtXHJcbiAgICBmdW5jdGlvbiBDbGFzc2ljKG0pIHsgdGhpcy5tID0gbTsgfVxyXG4gICAgZnVuY3Rpb24gY0NvbnZlcnQoeCkge1xyXG4gICAgICBpZih4LnMgPCAwIHx8IHguY29tcGFyZVRvKHRoaXMubSkgPj0gMCkgcmV0dXJuIHgubW9kKHRoaXMubSk7XHJcbiAgICAgIGVsc2UgcmV0dXJuIHg7XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiBjUmV2ZXJ0KHgpIHsgcmV0dXJuIHg7IH1cclxuICAgIGZ1bmN0aW9uIGNSZWR1Y2UoeCkgeyB4LmRpdlJlbVRvKHRoaXMubSxudWxsLHgpOyB9XHJcbiAgICBmdW5jdGlvbiBjTXVsVG8oeCx5LHIpIHsgeC5tdWx0aXBseVRvKHkscik7IHRoaXMucmVkdWNlKHIpOyB9XHJcbiAgICBmdW5jdGlvbiBjU3FyVG8oeCxyKSB7IHguc3F1YXJlVG8ocik7IHRoaXMucmVkdWNlKHIpOyB9XHJcblxyXG4gICAgQ2xhc3NpYy5wcm90b3R5cGUuY29udmVydCA9IGNDb252ZXJ0O1xyXG4gICAgQ2xhc3NpYy5wcm90b3R5cGUucmV2ZXJ0ID0gY1JldmVydDtcclxuICAgIENsYXNzaWMucHJvdG90eXBlLnJlZHVjZSA9IGNSZWR1Y2U7XHJcbiAgICBDbGFzc2ljLnByb3RvdHlwZS5tdWxUbyA9IGNNdWxUbztcclxuICAgIENsYXNzaWMucHJvdG90eXBlLnNxclRvID0gY1NxclRvO1xyXG5cclxuICAgIC8vIChwcm90ZWN0ZWQpIHJldHVybiBcIi0xL3RoaXMgJSAyXkRCXCI7IHVzZWZ1bCBmb3IgTW9udC4gcmVkdWN0aW9uXHJcbiAgICAvLyBqdXN0aWZpY2F0aW9uOlxyXG4gICAgLy8gICAgICAgICB4eSA9PSAxIChtb2QgbSlcclxuICAgIC8vICAgICAgICAgeHkgPSAgMStrbVxyXG4gICAgLy8gICB4eSgyLXh5KSA9ICgxK2ttKSgxLWttKVxyXG4gICAgLy8geFt5KDIteHkpXSA9IDEta14ybV4yXHJcbiAgICAvLyB4W3koMi14eSldID09IDEgKG1vZCBtXjIpXHJcbiAgICAvLyBpZiB5IGlzIDEveCBtb2QgbSwgdGhlbiB5KDIteHkpIGlzIDEveCBtb2QgbV4yXHJcbiAgICAvLyBzaG91bGQgcmVkdWNlIHggYW5kIHkoMi14eSkgYnkgbV4yIGF0IGVhY2ggc3RlcCB0byBrZWVwIHNpemUgYm91bmRlZC5cclxuICAgIC8vIEpTIG11bHRpcGx5IFwib3ZlcmZsb3dzXCIgZGlmZmVyZW50bHkgZnJvbSBDL0MrKywgc28gY2FyZSBpcyBuZWVkZWQgaGVyZS5cclxuICAgIGZ1bmN0aW9uIGJucEludkRpZ2l0KCkge1xyXG4gICAgICBpZih0aGlzLnQgPCAxKSByZXR1cm4gMDtcclxuICAgICAgdmFyIHggPSB0aGlzWzBdO1xyXG4gICAgICBpZigoeCYxKSA9PSAwKSByZXR1cm4gMDtcclxuICAgICAgdmFyIHkgPSB4JjM7ICAgICAgIC8vIHkgPT0gMS94IG1vZCAyXjJcclxuICAgICAgeSA9ICh5KigyLSh4JjB4ZikqeSkpJjB4ZjsgLy8geSA9PSAxL3ggbW9kIDJeNFxyXG4gICAgICB5ID0gKHkqKDItKHgmMHhmZikqeSkpJjB4ZmY7ICAgLy8geSA9PSAxL3ggbW9kIDJeOFxyXG4gICAgICB5ID0gKHkqKDItKCgoeCYweGZmZmYpKnkpJjB4ZmZmZikpKSYweGZmZmY7ICAgIC8vIHkgPT0gMS94IG1vZCAyXjE2XHJcbiAgICAgIC8vIGxhc3Qgc3RlcCAtIGNhbGN1bGF0ZSBpbnZlcnNlIG1vZCBEViBkaXJlY3RseTtcclxuICAgICAgLy8gYXNzdW1lcyAxNiA8IERCIDw9IDMyIGFuZCBhc3N1bWVzIGFiaWxpdHkgdG8gaGFuZGxlIDQ4LWJpdCBpbnRzXHJcbiAgICAgIHkgPSAoeSooMi14KnkldGhpcy5EVikpJXRoaXMuRFY7ICAgICAgIC8vIHkgPT0gMS94IG1vZCAyXmRiaXRzXHJcbiAgICAgIC8vIHdlIHJlYWxseSB3YW50IHRoZSBuZWdhdGl2ZSBpbnZlcnNlLCBhbmQgLURWIDwgeSA8IERWXHJcbiAgICAgIHJldHVybiAoeT4wKT90aGlzLkRWLXk6LXk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gTW9udGdvbWVyeSByZWR1Y3Rpb25cclxuICAgIGZ1bmN0aW9uIE1vbnRnb21lcnkobSkge1xyXG4gICAgICB0aGlzLm0gPSBtO1xyXG4gICAgICB0aGlzLm1wID0gbS5pbnZEaWdpdCgpO1xyXG4gICAgICB0aGlzLm1wbCA9IHRoaXMubXAmMHg3ZmZmO1xyXG4gICAgICB0aGlzLm1waCA9IHRoaXMubXA+PjE1O1xyXG4gICAgICB0aGlzLnVtID0gKDE8PChtLkRCLTE1KSktMTtcclxuICAgICAgdGhpcy5tdDIgPSAyKm0udDtcclxuICAgIH1cclxuXHJcbiAgICAvLyB4UiBtb2QgbVxyXG4gICAgZnVuY3Rpb24gbW9udENvbnZlcnQoeCkge1xyXG4gICAgICB2YXIgciA9IG5iaSgpO1xyXG4gICAgICB4LmFicygpLmRsU2hpZnRUbyh0aGlzLm0udCxyKTtcclxuICAgICAgci5kaXZSZW1Ubyh0aGlzLm0sbnVsbCxyKTtcclxuICAgICAgaWYoeC5zIDwgMCAmJiByLmNvbXBhcmVUbyhCaWdJbnRlZ2VyLlpFUk8pID4gMCkgdGhpcy5tLnN1YlRvKHIscik7XHJcbiAgICAgIHJldHVybiByO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHgvUiBtb2QgbVxyXG4gICAgZnVuY3Rpb24gbW9udFJldmVydCh4KSB7XHJcbiAgICAgIHZhciByID0gbmJpKCk7XHJcbiAgICAgIHguY29weVRvKHIpO1xyXG4gICAgICB0aGlzLnJlZHVjZShyKTtcclxuICAgICAgcmV0dXJuIHI7XHJcbiAgICB9XHJcblxyXG4gICAgLy8geCA9IHgvUiBtb2QgbSAoSEFDIDE0LjMyKVxyXG4gICAgZnVuY3Rpb24gbW9udFJlZHVjZSh4KSB7XHJcbiAgICAgIHdoaWxlKHgudCA8PSB0aGlzLm10MikgLy8gcGFkIHggc28gYW0gaGFzIGVub3VnaCByb29tIGxhdGVyXHJcbiAgICAgICAgeFt4LnQrK10gPSAwO1xyXG4gICAgICBmb3IodmFyIGkgPSAwOyBpIDwgdGhpcy5tLnQ7ICsraSkge1xyXG4gICAgICAgIC8vIGZhc3RlciB3YXkgb2YgY2FsY3VsYXRpbmcgdTAgPSB4W2ldKm1wIG1vZCBEVlxyXG4gICAgICAgIHZhciBqID0geFtpXSYweDdmZmY7XHJcbiAgICAgICAgdmFyIHUwID0gKGoqdGhpcy5tcGwrKCgoaip0aGlzLm1waCsoeFtpXT4+MTUpKnRoaXMubXBsKSZ0aGlzLnVtKTw8MTUpKSZ4LkRNO1xyXG4gICAgICAgIC8vIHVzZSBhbSB0byBjb21iaW5lIHRoZSBtdWx0aXBseS1zaGlmdC1hZGQgaW50byBvbmUgY2FsbFxyXG4gICAgICAgIGogPSBpK3RoaXMubS50O1xyXG4gICAgICAgIHhbal0gKz0gdGhpcy5tLmFtKDAsdTAseCxpLDAsdGhpcy5tLnQpO1xyXG4gICAgICAgIC8vIHByb3BhZ2F0ZSBjYXJyeVxyXG4gICAgICAgIHdoaWxlKHhbal0gPj0geC5EVikgeyB4W2pdIC09IHguRFY7IHhbKytqXSsrOyB9XHJcbiAgICAgIH1cclxuICAgICAgeC5jbGFtcCgpO1xyXG4gICAgICB4LmRyU2hpZnRUbyh0aGlzLm0udCx4KTtcclxuICAgICAgaWYoeC5jb21wYXJlVG8odGhpcy5tKSA+PSAwKSB4LnN1YlRvKHRoaXMubSx4KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyByID0gXCJ4XjIvUiBtb2QgbVwiOyB4ICE9IHJcclxuICAgIGZ1bmN0aW9uIG1vbnRTcXJUbyh4LHIpIHsgeC5zcXVhcmVUbyhyKTsgdGhpcy5yZWR1Y2Uocik7IH1cclxuXHJcbiAgICAvLyByID0gXCJ4eS9SIG1vZCBtXCI7IHgseSAhPSByXHJcbiAgICBmdW5jdGlvbiBtb250TXVsVG8oeCx5LHIpIHsgeC5tdWx0aXBseVRvKHkscik7IHRoaXMucmVkdWNlKHIpOyB9XHJcblxyXG4gICAgTW9udGdvbWVyeS5wcm90b3R5cGUuY29udmVydCA9IG1vbnRDb252ZXJ0O1xyXG4gICAgTW9udGdvbWVyeS5wcm90b3R5cGUucmV2ZXJ0ID0gbW9udFJldmVydDtcclxuICAgIE1vbnRnb21lcnkucHJvdG90eXBlLnJlZHVjZSA9IG1vbnRSZWR1Y2U7XHJcbiAgICBNb250Z29tZXJ5LnByb3RvdHlwZS5tdWxUbyA9IG1vbnRNdWxUbztcclxuICAgIE1vbnRnb21lcnkucHJvdG90eXBlLnNxclRvID0gbW9udFNxclRvO1xyXG5cclxuICAgIC8vIChwcm90ZWN0ZWQpIHRydWUgaWZmIHRoaXMgaXMgZXZlblxyXG4gICAgZnVuY3Rpb24gYm5wSXNFdmVuKCkgeyByZXR1cm4gKCh0aGlzLnQ+MCk/KHRoaXNbMF0mMSk6dGhpcy5zKSA9PSAwOyB9XHJcblxyXG4gICAgLy8gKHByb3RlY3RlZCkgdGhpc15lLCBlIDwgMl4zMiwgZG9pbmcgc3FyIGFuZCBtdWwgd2l0aCBcInJcIiAoSEFDIDE0Ljc5KVxyXG4gICAgZnVuY3Rpb24gYm5wRXhwKGUseikge1xyXG4gICAgICBpZihlID4gMHhmZmZmZmZmZiB8fCBlIDwgMSkgcmV0dXJuIEJpZ0ludGVnZXIuT05FO1xyXG4gICAgICB2YXIgciA9IG5iaSgpLCByMiA9IG5iaSgpLCBnID0gei5jb252ZXJ0KHRoaXMpLCBpID0gbmJpdHMoZSktMTtcclxuICAgICAgZy5jb3B5VG8ocik7XHJcbiAgICAgIHdoaWxlKC0taSA+PSAwKSB7XHJcbiAgICAgICAgei5zcXJUbyhyLHIyKTtcclxuICAgICAgICBpZigoZSYoMTw8aSkpID4gMCkgei5tdWxUbyhyMixnLHIpO1xyXG4gICAgICAgIGVsc2UgeyB2YXIgdCA9IHI7IHIgPSByMjsgcjIgPSB0OyB9XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHoucmV2ZXJ0KHIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIChwdWJsaWMpIHRoaXNeZSAlIG0sIDAgPD0gZSA8IDJeMzJcclxuICAgIGZ1bmN0aW9uIGJuTW9kUG93SW50KGUsbSkge1xyXG4gICAgICB2YXIgejtcclxuICAgICAgaWYoZSA8IDI1NiB8fCBtLmlzRXZlbigpKSB6ID0gbmV3IENsYXNzaWMobSk7IGVsc2UgeiA9IG5ldyBNb250Z29tZXJ5KG0pO1xyXG4gICAgICByZXR1cm4gdGhpcy5leHAoZSx6KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBwcm90ZWN0ZWRcclxuICAgIEJpZ0ludGVnZXIucHJvdG90eXBlLmNvcHlUbyA9IGJucENvcHlUbztcclxuICAgIEJpZ0ludGVnZXIucHJvdG90eXBlLmZyb21JbnQgPSBibnBGcm9tSW50O1xyXG4gICAgQmlnSW50ZWdlci5wcm90b3R5cGUuZnJvbVN0cmluZyA9IGJucEZyb21TdHJpbmc7XHJcbiAgICBCaWdJbnRlZ2VyLnByb3RvdHlwZS5jbGFtcCA9IGJucENsYW1wO1xyXG4gICAgQmlnSW50ZWdlci5wcm90b3R5cGUuZGxTaGlmdFRvID0gYm5wRExTaGlmdFRvO1xyXG4gICAgQmlnSW50ZWdlci5wcm90b3R5cGUuZHJTaGlmdFRvID0gYm5wRFJTaGlmdFRvO1xyXG4gICAgQmlnSW50ZWdlci5wcm90b3R5cGUubFNoaWZ0VG8gPSBibnBMU2hpZnRUbztcclxuICAgIEJpZ0ludGVnZXIucHJvdG90eXBlLnJTaGlmdFRvID0gYm5wUlNoaWZ0VG87XHJcbiAgICBCaWdJbnRlZ2VyLnByb3RvdHlwZS5zdWJUbyA9IGJucFN1YlRvO1xyXG4gICAgQmlnSW50ZWdlci5wcm90b3R5cGUubXVsdGlwbHlUbyA9IGJucE11bHRpcGx5VG87XHJcbiAgICBCaWdJbnRlZ2VyLnByb3RvdHlwZS5zcXVhcmVUbyA9IGJucFNxdWFyZVRvO1xyXG4gICAgQmlnSW50ZWdlci5wcm90b3R5cGUuZGl2UmVtVG8gPSBibnBEaXZSZW1UbztcclxuICAgIEJpZ0ludGVnZXIucHJvdG90eXBlLmludkRpZ2l0ID0gYm5wSW52RGlnaXQ7XHJcbiAgICBCaWdJbnRlZ2VyLnByb3RvdHlwZS5pc0V2ZW4gPSBibnBJc0V2ZW47XHJcbiAgICBCaWdJbnRlZ2VyLnByb3RvdHlwZS5leHAgPSBibnBFeHA7XHJcblxyXG4gICAgLy8gcHVibGljXHJcbiAgICBCaWdJbnRlZ2VyLnByb3RvdHlwZS50b1N0cmluZyA9IGJuVG9TdHJpbmc7XHJcbiAgICBCaWdJbnRlZ2VyLnByb3RvdHlwZS5uZWdhdGUgPSBibk5lZ2F0ZTtcclxuICAgIEJpZ0ludGVnZXIucHJvdG90eXBlLmFicyA9IGJuQWJzO1xyXG4gICAgQmlnSW50ZWdlci5wcm90b3R5cGUuY29tcGFyZVRvID0gYm5Db21wYXJlVG87XHJcbiAgICBCaWdJbnRlZ2VyLnByb3RvdHlwZS5iaXRMZW5ndGggPSBibkJpdExlbmd0aDtcclxuICAgIEJpZ0ludGVnZXIucHJvdG90eXBlLm1vZCA9IGJuTW9kO1xyXG4gICAgQmlnSW50ZWdlci5wcm90b3R5cGUubW9kUG93SW50ID0gYm5Nb2RQb3dJbnQ7XHJcblxyXG4gICAgLy8gXCJjb25zdGFudHNcIlxyXG4gICAgQmlnSW50ZWdlci5aRVJPID0gbmJ2KDApO1xyXG4gICAgQmlnSW50ZWdlci5PTkUgPSBuYnYoMSk7XHJcblxyXG4gICAgLy8gQ29weXJpZ2h0IChjKSAyMDA1LTIwMDkgIFRvbSBXdVxyXG4gICAgLy8gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cclxuICAgIC8vIFNlZSBcIkxJQ0VOU0VcIiBmb3IgZGV0YWlscy5cclxuXHJcbiAgICAvLyBFeHRlbmRlZCBKYXZhU2NyaXB0IEJOIGZ1bmN0aW9ucywgcmVxdWlyZWQgZm9yIFJTQSBwcml2YXRlIG9wcy5cclxuXHJcbiAgICAvLyBWZXJzaW9uIDEuMTogbmV3IEJpZ0ludGVnZXIoXCIwXCIsIDEwKSByZXR1cm5zIFwicHJvcGVyXCIgemVyb1xyXG4gICAgLy8gVmVyc2lvbiAxLjI6IHNxdWFyZSgpIEFQSSwgaXNQcm9iYWJsZVByaW1lIGZpeFxyXG5cclxuICAgIC8vIChwdWJsaWMpXHJcbiAgICBmdW5jdGlvbiBibkNsb25lKCkgeyB2YXIgciA9IG5iaSgpOyB0aGlzLmNvcHlUbyhyKTsgcmV0dXJuIHI7IH1cclxuXHJcbiAgICAvLyAocHVibGljKSByZXR1cm4gdmFsdWUgYXMgaW50ZWdlclxyXG4gICAgZnVuY3Rpb24gYm5JbnRWYWx1ZSgpIHtcclxuICAgICAgaWYodGhpcy5zIDwgMCkge1xyXG4gICAgICAgIGlmKHRoaXMudCA9PSAxKSByZXR1cm4gdGhpc1swXS10aGlzLkRWO1xyXG4gICAgICAgIGVsc2UgaWYodGhpcy50ID09IDApIHJldHVybiAtMTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIGlmKHRoaXMudCA9PSAxKSByZXR1cm4gdGhpc1swXTtcclxuICAgICAgZWxzZSBpZih0aGlzLnQgPT0gMCkgcmV0dXJuIDA7XHJcbiAgICAgIC8vIGFzc3VtZXMgMTYgPCBEQiA8IDMyXHJcbiAgICAgIHJldHVybiAoKHRoaXNbMV0mKCgxPDwoMzItdGhpcy5EQikpLTEpKTw8dGhpcy5EQil8dGhpc1swXTtcclxuICAgIH1cclxuXHJcbiAgICAvLyAocHVibGljKSByZXR1cm4gdmFsdWUgYXMgYnl0ZVxyXG4gICAgZnVuY3Rpb24gYm5CeXRlVmFsdWUoKSB7IHJldHVybiAodGhpcy50PT0wKT90aGlzLnM6KHRoaXNbMF08PDI0KT4+MjQ7IH1cclxuXHJcbiAgICAvLyAocHVibGljKSByZXR1cm4gdmFsdWUgYXMgc2hvcnQgKGFzc3VtZXMgREI+PTE2KVxyXG4gICAgZnVuY3Rpb24gYm5TaG9ydFZhbHVlKCkgeyByZXR1cm4gKHRoaXMudD09MCk/dGhpcy5zOih0aGlzWzBdPDwxNik+PjE2OyB9XHJcblxyXG4gICAgLy8gKHByb3RlY3RlZCkgcmV0dXJuIHggcy50LiByXnggPCBEVlxyXG4gICAgZnVuY3Rpb24gYm5wQ2h1bmtTaXplKHIpIHsgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5MTjIqdGhpcy5EQi9NYXRoLmxvZyhyKSk7IH1cclxuXHJcbiAgICAvLyAocHVibGljKSAwIGlmIHRoaXMgPT0gMCwgMSBpZiB0aGlzID4gMFxyXG4gICAgZnVuY3Rpb24gYm5TaWdOdW0oKSB7XHJcbiAgICAgIGlmKHRoaXMucyA8IDApIHJldHVybiAtMTtcclxuICAgICAgZWxzZSBpZih0aGlzLnQgPD0gMCB8fCAodGhpcy50ID09IDEgJiYgdGhpc1swXSA8PSAwKSkgcmV0dXJuIDA7XHJcbiAgICAgIGVsc2UgcmV0dXJuIDE7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gKHByb3RlY3RlZCkgY29udmVydCB0byByYWRpeCBzdHJpbmdcclxuICAgIGZ1bmN0aW9uIGJucFRvUmFkaXgoYikge1xyXG4gICAgICBpZihiID09IG51bGwpIGIgPSAxMDtcclxuICAgICAgaWYodGhpcy5zaWdudW0oKSA9PSAwIHx8IGIgPCAyIHx8IGIgPiAzNikgcmV0dXJuIFwiMFwiO1xyXG4gICAgICB2YXIgY3MgPSB0aGlzLmNodW5rU2l6ZShiKTtcclxuICAgICAgdmFyIGEgPSBNYXRoLnBvdyhiLGNzKTtcclxuICAgICAgdmFyIGQgPSBuYnYoYSksIHkgPSBuYmkoKSwgeiA9IG5iaSgpLCByID0gXCJcIjtcclxuICAgICAgdGhpcy5kaXZSZW1UbyhkLHkseik7XHJcbiAgICAgIHdoaWxlKHkuc2lnbnVtKCkgPiAwKSB7XHJcbiAgICAgICAgciA9IChhK3ouaW50VmFsdWUoKSkudG9TdHJpbmcoYikuc3Vic3RyKDEpICsgcjtcclxuICAgICAgICB5LmRpdlJlbVRvKGQseSx6KTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gei5pbnRWYWx1ZSgpLnRvU3RyaW5nKGIpICsgcjtcclxuICAgIH1cclxuXHJcbiAgICAvLyAocHJvdGVjdGVkKSBjb252ZXJ0IGZyb20gcmFkaXggc3RyaW5nXHJcbiAgICBmdW5jdGlvbiBibnBGcm9tUmFkaXgocyxiKSB7XHJcbiAgICAgIHRoaXMuZnJvbUludCgwKTtcclxuICAgICAgaWYoYiA9PSBudWxsKSBiID0gMTA7XHJcbiAgICAgIHZhciBjcyA9IHRoaXMuY2h1bmtTaXplKGIpO1xyXG4gICAgICB2YXIgZCA9IE1hdGgucG93KGIsY3MpLCBtaSA9IGZhbHNlLCBqID0gMCwgdyA9IDA7XHJcbiAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBzLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgdmFyIHggPSBpbnRBdChzLGkpO1xyXG4gICAgICAgIGlmKHggPCAwKSB7XHJcbiAgICAgICAgICBpZihzLmNoYXJBdChpKSA9PSBcIi1cIiAmJiB0aGlzLnNpZ251bSgpID09IDApIG1pID0gdHJ1ZTtcclxuICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICB3ID0gYip3K3g7XHJcbiAgICAgICAgaWYoKytqID49IGNzKSB7XHJcbiAgICAgICAgICB0aGlzLmRNdWx0aXBseShkKTtcclxuICAgICAgICAgIHRoaXMuZEFkZE9mZnNldCh3LDApO1xyXG4gICAgICAgICAgaiA9IDA7XHJcbiAgICAgICAgICB3ID0gMDtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgaWYoaiA+IDApIHtcclxuICAgICAgICB0aGlzLmRNdWx0aXBseShNYXRoLnBvdyhiLGopKTtcclxuICAgICAgICB0aGlzLmRBZGRPZmZzZXQodywwKTtcclxuICAgICAgfVxyXG4gICAgICBpZihtaSkgQmlnSW50ZWdlci5aRVJPLnN1YlRvKHRoaXMsdGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gKHByb3RlY3RlZCkgYWx0ZXJuYXRlIGNvbnN0cnVjdG9yXHJcbiAgICBmdW5jdGlvbiBibnBGcm9tTnVtYmVyKGEsYixjKSB7XHJcbiAgICAgIGlmKFwibnVtYmVyXCIgPT0gdHlwZW9mIGIpIHtcclxuICAgICAgICAvLyBuZXcgQmlnSW50ZWdlcihpbnQsaW50LFJORylcclxuICAgICAgICBpZihhIDwgMikgdGhpcy5mcm9tSW50KDEpO1xyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgdGhpcy5mcm9tTnVtYmVyKGEsYyk7XHJcbiAgICAgICAgICBpZighdGhpcy50ZXN0Qml0KGEtMSkpXHQvLyBmb3JjZSBNU0Igc2V0XHJcbiAgICAgICAgICAgIHRoaXMuYml0d2lzZVRvKEJpZ0ludGVnZXIuT05FLnNoaWZ0TGVmdChhLTEpLG9wX29yLHRoaXMpO1xyXG4gICAgICAgICAgaWYodGhpcy5pc0V2ZW4oKSkgdGhpcy5kQWRkT2Zmc2V0KDEsMCk7IC8vIGZvcmNlIG9kZFxyXG4gICAgICAgICAgd2hpbGUoIXRoaXMuaXNQcm9iYWJsZVByaW1lKGIpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZEFkZE9mZnNldCgyLDApO1xyXG4gICAgICAgICAgICBpZih0aGlzLmJpdExlbmd0aCgpID4gYSkgdGhpcy5zdWJUbyhCaWdJbnRlZ2VyLk9ORS5zaGlmdExlZnQoYS0xKSx0aGlzKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgLy8gbmV3IEJpZ0ludGVnZXIoaW50LFJORylcclxuICAgICAgICB2YXIgeCA9IG5ldyBBcnJheSgpLCB0ID0gYSY3O1xyXG4gICAgICAgIHgubGVuZ3RoID0gKGE+PjMpKzE7XHJcbiAgICAgICAgYi5uZXh0Qnl0ZXMoeCk7XHJcbiAgICAgICAgaWYodCA+IDApIHhbMF0gJj0gKCgxPDx0KS0xKTsgZWxzZSB4WzBdID0gMDtcclxuICAgICAgICB0aGlzLmZyb21TdHJpbmcoeCwyNTYpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gKHB1YmxpYykgY29udmVydCB0byBiaWdlbmRpYW4gYnl0ZSBhcnJheVxyXG4gICAgZnVuY3Rpb24gYm5Ub0J5dGVBcnJheSgpIHtcclxuICAgICAgdmFyIGkgPSB0aGlzLnQsIHIgPSBuZXcgQXJyYXkoKTtcclxuICAgICAgclswXSA9IHRoaXMucztcclxuICAgICAgdmFyIHAgPSB0aGlzLkRCLShpKnRoaXMuREIpJTgsIGQsIGsgPSAwO1xyXG4gICAgICBpZihpLS0gPiAwKSB7XHJcbiAgICAgICAgaWYocCA8IHRoaXMuREIgJiYgKGQgPSB0aGlzW2ldPj5wKSAhPSAodGhpcy5zJnRoaXMuRE0pPj5wKVxyXG4gICAgICAgICAgcltrKytdID0gZHwodGhpcy5zPDwodGhpcy5EQi1wKSk7XHJcbiAgICAgICAgd2hpbGUoaSA+PSAwKSB7XHJcbiAgICAgICAgICBpZihwIDwgOCkge1xyXG4gICAgICAgICAgICBkID0gKHRoaXNbaV0mKCgxPDxwKS0xKSk8PCg4LXApO1xyXG4gICAgICAgICAgICBkIHw9IHRoaXNbLS1pXT4+KHArPXRoaXMuREItOCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgZCA9ICh0aGlzW2ldPj4ocC09OCkpJjB4ZmY7XHJcbiAgICAgICAgICAgIGlmKHAgPD0gMCkgeyBwICs9IHRoaXMuREI7IC0taTsgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYoKGQmMHg4MCkgIT0gMCkgZCB8PSAtMjU2O1xyXG4gICAgICAgICAgaWYoayA9PSAwICYmICh0aGlzLnMmMHg4MCkgIT0gKGQmMHg4MCkpICsraztcclxuICAgICAgICAgIGlmKGsgPiAwIHx8IGQgIT0gdGhpcy5zKSByW2srK10gPSBkO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gcjtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBibkVxdWFscyhhKSB7IHJldHVybih0aGlzLmNvbXBhcmVUbyhhKT09MCk7IH1cclxuICAgIGZ1bmN0aW9uIGJuTWluKGEpIHsgcmV0dXJuKHRoaXMuY29tcGFyZVRvKGEpPDApP3RoaXM6YTsgfVxyXG4gICAgZnVuY3Rpb24gYm5NYXgoYSkgeyByZXR1cm4odGhpcy5jb21wYXJlVG8oYSk+MCk/dGhpczphOyB9XHJcblxyXG4gICAgLy8gKHByb3RlY3RlZCkgciA9IHRoaXMgb3AgYSAoYml0d2lzZSlcclxuICAgIGZ1bmN0aW9uIGJucEJpdHdpc2VUbyhhLG9wLHIpIHtcclxuICAgICAgdmFyIGksIGYsIG0gPSBNYXRoLm1pbihhLnQsdGhpcy50KTtcclxuICAgICAgZm9yKGkgPSAwOyBpIDwgbTsgKytpKSByW2ldID0gb3AodGhpc1tpXSxhW2ldKTtcclxuICAgICAgaWYoYS50IDwgdGhpcy50KSB7XHJcbiAgICAgICAgZiA9IGEucyZ0aGlzLkRNO1xyXG4gICAgICAgIGZvcihpID0gbTsgaSA8IHRoaXMudDsgKytpKSByW2ldID0gb3AodGhpc1tpXSxmKTtcclxuICAgICAgICByLnQgPSB0aGlzLnQ7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgZiA9IHRoaXMucyZ0aGlzLkRNO1xyXG4gICAgICAgIGZvcihpID0gbTsgaSA8IGEudDsgKytpKSByW2ldID0gb3AoZixhW2ldKTtcclxuICAgICAgICByLnQgPSBhLnQ7XHJcbiAgICAgIH1cclxuICAgICAgci5zID0gb3AodGhpcy5zLGEucyk7XHJcbiAgICAgIHIuY2xhbXAoKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyAocHVibGljKSB0aGlzICYgYVxyXG4gICAgZnVuY3Rpb24gb3BfYW5kKHgseSkgeyByZXR1cm4geCZ5OyB9XHJcbiAgICBmdW5jdGlvbiBibkFuZChhKSB7IHZhciByID0gbmJpKCk7IHRoaXMuYml0d2lzZVRvKGEsb3BfYW5kLHIpOyByZXR1cm4gcjsgfVxyXG5cclxuICAgIC8vIChwdWJsaWMpIHRoaXMgfCBhXHJcbiAgICBmdW5jdGlvbiBvcF9vcih4LHkpIHsgcmV0dXJuIHh8eTsgfVxyXG4gICAgZnVuY3Rpb24gYm5PcihhKSB7IHZhciByID0gbmJpKCk7IHRoaXMuYml0d2lzZVRvKGEsb3Bfb3Iscik7IHJldHVybiByOyB9XHJcblxyXG4gICAgLy8gKHB1YmxpYykgdGhpcyBeIGFcclxuICAgIGZ1bmN0aW9uIG9wX3hvcih4LHkpIHsgcmV0dXJuIHheeTsgfVxyXG4gICAgZnVuY3Rpb24gYm5Yb3IoYSkgeyB2YXIgciA9IG5iaSgpOyB0aGlzLmJpdHdpc2VUbyhhLG9wX3hvcixyKTsgcmV0dXJuIHI7IH1cclxuXHJcbiAgICAvLyAocHVibGljKSB0aGlzICYgfmFcclxuICAgIGZ1bmN0aW9uIG9wX2FuZG5vdCh4LHkpIHsgcmV0dXJuIHgmfnk7IH1cclxuICAgIGZ1bmN0aW9uIGJuQW5kTm90KGEpIHsgdmFyIHIgPSBuYmkoKTsgdGhpcy5iaXR3aXNlVG8oYSxvcF9hbmRub3Qscik7IHJldHVybiByOyB9XHJcblxyXG4gICAgLy8gKHB1YmxpYykgfnRoaXNcclxuICAgIGZ1bmN0aW9uIGJuTm90KCkge1xyXG4gICAgICB2YXIgciA9IG5iaSgpO1xyXG4gICAgICBmb3IodmFyIGkgPSAwOyBpIDwgdGhpcy50OyArK2kpIHJbaV0gPSB0aGlzLkRNJn50aGlzW2ldO1xyXG4gICAgICByLnQgPSB0aGlzLnQ7XHJcbiAgICAgIHIucyA9IH50aGlzLnM7XHJcbiAgICAgIHJldHVybiByO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIChwdWJsaWMpIHRoaXMgPDwgblxyXG4gICAgZnVuY3Rpb24gYm5TaGlmdExlZnQobikge1xyXG4gICAgICB2YXIgciA9IG5iaSgpO1xyXG4gICAgICBpZihuIDwgMCkgdGhpcy5yU2hpZnRUbygtbixyKTsgZWxzZSB0aGlzLmxTaGlmdFRvKG4scik7XHJcbiAgICAgIHJldHVybiByO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIChwdWJsaWMpIHRoaXMgPj4gblxyXG4gICAgZnVuY3Rpb24gYm5TaGlmdFJpZ2h0KG4pIHtcclxuICAgICAgdmFyIHIgPSBuYmkoKTtcclxuICAgICAgaWYobiA8IDApIHRoaXMubFNoaWZ0VG8oLW4scik7IGVsc2UgdGhpcy5yU2hpZnRUbyhuLHIpO1xyXG4gICAgICByZXR1cm4gcjtcclxuICAgIH1cclxuXHJcbiAgICAvLyByZXR1cm4gaW5kZXggb2YgbG93ZXN0IDEtYml0IGluIHgsIHggPCAyXjMxXHJcbiAgICBmdW5jdGlvbiBsYml0KHgpIHtcclxuICAgICAgaWYoeCA9PSAwKSByZXR1cm4gLTE7XHJcbiAgICAgIHZhciByID0gMDtcclxuICAgICAgaWYoKHgmMHhmZmZmKSA9PSAwKSB7IHggPj49IDE2OyByICs9IDE2OyB9XHJcbiAgICAgIGlmKCh4JjB4ZmYpID09IDApIHsgeCA+Pj0gODsgciArPSA4OyB9XHJcbiAgICAgIGlmKCh4JjB4ZikgPT0gMCkgeyB4ID4+PSA0OyByICs9IDQ7IH1cclxuICAgICAgaWYoKHgmMykgPT0gMCkgeyB4ID4+PSAyOyByICs9IDI7IH1cclxuICAgICAgaWYoKHgmMSkgPT0gMCkgKytyO1xyXG4gICAgICByZXR1cm4gcjtcclxuICAgIH1cclxuXHJcbiAgICAvLyAocHVibGljKSByZXR1cm5zIGluZGV4IG9mIGxvd2VzdCAxLWJpdCAob3IgLTEgaWYgbm9uZSlcclxuICAgIGZ1bmN0aW9uIGJuR2V0TG93ZXN0U2V0Qml0KCkge1xyXG4gICAgICBmb3IodmFyIGkgPSAwOyBpIDwgdGhpcy50OyArK2kpXHJcbiAgICAgICAgaWYodGhpc1tpXSAhPSAwKSByZXR1cm4gaSp0aGlzLkRCK2xiaXQodGhpc1tpXSk7XHJcbiAgICAgIGlmKHRoaXMucyA8IDApIHJldHVybiB0aGlzLnQqdGhpcy5EQjtcclxuICAgICAgcmV0dXJuIC0xO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHJldHVybiBudW1iZXIgb2YgMSBiaXRzIGluIHhcclxuICAgIGZ1bmN0aW9uIGNiaXQoeCkge1xyXG4gICAgICB2YXIgciA9IDA7XHJcbiAgICAgIHdoaWxlKHggIT0gMCkgeyB4ICY9IHgtMTsgKytyOyB9XHJcbiAgICAgIHJldHVybiByO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIChwdWJsaWMpIHJldHVybiBudW1iZXIgb2Ygc2V0IGJpdHNcclxuICAgIGZ1bmN0aW9uIGJuQml0Q291bnQoKSB7XHJcbiAgICAgIHZhciByID0gMCwgeCA9IHRoaXMucyZ0aGlzLkRNO1xyXG4gICAgICBmb3IodmFyIGkgPSAwOyBpIDwgdGhpcy50OyArK2kpIHIgKz0gY2JpdCh0aGlzW2ldXngpO1xyXG4gICAgICByZXR1cm4gcjtcclxuICAgIH1cclxuXHJcbiAgICAvLyAocHVibGljKSB0cnVlIGlmZiBudGggYml0IGlzIHNldFxyXG4gICAgZnVuY3Rpb24gYm5UZXN0Qml0KG4pIHtcclxuICAgICAgdmFyIGogPSBNYXRoLmZsb29yKG4vdGhpcy5EQik7XHJcbiAgICAgIGlmKGogPj0gdGhpcy50KSByZXR1cm4odGhpcy5zIT0wKTtcclxuICAgICAgcmV0dXJuKCh0aGlzW2pdJigxPDwobiV0aGlzLkRCKSkpIT0wKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyAocHJvdGVjdGVkKSB0aGlzIG9wICgxPDxuKVxyXG4gICAgZnVuY3Rpb24gYm5wQ2hhbmdlQml0KG4sb3ApIHtcclxuICAgICAgdmFyIHIgPSBCaWdJbnRlZ2VyLk9ORS5zaGlmdExlZnQobik7XHJcbiAgICAgIHRoaXMuYml0d2lzZVRvKHIsb3Ascik7XHJcbiAgICAgIHJldHVybiByO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIChwdWJsaWMpIHRoaXMgfCAoMTw8bilcclxuICAgIGZ1bmN0aW9uIGJuU2V0Qml0KG4pIHsgcmV0dXJuIHRoaXMuY2hhbmdlQml0KG4sb3Bfb3IpOyB9XHJcblxyXG4gICAgLy8gKHB1YmxpYykgdGhpcyAmIH4oMTw8bilcclxuICAgIGZ1bmN0aW9uIGJuQ2xlYXJCaXQobikgeyByZXR1cm4gdGhpcy5jaGFuZ2VCaXQobixvcF9hbmRub3QpOyB9XHJcblxyXG4gICAgLy8gKHB1YmxpYykgdGhpcyBeICgxPDxuKVxyXG4gICAgZnVuY3Rpb24gYm5GbGlwQml0KG4pIHsgcmV0dXJuIHRoaXMuY2hhbmdlQml0KG4sb3BfeG9yKTsgfVxyXG5cclxuICAgIC8vIChwcm90ZWN0ZWQpIHIgPSB0aGlzICsgYVxyXG4gICAgZnVuY3Rpb24gYm5wQWRkVG8oYSxyKSB7XHJcbiAgICAgIHZhciBpID0gMCwgYyA9IDAsIG0gPSBNYXRoLm1pbihhLnQsdGhpcy50KTtcclxuICAgICAgd2hpbGUoaSA8IG0pIHtcclxuICAgICAgICBjICs9IHRoaXNbaV0rYVtpXTtcclxuICAgICAgICByW2krK10gPSBjJnRoaXMuRE07XHJcbiAgICAgICAgYyA+Pj0gdGhpcy5EQjtcclxuICAgICAgfVxyXG4gICAgICBpZihhLnQgPCB0aGlzLnQpIHtcclxuICAgICAgICBjICs9IGEucztcclxuICAgICAgICB3aGlsZShpIDwgdGhpcy50KSB7XHJcbiAgICAgICAgICBjICs9IHRoaXNbaV07XHJcbiAgICAgICAgICByW2krK10gPSBjJnRoaXMuRE07XHJcbiAgICAgICAgICBjID4+PSB0aGlzLkRCO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjICs9IHRoaXMucztcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICBjICs9IHRoaXMucztcclxuICAgICAgICB3aGlsZShpIDwgYS50KSB7XHJcbiAgICAgICAgICBjICs9IGFbaV07XHJcbiAgICAgICAgICByW2krK10gPSBjJnRoaXMuRE07XHJcbiAgICAgICAgICBjID4+PSB0aGlzLkRCO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjICs9IGEucztcclxuICAgICAgfVxyXG4gICAgICByLnMgPSAoYzwwKT8tMTowO1xyXG4gICAgICBpZihjID4gMCkgcltpKytdID0gYztcclxuICAgICAgZWxzZSBpZihjIDwgLTEpIHJbaSsrXSA9IHRoaXMuRFYrYztcclxuICAgICAgci50ID0gaTtcclxuICAgICAgci5jbGFtcCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIChwdWJsaWMpIHRoaXMgKyBhXHJcbiAgICBmdW5jdGlvbiBibkFkZChhKSB7IHZhciByID0gbmJpKCk7IHRoaXMuYWRkVG8oYSxyKTsgcmV0dXJuIHI7IH1cclxuXHJcbiAgICAvLyAocHVibGljKSB0aGlzIC0gYVxyXG4gICAgZnVuY3Rpb24gYm5TdWJ0cmFjdChhKSB7IHZhciByID0gbmJpKCk7IHRoaXMuc3ViVG8oYSxyKTsgcmV0dXJuIHI7IH1cclxuXHJcbiAgICAvLyAocHVibGljKSB0aGlzICogYVxyXG4gICAgZnVuY3Rpb24gYm5NdWx0aXBseShhKSB7IHZhciByID0gbmJpKCk7IHRoaXMubXVsdGlwbHlUbyhhLHIpOyByZXR1cm4gcjsgfVxyXG5cclxuICAgIC8vIChwdWJsaWMpIHRoaXNeMlxyXG4gICAgZnVuY3Rpb24gYm5TcXVhcmUoKSB7IHZhciByID0gbmJpKCk7IHRoaXMuc3F1YXJlVG8ocik7IHJldHVybiByOyB9XHJcblxyXG4gICAgLy8gKHB1YmxpYykgdGhpcyAvIGFcclxuICAgIGZ1bmN0aW9uIGJuRGl2aWRlKGEpIHsgdmFyIHIgPSBuYmkoKTsgdGhpcy5kaXZSZW1UbyhhLHIsbnVsbCk7IHJldHVybiByOyB9XHJcblxyXG4gICAgLy8gKHB1YmxpYykgdGhpcyAlIGFcclxuICAgIGZ1bmN0aW9uIGJuUmVtYWluZGVyKGEpIHsgdmFyIHIgPSBuYmkoKTsgdGhpcy5kaXZSZW1UbyhhLG51bGwscik7IHJldHVybiByOyB9XHJcblxyXG4gICAgLy8gKHB1YmxpYykgW3RoaXMvYSx0aGlzJWFdXHJcbiAgICBmdW5jdGlvbiBibkRpdmlkZUFuZFJlbWFpbmRlcihhKSB7XHJcbiAgICAgIHZhciBxID0gbmJpKCksIHIgPSBuYmkoKTtcclxuICAgICAgdGhpcy5kaXZSZW1UbyhhLHEscik7XHJcbiAgICAgIHJldHVybiBuZXcgQXJyYXkocSxyKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyAocHJvdGVjdGVkKSB0aGlzICo9IG4sIHRoaXMgPj0gMCwgMSA8IG4gPCBEVlxyXG4gICAgZnVuY3Rpb24gYm5wRE11bHRpcGx5KG4pIHtcclxuICAgICAgdGhpc1t0aGlzLnRdID0gdGhpcy5hbSgwLG4tMSx0aGlzLDAsMCx0aGlzLnQpO1xyXG4gICAgICArK3RoaXMudDtcclxuICAgICAgdGhpcy5jbGFtcCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIChwcm90ZWN0ZWQpIHRoaXMgKz0gbiA8PCB3IHdvcmRzLCB0aGlzID49IDBcclxuICAgIGZ1bmN0aW9uIGJucERBZGRPZmZzZXQobix3KSB7XHJcbiAgICAgIGlmKG4gPT0gMCkgcmV0dXJuO1xyXG4gICAgICB3aGlsZSh0aGlzLnQgPD0gdykgdGhpc1t0aGlzLnQrK10gPSAwO1xyXG4gICAgICB0aGlzW3ddICs9IG47XHJcbiAgICAgIHdoaWxlKHRoaXNbd10gPj0gdGhpcy5EVikge1xyXG4gICAgICAgIHRoaXNbd10gLT0gdGhpcy5EVjtcclxuICAgICAgICBpZigrK3cgPj0gdGhpcy50KSB0aGlzW3RoaXMudCsrXSA9IDA7XHJcbiAgICAgICAgKyt0aGlzW3ddO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQSBcIm51bGxcIiByZWR1Y2VyXHJcbiAgICBmdW5jdGlvbiBOdWxsRXhwKCkge31cclxuICAgIGZ1bmN0aW9uIG5Ob3AoeCkgeyByZXR1cm4geDsgfVxyXG4gICAgZnVuY3Rpb24gbk11bFRvKHgseSxyKSB7IHgubXVsdGlwbHlUbyh5LHIpOyB9XHJcbiAgICBmdW5jdGlvbiBuU3FyVG8oeCxyKSB7IHguc3F1YXJlVG8ocik7IH1cclxuXHJcbiAgICBOdWxsRXhwLnByb3RvdHlwZS5jb252ZXJ0ID0gbk5vcDtcclxuICAgIE51bGxFeHAucHJvdG90eXBlLnJldmVydCA9IG5Ob3A7XHJcbiAgICBOdWxsRXhwLnByb3RvdHlwZS5tdWxUbyA9IG5NdWxUbztcclxuICAgIE51bGxFeHAucHJvdG90eXBlLnNxclRvID0gblNxclRvO1xyXG5cclxuICAgIC8vIChwdWJsaWMpIHRoaXNeZVxyXG4gICAgZnVuY3Rpb24gYm5Qb3coZSkgeyByZXR1cm4gdGhpcy5leHAoZSxuZXcgTnVsbEV4cCgpKTsgfVxyXG5cclxuICAgIC8vIChwcm90ZWN0ZWQpIHIgPSBsb3dlciBuIHdvcmRzIG9mIFwidGhpcyAqIGFcIiwgYS50IDw9IG5cclxuICAgIC8vIFwidGhpc1wiIHNob3VsZCBiZSB0aGUgbGFyZ2VyIG9uZSBpZiBhcHByb3ByaWF0ZS5cclxuICAgIGZ1bmN0aW9uIGJucE11bHRpcGx5TG93ZXJUbyhhLG4scikge1xyXG4gICAgICB2YXIgaSA9IE1hdGgubWluKHRoaXMudCthLnQsbik7XHJcbiAgICAgIHIucyA9IDA7IC8vIGFzc3VtZXMgYSx0aGlzID49IDBcclxuICAgICAgci50ID0gaTtcclxuICAgICAgd2hpbGUoaSA+IDApIHJbLS1pXSA9IDA7XHJcbiAgICAgIHZhciBqO1xyXG4gICAgICBmb3IoaiA9IHIudC10aGlzLnQ7IGkgPCBqOyArK2kpIHJbaSt0aGlzLnRdID0gdGhpcy5hbSgwLGFbaV0scixpLDAsdGhpcy50KTtcclxuICAgICAgZm9yKGogPSBNYXRoLm1pbihhLnQsbik7IGkgPCBqOyArK2kpIHRoaXMuYW0oMCxhW2ldLHIsaSwwLG4taSk7XHJcbiAgICAgIHIuY2xhbXAoKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyAocHJvdGVjdGVkKSByID0gXCJ0aGlzICogYVwiIHdpdGhvdXQgbG93ZXIgbiB3b3JkcywgbiA+IDBcclxuICAgIC8vIFwidGhpc1wiIHNob3VsZCBiZSB0aGUgbGFyZ2VyIG9uZSBpZiBhcHByb3ByaWF0ZS5cclxuICAgIGZ1bmN0aW9uIGJucE11bHRpcGx5VXBwZXJUbyhhLG4scikge1xyXG4gICAgICAtLW47XHJcbiAgICAgIHZhciBpID0gci50ID0gdGhpcy50K2EudC1uO1xyXG4gICAgICByLnMgPSAwOyAvLyBhc3N1bWVzIGEsdGhpcyA+PSAwXHJcbiAgICAgIHdoaWxlKC0taSA+PSAwKSByW2ldID0gMDtcclxuICAgICAgZm9yKGkgPSBNYXRoLm1heChuLXRoaXMudCwwKTsgaSA8IGEudDsgKytpKVxyXG4gICAgICAgIHJbdGhpcy50K2ktbl0gPSB0aGlzLmFtKG4taSxhW2ldLHIsMCwwLHRoaXMudCtpLW4pO1xyXG4gICAgICByLmNsYW1wKCk7XHJcbiAgICAgIHIuZHJTaGlmdFRvKDEscik7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQmFycmV0dCBtb2R1bGFyIHJlZHVjdGlvblxyXG4gICAgZnVuY3Rpb24gQmFycmV0dChtKSB7XHJcbiAgICAgIC8vIHNldHVwIEJhcnJldHRcclxuICAgICAgdGhpcy5yMiA9IG5iaSgpO1xyXG4gICAgICB0aGlzLnEzID0gbmJpKCk7XHJcbiAgICAgIEJpZ0ludGVnZXIuT05FLmRsU2hpZnRUbygyKm0udCx0aGlzLnIyKTtcclxuICAgICAgdGhpcy5tdSA9IHRoaXMucjIuZGl2aWRlKG0pO1xyXG4gICAgICB0aGlzLm0gPSBtO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGJhcnJldHRDb252ZXJ0KHgpIHtcclxuICAgICAgaWYoeC5zIDwgMCB8fCB4LnQgPiAyKnRoaXMubS50KSByZXR1cm4geC5tb2QodGhpcy5tKTtcclxuICAgICAgZWxzZSBpZih4LmNvbXBhcmVUbyh0aGlzLm0pIDwgMCkgcmV0dXJuIHg7XHJcbiAgICAgIGVsc2UgeyB2YXIgciA9IG5iaSgpOyB4LmNvcHlUbyhyKTsgdGhpcy5yZWR1Y2Uocik7IHJldHVybiByOyB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gYmFycmV0dFJldmVydCh4KSB7IHJldHVybiB4OyB9XHJcblxyXG4gICAgLy8geCA9IHggbW9kIG0gKEhBQyAxNC40MilcclxuICAgIGZ1bmN0aW9uIGJhcnJldHRSZWR1Y2UoeCkge1xyXG4gICAgICB4LmRyU2hpZnRUbyh0aGlzLm0udC0xLHRoaXMucjIpO1xyXG4gICAgICBpZih4LnQgPiB0aGlzLm0udCsxKSB7IHgudCA9IHRoaXMubS50KzE7IHguY2xhbXAoKTsgfVxyXG4gICAgICB0aGlzLm11Lm11bHRpcGx5VXBwZXJUbyh0aGlzLnIyLHRoaXMubS50KzEsdGhpcy5xMyk7XHJcbiAgICAgIHRoaXMubS5tdWx0aXBseUxvd2VyVG8odGhpcy5xMyx0aGlzLm0udCsxLHRoaXMucjIpO1xyXG4gICAgICB3aGlsZSh4LmNvbXBhcmVUbyh0aGlzLnIyKSA8IDApIHguZEFkZE9mZnNldCgxLHRoaXMubS50KzEpO1xyXG4gICAgICB4LnN1YlRvKHRoaXMucjIseCk7XHJcbiAgICAgIHdoaWxlKHguY29tcGFyZVRvKHRoaXMubSkgPj0gMCkgeC5zdWJUbyh0aGlzLm0seCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gciA9IHheMiBtb2QgbTsgeCAhPSByXHJcbiAgICBmdW5jdGlvbiBiYXJyZXR0U3FyVG8oeCxyKSB7IHguc3F1YXJlVG8ocik7IHRoaXMucmVkdWNlKHIpOyB9XHJcblxyXG4gICAgLy8gciA9IHgqeSBtb2QgbTsgeCx5ICE9IHJcclxuICAgIGZ1bmN0aW9uIGJhcnJldHRNdWxUbyh4LHkscikgeyB4Lm11bHRpcGx5VG8oeSxyKTsgdGhpcy5yZWR1Y2Uocik7IH1cclxuXHJcbiAgICBCYXJyZXR0LnByb3RvdHlwZS5jb252ZXJ0ID0gYmFycmV0dENvbnZlcnQ7XHJcbiAgICBCYXJyZXR0LnByb3RvdHlwZS5yZXZlcnQgPSBiYXJyZXR0UmV2ZXJ0O1xyXG4gICAgQmFycmV0dC5wcm90b3R5cGUucmVkdWNlID0gYmFycmV0dFJlZHVjZTtcclxuICAgIEJhcnJldHQucHJvdG90eXBlLm11bFRvID0gYmFycmV0dE11bFRvO1xyXG4gICAgQmFycmV0dC5wcm90b3R5cGUuc3FyVG8gPSBiYXJyZXR0U3FyVG87XHJcblxyXG4gICAgLy8gKHB1YmxpYykgdGhpc15lICUgbSAoSEFDIDE0Ljg1KVxyXG4gICAgZnVuY3Rpb24gYm5Nb2RQb3coZSxtKSB7XHJcbiAgICAgIHZhciBpID0gZS5iaXRMZW5ndGgoKSwgaywgciA9IG5idigxKSwgejtcclxuICAgICAgaWYoaSA8PSAwKSByZXR1cm4gcjtcclxuICAgICAgZWxzZSBpZihpIDwgMTgpIGsgPSAxO1xyXG4gICAgICBlbHNlIGlmKGkgPCA0OCkgayA9IDM7XHJcbiAgICAgIGVsc2UgaWYoaSA8IDE0NCkgayA9IDQ7XHJcbiAgICAgIGVsc2UgaWYoaSA8IDc2OCkgayA9IDU7XHJcbiAgICAgIGVsc2UgayA9IDY7XHJcbiAgICAgIGlmKGkgPCA4KVxyXG4gICAgICAgIHogPSBuZXcgQ2xhc3NpYyhtKTtcclxuICAgICAgZWxzZSBpZihtLmlzRXZlbigpKVxyXG4gICAgICAgIHogPSBuZXcgQmFycmV0dChtKTtcclxuICAgICAgZWxzZVxyXG4gICAgICAgIHogPSBuZXcgTW9udGdvbWVyeShtKTtcclxuXHJcbiAgICAgIC8vIHByZWNvbXB1dGF0aW9uXHJcbiAgICAgIHZhciBnID0gbmV3IEFycmF5KCksIG4gPSAzLCBrMSA9IGstMSwga20gPSAoMTw8ayktMTtcclxuICAgICAgZ1sxXSA9IHouY29udmVydCh0aGlzKTtcclxuICAgICAgaWYoayA+IDEpIHtcclxuICAgICAgICB2YXIgZzIgPSBuYmkoKTtcclxuICAgICAgICB6LnNxclRvKGdbMV0sZzIpO1xyXG4gICAgICAgIHdoaWxlKG4gPD0ga20pIHtcclxuICAgICAgICAgIGdbbl0gPSBuYmkoKTtcclxuICAgICAgICAgIHoubXVsVG8oZzIsZ1tuLTJdLGdbbl0pO1xyXG4gICAgICAgICAgbiArPSAyO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgdmFyIGogPSBlLnQtMSwgdywgaXMxID0gdHJ1ZSwgcjIgPSBuYmkoKSwgdDtcclxuICAgICAgaSA9IG5iaXRzKGVbal0pLTE7XHJcbiAgICAgIHdoaWxlKGogPj0gMCkge1xyXG4gICAgICAgIGlmKGkgPj0gazEpIHcgPSAoZVtqXT4+KGktazEpKSZrbTtcclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgIHcgPSAoZVtqXSYoKDE8PChpKzEpKS0xKSk8PChrMS1pKTtcclxuICAgICAgICAgIGlmKGogPiAwKSB3IHw9IGVbai0xXT4+KHRoaXMuREIraS1rMSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBuID0gaztcclxuICAgICAgICB3aGlsZSgodyYxKSA9PSAwKSB7IHcgPj49IDE7IC0tbjsgfVxyXG4gICAgICAgIGlmKChpIC09IG4pIDwgMCkgeyBpICs9IHRoaXMuREI7IC0tajsgfVxyXG4gICAgICAgIGlmKGlzMSkge1x0Ly8gcmV0ID09IDEsIGRvbid0IGJvdGhlciBzcXVhcmluZyBvciBtdWx0aXBseWluZyBpdFxyXG4gICAgICAgICAgZ1t3XS5jb3B5VG8ocik7XHJcbiAgICAgICAgICBpczEgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICB3aGlsZShuID4gMSkgeyB6LnNxclRvKHIscjIpOyB6LnNxclRvKHIyLHIpOyBuIC09IDI7IH1cclxuICAgICAgICAgIGlmKG4gPiAwKSB6LnNxclRvKHIscjIpOyBlbHNlIHsgdCA9IHI7IHIgPSByMjsgcjIgPSB0OyB9XHJcbiAgICAgICAgICB6Lm11bFRvKHIyLGdbd10scik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB3aGlsZShqID49IDAgJiYgKGVbal0mKDE8PGkpKSA9PSAwKSB7XHJcbiAgICAgICAgICB6LnNxclRvKHIscjIpOyB0ID0gcjsgciA9IHIyOyByMiA9IHQ7XHJcbiAgICAgICAgICBpZigtLWkgPCAwKSB7IGkgPSB0aGlzLkRCLTE7IC0tajsgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gei5yZXZlcnQocik7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gKHB1YmxpYykgZ2NkKHRoaXMsYSkgKEhBQyAxNC41NClcclxuICAgIGZ1bmN0aW9uIGJuR0NEKGEpIHtcclxuICAgICAgdmFyIHggPSAodGhpcy5zPDApP3RoaXMubmVnYXRlKCk6dGhpcy5jbG9uZSgpO1xyXG4gICAgICB2YXIgeSA9IChhLnM8MCk/YS5uZWdhdGUoKTphLmNsb25lKCk7XHJcbiAgICAgIGlmKHguY29tcGFyZVRvKHkpIDwgMCkgeyB2YXIgdCA9IHg7IHggPSB5OyB5ID0gdDsgfVxyXG4gICAgICB2YXIgaSA9IHguZ2V0TG93ZXN0U2V0Qml0KCksIGcgPSB5LmdldExvd2VzdFNldEJpdCgpO1xyXG4gICAgICBpZihnIDwgMCkgcmV0dXJuIHg7XHJcbiAgICAgIGlmKGkgPCBnKSBnID0gaTtcclxuICAgICAgaWYoZyA+IDApIHtcclxuICAgICAgICB4LnJTaGlmdFRvKGcseCk7XHJcbiAgICAgICAgeS5yU2hpZnRUbyhnLHkpO1xyXG4gICAgICB9XHJcbiAgICAgIHdoaWxlKHguc2lnbnVtKCkgPiAwKSB7XHJcbiAgICAgICAgaWYoKGkgPSB4LmdldExvd2VzdFNldEJpdCgpKSA+IDApIHguclNoaWZ0VG8oaSx4KTtcclxuICAgICAgICBpZigoaSA9IHkuZ2V0TG93ZXN0U2V0Qml0KCkpID4gMCkgeS5yU2hpZnRUbyhpLHkpO1xyXG4gICAgICAgIGlmKHguY29tcGFyZVRvKHkpID49IDApIHtcclxuICAgICAgICAgIHguc3ViVG8oeSx4KTtcclxuICAgICAgICAgIHguclNoaWZ0VG8oMSx4KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICB5LnN1YlRvKHgseSk7XHJcbiAgICAgICAgICB5LnJTaGlmdFRvKDEseSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGlmKGcgPiAwKSB5LmxTaGlmdFRvKGcseSk7XHJcbiAgICAgIHJldHVybiB5O1xyXG4gICAgfVxyXG5cclxuICAgIC8vIChwcm90ZWN0ZWQpIHRoaXMgJSBuLCBuIDwgMl4yNlxyXG4gICAgZnVuY3Rpb24gYm5wTW9kSW50KG4pIHtcclxuICAgICAgaWYobiA8PSAwKSByZXR1cm4gMDtcclxuICAgICAgdmFyIGQgPSB0aGlzLkRWJW4sIHIgPSAodGhpcy5zPDApP24tMTowO1xyXG4gICAgICBpZih0aGlzLnQgPiAwKVxyXG4gICAgICAgIGlmKGQgPT0gMCkgciA9IHRoaXNbMF0lbjtcclxuICAgICAgICBlbHNlIGZvcih2YXIgaSA9IHRoaXMudC0xOyBpID49IDA7IC0taSkgciA9IChkKnIrdGhpc1tpXSklbjtcclxuICAgICAgcmV0dXJuIHI7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gKHB1YmxpYykgMS90aGlzICUgbSAoSEFDIDE0LjYxKVxyXG4gICAgZnVuY3Rpb24gYm5Nb2RJbnZlcnNlKG0pIHtcclxuICAgICAgdmFyIGFjID0gbS5pc0V2ZW4oKTtcclxuICAgICAgaWYoKHRoaXMuaXNFdmVuKCkgJiYgYWMpIHx8IG0uc2lnbnVtKCkgPT0gMCkgcmV0dXJuIEJpZ0ludGVnZXIuWkVSTztcclxuICAgICAgdmFyIHUgPSBtLmNsb25lKCksIHYgPSB0aGlzLmNsb25lKCk7XHJcbiAgICAgIHZhciBhID0gbmJ2KDEpLCBiID0gbmJ2KDApLCBjID0gbmJ2KDApLCBkID0gbmJ2KDEpO1xyXG4gICAgICB3aGlsZSh1LnNpZ251bSgpICE9IDApIHtcclxuICAgICAgICB3aGlsZSh1LmlzRXZlbigpKSB7XHJcbiAgICAgICAgICB1LnJTaGlmdFRvKDEsdSk7XHJcbiAgICAgICAgICBpZihhYykge1xyXG4gICAgICAgICAgICBpZighYS5pc0V2ZW4oKSB8fCAhYi5pc0V2ZW4oKSkgeyBhLmFkZFRvKHRoaXMsYSk7IGIuc3ViVG8obSxiKTsgfVxyXG4gICAgICAgICAgICBhLnJTaGlmdFRvKDEsYSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBlbHNlIGlmKCFiLmlzRXZlbigpKSBiLnN1YlRvKG0sYik7XHJcbiAgICAgICAgICBiLnJTaGlmdFRvKDEsYik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHdoaWxlKHYuaXNFdmVuKCkpIHtcclxuICAgICAgICAgIHYuclNoaWZ0VG8oMSx2KTtcclxuICAgICAgICAgIGlmKGFjKSB7XHJcbiAgICAgICAgICAgIGlmKCFjLmlzRXZlbigpIHx8ICFkLmlzRXZlbigpKSB7IGMuYWRkVG8odGhpcyxjKTsgZC5zdWJUbyhtLGQpOyB9XHJcbiAgICAgICAgICAgIGMuclNoaWZ0VG8oMSxjKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGVsc2UgaWYoIWQuaXNFdmVuKCkpIGQuc3ViVG8obSxkKTtcclxuICAgICAgICAgIGQuclNoaWZ0VG8oMSxkKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodS5jb21wYXJlVG8odikgPj0gMCkge1xyXG4gICAgICAgICAgdS5zdWJUbyh2LHUpO1xyXG4gICAgICAgICAgaWYoYWMpIGEuc3ViVG8oYyxhKTtcclxuICAgICAgICAgIGIuc3ViVG8oZCxiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICB2LnN1YlRvKHUsdik7XHJcbiAgICAgICAgICBpZihhYykgYy5zdWJUbyhhLGMpO1xyXG4gICAgICAgICAgZC5zdWJUbyhiLGQpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBpZih2LmNvbXBhcmVUbyhCaWdJbnRlZ2VyLk9ORSkgIT0gMCkgcmV0dXJuIEJpZ0ludGVnZXIuWkVSTztcclxuICAgICAgaWYoZC5jb21wYXJlVG8obSkgPj0gMCkgcmV0dXJuIGQuc3VidHJhY3QobSk7XHJcbiAgICAgIGlmKGQuc2lnbnVtKCkgPCAwKSBkLmFkZFRvKG0sZCk7IGVsc2UgcmV0dXJuIGQ7XHJcbiAgICAgIGlmKGQuc2lnbnVtKCkgPCAwKSByZXR1cm4gZC5hZGQobSk7IGVsc2UgcmV0dXJuIGQ7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGxvd3ByaW1lcyA9IFsyLDMsNSw3LDExLDEzLDE3LDE5LDIzLDI5LDMxLDM3LDQxLDQzLDQ3LDUzLDU5LDYxLDY3LDcxLDczLDc5LDgzLDg5LDk3LDEwMSwxMDMsMTA3LDEwOSwxMTMsMTI3LDEzMSwxMzcsMTM5LDE0OSwxNTEsMTU3LDE2MywxNjcsMTczLDE3OSwxODEsMTkxLDE5MywxOTcsMTk5LDIxMSwyMjMsMjI3LDIyOSwyMzMsMjM5LDI0MSwyNTEsMjU3LDI2MywyNjksMjcxLDI3NywyODEsMjgzLDI5MywzMDcsMzExLDMxMywzMTcsMzMxLDMzNywzNDcsMzQ5LDM1MywzNTksMzY3LDM3MywzNzksMzgzLDM4OSwzOTcsNDAxLDQwOSw0MTksNDIxLDQzMSw0MzMsNDM5LDQ0Myw0NDksNDU3LDQ2MSw0NjMsNDY3LDQ3OSw0ODcsNDkxLDQ5OSw1MDMsNTA5LDUyMSw1MjMsNTQxLDU0Nyw1NTcsNTYzLDU2OSw1NzEsNTc3LDU4Nyw1OTMsNTk5LDYwMSw2MDcsNjEzLDYxNyw2MTksNjMxLDY0MSw2NDMsNjQ3LDY1Myw2NTksNjYxLDY3Myw2NzcsNjgzLDY5MSw3MDEsNzA5LDcxOSw3MjcsNzMzLDczOSw3NDMsNzUxLDc1Nyw3NjEsNzY5LDc3Myw3ODcsNzk3LDgwOSw4MTEsODIxLDgyMyw4MjcsODI5LDgzOSw4NTMsODU3LDg1OSw4NjMsODc3LDg4MSw4ODMsODg3LDkwNyw5MTEsOTE5LDkyOSw5MzcsOTQxLDk0Nyw5NTMsOTY3LDk3MSw5NzcsOTgzLDk5MSw5OTddO1xyXG4gICAgdmFyIGxwbGltID0gKDE8PDI2KS9sb3dwcmltZXNbbG93cHJpbWVzLmxlbmd0aC0xXTtcclxuXHJcbiAgICAvLyAocHVibGljKSB0ZXN0IHByaW1hbGl0eSB3aXRoIGNlcnRhaW50eSA+PSAxLS41XnRcclxuICAgIGZ1bmN0aW9uIGJuSXNQcm9iYWJsZVByaW1lKHQpIHtcclxuICAgICAgdmFyIGksIHggPSB0aGlzLmFicygpO1xyXG4gICAgICBpZih4LnQgPT0gMSAmJiB4WzBdIDw9IGxvd3ByaW1lc1tsb3dwcmltZXMubGVuZ3RoLTFdKSB7XHJcbiAgICAgICAgZm9yKGkgPSAwOyBpIDwgbG93cHJpbWVzLmxlbmd0aDsgKytpKVxyXG4gICAgICAgICAgaWYoeFswXSA9PSBsb3dwcmltZXNbaV0pIHJldHVybiB0cnVlO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgfVxyXG4gICAgICBpZih4LmlzRXZlbigpKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgIGkgPSAxO1xyXG4gICAgICB3aGlsZShpIDwgbG93cHJpbWVzLmxlbmd0aCkge1xyXG4gICAgICAgIHZhciBtID0gbG93cHJpbWVzW2ldLCBqID0gaSsxO1xyXG4gICAgICAgIHdoaWxlKGogPCBsb3dwcmltZXMubGVuZ3RoICYmIG0gPCBscGxpbSkgbSAqPSBsb3dwcmltZXNbaisrXTtcclxuICAgICAgICBtID0geC5tb2RJbnQobSk7XHJcbiAgICAgICAgd2hpbGUoaSA8IGopIGlmKG0lbG93cHJpbWVzW2krK10gPT0gMCkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiB4Lm1pbGxlclJhYmluKHQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIChwcm90ZWN0ZWQpIHRydWUgaWYgcHJvYmFibHkgcHJpbWUgKEhBQyA0LjI0LCBNaWxsZXItUmFiaW4pXHJcbiAgICBmdW5jdGlvbiBibnBNaWxsZXJSYWJpbih0KSB7XHJcbiAgICAgIHZhciBuMSA9IHRoaXMuc3VidHJhY3QoQmlnSW50ZWdlci5PTkUpO1xyXG4gICAgICB2YXIgayA9IG4xLmdldExvd2VzdFNldEJpdCgpO1xyXG4gICAgICBpZihrIDw9IDApIHJldHVybiBmYWxzZTtcclxuICAgICAgdmFyIHIgPSBuMS5zaGlmdFJpZ2h0KGspO1xyXG4gICAgICB0ID0gKHQrMSk+PjE7XHJcbiAgICAgIGlmKHQgPiBsb3dwcmltZXMubGVuZ3RoKSB0ID0gbG93cHJpbWVzLmxlbmd0aDtcclxuICAgICAgdmFyIGEgPSBuYmkoKTtcclxuICAgICAgZm9yKHZhciBpID0gMDsgaSA8IHQ7ICsraSkge1xyXG4gICAgICAgIC8vUGljayBiYXNlcyBhdCByYW5kb20sIGluc3RlYWQgb2Ygc3RhcnRpbmcgYXQgMlxyXG4gICAgICAgIGEuZnJvbUludChsb3dwcmltZXNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpKmxvd3ByaW1lcy5sZW5ndGgpXSk7XHJcbiAgICAgICAgdmFyIHkgPSBhLm1vZFBvdyhyLHRoaXMpO1xyXG4gICAgICAgIGlmKHkuY29tcGFyZVRvKEJpZ0ludGVnZXIuT05FKSAhPSAwICYmIHkuY29tcGFyZVRvKG4xKSAhPSAwKSB7XHJcbiAgICAgICAgICB2YXIgaiA9IDE7XHJcbiAgICAgICAgICB3aGlsZShqKysgPCBrICYmIHkuY29tcGFyZVRvKG4xKSAhPSAwKSB7XHJcbiAgICAgICAgICAgIHkgPSB5Lm1vZFBvd0ludCgyLHRoaXMpO1xyXG4gICAgICAgICAgICBpZih5LmNvbXBhcmVUbyhCaWdJbnRlZ2VyLk9ORSkgPT0gMCkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYoeS5jb21wYXJlVG8objEpICE9IDApIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gcHJvdGVjdGVkXHJcbiAgICBCaWdJbnRlZ2VyLnByb3RvdHlwZS5jaHVua1NpemUgPSBibnBDaHVua1NpemU7XHJcbiAgICBCaWdJbnRlZ2VyLnByb3RvdHlwZS50b1JhZGl4ID0gYm5wVG9SYWRpeDtcclxuICAgIEJpZ0ludGVnZXIucHJvdG90eXBlLmZyb21SYWRpeCA9IGJucEZyb21SYWRpeDtcclxuICAgIEJpZ0ludGVnZXIucHJvdG90eXBlLmZyb21OdW1iZXIgPSBibnBGcm9tTnVtYmVyO1xyXG4gICAgQmlnSW50ZWdlci5wcm90b3R5cGUuYml0d2lzZVRvID0gYm5wQml0d2lzZVRvO1xyXG4gICAgQmlnSW50ZWdlci5wcm90b3R5cGUuY2hhbmdlQml0ID0gYm5wQ2hhbmdlQml0O1xyXG4gICAgQmlnSW50ZWdlci5wcm90b3R5cGUuYWRkVG8gPSBibnBBZGRUbztcclxuICAgIEJpZ0ludGVnZXIucHJvdG90eXBlLmRNdWx0aXBseSA9IGJucERNdWx0aXBseTtcclxuICAgIEJpZ0ludGVnZXIucHJvdG90eXBlLmRBZGRPZmZzZXQgPSBibnBEQWRkT2Zmc2V0O1xyXG4gICAgQmlnSW50ZWdlci5wcm90b3R5cGUubXVsdGlwbHlMb3dlclRvID0gYm5wTXVsdGlwbHlMb3dlclRvO1xyXG4gICAgQmlnSW50ZWdlci5wcm90b3R5cGUubXVsdGlwbHlVcHBlclRvID0gYm5wTXVsdGlwbHlVcHBlclRvO1xyXG4gICAgQmlnSW50ZWdlci5wcm90b3R5cGUubW9kSW50ID0gYm5wTW9kSW50O1xyXG4gICAgQmlnSW50ZWdlci5wcm90b3R5cGUubWlsbGVyUmFiaW4gPSBibnBNaWxsZXJSYWJpbjtcclxuXHJcbiAgICAvLyBwdWJsaWNcclxuICAgIEJpZ0ludGVnZXIucHJvdG90eXBlLmNsb25lID0gYm5DbG9uZTtcclxuICAgIEJpZ0ludGVnZXIucHJvdG90eXBlLmludFZhbHVlID0gYm5JbnRWYWx1ZTtcclxuICAgIEJpZ0ludGVnZXIucHJvdG90eXBlLmJ5dGVWYWx1ZSA9IGJuQnl0ZVZhbHVlO1xyXG4gICAgQmlnSW50ZWdlci5wcm90b3R5cGUuc2hvcnRWYWx1ZSA9IGJuU2hvcnRWYWx1ZTtcclxuICAgIEJpZ0ludGVnZXIucHJvdG90eXBlLnNpZ251bSA9IGJuU2lnTnVtO1xyXG4gICAgQmlnSW50ZWdlci5wcm90b3R5cGUudG9CeXRlQXJyYXkgPSBiblRvQnl0ZUFycmF5O1xyXG4gICAgQmlnSW50ZWdlci5wcm90b3R5cGUuZXF1YWxzID0gYm5FcXVhbHM7XHJcbiAgICBCaWdJbnRlZ2VyLnByb3RvdHlwZS5taW4gPSBibk1pbjtcclxuICAgIEJpZ0ludGVnZXIucHJvdG90eXBlLm1heCA9IGJuTWF4O1xyXG4gICAgQmlnSW50ZWdlci5wcm90b3R5cGUuYW5kID0gYm5BbmQ7XHJcbiAgICBCaWdJbnRlZ2VyLnByb3RvdHlwZS5vciA9IGJuT3I7XHJcbiAgICBCaWdJbnRlZ2VyLnByb3RvdHlwZS54b3IgPSBiblhvcjtcclxuICAgIEJpZ0ludGVnZXIucHJvdG90eXBlLmFuZE5vdCA9IGJuQW5kTm90O1xyXG4gICAgQmlnSW50ZWdlci5wcm90b3R5cGUubm90ID0gYm5Ob3Q7XHJcbiAgICBCaWdJbnRlZ2VyLnByb3RvdHlwZS5zaGlmdExlZnQgPSBiblNoaWZ0TGVmdDtcclxuICAgIEJpZ0ludGVnZXIucHJvdG90eXBlLnNoaWZ0UmlnaHQgPSBiblNoaWZ0UmlnaHQ7XHJcbiAgICBCaWdJbnRlZ2VyLnByb3RvdHlwZS5nZXRMb3dlc3RTZXRCaXQgPSBibkdldExvd2VzdFNldEJpdDtcclxuICAgIEJpZ0ludGVnZXIucHJvdG90eXBlLmJpdENvdW50ID0gYm5CaXRDb3VudDtcclxuICAgIEJpZ0ludGVnZXIucHJvdG90eXBlLnRlc3RCaXQgPSBiblRlc3RCaXQ7XHJcbiAgICBCaWdJbnRlZ2VyLnByb3RvdHlwZS5zZXRCaXQgPSBiblNldEJpdDtcclxuICAgIEJpZ0ludGVnZXIucHJvdG90eXBlLmNsZWFyQml0ID0gYm5DbGVhckJpdDtcclxuICAgIEJpZ0ludGVnZXIucHJvdG90eXBlLmZsaXBCaXQgPSBibkZsaXBCaXQ7XHJcbiAgICBCaWdJbnRlZ2VyLnByb3RvdHlwZS5hZGQgPSBibkFkZDtcclxuICAgIEJpZ0ludGVnZXIucHJvdG90eXBlLnN1YnRyYWN0ID0gYm5TdWJ0cmFjdDtcclxuICAgIEJpZ0ludGVnZXIucHJvdG90eXBlLm11bHRpcGx5ID0gYm5NdWx0aXBseTtcclxuICAgIEJpZ0ludGVnZXIucHJvdG90eXBlLmRpdmlkZSA9IGJuRGl2aWRlO1xyXG4gICAgQmlnSW50ZWdlci5wcm90b3R5cGUucmVtYWluZGVyID0gYm5SZW1haW5kZXI7XHJcbiAgICBCaWdJbnRlZ2VyLnByb3RvdHlwZS5kaXZpZGVBbmRSZW1haW5kZXIgPSBibkRpdmlkZUFuZFJlbWFpbmRlcjtcclxuICAgIEJpZ0ludGVnZXIucHJvdG90eXBlLm1vZFBvdyA9IGJuTW9kUG93O1xyXG4gICAgQmlnSW50ZWdlci5wcm90b3R5cGUubW9kSW52ZXJzZSA9IGJuTW9kSW52ZXJzZTtcclxuICAgIEJpZ0ludGVnZXIucHJvdG90eXBlLnBvdyA9IGJuUG93O1xyXG4gICAgQmlnSW50ZWdlci5wcm90b3R5cGUuZ2NkID0gYm5HQ0Q7XHJcbiAgICBCaWdJbnRlZ2VyLnByb3RvdHlwZS5pc1Byb2JhYmxlUHJpbWUgPSBibklzUHJvYmFibGVQcmltZTtcclxuXHJcbiAgICAvLyBKU0JOLXNwZWNpZmljIGV4dGVuc2lvblxyXG4gICAgQmlnSW50ZWdlci5wcm90b3R5cGUuc3F1YXJlID0gYm5TcXVhcmU7XHJcblxyXG4gICAgLy8gRXhwb3NlIHRoZSBCYXJyZXR0IGZ1bmN0aW9uXHJcbiAgICBCaWdJbnRlZ2VyLnByb3RvdHlwZS5CYXJyZXR0ID0gQmFycmV0dFxyXG5cclxuICAgIC8vIEJpZ0ludGVnZXIgaW50ZXJmYWNlcyBub3QgaW1wbGVtZW50ZWQgaW4ganNibjpcclxuXHJcbiAgICAvLyBCaWdJbnRlZ2VyKGludCBzaWdudW0sIGJ5dGVbXSBtYWduaXR1ZGUpXHJcbiAgICAvLyBkb3VibGUgZG91YmxlVmFsdWUoKVxyXG4gICAgLy8gZmxvYXQgZmxvYXRWYWx1ZSgpXHJcbiAgICAvLyBpbnQgaGFzaENvZGUoKVxyXG4gICAgLy8gbG9uZyBsb25nVmFsdWUoKVxyXG4gICAgLy8gc3RhdGljIEJpZ0ludGVnZXIgdmFsdWVPZihsb25nIHZhbClcclxuXHJcblx0Ly8gUmFuZG9tIG51bWJlciBnZW5lcmF0b3IgLSByZXF1aXJlcyBhIFBSTkcgYmFja2VuZCwgZS5nLiBwcm5nNC5qc1xyXG5cclxuXHQvLyBGb3IgYmVzdCByZXN1bHRzLCBwdXQgY29kZSBsaWtlXHJcblx0Ly8gPGJvZHkgb25DbGljaz0ncm5nX3NlZWRfdGltZSgpOycgb25LZXlQcmVzcz0ncm5nX3NlZWRfdGltZSgpOyc+XHJcblx0Ly8gaW4geW91ciBtYWluIEhUTUwgZG9jdW1lbnQuXHJcblxyXG5cdHZhciBybmdfc3RhdGU7XHJcblx0dmFyIHJuZ19wb29sO1xyXG5cdHZhciBybmdfcHB0cjtcclxuXHJcblx0Ly8gTWl4IGluIGEgMzItYml0IGludGVnZXIgaW50byB0aGUgcG9vbFxyXG5cdGZ1bmN0aW9uIHJuZ19zZWVkX2ludCh4KSB7XHJcblx0ICBybmdfcG9vbFtybmdfcHB0cisrXSBePSB4ICYgMjU1O1xyXG5cdCAgcm5nX3Bvb2xbcm5nX3BwdHIrK10gXj0gKHggPj4gOCkgJiAyNTU7XHJcblx0ICBybmdfcG9vbFtybmdfcHB0cisrXSBePSAoeCA+PiAxNikgJiAyNTU7XHJcblx0ICBybmdfcG9vbFtybmdfcHB0cisrXSBePSAoeCA+PiAyNCkgJiAyNTU7XHJcblx0ICBpZihybmdfcHB0ciA+PSBybmdfcHNpemUpIHJuZ19wcHRyIC09IHJuZ19wc2l6ZTtcclxuXHR9XHJcblxyXG5cdC8vIE1peCBpbiB0aGUgY3VycmVudCB0aW1lICh3L21pbGxpc2Vjb25kcykgaW50byB0aGUgcG9vbFxyXG5cdGZ1bmN0aW9uIHJuZ19zZWVkX3RpbWUoKSB7XHJcblx0ICBybmdfc2VlZF9pbnQobmV3IERhdGUoKS5nZXRUaW1lKCkpO1xyXG5cdH1cclxuXHJcblx0Ly8gSW5pdGlhbGl6ZSB0aGUgcG9vbCB3aXRoIGp1bmsgaWYgbmVlZGVkLlxyXG5cdGlmKHJuZ19wb29sID09IG51bGwpIHtcclxuXHQgIHJuZ19wb29sID0gbmV3IEFycmF5KCk7XHJcblx0ICBybmdfcHB0ciA9IDA7XHJcblx0ICB2YXIgdDtcclxuXHQgIGlmKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgJiYgd2luZG93LmNyeXB0bykge1xyXG5cdFx0aWYgKHdpbmRvdy5jcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKSB7XHJcblx0XHQgIC8vIFVzZSB3ZWJjcnlwdG8gaWYgYXZhaWxhYmxlXHJcblx0XHQgIHZhciB1YSA9IG5ldyBVaW50OEFycmF5KDMyKTtcclxuXHRcdCAgd2luZG93LmNyeXB0by5nZXRSYW5kb21WYWx1ZXModWEpO1xyXG5cdFx0ICBmb3IodCA9IDA7IHQgPCAzMjsgKyt0KVxyXG5cdFx0XHRybmdfcG9vbFtybmdfcHB0cisrXSA9IHVhW3RdO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSBpZihuYXZpZ2F0b3IuYXBwTmFtZSA9PSBcIk5ldHNjYXBlXCIgJiYgbmF2aWdhdG9yLmFwcFZlcnNpb24gPCBcIjVcIikge1xyXG5cdFx0ICAvLyBFeHRyYWN0IGVudHJvcHkgKDI1NiBiaXRzKSBmcm9tIE5TNCBSTkcgaWYgYXZhaWxhYmxlXHJcblx0XHQgIHZhciB6ID0gd2luZG93LmNyeXB0by5yYW5kb20oMzIpO1xyXG5cdFx0ICBmb3IodCA9IDA7IHQgPCB6Lmxlbmd0aDsgKyt0KVxyXG5cdFx0XHRybmdfcG9vbFtybmdfcHB0cisrXSA9IHouY2hhckNvZGVBdCh0KSAmIDI1NTtcclxuXHRcdH1cclxuXHQgIH1cclxuXHQgIHdoaWxlKHJuZ19wcHRyIDwgcm5nX3BzaXplKSB7ICAvLyBleHRyYWN0IHNvbWUgcmFuZG9tbmVzcyBmcm9tIE1hdGgucmFuZG9tKClcclxuXHRcdHQgPSBNYXRoLmZsb29yKDY1NTM2ICogTWF0aC5yYW5kb20oKSk7XHJcblx0XHRybmdfcG9vbFtybmdfcHB0cisrXSA9IHQgPj4+IDg7XHJcblx0XHRybmdfcG9vbFtybmdfcHB0cisrXSA9IHQgJiAyNTU7XHJcblx0ICB9XHJcblx0ICBybmdfcHB0ciA9IDA7XHJcblx0ICBybmdfc2VlZF90aW1lKCk7XHJcblx0ICAvL3JuZ19zZWVkX2ludCh3aW5kb3cuc2NyZWVuWCk7XHJcblx0ICAvL3JuZ19zZWVkX2ludCh3aW5kb3cuc2NyZWVuWSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBybmdfZ2V0X2J5dGUoKSB7XHJcblx0ICBpZihybmdfc3RhdGUgPT0gbnVsbCkge1xyXG5cdFx0cm5nX3NlZWRfdGltZSgpO1xyXG5cdFx0cm5nX3N0YXRlID0gcHJuZ19uZXdzdGF0ZSgpO1xyXG5cdFx0cm5nX3N0YXRlLmluaXQocm5nX3Bvb2wpO1xyXG5cdFx0Zm9yKHJuZ19wcHRyID0gMDsgcm5nX3BwdHIgPCBybmdfcG9vbC5sZW5ndGg7ICsrcm5nX3BwdHIpXHJcblx0XHQgIHJuZ19wb29sW3JuZ19wcHRyXSA9IDA7XHJcblx0XHRybmdfcHB0ciA9IDA7XHJcblx0XHQvL3JuZ19wb29sID0gbnVsbDtcclxuXHQgIH1cclxuXHQgIC8vIFRPRE86IGFsbG93IHJlc2VlZGluZyBhZnRlciBmaXJzdCByZXF1ZXN0XHJcblx0ICByZXR1cm4gcm5nX3N0YXRlLm5leHQoKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHJuZ19nZXRfYnl0ZXMoYmEpIHtcclxuXHQgIHZhciBpO1xyXG5cdCAgZm9yKGkgPSAwOyBpIDwgYmEubGVuZ3RoOyArK2kpIGJhW2ldID0gcm5nX2dldF9ieXRlKCk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBTZWN1cmVSYW5kb20oKSB7fVxyXG5cclxuXHRTZWN1cmVSYW5kb20ucHJvdG90eXBlLm5leHRCeXRlcyA9IHJuZ19nZXRfYnl0ZXM7XHJcblxyXG5cdC8vIHBybmc0LmpzIC0gdXNlcyBBcmNmb3VyIGFzIGEgUFJOR1xyXG5cclxuXHRmdW5jdGlvbiBBcmNmb3VyKCkge1xyXG5cdCAgdGhpcy5pID0gMDtcclxuXHQgIHRoaXMuaiA9IDA7XHJcblx0ICB0aGlzLlMgPSBuZXcgQXJyYXkoKTtcclxuXHR9XHJcblxyXG5cdC8vIEluaXRpYWxpemUgYXJjZm91ciBjb250ZXh0IGZyb20ga2V5LCBhbiBhcnJheSBvZiBpbnRzLCBlYWNoIGZyb20gWzAuLjI1NV1cclxuXHRmdW5jdGlvbiBBUkM0aW5pdChrZXkpIHtcclxuXHQgIHZhciBpLCBqLCB0O1xyXG5cdCAgZm9yKGkgPSAwOyBpIDwgMjU2OyArK2kpXHJcblx0XHR0aGlzLlNbaV0gPSBpO1xyXG5cdCAgaiA9IDA7XHJcblx0ICBmb3IoaSA9IDA7IGkgPCAyNTY7ICsraSkge1xyXG5cdFx0aiA9IChqICsgdGhpcy5TW2ldICsga2V5W2kgJSBrZXkubGVuZ3RoXSkgJiAyNTU7XHJcblx0XHR0ID0gdGhpcy5TW2ldO1xyXG5cdFx0dGhpcy5TW2ldID0gdGhpcy5TW2pdO1xyXG5cdFx0dGhpcy5TW2pdID0gdDtcclxuXHQgIH1cclxuXHQgIHRoaXMuaSA9IDA7XHJcblx0ICB0aGlzLmogPSAwO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gQVJDNG5leHQoKSB7XHJcblx0ICB2YXIgdDtcclxuXHQgIHRoaXMuaSA9ICh0aGlzLmkgKyAxKSAmIDI1NTtcclxuXHQgIHRoaXMuaiA9ICh0aGlzLmogKyB0aGlzLlNbdGhpcy5pXSkgJiAyNTU7XHJcblx0ICB0ID0gdGhpcy5TW3RoaXMuaV07XHJcblx0ICB0aGlzLlNbdGhpcy5pXSA9IHRoaXMuU1t0aGlzLmpdO1xyXG5cdCAgdGhpcy5TW3RoaXMual0gPSB0O1xyXG5cdCAgcmV0dXJuIHRoaXMuU1sodCArIHRoaXMuU1t0aGlzLmldKSAmIDI1NV07XHJcblx0fVxyXG5cclxuXHRBcmNmb3VyLnByb3RvdHlwZS5pbml0ID0gQVJDNGluaXQ7XHJcblx0QXJjZm91ci5wcm90b3R5cGUubmV4dCA9IEFSQzRuZXh0O1xyXG5cclxuXHQvLyBQbHVnIGluIHlvdXIgUk5HIGNvbnN0cnVjdG9yIGhlcmVcclxuXHRmdW5jdGlvbiBwcm5nX25ld3N0YXRlKCkge1xyXG5cdCAgcmV0dXJuIG5ldyBBcmNmb3VyKCk7XHJcblx0fVxyXG5cclxuXHQvLyBQb29sIHNpemUgbXVzdCBiZSBhIG11bHRpcGxlIG9mIDQgYW5kIGdyZWF0ZXIgdGhhbiAzMi5cclxuXHQvLyBBbiBhcnJheSBvZiBieXRlcyB0aGUgc2l6ZSBvZiB0aGUgcG9vbCB3aWxsIGJlIHBhc3NlZCB0byBpbml0KClcclxuXHR2YXIgcm5nX3BzaXplID0gMjU2O1xyXG5cclxuICBCaWdJbnRlZ2VyLlNlY3VyZVJhbmRvbSA9IFNlY3VyZVJhbmRvbTtcclxuICBCaWdJbnRlZ2VyLkJpZ0ludGVnZXIgPSBCaWdJbnRlZ2VyO1xyXG4gIGlmICh0eXBlb2YgZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgIGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IEJpZ0ludGVnZXI7XHJcbiAgfSBlbHNlIHtcclxuICAgIHRoaXMuQmlnSW50ZWdlciA9IEJpZ0ludGVnZXI7XHJcbiAgICB0aGlzLlNlY3VyZVJhbmRvbSA9IFNlY3VyZVJhbmRvbTtcclxuICB9XHJcblxyXG59KS5jYWxsKHRoaXMpO1xyXG4iXSwic291cmNlUm9vdCI6IiJ9