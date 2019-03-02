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
/* harmony import */ var _assets_style_components_item_item_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../assets/style/components/item/item.scss */ "tFBN");
/* harmony import */ var _assets_style_components_item_item_scss__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_assets_style_components_item_item_scss__WEBPACK_IMPORTED_MODULE_4__);
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }




 //import { SaveService } from '../../shared/services/save.service';



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

    const {
      workspace
    } = _common_config_redux_redux_store__WEBPACK_IMPORTED_MODULE_2__["store"].getState().engineReducer;
    const project = workspace.project;
    this.state = {
      info: project.items[this.props.uid],
      itemContainerClassName: defaultItemContainerClassName
    }; //this.saveService = new SaveService();

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
    this.drag(e);
    this.props.gClicked({
      gClassList: 'gid'
    });
    this.dragging = false;
    const {
      workspace
    } = _common_config_redux_redux_store__WEBPACK_IMPORTED_MODULE_2__["store"].getState().engineReducer; //this.saveService.saveProject('1', '1', workspace.project);
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
    this.props.updateProject({
      path: this.props.uid,
      value: info
    });
    this.setState(Object.assign({}, this.state, {
      info
    }));
  }

  mousemove(e) {
    if (this.dragging) {
      e.target.style.cursor = 'move';
    }
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
      draggable: true,
      onDragStart: this.handleDragStart,
      onDrag: this.handleDrag,
      onDragEnd: this.handleDragEnd,
      style: {
        top: this.props.y,
        left: this.props.x,
        width: this.props.width,
        height: this.props.height,
        zIndex: this.props.z + 100
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9jbGllbnQvZW5naW5lL3NyYy9jb21wb25lbnRzL2l0ZW0vaXRlbS5jb21wb25lbnQuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L2VuZ2luZS9hc3NldHMvc3R5bGUvY29tcG9uZW50cy9pdGVtL2l0ZW0uc2NzcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvZW5naW5lL2Fzc2V0cy9zdHlsZS9jb21wb25lbnRzL2l0ZW0vaXRlbS5zY3NzPzgyMjkiXSwibmFtZXMiOlsibWFwU3RhdGVUb1Byb3BzIiwic3RhdGUiLCJtYXBEaXNwYXRjaFRvUHJvcHMiLCJkaXNwYXRjaCIsInVwZGF0ZVByb2plY3QiLCJwYXlsb2FkIiwiZ0NsaWNrZWQiLCJ1cGRhdGVQcm9qZWN0SXRlbXMiLCJkZWZhdWx0SXRlbUNvbnRhaW5lckNsYXNzTmFtZSIsIkl0ZW1Db21wb25lbnQiLCJDb21wb25lbnQiLCJjb25zdHJ1Y3RvciIsInByb3BzIiwid29ya3NwYWNlIiwic3RvcmUiLCJnZXRTdGF0ZSIsImVuZ2luZVJlZHVjZXIiLCJwcm9qZWN0IiwiaW5mbyIsIml0ZW1zIiwidWlkIiwiaXRlbUNvbnRhaW5lckNsYXNzTmFtZSIsImhhbmRsZUl0ZW1Db250YWluZXJDbGljayIsImJpbmQiLCJoYW5kbGVPdXRzaWRlQ2xpY2siLCJkcmFnIiwiaGFuZGxlRHJhZ1N0YXJ0IiwiaGFuZGxlRHJhZyIsImhhbmRsZURyYWdFbmQiLCJtb3VzZW1vdmUiLCJjb21wb25lbnRXaWxsTW91bnQiLCJkb2N1bWVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJjb21wb25lbnREaWRNb3VudCIsImRyYWdJbWciLCJJbWFnZSIsInNyYyIsImNvbXBvbmVudFdpbGxVbm1vdW50IiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsIm1vdXNlbW91dmUiLCJlIiwiaXRlbSIsImNvbnRhaW5zIiwidGFyZ2V0Iiwic2V0U3RhdGUiLCJPYmplY3QiLCJhc3NpZ24iLCJjdXJyZW50X3oiLCJ6IiwidG9wX3oiLCJrZXkiLCJnQ2xhc3NMaXN0IiwiZGF0YVRyYW5zZmVyIiwic2V0RHJhZ0ltYWdlIiwic3R5bGUiLCJjdXJzb3IiLCJjb250YWluZXIiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJkcmFnZ2luZyIsImRyYWdPZmZzZXRYIiwieCIsImNsaWVudFgiLCJsZWZ0IiwiZHJhZ09mZnNldFkiLCJ5IiwiY2xpZW50WSIsInRvcCIsImRlZmF1bHRXaWR0aCIsImNvbmZpZyIsImNlbGxXaWR0aCIsImRlZmF1bHRIZWlnaHQiLCJjZWxsSGVpZ2h0IiwiTWF0aCIsImZsb29yIiwicmVjdCIsIml0ZW1PZmZzZXRMZWZ0Iiwid2lkdGgiLCJpdGVtT2Zmc2V0VG9wIiwiaGVpZ2h0IiwicGF0aCIsInZhbHVlIiwicmVuZGVyIiwiVGFnTmFtZSIsInRhZyIsIm5hbWUiLCJpbm5lclZhbHVlIiwiekluZGV4IiwiSXRlbSIsImNvbm5lY3QiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0NBRUE7O0FBRUE7O0FBRUEsTUFBTUEsZUFBZSxHQUFJQyxLQUFELElBQVdBLEtBQW5DOztBQUNBLE1BQU1DLGtCQUFrQixHQUFJQyxRQUFELElBQWM7QUFDckMsU0FBTztBQUNIQyxpQkFBYSxFQUFFQyxPQUFPLElBQUlGLFFBQVEsQ0FBQ0MsaUZBQWEsQ0FBQ0MsT0FBRCxDQUFkLENBRC9CO0FBRUhDLFlBQVEsRUFBRUQsT0FBTyxJQUFJRixRQUFRLENBQUNHLDRFQUFRLENBQUNELE9BQUQsQ0FBVCxDQUYxQjtBQUdIRSxzQkFBa0IsRUFBRUYsT0FBTyxJQUFJRixRQUFRLENBQUNJLHNGQUFrQixDQUFDRixPQUFELENBQW5CO0FBSHBDLEdBQVA7QUFLSCxDQU5EOztBQVFBLE1BQU1HLDZCQUE2QixHQUFHLGdCQUF0Qzs7QUFFQSxNQUFNQyxhQUFOLFNBQTRCQywrQ0FBNUIsQ0FBc0M7QUFLbENDLGFBQVcsQ0FBQ0MsS0FBRCxFQUFRO0FBQ2YsVUFBTUEsS0FBTjs7QUFEZSxzQ0FKUixLQUlR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V0FBSyxFQUFFO0FBQ0hzQyxXQUFHLEVBQUUsS0FBS3RELEtBQUwsQ0FBV29ELENBRGI7QUFFSEYsWUFBSSxFQUFFLEtBQUtsRCxLQUFMLENBQVdnRCxDQUZkO0FBR0hnQixhQUFLLEVBQUUsS0FBS2hFLEtBQUwsQ0FBV2dFLEtBSGY7QUFJSEUsY0FBTSxFQUFFLEtBQUtsRSxLQUFMLENBQVdrRSxNQUpoQjtBQUtIUSxjQUFNLEVBQUUsS0FBSzFFLEtBQUwsQ0FBV29DLENBQVgsR0FBZTtBQUxwQjtBQVBYLE9BZUttQyxHQWZMLENBREo7QUFtQkg7O0FBMUxpQzs7QUE2THRDLE1BQU1JLElBQUksR0FBR0MsMkRBQU8sQ0FBQ3hGLGVBQUQsRUFBa0JFLGtCQUFsQixDQUFQLENBQTZDTyxhQUE3QyxDQUFiO0FBQ2U4RSxtRUFBZixFOzs7Ozs7Ozs7OztBQ2pOQSwyQkFBMkIsbUJBQU8sQ0FBQywyRUFBK0Q7QUFDbEc7QUFDQSxjQUFjLFFBQVMsb0JBQW9CLHVCQUF1Qiw4QkFBOEIseUNBQXlDLGlCQUFpQixpQkFBaUIsRUFBRSw0SEFBNEgsZ0JBQWdCLEVBQUUsMkJBQTJCLDJDQUEyQyxFQUFFLFNBQVMsMkxBQTJMLFlBQVksYUFBYSxhQUFhLFdBQVcsZUFBZSxNQUFNLGVBQWUsTUFBTSx5RUFBeUUsMkJBQTJCLGtDQUFrQyw2Q0FBNkMscUJBQXFCLHFCQUFxQixvQ0FBb0Msc0JBQXNCLFNBQVMscUJBQXFCLGlEQUFpRCxTQUFTLEtBQUssbUJBQW1COzs7Ozs7Ozs7Ozs7OztBQ0R6aUMsY0FBYyxtQkFBTyxDQUFDLDZKQUFrSjs7QUFFeEssNENBQTRDLFFBQVM7O0FBRXJEO0FBQ0E7Ozs7QUFJQSxlQUFlOztBQUVmO0FBQ0E7O0FBRUEsYUFBYSxtQkFBTyxDQUFDLDBFQUErRDs7QUFFcEY7O0FBRUEsR0FBRyxLQUFVLEVBQUUsRSIsImZpbGUiOiJidWlsZC81LjI2NWJjMjNkMDljNzM3NzcxNTEyLmNodW5rLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IENvbXBvbmVudCB9IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gJ3JlYWN0LXJlZHV4JztcclxuaW1wb3J0IHsgc3RvcmUgfSBmcm9tICcuLi8uLi8uLi8uLi9jb21tb24vY29uZmlnL3JlZHV4L3JlZHV4LnN0b3JlJztcclxuaW1wb3J0IHsgdXBkYXRlUHJvamVjdCwgZ0NsaWNrZWQsIHVwZGF0ZVByb2plY3RJdGVtcyB9IGZyb20gJy4uLy4uL2NvbmZpZy9yZWR1eC9yZWR1eC5hY3Rpb25zJztcclxuLy9pbXBvcnQgeyBTYXZlU2VydmljZSB9IGZyb20gJy4uLy4uL3NoYXJlZC9zZXJ2aWNlcy9zYXZlLnNlcnZpY2UnO1xyXG5cclxuaW1wb3J0ICcuLi8uLi8uLi9hc3NldHMvc3R5bGUvY29tcG9uZW50cy9pdGVtL2l0ZW0uc2Nzcyc7XHJcblxyXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSAoc3RhdGUpID0+IHN0YXRlO1xyXG5jb25zdCBtYXBEaXNwYXRjaFRvUHJvcHMgPSAoZGlzcGF0Y2gpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdXBkYXRlUHJvamVjdDogcGF5bG9hZCA9PiBkaXNwYXRjaCh1cGRhdGVQcm9qZWN0KHBheWxvYWQpKSxcclxuICAgICAgICBnQ2xpY2tlZDogcGF5bG9hZCA9PiBkaXNwYXRjaChnQ2xpY2tlZChwYXlsb2FkKSksXHJcbiAgICAgICAgdXBkYXRlUHJvamVjdEl0ZW1zOiBwYXlsb2FkID0+IGRpc3BhdGNoKHVwZGF0ZVByb2plY3RJdGVtcyhwYXlsb2FkKSlcclxuICAgIH07XHJcbn07XHJcblxyXG5jb25zdCBkZWZhdWx0SXRlbUNvbnRhaW5lckNsYXNzTmFtZSA9ICdpdGVtLWNvbnRhaW5lcic7XHJcblxyXG5jbGFzcyBJdGVtQ29tcG9uZW50IGV4dGVuZHMgQ29tcG9uZW50IHtcclxuICAgIGRyYWdnaW5nID0gZmFsc2U7XHJcbiAgICBkcmFnT2Zmc2V0WCA9IDA7XHJcbiAgICBkcmFnT2Zmc2V0WSA9IDA7XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcblxyXG4gICAgICAgIGNvbnN0IHsgd29ya3NwYWNlIH0gPSBzdG9yZS5nZXRTdGF0ZSgpLmVuZ2luZVJlZHVjZXI7XHJcbiAgICAgICAgY29uc3QgcHJvamVjdCA9IHdvcmtzcGFjZS5wcm9qZWN0O1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XHJcbiAgICAgICAgICAgIGluZm86IHByb2plY3QuaXRlbXNbdGhpcy5wcm9wcy51aWRdLFxyXG4gICAgICAgICAgICBpdGVtQ29udGFpbmVyQ2xhc3NOYW1lOiBkZWZhdWx0SXRlbUNvbnRhaW5lckNsYXNzTmFtZVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vdGhpcy5zYXZlU2VydmljZSA9IG5ldyBTYXZlU2VydmljZSgpO1xyXG5cclxuICAgICAgICB0aGlzLmhhbmRsZUl0ZW1Db250YWluZXJDbGljayA9IHRoaXMuaGFuZGxlSXRlbUNvbnRhaW5lckNsaWNrLmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVPdXRzaWRlQ2xpY2sgPSB0aGlzLmhhbmRsZU91dHNpZGVDbGljay5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuZHJhZyA9IHRoaXMuZHJhZy5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlRHJhZ1N0YXJ0ID0gdGhpcy5oYW5kbGVEcmFnU3RhcnQuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLmhhbmRsZURyYWcgPSB0aGlzLmhhbmRsZURyYWcuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLmhhbmRsZURyYWdFbmQgPSB0aGlzLmhhbmRsZURyYWdFbmQuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLm1vdXNlbW92ZSA9IHRoaXMubW91c2Vtb3ZlLmJpbmQodGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgY29tcG9uZW50V2lsbE1vdW50KCkge1xyXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMuaGFuZGxlT3V0c2lkZUNsaWNrLCBmYWxzZSk7XHJcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5tb3VzZW1vdmUsIGZhbHNlKTtcclxuICAgIH1cclxuXHJcbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcclxuICAgICAgICB0aGlzLmRyYWdJbWcgPSBuZXcgSW1hZ2UoMCwwKTtcclxuICAgICAgICB0aGlzLmRyYWdJbWcuc3JjID0gJ2RhdGE6aW1hZ2UvZ2lmO2Jhc2U2NCxSMGxHT0RsaEFRQUJBSUFBQUFBQUFQLy8veUg1QkFFQUFBQUFMQUFBQUFBQkFBRUFBQUlCUkFBNyc7XHJcbiAgICB9XHJcblxyXG4gICAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XHJcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgdGhpcy5oYW5kbGVPdXRzaWRlQ2xpY2ssIGZhbHNlKTtcclxuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLm1vdXNlbW91dmUsIGZhbHNlKTtcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVPdXRzaWRlQ2xpY2soZSkge1xyXG4gICAgICAgIGlmICh0aGlzLml0ZW0uY29udGFpbnMoZS50YXJnZXQpKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5zdGF0ZSwge1xyXG4gICAgICAgICAgICBpdGVtQ29udGFpbmVyQ2xhc3NOYW1lOiBkZWZhdWx0SXRlbUNvbnRhaW5lckNsYXNzTmFtZVxyXG4gICAgICAgIH0pKTtcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVJdGVtQ29udGFpbmVyQ2xpY2soKSB7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZShPYmplY3QuYXNzaWduKHt9LCB0aGlzLnN0YXRlLCB7XHJcbiAgICAgICAgICAgIGl0ZW1Db250YWluZXJDbGFzc05hbWU6IGRlZmF1bHRJdGVtQ29udGFpbmVyQ2xhc3NOYW1lICsgJyBmb2N1cydcclxuICAgICAgICB9KSk7XHJcblxyXG4gICAgICAgIGNvbnN0IHsgd29ya3NwYWNlIH0gPSBzdG9yZS5nZXRTdGF0ZSgpLmVuZ2luZVJlZHVjZXI7XHJcbiAgICAgICAgdmFyIGl0ZW1zID0gd29ya3NwYWNlLnByb2plY3QuaXRlbXM7XHJcblxyXG4gICAgICAgIGNvbnN0IGN1cnJlbnRfeiA9IGl0ZW1zW3RoaXMucHJvcHMudWlkXS56O1xyXG4gICAgICAgIHZhciB0b3BfeiA9IGN1cnJlbnRfejtcclxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gaXRlbXMpIHtcclxuICAgICAgICAgICAgaWYgKGtleSAhPT0gdGhpcy5wcm9wcy51aWQgJiYgaXRlbXNba2V5XS56ID4gY3VycmVudF96KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXRlbXNba2V5XS56ID4gdG9wX3opIHtcclxuICAgICAgICAgICAgICAgICAgICB0b3BfeiA9IGl0ZW1zW2tleV0uejtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGl0ZW1zW2tleV0ueiAtPSAxO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGl0ZW1zW3RoaXMucHJvcHMudWlkXS56ID0gdG9wX3o7XHJcblxyXG4gICAgICAgIHRoaXMucHJvcHMudXBkYXRlUHJvamVjdEl0ZW1zKGl0ZW1zKTtcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVEcmFnU3RhcnQoZSkge1xyXG4gICAgICAgIHRoaXMuaGFuZGxlSXRlbUNvbnRhaW5lckNsaWNrKCk7XHJcblxyXG4gICAgICAgIHRoaXMucHJvcHMuZ0NsaWNrZWQoe1xyXG4gICAgICAgICAgICBnQ2xhc3NMaXN0OiAnZ2lkIGhpZGRlbidcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZS5kYXRhVHJhbnNmZXIuc2V0RHJhZ0ltYWdlKHRoaXMuZHJhZ0ltZywgMCwgMCk7XHJcbiAgICAgICAgZS50YXJnZXQuc3R5bGUuY3Vyc29yID0gJ21vdmUnO1xyXG5cclxuICAgICAgICBjb25zdCB7IHdvcmtzcGFjZSB9ID0gc3RvcmUuZ2V0U3RhdGUoKS5lbmdpbmVSZWR1Y2VyO1xyXG4gICAgICAgIGNvbnN0IGNvbnRhaW5lciA9IHdvcmtzcGFjZS5wcm9qZWN0LmNvbnRhaW5lci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgICAgICBjb25zdCBpdGVtID0gd29ya3NwYWNlLnByb2plY3QuaXRlbXNbdGhpcy5wcm9wcy51aWRdO1xyXG5cclxuICAgICAgICB0aGlzLmRyYWdnaW5nID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLmRyYWdPZmZzZXRYID0gaXRlbS54IC0gKGUuY2xpZW50WCAtIGNvbnRhaW5lci5sZWZ0KTtcclxuICAgICAgICB0aGlzLmRyYWdPZmZzZXRZID0gaXRlbS55IC0gKGUuY2xpZW50WSAtIGNvbnRhaW5lci50b3ApO1xyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZURyYWcoZSkge1xyXG4gICAgICAgIHRoaXMuZHJhZyhlKTtcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVEcmFnRW5kKGUpIHtcclxuICAgICAgICB0aGlzLmRyYWcoZSk7XHJcblxyXG4gICAgICAgIHRoaXMucHJvcHMuZ0NsaWNrZWQoe1xyXG4gICAgICAgICAgICBnQ2xhc3NMaXN0OiAnZ2lkJ1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmRyYWdnaW5nID0gZmFsc2U7XHJcblxyXG4gICAgICAgIGNvbnN0IHsgd29ya3NwYWNlIH0gPSBzdG9yZS5nZXRTdGF0ZSgpLmVuZ2luZVJlZHVjZXI7XHJcbiAgICAgICAgLy90aGlzLnNhdmVTZXJ2aWNlLnNhdmVQcm9qZWN0KCcxJywgJzEnLCB3b3Jrc3BhY2UucHJvamVjdCk7XHJcbiAgICB9XHJcblxyXG4gICAgZHJhZyhlKSB7XHJcbiAgICAgICAgY29uc3QgeyB3b3Jrc3BhY2UgfSA9IHN0b3JlLmdldFN0YXRlKCkuZW5naW5lUmVkdWNlcjtcclxuICAgICAgICBjb25zdCBjb250YWluZXIgPSB3b3Jrc3BhY2UucHJvamVjdC5jb250YWluZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICAgICAgY29uc3QgZGVmYXVsdFdpZHRoID0gd29ya3NwYWNlLnByb2plY3QuY29uZmlnLmNlbGxXaWR0aDtcclxuICAgICAgICBjb25zdCBkZWZhdWx0SGVpZ2h0ID0gd29ya3NwYWNlLnByb2plY3QuY29uZmlnLmNlbGxIZWlnaHQ7XHJcblxyXG4gICAgICAgIGNvbnN0IHggPSBNYXRoLmZsb29yKChlLmNsaWVudFggLSAoY29udGFpbmVyLmxlZnQgLSB0aGlzLmRyYWdPZmZzZXRYKSkgLyBkZWZhdWx0V2lkdGgpICogZGVmYXVsdFdpZHRoO1xyXG4gICAgICAgIGNvbnN0IHkgPSBNYXRoLmZsb29yKChlLmNsaWVudFkgLSAoY29udGFpbmVyLnRvcCAtIHRoaXMuZHJhZ09mZnNldFkpKSAvIGRlZmF1bHRIZWlnaHQpICogZGVmYXVsdEhlaWdodDtcclxuICAgICAgICB2YXIgbGVmdCA9IHggPiAwID8geCA6IDA7XHJcbiAgICAgICAgdmFyIHRvcCA9IHkgPiAwID8geSA6IDA7XHJcblxyXG4gICAgICAgIGNvbnN0IHJlY3QgPSB0aGlzLml0ZW0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICAgICAgY29uc3QgaXRlbU9mZnNldExlZnQgPSBsZWZ0ICsgcmVjdC53aWR0aDtcclxuICAgICAgICBjb25zdCBpdGVtT2Zmc2V0VG9wID0gdG9wICsgcmVjdC5oZWlnaHQ7XHJcblxyXG4gICAgICAgIGlmIChpdGVtT2Zmc2V0TGVmdCA+IGNvbnRhaW5lci53aWR0aCkge1xyXG4gICAgICAgICAgICBsZWZ0ID0gTWF0aC5mbG9vcigoY29udGFpbmVyLndpZHRoIC0gcmVjdC53aWR0aCkgLyBkZWZhdWx0V2lkdGgpICogZGVmYXVsdFdpZHRoO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGl0ZW1PZmZzZXRUb3AgPiBjb250YWluZXIuaGVpZ2h0KSB7XHJcbiAgICAgICAgICAgIHRvcCA9IE1hdGguZmxvb3IoKGNvbnRhaW5lci5oZWlnaHQgLSByZWN0LmhlaWdodCkgLyBkZWZhdWx0SGVpZ2h0KSAqIGRlZmF1bHRIZWlnaHQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBpbmZvID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5zdGF0ZS5pbmZvLCB7XHJcbiAgICAgICAgICAgIHg6IGxlZnQsXHJcbiAgICAgICAgICAgIHk6IHRvcFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnByb3BzLnVwZGF0ZVByb2plY3Qoe1xyXG4gICAgICAgICAgICBwYXRoOiB0aGlzLnByb3BzLnVpZCxcclxuICAgICAgICAgICAgdmFsdWU6IGluZm9cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZShPYmplY3QuYXNzaWduKHt9LCB0aGlzLnN0YXRlLCB7XHJcbiAgICAgICAgICAgIGluZm9cclxuICAgICAgICB9KSk7XHJcbiAgICB9XHJcblxyXG4gICAgbW91c2Vtb3ZlKGUpIHtcclxuICAgICAgICBpZiAodGhpcy5kcmFnZ2luZykge1xyXG4gICAgICAgICAgICBlLnRhcmdldC5zdHlsZS5jdXJzb3IgPSAnbW92ZSc7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IGl0ZW1Db250YWluZXJDbGFzc05hbWUgfSA9IHRoaXMuc3RhdGU7XHJcbiAgICAgICAgY29uc3QgVGFnTmFtZSA9IGAke3RoaXMucHJvcHMudGFnLm5hbWV9YDtcclxuXHJcbiAgICAgICAgdmFyIHRhZyA9IG51bGw7XHJcbiAgICAgICAgaWYgKHRoaXMucHJvcHMudGFnLmlubmVyVmFsdWUpIHtcclxuICAgICAgICAgICAgdGFnID0gKDxUYWdOYW1lPnt0aGlzLnByb3BzLnRhZy52YWx1ZX08L1RhZ05hbWU+KVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRhZyA9ICg8VGFnTmFtZSB2YWx1ZT17dGhpcy5wcm9wcy50YWcudmFsdWV9PjwvVGFnTmFtZT4pXHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG5cclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17aXRlbUNvbnRhaW5lckNsYXNzTmFtZX1cclxuICAgICAgICAgICAgICAgIHJlZj17aXRlbSA9PiB0aGlzLml0ZW0gPSBpdGVtfVxyXG4gICAgICAgICAgICAgICAgb25DbGljaz17dGhpcy5oYW5kbGVJdGVtQ29udGFpbmVyQ2xpY2t9XHJcbiAgICAgICAgICAgICAgICBkcmFnZ2FibGU9e3RydWV9XHJcbiAgICAgICAgICAgICAgICBvbkRyYWdTdGFydD17dGhpcy5oYW5kbGVEcmFnU3RhcnR9XHJcbiAgICAgICAgICAgICAgICBvbkRyYWc9e3RoaXMuaGFuZGxlRHJhZ31cclxuICAgICAgICAgICAgICAgIG9uRHJhZ0VuZD17dGhpcy5oYW5kbGVEcmFnRW5kfVxyXG4gICAgICAgICAgICAgICAgc3R5bGU9e3sgXHJcbiAgICAgICAgICAgICAgICAgICAgdG9wOiB0aGlzLnByb3BzLnksIFxyXG4gICAgICAgICAgICAgICAgICAgIGxlZnQ6IHRoaXMucHJvcHMueCxcclxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogdGhpcy5wcm9wcy53aWR0aCxcclxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IHRoaXMucHJvcHMuaGVpZ2h0LFxyXG4gICAgICAgICAgICAgICAgICAgIHpJbmRleDogdGhpcy5wcm9wcy56ICsgMTAwXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0+XHJcbiAgICAgICAgICAgICAgICB7dGFnfVxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBJdGVtID0gY29ubmVjdChtYXBTdGF0ZVRvUHJvcHMsIG1hcERpc3BhdGNoVG9Qcm9wcykoSXRlbUNvbXBvbmVudCk7XHJcbmV4cG9ydCBkZWZhdWx0IEl0ZW07IiwiZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIikodHJ1ZSk7XG4vLyBNb2R1bGVcbmV4cG9ydHMucHVzaChbbW9kdWxlLmlkLCBcIi5pdGVtLWNvbnRhaW5lciB7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICBib3JkZXI6IDFweCBzb2xpZCAjNzg3ODc4O1xcbiAgYmFja2dyb3VuZDogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjkpO1xcbiAgcGFkZGluZzogNHB4O1xcbiAgY3Vyc29yOiBtb3ZlOyB9XFxuICAuaXRlbS1jb250YWluZXIgaDEsIC5pdGVtLWNvbnRhaW5lciBoMiwgLml0ZW0tY29udGFpbmVyIGgzLCAuaXRlbS1jb250YWluZXIgaDQsIC5pdGVtLWNvbnRhaW5lciBoNSwgLml0ZW0tY29udGFpbmVyIGg2IHtcXG4gICAgbWFyZ2luOiAwOyB9XFxuICAuaXRlbS1jb250YWluZXIuZm9jdXMge1xcbiAgICBiYWNrZ3JvdW5kOiByZ2JhKDI0MCwgMjQwLCAyNDAsIDAuOSk7IH1cXG5cIiwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJDOi9Vc2Vycy9nYXJyaS9zb3VyY2UvcmVwb3Mvc25hcGZvcm0vY2xpZW50L2VuZ2luZS9hc3NldHMvc3R5bGUvY29tcG9uZW50cy9pdGVtL2NsaWVudC9lbmdpbmUvYXNzZXRzL3N0eWxlL2NvbXBvbmVudHMvaXRlbS9pdGVtLnNjc3NcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBQUE7RUFDSSxrQkFBa0I7RUFDbEIseUJBQXlCO0VBQ3pCLG9DQUFvQztFQUNwQyxZQUFZO0VBQ1osWUFBWSxFQUFBO0VBTGhCO0lBUVEsU0FBUyxFQUFBO0VBUmpCO0lBWVEsb0NBQW9DLEVBQUFcIixcImZpbGVcIjpcIml0ZW0uc2Nzc1wiLFwic291cmNlc0NvbnRlbnRcIjpbXCIuaXRlbS1jb250YWluZXIge1xcclxcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XFxyXFxuICAgIGJvcmRlcjogMXB4IHNvbGlkICM3ODc4Nzg7XFxyXFxuICAgIGJhY2tncm91bmQ6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC45KTtcXHJcXG4gICAgcGFkZGluZzogNHB4O1xcclxcbiAgICBjdXJzb3I6IG1vdmU7XFxyXFxuXFxyXFxuICAgIGgxLCBoMiwgaDMsIGg0LCBoNSwgaDYge1xcclxcbiAgICAgICAgbWFyZ2luOiAwO1xcclxcbiAgICB9XFxyXFxuXFxyXFxuICAgICYuZm9jdXMge1xcclxcbiAgICAgICAgYmFja2dyb3VuZDogcmdiYSgyNDAsIDI0MCwgMjQwLCAwLjkpO1xcclxcbiAgICB9XFxyXFxufVwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuXG4iLCJcbnZhciBjb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanM/P3JlZi0tNi0xIS4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9saWIvbG9hZGVyLmpzPz9yZWYtLTYtMiEuL2l0ZW0uc2Nzc1wiKTtcblxuaWYodHlwZW9mIGNvbnRlbnQgPT09ICdzdHJpbmcnKSBjb250ZW50ID0gW1ttb2R1bGUuaWQsIGNvbnRlbnQsICcnXV07XG5cbnZhciB0cmFuc2Zvcm07XG52YXIgaW5zZXJ0SW50bztcblxuXG5cbnZhciBvcHRpb25zID0ge1wiaG1yXCI6dHJ1ZX1cblxub3B0aW9ucy50cmFuc2Zvcm0gPSB0cmFuc2Zvcm1cbm9wdGlvbnMuaW5zZXJ0SW50byA9IHVuZGVmaW5lZDtcblxudmFyIHVwZGF0ZSA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9saWIvYWRkU3R5bGVzLmpzXCIpKGNvbnRlbnQsIG9wdGlvbnMpO1xuXG5pZihjb250ZW50LmxvY2FscykgbW9kdWxlLmV4cG9ydHMgPSBjb250ZW50LmxvY2FscztcblxuaWYobW9kdWxlLmhvdCkge1xuXHRtb2R1bGUuaG90LmFjY2VwdChcIiEhLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanM/P3JlZi0tNi0xIS4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9saWIvbG9hZGVyLmpzPz9yZWYtLTYtMiEuL2l0ZW0uc2Nzc1wiLCBmdW5jdGlvbigpIHtcblx0XHR2YXIgbmV3Q29udGVudCA9IHJlcXVpcmUoXCIhIS4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzPz9yZWYtLTYtMSEuLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvbGliL2xvYWRlci5qcz8/cmVmLS02LTIhLi9pdGVtLnNjc3NcIik7XG5cblx0XHRpZih0eXBlb2YgbmV3Q29udGVudCA9PT0gJ3N0cmluZycpIG5ld0NvbnRlbnQgPSBbW21vZHVsZS5pZCwgbmV3Q29udGVudCwgJyddXTtcblxuXHRcdHZhciBsb2NhbHMgPSAoZnVuY3Rpb24oYSwgYikge1xuXHRcdFx0dmFyIGtleSwgaWR4ID0gMDtcblxuXHRcdFx0Zm9yKGtleSBpbiBhKSB7XG5cdFx0XHRcdGlmKCFiIHx8IGFba2V5XSAhPT0gYltrZXldKSByZXR1cm4gZmFsc2U7XG5cdFx0XHRcdGlkeCsrO1xuXHRcdFx0fVxuXG5cdFx0XHRmb3Ioa2V5IGluIGIpIGlkeC0tO1xuXG5cdFx0XHRyZXR1cm4gaWR4ID09PSAwO1xuXHRcdH0oY29udGVudC5sb2NhbHMsIG5ld0NvbnRlbnQubG9jYWxzKSk7XG5cblx0XHRpZighbG9jYWxzKSB0aHJvdyBuZXcgRXJyb3IoJ0Fib3J0aW5nIENTUyBITVIgZHVlIHRvIGNoYW5nZWQgY3NzLW1vZHVsZXMgbG9jYWxzLicpO1xuXG5cdFx0dXBkYXRlKG5ld0NvbnRlbnQpO1xuXHR9KTtcblxuXHRtb2R1bGUuaG90LmRpc3Bvc2UoZnVuY3Rpb24oKSB7IHVwZGF0ZSgpOyB9KTtcbn0iXSwic291cmNlUm9vdCI6IiJ9