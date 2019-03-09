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
/*! exports provided: reducer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "reducer", function() { return reducer; });
/* harmony import */ var _redux_actions_types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./redux.actions.types */ "jRXl");


const jwt = __webpack_require__(/*! jsonwebtoken */ "FLf1");

const token = localStorage.getItem('token');
const initialState = {
  token: token,
  user: token ? jwt.decode(token) : null
};
const reducer = (state = initialState, action) => {
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

/***/ "MBHU":
/*!****************************************************!*\
  !*** ./client/app/src/config/redux/redux.store.js ***!
  \****************************************************/
/*! exports provided: store */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "store", function() { return store; });
/* harmony import */ var redux__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! redux */ "ANjH");
/* harmony import */ var _redux_reducer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./redux.reducer */ "43fW");


const store = Object(redux__WEBPACK_IMPORTED_MODULE_0__["createStore"])(_redux_reducer__WEBPACK_IMPORTED_MODULE_1__["reducer"]);

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

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vdXRpbCAoaWdub3JlZCkiLCJ3ZWJwYWNrOi8vL3V0aWwgKGlnbm9yZWQpPzEzZTEiLCJ3ZWJwYWNrOi8vL2J1ZmZlciAoaWdub3JlZCkiLCJ3ZWJwYWNrOi8vL2NyeXB0byAoaWdub3JlZCkiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L2FwcC9zcmMvY29uZmlnL3JlZHV4L3JlZHV4LnJlZHVjZXIuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L2FwcC9zcmMvY29uZmlnL3JlZHV4L3JlZHV4LnN0b3JlLmpzIiwid2VicGFjazovLy8uL2NsaWVudC9hcHAvc3JjL2NvbmZpZy9yZWR1eC9yZWR1eC5hY3Rpb25zLnR5cGVzLmpzIl0sIm5hbWVzIjpbImp3dCIsInJlcXVpcmUiLCJ0b2tlbiIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJpbml0aWFsU3RhdGUiLCJ1c2VyIiwiZGVjb2RlIiwicmVkdWNlciIsInN0YXRlIiwiYWN0aW9uIiwidHlwZSIsIlVQREFURV9UT0tFTiIsInBheWxvYWQiLCJzZXRJdGVtIiwicmVtb3ZlSXRlbSIsIk9iamVjdCIsImFzc2lnbiIsInN0b3JlIiwiY3JlYXRlU3RvcmUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBLGU7Ozs7Ozs7Ozs7O0FDQUEsZTs7Ozs7Ozs7Ozs7QUNBQSxlOzs7Ozs7Ozs7OztBQ0FBLGU7Ozs7Ozs7Ozs7OztBQ0FBO0FBQUE7QUFBQTtBQUFBOztBQUNBLE1BQU1BLEdBQUcsR0FBR0MsbUJBQU8sQ0FBQywwQkFBRCxDQUFuQjs7QUFFQSxNQUFNQyxLQUFLLEdBQUdDLFlBQVksQ0FBQ0MsT0FBYixDQUFxQixPQUFyQixDQUFkO0FBQ0EsTUFBTUMsWUFBWSxHQUFHO0FBQ2pCSCxPQUFLLEVBQUVBLEtBRFU7QUFFakJJLE1BQUksRUFBRUosS0FBSyxHQUFHRixHQUFHLENBQUNPLE1BQUosQ0FBV0wsS0FBWCxDQUFILEdBQXVCO0FBRmpCLENBQXJCO0FBS08sTUFBTU0sT0FBTyxHQUFHLENBQUNDLEtBQUssR0FBR0osWUFBVCxFQUF1QkssTUFBdkIsS0FBa0M7QUFDckQsVUFBUUEsTUFBTSxDQUFDQyxJQUFmO0FBQ0ksU0FBS0MsaUVBQUw7QUFDSSxVQUFJRixNQUFNLENBQUNHLE9BQVgsRUFBb0I7QUFDaEJWLG9CQUFZLENBQUNXLE9BQWIsQ0FBcUIsT0FBckIsRUFBOEJKLE1BQU0sQ0FBQ0csT0FBckM7QUFDSCxPQUZELE1BRU87QUFDSFYsb0JBQVksQ0FBQ1ksVUFBYixDQUF3QixPQUF4QjtBQUNIOztBQUNELGFBQU9DLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjLEVBQWQsRUFBa0JSLEtBQWxCLEVBQXlCO0FBQzVCUCxhQUFLLEVBQUVRLE1BQU0sQ0FBQ0csT0FEYztBQUU1QlAsWUFBSSxFQUFFSSxNQUFNLENBQUNHLE9BQVAsR0FBaUJiLEdBQUcsQ0FBQ08sTUFBSixDQUFXRyxNQUFNLENBQUNHLE9BQWxCLENBQWpCLEdBQThDO0FBRnhCLE9BQXpCLENBQVA7QUFQUjs7QUFZQSxTQUFPSixLQUFQO0FBQ0gsQ0FkTSxDOzs7Ozs7Ozs7Ozs7QUNUUDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFFTyxNQUFNUyxLQUFLLEdBQUdDLHlEQUFXLENBQUNYLHNEQUFELENBQXpCLEM7Ozs7Ozs7Ozs7OztBQ0hQO0FBQUE7QUFBTyxNQUFNSSxZQUFZLEdBQUcsY0FBckIsQyIsImZpbGUiOiJidWlsZC9hcHB+ZW5naW5lLjRjZDAwMTkwMmMzODQ4MWFiNWRiLmNodW5rLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogKGlnbm9yZWQpICovIiwiLyogKGlnbm9yZWQpICovIiwiLyogKGlnbm9yZWQpICovIiwiLyogKGlnbm9yZWQpICovIiwiaW1wb3J0IHsgVVBEQVRFX1RPS0VOIH0gZnJvbSAnLi9yZWR1eC5hY3Rpb25zLnR5cGVzJztcclxuY29uc3Qgand0ID0gcmVxdWlyZSgnanNvbndlYnRva2VuJyk7XHJcblxyXG5jb25zdCB0b2tlbiA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd0b2tlbicpO1xyXG5jb25zdCBpbml0aWFsU3RhdGUgPSB7XHJcbiAgICB0b2tlbjogdG9rZW4sXHJcbiAgICB1c2VyOiB0b2tlbiA/IGp3dC5kZWNvZGUodG9rZW4pIDogbnVsbFxyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IHJlZHVjZXIgPSAoc3RhdGUgPSBpbml0aWFsU3RhdGUsIGFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgVVBEQVRFX1RPS0VOOlxyXG4gICAgICAgICAgICBpZiAoYWN0aW9uLnBheWxvYWQpIHtcclxuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCd0b2tlbicsIGFjdGlvbi5wYXlsb2FkKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCd0b2tlbicpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwge1xyXG4gICAgICAgICAgICAgICAgdG9rZW46IGFjdGlvbi5wYXlsb2FkLFxyXG4gICAgICAgICAgICAgICAgdXNlcjogYWN0aW9uLnBheWxvYWQgPyBqd3QuZGVjb2RlKGFjdGlvbi5wYXlsb2FkKSA6IG51bGxcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gc3RhdGU7XHJcbn07IiwiaW1wb3J0IHsgY3JlYXRlU3RvcmUgfSBmcm9tICdyZWR1eCc7XHJcbmltcG9ydCB7IHJlZHVjZXIgfSBmcm9tICcuL3JlZHV4LnJlZHVjZXInO1xyXG5cclxuZXhwb3J0IGNvbnN0IHN0b3JlID0gY3JlYXRlU3RvcmUocmVkdWNlcik7IiwiZXhwb3J0IGNvbnN0IFVQREFURV9UT0tFTiA9ICdVUERBVEVfVE9LRU4nOyJdLCJzb3VyY2VSb290IjoiIn0=