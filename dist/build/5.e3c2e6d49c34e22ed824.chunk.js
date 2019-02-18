(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[5],{

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
      addInputTag
    } = _config_redux_redux_store__WEBPACK_IMPORTED_MODULE_2__["store"].getState();
    var headerSize = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h6", null, this.state.headerText);

    if (addInputTag) {
      switch (addInputTag) {
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
      addInputValue
    } = _config_redux_redux_store__WEBPACK_IMPORTED_MODULE_2__["store"].getState();
    var headerSize = null;

    switch (this.props.headerKey) {
      case 'h1':
        headerSize = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h1", null, addInputValue);
        break;

      case 'h2':
        headerSize = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h2", null, addInputValue);
        break;

      case 'h3':
        headerSize = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h3", null, addInputValue);
        break;

      case 'h4':
        headerSize = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h4", null, addInputValue);
        break;

      case 'h5':
        headerSize = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h5", null, addInputValue);
        break;

      case 'h6':
        headerSize = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h6", null, addInputValue);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9lbmdpbmUvc3JjL2NvbXBvbmVudHMvYWRkL2hlYWRlci5jb21wb25lbnQuanMiLCJ3ZWJwYWNrOi8vLy4vZW5naW5lL3NyYy9jb21wb25lbnRzL2FkZC9oZWFkZXItc2l6ZS5jb21wb25lbnQuanMiXSwibmFtZXMiOlsibWFwU3RhdGVUb1Byb3BzIiwic3RhdGUiLCJtYXBEaXNwYXRjaFRvUHJvcHMiLCJkaXNwYXRjaCIsImFkZElucHV0VmFsdWVDaGFuZ2VkIiwicGF5bG9hZCIsIkhlYWRlckNvbXBvbmVudCIsIkNvbXBvbmVudCIsImNvbnN0cnVjdG9yIiwicHJvcHMiLCJoZWFkZXJUZXh0IiwiaW5wdXRDbGFzc05hbWUiLCJkcm9wZG93bkNsYXNzTmFtZSIsImhlYWRlclNpemVzIiwiaGFuZGxlSGVhZGVyVGV4dENoYW5nZSIsImJpbmQiLCJlIiwidGFyZ2V0IiwidmFsdWUiLCJsZW5ndGgiLCJzZXRTdGF0ZSIsIk9iamVjdCIsImFzc2lnbiIsInJlbmRlciIsImFkZElucHV0VGFnIiwic3RvcmUiLCJnZXRTdGF0ZSIsImhlYWRlclNpemUiLCJtYXAiLCJoZWFkZXIiLCJpIiwiSGVhZGVyIiwiY29ubmVjdCIsImFkZElucHV0VGFnQ2hhbmdlZCIsIkhlYWRlclNpemVDb21wb25lbnQiLCJoYW5kbGVIZWFkZXJTaXplQ2xpY2siLCJoZWFkZXJLZXkiLCJhZGRJbnB1dFZhbHVlIiwiSGVhZGVyU2l6ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7QUFFQSxNQUFNQSxlQUFlLEdBQUlDLEtBQUQsSUFBV0EsS0FBbkM7O0FBRUEsTUFBTUMsa0JBQWtCLEdBQUlDLFFBQUQsSUFBYztBQUNyQyxTQUFPO0FBQ0hDLHdCQUFvQixFQUFFQyxPQUFPLElBQUlGLFFBQVEsQ0FBQ0Msd0ZBQW9CLENBQUNDLE9BQUQsQ0FBckI7QUFEdEMs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TCxDQUEyQnBCLElBQTNCLENBQWdDLElBQWhDLENBQTdCO0FBQ0g7O0FBRURvQix1QkFBcUIsR0FBRztBQUNwQixTQUFLMUIsS0FBTCxDQUFXd0Isa0JBQVgsQ0FBOEIsS0FBS3hCLEtBQUwsQ0FBVzJCLFNBQXpDO0FBQ0g7O0FBRURiLFFBQU0sR0FBRztBQUNMLFVBQU07QUFBRWM7QUFBRixRQUFvQlosK0RBQUssQ0FBQ0MsUUFBTixFQUExQjtBQUVBLFFBQUlDLFVBQVUsR0FBRyxJQUFqQjs7QUFDQSxZQUFRLEtBQUtsQixLQUFMLENBQVcyQixTQUFuQjtBQUNJLFdBQUssSUFBTDtBQUNJVCxrQkFBVSxHQUFJLHVFQUFLVSxhQUFMLENBQWQ7QUFDQTs7QUFDSixXQUFLLElBQUw7QUFDSVYsa0JBQVUsR0FBSSx1RUFBS1UsYUFBTCxDQUFkO0FBQ0E7O0FBQ0osV0FBSyxJQUFMO0FBQ0lWLGtCQUFVLEdBQUksdUVBQUtVLGFBQUwsQ0FBZDtBQUNBOztBQUNKLFdBQUssSUFBTDtBQUNJVixrQkFBVSxHQUFJLHVFQUFLVSxhQUFMLENBQWQ7QUFDQTs7QUFDSixXQUFLLElBQUw7QUFDSVYsa0JBQVUsR0FBSSx1RUFBS1UsYUFBTCxDQUFkO0FBQ0E7O0FBQ0osV0FBSyxJQUFMO0FBQ0lWLGtCQUFVLEdBQUksdUVBQUtVLGFBQUwsQ0FBZDtBQUNBO0FBbEJSOztBQW9CQSxXQUNJO0FBQUcsZUFBUyxFQUFDLGVBQWI7QUFBNkIsYUFBTyxFQUFFLEtBQUtGO0FBQTNDLE9BQ0tSLFVBREwsQ0FESjtBQUtIOztBQTVDdUM7O0FBK0M1QyxNQUFNVyxVQUFVLEdBQUdOLDJEQUFPLENBQUNoQyxlQUFELEVBQWtCRSxrQkFBbEIsQ0FBUCxDQUE2Q2dDLG1CQUE3QyxDQUFuQjtBQUVlSSx5RUFBZixFIiwiZmlsZSI6ImJ1aWxkLzUuZTNjMmU2ZDQ5YzM0ZTIyZWQ4MjQuY2h1bmsuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50IH0gZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSAncmVhY3QtcmVkdXgnO1xyXG5pbXBvcnQgeyBzdG9yZSB9IGZyb20gJy4uLy4uL2NvbmZpZy9yZWR1eC9yZWR1eC5zdG9yZSc7XHJcbmltcG9ydCB7IGFkZElucHV0VmFsdWVDaGFuZ2VkIH0gZnJvbSAnLi4vLi4vY29uZmlnL3JlZHV4L3JlZHV4LmFjdGlvbnMnO1xyXG5cclxuaW1wb3J0IEhlYWRlclNpemVDb21wb25lbnQgZnJvbSAnLi9oZWFkZXItc2l6ZS5jb21wb25lbnQnO1xyXG5cclxuY29uc3QgbWFwU3RhdGVUb1Byb3BzID0gKHN0YXRlKSA9PiBzdGF0ZTtcclxuXHJcbmNvbnN0IG1hcERpc3BhdGNoVG9Qcm9wcyA9IChkaXNwYXRjaCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBhZGRJbnB1dFZhbHVlQ2hhbmdlZDogcGF5bG9hZCA9PiBkaXNwYXRjaChhZGRJbnB1dFZhbHVlQ2hhbmdlZChwYXlsb2FkKSlcclxuICAgIH07XHJcbn1cclxuXHJcbmNsYXNzIEhlYWRlckNvbXBvbmVudCBleHRlbmRzIENvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuXHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcclxuICAgICAgICAgICAgaGVhZGVyVGV4dDogJycsXHJcbiAgICAgICAgICAgIGlucHV0Q2xhc3NOYW1lOiAnZy1ib3JkZXItY29sb3InLFxyXG4gICAgICAgICAgICBkcm9wZG93bkNsYXNzTmFtZTogJ2J0biBkcm9wZG93bi10b2dnbGUgc2hhZG93LW5vbmUnLFxyXG4gICAgICAgICAgICBoZWFkZXJTaXplczogW1xyXG4gICAgICAgICAgICAgICAgJ2g2JywgJ2g1JywgJ2g0JywgJ2gzJywgJ2gyJywgJ2gxJ1xyXG4gICAgICAgICAgICBdXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5oYW5kbGVIZWFkZXJUZXh0Q2hhbmdlID0gdGhpcy5oYW5kbGVIZWFkZXJUZXh0Q2hhbmdlLmJpbmQodGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlSGVhZGVyVGV4dENoYW5nZShlKSB7XHJcbiAgICAgICAgdmFyIGlucHV0Q2xhc3NOYW1lID0gJ2ctYm9yZGVyLWNvbG9yJztcclxuICAgICAgICB2YXIgZHJvcGRvd25DbGFzc05hbWUgPSAnYnRuIGRyb3Bkb3duLXRvZ2dsZSBzaGFkb3ctbm9uZSc7XHJcbiAgICAgICAgaWYgKGUudGFyZ2V0LnZhbHVlICYmIGUudGFyZ2V0LnZhbHVlLmxlbmd0aCkge1xyXG4gICAgICAgICAgICBpbnB1dENsYXNzTmFtZSArPSAnIGctdmFsaWQnO1xyXG4gICAgICAgICAgICBkcm9wZG93bkNsYXNzTmFtZSArPSAnIGctdmFsaWQnO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnNldFN0YXRlKE9iamVjdC5hc3NpZ24oe30sIHRoaXMuc3RhdGUsIHtcclxuICAgICAgICAgICAgaW5wdXRDbGFzc05hbWU6IGlucHV0Q2xhc3NOYW1lLFxyXG4gICAgICAgICAgICBkcm9wZG93bkNsYXNzTmFtZTogZHJvcGRvd25DbGFzc05hbWUsXHJcbiAgICAgICAgICAgIGhlYWRlclRleHQ6IGUudGFyZ2V0LnZhbHVlXHJcbiAgICAgICAgfSkpO1xyXG5cclxuICAgICAgICB0aGlzLnByb3BzLmFkZElucHV0VmFsdWVDaGFuZ2VkKGUudGFyZ2V0LnZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyBpbnB1dENsYXNzTmFtZSwgZHJvcGRvd25DbGFzc05hbWUsIGhlYWRlclNpemVzIH0gPSB0aGlzLnN0YXRlO1xyXG4gICAgICAgIGNvbnN0IHsgYWRkSW5wdXRUYWcgfSA9IHN0b3JlLmdldFN0YXRlKCk7XHJcblxyXG4gICAgICAgIHZhciBoZWFkZXJTaXplID0gKDxoNj57dGhpcy5zdGF0ZS5oZWFkZXJUZXh0fTwvaDY+KTtcclxuICAgICAgICBpZiAoYWRkSW5wdXRUYWcpIHtcclxuICAgICAgICAgICAgc3dpdGNoIChhZGRJbnB1dFRhZykge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnaDEnOlxyXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlclNpemUgPSAoPGgxPnt0aGlzLnN0YXRlLmhlYWRlclRleHR9PC9oMT4pO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnaDInOlxyXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlclNpemUgPSAoPGgyPnt0aGlzLnN0YXRlLmhlYWRlclRleHR9PC9oMj4pO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnaDMnOlxyXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlclNpemUgPSAoPGgzPnt0aGlzLnN0YXRlLmhlYWRlclRleHR9PC9oMz4pO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnaDQnOlxyXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlclNpemUgPSAoPGg0Pnt0aGlzLnN0YXRlLmhlYWRlclRleHR9PC9oND4pO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnaDUnOlxyXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlclNpemUgPSAoPGg1Pnt0aGlzLnN0YXRlLmhlYWRlclRleHR9PC9oNT4pO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnaDYnOlxyXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlclNpemUgPSAoPGg2Pnt0aGlzLnN0YXRlLmhlYWRlclRleHR9PC9oNj4pO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImlucHV0LWNvbXBvbmVudFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCBjbGFzc05hbWU9e2lucHV0Q2xhc3NOYW1lfSB0eXBlPVwidGV4dFwiIHZhbHVlPXt0aGlzLnN0YXRlLmhlYWRlclRleHR9IG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUhlYWRlclRleHRDaGFuZ2V9IC8+XHJcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZy1sb2dpbi1mb3JtLWlucHV0LXBsYWNlaG9sZGVyXCI+SGVhZGVyIFRleHQ8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXt0aGlzLnN0YXRlLmhlYWRlclRleHQgJiYgdGhpcy5zdGF0ZS5oZWFkZXJUZXh0Lmxlbmd0aCA/ICdpbnB1dC1jb21wb25lbnQgc2hvdy1kcm9wZG93bicgOiAnaW5wdXQtY29tcG9uZW50IGhpZGUtZHJvcGRvd24nfT5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImRyb3Bkb3duXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPXtkcm9wZG93bkNsYXNzTmFtZX0gdHlwZT1cImJ1dHRvblwiIGRhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIiBhcmlhLWhhc3BvcHVwPVwidHJ1ZVwiIGFyaWEtZXhwYW5kZWQ9XCJmYWxzZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge2hlYWRlclNpemV9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj5IZWFkZXIgU2l6ZTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJkcm9wZG93bi1tZW51XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7aGVhZGVyU2l6ZXMubWFwKChoZWFkZXIsIGkpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKDxIZWFkZXJTaXplQ29tcG9uZW50IGtleT17aGVhZGVyfSBoZWFkZXJLZXk9e2hlYWRlcn0gaGVhZGVyVGV4dD17dGhpcy5zdGF0ZS5oZWFkZXJUZXh0fSAvPik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgSGVhZGVyID0gY29ubmVjdChtYXBTdGF0ZVRvUHJvcHMsIG1hcERpc3BhdGNoVG9Qcm9wcykoSGVhZGVyQ29tcG9uZW50KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IEhlYWRlcjsiLCJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50IH0gZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSAncmVhY3QtcmVkdXgnO1xyXG5pbXBvcnQgeyBzdG9yZSB9IGZyb20gJy4uLy4uL2NvbmZpZy9yZWR1eC9yZWR1eC5zdG9yZSc7XHJcbmltcG9ydCB7IGFkZElucHV0VGFnQ2hhbmdlZCB9IGZyb20gJy4uLy4uL2NvbmZpZy9yZWR1eC9yZWR1eC5hY3Rpb25zJztcclxuXHJcbmNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9IChzdGF0ZSkgPT4gc3RhdGU7XHJcblxyXG5jb25zdCBtYXBEaXNwYXRjaFRvUHJvcHMgPSAoZGlzcGF0Y2gpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgYWRkSW5wdXRUYWdDaGFuZ2VkOiBwYXlsb2FkID0+IGRpc3BhdGNoKGFkZElucHV0VGFnQ2hhbmdlZChwYXlsb2FkKSlcclxuICAgIH07XHJcbn1cclxuXHJcbmNsYXNzIEhlYWRlclNpemVDb21wb25lbnQgZXh0ZW5kcyBDb21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcblxyXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XHJcblxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuaGFuZGxlSGVhZGVyU2l6ZUNsaWNrID0gdGhpcy5oYW5kbGVIZWFkZXJTaXplQ2xpY2suYmluZCh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVIZWFkZXJTaXplQ2xpY2soKSB7XHJcbiAgICAgICAgdGhpcy5wcm9wcy5hZGRJbnB1dFRhZ0NoYW5nZWQodGhpcy5wcm9wcy5oZWFkZXJLZXkpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IGFkZElucHV0VmFsdWUgfSA9IHN0b3JlLmdldFN0YXRlKCk7XHJcblxyXG4gICAgICAgIHZhciBoZWFkZXJTaXplID0gbnVsbDtcclxuICAgICAgICBzd2l0Y2ggKHRoaXMucHJvcHMuaGVhZGVyS2V5KSB7XHJcbiAgICAgICAgICAgIGNhc2UgJ2gxJzpcclxuICAgICAgICAgICAgICAgIGhlYWRlclNpemUgPSAoPGgxPnthZGRJbnB1dFZhbHVlfTwvaDE+KTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICdoMic6XHJcbiAgICAgICAgICAgICAgICBoZWFkZXJTaXplID0gKDxoMj57YWRkSW5wdXRWYWx1ZX08L2gyPik7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAnaDMnOlxyXG4gICAgICAgICAgICAgICAgaGVhZGVyU2l6ZSA9ICg8aDM+e2FkZElucHV0VmFsdWV9PC9oMz4pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ2g0JzpcclxuICAgICAgICAgICAgICAgIGhlYWRlclNpemUgPSAoPGg0PnthZGRJbnB1dFZhbHVlfTwvaDQ+KTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICdoNSc6XHJcbiAgICAgICAgICAgICAgICBoZWFkZXJTaXplID0gKDxoNT57YWRkSW5wdXRWYWx1ZX08L2g1Pik7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAnaDYnOlxyXG4gICAgICAgICAgICAgICAgaGVhZGVyU2l6ZSA9ICg8aDY+e2FkZElucHV0VmFsdWV9PC9oNj4pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxhIGNsYXNzTmFtZT1cImRyb3Bkb3duLWl0ZW1cIiBvbkNsaWNrPXt0aGlzLmhhbmRsZUhlYWRlclNpemVDbGlja30gPlxyXG4gICAgICAgICAgICAgICAge2hlYWRlclNpemV9XHJcbiAgICAgICAgICAgIDwvYT5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBIZWFkZXJTaXplID0gY29ubmVjdChtYXBTdGF0ZVRvUHJvcHMsIG1hcERpc3BhdGNoVG9Qcm9wcykoSGVhZGVyU2l6ZUNvbXBvbmVudCk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBIZWFkZXJTaXplOyJdLCJzb3VyY2VSb290IjoiIn0=