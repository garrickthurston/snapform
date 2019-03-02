(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[14],{

/***/ "nuF1":
/*!******************************************************************!*\
  !*** ./client/engine/src/components/project-output.component.js ***!
  \******************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ "/MKj");
/* harmony import */ var _common_config_redux_redux_store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../common/config/redux/redux.store */ "p6Ez");




const mapStateToProps = state => state;

class ProjectOutputComponent extends react__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      workspace
    } = _common_config_redux_redux_store__WEBPACK_IMPORTED_MODULE_2__["store"].getState().engineReducer;
    const project = workspace.project;
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, JSON.stringify(project.items));
  }

}

const ProjectOutput = Object(react_redux__WEBPACK_IMPORTED_MODULE_1__["connect"])(mapStateToProps)(ProjectOutputComponent);
/* harmony default export */ __webpack_exports__["default"] = (ProjectOutput);

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9jbGllbnQvZW5naW5lL3NyYy9jb21wb25lbnRzL3Byb2plY3Qtb3V0cHV0LmNvbXBvbmVudC5qcyJdLCJuYW1lcyI6WyJtYXBTdGF0ZVRvUHJvcHMiLCJzdGF0ZSIsIlByb2plY3RPdXRwdXRDb21wb25lbnQiLCJDb21wb25lbnQiLCJjb25zdHJ1Y3RvciIsInByb3BzIiwicmVuZGVyIiwid29ya3NwYWNlIiwic3RvcmUiLCJnZXRTdGF0ZSIsImVuZ2luZVJlZHVjZXIiLCJwcm9qZWN0IiwiSlNPTiIsInN0cmluZ2lmeSIsIml0ZW1zIiwiUHJvamVjdE91dHB1dCIsImNvbm5lY3QiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBOztBQUVBLE1BQU1BLGVBQWUsR0FBSUMsS0FBRCxJQUFXQSxLQUFuQzs7QUFFQSxNQUFNQyxzQkFBTixTQUFxQ0MsK0NBQXJDLENBQStDO0FBQzNDQyxhQUFXLENBQUNDLEtBQUQsRUFBUTtBQUNmLFVBQU1BLEtBQU47QUFFQSxTQUFLSixLQUFMLEdBQVksRUFBWjtBQUdIOztBQUVESyxRQUFNLEdBQUc7QUFDTCxVQUFNO0FBQUVDO0FBQUYsUUFBZ0JDLHNFQUFLLENBQUNDLFFBQU4sR0FBaUJDLGFBQXZDO0FBQ0EsVUFBTUMsT0FBTyxHQUFHSixTQUFTLENBQUNJLE9BQTFCO0FBRUEsV0FDSSx3RUFBTUMsSUFBSSxDQUFDQyxTQUFMLENBQWVGLE9BQU8sQ0FBQ0csS0FBdkIsQ0FBTixDQURKO0FBR0g7O0FBaEIwQzs7QUFtQi9DLE1BQU1DLGFBQWEsR0FBR0MsMkRBQU8sQ0FBQ2hCLGVBQUQsQ0FBUCxDQUF5QkUsc0JBQXpCLENBQXRCO0FBRWVhLDRFQUFmLEUiLCJmaWxlIjoiYnVpbGQvMTQuZjc4MTc4Njc5YWYwY2MxMWEzYzkuY2h1bmsuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50IH0gZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSAncmVhY3QtcmVkdXgnO1xyXG5pbXBvcnQgeyBzdG9yZSB9IGZyb20gJy4uLy4uLy4uL2NvbW1vbi9jb25maWcvcmVkdXgvcmVkdXguc3RvcmUnO1xyXG5cclxuY29uc3QgbWFwU3RhdGVUb1Byb3BzID0gKHN0YXRlKSA9PiBzdGF0ZTtcclxuXHJcbmNsYXNzIFByb2plY3RPdXRwdXRDb21wb25lbnQgZXh0ZW5kcyBDb21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcblxyXG4gICAgICAgIHRoaXMuc3RhdGUgPXtcclxuXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyB3b3Jrc3BhY2UgfSA9IHN0b3JlLmdldFN0YXRlKCkuZW5naW5lUmVkdWNlcjtcclxuICAgICAgICBjb25zdCBwcm9qZWN0ID0gd29ya3NwYWNlLnByb2plY3Q7XHJcblxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXY+e0pTT04uc3RyaW5naWZ5KHByb2plY3QuaXRlbXMpfTwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IFByb2plY3RPdXRwdXQgPSBjb25uZWN0KG1hcFN0YXRlVG9Qcm9wcykoUHJvamVjdE91dHB1dENvbXBvbmVudCk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBQcm9qZWN0T3V0cHV0OyJdLCJzb3VyY2VSb290IjoiIn0=