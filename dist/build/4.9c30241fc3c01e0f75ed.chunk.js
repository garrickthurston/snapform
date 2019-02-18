(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[4],{

/***/ "LC23":
/*!*****************************************************!*\
  !*** ./client/assets/style/internal/dashboard.scss ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../../../node_modules/css-loader/dist/cjs.js??ref--6-1!../../../../node_modules/sass-loader/lib/loader.js??ref--6-2!./dashboard.scss */ "QLZ0");

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

/***/ "OEz4":
/*!****************************************************!*\
  !*** ./client/src/internal/dashboard.component.js ***!
  \****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _config_redux_redux_store__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../config/redux/redux.store */ "gqOv");
/* harmony import */ var _config_redux_redux_actions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../config/redux/redux.actions */ "n/Oi");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-redux */ "/MKj");
/* harmony import */ var _engine_src_index__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../engine/src/index */ "WoDL");
/* harmony import */ var _assets_style_internal_dashboard_scss__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../assets/style/internal/dashboard.scss */ "LC23");
/* harmony import */ var _assets_style_internal_dashboard_scss__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_assets_style_internal_dashboard_scss__WEBPACK_IMPORTED_MODULE_5__);







const mapStateToProps = state => state;

function mapDispatchToProps(dispatch) {
  return {
    updateViewSettings: payload => dispatch(Object(_config_redux_redux_actions__WEBPACK_IMPORTED_MODULE_2__["updateViewSettings"])(payload))
  };
}

class DashboardComponent extends react__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  constructor(props) {
    super(props);
    const payload = {
      viewWidth: 800,
      viewHeight: 550,
      cellWidth: 8,
      cellHeight: 8
    };
    this.props.updateViewSettings(payload);
  }

  render() {
    const {
      viewWidth,
      viewHeight,
      cellWidth,
      cellHeight
    } = _config_redux_redux_store__WEBPACK_IMPORTED_MODULE_1__["store"].getState();
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "d-container"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h2", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
      className: "user-icon"
    }), "Dashboard"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_engine_src_index__WEBPACK_IMPORTED_MODULE_4__["default"], {
      viewWidth: viewWidth,
      viewHeight: viewHeight,
      cellWidth: cellWidth,
      cellHeight: cellHeight
    }));
  }

}

;
const Dashboard = Object(react_redux__WEBPACK_IMPORTED_MODULE_3__["connect"])(mapStateToProps, mapDispatchToProps)(DashboardComponent);
/* harmony default export */ __webpack_exports__["default"] = (Dashboard);

/***/ }),

/***/ "QLZ0":
/*!********************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js??ref--6-1!./node_modules/sass-loader/lib/loader.js??ref--6-2!./client/assets/style/internal/dashboard.scss ***!
  \********************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../../node_modules/css-loader/dist/runtime/api.js */ "JPst")(true);
// Module
exports.push([module.i, ".d-container {\n  position: relative;\n  z-index: 10;\n  max-width: 800px;\n  margin: 44px auto;\n  border-radius: 4px;\n  background-color: rgba(255, 255, 255, 0.9); }\n  @media (max-width: 600px) {\n    .d-container {\n      max-width: 100%;\n      margin: 0 !important;\n      border-radius: 0; } }\n", "",{"version":3,"sources":["C:/Users/garrick/source/repos/snapform/client/assets/style/internal/client/assets/style/internal/dashboard.scss"],"names":[],"mappings":"AAAA;EACI,kBAAkB;EAClB,WAAW;EACX,gBAAgB;EAChB,iBAAiB;EACjB,kBAAkB;EAClB,0CAAyC,EAAA;EACzC;IAPJ;MAQQ,eAAe;MACf,oBAAoB;MACpB,gBAAgB,EAAA,EAEvB","file":"dashboard.scss","sourcesContent":[".d-container {\r\n    position: relative;\r\n    z-index: 10;\r\n    max-width: 800px;\r\n    margin: 44px auto;\r\n    border-radius: 4px;\r\n    background-color: rgba(255, 255, 255, .9);\r\n    @media (max-width: 600px) {\r\n        max-width: 100%;\r\n        margin: 0 !important;\r\n        border-radius: 0;\r\n    }\r\n}"],"sourceRoot":""}]);



/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9jbGllbnQvYXNzZXRzL3N0eWxlL2ludGVybmFsL2Rhc2hib2FyZC5zY3NzPzQzYjciLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3NyYy9pbnRlcm5hbC9kYXNoYm9hcmQuY29tcG9uZW50LmpzIiwid2VicGFjazovLy8uL2NsaWVudC9hc3NldHMvc3R5bGUvaW50ZXJuYWwvZGFzaGJvYXJkLnNjc3MiXSwibmFtZXMiOlsibWFwU3RhdGVUb1Byb3BzIiwic3RhdGUiLCJtYXBEaXNwYXRjaFRvUHJvcHMiLCJkaXNwYXRjaCIsInVwZGF0ZVZpZXdTZXR0aW5ncyIsInBheWxvYWQiLCJEYXNoYm9hcmRDb21wb25lbnQiLCJDb21wb25lbnQiLCJjb25zdHJ1Y3RvciIsInByb3BzIiwidmlld1dpZHRoIiwidmlld0hlaWdodCIsImNlbGxXaWR0aCIsImNlbGxIZWlnaHQiLCJyZW5kZXIiLCJzdG9yZSIsImdldFN0YXRlIiwiRGFzaGJvYXJkIiwiY29ubmVjdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUNBLGNBQWMsbUJBQU8sQ0FBQyxzSkFBMkk7O0FBRWpLLDRDQUE0QyxRQUFTOztBQUVyRDtBQUNBOzs7O0FBSUEsZUFBZTs7QUFFZjtBQUNBOztBQUVBLGFBQWEsbUJBQU8sQ0FBQyxvRUFBeUQ7O0FBRTlFOztBQUVBLEdBQUcsS0FBVSxFQUFFLEU7Ozs7Ozs7Ozs7OztBQ25CZjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7O0FBRUEsTUFBTUEsZUFBZSxHQUFJQyxLQUFELElBQVdBLEtBQW5DOztBQUVBLFNBQVNDLGtCQUFULENBQTRCQyxRQUE1QixFQUFzQztBQUNsQyxTQUFPO0FBQ0hDLHNCQUFrQixFQUFFQyxPQUFPLElBQUlGLFFBQVEsQ0FBQ0Msc0ZBQWtCLENBQUNDLE9BQUQsQ0FBbkI7QUFEcEMsR0FBUDtBQUdIOztBQUVELE1BQU1DLGtCQUFOLFNBQWlDQywrQ0FBakMsQ0FBMkM7QUFDdkNDLGFBQVcsQ0FBQ0MsS0FBRCxFQUFRO0FBQ2YsVUFBTUEsS0FBTjtBQUVBLFVBQU1KLE9BQU8sR0FBRztBQUNaSyxlQUFTLEVBQUUsR0FEQztBQUVaQyxnQkFBVSxFQUFFLEdBRkE7QUFHWkMsZUFBUyxFQUFFLENBSEM7QUFJWkMsZ0JBQVUsRUFBRTtBQUpBLEtBQWhCO0FBTUEsU0FBS0osS0FBTCxDQUFXTCxrQkFBWCxDQUE4QkMsT0FBOUI7QUFDSDs7QUFFRFMsUUFBTSxHQUFHO0FBQ0wsVUFBTTtBQUFFSixlQUFGO0FBQWFDLGdCQUFiO0FBQXlCQyxlQUF6QjtBQUFvQ0M7QUFBcEMsUUFBbURFLCtEQUFLLENBQUNDLFFBQU4sRUFBekQ7QUFDQSxXQUNJO0FBQUssZUFBUyxFQUFDO0FBQWYsT0FDSSx1RUFBSTtBQUFNLGVBQVMsRUFBQztBQUFoQixNQUFKLGNBREosRUFFSSwyREFBQyx5REFBRDtBQUNJLGVBQVMsRUFBRU4sU0FEZjtBQUVJLGdCQUFVLEVBQUVDLFVBRmhCO0FBR0ksZUFBUyxFQUFFQyxTQUhmO0FBSUksZ0JBQVUsRUFBRUM7QUFKaEIsTUFGSixDQURKO0FBVUg7O0FBekJzQzs7QUEwQjFDO0FBRUQsTUFBTUksU0FBUyxHQUFHQywyREFBTyxDQUFDbEIsZUFBRCxFQUFrQkUsa0JBQWxCLENBQVAsQ0FBNkNJLGtCQUE3QyxDQUFsQjtBQUVlVyx3RUFBZixFOzs7Ozs7Ozs7OztBQy9DQSwyQkFBMkIsbUJBQU8sQ0FBQyxxRUFBeUQ7QUFDNUY7QUFDQSxjQUFjLFFBQVMsaUJBQWlCLHVCQUF1QixnQkFBZ0IscUJBQXFCLHNCQUFzQix1QkFBdUIsK0NBQStDLEVBQUUsK0JBQStCLG9CQUFvQix3QkFBd0IsNkJBQTZCLHlCQUF5QixFQUFFLEVBQUUsU0FBUyxzS0FBc0ssWUFBWSxXQUFXLFlBQVksYUFBYSxhQUFhLGtCQUFrQixNQUFNLEtBQUssVUFBVSxZQUFZLGtGQUFrRiwyQkFBMkIsb0JBQW9CLHlCQUF5QiwwQkFBMEIsMkJBQTJCLGtEQUFrRCxtQ0FBbUMsNEJBQTRCLGlDQUFpQyw2QkFBNkIsU0FBUyxLQUFLLG1CQUFtQiIsImZpbGUiOiJidWlsZC80LjljMzAyNDFmYzNjMDFlMGY3NWVkLmNodW5rLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG52YXIgY29udGVudCA9IHJlcXVpcmUoXCIhIS4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzPz9yZWYtLTYtMSEuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvbGliL2xvYWRlci5qcz8/cmVmLS02LTIhLi9kYXNoYm9hcmQuc2Nzc1wiKTtcblxuaWYodHlwZW9mIGNvbnRlbnQgPT09ICdzdHJpbmcnKSBjb250ZW50ID0gW1ttb2R1bGUuaWQsIGNvbnRlbnQsICcnXV07XG5cbnZhciB0cmFuc2Zvcm07XG52YXIgaW5zZXJ0SW50bztcblxuXG5cbnZhciBvcHRpb25zID0ge1wiaG1yXCI6dHJ1ZX1cblxub3B0aW9ucy50cmFuc2Zvcm0gPSB0cmFuc2Zvcm1cbm9wdGlvbnMuaW5zZXJ0SW50byA9IHVuZGVmaW5lZDtcblxudmFyIHVwZGF0ZSA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9saWIvYWRkU3R5bGVzLmpzXCIpKGNvbnRlbnQsIG9wdGlvbnMpO1xuXG5pZihjb250ZW50LmxvY2FscykgbW9kdWxlLmV4cG9ydHMgPSBjb250ZW50LmxvY2FscztcblxuaWYobW9kdWxlLmhvdCkge1xuXHRtb2R1bGUuaG90LmFjY2VwdChcIiEhLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanM/P3JlZi0tNi0xIS4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9saWIvbG9hZGVyLmpzPz9yZWYtLTYtMiEuL2Rhc2hib2FyZC5zY3NzXCIsIGZ1bmN0aW9uKCkge1xuXHRcdHZhciBuZXdDb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanM/P3JlZi0tNi0xIS4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9saWIvbG9hZGVyLmpzPz9yZWYtLTYtMiEuL2Rhc2hib2FyZC5zY3NzXCIpO1xuXG5cdFx0aWYodHlwZW9mIG5ld0NvbnRlbnQgPT09ICdzdHJpbmcnKSBuZXdDb250ZW50ID0gW1ttb2R1bGUuaWQsIG5ld0NvbnRlbnQsICcnXV07XG5cblx0XHR2YXIgbG9jYWxzID0gKGZ1bmN0aW9uKGEsIGIpIHtcblx0XHRcdHZhciBrZXksIGlkeCA9IDA7XG5cblx0XHRcdGZvcihrZXkgaW4gYSkge1xuXHRcdFx0XHRpZighYiB8fCBhW2tleV0gIT09IGJba2V5XSkgcmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRpZHgrKztcblx0XHRcdH1cblxuXHRcdFx0Zm9yKGtleSBpbiBiKSBpZHgtLTtcblxuXHRcdFx0cmV0dXJuIGlkeCA9PT0gMDtcblx0XHR9KGNvbnRlbnQubG9jYWxzLCBuZXdDb250ZW50LmxvY2FscykpO1xuXG5cdFx0aWYoIWxvY2FscykgdGhyb3cgbmV3IEVycm9yKCdBYm9ydGluZyBDU1MgSE1SIGR1ZSB0byBjaGFuZ2VkIGNzcy1tb2R1bGVzIGxvY2Fscy4nKTtcblxuXHRcdHVwZGF0ZShuZXdDb250ZW50KTtcblx0fSk7XG5cblx0bW9kdWxlLmhvdC5kaXNwb3NlKGZ1bmN0aW9uKCkgeyB1cGRhdGUoKTsgfSk7XG59IiwiaW1wb3J0IFJlYWN0LCB7IENvbXBvbmVudCB9IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IHsgc3RvcmUgfSBmcm9tICcuLi9jb25maWcvcmVkdXgvcmVkdXguc3RvcmUnO1xyXG5pbXBvcnQgeyB1cGRhdGVWaWV3U2V0dGluZ3MgfSBmcm9tICcuLi9jb25maWcvcmVkdXgvcmVkdXguYWN0aW9ucyc7XHJcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCc7XHJcblxyXG5pbXBvcnQgRW5naW5lQ29tcG9uZW50IGZyb20gJy4uLy4uLy4uL2VuZ2luZS9zcmMvaW5kZXgnO1xyXG5cclxuaW1wb3J0ICcuLi8uLi9hc3NldHMvc3R5bGUvaW50ZXJuYWwvZGFzaGJvYXJkLnNjc3MnO1xyXG5cclxuY29uc3QgbWFwU3RhdGVUb1Byb3BzID0gKHN0YXRlKSA9PiBzdGF0ZTtcclxuXHJcbmZ1bmN0aW9uIG1hcERpc3BhdGNoVG9Qcm9wcyhkaXNwYXRjaCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB1cGRhdGVWaWV3U2V0dGluZ3M6IHBheWxvYWQgPT4gZGlzcGF0Y2godXBkYXRlVmlld1NldHRpbmdzKHBheWxvYWQpKVxyXG4gICAgfTtcclxufVxyXG5cclxuY2xhc3MgRGFzaGJvYXJkQ29tcG9uZW50IGV4dGVuZHMgQ29tcG9uZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG5cclxuICAgICAgICBjb25zdCBwYXlsb2FkID0ge1xyXG4gICAgICAgICAgICB2aWV3V2lkdGg6IDgwMCxcclxuICAgICAgICAgICAgdmlld0hlaWdodDogNTUwLFxyXG4gICAgICAgICAgICBjZWxsV2lkdGg6IDgsXHJcbiAgICAgICAgICAgIGNlbGxIZWlnaHQ6IDhcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMucHJvcHMudXBkYXRlVmlld1NldHRpbmdzKHBheWxvYWQpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IHZpZXdXaWR0aCwgdmlld0hlaWdodCwgY2VsbFdpZHRoLCBjZWxsSGVpZ2h0IH0gPSBzdG9yZS5nZXRTdGF0ZSgpO1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZC1jb250YWluZXJcIj5cclxuICAgICAgICAgICAgICAgIDxoMj48c3BhbiBjbGFzc05hbWU9XCJ1c2VyLWljb25cIj48L3NwYW4+RGFzaGJvYXJkPC9oMj5cclxuICAgICAgICAgICAgICAgIDxFbmdpbmVDb21wb25lbnQgXHJcbiAgICAgICAgICAgICAgICAgICAgdmlld1dpZHRoPXt2aWV3V2lkdGh9IFxyXG4gICAgICAgICAgICAgICAgICAgIHZpZXdIZWlnaHQ9e3ZpZXdIZWlnaHR9XHJcbiAgICAgICAgICAgICAgICAgICAgY2VsbFdpZHRoPXtjZWxsV2lkdGh9XHJcbiAgICAgICAgICAgICAgICAgICAgY2VsbEhlaWdodD17Y2VsbEhlaWdodH0gLz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufTtcclxuXHJcbmNvbnN0IERhc2hib2FyZCA9IGNvbm5lY3QobWFwU3RhdGVUb1Byb3BzLCBtYXBEaXNwYXRjaFRvUHJvcHMpKERhc2hib2FyZENvbXBvbmVudCk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBEYXNoYm9hcmQ7IiwiZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIikodHJ1ZSk7XG4vLyBNb2R1bGVcbmV4cG9ydHMucHVzaChbbW9kdWxlLmlkLCBcIi5kLWNvbnRhaW5lciB7XFxuICBwb3NpdGlvbjogcmVsYXRpdmU7XFxuICB6LWluZGV4OiAxMDtcXG4gIG1heC13aWR0aDogODAwcHg7XFxuICBtYXJnaW46IDQ0cHggYXV0bztcXG4gIGJvcmRlci1yYWRpdXM6IDRweDtcXG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC45KTsgfVxcbiAgQG1lZGlhIChtYXgtd2lkdGg6IDYwMHB4KSB7XFxuICAgIC5kLWNvbnRhaW5lciB7XFxuICAgICAgbWF4LXdpZHRoOiAxMDAlO1xcbiAgICAgIG1hcmdpbjogMCAhaW1wb3J0YW50O1xcbiAgICAgIGJvcmRlci1yYWRpdXM6IDA7IH0gfVxcblwiLCBcIlwiLHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIkM6L1VzZXJzL2dhcnJpY2svc291cmNlL3JlcG9zL3NuYXBmb3JtL2NsaWVudC9hc3NldHMvc3R5bGUvaW50ZXJuYWwvY2xpZW50L2Fzc2V0cy9zdHlsZS9pbnRlcm5hbC9kYXNoYm9hcmQuc2Nzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQTtFQUNJLGtCQUFrQjtFQUNsQixXQUFXO0VBQ1gsZ0JBQWdCO0VBQ2hCLGlCQUFpQjtFQUNqQixrQkFBa0I7RUFDbEIsMENBQXlDLEVBQUE7RUFDekM7SUFQSjtNQVFRLGVBQWU7TUFDZixvQkFBb0I7TUFDcEIsZ0JBQWdCLEVBQUEsRUFFdkJcIixcImZpbGVcIjpcImRhc2hib2FyZC5zY3NzXCIsXCJzb3VyY2VzQ29udGVudFwiOltcIi5kLWNvbnRhaW5lciB7XFxyXFxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcXHJcXG4gICAgei1pbmRleDogMTA7XFxyXFxuICAgIG1heC13aWR0aDogODAwcHg7XFxyXFxuICAgIG1hcmdpbjogNDRweCBhdXRvO1xcclxcbiAgICBib3JkZXItcmFkaXVzOiA0cHg7XFxyXFxuICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMjU1LCAyNTUsIDI1NSwgLjkpO1xcclxcbiAgICBAbWVkaWEgKG1heC13aWR0aDogNjAwcHgpIHtcXHJcXG4gICAgICAgIG1heC13aWR0aDogMTAwJTtcXHJcXG4gICAgICAgIG1hcmdpbjogMCAhaW1wb3J0YW50O1xcclxcbiAgICAgICAgYm9yZGVyLXJhZGl1czogMDtcXHJcXG4gICAgfVxcclxcbn1cIl0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcblxuIl0sInNvdXJjZVJvb3QiOiIifQ==