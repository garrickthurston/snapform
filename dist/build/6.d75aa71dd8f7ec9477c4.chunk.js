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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9jbGllbnQvZW5naW5lL3NyYy9jb21wb25lbnRzL2l0ZW0vaXRlbS5jb21wb25lbnQuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L2VuZ2luZS9hc3NldHMvc3R5bGUvY29tcG9uZW50cy9pdGVtL2l0ZW0uc2NzcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvZW5naW5lL2Fzc2V0cy9zdHlsZS9jb21wb25lbnRzL2l0ZW0vaXRlbS5zY3NzPzgyMjkiXSwibmFtZXMiOlsibWFwU3RhdGVUb1Byb3BzIiwic3RhdGUiLCJtYXBEaXNwYXRjaFRvUHJvcHMiLCJkaXNwYXRjaCIsInVwZGF0ZVByb2plY3QiLCJwYXlsb2FkIiwiZ0NsaWNrZWQiLCJ1cGRhdGVQcm9qZWN0SXRlbXMiLCJkZWZhdWx0SXRlbUNvbnRhaW5lckNsYXNzTmFtZSIsIkl0ZW1Db21wb25lbnQiLCJDb21wb25lbnQiLCJjb25zdHJ1Y3RvciIsInByb3BzIiwiVGFnTmFtZSIsInRhZyIsIm5hbWUiLCJpbm5lclZhbHVlIiwidmFsdWUiLCJ3b3Jrc3BhY2UiLCJzdG9yZSIsImdldFN0YXRlIiwiZW5naW5lUmVkdWNlciIsInByb2plY3QiLCJpbmZvIiwiaXRlbXMiLCJ1aWQiLCJpdGVtQ29udGFpbmVyQ2xhc3NOYW1lIiwicHJvamVjdFNlcnZpY2UiLCJQcm9qZWN0U2VydmljZSIsImhhbmRsZUl0ZW1Db250YWluZXJDbGljayIsImJpbmQiLCJoYW5kbGVPdXRzaWRlQ2xpY2siLCJkcmFnIiwiaGFuZGxlRHJhZ1N0YXJ0IiwiaGFuZGxlRHJhZyIsImhhbmRsZURyYWdFbmQiLCJtb3VzZW1vdmUiLCJjb21wb25lbnRXaWxsTW91bnQiLCJkb2N1bWVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJjb21wb25lbnREaWRNb3VudCIsImRyYWdJbWciLCJJbWFnZSIsInNyYyIsImNvbXBvbmVudFdpbGxVbm1vdW50IiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsIm1vdXNlbW91dmUiLCJlIiwiaXRlbSIsImNvbnRhaW5zIiwidGFyZ2V0Iiwic2V0U3RhdGUiLCJPYmplY3QiLCJhc3NpZ24iLCJjdXJyZW50X3oiLCJ6IiwidG9wX3oiLCJrZXkiLCJnQ2xhc3NMaXN0IiwiZGF0YVRyYW5zZmVyIiwic2V0RHJhZ0ltYWdlIiwic3R5bGUiLCJjdXJzb3IiLCJjb250YWluZXIiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJkcmFnZ2luZyIsImRyYWdPZmZzZXRYIiwieCIsImNsaWVudFgiLCJsZWZ0IiwiZHJhZ09mZnNldFkiLCJ5IiwiY2xpZW50WSIsInRvcCIsInBhdGgiLCJwdXQiLCJpZCIsImRlZmF1bHRXaWR0aCIsImNvbmZpZyIsImNlbGxXaWR0aCIsImRlZmF1bHRIZWlnaHQiLCJjZWxsSGVpZ2h0IiwiTWF0aCIsImZsb29yIiwicmVjdCIsIml0ZW1PZmZzZXRMZWZ0Iiwid2lkdGgiLCJpdGVtT2Zmc2V0VG9wIiwiaGVpZ2h0IiwicmVuZGVyIiwiekluZGV4IiwiSXRlbSIsImNvbm5lY3QiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7QUFFQSxNQUFNQSxlQUFlLEdBQUlDLEtBQUQsSUFBV0EsS0FBbkM7O0FBQ0EsTUFBTUMsa0JBQWtCLEdBQUlDLFFBQUQsSUFBYztBQUNyQyxTQUFPO0FBQ0hDLGlCQUFhLEVBQUVDLE9BQU8sSUFBSUYsUUFBUSxDQUFDQyxpRkFBYSxDQUFDQyxPQUFELENBQWQsQ0FEL0I7QUFFSEMsWUFBUSxFQUFFRCxPQUFPLElBQUlGLFFBQVEsQ0FBQ0csNEVBQVEsQ0FBQ0QsT0FBRCxDQUFULENBRjFCO0FBR0hFLHNCQUFrQixFQUFFRixPQUFPLElBQUlGLFFBQVEsQ0FBQ0ksc0ZBQWtCLENBQUNGLE9BQUQsQ0FBbkI7QUFIcEMsR0FBUDtBQUtILENBTkQ7O0FBUUEsTUFBTUcsNkJBQTZCLEdBQUcsZ0JBQXRDOztBQUVBLE1BQU1DLGFBQU4sU0FBNEJDLCtDQUE1QixDQUFzQztBQUtsQ0MsYUFBVyxDQUFDQyxLQUFELEVBQVE7QUFDZixVQUFNQSxLQUFOOztBQURlLHNDQUpSLEtBSVE7O0FBQUEseUNBSEwsQ0FHSzs7QUFBQSx5Q0FGTCxDQUVLOztBQUdmLFVBQU1DLE9BQU8sR0FBSSxHQUFFLEtBQUtELEtBQUwsQ0FBV0UsR0FBWCxDQUFlQyxJQUFLLEVBQXZDO0FBQ0EsUUFBSUQsR0FBRyxHQUFHLElBQVY7O0FBQ0EsUUFBSSxLQUFLRixLQUFMLENBQVdFLEdBQVgsQ0FBZUUsVUFBbkIsRUFBK0I7QUFDM0JGLFNBQUcsR0FBSSwyREFBQyxPQUFELFFBQVUsS0FBS0YsS0FBTCxDQUFXRSxHQUFYLENBQWVHLEtBQXpCLENBQVA7QUFDSCxLQUZELE1BRU87QUFDSEgsU0FBRyxHQUFJLDJEQUFDLE9BQUQ7QUFBUyxhQUFLLEVBQUUsS0FBS0YsS0FBTCxDQUFXRSxHQUFYLENBQWVHO0FBQS9CLFFBQVA7QUFDSDs7QUFFRCxVQUFNO0FBQUVDO0FBQUYsUUFBZ0JDLHNFQUFLLENBQUNDLFFBQU4sR0FBaUJDLGFBQXZDO0FBQ0EsVUFBTUMsT0FBTyxHQUFHSixTQUFTLENBQUNJLE9BQTFCO0FBRUEsU0FBS3JCLEtBQUwsR0FBYTtBQUNUc0IsVUFBSSxFQUFFRCxPQUFPLENBQUNFLEtBQVIsQ0FBYyxLQUFLWixLQUFMLENBQVdhLEdBQXpCLENBREc7QUFFVEMsNEJBQXNCLEVBQUVsQiw2QkFGZjtBQUdUTTtBQUhTLEtBQWI7QUFNQSxTQUFLYSxjQUFMLEdBQXNCLElBQUlDLCtFQUFKLEVBQXRCO0FBRUEsU0FBS0Msd0JBQUwsR0FBZ0MsS0FBS0Esd0JBQUwsQ0FBOEJDLElBQTlCLENBQW1DLElBQW5DLENBQWhDO0FBQ0EsU0FBS0Msa0JBQUwsR0FBMEIsS0FBS0Esa0JBQUwsQ0FBd0JELElBQXhCLENBQTZCLElBQTdCLENBQTFCO0FBQ0EsU0FBS0UsSUFBTCxHQUFZLEtBQUtBLElBQUwsQ0FBVUYsSUFBVixDQUFlLElBQWYsQ0FBWjtBQUNBLFNBQUtHLGVBQUwsR0FBdUIsS0FBS0EsZUFBTCxDQUFxQkgsSUFBckIsQ0FBMEIsSUFBMUIsQ0FBdkI7QUFDQSxTQUFLSSxVQUFMLEdBQWtCLEtBQUtBLFVBQUwsQ0FBZ0JKLElBQWhCLENBQXFCLElBQXJCLENBQWxCO0FBQ0EsU0FBS0ssYUFBTCxHQUFxQixLQUFLQSxhQUFMLENBQW1CTCxJQUFuQixDQUF3QixJQUF4QixDQUFyQjtBQUNBLFNBQUtNLFNBQUwsR0FBaUIsS0FBS0EsU0FBTCxDQUFlTixJQUFmLENBQW9CLElBQXBCLENBQWpCO0FBRUg7O0FBRURPLG9CQUFrQixHQUFHO0FBQ2pCQyxZQUFRLENBQUNDLGdCQUFULENBQTBCLFdBQTFCLEVBQXVDLEtBQUtSLGtCQUE1QyxFQUFnRSxLQUFoRTtBQUNBTyxZQUFRLENBQUNDLGdCQUFULENBQTBCLFdBQTFCLEVBQXVDLEtBQUtILFNBQTVDLEVBQXVELEtBQXZEO0FBQ0g7O0FBRURJLG1CQUFpQixHQUFHO0FBQ2hCLFNBQUtDLE9BQUwsR0FBZSxJQUFJQyxLQUFKLENBQVUsQ0FBVixFQUFZLENBQVosQ0FBZjtBQUNBLFNBQUtELE9BQUwsQ0FBYUUsR0FBYixHQUFtQixnRkFBbkI7QUFDSDs7QUFFREMsc0JBQW9CLEdBQUc7QUFDbkJOLFlBQVEsQ0FBQ08sbUJBQVQsQ0FBNkIsV0FBN0IsRUFBMEMsS0FBS2Qsa0JBQS9DLEVBQW1FLEtBQW5FO0FBQ0FPLFlBQVEsQ0FBQ08sbUJBQVQsQ0FBNkIsV0FBN0IsRUFBMEMsS0FBS0MsVUFBL0MsRUFBMkQsS0FBM0Q7QUFDSDs7QUFFRGYsb0JBQWtCLENBQUNnQixDQUFELEVBQUk7QUFDbEIsUUFBSSxLQUFLQyxJQUFMLENBQVVDLFFBQVYsQ0FBbUJGLENBQUMsQ0FBQ0csTUFBckIsQ0FBSixFQUFrQztBQUM5QjtBQUNIOztBQUVELFNBQUtDLFFBQUwsQ0FBY0MsTUFBTSxDQUFDQyxNQUFQLENBQWMsRUFBZCxFQUFrQixLQUFLcEQsS0FBdkIsRUFBOEI7QUFDeEN5Qiw0QkFBc0IsRUFBRWxCO0FBRGdCLEtBQTlCLENBQWQ7QUFHSDs7QUFFRHFCLDBCQUF3QixHQUFHO0FBQ3ZCLFNBQUtzQixRQUFMLENBQWNDLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjLEVBQWQsRUFBa0IsS0FBS3BELEtBQXZCLEVBQThCO0FBQ3hDeUIsNEJBQXNCLEVBQUVsQiw2QkFBNkIsR0FBRztBQURoQixLQUE5QixDQUFkO0FBSUEsVUFBTTtBQUFFVTtBQUFGLFFBQWdCQyxzRUFBSyxDQUFDQyxRQUFOLEdBQWlCQyxhQUF2QztBQUNBLFFBQUlHLEtBQUssR0FBR04sU0FBUyxDQUFDSSxPQUFWLENBQWtCRSxLQUE5QjtBQUVBLFVBQU04QixTQUFTLEdBQUc5QixLQUFLLENBQUMsS0FBS1osS0FBTCxDQUFXYSxHQUFaLENBQUwsQ0FBc0I4QixDQUF4QztBQUNBLFFBQUlDLEtBQUssR0FBR0YsU0FBWjs7QUFDQSxTQUFLLElBQUlHLEdBQVQsSUFBZ0JqQyxLQUFoQixFQUF1QjtBQUNuQixVQUFJaUMsR0FBRyxLQUFLLEtBQUs3QyxLQUFMLENBQVdhLEdBQW5CLElBQTBCRCxLQUFLLENBQUNpQyxHQUFELENBQUwsQ0FBV0YsQ0FBWCxHQUFlRCxTQUE3QyxFQUF3RDtBQUNwRCxZQUFJOUIsS0FBSyxDQUFDaUMsR0FBRCxDQUFMLENBQVdGLENBQVgsR0FBZUMsS0FBbkIsRUFBMEI7QUFDdEJBLGVBQUssR0FBR2hDLEtBQUssQ0FBQ2lDLEdBQUQsQ0FBTCxDQUFXRixDQUFuQjtBQUNIOztBQUNEL0IsYUFBSyxDQUFDaUMsR0FBRCxDQUFMLENBQVdGLENBQVgsSUFBZ0IsQ0FBaEI7QUFDSDtBQUNKOztBQUNEL0IsU0FBSyxDQUFDLEtBQUtaLEtBQUwsQ0FBV2EsR0FBWixDQUFMLENBQXNCOEIsQ0FBdEIsR0FBMEJDLEtBQTFCO0FBRUEsU0FBSzVDLEtBQUwsQ0FBV0wsa0JBQVgsQ0FBOEJpQixLQUE5QjtBQUNIOztBQUVEUyxpQkFBZSxDQUFDYyxDQUFELEVBQUk7QUFDZixTQUFLbEIsd0JBQUw7QUFFQSxTQUFLakIsS0FBTCxDQUFXTixRQUFYLENBQW9CO0FBQ2hCb0QsZ0JBQVUsRUFBRTtBQURJLEtBQXBCO0FBSUFYLEtBQUMsQ0FBQ1ksWUFBRixDQUFlQyxZQUFmLENBQTRCLEtBQUtuQixPQUFqQyxFQUEwQyxDQUExQyxFQUE2QyxDQUE3QztBQUNBTSxLQUFDLENBQUNHLE1BQUYsQ0FBU1csS0FBVCxDQUFlQyxNQUFmLEdBQXdCLE1BQXhCO0FBRUEsVUFBTTtBQUFFNUM7QUFBRixRQUFnQkMsc0VBQUssQ0FBQ0MsUUFBTixHQUFpQkMsYUFBdkM7QUFDQSxVQUFNMEMsU0FBUyxHQUFHN0MsU0FBUyxDQUFDSSxPQUFWLENBQWtCeUMsU0FBbEIsQ0FBNEJDLHFCQUE1QixFQUFsQjtBQUNBLFVBQU1oQixJQUFJLEdBQUc5QixTQUFTLENBQUNJLE9BQVYsQ0FBa0JFLEtBQWxCLENBQXdCLEtBQUtaLEtBQUwsQ0FBV2EsR0FBbkMsQ0FBYjtBQUVBLFNBQUt3QyxRQUFMLEdBQWdCLElBQWhCO0FBQ0EsU0FBS0MsV0FBTCxHQUFtQmxCLElBQUksQ0FBQ21CLENBQUwsSUFBVXBCLENBQUMsQ0FBQ3FCLE9BQUYsR0FBWUwsU0FBUyxDQUFDTSxJQUFoQyxDQUFuQjtBQUNBLFNBQUtDLFdBQUwsR0FBbUJ0QixJQUFJLENBQUN1QixDQUFMLElBQVV4QixDQUFDLENBQUN5QixPQUFGLEdBQVlULFNBQVMsQ0FBQ1UsR0FBaEMsQ0FBbkI7QUFDSDs7QUFFRHZDLFlBQVUsQ0FBQ2EsQ0FBRCxFQUFJO0FBQ1YsU0FBS2YsSUFBTCxDQUFVZSxDQUFWO0FBQ0g7O0FBRUQsUUFBTVosYUFBTixDQUFvQlksQ0FBcEIsRUFBdUI7QUFDbkIsUUFBSXhCLElBQUksR0FBRyxLQUFLUyxJQUFMLENBQVVlLENBQVYsQ0FBWDtBQUVBLFNBQUtrQixRQUFMLEdBQWdCLEtBQWhCO0FBRUEsU0FBS3JELEtBQUwsQ0FBV04sUUFBWCxDQUFvQjtBQUNoQm9ELGdCQUFVLEVBQUU7QUFESSxLQUFwQjtBQUlBLFNBQUs5QyxLQUFMLENBQVdSLGFBQVgsQ0FBeUI7QUFDckJzRSxVQUFJLEVBQUUsS0FBSzlELEtBQUwsQ0FBV2EsR0FESTtBQUVyQlIsV0FBSyxFQUFFTTtBQUZjLEtBQXpCO0FBS0EsVUFBTTtBQUFFTDtBQUFGLFFBQWdCQyxzRUFBSyxDQUFDQyxRQUFOLEdBQWlCQyxhQUF2QztBQUNBLFVBQU0sS0FBS00sY0FBTCxDQUFvQmdELEdBQXBCLENBQXdCekQsU0FBUyxDQUFDMEQsRUFBbEMsRUFBc0MxRCxTQUFTLENBQUNJLE9BQVYsQ0FBa0JzRCxFQUF4RCxFQUE0RDFELFNBQVMsQ0FBQ0ksT0FBdEUsQ0FBTjtBQUNIOztBQUVEVSxNQUFJLENBQUNlLENBQUQsRUFBSTtBQUNKLFVBQU07QUFBRTdCO0FBQUYsUUFBZ0JDLHNFQUFLLENBQUNDLFFBQU4sR0FBaUJDLGFBQXZDO0FBQ0EsVUFBTTBDLFNBQVMsR0FBRzdDLFNBQVMsQ0FBQ0ksT0FBVixDQUFrQnlDLFNBQWxCLENBQTRCQyxxQkFBNUIsRUFBbEI7QUFDQSxVQUFNYSxZQUFZLEdBQUczRCxTQUFTLENBQUNJLE9BQVYsQ0FBa0J3RCxNQUFsQixDQUF5QkMsU0FBOUM7QUFDQSxVQUFNQyxhQUFhLEdBQUc5RCxTQUFTLENBQUNJLE9BQVYsQ0FBa0J3RCxNQUFsQixDQUF5QkcsVUFBL0M7QUFFQSxVQUFNZCxDQUFDLEdBQUdlLElBQUksQ0FBQ0MsS0FBTCxDQUFXLENBQUNwQyxDQUFDLENBQUNxQixPQUFGLElBQWFMLFNBQVMsQ0FBQ00sSUFBVixHQUFpQixLQUFLSCxXQUFuQyxDQUFELElBQW9EVyxZQUEvRCxJQUErRUEsWUFBekY7QUFDQSxVQUFNTixDQUFDLEdBQUdXLElBQUksQ0FBQ0MsS0FBTCxDQUFXLENBQUNwQyxDQUFDLENBQUN5QixPQUFGLElBQWFULFNBQVMsQ0FBQ1UsR0FBVixHQUFnQixLQUFLSCxXQUFsQyxDQUFELElBQW1EVSxhQUE5RCxJQUErRUEsYUFBekY7QUFFQSxRQUFJWCxJQUFJLEdBQUdGLENBQUMsR0FBRyxDQUFKLEdBQVFBLENBQVIsR0FBWSxDQUF2QjtBQUNBLFFBQUlNLEdBQUcsR0FBR0YsQ0FBQyxHQUFHLENBQUosR0FBUUEsQ0FBUixHQUFZLENBQXRCO0FBRUEsVUFBTWEsSUFBSSxHQUFHLEtBQUtwQyxJQUFMLENBQVVnQixxQkFBVixFQUFiO0FBQ0EsVUFBTXFCLGNBQWMsR0FBR2hCLElBQUksR0FBR2UsSUFBSSxDQUFDRSxLQUFuQztBQUNBLFVBQU1DLGFBQWEsR0FBR2QsR0FBRyxHQUFHVyxJQUFJLENBQUNJLE1BQWpDOztBQUVBLFFBQUlILGNBQWMsR0FBR3RCLFNBQVMsQ0FBQ3VCLEtBQS9CLEVBQXNDO0FBQ2xDakIsVUFBSSxHQUFHYSxJQUFJLENBQUNDLEtBQUwsQ0FBVyxDQUFDcEIsU0FBUyxDQUFDdUIsS0FBVixHQUFrQkYsSUFBSSxDQUFDRSxLQUF4QixJQUFpQ1QsWUFBNUMsSUFBNERBLFlBQW5FO0FBQ0g7O0FBRUQsUUFBSVUsYUFBYSxHQUFHeEIsU0FBUyxDQUFDeUIsTUFBOUIsRUFBc0M7QUFDbENmLFNBQUcsR0FBR1MsSUFBSSxDQUFDQyxLQUFMLENBQVcsQ0FBQ3BCLFNBQVMsQ0FBQ3lCLE1BQVYsR0FBbUJKLElBQUksQ0FBQ0ksTUFBekIsSUFBbUNSLGFBQTlDLElBQStEQSxhQUFyRTtBQUNIOztBQUVELFVBQU16RCxJQUFJLEdBQUc2QixNQUFNLENBQUNDLE1BQVAsQ0FBYyxFQUFkLEVBQWtCLEtBQUtwRCxLQUFMLENBQVdzQixJQUE3QixFQUFtQztBQUM1QzRDLE9BQUMsRUFBRUUsSUFEeUM7QUFFNUNFLE9BQUMsRUFBRUU7QUFGeUMsS0FBbkMsQ0FBYjtBQUtBLFNBQUt0QixRQUFMLENBQWNDLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjLEVBQWQsRUFBa0IsS0FBS3BELEtBQXZCLEVBQThCO0FBQ3hDc0I7QUFEd0MsS0FBOUIsQ0FBZDtBQUlBLFdBQU9BLElBQVA7QUFDSDs7QUFFRGEsV0FBUyxDQUFDVyxDQUFELEVBQUk7QUFDVCxRQUFJLEtBQUtrQixRQUFULEVBQW1CO0FBQ2ZsQixPQUFDLENBQUNHLE1BQUYsQ0FBU1csS0FBVCxDQUFlQyxNQUFmLEdBQXdCLE1BQXhCO0FBQ0g7QUFDSjs7QUFFRDJCLFFBQU0sR0FBRztBQUNMLFVBQU07QUFBRS9ELDRCQUFGO0FBQTBCSCxVQUExQjtBQUFnQ1Q7QUFBaEMsUUFBd0MsS0FBS2IsS0FBbkQ7QUFFQSxXQUNJO0FBQ0ksZUFBUyxFQUFFeUIsc0JBRGY7QUFFSSxTQUFHLEVBQUVzQixJQUFJLElBQUksS0FBS0EsSUFBTCxHQUFZQSxJQUY3QjtBQUdJLGFBQU8sRUFBRSxLQUFLbkIsd0JBSGxCO0FBSUksZUFBUyxFQUFFLElBSmY7QUFLSSxpQkFBVyxFQUFFLEtBQUtJLGVBTHRCO0FBTUksWUFBTSxFQUFFLEtBQUtDLFVBTmpCO0FBT0ksZUFBUyxFQUFFLEtBQUtDLGFBUHBCO0FBUUksV0FBSyxFQUFFO0FBQ0hzQyxXQUFHLEVBQUVsRCxJQUFJLENBQUNnRCxDQURQO0FBRUhGLFlBQUksRUFBRTlDLElBQUksQ0FBQzRDLENBRlI7QUFHSG1CLGFBQUssRUFBRS9ELElBQUksQ0FBQytELEtBSFQ7QUFJSEUsY0FBTSxFQUFFakUsSUFBSSxDQUFDaUUsTUFKVjtBQUtIRSxjQUFNLEVBQUVuRSxJQUFJLENBQUNnQyxDQUFMLEdBQVM7QUFMZDtBQVJYLE9BZUt6QyxHQWZMLENBREo7QUFtQkg7O0FBOUxpQzs7QUFpTXRDLE1BQU02RSxJQUFJLEdBQUdDLDJEQUFPLENBQUM1RixlQUFELEVBQWtCRSxrQkFBbEIsQ0FBUCxDQUE2Q08sYUFBN0MsQ0FBYjtBQUNla0YsbUVBQWYsRTs7Ozs7Ozs7Ozs7QUNyTkEsMkJBQTJCLG1CQUFPLENBQUMsMkVBQStEO0FBQ2xHO0FBQ0EsY0FBYyxRQUFTLG9CQUFvQix1QkFBdUIsOEJBQThCLHlDQUF5QyxpQkFBaUIsaUJBQWlCLEVBQUUsNEhBQTRILGdCQUFnQixFQUFFLDJCQUEyQiwyQ0FBMkMsRUFBRSxTQUFTLDJMQUEyTCxZQUFZLGFBQWEsYUFBYSxXQUFXLGVBQWUsTUFBTSxlQUFlLE1BQU0seUVBQXlFLDJCQUEyQixrQ0FBa0MsNkNBQTZDLHFCQUFxQixxQkFBcUIsb0NBQW9DLHNCQUFzQixTQUFTLHFCQUFxQixpREFBaUQsU0FBUyxLQUFLLG1CQUFtQjs7Ozs7Ozs7Ozs7Ozs7QUNEemlDLGNBQWMsbUJBQU8sQ0FBQyw2SkFBa0o7O0FBRXhLLDRDQUE0QyxRQUFTOztBQUVyRDtBQUNBOzs7O0FBSUEsZUFBZTs7QUFFZjtBQUNBOztBQUVBLGFBQWEsbUJBQU8sQ0FBQywwRUFBK0Q7O0FBRXBGOztBQUVBLEdBQUcsS0FBVSxFQUFFLEUiLCJmaWxlIjoiYnVpbGQvNi5kNzVhYTcxZGQ4ZjdlYzk0NzdjNC5jaHVuay5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQgfSBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCc7XHJcbmltcG9ydCB7IHN0b3JlIH0gZnJvbSAnLi4vLi4vLi4vLi4vY29tbW9uL2NvbmZpZy9yZWR1eC9yZWR1eC5zdG9yZSc7XHJcbmltcG9ydCB7IHVwZGF0ZVByb2plY3QsIGdDbGlja2VkLCB1cGRhdGVQcm9qZWN0SXRlbXMgfSBmcm9tICcuLi8uLi9jb25maWcvcmVkdXgvcmVkdXguYWN0aW9ucyc7XHJcbmltcG9ydCB7IFByb2plY3RTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vLi4vY29tbW9uL3NlcnZpY2VzL3Byb2plY3Quc2VydmljZSc7XHJcblxyXG5pbXBvcnQgJy4uLy4uLy4uL2Fzc2V0cy9zdHlsZS9jb21wb25lbnRzL2l0ZW0vaXRlbS5zY3NzJztcclxuXHJcbmNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9IChzdGF0ZSkgPT4gc3RhdGU7XHJcbmNvbnN0IG1hcERpc3BhdGNoVG9Qcm9wcyA9IChkaXNwYXRjaCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB1cGRhdGVQcm9qZWN0OiBwYXlsb2FkID0+IGRpc3BhdGNoKHVwZGF0ZVByb2plY3QocGF5bG9hZCkpLFxyXG4gICAgICAgIGdDbGlja2VkOiBwYXlsb2FkID0+IGRpc3BhdGNoKGdDbGlja2VkKHBheWxvYWQpKSxcclxuICAgICAgICB1cGRhdGVQcm9qZWN0SXRlbXM6IHBheWxvYWQgPT4gZGlzcGF0Y2godXBkYXRlUHJvamVjdEl0ZW1zKHBheWxvYWQpKVxyXG4gICAgfTtcclxufTtcclxuXHJcbmNvbnN0IGRlZmF1bHRJdGVtQ29udGFpbmVyQ2xhc3NOYW1lID0gJ2l0ZW0tY29udGFpbmVyJztcclxuXHJcbmNsYXNzIEl0ZW1Db21wb25lbnQgZXh0ZW5kcyBDb21wb25lbnQge1xyXG4gICAgZHJhZ2dpbmcgPSBmYWxzZTtcclxuICAgIGRyYWdPZmZzZXRYID0gMDtcclxuICAgIGRyYWdPZmZzZXRZID0gMDtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuXHJcbiAgICAgICAgY29uc3QgVGFnTmFtZSA9IGAke3RoaXMucHJvcHMudGFnLm5hbWV9YDtcclxuICAgICAgICB2YXIgdGFnID0gbnVsbDtcclxuICAgICAgICBpZiAodGhpcy5wcm9wcy50YWcuaW5uZXJWYWx1ZSkge1xyXG4gICAgICAgICAgICB0YWcgPSAoPFRhZ05hbWU+e3RoaXMucHJvcHMudGFnLnZhbHVlfTwvVGFnTmFtZT4pXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGFnID0gKDxUYWdOYW1lIHZhbHVlPXt0aGlzLnByb3BzLnRhZy52YWx1ZX0+PC9UYWdOYW1lPilcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHsgd29ya3NwYWNlIH0gPSBzdG9yZS5nZXRTdGF0ZSgpLmVuZ2luZVJlZHVjZXI7XHJcbiAgICAgICAgY29uc3QgcHJvamVjdCA9IHdvcmtzcGFjZS5wcm9qZWN0O1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XHJcbiAgICAgICAgICAgIGluZm86IHByb2plY3QuaXRlbXNbdGhpcy5wcm9wcy51aWRdLFxyXG4gICAgICAgICAgICBpdGVtQ29udGFpbmVyQ2xhc3NOYW1lOiBkZWZhdWx0SXRlbUNvbnRhaW5lckNsYXNzTmFtZSxcclxuICAgICAgICAgICAgdGFnXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5wcm9qZWN0U2VydmljZSA9IG5ldyBQcm9qZWN0U2VydmljZSgpO1xyXG5cclxuICAgICAgICB0aGlzLmhhbmRsZUl0ZW1Db250YWluZXJDbGljayA9IHRoaXMuaGFuZGxlSXRlbUNvbnRhaW5lckNsaWNrLmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVPdXRzaWRlQ2xpY2sgPSB0aGlzLmhhbmRsZU91dHNpZGVDbGljay5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuZHJhZyA9IHRoaXMuZHJhZy5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlRHJhZ1N0YXJ0ID0gdGhpcy5oYW5kbGVEcmFnU3RhcnQuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLmhhbmRsZURyYWcgPSB0aGlzLmhhbmRsZURyYWcuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLmhhbmRsZURyYWdFbmQgPSB0aGlzLmhhbmRsZURyYWdFbmQuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLm1vdXNlbW92ZSA9IHRoaXMubW91c2Vtb3ZlLmJpbmQodGhpcyk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGNvbXBvbmVudFdpbGxNb3VudCgpIHtcclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLmhhbmRsZU91dHNpZGVDbGljaywgZmFsc2UpO1xyXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMubW91c2Vtb3ZlLCBmYWxzZSk7XHJcbiAgICB9XHJcblxyXG4gICAgY29tcG9uZW50RGlkTW91bnQoKSB7XHJcbiAgICAgICAgdGhpcy5kcmFnSW1nID0gbmV3IEltYWdlKDAsMCk7XHJcbiAgICAgICAgdGhpcy5kcmFnSW1nLnNyYyA9ICdkYXRhOmltYWdlL2dpZjtiYXNlNjQsUjBsR09EbGhBUUFCQUlBQUFBQUFBUC8vL3lINUJBRUFBQUFBTEFBQUFBQUJBQUVBQUFJQlJBQTcnO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xyXG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMuaGFuZGxlT3V0c2lkZUNsaWNrLCBmYWxzZSk7XHJcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5tb3VzZW1vdXZlLCBmYWxzZSk7XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlT3V0c2lkZUNsaWNrKGUpIHtcclxuICAgICAgICBpZiAodGhpcy5pdGVtLmNvbnRhaW5zKGUudGFyZ2V0KSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnNldFN0YXRlKE9iamVjdC5hc3NpZ24oe30sIHRoaXMuc3RhdGUsIHtcclxuICAgICAgICAgICAgaXRlbUNvbnRhaW5lckNsYXNzTmFtZTogZGVmYXVsdEl0ZW1Db250YWluZXJDbGFzc05hbWVcclxuICAgICAgICB9KSk7XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlSXRlbUNvbnRhaW5lckNsaWNrKCkge1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5zdGF0ZSwge1xyXG4gICAgICAgICAgICBpdGVtQ29udGFpbmVyQ2xhc3NOYW1lOiBkZWZhdWx0SXRlbUNvbnRhaW5lckNsYXNzTmFtZSArICcgZm9jdXMnXHJcbiAgICAgICAgfSkpO1xyXG5cclxuICAgICAgICBjb25zdCB7IHdvcmtzcGFjZSB9ID0gc3RvcmUuZ2V0U3RhdGUoKS5lbmdpbmVSZWR1Y2VyO1xyXG4gICAgICAgIHZhciBpdGVtcyA9IHdvcmtzcGFjZS5wcm9qZWN0Lml0ZW1zO1xyXG5cclxuICAgICAgICBjb25zdCBjdXJyZW50X3ogPSBpdGVtc1t0aGlzLnByb3BzLnVpZF0uejtcclxuICAgICAgICB2YXIgdG9wX3ogPSBjdXJyZW50X3o7XHJcbiAgICAgICAgZm9yICh2YXIga2V5IGluIGl0ZW1zKSB7XHJcbiAgICAgICAgICAgIGlmIChrZXkgIT09IHRoaXMucHJvcHMudWlkICYmIGl0ZW1zW2tleV0ueiA+IGN1cnJlbnRfeikge1xyXG4gICAgICAgICAgICAgICAgaWYgKGl0ZW1zW2tleV0ueiA+IHRvcF96KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdG9wX3ogPSBpdGVtc1trZXldLno7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpdGVtc1trZXldLnogLT0gMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpdGVtc1t0aGlzLnByb3BzLnVpZF0ueiA9IHRvcF96O1xyXG5cclxuICAgICAgICB0aGlzLnByb3BzLnVwZGF0ZVByb2plY3RJdGVtcyhpdGVtcyk7XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlRHJhZ1N0YXJ0KGUpIHtcclxuICAgICAgICB0aGlzLmhhbmRsZUl0ZW1Db250YWluZXJDbGljaygpO1xyXG5cclxuICAgICAgICB0aGlzLnByb3BzLmdDbGlja2VkKHtcclxuICAgICAgICAgICAgZ0NsYXNzTGlzdDogJ2dpZCBoaWRkZW4nXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGUuZGF0YVRyYW5zZmVyLnNldERyYWdJbWFnZSh0aGlzLmRyYWdJbWcsIDAsIDApO1xyXG4gICAgICAgIGUudGFyZ2V0LnN0eWxlLmN1cnNvciA9ICdtb3ZlJztcclxuXHJcbiAgICAgICAgY29uc3QgeyB3b3Jrc3BhY2UgfSA9IHN0b3JlLmdldFN0YXRlKCkuZW5naW5lUmVkdWNlcjtcclxuICAgICAgICBjb25zdCBjb250YWluZXIgPSB3b3Jrc3BhY2UucHJvamVjdC5jb250YWluZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICAgICAgY29uc3QgaXRlbSA9IHdvcmtzcGFjZS5wcm9qZWN0Lml0ZW1zW3RoaXMucHJvcHMudWlkXTtcclxuXHJcbiAgICAgICAgdGhpcy5kcmFnZ2luZyA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5kcmFnT2Zmc2V0WCA9IGl0ZW0ueCAtIChlLmNsaWVudFggLSBjb250YWluZXIubGVmdCk7XHJcbiAgICAgICAgdGhpcy5kcmFnT2Zmc2V0WSA9IGl0ZW0ueSAtIChlLmNsaWVudFkgLSBjb250YWluZXIudG9wKTtcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVEcmFnKGUpIHtcclxuICAgICAgICB0aGlzLmRyYWcoZSk7XHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgaGFuZGxlRHJhZ0VuZChlKSB7XHJcbiAgICAgICAgdmFyIGluZm8gPSB0aGlzLmRyYWcoZSk7XHJcblxyXG4gICAgICAgIHRoaXMuZHJhZ2dpbmcgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgdGhpcy5wcm9wcy5nQ2xpY2tlZCh7XHJcbiAgICAgICAgICAgIGdDbGFzc0xpc3Q6ICdnaWQnXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMucHJvcHMudXBkYXRlUHJvamVjdCh7XHJcbiAgICAgICAgICAgIHBhdGg6IHRoaXMucHJvcHMudWlkLFxyXG4gICAgICAgICAgICB2YWx1ZTogaW5mb1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjb25zdCB7IHdvcmtzcGFjZSB9ID0gc3RvcmUuZ2V0U3RhdGUoKS5lbmdpbmVSZWR1Y2VyO1xyXG4gICAgICAgIGF3YWl0IHRoaXMucHJvamVjdFNlcnZpY2UucHV0KHdvcmtzcGFjZS5pZCwgd29ya3NwYWNlLnByb2plY3QuaWQsIHdvcmtzcGFjZS5wcm9qZWN0KTtcclxuICAgIH1cclxuXHJcbiAgICBkcmFnKGUpIHtcclxuICAgICAgICBjb25zdCB7IHdvcmtzcGFjZSB9ID0gc3RvcmUuZ2V0U3RhdGUoKS5lbmdpbmVSZWR1Y2VyO1xyXG4gICAgICAgIGNvbnN0IGNvbnRhaW5lciA9IHdvcmtzcGFjZS5wcm9qZWN0LmNvbnRhaW5lci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgICAgICBjb25zdCBkZWZhdWx0V2lkdGggPSB3b3Jrc3BhY2UucHJvamVjdC5jb25maWcuY2VsbFdpZHRoO1xyXG4gICAgICAgIGNvbnN0IGRlZmF1bHRIZWlnaHQgPSB3b3Jrc3BhY2UucHJvamVjdC5jb25maWcuY2VsbEhlaWdodDtcclxuXHJcbiAgICAgICAgY29uc3QgeCA9IE1hdGguZmxvb3IoKGUuY2xpZW50WCAtIChjb250YWluZXIubGVmdCAtIHRoaXMuZHJhZ09mZnNldFgpKSAvIGRlZmF1bHRXaWR0aCkgKiBkZWZhdWx0V2lkdGg7XHJcbiAgICAgICAgY29uc3QgeSA9IE1hdGguZmxvb3IoKGUuY2xpZW50WSAtIChjb250YWluZXIudG9wIC0gdGhpcy5kcmFnT2Zmc2V0WSkpIC8gZGVmYXVsdEhlaWdodCkgKiBkZWZhdWx0SGVpZ2h0O1xyXG4gICAgICAgIFxyXG4gICAgICAgIHZhciBsZWZ0ID0geCA+IDAgPyB4IDogMDtcclxuICAgICAgICB2YXIgdG9wID0geSA+IDAgPyB5IDogMDtcclxuXHJcbiAgICAgICAgY29uc3QgcmVjdCA9IHRoaXMuaXRlbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgICAgICBjb25zdCBpdGVtT2Zmc2V0TGVmdCA9IGxlZnQgKyByZWN0LndpZHRoO1xyXG4gICAgICAgIGNvbnN0IGl0ZW1PZmZzZXRUb3AgPSB0b3AgKyByZWN0LmhlaWdodDtcclxuXHJcbiAgICAgICAgaWYgKGl0ZW1PZmZzZXRMZWZ0ID4gY29udGFpbmVyLndpZHRoKSB7XHJcbiAgICAgICAgICAgIGxlZnQgPSBNYXRoLmZsb29yKChjb250YWluZXIud2lkdGggLSByZWN0LndpZHRoKSAvIGRlZmF1bHRXaWR0aCkgKiBkZWZhdWx0V2lkdGg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoaXRlbU9mZnNldFRvcCA+IGNvbnRhaW5lci5oZWlnaHQpIHtcclxuICAgICAgICAgICAgdG9wID0gTWF0aC5mbG9vcigoY29udGFpbmVyLmhlaWdodCAtIHJlY3QuaGVpZ2h0KSAvIGRlZmF1bHRIZWlnaHQpICogZGVmYXVsdEhlaWdodDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGluZm8gPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLnN0YXRlLmluZm8sIHtcclxuICAgICAgICAgICAgeDogbGVmdCxcclxuICAgICAgICAgICAgeTogdG9wXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5zdGF0ZSwge1xyXG4gICAgICAgICAgICBpbmZvXHJcbiAgICAgICAgfSkpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiBpbmZvO1xyXG4gICAgfVxyXG5cclxuICAgIG1vdXNlbW92ZShlKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZHJhZ2dpbmcpIHtcclxuICAgICAgICAgICAgZS50YXJnZXQuc3R5bGUuY3Vyc29yID0gJ21vdmUnO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyBpdGVtQ29udGFpbmVyQ2xhc3NOYW1lLCBpbmZvLCB0YWcgfSA9IHRoaXMuc3RhdGU7XHJcblxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXYgXHJcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2l0ZW1Db250YWluZXJDbGFzc05hbWV9XHJcbiAgICAgICAgICAgICAgICByZWY9e2l0ZW0gPT4gdGhpcy5pdGVtID0gaXRlbX1cclxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuaGFuZGxlSXRlbUNvbnRhaW5lckNsaWNrfVxyXG4gICAgICAgICAgICAgICAgZHJhZ2dhYmxlPXt0cnVlfVxyXG4gICAgICAgICAgICAgICAgb25EcmFnU3RhcnQ9e3RoaXMuaGFuZGxlRHJhZ1N0YXJ0fVxyXG4gICAgICAgICAgICAgICAgb25EcmFnPXt0aGlzLmhhbmRsZURyYWd9XHJcbiAgICAgICAgICAgICAgICBvbkRyYWdFbmQ9e3RoaXMuaGFuZGxlRHJhZ0VuZH1cclxuICAgICAgICAgICAgICAgIHN0eWxlPXt7IFxyXG4gICAgICAgICAgICAgICAgICAgIHRvcDogaW5mby55LCBcclxuICAgICAgICAgICAgICAgICAgICBsZWZ0OiBpbmZvLngsXHJcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IGluZm8ud2lkdGgsXHJcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiBpbmZvLmhlaWdodCxcclxuICAgICAgICAgICAgICAgICAgICB6SW5kZXg6IGluZm8ueiArIDEwMFxyXG4gICAgICAgICAgICAgICAgfX0+XHJcbiAgICAgICAgICAgICAgICB7dGFnfVxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBJdGVtID0gY29ubmVjdChtYXBTdGF0ZVRvUHJvcHMsIG1hcERpc3BhdGNoVG9Qcm9wcykoSXRlbUNvbXBvbmVudCk7XHJcbmV4cG9ydCBkZWZhdWx0IEl0ZW07IiwiZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIikodHJ1ZSk7XG4vLyBNb2R1bGVcbmV4cG9ydHMucHVzaChbbW9kdWxlLmlkLCBcIi5pdGVtLWNvbnRhaW5lciB7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICBib3JkZXI6IDFweCBzb2xpZCAjNzg3ODc4O1xcbiAgYmFja2dyb3VuZDogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjkpO1xcbiAgcGFkZGluZzogNHB4O1xcbiAgY3Vyc29yOiBtb3ZlOyB9XFxuICAuaXRlbS1jb250YWluZXIgaDEsIC5pdGVtLWNvbnRhaW5lciBoMiwgLml0ZW0tY29udGFpbmVyIGgzLCAuaXRlbS1jb250YWluZXIgaDQsIC5pdGVtLWNvbnRhaW5lciBoNSwgLml0ZW0tY29udGFpbmVyIGg2IHtcXG4gICAgbWFyZ2luOiAwOyB9XFxuICAuaXRlbS1jb250YWluZXIuZm9jdXMge1xcbiAgICBiYWNrZ3JvdW5kOiByZ2JhKDI0MCwgMjQwLCAyNDAsIDAuOSk7IH1cXG5cIiwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJDOi9Vc2Vycy9nYXJyaS9zb3VyY2UvcmVwb3Mvc25hcGZvcm0vY2xpZW50L2VuZ2luZS9hc3NldHMvc3R5bGUvY29tcG9uZW50cy9pdGVtL2NsaWVudC9lbmdpbmUvYXNzZXRzL3N0eWxlL2NvbXBvbmVudHMvaXRlbS9pdGVtLnNjc3NcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBQUE7RUFDSSxrQkFBa0I7RUFDbEIseUJBQXlCO0VBQ3pCLG9DQUFvQztFQUNwQyxZQUFZO0VBQ1osWUFBWSxFQUFBO0VBTGhCO0lBUVEsU0FBUyxFQUFBO0VBUmpCO0lBWVEsb0NBQW9DLEVBQUFcIixcImZpbGVcIjpcIml0ZW0uc2Nzc1wiLFwic291cmNlc0NvbnRlbnRcIjpbXCIuaXRlbS1jb250YWluZXIge1xcclxcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XFxyXFxuICAgIGJvcmRlcjogMXB4IHNvbGlkICM3ODc4Nzg7XFxyXFxuICAgIGJhY2tncm91bmQ6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC45KTtcXHJcXG4gICAgcGFkZGluZzogNHB4O1xcclxcbiAgICBjdXJzb3I6IG1vdmU7XFxyXFxuXFxyXFxuICAgIGgxLCBoMiwgaDMsIGg0LCBoNSwgaDYge1xcclxcbiAgICAgICAgbWFyZ2luOiAwO1xcclxcbiAgICB9XFxyXFxuXFxyXFxuICAgICYuZm9jdXMge1xcclxcbiAgICAgICAgYmFja2dyb3VuZDogcmdiYSgyNDAsIDI0MCwgMjQwLCAwLjkpO1xcclxcbiAgICB9XFxyXFxufVwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuXG4iLCJcbnZhciBjb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanM/P3JlZi0tNi0xIS4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9saWIvbG9hZGVyLmpzPz9yZWYtLTYtMiEuL2l0ZW0uc2Nzc1wiKTtcblxuaWYodHlwZW9mIGNvbnRlbnQgPT09ICdzdHJpbmcnKSBjb250ZW50ID0gW1ttb2R1bGUuaWQsIGNvbnRlbnQsICcnXV07XG5cbnZhciB0cmFuc2Zvcm07XG52YXIgaW5zZXJ0SW50bztcblxuXG5cbnZhciBvcHRpb25zID0ge1wiaG1yXCI6dHJ1ZX1cblxub3B0aW9ucy50cmFuc2Zvcm0gPSB0cmFuc2Zvcm1cbm9wdGlvbnMuaW5zZXJ0SW50byA9IHVuZGVmaW5lZDtcblxudmFyIHVwZGF0ZSA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9saWIvYWRkU3R5bGVzLmpzXCIpKGNvbnRlbnQsIG9wdGlvbnMpO1xuXG5pZihjb250ZW50LmxvY2FscykgbW9kdWxlLmV4cG9ydHMgPSBjb250ZW50LmxvY2FscztcblxuaWYobW9kdWxlLmhvdCkge1xuXHRtb2R1bGUuaG90LmFjY2VwdChcIiEhLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanM/P3JlZi0tNi0xIS4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9saWIvbG9hZGVyLmpzPz9yZWYtLTYtMiEuL2l0ZW0uc2Nzc1wiLCBmdW5jdGlvbigpIHtcblx0XHR2YXIgbmV3Q29udGVudCA9IHJlcXVpcmUoXCIhIS4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzPz9yZWYtLTYtMSEuLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvbGliL2xvYWRlci5qcz8/cmVmLS02LTIhLi9pdGVtLnNjc3NcIik7XG5cblx0XHRpZih0eXBlb2YgbmV3Q29udGVudCA9PT0gJ3N0cmluZycpIG5ld0NvbnRlbnQgPSBbW21vZHVsZS5pZCwgbmV3Q29udGVudCwgJyddXTtcblxuXHRcdHZhciBsb2NhbHMgPSAoZnVuY3Rpb24oYSwgYikge1xuXHRcdFx0dmFyIGtleSwgaWR4ID0gMDtcblxuXHRcdFx0Zm9yKGtleSBpbiBhKSB7XG5cdFx0XHRcdGlmKCFiIHx8IGFba2V5XSAhPT0gYltrZXldKSByZXR1cm4gZmFsc2U7XG5cdFx0XHRcdGlkeCsrO1xuXHRcdFx0fVxuXG5cdFx0XHRmb3Ioa2V5IGluIGIpIGlkeC0tO1xuXG5cdFx0XHRyZXR1cm4gaWR4ID09PSAwO1xuXHRcdH0oY29udGVudC5sb2NhbHMsIG5ld0NvbnRlbnQubG9jYWxzKSk7XG5cblx0XHRpZighbG9jYWxzKSB0aHJvdyBuZXcgRXJyb3IoJ0Fib3J0aW5nIENTUyBITVIgZHVlIHRvIGNoYW5nZWQgY3NzLW1vZHVsZXMgbG9jYWxzLicpO1xuXG5cdFx0dXBkYXRlKG5ld0NvbnRlbnQpO1xuXHR9KTtcblxuXHRtb2R1bGUuaG90LmRpc3Bvc2UoZnVuY3Rpb24oKSB7IHVwZGF0ZSgpOyB9KTtcbn0iXSwic291cmNlUm9vdCI6IiJ9