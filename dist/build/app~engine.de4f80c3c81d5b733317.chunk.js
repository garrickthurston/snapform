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

const projectConfig = {
  ui: {
    gClassList: 'gid',
    add: {}
  }
};
const initialState = {
  workspace: {
    project: {
      config: projectConfig,
      items: {}
    }
  }
};
const engineReducer = (state = initialState, action) => {
  var workspace = Object.assign({}, state.workspace);

  switch (action.type) {
    case _redux_actions_types__WEBPACK_IMPORTED_MODULE_0__["INIT_PROJECT"]:
      var {
        workspace_id,
        project
      } = action.payload;
      project.add = {};

      if (!project.config) {
        project.config = projectConfig;
      }

      if (!project.config.ui) {
        project.config.ui = projectConfig.ui;
      }

      workspace.id = workspace_id;
      workspace.project = project;
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
      });
      return Object.assign({}, state, {
        workspace
      });

    case _redux_actions_types__WEBPACK_IMPORTED_MODULE_0__["UPDATE_PROJECT_ITEMS"]:
      workspace.project.items = action.payload;
      return Object.assign({}, state, {
        workspace
      });

    case _redux_actions_types__WEBPACK_IMPORTED_MODULE_0__["UPDATE_PROJECT_CONFIG"]:
      workspace.project.config = action.payload;
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
/*! exports provided: UPDATE_TOKEN */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UPDATE_TOKEN", function() { return UPDATE_TOKEN; });
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
/*! exports provided: UPDATE_PROJECT, UPDATE_PROJECT_ITEMS, UPDATE_PROJECT_CONTAINER, INIT_PROJECT, UPDATE_PROJECT_CONFIG */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UPDATE_PROJECT", function() { return UPDATE_PROJECT; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UPDATE_PROJECT_ITEMS", function() { return UPDATE_PROJECT_ITEMS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UPDATE_PROJECT_CONTAINER", function() { return UPDATE_PROJECT_CONTAINER; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "INIT_PROJECT", function() { return INIT_PROJECT; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UPDATE_PROJECT_CONFIG", function() { return UPDATE_PROJECT_CONFIG; });
const UPDATE_PROJECT = 'UPDATE_PROJECT';
const UPDATE_PROJECT_ITEMS = 'UPDATE_PROJECT_ITEM';
const UPDATE_PROJECT_CONTAINER = 'UPDATE_PROJECT_CONTAINER';
const INIT_PROJECT = 'INIT_PROJECT';
const UPDATE_PROJECT_CONFIG = 'UPDATE_PROJECT_CONFIG';

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vdXRpbCAoaWdub3JlZCkiLCJ3ZWJwYWNrOi8vL3V0aWwgKGlnbm9yZWQpPzEzZTEiLCJ3ZWJwYWNrOi8vL2J1ZmZlciAoaWdub3JlZCkiLCJ3ZWJwYWNrOi8vL2NyeXB0byAoaWdub3JlZCkiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L2FwcC9zcmMvY29uZmlnL3JlZHV4L3JlZHV4LnJlZHVjZXIuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L2NvbW1vbi9jb25maWcvcmVkdXgvcmVkdXgucmVkdWNlci5qcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvZW5naW5lL3NyYy9jb25maWcvcmVkdXgvcmVkdXgucmVkdWNlci5qcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvYXBwL3NyYy9jb25maWcvcmVkdXgvcmVkdXguYWN0aW9ucy50eXBlcy5qcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvY29tbW9uL2NvbmZpZy9yZWR1eC9yZWR1eC5zdG9yZS5qcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvZW5naW5lL3NyYy9jb25maWcvcmVkdXgvcmVkdXguYWN0aW9ucy50eXBlcy5qcyJdLCJuYW1lcyI6WyJqd3QiLCJyZXF1aXJlIiwidG9rZW4iLCJsb2NhbFN0b3JhZ2UiLCJnZXRJdGVtIiwiaW5pdGlhbFN0YXRlIiwidXNlciIsImRlY29kZSIsImFwcFJlZHVjZXIiLCJzdGF0ZSIsImFjdGlvbiIsInR5cGUiLCJVUERBVEVfVE9LRU4iLCJwYXlsb2FkIiwic2V0SXRlbSIsInJlbW92ZUl0ZW0iLCJPYmplY3QiLCJhc3NpZ24iLCJyZWR1Y2VyIiwiY29tYmluZVJlZHVjZXJzIiwiZW5naW5lUmVkdWNlciIsInByb2plY3RDb25maWciLCJ1aSIsImdDbGFzc0xpc3QiLCJhZGQiLCJ3b3Jrc3BhY2UiLCJwcm9qZWN0IiwiY29uZmlnIiwiaXRlbXMiLCJJTklUX1BST0pFQ1QiLCJ3b3Jrc3BhY2VfaWQiLCJpZCIsIlVQREFURV9QUk9KRUNUIiwicGFydHMiLCJwYXRoIiwic3BsaXQiLCJmb3JFYWNoIiwicGFydCIsImkiLCJsZW5ndGgiLCJ2YWx1ZSIsIml0ZW0iLCJVUERBVEVfUFJPSkVDVF9JVEVNUyIsIlVQREFURV9QUk9KRUNUX0NPTkZJRyIsIlVQREFURV9QUk9KRUNUX0NPTlRBSU5FUiIsImNvbnRhaW5lciIsInN0b3JlIiwiY3JlYXRlU3RvcmUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBLGU7Ozs7Ozs7Ozs7O0FDQUEsZTs7Ozs7Ozs7Ozs7QUNBQSxlOzs7Ozs7Ozs7OztBQ0FBLGU7Ozs7Ozs7Ozs7OztBQ0FBO0FBQUE7QUFBQTtBQUFBOztBQUNBLE1BQU1BLEdBQUcsR0FBR0MsbUJBQU8sQ0FBQywwQkFBRCxDQUFuQjs7QUFFQSxNQUFNQyxLQUFLLEdBQUdDLFlBQVksQ0FBQ0MsT0FBYixDQUFxQixPQUFyQixDQUFkO0FBQ0EsTUFBTUMsWUFBWSxHQUFHO0FBQ2pCSCxPQUFLLEVBQUVBLEtBRFU7QUFFakJJLE1BQUksRUFBRUosS0FBSyxHQUFHRixHQUFHLENBQUNPLE1BQUosQ0FBV0wsS0FBWCxDQUFILEdBQXVCO0FBRmpCLENBQXJCO0FBS08sTUFBTU0sVUFBVSxHQUFHLENBQUNDLEtBQUssR0FBR0osWUFBVCxFQUF1QkssTUFBdkIsS0FBa0M7QUFDeEQsVUFBUUEsTUFBTSxDQUFDQyxJQUFmO0FBQ0ksU0FBS0MsaUVBQUw7QUFDSSxVQUFJRixNQUFNLENBQUNHLE9BQVgsRUFBb0I7QUFDaEJWLG9CQUFZLENBQUNXLE9BQWIsQ0FBcUIsT0FBckIsRUFBOEJKLE1BQU0sQ0FBQ0csT0FBckM7QUFDSCxPQUZELE1BRU87QUFDSFYsb0JBQVksQ0FBQ1ksVUFBYixDQUF3QixPQUF4QjtBQUNIOztBQUNELGFBQU9DLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjLEVBQWQsRUFBa0JSLEtBQWxCLEVBQXlCO0FBQzVCUCxhQUFLLEVBQUVRLE1BQU0sQ0FBQ0csT0FEYztBQUU1QlAsWUFBSSxFQUFFSSxNQUFNLENBQUNHLE9BQVAsR0FBaUJiLEdBQUcsQ0FBQ08sTUFB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YUFBT0csTUFBTSxDQUFDQyxNQUFQLENBQWMsRUFBZCxFQUFrQlIsS0FBbEIsRUFBeUI7QUFDNUJnQjtBQUQ0QixPQUF6QixDQUFQOztBQUdKLFNBQUttQiw2RUFBTDtBQUNJbkIsZUFBUyxDQUFDQyxPQUFWLENBQWtCbUIsU0FBbEIsR0FBOEJuQyxNQUFNLENBQUNHLE9BQXJDO0FBQ0EsYUFBT0csTUFBTSxDQUFDQyxNQUFQLENBQWMsRUFBZCxFQUFrQlIsS0FBbEIsRUFBeUI7QUFDNUJnQjtBQUQ0QixPQUF6QixDQUFQO0FBL0NSOztBQW9EQSxTQUFPaEIsS0FBUDtBQUNILENBeERNLEM7Ozs7Ozs7Ozs7OztBQ2pCUDtBQUFBO0FBQU8sTUFBTUcsWUFBWSxHQUFHLGNBQXJCLEM7Ozs7Ozs7Ozs7OztBQ0FQO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUVPLE1BQU1rQyxLQUFLLEdBQUdDLHlEQUFXLENBQUM3QixzREFBRCxDQUF6QixDOzs7Ozs7Ozs7Ozs7QUNIUDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBTyxNQUFNYyxjQUFjLEdBQUcsZ0JBQXZCO0FBQ0EsTUFBTVUsb0JBQW9CLEdBQUcscUJBQTdCO0FBQ0EsTUFBTUUsd0JBQXdCLEdBQUcsMEJBQWpDO0FBQ0EsTUFBTWYsWUFBWSxHQUFHLGNBQXJCO0FBQ0EsTUFBTWMscUJBQXFCLEdBQUcsdUJBQTlCLEMiLCJmaWxlIjoiYnVpbGQvYXBwfmVuZ2luZS5kZTRmODBjM2M4MWQ1YjczMzMxNy5jaHVuay5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIChpZ25vcmVkKSAqLyIsIi8qIChpZ25vcmVkKSAqLyIsIi8qIChpZ25vcmVkKSAqLyIsIi8qIChpZ25vcmVkKSAqLyIsImltcG9ydCB7IFVQREFURV9UT0tFTiB9IGZyb20gJy4vcmVkdXguYWN0aW9ucy50eXBlcyc7XHJcbmNvbnN0IGp3dCA9IHJlcXVpcmUoJ2pzb253ZWJ0b2tlbicpO1xyXG5cclxuY29uc3QgdG9rZW4gPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndG9rZW4nKTtcclxuY29uc3QgaW5pdGlhbFN0YXRlID0ge1xyXG4gICAgdG9rZW46IHRva2VuLFxyXG4gICAgdXNlcjogdG9rZW4gPyBqd3QuZGVjb2RlKHRva2VuKSA6IG51bGxcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBhcHBSZWR1Y2VyID0gKHN0YXRlID0gaW5pdGlhbFN0YXRlLCBhY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlIFVQREFURV9UT0tFTjpcclxuICAgICAgICAgICAgaWYgKGFjdGlvbi5wYXlsb2FkKSB7XHJcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgndG9rZW4nLCBhY3Rpb24ucGF5bG9hZCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgndG9rZW4nKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHtcclxuICAgICAgICAgICAgICAgIHRva2VuOiBhY3Rpb24ucGF5bG9hZCxcclxuICAgICAgICAgICAgICAgIHVzZXI6IGFjdGlvbi5wYXlsb2FkID8gand0LmRlY29kZShhY3Rpb24ucGF5bG9hZCkgOiBudWxsXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHN0YXRlO1xyXG59OyIsImltcG9ydCB7IGNvbWJpbmVSZWR1Y2VycyB9IGZyb20gJ3JlZHV4JztcclxuaW1wb3J0IHsgYXBwUmVkdWNlciB9IGZyb20gJy4uLy4uLy4uL2FwcC9zcmMvY29uZmlnL3JlZHV4L3JlZHV4LnJlZHVjZXInO1xyXG5pbXBvcnQgeyBlbmdpbmVSZWR1Y2VyIH0gZnJvbSAnLi4vLi4vLi4vZW5naW5lL3NyYy9jb25maWcvcmVkdXgvcmVkdXgucmVkdWNlcic7XHJcblxyXG5leHBvcnQgY29uc3QgcmVkdWNlciA9IGNvbWJpbmVSZWR1Y2Vycyh7XHJcbiAgICBhcHBSZWR1Y2VyLFxyXG4gICAgZW5naW5lUmVkdWNlclxyXG59KTsiLCJpbXBvcnQgeyBVUERBVEVfUFJPSkVDVCwgVVBEQVRFX1BST0pFQ1RfSVRFTVMsIFVQREFURV9QUk9KRUNUX0NPTlRBSU5FUiwgSU5JVF9QUk9KRUNULCBVUERBVEVfUFJPSkVDVF9DT05GSUcgfSBmcm9tICcuL3JlZHV4LmFjdGlvbnMudHlwZXMnO1xyXG5cclxuY29uc3QgcHJvamVjdENvbmZpZyA9IHtcclxuICAgIHVpOiB7XHJcbiAgICAgICAgZ0NsYXNzTGlzdDogJ2dpZCcsXHJcbiAgICAgICAgYWRkOiB7fVxyXG4gICAgfVxyXG59O1xyXG5jb25zdCBpbml0aWFsU3RhdGUgPSB7XHJcbiAgICB3b3Jrc3BhY2U6IHtcclxuICAgICAgICBwcm9qZWN0OiB7XHJcbiAgICAgICAgICAgIGNvbmZpZzogcHJvamVjdENvbmZpZyxcclxuICAgICAgICAgICAgaXRlbXM6IHt9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGVuZ2luZVJlZHVjZXIgPSAoc3RhdGUgPSBpbml0aWFsU3RhdGUsIGFjdGlvbikgPT4ge1xyXG4gICAgdmFyIHdvcmtzcGFjZSA9IE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLndvcmtzcGFjZSk7XHJcblxyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgSU5JVF9QUk9KRUNUOlxyXG4gICAgICAgICAgICB2YXIgeyB3b3Jrc3BhY2VfaWQsIHByb2plY3QgfSA9IGFjdGlvbi5wYXlsb2FkO1xyXG5cclxuICAgICAgICAgICAgcHJvamVjdC5hZGQgPSB7fTtcclxuICAgICAgICAgICAgaWYgKCFwcm9qZWN0LmNvbmZpZykge1xyXG4gICAgICAgICAgICAgICAgcHJvamVjdC5jb25maWcgPSBwcm9qZWN0Q29uZmlnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICghcHJvamVjdC5jb25maWcudWkpIHtcclxuICAgICAgICAgICAgICAgIHByb2plY3QuY29uZmlnLnVpID0gcHJvamVjdENvbmZpZy51aTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgd29ya3NwYWNlLmlkID0gd29ya3NwYWNlX2lkO1xyXG4gICAgICAgICAgICB3b3Jrc3BhY2UucHJvamVjdCA9IHByb2plY3Q7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHtcclxuICAgICAgICAgICAgICAgIHdvcmtzcGFjZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICBjYXNlIFVQREFURV9QUk9KRUNUOlxyXG4gICAgICAgICAgICBjb25zdCBwYXJ0cyA9IGFjdGlvbi5wYXlsb2FkLnBhdGguc3BsaXQoJy4nKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBpdGVtcyA9IHdvcmtzcGFjZS5wcm9qZWN0Lml0ZW1zO1xyXG4gICAgICAgICAgICBwYXJ0cy5mb3JFYWNoKChwYXJ0LCBpKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoKGkgKyAxKSA9PT0gcGFydHMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbXNbcGFydF0gPSBhY3Rpb24ucGF5bG9hZC52YWx1ZTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbXMgPSBpdGVtW3BhcnRdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwge1xyXG4gICAgICAgICAgICAgICAgd29ya3NwYWNlXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIGNhc2UgVVBEQVRFX1BST0pFQ1RfSVRFTVM6XHJcbiAgICAgICAgICAgIHdvcmtzcGFjZS5wcm9qZWN0Lml0ZW1zID0gYWN0aW9uLnBheWxvYWQ7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHtcclxuICAgICAgICAgICAgICAgIHdvcmtzcGFjZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICBjYXNlIFVQREFURV9QUk9KRUNUX0NPTkZJRzpcclxuICAgICAgICAgICAgd29ya3NwYWNlLnByb2plY3QuY29uZmlnID0gYWN0aW9uLnBheWxvYWQ7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHtcclxuICAgICAgICAgICAgICAgIHdvcmtzcGFjZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICBjYXNlIFVQREFURV9QUk9KRUNUX0NPTlRBSU5FUjpcclxuICAgICAgICAgICAgd29ya3NwYWNlLnByb2plY3QuY29udGFpbmVyID0gYWN0aW9uLnBheWxvYWQ7XHJcbiAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwge1xyXG4gICAgICAgICAgICAgICAgd29ya3NwYWNlXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICByZXR1cm4gc3RhdGU7XHJcbn07IiwiZXhwb3J0IGNvbnN0IFVQREFURV9UT0tFTiA9ICdVUERBVEVfVE9LRU4nOyIsImltcG9ydCB7IGNyZWF0ZVN0b3JlIH0gZnJvbSAncmVkdXgnO1xyXG5pbXBvcnQgeyByZWR1Y2VyIH0gZnJvbSAnLi9yZWR1eC5yZWR1Y2VyJztcclxuXHJcbmV4cG9ydCBjb25zdCBzdG9yZSA9IGNyZWF0ZVN0b3JlKHJlZHVjZXIpOyIsImV4cG9ydCBjb25zdCBVUERBVEVfUFJPSkVDVCA9ICdVUERBVEVfUFJPSkVDVCc7XHJcbmV4cG9ydCBjb25zdCBVUERBVEVfUFJPSkVDVF9JVEVNUyA9ICdVUERBVEVfUFJPSkVDVF9JVEVNJztcclxuZXhwb3J0IGNvbnN0IFVQREFURV9QUk9KRUNUX0NPTlRBSU5FUiA9ICdVUERBVEVfUFJPSkVDVF9DT05UQUlORVInO1xyXG5leHBvcnQgY29uc3QgSU5JVF9QUk9KRUNUID0gJ0lOSVRfUFJPSkVDVCc7XHJcbmV4cG9ydCBjb25zdCBVUERBVEVfUFJPSkVDVF9DT05GSUcgPSAnVVBEQVRFX1BST0pFQ1RfQ09ORklHJzsiXSwic291cmNlUm9vdCI6IiJ9