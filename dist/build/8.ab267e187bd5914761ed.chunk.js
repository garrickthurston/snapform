(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[8],{

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
    } = _common_config_redux_redux_store__WEBPACK_IMPORTED_MODULE_2__["store"].getState().engineReducer;
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
    } = _common_config_redux_redux_store__WEBPACK_IMPORTED_MODULE_2__["store"].getState().engineReducer;
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
/* harmony import */ var _common_config_redux_redux_store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../common/config/redux/redux.store */ "p6Ez");
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
    } = _common_config_redux_redux_store__WEBPACK_IMPORTED_MODULE_2__["store"].getState().engineReducer;
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
    } = _common_config_redux_redux_store__WEBPACK_IMPORTED_MODULE_2__["store"].getState().engineReducer;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9jbGllbnQvZW5naW5lL3NyYy9jb21wb25lbnRzL2FkZC9oZWFkZXItc2l6ZS5jb21wb25lbnQuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L2VuZ2luZS9zcmMvY29tcG9uZW50cy9hZGQvaGVhZGVyLmNvbXBvbmVudC5qcyJdLCJuYW1lcyI6WyJtYXBTdGF0ZVRvUHJvcHMiLCJzdGF0ZSIsIm1hcERpc3BhdGNoVG9Qcm9wcyIsImRpc3BhdGNoIiwidXBkYXRlUHJvamVjdENvbmZpZyIsInBheWxvYWQiLCJIZWFkZXJTaXplQ29tcG9uZW50IiwiQ29tcG9uZW50IiwiY29uc3RydWN0b3IiLCJwcm9wcyIsImhhbmRsZUhlYWRlclNpemVDbGljayIsImJpbmQiLCJ3b3Jrc3BhY2UiLCJzdG9yZSIsImdldFN0YXRlIiwiZW5naW5lUmVkdWNlciIsIk9iamVjdCIsImFzc2lnbiIsInByb2plY3QiLCJjb25maWciLCJ1aSIsImFkZCIsInRhZyIsImhlYWRlcktleSIsInJlbmRlciIsImhlYWRlclNpemUiLCJ2YWx1ZSIsIkhlYWRlclNpemUiLCJjb25uZWN0IiwiSGVhZGVyQ29tcG9uZW50IiwiaGVhZGVyVGV4dCIsImlucHV0Q2xhc3NOYW1lIiwiZHJvcGRvd25DbGFzc05hbWUiLCJoZWFkZXJTaXplcyIsImhhbmRsZUhlYWRlclRleHRDaGFuZ2UiLCJlIiwidGFyZ2V0IiwibGVuZ3RoIiwic2V0U3RhdGUiLCJtYXAiLCJoZWFkZXIiLCJpIiwiSGVhZGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsTUFBTUEsZUFBZSxHQUFJQyxLQUFELElBQVdBLEtBQW5DOztBQUVBLE1BQU1DLGtCQUFrQixHQUFJQyxRQUFELElBQWM7QUFDckMsU0FBTztBQUNIQyx1QkFBbUIsRUFBRUMsT0FBTyxJQUFJRixRQUFRLENBQUNDLHVGQUFtQixDQUFDQyxP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QUFlO0FBQzVCLGFBQVEsMkRBQUMsOERBQUQ7QUFBcUIsV0FBRyxFQUFFRCxNQUExQjtBQUFrQyxpQkFBUyxFQUFFQSxNQUE3QztBQUFxRCxrQkFBVSxFQUFFLEtBQUt2QyxLQUFMLENBQVc2QjtBQUE1RSxRQUFSO0FBQ0gsS0FGQSxDQURMLENBTEosQ0FESixDQUxKLENBREo7QUFxQkg7O0FBeEZtQzs7QUEyRnhDLE1BQU1ZLE1BQU0sR0FBR2QsMkRBQU8sQ0FBQzVCLGVBQUQsRUFBa0JFLGtCQUFsQixDQUFQLENBQTZDMkIsZUFBN0MsQ0FBZjtBQUVlYSxxRUFBZixFIiwiZmlsZSI6ImJ1aWxkLzguYWIyNjdlMTg3YmQ1OTE0NzYxZWQuY2h1bmsuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50IH0gZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSAncmVhY3QtcmVkdXgnO1xyXG5pbXBvcnQgeyBzdG9yZSB9IGZyb20gJy4uLy4uLy4uLy4uL2NvbW1vbi9jb25maWcvcmVkdXgvcmVkdXguc3RvcmUnO1xyXG5pbXBvcnQgeyB1cGRhdGVQcm9qZWN0Q29uZmlnIH0gZnJvbSAnLi4vLi4vY29uZmlnL3JlZHV4L3JlZHV4LmFjdGlvbnMnO1xyXG5cclxuY29uc3QgbWFwU3RhdGVUb1Byb3BzID0gKHN0YXRlKSA9PiBzdGF0ZTtcclxuXHJcbmNvbnN0IG1hcERpc3BhdGNoVG9Qcm9wcyA9IChkaXNwYXRjaCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB1cGRhdGVQcm9qZWN0Q29uZmlnOiBwYXlsb2FkID0+IGRpc3BhdGNoKHVwZGF0ZVByb2plY3RDb25maWcocGF5bG9hZCkpXHJcbiAgICB9O1xyXG59XHJcblxyXG5jbGFzcyBIZWFkZXJTaXplQ29tcG9uZW50IGV4dGVuZHMgQ29tcG9uZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG5cclxuICAgICAgICB0aGlzLnN0YXRlID0ge1xyXG5cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmhhbmRsZUhlYWRlclNpemVDbGljayA9IHRoaXMuaGFuZGxlSGVhZGVyU2l6ZUNsaWNrLmJpbmQodGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlSGVhZGVyU2l6ZUNsaWNrKCkge1xyXG4gICAgICAgIGNvbnN0IHsgd29ya3NwYWNlIH0gPSBzdG9yZS5nZXRTdGF0ZSgpLmVuZ2luZVJlZHVjZXI7XHJcbiAgICAgICAgdGhpcy5wcm9wcy51cGRhdGVQcm9qZWN0Q29uZmlnKE9iamVjdC5hc3NpZ24oe30sIHdvcmtzcGFjZS5wcm9qZWN0LmNvbmZpZywge1xyXG4gICAgICAgICAgICB1aTogT2JqZWN0LmFzc2lnbih7fSwgd29ya3NwYWNlLnByb2plY3QuY29uZmlnLnVpLCB7XHJcbiAgICAgICAgICAgICAgICBhZGQ6IE9iamVjdC5hc3NpZ24oe30sIHdvcmtzcGFjZS5wcm9qZWN0LmNvbmZpZy51aS5hZGQsIHtcclxuICAgICAgICAgICAgICAgICAgICB0YWc6IHRoaXMucHJvcHMuaGVhZGVyS2V5LFxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9KSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgd29ya3NwYWNlIH0gPSBzdG9yZS5nZXRTdGF0ZSgpLmVuZ2luZVJlZHVjZXI7XHJcbiAgICAgICAgY29uc3QgcHJvamVjdCA9IHdvcmtzcGFjZS5wcm9qZWN0O1xyXG5cclxuICAgICAgICB2YXIgaGVhZGVyU2l6ZSA9IG51bGw7XHJcbiAgICAgICAgc3dpdGNoICh0aGlzLnByb3BzLmhlYWRlcktleSkge1xyXG4gICAgICAgICAgICBjYXNlICdoMSc6XHJcbiAgICAgICAgICAgICAgICBoZWFkZXJTaXplID0gKDxoMT57cHJvamVjdC5jb25maWcudWkuYWRkLnZhbHVlfTwvaDE+KTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICdoMic6XHJcbiAgICAgICAgICAgICAgICBoZWFkZXJTaXplID0gKDxoMj57cHJvamVjdC5jb25maWcudWkuYWRkLnZhbHVlfTwvaDI+KTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICdoMyc6XHJcbiAgICAgICAgICAgICAgICBoZWFkZXJTaXplID0gKDxoMz57cHJvamVjdC5jb25maWcudWkuYWRkLnZhbHVlfTwvaDM+KTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICdoNCc6XHJcbiAgICAgICAgICAgICAgICBoZWFkZXJTaXplID0gKDxoND57cHJvamVjdC5jb25maWcudWkuYWRkLnZhbHVlfTwvaDQ+KTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICdoNSc6XHJcbiAgICAgICAgICAgICAgICBoZWFkZXJTaXplID0gKDxoNT57cHJvamVjdC5jb25maWcudWkuYWRkLnZhbHVlfTwvaDU+KTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICdoNic6XHJcbiAgICAgICAgICAgICAgICBoZWFkZXJTaXplID0gKDxoNj57cHJvamVjdC5jb25maWcudWkuYWRkLnZhbHVlfTwvaDY+KTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8YSBjbGFzc05hbWU9XCJkcm9wZG93bi1pdGVtXCIgb25DbGljaz17dGhpcy5oYW5kbGVIZWFkZXJTaXplQ2xpY2t9ID5cclxuICAgICAgICAgICAgICAgIHtoZWFkZXJTaXplfVxyXG4gICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgSGVhZGVyU2l6ZSA9IGNvbm5lY3QobWFwU3RhdGVUb1Byb3BzLCBtYXBEaXNwYXRjaFRvUHJvcHMpKEhlYWRlclNpemVDb21wb25lbnQpO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgSGVhZGVyU2l6ZTsiLCJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50IH0gZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSAncmVhY3QtcmVkdXgnO1xyXG5pbXBvcnQgeyBzdG9yZSB9IGZyb20gJy4uLy4uLy4uLy4uL2NvbW1vbi9jb25maWcvcmVkdXgvcmVkdXguc3RvcmUnO1xyXG5pbXBvcnQgeyB1cGRhdGVQcm9qZWN0Q29uZmlnIH0gZnJvbSAnLi4vLi4vY29uZmlnL3JlZHV4L3JlZHV4LmFjdGlvbnMnO1xyXG5cclxuaW1wb3J0IEhlYWRlclNpemVDb21wb25lbnQgZnJvbSAnLi9oZWFkZXItc2l6ZS5jb21wb25lbnQnO1xyXG5cclxuY29uc3QgbWFwU3RhdGVUb1Byb3BzID0gKHN0YXRlKSA9PiBzdGF0ZTtcclxuXHJcbmNvbnN0IG1hcERpc3BhdGNoVG9Qcm9wcyA9IChkaXNwYXRjaCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB1cGRhdGVQcm9qZWN0Q29uZmlnOiBwYXlsb2FkID0+IGRpc3BhdGNoKHVwZGF0ZVByb2plY3RDb25maWcocGF5bG9hZCkpXHJcbiAgICB9O1xyXG59XHJcblxyXG5jbGFzcyBIZWFkZXJDb21wb25lbnQgZXh0ZW5kcyBDb21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcblxyXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XHJcbiAgICAgICAgICAgIGhlYWRlclRleHQ6ICcnLFxyXG4gICAgICAgICAgICBpbnB1dENsYXNzTmFtZTogJ2ctYm9yZGVyLWNvbG9yJyxcclxuICAgICAgICAgICAgZHJvcGRvd25DbGFzc05hbWU6ICdidG4gZHJvcGRvd24tdG9nZ2xlIHNoYWRvdy1ub25lJyxcclxuICAgICAgICAgICAgaGVhZGVyU2l6ZXM6IFtcclxuICAgICAgICAgICAgICAgICdoNicsICdoNScsICdoNCcsICdoMycsICdoMicsICdoMSdcclxuICAgICAgICAgICAgXVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuaGFuZGxlSGVhZGVyVGV4dENoYW5nZSA9IHRoaXMuaGFuZGxlSGVhZGVyVGV4dENoYW5nZS5iaW5kKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZUhlYWRlclRleHRDaGFuZ2UoZSkge1xyXG4gICAgICAgIHZhciBpbnB1dENsYXNzTmFtZSA9ICdnLWJvcmRlci1jb2xvcic7XHJcbiAgICAgICAgdmFyIGRyb3Bkb3duQ2xhc3NOYW1lID0gJ2J0biBkcm9wZG93bi10b2dnbGUgc2hhZG93LW5vbmUnO1xyXG4gICAgICAgIGlmIChlLnRhcmdldC52YWx1ZSAmJiBlLnRhcmdldC52YWx1ZS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgaW5wdXRDbGFzc05hbWUgKz0gJyBnLXZhbGlkJztcclxuICAgICAgICAgICAgZHJvcGRvd25DbGFzc05hbWUgKz0gJyBnLXZhbGlkJztcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZShPYmplY3QuYXNzaWduKHt9LCB0aGlzLnN0YXRlLCB7XHJcbiAgICAgICAgICAgIGlucHV0Q2xhc3NOYW1lOiBpbnB1dENsYXNzTmFtZSxcclxuICAgICAgICAgICAgZHJvcGRvd25DbGFzc05hbWU6IGRyb3Bkb3duQ2xhc3NOYW1lLFxyXG4gICAgICAgICAgICBoZWFkZXJUZXh0OiBlLnRhcmdldC52YWx1ZVxyXG4gICAgICAgIH0pKTtcclxuXHJcbiAgICAgICAgY29uc3QgeyB3b3Jrc3BhY2UgfSA9IHN0b3JlLmdldFN0YXRlKCkuZW5naW5lUmVkdWNlcjtcclxuICAgICAgICB0aGlzLnByb3BzLnVwZGF0ZVByb2plY3RDb25maWcoT2JqZWN0LmFzc2lnbih7fSwgd29ya3NwYWNlLnByb2plY3QuY29uZmlnLCB7XHJcbiAgICAgICAgICAgIHVpOiBPYmplY3QuYXNzaWduKHt9LCB3b3Jrc3BhY2UucHJvamVjdC5jb25maWcudWksIHtcclxuICAgICAgICAgICAgICAgIGFkZDogT2JqZWN0LmFzc2lnbih7fSwgd29ya3NwYWNlLnByb2plY3QuY29uZmlnLnVpLmFkZCwge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBlLnRhcmdldC52YWx1ZVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9KSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgaW5wdXRDbGFzc05hbWUsIGRyb3Bkb3duQ2xhc3NOYW1lLCBoZWFkZXJTaXplcyB9ID0gdGhpcy5zdGF0ZTtcclxuICAgICAgICBjb25zdCB7IHdvcmtzcGFjZSB9ID0gc3RvcmUuZ2V0U3RhdGUoKS5lbmdpbmVSZWR1Y2VyO1xyXG4gICAgICAgIGNvbnN0IHByb2plY3QgPSB3b3Jrc3BhY2UucHJvamVjdDtcclxuXHJcbiAgICAgICAgdmFyIGhlYWRlclNpemUgPSAoPGg2Pnt0aGlzLnN0YXRlLmhlYWRlclRleHR9PC9oNj4pO1xyXG4gICAgICAgIGlmIChwcm9qZWN0LmNvbmZpZy51aS5hZGQudGFnKSB7XHJcbiAgICAgICAgICAgIHN3aXRjaCAocHJvamVjdC5jb25maWcudWkuYWRkLnRhZykge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnaDEnOlxyXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlclNpemUgPSAoPGgxPnt0aGlzLnN0YXRlLmhlYWRlclRleHR9PC9oMT4pO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnaDInOlxyXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlclNpemUgPSAoPGgyPnt0aGlzLnN0YXRlLmhlYWRlclRleHR9PC9oMj4pO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnaDMnOlxyXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlclNpemUgPSAoPGgzPnt0aGlzLnN0YXRlLmhlYWRlclRleHR9PC9oMz4pO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnaDQnOlxyXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlclNpemUgPSAoPGg0Pnt0aGlzLnN0YXRlLmhlYWRlclRleHR9PC9oND4pO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnaDUnOlxyXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlclNpemUgPSAoPGg1Pnt0aGlzLnN0YXRlLmhlYWRlclRleHR9PC9oNT4pO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnaDYnOlxyXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlclNpemUgPSAoPGg2Pnt0aGlzLnN0YXRlLmhlYWRlclRleHR9PC9oNj4pO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImlucHV0LWNvbXBvbmVudFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCBjbGFzc05hbWU9e2lucHV0Q2xhc3NOYW1lfSB0eXBlPVwidGV4dFwiIHZhbHVlPXt0aGlzLnN0YXRlLmhlYWRlclRleHR9IG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUhlYWRlclRleHRDaGFuZ2V9IC8+XHJcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZy1sb2dpbi1mb3JtLWlucHV0LXBsYWNlaG9sZGVyXCI+SGVhZGVyIFRleHQ8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXt0aGlzLnN0YXRlLmhlYWRlclRleHQgJiYgdGhpcy5zdGF0ZS5oZWFkZXJUZXh0Lmxlbmd0aCA/ICdpbnB1dC1jb21wb25lbnQgc2hvdy1kcm9wZG93bicgOiAnaW5wdXQtY29tcG9uZW50IGhpZGUtZHJvcGRvd24nfT5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImRyb3Bkb3duXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPXtkcm9wZG93bkNsYXNzTmFtZX0gdHlwZT1cImJ1dHRvblwiIGRhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIiBhcmlhLWhhc3BvcHVwPVwidHJ1ZVwiIGFyaWEtZXhwYW5kZWQ9XCJmYWxzZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge2hlYWRlclNpemV9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj5IZWFkZXIgU2l6ZTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJkcm9wZG93bi1tZW51XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7aGVhZGVyU2l6ZXMubWFwKChoZWFkZXIsIGkpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKDxIZWFkZXJTaXplQ29tcG9uZW50IGtleT17aGVhZGVyfSBoZWFkZXJLZXk9e2hlYWRlcn0gaGVhZGVyVGV4dD17dGhpcy5zdGF0ZS5oZWFkZXJUZXh0fSAvPik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgSGVhZGVyID0gY29ubmVjdChtYXBTdGF0ZVRvUHJvcHMsIG1hcERpc3BhdGNoVG9Qcm9wcykoSGVhZGVyQ29tcG9uZW50KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IEhlYWRlcjsiXSwic291cmNlUm9vdCI6IiJ9