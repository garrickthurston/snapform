(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[5],{

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
/* harmony import */ var _common_services_save_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../common/services/save.service */ "fc6Z");
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
    this.saveService = new _common_services_save_service__WEBPACK_IMPORTED_MODULE_4__["SaveService"]();
    this.handleItemContainerClick = this.handleItemContainerClick.bind(this);
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
    this.drag = this.drag.bind(this);
    this.handleDragStart = this.handleDragStart.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
    this.handleDragEnd = this.handleDragEnd.bind(this);
    this.mousemove = this.mousemove.bind(this);
  }

  componentWillMount() {
    document.addEventListener('mousedown', this.handleOutsideClick, false);
    document.addEventListener('mousemove', this.mousemove, false);
  }

  componentDidMount() {
    this.dragImg = new Image(0, 0);
    this.dragImg.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleOutsideClick, false);
    document.removeEventListener('mousemove', this.mousemouve, false);
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

  handleDragEnd(e) {
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
    this.saveService.saveProject('1', '1', workspace.project);
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

/***/ "fc6Z":
/*!************************************************!*\
  !*** ./client/common/services/save.service.js ***!
  \************************************************/
/*! exports provided: SaveService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SaveService", function() { return SaveService; });
/* harmony import */ var _http__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../http */ "CFaH");

class SaveService {
  constructor() {
    this.http = new _http__WEBPACK_IMPORTED_MODULE_0__["Http"]();
  }

  saveProject(workspace_id, project_id, project) {
    return new Promise(async (resolve, reject) => {
      try {
        await this.http.put(`/api/v1/workspace/${workspace_id}/project/${project_id}`, {
          items: project.items,
          config: project.config
        });
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }

}
;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9jbGllbnQvZW5naW5lL3NyYy9jb21wb25lbnRzL2l0ZW0vaXRlbS5jb21wb25lbnQuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L2NvbW1vbi9zZXJ2aWNlcy9zYXZlLnNlcnZpY2UuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L2VuZ2luZS9hc3NldHMvc3R5bGUvY29tcG9uZW50cy9pdGVtL2l0ZW0uc2NzcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvZW5naW5lL2Fzc2V0cy9zdHlsZS9jb21wb25lbnRzL2l0ZW0vaXRlbS5zY3NzPzgyMjkiXSwibmFtZXMiOlsibWFwU3RhdGVUb1Byb3BzIiwic3RhdGUiLCJtYXBEaXNwYXRjaFRvUHJvcHMiLCJkaXNwYXRjaCIsInVwZGF0ZVByb2plY3QiLCJwYXlsb2FkIiwiZ0NsaWNrZWQiLCJ1cGRhdGVQcm9qZWN0SXRlbXMiLCJkZWZhdWx0SXRlbUNvbnRhaW5lckNsYXNzTmFtZSIsIkl0ZW1Db21wb25lbnQiLCJDb21wb25lbnQiLCJjb25zdHJ1Y3RvciIsInByb3BzIiwiVGFnTmFtZSIsInRhZyIsIm5hbWUiLCJpbm5lclZhbHVlIiwidmFsdWUiLCJ3b3Jrc3BhY2UiLCJzdG9yZSIsImdldFN0YXRlIiwiZW5naW5lUmVkdWNlciIsInByb2plY3QiLCJpbmZvIiwiaXRlbXMiLCJ1aWQiLCJpdGVtQ29udGFpbmVyQ2xhc3NOYW1lIiwic2F2ZVNlcnZpY2UiLCJTYXZlU2VydmljZSIsImhhbmRsZUl0ZW1Db250YWluZXJDbGljayIsImJpbmQiLCJoYW5kbGVPdXRzaWRlQ2xpY2siLCJkcmFnIiwiaGFuZGxlRHJhZ1N0YXJ0IiwiaGFuZGxlRHJhZyIsImhhbmRsZURyYWdFbmQiLCJtb3VzZW1vdmUiLCJjb21wb25lbnRXaWxsTW91bnQiLCJkb2N1bWVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJjb21wb25lbnREaWRNb3VudCIsImRyYWdJbWciLCJJbWFnZSIsInNyYyIsImNvbXBvbmVudFdpbGxVbm1vdW50IiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsIm1vdXNlbW91dmUiLCJlIiwiaXRlbSIsImNvbnRhaW5zIiwidGFyZ2V0Iiwic2V0U3RhdGUiLCJPYmplY3QiLCJhc3NpZ24iLCJjdXJyZW50X3oiLCJ6IiwidG9wX3oiLCJrZXkiLCJnQ2xhc3NMaXN0IiwiZGF0YVRyYW5zZmVyIiwic2V0RHJhZ0ltYWdlIiwic3R5bGUiLCJjdXJzb3IiLCJjb250YWluZXIiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJkcmFnZ2luZyIsImRyYWdPZmZzZXRYIiwieCIsImNsaWVudFgiLCJsZWZ0IiwiZHJhZ09mZnNldFkiLCJ5IiwiY2xpZW50WSIsInRvcCIsInBhdGgiLCJzYXZlUHJvamVjdCIsImRlZmF1bHRXaWR0aCIsImNvbmZpZyIsImNlbGxXaWR0aCIsImRlZmF1bHRIZWlnaHQiLCJjZWxsSGVpZ2h0IiwiTWF0aCIsImZsb29yIiwicmVjdCIsIml0ZW1PZmZzZXRMZWZ0Iiwid2lkdGgiLCJpdGVtT2Zmc2V0VG9wIiwiaGVpZ2h0IiwicmVuZGVyIiwiekluZGV4IiwiSXRlbSIsImNvbm5lY3QiLCJodHRwIiwiSHR0cCIsIndvcmtzcGFjZV9pZCIsInByb2plY3RfaWQiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsInB1dCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBOztBQUVBLE1BQU1BLGVBQWUsR0FBSUMsS0FBRCxJQUFXQSxLQUFuQzs7QUFDQSxNQUFNQyxrQkFBa0IsR0FBSUMsUUFBRCxJQUFjO0FBQ3JDLFNBQU87QUFDSEMsaUJBQWEsRUFBRUMsT0FBTyxJQUFJRixRQUFRLENBQUNDLGlGQUFhLENBQUNDLE9BQUQsQ0FBZCxDQUQvQjtBQUVIQyxZQUFRLEVBQUVELE9BQU8sSUFBSUYsUUFBUSxDQUFDRyw0RUFBUSxDQUFDRCxPQUFELENBQVQsQ0FGMUI7QUFHSEUsc0JBQWtCLEVBQUVGLE9BQU8sSUFBSUYsUUFBUSxD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LEtBQTJCO0FBQzFDLFVBQUk7QUFDQSxjQUFNLEtBQUtOLElBQUwsQ0FBVU8sR0FBVixDQUFlLHFCQUFvQkwsWUFBYSxZQUFXQyxVQUFXLEVBQXRFLEVBQXlFO0FBQzNFdkUsZUFBSyxFQUFFRixPQUFPLENBQUNFLEtBRDREO0FBRTNFcUQsZ0JBQU0sRUFBRXZELE9BQU8sQ0FBQ3VEO0FBRjJELFNBQXpFLENBQU47QUFLQW9CLGVBQU87QUFDVixPQVBELENBT0UsT0FBT2xELENBQVAsRUFBVTtBQUNSbUQsY0FBTSxDQUFDbkQsQ0FBRCxDQUFOO0FBQ0g7QUFDSixLQVhNLENBQVA7QUFZSDs7QUFsQm9CO0FBbUJ4QixDOzs7Ozs7Ozs7OztBQ3JCRCwyQkFBMkIsbUJBQU8sQ0FBQywyRUFBK0Q7QUFDbEc7QUFDQSxjQUFjLFFBQVMsb0JBQW9CLHVCQUF1Qiw4QkFBOEIseUNBQXlDLGlCQUFpQixpQkFBaUIsRUFBRSw0SEFBNEgsZ0JBQWdCLEVBQUUsMkJBQTJCLDJDQUEyQyxFQUFFLFNBQVMsMkxBQTJMLFlBQVksYUFBYSxhQUFhLFdBQVcsZUFBZSxNQUFNLGVBQWUsTUFBTSx5RUFBeUUsMkJBQTJCLGtDQUFrQyw2Q0FBNkMscUJBQXFCLHFCQUFxQixvQ0FBb0Msc0JBQXNCLFNBQVMscUJBQXFCLGlEQUFpRCxTQUFTLEtBQUssbUJBQW1COzs7Ozs7Ozs7Ozs7OztBQ0R6aUMsY0FBYyxtQkFBTyxDQUFDLDZKQUFrSjs7QUFFeEssNENBQTRDLFFBQVM7O0FBRXJEO0FBQ0E7Ozs7QUFJQSxlQUFlOztBQUVmO0FBQ0E7O0FBRUEsYUFBYSxtQkFBTyxDQUFDLDBFQUErRDs7QUFFcEY7O0FBRUEsR0FBRyxLQUFVLEVBQUUsRSIsImZpbGUiOiJidWlsZC81LjViYzE1MmRkN2FhNmViMTkxNDM0LmNodW5rLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IENvbXBvbmVudCB9IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gJ3JlYWN0LXJlZHV4JztcclxuaW1wb3J0IHsgc3RvcmUgfSBmcm9tICcuLi8uLi8uLi8uLi9jb21tb24vY29uZmlnL3JlZHV4L3JlZHV4LnN0b3JlJztcclxuaW1wb3J0IHsgdXBkYXRlUHJvamVjdCwgZ0NsaWNrZWQsIHVwZGF0ZVByb2plY3RJdGVtcyB9IGZyb20gJy4uLy4uL2NvbmZpZy9yZWR1eC9yZWR1eC5hY3Rpb25zJztcclxuaW1wb3J0IHsgU2F2ZVNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi8uLi9jb21tb24vc2VydmljZXMvc2F2ZS5zZXJ2aWNlJztcclxuXHJcbmltcG9ydCAnLi4vLi4vLi4vYXNzZXRzL3N0eWxlL2NvbXBvbmVudHMvaXRlbS9pdGVtLnNjc3MnO1xyXG5cclxuY29uc3QgbWFwU3RhdGVUb1Byb3BzID0gKHN0YXRlKSA9PiBzdGF0ZTtcclxuY29uc3QgbWFwRGlzcGF0Y2hUb1Byb3BzID0gKGRpc3BhdGNoKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHVwZGF0ZVByb2plY3Q6IHBheWxvYWQgPT4gZGlzcGF0Y2godXBkYXRlUHJvamVjdChwYXlsb2FkKSksXHJcbiAgICAgICAgZ0NsaWNrZWQ6IHBheWxvYWQgPT4gZGlzcGF0Y2goZ0NsaWNrZWQocGF5bG9hZCkpLFxyXG4gICAgICAgIHVwZGF0ZVByb2plY3RJdGVtczogcGF5bG9hZCA9PiBkaXNwYXRjaCh1cGRhdGVQcm9qZWN0SXRlbXMocGF5bG9hZCkpXHJcbiAgICB9O1xyXG59O1xyXG5cclxuY29uc3QgZGVmYXVsdEl0ZW1Db250YWluZXJDbGFzc05hbWUgPSAnaXRlbS1jb250YWluZXInO1xyXG5cclxuY2xhc3MgSXRlbUNvbXBvbmVudCBleHRlbmRzIENvbXBvbmVudCB7XHJcbiAgICBkcmFnZ2luZyA9IGZhbHNlO1xyXG4gICAgZHJhZ09mZnNldFggPSAwO1xyXG4gICAgZHJhZ09mZnNldFkgPSAwO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG5cclxuICAgICAgICBjb25zdCBUYWdOYW1lID0gYCR7dGhpcy5wcm9wcy50YWcubmFtZX1gO1xyXG4gICAgICAgIHZhciB0YWcgPSBudWxsO1xyXG4gICAgICAgIGlmICh0aGlzLnByb3BzLnRhZy5pbm5lclZhbHVlKSB7XHJcbiAgICAgICAgICAgIHRhZyA9ICg8VGFnTmFtZT57dGhpcy5wcm9wcy50YWcudmFsdWV9PC9UYWdOYW1lPilcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0YWcgPSAoPFRhZ05hbWUgdmFsdWU9e3RoaXMucHJvcHMudGFnLnZhbHVlfT48L1RhZ05hbWU+KVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgeyB3b3Jrc3BhY2UgfSA9IHN0b3JlLmdldFN0YXRlKCkuZW5naW5lUmVkdWNlcjtcclxuICAgICAgICBjb25zdCBwcm9qZWN0ID0gd29ya3NwYWNlLnByb2plY3Q7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcclxuICAgICAgICAgICAgaW5mbzogcHJvamVjdC5pdGVtc1t0aGlzLnByb3BzLnVpZF0sXHJcbiAgICAgICAgICAgIGl0ZW1Db250YWluZXJDbGFzc05hbWU6IGRlZmF1bHRJdGVtQ29udGFpbmVyQ2xhc3NOYW1lLFxyXG4gICAgICAgICAgICB0YWdcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLnNhdmVTZXJ2aWNlID0gbmV3IFNhdmVTZXJ2aWNlKCk7XHJcblxyXG4gICAgICAgIHRoaXMuaGFuZGxlSXRlbUNvbnRhaW5lckNsaWNrID0gdGhpcy5oYW5kbGVJdGVtQ29udGFpbmVyQ2xpY2suYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLmhhbmRsZU91dHNpZGVDbGljayA9IHRoaXMuaGFuZGxlT3V0c2lkZUNsaWNrLmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5kcmFnID0gdGhpcy5kcmFnLmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVEcmFnU3RhcnQgPSB0aGlzLmhhbmRsZURyYWdTdGFydC5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlRHJhZyA9IHRoaXMuaGFuZGxlRHJhZy5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlRHJhZ0VuZCA9IHRoaXMuaGFuZGxlRHJhZ0VuZC5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMubW91c2Vtb3ZlID0gdGhpcy5tb3VzZW1vdmUuYmluZCh0aGlzKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgY29tcG9uZW50V2lsbE1vdW50KCkge1xyXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMuaGFuZGxlT3V0c2lkZUNsaWNrLCBmYWxzZSk7XHJcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5tb3VzZW1vdmUsIGZhbHNlKTtcclxuICAgIH1cclxuXHJcbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcclxuICAgICAgICB0aGlzLmRyYWdJbWcgPSBuZXcgSW1hZ2UoMCwwKTtcclxuICAgICAgICB0aGlzLmRyYWdJbWcuc3JjID0gJ2RhdGE6aW1hZ2UvZ2lmO2Jhc2U2NCxSMGxHT0RsaEFRQUJBSUFBQUFBQUFQLy8veUg1QkFFQUFBQUFMQUFBQUFBQkFBRUFBQUlCUkFBNyc7XHJcbiAgICB9XHJcblxyXG4gICAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XHJcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgdGhpcy5oYW5kbGVPdXRzaWRlQ2xpY2ssIGZhbHNlKTtcclxuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLm1vdXNlbW91dmUsIGZhbHNlKTtcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVPdXRzaWRlQ2xpY2soZSkge1xyXG4gICAgICAgIGlmICh0aGlzLml0ZW0uY29udGFpbnMoZS50YXJnZXQpKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5zdGF0ZSwge1xyXG4gICAgICAgICAgICBpdGVtQ29udGFpbmVyQ2xhc3NOYW1lOiBkZWZhdWx0SXRlbUNvbnRhaW5lckNsYXNzTmFtZVxyXG4gICAgICAgIH0pKTtcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVJdGVtQ29udGFpbmVyQ2xpY2soKSB7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZShPYmplY3QuYXNzaWduKHt9LCB0aGlzLnN0YXRlLCB7XHJcbiAgICAgICAgICAgIGl0ZW1Db250YWluZXJDbGFzc05hbWU6IGRlZmF1bHRJdGVtQ29udGFpbmVyQ2xhc3NOYW1lICsgJyBmb2N1cydcclxuICAgICAgICB9KSk7XHJcblxyXG4gICAgICAgIGNvbnN0IHsgd29ya3NwYWNlIH0gPSBzdG9yZS5nZXRTdGF0ZSgpLmVuZ2luZVJlZHVjZXI7XHJcbiAgICAgICAgdmFyIGl0ZW1zID0gd29ya3NwYWNlLnByb2plY3QuaXRlbXM7XHJcblxyXG4gICAgICAgIGNvbnN0IGN1cnJlbnRfeiA9IGl0ZW1zW3RoaXMucHJvcHMudWlkXS56O1xyXG4gICAgICAgIHZhciB0b3BfeiA9IGN1cnJlbnRfejtcclxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gaXRlbXMpIHtcclxuICAgICAgICAgICAgaWYgKGtleSAhPT0gdGhpcy5wcm9wcy51aWQgJiYgaXRlbXNba2V5XS56ID4gY3VycmVudF96KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXRlbXNba2V5XS56ID4gdG9wX3opIHtcclxuICAgICAgICAgICAgICAgICAgICB0b3BfeiA9IGl0ZW1zW2tleV0uejtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGl0ZW1zW2tleV0ueiAtPSAxO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGl0ZW1zW3RoaXMucHJvcHMudWlkXS56ID0gdG9wX3o7XHJcblxyXG4gICAgICAgIHRoaXMucHJvcHMudXBkYXRlUHJvamVjdEl0ZW1zKGl0ZW1zKTtcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVEcmFnU3RhcnQoZSkge1xyXG4gICAgICAgIHRoaXMuaGFuZGxlSXRlbUNvbnRhaW5lckNsaWNrKCk7XHJcblxyXG4gICAgICAgIHRoaXMucHJvcHMuZ0NsaWNrZWQoe1xyXG4gICAgICAgICAgICBnQ2xhc3NMaXN0OiAnZ2lkIGhpZGRlbidcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZS5kYXRhVHJhbnNmZXIuc2V0RHJhZ0ltYWdlKHRoaXMuZHJhZ0ltZywgMCwgMCk7XHJcbiAgICAgICAgZS50YXJnZXQuc3R5bGUuY3Vyc29yID0gJ21vdmUnO1xyXG5cclxuICAgICAgICBjb25zdCB7IHdvcmtzcGFjZSB9ID0gc3RvcmUuZ2V0U3RhdGUoKS5lbmdpbmVSZWR1Y2VyO1xyXG4gICAgICAgIGNvbnN0IGNvbnRhaW5lciA9IHdvcmtzcGFjZS5wcm9qZWN0LmNvbnRhaW5lci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgICAgICBjb25zdCBpdGVtID0gd29ya3NwYWNlLnByb2plY3QuaXRlbXNbdGhpcy5wcm9wcy51aWRdO1xyXG5cclxuICAgICAgICB0aGlzLmRyYWdnaW5nID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLmRyYWdPZmZzZXRYID0gaXRlbS54IC0gKGUuY2xpZW50WCAtIGNvbnRhaW5lci5sZWZ0KTtcclxuICAgICAgICB0aGlzLmRyYWdPZmZzZXRZID0gaXRlbS55IC0gKGUuY2xpZW50WSAtIGNvbnRhaW5lci50b3ApO1xyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZURyYWcoZSkge1xyXG4gICAgICAgIHRoaXMuZHJhZyhlKTtcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVEcmFnRW5kKGUpIHtcclxuICAgICAgICB2YXIgaW5mbyA9IHRoaXMuZHJhZyhlKTtcclxuXHJcbiAgICAgICAgdGhpcy5kcmFnZ2luZyA9IGZhbHNlO1xyXG5cclxuICAgICAgICB0aGlzLnByb3BzLmdDbGlja2VkKHtcclxuICAgICAgICAgICAgZ0NsYXNzTGlzdDogJ2dpZCdcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5wcm9wcy51cGRhdGVQcm9qZWN0KHtcclxuICAgICAgICAgICAgcGF0aDogdGhpcy5wcm9wcy51aWQsXHJcbiAgICAgICAgICAgIHZhbHVlOiBpbmZvXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNvbnN0IHsgd29ya3NwYWNlIH0gPSBzdG9yZS5nZXRTdGF0ZSgpLmVuZ2luZVJlZHVjZXI7XHJcbiAgICAgICAgdGhpcy5zYXZlU2VydmljZS5zYXZlUHJvamVjdCgnMScsICcxJywgd29ya3NwYWNlLnByb2plY3QpO1xyXG4gICAgfVxyXG5cclxuICAgIGRyYWcoZSkge1xyXG4gICAgICAgIGNvbnN0IHsgd29ya3NwYWNlIH0gPSBzdG9yZS5nZXRTdGF0ZSgpLmVuZ2luZVJlZHVjZXI7XHJcbiAgICAgICAgY29uc3QgY29udGFpbmVyID0gd29ya3NwYWNlLnByb2plY3QuY29udGFpbmVyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgICAgIGNvbnN0IGRlZmF1bHRXaWR0aCA9IHdvcmtzcGFjZS5wcm9qZWN0LmNvbmZpZy5jZWxsV2lkdGg7XHJcbiAgICAgICAgY29uc3QgZGVmYXVsdEhlaWdodCA9IHdvcmtzcGFjZS5wcm9qZWN0LmNvbmZpZy5jZWxsSGVpZ2h0O1xyXG5cclxuICAgICAgICBjb25zdCB4ID0gTWF0aC5mbG9vcigoZS5jbGllbnRYIC0gKGNvbnRhaW5lci5sZWZ0IC0gdGhpcy5kcmFnT2Zmc2V0WCkpIC8gZGVmYXVsdFdpZHRoKSAqIGRlZmF1bHRXaWR0aDtcclxuICAgICAgICBjb25zdCB5ID0gTWF0aC5mbG9vcigoZS5jbGllbnRZIC0gKGNvbnRhaW5lci50b3AgLSB0aGlzLmRyYWdPZmZzZXRZKSkgLyBkZWZhdWx0SGVpZ2h0KSAqIGRlZmF1bHRIZWlnaHQ7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdmFyIGxlZnQgPSB4ID4gMCA/IHggOiAwO1xyXG4gICAgICAgIHZhciB0b3AgPSB5ID4gMCA/IHkgOiAwO1xyXG5cclxuICAgICAgICBjb25zdCByZWN0ID0gdGhpcy5pdGVtLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgICAgIGNvbnN0IGl0ZW1PZmZzZXRMZWZ0ID0gbGVmdCArIHJlY3Qud2lkdGg7XHJcbiAgICAgICAgY29uc3QgaXRlbU9mZnNldFRvcCA9IHRvcCArIHJlY3QuaGVpZ2h0O1xyXG5cclxuICAgICAgICBpZiAoaXRlbU9mZnNldExlZnQgPiBjb250YWluZXIud2lkdGgpIHtcclxuICAgICAgICAgICAgbGVmdCA9IE1hdGguZmxvb3IoKGNvbnRhaW5lci53aWR0aCAtIHJlY3Qud2lkdGgpIC8gZGVmYXVsdFdpZHRoKSAqIGRlZmF1bHRXaWR0aDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChpdGVtT2Zmc2V0VG9wID4gY29udGFpbmVyLmhlaWdodCkge1xyXG4gICAgICAgICAgICB0b3AgPSBNYXRoLmZsb29yKChjb250YWluZXIuaGVpZ2h0IC0gcmVjdC5oZWlnaHQpIC8gZGVmYXVsdEhlaWdodCkgKiBkZWZhdWx0SGVpZ2h0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgaW5mbyA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuc3RhdGUuaW5mbywge1xyXG4gICAgICAgICAgICB4OiBsZWZ0LFxyXG4gICAgICAgICAgICB5OiB0b3BcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZShPYmplY3QuYXNzaWduKHt9LCB0aGlzLnN0YXRlLCB7XHJcbiAgICAgICAgICAgIGluZm9cclxuICAgICAgICB9KSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIGluZm87XHJcbiAgICB9XHJcblxyXG4gICAgbW91c2Vtb3ZlKGUpIHtcclxuICAgICAgICBpZiAodGhpcy5kcmFnZ2luZykge1xyXG4gICAgICAgICAgICBlLnRhcmdldC5zdHlsZS5jdXJzb3IgPSAnbW92ZSc7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IGl0ZW1Db250YWluZXJDbGFzc05hbWUsIGluZm8sIHRhZyB9ID0gdGhpcy5zdGF0ZTtcclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiBcclxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17aXRlbUNvbnRhaW5lckNsYXNzTmFtZX1cclxuICAgICAgICAgICAgICAgIHJlZj17aXRlbSA9PiB0aGlzLml0ZW0gPSBpdGVtfVxyXG4gICAgICAgICAgICAgICAgb25DbGljaz17dGhpcy5oYW5kbGVJdGVtQ29udGFpbmVyQ2xpY2t9XHJcbiAgICAgICAgICAgICAgICBkcmFnZ2FibGU9e3RydWV9XHJcbiAgICAgICAgICAgICAgICBvbkRyYWdTdGFydD17dGhpcy5oYW5kbGVEcmFnU3RhcnR9XHJcbiAgICAgICAgICAgICAgICBvbkRyYWc9e3RoaXMuaGFuZGxlRHJhZ31cclxuICAgICAgICAgICAgICAgIG9uRHJhZ0VuZD17dGhpcy5oYW5kbGVEcmFnRW5kfVxyXG4gICAgICAgICAgICAgICAgc3R5bGU9e3sgXHJcbiAgICAgICAgICAgICAgICAgICAgdG9wOiBpbmZvLnksIFxyXG4gICAgICAgICAgICAgICAgICAgIGxlZnQ6IGluZm8ueCxcclxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogaW5mby53aWR0aCxcclxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IGluZm8uaGVpZ2h0LFxyXG4gICAgICAgICAgICAgICAgICAgIHpJbmRleDogaW5mby56ICsgMTAwXHJcbiAgICAgICAgICAgICAgICB9fT5cclxuICAgICAgICAgICAgICAgIHt0YWd9XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IEl0ZW0gPSBjb25uZWN0KG1hcFN0YXRlVG9Qcm9wcywgbWFwRGlzcGF0Y2hUb1Byb3BzKShJdGVtQ29tcG9uZW50KTtcclxuZXhwb3J0IGRlZmF1bHQgSXRlbTsiLCJpbXBvcnQgeyBIdHRwIH0gZnJvbSAnLi4vaHR0cCc7XHJcblxyXG5leHBvcnQgY2xhc3MgU2F2ZVNlcnZpY2Uge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5odHRwID0gbmV3IEh0dHAoKTtcclxuICAgIH1cclxuXHJcbiAgICBzYXZlUHJvamVjdCh3b3Jrc3BhY2VfaWQsIHByb2plY3RfaWQsIHByb2plY3QpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5odHRwLnB1dChgL2FwaS92MS93b3Jrc3BhY2UvJHt3b3Jrc3BhY2VfaWR9L3Byb2plY3QvJHtwcm9qZWN0X2lkfWAsIHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtczogcHJvamVjdC5pdGVtcyxcclxuICAgICAgICAgICAgICAgICAgICBjb25maWc6IHByb2plY3QuY29uZmlnXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgIHJlamVjdChlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59OyIsImV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzXCIpKHRydWUpO1xuLy8gTW9kdWxlXG5leHBvcnRzLnB1c2goW21vZHVsZS5pZCwgXCIuaXRlbS1jb250YWluZXIge1xcbiAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgYm9yZGVyOiAxcHggc29saWQgIzc4Nzg3ODtcXG4gIGJhY2tncm91bmQ6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC45KTtcXG4gIHBhZGRpbmc6IDRweDtcXG4gIGN1cnNvcjogbW92ZTsgfVxcbiAgLml0ZW0tY29udGFpbmVyIGgxLCAuaXRlbS1jb250YWluZXIgaDIsIC5pdGVtLWNvbnRhaW5lciBoMywgLml0ZW0tY29udGFpbmVyIGg0LCAuaXRlbS1jb250YWluZXIgaDUsIC5pdGVtLWNvbnRhaW5lciBoNiB7XFxuICAgIG1hcmdpbjogMDsgfVxcbiAgLml0ZW0tY29udGFpbmVyLmZvY3VzIHtcXG4gICAgYmFja2dyb3VuZDogcmdiYSgyNDAsIDI0MCwgMjQwLCAwLjkpOyB9XFxuXCIsIFwiXCIse1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wiQzovVXNlcnMvZ2Fycmkvc291cmNlL3JlcG9zL3NuYXBmb3JtL2NsaWVudC9lbmdpbmUvYXNzZXRzL3N0eWxlL2NvbXBvbmVudHMvaXRlbS9jbGllbnQvZW5naW5lL2Fzc2V0cy9zdHlsZS9jb21wb25lbnRzL2l0ZW0vaXRlbS5zY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUFBO0VBQ0ksa0JBQWtCO0VBQ2xCLHlCQUF5QjtFQUN6QixvQ0FBb0M7RUFDcEMsWUFBWTtFQUNaLFlBQVksRUFBQTtFQUxoQjtJQVFRLFNBQVMsRUFBQTtFQVJqQjtJQVlRLG9DQUFvQyxFQUFBXCIsXCJmaWxlXCI6XCJpdGVtLnNjc3NcIixcInNvdXJjZXNDb250ZW50XCI6W1wiLml0ZW0tY29udGFpbmVyIHtcXHJcXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xcclxcbiAgICBib3JkZXI6IDFweCBzb2xpZCAjNzg3ODc4O1xcclxcbiAgICBiYWNrZ3JvdW5kOiByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuOSk7XFxyXFxuICAgIHBhZGRpbmc6IDRweDtcXHJcXG4gICAgY3Vyc29yOiBtb3ZlO1xcclxcblxcclxcbiAgICBoMSwgaDIsIGgzLCBoNCwgaDUsIGg2IHtcXHJcXG4gICAgICAgIG1hcmdpbjogMDtcXHJcXG4gICAgfVxcclxcblxcclxcbiAgICAmLmZvY3VzIHtcXHJcXG4gICAgICAgIGJhY2tncm91bmQ6IHJnYmEoMjQwLCAyNDAsIDI0MCwgMC45KTtcXHJcXG4gICAgfVxcclxcbn1cIl0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcblxuIiwiXG52YXIgY29udGVudCA9IHJlcXVpcmUoXCIhIS4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzPz9yZWYtLTYtMSEuLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvbGliL2xvYWRlci5qcz8/cmVmLS02LTIhLi9pdGVtLnNjc3NcIik7XG5cbmlmKHR5cGVvZiBjb250ZW50ID09PSAnc3RyaW5nJykgY29udGVudCA9IFtbbW9kdWxlLmlkLCBjb250ZW50LCAnJ11dO1xuXG52YXIgdHJhbnNmb3JtO1xudmFyIGluc2VydEludG87XG5cblxuXG52YXIgb3B0aW9ucyA9IHtcImhtclwiOnRydWV9XG5cbm9wdGlvbnMudHJhbnNmb3JtID0gdHJhbnNmb3JtXG5vcHRpb25zLmluc2VydEludG8gPSB1bmRlZmluZWQ7XG5cbnZhciB1cGRhdGUgPSByZXF1aXJlKFwiIS4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvbGliL2FkZFN0eWxlcy5qc1wiKShjb250ZW50LCBvcHRpb25zKTtcblxuaWYoY29udGVudC5sb2NhbHMpIG1vZHVsZS5leHBvcnRzID0gY29udGVudC5sb2NhbHM7XG5cbmlmKG1vZHVsZS5ob3QpIHtcblx0bW9kdWxlLmhvdC5hY2NlcHQoXCIhIS4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzPz9yZWYtLTYtMSEuLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvbGliL2xvYWRlci5qcz8/cmVmLS02LTIhLi9pdGVtLnNjc3NcIiwgZnVuY3Rpb24oKSB7XG5cdFx0dmFyIG5ld0NvbnRlbnQgPSByZXF1aXJlKFwiISEuLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcz8/cmVmLS02LTEhLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2xpYi9sb2FkZXIuanM/P3JlZi0tNi0yIS4vaXRlbS5zY3NzXCIpO1xuXG5cdFx0aWYodHlwZW9mIG5ld0NvbnRlbnQgPT09ICdzdHJpbmcnKSBuZXdDb250ZW50ID0gW1ttb2R1bGUuaWQsIG5ld0NvbnRlbnQsICcnXV07XG5cblx0XHR2YXIgbG9jYWxzID0gKGZ1bmN0aW9uKGEsIGIpIHtcblx0XHRcdHZhciBrZXksIGlkeCA9IDA7XG5cblx0XHRcdGZvcihrZXkgaW4gYSkge1xuXHRcdFx0XHRpZighYiB8fCBhW2tleV0gIT09IGJba2V5XSkgcmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRpZHgrKztcblx0XHRcdH1cblxuXHRcdFx0Zm9yKGtleSBpbiBiKSBpZHgtLTtcblxuXHRcdFx0cmV0dXJuIGlkeCA9PT0gMDtcblx0XHR9KGNvbnRlbnQubG9jYWxzLCBuZXdDb250ZW50LmxvY2FscykpO1xuXG5cdFx0aWYoIWxvY2FscykgdGhyb3cgbmV3IEVycm9yKCdBYm9ydGluZyBDU1MgSE1SIGR1ZSB0byBjaGFuZ2VkIGNzcy1tb2R1bGVzIGxvY2Fscy4nKTtcblxuXHRcdHVwZGF0ZShuZXdDb250ZW50KTtcblx0fSk7XG5cblx0bW9kdWxlLmhvdC5kaXNwb3NlKGZ1bmN0aW9uKCkgeyB1cGRhdGUoKTsgfSk7XG59Il0sInNvdXJjZVJvb3QiOiIifQ==