var model = {
	defaultWidth: 8,
	defaultHeight: 8,
	currentX: 0,
	currentY: 0,
	formInputs: [],
	inpTypes: [{
		value: "text", text: "Text"
	}],
	offsetX: 0,
	offsetY: 0,
	formEls: new observableArray([]),
	resizingTmpl: null,
	focusedInpEl: {},
	addInpOpen: false,
	minInpWidth: 80,
	buildSvg: function () {

		model.formInputs.length = 0;
		var pSvg = document.querySelector('svg');
		if (pSvg) pSvg.parentNode.removeChild(pSvg);

		var svgns = "http://www.w3.org/2000/svg";
		var svg = document.createElementNS(svgns, "svg");
		svg.setAttribute("width", "100%");
		svg.setAttribute("height", "100%");
		svg.setAttribute("position", "relative");
		svg.setAttribute("id", "snapGrid")
			
			var defs = document.createElementNS(svgns, "defs");

			var pattern = document.createElementNS(svgns, "pattern");
		pattern.setAttribute('id', 'smallGrid');
		pattern.setAttribute('width', model.defaultWidth),
		pattern.setAttribute('height', model.defaultHeight);
		pattern.setAttribute('patternUnits', 'userSpaceOnUse');
		var path = document.createElementNS(svgns, "path");
		path.setAttribute('d', 'M ' + model.defaultWidth +' 0 L 0 0 0 ' + model.defaultHeight);
		path.setAttribute('fill', 'none');
		path.setAttribute('stroke', '#858585');
		path.setAttribute('stroke-width', '0.5');
		pattern.appendChild(path);
		defs.appendChild(pattern);
		pattern = document.createElementNS(svgns, "pattern");
		pattern.setAttribute('id', 'grid');
		pattern.setAttribute('width', model.defaultWidth * 10),
		pattern.setAttribute('height', model.defaultHeight * 10);
		pattern.setAttribute('patternUnits', 'userSpaceOnUse');
		var rect = document.createElementNS(svgns, "rect");
		rect.setAttribute('width', model.defaultWidth * 10);
		rect.setAttribute('height', model.defaultHeight * 10);
		rect.setAttribute('fill', 'url(#smallGrid)');
		pattern.appendChild(rect);
		path = document.createElementNS(svgns, "path");
		path.setAttribute('d', 'M ' + model.defaultWidth * 10 +' 0 L 0 0 0 ' + model.defaultHeight * 10);
		path.setAttribute('fill', 'none');
		path.setAttribute('stroke', '#858585');
		path.setAttribute('stroke-width', '1');
		pattern.appendChild(path);
		defs.appendChild(pattern);
			svg.appendChild(defs);
			rect = document.createElementNS(svgns, "rect");
			rect.setAttribute('id', 'rect');
		rect.setAttribute('width', '100%');
		rect.setAttribute('height', '100%');
		rect.setAttribute('fill', 'url(#grid)');
		svg.appendChild(rect);

		var g = document.createElementNS(svgns, "g");
		g.setAttribute("id", "gid")
		g.setAttribute('transform', 'translate(0,0)')
		var hoverRect = document.createElementNS(svgns, "rect");
		hoverRect.setAttribute('id', 'hoverRect');
		hoverRect.setAttribute('width', model.defaultWidth);
		hoverRect.setAttribute('height', model.defaultHeight);
		hoverRect.setAttribute('fill', 'green');
		hoverRect.setAttribute('display', 'none');
		g.appendChild(hoverRect);
		svg.appendChild(g);
		document.querySelector('#snapGrid').appendChild(svg);

		[].forEach.call(model.inpTypes, function (item) {
			var option = document.createElement("option");
			option.setAttribute("value", item.value);
			option.innerText = item.text;
			document.querySelector('#addInpTmpl [name="inputType"]').appendChild(option);
		});

		rect.onmouseover = function (e) {
		hoverRect.setAttribute('display', 'block');
		};
		rect.onmousemove = function (e) {
			if (!g.classList.contains('clicked') || !document.getElementsByClassName('in').length) {
				var x = Math.floor(e.offsetX / model.defaultWidth) * model.defaultWidth;
				var y = Math.floor(e.offsetY / model.defaultHeight) * model.defaultHeight;
				var transform = 'translate(' + x + ',' + y + ')';
				if (g.getAttribute('transform') != transform) {
					g.setAttribute('transform', transform);
				}
			}		 			
		};
		g.onclick = function (e) {
			//model.addInpOpen = false;
			var t = g.getBoundingClientRect(),
				f = rect.getBoundingClientRect(),
				x = t.left - f.left,
			y = t.top - f.top;
			model.currentX = x;
			model.currentY = y;
			if (this.classList.contains('clicked')) {
				this.classList.remove('clicked');
			} else {
				this.classList.add('clicked');

				var addInpTmpl = document.getElementById('addInpTmpl').cloneNode(true);
				addInpTmpl.style.top = t.top + (model.defaultHeight / 2);
				addInpTmpl.style.left = t.left + (model.defaultWidth / 2);
				addInpTmpl.style.display = "block";
				addInpTmpl.removeAttribute("id");
				addInpTmpl.classList.remove("tmpl");
				addInpTmpl.classList.add("in");
				addInpTmpl.querySelector('button').addEventListener('click', model.addInp, false);
				addInpTmpl.querySelector('.close').addEventListener('click', model.addInpClose, false);
				addInpTmpl.querySelector('[name="fieldName"]').addEventListener('keyup', model.inpOnKeyUp, false);
				addInpTmpl.querySelector('[name="inputType"]').addEventListener('change', model.inpOnKeyUp, false);
				document.body.appendChild(addInpTmpl);
				//model.addInpOpen = true;
			}
		};
		rect.onclick = function (e) {
			if (g.classList.contains('clicked')) {
			    g.classList.remove('clicked');
			}
		}
		window.onclick = function (e) {
			if (!g.classList.contains('clicked')) {
				var inp = document.getElementsByClassName('in');
				if (inp.length && !e.target.classList.contains("in")) {
					inp[0].parentNode.removeChild(inp[0]);
				} 
			}
		};
		svg.onmouseleave = function (e) {
		if (!g.classList.contains('clicked')) hoverRect.setAttribute('display', 'none');
		};

	},
	init: function () {
		model.buildSvg();

		model.updateFormElsText();

		model.formEls.addEventListener("itemAdded", model.formElsAdded);

		model.formEls.addEventListener("itemSet", model.formElsSet);

		model.formEls.addEventListener("itemRemoved", model.formElsRemoved);

		document.addEventListener('click', function (e) {
			if (!e.target.classList.contains("inpTmpl") &&
				closest(e.target, function (el) {
					return el && el.classList && el.classList.contains('inpTmpl')
				}) == null) {

					//debugger;
				model.focusedInpEl = {};
				document.querySelectorAll('.inpTmpl.on').forEach(function (item) {
					item.style.background = "#FFF";
				});
			} else {
				document.querySelectorAll('.addInpTmpl.in').forEach(function (item) {
					item.parentNode.removeChild(item);
				});
				document.querySelector("#gid").classList.remove("clicked");
				document.querySelector("#hoverRect").setAttribute('display', 'none');
			}

			if (e.target.classList.contains("addInpTmpl") ||
				closest(e.target, function (el) {
					return el && el.classList && el.classList.contains('addInpTmpl')
				}) != null) {
				return;
			}

			if (!(e.target.tagName == "svg") &&
				closest(e.target, function (el) {
					return el && el.tagName && el.tagName == "svg";
				}) == null) {
				document.querySelectorAll('.addInpTmpl.in').forEach(function (item) {
					item.parentNode.removeChild(item);
				});
				document.querySelector("#gid").classList.remove("clicked");
				document.querySelector("#hoverRect").setAttribute('display', 'none');
			}

			
		});

		document.addEventListener('keydown', model.handleKeyboardMove, false);


	},
	formElsAdded: function (e) {
		var rect = document.getElementById('rect').getBoundingClientRect(),
			inpTmpl = document.getElementById('inpTmpl').cloneNode(true);
		document.getElementById("gid").classList.remove("clicked");
		inpTmpl.style.top = e.item.y;
		inpTmpl.style.left = e.item.x;
		inpTmpl.removeAttribute("id");
		inpTmpl.classList.remove("tmpl");
		inpTmpl.classList.add("on");
		inpTmpl.querySelector(".snapInpLabel").innerText = e.item.fieldName;
		inpTmpl.querySelector("input.snapField").setAttribute("name", e.item.fieldName);
		document.querySelector('#snapGrid').appendChild(inpTmpl)

		document.addEventListener('mousemove', mousemove, false)
		var mousedown = false;
		function handleDragStart(e) {
			handleFocusClick(e);
			document.querySelectorAll('.addInpTmpl.in').forEach(function (item) {
				item.parentNode.removeChild(item);
			});
			document.querySelector("#gid").classList.remove("clicked");
			document.querySelector("#hoverRect").setAttribute('display', 'none');
		    //e.dataTransfer.effectAllowed = 'move';
		    e.dataTransfer.setData('text/html', this.innerHTML);
		    //this.style.opacity = '0.4';
		    model.offsetX = e.offsetX;
		    model.offsetY = e.offsetY;
		    e.target.style.cursor = "move";
		    mousedown = true;
		}

		function mousemove (e) {
			if (mousedown) {
		    	e.target.style.cursor = "move";
			}
		}

		function handleDragOver(e) {
		  	if (e.preventDefault) {
		    	e.preventDefault();
		  	}
		 	e.dataTransfer.dropEffect = 'move';
		  	return false;
		}

		function handleDragEnter(e) {
  			//this.classList.add('over');
		}

		function handleDragLeave(e) {
	  		//this.classList.remove('over');
		}

		function handleDrop(e) {
		  	return false;
		}

		function handleDragEnd(e) {
			var that = this;
		    this.classList.remove('over');
			this.style.opacity = '1.0';
			var rect = document.getElementById('rect').getBoundingClientRect();
			var x = Math.floor((e.x - rect.left) / model.defaultWidth) * model.defaultWidth,
					y = Math.floor((e.y - rect.top) / model.defaultHeight) * model.defaultHeight,
					top = Math.floor((y - model.offsetY) / model.defaultHeight) * model.defaultHeight,
					left = Math.floor((x  - model.offsetX) / model.defaultWidth) * model.defaultWidth;
			this.style.top = top;
			this.style.left = left;

			model.offsetX = 0;
			model.offsetY = 0;
			mousedown = false;
			var t = grep(model.formEls, function (item) {
				return that.querySelector("input[name='" + item.fieldName +"']");
			});
			if (t.length > 0) {
				t[0].y = top //- rect.top;
				t[0].x = left//- rect.left;

				model.updateFormElsText();
			}
		}

		function handleFocusClick (e) {
			var el = e.target.classList.contains("inpTmpl") ? e.target : closest(e.target, function (el) { return el.classList.contains("inpTmpl") });
			model.focusedInpEl["domElement"] = el ? el : {};
			if (el) {
				var t = el.querySelector("input.snapField").getAttribute("name");
				var y = grep(model.formEls, function (item) {
					return item.fieldName == t;
				});
				if (y.length > 0) model.focusedInpEl["arrayElement"] = y[0];
				document.querySelectorAll('.inpTmpl.on').forEach(function (item) {
					item.style.background = "#FFF";
				});
				el.style.background = "#eee";
			}
		}


		inpTmpl.addEventListener('dragstart', handleDragStart, false);
		inpTmpl.addEventListener('dragenter', handleDragEnter, false)
		inpTmpl.addEventListener('dragover', handleDragOver, false);
		inpTmpl.addEventListener('dragleave', handleDragLeave, false);
		inpTmpl.addEventListener('drop', handleDrop, false);
		inpTmpl.addEventListener('dragend', handleDragEnd, false);
		inpTmpl.addEventListener('click', handleFocusClick, false);

		var startX, startWidth;

		inpTmpl.querySelector('.dragDiv.right').addEventListener('mousedown', function (e) {
			handleFocusClick(e);
			model.resizingTmpl = closest(this, function (el) {
		    	return el.classList.contains('inpTmpl');
		    });
		    model.resizingTmpl.setAttribute("draggable", "false");
			startX = e.clientX;
		    startY = e.clientY;
		    startWidth = parseInt(document.defaultView.getComputedStyle(model.resizingTmpl).width, 10);
		    document.documentElement.addEventListener('mousemove', doDragRight, false);
		    document.documentElement.addEventListener('mouseup', stopDragRight, false);
		}, false);

		inpTmpl.querySelector('.dragDiv.left').addEventListener('mousedown', function (e) {
			handleFocusClick(e);
			model.resizingTmpl = closest(this, function (el) {
		    	return el.classList.contains('inpTmpl');
		    });
		    model.resizingTmpl.setAttribute("draggable", "false");
			startX = e.clientX;
		    startY = e.clientY;
		    startWidth = parseInt(document.defaultView.getComputedStyle(model.resizingTmpl).width, 10);
		    document.documentElement.addEventListener('mousemove', doDragLeft, false);
		    document.documentElement.addEventListener('mouseup', stopDragLeft, false);
		}, false);

		function doDragRight(e) {
			var newWidth = (startWidth + e.clientX - startX)
			if (newWidth > model.minInpWidth) {
			    model.resizingTmpl.style.width =  newWidth + 'px';
			}
		}

		function doDragLeft(e) {
			var newWidth = (startWidth - e.clientX + startX),
			oldWidth = parseInt(model.resizingTmpl.style.width, 10);
			if (newWidth > model.minInpWidth) {
			    model.resizingTmpl.style.width = newWidth + 'px';
			    // debugger;
			    var p = parseInt(model.resizingTmpl.style.left, 10) - (newWidth - oldWidth);
			    model.resizingTmpl.style.left = p;
			}
		}

		function stopDragRight(e) {
			var t = grep(model.formEls, function (item) {
				return model.resizingTmpl.querySelector("input[name='" + item.fieldName +"']");
			});
			if (t.length > 0) {
				//debugger;
				var w = parseInt(model.resizingTmpl.style.width, 10);
				t[0].w = closestFloorOrCeil(w, model.defaultWidth);
				model.resizingTmpl.style.width = t[0].w;
				model.updateFormElsText();
				model.resizingTmpl = null;
			    document.querySelectorAll('.inpTmpl.on').forEach(function (el) {
			    	el.setAttribute("draggable", "true");
			    });
			    document.documentElement.removeEventListener('mousemove', doDragRight, false);    
			    document.documentElement.removeEventListener('mouseup', stopDragRight, false);
			}
		}

		function stopDragLeft(e) {
			var t = grep(model.formEls, function (item) {
				return model.resizingTmpl.querySelector("input[name='" + item.fieldName +"']");
			});
			if (t.length > 0) {
				var w = parseInt(model.resizingTmpl.style.width, 10);
				var x = parseInt(model.resizingTmpl.style.left, 10);
				t[0].w = closestFloorOrCeil(w, model.defaultWidth);
				t[0].x = closestFloorOrCeil(x, model.defaultWidth);
				model.resizingTmpl.style.width = t[0].w;
				model.resizingTmpl.style.left = t[0].x;
				model.updateFormElsText();
				model.resizingTmpl = null;
			    document.querySelectorAll('.inpTmpl.on').forEach(function (el) {
			    	el.setAttribute("draggable", "true");
			    });
			    document.documentElement.removeEventListener('mousemove', doDragLeft, false);    
			    document.documentElement.removeEventListener('mouseup', stopDragLeft, false);
			}
		}

		var inp = document.querySelector(".in");
		inp.parentNode.removeChild(inp);

		model.focusedInpEl["domElement"] = inpTmpl;
		var t = inpTmpl.querySelector("input.snapField").getAttribute("name");
		var y = grep(model.formEls, function (item) {
			return item.fieldName == t;
		});
		if (y.length > 0) model.focusedInpEl["arrayElement"] = y[0];

		model.updateFormElsText();
	},
	handleKeyboardMove (e) {
		if (model.focusedInpEl["domElement"] && model.focusedInpEl["arrayElement"]) {
			//debugger;
			var rect = document.getElementById('rect').getBoundingClientRect();
			if (e.keyCode == 37) {
				var t = parseInt(model.focusedInpEl["domElement"].style.left, 10) - model.defaultWidth; 
				if (t >= 0) {
					model.focusedInpEl["domElement"].style.left = t;
					model.focusedInpEl["arrayElement"].x = parseInt(model.focusedInpEl["domElement"].style.left, 10)
				}
			}
			if (e.keyCode == 38) {
				var t = parseInt(model.focusedInpEl["domElement"].style.top, 10) - model.defaultHeight;
				if (t >= 0) {
					model.focusedInpEl["domElement"].style.top = t;
					model.focusedInpEl["arrayElement"].y = parseInt(model.focusedInpEl["domElement"].style.top, 10)
				}
			}
			if (e.keyCode == 39) {
				model.focusedInpEl["domElement"].style.left = parseInt(model.focusedInpEl["domElement"].style.left, 10) + model.defaultWidth;
				model.focusedInpEl["arrayElement"].x = parseInt(model.focusedInpEl["domElement"].style.left, 10)
			}
			if (e.keyCode == 40) {
				model.focusedInpEl["domElement"].style.top = parseInt(model.focusedInpEl["domElement"].style.top, 10) + model.defaultHeight;
				model.focusedInpEl["arrayElement"].y = parseInt(model.focusedInpEl["domElement"].style.top, 10)
			}
			model.updateFormElsText();
		}
	},
	formElsSet: function (e) {

	},
	formElsRemoved: function (e) {

	},
	updateFormElsText: function () {
		document.querySelector("#inpEls").innerText = JSON.stringify(model.formEls.slice());
	},
	addInp: function (e) {
		var valid = true,
			errors = [];
		[].forEach.call(document.querySelectorAll('.in .changeError'), function (item) {
			item.innerText = "";
			item.parentNode.style.display = "none;"
		});

		var fieldName = document.querySelector('.in [name="fieldName"]').value;
		var inputType = document.querySelector('.in [name="inputType"]').value;

		if (fieldName == "") errors.push({ field: "fieldName", message: "Required" });
		if (inputType == "") errors.push({ field: "inputType", message: "Required" });

		if (errors.length) {
			[].forEach.call(errors, function (item) {
				var t = document.querySelector('.in .' + item.field + 'Error');
				t.innerText = item.message;
				t.parentNode.style.display = "block";
			});
			valid = false;
		}
		if (valid) {

			model.formEls.push({
				fieldName: fieldName,
				inputType: inputType,
				x: model.currentX,
				y: model.currentY,
				w: 200
			});
		}
	},
	addInpClose: function (e) {
		var inp = document.getElementsByClassName('in');
		if (inp.length && !e.target.classList.contains("in")) {
			document.getElementById('gid').classList.remove('clicked');
			inp[0].parentNode.removeChild(inp[0]);
		} 
	},
	inpOnKeyUp: function (e) {
		if (this.value.length) {
			var formDiv = closest(this, function (el) {
			    return el.className === 'formDiv';
			});
			var errorDiv = formDiv.querySelector('.errorDiv');
			errorDiv.style.display = "none";
			errorDiv.querySelector('.changeError').innerText = "";
		}
	},

};
