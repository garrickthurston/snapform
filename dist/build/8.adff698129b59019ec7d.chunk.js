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
    const config = workspace.project.config;
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

    if (itemOffsetLeft >= config.viewWidth) {
      left = Math.floor((config.viewWidth - rect.width) / defaultWidth) * defaultWidth;
    }

    if (itemOffsetTop >= config.viewHeight) {
      top = Math.floor((config.viewHeight - rect.height) / defaultHeight) * defaultHeight;
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
    var x = this.state.info.x;
    const {
      workspace
    } = _config_redux_redux_store__WEBPACK_IMPORTED_MODULE_2__["store"].getState();
    const config = workspace.project.config;

    switch (this.state.resizeType) {
      case _resizeTypes.right_only:
        width += e.clientX - this.startClientX;
        width = Math.floor(width / config.cellWidth) * config.cellWidth;

        if (x + width > config.viewWidth - 4 * config.cellWidth) {
          this.props.updateProjectConfig(Object.assign({}, config, {
            viewWidth: x + width + 12 * config.cellWidth
          }));
        }

        break;

      case _resizeTypes.left_only:
        width -= e.clientX - this.startClientX;
        width = Math.floor(width / config.cellWidth) * config.cellWidth;
        x -= width - this.state.info.width;

        if (x < 0) {
          x = 0;
          return;
        }

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
      x,
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
exports.push([module.i, ".item-container {\n  position: absolute;\n  border: 1px solid #787878;\n  background: rgba(255, 255, 255, 0.9);\n  padding: 4px;\n  cursor: move; }\n  .item-container h1, .item-container h2, .item-container h3, .item-container h4, .item-container h5, .item-container h6 {\n    margin: 0; }\n  .item-container.focus {\n    background: rgba(240, 240, 240, 0.9); }\n  .item-container .item-actions {\n    position: absolute;\n    right: 1px;\n    top: 1px; }\n    .item-container .item-actions .close-icon-item {\n      display: inline-block;\n      cursor: pointer;\n      background: transparent;\n      padding: 2px;\n      border: 0;\n      height: 18px;\n      width: 18px; }\n      .item-container .item-actions .close-icon-item .close-icon {\n        position: absolute;\n        top: 0;\n        left: 7px;\n        font-size: 14px;\n        margin-top: -1px; }\n  .item-container .input-component {\n    position: relative;\n    width: 100%;\n    min-height: 36px;\n    background-color: rgba(244, 244, 244, 0.4); }\n    @media (max-width: 600px) {\n      .item-container .input-component {\n        float: none;\n        width: 100%; } }\n    .item-container .input-component:nth-of-type(2n) {\n      float: right; }\n      @media (max-width: 600px) {\n        .item-container .input-component:nth-of-type(2n) {\n          float: none;\n          width: 100%; } }\n    .item-container .input-component span {\n      position: absolute;\n      top: 45%;\n      left: 0.75rem;\n      color: rgba(0, 0, 0, 0.9);\n      pointer-events: none;\n      transform: translateY(-40%);\n      transition: .25s; }\n      .item-container .input-component span.is-active {\n        font-size: 12px;\n        color: rgba(0, 0, 0, 0.9);\n        opacity: .85; }\n    .item-container .input-component input, .item-container .input-component .dropdown-toggle, .item-container .input-component textarea {\n      cursor: move;\n      width: 100%;\n      height: 100%;\n      padding-top: 12px;\n      padding-left: 0.75rem;\n      padding-right: 0.75rem;\n      border-radius: 2px;\n      font-size: 16px;\n      background-color: rgba(255, 255, 255, 0.9);\n      box-sizing: border-box;\n      -moz-appearance: none !important;\n      -webkit-appearance: none !important;\n      border: 1px solid #787878; }\n      .item-container .input-component input.g-touched.g-invalid, .item-container .input-component .dropdown-toggle.g-touched.g-invalid, .item-container .input-component textarea.g-touched.g-invalid {\n        border: 1px solid;\n        border-radius: 2px; }\n      .item-container .input-component input.g-touched, .item-container .input-component input.g-valid, .item-container .input-component input:focus, .item-container .input-component .dropdown-toggle.g-touched, .item-container .input-component .dropdown-toggle.g-valid, .item-container .input-component .dropdown-toggle:focus, .item-container .input-component textarea.g-touched, .item-container .input-component textarea.g-valid, .item-container .input-component textarea:focus {\n        background-color: rgba(255, 255, 255, 0.9); }\n      .item-container .input-component input.g-touched ~ span, .item-container .input-component input.g-valid ~ span, .item-container .input-component .dropdown-toggle.g-touched ~ span, .item-container .input-component .dropdown-toggle.g-valid ~ span, .item-container .input-component textarea.g-touched ~ span, .item-container .input-component textarea.g-valid ~ span {\n        font-size: 12px;\n        opacity: .85; }\n      .item-container .input-component input:focus, .item-container .input-component .dropdown-toggle:focus, .item-container .input-component textarea:focus {\n        outline: none; }\n        .item-container .input-component input:focus ~ span, .item-container .input-component .dropdown-toggle:focus ~ span, .item-container .input-component textarea:focus ~ span {\n          font-size: 12px;\n          opacity: .85; }\n    .item-container .input-component .dropdown-toggle.g-touched ~ span, .item-container .input-component .dropdown-toggle.g-valid ~ span {\n      top: 15%; }\n    .item-container .input-component .dropdown-toggle:focus {\n      outline: none; }\n      .item-container .input-component .dropdown-toggle:focus ~ span {\n        top: 15%; }\n    .item-container .input-component .dropdown-toggle h1, .item-container .input-component .dropdown-toggle h2, .item-container .input-component .dropdown-toggle h3, .item-container .input-component .dropdown-toggle h4, .item-container .input-component .dropdown-toggle h5, .item-container .input-component .dropdown-toggle h6 {\n      margin: 0; }\n    .item-container .input-component input.g-touched ~ span, .item-container .input-component input.g-valid ~ span {\n      top: 20%; }\n    .item-container .input-component input:focus {\n      outline: none; }\n      .item-container .input-component input:focus ~ span {\n        top: 20%; }\n  .item-container .resize {\n    position: absolute;\n    cursor: w-resize; }\n    .item-container .resize.right {\n      top: 0;\n      bottom: 0;\n      right: -4px;\n      width: 8px; }\n    .item-container .resize.left {\n      top: 0;\n      bottom: 0;\n      width: 8px;\n      left: -4px; }\n    .item-container .resize.top {\n      left: 0;\n      right: 0;\n      height: 8px;\n      top: -4px; }\n    .item-container .resize.bottom {\n      left: 0;\n      right: 0;\n      height: 8px;\n      bottom: -4px; }\n    .item-container .resize.top-right {\n      top: -4px;\n      right: -4px;\n      width: 8px;\n      height: 8px; }\n    .item-container .resize.top-left {\n      top: -4px;\n      left: -4px;\n      width: 8px;\n      height: 8px; }\n    .item-container .resize.bottom-right {\n      bottom: -4px;\n      right: -4px;\n      width: 8px;\n      height: 8px; }\n    .item-container .resize.bottom-left {\n      bottom: -4px;\n      left: -4px;\n      width: 8px;\n      height: 8px; }\n", "",{"version":3,"sources":["C:/Users/garri/source/repos/snapform/client/engine/assets/style/components/item/client/engine/assets/style/components/item/item.scss"],"names":[],"mappings":"AAAA;EACI,kBAAkB;EAClB,yBAAyB;EACzB,oCAAoC;EACpC,YAAY;EACZ,YAAY,EAAA;EALhB;IAQQ,SAAS,EAAA;EARjB;IAYQ,oCAAoC,EAAA;EAZ5C;IAgBQ,kBAAkB;IAClB,UAAU;IACV,QAAQ,EAAA;IAlBhB;MAqBY,qBAAqB;MACrB,eAAe;MACf,uBAAuB;MACvB,YAAY;MACZ,SAAS;MACT,YAAY;MACZ,WAAW,EAAA;MA3BvB;QA8BgB,kBAAkB;QAClB,MAAM;QACN,SAAS;QACT,eAAe;QACf,gBAAgB,EAAA;EAlChC;IAwCQ,kBAAkB;IAClB,WAAW;IACX,gBAAgB;IAChB,0CAAyC,EAAA;IACzC;MA5CR;QA6CY,WAAW;QACX,WAAW,EAAA,EA0FlB;IAxIL;MAiDY,YAAY,EAAA;MACZ;QAlDZ;UAmDgB,WAAW;UACX,WAAW,EAAA,EAElB;IAtDT;MAwDY,kBAAkB;MAClB,QAAQ;MACR,aAAa;MACb,yBAAyB;MACzB,oBAAoB;MACpB,2BAA2B;MAC3B,gBAAgB,EAAA;MA9D5B;QAgEgB,eAAe;QACf,yBAAyB;QACzB,YAAY,EAAA;IAlE5B;MAsEY,YAAY;MACZ,WAAW;MACX,YAAY;MACZ,iBAAiB;MACjB,qBAAqB;MACrB,sBAAsB;MACtB,kBAAkB;MAClB,eAAe;MACf,0CAA0C;MAC1C,sBAAsB;MACtB,gCAAgC;MAChC,mCAAmC;MACnC,yBAAyB,EAAA;MAlFrC;QAoFgB,iBAAiB;QACjB,kBAAkB,EAAA;MArFlC;QAwFgB,0CAA0C,EAAA;MAxF1D;QA4FoB,eAAe;QACf,YAAY,EAAA;MA7FhC;QAiGgB,aAAa,EAAA;QAjG7B;UAmGoB,eAAe;UACf,YAAY,EAAA;IApGhC;MA4GoB,QAAQ,EAAA;IA5G5B;MAgHgB,aAAa,EAAA;MAhH7B;QAkHoB,QAAQ,EAAA;IAlH5B;MAuHgB,SAAS,EAAA;IAvHzB;MA8HoB,QAAQ,EAAA;IA9H5B;MAkIgB,aAAa,EAAA;MAlI7B;QAoIoB,QAAQ,EAAA;EApI5B;IA2IQ,kBAAkB;IAClB,gBAAgB,EAAA;IA5IxB;MA+IY,MAAM;MACN,SAAS;MACT,WAAW;MACX,UAAU,EAAA;IAlJtB;MAsJY,MAAM;MACN,SAAS;MACT,UAAU;MACV,UAAU,EAAA;IAzJtB;MA6JY,OAAO;MACP,QAAQ;MACR,WAAW;MACX,SAAS,EAAA;IAhKrB;MAoKY,OAAO;MACP,QAAQ;MACR,WAAW;MACX,YAAY,EAAA;IAvKxB;MA2KY,SAAS;MACT,WAAW;MACX,UAAU;MACV,WAAW,EAAA;IA9KvB;MAkLY,SAAS;MACT,UAAU;MACV,UAAU;MACV,WAAW,EAAA;IArLvB;MAyLY,YAAY;MACZ,WAAW;MACX,UAAU;MACV,WAAW,EAAA;IA5LvB;MAgMY,YAAY;MACZ,UAAU;MACV,UAAU;MACV,WAAW,EAAA","file":"item.scss","sourcesContent":[".item-container {\r\n    position: absolute;\r\n    border: 1px solid #787878;\r\n    background: rgba(255, 255, 255, 0.9);\r\n    padding: 4px;\r\n    cursor: move;\r\n\r\n    h1, h2, h3, h4, h5, h6 {\r\n        margin: 0;\r\n    }\r\n\r\n    &.focus {\r\n        background: rgba(240, 240, 240, 0.9);\r\n    }\r\n\r\n    .item-actions {\r\n        position: absolute;\r\n        right: 1px;\r\n        top: 1px;\r\n\r\n        .close-icon-item {\r\n            display: inline-block;\r\n            cursor: pointer;\r\n            background: transparent;\r\n            padding: 2px;\r\n            border: 0;\r\n            height: 18px;\r\n            width: 18px;\r\n            \r\n            .close-icon {\r\n                position: absolute;\r\n                top: 0;\r\n                left: 7px;\r\n                font-size: 14px;\r\n                margin-top: -1px;\r\n            }\r\n        }\r\n    }\r\n\r\n    .input-component {\r\n        position: relative;\r\n        width: 100%;\r\n        min-height: 36px;\r\n        background-color: rgba(244, 244, 244, .4);\r\n        @media (max-width: 600px) {\r\n            float: none;\r\n            width: 100%;\r\n        }\r\n        &:nth-of-type(2n) {\r\n            float: right;\r\n            @media (max-width: 600px) {\r\n                float: none;\r\n                width: 100%;\r\n            }\r\n        }\r\n        span {\r\n            position: absolute;\r\n            top: 45%;\r\n            left: 0.75rem;\r\n            color: rgba(0, 0, 0, 0.9);\r\n            pointer-events: none;\r\n            transform: translateY(-40%);\r\n            transition: .25s;\r\n            &.is-active {\r\n                font-size: 12px;\r\n                color: rgba(0, 0, 0, 0.9);\r\n                opacity: .85;\r\n            }\r\n        }\r\n        input, .dropdown-toggle, textarea {\r\n            cursor: move;\r\n            width: 100%;\r\n            height: 100%;\r\n            padding-top: 12px;\r\n            padding-left: 0.75rem;\r\n            padding-right: 0.75rem;\r\n            border-radius: 2px;\r\n            font-size: 16px;\r\n            background-color: rgba(255, 255, 255, 0.9);\r\n            box-sizing: border-box;\r\n            -moz-appearance: none !important;\r\n            -webkit-appearance: none !important;\r\n            border: 1px solid #787878;\r\n            &.g-touched.g-invalid {\r\n                border: 1px solid;\r\n                border-radius: 2px;\r\n            }\r\n            &.g-touched, &.g-valid, &:focus {\r\n                background-color: rgba(255, 255, 255, 0.9);\r\n            }\r\n            &.g-touched, &.g-valid {\r\n                ~span {\r\n                    font-size: 12px;\r\n                    opacity: .85;\r\n                }\r\n            }\r\n            &:focus {\r\n                outline: none;\r\n                ~span {\r\n                    font-size: 12px;\r\n                    opacity: .85;\r\n                }\r\n            }\r\n        }\r\n\r\n        .dropdown-toggle {\r\n            &.g-touched, &.g-valid {\r\n                ~span {\r\n                    top: 15%;\r\n                }\r\n            }\r\n            &:focus {\r\n                outline: none;\r\n                ~span {\r\n                    top: 15%;\r\n                }\r\n            }\r\n\r\n            h1, h2, h3, h4, h5, h6 {\r\n                margin: 0;\r\n            }\r\n        }\r\n\r\n        input {\r\n            &.g-touched, &.g-valid {\r\n                ~span {\r\n                    top: 20%;\r\n                }\r\n            }\r\n            &:focus {\r\n                outline: none;\r\n                ~span {\r\n                    top: 20%;\r\n                }\r\n            }\r\n        }\r\n    }\r\n\r\n    .resize {\r\n        position: absolute;\r\n        cursor: w-resize;\r\n\r\n        &.right {\r\n            top: 0;\r\n            bottom: 0;\r\n            right: -4px;\r\n            width: 8px;\r\n        }\r\n\r\n        &.left {\r\n            top: 0;\r\n            bottom: 0;\r\n            width: 8px;\r\n            left: -4px;\r\n        }\r\n\r\n        &.top {\r\n            left: 0;\r\n            right: 0;\r\n            height: 8px;\r\n            top: -4px;\r\n        }\r\n\r\n        &.bottom {\r\n            left: 0;\r\n            right: 0;\r\n            height: 8px;\r\n            bottom: -4px;\r\n        }\r\n\r\n        &.top-right {\r\n            top: -4px;\r\n            right: -4px;\r\n            width: 8px;\r\n            height: 8px;\r\n        }\r\n\r\n        &.top-left {\r\n            top: -4px;\r\n            left: -4px;\r\n            width: 8px;\r\n            height: 8px;\r\n        }\r\n\r\n        &.bottom-right {\r\n            bottom: -4px;\r\n            right: -4px;\r\n            width: 8px;\r\n            height: 8px;\r\n        }\r\n\r\n        &.bottom-left {\r\n            bottom: -4px;\r\n            left: -4px;\r\n            width: 8px;\r\n            height: 8px;\r\n        }\r\n    }\r\n}"],"sourceRoot":""}]);



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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9jbGllbnQvZW5naW5lL3NyYy9jb21wb25lbnRzL2l0ZW0vaXRlbS5jb21wb25lbnQuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L2VuZ2luZS9hc3NldHMvc3R5bGUvY29tcG9uZW50cy9pdGVtL2l0ZW0uc2NzcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvZW5naW5lL2Fzc2V0cy9zdHlsZS9jb21wb25lbnRzL2l0ZW0vaXRlbS5zY3NzPzgyMjkiXSwibmFtZXMiOlsibWFwU3RhdGVUb1Byb3BzIiwic3RhdGUiLCJtYXBEaXNwYXRjaFRvUHJvcHMiLCJkaXNwYXRjaCIsInVwZGF0ZVByb2plY3QiLCJwYXlsb2FkIiwidXBkYXRlUHJvamVjdEl0ZW1zIiwidXBkYXRlUHJvamVjdENvbmZpZyIsImRlZmF1bHRJdGVtQ29udGFpbmVyQ2xhc3NOYW1lIiwiX3Jlc2l6ZVR5cGVzIiwicmlnaHRfb25seSIsImxlZnRfb25seSIsInRvcF9vbmx5IiwiYm90dG9tX29ubHkiLCJ0b3BfcmlnaHQiLCJ0b3BfbGVmdCIsImJvdHRvbV9yaWdodCIsImJvdHRvbV9sZWZ0IiwiSXRlbUNvbXBvbmVudCIsIkNvbXBvbmVudCIsImNvbnN0cnVjdG9yIiwicHJvcHMiLCJ3b3Jrc3BhY2UiLCJzdG9yZSIsImdldFN0YXRlIiwicHJvamVjdCIsImhhbmRsZVJlYWRPbmx5VmFsdWVDaGFuZ2VkIiwiYmluZCIsImhhbmRsZUl0ZW1Db250YWluZXJDbGljayIsImhhbmRsZU91dHNpZGVDbGljayIsImRyYWciLCJoYW5kbGVEcmFnU3RhcnQiLCJoYW5kbGVEcmFnIiwiaGFuZGxlRHJhZ0VuZCIsIm1vdXNlbW92ZSIsImhhbmRsZUtleURvd24iLCJoYW5kbGVNb3VzZUVudGVyIiwiaGFuZGxlTW91c2VMZWF2ZSIsInJlbW92ZUl0ZW0iLCJoYW5kbGVSZXNpemVNb3VzZURvd24iLCJoYW5kbGVSZXNpemVNb3VzZU1vdmUiLCJoYW5kbGVSZXNpemVNb3VzZVVwIiwiaW5mbyIsIml0ZW1zIiwidWlkIiwiaXRlbUNvbnRhaW5lckNsYXNzTmFtZSIsInJlYWRPbmx5VmFsdWUiLCJkcmFnZ2FibGUiLCJjb21wb25lbnRXaWxsTW91bnQiLCJkb2N1bWVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJjb21wb25lbnREaWRNb3VudCIsImRyYWdJbWciLCJJbWFnZSIsInNyYyIsImNvbXBvbmVudFdpbGxVbm1vdW50IiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsIm1vdXNlbW91dmUiLCJpc1Jlc2l6ZVRhcmdldCIsImUiLCJyZXNpemVUb3AiLCJjb250YWlucyIsInRhcmdldCIsInJlc2l6ZVJpZ2h0IiwicmVzaXplQm90dG9tIiwicmVzaXplTGVmdCIsInJlc2l6ZVRvcFJpZ2h0IiwicmVzaXplVG9wTGVmdCIsInJlc2l6ZUJvdHRvbVJpZ2h0IiwicmVzaXplQm90dG9tTGVmdCIsInNldFN0YXRlIiwiT2JqZWN0IiwiYXNzaWduIiwidmFsdWUiLCJpdGVtIiwiaGFzRm9jdXMiLCJjdXJyZW50X3oiLCJ6IiwidG9wX3oiLCJrZXkiLCJkYXRhVHJhbnNmZXIiLCJzZXREcmFnSW1hZ2UiLCJzdHlsZSIsImN1cnNvciIsImNvbnRhaW5lciIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsImRyYWdnaW5nIiwiZHJhZ09mZnNldFgiLCJ4IiwiY2xpZW50WCIsImxlZnQiLCJkcmFnT2Zmc2V0WSIsInkiLCJjbGllbnRZIiwidG9wIiwiY29uZmlnIiwidWkiLCJnX2NsYXNzX2xpc3QiLCJwYXRoIiwiZGlzcGF0Y2hFdmVudCIsIkN1c3RvbUV2ZW50IiwiYnViYmxlcyIsImRldGFpbCIsIndvcmtzcGFjZV9pZCIsImlkIiwiZGVmYXVsdFdpZHRoIiwiY2VsbFdpZHRoIiwiZGVmYXVsdEhlaWdodCIsImNlbGxIZWlnaHQiLCJNYXRoIiwiZmxvb3IiLCJyZWN0IiwiaXRlbU9mZnNldExlZnQiLCJ3aWR0aCIsIml0ZW1PZmZzZXRUb3AiLCJoZWlnaHQiLCJ2aWV3V2lkdGgiLCJ2aWV3SGVpZ2h0Iiwic2F2ZSIsImtleUNvZGUiLCJwcmV2ZW50RGVmYXVsdCIsInVwZGF0ZWRfd29ya3NwYWNlIiwiaG92ZXIiLCJzdG9wUHJvcGFnYXRpb24iLCJyZXNpemVUeXBlIiwiaXRlbVdpZHRoIiwiaXRlbUhlaWdodCIsInN0YXJ0Q2xpZW50WCIsInN0YXJ0Q2xpZW50WSIsInJlbmRlciIsInJlc2l6ZSIsIlRhZ05hbWUiLCJ0YWciLCJuYW1lIiwiaW5uZXJWYWx1ZSIsInRhZ0NsYXNzTmFtZSIsImRlZmF1bHRUYWdDbGFzc05hbWUiLCJsZW5ndGgiLCJ0eXBlIiwidG9Mb3dlckNhc2UiLCJyZXBsYWNlIiwiekluZGV4IiwiY2FsbCIsInJpZ2h0IiwiYm90dG9tIiwiSXRlbSIsImNvbm5lY3QiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7QUFFQSxNQUFNQSxlQUFlLEdBQUlDLEtBQUQsSUFBV0EsS0FBbkM7O0FBQ0EsTUFBTUMsa0JBQWtCLEdBQUlDLFFBQUQsSUFBYztBQUNyQyxTQUFPO0FBQ0hDLGlCQUFhLEVBQUVDLE9BQU8sSUFBSUYsUUFBUSxDQUFDQyxpRkFBYSxDQUFDQyxPQUFELENBQWQsQ0FEL0I7QUFFSEMsc0JBQWtCLEVBQUVELE9BQU8sSUFBSUYsUUFBUSxDQUFDRyxzRkFBa0IsQ0FBQ0QsT0FBRCxDQUFuQixDQUZwQztBQUdIRSx1QkFBbUIsRUFBRUYsT0FBTyxJQUFJRixRQUFRLENBQUNJLHVGQUFtQixDQUFDRixPQUFELENBQXBCO0FBSHJDLEdBQVA7QUFLSCxDQU5EOztBQVFBLE1BQU1HLDZCQUE2QixHQUFHLGdCQUF0QztBQUNBLE1BQU1DLFlBQVksR0FBRztBQUNqQkMsWUFBVSxFQUFFLENBREs7QUFFakJDLFdBQVMsRUFBRSxDQUZNO0FBR2pCQyxVQUFRLEVBQUUsQ0FITztBQUlqQkMsYUFBVyxFQUFFLENBSkk7QUFLakJDLFdBQVMsRUFBRSxDQUxNO0FBTWpCQyxVQUFRLEVBQUUsQ0FOTztBQU9qQkMsY0FBWSxFQUFFLENBUEc7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Qjs7Ozs7Ozs7Ozs7Ozs7QUNEbmxaLGNBQWMsbUJBQU8sQ0FBQyw2SkFBa0o7O0FBRXhLLDRDQUE0QyxRQUFTOztBQUVyRDtBQUNBOzs7O0FBSUEsZUFBZTs7QUFFZjtBQUNBOztBQUVBLGFBQWEsbUJBQU8sQ0FBQywwRUFBK0Q7O0FBRXBGOztBQUVBLEdBQUcsS0FBVSxFQUFFLEUiLCJmaWxlIjoiYnVpbGQvOC5hZGZmNjk4MTI5YjU5MDE5ZWM3ZC5jaHVuay5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQgfSBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCc7XHJcbmltcG9ydCB7IHN0b3JlIH0gZnJvbSAnLi4vLi4vY29uZmlnL3JlZHV4L3JlZHV4LnN0b3JlJztcclxuaW1wb3J0IHsgdXBkYXRlUHJvamVjdCwgdXBkYXRlUHJvamVjdEl0ZW1zLCB1cGRhdGVQcm9qZWN0Q29uZmlnIH0gZnJvbSAnLi4vLi4vY29uZmlnL3JlZHV4L3JlZHV4LmFjdGlvbnMnO1xyXG5cclxuaW1wb3J0ICcuLi8uLi8uLi9hc3NldHMvc3R5bGUvY29tcG9uZW50cy9pdGVtL2l0ZW0uc2Nzcyc7XHJcblxyXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSAoc3RhdGUpID0+IHN0YXRlO1xyXG5jb25zdCBtYXBEaXNwYXRjaFRvUHJvcHMgPSAoZGlzcGF0Y2gpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdXBkYXRlUHJvamVjdDogcGF5bG9hZCA9PiBkaXNwYXRjaCh1cGRhdGVQcm9qZWN0KHBheWxvYWQpKSxcclxuICAgICAgICB1cGRhdGVQcm9qZWN0SXRlbXM6IHBheWxvYWQgPT4gZGlzcGF0Y2godXBkYXRlUHJvamVjdEl0ZW1zKHBheWxvYWQpKSxcclxuICAgICAgICB1cGRhdGVQcm9qZWN0Q29uZmlnOiBwYXlsb2FkID0+IGRpc3BhdGNoKHVwZGF0ZVByb2plY3RDb25maWcocGF5bG9hZCkpXHJcbiAgICB9O1xyXG59O1xyXG5cclxuY29uc3QgZGVmYXVsdEl0ZW1Db250YWluZXJDbGFzc05hbWUgPSAnaXRlbS1jb250YWluZXInO1xyXG5jb25zdCBfcmVzaXplVHlwZXMgPSB7XHJcbiAgICByaWdodF9vbmx5OiAwLFxyXG4gICAgbGVmdF9vbmx5OiAxLFxyXG4gICAgdG9wX29ubHk6IDIsXHJcbiAgICBib3R0b21fb25seTogMyxcclxuICAgIHRvcF9yaWdodDogNCxcclxuICAgIHRvcF9sZWZ0OiA1LFxyXG4gICAgYm90dG9tX3JpZ2h0OiA2LFxyXG4gICAgYm90dG9tX2xlZnQ6IDdcclxufTtcclxuXHJcbmNsYXNzIEl0ZW1Db21wb25lbnQgZXh0ZW5kcyBDb21wb25lbnQge1xyXG4gICAgZHJhZ2dpbmcgPSBmYWxzZTtcclxuICAgIGRyYWdPZmZzZXRYID0gMDtcclxuICAgIGRyYWdPZmZzZXRZID0gMDtcclxuICAgIGRlZmF1bHRUYWdDbGFzc05hbWUgPSAnZy1ib3JkZXItY29sb3InO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG5cclxuICAgICAgICBjb25zdCB7IHdvcmtzcGFjZSB9ID0gc3RvcmUuZ2V0U3RhdGUoKTtcclxuICAgICAgICBjb25zdCBwcm9qZWN0ID0gd29ya3NwYWNlLnByb2plY3Q7XHJcblxyXG4gICAgICAgIHRoaXMuaGFuZGxlUmVhZE9ubHlWYWx1ZUNoYW5nZWQgPSB0aGlzLmhhbmRsZVJlYWRPbmx5VmFsdWVDaGFuZ2VkLmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVJdGVtQ29udGFpbmVyQ2xpY2sgPSB0aGlzLmhhbmRsZUl0ZW1Db250YWluZXJDbGljay5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlT3V0c2lkZUNsaWNrID0gdGhpcy5oYW5kbGVPdXRzaWRlQ2xpY2suYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLmRyYWcgPSB0aGlzLmRyYWcuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLmhhbmRsZURyYWdTdGFydCA9IHRoaXMuaGFuZGxlRHJhZ1N0YXJ0LmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVEcmFnID0gdGhpcy5oYW5kbGVEcmFnLmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVEcmFnRW5kID0gdGhpcy5oYW5kbGVEcmFnRW5kLmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5tb3VzZW1vdmUgPSB0aGlzLm1vdXNlbW92ZS5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlS2V5RG93biA9IHRoaXMuaGFuZGxlS2V5RG93bi5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlTW91c2VFbnRlciA9IHRoaXMuaGFuZGxlTW91c2VFbnRlci5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlTW91c2VMZWF2ZSA9IHRoaXMuaGFuZGxlTW91c2VMZWF2ZS5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMucmVtb3ZlSXRlbSA9IHRoaXMucmVtb3ZlSXRlbS5iaW5kKHRoaXMpO1xyXG5cclxuICAgICAgICB0aGlzLmhhbmRsZVJlc2l6ZU1vdXNlRG93biA9IHRoaXMuaGFuZGxlUmVzaXplTW91c2VEb3duLmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVSZXNpemVNb3VzZU1vdmUgPSB0aGlzLmhhbmRsZVJlc2l6ZU1vdXNlTW92ZS5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlUmVzaXplTW91c2VVcCA9IHRoaXMuaGFuZGxlUmVzaXplTW91c2VVcC5iaW5kKHRoaXMpO1xyXG5cclxuICAgICAgICB0aGlzLnN0YXRlID0ge1xyXG4gICAgICAgICAgICBpbmZvOiBwcm9qZWN0Lml0ZW1zW3RoaXMucHJvcHMudWlkXSxcclxuICAgICAgICAgICAgaXRlbUNvbnRhaW5lckNsYXNzTmFtZTogZGVmYXVsdEl0ZW1Db250YWluZXJDbGFzc05hbWUsXHJcbiAgICAgICAgICAgIHJlYWRPbmx5VmFsdWU6ICcnLFxyXG4gICAgICAgICAgICBkcmFnZ2FibGU6IHRydWVcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIGNvbXBvbmVudFdpbGxNb3VudCgpIHtcclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLmhhbmRsZU91dHNpZGVDbGljaywgZmFsc2UpO1xyXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMubW91c2Vtb3ZlLCBmYWxzZSk7XHJcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMuaGFuZGxlS2V5RG93biwgZmFsc2UpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xyXG4gICAgICAgIHRoaXMuZHJhZ0ltZyA9IG5ldyBJbWFnZSgwLDApO1xyXG4gICAgICAgIHRoaXMuZHJhZ0ltZy5zcmMgPSAnZGF0YTppbWFnZS9naWY7YmFzZTY0LFIwbEdPRGxoQVFBQkFJQUFBQUFBQVAvLy95SDVCQUVBQUFBQUxBQUFBQUFCQUFFQUFBSUJSQUE3JztcclxuICAgIH1cclxuXHJcbiAgICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcclxuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLmhhbmRsZU91dHNpZGVDbGljaywgZmFsc2UpO1xyXG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMubW91c2Vtb3V2ZSwgZmFsc2UpO1xyXG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLmhhbmRsZUtleURvd24sIGZhbHNlKTtcclxuICAgIH1cclxuXHJcbiAgICBpc1Jlc2l6ZVRhcmdldChlKSB7XHJcbiAgICAgICAgcmV0dXJuICh0aGlzLnJlc2l6ZVRvcCAmJiB0aGlzLnJlc2l6ZVRvcC5jb250YWlucyhlLnRhcmdldCkpIHx8XHJcbiAgICAgICAgICAgICh0aGlzLnJlc2l6ZVJpZ2h0ICYmIHRoaXMucmVzaXplUmlnaHQuY29udGFpbnMoZS50YXJnZXQpKSB8fCBcclxuICAgICAgICAgICAgKHRoaXMucmVzaXplQm90dG9tICYmIHRoaXMucmVzaXplQm90dG9tLmNvbnRhaW5zKGUudGFyZ2V0KSkgfHwgXHJcbiAgICAgICAgICAgICh0aGlzLnJlc2l6ZUxlZnQgJiYgdGhpcy5yZXNpemVMZWZ0LmNvbnRhaW5zKGUudGFyZ2V0KSkgfHwgXHJcbiAgICAgICAgICAgICh0aGlzLnJlc2l6ZVRvcFJpZ2h0ICYmIHRoaXMucmVzaXplVG9wUmlnaHQuY29udGFpbnMoZS50YXJnZXQpKSB8fCBcclxuICAgICAgICAgICAgKHRoaXMucmVzaXplVG9wTGVmdCAmJiB0aGlzLnJlc2l6ZVRvcExlZnQuY29udGFpbnMoZS50YXJnZXQpKSB8fFxyXG4gICAgICAgICAgICAodGhpcy5yZXNpemVCb3R0b21SaWdodCAmJiB0aGlzLnJlc2l6ZUJvdHRvbVJpZ2h0LmNvbnRhaW5zKGUudGFyZ2V0KSkgfHwgXHJcbiAgICAgICAgICAgICh0aGlzLnJlc2l6ZUJvdHRvbUxlZnQgJiYgdGhpcy5yZXNpemVCb3R0b21MZWZ0LmNvbnRhaW5zKGUudGFyZ2V0KSk7XHJcbiAgICAgICAgICAgIFxyXG5cclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVSZWFkT25seVZhbHVlQ2hhbmdlZChlKSB7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZShPYmplY3QuYXNzaWduKHt9LCB0aGlzLnN0YXRlLCB7XHJcbiAgICAgICAgICAgIHJlYWRPbmx5VmFsdWU6IGUudGFyZ2V0LnZhbHVlXHJcbiAgICAgICAgfSkpO1xyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZU91dHNpZGVDbGljayhlKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaXRlbS5jb250YWlucyhlLnRhcmdldCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZShPYmplY3QuYXNzaWduKHt9LCB0aGlzLnN0YXRlLCB7XHJcbiAgICAgICAgICAgIGhhc0ZvY3VzOiBmYWxzZSxcclxuICAgICAgICAgICAgaXRlbUNvbnRhaW5lckNsYXNzTmFtZTogZGVmYXVsdEl0ZW1Db250YWluZXJDbGFzc05hbWVcclxuICAgICAgICB9KSk7XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlSXRlbUNvbnRhaW5lckNsaWNrKCkge1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5zdGF0ZSwge1xyXG4gICAgICAgICAgICBoYXNGb2N1czogdHJ1ZSxcclxuICAgICAgICAgICAgaXRlbUNvbnRhaW5lckNsYXNzTmFtZTogZGVmYXVsdEl0ZW1Db250YWluZXJDbGFzc05hbWUgKyAnIGZvY3VzJ1xyXG4gICAgICAgIH0pKTtcclxuXHJcbiAgICAgICAgY29uc3QgeyB3b3Jrc3BhY2UgfSA9IHN0b3JlLmdldFN0YXRlKCk7XHJcbiAgICAgICAgdmFyIGl0ZW1zID0gd29ya3NwYWNlLnByb2plY3QuaXRlbXM7XHJcblxyXG4gICAgICAgIGlmIChpdGVtc1t0aGlzLnByb3BzLnVpZF0pIHtcclxuICAgICAgICAgICAgY29uc3QgY3VycmVudF96ID0gaXRlbXNbdGhpcy5wcm9wcy51aWRdLno7XHJcbiAgICAgICAgICAgIHZhciB0b3BfeiA9IGN1cnJlbnRfejtcclxuICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIGl0ZW1zKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoa2V5ICE9PSB0aGlzLnByb3BzLnVpZCAmJiBpdGVtc1trZXldLnogPiBjdXJyZW50X3opIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbXNba2V5XS56ID4gdG9wX3opIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdG9wX3ogPSBpdGVtc1trZXldLno7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zW2tleV0ueiAtPSAxO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGl0ZW1zW3RoaXMucHJvcHMudWlkXS56ID0gdG9wX3o7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnByb3BzLnVwZGF0ZVByb2plY3RJdGVtcyhpdGVtcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZURyYWdTdGFydChlKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNSZXNpemVUYXJnZXQoZSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5oYW5kbGVJdGVtQ29udGFpbmVyQ2xpY2soKTtcclxuXHJcbiAgICAgICAgZS5kYXRhVHJhbnNmZXIuc2V0RHJhZ0ltYWdlKHRoaXMuZHJhZ0ltZywgMCwgMCk7XHJcbiAgICAgICAgZS50YXJnZXQuc3R5bGUuY3Vyc29yID0gJ21vdmUnO1xyXG5cclxuICAgICAgICBjb25zdCB7IHdvcmtzcGFjZSB9ID0gc3RvcmUuZ2V0U3RhdGUoKTtcclxuICAgICAgICBjb25zdCBjb250YWluZXIgPSB3b3Jrc3BhY2UucHJvamVjdC5jb250YWluZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICAgICAgY29uc3QgaXRlbSA9IHdvcmtzcGFjZS5wcm9qZWN0Lml0ZW1zW3RoaXMucHJvcHMudWlkXTtcclxuXHJcbiAgICAgICAgdGhpcy5kcmFnZ2luZyA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5kcmFnT2Zmc2V0WCA9IGl0ZW0ueCAtIChlLmNsaWVudFggLSBjb250YWluZXIubGVmdCk7XHJcbiAgICAgICAgdGhpcy5kcmFnT2Zmc2V0WSA9IGl0ZW0ueSAtIChlLmNsaWVudFkgLSBjb250YWluZXIudG9wKTtcclxuXHJcbiAgICAgICAgdGhpcy5wcm9wcy51cGRhdGVQcm9qZWN0Q29uZmlnKE9iamVjdC5hc3NpZ24oe30sIHdvcmtzcGFjZS5wcm9qZWN0LmNvbmZpZywge1xyXG4gICAgICAgICAgICB1aTogT2JqZWN0LmFzc2lnbih7fSwgd29ya3NwYWNlLnByb2plY3QuY29uZmlnLnVpLCB7XHJcbiAgICAgICAgICAgICAgICBnX2NsYXNzX2xpc3Q6ICdnaWQgaGlkZGVuJ1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0pKTtcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVEcmFnKGUpIHtcclxuICAgICAgICB0aGlzLmRyYWcoZSk7XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlRHJhZ0VuZChlKSB7XHJcbiAgICAgICAgdmFyIGluZm8gPSB0aGlzLmRyYWcoZSk7XHJcbiAgICAgICAgY29uc3QgeyB3b3Jrc3BhY2UgfSA9IHN0b3JlLmdldFN0YXRlKCk7XHJcblxyXG4gICAgICAgIHRoaXMuZHJhZ2dpbmcgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgdGhpcy5wcm9wcy51cGRhdGVQcm9qZWN0Q29uZmlnKE9iamVjdC5hc3NpZ24oe30sIHdvcmtzcGFjZS5wcm9qZWN0LmNvbmZpZywge1xyXG4gICAgICAgICAgICB1aTogT2JqZWN0LmFzc2lnbih7fSwgd29ya3NwYWNlLnByb2plY3QuY29uZmlnLnVpLCB7XHJcbiAgICAgICAgICAgICAgICBnX2NsYXNzX2xpc3Q6ICdnaWQnXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSkpO1xyXG5cclxuICAgICAgICB0aGlzLnByb3BzLnVwZGF0ZVByb2plY3Qoe1xyXG4gICAgICAgICAgICBwYXRoOiB0aGlzLnByb3BzLnVpZCxcclxuICAgICAgICAgICAgdmFsdWU6IGluZm9cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5pdGVtLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdzZi53b3Jrc3BhY2UucHJvamVjdC51cGRhdGUnLCB7XHJcbiAgICAgICAgICAgIGJ1YmJsZXM6IHRydWUsXHJcbiAgICAgICAgICAgIGRldGFpbDogeyBcclxuICAgICAgICAgICAgICAgIHdvcmtzcGFjZV9pZDogd29ya3NwYWNlLmlkLFxyXG4gICAgICAgICAgICAgICAgcHJvamVjdDogd29ya3NwYWNlLnByb2plY3QgXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KSk7XHJcbiAgICB9XHJcblxyXG4gICAgZHJhZyhlKSB7XHJcbiAgICAgICAgY29uc3QgeyB3b3Jrc3BhY2UgfSA9IHN0b3JlLmdldFN0YXRlKCk7XHJcbiAgICAgICAgY29uc3QgY29uZmlnID0gd29ya3NwYWNlLnByb2plY3QuY29uZmlnO1xyXG4gICAgICAgIGNvbnN0IGNvbnRhaW5lciA9IHdvcmtzcGFjZS5wcm9qZWN0LmNvbnRhaW5lci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgICAgICBjb25zdCBkZWZhdWx0V2lkdGggPSB3b3Jrc3BhY2UucHJvamVjdC5jb25maWcuY2VsbFdpZHRoO1xyXG4gICAgICAgIGNvbnN0IGRlZmF1bHRIZWlnaHQgPSB3b3Jrc3BhY2UucHJvamVjdC5jb25maWcuY2VsbEhlaWdodDtcclxuXHJcbiAgICAgICAgY29uc3QgeCA9IE1hdGguZmxvb3IoKGUuY2xpZW50WCAtIChjb250YWluZXIubGVmdCAtIHRoaXMuZHJhZ09mZnNldFgpKSAvIGRlZmF1bHRXaWR0aCkgKiBkZWZhdWx0V2lkdGg7XHJcbiAgICAgICAgY29uc3QgeSA9IE1hdGguZmxvb3IoKGUuY2xpZW50WSAtIChjb250YWluZXIudG9wIC0gdGhpcy5kcmFnT2Zmc2V0WSkpIC8gZGVmYXVsdEhlaWdodCkgKiBkZWZhdWx0SGVpZ2h0O1xyXG4gICAgICAgIFxyXG4gICAgICAgIHZhciBsZWZ0ID0geCA+IDAgPyB4IDogMDtcclxuICAgICAgICB2YXIgdG9wID0geSA+IDAgPyB5IDogMDtcclxuXHJcbiAgICAgICAgY29uc3QgcmVjdCA9IHRoaXMuaXRlbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgICAgICBjb25zdCBpdGVtT2Zmc2V0TGVmdCA9IGxlZnQgKyByZWN0LndpZHRoO1xyXG4gICAgICAgIGNvbnN0IGl0ZW1PZmZzZXRUb3AgPSB0b3AgKyByZWN0LmhlaWdodDtcclxuXHJcbiAgICAgICAgaWYgKGl0ZW1PZmZzZXRMZWZ0ID49IGNvbmZpZy52aWV3V2lkdGgpIHtcclxuICAgICAgICAgICAgbGVmdCA9IE1hdGguZmxvb3IoKGNvbmZpZy52aWV3V2lkdGggLSByZWN0LndpZHRoKSAvIGRlZmF1bHRXaWR0aCkgKiBkZWZhdWx0V2lkdGg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoaXRlbU9mZnNldFRvcCA+PSBjb25maWcudmlld0hlaWdodCkge1xyXG4gICAgICAgICAgICB0b3AgPSBNYXRoLmZsb29yKChjb25maWcudmlld0hlaWdodCAtIHJlY3QuaGVpZ2h0KSAvIGRlZmF1bHRIZWlnaHQpICogZGVmYXVsdEhlaWdodDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGluZm8gPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLnN0YXRlLmluZm8sIHtcclxuICAgICAgICAgICAgeDogbGVmdCxcclxuICAgICAgICAgICAgeTogdG9wXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5zdGF0ZSwge1xyXG4gICAgICAgICAgICBpbmZvXHJcbiAgICAgICAgfSkpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiBpbmZvO1xyXG4gICAgfVxyXG5cclxuICAgIG1vdXNlbW92ZShlKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZHJhZ2dpbmcpIHtcclxuICAgICAgICAgICAgZS50YXJnZXQuc3R5bGUuY3Vyc29yID0gJ21vdmUnO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVLZXlEb3duKGUpIHtcclxuICAgICAgICBpZiAoIXRoaXMuc3RhdGUuaGFzRm9jdXMpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgcmVjdCA9IHRoaXMuaXRlbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgICAgICBjb25zdCB7IHdvcmtzcGFjZSB9ID0gc3RvcmUuZ2V0U3RhdGUoKTtcclxuICAgICAgICBjb25zdCBjb250YWluZXIgPSB3b3Jrc3BhY2UucHJvamVjdC5jb250YWluZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICAgICAgdmFyIGluZm8gPSB0aGlzLnN0YXRlLmluZm87XHJcblxyXG4gICAgICAgIHZhciBzYXZlID0gZmFsc2U7XHJcbiAgICAgICAgdmFyIHgsIHk7XHJcbiAgICAgICAgc3dpdGNoIChlLmtleUNvZGUpIHtcclxuICAgICAgICAgICAgY2FzZSAzNzogLy8gbGVmdFxyXG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgeCA9IGluZm8ueCAtIHdvcmtzcGFjZS5wcm9qZWN0LmNvbmZpZy5jZWxsV2lkdGg7XHJcbiAgICAgICAgICAgICAgICBpZiAoeCA+PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5mby54ID0geDtcclxuICAgICAgICAgICAgICAgICAgICBzYXZlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIDM4OiAvLyB1cFxyXG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgeSA9IGluZm8ueSAtIHdvcmtzcGFjZS5wcm9qZWN0LmNvbmZpZy5jZWxsSGVpZ2h0O1xyXG4gICAgICAgICAgICAgICAgaWYgKHkgPj0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGluZm8ueSA9IHk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2F2ZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAzOTogLy8gcmlnaHRcclxuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgIHggPSBpbmZvLnggKyB3b3Jrc3BhY2UucHJvamVjdC5jb25maWcuY2VsbFdpZHRoO1xyXG4gICAgICAgICAgICAgICAgaWYgKCh4ICsgcmVjdC53aWR0aCkgPD0gY29udGFpbmVyLndpZHRoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5mby54ID0geDtcclxuICAgICAgICAgICAgICAgICAgICBzYXZlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIDQwOiAvLyBkb3duXHJcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICB5ID0gaW5mby55ICsgd29ya3NwYWNlLnByb2plY3QuY29uZmlnLmNlbGxIZWlnaHQ7XHJcbiAgICAgICAgICAgICAgICBpZiAoKHkgKyByZWN0LmhlaWdodCkgPD0gY29udGFpbmVyLmhlaWdodCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGluZm8ueSA9IHk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2F2ZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChzYXZlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5zdGF0ZSwge1xyXG4gICAgICAgICAgICAgICAgaW5mb1xyXG4gICAgICAgICAgICB9KSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnByb3BzLnVwZGF0ZVByb2plY3Qoe1xyXG4gICAgICAgICAgICAgICAgcGF0aDogdGhpcy5wcm9wcy51aWQsXHJcbiAgICAgICAgICAgICAgICB2YWx1ZTogaW5mb1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHVwZGF0ZWRfd29ya3NwYWNlID0gc3RvcmUuZ2V0U3RhdGUoKS53b3Jrc3BhY2U7XHJcbiAgICAgICAgICAgIHRoaXMuaXRlbS5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgnc2Yud29ya3NwYWNlLnByb2plY3QudXBkYXRlJywge1xyXG4gICAgICAgICAgICAgICAgYnViYmxlczogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGRldGFpbDogeyBcclxuICAgICAgICAgICAgICAgICAgICB3b3Jrc3BhY2VfaWQ6IHVwZGF0ZWRfd29ya3NwYWNlLmlkLFxyXG4gICAgICAgICAgICAgICAgICAgIHByb2plY3Q6IHVwZGF0ZWRfd29ya3NwYWNlLnByb2plY3QgXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlTW91c2VFbnRlcigpIHtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKE9iamVjdC5hc3NpZ24oe30sIHRoaXMuc3RhdGUsIHtcclxuICAgICAgICAgICAgaG92ZXI6IHRydWVcclxuICAgICAgICB9KSk7XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlTW91c2VMZWF2ZSgpIHtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKE9iamVjdC5hc3NpZ24oe30sIHRoaXMuc3RhdGUsIHtcclxuICAgICAgICAgICAgaG92ZXI6IGZhbHNlXHJcbiAgICAgICAgfSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbW92ZUl0ZW0oZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cclxuICAgICAgICB2YXIgeyB3b3Jrc3BhY2UgfSA9IHN0b3JlLmdldFN0YXRlKCk7XHJcbiAgICAgICAgdmFyIHByb2plY3QgPSB3b3Jrc3BhY2UucHJvamVjdDtcclxuICAgICAgICB2YXIgaXRlbXMgPSBwcm9qZWN0Lml0ZW1zO1xyXG5cclxuICAgICAgICBjb25zdCBjdXJyZW50X3ogPSBpdGVtc1t0aGlzLnByb3BzLnVpZF0uejtcclxuICAgICAgICB2YXIgdG9wX3ogPSBjdXJyZW50X3o7XHJcbiAgICAgICAgZm9yICh2YXIga2V5IGluIGl0ZW1zKSB7XHJcbiAgICAgICAgICAgIGlmIChrZXkgIT09IHRoaXMucHJvcHMudWlkICYmIGl0ZW1zW2tleV0ueiA+IGN1cnJlbnRfeikge1xyXG4gICAgICAgICAgICAgICAgaWYgKGl0ZW1zW2tleV0ueiA+IHRvcF96KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdG9wX3ogPSBpdGVtc1trZXldLno7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpdGVtc1trZXldLnogLT0gMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZGVsZXRlIGl0ZW1zW3RoaXMucHJvcHMudWlkXTtcclxuXHJcbiAgICAgICAgdGhpcy5wcm9wcy51cGRhdGVQcm9qZWN0SXRlbXMoaXRlbXMpO1xyXG5cclxuICAgICAgICBjb25zdCB1cGRhdGVkX3dvcmtzcGFjZSA9IHN0b3JlLmdldFN0YXRlKCkud29ya3NwYWNlO1xyXG4gICAgICAgIHRoaXMuaXRlbS5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgnc2Yud29ya3NwYWNlLnByb2plY3QudXBkYXRlJywge1xyXG4gICAgICAgICAgICBidWJibGVzOiB0cnVlLFxyXG4gICAgICAgICAgICBkZXRhaWw6IHsgXHJcbiAgICAgICAgICAgICAgICB3b3Jrc3BhY2VfaWQ6IHVwZGF0ZWRfd29ya3NwYWNlLmlkLFxyXG4gICAgICAgICAgICAgICAgcHJvamVjdDogdXBkYXRlZF93b3Jrc3BhY2UucHJvamVjdCBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pKTtcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVSZXNpemVNb3VzZURvd24oZSwgcmVzaXplVHlwZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5oYW5kbGVSZXNpemVNb3VzZU1vdmUsIGZhbHNlKTtcclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5oYW5kbGVSZXNpemVNb3VzZVVwLCBmYWxzZSk7XHJcblxyXG4gICAgICAgIGNvbnN0IGl0ZW0gPSB0aGlzLml0ZW0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcblxyXG4gICAgICAgIHRoaXMuaXRlbVdpZHRoID0gaXRlbS53aWR0aDtcclxuICAgICAgICB0aGlzLml0ZW1IZWlnaHQgPSBpdGVtLmhlaWdodDtcclxuICAgICAgICB0aGlzLnN0YXJ0Q2xpZW50WCA9IGUuY2xpZW50WDtcclxuICAgICAgICB0aGlzLnN0YXJ0Q2xpZW50WSA9IGUuY2xpZW50WTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZShPYmplY3QuYXNzaWduKHt9LCB0aGlzLnN0YXRlLCB7XHJcbiAgICAgICAgICAgIGRyYWdnYWJsZTogZmFsc2UsXHJcbiAgICAgICAgICAgIHJlc2l6ZVR5cGVcclxuICAgICAgICB9KSk7XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlUmVzaXplTW91c2VNb3ZlKGUpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnN0YXRlLmRyYWdnYWJsZSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgd2lkdGggPSB0aGlzLml0ZW1XaWR0aDtcclxuICAgICAgICB2YXIgeCA9IHRoaXMuc3RhdGUuaW5mby54O1xyXG5cclxuICAgICAgICBjb25zdCB7IHdvcmtzcGFjZSB9ID0gc3RvcmUuZ2V0U3RhdGUoKTtcclxuICAgICAgICBjb25zdCBjb25maWcgPSB3b3Jrc3BhY2UucHJvamVjdC5jb25maWc7XHJcblxyXG4gICAgICAgIHN3aXRjaCAodGhpcy5zdGF0ZS5yZXNpemVUeXBlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgX3Jlc2l6ZVR5cGVzLnJpZ2h0X29ubHk6XHJcbiAgICAgICAgICAgICAgICB3aWR0aCArPSBlLmNsaWVudFggLSB0aGlzLnN0YXJ0Q2xpZW50WDtcclxuICAgICAgICAgICAgICAgIHdpZHRoID0gTWF0aC5mbG9vcih3aWR0aCAvIGNvbmZpZy5jZWxsV2lkdGgpICogY29uZmlnLmNlbGxXaWR0aDtcclxuICAgICAgICAgICAgICAgIGlmICh4ICsgd2lkdGggPiAoY29uZmlnLnZpZXdXaWR0aCAtICg0ICogY29uZmlnLmNlbGxXaWR0aCkpKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvcHMudXBkYXRlUHJvamVjdENvbmZpZyhPYmplY3QuYXNzaWduKHt9LCBjb25maWcsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmlld1dpZHRoOiB4ICsgd2lkdGggKyAoMTIgKiBjb25maWcuY2VsbFdpZHRoKVxyXG4gICAgICAgICAgICAgICAgICAgIH0pKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIF9yZXNpemVUeXBlcy5sZWZ0X29ubHk6XHJcbiAgICAgICAgICAgICAgICB3aWR0aCAtPSBlLmNsaWVudFggLSB0aGlzLnN0YXJ0Q2xpZW50WDtcclxuICAgICAgICAgICAgICAgIHdpZHRoID0gTWF0aC5mbG9vcih3aWR0aCAvIGNvbmZpZy5jZWxsV2lkdGgpICogY29uZmlnLmNlbGxXaWR0aDtcclxuICAgICAgICAgICAgICAgIHggLT0gd2lkdGggLSB0aGlzLnN0YXRlLmluZm8ud2lkdGg7XHJcbiAgICAgICAgICAgICAgICBpZiAoeCA8IDApIHtcclxuICAgICAgICAgICAgICAgICAgICB4ID0gMDtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBfcmVzaXplVHlwZXMudG9wX29ubHk6XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBfcmVzaXplVHlwZXMuYm90dG9tX29ubHk6XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBfcmVzaXplVHlwZXMudG9wX3JpZ2h0OlxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgX3Jlc2l6ZVR5cGVzLnRvcF9sZWZ0OlxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgX3Jlc2l6ZVR5cGVzLmJvdHRvbV9yaWdodDpcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIF9yZXNpemVUeXBlcy5ib3R0b21fbGVmdDpcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgaW5mbyA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuc3RhdGUuaW5mbywge1xyXG4gICAgICAgICAgICB4LFxyXG4gICAgICAgICAgICB3aWR0aFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnNldFN0YXRlKE9iamVjdC5hc3NpZ24oe30sIHRoaXMuc3RhdGUsIHtcclxuICAgICAgICAgICAgaW5mb1xyXG4gICAgICAgIH0pKTtcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVSZXNpemVNb3VzZVVwKGUpIHtcclxuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLmhhbmRsZVJlc2l6ZU1vdXNlTW92ZSwgZmFsc2UpO1xyXG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLmhhbmRsZVJlc2l6ZU1vdXNlVXAsIGZhbHNlKTtcclxuXHJcbiAgICAgICAgdmFyIGluZm8gPSB0aGlzLnN0YXRlLmluZm87XHJcbiAgICAgICAgY29uc3QgeyB3b3Jrc3BhY2UgfSA9IHN0b3JlLmdldFN0YXRlKCk7XHJcblxyXG4gICAgICAgIHRoaXMucHJvcHMudXBkYXRlUHJvamVjdCh7XHJcbiAgICAgICAgICAgIHBhdGg6IHRoaXMucHJvcHMudWlkLFxyXG4gICAgICAgICAgICB2YWx1ZTogaW5mb1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLml0ZW0uZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ3NmLndvcmtzcGFjZS5wcm9qZWN0LnVwZGF0ZScsIHtcclxuICAgICAgICAgICAgYnViYmxlczogdHJ1ZSxcclxuICAgICAgICAgICAgZGV0YWlsOiB7IFxyXG4gICAgICAgICAgICAgICAgd29ya3NwYWNlX2lkOiB3b3Jrc3BhY2UuaWQsXHJcbiAgICAgICAgICAgICAgICBwcm9qZWN0OiB3b3Jrc3BhY2UucHJvamVjdCBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pKTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLnNldFN0YXRlKE9iamVjdC5hc3NpZ24oe30sIHRoaXMuc3RhdGUsIHtcclxuICAgICAgICAgICAgZHJhZ2dhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICByZXNpemVUeXBlOiBudWxsXHJcbiAgICAgICAgfSkpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuaXRlbVdpZHRoID0gbnVsbDtcclxuICAgICAgICB0aGlzLml0ZW1IZWlnaHQgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuc3RhcnRDbGllbnRYID0gbnVsbDtcclxuICAgICAgICB0aGlzLnN0YXJ0Q2xpZW50WSA9IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHsgaXRlbUNvbnRhaW5lckNsYXNzTmFtZSwgaW5mbywgaG92ZXIsIGhhc0ZvY3VzLCBkcmFnZ2FibGUgfSA9IHRoaXMuc3RhdGU7XHJcbiAgICAgICAgY29uc3QgeyByZXNpemUgfSA9IHRoaXMucHJvcHM7XHJcblxyXG4gICAgICAgIGNvbnN0IFRhZ05hbWUgPSB0aGlzLnByb3BzLnRhZy5uYW1lO1xyXG4gICAgICAgIHZhciB0YWcgPSBudWxsO1xyXG4gICAgICAgIGlmICh0aGlzLnByb3BzLnRhZy5pbm5lclZhbHVlKSB7XHJcbiAgICAgICAgICAgIHRhZyA9ICg8VGFnTmFtZT57dGhpcy5wcm9wcy50YWcudmFsdWV9PC9UYWdOYW1lPik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdmFyIHRhZ0NsYXNzTmFtZSA9IHRoaXMuZGVmYXVsdFRhZ0NsYXNzTmFtZSArICh0aGlzLnN0YXRlLnJlYWRPbmx5VmFsdWUgJiYgdGhpcy5zdGF0ZS5yZWFkT25seVZhbHVlLmxlbmd0aCA/ICcgZy12YWxpZCcgOiAnJyk7XHJcbiAgICAgICAgICAgIHRhZyA9ICg8ZGl2IGNsYXNzTmFtZT1cImlucHV0LWNvbXBvbmVudFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8VGFnTmFtZSBzdHlsZT17e3dpZHRoOiBpbmZvLndpZHRoLCBoZWlnaHQ6IGluZm8uaGVpZ2h0fX0gY2xhc3NOYW1lPXt0YWdDbGFzc05hbWV9IHR5cGU9e3RoaXMucHJvcHMudGFnLnR5cGV9IG5hbWU9e3RoaXMucHJvcHMudGFnLnZhbHVlLnRvTG93ZXJDYXNlKCkucmVwbGFjZSgnICcsICdfJyl9IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e3RoaXMuc3RhdGUucmVhZE9ubHlWYWx1ZX0gb25DaGFuZ2U9e3RoaXMuaGFuZGxlUmVhZE9ubHlWYWx1ZUNoYW5nZWR9PjwvVGFnTmFtZT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZy1sb2dpbi1mb3JtLWlucHV0LXBsYWNlaG9sZGVyXCI+e3RoaXMucHJvcHMudGFnLnZhbHVlfTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj4pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2IFxyXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtpdGVtQ29udGFpbmVyQ2xhc3NOYW1lfVxyXG4gICAgICAgICAgICAgICAgcmVmPXtpdGVtID0+IHRoaXMuaXRlbSA9IGl0ZW19XHJcbiAgICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLmhhbmRsZUl0ZW1Db250YWluZXJDbGlja31cclxuICAgICAgICAgICAgICAgIGRyYWdnYWJsZT17ZHJhZ2dhYmxlfVxyXG4gICAgICAgICAgICAgICAgb25EcmFnU3RhcnQ9e3RoaXMuaGFuZGxlRHJhZ1N0YXJ0fVxyXG4gICAgICAgICAgICAgICAgb25EcmFnPXt0aGlzLmhhbmRsZURyYWd9XHJcbiAgICAgICAgICAgICAgICBvbkRyYWdFbmQ9e3RoaXMuaGFuZGxlRHJhZ0VuZH1cclxuICAgICAgICAgICAgICAgIG9uTW91c2VFbnRlcj17dGhpcy5oYW5kbGVNb3VzZUVudGVyfVxyXG4gICAgICAgICAgICAgICAgb25Nb3VzZUxlYXZlPXt0aGlzLmhhbmRsZU1vdXNlTGVhdmV9XHJcbiAgICAgICAgICAgICAgICBzdHlsZT17eyBcclxuICAgICAgICAgICAgICAgICAgICB0b3A6IGluZm8ueSwgXHJcbiAgICAgICAgICAgICAgICAgICAgbGVmdDogaW5mby54LFxyXG4gICAgICAgICAgICAgICAgICAgIHpJbmRleDogaW5mby56ICsgMTAwXHJcbiAgICAgICAgICAgICAgICB9fT5cclxuICAgICAgICAgICAgICAgIHt0YWd9XHJcbiAgICAgICAgICAgICAgICB7aG92ZXIgfHwgaGFzRm9jdXMgP1xyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJpdGVtLWFjdGlvbnNcIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNsb3NlLWljb24taXRlbSBzaGFkb3ctbm9uZVwiIG9uQ2xpY2s9e3RoaXMucmVtb3ZlSXRlbX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImNsb3NlLWljb25cIj48L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDogbnVsbH1cclxuICAgICAgICAgICAgICAgIHtyZXNpemUudG9wID8gPGRpdiBzdHlsZT17e3pJbmRleDogaW5mby56ICsgMTAwfX0gcmVmPXtyZXNpemVUb3AgPT4gdGhpcy5yZXNpemVUb3AgPSByZXNpemVUb3B9IGNsYXNzTmFtZT1cInJlc2l6ZSB0b3BcIiBvbk1vdXNlRG93bj17KGUpID0+IHRoaXMuaGFuZGxlUmVzaXplTW91c2VEb3duLmNhbGwodGhpcywgZSwgX3Jlc2l6ZVR5cGVzLnRvcF9vbmx5KX0+PC9kaXY+IDogbnVsbH1cclxuICAgICAgICAgICAgICAgIHtyZXNpemUucmlnaHQgPyA8ZGl2IHN0eWxlPXt7ekluZGV4OiBpbmZvLnogKyAxMDB9fSByZWY9e3Jlc2l6ZVJpZ2h0ID0+IHRoaXMucmVzaXplUmlnaHQgPSByZXNpemVSaWdodH0gY2xhc3NOYW1lPVwicmVzaXplIHJpZ2h0XCIgb25Nb3VzZURvd249eyhlKSA9PiB0aGlzLmhhbmRsZVJlc2l6ZU1vdXNlRG93bi5jYWxsKHRoaXMsIGUsIF9yZXNpemVUeXBlcy5yaWdodF9vbmx5KX0+PC9kaXY+IDogbnVsbH1cclxuICAgICAgICAgICAgICAgIHtyZXNpemUuYm90dG9tID8gPGRpdiBzdHlsZT17e3pJbmRleDogaW5mby56ICsgMTAwfX0gcmVmPXtyZXNpemVCb3R0b20gPT4gdGhpcy5yZXNpemVCb3R0b20gPSByZXNpemVCb3R0b219IGNsYXNzTmFtZT1cInJlc2l6ZSBib3R0b21cIiBvbk1vdXNlRG93bj17KGUpID0+IHRoaXMuaGFuZGxlUmVzaXplTW91c2VEb3duLmNhbGwodGhpcywgZSwgX3Jlc2l6ZVR5cGVzLmJvdHRvbV9vbmx5KX0+PC9kaXY+IDogbnVsbH1cclxuICAgICAgICAgICAgICAgIHtyZXNpemUubGVmdCA/IDxkaXYgc3R5bGU9e3t6SW5kZXg6IGluZm8ueiArIDEwMH19IHJlZj17cmVzaXplTGVmdCA9PiB0aGlzLnJlc2l6ZUxlZnQgPSByZXNpemVMZWZ0fSBjbGFzc05hbWU9XCJyZXNpemUgbGVmdFwiIG9uTW91c2VEb3duPXsoZSkgPT4gdGhpcy5oYW5kbGVSZXNpemVNb3VzZURvd24uY2FsbCh0aGlzLCBlLCBfcmVzaXplVHlwZXMubGVmdF9vbmx5KX0+PC9kaXY+IDogbnVsbH1cclxuICAgICAgICAgICAgICAgIHtyZXNpemUudG9wICYmIHJlc2l6ZS5yaWdodCA/IDxkaXYgc3R5bGU9e3t6SW5kZXg6IGluZm8ueiArIDEwMX19IHJlZj17cmVzaXplVG9wUmlnaHQgPSB0aGlzLnJlc2l6ZVRvcFJpZ2h0ID0gcmVzaXplVG9wUmlnaHR9IG9uTW91c2VEb3duPXsoZSkgPT4gdGhpcy5oYW5kbGVSZXNpemVNb3VzZURvd24uY2FsbCh0aGlzLCBlLCBfcmVzaXplVHlwZXMudG9wX3JpZ2h0KX0+PC9kaXY+IDogbnVsbH1cclxuICAgICAgICAgICAgICAgIHtyZXNpemUudG9wICYmIHJlc2l6ZS5sZWZ0ID8gPGRpdiBzdHlsZT17e3pJbmRleDogaW5mby56ICsgMTAxfX0gcmVmPXtyZXNpemVUb3BMZWZ0ID0gdGhpcy5yZXNpemVUb3BMZWZ0ID0gcmVzaXplVG9wTGVmdH0gb25Nb3VzZURvd249eyhlKSA9PiB0aGlzLmhhbmRsZVJlc2l6ZU1vdXNlRG93bi5jYWxsKHRoaXMsIGUsIF9yZXNpemVUeXBlcy50b3BfbGVmdCl9PjwvZGl2PiA6IG51bGx9XHJcbiAgICAgICAgICAgICAgICB7cmVzaXplLmJvdHRvbSAmJiByZXNpemUucmlnaHQgPyA8ZGl2IHN0eWxlPXt7ekluZGV4OiBpbmZvLnogKyAxMDF9fSByZWY9e3Jlc2l6ZUJvdHRvbVJpZ2h0ID0gdGhpcy5yZXNpemVCb3R0b21SaWdodCA9IHJlc2l6ZUJvdHRvbVJpZ2h0fSBvbk1vdXNlRG93bj17KGUpID0+IHRoaXMuaGFuZGxlUmVzaXplTW91c2VEb3duLmNhbGwodGhpcywgZSwgX3Jlc2l6ZVR5cGVzLmJvdHRvbV9yaWdodCl9PjwvZGl2PiA6IG51bGx9XHJcbiAgICAgICAgICAgICAgICB7cmVzaXplLmJvdHRvbSAmJiByZXNpemUubGVmdCA/IDxkaXYgc3R5bGU9e3t6SW5kZXg6IGluZm8ueiArIDEwMX19IHJlZj17cmVzaXplQm90dG9tTGVmdCA9IHRoaXMucmVzaXplQm90dG9tTGVmdCA9IHJlc2l6ZUJvdHRvbUxlZnR9IG9uTW91c2VEb3duPXsoZSkgPT4gdGhpcy5oYW5kbGVSZXNpemVNb3VzZURvd24uY2FsbCh0aGlzLCBlLCBfcmVzaXplVHlwZXMuYm90dG9tX2xlZnQpfT48L2Rpdj4gOiBudWxsfVxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBJdGVtID0gY29ubmVjdChtYXBTdGF0ZVRvUHJvcHMsIG1hcERpc3BhdGNoVG9Qcm9wcykoSXRlbUNvbXBvbmVudCk7XHJcbmV4cG9ydCBkZWZhdWx0IEl0ZW07IiwiZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIikodHJ1ZSk7XG4vLyBNb2R1bGVcbmV4cG9ydHMucHVzaChbbW9kdWxlLmlkLCBcIi5pdGVtLWNvbnRhaW5lciB7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICBib3JkZXI6IDFweCBzb2xpZCAjNzg3ODc4O1xcbiAgYmFja2dyb3VuZDogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjkpO1xcbiAgcGFkZGluZzogNHB4O1xcbiAgY3Vyc29yOiBtb3ZlOyB9XFxuICAuaXRlbS1jb250YWluZXIgaDEsIC5pdGVtLWNvbnRhaW5lciBoMiwgLml0ZW0tY29udGFpbmVyIGgzLCAuaXRlbS1jb250YWluZXIgaDQsIC5pdGVtLWNvbnRhaW5lciBoNSwgLml0ZW0tY29udGFpbmVyIGg2IHtcXG4gICAgbWFyZ2luOiAwOyB9XFxuICAuaXRlbS1jb250YWluZXIuZm9jdXMge1xcbiAgICBiYWNrZ3JvdW5kOiByZ2JhKDI0MCwgMjQwLCAyNDAsIDAuOSk7IH1cXG4gIC5pdGVtLWNvbnRhaW5lciAuaXRlbS1hY3Rpb25zIHtcXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgICByaWdodDogMXB4O1xcbiAgICB0b3A6IDFweDsgfVxcbiAgICAuaXRlbS1jb250YWluZXIgLml0ZW0tYWN0aW9ucyAuY2xvc2UtaWNvbi1pdGVtIHtcXG4gICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XFxuICAgICAgY3Vyc29yOiBwb2ludGVyO1xcbiAgICAgIGJhY2tncm91bmQ6IHRyYW5zcGFyZW50O1xcbiAgICAgIHBhZGRpbmc6IDJweDtcXG4gICAgICBib3JkZXI6IDA7XFxuICAgICAgaGVpZ2h0OiAxOHB4O1xcbiAgICAgIHdpZHRoOiAxOHB4OyB9XFxuICAgICAgLml0ZW0tY29udGFpbmVyIC5pdGVtLWFjdGlvbnMgLmNsb3NlLWljb24taXRlbSAuY2xvc2UtaWNvbiB7XFxuICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICAgICAgICB0b3A6IDA7XFxuICAgICAgICBsZWZ0OiA3cHg7XFxuICAgICAgICBmb250LXNpemU6IDE0cHg7XFxuICAgICAgICBtYXJnaW4tdG9wOiAtMXB4OyB9XFxuICAuaXRlbS1jb250YWluZXIgLmlucHV0LWNvbXBvbmVudCB7XFxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gICAgd2lkdGg6IDEwMCU7XFxuICAgIG1pbi1oZWlnaHQ6IDM2cHg7XFxuICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMjQ0LCAyNDQsIDI0NCwgMC40KTsgfVxcbiAgICBAbWVkaWEgKG1heC13aWR0aDogNjAwcHgpIHtcXG4gICAgICAuaXRlbS1jb250YWluZXIgLmlucHV0LWNvbXBvbmVudCB7XFxuICAgICAgICBmbG9hdDogbm9uZTtcXG4gICAgICAgIHdpZHRoOiAxMDAlOyB9IH1cXG4gICAgLml0ZW0tY29udGFpbmVyIC5pbnB1dC1jb21wb25lbnQ6bnRoLW9mLXR5cGUoMm4pIHtcXG4gICAgICBmbG9hdDogcmlnaHQ7IH1cXG4gICAgICBAbWVkaWEgKG1heC13aWR0aDogNjAwcHgpIHtcXG4gICAgICAgIC5pdGVtLWNvbnRhaW5lciAuaW5wdXQtY29tcG9uZW50Om50aC1vZi10eXBlKDJuKSB7XFxuICAgICAgICAgIGZsb2F0OiBub25lO1xcbiAgICAgICAgICB3aWR0aDogMTAwJTsgfSB9XFxuICAgIC5pdGVtLWNvbnRhaW5lciAuaW5wdXQtY29tcG9uZW50IHNwYW4ge1xcbiAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gICAgICB0b3A6IDQ1JTtcXG4gICAgICBsZWZ0OiAwLjc1cmVtO1xcbiAgICAgIGNvbG9yOiByZ2JhKDAsIDAsIDAsIDAuOSk7XFxuICAgICAgcG9pbnRlci1ldmVudHM6IG5vbmU7XFxuICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC00MCUpO1xcbiAgICAgIHRyYW5zaXRpb246IC4yNXM7IH1cXG4gICAgICAuaXRlbS1jb250YWluZXIgLmlucHV0LWNvbXBvbmVudCBzcGFuLmlzLWFjdGl2ZSB7XFxuICAgICAgICBmb250LXNpemU6IDEycHg7XFxuICAgICAgICBjb2xvcjogcmdiYSgwLCAwLCAwLCAwLjkpO1xcbiAgICAgICAgb3BhY2l0eTogLjg1OyB9XFxuICAgIC5pdGVtLWNvbnRhaW5lciAuaW5wdXQtY29tcG9uZW50IGlucHV0LCAuaXRlbS1jb250YWluZXIgLmlucHV0LWNvbXBvbmVudCAuZHJvcGRvd24tdG9nZ2xlLCAuaXRlbS1jb250YWluZXIgLmlucHV0LWNvbXBvbmVudCB0ZXh0YXJlYSB7XFxuICAgICAgY3Vyc29yOiBtb3ZlO1xcbiAgICAgIHdpZHRoOiAxMDAlO1xcbiAgICAgIGhlaWdodDogMTAwJTtcXG4gICAgICBwYWRkaW5nLXRvcDogMTJweDtcXG4gICAgICBwYWRkaW5nLWxlZnQ6IDAuNzVyZW07XFxuICAgICAgcGFkZGluZy1yaWdodDogMC43NXJlbTtcXG4gICAgICBib3JkZXItcmFkaXVzOiAycHg7XFxuICAgICAgZm9udC1zaXplOiAxNnB4O1xcbiAgICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC45KTtcXG4gICAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xcbiAgICAgIC1tb3otYXBwZWFyYW5jZTogbm9uZSAhaW1wb3J0YW50O1xcbiAgICAgIC13ZWJraXQtYXBwZWFyYW5jZTogbm9uZSAhaW1wb3J0YW50O1xcbiAgICAgIGJvcmRlcjogMXB4IHNvbGlkICM3ODc4Nzg7IH1cXG4gICAgICAuaXRlbS1jb250YWluZXIgLmlucHV0LWNvbXBvbmVudCBpbnB1dC5nLXRvdWNoZWQuZy1pbnZhbGlkLCAuaXRlbS1jb250YWluZXIgLmlucHV0LWNvbXBvbmVudCAuZHJvcGRvd24tdG9nZ2xlLmctdG91Y2hlZC5nLWludmFsaWQsIC5pdGVtLWNvbnRhaW5lciAuaW5wdXQtY29tcG9uZW50IHRleHRhcmVhLmctdG91Y2hlZC5nLWludmFsaWQge1xcbiAgICAgICAgYm9yZGVyOiAxcHggc29saWQ7XFxuICAgICAgICBib3JkZXItcmFkaXVzOiAycHg7IH1cXG4gICAgICAuaXRlbS1jb250YWluZXIgLmlucHV0LWNvbXBvbmVudCBpbnB1dC5nLXRvdWNoZWQsIC5pdGVtLWNvbnRhaW5lciAuaW5wdXQtY29tcG9uZW50IGlucHV0LmctdmFsaWQsIC5pdGVtLWNvbnRhaW5lciAuaW5wdXQtY29tcG9uZW50IGlucHV0OmZvY3VzLCAuaXRlbS1jb250YWluZXIgLmlucHV0LWNvbXBvbmVudCAuZHJvcGRvd24tdG9nZ2xlLmctdG91Y2hlZCwgLml0ZW0tY29udGFpbmVyIC5pbnB1dC1jb21wb25lbnQgLmRyb3Bkb3duLXRvZ2dsZS5nLXZhbGlkLCAuaXRlbS1jb250YWluZXIgLmlucHV0LWNvbXBvbmVudCAuZHJvcGRvd24tdG9nZ2xlOmZvY3VzLCAuaXRlbS1jb250YWluZXIgLmlucHV0LWNvbXBvbmVudCB0ZXh0YXJlYS5nLXRvdWNoZWQsIC5pdGVtLWNvbnRhaW5lciAuaW5wdXQtY29tcG9uZW50IHRleHRhcmVhLmctdmFsaWQsIC5pdGVtLWNvbnRhaW5lciAuaW5wdXQtY29tcG9uZW50IHRleHRhcmVhOmZvY3VzIHtcXG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC45KTsgfVxcbiAgICAgIC5pdGVtLWNvbnRhaW5lciAuaW5wdXQtY29tcG9uZW50IGlucHV0LmctdG91Y2hlZCB+IHNwYW4sIC5pdGVtLWNvbnRhaW5lciAuaW5wdXQtY29tcG9uZW50IGlucHV0LmctdmFsaWQgfiBzcGFuLCAuaXRlbS1jb250YWluZXIgLmlucHV0LWNvbXBvbmVudCAuZHJvcGRvd24tdG9nZ2xlLmctdG91Y2hlZCB+IHNwYW4sIC5pdGVtLWNvbnRhaW5lciAuaW5wdXQtY29tcG9uZW50IC5kcm9wZG93bi10b2dnbGUuZy12YWxpZCB+IHNwYW4sIC5pdGVtLWNvbnRhaW5lciAuaW5wdXQtY29tcG9uZW50IHRleHRhcmVhLmctdG91Y2hlZCB+IHNwYW4sIC5pdGVtLWNvbnRhaW5lciAuaW5wdXQtY29tcG9uZW50IHRleHRhcmVhLmctdmFsaWQgfiBzcGFuIHtcXG4gICAgICAgIGZvbnQtc2l6ZTogMTJweDtcXG4gICAgICAgIG9wYWNpdHk6IC44NTsgfVxcbiAgICAgIC5pdGVtLWNvbnRhaW5lciAuaW5wdXQtY29tcG9uZW50IGlucHV0OmZvY3VzLCAuaXRlbS1jb250YWluZXIgLmlucHV0LWNvbXBvbmVudCAuZHJvcGRvd24tdG9nZ2xlOmZvY3VzLCAuaXRlbS1jb250YWluZXIgLmlucHV0LWNvbXBvbmVudCB0ZXh0YXJlYTpmb2N1cyB7XFxuICAgICAgICBvdXRsaW5lOiBub25lOyB9XFxuICAgICAgICAuaXRlbS1jb250YWluZXIgLmlucHV0LWNvbXBvbmVudCBpbnB1dDpmb2N1cyB+IHNwYW4sIC5pdGVtLWNvbnRhaW5lciAuaW5wdXQtY29tcG9uZW50IC5kcm9wZG93bi10b2dnbGU6Zm9jdXMgfiBzcGFuLCAuaXRlbS1jb250YWluZXIgLmlucHV0LWNvbXBvbmVudCB0ZXh0YXJlYTpmb2N1cyB+IHNwYW4ge1xcbiAgICAgICAgICBmb250LXNpemU6IDEycHg7XFxuICAgICAgICAgIG9wYWNpdHk6IC44NTsgfVxcbiAgICAuaXRlbS1jb250YWluZXIgLmlucHV0LWNvbXBvbmVudCAuZHJvcGRvd24tdG9nZ2xlLmctdG91Y2hlZCB+IHNwYW4sIC5pdGVtLWNvbnRhaW5lciAuaW5wdXQtY29tcG9uZW50IC5kcm9wZG93bi10b2dnbGUuZy12YWxpZCB+IHNwYW4ge1xcbiAgICAgIHRvcDogMTUlOyB9XFxuICAgIC5pdGVtLWNvbnRhaW5lciAuaW5wdXQtY29tcG9uZW50IC5kcm9wZG93bi10b2dnbGU6Zm9jdXMge1xcbiAgICAgIG91dGxpbmU6IG5vbmU7IH1cXG4gICAgICAuaXRlbS1jb250YWluZXIgLmlucHV0LWNvbXBvbmVudCAuZHJvcGRvd24tdG9nZ2xlOmZvY3VzIH4gc3BhbiB7XFxuICAgICAgICB0b3A6IDE1JTsgfVxcbiAgICAuaXRlbS1jb250YWluZXIgLmlucHV0LWNvbXBvbmVudCAuZHJvcGRvd24tdG9nZ2xlIGgxLCAuaXRlbS1jb250YWluZXIgLmlucHV0LWNvbXBvbmVudCAuZHJvcGRvd24tdG9nZ2xlIGgyLCAuaXRlbS1jb250YWluZXIgLmlucHV0LWNvbXBvbmVudCAuZHJvcGRvd24tdG9nZ2xlIGgzLCAuaXRlbS1jb250YWluZXIgLmlucHV0LWNvbXBvbmVudCAuZHJvcGRvd24tdG9nZ2xlIGg0LCAuaXRlbS1jb250YWluZXIgLmlucHV0LWNvbXBvbmVudCAuZHJvcGRvd24tdG9nZ2xlIGg1LCAuaXRlbS1jb250YWluZXIgLmlucHV0LWNvbXBvbmVudCAuZHJvcGRvd24tdG9nZ2xlIGg2IHtcXG4gICAgICBtYXJnaW46IDA7IH1cXG4gICAgLml0ZW0tY29udGFpbmVyIC5pbnB1dC1jb21wb25lbnQgaW5wdXQuZy10b3VjaGVkIH4gc3BhbiwgLml0ZW0tY29udGFpbmVyIC5pbnB1dC1jb21wb25lbnQgaW5wdXQuZy12YWxpZCB+IHNwYW4ge1xcbiAgICAgIHRvcDogMjAlOyB9XFxuICAgIC5pdGVtLWNvbnRhaW5lciAuaW5wdXQtY29tcG9uZW50IGlucHV0OmZvY3VzIHtcXG4gICAgICBvdXRsaW5lOiBub25lOyB9XFxuICAgICAgLml0ZW0tY29udGFpbmVyIC5pbnB1dC1jb21wb25lbnQgaW5wdXQ6Zm9jdXMgfiBzcGFuIHtcXG4gICAgICAgIHRvcDogMjAlOyB9XFxuICAuaXRlbS1jb250YWluZXIgLnJlc2l6ZSB7XFxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gICAgY3Vyc29yOiB3LXJlc2l6ZTsgfVxcbiAgICAuaXRlbS1jb250YWluZXIgLnJlc2l6ZS5yaWdodCB7XFxuICAgICAgdG9wOiAwO1xcbiAgICAgIGJvdHRvbTogMDtcXG4gICAgICByaWdodDogLTRweDtcXG4gICAgICB3aWR0aDogOHB4OyB9XFxuICAgIC5pdGVtLWNvbnRhaW5lciAucmVzaXplLmxlZnQge1xcbiAgICAgIHRvcDogMDtcXG4gICAgICBib3R0b206IDA7XFxuICAgICAgd2lkdGg6IDhweDtcXG4gICAgICBsZWZ0OiAtNHB4OyB9XFxuICAgIC5pdGVtLWNvbnRhaW5lciAucmVzaXplLnRvcCB7XFxuICAgICAgbGVmdDogMDtcXG4gICAgICByaWdodDogMDtcXG4gICAgICBoZWlnaHQ6IDhweDtcXG4gICAgICB0b3A6IC00cHg7IH1cXG4gICAgLml0ZW0tY29udGFpbmVyIC5yZXNpemUuYm90dG9tIHtcXG4gICAgICBsZWZ0OiAwO1xcbiAgICAgIHJpZ2h0OiAwO1xcbiAgICAgIGhlaWdodDogOHB4O1xcbiAgICAgIGJvdHRvbTogLTRweDsgfVxcbiAgICAuaXRlbS1jb250YWluZXIgLnJlc2l6ZS50b3AtcmlnaHQge1xcbiAgICAgIHRvcDogLTRweDtcXG4gICAgICByaWdodDogLTRweDtcXG4gICAgICB3aWR0aDogOHB4O1xcbiAgICAgIGhlaWdodDogOHB4OyB9XFxuICAgIC5pdGVtLWNvbnRhaW5lciAucmVzaXplLnRvcC1sZWZ0IHtcXG4gICAgICB0b3A6IC00cHg7XFxuICAgICAgbGVmdDogLTRweDtcXG4gICAgICB3aWR0aDogOHB4O1xcbiAgICAgIGhlaWdodDogOHB4OyB9XFxuICAgIC5pdGVtLWNvbnRhaW5lciAucmVzaXplLmJvdHRvbS1yaWdodCB7XFxuICAgICAgYm90dG9tOiAtNHB4O1xcbiAgICAgIHJpZ2h0OiAtNHB4O1xcbiAgICAgIHdpZHRoOiA4cHg7XFxuICAgICAgaGVpZ2h0OiA4cHg7IH1cXG4gICAgLml0ZW0tY29udGFpbmVyIC5yZXNpemUuYm90dG9tLWxlZnQge1xcbiAgICAgIGJvdHRvbTogLTRweDtcXG4gICAgICBsZWZ0OiAtNHB4O1xcbiAgICAgIHdpZHRoOiA4cHg7XFxuICAgICAgaGVpZ2h0OiA4cHg7IH1cXG5cIiwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJDOi9Vc2Vycy9nYXJyaS9zb3VyY2UvcmVwb3Mvc25hcGZvcm0vY2xpZW50L2VuZ2luZS9hc3NldHMvc3R5bGUvY29tcG9uZW50cy9pdGVtL2NsaWVudC9lbmdpbmUvYXNzZXRzL3N0eWxlL2NvbXBvbmVudHMvaXRlbS9pdGVtLnNjc3NcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBQUE7RUFDSSxrQkFBa0I7RUFDbEIseUJBQXlCO0VBQ3pCLG9DQUFvQztFQUNwQyxZQUFZO0VBQ1osWUFBWSxFQUFBO0VBTGhCO0lBUVEsU0FBUyxFQUFBO0VBUmpCO0lBWVEsb0NBQW9DLEVBQUE7RUFaNUM7SUFnQlEsa0JBQWtCO0lBQ2xCLFVBQVU7SUFDVixRQUFRLEVBQUE7SUFsQmhCO01BcUJZLHFCQUFxQjtNQUNyQixlQUFlO01BQ2YsdUJBQXVCO01BQ3ZCLFlBQVk7TUFDWixTQUFTO01BQ1QsWUFBWTtNQUNaLFdBQVcsRUFBQTtNQTNCdkI7UUE4QmdCLGtCQUFrQjtRQUNsQixNQUFNO1FBQ04sU0FBUztRQUNULGVBQWU7UUFDZixnQkFBZ0IsRUFBQTtFQWxDaEM7SUF3Q1Esa0JBQWtCO0lBQ2xCLFdBQVc7SUFDWCxnQkFBZ0I7SUFDaEIsMENBQXlDLEVBQUE7SUFDekM7TUE1Q1I7UUE2Q1ksV0FBVztRQUNYLFdBQVcsRUFBQSxFQTBGbEI7SUF4SUw7TUFpRFksWUFBWSxFQUFBO01BQ1o7UUFsRFo7VUFtRGdCLFdBQVc7VUFDWCxXQUFXLEVBQUEsRUFFbEI7SUF0RFQ7TUF3RFksa0JBQWtCO01BQ2xCLFFBQVE7TUFDUixhQUFhO01BQ2IseUJBQXlCO01BQ3pCLG9CQUFvQjtNQUNwQiwyQkFBMkI7TUFDM0IsZ0JBQWdCLEVBQUE7TUE5RDVCO1FBZ0VnQixlQUFlO1FBQ2YseUJBQXlCO1FBQ3pCLFlBQVksRUFBQTtJQWxFNUI7TUFzRVksWUFBWTtNQUNaLFdBQVc7TUFDWCxZQUFZO01BQ1osaUJBQWlCO01BQ2pCLHFCQUFxQjtNQUNyQixzQkFBc0I7TUFDdEIsa0JBQWtCO01BQ2xCLGVBQWU7TUFDZiwwQ0FBMEM7TUFDMUMsc0JBQXNCO01BQ3RCLGdDQUFnQztNQUNoQyxtQ0FBbUM7TUFDbkMseUJBQXlCLEVBQUE7TUFsRnJDO1FBb0ZnQixpQkFBaUI7UUFDakIsa0JBQWtCLEVBQUE7TUFyRmxDO1FBd0ZnQiwwQ0FBMEMsRUFBQTtNQXhGMUQ7UUE0Rm9CLGVBQWU7UUFDZixZQUFZLEVBQUE7TUE3RmhDO1FBaUdnQixhQUFhLEVBQUE7UUFqRzdCO1VBbUdvQixlQUFlO1VBQ2YsWUFBWSxFQUFBO0lBcEdoQztNQTRHb0IsUUFBUSxFQUFBO0lBNUc1QjtNQWdIZ0IsYUFBYSxFQUFBO01BaEg3QjtRQWtIb0IsUUFBUSxFQUFBO0lBbEg1QjtNQXVIZ0IsU0FBUyxFQUFBO0lBdkh6QjtNQThIb0IsUUFBUSxFQUFBO0lBOUg1QjtNQWtJZ0IsYUFBYSxFQUFBO01BbEk3QjtRQW9Jb0IsUUFBUSxFQUFBO0VBcEk1QjtJQTJJUSxrQkFBa0I7SUFDbEIsZ0JBQWdCLEVBQUE7SUE1SXhCO01BK0lZLE1BQU07TUFDTixTQUFTO01BQ1QsV0FBVztNQUNYLFVBQVUsRUFBQTtJQWxKdEI7TUFzSlksTUFBTTtNQUNOLFNBQVM7TUFDVCxVQUFVO01BQ1YsVUFBVSxFQUFBO0lBekp0QjtNQTZKWSxPQUFPO01BQ1AsUUFBUTtNQUNSLFdBQVc7TUFDWCxTQUFTLEVBQUE7SUFoS3JCO01Bb0tZLE9BQU87TUFDUCxRQUFRO01BQ1IsV0FBVztNQUNYLFlBQVksRUFBQTtJQXZLeEI7TUEyS1ksU0FBUztNQUNULFdBQVc7TUFDWCxVQUFVO01BQ1YsV0FBVyxFQUFBO0lBOUt2QjtNQWtMWSxTQUFTO01BQ1QsVUFBVTtNQUNWLFVBQVU7TUFDVixXQUFXLEVBQUE7SUFyTHZCO01BeUxZLFlBQVk7TUFDWixXQUFXO01BQ1gsVUFBVTtNQUNWLFdBQVcsRUFBQTtJQTVMdkI7TUFnTVksWUFBWTtNQUNaLFVBQVU7TUFDVixVQUFVO01BQ1YsV0FBVyxFQUFBXCIsXCJmaWxlXCI6XCJpdGVtLnNjc3NcIixcInNvdXJjZXNDb250ZW50XCI6W1wiLml0ZW0tY29udGFpbmVyIHtcXHJcXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xcclxcbiAgICBib3JkZXI6IDFweCBzb2xpZCAjNzg3ODc4O1xcclxcbiAgICBiYWNrZ3JvdW5kOiByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuOSk7XFxyXFxuICAgIHBhZGRpbmc6IDRweDtcXHJcXG4gICAgY3Vyc29yOiBtb3ZlO1xcclxcblxcclxcbiAgICBoMSwgaDIsIGgzLCBoNCwgaDUsIGg2IHtcXHJcXG4gICAgICAgIG1hcmdpbjogMDtcXHJcXG4gICAgfVxcclxcblxcclxcbiAgICAmLmZvY3VzIHtcXHJcXG4gICAgICAgIGJhY2tncm91bmQ6IHJnYmEoMjQwLCAyNDAsIDI0MCwgMC45KTtcXHJcXG4gICAgfVxcclxcblxcclxcbiAgICAuaXRlbS1hY3Rpb25zIHtcXHJcXG4gICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXHJcXG4gICAgICAgIHJpZ2h0OiAxcHg7XFxyXFxuICAgICAgICB0b3A6IDFweDtcXHJcXG5cXHJcXG4gICAgICAgIC5jbG9zZS1pY29uLWl0ZW0ge1xcclxcbiAgICAgICAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcXHJcXG4gICAgICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XFxyXFxuICAgICAgICAgICAgYmFja2dyb3VuZDogdHJhbnNwYXJlbnQ7XFxyXFxuICAgICAgICAgICAgcGFkZGluZzogMnB4O1xcclxcbiAgICAgICAgICAgIGJvcmRlcjogMDtcXHJcXG4gICAgICAgICAgICBoZWlnaHQ6IDE4cHg7XFxyXFxuICAgICAgICAgICAgd2lkdGg6IDE4cHg7XFxyXFxuICAgICAgICAgICAgXFxyXFxuICAgICAgICAgICAgLmNsb3NlLWljb24ge1xcclxcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XFxyXFxuICAgICAgICAgICAgICAgIHRvcDogMDtcXHJcXG4gICAgICAgICAgICAgICAgbGVmdDogN3B4O1xcclxcbiAgICAgICAgICAgICAgICBmb250LXNpemU6IDE0cHg7XFxyXFxuICAgICAgICAgICAgICAgIG1hcmdpbi10b3A6IC0xcHg7XFxyXFxuICAgICAgICAgICAgfVxcclxcbiAgICAgICAgfVxcclxcbiAgICB9XFxyXFxuXFxyXFxuICAgIC5pbnB1dC1jb21wb25lbnQge1xcclxcbiAgICAgICAgcG9zaXRpb246IHJlbGF0aXZlO1xcclxcbiAgICAgICAgd2lkdGg6IDEwMCU7XFxyXFxuICAgICAgICBtaW4taGVpZ2h0OiAzNnB4O1xcclxcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyNDQsIDI0NCwgMjQ0LCAuNCk7XFxyXFxuICAgICAgICBAbWVkaWEgKG1heC13aWR0aDogNjAwcHgpIHtcXHJcXG4gICAgICAgICAgICBmbG9hdDogbm9uZTtcXHJcXG4gICAgICAgICAgICB3aWR0aDogMTAwJTtcXHJcXG4gICAgICAgIH1cXHJcXG4gICAgICAgICY6bnRoLW9mLXR5cGUoMm4pIHtcXHJcXG4gICAgICAgICAgICBmbG9hdDogcmlnaHQ7XFxyXFxuICAgICAgICAgICAgQG1lZGlhIChtYXgtd2lkdGg6IDYwMHB4KSB7XFxyXFxuICAgICAgICAgICAgICAgIGZsb2F0OiBub25lO1xcclxcbiAgICAgICAgICAgICAgICB3aWR0aDogMTAwJTtcXHJcXG4gICAgICAgICAgICB9XFxyXFxuICAgICAgICB9XFxyXFxuICAgICAgICBzcGFuIHtcXHJcXG4gICAgICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XFxyXFxuICAgICAgICAgICAgdG9wOiA0NSU7XFxyXFxuICAgICAgICAgICAgbGVmdDogMC43NXJlbTtcXHJcXG4gICAgICAgICAgICBjb2xvcjogcmdiYSgwLCAwLCAwLCAwLjkpO1xcclxcbiAgICAgICAgICAgIHBvaW50ZXItZXZlbnRzOiBub25lO1xcclxcbiAgICAgICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtNDAlKTtcXHJcXG4gICAgICAgICAgICB0cmFuc2l0aW9uOiAuMjVzO1xcclxcbiAgICAgICAgICAgICYuaXMtYWN0aXZlIHtcXHJcXG4gICAgICAgICAgICAgICAgZm9udC1zaXplOiAxMnB4O1xcclxcbiAgICAgICAgICAgICAgICBjb2xvcjogcmdiYSgwLCAwLCAwLCAwLjkpO1xcclxcbiAgICAgICAgICAgICAgICBvcGFjaXR5OiAuODU7XFxyXFxuICAgICAgICAgICAgfVxcclxcbiAgICAgICAgfVxcclxcbiAgICAgICAgaW5wdXQsIC5kcm9wZG93bi10b2dnbGUsIHRleHRhcmVhIHtcXHJcXG4gICAgICAgICAgICBjdXJzb3I6IG1vdmU7XFxyXFxuICAgICAgICAgICAgd2lkdGg6IDEwMCU7XFxyXFxuICAgICAgICAgICAgaGVpZ2h0OiAxMDAlO1xcclxcbiAgICAgICAgICAgIHBhZGRpbmctdG9wOiAxMnB4O1xcclxcbiAgICAgICAgICAgIHBhZGRpbmctbGVmdDogMC43NXJlbTtcXHJcXG4gICAgICAgICAgICBwYWRkaW5nLXJpZ2h0OiAwLjc1cmVtO1xcclxcbiAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDJweDtcXHJcXG4gICAgICAgICAgICBmb250LXNpemU6IDE2cHg7XFxyXFxuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjkpO1xcclxcbiAgICAgICAgICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XFxyXFxuICAgICAgICAgICAgLW1vei1hcHBlYXJhbmNlOiBub25lICFpbXBvcnRhbnQ7XFxyXFxuICAgICAgICAgICAgLXdlYmtpdC1hcHBlYXJhbmNlOiBub25lICFpbXBvcnRhbnQ7XFxyXFxuICAgICAgICAgICAgYm9yZGVyOiAxcHggc29saWQgIzc4Nzg3ODtcXHJcXG4gICAgICAgICAgICAmLmctdG91Y2hlZC5nLWludmFsaWQge1xcclxcbiAgICAgICAgICAgICAgICBib3JkZXI6IDFweCBzb2xpZDtcXHJcXG4gICAgICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogMnB4O1xcclxcbiAgICAgICAgICAgIH1cXHJcXG4gICAgICAgICAgICAmLmctdG91Y2hlZCwgJi5nLXZhbGlkLCAmOmZvY3VzIHtcXHJcXG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjkpO1xcclxcbiAgICAgICAgICAgIH1cXHJcXG4gICAgICAgICAgICAmLmctdG91Y2hlZCwgJi5nLXZhbGlkIHtcXHJcXG4gICAgICAgICAgICAgICAgfnNwYW4ge1xcclxcbiAgICAgICAgICAgICAgICAgICAgZm9udC1zaXplOiAxMnB4O1xcclxcbiAgICAgICAgICAgICAgICAgICAgb3BhY2l0eTogLjg1O1xcclxcbiAgICAgICAgICAgICAgICB9XFxyXFxuICAgICAgICAgICAgfVxcclxcbiAgICAgICAgICAgICY6Zm9jdXMge1xcclxcbiAgICAgICAgICAgICAgICBvdXRsaW5lOiBub25lO1xcclxcbiAgICAgICAgICAgICAgICB+c3BhbiB7XFxyXFxuICAgICAgICAgICAgICAgICAgICBmb250LXNpemU6IDEycHg7XFxyXFxuICAgICAgICAgICAgICAgICAgICBvcGFjaXR5OiAuODU7XFxyXFxuICAgICAgICAgICAgICAgIH1cXHJcXG4gICAgICAgICAgICB9XFxyXFxuICAgICAgICB9XFxyXFxuXFxyXFxuICAgICAgICAuZHJvcGRvd24tdG9nZ2xlIHtcXHJcXG4gICAgICAgICAgICAmLmctdG91Y2hlZCwgJi5nLXZhbGlkIHtcXHJcXG4gICAgICAgICAgICAgICAgfnNwYW4ge1xcclxcbiAgICAgICAgICAgICAgICAgICAgdG9wOiAxNSU7XFxyXFxuICAgICAgICAgICAgICAgIH1cXHJcXG4gICAgICAgICAgICB9XFxyXFxuICAgICAgICAgICAgJjpmb2N1cyB7XFxyXFxuICAgICAgICAgICAgICAgIG91dGxpbmU6IG5vbmU7XFxyXFxuICAgICAgICAgICAgICAgIH5zcGFuIHtcXHJcXG4gICAgICAgICAgICAgICAgICAgIHRvcDogMTUlO1xcclxcbiAgICAgICAgICAgICAgICB9XFxyXFxuICAgICAgICAgICAgfVxcclxcblxcclxcbiAgICAgICAgICAgIGgxLCBoMiwgaDMsIGg0LCBoNSwgaDYge1xcclxcbiAgICAgICAgICAgICAgICBtYXJnaW46IDA7XFxyXFxuICAgICAgICAgICAgfVxcclxcbiAgICAgICAgfVxcclxcblxcclxcbiAgICAgICAgaW5wdXQge1xcclxcbiAgICAgICAgICAgICYuZy10b3VjaGVkLCAmLmctdmFsaWQge1xcclxcbiAgICAgICAgICAgICAgICB+c3BhbiB7XFxyXFxuICAgICAgICAgICAgICAgICAgICB0b3A6IDIwJTtcXHJcXG4gICAgICAgICAgICAgICAgfVxcclxcbiAgICAgICAgICAgIH1cXHJcXG4gICAgICAgICAgICAmOmZvY3VzIHtcXHJcXG4gICAgICAgICAgICAgICAgb3V0bGluZTogbm9uZTtcXHJcXG4gICAgICAgICAgICAgICAgfnNwYW4ge1xcclxcbiAgICAgICAgICAgICAgICAgICAgdG9wOiAyMCU7XFxyXFxuICAgICAgICAgICAgICAgIH1cXHJcXG4gICAgICAgICAgICB9XFxyXFxuICAgICAgICB9XFxyXFxuICAgIH1cXHJcXG5cXHJcXG4gICAgLnJlc2l6ZSB7XFxyXFxuICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XFxyXFxuICAgICAgICBjdXJzb3I6IHctcmVzaXplO1xcclxcblxcclxcbiAgICAgICAgJi5yaWdodCB7XFxyXFxuICAgICAgICAgICAgdG9wOiAwO1xcclxcbiAgICAgICAgICAgIGJvdHRvbTogMDtcXHJcXG4gICAgICAgICAgICByaWdodDogLTRweDtcXHJcXG4gICAgICAgICAgICB3aWR0aDogOHB4O1xcclxcbiAgICAgICAgfVxcclxcblxcclxcbiAgICAgICAgJi5sZWZ0IHtcXHJcXG4gICAgICAgICAgICB0b3A6IDA7XFxyXFxuICAgICAgICAgICAgYm90dG9tOiAwO1xcclxcbiAgICAgICAgICAgIHdpZHRoOiA4cHg7XFxyXFxuICAgICAgICAgICAgbGVmdDogLTRweDtcXHJcXG4gICAgICAgIH1cXHJcXG5cXHJcXG4gICAgICAgICYudG9wIHtcXHJcXG4gICAgICAgICAgICBsZWZ0OiAwO1xcclxcbiAgICAgICAgICAgIHJpZ2h0OiAwO1xcclxcbiAgICAgICAgICAgIGhlaWdodDogOHB4O1xcclxcbiAgICAgICAgICAgIHRvcDogLTRweDtcXHJcXG4gICAgICAgIH1cXHJcXG5cXHJcXG4gICAgICAgICYuYm90dG9tIHtcXHJcXG4gICAgICAgICAgICBsZWZ0OiAwO1xcclxcbiAgICAgICAgICAgIHJpZ2h0OiAwO1xcclxcbiAgICAgICAgICAgIGhlaWdodDogOHB4O1xcclxcbiAgICAgICAgICAgIGJvdHRvbTogLTRweDtcXHJcXG4gICAgICAgIH1cXHJcXG5cXHJcXG4gICAgICAgICYudG9wLXJpZ2h0IHtcXHJcXG4gICAgICAgICAgICB0b3A6IC00cHg7XFxyXFxuICAgICAgICAgICAgcmlnaHQ6IC00cHg7XFxyXFxuICAgICAgICAgICAgd2lkdGg6IDhweDtcXHJcXG4gICAgICAgICAgICBoZWlnaHQ6IDhweDtcXHJcXG4gICAgICAgIH1cXHJcXG5cXHJcXG4gICAgICAgICYudG9wLWxlZnQge1xcclxcbiAgICAgICAgICAgIHRvcDogLTRweDtcXHJcXG4gICAgICAgICAgICBsZWZ0OiAtNHB4O1xcclxcbiAgICAgICAgICAgIHdpZHRoOiA4cHg7XFxyXFxuICAgICAgICAgICAgaGVpZ2h0OiA4cHg7XFxyXFxuICAgICAgICB9XFxyXFxuXFxyXFxuICAgICAgICAmLmJvdHRvbS1yaWdodCB7XFxyXFxuICAgICAgICAgICAgYm90dG9tOiAtNHB4O1xcclxcbiAgICAgICAgICAgIHJpZ2h0OiAtNHB4O1xcclxcbiAgICAgICAgICAgIHdpZHRoOiA4cHg7XFxyXFxuICAgICAgICAgICAgaGVpZ2h0OiA4cHg7XFxyXFxuICAgICAgICB9XFxyXFxuXFxyXFxuICAgICAgICAmLmJvdHRvbS1sZWZ0IHtcXHJcXG4gICAgICAgICAgICBib3R0b206IC00cHg7XFxyXFxuICAgICAgICAgICAgbGVmdDogLTRweDtcXHJcXG4gICAgICAgICAgICB3aWR0aDogOHB4O1xcclxcbiAgICAgICAgICAgIGhlaWdodDogOHB4O1xcclxcbiAgICAgICAgfVxcclxcbiAgICB9XFxyXFxufVwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuXG4iLCJcbnZhciBjb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanM/P3JlZi0tNi0xIS4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9saWIvbG9hZGVyLmpzPz9yZWYtLTYtMiEuL2l0ZW0uc2Nzc1wiKTtcblxuaWYodHlwZW9mIGNvbnRlbnQgPT09ICdzdHJpbmcnKSBjb250ZW50ID0gW1ttb2R1bGUuaWQsIGNvbnRlbnQsICcnXV07XG5cbnZhciB0cmFuc2Zvcm07XG52YXIgaW5zZXJ0SW50bztcblxuXG5cbnZhciBvcHRpb25zID0ge1wiaG1yXCI6dHJ1ZX1cblxub3B0aW9ucy50cmFuc2Zvcm0gPSB0cmFuc2Zvcm1cbm9wdGlvbnMuaW5zZXJ0SW50byA9IHVuZGVmaW5lZDtcblxudmFyIHVwZGF0ZSA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9saWIvYWRkU3R5bGVzLmpzXCIpKGNvbnRlbnQsIG9wdGlvbnMpO1xuXG5pZihjb250ZW50LmxvY2FscykgbW9kdWxlLmV4cG9ydHMgPSBjb250ZW50LmxvY2FscztcblxuaWYobW9kdWxlLmhvdCkge1xuXHRtb2R1bGUuaG90LmFjY2VwdChcIiEhLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanM/P3JlZi0tNi0xIS4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9saWIvbG9hZGVyLmpzPz9yZWYtLTYtMiEuL2l0ZW0uc2Nzc1wiLCBmdW5jdGlvbigpIHtcblx0XHR2YXIgbmV3Q29udGVudCA9IHJlcXVpcmUoXCIhIS4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzPz9yZWYtLTYtMSEuLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvbGliL2xvYWRlci5qcz8/cmVmLS02LTIhLi9pdGVtLnNjc3NcIik7XG5cblx0XHRpZih0eXBlb2YgbmV3Q29udGVudCA9PT0gJ3N0cmluZycpIG5ld0NvbnRlbnQgPSBbW21vZHVsZS5pZCwgbmV3Q29udGVudCwgJyddXTtcblxuXHRcdHZhciBsb2NhbHMgPSAoZnVuY3Rpb24oYSwgYikge1xuXHRcdFx0dmFyIGtleSwgaWR4ID0gMDtcblxuXHRcdFx0Zm9yKGtleSBpbiBhKSB7XG5cdFx0XHRcdGlmKCFiIHx8IGFba2V5XSAhPT0gYltrZXldKSByZXR1cm4gZmFsc2U7XG5cdFx0XHRcdGlkeCsrO1xuXHRcdFx0fVxuXG5cdFx0XHRmb3Ioa2V5IGluIGIpIGlkeC0tO1xuXG5cdFx0XHRyZXR1cm4gaWR4ID09PSAwO1xuXHRcdH0oY29udGVudC5sb2NhbHMsIG5ld0NvbnRlbnQubG9jYWxzKSk7XG5cblx0XHRpZighbG9jYWxzKSB0aHJvdyBuZXcgRXJyb3IoJ0Fib3J0aW5nIENTUyBITVIgZHVlIHRvIGNoYW5nZWQgY3NzLW1vZHVsZXMgbG9jYWxzLicpO1xuXG5cdFx0dXBkYXRlKG5ld0NvbnRlbnQpO1xuXHR9KTtcblxuXHRtb2R1bGUuaG90LmRpc3Bvc2UoZnVuY3Rpb24oKSB7IHVwZGF0ZSgpOyB9KTtcbn0iXSwic291cmNlUm9vdCI6IiJ9