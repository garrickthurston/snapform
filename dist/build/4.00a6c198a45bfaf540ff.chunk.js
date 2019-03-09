(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[4],{

/***/ "GPZK":
/*!**********************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js??ref--6-1!./node_modules/sass-loader/lib/loader.js??ref--6-2!./client/app/assets/style/internal/workspace/workspace.scss ***!
  \**********************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../../../../node_modules/css-loader/dist/runtime/api.js */ "JPst")(true);
// Module
exports.push([module.i, ".workspace-container {\n  position: relative;\n  z-index: 10;\n  max-width: 800px;\n  margin: 44px auto;\n  border-radius: 4px;\n  background-color: rgba(255, 255, 255, 0.9); }\n  @media (max-width: 600px) {\n    .workspace-container {\n      max-width: 100%;\n      margin: 0 !important;\n      border-radius: 0; } }\n", "",{"version":3,"sources":["C:/Users/garri/source/repos/snapform/client/app/assets/style/internal/workspace/client/app/assets/style/internal/workspace/workspace.scss"],"names":[],"mappings":"AAAA;EACI,kBAAkB;EAClB,WAAW;EACX,gBAAgB;EAChB,iBAAiB;EACjB,kBAAkB;EAClB,0CAAyC,EAAA;EACzC;IAPJ;MAQQ,eAAe;MACf,oBAAoB;MACpB,gBAAgB,EAAA,EAEvB","file":"workspace.scss","sourcesContent":[".workspace-container {\r\n    position: relative;\r\n    z-index: 10;\r\n    max-width: 800px;\r\n    margin: 44px auto;\r\n    border-radius: 4px;\r\n    background-color: rgba(255, 255, 255, .9);\r\n    @media (max-width: 600px) {\r\n        max-width: 100%;\r\n        margin: 0 !important;\r\n        border-radius: 0;\r\n    }\r\n}"],"sourceRoot":""}]);



/***/ }),

/***/ "NRsb":
/*!******************************************************************!*\
  !*** ./client/app/src/internal/workspace/workspace.component.js ***!
  \******************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _config_redux_redux_store__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../config/redux/redux.store */ "MBHU");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-redux */ "/MKj");
/* harmony import */ var _shared_services_workspace_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../shared/services/workspace.service */ "txiB");
/* harmony import */ var react_loadable__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-loadable */ "CnBM");
/* harmony import */ var react_loadable__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_loadable__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _shared_components_loading_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../shared/components/loading.component */ "L6gD");
/* harmony import */ var _assets_style_internal_workspace_workspace_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../assets/style/internal/workspace/workspace.scss */ "nJyA");
/* harmony import */ var _assets_style_internal_workspace_workspace_scss__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_assets_style_internal_workspace_workspace_scss__WEBPACK_IMPORTED_MODULE_6__);






const ProjectComponent = react_loadable__WEBPACK_IMPORTED_MODULE_4___default()({
  loader: () => Promise.all(/*! import() */[__webpack_require__.e(2), __webpack_require__.e(6)]).then(__webpack_require__.bind(null, /*! ./project/project.component */ "liRl")),
  loading: _shared_components_loading_component__WEBPACK_IMPORTED_MODULE_5__["default"]
});


const mapStateToProps = state => state;

function mapDispatchToProps(dispatch) {
  return {};
}

class WorkspaceComponent extends react__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  constructor(props) {
    super(props);
    this.state = {};
    this.workspaceService = new _shared_services_workspace_service__WEBPACK_IMPORTED_MODULE_3__["WorkspaceService"](); // TODO

    this.workspaceService.getAll().then(workspaces => {
      return this.workspaceService.get(workspaces[0].workspace_id);
    }).then(workspace => {
      this.setState(Object.assign({}, this.state, {
        workspace_id: workspace.workspace_id,
        project_id: workspace.projects[0] // TODO

      }));
    }).catch(e => {});
  }

  render() {
    const {
      project_id,
      workspace_id
    } = this.state;
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "workspace-container"
    }, project_id && workspace_id ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ProjectComponent, {
      workspace_id: workspace_id,
      project_id: project_id
    }) : null);
  }

}

;
const Workspace = Object(react_redux__WEBPACK_IMPORTED_MODULE_2__["connect"])(mapStateToProps, mapDispatchToProps)(WorkspaceComponent);
/* harmony default export */ __webpack_exports__["default"] = (Workspace);

/***/ }),

/***/ "nJyA":
/*!*******************************************************************!*\
  !*** ./client/app/assets/style/internal/workspace/workspace.scss ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../../../../../node_modules/css-loader/dist/cjs.js??ref--6-1!../../../../../../node_modules/sass-loader/lib/loader.js??ref--6-2!./workspace.scss */ "GPZK");

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(/*! ../../../../../../node_modules/style-loader/lib/addStyles.js */ "aET+")(content, options);

if(content.locals) module.exports = content.locals;

if(false) {}

/***/ }),

/***/ "txiB":
/*!*************************************************************!*\
  !*** ./client/app/src/shared/services/workspace.service.js ***!
  \*************************************************************/
/*! exports provided: WorkspaceService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WorkspaceService", function() { return WorkspaceService; });
/* harmony import */ var _utils_http__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/http */ "dkJd");

class WorkspaceService {
  constructor() {
    this.http = new _utils_http__WEBPACK_IMPORTED_MODULE_0__["Http"]();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9jbGllbnQvYXBwL2Fzc2V0cy9zdHlsZS9pbnRlcm5hbC93b3Jrc3BhY2Uvd29ya3NwYWNlLnNjc3MiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L2FwcC9zcmMvaW50ZXJuYWwvd29ya3NwYWNlL3dvcmtzcGFjZS5jb21wb25lbnQuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L2FwcC9hc3NldHMvc3R5bGUvaW50ZXJuYWwvd29ya3NwYWNlL3dvcmtzcGFjZS5zY3NzP2Q2NTIiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L2FwcC9zcmMvc2hhcmVkL3NlcnZpY2VzL3dvcmtzcGFjZS5zZXJ2aWNlLmpzIl0sIm5hbWVzIjpbIlByb2plY3RDb21wb25lbnQiLCJMb2FkYWJsZSIsImxvYWRlciIsImxvYWRpbmciLCJMb2FkaW5nQ29tcG9uZW50IiwibWFwU3RhdGVUb1Byb3BzIiwic3RhdGUiLCJtYXBEaXNwYXRjaFRvUHJvcHMiLCJkaXNwYXRjaCIsIldvcmtzcGFjZUNvbXBvbmVudCIsIkNvbXBvbmVudCIsImNvbnN0cnVjdG9yIiwicHJvcHMiLCJ3b3Jrc3BhY2VTZXJ2aWNlIiwiV29ya3NwYWNlU2VydmljZSIsImdldEFsbCIsInRoZW4iLCJ3b3Jrc3BhY2VzIiwiZ2V0Iiwid29ya3NwYWNlX2lkIiwid29ya3NwYWNlIiwic2V0U3RhdGUiLCJPYmplY3QiLCJhc3NpZ24iLCJwcm9qZWN0X2lkIiwicHJvamVjdHMiLCJjYXRjaCIsImUiLCJyZW5kZXIiLCJXb3Jrc3BhY2UiLCJjb25uZWN0IiwiaHR0cCIsIkh0dHAiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsInJlc3VsdHMiLCJwb3N0IiwidXNlcl9pZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsMkJBQTJCLG1CQUFPLENBQUMsMkVBQStEO0FBQ2xHO0FBQ0EsY0FBYyxRQUFTLHlCQUF5Qix1QkFBdUIsZ0JBQWdCLHFCQUFxQixzQkFBc0IsdUJBQXVCLCtDQUErQyxFQUFFLCtC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YixHQUFWLENBQWUsbUJBQWYsQ0FBcEI7QUFFQWdCLGVBQU8sQ0FBQ0UsT0FBRCxDQUFQO0FBQ0gsT0FKRCxDQUlFLE9BQU9ULENBQVAsRUFBVTtBQUNSUSxjQUFNLENBQUNSLENBQUQsQ0FBTjtBQUNIO0FBQ0osS0FSTSxDQUFQO0FBU0g7O0FBRURULEtBQUcsQ0FBQ0MsWUFBRCxFQUFlO0FBQ2QsV0FBTyxJQUFJYyxPQUFKLENBQVksT0FBT0MsT0FBUCxFQUFnQkMsTUFBaEIsS0FBMkI7QUFDMUMsVUFBSTtBQUNBLFlBQUlDLE9BQU8sR0FBRyxNQUFNLEtBQUtMLElBQUwsQ0FBVWIsR0FBVixDQUFlLHFCQUFvQkMsWUFBYSxFQUFoRCxDQUFwQjtBQUVBZSxlQUFPLENBQUNFLE9BQUQsQ0FBUDtBQUNILE9BSkQsQ0FJRSxPQUFPVCxDQUFQLEVBQVU7QUFDUlEsY0FBTSxDQUFDUixDQUFELENBQU47QUFDSDtBQUNKLEtBUk0sQ0FBUDtBQVNIOztBQUVEVSxNQUFJLENBQUNDLE9BQUQsRUFBVWxCLFNBQVYsRUFBcUI7QUFDckIsV0FBTyxJQUFJYSxPQUFKLENBQVksT0FBT0MsT0FBUCxFQUFnQkMsTUFBaEIsS0FBMkI7QUFDMUMsVUFBSTtBQUdBRCxlQUFPO0FBQ1YsT0FKRCxDQUlFLE9BQU9QLENBQVAsRUFBVTtBQUNSUSxjQUFNLENBQUNSLENBQUQsQ0FBTjtBQUNIO0FBQ0osS0FSTSxDQUFQO0FBU0g7O0FBdkN5QixDIiwiZmlsZSI6ImJ1aWxkLzQuMDBhNmMxOThhNDViZmFmNTQwZmYuY2h1bmsuanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiKSh0cnVlKTtcbi8vIE1vZHVsZVxuZXhwb3J0cy5wdXNoKFttb2R1bGUuaWQsIFwiLndvcmtzcGFjZS1jb250YWluZXIge1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgei1pbmRleDogMTA7XFxuICBtYXgtd2lkdGg6IDgwMHB4O1xcbiAgbWFyZ2luOiA0NHB4IGF1dG87XFxuICBib3JkZXItcmFkaXVzOiA0cHg7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuOSk7IH1cXG4gIEBtZWRpYSAobWF4LXdpZHRoOiA2MDBweCkge1xcbiAgICAud29ya3NwYWNlLWNvbnRhaW5lciB7XFxuICAgICAgbWF4LXdpZHRoOiAxMDAlO1xcbiAgICAgIG1hcmdpbjogMCAhaW1wb3J0YW50O1xcbiAgICAgIGJvcmRlci1yYWRpdXM6IDA7IH0gfVxcblwiLCBcIlwiLHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIkM6L1VzZXJzL2dhcnJpL3NvdXJjZS9yZXBvcy9zbmFwZm9ybS9jbGllbnQvYXBwL2Fzc2V0cy9zdHlsZS9pbnRlcm5hbC93b3Jrc3BhY2UvY2xpZW50L2FwcC9hc3NldHMvc3R5bGUvaW50ZXJuYWwvd29ya3NwYWNlL3dvcmtzcGFjZS5zY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUFBO0VBQ0ksa0JBQWtCO0VBQ2xCLFdBQVc7RUFDWCxnQkFBZ0I7RUFDaEIsaUJBQWlCO0VBQ2pCLGtCQUFrQjtFQUNsQiwwQ0FBeUMsRUFBQTtFQUN6QztJQVBKO01BUVEsZUFBZTtNQUNmLG9CQUFvQjtNQUNwQixnQkFBZ0IsRUFBQSxFQUV2QlwiLFwiZmlsZVwiOlwid29ya3NwYWNlLnNjc3NcIixcInNvdXJjZXNDb250ZW50XCI6W1wiLndvcmtzcGFjZS1jb250YWluZXIge1xcclxcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XFxyXFxuICAgIHotaW5kZXg6IDEwO1xcclxcbiAgICBtYXgtd2lkdGg6IDgwMHB4O1xcclxcbiAgICBtYXJnaW46IDQ0cHggYXV0bztcXHJcXG4gICAgYm9yZGVyLXJhZGl1czogNHB4O1xcclxcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDI1NSwgMjU1LCAyNTUsIC45KTtcXHJcXG4gICAgQG1lZGlhIChtYXgtd2lkdGg6IDYwMHB4KSB7XFxyXFxuICAgICAgICBtYXgtd2lkdGg6IDEwMCU7XFxyXFxuICAgICAgICBtYXJnaW46IDAgIWltcG9ydGFudDtcXHJcXG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDA7XFxyXFxuICAgIH1cXHJcXG59XCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG5cbiIsImltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQgfSBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCB7IHN0b3JlIH0gZnJvbSAnLi4vLi4vY29uZmlnL3JlZHV4L3JlZHV4LnN0b3JlJztcclxuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gJ3JlYWN0LXJlZHV4JztcclxuaW1wb3J0IHsgV29ya3NwYWNlU2VydmljZSB9IGZyb20gJy4uLy4uL3NoYXJlZC9zZXJ2aWNlcy93b3Jrc3BhY2Uuc2VydmljZSc7XHJcbmltcG9ydCBMb2FkYWJsZSBmcm9tICdyZWFjdC1sb2FkYWJsZSc7XHJcblxyXG5pbXBvcnQgTG9hZGluZ0NvbXBvbmVudCBmcm9tICcuLi8uLi9zaGFyZWQvY29tcG9uZW50cy9sb2FkaW5nLmNvbXBvbmVudCc7XHJcblxyXG5jb25zdCBQcm9qZWN0Q29tcG9uZW50ID0gTG9hZGFibGUoe1xyXG4gICAgbG9hZGVyOiAoKSA9PiBpbXBvcnQoJy4vcHJvamVjdC9wcm9qZWN0LmNvbXBvbmVudCcpLFxyXG4gICAgbG9hZGluZzogTG9hZGluZ0NvbXBvbmVudFxyXG59KTtcclxuXHJcbmltcG9ydCAnLi4vLi4vLi4vYXNzZXRzL3N0eWxlL2ludGVybmFsL3dvcmtzcGFjZS93b3Jrc3BhY2Uuc2Nzcyc7XHJcblxyXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSAoc3RhdGUpID0+IHN0YXRlO1xyXG5cclxuZnVuY3Rpb24gbWFwRGlzcGF0Y2hUb1Byb3BzKGRpc3BhdGNoKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIFxyXG4gICAgfTtcclxufVxyXG5cclxuY2xhc3MgV29ya3NwYWNlQ29tcG9uZW50IGV4dGVuZHMgQ29tcG9uZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7fTtcclxuXHJcbiAgICAgICAgdGhpcy53b3Jrc3BhY2VTZXJ2aWNlID0gbmV3IFdvcmtzcGFjZVNlcnZpY2UoKTtcclxuXHJcbiAgICAgICAgLy8gVE9ET1xyXG4gICAgICAgIHRoaXMud29ya3NwYWNlU2VydmljZS5nZXRBbGwoKS50aGVuKHdvcmtzcGFjZXMgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy53b3Jrc3BhY2VTZXJ2aWNlLmdldCh3b3Jrc3BhY2VzWzBdLndvcmtzcGFjZV9pZCk7XHJcbiAgICAgICAgfSkudGhlbih3b3Jrc3BhY2UgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKE9iamVjdC5hc3NpZ24oe30sIHRoaXMuc3RhdGUsIHtcclxuICAgICAgICAgICAgICAgIHdvcmtzcGFjZV9pZDogd29ya3NwYWNlLndvcmtzcGFjZV9pZCxcclxuICAgICAgICAgICAgICAgIHByb2plY3RfaWQ6IHdvcmtzcGFjZS5wcm9qZWN0c1swXSAvLyBUT0RPXHJcbiAgICAgICAgICAgIH0pKTtcclxuICAgICAgICB9KS5jYXRjaChlID0+IHtcclxuXHJcbiAgICAgICAgfSk7ICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyBwcm9qZWN0X2lkLCB3b3Jrc3BhY2VfaWQgfSA9IHRoaXMuc3RhdGU7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ3b3Jrc3BhY2UtY29udGFpbmVyXCI+XHJcbiAgICAgICAgICAgICAgICB7IHByb2plY3RfaWQgJiYgd29ya3NwYWNlX2lkIFxyXG4gICAgICAgICAgICAgICAgPyBcclxuICAgICAgICAgICAgICAgIDxQcm9qZWN0Q29tcG9uZW50IFxyXG4gICAgICAgICAgICAgICAgICAgIHdvcmtzcGFjZV9pZD17d29ya3NwYWNlX2lkfVxyXG4gICAgICAgICAgICAgICAgICAgIHByb2plY3RfaWQ9e3Byb2plY3RfaWR9IC8+XHJcbiAgICAgICAgICAgICAgICA6IG51bGwgfVxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59O1xyXG5cclxuY29uc3QgV29ya3NwYWNlID0gY29ubmVjdChtYXBTdGF0ZVRvUHJvcHMsIG1hcERpc3BhdGNoVG9Qcm9wcykoV29ya3NwYWNlQ29tcG9uZW50KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IFdvcmtzcGFjZTsiLCJcbnZhciBjb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanM/P3JlZi0tNi0xIS4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9saWIvbG9hZGVyLmpzPz9yZWYtLTYtMiEuL3dvcmtzcGFjZS5zY3NzXCIpO1xuXG5pZih0eXBlb2YgY29udGVudCA9PT0gJ3N0cmluZycpIGNvbnRlbnQgPSBbW21vZHVsZS5pZCwgY29udGVudCwgJyddXTtcblxudmFyIHRyYW5zZm9ybTtcbnZhciBpbnNlcnRJbnRvO1xuXG5cblxudmFyIG9wdGlvbnMgPSB7XCJobXJcIjp0cnVlfVxuXG5vcHRpb25zLnRyYW5zZm9ybSA9IHRyYW5zZm9ybVxub3B0aW9ucy5pbnNlcnRJbnRvID0gdW5kZWZpbmVkO1xuXG52YXIgdXBkYXRlID0gcmVxdWlyZShcIiEuLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2xpYi9hZGRTdHlsZXMuanNcIikoY29udGVudCwgb3B0aW9ucyk7XG5cbmlmKGNvbnRlbnQubG9jYWxzKSBtb2R1bGUuZXhwb3J0cyA9IGNvbnRlbnQubG9jYWxzO1xuXG5pZihtb2R1bGUuaG90KSB7XG5cdG1vZHVsZS5ob3QuYWNjZXB0KFwiISEuLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcz8/cmVmLS02LTEhLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2xpYi9sb2FkZXIuanM/P3JlZi0tNi0yIS4vd29ya3NwYWNlLnNjc3NcIiwgZnVuY3Rpb24oKSB7XG5cdFx0dmFyIG5ld0NvbnRlbnQgPSByZXF1aXJlKFwiISEuLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcz8/cmVmLS02LTEhLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2xpYi9sb2FkZXIuanM/P3JlZi0tNi0yIS4vd29ya3NwYWNlLnNjc3NcIik7XG5cblx0XHRpZih0eXBlb2YgbmV3Q29udGVudCA9PT0gJ3N0cmluZycpIG5ld0NvbnRlbnQgPSBbW21vZHVsZS5pZCwgbmV3Q29udGVudCwgJyddXTtcblxuXHRcdHZhciBsb2NhbHMgPSAoZnVuY3Rpb24oYSwgYikge1xuXHRcdFx0dmFyIGtleSwgaWR4ID0gMDtcblxuXHRcdFx0Zm9yKGtleSBpbiBhKSB7XG5cdFx0XHRcdGlmKCFiIHx8IGFba2V5XSAhPT0gYltrZXldKSByZXR1cm4gZmFsc2U7XG5cdFx0XHRcdGlkeCsrO1xuXHRcdFx0fVxuXG5cdFx0XHRmb3Ioa2V5IGluIGIpIGlkeC0tO1xuXG5cdFx0XHRyZXR1cm4gaWR4ID09PSAwO1xuXHRcdH0oY29udGVudC5sb2NhbHMsIG5ld0NvbnRlbnQubG9jYWxzKSk7XG5cblx0XHRpZighbG9jYWxzKSB0aHJvdyBuZXcgRXJyb3IoJ0Fib3J0aW5nIENTUyBITVIgZHVlIHRvIGNoYW5nZWQgY3NzLW1vZHVsZXMgbG9jYWxzLicpO1xuXG5cdFx0dXBkYXRlKG5ld0NvbnRlbnQpO1xuXHR9KTtcblxuXHRtb2R1bGUuaG90LmRpc3Bvc2UoZnVuY3Rpb24oKSB7IHVwZGF0ZSgpOyB9KTtcbn0iLCJpbXBvcnQgeyBIdHRwIH0gZnJvbSAnLi4vdXRpbHMvaHR0cCc7XHJcblxyXG5leHBvcnQgY2xhc3MgV29ya3NwYWNlU2VydmljZSB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmh0dHAgPSBuZXcgSHR0cCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldEFsbCgpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHJlc3VsdHMgPSBhd2FpdCB0aGlzLmh0dHAuZ2V0KGAvYXBpL3YxL3dvcmtzcGFjZWApO1xyXG5cclxuICAgICAgICAgICAgICAgIHJlc29sdmUocmVzdWx0cyk7XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgIHJlamVjdChlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCh3b3Jrc3BhY2VfaWQpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHJlc3VsdHMgPSBhd2FpdCB0aGlzLmh0dHAuZ2V0KGAvYXBpL3YxL3dvcmtzcGFjZS8ke3dvcmtzcGFjZV9pZH1gKTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKHJlc3VsdHMpO1xyXG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICByZWplY3QoZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwb3N0KHVzZXJfaWQsIHdvcmtzcGFjZSkge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcblxyXG5cclxuICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgcmVqZWN0KGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn0iXSwic291cmNlUm9vdCI6IiJ9