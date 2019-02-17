(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[0],{

/***/ "2HEx":
/*!****************************************!*\
  !*** ./engine/assets/style/index.scss ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../../node_modules/css-loader/dist/cjs.js??ref--6-1!../../../node_modules/sass-loader/lib/loader.js??ref--6-2!./index.scss */ "Ta0o");

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(/*! ../../../node_modules/style-loader/lib/addStyles.js */ "aET+")(content, options);

if(content.locals) module.exports = content.locals;

if(false) {}

/***/ }),

/***/ "65AX":
/*!********************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js??ref--6-1!./node_modules/sass-loader/lib/loader.js??ref--6-2!./engine/assets/style/components/add/add.scss ***!
  \********************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../../../node_modules/css-loader/dist/runtime/api.js */ "JPst")(true);
// Module
exports.push([module.i, ".add {\n  position: absolute;\n  width: 300px;\n  top: 0;\n  left: 0;\n  z-index: 100000;\n  background: #eee;\n  border: 1px solid #787878;\n  padding: 8px 12px;\n  border-radius: 4px; }\n  .add .add-content {\n    position: relative; }\n", "",{"version":3,"sources":["C:/Users/garrick/source/repos/snapform/engine/assets/style/components/add/engine/assets/style/components/add/add.scss"],"names":[],"mappings":"AAAA;EACI,kBAAkB;EAClB,YAAW;EACX,MAAK;EACL,OAAM;EACN,eAAe;EACf,gBAAe;EACf,yBAAyB;EACzB,iBAAgB;EAChB,kBAAkB,EAAA;EATtB;IAYQ,kBAAkB,EAAA","file":"add.scss","sourcesContent":[".add {\r\n    position: absolute;\r\n    width:300px;\r\n    top:0;\r\n    left:0;\r\n    z-index: 100000;\r\n    background:#eee;\r\n    border: 1px solid #787878;\r\n    padding:8px 12px;\r\n    border-radius: 4px;\r\n\r\n    .add-content {\r\n        position: relative;\r\n    }\r\n}"],"sourceRoot":""}]);



/***/ }),

/***/ "ERX6":
/*!************************************************!*\
  !*** ./engine/src/config/redux/redux.store.js ***!
  \************************************************/
/*! exports provided: store */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "store", function() { return store; });
/* harmony import */ var redux__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! redux */ "ANjH");
/* harmony import */ var _root_reducer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./root-reducer */ "wLMD");


const store = Object(redux__WEBPACK_IMPORTED_MODULE_0__["createStore"])(_root_reducer__WEBPACK_IMPORTED_MODULE_1__["reducer"]);

/***/ }),

/***/ "HoSs":
/*!***************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js??ref--6-1!./node_modules/sass-loader/lib/loader.js??ref--6-2!./engine/assets/style/components/grid.component.scss ***!
  \***************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../../node_modules/css-loader/dist/runtime/api.js */ "JPst")(true);
// Module
exports.push([module.i, ".view-svg {\n  border-right: 1px solid #B0B0B0;\n  border-bottom: 1px solid #B0B0B0;\n  border-radius: 4px; }\n  .view-svg .gid {\n    fill: #FF0000;\n    display: none; }\n    .view-svg .gid.clicked {\n      display: block; }\n  .view-svg:hover .gid {\n    display: block; }\n\n.add-container {\n  position: relative; }\n", "",{"version":3,"sources":["C:/Users/garrick/source/repos/snapform/engine/assets/style/components/engine/assets/style/components/grid.component.scss"],"names":[],"mappings":"AAAA;EAgBI,+BAA+B;EAC/B,gCAAgC;EAEhC,kBAAkB,EAAA;EAnBtB;IAEQ,aAAa;IACb,aAAa,EAAA;IAHrB;MAMY,cAAc,EAAA;EAN1B;IAYY,cAAc,EAAA;;AAU1B;EACI,kBAAiB,EAAA","file":"grid.component.scss","sourcesContent":[".view-svg {\r\n    .gid {\r\n        fill: #FF0000;\r\n        display: none;\r\n    \r\n        &.clicked {\r\n            display: block;\r\n        }\r\n    }\r\n\r\n    &:hover {\r\n        .gid {\r\n            display: block;\r\n        }\r\n    }\r\n\r\n    border-right: 1px solid #B0B0B0;\r\n    border-bottom: 1px solid #B0B0B0;\r\n\r\n    border-radius: 4px;\r\n}\r\n\r\n.add-container {\r\n    position:relative;\r\n}"],"sourceRoot":""}]);



/***/ }),

/***/ "R46n":
/*!************************************************************!*\
  !*** ./engine/assets/style/components/grid.component.scss ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../../../node_modules/css-loader/dist/cjs.js??ref--6-1!../../../../node_modules/sass-loader/lib/loader.js??ref--6-2!./grid.component.scss */ "HoSs");

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(/*! ../../../../node_modules/style-loader/lib/addStyles.js */ "aET+")(content, options);

if(content.locals) module.exports = content.locals;

if(false) {}

/***/ }),

/***/ "Ta0o":
/*!*******************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js??ref--6-1!./node_modules/sass-loader/lib/loader.js??ref--6-2!./engine/assets/style/index.scss ***!
  \*******************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "JPst")(true);
// Module
exports.push([module.i, "#snapgrid {\n  font-style: italic; }\n", "",{"version":3,"sources":["C:/Users/garrick/source/repos/snapform/engine/assets/style/engine/assets/style/index.scss"],"names":[],"mappings":"AAAA;EACI,kBAAkB,EAAA","file":"index.scss","sourcesContent":["#snapgrid {\r\n    font-style: italic;\r\n}"],"sourceRoot":""}]);



/***/ }),

/***/ "W9Uv":
/*!****************************************************!*\
  !*** ./engine/src/components/add/add.component.js ***!
  \****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _config_redux_redux_store__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../config/redux/redux.store */ "ERX6");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-redux */ "/MKj");
/* harmony import */ var _config_redux_redux_actions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../config/redux/redux.actions */ "ifEJ");
/* harmony import */ var _assets_style_components_add_add_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../assets/style/components/add/add.scss */ "ldZx");
/* harmony import */ var _assets_style_components_add_add_scss__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_assets_style_components_add_add_scss__WEBPACK_IMPORTED_MODULE_4__);






const mapStateToProps = state => state;

function mapDispatchToProps(dispatch) {
  return {
    gClicked: payload => dispatch(Object(_config_redux_redux_actions__WEBPACK_IMPORTED_MODULE_3__["gClicked"])(payload))
  };
}

class AddComponent extends react__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
  }

  componentWillMount() {
    document.addEventListener('mousedown', this.handleOutsideClick, false);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleOutsideClick, false);
  }

  handleOutsideClick(e) {
    if (this.props.node.contains(e.target) || this.add.contains(e.target)) {
      return;
    }

    this.props.gClicked({
      addComponent: null,
      gClassList: 'gid'
    });
  }

  render() {
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      ref: add => this.add = add,
      className: "add",
      style: {
        'top': this.props.top,
        'left': this.props.left
      }
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "add-content"
    }, "ADD")) //     <div style="position:relative;">
    // 	<div class="inpTmplClose">
    // 		<span class="close hairline"></span>
    // 	</div>
    // 	<div class="formDiv">
    //   		<label>Input Type</label>
    //   		<div class="inp" style="margin:3px 0 0 0;">
    //   			<select class="inputDiv" name="inputType">
    //   				<option value="">Select...</option>
    //   			</select>
    //   		</div>
    //   		<div class="errorDiv">
    //   			<span class="changeError inputTypeError"></span>
    //   		</div>
    // 	</div>
    // </div>
    ;
  }

}

const Add = Object(react_redux__WEBPACK_IMPORTED_MODULE_2__["connect"])(mapStateToProps, mapDispatchToProps)(AddComponent);
/* harmony default export */ __webpack_exports__["default"] = (Add);

/***/ }),

/***/ "WKSt":
/*!**********************************************!*\
  !*** ./engine/src/components/g.component.js ***!
  \**********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _config_redux_redux_store__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../config/redux/redux.store */ "ERX6");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-redux */ "/MKj");
/* harmony import */ var _config_redux_redux_actions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../config/redux/redux.actions */ "ifEJ");
/* harmony import */ var _add_add_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./add/add.component */ "W9Uv");






const mapStateToProps = state => state;

function mapDispatchToProps(dispatch) {
  return {
    gClicked: payload => dispatch(Object(_config_redux_redux_actions__WEBPACK_IMPORTED_MODULE_3__["gClicked"])(payload))
  };
}

class GComponent extends react__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    const {
      cellWidth,
      cellHeight
    } = _config_redux_redux_store__WEBPACK_IMPORTED_MODULE_1__["store"].getState();
    var x = Math.floor(e.nativeEvent.offsetX / cellWidth) * cellWidth;
    var y = Math.floor(e.nativeEvent.offsetY / cellHeight) * cellHeight;
    var cellTransform = 'translate(' + x + ',' + y + ')';
    const left = x + cellWidth / 2;
    const top = y + cellHeight / 2;
    this.props.gClicked({
      cellTransform,
      current_x: x,
      current_y: y,
      addComponent: react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_add_add_component__WEBPACK_IMPORTED_MODULE_4__["default"], {
        top: top,
        left: left
      }),
      gClassList: 'gid clicked'
    });
  }

  render() {
    const {
      gClassList
    } = _config_redux_redux_store__WEBPACK_IMPORTED_MODULE_1__["store"].getState();
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("g", {
      ref: el => this.el = el,
      className: gClassList,
      transform: this.props.transform,
      onClick: this.handleClick
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("rect", {
      className: "hover-rect",
      width: this.props.width,
      height: this.props.height
    }));
  }

}

const G = Object(react_redux__WEBPACK_IMPORTED_MODULE_2__["connect"])(mapStateToProps, mapDispatchToProps)(GComponent);
/* harmony default export */ __webpack_exports__["default"] = (G);

/***/ }),

/***/ "WoDL":
/*!*****************************!*\
  !*** ./engine/src/index.js ***!
  \*****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _components_grid_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/grid.component */ "bCUt");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-redux */ "/MKj");
/* harmony import */ var _config_redux_redux_store__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./config/redux/redux.store */ "ERX6");
/* harmony import */ var _assets_style_index_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../assets/style/index.scss */ "2HEx");
/* harmony import */ var _assets_style_index_scss__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_assets_style_index_scss__WEBPACK_IMPORTED_MODULE_4__);






class EngineComponent extends react__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  render() {
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_redux__WEBPACK_IMPORTED_MODULE_2__["Provider"], {
      store: _config_redux_redux_store__WEBPACK_IMPORTED_MODULE_3__["store"]
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      id: "snapgrid"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_grid_component__WEBPACK_IMPORTED_MODULE_1__["default"], {
      viewWidth: this.props.viewWidth,
      viewHeight: this.props.viewHeight,
      cellWidth: this.props.cellWidth,
      cellHeight: this.props.cellHeight
    })));
  }

}

;
/* harmony default export */ __webpack_exports__["default"] = (EngineComponent);

/***/ }),

/***/ "bCUt":
/*!*************************************************!*\
  !*** ./engine/src/components/grid.component.js ***!
  \*************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _config_redux_redux_store__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../config/redux/redux.store */ "ERX6");
/* harmony import */ var _config_redux_redux_actions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../config/redux/redux.actions */ "ifEJ");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-redux */ "/MKj");
/* harmony import */ var _g_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./g.component */ "WKSt");
/* harmony import */ var _add_add_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./add/add.component */ "W9Uv");
/* harmony import */ var _assets_images_mgt_logo_png__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../assets/images/mgt-logo.png */ "xOxu");
/* harmony import */ var _assets_images_mgt_logo_png__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_assets_images_mgt_logo_png__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _assets_style_components_grid_component_scss__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../assets/style/components/grid.component.scss */ "R46n");
/* harmony import */ var _assets_style_components_grid_component_scss__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_assets_style_components_grid_component_scss__WEBPACK_IMPORTED_MODULE_7__);
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }










const mapStateToProps = state => state;

function mapDispatchToProps(dispatch) {
  return {
    updateViewSettings: payload => dispatch(Object(_config_redux_redux_actions__WEBPACK_IMPORTED_MODULE_2__["updateViewSettings"])(payload)),
    gClicked: payload => dispatch(Object(_config_redux_redux_actions__WEBPACK_IMPORTED_MODULE_2__["gClicked"])(payload))
  };
}

class GridComponent extends react__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  constructor(props) {
    super(props);

    _defineProperty(this, "smallGridPath", `M ${this.props.cellWidth} 0 L 0 0 0 ${this.props.cellHeight}`);

    _defineProperty(this, "gridPath", `M ${this.props.cellWidth * 10} 0 L 0 0 0 ${this.props.cellHeight * 10}`);

    const payload = {
      viewWidth: this.props.viewWidth,
      viewHeight: this.props.viewHeight,
      cellWidth: this.props.cellWidth,
      cellHeight: this.props.cellHeight,
      cellTransform: this.props.cellTransform
    };
    this.props.updateViewSettings(payload);
    this.mouseMove = this.mouseMove.bind(this);
    this.handleSvgClick = this.handleSvgClick.bind(this);
  }

  mouseMove(e) {
    const {
      addComponent
    } = _config_redux_redux_store__WEBPACK_IMPORTED_MODULE_1__["store"].getState();

    if (addComponent) {
      return;
    }

    var x = Math.floor(e.nativeEvent.offsetX / this.props.cellWidth) * this.props.cellWidth;
    var y = Math.floor(e.nativeEvent.offsetY / this.props.cellHeight) * this.props.cellHeight;
    var cellTransform = 'translate(' + x + ',' + y + ')';
    this.props.updateViewSettings({
      cellTransform
    });
  }

  handleSvgClick(e) {
    const {
      cellWidth,
      cellHeight
    } = _config_redux_redux_store__WEBPACK_IMPORTED_MODULE_1__["store"].getState();
    var x = Math.floor(e.nativeEvent.offsetX / cellWidth) * cellWidth;
    var y = Math.floor(e.nativeEvent.offsetY / cellHeight) * cellHeight;
    var cellTransform = 'translate(' + x + ',' + y + ')';
    const left = x + cellWidth / 2;
    const top = y + cellHeight / 2;
    this.props.gClicked({
      cellTransform,
      current_x: x,
      current_y: y,
      addComponent: react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_add_add_component__WEBPACK_IMPORTED_MODULE_5__["default"], {
        top: top,
        left: left
      }),
      gClassList: 'gid clicked'
    });
  }

  render() {
    const {
      cellTransform,
      viewWidth,
      viewHeight,
      cellWidth,
      cellHeight,
      addComponent
    } = _config_redux_redux_store__WEBPACK_IMPORTED_MODULE_1__["store"].getState();
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "add-container",
      ref: container => this.container = container
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("svg", {
      ref: node => this.node = node,
      className: "view-svg",
      width: viewWidth,
      height: viewHeight,
      xmlns: "http://www.w3.org/2000/svg"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("defs", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("pattern", {
      id: "smallGrid",
      width: cellWidth,
      height: cellHeight,
      patternUnits: "userSpaceOnUse"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("path", {
      d: this.smallGridPath,
      fill: "none",
      stroke: "gray",
      strokeWidth: "0.5"
    })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("pattern", {
      id: "grid",
      width: cellWidth * 10,
      height: cellHeight * 10,
      patternUnits: "userSpaceOnUse"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("rect", {
      width: cellWidth * 10,
      height: cellHeight * 10,
      fill: "url(#smallGrid)"
    }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("path", {
      d: this.gridPath,
      fill: "none",
      stroke: "gray",
      strokeWidth: "1"
    }))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("rect", {
      width: "100%",
      height: "100%",
      fill: "url(#grid)",
      onMouseMove: this.mouseMove,
      onClick: this.handleSvgClick
    }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_g_component__WEBPACK_IMPORTED_MODULE_4__["default"], {
      ref: g => this.g = g,
      width: cellWidth,
      height: cellHeight,
      transform: cellTransform,
      node: this.node,
      container: this.container,
      add: this.add
    })), addComponent ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_add_add_component__WEBPACK_IMPORTED_MODULE_5__["default"], {
      top: addComponent.props.top,
      left: addComponent.props.left,
      g: this.g,
      node: this.node,
      container: this.container
    }) : null));
  }

}

;
const Grid = Object(react_redux__WEBPACK_IMPORTED_MODULE_3__["connect"])(mapStateToProps, mapDispatchToProps)(GridComponent);
/* harmony default export */ __webpack_exports__["default"] = (Grid);

/***/ }),

/***/ "eKEi":
/*!********************************************************!*\
  !*** ./engine/src/config/redux/redux.actions.types.js ***!
  \********************************************************/
/*! exports provided: UPDATE_VIEW_SETTINGS, G_CLICKED */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UPDATE_VIEW_SETTINGS", function() { return UPDATE_VIEW_SETTINGS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "G_CLICKED", function() { return G_CLICKED; });
const UPDATE_VIEW_SETTINGS = 'UPDATE_VIEW_SETTINGS';
const G_CLICKED = 'G_CLICKED';

/***/ }),

/***/ "ifEJ":
/*!**************************************************!*\
  !*** ./engine/src/config/redux/redux.actions.js ***!
  \**************************************************/
/*! exports provided: updateViewSettings, gClicked */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "updateViewSettings", function() { return updateViewSettings; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "gClicked", function() { return gClicked; });
/* harmony import */ var _redux_actions_types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./redux.actions.types */ "eKEi");

const updateViewSettings = payload => {
  return {
    type: _redux_actions_types__WEBPACK_IMPORTED_MODULE_0__["UPDATE_VIEW_SETTINGS"],
    payload
  };
};
const gClicked = payload => {
  return {
    type: _redux_actions_types__WEBPACK_IMPORTED_MODULE_0__["G_CLICKED"],
    payload
  };
};

/***/ }),

/***/ "ldZx":
/*!*****************************************************!*\
  !*** ./engine/assets/style/components/add/add.scss ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../../../../node_modules/css-loader/dist/cjs.js??ref--6-1!../../../../../node_modules/sass-loader/lib/loader.js??ref--6-2!./add.scss */ "65AX");

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(/*! ../../../../../node_modules/style-loader/lib/addStyles.js */ "aET+")(content, options);

if(content.locals) module.exports = content.locals;

if(false) {}

/***/ }),

/***/ "wLMD":
/*!*************************************************!*\
  !*** ./engine/src/config/redux/root-reducer.js ***!
  \*************************************************/
/*! exports provided: reducer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "reducer", function() { return reducer; });
/* harmony import */ var _redux_actions_types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./redux.actions.types */ "eKEi");

const initialState = {
  gClassList: 'gid'
};
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case _redux_actions_types__WEBPACK_IMPORTED_MODULE_0__["UPDATE_VIEW_SETTINGS"]:
      return Object.assign({}, state, {
        viewWidth: action.payload.viewWidth || state.viewWidth,
        viewHeight: action.payload.viewHeight || state.viewHeight,
        cellWidth: action.payload.cellWidth || state.cellWidth,
        cellHeight: action.payload.cellHeight || state.cellHeight,
        cellTransform: action.payload.cellTransform || state.cellTransform,
        current_x: action.payload.current_x || state.current_x,
        current_y: action.payload.current_y || state.current_y
      });

    case _redux_actions_types__WEBPACK_IMPORTED_MODULE_0__["G_CLICKED"]:
      return Object.assign({}, state, {
        cellTransform: action.payload.cellTransform || state.cellTransform,
        current_x: action.payload.current_x || state.current_x,
        current_y: action.payload.current_y || state.current_y,
        addComponent: action.payload.addComponent,
        gClassList: action.payload.gClassList || state.gClassList
      });
  }

  return state;
};

/***/ }),

/***/ "xOxu":
/*!*******************************************!*\
  !*** ./engine/assets/images/mgt-logo.png ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "engine/assets/images/mgt-logo.png";

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9lbmdpbmUvYXNzZXRzL3N0eWxlL2luZGV4LnNjc3M/NTE1NCIsIndlYnBhY2s6Ly8vLi9lbmdpbmUvYXNzZXRzL3N0eWxlL2NvbXBvbmVudHMvYWRkL2FkZC5zY3NzIiwid2VicGFjazovLy8uL2VuZ2luZS9zcmMvY29uZmlnL3JlZHV4L3JlZHV4LnN0b3JlLmpzIiwid2VicGFjazovLy8uL2VuZ2luZS9hc3NldHMvc3R5bGUvY29tcG9uZW50cy9ncmlkLmNvbXBvbmVudC5zY3NzIiwid2VicGFjazovLy8uL2VuZ2luZS9hc3NldHMvc3R5bGUvY29tcG9uZW50cy9ncmlkLmNvbXBvbmVudC5zY3NzP2NlYzkiLCJ3ZWJwYWNrOi8vLy4vZW5naW5lL2Fzc2V0cy9zdHlsZS9pbmRleC5zY3NzIiwid2VicGFjazovLy8uL2VuZ2luZS9zcmMvY29tcG9uZW50cy9hZGQvYWRkLmNvbXBvbmVudC5qcyIsIndlYnBhY2s6Ly8vLi9lbmdpbmUvc3JjL2NvbXBvbmVudHMvZy5jb21wb25lbnQuanMiLCJ3ZWJwYWNrOi8vLy4vZW5naW5lL3NyYy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9lbmdpbmUvc3JjL2NvbXBvbmVudHMvZ3JpZC5jb21wb25lbnQuanMiLCJ3ZWJwYWNrOi8vLy4vZW5naW5lL3NyYy9jb25maWcvcmVkdXgvcmVkdXguYWN0aW9ucy50eXBlcy5qcyIsIndlYnBhY2s6Ly8vLi9lbmdpbmUvc3JjL2NvbmZpZy9yZWR1eC9yZWR1eC5hY3Rpb25zLmpzIiwid2VicGFjazovLy8uL2VuZ2luZS9hc3NldHMvc3R5bGUvY29tcG9uZW50cy9hZGQvYWRkLnNjc3M/NTUxZCIsIndlYnBhY2s6Ly8vLi9lbmdpbmUvc3JjL2NvbmZpZy9yZWR1eC9yb290LXJlZHVjZXIuanMiLCJ3ZWJwYWNrOi8vLy4vZW5naW5lL2Fzc2V0cy9pbWFnZXMvbWd0LWxvZ28ucG5nIl0sIm5hbWVzIjpbInN0b3JlIiwiY3JlYXRlU3RvcmUiLCJyZWR1Y2VyIiwibWFwU3RhdGVUb1Byb3BzIiwic3RhdGUiLCJtYXBEaXNwYXRjaFRvUHJvcHMiLCJkaXNwYXRjaCIsImdDbGlja2VkIiwicGF5bG9hZCIsIkFkZENvbXBvbmVudCIsIkNvbXBvbmVudCIsImNvbnN0cnVjdG9yIiwicHJvcHMiLCJoYW5kbGVPdXRzaWRlQ2xpY2siLCJiaW5kIiwiY29tcG9uZW50V2lsbE1vdW50IiwiZG9jdW1lbnQiLCJhZGRFdmVudExpc3RlbmVyIiwiY29tcG9uZW50V2lsbFVubW91bnQiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiZSIsIm5vZGUiLCJjb250YWlucyIsInRhcmdldCIsImFkZCIsImFkZENvbXBvbmVudCIsImdDbGFzc0xpc3QiLCJyZW5kZXIiLCJ0b3AiLCJsZWZ0IiwiQWRkIiwiY29ubmVjdCIsIkdDb21wb25lbnQiLCJoYW5kbGVDbGljayIsImNlbGxXaWR0aCIsImNlbGxIZWlnaHQiLCJnZXRTdGF0ZSIsIngiLCJNYXRoIiwiZmxvb3IiLCJuYXRpdmVFdmVudCIsIm9mZnNldFgiLCJ5Iiwib2Zmc2V0WSIsImNlbGxUcmFuc2Zvcm0iLCJjdXJyZW50X3giLCJjdXJyZW50X3kiLCJlbCIsInRyYW5zZm9ybSIsIndpZHRoIiwiaGVpZ2h0IiwiRyIsIkVuZ2luZUNvbXBvbmVudCIsInZpZXdXaWR0aCIsInZpZXdIZWlnaHQiLCJ1cGRhdGVWaWV3U2V0dGluZ3MiLCJHcmlkQ29tcG9uZW50IiwibW91c2VNb3ZlIiwiaGFuZGxlU3ZnQ2xpY2siLCJjb250YWluZXIiLCJzbWFsbEdyaWRQYXRoIiwiZ3JpZFBhdGgiLCJnIiwiR3JpZCIsIlVQREFURV9WSUVXX1NFVFRJTkdTIiwiR19DTElDS0VEIiwidHlwZSIsImluaXRpYWxTdGF0ZSIsImFjdGlvbiIsIk9iamVjdCIsImFzc2lnbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUNBLGNBQWMsbUJBQU8sQ0FBQyw0SUFBaUk7O0FBRXZKLDRDQUE0QyxRQUFTOztBQUVyRDtBQUNBOzs7O0FBSUEsZUFBZTs7QUFFZjtBQUNB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Ozs7OztBQ05QLGlCQUFpQixxQkFBdUIsdUMiLCJmaWxlIjoiMC4zMzEwOTc4Mzc3ODk5YzcxNmU3YS5jaHVuay5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxudmFyIGNvbnRlbnQgPSByZXF1aXJlKFwiISEuLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcz8/cmVmLS02LTEhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2xpYi9sb2FkZXIuanM/P3JlZi0tNi0yIS4vaW5kZXguc2Nzc1wiKTtcblxuaWYodHlwZW9mIGNvbnRlbnQgPT09ICdzdHJpbmcnKSBjb250ZW50ID0gW1ttb2R1bGUuaWQsIGNvbnRlbnQsICcnXV07XG5cbnZhciB0cmFuc2Zvcm07XG52YXIgaW5zZXJ0SW50bztcblxuXG5cbnZhciBvcHRpb25zID0ge1wiaG1yXCI6dHJ1ZX1cblxub3B0aW9ucy50cmFuc2Zvcm0gPSB0cmFuc2Zvcm1cbm9wdGlvbnMuaW5zZXJ0SW50byA9IHVuZGVmaW5lZDtcblxudmFyIHVwZGF0ZSA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9saWIvYWRkU3R5bGVzLmpzXCIpKGNvbnRlbnQsIG9wdGlvbnMpO1xuXG5pZihjb250ZW50LmxvY2FscykgbW9kdWxlLmV4cG9ydHMgPSBjb250ZW50LmxvY2FscztcblxuaWYobW9kdWxlLmhvdCkge1xuXHRtb2R1bGUuaG90LmFjY2VwdChcIiEhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanM/P3JlZi0tNi0xIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9saWIvbG9hZGVyLmpzPz9yZWYtLTYtMiEuL2luZGV4LnNjc3NcIiwgZnVuY3Rpb24oKSB7XG5cdFx0dmFyIG5ld0NvbnRlbnQgPSByZXF1aXJlKFwiISEuLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcz8/cmVmLS02LTEhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2xpYi9sb2FkZXIuanM/P3JlZi0tNi0yIS4vaW5kZXguc2Nzc1wiKTtcblxuXHRcdGlmKHR5cGVvZiBuZXdDb250ZW50ID09PSAnc3RyaW5nJykgbmV3Q29udGVudCA9IFtbbW9kdWxlLmlkLCBuZXdDb250ZW50LCAnJ11dO1xuXG5cdFx0dmFyIGxvY2FscyA9IChmdW5jdGlvbihhLCBiKSB7XG5cdFx0XHR2YXIga2V5LCBpZHggPSAwO1xuXG5cdFx0XHRmb3Ioa2V5IGluIGEpIHtcblx0XHRcdFx0aWYoIWIgfHwgYVtrZXldICE9PSBiW2tleV0pIHJldHVybiBmYWxzZTtcblx0XHRcdFx0aWR4Kys7XG5cdFx0XHR9XG5cblx0XHRcdGZvcihrZXkgaW4gYikgaWR4LS07XG5cblx0XHRcdHJldHVybiBpZHggPT09IDA7XG5cdFx0fShjb250ZW50LmxvY2FscywgbmV3Q29udGVudC5sb2NhbHMpKTtcblxuXHRcdGlmKCFsb2NhbHMpIHRocm93IG5ldyBFcnJvcignQWJvcnRpbmcgQ1NTIEhNUiBkdWUgdG8gY2hhbmdlZCBjc3MtbW9kdWxlcyBsb2NhbHMuJyk7XG5cblx0XHR1cGRhdGUobmV3Q29udGVudCk7XG5cdH0pO1xuXG5cdG1vZHVsZS5ob3QuZGlzcG9zZShmdW5jdGlvbigpIHsgdXBkYXRlKCk7IH0pO1xufSIsImV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzXCIpKHRydWUpO1xuLy8gTW9kdWxlXG5leHBvcnRzLnB1c2goW21vZHVsZS5pZCwgXCIuYWRkIHtcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIHdpZHRoOiAzMDBweDtcXG4gIHRvcDogMDtcXG4gIGxlZnQ6IDA7XFxuICB6LWluZGV4OiAxMDAwMDA7XFxuICBiYWNrZ3JvdW5kOiAjZWVlO1xcbiAgYm9yZGVyOiAxcHggc29saWQgIzc4Nzg3ODtcXG4gIHBhZGRpbmc6IDhweCAxMnB4O1xcbiAgYm9yZGVyLXJhZGl1czogNHB4OyB9XFxuICAuYWRkIC5hZGQtY29udGVudCB7XFxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTsgfVxcblwiLCBcIlwiLHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIkM6L1VzZXJzL2dhcnJpY2svc291cmNlL3JlcG9zL3NuYXBmb3JtL2VuZ2luZS9hc3NldHMvc3R5bGUvY29tcG9uZW50cy9hZGQvZW5naW5lL2Fzc2V0cy9zdHlsZS9jb21wb25lbnRzL2FkZC9hZGQuc2Nzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQTtFQUNJLGtCQUFrQjtFQUNsQixZQUFXO0VBQ1gsTUFBSztFQUNMLE9BQU07RUFDTixlQUFlO0VBQ2YsZ0JBQWU7RUFDZix5QkFBeUI7RUFDekIsaUJBQWdCO0VBQ2hCLGtCQUFrQixFQUFBO0VBVHRCO0lBWVEsa0JBQWtCLEVBQUFcIixcImZpbGVcIjpcImFkZC5zY3NzXCIsXCJzb3VyY2VzQ29udGVudFwiOltcIi5hZGQge1xcclxcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XFxyXFxuICAgIHdpZHRoOjMwMHB4O1xcclxcbiAgICB0b3A6MDtcXHJcXG4gICAgbGVmdDowO1xcclxcbiAgICB6LWluZGV4OiAxMDAwMDA7XFxyXFxuICAgIGJhY2tncm91bmQ6I2VlZTtcXHJcXG4gICAgYm9yZGVyOiAxcHggc29saWQgIzc4Nzg3ODtcXHJcXG4gICAgcGFkZGluZzo4cHggMTJweDtcXHJcXG4gICAgYm9yZGVyLXJhZGl1czogNHB4O1xcclxcblxcclxcbiAgICAuYWRkLWNvbnRlbnQge1xcclxcbiAgICAgICAgcG9zaXRpb246IHJlbGF0aXZlO1xcclxcbiAgICB9XFxyXFxufVwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuXG4iLCJpbXBvcnQgeyBjcmVhdGVTdG9yZSB9IGZyb20gXCJyZWR1eFwiO1xyXG5pbXBvcnQgeyByZWR1Y2VyIH0gZnJvbSBcIi4vcm9vdC1yZWR1Y2VyXCI7XHJcblxyXG5leHBvcnQgY29uc3Qgc3RvcmUgPSBjcmVhdGVTdG9yZShyZWR1Y2VyKTsiLCJleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiKSh0cnVlKTtcbi8vIE1vZHVsZVxuZXhwb3J0cy5wdXNoKFttb2R1bGUuaWQsIFwiLnZpZXctc3ZnIHtcXG4gIGJvcmRlci1yaWdodDogMXB4IHNvbGlkICNCMEIwQjA7XFxuICBib3JkZXItYm90dG9tOiAxcHggc29saWQgI0IwQjBCMDtcXG4gIGJvcmRlci1yYWRpdXM6IDRweDsgfVxcbiAgLnZpZXctc3ZnIC5naWQge1xcbiAgICBmaWxsOiAjRkYwMDAwO1xcbiAgICBkaXNwbGF5OiBub25lOyB9XFxuICAgIC52aWV3LXN2ZyAuZ2lkLmNsaWNrZWQge1xcbiAgICAgIGRpc3BsYXk6IGJsb2NrOyB9XFxuICAudmlldy1zdmc6aG92ZXIgLmdpZCB7XFxuICAgIGRpc3BsYXk6IGJsb2NrOyB9XFxuXFxuLmFkZC1jb250YWluZXIge1xcbiAgcG9zaXRpb246IHJlbGF0aXZlOyB9XFxuXCIsIFwiXCIse1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wiQzovVXNlcnMvZ2Fycmljay9zb3VyY2UvcmVwb3Mvc25hcGZvcm0vZW5naW5lL2Fzc2V0cy9zdHlsZS9jb21wb25lbnRzL2VuZ2luZS9hc3NldHMvc3R5bGUvY29tcG9uZW50cy9ncmlkLmNvbXBvbmVudC5zY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUFBO0VBZ0JJLCtCQUErQjtFQUMvQixnQ0FBZ0M7RUFFaEMsa0JBQWtCLEVBQUE7RUFuQnRCO0lBRVEsYUFBYTtJQUNiLGFBQWEsRUFBQTtJQUhyQjtNQU1ZLGNBQWMsRUFBQTtFQU4xQjtJQVlZLGNBQWMsRUFBQTs7QUFVMUI7RUFDSSxrQkFBaUIsRUFBQVwiLFwiZmlsZVwiOlwiZ3JpZC5jb21wb25lbnQuc2Nzc1wiLFwic291cmNlc0NvbnRlbnRcIjpbXCIudmlldy1zdmcge1xcclxcbiAgICAuZ2lkIHtcXHJcXG4gICAgICAgIGZpbGw6ICNGRjAwMDA7XFxyXFxuICAgICAgICBkaXNwbGF5OiBub25lO1xcclxcbiAgICBcXHJcXG4gICAgICAgICYuY2xpY2tlZCB7XFxyXFxuICAgICAgICAgICAgZGlzcGxheTogYmxvY2s7XFxyXFxuICAgICAgICB9XFxyXFxuICAgIH1cXHJcXG5cXHJcXG4gICAgJjpob3ZlciB7XFxyXFxuICAgICAgICAuZ2lkIHtcXHJcXG4gICAgICAgICAgICBkaXNwbGF5OiBibG9jaztcXHJcXG4gICAgICAgIH1cXHJcXG4gICAgfVxcclxcblxcclxcbiAgICBib3JkZXItcmlnaHQ6IDFweCBzb2xpZCAjQjBCMEIwO1xcclxcbiAgICBib3JkZXItYm90dG9tOiAxcHggc29saWQgI0IwQjBCMDtcXHJcXG5cXHJcXG4gICAgYm9yZGVyLXJhZGl1czogNHB4O1xcclxcbn1cXHJcXG5cXHJcXG4uYWRkLWNvbnRhaW5lciB7XFxyXFxuICAgIHBvc2l0aW9uOnJlbGF0aXZlO1xcclxcbn1cIl0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcblxuIiwiXG52YXIgY29udGVudCA9IHJlcXVpcmUoXCIhIS4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzPz9yZWYtLTYtMSEuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvbGliL2xvYWRlci5qcz8/cmVmLS02LTIhLi9ncmlkLmNvbXBvbmVudC5zY3NzXCIpO1xuXG5pZih0eXBlb2YgY29udGVudCA9PT0gJ3N0cmluZycpIGNvbnRlbnQgPSBbW21vZHVsZS5pZCwgY29udGVudCwgJyddXTtcblxudmFyIHRyYW5zZm9ybTtcbnZhciBpbnNlcnRJbnRvO1xuXG5cblxudmFyIG9wdGlvbnMgPSB7XCJobXJcIjp0cnVlfVxuXG5vcHRpb25zLnRyYW5zZm9ybSA9IHRyYW5zZm9ybVxub3B0aW9ucy5pbnNlcnRJbnRvID0gdW5kZWZpbmVkO1xuXG52YXIgdXBkYXRlID0gcmVxdWlyZShcIiEuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2xpYi9hZGRTdHlsZXMuanNcIikoY29udGVudCwgb3B0aW9ucyk7XG5cbmlmKGNvbnRlbnQubG9jYWxzKSBtb2R1bGUuZXhwb3J0cyA9IGNvbnRlbnQubG9jYWxzO1xuXG5pZihtb2R1bGUuaG90KSB7XG5cdG1vZHVsZS5ob3QuYWNjZXB0KFwiISEuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcz8/cmVmLS02LTEhLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2xpYi9sb2FkZXIuanM/P3JlZi0tNi0yIS4vZ3JpZC5jb21wb25lbnQuc2Nzc1wiLCBmdW5jdGlvbigpIHtcblx0XHR2YXIgbmV3Q29udGVudCA9IHJlcXVpcmUoXCIhIS4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzPz9yZWYtLTYtMSEuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvbGliL2xvYWRlci5qcz8/cmVmLS02LTIhLi9ncmlkLmNvbXBvbmVudC5zY3NzXCIpO1xuXG5cdFx0aWYodHlwZW9mIG5ld0NvbnRlbnQgPT09ICdzdHJpbmcnKSBuZXdDb250ZW50ID0gW1ttb2R1bGUuaWQsIG5ld0NvbnRlbnQsICcnXV07XG5cblx0XHR2YXIgbG9jYWxzID0gKGZ1bmN0aW9uKGEsIGIpIHtcblx0XHRcdHZhciBrZXksIGlkeCA9IDA7XG5cblx0XHRcdGZvcihrZXkgaW4gYSkge1xuXHRcdFx0XHRpZighYiB8fCBhW2tleV0gIT09IGJba2V5XSkgcmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRpZHgrKztcblx0XHRcdH1cblxuXHRcdFx0Zm9yKGtleSBpbiBiKSBpZHgtLTtcblxuXHRcdFx0cmV0dXJuIGlkeCA9PT0gMDtcblx0XHR9KGNvbnRlbnQubG9jYWxzLCBuZXdDb250ZW50LmxvY2FscykpO1xuXG5cdFx0aWYoIWxvY2FscykgdGhyb3cgbmV3IEVycm9yKCdBYm9ydGluZyBDU1MgSE1SIGR1ZSB0byBjaGFuZ2VkIGNzcy1tb2R1bGVzIGxvY2Fscy4nKTtcblxuXHRcdHVwZGF0ZShuZXdDb250ZW50KTtcblx0fSk7XG5cblx0bW9kdWxlLmhvdC5kaXNwb3NlKGZ1bmN0aW9uKCkgeyB1cGRhdGUoKTsgfSk7XG59IiwiZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIikodHJ1ZSk7XG4vLyBNb2R1bGVcbmV4cG9ydHMucHVzaChbbW9kdWxlLmlkLCBcIiNzbmFwZ3JpZCB7XFxuICBmb250LXN0eWxlOiBpdGFsaWM7IH1cXG5cIiwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJDOi9Vc2Vycy9nYXJyaWNrL3NvdXJjZS9yZXBvcy9zbmFwZm9ybS9lbmdpbmUvYXNzZXRzL3N0eWxlL2VuZ2luZS9hc3NldHMvc3R5bGUvaW5kZXguc2Nzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQTtFQUNJLGtCQUFrQixFQUFBXCIsXCJmaWxlXCI6XCJpbmRleC5zY3NzXCIsXCJzb3VyY2VzQ29udGVudFwiOltcIiNzbmFwZ3JpZCB7XFxyXFxuICAgIGZvbnQtc3R5bGU6IGl0YWxpYztcXHJcXG59XCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG5cbiIsImltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQgfSBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCB7IHN0b3JlIH0gZnJvbSAnLi4vLi4vY29uZmlnL3JlZHV4L3JlZHV4LnN0b3JlJztcclxuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gJ3JlYWN0LXJlZHV4JztcclxuaW1wb3J0IHsgZ0NsaWNrZWQgfSBmcm9tICcuLi8uLi9jb25maWcvcmVkdXgvcmVkdXguYWN0aW9ucyc7IFxyXG5cclxuaW1wb3J0ICcuLi8uLi8uLi9hc3NldHMvc3R5bGUvY29tcG9uZW50cy9hZGQvYWRkLnNjc3MnO1xyXG5cclxuY29uc3QgbWFwU3RhdGVUb1Byb3BzID0gKHN0YXRlKSA9PiBzdGF0ZTtcclxuXHJcbmZ1bmN0aW9uIG1hcERpc3BhdGNoVG9Qcm9wcyhkaXNwYXRjaCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBnQ2xpY2tlZDogcGF5bG9hZCA9PiBkaXNwYXRjaChnQ2xpY2tlZChwYXlsb2FkKSlcclxuICAgIH07XHJcbn1cclxuXHJcbmNsYXNzIEFkZENvbXBvbmVudCBleHRlbmRzIENvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuXHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcclxuXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5oYW5kbGVPdXRzaWRlQ2xpY2sgPSB0aGlzLmhhbmRsZU91dHNpZGVDbGljay5iaW5kKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbXBvbmVudFdpbGxNb3VudCgpIHtcclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLmhhbmRsZU91dHNpZGVDbGljaywgZmFsc2UpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xyXG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMuaGFuZGxlT3V0c2lkZUNsaWNrLCBmYWxzZSk7XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlT3V0c2lkZUNsaWNrKGUpIHtcclxuICAgICAgICBpZiAodGhpcy5wcm9wcy5ub2RlLmNvbnRhaW5zKGUudGFyZ2V0KSB8fCB0aGlzLmFkZC5jb250YWlucyhlLnRhcmdldCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5wcm9wcy5nQ2xpY2tlZCh7XHJcbiAgICAgICAgICAgIGFkZENvbXBvbmVudDogbnVsbCxcclxuICAgICAgICAgICAgZ0NsYXNzTGlzdDogJ2dpZCdcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiByZWY9e2FkZCA9PiB0aGlzLmFkZCA9IGFkZH0gY2xhc3NOYW1lPVwiYWRkXCIgc3R5bGU9e3sndG9wJzogdGhpcy5wcm9wcy50b3AsICdsZWZ0JzogdGhpcy5wcm9wcy5sZWZ0fX0+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImFkZC1jb250ZW50XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgQUREXHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgLy8gICAgIDxkaXYgc3R5bGU9XCJwb3NpdGlvbjpyZWxhdGl2ZTtcIj5cclxuICBcdFx0Ly8gXHQ8ZGl2IGNsYXNzPVwiaW5wVG1wbENsb3NlXCI+XHJcblx0ICBcdC8vIFx0XHQ8c3BhbiBjbGFzcz1cImNsb3NlIGhhaXJsaW5lXCI+PC9zcGFuPlxyXG5cdCAgXHQvLyBcdDwvZGl2PlxyXG5cdCAgXHQvLyBcdDxkaXYgY2xhc3M9XCJmb3JtRGl2XCI+XHJcblx0XHQvLyAgIFx0XHQ8bGFiZWw+SW5wdXQgVHlwZTwvbGFiZWw+XHJcblx0XHQvLyAgIFx0XHQ8ZGl2IGNsYXNzPVwiaW5wXCIgc3R5bGU9XCJtYXJnaW46M3B4IDAgMCAwO1wiPlxyXG5cdFx0Ly8gICBcdFx0XHQ8c2VsZWN0IGNsYXNzPVwiaW5wdXREaXZcIiBuYW1lPVwiaW5wdXRUeXBlXCI+XHJcblx0XHQvLyAgIFx0XHRcdFx0PG9wdGlvbiB2YWx1ZT1cIlwiPlNlbGVjdC4uLjwvb3B0aW9uPlxyXG5cdFx0Ly8gICBcdFx0XHQ8L3NlbGVjdD5cclxuXHRcdC8vICAgXHRcdDwvZGl2PlxyXG5cdFx0Ly8gICBcdFx0PGRpdiBjbGFzcz1cImVycm9yRGl2XCI+XHJcblx0XHQvLyAgIFx0XHRcdDxzcGFuIGNsYXNzPVwiY2hhbmdlRXJyb3IgaW5wdXRUeXBlRXJyb3JcIj48L3NwYW4+XHJcblx0XHQvLyAgIFx0XHQ8L2Rpdj5cclxuXHQgIFx0Ly8gXHQ8L2Rpdj5cclxuICBcdFx0Ly8gPC9kaXY+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgQWRkID0gY29ubmVjdChtYXBTdGF0ZVRvUHJvcHMsIG1hcERpc3BhdGNoVG9Qcm9wcykoQWRkQ29tcG9uZW50KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IEFkZDsiLCJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50IH0gZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgeyBzdG9yZSB9IGZyb20gJy4uL2NvbmZpZy9yZWR1eC9yZWR1eC5zdG9yZSc7XHJcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCc7XHJcbmltcG9ydCB7IGdDbGlja2VkIH0gZnJvbSAnLi4vY29uZmlnL3JlZHV4L3JlZHV4LmFjdGlvbnMnO1xyXG5cclxuaW1wb3J0IEFkZENvbXBvbmVudCBmcm9tICcuL2FkZC9hZGQuY29tcG9uZW50JztcclxuXHJcbmNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9IChzdGF0ZSkgPT4gc3RhdGU7XHJcblxyXG5mdW5jdGlvbiBtYXBEaXNwYXRjaFRvUHJvcHMoZGlzcGF0Y2gpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgZ0NsaWNrZWQ6IHBheWxvYWQgPT4gZGlzcGF0Y2goZ0NsaWNrZWQocGF5bG9hZCkpXHJcbiAgICB9O1xyXG59XHJcblxyXG5jbGFzcyBHQ29tcG9uZW50IGV4dGVuZHMgQ29tcG9uZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG5cclxuICAgICAgICB0aGlzLnN0YXRlID0ge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmhhbmRsZUNsaWNrID0gdGhpcy5oYW5kbGVDbGljay5iaW5kKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZUNsaWNrKGUpIHtcclxuICAgICAgICBjb25zdCB7IGNlbGxXaWR0aCwgY2VsbEhlaWdodCB9ID0gc3RvcmUuZ2V0U3RhdGUoKTtcclxuXHJcbiAgICAgICAgdmFyIHggPSBNYXRoLmZsb29yKGUubmF0aXZlRXZlbnQub2Zmc2V0WCAvIGNlbGxXaWR0aCkgKiBjZWxsV2lkdGg7XHJcbiAgICAgICAgdmFyIHkgPSBNYXRoLmZsb29yKGUubmF0aXZlRXZlbnQub2Zmc2V0WSAvIGNlbGxIZWlnaHQpICogY2VsbEhlaWdodDtcclxuICAgICAgICB2YXIgY2VsbFRyYW5zZm9ybSA9ICd0cmFuc2xhdGUoJyArIHggKyAnLCcgKyB5ICsgJyknO1xyXG5cclxuICAgICAgICBjb25zdCBsZWZ0ID0geCArIChjZWxsV2lkdGggLyAyKTtcclxuICAgICAgICBjb25zdCB0b3AgPSB5ICsgKGNlbGxIZWlnaHQgLyAyKTtcclxuXHJcbiAgICAgICAgdGhpcy5wcm9wcy5nQ2xpY2tlZCh7XHJcbiAgICAgICAgICAgIGNlbGxUcmFuc2Zvcm0sXHJcbiAgICAgICAgICAgIGN1cnJlbnRfeDogeCxcclxuICAgICAgICAgICAgY3VycmVudF95OiB5LFxyXG4gICAgICAgICAgICBhZGRDb21wb25lbnQ6IDxBZGRDb21wb25lbnQgdG9wPXt0b3B9IGxlZnQ9e2xlZnR9IC8+LFxyXG4gICAgICAgICAgICBnQ2xhc3NMaXN0OiAnZ2lkIGNsaWNrZWQnXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgZ0NsYXNzTGlzdCB9ID0gc3RvcmUuZ2V0U3RhdGUoKTtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZyByZWY9e2VsID0+IHRoaXMuZWwgPSBlbH0gY2xhc3NOYW1lPXtnQ2xhc3NMaXN0fSB0cmFuc2Zvcm09e3RoaXMucHJvcHMudHJhbnNmb3JtfSBvbkNsaWNrPXt0aGlzLmhhbmRsZUNsaWNrfT5cclxuICAgICAgICAgICAgICAgIDxyZWN0IGNsYXNzTmFtZT1cImhvdmVyLXJlY3RcIiB3aWR0aD17dGhpcy5wcm9wcy53aWR0aH0gaGVpZ2h0PXt0aGlzLnByb3BzLmhlaWdodH0gLz4gXHJcbiAgICAgICAgICAgIDwvZz5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBHID0gY29ubmVjdChtYXBTdGF0ZVRvUHJvcHMsIG1hcERpc3BhdGNoVG9Qcm9wcykoR0NvbXBvbmVudCk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBHOyIsImltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQgfSBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCBHcmlkQ29tcG9uZW50IGZyb20gJy4vY29tcG9uZW50cy9ncmlkLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IFByb3ZpZGVyIH0gZnJvbSAncmVhY3QtcmVkdXgnO1xyXG5pbXBvcnQgeyBzdG9yZSB9IGZyb20gJy4vY29uZmlnL3JlZHV4L3JlZHV4LnN0b3JlJztcclxuXHJcbmltcG9ydCAnLi4vYXNzZXRzL3N0eWxlL2luZGV4LnNjc3MnO1xyXG5cclxuY2xhc3MgRW5naW5lQ29tcG9uZW50IGV4dGVuZHMgQ29tcG9uZW50IHtcclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8UHJvdmlkZXIgc3RvcmU9e3N0b3JlfT5cclxuICAgICAgICAgICAgICAgIDxkaXYgaWQ9XCJzbmFwZ3JpZFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxHcmlkQ29tcG9uZW50IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2aWV3V2lkdGg9e3RoaXMucHJvcHMudmlld1dpZHRofSBcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmlld0hlaWdodD17dGhpcy5wcm9wcy52aWV3SGVpZ2h0fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjZWxsV2lkdGg9e3RoaXMucHJvcHMuY2VsbFdpZHRofVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjZWxsSGVpZ2h0PXt0aGlzLnByb3BzLmNlbGxIZWlnaHR9IC8+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9Qcm92aWRlcj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgRW5naW5lQ29tcG9uZW50OyIsImltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQgfSBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCB7IHN0b3JlIH0gZnJvbSAnLi4vY29uZmlnL3JlZHV4L3JlZHV4LnN0b3JlJztcclxuaW1wb3J0IHsgdXBkYXRlVmlld1NldHRpbmdzLCBnQ2xpY2tlZCB9IGZyb20gJy4uL2NvbmZpZy9yZWR1eC9yZWR1eC5hY3Rpb25zJztcclxuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gJ3JlYWN0LXJlZHV4JztcclxuXHJcbmltcG9ydCBHQ29tcG9uZW50IGZyb20gJy4vZy5jb21wb25lbnQnO1xyXG5pbXBvcnQgQWRkQ29tcG9uZW50IGZyb20gJy4vYWRkL2FkZC5jb21wb25lbnQnO1xyXG5cclxuaW1wb3J0ICcuLi8uLi9hc3NldHMvaW1hZ2VzL21ndC1sb2dvLnBuZyc7XHJcbmltcG9ydCAnLi4vLi4vYXNzZXRzL3N0eWxlL2NvbXBvbmVudHMvZ3JpZC5jb21wb25lbnQuc2Nzcyc7XHJcblxyXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSAoc3RhdGUpID0+IHN0YXRlO1xyXG5cclxuZnVuY3Rpb24gbWFwRGlzcGF0Y2hUb1Byb3BzKGRpc3BhdGNoKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHVwZGF0ZVZpZXdTZXR0aW5nczogcGF5bG9hZCA9PiBkaXNwYXRjaCh1cGRhdGVWaWV3U2V0dGluZ3MocGF5bG9hZCkpLFxyXG4gICAgICAgIGdDbGlja2VkOiBwYXlsb2FkID0+IGRpc3BhdGNoKGdDbGlja2VkKHBheWxvYWQpKVxyXG4gICAgfTtcclxufVxyXG5cclxuY2xhc3MgR3JpZENvbXBvbmVudCBleHRlbmRzIENvbXBvbmVudCB7XHJcbiAgICBzbWFsbEdyaWRQYXRoID0gYE0gJHt0aGlzLnByb3BzLmNlbGxXaWR0aH0gMCBMIDAgMCAwICR7dGhpcy5wcm9wcy5jZWxsSGVpZ2h0fWA7XHJcbiAgICBncmlkUGF0aCA9IGBNICR7dGhpcy5wcm9wcy5jZWxsV2lkdGggKiAxMH0gMCBMIDAgMCAwICR7dGhpcy5wcm9wcy5jZWxsSGVpZ2h0ICogMTB9YDtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuXHJcbiAgICAgICAgY29uc3QgcGF5bG9hZCA9IHtcclxuICAgICAgICAgICAgdmlld1dpZHRoOiB0aGlzLnByb3BzLnZpZXdXaWR0aCxcclxuICAgICAgICAgICAgdmlld0hlaWdodDogdGhpcy5wcm9wcy52aWV3SGVpZ2h0LFxyXG4gICAgICAgICAgICBjZWxsV2lkdGg6IHRoaXMucHJvcHMuY2VsbFdpZHRoLFxyXG4gICAgICAgICAgICBjZWxsSGVpZ2h0OiB0aGlzLnByb3BzLmNlbGxIZWlnaHQsXHJcbiAgICAgICAgICAgIGNlbGxUcmFuc2Zvcm06IHRoaXMucHJvcHMuY2VsbFRyYW5zZm9ybVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5wcm9wcy51cGRhdGVWaWV3U2V0dGluZ3MocGF5bG9hZCk7XHJcblxyXG4gICAgICAgIHRoaXMubW91c2VNb3ZlID0gdGhpcy5tb3VzZU1vdmUuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLmhhbmRsZVN2Z0NsaWNrID0gdGhpcy5oYW5kbGVTdmdDbGljay5iaW5kKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIG1vdXNlTW92ZShlKSB7XHJcbiAgICAgICAgY29uc3QgeyBhZGRDb21wb25lbnQgfSA9IHN0b3JlLmdldFN0YXRlKCk7XHJcbiAgICAgICAgaWYgKGFkZENvbXBvbmVudCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgeCA9IE1hdGguZmxvb3IoZS5uYXRpdmVFdmVudC5vZmZzZXRYIC8gdGhpcy5wcm9wcy5jZWxsV2lkdGgpICogdGhpcy5wcm9wcy5jZWxsV2lkdGg7XHJcbiAgICAgICAgdmFyIHkgPSBNYXRoLmZsb29yKGUubmF0aXZlRXZlbnQub2Zmc2V0WSAvIHRoaXMucHJvcHMuY2VsbEhlaWdodCkgKiB0aGlzLnByb3BzLmNlbGxIZWlnaHQ7XHJcbiAgICAgICAgdmFyIGNlbGxUcmFuc2Zvcm0gPSAndHJhbnNsYXRlKCcgKyB4ICsgJywnICsgeSArICcpJztcclxuXHJcbiAgICAgICAgdGhpcy5wcm9wcy51cGRhdGVWaWV3U2V0dGluZ3MoeyBjZWxsVHJhbnNmb3JtIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZVN2Z0NsaWNrKGUpIHtcclxuICAgICAgICBjb25zdCB7IGNlbGxXaWR0aCwgY2VsbEhlaWdodCB9ID0gc3RvcmUuZ2V0U3RhdGUoKTtcclxuXHJcbiAgICAgICAgdmFyIHggPSBNYXRoLmZsb29yKGUubmF0aXZlRXZlbnQub2Zmc2V0WCAvIGNlbGxXaWR0aCkgKiBjZWxsV2lkdGg7XHJcbiAgICAgICAgdmFyIHkgPSBNYXRoLmZsb29yKGUubmF0aXZlRXZlbnQub2Zmc2V0WSAvIGNlbGxIZWlnaHQpICogY2VsbEhlaWdodDtcclxuICAgICAgICB2YXIgY2VsbFRyYW5zZm9ybSA9ICd0cmFuc2xhdGUoJyArIHggKyAnLCcgKyB5ICsgJyknO1xyXG5cclxuICAgICAgICBjb25zdCBsZWZ0ID0geCArIChjZWxsV2lkdGggLyAyKTtcclxuICAgICAgICBjb25zdCB0b3AgPSB5ICsgKGNlbGxIZWlnaHQgLyAyKTtcclxuXHJcbiAgICAgICAgdGhpcy5wcm9wcy5nQ2xpY2tlZCh7XHJcbiAgICAgICAgICAgIGNlbGxUcmFuc2Zvcm0sXHJcbiAgICAgICAgICAgIGN1cnJlbnRfeDogeCxcclxuICAgICAgICAgICAgY3VycmVudF95OiB5LFxyXG4gICAgICAgICAgICBhZGRDb21wb25lbnQ6IDxBZGRDb21wb25lbnQgdG9wPXt0b3B9IGxlZnQ9e2xlZnR9IC8+LFxyXG4gICAgICAgICAgICBnQ2xhc3NMaXN0OiAnZ2lkIGNsaWNrZWQnXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgY2VsbFRyYW5zZm9ybSwgdmlld1dpZHRoLCB2aWV3SGVpZ2h0LCBjZWxsV2lkdGgsIGNlbGxIZWlnaHQsIGFkZENvbXBvbmVudCB9ID0gc3RvcmUuZ2V0U3RhdGUoKTtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJhZGQtY29udGFpbmVyXCIgcmVmPXtjb250YWluZXIgPT4gdGhpcy5jb250YWluZXIgPSBjb250YWluZXJ9PlxyXG4gICAgICAgICAgICAgICAgPHN2ZyByZWY9e25vZGUgPT4gdGhpcy5ub2RlID0gbm9kZX0gY2xhc3NOYW1lPVwidmlldy1zdmdcIiB3aWR0aD17dmlld1dpZHRofSBoZWlnaHQ9e3ZpZXdIZWlnaHR9IHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGVmcz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHBhdHRlcm4gaWQ9XCJzbWFsbEdyaWRcIiB3aWR0aD17Y2VsbFdpZHRofSBoZWlnaHQ9e2NlbGxIZWlnaHR9IHBhdHRlcm5Vbml0cz1cInVzZXJTcGFjZU9uVXNlXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPXt0aGlzLnNtYWxsR3JpZFBhdGh9IGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiZ3JheVwiIHN0cm9rZVdpZHRoPVwiMC41XCIvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3BhdHRlcm4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxwYXR0ZXJuIGlkPVwiZ3JpZFwiIHdpZHRoPXtjZWxsV2lkdGggKiAxMH0gaGVpZ2h0PXtjZWxsSGVpZ2h0ICogMTB9IHBhdHRlcm5Vbml0cz1cInVzZXJTcGFjZU9uVXNlXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cmVjdCB3aWR0aD17Y2VsbFdpZHRoICogMTB9IGhlaWdodD17Y2VsbEhlaWdodCAqIDEwfSBmaWxsPVwidXJsKCNzbWFsbEdyaWQpXCIvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD17dGhpcy5ncmlkUGF0aH0gZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJncmF5XCIgc3Ryb2tlV2lkdGg9XCIxXCIvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3BhdHRlcm4+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kZWZzPlxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICA8cmVjdCB3aWR0aD1cIjEwMCVcIiBoZWlnaHQ9XCIxMDAlXCIgZmlsbD1cInVybCgjZ3JpZClcIiBvbk1vdXNlTW92ZT17dGhpcy5tb3VzZU1vdmV9IG9uQ2xpY2s9e3RoaXMuaGFuZGxlU3ZnQ2xpY2t9IC8+XHJcbiAgICAgICAgICAgICAgICAgICAgPEdDb21wb25lbnQgcmVmPXtnID0+IHRoaXMuZyA9IGd9IHdpZHRoPXtjZWxsV2lkdGh9IGhlaWdodD17Y2VsbEhlaWdodH0gdHJhbnNmb3JtPXtjZWxsVHJhbnNmb3JtfSBub2RlPXt0aGlzLm5vZGV9IGNvbnRhaW5lcj17dGhpcy5jb250YWluZXJ9IGFkZD17dGhpcy5hZGR9IC8+XHJcbiAgICAgICAgICAgICAgICA8L3N2Zz5cclxuICAgICAgICAgICAgICAgIHsgYWRkQ29tcG9uZW50XHJcbiAgICAgICAgICAgICAgICAgICAgPyA8QWRkQ29tcG9uZW50IHRvcD17YWRkQ29tcG9uZW50LnByb3BzLnRvcH0gbGVmdD17YWRkQ29tcG9uZW50LnByb3BzLmxlZnR9IGc9e3RoaXMuZ30gbm9kZT17dGhpcy5ub2RlfSBjb250YWluZXI9e3RoaXMuY29udGFpbmVyfSAvPlxyXG4gICAgICAgICAgICAgICAgICAgIDogbnVsbCB9XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKVxyXG4gICAgfVxyXG59O1xyXG5cclxuY29uc3QgR3JpZCA9IGNvbm5lY3QobWFwU3RhdGVUb1Byb3BzLCBtYXBEaXNwYXRjaFRvUHJvcHMpKEdyaWRDb21wb25lbnQpO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgR3JpZDsiLCJleHBvcnQgY29uc3QgVVBEQVRFX1ZJRVdfU0VUVElOR1MgPSAnVVBEQVRFX1ZJRVdfU0VUVElOR1MnO1xyXG5leHBvcnQgY29uc3QgR19DTElDS0VEID0gJ0dfQ0xJQ0tFRCc7IiwiaW1wb3J0IHsgVVBEQVRFX1ZJRVdfU0VUVElOR1MsIEdfQ0xJQ0tFRCB9IGZyb20gJy4vcmVkdXguYWN0aW9ucy50eXBlcyc7XHJcblxyXG5leHBvcnQgY29uc3QgdXBkYXRlVmlld1NldHRpbmdzID0gKHBheWxvYWQpID0+IHtcclxuICAgIHJldHVybiB7IHR5cGU6IFVQREFURV9WSUVXX1NFVFRJTkdTLCBwYXlsb2FkIH07XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBnQ2xpY2tlZCA9IChwYXlsb2FkKSA9PiB7XHJcbiAgICByZXR1cm4geyB0eXBlOiBHX0NMSUNLRUQsIHBheWxvYWQgfTtcclxufTsiLCJcbnZhciBjb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanM/P3JlZi0tNi0xIS4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9saWIvbG9hZGVyLmpzPz9yZWYtLTYtMiEuL2FkZC5zY3NzXCIpO1xuXG5pZih0eXBlb2YgY29udGVudCA9PT0gJ3N0cmluZycpIGNvbnRlbnQgPSBbW21vZHVsZS5pZCwgY29udGVudCwgJyddXTtcblxudmFyIHRyYW5zZm9ybTtcbnZhciBpbnNlcnRJbnRvO1xuXG5cblxudmFyIG9wdGlvbnMgPSB7XCJobXJcIjp0cnVlfVxuXG5vcHRpb25zLnRyYW5zZm9ybSA9IHRyYW5zZm9ybVxub3B0aW9ucy5pbnNlcnRJbnRvID0gdW5kZWZpbmVkO1xuXG52YXIgdXBkYXRlID0gcmVxdWlyZShcIiEuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2xpYi9hZGRTdHlsZXMuanNcIikoY29udGVudCwgb3B0aW9ucyk7XG5cbmlmKGNvbnRlbnQubG9jYWxzKSBtb2R1bGUuZXhwb3J0cyA9IGNvbnRlbnQubG9jYWxzO1xuXG5pZihtb2R1bGUuaG90KSB7XG5cdG1vZHVsZS5ob3QuYWNjZXB0KFwiISEuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcz8/cmVmLS02LTEhLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2xpYi9sb2FkZXIuanM/P3JlZi0tNi0yIS4vYWRkLnNjc3NcIiwgZnVuY3Rpb24oKSB7XG5cdFx0dmFyIG5ld0NvbnRlbnQgPSByZXF1aXJlKFwiISEuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcz8/cmVmLS02LTEhLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2xpYi9sb2FkZXIuanM/P3JlZi0tNi0yIS4vYWRkLnNjc3NcIik7XG5cblx0XHRpZih0eXBlb2YgbmV3Q29udGVudCA9PT0gJ3N0cmluZycpIG5ld0NvbnRlbnQgPSBbW21vZHVsZS5pZCwgbmV3Q29udGVudCwgJyddXTtcblxuXHRcdHZhciBsb2NhbHMgPSAoZnVuY3Rpb24oYSwgYikge1xuXHRcdFx0dmFyIGtleSwgaWR4ID0gMDtcblxuXHRcdFx0Zm9yKGtleSBpbiBhKSB7XG5cdFx0XHRcdGlmKCFiIHx8IGFba2V5XSAhPT0gYltrZXldKSByZXR1cm4gZmFsc2U7XG5cdFx0XHRcdGlkeCsrO1xuXHRcdFx0fVxuXG5cdFx0XHRmb3Ioa2V5IGluIGIpIGlkeC0tO1xuXG5cdFx0XHRyZXR1cm4gaWR4ID09PSAwO1xuXHRcdH0oY29udGVudC5sb2NhbHMsIG5ld0NvbnRlbnQubG9jYWxzKSk7XG5cblx0XHRpZighbG9jYWxzKSB0aHJvdyBuZXcgRXJyb3IoJ0Fib3J0aW5nIENTUyBITVIgZHVlIHRvIGNoYW5nZWQgY3NzLW1vZHVsZXMgbG9jYWxzLicpO1xuXG5cdFx0dXBkYXRlKG5ld0NvbnRlbnQpO1xuXHR9KTtcblxuXHRtb2R1bGUuaG90LmRpc3Bvc2UoZnVuY3Rpb24oKSB7IHVwZGF0ZSgpOyB9KTtcbn0iLCJpbXBvcnQgeyBVUERBVEVfVklFV19TRVRUSU5HUywgR19DTElDS0VEIH0gZnJvbSAnLi9yZWR1eC5hY3Rpb25zLnR5cGVzJztcclxuXHJcbmNvbnN0IGluaXRpYWxTdGF0ZSA9IHtcclxuICAgIGdDbGFzc0xpc3Q6ICdnaWQnXHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgcmVkdWNlciA9IChzdGF0ZSA9IGluaXRpYWxTdGF0ZSwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBVUERBVEVfVklFV19TRVRUSU5HUzpcclxuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLCB7XHJcbiAgICAgICAgICAgICAgICB2aWV3V2lkdGg6IGFjdGlvbi5wYXlsb2FkLnZpZXdXaWR0aCB8fCBzdGF0ZS52aWV3V2lkdGgsXHJcbiAgICAgICAgICAgICAgICB2aWV3SGVpZ2h0OiBhY3Rpb24ucGF5bG9hZC52aWV3SGVpZ2h0IHx8IHN0YXRlLnZpZXdIZWlnaHQsXHJcbiAgICAgICAgICAgICAgICBjZWxsV2lkdGg6IGFjdGlvbi5wYXlsb2FkLmNlbGxXaWR0aCB8fCBzdGF0ZS5jZWxsV2lkdGgsXHJcbiAgICAgICAgICAgICAgICBjZWxsSGVpZ2h0OiBhY3Rpb24ucGF5bG9hZC5jZWxsSGVpZ2h0IHx8IHN0YXRlLmNlbGxIZWlnaHQsXHJcbiAgICAgICAgICAgICAgICBjZWxsVHJhbnNmb3JtOiBhY3Rpb24ucGF5bG9hZC5jZWxsVHJhbnNmb3JtIHx8IHN0YXRlLmNlbGxUcmFuc2Zvcm0sXHJcbiAgICAgICAgICAgICAgICBjdXJyZW50X3g6IGFjdGlvbi5wYXlsb2FkLmN1cnJlbnRfeCB8fCBzdGF0ZS5jdXJyZW50X3gsXHJcbiAgICAgICAgICAgICAgICBjdXJyZW50X3k6IGFjdGlvbi5wYXlsb2FkLmN1cnJlbnRfeSB8fCBzdGF0ZS5jdXJyZW50X3lcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgY2FzZSBHX0NMSUNLRUQ6XHJcbiAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwge1xyXG4gICAgICAgICAgICAgICAgY2VsbFRyYW5zZm9ybTogYWN0aW9uLnBheWxvYWQuY2VsbFRyYW5zZm9ybSB8fCBzdGF0ZS5jZWxsVHJhbnNmb3JtLFxyXG4gICAgICAgICAgICAgICAgY3VycmVudF94OiBhY3Rpb24ucGF5bG9hZC5jdXJyZW50X3ggfHwgc3RhdGUuY3VycmVudF94LFxyXG4gICAgICAgICAgICAgICAgY3VycmVudF95OiBhY3Rpb24ucGF5bG9hZC5jdXJyZW50X3kgfHwgc3RhdGUuY3VycmVudF95LFxyXG4gICAgICAgICAgICAgICAgYWRkQ29tcG9uZW50OiBhY3Rpb24ucGF5bG9hZC5hZGRDb21wb25lbnQsXHJcbiAgICAgICAgICAgICAgICBnQ2xhc3NMaXN0OiBhY3Rpb24ucGF5bG9hZC5nQ2xhc3NMaXN0IHx8IHN0YXRlLmdDbGFzc0xpc3RcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gc3RhdGU7XHJcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyArIFwiZW5naW5lL2Fzc2V0cy9pbWFnZXMvbWd0LWxvZ28ucG5nXCI7Il0sInNvdXJjZVJvb3QiOiIifQ==