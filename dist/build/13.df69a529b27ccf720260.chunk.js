(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[13],{

/***/ "ZkbP":
/*!***********************************************************!*\
  !*** ./engine/src/components/project-output.component.js ***!
  \***********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ "/MKj");
/* harmony import */ var _config_redux_redux_store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../config/redux/redux.store */ "ERX6");




const mapStateToProps = state => state;

class ProjectOutputComponent extends react__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      workspace
    } = _config_redux_redux_store__WEBPACK_IMPORTED_MODULE_2__["store"].getState();
    const project = workspace.project;
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, JSON.stringify(project.items));
  }

}

const ProjectOutput = Object(react_redux__WEBPACK_IMPORTED_MODULE_1__["connect"])(mapStateToProps)(ProjectOutputComponent);
/* harmony default export */ __webpack_exports__["default"] = (ProjectOutput);

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9lbmdpbmUvc3JjL2NvbXBvbmVudHMvcHJvamVjdC1vdXRwdXQuY29tcG9uZW50LmpzIl0sIm5hbWVzIjpbIm1hcFN0YXRlVG9Qcm9wcyIsInN0YXRlIiwiUHJvamVjdE91dHB1dENvbXBvbmVudCIsIkNvbXBvbmVudCIsImNvbnN0cnVjdG9yIiwicHJvcHMiLCJyZW5kZXIiLCJ3b3Jrc3BhY2UiLCJzdG9yZSIsImdldFN0YXRlIiwicHJvamVjdCIsIkpTT04iLCJzdHJpbmdpZnkiLCJpdGVtcyIsIlByb2plY3RPdXRwdXQiLCJjb25uZWN0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTs7QUFFQSxNQUFNQSxlQUFlLEdBQUlDLEtBQUQsSUFBV0EsS0FBbkM7O0FBRUEsTUFBTUMsc0JBQU4sU0FBcUNDLCtDQUFyQyxDQUErQztBQUMzQ0MsYUFBVyxDQUFDQyxLQUFELEVBQVE7QUFDZixVQUFNQSxLQUFOO0FBRUEsU0FBS0osS0FBTCxHQUFZLEVBQVo7QUFHSDs7QUFFREssUUFBTSxHQUFHO0FBQ0wsVUFBTTtBQUFFQztBQUFGLFFBQWdCQywrREFBSyxDQUFDQyxRQUFOLEVBQXRCO0FBQ0EsVUFBTUMsT0FBTyxHQUFHSCxTQUFTLENBQUNHLE9BQTFCO0FBRUEsV0FDSSx3RUFBTUMsSUFBSSxDQUFDQyxTQUFMLENBQWVGLE9BQU8sQ0FBQ0csS0FBdkIsQ0FBTixDQURKO0FBR0g7O0FBaEIwQzs7QUFtQi9DLE1BQU1DLGFBQWEsR0FBR0MsMkRBQU8sQ0FBQ2YsZUFBRCxDQUFQLENBQXlCRSxzQkFBekIsQ0FBdEI7QUFFZVksNEVBQWYsRSIsImZpbGUiOiJidWlsZC8xMy5kZjY5YTUyOWIyN2NjZjcyMDI2MC5jaHVuay5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQgfSBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCc7XHJcbmltcG9ydCB7IHN0b3JlIH0gZnJvbSAnLi4vY29uZmlnL3JlZHV4L3JlZHV4LnN0b3JlJztcclxuXHJcbmNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9IChzdGF0ZSkgPT4gc3RhdGU7XHJcblxyXG5jbGFzcyBQcm9qZWN0T3V0cHV0Q29tcG9uZW50IGV4dGVuZHMgQ29tcG9uZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG5cclxuICAgICAgICB0aGlzLnN0YXRlID17XHJcblxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgd29ya3NwYWNlIH0gPSBzdG9yZS5nZXRTdGF0ZSgpO1xyXG4gICAgICAgIGNvbnN0IHByb2plY3QgPSB3b3Jrc3BhY2UucHJvamVjdDtcclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdj57SlNPTi5zdHJpbmdpZnkocHJvamVjdC5pdGVtcyl9PC9kaXY+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgUHJvamVjdE91dHB1dCA9IGNvbm5lY3QobWFwU3RhdGVUb1Byb3BzKShQcm9qZWN0T3V0cHV0Q29tcG9uZW50KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IFByb2plY3RPdXRwdXQ7Il0sInNvdXJjZVJvb3QiOiIifQ==