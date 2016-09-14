// POTENTIAL ENHANCEMENTS:
// -instead of on giant canvas, make each cell a canvas so as to not restroke on mouseover, but perhaps addclass or something else?
// -OOOO canvas's in CHUNKS. like 200px pieces? the smaller the screen gets (the lest there is to re-render) the more response we get
// 	or even btter 5 or 10 times cellwidth/cellheight
// -also give option to set cellWidth/cellHeight - chances are doggies dont need as small as youre going

var model = {
	rects: [],
	// set size of cell
	cellWidth:  80,
	cellHeight: 40,
	panelTarget: "",
	init: function () {
		//var c = document.getElementById('t');
		//if (c) c.parentNode.removeChild(t);
		var t = document.createElement("table");
		t.setAttribute("id", "t");
		document.getElementById("thold").appendChild(t);

		model.rects.length = 0;

		var screenHeight = window.innerHeight - 100;
		var screenWidth = window.innerWidth;
		document.getElementById("height").innerHTML = "HEIGHT: " + screenHeight;
		document.getElementById("width").innerHTML = "WIDTH: " + screenWidth;

	 	// draw table
	 	var w = 0;
	 	var h = 0;

	 	if (screenHeight > model.cellHeight && screenWidth > model.cellWidth) {
	 		var table = document.getElementById("t");
	 		var px = "px";

			while ((h * model.cellHeight) < screenHeight) {
				var row = table.insertRow(h);
				while ((w * model.cellWidth) < screenWidth) {
					var cell = row.insertCell(w);
					cell.style.width = model.cellWidth + px;
					cell.style.height = model.cellHeight + px;
					cell.id = "" + h + 0 + w;
					var element = document.getElementById("" + h + 0 + w);

					element.setAttribute("align", "center");
					element.setAttribute("ondragover", 'allowDrop(event)');
					element.setAttribute("ondrop", 'drop(event)');
					element.setAttribute("onMouseover", "mouseOver(event)");
					element.setAttribute("onMouseout", "mouseOut(event)");
					element.setAttribute("onClick", "cellClick(event)");
					element.setAttribute("aria-hidden", "true");

					w++;
				}
				w = 0;
				h++;
			}

			$("#t tr").resizable({
				handles: 'e',
				minWidth: model.cellHeight
			});
			$("#t td").resizable({
				handles: 'e',
				minWidth: model.cellWidth
			});
	 	}
	 }
};

function allowDrop(e) {
    e.preventDefault();
}

function drag(e) {
    e.dataTransfer.setData("text", e.target.id);
    $('#t td').removeAttr('bgColor');
}

function drop(e) {
	e.preventDefault();
	var data = e.dataTransfer.getData("text");
	e.target.appendChild(document.getElementById(data));
}

function cellClick(e) {
	
}

function mouseOver(e) {
	if (e.target.id && $('button[aria-expanded="true"]').length == 0) {
		var id = e.target.id;
		document.getElementById(id).setAttribute('bgColor', '#EEEEEE');
		document.getElementById('rectIndex').innerHTML = id;

		if (!id.includes("_button") && !document.getElementById(id + "_span") && $('#' + id).children().length <= 1 && !$('#' + id).hasClass('element')) {
			// clear remaining
			$('.btClass').remove();
			$('td span').remove();

			// create button
			var button = document.createElement("button");
			var span = document.createElement("span");
			button.setAttribute("id", id + "_button");
			span.setAttribute('style', 'height: ' + (model.cellHeight + 1) + 'px;');
			button.setAttribute('style', 'height: ' + (model.cellHeight + 1) + 'px;');
			button.setAttribute('data-toggle', 'dropdown');
			//button.setAttribute("onClick", "formLoad(event)");
			button.className += 'btn btn-default btn-sm glyphicon glyphicon-plus btClass dropdown-toggle activation-menu-cta';
			span.setAttribute("id", id + "_span");
			var buttonElement = document.getElementById(id + "_button");
			var spanElement = document.getElementById(id + "_span");
			if (document.getElementById(id)) {
				document.getElementById(id).appendChild(span);
				span.appendChild(button);
			}

			// create and add form
			var form = document.createElement("ul");
			form.setAttribute("id", id + "_form");
			form.className += "dropdown-menu dropdown-menu-right-fix";
			span.appendChild(form);
			// add link to form
			$("#" + id + "_form").append("<li><a class='open-modal element' id='" + randomGenerator() + "_link" + "' draggable='true' ondragstart='drag(event)'>Link</a></li>");
			// add text to form
			$("#" + id + "_form").append("<li><input id='" + randomGenerator() + "_text" + "' type='text' class='open-modal element' value='Text Box' draggable='true' ondragstart='drag(event)'></li>");
			// add span to form
			$("#" + id + "_form").append("<li><p class='open-modal element' id='" + randomGenerator() + "_p" + "' draggable='true' ondragstart='drag(event)'>Text</p></li>");
			// add checkbox to form
			$("#" + id + "_form").append("<li><input type='checkbox' class='open-modal element' id='" + randomGenerator() + "_checkbox" + "' draggable='true' value='Checkbox' ondragstart='drag(event)'></li>");
		}
	}
}

function mouseOut(e) {
	if (e.target.id && $('button[aria-expanded="true"]').length == 0) {
		var id = e.target.id;
		document.getElementById(id).setAttribute('bgColor', '#FFFFFF');
		document.getElementById('rectIndex').innerHTML = id;

		if(id.includes("_button")) {
			var split = id.split('_');
			document.getElementById(id).remove();
			if (document.getElementById(split[0] + '_span'))
				document.getElementById(split[0] + '_span').remove();
		}
	}
}

function formLoad(e) {

}

function randomGenerator() {
	return Math.floor((Math.random() * 999999999) + 1000);
}

(function () {
	model.init();
})();