(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[7],{

/***/ "0fwD":
/*!****************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js??ref--6-1!./node_modules/sass-loader/lib/loader.js??ref--6-2!./client/app/assets/style/internal/workspace/project/project.scss ***!
  \****************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../../../../../node_modules/css-loader/dist/runtime/api.js */ "JPst")(true);
// Module
exports.push([module.i, ".project-container {\n  position: relative; }\n  .project-container .engine-container {\n    margin: 44px auto 0; }\n", "",{"version":3,"sources":["C:/Users/garri/source/repos/snapform/client/app/assets/style/internal/workspace/project/client/app/assets/style/internal/workspace/project/project.scss"],"names":[],"mappings":"AAAA;EACI,kBAAkB,EAAA;EADtB;IAIQ,mBAAmB,EAAA","file":"project.scss","sourcesContent":[".project-container {\r\n    position: relative;\r\n\r\n    .engine-container {\r\n        margin: 44px auto 0;\r\n    }\r\n}"],"sourceRoot":""}]);



/***/ }),

/***/ "C4VQ":
/*!***********************************************************************************!*\
  !*** ./client/app/src/components/internal/workspace/project/project.component.js ***!
  \***********************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _config_redux_redux_store__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../config/redux/redux.store */ "MBHU");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-redux */ "/MKj");
/* harmony import */ var _services_workspace_project_project_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../services/workspace/project/project.service */ "xs3E");
/* harmony import */ var react_loadable__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-loadable */ "CnBM");
/* harmony import */ var react_loadable__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_loadable__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _shared_components_loading_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../shared/components/loading.component */ "L6gD");
/* harmony import */ var _assets_style_internal_workspace_project_project_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../../assets/style/internal/workspace/project/project.scss */ "MYdX");
/* harmony import */ var _assets_style_internal_workspace_project_project_scss__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_assets_style_internal_workspace_project_project_scss__WEBPACK_IMPORTED_MODULE_6__);






const EngineComponent = react_loadable__WEBPACK_IMPORTED_MODULE_4___default()({
  loader: () => Promise.all(/*! import() */[__webpack_require__.e("vendor/vendor.uuid"), __webpack_require__.e(0)]).then(__webpack_require__.bind(null, /*! ../../../../../../engine/src/index */ "tCIO")),
  loading: _shared_components_loading_component__WEBPACK_IMPORTED_MODULE_5__["default"]
});
const ProjectOutputComponent = react_loadable__WEBPACK_IMPORTED_MODULE_4___default()({
  loader: () => __webpack_require__.e(/*! import() */ 1).then(__webpack_require__.bind(null, /*! ./project-output.component */ "7MDm")),
  loading: _shared_components_loading_component__WEBPACK_IMPORTED_MODULE_5__["default"]
});


const mapStateToProps = state => state;

function mapDispatchToProps(dispatch) {
  return {};
}

class ProjectComponent extends react__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  constructor(props) {
    super(props);
    this.projectService = new _services_workspace_project_project_service__WEBPACK_IMPORTED_MODULE_3__["ProjectService"]();
    this.state = {};
    this.projectService.get(this.props.workspace_id, this.props.project_id).then(project => {
      this.setState(Object.assign({}, this.state, {
        project
      }));
    }).catch(e => {});
    this.handleProjectUpdate = this.handleProjectUpdate.bind(this);
    this.handleDebugIconClick = this.handleDebugIconClick.bind(this);
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

  handleDebugIconClick() {}

  render() {
    const {
      workspace_id
    } = this.props;
    const {
      project
    } = this.state;
    const {
      user
    } = _config_redux_redux_store__WEBPACK_IMPORTED_MODULE_1__["store"].getState();
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "project-container",
      ref: project => this.project = project
    }, project ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "engine-container"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(EngineComponent, {
      workspace_id: workspace_id,
      project: project
    })) : null);
  }

}

;
const Project = Object(react_redux__WEBPACK_IMPORTED_MODULE_2__["connect"])(mapStateToProps, mapDispatchToProps)(ProjectComponent);
/* harmony default export */ __webpack_exports__["default"] = (Project);

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

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9jbGllbnQvYXBwL2Fzc2V0cy9zdHlsZS9pbnRlcm5hbC93b3Jrc3BhY2UvcHJvamVjdC9wcm9qZWN0LnNjc3MiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L2FwcC9zcmMvY29tcG9uZW50cy9pbnRlcm5hbC93b3Jrc3BhY2UvcHJvamVjdC9wcm9qZWN0LmNvbXBvbmVudC5qcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvYXBwL2Fzc2V0cy9zdHlsZS9pbnRlcm5hbC93b3Jrc3BhY2UvcHJvamVjdC9wcm9qZWN0LnNjc3M/NjJkYyJdLCJuYW1lcyI6WyJFbmdpbmVDb21wb25lbnQiLCJMb2FkYWJsZSIsImxvYWRlciIsImxvYWRpbmciLCJMb2FkaW5nQ29tcG9uZW50IiwiUHJvamVjdE91dHB1dENvbXBvbmVudCIsIm1hcFN0YXRlVG9Qcm9wcyIsInN0YXRlIiwibWFwRGlzcGF0Y2hUb1Byb3BzIiwiZGlzcGF0Y2giLCJQcm9qZWN0Q29tcG9uZW50IiwiQ29tcG9uZW50IiwiY29uc3RydWN0b3IiLCJwcm9wcyIsInByb2plY3RTZXJ2aWNlIiwiUHJvamVjdFNlcnZpY2UiLCJnZXQiLCJ3b3Jrc3BhY2VfaWQiLCJwcm9qZWN0X2lkIiwidGhlbiIsInByb2plY3QiLCJzZXRTdGF0ZSIsIk9iamVjdCIsImFzc2lnbiIsImNhdGNoIiwiZSIsImhhbmRsZVByb2plY3RVcGRhdGUiLCJiaW5kIiwiaGFuZGxlRGVidWdJY29uQ2xpY2siLCJjb21wb25lbnREaWRNb3VudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJjb21wb25lbnRXaWxsVW5tb3VudCIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJkZXRhaWwiLCJwdXQiLCJyZW5kZXIiLCJ1c2VyIiwic3RvcmUiLCJnZXRTdGF0ZSIsIlByb2plY3QiLCJjb25uZWN0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSwyQkFBMkIsbUJBQU8sQ0FBQyw4RUFBa0U7QUFDckc7QUFDQSxjQUFjLFFBQVMsdUJBQXVC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QUFDSSxrQkFBWSxFQUFFSCxZQURsQjtBQUVJLGFBQU8sRUFBRUc7QUFGYixNQURKLENBRFMsR0FNUCxJQVBOLENBREo7QUFXSDs7QUExRG9DOztBQTJEeEM7QUFFRCxNQUFNbUIsT0FBTyxHQUFHQywyREFBTyxDQUFDbEMsZUFBRCxFQUFrQkUsa0JBQWxCLENBQVAsQ0FBNkNFLGdCQUE3QyxDQUFoQjtBQUVlNkIsc0VBQWYsRTs7Ozs7Ozs7Ozs7O0FDekZBLGNBQWMsbUJBQU8sQ0FBQyxzS0FBMko7O0FBRWpMLDRDQUE0QyxRQUFTOztBQUVyRDtBQUNBOzs7O0FBSUEsZUFBZTs7QUFFZjtBQUNBOztBQUVBLGFBQWEsbUJBQU8sQ0FBQyw2RUFBa0U7O0FBRXZGOztBQUVBLEdBQUcsS0FBVSxFQUFFLEUiLCJmaWxlIjoiYnVpbGQvNy5iYzg4Y2QxOWUwYTYyM2Q2OTgyNy5jaHVuay5qcyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzXCIpKHRydWUpO1xuLy8gTW9kdWxlXG5leHBvcnRzLnB1c2goW21vZHVsZS5pZCwgXCIucHJvamVjdC1jb250YWluZXIge1xcbiAgcG9zaXRpb246IHJlbGF0aXZlOyB9XFxuICAucHJvamVjdC1jb250YWluZXIgLmVuZ2luZS1jb250YWluZXIge1xcbiAgICBtYXJnaW46IDQ0cHggYXV0byAwOyB9XFxuXCIsIFwiXCIse1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wiQzovVXNlcnMvZ2Fycmkvc291cmNlL3JlcG9zL3NuYXBmb3JtL2NsaWVudC9hcHAvYXNzZXRzL3N0eWxlL2ludGVybmFsL3dvcmtzcGFjZS9wcm9qZWN0L2NsaWVudC9hcHAvYXNzZXRzL3N0eWxlL2ludGVybmFsL3dvcmtzcGFjZS9wcm9qZWN0L3Byb2plY3Quc2Nzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQTtFQUNJLGtCQUFrQixFQUFBO0VBRHRCO0lBSVEsbUJBQW1CLEVBQUFcIixcImZpbGVcIjpcInByb2plY3Quc2Nzc1wiLFwic291cmNlc0NvbnRlbnRcIjpbXCIucHJvamVjdC1jb250YWluZXIge1xcclxcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XFxyXFxuXFxyXFxuICAgIC5lbmdpbmUtY29udGFpbmVyIHtcXHJcXG4gICAgICAgIG1hcmdpbjogNDRweCBhdXRvIDA7XFxyXFxuICAgIH1cXHJcXG59XCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG5cbiIsImltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQgfSBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCB7IHN0b3JlIH0gZnJvbSAnLi4vLi4vLi4vLi4vY29uZmlnL3JlZHV4L3JlZHV4LnN0b3JlJztcclxuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gJ3JlYWN0LXJlZHV4JztcclxuaW1wb3J0IHsgUHJvamVjdFNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi8uLi9zZXJ2aWNlcy93b3Jrc3BhY2UvcHJvamVjdC9wcm9qZWN0LnNlcnZpY2UnO1xyXG5pbXBvcnQgTG9hZGFibGUgZnJvbSAncmVhY3QtbG9hZGFibGUnO1xyXG5cclxuaW1wb3J0IExvYWRpbmdDb21wb25lbnQgZnJvbSAnLi4vLi4vLi4vLi4vc2hhcmVkL2NvbXBvbmVudHMvbG9hZGluZy5jb21wb25lbnQnO1xyXG5cclxuY29uc3QgRW5naW5lQ29tcG9uZW50ID0gTG9hZGFibGUoe1xyXG4gICAgbG9hZGVyOiAoKSA9PiBpbXBvcnQgKCcuLi8uLi8uLi8uLi8uLi8uLi9lbmdpbmUvc3JjL2luZGV4JyksXHJcbiAgICBsb2FkaW5nOiBMb2FkaW5nQ29tcG9uZW50XHJcbn0pO1xyXG5jb25zdCBQcm9qZWN0T3V0cHV0Q29tcG9uZW50ID0gTG9hZGFibGUoe1xyXG4gICAgbG9hZGVyOiAoKSA9PiBpbXBvcnQgKCcuL3Byb2plY3Qtb3V0cHV0LmNvbXBvbmVudCcpLFxyXG4gICAgbG9hZGluZzogTG9hZGluZ0NvbXBvbmVudFxyXG59KTtcclxuXHJcbmltcG9ydCAnLi4vLi4vLi4vLi4vLi4vYXNzZXRzL3N0eWxlL2ludGVybmFsL3dvcmtzcGFjZS9wcm9qZWN0L3Byb2plY3Quc2Nzcyc7XHJcblxyXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSAoc3RhdGUpID0+IHN0YXRlO1xyXG5cclxuZnVuY3Rpb24gbWFwRGlzcGF0Y2hUb1Byb3BzKGRpc3BhdGNoKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIFxyXG4gICAgfTtcclxufVxyXG5cclxuY2xhc3MgUHJvamVjdENvbXBvbmVudCBleHRlbmRzIENvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuXHJcbiAgICAgICAgdGhpcy5wcm9qZWN0U2VydmljZSA9IG5ldyBQcm9qZWN0U2VydmljZSgpO1xyXG5cclxuICAgICAgICB0aGlzLnN0YXRlID0ge307XHJcblxyXG4gICAgICAgIHRoaXMucHJvamVjdFNlcnZpY2UuZ2V0KHRoaXMucHJvcHMud29ya3NwYWNlX2lkLCB0aGlzLnByb3BzLnByb2plY3RfaWQpLnRoZW4ocHJvamVjdCA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5zdGF0ZSwge1xyXG4gICAgICAgICAgICAgICAgcHJvamVjdFxyXG4gICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgfSkuY2F0Y2goZSA9PiB7XHJcblxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmhhbmRsZVByb2plY3RVcGRhdGUgPSB0aGlzLmhhbmRsZVByb2plY3RVcGRhdGUuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLmhhbmRsZURlYnVnSWNvbkNsaWNrID0gdGhpcy5oYW5kbGVEZWJ1Z0ljb25DbGljay5iaW5kKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xyXG4gICAgICAgIHRoaXMucHJvamVjdC5hZGRFdmVudExpc3RlbmVyKCdzZi53b3Jrc3BhY2UucHJvamVjdC51cGRhdGUnLCB0aGlzLmhhbmRsZVByb2plY3RVcGRhdGUsIGZhbHNlKTtcclxuICAgIH1cclxuXHJcbiAgICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcclxuICAgICAgICB0aGlzLnByb2plY3QucmVtb3ZlRXZlbnRMaXN0ZW5lcignc2Yud29ya3NwYWNlLnByb2plY3QudXBkYXRlJywgdGhpcy5oYW5kbGVQcm9qZWN0VXBkYXRlLCBmYWxzZSk7XHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgaGFuZGxlUHJvamVjdFVwZGF0ZShlKSB7XHJcbiAgICAgICAgY29uc3QgeyB3b3Jrc3BhY2VfaWQsIHByb2plY3QgfSA9IGUuZGV0YWlsO1xyXG5cclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBhd2FpdCB0aGlzLnByb2plY3RTZXJ2aWNlLnB1dCh3b3Jrc3BhY2VfaWQsIHByb2plY3QucHJvamVjdF9pZCwgcHJvamVjdCk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkge1xyXG5cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlRGVidWdJY29uQ2xpY2soKSB7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IHdvcmtzcGFjZV9pZCB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCB7IHByb2plY3QgfSA9IHRoaXMuc3RhdGU7XHJcbiAgICAgICAgY29uc3QgeyB1c2VyIH0gPSBzdG9yZS5nZXRTdGF0ZSgpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicHJvamVjdC1jb250YWluZXJcIiByZWY9e3Byb2plY3QgPT4gdGhpcy5wcm9qZWN0ID0gcHJvamVjdH0+XHJcbiAgICAgICAgICAgICAgICB7IHByb2plY3QgP1xyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJlbmdpbmUtY29udGFpbmVyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPEVuZ2luZUNvbXBvbmVudCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgd29ya3NwYWNlX2lkPXt3b3Jrc3BhY2VfaWR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb2plY3Q9e3Byb2plY3R9Lz5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgOiBudWxsIH1cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufTtcclxuXHJcbmNvbnN0IFByb2plY3QgPSBjb25uZWN0KG1hcFN0YXRlVG9Qcm9wcywgbWFwRGlzcGF0Y2hUb1Byb3BzKShQcm9qZWN0Q29tcG9uZW50KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IFByb2plY3Q7IiwiXG52YXIgY29udGVudCA9IHJlcXVpcmUoXCIhIS4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzPz9yZWYtLTYtMSEuLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvbGliL2xvYWRlci5qcz8/cmVmLS02LTIhLi9wcm9qZWN0LnNjc3NcIik7XG5cbmlmKHR5cGVvZiBjb250ZW50ID09PSAnc3RyaW5nJykgY29udGVudCA9IFtbbW9kdWxlLmlkLCBjb250ZW50LCAnJ11dO1xuXG52YXIgdHJhbnNmb3JtO1xudmFyIGluc2VydEludG87XG5cblxuXG52YXIgb3B0aW9ucyA9IHtcImhtclwiOnRydWV9XG5cbm9wdGlvbnMudHJhbnNmb3JtID0gdHJhbnNmb3JtXG5vcHRpb25zLmluc2VydEludG8gPSB1bmRlZmluZWQ7XG5cbnZhciB1cGRhdGUgPSByZXF1aXJlKFwiIS4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvbGliL2FkZFN0eWxlcy5qc1wiKShjb250ZW50LCBvcHRpb25zKTtcblxuaWYoY29udGVudC5sb2NhbHMpIG1vZHVsZS5leHBvcnRzID0gY29udGVudC5sb2NhbHM7XG5cbmlmKG1vZHVsZS5ob3QpIHtcblx0bW9kdWxlLmhvdC5hY2NlcHQoXCIhIS4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzPz9yZWYtLTYtMSEuLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvbGliL2xvYWRlci5qcz8/cmVmLS02LTIhLi9wcm9qZWN0LnNjc3NcIiwgZnVuY3Rpb24oKSB7XG5cdFx0dmFyIG5ld0NvbnRlbnQgPSByZXF1aXJlKFwiISEuLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcz8/cmVmLS02LTEhLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2xpYi9sb2FkZXIuanM/P3JlZi0tNi0yIS4vcHJvamVjdC5zY3NzXCIpO1xuXG5cdFx0aWYodHlwZW9mIG5ld0NvbnRlbnQgPT09ICdzdHJpbmcnKSBuZXdDb250ZW50ID0gW1ttb2R1bGUuaWQsIG5ld0NvbnRlbnQsICcnXV07XG5cblx0XHR2YXIgbG9jYWxzID0gKGZ1bmN0aW9uKGEsIGIpIHtcblx0XHRcdHZhciBrZXksIGlkeCA9IDA7XG5cblx0XHRcdGZvcihrZXkgaW4gYSkge1xuXHRcdFx0XHRpZighYiB8fCBhW2tleV0gIT09IGJba2V5XSkgcmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRpZHgrKztcblx0XHRcdH1cblxuXHRcdFx0Zm9yKGtleSBpbiBiKSBpZHgtLTtcblxuXHRcdFx0cmV0dXJuIGlkeCA9PT0gMDtcblx0XHR9KGNvbnRlbnQubG9jYWxzLCBuZXdDb250ZW50LmxvY2FscykpO1xuXG5cdFx0aWYoIWxvY2FscykgdGhyb3cgbmV3IEVycm9yKCdBYm9ydGluZyBDU1MgSE1SIGR1ZSB0byBjaGFuZ2VkIGNzcy1tb2R1bGVzIGxvY2Fscy4nKTtcblxuXHRcdHVwZGF0ZShuZXdDb250ZW50KTtcblx0fSk7XG5cblx0bW9kdWxlLmhvdC5kaXNwb3NlKGZ1bmN0aW9uKCkgeyB1cGRhdGUoKTsgfSk7XG59Il0sInNvdXJjZVJvb3QiOiIifQ==