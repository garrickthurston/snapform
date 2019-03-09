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
/* harmony import */ var _common_config_redux_redux_store__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../common/config/redux/redux.store */ "p6Ez");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-redux */ "/MKj");
/* harmony import */ var _common_services_workspace_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../common/services/workspace.service */ "zmDv");
/* harmony import */ var react_loadable__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-loadable */ "CnBM");
/* harmony import */ var react_loadable__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_loadable__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _shared_loading_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../shared/loading.component */ "Xj/u");
/* harmony import */ var _assets_style_internal_workspace_workspace_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../assets/style/internal/workspace/workspace.scss */ "nJyA");
/* harmony import */ var _assets_style_internal_workspace_workspace_scss__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_assets_style_internal_workspace_workspace_scss__WEBPACK_IMPORTED_MODULE_6__);






const ProjectComponent = react_loadable__WEBPACK_IMPORTED_MODULE_4___default()({
  loader: () => Promise.all(/*! import() */[__webpack_require__.e(2), __webpack_require__.e(6)]).then(__webpack_require__.bind(null, /*! ./project/project.component */ "liRl")),
  loading: _shared_loading_component__WEBPACK_IMPORTED_MODULE_5__["default"]
});


const mapStateToProps = state => state;

function mapDispatchToProps(dispatch) {
  return {};
}

class WorkspaceComponent extends react__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  constructor(props) {
    super(props);
    this.state = {};
    this.workspaceService = new _common_services_workspace_service__WEBPACK_IMPORTED_MODULE_3__["WorkspaceService"](); // TODO

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9jbGllbnQvYXBwL2Fzc2V0cy9zdHlsZS9pbnRlcm5hbC93b3Jrc3BhY2Uvd29ya3NwYWNlLnNjc3MiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L2FwcC9zcmMvaW50ZXJuYWwvd29ya3NwYWNlL3dvcmtzcGFjZS5jb21wb25lbnQuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L2FwcC9hc3NldHMvc3R5bGUvaW50ZXJuYWwvd29ya3NwYWNlL3dvcmtzcGFjZS5zY3NzP2Q2NTIiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L2NvbW1vbi9zZXJ2aWNlcy93b3Jrc3BhY2Uuc2VydmljZS5qcyJdLCJuYW1lcyI6WyJQcm9qZWN0Q29tcG9uZW50IiwiTG9hZGFibGUiLCJsb2FkZXIiLCJsb2FkaW5nIiwiTG9hZGluZ0NvbXBvbmVudCIsIm1hcFN0YXRlVG9Qcm9wcyIsInN0YXRlIiwibWFwRGlzcGF0Y2hUb1Byb3BzIiwiZGlzcGF0Y2giLCJXb3Jrc3BhY2VDb21wb25lbnQiLCJDb21wb25lbnQiLCJjb25zdHJ1Y3RvciIsInByb3BzIiwid29ya3NwYWNlU2VydmljZSIsIldvcmtzcGFjZVNlcnZpY2UiLCJnZXRBbGwiLCJ0aGVuIiwid29ya3NwYWNlcyIsImdldCIsIndvcmtzcGFjZV9pZCIsIndvcmtzcGFjZSIsInNldFN0YXRlIiwiT2JqZWN0IiwiYXNzaWduIiwicHJvamVjdF9pZCIsInByb2plY3RzIiwiY2F0Y2giLCJlIiwicmVuZGVyIiwiV29ya3NwYWNlIiwiY29ubmVjdCIsImh0dHAiLCJIdHRwIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJyZXN1bHRzIiwicG9zdCIsInVzZXJfaWQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBLDJCQUEyQixtQkFBTyxDQUFDLDJFQUErRDtBQUNsRztBQUNBLGNBQWMsUUFBUyx5QkFBeUIsdUJBQXVCLGdCQUFnQixxQkFBcUIsc0JBQXNCLHVCQUF1QiwrQ0FBK0MsRUFBRSwrQkFBK0IsNEJB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QUFlLG1CQUFmLENBQXBCO0FBRUFnQixlQUFPLENBQUNFLE9BQUQsQ0FBUDtBQUNILE9BSkQsQ0FJRSxPQUFPVCxDQUFQLEVBQVU7QUFDUlEsY0FBTSxDQUFDUixDQUFELENBQU47QUFDSDtBQUNKLEtBUk0sQ0FBUDtBQVNIOztBQUVEVCxLQUFHLENBQUNDLFlBQUQsRUFBZTtBQUNkLFdBQU8sSUFBSWMsT0FBSixDQUFZLE9BQU9DLE9BQVAsRUFBZ0JDLE1BQWhCLEtBQTJCO0FBQzFDLFVBQUk7QUFDQSxZQUFJQyxPQUFPLEdBQUcsTUFBTSxLQUFLTCxJQUFMLENBQVViLEdBQVYsQ0FBZSxxQkFBb0JDLFlBQWEsRUFBaEQsQ0FBcEI7QUFFQWUsZUFBTyxDQUFDRSxPQUFELENBQVA7QUFDSCxPQUpELENBSUUsT0FBT1QsQ0FBUCxFQUFVO0FBQ1JRLGNBQU0sQ0FBQ1IsQ0FBRCxDQUFOO0FBQ0g7QUFDSixLQVJNLENBQVA7QUFTSDs7QUFFRFUsTUFBSSxDQUFDQyxPQUFELEVBQVVsQixTQUFWLEVBQXFCO0FBQ3JCLFdBQU8sSUFBSWEsT0FBSixDQUFZLE9BQU9DLE9BQVAsRUFBZ0JDLE1BQWhCLEtBQTJCO0FBQzFDLFVBQUk7QUFHQUQsZUFBTztBQUNWLE9BSkQsQ0FJRSxPQUFPUCxDQUFQLEVBQVU7QUFDUlEsY0FBTSxDQUFDUixDQUFELENBQU47QUFDSDtBQUNKLEtBUk0sQ0FBUDtBQVNIOztBQXZDeUIsQyIsImZpbGUiOiJidWlsZC80LjkxNzVhOTUxZWQyODU2ODI5YjYzLmNodW5rLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIikodHJ1ZSk7XG4vLyBNb2R1bGVcbmV4cG9ydHMucHVzaChbbW9kdWxlLmlkLCBcIi53b3Jrc3BhY2UtY29udGFpbmVyIHtcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gIHotaW5kZXg6IDEwO1xcbiAgbWF4LXdpZHRoOiA4MDBweDtcXG4gIG1hcmdpbjogNDRweCBhdXRvO1xcbiAgYm9yZGVyLXJhZGl1czogNHB4O1xcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjkpOyB9XFxuICBAbWVkaWEgKG1heC13aWR0aDogNjAwcHgpIHtcXG4gICAgLndvcmtzcGFjZS1jb250YWluZXIge1xcbiAgICAgIG1heC13aWR0aDogMTAwJTtcXG4gICAgICBtYXJnaW46IDAgIWltcG9ydGFudDtcXG4gICAgICBib3JkZXItcmFkaXVzOiAwOyB9IH1cXG5cIiwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJDOi9Vc2Vycy9nYXJyaS9zb3VyY2UvcmVwb3Mvc25hcGZvcm0vY2xpZW50L2FwcC9hc3NldHMvc3R5bGUvaW50ZXJuYWwvd29ya3NwYWNlL2NsaWVudC9hcHAvYXNzZXRzL3N0eWxlL2ludGVybmFsL3dvcmtzcGFjZS93b3Jrc3BhY2Uuc2Nzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQTtFQUNJLGtCQUFrQjtFQUNsQixXQUFXO0VBQ1gsZ0JBQWdCO0VBQ2hCLGlCQUFpQjtFQUNqQixrQkFBa0I7RUFDbEIsMENBQXlDLEVBQUE7RUFDekM7SUFQSjtNQVFRLGVBQWU7TUFDZixvQkFBb0I7TUFDcEIsZ0JBQWdCLEVBQUEsRUFFdkJcIixcImZpbGVcIjpcIndvcmtzcGFjZS5zY3NzXCIsXCJzb3VyY2VzQ29udGVudFwiOltcIi53b3Jrc3BhY2UtY29udGFpbmVyIHtcXHJcXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xcclxcbiAgICB6LWluZGV4OiAxMDtcXHJcXG4gICAgbWF4LXdpZHRoOiA4MDBweDtcXHJcXG4gICAgbWFyZ2luOiA0NHB4IGF1dG87XFxyXFxuICAgIGJvcmRlci1yYWRpdXM6IDRweDtcXHJcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyNTUsIDI1NSwgMjU1LCAuOSk7XFxyXFxuICAgIEBtZWRpYSAobWF4LXdpZHRoOiA2MDBweCkge1xcclxcbiAgICAgICAgbWF4LXdpZHRoOiAxMDAlO1xcclxcbiAgICAgICAgbWFyZ2luOiAwICFpbXBvcnRhbnQ7XFxyXFxuICAgICAgICBib3JkZXItcmFkaXVzOiAwO1xcclxcbiAgICB9XFxyXFxufVwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuXG4iLCJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50IH0gZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgeyBzdG9yZSB9IGZyb20gJy4uLy4uLy4uLy4uL2NvbW1vbi9jb25maWcvcmVkdXgvcmVkdXguc3RvcmUnO1xyXG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSAncmVhY3QtcmVkdXgnO1xyXG5pbXBvcnQgeyBXb3Jrc3BhY2VTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vLi4vY29tbW9uL3NlcnZpY2VzL3dvcmtzcGFjZS5zZXJ2aWNlJztcclxuaW1wb3J0IExvYWRhYmxlIGZyb20gJ3JlYWN0LWxvYWRhYmxlJztcclxuXHJcbmltcG9ydCBMb2FkaW5nQ29tcG9uZW50IGZyb20gJy4uLy4uL3NoYXJlZC9sb2FkaW5nLmNvbXBvbmVudCc7XHJcblxyXG5jb25zdCBQcm9qZWN0Q29tcG9uZW50ID0gTG9hZGFibGUoe1xyXG4gICAgbG9hZGVyOiAoKSA9PiBpbXBvcnQoJy4vcHJvamVjdC9wcm9qZWN0LmNvbXBvbmVudCcpLFxyXG4gICAgbG9hZGluZzogTG9hZGluZ0NvbXBvbmVudFxyXG59KTtcclxuXHJcbmltcG9ydCAnLi4vLi4vLi4vYXNzZXRzL3N0eWxlL2ludGVybmFsL3dvcmtzcGFjZS93b3Jrc3BhY2Uuc2Nzcyc7XHJcblxyXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSAoc3RhdGUpID0+IHN0YXRlO1xyXG5cclxuZnVuY3Rpb24gbWFwRGlzcGF0Y2hUb1Byb3BzKGRpc3BhdGNoKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIFxyXG4gICAgfTtcclxufVxyXG5cclxuY2xhc3MgV29ya3NwYWNlQ29tcG9uZW50IGV4dGVuZHMgQ29tcG9uZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7fTtcclxuXHJcbiAgICAgICAgdGhpcy53b3Jrc3BhY2VTZXJ2aWNlID0gbmV3IFdvcmtzcGFjZVNlcnZpY2UoKTtcclxuXHJcbiAgICAgICAgLy8gVE9ET1xyXG4gICAgICAgIHRoaXMud29ya3NwYWNlU2VydmljZS5nZXRBbGwoKS50aGVuKHdvcmtzcGFjZXMgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy53b3Jrc3BhY2VTZXJ2aWNlLmdldCh3b3Jrc3BhY2VzWzBdLndvcmtzcGFjZV9pZCk7XHJcbiAgICAgICAgfSkudGhlbih3b3Jrc3BhY2UgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKE9iamVjdC5hc3NpZ24oe30sIHRoaXMuc3RhdGUsIHtcclxuICAgICAgICAgICAgICAgIHdvcmtzcGFjZV9pZDogd29ya3NwYWNlLndvcmtzcGFjZV9pZCxcclxuICAgICAgICAgICAgICAgIHByb2plY3RfaWQ6IHdvcmtzcGFjZS5wcm9qZWN0c1swXSAvLyBUT0RPXHJcbiAgICAgICAgICAgIH0pKTtcclxuICAgICAgICB9KS5jYXRjaChlID0+IHtcclxuXHJcbiAgICAgICAgfSk7ICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyBwcm9qZWN0X2lkLCB3b3Jrc3BhY2VfaWQgfSA9IHRoaXMuc3RhdGU7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ3b3Jrc3BhY2UtY29udGFpbmVyXCI+XHJcbiAgICAgICAgICAgICAgICB7IHByb2plY3RfaWQgJiYgd29ya3NwYWNlX2lkIFxyXG4gICAgICAgICAgICAgICAgPyBcclxuICAgICAgICAgICAgICAgIDxQcm9qZWN0Q29tcG9uZW50IFxyXG4gICAgICAgICAgICAgICAgICAgIHdvcmtzcGFjZV9pZD17d29ya3NwYWNlX2lkfVxyXG4gICAgICAgICAgICAgICAgICAgIHByb2plY3RfaWQ9e3Byb2plY3RfaWR9IC8+XHJcbiAgICAgICAgICAgICAgICA6IG51bGwgfVxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59O1xyXG5cclxuY29uc3QgV29ya3NwYWNlID0gY29ubmVjdChtYXBTdGF0ZVRvUHJvcHMsIG1hcERpc3BhdGNoVG9Qcm9wcykoV29ya3NwYWNlQ29tcG9uZW50KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IFdvcmtzcGFjZTsiLCJcbnZhciBjb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanM/P3JlZi0tNi0xIS4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9saWIvbG9hZGVyLmpzPz9yZWYtLTYtMiEuL3dvcmtzcGFjZS5zY3NzXCIpO1xuXG5pZih0eXBlb2YgY29udGVudCA9PT0gJ3N0cmluZycpIGNvbnRlbnQgPSBbW21vZHVsZS5pZCwgY29udGVudCwgJyddXTtcblxudmFyIHRyYW5zZm9ybTtcbnZhciBpbnNlcnRJbnRvO1xuXG5cblxudmFyIG9wdGlvbnMgPSB7XCJobXJcIjp0cnVlfVxuXG5vcHRpb25zLnRyYW5zZm9ybSA9IHRyYW5zZm9ybVxub3B0aW9ucy5pbnNlcnRJbnRvID0gdW5kZWZpbmVkO1xuXG52YXIgdXBkYXRlID0gcmVxdWlyZShcIiEuLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2xpYi9hZGRTdHlsZXMuanNcIikoY29udGVudCwgb3B0aW9ucyk7XG5cbmlmKGNvbnRlbnQubG9jYWxzKSBtb2R1bGUuZXhwb3J0cyA9IGNvbnRlbnQubG9jYWxzO1xuXG5pZihtb2R1bGUuaG90KSB7XG5cdG1vZHVsZS5ob3QuYWNjZXB0KFwiISEuLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcz8/cmVmLS02LTEhLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2xpYi9sb2FkZXIuanM/P3JlZi0tNi0yIS4vd29ya3NwYWNlLnNjc3NcIiwgZnVuY3Rpb24oKSB7XG5cdFx0dmFyIG5ld0NvbnRlbnQgPSByZXF1aXJlKFwiISEuLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcz8/cmVmLS02LTEhLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2xpYi9sb2FkZXIuanM/P3JlZi0tNi0yIS4vd29ya3NwYWNlLnNjc3NcIik7XG5cblx0XHRpZih0eXBlb2YgbmV3Q29udGVudCA9PT0gJ3N0cmluZycpIG5ld0NvbnRlbnQgPSBbW21vZHVsZS5pZCwgbmV3Q29udGVudCwgJyddXTtcblxuXHRcdHZhciBsb2NhbHMgPSAoZnVuY3Rpb24oYSwgYikge1xuXHRcdFx0dmFyIGtleSwgaWR4ID0gMDtcblxuXHRcdFx0Zm9yKGtleSBpbiBhKSB7XG5cdFx0XHRcdGlmKCFiIHx8IGFba2V5XSAhPT0gYltrZXldKSByZXR1cm4gZmFsc2U7XG5cdFx0XHRcdGlkeCsrO1xuXHRcdFx0fVxuXG5cdFx0XHRmb3Ioa2V5IGluIGIpIGlkeC0tO1xuXG5cdFx0XHRyZXR1cm4gaWR4ID09PSAwO1xuXHRcdH0oY29udGVudC5sb2NhbHMsIG5ld0NvbnRlbnQubG9jYWxzKSk7XG5cblx0XHRpZighbG9jYWxzKSB0aHJvdyBuZXcgRXJyb3IoJ0Fib3J0aW5nIENTUyBITVIgZHVlIHRvIGNoYW5nZWQgY3NzLW1vZHVsZXMgbG9jYWxzLicpO1xuXG5cdFx0dXBkYXRlKG5ld0NvbnRlbnQpO1xuXHR9KTtcblxuXHRtb2R1bGUuaG90LmRpc3Bvc2UoZnVuY3Rpb24oKSB7IHVwZGF0ZSgpOyB9KTtcbn0iLCJpbXBvcnQgeyBIdHRwIH0gZnJvbSAnLi4vaHR0cCc7XHJcblxyXG5leHBvcnQgY2xhc3MgV29ya3NwYWNlU2VydmljZSB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmh0dHAgPSBuZXcgSHR0cCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldEFsbCgpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHJlc3VsdHMgPSBhd2FpdCB0aGlzLmh0dHAuZ2V0KGAvYXBpL3YxL3dvcmtzcGFjZWApO1xyXG5cclxuICAgICAgICAgICAgICAgIHJlc29sdmUocmVzdWx0cyk7XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgIHJlamVjdChlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCh3b3Jrc3BhY2VfaWQpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHJlc3VsdHMgPSBhd2FpdCB0aGlzLmh0dHAuZ2V0KGAvYXBpL3YxL3dvcmtzcGFjZS8ke3dvcmtzcGFjZV9pZH1gKTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKHJlc3VsdHMpO1xyXG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICByZWplY3QoZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwb3N0KHVzZXJfaWQsIHdvcmtzcGFjZSkge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcblxyXG5cclxuICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgcmVqZWN0KGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn0iXSwic291cmNlUm9vdCI6IiJ9