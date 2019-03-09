(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[6],{

/***/ "0fwD":
/*!****************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js??ref--6-1!./node_modules/sass-loader/lib/loader.js??ref--6-2!./client/app/assets/style/internal/workspace/project/project.scss ***!
  \****************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../../../../../node_modules/css-loader/dist/runtime/api.js */ "JPst")(true);
// Module
exports.push([module.i, ".project-container {\n  position: relative; }\n", "",{"version":3,"sources":["C:/Users/garri/source/repos/snapform/client/app/assets/style/internal/workspace/project/client/app/assets/style/internal/workspace/project/project.scss"],"names":[],"mappings":"AAAA;EACI,kBAAkB,EAAA","file":"project.scss","sourcesContent":[".project-container {\r\n    position: relative;\r\n}"],"sourceRoot":""}]);



/***/ }),

/***/ "MYdX":
/*!*************************************************************************!*\
  !*** ./client/app/assets/style/internal/workspace/project/project.scss ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../../../../../../node_modules/css-loader/dist/cjs.js??ref--6-1!../../../../../../../node_modules/sass-loader/lib/loader.js??ref--6-2!./project.scss */ "0fwD");

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(/*! ../../../../../../../node_modules/style-loader/lib/addStyles.js */ "aET+")(content, options);

if(content.locals) module.exports = content.locals;

if(false) {}

/***/ }),

/***/ "liRl":
/*!************************************************************************!*\
  !*** ./client/app/src/internal/workspace/project/project.component.js ***!
  \************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _common_config_redux_redux_store__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../../common/config/redux/redux.store */ "p6Ez");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-redux */ "/MKj");
/* harmony import */ var _common_services_project_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../../common/services/project.service */ "XSen");
/* harmony import */ var react_loadable__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-loadable */ "CnBM");
/* harmony import */ var react_loadable__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_loadable__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _shared_loading_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../shared/loading.component */ "Xj/u");
/* harmony import */ var _assets_style_internal_workspace_project_project_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../assets/style/internal/workspace/project/project.scss */ "MYdX");
/* harmony import */ var _assets_style_internal_workspace_project_project_scss__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_assets_style_internal_workspace_project_project_scss__WEBPACK_IMPORTED_MODULE_6__);






const EngineComponent = react_loadable__WEBPACK_IMPORTED_MODULE_4___default()({
  loader: () => Promise.all(/*! import() */[__webpack_require__.e("vendor/vendor.uuid"), __webpack_require__.e(1)]).then(__webpack_require__.bind(null, /*! ../../../../../engine/src/index */ "tCIO")),
  loading: _shared_loading_component__WEBPACK_IMPORTED_MODULE_5__["default"]
});


const mapStateToProps = state => state;

function mapDispatchToProps(dispatch) {
  return {};
}

class ProjectComponent extends react__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  constructor(props) {
    super(props);
    this.projectService = new _common_services_project_service__WEBPACK_IMPORTED_MODULE_3__["ProjectService"]();
    this.state = {};
    this.projectService.get(this.props.workspace_id, this.props.project_id).then(project => {
      this.setState(Object.assign({}, this.state, {
        project
      }));
    }).catch(e => {});
  }

  render() {
    const {
      workspace_id
    } = this.props;
    const {
      project
    } = this.state;
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "project-container"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h2", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
      className: "user-icon"
    }), "Workspace"), project ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(EngineComponent, {
      workspace_id: workspace_id,
      project: project
    }) : null);
  }

}

;
const Project = Object(react_redux__WEBPACK_IMPORTED_MODULE_2__["connect"])(mapStateToProps, mapDispatchToProps)(ProjectComponent);
/* harmony default export */ __webpack_exports__["default"] = (Project);

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9jbGllbnQvYXBwL2Fzc2V0cy9zdHlsZS9pbnRlcm5hbC93b3Jrc3BhY2UvcHJvamVjdC9wcm9qZWN0LnNjc3MiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L2FwcC9hc3NldHMvc3R5bGUvaW50ZXJuYWwvd29ya3NwYWNlL3Byb2plY3QvcHJvamVjdC5zY3NzPzYyZGMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L2FwcC9zcmMvaW50ZXJuYWwvd29ya3NwYWNlL3Byb2plY3QvcHJvamVjdC5jb21wb25lbnQuanMiXSwibmFtZXMiOlsiRW5naW5lQ29tcG9uZW50IiwiTG9hZGFibGUiLCJsb2FkZXIiLCJsb2FkaW5nIiwiTG9hZGluZ0NvbXBvbmVudCIsIm1hcFN0YXRlVG9Qcm9wcyIsInN0YXRlIiwibWFwRGlzcGF0Y2hUb1Byb3BzIiwiZGlzcGF0Y2giLCJQcm9qZWN0Q29tcG9uZW50IiwiQ29tcG9uZW50IiwiY29uc3RydWN0b3IiLCJwcm9wcyIsInByb2plY3RTZXJ2aWNlIiwiUHJvamVjdFNlcnZpY2UiLCJnZXQiLCJ3b3Jrc3BhY2VfaWQiLCJwcm9qZWN0X2lkIiwidGhlbiIsInByb2plY3QiLCJzZXRTdGF0ZSIsIk9iamVjdCIsImFzc2lnbiIsImNhdGNoIiwiZSIsInJlbmRlciIsIlByb2plY3QiLCJjb25uZWN0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSwyQkFBMkIsbUJBQU8sQ0FBQyw4RUFBa0U7QUFDckc7QUFDQSxjQUFjLFFBQVMsdUJBQXVCLHVCQUF1QixFQUFFLFNBQVMsOE1BQThNLCtFQUErRSwyQkFBMkIsS0FBSyxtQkFBbUI7Ozs7Ozs7Ozs7Ozs7O0FDRGhhLGNBQWMsbUJBQU8sQ0FBQyxzS0FBMko7O0FBRWpMLDRDQUE0QyxRQUFTOztBQUVyRDtBQUNBOzs7O0FBSUEsZUFBZTs7QUFFZjtBQUNBOztBQUVBLGFBQWEsbUJBQU8sQ0FBQyw2RUFBa0U7O0FBRXZGOztBQUVBLEdBQUcsS0FBVSxFQUFFLEU7Ozs7Ozs7Ozs7OztBQ25CZjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUEsTUFBTUEsZUFBZSxHQUFHQyxxREFBUSxDQUFDO0FBQzdCQyxRQUFNLEVBQUUsTUFBTSx1TEFEZTtBQUU3QkMsU0FBTyxFQUFFQyxpRUFBZ0JBO0FBRkksQ0FBRCxDQUFoQztBQUtBOztBQUVBLE1BQU1DLGVBQWUsR0FBSUMsS0FBRCxJQUFXQSxLQUFuQzs7QUFFQSxTQUFTQyxrQkFBVCxDQUE0QkMsUUFBNUIsRUFBc0M7QUFDbEMsU0FBTyxFQUFQO0FBR0g7O0FBRUQsTUFBTUMsZ0JBQU4sU0FBK0JDLCtDQUEvQixDQUF5QztBQUNyQ0MsYUFBVyxDQUFDQyxLQUFELEVBQVE7QUFDZixVQUFNQSxLQUFOO0FBRUEsU0FBS0MsY0FBTCxHQUFzQixJQUFJQywrRUFBSixFQUF0QjtBQUVBLFNBQUtSLEtBQUwsR0FBYSxFQUFiO0FBRUEsU0FBS08sY0FBTCxDQUFvQkUsR0FBcEIsQ0FBd0IsS0FBS0gsS0FBTCxDQUFXSSxZQUFuQyxFQUFpRCxLQUFLSixLQUFMLENBQVdLLFVBQTVELEVBQXdFQyxJQUF4RSxDQUE2RUMsT0FBTyxJQUFJO0FBQ3BGLFdBQUtDLFFBQUwsQ0FBY0MsTUFBTSxDQUFDQyxNQUFQLENBQWMsRUFBZCxFQUFrQixLQUFLaEIsS0FBdkIsRUFBOEI7QUFDeENhO0FBRHdDLE9BQTlCLENBQWQ7QUFHSCxLQUpELEVBSUdJLEtBSkgsQ0FJU0MsQ0FBQyxJQUFJLENBRWIsQ0FORDtBQU9IOztBQUVEQyxRQUFNLEdBQUc7QUFDTCxVQUFNO0FBQUVUO0FBQUYsUUFBbUIsS0FBS0osS0FBOUI7QUFDQSxVQUFNO0FBQUVPO0FBQUYsUUFBYyxLQUFLYixLQUF6QjtBQUVBLFdBQ0k7QUFBSyxlQUFTLEVBQUM7QUFBZixPQUNJLHVFQUFJO0FBQU0sZUFBUyxFQUFDO0FBQWhCLE1BQUosY0FESixFQUVNYSxPQUFPLEdBQ1QsMkRBQUMsZUFBRDtBQUNJLGtCQUFZLEVBQUVILFlBRGxCO0FBRUksYUFBTyxFQUFFRztBQUZiLE1BRFMsR0FJUCxJQU5OLENBREo7QUFVSDs7QUEvQm9DOztBQWdDeEM7QUFFRCxNQUFNTyxPQUFPLEdBQUdDLDJEQUFPLENBQUN0QixlQUFELEVBQWtCRSxrQkFBbEIsQ0FBUCxDQUE2Q0UsZ0JBQTdDLENBQWhCO0FBRWVpQixzRUFBZixFIiwiZmlsZSI6ImJ1aWxkLzYuMjlkNDc2MWQ1ZjM0YzA2Zjc2NmUuY2h1bmsuanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiKSh0cnVlKTtcbi8vIE1vZHVsZVxuZXhwb3J0cy5wdXNoKFttb2R1bGUuaWQsIFwiLnByb2plY3QtY29udGFpbmVyIHtcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTsgfVxcblwiLCBcIlwiLHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIkM6L1VzZXJzL2dhcnJpL3NvdXJjZS9yZXBvcy9zbmFwZm9ybS9jbGllbnQvYXBwL2Fzc2V0cy9zdHlsZS9pbnRlcm5hbC93b3Jrc3BhY2UvcHJvamVjdC9jbGllbnQvYXBwL2Fzc2V0cy9zdHlsZS9pbnRlcm5hbC93b3Jrc3BhY2UvcHJvamVjdC9wcm9qZWN0LnNjc3NcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBQUE7RUFDSSxrQkFBa0IsRUFBQVwiLFwiZmlsZVwiOlwicHJvamVjdC5zY3NzXCIsXCJzb3VyY2VzQ29udGVudFwiOltcIi5wcm9qZWN0LWNvbnRhaW5lciB7XFxyXFxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcXHJcXG59XCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG5cbiIsIlxudmFyIGNvbnRlbnQgPSByZXF1aXJlKFwiISEuLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcz8/cmVmLS02LTEhLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2xpYi9sb2FkZXIuanM/P3JlZi0tNi0yIS4vcHJvamVjdC5zY3NzXCIpO1xuXG5pZih0eXBlb2YgY29udGVudCA9PT0gJ3N0cmluZycpIGNvbnRlbnQgPSBbW21vZHVsZS5pZCwgY29udGVudCwgJyddXTtcblxudmFyIHRyYW5zZm9ybTtcbnZhciBpbnNlcnRJbnRvO1xuXG5cblxudmFyIG9wdGlvbnMgPSB7XCJobXJcIjp0cnVlfVxuXG5vcHRpb25zLnRyYW5zZm9ybSA9IHRyYW5zZm9ybVxub3B0aW9ucy5pbnNlcnRJbnRvID0gdW5kZWZpbmVkO1xuXG52YXIgdXBkYXRlID0gcmVxdWlyZShcIiEuLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2xpYi9hZGRTdHlsZXMuanNcIikoY29udGVudCwgb3B0aW9ucyk7XG5cbmlmKGNvbnRlbnQubG9jYWxzKSBtb2R1bGUuZXhwb3J0cyA9IGNvbnRlbnQubG9jYWxzO1xuXG5pZihtb2R1bGUuaG90KSB7XG5cdG1vZHVsZS5ob3QuYWNjZXB0KFwiISEuLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcz8/cmVmLS02LTEhLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2xpYi9sb2FkZXIuanM/P3JlZi0tNi0yIS4vcHJvamVjdC5zY3NzXCIsIGZ1bmN0aW9uKCkge1xuXHRcdHZhciBuZXdDb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanM/P3JlZi0tNi0xIS4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9saWIvbG9hZGVyLmpzPz9yZWYtLTYtMiEuL3Byb2plY3Quc2Nzc1wiKTtcblxuXHRcdGlmKHR5cGVvZiBuZXdDb250ZW50ID09PSAnc3RyaW5nJykgbmV3Q29udGVudCA9IFtbbW9kdWxlLmlkLCBuZXdDb250ZW50LCAnJ11dO1xuXG5cdFx0dmFyIGxvY2FscyA9IChmdW5jdGlvbihhLCBiKSB7XG5cdFx0XHR2YXIga2V5LCBpZHggPSAwO1xuXG5cdFx0XHRmb3Ioa2V5IGluIGEpIHtcblx0XHRcdFx0aWYoIWIgfHwgYVtrZXldICE9PSBiW2tleV0pIHJldHVybiBmYWxzZTtcblx0XHRcdFx0aWR4Kys7XG5cdFx0XHR9XG5cblx0XHRcdGZvcihrZXkgaW4gYikgaWR4LS07XG5cblx0XHRcdHJldHVybiBpZHggPT09IDA7XG5cdFx0fShjb250ZW50LmxvY2FscywgbmV3Q29udGVudC5sb2NhbHMpKTtcblxuXHRcdGlmKCFsb2NhbHMpIHRocm93IG5ldyBFcnJvcignQWJvcnRpbmcgQ1NTIEhNUiBkdWUgdG8gY2hhbmdlZCBjc3MtbW9kdWxlcyBsb2NhbHMuJyk7XG5cblx0XHR1cGRhdGUobmV3Q29udGVudCk7XG5cdH0pO1xuXG5cdG1vZHVsZS5ob3QuZGlzcG9zZShmdW5jdGlvbigpIHsgdXBkYXRlKCk7IH0pO1xufSIsImltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQgfSBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCB7IHN0b3JlIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vY29tbW9uL2NvbmZpZy9yZWR1eC9yZWR1eC5zdG9yZSc7XHJcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCc7XHJcbmltcG9ydCB7IFByb2plY3RTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vY29tbW9uL3NlcnZpY2VzL3Byb2plY3Quc2VydmljZSc7XHJcbmltcG9ydCBMb2FkYWJsZSBmcm9tICdyZWFjdC1sb2FkYWJsZSc7XHJcblxyXG5pbXBvcnQgTG9hZGluZ0NvbXBvbmVudCBmcm9tICcuLi8uLi8uLi9zaGFyZWQvbG9hZGluZy5jb21wb25lbnQnO1xyXG5cclxuY29uc3QgRW5naW5lQ29tcG9uZW50ID0gTG9hZGFibGUoe1xyXG4gICAgbG9hZGVyOiAoKSA9PiBpbXBvcnQgKCcuLi8uLi8uLi8uLi8uLi9lbmdpbmUvc3JjL2luZGV4JyksXHJcbiAgICBsb2FkaW5nOiBMb2FkaW5nQ29tcG9uZW50XHJcbn0pO1xyXG5cclxuaW1wb3J0ICcuLi8uLi8uLi8uLi9hc3NldHMvc3R5bGUvaW50ZXJuYWwvd29ya3NwYWNlL3Byb2plY3QvcHJvamVjdC5zY3NzJztcclxuXHJcbmNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9IChzdGF0ZSkgPT4gc3RhdGU7XHJcblxyXG5mdW5jdGlvbiBtYXBEaXNwYXRjaFRvUHJvcHMoZGlzcGF0Y2gpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgXHJcbiAgICB9O1xyXG59XHJcblxyXG5jbGFzcyBQcm9qZWN0Q29tcG9uZW50IGV4dGVuZHMgQ29tcG9uZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG5cclxuICAgICAgICB0aGlzLnByb2plY3RTZXJ2aWNlID0gbmV3IFByb2plY3RTZXJ2aWNlKCk7XHJcblxyXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7fTtcclxuXHJcbiAgICAgICAgdGhpcy5wcm9qZWN0U2VydmljZS5nZXQodGhpcy5wcm9wcy53b3Jrc3BhY2VfaWQsIHRoaXMucHJvcHMucHJvamVjdF9pZCkudGhlbihwcm9qZWN0ID0+IHtcclxuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZShPYmplY3QuYXNzaWduKHt9LCB0aGlzLnN0YXRlLCB7XHJcbiAgICAgICAgICAgICAgICBwcm9qZWN0XHJcbiAgICAgICAgICAgIH0pKTtcclxuICAgICAgICB9KS5jYXRjaChlID0+IHtcclxuXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgd29ya3NwYWNlX2lkIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IHsgcHJvamVjdCB9ID0gdGhpcy5zdGF0ZTtcclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInByb2plY3QtY29udGFpbmVyXCI+XHJcbiAgICAgICAgICAgICAgICA8aDI+PHNwYW4gY2xhc3NOYW1lPVwidXNlci1pY29uXCI+PC9zcGFuPldvcmtzcGFjZTwvaDI+XHJcbiAgICAgICAgICAgICAgICB7IHByb2plY3QgP1xyXG4gICAgICAgICAgICAgICAgPEVuZ2luZUNvbXBvbmVudCBcclxuICAgICAgICAgICAgICAgICAgICB3b3Jrc3BhY2VfaWQ9e3dvcmtzcGFjZV9pZH1cclxuICAgICAgICAgICAgICAgICAgICBwcm9qZWN0PXtwcm9qZWN0fSAvPlxyXG4gICAgICAgICAgICAgICAgOiBudWxsIH1cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufTtcclxuXHJcbmNvbnN0IFByb2plY3QgPSBjb25uZWN0KG1hcFN0YXRlVG9Qcm9wcywgbWFwRGlzcGF0Y2hUb1Byb3BzKShQcm9qZWN0Q29tcG9uZW50KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IFByb2plY3Q7Il0sInNvdXJjZVJvb3QiOiIifQ==