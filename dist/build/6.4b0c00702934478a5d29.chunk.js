(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[6],{

/***/ "fez4":
/*!*******************************************************************!*\
  !*** ./client/engine/src/components/add/header-size.component.js ***!
  \*******************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ "/MKj");
/* harmony import */ var _common_config_redux_redux_store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../common/config/redux/redux.store */ "p6Ez");
/* harmony import */ var _config_redux_redux_actions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../config/redux/redux.actions */ "nymR");





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
    } = _common_config_redux_redux_store__WEBPACK_IMPORTED_MODULE_2__["store"].getState().engineReducer;
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

/***/ }),

/***/ "kVXg":
/*!**************************************************************!*\
  !*** ./client/engine/src/components/add/header.component.js ***!
  \**************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ "/MKj");
/* harmony import */ var _common_config_redux_redux_store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../common/config/redux/redux.store */ "p6Ez");
/* harmony import */ var _config_redux_redux_actions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../config/redux/redux.actions */ "nymR");
/* harmony import */ var _header_size_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./header-size.component */ "fez4");






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
    } = _common_config_redux_redux_store__WEBPACK_IMPORTED_MODULE_2__["store"].getState().engineReducer;
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

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9jbGllbnQvZW5naW5lL3NyYy9jb21wb25lbnRzL2FkZC9oZWFkZXItc2l6ZS5jb21wb25lbnQuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L2VuZ2luZS9zcmMvY29tcG9uZW50cy9hZGQvaGVhZGVyLmNvbXBvbmVudC5qcyJdLCJuYW1lcyI6WyJtYXBTdGF0ZVRvUHJvcHMiLCJzdGF0ZSIsIm1hcERpc3BhdGNoVG9Qcm9wcyIsImRpc3BhdGNoIiwiYWRkSW5wdXRUYWdDaGFuZ2VkIiwicGF5bG9hZCIsIkhlYWRlclNpemVDb21wb25lbnQiLCJDb21wb25lbnQiLCJjb25zdHJ1Y3RvciIsInByb3BzIiwiaGFuZGxlSGVhZGVyU2l6ZUNsaWNrIiwiYmluZCIsImhlYWRlcktleSIsInJlbmRlciIsIndvcmtzcGFjZSIsInN0b3JlIiwiZ2V0U3RhdGUiLCJlbmdpbmVSZWR1Y2VyIiwicHJvamVjdCIsImhlYWRlclNpemUiLCJhZGQiLCJhZGRJbnB1dFZhbHVlIiwiSGVhZGVyU2l6ZSIsImNvbm5lY3QiLCJhZGRJbnB1dFZhbHVlQ2hhbmdlZCIsIkhlYWRlckNvbXBvbmVudCIsImhlYWRlclRleHQiLCJpbnB1dENsYXNzTmFtZSIsImRyb3Bkb3duQ2xhc3NOYW1lIiwiaGVhZGVyU2l6ZXMiLCJoYW5kbGVIZWFkZXJUZXh0Q2hhbmdlIiwiZSIsInRhcmdldCIsInZhbHVlIiwibGVuZ3RoIiwic2V0U3RhdGUiLCJPYmplY3QiLCJhc3NpZ24iLCJhZGRJbnB1dFRhZyIsIm1hcCIsImhlYWRlciIsImkiLCJIZWFkZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxNQUFNQSxlQUFlLEdBQUlDLEtBQUQsSUFBV0EsS0FBbkM7O0FBRUEsTUFBTUMsa0JBQWtCLEdBQUlDLFFBQUQsSUFBYztBQUNyQyxTQUFPO0FBQ0hDLHNCQUFrQixFQUFFQyxPQUFP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LE1BQTFCO0FBQWtDLGlCQUFTLEVBQUVBLE1BQTdDO0FBQXFELGtCQUFVLEVBQUUsS0FBS3ZDLEtBQUwsQ0FBV3lCO0FBQTVFLFFBQVI7QUFDSCxLQUZBLENBREwsQ0FMSixDQURKLENBTEosQ0FESjtBQXFCSDs7QUFqRm1DOztBQW9GeEMsTUFBTWdCLE1BQU0sR0FBR25CLDJEQUFPLENBQUN2QixlQUFELEVBQWtCRSxrQkFBbEIsQ0FBUCxDQUE2Q3VCLGVBQTdDLENBQWY7QUFFZWlCLHFFQUFmLEUiLCJmaWxlIjoiYnVpbGQvNi40YjBjMDA3MDI5MzQ0NzhhNWQyOS5jaHVuay5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQgfSBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCc7XHJcbmltcG9ydCB7IHN0b3JlIH0gZnJvbSAnLi4vLi4vLi4vLi4vY29tbW9uL2NvbmZpZy9yZWR1eC9yZWR1eC5zdG9yZSc7XHJcbmltcG9ydCB7IGFkZElucHV0VGFnQ2hhbmdlZCB9IGZyb20gJy4uLy4uL2NvbmZpZy9yZWR1eC9yZWR1eC5hY3Rpb25zJztcclxuXHJcbmNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9IChzdGF0ZSkgPT4gc3RhdGU7XHJcblxyXG5jb25zdCBtYXBEaXNwYXRjaFRvUHJvcHMgPSAoZGlzcGF0Y2gpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgYWRkSW5wdXRUYWdDaGFuZ2VkOiBwYXlsb2FkID0+IGRpc3BhdGNoKGFkZElucHV0VGFnQ2hhbmdlZChwYXlsb2FkKSlcclxuICAgIH07XHJcbn1cclxuXHJcbmNsYXNzIEhlYWRlclNpemVDb21wb25lbnQgZXh0ZW5kcyBDb21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcblxyXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XHJcblxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuaGFuZGxlSGVhZGVyU2l6ZUNsaWNrID0gdGhpcy5oYW5kbGVIZWFkZXJTaXplQ2xpY2suYmluZCh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVIZWFkZXJTaXplQ2xpY2soKSB7XHJcbiAgICAgICAgdGhpcy5wcm9wcy5hZGRJbnB1dFRhZ0NoYW5nZWQodGhpcy5wcm9wcy5oZWFkZXJLZXkpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IHdvcmtzcGFjZSB9ID0gc3RvcmUuZ2V0U3RhdGUoKS5lbmdpbmVSZWR1Y2VyO1xyXG4gICAgICAgIGNvbnN0IHByb2plY3QgPSB3b3Jrc3BhY2UucHJvamVjdDtcclxuXHJcbiAgICAgICAgdmFyIGhlYWRlclNpemUgPSBudWxsO1xyXG4gICAgICAgIHN3aXRjaCAodGhpcy5wcm9wcy5oZWFkZXJLZXkpIHtcclxuICAgICAgICAgICAgY2FzZSAnaDEnOlxyXG4gICAgICAgICAgICAgICAgaGVhZGVyU2l6ZSA9ICg8aDE+e3Byb2plY3QuYWRkLmFkZElucHV0VmFsdWV9PC9oMT4pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ2gyJzpcclxuICAgICAgICAgICAgICAgIGhlYWRlclNpemUgPSAoPGgyPntwcm9qZWN0LmFkZC5hZGRJbnB1dFZhbHVlfTwvaDI+KTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICdoMyc6XHJcbiAgICAgICAgICAgICAgICBoZWFkZXJTaXplID0gKDxoMz57cHJvamVjdC5hZGQuYWRkSW5wdXRWYWx1ZX08L2gzPik7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAnaDQnOlxyXG4gICAgICAgICAgICAgICAgaGVhZGVyU2l6ZSA9ICg8aDQ+e3Byb2plY3QuYWRkLmFkZElucHV0VmFsdWV9PC9oND4pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ2g1JzpcclxuICAgICAgICAgICAgICAgIGhlYWRlclNpemUgPSAoPGg1Pntwcm9qZWN0LmFkZC5hZGRJbnB1dFZhbHVlfTwvaDU+KTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICdoNic6XHJcbiAgICAgICAgICAgICAgICBoZWFkZXJTaXplID0gKDxoNj57cHJvamVjdC5hZGQuYWRkSW5wdXRWYWx1ZX08L2g2Pik7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGEgY2xhc3NOYW1lPVwiZHJvcGRvd24taXRlbVwiIG9uQ2xpY2s9e3RoaXMuaGFuZGxlSGVhZGVyU2l6ZUNsaWNrfSA+XHJcbiAgICAgICAgICAgICAgICB7aGVhZGVyU2l6ZX1cclxuICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IEhlYWRlclNpemUgPSBjb25uZWN0KG1hcFN0YXRlVG9Qcm9wcywgbWFwRGlzcGF0Y2hUb1Byb3BzKShIZWFkZXJTaXplQ29tcG9uZW50KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IEhlYWRlclNpemU7IiwiaW1wb3J0IFJlYWN0LCB7IENvbXBvbmVudCB9IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gJ3JlYWN0LXJlZHV4JztcclxuaW1wb3J0IHsgc3RvcmUgfSBmcm9tICcuLi8uLi8uLi8uLi9jb21tb24vY29uZmlnL3JlZHV4L3JlZHV4LnN0b3JlJztcclxuaW1wb3J0IHsgYWRkSW5wdXRWYWx1ZUNoYW5nZWQgfSBmcm9tICcuLi8uLi9jb25maWcvcmVkdXgvcmVkdXguYWN0aW9ucyc7XHJcblxyXG5pbXBvcnQgSGVhZGVyU2l6ZUNvbXBvbmVudCBmcm9tICcuL2hlYWRlci1zaXplLmNvbXBvbmVudCc7XHJcblxyXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSAoc3RhdGUpID0+IHN0YXRlO1xyXG5cclxuY29uc3QgbWFwRGlzcGF0Y2hUb1Byb3BzID0gKGRpc3BhdGNoKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGFkZElucHV0VmFsdWVDaGFuZ2VkOiBwYXlsb2FkID0+IGRpc3BhdGNoKGFkZElucHV0VmFsdWVDaGFuZ2VkKHBheWxvYWQpKVxyXG4gICAgfTtcclxufVxyXG5cclxuY2xhc3MgSGVhZGVyQ29tcG9uZW50IGV4dGVuZHMgQ29tcG9uZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG5cclxuICAgICAgICB0aGlzLnN0YXRlID0ge1xyXG4gICAgICAgICAgICBoZWFkZXJUZXh0OiAnJyxcclxuICAgICAgICAgICAgaW5wdXRDbGFzc05hbWU6ICdnLWJvcmRlci1jb2xvcicsXHJcbiAgICAgICAgICAgIGRyb3Bkb3duQ2xhc3NOYW1lOiAnYnRuIGRyb3Bkb3duLXRvZ2dsZSBzaGFkb3ctbm9uZScsXHJcbiAgICAgICAgICAgIGhlYWRlclNpemVzOiBbXHJcbiAgICAgICAgICAgICAgICAnaDYnLCAnaDUnLCAnaDQnLCAnaDMnLCAnaDInLCAnaDEnXHJcbiAgICAgICAgICAgIF1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmhhbmRsZUhlYWRlclRleHRDaGFuZ2UgPSB0aGlzLmhhbmRsZUhlYWRlclRleHRDaGFuZ2UuYmluZCh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVIZWFkZXJUZXh0Q2hhbmdlKGUpIHtcclxuICAgICAgICB2YXIgaW5wdXRDbGFzc05hbWUgPSAnZy1ib3JkZXItY29sb3InO1xyXG4gICAgICAgIHZhciBkcm9wZG93bkNsYXNzTmFtZSA9ICdidG4gZHJvcGRvd24tdG9nZ2xlIHNoYWRvdy1ub25lJztcclxuICAgICAgICBpZiAoZS50YXJnZXQudmFsdWUgJiYgZS50YXJnZXQudmFsdWUubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGlucHV0Q2xhc3NOYW1lICs9ICcgZy12YWxpZCc7XHJcbiAgICAgICAgICAgIGRyb3Bkb3duQ2xhc3NOYW1lICs9ICcgZy12YWxpZCc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5zdGF0ZSwge1xyXG4gICAgICAgICAgICBpbnB1dENsYXNzTmFtZTogaW5wdXRDbGFzc05hbWUsXHJcbiAgICAgICAgICAgIGRyb3Bkb3duQ2xhc3NOYW1lOiBkcm9wZG93bkNsYXNzTmFtZSxcclxuICAgICAgICAgICAgaGVhZGVyVGV4dDogZS50YXJnZXQudmFsdWVcclxuICAgICAgICB9KSk7XHJcblxyXG4gICAgICAgIHRoaXMucHJvcHMuYWRkSW5wdXRWYWx1ZUNoYW5nZWQoZS50YXJnZXQudmFsdWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IGlucHV0Q2xhc3NOYW1lLCBkcm9wZG93bkNsYXNzTmFtZSwgaGVhZGVyU2l6ZXMgfSA9IHRoaXMuc3RhdGU7XHJcbiAgICAgICAgY29uc3QgeyB3b3Jrc3BhY2UgfSA9IHN0b3JlLmdldFN0YXRlKCkuZW5naW5lUmVkdWNlcjtcclxuICAgICAgICBjb25zdCBwcm9qZWN0ID0gd29ya3NwYWNlLnByb2plY3Q7XHJcblxyXG4gICAgICAgIHZhciBoZWFkZXJTaXplID0gKDxoNj57dGhpcy5zdGF0ZS5oZWFkZXJUZXh0fTwvaDY+KTtcclxuICAgICAgICBpZiAocHJvamVjdC5hZGQuYWRkSW5wdXRUYWcpIHtcclxuICAgICAgICAgICAgc3dpdGNoIChwcm9qZWN0LmFkZC5hZGRJbnB1dFRhZykge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnaDEnOlxyXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlclNpemUgPSAoPGgxPnt0aGlzLnN0YXRlLmhlYWRlclRleHR9PC9oMT4pO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnaDInOlxyXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlclNpemUgPSAoPGgyPnt0aGlzLnN0YXRlLmhlYWRlclRleHR9PC9oMj4pO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnaDMnOlxyXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlclNpemUgPSAoPGgzPnt0aGlzLnN0YXRlLmhlYWRlclRleHR9PC9oMz4pO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnaDQnOlxyXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlclNpemUgPSAoPGg0Pnt0aGlzLnN0YXRlLmhlYWRlclRleHR9PC9oND4pO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnaDUnOlxyXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlclNpemUgPSAoPGg1Pnt0aGlzLnN0YXRlLmhlYWRlclRleHR9PC9oNT4pO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnaDYnOlxyXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlclNpemUgPSAoPGg2Pnt0aGlzLnN0YXRlLmhlYWRlclRleHR9PC9oNj4pO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImlucHV0LWNvbXBvbmVudFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCBjbGFzc05hbWU9e2lucHV0Q2xhc3NOYW1lfSB0eXBlPVwidGV4dFwiIHZhbHVlPXt0aGlzLnN0YXRlLmhlYWRlclRleHR9IG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUhlYWRlclRleHRDaGFuZ2V9IC8+XHJcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZy1sb2dpbi1mb3JtLWlucHV0LXBsYWNlaG9sZGVyXCI+SGVhZGVyIFRleHQ8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXt0aGlzLnN0YXRlLmhlYWRlclRleHQgJiYgdGhpcy5zdGF0ZS5oZWFkZXJUZXh0Lmxlbmd0aCA/ICdpbnB1dC1jb21wb25lbnQgc2hvdy1kcm9wZG93bicgOiAnaW5wdXQtY29tcG9uZW50IGhpZGUtZHJvcGRvd24nfT5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImRyb3Bkb3duXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPXtkcm9wZG93bkNsYXNzTmFtZX0gdHlwZT1cImJ1dHRvblwiIGRhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIiBhcmlhLWhhc3BvcHVwPVwidHJ1ZVwiIGFyaWEtZXhwYW5kZWQ9XCJmYWxzZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge2hlYWRlclNpemV9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj5IZWFkZXIgU2l6ZTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJkcm9wZG93bi1tZW51XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7aGVhZGVyU2l6ZXMubWFwKChoZWFkZXIsIGkpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKDxIZWFkZXJTaXplQ29tcG9uZW50IGtleT17aGVhZGVyfSBoZWFkZXJLZXk9e2hlYWRlcn0gaGVhZGVyVGV4dD17dGhpcy5zdGF0ZS5oZWFkZXJUZXh0fSAvPik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgSGVhZGVyID0gY29ubmVjdChtYXBTdGF0ZVRvUHJvcHMsIG1hcERpc3BhdGNoVG9Qcm9wcykoSGVhZGVyQ29tcG9uZW50KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IEhlYWRlcjsiXSwic291cmNlUm9vdCI6IiJ9