//closest parent that meets callback
var closest = function(el, fn) {
    return el && (
        fn(el) ? el : closest(el.parentNode, fn)
    );
};

// grep
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

// rounder
var closestFloorOrCeil = function (num, interval) {
	return Math.round(num / interval) * interval;
};

//Finds y value of given object
function findPosY(obj) {
    var curtop = 0;
    if (obj.offsetParent) {
        do {
            curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
        return [curtop];
    }
}

//Finds x value of given object
function findPosX(obj) {
    var curtop = 0;
    if (obj.offsetParent) {
        do {
            curtop += obj.offsetLeft;
        } while (obj = obj.offsetParent);
        return [curtop];
    }
}