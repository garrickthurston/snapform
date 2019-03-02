(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[6],{

/***/ "8S35":
/*!************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js??ref--6-1!./node_modules/sass-loader/lib/loader.js??ref--6-2!./client/app/assets/style/internal/dashboard.scss ***!
  \************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../../../node_modules/css-loader/dist/runtime/api.js */ "JPst")(true);
// Module
exports.push([module.i, ".d-container {\n  position: relative;\n  z-index: 10;\n  max-width: 800px;\n  margin: 44px auto;\n  border-radius: 4px;\n  background-color: rgba(255, 255, 255, 0.9); }\n  @media (max-width: 600px) {\n    .d-container {\n      max-width: 100%;\n      margin: 0 !important;\n      border-radius: 0; } }\n", "",{"version":3,"sources":["C:/Users/garri/source/repos/snapform/client/app/assets/style/internal/client/app/assets/style/internal/dashboard.scss"],"names":[],"mappings":"AAAA;EACI,kBAAkB;EAClB,WAAW;EACX,gBAAgB;EAChB,iBAAiB;EACjB,kBAAkB;EAClB,0CAAyC,EAAA;EACzC;IAPJ;MAQQ,eAAe;MACf,oBAAoB;MACpB,gBAAgB,EAAA,EAEvB","file":"dashboard.scss","sourcesContent":[".d-container {\r\n    position: relative;\r\n    z-index: 10;\r\n    max-width: 800px;\r\n    margin: 44px auto;\r\n    border-radius: 4px;\r\n    background-color: rgba(255, 255, 255, .9);\r\n    @media (max-width: 600px) {\r\n        max-width: 100%;\r\n        margin: 0 !important;\r\n        border-radius: 0;\r\n    }\r\n}"],"sourceRoot":""}]);



/***/ }),

/***/ "CCNJ":
/*!*********************************************************!*\
  !*** ./client/app/assets/style/internal/dashboard.scss ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../../../../node_modules/css-loader/dist/cjs.js??ref--6-1!../../../../../node_modules/sass-loader/lib/loader.js??ref--6-2!./dashboard.scss */ "8S35");

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

/***/ "EpXu":
/*!********************************************************!*\
  !*** ./client/app/src/internal/dashboard.component.js ***!
  \********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _common_config_redux_redux_store__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../common/config/redux/redux.store */ "p6Ez");
/* harmony import */ var _config_redux_redux_actions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../config/redux/redux.actions */ "wAIg");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-redux */ "/MKj");
/* harmony import */ var _engine_src_index__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../engine/src/index */ "tCIO");
/* harmony import */ var _assets_style_internal_dashboard_scss__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../assets/style/internal/dashboard.scss */ "CCNJ");
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
      cellHeight: 8,
      project_name: 'form_1'
    };
    this.props.updateViewSettings(payload);
  }

  render() {
    const {
      viewWidth,
      viewHeight,
      cellWidth,
      cellHeight,
      project_name
    } = _common_config_redux_redux_store__WEBPACK_IMPORTED_MODULE_1__["store"].getState().appReducer;
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "d-container"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h2", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
      className: "user-icon"
    }), "Dashboard"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_engine_src_index__WEBPACK_IMPORTED_MODULE_4__["default"], {
      project_name: project_name,
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

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9jbGllbnQvYXBwL2Fzc2V0cy9zdHlsZS9pbnRlcm5hbC9kYXNoYm9hcmQuc2NzcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvYXBwL2Fzc2V0cy9zdHlsZS9pbnRlcm5hbC9kYXNoYm9hcmQuc2Nzcz83MmYwIiwid2VicGFjazovLy8uL2NsaWVudC9hcHAvc3JjL2ludGVybmFsL2Rhc2hib2FyZC5jb21wb25lbnQuanMiXSwibmFtZXMiOlsibWFwU3RhdGVUb1Byb3BzIiwic3RhdGUiLCJtYXBEaXNwYXRjaFRvUHJvcHMiLCJkaXNwYXRjaCIsInVwZGF0ZVZpZXdTZXR0aW5ncyIsInBheWxvYWQiLCJEYXNoYm9hcmRDb21wb25lbnQiLCJDb21wb25lbnQiLCJjb25zdHJ1Y3RvciIsInByb3BzIiwidmlld1dpZHRoIiwidmlld0hlaWdodCIsImNlbGxXaWR0aCIsImNlbGxIZWlnaHQiLCJwcm9qZWN0X25hbWUiLCJyZW5kZXIiLCJzdG9yZSIsImdldFN0YXRlIiwiYXBwUmVkdWNlciIsIkRhc2hib2FyZCIsImNvbm5lY3QiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBLDJCQUEyQixtQkFBTyxDQUFDLHdFQUE0RDtBQUMvRjtBQUNBLGNBQWMsUUFBUyxpQkFBaUIsdUJBQXVCLGdCQUFnQixxQkFBcUIsc0JBQXNCLHVCQUF1QiwrQ0FBK0MsRUFBRSwrQkFBK0Isb0JBQW9CLHdCQUF3Qiw2QkFBNkIseUJBQXlCLEVBQUUsRUFBRSxTQUFTLDRLQUE0SyxZQUFZLFdBQVcsWUFBWSxhQUFhLGFBQWEsa0JBQWtCLE1BQU0sS0FBSyxVQUFVLFlBQVksa0ZBQWtGLDJCQUEyQixvQkFBb0IseUJBQXlCLDBCQUEwQiwyQkFBMkIsa0RBQWtELG1DQUFtQyw0QkFBNEIsaUNBQWlDLDZCQUE2QixTQUFTLEtBQUssbUJBQW1COzs7Ozs7Ozs7Ozs7OztBQ0QzZ0MsY0FBYyxtQkFBTyxDQUFDLDRKQUFpSjs7QUFFdkssNENBQTRDLFFBQVM7O0FBRXJEO0FBQ0E7Ozs7QUFJQSxlQUFlOztBQUVmO0FBQ0E7O0FBRUEsYUFBYSxtQkFBTyxDQUFDLHVFQUE0RDs7QUFFakY7O0FBRUEsR0FBRyxLQUFVLEVBQUUsRTs7Ozs7Ozs7Ozs7O0FDbkJmO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTs7QUFFQSxNQUFNQSxlQUFlLEdBQUlDLEtBQUQsSUFBV0EsS0FBbkM7O0FBRUEsU0FBU0Msa0JBQVQsQ0FBNEJDLFFBQTVCLEVBQXNDO0FBQ2xDLFNBQU87QUFDSEMsc0JBQWtCLEVBQUVDLE9BQU8sSUFBSUYsUUFBUSxDQUFDQyxzRkFBa0IsQ0FBQ0MsT0FBRCxDQUFuQjtBQURwQyxHQUFQO0FBR0g7O0FBRUQsTUFBTUMsa0JBQU4sU0FBaUNDLCtDQUFqQyxDQUEyQztBQUN2Q0MsYUFBVyxDQUFDQyxLQUFELEVBQVE7QUFDZixVQUFNQSxLQUFOO0FBRUEsVUFBTUosT0FBTyxHQUFHO0FBQ1pLLGVBQVMsRUFBRSxHQURDO0FBRVpDLGdCQUFVLEVBQUUsR0FGQTtBQUdaQyxlQUFTLEVBQUUsQ0FIQztBQUlaQyxnQkFBVSxFQUFFLENBSkE7QUFLWkMsa0JBQVksRUFBRTtBQUxGLEtBQWhCO0FBT0EsU0FBS0wsS0FBTCxDQUFXTCxrQkFBWCxDQUE4QkMsT0FBOUI7QUFDSDs7QUFFRFUsUUFBTSxHQUFHO0FBQ0wsVUFBTTtBQUFFTCxlQUFGO0FBQWFDLGdCQUFiO0FBQXlCQyxlQUF6QjtBQUFvQ0MsZ0JBQXBDO0FBQWdEQztBQUFoRCxRQUFpRUUsc0VBQUssQ0FBQ0MsUUFBTixHQUFpQkMsVUFBeEY7QUFFQSxXQUNJO0FBQUssZUFBUyxFQUFDO0FBQWYsT0FDSSx1RUFBSTtBQUFNLGVBQVMsRUFBQztBQUFoQixNQUFKLGNBREosRUFFSSwyREFBQyx5REFBRDtBQUNJLGtCQUFZLEVBQUVKLFlBRGxCO0FBRUksZUFBUyxFQUFFSixTQUZmO0FBR0ksZ0JBQVUsRUFBRUMsVUFIaEI7QUFJSSxlQUFTLEVBQUVDLFNBSmY7QUFLSSxnQkFBVSxFQUFFQztBQUxoQixNQUZKLENBREo7QUFXSDs7QUE1QnNDOztBQTZCMUM7QUFFRCxNQUFNTSxTQUFTLEdBQUdDLDJEQUFPLENBQUNwQixlQUFELEVBQWtCRSxrQkFBbEIsQ0FBUCxDQUE2Q0ksa0JBQTdDLENBQWxCO0FBRWVhLHdFQUFmLEUiLCJmaWxlIjoiYnVpbGQvNi40YmRkOTQwODAwZDlkZjNjMGVlMi5jaHVuay5qcyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzXCIpKHRydWUpO1xuLy8gTW9kdWxlXG5leHBvcnRzLnB1c2goW21vZHVsZS5pZCwgXCIuZC1jb250YWluZXIge1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgei1pbmRleDogMTA7XFxuICBtYXgtd2lkdGg6IDgwMHB4O1xcbiAgbWFyZ2luOiA0NHB4IGF1dG87XFxuICBib3JkZXItcmFkaXVzOiA0cHg7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuOSk7IH1cXG4gIEBtZWRpYSAobWF4LXdpZHRoOiA2MDBweCkge1xcbiAgICAuZC1jb250YWluZXIge1xcbiAgICAgIG1heC13aWR0aDogMTAwJTtcXG4gICAgICBtYXJnaW46IDAgIWltcG9ydGFudDtcXG4gICAgICBib3JkZXItcmFkaXVzOiAwOyB9IH1cXG5cIiwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJDOi9Vc2Vycy9nYXJyaS9zb3VyY2UvcmVwb3Mvc25hcGZvcm0vY2xpZW50L2FwcC9hc3NldHMvc3R5bGUvaW50ZXJuYWwvY2xpZW50L2FwcC9hc3NldHMvc3R5bGUvaW50ZXJuYWwvZGFzaGJvYXJkLnNjc3NcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBQUE7RUFDSSxrQkFBa0I7RUFDbEIsV0FBVztFQUNYLGdCQUFnQjtFQUNoQixpQkFBaUI7RUFDakIsa0JBQWtCO0VBQ2xCLDBDQUF5QyxFQUFBO0VBQ3pDO0lBUEo7TUFRUSxlQUFlO01BQ2Ysb0JBQW9CO01BQ3BCLGdCQUFnQixFQUFBLEVBRXZCXCIsXCJmaWxlXCI6XCJkYXNoYm9hcmQuc2Nzc1wiLFwic291cmNlc0NvbnRlbnRcIjpbXCIuZC1jb250YWluZXIge1xcclxcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XFxyXFxuICAgIHotaW5kZXg6IDEwO1xcclxcbiAgICBtYXgtd2lkdGg6IDgwMHB4O1xcclxcbiAgICBtYXJnaW46IDQ0cHggYXV0bztcXHJcXG4gICAgYm9yZGVyLXJhZGl1czogNHB4O1xcclxcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDI1NSwgMjU1LCAyNTUsIC45KTtcXHJcXG4gICAgQG1lZGlhIChtYXgtd2lkdGg6IDYwMHB4KSB7XFxyXFxuICAgICAgICBtYXgtd2lkdGg6IDEwMCU7XFxyXFxuICAgICAgICBtYXJnaW46IDAgIWltcG9ydGFudDtcXHJcXG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDA7XFxyXFxuICAgIH1cXHJcXG59XCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG5cbiIsIlxudmFyIGNvbnRlbnQgPSByZXF1aXJlKFwiISEuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcz8/cmVmLS02LTEhLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2xpYi9sb2FkZXIuanM/P3JlZi0tNi0yIS4vZGFzaGJvYXJkLnNjc3NcIik7XG5cbmlmKHR5cGVvZiBjb250ZW50ID09PSAnc3RyaW5nJykgY29udGVudCA9IFtbbW9kdWxlLmlkLCBjb250ZW50LCAnJ11dO1xuXG52YXIgdHJhbnNmb3JtO1xudmFyIGluc2VydEludG87XG5cblxuXG52YXIgb3B0aW9ucyA9IHtcImhtclwiOnRydWV9XG5cbm9wdGlvbnMudHJhbnNmb3JtID0gdHJhbnNmb3JtXG5vcHRpb25zLmluc2VydEludG8gPSB1bmRlZmluZWQ7XG5cbnZhciB1cGRhdGUgPSByZXF1aXJlKFwiIS4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvbGliL2FkZFN0eWxlcy5qc1wiKShjb250ZW50LCBvcHRpb25zKTtcblxuaWYoY29udGVudC5sb2NhbHMpIG1vZHVsZS5leHBvcnRzID0gY29udGVudC5sb2NhbHM7XG5cbmlmKG1vZHVsZS5ob3QpIHtcblx0bW9kdWxlLmhvdC5hY2NlcHQoXCIhIS4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzPz9yZWYtLTYtMSEuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvbGliL2xvYWRlci5qcz8/cmVmLS02LTIhLi9kYXNoYm9hcmQuc2Nzc1wiLCBmdW5jdGlvbigpIHtcblx0XHR2YXIgbmV3Q29udGVudCA9IHJlcXVpcmUoXCIhIS4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzPz9yZWYtLTYtMSEuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvbGliL2xvYWRlci5qcz8/cmVmLS02LTIhLi9kYXNoYm9hcmQuc2Nzc1wiKTtcblxuXHRcdGlmKHR5cGVvZiBuZXdDb250ZW50ID09PSAnc3RyaW5nJykgbmV3Q29udGVudCA9IFtbbW9kdWxlLmlkLCBuZXdDb250ZW50LCAnJ11dO1xuXG5cdFx0dmFyIGxvY2FscyA9IChmdW5jdGlvbihhLCBiKSB7XG5cdFx0XHR2YXIga2V5LCBpZHggPSAwO1xuXG5cdFx0XHRmb3Ioa2V5IGluIGEpIHtcblx0XHRcdFx0aWYoIWIgfHwgYVtrZXldICE9PSBiW2tleV0pIHJldHVybiBmYWxzZTtcblx0XHRcdFx0aWR4Kys7XG5cdFx0XHR9XG5cblx0XHRcdGZvcihrZXkgaW4gYikgaWR4LS07XG5cblx0XHRcdHJldHVybiBpZHggPT09IDA7XG5cdFx0fShjb250ZW50LmxvY2FscywgbmV3Q29udGVudC5sb2NhbHMpKTtcblxuXHRcdGlmKCFsb2NhbHMpIHRocm93IG5ldyBFcnJvcignQWJvcnRpbmcgQ1NTIEhNUiBkdWUgdG8gY2hhbmdlZCBjc3MtbW9kdWxlcyBsb2NhbHMuJyk7XG5cblx0XHR1cGRhdGUobmV3Q29udGVudCk7XG5cdH0pO1xuXG5cdG1vZHVsZS5ob3QuZGlzcG9zZShmdW5jdGlvbigpIHsgdXBkYXRlKCk7IH0pO1xufSIsImltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQgfSBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCB7IHN0b3JlIH0gZnJvbSAnLi4vLi4vLi4vY29tbW9uL2NvbmZpZy9yZWR1eC9yZWR1eC5zdG9yZSc7XHJcbmltcG9ydCB7IHVwZGF0ZVZpZXdTZXR0aW5ncyB9IGZyb20gJy4uL2NvbmZpZy9yZWR1eC9yZWR1eC5hY3Rpb25zJztcclxuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gJ3JlYWN0LXJlZHV4JztcclxuXHJcbmltcG9ydCBFbmdpbmVDb21wb25lbnQgZnJvbSAnLi4vLi4vLi4vZW5naW5lL3NyYy9pbmRleCc7XHJcblxyXG5pbXBvcnQgJy4uLy4uL2Fzc2V0cy9zdHlsZS9pbnRlcm5hbC9kYXNoYm9hcmQuc2Nzcyc7XHJcblxyXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSAoc3RhdGUpID0+IHN0YXRlO1xyXG5cclxuZnVuY3Rpb24gbWFwRGlzcGF0Y2hUb1Byb3BzKGRpc3BhdGNoKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHVwZGF0ZVZpZXdTZXR0aW5nczogcGF5bG9hZCA9PiBkaXNwYXRjaCh1cGRhdGVWaWV3U2V0dGluZ3MocGF5bG9hZCkpXHJcbiAgICB9O1xyXG59XHJcblxyXG5jbGFzcyBEYXNoYm9hcmRDb21wb25lbnQgZXh0ZW5kcyBDb21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcblxyXG4gICAgICAgIGNvbnN0IHBheWxvYWQgPSB7XHJcbiAgICAgICAgICAgIHZpZXdXaWR0aDogODAwLFxyXG4gICAgICAgICAgICB2aWV3SGVpZ2h0OiA1NTAsXHJcbiAgICAgICAgICAgIGNlbGxXaWR0aDogOCxcclxuICAgICAgICAgICAgY2VsbEhlaWdodDogOCxcclxuICAgICAgICAgICAgcHJvamVjdF9uYW1lOiAnZm9ybV8xJ1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5wcm9wcy51cGRhdGVWaWV3U2V0dGluZ3MocGF5bG9hZCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgdmlld1dpZHRoLCB2aWV3SGVpZ2h0LCBjZWxsV2lkdGgsIGNlbGxIZWlnaHQsIHByb2plY3RfbmFtZSB9ID0gc3RvcmUuZ2V0U3RhdGUoKS5hcHBSZWR1Y2VyO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZC1jb250YWluZXJcIj5cclxuICAgICAgICAgICAgICAgIDxoMj48c3BhbiBjbGFzc05hbWU9XCJ1c2VyLWljb25cIj48L3NwYW4+RGFzaGJvYXJkPC9oMj5cclxuICAgICAgICAgICAgICAgIDxFbmdpbmVDb21wb25lbnQgXHJcbiAgICAgICAgICAgICAgICAgICAgcHJvamVjdF9uYW1lPXtwcm9qZWN0X25hbWV9XHJcbiAgICAgICAgICAgICAgICAgICAgdmlld1dpZHRoPXt2aWV3V2lkdGh9IFxyXG4gICAgICAgICAgICAgICAgICAgIHZpZXdIZWlnaHQ9e3ZpZXdIZWlnaHR9XHJcbiAgICAgICAgICAgICAgICAgICAgY2VsbFdpZHRoPXtjZWxsV2lkdGh9XHJcbiAgICAgICAgICAgICAgICAgICAgY2VsbEhlaWdodD17Y2VsbEhlaWdodH0gLz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufTtcclxuXHJcbmNvbnN0IERhc2hib2FyZCA9IGNvbm5lY3QobWFwU3RhdGVUb1Byb3BzLCBtYXBEaXNwYXRjaFRvUHJvcHMpKERhc2hib2FyZENvbXBvbmVudCk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBEYXNoYm9hcmQ7Il0sInNvdXJjZVJvb3QiOiIifQ==