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
    } = _config_redux_redux_store__WEBPACK_IMPORTED_MODULE_1__["store"].getState();
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

/***/ }),

/***/ "QLZ0":
/*!********************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js??ref--6-1!./node_modules/sass-loader/lib/loader.js??ref--6-2!./client/assets/style/internal/dashboard.scss ***!
  \********************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../../node_modules/css-loader/dist/runtime/api.js */ "JPst")(true);
// Module
exports.push([module.i, ".d-container {\n  position: relative;\n  z-index: 10;\n  max-width: 800px;\n  margin: 44px auto;\n  border-radius: 4px;\n  background-color: rgba(255, 255, 255, 0.9); }\n  @media (max-width: 600px) {\n    .d-container {\n      max-width: 100%;\n      margin: 0 !important;\n      border-radius: 0; } }\n", "",{"version":3,"sources":["C:/Users/garri/source/repos/snapform/client/assets/style/internal/client/assets/style/internal/dashboard.scss"],"names":[],"mappings":"AAAA;EACI,kBAAkB;EAClB,WAAW;EACX,gBAAgB;EAChB,iBAAiB;EACjB,kBAAkB;EAClB,0CAAyC,EAAA;EACzC;IAPJ;MAQQ,eAAe;MACf,oBAAoB;MACpB,gBAAgB,EAAA,EAEvB","file":"dashboard.scss","sourcesContent":[".d-container {\r\n    position: relative;\r\n    z-index: 10;\r\n    max-width: 800px;\r\n    margin: 44px auto;\r\n    border-radius: 4px;\r\n    background-color: rgba(255, 255, 255, .9);\r\n    @media (max-width: 600px) {\r\n        max-width: 100%;\r\n        margin: 0 !important;\r\n        border-radius: 0;\r\n    }\r\n}"],"sourceRoot":""}]);



/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9jbGllbnQvYXNzZXRzL3N0eWxlL2ludGVybmFsL2Rhc2hib2FyZC5zY3NzPzQzYjciLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3NyYy9pbnRlcm5hbC9kYXNoYm9hcmQuY29tcG9uZW50LmpzIiwid2VicGFjazovLy8uL2NsaWVudC9hc3NldHMvc3R5bGUvaW50ZXJuYWwvZGFzaGJvYXJkLnNjc3MiXSwibmFtZXMiOlsibWFwU3RhdGVUb1Byb3BzIiwic3RhdGUiLCJtYXBEaXNwYXRjaFRvUHJvcHMiLCJkaXNwYXRjaCIsInVwZGF0ZVZpZXdTZXR0aW5ncyIsInBheWxvYWQiLCJEYXNoYm9hcmRDb21wb25lbnQiLCJDb21wb25lbnQiLCJjb25zdHJ1Y3RvciIsInByb3BzIiwidmlld1dpZHRoIiwidmlld0hlaWdodCIsImNlbGxXaWR0aCIsImNlbGxIZWlnaHQiLCJwcm9qZWN0X25hbWUiLCJyZW5kZXIiLCJzdG9yZSIsImdldFN0YXRlIiwiRGFzaGJvYXJkIiwiY29ubmVjdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUNBLGNBQWMsbUJBQU8sQ0FBQyxzSkFBMkk7O0FBRWpLLDRDQUE0QyxRQUFTOztBQUVyRDtBQUNBOzs7O0FBSUEsZUFBZTs7QUFFZjtBQUNBOztBQUVBLGFBQWEsbUJBQU8sQ0FBQyxvRUFBeUQ7O0FBRTlFOztBQUVBLEdBQUcsS0FBVSxFQUFFLEU7Ozs7Ozs7Ozs7OztBQ25CZjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7O0FBRUEsTUFBTUEsZUFBZSxHQUFJQyxLQUFELElBQVdBLEtBQW5DOztBQUVBLFNBQVNDLGtCQUFULENBQTRCQyxRQUE1QixFQUFzQztBQUNsQyxTQUFPO0FBQ0hDLHNCQUFrQixFQUFFQyxPQUFPLElBQUlGLFFBQVEsQ0FBQ0Msc0ZBQWtCLENBQUNDLE9BQUQsQ0FBbkI7QUFEcEMsR0FBUDtBQUdIOztBQUVELE1BQU1DLGtCQUFOLFNBQWlDQywrQ0FBakMsQ0FBMkM7QUFDdkNDLGFBQVcsQ0FBQ0MsS0FBRCxFQUFRO0FBQ2YsVUFBTUEsS0FBTjtBQUVBLFVBQU1KLE9BQU8sR0FBRztBQUNaSyxlQUFTLEVBQUUsR0FEQztBQUVaQyxnQkFBVSxFQUFFLEdBRkE7QUFHWkMsZUFBUyxFQUFFLENBSEM7QUFJWkMsZ0JBQVUsRUFBRSxDQUpBO0FBS1pDLGtCQUFZLEVBQUU7QUFMRixLQUFoQjtBQU9BLFNBQUtMLEtBQUwsQ0FBV0wsa0JBQVgsQ0FBOEJDLE9BQTlCO0FBQ0g7O0FBRURVLFFBQU0sR0FBRztBQUNMLFVBQU07QUFBRUwsZUFBRjtBQUFhQyxnQkFBYjtBQUF5QkMsZUFBekI7QUFBb0NDLGdCQUFwQztBQUFnREM7QUFBaEQsUUFBaUVFLCtEQUFLLENBQUNDLFFBQU4sRUFBdkU7QUFDQSxXQUNJO0FBQUssZUFBUyxFQUFDO0FBQWYsT0FDSSx1RUFBSTtBQUFNLGVBQVMsRUFBQztBQUFoQixNQUFKLGNBREosRUFFSSwyREFBQyx5REFBRDtBQUNJLGtCQUFZLEVBQUVILFlBRGxCO0FBRUksZUFBUyxFQUFFSixTQUZmO0FBR0ksZ0JBQVUsRUFBRUMsVUFIaEI7QUFJSSxlQUFTLEVBQUVDLFNBSmY7QUFLSSxnQkFBVSxFQUFFQztBQUxoQixNQUZKLENBREo7QUFXSDs7QUEzQnNDOztBQTRCMUM7QUFFRCxNQUFNSyxTQUFTLEdBQUdDLDJEQUFPLENBQUNuQixlQUFELEVBQWtCRSxrQkFBbEIsQ0FBUCxDQUE2Q0ksa0JBQTdDLENBQWxCO0FBRWVZLHdFQUFmLEU7Ozs7Ozs7Ozs7O0FDakRBLDJCQUEyQixtQkFBTyxDQUFDLHFFQUF5RDtBQUM1RjtBQUNBLGNBQWMsUUFBUyxpQkFBaUIsdUJBQXVCLGdCQUFnQixxQkFBcUIsc0JBQXNCLHVCQUF1QiwrQ0FBK0MsRUFBRSwrQkFBK0Isb0JBQW9CLHdCQUF3Qiw2QkFBNkIseUJBQXlCLEVBQUUsRUFBRSxTQUFTLG9LQUFvSyxZQUFZLFdBQVcsWUFBWSxhQUFhLGFBQWEsa0JBQWtCLE1BQU0sS0FBSyxVQUFVLFlBQVksa0ZBQWtGLDJCQUEyQixvQkFBb0IseUJBQXlCLDBCQUEwQiwyQkFBMkIsa0RBQWtELG1DQUFtQyw0QkFBNEIsaUNBQWlDLDZCQUE2QixTQUFTLEtBQUssbUJBQW1CIiwiZmlsZSI6ImJ1aWxkLzQuZjczNDYwNWU3YmM1NzYyOTcxNzUuY2h1bmsuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcbnZhciBjb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanM/P3JlZi0tNi0xIS4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9saWIvbG9hZGVyLmpzPz9yZWYtLTYtMiEuL2Rhc2hib2FyZC5zY3NzXCIpO1xuXG5pZih0eXBlb2YgY29udGVudCA9PT0gJ3N0cmluZycpIGNvbnRlbnQgPSBbW21vZHVsZS5pZCwgY29udGVudCwgJyddXTtcblxudmFyIHRyYW5zZm9ybTtcbnZhciBpbnNlcnRJbnRvO1xuXG5cblxudmFyIG9wdGlvbnMgPSB7XCJobXJcIjp0cnVlfVxuXG5vcHRpb25zLnRyYW5zZm9ybSA9IHRyYW5zZm9ybVxub3B0aW9ucy5pbnNlcnRJbnRvID0gdW5kZWZpbmVkO1xuXG52YXIgdXBkYXRlID0gcmVxdWlyZShcIiEuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2xpYi9hZGRTdHlsZXMuanNcIikoY29udGVudCwgb3B0aW9ucyk7XG5cbmlmKGNvbnRlbnQubG9jYWxzKSBtb2R1bGUuZXhwb3J0cyA9IGNvbnRlbnQubG9jYWxzO1xuXG5pZihtb2R1bGUuaG90KSB7XG5cdG1vZHVsZS5ob3QuYWNjZXB0KFwiISEuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcz8/cmVmLS02LTEhLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2xpYi9sb2FkZXIuanM/P3JlZi0tNi0yIS4vZGFzaGJvYXJkLnNjc3NcIiwgZnVuY3Rpb24oKSB7XG5cdFx0dmFyIG5ld0NvbnRlbnQgPSByZXF1aXJlKFwiISEuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcz8/cmVmLS02LTEhLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2xpYi9sb2FkZXIuanM/P3JlZi0tNi0yIS4vZGFzaGJvYXJkLnNjc3NcIik7XG5cblx0XHRpZih0eXBlb2YgbmV3Q29udGVudCA9PT0gJ3N0cmluZycpIG5ld0NvbnRlbnQgPSBbW21vZHVsZS5pZCwgbmV3Q29udGVudCwgJyddXTtcblxuXHRcdHZhciBsb2NhbHMgPSAoZnVuY3Rpb24oYSwgYikge1xuXHRcdFx0dmFyIGtleSwgaWR4ID0gMDtcblxuXHRcdFx0Zm9yKGtleSBpbiBhKSB7XG5cdFx0XHRcdGlmKCFiIHx8IGFba2V5XSAhPT0gYltrZXldKSByZXR1cm4gZmFsc2U7XG5cdFx0XHRcdGlkeCsrO1xuXHRcdFx0fVxuXG5cdFx0XHRmb3Ioa2V5IGluIGIpIGlkeC0tO1xuXG5cdFx0XHRyZXR1cm4gaWR4ID09PSAwO1xuXHRcdH0oY29udGVudC5sb2NhbHMsIG5ld0NvbnRlbnQubG9jYWxzKSk7XG5cblx0XHRpZighbG9jYWxzKSB0aHJvdyBuZXcgRXJyb3IoJ0Fib3J0aW5nIENTUyBITVIgZHVlIHRvIGNoYW5nZWQgY3NzLW1vZHVsZXMgbG9jYWxzLicpO1xuXG5cdFx0dXBkYXRlKG5ld0NvbnRlbnQpO1xuXHR9KTtcblxuXHRtb2R1bGUuaG90LmRpc3Bvc2UoZnVuY3Rpb24oKSB7IHVwZGF0ZSgpOyB9KTtcbn0iLCJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50IH0gZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgeyBzdG9yZSB9IGZyb20gJy4uL2NvbmZpZy9yZWR1eC9yZWR1eC5zdG9yZSc7XHJcbmltcG9ydCB7IHVwZGF0ZVZpZXdTZXR0aW5ncyB9IGZyb20gJy4uL2NvbmZpZy9yZWR1eC9yZWR1eC5hY3Rpb25zJztcclxuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gJ3JlYWN0LXJlZHV4JztcclxuXHJcbmltcG9ydCBFbmdpbmVDb21wb25lbnQgZnJvbSAnLi4vLi4vLi4vZW5naW5lL3NyYy9pbmRleCc7XHJcblxyXG5pbXBvcnQgJy4uLy4uL2Fzc2V0cy9zdHlsZS9pbnRlcm5hbC9kYXNoYm9hcmQuc2Nzcyc7XHJcblxyXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSAoc3RhdGUpID0+IHN0YXRlO1xyXG5cclxuZnVuY3Rpb24gbWFwRGlzcGF0Y2hUb1Byb3BzKGRpc3BhdGNoKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHVwZGF0ZVZpZXdTZXR0aW5nczogcGF5bG9hZCA9PiBkaXNwYXRjaCh1cGRhdGVWaWV3U2V0dGluZ3MocGF5bG9hZCkpXHJcbiAgICB9O1xyXG59XHJcblxyXG5jbGFzcyBEYXNoYm9hcmRDb21wb25lbnQgZXh0ZW5kcyBDb21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcblxyXG4gICAgICAgIGNvbnN0IHBheWxvYWQgPSB7XHJcbiAgICAgICAgICAgIHZpZXdXaWR0aDogODAwLFxyXG4gICAgICAgICAgICB2aWV3SGVpZ2h0OiA1NTAsXHJcbiAgICAgICAgICAgIGNlbGxXaWR0aDogOCxcclxuICAgICAgICAgICAgY2VsbEhlaWdodDogOCxcclxuICAgICAgICAgICAgcHJvamVjdF9uYW1lOiAnZm9ybV8xJ1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5wcm9wcy51cGRhdGVWaWV3U2V0dGluZ3MocGF5bG9hZCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgdmlld1dpZHRoLCB2aWV3SGVpZ2h0LCBjZWxsV2lkdGgsIGNlbGxIZWlnaHQsIHByb2plY3RfbmFtZSB9ID0gc3RvcmUuZ2V0U3RhdGUoKTtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImQtY29udGFpbmVyXCI+XHJcbiAgICAgICAgICAgICAgICA8aDI+PHNwYW4gY2xhc3NOYW1lPVwidXNlci1pY29uXCI+PC9zcGFuPkRhc2hib2FyZDwvaDI+XHJcbiAgICAgICAgICAgICAgICA8RW5naW5lQ29tcG9uZW50IFxyXG4gICAgICAgICAgICAgICAgICAgIHByb2plY3RfbmFtZT17cHJvamVjdF9uYW1lfVxyXG4gICAgICAgICAgICAgICAgICAgIHZpZXdXaWR0aD17dmlld1dpZHRofSBcclxuICAgICAgICAgICAgICAgICAgICB2aWV3SGVpZ2h0PXt2aWV3SGVpZ2h0fVxyXG4gICAgICAgICAgICAgICAgICAgIGNlbGxXaWR0aD17Y2VsbFdpZHRofVxyXG4gICAgICAgICAgICAgICAgICAgIGNlbGxIZWlnaHQ9e2NlbGxIZWlnaHR9IC8+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5jb25zdCBEYXNoYm9hcmQgPSBjb25uZWN0KG1hcFN0YXRlVG9Qcm9wcywgbWFwRGlzcGF0Y2hUb1Byb3BzKShEYXNoYm9hcmRDb21wb25lbnQpO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgRGFzaGJvYXJkOyIsImV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzXCIpKHRydWUpO1xuLy8gTW9kdWxlXG5leHBvcnRzLnB1c2goW21vZHVsZS5pZCwgXCIuZC1jb250YWluZXIge1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgei1pbmRleDogMTA7XFxuICBtYXgtd2lkdGg6IDgwMHB4O1xcbiAgbWFyZ2luOiA0NHB4IGF1dG87XFxuICBib3JkZXItcmFkaXVzOiA0cHg7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuOSk7IH1cXG4gIEBtZWRpYSAobWF4LXdpZHRoOiA2MDBweCkge1xcbiAgICAuZC1jb250YWluZXIge1xcbiAgICAgIG1heC13aWR0aDogMTAwJTtcXG4gICAgICBtYXJnaW46IDAgIWltcG9ydGFudDtcXG4gICAgICBib3JkZXItcmFkaXVzOiAwOyB9IH1cXG5cIiwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJDOi9Vc2Vycy9nYXJyaS9zb3VyY2UvcmVwb3Mvc25hcGZvcm0vY2xpZW50L2Fzc2V0cy9zdHlsZS9pbnRlcm5hbC9jbGllbnQvYXNzZXRzL3N0eWxlL2ludGVybmFsL2Rhc2hib2FyZC5zY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUFBO0VBQ0ksa0JBQWtCO0VBQ2xCLFdBQVc7RUFDWCxnQkFBZ0I7RUFDaEIsaUJBQWlCO0VBQ2pCLGtCQUFrQjtFQUNsQiwwQ0FBeUMsRUFBQTtFQUN6QztJQVBKO01BUVEsZUFBZTtNQUNmLG9CQUFvQjtNQUNwQixnQkFBZ0IsRUFBQSxFQUV2QlwiLFwiZmlsZVwiOlwiZGFzaGJvYXJkLnNjc3NcIixcInNvdXJjZXNDb250ZW50XCI6W1wiLmQtY29udGFpbmVyIHtcXHJcXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xcclxcbiAgICB6LWluZGV4OiAxMDtcXHJcXG4gICAgbWF4LXdpZHRoOiA4MDBweDtcXHJcXG4gICAgbWFyZ2luOiA0NHB4IGF1dG87XFxyXFxuICAgIGJvcmRlci1yYWRpdXM6IDRweDtcXHJcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyNTUsIDI1NSwgMjU1LCAuOSk7XFxyXFxuICAgIEBtZWRpYSAobWF4LXdpZHRoOiA2MDBweCkge1xcclxcbiAgICAgICAgbWF4LXdpZHRoOiAxMDAlO1xcclxcbiAgICAgICAgbWFyZ2luOiAwICFpbXBvcnRhbnQ7XFxyXFxuICAgICAgICBib3JkZXItcmFkaXVzOiAwO1xcclxcbiAgICB9XFxyXFxufVwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuXG4iXSwic291cmNlUm9vdCI6IiJ9