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
        add: Object.assign({}, workspace.project.config.ui, {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9jbGllbnQvZW5naW5lL3NyYy9jb21wb25lbnRzL2FkZC9oZWFkZXItc2l6ZS5jb21wb25lbnQuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L2VuZ2luZS9zcmMvY29tcG9uZW50cy9hZGQvaGVhZGVyLmNvbXBvbmVudC5qcyJdLCJuYW1lcyI6WyJtYXBTdGF0ZVRvUHJvcHMiLCJzdGF0ZSIsIm1hcERpc3BhdGNoVG9Qcm9wcyIsImRpc3BhdGNoIiwidXBkYXRlUHJvamVjdENvbmZpZyIsInBheWxvYWQiLCJIZWFkZXJTaXplQ29tcG9uZW50IiwiQ29tcG9uZW50IiwiY29uc3RydWN0b3IiLCJwcm9wcyIsImhhbmRsZUhlYWRlclNpemVDbGljayIsImJpbmQiLCJ3b3Jrc3BhY2UiLCJzdG9yZSIsImdldFN0YXRlIiwiZW5naW5lUmVkdWNlciIsIk9iamVjdCIsImFzc2lnbiIsInByb2plY3QiLCJjb25maWciLCJ1aSIsImFkZCIsInRhZyIsImhlYWRlcktleSIsInJlbmRlciIsImhlYWRlclNpemUiLCJ2YWx1ZSIsIkhlYWRlclNpemUiLCJjb25uZWN0IiwiSGVhZGVyQ29tcG9uZW50IiwiaGVhZGVyVGV4dCIsImlucHV0Q2xhc3NOYW1lIiwiZHJvcGRvd25DbGFzc05hbWUiLCJoZWFkZXJTaXplcyIsImhhbmRsZUhlYWRlclRleHRDaGFuZ2UiLCJlIiwidGFyZ2V0IiwibGVuZ3RoIiwic2V0U3RhdGUiLCJtYXAiLCJoZWFkZXIiLCJpIiwiSGVhZGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsTUFBTUEsZUFBZSxHQUFJQyxLQUFELElBQVdBLEtBQW5DOztBQUVBLE1BQU1DLGtCQUFrQixHQUFJQyxRQUFELElBQWM7QUFDckMsU0FBTztBQUNIQyx1QkFBbUIsRUFBRUMsT0FBTyxJQUFJRixRQUFRLENBQUNDLHVGQUFtQixDQUFDQyxP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USwyREFBQyw4REFBRDtBQUFxQixXQUFHLEVBQUVELE1BQTFCO0FBQWtDLGlCQUFTLEVBQUVBLE1BQTdDO0FBQXFELGtCQUFVLEVBQUUsS0FBS3ZDLEtBQUwsQ0FBVzZCO0FBQTVFLFFBQVI7QUFDSCxLQUZBLENBREwsQ0FMSixDQURKLENBTEosQ0FESjtBQXFCSDs7QUF4Rm1DOztBQTJGeEMsTUFBTVksTUFBTSxHQUFHZCwyREFBTyxDQUFDNUIsZUFBRCxFQUFrQkUsa0JBQWxCLENBQVAsQ0FBNkMyQixlQUE3QyxDQUFmO0FBRWVhLHFFQUFmLEUiLCJmaWxlIjoiYnVpbGQvOC42MTEzYTQ3MTA5MmYyOTFmOTI2YS5jaHVuay5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQgfSBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCc7XHJcbmltcG9ydCB7IHN0b3JlIH0gZnJvbSAnLi4vLi4vLi4vLi4vY29tbW9uL2NvbmZpZy9yZWR1eC9yZWR1eC5zdG9yZSc7XHJcbmltcG9ydCB7IHVwZGF0ZVByb2plY3RDb25maWcgfSBmcm9tICcuLi8uLi9jb25maWcvcmVkdXgvcmVkdXguYWN0aW9ucyc7XHJcblxyXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSAoc3RhdGUpID0+IHN0YXRlO1xyXG5cclxuY29uc3QgbWFwRGlzcGF0Y2hUb1Byb3BzID0gKGRpc3BhdGNoKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHVwZGF0ZVByb2plY3RDb25maWc6IHBheWxvYWQgPT4gZGlzcGF0Y2godXBkYXRlUHJvamVjdENvbmZpZyhwYXlsb2FkKSlcclxuICAgIH07XHJcbn1cclxuXHJcbmNsYXNzIEhlYWRlclNpemVDb21wb25lbnQgZXh0ZW5kcyBDb21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcblxyXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XHJcblxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuaGFuZGxlSGVhZGVyU2l6ZUNsaWNrID0gdGhpcy5oYW5kbGVIZWFkZXJTaXplQ2xpY2suYmluZCh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVIZWFkZXJTaXplQ2xpY2soKSB7XHJcbiAgICAgICAgY29uc3QgeyB3b3Jrc3BhY2UgfSA9IHN0b3JlLmdldFN0YXRlKCkuZW5naW5lUmVkdWNlcjtcclxuICAgICAgICB0aGlzLnByb3BzLnVwZGF0ZVByb2plY3RDb25maWcoT2JqZWN0LmFzc2lnbih7fSwgd29ya3NwYWNlLnByb2plY3QuY29uZmlnLCB7XHJcbiAgICAgICAgICAgIHVpOiBPYmplY3QuYXNzaWduKHt9LCB3b3Jrc3BhY2UucHJvamVjdC5jb25maWcudWksIHtcclxuICAgICAgICAgICAgICAgIGFkZDogT2JqZWN0LmFzc2lnbih7fSwgd29ya3NwYWNlLnByb2plY3QuY29uZmlnLnVpLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGFnOiB0aGlzLnByb3BzLmhlYWRlcktleSxcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IHdvcmtzcGFjZSB9ID0gc3RvcmUuZ2V0U3RhdGUoKS5lbmdpbmVSZWR1Y2VyO1xyXG4gICAgICAgIGNvbnN0IHByb2plY3QgPSB3b3Jrc3BhY2UucHJvamVjdDtcclxuXHJcbiAgICAgICAgdmFyIGhlYWRlclNpemUgPSBudWxsO1xyXG4gICAgICAgIHN3aXRjaCAodGhpcy5wcm9wcy5oZWFkZXJLZXkpIHtcclxuICAgICAgICAgICAgY2FzZSAnaDEnOlxyXG4gICAgICAgICAgICAgICAgaGVhZGVyU2l6ZSA9ICg8aDE+e3Byb2plY3QuY29uZmlnLnVpLmFkZC52YWx1ZX08L2gxPik7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAnaDInOlxyXG4gICAgICAgICAgICAgICAgaGVhZGVyU2l6ZSA9ICg8aDI+e3Byb2plY3QuY29uZmlnLnVpLmFkZC52YWx1ZX08L2gyPik7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAnaDMnOlxyXG4gICAgICAgICAgICAgICAgaGVhZGVyU2l6ZSA9ICg8aDM+e3Byb2plY3QuY29uZmlnLnVpLmFkZC52YWx1ZX08L2gzPik7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAnaDQnOlxyXG4gICAgICAgICAgICAgICAgaGVhZGVyU2l6ZSA9ICg8aDQ+e3Byb2plY3QuY29uZmlnLnVpLmFkZC52YWx1ZX08L2g0Pik7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAnaDUnOlxyXG4gICAgICAgICAgICAgICAgaGVhZGVyU2l6ZSA9ICg8aDU+e3Byb2plY3QuY29uZmlnLnVpLmFkZC52YWx1ZX08L2g1Pik7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAnaDYnOlxyXG4gICAgICAgICAgICAgICAgaGVhZGVyU2l6ZSA9ICg8aDY+e3Byb2plY3QuY29uZmlnLnVpLmFkZC52YWx1ZX08L2g2Pik7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGEgY2xhc3NOYW1lPVwiZHJvcGRvd24taXRlbVwiIG9uQ2xpY2s9e3RoaXMuaGFuZGxlSGVhZGVyU2l6ZUNsaWNrfSA+XHJcbiAgICAgICAgICAgICAgICB7aGVhZGVyU2l6ZX1cclxuICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IEhlYWRlclNpemUgPSBjb25uZWN0KG1hcFN0YXRlVG9Qcm9wcywgbWFwRGlzcGF0Y2hUb1Byb3BzKShIZWFkZXJTaXplQ29tcG9uZW50KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IEhlYWRlclNpemU7IiwiaW1wb3J0IFJlYWN0LCB7IENvbXBvbmVudCB9IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gJ3JlYWN0LXJlZHV4JztcclxuaW1wb3J0IHsgc3RvcmUgfSBmcm9tICcuLi8uLi8uLi8uLi9jb21tb24vY29uZmlnL3JlZHV4L3JlZHV4LnN0b3JlJztcclxuaW1wb3J0IHsgdXBkYXRlUHJvamVjdENvbmZpZyB9IGZyb20gJy4uLy4uL2NvbmZpZy9yZWR1eC9yZWR1eC5hY3Rpb25zJztcclxuXHJcbmltcG9ydCBIZWFkZXJTaXplQ29tcG9uZW50IGZyb20gJy4vaGVhZGVyLXNpemUuY29tcG9uZW50JztcclxuXHJcbmNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9IChzdGF0ZSkgPT4gc3RhdGU7XHJcblxyXG5jb25zdCBtYXBEaXNwYXRjaFRvUHJvcHMgPSAoZGlzcGF0Y2gpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdXBkYXRlUHJvamVjdENvbmZpZzogcGF5bG9hZCA9PiBkaXNwYXRjaCh1cGRhdGVQcm9qZWN0Q29uZmlnKHBheWxvYWQpKVxyXG4gICAgfTtcclxufVxyXG5cclxuY2xhc3MgSGVhZGVyQ29tcG9uZW50IGV4dGVuZHMgQ29tcG9uZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG5cclxuICAgICAgICB0aGlzLnN0YXRlID0ge1xyXG4gICAgICAgICAgICBoZWFkZXJUZXh0OiAnJyxcclxuICAgICAgICAgICAgaW5wdXRDbGFzc05hbWU6ICdnLWJvcmRlci1jb2xvcicsXHJcbiAgICAgICAgICAgIGRyb3Bkb3duQ2xhc3NOYW1lOiAnYnRuIGRyb3Bkb3duLXRvZ2dsZSBzaGFkb3ctbm9uZScsXHJcbiAgICAgICAgICAgIGhlYWRlclNpemVzOiBbXHJcbiAgICAgICAgICAgICAgICAnaDYnLCAnaDUnLCAnaDQnLCAnaDMnLCAnaDInLCAnaDEnXHJcbiAgICAgICAgICAgIF1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmhhbmRsZUhlYWRlclRleHRDaGFuZ2UgPSB0aGlzLmhhbmRsZUhlYWRlclRleHRDaGFuZ2UuYmluZCh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVIZWFkZXJUZXh0Q2hhbmdlKGUpIHtcclxuICAgICAgICB2YXIgaW5wdXRDbGFzc05hbWUgPSAnZy1ib3JkZXItY29sb3InO1xyXG4gICAgICAgIHZhciBkcm9wZG93bkNsYXNzTmFtZSA9ICdidG4gZHJvcGRvd24tdG9nZ2xlIHNoYWRvdy1ub25lJztcclxuICAgICAgICBpZiAoZS50YXJnZXQudmFsdWUgJiYgZS50YXJnZXQudmFsdWUubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGlucHV0Q2xhc3NOYW1lICs9ICcgZy12YWxpZCc7XHJcbiAgICAgICAgICAgIGRyb3Bkb3duQ2xhc3NOYW1lICs9ICcgZy12YWxpZCc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5zdGF0ZSwge1xyXG4gICAgICAgICAgICBpbnB1dENsYXNzTmFtZTogaW5wdXRDbGFzc05hbWUsXHJcbiAgICAgICAgICAgIGRyb3Bkb3duQ2xhc3NOYW1lOiBkcm9wZG93bkNsYXNzTmFtZSxcclxuICAgICAgICAgICAgaGVhZGVyVGV4dDogZS50YXJnZXQudmFsdWVcclxuICAgICAgICB9KSk7XHJcblxyXG4gICAgICAgIGNvbnN0IHsgd29ya3NwYWNlIH0gPSBzdG9yZS5nZXRTdGF0ZSgpLmVuZ2luZVJlZHVjZXI7XHJcbiAgICAgICAgdGhpcy5wcm9wcy51cGRhdGVQcm9qZWN0Q29uZmlnKE9iamVjdC5hc3NpZ24oe30sIHdvcmtzcGFjZS5wcm9qZWN0LmNvbmZpZywge1xyXG4gICAgICAgICAgICB1aTogT2JqZWN0LmFzc2lnbih7fSwgd29ya3NwYWNlLnByb2plY3QuY29uZmlnLnVpLCB7XHJcbiAgICAgICAgICAgICAgICBhZGQ6IE9iamVjdC5hc3NpZ24oe30sIHdvcmtzcGFjZS5wcm9qZWN0LmNvbmZpZy51aS5hZGQsIHtcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogZS50YXJnZXQudmFsdWVcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IGlucHV0Q2xhc3NOYW1lLCBkcm9wZG93bkNsYXNzTmFtZSwgaGVhZGVyU2l6ZXMgfSA9IHRoaXMuc3RhdGU7XHJcbiAgICAgICAgY29uc3QgeyB3b3Jrc3BhY2UgfSA9IHN0b3JlLmdldFN0YXRlKCkuZW5naW5lUmVkdWNlcjtcclxuICAgICAgICBjb25zdCBwcm9qZWN0ID0gd29ya3NwYWNlLnByb2plY3Q7XHJcblxyXG4gICAgICAgIHZhciBoZWFkZXJTaXplID0gKDxoNj57dGhpcy5zdGF0ZS5oZWFkZXJUZXh0fTwvaDY+KTtcclxuICAgICAgICBpZiAocHJvamVjdC5jb25maWcudWkuYWRkLnRhZykge1xyXG4gICAgICAgICAgICBzd2l0Y2ggKHByb2plY3QuY29uZmlnLnVpLmFkZC50YWcpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgJ2gxJzpcclxuICAgICAgICAgICAgICAgICAgICBoZWFkZXJTaXplID0gKDxoMT57dGhpcy5zdGF0ZS5oZWFkZXJUZXh0fTwvaDE+KTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgJ2gyJzpcclxuICAgICAgICAgICAgICAgICAgICBoZWFkZXJTaXplID0gKDxoMj57dGhpcy5zdGF0ZS5oZWFkZXJUZXh0fTwvaDI+KTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgJ2gzJzpcclxuICAgICAgICAgICAgICAgICAgICBoZWFkZXJTaXplID0gKDxoMz57dGhpcy5zdGF0ZS5oZWFkZXJUZXh0fTwvaDM+KTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgJ2g0JzpcclxuICAgICAgICAgICAgICAgICAgICBoZWFkZXJTaXplID0gKDxoND57dGhpcy5zdGF0ZS5oZWFkZXJUZXh0fTwvaDQ+KTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgJ2g1JzpcclxuICAgICAgICAgICAgICAgICAgICBoZWFkZXJTaXplID0gKDxoNT57dGhpcy5zdGF0ZS5oZWFkZXJUZXh0fTwvaDU+KTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgJ2g2JzpcclxuICAgICAgICAgICAgICAgICAgICBoZWFkZXJTaXplID0gKDxoNj57dGhpcy5zdGF0ZS5oZWFkZXJUZXh0fTwvaDY+KTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJpbnB1dC1jb21wb25lbnRcIj5cclxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgY2xhc3NOYW1lPXtpbnB1dENsYXNzTmFtZX0gdHlwZT1cInRleHRcIiB2YWx1ZT17dGhpcy5zdGF0ZS5oZWFkZXJUZXh0fSBvbkNoYW5nZT17dGhpcy5oYW5kbGVIZWFkZXJUZXh0Q2hhbmdlfSAvPlxyXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImctbG9naW4tZm9ybS1pbnB1dC1wbGFjZWhvbGRlclwiPkhlYWRlciBUZXh0PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17dGhpcy5zdGF0ZS5oZWFkZXJUZXh0ICYmIHRoaXMuc3RhdGUuaGVhZGVyVGV4dC5sZW5ndGggPyAnaW5wdXQtY29tcG9uZW50IHNob3ctZHJvcGRvd24nIDogJ2lucHV0LWNvbXBvbmVudCBoaWRlLWRyb3Bkb3duJ30+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJkcm9wZG93blwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT17ZHJvcGRvd25DbGFzc05hbWV9IHR5cGU9XCJidXR0b25cIiBkYXRhLXRvZ2dsZT1cImRyb3Bkb3duXCIgYXJpYS1oYXNwb3B1cD1cInRydWVcIiBhcmlhLWV4cGFuZGVkPVwiZmFsc2VcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtoZWFkZXJTaXplfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+SGVhZGVyIFNpemU8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZHJvcGRvd24tbWVudVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge2hlYWRlclNpemVzLm1hcCgoaGVhZGVyLCBpKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICg8SGVhZGVyU2l6ZUNvbXBvbmVudCBrZXk9e2hlYWRlcn0gaGVhZGVyS2V5PXtoZWFkZXJ9IGhlYWRlclRleHQ9e3RoaXMuc3RhdGUuaGVhZGVyVGV4dH0gLz4pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IEhlYWRlciA9IGNvbm5lY3QobWFwU3RhdGVUb1Byb3BzLCBtYXBEaXNwYXRjaFRvUHJvcHMpKEhlYWRlckNvbXBvbmVudCk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBIZWFkZXI7Il0sInNvdXJjZVJvb3QiOiIifQ==