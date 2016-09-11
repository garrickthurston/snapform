var closest = function(el, fn) {
    return el && (
        fn(el) ? el : closest(el.parentNode, fn)
    );
};

var grep = function(items, callback) {
    var filtered = [],
        len = items.length,
        i = 0;
    for (i; i < len; i++) {
        var item = items[i];
        var cond = callback(item);
        if (cond) {
            filtered.push(item);
        }
    }

    return filtered;
};

var closestFloorOrCeil = function (num, interval) {
	return Math.round(num / interval) * interval;
};