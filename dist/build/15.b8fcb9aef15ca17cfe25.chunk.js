(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[15],{

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
/* harmony import */ var _config_redux_redux_store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../config/redux/redux.store */ "O7K5");




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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9jbGllbnQvZW5naW5lL3NyYy9jb21wb25lbnRzL3Byb2plY3Qtb3V0cHV0LmNvbXBvbmVudC5qcyJdLCJuYW1lcyI6WyJtYXBTdGF0ZVRvUHJvcHMiLCJzdGF0ZSIsIlByb2plY3RPdXRwdXRDb21wb25lbnQiLCJDb21wb25lbnQiLCJjb25zdHJ1Y3RvciIsInByb3BzIiwicmVuZGVyIiwid29ya3NwYWNlIiwic3RvcmUiLCJnZXRTdGF0ZSIsInByb2plY3QiLCJKU09OIiwic3RyaW5naWZ5IiwiaXRlbXMiLCJQcm9qZWN0T3V0cHV0IiwiY29ubmVjdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7O0FBRUEsTUFBTUEsZUFBZSxHQUFJQyxLQUFELElBQVdBLEtBQW5DOztBQUVBLE1BQU1DLHNCQUFOLFNBQXFDQywrQ0FBckMsQ0FBK0M7QUFDM0NDLGFBQVcsQ0FBQ0MsS0FBRCxFQUFRO0FBQ2YsVUFBTUEsS0FBTjtBQUVBLFNBQUtKLEtBQUwsR0FBWSxFQUFaO0FBR0g7O0FBRURLLFFBQU0sR0FBRztBQUNMLFVBQU07QUFBRUM7QUFBRixRQUFnQkMsK0RBQUssQ0FBQ0MsUUFBTixFQUF0QjtBQUNBLFVBQU1DLE9BQU8sR0FBR0gsU0FBUyxDQUFDRyxPQUExQjtBQUVBLFdBQ0ksd0VBQU1DLElBQUksQ0FBQ0MsU0FBTCxDQUFlRixPQUFPLENBQUNHLEtBQXZCLENBQU4sQ0FESjtBQUdIOztBQWhCMEM7O0FBbUIvQyxNQUFNQyxhQUFhLEdBQUdDLDJEQUFPLENBQUNmLGVBQUQsQ0FBUCxDQUF5QkUsc0JBQXpCLENBQXRCO0FBRWVZLDRFQUFmLEUiLCJmaWxlIjoiYnVpbGQvMTUuYjhmY2I5YWVmMTVjYTE3Y2ZlMjUuY2h1bmsuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50IH0gZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSAncmVhY3QtcmVkdXgnO1xyXG5pbXBvcnQgeyBzdG9yZSB9IGZyb20gJy4uL2NvbmZpZy9yZWR1eC9yZWR1eC5zdG9yZSc7XHJcblxyXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSAoc3RhdGUpID0+IHN0YXRlO1xyXG5cclxuY2xhc3MgUHJvamVjdE91dHB1dENvbXBvbmVudCBleHRlbmRzIENvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuXHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9e1xyXG5cclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IHdvcmtzcGFjZSB9ID0gc3RvcmUuZ2V0U3RhdGUoKTtcclxuICAgICAgICBjb25zdCBwcm9qZWN0ID0gd29ya3NwYWNlLnByb2plY3Q7XHJcblxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXY+e0pTT04uc3RyaW5naWZ5KHByb2plY3QuaXRlbXMpfTwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IFByb2plY3RPdXRwdXQgPSBjb25uZWN0KG1hcFN0YXRlVG9Qcm9wcykoUHJvamVjdE91dHB1dENvbXBvbmVudCk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBQcm9qZWN0T3V0cHV0OyJdLCJzb3VyY2VSb290IjoiIn0=