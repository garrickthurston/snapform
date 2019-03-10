(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[15],{

/***/ "PtyG":
/*!************************************************************!*\
  !*** ./client/engine/src/components/add/text.component.js ***!
  \************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ "/MKj");
/* harmony import */ var _config_redux_redux_store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../config/redux/redux.store */ "O7K5");
/* harmony import */ var _config_redux_redux_actions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../config/redux/redux.actions */ "nymR");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }






const mapStateToProps = state => state;

const mapDispatchToProps = dispatch => {
  return {
    updateProjectConfig: payload => dispatch(Object(_config_redux_redux_actions__WEBPACK_IMPORTED_MODULE_3__["updateProjectConfig"])(payload))
  };
};

class TextComponent extends react__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  constructor(props) {
    super(props);

    _defineProperty(this, "defaultClassName", 'g-border-color');

    this.state = {
      inputFieldName: '',
      inputClassName: this.defaultClassName
    };
    this.handleInputFieldNameChanged = this.handleInputFieldNameChanged.bind(this);
  }

  handleInputFieldNameChanged(e) {
    this.setState(Object.assign({}, this.state, {
      inputFieldName: e.target.value,
      inputClassName: this.defaultClassName + (e.target.value && e.target.value.length ? ' g-valid' : '')
    }));
    const {
      workspace
    } = _config_redux_redux_store__WEBPACK_IMPORTED_MODULE_2__["store"].getState();
    this.props.updateProjectConfig(Object.assign({}, workspace.project.config, {
      ui: Object.assign({}, workspace.project.config.ui, {
        add: Object.assign({}, workspace.project.config.ui.add, {
          value: e.target.value
        })
      })
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
      value: this.state.inputFieldName,
      onChange: this.handleInputFieldNameChanged
    }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
      className: "g-login-form-input-placeholder"
    }, "Field Name"));
  }

}

const Text = Object(react_redux__WEBPACK_IMPORTED_MODULE_1__["connect"])(mapStateToProps, mapDispatchToProps)(TextComponent);
/* harmony default export */ __webpack_exports__["default"] = (Text);

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9jbGllbnQvZW5naW5lL3NyYy9jb21wb25lbnRzL2FkZC90ZXh0LmNvbXBvbmVudC5qcyJdLCJuYW1lcyI6WyJtYXBTdGF0ZVRvUHJvcHMiLCJzdGF0ZSIsIm1hcERpc3BhdGNoVG9Qcm9wcyIsImRpc3BhdGNoIiwidXBkYXRlUHJvamVjdENvbmZpZyIsInBheWxvYWQiLCJUZXh0Q29tcG9uZW50IiwiQ29tcG9uZW50IiwiY29uc3RydWN0b3IiLCJwcm9wcyIsImlucHV0RmllbGROYW1lIiwiaW5wdXRDbGFzc05hbWUiLCJkZWZhdWx0Q2xhc3NOYW1lIiwiaGFuZGxlSW5wdXRGaWVsZE5hbWVDaGFuZ2VkIiwiYmluZCIsImUiLCJzZXRTdGF0ZSIsIk9iamVjdCIsImFzc2lnbiIsInRhcmdldCIsInZhbHVlIiwibGVuZ3RoIiwid29ya3NwYWNlIiwic3RvcmUiLCJnZXRTdGF0ZSIsInByb2plY3QiLCJjb25maWciLCJ1aSIsImFkZCIsInJlbmRlciIsIlRleHQiLCJjb25uZWN0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxNQUFNQSxlQUFlLEdBQUlDLEtBQUQsSUFBV0EsS0FBbkM7O0FBQ0EsTUFBTUMsa0JBQWtCLEdBQUlDLFFBQUQsSUFBYztBQUNyQyxTQUFPO0FBQ0hDLHVCQUFtQixFQUFFQyxPQUFPLElBQUlGLFFBQVEsQ0FBQ0MsdUZBQW1CLENBQUNDLE9BQUQsQ0FBcEI7QUFEckMsR0FBUDtBQUdILENBSkQ7O0FBTUEsTUFBTUMsYUFBTixTQUE0QkMsK0NBQTVCLENBQXNDO0FBR2xDQyxhQUFXLENBQUNDLEtBQUQsRUFBUTtBQUNmLFVBQU1BLEtBQU47O0FBRGUsOENBRkEsZ0JBRUE7O0FBR2YsU0FBS1IsS0FBTCxHQUFhO0FBQ1RTLG9CQUFjLEVBQUUsRUFEUDtBQUVUQyxvQkFBYyxFQUFFLEtBQUtDO0FBRlosS0FBYjtBQUtBLFNBQUtDLDJCQUFMLEdBQW1DLEtBQUtBLDJCQUFMLENBQWlDQyxJQUFqQyxDQUFzQyxJQUF0QyxDQUFuQztBQUNIOztBQUVERCw2QkFBMkIsQ0FBQ0UsQ0FBRCxFQUFJO0FBQzNCLFNBQUtDLFFBQUwsQ0FBY0MsTUFBTSxDQUFDQyxNQUFQLENBQWMsRUFBZCxFQUFrQixLQUFLakIsS0FBdkIsRUFBOEI7QUFDeENTLG9CQUFjLEVBQUVLLENBQUMsQ0FBQ0ksTUFBRixDQUFTQyxLQURlO0FBRXhDVCxvQkFBYyxFQUFFLEtBQUtDLGdCQUFMLElBQXlCRyxDQUFDLENBQUNJLE1BQUYsQ0FBU0MsS0FBVCxJQUFrQkwsQ0FBQyxDQUFDSSxNQUFGLENBQVNDLEtBQVQsQ0FBZUMsTUFBakMsR0FBMEMsVUFBMUMsR0FBdUQsRUFBaEY7QUFGd0IsS0FBOUIsQ0FBZDtBQUtBLFVBQU07QUFBRUM7QUFBRixRQUFnQkMsK0RBQUssQ0FBQ0MsUUFBTixFQUF0QjtBQUNBLFNBQUtmLEtBQUwsQ0FBV0wsbUJBQVgsQ0FBK0JhLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjLEVBQWQsRUFBa0JJLFNBQVMsQ0FBQ0csT0FBVixDQUFrQkMsTUFBcEMsRUFBNEM7QUFDdkVDLFFBQUUsRUFBRVYsTUFBTSxDQUFDQyxNQUFQLENBQWMsRUFBZCxFQUFrQkksU0FBUyxDQUFDRyxPQUFWLENBQWtCQyxNQUFsQixDQUF5QkMsRUFBM0MsRUFBK0M7QUFDL0NDLFdBQUcsRUFBRVgsTUFBTSxDQUFDQyxNQUFQLENBQWMsRUFBZCxFQUFrQkksU0FBUyxDQUFDRyxPQUFWLENBQWtCQyxNQUFsQixDQUF5QkMsRUFBekIsQ0FBNEJDLEdBQTlDLEVBQW1EO0FBQ3BEUixlQUFLLEVBQUVMLENBQUMsQ0FBQ0ksTUFBRixDQUFTQztBQURvQyxTQUFuRDtBQUQwQyxPQUEvQztBQURtRSxLQUE1QyxDQUEvQjtBQU9IOztBQUVEUyxRQUFNLEdBQUc7QUFDTCxVQUFNO0FBQUVsQjtBQUFGLFFBQXFCLEtBQUtWLEtBQWhDO0FBRUEsV0FDSTtBQUFLLGVBQVMsRUFBQztBQUFmLE9BQ0k7QUFBTyxlQUFTLEVBQUVVLGNBQWxCO0FBQWtDLFVBQUksRUFBQyxNQUF2QztBQUE4QyxXQUFLLEVBQUUsS0FBS1YsS0FBTCxDQUFXUyxjQUFoRTtBQUFnRixjQUFRLEVBQUUsS0FBS0c7QUFBL0YsTUFESixFQUVJO0FBQU0sZUFBUyxFQUFDO0FBQWhCLG9CQUZKLENBREo7QUFNSDs7QUF2Q2lDOztBQTBDdEMsTUFBTWlCLElBQUksR0FBR0MsMkRBQU8sQ0FBQy9CLGVBQUQsRUFBa0JFLGtCQUFsQixDQUFQLENBQTZDSSxhQUE3QyxDQUFiO0FBRWV3QixtRUFBZixFIiwiZmlsZSI6ImJ1aWxkLzE1LjBjODMwMTBiZmRiZWZmOWMwNzAzLmNodW5rLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IENvbXBvbmVudCB9IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gJ3JlYWN0LXJlZHV4JztcclxuaW1wb3J0IHsgc3RvcmUgfSBmcm9tICcuLi8uLi9jb25maWcvcmVkdXgvcmVkdXguc3RvcmUnO1xyXG5pbXBvcnQgeyB1cGRhdGVQcm9qZWN0Q29uZmlnIH0gZnJvbSAnLi4vLi4vY29uZmlnL3JlZHV4L3JlZHV4LmFjdGlvbnMnO1xyXG5cclxuY29uc3QgbWFwU3RhdGVUb1Byb3BzID0gKHN0YXRlKSA9PiBzdGF0ZTtcclxuY29uc3QgbWFwRGlzcGF0Y2hUb1Byb3BzID0gKGRpc3BhdGNoKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHVwZGF0ZVByb2plY3RDb25maWc6IHBheWxvYWQgPT4gZGlzcGF0Y2godXBkYXRlUHJvamVjdENvbmZpZyhwYXlsb2FkKSlcclxuICAgIH07XHJcbn07XHJcblxyXG5jbGFzcyBUZXh0Q29tcG9uZW50IGV4dGVuZHMgQ29tcG9uZW50IHtcclxuICAgIGRlZmF1bHRDbGFzc05hbWUgPSAnZy1ib3JkZXItY29sb3InO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG5cclxuICAgICAgICB0aGlzLnN0YXRlID0ge1xyXG4gICAgICAgICAgICBpbnB1dEZpZWxkTmFtZTogJycsXHJcbiAgICAgICAgICAgIGlucHV0Q2xhc3NOYW1lOiB0aGlzLmRlZmF1bHRDbGFzc05hbWVcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmhhbmRsZUlucHV0RmllbGROYW1lQ2hhbmdlZCA9IHRoaXMuaGFuZGxlSW5wdXRGaWVsZE5hbWVDaGFuZ2VkLmJpbmQodGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlSW5wdXRGaWVsZE5hbWVDaGFuZ2VkKGUpIHtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKE9iamVjdC5hc3NpZ24oe30sIHRoaXMuc3RhdGUsIHtcclxuICAgICAgICAgICAgaW5wdXRGaWVsZE5hbWU6IGUudGFyZ2V0LnZhbHVlLFxyXG4gICAgICAgICAgICBpbnB1dENsYXNzTmFtZTogdGhpcy5kZWZhdWx0Q2xhc3NOYW1lICsgKGUudGFyZ2V0LnZhbHVlICYmIGUudGFyZ2V0LnZhbHVlLmxlbmd0aCA/ICcgZy12YWxpZCcgOiAnJylcclxuICAgICAgICB9KSk7XHJcblxyXG4gICAgICAgIGNvbnN0IHsgd29ya3NwYWNlIH0gPSBzdG9yZS5nZXRTdGF0ZSgpO1xyXG4gICAgICAgIHRoaXMucHJvcHMudXBkYXRlUHJvamVjdENvbmZpZyhPYmplY3QuYXNzaWduKHt9LCB3b3Jrc3BhY2UucHJvamVjdC5jb25maWcsIHtcclxuICAgICAgICAgICAgdWk6IE9iamVjdC5hc3NpZ24oe30sIHdvcmtzcGFjZS5wcm9qZWN0LmNvbmZpZy51aSwge1xyXG4gICAgICAgICAgICAgICAgYWRkOiBPYmplY3QuYXNzaWduKHt9LCB3b3Jrc3BhY2UucHJvamVjdC5jb25maWcudWkuYWRkLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGUudGFyZ2V0LnZhbHVlXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0pKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyBpbnB1dENsYXNzTmFtZSB9ID0gdGhpcy5zdGF0ZTtcclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJpbnB1dC1jb21wb25lbnRcIj5cclxuICAgICAgICAgICAgICAgIDxpbnB1dCBjbGFzc05hbWU9e2lucHV0Q2xhc3NOYW1lfSB0eXBlPVwidGV4dFwiIHZhbHVlPXt0aGlzLnN0YXRlLmlucHV0RmllbGROYW1lfSBvbkNoYW5nZT17dGhpcy5oYW5kbGVJbnB1dEZpZWxkTmFtZUNoYW5nZWR9IC8+XHJcbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnLWxvZ2luLWZvcm0taW5wdXQtcGxhY2Vob2xkZXJcIj5GaWVsZCBOYW1lPC9zcGFuPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBUZXh0ID0gY29ubmVjdChtYXBTdGF0ZVRvUHJvcHMsIG1hcERpc3BhdGNoVG9Qcm9wcykoVGV4dENvbXBvbmVudCk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBUZXh0OyJdLCJzb3VyY2VSb290IjoiIn0=