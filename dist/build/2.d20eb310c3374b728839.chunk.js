(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[2],{

/***/ "XSen":
/*!***************************************************!*\
  !*** ./client/common/services/project.service.js ***!
  \***************************************************/
/*! exports provided: ProjectService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ProjectService", function() { return ProjectService; });
/* harmony import */ var _http__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../http */ "CFaH");

class ProjectService {
  constructor() {
    this.http = new _http__WEBPACK_IMPORTED_MODULE_0__["Http"]();
  }

  get(workspace_id, project_id) {
    return new Promise(async (resolve, reject) => {
      try {
        let results = await this.http.get(`/api/v1/workspace/${workspace_id}/project/${project_id}`);
        resolve(results);
      } catch (e) {
        reject(e);
      }
    });
  }

  put(workspace_id, project_id, project) {
    return new Promise(async (resolve, reject) => {
      try {
        await this.http.put(`/api/v1/workspace/${workspace_id}/project/${project_id}`, {
          items: project.items,
          config: project.config
        });
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }

}
;

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9jbGllbnQvY29tbW9uL3NlcnZpY2VzL3Byb2plY3Quc2VydmljZS5qcyJdLCJuYW1lcyI6WyJQcm9qZWN0U2VydmljZSIsImNvbnN0cnVjdG9yIiwiaHR0cCIsIkh0dHAiLCJnZXQiLCJ3b3Jrc3BhY2VfaWQiLCJwcm9qZWN0X2lkIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJyZXN1bHRzIiwiZSIsInB1dCIsInByb2plY3QiLCJpdGVtcyIsImNvbmZpZyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBRU8sTUFBTUEsY0FBTixDQUFxQjtBQUN4QkMsYUFBVyxHQUFHO0FBQ1YsU0FBS0MsSUFBTCxHQUFZLElBQUlDLDBDQUFKLEVBQVo7QUFDSDs7QUFFREMsS0FBRyxDQUFDQyxZQUFELEVBQWVDLFVBQWYsRUFBMkI7QUFDMUIsV0FBTyxJQUFJQyxPQUFKLENBQVksT0FBT0MsT0FBUCxFQUFnQkMsTUFBaEIsS0FBMkI7QUFDMUMsVUFBSTtBQUNBLFlBQUlDLE9BQU8sR0FBRyxNQUFNLEtBQUtSLElBQUwsQ0FBVUUsR0FBVixDQUFlLHFCQUFvQkMsWUFBYSxZQUFXQyxVQUFXLEVBQXRFLENBQXBCO0FBRUFFLGVBQU8sQ0FBQ0UsT0FBRCxDQUFQO0FBQ0gsT0FKRCxDQUlFLE9BQU9DLENBQVAsRUFBVTtBQUNSRixjQUFNLENBQUNFLENBQUQsQ0FBTjtBQUNIO0FBQ0osS0FSTSxDQUFQO0FBU0g7O0FBRURDLEtBQUcsQ0FBQ1AsWUFBRCxFQUFlQyxVQUFmLEVBQTJCTyxPQUEzQixFQUFvQztBQUNuQyxXQUFPLElBQUlOLE9BQUosQ0FBWSxPQUFPQyxPQUFQLEVBQWdCQyxNQUFoQixLQUEyQjtBQUMxQyxVQUFJO0FBQ0EsY0FBTSxLQUFLUCxJQUFMLENBQVVVLEdBQVYsQ0FBZSxxQkFBb0JQLFlBQWEsWUFBV0MsVUFBVyxFQUF0RSxFQUF5RTtBQUMzRVEsZUFBSyxFQUFFRCxPQUFPLENBQUNDLEtBRDREO0FBRTNFQyxnQkFBTSxFQUFFRixPQUFPLENBQUNFO0FBRjJELFNBQXpFLENBQU47QUFLQVAsZUFBTztBQUNWLE9BUEQsQ0FPRSxPQUFPRyxDQUFQLEVBQVU7QUFDUkYsY0FBTSxDQUFDRSxDQUFELENBQU47QUFDSDtBQUNKLEtBWE0sQ0FBUDtBQVlIOztBQTlCdUI7QUErQjNCLEMiLCJmaWxlIjoiYnVpbGQvMi5kMjBlYjMxMGMzMzc0YjcyODgzOS5jaHVuay5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEh0dHAgfSBmcm9tICcuLi9odHRwJztcclxuXHJcbmV4cG9ydCBjbGFzcyBQcm9qZWN0U2VydmljZSB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmh0dHAgPSBuZXcgSHR0cCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCh3b3Jrc3BhY2VfaWQsIHByb2plY3RfaWQpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHJlc3VsdHMgPSBhd2FpdCB0aGlzLmh0dHAuZ2V0KGAvYXBpL3YxL3dvcmtzcGFjZS8ke3dvcmtzcGFjZV9pZH0vcHJvamVjdC8ke3Byb2plY3RfaWR9YCk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHJlc29sdmUocmVzdWx0cyk7XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgIHJlamVjdChlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1dCh3b3Jrc3BhY2VfaWQsIHByb2plY3RfaWQsIHByb2plY3QpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5odHRwLnB1dChgL2FwaS92MS93b3Jrc3BhY2UvJHt3b3Jrc3BhY2VfaWR9L3Byb2plY3QvJHtwcm9qZWN0X2lkfWAsIHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtczogcHJvamVjdC5pdGVtcyxcclxuICAgICAgICAgICAgICAgICAgICBjb25maWc6IHByb2plY3QuY29uZmlnXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgIHJlamVjdChlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59OyJdLCJzb3VyY2VSb290IjoiIn0=