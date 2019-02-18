(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[12],{

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
      project
    } = _config_redux_redux_store__WEBPACK_IMPORTED_MODULE_2__["store"].getState();
    const item = project[this.props.project_path];
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, JSON.stringify(item));
  }

}

const ProjectOutput = Object(react_redux__WEBPACK_IMPORTED_MODULE_1__["connect"])(mapStateToProps)(ProjectOutputComponent);
/* harmony default export */ __webpack_exports__["default"] = (ProjectOutput);

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9lbmdpbmUvc3JjL2NvbXBvbmVudHMvcHJvamVjdC1vdXRwdXQuY29tcG9uZW50LmpzIl0sIm5hbWVzIjpbIm1hcFN0YXRlVG9Qcm9wcyIsInN0YXRlIiwiUHJvamVjdE91dHB1dENvbXBvbmVudCIsIkNvbXBvbmVudCIsImNvbnN0cnVjdG9yIiwicHJvcHMiLCJyZW5kZXIiLCJwcm9qZWN0Iiwic3RvcmUiLCJnZXRTdGF0ZSIsIml0ZW0iLCJwcm9qZWN0X3BhdGgiLCJKU09OIiwic3RyaW5naWZ5IiwiUHJvamVjdE91dHB1dCIsImNvbm5lY3QiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBOztBQUVBLE1BQU1BLGVBQWUsR0FBSUMsS0FBRCxJQUFXQSxLQUFuQzs7QUFFQSxNQUFNQyxzQkFBTixTQUFxQ0MsK0NBQXJDLENBQStDO0FBQzNDQyxhQUFXLENBQUNDLEtBQUQsRUFBUTtBQUNmLFVBQU1BLEtBQU47QUFFQSxTQUFLSixLQUFMLEdBQVksRUFBWjtBQUdIOztBQUVESyxRQUFNLEdBQUc7QUFDTCxVQUFNO0FBQUVDO0FBQUYsUUFBY0MsK0RBQUssQ0FBQ0MsUUFBTixFQUFwQjtBQUNBLFVBQU1DLElBQUksR0FBR0gsT0FBTyxDQUFDLEtBQUtGLEtBQUwsQ0FBV00sWUFBWixDQUFwQjtBQUVBLFdBQ0ksd0VBQU1DLElBQUksQ0FBQ0MsU0FBTCxDQUFlSCxJQUFmLENBQU4sQ0FESjtBQUdIOztBQWhCMEM7O0FBbUIvQyxNQUFNSSxhQUFhLEdBQUdDLDJEQUFPLENBQUNmLGVBQUQsQ0FBUCxDQUF5QkUsc0JBQXpCLENBQXRCO0FBRWVZLDRFQUFmLEUiLCJmaWxlIjoiYnVpbGQvMTIuZGNlNDYxODQ3ZmY2NmZhZjc5YTguY2h1bmsuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50IH0gZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSAncmVhY3QtcmVkdXgnO1xyXG5pbXBvcnQgeyBzdG9yZSB9IGZyb20gJy4uL2NvbmZpZy9yZWR1eC9yZWR1eC5zdG9yZSc7XHJcblxyXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSAoc3RhdGUpID0+IHN0YXRlO1xyXG5cclxuY2xhc3MgUHJvamVjdE91dHB1dENvbXBvbmVudCBleHRlbmRzIENvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuXHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9e1xyXG5cclxuICAgICAgICB9O1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyBwcm9qZWN0IH0gPSBzdG9yZS5nZXRTdGF0ZSgpO1xyXG4gICAgICAgIGNvbnN0IGl0ZW0gPSBwcm9qZWN0W3RoaXMucHJvcHMucHJvamVjdF9wYXRoXTtcclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdj57SlNPTi5zdHJpbmdpZnkoaXRlbSl9PC9kaXY+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgUHJvamVjdE91dHB1dCA9IGNvbm5lY3QobWFwU3RhdGVUb1Byb3BzKShQcm9qZWN0T3V0cHV0Q29tcG9uZW50KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IFByb2plY3RPdXRwdXQ7Il0sInNvdXJjZVJvb3QiOiIifQ==