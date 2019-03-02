(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[0],{

/***/ 4:
/*!************************!*\
  !*** crypto (ignored) ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ "CFaH":
/*!*******************************!*\
  !*** ./client/common/http.js ***!
  \*******************************/
/*! exports provided: Http */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Http", function() { return Http; });
/* harmony import */ var request__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! request */ "MNzl");
/* harmony import */ var request__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(request__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _config_redux_redux_store__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./config/redux/redux.store */ "p6Ez");


class Http {
  constructor() {}

  get(url, auth = true, options = null, fullyQualified = false, overrideStatusCodeFailure = false) {
    return new Promise((resolve, reject) => {
      try {
        if (!options) {
          options = {
            method: 'GET',
            url: fullyQualified ? url : `${window.location.protocol}//${window.location.host}${url}`,
            cache: false,
            headers: {
              'Content-Type': 'application/json'
            }
          };
        }

        if (auth) {
          const {
            token
          } = _config_redux_redux_store__WEBPACK_IMPORTED_MODULE_1__["store"].getState().appReducer;
          options.headers['Authorization'] = `Bearer ${token}`;
        }

        request__WEBPACK_IMPORTED_MODULE_0___default()(options, (error, response, body) => {
          if (error) {
            return reject(error);
          }

          if (!overrideStatusCodeFailure && !(response.statusCode >= 200 && response.statusCode <= 299)) {
            reject(`Status Code: ${response.statusCode}`);
          }

          resolve(JSON.parse(response.body));
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  post(url, body, auth = true, fullyQualified = false, options = null, overrideStatusCodeFailure = false) {
    return new Promise((resolve, reject) => {
      try {
        if (!options) {
          options = {
            method: 'POST',
            url: fullyQualified ? url : `${window.location.protocol}//${window.location.host}${url}`,
            cache: false,
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
          };
        }

        if (auth) {
          const {
            token
          } = _config_redux_redux_store__WEBPACK_IMPORTED_MODULE_1__["store"].getState().appReducer;
          options.headers['Authorization'] = `Bearer ${token}`;
        }

        request__WEBPACK_IMPORTED_MODULE_0___default()(options, (error, response, body) => {
          if (error) {
            return reject(error);
          }

          if (!overrideStatusCodeFailure && !(response.statusCode >= 200 && response.statusCode <= 299)) {
            reject(`Status Code: ${response.statusCode}`);
          }

          resolve(JSON.parse(response.body));
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  put(url, body, auth = true, fullyQualified = false, options = null, overrideStatusCodeFailure = false) {
    return new Promise((resolve, reject) => {
      try {
        if (!options) {
          options = {
            method: 'PUT',
            url: fullyQualified ? url : `${window.location.protocol}//${window.location.host}${url}`,
            cache: false,
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
          };
        }

        if (auth) {
          const {
            token
          } = _config_redux_redux_store__WEBPACK_IMPORTED_MODULE_1__["store"].getState().appReducer;
          options.headers['Authorization'] = `Bearer ${token}`;
        }

        request__WEBPACK_IMPORTED_MODULE_0___default()(options, (error, response, body) => {
          if (error) {
            return reject(error);
          }

          if (!overrideStatusCodeFailure && !(response.statusCode >= 200 && response.statusCode <= 299)) {
            reject(`Status Code: ${response.statusCode}`);
          }

          resolve(JSON.parse(response.body));
        });
      } catch (e) {
        reject(e);
      }
    });
  }

}

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vY3J5cHRvIChpZ25vcmVkKT9hNzUwIiwid2VicGFjazovLy8uL2NsaWVudC9jb21tb24vaHR0cC5qcyJdLCJuYW1lcyI6WyJIdHRwIiwiY29uc3RydWN0b3IiLCJnZXQiLCJ1cmwiLCJhdXRoIiwib3B0aW9ucyIsImZ1bGx5UXVhbGlmaWVkIiwib3ZlcnJpZGVTdGF0dXNDb2RlRmFpbHVyZSIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwibWV0aG9kIiwid2luZG93IiwibG9jYXRpb24iLCJwcm90b2NvbCIsImhvc3QiLCJjYWNoZSIsImhlYWRlcnMiLCJ0b2tlbiIsInN0b3JlIiwiZ2V0U3RhdGUiLCJhcHBSZWR1Y2VyIiwicmVxdWVzdCIsImVycm9yIiwicmVzcG9uc2UiLCJib2R5Iiwic3RhdHVzQ29kZSIsIkpTT04iLCJwYXJzZSIsImUiLCJwb3N0Iiwic3RyaW5naWZ5IiwicHV0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSxlOzs7Ozs7Ozs7Ozs7QUNBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUVPLE1BQU1BLElBQU4sQ0FBVztBQUVkQyxhQUFXLEdBQUcsQ0FFYjs7QUFFREMsS0FBRyxDQUFDQyxHQUFELEVBQU1DLElBQUksR0FBRyxJQUFiLEVBQW1CQyxPQUFPLEdBQUcsSUFBN0IsRUFBbUNDLGNBQWMsR0FBRyxLQUFwRCxFQUEyREMseUJBQXlCLEdBQUcsS0FBdkYsRUFBOEY7QUFDN0YsV0FBTyxJQUFJQyxPQUFKLENBQVksQ0FBQ0MsT0FBRCxFQUFVQyxNQUFWLEtBQXFCO0FBQ3BDLFVBQUk7QUFDQSxZQUFJLENBQUNMLE9BQUwsRUFBYztBQUNWQSxpQkFBTyxHQUFHO0FBQ05NLGtCQUFNLEVBQUUsS0FERjtBQUVOUixlQUFHLEVBQUVHLGNBQWMsR0FBR0gsR0FBSCxHQUFVLEdBQUVTLE1BQU0sQ0FBQ0MsUUFBUCxDQUFnQkMsUUFBUyxLQUFJRixNQUFNLENBQUNDLFFBQVAsQ0FBZ0JFLElB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QkYsUUFBUSxDQUFDRSxVQUFULElBQXVCLEdBQXZELENBQWxDLEVBQStGO0FBQzNGaEIsa0JBQU0sQ0FBRSxnQkFBZWMsUUFBUSxDQUFDRSxVQUFXLEVBQXJDLENBQU47QUFDSDs7QUFFRGpCLGlCQUFPLENBQUNrQixJQUFJLENBQUNDLEtBQUwsQ0FBV0osUUFBUSxDQUFDQyxJQUFwQixDQUFELENBQVA7QUFDSCxTQVZNLENBQVA7QUFXSCxPQTVCRCxDQTRCRSxPQUFPSSxDQUFQLEVBQVU7QUFDUm5CLGNBQU0sQ0FBQ21CLENBQUQsQ0FBTjtBQUNIO0FBQ0osS0FoQ00sQ0FBUDtBQWlDSDs7QUEvR2EsQyIsImZpbGUiOiJidWlsZC8wLjU5OGJlYTRmYTlmMGU3NDQ1YmQ0LmNodW5rLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogKGlnbm9yZWQpICovIiwiaW1wb3J0IHJlcXVlc3QgZnJvbSAncmVxdWVzdCc7XHJcbmltcG9ydCB7IHN0b3JlIH0gZnJvbSAnLi9jb25maWcvcmVkdXgvcmVkdXguc3RvcmUnO1xyXG5cclxuZXhwb3J0IGNsYXNzIEh0dHAge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBnZXQodXJsLCBhdXRoID0gdHJ1ZSwgb3B0aW9ucyA9IG51bGwsIGZ1bGx5UXVhbGlmaWVkID0gZmFsc2UsIG92ZXJyaWRlU3RhdHVzQ29kZUZhaWx1cmUgPSBmYWxzZSkge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIW9wdGlvbnMpIHtcclxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB1cmw6IGZ1bGx5UXVhbGlmaWVkID8gdXJsIDogYCR7d2luZG93LmxvY2F0aW9uLnByb3RvY29sfS8vJHt3aW5kb3cubG9jYXRpb24uaG9zdH0ke3VybH1gLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYWNoZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGF1dGgpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB7IHRva2VuIH0gPSBzdG9yZS5nZXRTdGF0ZSgpLmFwcFJlZHVjZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5oZWFkZXJzWydBdXRob3JpemF0aW9uJ10gPSBgQmVhcmVyICR7dG9rZW59YDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJlcXVlc3Qob3B0aW9ucywgKGVycm9yLCByZXNwb25zZSwgYm9keSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVqZWN0KGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghb3ZlcnJpZGVTdGF0dXNDb2RlRmFpbHVyZSAmJiAhKHJlc3BvbnNlLnN0YXR1c0NvZGUgPj0gMjAwICYmIHJlc3BvbnNlLnN0YXR1c0NvZGUgPD0gMjk5KSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoYFN0YXR1cyBDb2RlOiAke3Jlc3BvbnNlLnN0YXR1c0NvZGV9YCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKEpTT04ucGFyc2UocmVzcG9uc2UuYm9keSkpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgIHJlamVjdChlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHBvc3QodXJsLCBib2R5LCBhdXRoID0gdHJ1ZSwgZnVsbHlRdWFsaWZpZWQgPSBmYWxzZSwgb3B0aW9ucyA9IG51bGwsIG92ZXJyaWRlU3RhdHVzQ29kZUZhaWx1cmUgPSBmYWxzZSkge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIW9wdGlvbnMpIHtcclxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiBmdWxseVF1YWxpZmllZCA/IHVybCA6IGAke3dpbmRvdy5sb2NhdGlvbi5wcm90b2NvbH0vLyR7d2luZG93LmxvY2F0aW9uLmhvc3R9JHt1cmx9YCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FjaGU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGJvZHkpXHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoYXV0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgdG9rZW4gfSA9IHN0b3JlLmdldFN0YXRlKCkuYXBwUmVkdWNlcjtcclxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLmhlYWRlcnNbJ0F1dGhvcml6YXRpb24nXSA9IGBCZWFyZXIgJHt0b2tlbn1gO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmVxdWVzdChvcHRpb25zLCAoZXJyb3IsIHJlc3BvbnNlLCBib2R5KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZWplY3QoZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFvdmVycmlkZVN0YXR1c0NvZGVGYWlsdXJlICYmICEocmVzcG9uc2Uuc3RhdHVzQ29kZSA+PSAyMDAgJiYgcmVzcG9uc2Uuc3RhdHVzQ29kZSA8PSAyOTkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChgU3RhdHVzIENvZGU6ICR7cmVzcG9uc2Uuc3RhdHVzQ29kZX1gKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoSlNPTi5wYXJzZShyZXNwb25zZS5ib2R5KSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgcmVqZWN0KGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHV0KHVybCwgYm9keSwgYXV0aCA9IHRydWUsIGZ1bGx5UXVhbGlmaWVkID0gZmFsc2UsIG9wdGlvbnMgPSBudWxsLCBvdmVycmlkZVN0YXR1c0NvZGVGYWlsdXJlID0gZmFsc2UpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFvcHRpb25zKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiAnUFVUJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiBmdWxseVF1YWxpZmllZCA/IHVybCA6IGAke3dpbmRvdy5sb2NhdGlvbi5wcm90b2NvbH0vLyR7d2luZG93LmxvY2F0aW9uLmhvc3R9JHt1cmx9YCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FjaGU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGJvZHkpXHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoYXV0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgdG9rZW4gfSA9IHN0b3JlLmdldFN0YXRlKCkuYXBwUmVkdWNlcjtcclxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLmhlYWRlcnNbJ0F1dGhvcml6YXRpb24nXSA9IGBCZWFyZXIgJHt0b2tlbn1gO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmVxdWVzdChvcHRpb25zLCAoZXJyb3IsIHJlc3BvbnNlLCBib2R5KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZWplY3QoZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFvdmVycmlkZVN0YXR1c0NvZGVGYWlsdXJlICYmICEocmVzcG9uc2Uuc3RhdHVzQ29kZSA+PSAyMDAgJiYgcmVzcG9uc2Uuc3RhdHVzQ29kZSA8PSAyOTkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChgU3RhdHVzIENvZGU6ICR7cmVzcG9uc2Uuc3RhdHVzQ29kZX1gKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoSlNPTi5wYXJzZShyZXNwb25zZS5ib2R5KSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgcmVqZWN0KGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn0iXSwic291cmNlUm9vdCI6IiJ9