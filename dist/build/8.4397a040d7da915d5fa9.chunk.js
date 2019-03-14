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
const _resizeTypes = {
  right_only: 0,
  left_only: 1,
  top_only: 2,
  bottom_only: 3,
  top_right: 4,
  top_left: 5,
  bottom_right: 6,
  bottom_left: 7
};

class ItemComponent extends react__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  constructor(props) {
    super(props);

    _defineProperty(this, "dragging", false);

    _defineProperty(this, "dragOffsetX", 0);

    _defineProperty(this, "dragOffsetY", 0);

    _defineProperty(this, "defaultTagClassName", 'g-border-color');

    const {
      workspace
    } = _config_redux_redux_store__WEBPACK_IMPORTED_MODULE_2__["store"].getState();
    const project = workspace.project;
    this.handleReadOnlyValueChanged = this.handleReadOnlyValueChanged.bind(this);
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
    this.handleResizeMouseDown = this.handleResizeMouseDown.bind(this);
    this.handleResizeMouseMove = this.handleResizeMouseMove.bind(this);
    this.handleResizeMouseUp = this.handleResizeMouseUp.bind(this);
    this.state = {
      info: project.items[this.props.uid],
      itemContainerClassName: defaultItemContainerClassName,
      readOnlyValue: '',
      draggable: true
    };
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

  isResizeTarget(e) {
    return this.resizeTop && this.resizeTop.contains(e.target) || this.resizeRight && this.resizeRight.contains(e.target) || this.resizeBottom && this.resizeBottom.contains(e.target) || this.resizeLeft && this.resizeLeft.contains(e.target) || this.resizeTopRight && this.resizeTopRight.contains(e.target) || this.resizeTopLeft && this.resizeTopLeft.contains(e.target) || this.resizeBottomRight && this.resizeBottomRight.contains(e.target) || this.resizeBottomLeft && this.resizeBottomLeft.contains(e.target);
  }

  handleReadOnlyValueChanged(e) {
    this.setState(Object.assign({}, this.state, {
      readOnlyValue: e.target.value
    }));
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
    if (this.isResizeTarget(e)) {
      return;
    }

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

  handleDragEnd(e) {
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

  handleKeyDown(e) {
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

  removeItem(e) {
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

  handleResizeMouseDown(e, resizeType) {
    e.preventDefault();
    document.addEventListener('mousemove', this.handleResizeMouseMove, false);
    document.addEventListener('mouseup', this.handleResizeMouseUp, false);
    const item = this.item.getBoundingClientRect();
    this.itemWidth = item.width;
    this.itemHeight = item.height;
    this.startClientX = e.clientX;
    this.startClientY = e.clientY;
    this.setState(Object.assign({}, this.state, {
      draggable: false,
      resizeType
    }));
  }

  handleResizeMouseMove(e) {
    e.preventDefault();

    if (this.state.draggable) {
      return;
    }

    var width = this.itemWidth;
    const {
      workspace
    } = _config_redux_redux_store__WEBPACK_IMPORTED_MODULE_2__["store"].getState();
    const config = workspace.project.config;

    switch (this.state.resizeType) {
      case _resizeTypes.right_only:
        width += e.clientX - this.startClientX;
        width = Math.floor(width / config.cellWidth) * config.cellWidth;
        break;

      case _resizeTypes.left_only:
        break;

      case _resizeTypes.top_only:
        break;

      case _resizeTypes.bottom_only:
        break;

      case _resizeTypes.top_right:
        break;

      case _resizeTypes.top_left:
        break;

      case _resizeTypes.bottom_right:
        break;

      case _resizeTypes.bottom_left:
        break;
    }

    const info = Object.assign({}, this.state.info, {
      width
    });
    this.setState(Object.assign({}, this.state, {
      info
    }));
  }

  handleResizeMouseUp(e) {
    document.removeEventListener('mousemove', this.handleResizeMouseMove, false);
    document.removeEventListener('mouseup', this.handleResizeMouseUp, false);
    var info = this.state.info;
    const {
      workspace
    } = _config_redux_redux_store__WEBPACK_IMPORTED_MODULE_2__["store"].getState();
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
    this.setState(Object.assign({}, this.state, {
      draggable: true,
      resizeType: null
    }));
    this.itemWidth = null;
    this.itemHeight = null;
    this.startClientX = null;
    this.startClientY = null;
  }

  render() {
    const {
      itemContainerClassName,
      info,
      hover,
      hasFocus,
      draggable
    } = this.state;
    const {
      resize
    } = this.props;
    const TagName = this.props.tag.name;
    var tag = null;

    if (this.props.tag.innerValue) {
      tag = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(TagName, null, this.props.tag.value);
    } else {
      var tagClassName = this.defaultTagClassName + (this.state.readOnlyValue && this.state.readOnlyValue.length ? ' g-valid' : '');
      tag = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "input-component"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(TagName, {
        style: {
          width: info.width,
          height: info.height
        },
        className: tagClassName,
        type: this.props.tag.type,
        name: this.props.tag.value.toLowerCase().replace(' ', '_'),
        value: this.state.readOnlyValue,
        onChange: this.handleReadOnlyValueChanged
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        className: "g-login-form-input-placeholder"
      }, this.props.tag.value));
    }

    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: itemContainerClassName,
      ref: item => this.item = item,
      onClick: this.handleItemContainerClick,
      draggable: draggable,
      onDragStart: this.handleDragStart,
      onDrag: this.handleDrag,
      onDragEnd: this.handleDragEnd,
      onMouseEnter: this.handleMouseEnter,
      onMouseLeave: this.handleMouseLeave,
      style: {
        top: info.y,
        left: info.x,
        zIndex: info.z + 100
      }
    }, tag, hover || hasFocus ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "item-actions"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "close-icon-item shadow-none",
      onClick: this.removeItem
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
      className: "close-icon"
    }))) : null, resize.top ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      style: {
        zIndex: info.z + 100
      },
      ref: resizeTop => this.resizeTop = resizeTop,
      className: "resize top",
      onMouseDown: e => this.handleResizeMouseDown.call(this, e, _resizeTypes.top_only)
    }) : null, resize.right ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      style: {
        zIndex: info.z + 100
      },
      ref: resizeRight => this.resizeRight = resizeRight,
      className: "resize right",
      onMouseDown: e => this.handleResizeMouseDown.call(this, e, _resizeTypes.right_only)
    }) : null, resize.bottom ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      style: {
        zIndex: info.z + 100
      },
      ref: resizeBottom => this.resizeBottom = resizeBottom,
      className: "resize bottom",
      onMouseDown: e => this.handleResizeMouseDown.call(this, e, _resizeTypes.bottom_only)
    }) : null, resize.left ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      style: {
        zIndex: info.z + 100
      },
      ref: resizeLeft => this.resizeLeft = resizeLeft,
      className: "resize left",
      onMouseDown: e => this.handleResizeMouseDown.call(this, e, _resizeTypes.left_only)
    }) : null, resize.top && resize.right ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      style: {
        zIndex: info.z + 101
      },
      ref: resizeTopRight = this.resizeTopRight = resizeTopRight,
      onMouseDown: e => this.handleResizeMouseDown.call(this, e, _resizeTypes.top_right)
    }) : null, resize.top && resize.left ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      style: {
        zIndex: info.z + 101
      },
      ref: resizeTopLeft = this.resizeTopLeft = resizeTopLeft,
      onMouseDown: e => this.handleResizeMouseDown.call(this, e, _resizeTypes.top_left)
    }) : null, resize.bottom && resize.right ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      style: {
        zIndex: info.z + 101
      },
      ref: resizeBottomRight = this.resizeBottomRight = resizeBottomRight,
      onMouseDown: e => this.handleResizeMouseDown.call(this, e, _resizeTypes.bottom_right)
    }) : null, resize.bottom && resize.left ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      style: {
        zIndex: info.z + 101
      },
      ref: resizeBottomLeft = this.resizeBottomLeft = resizeBottomLeft,
      onMouseDown: e => this.handleResizeMouseDown.call(this, e, _resizeTypes.bottom_left)
    }) : null);
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
exports.push([module.i, ".item-container {\n  position: absolute;\n  border: 1px solid #787878;\n  background: rgba(255, 255, 255, 0.9);\n  padding: 4px;\n  cursor: move; }\n  .item-container h1, .item-container h2, .item-container h3, .item-container h4, .item-container h5, .item-container h6 {\n    margin: 0; }\n  .item-container.focus {\n    background: rgba(240, 240, 240, 0.9); }\n  .item-container .item-actions {\n    position: absolute;\n    right: 1px;\n    top: 1px; }\n    .item-container .item-actions .close-icon-item {\n      display: inline-block;\n      cursor: pointer;\n      background: transparent;\n      padding: 2px;\n      border: 0;\n      height: 18px;\n      width: 18px; }\n      .item-container .item-actions .close-icon-item .close-icon {\n        position: absolute;\n        top: 0;\n        left: 7px;\n        font-size: 14px;\n        margin-top: -1px; }\n  .item-container .input-component {\n    position: relative;\n    width: 100%;\n    min-height: 36px;\n    background-color: rgba(244, 244, 244, 0.4); }\n    @media (max-width: 600px) {\n      .item-container .input-component {\n        float: none;\n        width: 100%; } }\n    .item-container .input-component:nth-of-type(2n) {\n      float: right; }\n      @media (max-width: 600px) {\n        .item-container .input-component:nth-of-type(2n) {\n          float: none;\n          width: 100%; } }\n    .item-container .input-component span {\n      position: absolute;\n      top: 45%;\n      left: 0.75rem;\n      color: rgba(0, 0, 0, 0.9);\n      pointer-events: none;\n      transform: translateY(-40%);\n      transition: .25s; }\n      .item-container .input-component span.is-active {\n        font-size: 12px;\n        color: rgba(0, 0, 0, 0.9);\n        opacity: .85; }\n    .item-container .input-component input, .item-container .input-component .dropdown-toggle {\n      width: 100%;\n      height: 100%;\n      padding-top: 12px;\n      padding-left: 0.75rem;\n      padding-right: 0.75rem;\n      border-radius: 2px;\n      font-size: 16px;\n      background-color: rgba(255, 255, 255, 0.9);\n      box-sizing: border-box;\n      -moz-appearance: none !important;\n      -webkit-appearance: none !important;\n      border: 1px solid #787878; }\n      .item-container .input-component input.g-touched.g-invalid, .item-container .input-component .dropdown-toggle.g-touched.g-invalid {\n        border: 1px solid;\n        border-radius: 2px; }\n      .item-container .input-component input.g-touched, .item-container .input-component input.g-valid, .item-container .input-component input:focus, .item-container .input-component .dropdown-toggle.g-touched, .item-container .input-component .dropdown-toggle.g-valid, .item-container .input-component .dropdown-toggle:focus {\n        background-color: rgba(255, 255, 255, 0.9); }\n      .item-container .input-component input.g-touched ~ span, .item-container .input-component input.g-valid ~ span, .item-container .input-component .dropdown-toggle.g-touched ~ span, .item-container .input-component .dropdown-toggle.g-valid ~ span {\n        font-size: 12px;\n        opacity: .85; }\n      .item-container .input-component input:focus, .item-container .input-component .dropdown-toggle:focus {\n        outline: none; }\n        .item-container .input-component input:focus ~ span, .item-container .input-component .dropdown-toggle:focus ~ span {\n          font-size: 12px;\n          opacity: .85; }\n    .item-container .input-component .dropdown-toggle.g-touched ~ span, .item-container .input-component .dropdown-toggle.g-valid ~ span {\n      top: 15%; }\n    .item-container .input-component .dropdown-toggle:focus {\n      outline: none; }\n      .item-container .input-component .dropdown-toggle:focus ~ span {\n        top: 15%; }\n    .item-container .input-component .dropdown-toggle h1, .item-container .input-component .dropdown-toggle h2, .item-container .input-component .dropdown-toggle h3, .item-container .input-component .dropdown-toggle h4, .item-container .input-component .dropdown-toggle h5, .item-container .input-component .dropdown-toggle h6 {\n      margin: 0; }\n    .item-container .input-component input.g-touched ~ span, .item-container .input-component input.g-valid ~ span {\n      top: 20%; }\n    .item-container .input-component input:focus {\n      outline: none; }\n      .item-container .input-component input:focus ~ span {\n        top: 20%; }\n  .item-container .resize {\n    position: absolute;\n    cursor: w-resize; }\n    .item-container .resize.right {\n      top: 0;\n      bottom: 0;\n      right: -4px;\n      width: 8px; }\n    .item-container .resize.left {\n      top: 0;\n      bottom: 0;\n      width: 8px;\n      left: -4px; }\n    .item-container .resize.top {\n      left: 0;\n      right: 0;\n      height: 8px;\n      top: -4px; }\n    .item-container .resize.bottom {\n      left: 0;\n      right: 0;\n      height: 8px;\n      bottom: -4px; }\n    .item-container .resize.top-right {\n      top: -4px;\n      right: -4px;\n      width: 8px;\n      height: 8px; }\n    .item-container .resize.top-left {\n      top: -4px;\n      left: -4px;\n      width: 8px;\n      height: 8px; }\n    .item-container .resize.bottom-right {\n      bottom: -4px;\n      right: -4px;\n      width: 8px;\n      height: 8px; }\n    .item-container .resize.bottom-left {\n      bottom: -4px;\n      left: -4px;\n      width: 8px;\n      height: 8px; }\n", "",{"version":3,"sources":["C:/Users/garri/source/repos/snapform/client/engine/assets/style/components/item/client/engine/assets/style/components/item/item.scss"],"names":[],"mappings":"AAAA;EACI,kBAAkB;EAClB,yBAAyB;EACzB,oCAAoC;EACpC,YAAY;EACZ,YAAY,EAAA;EALhB;IAQQ,SAAS,EAAA;EARjB;IAYQ,oCAAoC,EAAA;EAZ5C;IAgBQ,kBAAkB;IAClB,UAAU;IACV,QAAQ,EAAA;IAlBhB;MAqBY,qBAAqB;MACrB,eAAe;MACf,uBAAuB;MACvB,YAAY;MACZ,SAAS;MACT,YAAY;MACZ,WAAW,EAAA;MA3BvB;QA8BgB,kBAAkB;QAClB,MAAM;QACN,SAAS;QACT,eAAe;QACf,gBAAgB,EAAA;EAlChC;IAwCQ,kBAAkB;IAClB,WAAW;IACX,gBAAgB;IAChB,0CAAyC,EAAA;IACzC;MA5CR;QA6CY,WAAW;QACX,WAAW,EAAA,EAyFlB;IAvIL;MAiDY,YAAY,EAAA;MACZ;QAlDZ;UAmDgB,WAAW;UACX,WAAW,EAAA,EAElB;IAtDT;MAwDY,kBAAkB;MAClB,QAAQ;MACR,aAAa;MACb,yBAAyB;MACzB,oBAAoB;MACpB,2BAA2B;MAC3B,gBAAgB,EAAA;MA9D5B;QAgEgB,eAAe;QACf,yBAAyB;QACzB,YAAY,EAAA;IAlE5B;MAsEY,WAAW;MACX,YAAY;MACZ,iBAAiB;MACjB,qBAAqB;MACrB,sBAAsB;MACtB,kBAAkB;MAClB,eAAe;MACf,0CAA0C;MAC1C,sBAAsB;MACtB,gCAAgC;MAChC,mCAAmC;MACnC,yBAAyB,EAAA;MAjFrC;QAmFgB,iBAAiB;QACjB,kBAAkB,EAAA;MApFlC;QAuFgB,0CAA0C,EAAA;MAvF1D;QA2FoB,eAAe;QACf,YAAY,EAAA;MA5FhC;QAgGgB,aAAa,EAAA;QAhG7B;UAkGoB,eAAe;UACf,YAAY,EAAA;IAnGhC;MA2GoB,QAAQ,EAAA;IA3G5B;MA+GgB,aAAa,EAAA;MA/G7B;QAiHoB,QAAQ,EAAA;IAjH5B;MAsHgB,SAAS,EAAA;IAtHzB;MA6HoB,QAAQ,EAAA;IA7H5B;MAiIgB,aAAa,EAAA;MAjI7B;QAmIoB,QAAQ,EAAA;EAnI5B;IA0IQ,kBAAkB;IAClB,gBAAgB,EAAA;IA3IxB;MA8IY,MAAM;MACN,SAAS;MACT,WAAW;MACX,UAAU,EAAA;IAjJtB;MAqJY,MAAM;MACN,SAAS;MACT,UAAU;MACV,UAAU,EAAA;IAxJtB;MA4JY,OAAO;MACP,QAAQ;MACR,WAAW;MACX,SAAS,EAAA;IA/JrB;MAmKY,OAAO;MACP,QAAQ;MACR,WAAW;MACX,YAAY,EAAA;IAtKxB;MA0KY,SAAS;MACT,WAAW;MACX,UAAU;MACV,WAAW,EAAA;IA7KvB;MAiLY,SAAS;MACT,UAAU;MACV,UAAU;MACV,WAAW,EAAA;IApLvB;MAwLY,YAAY;MACZ,WAAW;MACX,UAAU;MACV,WAAW,EAAA;IA3LvB;MA+LY,YAAY;MACZ,UAAU;MACV,UAAU;MACV,WAAW,EAAA","file":"item.scss","sourcesContent":[".item-container {\r\n    position: absolute;\r\n    border: 1px solid #787878;\r\n    background: rgba(255, 255, 255, 0.9);\r\n    padding: 4px;\r\n    cursor: move;\r\n\r\n    h1, h2, h3, h4, h5, h6 {\r\n        margin: 0;\r\n    }\r\n\r\n    &.focus {\r\n        background: rgba(240, 240, 240, 0.9);\r\n    }\r\n\r\n    .item-actions {\r\n        position: absolute;\r\n        right: 1px;\r\n        top: 1px;\r\n\r\n        .close-icon-item {\r\n            display: inline-block;\r\n            cursor: pointer;\r\n            background: transparent;\r\n            padding: 2px;\r\n            border: 0;\r\n            height: 18px;\r\n            width: 18px;\r\n            \r\n            .close-icon {\r\n                position: absolute;\r\n                top: 0;\r\n                left: 7px;\r\n                font-size: 14px;\r\n                margin-top: -1px;\r\n            }\r\n        }\r\n    }\r\n\r\n    .input-component {\r\n        position: relative;\r\n        width: 100%;\r\n        min-height: 36px;\r\n        background-color: rgba(244, 244, 244, .4);\r\n        @media (max-width: 600px) {\r\n            float: none;\r\n            width: 100%;\r\n        }\r\n        &:nth-of-type(2n) {\r\n            float: right;\r\n            @media (max-width: 600px) {\r\n                float: none;\r\n                width: 100%;\r\n            }\r\n        }\r\n        span {\r\n            position: absolute;\r\n            top: 45%;\r\n            left: 0.75rem;\r\n            color: rgba(0, 0, 0, 0.9);\r\n            pointer-events: none;\r\n            transform: translateY(-40%);\r\n            transition: .25s;\r\n            &.is-active {\r\n                font-size: 12px;\r\n                color: rgba(0, 0, 0, 0.9);\r\n                opacity: .85;\r\n            }\r\n        }\r\n        input, .dropdown-toggle {\r\n            width: 100%;\r\n            height: 100%;\r\n            padding-top: 12px;\r\n            padding-left: 0.75rem;\r\n            padding-right: 0.75rem;\r\n            border-radius: 2px;\r\n            font-size: 16px;\r\n            background-color: rgba(255, 255, 255, 0.9);\r\n            box-sizing: border-box;\r\n            -moz-appearance: none !important;\r\n            -webkit-appearance: none !important;\r\n            border: 1px solid #787878;\r\n            &.g-touched.g-invalid {\r\n                border: 1px solid;\r\n                border-radius: 2px;\r\n            }\r\n            &.g-touched, &.g-valid, &:focus {\r\n                background-color: rgba(255, 255, 255, 0.9);\r\n            }\r\n            &.g-touched, &.g-valid {\r\n                ~span {\r\n                    font-size: 12px;\r\n                    opacity: .85;\r\n                }\r\n            }\r\n            &:focus {\r\n                outline: none;\r\n                ~span {\r\n                    font-size: 12px;\r\n                    opacity: .85;\r\n                }\r\n            }\r\n        }\r\n\r\n        .dropdown-toggle {\r\n            &.g-touched, &.g-valid {\r\n                ~span {\r\n                    top: 15%;\r\n                }\r\n            }\r\n            &:focus {\r\n                outline: none;\r\n                ~span {\r\n                    top: 15%;\r\n                }\r\n            }\r\n\r\n            h1, h2, h3, h4, h5, h6 {\r\n                margin: 0;\r\n            }\r\n        }\r\n\r\n        input {\r\n            &.g-touched, &.g-valid {\r\n                ~span {\r\n                    top: 20%;\r\n                }\r\n            }\r\n            &:focus {\r\n                outline: none;\r\n                ~span {\r\n                    top: 20%;\r\n                }\r\n            }\r\n        }\r\n    }\r\n\r\n    .resize {\r\n        position: absolute;\r\n        cursor: w-resize;\r\n\r\n        &.right {\r\n            top: 0;\r\n            bottom: 0;\r\n            right: -4px;\r\n            width: 8px;\r\n        }\r\n\r\n        &.left {\r\n            top: 0;\r\n            bottom: 0;\r\n            width: 8px;\r\n            left: -4px;\r\n        }\r\n\r\n        &.top {\r\n            left: 0;\r\n            right: 0;\r\n            height: 8px;\r\n            top: -4px;\r\n        }\r\n\r\n        &.bottom {\r\n            left: 0;\r\n            right: 0;\r\n            height: 8px;\r\n            bottom: -4px;\r\n        }\r\n\r\n        &.top-right {\r\n            top: -4px;\r\n            right: -4px;\r\n            width: 8px;\r\n            height: 8px;\r\n        }\r\n\r\n        &.top-left {\r\n            top: -4px;\r\n            left: -4px;\r\n            width: 8px;\r\n            height: 8px;\r\n        }\r\n\r\n        &.bottom-right {\r\n            bottom: -4px;\r\n            right: -4px;\r\n            width: 8px;\r\n            height: 8px;\r\n        }\r\n\r\n        &.bottom-left {\r\n            bottom: -4px;\r\n            left: -4px;\r\n            width: 8px;\r\n            height: 8px;\r\n        }\r\n    }\r\n\r\n    // div.dragDiv {\r\n    //     position: absolute;\r\n    //     top: 0;\r\n    //     bottom: 0;\r\n    //     width: 8px;\r\n    //     cursor: w-resize;\r\n    // }\r\n    //     div.dragDiv.right {\r\n    //         right: -4px;\r\n    //     }\r\n    //     div.dragDiv.left {\r\n    //         left: -4px;\r\n    //     }\r\n}"],"sourceRoot":""}]);



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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9jbGllbnQvZW5naW5lL3NyYy9jb21wb25lbnRzL2l0ZW0vaXRlbS5jb21wb25lbnQuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L2VuZ2luZS9hc3NldHMvc3R5bGUvY29tcG9uZW50cy9pdGVtL2l0ZW0uc2NzcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvZW5naW5lL2Fzc2V0cy9zdHlsZS9jb21wb25lbnRzL2l0ZW0vaXRlbS5zY3NzPzgyMjkiXSwibmFtZXMiOlsibWFwU3RhdGVUb1Byb3BzIiwic3RhdGUiLCJtYXBEaXNwYXRjaFRvUHJvcHMiLCJkaXNwYXRjaCIsInVwZGF0ZVByb2plY3QiLCJwYXlsb2FkIiwidXBkYXRlUHJvamVjdEl0ZW1zIiwidXBkYXRlUHJvamVjdENvbmZpZyIsImRlZmF1bHRJdGVtQ29udGFpbmVyQ2xhc3NOYW1lIiwiX3Jlc2l6ZVR5cGVzIiwicmlnaHRfb25seSIsImxlZnRfb25seSIsInRvcF9vbmx5IiwiYm90dG9tX29ubHkiLCJ0b3BfcmlnaHQiLCJ0b3BfbGVmdCIsImJvdHRvbV9yaWdodCIsImJvdHRvbV9sZWZ0IiwiSXRlbUNvbXBvbmVudCIsIkNvbXBvbmVudCIsImNvbnN0cnVjdG9yIiwicHJvcHMiLCJ3b3Jrc3BhY2UiLCJzdG9yZSIsImdldFN0YXRlIiwicHJvamVjdCIsImhhbmRsZVJlYWRPbmx5VmFsdWVDaGFuZ2VkIiwiYmluZCIsImhhbmRsZUl0ZW1Db250YWluZXJDbGljayIsImhhbmRsZU91dHNpZGVDbGljayIsImRyYWciLCJoYW5kbGVEcmFnU3RhcnQiLCJoYW5kbGVEcmFnIiwiaGFuZGxlRHJhZ0VuZCIsIm1vdXNlbW92ZSIsImhhbmRsZUtleURvd24iLCJoYW5kbGVNb3VzZUVudGVyIiwiaGFuZGxlTW91c2VMZWF2ZSIsInJlbW92ZUl0ZW0iLCJoYW5kbGVSZXNpemVNb3VzZURvd24iLCJoYW5kbGVSZXNpemVNb3VzZU1vdmUiLCJoYW5kbGVSZXNpemVNb3VzZVVwIiwiaW5mbyIsIml0ZW1zIiwidWlkIiwiaXRlbUNvbnRhaW5lckNsYXNzTmFtZSIsInJlYWRPbmx5VmFsdWUiLCJkcmFnZ2FibGUiLCJjb21wb25lbnRXaWxsTW91bnQiLCJkb2N1bWVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJjb21wb25lbnREaWRNb3VudCIsImRyYWdJbWciLCJJbWFnZSIsInNyYyIsImNvbXBvbmVudFdpbGxVbm1vdW50IiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsIm1vdXNlbW91dmUiLCJpc1Jlc2l6ZVRhcmdldCIsImUiLCJyZXNpemVUb3AiLCJjb250YWlucyIsInRhcmdldCIsInJlc2l6ZVJpZ2h0IiwicmVzaXplQm90dG9tIiwicmVzaXplTGVmdCIsInJlc2l6ZVRvcFJpZ2h0IiwicmVzaXplVG9wTGVmdCIsInJlc2l6ZUJvdHRvbVJpZ2h0IiwicmVzaXplQm90dG9tTGVmdCIsInNldFN0YXRlIiwiT2JqZWN0IiwiYXNzaWduIiwidmFsdWUiLCJpdGVtIiwiaGFzRm9jdXMiLCJjdXJyZW50X3oiLCJ6IiwidG9wX3oiLCJrZXkiLCJkYXRhVHJhbnNmZXIiLCJzZXREcmFnSW1hZ2UiLCJzdHlsZSIsImN1cnNvciIsImNvbnRhaW5lciIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsImRyYWdnaW5nIiwiZHJhZ09mZnNldFgiLCJ4IiwiY2xpZW50WCIsImxlZnQiLCJkcmFnT2Zmc2V0WSIsInkiLCJjbGllbnRZIiwidG9wIiwiY29uZmlnIiwidWkiLCJnX2NsYXNzX2xpc3QiLCJwYXRoIiwiZGlzcGF0Y2hFdmVudCIsIkN1c3RvbUV2ZW50IiwiYnViYmxlcyIsImRldGFpbCIsIndvcmtzcGFjZV9pZCIsImlkIiwiZGVmYXVsdFdpZHRoIiwiY2VsbFdpZHRoIiwiZGVmYXVsdEhlaWdodCIsImNlbGxIZWlnaHQiLCJNYXRoIiwiZmxvb3IiLCJyZWN0IiwiaXRlbU9mZnNldExlZnQiLCJ3aWR0aCIsIml0ZW1PZmZzZXRUb3AiLCJoZWlnaHQiLCJzYXZlIiwia2V5Q29kZSIsInByZXZlbnREZWZhdWx0IiwidXBkYXRlZF93b3Jrc3BhY2UiLCJob3ZlciIsInN0b3BQcm9wYWdhdGlvbiIsInJlc2l6ZVR5cGUiLCJpdGVtV2lkdGgiLCJpdGVtSGVpZ2h0Iiwic3RhcnRDbGllbnRYIiwic3RhcnRDbGllbnRZIiwicmVuZGVyIiwicmVzaXplIiwiVGFnTmFtZSIsInRhZyIsIm5hbWUiLCJpbm5lclZhbHVlIiwidGFnQ2xhc3NOYW1lIiwiZGVmYXVsdFRhZ0NsYXNzTmFtZSIsImxlbmd0aCIsInR5cGUiLCJ0b0xvd2VyQ2FzZSIsInJlcGxhY2UiLCJ6SW5kZXgiLCJjYWxsIiwicmlnaHQiLCJib3R0b20iLCJJdGVtIiwiY29ubmVjdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUVBOztBQUVBLE1BQU1BLGVBQWUsR0FBSUMsS0FBRCxJQUFXQSxLQUFuQzs7QUFDQSxNQUFNQyxrQkFBa0IsR0FBSUMsUUFBRCxJQUFjO0FBQ3JDLFNBQU87QUFDSEMsaUJBQWEsRUFBRUMsT0FBTyxJQUFJRixRQUFRLENBQUNDLGlGQUFhLENBQUNDLE9BQUQsQ0FBZCxDQUQvQjtBQUVIQyxzQkFBa0IsRUFBRUQsT0FBTyxJQUFJRixRQUFRLENBQUNHLHNGQUFrQixDQUFDRCxPQUFELENBQW5CLENBRnBDO0FBR0hFLHVCQUFtQixFQUFFRixPQUFPLElBQUlGLFFBQVEsQ0FBQ0ksdUZBQW1CLENBQUNGLE9BQUQsQ0FBcEI7QUFIckMsR0FBUDtBQUtILENBTkQ7O0FBUUEsTUFBTUcsNkJBQTZCLEdBQUcsZ0JBQXRDO0FBQ0EsTUFBTUMsWUFBWSxHQUFHO0FBQ2pCQyxZQUFVLEVBQUUsQ0FESztBQUVqQkMsV0FBUyxFQUFFLENBRk07QUFHakJDLFVBQVEsRUFBRSxDQUhPO0FBSWpCQyxhQUFXLEVBQUUsQ0FKSTtBQUtqQkMsV0FBUyxFQUFFLENBTE07QUFNakJDLFVBQVEsRUFBRSxDQU5PO0FBT2pCQyxjQUFZLEVBQUUsQ0FQRztBQVFqQkMsYUFBVyxFQUFFO0FBUkksQ0FB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NEIsNkJBQTZCLGFBQWEsNkJBQTZCLDBCQUEwQiw0QkFBNEIsMkJBQTJCLDRCQUE0QixhQUFhLDRCQUE0QiwwQkFBMEIsMkJBQTJCLDJCQUEyQiw0QkFBNEIsYUFBYSxnQ0FBZ0MsNkJBQTZCLDRCQUE0QiwyQkFBMkIsNEJBQTRCLGFBQWEsK0JBQStCLDZCQUE2QiwyQkFBMkIsMkJBQTJCLDRCQUE0QixhQUFhLFNBQVMsNEJBQTRCLGtDQUFrQyxzQkFBc0IseUJBQXlCLDBCQUEwQixnQ0FBZ0MsWUFBWSxrQ0FBa0MsK0JBQStCLGdCQUFnQixpQ0FBaUMsOEJBQThCLGdCQUFnQixLQUFLLG1CQUFtQjs7Ozs7Ozs7Ozs7Ozs7QUNEOTNZLGNBQWMsbUJBQU8sQ0FBQyw2SkFBa0o7O0FBRXhLLDRDQUE0QyxRQUFTOztBQUVyRDtBQUNBOzs7O0FBSUEsZUFBZTs7QUFFZjtBQUNBOztBQUVBLGFBQWEsbUJBQU8sQ0FBQywwRUFBK0Q7O0FBRXBGOztBQUVBLEdBQUcsS0FBVSxFQUFFLEUiLCJmaWxlIjoiYnVpbGQvOC40Mzk3YTA0MGQ3ZGE5MTVkNWZhOS5jaHVuay5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQgfSBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCc7XHJcbmltcG9ydCB7IHN0b3JlIH0gZnJvbSAnLi4vLi4vY29uZmlnL3JlZHV4L3JlZHV4LnN0b3JlJztcclxuaW1wb3J0IHsgdXBkYXRlUHJvamVjdCwgdXBkYXRlUHJvamVjdEl0ZW1zLCB1cGRhdGVQcm9qZWN0Q29uZmlnIH0gZnJvbSAnLi4vLi4vY29uZmlnL3JlZHV4L3JlZHV4LmFjdGlvbnMnO1xyXG5cclxuaW1wb3J0ICcuLi8uLi8uLi9hc3NldHMvc3R5bGUvY29tcG9uZW50cy9pdGVtL2l0ZW0uc2Nzcyc7XHJcblxyXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSAoc3RhdGUpID0+IHN0YXRlO1xyXG5jb25zdCBtYXBEaXNwYXRjaFRvUHJvcHMgPSAoZGlzcGF0Y2gpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdXBkYXRlUHJvamVjdDogcGF5bG9hZCA9PiBkaXNwYXRjaCh1cGRhdGVQcm9qZWN0KHBheWxvYWQpKSxcclxuICAgICAgICB1cGRhdGVQcm9qZWN0SXRlbXM6IHBheWxvYWQgPT4gZGlzcGF0Y2godXBkYXRlUHJvamVjdEl0ZW1zKHBheWxvYWQpKSxcclxuICAgICAgICB1cGRhdGVQcm9qZWN0Q29uZmlnOiBwYXlsb2FkID0+IGRpc3BhdGNoKHVwZGF0ZVByb2plY3RDb25maWcocGF5bG9hZCkpXHJcbiAgICB9O1xyXG59O1xyXG5cclxuY29uc3QgZGVmYXVsdEl0ZW1Db250YWluZXJDbGFzc05hbWUgPSAnaXRlbS1jb250YWluZXInO1xyXG5jb25zdCBfcmVzaXplVHlwZXMgPSB7XHJcbiAgICByaWdodF9vbmx5OiAwLFxyXG4gICAgbGVmdF9vbmx5OiAxLFxyXG4gICAgdG9wX29ubHk6IDIsXHJcbiAgICBib3R0b21fb25seTogMyxcclxuICAgIHRvcF9yaWdodDogNCxcclxuICAgIHRvcF9sZWZ0OiA1LFxyXG4gICAgYm90dG9tX3JpZ2h0OiA2LFxyXG4gICAgYm90dG9tX2xlZnQ6IDdcclxufTtcclxuXHJcbmNsYXNzIEl0ZW1Db21wb25lbnQgZXh0ZW5kcyBDb21wb25lbnQge1xyXG4gICAgZHJhZ2dpbmcgPSBmYWxzZTtcclxuICAgIGRyYWdPZmZzZXRYID0gMDtcclxuICAgIGRyYWdPZmZzZXRZID0gMDtcclxuICAgIGRlZmF1bHRUYWdDbGFzc05hbWUgPSAnZy1ib3JkZXItY29sb3InO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG5cclxuICAgICAgICBjb25zdCB7IHdvcmtzcGFjZSB9ID0gc3RvcmUuZ2V0U3RhdGUoKTtcclxuICAgICAgICBjb25zdCBwcm9qZWN0ID0gd29ya3NwYWNlLnByb2plY3Q7XHJcblxyXG4gICAgICAgIHRoaXMuaGFuZGxlUmVhZE9ubHlWYWx1ZUNoYW5nZWQgPSB0aGlzLmhhbmRsZVJlYWRPbmx5VmFsdWVDaGFuZ2VkLmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVJdGVtQ29udGFpbmVyQ2xpY2sgPSB0aGlzLmhhbmRsZUl0ZW1Db250YWluZXJDbGljay5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlT3V0c2lkZUNsaWNrID0gdGhpcy5oYW5kbGVPdXRzaWRlQ2xpY2suYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLmRyYWcgPSB0aGlzLmRyYWcuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLmhhbmRsZURyYWdTdGFydCA9IHRoaXMuaGFuZGxlRHJhZ1N0YXJ0LmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVEcmFnID0gdGhpcy5oYW5kbGVEcmFnLmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVEcmFnRW5kID0gdGhpcy5oYW5kbGVEcmFnRW5kLmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5tb3VzZW1vdmUgPSB0aGlzLm1vdXNlbW92ZS5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlS2V5RG93biA9IHRoaXMuaGFuZGxlS2V5RG93bi5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlTW91c2VFbnRlciA9IHRoaXMuaGFuZGxlTW91c2VFbnRlci5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlTW91c2VMZWF2ZSA9IHRoaXMuaGFuZGxlTW91c2VMZWF2ZS5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMucmVtb3ZlSXRlbSA9IHRoaXMucmVtb3ZlSXRlbS5iaW5kKHRoaXMpO1xyXG5cclxuICAgICAgICB0aGlzLmhhbmRsZVJlc2l6ZU1vdXNlRG93biA9IHRoaXMuaGFuZGxlUmVzaXplTW91c2VEb3duLmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVSZXNpemVNb3VzZU1vdmUgPSB0aGlzLmhhbmRsZVJlc2l6ZU1vdXNlTW92ZS5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlUmVzaXplTW91c2VVcCA9IHRoaXMuaGFuZGxlUmVzaXplTW91c2VVcC5iaW5kKHRoaXMpO1xyXG5cclxuICAgICAgICB0aGlzLnN0YXRlID0ge1xyXG4gICAgICAgICAgICBpbmZvOiBwcm9qZWN0Lml0ZW1zW3RoaXMucHJvcHMudWlkXSxcclxuICAgICAgICAgICAgaXRlbUNvbnRhaW5lckNsYXNzTmFtZTogZGVmYXVsdEl0ZW1Db250YWluZXJDbGFzc05hbWUsXHJcbiAgICAgICAgICAgIHJlYWRPbmx5VmFsdWU6ICcnLFxyXG4gICAgICAgICAgICBkcmFnZ2FibGU6IHRydWVcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIGNvbXBvbmVudFdpbGxNb3VudCgpIHtcclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLmhhbmRsZU91dHNpZGVDbGljaywgZmFsc2UpO1xyXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMubW91c2Vtb3ZlLCBmYWxzZSk7XHJcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMuaGFuZGxlS2V5RG93biwgZmFsc2UpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xyXG4gICAgICAgIHRoaXMuZHJhZ0ltZyA9IG5ldyBJbWFnZSgwLDApO1xyXG4gICAgICAgIHRoaXMuZHJhZ0ltZy5zcmMgPSAnZGF0YTppbWFnZS9naWY7YmFzZTY0LFIwbEdPRGxoQVFBQkFJQUFBQUFBQVAvLy95SDVCQUVBQUFBQUxBQUFBQUFCQUFFQUFBSUJSQUE3JztcclxuICAgIH1cclxuXHJcbiAgICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcclxuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLmhhbmRsZU91dHNpZGVDbGljaywgZmFsc2UpO1xyXG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMubW91c2Vtb3V2ZSwgZmFsc2UpO1xyXG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLmhhbmRsZUtleURvd24sIGZhbHNlKTtcclxuICAgIH1cclxuXHJcbiAgICBpc1Jlc2l6ZVRhcmdldChlKSB7XHJcbiAgICAgICAgcmV0dXJuICh0aGlzLnJlc2l6ZVRvcCAmJiB0aGlzLnJlc2l6ZVRvcC5jb250YWlucyhlLnRhcmdldCkpIHx8XHJcbiAgICAgICAgICAgICh0aGlzLnJlc2l6ZVJpZ2h0ICYmIHRoaXMucmVzaXplUmlnaHQuY29udGFpbnMoZS50YXJnZXQpKSB8fCBcclxuICAgICAgICAgICAgKHRoaXMucmVzaXplQm90dG9tICYmIHRoaXMucmVzaXplQm90dG9tLmNvbnRhaW5zKGUudGFyZ2V0KSkgfHwgXHJcbiAgICAgICAgICAgICh0aGlzLnJlc2l6ZUxlZnQgJiYgdGhpcy5yZXNpemVMZWZ0LmNvbnRhaW5zKGUudGFyZ2V0KSkgfHwgXHJcbiAgICAgICAgICAgICh0aGlzLnJlc2l6ZVRvcFJpZ2h0ICYmIHRoaXMucmVzaXplVG9wUmlnaHQuY29udGFpbnMoZS50YXJnZXQpKSB8fCBcclxuICAgICAgICAgICAgKHRoaXMucmVzaXplVG9wTGVmdCAmJiB0aGlzLnJlc2l6ZVRvcExlZnQuY29udGFpbnMoZS50YXJnZXQpKSB8fFxyXG4gICAgICAgICAgICAodGhpcy5yZXNpemVCb3R0b21SaWdodCAmJiB0aGlzLnJlc2l6ZUJvdHRvbVJpZ2h0LmNvbnRhaW5zKGUudGFyZ2V0KSkgfHwgXHJcbiAgICAgICAgICAgICh0aGlzLnJlc2l6ZUJvdHRvbUxlZnQgJiYgdGhpcy5yZXNpemVCb3R0b21MZWZ0LmNvbnRhaW5zKGUudGFyZ2V0KSk7XHJcbiAgICAgICAgICAgIFxyXG5cclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVSZWFkT25seVZhbHVlQ2hhbmdlZChlKSB7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZShPYmplY3QuYXNzaWduKHt9LCB0aGlzLnN0YXRlLCB7XHJcbiAgICAgICAgICAgIHJlYWRPbmx5VmFsdWU6IGUudGFyZ2V0LnZhbHVlXHJcbiAgICAgICAgfSkpO1xyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZU91dHNpZGVDbGljayhlKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaXRlbS5jb250YWlucyhlLnRhcmdldCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZShPYmplY3QuYXNzaWduKHt9LCB0aGlzLnN0YXRlLCB7XHJcbiAgICAgICAgICAgIGhhc0ZvY3VzOiBmYWxzZSxcclxuICAgICAgICAgICAgaXRlbUNvbnRhaW5lckNsYXNzTmFtZTogZGVmYXVsdEl0ZW1Db250YWluZXJDbGFzc05hbWVcclxuICAgICAgICB9KSk7XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlSXRlbUNvbnRhaW5lckNsaWNrKCkge1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5zdGF0ZSwge1xyXG4gICAgICAgICAgICBoYXNGb2N1czogdHJ1ZSxcclxuICAgICAgICAgICAgaXRlbUNvbnRhaW5lckNsYXNzTmFtZTogZGVmYXVsdEl0ZW1Db250YWluZXJDbGFzc05hbWUgKyAnIGZvY3VzJ1xyXG4gICAgICAgIH0pKTtcclxuXHJcbiAgICAgICAgY29uc3QgeyB3b3Jrc3BhY2UgfSA9IHN0b3JlLmdldFN0YXRlKCk7XHJcbiAgICAgICAgdmFyIGl0ZW1zID0gd29ya3NwYWNlLnByb2plY3QuaXRlbXM7XHJcblxyXG4gICAgICAgIGlmIChpdGVtc1t0aGlzLnByb3BzLnVpZF0pIHtcclxuICAgICAgICAgICAgY29uc3QgY3VycmVudF96ID0gaXRlbXNbdGhpcy5wcm9wcy51aWRdLno7XHJcbiAgICAgICAgICAgIHZhciB0b3BfeiA9IGN1cnJlbnRfejtcclxuICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIGl0ZW1zKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoa2V5ICE9PSB0aGlzLnByb3BzLnVpZCAmJiBpdGVtc1trZXldLnogPiBjdXJyZW50X3opIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbXNba2V5XS56ID4gdG9wX3opIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdG9wX3ogPSBpdGVtc1trZXldLno7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zW2tleV0ueiAtPSAxO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGl0ZW1zW3RoaXMucHJvcHMudWlkXS56ID0gdG9wX3o7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnByb3BzLnVwZGF0ZVByb2plY3RJdGVtcyhpdGVtcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZURyYWdTdGFydChlKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNSZXNpemVUYXJnZXQoZSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5oYW5kbGVJdGVtQ29udGFpbmVyQ2xpY2soKTtcclxuXHJcbiAgICAgICAgZS5kYXRhVHJhbnNmZXIuc2V0RHJhZ0ltYWdlKHRoaXMuZHJhZ0ltZywgMCwgMCk7XHJcbiAgICAgICAgZS50YXJnZXQuc3R5bGUuY3Vyc29yID0gJ21vdmUnO1xyXG5cclxuICAgICAgICBjb25zdCB7IHdvcmtzcGFjZSB9ID0gc3RvcmUuZ2V0U3RhdGUoKTtcclxuICAgICAgICBjb25zdCBjb250YWluZXIgPSB3b3Jrc3BhY2UucHJvamVjdC5jb250YWluZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICAgICAgY29uc3QgaXRlbSA9IHdvcmtzcGFjZS5wcm9qZWN0Lml0ZW1zW3RoaXMucHJvcHMudWlkXTtcclxuXHJcbiAgICAgICAgdGhpcy5kcmFnZ2luZyA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5kcmFnT2Zmc2V0WCA9IGl0ZW0ueCAtIChlLmNsaWVudFggLSBjb250YWluZXIubGVmdCk7XHJcbiAgICAgICAgdGhpcy5kcmFnT2Zmc2V0WSA9IGl0ZW0ueSAtIChlLmNsaWVudFkgLSBjb250YWluZXIudG9wKTtcclxuXHJcbiAgICAgICAgdGhpcy5wcm9wcy51cGRhdGVQcm9qZWN0Q29uZmlnKE9iamVjdC5hc3NpZ24oe30sIHdvcmtzcGFjZS5wcm9qZWN0LmNvbmZpZywge1xyXG4gICAgICAgICAgICB1aTogT2JqZWN0LmFzc2lnbih7fSwgd29ya3NwYWNlLnByb2plY3QuY29uZmlnLnVpLCB7XHJcbiAgICAgICAgICAgICAgICBnX2NsYXNzX2xpc3Q6ICdnaWQgaGlkZGVuJ1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0pKTtcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVEcmFnKGUpIHtcclxuICAgICAgICB0aGlzLmRyYWcoZSk7XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlRHJhZ0VuZChlKSB7XHJcbiAgICAgICAgdmFyIGluZm8gPSB0aGlzLmRyYWcoZSk7XHJcbiAgICAgICAgY29uc3QgeyB3b3Jrc3BhY2UgfSA9IHN0b3JlLmdldFN0YXRlKCk7XHJcblxyXG4gICAgICAgIHRoaXMuZHJhZ2dpbmcgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgdGhpcy5wcm9wcy51cGRhdGVQcm9qZWN0Q29uZmlnKE9iamVjdC5hc3NpZ24oe30sIHdvcmtzcGFjZS5wcm9qZWN0LmNvbmZpZywge1xyXG4gICAgICAgICAgICB1aTogT2JqZWN0LmFzc2lnbih7fSwgd29ya3NwYWNlLnByb2plY3QuY29uZmlnLnVpLCB7XHJcbiAgICAgICAgICAgICAgICBnX2NsYXNzX2xpc3Q6ICdnaWQnXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSkpO1xyXG5cclxuICAgICAgICB0aGlzLnByb3BzLnVwZGF0ZVByb2plY3Qoe1xyXG4gICAgICAgICAgICBwYXRoOiB0aGlzLnByb3BzLnVpZCxcclxuICAgICAgICAgICAgdmFsdWU6IGluZm9cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5pdGVtLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdzZi53b3Jrc3BhY2UucHJvamVjdC51cGRhdGUnLCB7XHJcbiAgICAgICAgICAgIGJ1YmJsZXM6IHRydWUsXHJcbiAgICAgICAgICAgIGRldGFpbDogeyBcclxuICAgICAgICAgICAgICAgIHdvcmtzcGFjZV9pZDogd29ya3NwYWNlLmlkLFxyXG4gICAgICAgICAgICAgICAgcHJvamVjdDogd29ya3NwYWNlLnByb2plY3QgXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KSk7XHJcbiAgICB9XHJcblxyXG4gICAgZHJhZyhlKSB7XHJcbiAgICAgICAgY29uc3QgeyB3b3Jrc3BhY2UgfSA9IHN0b3JlLmdldFN0YXRlKCk7XHJcbiAgICAgICAgY29uc3QgY29udGFpbmVyID0gd29ya3NwYWNlLnByb2plY3QuY29udGFpbmVyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgICAgIGNvbnN0IGRlZmF1bHRXaWR0aCA9IHdvcmtzcGFjZS5wcm9qZWN0LmNvbmZpZy5jZWxsV2lkdGg7XHJcbiAgICAgICAgY29uc3QgZGVmYXVsdEhlaWdodCA9IHdvcmtzcGFjZS5wcm9qZWN0LmNvbmZpZy5jZWxsSGVpZ2h0O1xyXG5cclxuICAgICAgICBjb25zdCB4ID0gTWF0aC5mbG9vcigoZS5jbGllbnRYIC0gKGNvbnRhaW5lci5sZWZ0IC0gdGhpcy5kcmFnT2Zmc2V0WCkpIC8gZGVmYXVsdFdpZHRoKSAqIGRlZmF1bHRXaWR0aDtcclxuICAgICAgICBjb25zdCB5ID0gTWF0aC5mbG9vcigoZS5jbGllbnRZIC0gKGNvbnRhaW5lci50b3AgLSB0aGlzLmRyYWdPZmZzZXRZKSkgLyBkZWZhdWx0SGVpZ2h0KSAqIGRlZmF1bHRIZWlnaHQ7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdmFyIGxlZnQgPSB4ID4gMCA/IHggOiAwO1xyXG4gICAgICAgIHZhciB0b3AgPSB5ID4gMCA/IHkgOiAwO1xyXG5cclxuICAgICAgICBjb25zdCByZWN0ID0gdGhpcy5pdGVtLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgICAgIGNvbnN0IGl0ZW1PZmZzZXRMZWZ0ID0gbGVmdCArIHJlY3Qud2lkdGg7XHJcbiAgICAgICAgY29uc3QgaXRlbU9mZnNldFRvcCA9IHRvcCArIHJlY3QuaGVpZ2h0O1xyXG5cclxuICAgICAgICBpZiAoaXRlbU9mZnNldExlZnQgPiBjb250YWluZXIud2lkdGgpIHtcclxuICAgICAgICAgICAgbGVmdCA9IE1hdGguZmxvb3IoKGNvbnRhaW5lci53aWR0aCAtIHJlY3Qud2lkdGgpIC8gZGVmYXVsdFdpZHRoKSAqIGRlZmF1bHRXaWR0aDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChpdGVtT2Zmc2V0VG9wID4gY29udGFpbmVyLmhlaWdodCkge1xyXG4gICAgICAgICAgICB0b3AgPSBNYXRoLmZsb29yKChjb250YWluZXIuaGVpZ2h0IC0gcmVjdC5oZWlnaHQpIC8gZGVmYXVsdEhlaWdodCkgKiBkZWZhdWx0SGVpZ2h0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgaW5mbyA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuc3RhdGUuaW5mbywge1xyXG4gICAgICAgICAgICB4OiBsZWZ0LFxyXG4gICAgICAgICAgICB5OiB0b3BcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZShPYmplY3QuYXNzaWduKHt9LCB0aGlzLnN0YXRlLCB7XHJcbiAgICAgICAgICAgIGluZm9cclxuICAgICAgICB9KSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIGluZm87XHJcbiAgICB9XHJcblxyXG4gICAgbW91c2Vtb3ZlKGUpIHtcclxuICAgICAgICBpZiAodGhpcy5kcmFnZ2luZykge1xyXG4gICAgICAgICAgICBlLnRhcmdldC5zdHlsZS5jdXJzb3IgPSAnbW92ZSc7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZUtleURvd24oZSkge1xyXG4gICAgICAgIGlmICghdGhpcy5zdGF0ZS5oYXNGb2N1cykge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCByZWN0ID0gdGhpcy5pdGVtLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgICAgIGNvbnN0IHsgd29ya3NwYWNlIH0gPSBzdG9yZS5nZXRTdGF0ZSgpO1xyXG4gICAgICAgIGNvbnN0IGNvbnRhaW5lciA9IHdvcmtzcGFjZS5wcm9qZWN0LmNvbnRhaW5lci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgICAgICB2YXIgaW5mbyA9IHRoaXMuc3RhdGUuaW5mbztcclxuXHJcbiAgICAgICAgdmFyIHNhdmUgPSBmYWxzZTtcclxuICAgICAgICB2YXIgeCwgeTtcclxuICAgICAgICBzd2l0Y2ggKGUua2V5Q29kZSkge1xyXG4gICAgICAgICAgICBjYXNlIDM3OiAvLyBsZWZ0XHJcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICB4ID0gaW5mby54IC0gd29ya3NwYWNlLnByb2plY3QuY29uZmlnLmNlbGxXaWR0aDtcclxuICAgICAgICAgICAgICAgIGlmICh4ID49IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBpbmZvLnggPSB4O1xyXG4gICAgICAgICAgICAgICAgICAgIHNhdmUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgMzg6IC8vIHVwXHJcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICB5ID0gaW5mby55IC0gd29ya3NwYWNlLnByb2plY3QuY29uZmlnLmNlbGxIZWlnaHQ7XHJcbiAgICAgICAgICAgICAgICBpZiAoeSA+PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5mby55ID0geTtcclxuICAgICAgICAgICAgICAgICAgICBzYXZlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIDM5OiAvLyByaWdodFxyXG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgeCA9IGluZm8ueCArIHdvcmtzcGFjZS5wcm9qZWN0LmNvbmZpZy5jZWxsV2lkdGg7XHJcbiAgICAgICAgICAgICAgICBpZiAoKHggKyByZWN0LndpZHRoKSA8PSBjb250YWluZXIud2lkdGgpIHtcclxuICAgICAgICAgICAgICAgICAgICBpbmZvLnggPSB4O1xyXG4gICAgICAgICAgICAgICAgICAgIHNhdmUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgNDA6IC8vIGRvd25cclxuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgIHkgPSBpbmZvLnkgKyB3b3Jrc3BhY2UucHJvamVjdC5jb25maWcuY2VsbEhlaWdodDtcclxuICAgICAgICAgICAgICAgIGlmICgoeSArIHJlY3QuaGVpZ2h0KSA8PSBjb250YWluZXIuaGVpZ2h0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5mby55ID0geTtcclxuICAgICAgICAgICAgICAgICAgICBzYXZlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHNhdmUpIHtcclxuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZShPYmplY3QuYXNzaWduKHt9LCB0aGlzLnN0YXRlLCB7XHJcbiAgICAgICAgICAgICAgICBpbmZvXHJcbiAgICAgICAgICAgIH0pKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMucHJvcHMudXBkYXRlUHJvamVjdCh7XHJcbiAgICAgICAgICAgICAgICBwYXRoOiB0aGlzLnByb3BzLnVpZCxcclxuICAgICAgICAgICAgICAgIHZhbHVlOiBpbmZvXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgdXBkYXRlZF93b3Jrc3BhY2UgPSBzdG9yZS5nZXRTdGF0ZSgpLndvcmtzcGFjZTtcclxuICAgICAgICAgICAgdGhpcy5pdGVtLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdzZi53b3Jrc3BhY2UucHJvamVjdC51cGRhdGUnLCB7XHJcbiAgICAgICAgICAgICAgICBidWJibGVzOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgZGV0YWlsOiB7IFxyXG4gICAgICAgICAgICAgICAgICAgIHdvcmtzcGFjZV9pZDogdXBkYXRlZF93b3Jrc3BhY2UuaWQsXHJcbiAgICAgICAgICAgICAgICAgICAgcHJvamVjdDogdXBkYXRlZF93b3Jrc3BhY2UucHJvamVjdCBcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVNb3VzZUVudGVyKCkge1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5zdGF0ZSwge1xyXG4gICAgICAgICAgICBob3ZlcjogdHJ1ZVxyXG4gICAgICAgIH0pKTtcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVNb3VzZUxlYXZlKCkge1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5zdGF0ZSwge1xyXG4gICAgICAgICAgICBob3ZlcjogZmFsc2VcclxuICAgICAgICB9KSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVtb3ZlSXRlbShlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblxyXG4gICAgICAgIHZhciB7IHdvcmtzcGFjZSB9ID0gc3RvcmUuZ2V0U3RhdGUoKTtcclxuICAgICAgICB2YXIgcHJvamVjdCA9IHdvcmtzcGFjZS5wcm9qZWN0O1xyXG4gICAgICAgIHZhciBpdGVtcyA9IHByb2plY3QuaXRlbXM7XHJcblxyXG4gICAgICAgIGNvbnN0IGN1cnJlbnRfeiA9IGl0ZW1zW3RoaXMucHJvcHMudWlkXS56O1xyXG4gICAgICAgIHZhciB0b3BfeiA9IGN1cnJlbnRfejtcclxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gaXRlbXMpIHtcclxuICAgICAgICAgICAgaWYgKGtleSAhPT0gdGhpcy5wcm9wcy51aWQgJiYgaXRlbXNba2V5XS56ID4gY3VycmVudF96KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXRlbXNba2V5XS56ID4gdG9wX3opIHtcclxuICAgICAgICAgICAgICAgICAgICB0b3BfeiA9IGl0ZW1zW2tleV0uejtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGl0ZW1zW2tleV0ueiAtPSAxO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBkZWxldGUgaXRlbXNbdGhpcy5wcm9wcy51aWRdO1xyXG5cclxuICAgICAgICB0aGlzLnByb3BzLnVwZGF0ZVByb2plY3RJdGVtcyhpdGVtcyk7XHJcblxyXG4gICAgICAgIGNvbnN0IHVwZGF0ZWRfd29ya3NwYWNlID0gc3RvcmUuZ2V0U3RhdGUoKS53b3Jrc3BhY2U7XHJcbiAgICAgICAgdGhpcy5pdGVtLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdzZi53b3Jrc3BhY2UucHJvamVjdC51cGRhdGUnLCB7XHJcbiAgICAgICAgICAgIGJ1YmJsZXM6IHRydWUsXHJcbiAgICAgICAgICAgIGRldGFpbDogeyBcclxuICAgICAgICAgICAgICAgIHdvcmtzcGFjZV9pZDogdXBkYXRlZF93b3Jrc3BhY2UuaWQsXHJcbiAgICAgICAgICAgICAgICBwcm9qZWN0OiB1cGRhdGVkX3dvcmtzcGFjZS5wcm9qZWN0IFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSkpO1xyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZVJlc2l6ZU1vdXNlRG93bihlLCByZXNpemVUeXBlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLmhhbmRsZVJlc2l6ZU1vdXNlTW92ZSwgZmFsc2UpO1xyXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLmhhbmRsZVJlc2l6ZU1vdXNlVXAsIGZhbHNlKTtcclxuXHJcbiAgICAgICAgY29uc3QgaXRlbSA9IHRoaXMuaXRlbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuXHJcbiAgICAgICAgdGhpcy5pdGVtV2lkdGggPSBpdGVtLndpZHRoO1xyXG4gICAgICAgIHRoaXMuaXRlbUhlaWdodCA9IGl0ZW0uaGVpZ2h0O1xyXG4gICAgICAgIHRoaXMuc3RhcnRDbGllbnRYID0gZS5jbGllbnRYO1xyXG4gICAgICAgIHRoaXMuc3RhcnRDbGllbnRZID0gZS5jbGllbnRZO1xyXG5cclxuICAgICAgICB0aGlzLnNldFN0YXRlKE9iamVjdC5hc3NpZ24oe30sIHRoaXMuc3RhdGUsIHtcclxuICAgICAgICAgICAgZHJhZ2dhYmxlOiBmYWxzZSxcclxuICAgICAgICAgICAgcmVzaXplVHlwZVxyXG4gICAgICAgIH0pKTtcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVSZXNpemVNb3VzZU1vdmUoZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUuZHJhZ2dhYmxlKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciB3aWR0aCA9IHRoaXMuaXRlbVdpZHRoO1xyXG5cclxuICAgICAgICBjb25zdCB7IHdvcmtzcGFjZSB9ID0gc3RvcmUuZ2V0U3RhdGUoKTtcclxuICAgICAgICBjb25zdCBjb25maWcgPSB3b3Jrc3BhY2UucHJvamVjdC5jb25maWc7XHJcblxyXG4gICAgICAgIHN3aXRjaCAodGhpcy5zdGF0ZS5yZXNpemVUeXBlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgX3Jlc2l6ZVR5cGVzLnJpZ2h0X29ubHk6XHJcbiAgICAgICAgICAgICAgICB3aWR0aCArPSBlLmNsaWVudFggLSB0aGlzLnN0YXJ0Q2xpZW50WDtcclxuICAgICAgICAgICAgICAgIHdpZHRoID0gTWF0aC5mbG9vcih3aWR0aCAvIGNvbmZpZy5jZWxsV2lkdGgpICogY29uZmlnLmNlbGxXaWR0aDtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIF9yZXNpemVUeXBlcy5sZWZ0X29ubHk6XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBfcmVzaXplVHlwZXMudG9wX29ubHk6XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBfcmVzaXplVHlwZXMuYm90dG9tX29ubHk6XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBfcmVzaXplVHlwZXMudG9wX3JpZ2h0OlxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgX3Jlc2l6ZVR5cGVzLnRvcF9sZWZ0OlxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgX3Jlc2l6ZVR5cGVzLmJvdHRvbV9yaWdodDpcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIF9yZXNpemVUeXBlcy5ib3R0b21fbGVmdDpcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgaW5mbyA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuc3RhdGUuaW5mbywge1xyXG4gICAgICAgICAgICB3aWR0aFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnNldFN0YXRlKE9iamVjdC5hc3NpZ24oe30sIHRoaXMuc3RhdGUsIHtcclxuICAgICAgICAgICAgaW5mb1xyXG4gICAgICAgIH0pKTtcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVSZXNpemVNb3VzZVVwKGUpIHtcclxuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLmhhbmRsZVJlc2l6ZU1vdXNlTW92ZSwgZmFsc2UpO1xyXG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLmhhbmRsZVJlc2l6ZU1vdXNlVXAsIGZhbHNlKTtcclxuXHJcbiAgICAgICAgdmFyIGluZm8gPSB0aGlzLnN0YXRlLmluZm87XHJcbiAgICAgICAgY29uc3QgeyB3b3Jrc3BhY2UgfSA9IHN0b3JlLmdldFN0YXRlKCk7XHJcblxyXG4gICAgICAgIHRoaXMucHJvcHMudXBkYXRlUHJvamVjdCh7XHJcbiAgICAgICAgICAgIHBhdGg6IHRoaXMucHJvcHMudWlkLFxyXG4gICAgICAgICAgICB2YWx1ZTogaW5mb1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLml0ZW0uZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ3NmLndvcmtzcGFjZS5wcm9qZWN0LnVwZGF0ZScsIHtcclxuICAgICAgICAgICAgYnViYmxlczogdHJ1ZSxcclxuICAgICAgICAgICAgZGV0YWlsOiB7IFxyXG4gICAgICAgICAgICAgICAgd29ya3NwYWNlX2lkOiB3b3Jrc3BhY2UuaWQsXHJcbiAgICAgICAgICAgICAgICBwcm9qZWN0OiB3b3Jrc3BhY2UucHJvamVjdCBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pKTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLnNldFN0YXRlKE9iamVjdC5hc3NpZ24oe30sIHRoaXMuc3RhdGUsIHtcclxuICAgICAgICAgICAgZHJhZ2dhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICByZXNpemVUeXBlOiBudWxsXHJcbiAgICAgICAgfSkpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuaXRlbVdpZHRoID0gbnVsbDtcclxuICAgICAgICB0aGlzLml0ZW1IZWlnaHQgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuc3RhcnRDbGllbnRYID0gbnVsbDtcclxuICAgICAgICB0aGlzLnN0YXJ0Q2xpZW50WSA9IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgaXRlbUNvbnRhaW5lckNsYXNzTmFtZSwgaW5mbywgaG92ZXIsIGhhc0ZvY3VzLCBkcmFnZ2FibGUgfSA9IHRoaXMuc3RhdGU7XHJcbiAgICAgICAgY29uc3QgeyByZXNpemUgfSA9IHRoaXMucHJvcHM7XHJcblxyXG4gICAgICAgIGNvbnN0IFRhZ05hbWUgPSB0aGlzLnByb3BzLnRhZy5uYW1lO1xyXG4gICAgICAgIHZhciB0YWcgPSBudWxsO1xyXG4gICAgICAgIGlmICh0aGlzLnByb3BzLnRhZy5pbm5lclZhbHVlKSB7XHJcbiAgICAgICAgICAgIHRhZyA9ICg8VGFnTmFtZT57dGhpcy5wcm9wcy50YWcudmFsdWV9PC9UYWdOYW1lPik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdmFyIHRhZ0NsYXNzTmFtZSA9IHRoaXMuZGVmYXVsdFRhZ0NsYXNzTmFtZSArICh0aGlzLnN0YXRlLnJlYWRPbmx5VmFsdWUgJiYgdGhpcy5zdGF0ZS5yZWFkT25seVZhbHVlLmxlbmd0aCA/ICcgZy12YWxpZCcgOiAnJyk7XHJcbiAgICAgICAgICAgIHRhZyA9ICg8ZGl2IGNsYXNzTmFtZT1cImlucHV0LWNvbXBvbmVudFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8VGFnTmFtZSBzdHlsZT17e3dpZHRoOiBpbmZvLndpZHRoLCBoZWlnaHQ6IGluZm8uaGVpZ2h0fX0gY2xhc3NOYW1lPXt0YWdDbGFzc05hbWV9IHR5cGU9e3RoaXMucHJvcHMudGFnLnR5cGV9IG5hbWU9e3RoaXMucHJvcHMudGFnLnZhbHVlLnRvTG93ZXJDYXNlKCkucmVwbGFjZSgnICcsICdfJyl9IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e3RoaXMuc3RhdGUucmVhZE9ubHlWYWx1ZX0gb25DaGFuZ2U9e3RoaXMuaGFuZGxlUmVhZE9ubHlWYWx1ZUNoYW5nZWR9PjwvVGFnTmFtZT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZy1sb2dpbi1mb3JtLWlucHV0LXBsYWNlaG9sZGVyXCI+e3RoaXMucHJvcHMudGFnLnZhbHVlfTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj4pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2IFxyXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtpdGVtQ29udGFpbmVyQ2xhc3NOYW1lfVxyXG4gICAgICAgICAgICAgICAgcmVmPXtpdGVtID0+IHRoaXMuaXRlbSA9IGl0ZW19XHJcbiAgICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLmhhbmRsZUl0ZW1Db250YWluZXJDbGlja31cclxuICAgICAgICAgICAgICAgIGRyYWdnYWJsZT17ZHJhZ2dhYmxlfVxyXG4gICAgICAgICAgICAgICAgb25EcmFnU3RhcnQ9e3RoaXMuaGFuZGxlRHJhZ1N0YXJ0fVxyXG4gICAgICAgICAgICAgICAgb25EcmFnPXt0aGlzLmhhbmRsZURyYWd9XHJcbiAgICAgICAgICAgICAgICBvbkRyYWdFbmQ9e3RoaXMuaGFuZGxlRHJhZ0VuZH1cclxuICAgICAgICAgICAgICAgIG9uTW91c2VFbnRlcj17dGhpcy5oYW5kbGVNb3VzZUVudGVyfVxyXG4gICAgICAgICAgICAgICAgb25Nb3VzZUxlYXZlPXt0aGlzLmhhbmRsZU1vdXNlTGVhdmV9XHJcbiAgICAgICAgICAgICAgICBzdHlsZT17eyBcclxuICAgICAgICAgICAgICAgICAgICB0b3A6IGluZm8ueSwgXHJcbiAgICAgICAgICAgICAgICAgICAgbGVmdDogaW5mby54LFxyXG4gICAgICAgICAgICAgICAgICAgIHpJbmRleDogaW5mby56ICsgMTAwXHJcbiAgICAgICAgICAgICAgICB9fT5cclxuICAgICAgICAgICAgICAgIHt0YWd9XHJcbiAgICAgICAgICAgICAgICB7aG92ZXIgfHwgaGFzRm9jdXMgP1xyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJpdGVtLWFjdGlvbnNcIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNsb3NlLWljb24taXRlbSBzaGFkb3ctbm9uZVwiIG9uQ2xpY2s9e3RoaXMucmVtb3ZlSXRlbX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImNsb3NlLWljb25cIj48L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDogbnVsbH1cclxuICAgICAgICAgICAgICAgIHtyZXNpemUudG9wID8gPGRpdiBzdHlsZT17e3pJbmRleDogaW5mby56ICsgMTAwfX0gcmVmPXtyZXNpemVUb3AgPT4gdGhpcy5yZXNpemVUb3AgPSByZXNpemVUb3B9IGNsYXNzTmFtZT1cInJlc2l6ZSB0b3BcIiBvbk1vdXNlRG93bj17KGUpID0+IHRoaXMuaGFuZGxlUmVzaXplTW91c2VEb3duLmNhbGwodGhpcywgZSwgX3Jlc2l6ZVR5cGVzLnRvcF9vbmx5KX0+PC9kaXY+IDogbnVsbH1cclxuICAgICAgICAgICAgICAgIHtyZXNpemUucmlnaHQgPyA8ZGl2IHN0eWxlPXt7ekluZGV4OiBpbmZvLnogKyAxMDB9fSByZWY9e3Jlc2l6ZVJpZ2h0ID0+IHRoaXMucmVzaXplUmlnaHQgPSByZXNpemVSaWdodH0gY2xhc3NOYW1lPVwicmVzaXplIHJpZ2h0XCIgb25Nb3VzZURvd249eyhlKSA9PiB0aGlzLmhhbmRsZVJlc2l6ZU1vdXNlRG93bi5jYWxsKHRoaXMsIGUsIF9yZXNpemVUeXBlcy5yaWdodF9vbmx5KX0+PC9kaXY+IDogbnVsbH1cclxuICAgICAgICAgICAgICAgIHtyZXNpemUuYm90dG9tID8gPGRpdiBzdHlsZT17e3pJbmRleDogaW5mby56ICsgMTAwfX0gcmVmPXtyZXNpemVCb3R0b20gPT4gdGhpcy5yZXNpemVCb3R0b20gPSByZXNpemVCb3R0b219IGNsYXNzTmFtZT1cInJlc2l6ZSBib3R0b21cIiBvbk1vdXNlRG93bj17KGUpID0+IHRoaXMuaGFuZGxlUmVzaXplTW91c2VEb3duLmNhbGwodGhpcywgZSwgX3Jlc2l6ZVR5cGVzLmJvdHRvbV9vbmx5KX0+PC9kaXY+IDogbnVsbH1cclxuICAgICAgICAgICAgICAgIHtyZXNpemUubGVmdCA/IDxkaXYgc3R5bGU9e3t6SW5kZXg6IGluZm8ueiArIDEwMH19IHJlZj17cmVzaXplTGVmdCA9PiB0aGlzLnJlc2l6ZUxlZnQgPSByZXNpemVMZWZ0fSBjbGFzc05hbWU9XCJyZXNpemUgbGVmdFwiIG9uTW91c2VEb3duPXsoZSkgPT4gdGhpcy5oYW5kbGVSZXNpemVNb3VzZURvd24uY2FsbCh0aGlzLCBlLCBfcmVzaXplVHlwZXMubGVmdF9vbmx5KX0+PC9kaXY+IDogbnVsbH1cclxuICAgICAgICAgICAgICAgIHtyZXNpemUudG9wICYmIHJlc2l6ZS5yaWdodCA/IDxkaXYgc3R5bGU9e3t6SW5kZXg6IGluZm8ueiArIDEwMX19IHJlZj17cmVzaXplVG9wUmlnaHQgPSB0aGlzLnJlc2l6ZVRvcFJpZ2h0ID0gcmVzaXplVG9wUmlnaHR9IG9uTW91c2VEb3duPXsoZSkgPT4gdGhpcy5oYW5kbGVSZXNpemVNb3VzZURvd24uY2FsbCh0aGlzLCBlLCBfcmVzaXplVHlwZXMudG9wX3JpZ2h0KX0+PC9kaXY+IDogbnVsbH1cclxuICAgICAgICAgICAgICAgIHtyZXNpemUudG9wICYmIHJlc2l6ZS5sZWZ0ID8gPGRpdiBzdHlsZT17e3pJbmRleDogaW5mby56ICsgMTAxfX0gcmVmPXtyZXNpemVUb3BMZWZ0ID0gdGhpcy5yZXNpemVUb3BMZWZ0ID0gcmVzaXplVG9wTGVmdH0gb25Nb3VzZURvd249eyhlKSA9PiB0aGlzLmhhbmRsZVJlc2l6ZU1vdXNlRG93bi5jYWxsKHRoaXMsIGUsIF9yZXNpemVUeXBlcy50b3BfbGVmdCl9PjwvZGl2PiA6IG51bGx9XHJcbiAgICAgICAgICAgICAgICB7cmVzaXplLmJvdHRvbSAmJiByZXNpemUucmlnaHQgPyA8ZGl2IHN0eWxlPXt7ekluZGV4OiBpbmZvLnogKyAxMDF9fSByZWY9e3Jlc2l6ZUJvdHRvbVJpZ2h0ID0gdGhpcy5yZXNpemVCb3R0b21SaWdodCA9IHJlc2l6ZUJvdHRvbVJpZ2h0fSBvbk1vdXNlRG93bj17KGUpID0+IHRoaXMuaGFuZGxlUmVzaXplTW91c2VEb3duLmNhbGwodGhpcywgZSwgX3Jlc2l6ZVR5cGVzLmJvdHRvbV9yaWdodCl9PjwvZGl2PiA6IG51bGx9XHJcbiAgICAgICAgICAgICAgICB7cmVzaXplLmJvdHRvbSAmJiByZXNpemUubGVmdCA/IDxkaXYgc3R5bGU9e3t6SW5kZXg6IGluZm8ueiArIDEwMX19IHJlZj17cmVzaXplQm90dG9tTGVmdCA9IHRoaXMucmVzaXplQm90dG9tTGVmdCA9IHJlc2l6ZUJvdHRvbUxlZnR9IG9uTW91c2VEb3duPXsoZSkgPT4gdGhpcy5oYW5kbGVSZXNpemVNb3VzZURvd24uY2FsbCh0aGlzLCBlLCBfcmVzaXplVHlwZXMuYm90dG9tX2xlZnQpfT48L2Rpdj4gOiBudWxsfVxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBJdGVtID0gY29ubmVjdChtYXBTdGF0ZVRvUHJvcHMsIG1hcERpc3BhdGNoVG9Qcm9wcykoSXRlbUNvbXBvbmVudCk7XHJcbmV4cG9ydCBkZWZhdWx0IEl0ZW07IiwiZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIikodHJ1ZSk7XG4vLyBNb2R1bGVcbmV4cG9ydHMucHVzaChbbW9kdWxlLmlkLCBcIi5pdGVtLWNvbnRhaW5lciB7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICBib3JkZXI6IDFweCBzb2xpZCAjNzg3ODc4O1xcbiAgYmFja2dyb3VuZDogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjkpO1xcbiAgcGFkZGluZzogNHB4O1xcbiAgY3Vyc29yOiBtb3ZlOyB9XFxuICAuaXRlbS1jb250YWluZXIgaDEsIC5pdGVtLWNvbnRhaW5lciBoMiwgLml0ZW0tY29udGFpbmVyIGgzLCAuaXRlbS1jb250YWluZXIgaDQsIC5pdGVtLWNvbnRhaW5lciBoNSwgLml0ZW0tY29udGFpbmVyIGg2IHtcXG4gICAgbWFyZ2luOiAwOyB9XFxuICAuaXRlbS1jb250YWluZXIuZm9jdXMge1xcbiAgICBiYWNrZ3JvdW5kOiByZ2JhKDI0MCwgMjQwLCAyNDAsIDAuOSk7IH1cXG4gIC5pdGVtLWNvbnRhaW5lciAuaXRlbS1hY3Rpb25zIHtcXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgICByaWdodDogMXB4O1xcbiAgICB0b3A6IDFweDsgfVxcbiAgICAuaXRlbS1jb250YWluZXIgLml0ZW0tYWN0aW9ucyAuY2xvc2UtaWNvbi1pdGVtIHtcXG4gICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XFxuICAgICAgY3Vyc29yOiBwb2ludGVyO1xcbiAgICAgIGJhY2tncm91bmQ6IHRyYW5zcGFyZW50O1xcbiAgICAgIHBhZGRpbmc6IDJweDtcXG4gICAgICBib3JkZXI6IDA7XFxuICAgICAgaGVpZ2h0OiAxOHB4O1xcbiAgICAgIHdpZHRoOiAxOHB4OyB9XFxuICAgICAgLml0ZW0tY29udGFpbmVyIC5pdGVtLWFjdGlvbnMgLmNsb3NlLWljb24taXRlbSAuY2xvc2UtaWNvbiB7XFxuICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICAgICAgICB0b3A6IDA7XFxuICAgICAgICBsZWZ0OiA3cHg7XFxuICAgICAgICBmb250LXNpemU6IDE0cHg7XFxuICAgICAgICBtYXJnaW4tdG9wOiAtMXB4OyB9XFxuICAuaXRlbS1jb250YWluZXIgLmlucHV0LWNvbXBvbmVudCB7XFxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gICAgd2lkdGg6IDEwMCU7XFxuICAgIG1pbi1oZWlnaHQ6IDM2cHg7XFxuICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMjQ0LCAyNDQsIDI0NCwgMC40KTsgfVxcbiAgICBAbWVkaWEgKG1heC13aWR0aDogNjAwcHgpIHtcXG4gICAgICAuaXRlbS1jb250YWluZXIgLmlucHV0LWNvbXBvbmVudCB7XFxuICAgICAgICBmbG9hdDogbm9uZTtcXG4gICAgICAgIHdpZHRoOiAxMDAlOyB9IH1cXG4gICAgLml0ZW0tY29udGFpbmVyIC5pbnB1dC1jb21wb25lbnQ6bnRoLW9mLXR5cGUoMm4pIHtcXG4gICAgICBmbG9hdDogcmlnaHQ7IH1cXG4gICAgICBAbWVkaWEgKG1heC13aWR0aDogNjAwcHgpIHtcXG4gICAgICAgIC5pdGVtLWNvbnRhaW5lciAuaW5wdXQtY29tcG9uZW50Om50aC1vZi10eXBlKDJuKSB7XFxuICAgICAgICAgIGZsb2F0OiBub25lO1xcbiAgICAgICAgICB3aWR0aDogMTAwJTsgfSB9XFxuICAgIC5pdGVtLWNvbnRhaW5lciAuaW5wdXQtY29tcG9uZW50IHNwYW4ge1xcbiAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gICAgICB0b3A6IDQ1JTtcXG4gICAgICBsZWZ0OiAwLjc1cmVtO1xcbiAgICAgIGNvbG9yOiByZ2JhKDAsIDAsIDAsIDAuOSk7XFxuICAgICAgcG9pbnRlci1ldmVudHM6IG5vbmU7XFxuICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC00MCUpO1xcbiAgICAgIHRyYW5zaXRpb246IC4yNXM7IH1cXG4gICAgICAuaXRlbS1jb250YWluZXIgLmlucHV0LWNvbXBvbmVudCBzcGFuLmlzLWFjdGl2ZSB7XFxuICAgICAgICBmb250LXNpemU6IDEycHg7XFxuICAgICAgICBjb2xvcjogcmdiYSgwLCAwLCAwLCAwLjkpO1xcbiAgICAgICAgb3BhY2l0eTogLjg1OyB9XFxuICAgIC5pdGVtLWNvbnRhaW5lciAuaW5wdXQtY29tcG9uZW50IGlucHV0LCAuaXRlbS1jb250YWluZXIgLmlucHV0LWNvbXBvbmVudCAuZHJvcGRvd24tdG9nZ2xlIHtcXG4gICAgICB3aWR0aDogMTAwJTtcXG4gICAgICBoZWlnaHQ6IDEwMCU7XFxuICAgICAgcGFkZGluZy10b3A6IDEycHg7XFxuICAgICAgcGFkZGluZy1sZWZ0OiAwLjc1cmVtO1xcbiAgICAgIHBhZGRpbmctcmlnaHQ6IDAuNzVyZW07XFxuICAgICAgYm9yZGVyLXJhZGl1czogMnB4O1xcbiAgICAgIGZvbnQtc2l6ZTogMTZweDtcXG4gICAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuOSk7XFxuICAgICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcXG4gICAgICAtbW96LWFwcGVhcmFuY2U6IG5vbmUgIWltcG9ydGFudDtcXG4gICAgICAtd2Via2l0LWFwcGVhcmFuY2U6IG5vbmUgIWltcG9ydGFudDtcXG4gICAgICBib3JkZXI6IDFweCBzb2xpZCAjNzg3ODc4OyB9XFxuICAgICAgLml0ZW0tY29udGFpbmVyIC5pbnB1dC1jb21wb25lbnQgaW5wdXQuZy10b3VjaGVkLmctaW52YWxpZCwgLml0ZW0tY29udGFpbmVyIC5pbnB1dC1jb21wb25lbnQgLmRyb3Bkb3duLXRvZ2dsZS5nLXRvdWNoZWQuZy1pbnZhbGlkIHtcXG4gICAgICAgIGJvcmRlcjogMXB4IHNvbGlkO1xcbiAgICAgICAgYm9yZGVyLXJhZGl1czogMnB4OyB9XFxuICAgICAgLml0ZW0tY29udGFpbmVyIC5pbnB1dC1jb21wb25lbnQgaW5wdXQuZy10b3VjaGVkLCAuaXRlbS1jb250YWluZXIgLmlucHV0LWNvbXBvbmVudCBpbnB1dC5nLXZhbGlkLCAuaXRlbS1jb250YWluZXIgLmlucHV0LWNvbXBvbmVudCBpbnB1dDpmb2N1cywgLml0ZW0tY29udGFpbmVyIC5pbnB1dC1jb21wb25lbnQgLmRyb3Bkb3duLXRvZ2dsZS5nLXRvdWNoZWQsIC5pdGVtLWNvbnRhaW5lciAuaW5wdXQtY29tcG9uZW50IC5kcm9wZG93bi10b2dnbGUuZy12YWxpZCwgLml0ZW0tY29udGFpbmVyIC5pbnB1dC1jb21wb25lbnQgLmRyb3Bkb3duLXRvZ2dsZTpmb2N1cyB7XFxuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuOSk7IH1cXG4gICAgICAuaXRlbS1jb250YWluZXIgLmlucHV0LWNvbXBvbmVudCBpbnB1dC5nLXRvdWNoZWQgfiBzcGFuLCAuaXRlbS1jb250YWluZXIgLmlucHV0LWNvbXBvbmVudCBpbnB1dC5nLXZhbGlkIH4gc3BhbiwgLml0ZW0tY29udGFpbmVyIC5pbnB1dC1jb21wb25lbnQgLmRyb3Bkb3duLXRvZ2dsZS5nLXRvdWNoZWQgfiBzcGFuLCAuaXRlbS1jb250YWluZXIgLmlucHV0LWNvbXBvbmVudCAuZHJvcGRvd24tdG9nZ2xlLmctdmFsaWQgfiBzcGFuIHtcXG4gICAgICAgIGZvbnQtc2l6ZTogMTJweDtcXG4gICAgICAgIG9wYWNpdHk6IC44NTsgfVxcbiAgICAgIC5pdGVtLWNvbnRhaW5lciAuaW5wdXQtY29tcG9uZW50IGlucHV0OmZvY3VzLCAuaXRlbS1jb250YWluZXIgLmlucHV0LWNvbXBvbmVudCAuZHJvcGRvd24tdG9nZ2xlOmZvY3VzIHtcXG4gICAgICAgIG91dGxpbmU6IG5vbmU7IH1cXG4gICAgICAgIC5pdGVtLWNvbnRhaW5lciAuaW5wdXQtY29tcG9uZW50IGlucHV0OmZvY3VzIH4gc3BhbiwgLml0ZW0tY29udGFpbmVyIC5pbnB1dC1jb21wb25lbnQgLmRyb3Bkb3duLXRvZ2dsZTpmb2N1cyB+IHNwYW4ge1xcbiAgICAgICAgICBmb250LXNpemU6IDEycHg7XFxuICAgICAgICAgIG9wYWNpdHk6IC44NTsgfVxcbiAgICAuaXRlbS1jb250YWluZXIgLmlucHV0LWNvbXBvbmVudCAuZHJvcGRvd24tdG9nZ2xlLmctdG91Y2hlZCB+IHNwYW4sIC5pdGVtLWNvbnRhaW5lciAuaW5wdXQtY29tcG9uZW50IC5kcm9wZG93bi10b2dnbGUuZy12YWxpZCB+IHNwYW4ge1xcbiAgICAgIHRvcDogMTUlOyB9XFxuICAgIC5pdGVtLWNvbnRhaW5lciAuaW5wdXQtY29tcG9uZW50IC5kcm9wZG93bi10b2dnbGU6Zm9jdXMge1xcbiAgICAgIG91dGxpbmU6IG5vbmU7IH1cXG4gICAgICAuaXRlbS1jb250YWluZXIgLmlucHV0LWNvbXBvbmVudCAuZHJvcGRvd24tdG9nZ2xlOmZvY3VzIH4gc3BhbiB7XFxuICAgICAgICB0b3A6IDE1JTsgfVxcbiAgICAuaXRlbS1jb250YWluZXIgLmlucHV0LWNvbXBvbmVudCAuZHJvcGRvd24tdG9nZ2xlIGgxLCAuaXRlbS1jb250YWluZXIgLmlucHV0LWNvbXBvbmVudCAuZHJvcGRvd24tdG9nZ2xlIGgyLCAuaXRlbS1jb250YWluZXIgLmlucHV0LWNvbXBvbmVudCAuZHJvcGRvd24tdG9nZ2xlIGgzLCAuaXRlbS1jb250YWluZXIgLmlucHV0LWNvbXBvbmVudCAuZHJvcGRvd24tdG9nZ2xlIGg0LCAuaXRlbS1jb250YWluZXIgLmlucHV0LWNvbXBvbmVudCAuZHJvcGRvd24tdG9nZ2xlIGg1LCAuaXRlbS1jb250YWluZXIgLmlucHV0LWNvbXBvbmVudCAuZHJvcGRvd24tdG9nZ2xlIGg2IHtcXG4gICAgICBtYXJnaW46IDA7IH1cXG4gICAgLml0ZW0tY29udGFpbmVyIC5pbnB1dC1jb21wb25lbnQgaW5wdXQuZy10b3VjaGVkIH4gc3BhbiwgLml0ZW0tY29udGFpbmVyIC5pbnB1dC1jb21wb25lbnQgaW5wdXQuZy12YWxpZCB+IHNwYW4ge1xcbiAgICAgIHRvcDogMjAlOyB9XFxuICAgIC5pdGVtLWNvbnRhaW5lciAuaW5wdXQtY29tcG9uZW50IGlucHV0OmZvY3VzIHtcXG4gICAgICBvdXRsaW5lOiBub25lOyB9XFxuICAgICAgLml0ZW0tY29udGFpbmVyIC5pbnB1dC1jb21wb25lbnQgaW5wdXQ6Zm9jdXMgfiBzcGFuIHtcXG4gICAgICAgIHRvcDogMjAlOyB9XFxuICAuaXRlbS1jb250YWluZXIgLnJlc2l6ZSB7XFxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gICAgY3Vyc29yOiB3LXJlc2l6ZTsgfVxcbiAgICAuaXRlbS1jb250YWluZXIgLnJlc2l6ZS5yaWdodCB7XFxuICAgICAgdG9wOiAwO1xcbiAgICAgIGJvdHRvbTogMDtcXG4gICAgICByaWdodDogLTRweDtcXG4gICAgICB3aWR0aDogOHB4OyB9XFxuICAgIC5pdGVtLWNvbnRhaW5lciAucmVzaXplLmxlZnQge1xcbiAgICAgIHRvcDogMDtcXG4gICAgICBib3R0b206IDA7XFxuICAgICAgd2lkdGg6IDhweDtcXG4gICAgICBsZWZ0OiAtNHB4OyB9XFxuICAgIC5pdGVtLWNvbnRhaW5lciAucmVzaXplLnRvcCB7XFxuICAgICAgbGVmdDogMDtcXG4gICAgICByaWdodDogMDtcXG4gICAgICBoZWlnaHQ6IDhweDtcXG4gICAgICB0b3A6IC00cHg7IH1cXG4gICAgLml0ZW0tY29udGFpbmVyIC5yZXNpemUuYm90dG9tIHtcXG4gICAgICBsZWZ0OiAwO1xcbiAgICAgIHJpZ2h0OiAwO1xcbiAgICAgIGhlaWdodDogOHB4O1xcbiAgICAgIGJvdHRvbTogLTRweDsgfVxcbiAgICAuaXRlbS1jb250YWluZXIgLnJlc2l6ZS50b3AtcmlnaHQge1xcbiAgICAgIHRvcDogLTRweDtcXG4gICAgICByaWdodDogLTRweDtcXG4gICAgICB3aWR0aDogOHB4O1xcbiAgICAgIGhlaWdodDogOHB4OyB9XFxuICAgIC5pdGVtLWNvbnRhaW5lciAucmVzaXplLnRvcC1sZWZ0IHtcXG4gICAgICB0b3A6IC00cHg7XFxuICAgICAgbGVmdDogLTRweDtcXG4gICAgICB3aWR0aDogOHB4O1xcbiAgICAgIGhlaWdodDogOHB4OyB9XFxuICAgIC5pdGVtLWNvbnRhaW5lciAucmVzaXplLmJvdHRvbS1yaWdodCB7XFxuICAgICAgYm90dG9tOiAtNHB4O1xcbiAgICAgIHJpZ2h0OiAtNHB4O1xcbiAgICAgIHdpZHRoOiA4cHg7XFxuICAgICAgaGVpZ2h0OiA4cHg7IH1cXG4gICAgLml0ZW0tY29udGFpbmVyIC5yZXNpemUuYm90dG9tLWxlZnQge1xcbiAgICAgIGJvdHRvbTogLTRweDtcXG4gICAgICBsZWZ0OiAtNHB4O1xcbiAgICAgIHdpZHRoOiA4cHg7XFxuICAgICAgaGVpZ2h0OiA4cHg7IH1cXG5cIiwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJDOi9Vc2Vycy9nYXJyaS9zb3VyY2UvcmVwb3Mvc25hcGZvcm0vY2xpZW50L2VuZ2luZS9hc3NldHMvc3R5bGUvY29tcG9uZW50cy9pdGVtL2NsaWVudC9lbmdpbmUvYXNzZXRzL3N0eWxlL2NvbXBvbmVudHMvaXRlbS9pdGVtLnNjc3NcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBQUE7RUFDSSxrQkFBa0I7RUFDbEIseUJBQXlCO0VBQ3pCLG9DQUFvQztFQUNwQyxZQUFZO0VBQ1osWUFBWSxFQUFBO0VBTGhCO0lBUVEsU0FBUyxFQUFBO0VBUmpCO0lBWVEsb0NBQW9DLEVBQUE7RUFaNUM7SUFnQlEsa0JBQWtCO0lBQ2xCLFVBQVU7SUFDVixRQUFRLEVBQUE7SUFsQmhCO01BcUJZLHFCQUFxQjtNQUNyQixlQUFlO01BQ2YsdUJBQXVCO01BQ3ZCLFlBQVk7TUFDWixTQUFTO01BQ1QsWUFBWTtNQUNaLFdBQVcsRUFBQTtNQTNCdkI7UUE4QmdCLGtCQUFrQjtRQUNsQixNQUFNO1FBQ04sU0FBUztRQUNULGVBQWU7UUFDZixnQkFBZ0IsRUFBQTtFQWxDaEM7SUF3Q1Esa0JBQWtCO0lBQ2xCLFdBQVc7SUFDWCxnQkFBZ0I7SUFDaEIsMENBQXlDLEVBQUE7SUFDekM7TUE1Q1I7UUE2Q1ksV0FBVztRQUNYLFdBQVcsRUFBQSxFQXlGbEI7SUF2SUw7TUFpRFksWUFBWSxFQUFBO01BQ1o7UUFsRFo7VUFtRGdCLFdBQVc7VUFDWCxXQUFXLEVBQUEsRUFFbEI7SUF0RFQ7TUF3RFksa0JBQWtCO01BQ2xCLFFBQVE7TUFDUixhQUFhO01BQ2IseUJBQXlCO01BQ3pCLG9CQUFvQjtNQUNwQiwyQkFBMkI7TUFDM0IsZ0JBQWdCLEVBQUE7TUE5RDVCO1FBZ0VnQixlQUFlO1FBQ2YseUJBQXlCO1FBQ3pCLFlBQVksRUFBQTtJQWxFNUI7TUFzRVksV0FBVztNQUNYLFlBQVk7TUFDWixpQkFBaUI7TUFDakIscUJBQXFCO01BQ3JCLHNCQUFzQjtNQUN0QixrQkFBa0I7TUFDbEIsZUFBZTtNQUNmLDBDQUEwQztNQUMxQyxzQkFBc0I7TUFDdEIsZ0NBQWdDO01BQ2hDLG1DQUFtQztNQUNuQyx5QkFBeUIsRUFBQTtNQWpGckM7UUFtRmdCLGlCQUFpQjtRQUNqQixrQkFBa0IsRUFBQTtNQXBGbEM7UUF1RmdCLDBDQUEwQyxFQUFBO01BdkYxRDtRQTJGb0IsZUFBZTtRQUNmLFlBQVksRUFBQTtNQTVGaEM7UUFnR2dCLGFBQWEsRUFBQTtRQWhHN0I7VUFrR29CLGVBQWU7VUFDZixZQUFZLEVBQUE7SUFuR2hDO01BMkdvQixRQUFRLEVBQUE7SUEzRzVCO01BK0dnQixhQUFhLEVBQUE7TUEvRzdCO1FBaUhvQixRQUFRLEVBQUE7SUFqSDVCO01Bc0hnQixTQUFTLEVBQUE7SUF0SHpCO01BNkhvQixRQUFRLEVBQUE7SUE3SDVCO01BaUlnQixhQUFhLEVBQUE7TUFqSTdCO1FBbUlvQixRQUFRLEVBQUE7RUFuSTVCO0lBMElRLGtCQUFrQjtJQUNsQixnQkFBZ0IsRUFBQTtJQTNJeEI7TUE4SVksTUFBTTtNQUNOLFNBQVM7TUFDVCxXQUFXO01BQ1gsVUFBVSxFQUFBO0lBakp0QjtNQXFKWSxNQUFNO01BQ04sU0FBUztNQUNULFVBQVU7TUFDVixVQUFVLEVBQUE7SUF4SnRCO01BNEpZLE9BQU87TUFDUCxRQUFRO01BQ1IsV0FBVztNQUNYLFNBQVMsRUFBQTtJQS9KckI7TUFtS1ksT0FBTztNQUNQLFFBQVE7TUFDUixXQUFXO01BQ1gsWUFBWSxFQUFBO0lBdEt4QjtNQTBLWSxTQUFTO01BQ1QsV0FBVztNQUNYLFVBQVU7TUFDVixXQUFXLEVBQUE7SUE3S3ZCO01BaUxZLFNBQVM7TUFDVCxVQUFVO01BQ1YsVUFBVTtNQUNWLFdBQVcsRUFBQTtJQXBMdkI7TUF3TFksWUFBWTtNQUNaLFdBQVc7TUFDWCxVQUFVO01BQ1YsV0FBVyxFQUFBO0lBM0x2QjtNQStMWSxZQUFZO01BQ1osVUFBVTtNQUNWLFVBQVU7TUFDVixXQUFXLEVBQUFcIixcImZpbGVcIjpcIml0ZW0uc2Nzc1wiLFwic291cmNlc0NvbnRlbnRcIjpbXCIuaXRlbS1jb250YWluZXIge1xcclxcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XFxyXFxuICAgIGJvcmRlcjogMXB4IHNvbGlkICM3ODc4Nzg7XFxyXFxuICAgIGJhY2tncm91bmQ6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC45KTtcXHJcXG4gICAgcGFkZGluZzogNHB4O1xcclxcbiAgICBjdXJzb3I6IG1vdmU7XFxyXFxuXFxyXFxuICAgIGgxLCBoMiwgaDMsIGg0LCBoNSwgaDYge1xcclxcbiAgICAgICAgbWFyZ2luOiAwO1xcclxcbiAgICB9XFxyXFxuXFxyXFxuICAgICYuZm9jdXMge1xcclxcbiAgICAgICAgYmFja2dyb3VuZDogcmdiYSgyNDAsIDI0MCwgMjQwLCAwLjkpO1xcclxcbiAgICB9XFxyXFxuXFxyXFxuICAgIC5pdGVtLWFjdGlvbnMge1xcclxcbiAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xcclxcbiAgICAgICAgcmlnaHQ6IDFweDtcXHJcXG4gICAgICAgIHRvcDogMXB4O1xcclxcblxcclxcbiAgICAgICAgLmNsb3NlLWljb24taXRlbSB7XFxyXFxuICAgICAgICAgICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xcclxcbiAgICAgICAgICAgIGN1cnNvcjogcG9pbnRlcjtcXHJcXG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudDtcXHJcXG4gICAgICAgICAgICBwYWRkaW5nOiAycHg7XFxyXFxuICAgICAgICAgICAgYm9yZGVyOiAwO1xcclxcbiAgICAgICAgICAgIGhlaWdodDogMThweDtcXHJcXG4gICAgICAgICAgICB3aWR0aDogMThweDtcXHJcXG4gICAgICAgICAgICBcXHJcXG4gICAgICAgICAgICAuY2xvc2UtaWNvbiB7XFxyXFxuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXHJcXG4gICAgICAgICAgICAgICAgdG9wOiAwO1xcclxcbiAgICAgICAgICAgICAgICBsZWZ0OiA3cHg7XFxyXFxuICAgICAgICAgICAgICAgIGZvbnQtc2l6ZTogMTRweDtcXHJcXG4gICAgICAgICAgICAgICAgbWFyZ2luLXRvcDogLTFweDtcXHJcXG4gICAgICAgICAgICB9XFxyXFxuICAgICAgICB9XFxyXFxuICAgIH1cXHJcXG5cXHJcXG4gICAgLmlucHV0LWNvbXBvbmVudCB7XFxyXFxuICAgICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XFxyXFxuICAgICAgICB3aWR0aDogMTAwJTtcXHJcXG4gICAgICAgIG1pbi1oZWlnaHQ6IDM2cHg7XFxyXFxuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDI0NCwgMjQ0LCAyNDQsIC40KTtcXHJcXG4gICAgICAgIEBtZWRpYSAobWF4LXdpZHRoOiA2MDBweCkge1xcclxcbiAgICAgICAgICAgIGZsb2F0OiBub25lO1xcclxcbiAgICAgICAgICAgIHdpZHRoOiAxMDAlO1xcclxcbiAgICAgICAgfVxcclxcbiAgICAgICAgJjpudGgtb2YtdHlwZSgybikge1xcclxcbiAgICAgICAgICAgIGZsb2F0OiByaWdodDtcXHJcXG4gICAgICAgICAgICBAbWVkaWEgKG1heC13aWR0aDogNjAwcHgpIHtcXHJcXG4gICAgICAgICAgICAgICAgZmxvYXQ6IG5vbmU7XFxyXFxuICAgICAgICAgICAgICAgIHdpZHRoOiAxMDAlO1xcclxcbiAgICAgICAgICAgIH1cXHJcXG4gICAgICAgIH1cXHJcXG4gICAgICAgIHNwYW4ge1xcclxcbiAgICAgICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXHJcXG4gICAgICAgICAgICB0b3A6IDQ1JTtcXHJcXG4gICAgICAgICAgICBsZWZ0OiAwLjc1cmVtO1xcclxcbiAgICAgICAgICAgIGNvbG9yOiByZ2JhKDAsIDAsIDAsIDAuOSk7XFxyXFxuICAgICAgICAgICAgcG9pbnRlci1ldmVudHM6IG5vbmU7XFxyXFxuICAgICAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC00MCUpO1xcclxcbiAgICAgICAgICAgIHRyYW5zaXRpb246IC4yNXM7XFxyXFxuICAgICAgICAgICAgJi5pcy1hY3RpdmUge1xcclxcbiAgICAgICAgICAgICAgICBmb250LXNpemU6IDEycHg7XFxyXFxuICAgICAgICAgICAgICAgIGNvbG9yOiByZ2JhKDAsIDAsIDAsIDAuOSk7XFxyXFxuICAgICAgICAgICAgICAgIG9wYWNpdHk6IC44NTtcXHJcXG4gICAgICAgICAgICB9XFxyXFxuICAgICAgICB9XFxyXFxuICAgICAgICBpbnB1dCwgLmRyb3Bkb3duLXRvZ2dsZSB7XFxyXFxuICAgICAgICAgICAgd2lkdGg6IDEwMCU7XFxyXFxuICAgICAgICAgICAgaGVpZ2h0OiAxMDAlO1xcclxcbiAgICAgICAgICAgIHBhZGRpbmctdG9wOiAxMnB4O1xcclxcbiAgICAgICAgICAgIHBhZGRpbmctbGVmdDogMC43NXJlbTtcXHJcXG4gICAgICAgICAgICBwYWRkaW5nLXJpZ2h0OiAwLjc1cmVtO1xcclxcbiAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDJweDtcXHJcXG4gICAgICAgICAgICBmb250LXNpemU6IDE2cHg7XFxyXFxuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjkpO1xcclxcbiAgICAgICAgICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XFxyXFxuICAgICAgICAgICAgLW1vei1hcHBlYXJhbmNlOiBub25lICFpbXBvcnRhbnQ7XFxyXFxuICAgICAgICAgICAgLXdlYmtpdC1hcHBlYXJhbmNlOiBub25lICFpbXBvcnRhbnQ7XFxyXFxuICAgICAgICAgICAgYm9yZGVyOiAxcHggc29saWQgIzc4Nzg3ODtcXHJcXG4gICAgICAgICAgICAmLmctdG91Y2hlZC5nLWludmFsaWQge1xcclxcbiAgICAgICAgICAgICAgICBib3JkZXI6IDFweCBzb2xpZDtcXHJcXG4gICAgICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogMnB4O1xcclxcbiAgICAgICAgICAgIH1cXHJcXG4gICAgICAgICAgICAmLmctdG91Y2hlZCwgJi5nLXZhbGlkLCAmOmZvY3VzIHtcXHJcXG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjkpO1xcclxcbiAgICAgICAgICAgIH1cXHJcXG4gICAgICAgICAgICAmLmctdG91Y2hlZCwgJi5nLXZhbGlkIHtcXHJcXG4gICAgICAgICAgICAgICAgfnNwYW4ge1xcclxcbiAgICAgICAgICAgICAgICAgICAgZm9udC1zaXplOiAxMnB4O1xcclxcbiAgICAgICAgICAgICAgICAgICAgb3BhY2l0eTogLjg1O1xcclxcbiAgICAgICAgICAgICAgICB9XFxyXFxuICAgICAgICAgICAgfVxcclxcbiAgICAgICAgICAgICY6Zm9jdXMge1xcclxcbiAgICAgICAgICAgICAgICBvdXRsaW5lOiBub25lO1xcclxcbiAgICAgICAgICAgICAgICB+c3BhbiB7XFxyXFxuICAgICAgICAgICAgICAgICAgICBmb250LXNpemU6IDEycHg7XFxyXFxuICAgICAgICAgICAgICAgICAgICBvcGFjaXR5OiAuODU7XFxyXFxuICAgICAgICAgICAgICAgIH1cXHJcXG4gICAgICAgICAgICB9XFxyXFxuICAgICAgICB9XFxyXFxuXFxyXFxuICAgICAgICAuZHJvcGRvd24tdG9nZ2xlIHtcXHJcXG4gICAgICAgICAgICAmLmctdG91Y2hlZCwgJi5nLXZhbGlkIHtcXHJcXG4gICAgICAgICAgICAgICAgfnNwYW4ge1xcclxcbiAgICAgICAgICAgICAgICAgICAgdG9wOiAxNSU7XFxyXFxuICAgICAgICAgICAgICAgIH1cXHJcXG4gICAgICAgICAgICB9XFxyXFxuICAgICAgICAgICAgJjpmb2N1cyB7XFxyXFxuICAgICAgICAgICAgICAgIG91dGxpbmU6IG5vbmU7XFxyXFxuICAgICAgICAgICAgICAgIH5zcGFuIHtcXHJcXG4gICAgICAgICAgICAgICAgICAgIHRvcDogMTUlO1xcclxcbiAgICAgICAgICAgICAgICB9XFxyXFxuICAgICAgICAgICAgfVxcclxcblxcclxcbiAgICAgICAgICAgIGgxLCBoMiwgaDMsIGg0LCBoNSwgaDYge1xcclxcbiAgICAgICAgICAgICAgICBtYXJnaW46IDA7XFxyXFxuICAgICAgICAgICAgfVxcclxcbiAgICAgICAgfVxcclxcblxcclxcbiAgICAgICAgaW5wdXQge1xcclxcbiAgICAgICAgICAgICYuZy10b3VjaGVkLCAmLmctdmFsaWQge1xcclxcbiAgICAgICAgICAgICAgICB+c3BhbiB7XFxyXFxuICAgICAgICAgICAgICAgICAgICB0b3A6IDIwJTtcXHJcXG4gICAgICAgICAgICAgICAgfVxcclxcbiAgICAgICAgICAgIH1cXHJcXG4gICAgICAgICAgICAmOmZvY3VzIHtcXHJcXG4gICAgICAgICAgICAgICAgb3V0bGluZTogbm9uZTtcXHJcXG4gICAgICAgICAgICAgICAgfnNwYW4ge1xcclxcbiAgICAgICAgICAgICAgICAgICAgdG9wOiAyMCU7XFxyXFxuICAgICAgICAgICAgICAgIH1cXHJcXG4gICAgICAgICAgICB9XFxyXFxuICAgICAgICB9XFxyXFxuICAgIH1cXHJcXG5cXHJcXG4gICAgLnJlc2l6ZSB7XFxyXFxuICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XFxyXFxuICAgICAgICBjdXJzb3I6IHctcmVzaXplO1xcclxcblxcclxcbiAgICAgICAgJi5yaWdodCB7XFxyXFxuICAgICAgICAgICAgdG9wOiAwO1xcclxcbiAgICAgICAgICAgIGJvdHRvbTogMDtcXHJcXG4gICAgICAgICAgICByaWdodDogLTRweDtcXHJcXG4gICAgICAgICAgICB3aWR0aDogOHB4O1xcclxcbiAgICAgICAgfVxcclxcblxcclxcbiAgICAgICAgJi5sZWZ0IHtcXHJcXG4gICAgICAgICAgICB0b3A6IDA7XFxyXFxuICAgICAgICAgICAgYm90dG9tOiAwO1xcclxcbiAgICAgICAgICAgIHdpZHRoOiA4cHg7XFxyXFxuICAgICAgICAgICAgbGVmdDogLTRweDtcXHJcXG4gICAgICAgIH1cXHJcXG5cXHJcXG4gICAgICAgICYudG9wIHtcXHJcXG4gICAgICAgICAgICBsZWZ0OiAwO1xcclxcbiAgICAgICAgICAgIHJpZ2h0OiAwO1xcclxcbiAgICAgICAgICAgIGhlaWdodDogOHB4O1xcclxcbiAgICAgICAgICAgIHRvcDogLTRweDtcXHJcXG4gICAgICAgIH1cXHJcXG5cXHJcXG4gICAgICAgICYuYm90dG9tIHtcXHJcXG4gICAgICAgICAgICBsZWZ0OiAwO1xcclxcbiAgICAgICAgICAgIHJpZ2h0OiAwO1xcclxcbiAgICAgICAgICAgIGhlaWdodDogOHB4O1xcclxcbiAgICAgICAgICAgIGJvdHRvbTogLTRweDtcXHJcXG4gICAgICAgIH1cXHJcXG5cXHJcXG4gICAgICAgICYudG9wLXJpZ2h0IHtcXHJcXG4gICAgICAgICAgICB0b3A6IC00cHg7XFxyXFxuICAgICAgICAgICAgcmlnaHQ6IC00cHg7XFxyXFxuICAgICAgICAgICAgd2lkdGg6IDhweDtcXHJcXG4gICAgICAgICAgICBoZWlnaHQ6IDhweDtcXHJcXG4gICAgICAgIH1cXHJcXG5cXHJcXG4gICAgICAgICYudG9wLWxlZnQge1xcclxcbiAgICAgICAgICAgIHRvcDogLTRweDtcXHJcXG4gICAgICAgICAgICBsZWZ0OiAtNHB4O1xcclxcbiAgICAgICAgICAgIHdpZHRoOiA4cHg7XFxyXFxuICAgICAgICAgICAgaGVpZ2h0OiA4cHg7XFxyXFxuICAgICAgICB9XFxyXFxuXFxyXFxuICAgICAgICAmLmJvdHRvbS1yaWdodCB7XFxyXFxuICAgICAgICAgICAgYm90dG9tOiAtNHB4O1xcclxcbiAgICAgICAgICAgIHJpZ2h0OiAtNHB4O1xcclxcbiAgICAgICAgICAgIHdpZHRoOiA4cHg7XFxyXFxuICAgICAgICAgICAgaGVpZ2h0OiA4cHg7XFxyXFxuICAgICAgICB9XFxyXFxuXFxyXFxuICAgICAgICAmLmJvdHRvbS1sZWZ0IHtcXHJcXG4gICAgICAgICAgICBib3R0b206IC00cHg7XFxyXFxuICAgICAgICAgICAgbGVmdDogLTRweDtcXHJcXG4gICAgICAgICAgICB3aWR0aDogOHB4O1xcclxcbiAgICAgICAgICAgIGhlaWdodDogOHB4O1xcclxcbiAgICAgICAgfVxcclxcbiAgICB9XFxyXFxuXFxyXFxuICAgIC8vIGRpdi5kcmFnRGl2IHtcXHJcXG4gICAgLy8gICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXHJcXG4gICAgLy8gICAgIHRvcDogMDtcXHJcXG4gICAgLy8gICAgIGJvdHRvbTogMDtcXHJcXG4gICAgLy8gICAgIHdpZHRoOiA4cHg7XFxyXFxuICAgIC8vICAgICBjdXJzb3I6IHctcmVzaXplO1xcclxcbiAgICAvLyB9XFxyXFxuICAgIC8vICAgICBkaXYuZHJhZ0Rpdi5yaWdodCB7XFxyXFxuICAgIC8vICAgICAgICAgcmlnaHQ6IC00cHg7XFxyXFxuICAgIC8vICAgICB9XFxyXFxuICAgIC8vICAgICBkaXYuZHJhZ0Rpdi5sZWZ0IHtcXHJcXG4gICAgLy8gICAgICAgICBsZWZ0OiAtNHB4O1xcclxcbiAgICAvLyAgICAgfVxcclxcbn1cIl0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcblxuIiwiXG52YXIgY29udGVudCA9IHJlcXVpcmUoXCIhIS4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzPz9yZWYtLTYtMSEuLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvbGliL2xvYWRlci5qcz8/cmVmLS02LTIhLi9pdGVtLnNjc3NcIik7XG5cbmlmKHR5cGVvZiBjb250ZW50ID09PSAnc3RyaW5nJykgY29udGVudCA9IFtbbW9kdWxlLmlkLCBjb250ZW50LCAnJ11dO1xuXG52YXIgdHJhbnNmb3JtO1xudmFyIGluc2VydEludG87XG5cblxuXG52YXIgb3B0aW9ucyA9IHtcImhtclwiOnRydWV9XG5cbm9wdGlvbnMudHJhbnNmb3JtID0gdHJhbnNmb3JtXG5vcHRpb25zLmluc2VydEludG8gPSB1bmRlZmluZWQ7XG5cbnZhciB1cGRhdGUgPSByZXF1aXJlKFwiIS4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvbGliL2FkZFN0eWxlcy5qc1wiKShjb250ZW50LCBvcHRpb25zKTtcblxuaWYoY29udGVudC5sb2NhbHMpIG1vZHVsZS5leHBvcnRzID0gY29udGVudC5sb2NhbHM7XG5cbmlmKG1vZHVsZS5ob3QpIHtcblx0bW9kdWxlLmhvdC5hY2NlcHQoXCIhIS4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzPz9yZWYtLTYtMSEuLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvbGliL2xvYWRlci5qcz8/cmVmLS02LTIhLi9pdGVtLnNjc3NcIiwgZnVuY3Rpb24oKSB7XG5cdFx0dmFyIG5ld0NvbnRlbnQgPSByZXF1aXJlKFwiISEuLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcz8/cmVmLS02LTEhLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2xpYi9sb2FkZXIuanM/P3JlZi0tNi0yIS4vaXRlbS5zY3NzXCIpO1xuXG5cdFx0aWYodHlwZW9mIG5ld0NvbnRlbnQgPT09ICdzdHJpbmcnKSBuZXdDb250ZW50ID0gW1ttb2R1bGUuaWQsIG5ld0NvbnRlbnQsICcnXV07XG5cblx0XHR2YXIgbG9jYWxzID0gKGZ1bmN0aW9uKGEsIGIpIHtcblx0XHRcdHZhciBrZXksIGlkeCA9IDA7XG5cblx0XHRcdGZvcihrZXkgaW4gYSkge1xuXHRcdFx0XHRpZighYiB8fCBhW2tleV0gIT09IGJba2V5XSkgcmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRpZHgrKztcblx0XHRcdH1cblxuXHRcdFx0Zm9yKGtleSBpbiBiKSBpZHgtLTtcblxuXHRcdFx0cmV0dXJuIGlkeCA9PT0gMDtcblx0XHR9KGNvbnRlbnQubG9jYWxzLCBuZXdDb250ZW50LmxvY2FscykpO1xuXG5cdFx0aWYoIWxvY2FscykgdGhyb3cgbmV3IEVycm9yKCdBYm9ydGluZyBDU1MgSE1SIGR1ZSB0byBjaGFuZ2VkIGNzcy1tb2R1bGVzIGxvY2Fscy4nKTtcblxuXHRcdHVwZGF0ZShuZXdDb250ZW50KTtcblx0fSk7XG5cblx0bW9kdWxlLmhvdC5kaXNwb3NlKGZ1bmN0aW9uKCkgeyB1cGRhdGUoKTsgfSk7XG59Il0sInNvdXJjZVJvb3QiOiIifQ==