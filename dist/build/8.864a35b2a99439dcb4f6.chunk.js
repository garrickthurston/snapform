(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[8],{

/***/ "ct0m":
/*!*************************************************************!*\
  !*** ./client/engine/src/components/item/item.component.js ***!
  \*************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ "/MKj");
/* harmony import */ var _config_redux_redux_store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../config/redux/redux.store */ "O7K5");
/* harmony import */ var _config_redux_redux_actions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../config/redux/redux.actions */ "nymR");
/* harmony import */ var _assets_style_components_item_item_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../assets/style/components/item/item.scss */ "tFBN");
/* harmony import */ var _assets_style_components_item_item_scss__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_assets_style_components_item_item_scss__WEBPACK_IMPORTED_MODULE_4__);
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }







const mapStateToProps = state => state;

const mapDispatchToProps = dispatch => {
  return {
    updateProject: payload => dispatch(Object(_config_redux_redux_actions__WEBPACK_IMPORTED_MODULE_3__["updateProject"])(payload)),
    updateProjectItems: payload => dispatch(Object(_config_redux_redux_actions__WEBPACK_IMPORTED_MODULE_3__["updateProjectItems"])(payload)),
    updateProjectConfig: payload => dispatch(Object(_config_redux_redux_actions__WEBPACK_IMPORTED_MODULE_3__["updateProjectConfig"])(payload))
  };
};

const defaultItemContainerClassName = 'item-container';

class ItemComponent extends react__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  constructor(props) {
    super(props);

    _defineProperty(this, "dragging", false);

    _defineProperty(this, "dragOffsetX", 0);

    _defineProperty(this, "dragOffsetY", 0);

    const TagName = `${this.props.tag.name}`;
    var tag = null;

    if (this.props.tag.innerValue) {
      tag = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(TagName, null, this.props.tag.value);
    } else {
      tag = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(TagName, {
        value: this.props.tag.value
      });
    }

    const {
      workspace
    } = _config_redux_redux_store__WEBPACK_IMPORTED_MODULE_2__["store"].getState();
    const project = workspace.project;
    this.state = {
      info: project.items[this.props.uid],
      itemContainerClassName: defaultItemContainerClassName,
      tag
    };
    this.handleItemContainerClick = this.handleItemContainerClick.bind(this);
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
    this.drag = this.drag.bind(this);
    this.handleDragStart = this.handleDragStart.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
    this.handleDragEnd = this.handleDragEnd.bind(this);
    this.mousemove = this.mousemove.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.removeItem = this.removeItem.bind(this);
  }

  componentWillMount() {
    document.addEventListener('mousedown', this.handleOutsideClick, false);
    document.addEventListener('mousemove', this.mousemove, false);
    document.addEventListener('keydown', this.handleKeyDown, false);
  }

  componentDidMount() {
    this.dragImg = new Image(0, 0);
    this.dragImg.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleOutsideClick, false);
    document.removeEventListener('mousemove', this.mousemouve, false);
    document.removeEventListener('keydown', this.handleKeyDown, false);
  }

  handleOutsideClick(e) {
    if (this.item.contains(e.target)) {
      return;
    }

    this.setState(Object.assign({}, this.state, {
      hasFocus: false,
      itemContainerClassName: defaultItemContainerClassName
    }));
  }

  handleItemContainerClick() {
    this.setState(Object.assign({}, this.state, {
      hasFocus: true,
      itemContainerClassName: defaultItemContainerClassName + ' focus'
    }));
    const {
      workspace
    } = _config_redux_redux_store__WEBPACK_IMPORTED_MODULE_2__["store"].getState();
    var items = workspace.project.items;

    if (items[this.props.uid]) {
      const current_z = items[this.props.uid].z;
      var top_z = current_z;

      for (var key in items) {
        if (key !== this.props.uid && items[key].z > current_z) {
          if (items[key].z > top_z) {
            top_z = items[key].z;
          }

          items[key].z -= 1;
        }
      }

      items[this.props.uid].z = top_z;
      this.props.updateProjectItems(items);
    }
  }

  handleDragStart(e) {
    this.handleItemContainerClick();
    e.dataTransfer.setDragImage(this.dragImg, 0, 0);
    e.target.style.cursor = 'move';
    const {
      workspace
    } = _config_redux_redux_store__WEBPACK_IMPORTED_MODULE_2__["store"].getState();
    const container = workspace.project.container.getBoundingClientRect();
    const item = workspace.project.items[this.props.uid];
    this.dragging = true;
    this.dragOffsetX = item.x - (e.clientX - container.left);
    this.dragOffsetY = item.y - (e.clientY - container.top);
    this.props.updateProjectConfig(Object.assign({}, workspace.project.config, {
      ui: Object.assign({}, workspace.project.config.ui, {
        g_class_list: 'gid hidden'
      })
    }));
  }

  handleDrag(e) {
    this.drag(e);
  }

  async handleDragEnd(e) {
    var info = this.drag(e);
    const {
      workspace
    } = _config_redux_redux_store__WEBPACK_IMPORTED_MODULE_2__["store"].getState();
    this.dragging = false;
    this.props.updateProjectConfig(Object.assign({}, workspace.project.config, {
      ui: Object.assign({}, workspace.project.config.ui, {
        g_class_list: 'gid'
      })
    }));
    this.props.updateProject({
      path: this.props.uid,
      value: info
    });
    this.item.dispatchEvent(new CustomEvent('sf.workspace.project.update', {
      bubbles: true,
      detail: {
        workspace_id: workspace.id,
        project: workspace.project
      }
    }));
  }

  drag(e) {
    const {
      workspace
    } = _config_redux_redux_store__WEBPACK_IMPORTED_MODULE_2__["store"].getState();
    const container = workspace.project.container.getBoundingClientRect();
    const defaultWidth = workspace.project.config.cellWidth;
    const defaultHeight = workspace.project.config.cellHeight;
    const x = Math.floor((e.clientX - (container.left - this.dragOffsetX)) / defaultWidth) * defaultWidth;
    const y = Math.floor((e.clientY - (container.top - this.dragOffsetY)) / defaultHeight) * defaultHeight;
    var left = x > 0 ? x : 0;
    var top = y > 0 ? y : 0;
    const rect = this.item.getBoundingClientRect();
    const itemOffsetLeft = left + rect.width;
    const itemOffsetTop = top + rect.height;

    if (itemOffsetLeft > container.width) {
      left = Math.floor((container.width - rect.width) / defaultWidth) * defaultWidth;
    }

    if (itemOffsetTop > container.height) {
      top = Math.floor((container.height - rect.height) / defaultHeight) * defaultHeight;
    }

    const info = Object.assign({}, this.state.info, {
      x: left,
      y: top
    });
    this.setState(Object.assign({}, this.state, {
      info
    }));
    return info;
  }

  mousemove(e) {
    if (this.dragging) {
      e.target.style.cursor = 'move';
    }
  }

  async handleKeyDown(e) {
    if (!this.state.hasFocus) {
      return;
    }

    const rect = this.item.getBoundingClientRect();
    const {
      workspace
    } = _config_redux_redux_store__WEBPACK_IMPORTED_MODULE_2__["store"].getState();
    const container = workspace.project.container.getBoundingClientRect();
    var info = this.state.info;
    var save = false;
    var x, y;

    switch (e.keyCode) {
      case 37:
        // left
        e.preventDefault();
        x = info.x - workspace.project.config.cellWidth;

        if (x >= 0) {
          info.x = x;
          save = true;
        }

        break;

      case 38:
        // up
        e.preventDefault();
        y = info.y - workspace.project.config.cellHeight;

        if (y >= 0) {
          info.y = y;
          save = true;
        }

        break;

      case 39:
        // right
        e.preventDefault();
        x = info.x + workspace.project.config.cellWidth;

        if (x + rect.width <= container.width) {
          info.x = x;
          save = true;
        }

        break;

      case 40:
        // down
        e.preventDefault();
        y = info.y + workspace.project.config.cellHeight;

        if (y + rect.height <= container.height) {
          info.y = y;
          save = true;
        }

        break;

      default:
        return;
    }

    if (save) {
      this.setState(Object.assign({}, this.state, {
        info
      }));
      this.props.updateProject({
        path: this.props.uid,
        value: info
      });
      const updated_workspace = _config_redux_redux_store__WEBPACK_IMPORTED_MODULE_2__["store"].getState().workspace;
      this.item.dispatchEvent(new CustomEvent('sf.workspace.project.update', {
        bubbles: true,
        detail: {
          workspace_id: updated_workspace.id,
          project: updated_workspace.project
        }
      }));
    }
  }

  handleMouseEnter() {
    this.setState(Object.assign({}, this.state, {
      hover: true
    }));
  }

  handleMouseLeave() {
    this.setState(Object.assign({}, this.state, {
      hover: false
    }));
  }

  async removeItem(e) {
    e.preventDefault();
    e.stopPropagation();
    var {
      workspace
    } = _config_redux_redux_store__WEBPACK_IMPORTED_MODULE_2__["store"].getState();
    var project = workspace.project;
    var items = project.items;
    const current_z = items[this.props.uid].z;
    var top_z = current_z;

    for (var key in items) {
      if (key !== this.props.uid && items[key].z > current_z) {
        if (items[key].z > top_z) {
          top_z = items[key].z;
        }

        items[key].z -= 1;
      }
    }

    delete items[this.props.uid];
    this.props.updateProjectItems(items);
    const updated_workspace = _config_redux_redux_store__WEBPACK_IMPORTED_MODULE_2__["store"].getState().workspace;
    this.item.dispatchEvent(new CustomEvent('sf.workspace.project.update', {
      bubbles: true,
      detail: {
        workspace_id: updated_workspace.id,
        project: updated_workspace.project
      }
    }));
  }

  render() {
    const {
      itemContainerClassName,
      info,
      tag,
      hover,
      hasFocus
    } = this.state;
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: itemContainerClassName,
      ref: item => this.item = item,
      onClick: this.handleItemContainerClick,
      draggable: true,
      onDragStart: this.handleDragStart,
      onDrag: this.handleDrag,
      onDragEnd: this.handleDragEnd,
      onMouseEnter: this.handleMouseEnter,
      onMouseLeave: this.handleMouseLeave,
      style: {
        top: info.y,
        left: info.x,
        width: info.width,
        height: info.height,
        zIndex: info.z + 100
      }
    }, tag, hover || hasFocus ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "item-actions"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "close-icon-item shadow-none",
      onClick: this.removeItem
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
      className: "close-icon"
    }))) : null);
  }

}

const Item = Object(react_redux__WEBPACK_IMPORTED_MODULE_1__["connect"])(mapStateToProps, mapDispatchToProps)(ItemComponent);
/* harmony default export */ __webpack_exports__["default"] = (Item);

/***/ }),

/***/ "icE1":
/*!*****************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js??ref--6-1!./node_modules/sass-loader/lib/loader.js??ref--6-2!./client/engine/assets/style/components/item/item.scss ***!
  \*****************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../../../../node_modules/css-loader/dist/runtime/api.js */ "JPst")(true);
// Module
exports.push([module.i, ".item-container {\n  position: absolute;\n  border: 1px solid #787878;\n  background: rgba(255, 255, 255, 0.9);\n  padding: 4px;\n  cursor: move; }\n  .item-container h1, .item-container h2, .item-container h3, .item-container h4, .item-container h5, .item-container h6 {\n    margin: 0; }\n  .item-container.focus {\n    background: rgba(240, 240, 240, 0.9); }\n    .item-container.focus .item-actions .close-icon-item {\n      background: rgba(240, 240, 240, 0.5); }\n  .item-container .item-actions {\n    position: absolute;\n    right: 1px;\n    top: 1px; }\n    .item-container .item-actions .close-icon-item {\n      display: inline-block;\n      cursor: pointer;\n      background: rgba(255, 255, 255, 0.5);\n      padding: 2px;\n      border: 0;\n      height: 18px;\n      width: 18px; }\n      .item-container .item-actions .close-icon-item .close-icon {\n        position: absolute;\n        top: 3px;\n        left: 4px;\n        font-size: 14px;\n        margin-top: -1px; }\n", "",{"version":3,"sources":["C:/Users/garri/source/repos/snapform/client/engine/assets/style/components/item/client/engine/assets/style/components/item/item.scss"],"names":[],"mappings":"AAAA;EACI,kBAAkB;EAClB,yBAAyB;EACzB,oCAAoC;EACpC,YAAY;EACZ,YAAY,EAAA;EALhB;IAQQ,SAAS,EAAA;EARjB;IAYQ,oCAAoC,EAAA;IAZ5C;MAgBgB,oCAAoC,EAAA;EAhBpD;IAsBQ,kBAAkB;IAClB,UAAU;IACV,QAAQ,EAAA;IAxBhB;MA2BY,qBAAqB;MACrB,eAAe;MACf,oCAAoC;MACpC,YAAY;MACZ,SAAS;MACT,YAAY;MACZ,WAAW,EAAA;MAjCvB;QAoCgB,kBAAkB;QAClB,QAAQ;QACR,SAAS;QACT,eAAe;QACf,gBAAgB,EAAA","file":"item.scss","sourcesContent":[".item-container {\r\n    position: absolute;\r\n    border: 1px solid #787878;\r\n    background: rgba(255, 255, 255, 0.9);\r\n    padding: 4px;\r\n    cursor: move;\r\n\r\n    h1, h2, h3, h4, h5, h6 {\r\n        margin: 0;\r\n    }\r\n\r\n    &.focus {\r\n        background: rgba(240, 240, 240, 0.9);\r\n\r\n        .item-actions {\r\n            .close-icon-item {\r\n                background: rgba(240, 240, 240, 0.5);\r\n            }\r\n        }\r\n    }\r\n\r\n    .item-actions {\r\n        position: absolute;\r\n        right: 1px;\r\n        top: 1px;\r\n\r\n        .close-icon-item {\r\n            display: inline-block;\r\n            cursor: pointer;\r\n            background: rgba(255, 255, 255, 0.5);\r\n            padding: 2px;\r\n            border: 0;\r\n            height: 18px;\r\n            width: 18px;\r\n            \r\n            .close-icon {\r\n                position: absolute;\r\n                top: 3px;\r\n                left: 4px;\r\n                font-size: 14px;\r\n                margin-top: -1px;\r\n            }\r\n        }\r\n    }\r\n}"],"sourceRoot":""}]);



/***/ }),

/***/ "tFBN":
/*!**************************************************************!*\
  !*** ./client/engine/assets/style/components/item/item.scss ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../../../../../node_modules/css-loader/dist/cjs.js??ref--6-1!../../../../../../node_modules/sass-loader/lib/loader.js??ref--6-2!./item.scss */ "icE1");

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(/*! ../../../../../../node_modules/style-loader/lib/addStyles.js */ "aET+")(content, options);

if(content.locals) module.exports = content.locals;

if(false) {}

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9jbGllbnQvZW5naW5lL3NyYy9jb21wb25lbnRzL2l0ZW0vaXRlbS5jb21wb25lbnQuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L2VuZ2luZS9hc3NldHMvc3R5bGUvY29tcG9uZW50cy9pdGVtL2l0ZW0uc2NzcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvZW5naW5lL2Fzc2V0cy9zdHlsZS9jb21wb25lbnRzL2l0ZW0vaXRlbS5zY3NzPzgyMjkiXSwibmFtZXMiOlsibWFwU3RhdGVUb1Byb3BzIiwic3RhdGUiLCJtYXBEaXNwYXRjaFRvUHJvcHMiLCJkaXNwYXRjaCIsInVwZGF0ZVByb2plY3QiLCJwYXlsb2FkIiwidXBkYXRlUHJvamVjdEl0ZW1zIiwidXBkYXRlUHJvamVjdENvbmZpZyIsImRlZmF1bHRJdGVtQ29udGFpbmVyQ2xhc3NOYW1lIiwiSXRlbUNvbXBvbmVudCIsIkNvbXBvbmVudCIsImNvbnN0cnVjdG9yIiwicHJvcHMiLCJUYWdOYW1lIiwidGFnIiwibmFtZSIsImlubmVyVmFsdWUiLCJ2YWx1ZSIsIndvcmtzcGFjZSIsInN0b3JlIiwiZ2V0U3RhdGUiLCJwcm9qZWN0IiwiaW5mbyIsIml0ZW1zIiwidWlkIiwiaXRlbUNvbnRhaW5lckNsYXNzTmFtZSIsImhhbmRsZUl0ZW1Db250YWluZXJDbGljayIsImJpbmQiLCJoYW5kbGVPdXRzaWRlQ2xpY2siLCJkcmFnIiwiaGFuZGxlRHJhZ1N0YXJ0IiwiaGFuZGxlRHJhZyIsImhhbmRsZURyYWdFbmQiLCJtb3VzZW1vdmUiLCJoYW5kbGVLZXlEb3duIiwiaGFuZGxlTW91c2VFbnRlciIsImhhbmRsZU1vdXNlTGVhdmUiLCJyZW1vdmVJdGVtIiwiY29tcG9uZW50V2lsbE1vdW50IiwiZG9jdW1lbnQiLCJhZGRFdmVudExpc3RlbmVyIiwiY29tcG9uZW50RGlkTW91bnQiLCJkcmFnSW1nIiwiSW1hZ2UiLCJzcmMiLCJjb21wb25lbnRXaWxsVW5tb3VudCIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJtb3VzZW1vdXZlIiwiZSIsIml0ZW0iLCJjb250YWlucyIsInRhcmdldCIsInNldFN0YXRlIiwiT2JqZWN0IiwiYXNzaWduIiwiaGFzRm9jdXMiLCJjdXJyZW50X3oiLCJ6IiwidG9wX3oiLCJrZXkiLCJkYXRhVHJhbnNmZXIiLCJzZXREcmFnSW1hZ2UiLCJzdHlsZSIsImN1cnNvciIsImNvbnRhaW5lciIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsImRyYWdnaW5nIiwiZHJhZ09mZnNldFgiLCJ4IiwiY2xpZW50WCIsImxlZnQiLCJkcmFnT2Zmc2V0WSIsInkiLCJjbGllbnRZIiwidG9wIiwiY29uZmlnIiwidWkiLCJnX2NsYXNzX2xpc3QiLCJwYXRoIiwiZGlzcGF0Y2hFdmVudCIsIkN1c3RvbUV2ZW50IiwiYnViYmxlcyIsImRldGFpbCIsIndvcmtzcGFjZV9pZCIsImlkIiwiZGVmYXVsdFdpZHRoIiwiY2VsbFdpZHRoIiwiZGVmYXVsdEhlaWdodCIsImNlbGxIZWlnaHQiLCJNYXRoIiwiZmxvb3IiLCJyZWN0IiwiaXRlbU9mZnNldExlZnQiLCJ3aWR0aCIsIml0ZW1PZmZzZXRUb3AiLCJoZWlnaHQiLCJzYXZlIiwia2V5Q29kZSIsInByZXZlbnREZWZhdWx0IiwidXBkYXRlZF93b3Jrc3BhY2UiLCJob3ZlciIsInN0b3BQcm9wYWdhdGlvbiIsInJlbmRlciIsInpJbmRleCIsIkl0ZW0iLCJjb25uZWN0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7O0FBRUEsTUFBTUEsZUFBZSxHQUFJQyxLQUFELElBQVdBLEtBQW5DOztBQUNBLE1BQU1DLGtCQUFrQixHQUFJQyxRQUFELElBQWM7QUFDckMsU0FBTztBQUNIQyxpQkFBYSxFQUFFQyxPQUFPLElBQUlGLFFBQVEsQ0FBQ0MsaUZBQWEsQ0FBQ0MsT0FBRCxDQUFkLENBRC9CO0FBRUhDLHNCQUFrQixFQUFFRCxPQUFPLElBQUlGLFFBQVEsQ0FBQ0csc0ZBQWtCLENBQUNE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LG1CQUFtQixvQkFBb0IsMEJBQTBCLDJCQUEyQixFQUFFLFNBQVMsMkxBQTJMLFlBQVksYUFBYSxhQUFhLFdBQVcsZUFBZSxNQUFNLGVBQWUsTUFBTSxpQkFBaUIsTUFBTSxtQkFBbUIsT0FBTyxhQUFhLFdBQVcsZUFBZSxPQUFPLGFBQWEsV0FBVyxZQUFZLFdBQVcsVUFBVSxVQUFVLGVBQWUsT0FBTyxjQUFjLFdBQVcsVUFBVSxVQUFVLHlFQUF5RSwyQkFBMkIsa0NBQWtDLDZDQUE2QyxxQkFBcUIscUJBQXFCLG9DQUFvQyxzQkFBc0IsU0FBUyxxQkFBcUIsaURBQWlELCtCQUErQixrQ0FBa0MseURBQXlELGlCQUFpQixhQUFhLFNBQVMsMkJBQTJCLCtCQUErQix1QkFBdUIscUJBQXFCLGtDQUFrQyxzQ0FBc0MsZ0NBQWdDLHFEQUFxRCw2QkFBNkIsMEJBQTBCLDZCQUE2Qiw0QkFBNEIsNkNBQTZDLHVDQUF1Qyw2QkFBNkIsOEJBQThCLG9DQUFvQyxxQ0FBcUMsaUJBQWlCLGFBQWEsU0FBUyxLQUFLLG1CQUFtQjs7Ozs7Ozs7Ozs7Ozs7QUNEM29GLGNBQWMsbUJBQU8sQ0FBQyw2SkFBa0o7O0FBRXhLLDRDQUE0QyxRQUFTOztBQUVyRDtBQUNBOzs7O0FBSUEsZUFBZTs7QUFFZjtBQUNBOztBQUVBLGFBQWEsbUJBQU8sQ0FBQywwRUFBK0Q7O0FBRXBGOztBQUVBLEdBQUcsS0FBVSxFQUFFLEUiLCJmaWxlIjoiYnVpbGQvOC44NjRhMzViMmE5OTQzOWRjYjRmNi5jaHVuay5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQgfSBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCc7XHJcbmltcG9ydCB7IHN0b3JlIH0gZnJvbSAnLi4vLi4vY29uZmlnL3JlZHV4L3JlZHV4LnN0b3JlJztcclxuaW1wb3J0IHsgdXBkYXRlUHJvamVjdCwgdXBkYXRlUHJvamVjdEl0ZW1zLCB1cGRhdGVQcm9qZWN0Q29uZmlnIH0gZnJvbSAnLi4vLi4vY29uZmlnL3JlZHV4L3JlZHV4LmFjdGlvbnMnO1xyXG5cclxuaW1wb3J0ICcuLi8uLi8uLi9hc3NldHMvc3R5bGUvY29tcG9uZW50cy9pdGVtL2l0ZW0uc2Nzcyc7XHJcblxyXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSAoc3RhdGUpID0+IHN0YXRlO1xyXG5jb25zdCBtYXBEaXNwYXRjaFRvUHJvcHMgPSAoZGlzcGF0Y2gpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdXBkYXRlUHJvamVjdDogcGF5bG9hZCA9PiBkaXNwYXRjaCh1cGRhdGVQcm9qZWN0KHBheWxvYWQpKSxcclxuICAgICAgICB1cGRhdGVQcm9qZWN0SXRlbXM6IHBheWxvYWQgPT4gZGlzcGF0Y2godXBkYXRlUHJvamVjdEl0ZW1zKHBheWxvYWQpKSxcclxuICAgICAgICB1cGRhdGVQcm9qZWN0Q29uZmlnOiBwYXlsb2FkID0+IGRpc3BhdGNoKHVwZGF0ZVByb2plY3RDb25maWcocGF5bG9hZCkpXHJcbiAgICB9O1xyXG59O1xyXG5cclxuY29uc3QgZGVmYXVsdEl0ZW1Db250YWluZXJDbGFzc05hbWUgPSAnaXRlbS1jb250YWluZXInO1xyXG5cclxuY2xhc3MgSXRlbUNvbXBvbmVudCBleHRlbmRzIENvbXBvbmVudCB7XHJcbiAgICBkcmFnZ2luZyA9IGZhbHNlO1xyXG4gICAgZHJhZ09mZnNldFggPSAwO1xyXG4gICAgZHJhZ09mZnNldFkgPSAwO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG5cclxuICAgICAgICBjb25zdCBUYWdOYW1lID0gYCR7dGhpcy5wcm9wcy50YWcubmFtZX1gO1xyXG4gICAgICAgIHZhciB0YWcgPSBudWxsO1xyXG4gICAgICAgIGlmICh0aGlzLnByb3BzLnRhZy5pbm5lclZhbHVlKSB7XHJcbiAgICAgICAgICAgIHRhZyA9ICg8VGFnTmFtZT57dGhpcy5wcm9wcy50YWcudmFsdWV9PC9UYWdOYW1lPilcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0YWcgPSAoPFRhZ05hbWUgdmFsdWU9e3RoaXMucHJvcHMudGFnLnZhbHVlfT48L1RhZ05hbWU+KVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgeyB3b3Jrc3BhY2UgfSA9IHN0b3JlLmdldFN0YXRlKCk7XHJcbiAgICAgICAgY29uc3QgcHJvamVjdCA9IHdvcmtzcGFjZS5wcm9qZWN0O1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XHJcbiAgICAgICAgICAgIGluZm86IHByb2plY3QuaXRlbXNbdGhpcy5wcm9wcy51aWRdLFxyXG4gICAgICAgICAgICBpdGVtQ29udGFpbmVyQ2xhc3NOYW1lOiBkZWZhdWx0SXRlbUNvbnRhaW5lckNsYXNzTmFtZSxcclxuICAgICAgICAgICAgdGFnXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5oYW5kbGVJdGVtQ29udGFpbmVyQ2xpY2sgPSB0aGlzLmhhbmRsZUl0ZW1Db250YWluZXJDbGljay5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlT3V0c2lkZUNsaWNrID0gdGhpcy5oYW5kbGVPdXRzaWRlQ2xpY2suYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLmRyYWcgPSB0aGlzLmRyYWcuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLmhhbmRsZURyYWdTdGFydCA9IHRoaXMuaGFuZGxlRHJhZ1N0YXJ0LmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVEcmFnID0gdGhpcy5oYW5kbGVEcmFnLmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVEcmFnRW5kID0gdGhpcy5oYW5kbGVEcmFnRW5kLmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5tb3VzZW1vdmUgPSB0aGlzLm1vdXNlbW92ZS5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlS2V5RG93biA9IHRoaXMuaGFuZGxlS2V5RG93bi5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlTW91c2VFbnRlciA9IHRoaXMuaGFuZGxlTW91c2VFbnRlci5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlTW91c2VMZWF2ZSA9IHRoaXMuaGFuZGxlTW91c2VMZWF2ZS5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMucmVtb3ZlSXRlbSA9IHRoaXMucmVtb3ZlSXRlbS5iaW5kKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbXBvbmVudFdpbGxNb3VudCgpIHtcclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLmhhbmRsZU91dHNpZGVDbGljaywgZmFsc2UpO1xyXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMubW91c2Vtb3ZlLCBmYWxzZSk7XHJcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMuaGFuZGxlS2V5RG93biwgZmFsc2UpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xyXG4gICAgICAgIHRoaXMuZHJhZ0ltZyA9IG5ldyBJbWFnZSgwLDApO1xyXG4gICAgICAgIHRoaXMuZHJhZ0ltZy5zcmMgPSAnZGF0YTppbWFnZS9naWY7YmFzZTY0LFIwbEdPRGxoQVFBQkFJQUFBQUFBQVAvLy95SDVCQUVBQUFBQUxBQUFBQUFCQUFFQUFBSUJSQUE3JztcclxuICAgIH1cclxuXHJcbiAgICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcclxuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLmhhbmRsZU91dHNpZGVDbGljaywgZmFsc2UpO1xyXG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMubW91c2Vtb3V2ZSwgZmFsc2UpO1xyXG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLmhhbmRsZUtleURvd24sIGZhbHNlKTtcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVPdXRzaWRlQ2xpY2soZSkge1xyXG4gICAgICAgIGlmICh0aGlzLml0ZW0uY29udGFpbnMoZS50YXJnZXQpKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5zdGF0ZSwge1xyXG4gICAgICAgICAgICBoYXNGb2N1czogZmFsc2UsXHJcbiAgICAgICAgICAgIGl0ZW1Db250YWluZXJDbGFzc05hbWU6IGRlZmF1bHRJdGVtQ29udGFpbmVyQ2xhc3NOYW1lXHJcbiAgICAgICAgfSkpO1xyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZUl0ZW1Db250YWluZXJDbGljaygpIHtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKE9iamVjdC5hc3NpZ24oe30sIHRoaXMuc3RhdGUsIHtcclxuICAgICAgICAgICAgaGFzRm9jdXM6IHRydWUsXHJcbiAgICAgICAgICAgIGl0ZW1Db250YWluZXJDbGFzc05hbWU6IGRlZmF1bHRJdGVtQ29udGFpbmVyQ2xhc3NOYW1lICsgJyBmb2N1cydcclxuICAgICAgICB9KSk7XHJcblxyXG4gICAgICAgIGNvbnN0IHsgd29ya3NwYWNlIH0gPSBzdG9yZS5nZXRTdGF0ZSgpO1xyXG4gICAgICAgIHZhciBpdGVtcyA9IHdvcmtzcGFjZS5wcm9qZWN0Lml0ZW1zO1xyXG5cclxuICAgICAgICBpZiAoaXRlbXNbdGhpcy5wcm9wcy51aWRdKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRfeiA9IGl0ZW1zW3RoaXMucHJvcHMudWlkXS56O1xyXG4gICAgICAgICAgICB2YXIgdG9wX3ogPSBjdXJyZW50X3o7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBpdGVtcykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGtleSAhPT0gdGhpcy5wcm9wcy51aWQgJiYgaXRlbXNba2V5XS56ID4gY3VycmVudF96KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW1zW2tleV0ueiA+IHRvcF96KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvcF96ID0gaXRlbXNba2V5XS56O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpdGVtc1trZXldLnogLT0gMTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpdGVtc1t0aGlzLnByb3BzLnVpZF0ueiA9IHRvcF96O1xyXG5cclxuICAgICAgICAgICAgdGhpcy5wcm9wcy51cGRhdGVQcm9qZWN0SXRlbXMoaXRlbXMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVEcmFnU3RhcnQoZSkge1xyXG4gICAgICAgIHRoaXMuaGFuZGxlSXRlbUNvbnRhaW5lckNsaWNrKCk7XHJcblxyXG4gICAgICAgIGUuZGF0YVRyYW5zZmVyLnNldERyYWdJbWFnZSh0aGlzLmRyYWdJbWcsIDAsIDApO1xyXG4gICAgICAgIGUudGFyZ2V0LnN0eWxlLmN1cnNvciA9ICdtb3ZlJztcclxuXHJcbiAgICAgICAgY29uc3QgeyB3b3Jrc3BhY2UgfSA9IHN0b3JlLmdldFN0YXRlKCk7XHJcbiAgICAgICAgY29uc3QgY29udGFpbmVyID0gd29ya3NwYWNlLnByb2plY3QuY29udGFpbmVyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgICAgIGNvbnN0IGl0ZW0gPSB3b3Jrc3BhY2UucHJvamVjdC5pdGVtc1t0aGlzLnByb3BzLnVpZF07XHJcblxyXG4gICAgICAgIHRoaXMuZHJhZ2dpbmcgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuZHJhZ09mZnNldFggPSBpdGVtLnggLSAoZS5jbGllbnRYIC0gY29udGFpbmVyLmxlZnQpO1xyXG4gICAgICAgIHRoaXMuZHJhZ09mZnNldFkgPSBpdGVtLnkgLSAoZS5jbGllbnRZIC0gY29udGFpbmVyLnRvcCk7XHJcblxyXG4gICAgICAgIHRoaXMucHJvcHMudXBkYXRlUHJvamVjdENvbmZpZyhPYmplY3QuYXNzaWduKHt9LCB3b3Jrc3BhY2UucHJvamVjdC5jb25maWcsIHtcclxuICAgICAgICAgICAgdWk6IE9iamVjdC5hc3NpZ24oe30sIHdvcmtzcGFjZS5wcm9qZWN0LmNvbmZpZy51aSwge1xyXG4gICAgICAgICAgICAgICAgZ19jbGFzc19saXN0OiAnZ2lkIGhpZGRlbidcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9KSk7XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlRHJhZyhlKSB7XHJcbiAgICAgICAgdGhpcy5kcmFnKGUpO1xyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIGhhbmRsZURyYWdFbmQoZSkge1xyXG4gICAgICAgIHZhciBpbmZvID0gdGhpcy5kcmFnKGUpO1xyXG4gICAgICAgIGNvbnN0IHsgd29ya3NwYWNlIH0gPSBzdG9yZS5nZXRTdGF0ZSgpO1xyXG5cclxuICAgICAgICB0aGlzLmRyYWdnaW5nID0gZmFsc2U7XHJcblxyXG4gICAgICAgIHRoaXMucHJvcHMudXBkYXRlUHJvamVjdENvbmZpZyhPYmplY3QuYXNzaWduKHt9LCB3b3Jrc3BhY2UucHJvamVjdC5jb25maWcsIHtcclxuICAgICAgICAgICAgdWk6IE9iamVjdC5hc3NpZ24oe30sIHdvcmtzcGFjZS5wcm9qZWN0LmNvbmZpZy51aSwge1xyXG4gICAgICAgICAgICAgICAgZ19jbGFzc19saXN0OiAnZ2lkJ1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0pKTtcclxuXHJcbiAgICAgICAgdGhpcy5wcm9wcy51cGRhdGVQcm9qZWN0KHtcclxuICAgICAgICAgICAgcGF0aDogdGhpcy5wcm9wcy51aWQsXHJcbiAgICAgICAgICAgIHZhbHVlOiBpbmZvXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuaXRlbS5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgnc2Yud29ya3NwYWNlLnByb2plY3QudXBkYXRlJywge1xyXG4gICAgICAgICAgICBidWJibGVzOiB0cnVlLFxyXG4gICAgICAgICAgICBkZXRhaWw6IHsgXHJcbiAgICAgICAgICAgICAgICB3b3Jrc3BhY2VfaWQ6IHdvcmtzcGFjZS5pZCxcclxuICAgICAgICAgICAgICAgIHByb2plY3Q6IHdvcmtzcGFjZS5wcm9qZWN0IFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSkpO1xyXG4gICAgfVxyXG5cclxuICAgIGRyYWcoZSkge1xyXG4gICAgICAgIGNvbnN0IHsgd29ya3NwYWNlIH0gPSBzdG9yZS5nZXRTdGF0ZSgpO1xyXG4gICAgICAgIGNvbnN0IGNvbnRhaW5lciA9IHdvcmtzcGFjZS5wcm9qZWN0LmNvbnRhaW5lci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgICAgICBjb25zdCBkZWZhdWx0V2lkdGggPSB3b3Jrc3BhY2UucHJvamVjdC5jb25maWcuY2VsbFdpZHRoO1xyXG4gICAgICAgIGNvbnN0IGRlZmF1bHRIZWlnaHQgPSB3b3Jrc3BhY2UucHJvamVjdC5jb25maWcuY2VsbEhlaWdodDtcclxuXHJcbiAgICAgICAgY29uc3QgeCA9IE1hdGguZmxvb3IoKGUuY2xpZW50WCAtIChjb250YWluZXIubGVmdCAtIHRoaXMuZHJhZ09mZnNldFgpKSAvIGRlZmF1bHRXaWR0aCkgKiBkZWZhdWx0V2lkdGg7XHJcbiAgICAgICAgY29uc3QgeSA9IE1hdGguZmxvb3IoKGUuY2xpZW50WSAtIChjb250YWluZXIudG9wIC0gdGhpcy5kcmFnT2Zmc2V0WSkpIC8gZGVmYXVsdEhlaWdodCkgKiBkZWZhdWx0SGVpZ2h0O1xyXG4gICAgICAgIFxyXG4gICAgICAgIHZhciBsZWZ0ID0geCA+IDAgPyB4IDogMDtcclxuICAgICAgICB2YXIgdG9wID0geSA+IDAgPyB5IDogMDtcclxuXHJcbiAgICAgICAgY29uc3QgcmVjdCA9IHRoaXMuaXRlbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgICAgICBjb25zdCBpdGVtT2Zmc2V0TGVmdCA9IGxlZnQgKyByZWN0LndpZHRoO1xyXG4gICAgICAgIGNvbnN0IGl0ZW1PZmZzZXRUb3AgPSB0b3AgKyByZWN0LmhlaWdodDtcclxuXHJcbiAgICAgICAgaWYgKGl0ZW1PZmZzZXRMZWZ0ID4gY29udGFpbmVyLndpZHRoKSB7XHJcbiAgICAgICAgICAgIGxlZnQgPSBNYXRoLmZsb29yKChjb250YWluZXIud2lkdGggLSByZWN0LndpZHRoKSAvIGRlZmF1bHRXaWR0aCkgKiBkZWZhdWx0V2lkdGg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoaXRlbU9mZnNldFRvcCA+IGNvbnRhaW5lci5oZWlnaHQpIHtcclxuICAgICAgICAgICAgdG9wID0gTWF0aC5mbG9vcigoY29udGFpbmVyLmhlaWdodCAtIHJlY3QuaGVpZ2h0KSAvIGRlZmF1bHRIZWlnaHQpICogZGVmYXVsdEhlaWdodDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGluZm8gPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLnN0YXRlLmluZm8sIHtcclxuICAgICAgICAgICAgeDogbGVmdCxcclxuICAgICAgICAgICAgeTogdG9wXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5zdGF0ZSwge1xyXG4gICAgICAgICAgICBpbmZvXHJcbiAgICAgICAgfSkpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiBpbmZvO1xyXG4gICAgfVxyXG5cclxuICAgIG1vdXNlbW92ZShlKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZHJhZ2dpbmcpIHtcclxuICAgICAgICAgICAgZS50YXJnZXQuc3R5bGUuY3Vyc29yID0gJ21vdmUnO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBoYW5kbGVLZXlEb3duKGUpIHtcclxuICAgICAgICBpZiAoIXRoaXMuc3RhdGUuaGFzRm9jdXMpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgcmVjdCA9IHRoaXMuaXRlbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgICAgICBjb25zdCB7IHdvcmtzcGFjZSB9ID0gc3RvcmUuZ2V0U3RhdGUoKTtcclxuICAgICAgICBjb25zdCBjb250YWluZXIgPSB3b3Jrc3BhY2UucHJvamVjdC5jb250YWluZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICAgICAgdmFyIGluZm8gPSB0aGlzLnN0YXRlLmluZm87XHJcblxyXG4gICAgICAgIHZhciBzYXZlID0gZmFsc2U7XHJcbiAgICAgICAgdmFyIHgsIHk7XHJcbiAgICAgICAgc3dpdGNoIChlLmtleUNvZGUpIHtcclxuICAgICAgICAgICAgY2FzZSAzNzogLy8gbGVmdFxyXG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgeCA9IGluZm8ueCAtIHdvcmtzcGFjZS5wcm9qZWN0LmNvbmZpZy5jZWxsV2lkdGg7XHJcbiAgICAgICAgICAgICAgICBpZiAoeCA+PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5mby54ID0geDtcclxuICAgICAgICAgICAgICAgICAgICBzYXZlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIDM4OiAvLyB1cFxyXG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgeSA9IGluZm8ueSAtIHdvcmtzcGFjZS5wcm9qZWN0LmNvbmZpZy5jZWxsSGVpZ2h0O1xyXG4gICAgICAgICAgICAgICAgaWYgKHkgPj0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGluZm8ueSA9IHk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2F2ZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAzOTogLy8gcmlnaHRcclxuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgIHggPSBpbmZvLnggKyB3b3Jrc3BhY2UucHJvamVjdC5jb25maWcuY2VsbFdpZHRoO1xyXG4gICAgICAgICAgICAgICAgaWYgKCh4ICsgcmVjdC53aWR0aCkgPD0gY29udGFpbmVyLndpZHRoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5mby54ID0geDtcclxuICAgICAgICAgICAgICAgICAgICBzYXZlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIDQwOiAvLyBkb3duXHJcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICB5ID0gaW5mby55ICsgd29ya3NwYWNlLnByb2plY3QuY29uZmlnLmNlbGxIZWlnaHQ7XHJcbiAgICAgICAgICAgICAgICBpZiAoKHkgKyByZWN0LmhlaWdodCkgPD0gY29udGFpbmVyLmhlaWdodCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGluZm8ueSA9IHk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2F2ZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChzYXZlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5zdGF0ZSwge1xyXG4gICAgICAgICAgICAgICAgaW5mb1xyXG4gICAgICAgICAgICB9KSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnByb3BzLnVwZGF0ZVByb2plY3Qoe1xyXG4gICAgICAgICAgICAgICAgcGF0aDogdGhpcy5wcm9wcy51aWQsXHJcbiAgICAgICAgICAgICAgICB2YWx1ZTogaW5mb1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHVwZGF0ZWRfd29ya3NwYWNlID0gc3RvcmUuZ2V0U3RhdGUoKS53b3Jrc3BhY2U7XHJcbiAgICAgICAgICAgIHRoaXMuaXRlbS5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgnc2Yud29ya3NwYWNlLnByb2plY3QudXBkYXRlJywge1xyXG4gICAgICAgICAgICAgICAgYnViYmxlczogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGRldGFpbDogeyBcclxuICAgICAgICAgICAgICAgICAgICB3b3Jrc3BhY2VfaWQ6IHVwZGF0ZWRfd29ya3NwYWNlLmlkLFxyXG4gICAgICAgICAgICAgICAgICAgIHByb2plY3Q6IHVwZGF0ZWRfd29ya3NwYWNlLnByb2plY3QgXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlTW91c2VFbnRlcigpIHtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKE9iamVjdC5hc3NpZ24oe30sIHRoaXMuc3RhdGUsIHtcclxuICAgICAgICAgICAgaG92ZXI6IHRydWVcclxuICAgICAgICB9KSk7XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlTW91c2VMZWF2ZSgpIHtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKE9iamVjdC5hc3NpZ24oe30sIHRoaXMuc3RhdGUsIHtcclxuICAgICAgICAgICAgaG92ZXI6IGZhbHNlXHJcbiAgICAgICAgfSkpO1xyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIHJlbW92ZUl0ZW0oZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cclxuICAgICAgICB2YXIgeyB3b3Jrc3BhY2UgfSA9IHN0b3JlLmdldFN0YXRlKCk7XHJcbiAgICAgICAgdmFyIHByb2plY3QgPSB3b3Jrc3BhY2UucHJvamVjdDtcclxuICAgICAgICB2YXIgaXRlbXMgPSBwcm9qZWN0Lml0ZW1zO1xyXG5cclxuICAgICAgICBjb25zdCBjdXJyZW50X3ogPSBpdGVtc1t0aGlzLnByb3BzLnVpZF0uejtcclxuICAgICAgICB2YXIgdG9wX3ogPSBjdXJyZW50X3o7XHJcbiAgICAgICAgZm9yICh2YXIga2V5IGluIGl0ZW1zKSB7XHJcbiAgICAgICAgICAgIGlmIChrZXkgIT09IHRoaXMucHJvcHMudWlkICYmIGl0ZW1zW2tleV0ueiA+IGN1cnJlbnRfeikge1xyXG4gICAgICAgICAgICAgICAgaWYgKGl0ZW1zW2tleV0ueiA+IHRvcF96KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdG9wX3ogPSBpdGVtc1trZXldLno7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpdGVtc1trZXldLnogLT0gMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZGVsZXRlIGl0ZW1zW3RoaXMucHJvcHMudWlkXTtcclxuXHJcbiAgICAgICAgdGhpcy5wcm9wcy51cGRhdGVQcm9qZWN0SXRlbXMoaXRlbXMpO1xyXG5cclxuICAgICAgICBjb25zdCB1cGRhdGVkX3dvcmtzcGFjZSA9IHN0b3JlLmdldFN0YXRlKCkud29ya3NwYWNlO1xyXG4gICAgICAgIHRoaXMuaXRlbS5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgnc2Yud29ya3NwYWNlLnByb2plY3QudXBkYXRlJywge1xyXG4gICAgICAgICAgICBidWJibGVzOiB0cnVlLFxyXG4gICAgICAgICAgICBkZXRhaWw6IHsgXHJcbiAgICAgICAgICAgICAgICB3b3Jrc3BhY2VfaWQ6IHVwZGF0ZWRfd29ya3NwYWNlLmlkLFxyXG4gICAgICAgICAgICAgICAgcHJvamVjdDogdXBkYXRlZF93b3Jrc3BhY2UucHJvamVjdCBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyBpdGVtQ29udGFpbmVyQ2xhc3NOYW1lLCBpbmZvLCB0YWcsIGhvdmVyLCBoYXNGb2N1cyB9ID0gdGhpcy5zdGF0ZTtcclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiBcclxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17aXRlbUNvbnRhaW5lckNsYXNzTmFtZX1cclxuICAgICAgICAgICAgICAgIHJlZj17aXRlbSA9PiB0aGlzLml0ZW0gPSBpdGVtfVxyXG4gICAgICAgICAgICAgICAgb25DbGljaz17dGhpcy5oYW5kbGVJdGVtQ29udGFpbmVyQ2xpY2t9XHJcbiAgICAgICAgICAgICAgICBkcmFnZ2FibGU9e3RydWV9XHJcbiAgICAgICAgICAgICAgICBvbkRyYWdTdGFydD17dGhpcy5oYW5kbGVEcmFnU3RhcnR9XHJcbiAgICAgICAgICAgICAgICBvbkRyYWc9e3RoaXMuaGFuZGxlRHJhZ31cclxuICAgICAgICAgICAgICAgIG9uRHJhZ0VuZD17dGhpcy5oYW5kbGVEcmFnRW5kfVxyXG4gICAgICAgICAgICAgICAgb25Nb3VzZUVudGVyPXt0aGlzLmhhbmRsZU1vdXNlRW50ZXJ9XHJcbiAgICAgICAgICAgICAgICBvbk1vdXNlTGVhdmU9e3RoaXMuaGFuZGxlTW91c2VMZWF2ZX1cclxuICAgICAgICAgICAgICAgIHN0eWxlPXt7IFxyXG4gICAgICAgICAgICAgICAgICAgIHRvcDogaW5mby55LCBcclxuICAgICAgICAgICAgICAgICAgICBsZWZ0OiBpbmZvLngsXHJcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IGluZm8ud2lkdGgsXHJcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiBpbmZvLmhlaWdodCxcclxuICAgICAgICAgICAgICAgICAgICB6SW5kZXg6IGluZm8ueiArIDEwMFxyXG4gICAgICAgICAgICAgICAgfX0+XHJcbiAgICAgICAgICAgICAgICB7dGFnfVxyXG4gICAgICAgICAgICAgICAge2hvdmVyIHx8IGhhc0ZvY3VzID9cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaXRlbS1hY3Rpb25zXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjbG9zZS1pY29uLWl0ZW0gc2hhZG93LW5vbmVcIiBvbkNsaWNrPXt0aGlzLnJlbW92ZUl0ZW19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJjbG9zZS1pY29uXCI+PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA6IG51bGx9XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IEl0ZW0gPSBjb25uZWN0KG1hcFN0YXRlVG9Qcm9wcywgbWFwRGlzcGF0Y2hUb1Byb3BzKShJdGVtQ29tcG9uZW50KTtcclxuZXhwb3J0IGRlZmF1bHQgSXRlbTsiLCJleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiKSh0cnVlKTtcbi8vIE1vZHVsZVxuZXhwb3J0cy5wdXNoKFttb2R1bGUuaWQsIFwiLml0ZW0tY29udGFpbmVyIHtcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIGJvcmRlcjogMXB4IHNvbGlkICM3ODc4Nzg7XFxuICBiYWNrZ3JvdW5kOiByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuOSk7XFxuICBwYWRkaW5nOiA0cHg7XFxuICBjdXJzb3I6IG1vdmU7IH1cXG4gIC5pdGVtLWNvbnRhaW5lciBoMSwgLml0ZW0tY29udGFpbmVyIGgyLCAuaXRlbS1jb250YWluZXIgaDMsIC5pdGVtLWNvbnRhaW5lciBoNCwgLml0ZW0tY29udGFpbmVyIGg1LCAuaXRlbS1jb250YWluZXIgaDYge1xcbiAgICBtYXJnaW46IDA7IH1cXG4gIC5pdGVtLWNvbnRhaW5lci5mb2N1cyB7XFxuICAgIGJhY2tncm91bmQ6IHJnYmEoMjQwLCAyNDAsIDI0MCwgMC45KTsgfVxcbiAgICAuaXRlbS1jb250YWluZXIuZm9jdXMgLml0ZW0tYWN0aW9ucyAuY2xvc2UtaWNvbi1pdGVtIHtcXG4gICAgICBiYWNrZ3JvdW5kOiByZ2JhKDI0MCwgMjQwLCAyNDAsIDAuNSk7IH1cXG4gIC5pdGVtLWNvbnRhaW5lciAuaXRlbS1hY3Rpb25zIHtcXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgICByaWdodDogMXB4O1xcbiAgICB0b3A6IDFweDsgfVxcbiAgICAuaXRlbS1jb250YWluZXIgLml0ZW0tYWN0aW9ucyAuY2xvc2UtaWNvbi1pdGVtIHtcXG4gICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XFxuICAgICAgY3Vyc29yOiBwb2ludGVyO1xcbiAgICAgIGJhY2tncm91bmQ6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC41KTtcXG4gICAgICBwYWRkaW5nOiAycHg7XFxuICAgICAgYm9yZGVyOiAwO1xcbiAgICAgIGhlaWdodDogMThweDtcXG4gICAgICB3aWR0aDogMThweDsgfVxcbiAgICAgIC5pdGVtLWNvbnRhaW5lciAuaXRlbS1hY3Rpb25zIC5jbG9zZS1pY29uLWl0ZW0gLmNsb3NlLWljb24ge1xcbiAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgICAgICAgdG9wOiAzcHg7XFxuICAgICAgICBsZWZ0OiA0cHg7XFxuICAgICAgICBmb250LXNpemU6IDE0cHg7XFxuICAgICAgICBtYXJnaW4tdG9wOiAtMXB4OyB9XFxuXCIsIFwiXCIse1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wiQzovVXNlcnMvZ2Fycmkvc291cmNlL3JlcG9zL3NuYXBmb3JtL2NsaWVudC9lbmdpbmUvYXNzZXRzL3N0eWxlL2NvbXBvbmVudHMvaXRlbS9jbGllbnQvZW5naW5lL2Fzc2V0cy9zdHlsZS9jb21wb25lbnRzL2l0ZW0vaXRlbS5zY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUFBO0VBQ0ksa0JBQWtCO0VBQ2xCLHlCQUF5QjtFQUN6QixvQ0FBb0M7RUFDcEMsWUFBWTtFQUNaLFlBQVksRUFBQTtFQUxoQjtJQVFRLFNBQVMsRUFBQTtFQVJqQjtJQVlRLG9DQUFvQyxFQUFBO0lBWjVDO01BZ0JnQixvQ0FBb0MsRUFBQTtFQWhCcEQ7SUFzQlEsa0JBQWtCO0lBQ2xCLFVBQVU7SUFDVixRQUFRLEVBQUE7SUF4QmhCO01BMkJZLHFCQUFxQjtNQUNyQixlQUFlO01BQ2Ysb0NBQW9DO01BQ3BDLFlBQVk7TUFDWixTQUFTO01BQ1QsWUFBWTtNQUNaLFdBQVcsRUFBQTtNQWpDdkI7UUFvQ2dCLGtCQUFrQjtRQUNsQixRQUFRO1FBQ1IsU0FBUztRQUNULGVBQWU7UUFDZixnQkFBZ0IsRUFBQVwiLFwiZmlsZVwiOlwiaXRlbS5zY3NzXCIsXCJzb3VyY2VzQ29udGVudFwiOltcIi5pdGVtLWNvbnRhaW5lciB7XFxyXFxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXHJcXG4gICAgYm9yZGVyOiAxcHggc29saWQgIzc4Nzg3ODtcXHJcXG4gICAgYmFja2dyb3VuZDogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjkpO1xcclxcbiAgICBwYWRkaW5nOiA0cHg7XFxyXFxuICAgIGN1cnNvcjogbW92ZTtcXHJcXG5cXHJcXG4gICAgaDEsIGgyLCBoMywgaDQsIGg1LCBoNiB7XFxyXFxuICAgICAgICBtYXJnaW46IDA7XFxyXFxuICAgIH1cXHJcXG5cXHJcXG4gICAgJi5mb2N1cyB7XFxyXFxuICAgICAgICBiYWNrZ3JvdW5kOiByZ2JhKDI0MCwgMjQwLCAyNDAsIDAuOSk7XFxyXFxuXFxyXFxuICAgICAgICAuaXRlbS1hY3Rpb25zIHtcXHJcXG4gICAgICAgICAgICAuY2xvc2UtaWNvbi1pdGVtIHtcXHJcXG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZDogcmdiYSgyNDAsIDI0MCwgMjQwLCAwLjUpO1xcclxcbiAgICAgICAgICAgIH1cXHJcXG4gICAgICAgIH1cXHJcXG4gICAgfVxcclxcblxcclxcbiAgICAuaXRlbS1hY3Rpb25zIHtcXHJcXG4gICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXHJcXG4gICAgICAgIHJpZ2h0OiAxcHg7XFxyXFxuICAgICAgICB0b3A6IDFweDtcXHJcXG5cXHJcXG4gICAgICAgIC5jbG9zZS1pY29uLWl0ZW0ge1xcclxcbiAgICAgICAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcXHJcXG4gICAgICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XFxyXFxuICAgICAgICAgICAgYmFja2dyb3VuZDogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjUpO1xcclxcbiAgICAgICAgICAgIHBhZGRpbmc6IDJweDtcXHJcXG4gICAgICAgICAgICBib3JkZXI6IDA7XFxyXFxuICAgICAgICAgICAgaGVpZ2h0OiAxOHB4O1xcclxcbiAgICAgICAgICAgIHdpZHRoOiAxOHB4O1xcclxcbiAgICAgICAgICAgIFxcclxcbiAgICAgICAgICAgIC5jbG9zZS1pY29uIHtcXHJcXG4gICAgICAgICAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xcclxcbiAgICAgICAgICAgICAgICB0b3A6IDNweDtcXHJcXG4gICAgICAgICAgICAgICAgbGVmdDogNHB4O1xcclxcbiAgICAgICAgICAgICAgICBmb250LXNpemU6IDE0cHg7XFxyXFxuICAgICAgICAgICAgICAgIG1hcmdpbi10b3A6IC0xcHg7XFxyXFxuICAgICAgICAgICAgfVxcclxcbiAgICAgICAgfVxcclxcbiAgICB9XFxyXFxufVwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuXG4iLCJcbnZhciBjb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanM/P3JlZi0tNi0xIS4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9saWIvbG9hZGVyLmpzPz9yZWYtLTYtMiEuL2l0ZW0uc2Nzc1wiKTtcblxuaWYodHlwZW9mIGNvbnRlbnQgPT09ICdzdHJpbmcnKSBjb250ZW50ID0gW1ttb2R1bGUuaWQsIGNvbnRlbnQsICcnXV07XG5cbnZhciB0cmFuc2Zvcm07XG52YXIgaW5zZXJ0SW50bztcblxuXG5cbnZhciBvcHRpb25zID0ge1wiaG1yXCI6dHJ1ZX1cblxub3B0aW9ucy50cmFuc2Zvcm0gPSB0cmFuc2Zvcm1cbm9wdGlvbnMuaW5zZXJ0SW50byA9IHVuZGVmaW5lZDtcblxudmFyIHVwZGF0ZSA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9saWIvYWRkU3R5bGVzLmpzXCIpKGNvbnRlbnQsIG9wdGlvbnMpO1xuXG5pZihjb250ZW50LmxvY2FscykgbW9kdWxlLmV4cG9ydHMgPSBjb250ZW50LmxvY2FscztcblxuaWYobW9kdWxlLmhvdCkge1xuXHRtb2R1bGUuaG90LmFjY2VwdChcIiEhLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanM/P3JlZi0tNi0xIS4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9saWIvbG9hZGVyLmpzPz9yZWYtLTYtMiEuL2l0ZW0uc2Nzc1wiLCBmdW5jdGlvbigpIHtcblx0XHR2YXIgbmV3Q29udGVudCA9IHJlcXVpcmUoXCIhIS4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzPz9yZWYtLTYtMSEuLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvbGliL2xvYWRlci5qcz8/cmVmLS02LTIhLi9pdGVtLnNjc3NcIik7XG5cblx0XHRpZih0eXBlb2YgbmV3Q29udGVudCA9PT0gJ3N0cmluZycpIG5ld0NvbnRlbnQgPSBbW21vZHVsZS5pZCwgbmV3Q29udGVudCwgJyddXTtcblxuXHRcdHZhciBsb2NhbHMgPSAoZnVuY3Rpb24oYSwgYikge1xuXHRcdFx0dmFyIGtleSwgaWR4ID0gMDtcblxuXHRcdFx0Zm9yKGtleSBpbiBhKSB7XG5cdFx0XHRcdGlmKCFiIHx8IGFba2V5XSAhPT0gYltrZXldKSByZXR1cm4gZmFsc2U7XG5cdFx0XHRcdGlkeCsrO1xuXHRcdFx0fVxuXG5cdFx0XHRmb3Ioa2V5IGluIGIpIGlkeC0tO1xuXG5cdFx0XHRyZXR1cm4gaWR4ID09PSAwO1xuXHRcdH0oY29udGVudC5sb2NhbHMsIG5ld0NvbnRlbnQubG9jYWxzKSk7XG5cblx0XHRpZighbG9jYWxzKSB0aHJvdyBuZXcgRXJyb3IoJ0Fib3J0aW5nIENTUyBITVIgZHVlIHRvIGNoYW5nZWQgY3NzLW1vZHVsZXMgbG9jYWxzLicpO1xuXG5cdFx0dXBkYXRlKG5ld0NvbnRlbnQpO1xuXHR9KTtcblxuXHRtb2R1bGUuaG90LmRpc3Bvc2UoZnVuY3Rpb24oKSB7IHVwZGF0ZSgpOyB9KTtcbn0iXSwic291cmNlUm9vdCI6IiJ9