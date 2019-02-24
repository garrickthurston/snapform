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
    const {
      workspace
    } = _config_redux_redux_store__WEBPACK_IMPORTED_MODULE_2__["store"].getState();
    const project = workspace.project;
    this.state = {
      info: project.items[this.props.uid],
      itemContainerClassName: defaultItemContainerClassName,
      dragging: false,
      dragOffsetX: 0,
      dragOffsetY: 0
    };
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
    this.setState(Object.assign({}, this.state, {
      dragging: true,
      dragOffsetX: item.x - (e.clientX - container.left),
      dragOffsetY: item.y - (e.clientY - container.top)
    }));
  }

  handleDrag(e) {
    this.drag(e);
  }

  handleDragEnd(e) {
    this.drag(e);
    this.props.gClicked({
      gClassList: 'gid'
    });
    this.setState(Object.assign({}, this.state, {
      dragging: false
    }));
  }

  drag(e) {
    const {
      dragOffsetX,
      dragOffsetY
    } = this.state;
    const {
      workspace
    } = _config_redux_redux_store__WEBPACK_IMPORTED_MODULE_2__["store"].getState();
    const container = workspace.project.container.getBoundingClientRect();
    const defaultWidth = workspace.project.cellWidth;
    const defaultHeight = workspace.project.cellHeight;
    const x = Math.floor((e.clientX - (container.left - dragOffsetX)) / defaultWidth) * defaultWidth;
    const y = Math.floor((e.clientY - (container.top - dragOffsetY)) / defaultHeight) * defaultHeight;
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
    if (this.state.dragging) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9lbmdpbmUvYXNzZXRzL3N0eWxlL2NvbXBvbmVudHMvaXRlbS9pdGVtLnNjc3MiLCJ3ZWJwYWNrOi8vLy4vZW5naW5lL3NyYy9jb21wb25lbnRzL2l0ZW0vaXRlbS5jb21wb25lbnQuanMiLCJ3ZWJwYWNrOi8vLy4vZW5naW5lL2Fzc2V0cy9zdHlsZS9jb21wb25lbnRzL2l0ZW0vaXRlbS5zY3NzP2M3ODciXSwibmFtZXMiOlsibWFwU3RhdGVUb1Byb3BzIiwic3RhdGUiLCJtYXBEaXNwYXRjaFRvUHJvcHMiLCJkaXNwYXRjaCIsInVwZGF0ZVByb2plY3QiLCJwYXlsb2FkIiwiZ0NsaWNrZWQiLCJ1cGRhdGVQcm9qZWN0SXRlbXMiLCJkZWZhdWx0SXRlbUNvbnRhaW5lckNsYXNzTmFtZSIsIkl0ZW1Db21wb25lbnQiLCJDb21wb25lbnQiLCJjb25zdHJ1Y3RvciIsInByb3BzIiwid29ya3NwYWNlIiwic3RvcmUiLCJnZXRTdGF0ZSIsInByb2plY3QiLCJpbmZvIiwiaXRlbXMiLCJ1aWQiLCJpdGVtQ29udGFpbmVyQ2xhc3NOYW1lIiwiZHJhZ2dpbmciLCJkcmFnT2Zmc2V0WCIsImRyYWdPZmZzZXRZIiwiaGFuZGxlSXRlbUNvbnRhaW5lckNsaWNrIiwiYmluZCIsImhhbmRsZU91dHNpZGVDbGljayIsImRyYWciLCJoYW5kbGVEcmFnU3RhcnQiLCJoYW5kbGVEcmFnIiwiaGFuZGxlRHJhZ0VuZCIsIm1vdXNlbW92ZSIsImNvbXBvbmVudFdpbGxNb3VudCIsImRvY3VtZW50IiwiYWRkRXZlbnRMaXN0ZW5lciIsImNvbXBvbmVudERpZE1vdW50IiwiZHJhZ0ltZyIsIkltYWdlIiwic3JjIiwiY29tcG9uZW50V2lsbFVubW91bnQiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwibW91c2Vtb3V2ZSIsImUiLCJpdGVtIiwiY29udGFpbnMiLCJ0YXJnZXQiLCJzZXRTdGF0ZSIsIk9iamVjdCIsImFzc2lnbiIsImN1cnJlbnRfeiIsInoiLCJ0b3BfeiIsImtleSIsImdDbGFzc0xpc3QiLCJkYXRhVHJhbnNmZXIiLCJzZXREcmFnSW1hZ2UiLCJzdHlsZSIsImN1cnNvciIsImNvbnRhaW5lciIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsIngiLCJjbGllbnRYIiwibGVmdCIsInkiLCJjbGllbnRZIiwidG9wIiwiZGVmYXVsdFdpZHRoIiwiY2VsbFdpZHRoIiwiZGVmYXVsdEhlaWdodCIsImNlbGxIZWlnaHQiLCJNYXRoIiwiZmxvb3IiLCJyZWN0IiwiaXRlbU9mZnNldExlZnQiLCJ3aWR0aCIsIml0ZW1PZmZzZXRUb3AiLCJoZWlnaHQiLCJwYXRoIiwidmFsdWUiLCJyZW5kZXIiLCJUYWdOYW1lIiwidGFnIiwibmFtZSIsImlubmVyVmFsdWUiLCJ6SW5kZXgiLCJJdGVtIiwiY29ubmVjdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsMkJBQTJCLG1CQUFPLENBQUMsd0VBQTREO0FBQy9GO0FBQ0EsY0FBYyxRQUFTLG9CQUFvQix1QkFBdUIsOEJBQThCLHlDQUF5QyxpQkFBaUIsaUJBQWlCLEVBQUUsNEhBQTRILGdCQUFnQixFQUFFLDJCQUEyQiwyQ0FBMkMsRUFBRSxTQUFTLDZLQUE2SyxZQUFZLGFBQWEsYUFBYSxXQUFXLGVBQWUsTUFBTSxlQUFlLE1BQU0seUVBQXlFLDJCQUEyQixrQ0FBa0MsNkNBQTZDLHFCQUFxQixxQkFBcUIsb0NBQW9DLHNCQUFzQixTQUFTLHFCQUFxQixpREFBaUQsU0FBUyxLQUFLLG1CQUFtQjs7Ozs7Ozs7Ozs7Ozs7QUNGM2hDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUVBOztBQUVBLE1BQU1BLGVBQWUsR0FBSUMsS0FBRCxJQUFXQSxLQUFuQzs7QUFDQSxNQUFNQyxrQkFBa0IsR0FBSUMsUUFBRCxJQUFjO0FBQ3JDLFNBQU87QUFDSEMsaUJBQWEsRUFBRUMsT0FBTyxJQUFJRixRQUFRLENBQUNDLGlGQUFhLENBQUNDLE9BQUQsQ0FBZCxDQUQvQjtBQUVI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OWI0MmFlNDcxOC5jaHVuay5qcyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzXCIpKHRydWUpO1xuLy8gTW9kdWxlXG5leHBvcnRzLnB1c2goW21vZHVsZS5pZCwgXCIuaXRlbS1jb250YWluZXIge1xcbiAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgYm9yZGVyOiAxcHggc29saWQgIzc4Nzg3ODtcXG4gIGJhY2tncm91bmQ6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC45KTtcXG4gIHBhZGRpbmc6IDRweDtcXG4gIGN1cnNvcjogbW92ZTsgfVxcbiAgLml0ZW0tY29udGFpbmVyIGgxLCAuaXRlbS1jb250YWluZXIgaDIsIC5pdGVtLWNvbnRhaW5lciBoMywgLml0ZW0tY29udGFpbmVyIGg0LCAuaXRlbS1jb250YWluZXIgaDUsIC5pdGVtLWNvbnRhaW5lciBoNiB7XFxuICAgIG1hcmdpbjogMDsgfVxcbiAgLml0ZW0tY29udGFpbmVyLmZvY3VzIHtcXG4gICAgYmFja2dyb3VuZDogcmdiYSgyNDAsIDI0MCwgMjQwLCAwLjkpOyB9XFxuXCIsIFwiXCIse1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wiQzovVXNlcnMvZ2Fycmkvc291cmNlL3JlcG9zL3NuYXBmb3JtL2VuZ2luZS9hc3NldHMvc3R5bGUvY29tcG9uZW50cy9pdGVtL2VuZ2luZS9hc3NldHMvc3R5bGUvY29tcG9uZW50cy9pdGVtL2l0ZW0uc2Nzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQTtFQUNJLGtCQUFrQjtFQUNsQix5QkFBeUI7RUFDekIsb0NBQW9DO0VBQ3BDLFlBQVk7RUFDWixZQUFZLEVBQUE7RUFMaEI7SUFRUSxTQUFTLEVBQUE7RUFSakI7SUFZUSxvQ0FBb0MsRUFBQVwiLFwiZmlsZVwiOlwiaXRlbS5zY3NzXCIsXCJzb3VyY2VzQ29udGVudFwiOltcIi5pdGVtLWNvbnRhaW5lciB7XFxyXFxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXHJcXG4gICAgYm9yZGVyOiAxcHggc29saWQgIzc4Nzg3ODtcXHJcXG4gICAgYmFja2dyb3VuZDogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjkpO1xcclxcbiAgICBwYWRkaW5nOiA0cHg7XFxyXFxuICAgIGN1cnNvcjogbW92ZTtcXHJcXG5cXHJcXG4gICAgaDEsIGgyLCBoMywgaDQsIGg1LCBoNiB7XFxyXFxuICAgICAgICBtYXJnaW46IDA7XFxyXFxuICAgIH1cXHJcXG5cXHJcXG4gICAgJi5mb2N1cyB7XFxyXFxuICAgICAgICBiYWNrZ3JvdW5kOiByZ2JhKDI0MCwgMjQwLCAyNDAsIDAuOSk7XFxyXFxuICAgIH1cXHJcXG59XCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG5cbiIsImltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQgfSBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCc7XHJcbmltcG9ydCB7IHN0b3JlIH0gZnJvbSAnLi4vLi4vY29uZmlnL3JlZHV4L3JlZHV4LnN0b3JlJztcclxuaW1wb3J0IHsgdXBkYXRlUHJvamVjdCwgZ0NsaWNrZWQsIHVwZGF0ZVByb2plY3RJdGVtcyB9IGZyb20gJy4uLy4uL2NvbmZpZy9yZWR1eC9yZWR1eC5hY3Rpb25zJztcclxuXHJcbmltcG9ydCAnLi4vLi4vLi4vYXNzZXRzL3N0eWxlL2NvbXBvbmVudHMvaXRlbS9pdGVtLnNjc3MnO1xyXG5cclxuY29uc3QgbWFwU3RhdGVUb1Byb3BzID0gKHN0YXRlKSA9PiBzdGF0ZTtcclxuY29uc3QgbWFwRGlzcGF0Y2hUb1Byb3BzID0gKGRpc3BhdGNoKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHVwZGF0ZVByb2plY3Q6IHBheWxvYWQgPT4gZGlzcGF0Y2godXBkYXRlUHJvamVjdChwYXlsb2FkKSksXHJcbiAgICAgICAgZ0NsaWNrZWQ6IHBheWxvYWQgPT4gZGlzcGF0Y2goZ0NsaWNrZWQocGF5bG9hZCkpLFxyXG4gICAgICAgIHVwZGF0ZVByb2plY3RJdGVtczogcGF5bG9hZCA9PiBkaXNwYXRjaCh1cGRhdGVQcm9qZWN0SXRlbXMocGF5bG9hZCkpXHJcbiAgICB9O1xyXG59O1xyXG5cclxuY29uc3QgZGVmYXVsdEl0ZW1Db250YWluZXJDbGFzc05hbWUgPSAnaXRlbS1jb250YWluZXInO1xyXG5cclxuY2xhc3MgSXRlbUNvbXBvbmVudCBleHRlbmRzIENvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuXHJcbiAgICAgICAgY29uc3QgeyB3b3Jrc3BhY2UgfSA9IHN0b3JlLmdldFN0YXRlKCk7XHJcbiAgICAgICAgY29uc3QgcHJvamVjdCA9IHdvcmtzcGFjZS5wcm9qZWN0O1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XHJcbiAgICAgICAgICAgIGluZm86IHByb2plY3QuaXRlbXNbdGhpcy5wcm9wcy51aWRdLFxyXG4gICAgICAgICAgICBpdGVtQ29udGFpbmVyQ2xhc3NOYW1lOiBkZWZhdWx0SXRlbUNvbnRhaW5lckNsYXNzTmFtZSxcclxuICAgICAgICAgICAgZHJhZ2dpbmc6IGZhbHNlLFxyXG4gICAgICAgICAgICBkcmFnT2Zmc2V0WDogMCxcclxuICAgICAgICAgICAgZHJhZ09mZnNldFk6IDBcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmhhbmRsZUl0ZW1Db250YWluZXJDbGljayA9IHRoaXMuaGFuZGxlSXRlbUNvbnRhaW5lckNsaWNrLmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVPdXRzaWRlQ2xpY2sgPSB0aGlzLmhhbmRsZU91dHNpZGVDbGljay5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuZHJhZyA9IHRoaXMuZHJhZy5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlRHJhZ1N0YXJ0ID0gdGhpcy5oYW5kbGVEcmFnU3RhcnQuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLmhhbmRsZURyYWcgPSB0aGlzLmhhbmRsZURyYWcuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLmhhbmRsZURyYWdFbmQgPSB0aGlzLmhhbmRsZURyYWdFbmQuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLm1vdXNlbW92ZSA9IHRoaXMubW91c2Vtb3ZlLmJpbmQodGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgY29tcG9uZW50V2lsbE1vdW50KCkge1xyXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMuaGFuZGxlT3V0c2lkZUNsaWNrLCBmYWxzZSk7XHJcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5tb3VzZW1vdmUsIGZhbHNlKTtcclxuICAgIH1cclxuXHJcbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcclxuICAgICAgICB0aGlzLmRyYWdJbWcgPSBuZXcgSW1hZ2UoMCwwKTtcclxuICAgICAgICB0aGlzLmRyYWdJbWcuc3JjID0gJ2RhdGE6aW1hZ2UvZ2lmO2Jhc2U2NCxSMGxHT0RsaEFRQUJBSUFBQUFBQUFQLy8veUg1QkFFQUFBQUFMQUFBQUFBQkFBRUFBQUlCUkFBNyc7XHJcbiAgICB9XHJcblxyXG4gICAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XHJcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgdGhpcy5oYW5kbGVPdXRzaWRlQ2xpY2ssIGZhbHNlKTtcclxuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLm1vdXNlbW91dmUsIGZhbHNlKTtcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVPdXRzaWRlQ2xpY2soZSkge1xyXG4gICAgICAgIGlmICh0aGlzLml0ZW0uY29udGFpbnMoZS50YXJnZXQpKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5zdGF0ZSwge1xyXG4gICAgICAgICAgICBpdGVtQ29udGFpbmVyQ2xhc3NOYW1lOiBkZWZhdWx0SXRlbUNvbnRhaW5lckNsYXNzTmFtZVxyXG4gICAgICAgIH0pKTtcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVJdGVtQ29udGFpbmVyQ2xpY2soKSB7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZShPYmplY3QuYXNzaWduKHt9LCB0aGlzLnN0YXRlLCB7XHJcbiAgICAgICAgICAgIGl0ZW1Db250YWluZXJDbGFzc05hbWU6IGRlZmF1bHRJdGVtQ29udGFpbmVyQ2xhc3NOYW1lICsgJyBmb2N1cydcclxuICAgICAgICB9KSk7XHJcblxyXG4gICAgICAgIGNvbnN0IHsgd29ya3NwYWNlIH0gPSBzdG9yZS5nZXRTdGF0ZSgpO1xyXG4gICAgICAgIHZhciBpdGVtcyA9IHdvcmtzcGFjZS5wcm9qZWN0Lml0ZW1zO1xyXG5cclxuICAgICAgICBjb25zdCBjdXJyZW50X3ogPSBpdGVtc1t0aGlzLnByb3BzLnVpZF0uejtcclxuICAgICAgICB2YXIgdG9wX3ogPSBjdXJyZW50X3o7XHJcbiAgICAgICAgZm9yICh2YXIga2V5IGluIGl0ZW1zKSB7XHJcbiAgICAgICAgICAgIGlmIChrZXkgIT09IHRoaXMucHJvcHMudWlkICYmIGl0ZW1zW2tleV0ueiA+IGN1cnJlbnRfeikge1xyXG4gICAgICAgICAgICAgICAgaWYgKGl0ZW1zW2tleV0ueiA+IHRvcF96KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdG9wX3ogPSBpdGVtc1trZXldLno7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpdGVtc1trZXldLnogLT0gMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpdGVtc1t0aGlzLnByb3BzLnVpZF0ueiA9IHRvcF96O1xyXG5cclxuICAgICAgICB0aGlzLnByb3BzLnVwZGF0ZVByb2plY3RJdGVtcyhpdGVtcyk7XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlRHJhZ1N0YXJ0KGUpIHtcclxuICAgICAgICB0aGlzLmhhbmRsZUl0ZW1Db250YWluZXJDbGljaygpO1xyXG5cclxuICAgICAgICB0aGlzLnByb3BzLmdDbGlja2VkKHtcclxuICAgICAgICAgICAgZ0NsYXNzTGlzdDogJ2dpZCBoaWRkZW4nXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGUuZGF0YVRyYW5zZmVyLnNldERyYWdJbWFnZSh0aGlzLmRyYWdJbWcsIDAsIDApO1xyXG4gICAgICAgIGUudGFyZ2V0LnN0eWxlLmN1cnNvciA9ICdtb3ZlJztcclxuXHJcbiAgICAgICAgY29uc3QgeyB3b3Jrc3BhY2UgfSA9IHN0b3JlLmdldFN0YXRlKCk7XHJcbiAgICAgICAgY29uc3QgY29udGFpbmVyID0gd29ya3NwYWNlLnByb2plY3QuY29udGFpbmVyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgICAgIGNvbnN0IGl0ZW0gPSB3b3Jrc3BhY2UucHJvamVjdC5pdGVtc1t0aGlzLnByb3BzLnVpZF07XHJcblxyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5zdGF0ZSwge1xyXG4gICAgICAgICAgICBkcmFnZ2luZzogdHJ1ZSxcclxuICAgICAgICAgICAgZHJhZ09mZnNldFg6IGl0ZW0ueCAtIChlLmNsaWVudFggLSBjb250YWluZXIubGVmdCksXHJcbiAgICAgICAgICAgIGRyYWdPZmZzZXRZOiBpdGVtLnkgLSAoZS5jbGllbnRZIC0gY29udGFpbmVyLnRvcClcclxuICAgICAgICB9KSk7XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlRHJhZyhlKSB7XHJcbiAgICAgICAgdGhpcy5kcmFnKGUpO1xyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZURyYWdFbmQoZSkge1xyXG4gICAgICAgIHRoaXMuZHJhZyhlKTtcclxuXHJcbiAgICAgICAgdGhpcy5wcm9wcy5nQ2xpY2tlZCh7XHJcbiAgICAgICAgICAgIGdDbGFzc0xpc3Q6ICdnaWQnXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5zdGF0ZSwge1xyXG4gICAgICAgICAgICBkcmFnZ2luZzogZmFsc2VcclxuICAgICAgICB9KSk7XHJcbiAgICB9XHJcblxyXG4gICAgZHJhZyhlKSB7XHJcbiAgICAgICAgY29uc3QgeyBkcmFnT2Zmc2V0WCwgZHJhZ09mZnNldFkgfSA9IHRoaXMuc3RhdGU7XHJcbiAgICAgICAgY29uc3QgeyB3b3Jrc3BhY2UgfSA9IHN0b3JlLmdldFN0YXRlKCk7XHJcbiAgICAgICAgY29uc3QgY29udGFpbmVyID0gd29ya3NwYWNlLnByb2plY3QuY29udGFpbmVyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgICAgIGNvbnN0IGRlZmF1bHRXaWR0aCA9IHdvcmtzcGFjZS5wcm9qZWN0LmNlbGxXaWR0aDtcclxuICAgICAgICBjb25zdCBkZWZhdWx0SGVpZ2h0ID0gd29ya3NwYWNlLnByb2plY3QuY2VsbEhlaWdodDtcclxuXHJcbiAgICAgICAgY29uc3QgeCA9IE1hdGguZmxvb3IoKGUuY2xpZW50WCAtIChjb250YWluZXIubGVmdCAtIGRyYWdPZmZzZXRYKSkgLyBkZWZhdWx0V2lkdGgpICogZGVmYXVsdFdpZHRoO1xyXG4gICAgICAgIGNvbnN0IHkgPSBNYXRoLmZsb29yKChlLmNsaWVudFkgLSAoY29udGFpbmVyLnRvcCAtIGRyYWdPZmZzZXRZKSkgLyBkZWZhdWx0SGVpZ2h0KSAqIGRlZmF1bHRIZWlnaHQ7XHJcbiAgICAgICAgdmFyIGxlZnQgPSB4ID4gMCA/IHggOiAwO1xyXG4gICAgICAgIHZhciB0b3AgPSB5ID4gMCA/IHkgOiAwO1xyXG5cclxuICAgICAgICBjb25zdCByZWN0ID0gdGhpcy5pdGVtLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgICAgIGNvbnN0IGl0ZW1PZmZzZXRMZWZ0ID0gbGVmdCArIHJlY3Qud2lkdGg7XHJcbiAgICAgICAgY29uc3QgaXRlbU9mZnNldFRvcCA9IHRvcCArIHJlY3QuaGVpZ2h0O1xyXG5cclxuICAgICAgICBpZiAoaXRlbU9mZnNldExlZnQgPiBjb250YWluZXIud2lkdGgpIHtcclxuICAgICAgICAgICAgbGVmdCA9IE1hdGguZmxvb3IoKGNvbnRhaW5lci53aWR0aCAtIHJlY3Qud2lkdGgpIC8gZGVmYXVsdFdpZHRoKSAqIGRlZmF1bHRXaWR0aDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChpdGVtT2Zmc2V0VG9wID4gY29udGFpbmVyLmhlaWdodCkge1xyXG4gICAgICAgICAgICB0b3AgPSBNYXRoLmZsb29yKChjb250YWluZXIuaGVpZ2h0IC0gcmVjdC5oZWlnaHQpIC8gZGVmYXVsdEhlaWdodCkgKiBkZWZhdWx0SGVpZ2h0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgaW5mbyA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuc3RhdGUuaW5mbywge1xyXG4gICAgICAgICAgICB4OiBsZWZ0LFxyXG4gICAgICAgICAgICB5OiB0b3BcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5wcm9wcy51cGRhdGVQcm9qZWN0KHtcclxuICAgICAgICAgICAgcGF0aDogdGhpcy5wcm9wcy51aWQsXHJcbiAgICAgICAgICAgIHZhbHVlOiBpbmZvXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5zdGF0ZSwge1xyXG4gICAgICAgICAgICBpbmZvXHJcbiAgICAgICAgfSkpO1xyXG4gICAgfVxyXG5cclxuICAgIG1vdXNlbW92ZShlKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUuZHJhZ2dpbmcpIHtcclxuICAgICAgICAgICAgZS50YXJnZXQuc3R5bGUuY3Vyc29yID0gJ21vdmUnO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyBpdGVtQ29udGFpbmVyQ2xhc3NOYW1lIH0gPSB0aGlzLnN0YXRlO1xyXG4gICAgICAgIGNvbnN0IFRhZ05hbWUgPSBgJHt0aGlzLnByb3BzLnRhZy5uYW1lfWA7XHJcblxyXG4gICAgICAgIHZhciB0YWcgPSBudWxsO1xyXG4gICAgICAgIGlmICh0aGlzLnByb3BzLnRhZy5pbm5lclZhbHVlKSB7XHJcbiAgICAgICAgICAgIHRhZyA9ICg8VGFnTmFtZT57dGhpcy5wcm9wcy50YWcudmFsdWV9PC9UYWdOYW1lPilcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0YWcgPSAoPFRhZ05hbWUgdmFsdWU9e3RoaXMucHJvcHMudGFnLnZhbHVlfT48L1RhZ05hbWU+KVxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e2l0ZW1Db250YWluZXJDbGFzc05hbWV9XHJcbiAgICAgICAgICAgICAgICByZWY9e2l0ZW0gPT4gdGhpcy5pdGVtID0gaXRlbX1cclxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuaGFuZGxlSXRlbUNvbnRhaW5lckNsaWNrfVxyXG4gICAgICAgICAgICAgICAgZHJhZ2dhYmxlPXt0cnVlfVxyXG4gICAgICAgICAgICAgICAgb25EcmFnU3RhcnQ9e3RoaXMuaGFuZGxlRHJhZ1N0YXJ0fVxyXG4gICAgICAgICAgICAgICAgb25EcmFnPXt0aGlzLmhhbmRsZURyYWd9XHJcbiAgICAgICAgICAgICAgICBvbkRyYWdFbmQ9e3RoaXMuaGFuZGxlRHJhZ0VuZH1cclxuICAgICAgICAgICAgICAgIHN0eWxlPXt7IFxyXG4gICAgICAgICAgICAgICAgICAgIHRvcDogdGhpcy5wcm9wcy55LCBcclxuICAgICAgICAgICAgICAgICAgICBsZWZ0OiB0aGlzLnByb3BzLngsXHJcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IHRoaXMucHJvcHMud2lkdGgsXHJcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLnByb3BzLmhlaWdodCxcclxuICAgICAgICAgICAgICAgICAgICB6SW5kZXg6IHRoaXMucHJvcHMueiArIDEwMFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9PlxyXG4gICAgICAgICAgICAgICAge3RhZ31cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgSXRlbSA9IGNvbm5lY3QobWFwU3RhdGVUb1Byb3BzLCBtYXBEaXNwYXRjaFRvUHJvcHMpKEl0ZW1Db21wb25lbnQpO1xyXG5leHBvcnQgZGVmYXVsdCBJdGVtOyIsIlxudmFyIGNvbnRlbnQgPSByZXF1aXJlKFwiISEuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcz8/cmVmLS02LTEhLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2xpYi9sb2FkZXIuanM/P3JlZi0tNi0yIS4vaXRlbS5zY3NzXCIpO1xuXG5pZih0eXBlb2YgY29udGVudCA9PT0gJ3N0cmluZycpIGNvbnRlbnQgPSBbW21vZHVsZS5pZCwgY29udGVudCwgJyddXTtcblxudmFyIHRyYW5zZm9ybTtcbnZhciBpbnNlcnRJbnRvO1xuXG5cblxudmFyIG9wdGlvbnMgPSB7XCJobXJcIjp0cnVlfVxuXG5vcHRpb25zLnRyYW5zZm9ybSA9IHRyYW5zZm9ybVxub3B0aW9ucy5pbnNlcnRJbnRvID0gdW5kZWZpbmVkO1xuXG52YXIgdXBkYXRlID0gcmVxdWlyZShcIiEuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2xpYi9hZGRTdHlsZXMuanNcIikoY29udGVudCwgb3B0aW9ucyk7XG5cbmlmKGNvbnRlbnQubG9jYWxzKSBtb2R1bGUuZXhwb3J0cyA9IGNvbnRlbnQubG9jYWxzO1xuXG5pZihtb2R1bGUuaG90KSB7XG5cdG1vZHVsZS5ob3QuYWNjZXB0KFwiISEuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcz8/cmVmLS02LTEhLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2xpYi9sb2FkZXIuanM/P3JlZi0tNi0yIS4vaXRlbS5zY3NzXCIsIGZ1bmN0aW9uKCkge1xuXHRcdHZhciBuZXdDb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanM/P3JlZi0tNi0xIS4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9saWIvbG9hZGVyLmpzPz9yZWYtLTYtMiEuL2l0ZW0uc2Nzc1wiKTtcblxuXHRcdGlmKHR5cGVvZiBuZXdDb250ZW50ID09PSAnc3RyaW5nJykgbmV3Q29udGVudCA9IFtbbW9kdWxlLmlkLCBuZXdDb250ZW50LCAnJ11dO1xuXG5cdFx0dmFyIGxvY2FscyA9IChmdW5jdGlvbihhLCBiKSB7XG5cdFx0XHR2YXIga2V5LCBpZHggPSAwO1xuXG5cdFx0XHRmb3Ioa2V5IGluIGEpIHtcblx0XHRcdFx0aWYoIWIgfHwgYVtrZXldICE9PSBiW2tleV0pIHJldHVybiBmYWxzZTtcblx0XHRcdFx0aWR4Kys7XG5cdFx0XHR9XG5cblx0XHRcdGZvcihrZXkgaW4gYikgaWR4LS07XG5cblx0XHRcdHJldHVybiBpZHggPT09IDA7XG5cdFx0fShjb250ZW50LmxvY2FscywgbmV3Q29udGVudC5sb2NhbHMpKTtcblxuXHRcdGlmKCFsb2NhbHMpIHRocm93IG5ldyBFcnJvcignQWJvcnRpbmcgQ1NTIEhNUiBkdWUgdG8gY2hhbmdlZCBjc3MtbW9kdWxlcyBsb2NhbHMuJyk7XG5cblx0XHR1cGRhdGUobmV3Q29udGVudCk7XG5cdH0pO1xuXG5cdG1vZHVsZS5ob3QuZGlzcG9zZShmdW5jdGlvbigpIHsgdXBkYXRlKCk7IH0pO1xufSJdLCJzb3VyY2VSb290IjoiIn0=