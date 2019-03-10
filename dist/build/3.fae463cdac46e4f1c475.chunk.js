(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[3],{

/***/ "xs3E":
/*!**********************************************************************!*\
  !*** ./client/app/src/services/workspace/project/project.service.js ***!
  \**********************************************************************/
/*! exports provided: ProjectService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ProjectService", function() { return ProjectService; });
/* harmony import */ var _shared_utils_http__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../shared/utils/http */ "dkJd");

class ProjectService {
  constructor() {
    this.http = new _shared_utils_http__WEBPACK_IMPORTED_MODULE_0__["Http"]();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9jbGllbnQvYXBwL3NyYy9zZXJ2aWNlcy93b3Jrc3BhY2UvcHJvamVjdC9wcm9qZWN0LnNlcnZpY2UuanMiXSwibmFtZXMiOlsiUHJvamVjdFNlcnZpY2UiLCJjb25zdHJ1Y3RvciIsImh0dHAiLCJIdHRwIiwiZ2V0Iiwid29ya3NwYWNlX2lkIiwicHJvamVjdF9pZCIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwicmVzdWx0cyIsImUiLCJwdXQiLCJwcm9qZWN0IiwiaXRlbXMiLCJjb25maWciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUVPLE1BQU1BLGNBQU4sQ0FBcUI7QUFDeEJDLGFBQVcsR0FBRztBQUNWLFNBQUtDLElBQUwsR0FBWSxJQUFJQyx1REFBSixFQUFaO0FBQ0g7O0FBRURDLEtBQUcsQ0FBQ0MsWUFBRCxFQUFlQyxVQUFmLEVBQTJCO0FBQzFCLFdBQU8sSUFBSUMsT0FBSixDQUFZLE9BQU9DLE9BQVAsRUFBZ0JDLE1BQWhCLEtBQTJCO0FBQzFDLFVBQUk7QUFDQSxZQUFJQyxPQUFPLEdBQUcsTUFBTSxLQUFLUixJQUFMLENBQVVFLEdBQVYsQ0FBZSxxQkFBb0JDLFlBQWEsWUFBV0MsVUFBVyxFQUF0RSxDQUFwQjtBQUVBRSxlQUFPLENBQUNFLE9BQUQsQ0FBUDtBQUNILE9BSkQsQ0FJRSxPQUFPQyxDQUFQLEVBQVU7QUFDUkYsY0FBTSxDQUFDRSxDQUFELENBQU47QUFDSDtBQUNKLEtBUk0sQ0FBUDtBQVNIOztBQUVEQyxLQUFHLENBQUNQLFlBQUQsRUFBZUMsVUFBZixFQUEyQk8sT0FBM0IsRUFBb0M7QUFDbkMsV0FBTyxJQUFJTixPQUFKLENBQVksT0FBT0MsT0FBUCxFQUFnQkMsTUFBaEIsS0FBMkI7QUFDMUMsVUFBSTtBQUNBLGNBQU0sS0FBS1AsSUFBTCxDQUFVVSxHQUFWLENBQWUscUJBQW9CUCxZQUFhLFlBQVdDLFVBQVcsRUFBdEUsRUFBeUU7QUFDM0VRLGVBQUssRUFBRUQsT0FBTyxDQUFDQyxLQUQ0RDtBQUUzRUMsZ0JBQU0sRUFBRUYsT0FBTyxDQUFDRTtBQUYyRCxTQUF6RSxDQUFOO0FBS0FQLGVBQU87QUFDVixPQVBELENBT0UsT0FBT0csQ0FBUCxFQUFVO0FBQ1JGLGNBQU0sQ0FBQ0UsQ0FBRCxDQUFOO0FBQ0g7QUFDSixLQVhNLENBQVA7QUFZSDs7QUE5QnVCO0FBK0IzQixDIiwiZmlsZSI6ImJ1aWxkLzMuZmFlNDYzY2RhYzQ2ZTRmMWM0NzUuY2h1bmsuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBIdHRwIH0gZnJvbSAnLi4vLi4vLi4vc2hhcmVkL3V0aWxzL2h0dHAnO1xyXG5cclxuZXhwb3J0IGNsYXNzIFByb2plY3RTZXJ2aWNlIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuaHR0cCA9IG5ldyBIdHRwKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0KHdvcmtzcGFjZV9pZCwgcHJvamVjdF9pZCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcmVzdWx0cyA9IGF3YWl0IHRoaXMuaHR0cC5nZXQoYC9hcGkvdjEvd29ya3NwYWNlLyR7d29ya3NwYWNlX2lkfS9wcm9qZWN0LyR7cHJvamVjdF9pZH1gKTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShyZXN1bHRzKTtcclxuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgcmVqZWN0KGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHV0KHdvcmtzcGFjZV9pZCwgcHJvamVjdF9pZCwgcHJvamVjdCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLmh0dHAucHV0KGAvYXBpL3YxL3dvcmtzcGFjZS8ke3dvcmtzcGFjZV9pZH0vcHJvamVjdC8ke3Byb2plY3RfaWR9YCwge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiBwcm9qZWN0Lml0ZW1zLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbmZpZzogcHJvamVjdC5jb25maWdcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgcmVqZWN0KGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn07Il0sInNvdXJjZVJvb3QiOiIifQ==