(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[4],{

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
/* harmony import */ var _common_services_workspace_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../common/services/workspace.service */ "zmDv");
/* harmony import */ var react_loadable__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-loadable */ "CnBM");
/* harmony import */ var react_loadable__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react_loadable__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _shared_loading_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../shared/loading.component */ "Xj/u");
/* harmony import */ var _assets_style_internal_dashboard_scss__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../assets/style/internal/dashboard.scss */ "CCNJ");
/* harmony import */ var _assets_style_internal_dashboard_scss__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_assets_style_internal_dashboard_scss__WEBPACK_IMPORTED_MODULE_7__);







const EngineComponent = react_loadable__WEBPACK_IMPORTED_MODULE_5___default()({
  loader: () => Promise.all(/*! import() */[__webpack_require__.e("vendor/vendor.uuid"), __webpack_require__.e(1)]).then(__webpack_require__.bind(null, /*! ../../../engine/src/index */ "tCIO")),
  loading: _shared_loading_component__WEBPACK_IMPORTED_MODULE_6__["default"]
});


const mapStateToProps = state => state;

function mapDispatchToProps(dispatch) {
  return {
    updateViewSettings: payload => dispatch(Object(_config_redux_redux_actions__WEBPACK_IMPORTED_MODULE_2__["updateViewSettings"])(payload))
  };
}

class DashboardComponent extends react__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  constructor(props) {
    super(props);
    this.workspaceService = new _common_services_workspace_service__WEBPACK_IMPORTED_MODULE_4__["WorkspaceService"]();
    this.state = {}; // TODO

    this.workspaceService.getAll().then(workspaces => {
      return this.workspaceService.get(workspaces[0].workspace_id);
    }).then(workspace => {
      this.setState(Object.assign({}, this.state, {
        workspace_id: workspace.workspace_id,
        project_id: workspace.projects[0],
        // TODO
        project_name: workspace.projects[0] // TODO

      })); // TODO: REMOVE view settings from here and not pass as props - originate in engine component

      const payload = {
        viewWidth: 800,
        viewHeight: 550,
        cellWidth: 8,
        cellHeight: 8
      };
      this.props.updateViewSettings(payload);
    }).catch(e => {});
  }

  render() {
    const {
      viewWidth,
      viewHeight,
      cellWidth,
      cellHeight
    } = _common_config_redux_redux_store__WEBPACK_IMPORTED_MODULE_1__["store"].getState().appReducer;
    const {
      project_name,
      project_id,
      workspace_id
    } = this.state;
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "d-container"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h2", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
      className: "user-icon"
    }), "Dashboard"), project_id && workspace_id ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(EngineComponent, {
      workspace_id: workspace_id,
      project_id: project_id,
      project_name: project_name,
      viewWidth: viewWidth,
      viewHeight: viewHeight,
      cellWidth: cellWidth,
      cellHeight: cellHeight
    }) : null);
  }

}

;
const Dashboard = Object(react_redux__WEBPACK_IMPORTED_MODULE_3__["connect"])(mapStateToProps, mapDispatchToProps)(DashboardComponent);
/* harmony default export */ __webpack_exports__["default"] = (Dashboard);

/***/ }),

/***/ "zmDv":
/*!*****************************************************!*\
  !*** ./client/common/services/workspace.service.js ***!
  \*****************************************************/
/*! exports provided: WorkspaceService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WorkspaceService", function() { return WorkspaceService; });
/* harmony import */ var _http__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../http */ "CFaH");

class WorkspaceService {
  constructor() {
    this.http = new _http__WEBPACK_IMPORTED_MODULE_0__["Http"]();
  }

  getAll() {
    return new Promise(async (resolve, reject) => {
      try {
        let results = await this.http.get(`/api/v1/workspace`);
        resolve(results);
      } catch (e) {
        reject(e);
      }
    });
  }

  get(workspace_id) {
    return new Promise(async (resolve, reject) => {
      try {
        let results = await this.http.get(`/api/v1/workspace/${workspace_id}`);
        resolve(results);
      } catch (e) {
        reject(e);
      }
    });
  }

  post(user_id, workspace) {
    return new Promise(async (resolve, reject) => {
      try {
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }

}

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9jbGllbnQvYXBwL2Fzc2V0cy9zdHlsZS9pbnRlcm5hbC9kYXNoYm9hcmQuc2NzcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvYXBwL2Fzc2V0cy9zdHlsZS9pbnRlcm5hbC9kYXNoYm9hcmQuc2Nzcz83MmYwIiwid2VicGFjazovLy8uL2NsaWVudC9hcHAvc3JjL2ludGVybmFsL2Rhc2hib2FyZC5jb21wb25lbnQuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L2NvbW1vbi9zZXJ2aWNlcy93b3Jrc3BhY2Uuc2VydmljZS5qcyJdLCJuYW1lcyI6WyJFbmdpbmVDb21wb25lbnQiLCJMb2FkYWJsZSIsImxvYWRlciIsImxvYWRpbmciLCJMb2FkaW5nQ29tcG9uZW50IiwibWFwU3RhdGVUb1Byb3BzIiwic3RhdGUiLCJtYXBEaXNwYXRjaFRvUHJvcHMiLCJkaXNwYXRjaCIsInVwZGF0ZVZpZXdTZXR0aW5ncyIsInBheWxvYWQiLCJEYXNoYm9hcmRDb21wb25lbnQiLCJDb21wb25lbnQiLCJjb25zdHJ1Y3RvciIsInByb3BzIiwid29ya3NwYWNlU2VydmljZSIsIldvcmtzcGFjZVNlcnZpY2UiLCJnZXRBbGwiLCJ0aGVuIiwid29ya3NwYWNlcyIsImdldCIsIndvcmtzcGFjZV9pZCIsIndvcmtzcGFjZSIsInNldFN0YXRlIiwiT2JqZWN0IiwiYXNzaWduIiwicHJvamVjdF9pZCIsInByb2plY3RzIiwicHJvamVjdF9uYW1lIiwidmlld1dpZHRoIiwidmlld0hlaWdodCIsImNlbGxXaWR0aCIsImNlbGxIZWlnaHQiLCJjYXRjaCIsImUiLCJyZW5kZXIiLCJzdG9yZSIsImdldFN0YXRlIiwiYXBwUmVkdWNlciIsIkRhc2hib2FyZCIsImNvbm5lY3QiLCJodHRwIiwiSHR0cCIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwicmVzdWx0cyIsInBvc3QiLCJ1c2VyX2lkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSwyQkFBMkIsbUJBQU8s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STtBQUNBLFlBQUlDLE9BQU8sR0FBRyxNQUFNLEtBQUtMLElBQUwsQ0FBVXJCLEdBQVYsQ0FBZSxxQkFBb0JDLFlBQWEsRUFBaEQsQ0FBcEI7QUFFQXVCLGVBQU8sQ0FBQ0UsT0FBRCxDQUFQO0FBQ0gsT0FKRCxDQUlFLE9BQU9aLENBQVAsRUFBVTtBQUNSVyxjQUFNLENBQUNYLENBQUQsQ0FBTjtBQUNIO0FBQ0osS0FSTSxDQUFQO0FBU0g7O0FBRURhLE1BQUksQ0FBQ0MsT0FBRCxFQUFVMUIsU0FBVixFQUFxQjtBQUNyQixXQUFPLElBQUlxQixPQUFKLENBQVksT0FBT0MsT0FBUCxFQUFnQkMsTUFBaEIsS0FBMkI7QUFDMUMsVUFBSTtBQUdBRCxlQUFPO0FBQ1YsT0FKRCxDQUlFLE9BQU9WLENBQVAsRUFBVTtBQUNSVyxjQUFNLENBQUNYLENBQUQsQ0FBTjtBQUNIO0FBQ0osS0FSTSxDQUFQO0FBU0g7O0FBdkN5QixDIiwiZmlsZSI6ImJ1aWxkLzQuODljNDhmNWQ5NWM2OGVhYmQ0YzkuY2h1bmsuanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiKSh0cnVlKTtcbi8vIE1vZHVsZVxuZXhwb3J0cy5wdXNoKFttb2R1bGUuaWQsIFwiLmQtY29udGFpbmVyIHtcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gIHotaW5kZXg6IDEwO1xcbiAgbWF4LXdpZHRoOiA4MDBweDtcXG4gIG1hcmdpbjogNDRweCBhdXRvO1xcbiAgYm9yZGVyLXJhZGl1czogNHB4O1xcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjkpOyB9XFxuICBAbWVkaWEgKG1heC13aWR0aDogNjAwcHgpIHtcXG4gICAgLmQtY29udGFpbmVyIHtcXG4gICAgICBtYXgtd2lkdGg6IDEwMCU7XFxuICAgICAgbWFyZ2luOiAwICFpbXBvcnRhbnQ7XFxuICAgICAgYm9yZGVyLXJhZGl1czogMDsgfSB9XFxuXCIsIFwiXCIse1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wiQzovVXNlcnMvZ2Fycmkvc291cmNlL3JlcG9zL3NuYXBmb3JtL2NsaWVudC9hcHAvYXNzZXRzL3N0eWxlL2ludGVybmFsL2NsaWVudC9hcHAvYXNzZXRzL3N0eWxlL2ludGVybmFsL2Rhc2hib2FyZC5zY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUFBO0VBQ0ksa0JBQWtCO0VBQ2xCLFdBQVc7RUFDWCxnQkFBZ0I7RUFDaEIsaUJBQWlCO0VBQ2pCLGtCQUFrQjtFQUNsQiwwQ0FBeUMsRUFBQTtFQUN6QztJQVBKO01BUVEsZUFBZTtNQUNmLG9CQUFvQjtNQUNwQixnQkFBZ0IsRUFBQSxFQUV2QlwiLFwiZmlsZVwiOlwiZGFzaGJvYXJkLnNjc3NcIixcInNvdXJjZXNDb250ZW50XCI6W1wiLmQtY29udGFpbmVyIHtcXHJcXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xcclxcbiAgICB6LWluZGV4OiAxMDtcXHJcXG4gICAgbWF4LXdpZHRoOiA4MDBweDtcXHJcXG4gICAgbWFyZ2luOiA0NHB4IGF1dG87XFxyXFxuICAgIGJvcmRlci1yYWRpdXM6IDRweDtcXHJcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyNTUsIDI1NSwgMjU1LCAuOSk7XFxyXFxuICAgIEBtZWRpYSAobWF4LXdpZHRoOiA2MDBweCkge1xcclxcbiAgICAgICAgbWF4LXdpZHRoOiAxMDAlO1xcclxcbiAgICAgICAgbWFyZ2luOiAwICFpbXBvcnRhbnQ7XFxyXFxuICAgICAgICBib3JkZXItcmFkaXVzOiAwO1xcclxcbiAgICB9XFxyXFxufVwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuXG4iLCJcbnZhciBjb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanM/P3JlZi0tNi0xIS4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9saWIvbG9hZGVyLmpzPz9yZWYtLTYtMiEuL2Rhc2hib2FyZC5zY3NzXCIpO1xuXG5pZih0eXBlb2YgY29udGVudCA9PT0gJ3N0cmluZycpIGNvbnRlbnQgPSBbW21vZHVsZS5pZCwgY29udGVudCwgJyddXTtcblxudmFyIHRyYW5zZm9ybTtcbnZhciBpbnNlcnRJbnRvO1xuXG5cblxudmFyIG9wdGlvbnMgPSB7XCJobXJcIjp0cnVlfVxuXG5vcHRpb25zLnRyYW5zZm9ybSA9IHRyYW5zZm9ybVxub3B0aW9ucy5pbnNlcnRJbnRvID0gdW5kZWZpbmVkO1xuXG52YXIgdXBkYXRlID0gcmVxdWlyZShcIiEuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2xpYi9hZGRTdHlsZXMuanNcIikoY29udGVudCwgb3B0aW9ucyk7XG5cbmlmKGNvbnRlbnQubG9jYWxzKSBtb2R1bGUuZXhwb3J0cyA9IGNvbnRlbnQubG9jYWxzO1xuXG5pZihtb2R1bGUuaG90KSB7XG5cdG1vZHVsZS5ob3QuYWNjZXB0KFwiISEuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcz8/cmVmLS02LTEhLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2xpYi9sb2FkZXIuanM/P3JlZi0tNi0yIS4vZGFzaGJvYXJkLnNjc3NcIiwgZnVuY3Rpb24oKSB7XG5cdFx0dmFyIG5ld0NvbnRlbnQgPSByZXF1aXJlKFwiISEuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcz8/cmVmLS02LTEhLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2xpYi9sb2FkZXIuanM/P3JlZi0tNi0yIS4vZGFzaGJvYXJkLnNjc3NcIik7XG5cblx0XHRpZih0eXBlb2YgbmV3Q29udGVudCA9PT0gJ3N0cmluZycpIG5ld0NvbnRlbnQgPSBbW21vZHVsZS5pZCwgbmV3Q29udGVudCwgJyddXTtcblxuXHRcdHZhciBsb2NhbHMgPSAoZnVuY3Rpb24oYSwgYikge1xuXHRcdFx0dmFyIGtleSwgaWR4ID0gMDtcblxuXHRcdFx0Zm9yKGtleSBpbiBhKSB7XG5cdFx0XHRcdGlmKCFiIHx8IGFba2V5XSAhPT0gYltrZXldKSByZXR1cm4gZmFsc2U7XG5cdFx0XHRcdGlkeCsrO1xuXHRcdFx0fVxuXG5cdFx0XHRmb3Ioa2V5IGluIGIpIGlkeC0tO1xuXG5cdFx0XHRyZXR1cm4gaWR4ID09PSAwO1xuXHRcdH0oY29udGVudC5sb2NhbHMsIG5ld0NvbnRlbnQubG9jYWxzKSk7XG5cblx0XHRpZighbG9jYWxzKSB0aHJvdyBuZXcgRXJyb3IoJ0Fib3J0aW5nIENTUyBITVIgZHVlIHRvIGNoYW5nZWQgY3NzLW1vZHVsZXMgbG9jYWxzLicpO1xuXG5cdFx0dXBkYXRlKG5ld0NvbnRlbnQpO1xuXHR9KTtcblxuXHRtb2R1bGUuaG90LmRpc3Bvc2UoZnVuY3Rpb24oKSB7IHVwZGF0ZSgpOyB9KTtcbn0iLCJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50IH0gZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgeyBzdG9yZSB9IGZyb20gJy4uLy4uLy4uL2NvbW1vbi9jb25maWcvcmVkdXgvcmVkdXguc3RvcmUnO1xyXG5pbXBvcnQgeyB1cGRhdGVWaWV3U2V0dGluZ3MgfSBmcm9tICcuLi9jb25maWcvcmVkdXgvcmVkdXguYWN0aW9ucyc7XHJcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCc7XHJcbmltcG9ydCB7IFdvcmtzcGFjZVNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi9jb21tb24vc2VydmljZXMvd29ya3NwYWNlLnNlcnZpY2UnO1xyXG5pbXBvcnQgTG9hZGFibGUgZnJvbSAncmVhY3QtbG9hZGFibGUnO1xyXG5cclxuaW1wb3J0IExvYWRpbmdDb21wb25lbnQgZnJvbSAnLi4vc2hhcmVkL2xvYWRpbmcuY29tcG9uZW50JztcclxuXHJcbmNvbnN0IEVuZ2luZUNvbXBvbmVudCA9IExvYWRhYmxlKHtcclxuICAgIGxvYWRlcjogKCkgPT4gaW1wb3J0ICgnLi4vLi4vLi4vZW5naW5lL3NyYy9pbmRleCcpLFxyXG4gICAgbG9hZGluZzogTG9hZGluZ0NvbXBvbmVudFxyXG59KTtcclxuXHJcbmltcG9ydCAnLi4vLi4vYXNzZXRzL3N0eWxlL2ludGVybmFsL2Rhc2hib2FyZC5zY3NzJztcclxuXHJcbmNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9IChzdGF0ZSkgPT4gc3RhdGU7XHJcblxyXG5mdW5jdGlvbiBtYXBEaXNwYXRjaFRvUHJvcHMoZGlzcGF0Y2gpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdXBkYXRlVmlld1NldHRpbmdzOiBwYXlsb2FkID0+IGRpc3BhdGNoKHVwZGF0ZVZpZXdTZXR0aW5ncyhwYXlsb2FkKSlcclxuICAgIH07XHJcbn1cclxuXHJcbmNsYXNzIERhc2hib2FyZENvbXBvbmVudCBleHRlbmRzIENvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuXHJcbiAgICAgICAgdGhpcy53b3Jrc3BhY2VTZXJ2aWNlID0gbmV3IFdvcmtzcGFjZVNlcnZpY2UoKTtcclxuXHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHt9O1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIFRPRE9cclxuICAgICAgICB0aGlzLndvcmtzcGFjZVNlcnZpY2UuZ2V0QWxsKCkudGhlbih3b3Jrc3BhY2VzID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMud29ya3NwYWNlU2VydmljZS5nZXQod29ya3NwYWNlc1swXS53b3Jrc3BhY2VfaWQpO1xyXG4gICAgICAgIH0pLnRoZW4od29ya3NwYWNlID0+IHtcclxuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZShPYmplY3QuYXNzaWduKHt9LCB0aGlzLnN0YXRlLCB7XHJcbiAgICAgICAgICAgICAgICB3b3Jrc3BhY2VfaWQ6IHdvcmtzcGFjZS53b3Jrc3BhY2VfaWQsXHJcbiAgICAgICAgICAgICAgICBwcm9qZWN0X2lkOiB3b3Jrc3BhY2UucHJvamVjdHNbMF0sIC8vIFRPRE9cclxuICAgICAgICAgICAgICAgIHByb2plY3RfbmFtZTogd29ya3NwYWNlLnByb2plY3RzWzBdIC8vIFRPRE9cclxuICAgICAgICAgICAgfSkpXHJcblxyXG4gICAgICAgICAgICAvLyBUT0RPOiBSRU1PVkUgdmlldyBzZXR0aW5ncyBmcm9tIGhlcmUgYW5kIG5vdCBwYXNzIGFzIHByb3BzIC0gb3JpZ2luYXRlIGluIGVuZ2luZSBjb21wb25lbnRcclxuICAgICAgICAgICAgY29uc3QgcGF5bG9hZCA9IHtcclxuICAgICAgICAgICAgICAgIHZpZXdXaWR0aDogODAwLFxyXG4gICAgICAgICAgICAgICAgdmlld0hlaWdodDogNTUwLFxyXG4gICAgICAgICAgICAgICAgY2VsbFdpZHRoOiA4LFxyXG4gICAgICAgICAgICAgICAgY2VsbEhlaWdodDogOFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB0aGlzLnByb3BzLnVwZGF0ZVZpZXdTZXR0aW5ncyhwYXlsb2FkKTtcclxuICAgICAgICB9KS5jYXRjaChlID0+IHtcclxuXHJcbiAgICAgICAgfSk7ICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyB2aWV3V2lkdGgsIHZpZXdIZWlnaHQsIGNlbGxXaWR0aCwgY2VsbEhlaWdodCB9ID0gc3RvcmUuZ2V0U3RhdGUoKS5hcHBSZWR1Y2VyO1xyXG4gICAgICAgIGNvbnN0IHsgcHJvamVjdF9uYW1lLCBwcm9qZWN0X2lkLCB3b3Jrc3BhY2VfaWQgfSA9IHRoaXMuc3RhdGU7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJkLWNvbnRhaW5lclwiPlxyXG4gICAgICAgICAgICAgICAgPGgyPjxzcGFuIGNsYXNzTmFtZT1cInVzZXItaWNvblwiPjwvc3Bhbj5EYXNoYm9hcmQ8L2gyPlxyXG4gICAgICAgICAgICAgICAgeyBwcm9qZWN0X2lkICYmIHdvcmtzcGFjZV9pZCBcclxuICAgICAgICAgICAgICAgID8gXHJcbiAgICAgICAgICAgICAgICA8RW5naW5lQ29tcG9uZW50IFxyXG4gICAgICAgICAgICAgICAgICAgIHdvcmtzcGFjZV9pZD17d29ya3NwYWNlX2lkfVxyXG4gICAgICAgICAgICAgICAgICAgIHByb2plY3RfaWQ9e3Byb2plY3RfaWR9XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvamVjdF9uYW1lPXtwcm9qZWN0X25hbWV9XHJcbiAgICAgICAgICAgICAgICAgICAgdmlld1dpZHRoPXt2aWV3V2lkdGh9IFxyXG4gICAgICAgICAgICAgICAgICAgIHZpZXdIZWlnaHQ9e3ZpZXdIZWlnaHR9XHJcbiAgICAgICAgICAgICAgICAgICAgY2VsbFdpZHRoPXtjZWxsV2lkdGh9XHJcbiAgICAgICAgICAgICAgICAgICAgY2VsbEhlaWdodD17Y2VsbEhlaWdodH0gLz5cclxuICAgICAgICAgICAgICAgIDogbnVsbCB9XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5jb25zdCBEYXNoYm9hcmQgPSBjb25uZWN0KG1hcFN0YXRlVG9Qcm9wcywgbWFwRGlzcGF0Y2hUb1Byb3BzKShEYXNoYm9hcmRDb21wb25lbnQpO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgRGFzaGJvYXJkOyIsImltcG9ydCB7IEh0dHAgfSBmcm9tICcuLi9odHRwJztcclxuXHJcbmV4cG9ydCBjbGFzcyBXb3Jrc3BhY2VTZXJ2aWNlIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuaHR0cCA9IG5ldyBIdHRwKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0QWxsKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcmVzdWx0cyA9IGF3YWl0IHRoaXMuaHR0cC5nZXQoYC9hcGkvdjEvd29ya3NwYWNlYCk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShyZXN1bHRzKTtcclxuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgcmVqZWN0KGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0KHdvcmtzcGFjZV9pZCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcmVzdWx0cyA9IGF3YWl0IHRoaXMuaHR0cC5nZXQoYC9hcGkvdjEvd29ya3NwYWNlLyR7d29ya3NwYWNlX2lkfWApO1xyXG5cclxuICAgICAgICAgICAgICAgIHJlc29sdmUocmVzdWx0cyk7XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgIHJlamVjdChlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHBvc3QodXNlcl9pZCwgd29ya3NwYWNlKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgdHJ5IHtcclxuXHJcblxyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICByZWplY3QoZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxufSJdLCJzb3VyY2VSb290IjoiIn0=