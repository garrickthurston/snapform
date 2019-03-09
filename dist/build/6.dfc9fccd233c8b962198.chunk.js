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
/* harmony import */ var _config_redux_redux_store__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../config/redux/redux.store */ "MBHU");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-redux */ "/MKj");
/* harmony import */ var _shared_services_project_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../shared/services/project.service */ "tPso");
/* harmony import */ var react_loadable__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-loadable */ "CnBM");
/* harmony import */ var react_loadable__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_loadable__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _shared_components_loading_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../shared/components/loading.component */ "L6gD");
/* harmony import */ var _assets_style_internal_workspace_project_project_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../assets/style/internal/workspace/project/project.scss */ "MYdX");
/* harmony import */ var _assets_style_internal_workspace_project_project_scss__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_assets_style_internal_workspace_project_project_scss__WEBPACK_IMPORTED_MODULE_6__);






const EngineComponent = react_loadable__WEBPACK_IMPORTED_MODULE_4___default()({
  loader: () => Promise.all(/*! import() */[__webpack_require__.e("vendor/vendor.uuid"), __webpack_require__.e(1)]).then(__webpack_require__.bind(null, /*! ../../../../../engine/src/index */ "tCIO")),
  loading: _shared_components_loading_component__WEBPACK_IMPORTED_MODULE_5__["default"]
});


const mapStateToProps = state => state;

function mapDispatchToProps(dispatch) {
  return {};
}

class ProjectComponent extends react__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  constructor(props) {
    super(props);
    this.projectService = new _shared_services_project_service__WEBPACK_IMPORTED_MODULE_3__["ProjectService"]();
    this.state = {};
    this.projectService.get(this.props.workspace_id, this.props.project_id).then(project => {
      this.setState(Object.assign({}, this.state, {
        project
      }));
    }).catch(e => {});
    this.handleProjectUpdate = this.handleProjectUpdate.bind(this);
  }

  componentDidMount() {
    this.project.addEventListener('sf.workspace.project.update', this.handleProjectUpdate, false);
  }

  componentWillUnmount() {
    this.project.removeEventListener('sf.workspace.project.update', this.handleProjectUpdate, false);
  }

  async handleProjectUpdate(e) {
    const {
      workspace_id,
      project
    } = e.detail;

    try {
      await this.projectService.put(workspace_id, project.project_id, project);
    } catch (e) {}
  }

  render() {
    const {
      workspace_id
    } = this.props;
    const {
      project
    } = this.state;
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "project-container",
      ref: project => this.project = project
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9jbGllbnQvYXBwL2Fzc2V0cy9zdHlsZS9pbnRlcm5hbC93b3Jrc3BhY2UvcHJvamVjdC9wcm9qZWN0LnNjc3MiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L2FwcC9hc3NldHMvc3R5bGUvaW50ZXJuYWwvd29ya3NwYWNlL3Byb2plY3QvcHJvamVjdC5zY3NzPzYyZGMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L2FwcC9zcmMvaW50ZXJuYWwvd29ya3NwYWNlL3Byb2plY3QvcHJvamVjdC5jb21wb25lbnQuanMiXSwibmFtZXMiOlsiRW5naW5lQ29tcG9uZW50IiwiTG9hZGFibGUiLCJsb2FkZXIiLCJsb2FkaW5nIiwiTG9hZGluZ0NvbXBvbmVudCIsIm1hcFN0YXRlVG9Qcm9wcyIsInN0YXRlIiwibWFwRGlzcGF0Y2hUb1Byb3BzIiwiZGlzcGF0Y2giLCJQcm9qZWN0Q29tcG9uZW50IiwiQ29tcG9uZW50IiwiY29uc3RydWN0b3IiLCJwcm9wcyIsInByb2plY3RTZXJ2aWNlIiwiUHJvamVjdFNlcnZpY2UiLCJnZXQiLCJ3b3Jrc3BhY2VfaWQiLCJwcm9qZWN0X2lkIiwidGhlbiIsInByb2plY3QiLCJzZXRTdGF0ZSIsIk9iamVjdCIsImFzc2lnbiIsImNhdGNoIiwiZSIsImhhbmRsZVByb2plY3RVcGRhdGUiLCJiaW5kIiwiY29tcG9uZW50RGlkTW91bnQiLCJhZGRFdmVudExpc3RlbmVyIiwiY29tcG9uZW50V2lsbFVubW91bnQiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiZGV0YWlsIiwicHV0IiwicmVuZGVyIiwiUHJvamVjdCIsImNvbm5lY3QiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBLDJCQUEyQixtQkFBTyxDQUFDLDhFQUFrRTtBQUNyRztBQUNBLGNBQWMsUUFBUyx1QkFBdUIsdUJBQXVCLEVBQUUsU0FBUyw4TUFBOE0sK0VBQStFLDJCQUEyQixLQUFLLG1CQUFtQjs7Ozs7Ozs7Ozs7Ozs7QUNEaGEsY0FBYyxtQkFBTyxDQUFD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OTguY2h1bmsuanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiKSh0cnVlKTtcbi8vIE1vZHVsZVxuZXhwb3J0cy5wdXNoKFttb2R1bGUuaWQsIFwiLnByb2plY3QtY29udGFpbmVyIHtcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTsgfVxcblwiLCBcIlwiLHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIkM6L1VzZXJzL2dhcnJpL3NvdXJjZS9yZXBvcy9zbmFwZm9ybS9jbGllbnQvYXBwL2Fzc2V0cy9zdHlsZS9pbnRlcm5hbC93b3Jrc3BhY2UvcHJvamVjdC9jbGllbnQvYXBwL2Fzc2V0cy9zdHlsZS9pbnRlcm5hbC93b3Jrc3BhY2UvcHJvamVjdC9wcm9qZWN0LnNjc3NcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBQUE7RUFDSSxrQkFBa0IsRUFBQVwiLFwiZmlsZVwiOlwicHJvamVjdC5zY3NzXCIsXCJzb3VyY2VzQ29udGVudFwiOltcIi5wcm9qZWN0LWNvbnRhaW5lciB7XFxyXFxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcXHJcXG59XCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG5cbiIsIlxudmFyIGNvbnRlbnQgPSByZXF1aXJlKFwiISEuLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcz8/cmVmLS02LTEhLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2xpYi9sb2FkZXIuanM/P3JlZi0tNi0yIS4vcHJvamVjdC5zY3NzXCIpO1xuXG5pZih0eXBlb2YgY29udGVudCA9PT0gJ3N0cmluZycpIGNvbnRlbnQgPSBbW21vZHVsZS5pZCwgY29udGVudCwgJyddXTtcblxudmFyIHRyYW5zZm9ybTtcbnZhciBpbnNlcnRJbnRvO1xuXG5cblxudmFyIG9wdGlvbnMgPSB7XCJobXJcIjp0cnVlfVxuXG5vcHRpb25zLnRyYW5zZm9ybSA9IHRyYW5zZm9ybVxub3B0aW9ucy5pbnNlcnRJbnRvID0gdW5kZWZpbmVkO1xuXG52YXIgdXBkYXRlID0gcmVxdWlyZShcIiEuLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2xpYi9hZGRTdHlsZXMuanNcIikoY29udGVudCwgb3B0aW9ucyk7XG5cbmlmKGNvbnRlbnQubG9jYWxzKSBtb2R1bGUuZXhwb3J0cyA9IGNvbnRlbnQubG9jYWxzO1xuXG5pZihtb2R1bGUuaG90KSB7XG5cdG1vZHVsZS5ob3QuYWNjZXB0KFwiISEuLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcz8/cmVmLS02LTEhLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2xpYi9sb2FkZXIuanM/P3JlZi0tNi0yIS4vcHJvamVjdC5zY3NzXCIsIGZ1bmN0aW9uKCkge1xuXHRcdHZhciBuZXdDb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanM/P3JlZi0tNi0xIS4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9saWIvbG9hZGVyLmpzPz9yZWYtLTYtMiEuL3Byb2plY3Quc2Nzc1wiKTtcblxuXHRcdGlmKHR5cGVvZiBuZXdDb250ZW50ID09PSAnc3RyaW5nJykgbmV3Q29udGVudCA9IFtbbW9kdWxlLmlkLCBuZXdDb250ZW50LCAnJ11dO1xuXG5cdFx0dmFyIGxvY2FscyA9IChmdW5jdGlvbihhLCBiKSB7XG5cdFx0XHR2YXIga2V5LCBpZHggPSAwO1xuXG5cdFx0XHRmb3Ioa2V5IGluIGEpIHtcblx0XHRcdFx0aWYoIWIgfHwgYVtrZXldICE9PSBiW2tleV0pIHJldHVybiBmYWxzZTtcblx0XHRcdFx0aWR4Kys7XG5cdFx0XHR9XG5cblx0XHRcdGZvcihrZXkgaW4gYikgaWR4LS07XG5cblx0XHRcdHJldHVybiBpZHggPT09IDA7XG5cdFx0fShjb250ZW50LmxvY2FscywgbmV3Q29udGVudC5sb2NhbHMpKTtcblxuXHRcdGlmKCFsb2NhbHMpIHRocm93IG5ldyBFcnJvcignQWJvcnRpbmcgQ1NTIEhNUiBkdWUgdG8gY2hhbmdlZCBjc3MtbW9kdWxlcyBsb2NhbHMuJyk7XG5cblx0XHR1cGRhdGUobmV3Q29udGVudCk7XG5cdH0pO1xuXG5cdG1vZHVsZS5ob3QuZGlzcG9zZShmdW5jdGlvbigpIHsgdXBkYXRlKCk7IH0pO1xufSIsImltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQgfSBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCB7IHN0b3JlIH0gZnJvbSAnLi4vLi4vLi4vY29uZmlnL3JlZHV4L3JlZHV4LnN0b3JlJztcclxuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gJ3JlYWN0LXJlZHV4JztcclxuaW1wb3J0IHsgUHJvamVjdFNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi9zaGFyZWQvc2VydmljZXMvcHJvamVjdC5zZXJ2aWNlJztcclxuaW1wb3J0IExvYWRhYmxlIGZyb20gJ3JlYWN0LWxvYWRhYmxlJztcclxuXHJcbmltcG9ydCBMb2FkaW5nQ29tcG9uZW50IGZyb20gJy4uLy4uLy4uL3NoYXJlZC9jb21wb25lbnRzL2xvYWRpbmcuY29tcG9uZW50JztcclxuXHJcbmNvbnN0IEVuZ2luZUNvbXBvbmVudCA9IExvYWRhYmxlKHtcclxuICAgIGxvYWRlcjogKCkgPT4gaW1wb3J0ICgnLi4vLi4vLi4vLi4vLi4vZW5naW5lL3NyYy9pbmRleCcpLFxyXG4gICAgbG9hZGluZzogTG9hZGluZ0NvbXBvbmVudFxyXG59KTtcclxuXHJcbmltcG9ydCAnLi4vLi4vLi4vLi4vYXNzZXRzL3N0eWxlL2ludGVybmFsL3dvcmtzcGFjZS9wcm9qZWN0L3Byb2plY3Quc2Nzcyc7XHJcblxyXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSAoc3RhdGUpID0+IHN0YXRlO1xyXG5cclxuZnVuY3Rpb24gbWFwRGlzcGF0Y2hUb1Byb3BzKGRpc3BhdGNoKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIFxyXG4gICAgfTtcclxufVxyXG5cclxuY2xhc3MgUHJvamVjdENvbXBvbmVudCBleHRlbmRzIENvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuXHJcbiAgICAgICAgdGhpcy5wcm9qZWN0U2VydmljZSA9IG5ldyBQcm9qZWN0U2VydmljZSgpO1xyXG5cclxuICAgICAgICB0aGlzLnN0YXRlID0ge307XHJcblxyXG4gICAgICAgIHRoaXMucHJvamVjdFNlcnZpY2UuZ2V0KHRoaXMucHJvcHMud29ya3NwYWNlX2lkLCB0aGlzLnByb3BzLnByb2plY3RfaWQpLnRoZW4ocHJvamVjdCA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5zdGF0ZSwge1xyXG4gICAgICAgICAgICAgICAgcHJvamVjdFxyXG4gICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgfSkuY2F0Y2goZSA9PiB7XHJcblxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmhhbmRsZVByb2plY3RVcGRhdGUgPSB0aGlzLmhhbmRsZVByb2plY3RVcGRhdGUuYmluZCh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcclxuICAgICAgICB0aGlzLnByb2plY3QuYWRkRXZlbnRMaXN0ZW5lcignc2Yud29ya3NwYWNlLnByb2plY3QudXBkYXRlJywgdGhpcy5oYW5kbGVQcm9qZWN0VXBkYXRlLCBmYWxzZSk7XHJcbiAgICB9XHJcblxyXG4gICAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XHJcbiAgICAgICAgdGhpcy5wcm9qZWN0LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3NmLndvcmtzcGFjZS5wcm9qZWN0LnVwZGF0ZScsIHRoaXMuaGFuZGxlUHJvamVjdFVwZGF0ZSwgZmFsc2UpO1xyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIGhhbmRsZVByb2plY3RVcGRhdGUoZSkge1xyXG4gICAgICAgIGNvbnN0IHsgd29ya3NwYWNlX2lkLCBwcm9qZWN0IH0gPSBlLmRldGFpbDtcclxuXHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgYXdhaXQgdGhpcy5wcm9qZWN0U2VydmljZS5wdXQod29ya3NwYWNlX2lkLCBwcm9qZWN0LnByb2plY3RfaWQsIHByb2plY3QpO1xyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IHdvcmtzcGFjZV9pZCB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCB7IHByb2plY3QgfSA9IHRoaXMuc3RhdGU7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwcm9qZWN0LWNvbnRhaW5lclwiIHJlZj17cHJvamVjdCA9PiB0aGlzLnByb2plY3QgPSBwcm9qZWN0fT5cclxuICAgICAgICAgICAgICAgIDxoMj48c3BhbiBjbGFzc05hbWU9XCJ1c2VyLWljb25cIj48L3NwYW4+V29ya3NwYWNlPC9oMj5cclxuICAgICAgICAgICAgICAgIHsgcHJvamVjdCA/XHJcbiAgICAgICAgICAgICAgICA8RW5naW5lQ29tcG9uZW50IFxyXG4gICAgICAgICAgICAgICAgICAgIHdvcmtzcGFjZV9pZD17d29ya3NwYWNlX2lkfVxyXG4gICAgICAgICAgICAgICAgICAgIHByb2plY3Q9e3Byb2plY3R9IC8+XHJcbiAgICAgICAgICAgICAgICA6IG51bGwgfVxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59O1xyXG5cclxuY29uc3QgUHJvamVjdCA9IGNvbm5lY3QobWFwU3RhdGVUb1Byb3BzLCBtYXBEaXNwYXRjaFRvUHJvcHMpKFByb2plY3RDb21wb25lbnQpO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgUHJvamVjdDsiXSwic291cmNlUm9vdCI6IiJ9