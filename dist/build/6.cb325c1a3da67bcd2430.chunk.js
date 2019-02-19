(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[6],{

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
/* harmony import */ var _config_redux_redux_actions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../config/redux/redux.actions */ "ifEJ");
/* harmony import */ var _header_size_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./header-size.component */ "y9HF");






const mapStateToProps = state => state;

const mapDispatchToProps = dispatch => {
  return {
    addInputValueChanged: payload => dispatch(Object(_config_redux_redux_actions__WEBPACK_IMPORTED_MODULE_3__["addInputValueChanged"])(payload))
  };
};

class HeaderComponent extends react__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  constructor(props) {
    super(props);
    this.state = {
      headerText: '',
      inputClassName: 'g-border-color',
      dropdownClassName: 'btn dropdown-toggle shadow-none',
      headerSizes: ['h6', 'h5', 'h4', 'h3', 'h2', 'h1']
    };
    this.handleHeaderTextChange = this.handleHeaderTextChange.bind(this);
  }

  handleHeaderTextChange(e) {
    var inputClassName = 'g-border-color';
    var dropdownClassName = 'btn dropdown-toggle shadow-none';

    if (e.target.value && e.target.value.length) {
      inputClassName += ' g-valid';
      dropdownClassName += ' g-valid';
    }

    this.setState(Object.assign({}, this.state, {
      inputClassName: inputClassName,
      dropdownClassName: dropdownClassName,
      headerText: e.target.value
    }));
    this.props.addInputValueChanged(e.target.value);
  }

  render() {
    const {
      inputClassName,
      dropdownClassName,
      headerSizes
    } = this.state;
    const {
      workspace
    } = _config_redux_redux_store__WEBPACK_IMPORTED_MODULE_2__["store"].getState();
    const project = workspace.project;
    var headerSize = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h6", null, this.state.headerText);

    if (project.add.addInputTag) {
      switch (project.add.addInputTag) {
        case 'h1':
          headerSize = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h1", null, this.state.headerText);
          break;

        case 'h2':
          headerSize = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h2", null, this.state.headerText);
          break;

        case 'h3':
          headerSize = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h3", null, this.state.headerText);
          break;

        case 'h4':
          headerSize = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h4", null, this.state.headerText);
          break;

        case 'h5':
          headerSize = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h5", null, this.state.headerText);
          break;

        case 'h6':
          headerSize = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h6", null, this.state.headerText);
          break;
      }
    }

    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "input-component"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
      className: inputClassName,
      type: "text",
      value: this.state.headerText,
      onChange: this.handleHeaderTextChange
    }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
      className: "g-login-form-input-placeholder"
    }, "Header Text")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: this.state.headerText && this.state.headerText.length ? 'input-component show-dropdown' : 'input-component hide-dropdown'
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "dropdown"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
      className: dropdownClassName,
      type: "button",
      "data-toggle": "dropdown",
      "aria-haspopup": "true",
      "aria-expanded": "false"
    }, headerSize), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", null, "Header Size"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "dropdown-menu"
    }, headerSizes.map((header, i) => {
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_header_size_component__WEBPACK_IMPORTED_MODULE_4__["default"], {
        key: header,
        headerKey: header,
        headerText: this.state.headerText
      });
    })))));
  }

}

const Header = Object(react_redux__WEBPACK_IMPORTED_MODULE_1__["connect"])(mapStateToProps, mapDispatchToProps)(HeaderComponent);
/* harmony default export */ __webpack_exports__["default"] = (Header);

/***/ }),

/***/ "y9HF":
/*!************************************************************!*\
  !*** ./engine/src/components/add/header-size.component.js ***!
  \************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ "/MKj");
/* harmony import */ var _config_redux_redux_store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../config/redux/redux.store */ "ERX6");
/* harmony import */ var _config_redux_redux_actions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../config/redux/redux.actions */ "ifEJ");





const mapStateToProps = state => state;

const mapDispatchToProps = dispatch => {
  return {
    addInputTagChanged: payload => dispatch(Object(_config_redux_redux_actions__WEBPACK_IMPORTED_MODULE_3__["addInputTagChanged"])(payload))
  };
};

class HeaderSizeComponent extends react__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleHeaderSizeClick = this.handleHeaderSizeClick.bind(this);
  }

  handleHeaderSizeClick() {
    this.props.addInputTagChanged(this.props.headerKey);
  }

  render() {
    const {
      workspace
    } = _config_redux_redux_store__WEBPACK_IMPORTED_MODULE_2__["store"].getState();
    const project = workspace.project;
    var headerSize = null;

    switch (this.props.headerKey) {
      case 'h1':
        headerSize = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h1", null, project.add.addInputValue);
        break;

      case 'h2':
        headerSize = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h2", null, project.add.addInputValue);
        break;

      case 'h3':
        headerSize = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h3", null, project.add.addInputValue);
        break;

      case 'h4':
        headerSize = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h4", null, project.add.addInputValue);
        break;

      case 'h5':
        headerSize = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h5", null, project.add.addInputValue);
        break;

      case 'h6':
        headerSize = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h6", null, project.add.addInputValue);
        break;
    }

    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
      className: "dropdown-item",
      onClick: this.handleHeaderSizeClick
    }, headerSize);
  }

}

const HeaderSize = Object(react_redux__WEBPACK_IMPORTED_MODULE_1__["connect"])(mapStateToProps, mapDispatchToProps)(HeaderSizeComponent);
/* harmony default export */ __webpack_exports__["default"] = (HeaderSize);

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9lbmdpbmUvc3JjL2NvbXBvbmVudHMvYWRkL2hlYWRlci5jb21wb25lbnQuanMiLCJ3ZWJwYWNrOi8vLy4vZW5naW5lL3NyYy9jb21wb25lbnRzL2FkZC9oZWFkZXItc2l6ZS5jb21wb25lbnQuanMiXSwibmFtZXMiOlsibWFwU3RhdGVUb1Byb3BzIiwic3RhdGUiLCJtYXBEaXNwYXRjaFRvUHJvcHMiLCJkaXNwYXRjaCIsImFkZElucHV0VmFsdWVDaGFuZ2VkIiwicGF5bG9hZCIsIkhlYWRlckNvbXBvbmVudCIsIkNvbXBvbmVudCIsImNvbnN0cnVjdG9yIiwicHJvcHMiLCJoZWFkZXJUZXh0IiwiaW5wdXRDbGFzc05hbWUiLCJkcm9wZG93bkNsYXNzTmFtZSIsImhlYWRlclNpemVzIiwiaGFuZGxlSGVhZGVyVGV4dENoYW5nZSIsImJpbmQiLCJlIiwidGFyZ2V0IiwidmFsdWUiLCJsZW5ndGgiLCJzZXRTdGF0ZSIsIk9iamVjdCIsImFzc2lnbiIsInJlbmRlciIsIndvcmtzcGFjZSIsInN0b3JlIiwiZ2V0U3RhdGUiLCJwcm9qZWN0IiwiaGVhZGVyU2l6ZSIsImFkZCIsImFkZElucHV0VGFnIiwibWFwIiwiaGVhZGVyIiwiaSIsIkhlYWRlciIsImNvbm5lY3QiLCJhZGRJbnB1dFRhZ0NoYW5nZWQiLCJIZWFkZXJTaXplQ29tcG9uZW50IiwiaGFuZGxlSGVhZGVyU2l6ZUNsaWNrIiwiaGVhZGVyS2V5IiwiYWRkSW5wdXRWYWx1ZSIsIkhlYWRlclNpemUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7O0FBRUEsTUFBTUEsZUFBZSxHQUFJQyxLQUFELElBQVdBLEtBQW5DOztBQUVBLE1BQU1DLGtCQUFrQixHQUFJQyxRQUFELElBQWM7QUFDckMsU0FBTztBQUNIQyx3QkFBb0IsRUFBRUMsT0FBTyxJQUFJRixRQUFRLENBQUNDLHdGQUFvQixDQUFDQyxPQUFELENBQXJCO0FBRHRDLEdBQVA7QUFHSCxDQUpEOztBQU1BLE1BQU1DLGVBQU4sU0FBOEJDLCtDQUE5QixDQUF3QztBQUNwQ0MsYUFBVyxDQUFDQyxLQUFELEVBQVE7QUFDZixVQUFNQSxLQUFOO0FBRUEsU0FBS1IsS0FBTCxHQUFhO0FBQ1RTLGdCQUFVLEVBQUUsRUFESDtBQUVUQyxvQkFBYyxFQUFFLGdCQUZQO0FBR1RDLHVCQUFpQixFQUFFLGlDQUhWO0FBSVRDLGlCQUFXLEVBQUUsQ0FDVCxJQURTLEVBQ0gsSUFERyxFQUNHLElBREgsRUFDUyxJQURULEVBQ2UsSUFEZixFQUNxQixJQURyQjtBQUpKLEtBQWI7QUFTQSxTQUFLQyxzQkFBTCxHQUE4QixLQUFLQSxzQkFBTCxDQUE0QkMsSUFBNUIsQ0FBaUMsSUFBakMsQ0FBOUI7QUFDSDs7QUFFREQsd0JBQXNCLENBQUNFLENBQUQsRUFBSTtBQUN0QixRQUFJTCxjQUFjLEdBQUcsZ0JBQXJCO0FBQ0EsUUFBSUMsaUJBQWlCLEdBQUcsaUNBQXhCOztBQUNBLFFBQUlJLENBQUMsQ0FBQ0MsTUFBRixDQUFTQyxLQUFULElBQWtCRixDQUFDLENBQUNDLE1BQUYsQ0FBU0MsS0FBVCxDQUFlQyxNQUFyQyxFQUE2QztBQUN6Q1Isb0JBQWMsSUFBSSxVQUFsQjtBQUNBQyx1QkFBaUIsSUFBSSxVQUFyQjtBQUNIOztBQUNELFNBQUtRLFFBQUwsQ0FBY0MsTUFBTSxDQUFDQyxNQUFQLENBQWMsRUFBZCxFQUFrQixLQUFLckIsS0FBdkIsRUFBOEI7QUFDeENVLG9CQUFjLEVBQUVBLGNBRHdCO0FBRXhDQyx1QkFBaUIsRUFBRUEsaUJBRnFCO0FBR3hDRixnQkFBVSxFQUFFTSxDQUFDLENBQUNDLE1BQUYsQ0FBU0M7QUFIbUIsS0FBOUIsQ0FBZDtBQU1BLFNBQUtULEtBQUwsQ0FBV0wsb0JBQVgsQ0FBZ0NZLENBQUMsQ0FBQ0MsTUFBRixDQUFTQyxLQUF6QztBQUNIOztBQUVESyxRQUFNLEdBQUc7QUFDTCxVQUFNO0FBQUVaLG9CQUFGO0FBQWtCQyx1QkFBbEI7QUFBcUNDO0FBQXJDLFFBQXFELEtBQUtaLEtBQWhFO0FBQ0EsVUFBTTtBQUFFdUI7QUFBRixRQUFnQkMsK0RBQUssQ0FBQ0MsUUFBTixFQUF0QjtBQUNBLFVBQU1DLE9BQU8sR0FBR0gsU0FBUyxDQUFDRyxPQUExQjtBQUVBLFFBQUlDLFVBQVUsR0FBSSx1RUFBSyxLQUFLM0IsS0FBTCxDQUFXUyxVQUFoQixDQUFsQjs7QUFDQSxRQUFJaUIsT0FBTyxDQUFDRSxHQUFSLENBQVlDLFdBQWhCLEVBQTZCO0FBQ3pCLGNBQVFILE9BQU8sQ0FBQ0UsR0FBUixDQUFZQyxXQUFwQjtBQUNJLGFBQUssSUFBTDtBQUNJRixvQkFBVSxHQUFJLHVFQUFLLEtBQUszQixLQUFMLENBQVdTLFVBQWhCLENBQWQ7QUFDQTs7QUFDSixhQUFLLElBQUw7QUFDSWtCLG9CQUFVLEdBQUksdUVBQUssS0FBSzNCLEtBQUwsQ0FBV1MsVUFBaEIsQ0FBZDtBQUNBOztBQUNKLGFBQUssSUFBTDtBQUNJa0Isb0JBQVUsR0FBSSx1RUFBSyxLQUFLM0IsS0FBTCxDQUFXUyxVQUFoQixDQUFkO0FBQ0E7O0FBQ0osYUFBSyxJQUFMO0FBQ0lrQixvQkFBVSxHQUFJLHVFQUFLLEtBQUszQixLQUFMLENBQVdTLFVBQWhCLENBQWQ7QUFDQTs7QUFDSixhQUFLLElBQUw7QUFDSWtCLG9CQUFVLEdBQUksdUVBQUssS0FBSzNCLEtBQUwsQ0FBV1MsVUFBaEIsQ0FBZDtBQUNBOztBQUNKLGFBQUssSUFBTDtBQUNJa0Isb0JBQVUsR0FBSSx1RUFBSyxLQUFLM0IsS0FBTCxDQUFXUyxVQUFoQixDQUFkO0FBQ0E7QUFsQlI7QUFvQkg7O0FBQ0QsV0FDSSx3RUFDSTtBQUFLLGVBQVMsRUFBQztBQUFmLE9BQ0k7QUFBTyxlQUFTLEVBQUVDLGNBQWxCO0FBQWtDLFVBQUksRUFBQyxNQUF2QztBQUE4QyxXQUFLLEVBQUUsS0FBS1YsS0FBTCxDQUFXUyxVQUFoRTtBQUE0RSxjQUFRLEVBQUUsS0FBS0k7QUFBM0YsTUFESixFQUVJO0FBQU0sZUFBUyxFQUFDO0FBQWhCLHFCQUZKLENBREosRUFLSTtBQUFLLGVBQVMsRUFBRSxLQUFLYixLQUFMLENBQVdTLFVBQVgsSUFBeUIsS0FBS1QsS0FBTCxDQUFXUyxVQUFYLENBQXNCUyxNQUEvQyxHQUF3RCwrQkFBeEQsR0FBMEY7QUFBMUcsT0FDSTtBQUFLLGVBQVMsRUFBQztBQUFmLE9BQ0k7QUFBUSxlQUFTLEVBQUVQLGlCQUFuQjtBQUFzQyxVQUFJLEVBQUMsUUFBM0M7QUFBb0QscUJBQVksVUFBaEU7QUFBMkUsdUJBQWMsTUFBekY7QUFBZ0csdUJBQWM7QUFBOUcsT0FDS2dCLFVBREwsQ0FESixFQUlJLHVGQUpKLEVBS0k7QUFBSyxlQUFTLEVBQUM7QUFBZixPQUNLZixXQUFXLENBQUNrQixHQUFaLENBQWdCLENBQUNDLE1BQUQsRUFBU0MsQ0FBVCxLQUFlO0FBQzVCLGFBQVEsMkRBQUMsOERBQUQ7QUFBcUIsV0FBRyxFQUFFRCxNQUExQjtBQUFrQyxpQkFBUyxFQUFFQSxNQUE3QztBQUFxRCxrQkFBVSxFQUFFLEtBQUsvQixLQUFMLENBQVdTO0FBQTVFLFFBQVI7QUFDSCxLQUZBLENBREwsQ0FMSixDQURKLENBTEosQ0FESjtBQXFCSDs7QUFqRm1DOztBQW9GeEMsTUFBTXdCLE1BQU0sR0FBR0MsMkRBQU8sQ0FBQ25DLGVBQUQsRUFBa0JFLGtCQUFsQixDQUFQLENBQTZDSSxlQUE3QyxDQUFmO0FBRWU0QixxRUFBZixFOzs7Ozs7Ozs7Ozs7QUNyR0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsTUFBTWxDLGVBQWUsR0FBSUMsS0FBRCxJQUFXQSxLQUFuQzs7QUFFQSxNQUFNQyxrQkFBa0IsR0FBSUMsUUFBRCxJQUFjO0FBQ3JDLFNBQU87QUFDSGlDLHNCQUFrQixFQUFFL0IsT0FBTyxJQUFJRixRQUFRLENBQUNpQyxzRkFBa0IsQ0FBQy9CLE9BQUQsQ0FBbkI7QUFEcEMsR0FBUDtBQUdILENBSkQ7O0FBTUEsTUFBTWdDLG1CQUFOLFNBQWtDOUIsK0NBQWxDLENBQTRDO0FBQ3hDQyxhQUFXLENBQUNDLEtBQUQsRUFBUTtBQUNmLFVBQU1BLEtBQU47QUFFQSxTQUFLUixLQUFMLEdBQWEsRUFBYjtBQUlBLFNBQUtxQyxxQkFBTCxHQUE2QixLQUFLQSxxQkFBTCxDQUEyQnZCLElBQTNCLENBQWdDLElBQWhDLENBQTdCO0FBQ0g7O0FBRUR1Qix1QkFBcUIsR0FBRztBQUNwQixTQUFLN0IsS0FBTCxDQUFXMkIsa0JBQVgsQ0FBOEIsS0FBSzNCLEtBQUwsQ0FBVzhCLFNBQXpDO0FBQ0g7O0FBRURoQixRQUFNLEdBQUc7QUFDTCxVQUFNO0FBQUVDO0FBQUYsUUFBZ0JDLCtEQUFLLENBQUNDLFFBQU4sRUFBdEI7QUFDQSxVQUFNQyxPQUFPLEdBQUdILFNBQVMsQ0FBQ0csT0FBMUI7QUFFQSxRQUFJQyxVQUFVLEdBQUcsSUFBakI7O0FBQ0EsWUFBUSxLQUFLbkIsS0FBTCxDQUFXOEIsU0FBbkI7QUFDSSxXQUFLLElBQUw7QUFDSVgsa0JBQVUsR0FBSSx1RUFBS0QsT0FBTyxDQUFDRSxHQUFSLENBQVlXLGFBQWpCLENBQWQ7QUFDQTs7QUFDSixXQUFLLElBQUw7QUFDSVosa0JBQVUsR0FBSSx1RUFBS0QsT0FBTyxDQUFDRSxHQUFSLENBQVlXLGFBQWpCLENBQWQ7QUFDQTs7QUFDSixXQUFLLElBQUw7QUFDSVosa0JBQVUsR0FBSSx1RUFBS0QsT0FBTyxDQUFDRSxHQUFSLENBQVlXLGFBQWpCLENBQWQ7QUFDQTs7QUFDSixXQUFLLElBQUw7QUFDSVosa0JBQVUsR0FBSSx1RUFBS0QsT0FBTyxDQUFDRSxHQUFSLENBQVlXLGFBQWpCLENBQWQ7QUFDQTs7QUFDSixXQUFLLElBQUw7QUFDSVosa0JBQVUsR0FBSSx1RUFBS0QsT0FBTyxDQUFDRSxHQUFSLENBQVlXLGFBQWpCLENBQWQ7QUFDQTs7QUFDSixXQUFLLElBQUw7QUFDSVosa0JBQVUsR0FBSSx1RUFBS0QsT0FBTyxDQUFDRSxHQUFSLENBQVlXLGFBQWpCLENBQWQ7QUFDQTtBQWxCUjs7QUFvQkEsV0FDSTtBQUFHLGVBQVMsRUFBQyxlQUFiO0FBQTZCLGFBQU8sRUFBRSxLQUFLRjtBQUEzQyxPQUNLVixVQURMLENBREo7QUFLSDs7QUE3Q3VDOztBQWdENUMsTUFBTWEsVUFBVSxHQUFHTiwyREFBTyxDQUFDbkMsZUFBRCxFQUFrQkUsa0JBQWxCLENBQVAsQ0FBNkNtQyxtQkFBN0MsQ0FBbkI7QUFFZUkseUVBQWYsRSIsImZpbGUiOiJidWlsZC82LmNiMzI1YzFhM2RhNjdiY2QyNDMwLmNodW5rLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IENvbXBvbmVudCB9IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gJ3JlYWN0LXJlZHV4JztcclxuaW1wb3J0IHsgc3RvcmUgfSBmcm9tICcuLi8uLi9jb25maWcvcmVkdXgvcmVkdXguc3RvcmUnO1xyXG5pbXBvcnQgeyBhZGRJbnB1dFZhbHVlQ2hhbmdlZCB9IGZyb20gJy4uLy4uL2NvbmZpZy9yZWR1eC9yZWR1eC5hY3Rpb25zJztcclxuXHJcbmltcG9ydCBIZWFkZXJTaXplQ29tcG9uZW50IGZyb20gJy4vaGVhZGVyLXNpemUuY29tcG9uZW50JztcclxuXHJcbmNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9IChzdGF0ZSkgPT4gc3RhdGU7XHJcblxyXG5jb25zdCBtYXBEaXNwYXRjaFRvUHJvcHMgPSAoZGlzcGF0Y2gpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgYWRkSW5wdXRWYWx1ZUNoYW5nZWQ6IHBheWxvYWQgPT4gZGlzcGF0Y2goYWRkSW5wdXRWYWx1ZUNoYW5nZWQocGF5bG9hZCkpXHJcbiAgICB9O1xyXG59XHJcblxyXG5jbGFzcyBIZWFkZXJDb21wb25lbnQgZXh0ZW5kcyBDb21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcblxyXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XHJcbiAgICAgICAgICAgIGhlYWRlclRleHQ6ICcnLFxyXG4gICAgICAgICAgICBpbnB1dENsYXNzTmFtZTogJ2ctYm9yZGVyLWNvbG9yJyxcclxuICAgICAgICAgICAgZHJvcGRvd25DbGFzc05hbWU6ICdidG4gZHJvcGRvd24tdG9nZ2xlIHNoYWRvdy1ub25lJyxcclxuICAgICAgICAgICAgaGVhZGVyU2l6ZXM6IFtcclxuICAgICAgICAgICAgICAgICdoNicsICdoNScsICdoNCcsICdoMycsICdoMicsICdoMSdcclxuICAgICAgICAgICAgXVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuaGFuZGxlSGVhZGVyVGV4dENoYW5nZSA9IHRoaXMuaGFuZGxlSGVhZGVyVGV4dENoYW5nZS5iaW5kKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZUhlYWRlclRleHRDaGFuZ2UoZSkge1xyXG4gICAgICAgIHZhciBpbnB1dENsYXNzTmFtZSA9ICdnLWJvcmRlci1jb2xvcic7XHJcbiAgICAgICAgdmFyIGRyb3Bkb3duQ2xhc3NOYW1lID0gJ2J0biBkcm9wZG93bi10b2dnbGUgc2hhZG93LW5vbmUnO1xyXG4gICAgICAgIGlmIChlLnRhcmdldC52YWx1ZSAmJiBlLnRhcmdldC52YWx1ZS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgaW5wdXRDbGFzc05hbWUgKz0gJyBnLXZhbGlkJztcclxuICAgICAgICAgICAgZHJvcGRvd25DbGFzc05hbWUgKz0gJyBnLXZhbGlkJztcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZShPYmplY3QuYXNzaWduKHt9LCB0aGlzLnN0YXRlLCB7XHJcbiAgICAgICAgICAgIGlucHV0Q2xhc3NOYW1lOiBpbnB1dENsYXNzTmFtZSxcclxuICAgICAgICAgICAgZHJvcGRvd25DbGFzc05hbWU6IGRyb3Bkb3duQ2xhc3NOYW1lLFxyXG4gICAgICAgICAgICBoZWFkZXJUZXh0OiBlLnRhcmdldC52YWx1ZVxyXG4gICAgICAgIH0pKTtcclxuXHJcbiAgICAgICAgdGhpcy5wcm9wcy5hZGRJbnB1dFZhbHVlQ2hhbmdlZChlLnRhcmdldC52YWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgaW5wdXRDbGFzc05hbWUsIGRyb3Bkb3duQ2xhc3NOYW1lLCBoZWFkZXJTaXplcyB9ID0gdGhpcy5zdGF0ZTtcclxuICAgICAgICBjb25zdCB7IHdvcmtzcGFjZSB9ID0gc3RvcmUuZ2V0U3RhdGUoKTtcclxuICAgICAgICBjb25zdCBwcm9qZWN0ID0gd29ya3NwYWNlLnByb2plY3Q7XHJcblxyXG4gICAgICAgIHZhciBoZWFkZXJTaXplID0gKDxoNj57dGhpcy5zdGF0ZS5oZWFkZXJUZXh0fTwvaDY+KTtcclxuICAgICAgICBpZiAocHJvamVjdC5hZGQuYWRkSW5wdXRUYWcpIHtcclxuICAgICAgICAgICAgc3dpdGNoIChwcm9qZWN0LmFkZC5hZGRJbnB1dFRhZykge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnaDEnOlxyXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlclNpemUgPSAoPGgxPnt0aGlzLnN0YXRlLmhlYWRlclRleHR9PC9oMT4pO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnaDInOlxyXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlclNpemUgPSAoPGgyPnt0aGlzLnN0YXRlLmhlYWRlclRleHR9PC9oMj4pO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnaDMnOlxyXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlclNpemUgPSAoPGgzPnt0aGlzLnN0YXRlLmhlYWRlclRleHR9PC9oMz4pO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnaDQnOlxyXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlclNpemUgPSAoPGg0Pnt0aGlzLnN0YXRlLmhlYWRlclRleHR9PC9oND4pO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnaDUnOlxyXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlclNpemUgPSAoPGg1Pnt0aGlzLnN0YXRlLmhlYWRlclRleHR9PC9oNT4pO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnaDYnOlxyXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlclNpemUgPSAoPGg2Pnt0aGlzLnN0YXRlLmhlYWRlclRleHR9PC9oNj4pO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImlucHV0LWNvbXBvbmVudFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCBjbGFzc05hbWU9e2lucHV0Q2xhc3NOYW1lfSB0eXBlPVwidGV4dFwiIHZhbHVlPXt0aGlzLnN0YXRlLmhlYWRlclRleHR9IG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUhlYWRlclRleHRDaGFuZ2V9IC8+XHJcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZy1sb2dpbi1mb3JtLWlucHV0LXBsYWNlaG9sZGVyXCI+SGVhZGVyIFRleHQ8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXt0aGlzLnN0YXRlLmhlYWRlclRleHQgJiYgdGhpcy5zdGF0ZS5oZWFkZXJUZXh0Lmxlbmd0aCA/ICdpbnB1dC1jb21wb25lbnQgc2hvdy1kcm9wZG93bicgOiAnaW5wdXQtY29tcG9uZW50IGhpZGUtZHJvcGRvd24nfT5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImRyb3Bkb3duXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPXtkcm9wZG93bkNsYXNzTmFtZX0gdHlwZT1cImJ1dHRvblwiIGRhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIiBhcmlhLWhhc3BvcHVwPVwidHJ1ZVwiIGFyaWEtZXhwYW5kZWQ9XCJmYWxzZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge2hlYWRlclNpemV9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj5IZWFkZXIgU2l6ZTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJkcm9wZG93bi1tZW51XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7aGVhZGVyU2l6ZXMubWFwKChoZWFkZXIsIGkpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKDxIZWFkZXJTaXplQ29tcG9uZW50IGtleT17aGVhZGVyfSBoZWFkZXJLZXk9e2hlYWRlcn0gaGVhZGVyVGV4dD17dGhpcy5zdGF0ZS5oZWFkZXJUZXh0fSAvPik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgSGVhZGVyID0gY29ubmVjdChtYXBTdGF0ZVRvUHJvcHMsIG1hcERpc3BhdGNoVG9Qcm9wcykoSGVhZGVyQ29tcG9uZW50KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IEhlYWRlcjsiLCJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50IH0gZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSAncmVhY3QtcmVkdXgnO1xyXG5pbXBvcnQgeyBzdG9yZSB9IGZyb20gJy4uLy4uL2NvbmZpZy9yZWR1eC9yZWR1eC5zdG9yZSc7XHJcbmltcG9ydCB7IGFkZElucHV0VGFnQ2hhbmdlZCB9IGZyb20gJy4uLy4uL2NvbmZpZy9yZWR1eC9yZWR1eC5hY3Rpb25zJztcclxuXHJcbmNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9IChzdGF0ZSkgPT4gc3RhdGU7XHJcblxyXG5jb25zdCBtYXBEaXNwYXRjaFRvUHJvcHMgPSAoZGlzcGF0Y2gpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgYWRkSW5wdXRUYWdDaGFuZ2VkOiBwYXlsb2FkID0+IGRpc3BhdGNoKGFkZElucHV0VGFnQ2hhbmdlZChwYXlsb2FkKSlcclxuICAgIH07XHJcbn1cclxuXHJcbmNsYXNzIEhlYWRlclNpemVDb21wb25lbnQgZXh0ZW5kcyBDb21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcblxyXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XHJcblxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuaGFuZGxlSGVhZGVyU2l6ZUNsaWNrID0gdGhpcy5oYW5kbGVIZWFkZXJTaXplQ2xpY2suYmluZCh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVIZWFkZXJTaXplQ2xpY2soKSB7XHJcbiAgICAgICAgdGhpcy5wcm9wcy5hZGRJbnB1dFRhZ0NoYW5nZWQodGhpcy5wcm9wcy5oZWFkZXJLZXkpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IHdvcmtzcGFjZSB9ID0gc3RvcmUuZ2V0U3RhdGUoKTtcclxuICAgICAgICBjb25zdCBwcm9qZWN0ID0gd29ya3NwYWNlLnByb2plY3Q7XHJcblxyXG4gICAgICAgIHZhciBoZWFkZXJTaXplID0gbnVsbDtcclxuICAgICAgICBzd2l0Y2ggKHRoaXMucHJvcHMuaGVhZGVyS2V5KSB7XHJcbiAgICAgICAgICAgIGNhc2UgJ2gxJzpcclxuICAgICAgICAgICAgICAgIGhlYWRlclNpemUgPSAoPGgxPntwcm9qZWN0LmFkZC5hZGRJbnB1dFZhbHVlfTwvaDE+KTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICdoMic6XHJcbiAgICAgICAgICAgICAgICBoZWFkZXJTaXplID0gKDxoMj57cHJvamVjdC5hZGQuYWRkSW5wdXRWYWx1ZX08L2gyPik7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAnaDMnOlxyXG4gICAgICAgICAgICAgICAgaGVhZGVyU2l6ZSA9ICg8aDM+e3Byb2plY3QuYWRkLmFkZElucHV0VmFsdWV9PC9oMz4pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ2g0JzpcclxuICAgICAgICAgICAgICAgIGhlYWRlclNpemUgPSAoPGg0Pntwcm9qZWN0LmFkZC5hZGRJbnB1dFZhbHVlfTwvaDQ+KTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICdoNSc6XHJcbiAgICAgICAgICAgICAgICBoZWFkZXJTaXplID0gKDxoNT57cHJvamVjdC5hZGQuYWRkSW5wdXRWYWx1ZX08L2g1Pik7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAnaDYnOlxyXG4gICAgICAgICAgICAgICAgaGVhZGVyU2l6ZSA9ICg8aDY+e3Byb2plY3QuYWRkLmFkZElucHV0VmFsdWV9PC9oNj4pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxhIGNsYXNzTmFtZT1cImRyb3Bkb3duLWl0ZW1cIiBvbkNsaWNrPXt0aGlzLmhhbmRsZUhlYWRlclNpemVDbGlja30gPlxyXG4gICAgICAgICAgICAgICAge2hlYWRlclNpemV9XHJcbiAgICAgICAgICAgIDwvYT5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBIZWFkZXJTaXplID0gY29ubmVjdChtYXBTdGF0ZVRvUHJvcHMsIG1hcERpc3BhdGNoVG9Qcm9wcykoSGVhZGVyU2l6ZUNvbXBvbmVudCk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBIZWFkZXJTaXplOyJdLCJzb3VyY2VSb290IjoiIn0=