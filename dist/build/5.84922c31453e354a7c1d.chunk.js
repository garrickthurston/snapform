(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[5],{

/***/ "0h61":
/*!**********************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js??ref--6-1!./node_modules/sass-loader/lib/loader.js??ref--6-2!./engine/assets/style/components/item/item.scss ***!
  \**********************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../../../node_modules/css-loader/dist/runtime/api.js */ "JPst")(true);
// Module
exports.push([module.i, ".item-container {\n  position: absolute;\n  border: 1px solid #787878;\n  background: rgba(255, 255, 255, 0.9);\n  padding: 4px;\n  cursor: move; }\n  .item-container h1, .item-container h2, .item-container h3, .item-container h4, .item-container h5, .item-container h6 {\n    margin: 0; }\n  .item-container.focus {\n    background: rgba(240, 240, 240, 0.9); }\n", "",{"version":3,"sources":["C:/Users/garrick/source/repos/snapform/engine/assets/style/components/item/engine/assets/style/components/item/item.scss"],"names":[],"mappings":"AAAA;EACI,kBAAkB;EAClB,yBAAyB;EACzB,oCAAoC;EACpC,YAAY;EACZ,YAAY,EAAA;EALhB;IAQQ,SAAS,EAAA;EARjB;IAYQ,oCAAoC,EAAA","file":"item.scss","sourcesContent":[".item-container {\r\n    position: absolute;\r\n    border: 1px solid #787878;\r\n    background: rgba(255, 255, 255, 0.9);\r\n    padding: 4px;\r\n    cursor: move;\r\n\r\n    h1, h2, h3, h4, h5, h6 {\r\n        margin: 0;\r\n    }\r\n\r\n    &.focus {\r\n        background: rgba(240, 240, 240, 0.9);\r\n    }\r\n}"],"sourceRoot":""}]);



/***/ }),

/***/ "P3Xs":
/*!******************************************************!*\
  !*** ./engine/src/components/item/item.component.js ***!
  \******************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ "/MKj");
/* harmony import */ var _config_redux_redux_store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../config/redux/redux.store */ "ERX6");
/* harmony import */ var _assets_style_components_item_item_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../assets/style/components/item/item.scss */ "c+0k");
/* harmony import */ var _assets_style_components_item_item_scss__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_assets_style_components_item_item_scss__WEBPACK_IMPORTED_MODULE_3__);





const mapStateToProps = state => state;

const defaultItemContainerClassName = 'item-container';

class ItemComponent extends react__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  constructor(props) {
    super(props);
    this.state = {
      itemContainerClassName: defaultItemContainerClassName
    };
    this.handleItemContainerClick = this.handleItemContainerClick.bind(this);
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
  }

  componentWillMount() {
    document.addEventListener('mousedown', this.handleOutsideClick, false);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleOutsideClick, false);
  }

  handleOutsideClick(e) {
    if (this.item.contains(e.target)) {
      return;
    }

    this.setState(Object.assign({}, this.state, {
      itemContainerClassName: defaultItemContainerClassName
    }));
  }

  handleItemContainerClick(e) {
    this.setState(Object.assign({}, this.state, {
      itemContainerClassName: defaultItemContainerClassName + ' focus'
    }));
  }

  render() {
    const {
      itemContainerClassName
    } = this.state;
    const TagName = `${this.props.tag.name}`;
    var tag = null;

    if (this.props.tag.innerValue) {
      tag = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(TagName, null, this.props.tag.value);
    } else {
      tag = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(TagName, {
        value: this.props.tag.value
      });
    }

    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: itemContainerClassName,
      ref: item => this.item = item,
      onClick: this.handleItemContainerClick,
      style: {
        top: this.props.y,
        left: this.props.x,
        width: this.props.width,
        height: this.props.height
      }
    }, tag);
  }

}

const Item = Object(react_redux__WEBPACK_IMPORTED_MODULE_1__["connect"])(mapStateToProps)(ItemComponent);
/* harmony default export */ __webpack_exports__["default"] = (Item);

/***/ }),

/***/ "c+0k":
/*!*******************************************************!*\
  !*** ./engine/assets/style/components/item/item.scss ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../../../../node_modules/css-loader/dist/cjs.js??ref--6-1!../../../../../node_modules/sass-loader/lib/loader.js??ref--6-2!./item.scss */ "0h61");

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(/*! ../../../../../node_modules/style-loader/lib/addStyles.js */ "aET+")(content, options);

if(content.locals) module.exports = content.locals;

if(false) {}

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9lbmdpbmUvYXNzZXRzL3N0eWxlL2NvbXBvbmVudHMvaXRlbS9pdGVtLnNjc3MiLCJ3ZWJwYWNrOi8vLy4vZW5naW5lL3NyYy9jb21wb25lbnRzL2l0ZW0vaXRlbS5jb21wb25lbnQuanMiLCJ3ZWJwYWNrOi8vLy4vZW5naW5lL2Fzc2V0cy9zdHlsZS9jb21wb25lbnRzL2l0ZW0vaXRlbS5zY3NzP2M3ODciXSwibmFtZXMiOlsibWFwU3RhdGVUb1Byb3BzIiwic3RhdGUiLCJkZWZhdWx0SXRlbUNvbnRhaW5lckNsYXNzTmFtZSIsIkl0ZW1Db21wb25lbnQiLCJDb21wb25lbnQiLCJjb25zdHJ1Y3RvciIsInByb3BzIiwiaXRlbUNvbnRhaW5lckNsYXNzTmFtZSIsImhhbmRsZUl0ZW1Db250YWluZXJDbGljayIsImJpbmQiLCJoYW5kbGVPdXRzaWRlQ2xpY2siLCJjb21wb25lbnRXaWxsTW91bnQiLCJkb2N1bWVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJjb21wb25lbnRXaWxsVW5tb3VudCIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJlIiwiaXRlbSIsImNvbnRhaW5zIiwidGFyZ2V0Iiwic2V0U3RhdGUiLCJPYmplY3QiLCJhc3NpZ24iLCJyZW5kZXIiLCJUYWdOYW1lIiwidGFnIiwibmFtZSIsImlubmVyVmFsdWUiLCJ2YWx1ZSIsInRvcCIsInkiLCJsZWZ0IiwieCIsIndpZHRoIiwiaGVpZ2h0IiwiSXRlbSIsImNvbm5lY3QiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBLDJCQUEyQixtQkFBTyxDQUFDLHdFQUE0RDtBQUMvRjtBQUNBLGNBQWMsUUFBUyxvQkFBb0IsdUJBQXVCLDhCQUE4Qix5Q0FBeUMsaUJBQWlCLGlCQUFpQixFQUFFLDRIQUE0SCxnQkFBZ0IsRUFBRSwyQkFBMkIsMkNBQTJDLEVBQUUsU0FBUywrS0FBK0ssWUFBWSxhQUFhLGFBQWEsV0FBVyxlQUFlLE1BQU0sZUFBZSxNQUFNLHlFQUF5RSwyQkFBMkIsa0NB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UCxDQUF5QkcsYUFBekIsQ0FBYjtBQUNlZ0MsbUVBQWYsRTs7Ozs7Ozs7Ozs7O0FDM0VBLGNBQWMsbUJBQU8sQ0FBQyx1SkFBNEk7O0FBRWxLLDRDQUE0QyxRQUFTOztBQUVyRDtBQUNBOzs7O0FBSUEsZUFBZTs7QUFFZjtBQUNBOztBQUVBLGFBQWEsbUJBQU8sQ0FBQyx1RUFBNEQ7O0FBRWpGOztBQUVBLEdBQUcsS0FBVSxFQUFFLEUiLCJmaWxlIjoiYnVpbGQvNS44NDkyMmMzMTQ1M2UzNTRhN2MxZC5jaHVuay5qcyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzXCIpKHRydWUpO1xuLy8gTW9kdWxlXG5leHBvcnRzLnB1c2goW21vZHVsZS5pZCwgXCIuaXRlbS1jb250YWluZXIge1xcbiAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgYm9yZGVyOiAxcHggc29saWQgIzc4Nzg3ODtcXG4gIGJhY2tncm91bmQ6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC45KTtcXG4gIHBhZGRpbmc6IDRweDtcXG4gIGN1cnNvcjogbW92ZTsgfVxcbiAgLml0ZW0tY29udGFpbmVyIGgxLCAuaXRlbS1jb250YWluZXIgaDIsIC5pdGVtLWNvbnRhaW5lciBoMywgLml0ZW0tY29udGFpbmVyIGg0LCAuaXRlbS1jb250YWluZXIgaDUsIC5pdGVtLWNvbnRhaW5lciBoNiB7XFxuICAgIG1hcmdpbjogMDsgfVxcbiAgLml0ZW0tY29udGFpbmVyLmZvY3VzIHtcXG4gICAgYmFja2dyb3VuZDogcmdiYSgyNDAsIDI0MCwgMjQwLCAwLjkpOyB9XFxuXCIsIFwiXCIse1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wiQzovVXNlcnMvZ2Fycmljay9zb3VyY2UvcmVwb3Mvc25hcGZvcm0vZW5naW5lL2Fzc2V0cy9zdHlsZS9jb21wb25lbnRzL2l0ZW0vZW5naW5lL2Fzc2V0cy9zdHlsZS9jb21wb25lbnRzL2l0ZW0vaXRlbS5zY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUFBO0VBQ0ksa0JBQWtCO0VBQ2xCLHlCQUF5QjtFQUN6QixvQ0FBb0M7RUFDcEMsWUFBWTtFQUNaLFlBQVksRUFBQTtFQUxoQjtJQVFRLFNBQVMsRUFBQTtFQVJqQjtJQVlRLG9DQUFvQyxFQUFBXCIsXCJmaWxlXCI6XCJpdGVtLnNjc3NcIixcInNvdXJjZXNDb250ZW50XCI6W1wiLml0ZW0tY29udGFpbmVyIHtcXHJcXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xcclxcbiAgICBib3JkZXI6IDFweCBzb2xpZCAjNzg3ODc4O1xcclxcbiAgICBiYWNrZ3JvdW5kOiByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuOSk7XFxyXFxuICAgIHBhZGRpbmc6IDRweDtcXHJcXG4gICAgY3Vyc29yOiBtb3ZlO1xcclxcblxcclxcbiAgICBoMSwgaDIsIGgzLCBoNCwgaDUsIGg2IHtcXHJcXG4gICAgICAgIG1hcmdpbjogMDtcXHJcXG4gICAgfVxcclxcblxcclxcbiAgICAmLmZvY3VzIHtcXHJcXG4gICAgICAgIGJhY2tncm91bmQ6IHJnYmEoMjQwLCAyNDAsIDI0MCwgMC45KTtcXHJcXG4gICAgfVxcclxcbn1cIl0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcblxuIiwiaW1wb3J0IFJlYWN0LCB7IENvbXBvbmVudCB9IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gJ3JlYWN0LXJlZHV4JztcclxuaW1wb3J0IHsgc3RvcmUgfSBmcm9tICcuLi8uLi9jb25maWcvcmVkdXgvcmVkdXguc3RvcmUnO1xyXG5cclxuaW1wb3J0ICcuLi8uLi8uLi9hc3NldHMvc3R5bGUvY29tcG9uZW50cy9pdGVtL2l0ZW0uc2Nzcyc7XHJcblxyXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSAoc3RhdGUpID0+IHN0YXRlO1xyXG5cclxuY29uc3QgZGVmYXVsdEl0ZW1Db250YWluZXJDbGFzc05hbWUgPSAnaXRlbS1jb250YWluZXInO1xyXG5cclxuY2xhc3MgSXRlbUNvbXBvbmVudCBleHRlbmRzIENvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuXHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcclxuICAgICAgICAgICAgaXRlbUNvbnRhaW5lckNsYXNzTmFtZTogZGVmYXVsdEl0ZW1Db250YWluZXJDbGFzc05hbWVcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmhhbmRsZUl0ZW1Db250YWluZXJDbGljayA9IHRoaXMuaGFuZGxlSXRlbUNvbnRhaW5lckNsaWNrLmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVPdXRzaWRlQ2xpY2sgPSB0aGlzLmhhbmRsZU91dHNpZGVDbGljay5iaW5kKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbXBvbmVudFdpbGxNb3VudCgpIHtcclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLmhhbmRsZU91dHNpZGVDbGljaywgZmFsc2UpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xyXG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMuaGFuZGxlT3V0c2lkZUNsaWNrLCBmYWxzZSk7XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlT3V0c2lkZUNsaWNrKGUpIHtcclxuICAgICAgICBpZiAodGhpcy5pdGVtLmNvbnRhaW5zKGUudGFyZ2V0KSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnNldFN0YXRlKE9iamVjdC5hc3NpZ24oe30sIHRoaXMuc3RhdGUsIHtcclxuICAgICAgICAgICAgaXRlbUNvbnRhaW5lckNsYXNzTmFtZTogZGVmYXVsdEl0ZW1Db250YWluZXJDbGFzc05hbWVcclxuICAgICAgICB9KSk7XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlSXRlbUNvbnRhaW5lckNsaWNrKGUpIHtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKE9iamVjdC5hc3NpZ24oe30sIHRoaXMuc3RhdGUsIHtcclxuICAgICAgICAgICAgaXRlbUNvbnRhaW5lckNsYXNzTmFtZTogZGVmYXVsdEl0ZW1Db250YWluZXJDbGFzc05hbWUgKyAnIGZvY3VzJ1xyXG4gICAgICAgIH0pKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyBpdGVtQ29udGFpbmVyQ2xhc3NOYW1lIH0gPSB0aGlzLnN0YXRlO1xyXG4gICAgICAgIGNvbnN0IFRhZ05hbWUgPSBgJHt0aGlzLnByb3BzLnRhZy5uYW1lfWA7XHJcblxyXG4gICAgICAgIHZhciB0YWcgPSBudWxsO1xyXG4gICAgICAgIGlmICh0aGlzLnByb3BzLnRhZy5pbm5lclZhbHVlKSB7XHJcbiAgICAgICAgICAgIHRhZyA9ICg8VGFnTmFtZT57dGhpcy5wcm9wcy50YWcudmFsdWV9PC9UYWdOYW1lPilcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0YWcgPSAoPFRhZ05hbWUgdmFsdWU9e3RoaXMucHJvcHMudGFnLnZhbHVlfT48L1RhZ05hbWU+KVxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e2l0ZW1Db250YWluZXJDbGFzc05hbWV9XHJcbiAgICAgICAgICAgICAgICByZWY9e2l0ZW0gPT4gdGhpcy5pdGVtID0gaXRlbX1cclxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuaGFuZGxlSXRlbUNvbnRhaW5lckNsaWNrfVxyXG4gICAgICAgICAgICAgICAgc3R5bGU9e3sgXHJcbiAgICAgICAgICAgICAgICAgICAgdG9wOiB0aGlzLnByb3BzLnksIFxyXG4gICAgICAgICAgICAgICAgICAgIGxlZnQ6IHRoaXMucHJvcHMueCxcclxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogdGhpcy5wcm9wcy53aWR0aCxcclxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IHRoaXMucHJvcHMuaGVpZ2h0XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0+XHJcbiAgICAgICAgICAgICAgICB7dGFnfVxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBJdGVtID0gY29ubmVjdChtYXBTdGF0ZVRvUHJvcHMpKEl0ZW1Db21wb25lbnQpO1xyXG5leHBvcnQgZGVmYXVsdCBJdGVtOyIsIlxudmFyIGNvbnRlbnQgPSByZXF1aXJlKFwiISEuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcz8/cmVmLS02LTEhLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2xpYi9sb2FkZXIuanM/P3JlZi0tNi0yIS4vaXRlbS5zY3NzXCIpO1xuXG5pZih0eXBlb2YgY29udGVudCA9PT0gJ3N0cmluZycpIGNvbnRlbnQgPSBbW21vZHVsZS5pZCwgY29udGVudCwgJyddXTtcblxudmFyIHRyYW5zZm9ybTtcbnZhciBpbnNlcnRJbnRvO1xuXG5cblxudmFyIG9wdGlvbnMgPSB7XCJobXJcIjp0cnVlfVxuXG5vcHRpb25zLnRyYW5zZm9ybSA9IHRyYW5zZm9ybVxub3B0aW9ucy5pbnNlcnRJbnRvID0gdW5kZWZpbmVkO1xuXG52YXIgdXBkYXRlID0gcmVxdWlyZShcIiEuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2xpYi9hZGRTdHlsZXMuanNcIikoY29udGVudCwgb3B0aW9ucyk7XG5cbmlmKGNvbnRlbnQubG9jYWxzKSBtb2R1bGUuZXhwb3J0cyA9IGNvbnRlbnQubG9jYWxzO1xuXG5pZihtb2R1bGUuaG90KSB7XG5cdG1vZHVsZS5ob3QuYWNjZXB0KFwiISEuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcz8/cmVmLS02LTEhLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2xpYi9sb2FkZXIuanM/P3JlZi0tNi0yIS4vaXRlbS5zY3NzXCIsIGZ1bmN0aW9uKCkge1xuXHRcdHZhciBuZXdDb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanM/P3JlZi0tNi0xIS4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9saWIvbG9hZGVyLmpzPz9yZWYtLTYtMiEuL2l0ZW0uc2Nzc1wiKTtcblxuXHRcdGlmKHR5cGVvZiBuZXdDb250ZW50ID09PSAnc3RyaW5nJykgbmV3Q29udGVudCA9IFtbbW9kdWxlLmlkLCBuZXdDb250ZW50LCAnJ11dO1xuXG5cdFx0dmFyIGxvY2FscyA9IChmdW5jdGlvbihhLCBiKSB7XG5cdFx0XHR2YXIga2V5LCBpZHggPSAwO1xuXG5cdFx0XHRmb3Ioa2V5IGluIGEpIHtcblx0XHRcdFx0aWYoIWIgfHwgYVtrZXldICE9PSBiW2tleV0pIHJldHVybiBmYWxzZTtcblx0XHRcdFx0aWR4Kys7XG5cdFx0XHR9XG5cblx0XHRcdGZvcihrZXkgaW4gYikgaWR4LS07XG5cblx0XHRcdHJldHVybiBpZHggPT09IDA7XG5cdFx0fShjb250ZW50LmxvY2FscywgbmV3Q29udGVudC5sb2NhbHMpKTtcblxuXHRcdGlmKCFsb2NhbHMpIHRocm93IG5ldyBFcnJvcignQWJvcnRpbmcgQ1NTIEhNUiBkdWUgdG8gY2hhbmdlZCBjc3MtbW9kdWxlcyBsb2NhbHMuJyk7XG5cblx0XHR1cGRhdGUobmV3Q29udGVudCk7XG5cdH0pO1xuXG5cdG1vZHVsZS5ob3QuZGlzcG9zZShmdW5jdGlvbigpIHsgdXBkYXRlKCk7IH0pO1xufSJdLCJzb3VyY2VSb290IjoiIn0=