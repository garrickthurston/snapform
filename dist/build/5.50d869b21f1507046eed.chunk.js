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
      container: this.props.container.getBoundingClientRect(),
      defaultWidth: project.cellWidth,
      defaultHeight: project.cellHeight,
      info: project.items[this.props.uid],
      itemContainerClassName: defaultItemContainerClassName
    };
    this.handleItemContainerClick = this.handleItemContainerClick.bind(this);
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
    this.drag = this.drag.bind(this);
    this.handleDragStart = this.handleDragStart.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
    this.handleDragEnd = this.handleDragEnd.bind(this);
  }

  componentWillMount() {
    document.addEventListener('mousedown', this.handleOutsideClick, false);
  }

  componentDidMount() {
    this.dragImg = new Image(0, 0);
    this.dragImg.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleOutsideClick, false);
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
  }

  handleDrag(e) {
    this.drag(e);
  }

  handleDragEnd(e) {
    this.drag(e);
    this.props.gClicked({
      gClassList: 'gid'
    });
  }

  drag(e) {
    const x = Math.floor((e.clientX - this.state.container.left) / this.state.defaultWidth) * this.state.defaultWidth;
    const y = Math.floor((e.clientY - this.state.container.top) / this.state.defaultHeight) * this.state.defaultHeight;
    var left = x > 0 ? x : 0;
    var top = y > 0 ? y : 0;
    const rect = this.item.getBoundingClientRect();
    const itemOffsetLeft = left + rect.width;
    const itemOffsetTop = top + rect.height;

    if (itemOffsetLeft > this.state.container.width) {
      left = Math.floor((this.state.container.width - rect.width) / this.state.defaultWidth) * this.state.defaultWidth;
    }

    if (itemOffsetTop > this.state.container.height) {
      top = Math.floor((this.state.container.height - rect.height) / this.state.defaultHeight) * this.state.defaultHeight;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9lbmdpbmUvYXNzZXRzL3N0eWxlL2NvbXBvbmVudHMvaXRlbS9pdGVtLnNjc3MiLCJ3ZWJwYWNrOi8vLy4vZW5naW5lL3NyYy9jb21wb25lbnRzL2l0ZW0vaXRlbS5jb21wb25lbnQuanMiLCJ3ZWJwYWNrOi8vLy4vZW5naW5lL2Fzc2V0cy9zdHlsZS9jb21wb25lbnRzL2l0ZW0vaXRlbS5zY3NzP2M3ODciXSwibmFtZXMiOlsibWFwU3RhdGVUb1Byb3BzIiwic3RhdGUiLCJtYXBEaXNwYXRjaFRvUHJvcHMiLCJkaXNwYXRjaCIsInVwZGF0ZVByb2plY3QiLCJwYXlsb2FkIiwiZ0NsaWNrZWQiLCJ1cGRhdGVQcm9qZWN0SXRlbXMiLCJkZWZhdWx0SXRlbUNvbnRhaW5lckNsYXNzTmFtZSIsIkl0ZW1Db21wb25lbnQiLCJDb21wb25lbnQiLCJjb25zdHJ1Y3RvciIsInByb3BzIiwid29ya3NwYWNlIiwic3RvcmUiLCJnZXRTdGF0ZSIsInByb2plY3QiLCJjb250YWluZXIiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJkZWZhdWx0V2lkdGgiLCJjZWxsV2lkdGgiLCJkZWZhdWx0SGVpZ2h0IiwiY2VsbEhlaWdodCIsImluZm8iLCJpdGVtcyIsInVpZCIsIml0ZW1Db250YWluZXJDbGFzc05hbWUiLCJoYW5kbGVJdGVtQ29udGFpbmVyQ2xpY2siLCJiaW5kIiwiaGFuZGxlT3V0c2lkZUNsaWNrIiwiZHJhZyIsImhhbmRsZURyYWdTdGFydCIsImhhbmRsZURyYWciLCJoYW5kbGVEcmFnRW5kIiwiY29tcG9uZW50V2lsbE1vdW50IiwiZG9jdW1lbnQiLCJhZGRFdmVudExpc3RlbmVyIiwiY29tcG9uZW50RGlkTW91bnQiLCJkcmFnSW1nIiwiSW1hZ2UiLCJzcmMiLCJjb21wb25lbnRXaWxsVW5tb3VudCIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJlIiwiaXRlbSIsImNvbnRhaW5zIiwidGFyZ2V0Iiwic2V0U3RhdGUiLCJPYmplY3QiLCJhc3NpZ24iLCJjdXJyZW50X3oiLCJ6IiwidG9wX3oiLCJrZXkiLCJnQ2xhc3NMaXN0IiwiZGF0YVRyYW5zZmVyIiwic2V0RHJhZ0ltYWdlIiwieCIsIk1hdGgiLCJmbG9vciIsImNsaWVudFgiLCJsZWZ0IiwieSIsImNsaWVudFkiLCJ0b3AiLCJyZWN0IiwiaXRlbU9mZnNldExlZnQiLCJ3aWR0aCIsIml0ZW1PZmZzZXRUb3AiLCJoZWlnaHQiLCJwYXRoIiwidmFsdWUiLCJyZW5kZXIiLCJUYWdOYW1lIiwidGFnIiwibmFtZSIsImlubmVyVmFsdWUiLCJ6SW5kZXgiLCJJdGVtIiwiY29ubmVjdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsMkJBQTJCLG1CQUFPLENBQUMsd0VBQTREO0FBQy9GO0FBQ0EsY0FBYyxRQUFTLG9CQUFvQix1QkFBdUIsOEJBQThCLHlDQUF5QyxpQkFBaUIsaUJBQWlCLEVBQUUsNEhBQTRILGdCQUFnQixFQUFFLDJCQUEyQiwyQ0FBMkMsRUFBRSxTQUFTLDZLQUE2SyxZQUFZLGFBQWEsYUFBYSxXQUFXLGVBQWUsTUFBTSxlQUFlLE1BQU0seUVBQXlFLDJCQUEyQixrQ0FBa0MsNkNBQTZDLHFCQUFxQixxQkFBcUIsb0NBQW9DLHNCQUFzQixTQUFTLHFCQUFxQixpREFBaUQsU0FBUyxLQUFLLG1CQUFtQjs7Ozs7Ozs7Ozs7Ozs7QUNGM2hDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUVBOztBQUVBLE1BQU1BLGVBQWUsR0FBSUMsS0FBRCxJQUFXQSxLQUFuQzs7QUFDQSxNQUFNQyxrQkFBa0IsR0FBSUMsUUFBRCxJQUFjO0FBQ3JDLFNBQU87QUFDSEMsaUJBQWEsRUFBRUMsT0FBTyxJQUFJRixRQUFRLENBQUNDLGlGQUFhLENBQUNDLE9BQUQsQ0FBZCxDQUQvQjtBQUVIQyxZQUFRLEVBQUVELE9BQU8sSUFBSUYsUUFBUSxDQUFDRyw0RUFBUSxDQUFDRCxPQUFELENBQVQsQ0FGMUI7QUFHSEUsc0JBQWtCLEVBQUVG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LHNCQUFoQjtBQUNJLFNBQUcsRUFBRWtCLElBQUksSUFBSSxLQUFLQSxJQUFMLEdBQVlBLElBRDdCO0FBRUksYUFBTyxFQUFFLEtBQUtqQix3QkFGbEI7QUFHSSxlQUFTLEVBQUUsSUFIZjtBQUlJLGlCQUFXLEVBQUUsS0FBS0ksZUFKdEI7QUFLSSxZQUFNLEVBQUUsS0FBS0MsVUFMakI7QUFNSSxlQUFTLEVBQUUsS0FBS0MsYUFOcEI7QUFPSSxXQUFLLEVBQUU7QUFDSCtCLFdBQUcsRUFBRSxLQUFLcEQsS0FBTCxDQUFXa0QsQ0FEYjtBQUVIRCxZQUFJLEVBQUUsS0FBS2pELEtBQUwsQ0FBVzZDLENBRmQ7QUFHSFUsYUFBSyxFQUFFLEtBQUt2RCxLQUFMLENBQVd1RCxLQUhmO0FBSUhFLGNBQU0sRUFBRSxLQUFLekQsS0FBTCxDQUFXeUQsTUFKaEI7QUFLSFEsY0FBTSxFQUFFLEtBQUtqRSxLQUFMLENBQVd1QyxDQUFYLEdBQWU7QUFMcEI7QUFQWCxPQWVLdUIsR0FmTCxDQURKO0FBbUJIOztBQTNKaUM7O0FBOEp0QyxNQUFNSSxJQUFJLEdBQUdDLDJEQUFPLENBQUMvRSxlQUFELEVBQWtCRSxrQkFBbEIsQ0FBUCxDQUE2Q08sYUFBN0MsQ0FBYjtBQUNlcUUsbUVBQWYsRTs7Ozs7Ozs7Ozs7O0FDaExBLGNBQWMsbUJBQU8sQ0FBQyx1SkFBNEk7O0FBRWxLLDRDQUE0QyxRQUFTOztBQUVyRDtBQUNBOzs7O0FBSUEsZUFBZTs7QUFFZjtBQUNBOztBQUVBLGFBQWEsbUJBQU8sQ0FBQyx1RUFBNEQ7O0FBRWpGOztBQUVBLEdBQUcsS0FBVSxFQUFFLEUiLCJmaWxlIjoiYnVpbGQvNS41MGQ4NjliMjFmMTUwNzA0NmVlZC5jaHVuay5qcyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzXCIpKHRydWUpO1xuLy8gTW9kdWxlXG5leHBvcnRzLnB1c2goW21vZHVsZS5pZCwgXCIuaXRlbS1jb250YWluZXIge1xcbiAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgYm9yZGVyOiAxcHggc29saWQgIzc4Nzg3ODtcXG4gIGJhY2tncm91bmQ6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC45KTtcXG4gIHBhZGRpbmc6IDRweDtcXG4gIGN1cnNvcjogbW92ZTsgfVxcbiAgLml0ZW0tY29udGFpbmVyIGgxLCAuaXRlbS1jb250YWluZXIgaDIsIC5pdGVtLWNvbnRhaW5lciBoMywgLml0ZW0tY29udGFpbmVyIGg0LCAuaXRlbS1jb250YWluZXIgaDUsIC5pdGVtLWNvbnRhaW5lciBoNiB7XFxuICAgIG1hcmdpbjogMDsgfVxcbiAgLml0ZW0tY29udGFpbmVyLmZvY3VzIHtcXG4gICAgYmFja2dyb3VuZDogcmdiYSgyNDAsIDI0MCwgMjQwLCAwLjkpOyB9XFxuXCIsIFwiXCIse1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wiQzovVXNlcnMvZ2Fycmkvc291cmNlL3JlcG9zL3NuYXBmb3JtL2VuZ2luZS9hc3NldHMvc3R5bGUvY29tcG9uZW50cy9pdGVtL2VuZ2luZS9hc3NldHMvc3R5bGUvY29tcG9uZW50cy9pdGVtL2l0ZW0uc2Nzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQTtFQUNJLGtCQUFrQjtFQUNsQix5QkFBeUI7RUFDekIsb0NBQW9DO0VBQ3BDLFlBQVk7RUFDWixZQUFZLEVBQUE7RUFMaEI7SUFRUSxTQUFTLEVBQUE7RUFSakI7SUFZUSxvQ0FBb0MsRUFBQVwiLFwiZmlsZVwiOlwiaXRlbS5zY3NzXCIsXCJzb3VyY2VzQ29udGVudFwiOltcIi5pdGVtLWNvbnRhaW5lciB7XFxyXFxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXHJcXG4gICAgYm9yZGVyOiAxcHggc29saWQgIzc4Nzg3ODtcXHJcXG4gICAgYmFja2dyb3VuZDogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjkpO1xcclxcbiAgICBwYWRkaW5nOiA0cHg7XFxyXFxuICAgIGN1cnNvcjogbW92ZTtcXHJcXG5cXHJcXG4gICAgaDEsIGgyLCBoMywgaDQsIGg1LCBoNiB7XFxyXFxuICAgICAgICBtYXJnaW46IDA7XFxyXFxuICAgIH1cXHJcXG5cXHJcXG4gICAgJi5mb2N1cyB7XFxyXFxuICAgICAgICBiYWNrZ3JvdW5kOiByZ2JhKDI0MCwgMjQwLCAyNDAsIDAuOSk7XFxyXFxuICAgIH1cXHJcXG59XCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG5cbiIsImltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQgfSBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCc7XHJcbmltcG9ydCB7IHN0b3JlIH0gZnJvbSAnLi4vLi4vY29uZmlnL3JlZHV4L3JlZHV4LnN0b3JlJztcclxuaW1wb3J0IHsgdXBkYXRlUHJvamVjdCwgZ0NsaWNrZWQsIHVwZGF0ZVByb2plY3RJdGVtcyB9IGZyb20gJy4uLy4uL2NvbmZpZy9yZWR1eC9yZWR1eC5hY3Rpb25zJztcclxuXHJcbmltcG9ydCAnLi4vLi4vLi4vYXNzZXRzL3N0eWxlL2NvbXBvbmVudHMvaXRlbS9pdGVtLnNjc3MnO1xyXG5cclxuY29uc3QgbWFwU3RhdGVUb1Byb3BzID0gKHN0YXRlKSA9PiBzdGF0ZTtcclxuY29uc3QgbWFwRGlzcGF0Y2hUb1Byb3BzID0gKGRpc3BhdGNoKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHVwZGF0ZVByb2plY3Q6IHBheWxvYWQgPT4gZGlzcGF0Y2godXBkYXRlUHJvamVjdChwYXlsb2FkKSksXHJcbiAgICAgICAgZ0NsaWNrZWQ6IHBheWxvYWQgPT4gZGlzcGF0Y2goZ0NsaWNrZWQocGF5bG9hZCkpLFxyXG4gICAgICAgIHVwZGF0ZVByb2plY3RJdGVtczogcGF5bG9hZCA9PiBkaXNwYXRjaCh1cGRhdGVQcm9qZWN0SXRlbXMocGF5bG9hZCkpXHJcbiAgICB9O1xyXG59O1xyXG5cclxuY29uc3QgZGVmYXVsdEl0ZW1Db250YWluZXJDbGFzc05hbWUgPSAnaXRlbS1jb250YWluZXInO1xyXG5cclxuY2xhc3MgSXRlbUNvbXBvbmVudCBleHRlbmRzIENvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgICAgICBcclxuICAgICAgICBjb25zdCB7IHdvcmtzcGFjZSB9ID0gc3RvcmUuZ2V0U3RhdGUoKTtcclxuICAgICAgICBjb25zdCBwcm9qZWN0ID0gd29ya3NwYWNlLnByb2plY3Q7XHJcblxyXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XHJcbiAgICAgICAgICAgIGNvbnRhaW5lcjogdGhpcy5wcm9wcy5jb250YWluZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCksXHJcbiAgICAgICAgICAgIGRlZmF1bHRXaWR0aDogcHJvamVjdC5jZWxsV2lkdGgsXHJcbiAgICAgICAgICAgIGRlZmF1bHRIZWlnaHQ6IHByb2plY3QuY2VsbEhlaWdodCxcclxuICAgICAgICAgICAgaW5mbzogcHJvamVjdC5pdGVtc1t0aGlzLnByb3BzLnVpZF0sXHJcbiAgICAgICAgICAgIGl0ZW1Db250YWluZXJDbGFzc05hbWU6IGRlZmF1bHRJdGVtQ29udGFpbmVyQ2xhc3NOYW1lXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5oYW5kbGVJdGVtQ29udGFpbmVyQ2xpY2sgPSB0aGlzLmhhbmRsZUl0ZW1Db250YWluZXJDbGljay5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlT3V0c2lkZUNsaWNrID0gdGhpcy5oYW5kbGVPdXRzaWRlQ2xpY2suYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLmRyYWcgPSB0aGlzLmRyYWcuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLmhhbmRsZURyYWdTdGFydCA9IHRoaXMuaGFuZGxlRHJhZ1N0YXJ0LmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVEcmFnID0gdGhpcy5oYW5kbGVEcmFnLmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVEcmFnRW5kID0gdGhpcy5oYW5kbGVEcmFnRW5kLmJpbmQodGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgY29tcG9uZW50V2lsbE1vdW50KCkge1xyXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMuaGFuZGxlT3V0c2lkZUNsaWNrLCBmYWxzZSk7XHJcbiAgICB9XHJcblxyXG4gICAgY29tcG9uZW50RGlkTW91bnQoKSB7XHJcbiAgICAgICAgdGhpcy5kcmFnSW1nID0gbmV3IEltYWdlKDAsMCk7XHJcbiAgICAgICAgdGhpcy5kcmFnSW1nLnNyYyA9ICdkYXRhOmltYWdlL2dpZjtiYXNlNjQsUjBsR09EbGhBUUFCQUlBQUFBQUFBUC8vL3lINUJBRUFBQUFBTEFBQUFBQUJBQUVBQUFJQlJBQTcnO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xyXG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMuaGFuZGxlT3V0c2lkZUNsaWNrLCBmYWxzZSk7XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlT3V0c2lkZUNsaWNrKGUpIHtcclxuICAgICAgICBpZiAodGhpcy5pdGVtLmNvbnRhaW5zKGUudGFyZ2V0KSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnNldFN0YXRlKE9iamVjdC5hc3NpZ24oe30sIHRoaXMuc3RhdGUsIHtcclxuICAgICAgICAgICAgaXRlbUNvbnRhaW5lckNsYXNzTmFtZTogZGVmYXVsdEl0ZW1Db250YWluZXJDbGFzc05hbWVcclxuICAgICAgICB9KSk7XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlSXRlbUNvbnRhaW5lckNsaWNrKCkge1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5zdGF0ZSwge1xyXG4gICAgICAgICAgICBpdGVtQ29udGFpbmVyQ2xhc3NOYW1lOiBkZWZhdWx0SXRlbUNvbnRhaW5lckNsYXNzTmFtZSArICcgZm9jdXMnXHJcbiAgICAgICAgfSkpO1xyXG5cclxuICAgICAgICBjb25zdCB7IHdvcmtzcGFjZSB9ID0gc3RvcmUuZ2V0U3RhdGUoKTtcclxuICAgICAgICB2YXIgaXRlbXMgPSB3b3Jrc3BhY2UucHJvamVjdC5pdGVtcztcclxuXHJcbiAgICAgICAgY29uc3QgY3VycmVudF96ID0gaXRlbXNbdGhpcy5wcm9wcy51aWRdLno7XHJcbiAgICAgICAgdmFyIHRvcF96ID0gY3VycmVudF96O1xyXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBpdGVtcykge1xyXG4gICAgICAgICAgICBpZiAoa2V5ICE9PSB0aGlzLnByb3BzLnVpZCAmJiBpdGVtc1trZXldLnogPiBjdXJyZW50X3opIHtcclxuICAgICAgICAgICAgICAgIGlmIChpdGVtc1trZXldLnogPiB0b3Bfeikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRvcF96ID0gaXRlbXNba2V5XS56O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaXRlbXNba2V5XS56IC09IDE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaXRlbXNbdGhpcy5wcm9wcy51aWRdLnogPSB0b3BfejtcclxuXHJcbiAgICAgICAgdGhpcy5wcm9wcy51cGRhdGVQcm9qZWN0SXRlbXMoaXRlbXMpO1xyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZURyYWdTdGFydChlKSB7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVJdGVtQ29udGFpbmVyQ2xpY2soKTtcclxuXHJcbiAgICAgICAgdGhpcy5wcm9wcy5nQ2xpY2tlZCh7XHJcbiAgICAgICAgICAgIGdDbGFzc0xpc3Q6ICdnaWQgaGlkZGVuJ1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBlLmRhdGFUcmFuc2Zlci5zZXREcmFnSW1hZ2UodGhpcy5kcmFnSW1nLCAwLCAwKTtcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVEcmFnKGUpIHtcclxuICAgICAgICB0aGlzLmRyYWcoZSk7XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlRHJhZ0VuZChlKSB7XHJcbiAgICAgICAgdGhpcy5kcmFnKGUpO1xyXG5cclxuICAgICAgICB0aGlzLnByb3BzLmdDbGlja2VkKHtcclxuICAgICAgICAgICAgZ0NsYXNzTGlzdDogJ2dpZCdcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBkcmFnKGUpIHtcclxuICAgICAgICBjb25zdCB4ID0gTWF0aC5mbG9vcigoZS5jbGllbnRYIC0gdGhpcy5zdGF0ZS5jb250YWluZXIubGVmdCkgLyB0aGlzLnN0YXRlLmRlZmF1bHRXaWR0aCkgKiB0aGlzLnN0YXRlLmRlZmF1bHRXaWR0aDtcclxuICAgICAgICBjb25zdCB5ID0gTWF0aC5mbG9vcigoZS5jbGllbnRZIC0gdGhpcy5zdGF0ZS5jb250YWluZXIudG9wKSAvIHRoaXMuc3RhdGUuZGVmYXVsdEhlaWdodCkgKiB0aGlzLnN0YXRlLmRlZmF1bHRIZWlnaHQ7XHJcbiAgICAgICAgdmFyIGxlZnQgPSB4ID4gMCA/IHggOiAwO1xyXG4gICAgICAgIHZhciB0b3AgPSB5ID4gMCA/IHkgOiAwO1xyXG5cclxuICAgICAgICBjb25zdCByZWN0ID0gdGhpcy5pdGVtLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgICAgIGNvbnN0IGl0ZW1PZmZzZXRMZWZ0ID0gbGVmdCArIHJlY3Qud2lkdGg7XHJcbiAgICAgICAgY29uc3QgaXRlbU9mZnNldFRvcCA9IHRvcCArIHJlY3QuaGVpZ2h0O1xyXG5cclxuICAgICAgICBpZiAoaXRlbU9mZnNldExlZnQgPiB0aGlzLnN0YXRlLmNvbnRhaW5lci53aWR0aCkge1xyXG4gICAgICAgICAgICBsZWZ0ID0gTWF0aC5mbG9vcigodGhpcy5zdGF0ZS5jb250YWluZXIud2lkdGggLSByZWN0LndpZHRoKSAvIHRoaXMuc3RhdGUuZGVmYXVsdFdpZHRoKSAqIHRoaXMuc3RhdGUuZGVmYXVsdFdpZHRoO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGl0ZW1PZmZzZXRUb3AgPiB0aGlzLnN0YXRlLmNvbnRhaW5lci5oZWlnaHQpIHtcclxuICAgICAgICAgICAgdG9wID0gTWF0aC5mbG9vcigodGhpcy5zdGF0ZS5jb250YWluZXIuaGVpZ2h0IC0gcmVjdC5oZWlnaHQpIC8gdGhpcy5zdGF0ZS5kZWZhdWx0SGVpZ2h0KSAqIHRoaXMuc3RhdGUuZGVmYXVsdEhlaWdodDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGluZm8gPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLnN0YXRlLmluZm8sIHtcclxuICAgICAgICAgICAgeDogbGVmdCxcclxuICAgICAgICAgICAgeTogdG9wXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMucHJvcHMudXBkYXRlUHJvamVjdCh7XHJcbiAgICAgICAgICAgIHBhdGg6IHRoaXMucHJvcHMudWlkLFxyXG4gICAgICAgICAgICB2YWx1ZTogaW5mb1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnNldFN0YXRlKE9iamVjdC5hc3NpZ24oe30sIHRoaXMuc3RhdGUsIHtcclxuICAgICAgICAgICAgaW5mb1xyXG4gICAgICAgIH0pKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyBpdGVtQ29udGFpbmVyQ2xhc3NOYW1lIH0gPSB0aGlzLnN0YXRlO1xyXG4gICAgICAgIGNvbnN0IFRhZ05hbWUgPSBgJHt0aGlzLnByb3BzLnRhZy5uYW1lfWA7XHJcblxyXG4gICAgICAgIHZhciB0YWcgPSBudWxsO1xyXG4gICAgICAgIGlmICh0aGlzLnByb3BzLnRhZy5pbm5lclZhbHVlKSB7XHJcbiAgICAgICAgICAgIHRhZyA9ICg8VGFnTmFtZT57dGhpcy5wcm9wcy50YWcudmFsdWV9PC9UYWdOYW1lPilcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0YWcgPSAoPFRhZ05hbWUgdmFsdWU9e3RoaXMucHJvcHMudGFnLnZhbHVlfT48L1RhZ05hbWU+KVxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e2l0ZW1Db250YWluZXJDbGFzc05hbWV9XHJcbiAgICAgICAgICAgICAgICByZWY9e2l0ZW0gPT4gdGhpcy5pdGVtID0gaXRlbX1cclxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuaGFuZGxlSXRlbUNvbnRhaW5lckNsaWNrfVxyXG4gICAgICAgICAgICAgICAgZHJhZ2dhYmxlPXt0cnVlfVxyXG4gICAgICAgICAgICAgICAgb25EcmFnU3RhcnQ9e3RoaXMuaGFuZGxlRHJhZ1N0YXJ0fVxyXG4gICAgICAgICAgICAgICAgb25EcmFnPXt0aGlzLmhhbmRsZURyYWd9XHJcbiAgICAgICAgICAgICAgICBvbkRyYWdFbmQ9e3RoaXMuaGFuZGxlRHJhZ0VuZH1cclxuICAgICAgICAgICAgICAgIHN0eWxlPXt7IFxyXG4gICAgICAgICAgICAgICAgICAgIHRvcDogdGhpcy5wcm9wcy55LCBcclxuICAgICAgICAgICAgICAgICAgICBsZWZ0OiB0aGlzLnByb3BzLngsXHJcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IHRoaXMucHJvcHMud2lkdGgsXHJcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLnByb3BzLmhlaWdodCxcclxuICAgICAgICAgICAgICAgICAgICB6SW5kZXg6IHRoaXMucHJvcHMueiArIDEwMFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9PlxyXG4gICAgICAgICAgICAgICAge3RhZ31cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgSXRlbSA9IGNvbm5lY3QobWFwU3RhdGVUb1Byb3BzLCBtYXBEaXNwYXRjaFRvUHJvcHMpKEl0ZW1Db21wb25lbnQpO1xyXG5leHBvcnQgZGVmYXVsdCBJdGVtOyIsIlxudmFyIGNvbnRlbnQgPSByZXF1aXJlKFwiISEuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcz8/cmVmLS02LTEhLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2xpYi9sb2FkZXIuanM/P3JlZi0tNi0yIS4vaXRlbS5zY3NzXCIpO1xuXG5pZih0eXBlb2YgY29udGVudCA9PT0gJ3N0cmluZycpIGNvbnRlbnQgPSBbW21vZHVsZS5pZCwgY29udGVudCwgJyddXTtcblxudmFyIHRyYW5zZm9ybTtcbnZhciBpbnNlcnRJbnRvO1xuXG5cblxudmFyIG9wdGlvbnMgPSB7XCJobXJcIjp0cnVlfVxuXG5vcHRpb25zLnRyYW5zZm9ybSA9IHRyYW5zZm9ybVxub3B0aW9ucy5pbnNlcnRJbnRvID0gdW5kZWZpbmVkO1xuXG52YXIgdXBkYXRlID0gcmVxdWlyZShcIiEuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2xpYi9hZGRTdHlsZXMuanNcIikoY29udGVudCwgb3B0aW9ucyk7XG5cbmlmKGNvbnRlbnQubG9jYWxzKSBtb2R1bGUuZXhwb3J0cyA9IGNvbnRlbnQubG9jYWxzO1xuXG5pZihtb2R1bGUuaG90KSB7XG5cdG1vZHVsZS5ob3QuYWNjZXB0KFwiISEuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcz8/cmVmLS02LTEhLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2xpYi9sb2FkZXIuanM/P3JlZi0tNi0yIS4vaXRlbS5zY3NzXCIsIGZ1bmN0aW9uKCkge1xuXHRcdHZhciBuZXdDb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanM/P3JlZi0tNi0xIS4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9saWIvbG9hZGVyLmpzPz9yZWYtLTYtMiEuL2l0ZW0uc2Nzc1wiKTtcblxuXHRcdGlmKHR5cGVvZiBuZXdDb250ZW50ID09PSAnc3RyaW5nJykgbmV3Q29udGVudCA9IFtbbW9kdWxlLmlkLCBuZXdDb250ZW50LCAnJ11dO1xuXG5cdFx0dmFyIGxvY2FscyA9IChmdW5jdGlvbihhLCBiKSB7XG5cdFx0XHR2YXIga2V5LCBpZHggPSAwO1xuXG5cdFx0XHRmb3Ioa2V5IGluIGEpIHtcblx0XHRcdFx0aWYoIWIgfHwgYVtrZXldICE9PSBiW2tleV0pIHJldHVybiBmYWxzZTtcblx0XHRcdFx0aWR4Kys7XG5cdFx0XHR9XG5cblx0XHRcdGZvcihrZXkgaW4gYikgaWR4LS07XG5cblx0XHRcdHJldHVybiBpZHggPT09IDA7XG5cdFx0fShjb250ZW50LmxvY2FscywgbmV3Q29udGVudC5sb2NhbHMpKTtcblxuXHRcdGlmKCFsb2NhbHMpIHRocm93IG5ldyBFcnJvcignQWJvcnRpbmcgQ1NTIEhNUiBkdWUgdG8gY2hhbmdlZCBjc3MtbW9kdWxlcyBsb2NhbHMuJyk7XG5cblx0XHR1cGRhdGUobmV3Q29udGVudCk7XG5cdH0pO1xuXG5cdG1vZHVsZS5ob3QuZGlzcG9zZShmdW5jdGlvbigpIHsgdXBkYXRlKCk7IH0pO1xufSJdLCJzb3VyY2VSb290IjoiIn0=