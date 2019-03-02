(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["app~engine"],{

/***/ 0:
/*!**********************!*\
  !*** util (ignored) ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 1:
/*!**********************!*\
  !*** util (ignored) ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 2:
/*!************************!*\
  !*** buffer (ignored) ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 3:
/*!************************!*\
  !*** crypto (ignored) ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ "43fW":
/*!******************************************************!*\
  !*** ./client/app/src/config/redux/redux.reducer.js ***!
  \******************************************************/
/*! exports provided: appReducer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "appReducer", function() { return appReducer; });
/* harmony import */ var _redux_actions_types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./redux.actions.types */ "jRXl");


const jwt = __webpack_require__(/*! jsonwebtoken */ "FLf1");

const token = localStorage.getItem('token');
const initialState = {
  token: token,
  user: token ? jwt.decode(token) : null
};
const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case _redux_actions_types__WEBPACK_IMPORTED_MODULE_0__["UPDATE_VIEW_SETTINGS"]:
      return Object.assign({}, state, {
        viewWidth: action.payload.viewWidth || state.viewWidth,
        viewHeight: action.payload.viewHeight || state.viewHeight,
        cellWidth: action.payload.cellWidth || state.cellWidth,
        cellHeight: action.payload.cellHeight || state.cellHeight,
        cellTransform: action.payload.cellTransform || state.cellTransform
      });

    case _redux_actions_types__WEBPACK_IMPORTED_MODULE_0__["UPDATE_BG_IMAGE"]:
      return Object.assign({}, state, {
        backgroundImage: action.payload || state.backgroundImage
      });

    case _redux_actions_types__WEBPACK_IMPORTED_MODULE_0__["UPDATE_TOKEN"]:
      if (action.payload) {
        localStorage.setItem('token', action.payload);
      } else {
        localStorage.removeItem('token');
      }

      return Object.assign({}, state, {
        token: action.payload,
        user: action.payload ? jwt.decode(action.payload) : null
      });
  }

  return state;
};

/***/ }),

/***/ "Zn1A":
/*!*****************************************************!*\
  !*** ./client/common/config/redux/redux.reducer.js ***!
  \*****************************************************/
/*! exports provided: reducer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "reducer", function() { return reducer; });
/* harmony import */ var redux__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! redux */ "ANjH");
/* harmony import */ var _app_src_config_redux_redux_reducer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../app/src/config/redux/redux.reducer */ "43fW");
/* harmony import */ var _engine_src_config_redux_redux_reducer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../engine/src/config/redux/redux.reducer */ "aXU1");



const reducer = Object(redux__WEBPACK_IMPORTED_MODULE_0__["combineReducers"])({
  appReducer: _app_src_config_redux_redux_reducer__WEBPACK_IMPORTED_MODULE_1__["appReducer"],
  engineReducer: _engine_src_config_redux_redux_reducer__WEBPACK_IMPORTED_MODULE_2__["engineReducer"]
});

/***/ }),

/***/ "aXU1":
/*!*********************************************************!*\
  !*** ./client/engine/src/config/redux/redux.reducer.js ***!
  \*********************************************************/
/*! exports provided: engineReducer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "engineReducer", function() { return engineReducer; });
/* harmony import */ var _redux_actions_types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./redux.actions.types */ "sT+s");

const initialState = {
  workspace: {
    project: {
      config: {},
      ui: {
        gClassList: 'gid'
      },
      add: {},
      items: {}
    }
  }
};
const engineReducer = (state = initialState, action) => {
  var workspace = Object.assign({}, state.workspace);

  switch (action.type) {
    case _redux_actions_types__WEBPACK_IMPORTED_MODULE_0__["ADD_PROJECT_FORM"]:
      workspace.project.id = payload;
      return Object.assign({}, state, {
        workspace
      });

    case _redux_actions_types__WEBPACK_IMPORTED_MODULE_0__["UPDATE_VIEW_SETTINGS"]:
      workspace.project.config.viewWidth = action.payload.viewWidth || state.workspace.project.config.viewWidth;
      workspace.project.config.viewHeight = action.payload.viewHeight || state.workspace.project.config.viewHeight;
      workspace.project.config.cellWidth = action.payload.cellWidth || state.workspace.project.config.cellWidth;
      workspace.project.config.cellHeight = action.payload.cellHeight || state.workspace.project.config.cellHeight;
      workspace.project.config.cellTransform = action.payload.cellTransform || state.workspace.project.config.cellTransform;
      workspace.project.config.current_x = action.payload.current_x || state.workspace.project.config.current_x;
      workspace.project.config.current_y = action.payload.current_y || state.workspace.project.config.current_y;
      return Object.assign({}, state, {
        workspace
      });

    case _redux_actions_types__WEBPACK_IMPORTED_MODULE_0__["G_CLICKED"]:
      workspace.project.config.cellTransform = action.payload.cellTransform || state.workspace.project.config.cellTransform;
      workspace.project.config.current_x = action.payload.current_x || state.workspace.project.config.current_x;
      workspace.project.config.current_y = action.payload.current_y || state.workspace.project.config.current_y;
      workspace.project.add.addComponent = action.payload.addComponent;
      workspace.project.ui.gClassList = action.payload.gClassList || state.workspace.ui.project.gClassList;
      return Object.assign({}, state, {
        workspace
      });

    case _redux_actions_types__WEBPACK_IMPORTED_MODULE_0__["ADD_INPUT_VALUE_CHANGED"]:
      workspace.project.add.addInputValue = action.payload;
      return Object.assign({}, state, {
        workspace
      });

    case _redux_actions_types__WEBPACK_IMPORTED_MODULE_0__["ADD_INPUT_TAG_CHANGED"]:
      workspace.project.add.addInputTag = action.payload;
      return Object.assign({}, state, {
        workspace
      });

    case _redux_actions_types__WEBPACK_IMPORTED_MODULE_0__["UPDATE_PROJECT"]:
      const parts = action.payload.path.split('.');
      var item = workspace.project.items;
      parts.forEach((part, i) => {
        if (i + 1 === parts.length) {
          item[part] = action.payload.value;
        } else {
          item = item[part];
        }
      });
      return Object.assign({}, state, {
        workspace
      });

    case _redux_actions_types__WEBPACK_IMPORTED_MODULE_0__["UPDATE_PROJECT_ITEMS"]:
      workspace.project.items = action.payload;
      return Object.assign({}, state, {
        workspace
      });

    case _redux_actions_types__WEBPACK_IMPORTED_MODULE_0__["UPDATE_PROJECT_CONTAINER"]:
      workspace.project.container = action.payload;
      return Object.assign({}, state, {
        workspace
      });
  }

  return state;
};

/***/ }),

/***/ "jRXl":
/*!************************************************************!*\
  !*** ./client/app/src/config/redux/redux.actions.types.js ***!
  \************************************************************/
/*! exports provided: UPDATE_VIEW_SETTINGS, UPDATE_BG_IMAGE, UPDATE_TOKEN */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UPDATE_VIEW_SETTINGS", function() { return UPDATE_VIEW_SETTINGS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UPDATE_BG_IMAGE", function() { return UPDATE_BG_IMAGE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UPDATE_TOKEN", function() { return UPDATE_TOKEN; });
const UPDATE_VIEW_SETTINGS = 'UPDATE_VIEW_SETTINGS';
const UPDATE_BG_IMAGE = 'UPDATE_BG_IMAGE';
const UPDATE_TOKEN = 'UPDATE_TOKEN';

/***/ }),

/***/ "p6Ez":
/*!***************************************************!*\
  !*** ./client/common/config/redux/redux.store.js ***!
  \***************************************************/
/*! exports provided: store */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "store", function() { return store; });
/* harmony import */ var redux__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! redux */ "ANjH");
/* harmony import */ var _redux_reducer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./redux.reducer */ "Zn1A");


const store = Object(redux__WEBPACK_IMPORTED_MODULE_0__["createStore"])(_redux_reducer__WEBPACK_IMPORTED_MODULE_1__["reducer"]);

/***/ }),

/***/ "sT+s":
/*!***************************************************************!*\
  !*** ./client/engine/src/config/redux/redux.actions.types.js ***!
  \***************************************************************/
/*! exports provided: UPDATE_VIEW_SETTINGS, G_CLICKED, ADD_INPUT_VALUE_CHANGED, ADD_INPUT_TAG_CHANGED, ADD_PROJECT_FORM, UPDATE_PROJECT, UPDATE_PROJECT_ITEMS, UPDATE_PROJECT_CONTAINER */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UPDATE_VIEW_SETTINGS", function() { return UPDATE_VIEW_SETTINGS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "G_CLICKED", function() { return G_CLICKED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ADD_INPUT_VALUE_CHANGED", function() { return ADD_INPUT_VALUE_CHANGED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ADD_INPUT_TAG_CHANGED", function() { return ADD_INPUT_TAG_CHANGED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ADD_PROJECT_FORM", function() { return ADD_PROJECT_FORM; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UPDATE_PROJECT", function() { return UPDATE_PROJECT; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UPDATE_PROJECT_ITEMS", function() { return UPDATE_PROJECT_ITEMS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UPDATE_PROJECT_CONTAINER", function() { return UPDATE_PROJECT_CONTAINER; });
const UPDATE_VIEW_SETTINGS = 'UPDATE_VIEW_SETTINGS';
const G_CLICKED = 'G_CLICKED';
const ADD_INPUT_VALUE_CHANGED = 'ADD_INPUT_VALUE_CHANGED';
const ADD_INPUT_TAG_CHANGED = 'ADD_INPUT_TAG_CHANGED';
const ADD_PROJECT_FORM = 'ADD_PROJECT_FORM';
const UPDATE_PROJECT = 'UPDATE_PROJECT';
const UPDATE_PROJECT_ITEMS = 'UPDATE_PROJECT_ITEM';
const UPDATE_PROJECT_CONTAINER = 'UPDATE_PROJECT_CONTAINER';

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vdXRpbCAoaWdub3JlZCkiLCJ3ZWJwYWNrOi8vL3V0aWwgKGlnbm9yZWQpPzEzZTEiLCJ3ZWJwYWNrOi8vL2J1ZmZlciAoaWdub3JlZCkiLCJ3ZWJwYWNrOi8vL2NyeXB0byAoaWdub3JlZCkiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L2FwcC9zcmMvY29uZmlnL3JlZHV4L3JlZHV4LnJlZHVjZXIuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L2NvbW1vbi9jb25maWcvcmVkdXgvcmVkdXgucmVkdWNlci5qcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvZW5naW5lL3NyYy9jb25maWcvcmVkdXgvcmVkdXgucmVkdWNlci5qcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvYXBwL3NyYy9jb25maWcvcmVkdXgvcmVkdXguYWN0aW9ucy50eXBlcy5qcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvY29tbW9uL2NvbmZpZy9yZWR1eC9yZWR1eC5zdG9yZS5qcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvZW5naW5lL3NyYy9jb25maWcvcmVkdXgvcmVkdXguYWN0aW9ucy50eXBlcy5qcyJdLCJuYW1lcyI6WyJqd3QiLCJyZXF1aXJlIiwidG9rZW4iLCJsb2NhbFN0b3JhZ2UiLCJnZXRJdGVtIiwiaW5pdGlhbFN0YXRlIiwidXNlciIsImRlY29kZSIsImFwcFJlZHVjZXIiLCJzdGF0ZSIsImFjdGlvbiIsInR5cGUiLCJVUERBVEVfVklFV19TRVRUSU5HUyIsIk9iamVjdCIsImFzc2lnbiIsInZpZXdXaWR0aCIsInBheWxvYWQiLCJ2aWV3SGVpZ2h0IiwiY2VsbFdpZHRoIiwiY2VsbEhlaWdodCIsImNlbGxUcmFuc2Zvcm0iLCJVUERBVEVfQkdfSU1BR0UiLCJiYWNrZ3JvdW5kSW1hZ2UiLCJVUERBVEVfVE9LRU4iLCJzZXRJdGVtIiwicmVtb3ZlSXRlbSIsInJlZHVjZXIiLCJjb21iaW5lUmVkdWNlcnMiLCJlbmdpbmVSZWR1Y2VyIiwid29ya3NwYWNlIiwicHJvamVjdCIsImNvbmZpZyIsInVpIiwiZ0NsYXNzTGlzdCIsImFkZCIsIml0ZW1zIiwiQUREX1BST0pFQ1RfRk9STSIsImlkIiwiY3VycmVudF94IiwiY3VycmVudF95IiwiR19DTElDS0VEIiwiYWRkQ29tcG9uZW50IiwiQUREX0lOUFVUX1ZBTFVFX0NIQU5HRUQiLCJhZGRJbnB1dFZhbHVlIiwiQUREX0lOUFVUX1RBR19DSEFOR0VEIiwiYWRkSW5wdXRUYWciLCJVUERBVEVfUFJPSkVDVCIsInBhcnRzIiwicGF0aCIsInNwbGl0IiwiaXRlbSIsImZvckVhY2giLCJwYXJ0IiwiaSIsImxlbmd0aCIsInZhbHVlIiwiVVBEQVRFX1BST0pFQ1RfSVRFTVMiLCJVUERBVEVfUFJPSkVDVF9DT05UQUlORVIiLCJjb250YWluZXIiLCJzdG9yZSIsImNyZWF0ZVN0b3JlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSxlOzs7Ozs7Ozs7OztBQ0FBLGU7Ozs7Ozs7Ozs7O0FDQUEsZTs7Ozs7Ozs7Ozs7QUNBQSxlOzs7Ozs7Ozs7Ozs7QUNBQTtBQUFBO0FBQUE7QUFBQTs7QUFDQSxNQUFNQSxHQUFHLEdBQUdDLG1CQUFPLENBQUMsMEJBQUQsQ0FBbkI7O0FBRUEsTUFBTUMsS0FBSyxHQUFHQyxZQUFZLENBQUNDLE9BQWIsQ0FBcUIsT0FBckIsQ0FBZDtBQUNBLE1BQU1DLFlBQVksR0FBRztBQUNqQkgsT0FBSyxFQUFFQSxLQURVO0FBRWpCSSxNQUFJLEVBQUVKLEtBQUssR0FBR0YsR0FBRyxDQUFDTyxNQUFKLENBQVdMLEtBQVgsQ0FBSCxHQUF1QjtBQUZqQixDQUFyQjtBQUtPLE1BQU1NLFVBQVUsR0FBRyxDQUFDQyxLQUFLLEdBQUdKLFlBQVQsRUFBdUJLLE1BQXZCLEtBQWtDO0FBQ3hELFVBQVFBLE1BQU0sQ0FBQ0MsSUFBZjtBQUNJLFNBQUtDLHlFQUFMO0FBQ0ksYUFBT0MsTUFBTSxDQUFDQyxNQUFQLENBQWMsRUFBZCxFQUFrQkwsS0FBbEIsRUFBeUI7QUFDNUJNLGlCQUFTLEVBQUVMLE1BQU0sQ0FBQ00sT0FBUCxDQUFlRCxTQUFmLElBQTRCTixLQUFLLENBQUNNLFNBRGpCO0FBRTVCRSxrQkFBVSxFQUFFUCxNQUFNLENBQUNNLE9BQVAsQ0FBZUMsVUFBZixJQUE2QlIsS0FBSyxDQUFDUSxVQUZuQjtBQUc1QkMsaUJBQVMsRUFBRVIsTUFBTSxDQUFDTSxPQUFQLENBQWVFLFNBQWYsSUFBNEJULEtBQUssQ0FBQ1MsU0FIakI7QUFJNUJDLGtCQUFVLEVBQUVULE1BQU0sQ0FBQ00sT0FBUCxDQUFlRyxVQUFmLElBQTZCVixLQUFLLENBQUNVLFVBSm5CO0FBSzVCQyxxQkFBYSxFQUFFVixNQUFNLENBQUNNLE9BQVAsQ0FBZUksYUFBZixJQUFnQ1gsS0FBSyxDQUFDVztBQUx6QixPQUF6QixDQUFQOztBQU9KLFNBQUtDLG9FQUFMO0FBQ0ksYUFBT1IsTUFBTSxDQUFDQyxNQUFQLENBQWMsRUFBZCxFQUFrQkwsS0FBbEIsRUFBeUI7QUFDNUJhLHVCQUFlLEVBQUVaLE1BQU0sQ0FBQ00sT0FBUCxJQUFrQlAsS0FBSyxDQUFDYTtBQURiLE9BQXpCLENBQVA7O0FBR0osU0FBS0MsaUVBQUw7QUFDSSxVQUFJYixNQUFNLENBQUNNLE9BQVgsRUFBb0I7QUFDaEJiLG9CQUFZLENBQUNxQixPQUFiLENBQXFCLE9BQXJCLEVBQThCZCxNQUFNLENBQUNNLE9BQXJDO0FBQ0gsT0FGRCxNQUVPO0FBQ0hiLG9CQUFZLENBQUNzQixVQUFiLENBQXdCLE9BQXhCO0FBQ0g7O0FBQ0QsYUFBT1osTUFBTSxDQUFDQyxNQUFQLENBQWMsRUFBZCxFQUFrQkwsS0FBbEIsRUFBeUI7QUFDNUJQLGFBQUssRUFBRVEsTUFBTSxDQUFDTSxPQURjO0FBRTVCVixZQUFJLEVBQUVJLE1BQU0sQ0FBQ00sT0FBUCxHQUFpQmhCLEdBQUcsQ0FBQ08sTUFBSixDQUFXRyxNQUFNLENBQUNNLE9BQWxCLENBQWpCLEdBQThDO0FBRnhCLE9BQXpCLENBQVA7QUFuQlI7O0FBd0JBLFNBQU9QLEtBQVA7QUFDSCxDQTFCTSxDOzs7Ozs7Ozs7Ozs7QUNUUDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBRU8sTUFBTWlCLE9BQU8sR0FBR0MsNkRBQWUsQ0FBQztBQUNuQ25CLDRGQURtQztBQUVuQ29CLHFHQUFhQTtBQUZzQixDQUFELENBQS9CLEM7Ozs7Ozs7Ozs7OztBQ0pQO0FBQUE7QUFBQTtBQUFBO0FBRUEsTUFBTXZCLFlBQVksR0FBRztBQUNqQndCLFdBQVMsRUFBRTtBQUNQQyxXQUFPLEVBQUU7QUFDTEMsWUFBTSxFQUFFLEVBREg7QUFFTEMsUUFBRSxFQUFFO0FBQ0FDLGtCQUFVLEVBQUU7QUFEWixPQUZDO0FBS0xDLFNBQUcsRUFBRSxFQUxBO0FBTUxDLFdBQUssRUFBRTtBQU5GO0FBREY7QUFETSxDQUFyQjtBQWFPLE1BQU1QLGFBQWEsR0FBRyxDQUFDbkIsS0FBSyxHQUFHSixZQUFULEVBQXVCSyxNQUF2QixLQUFrQztBQUMzRCxNQUFJbUIsU0FBUyxHQUFHaEIsTUFBTSxDQUFDQyxNQUFQLENBQWMsRUFBZCxFQUFrQkwsS0FBSyxDQUFDb0IsU0FBeEIsQ0FBaEI7O0FBQ0EsVUFBUW5CLE1BQU0sQ0FBQ0MsSUFBZjtBQUNJLFNBQUt5QixxRUFBTDtBQUNJUCxlQUFTLENBQUNDLE9BQVYsQ0FBa0JPLEVBQWxCLEdBQXVCckIsT0FBdkI7QUFDQSxhQUFPSCxNQUFNLENBQUNDLE1BQVAsQ0FBYyxFQUFkLEVBQWtCTCxLQUFsQixFQUF5QjtBQUM1Qm9CO0FBRDRCLE9BQXpCLENBQVA7O0FBR0osU0FBS2pCLHlFQUFMO0FBQ0lpQixlQUFTLENBQUNDLE9BQVYsQ0FBa0JDLE1BQWxCLENBQXlCaEIsU0FBekIsR0FBcUNMLE1BQU0sQ0FBQ00sT0FBUCxDQUFlRCxTQUFmLElBQTRCTixLQUFLLENBQUNvQixTQUFOLENBQWdCQyxPQUFoQixDQUF3QkMsTUFBeEIsQ0FBK0JoQixTQUFoRztBQUNBYyxlQUFTLENBQUNDLE9BQVYsQ0FBa0JDLE1BQWxCLENBQXlCZCxVQUF6QixHQUFzQ1AsTUFBTSxDQUFDTSxPQUFQLENBQWVDLFVBQWYsSUFBNkJSLEtBQUssQ0FBQ29CLFNBQU4sQ0FBZ0JDLE9BQWhCLENBQXdCQyxNQUF4QixDQUErQmQsVUFBbEc7QUFDQVksZUFBUyxDQUFDQyxPQUFWLENBQWtCQyxNQUFsQixDQUF5QmIsU0FBekIsR0FBcUNSLE1BQU0sQ0FBQ00sT0FBUCxDQUFlRSxTQUFmLElBQTRCVCxLQUFLLENBQUNvQixTQUFOLENBQWdCQyxPQUFoQixDQUF3QkMsTUFBeEIsQ0FBK0JiLFNBQWhHO0FBQ0FXLGVBQVMsQ0FBQ0MsT0FBVixDQUFrQkMsTUFBbEIsQ0FBeUJaLFVBQXpCLEdBQXNDVCxNQUFNLENBQUNNLE9BQVAsQ0FBZUcsVUFBZixJQUE2QlYsS0FBSyxDQUFDb0IsU0FBTixDQUFnQkMsT0FBaEIsQ0FBd0JDLE1BQXhCLENBQStCWixVQUFsRztBQUNBVSxlQUFTLENBQUNDLE9BQVYsQ0FBa0JDLE1BQWxCLENBQXlCWCxhQUF6QixHQUF5Q1YsTUFBTSxDQUFDTSxPQUFQLENBQWVJLGFBQWYsSUFBZ0NYLEtBQUssQ0FBQ29CLFNBQU4sQ0FBZ0JDLE9BQWhCLENBQXdCQyxNQUF4QixDQUErQlgsYUFBeEc7QUFDQVMsZUFBUyxDQUFDQyxPQUFWLENBQWtCQyxNQUFsQixDQUF5Qk8sU0FBekIsR0FBcUM1QixNQUFNLENBQUNNLE9BQVAsQ0FBZXNCLFNBQWYsSUFBNEI3QixLQUFLLENBQUNvQixTQUFOLENBQWdCQyxPQUFoQixDQUF3QkMsTUFBeEIsQ0FBK0JPLFNBQWhHO0FBQ0FULGVBQVMsQ0FBQ0MsT0FBVixDQUFrQkMsTUFBbEIsQ0FBeUJRLFNBQXpCLEdBQXFDN0IsTUFBTSxDQUFDTSxPQUFQLENBQWV1QixTQUFmLElBQTRCOUIsS0FBSyxDQUFDb0IsU0FBTixDQUFnQkMsT0FBaEIsQ0FBd0JDLE1BQXhCLENBQStCUSxTQUFoRztBQUNBLGFBQU8xQixNQUFNLENBQUNDLE1BQVAsQ0FBYyxFQUFkLEVBQWtCTCxLQUFsQixFQUF5QjtBQUM1Qm9CO0FBRDRCLE9BQXpCLENBQVA7O0FBR0osU0FBS1csOERBQUw7QUFDSVgsZUFBUyxDQUFDQyxPQUFWLENBQWtCQyxNQUFsQixDQUF5QlgsYUFBekIsR0FBeUNWLE1BQU0sQ0FBQ00sT0FBUCxDQUFlSSxhQUFmLElBQWdDWCxLQUFLLENBQUNvQixTQUFOLENBQWdCQyxPQUFoQixDQUF3QkMsTUFBeEIsQ0FBK0JYLGFBQXhHO0FBQ0FTLGVBQVMsQ0FBQ0MsT0FBVixDQUFrQkMsTUFBbEIsQ0FBeUJPLFNBQXpCLEdBQXFDNUIsTUFBTSxDQUFDTSxPQUFQLENBQWVzQixTQUFmLElBQTRCN0IsS0FBSyxDQUFDb0IsU0FBTixDQUFnQkMsT0FBaEIsQ0FBd0JDLE1BQXhCLENBQStCTyxTQUFoRztBQUNBVCxlQUFTLENBQUNDLE9BQVYsQ0FBa0JDLE1BQWxCLENBQXlCUSxTQUF6QixHQUFxQzdCLE1BQU0sQ0FBQ00sT0FBUCxDQUFldUIsU0FBZixJQUE0QjlCLEtBQUssQ0FBQ29CLFNBQU4sQ0FBZ0JDLE9BQWhCLENBQXdCQyxNQUF4QixDQUErQlEsU0FBaEc7QUFDQVYsZUFBUyxDQUFDQyxPQUFWLENBQWtCSSxHQUFsQixDQUFzQk8sWUFBdEIsR0FBcUMvQixNQUFNLENBQUNNLE9BQVAsQ0FBZXlCLFlBQXBEO0FBQ0FaLGVBQVMsQ0FBQ0MsT0FBVixDQUFrQkUsRUFBbEIsQ0FBcUJDLFVBQXJCLEdBQWtDdkIsTUFBTSxDQUFDTSxPQUFQLENBQWVpQixVQUFmLElBQTZCeEIsS0FBSyxDQUFDb0IsU0FBTixDQUFnQkcsRUFBaEIsQ0FBbUJGLE9BQW5CLENBQTJCRyxVQUExRjtBQUNBLGFBQU9wQixNQUFNLENBQUNDLE1BQVAsQ0FBYyxFQUFkLEVBQWtCTCxLQUFsQixFQUF5QjtBQUM1Qm9CO0FBRDRCLE9BQXpCLENBQVA7O0FBR0osU0FBS2EsNEVBQUw7QUFDSWIsZUFBUyxDQUFDQyxPQUFWLENBQWtCSSxHQUFsQixDQUFzQlMsYUFBdEIsR0FBc0NqQyxNQUFNLENBQUNNLE9BQTdDO0FBQ0EsYUFBT0gsTUFBTSxDQUFDQyxNQUFQLENBQWMsRUFBZCxFQUFrQkwsS0FBbEIsRUFBeUI7QUFDNUJvQjtBQUQ0QixPQUF6QixDQUFQOztBQUdKLFNBQUtlLDBFQUFMO0FBQ0lmLGVBQVMsQ0FBQ0MsT0FBVixDQUFrQkksR0FBbEIsQ0FBc0JXLFdBQXRCLEdBQW9DbkMsTUFBTSxDQUFDTSxPQUEzQztBQUNBLGFBQU9ILE1BQU0sQ0FBQ0MsTUFBUCxDQUFjLEVBQWQsRUFBa0JMLEtBQWxCLEVBQXlCO0FBQzVCb0I7QUFENEIsT0FBekIsQ0FBUDs7QUFHSixTQUFLaUIsbUVBQUw7QUFDSSxZQUFNQyxLQUFLLEdBQUdyQyxNQUFNLENBQUNNLE9BQVAsQ0FBZWdDLElBQWYsQ0FBb0JDLEtBQXBCLENBQTBCLEdBQTFCLENBQWQ7QUFFQSxVQUFJQyxJQUFJLEdBQUdyQixTQUFTLENBQUNDLE9BQVYsQ0FBa0JLLEtBQTdCO0FBQ0FZLFdBQUssQ0FBQ0ksT0FBTixDQUFjLENBQUNDLElBQUQsRUFBT0MsQ0FBUCxLQUFhO0FBQ3ZCLFlBQUtBLENBQUMsR0FBRyxDQUFMLEtBQVlOLEtBQUssQ0FBQ08sTUFBdEIsRUFBOEI7QUFDMUJKLGNBQUksQ0FBQ0UsSUFBRCxDQUFKLEdBQWExQyxNQUFNLENBQUNNLE9BQVAsQ0FBZXVDLEtBQTVCO0FBQ0gsU0FGRCxNQUVPO0FBQ0hMLGNBQUksR0FBR0EsSUFBSSxDQUFDRSxJQUFELENBQVg7QUFDSDtBQUNKLE9BTkQ7QUFRQSxhQUFPdkMsTUFBTSxDQUFDQyxNQUFQLENBQWMsRUFBZCxFQUFrQkwsS0FBbEIsRUFBeUI7QUFDNUJvQjtBQUQ0QixPQUF6QixDQUFQOztBQUdKLFNBQUsyQix5RUFBTDtBQUNJM0IsZUFBUyxDQUFDQyxPQUFWLENBQWtCSyxLQUFsQixHQUEwQnpCLE1BQU0sQ0FBQ00sT0FBakM7QUFFQSxhQUFPSCxNQUFNLENBQUNDLE1BQVAsQ0FBYyxFQUFkLEVBQWtCTCxLQUFsQixFQUF5QjtBQUM1Qm9CO0FBRDRCLE9BQXpCLENBQVA7O0FBR0osU0FBSzRCLDZFQUFMO0FBQ0k1QixlQUFTLENBQUNDLE9BQVYsQ0FBa0I0QixTQUFsQixHQUE4QmhELE1BQU0sQ0FBQ00sT0FBckM7QUFDQSxhQUFPSCxNQUFNLENBQUNDLE1BQVAsQ0FBYyxFQUFkLEVBQWtCTCxLQUFsQixFQUF5QjtBQUM1Qm9CO0FBRDRCLE9BQXpCLENBQVA7QUEzRFI7O0FBZ0VBLFNBQU9wQixLQUFQO0FBQ0gsQ0FuRU0sQzs7Ozs7Ozs7Ozs7O0FDZlA7QUFBQTtBQUFBO0FBQUE7QUFBTyxNQUFNRyxvQkFBb0IsR0FBRyxzQkFBN0I7QUFDQSxNQUFNUyxlQUFlLEdBQUcsaUJBQXhCO0FBQ0EsTUFBTUUsWUFBWSxHQUFHLGNBQXJCLEM7Ozs7Ozs7Ozs7OztBQ0ZQO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUVPLE1BQU1vQyxLQUFLLEdBQUdDLHlEQUFXLENBQUNsQyxzREFBRCxDQUF6QixDOzs7Ozs7Ozs7Ozs7QUNIUDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBTyxNQUFNZCxvQkFBb0IsR0FBRyxzQkFBN0I7QUFDQSxNQUFNNEIsU0FBUyxHQUFHLFdBQWxCO0FBQ0EsTUFBTUUsdUJBQXVCLEdBQUcseUJBQWhDO0FBQ0EsTUFBTUUscUJBQXFCLEdBQUcsdUJBQTlCO0FBQ0EsTUFBTVIsZ0JBQWdCLEdBQUcsa0JBQXpCO0FBQ0EsTUFBTVUsY0FBYyxHQUFHLGdCQUF2QjtBQUNBLE1BQU1VLG9CQUFvQixHQUFHLHFCQUE3QjtBQUNBLE1BQU1DLHdCQUF3QixHQUFHLDBCQUFqQyxDIiwiZmlsZSI6ImJ1aWxkL2FwcH5lbmdpbmUuMTBkN2RmNTFlMjU0NzUyZWVkNTEuY2h1bmsuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAoaWdub3JlZCkgKi8iLCIvKiAoaWdub3JlZCkgKi8iLCIvKiAoaWdub3JlZCkgKi8iLCIvKiAoaWdub3JlZCkgKi8iLCJpbXBvcnQgeyBVUERBVEVfVklFV19TRVRUSU5HUywgVVBEQVRFX0JHX0lNQUdFLCBVUERBVEVfVE9LRU4gfSBmcm9tICcuL3JlZHV4LmFjdGlvbnMudHlwZXMnO1xyXG5jb25zdCBqd3QgPSByZXF1aXJlKCdqc29ud2VidG9rZW4nKTtcclxuXHJcbmNvbnN0IHRva2VuID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3Rva2VuJyk7XHJcbmNvbnN0IGluaXRpYWxTdGF0ZSA9IHtcclxuICAgIHRva2VuOiB0b2tlbixcclxuICAgIHVzZXI6IHRva2VuID8gand0LmRlY29kZSh0b2tlbikgOiBudWxsXHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgYXBwUmVkdWNlciA9IChzdGF0ZSA9IGluaXRpYWxTdGF0ZSwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBVUERBVEVfVklFV19TRVRUSU5HUzpcclxuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLCB7XHJcbiAgICAgICAgICAgICAgICB2aWV3V2lkdGg6IGFjdGlvbi5wYXlsb2FkLnZpZXdXaWR0aCB8fCBzdGF0ZS52aWV3V2lkdGgsXHJcbiAgICAgICAgICAgICAgICB2aWV3SGVpZ2h0OiBhY3Rpb24ucGF5bG9hZC52aWV3SGVpZ2h0IHx8IHN0YXRlLnZpZXdIZWlnaHQsXHJcbiAgICAgICAgICAgICAgICBjZWxsV2lkdGg6IGFjdGlvbi5wYXlsb2FkLmNlbGxXaWR0aCB8fCBzdGF0ZS5jZWxsV2lkdGgsXHJcbiAgICAgICAgICAgICAgICBjZWxsSGVpZ2h0OiBhY3Rpb24ucGF5bG9hZC5jZWxsSGVpZ2h0IHx8IHN0YXRlLmNlbGxIZWlnaHQsXHJcbiAgICAgICAgICAgICAgICBjZWxsVHJhbnNmb3JtOiBhY3Rpb24ucGF5bG9hZC5jZWxsVHJhbnNmb3JtIHx8IHN0YXRlLmNlbGxUcmFuc2Zvcm1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgY2FzZSBVUERBVEVfQkdfSU1BR0U6XHJcbiAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwge1xyXG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZEltYWdlOiBhY3Rpb24ucGF5bG9hZCB8fCBzdGF0ZS5iYWNrZ3JvdW5kSW1hZ2VcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgY2FzZSBVUERBVEVfVE9LRU46XHJcbiAgICAgICAgICAgIGlmIChhY3Rpb24ucGF5bG9hZCkge1xyXG4gICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3Rva2VuJywgYWN0aW9uLnBheWxvYWQpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ3Rva2VuJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLCB7XHJcbiAgICAgICAgICAgICAgICB0b2tlbjogYWN0aW9uLnBheWxvYWQsXHJcbiAgICAgICAgICAgICAgICB1c2VyOiBhY3Rpb24ucGF5bG9hZCA/IGp3dC5kZWNvZGUoYWN0aW9uLnBheWxvYWQpIDogbnVsbFxyXG4gICAgICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIHJldHVybiBzdGF0ZTtcclxufTsiLCJpbXBvcnQgeyBjb21iaW5lUmVkdWNlcnMgfSBmcm9tICdyZWR1eCc7XHJcbmltcG9ydCB7IGFwcFJlZHVjZXIgfSBmcm9tICcuLi8uLi8uLi9hcHAvc3JjL2NvbmZpZy9yZWR1eC9yZWR1eC5yZWR1Y2VyJztcclxuaW1wb3J0IHsgZW5naW5lUmVkdWNlciB9IGZyb20gJy4uLy4uLy4uL2VuZ2luZS9zcmMvY29uZmlnL3JlZHV4L3JlZHV4LnJlZHVjZXInO1xyXG5cclxuZXhwb3J0IGNvbnN0IHJlZHVjZXIgPSBjb21iaW5lUmVkdWNlcnMoe1xyXG4gICAgYXBwUmVkdWNlcixcclxuICAgIGVuZ2luZVJlZHVjZXJcclxufSk7IiwiaW1wb3J0IHsgVVBEQVRFX1ZJRVdfU0VUVElOR1MsIEdfQ0xJQ0tFRCwgQUREX0lOUFVUX1ZBTFVFX0NIQU5HRUQsIEFERF9JTlBVVF9UQUdfQ0hBTkdFRCwgVVBEQVRFX1BST0pFQ1QsIEFERF9QUk9KRUNUX0ZPUk0sIFVQREFURV9QUk9KRUNUX0lURU1TLCBVUERBVEVfUFJPSkVDVF9DT05UQUlORVIgfSBmcm9tICcuL3JlZHV4LmFjdGlvbnMudHlwZXMnO1xyXG5cclxuY29uc3QgaW5pdGlhbFN0YXRlID0ge1xyXG4gICAgd29ya3NwYWNlOiB7XHJcbiAgICAgICAgcHJvamVjdDoge1xyXG4gICAgICAgICAgICBjb25maWc6IHt9LFxyXG4gICAgICAgICAgICB1aToge1xyXG4gICAgICAgICAgICAgICAgZ0NsYXNzTGlzdDogJ2dpZCcsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGFkZDoge30sXHJcbiAgICAgICAgICAgIGl0ZW1zOiB7fVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBlbmdpbmVSZWR1Y2VyID0gKHN0YXRlID0gaW5pdGlhbFN0YXRlLCBhY3Rpb24pID0+IHtcclxuICAgIHZhciB3b3Jrc3BhY2UgPSBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZS53b3Jrc3BhY2UpO1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgQUREX1BST0pFQ1RfRk9STTpcclxuICAgICAgICAgICAgd29ya3NwYWNlLnByb2plY3QuaWQgPSBwYXlsb2FkO1xyXG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHtcclxuICAgICAgICAgICAgICAgIHdvcmtzcGFjZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICBjYXNlIFVQREFURV9WSUVXX1NFVFRJTkdTOlxyXG4gICAgICAgICAgICB3b3Jrc3BhY2UucHJvamVjdC5jb25maWcudmlld1dpZHRoID0gYWN0aW9uLnBheWxvYWQudmlld1dpZHRoIHx8IHN0YXRlLndvcmtzcGFjZS5wcm9qZWN0LmNvbmZpZy52aWV3V2lkdGg7XHJcbiAgICAgICAgICAgIHdvcmtzcGFjZS5wcm9qZWN0LmNvbmZpZy52aWV3SGVpZ2h0ID0gYWN0aW9uLnBheWxvYWQudmlld0hlaWdodCB8fCBzdGF0ZS53b3Jrc3BhY2UucHJvamVjdC5jb25maWcudmlld0hlaWdodDtcclxuICAgICAgICAgICAgd29ya3NwYWNlLnByb2plY3QuY29uZmlnLmNlbGxXaWR0aCA9IGFjdGlvbi5wYXlsb2FkLmNlbGxXaWR0aCB8fCBzdGF0ZS53b3Jrc3BhY2UucHJvamVjdC5jb25maWcuY2VsbFdpZHRoO1xyXG4gICAgICAgICAgICB3b3Jrc3BhY2UucHJvamVjdC5jb25maWcuY2VsbEhlaWdodCA9IGFjdGlvbi5wYXlsb2FkLmNlbGxIZWlnaHQgfHwgc3RhdGUud29ya3NwYWNlLnByb2plY3QuY29uZmlnLmNlbGxIZWlnaHQ7XHJcbiAgICAgICAgICAgIHdvcmtzcGFjZS5wcm9qZWN0LmNvbmZpZy5jZWxsVHJhbnNmb3JtID0gYWN0aW9uLnBheWxvYWQuY2VsbFRyYW5zZm9ybSB8fCBzdGF0ZS53b3Jrc3BhY2UucHJvamVjdC5jb25maWcuY2VsbFRyYW5zZm9ybTtcclxuICAgICAgICAgICAgd29ya3NwYWNlLnByb2plY3QuY29uZmlnLmN1cnJlbnRfeCA9IGFjdGlvbi5wYXlsb2FkLmN1cnJlbnRfeCB8fCBzdGF0ZS53b3Jrc3BhY2UucHJvamVjdC5jb25maWcuY3VycmVudF94O1xyXG4gICAgICAgICAgICB3b3Jrc3BhY2UucHJvamVjdC5jb25maWcuY3VycmVudF95ID0gYWN0aW9uLnBheWxvYWQuY3VycmVudF95IHx8IHN0YXRlLndvcmtzcGFjZS5wcm9qZWN0LmNvbmZpZy5jdXJyZW50X3k7XHJcbiAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwge1xyXG4gICAgICAgICAgICAgICAgd29ya3NwYWNlXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIGNhc2UgR19DTElDS0VEOlxyXG4gICAgICAgICAgICB3b3Jrc3BhY2UucHJvamVjdC5jb25maWcuY2VsbFRyYW5zZm9ybSA9IGFjdGlvbi5wYXlsb2FkLmNlbGxUcmFuc2Zvcm0gfHwgc3RhdGUud29ya3NwYWNlLnByb2plY3QuY29uZmlnLmNlbGxUcmFuc2Zvcm07XHJcbiAgICAgICAgICAgIHdvcmtzcGFjZS5wcm9qZWN0LmNvbmZpZy5jdXJyZW50X3ggPSBhY3Rpb24ucGF5bG9hZC5jdXJyZW50X3ggfHwgc3RhdGUud29ya3NwYWNlLnByb2plY3QuY29uZmlnLmN1cnJlbnRfeDtcclxuICAgICAgICAgICAgd29ya3NwYWNlLnByb2plY3QuY29uZmlnLmN1cnJlbnRfeSA9IGFjdGlvbi5wYXlsb2FkLmN1cnJlbnRfeSB8fCBzdGF0ZS53b3Jrc3BhY2UucHJvamVjdC5jb25maWcuY3VycmVudF95O1xyXG4gICAgICAgICAgICB3b3Jrc3BhY2UucHJvamVjdC5hZGQuYWRkQ29tcG9uZW50ID0gYWN0aW9uLnBheWxvYWQuYWRkQ29tcG9uZW50O1xyXG4gICAgICAgICAgICB3b3Jrc3BhY2UucHJvamVjdC51aS5nQ2xhc3NMaXN0ID0gYWN0aW9uLnBheWxvYWQuZ0NsYXNzTGlzdCB8fCBzdGF0ZS53b3Jrc3BhY2UudWkucHJvamVjdC5nQ2xhc3NMaXN0O1xyXG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHtcclxuICAgICAgICAgICAgICAgIHdvcmtzcGFjZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICBjYXNlIEFERF9JTlBVVF9WQUxVRV9DSEFOR0VEOlxyXG4gICAgICAgICAgICB3b3Jrc3BhY2UucHJvamVjdC5hZGQuYWRkSW5wdXRWYWx1ZSA9IGFjdGlvbi5wYXlsb2FkO1xyXG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHtcclxuICAgICAgICAgICAgICAgIHdvcmtzcGFjZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICBjYXNlIEFERF9JTlBVVF9UQUdfQ0hBTkdFRDpcclxuICAgICAgICAgICAgd29ya3NwYWNlLnByb2plY3QuYWRkLmFkZElucHV0VGFnID0gYWN0aW9uLnBheWxvYWQ7XHJcbiAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwge1xyXG4gICAgICAgICAgICAgICAgd29ya3NwYWNlXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIGNhc2UgVVBEQVRFX1BST0pFQ1Q6XHJcbiAgICAgICAgICAgIGNvbnN0IHBhcnRzID0gYWN0aW9uLnBheWxvYWQucGF0aC5zcGxpdCgnLicpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGl0ZW0gPSB3b3Jrc3BhY2UucHJvamVjdC5pdGVtcztcclxuICAgICAgICAgICAgcGFydHMuZm9yRWFjaCgocGFydCwgaSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKChpICsgMSkgPT09IHBhcnRzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1bcGFydF0gPSBhY3Rpb24ucGF5bG9hZC52YWx1ZTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbSA9IGl0ZW1bcGFydF07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLCB7XHJcbiAgICAgICAgICAgICAgICB3b3Jrc3BhY2VcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgY2FzZSBVUERBVEVfUFJPSkVDVF9JVEVNUzpcclxuICAgICAgICAgICAgd29ya3NwYWNlLnByb2plY3QuaXRlbXMgPSBhY3Rpb24ucGF5bG9hZDtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwge1xyXG4gICAgICAgICAgICAgICAgd29ya3NwYWNlXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIGNhc2UgVVBEQVRFX1BST0pFQ1RfQ09OVEFJTkVSOlxyXG4gICAgICAgICAgICB3b3Jrc3BhY2UucHJvamVjdC5jb250YWluZXIgPSBhY3Rpb24ucGF5bG9hZDtcclxuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLCB7XHJcbiAgICAgICAgICAgICAgICB3b3Jrc3BhY2VcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHJldHVybiBzdGF0ZTtcclxufTsiLCJleHBvcnQgY29uc3QgVVBEQVRFX1ZJRVdfU0VUVElOR1MgPSAnVVBEQVRFX1ZJRVdfU0VUVElOR1MnO1xyXG5leHBvcnQgY29uc3QgVVBEQVRFX0JHX0lNQUdFID0gJ1VQREFURV9CR19JTUFHRSc7XHJcbmV4cG9ydCBjb25zdCBVUERBVEVfVE9LRU4gPSAnVVBEQVRFX1RPS0VOJzsiLCJpbXBvcnQgeyBjcmVhdGVTdG9yZSB9IGZyb20gJ3JlZHV4JztcclxuaW1wb3J0IHsgcmVkdWNlciB9IGZyb20gJy4vcmVkdXgucmVkdWNlcic7XHJcblxyXG5leHBvcnQgY29uc3Qgc3RvcmUgPSBjcmVhdGVTdG9yZShyZWR1Y2VyKTsiLCJleHBvcnQgY29uc3QgVVBEQVRFX1ZJRVdfU0VUVElOR1MgPSAnVVBEQVRFX1ZJRVdfU0VUVElOR1MnO1xyXG5leHBvcnQgY29uc3QgR19DTElDS0VEID0gJ0dfQ0xJQ0tFRCc7XHJcbmV4cG9ydCBjb25zdCBBRERfSU5QVVRfVkFMVUVfQ0hBTkdFRCA9ICdBRERfSU5QVVRfVkFMVUVfQ0hBTkdFRCc7XHJcbmV4cG9ydCBjb25zdCBBRERfSU5QVVRfVEFHX0NIQU5HRUQgPSAnQUREX0lOUFVUX1RBR19DSEFOR0VEJztcclxuZXhwb3J0IGNvbnN0IEFERF9QUk9KRUNUX0ZPUk0gPSAnQUREX1BST0pFQ1RfRk9STSc7XHJcbmV4cG9ydCBjb25zdCBVUERBVEVfUFJPSkVDVCA9ICdVUERBVEVfUFJPSkVDVCc7XHJcbmV4cG9ydCBjb25zdCBVUERBVEVfUFJPSkVDVF9JVEVNUyA9ICdVUERBVEVfUFJPSkVDVF9JVEVNJztcclxuZXhwb3J0IGNvbnN0IFVQREFURV9QUk9KRUNUX0NPTlRBSU5FUiA9ICdVUERBVEVfUFJPSkVDVF9DT05UQUlORVInOyJdLCJzb3VyY2VSb290IjoiIn0=