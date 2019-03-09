(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[7],{

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
/* harmony import */ var _common_config_redux_redux_store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../common/config/redux/redux.store */ "p6Ez");
/* harmony import */ var _config_redux_redux_actions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../config/redux/redux.actions */ "nymR");
/* harmony import */ var _common_services_project_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../common/services/project.service */ "XSen");
/* harmony import */ var _assets_style_components_item_item_scss__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../assets/style/components/item/item.scss */ "tFBN");
/* harmony import */ var _assets_style_components_item_item_scss__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_assets_style_components_item_item_scss__WEBPACK_IMPORTED_MODULE_5__);
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
    } = _common_config_redux_redux_store__WEBPACK_IMPORTED_MODULE_2__["store"].getState().engineReducer;
    const project = workspace.project;
    this.state = {
      info: project.items[this.props.uid],
      itemContainerClassName: defaultItemContainerClassName,
      tag
    };
    this.projectService = new _common_services_project_service__WEBPACK_IMPORTED_MODULE_4__["ProjectService"]();
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
    } = _common_config_redux_redux_store__WEBPACK_IMPORTED_MODULE_2__["store"].getState().engineReducer;
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
    } = _common_config_redux_redux_store__WEBPACK_IMPORTED_MODULE_2__["store"].getState().engineReducer;
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
    } = _common_config_redux_redux_store__WEBPACK_IMPORTED_MODULE_2__["store"].getState().engineReducer;
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
    await this.projectService.put(workspace.id, workspace.project.project_id, workspace.project);
  }

  drag(e) {
    const {
      workspace
    } = _common_config_redux_redux_store__WEBPACK_IMPORTED_MODULE_2__["store"].getState().engineReducer;
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
    } = _common_config_redux_redux_store__WEBPACK_IMPORTED_MODULE_2__["store"].getState().engineReducer;
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
      await this.projectService.put(workspace.id, workspace.project.project_id, workspace.project);
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
    } = _common_config_redux_redux_store__WEBPACK_IMPORTED_MODULE_2__["store"].getState().engineReducer;
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
    await this.projectService.put(workspace.id, workspace.project.project_id, workspace.project);
    this.props.updateProjectItems(items);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9jbGllbnQvZW5naW5lL3NyYy9jb21wb25lbnRzL2l0ZW0vaXRlbS5jb21wb25lbnQuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L2VuZ2luZS9hc3NldHMvc3R5bGUvY29tcG9uZW50cy9pdGVtL2l0ZW0uc2NzcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvZW5naW5lL2Fzc2V0cy9zdHlsZS9jb21wb25lbnRzL2l0ZW0vaXRlbS5zY3NzPzgyMjkiXSwibmFtZXMiOlsibWFwU3RhdGVUb1Byb3BzIiwic3RhdGUiLCJtYXBEaXNwYXRjaFRvUHJvcHMiLCJkaXNwYXRjaCIsInVwZGF0ZVByb2plY3QiLCJwYXlsb2FkIiwidXBkYXRlUHJvamVjdEl0ZW1zIiwidXBkYXRlUHJvamVjdENvbmZpZyIsImRlZmF1bHRJdGVtQ29udGFpbmVyQ2xhc3NOYW1lIiwiSXRlbUNvbXBvbmVudCIsIkNvbXBvbmVudCIsImNvbnN0cnVjdG9yIiwicHJvcHMiLCJUYWdOYW1lIiwidGFnIiwibmFtZSIsImlubmVyVmFsdWUiLCJ2YWx1ZSIsIndvcmtzcGFjZSIsInN0b3JlIiwiZ2V0U3RhdGUiLCJlbmdpbmVSZWR1Y2VyIiwicHJvamVjdCIsImluZm8iLCJpdGVtcyIsInVpZCIsIml0ZW1Db250YWluZXJDbGFzc05hbWUiLCJwcm9qZWN0U2VydmljZSIsIlByb2plY3RTZXJ2aWNlIiwiaGFuZGxlSXRlbUNvbnRhaW5lckNsaWNrIiwiYmluZCIsImhhbmRsZU91dHNpZGVDbGljayIsImRyYWciLCJoYW5kbGVEcmFnU3RhcnQiLCJoYW5kbGVEcmFnIiwiaGFuZGxlRHJhZ0VuZCIsIm1vdXNlbW92ZSIsImhhbmRsZUtleURvd24iLCJoYW5kbGVNb3VzZUVudGVyIiwiaGFuZGxlTW91c2VMZWF2ZSIsInJlbW92ZUl0ZW0iLCJjb21wb25lbnRXaWxsTW91bnQiLCJkb2N1bWVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJjb21wb25lbnREaWRNb3VudCIsImRyYWdJbWciLCJJbWFnZSIsInNyYyIsImNvbXBvbmVudFdpbGxVbm1vdW50IiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsIm1vdXNlbW91dmUiLCJlIiwiaXRlbSIsImNvbnRhaW5zIiwidGFyZ2V0Iiwic2V0U3RhdGUiLCJPYmplY3QiLCJhc3NpZ24iLCJoYXNGb2N1cyIsImN1cnJlbnRfeiIsInoiLCJ0b3BfeiIsImtleSIsImRhdGFUcmFuc2ZlciIsInNldERyYWdJbWFnZSIsInN0eWxlIiwiY3Vyc29yIiwiY29udGFpbmVyIiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwiZHJhZ2dpbmciLCJkcmFnT2Zmc2V0WCIsIngiLCJjbGllbnRYIiwibGVmdCIsImRyYWdPZmZzZXRZIiwieSIsImNsaWVudFkiLCJ0b3AiLCJjb25maWciLCJ1aSIsImdfY2xhc3NfbGlzdCIsInBhdGgiLCJwdXQiLCJpZCIsInByb2plY3RfaWQiLCJkZWZhdWx0V2lkdGgiLCJjZWxsV2lkdGgiLCJkZWZhdWx0SGVpZ2h0IiwiY2VsbEhlaWdodCIsIk1hdGgiLCJmbG9vciIsInJlY3QiLCJpdGVtT2Zmc2V0TGVmdCIsIndpZHRoIiwiaXRlbU9mZnNldFRvcCIsImhlaWdodCIsInNhdmUiLCJrZXlDb2RlIiwicHJldmVudERlZmF1bHQiLCJob3ZlciIsInN0b3BQcm9wYWdhdGlvbiIsInJlbmRlciIsInpJbmRleCIsIkl0ZW0iLCJjb25uZWN0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7O0FBRUEsTUFBTUEsZUFBZSxHQUFJQyxLQUFELElBQVdBLEtBQW5DOztBQUNBLE1BQU1DLGtCQUFrQixHQUFJQyxRQUFELElBQWM7QUFDckMsU0FBTztBQUNIQyxpQkFBYSxFQUFFQyxPQUFPLElBQUlGLFFBQVEsQ0FBQ0MsaUZBQWEsQ0FBQ0MsT0FBRCxDQUFkLENBRC9CO0FBRUhDLHNCQUFrQixFQUFFRCxPQUFPLElBQUlGLFFBQVEsQ0FBQ0csc0ZBQWtCLENBQUNELE9BQUQsQ0FB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QVMscUJBQXFCLGlEQUFpRCwrQkFBK0Isa0NBQWtDLHlEQUF5RCxpQkFBaUIsYUFBYSxTQUFTLDJCQUEyQiwrQkFBK0IsdUJBQXVCLHFCQUFxQixrQ0FBa0Msc0NBQXNDLGdDQUFnQyxxREFBcUQsNkJBQTZCLDBCQUEwQiw2QkFBNkIsNEJBQTRCLDZDQUE2Qyx1Q0FBdUMsNkJBQTZCLDhCQUE4QixvQ0FBb0MscUNBQXFDLGlCQUFpQixhQUFhLFNBQVMsS0FBSyxtQkFBbUI7Ozs7Ozs7Ozs7Ozs7O0FDRDNvRixjQUFjLG1CQUFPLENBQUMsNkpBQWtKOztBQUV4Syw0Q0FBNEMsUUFBUzs7QUFFckQ7QUFDQTs7OztBQUlBLGVBQWU7O0FBRWY7QUFDQTs7QUFFQSxhQUFhLG1CQUFPLENBQUMsMEVBQStEOztBQUVwRjs7QUFFQSxHQUFHLEtBQVUsRUFBRSxFIiwiZmlsZSI6ImJ1aWxkLzcuYWYyMmYxZTY0YTE4MzU5NjJjOTkuY2h1bmsuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50IH0gZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSAncmVhY3QtcmVkdXgnO1xyXG5pbXBvcnQgeyBzdG9yZSB9IGZyb20gJy4uLy4uLy4uLy4uL2NvbW1vbi9jb25maWcvcmVkdXgvcmVkdXguc3RvcmUnO1xyXG5pbXBvcnQgeyB1cGRhdGVQcm9qZWN0LCB1cGRhdGVQcm9qZWN0SXRlbXMsIHVwZGF0ZVByb2plY3RDb25maWcgfSBmcm9tICcuLi8uLi9jb25maWcvcmVkdXgvcmVkdXguYWN0aW9ucyc7XHJcbmltcG9ydCB7IFByb2plY3RTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vLi4vY29tbW9uL3NlcnZpY2VzL3Byb2plY3Quc2VydmljZSc7XHJcblxyXG5pbXBvcnQgJy4uLy4uLy4uL2Fzc2V0cy9zdHlsZS9jb21wb25lbnRzL2l0ZW0vaXRlbS5zY3NzJztcclxuXHJcbmNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9IChzdGF0ZSkgPT4gc3RhdGU7XHJcbmNvbnN0IG1hcERpc3BhdGNoVG9Qcm9wcyA9IChkaXNwYXRjaCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB1cGRhdGVQcm9qZWN0OiBwYXlsb2FkID0+IGRpc3BhdGNoKHVwZGF0ZVByb2plY3QocGF5bG9hZCkpLFxyXG4gICAgICAgIHVwZGF0ZVByb2plY3RJdGVtczogcGF5bG9hZCA9PiBkaXNwYXRjaCh1cGRhdGVQcm9qZWN0SXRlbXMocGF5bG9hZCkpLFxyXG4gICAgICAgIHVwZGF0ZVByb2plY3RDb25maWc6IHBheWxvYWQgPT4gZGlzcGF0Y2godXBkYXRlUHJvamVjdENvbmZpZyhwYXlsb2FkKSlcclxuICAgIH07XHJcbn07XHJcblxyXG5jb25zdCBkZWZhdWx0SXRlbUNvbnRhaW5lckNsYXNzTmFtZSA9ICdpdGVtLWNvbnRhaW5lcic7XHJcblxyXG5jbGFzcyBJdGVtQ29tcG9uZW50IGV4dGVuZHMgQ29tcG9uZW50IHtcclxuICAgIGRyYWdnaW5nID0gZmFsc2U7XHJcbiAgICBkcmFnT2Zmc2V0WCA9IDA7XHJcbiAgICBkcmFnT2Zmc2V0WSA9IDA7XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcblxyXG4gICAgICAgIGNvbnN0IFRhZ05hbWUgPSBgJHt0aGlzLnByb3BzLnRhZy5uYW1lfWA7XHJcbiAgICAgICAgdmFyIHRhZyA9IG51bGw7XHJcbiAgICAgICAgaWYgKHRoaXMucHJvcHMudGFnLmlubmVyVmFsdWUpIHtcclxuICAgICAgICAgICAgdGFnID0gKDxUYWdOYW1lPnt0aGlzLnByb3BzLnRhZy52YWx1ZX08L1RhZ05hbWU+KVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRhZyA9ICg8VGFnTmFtZSB2YWx1ZT17dGhpcy5wcm9wcy50YWcudmFsdWV9PjwvVGFnTmFtZT4pXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCB7IHdvcmtzcGFjZSB9ID0gc3RvcmUuZ2V0U3RhdGUoKS5lbmdpbmVSZWR1Y2VyO1xyXG4gICAgICAgIGNvbnN0IHByb2plY3QgPSB3b3Jrc3BhY2UucHJvamVjdDtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLnN0YXRlID0ge1xyXG4gICAgICAgICAgICBpbmZvOiBwcm9qZWN0Lml0ZW1zW3RoaXMucHJvcHMudWlkXSxcclxuICAgICAgICAgICAgaXRlbUNvbnRhaW5lckNsYXNzTmFtZTogZGVmYXVsdEl0ZW1Db250YWluZXJDbGFzc05hbWUsXHJcbiAgICAgICAgICAgIHRhZ1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMucHJvamVjdFNlcnZpY2UgPSBuZXcgUHJvamVjdFNlcnZpY2UoKTtcclxuXHJcbiAgICAgICAgdGhpcy5oYW5kbGVJdGVtQ29udGFpbmVyQ2xpY2sgPSB0aGlzLmhhbmRsZUl0ZW1Db250YWluZXJDbGljay5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlT3V0c2lkZUNsaWNrID0gdGhpcy5oYW5kbGVPdXRzaWRlQ2xpY2suYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLmRyYWcgPSB0aGlzLmRyYWcuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLmhhbmRsZURyYWdTdGFydCA9IHRoaXMuaGFuZGxlRHJhZ1N0YXJ0LmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVEcmFnID0gdGhpcy5oYW5kbGVEcmFnLmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVEcmFnRW5kID0gdGhpcy5oYW5kbGVEcmFnRW5kLmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5tb3VzZW1vdmUgPSB0aGlzLm1vdXNlbW92ZS5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlS2V5RG93biA9IHRoaXMuaGFuZGxlS2V5RG93bi5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlTW91c2VFbnRlciA9IHRoaXMuaGFuZGxlTW91c2VFbnRlci5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlTW91c2VMZWF2ZSA9IHRoaXMuaGFuZGxlTW91c2VMZWF2ZS5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMucmVtb3ZlSXRlbSA9IHRoaXMucmVtb3ZlSXRlbS5iaW5kKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbXBvbmVudFdpbGxNb3VudCgpIHtcclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLmhhbmRsZU91dHNpZGVDbGljaywgZmFsc2UpO1xyXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMubW91c2Vtb3ZlLCBmYWxzZSk7XHJcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMuaGFuZGxlS2V5RG93biwgZmFsc2UpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xyXG4gICAgICAgIHRoaXMuZHJhZ0ltZyA9IG5ldyBJbWFnZSgwLDApO1xyXG4gICAgICAgIHRoaXMuZHJhZ0ltZy5zcmMgPSAnZGF0YTppbWFnZS9naWY7YmFzZTY0LFIwbEdPRGxoQVFBQkFJQUFBQUFBQVAvLy95SDVCQUVBQUFBQUxBQUFBQUFCQUFFQUFBSUJSQUE3JztcclxuICAgIH1cclxuXHJcbiAgICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcclxuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLmhhbmRsZU91dHNpZGVDbGljaywgZmFsc2UpO1xyXG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMubW91c2Vtb3V2ZSwgZmFsc2UpO1xyXG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLmhhbmRsZUtleURvd24sIGZhbHNlKTtcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVPdXRzaWRlQ2xpY2soZSkge1xyXG4gICAgICAgIGlmICh0aGlzLml0ZW0uY29udGFpbnMoZS50YXJnZXQpKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5zdGF0ZSwge1xyXG4gICAgICAgICAgICBoYXNGb2N1czogZmFsc2UsXHJcbiAgICAgICAgICAgIGl0ZW1Db250YWluZXJDbGFzc05hbWU6IGRlZmF1bHRJdGVtQ29udGFpbmVyQ2xhc3NOYW1lXHJcbiAgICAgICAgfSkpO1xyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZUl0ZW1Db250YWluZXJDbGljaygpIHtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKE9iamVjdC5hc3NpZ24oe30sIHRoaXMuc3RhdGUsIHtcclxuICAgICAgICAgICAgaGFzRm9jdXM6IHRydWUsXHJcbiAgICAgICAgICAgIGl0ZW1Db250YWluZXJDbGFzc05hbWU6IGRlZmF1bHRJdGVtQ29udGFpbmVyQ2xhc3NOYW1lICsgJyBmb2N1cydcclxuICAgICAgICB9KSk7XHJcblxyXG4gICAgICAgIGNvbnN0IHsgd29ya3NwYWNlIH0gPSBzdG9yZS5nZXRTdGF0ZSgpLmVuZ2luZVJlZHVjZXI7XHJcbiAgICAgICAgdmFyIGl0ZW1zID0gd29ya3NwYWNlLnByb2plY3QuaXRlbXM7XHJcblxyXG4gICAgICAgIGlmIChpdGVtc1t0aGlzLnByb3BzLnVpZF0pIHtcclxuICAgICAgICAgICAgY29uc3QgY3VycmVudF96ID0gaXRlbXNbdGhpcy5wcm9wcy51aWRdLno7XHJcbiAgICAgICAgICAgIHZhciB0b3BfeiA9IGN1cnJlbnRfejtcclxuICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIGl0ZW1zKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoa2V5ICE9PSB0aGlzLnByb3BzLnVpZCAmJiBpdGVtc1trZXldLnogPiBjdXJyZW50X3opIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbXNba2V5XS56ID4gdG9wX3opIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdG9wX3ogPSBpdGVtc1trZXldLno7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zW2tleV0ueiAtPSAxO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGl0ZW1zW3RoaXMucHJvcHMudWlkXS56ID0gdG9wX3o7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnByb3BzLnVwZGF0ZVByb2plY3RJdGVtcyhpdGVtcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZURyYWdTdGFydChlKSB7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVJdGVtQ29udGFpbmVyQ2xpY2soKTtcclxuXHJcbiAgICAgICAgZS5kYXRhVHJhbnNmZXIuc2V0RHJhZ0ltYWdlKHRoaXMuZHJhZ0ltZywgMCwgMCk7XHJcbiAgICAgICAgZS50YXJnZXQuc3R5bGUuY3Vyc29yID0gJ21vdmUnO1xyXG5cclxuICAgICAgICBjb25zdCB7IHdvcmtzcGFjZSB9ID0gc3RvcmUuZ2V0U3RhdGUoKS5lbmdpbmVSZWR1Y2VyO1xyXG4gICAgICAgIGNvbnN0IGNvbnRhaW5lciA9IHdvcmtzcGFjZS5wcm9qZWN0LmNvbnRhaW5lci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgICAgICBjb25zdCBpdGVtID0gd29ya3NwYWNlLnByb2plY3QuaXRlbXNbdGhpcy5wcm9wcy51aWRdO1xyXG5cclxuICAgICAgICB0aGlzLmRyYWdnaW5nID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLmRyYWdPZmZzZXRYID0gaXRlbS54IC0gKGUuY2xpZW50WCAtIGNvbnRhaW5lci5sZWZ0KTtcclxuICAgICAgICB0aGlzLmRyYWdPZmZzZXRZID0gaXRlbS55IC0gKGUuY2xpZW50WSAtIGNvbnRhaW5lci50b3ApO1xyXG5cclxuICAgICAgICB0aGlzLnByb3BzLnVwZGF0ZVByb2plY3RDb25maWcoT2JqZWN0LmFzc2lnbih7fSwgd29ya3NwYWNlLnByb2plY3QuY29uZmlnLCB7XHJcbiAgICAgICAgICAgIHVpOiBPYmplY3QuYXNzaWduKHt9LCB3b3Jrc3BhY2UucHJvamVjdC5jb25maWcudWksIHtcclxuICAgICAgICAgICAgICAgIGdfY2xhc3NfbGlzdDogJ2dpZCBoaWRkZW4nXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSkpO1xyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZURyYWcoZSkge1xyXG4gICAgICAgIHRoaXMuZHJhZyhlKTtcclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBoYW5kbGVEcmFnRW5kKGUpIHtcclxuICAgICAgICB2YXIgaW5mbyA9IHRoaXMuZHJhZyhlKTtcclxuICAgICAgICBjb25zdCB7IHdvcmtzcGFjZSB9ID0gc3RvcmUuZ2V0U3RhdGUoKS5lbmdpbmVSZWR1Y2VyO1xyXG5cclxuICAgICAgICB0aGlzLmRyYWdnaW5nID0gZmFsc2U7XHJcblxyXG4gICAgICAgIHRoaXMucHJvcHMudXBkYXRlUHJvamVjdENvbmZpZyhPYmplY3QuYXNzaWduKHt9LCB3b3Jrc3BhY2UucHJvamVjdC5jb25maWcsIHtcclxuICAgICAgICAgICAgdWk6IE9iamVjdC5hc3NpZ24oe30sIHdvcmtzcGFjZS5wcm9qZWN0LmNvbmZpZy51aSwge1xyXG4gICAgICAgICAgICAgICAgZ19jbGFzc19saXN0OiAnZ2lkJ1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0pKTtcclxuXHJcbiAgICAgICAgdGhpcy5wcm9wcy51cGRhdGVQcm9qZWN0KHtcclxuICAgICAgICAgICAgcGF0aDogdGhpcy5wcm9wcy51aWQsXHJcbiAgICAgICAgICAgIHZhbHVlOiBpbmZvXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGF3YWl0IHRoaXMucHJvamVjdFNlcnZpY2UucHV0KHdvcmtzcGFjZS5pZCwgd29ya3NwYWNlLnByb2plY3QucHJvamVjdF9pZCwgd29ya3NwYWNlLnByb2plY3QpO1xyXG4gICAgfVxyXG5cclxuICAgIGRyYWcoZSkge1xyXG4gICAgICAgIGNvbnN0IHsgd29ya3NwYWNlIH0gPSBzdG9yZS5nZXRTdGF0ZSgpLmVuZ2luZVJlZHVjZXI7XHJcbiAgICAgICAgY29uc3QgY29udGFpbmVyID0gd29ya3NwYWNlLnByb2plY3QuY29udGFpbmVyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgICAgIGNvbnN0IGRlZmF1bHRXaWR0aCA9IHdvcmtzcGFjZS5wcm9qZWN0LmNvbmZpZy5jZWxsV2lkdGg7XHJcbiAgICAgICAgY29uc3QgZGVmYXVsdEhlaWdodCA9IHdvcmtzcGFjZS5wcm9qZWN0LmNvbmZpZy5jZWxsSGVpZ2h0O1xyXG5cclxuICAgICAgICBjb25zdCB4ID0gTWF0aC5mbG9vcigoZS5jbGllbnRYIC0gKGNvbnRhaW5lci5sZWZ0IC0gdGhpcy5kcmFnT2Zmc2V0WCkpIC8gZGVmYXVsdFdpZHRoKSAqIGRlZmF1bHRXaWR0aDtcclxuICAgICAgICBjb25zdCB5ID0gTWF0aC5mbG9vcigoZS5jbGllbnRZIC0gKGNvbnRhaW5lci50b3AgLSB0aGlzLmRyYWdPZmZzZXRZKSkgLyBkZWZhdWx0SGVpZ2h0KSAqIGRlZmF1bHRIZWlnaHQ7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdmFyIGxlZnQgPSB4ID4gMCA/IHggOiAwO1xyXG4gICAgICAgIHZhciB0b3AgPSB5ID4gMCA/IHkgOiAwO1xyXG5cclxuICAgICAgICBjb25zdCByZWN0ID0gdGhpcy5pdGVtLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgICAgIGNvbnN0IGl0ZW1PZmZzZXRMZWZ0ID0gbGVmdCArIHJlY3Qud2lkdGg7XHJcbiAgICAgICAgY29uc3QgaXRlbU9mZnNldFRvcCA9IHRvcCArIHJlY3QuaGVpZ2h0O1xyXG5cclxuICAgICAgICBpZiAoaXRlbU9mZnNldExlZnQgPiBjb250YWluZXIud2lkdGgpIHtcclxuICAgICAgICAgICAgbGVmdCA9IE1hdGguZmxvb3IoKGNvbnRhaW5lci53aWR0aCAtIHJlY3Qud2lkdGgpIC8gZGVmYXVsdFdpZHRoKSAqIGRlZmF1bHRXaWR0aDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChpdGVtT2Zmc2V0VG9wID4gY29udGFpbmVyLmhlaWdodCkge1xyXG4gICAgICAgICAgICB0b3AgPSBNYXRoLmZsb29yKChjb250YWluZXIuaGVpZ2h0IC0gcmVjdC5oZWlnaHQpIC8gZGVmYXVsdEhlaWdodCkgKiBkZWZhdWx0SGVpZ2h0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgaW5mbyA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuc3RhdGUuaW5mbywge1xyXG4gICAgICAgICAgICB4OiBsZWZ0LFxyXG4gICAgICAgICAgICB5OiB0b3BcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZShPYmplY3QuYXNzaWduKHt9LCB0aGlzLnN0YXRlLCB7XHJcbiAgICAgICAgICAgIGluZm9cclxuICAgICAgICB9KSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIGluZm87XHJcbiAgICB9XHJcblxyXG4gICAgbW91c2Vtb3ZlKGUpIHtcclxuICAgICAgICBpZiAodGhpcy5kcmFnZ2luZykge1xyXG4gICAgICAgICAgICBlLnRhcmdldC5zdHlsZS5jdXJzb3IgPSAnbW92ZSc7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIGhhbmRsZUtleURvd24oZSkge1xyXG4gICAgICAgIGlmICghdGhpcy5zdGF0ZS5oYXNGb2N1cykge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCByZWN0ID0gdGhpcy5pdGVtLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgICAgIGNvbnN0IHsgd29ya3NwYWNlIH0gPSBzdG9yZS5nZXRTdGF0ZSgpLmVuZ2luZVJlZHVjZXI7XHJcbiAgICAgICAgY29uc3QgY29udGFpbmVyID0gd29ya3NwYWNlLnByb2plY3QuY29udGFpbmVyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgICAgIHZhciBpbmZvID0gdGhpcy5zdGF0ZS5pbmZvO1xyXG5cclxuICAgICAgICB2YXIgc2F2ZSA9IGZhbHNlO1xyXG4gICAgICAgIHZhciB4LCB5O1xyXG4gICAgICAgIHN3aXRjaCAoZS5rZXlDb2RlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgMzc6IC8vIGxlZnRcclxuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgIHggPSBpbmZvLnggLSB3b3Jrc3BhY2UucHJvamVjdC5jb25maWcuY2VsbFdpZHRoO1xyXG4gICAgICAgICAgICAgICAgaWYgKHggPj0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGluZm8ueCA9IHg7XHJcbiAgICAgICAgICAgICAgICAgICAgc2F2ZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAzODogLy8gdXBcclxuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgIHkgPSBpbmZvLnkgLSB3b3Jrc3BhY2UucHJvamVjdC5jb25maWcuY2VsbEhlaWdodDtcclxuICAgICAgICAgICAgICAgIGlmICh5ID49IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBpbmZvLnkgPSB5O1xyXG4gICAgICAgICAgICAgICAgICAgIHNhdmUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgMzk6IC8vIHJpZ2h0XHJcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICB4ID0gaW5mby54ICsgd29ya3NwYWNlLnByb2plY3QuY29uZmlnLmNlbGxXaWR0aDtcclxuICAgICAgICAgICAgICAgIGlmICgoeCArIHJlY3Qud2lkdGgpIDw9IGNvbnRhaW5lci53aWR0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGluZm8ueCA9IHg7XHJcbiAgICAgICAgICAgICAgICAgICAgc2F2ZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSA0MDogLy8gZG93blxyXG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgeSA9IGluZm8ueSArIHdvcmtzcGFjZS5wcm9qZWN0LmNvbmZpZy5jZWxsSGVpZ2h0O1xyXG4gICAgICAgICAgICAgICAgaWYgKCh5ICsgcmVjdC5oZWlnaHQpIDw9IGNvbnRhaW5lci5oZWlnaHQpIHtcclxuICAgICAgICAgICAgICAgICAgICBpbmZvLnkgPSB5O1xyXG4gICAgICAgICAgICAgICAgICAgIHNhdmUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoc2F2ZSkge1xyXG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKE9iamVjdC5hc3NpZ24oe30sIHRoaXMuc3RhdGUsIHtcclxuICAgICAgICAgICAgICAgIGluZm9cclxuICAgICAgICAgICAgfSkpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5wcm9wcy51cGRhdGVQcm9qZWN0KHtcclxuICAgICAgICAgICAgICAgIHBhdGg6IHRoaXMucHJvcHMudWlkLFxyXG4gICAgICAgICAgICAgICAgdmFsdWU6IGluZm9cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBhd2FpdCB0aGlzLnByb2plY3RTZXJ2aWNlLnB1dCh3b3Jrc3BhY2UuaWQsIHdvcmtzcGFjZS5wcm9qZWN0LnByb2plY3RfaWQsIHdvcmtzcGFjZS5wcm9qZWN0KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlTW91c2VFbnRlcigpIHtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKE9iamVjdC5hc3NpZ24oe30sIHRoaXMuc3RhdGUsIHtcclxuICAgICAgICAgICAgaG92ZXI6IHRydWVcclxuICAgICAgICB9KSk7XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlTW91c2VMZWF2ZSgpIHtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKE9iamVjdC5hc3NpZ24oe30sIHRoaXMuc3RhdGUsIHtcclxuICAgICAgICAgICAgaG92ZXI6IGZhbHNlXHJcbiAgICAgICAgfSkpO1xyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIHJlbW92ZUl0ZW0oZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cclxuICAgICAgICB2YXIgeyB3b3Jrc3BhY2UgfSA9IHN0b3JlLmdldFN0YXRlKCkuZW5naW5lUmVkdWNlcjtcclxuICAgICAgICB2YXIgcHJvamVjdCA9IHdvcmtzcGFjZS5wcm9qZWN0O1xyXG4gICAgICAgIHZhciBpdGVtcyA9IHByb2plY3QuaXRlbXM7XHJcblxyXG4gICAgICAgIGNvbnN0IGN1cnJlbnRfeiA9IGl0ZW1zW3RoaXMucHJvcHMudWlkXS56O1xyXG4gICAgICAgIHZhciB0b3BfeiA9IGN1cnJlbnRfejtcclxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gaXRlbXMpIHtcclxuICAgICAgICAgICAgaWYgKGtleSAhPT0gdGhpcy5wcm9wcy51aWQgJiYgaXRlbXNba2V5XS56ID4gY3VycmVudF96KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXRlbXNba2V5XS56ID4gdG9wX3opIHtcclxuICAgICAgICAgICAgICAgICAgICB0b3BfeiA9IGl0ZW1zW2tleV0uejtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGl0ZW1zW2tleV0ueiAtPSAxO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBkZWxldGUgaXRlbXNbdGhpcy5wcm9wcy51aWRdO1xyXG5cclxuICAgICAgICBhd2FpdCB0aGlzLnByb2plY3RTZXJ2aWNlLnB1dCh3b3Jrc3BhY2UuaWQsIHdvcmtzcGFjZS5wcm9qZWN0LnByb2plY3RfaWQsIHdvcmtzcGFjZS5wcm9qZWN0KTtcclxuXHJcbiAgICAgICAgdGhpcy5wcm9wcy51cGRhdGVQcm9qZWN0SXRlbXMoaXRlbXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IGl0ZW1Db250YWluZXJDbGFzc05hbWUsIGluZm8sIHRhZywgaG92ZXIsIGhhc0ZvY3VzIH0gPSB0aGlzLnN0YXRlO1xyXG5cclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2IFxyXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtpdGVtQ29udGFpbmVyQ2xhc3NOYW1lfVxyXG4gICAgICAgICAgICAgICAgcmVmPXtpdGVtID0+IHRoaXMuaXRlbSA9IGl0ZW19XHJcbiAgICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLmhhbmRsZUl0ZW1Db250YWluZXJDbGlja31cclxuICAgICAgICAgICAgICAgIGRyYWdnYWJsZT17dHJ1ZX1cclxuICAgICAgICAgICAgICAgIG9uRHJhZ1N0YXJ0PXt0aGlzLmhhbmRsZURyYWdTdGFydH1cclxuICAgICAgICAgICAgICAgIG9uRHJhZz17dGhpcy5oYW5kbGVEcmFnfVxyXG4gICAgICAgICAgICAgICAgb25EcmFnRW5kPXt0aGlzLmhhbmRsZURyYWdFbmR9XHJcbiAgICAgICAgICAgICAgICBvbk1vdXNlRW50ZXI9e3RoaXMuaGFuZGxlTW91c2VFbnRlcn1cclxuICAgICAgICAgICAgICAgIG9uTW91c2VMZWF2ZT17dGhpcy5oYW5kbGVNb3VzZUxlYXZlfVxyXG4gICAgICAgICAgICAgICAgc3R5bGU9e3sgXHJcbiAgICAgICAgICAgICAgICAgICAgdG9wOiBpbmZvLnksIFxyXG4gICAgICAgICAgICAgICAgICAgIGxlZnQ6IGluZm8ueCxcclxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogaW5mby53aWR0aCxcclxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IGluZm8uaGVpZ2h0LFxyXG4gICAgICAgICAgICAgICAgICAgIHpJbmRleDogaW5mby56ICsgMTAwXHJcbiAgICAgICAgICAgICAgICB9fT5cclxuICAgICAgICAgICAgICAgIHt0YWd9XHJcbiAgICAgICAgICAgICAgICB7aG92ZXIgfHwgaGFzRm9jdXMgP1xyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJpdGVtLWFjdGlvbnNcIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNsb3NlLWljb24taXRlbSBzaGFkb3ctbm9uZVwiIG9uQ2xpY2s9e3RoaXMucmVtb3ZlSXRlbX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImNsb3NlLWljb25cIj48L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDogbnVsbH1cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgSXRlbSA9IGNvbm5lY3QobWFwU3RhdGVUb1Byb3BzLCBtYXBEaXNwYXRjaFRvUHJvcHMpKEl0ZW1Db21wb25lbnQpO1xyXG5leHBvcnQgZGVmYXVsdCBJdGVtOyIsImV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzXCIpKHRydWUpO1xuLy8gTW9kdWxlXG5leHBvcnRzLnB1c2goW21vZHVsZS5pZCwgXCIuaXRlbS1jb250YWluZXIge1xcbiAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgYm9yZGVyOiAxcHggc29saWQgIzc4Nzg3ODtcXG4gIGJhY2tncm91bmQ6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC45KTtcXG4gIHBhZGRpbmc6IDRweDtcXG4gIGN1cnNvcjogbW92ZTsgfVxcbiAgLml0ZW0tY29udGFpbmVyIGgxLCAuaXRlbS1jb250YWluZXIgaDIsIC5pdGVtLWNvbnRhaW5lciBoMywgLml0ZW0tY29udGFpbmVyIGg0LCAuaXRlbS1jb250YWluZXIgaDUsIC5pdGVtLWNvbnRhaW5lciBoNiB7XFxuICAgIG1hcmdpbjogMDsgfVxcbiAgLml0ZW0tY29udGFpbmVyLmZvY3VzIHtcXG4gICAgYmFja2dyb3VuZDogcmdiYSgyNDAsIDI0MCwgMjQwLCAwLjkpOyB9XFxuICAgIC5pdGVtLWNvbnRhaW5lci5mb2N1cyAuaXRlbS1hY3Rpb25zIC5jbG9zZS1pY29uLWl0ZW0ge1xcbiAgICAgIGJhY2tncm91bmQ6IHJnYmEoMjQwLCAyNDAsIDI0MCwgMC41KTsgfVxcbiAgLml0ZW0tY29udGFpbmVyIC5pdGVtLWFjdGlvbnMge1xcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICAgIHJpZ2h0OiAxcHg7XFxuICAgIHRvcDogMXB4OyB9XFxuICAgIC5pdGVtLWNvbnRhaW5lciAuaXRlbS1hY3Rpb25zIC5jbG9zZS1pY29uLWl0ZW0ge1xcbiAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcXG4gICAgICBjdXJzb3I6IHBvaW50ZXI7XFxuICAgICAgYmFja2dyb3VuZDogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjUpO1xcbiAgICAgIHBhZGRpbmc6IDJweDtcXG4gICAgICBib3JkZXI6IDA7XFxuICAgICAgaGVpZ2h0OiAxOHB4O1xcbiAgICAgIHdpZHRoOiAxOHB4OyB9XFxuICAgICAgLml0ZW0tY29udGFpbmVyIC5pdGVtLWFjdGlvbnMgLmNsb3NlLWljb24taXRlbSAuY2xvc2UtaWNvbiB7XFxuICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICAgICAgICB0b3A6IDNweDtcXG4gICAgICAgIGxlZnQ6IDRweDtcXG4gICAgICAgIGZvbnQtc2l6ZTogMTRweDtcXG4gICAgICAgIG1hcmdpbi10b3A6IC0xcHg7IH1cXG5cIiwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJDOi9Vc2Vycy9nYXJyaS9zb3VyY2UvcmVwb3Mvc25hcGZvcm0vY2xpZW50L2VuZ2luZS9hc3NldHMvc3R5bGUvY29tcG9uZW50cy9pdGVtL2NsaWVudC9lbmdpbmUvYXNzZXRzL3N0eWxlL2NvbXBvbmVudHMvaXRlbS9pdGVtLnNjc3NcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBQUE7RUFDSSxrQkFBa0I7RUFDbEIseUJBQXlCO0VBQ3pCLG9DQUFvQztFQUNwQyxZQUFZO0VBQ1osWUFBWSxFQUFBO0VBTGhCO0lBUVEsU0FBUyxFQUFBO0VBUmpCO0lBWVEsb0NBQW9DLEVBQUE7SUFaNUM7TUFnQmdCLG9DQUFvQyxFQUFBO0VBaEJwRDtJQXNCUSxrQkFBa0I7SUFDbEIsVUFBVTtJQUNWLFFBQVEsRUFBQTtJQXhCaEI7TUEyQlkscUJBQXFCO01BQ3JCLGVBQWU7TUFDZixvQ0FBb0M7TUFDcEMsWUFBWTtNQUNaLFNBQVM7TUFDVCxZQUFZO01BQ1osV0FBVyxFQUFBO01BakN2QjtRQW9DZ0Isa0JBQWtCO1FBQ2xCLFFBQVE7UUFDUixTQUFTO1FBQ1QsZUFBZTtRQUNmLGdCQUFnQixFQUFBXCIsXCJmaWxlXCI6XCJpdGVtLnNjc3NcIixcInNvdXJjZXNDb250ZW50XCI6W1wiLml0ZW0tY29udGFpbmVyIHtcXHJcXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xcclxcbiAgICBib3JkZXI6IDFweCBzb2xpZCAjNzg3ODc4O1xcclxcbiAgICBiYWNrZ3JvdW5kOiByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuOSk7XFxyXFxuICAgIHBhZGRpbmc6IDRweDtcXHJcXG4gICAgY3Vyc29yOiBtb3ZlO1xcclxcblxcclxcbiAgICBoMSwgaDIsIGgzLCBoNCwgaDUsIGg2IHtcXHJcXG4gICAgICAgIG1hcmdpbjogMDtcXHJcXG4gICAgfVxcclxcblxcclxcbiAgICAmLmZvY3VzIHtcXHJcXG4gICAgICAgIGJhY2tncm91bmQ6IHJnYmEoMjQwLCAyNDAsIDI0MCwgMC45KTtcXHJcXG5cXHJcXG4gICAgICAgIC5pdGVtLWFjdGlvbnMge1xcclxcbiAgICAgICAgICAgIC5jbG9zZS1pY29uLWl0ZW0ge1xcclxcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiByZ2JhKDI0MCwgMjQwLCAyNDAsIDAuNSk7XFxyXFxuICAgICAgICAgICAgfVxcclxcbiAgICAgICAgfVxcclxcbiAgICB9XFxyXFxuXFxyXFxuICAgIC5pdGVtLWFjdGlvbnMge1xcclxcbiAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xcclxcbiAgICAgICAgcmlnaHQ6IDFweDtcXHJcXG4gICAgICAgIHRvcDogMXB4O1xcclxcblxcclxcbiAgICAgICAgLmNsb3NlLWljb24taXRlbSB7XFxyXFxuICAgICAgICAgICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xcclxcbiAgICAgICAgICAgIGN1cnNvcjogcG9pbnRlcjtcXHJcXG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuNSk7XFxyXFxuICAgICAgICAgICAgcGFkZGluZzogMnB4O1xcclxcbiAgICAgICAgICAgIGJvcmRlcjogMDtcXHJcXG4gICAgICAgICAgICBoZWlnaHQ6IDE4cHg7XFxyXFxuICAgICAgICAgICAgd2lkdGg6IDE4cHg7XFxyXFxuICAgICAgICAgICAgXFxyXFxuICAgICAgICAgICAgLmNsb3NlLWljb24ge1xcclxcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XFxyXFxuICAgICAgICAgICAgICAgIHRvcDogM3B4O1xcclxcbiAgICAgICAgICAgICAgICBsZWZ0OiA0cHg7XFxyXFxuICAgICAgICAgICAgICAgIGZvbnQtc2l6ZTogMTRweDtcXHJcXG4gICAgICAgICAgICAgICAgbWFyZ2luLXRvcDogLTFweDtcXHJcXG4gICAgICAgICAgICB9XFxyXFxuICAgICAgICB9XFxyXFxuICAgIH1cXHJcXG59XCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG5cbiIsIlxudmFyIGNvbnRlbnQgPSByZXF1aXJlKFwiISEuLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcz8/cmVmLS02LTEhLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2xpYi9sb2FkZXIuanM/P3JlZi0tNi0yIS4vaXRlbS5zY3NzXCIpO1xuXG5pZih0eXBlb2YgY29udGVudCA9PT0gJ3N0cmluZycpIGNvbnRlbnQgPSBbW21vZHVsZS5pZCwgY29udGVudCwgJyddXTtcblxudmFyIHRyYW5zZm9ybTtcbnZhciBpbnNlcnRJbnRvO1xuXG5cblxudmFyIG9wdGlvbnMgPSB7XCJobXJcIjp0cnVlfVxuXG5vcHRpb25zLnRyYW5zZm9ybSA9IHRyYW5zZm9ybVxub3B0aW9ucy5pbnNlcnRJbnRvID0gdW5kZWZpbmVkO1xuXG52YXIgdXBkYXRlID0gcmVxdWlyZShcIiEuLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2xpYi9hZGRTdHlsZXMuanNcIikoY29udGVudCwgb3B0aW9ucyk7XG5cbmlmKGNvbnRlbnQubG9jYWxzKSBtb2R1bGUuZXhwb3J0cyA9IGNvbnRlbnQubG9jYWxzO1xuXG5pZihtb2R1bGUuaG90KSB7XG5cdG1vZHVsZS5ob3QuYWNjZXB0KFwiISEuLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcz8/cmVmLS02LTEhLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2xpYi9sb2FkZXIuanM/P3JlZi0tNi0yIS4vaXRlbS5zY3NzXCIsIGZ1bmN0aW9uKCkge1xuXHRcdHZhciBuZXdDb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanM/P3JlZi0tNi0xIS4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9saWIvbG9hZGVyLmpzPz9yZWYtLTYtMiEuL2l0ZW0uc2Nzc1wiKTtcblxuXHRcdGlmKHR5cGVvZiBuZXdDb250ZW50ID09PSAnc3RyaW5nJykgbmV3Q29udGVudCA9IFtbbW9kdWxlLmlkLCBuZXdDb250ZW50LCAnJ11dO1xuXG5cdFx0dmFyIGxvY2FscyA9IChmdW5jdGlvbihhLCBiKSB7XG5cdFx0XHR2YXIga2V5LCBpZHggPSAwO1xuXG5cdFx0XHRmb3Ioa2V5IGluIGEpIHtcblx0XHRcdFx0aWYoIWIgfHwgYVtrZXldICE9PSBiW2tleV0pIHJldHVybiBmYWxzZTtcblx0XHRcdFx0aWR4Kys7XG5cdFx0XHR9XG5cblx0XHRcdGZvcihrZXkgaW4gYikgaWR4LS07XG5cblx0XHRcdHJldHVybiBpZHggPT09IDA7XG5cdFx0fShjb250ZW50LmxvY2FscywgbmV3Q29udGVudC5sb2NhbHMpKTtcblxuXHRcdGlmKCFsb2NhbHMpIHRocm93IG5ldyBFcnJvcignQWJvcnRpbmcgQ1NTIEhNUiBkdWUgdG8gY2hhbmdlZCBjc3MtbW9kdWxlcyBsb2NhbHMuJyk7XG5cblx0XHR1cGRhdGUobmV3Q29udGVudCk7XG5cdH0pO1xuXG5cdG1vZHVsZS5ob3QuZGlzcG9zZShmdW5jdGlvbigpIHsgdXBkYXRlKCk7IH0pO1xufSJdLCJzb3VyY2VSb290IjoiIn0=