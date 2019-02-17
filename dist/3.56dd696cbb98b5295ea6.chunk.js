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
exports.push([module.i, "nav {\n  z-index: 50; }\n", "",{"version":3,"sources":["C:/Users/garrick/source/repos/snapform/client/assets/style/shared/client/assets/style/shared/menu.scss"],"names":[],"mappings":"AAAA;EACI,WAAW,EAAA","file":"menu.scss","sourcesContent":["nav {\r\n    z-index: 50;\r\n}"],"sourceRoot":""}]);



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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9jbGllbnQvc3JjL3NoYXJlZC9hcHAuY29tcG9uZW50LmpzIiwid2VicGFjazovLy8uL2NsaWVudC9hc3NldHMvc3R5bGUvc2hhcmVkL21lbnUuc2NzcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvc3JjL3NoYXJlZC9tZW51LmNvbXBvbmVudC5qcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvYXNzZXRzL3N0eWxlL3NoYXJlZC9tZW51LnNjc3M/NjdiYiJdLCJuYW1lcyI6WyJBcHBDb21wb25lbnQiLCJDb21wb25lbnQiLCJyZW5kZXIiLCJwcm9wcyIsImNoaWxkcmVuIiwibWFwU3RhdGVUb1Byb3BzIiwic3RhdGUiLCJNZW51Q29tcG9uZW50IiwiY29uc3RydWN0b3IiLCJ0b2tlbiIsInVzZXIiLCJzdG9yZSIsImdldFN0YXRlIiwiaGFuZGxlTG9naW5DbGljayIsIk1lbnUiLCJjb25uZWN0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBOztBQUVBLE1BQU1BLFlBQU4sU0FBMkJDLCtDQUEzQixDQUFxQztBQUNqQ0MsUUFBTSxHQUFHO0FBQ0wsV0FDSSx3RUFDSSwyREFBQyx1REFBRCxPQURKLEVBRUk7QUFBSyxlQUFTLEVBQUM7QUFBZixPQUNLLEtBQUtDLEtBQUwsQ0FBV0MsUUFEaEIsQ0FGSixDQURKO0FBU0g7O0FBWGdDOztBQWN0QkosMkVBQWYsRTs7Ozs7Ozs7Ozs7QUNqQkEsMkJBQTJCLG1CQUFPLENBQUMscUVBQXlEO0FBQzVGO0FBQ0EsY0FBYyxRQUFTLFFBQVEsZ0JBQWdCLEVBQUUsU0FBUyw2SkFBNkosMkRBQTJELG9CQUFvQixLQUFLLG1CQUFtQjs7Ozs7Ozs7Ozs7Ozs7QUNGOVQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7O0FBRUEsTUFBTUssZUFBZSxHQUFJQyxLQUFELElBQVdBLEtBQW5DOztBQUVBLE1BQU1DLGFBQU4sU0FBNEJOLCtDQUE1QixDQUFzQztBQUNsQ08sYUFBVyxDQUFDTCxLQUFELEVBQVE7QUFDZixVQUFNQSxLQUFOLEVBRGUsQ0FHbkI7QUFFQyxHQU5pQyxDQVFsQztBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7OztBQUVBRCxRQUFNLEdBQUc7QUFDTCxVQUFNO0FBQUVPLFdBQUY7QUFBU0M7QUFBVCxRQUFrQkMsK0RBQUssQ0FBQ0MsUUFBTixFQUF4QjtBQUNBLFdBQ0k7QUFBSyxlQUFTLEVBQUM7QUFBZixPQUNJLDJEQUFDLHdEQUFEO0FBQVMsZUFBUyxFQUFDLFVBQW5CO0FBQThCLFFBQUUsRUFBQztBQUFqQyxrQkFESixFQUVJO0FBQVEsZUFBUyxFQUFDLGdCQUFsQjtBQUFtQyxVQUFJLEVBQUMsUUFBeEM7QUFBaUQscUJBQVksVUFBN0Q7QUFBd0UscUJBQVkseUJBQXBGO0FBQThHLHVCQUFjLHdCQUE1SDtBQUFxSix1QkFBYyxPQUFuSztBQUEySyxvQkFBVztBQUF0TCxPQUNJO0FBQU0sZUFBUyxFQUFDO0FBQWhCLE1BREosQ0FGSixFQU1JO0FBQUssZUFBUyxFQUFDLDBCQUFmO0FBQTBDLFFBQUUsRUFBQztBQUE3QyxPQUNJO0FBQUksZUFBUyxFQUFDO0FBQWQsT0FDTUgsS0FBSyxJQUFJQyxJQUFULEdBQ0Y7QUFBSSxlQUFTLEVBQUM7QUFBZCxPQUNJLDJEQUFDLHdEQUFEO0FBQVMsZUFBUyxFQUFDLFVBQW5CO0FBQThCLFFBQUUsRUFBQztBQUFqQyxtQkFESixDQURFLEdBS0YsSUFOSixFQU9JO0FBQUksZUFBUyxFQUFDO0FBQWQsT0FDSSwyREFBQyx3REFBRDtBQUFTLGVBQVMsRUFBQyxVQUFuQjtBQUE4QixRQUFFLEVBQUM7QUFBakMsY0FESixDQVBKLEVBVUk7QUFBSSxlQUFTLEVBQUM7QUFBZCxPQUNJLDJEQUFDLHdEQUFEO0FBQVMsZUFBUyxFQUFDLFVBQW5CO0FBQThCLFFBQUUsRUFBQztBQUFqQyxrQkFESixDQVZKLEVBYUk7QUFBSSxlQUFTLEVBQUM7QUFBZCxPQUNJLDJEQUFDLHdEQUFEO0FBQVMsZUFBUyxFQUFDLFVBQW5CO0FBQThCLFFBQUUsRUFBQztBQUFqQyxjQURKLENBYkosQ0FESixFQWtCTSxDQUFDRCxLQUFELElBQVUsQ0FBQ0MsSUFBWCxHQUNGO0FBQUksZUFBUyxFQUFDO0FBQWQsT0FDSTtBQUFJLGVBQVMsRUFBQztBQUFkLE9BQ0ksMkRBQUMsd0RBQUQ7QUFBUyxhQUFPLEVBQUUsS0FBS0csZ0JBQXZCO0FBQXlDLGVBQVMsRUFBQyxVQUFuRDtBQUE4RCxRQUFFLEVBQUM7QUFBakUsZ0JBREosQ0FESixDQURFLEdBT0Y7QUFBSSxlQUFTLEVBQUM7QUFBZCxPQUNJO0FBQUksZUFBUyxFQUFDO0FBQWQsT0FDSSwyREFBQyx3REFBRDtBQUFTLGVBQVMsRUFBQyxVQUFuQjtBQUE4QixRQUFFLEVBQUM7QUFBakMsaUJBREosQ0FESixDQXpCSixDQU5KLENBREo7QUF3Q0g7O0FBMURpQzs7QUEyRHJDO0FBRUQsTUFBTUMsSUFBSSxHQUFHQywyREFBTyxDQUFDVixlQUFELENBQVAsQ0FBeUJFLGFBQXpCLENBQWI7QUFFZU8sbUVBQWYsRTs7Ozs7Ozs7Ozs7O0FDdkVBLGNBQWMsbUJBQU8sQ0FBQyxpSkFBc0k7O0FBRTVKLDRDQUE0QyxRQUFTOztBQUVyRDtBQUNBOzs7O0FBSUEsZUFBZTs7QUFFZjtBQUNBOztBQUVBLGFBQWEsbUJBQU8sQ0FBQyxvRUFBeUQ7O0FBRTlFOztBQUVBLEdBQUcsS0FBVSxFQUFFLEUiLCJmaWxlIjoiMy41NmRkNjk2Y2JiOThiNTI5NWVhNi5jaHVuay5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQgfSBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCBNZW51Q29tcG9uZW50IGZyb20gJy4vbWVudS5jb21wb25lbnQnO1xyXG5cclxuY2xhc3MgQXBwQ29tcG9uZW50IGV4dGVuZHMgQ29tcG9uZW50IHtcclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgPE1lbnVDb21wb25lbnQgLz5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYm9keS1jb250ZW50XCI+XHJcbiAgICAgICAgICAgICAgICAgICAge3RoaXMucHJvcHMuY2hpbGRyZW59XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBBcHBDb21wb25lbnQ7IiwiZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIikodHJ1ZSk7XG4vLyBNb2R1bGVcbmV4cG9ydHMucHVzaChbbW9kdWxlLmlkLCBcIm5hdiB7XFxuICB6LWluZGV4OiA1MDsgfVxcblwiLCBcIlwiLHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIkM6L1VzZXJzL2dhcnJpY2svc291cmNlL3JlcG9zL3NuYXBmb3JtL2NsaWVudC9hc3NldHMvc3R5bGUvc2hhcmVkL2NsaWVudC9hc3NldHMvc3R5bGUvc2hhcmVkL21lbnUuc2Nzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQTtFQUNJLFdBQVcsRUFBQVwiLFwiZmlsZVwiOlwibWVudS5zY3NzXCIsXCJzb3VyY2VzQ29udGVudFwiOltcIm5hdiB7XFxyXFxuICAgIHotaW5kZXg6IDUwO1xcclxcbn1cIl0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcblxuIiwiaW1wb3J0IFJlYWN0LCB7IENvbXBvbmVudCB9IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gJ3JlYWN0LXJlZHV4JztcclxuaW1wb3J0IHsgTmF2TGluayB9IGZyb20gJ3JlYWN0LXJvdXRlci1kb20nO1xyXG5pbXBvcnQgeyBzdG9yZSB9IGZyb20gJy4uL2NvbmZpZy9yZWR1eC9yZWR1eC5zdG9yZSc7XHJcblxyXG5pbXBvcnQgJy4uLy4uL2Fzc2V0cy9zdHlsZS9zaGFyZWQvbWVudS5zY3NzJztcclxuXHJcbmNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9IChzdGF0ZSkgPT4gc3RhdGU7XHJcblxyXG5jbGFzcyBNZW51Q29tcG9uZW50IGV4dGVuZHMgQ29tcG9uZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG5cclxuICAgIC8vdGhpcy5oYW5kbGVMb2dpbkNsaWNrID0gdGhpcy5oYW5kbGVMb2dpbkNsaWNrLmJpbmQodGhpcyk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8vIGhhbmRsZUxvZ2luQ2xpY2soKSB7XHJcbiAgICAvLyAgICAgaW1wb3J0KC8qIHdlYnBhY2tDaHVua05hbWU6IFwibG9naW5cIiAqLyAnLi4vaW50ZXJuYWwvbG9naW4uY29tcG9uZW50JykudGhlbihtb2R1bGUgPT4ge1xyXG4gICAgLy8gICAgICAgICB2YXIgbG9naW4gPSBtb2R1bGUuZGVmYXVsdDtcclxuXHJcbiAgICAvLyAgICAgICAgIGxvZ2luKCk7XHJcbiAgICAvLyAgICAgfSk7XHJcbiAgICAvLyB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgdG9rZW4sIHVzZXIgfSA9IHN0b3JlLmdldFN0YXRlKCk7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPG5hdiBjbGFzc05hbWU9XCJuYXZiYXIgbmF2YmFyLWV4cGFuZC1sZyBuYXZiYXItbGlnaHQgYmctbGlnaHRcIj5cclxuICAgICAgICAgICAgICAgIDxOYXZMaW5rIGNsYXNzTmFtZT1cIm5hdi1saW5rXCIgdG89XCIvXCI+U25hcGZvcm08L05hdkxpbms+XHJcbiAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cIm5hdmJhci10b2dnbGVyXCIgdHlwZT1cImJ1dHRvblwiIGRhdGEtdG9nZ2xlPVwiY29sbGFwc2VcIiBkYXRhLXRhcmdldD1cIiNuYXZiYXJTdXBwb3J0ZWRDb250ZW50XCIgYXJpYS1jb250cm9scz1cIm5hdmJhclN1cHBvcnRlZENvbnRlbnRcIiBhcmlhLWV4cGFuZGVkPVwiZmFsc2VcIiBhcmlhLWxhYmVsPVwiVG9nZ2xlIG5hdmlnYXRpb25cIj5cclxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJuYXZiYXItdG9nZ2xlci1pY29uXCI+PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgPC9idXR0b24+XHJcblxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2xsYXBzZSBuYXZiYXItY29sbGFwc2VcIiBpZD1cIm5hdmJhclN1cHBvcnRlZENvbnRlbnRcIj5cclxuICAgICAgICAgICAgICAgICAgICA8dWwgY2xhc3NOYW1lPVwibmF2YmFyLW5hdiBtci1hdXRvXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHsgdG9rZW4gJiYgdXNlciA/XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxsaSBjbGFzc05hbWU9XCJuYXYtaXRlbSBhY3RpdmVcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxOYXZMaW5rIGNsYXNzTmFtZT1cIm5hdi1saW5rXCIgdG89XCIvZGFzaGJvYXJkXCI+RGFzaGJvYXJkPC9OYXZMaW5rPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA6IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBudWxsIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpIGNsYXNzTmFtZT1cIm5hdi1pdGVtIGFjdGl2ZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPE5hdkxpbmsgY2xhc3NOYW1lPVwibmF2LWxpbmtcIiB0bz1cIi9kb2NzXCI+RG9jczwvTmF2TGluaz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpIGNsYXNzTmFtZT1cIm5hdi1pdGVtIGFjdGl2ZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPE5hdkxpbmsgY2xhc3NOYW1lPVwibmF2LWxpbmtcIiB0bz1cIi90dXRvcmlhbFwiPlR1dG9yaWFsPC9OYXZMaW5rPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8bGkgY2xhc3NOYW1lPVwibmF2LWl0ZW0gYWN0aXZlXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8TmF2TGluayBjbGFzc05hbWU9XCJuYXYtbGlua1wiIHRvPVwiL2Jsb2dcIj5CbG9nPC9OYXZMaW5rPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgICAgICAgICAgICAgeyAhdG9rZW4gJiYgIXVzZXIgP1xyXG4gICAgICAgICAgICAgICAgICAgIDx1bCBjbGFzc05hbWU9XCJuYXZiYXItbmF2IG1sLWF1dG9cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpIGNsYXNzTmFtZT1cIm5hdi1pdGVtXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8TmF2TGluayBvbkNsaWNrPXt0aGlzLmhhbmRsZUxvZ2luQ2xpY2t9IGNsYXNzTmFtZT1cIm5hdi1saW5rXCIgdG89XCIvbG9naW5cIj5Mb2cgaW48L05hdkxpbms+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgPC91bD5cclxuICAgICAgICAgICAgICAgICAgICA6IFxyXG4gICAgICAgICAgICAgICAgICAgIDx1bCBjbGFzc05hbWU9XCJuYXZiYXItbmF2IG1sLWF1dG9cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpIGNsYXNzTmFtZT1cIm5hdi1pdGVtXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8TmF2TGluayBjbGFzc05hbWU9XCJuYXYtbGlua1wiIHRvPVwiL2xvZ2luP2w9MVwiPkxvZyBPdXQ8L05hdkxpbms+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgPC91bD4gfVxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvbmF2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5jb25zdCBNZW51ID0gY29ubmVjdChtYXBTdGF0ZVRvUHJvcHMpKE1lbnVDb21wb25lbnQpO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgTWVudTsiLCJcbnZhciBjb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanM/P3JlZi0tNi0xIS4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9saWIvbG9hZGVyLmpzPz9yZWYtLTYtMiEuL21lbnUuc2Nzc1wiKTtcblxuaWYodHlwZW9mIGNvbnRlbnQgPT09ICdzdHJpbmcnKSBjb250ZW50ID0gW1ttb2R1bGUuaWQsIGNvbnRlbnQsICcnXV07XG5cbnZhciB0cmFuc2Zvcm07XG52YXIgaW5zZXJ0SW50bztcblxuXG5cbnZhciBvcHRpb25zID0ge1wiaG1yXCI6dHJ1ZX1cblxub3B0aW9ucy50cmFuc2Zvcm0gPSB0cmFuc2Zvcm1cbm9wdGlvbnMuaW5zZXJ0SW50byA9IHVuZGVmaW5lZDtcblxudmFyIHVwZGF0ZSA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9saWIvYWRkU3R5bGVzLmpzXCIpKGNvbnRlbnQsIG9wdGlvbnMpO1xuXG5pZihjb250ZW50LmxvY2FscykgbW9kdWxlLmV4cG9ydHMgPSBjb250ZW50LmxvY2FscztcblxuaWYobW9kdWxlLmhvdCkge1xuXHRtb2R1bGUuaG90LmFjY2VwdChcIiEhLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanM/P3JlZi0tNi0xIS4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9saWIvbG9hZGVyLmpzPz9yZWYtLTYtMiEuL21lbnUuc2Nzc1wiLCBmdW5jdGlvbigpIHtcblx0XHR2YXIgbmV3Q29udGVudCA9IHJlcXVpcmUoXCIhIS4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzPz9yZWYtLTYtMSEuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvbGliL2xvYWRlci5qcz8/cmVmLS02LTIhLi9tZW51LnNjc3NcIik7XG5cblx0XHRpZih0eXBlb2YgbmV3Q29udGVudCA9PT0gJ3N0cmluZycpIG5ld0NvbnRlbnQgPSBbW21vZHVsZS5pZCwgbmV3Q29udGVudCwgJyddXTtcblxuXHRcdHZhciBsb2NhbHMgPSAoZnVuY3Rpb24oYSwgYikge1xuXHRcdFx0dmFyIGtleSwgaWR4ID0gMDtcblxuXHRcdFx0Zm9yKGtleSBpbiBhKSB7XG5cdFx0XHRcdGlmKCFiIHx8IGFba2V5XSAhPT0gYltrZXldKSByZXR1cm4gZmFsc2U7XG5cdFx0XHRcdGlkeCsrO1xuXHRcdFx0fVxuXG5cdFx0XHRmb3Ioa2V5IGluIGIpIGlkeC0tO1xuXG5cdFx0XHRyZXR1cm4gaWR4ID09PSAwO1xuXHRcdH0oY29udGVudC5sb2NhbHMsIG5ld0NvbnRlbnQubG9jYWxzKSk7XG5cblx0XHRpZighbG9jYWxzKSB0aHJvdyBuZXcgRXJyb3IoJ0Fib3J0aW5nIENTUyBITVIgZHVlIHRvIGNoYW5nZWQgY3NzLW1vZHVsZXMgbG9jYWxzLicpO1xuXG5cdFx0dXBkYXRlKG5ld0NvbnRlbnQpO1xuXHR9KTtcblxuXHRtb2R1bGUuaG90LmRpc3Bvc2UoZnVuY3Rpb24oKSB7IHVwZGF0ZSgpOyB9KTtcbn0iXSwic291cmNlUm9vdCI6IiJ9