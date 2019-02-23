(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[3],{

/***/ "WO62":
/*!********************************************!*\
  !*** ./client/src/shared/app.component.js ***!
  \********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _menu_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./menu.component */ "mR+F");



class AppComponent extends react__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  render() {
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_menu_component__WEBPACK_IMPORTED_MODULE_1__["default"], null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "body-content"
    }, this.props.children));
  }

}

/* harmony default export */ __webpack_exports__["default"] = (AppComponent);

/***/ }),

/***/ "Zkju":
/*!*************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js??ref--6-1!./node_modules/sass-loader/lib/loader.js??ref--6-2!./client/assets/style/shared/menu.scss ***!
  \*************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../../node_modules/css-loader/dist/runtime/api.js */ "JPst")(true);
// Module
exports.push([module.i, "nav {\n  z-index: 50; }\n", "",{"version":3,"sources":["C:/Users/garri/source/repos/snapform/client/assets/style/shared/client/assets/style/shared/menu.scss"],"names":[],"mappings":"AAAA;EACI,WAAW,EAAA","file":"menu.scss","sourcesContent":["nav {\r\n    z-index: 50;\r\n}"],"sourceRoot":""}]);



/***/ }),

/***/ "mR+F":
/*!*********************************************!*\
  !*** ./client/src/shared/menu.component.js ***!
  \*********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ "/MKj");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-router-dom */ "eO8H");
/* harmony import */ var _config_redux_redux_store__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../config/redux/redux.store */ "gqOv");
/* harmony import */ var _assets_style_shared_menu_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../assets/style/shared/menu.scss */ "wEGr");
/* harmony import */ var _assets_style_shared_menu_scss__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_assets_style_shared_menu_scss__WEBPACK_IMPORTED_MODULE_4__);






const mapStateToProps = state => state;

class MenuComponent extends react__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  constructor(props) {
    super(props); //this.handleLoginClick = this.handleLoginClick.bind(this);
  } // handleLoginClick() {
  //     import(/* webpackChunkName: "login" */ '../internal/login.component').then(module => {
  //         var login = module.default;
  //         login();
  //     });
  // }


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
      to: "/dashboard"
    }, "Dashboard")) : null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("li", {
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

/***/ "wEGr":
/*!**********************************************!*\
  !*** ./client/assets/style/shared/menu.scss ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../../../node_modules/css-loader/dist/cjs.js??ref--6-1!../../../../node_modules/sass-loader/lib/loader.js??ref--6-2!./menu.scss */ "Zkju");

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(/*! ../../../../node_modules/style-loader/lib/addStyles.js */ "aET+")(content, options);

if(content.locals) module.exports = content.locals;

if(false) {}

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9jbGllbnQvc3JjL3NoYXJlZC9hcHAuY29tcG9uZW50LmpzIiwid2VicGFjazovLy8uL2NsaWVudC9hc3NldHMvc3R5bGUvc2hhcmVkL21lbnUuc2NzcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvc3JjL3NoYXJlZC9tZW51LmNvbXBvbmVudC5qcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvYXNzZXRzL3N0eWxlL3NoYXJlZC9tZW51LnNjc3M/NjdiYiJdLCJuYW1lcyI6WyJBcHBDb21wb25lbnQiLCJDb21wb25lbnQiLCJyZW5kZXIiLCJwcm9wcyIsImNoaWxkcmVuIiwibWFwU3RhdGVUb1Byb3BzIiwic3RhdGUiLCJNZW51Q29tcG9uZW50IiwiY29uc3RydWN0b3IiLCJ0b2tlbiIsInVzZXIiLCJzdG9yZSIsImdldFN0YXRlIiwiaGFuZGxlTG9naW5DbGljayIsIk1lbnUiLCJjb25uZWN0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBOztBQUVBLE1BQU1BLFlBQU4sU0FBMkJDLCtDQUEzQixDQUFxQztBQUNqQ0MsUUFBTSxHQUFHO0FBQ0wsV0FDSSx3RUFDSSwyREFBQyx1REFBRCxPQURKLEVBRUk7QUFBSyxlQUFTLEVBQUM7QUFBZixPQUNLLEtBQUtDLEtBQUwsQ0FBV0MsUUFEaEIsQ0FGSixDQURKO0FBU0g7O0FBWGdDOztBQWN0QkosMkVBQWYsRTs7Ozs7Ozs7Ozs7QUNqQkEsMkJBQTJCLG1CQUFPLENBQUMscUVBQXlEO0FBQzVGO0FBQ0EsY0FBYyxRQUFTLFFBQVEsZ0JBQWdCLEVBQUUsU0FBUywySkFBMkosMkRBQTJELG9CQUFvQixLQUFLLG1CQUFtQjs7Ozs7Ozs7Ozs7Ozs7QUNGNVQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7O0FBRUEsTUFBTUssZUFBZSxHQUFJQyxLQUFELElBQVdBLEtBQW5DOztBQUVBLE1BQU1DLGFBQU4sU0FBNEJOLCtDQUE1QixDQUFzQztBQUNsQ08sYUFBVyxDQUFDTCxLQUFELEVBQVE7QUFDZixVQUFNQSxLQUFOLEVBRGUsQ0FHbkI7QUFFQyxHQU5pQyxDQVFsQztBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7OztBQUVBRCxRQUFNLEdBQUc7QUFDTCxVQUFNO0FBQUVPLFdBQUY7QUFBU0M7QUFBVCxRQUFrQkMsK0RBQUssQ0FBQ0MsUUFBTixFQUF4QjtBQUNBLFdBQ0k7QUFBSyxlQUFTLEVBQUM7QUFBZixPQUNJLDJEQUFDLHdEQUFEO0FBQVMsZUFBUyxFQUFDLFVBQW5CO0FBQThCLFFBQUUsRUFBQztBQUFqQyxrQkFESixFQUVJO0FBQVEsZUFBUyxFQUFDLGdCQUFsQjtBQUFtQyxVQUFJLEVBQUMsUUFBeEM7QUFBaUQscUJBQVksVUFBN0Q7QUFBd0UscUJBQVkseUJBQXBGO0FBQThHLHVCQUFjLHdCQUE1SDtBQUFxSix1QkFBYyxPQUFuSztBQUEySyxvQkFBVztBQUF0TCxPQUNJO0FBQU0sZUFBUyxFQUFDO0FBQWhCLE1BREosQ0FGSixFQU1JO0FBQUssZUFBUyxFQUFDLDBCQUFmO0FBQTBDLFFBQUUsRUFBQztBQUE3QyxPQUNJO0FBQUksZUFBUyxFQUFDO0FBQWQsT0FDTUgsS0FBSyxJQUFJQyxJQUFULEdBQ0Y7QUFBSSxlQUFTLEVBQUM7QUFBZCxPQUNJLDJEQUFDLHdEQUFEO0FBQVMsZUFBUyxFQUFDLFVBQW5CO0FBQThCLFFBQUUsRUFBQztBQUFqQyxtQkFESixDQURFLEdBS0YsSUFOSixFQU9JO0FBQUksZUFBUyxFQUFDO0FBQWQsT0FDSSwyREFBQyx3REFBRDtBQUFTLGVBQVMsRUFBQyxVQUFuQjtBQUE4QixRQUFFLEVBQUM7QUFBakMsY0FESixDQVBKLEVBVUk7QUFBSSxlQUFTLEVBQUM7QUFBZCxPQUNJLDJEQUFDLHdEQUFEO0FBQVMsZUFBUyxFQUFDLFVBQW5CO0FBQThCLFFBQUUsRUFBQztBQUFqQyxrQkFESixDQVZKLEVBYUk7QUFBSSxlQUFTLEVBQUM7QUFBZCxPQUNJLDJEQUFDLHdEQUFEO0FBQVMsZUFBUyxFQUFDLFVBQW5CO0FBQThCLFFBQUUsRUFBQztBQUFqQyxjQURKLENBYkosQ0FESixFQWtCTSxDQUFDRCxLQUFELElBQVUsQ0FBQ0MsSUFBWCxHQUNGO0FBQUksZUFBUyxFQUFDO0FBQWQsT0FDSTtBQUFJLGVBQVMsRUFBQztBQUFkLE9BQ0ksMkRBQUMsd0RBQUQ7QUFBUyxhQUFPLEVBQUUsS0FBS0csZ0JBQXZCO0FBQXlDLGVBQVMsRUFBQyxVQUFuRDtBQUE4RCxRQUFFLEVBQUM7QUFBakUsZ0JBREosQ0FESixDQURFLEdBT0Y7QUFBSSxlQUFTLEVBQUM7QUFBZCxPQUNJO0FBQUksZUFBUyxFQUFDO0FBQWQsT0FDSSwyREFBQyx3REFBRDtBQUFTLGVBQVMsRUFBQyxVQUFuQjtBQUE4QixRQUFFLEVBQUM7QUFBakMsaUJBREosQ0FESixDQXpCSixDQU5KLENBREo7QUF3Q0g7O0FBMURpQzs7QUEyRHJDO0FBRUQsTUFBTUMsSUFBSSxHQUFHQywyREFBTyxDQUFDVixlQUFELENBQVAsQ0FBeUJFLGFBQXpCLENBQWI7QUFFZU8sbUVBQWYsRTs7Ozs7Ozs7Ozs7O0FDdkVBLGNBQWMsbUJBQU8sQ0FBQyxpSkFBc0k7O0FBRTVKLDRDQUE0QyxRQUFTOztBQUVyRDtBQUNBOzs7O0FBSUEsZUFBZTs7QUFFZjtBQUNBOztBQUVBLGFBQWEsbUJBQU8sQ0FBQyxvRUFBeUQ7O0FBRTlFOztBQUVBLEdBQUcsS0FBVSxFQUFFLEUiLCJmaWxlIjoiYnVpbGQvMy5jN2IwNjllYmZmNzJiNGMxZGFjYi5jaHVuay5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQgfSBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCBNZW51Q29tcG9uZW50IGZyb20gJy4vbWVudS5jb21wb25lbnQnO1xyXG5cclxuY2xhc3MgQXBwQ29tcG9uZW50IGV4dGVuZHMgQ29tcG9uZW50IHtcclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgPE1lbnVDb21wb25lbnQgLz5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYm9keS1jb250ZW50XCI+XHJcbiAgICAgICAgICAgICAgICAgICAge3RoaXMucHJvcHMuY2hpbGRyZW59XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBBcHBDb21wb25lbnQ7IiwiZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIikodHJ1ZSk7XG4vLyBNb2R1bGVcbmV4cG9ydHMucHVzaChbbW9kdWxlLmlkLCBcIm5hdiB7XFxuICB6LWluZGV4OiA1MDsgfVxcblwiLCBcIlwiLHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIkM6L1VzZXJzL2dhcnJpL3NvdXJjZS9yZXBvcy9zbmFwZm9ybS9jbGllbnQvYXNzZXRzL3N0eWxlL3NoYXJlZC9jbGllbnQvYXNzZXRzL3N0eWxlL3NoYXJlZC9tZW51LnNjc3NcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBQUE7RUFDSSxXQUFXLEVBQUFcIixcImZpbGVcIjpcIm1lbnUuc2Nzc1wiLFwic291cmNlc0NvbnRlbnRcIjpbXCJuYXYge1xcclxcbiAgICB6LWluZGV4OiA1MDtcXHJcXG59XCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG5cbiIsImltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQgfSBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCc7XHJcbmltcG9ydCB7IE5hdkxpbmsgfSBmcm9tICdyZWFjdC1yb3V0ZXItZG9tJztcclxuaW1wb3J0IHsgc3RvcmUgfSBmcm9tICcuLi9jb25maWcvcmVkdXgvcmVkdXguc3RvcmUnO1xyXG5cclxuaW1wb3J0ICcuLi8uLi9hc3NldHMvc3R5bGUvc2hhcmVkL21lbnUuc2Nzcyc7XHJcblxyXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSAoc3RhdGUpID0+IHN0YXRlO1xyXG5cclxuY2xhc3MgTWVudUNvbXBvbmVudCBleHRlbmRzIENvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuXHJcbiAgICAvL3RoaXMuaGFuZGxlTG9naW5DbGljayA9IHRoaXMuaGFuZGxlTG9naW5DbGljay5iaW5kKHRoaXMpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAvLyBoYW5kbGVMb2dpbkNsaWNrKCkge1xyXG4gICAgLy8gICAgIGltcG9ydCgvKiB3ZWJwYWNrQ2h1bmtOYW1lOiBcImxvZ2luXCIgKi8gJy4uL2ludGVybmFsL2xvZ2luLmNvbXBvbmVudCcpLnRoZW4obW9kdWxlID0+IHtcclxuICAgIC8vICAgICAgICAgdmFyIGxvZ2luID0gbW9kdWxlLmRlZmF1bHQ7XHJcblxyXG4gICAgLy8gICAgICAgICBsb2dpbigpO1xyXG4gICAgLy8gICAgIH0pO1xyXG4gICAgLy8gfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IHRva2VuLCB1c2VyIH0gPSBzdG9yZS5nZXRTdGF0ZSgpO1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxuYXYgY2xhc3NOYW1lPVwibmF2YmFyIG5hdmJhci1leHBhbmQtbGcgbmF2YmFyLWxpZ2h0IGJnLWxpZ2h0XCI+XHJcbiAgICAgICAgICAgICAgICA8TmF2TGluayBjbGFzc05hbWU9XCJuYXYtbGlua1wiIHRvPVwiL1wiPlNuYXBmb3JtPC9OYXZMaW5rPlxyXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJuYXZiYXItdG9nZ2xlclwiIHR5cGU9XCJidXR0b25cIiBkYXRhLXRvZ2dsZT1cImNvbGxhcHNlXCIgZGF0YS10YXJnZXQ9XCIjbmF2YmFyU3VwcG9ydGVkQ29udGVudFwiIGFyaWEtY29udHJvbHM9XCJuYXZiYXJTdXBwb3J0ZWRDb250ZW50XCIgYXJpYS1leHBhbmRlZD1cImZhbHNlXCIgYXJpYS1sYWJlbD1cIlRvZ2dsZSBuYXZpZ2F0aW9uXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwibmF2YmFyLXRvZ2dsZXItaWNvblwiPjwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sbGFwc2UgbmF2YmFyLWNvbGxhcHNlXCIgaWQ9XCJuYXZiYXJTdXBwb3J0ZWRDb250ZW50XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPHVsIGNsYXNzTmFtZT1cIm5hdmJhci1uYXYgbXItYXV0b1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7IHRva2VuICYmIHVzZXIgP1xyXG4gICAgICAgICAgICAgICAgICAgICAgICA8bGkgY2xhc3NOYW1lPVwibmF2LWl0ZW0gYWN0aXZlXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8TmF2TGluayBjbGFzc05hbWU9XCJuYXYtbGlua1wiIHRvPVwiL2Rhc2hib2FyZFwiPkRhc2hib2FyZDwvTmF2TGluaz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgOiBcclxuICAgICAgICAgICAgICAgICAgICAgICAgbnVsbCB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxsaSBjbGFzc05hbWU9XCJuYXYtaXRlbSBhY3RpdmVcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxOYXZMaW5rIGNsYXNzTmFtZT1cIm5hdi1saW5rXCIgdG89XCIvZG9jc1wiPkRvY3M8L05hdkxpbms+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxsaSBjbGFzc05hbWU9XCJuYXYtaXRlbSBhY3RpdmVcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxOYXZMaW5rIGNsYXNzTmFtZT1cIm5hdi1saW5rXCIgdG89XCIvdHV0b3JpYWxcIj5UdXRvcmlhbDwvTmF2TGluaz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpIGNsYXNzTmFtZT1cIm5hdi1pdGVtIGFjdGl2ZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPE5hdkxpbmsgY2xhc3NOYW1lPVwibmF2LWxpbmtcIiB0bz1cIi9ibG9nXCI+QmxvZzwvTmF2TGluaz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICAgICAgICAgICAgIHsgIXRva2VuICYmICF1c2VyID9cclxuICAgICAgICAgICAgICAgICAgICA8dWwgY2xhc3NOYW1lPVwibmF2YmFyLW5hdiBtbC1hdXRvXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxsaSBjbGFzc05hbWU9XCJuYXYtaXRlbVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPE5hdkxpbmsgb25DbGljaz17dGhpcy5oYW5kbGVMb2dpbkNsaWNrfSBjbGFzc05hbWU9XCJuYXYtbGlua1wiIHRvPVwiL2xvZ2luXCI+TG9nIGluPC9OYXZMaW5rPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgICAgICAgICAgICAgOiBcclxuICAgICAgICAgICAgICAgICAgICA8dWwgY2xhc3NOYW1lPVwibmF2YmFyLW5hdiBtbC1hdXRvXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxsaSBjbGFzc05hbWU9XCJuYXYtaXRlbVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPE5hdkxpbmsgY2xhc3NOYW1lPVwibmF2LWxpbmtcIiB0bz1cIi9sb2dpbj9sPTFcIj5Mb2cgT3V0PC9OYXZMaW5rPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvdWw+IH1cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L25hdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59O1xyXG5cclxuY29uc3QgTWVudSA9IGNvbm5lY3QobWFwU3RhdGVUb1Byb3BzKShNZW51Q29tcG9uZW50KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IE1lbnU7IiwiXG52YXIgY29udGVudCA9IHJlcXVpcmUoXCIhIS4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzPz9yZWYtLTYtMSEuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvbGliL2xvYWRlci5qcz8/cmVmLS02LTIhLi9tZW51LnNjc3NcIik7XG5cbmlmKHR5cGVvZiBjb250ZW50ID09PSAnc3RyaW5nJykgY29udGVudCA9IFtbbW9kdWxlLmlkLCBjb250ZW50LCAnJ11dO1xuXG52YXIgdHJhbnNmb3JtO1xudmFyIGluc2VydEludG87XG5cblxuXG52YXIgb3B0aW9ucyA9IHtcImhtclwiOnRydWV9XG5cbm9wdGlvbnMudHJhbnNmb3JtID0gdHJhbnNmb3JtXG5vcHRpb25zLmluc2VydEludG8gPSB1bmRlZmluZWQ7XG5cbnZhciB1cGRhdGUgPSByZXF1aXJlKFwiIS4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvbGliL2FkZFN0eWxlcy5qc1wiKShjb250ZW50LCBvcHRpb25zKTtcblxuaWYoY29udGVudC5sb2NhbHMpIG1vZHVsZS5leHBvcnRzID0gY29udGVudC5sb2NhbHM7XG5cbmlmKG1vZHVsZS5ob3QpIHtcblx0bW9kdWxlLmhvdC5hY2NlcHQoXCIhIS4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzPz9yZWYtLTYtMSEuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvbGliL2xvYWRlci5qcz8/cmVmLS02LTIhLi9tZW51LnNjc3NcIiwgZnVuY3Rpb24oKSB7XG5cdFx0dmFyIG5ld0NvbnRlbnQgPSByZXF1aXJlKFwiISEuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcz8/cmVmLS02LTEhLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2xpYi9sb2FkZXIuanM/P3JlZi0tNi0yIS4vbWVudS5zY3NzXCIpO1xuXG5cdFx0aWYodHlwZW9mIG5ld0NvbnRlbnQgPT09ICdzdHJpbmcnKSBuZXdDb250ZW50ID0gW1ttb2R1bGUuaWQsIG5ld0NvbnRlbnQsICcnXV07XG5cblx0XHR2YXIgbG9jYWxzID0gKGZ1bmN0aW9uKGEsIGIpIHtcblx0XHRcdHZhciBrZXksIGlkeCA9IDA7XG5cblx0XHRcdGZvcihrZXkgaW4gYSkge1xuXHRcdFx0XHRpZighYiB8fCBhW2tleV0gIT09IGJba2V5XSkgcmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRpZHgrKztcblx0XHRcdH1cblxuXHRcdFx0Zm9yKGtleSBpbiBiKSBpZHgtLTtcblxuXHRcdFx0cmV0dXJuIGlkeCA9PT0gMDtcblx0XHR9KGNvbnRlbnQubG9jYWxzLCBuZXdDb250ZW50LmxvY2FscykpO1xuXG5cdFx0aWYoIWxvY2FscykgdGhyb3cgbmV3IEVycm9yKCdBYm9ydGluZyBDU1MgSE1SIGR1ZSB0byBjaGFuZ2VkIGNzcy1tb2R1bGVzIGxvY2Fscy4nKTtcblxuXHRcdHVwZGF0ZShuZXdDb250ZW50KTtcblx0fSk7XG5cblx0bW9kdWxlLmhvdC5kaXNwb3NlKGZ1bmN0aW9uKCkgeyB1cGRhdGUoKTsgfSk7XG59Il0sInNvdXJjZVJvb3QiOiIifQ==