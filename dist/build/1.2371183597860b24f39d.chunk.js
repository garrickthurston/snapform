(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[1],{

/***/ "7MDm":
/*!******************************************************************************************!*\
  !*** ./client/app/src/components/internal/workspace/project/project-output.component.js ***!
  \******************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ "/MKj");
/* harmony import */ var _config_redux_redux_store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../config/redux/redux.store */ "MBHU");
/* harmony import */ var _shared_utils_json_syntax__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../shared/utils/json-syntax */ "HxH0");
/* harmony import */ var _services_workspace_project_project_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../services/workspace/project/project.service */ "xs3E");






const mapStateToProps = state => state;

class ProjectOutputComponent extends react__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  constructor(props) {
    super(props);
    this.state = {};
    this.projectService = new _services_workspace_project_project_service__WEBPACK_IMPORTED_MODULE_4__["ProjectService"]();
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
    this.handleCloseClick = this.handleCloseClick.bind(this);
    this.projectService.get(this.props.workspace_id, this.props.project_id).then(project => {
      this.setState(Object.assign({}, this.state, {
        project
      }));
    }).catch(e => {});
  }

  componentDidMount() {
    document.addEventListener('click', this.handleOutsideClick, false);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleOutsideClick, false);
  }

  handleOutsideClick(e) {
    if (this.output.contains(e.target)) {
      return;
    }

    this.props.onClose();
  }

  handleCloseClick(e) {
    this.props.onClose();
  }

  render() {
    const {
      project
    } = this.state;
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, project ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      ref: output => this.output = output,
      className: "project-output-container"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "close-icon-container",
      onClick: this.handleCloseClick
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
      className: "close-icon"
    })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("pre", {
      dangerouslySetInnerHTML: {
        __html: Object(_shared_utils_json_syntax__WEBPACK_IMPORTED_MODULE_3__["syntaxHighlight"])(JSON.stringify(project, null, 2))
      }
    })) : null);
  }

}

const ProjectOutput = Object(react_redux__WEBPACK_IMPORTED_MODULE_1__["connect"])(mapStateToProps, null)(ProjectOutputComponent);
/* harmony default export */ __webpack_exports__["default"] = (ProjectOutput);

/***/ }),

/***/ "HxH0":
/*!****************************************************!*\
  !*** ./client/app/src/shared/utils/json-syntax.js ***!
  \****************************************************/
/*! exports provided: syntaxHighlight */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "syntaxHighlight", function() { return syntaxHighlight; });
const syntaxHighlight = json => {
  if (typeof json != 'string') {
    json = JSON.stringify(json, undefined, 2);
  }

  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
    var cls = 'number';

    if (/^"/.test(match)) {
      if (/:$/.test(match)) {
        cls = 'key';
      } else {
        cls = 'string';
      }
    } else if (/true|false/.test(match)) {
      cls = 'boolean';
    } else if (/null/.test(match)) {
      cls = 'null';
    }

    return '<span class="' + cls + '">' + match + '</span>';
  });
};

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9jbGllbnQvYXBwL3NyYy9jb21wb25lbnRzL2ludGVybmFsL3dvcmtzcGFjZS9wcm9qZWN0L3Byb2plY3Qtb3V0cHV0LmNvbXBvbmVudC5qcyIsIndlYnBhY2s6Ly8vLi9jbGllbnQvYXBwL3NyYy9zaGFyZWQvdXRpbHMvanNvbi1zeW50YXguanMiXSwibmFtZXMiOlsibWFwU3RhdGVUb1Byb3BzIiwic3RhdGUiLCJQcm9qZWN0T3V0cHV0Q29tcG9uZW50IiwiQ29tcG9uZW50IiwiY29uc3RydWN0b3IiLCJwcm9wcyIsInByb2plY3RTZXJ2aWNlIiwiUHJvamVjdFNlcnZpY2UiLCJoYW5kbGVPdXRzaWRlQ2xpY2siLCJiaW5kIiwiaGFuZGxlQ2xvc2VDbGljayIsImdldCIsIndvcmtzcGFjZV9pZCIsInByb2plY3RfaWQiLCJ0aGVuIiwicHJvamVjdCIsInNldFN0YXRlIiwiT2JqZWN0IiwiYXNzaWduIiwiY2F0Y2giLCJlIiwiY29tcG9uZW50RGlkTW91bnQiLCJkb2N1bWVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJjb21wb25lbnRXaWxsVW5tb3VudCIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJvdXRwdXQiLCJjb250YWlucyIsInRhcmdldCIsIm9uQ2xvc2UiLCJyZW5kZXIiLCJfX2h0bWwiLCJzeW50YXhIaWdobGlnaHQiLCJKU09OIiwic3RyaW5naWZ5IiwiUHJvamVjdE91dHB1dCIsImNvbm5lY3QiLCJqc29uIiwidW5kZWZpbmVkIiwicmVwbGFjZSIsIm1hdGNoIiwiY2xzIiwidGVzdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7QUFFQSxNQUFNQSxlQUFlLEdBQUlDLEtBQUQsSUFBV0EsS0FBbkM7O0FBRUEsTUFBTUMsc0JBQU4sU0FBcUNDLCtDQUFyQyxDQUErQztBQUMzQ0MsYUFBVyxDQUFDQyxLQUFELEVBQVE7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VixDQUFKLEVBQXNCO0FBQ2xCLFVBQUksS0FBS0UsSUFBTCxDQUFVRixLQUFWLENBQUosRUFBc0I7QUFDbEJDLFdBQUcsR0FBRyxLQUFOO0FBQ0gsT0FGRCxNQUVPO0FBQ0hBLFdBQUcsR0FBRyxRQUFOO0FBQ0g7QUFDSixLQU5ELE1BTU8sSUFBSSxhQUFhQyxJQUFiLENBQWtCRixLQUFsQixDQUFKLEVBQThCO0FBQ2pDQyxTQUFHLEdBQUcsU0FBTjtBQUNILEtBRk0sTUFFQSxJQUFJLE9BQU9DLElBQVAsQ0FBWUYsS0FBWixDQUFKLEVBQXdCO0FBQzNCQyxTQUFHLEdBQUcsTUFBTjtBQUNIOztBQUNELFdBQU8sa0JBQWtCQSxHQUFsQixHQUF3QixJQUF4QixHQUErQkQsS0FBL0IsR0FBdUMsU0FBOUM7QUFDSCxHQWRNLENBQVA7QUFlSCxDQXBCTSxDIiwiZmlsZSI6ImJ1aWxkLzEuMjM3MTE4MzU5Nzg2MGIyNGYzOWQuY2h1bmsuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50IH0gZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSAncmVhY3QtcmVkdXgnO1xyXG5pbXBvcnQgeyBzdG9yZSB9IGZyb20gJy4uLy4uLy4uLy4uL2NvbmZpZy9yZWR1eC9yZWR1eC5zdG9yZSc7XHJcbmltcG9ydCB7IHN5bnRheEhpZ2hsaWdodCB9IGZyb20gJy4uLy4uLy4uLy4uL3NoYXJlZC91dGlscy9qc29uLXN5bnRheCc7XHJcblxyXG5pbXBvcnQgeyBQcm9qZWN0U2VydmljZSB9IGZyb20gJy4uLy4uLy4uLy4uL3NlcnZpY2VzL3dvcmtzcGFjZS9wcm9qZWN0L3Byb2plY3Quc2VydmljZSc7XHJcblxyXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSAoc3RhdGUpID0+IHN0YXRlO1xyXG5cclxuY2xhc3MgUHJvamVjdE91dHB1dENvbXBvbmVudCBleHRlbmRzIENvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuXHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHt9O1xyXG4gICAgICAgIHRoaXMucHJvamVjdFNlcnZpY2UgPSBuZXcgUHJvamVjdFNlcnZpY2UoKTtcclxuXHJcbiAgICAgICAgdGhpcy5oYW5kbGVPdXRzaWRlQ2xpY2sgPSB0aGlzLmhhbmRsZU91dHNpZGVDbGljay5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlQ2xvc2VDbGljayA9IHRoaXMuaGFuZGxlQ2xvc2VDbGljay5iaW5kKHRoaXMpO1xyXG5cclxuICAgICAgICB0aGlzLnByb2plY3RTZXJ2aWNlLmdldCh0aGlzLnByb3BzLndvcmtzcGFjZV9pZCwgdGhpcy5wcm9wcy5wcm9qZWN0X2lkKS50aGVuKHByb2plY3QgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKE9iamVjdC5hc3NpZ24oe30sIHRoaXMuc3RhdGUsIHtcclxuICAgICAgICAgICAgICAgIHByb2plY3RcclxuICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgIH0pLmNhdGNoKGUgPT4ge1xyXG5cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuaGFuZGxlT3V0c2lkZUNsaWNrLCBmYWxzZSk7XHJcbiAgICB9XHJcblxyXG4gICAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XHJcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmhhbmRsZU91dHNpZGVDbGljaywgZmFsc2UpXHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlT3V0c2lkZUNsaWNrKGUpIHtcclxuICAgICAgICBpZiAodGhpcy5vdXRwdXQuY29udGFpbnMoZS50YXJnZXQpKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMucHJvcHMub25DbG9zZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZUNsb3NlQ2xpY2soZSkge1xyXG4gICAgICAgIHRoaXMucHJvcHMub25DbG9zZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IHByb2plY3QgfSA9IHRoaXMuc3RhdGU7XHJcblxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICB7cHJvamVjdCA/XHJcbiAgICAgICAgICAgICAgICA8ZGl2IHJlZj17b3V0cHV0ID0+IHRoaXMub3V0cHV0ID0gb3V0cHV0fSBjbGFzc05hbWU9XCJwcm9qZWN0LW91dHB1dC1jb250YWluZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNsb3NlLWljb24tY29udGFpbmVyXCIgb25DbGljaz17dGhpcy5oYW5kbGVDbG9zZUNsaWNrfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiY2xvc2UtaWNvblwiPjwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8cHJlIGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MPXt7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF9faHRtbDogc3ludGF4SGlnaGxpZ2h0KEpTT04uc3RyaW5naWZ5KHByb2plY3QsIG51bGwsIDIpKVxyXG4gICAgICAgICAgICAgICAgICAgIH19PjwvcHJlPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA6IG51bGx9XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IFByb2plY3RPdXRwdXQgPSBjb25uZWN0KG1hcFN0YXRlVG9Qcm9wcywgbnVsbCkoUHJvamVjdE91dHB1dENvbXBvbmVudCk7XHJcbmV4cG9ydCBkZWZhdWx0IFByb2plY3RPdXRwdXQ7IiwiZXhwb3J0IGNvbnN0IHN5bnRheEhpZ2hsaWdodCA9IChqc29uKSA9PiB7XHJcbiAgICBpZiAodHlwZW9mIGpzb24gIT0gJ3N0cmluZycpIHtcclxuICAgICAgICBqc29uID0gSlNPTi5zdHJpbmdpZnkoanNvbiwgdW5kZWZpbmVkLCAyKTtcclxuICAgIH1cclxuICAgIGpzb24gPSBqc29uLnJlcGxhY2UoLyYvZywgJyZhbXA7JykucmVwbGFjZSgvPC9nLCAnJmx0OycpLnJlcGxhY2UoLz4vZywgJyZndDsnKTtcclxuICAgIHJldHVybiBqc29uLnJlcGxhY2UoLyhcIihcXFxcdVthLXpBLVowLTldezR9fFxcXFxbXnVdfFteXFxcXFwiXSkqXCIoXFxzKjopP3xcXGIodHJ1ZXxmYWxzZXxudWxsKVxcYnwtP1xcZCsoPzpcXC5cXGQqKT8oPzpbZUVdWytcXC1dP1xcZCspPykvZywgZnVuY3Rpb24gKG1hdGNoKSB7XHJcbiAgICAgICAgdmFyIGNscyA9ICdudW1iZXInO1xyXG4gICAgICAgIGlmICgvXlwiLy50ZXN0KG1hdGNoKSkge1xyXG4gICAgICAgICAgICBpZiAoLzokLy50ZXN0KG1hdGNoKSkge1xyXG4gICAgICAgICAgICAgICAgY2xzID0gJ2tleSc7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjbHMgPSAnc3RyaW5nJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAoL3RydWV8ZmFsc2UvLnRlc3QobWF0Y2gpKSB7XHJcbiAgICAgICAgICAgIGNscyA9ICdib29sZWFuJztcclxuICAgICAgICB9IGVsc2UgaWYgKC9udWxsLy50ZXN0KG1hdGNoKSkge1xyXG4gICAgICAgICAgICBjbHMgPSAnbnVsbCc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAnPHNwYW4gY2xhc3M9XCInICsgY2xzICsgJ1wiPicgKyBtYXRjaCArICc8L3NwYW4+JztcclxuICAgIH0pO1xyXG59OyJdLCJzb3VyY2VSb290IjoiIn0=