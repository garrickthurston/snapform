(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[2],{

/***/ "tPso":
/*!***********************************************************!*\
  !*** ./client/app/src/shared/services/project.service.js ***!
  \***********************************************************/
/*! exports provided: ProjectService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ProjectService", function() { return ProjectService; });
/* harmony import */ var _utils_http__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/http */ "dkJd");

class ProjectService {
  constructor() {
    this.http = new _utils_http__WEBPACK_IMPORTED_MODULE_0__["Http"]();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9jbGllbnQvYXBwL3NyYy9zaGFyZWQvc2VydmljZXMvcHJvamVjdC5zZXJ2aWNlLmpzIl0sIm5hbWVzIjpbIlByb2plY3RTZXJ2aWNlIiwiY29uc3RydWN0b3IiLCJodHRwIiwiSHR0cCIsImdldCIsIndvcmtzcGFjZV9pZCIsInByb2plY3RfaWQiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsInJlc3VsdHMiLCJlIiwicHV0IiwicHJvamVjdCIsIml0ZW1zIiwiY29uZmlnIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFFTyxNQUFNQSxjQUFOLENBQXFCO0FBQ3hCQyxhQUFXLEdBQUc7QUFDVixTQUFLQyxJQUFMLEdBQVksSUFBSUMsZ0RBQUosRUFBWjtBQUNIOztBQUVEQyxLQUFHLENBQUNDLFlBQUQsRUFBZUMsVUFBZixFQUEyQjtBQUMxQixXQUFPLElBQUlDLE9BQUosQ0FBWSxPQUFPQyxPQUFQLEVBQWdCQyxNQUFoQixLQUEyQjtBQUMxQyxVQUFJO0FBQ0EsWUFBSUMsT0FBTyxHQUFHLE1BQU0sS0FBS1IsSUFBTCxDQUFVRSxHQUFWLENBQWUscUJBQW9CQyxZQUFhLFlBQVdDLFVBQVcsRUFBdEUsQ0FBcEI7QUFFQUUsZUFBTyxDQUFDRSxPQUFELENBQVA7QUFDSCxPQUpELENBSUUsT0FBT0MsQ0FBUCxFQUFVO0FBQ1JGLGNBQU0sQ0FBQ0UsQ0FBRCxDQUFOO0FBQ0g7QUFDSixLQVJNLENBQVA7QUFTSDs7QUFFREMsS0FBRyxDQUFDUCxZQUFELEVBQWVDLFVBQWYsRUFBMkJPLE9BQTNCLEVBQW9DO0FBQ25DLFdBQU8sSUFBSU4sT0FBSixDQUFZLE9BQU9DLE9BQVAsRUFBZ0JDLE1BQWhCLEtBQTJCO0FBQzFDLFVBQUk7QUFDQSxjQUFNLEtBQUtQLElBQUwsQ0FBVVUsR0FBVixDQUFlLHFCQUFvQlAsWUFBYSxZQUFXQyxVQUFXLEVBQXRFLEVBQXlFO0FBQzNFUSxlQUFLLEVBQUVELE9BQU8sQ0FBQ0MsS0FENEQ7QUFFM0VDLGdCQUFNLEVBQUVGLE9BQU8sQ0FBQ0U7QUFGMkQsU0FBekUsQ0FBTjtBQUtBUCxlQUFPO0FBQ1YsT0FQRCxDQU9FLE9BQU9HLENBQVAsRUFBVTtBQUNSRixjQUFNLENBQUNFLENBQUQsQ0FBTjtBQUNIO0FBQ0osS0FYTSxDQUFQO0FBWUg7O0FBOUJ1QjtBQStCM0IsQyIsImZpbGUiOiJidWlsZC8yLjViNTA4MDE0MzAxMWI2MjJlYjY1LmNodW5rLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSHR0cCB9IGZyb20gJy4uL3V0aWxzL2h0dHAnO1xyXG5cclxuZXhwb3J0IGNsYXNzIFByb2plY3RTZXJ2aWNlIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuaHR0cCA9IG5ldyBIdHRwKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0KHdvcmtzcGFjZV9pZCwgcHJvamVjdF9pZCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcmVzdWx0cyA9IGF3YWl0IHRoaXMuaHR0cC5nZXQoYC9hcGkvdjEvd29ya3NwYWNlLyR7d29ya3NwYWNlX2lkfS9wcm9qZWN0LyR7cHJvamVjdF9pZH1gKTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShyZXN1bHRzKTtcclxuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgcmVqZWN0KGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHV0KHdvcmtzcGFjZV9pZCwgcHJvamVjdF9pZCwgcHJvamVjdCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLmh0dHAucHV0KGAvYXBpL3YxL3dvcmtzcGFjZS8ke3dvcmtzcGFjZV9pZH0vcHJvamVjdC8ke3Byb2plY3RfaWR9YCwge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiBwcm9qZWN0Lml0ZW1zLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbmZpZzogcHJvamVjdC5jb25maWdcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgcmVqZWN0KGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn07Il0sInNvdXJjZVJvb3QiOiIifQ==