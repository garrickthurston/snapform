(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[9],{

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
/* harmony import */ var _config_redux_redux_store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../config/redux/redux.store */ "O7K5");
/* harmony import */ var _config_redux_redux_actions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../config/redux/redux.actions */ "nymR");





const mapStateToProps = state => state;

const mapDispatchToProps = dispatch => {
  return {
    updateProjectConfig: payload => dispatch(Object(_config_redux_redux_actions__WEBPACK_IMPORTED_MODULE_3__["updateProjectConfig"])(payload))
  };
};

class HeaderSizeComponent extends react__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleHeaderSizeClick = this.handleHeaderSizeClick.bind(this);
  }

  handleHeaderSizeClick() {
    const {
      workspace
    } = _config_redux_redux_store__WEBPACK_IMPORTED_MODULE_2__["store"].getState();
    this.props.updateProjectConfig(Object.assign({}, workspace.project.config, {
      ui: Object.assign({}, workspace.project.config.ui, {
        add: Object.assign({}, workspace.project.config.ui.add, {
          tag: this.props.headerKey
        })
      })
    }));
  }

  render() {
    const {
      workspace
    } = _config_redux_redux_store__WEBPACK_IMPORTED_MODULE_2__["store"].getState();
    const project = workspace.project;
    var headerSize = null;

    switch (this.props.headerKey) {
      case 'h1':
        headerSize = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h1", null, project.config.ui.add.value);
        break;

      case 'h2':
        headerSize = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h2", null, project.config.ui.add.value);
        break;

      case 'h3':
        headerSize = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h3", null, project.config.ui.add.value);
        break;

      case 'h4':
        headerSize = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h4", null, project.config.ui.add.value);
        break;

      case 'h5':
        headerSize = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h5", null, project.config.ui.add.value);
        break;

      case 'h6':
        headerSize = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h6", null, project.config.ui.add.value);
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
/* harmony import */ var _config_redux_redux_store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../config/redux/redux.store */ "O7K5");
/* harmony import */ var _config_redux_redux_actions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../config/redux/redux.actions */ "nymR");
/* harmony import */ var _header_size_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./header-size.component */ "fez4");






const mapStateToProps = state => state;

const mapDispatchToProps = dispatch => {
  return {
    updateProjectConfig: payload => dispatch(Object(_config_redux_redux_actions__WEBPACK_IMPORTED_MODULE_3__["updateProjectConfig"])(payload))
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
      inputClassName,
      dropdownClassName,
      headerSizes
    } = this.state;
    const {
      workspace
    } = _config_redux_redux_store__WEBPACK_IMPORTED_MODULE_2__["store"].getState();
    const project = workspace.project;
    var headerSize = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h6", null, this.state.headerText);

    if (project.config.ui.add.tag) {
      switch (project.config.ui.add.tag) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9jbGllbnQvZW5naW5lL3NyYy9jb21wb25lbnRzL2FkZC9oZWFkZXItc2l6ZS5jb21wb25lbnQuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L2VuZ2luZS9zcmMvY29tcG9uZW50cy9hZGQvaGVhZGVyLmNvbXBvbmVudC5qcyJdLCJuYW1lcyI6WyJtYXBTdGF0ZVRvUHJvcHMiLCJzdGF0ZSIsIm1hcERpc3BhdGNoVG9Qcm9wcyIsImRpc3BhdGNoIiwidXBkYXRlUHJvamVjdENvbmZpZyIsInBheWxvYWQiLCJIZWFkZXJTaXplQ29tcG9uZW50IiwiQ29tcG9uZW50IiwiY29uc3RydWN0b3IiLCJwcm9wcyIsImhhbmRsZUhlYWRlclNpemVDbGljayIsImJpbmQiLCJ3b3Jrc3BhY2UiLCJzdG9yZSIsImdldFN0YXRlIiwiT2JqZWN0IiwiYXNzaWduIiwicHJvamVjdCIsImNvbmZpZyIsInVpIiwiYWRkIiwidGFnIiwiaGVhZGVyS2V5IiwicmVuZGVyIiwiaGVhZGVyU2l6ZSIsInZhbHVlIiwiSGVhZGVyU2l6ZSIsImNvbm5lY3QiLCJIZWFkZXJDb21wb25lbnQiLCJoZWFkZXJUZXh0IiwiaW5wdXRDbGFzc05hbWUiLCJkcm9wZG93bkNsYXNzTmFtZSIsImhlYWRlclNpemVzIiwiaGFuZGxlSGVhZGVyVGV4dENoYW5nZSIsImUiLCJ0YXJnZXQiLCJsZW5ndGgiLCJzZXRTdGF0ZSIsIm1hcCIsImhlYWRlciIsImkiLCJIZWFkZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxNQUFNQSxlQUFlLEdBQUlDLEtBQUQsSUFBV0EsS0FBbkM7O0FBRUEsTUFBTUMsa0JBQWtCLEdBQUlDLFFBQUQsSUFBYztBQUNyQyxTQUFPO0FBQ0hDLHVCQUFtQixFQUFFQyxPQUFPLElBQUlGLFFBQVEsQ0FBQ0MsdUZBQW1CLENBQUNDLE9BQUQsQ0FBcEI7QUFEckMs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MUI7QUFBa0MsaUJBQVMsRUFBRUEsTUFBN0M7QUFBcUQsa0JBQVUsRUFBRSxLQUFLdEMsS0FBTCxDQUFXNEI7QUFBNUUsUUFBUjtBQUNILEtBRkEsQ0FETCxDQUxKLENBREosQ0FMSixDQURKO0FBcUJIOztBQXhGbUM7O0FBMkZ4QyxNQUFNWSxNQUFNLEdBQUdkLDJEQUFPLENBQUMzQixlQUFELEVBQWtCRSxrQkFBbEIsQ0FBUCxDQUE2QzBCLGVBQTdDLENBQWY7QUFFZWEscUVBQWYsRSIsImZpbGUiOiJidWlsZC85LmU2NWI5ZTQxYWI2NzU3ZDQ3NWFhLmNodW5rLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IENvbXBvbmVudCB9IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gJ3JlYWN0LXJlZHV4JztcclxuaW1wb3J0IHsgc3RvcmUgfSBmcm9tICcuLi8uLi9jb25maWcvcmVkdXgvcmVkdXguc3RvcmUnO1xyXG5pbXBvcnQgeyB1cGRhdGVQcm9qZWN0Q29uZmlnIH0gZnJvbSAnLi4vLi4vY29uZmlnL3JlZHV4L3JlZHV4LmFjdGlvbnMnO1xyXG5cclxuY29uc3QgbWFwU3RhdGVUb1Byb3BzID0gKHN0YXRlKSA9PiBzdGF0ZTtcclxuXHJcbmNvbnN0IG1hcERpc3BhdGNoVG9Qcm9wcyA9IChkaXNwYXRjaCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB1cGRhdGVQcm9qZWN0Q29uZmlnOiBwYXlsb2FkID0+IGRpc3BhdGNoKHVwZGF0ZVByb2plY3RDb25maWcocGF5bG9hZCkpXHJcbiAgICB9O1xyXG59XHJcblxyXG5jbGFzcyBIZWFkZXJTaXplQ29tcG9uZW50IGV4dGVuZHMgQ29tcG9uZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG5cclxuICAgICAgICB0aGlzLnN0YXRlID0ge1xyXG5cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmhhbmRsZUhlYWRlclNpemVDbGljayA9IHRoaXMuaGFuZGxlSGVhZGVyU2l6ZUNsaWNrLmJpbmQodGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlSGVhZGVyU2l6ZUNsaWNrKCkge1xyXG4gICAgICAgIGNvbnN0IHsgd29ya3NwYWNlIH0gPSBzdG9yZS5nZXRTdGF0ZSgpO1xyXG4gICAgICAgIHRoaXMucHJvcHMudXBkYXRlUHJvamVjdENvbmZpZyhPYmplY3QuYXNzaWduKHt9LCB3b3Jrc3BhY2UucHJvamVjdC5jb25maWcsIHtcclxuICAgICAgICAgICAgdWk6IE9iamVjdC5hc3NpZ24oe30sIHdvcmtzcGFjZS5wcm9qZWN0LmNvbmZpZy51aSwge1xyXG4gICAgICAgICAgICAgICAgYWRkOiBPYmplY3QuYXNzaWduKHt9LCB3b3Jrc3BhY2UucHJvamVjdC5jb25maWcudWkuYWRkLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGFnOiB0aGlzLnByb3BzLmhlYWRlcktleSxcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IHdvcmtzcGFjZSB9ID0gc3RvcmUuZ2V0U3RhdGUoKTtcclxuICAgICAgICBjb25zdCBwcm9qZWN0ID0gd29ya3NwYWNlLnByb2plY3Q7XHJcblxyXG4gICAgICAgIHZhciBoZWFkZXJTaXplID0gbnVsbDtcclxuICAgICAgICBzd2l0Y2ggKHRoaXMucHJvcHMuaGVhZGVyS2V5KSB7XHJcbiAgICAgICAgICAgIGNhc2UgJ2gxJzpcclxuICAgICAgICAgICAgICAgIGhlYWRlclNpemUgPSAoPGgxPntwcm9qZWN0LmNvbmZpZy51aS5hZGQudmFsdWV9PC9oMT4pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ2gyJzpcclxuICAgICAgICAgICAgICAgIGhlYWRlclNpemUgPSAoPGgyPntwcm9qZWN0LmNvbmZpZy51aS5hZGQudmFsdWV9PC9oMj4pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ2gzJzpcclxuICAgICAgICAgICAgICAgIGhlYWRlclNpemUgPSAoPGgzPntwcm9qZWN0LmNvbmZpZy51aS5hZGQudmFsdWV9PC9oMz4pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ2g0JzpcclxuICAgICAgICAgICAgICAgIGhlYWRlclNpemUgPSAoPGg0Pntwcm9qZWN0LmNvbmZpZy51aS5hZGQudmFsdWV9PC9oND4pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ2g1JzpcclxuICAgICAgICAgICAgICAgIGhlYWRlclNpemUgPSAoPGg1Pntwcm9qZWN0LmNvbmZpZy51aS5hZGQudmFsdWV9PC9oNT4pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ2g2JzpcclxuICAgICAgICAgICAgICAgIGhlYWRlclNpemUgPSAoPGg2Pntwcm9qZWN0LmNvbmZpZy51aS5hZGQudmFsdWV9PC9oNj4pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxhIGNsYXNzTmFtZT1cImRyb3Bkb3duLWl0ZW1cIiBvbkNsaWNrPXt0aGlzLmhhbmRsZUhlYWRlclNpemVDbGlja30gPlxyXG4gICAgICAgICAgICAgICAge2hlYWRlclNpemV9XHJcbiAgICAgICAgICAgIDwvYT5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBIZWFkZXJTaXplID0gY29ubmVjdChtYXBTdGF0ZVRvUHJvcHMsIG1hcERpc3BhdGNoVG9Qcm9wcykoSGVhZGVyU2l6ZUNvbXBvbmVudCk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBIZWFkZXJTaXplOyIsImltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQgfSBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCc7XHJcbmltcG9ydCB7IHN0b3JlIH0gZnJvbSAnLi4vLi4vY29uZmlnL3JlZHV4L3JlZHV4LnN0b3JlJztcclxuaW1wb3J0IHsgdXBkYXRlUHJvamVjdENvbmZpZyB9IGZyb20gJy4uLy4uL2NvbmZpZy9yZWR1eC9yZWR1eC5hY3Rpb25zJztcclxuXHJcbmltcG9ydCBIZWFkZXJTaXplQ29tcG9uZW50IGZyb20gJy4vaGVhZGVyLXNpemUuY29tcG9uZW50JztcclxuXHJcbmNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9IChzdGF0ZSkgPT4gc3RhdGU7XHJcblxyXG5jb25zdCBtYXBEaXNwYXRjaFRvUHJvcHMgPSAoZGlzcGF0Y2gpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdXBkYXRlUHJvamVjdENvbmZpZzogcGF5bG9hZCA9PiBkaXNwYXRjaCh1cGRhdGVQcm9qZWN0Q29uZmlnKHBheWxvYWQpKVxyXG4gICAgfTtcclxufVxyXG5cclxuY2xhc3MgSGVhZGVyQ29tcG9uZW50IGV4dGVuZHMgQ29tcG9uZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG5cclxuICAgICAgICB0aGlzLnN0YXRlID0ge1xyXG4gICAgICAgICAgICBoZWFkZXJUZXh0OiAnJyxcclxuICAgICAgICAgICAgaW5wdXRDbGFzc05hbWU6ICdnLWJvcmRlci1jb2xvcicsXHJcbiAgICAgICAgICAgIGRyb3Bkb3duQ2xhc3NOYW1lOiAnYnRuIGRyb3Bkb3duLXRvZ2dsZSBzaGFkb3ctbm9uZScsXHJcbiAgICAgICAgICAgIGhlYWRlclNpemVzOiBbXHJcbiAgICAgICAgICAgICAgICAnaDYnLCAnaDUnLCAnaDQnLCAnaDMnLCAnaDInLCAnaDEnXHJcbiAgICAgICAgICAgIF1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmhhbmRsZUhlYWRlclRleHRDaGFuZ2UgPSB0aGlzLmhhbmRsZUhlYWRlclRleHRDaGFuZ2UuYmluZCh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVIZWFkZXJUZXh0Q2hhbmdlKGUpIHtcclxuICAgICAgICB2YXIgaW5wdXRDbGFzc05hbWUgPSAnZy1ib3JkZXItY29sb3InO1xyXG4gICAgICAgIHZhciBkcm9wZG93bkNsYXNzTmFtZSA9ICdidG4gZHJvcGRvd24tdG9nZ2xlIHNoYWRvdy1ub25lJztcclxuICAgICAgICBpZiAoZS50YXJnZXQudmFsdWUgJiYgZS50YXJnZXQudmFsdWUubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGlucHV0Q2xhc3NOYW1lICs9ICcgZy12YWxpZCc7XHJcbiAgICAgICAgICAgIGRyb3Bkb3duQ2xhc3NOYW1lICs9ICcgZy12YWxpZCc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5zdGF0ZSwge1xyXG4gICAgICAgICAgICBpbnB1dENsYXNzTmFtZTogaW5wdXRDbGFzc05hbWUsXHJcbiAgICAgICAgICAgIGRyb3Bkb3duQ2xhc3NOYW1lOiBkcm9wZG93bkNsYXNzTmFtZSxcclxuICAgICAgICAgICAgaGVhZGVyVGV4dDogZS50YXJnZXQudmFsdWVcclxuICAgICAgICB9KSk7XHJcblxyXG4gICAgICAgIGNvbnN0IHsgd29ya3NwYWNlIH0gPSBzdG9yZS5nZXRTdGF0ZSgpO1xyXG4gICAgICAgIHRoaXMucHJvcHMudXBkYXRlUHJvamVjdENvbmZpZyhPYmplY3QuYXNzaWduKHt9LCB3b3Jrc3BhY2UucHJvamVjdC5jb25maWcsIHtcclxuICAgICAgICAgICAgdWk6IE9iamVjdC5hc3NpZ24oe30sIHdvcmtzcGFjZS5wcm9qZWN0LmNvbmZpZy51aSwge1xyXG4gICAgICAgICAgICAgICAgYWRkOiBPYmplY3QuYXNzaWduKHt9LCB3b3Jrc3BhY2UucHJvamVjdC5jb25maWcudWkuYWRkLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGUudGFyZ2V0LnZhbHVlXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0pKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyBpbnB1dENsYXNzTmFtZSwgZHJvcGRvd25DbGFzc05hbWUsIGhlYWRlclNpemVzIH0gPSB0aGlzLnN0YXRlO1xyXG4gICAgICAgIGNvbnN0IHsgd29ya3NwYWNlIH0gPSBzdG9yZS5nZXRTdGF0ZSgpO1xyXG4gICAgICAgIGNvbnN0IHByb2plY3QgPSB3b3Jrc3BhY2UucHJvamVjdDtcclxuXHJcbiAgICAgICAgdmFyIGhlYWRlclNpemUgPSAoPGg2Pnt0aGlzLnN0YXRlLmhlYWRlclRleHR9PC9oNj4pO1xyXG4gICAgICAgIGlmIChwcm9qZWN0LmNvbmZpZy51aS5hZGQudGFnKSB7XHJcbiAgICAgICAgICAgIHN3aXRjaCAocHJvamVjdC5jb25maWcudWkuYWRkLnRhZykge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnaDEnOlxyXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlclNpemUgPSAoPGgxPnt0aGlzLnN0YXRlLmhlYWRlclRleHR9PC9oMT4pO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnaDInOlxyXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlclNpemUgPSAoPGgyPnt0aGlzLnN0YXRlLmhlYWRlclRleHR9PC9oMj4pO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnaDMnOlxyXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlclNpemUgPSAoPGgzPnt0aGlzLnN0YXRlLmhlYWRlclRleHR9PC9oMz4pO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnaDQnOlxyXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlclNpemUgPSAoPGg0Pnt0aGlzLnN0YXRlLmhlYWRlclRleHR9PC9oND4pO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnaDUnOlxyXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlclNpemUgPSAoPGg1Pnt0aGlzLnN0YXRlLmhlYWRlclRleHR9PC9oNT4pO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnaDYnOlxyXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlclNpemUgPSAoPGg2Pnt0aGlzLnN0YXRlLmhlYWRlclRleHR9PC9oNj4pO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImlucHV0LWNvbXBvbmVudFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCBjbGFzc05hbWU9e2lucHV0Q2xhc3NOYW1lfSB0eXBlPVwidGV4dFwiIHZhbHVlPXt0aGlzLnN0YXRlLmhlYWRlclRleHR9IG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUhlYWRlclRleHRDaGFuZ2V9IC8+XHJcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZy1sb2dpbi1mb3JtLWlucHV0LXBsYWNlaG9sZGVyXCI+SGVhZGVyIFRleHQ8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXt0aGlzLnN0YXRlLmhlYWRlclRleHQgJiYgdGhpcy5zdGF0ZS5oZWFkZXJUZXh0Lmxlbmd0aCA/ICdpbnB1dC1jb21wb25lbnQgc2hvdy1kcm9wZG93bicgOiAnaW5wdXQtY29tcG9uZW50IGhpZGUtZHJvcGRvd24nfT5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImRyb3Bkb3duXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPXtkcm9wZG93bkNsYXNzTmFtZX0gdHlwZT1cImJ1dHRvblwiIGRhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIiBhcmlhLWhhc3BvcHVwPVwidHJ1ZVwiIGFyaWEtZXhwYW5kZWQ9XCJmYWxzZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge2hlYWRlclNpemV9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj5IZWFkZXIgU2l6ZTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJkcm9wZG93bi1tZW51XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7aGVhZGVyU2l6ZXMubWFwKChoZWFkZXIsIGkpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKDxIZWFkZXJTaXplQ29tcG9uZW50IGtleT17aGVhZGVyfSBoZWFkZXJLZXk9e2hlYWRlcn0gaGVhZGVyVGV4dD17dGhpcy5zdGF0ZS5oZWFkZXJUZXh0fSAvPik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgSGVhZGVyID0gY29ubmVjdChtYXBTdGF0ZVRvUHJvcHMsIG1hcERpc3BhdGNoVG9Qcm9wcykoSGVhZGVyQ29tcG9uZW50KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IEhlYWRlcjsiXSwic291cmNlUm9vdCI6IiJ9