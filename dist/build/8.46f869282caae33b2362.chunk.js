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
    this.state = {
      info: project.items[this.props.uid],
      itemContainerClassName: defaultItemContainerClassName,
      readOnlyValue: ''
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
      hover,
      hasFocus
    } = this.state;
    const TagName = this.props.tag.name;
    var tag = null;

    if (this.props.tag.innerValue) {
      tag = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(TagName, null, this.props.tag.value);
    } else {
      var tagClassName = this.defaultTagClassName + (this.state.readOnlyValue && this.state.readOnlyValue.length ? ' g-valid' : '');
      tag = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "input-component"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(TagName, {
        className: tagClassName,
        type: "text",
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
exports.push([module.i, ".item-container {\n  position: absolute;\n  border: 1px solid #787878;\n  background: rgba(255, 255, 255, 0.9);\n  padding: 4px;\n  cursor: move; }\n  .item-container h1, .item-container h2, .item-container h3, .item-container h4, .item-container h5, .item-container h6 {\n    margin: 0; }\n  .item-container.focus {\n    background: rgba(240, 240, 240, 0.9); }\n    .item-container.focus .item-actions .close-icon-item {\n      background: rgba(240, 240, 240, 0.5); }\n  .item-container .item-actions {\n    position: absolute;\n    right: 1px;\n    top: 1px; }\n    .item-container .item-actions .close-icon-item {\n      display: inline-block;\n      cursor: pointer;\n      background: rgba(255, 255, 255, 0.5);\n      padding: 2px;\n      border: 0;\n      height: 18px;\n      width: 18px; }\n      .item-container .item-actions .close-icon-item .close-icon {\n        position: absolute;\n        top: 3px;\n        left: 4px;\n        font-size: 14px;\n        margin-top: -1px; }\n  .item-container .input-component {\n    position: relative;\n    width: 100%;\n    min-height: 36px;\n    background-color: rgba(244, 244, 244, 0.4); }\n    @media (max-width: 600px) {\n      .item-container .input-component {\n        float: none;\n        width: 100%; } }\n    .item-container .input-component:nth-of-type(2n) {\n      float: right; }\n      @media (max-width: 600px) {\n        .item-container .input-component:nth-of-type(2n) {\n          float: none;\n          width: 100%; } }\n    .item-container .input-component span {\n      position: absolute;\n      top: 45%;\n      left: 0.75rem;\n      color: rgba(0, 0, 0, 0.9);\n      pointer-events: none;\n      transform: translateY(-40%);\n      transition: .25s; }\n      .item-container .input-component span.is-active {\n        font-size: 12px;\n        color: rgba(0, 0, 0, 0.9);\n        opacity: .85; }\n    .item-container .input-component input, .item-container .input-component .dropdown-toggle {\n      width: 100%;\n      height: 100%;\n      padding-top: 10px;\n      padding-left: 0.75rem;\n      padding-right: 0.75rem;\n      border-radius: 2px;\n      font-size: 16px;\n      background-color: rgba(255, 255, 255, 0.9);\n      box-sizing: border-box;\n      -moz-appearance: none !important;\n      -webkit-appearance: none !important;\n      border: 1px solid #787878; }\n      .item-container .input-component input.g-touched.g-invalid, .item-container .input-component .dropdown-toggle.g-touched.g-invalid {\n        border: 1px solid;\n        border-radius: 2px; }\n      .item-container .input-component input.g-touched, .item-container .input-component input.g-valid, .item-container .input-component input:focus, .item-container .input-component .dropdown-toggle.g-touched, .item-container .input-component .dropdown-toggle.g-valid, .item-container .input-component .dropdown-toggle:focus {\n        background-color: rgba(255, 255, 255, 0.9); }\n      .item-container .input-component input.g-touched ~ span, .item-container .input-component input.g-valid ~ span, .item-container .input-component .dropdown-toggle.g-touched ~ span, .item-container .input-component .dropdown-toggle.g-valid ~ span {\n        font-size: 12px;\n        opacity: .85; }\n      .item-container .input-component input:focus, .item-container .input-component .dropdown-toggle:focus {\n        outline: none; }\n        .item-container .input-component input:focus ~ span, .item-container .input-component .dropdown-toggle:focus ~ span {\n          font-size: 12px;\n          opacity: .85; }\n    .item-container .input-component .dropdown-toggle.g-touched ~ span, .item-container .input-component .dropdown-toggle.g-valid ~ span {\n      top: 15%; }\n    .item-container .input-component .dropdown-toggle:focus {\n      outline: none; }\n      .item-container .input-component .dropdown-toggle:focus ~ span {\n        top: 15%; }\n    .item-container .input-component .dropdown-toggle h1, .item-container .input-component .dropdown-toggle h2, .item-container .input-component .dropdown-toggle h3, .item-container .input-component .dropdown-toggle h4, .item-container .input-component .dropdown-toggle h5, .item-container .input-component .dropdown-toggle h6 {\n      margin: 0; }\n    .item-container .input-component input.g-touched ~ span, .item-container .input-component input.g-valid ~ span {\n      top: 20%; }\n    .item-container .input-component input:focus {\n      outline: none; }\n      .item-container .input-component input:focus ~ span {\n        top: 20%; }\n", "",{"version":3,"sources":["C:/Users/garri/source/repos/snapform/client/engine/assets/style/components/item/client/engine/assets/style/components/item/item.scss"],"names":[],"mappings":"AAAA;EACI,kBAAkB;EAClB,yBAAyB;EACzB,oCAAoC;EACpC,YAAY;EACZ,YAAY,EAAA;EALhB;IAQQ,SAAS,EAAA;EARjB;IAYQ,oCAAoC,EAAA;IAZ5C;MAgBgB,oCAAoC,EAAA;EAhBpD;IAsBQ,kBAAkB;IAClB,UAAU;IACV,QAAQ,EAAA;IAxBhB;MA2BY,qBAAqB;MACrB,eAAe;MACf,oCAAoC;MACpC,YAAY;MACZ,SAAS;MACT,YAAY;MACZ,WAAW,EAAA;MAjCvB;QAoCgB,kBAAkB;QAClB,QAAQ;QACR,SAAS;QACT,eAAe;QACf,gBAAgB,EAAA;EAxChC;IA8CQ,kBAAkB;IAClB,WAAW;IACX,gBAAgB;IAChB,0CAAyC,EAAA;IACzC;MAlDR;QAmDY,WAAW;QACX,WAAW,EAAA,EAyFlB;IA7IL;MAuDY,YAAY,EAAA;MACZ;QAxDZ;UAyDgB,WAAW;UACX,WAAW,EAAA,EAElB;IA5DT;MA8DY,kBAAkB;MAClB,QAAQ;MACR,aAAa;MACb,yBAAyB;MACzB,oBAAoB;MACpB,2BAA2B;MAC3B,gBAAgB,EAAA;MApE5B;QAsEgB,eAAe;QACf,yBAAyB;QACzB,YAAY,EAAA;IAxE5B;MA4EY,WAAW;MACX,YAAY;MACZ,iBAAiB;MACjB,qBAAqB;MACrB,sBAAsB;MACtB,kBAAkB;MAClB,eAAe;MACf,0CAA0C;MAC1C,sBAAsB;MACtB,gCAAgC;MAChC,mCAAmC;MACnC,yBAAyB,EAAA;MAvFrC;QAyFgB,iBAAiB;QACjB,kBAAkB,EAAA;MA1FlC;QA6FgB,0CAA0C,EAAA;MA7F1D;QAiGoB,eAAe;QACf,YAAY,EAAA;MAlGhC;QAsGgB,aAAa,EAAA;QAtG7B;UAwGoB,eAAe;UACf,YAAY,EAAA;IAzGhC;MAiHoB,QAAQ,EAAA;IAjH5B;MAqHgB,aAAa,EAAA;MArH7B;QAuHoB,QAAQ,EAAA;IAvH5B;MA4HgB,SAAS,EAAA;IA5HzB;MAmIoB,QAAQ,EAAA;IAnI5B;MAuIgB,aAAa,EAAA;MAvI7B;QAyIoB,QAAQ,EAAA","file":"item.scss","sourcesContent":[".item-container {\r\n    position: absolute;\r\n    border: 1px solid #787878;\r\n    background: rgba(255, 255, 255, 0.9);\r\n    padding: 4px;\r\n    cursor: move;\r\n\r\n    h1, h2, h3, h4, h5, h6 {\r\n        margin: 0;\r\n    }\r\n\r\n    &.focus {\r\n        background: rgba(240, 240, 240, 0.9);\r\n\r\n        .item-actions {\r\n            .close-icon-item {\r\n                background: rgba(240, 240, 240, 0.5);\r\n            }\r\n        }\r\n    }\r\n\r\n    .item-actions {\r\n        position: absolute;\r\n        right: 1px;\r\n        top: 1px;\r\n\r\n        .close-icon-item {\r\n            display: inline-block;\r\n            cursor: pointer;\r\n            background: rgba(255, 255, 255, 0.5);\r\n            padding: 2px;\r\n            border: 0;\r\n            height: 18px;\r\n            width: 18px;\r\n            \r\n            .close-icon {\r\n                position: absolute;\r\n                top: 3px;\r\n                left: 4px;\r\n                font-size: 14px;\r\n                margin-top: -1px;\r\n            }\r\n        }\r\n    }\r\n\r\n    .input-component {\r\n        position: relative;\r\n        width: 100%;\r\n        min-height: 36px;\r\n        background-color: rgba(244, 244, 244, .4);\r\n        @media (max-width: 600px) {\r\n            float: none;\r\n            width: 100%;\r\n        }\r\n        &:nth-of-type(2n) {\r\n            float: right;\r\n            @media (max-width: 600px) {\r\n                float: none;\r\n                width: 100%;\r\n            }\r\n        }\r\n        span {\r\n            position: absolute;\r\n            top: 45%;\r\n            left: 0.75rem;\r\n            color: rgba(0, 0, 0, 0.9);\r\n            pointer-events: none;\r\n            transform: translateY(-40%);\r\n            transition: .25s;\r\n            &.is-active {\r\n                font-size: 12px;\r\n                color: rgba(0, 0, 0, 0.9);\r\n                opacity: .85;\r\n            }\r\n        }\r\n        input, .dropdown-toggle {\r\n            width: 100%;\r\n            height: 100%;\r\n            padding-top: 10px;\r\n            padding-left: 0.75rem;\r\n            padding-right: 0.75rem;\r\n            border-radius: 2px;\r\n            font-size: 16px;\r\n            background-color: rgba(255, 255, 255, 0.9);\r\n            box-sizing: border-box;\r\n            -moz-appearance: none !important;\r\n            -webkit-appearance: none !important;\r\n            border: 1px solid #787878;\r\n            &.g-touched.g-invalid {\r\n                border: 1px solid;\r\n                border-radius: 2px;\r\n            }\r\n            &.g-touched, &.g-valid, &:focus {\r\n                background-color: rgba(255, 255, 255, 0.9);\r\n            }\r\n            &.g-touched, &.g-valid {\r\n                ~span {\r\n                    font-size: 12px;\r\n                    opacity: .85;\r\n                }\r\n            }\r\n            &:focus {\r\n                outline: none;\r\n                ~span {\r\n                    font-size: 12px;\r\n                    opacity: .85;\r\n                }\r\n            }\r\n        }\r\n\r\n        .dropdown-toggle {\r\n            &.g-touched, &.g-valid {\r\n                ~span {\r\n                    top: 15%;\r\n                }\r\n            }\r\n            &:focus {\r\n                outline: none;\r\n                ~span {\r\n                    top: 15%;\r\n                }\r\n            }\r\n\r\n            h1, h2, h3, h4, h5, h6 {\r\n                margin: 0;\r\n            }\r\n        }\r\n\r\n        input {\r\n            &.g-touched, &.g-valid {\r\n                ~span {\r\n                    top: 20%;\r\n                }\r\n            }\r\n            &:focus {\r\n                outline: none;\r\n                ~span {\r\n                    top: 20%;\r\n                }\r\n            }\r\n        }\r\n    }\r\n}"],"sourceRoot":""}]);



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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9jbGllbnQvZW5naW5lL3NyYy9jb21wb25lbnRzL2l0ZW0vaXRlbS5jb21wb25lbnQuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L2VuZ2luZS9hc3NldHMvc3R5bGUvY29tcG9uZW50cy9pdGVtL2l0ZW0uc2NzcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvZW5naW5lL2Fzc2V0cy9zdHlsZS9jb21wb25lbnRzL2l0ZW0vaXRlbS5zY3NzPzgyMjkiXSwibmFtZXMiOlsibWFwU3RhdGVUb1Byb3BzIiwic3RhdGUiLCJtYXBEaXNwYXRjaFRvUHJvcHMiLCJkaXNwYXRjaCIsInVwZGF0ZVByb2plY3QiLCJwYXlsb2FkIiwidXBkYXRlUHJvamVjdEl0ZW1zIiwidXBkYXRlUHJvamVjdENvbmZpZyIsImRlZmF1bHRJdGVtQ29udGFpbmVyQ2xhc3NOYW1lIiwiSXRlbUNvbXBvbmVudCIsIkNvbXBvbmVudCIsImNvbnN0cnVjdG9yIiwicHJvcHMiLCJ3b3Jrc3BhY2UiLCJzdG9yZSIsImdldFN0YXRlIiwicHJvamVjdCIsImhhbmRsZVJlYWRPbmx5VmFsdWVDaGFuZ2VkIiwiYmluZCIsImhhbmRsZUl0ZW1Db250YWluZXJDbGljayIsImhhbmRsZU91dHNpZGVDbGljayIsImRyYWciLCJoYW5kbGVEcmFnU3RhcnQiLCJoYW5kbGVEcmFnIiwiaGFuZGxlRHJhZ0VuZCIsIm1vdXNlbW92ZSIsImhhbmRsZUtleURvd24iLCJoYW5kbGVNb3VzZUVudGVyIiwiaGFuZGxlTW91c2VMZWF2ZSIsInJlbW92ZUl0ZW0iLCJpbmZvIiwiaXRlbXMiLCJ1aWQiLCJpdGVtQ29udGFpbmVyQ2xhc3NOYW1lIiwicmVhZE9ubHlWYWx1ZSIsImNvbXBvbmVudFdpbGxNb3VudCIsImRvY3VtZW50IiwiYWRkRXZlbnRMaXN0ZW5lciIsImNvbXBvbmVudERpZE1vdW50IiwiZHJhZ0ltZyIsIkltYWdlIiwic3JjIiwiY29tcG9uZW50V2lsbFVubW91bnQiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwibW91c2Vtb3V2ZSIsImUiLCJzZXRTdGF0ZSIsIk9iamVjdCIsImFzc2lnbiIsInRhcmdldCIsInZhbHVlIiwiaXRlbSIsImNvbnRhaW5zIiwiaGFzRm9jdXMiLCJjdXJyZW50X3oiLCJ6IiwidG9wX3oiLCJrZXkiLCJkYXRhVHJhbnNmZXIiLCJzZXREcmFnSW1hZ2UiLCJzdHlsZSIsImN1cnNvciIsImNvbnRhaW5lciIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsImRyYWdnaW5nIiwiZHJhZ09mZnNldFgiLCJ4IiwiY2xpZW50WCIsImxlZnQiLCJkcmFnT2Zmc2V0WSIsInkiLCJjbGllbnRZIiwidG9wIiwiY29uZmlnIiwidWkiLCJnX2NsYXNzX2xpc3QiLCJwYXRoIiwiZGlzcGF0Y2hFdmVudCIsIkN1c3RvbUV2ZW50IiwiYnViYmxlcyIsImRldGFpbCIsIndvcmtzcGFjZV9pZCIsImlkIiwiZGVmYXVsdFdpZHRoIiwiY2VsbFdpZHRoIiwiZGVmYXVsdEhlaWdodCIsImNlbGxIZWlnaHQiLCJNYXRoIiwiZmxvb3IiLCJyZWN0IiwiaXRlbU9mZnNldExlZnQiLCJ3aWR0aCIsIml0ZW1PZmZzZXRUb3AiLCJoZWlnaHQiLCJzYXZlIiwia2V5Q29kZSIsInByZXZlbnREZWZhdWx0IiwidXBkYXRlZF93b3Jrc3BhY2UiLCJob3ZlciIsInN0b3BQcm9wYWdhdGlvbiIsInJlbmRlciIsIlRhZ05hbWUiLCJ0YWciLCJuYW1lIiwiaW5uZXJWYWx1ZSIsInRhZ0NsYXNzTmFtZSIsImRlZmF1bHRUYWdDbGFzc05hbWUiLCJsZW5ndGgiLCJ0b0xvd2VyQ2FzZSIsInJlcGxhY2UiLCJ6SW5kZXgiLCJJdGVtIiwiY29ubmVjdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUVBOztBQUVBLE1BQU1BLGVBQWUsR0FBSUMsS0FBRCxJQUFXQSxLQUFuQzs7QUFDQSxNQUFNQyxrQkFBa0IsR0FBSUMsUUFBRCxJQUFjO0FBQ3JDLFNBQU87QUFDSEMs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QixpQ0FBaUMscUJBQXFCLGlCQUFpQiw0Q0FBNEMsOEJBQThCLGlCQUFpQixhQUFhLHVCQUF1Qix3Q0FBd0MsMkJBQTJCLGlDQUFpQyxxQkFBcUIsaUJBQWlCLHlCQUF5QixrQ0FBa0MsMkJBQTJCLGlDQUFpQyxxQkFBcUIsaUJBQWlCLGFBQWEsU0FBUyxLQUFLLG1CQUFtQjs7Ozs7Ozs7Ozs7Ozs7QUNEbnJULGNBQWMsbUJBQU8sQ0FBQyw2SkFBa0o7O0FBRXhLLDRDQUE0QyxRQUFTOztBQUVyRDtBQUNBOzs7O0FBSUEsZUFBZTs7QUFFZjtBQUNBOztBQUVBLGFBQWEsbUJBQU8sQ0FBQywwRUFBK0Q7O0FBRXBGOztBQUVBLEdBQUcsS0FBVSxFQUFFLEUiLCJmaWxlIjoiYnVpbGQvOC40NmY4NjkyODJjYWFlMzNiMjM2Mi5jaHVuay5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQgfSBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCc7XHJcbmltcG9ydCB7IHN0b3JlIH0gZnJvbSAnLi4vLi4vY29uZmlnL3JlZHV4L3JlZHV4LnN0b3JlJztcclxuaW1wb3J0IHsgdXBkYXRlUHJvamVjdCwgdXBkYXRlUHJvamVjdEl0ZW1zLCB1cGRhdGVQcm9qZWN0Q29uZmlnIH0gZnJvbSAnLi4vLi4vY29uZmlnL3JlZHV4L3JlZHV4LmFjdGlvbnMnO1xyXG5cclxuaW1wb3J0ICcuLi8uLi8uLi9hc3NldHMvc3R5bGUvY29tcG9uZW50cy9pdGVtL2l0ZW0uc2Nzcyc7XHJcblxyXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSAoc3RhdGUpID0+IHN0YXRlO1xyXG5jb25zdCBtYXBEaXNwYXRjaFRvUHJvcHMgPSAoZGlzcGF0Y2gpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdXBkYXRlUHJvamVjdDogcGF5bG9hZCA9PiBkaXNwYXRjaCh1cGRhdGVQcm9qZWN0KHBheWxvYWQpKSxcclxuICAgICAgICB1cGRhdGVQcm9qZWN0SXRlbXM6IHBheWxvYWQgPT4gZGlzcGF0Y2godXBkYXRlUHJvamVjdEl0ZW1zKHBheWxvYWQpKSxcclxuICAgICAgICB1cGRhdGVQcm9qZWN0Q29uZmlnOiBwYXlsb2FkID0+IGRpc3BhdGNoKHVwZGF0ZVByb2plY3RDb25maWcocGF5bG9hZCkpXHJcbiAgICB9O1xyXG59O1xyXG5cclxuY29uc3QgZGVmYXVsdEl0ZW1Db250YWluZXJDbGFzc05hbWUgPSAnaXRlbS1jb250YWluZXInO1xyXG5cclxuY2xhc3MgSXRlbUNvbXBvbmVudCBleHRlbmRzIENvbXBvbmVudCB7XHJcbiAgICBkcmFnZ2luZyA9IGZhbHNlO1xyXG4gICAgZHJhZ09mZnNldFggPSAwO1xyXG4gICAgZHJhZ09mZnNldFkgPSAwO1xyXG4gICAgZGVmYXVsdFRhZ0NsYXNzTmFtZSA9ICdnLWJvcmRlci1jb2xvcic7XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcblxyXG4gICAgICAgIGNvbnN0IHsgd29ya3NwYWNlIH0gPSBzdG9yZS5nZXRTdGF0ZSgpO1xyXG4gICAgICAgIGNvbnN0IHByb2plY3QgPSB3b3Jrc3BhY2UucHJvamVjdDtcclxuXHJcbiAgICAgICAgdGhpcy5oYW5kbGVSZWFkT25seVZhbHVlQ2hhbmdlZCA9IHRoaXMuaGFuZGxlUmVhZE9ubHlWYWx1ZUNoYW5nZWQuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLmhhbmRsZUl0ZW1Db250YWluZXJDbGljayA9IHRoaXMuaGFuZGxlSXRlbUNvbnRhaW5lckNsaWNrLmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVPdXRzaWRlQ2xpY2sgPSB0aGlzLmhhbmRsZU91dHNpZGVDbGljay5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuZHJhZyA9IHRoaXMuZHJhZy5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlRHJhZ1N0YXJ0ID0gdGhpcy5oYW5kbGVEcmFnU3RhcnQuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLmhhbmRsZURyYWcgPSB0aGlzLmhhbmRsZURyYWcuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLmhhbmRsZURyYWdFbmQgPSB0aGlzLmhhbmRsZURyYWdFbmQuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLm1vdXNlbW92ZSA9IHRoaXMubW91c2Vtb3ZlLmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVLZXlEb3duID0gdGhpcy5oYW5kbGVLZXlEb3duLmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVNb3VzZUVudGVyID0gdGhpcy5oYW5kbGVNb3VzZUVudGVyLmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVNb3VzZUxlYXZlID0gdGhpcy5oYW5kbGVNb3VzZUxlYXZlLmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5yZW1vdmVJdGVtID0gdGhpcy5yZW1vdmVJdGVtLmJpbmQodGhpcyk7XHJcblxyXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XHJcbiAgICAgICAgICAgIGluZm86IHByb2plY3QuaXRlbXNbdGhpcy5wcm9wcy51aWRdLFxyXG4gICAgICAgICAgICBpdGVtQ29udGFpbmVyQ2xhc3NOYW1lOiBkZWZhdWx0SXRlbUNvbnRhaW5lckNsYXNzTmFtZSxcclxuICAgICAgICAgICAgcmVhZE9ubHlWYWx1ZTogJydcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIGNvbXBvbmVudFdpbGxNb3VudCgpIHtcclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLmhhbmRsZU91dHNpZGVDbGljaywgZmFsc2UpO1xyXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMubW91c2Vtb3ZlLCBmYWxzZSk7XHJcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMuaGFuZGxlS2V5RG93biwgZmFsc2UpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xyXG4gICAgICAgIHRoaXMuZHJhZ0ltZyA9IG5ldyBJbWFnZSgwLDApO1xyXG4gICAgICAgIHRoaXMuZHJhZ0ltZy5zcmMgPSAnZGF0YTppbWFnZS9naWY7YmFzZTY0LFIwbEdPRGxoQVFBQkFJQUFBQUFBQVAvLy95SDVCQUVBQUFBQUxBQUFBQUFCQUFFQUFBSUJSQUE3JztcclxuICAgIH1cclxuXHJcbiAgICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcclxuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLmhhbmRsZU91dHNpZGVDbGljaywgZmFsc2UpO1xyXG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMubW91c2Vtb3V2ZSwgZmFsc2UpO1xyXG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLmhhbmRsZUtleURvd24sIGZhbHNlKTtcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVSZWFkT25seVZhbHVlQ2hhbmdlZChlKSB7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZShPYmplY3QuYXNzaWduKHt9LCB0aGlzLnN0YXRlLCB7XHJcbiAgICAgICAgICAgIHJlYWRPbmx5VmFsdWU6IGUudGFyZ2V0LnZhbHVlXHJcbiAgICAgICAgfSkpO1xyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZU91dHNpZGVDbGljayhlKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaXRlbS5jb250YWlucyhlLnRhcmdldCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZShPYmplY3QuYXNzaWduKHt9LCB0aGlzLnN0YXRlLCB7XHJcbiAgICAgICAgICAgIGhhc0ZvY3VzOiBmYWxzZSxcclxuICAgICAgICAgICAgaXRlbUNvbnRhaW5lckNsYXNzTmFtZTogZGVmYXVsdEl0ZW1Db250YWluZXJDbGFzc05hbWVcclxuICAgICAgICB9KSk7XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlSXRlbUNvbnRhaW5lckNsaWNrKCkge1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5zdGF0ZSwge1xyXG4gICAgICAgICAgICBoYXNGb2N1czogdHJ1ZSxcclxuICAgICAgICAgICAgaXRlbUNvbnRhaW5lckNsYXNzTmFtZTogZGVmYXVsdEl0ZW1Db250YWluZXJDbGFzc05hbWUgKyAnIGZvY3VzJ1xyXG4gICAgICAgIH0pKTtcclxuXHJcbiAgICAgICAgY29uc3QgeyB3b3Jrc3BhY2UgfSA9IHN0b3JlLmdldFN0YXRlKCk7XHJcbiAgICAgICAgdmFyIGl0ZW1zID0gd29ya3NwYWNlLnByb2plY3QuaXRlbXM7XHJcblxyXG4gICAgICAgIGlmIChpdGVtc1t0aGlzLnByb3BzLnVpZF0pIHtcclxuICAgICAgICAgICAgY29uc3QgY3VycmVudF96ID0gaXRlbXNbdGhpcy5wcm9wcy51aWRdLno7XHJcbiAgICAgICAgICAgIHZhciB0b3BfeiA9IGN1cnJlbnRfejtcclxuICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIGl0ZW1zKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoa2V5ICE9PSB0aGlzLnByb3BzLnVpZCAmJiBpdGVtc1trZXldLnogPiBjdXJyZW50X3opIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbXNba2V5XS56ID4gdG9wX3opIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdG9wX3ogPSBpdGVtc1trZXldLno7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zW2tleV0ueiAtPSAxO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGl0ZW1zW3RoaXMucHJvcHMudWlkXS56ID0gdG9wX3o7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnByb3BzLnVwZGF0ZVByb2plY3RJdGVtcyhpdGVtcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZURyYWdTdGFydChlKSB7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVJdGVtQ29udGFpbmVyQ2xpY2soKTtcclxuXHJcbiAgICAgICAgZS5kYXRhVHJhbnNmZXIuc2V0RHJhZ0ltYWdlKHRoaXMuZHJhZ0ltZywgMCwgMCk7XHJcbiAgICAgICAgZS50YXJnZXQuc3R5bGUuY3Vyc29yID0gJ21vdmUnO1xyXG5cclxuICAgICAgICBjb25zdCB7IHdvcmtzcGFjZSB9ID0gc3RvcmUuZ2V0U3RhdGUoKTtcclxuICAgICAgICBjb25zdCBjb250YWluZXIgPSB3b3Jrc3BhY2UucHJvamVjdC5jb250YWluZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICAgICAgY29uc3QgaXRlbSA9IHdvcmtzcGFjZS5wcm9qZWN0Lml0ZW1zW3RoaXMucHJvcHMudWlkXTtcclxuXHJcbiAgICAgICAgdGhpcy5kcmFnZ2luZyA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5kcmFnT2Zmc2V0WCA9IGl0ZW0ueCAtIChlLmNsaWVudFggLSBjb250YWluZXIubGVmdCk7XHJcbiAgICAgICAgdGhpcy5kcmFnT2Zmc2V0WSA9IGl0ZW0ueSAtIChlLmNsaWVudFkgLSBjb250YWluZXIudG9wKTtcclxuXHJcbiAgICAgICAgdGhpcy5wcm9wcy51cGRhdGVQcm9qZWN0Q29uZmlnKE9iamVjdC5hc3NpZ24oe30sIHdvcmtzcGFjZS5wcm9qZWN0LmNvbmZpZywge1xyXG4gICAgICAgICAgICB1aTogT2JqZWN0LmFzc2lnbih7fSwgd29ya3NwYWNlLnByb2plY3QuY29uZmlnLnVpLCB7XHJcbiAgICAgICAgICAgICAgICBnX2NsYXNzX2xpc3Q6ICdnaWQgaGlkZGVuJ1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0pKTtcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVEcmFnKGUpIHtcclxuICAgICAgICB0aGlzLmRyYWcoZSk7XHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgaGFuZGxlRHJhZ0VuZChlKSB7XHJcbiAgICAgICAgdmFyIGluZm8gPSB0aGlzLmRyYWcoZSk7XHJcbiAgICAgICAgY29uc3QgeyB3b3Jrc3BhY2UgfSA9IHN0b3JlLmdldFN0YXRlKCk7XHJcblxyXG4gICAgICAgIHRoaXMuZHJhZ2dpbmcgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgdGhpcy5wcm9wcy51cGRhdGVQcm9qZWN0Q29uZmlnKE9iamVjdC5hc3NpZ24oe30sIHdvcmtzcGFjZS5wcm9qZWN0LmNvbmZpZywge1xyXG4gICAgICAgICAgICB1aTogT2JqZWN0LmFzc2lnbih7fSwgd29ya3NwYWNlLnByb2plY3QuY29uZmlnLnVpLCB7XHJcbiAgICAgICAgICAgICAgICBnX2NsYXNzX2xpc3Q6ICdnaWQnXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSkpO1xyXG5cclxuICAgICAgICB0aGlzLnByb3BzLnVwZGF0ZVByb2plY3Qoe1xyXG4gICAgICAgICAgICBwYXRoOiB0aGlzLnByb3BzLnVpZCxcclxuICAgICAgICAgICAgdmFsdWU6IGluZm9cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5pdGVtLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdzZi53b3Jrc3BhY2UucHJvamVjdC51cGRhdGUnLCB7XHJcbiAgICAgICAgICAgIGJ1YmJsZXM6IHRydWUsXHJcbiAgICAgICAgICAgIGRldGFpbDogeyBcclxuICAgICAgICAgICAgICAgIHdvcmtzcGFjZV9pZDogd29ya3NwYWNlLmlkLFxyXG4gICAgICAgICAgICAgICAgcHJvamVjdDogd29ya3NwYWNlLnByb2plY3QgXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KSk7XHJcbiAgICB9XHJcblxyXG4gICAgZHJhZyhlKSB7XHJcbiAgICAgICAgY29uc3QgeyB3b3Jrc3BhY2UgfSA9IHN0b3JlLmdldFN0YXRlKCk7XHJcbiAgICAgICAgY29uc3QgY29udGFpbmVyID0gd29ya3NwYWNlLnByb2plY3QuY29udGFpbmVyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgICAgIGNvbnN0IGRlZmF1bHRXaWR0aCA9IHdvcmtzcGFjZS5wcm9qZWN0LmNvbmZpZy5jZWxsV2lkdGg7XHJcbiAgICAgICAgY29uc3QgZGVmYXVsdEhlaWdodCA9IHdvcmtzcGFjZS5wcm9qZWN0LmNvbmZpZy5jZWxsSGVpZ2h0O1xyXG5cclxuICAgICAgICBjb25zdCB4ID0gTWF0aC5mbG9vcigoZS5jbGllbnRYIC0gKGNvbnRhaW5lci5sZWZ0IC0gdGhpcy5kcmFnT2Zmc2V0WCkpIC8gZGVmYXVsdFdpZHRoKSAqIGRlZmF1bHRXaWR0aDtcclxuICAgICAgICBjb25zdCB5ID0gTWF0aC5mbG9vcigoZS5jbGllbnRZIC0gKGNvbnRhaW5lci50b3AgLSB0aGlzLmRyYWdPZmZzZXRZKSkgLyBkZWZhdWx0SGVpZ2h0KSAqIGRlZmF1bHRIZWlnaHQ7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdmFyIGxlZnQgPSB4ID4gMCA/IHggOiAwO1xyXG4gICAgICAgIHZhciB0b3AgPSB5ID4gMCA/IHkgOiAwO1xyXG5cclxuICAgICAgICBjb25zdCByZWN0ID0gdGhpcy5pdGVtLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgICAgIGNvbnN0IGl0ZW1PZmZzZXRMZWZ0ID0gbGVmdCArIHJlY3Qud2lkdGg7XHJcbiAgICAgICAgY29uc3QgaXRlbU9mZnNldFRvcCA9IHRvcCArIHJlY3QuaGVpZ2h0O1xyXG5cclxuICAgICAgICBpZiAoaXRlbU9mZnNldExlZnQgPiBjb250YWluZXIud2lkdGgpIHtcclxuICAgICAgICAgICAgbGVmdCA9IE1hdGguZmxvb3IoKGNvbnRhaW5lci53aWR0aCAtIHJlY3Qud2lkdGgpIC8gZGVmYXVsdFdpZHRoKSAqIGRlZmF1bHRXaWR0aDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChpdGVtT2Zmc2V0VG9wID4gY29udGFpbmVyLmhlaWdodCkge1xyXG4gICAgICAgICAgICB0b3AgPSBNYXRoLmZsb29yKChjb250YWluZXIuaGVpZ2h0IC0gcmVjdC5oZWlnaHQpIC8gZGVmYXVsdEhlaWdodCkgKiBkZWZhdWx0SGVpZ2h0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgaW5mbyA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuc3RhdGUuaW5mbywge1xyXG4gICAgICAgICAgICB4OiBsZWZ0LFxyXG4gICAgICAgICAgICB5OiB0b3BcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZShPYmplY3QuYXNzaWduKHt9LCB0aGlzLnN0YXRlLCB7XHJcbiAgICAgICAgICAgIGluZm9cclxuICAgICAgICB9KSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIGluZm87XHJcbiAgICB9XHJcblxyXG4gICAgbW91c2Vtb3ZlKGUpIHtcclxuICAgICAgICBpZiAodGhpcy5kcmFnZ2luZykge1xyXG4gICAgICAgICAgICBlLnRhcmdldC5zdHlsZS5jdXJzb3IgPSAnbW92ZSc7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIGhhbmRsZUtleURvd24oZSkge1xyXG4gICAgICAgIGlmICghdGhpcy5zdGF0ZS5oYXNGb2N1cykge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCByZWN0ID0gdGhpcy5pdGVtLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgICAgIGNvbnN0IHsgd29ya3NwYWNlIH0gPSBzdG9yZS5nZXRTdGF0ZSgpO1xyXG4gICAgICAgIGNvbnN0IGNvbnRhaW5lciA9IHdvcmtzcGFjZS5wcm9qZWN0LmNvbnRhaW5lci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgICAgICB2YXIgaW5mbyA9IHRoaXMuc3RhdGUuaW5mbztcclxuXHJcbiAgICAgICAgdmFyIHNhdmUgPSBmYWxzZTtcclxuICAgICAgICB2YXIgeCwgeTtcclxuICAgICAgICBzd2l0Y2ggKGUua2V5Q29kZSkge1xyXG4gICAgICAgICAgICBjYXNlIDM3OiAvLyBsZWZ0XHJcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICB4ID0gaW5mby54IC0gd29ya3NwYWNlLnByb2plY3QuY29uZmlnLmNlbGxXaWR0aDtcclxuICAgICAgICAgICAgICAgIGlmICh4ID49IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBpbmZvLnggPSB4O1xyXG4gICAgICAgICAgICAgICAgICAgIHNhdmUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgMzg6IC8vIHVwXHJcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICB5ID0gaW5mby55IC0gd29ya3NwYWNlLnByb2plY3QuY29uZmlnLmNlbGxIZWlnaHQ7XHJcbiAgICAgICAgICAgICAgICBpZiAoeSA+PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5mby55ID0geTtcclxuICAgICAgICAgICAgICAgICAgICBzYXZlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIDM5OiAvLyByaWdodFxyXG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgeCA9IGluZm8ueCArIHdvcmtzcGFjZS5wcm9qZWN0LmNvbmZpZy5jZWxsV2lkdGg7XHJcbiAgICAgICAgICAgICAgICBpZiAoKHggKyByZWN0LndpZHRoKSA8PSBjb250YWluZXIud2lkdGgpIHtcclxuICAgICAgICAgICAgICAgICAgICBpbmZvLnggPSB4O1xyXG4gICAgICAgICAgICAgICAgICAgIHNhdmUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgNDA6IC8vIGRvd25cclxuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgIHkgPSBpbmZvLnkgKyB3b3Jrc3BhY2UucHJvamVjdC5jb25maWcuY2VsbEhlaWdodDtcclxuICAgICAgICAgICAgICAgIGlmICgoeSArIHJlY3QuaGVpZ2h0KSA8PSBjb250YWluZXIuaGVpZ2h0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5mby55ID0geTtcclxuICAgICAgICAgICAgICAgICAgICBzYXZlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHNhdmUpIHtcclxuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZShPYmplY3QuYXNzaWduKHt9LCB0aGlzLnN0YXRlLCB7XHJcbiAgICAgICAgICAgICAgICBpbmZvXHJcbiAgICAgICAgICAgIH0pKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMucHJvcHMudXBkYXRlUHJvamVjdCh7XHJcbiAgICAgICAgICAgICAgICBwYXRoOiB0aGlzLnByb3BzLnVpZCxcclxuICAgICAgICAgICAgICAgIHZhbHVlOiBpbmZvXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgdXBkYXRlZF93b3Jrc3BhY2UgPSBzdG9yZS5nZXRTdGF0ZSgpLndvcmtzcGFjZTtcclxuICAgICAgICAgICAgdGhpcy5pdGVtLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdzZi53b3Jrc3BhY2UucHJvamVjdC51cGRhdGUnLCB7XHJcbiAgICAgICAgICAgICAgICBidWJibGVzOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgZGV0YWlsOiB7IFxyXG4gICAgICAgICAgICAgICAgICAgIHdvcmtzcGFjZV9pZDogdXBkYXRlZF93b3Jrc3BhY2UuaWQsXHJcbiAgICAgICAgICAgICAgICAgICAgcHJvamVjdDogdXBkYXRlZF93b3Jrc3BhY2UucHJvamVjdCBcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVNb3VzZUVudGVyKCkge1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5zdGF0ZSwge1xyXG4gICAgICAgICAgICBob3ZlcjogdHJ1ZVxyXG4gICAgICAgIH0pKTtcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVNb3VzZUxlYXZlKCkge1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5zdGF0ZSwge1xyXG4gICAgICAgICAgICBob3ZlcjogZmFsc2VcclxuICAgICAgICB9KSk7XHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgcmVtb3ZlSXRlbShlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblxyXG4gICAgICAgIHZhciB7IHdvcmtzcGFjZSB9ID0gc3RvcmUuZ2V0U3RhdGUoKTtcclxuICAgICAgICB2YXIgcHJvamVjdCA9IHdvcmtzcGFjZS5wcm9qZWN0O1xyXG4gICAgICAgIHZhciBpdGVtcyA9IHByb2plY3QuaXRlbXM7XHJcblxyXG4gICAgICAgIGNvbnN0IGN1cnJlbnRfeiA9IGl0ZW1zW3RoaXMucHJvcHMudWlkXS56O1xyXG4gICAgICAgIHZhciB0b3BfeiA9IGN1cnJlbnRfejtcclxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gaXRlbXMpIHtcclxuICAgICAgICAgICAgaWYgKGtleSAhPT0gdGhpcy5wcm9wcy51aWQgJiYgaXRlbXNba2V5XS56ID4gY3VycmVudF96KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXRlbXNba2V5XS56ID4gdG9wX3opIHtcclxuICAgICAgICAgICAgICAgICAgICB0b3BfeiA9IGl0ZW1zW2tleV0uejtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGl0ZW1zW2tleV0ueiAtPSAxO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBkZWxldGUgaXRlbXNbdGhpcy5wcm9wcy51aWRdO1xyXG5cclxuICAgICAgICB0aGlzLnByb3BzLnVwZGF0ZVByb2plY3RJdGVtcyhpdGVtcyk7XHJcblxyXG4gICAgICAgIGNvbnN0IHVwZGF0ZWRfd29ya3NwYWNlID0gc3RvcmUuZ2V0U3RhdGUoKS53b3Jrc3BhY2U7XHJcbiAgICAgICAgdGhpcy5pdGVtLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdzZi53b3Jrc3BhY2UucHJvamVjdC51cGRhdGUnLCB7XHJcbiAgICAgICAgICAgIGJ1YmJsZXM6IHRydWUsXHJcbiAgICAgICAgICAgIGRldGFpbDogeyBcclxuICAgICAgICAgICAgICAgIHdvcmtzcGFjZV9pZDogdXBkYXRlZF93b3Jrc3BhY2UuaWQsXHJcbiAgICAgICAgICAgICAgICBwcm9qZWN0OiB1cGRhdGVkX3dvcmtzcGFjZS5wcm9qZWN0IFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IGl0ZW1Db250YWluZXJDbGFzc05hbWUsIGluZm8sIGhvdmVyLCBoYXNGb2N1cyB9ID0gdGhpcy5zdGF0ZTtcclxuXHJcbiAgICAgICAgY29uc3QgVGFnTmFtZSA9IHRoaXMucHJvcHMudGFnLm5hbWU7XHJcbiAgICAgICAgdmFyIHRhZyA9IG51bGw7XHJcbiAgICAgICAgaWYgKHRoaXMucHJvcHMudGFnLmlubmVyVmFsdWUpIHtcclxuICAgICAgICAgICAgdGFnID0gKDxUYWdOYW1lPnt0aGlzLnByb3BzLnRhZy52YWx1ZX08L1RhZ05hbWU+KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB2YXIgdGFnQ2xhc3NOYW1lID0gdGhpcy5kZWZhdWx0VGFnQ2xhc3NOYW1lICsgKHRoaXMuc3RhdGUucmVhZE9ubHlWYWx1ZSAmJiB0aGlzLnN0YXRlLnJlYWRPbmx5VmFsdWUubGVuZ3RoID8gJyBnLXZhbGlkJyA6ICcnKTtcclxuICAgICAgICAgICAgdGFnID0gKDxkaXYgY2xhc3NOYW1lPVwiaW5wdXQtY29tcG9uZW50XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxUYWdOYW1lIGNsYXNzTmFtZT17dGFnQ2xhc3NOYW1lfSB0eXBlPVwidGV4dFwiIG5hbWU9e3RoaXMucHJvcHMudGFnLnZhbHVlLnRvTG93ZXJDYXNlKCkucmVwbGFjZSgnICcsICdfJyl9IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e3RoaXMuc3RhdGUucmVhZE9ubHlWYWx1ZX0gb25DaGFuZ2U9e3RoaXMuaGFuZGxlUmVhZE9ubHlWYWx1ZUNoYW5nZWR9PjwvVGFnTmFtZT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZy1sb2dpbi1mb3JtLWlucHV0LXBsYWNlaG9sZGVyXCI+e3RoaXMucHJvcHMudGFnLnZhbHVlfTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj4pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiBcclxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17aXRlbUNvbnRhaW5lckNsYXNzTmFtZX1cclxuICAgICAgICAgICAgICAgIHJlZj17aXRlbSA9PiB0aGlzLml0ZW0gPSBpdGVtfVxyXG4gICAgICAgICAgICAgICAgb25DbGljaz17dGhpcy5oYW5kbGVJdGVtQ29udGFpbmVyQ2xpY2t9XHJcbiAgICAgICAgICAgICAgICBkcmFnZ2FibGU9e3RydWV9XHJcbiAgICAgICAgICAgICAgICBvbkRyYWdTdGFydD17dGhpcy5oYW5kbGVEcmFnU3RhcnR9XHJcbiAgICAgICAgICAgICAgICBvbkRyYWc9e3RoaXMuaGFuZGxlRHJhZ31cclxuICAgICAgICAgICAgICAgIG9uRHJhZ0VuZD17dGhpcy5oYW5kbGVEcmFnRW5kfVxyXG4gICAgICAgICAgICAgICAgb25Nb3VzZUVudGVyPXt0aGlzLmhhbmRsZU1vdXNlRW50ZXJ9XHJcbiAgICAgICAgICAgICAgICBvbk1vdXNlTGVhdmU9e3RoaXMuaGFuZGxlTW91c2VMZWF2ZX1cclxuICAgICAgICAgICAgICAgIHN0eWxlPXt7IFxyXG4gICAgICAgICAgICAgICAgICAgIHRvcDogaW5mby55LCBcclxuICAgICAgICAgICAgICAgICAgICBsZWZ0OiBpbmZvLngsXHJcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IGluZm8ud2lkdGgsXHJcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiBpbmZvLmhlaWdodCxcclxuICAgICAgICAgICAgICAgICAgICB6SW5kZXg6IGluZm8ueiArIDEwMFxyXG4gICAgICAgICAgICAgICAgfX0+XHJcbiAgICAgICAgICAgICAgICB7dGFnfVxyXG4gICAgICAgICAgICAgICAge2hvdmVyIHx8IGhhc0ZvY3VzID9cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaXRlbS1hY3Rpb25zXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjbG9zZS1pY29uLWl0ZW0gc2hhZG93LW5vbmVcIiBvbkNsaWNrPXt0aGlzLnJlbW92ZUl0ZW19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJjbG9zZS1pY29uXCI+PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA6IG51bGx9XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IEl0ZW0gPSBjb25uZWN0KG1hcFN0YXRlVG9Qcm9wcywgbWFwRGlzcGF0Y2hUb1Byb3BzKShJdGVtQ29tcG9uZW50KTtcclxuZXhwb3J0IGRlZmF1bHQgSXRlbTsiLCJleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiKSh0cnVlKTtcbi8vIE1vZHVsZVxuZXhwb3J0cy5wdXNoKFttb2R1bGUuaWQsIFwiLml0ZW0tY29udGFpbmVyIHtcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIGJvcmRlcjogMXB4IHNvbGlkICM3ODc4Nzg7XFxuICBiYWNrZ3JvdW5kOiByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuOSk7XFxuICBwYWRkaW5nOiA0cHg7XFxuICBjdXJzb3I6IG1vdmU7IH1cXG4gIC5pdGVtLWNvbnRhaW5lciBoMSwgLml0ZW0tY29udGFpbmVyIGgyLCAuaXRlbS1jb250YWluZXIgaDMsIC5pdGVtLWNvbnRhaW5lciBoNCwgLml0ZW0tY29udGFpbmVyIGg1LCAuaXRlbS1jb250YWluZXIgaDYge1xcbiAgICBtYXJnaW46IDA7IH1cXG4gIC5pdGVtLWNvbnRhaW5lci5mb2N1cyB7XFxuICAgIGJhY2tncm91bmQ6IHJnYmEoMjQwLCAyNDAsIDI0MCwgMC45KTsgfVxcbiAgICAuaXRlbS1jb250YWluZXIuZm9jdXMgLml0ZW0tYWN0aW9ucyAuY2xvc2UtaWNvbi1pdGVtIHtcXG4gICAgICBiYWNrZ3JvdW5kOiByZ2JhKDI0MCwgMjQwLCAyNDAsIDAuNSk7IH1cXG4gIC5pdGVtLWNvbnRhaW5lciAuaXRlbS1hY3Rpb25zIHtcXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgICByaWdodDogMXB4O1xcbiAgICB0b3A6IDFweDsgfVxcbiAgICAuaXRlbS1jb250YWluZXIgLml0ZW0tYWN0aW9ucyAuY2xvc2UtaWNvbi1pdGVtIHtcXG4gICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XFxuICAgICAgY3Vyc29yOiBwb2ludGVyO1xcbiAgICAgIGJhY2tncm91bmQ6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC41KTtcXG4gICAgICBwYWRkaW5nOiAycHg7XFxuICAgICAgYm9yZGVyOiAwO1xcbiAgICAgIGhlaWdodDogMThweDtcXG4gICAgICB3aWR0aDogMThweDsgfVxcbiAgICAgIC5pdGVtLWNvbnRhaW5lciAuaXRlbS1hY3Rpb25zIC5jbG9zZS1pY29uLWl0ZW0gLmNsb3NlLWljb24ge1xcbiAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgICAgICAgdG9wOiAzcHg7XFxuICAgICAgICBsZWZ0OiA0cHg7XFxuICAgICAgICBmb250LXNpemU6IDE0cHg7XFxuICAgICAgICBtYXJnaW4tdG9wOiAtMXB4OyB9XFxuICAuaXRlbS1jb250YWluZXIgLmlucHV0LWNvbXBvbmVudCB7XFxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gICAgd2lkdGg6IDEwMCU7XFxuICAgIG1pbi1oZWlnaHQ6IDM2cHg7XFxuICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMjQ0LCAyNDQsIDI0NCwgMC40KTsgfVxcbiAgICBAbWVkaWEgKG1heC13aWR0aDogNjAwcHgpIHtcXG4gICAgICAuaXRlbS1jb250YWluZXIgLmlucHV0LWNvbXBvbmVudCB7XFxuICAgICAgICBmbG9hdDogbm9uZTtcXG4gICAgICAgIHdpZHRoOiAxMDAlOyB9IH1cXG4gICAgLml0ZW0tY29udGFpbmVyIC5pbnB1dC1jb21wb25lbnQ6bnRoLW9mLXR5cGUoMm4pIHtcXG4gICAgICBmbG9hdDogcmlnaHQ7IH1cXG4gICAgICBAbWVkaWEgKG1heC13aWR0aDogNjAwcHgpIHtcXG4gICAgICAgIC5pdGVtLWNvbnRhaW5lciAuaW5wdXQtY29tcG9uZW50Om50aC1vZi10eXBlKDJuKSB7XFxuICAgICAgICAgIGZsb2F0OiBub25lO1xcbiAgICAgICAgICB3aWR0aDogMTAwJTsgfSB9XFxuICAgIC5pdGVtLWNvbnRhaW5lciAuaW5wdXQtY29tcG9uZW50IHNwYW4ge1xcbiAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gICAgICB0b3A6IDQ1JTtcXG4gICAgICBsZWZ0OiAwLjc1cmVtO1xcbiAgICAgIGNvbG9yOiByZ2JhKDAsIDAsIDAsIDAuOSk7XFxuICAgICAgcG9pbnRlci1ldmVudHM6IG5vbmU7XFxuICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC00MCUpO1xcbiAgICAgIHRyYW5zaXRpb246IC4yNXM7IH1cXG4gICAgICAuaXRlbS1jb250YWluZXIgLmlucHV0LWNvbXBvbmVudCBzcGFuLmlzLWFjdGl2ZSB7XFxuICAgICAgICBmb250LXNpemU6IDEycHg7XFxuICAgICAgICBjb2xvcjogcmdiYSgwLCAwLCAwLCAwLjkpO1xcbiAgICAgICAgb3BhY2l0eTogLjg1OyB9XFxuICAgIC5pdGVtLWNvbnRhaW5lciAuaW5wdXQtY29tcG9uZW50IGlucHV0LCAuaXRlbS1jb250YWluZXIgLmlucHV0LWNvbXBvbmVudCAuZHJvcGRvd24tdG9nZ2xlIHtcXG4gICAgICB3aWR0aDogMTAwJTtcXG4gICAgICBoZWlnaHQ6IDEwMCU7XFxuICAgICAgcGFkZGluZy10b3A6IDEwcHg7XFxuICAgICAgcGFkZGluZy1sZWZ0OiAwLjc1cmVtO1xcbiAgICAgIHBhZGRpbmctcmlnaHQ6IDAuNzVyZW07XFxuICAgICAgYm9yZGVyLXJhZGl1czogMnB4O1xcbiAgICAgIGZvbnQtc2l6ZTogMTZweDtcXG4gICAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuOSk7XFxuICAgICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcXG4gICAgICAtbW96LWFwcGVhcmFuY2U6IG5vbmUgIWltcG9ydGFudDtcXG4gICAgICAtd2Via2l0LWFwcGVhcmFuY2U6IG5vbmUgIWltcG9ydGFudDtcXG4gICAgICBib3JkZXI6IDFweCBzb2xpZCAjNzg3ODc4OyB9XFxuICAgICAgLml0ZW0tY29udGFpbmVyIC5pbnB1dC1jb21wb25lbnQgaW5wdXQuZy10b3VjaGVkLmctaW52YWxpZCwgLml0ZW0tY29udGFpbmVyIC5pbnB1dC1jb21wb25lbnQgLmRyb3Bkb3duLXRvZ2dsZS5nLXRvdWNoZWQuZy1pbnZhbGlkIHtcXG4gICAgICAgIGJvcmRlcjogMXB4IHNvbGlkO1xcbiAgICAgICAgYm9yZGVyLXJhZGl1czogMnB4OyB9XFxuICAgICAgLml0ZW0tY29udGFpbmVyIC5pbnB1dC1jb21wb25lbnQgaW5wdXQuZy10b3VjaGVkLCAuaXRlbS1jb250YWluZXIgLmlucHV0LWNvbXBvbmVudCBpbnB1dC5nLXZhbGlkLCAuaXRlbS1jb250YWluZXIgLmlucHV0LWNvbXBvbmVudCBpbnB1dDpmb2N1cywgLml0ZW0tY29udGFpbmVyIC5pbnB1dC1jb21wb25lbnQgLmRyb3Bkb3duLXRvZ2dsZS5nLXRvdWNoZWQsIC5pdGVtLWNvbnRhaW5lciAuaW5wdXQtY29tcG9uZW50IC5kcm9wZG93bi10b2dnbGUuZy12YWxpZCwgLml0ZW0tY29udGFpbmVyIC5pbnB1dC1jb21wb25lbnQgLmRyb3Bkb3duLXRvZ2dsZTpmb2N1cyB7XFxuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuOSk7IH1cXG4gICAgICAuaXRlbS1jb250YWluZXIgLmlucHV0LWNvbXBvbmVudCBpbnB1dC5nLXRvdWNoZWQgfiBzcGFuLCAuaXRlbS1jb250YWluZXIgLmlucHV0LWNvbXBvbmVudCBpbnB1dC5nLXZhbGlkIH4gc3BhbiwgLml0ZW0tY29udGFpbmVyIC5pbnB1dC1jb21wb25lbnQgLmRyb3Bkb3duLXRvZ2dsZS5nLXRvdWNoZWQgfiBzcGFuLCAuaXRlbS1jb250YWluZXIgLmlucHV0LWNvbXBvbmVudCAuZHJvcGRvd24tdG9nZ2xlLmctdmFsaWQgfiBzcGFuIHtcXG4gICAgICAgIGZvbnQtc2l6ZTogMTJweDtcXG4gICAgICAgIG9wYWNpdHk6IC44NTsgfVxcbiAgICAgIC5pdGVtLWNvbnRhaW5lciAuaW5wdXQtY29tcG9uZW50IGlucHV0OmZvY3VzLCAuaXRlbS1jb250YWluZXIgLmlucHV0LWNvbXBvbmVudCAuZHJvcGRvd24tdG9nZ2xlOmZvY3VzIHtcXG4gICAgICAgIG91dGxpbmU6IG5vbmU7IH1cXG4gICAgICAgIC5pdGVtLWNvbnRhaW5lciAuaW5wdXQtY29tcG9uZW50IGlucHV0OmZvY3VzIH4gc3BhbiwgLml0ZW0tY29udGFpbmVyIC5pbnB1dC1jb21wb25lbnQgLmRyb3Bkb3duLXRvZ2dsZTpmb2N1cyB+IHNwYW4ge1xcbiAgICAgICAgICBmb250LXNpemU6IDEycHg7XFxuICAgICAgICAgIG9wYWNpdHk6IC44NTsgfVxcbiAgICAuaXRlbS1jb250YWluZXIgLmlucHV0LWNvbXBvbmVudCAuZHJvcGRvd24tdG9nZ2xlLmctdG91Y2hlZCB+IHNwYW4sIC5pdGVtLWNvbnRhaW5lciAuaW5wdXQtY29tcG9uZW50IC5kcm9wZG93bi10b2dnbGUuZy12YWxpZCB+IHNwYW4ge1xcbiAgICAgIHRvcDogMTUlOyB9XFxuICAgIC5pdGVtLWNvbnRhaW5lciAuaW5wdXQtY29tcG9uZW50IC5kcm9wZG93bi10b2dnbGU6Zm9jdXMge1xcbiAgICAgIG91dGxpbmU6IG5vbmU7IH1cXG4gICAgICAuaXRlbS1jb250YWluZXIgLmlucHV0LWNvbXBvbmVudCAuZHJvcGRvd24tdG9nZ2xlOmZvY3VzIH4gc3BhbiB7XFxuICAgICAgICB0b3A6IDE1JTsgfVxcbiAgICAuaXRlbS1jb250YWluZXIgLmlucHV0LWNvbXBvbmVudCAuZHJvcGRvd24tdG9nZ2xlIGgxLCAuaXRlbS1jb250YWluZXIgLmlucHV0LWNvbXBvbmVudCAuZHJvcGRvd24tdG9nZ2xlIGgyLCAuaXRlbS1jb250YWluZXIgLmlucHV0LWNvbXBvbmVudCAuZHJvcGRvd24tdG9nZ2xlIGgzLCAuaXRlbS1jb250YWluZXIgLmlucHV0LWNvbXBvbmVudCAuZHJvcGRvd24tdG9nZ2xlIGg0LCAuaXRlbS1jb250YWluZXIgLmlucHV0LWNvbXBvbmVudCAuZHJvcGRvd24tdG9nZ2xlIGg1LCAuaXRlbS1jb250YWluZXIgLmlucHV0LWNvbXBvbmVudCAuZHJvcGRvd24tdG9nZ2xlIGg2IHtcXG4gICAgICBtYXJnaW46IDA7IH1cXG4gICAgLml0ZW0tY29udGFpbmVyIC5pbnB1dC1jb21wb25lbnQgaW5wdXQuZy10b3VjaGVkIH4gc3BhbiwgLml0ZW0tY29udGFpbmVyIC5pbnB1dC1jb21wb25lbnQgaW5wdXQuZy12YWxpZCB+IHNwYW4ge1xcbiAgICAgIHRvcDogMjAlOyB9XFxuICAgIC5pdGVtLWNvbnRhaW5lciAuaW5wdXQtY29tcG9uZW50IGlucHV0OmZvY3VzIHtcXG4gICAgICBvdXRsaW5lOiBub25lOyB9XFxuICAgICAgLml0ZW0tY29udGFpbmVyIC5pbnB1dC1jb21wb25lbnQgaW5wdXQ6Zm9jdXMgfiBzcGFuIHtcXG4gICAgICAgIHRvcDogMjAlOyB9XFxuXCIsIFwiXCIse1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wiQzovVXNlcnMvZ2Fycmkvc291cmNlL3JlcG9zL3NuYXBmb3JtL2NsaWVudC9lbmdpbmUvYXNzZXRzL3N0eWxlL2NvbXBvbmVudHMvaXRlbS9jbGllbnQvZW5naW5lL2Fzc2V0cy9zdHlsZS9jb21wb25lbnRzL2l0ZW0vaXRlbS5zY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUFBO0VBQ0ksa0JBQWtCO0VBQ2xCLHlCQUF5QjtFQUN6QixvQ0FBb0M7RUFDcEMsWUFBWTtFQUNaLFlBQVksRUFBQTtFQUxoQjtJQVFRLFNBQVMsRUFBQTtFQVJqQjtJQVlRLG9DQUFvQyxFQUFBO0lBWjVDO01BZ0JnQixvQ0FBb0MsRUFBQTtFQWhCcEQ7SUFzQlEsa0JBQWtCO0lBQ2xCLFVBQVU7SUFDVixRQUFRLEVBQUE7SUF4QmhCO01BMkJZLHFCQUFxQjtNQUNyQixlQUFlO01BQ2Ysb0NBQW9DO01BQ3BDLFlBQVk7TUFDWixTQUFTO01BQ1QsWUFBWTtNQUNaLFdBQVcsRUFBQTtNQWpDdkI7UUFvQ2dCLGtCQUFrQjtRQUNsQixRQUFRO1FBQ1IsU0FBUztRQUNULGVBQWU7UUFDZixnQkFBZ0IsRUFBQTtFQXhDaEM7SUE4Q1Esa0JBQWtCO0lBQ2xCLFdBQVc7SUFDWCxnQkFBZ0I7SUFDaEIsMENBQXlDLEVBQUE7SUFDekM7TUFsRFI7UUFtRFksV0FBVztRQUNYLFdBQVcsRUFBQSxFQXlGbEI7SUE3SUw7TUF1RFksWUFBWSxFQUFBO01BQ1o7UUF4RFo7VUF5RGdCLFdBQVc7VUFDWCxXQUFXLEVBQUEsRUFFbEI7SUE1RFQ7TUE4RFksa0JBQWtCO01BQ2xCLFFBQVE7TUFDUixhQUFhO01BQ2IseUJBQXlCO01BQ3pCLG9CQUFvQjtNQUNwQiwyQkFBMkI7TUFDM0IsZ0JBQWdCLEVBQUE7TUFwRTVCO1FBc0VnQixlQUFlO1FBQ2YseUJBQXlCO1FBQ3pCLFlBQVksRUFBQTtJQXhFNUI7TUE0RVksV0FBVztNQUNYLFlBQVk7TUFDWixpQkFBaUI7TUFDakIscUJBQXFCO01BQ3JCLHNCQUFzQjtNQUN0QixrQkFBa0I7TUFDbEIsZUFBZTtNQUNmLDBDQUEwQztNQUMxQyxzQkFBc0I7TUFDdEIsZ0NBQWdDO01BQ2hDLG1DQUFtQztNQUNuQyx5QkFBeUIsRUFBQTtNQXZGckM7UUF5RmdCLGlCQUFpQjtRQUNqQixrQkFBa0IsRUFBQTtNQTFGbEM7UUE2RmdCLDBDQUEwQyxFQUFBO01BN0YxRDtRQWlHb0IsZUFBZTtRQUNmLFlBQVksRUFBQTtNQWxHaEM7UUFzR2dCLGFBQWEsRUFBQTtRQXRHN0I7VUF3R29CLGVBQWU7VUFDZixZQUFZLEVBQUE7SUF6R2hDO01BaUhvQixRQUFRLEVBQUE7SUFqSDVCO01BcUhnQixhQUFhLEVBQUE7TUFySDdCO1FBdUhvQixRQUFRLEVBQUE7SUF2SDVCO01BNEhnQixTQUFTLEVBQUE7SUE1SHpCO01BbUlvQixRQUFRLEVBQUE7SUFuSTVCO01BdUlnQixhQUFhLEVBQUE7TUF2STdCO1FBeUlvQixRQUFRLEVBQUFcIixcImZpbGVcIjpcIml0ZW0uc2Nzc1wiLFwic291cmNlc0NvbnRlbnRcIjpbXCIuaXRlbS1jb250YWluZXIge1xcclxcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XFxyXFxuICAgIGJvcmRlcjogMXB4IHNvbGlkICM3ODc4Nzg7XFxyXFxuICAgIGJhY2tncm91bmQ6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC45KTtcXHJcXG4gICAgcGFkZGluZzogNHB4O1xcclxcbiAgICBjdXJzb3I6IG1vdmU7XFxyXFxuXFxyXFxuICAgIGgxLCBoMiwgaDMsIGg0LCBoNSwgaDYge1xcclxcbiAgICAgICAgbWFyZ2luOiAwO1xcclxcbiAgICB9XFxyXFxuXFxyXFxuICAgICYuZm9jdXMge1xcclxcbiAgICAgICAgYmFja2dyb3VuZDogcmdiYSgyNDAsIDI0MCwgMjQwLCAwLjkpO1xcclxcblxcclxcbiAgICAgICAgLml0ZW0tYWN0aW9ucyB7XFxyXFxuICAgICAgICAgICAgLmNsb3NlLWljb24taXRlbSB7XFxyXFxuICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6IHJnYmEoMjQwLCAyNDAsIDI0MCwgMC41KTtcXHJcXG4gICAgICAgICAgICB9XFxyXFxuICAgICAgICB9XFxyXFxuICAgIH1cXHJcXG5cXHJcXG4gICAgLml0ZW0tYWN0aW9ucyB7XFxyXFxuICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XFxyXFxuICAgICAgICByaWdodDogMXB4O1xcclxcbiAgICAgICAgdG9wOiAxcHg7XFxyXFxuXFxyXFxuICAgICAgICAuY2xvc2UtaWNvbi1pdGVtIHtcXHJcXG4gICAgICAgICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XFxyXFxuICAgICAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xcclxcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC41KTtcXHJcXG4gICAgICAgICAgICBwYWRkaW5nOiAycHg7XFxyXFxuICAgICAgICAgICAgYm9yZGVyOiAwO1xcclxcbiAgICAgICAgICAgIGhlaWdodDogMThweDtcXHJcXG4gICAgICAgICAgICB3aWR0aDogMThweDtcXHJcXG4gICAgICAgICAgICBcXHJcXG4gICAgICAgICAgICAuY2xvc2UtaWNvbiB7XFxyXFxuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXHJcXG4gICAgICAgICAgICAgICAgdG9wOiAzcHg7XFxyXFxuICAgICAgICAgICAgICAgIGxlZnQ6IDRweDtcXHJcXG4gICAgICAgICAgICAgICAgZm9udC1zaXplOiAxNHB4O1xcclxcbiAgICAgICAgICAgICAgICBtYXJnaW4tdG9wOiAtMXB4O1xcclxcbiAgICAgICAgICAgIH1cXHJcXG4gICAgICAgIH1cXHJcXG4gICAgfVxcclxcblxcclxcbiAgICAuaW5wdXQtY29tcG9uZW50IHtcXHJcXG4gICAgICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcXHJcXG4gICAgICAgIHdpZHRoOiAxMDAlO1xcclxcbiAgICAgICAgbWluLWhlaWdodDogMzZweDtcXHJcXG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMjQ0LCAyNDQsIDI0NCwgLjQpO1xcclxcbiAgICAgICAgQG1lZGlhIChtYXgtd2lkdGg6IDYwMHB4KSB7XFxyXFxuICAgICAgICAgICAgZmxvYXQ6IG5vbmU7XFxyXFxuICAgICAgICAgICAgd2lkdGg6IDEwMCU7XFxyXFxuICAgICAgICB9XFxyXFxuICAgICAgICAmOm50aC1vZi10eXBlKDJuKSB7XFxyXFxuICAgICAgICAgICAgZmxvYXQ6IHJpZ2h0O1xcclxcbiAgICAgICAgICAgIEBtZWRpYSAobWF4LXdpZHRoOiA2MDBweCkge1xcclxcbiAgICAgICAgICAgICAgICBmbG9hdDogbm9uZTtcXHJcXG4gICAgICAgICAgICAgICAgd2lkdGg6IDEwMCU7XFxyXFxuICAgICAgICAgICAgfVxcclxcbiAgICAgICAgfVxcclxcbiAgICAgICAgc3BhbiB7XFxyXFxuICAgICAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xcclxcbiAgICAgICAgICAgIHRvcDogNDUlO1xcclxcbiAgICAgICAgICAgIGxlZnQ6IDAuNzVyZW07XFxyXFxuICAgICAgICAgICAgY29sb3I6IHJnYmEoMCwgMCwgMCwgMC45KTtcXHJcXG4gICAgICAgICAgICBwb2ludGVyLWV2ZW50czogbm9uZTtcXHJcXG4gICAgICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTQwJSk7XFxyXFxuICAgICAgICAgICAgdHJhbnNpdGlvbjogLjI1cztcXHJcXG4gICAgICAgICAgICAmLmlzLWFjdGl2ZSB7XFxyXFxuICAgICAgICAgICAgICAgIGZvbnQtc2l6ZTogMTJweDtcXHJcXG4gICAgICAgICAgICAgICAgY29sb3I6IHJnYmEoMCwgMCwgMCwgMC45KTtcXHJcXG4gICAgICAgICAgICAgICAgb3BhY2l0eTogLjg1O1xcclxcbiAgICAgICAgICAgIH1cXHJcXG4gICAgICAgIH1cXHJcXG4gICAgICAgIGlucHV0LCAuZHJvcGRvd24tdG9nZ2xlIHtcXHJcXG4gICAgICAgICAgICB3aWR0aDogMTAwJTtcXHJcXG4gICAgICAgICAgICBoZWlnaHQ6IDEwMCU7XFxyXFxuICAgICAgICAgICAgcGFkZGluZy10b3A6IDEwcHg7XFxyXFxuICAgICAgICAgICAgcGFkZGluZy1sZWZ0OiAwLjc1cmVtO1xcclxcbiAgICAgICAgICAgIHBhZGRpbmctcmlnaHQ6IDAuNzVyZW07XFxyXFxuICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogMnB4O1xcclxcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMTZweDtcXHJcXG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuOSk7XFxyXFxuICAgICAgICAgICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcXHJcXG4gICAgICAgICAgICAtbW96LWFwcGVhcmFuY2U6IG5vbmUgIWltcG9ydGFudDtcXHJcXG4gICAgICAgICAgICAtd2Via2l0LWFwcGVhcmFuY2U6IG5vbmUgIWltcG9ydGFudDtcXHJcXG4gICAgICAgICAgICBib3JkZXI6IDFweCBzb2xpZCAjNzg3ODc4O1xcclxcbiAgICAgICAgICAgICYuZy10b3VjaGVkLmctaW52YWxpZCB7XFxyXFxuICAgICAgICAgICAgICAgIGJvcmRlcjogMXB4IHNvbGlkO1xcclxcbiAgICAgICAgICAgICAgICBib3JkZXItcmFkaXVzOiAycHg7XFxyXFxuICAgICAgICAgICAgfVxcclxcbiAgICAgICAgICAgICYuZy10b3VjaGVkLCAmLmctdmFsaWQsICY6Zm9jdXMge1xcclxcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuOSk7XFxyXFxuICAgICAgICAgICAgfVxcclxcbiAgICAgICAgICAgICYuZy10b3VjaGVkLCAmLmctdmFsaWQge1xcclxcbiAgICAgICAgICAgICAgICB+c3BhbiB7XFxyXFxuICAgICAgICAgICAgICAgICAgICBmb250LXNpemU6IDEycHg7XFxyXFxuICAgICAgICAgICAgICAgICAgICBvcGFjaXR5OiAuODU7XFxyXFxuICAgICAgICAgICAgICAgIH1cXHJcXG4gICAgICAgICAgICB9XFxyXFxuICAgICAgICAgICAgJjpmb2N1cyB7XFxyXFxuICAgICAgICAgICAgICAgIG91dGxpbmU6IG5vbmU7XFxyXFxuICAgICAgICAgICAgICAgIH5zcGFuIHtcXHJcXG4gICAgICAgICAgICAgICAgICAgIGZvbnQtc2l6ZTogMTJweDtcXHJcXG4gICAgICAgICAgICAgICAgICAgIG9wYWNpdHk6IC44NTtcXHJcXG4gICAgICAgICAgICAgICAgfVxcclxcbiAgICAgICAgICAgIH1cXHJcXG4gICAgICAgIH1cXHJcXG5cXHJcXG4gICAgICAgIC5kcm9wZG93bi10b2dnbGUge1xcclxcbiAgICAgICAgICAgICYuZy10b3VjaGVkLCAmLmctdmFsaWQge1xcclxcbiAgICAgICAgICAgICAgICB+c3BhbiB7XFxyXFxuICAgICAgICAgICAgICAgICAgICB0b3A6IDE1JTtcXHJcXG4gICAgICAgICAgICAgICAgfVxcclxcbiAgICAgICAgICAgIH1cXHJcXG4gICAgICAgICAgICAmOmZvY3VzIHtcXHJcXG4gICAgICAgICAgICAgICAgb3V0bGluZTogbm9uZTtcXHJcXG4gICAgICAgICAgICAgICAgfnNwYW4ge1xcclxcbiAgICAgICAgICAgICAgICAgICAgdG9wOiAxNSU7XFxyXFxuICAgICAgICAgICAgICAgIH1cXHJcXG4gICAgICAgICAgICB9XFxyXFxuXFxyXFxuICAgICAgICAgICAgaDEsIGgyLCBoMywgaDQsIGg1LCBoNiB7XFxyXFxuICAgICAgICAgICAgICAgIG1hcmdpbjogMDtcXHJcXG4gICAgICAgICAgICB9XFxyXFxuICAgICAgICB9XFxyXFxuXFxyXFxuICAgICAgICBpbnB1dCB7XFxyXFxuICAgICAgICAgICAgJi5nLXRvdWNoZWQsICYuZy12YWxpZCB7XFxyXFxuICAgICAgICAgICAgICAgIH5zcGFuIHtcXHJcXG4gICAgICAgICAgICAgICAgICAgIHRvcDogMjAlO1xcclxcbiAgICAgICAgICAgICAgICB9XFxyXFxuICAgICAgICAgICAgfVxcclxcbiAgICAgICAgICAgICY6Zm9jdXMge1xcclxcbiAgICAgICAgICAgICAgICBvdXRsaW5lOiBub25lO1xcclxcbiAgICAgICAgICAgICAgICB+c3BhbiB7XFxyXFxuICAgICAgICAgICAgICAgICAgICB0b3A6IDIwJTtcXHJcXG4gICAgICAgICAgICAgICAgfVxcclxcbiAgICAgICAgICAgIH1cXHJcXG4gICAgICAgIH1cXHJcXG4gICAgfVxcclxcbn1cIl0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcblxuIiwiXG52YXIgY29udGVudCA9IHJlcXVpcmUoXCIhIS4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzPz9yZWYtLTYtMSEuLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvbGliL2xvYWRlci5qcz8/cmVmLS02LTIhLi9pdGVtLnNjc3NcIik7XG5cbmlmKHR5cGVvZiBjb250ZW50ID09PSAnc3RyaW5nJykgY29udGVudCA9IFtbbW9kdWxlLmlkLCBjb250ZW50LCAnJ11dO1xuXG52YXIgdHJhbnNmb3JtO1xudmFyIGluc2VydEludG87XG5cblxuXG52YXIgb3B0aW9ucyA9IHtcImhtclwiOnRydWV9XG5cbm9wdGlvbnMudHJhbnNmb3JtID0gdHJhbnNmb3JtXG5vcHRpb25zLmluc2VydEludG8gPSB1bmRlZmluZWQ7XG5cbnZhciB1cGRhdGUgPSByZXF1aXJlKFwiIS4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvbGliL2FkZFN0eWxlcy5qc1wiKShjb250ZW50LCBvcHRpb25zKTtcblxuaWYoY29udGVudC5sb2NhbHMpIG1vZHVsZS5leHBvcnRzID0gY29udGVudC5sb2NhbHM7XG5cbmlmKG1vZHVsZS5ob3QpIHtcblx0bW9kdWxlLmhvdC5hY2NlcHQoXCIhIS4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzPz9yZWYtLTYtMSEuLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvbGliL2xvYWRlci5qcz8/cmVmLS02LTIhLi9pdGVtLnNjc3NcIiwgZnVuY3Rpb24oKSB7XG5cdFx0dmFyIG5ld0NvbnRlbnQgPSByZXF1aXJlKFwiISEuLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcz8/cmVmLS02LTEhLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2xpYi9sb2FkZXIuanM/P3JlZi0tNi0yIS4vaXRlbS5zY3NzXCIpO1xuXG5cdFx0aWYodHlwZW9mIG5ld0NvbnRlbnQgPT09ICdzdHJpbmcnKSBuZXdDb250ZW50ID0gW1ttb2R1bGUuaWQsIG5ld0NvbnRlbnQsICcnXV07XG5cblx0XHR2YXIgbG9jYWxzID0gKGZ1bmN0aW9uKGEsIGIpIHtcblx0XHRcdHZhciBrZXksIGlkeCA9IDA7XG5cblx0XHRcdGZvcihrZXkgaW4gYSkge1xuXHRcdFx0XHRpZighYiB8fCBhW2tleV0gIT09IGJba2V5XSkgcmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRpZHgrKztcblx0XHRcdH1cblxuXHRcdFx0Zm9yKGtleSBpbiBiKSBpZHgtLTtcblxuXHRcdFx0cmV0dXJuIGlkeCA9PT0gMDtcblx0XHR9KGNvbnRlbnQubG9jYWxzLCBuZXdDb250ZW50LmxvY2FscykpO1xuXG5cdFx0aWYoIWxvY2FscykgdGhyb3cgbmV3IEVycm9yKCdBYm9ydGluZyBDU1MgSE1SIGR1ZSB0byBjaGFuZ2VkIGNzcy1tb2R1bGVzIGxvY2Fscy4nKTtcblxuXHRcdHVwZGF0ZShuZXdDb250ZW50KTtcblx0fSk7XG5cblx0bW9kdWxlLmhvdC5kaXNwb3NlKGZ1bmN0aW9uKCkgeyB1cGRhdGUoKTsgfSk7XG59Il0sInNvdXJjZVJvb3QiOiIifQ==