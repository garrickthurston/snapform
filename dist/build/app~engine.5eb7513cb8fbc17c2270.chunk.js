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
      items: {},
      items_array: []
    }
  }
};
const engineReducer = (state = initialState, action) => {
  var workspace = Object.assign({}, state.workspace);

  switch (action.type) {
    case _redux_actions_types__WEBPACK_IMPORTED_MODULE_0__["ADD_PROJECT_FORM"]:
      workspace.id = action.payload.workspace_id;
      workspace.project.id = action.payload.project_id;
      workspace.project.name = action.payload.project_name;
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
      var items = workspace.project.items;
      parts.forEach((part, i) => {
        if (i + 1 === parts.length) {
          items[part] = action.payload.value;
        } else {
          items = item[part];
        }
      }); // workspace.project.items_array = [];
      // Object.keys(items).forEach((key) => {
      //     const item = items[key];
      //     workspace.project.items_array.push({
      //         props: Object.assign({}, item, {
      //             uid: key
      //         })
      //     });
      // });

      return Object.assign({}, state, {
        workspace
      });

    case _redux_actions_types__WEBPACK_IMPORTED_MODULE_0__["UPDATE_PROJECT_ITEMS"]:
      workspace.project.items = action.payload; // workspace.project.items_array = [];
      // Object.keys(action.payload).forEach((key) => {
      //     const item = action.payload[key];
      //     workspace.project.items_array.push({
      //         props: Object.assign({}, item, {
      //             uid: key
      //         })
      //     });
      // });

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vdXRpbCAoaWdub3JlZCkiLCJ3ZWJwYWNrOi8vL3V0aWwgKGlnbm9yZWQpPzEzZTEiLCJ3ZWJwYWNrOi8vL2J1ZmZlciAoaWdub3JlZCkiLCJ3ZWJwYWNrOi8vL2NyeXB0byAoaWdub3JlZCkiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L2FwcC9zcmMvY29uZmlnL3JlZHV4L3JlZHV4LnJlZHVjZXIuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L2NvbW1vbi9jb25maWcvcmVkdXgvcmVkdXgucmVkdWNlci5qcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvZW5naW5lL3NyYy9jb25maWcvcmVkdXgvcmVkdXgucmVkdWNlci5qcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvYXBwL3NyYy9jb25maWcvcmVkdXgvcmVkdXguYWN0aW9ucy50eXBlcy5qcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvY29tbW9uL2NvbmZpZy9yZWR1eC9yZWR1eC5zdG9yZS5qcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvZW5naW5lL3NyYy9jb25maWcvcmVkdXgvcmVkdXguYWN0aW9ucy50eXBlcy5qcyJdLCJuYW1lcyI6WyJqd3QiLCJyZXF1aXJlIiwidG9rZW4iLCJsb2NhbFN0b3JhZ2UiLCJnZXRJdGVtIiwiaW5pdGlhbFN0YXRlIiwidXNlciIsImRlY29kZSIsImFwcFJlZHVjZXIiLCJzdGF0ZSIsImFjdGlvbiIsInR5cGUiLCJVUERBVEVfVklFV19TRVRUSU5HUyIsIk9iamVjdCIsImFzc2lnbiIsInZpZXdXaWR0aCIsInBheWxvYWQiLCJ2aWV3SGVpZ2h0IiwiY2VsbFdpZHRoIiwiY2VsbEhlaWdodCIsImNlbGxUcmFuc2Zvcm0iLCJVUERBVEVfQkdfSU1BR0UiLCJiYWNrZ3JvdW5kSW1hZ2UiLCJVUERBVEVfVE9LRU4iLCJzZXRJdGVtIiwicmVtb3ZlSXRlbSIsInJlZHVjZXIiLCJjb21iaW5lUmVkdWNlcnMiLCJlbmdpbmVSZWR1Y2VyIiwid29ya3NwYWNlIiwicHJvamVjdCIsImNvbmZpZyIsInVpIiwiZ0NsYXNzTGlzdCIsImFkZCIsIml0ZW1zIiwiaXRlbXNfYXJyYXkiLCJBRERfUFJPSkVDVF9GT1JNIiwiaWQiLCJ3b3Jrc3BhY2VfaWQiLCJwcm9qZWN0X2lkIiwibmFtZSIsInByb2plY3RfbmFtZSIsImN1cnJlbnRfeCIsImN1cnJlbnRfeSIsIkdfQ0xJQ0tFRCIsImFkZENvbXBvbmVudCIsIkFERF9JTlBVVF9WQUxVRV9DSEFOR0VEIiwiYWRkSW5wdXRWYWx1ZSIsIkFERF9JTlBVVF9UQUdfQ0hBTkdFRCIsImFkZElucHV0VGFnIiwiVVBEQVRFX1BST0pFQ1QiLCJwYXJ0cyIsInBhdGgiLCJzcGxpdCIsImZvckVhY2giLCJwYXJ0IiwiaSIsImxlbmd0aCIsInZhbHVlIiwiaXRlbSIsIlVQREFURV9QUk9KRUNUX0lURU1TIiwiVVBEQVRFX1BST0pFQ1RfQ09OVEFJTkVSIiwiY29udGFpbmVyIiwic3RvcmUiLCJjcmVhdGVTdG9yZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsZTs7Ozs7Ozs7Ozs7QUNBQSxlOzs7Ozs7Ozs7OztBQ0FBLGU7Ozs7Ozs7Ozs7O0FDQUEsZTs7Ozs7Ozs7Ozs7O0FDQUE7QUFBQTtBQUFBO0FBQUE7O0FBQ0EsTUFBTUEsR0FBRyxHQUFHQyxtQkFBTyxDQUFDLDBCQUFELENBQW5COztBQUVBLE1BQU1DLEtBQUssR0FBR0MsWUFBWSxDQUFDQyxPQUFiLENBQXFCLE9BQXJCLENBQWQ7QUFDQSxNQUFNQyxZQUFZLEdBQUc7QUFDakJILE9BQUssRUFBRUEsS0FEVTtBQUVqQkksTUFBSSxFQUFFSixLQUFLLEdBQUdGLEdBQUcsQ0FBQ08sTUFBSixDQUFXTCxLQUFYLENBQUgsR0FBdUI7QUFGakIsQ0FBckI7QUFLTyxNQUFNTSxVQUFVLEdBQUcsQ0FBQ0MsS0FBSyxHQUFHSixZQUFULEVBQXVCSyxNQUF2QixLQUFrQztBQUN4RCxVQUFRQSxNQUFNLENBQUNDLElBQWY7QUFDSSxTQUFLQyx5RUFBTDtBQUNJLGFBQU9DLE1BQU0sQ0FBQ0MsTUFB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YyxjQUFjLEdBQUcsZ0JBQXZCO0FBQ0EsTUFBTVUsb0JBQW9CLEdBQUcscUJBQTdCO0FBQ0EsTUFBTUMsd0JBQXdCLEdBQUcsMEJBQWpDLEMiLCJmaWxlIjoiYnVpbGQvYXBwfmVuZ2luZS41ZWI3NTEzY2I4ZmJjMTdjMjI3MC5jaHVuay5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIChpZ25vcmVkKSAqLyIsIi8qIChpZ25vcmVkKSAqLyIsIi8qIChpZ25vcmVkKSAqLyIsIi8qIChpZ25vcmVkKSAqLyIsImltcG9ydCB7IFVQREFURV9WSUVXX1NFVFRJTkdTLCBVUERBVEVfQkdfSU1BR0UsIFVQREFURV9UT0tFTiB9IGZyb20gJy4vcmVkdXguYWN0aW9ucy50eXBlcyc7XHJcbmNvbnN0IGp3dCA9IHJlcXVpcmUoJ2pzb253ZWJ0b2tlbicpO1xyXG5cclxuY29uc3QgdG9rZW4gPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndG9rZW4nKTtcclxuY29uc3QgaW5pdGlhbFN0YXRlID0ge1xyXG4gICAgdG9rZW46IHRva2VuLFxyXG4gICAgdXNlcjogdG9rZW4gPyBqd3QuZGVjb2RlKHRva2VuKSA6IG51bGxcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBhcHBSZWR1Y2VyID0gKHN0YXRlID0gaW5pdGlhbFN0YXRlLCBhY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlIFVQREFURV9WSUVXX1NFVFRJTkdTOlxyXG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHtcclxuICAgICAgICAgICAgICAgIHZpZXdXaWR0aDogYWN0aW9uLnBheWxvYWQudmlld1dpZHRoIHx8IHN0YXRlLnZpZXdXaWR0aCxcclxuICAgICAgICAgICAgICAgIHZpZXdIZWlnaHQ6IGFjdGlvbi5wYXlsb2FkLnZpZXdIZWlnaHQgfHwgc3RhdGUudmlld0hlaWdodCxcclxuICAgICAgICAgICAgICAgIGNlbGxXaWR0aDogYWN0aW9uLnBheWxvYWQuY2VsbFdpZHRoIHx8IHN0YXRlLmNlbGxXaWR0aCxcclxuICAgICAgICAgICAgICAgIGNlbGxIZWlnaHQ6IGFjdGlvbi5wYXlsb2FkLmNlbGxIZWlnaHQgfHwgc3RhdGUuY2VsbEhlaWdodCxcclxuICAgICAgICAgICAgICAgIGNlbGxUcmFuc2Zvcm06IGFjdGlvbi5wYXlsb2FkLmNlbGxUcmFuc2Zvcm0gfHwgc3RhdGUuY2VsbFRyYW5zZm9ybVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICBjYXNlIFVQREFURV9CR19JTUFHRTpcclxuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLCB7XHJcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kSW1hZ2U6IGFjdGlvbi5wYXlsb2FkIHx8IHN0YXRlLmJhY2tncm91bmRJbWFnZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICBjYXNlIFVQREFURV9UT0tFTjpcclxuICAgICAgICAgICAgaWYgKGFjdGlvbi5wYXlsb2FkKSB7XHJcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgndG9rZW4nLCBhY3Rpb24ucGF5bG9hZCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgndG9rZW4nKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHtcclxuICAgICAgICAgICAgICAgIHRva2VuOiBhY3Rpb24ucGF5bG9hZCxcclxuICAgICAgICAgICAgICAgIHVzZXI6IGFjdGlvbi5wYXlsb2FkID8gand0LmRlY29kZShhY3Rpb24ucGF5bG9hZCkgOiBudWxsXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHN0YXRlO1xyXG59OyIsImltcG9ydCB7IGNvbWJpbmVSZWR1Y2VycyB9IGZyb20gJ3JlZHV4JztcclxuaW1wb3J0IHsgYXBwUmVkdWNlciB9IGZyb20gJy4uLy4uLy4uL2FwcC9zcmMvY29uZmlnL3JlZHV4L3JlZHV4LnJlZHVjZXInO1xyXG5pbXBvcnQgeyBlbmdpbmVSZWR1Y2VyIH0gZnJvbSAnLi4vLi4vLi4vZW5naW5lL3NyYy9jb25maWcvcmVkdXgvcmVkdXgucmVkdWNlcic7XHJcblxyXG5leHBvcnQgY29uc3QgcmVkdWNlciA9IGNvbWJpbmVSZWR1Y2Vycyh7XHJcbiAgICBhcHBSZWR1Y2VyLFxyXG4gICAgZW5naW5lUmVkdWNlclxyXG59KTsiLCJpbXBvcnQgeyBVUERBVEVfVklFV19TRVRUSU5HUywgR19DTElDS0VELCBBRERfSU5QVVRfVkFMVUVfQ0hBTkdFRCwgQUREX0lOUFVUX1RBR19DSEFOR0VELCBVUERBVEVfUFJPSkVDVCwgQUREX1BST0pFQ1RfRk9STSwgVVBEQVRFX1BST0pFQ1RfSVRFTVMsIFVQREFURV9QUk9KRUNUX0NPTlRBSU5FUiB9IGZyb20gJy4vcmVkdXguYWN0aW9ucy50eXBlcyc7XHJcblxyXG5jb25zdCBpbml0aWFsU3RhdGUgPSB7XHJcbiAgICB3b3Jrc3BhY2U6IHtcclxuICAgICAgICBwcm9qZWN0OiB7XHJcbiAgICAgICAgICAgIGNvbmZpZzoge30sXHJcbiAgICAgICAgICAgIHVpOiB7XHJcbiAgICAgICAgICAgICAgICBnQ2xhc3NMaXN0OiAnZ2lkJyxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgYWRkOiB7fSxcclxuICAgICAgICAgICAgaXRlbXM6IHt9LFxyXG4gICAgICAgICAgICBpdGVtc19hcnJheTogW11cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgZW5naW5lUmVkdWNlciA9IChzdGF0ZSA9IGluaXRpYWxTdGF0ZSwgYWN0aW9uKSA9PiB7XHJcbiAgICB2YXIgd29ya3NwYWNlID0gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUud29ya3NwYWNlKTtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlIEFERF9QUk9KRUNUX0ZPUk06XHJcbiAgICAgICAgICAgIHdvcmtzcGFjZS5pZCA9IGFjdGlvbi5wYXlsb2FkLndvcmtzcGFjZV9pZDtcclxuICAgICAgICAgICAgd29ya3NwYWNlLnByb2plY3QuaWQgPSBhY3Rpb24ucGF5bG9hZC5wcm9qZWN0X2lkO1xyXG4gICAgICAgICAgICB3b3Jrc3BhY2UucHJvamVjdC5uYW1lID0gYWN0aW9uLnBheWxvYWQucHJvamVjdF9uYW1lO1xyXG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHtcclxuICAgICAgICAgICAgICAgIHdvcmtzcGFjZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICBjYXNlIFVQREFURV9WSUVXX1NFVFRJTkdTOlxyXG4gICAgICAgICAgICB3b3Jrc3BhY2UucHJvamVjdC5jb25maWcudmlld1dpZHRoID0gYWN0aW9uLnBheWxvYWQudmlld1dpZHRoIHx8IHN0YXRlLndvcmtzcGFjZS5wcm9qZWN0LmNvbmZpZy52aWV3V2lkdGg7XHJcbiAgICAgICAgICAgIHdvcmtzcGFjZS5wcm9qZWN0LmNvbmZpZy52aWV3SGVpZ2h0ID0gYWN0aW9uLnBheWxvYWQudmlld0hlaWdodCB8fCBzdGF0ZS53b3Jrc3BhY2UucHJvamVjdC5jb25maWcudmlld0hlaWdodDtcclxuICAgICAgICAgICAgd29ya3NwYWNlLnByb2plY3QuY29uZmlnLmNlbGxXaWR0aCA9IGFjdGlvbi5wYXlsb2FkLmNlbGxXaWR0aCB8fCBzdGF0ZS53b3Jrc3BhY2UucHJvamVjdC5jb25maWcuY2VsbFdpZHRoO1xyXG4gICAgICAgICAgICB3b3Jrc3BhY2UucHJvamVjdC5jb25maWcuY2VsbEhlaWdodCA9IGFjdGlvbi5wYXlsb2FkLmNlbGxIZWlnaHQgfHwgc3RhdGUud29ya3NwYWNlLnByb2plY3QuY29uZmlnLmNlbGxIZWlnaHQ7XHJcbiAgICAgICAgICAgIHdvcmtzcGFjZS5wcm9qZWN0LmNvbmZpZy5jZWxsVHJhbnNmb3JtID0gYWN0aW9uLnBheWxvYWQuY2VsbFRyYW5zZm9ybSB8fCBzdGF0ZS53b3Jrc3BhY2UucHJvamVjdC5jb25maWcuY2VsbFRyYW5zZm9ybTtcclxuICAgICAgICAgICAgd29ya3NwYWNlLnByb2plY3QuY29uZmlnLmN1cnJlbnRfeCA9IGFjdGlvbi5wYXlsb2FkLmN1cnJlbnRfeCB8fCBzdGF0ZS53b3Jrc3BhY2UucHJvamVjdC5jb25maWcuY3VycmVudF94O1xyXG4gICAgICAgICAgICB3b3Jrc3BhY2UucHJvamVjdC5jb25maWcuY3VycmVudF95ID0gYWN0aW9uLnBheWxvYWQuY3VycmVudF95IHx8IHN0YXRlLndvcmtzcGFjZS5wcm9qZWN0LmNvbmZpZy5jdXJyZW50X3k7XHJcbiAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwge1xyXG4gICAgICAgICAgICAgICAgd29ya3NwYWNlXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIGNhc2UgR19DTElDS0VEOlxyXG4gICAgICAgICAgICB3b3Jrc3BhY2UucHJvamVjdC5jb25maWcuY2VsbFRyYW5zZm9ybSA9IGFjdGlvbi5wYXlsb2FkLmNlbGxUcmFuc2Zvcm0gfHwgc3RhdGUud29ya3NwYWNlLnByb2plY3QuY29uZmlnLmNlbGxUcmFuc2Zvcm07XHJcbiAgICAgICAgICAgIHdvcmtzcGFjZS5wcm9qZWN0LmNvbmZpZy5jdXJyZW50X3ggPSBhY3Rpb24ucGF5bG9hZC5jdXJyZW50X3ggfHwgc3RhdGUud29ya3NwYWNlLnByb2plY3QuY29uZmlnLmN1cnJlbnRfeDtcclxuICAgICAgICAgICAgd29ya3NwYWNlLnByb2plY3QuY29uZmlnLmN1cnJlbnRfeSA9IGFjdGlvbi5wYXlsb2FkLmN1cnJlbnRfeSB8fCBzdGF0ZS53b3Jrc3BhY2UucHJvamVjdC5jb25maWcuY3VycmVudF95O1xyXG4gICAgICAgICAgICB3b3Jrc3BhY2UucHJvamVjdC5hZGQuYWRkQ29tcG9uZW50ID0gYWN0aW9uLnBheWxvYWQuYWRkQ29tcG9uZW50O1xyXG4gICAgICAgICAgICB3b3Jrc3BhY2UucHJvamVjdC51aS5nQ2xhc3NMaXN0ID0gYWN0aW9uLnBheWxvYWQuZ0NsYXNzTGlzdCB8fCBzdGF0ZS53b3Jrc3BhY2UudWkucHJvamVjdC5nQ2xhc3NMaXN0O1xyXG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHtcclxuICAgICAgICAgICAgICAgIHdvcmtzcGFjZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICBjYXNlIEFERF9JTlBVVF9WQUxVRV9DSEFOR0VEOlxyXG4gICAgICAgICAgICB3b3Jrc3BhY2UucHJvamVjdC5hZGQuYWRkSW5wdXRWYWx1ZSA9IGFjdGlvbi5wYXlsb2FkO1xyXG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHtcclxuICAgICAgICAgICAgICAgIHdvcmtzcGFjZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICBjYXNlIEFERF9JTlBVVF9UQUdfQ0hBTkdFRDpcclxuICAgICAgICAgICAgd29ya3NwYWNlLnByb2plY3QuYWRkLmFkZElucHV0VGFnID0gYWN0aW9uLnBheWxvYWQ7XHJcbiAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwge1xyXG4gICAgICAgICAgICAgICAgd29ya3NwYWNlXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIGNhc2UgVVBEQVRFX1BST0pFQ1Q6XHJcbiAgICAgICAgICAgIGNvbnN0IHBhcnRzID0gYWN0aW9uLnBheWxvYWQucGF0aC5zcGxpdCgnLicpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGl0ZW1zID0gd29ya3NwYWNlLnByb2plY3QuaXRlbXM7XHJcbiAgICAgICAgICAgIHBhcnRzLmZvckVhY2goKHBhcnQsIGkpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICgoaSArIDEpID09PSBwYXJ0cy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtc1twYXJ0XSA9IGFjdGlvbi5wYXlsb2FkLnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtcyA9IGl0ZW1bcGFydF07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgLy8gd29ya3NwYWNlLnByb2plY3QuaXRlbXNfYXJyYXkgPSBbXTtcclxuICAgICAgICAgICAgLy8gT2JqZWN0LmtleXMoaXRlbXMpLmZvckVhY2goKGtleSkgPT4ge1xyXG4gICAgICAgICAgICAvLyAgICAgY29uc3QgaXRlbSA9IGl0ZW1zW2tleV07XHJcbiAgICAgICAgICAgIC8vICAgICB3b3Jrc3BhY2UucHJvamVjdC5pdGVtc19hcnJheS5wdXNoKHtcclxuICAgICAgICAgICAgLy8gICAgICAgICBwcm9wczogT2JqZWN0LmFzc2lnbih7fSwgaXRlbSwge1xyXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICB1aWQ6IGtleVxyXG4gICAgICAgICAgICAvLyAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC8vICAgICB9KTtcclxuICAgICAgICAgICAgLy8gfSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHtcclxuICAgICAgICAgICAgICAgIHdvcmtzcGFjZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICBjYXNlIFVQREFURV9QUk9KRUNUX0lURU1TOlxyXG4gICAgICAgICAgICB3b3Jrc3BhY2UucHJvamVjdC5pdGVtcyA9IGFjdGlvbi5wYXlsb2FkO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLy8gd29ya3NwYWNlLnByb2plY3QuaXRlbXNfYXJyYXkgPSBbXTtcclxuICAgICAgICAgICAgLy8gT2JqZWN0LmtleXMoYWN0aW9uLnBheWxvYWQpLmZvckVhY2goKGtleSkgPT4ge1xyXG4gICAgICAgICAgICAvLyAgICAgY29uc3QgaXRlbSA9IGFjdGlvbi5wYXlsb2FkW2tleV07XHJcbiAgICAgICAgICAgIC8vICAgICB3b3Jrc3BhY2UucHJvamVjdC5pdGVtc19hcnJheS5wdXNoKHtcclxuICAgICAgICAgICAgLy8gICAgICAgICBwcm9wczogT2JqZWN0LmFzc2lnbih7fSwgaXRlbSwge1xyXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICB1aWQ6IGtleVxyXG4gICAgICAgICAgICAvLyAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC8vICAgICB9KTtcclxuICAgICAgICAgICAgLy8gfSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHtcclxuICAgICAgICAgICAgICAgIHdvcmtzcGFjZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICBjYXNlIFVQREFURV9QUk9KRUNUX0NPTlRBSU5FUjpcclxuICAgICAgICAgICAgd29ya3NwYWNlLnByb2plY3QuY29udGFpbmVyID0gYWN0aW9uLnBheWxvYWQ7XHJcbiAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwge1xyXG4gICAgICAgICAgICAgICAgd29ya3NwYWNlXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICByZXR1cm4gc3RhdGU7XHJcbn07IiwiZXhwb3J0IGNvbnN0IFVQREFURV9WSUVXX1NFVFRJTkdTID0gJ1VQREFURV9WSUVXX1NFVFRJTkdTJztcclxuZXhwb3J0IGNvbnN0IFVQREFURV9CR19JTUFHRSA9ICdVUERBVEVfQkdfSU1BR0UnO1xyXG5leHBvcnQgY29uc3QgVVBEQVRFX1RPS0VOID0gJ1VQREFURV9UT0tFTic7IiwiaW1wb3J0IHsgY3JlYXRlU3RvcmUgfSBmcm9tICdyZWR1eCc7XHJcbmltcG9ydCB7IHJlZHVjZXIgfSBmcm9tICcuL3JlZHV4LnJlZHVjZXInO1xyXG5cclxuZXhwb3J0IGNvbnN0IHN0b3JlID0gY3JlYXRlU3RvcmUocmVkdWNlcik7IiwiZXhwb3J0IGNvbnN0IFVQREFURV9WSUVXX1NFVFRJTkdTID0gJ1VQREFURV9WSUVXX1NFVFRJTkdTJztcclxuZXhwb3J0IGNvbnN0IEdfQ0xJQ0tFRCA9ICdHX0NMSUNLRUQnO1xyXG5leHBvcnQgY29uc3QgQUREX0lOUFVUX1ZBTFVFX0NIQU5HRUQgPSAnQUREX0lOUFVUX1ZBTFVFX0NIQU5HRUQnO1xyXG5leHBvcnQgY29uc3QgQUREX0lOUFVUX1RBR19DSEFOR0VEID0gJ0FERF9JTlBVVF9UQUdfQ0hBTkdFRCc7XHJcbmV4cG9ydCBjb25zdCBBRERfUFJPSkVDVF9GT1JNID0gJ0FERF9QUk9KRUNUX0ZPUk0nO1xyXG5leHBvcnQgY29uc3QgVVBEQVRFX1BST0pFQ1QgPSAnVVBEQVRFX1BST0pFQ1QnO1xyXG5leHBvcnQgY29uc3QgVVBEQVRFX1BST0pFQ1RfSVRFTVMgPSAnVVBEQVRFX1BST0pFQ1RfSVRFTSc7XHJcbmV4cG9ydCBjb25zdCBVUERBVEVfUFJPSkVDVF9DT05UQUlORVIgPSAnVVBEQVRFX1BST0pFQ1RfQ09OVEFJTkVSJzsiXSwic291cmNlUm9vdCI6IiJ9