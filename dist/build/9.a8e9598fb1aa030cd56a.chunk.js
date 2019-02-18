(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[9],{

/***/ "pRYs":
/*!*******************************************************!*\
  !*** ./engine/src/components/add/header.component.js ***!
  \*******************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ "/MKj");
/* harmony import */ var _config_redux_redux_store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../config/redux/redux.store */ "ERX6");




const mapStateToProps = state => state;

class HeaderComponent extends react__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  constructor(props) {
    super(props);
    this.state = {
      headerText: '',
      inputClassName: 'g-border-color'
    };
    this.handleHeaderTextChange = this.handleHeaderTextChange.bind(this);
  }

  handleHeaderTextChange(e) {
    var inputClassName = 'g-border-color';

    if (e.target.value && e.target.value.length) {
      inputClassName += ' g-valid';
    }

    this.setState(Object.assign({}, this.state, {
      inputClassName: inputClassName,
      headerText: e.target.value
    }));
  }

  render() {
    const {
      inputClassName
    } = this.state;
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "input-component"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
      className: inputClassName,
      type: "text",
      value: this.state.headerText,
      onChange: this.handleHeaderTextChange
    }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
      className: "g-login-form-input-placeholder"
    }, "Header Text"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "g-errors-list"
    }));
  }

}

const Header = Object(react_redux__WEBPACK_IMPORTED_MODULE_1__["connect"])(mapStateToProps)(HeaderComponent);
/* harmony default export */ __webpack_exports__["default"] = (Header);

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9lbmdpbmUvc3JjL2NvbXBvbmVudHMvYWRkL2hlYWRlci5jb21wb25lbnQuanMiXSwibmFtZXMiOlsibWFwU3RhdGVUb1Byb3BzIiwic3RhdGUiLCJIZWFkZXJDb21wb25lbnQiLCJDb21wb25lbnQiLCJjb25zdHJ1Y3RvciIsInByb3BzIiwiaGVhZGVyVGV4dCIsImlucHV0Q2xhc3NOYW1lIiwiaGFuZGxlSGVhZGVyVGV4dENoYW5nZSIsImJpbmQiLCJlIiwidGFyZ2V0IiwidmFsdWUiLCJsZW5ndGgiLCJzZXRTdGF0ZSIsIk9iamVjdCIsImFzc2lnbiIsInJlbmRlciIsIkhlYWRlciIsImNvbm5lY3QiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBOztBQUVBLE1BQU1BLGVBQWUsR0FBSUMsS0FBRCxJQUFXQSxLQUFuQzs7QUFFQSxNQUFNQyxlQUFOLFNBQThCQywrQ0FBOUIsQ0FBd0M7QUFDcENDLGFBQVcsQ0FBQ0MsS0FBRCxFQUFRO0FBQ2YsVUFBTUEsS0FBTjtBQUVBLFNBQUtKLEtBQUwsR0FBYTtBQUNUSyxnQkFBVSxFQUFFLEVBREg7QUFFVEMsb0JBQWMsRUFBRTtBQUZQLEtBQWI7QUFLQSxTQUFLQyxzQkFBTCxHQUE4QixLQUFLQSxzQkFBTCxDQUE0QkMsSUFBNUIsQ0FBaUMsSUFBakMsQ0FBOUI7QUFDSDs7QUFFREQsd0JBQXNCLENBQUNFLENBQUQsRUFBSTtBQUN0QixRQUFJSCxjQUFjLEdBQUcsZ0JBQXJCOztBQUNBLFFBQUlHLENBQUMsQ0FBQ0MsTUFBRixDQUFTQyxLQUFULElBQWtCRixDQUFDLENBQUNDLE1BQUYsQ0FBU0MsS0FBVCxDQUFlQyxNQUFyQyxFQUE2QztBQUN6Q04sb0JBQWMsSUFBSSxVQUFsQjtBQUNIOztBQUNELFNBQUtPLFFBQUwsQ0FBY0MsTUFBTSxDQUFDQyxNQUFQLENBQWMsRUFBZCxFQUFrQixLQUFLZixLQUF2QixFQUE4QjtBQUN4Q00sb0JBQWMsRUFBRUEsY0FEd0I7QUFFeENELGdCQUFVLEVBQUVJLENBQUMsQ0FBQ0MsTUFBRixDQUFTQztBQUZtQixLQUE5QixDQUFkO0FBSUg7O0FBRURLLFFBQU0sR0FBRztBQUNMLFVBQU07QUFBRVY7QUFBRixRQUFxQixLQUFLTixLQUFoQztBQUNBLFdBQ0k7QUFBSyxlQUFTLEVBQUM7QUFBZixPQUNJO0FBQU8sZUFBUyxFQUFFTSxjQUFsQjtBQUFrQyxVQUFJLEVBQUMsTUFBdkM7QUFBOEMsV0FBSyxFQUFFLEtBQUtOLEtBQUwsQ0FBV0ssVUFBaEU7QUFBNEUsY0FBUSxFQUFFLEtBQUtFO0FBQTNGLE1BREosRUFFSTtBQUFNLGVBQVMsRUFBQztBQUFoQixxQkFGSixFQUdJO0FBQUssZUFBUyxFQUFDO0FBQWYsTUFISixDQURKO0FBU0g7O0FBbENtQzs7QUFxQ3hDLE1BQU1VLE1BQU0sR0FBR0MsMkRBQU8sQ0FBQ25CLGVBQUQsQ0FBUCxDQUF5QkUsZUFBekIsQ0FBZjtBQUNlZ0IscUVBQWYsRSIsImZpbGUiOiJidWlsZC85LmE4ZTk1OThmYjFhYTAzMGNkNTZhLmNodW5rLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IENvbXBvbmVudCB9IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gJ3JlYWN0LXJlZHV4JztcclxuaW1wb3J0IHsgc3RvcmUgfSBmcm9tICcuLi8uLi9jb25maWcvcmVkdXgvcmVkdXguc3RvcmUnO1xyXG5cclxuY29uc3QgbWFwU3RhdGVUb1Byb3BzID0gKHN0YXRlKSA9PiBzdGF0ZTtcclxuXHJcbmNsYXNzIEhlYWRlckNvbXBvbmVudCBleHRlbmRzIENvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuXHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcclxuICAgICAgICAgICAgaGVhZGVyVGV4dDogJycsXHJcbiAgICAgICAgICAgIGlucHV0Q2xhc3NOYW1lOiAnZy1ib3JkZXItY29sb3InXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5oYW5kbGVIZWFkZXJUZXh0Q2hhbmdlID0gdGhpcy5oYW5kbGVIZWFkZXJUZXh0Q2hhbmdlLmJpbmQodGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlSGVhZGVyVGV4dENoYW5nZShlKSB7XHJcbiAgICAgICAgdmFyIGlucHV0Q2xhc3NOYW1lID0gJ2ctYm9yZGVyLWNvbG9yJ1xyXG4gICAgICAgIGlmIChlLnRhcmdldC52YWx1ZSAmJiBlLnRhcmdldC52YWx1ZS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgaW5wdXRDbGFzc05hbWUgKz0gJyBnLXZhbGlkJztcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZShPYmplY3QuYXNzaWduKHt9LCB0aGlzLnN0YXRlLCB7XHJcbiAgICAgICAgICAgIGlucHV0Q2xhc3NOYW1lOiBpbnB1dENsYXNzTmFtZSxcclxuICAgICAgICAgICAgaGVhZGVyVGV4dDogZS50YXJnZXQudmFsdWVcclxuICAgICAgICB9KSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgaW5wdXRDbGFzc05hbWUgfSA9IHRoaXMuc3RhdGU7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJpbnB1dC1jb21wb25lbnRcIj5cclxuICAgICAgICAgICAgICAgIDxpbnB1dCBjbGFzc05hbWU9e2lucHV0Q2xhc3NOYW1lfSB0eXBlPVwidGV4dFwiIHZhbHVlPXt0aGlzLnN0YXRlLmhlYWRlclRleHR9IG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUhlYWRlclRleHRDaGFuZ2V9IC8+XHJcbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnLWxvZ2luLWZvcm0taW5wdXQtcGxhY2Vob2xkZXJcIj5IZWFkZXIgVGV4dDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZy1lcnJvcnMtbGlzdFwiPlxyXG5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBIZWFkZXIgPSBjb25uZWN0KG1hcFN0YXRlVG9Qcm9wcykoSGVhZGVyQ29tcG9uZW50KTtcclxuZXhwb3J0IGRlZmF1bHQgSGVhZGVyOyJdLCJzb3VyY2VSb290IjoiIn0=