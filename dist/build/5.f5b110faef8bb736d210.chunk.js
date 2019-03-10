(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[5],{

/***/ "/+3L":
/*!*****************************************************************************!*\
  !*** ./client/app/src/components/internal/workspace/workspace.component.js ***!
  \*****************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _config_redux_redux_store__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../config/redux/redux.store */ "MBHU");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-redux */ "/MKj");
/* harmony import */ var _services_workspace_workspace_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../services/workspace/workspace.service */ "U1No");
/* harmony import */ var react_loadable__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-loadable */ "CnBM");
/* harmony import */ var react_loadable__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_loadable__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _shared_components_loading_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../shared/components/loading.component */ "L6gD");
/* harmony import */ var _assets_style_internal_workspace_workspace_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../assets/style/internal/workspace/workspace.scss */ "nJyA");
/* harmony import */ var _assets_style_internal_workspace_workspace_scss__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_assets_style_internal_workspace_workspace_scss__WEBPACK_IMPORTED_MODULE_6__);






const ProjectComponent = react_loadable__WEBPACK_IMPORTED_MODULE_4___default()({
  loader: () => Promise.all(/*! import() */[__webpack_require__.e(3), __webpack_require__.e(7)]).then(__webpack_require__.bind(null, /*! ./project/project.component */ "C4VQ")),
  loading: _shared_components_loading_component__WEBPACK_IMPORTED_MODULE_5__["default"]
});
const ProjectOutputComponent = react_loadable__WEBPACK_IMPORTED_MODULE_4___default()({
  loader: () => Promise.all(/*! import() */[__webpack_require__.e(1), __webpack_require__.e(3)]).then(__webpack_require__.bind(null, /*! ./project/project-output.component */ "7MDm")),
  loading: _shared_components_loading_component__WEBPACK_IMPORTED_MODULE_5__["default"]
});


const mapStateToProps = state => state;

function mapDispatchToProps(dispatch) {
  return {};
}

class WorkspaceComponent extends react__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  constructor(props) {
    super(props);
    this.state = {
      debugWindowOpen: false
    };
    this.workspaceService = new _services_workspace_workspace_service__WEBPACK_IMPORTED_MODULE_3__["WorkspaceService"](); // TODO

    this.workspaceService.getAll().then(workspaces => {
      return this.workspaceService.get(workspaces[0].workspace_id);
    }).then(workspace => {
      this.setState(Object.assign({}, this.state, {
        workspace_id: workspace.workspace_id,
        project_id: workspace.projects[0] // TODO

      }));
    }).catch(e => {});
    this.handleDebugIconClick = this.handleDebugIconClick.bind(this);
    this.handleDebugWindowClose = this.handleDebugWindowClose.bind(this);
  }

  handleDebugIconClick() {
    this.setState(Object.assign({}, this.state, {
      debugWindowOpen: true
    }));
  }

  handleDebugWindowClose() {
    this.setState(Object.assign({}, this.state, {
      debugWindowOpen: false
    }));
  }

  render() {
    const {
      project_id,
      workspace_id,
      debugWindowOpen
    } = this.state;
    const {
      user
    } = _config_redux_redux_store__WEBPACK_IMPORTED_MODULE_1__["store"].getState();
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "workspace-container"
    }, user.role === 'admin' ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "debug-icon-container",
      onClick: this.handleDebugIconClick
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
      className: "debug-icon"
    })) : null, project_id && workspace_id ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ProjectComponent, {
      workspace_id: workspace_id,
      project_id: project_id
    }) : null, debugWindowOpen ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ProjectOutputComponent, {
      project_id: project_id,
      workspace_id: workspace_id,
      onClose: this.handleDebugWindowClose
    }) : null);
  }

}

;
const Workspace = Object(react_redux__WEBPACK_IMPORTED_MODULE_2__["connect"])(mapStateToProps, mapDispatchToProps)(WorkspaceComponent);
/* harmony default export */ __webpack_exports__["default"] = (Workspace);

/***/ }),

/***/ "GPZK":
/*!**********************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js??ref--6-1!./node_modules/sass-loader/lib/loader.js??ref--6-2!./client/app/assets/style/internal/workspace/workspace.scss ***!
  \**********************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../../../../node_modules/css-loader/dist/runtime/api.js */ "JPst")(true);
// Module
exports.push([module.i, ".workspace-container {\n  position: relative;\n  z-index: 10;\n  background-color: rgba(255, 255, 255, 0.9); }\n  @media (max-width: 600px) {\n    .workspace-container {\n      max-width: 100%;\n      margin: 0 !important;\n      border-radius: 0; } }\n  .workspace-container .debug-icon-container {\n    position: absolute;\n    top: -40px;\n    right: 0;\n    cursor: pointer;\n    height: 16px;\n    width: 16px; }\n    .workspace-container .debug-icon-container .debug-icon {\n      font-size: 14px;\n      position: absolute;\n      top: 0;\n      left: 0; }\n  .workspace-container .project-output-container {\n    position: absolute;\n    top: -32px;\n    right: 8px;\n    max-width: 600px;\n    max-height: 400px;\n    overflow-y: auto;\n    z-index: 300;\n    border: 1px solid #aaa;\n    background: rgba(240, 240, 240, 0.9);\n    padding: 16px 6px 6px; }\n    .workspace-container .project-output-container .close-icon-container {\n      cursor: pointer;\n      position: absolute;\n      top: 0;\n      right: 0;\n      height: 24px;\n      width: 24px; }\n      .workspace-container .project-output-container .close-icon-container .close-icon {\n        position: absolute;\n        font-size: 14px;\n        top: 4px;\n        left: 4px; }\n    .workspace-container .project-output-container .string {\n      color: darkorange; }\n    .workspace-container .project-output-container .number {\n      color: green; }\n    .workspace-container .project-output-container .boolean {\n      color: blue; }\n    .workspace-container .project-output-container .null {\n      color: blue; }\n    .workspace-container .project-output-container .key {\n      color: blue; }\n", "",{"version":3,"sources":["C:/Users/garri/source/repos/snapform/client/app/assets/style/internal/workspace/client/app/assets/style/internal/workspace/workspace.scss"],"names":[],"mappings":"AAAA;EACI,kBAAkB;EAClB,WAAW;EACX,0CAAyC,EAAA;EACzC;IAJJ;MAKQ,eAAe;MACf,oBAAoB;MACpB,gBAAgB,EAAA,EAqDvB;EA5DD;IAWQ,kBAAkB;IAClB,UAAU;IACV,QAAQ;IACR,eAAe;IACf,YAAY;IACZ,WAAW,EAAA;IAhBnB;MAmBY,eAAe;MACf,kBAAkB;MAClB,MAAM;MACN,OAAO,EAAA;EAtBnB;IA2BQ,kBAAkB;IAClB,UAAU;IACV,UAAU;IACV,gBAAgB;IAChB,iBAAiB;IACjB,gBAAgB;IAChB,YAAY;IACZ,sBAAsB;IACtB,oCAAoC;IACpC,qBAAqB,EAAA;IApC7B;MAuCY,eAAe;MACf,kBAAkB;MAClB,MAAM;MACN,QAAQ;MACR,YAAY;MACZ,WAAW,EAAA;MA5CvB;QA+CgB,kBAAkB;QAClB,eAAe;QACf,QAAQ;QACR,SAAS,EAAA;IAlDzB;MAsDkB,iBAAiB,EAAA;IAtDnC;MAuDkB,YAAY,EAAA;IAvD9B;MAwDmB,WAAW,EAAA;IAxD9B;MAyDgB,WAAW,EAAA;IAzD3B;MA0De,WAAW,EAAA","file":"workspace.scss","sourcesContent":[".workspace-container {\r\n    position: relative;\r\n    z-index: 10;\r\n    background-color: rgba(255, 255, 255, .9);\r\n    @media (max-width: 600px) {\r\n        max-width: 100%;\r\n        margin: 0 !important;\r\n        border-radius: 0;\r\n    }\r\n\r\n    .debug-icon-container {\r\n        position: absolute;\r\n        top: -40px;\r\n        right: 0;\r\n        cursor: pointer;\r\n        height: 16px;\r\n        width: 16px;\r\n        \r\n        .debug-icon {\r\n            font-size: 14px;\r\n            position: absolute;\r\n            top: 0;\r\n            left: 0;\r\n        }\r\n    }\r\n\r\n    .project-output-container {\r\n        position: absolute;\r\n        top: -32px;\r\n        right: 8px;\r\n        max-width: 600px;\r\n        max-height: 400px;\r\n        overflow-y: auto;\r\n        z-index: 300;\r\n        border: 1px solid #aaa;\r\n        background: rgba(240, 240, 240, 0.9);\r\n        padding: 16px 6px 6px;\r\n\r\n        .close-icon-container {\r\n            cursor: pointer;\r\n            position: absolute;\r\n            top: 0;\r\n            right: 0;\r\n            height: 24px;\r\n            width: 24px;\r\n\r\n            .close-icon {\r\n                position: absolute;\r\n                font-size: 14px;\r\n                top: 4px;\r\n                left: 4px;\r\n            }\r\n        }\r\n\r\n        .string { color: darkorange; }\r\n        .number { color: green; }\r\n        .boolean { color: blue; }\r\n        .null { color: blue; }\r\n        .key { color: blue; }\r\n    }\r\n}"],"sourceRoot":""}]);



/***/ }),

/***/ "U1No":
/*!****************************************************************!*\
  !*** ./client/app/src/services/workspace/workspace.service.js ***!
  \****************************************************************/
/*! exports provided: WorkspaceService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WorkspaceService", function() { return WorkspaceService; });
/* harmony import */ var _shared_utils_http__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../shared/utils/http */ "dkJd");

class WorkspaceService {
  constructor() {
    this.http = new _shared_utils_http__WEBPACK_IMPORTED_MODULE_0__["Http"]();
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

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9jbGllbnQvYXBwL3NyYy9jb21wb25lbnRzL2ludGVybmFsL3dvcmtzcGFjZS93b3Jrc3BhY2UuY29tcG9uZW50LmpzIiwid2VicGFjazovLy8uL2NsaWVudC9hcHAvYXNzZXRzL3N0eWxlL2ludGVybmFsL3dvcmtzcGFjZS93b3Jrc3BhY2Uuc2NzcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvYXBwL3NyYy9zZXJ2aWNlcy93b3Jrc3BhY2Uvd29ya3NwYWNlLnNlcnZpY2UuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L2FwcC9hc3NldHMvc3R5bGUvaW50ZXJuYWwvd29ya3NwYWNlL3dvcmtzcGFjZS5zY3NzP2Q2NTIiXSwibmFtZXMiOlsiUHJvamVjdENvbXBvbmVudCIsIkxvYWRhYmxlIiwibG9hZGVyIiwibG9hZGluZyIsIkxvYWRpbmdDb21wb25lbnQiLCJQcm9qZWN0T3V0cHV0Q29tcG9uZW50IiwibWFwU3RhdGVUb1Byb3BzIiwic3RhdGUiLCJtYXBEaXNwYXRjaFRvUHJvcHMiLCJkaXNwYXRjaCIsIldvcmtzcGFjZUNvbXBvbmVudCIsIkNvbXBvbmVudCIsImNvbnN0cnVjdG9yIiwicHJvcHMiLCJkZWJ1Z1dpbmRvd09wZW4iLCJ3b3Jrc3BhY2VTZXJ2aWNlIiwiV29ya3NwYWNlU2VydmljZSIsImdldEFsbCIsInRoZW4iLCJ3b3Jrc3BhY2VzIiwiZ2V0Iiwid29ya3NwYWNlX2lkIiwid29ya3NwYWNlIiwic2V0U3RhdGUiLCJPYmplY3QiLCJhc3NpZ24iLCJwcm9qZWN0X2lkIiwicHJvamVjdHMiLCJjYXRjaCIsImUiLCJoYW5kbGVEZWJ1Z0ljb25DbGljayIsImJpbmQiLCJoYW5kbGVEZWJ1Z1dpbmRvd0Nsb3NlIiwicmVuZGVyIiwidXNlciIsInN0b3JlIiwiZ2V0U3RhdGUiLCJyb2xlIiwiV29ya3NwYWNlIiwiY29ubmVjdCIsImh0dHAiLCJIdHRwIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJyZXN1bHRzIiwicG9zdCIsInVzZXJfaWQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUEsTUFBTUEsZ0JBQWdCLEdBQUdDLHFEQUFRLENBQUM7QUFDOUJDLFFBQU0sRUFBRSxNQUFNLGdLQURnQjtBQUU5QkMsU0FBTyxFQUFFQyw0RUFBZ0JBO0FBRkssQ0FBRCxDQUFqQztBQUlBLE1BQU1DLHNCQUFzQixHQUFHSixxREFBUSxDQUFDO0FBQ3BDQyxRQUFNLEVBQUUsTUFBTSx1S0FEc0I7QUFFcENDLFNBQU8sRUFBRUMsNEVBQWdCQTtBQUZXLENBQUQsQ0FBdkM7QUFLQTs7QUFFQSxNQUFNRSxlQUFlLEdBQUlDLEtBQUQsSUFBV0EsS0FBbkM7O0FBRUEsU0FBU0Msa0JBQVQsQ0FBNEJDLFFBQTVCLEVBQXNDO0FBQ2xDLFNBQU8sRUFBUDtBQUdIOztBQUVELE1BQU1DLGtCQUFOLFNBQWlDQywrQ0FBakMsQ0FBMkM7QUFDdkNDLGFBQVcsQ0FBQ0MsS0FBRCxFQUFRO0FBQ2YsVUFBTUEsS0FBTjtBQUNBLFNBQUtOLEtBQUwsR0FBYTtBQUNUTyxxQkFBZSxFQUFFO0FBRFIsS0FBYjtBQUlBLFNBQUtDLGdCQUFMLEdBQXdCLElBQUlDLHNGQUFKLEVBQXhCLENBTmUsQ0FRZjs7QUFDQSxTQUFLRCxnQkFBTCxDQUFzQkUsTUFBdEIsR0FBK0JDLElBQS9CLENBQW9DQyxVQUFVLElBQUk7QUFDOUMsYUFBTyxLQUFLSixnQkFBTCxDQUFzQkssR0FBdEIsQ0FBMEJELFVBQVUsQ0FBQyxDQUFELENBQVYsQ0FBY0UsWUFBeEMsQ0FBUDtBQUNILEtBRkQsRUFFR0gsSUFGSCxDQUVRSSxTQUFTLElBQUk7QUFDakIsV0FBS0MsUUFBTCxDQUFjQyxNQUFNLENBQUNDLE1BQVAsQ0FBYyxFQUFkLEVBQWtCLEtBQUtsQixLQUF2QixFQUE4QjtBQUN4Q2Msb0JBQVksRUFBRUMsU0FBUyxDQUFDRCxZQURnQjtBQUV4Q0ssa0JBQVUsRUFBRUosU0FBUyxDQUFDSyxRQUFWLENBQW1CLENBQW5CLENBRjRCLENBRU47O0FBRk0sT0FBOUIsQ0FBZDtBQUlILEtBUEQsRUFPR0MsS0FQSCxDQU9TQyxDQUFDLElBQUksQ0FFYixDQVREO0FBV0EsU0FBS0Msb0JBQUwsR0FBNEIsS0FBS0Esb0JBQUwsQ0FBMEJDLElBQTFCLENBQStCLElBQS9CLENBQTVCO0FBQ0EsU0FBS0Msc0JBQUwsR0FBOEIsS0FBS0Esc0JBQUwsQ0FBNEJELElBQTVCLENBQWlDLElBQWpDLENBQTlCO0FBQ0g7O0FBRURELHNCQUFvQixHQUFHO0FBQ25CLFNBQUtQLFFBQUwsQ0FBY0MsTUFBTSxDQUFDQyxNQUFQLENBQWMsRUFBZCxFQUFrQixLQUFLbEIsS0FBdkIsRUFBOEI7QUFDeENPLHFCQUFlLEVBQUU7QUFEdUIsS0FBOUIsQ0FBZDtBQUdIOztBQUVEa0Isd0JBQXNCLEdBQUc7QUFDckIsU0FBS1QsUUFBTCxDQUFjQyxNQUFNLENBQUNDLE1BQVAsQ0FBYyxFQUFkLEVBQWtCLEtBQUtsQixLQUF2QixFQUE4QjtBQUN4Q08scUJBQWUsRUFBRTtBQUR1QixLQUE5QixDQUFkO0FBR0g7O0FBRURtQixRQUFNLEdBQUc7QUFDTCxVQUFNO0FBQUVQLGdCQUFGO0FBQWNMLGtCQUFkO0FBQTRCUDtBQUE1QixRQUFnRCxLQUFLUCxLQUEzRDtBQUNBLFVBQU07QUFBRTJCO0FBQUYsUUFBV0MsK0RBQUssQ0FBQ0MsUUFBTixFQUFqQjtBQUVBLFdBQ0k7QUFBSyxlQUFTLEVBQUM7QUFBZixPQUNNRixJQUFJLENBQUNHLElBQUwsS0FBYyxPQUFkLEdBQ0Y7QUFBSyxlQUFTLEVBQUMsc0JBQWY7QUFBc0MsYUFBTyxFQUFFLEtBQUtQO0FBQXBELE9BQ0k7QUFBTSxlQUFTLEVBQUM7QUFBaEIsTUFESixDQURFLEdBSUEsSUFMTixFQU1NSixVQUFVLElBQUlMLFlBQWQsR0FDRiwyREFBQyxnQkFBRDtBQUNJLGtCQUFZLEVBQUVBLFlBRGxCO0FBRUksZ0JBQVUsRUFBRUs7QUFGaEIsTUFERSxHQUlBLElBVk4sRUFXTVosZUFBZSxHQUNqQiwyREFBQyxzQkFBRDtBQUF3QixnQkFBVSxFQUFFWSxVQUFwQztBQUFnRCxrQkFBWSxFQUFFTCxZQUE5RDtBQUE0RSxhQUFPLEVBQUUsS0FBS1c7QUFBMUYsTUFEaUIsR0FFZixJQWJOLENBREo7QUFpQkg7O0FBMURzQzs7QUEyRDFDO0FBRUQsTUFBTU0sU0FBUyxHQUFHQywyREFBTyxDQUFDakMsZUFBRCxFQUFrQkUsa0JBQWxCLENBQVAsQ0FBNkNFLGtCQUE3QyxDQUFsQjtBQUVlNEIsd0VBQWYsRTs7Ozs7Ozs7Ozs7QUMxRkEsMkJBQTJCLG1CQUFPLENBQUMsMkVBQStEO0FBQ2xHO0FBQ0EsY0FBYyxRQUFTLHlCQUF5Qix1QkFBdUIsZ0JBQWdCLCtDQUErQyxFQUFFLCtCQUErQiw0QkFBNEIsd0JBQXdCLDZCQUE2Qix5QkFBeUIsRUFBRSxFQUFFLGdEQUFnRCx5QkFBeUIsaUJBQWlCLGVBQWUsc0JBQXNCLG1CQUFtQixrQkFBa0IsRUFBRSw4REFBOEQsd0JBQXdCLDJCQUEyQixlQUFlLGdCQUFnQixFQUFFLG9EQUFvRCx5QkFBeUIsaUJBQWlCLGlCQUFpQix1QkFBdUIsd0JBQXdCLHVCQUF1QixtQkFBbUIsNkJBQTZCLDJDQUEyQyw0QkFBNEIsRUFBRSw0RUFBNEUsd0JBQXdCLDJCQUEyQixlQUFlLGlCQUFpQixxQkFBcUIsb0JBQW9CLEVBQUUsMEZBQTBGLDZCQUE2QiwwQkFBMEIsbUJBQW1CLG9CQUFvQixFQUFFLDhEQUE4RCwwQkFBMEIsRUFBRSw4REFBOEQscUJBQXFCLEVBQUUsK0RBQStELG9CQUFvQixFQUFFLDREQUE0RCxvQkFBb0IsRUFBRSwyREFBMkQsb0JBQW9CLEVBQUUsU0FBUyxnTUFBZ00sWUFBWSxXQUFXLGlCQUFpQixNQUFNLEtBQUssVUFBVSxZQUFZLHlCQUF5QixNQUFNLFlBQVksV0FBVyxVQUFVLFVBQVUsVUFBVSxlQUFlLE9BQU8sV0FBVyxZQUFZLFdBQVcsZUFBZSxPQUFPLGFBQWEsV0FBVyxVQUFVLFlBQVksYUFBYSxhQUFhLFdBQVcsWUFBWSxhQUFhLGtCQUFrQixPQUFPLFdBQVcsWUFBWSxXQUFXLFVBQVUsVUFBVSxlQUFlLE9BQU8sY0FBYyxXQUFXLFVBQVUsZUFBZSxPQUFPLG1CQUFtQixPQUFPLGlCQUFpQixPQUFPLGlCQUFpQixPQUFPLGlCQUFpQixPQUFPLGtGQUFrRiwyQkFBMkIsb0JBQW9CLGtEQUFrRCxtQ0FBbUMsNEJBQTRCLGlDQUFpQyw2QkFBNkIsU0FBUyxtQ0FBbUMsK0JBQStCLHVCQUF1QixxQkFBcUIsNEJBQTRCLHlCQUF5Qix3QkFBd0IscUNBQXFDLGdDQUFnQyxtQ0FBbUMsdUJBQXVCLHdCQUF3QixhQUFhLFNBQVMsdUNBQXVDLCtCQUErQix1QkFBdUIsdUJBQXVCLDZCQUE2Qiw4QkFBOEIsNkJBQTZCLHlCQUF5QixtQ0FBbUMsaURBQWlELGtDQUFrQyx1Q0FBdUMsZ0NBQWdDLG1DQUFtQyx1QkFBdUIseUJBQXlCLDZCQUE2Qiw0QkFBNEIsaUNBQWlDLHVDQUF1QyxvQ0FBb0MsNkJBQTZCLDhCQUE4QixpQkFBaUIsYUFBYSx5QkFBeUIsbUJBQW1CLEVBQUUscUJBQXFCLGNBQWMsRUFBRSxzQkFBc0IsYUFBYSxFQUFFLG1CQUFtQixhQUFhLEVBQUUsa0JBQWtCLGFBQWEsRUFBRSxTQUFTLEtBQUssbUJBQW1COzs7Ozs7Ozs7Ozs7OztBQ0Z0akk7QUFBQTtBQUFBO0FBQUE7QUFFTyxNQUFNdEIsZ0JBQU4sQ0FBdUI7QUFDMUJKLGFBQVcsR0FBRztBQUNWLFNBQUs0QixJQUFMLEdBQVksSUFBSUMsdURBQUosRUFBWjtBQUNIOztBQUVEeEIsUUFBTSxHQUFHO0FBQ0wsV0FBTyxJQUFJeUIsT0FBSixDQUFZLE9BQU9DLE9BQVAsRUFBZ0JDLE1BQWhCLEtBQTJCO0FBQzFDLFVBQUk7QUFDQSxZQUFJQyxPQUFPLEdBQUcsTUFBTSxLQUFLTCxJQUFMLENBQVVwQixHQUFWLENBQWUsbUJBQWYsQ0FBcEI7QUFFQXVCLGVBQU8sQ0FBQ0UsT0FBRCxDQUFQO0FBQ0gsT0FKRCxDQUlFLE9BQU9oQixDQUFQLEVBQVU7QUFDUmUsY0FBTSxDQUFDZixDQUFELENBQU47QUFDSDtBQUNKLEtBUk0sQ0FBUDtBQVNIOztBQUVEVCxLQUFHLENBQUNDLFlBQUQsRUFBZTtBQUNkLFdBQU8sSUFBSXFCLE9BQUosQ0FBWSxPQUFPQyxPQUFQLEVBQWdCQyxNQUFoQixLQUEyQjtBQUMxQyxVQUFJO0FBQ0EsWUFBSUMsT0FBTyxHQUFHLE1BQU0sS0FBS0wsSUFBTCxDQUFVcEIsR0FBVixDQUFlLHFCQUFvQkMsWUFBYSxFQUFoRCxDQUFwQjtBQUVBc0IsZUFBTyxDQUFDRSxPQUFELENBQVA7QUFDSCxPQUpELENBSUUsT0FBT2hCLENBQVAsRUFBVTtBQUNSZSxjQUFNLENBQUNmLENBQUQsQ0FBTjtBQUNIO0FBQ0osS0FSTSxDQUFQO0FBU0g7O0FBRURpQixNQUFJLENBQUNDLE9BQUQsRUFBVXpCLFNBQVYsRUFBcUI7QUFDckIsV0FBTyxJQUFJb0IsT0FBSixDQUFZLE9BQU9DLE9BQVAsRUFBZ0JDLE1BQWhCLEtBQTJCO0FBQzFDLFVBQUk7QUFHQUQsZUFBTztBQUNWLE9BSkQsQ0FJRSxPQUFPZCxDQUFQLEVBQVU7QUFDUmUsY0FBTSxDQUFDZixDQUFELENBQU47QUFDSDtBQUNKLEtBUk0sQ0FBUDtBQVNIOztBQXZDeUIsQzs7Ozs7Ozs7Ozs7O0FDRDlCLGNBQWMsbUJBQU8sQ0FBQyxrS0FBdUo7O0FBRTdLLDRDQUE0QyxRQUFTOztBQUVyRDtBQUNBOzs7O0FBSUEsZUFBZTs7QUFFZjtBQUNBOztBQUVBLGFBQWEsbUJBQU8sQ0FBQywwRUFBK0Q7O0FBRXBGOztBQUVBLEdBQUcsS0FBVSxFQUFFLEUiLCJmaWxlIjoiYnVpbGQvNS5mNWIxMTBmYWVmOGJiNzM2ZDIxMC5jaHVuay5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQgfSBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCB7IHN0b3JlIH0gZnJvbSAnLi4vLi4vLi4vY29uZmlnL3JlZHV4L3JlZHV4LnN0b3JlJztcclxuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gJ3JlYWN0LXJlZHV4JztcclxuaW1wb3J0IHsgV29ya3NwYWNlU2VydmljZSB9IGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL3dvcmtzcGFjZS93b3Jrc3BhY2Uuc2VydmljZSc7XHJcbmltcG9ydCBMb2FkYWJsZSBmcm9tICdyZWFjdC1sb2FkYWJsZSc7XHJcblxyXG5pbXBvcnQgTG9hZGluZ0NvbXBvbmVudCBmcm9tICcuLi8uLi8uLi9zaGFyZWQvY29tcG9uZW50cy9sb2FkaW5nLmNvbXBvbmVudCc7XHJcblxyXG5jb25zdCBQcm9qZWN0Q29tcG9uZW50ID0gTG9hZGFibGUoe1xyXG4gICAgbG9hZGVyOiAoKSA9PiBpbXBvcnQoJy4vcHJvamVjdC9wcm9qZWN0LmNvbXBvbmVudCcpLFxyXG4gICAgbG9hZGluZzogTG9hZGluZ0NvbXBvbmVudFxyXG59KTtcclxuY29uc3QgUHJvamVjdE91dHB1dENvbXBvbmVudCA9IExvYWRhYmxlKHtcclxuICAgIGxvYWRlcjogKCkgPT4gaW1wb3J0KCcuL3Byb2plY3QvcHJvamVjdC1vdXRwdXQuY29tcG9uZW50JyksXHJcbiAgICBsb2FkaW5nOiBMb2FkaW5nQ29tcG9uZW50XHJcbn0pO1xyXG5cclxuaW1wb3J0ICcuLi8uLi8uLi8uLi9hc3NldHMvc3R5bGUvaW50ZXJuYWwvd29ya3NwYWNlL3dvcmtzcGFjZS5zY3NzJztcclxuXHJcbmNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9IChzdGF0ZSkgPT4gc3RhdGU7XHJcblxyXG5mdW5jdGlvbiBtYXBEaXNwYXRjaFRvUHJvcHMoZGlzcGF0Y2gpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgXHJcbiAgICB9O1xyXG59XHJcblxyXG5jbGFzcyBXb3Jrc3BhY2VDb21wb25lbnQgZXh0ZW5kcyBDb21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcclxuICAgICAgICAgICAgZGVidWdXaW5kb3dPcGVuOiBmYWxzZVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMud29ya3NwYWNlU2VydmljZSA9IG5ldyBXb3Jrc3BhY2VTZXJ2aWNlKCk7XHJcblxyXG4gICAgICAgIC8vIFRPRE9cclxuICAgICAgICB0aGlzLndvcmtzcGFjZVNlcnZpY2UuZ2V0QWxsKCkudGhlbih3b3Jrc3BhY2VzID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMud29ya3NwYWNlU2VydmljZS5nZXQod29ya3NwYWNlc1swXS53b3Jrc3BhY2VfaWQpO1xyXG4gICAgICAgIH0pLnRoZW4od29ya3NwYWNlID0+IHtcclxuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZShPYmplY3QuYXNzaWduKHt9LCB0aGlzLnN0YXRlLCB7XHJcbiAgICAgICAgICAgICAgICB3b3Jrc3BhY2VfaWQ6IHdvcmtzcGFjZS53b3Jrc3BhY2VfaWQsXHJcbiAgICAgICAgICAgICAgICBwcm9qZWN0X2lkOiB3b3Jrc3BhY2UucHJvamVjdHNbMF0gLy8gVE9ET1xyXG4gICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgfSkuY2F0Y2goZSA9PiB7XHJcblxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmhhbmRsZURlYnVnSWNvbkNsaWNrID0gdGhpcy5oYW5kbGVEZWJ1Z0ljb25DbGljay5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlRGVidWdXaW5kb3dDbG9zZSA9IHRoaXMuaGFuZGxlRGVidWdXaW5kb3dDbG9zZS5iaW5kKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZURlYnVnSWNvbkNsaWNrKCkge1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5zdGF0ZSwge1xyXG4gICAgICAgICAgICBkZWJ1Z1dpbmRvd09wZW46IHRydWVcclxuICAgICAgICB9KSk7XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlRGVidWdXaW5kb3dDbG9zZSgpIHtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKE9iamVjdC5hc3NpZ24oe30sIHRoaXMuc3RhdGUsIHtcclxuICAgICAgICAgICAgZGVidWdXaW5kb3dPcGVuOiBmYWxzZVxyXG4gICAgICAgIH0pKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyBwcm9qZWN0X2lkLCB3b3Jrc3BhY2VfaWQsIGRlYnVnV2luZG93T3BlbiB9ID0gdGhpcy5zdGF0ZTtcclxuICAgICAgICBjb25zdCB7IHVzZXIgfSA9IHN0b3JlLmdldFN0YXRlKCk7XHJcblxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwid29ya3NwYWNlLWNvbnRhaW5lclwiPlxyXG4gICAgICAgICAgICAgICAgeyB1c2VyLnJvbGUgPT09ICdhZG1pbicgP1xyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJkZWJ1Zy1pY29uLWNvbnRhaW5lclwiIG9uQ2xpY2s9e3RoaXMuaGFuZGxlRGVidWdJY29uQ2xpY2t9PlxyXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImRlYnVnLWljb25cIj48L3NwYW4+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDogbnVsbCB9XHJcbiAgICAgICAgICAgICAgICB7IHByb2plY3RfaWQgJiYgd29ya3NwYWNlX2lkID8gXHJcbiAgICAgICAgICAgICAgICA8UHJvamVjdENvbXBvbmVudCBcclxuICAgICAgICAgICAgICAgICAgICB3b3Jrc3BhY2VfaWQ9e3dvcmtzcGFjZV9pZH1cclxuICAgICAgICAgICAgICAgICAgICBwcm9qZWN0X2lkPXtwcm9qZWN0X2lkfSAvPlxyXG4gICAgICAgICAgICAgICAgOiBudWxsIH1cclxuICAgICAgICAgICAgICAgIHsgZGVidWdXaW5kb3dPcGVuID9cclxuICAgICAgICAgICAgICAgIDxQcm9qZWN0T3V0cHV0Q29tcG9uZW50IHByb2plY3RfaWQ9e3Byb2plY3RfaWR9IHdvcmtzcGFjZV9pZD17d29ya3NwYWNlX2lkfSBvbkNsb3NlPXt0aGlzLmhhbmRsZURlYnVnV2luZG93Q2xvc2V9IC8+XHJcbiAgICAgICAgICAgICAgICA6IG51bGwgfVxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59O1xyXG5cclxuY29uc3QgV29ya3NwYWNlID0gY29ubmVjdChtYXBTdGF0ZVRvUHJvcHMsIG1hcERpc3BhdGNoVG9Qcm9wcykoV29ya3NwYWNlQ29tcG9uZW50KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IFdvcmtzcGFjZTsiLCJleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiKSh0cnVlKTtcbi8vIE1vZHVsZVxuZXhwb3J0cy5wdXNoKFttb2R1bGUuaWQsIFwiLndvcmtzcGFjZS1jb250YWluZXIge1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgei1pbmRleDogMTA7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuOSk7IH1cXG4gIEBtZWRpYSAobWF4LXdpZHRoOiA2MDBweCkge1xcbiAgICAud29ya3NwYWNlLWNvbnRhaW5lciB7XFxuICAgICAgbWF4LXdpZHRoOiAxMDAlO1xcbiAgICAgIG1hcmdpbjogMCAhaW1wb3J0YW50O1xcbiAgICAgIGJvcmRlci1yYWRpdXM6IDA7IH0gfVxcbiAgLndvcmtzcGFjZS1jb250YWluZXIgLmRlYnVnLWljb24tY29udGFpbmVyIHtcXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgICB0b3A6IC00MHB4O1xcbiAgICByaWdodDogMDtcXG4gICAgY3Vyc29yOiBwb2ludGVyO1xcbiAgICBoZWlnaHQ6IDE2cHg7XFxuICAgIHdpZHRoOiAxNnB4OyB9XFxuICAgIC53b3Jrc3BhY2UtY29udGFpbmVyIC5kZWJ1Zy1pY29uLWNvbnRhaW5lciAuZGVidWctaWNvbiB7XFxuICAgICAgZm9udC1zaXplOiAxNHB4O1xcbiAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gICAgICB0b3A6IDA7XFxuICAgICAgbGVmdDogMDsgfVxcbiAgLndvcmtzcGFjZS1jb250YWluZXIgLnByb2plY3Qtb3V0cHV0LWNvbnRhaW5lciB7XFxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gICAgdG9wOiAtMzJweDtcXG4gICAgcmlnaHQ6IDhweDtcXG4gICAgbWF4LXdpZHRoOiA2MDBweDtcXG4gICAgbWF4LWhlaWdodDogNDAwcHg7XFxuICAgIG92ZXJmbG93LXk6IGF1dG87XFxuICAgIHotaW5kZXg6IDMwMDtcXG4gICAgYm9yZGVyOiAxcHggc29saWQgI2FhYTtcXG4gICAgYmFja2dyb3VuZDogcmdiYSgyNDAsIDI0MCwgMjQwLCAwLjkpO1xcbiAgICBwYWRkaW5nOiAxNnB4IDZweCA2cHg7IH1cXG4gICAgLndvcmtzcGFjZS1jb250YWluZXIgLnByb2plY3Qtb3V0cHV0LWNvbnRhaW5lciAuY2xvc2UtaWNvbi1jb250YWluZXIge1xcbiAgICAgIGN1cnNvcjogcG9pbnRlcjtcXG4gICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICAgICAgdG9wOiAwO1xcbiAgICAgIHJpZ2h0OiAwO1xcbiAgICAgIGhlaWdodDogMjRweDtcXG4gICAgICB3aWR0aDogMjRweDsgfVxcbiAgICAgIC53b3Jrc3BhY2UtY29udGFpbmVyIC5wcm9qZWN0LW91dHB1dC1jb250YWluZXIgLmNsb3NlLWljb24tY29udGFpbmVyIC5jbG9zZS1pY29uIHtcXG4gICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gICAgICAgIGZvbnQtc2l6ZTogMTRweDtcXG4gICAgICAgIHRvcDogNHB4O1xcbiAgICAgICAgbGVmdDogNHB4OyB9XFxuICAgIC53b3Jrc3BhY2UtY29udGFpbmVyIC5wcm9qZWN0LW91dHB1dC1jb250YWluZXIgLnN0cmluZyB7XFxuICAgICAgY29sb3I6IGRhcmtvcmFuZ2U7IH1cXG4gICAgLndvcmtzcGFjZS1jb250YWluZXIgLnByb2plY3Qtb3V0cHV0LWNvbnRhaW5lciAubnVtYmVyIHtcXG4gICAgICBjb2xvcjogZ3JlZW47IH1cXG4gICAgLndvcmtzcGFjZS1jb250YWluZXIgLnByb2plY3Qtb3V0cHV0LWNvbnRhaW5lciAuYm9vbGVhbiB7XFxuICAgICAgY29sb3I6IGJsdWU7IH1cXG4gICAgLndvcmtzcGFjZS1jb250YWluZXIgLnByb2plY3Qtb3V0cHV0LWNvbnRhaW5lciAubnVsbCB7XFxuICAgICAgY29sb3I6IGJsdWU7IH1cXG4gICAgLndvcmtzcGFjZS1jb250YWluZXIgLnByb2plY3Qtb3V0cHV0LWNvbnRhaW5lciAua2V5IHtcXG4gICAgICBjb2xvcjogYmx1ZTsgfVxcblwiLCBcIlwiLHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIkM6L1VzZXJzL2dhcnJpL3NvdXJjZS9yZXBvcy9zbmFwZm9ybS9jbGllbnQvYXBwL2Fzc2V0cy9zdHlsZS9pbnRlcm5hbC93b3Jrc3BhY2UvY2xpZW50L2FwcC9hc3NldHMvc3R5bGUvaW50ZXJuYWwvd29ya3NwYWNlL3dvcmtzcGFjZS5zY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUFBO0VBQ0ksa0JBQWtCO0VBQ2xCLFdBQVc7RUFDWCwwQ0FBeUMsRUFBQTtFQUN6QztJQUpKO01BS1EsZUFBZTtNQUNmLG9CQUFvQjtNQUNwQixnQkFBZ0IsRUFBQSxFQXFEdkI7RUE1REQ7SUFXUSxrQkFBa0I7SUFDbEIsVUFBVTtJQUNWLFFBQVE7SUFDUixlQUFlO0lBQ2YsWUFBWTtJQUNaLFdBQVcsRUFBQTtJQWhCbkI7TUFtQlksZUFBZTtNQUNmLGtCQUFrQjtNQUNsQixNQUFNO01BQ04sT0FBTyxFQUFBO0VBdEJuQjtJQTJCUSxrQkFBa0I7SUFDbEIsVUFBVTtJQUNWLFVBQVU7SUFDVixnQkFBZ0I7SUFDaEIsaUJBQWlCO0lBQ2pCLGdCQUFnQjtJQUNoQixZQUFZO0lBQ1osc0JBQXNCO0lBQ3RCLG9DQUFvQztJQUNwQyxxQkFBcUIsRUFBQTtJQXBDN0I7TUF1Q1ksZUFBZTtNQUNmLGtCQUFrQjtNQUNsQixNQUFNO01BQ04sUUFBUTtNQUNSLFlBQVk7TUFDWixXQUFXLEVBQUE7TUE1Q3ZCO1FBK0NnQixrQkFBa0I7UUFDbEIsZUFBZTtRQUNmLFFBQVE7UUFDUixTQUFTLEVBQUE7SUFsRHpCO01Bc0RrQixpQkFBaUIsRUFBQTtJQXREbkM7TUF1RGtCLFlBQVksRUFBQTtJQXZEOUI7TUF3RG1CLFdBQVcsRUFBQTtJQXhEOUI7TUF5RGdCLFdBQVcsRUFBQTtJQXpEM0I7TUEwRGUsV0FBVyxFQUFBXCIsXCJmaWxlXCI6XCJ3b3Jrc3BhY2Uuc2Nzc1wiLFwic291cmNlc0NvbnRlbnRcIjpbXCIud29ya3NwYWNlLWNvbnRhaW5lciB7XFxyXFxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcXHJcXG4gICAgei1pbmRleDogMTA7XFxyXFxuICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMjU1LCAyNTUsIDI1NSwgLjkpO1xcclxcbiAgICBAbWVkaWEgKG1heC13aWR0aDogNjAwcHgpIHtcXHJcXG4gICAgICAgIG1heC13aWR0aDogMTAwJTtcXHJcXG4gICAgICAgIG1hcmdpbjogMCAhaW1wb3J0YW50O1xcclxcbiAgICAgICAgYm9yZGVyLXJhZGl1czogMDtcXHJcXG4gICAgfVxcclxcblxcclxcbiAgICAuZGVidWctaWNvbi1jb250YWluZXIge1xcclxcbiAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xcclxcbiAgICAgICAgdG9wOiAtNDBweDtcXHJcXG4gICAgICAgIHJpZ2h0OiAwO1xcclxcbiAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xcclxcbiAgICAgICAgaGVpZ2h0OiAxNnB4O1xcclxcbiAgICAgICAgd2lkdGg6IDE2cHg7XFxyXFxuICAgICAgICBcXHJcXG4gICAgICAgIC5kZWJ1Zy1pY29uIHtcXHJcXG4gICAgICAgICAgICBmb250LXNpemU6IDE0cHg7XFxyXFxuICAgICAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xcclxcbiAgICAgICAgICAgIHRvcDogMDtcXHJcXG4gICAgICAgICAgICBsZWZ0OiAwO1xcclxcbiAgICAgICAgfVxcclxcbiAgICB9XFxyXFxuXFxyXFxuICAgIC5wcm9qZWN0LW91dHB1dC1jb250YWluZXIge1xcclxcbiAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xcclxcbiAgICAgICAgdG9wOiAtMzJweDtcXHJcXG4gICAgICAgIHJpZ2h0OiA4cHg7XFxyXFxuICAgICAgICBtYXgtd2lkdGg6IDYwMHB4O1xcclxcbiAgICAgICAgbWF4LWhlaWdodDogNDAwcHg7XFxyXFxuICAgICAgICBvdmVyZmxvdy15OiBhdXRvO1xcclxcbiAgICAgICAgei1pbmRleDogMzAwO1xcclxcbiAgICAgICAgYm9yZGVyOiAxcHggc29saWQgI2FhYTtcXHJcXG4gICAgICAgIGJhY2tncm91bmQ6IHJnYmEoMjQwLCAyNDAsIDI0MCwgMC45KTtcXHJcXG4gICAgICAgIHBhZGRpbmc6IDE2cHggNnB4IDZweDtcXHJcXG5cXHJcXG4gICAgICAgIC5jbG9zZS1pY29uLWNvbnRhaW5lciB7XFxyXFxuICAgICAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xcclxcbiAgICAgICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXHJcXG4gICAgICAgICAgICB0b3A6IDA7XFxyXFxuICAgICAgICAgICAgcmlnaHQ6IDA7XFxyXFxuICAgICAgICAgICAgaGVpZ2h0OiAyNHB4O1xcclxcbiAgICAgICAgICAgIHdpZHRoOiAyNHB4O1xcclxcblxcclxcbiAgICAgICAgICAgIC5jbG9zZS1pY29uIHtcXHJcXG4gICAgICAgICAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xcclxcbiAgICAgICAgICAgICAgICBmb250LXNpemU6IDE0cHg7XFxyXFxuICAgICAgICAgICAgICAgIHRvcDogNHB4O1xcclxcbiAgICAgICAgICAgICAgICBsZWZ0OiA0cHg7XFxyXFxuICAgICAgICAgICAgfVxcclxcbiAgICAgICAgfVxcclxcblxcclxcbiAgICAgICAgLnN0cmluZyB7IGNvbG9yOiBkYXJrb3JhbmdlOyB9XFxyXFxuICAgICAgICAubnVtYmVyIHsgY29sb3I6IGdyZWVuOyB9XFxyXFxuICAgICAgICAuYm9vbGVhbiB7IGNvbG9yOiBibHVlOyB9XFxyXFxuICAgICAgICAubnVsbCB7IGNvbG9yOiBibHVlOyB9XFxyXFxuICAgICAgICAua2V5IHsgY29sb3I6IGJsdWU7IH1cXHJcXG4gICAgfVxcclxcbn1cIl0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcblxuIiwiaW1wb3J0IHsgSHR0cCB9IGZyb20gJy4uLy4uL3NoYXJlZC91dGlscy9odHRwJztcclxuXHJcbmV4cG9ydCBjbGFzcyBXb3Jrc3BhY2VTZXJ2aWNlIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuaHR0cCA9IG5ldyBIdHRwKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0QWxsKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcmVzdWx0cyA9IGF3YWl0IHRoaXMuaHR0cC5nZXQoYC9hcGkvdjEvd29ya3NwYWNlYCk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShyZXN1bHRzKTtcclxuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgcmVqZWN0KGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0KHdvcmtzcGFjZV9pZCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcmVzdWx0cyA9IGF3YWl0IHRoaXMuaHR0cC5nZXQoYC9hcGkvdjEvd29ya3NwYWNlLyR7d29ya3NwYWNlX2lkfWApO1xyXG5cclxuICAgICAgICAgICAgICAgIHJlc29sdmUocmVzdWx0cyk7XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgIHJlamVjdChlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHBvc3QodXNlcl9pZCwgd29ya3NwYWNlKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgdHJ5IHtcclxuXHJcblxyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICByZWplY3QoZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxufSIsIlxudmFyIGNvbnRlbnQgPSByZXF1aXJlKFwiISEuLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcz8/cmVmLS02LTEhLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2xpYi9sb2FkZXIuanM/P3JlZi0tNi0yIS4vd29ya3NwYWNlLnNjc3NcIik7XG5cbmlmKHR5cGVvZiBjb250ZW50ID09PSAnc3RyaW5nJykgY29udGVudCA9IFtbbW9kdWxlLmlkLCBjb250ZW50LCAnJ11dO1xuXG52YXIgdHJhbnNmb3JtO1xudmFyIGluc2VydEludG87XG5cblxuXG52YXIgb3B0aW9ucyA9IHtcImhtclwiOnRydWV9XG5cbm9wdGlvbnMudHJhbnNmb3JtID0gdHJhbnNmb3JtXG5vcHRpb25zLmluc2VydEludG8gPSB1bmRlZmluZWQ7XG5cbnZhciB1cGRhdGUgPSByZXF1aXJlKFwiIS4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvbGliL2FkZFN0eWxlcy5qc1wiKShjb250ZW50LCBvcHRpb25zKTtcblxuaWYoY29udGVudC5sb2NhbHMpIG1vZHVsZS5leHBvcnRzID0gY29udGVudC5sb2NhbHM7XG5cbmlmKG1vZHVsZS5ob3QpIHtcblx0bW9kdWxlLmhvdC5hY2NlcHQoXCIhIS4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzPz9yZWYtLTYtMSEuLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvbGliL2xvYWRlci5qcz8/cmVmLS02LTIhLi93b3Jrc3BhY2Uuc2Nzc1wiLCBmdW5jdGlvbigpIHtcblx0XHR2YXIgbmV3Q29udGVudCA9IHJlcXVpcmUoXCIhIS4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzPz9yZWYtLTYtMSEuLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvbGliL2xvYWRlci5qcz8/cmVmLS02LTIhLi93b3Jrc3BhY2Uuc2Nzc1wiKTtcblxuXHRcdGlmKHR5cGVvZiBuZXdDb250ZW50ID09PSAnc3RyaW5nJykgbmV3Q29udGVudCA9IFtbbW9kdWxlLmlkLCBuZXdDb250ZW50LCAnJ11dO1xuXG5cdFx0dmFyIGxvY2FscyA9IChmdW5jdGlvbihhLCBiKSB7XG5cdFx0XHR2YXIga2V5LCBpZHggPSAwO1xuXG5cdFx0XHRmb3Ioa2V5IGluIGEpIHtcblx0XHRcdFx0aWYoIWIgfHwgYVtrZXldICE9PSBiW2tleV0pIHJldHVybiBmYWxzZTtcblx0XHRcdFx0aWR4Kys7XG5cdFx0XHR9XG5cblx0XHRcdGZvcihrZXkgaW4gYikgaWR4LS07XG5cblx0XHRcdHJldHVybiBpZHggPT09IDA7XG5cdFx0fShjb250ZW50LmxvY2FscywgbmV3Q29udGVudC5sb2NhbHMpKTtcblxuXHRcdGlmKCFsb2NhbHMpIHRocm93IG5ldyBFcnJvcignQWJvcnRpbmcgQ1NTIEhNUiBkdWUgdG8gY2hhbmdlZCBjc3MtbW9kdWxlcyBsb2NhbHMuJyk7XG5cblx0XHR1cGRhdGUobmV3Q29udGVudCk7XG5cdH0pO1xuXG5cdG1vZHVsZS5ob3QuZGlzcG9zZShmdW5jdGlvbigpIHsgdXBkYXRlKCk7IH0pO1xufSJdLCJzb3VyY2VSb290IjoiIn0=