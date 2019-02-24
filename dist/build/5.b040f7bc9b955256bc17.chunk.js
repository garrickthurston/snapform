(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[5],{

/***/ "0h61":
/*!**********************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js??ref--6-1!./node_modules/sass-loader/lib/loader.js??ref--6-2!./engine/assets/style/components/item/item.scss ***!
  \**********************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../../../node_modules/css-loader/dist/runtime/api.js */ "JPst")(true);
// Module
exports.push([module.i, ".item-container {\n  position: absolute;\n  border: 1px solid #787878;\n  background: rgba(255, 255, 255, 0.9);\n  padding: 4px;\n  cursor: move; }\n  .item-container h1, .item-container h2, .item-container h3, .item-container h4, .item-container h5, .item-container h6 {\n    margin: 0; }\n  .item-container.focus {\n    background: rgba(240, 240, 240, 0.9); }\n", "",{"version":3,"sources":["C:/Users/garri/source/repos/snapform/engine/assets/style/components/item/engine/assets/style/components/item/item.scss"],"names":[],"mappings":"AAAA;EACI,kBAAkB;EAClB,yBAAyB;EACzB,oCAAoC;EACpC,YAAY;EACZ,YAAY,EAAA;EALhB;IAQQ,SAAS,EAAA;EARjB;IAYQ,oCAAoC,EAAA","file":"item.scss","sourcesContent":[".item-container {\r\n    position: absolute;\r\n    border: 1px solid #787878;\r\n    background: rgba(255, 255, 255, 0.9);\r\n    padding: 4px;\r\n    cursor: move;\r\n\r\n    h1, h2, h3, h4, h5, h6 {\r\n        margin: 0;\r\n    }\r\n\r\n    &.focus {\r\n        background: rgba(240, 240, 240, 0.9);\r\n    }\r\n}"],"sourceRoot":""}]);



/***/ }),

/***/ "P3Xs":
/*!******************************************************!*\
  !*** ./engine/src/components/item/item.component.js ***!
  \******************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ "/MKj");
/* harmony import */ var _config_redux_redux_store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../config/redux/redux.store */ "ERX6");
/* harmony import */ var _config_redux_redux_actions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../config/redux/redux.actions */ "ifEJ");
/* harmony import */ var _assets_style_components_item_item_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../assets/style/components/item/item.scss */ "c+0k");
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
    } = _config_redux_redux_store__WEBPACK_IMPORTED_MODULE_2__["store"].getState();
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
    } = _config_redux_redux_store__WEBPACK_IMPORTED_MODULE_2__["store"].getState();
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
    } = _config_redux_redux_store__WEBPACK_IMPORTED_MODULE_2__["store"].getState();
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
    } = _config_redux_redux_store__WEBPACK_IMPORTED_MODULE_2__["store"].getState();
    this.saveService.saveProject('1', '1', workspace.project);
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

/***/ "c+0k":
/*!*******************************************************!*\
  !*** ./engine/assets/style/components/item/item.scss ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../../../../node_modules/css-loader/dist/cjs.js??ref--6-1!../../../../../node_modules/sass-loader/lib/loader.js??ref--6-2!./item.scss */ "0h61");

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(/*! ../../../../../node_modules/style-loader/lib/addStyles.js */ "aET+")(content, options);

if(content.locals) module.exports = content.locals;

if(false) {}

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9lbmdpbmUvYXNzZXRzL3N0eWxlL2NvbXBvbmVudHMvaXRlbS9pdGVtLnNjc3MiLCJ3ZWJwYWNrOi8vLy4vZW5naW5lL3NyYy9jb21wb25lbnRzL2l0ZW0vaXRlbS5jb21wb25lbnQuanMiLCJ3ZWJwYWNrOi8vLy4vZW5naW5lL2Fzc2V0cy9zdHlsZS9jb21wb25lbnRzL2l0ZW0vaXRlbS5zY3NzP2M3ODciXSwibmFtZXMiOlsibWFwU3RhdGVUb1Byb3BzIiwic3RhdGUiLCJtYXBEaXNwYXRjaFRvUHJvcHMiLCJkaXNwYXRjaCIsInVwZGF0ZVByb2plY3QiLCJwYXlsb2FkIiwiZ0NsaWNrZWQiLCJ1cGRhdGVQcm9qZWN0SXRlbXMiLCJkZWZhdWx0SXRlbUNvbnRhaW5lckNsYXNzTmFtZSIsIkl0ZW1Db21wb25lbnQiLCJDb21wb25lbnQiLCJjb25zdHJ1Y3RvciIsInByb3BzIiwid29ya3NwYWNlIiwic3RvcmUiLCJnZXRTdGF0ZSIsInByb2plY3QiLCJpbmZvIiwiaXRlbXMiLCJ1aWQiLCJpdGVtQ29udGFpbmVyQ2xhc3NOYW1lIiwiaGFuZGxlSXRlbUNvbnRhaW5lckNsaWNrIiwiYmluZCIsImhhbmRsZU91dHNpZGVDbGljayIsImRyYWciLCJoYW5kbGVEcmFnU3RhcnQiLCJoYW5kbGVEcmFnIiwiaGFuZGxlRHJhZ0VuZCIsIm1vdXNlbW92ZSIsImNvbXBvbmVudFdpbGxNb3VudCIsImRvY3VtZW50IiwiYWRkRXZlbnRMaXN0ZW5lciIsImNvbXBvbmVudERpZE1vdW50IiwiZHJhZ0ltZyIsIkltYWdlIiwic3JjIiwiY29tcG9uZW50V2lsbFVubW91bnQiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwibW91c2Vtb3V2ZSIsImUiLCJpdGVtIiwiY29udGFpbnMiLCJ0YXJnZXQiLCJzZXRTdGF0ZSIsIk9iamVjdCIsImFzc2lnbiIsImN1cnJlbnRfeiIsInoiLCJ0b3BfeiIsImtleSIsImdDbGFzc0xpc3QiLCJkYXRhVHJhbnNmZXIiLCJzZXREcmFnSW1hZ2UiLCJzdHlsZSIsImN1cnNvciIsImNvbnRhaW5lciIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsImRyYWdnaW5nIiwiZHJhZ09mZnNldFgiLCJ4IiwiY2xpZW50WCIsImxlZnQiLCJkcmFnT2Zmc2V0WSIsInkiLCJjbGllbnRZIiwidG9wIiwic2F2ZVNlcnZpY2UiLCJzYXZlUHJvamVjdCIsImRlZmF1bHRXaWR0aCIsImNvbmZpZyIsImNlbGxXaWR0aCIsImRlZmF1bHRIZWlnaHQiLCJjZWxsSGVpZ2h0IiwiTWF0aCIsImZsb29yIiwicmVjdCIsIml0ZW1PZmZzZXRMZWZ0Iiwid2lkdGgiLCJpdGVtT2Zmc2V0VG9wIiwiaGVpZ2h0IiwicGF0aCIsInZhbHVlIiwicmVuZGVyIiwiVGFnTmFtZSIsInRhZyIsIm5hbWUiLCJpbm5lclZhbHVlIiwiekluZGV4IiwiSXRlbSIsImNvbm5lY3QiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBLDJCQUEyQixtQkFBTyxDQUFDLHdFQUE0RDtBQUMvRjtBQUNBLGNBQWMsUUFBUyxvQkFBb0IsdUJBQXVCLDhCQUE4Qix5Q0FBeUMsaUJBQWlCLGlCQUFpQixFQUFFLDRIQUE0SCxnQkFBZ0IsRUFBRSwyQkFBMkIsMkNBQTJDLEVBQUUsU0FBUyw2S0FBNkssWUFBWSxhQUFhLGFBQWEsV0FBVyxlQUFlLE1BQU0sZUFBZSxNQUFNLHlFQUF5RSwyQkFBMkIsa0NBQWtDLDZDQUE2QyxxQkFBcUIscUJBQXFCLG9DQUFvQyxzQkFBc0IsU0FBUyxxQkFBcUIsaURBQWlELFNBQVMsS0FBSyxtQkFBbUI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0YzaEM7QUFDQTtBQUNBO0NBRUE7O0FBRUE7O0FBRUEsTUFBTUEsZUFBZSxHQUFJQyxLQUFELElBQVdBLEtBQW5DOztBQUNBLE1BQU1DLGtCQUFrQixHQUFJQyxRQUFELElBQWM7QUFDckMsU0FBTztBQUNIQyxpQkFBYSxFQUFFQyxPQUFPLElBQUlGLFFBQVEsQ0FBQ0MsaUZBQWEsQ0FBQ0MsT0FBRCxDQUFkLENB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dHMgPSBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzXCIpKHRydWUpO1xuLy8gTW9kdWxlXG5leHBvcnRzLnB1c2goW21vZHVsZS5pZCwgXCIuaXRlbS1jb250YWluZXIge1xcbiAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgYm9yZGVyOiAxcHggc29saWQgIzc4Nzg3ODtcXG4gIGJhY2tncm91bmQ6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC45KTtcXG4gIHBhZGRpbmc6IDRweDtcXG4gIGN1cnNvcjogbW92ZTsgfVxcbiAgLml0ZW0tY29udGFpbmVyIGgxLCAuaXRlbS1jb250YWluZXIgaDIsIC5pdGVtLWNvbnRhaW5lciBoMywgLml0ZW0tY29udGFpbmVyIGg0LCAuaXRlbS1jb250YWluZXIgaDUsIC5pdGVtLWNvbnRhaW5lciBoNiB7XFxuICAgIG1hcmdpbjogMDsgfVxcbiAgLml0ZW0tY29udGFpbmVyLmZvY3VzIHtcXG4gICAgYmFja2dyb3VuZDogcmdiYSgyNDAsIDI0MCwgMjQwLCAwLjkpOyB9XFxuXCIsIFwiXCIse1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wiQzovVXNlcnMvZ2Fycmkvc291cmNlL3JlcG9zL3NuYXBmb3JtL2VuZ2luZS9hc3NldHMvc3R5bGUvY29tcG9uZW50cy9pdGVtL2VuZ2luZS9hc3NldHMvc3R5bGUvY29tcG9uZW50cy9pdGVtL2l0ZW0uc2Nzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQTtFQUNJLGtCQUFrQjtFQUNsQix5QkFBeUI7RUFDekIsb0NBQW9DO0VBQ3BDLFlBQVk7RUFDWixZQUFZLEVBQUE7RUFMaEI7SUFRUSxTQUFTLEVBQUE7RUFSakI7SUFZUSxvQ0FBb0MsRUFBQVwiLFwiZmlsZVwiOlwiaXRlbS5zY3NzXCIsXCJzb3VyY2VzQ29udGVudFwiOltcIi5pdGVtLWNvbnRhaW5lciB7XFxyXFxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXHJcXG4gICAgYm9yZGVyOiAxcHggc29saWQgIzc4Nzg3ODtcXHJcXG4gICAgYmFja2dyb3VuZDogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjkpO1xcclxcbiAgICBwYWRkaW5nOiA0cHg7XFxyXFxuICAgIGN1cnNvcjogbW92ZTtcXHJcXG5cXHJcXG4gICAgaDEsIGgyLCBoMywgaDQsIGg1LCBoNiB7XFxyXFxuICAgICAgICBtYXJnaW46IDA7XFxyXFxuICAgIH1cXHJcXG5cXHJcXG4gICAgJi5mb2N1cyB7XFxyXFxuICAgICAgICBiYWNrZ3JvdW5kOiByZ2JhKDI0MCwgMjQwLCAyNDAsIDAuOSk7XFxyXFxuICAgIH1cXHJcXG59XCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG5cbiIsImltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQgfSBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCc7XHJcbmltcG9ydCB7IHN0b3JlIH0gZnJvbSAnLi4vLi4vY29uZmlnL3JlZHV4L3JlZHV4LnN0b3JlJztcclxuaW1wb3J0IHsgdXBkYXRlUHJvamVjdCwgZ0NsaWNrZWQsIHVwZGF0ZVByb2plY3RJdGVtcyB9IGZyb20gJy4uLy4uL2NvbmZpZy9yZWR1eC9yZWR1eC5hY3Rpb25zJztcclxuLy9pbXBvcnQgeyBTYXZlU2VydmljZSB9IGZyb20gJy4uLy4uL3NoYXJlZC9zZXJ2aWNlcy9zYXZlLnNlcnZpY2UnO1xyXG5cclxuaW1wb3J0ICcuLi8uLi8uLi9hc3NldHMvc3R5bGUvY29tcG9uZW50cy9pdGVtL2l0ZW0uc2Nzcyc7XHJcblxyXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSAoc3RhdGUpID0+IHN0YXRlO1xyXG5jb25zdCBtYXBEaXNwYXRjaFRvUHJvcHMgPSAoZGlzcGF0Y2gpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdXBkYXRlUHJvamVjdDogcGF5bG9hZCA9PiBkaXNwYXRjaCh1cGRhdGVQcm9qZWN0KHBheWxvYWQpKSxcclxuICAgICAgICBnQ2xpY2tlZDogcGF5bG9hZCA9PiBkaXNwYXRjaChnQ2xpY2tlZChwYXlsb2FkKSksXHJcbiAgICAgICAgdXBkYXRlUHJvamVjdEl0ZW1zOiBwYXlsb2FkID0+IGRpc3BhdGNoKHVwZGF0ZVByb2plY3RJdGVtcyhwYXlsb2FkKSlcclxuICAgIH07XHJcbn07XHJcblxyXG5jb25zdCBkZWZhdWx0SXRlbUNvbnRhaW5lckNsYXNzTmFtZSA9ICdpdGVtLWNvbnRhaW5lcic7XHJcblxyXG5jbGFzcyBJdGVtQ29tcG9uZW50IGV4dGVuZHMgQ29tcG9uZW50IHtcclxuICAgIGRyYWdnaW5nID0gZmFsc2U7XHJcbiAgICBkcmFnT2Zmc2V0WCA9IDA7XHJcbiAgICBkcmFnT2Zmc2V0WSA9IDA7XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcblxyXG4gICAgICAgIGNvbnN0IHsgd29ya3NwYWNlIH0gPSBzdG9yZS5nZXRTdGF0ZSgpO1xyXG4gICAgICAgIGNvbnN0IHByb2plY3QgPSB3b3Jrc3BhY2UucHJvamVjdDtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLnN0YXRlID0ge1xyXG4gICAgICAgICAgICBpbmZvOiBwcm9qZWN0Lml0ZW1zW3RoaXMucHJvcHMudWlkXSxcclxuICAgICAgICAgICAgaXRlbUNvbnRhaW5lckNsYXNzTmFtZTogZGVmYXVsdEl0ZW1Db250YWluZXJDbGFzc05hbWVcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvL3RoaXMuc2F2ZVNlcnZpY2UgPSBuZXcgU2F2ZVNlcnZpY2UoKTtcclxuXHJcbiAgICAgICAgdGhpcy5oYW5kbGVJdGVtQ29udGFpbmVyQ2xpY2sgPSB0aGlzLmhhbmRsZUl0ZW1Db250YWluZXJDbGljay5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlT3V0c2lkZUNsaWNrID0gdGhpcy5oYW5kbGVPdXRzaWRlQ2xpY2suYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLmRyYWcgPSB0aGlzLmRyYWcuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLmhhbmRsZURyYWdTdGFydCA9IHRoaXMuaGFuZGxlRHJhZ1N0YXJ0LmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVEcmFnID0gdGhpcy5oYW5kbGVEcmFnLmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVEcmFnRW5kID0gdGhpcy5oYW5kbGVEcmFnRW5kLmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5tb3VzZW1vdmUgPSB0aGlzLm1vdXNlbW92ZS5iaW5kKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbXBvbmVudFdpbGxNb3VudCgpIHtcclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLmhhbmRsZU91dHNpZGVDbGljaywgZmFsc2UpO1xyXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMubW91c2Vtb3ZlLCBmYWxzZSk7XHJcbiAgICB9XHJcblxyXG4gICAgY29tcG9uZW50RGlkTW91bnQoKSB7XHJcbiAgICAgICAgdGhpcy5kcmFnSW1nID0gbmV3IEltYWdlKDAsMCk7XHJcbiAgICAgICAgdGhpcy5kcmFnSW1nLnNyYyA9ICdkYXRhOmltYWdlL2dpZjtiYXNlNjQsUjBsR09EbGhBUUFCQUlBQUFBQUFBUC8vL3lINUJBRUFBQUFBTEFBQUFBQUJBQUVBQUFJQlJBQTcnO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xyXG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMuaGFuZGxlT3V0c2lkZUNsaWNrLCBmYWxzZSk7XHJcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5tb3VzZW1vdXZlLCBmYWxzZSk7XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlT3V0c2lkZUNsaWNrKGUpIHtcclxuICAgICAgICBpZiAodGhpcy5pdGVtLmNvbnRhaW5zKGUudGFyZ2V0KSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnNldFN0YXRlKE9iamVjdC5hc3NpZ24oe30sIHRoaXMuc3RhdGUsIHtcclxuICAgICAgICAgICAgaXRlbUNvbnRhaW5lckNsYXNzTmFtZTogZGVmYXVsdEl0ZW1Db250YWluZXJDbGFzc05hbWVcclxuICAgICAgICB9KSk7XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlSXRlbUNvbnRhaW5lckNsaWNrKCkge1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5zdGF0ZSwge1xyXG4gICAgICAgICAgICBpdGVtQ29udGFpbmVyQ2xhc3NOYW1lOiBkZWZhdWx0SXRlbUNvbnRhaW5lckNsYXNzTmFtZSArICcgZm9jdXMnXHJcbiAgICAgICAgfSkpO1xyXG5cclxuICAgICAgICBjb25zdCB7IHdvcmtzcGFjZSB9ID0gc3RvcmUuZ2V0U3RhdGUoKTtcclxuICAgICAgICB2YXIgaXRlbXMgPSB3b3Jrc3BhY2UucHJvamVjdC5pdGVtcztcclxuXHJcbiAgICAgICAgY29uc3QgY3VycmVudF96ID0gaXRlbXNbdGhpcy5wcm9wcy51aWRdLno7XHJcbiAgICAgICAgdmFyIHRvcF96ID0gY3VycmVudF96O1xyXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBpdGVtcykge1xyXG4gICAgICAgICAgICBpZiAoa2V5ICE9PSB0aGlzLnByb3BzLnVpZCAmJiBpdGVtc1trZXldLnogPiBjdXJyZW50X3opIHtcclxuICAgICAgICAgICAgICAgIGlmIChpdGVtc1trZXldLnogPiB0b3Bfeikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRvcF96ID0gaXRlbXNba2V5XS56O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaXRlbXNba2V5XS56IC09IDE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaXRlbXNbdGhpcy5wcm9wcy51aWRdLnogPSB0b3BfejtcclxuXHJcbiAgICAgICAgdGhpcy5wcm9wcy51cGRhdGVQcm9qZWN0SXRlbXMoaXRlbXMpO1xyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZURyYWdTdGFydChlKSB7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVJdGVtQ29udGFpbmVyQ2xpY2soKTtcclxuXHJcbiAgICAgICAgdGhpcy5wcm9wcy5nQ2xpY2tlZCh7XHJcbiAgICAgICAgICAgIGdDbGFzc0xpc3Q6ICdnaWQgaGlkZGVuJ1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBlLmRhdGFUcmFuc2Zlci5zZXREcmFnSW1hZ2UodGhpcy5kcmFnSW1nLCAwLCAwKTtcclxuICAgICAgICBlLnRhcmdldC5zdHlsZS5jdXJzb3IgPSAnbW92ZSc7XHJcblxyXG4gICAgICAgIGNvbnN0IHsgd29ya3NwYWNlIH0gPSBzdG9yZS5nZXRTdGF0ZSgpO1xyXG4gICAgICAgIGNvbnN0IGNvbnRhaW5lciA9IHdvcmtzcGFjZS5wcm9qZWN0LmNvbnRhaW5lci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgICAgICBjb25zdCBpdGVtID0gd29ya3NwYWNlLnByb2plY3QuaXRlbXNbdGhpcy5wcm9wcy51aWRdO1xyXG5cclxuICAgICAgICB0aGlzLmRyYWdnaW5nID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLmRyYWdPZmZzZXRYID0gaXRlbS54IC0gKGUuY2xpZW50WCAtIGNvbnRhaW5lci5sZWZ0KTtcclxuICAgICAgICB0aGlzLmRyYWdPZmZzZXRZID0gaXRlbS55IC0gKGUuY2xpZW50WSAtIGNvbnRhaW5lci50b3ApO1xyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZURyYWcoZSkge1xyXG4gICAgICAgIHRoaXMuZHJhZyhlKTtcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVEcmFnRW5kKGUpIHtcclxuICAgICAgICB0aGlzLmRyYWcoZSk7XHJcblxyXG4gICAgICAgIHRoaXMucHJvcHMuZ0NsaWNrZWQoe1xyXG4gICAgICAgICAgICBnQ2xhc3NMaXN0OiAnZ2lkJ1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmRyYWdnaW5nID0gZmFsc2U7XHJcblxyXG4gICAgICAgIGNvbnN0IHsgd29ya3NwYWNlIH0gPSBzdG9yZS5nZXRTdGF0ZSgpO1xyXG4gICAgICAgIHRoaXMuc2F2ZVNlcnZpY2Uuc2F2ZVByb2plY3QoJzEnLCAnMScsIHdvcmtzcGFjZS5wcm9qZWN0KTtcclxuICAgIH1cclxuXHJcbiAgICBkcmFnKGUpIHtcclxuICAgICAgICBjb25zdCB7IHdvcmtzcGFjZSB9ID0gc3RvcmUuZ2V0U3RhdGUoKTtcclxuICAgICAgICBjb25zdCBjb250YWluZXIgPSB3b3Jrc3BhY2UucHJvamVjdC5jb250YWluZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICAgICAgY29uc3QgZGVmYXVsdFdpZHRoID0gd29ya3NwYWNlLnByb2plY3QuY29uZmlnLmNlbGxXaWR0aDtcclxuICAgICAgICBjb25zdCBkZWZhdWx0SGVpZ2h0ID0gd29ya3NwYWNlLnByb2plY3QuY29uZmlnLmNlbGxIZWlnaHQ7XHJcblxyXG4gICAgICAgIGNvbnN0IHggPSBNYXRoLmZsb29yKChlLmNsaWVudFggLSAoY29udGFpbmVyLmxlZnQgLSB0aGlzLmRyYWdPZmZzZXRYKSkgLyBkZWZhdWx0V2lkdGgpICogZGVmYXVsdFdpZHRoO1xyXG4gICAgICAgIGNvbnN0IHkgPSBNYXRoLmZsb29yKChlLmNsaWVudFkgLSAoY29udGFpbmVyLnRvcCAtIHRoaXMuZHJhZ09mZnNldFkpKSAvIGRlZmF1bHRIZWlnaHQpICogZGVmYXVsdEhlaWdodDtcclxuICAgICAgICB2YXIgbGVmdCA9IHggPiAwID8geCA6IDA7XHJcbiAgICAgICAgdmFyIHRvcCA9IHkgPiAwID8geSA6IDA7XHJcblxyXG4gICAgICAgIGNvbnN0IHJlY3QgPSB0aGlzLml0ZW0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICAgICAgY29uc3QgaXRlbU9mZnNldExlZnQgPSBsZWZ0ICsgcmVjdC53aWR0aDtcclxuICAgICAgICBjb25zdCBpdGVtT2Zmc2V0VG9wID0gdG9wICsgcmVjdC5oZWlnaHQ7XHJcblxyXG4gICAgICAgIGlmIChpdGVtT2Zmc2V0TGVmdCA+IGNvbnRhaW5lci53aWR0aCkge1xyXG4gICAgICAgICAgICBsZWZ0ID0gTWF0aC5mbG9vcigoY29udGFpbmVyLndpZHRoIC0gcmVjdC53aWR0aCkgLyBkZWZhdWx0V2lkdGgpICogZGVmYXVsdFdpZHRoO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGl0ZW1PZmZzZXRUb3AgPiBjb250YWluZXIuaGVpZ2h0KSB7XHJcbiAgICAgICAgICAgIHRvcCA9IE1hdGguZmxvb3IoKGNvbnRhaW5lci5oZWlnaHQgLSByZWN0LmhlaWdodCkgLyBkZWZhdWx0SGVpZ2h0KSAqIGRlZmF1bHRIZWlnaHQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBpbmZvID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5zdGF0ZS5pbmZvLCB7XHJcbiAgICAgICAgICAgIHg6IGxlZnQsXHJcbiAgICAgICAgICAgIHk6IHRvcFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnByb3BzLnVwZGF0ZVByb2plY3Qoe1xyXG4gICAgICAgICAgICBwYXRoOiB0aGlzLnByb3BzLnVpZCxcclxuICAgICAgICAgICAgdmFsdWU6IGluZm9cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZShPYmplY3QuYXNzaWduKHt9LCB0aGlzLnN0YXRlLCB7XHJcbiAgICAgICAgICAgIGluZm9cclxuICAgICAgICB9KSk7XHJcbiAgICB9XHJcblxyXG4gICAgbW91c2Vtb3ZlKGUpIHtcclxuICAgICAgICBpZiAodGhpcy5kcmFnZ2luZykge1xyXG4gICAgICAgICAgICBlLnRhcmdldC5zdHlsZS5jdXJzb3IgPSAnbW92ZSc7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IGl0ZW1Db250YWluZXJDbGFzc05hbWUgfSA9IHRoaXMuc3RhdGU7XHJcbiAgICAgICAgY29uc3QgVGFnTmFtZSA9IGAke3RoaXMucHJvcHMudGFnLm5hbWV9YDtcclxuXHJcbiAgICAgICAgdmFyIHRhZyA9IG51bGw7XHJcbiAgICAgICAgaWYgKHRoaXMucHJvcHMudGFnLmlubmVyVmFsdWUpIHtcclxuICAgICAgICAgICAgdGFnID0gKDxUYWdOYW1lPnt0aGlzLnByb3BzLnRhZy52YWx1ZX08L1RhZ05hbWU+KVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRhZyA9ICg8VGFnTmFtZSB2YWx1ZT17dGhpcy5wcm9wcy50YWcudmFsdWV9PjwvVGFnTmFtZT4pXHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG5cclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17aXRlbUNvbnRhaW5lckNsYXNzTmFtZX1cclxuICAgICAgICAgICAgICAgIHJlZj17aXRlbSA9PiB0aGlzLml0ZW0gPSBpdGVtfVxyXG4gICAgICAgICAgICAgICAgb25DbGljaz17dGhpcy5oYW5kbGVJdGVtQ29udGFpbmVyQ2xpY2t9XHJcbiAgICAgICAgICAgICAgICBkcmFnZ2FibGU9e3RydWV9XHJcbiAgICAgICAgICAgICAgICBvbkRyYWdTdGFydD17dGhpcy5oYW5kbGVEcmFnU3RhcnR9XHJcbiAgICAgICAgICAgICAgICBvbkRyYWc9e3RoaXMuaGFuZGxlRHJhZ31cclxuICAgICAgICAgICAgICAgIG9uRHJhZ0VuZD17dGhpcy5oYW5kbGVEcmFnRW5kfVxyXG4gICAgICAgICAgICAgICAgc3R5bGU9e3sgXHJcbiAgICAgICAgICAgICAgICAgICAgdG9wOiB0aGlzLnByb3BzLnksIFxyXG4gICAgICAgICAgICAgICAgICAgIGxlZnQ6IHRoaXMucHJvcHMueCxcclxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogdGhpcy5wcm9wcy53aWR0aCxcclxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IHRoaXMucHJvcHMuaGVpZ2h0LFxyXG4gICAgICAgICAgICAgICAgICAgIHpJbmRleDogdGhpcy5wcm9wcy56ICsgMTAwXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0+XHJcbiAgICAgICAgICAgICAgICB7dGFnfVxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBJdGVtID0gY29ubmVjdChtYXBTdGF0ZVRvUHJvcHMsIG1hcERpc3BhdGNoVG9Qcm9wcykoSXRlbUNvbXBvbmVudCk7XHJcbmV4cG9ydCBkZWZhdWx0IEl0ZW07IiwiXG52YXIgY29udGVudCA9IHJlcXVpcmUoXCIhIS4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzPz9yZWYtLTYtMSEuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvbGliL2xvYWRlci5qcz8/cmVmLS02LTIhLi9pdGVtLnNjc3NcIik7XG5cbmlmKHR5cGVvZiBjb250ZW50ID09PSAnc3RyaW5nJykgY29udGVudCA9IFtbbW9kdWxlLmlkLCBjb250ZW50LCAnJ11dO1xuXG52YXIgdHJhbnNmb3JtO1xudmFyIGluc2VydEludG87XG5cblxuXG52YXIgb3B0aW9ucyA9IHtcImhtclwiOnRydWV9XG5cbm9wdGlvbnMudHJhbnNmb3JtID0gdHJhbnNmb3JtXG5vcHRpb25zLmluc2VydEludG8gPSB1bmRlZmluZWQ7XG5cbnZhciB1cGRhdGUgPSByZXF1aXJlKFwiIS4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvbGliL2FkZFN0eWxlcy5qc1wiKShjb250ZW50LCBvcHRpb25zKTtcblxuaWYoY29udGVudC5sb2NhbHMpIG1vZHVsZS5leHBvcnRzID0gY29udGVudC5sb2NhbHM7XG5cbmlmKG1vZHVsZS5ob3QpIHtcblx0bW9kdWxlLmhvdC5hY2NlcHQoXCIhIS4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzPz9yZWYtLTYtMSEuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvbGliL2xvYWRlci5qcz8/cmVmLS02LTIhLi9pdGVtLnNjc3NcIiwgZnVuY3Rpb24oKSB7XG5cdFx0dmFyIG5ld0NvbnRlbnQgPSByZXF1aXJlKFwiISEuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcz8/cmVmLS02LTEhLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2xpYi9sb2FkZXIuanM/P3JlZi0tNi0yIS4vaXRlbS5zY3NzXCIpO1xuXG5cdFx0aWYodHlwZW9mIG5ld0NvbnRlbnQgPT09ICdzdHJpbmcnKSBuZXdDb250ZW50ID0gW1ttb2R1bGUuaWQsIG5ld0NvbnRlbnQsICcnXV07XG5cblx0XHR2YXIgbG9jYWxzID0gKGZ1bmN0aW9uKGEsIGIpIHtcblx0XHRcdHZhciBrZXksIGlkeCA9IDA7XG5cblx0XHRcdGZvcihrZXkgaW4gYSkge1xuXHRcdFx0XHRpZighYiB8fCBhW2tleV0gIT09IGJba2V5XSkgcmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRpZHgrKztcblx0XHRcdH1cblxuXHRcdFx0Zm9yKGtleSBpbiBiKSBpZHgtLTtcblxuXHRcdFx0cmV0dXJuIGlkeCA9PT0gMDtcblx0XHR9KGNvbnRlbnQubG9jYWxzLCBuZXdDb250ZW50LmxvY2FscykpO1xuXG5cdFx0aWYoIWxvY2FscykgdGhyb3cgbmV3IEVycm9yKCdBYm9ydGluZyBDU1MgSE1SIGR1ZSB0byBjaGFuZ2VkIGNzcy1tb2R1bGVzIGxvY2Fscy4nKTtcblxuXHRcdHVwZGF0ZShuZXdDb250ZW50KTtcblx0fSk7XG5cblx0bW9kdWxlLmhvdC5kaXNwb3NlKGZ1bmN0aW9uKCkgeyB1cGRhdGUoKTsgfSk7XG59Il0sInNvdXJjZVJvb3QiOiIifQ==