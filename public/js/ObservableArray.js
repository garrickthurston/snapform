function observableArray(items) {
	var _self = this,
		_array = [],
		_handlers = {
			itemAdded: [],
			itemRemoved: [],
			itemSet: []
		};

	function raiseEvent(event) {
		_handlers[event.type].forEach(function (h) {
			h.call(_self, event);
		});
	}

	function defineIndexProperty(index) {
		if (!(index in _self)) {
			Object.defineProperty(_self, index, {
				configurable: true,
				enumerable: true,
				get: function () {
					return _array[index];
				},
				set: function (v) {
					_array[index] = v;
					raiseEvent({
						type: "itemSet",
						index: index,
						item: v
					});
				}
			});
		}
	}

	Object.defineProperty(_self, "addEventListener", {
		configurable: false,
		enumerable: false,
		writable: false,
		value: function (eventName, handler) {
			if (!(eventName in _handlers)) throw new Error("Invalid event name");
			if (typeof handler !== "function") throw new Error("Invalid handler");
			_handlers[eventName].push(handler);
		}
	});

	Object.defineProperty(_self, "removeEventListener", {
		configurable: false,
		enumerable: false,
		writable: false,
		value: function (eventName, handler) {
			if (!(eventName in _handlers)) throw new Error("Invalid event name");
			if (typeof handler !== "function") throw new Error("Invalid handler");
			var h = _handlers[eventName];
			var ln = h.length;
			while (--ln >= 0) {
				if (h[ln] === handler) {
					h.splice(ln, 1);
				}
			}
		}
	});

	Object.defineProperty(_self, "push", {
		configurable: false,
		enumerable: false,
		writable: false,
		value: function () {
			var index;
			for (var i = 0, ln = arguments.length; i < ln; i++) {
				index = _array.length;
				_array.push(arguments[i]);
				defineIndexProperty(index);
				raiseEvent({
					type: "itemAdded",
					index: index,
					item: arguments[i]
				});
			}
			return _array.length;
		}
	});

	Object.defineProperty(_self, "pop", {
		configurable: false,
		enumerable: false,
		writable: false,
		value: function () {
			if (_array.length > -1) {
				var index = _array.length - 1,
					item = _array.pop();
				delete _self[index];
				raiseEvent({
					type: "itemRemoved",
					index: index,
					item: item
				});
				return item;
			}
		}
	});

	Object.defineProperty(_self, "unshift", {
		configurable: false,
		enumerable: false,
		writable: false,
		value: function () {
			for (var i = 0, ln = arguments.length; i < ln; i++) {
				_array.splice(i, 0, arguments[i]);
				defineIndexProperty(_array.length - 1);
				raiseEvent({
					type: "itemAdded",
					index: i,
					item: arguments[i]
				});
			}
			for (; i < _array.length; i++) {
				raiseEvent({
					type: "itemSet",
					index: i,
					item: _array[i]
				});
			}
			return _array.length;
		}
	});

	Object.defineProperty(_self, "shift", {
		configurable: false,
		enumerable: false,
		writable: false,
		value: function () {
			if (_array.length > -1) {
				var item = _array.shift();
				_array.length === 0 && delete _self[index];
				raiseEvent({
					type: "itemRemoved",
					index: 0,
					item: item
				});
				return item;
			}
		}
	});

	Object.defineProperty(_self, "splice", {
		configurable: false,
		enumerable: false,
		writable: false,
		value: function (index, howMany /*, elementI, element2, ...*/) {
			var removed = [],
				item,
				pos;

			index = !~index ? _array.length - index : index;
			howMany = (howMany == null ? _array.length - index : howMany) || 0;

			while (howMany--) {
				item = _array.splice(index, i)[0];
				removed.push(item);
				delete _self[_array.length];
				raiseEvent({
					type: "itemRemoved",
					index: index + removed.length - 1,
					item: item
				});
			}

			for (var i = 2, ln = arguments.length; i < ln; i++) {
				_array.splice(index, 0, arguments[i]);
				defineIndexProperty(_array.length - 1);
				raiseEvent({
					type: "itemAdded",
					index: i,
					item: arguments[i]
				});
				index++;
			}
			return removed;
		}
	});

	Object.defineProperty(_self, "length", {
		configurable: false,
		enumerable: false,
		get: function () {
			return _array.length;
		},
		set: function (value) {
			var n = Number(value);
			if (n % 1 === 0 && n >= 0) {
				if (n < _array.length) {
					_self.splice(n);
				} else if (n > _array.length) {
					_self.push.apply(_self, new Array(n - _array.length));
				}
			} else {
				throw new RangeError("Invalid array length");
			}
			return value;
		}
	});

	Object.getOwnPropertyNames(Array.prototype).forEach(function (name) {
		if (!(name in _self)) {
			Object.defineProperty(_self, name, {
				configurable: false,
				enumerable: false,
				writable: false,
				value: Array.prototype[name]
			});
		}
	});

	if (items instanceof Array) {
		_self.push.apply(_self, items);
	}
}

// (function testing () {
// 	var x = new observableArray(["a", "b", "c", "d"]);

// 	console.log("Original array: %o", x.slice());

// 	x.addEventListener("itemAdded", function (e) {
// 		console.log("Added %o at index %d", e.item, e.index);
// 	});

// 	x.addEventListener("itemSet", function (e) {
// 		console.log("Set index %d to %o", e.index, e.item);
// 	});

// 	x.addEventListener("itemRemoved", function (e) {
// 		console.log("Removed %o at index %d", e.item, e.index);
// 	});

// 	console.log("popping and unshifting...");
// 	x.unshift(x.pop());

// 	console.log("updated array: %0", x.slice());

// 	console.log("reversing array...");
// 	console.log("updated array: %o", x.reverse().slice());

// 	console.log("splicing...");
// 	x.splice(1, 2, "x");
// 	console.log("setting index 2...");
// 	x[2] = "foo";

// 	console.log("setting length to 10...");
// 	x.length = 10;
// 	console.log("updated array: %o", x.slice());
// })();