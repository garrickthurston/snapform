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
      itemContainerClassName: defaultItemContainerClassName
    }));
  }

  handleItemContainerClick() {
    this.setState(Object.assign({}, this.state, {
      itemContainerClassName: defaultItemContainerClassName + ' focus'
    }));
    const {
      workspace
    } = _common_config_redux_redux_store__WEBPACK_IMPORTED_MODULE_2__["store"].getState().engineReducer;
    var items = workspace.project.items;
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
    e.preventDefault();

    if (!this.state.itemContainerClassName.indexOf('focus') === -1) {
      return;
    }

    const {
      workspace
    } = _common_config_redux_redux_store__WEBPACK_IMPORTED_MODULE_2__["store"].getState().engineReducer;
    var info = this.state.info;
    var save = false;

    switch (e.keyCode) {
      case 37:
        // left
        info.x -= workspace.project.config.cellWidth;
        save = true;
        break;

      case 38:
        // up
        info.y -= workspace.project.config.cellHeight;
        save = true;
        break;

      case 39:
        // right
        info.x += workspace.project.config.cellWidth;
        save = true;
        break;

      case 40:
        // down
        info.y += workspace.project.config.cellHeight;
        save = true;
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

  render() {
    const {
      itemContainerClassName,
      info,
      tag
    } = this.state;
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: itemContainerClassName,
      ref: item => this.item = item,
      onClick: this.handleItemContainerClick,
      draggable: true,
      onDragStart: this.handleDragStart,
      onDrag: this.handleDrag,
      onDragEnd: this.handleDragEnd,
      style: {
        top: info.y,
        left: info.x,
        width: info.width,
        height: info.height,
        zIndex: info.z + 100
      }
    }, tag);
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
exports.push([module.i, ".item-container {\n  position: absolute;\n  border: 1px solid #787878;\n  background: rgba(255, 255, 255, 0.9);\n  padding: 4px;\n  cursor: move; }\n  .item-container h1, .item-container h2, .item-container h3, .item-container h4, .item-container h5, .item-container h6 {\n    margin: 0; }\n  .item-container.focus {\n    background: rgba(240, 240, 240, 0.9); }\n", "",{"version":3,"sources":["C:/Users/garri/source/repos/snapform/client/engine/assets/style/components/item/client/engine/assets/style/components/item/item.scss"],"names":[],"mappings":"AAAA;EACI,kBAAkB;EAClB,yBAAyB;EACzB,oCAAoC;EACpC,YAAY;EACZ,YAAY,EAAA;EALhB;IAQQ,SAAS,EAAA;EARjB;IAYQ,oCAAoC,EAAA","file":"item.scss","sourcesContent":[".item-container {\r\n    position: absolute;\r\n    border: 1px solid #787878;\r\n    background: rgba(255, 255, 255, 0.9);\r\n    padding: 4px;\r\n    cursor: move;\r\n\r\n    h1, h2, h3, h4, h5, h6 {\r\n        margin: 0;\r\n    }\r\n\r\n    &.focus {\r\n        background: rgba(240, 240, 240, 0.9);\r\n    }\r\n}"],"sourceRoot":""}]);



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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9jbGllbnQvZW5naW5lL3NyYy9jb21wb25lbnRzL2l0ZW0vaXRlbS5jb21wb25lbnQuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L2VuZ2luZS9hc3NldHMvc3R5bGUvY29tcG9uZW50cy9pdGVtL2l0ZW0uc2NzcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvZW5naW5lL2Fzc2V0cy9zdHlsZS9jb21wb25lbnRzL2l0ZW0vaXRlbS5zY3NzPzgyMjkiXSwibmFtZXMiOlsibWFwU3RhdGVUb1Byb3BzIiwic3RhdGUiLCJtYXBEaXNwYXRjaFRvUHJvcHMiLCJkaXNwYXRjaCIsInVwZGF0ZVByb2plY3QiLCJwYXlsb2FkIiwiZ0NsaWNrZWQiLCJ1cGRhdGVQcm9qZWN0SXRlbXMiLCJkZWZhdWx0SXRlbUNvbnRhaW5lckNsYXNzTmFtZSIsIkl0ZW1Db21wb25lbnQiLCJDb21wb25lbnQiLCJjb25zdHJ1Y3RvciIsInByb3BzIiwiVGFnTmFtZSIsInRhZyIsIm5hbWUiLCJpbm5lclZhbHVlIiwidmFsdWUiLCJ3b3Jrc3BhY2UiLCJzdG9yZSIsImdldFN0YXRlIiwiZW5naW5lUmVkdWNlciIsInByb2plY3QiLCJpbmZvIiwiaXRlbXMiLCJ1aWQiLCJpdGVtQ29udGFpbmVyQ2xhc3NOYW1lIiwicHJvamVjdFNlcnZpY2UiLCJQcm9qZWN0U2VydmljZSIsImhhbmRsZUl0ZW1Db250YWluZXJDbGljayIsImJpbmQiLCJoYW5kbGVPdXRzaWRlQ2xpY2siLCJkcmFnIiwiaGFuZGxlRHJhZ1N0YXJ0IiwiaGFuZGxlRHJhZyIsImhhbmRsZURyYWdFbmQiLCJtb3VzZW1vdmUiLCJoYW5kbGVLZXlEb3duIiwiY29tcG9uZW50V2lsbE1vdW50IiwiZG9jdW1lbnQiLCJhZGRFdmVudExpc3RlbmVyIiwiY29tcG9uZW50RGlkTW91bnQiLCJkcmFnSW1nIiwiSW1hZ2UiLCJzcmMiLCJjb21wb25lbnRXaWxsVW5tb3VudCIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJtb3VzZW1vdXZlIiwiZSIsIml0ZW0iLCJjb250YWlucyIsInRhcmdldCIsInNldFN0YXRlIiwiT2JqZWN0IiwiYXNzaWduIiwiY3VycmVudF96IiwieiIsInRvcF96Iiwia2V5IiwiZ0NsYXNzTGlzdCIsImRhdGFUcmFuc2ZlciIsInNldERyYWdJbWFnZSIsInN0eWxlIiwiY3Vyc29yIiwiY29udGFpbmVyIiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwiZHJhZ2dpbmciLCJkcmFnT2Zmc2V0WCIsIngiLCJjbGllbnRYIiwibGVmdCIsImRyYWdPZmZzZXRZIiwieSIsImNsaWVudFkiLCJ0b3AiLCJwYXRoIiwicHV0IiwiaWQiLCJkZWZhdWx0V2lkdGgiLCJjb25maWciLCJjZWxsV2lkdGgiLCJkZWZhdWx0SGVpZ2h0IiwiY2VsbEhlaWdodCIsIk1hdGgiLCJmbG9vciIsInJlY3QiLCJpdGVtT2Zmc2V0TGVmdCIsIndpZHRoIiwiaXRlbU9mZnNldFRvcCIsImhlaWdodCIsInByZXZlbnREZWZhdWx0IiwiaW5kZXhPZiIsInNhdmUiLCJrZXlDb2RlIiwicmVuZGVyIiwiekluZGV4IiwiSXRlbSIsImNvbm5lY3QiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7QUFFQSxNQUFNQSxlQUFlLEdBQUlDLEtBQUQsSUFBV0EsS0FBbkM7O0FBQ0EsTUFBTUMsa0JBQWtCLEdBQUlDLFFBQUQsSUFBYztBQUNyQyxTQUFPO0FBQ0hDLGlCQUFhLEVBQUVDLE9BQU8sSUFBSUYsUUFBUSxDQUFDQyxpRkFBYSxDQUFDQyxPQUFELENBQWQsQ0FEL0I7QUFFSEMsWUFBUSxFQUFFRCxPQUFPLElBQUlGLFFBQVEsQ0FBQ0csNEVBQVEsQ0FBQ0QsT0FBRCxDQUFULENBRjFCO0FBR0hFLHNCQUFrQixFQUFFRixPQUFPLElBQUlGLFFBQVEsQ0FBQ0ksc0ZBQWtCLENBQUNGLE9BQUQsQ0FBbkI7QUFIcEMsR0FBUDtBQUtILENBTkQ7O0FBUUEsTUFBTUcsNkJBQTZC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Q0FBQzZDLENBRlI7QUFHSG1CLGFBQUssRUFBRWhFLElBQUksQ0FBQ2dFLEtBSFQ7QUFJSEUsY0FBTSxFQUFFbEUsSUFBSSxDQUFDa0UsTUFKVjtBQUtITSxjQUFNLEVBQUV4RSxJQUFJLENBQUNpQyxDQUFMLEdBQVM7QUFMZDtBQVJYLE9BZUsxQyxHQWZMLENBREo7QUFtQkg7O0FBOU9pQzs7QUFpUHRDLE1BQU1rRixJQUFJLEdBQUdDLDJEQUFPLENBQUNqRyxlQUFELEVBQWtCRSxrQkFBbEIsQ0FBUCxDQUE2Q08sYUFBN0MsQ0FBYjtBQUNldUYsbUVBQWYsRTs7Ozs7Ozs7Ozs7QUNyUUEsMkJBQTJCLG1CQUFPLENBQUMsMkVBQStEO0FBQ2xHO0FBQ0EsY0FBYyxRQUFTLG9CQUFvQix1QkFBdUIsOEJBQThCLHlDQUF5QyxpQkFBaUIsaUJBQWlCLEVBQUUsNEhBQTRILGdCQUFnQixFQUFFLDJCQUEyQiwyQ0FBMkMsRUFBRSxTQUFTLDJMQUEyTCxZQUFZLGFBQWEsYUFBYSxXQUFXLGVBQWUsTUFBTSxlQUFlLE1BQU0seUVBQXlFLDJCQUEyQixrQ0FBa0MsNkNBQTZDLHFCQUFxQixxQkFBcUIsb0NBQW9DLHNCQUFzQixTQUFTLHFCQUFxQixpREFBaUQsU0FBUyxLQUFLLG1CQUFtQjs7Ozs7Ozs7Ozs7Ozs7QUNEemlDLGNBQWMsbUJBQU8sQ0FBQyw2SkFBa0o7O0FBRXhLLDRDQUE0QyxRQUFTOztBQUVyRDtBQUNBOzs7O0FBSUEsZUFBZTs7QUFFZjtBQUNBOztBQUVBLGFBQWEsbUJBQU8sQ0FBQywwRUFBK0Q7O0FBRXBGOztBQUVBLEdBQUcsS0FBVSxFQUFFLEUiLCJmaWxlIjoiYnVpbGQvNi42MWQ3ZWEzNGJjNmQ2NDgwYTM3Mi5jaHVuay5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQgfSBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCc7XHJcbmltcG9ydCB7IHN0b3JlIH0gZnJvbSAnLi4vLi4vLi4vLi4vY29tbW9uL2NvbmZpZy9yZWR1eC9yZWR1eC5zdG9yZSc7XHJcbmltcG9ydCB7IHVwZGF0ZVByb2plY3QsIGdDbGlja2VkLCB1cGRhdGVQcm9qZWN0SXRlbXMgfSBmcm9tICcuLi8uLi9jb25maWcvcmVkdXgvcmVkdXguYWN0aW9ucyc7XHJcbmltcG9ydCB7IFByb2plY3RTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vLi4vY29tbW9uL3NlcnZpY2VzL3Byb2plY3Quc2VydmljZSc7XHJcblxyXG5pbXBvcnQgJy4uLy4uLy4uL2Fzc2V0cy9zdHlsZS9jb21wb25lbnRzL2l0ZW0vaXRlbS5zY3NzJztcclxuXHJcbmNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9IChzdGF0ZSkgPT4gc3RhdGU7XHJcbmNvbnN0IG1hcERpc3BhdGNoVG9Qcm9wcyA9IChkaXNwYXRjaCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB1cGRhdGVQcm9qZWN0OiBwYXlsb2FkID0+IGRpc3BhdGNoKHVwZGF0ZVByb2plY3QocGF5bG9hZCkpLFxyXG4gICAgICAgIGdDbGlja2VkOiBwYXlsb2FkID0+IGRpc3BhdGNoKGdDbGlja2VkKHBheWxvYWQpKSxcclxuICAgICAgICB1cGRhdGVQcm9qZWN0SXRlbXM6IHBheWxvYWQgPT4gZGlzcGF0Y2godXBkYXRlUHJvamVjdEl0ZW1zKHBheWxvYWQpKVxyXG4gICAgfTtcclxufTtcclxuXHJcbmNvbnN0IGRlZmF1bHRJdGVtQ29udGFpbmVyQ2xhc3NOYW1lID0gJ2l0ZW0tY29udGFpbmVyJztcclxuXHJcbmNsYXNzIEl0ZW1Db21wb25lbnQgZXh0ZW5kcyBDb21wb25lbnQge1xyXG4gICAgZHJhZ2dpbmcgPSBmYWxzZTtcclxuICAgIGRyYWdPZmZzZXRYID0gMDtcclxuICAgIGRyYWdPZmZzZXRZID0gMDtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuXHJcbiAgICAgICAgY29uc3QgVGFnTmFtZSA9IGAke3RoaXMucHJvcHMudGFnLm5hbWV9YDtcclxuICAgICAgICB2YXIgdGFnID0gbnVsbDtcclxuICAgICAgICBpZiAodGhpcy5wcm9wcy50YWcuaW5uZXJWYWx1ZSkge1xyXG4gICAgICAgICAgICB0YWcgPSAoPFRhZ05hbWU+e3RoaXMucHJvcHMudGFnLnZhbHVlfTwvVGFnTmFtZT4pXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGFnID0gKDxUYWdOYW1lIHZhbHVlPXt0aGlzLnByb3BzLnRhZy52YWx1ZX0+PC9UYWdOYW1lPilcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHsgd29ya3NwYWNlIH0gPSBzdG9yZS5nZXRTdGF0ZSgpLmVuZ2luZVJlZHVjZXI7XHJcbiAgICAgICAgY29uc3QgcHJvamVjdCA9IHdvcmtzcGFjZS5wcm9qZWN0O1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XHJcbiAgICAgICAgICAgIGluZm86IHByb2plY3QuaXRlbXNbdGhpcy5wcm9wcy51aWRdLFxyXG4gICAgICAgICAgICBpdGVtQ29udGFpbmVyQ2xhc3NOYW1lOiBkZWZhdWx0SXRlbUNvbnRhaW5lckNsYXNzTmFtZSxcclxuICAgICAgICAgICAgdGFnXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5wcm9qZWN0U2VydmljZSA9IG5ldyBQcm9qZWN0U2VydmljZSgpO1xyXG5cclxuICAgICAgICB0aGlzLmhhbmRsZUl0ZW1Db250YWluZXJDbGljayA9IHRoaXMuaGFuZGxlSXRlbUNvbnRhaW5lckNsaWNrLmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVPdXRzaWRlQ2xpY2sgPSB0aGlzLmhhbmRsZU91dHNpZGVDbGljay5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuZHJhZyA9IHRoaXMuZHJhZy5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlRHJhZ1N0YXJ0ID0gdGhpcy5oYW5kbGVEcmFnU3RhcnQuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLmhhbmRsZURyYWcgPSB0aGlzLmhhbmRsZURyYWcuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLmhhbmRsZURyYWdFbmQgPSB0aGlzLmhhbmRsZURyYWdFbmQuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLm1vdXNlbW92ZSA9IHRoaXMubW91c2Vtb3ZlLmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVLZXlEb3duID0gdGhpcy5oYW5kbGVLZXlEb3duLmJpbmQodGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgY29tcG9uZW50V2lsbE1vdW50KCkge1xyXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMuaGFuZGxlT3V0c2lkZUNsaWNrLCBmYWxzZSk7XHJcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5tb3VzZW1vdmUsIGZhbHNlKTtcclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcy5oYW5kbGVLZXlEb3duLCBmYWxzZSk7XHJcbiAgICB9XHJcblxyXG4gICAgY29tcG9uZW50RGlkTW91bnQoKSB7XHJcbiAgICAgICAgdGhpcy5kcmFnSW1nID0gbmV3IEltYWdlKDAsMCk7XHJcbiAgICAgICAgdGhpcy5kcmFnSW1nLnNyYyA9ICdkYXRhOmltYWdlL2dpZjtiYXNlNjQsUjBsR09EbGhBUUFCQUlBQUFBQUFBUC8vL3lINUJBRUFBQUFBTEFBQUFBQUJBQUVBQUFJQlJBQTcnO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xyXG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMuaGFuZGxlT3V0c2lkZUNsaWNrLCBmYWxzZSk7XHJcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5tb3VzZW1vdXZlLCBmYWxzZSk7XHJcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMuaGFuZGxlS2V5RG93biwgZmFsc2UpO1xyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZU91dHNpZGVDbGljayhlKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaXRlbS5jb250YWlucyhlLnRhcmdldCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZShPYmplY3QuYXNzaWduKHt9LCB0aGlzLnN0YXRlLCB7XHJcbiAgICAgICAgICAgIGl0ZW1Db250YWluZXJDbGFzc05hbWU6IGRlZmF1bHRJdGVtQ29udGFpbmVyQ2xhc3NOYW1lXHJcbiAgICAgICAgfSkpO1xyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZUl0ZW1Db250YWluZXJDbGljaygpIHtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKE9iamVjdC5hc3NpZ24oe30sIHRoaXMuc3RhdGUsIHtcclxuICAgICAgICAgICAgaXRlbUNvbnRhaW5lckNsYXNzTmFtZTogZGVmYXVsdEl0ZW1Db250YWluZXJDbGFzc05hbWUgKyAnIGZvY3VzJ1xyXG4gICAgICAgIH0pKTtcclxuXHJcbiAgICAgICAgY29uc3QgeyB3b3Jrc3BhY2UgfSA9IHN0b3JlLmdldFN0YXRlKCkuZW5naW5lUmVkdWNlcjtcclxuICAgICAgICB2YXIgaXRlbXMgPSB3b3Jrc3BhY2UucHJvamVjdC5pdGVtcztcclxuXHJcbiAgICAgICAgY29uc3QgY3VycmVudF96ID0gaXRlbXNbdGhpcy5wcm9wcy51aWRdLno7XHJcbiAgICAgICAgdmFyIHRvcF96ID0gY3VycmVudF96O1xyXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBpdGVtcykge1xyXG4gICAgICAgICAgICBpZiAoa2V5ICE9PSB0aGlzLnByb3BzLnVpZCAmJiBpdGVtc1trZXldLnogPiBjdXJyZW50X3opIHtcclxuICAgICAgICAgICAgICAgIGlmIChpdGVtc1trZXldLnogPiB0b3Bfeikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRvcF96ID0gaXRlbXNba2V5XS56O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaXRlbXNba2V5XS56IC09IDE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaXRlbXNbdGhpcy5wcm9wcy51aWRdLnogPSB0b3BfejtcclxuXHJcbiAgICAgICAgdGhpcy5wcm9wcy51cGRhdGVQcm9qZWN0SXRlbXMoaXRlbXMpO1xyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZURyYWdTdGFydChlKSB7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVJdGVtQ29udGFpbmVyQ2xpY2soKTtcclxuXHJcbiAgICAgICAgdGhpcy5wcm9wcy5nQ2xpY2tlZCh7XHJcbiAgICAgICAgICAgIGdDbGFzc0xpc3Q6ICdnaWQgaGlkZGVuJ1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBlLmRhdGFUcmFuc2Zlci5zZXREcmFnSW1hZ2UodGhpcy5kcmFnSW1nLCAwLCAwKTtcclxuICAgICAgICBlLnRhcmdldC5zdHlsZS5jdXJzb3IgPSAnbW92ZSc7XHJcblxyXG4gICAgICAgIGNvbnN0IHsgd29ya3NwYWNlIH0gPSBzdG9yZS5nZXRTdGF0ZSgpLmVuZ2luZVJlZHVjZXI7XHJcbiAgICAgICAgY29uc3QgY29udGFpbmVyID0gd29ya3NwYWNlLnByb2plY3QuY29udGFpbmVyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgICAgIGNvbnN0IGl0ZW0gPSB3b3Jrc3BhY2UucHJvamVjdC5pdGVtc1t0aGlzLnByb3BzLnVpZF07XHJcblxyXG4gICAgICAgIHRoaXMuZHJhZ2dpbmcgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuZHJhZ09mZnNldFggPSBpdGVtLnggLSAoZS5jbGllbnRYIC0gY29udGFpbmVyLmxlZnQpO1xyXG4gICAgICAgIHRoaXMuZHJhZ09mZnNldFkgPSBpdGVtLnkgLSAoZS5jbGllbnRZIC0gY29udGFpbmVyLnRvcCk7XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlRHJhZyhlKSB7XHJcbiAgICAgICAgdGhpcy5kcmFnKGUpO1xyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIGhhbmRsZURyYWdFbmQoZSkge1xyXG4gICAgICAgIHZhciBpbmZvID0gdGhpcy5kcmFnKGUpO1xyXG5cclxuICAgICAgICB0aGlzLmRyYWdnaW5nID0gZmFsc2U7XHJcblxyXG4gICAgICAgIHRoaXMucHJvcHMuZ0NsaWNrZWQoe1xyXG4gICAgICAgICAgICBnQ2xhc3NMaXN0OiAnZ2lkJ1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnByb3BzLnVwZGF0ZVByb2plY3Qoe1xyXG4gICAgICAgICAgICBwYXRoOiB0aGlzLnByb3BzLnVpZCxcclxuICAgICAgICAgICAgdmFsdWU6IGluZm9cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY29uc3QgeyB3b3Jrc3BhY2UgfSA9IHN0b3JlLmdldFN0YXRlKCkuZW5naW5lUmVkdWNlcjtcclxuICAgICAgICBhd2FpdCB0aGlzLnByb2plY3RTZXJ2aWNlLnB1dCh3b3Jrc3BhY2UuaWQsIHdvcmtzcGFjZS5wcm9qZWN0LmlkLCB3b3Jrc3BhY2UucHJvamVjdCk7XHJcbiAgICB9XHJcblxyXG4gICAgZHJhZyhlKSB7XHJcbiAgICAgICAgY29uc3QgeyB3b3Jrc3BhY2UgfSA9IHN0b3JlLmdldFN0YXRlKCkuZW5naW5lUmVkdWNlcjtcclxuICAgICAgICBjb25zdCBjb250YWluZXIgPSB3b3Jrc3BhY2UucHJvamVjdC5jb250YWluZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICAgICAgY29uc3QgZGVmYXVsdFdpZHRoID0gd29ya3NwYWNlLnByb2plY3QuY29uZmlnLmNlbGxXaWR0aDtcclxuICAgICAgICBjb25zdCBkZWZhdWx0SGVpZ2h0ID0gd29ya3NwYWNlLnByb2plY3QuY29uZmlnLmNlbGxIZWlnaHQ7XHJcblxyXG4gICAgICAgIGNvbnN0IHggPSBNYXRoLmZsb29yKChlLmNsaWVudFggLSAoY29udGFpbmVyLmxlZnQgLSB0aGlzLmRyYWdPZmZzZXRYKSkgLyBkZWZhdWx0V2lkdGgpICogZGVmYXVsdFdpZHRoO1xyXG4gICAgICAgIGNvbnN0IHkgPSBNYXRoLmZsb29yKChlLmNsaWVudFkgLSAoY29udGFpbmVyLnRvcCAtIHRoaXMuZHJhZ09mZnNldFkpKSAvIGRlZmF1bHRIZWlnaHQpICogZGVmYXVsdEhlaWdodDtcclxuICAgICAgICBcclxuICAgICAgICB2YXIgbGVmdCA9IHggPiAwID8geCA6IDA7XHJcbiAgICAgICAgdmFyIHRvcCA9IHkgPiAwID8geSA6IDA7XHJcblxyXG4gICAgICAgIGNvbnN0IHJlY3QgPSB0aGlzLml0ZW0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICAgICAgY29uc3QgaXRlbU9mZnNldExlZnQgPSBsZWZ0ICsgcmVjdC53aWR0aDtcclxuICAgICAgICBjb25zdCBpdGVtT2Zmc2V0VG9wID0gdG9wICsgcmVjdC5oZWlnaHQ7XHJcblxyXG4gICAgICAgIGlmIChpdGVtT2Zmc2V0TGVmdCA+IGNvbnRhaW5lci53aWR0aCkge1xyXG4gICAgICAgICAgICBsZWZ0ID0gTWF0aC5mbG9vcigoY29udGFpbmVyLndpZHRoIC0gcmVjdC53aWR0aCkgLyBkZWZhdWx0V2lkdGgpICogZGVmYXVsdFdpZHRoO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGl0ZW1PZmZzZXRUb3AgPiBjb250YWluZXIuaGVpZ2h0KSB7XHJcbiAgICAgICAgICAgIHRvcCA9IE1hdGguZmxvb3IoKGNvbnRhaW5lci5oZWlnaHQgLSByZWN0LmhlaWdodCkgLyBkZWZhdWx0SGVpZ2h0KSAqIGRlZmF1bHRIZWlnaHQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBpbmZvID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5zdGF0ZS5pbmZvLCB7XHJcbiAgICAgICAgICAgIHg6IGxlZnQsXHJcbiAgICAgICAgICAgIHk6IHRvcFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnNldFN0YXRlKE9iamVjdC5hc3NpZ24oe30sIHRoaXMuc3RhdGUsIHtcclxuICAgICAgICAgICAgaW5mb1xyXG4gICAgICAgIH0pKTtcclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gaW5mbztcclxuICAgIH1cclxuXHJcbiAgICBtb3VzZW1vdmUoZSkge1xyXG4gICAgICAgIGlmICh0aGlzLmRyYWdnaW5nKSB7XHJcbiAgICAgICAgICAgIGUudGFyZ2V0LnN0eWxlLmN1cnNvciA9ICdtb3ZlJztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgaGFuZGxlS2V5RG93bihlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMuc3RhdGUuaXRlbUNvbnRhaW5lckNsYXNzTmFtZS5pbmRleE9mKCdmb2N1cycpID09PSAtMSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCB7IHdvcmtzcGFjZSB9ID0gc3RvcmUuZ2V0U3RhdGUoKS5lbmdpbmVSZWR1Y2VyO1xyXG4gICAgICAgIHZhciBpbmZvID0gdGhpcy5zdGF0ZS5pbmZvO1xyXG5cclxuICAgICAgICB2YXIgc2F2ZSA9IGZhbHNlO1xyXG4gICAgICAgIHN3aXRjaCAoZS5rZXlDb2RlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgMzc6IC8vIGxlZnRcclxuICAgICAgICAgICAgICAgIGluZm8ueCAtPSB3b3Jrc3BhY2UucHJvamVjdC5jb25maWcuY2VsbFdpZHRoO1xyXG4gICAgICAgICAgICAgICAgc2F2ZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAzODogLy8gdXBcclxuICAgICAgICAgICAgICAgIGluZm8ueSAtPSB3b3Jrc3BhY2UucHJvamVjdC5jb25maWcuY2VsbEhlaWdodDtcclxuICAgICAgICAgICAgICAgIHNhdmUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgMzk6IC8vIHJpZ2h0XHJcbiAgICAgICAgICAgICAgICBpbmZvLnggKz0gd29ya3NwYWNlLnByb2plY3QuY29uZmlnLmNlbGxXaWR0aDtcclxuICAgICAgICAgICAgICAgIHNhdmUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgNDA6IC8vIGRvd25cclxuICAgICAgICAgICAgICAgIGluZm8ueSArPSB3b3Jrc3BhY2UucHJvamVjdC5jb25maWcuY2VsbEhlaWdodDtcclxuICAgICAgICAgICAgICAgIHNhdmUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoc2F2ZSkge1xyXG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKE9iamVjdC5hc3NpZ24oe30sIHRoaXMuc3RhdGUsIHtcclxuICAgICAgICAgICAgICAgIGluZm9cclxuICAgICAgICAgICAgfSkpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5wcm9wcy51cGRhdGVQcm9qZWN0KHtcclxuICAgICAgICAgICAgICAgIHBhdGg6IHRoaXMucHJvcHMudWlkLFxyXG4gICAgICAgICAgICAgICAgdmFsdWU6IGluZm9cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBhd2FpdCB0aGlzLnByb2plY3RTZXJ2aWNlLnB1dCh3b3Jrc3BhY2UuaWQsIHdvcmtzcGFjZS5wcm9qZWN0LmlkLCB3b3Jrc3BhY2UucHJvamVjdCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IGl0ZW1Db250YWluZXJDbGFzc05hbWUsIGluZm8sIHRhZyB9ID0gdGhpcy5zdGF0ZTtcclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiBcclxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17aXRlbUNvbnRhaW5lckNsYXNzTmFtZX1cclxuICAgICAgICAgICAgICAgIHJlZj17aXRlbSA9PiB0aGlzLml0ZW0gPSBpdGVtfVxyXG4gICAgICAgICAgICAgICAgb25DbGljaz17dGhpcy5oYW5kbGVJdGVtQ29udGFpbmVyQ2xpY2t9XHJcbiAgICAgICAgICAgICAgICBkcmFnZ2FibGU9e3RydWV9XHJcbiAgICAgICAgICAgICAgICBvbkRyYWdTdGFydD17dGhpcy5oYW5kbGVEcmFnU3RhcnR9XHJcbiAgICAgICAgICAgICAgICBvbkRyYWc9e3RoaXMuaGFuZGxlRHJhZ31cclxuICAgICAgICAgICAgICAgIG9uRHJhZ0VuZD17dGhpcy5oYW5kbGVEcmFnRW5kfVxyXG4gICAgICAgICAgICAgICAgc3R5bGU9e3sgXHJcbiAgICAgICAgICAgICAgICAgICAgdG9wOiBpbmZvLnksIFxyXG4gICAgICAgICAgICAgICAgICAgIGxlZnQ6IGluZm8ueCxcclxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogaW5mby53aWR0aCxcclxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IGluZm8uaGVpZ2h0LFxyXG4gICAgICAgICAgICAgICAgICAgIHpJbmRleDogaW5mby56ICsgMTAwXHJcbiAgICAgICAgICAgICAgICB9fT5cclxuICAgICAgICAgICAgICAgIHt0YWd9XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IEl0ZW0gPSBjb25uZWN0KG1hcFN0YXRlVG9Qcm9wcywgbWFwRGlzcGF0Y2hUb1Byb3BzKShJdGVtQ29tcG9uZW50KTtcclxuZXhwb3J0IGRlZmF1bHQgSXRlbTsiLCJleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiKSh0cnVlKTtcbi8vIE1vZHVsZVxuZXhwb3J0cy5wdXNoKFttb2R1bGUuaWQsIFwiLml0ZW0tY29udGFpbmVyIHtcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIGJvcmRlcjogMXB4IHNvbGlkICM3ODc4Nzg7XFxuICBiYWNrZ3JvdW5kOiByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuOSk7XFxuICBwYWRkaW5nOiA0cHg7XFxuICBjdXJzb3I6IG1vdmU7IH1cXG4gIC5pdGVtLWNvbnRhaW5lciBoMSwgLml0ZW0tY29udGFpbmVyIGgyLCAuaXRlbS1jb250YWluZXIgaDMsIC5pdGVtLWNvbnRhaW5lciBoNCwgLml0ZW0tY29udGFpbmVyIGg1LCAuaXRlbS1jb250YWluZXIgaDYge1xcbiAgICBtYXJnaW46IDA7IH1cXG4gIC5pdGVtLWNvbnRhaW5lci5mb2N1cyB7XFxuICAgIGJhY2tncm91bmQ6IHJnYmEoMjQwLCAyNDAsIDI0MCwgMC45KTsgfVxcblwiLCBcIlwiLHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIkM6L1VzZXJzL2dhcnJpL3NvdXJjZS9yZXBvcy9zbmFwZm9ybS9jbGllbnQvZW5naW5lL2Fzc2V0cy9zdHlsZS9jb21wb25lbnRzL2l0ZW0vY2xpZW50L2VuZ2luZS9hc3NldHMvc3R5bGUvY29tcG9uZW50cy9pdGVtL2l0ZW0uc2Nzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQTtFQUNJLGtCQUFrQjtFQUNsQix5QkFBeUI7RUFDekIsb0NBQW9DO0VBQ3BDLFlBQVk7RUFDWixZQUFZLEVBQUE7RUFMaEI7SUFRUSxTQUFTLEVBQUE7RUFSakI7SUFZUSxvQ0FBb0MsRUFBQVwiLFwiZmlsZVwiOlwiaXRlbS5zY3NzXCIsXCJzb3VyY2VzQ29udGVudFwiOltcIi5pdGVtLWNvbnRhaW5lciB7XFxyXFxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXHJcXG4gICAgYm9yZGVyOiAxcHggc29saWQgIzc4Nzg3ODtcXHJcXG4gICAgYmFja2dyb3VuZDogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjkpO1xcclxcbiAgICBwYWRkaW5nOiA0cHg7XFxyXFxuICAgIGN1cnNvcjogbW92ZTtcXHJcXG5cXHJcXG4gICAgaDEsIGgyLCBoMywgaDQsIGg1LCBoNiB7XFxyXFxuICAgICAgICBtYXJnaW46IDA7XFxyXFxuICAgIH1cXHJcXG5cXHJcXG4gICAgJi5mb2N1cyB7XFxyXFxuICAgICAgICBiYWNrZ3JvdW5kOiByZ2JhKDI0MCwgMjQwLCAyNDAsIDAuOSk7XFxyXFxuICAgIH1cXHJcXG59XCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG5cbiIsIlxudmFyIGNvbnRlbnQgPSByZXF1aXJlKFwiISEuLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcz8/cmVmLS02LTEhLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2xpYi9sb2FkZXIuanM/P3JlZi0tNi0yIS4vaXRlbS5zY3NzXCIpO1xuXG5pZih0eXBlb2YgY29udGVudCA9PT0gJ3N0cmluZycpIGNvbnRlbnQgPSBbW21vZHVsZS5pZCwgY29udGVudCwgJyddXTtcblxudmFyIHRyYW5zZm9ybTtcbnZhciBpbnNlcnRJbnRvO1xuXG5cblxudmFyIG9wdGlvbnMgPSB7XCJobXJcIjp0cnVlfVxuXG5vcHRpb25zLnRyYW5zZm9ybSA9IHRyYW5zZm9ybVxub3B0aW9ucy5pbnNlcnRJbnRvID0gdW5kZWZpbmVkO1xuXG52YXIgdXBkYXRlID0gcmVxdWlyZShcIiEuLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2xpYi9hZGRTdHlsZXMuanNcIikoY29udGVudCwgb3B0aW9ucyk7XG5cbmlmKGNvbnRlbnQubG9jYWxzKSBtb2R1bGUuZXhwb3J0cyA9IGNvbnRlbnQubG9jYWxzO1xuXG5pZihtb2R1bGUuaG90KSB7XG5cdG1vZHVsZS5ob3QuYWNjZXB0KFwiISEuLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcz8/cmVmLS02LTEhLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2xpYi9sb2FkZXIuanM/P3JlZi0tNi0yIS4vaXRlbS5zY3NzXCIsIGZ1bmN0aW9uKCkge1xuXHRcdHZhciBuZXdDb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanM/P3JlZi0tNi0xIS4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9saWIvbG9hZGVyLmpzPz9yZWYtLTYtMiEuL2l0ZW0uc2Nzc1wiKTtcblxuXHRcdGlmKHR5cGVvZiBuZXdDb250ZW50ID09PSAnc3RyaW5nJykgbmV3Q29udGVudCA9IFtbbW9kdWxlLmlkLCBuZXdDb250ZW50LCAnJ11dO1xuXG5cdFx0dmFyIGxvY2FscyA9IChmdW5jdGlvbihhLCBiKSB7XG5cdFx0XHR2YXIga2V5LCBpZHggPSAwO1xuXG5cdFx0XHRmb3Ioa2V5IGluIGEpIHtcblx0XHRcdFx0aWYoIWIgfHwgYVtrZXldICE9PSBiW2tleV0pIHJldHVybiBmYWxzZTtcblx0XHRcdFx0aWR4Kys7XG5cdFx0XHR9XG5cblx0XHRcdGZvcihrZXkgaW4gYikgaWR4LS07XG5cblx0XHRcdHJldHVybiBpZHggPT09IDA7XG5cdFx0fShjb250ZW50LmxvY2FscywgbmV3Q29udGVudC5sb2NhbHMpKTtcblxuXHRcdGlmKCFsb2NhbHMpIHRocm93IG5ldyBFcnJvcignQWJvcnRpbmcgQ1NTIEhNUiBkdWUgdG8gY2hhbmdlZCBjc3MtbW9kdWxlcyBsb2NhbHMuJyk7XG5cblx0XHR1cGRhdGUobmV3Q29udGVudCk7XG5cdH0pO1xuXG5cdG1vZHVsZS5ob3QuZGlzcG9zZShmdW5jdGlvbigpIHsgdXBkYXRlKCk7IH0pO1xufSJdLCJzb3VyY2VSb290IjoiIn0=