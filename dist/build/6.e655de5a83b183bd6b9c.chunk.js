(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[6],{

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
    gClicked: payload => dispatch(Object(_config_redux_redux_actions__WEBPACK_IMPORTED_MODULE_3__["gClicked"])(payload)),
    updateProjectItems: payload => dispatch(Object(_config_redux_redux_actions__WEBPACK_IMPORTED_MODULE_3__["updateProjectItems"])(payload))
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
    this.props.gClicked({
      gClassList: 'gid hidden'
    });
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
  }

  handleDrag(e) {
    this.drag(e);
  }

  async handleDragEnd(e) {
    var info = this.drag(e);
    this.dragging = false;
    this.props.gClicked({
      gClassList: 'gid'
    });
    this.props.updateProject({
      path: this.props.uid,
      value: info
    });
    const {
      workspace
    } = _common_config_redux_redux_store__WEBPACK_IMPORTED_MODULE_2__["store"].getState().engineReducer;
    await this.projectService.put(workspace.id, workspace.project.id, workspace.project);
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
        x = info.x - workspace.project.config.cellWidth;

        if (x >= 0) {
          info.x = x;
          save = true;
        }

        break;

      case 38:
        // up
        y = info.y - workspace.project.config.cellHeight;

        if (y >= 0) {
          info.y = y;
          save = true;
        }

        break;

      case 39:
        // right
        x = info.x + workspace.project.config.cellWidth;

        if (x + rect.width <= container.width) {
          info.x = x;
          save = true;
        }

        break;

      case 40:
        // down
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
      await this.projectService.put(workspace.id, workspace.project.id, workspace.project);
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
    // if(!this.item.contains(e.target)) {
    //     return;
    // }
    e.preventDefault();
    e.stopPropagation(); //this.handleItemContainerClick();

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

    delete items[this.props.uid]; //items[this.props.uid].tag.value += 'ADD';

    await this.projectService.put(workspace.id, workspace.project.id, workspace.project);
    this.props.updateProjectItems(items); //await 
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9jbGllbnQvZW5naW5lL3NyYy9jb21wb25lbnRzL2l0ZW0vaXRlbS5jb21wb25lbnQuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L2VuZ2luZS9hc3NldHMvc3R5bGUvY29tcG9uZW50cy9pdGVtL2l0ZW0uc2NzcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvZW5naW5lL2Fzc2V0cy9zdHlsZS9jb21wb25lbnRzL2l0ZW0vaXRlbS5zY3NzPzgyMjkiXSwibmFtZXMiOlsibWFwU3RhdGVUb1Byb3BzIiwic3RhdGUiLCJtYXBEaXNwYXRjaFRvUHJvcHMiLCJkaXNwYXRjaCIsInVwZGF0ZVByb2plY3QiLCJwYXlsb2FkIiwiZ0NsaWNrZWQiLCJ1cGRhdGVQcm9qZWN0SXRlbXMiLCJkZWZhdWx0SXRlbUNvbnRhaW5lckNsYXNzTmFtZSIsIkl0ZW1Db21wb25lbnQiLCJDb21wb25lbnQiLCJjb25zdHJ1Y3RvciIsInByb3BzIiwiVGFnTmFtZSIsInRhZyIsIm5hbWUiLCJpbm5lclZhbHVlIiwidmFsdWUiLCJ3b3Jrc3BhY2UiLCJzdG9yZSIsImdldFN0YXRlIiwiZW5naW5lUmVkdWNlciIsInByb2plY3QiLCJpbmZvIiwiaXRlbXMiLCJ1aWQiLCJpdGVtQ29udGFpbmVyQ2xhc3NOYW1lIiwicHJvamVjdFNlcnZpY2UiLCJQcm9qZWN0U2VydmljZSIsImhhbmRsZUl0ZW1Db250YWluZXJDbGljayIsImJpbmQiLCJoYW5kbGVPdXRzaWRlQ2xpY2siLCJkcmFnIiwiaGFuZGxlRHJhZ1N0YXJ0IiwiaGFuZGxlRHJhZyIsImhhbmRsZURyYWdFbmQiLCJtb3VzZW1vdmUiLCJoYW5kbGVLZXlEb3duIiwiaGFuZGxlTW91c2VFbnRlciIsImhhbmRsZU1vdXNlTGVhdmUiLCJyZW1vdmVJdGVtIiwiY29tcG9uZW50V2lsbE1vdW50IiwiZG9jdW1lbnQiLCJhZGRFdmVudExpc3RlbmVyIiwiY29tcG9uZW50RGlkTW91bnQiLCJkcmFnSW1nIiwiSW1hZ2UiLCJzcmMiLCJjb21wb25lbnRXaWxsVW5tb3VudCIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJtb3VzZW1vdXZlIiwiZSIsIml0ZW0iLCJjb250YWlucyIsInRhcmdldCIsInNldFN0YXRlIiwiT2JqZWN0IiwiYXNzaWduIiwiaGFzRm9jdXMiLCJjdXJyZW50X3oiLCJ6IiwidG9wX3oiLCJrZXkiLCJnQ2xhc3NMaXN0IiwiZGF0YVRyYW5zZmVyIiwic2V0RHJhZ0ltYWdlIiwic3R5bGUiLCJjdXJzb3IiLCJjb250YWluZXIiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJkcmFnZ2luZyIsImRyYWdPZmZzZXRYIiwieCIsImNsaWVudFgiLCJsZWZ0IiwiZHJhZ09mZnNldFkiLCJ5IiwiY2xpZW50WSIsInRvcCIsInBhdGgiLCJwdXQiLCJpZCIsImRlZmF1bHRXaWR0aCIsImNvbmZpZyIsImNlbGxXaWR0aCIsImRlZmF1bHRIZWlnaHQiLCJjZWxsSGVpZ2h0IiwiTWF0aCIsImZsb29yIiwicmVjdCIsIml0ZW1PZmZzZXRMZWZ0Iiwid2lkdGgiLCJpdGVtT2Zmc2V0VG9wIiwiaGVpZ2h0Iiwic2F2ZSIsImtleUNvZGUiLCJob3ZlciIsInByZXZlbnREZWZhdWx0Iiwic3RvcFByb3BhZ2F0aW9uIiwicmVuZGVyIiwiekluZGV4IiwiSXRlbSIsImNvbm5lY3QiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7QUFFQSxNQUFNQSxlQUFlLEdBQUlDLEtBQUQsSUFBV0EsS0FBbkM7O0FBQ0EsTUFBTUMsa0JBQWtCLEdBQUlDLFFBQUQsSUFBYztBQUNyQyxTQUFPO0FBQ0hDLGlCQUFhLEVBQUVDLE9BQU8sSUFBSUYsUUFBUSxDQUFDQyxpRkFBYSxDQUFDQyxPQUFELENBQWQsQ0FEL0I7QUFFSEMsWUFBUSxFQUFFRCxPQUFPLElBQUlGLFFBQVEsQ0FBQ0csNEVBQVEsQ0FBQ0QsT0FBRCxDQUFULENBRjFCO0FBR0hFLHNCQUFrQixFQUFFRixPQUFPLElB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aUJBQWlCLGlCQUFpQixFQUFFLDRIQUE0SCxnQkFBZ0IsRUFBRSwyQkFBMkIsMkNBQTJDLEVBQUUsNERBQTRELDZDQUE2QyxFQUFFLG1DQUFtQyx5QkFBeUIsaUJBQWlCLGVBQWUsRUFBRSxzREFBc0QsOEJBQThCLHdCQUF3Qiw2Q0FBNkMscUJBQXFCLGtCQUFrQixxQkFBcUIsb0JBQW9CLEVBQUUsb0VBQW9FLDZCQUE2QixtQkFBbUIsb0JBQW9CLDBCQUEwQiwyQkFBMkIsRUFBRSxTQUFTLDJMQUEyTCxZQUFZLGFBQWEsYUFBYSxXQUFXLGVBQWUsTUFBTSxlQUFlLE1BQU0saUJBQWlCLE1BQU0sbUJBQW1CLE9BQU8sYUFBYSxXQUFXLGVBQWUsT0FBTyxhQUFhLFdBQVcsWUFBWSxXQUFXLFVBQVUsVUFBVSxlQUFlLE9BQU8sY0FBYyxXQUFXLFVBQVUsVUFBVSx5RUFBeUUsMkJBQTJCLGtDQUFrQyw2Q0FBNkMscUJBQXFCLHFCQUFxQixvQ0FBb0Msc0JBQXNCLFNBQVMscUJBQXFCLGlEQUFpRCwrQkFBK0Isa0NBQWtDLHlEQUF5RCxpQkFBaUIsYUFBYSxTQUFTLDJCQUEyQiwrQkFBK0IsdUJBQXVCLHFCQUFxQixrQ0FBa0Msc0NBQXNDLGdDQUFnQyxxREFBcUQsNkJBQTZCLDBCQUEwQiw2QkFBNkIsNEJBQTRCLDZDQUE2Qyx1Q0FBdUMsNkJBQTZCLDhCQUE4QixvQ0FBb0MscUNBQXFDLGlCQUFpQixhQUFhLFNBQVMsS0FBSyxtQkFBbUI7Ozs7Ozs7Ozs7Ozs7O0FDRDNvRixjQUFjLG1CQUFPLENBQUMsNkpBQWtKOztBQUV4Syw0Q0FBNEMsUUFBUzs7QUFFckQ7QUFDQTs7OztBQUlBLGVBQWU7O0FBRWY7QUFDQTs7QUFFQSxhQUFhLG1CQUFPLENBQUMsMEVBQStEOztBQUVwRjs7QUFFQSxHQUFHLEtBQVUsRUFBRSxFIiwiZmlsZSI6ImJ1aWxkLzYuZTY1NWRlNWE4M2IxODNiZDZiOWMuY2h1bmsuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50IH0gZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSAncmVhY3QtcmVkdXgnO1xyXG5pbXBvcnQgeyBzdG9yZSB9IGZyb20gJy4uLy4uLy4uLy4uL2NvbW1vbi9jb25maWcvcmVkdXgvcmVkdXguc3RvcmUnO1xyXG5pbXBvcnQgeyB1cGRhdGVQcm9qZWN0LCBnQ2xpY2tlZCwgdXBkYXRlUHJvamVjdEl0ZW1zIH0gZnJvbSAnLi4vLi4vY29uZmlnL3JlZHV4L3JlZHV4LmFjdGlvbnMnO1xyXG5pbXBvcnQgeyBQcm9qZWN0U2VydmljZSB9IGZyb20gJy4uLy4uLy4uLy4uL2NvbW1vbi9zZXJ2aWNlcy9wcm9qZWN0LnNlcnZpY2UnO1xyXG5cclxuaW1wb3J0ICcuLi8uLi8uLi9hc3NldHMvc3R5bGUvY29tcG9uZW50cy9pdGVtL2l0ZW0uc2Nzcyc7XHJcblxyXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSAoc3RhdGUpID0+IHN0YXRlO1xyXG5jb25zdCBtYXBEaXNwYXRjaFRvUHJvcHMgPSAoZGlzcGF0Y2gpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdXBkYXRlUHJvamVjdDogcGF5bG9hZCA9PiBkaXNwYXRjaCh1cGRhdGVQcm9qZWN0KHBheWxvYWQpKSxcclxuICAgICAgICBnQ2xpY2tlZDogcGF5bG9hZCA9PiBkaXNwYXRjaChnQ2xpY2tlZChwYXlsb2FkKSksXHJcbiAgICAgICAgdXBkYXRlUHJvamVjdEl0ZW1zOiBwYXlsb2FkID0+IGRpc3BhdGNoKHVwZGF0ZVByb2plY3RJdGVtcyhwYXlsb2FkKSlcclxuICAgIH07XHJcbn07XHJcblxyXG5jb25zdCBkZWZhdWx0SXRlbUNvbnRhaW5lckNsYXNzTmFtZSA9ICdpdGVtLWNvbnRhaW5lcic7XHJcblxyXG5jbGFzcyBJdGVtQ29tcG9uZW50IGV4dGVuZHMgQ29tcG9uZW50IHtcclxuICAgIGRyYWdnaW5nID0gZmFsc2U7XHJcbiAgICBkcmFnT2Zmc2V0WCA9IDA7XHJcbiAgICBkcmFnT2Zmc2V0WSA9IDA7XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcblxyXG4gICAgICAgIGNvbnN0IFRhZ05hbWUgPSBgJHt0aGlzLnByb3BzLnRhZy5uYW1lfWA7XHJcbiAgICAgICAgdmFyIHRhZyA9IG51bGw7XHJcbiAgICAgICAgaWYgKHRoaXMucHJvcHMudGFnLmlubmVyVmFsdWUpIHtcclxuICAgICAgICAgICAgdGFnID0gKDxUYWdOYW1lPnt0aGlzLnByb3BzLnRhZy52YWx1ZX08L1RhZ05hbWU+KVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRhZyA9ICg8VGFnTmFtZSB2YWx1ZT17dGhpcy5wcm9wcy50YWcudmFsdWV9PjwvVGFnTmFtZT4pXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCB7IHdvcmtzcGFjZSB9ID0gc3RvcmUuZ2V0U3RhdGUoKS5lbmdpbmVSZWR1Y2VyO1xyXG4gICAgICAgIGNvbnN0IHByb2plY3QgPSB3b3Jrc3BhY2UucHJvamVjdDtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLnN0YXRlID0ge1xyXG4gICAgICAgICAgICBpbmZvOiBwcm9qZWN0Lml0ZW1zW3RoaXMucHJvcHMudWlkXSxcclxuICAgICAgICAgICAgaXRlbUNvbnRhaW5lckNsYXNzTmFtZTogZGVmYXVsdEl0ZW1Db250YWluZXJDbGFzc05hbWUsXHJcbiAgICAgICAgICAgIHRhZ1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMucHJvamVjdFNlcnZpY2UgPSBuZXcgUHJvamVjdFNlcnZpY2UoKTtcclxuXHJcbiAgICAgICAgdGhpcy5oYW5kbGVJdGVtQ29udGFpbmVyQ2xpY2sgPSB0aGlzLmhhbmRsZUl0ZW1Db250YWluZXJDbGljay5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlT3V0c2lkZUNsaWNrID0gdGhpcy5oYW5kbGVPdXRzaWRlQ2xpY2suYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLmRyYWcgPSB0aGlzLmRyYWcuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLmhhbmRsZURyYWdTdGFydCA9IHRoaXMuaGFuZGxlRHJhZ1N0YXJ0LmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVEcmFnID0gdGhpcy5oYW5kbGVEcmFnLmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVEcmFnRW5kID0gdGhpcy5oYW5kbGVEcmFnRW5kLmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5tb3VzZW1vdmUgPSB0aGlzLm1vdXNlbW92ZS5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlS2V5RG93biA9IHRoaXMuaGFuZGxlS2V5RG93bi5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlTW91c2VFbnRlciA9IHRoaXMuaGFuZGxlTW91c2VFbnRlci5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlTW91c2VMZWF2ZSA9IHRoaXMuaGFuZGxlTW91c2VMZWF2ZS5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMucmVtb3ZlSXRlbSA9IHRoaXMucmVtb3ZlSXRlbS5iaW5kKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbXBvbmVudFdpbGxNb3VudCgpIHtcclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLmhhbmRsZU91dHNpZGVDbGljaywgZmFsc2UpO1xyXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMubW91c2Vtb3ZlLCBmYWxzZSk7XHJcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMuaGFuZGxlS2V5RG93biwgZmFsc2UpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xyXG4gICAgICAgIHRoaXMuZHJhZ0ltZyA9IG5ldyBJbWFnZSgwLDApO1xyXG4gICAgICAgIHRoaXMuZHJhZ0ltZy5zcmMgPSAnZGF0YTppbWFnZS9naWY7YmFzZTY0LFIwbEdPRGxoQVFBQkFJQUFBQUFBQVAvLy95SDVCQUVBQUFBQUxBQUFBQUFCQUFFQUFBSUJSQUE3JztcclxuICAgIH1cclxuXHJcbiAgICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcclxuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLmhhbmRsZU91dHNpZGVDbGljaywgZmFsc2UpO1xyXG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMubW91c2Vtb3V2ZSwgZmFsc2UpO1xyXG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLmhhbmRsZUtleURvd24sIGZhbHNlKTtcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVPdXRzaWRlQ2xpY2soZSkge1xyXG4gICAgICAgIGlmICh0aGlzLml0ZW0uY29udGFpbnMoZS50YXJnZXQpKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5zdGF0ZSwge1xyXG4gICAgICAgICAgICBoYXNGb2N1czogZmFsc2UsXHJcbiAgICAgICAgICAgIGl0ZW1Db250YWluZXJDbGFzc05hbWU6IGRlZmF1bHRJdGVtQ29udGFpbmVyQ2xhc3NOYW1lXHJcbiAgICAgICAgfSkpO1xyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZUl0ZW1Db250YWluZXJDbGljaygpIHtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKE9iamVjdC5hc3NpZ24oe30sIHRoaXMuc3RhdGUsIHtcclxuICAgICAgICAgICAgaGFzRm9jdXM6IHRydWUsXHJcbiAgICAgICAgICAgIGl0ZW1Db250YWluZXJDbGFzc05hbWU6IGRlZmF1bHRJdGVtQ29udGFpbmVyQ2xhc3NOYW1lICsgJyBmb2N1cydcclxuICAgICAgICB9KSk7XHJcblxyXG4gICAgICAgIGNvbnN0IHsgd29ya3NwYWNlIH0gPSBzdG9yZS5nZXRTdGF0ZSgpLmVuZ2luZVJlZHVjZXI7XHJcbiAgICAgICAgdmFyIGl0ZW1zID0gd29ya3NwYWNlLnByb2plY3QuaXRlbXM7XHJcblxyXG4gICAgICAgIGlmIChpdGVtc1t0aGlzLnByb3BzLnVpZF0pIHtcclxuICAgICAgICAgICAgY29uc3QgY3VycmVudF96ID0gaXRlbXNbdGhpcy5wcm9wcy51aWRdLno7XHJcbiAgICAgICAgICAgIHZhciB0b3BfeiA9IGN1cnJlbnRfejtcclxuICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIGl0ZW1zKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoa2V5ICE9PSB0aGlzLnByb3BzLnVpZCAmJiBpdGVtc1trZXldLnogPiBjdXJyZW50X3opIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbXNba2V5XS56ID4gdG9wX3opIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdG9wX3ogPSBpdGVtc1trZXldLno7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zW2tleV0ueiAtPSAxO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGl0ZW1zW3RoaXMucHJvcHMudWlkXS56ID0gdG9wX3o7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnByb3BzLnVwZGF0ZVByb2plY3RJdGVtcyhpdGVtcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZURyYWdTdGFydChlKSB7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVJdGVtQ29udGFpbmVyQ2xpY2soKTtcclxuXHJcbiAgICAgICAgdGhpcy5wcm9wcy5nQ2xpY2tlZCh7XHJcbiAgICAgICAgICAgIGdDbGFzc0xpc3Q6ICdnaWQgaGlkZGVuJ1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBlLmRhdGFUcmFuc2Zlci5zZXREcmFnSW1hZ2UodGhpcy5kcmFnSW1nLCAwLCAwKTtcclxuICAgICAgICBlLnRhcmdldC5zdHlsZS5jdXJzb3IgPSAnbW92ZSc7XHJcblxyXG4gICAgICAgIGNvbnN0IHsgd29ya3NwYWNlIH0gPSBzdG9yZS5nZXRTdGF0ZSgpLmVuZ2luZVJlZHVjZXI7XHJcbiAgICAgICAgY29uc3QgY29udGFpbmVyID0gd29ya3NwYWNlLnByb2plY3QuY29udGFpbmVyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgICAgIGNvbnN0IGl0ZW0gPSB3b3Jrc3BhY2UucHJvamVjdC5pdGVtc1t0aGlzLnByb3BzLnVpZF07XHJcblxyXG4gICAgICAgIHRoaXMuZHJhZ2dpbmcgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuZHJhZ09mZnNldFggPSBpdGVtLnggLSAoZS5jbGllbnRYIC0gY29udGFpbmVyLmxlZnQpO1xyXG4gICAgICAgIHRoaXMuZHJhZ09mZnNldFkgPSBpdGVtLnkgLSAoZS5jbGllbnRZIC0gY29udGFpbmVyLnRvcCk7XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlRHJhZyhlKSB7XHJcbiAgICAgICAgdGhpcy5kcmFnKGUpO1xyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIGhhbmRsZURyYWdFbmQoZSkge1xyXG4gICAgICAgIHZhciBpbmZvID0gdGhpcy5kcmFnKGUpO1xyXG5cclxuICAgICAgICB0aGlzLmRyYWdnaW5nID0gZmFsc2U7XHJcblxyXG4gICAgICAgIHRoaXMucHJvcHMuZ0NsaWNrZWQoe1xyXG4gICAgICAgICAgICBnQ2xhc3NMaXN0OiAnZ2lkJ1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnByb3BzLnVwZGF0ZVByb2plY3Qoe1xyXG4gICAgICAgICAgICBwYXRoOiB0aGlzLnByb3BzLnVpZCxcclxuICAgICAgICAgICAgdmFsdWU6IGluZm9cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY29uc3QgeyB3b3Jrc3BhY2UgfSA9IHN0b3JlLmdldFN0YXRlKCkuZW5naW5lUmVkdWNlcjtcclxuICAgICAgICBhd2FpdCB0aGlzLnByb2plY3RTZXJ2aWNlLnB1dCh3b3Jrc3BhY2UuaWQsIHdvcmtzcGFjZS5wcm9qZWN0LmlkLCB3b3Jrc3BhY2UucHJvamVjdCk7XHJcbiAgICB9XHJcblxyXG4gICAgZHJhZyhlKSB7XHJcbiAgICAgICAgY29uc3QgeyB3b3Jrc3BhY2UgfSA9IHN0b3JlLmdldFN0YXRlKCkuZW5naW5lUmVkdWNlcjtcclxuICAgICAgICBjb25zdCBjb250YWluZXIgPSB3b3Jrc3BhY2UucHJvamVjdC5jb250YWluZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICAgICAgY29uc3QgZGVmYXVsdFdpZHRoID0gd29ya3NwYWNlLnByb2plY3QuY29uZmlnLmNlbGxXaWR0aDtcclxuICAgICAgICBjb25zdCBkZWZhdWx0SGVpZ2h0ID0gd29ya3NwYWNlLnByb2plY3QuY29uZmlnLmNlbGxIZWlnaHQ7XHJcblxyXG4gICAgICAgIGNvbnN0IHggPSBNYXRoLmZsb29yKChlLmNsaWVudFggLSAoY29udGFpbmVyLmxlZnQgLSB0aGlzLmRyYWdPZmZzZXRYKSkgLyBkZWZhdWx0V2lkdGgpICogZGVmYXVsdFdpZHRoO1xyXG4gICAgICAgIGNvbnN0IHkgPSBNYXRoLmZsb29yKChlLmNsaWVudFkgLSAoY29udGFpbmVyLnRvcCAtIHRoaXMuZHJhZ09mZnNldFkpKSAvIGRlZmF1bHRIZWlnaHQpICogZGVmYXVsdEhlaWdodDtcclxuICAgICAgICBcclxuICAgICAgICB2YXIgbGVmdCA9IHggPiAwID8geCA6IDA7XHJcbiAgICAgICAgdmFyIHRvcCA9IHkgPiAwID8geSA6IDA7XHJcblxyXG4gICAgICAgIGNvbnN0IHJlY3QgPSB0aGlzLml0ZW0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICAgICAgY29uc3QgaXRlbU9mZnNldExlZnQgPSBsZWZ0ICsgcmVjdC53aWR0aDtcclxuICAgICAgICBjb25zdCBpdGVtT2Zmc2V0VG9wID0gdG9wICsgcmVjdC5oZWlnaHQ7XHJcblxyXG4gICAgICAgIGlmIChpdGVtT2Zmc2V0TGVmdCA+IGNvbnRhaW5lci53aWR0aCkge1xyXG4gICAgICAgICAgICBsZWZ0ID0gTWF0aC5mbG9vcigoY29udGFpbmVyLndpZHRoIC0gcmVjdC53aWR0aCkgLyBkZWZhdWx0V2lkdGgpICogZGVmYXVsdFdpZHRoO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGl0ZW1PZmZzZXRUb3AgPiBjb250YWluZXIuaGVpZ2h0KSB7XHJcbiAgICAgICAgICAgIHRvcCA9IE1hdGguZmxvb3IoKGNvbnRhaW5lci5oZWlnaHQgLSByZWN0LmhlaWdodCkgLyBkZWZhdWx0SGVpZ2h0KSAqIGRlZmF1bHRIZWlnaHQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBpbmZvID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5zdGF0ZS5pbmZvLCB7XHJcbiAgICAgICAgICAgIHg6IGxlZnQsXHJcbiAgICAgICAgICAgIHk6IHRvcFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnNldFN0YXRlKE9iamVjdC5hc3NpZ24oe30sIHRoaXMuc3RhdGUsIHtcclxuICAgICAgICAgICAgaW5mb1xyXG4gICAgICAgIH0pKTtcclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gaW5mbztcclxuICAgIH1cclxuXHJcbiAgICBtb3VzZW1vdmUoZSkge1xyXG4gICAgICAgIGlmICh0aGlzLmRyYWdnaW5nKSB7XHJcbiAgICAgICAgICAgIGUudGFyZ2V0LnN0eWxlLmN1cnNvciA9ICdtb3ZlJztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgaGFuZGxlS2V5RG93bihlKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLnN0YXRlLmhhc0ZvY3VzKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHJlY3QgPSB0aGlzLml0ZW0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICAgICAgY29uc3QgeyB3b3Jrc3BhY2UgfSA9IHN0b3JlLmdldFN0YXRlKCkuZW5naW5lUmVkdWNlcjtcclxuICAgICAgICBjb25zdCBjb250YWluZXIgPSB3b3Jrc3BhY2UucHJvamVjdC5jb250YWluZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICAgICAgdmFyIGluZm8gPSB0aGlzLnN0YXRlLmluZm87XHJcblxyXG4gICAgICAgIHZhciBzYXZlID0gZmFsc2U7XHJcbiAgICAgICAgdmFyIHgsIHk7XHJcbiAgICAgICAgc3dpdGNoIChlLmtleUNvZGUpIHtcclxuICAgICAgICAgICAgY2FzZSAzNzogLy8gbGVmdFxyXG4gICAgICAgICAgICAgICAgeCA9IGluZm8ueCAtIHdvcmtzcGFjZS5wcm9qZWN0LmNvbmZpZy5jZWxsV2lkdGg7XHJcbiAgICAgICAgICAgICAgICBpZiAoeCA+PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5mby54ID0geDtcclxuICAgICAgICAgICAgICAgICAgICBzYXZlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIDM4OiAvLyB1cFxyXG4gICAgICAgICAgICAgICAgeSA9IGluZm8ueSAtIHdvcmtzcGFjZS5wcm9qZWN0LmNvbmZpZy5jZWxsSGVpZ2h0O1xyXG4gICAgICAgICAgICAgICAgaWYgKHkgPj0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGluZm8ueSA9IHk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2F2ZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAzOTogLy8gcmlnaHRcclxuICAgICAgICAgICAgICAgIHggPSBpbmZvLnggKyB3b3Jrc3BhY2UucHJvamVjdC5jb25maWcuY2VsbFdpZHRoO1xyXG4gICAgICAgICAgICAgICAgaWYgKCh4ICsgcmVjdC53aWR0aCkgPD0gY29udGFpbmVyLndpZHRoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5mby54ID0geDtcclxuICAgICAgICAgICAgICAgICAgICBzYXZlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIDQwOiAvLyBkb3duXHJcbiAgICAgICAgICAgICAgICB5ID0gaW5mby55ICsgd29ya3NwYWNlLnByb2plY3QuY29uZmlnLmNlbGxIZWlnaHQ7XHJcbiAgICAgICAgICAgICAgICBpZiAoKHkgKyByZWN0LmhlaWdodCkgPD0gY29udGFpbmVyLmhlaWdodCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGluZm8ueSA9IHk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2F2ZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChzYXZlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5zdGF0ZSwge1xyXG4gICAgICAgICAgICAgICAgaW5mb1xyXG4gICAgICAgICAgICB9KSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnByb3BzLnVwZGF0ZVByb2plY3Qoe1xyXG4gICAgICAgICAgICAgICAgcGF0aDogdGhpcy5wcm9wcy51aWQsXHJcbiAgICAgICAgICAgICAgICB2YWx1ZTogaW5mb1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGF3YWl0IHRoaXMucHJvamVjdFNlcnZpY2UucHV0KHdvcmtzcGFjZS5pZCwgd29ya3NwYWNlLnByb2plY3QuaWQsIHdvcmtzcGFjZS5wcm9qZWN0KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlTW91c2VFbnRlcigpIHtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKE9iamVjdC5hc3NpZ24oe30sIHRoaXMuc3RhdGUsIHtcclxuICAgICAgICAgICAgaG92ZXI6IHRydWVcclxuICAgICAgICB9KSk7XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlTW91c2VMZWF2ZSgpIHtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKE9iamVjdC5hc3NpZ24oe30sIHRoaXMuc3RhdGUsIHtcclxuICAgICAgICAgICAgaG92ZXI6IGZhbHNlXHJcbiAgICAgICAgfSkpO1xyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIHJlbW92ZUl0ZW0oZSkge1xyXG4gICAgICAgIC8vIGlmKCF0aGlzLml0ZW0uY29udGFpbnMoZS50YXJnZXQpKSB7XHJcbiAgICAgICAgLy8gICAgIHJldHVybjtcclxuICAgICAgICAvLyB9XHJcblxyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cclxuICAgICAgICAvL3RoaXMuaGFuZGxlSXRlbUNvbnRhaW5lckNsaWNrKCk7XHJcblxyXG4gICAgICAgIHZhciB7IHdvcmtzcGFjZSB9ID0gc3RvcmUuZ2V0U3RhdGUoKS5lbmdpbmVSZWR1Y2VyO1xyXG4gICAgICAgIHZhciBwcm9qZWN0ID0gd29ya3NwYWNlLnByb2plY3Q7XHJcbiAgICAgICAgdmFyIGl0ZW1zID0gcHJvamVjdC5pdGVtcztcclxuXHJcbiAgICAgICAgY29uc3QgY3VycmVudF96ID0gaXRlbXNbdGhpcy5wcm9wcy51aWRdLno7XHJcbiAgICAgICAgdmFyIHRvcF96ID0gY3VycmVudF96O1xyXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBpdGVtcykge1xyXG4gICAgICAgICAgICBpZiAoa2V5ICE9PSB0aGlzLnByb3BzLnVpZCAmJiBpdGVtc1trZXldLnogPiBjdXJyZW50X3opIHtcclxuICAgICAgICAgICAgICAgIGlmIChpdGVtc1trZXldLnogPiB0b3Bfeikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRvcF96ID0gaXRlbXNba2V5XS56O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaXRlbXNba2V5XS56IC09IDE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGRlbGV0ZSBpdGVtc1t0aGlzLnByb3BzLnVpZF07XHJcbiAgICAgICAgLy9pdGVtc1t0aGlzLnByb3BzLnVpZF0udGFnLnZhbHVlICs9ICdBREQnO1xyXG5cclxuICAgICAgICBhd2FpdCB0aGlzLnByb2plY3RTZXJ2aWNlLnB1dCh3b3Jrc3BhY2UuaWQsIHdvcmtzcGFjZS5wcm9qZWN0LmlkLCB3b3Jrc3BhY2UucHJvamVjdCk7XHJcblxyXG4gICAgICAgIHRoaXMucHJvcHMudXBkYXRlUHJvamVjdEl0ZW1zKGl0ZW1zKTtcclxuICAgICAgICAvL2F3YWl0IFxyXG5cclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyBpdGVtQ29udGFpbmVyQ2xhc3NOYW1lLCBpbmZvLCB0YWcsIGhvdmVyLCBoYXNGb2N1cyB9ID0gdGhpcy5zdGF0ZTtcclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiBcclxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17aXRlbUNvbnRhaW5lckNsYXNzTmFtZX1cclxuICAgICAgICAgICAgICAgIHJlZj17aXRlbSA9PiB0aGlzLml0ZW0gPSBpdGVtfVxyXG4gICAgICAgICAgICAgICAgb25DbGljaz17dGhpcy5oYW5kbGVJdGVtQ29udGFpbmVyQ2xpY2t9XHJcbiAgICAgICAgICAgICAgICBkcmFnZ2FibGU9e3RydWV9XHJcbiAgICAgICAgICAgICAgICBvbkRyYWdTdGFydD17dGhpcy5oYW5kbGVEcmFnU3RhcnR9XHJcbiAgICAgICAgICAgICAgICBvbkRyYWc9e3RoaXMuaGFuZGxlRHJhZ31cclxuICAgICAgICAgICAgICAgIG9uRHJhZ0VuZD17dGhpcy5oYW5kbGVEcmFnRW5kfVxyXG4gICAgICAgICAgICAgICAgb25Nb3VzZUVudGVyPXt0aGlzLmhhbmRsZU1vdXNlRW50ZXJ9XHJcbiAgICAgICAgICAgICAgICBvbk1vdXNlTGVhdmU9e3RoaXMuaGFuZGxlTW91c2VMZWF2ZX1cclxuICAgICAgICAgICAgICAgIHN0eWxlPXt7IFxyXG4gICAgICAgICAgICAgICAgICAgIHRvcDogaW5mby55LCBcclxuICAgICAgICAgICAgICAgICAgICBsZWZ0OiBpbmZvLngsXHJcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IGluZm8ud2lkdGgsXHJcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiBpbmZvLmhlaWdodCxcclxuICAgICAgICAgICAgICAgICAgICB6SW5kZXg6IGluZm8ueiArIDEwMFxyXG4gICAgICAgICAgICAgICAgfX0+XHJcbiAgICAgICAgICAgICAgICB7dGFnfVxyXG4gICAgICAgICAgICAgICAge2hvdmVyIHx8IGhhc0ZvY3VzID9cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaXRlbS1hY3Rpb25zXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjbG9zZS1pY29uLWl0ZW0gc2hhZG93LW5vbmVcIiBvbkNsaWNrPXt0aGlzLnJlbW92ZUl0ZW19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJjbG9zZS1pY29uXCI+PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA6IG51bGx9XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IEl0ZW0gPSBjb25uZWN0KG1hcFN0YXRlVG9Qcm9wcywgbWFwRGlzcGF0Y2hUb1Byb3BzKShJdGVtQ29tcG9uZW50KTtcclxuZXhwb3J0IGRlZmF1bHQgSXRlbTsiLCJleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiKSh0cnVlKTtcbi8vIE1vZHVsZVxuZXhwb3J0cy5wdXNoKFttb2R1bGUuaWQsIFwiLml0ZW0tY29udGFpbmVyIHtcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIGJvcmRlcjogMXB4IHNvbGlkICM3ODc4Nzg7XFxuICBiYWNrZ3JvdW5kOiByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuOSk7XFxuICBwYWRkaW5nOiA0cHg7XFxuICBjdXJzb3I6IG1vdmU7IH1cXG4gIC5pdGVtLWNvbnRhaW5lciBoMSwgLml0ZW0tY29udGFpbmVyIGgyLCAuaXRlbS1jb250YWluZXIgaDMsIC5pdGVtLWNvbnRhaW5lciBoNCwgLml0ZW0tY29udGFpbmVyIGg1LCAuaXRlbS1jb250YWluZXIgaDYge1xcbiAgICBtYXJnaW46IDA7IH1cXG4gIC5pdGVtLWNvbnRhaW5lci5mb2N1cyB7XFxuICAgIGJhY2tncm91bmQ6IHJnYmEoMjQwLCAyNDAsIDI0MCwgMC45KTsgfVxcbiAgICAuaXRlbS1jb250YWluZXIuZm9jdXMgLml0ZW0tYWN0aW9ucyAuY2xvc2UtaWNvbi1pdGVtIHtcXG4gICAgICBiYWNrZ3JvdW5kOiByZ2JhKDI0MCwgMjQwLCAyNDAsIDAuNSk7IH1cXG4gIC5pdGVtLWNvbnRhaW5lciAuaXRlbS1hY3Rpb25zIHtcXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgICByaWdodDogMXB4O1xcbiAgICB0b3A6IDFweDsgfVxcbiAgICAuaXRlbS1jb250YWluZXIgLml0ZW0tYWN0aW9ucyAuY2xvc2UtaWNvbi1pdGVtIHtcXG4gICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XFxuICAgICAgY3Vyc29yOiBwb2ludGVyO1xcbiAgICAgIGJhY2tncm91bmQ6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC41KTtcXG4gICAgICBwYWRkaW5nOiAycHg7XFxuICAgICAgYm9yZGVyOiAwO1xcbiAgICAgIGhlaWdodDogMThweDtcXG4gICAgICB3aWR0aDogMThweDsgfVxcbiAgICAgIC5pdGVtLWNvbnRhaW5lciAuaXRlbS1hY3Rpb25zIC5jbG9zZS1pY29uLWl0ZW0gLmNsb3NlLWljb24ge1xcbiAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgICAgICAgdG9wOiAzcHg7XFxuICAgICAgICBsZWZ0OiA0cHg7XFxuICAgICAgICBmb250LXNpemU6IDE0cHg7XFxuICAgICAgICBtYXJnaW4tdG9wOiAtMXB4OyB9XFxuXCIsIFwiXCIse1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wiQzovVXNlcnMvZ2Fycmkvc291cmNlL3JlcG9zL3NuYXBmb3JtL2NsaWVudC9lbmdpbmUvYXNzZXRzL3N0eWxlL2NvbXBvbmVudHMvaXRlbS9jbGllbnQvZW5naW5lL2Fzc2V0cy9zdHlsZS9jb21wb25lbnRzL2l0ZW0vaXRlbS5zY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUFBO0VBQ0ksa0JBQWtCO0VBQ2xCLHlCQUF5QjtFQUN6QixvQ0FBb0M7RUFDcEMsWUFBWTtFQUNaLFlBQVksRUFBQTtFQUxoQjtJQVFRLFNBQVMsRUFBQTtFQVJqQjtJQVlRLG9DQUFvQyxFQUFBO0lBWjVDO01BZ0JnQixvQ0FBb0MsRUFBQTtFQWhCcEQ7SUFzQlEsa0JBQWtCO0lBQ2xCLFVBQVU7SUFDVixRQUFRLEVBQUE7SUF4QmhCO01BMkJZLHFCQUFxQjtNQUNyQixlQUFlO01BQ2Ysb0NBQW9DO01BQ3BDLFlBQVk7TUFDWixTQUFTO01BQ1QsWUFBWTtNQUNaLFdBQVcsRUFBQTtNQWpDdkI7UUFvQ2dCLGtCQUFrQjtRQUNsQixRQUFRO1FBQ1IsU0FBUztRQUNULGVBQWU7UUFDZixnQkFBZ0IsRUFBQVwiLFwiZmlsZVwiOlwiaXRlbS5zY3NzXCIsXCJzb3VyY2VzQ29udGVudFwiOltcIi5pdGVtLWNvbnRhaW5lciB7XFxyXFxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXHJcXG4gICAgYm9yZGVyOiAxcHggc29saWQgIzc4Nzg3ODtcXHJcXG4gICAgYmFja2dyb3VuZDogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjkpO1xcclxcbiAgICBwYWRkaW5nOiA0cHg7XFxyXFxuICAgIGN1cnNvcjogbW92ZTtcXHJcXG5cXHJcXG4gICAgaDEsIGgyLCBoMywgaDQsIGg1LCBoNiB7XFxyXFxuICAgICAgICBtYXJnaW46IDA7XFxyXFxuICAgIH1cXHJcXG5cXHJcXG4gICAgJi5mb2N1cyB7XFxyXFxuICAgICAgICBiYWNrZ3JvdW5kOiByZ2JhKDI0MCwgMjQwLCAyNDAsIDAuOSk7XFxyXFxuXFxyXFxuICAgICAgICAuaXRlbS1hY3Rpb25zIHtcXHJcXG4gICAgICAgICAgICAuY2xvc2UtaWNvbi1pdGVtIHtcXHJcXG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZDogcmdiYSgyNDAsIDI0MCwgMjQwLCAwLjUpO1xcclxcbiAgICAgICAgICAgIH1cXHJcXG4gICAgICAgIH1cXHJcXG4gICAgfVxcclxcblxcclxcbiAgICAuaXRlbS1hY3Rpb25zIHtcXHJcXG4gICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXHJcXG4gICAgICAgIHJpZ2h0OiAxcHg7XFxyXFxuICAgICAgICB0b3A6IDFweDtcXHJcXG5cXHJcXG4gICAgICAgIC5jbG9zZS1pY29uLWl0ZW0ge1xcclxcbiAgICAgICAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcXHJcXG4gICAgICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XFxyXFxuICAgICAgICAgICAgYmFja2dyb3VuZDogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjUpO1xcclxcbiAgICAgICAgICAgIHBhZGRpbmc6IDJweDtcXHJcXG4gICAgICAgICAgICBib3JkZXI6IDA7XFxyXFxuICAgICAgICAgICAgaGVpZ2h0OiAxOHB4O1xcclxcbiAgICAgICAgICAgIHdpZHRoOiAxOHB4O1xcclxcbiAgICAgICAgICAgIFxcclxcbiAgICAgICAgICAgIC5jbG9zZS1pY29uIHtcXHJcXG4gICAgICAgICAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xcclxcbiAgICAgICAgICAgICAgICB0b3A6IDNweDtcXHJcXG4gICAgICAgICAgICAgICAgbGVmdDogNHB4O1xcclxcbiAgICAgICAgICAgICAgICBmb250LXNpemU6IDE0cHg7XFxyXFxuICAgICAgICAgICAgICAgIG1hcmdpbi10b3A6IC0xcHg7XFxyXFxuICAgICAgICAgICAgfVxcclxcbiAgICAgICAgfVxcclxcbiAgICB9XFxyXFxufVwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuXG4iLCJcbnZhciBjb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanM/P3JlZi0tNi0xIS4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9saWIvbG9hZGVyLmpzPz9yZWYtLTYtMiEuL2l0ZW0uc2Nzc1wiKTtcblxuaWYodHlwZW9mIGNvbnRlbnQgPT09ICdzdHJpbmcnKSBjb250ZW50ID0gW1ttb2R1bGUuaWQsIGNvbnRlbnQsICcnXV07XG5cbnZhciB0cmFuc2Zvcm07XG52YXIgaW5zZXJ0SW50bztcblxuXG5cbnZhciBvcHRpb25zID0ge1wiaG1yXCI6dHJ1ZX1cblxub3B0aW9ucy50cmFuc2Zvcm0gPSB0cmFuc2Zvcm1cbm9wdGlvbnMuaW5zZXJ0SW50byA9IHVuZGVmaW5lZDtcblxudmFyIHVwZGF0ZSA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9saWIvYWRkU3R5bGVzLmpzXCIpKGNvbnRlbnQsIG9wdGlvbnMpO1xuXG5pZihjb250ZW50LmxvY2FscykgbW9kdWxlLmV4cG9ydHMgPSBjb250ZW50LmxvY2FscztcblxuaWYobW9kdWxlLmhvdCkge1xuXHRtb2R1bGUuaG90LmFjY2VwdChcIiEhLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanM/P3JlZi0tNi0xIS4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9saWIvbG9hZGVyLmpzPz9yZWYtLTYtMiEuL2l0ZW0uc2Nzc1wiLCBmdW5jdGlvbigpIHtcblx0XHR2YXIgbmV3Q29udGVudCA9IHJlcXVpcmUoXCIhIS4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzPz9yZWYtLTYtMSEuLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvbGliL2xvYWRlci5qcz8/cmVmLS02LTIhLi9pdGVtLnNjc3NcIik7XG5cblx0XHRpZih0eXBlb2YgbmV3Q29udGVudCA9PT0gJ3N0cmluZycpIG5ld0NvbnRlbnQgPSBbW21vZHVsZS5pZCwgbmV3Q29udGVudCwgJyddXTtcblxuXHRcdHZhciBsb2NhbHMgPSAoZnVuY3Rpb24oYSwgYikge1xuXHRcdFx0dmFyIGtleSwgaWR4ID0gMDtcblxuXHRcdFx0Zm9yKGtleSBpbiBhKSB7XG5cdFx0XHRcdGlmKCFiIHx8IGFba2V5XSAhPT0gYltrZXldKSByZXR1cm4gZmFsc2U7XG5cdFx0XHRcdGlkeCsrO1xuXHRcdFx0fVxuXG5cdFx0XHRmb3Ioa2V5IGluIGIpIGlkeC0tO1xuXG5cdFx0XHRyZXR1cm4gaWR4ID09PSAwO1xuXHRcdH0oY29udGVudC5sb2NhbHMsIG5ld0NvbnRlbnQubG9jYWxzKSk7XG5cblx0XHRpZighbG9jYWxzKSB0aHJvdyBuZXcgRXJyb3IoJ0Fib3J0aW5nIENTUyBITVIgZHVlIHRvIGNoYW5nZWQgY3NzLW1vZHVsZXMgbG9jYWxzLicpO1xuXG5cdFx0dXBkYXRlKG5ld0NvbnRlbnQpO1xuXHR9KTtcblxuXHRtb2R1bGUuaG90LmRpc3Bvc2UoZnVuY3Rpb24oKSB7IHVwZGF0ZSgpOyB9KTtcbn0iXSwic291cmNlUm9vdCI6IiJ9