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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vdXRpbCAoaWdub3JlZCkiLCJ3ZWJwYWNrOi8vL3V0aWwgKGlnbm9yZWQpPzEzZTEiLCJ3ZWJwYWNrOi8vL2J1ZmZlciAoaWdub3JlZCkiLCJ3ZWJwYWNrOi8vL2NyeXB0byAoaWdub3JlZCkiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L2FwcC9zcmMvY29uZmlnL3JlZHV4L3JlZHV4LnJlZHVjZXIuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L2NvbW1vbi9jb25maWcvcmVkdXgvcmVkdXgucmVkdWNlci5qcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvZW5naW5lL3NyYy9jb25maWcvcmVkdXgvcmVkdXgucmVkdWNlci5qcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvYXBwL3NyYy9jb25maWcvcmVkdXgvcmVkdXguYWN0aW9ucy50eXBlcy5qcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvY29tbW9uL2NvbmZpZy9yZWR1eC9yZWR1eC5zdG9yZS5qcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvZW5naW5lL3NyYy9jb25maWcvcmVkdXgvcmVkdXguYWN0aW9ucy50eXBlcy5qcyJdLCJuYW1lcyI6WyJqd3QiLCJyZXF1aXJlIiwidG9rZW4iLCJsb2NhbFN0b3JhZ2UiLCJnZXRJdGVtIiwiaW5pdGlhbFN0YXRlIiwidXNlciIsImRlY29kZSIsImFwcFJlZHVjZXIiLCJzdGF0ZSIsImFjdGlvbiIsInR5cGUiLCJVUERBVEVfVklFV19TRVRUSU5HUyIsIk9iamVjdCIsImFzc2lnbiIsInZpZXdXaWR0aCIsInBheWxvYWQiLCJ2aWV3SGVpZ2h0IiwiY2VsbFdpZHRoIiwiY2VsbEhlaWdodCIsImNlbGxUcmFuc2Zvcm0iLCJVUERBVEVfQkdfSU1BR0UiLCJiYWNrZ3JvdW5kSW1hZ2UiLCJVUERBVEVfVE9LRU4iLCJzZXRJdGVtIiwicmVtb3ZlSXRlbSIsInJlZHVjZXIiLCJjb21iaW5lUmVkdWNlcnMiLCJlbmdpbmVSZWR1Y2VyIiwid29ya3NwYWNlIiwicHJvamVjdCIsImNvbmZpZyIsInVpIiwiZ0NsYXNzTGlzdCIsImFkZCIsIml0ZW1zIiwiQUREX1BST0pFQ1RfRk9STSIsImlkIiwid29ya3NwYWNlX2lkIiwicHJvamVjdF9pZCIsIm5hbWUiLCJwcm9qZWN0X25hbWUiLCJjdXJyZW50X3giLCJjdXJyZW50X3kiLCJHX0NMSUNLRUQiLCJhZGRDb21wb25lbnQiLCJBRERfSU5QVVRfVkFMVUVfQ0hBTkdFRCIsImFkZElucHV0VmFsdWUiLCJBRERfSU5QVVRfVEFHX0NIQU5HRUQiLCJhZGRJbnB1dFRhZyIsIlVQREFURV9QUk9KRUNUIiwicGFydHMiLCJwYXRoIiwic3BsaXQiLCJpdGVtIiwiZm9yRWFjaCIsInBhcnQiLCJpIiwibGVuZ3RoIiwidmFsdWUiLCJVUERBVEVfUFJPSkVDVF9JVEVNUyIsIlVQREFURV9QUk9KRUNUX0NPTlRBSU5FUiIsImNvbnRhaW5lciIsInN0b3JlIiwiY3JlYXRlU3RvcmUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBLGU7Ozs7Ozs7Ozs7O0FDQUEsZTs7Ozs7Ozs7Ozs7QUNBQSxlOzs7Ozs7Ozs7OztBQ0FBLGU7Ozs7Ozs7Ozs7OztBQ0FBO0FBQUE7QUFBQTtBQUFBOztBQUNBLE1BQU1BLEdBQUcsR0FBR0MsbUJBQU8sQ0FBQywwQkFBRCxDQUFuQjs7QUFFQSxNQUFNQyxLQUFLLEdBQUdDLFlBQVksQ0FBQ0MsT0FBYixDQUFxQixPQUFyQixDQUFkO0FBQ0EsTUFBTUMsWUFBWSxHQUFHO0FBQ2pCSCxPQUFLLEVBQUVBLEtBRFU7QUFFakJJLE1BQUksRUFBRUosS0FBSyxHQUFHRixHQUFHLENBQUNPLE1BQUosQ0FBV0wsS0FBWCxDQUFILEdBQXVCO0FBRmpCLENBQXJCO0FBS08sTUFBTU0sVUFBVSxHQUFHLENBQUNDLEtBQUssR0FBR0osWUFBVCxFQUF1QkssTUFBdkIsS0FBa0M7QUFDeEQsVUFBUUEsTUFBTSxDQUFDQyxJQUFmO0FBQ0ksU0FBS0MseUVBQUw7QUFDSSxhQUFPQyxNQUFNLENBQUNDLE1BQVAsQ0FBYyxFQUFkLEVB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Q29udGVudCI6WyIvKiAoaWdub3JlZCkgKi8iLCIvKiAoaWdub3JlZCkgKi8iLCIvKiAoaWdub3JlZCkgKi8iLCIvKiAoaWdub3JlZCkgKi8iLCJpbXBvcnQgeyBVUERBVEVfVklFV19TRVRUSU5HUywgVVBEQVRFX0JHX0lNQUdFLCBVUERBVEVfVE9LRU4gfSBmcm9tICcuL3JlZHV4LmFjdGlvbnMudHlwZXMnO1xyXG5jb25zdCBqd3QgPSByZXF1aXJlKCdqc29ud2VidG9rZW4nKTtcclxuXHJcbmNvbnN0IHRva2VuID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3Rva2VuJyk7XHJcbmNvbnN0IGluaXRpYWxTdGF0ZSA9IHtcclxuICAgIHRva2VuOiB0b2tlbixcclxuICAgIHVzZXI6IHRva2VuID8gand0LmRlY29kZSh0b2tlbikgOiBudWxsXHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgYXBwUmVkdWNlciA9IChzdGF0ZSA9IGluaXRpYWxTdGF0ZSwgYWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBVUERBVEVfVklFV19TRVRUSU5HUzpcclxuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLCB7XHJcbiAgICAgICAgICAgICAgICB2aWV3V2lkdGg6IGFjdGlvbi5wYXlsb2FkLnZpZXdXaWR0aCB8fCBzdGF0ZS52aWV3V2lkdGgsXHJcbiAgICAgICAgICAgICAgICB2aWV3SGVpZ2h0OiBhY3Rpb24ucGF5bG9hZC52aWV3SGVpZ2h0IHx8IHN0YXRlLnZpZXdIZWlnaHQsXHJcbiAgICAgICAgICAgICAgICBjZWxsV2lkdGg6IGFjdGlvbi5wYXlsb2FkLmNlbGxXaWR0aCB8fCBzdGF0ZS5jZWxsV2lkdGgsXHJcbiAgICAgICAgICAgICAgICBjZWxsSGVpZ2h0OiBhY3Rpb24ucGF5bG9hZC5jZWxsSGVpZ2h0IHx8IHN0YXRlLmNlbGxIZWlnaHQsXHJcbiAgICAgICAgICAgICAgICBjZWxsVHJhbnNmb3JtOiBhY3Rpb24ucGF5bG9hZC5jZWxsVHJhbnNmb3JtIHx8IHN0YXRlLmNlbGxUcmFuc2Zvcm1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgY2FzZSBVUERBVEVfQkdfSU1BR0U6XHJcbiAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwge1xyXG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZEltYWdlOiBhY3Rpb24ucGF5bG9hZCB8fCBzdGF0ZS5iYWNrZ3JvdW5kSW1hZ2VcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgY2FzZSBVUERBVEVfVE9LRU46XHJcbiAgICAgICAgICAgIGlmIChhY3Rpb24ucGF5bG9hZCkge1xyXG4gICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3Rva2VuJywgYWN0aW9uLnBheWxvYWQpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ3Rva2VuJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLCB7XHJcbiAgICAgICAgICAgICAgICB0b2tlbjogYWN0aW9uLnBheWxvYWQsXHJcbiAgICAgICAgICAgICAgICB1c2VyOiBhY3Rpb24ucGF5bG9hZCA/IGp3dC5kZWNvZGUoYWN0aW9uLnBheWxvYWQpIDogbnVsbFxyXG4gICAgICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIHJldHVybiBzdGF0ZTtcclxufTsiLCJpbXBvcnQgeyBjb21iaW5lUmVkdWNlcnMgfSBmcm9tICdyZWR1eCc7XHJcbmltcG9ydCB7IGFwcFJlZHVjZXIgfSBmcm9tICcuLi8uLi8uLi9hcHAvc3JjL2NvbmZpZy9yZWR1eC9yZWR1eC5yZWR1Y2VyJztcclxuaW1wb3J0IHsgZW5naW5lUmVkdWNlciB9IGZyb20gJy4uLy4uLy4uL2VuZ2luZS9zcmMvY29uZmlnL3JlZHV4L3JlZHV4LnJlZHVjZXInO1xyXG5cclxuZXhwb3J0IGNvbnN0IHJlZHVjZXIgPSBjb21iaW5lUmVkdWNlcnMoe1xyXG4gICAgYXBwUmVkdWNlcixcclxuICAgIGVuZ2luZVJlZHVjZXJcclxufSk7IiwiaW1wb3J0IHsgVVBEQVRFX1ZJRVdfU0VUVElOR1MsIEdfQ0xJQ0tFRCwgQUREX0lOUFVUX1ZBTFVFX0NIQU5HRUQsIEFERF9JTlBVVF9UQUdfQ0hBTkdFRCwgVVBEQVRFX1BST0pFQ1QsIEFERF9QUk9KRUNUX0ZPUk0sIFVQREFURV9QUk9KRUNUX0lURU1TLCBVUERBVEVfUFJPSkVDVF9DT05UQUlORVIgfSBmcm9tICcuL3JlZHV4LmFjdGlvbnMudHlwZXMnO1xyXG5cclxuY29uc3QgaW5pdGlhbFN0YXRlID0ge1xyXG4gICAgd29ya3NwYWNlOiB7XHJcbiAgICAgICAgcHJvamVjdDoge1xyXG4gICAgICAgICAgICBjb25maWc6IHt9LFxyXG4gICAgICAgICAgICB1aToge1xyXG4gICAgICAgICAgICAgICAgZ0NsYXNzTGlzdDogJ2dpZCcsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGFkZDoge30sXHJcbiAgICAgICAgICAgIGl0ZW1zOiB7fVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBlbmdpbmVSZWR1Y2VyID0gKHN0YXRlID0gaW5pdGlhbFN0YXRlLCBhY3Rpb24pID0+IHtcclxuICAgIHZhciB3b3Jrc3BhY2UgPSBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZS53b3Jrc3BhY2UpO1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgQUREX1BST0pFQ1RfRk9STTpcclxuICAgICAgICAgICAgd29ya3NwYWNlLmlkID0gYWN0aW9uLnBheWxvYWQud29ya3NwYWNlX2lkO1xyXG4gICAgICAgICAgICB3b3Jrc3BhY2UucHJvamVjdC5pZCA9IGFjdGlvbi5wYXlsb2FkLnByb2plY3RfaWQ7XHJcbiAgICAgICAgICAgIHdvcmtzcGFjZS5wcm9qZWN0Lm5hbWUgPSBhY3Rpb24ucGF5bG9hZC5wcm9qZWN0X25hbWU7XHJcbiAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwge1xyXG4gICAgICAgICAgICAgICAgd29ya3NwYWNlXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIGNhc2UgVVBEQVRFX1ZJRVdfU0VUVElOR1M6XHJcbiAgICAgICAgICAgIHdvcmtzcGFjZS5wcm9qZWN0LmNvbmZpZy52aWV3V2lkdGggPSBhY3Rpb24ucGF5bG9hZC52aWV3V2lkdGggfHwgc3RhdGUud29ya3NwYWNlLnByb2plY3QuY29uZmlnLnZpZXdXaWR0aDtcclxuICAgICAgICAgICAgd29ya3NwYWNlLnByb2plY3QuY29uZmlnLnZpZXdIZWlnaHQgPSBhY3Rpb24ucGF5bG9hZC52aWV3SGVpZ2h0IHx8IHN0YXRlLndvcmtzcGFjZS5wcm9qZWN0LmNvbmZpZy52aWV3SGVpZ2h0O1xyXG4gICAgICAgICAgICB3b3Jrc3BhY2UucHJvamVjdC5jb25maWcuY2VsbFdpZHRoID0gYWN0aW9uLnBheWxvYWQuY2VsbFdpZHRoIHx8IHN0YXRlLndvcmtzcGFjZS5wcm9qZWN0LmNvbmZpZy5jZWxsV2lkdGg7XHJcbiAgICAgICAgICAgIHdvcmtzcGFjZS5wcm9qZWN0LmNvbmZpZy5jZWxsSGVpZ2h0ID0gYWN0aW9uLnBheWxvYWQuY2VsbEhlaWdodCB8fCBzdGF0ZS53b3Jrc3BhY2UucHJvamVjdC5jb25maWcuY2VsbEhlaWdodDtcclxuICAgICAgICAgICAgd29ya3NwYWNlLnByb2plY3QuY29uZmlnLmNlbGxUcmFuc2Zvcm0gPSBhY3Rpb24ucGF5bG9hZC5jZWxsVHJhbnNmb3JtIHx8IHN0YXRlLndvcmtzcGFjZS5wcm9qZWN0LmNvbmZpZy5jZWxsVHJhbnNmb3JtO1xyXG4gICAgICAgICAgICB3b3Jrc3BhY2UucHJvamVjdC5jb25maWcuY3VycmVudF94ID0gYWN0aW9uLnBheWxvYWQuY3VycmVudF94IHx8IHN0YXRlLndvcmtzcGFjZS5wcm9qZWN0LmNvbmZpZy5jdXJyZW50X3g7XHJcbiAgICAgICAgICAgIHdvcmtzcGFjZS5wcm9qZWN0LmNvbmZpZy5jdXJyZW50X3kgPSBhY3Rpb24ucGF5bG9hZC5jdXJyZW50X3kgfHwgc3RhdGUud29ya3NwYWNlLnByb2plY3QuY29uZmlnLmN1cnJlbnRfeTtcclxuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLCB7XHJcbiAgICAgICAgICAgICAgICB3b3Jrc3BhY2VcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgY2FzZSBHX0NMSUNLRUQ6XHJcbiAgICAgICAgICAgIHdvcmtzcGFjZS5wcm9qZWN0LmNvbmZpZy5jZWxsVHJhbnNmb3JtID0gYWN0aW9uLnBheWxvYWQuY2VsbFRyYW5zZm9ybSB8fCBzdGF0ZS53b3Jrc3BhY2UucHJvamVjdC5jb25maWcuY2VsbFRyYW5zZm9ybTtcclxuICAgICAgICAgICAgd29ya3NwYWNlLnByb2plY3QuY29uZmlnLmN1cnJlbnRfeCA9IGFjdGlvbi5wYXlsb2FkLmN1cnJlbnRfeCB8fCBzdGF0ZS53b3Jrc3BhY2UucHJvamVjdC5jb25maWcuY3VycmVudF94O1xyXG4gICAgICAgICAgICB3b3Jrc3BhY2UucHJvamVjdC5jb25maWcuY3VycmVudF95ID0gYWN0aW9uLnBheWxvYWQuY3VycmVudF95IHx8IHN0YXRlLndvcmtzcGFjZS5wcm9qZWN0LmNvbmZpZy5jdXJyZW50X3k7XHJcbiAgICAgICAgICAgIHdvcmtzcGFjZS5wcm9qZWN0LmFkZC5hZGRDb21wb25lbnQgPSBhY3Rpb24ucGF5bG9hZC5hZGRDb21wb25lbnQ7XHJcbiAgICAgICAgICAgIHdvcmtzcGFjZS5wcm9qZWN0LnVpLmdDbGFzc0xpc3QgPSBhY3Rpb24ucGF5bG9hZC5nQ2xhc3NMaXN0IHx8IHN0YXRlLndvcmtzcGFjZS51aS5wcm9qZWN0LmdDbGFzc0xpc3Q7XHJcbiAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwge1xyXG4gICAgICAgICAgICAgICAgd29ya3NwYWNlXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIGNhc2UgQUREX0lOUFVUX1ZBTFVFX0NIQU5HRUQ6XHJcbiAgICAgICAgICAgIHdvcmtzcGFjZS5wcm9qZWN0LmFkZC5hZGRJbnB1dFZhbHVlID0gYWN0aW9uLnBheWxvYWQ7XHJcbiAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwge1xyXG4gICAgICAgICAgICAgICAgd29ya3NwYWNlXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIGNhc2UgQUREX0lOUFVUX1RBR19DSEFOR0VEOlxyXG4gICAgICAgICAgICB3b3Jrc3BhY2UucHJvamVjdC5hZGQuYWRkSW5wdXRUYWcgPSBhY3Rpb24ucGF5bG9hZDtcclxuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLCB7XHJcbiAgICAgICAgICAgICAgICB3b3Jrc3BhY2VcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgY2FzZSBVUERBVEVfUFJPSkVDVDpcclxuICAgICAgICAgICAgY29uc3QgcGFydHMgPSBhY3Rpb24ucGF5bG9hZC5wYXRoLnNwbGl0KCcuJyk7XHJcblxyXG4gICAgICAgICAgICB2YXIgaXRlbSA9IHdvcmtzcGFjZS5wcm9qZWN0Lml0ZW1zO1xyXG4gICAgICAgICAgICBwYXJ0cy5mb3JFYWNoKChwYXJ0LCBpKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoKGkgKyAxKSA9PT0gcGFydHMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbVtwYXJ0XSA9IGFjdGlvbi5wYXlsb2FkLnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtID0gaXRlbVtwYXJ0XTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHtcclxuICAgICAgICAgICAgICAgIHdvcmtzcGFjZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICBjYXNlIFVQREFURV9QUk9KRUNUX0lURU1TOlxyXG4gICAgICAgICAgICB3b3Jrc3BhY2UucHJvamVjdC5pdGVtcyA9IGFjdGlvbi5wYXlsb2FkO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLCB7XHJcbiAgICAgICAgICAgICAgICB3b3Jrc3BhY2VcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgY2FzZSBVUERBVEVfUFJPSkVDVF9DT05UQUlORVI6XHJcbiAgICAgICAgICAgIHdvcmtzcGFjZS5wcm9qZWN0LmNvbnRhaW5lciA9IGFjdGlvbi5wYXlsb2FkO1xyXG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHtcclxuICAgICAgICAgICAgICAgIHdvcmtzcGFjZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcmV0dXJuIHN0YXRlO1xyXG59OyIsImV4cG9ydCBjb25zdCBVUERBVEVfVklFV19TRVRUSU5HUyA9ICdVUERBVEVfVklFV19TRVRUSU5HUyc7XHJcbmV4cG9ydCBjb25zdCBVUERBVEVfQkdfSU1BR0UgPSAnVVBEQVRFX0JHX0lNQUdFJztcclxuZXhwb3J0IGNvbnN0IFVQREFURV9UT0tFTiA9ICdVUERBVEVfVE9LRU4nOyIsImltcG9ydCB7IGNyZWF0ZVN0b3JlIH0gZnJvbSAncmVkdXgnO1xyXG5pbXBvcnQgeyByZWR1Y2VyIH0gZnJvbSAnLi9yZWR1eC5yZWR1Y2VyJztcclxuXHJcbmV4cG9ydCBjb25zdCBzdG9yZSA9IGNyZWF0ZVN0b3JlKHJlZHVjZXIpOyIsImV4cG9ydCBjb25zdCBVUERBVEVfVklFV19TRVRUSU5HUyA9ICdVUERBVEVfVklFV19TRVRUSU5HUyc7XHJcbmV4cG9ydCBjb25zdCBHX0NMSUNLRUQgPSAnR19DTElDS0VEJztcclxuZXhwb3J0IGNvbnN0IEFERF9JTlBVVF9WQUxVRV9DSEFOR0VEID0gJ0FERF9JTlBVVF9WQUxVRV9DSEFOR0VEJztcclxuZXhwb3J0IGNvbnN0IEFERF9JTlBVVF9UQUdfQ0hBTkdFRCA9ICdBRERfSU5QVVRfVEFHX0NIQU5HRUQnO1xyXG5leHBvcnQgY29uc3QgQUREX1BST0pFQ1RfRk9STSA9ICdBRERfUFJPSkVDVF9GT1JNJztcclxuZXhwb3J0IGNvbnN0IFVQREFURV9QUk9KRUNUID0gJ1VQREFURV9QUk9KRUNUJztcclxuZXhwb3J0IGNvbnN0IFVQREFURV9QUk9KRUNUX0lURU1TID0gJ1VQREFURV9QUk9KRUNUX0lURU0nO1xyXG5leHBvcnQgY29uc3QgVVBEQVRFX1BST0pFQ1RfQ09OVEFJTkVSID0gJ1VQREFURV9QUk9KRUNUX0NPTlRBSU5FUic7Il0sInNvdXJjZVJvb3QiOiIifQ==