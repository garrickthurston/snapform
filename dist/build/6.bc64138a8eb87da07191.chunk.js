(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[6],{

/***/ "1Jr5":
/*!*****************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js??ref--6-1!./node_modules/sass-loader/lib/loader.js??ref--6-2!./client/app/assets/style/shared/menu.scss ***!
  \*****************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../../../node_modules/css-loader/dist/runtime/api.js */ "JPst")(true);
// Module
exports.push([module.i, "nav {\n  z-index: 50; }\n", "",{"version":3,"sources":["C:/Users/garri/source/repos/snapform/client/app/assets/style/shared/client/app/assets/style/shared/menu.scss"],"names":[],"mappings":"AAAA;EACI,WAAW,EAAA","file":"menu.scss","sourcesContent":["nav {\r\n    z-index: 50;\r\n}"],"sourceRoot":""}]);



/***/ }),

/***/ "86dI":
/*!**************************************************!*\
  !*** ./client/app/assets/style/shared/menu.scss ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../../../../node_modules/css-loader/dist/cjs.js??ref--6-1!../../../../../node_modules/sass-loader/lib/loader.js??ref--6-2!./menu.scss */ "1Jr5");

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

/***/ "PWw0":
/*!************************************************************!*\
  !*** ./client/app/src/shared/components/menu.component.js ***!
  \************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ "/MKj");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-router-dom */ "eO8H");
/* harmony import */ var _config_redux_redux_store__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../config/redux/redux.store */ "MBHU");
/* harmony import */ var _assets_style_shared_menu_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../assets/style/shared/menu.scss */ "86dI");
/* harmony import */ var _assets_style_shared_menu_scss__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_assets_style_shared_menu_scss__WEBPACK_IMPORTED_MODULE_4__);






const mapStateToProps = state => state;

class MenuComponent extends react__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      token,
      user
    } = _config_redux_redux_store__WEBPACK_IMPORTED_MODULE_3__["store"].getState();
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("nav", {
      className: "navbar navbar-expand-lg navbar-light bg-light"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_2__["NavLink"], {
      className: "nav-link",
      to: "/"
    }, "Snapform"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
      className: "navbar-toggler",
      type: "button",
      "data-toggle": "collapse",
      "data-target": "#navbarSupportedContent",
      "aria-controls": "navbarSupportedContent",
      "aria-expanded": "false",
      "aria-label": "Toggle navigation"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
      className: "navbar-toggler-icon"
    })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "collapse navbar-collapse",
      id: "navbarSupportedContent"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("ul", {
      className: "navbar-nav mr-auto"
    }, token && user ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("li", {
      className: "nav-item active"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_2__["NavLink"], {
      className: "nav-link",
      to: "/workspace"
    }, "Workspace")) : null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("li", {
      className: "nav-item active"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_2__["NavLink"], {
      className: "nav-link",
      to: "/docs"
    }, "Docs")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("li", {
      className: "nav-item active"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_2__["NavLink"], {
      className: "nav-link",
      to: "/tutorial"
    }, "Tutorial")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("li", {
      className: "nav-item active"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_2__["NavLink"], {
      className: "nav-link",
      to: "/blog"
    }, "Blog"))), !token && !user ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("ul", {
      className: "navbar-nav ml-auto"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("li", {
      className: "nav-item"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_2__["NavLink"], {
      onClick: this.handleLoginClick,
      className: "nav-link",
      to: "/login"
    }, "Log in"))) : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("ul", {
      className: "navbar-nav ml-auto"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("li", {
      className: "nav-item"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_2__["NavLink"], {
      className: "nav-link",
      to: "/login?l=1"
    }, "Log Out")))));
  }

}

;
const Menu = Object(react_redux__WEBPACK_IMPORTED_MODULE_1__["connect"])(mapStateToProps)(MenuComponent);
/* harmony default export */ __webpack_exports__["default"] = (Menu);

/***/ }),

/***/ "UU/X":
/*!***********************************************************!*\
  !*** ./client/app/src/shared/components/app.component.js ***!
  \***********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _menu_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./menu.component */ "PWw0");



class AppComponent extends react__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  render() {
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_menu_component__WEBPACK_IMPORTED_MODULE_1__["default"], null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "body-content"
    }, this.props.children));
  }

}

/* harmony default export */ __webpack_exports__["default"] = (AppComponent);

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9jbGllbnQvYXBwL2Fzc2V0cy9zdHlsZS9zaGFyZWQvbWVudS5zY3NzIiwid2VicGFjazovLy8uL2NsaWVudC9hcHAvYXNzZXRzL3N0eWxlL3NoYXJlZC9tZW51LnNjc3M/MDg4OCIsIndlYnBhY2s6Ly8vLi9jbGllbnQvYXBwL3NyYy9zaGFyZWQvY29tcG9uZW50cy9tZW51LmNvbXBvbmVudC5qcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvYXBwL3NyYy9zaGFyZWQvY29tcG9uZW50cy9hcHAuY29tcG9uZW50LmpzIl0sIm5hbWVzIjpbIm1hcFN0YXRlVG9Qcm9wcyIsInN0YXRlIiwiTWVudUNvbXBvbmVudCIsIkNvbXBvbmVudCIsImNvbnN0cnVjdG9yIiwicHJvcHMiLCJyZW5kZXIiLCJ0b2tlbiIsInVzZXIiLCJzdG9yZSIsImdldFN0YXRlIiwiaGFuZGxlTG9naW5DbGljayIsIk1lbnUiLCJjb25uZWN0IiwiQXBwQ29tcG9uZW50IiwiY2hpbGRyZW4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBLDJCQUEyQixtQkFBTyxDQUFDLHdFQUE0RDtBQUMvRjtBQUNBLGNBQWMsUUFBUyxRQUFRLGdCQUFnQixFQUFFLFNBQVMsbUtBQW1LLDJEQUEyRCxvQkFBb0IsS0FBSyxtQkFBbUI7Ozs7Ozs7Ozs7Ozs7O0FDRHBVLGNBQWMsbUJBQU8sQ0FBQyx1SkFBNEk7O0FBRWxLLDRDQUE0QyxRQUFTOztBQUVyRDtBQUNBOzs7O0FBSUEsZUFBZTs7QUFFZjtBQUNBOztBQUVBLGFBQWEsbUJBQU8sQ0FBQyx1RUFBNEQ7O0FBRWpGOztBQUVBLEdBQUcsS0FBVSxFQUFFLEU7Ozs7Ozs7Ozs7OztBQ25CZjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7QUFFQSxNQUFNQSxlQUFlLEdBQUlDLEtBQUQsSUFBV0EsS0FBbkM7O0FBRUEsTUFBTUMsYUFBTixTQUE0QkMsK0NBQTVCLENBQXNDO0FBQ2xDQyxhQUFXLENBQUNDLEtBQUQsRUFBUTtBQUNmLFVBQU1BLEtBQU47QUFDSDs7QUFFREMsUUFBTSxHQUFHO0FBQ0wsVUFBTTtBQUFFQyxXQUFGO0FBQVNDO0FBQVQsUUFBa0JDLCtEQUFLLENBQUNDLFFBQU4sRUFBeEI7QUFFQSxXQUNJO0FBQUssZUFBUyxFQUFDO0FBQWYsT0FDSSwyREFBQyx3REFBRDtBQUFTLGVBQVMsRUFBQyxVQUFuQjtBQUE4QixRQUFFLEVBQUM7QUFBakMsa0JBREosRUFFSTtBQUFRLGVBQVMsRUFBQyxnQkFBbEI7QUFBbUMsVUFBSSxFQUFDLFFBQXhDO0FBQWlELHFCQUFZLFVBQTdEO0FBQXdFLHFCQUFZLHlCQUFwRjtBQUE4Ryx1QkFBYyx3QkFBNUg7QUFBcUosdUJBQWMsT0FBbks7QUFBMkssb0JBQVc7QUFBdEwsT0FDSTtBQUFNLGVBQVMsRUFBQztBQUFoQixNQURKLENBRkosRUFNSTtBQUFLLGVBQVMsRUFBQywwQkFBZjtBQUEwQyxRQUFFLEVBQUM7QUFBN0MsT0FDSTtBQUFJLGVBQVMsRUFBQztBQUFkLE9BQ01ILEtBQUssSUFBSUMsSUFBVCxHQUNGO0FBQUksZUFBUyxFQUFDO0FBQWQsT0FDSSwyREFBQyx3REFBRDtBQUFTLGVBQVMsRUFBQyxVQUFuQjtBQUE4QixRQUFFLEVBQUM7QUFBakMsbUJBREosQ0FERSxHQUtGLElBTkosRUFPSTtBQUFJLGVBQVMsRUFBQztBQUFkLE9BQ0ksMkRBQUMsd0RBQUQ7QUFBUyxlQUFTLEVBQUMsVUFBbkI7QUFBOEIsUUFBRSxFQUFDO0FBQWpDLGNBREosQ0FQSixFQVVJO0FBQUksZUFBUyxFQUFDO0FBQWQsT0FDSSwyREFBQyx3REFBRDtBQUFTLGVBQVMsRUFBQyxVQUFuQjtBQUE4QixRQUFFLEVBQUM7QUFBakMsa0JBREosQ0FWSixFQWFJO0FBQUksZUFBUyxFQUFDO0FBQWQsT0FDSSwyREFBQyx3REFBRDtBQUFTLGVBQVMsRUFBQyxVQUFuQjtBQUE4QixRQUFFLEVBQUM7QUFBakMsY0FESixDQWJKLENBREosRUFrQk0sQ0FBQ0QsS0FBRCxJQUFVLENBQUNDLElBQVgsR0FDRjtBQUFJLGVBQVMsRUFBQztBQUFkLE9BQ0k7QUFBSSxlQUFTLEVBQUM7QUFBZCxPQUNJLDJEQUFDLHdEQUFEO0FBQVMsYUFBTyxFQUFFLEtBQUtHLGdCQUF2QjtBQUF5QyxlQUFTLEVBQUMsVUFBbkQ7QUFBOEQsUUFBRSxFQUFDO0FBQWpFLGdCQURKLENBREosQ0FERSxHQU9GO0FBQUksZUFBUyxFQUFDO0FBQWQsT0FDSTtBQUFJLGVBQVMsRUFBQztBQUFkLE9BQ0ksMkRBQUMsd0RBQUQ7QUFBUyxlQUFTLEVBQUMsVUFBbkI7QUFBOEIsUUFBRSxFQUFDO0FBQWpDLGlCQURKLENBREosQ0F6QkosQ0FOSixDQURKO0FBd0NIOztBQWhEaUM7O0FBaURyQztBQUVELE1BQU1DLElBQUksR0FBR0MsMkRBQU8sQ0FBQ2IsZUFBRCxDQUFQLENBQXlCRSxhQUF6QixDQUFiO0FBRWVVLG1FQUFmLEU7Ozs7Ozs7Ozs7OztBQzlEQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7O0FBRUEsTUFBTUUsWUFBTixTQUEyQlgsK0NBQTNCLENBQXFDO0FBQ2pDRyxRQUFNLEdBQUc7QUFDTCxXQUNJLHdFQUNJLDJEQUFDLHVEQUFELE9BREosRUFFSTtBQUFLLGVBQVMsRUFBQztBQUFmLE9BQ0ssS0FBS0QsS0FBTCxDQUFXVSxRQURoQixDQUZKLENBREo7QUFRSDs7QUFWZ0M7O0FBYXRCRCwyRUFBZixFIiwiZmlsZSI6ImJ1aWxkLzYuYmM2NDEzOGE4ZWI4N2RhMDcxOTEuY2h1bmsuanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiKSh0cnVlKTtcbi8vIE1vZHVsZVxuZXhwb3J0cy5wdXNoKFttb2R1bGUuaWQsIFwibmF2IHtcXG4gIHotaW5kZXg6IDUwOyB9XFxuXCIsIFwiXCIse1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wiQzovVXNlcnMvZ2Fycmkvc291cmNlL3JlcG9zL3NuYXBmb3JtL2NsaWVudC9hcHAvYXNzZXRzL3N0eWxlL3NoYXJlZC9jbGllbnQvYXBwL2Fzc2V0cy9zdHlsZS9zaGFyZWQvbWVudS5zY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUFBO0VBQ0ksV0FBVyxFQUFBXCIsXCJmaWxlXCI6XCJtZW51LnNjc3NcIixcInNvdXJjZXNDb250ZW50XCI6W1wibmF2IHtcXHJcXG4gICAgei1pbmRleDogNTA7XFxyXFxufVwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuXG4iLCJcbnZhciBjb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanM/P3JlZi0tNi0xIS4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9saWIvbG9hZGVyLmpzPz9yZWYtLTYtMiEuL21lbnUuc2Nzc1wiKTtcblxuaWYodHlwZW9mIGNvbnRlbnQgPT09ICdzdHJpbmcnKSBjb250ZW50ID0gW1ttb2R1bGUuaWQsIGNvbnRlbnQsICcnXV07XG5cbnZhciB0cmFuc2Zvcm07XG52YXIgaW5zZXJ0SW50bztcblxuXG5cbnZhciBvcHRpb25zID0ge1wiaG1yXCI6dHJ1ZX1cblxub3B0aW9ucy50cmFuc2Zvcm0gPSB0cmFuc2Zvcm1cbm9wdGlvbnMuaW5zZXJ0SW50byA9IHVuZGVmaW5lZDtcblxudmFyIHVwZGF0ZSA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9saWIvYWRkU3R5bGVzLmpzXCIpKGNvbnRlbnQsIG9wdGlvbnMpO1xuXG5pZihjb250ZW50LmxvY2FscykgbW9kdWxlLmV4cG9ydHMgPSBjb250ZW50LmxvY2FscztcblxuaWYobW9kdWxlLmhvdCkge1xuXHRtb2R1bGUuaG90LmFjY2VwdChcIiEhLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanM/P3JlZi0tNi0xIS4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9saWIvbG9hZGVyLmpzPz9yZWYtLTYtMiEuL21lbnUuc2Nzc1wiLCBmdW5jdGlvbigpIHtcblx0XHR2YXIgbmV3Q29udGVudCA9IHJlcXVpcmUoXCIhIS4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzPz9yZWYtLTYtMSEuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvbGliL2xvYWRlci5qcz8/cmVmLS02LTIhLi9tZW51LnNjc3NcIik7XG5cblx0XHRpZih0eXBlb2YgbmV3Q29udGVudCA9PT0gJ3N0cmluZycpIG5ld0NvbnRlbnQgPSBbW21vZHVsZS5pZCwgbmV3Q29udGVudCwgJyddXTtcblxuXHRcdHZhciBsb2NhbHMgPSAoZnVuY3Rpb24oYSwgYikge1xuXHRcdFx0dmFyIGtleSwgaWR4ID0gMDtcblxuXHRcdFx0Zm9yKGtleSBpbiBhKSB7XG5cdFx0XHRcdGlmKCFiIHx8IGFba2V5XSAhPT0gYltrZXldKSByZXR1cm4gZmFsc2U7XG5cdFx0XHRcdGlkeCsrO1xuXHRcdFx0fVxuXG5cdFx0XHRmb3Ioa2V5IGluIGIpIGlkeC0tO1xuXG5cdFx0XHRyZXR1cm4gaWR4ID09PSAwO1xuXHRcdH0oY29udGVudC5sb2NhbHMsIG5ld0NvbnRlbnQubG9jYWxzKSk7XG5cblx0XHRpZighbG9jYWxzKSB0aHJvdyBuZXcgRXJyb3IoJ0Fib3J0aW5nIENTUyBITVIgZHVlIHRvIGNoYW5nZWQgY3NzLW1vZHVsZXMgbG9jYWxzLicpO1xuXG5cdFx0dXBkYXRlKG5ld0NvbnRlbnQpO1xuXHR9KTtcblxuXHRtb2R1bGUuaG90LmRpc3Bvc2UoZnVuY3Rpb24oKSB7IHVwZGF0ZSgpOyB9KTtcbn0iLCJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50IH0gZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSAncmVhY3QtcmVkdXgnO1xyXG5pbXBvcnQgeyBOYXZMaW5rIH0gZnJvbSAncmVhY3Qtcm91dGVyLWRvbSc7XHJcbmltcG9ydCB7IHN0b3JlIH0gZnJvbSAnLi4vLi4vY29uZmlnL3JlZHV4L3JlZHV4LnN0b3JlJztcclxuXHJcbmltcG9ydCAnLi4vLi4vLi4vYXNzZXRzL3N0eWxlL3NoYXJlZC9tZW51LnNjc3MnO1xyXG5cclxuY29uc3QgbWFwU3RhdGVUb1Byb3BzID0gKHN0YXRlKSA9PiBzdGF0ZTtcclxuXHJcbmNsYXNzIE1lbnVDb21wb25lbnQgZXh0ZW5kcyBDb21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgdG9rZW4sIHVzZXIgfSA9IHN0b3JlLmdldFN0YXRlKCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPG5hdiBjbGFzc05hbWU9XCJuYXZiYXIgbmF2YmFyLWV4cGFuZC1sZyBuYXZiYXItbGlnaHQgYmctbGlnaHRcIj5cclxuICAgICAgICAgICAgICAgIDxOYXZMaW5rIGNsYXNzTmFtZT1cIm5hdi1saW5rXCIgdG89XCIvXCI+U25hcGZvcm08L05hdkxpbms+XHJcbiAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cIm5hdmJhci10b2dnbGVyXCIgdHlwZT1cImJ1dHRvblwiIGRhdGEtdG9nZ2xlPVwiY29sbGFwc2VcIiBkYXRhLXRhcmdldD1cIiNuYXZiYXJTdXBwb3J0ZWRDb250ZW50XCIgYXJpYS1jb250cm9scz1cIm5hdmJhclN1cHBvcnRlZENvbnRlbnRcIiBhcmlhLWV4cGFuZGVkPVwiZmFsc2VcIiBhcmlhLWxhYmVsPVwiVG9nZ2xlIG5hdmlnYXRpb25cIj5cclxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJuYXZiYXItdG9nZ2xlci1pY29uXCI+PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgPC9idXR0b24+XHJcblxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2xsYXBzZSBuYXZiYXItY29sbGFwc2VcIiBpZD1cIm5hdmJhclN1cHBvcnRlZENvbnRlbnRcIj5cclxuICAgICAgICAgICAgICAgICAgICA8dWwgY2xhc3NOYW1lPVwibmF2YmFyLW5hdiBtci1hdXRvXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHsgdG9rZW4gJiYgdXNlciA/XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxsaSBjbGFzc05hbWU9XCJuYXYtaXRlbSBhY3RpdmVcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxOYXZMaW5rIGNsYXNzTmFtZT1cIm5hdi1saW5rXCIgdG89XCIvd29ya3NwYWNlXCI+V29ya3NwYWNlPC9OYXZMaW5rPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA6IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBudWxsIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpIGNsYXNzTmFtZT1cIm5hdi1pdGVtIGFjdGl2ZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPE5hdkxpbmsgY2xhc3NOYW1lPVwibmF2LWxpbmtcIiB0bz1cIi9kb2NzXCI+RG9jczwvTmF2TGluaz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpIGNsYXNzTmFtZT1cIm5hdi1pdGVtIGFjdGl2ZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPE5hdkxpbmsgY2xhc3NOYW1lPVwibmF2LWxpbmtcIiB0bz1cIi90dXRvcmlhbFwiPlR1dG9yaWFsPC9OYXZMaW5rPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8bGkgY2xhc3NOYW1lPVwibmF2LWl0ZW0gYWN0aXZlXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8TmF2TGluayBjbGFzc05hbWU9XCJuYXYtbGlua1wiIHRvPVwiL2Jsb2dcIj5CbG9nPC9OYXZMaW5rPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgICAgICAgICAgICAgeyAhdG9rZW4gJiYgIXVzZXIgP1xyXG4gICAgICAgICAgICAgICAgICAgIDx1bCBjbGFzc05hbWU9XCJuYXZiYXItbmF2IG1sLWF1dG9cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpIGNsYXNzTmFtZT1cIm5hdi1pdGVtXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8TmF2TGluayBvbkNsaWNrPXt0aGlzLmhhbmRsZUxvZ2luQ2xpY2t9IGNsYXNzTmFtZT1cIm5hdi1saW5rXCIgdG89XCIvbG9naW5cIj5Mb2cgaW48L05hdkxpbms+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgPC91bD5cclxuICAgICAgICAgICAgICAgICAgICA6IFxyXG4gICAgICAgICAgICAgICAgICAgIDx1bCBjbGFzc05hbWU9XCJuYXZiYXItbmF2IG1sLWF1dG9cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpIGNsYXNzTmFtZT1cIm5hdi1pdGVtXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8TmF2TGluayBjbGFzc05hbWU9XCJuYXYtbGlua1wiIHRvPVwiL2xvZ2luP2w9MVwiPkxvZyBPdXQ8L05hdkxpbms+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgPC91bD4gfVxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvbmF2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5jb25zdCBNZW51ID0gY29ubmVjdChtYXBTdGF0ZVRvUHJvcHMpKE1lbnVDb21wb25lbnQpO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgTWVudTsiLCJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50IH0gZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgTWVudUNvbXBvbmVudCBmcm9tICcuL21lbnUuY29tcG9uZW50JztcclxuXHJcbmNsYXNzIEFwcENvbXBvbmVudCBleHRlbmRzIENvbXBvbmVudCB7XHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgIDxNZW51Q29tcG9uZW50IC8+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJvZHktY29udGVudFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLmNoaWxkcmVufVxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IEFwcENvbXBvbmVudDsiXSwic291cmNlUm9vdCI6IiJ9