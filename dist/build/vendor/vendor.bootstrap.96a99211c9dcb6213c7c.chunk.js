(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["vendor/vendor.bootstrap"],{

/***/ "SYky":
/*!*****************************************************!*\
  !*** ./node_modules/bootstrap/dist/js/bootstrap.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*!
  * Bootstrap v4.2.1 (https://getbootstrap.com/)
  * Copyright 2011-2018 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
  */
(function (global, factory) {
   true ? factory(exports, __webpack_require__(/*! popper.js */ "8L3F"), __webpack_require__(/*! jquery */ "EVdn")) :
  undefined;
}(this, (function (exports,Popper,$) { 'use strict';

  Popper = Popper && Popper.hasOwnProperty('default') ? Popper['default'] : Popper;
  $ = $ && $.hasOwnProperty('default') ? $['default'] : $;

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};
      var ownKeys = Object.keys(source);

      if (typeof Object.getOwnPropertySymbols === 'function') {
        ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        }));
      }

      ownKeys.forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    }

    return target;
  }

  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    subClass.__proto__ = superClass;
  }

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v4.2.1): util.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
   * --------------------------------------------------------------------------
   */
  /**
   * ------------------------------------------------------------------------
   * Private TransitionEnd Helpers
   * ------------------------------------------------------------------------
   */

  var TRANSITION_END = 'transitionend';
  var MAX_UID = 1000000;
  var MILLISECONDS_MULTIPLIER = 1000; // Shoutout AngusCroll (https://goo.gl/pxwQGp)

  function toType(obj) {
    return {}.toString.call(obj).match(/\s([a-z]+)/i)[1].toLowerCase();
  }

  function getSpecialTransitionEndEvent() {
    return {
      bindType: TRANSITION_END,
      delegateType: TRANSITION_END,
      handle: function handle(event) {
        if ($(event.target).is(this)) {
          return event.handleObj.handler.apply(this, arguments); // eslint-disable-line prefer-rest-params
        }

        return undefined; // eslint-disable-line no-undefined
      }
    };
  }

  function transitionEndEmulator(duration) {
    var _this = this;

    var called = false;
    $(this).one(Util.TRANSITION_END, function () {
      called = true;
    });
    setTimeout(function () {
      if (!called) {
        Util.triggerTransitionEnd(_this);
      }
    }, duration);
    return this;
  }

  function setTransitionEndSupport() {
    $.fn.emulateTransitionEnd = transitionEndEmulator;
    $.event.special[Util.TRANSITION_END] = getSpecialTransitionEndEvent();
  }
  /**
   * --------------------------------------------------------------------------
   * Public Util Api
   * --------------------------------------------------------------------------
   */


  var Util = {
    TRANSITION_END: 'bsTransitionEnd',
    getUID: function getUID(prefix) {
      do {
        // eslint-disable-next-line no-bitwise
        prefix += ~~(Math.random() * MAX_UID); // "~~" acts like a faster Math.floor() here
      } while (document.getElementById(prefix));

      return prefix;
    },
    getSelectorFromElement: function getSelectorFromElement(element) {
      var selector = element.getAttribute('data-target');

      if (!selector || selector === '#') {
        var hrefAttr = element.getAttribute('href');
        selector = hrefAttr && hrefAttr !== '#' ? hrefAttr.trim() : '';
      }

      return selector && document.querySelector(selector) ? selector : null;
    },
    getTransitionDurationFromElement: function getTransitionDurationFromElement(element) {
      if (!element) {
        return 0;
      } // Get transition-duration of the element


      var transitionDuration = $(element).css('transition-duration');
      var transitionDelay = $(element).css('transition-delay');
      var floatTransitionDuration = parseFloat(transitionDuration);
      var floatTransitionDelay = parseFloat(transitionDelay); // Return 0 if element or transition duration is not found

      if (!floatTransitionDuration && !floatTransitionDelay) {
        return 0;
      } // If multiple durations are defined, take the first


      transitionDuration = transitionDuration.split(',')[0];
      transitionDelay = transitionDelay.split(',')[0];
      return (parseFloat(transitionDuration) + parseFloat(transitionDelay)) * MILLISECONDS_MULTIPLIER;
    },
    reflow: function reflow(element) {
      return element.offsetHeight;
    },
    triggerTransitionEnd: function triggerTransitionEnd(element) {
      $(element).trigger(TRANSITION_END);
    },
    // TODO: Remove in v5
    supportsTransitionEnd: function supportsTransitionEnd() {
      return Boolean(TRANSITION_END);
    },
    isElement: function isElement(obj) {
      return (obj[0] || obj).nodeType;
    },
    typeCheckConfig: function typeCheckConfig(componentName, config, configTypes) {
      for (var property in configTypes) {
        if (Object.prototype.hasOwnProperty.call(configTypes, property)) {
          var expectedTypes = configTypes[property];
          var value = config[property];
          var valueType = value && Util.isElement(value) ? 'element' : toType(value);

          if (!new RegExp(expectedTypes).test(valueType)) {
            throw new Error(componentName.toUpperCase() + ": " + ("Option \"" + property + "\" provided type \"" + valueType + "\" ") + ("but expected type \"" + expectedTypes + "\"."));
          }
        }
      }
    },
    findShadowRoot: function findShadowRoot(element) {
      if (!document.documentElement.attachShadow) {
        return null;
      } // Can find the shadow root otherwise it'll return the document


      if (typeof element.getRootNode === 'function') {
        var root = element.getRootNode();
        return root instanceof ShadowRoot ? root : null;
      }

      if (element instanceof ShadowRoot) {
        return element;
      } // when we don't find a shadow root


      if (!element.parentNode) {
        return null;
      }

      return Util.findShadowRoot(element.parentNode);
    }
  };
  setTransitionEndSupport();

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  var NAME = 'alert';
  var VERSION = '4.2.1';
  var DATA_KEY = 'bs.alert';
  var EVENT_KEY = "." + DATA_KEY;
  var DATA_API_KEY = '.data-api';
  var JQUERY_NO_CONFLICT = $.fn[NAME];
  var Selector = {
    DISMISS: '[data-dismiss="alert"]'
  };
  var Event = {
    CLOSE: "close" + EVENT_KEY,
    CLOSED: "closed" + EVENT_KEY,
    CLICK_DATA_API: "click" + EVENT_KEY + DATA_API_KEY
  };
  var ClassName = {
    ALERT: 'alert',
    FADE: 'fade',
    SHOW: 'show'
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

  };

  var Alert =
  /*#__PURE__*/
  function () {
    function Alert(element) {
      this._element = element;
    } // Getters


    var _proto = Alert.prototype;

    // Public
    _proto.close = function close(element) {
      var rootElement = this._element;

      if (element) {
        rootElement = this._getRootElement(element);
      }

      var customEvent = this._triggerCloseEvent(rootElement);

      if (customEvent.isDefaultPrevented()) {
        return;
      }

      this._removeElement(rootElement);
    };

    _proto.dispose = function dispose() {
      $.removeData(this._element, DATA_KEY);
      this._element = null;
    }; // Private


    _proto._getRootElement = function _getRootElement(element) {
      var selector = Util.getSelectorFromElement(element);
      var parent = false;

      if (selector) {
        parent = document.querySelector(selector);
      }

      if (!parent) {
        parent = $(element).closest("." + ClassName.ALERT)[0];
      }

      return parent;
    };

    _proto._triggerCloseEvent = function _triggerCloseEvent(element) {
      var closeEvent = $.Event(Event.CLOSE);
      $(element).trigger(closeEvent);
      return closeEvent;
    };

    _proto._removeElement = function _removeElement(element) {
      var _this = this;

      $(element).removeClass(ClassName.SHOW);

      if (!$(element).hasClass(ClassName.FADE)) {
        this._destroyElement(element);

        return;
      }

      var transitionDuration = Util.getTransitionDurationFromElement(element);
      $(element).one(Util.TRANSITION_END, function (event) {
        return _this._destroyElement(element, event);
      }).emulateTransitionEnd(transitionDuration);
    };

    _proto._destroyElement = function _destroyElement(element) {
      $(element).detach().trigger(Event.CLOSED).remove();
    }; // Static


    Alert._jQueryInterface = function _jQueryInterface(config) {
      return this.each(function () {
        var $element = $(this);
        var data = $element.data(DATA_KEY);

        if (!data) {
          data = new Alert(this);
          $element.data(DATA_KEY, data);
        }

        if (config === 'close') {
          data[config](this);
        }
      });
    };

    Alert._handleDismiss = function _handleDismiss(alertInstance) {
      return function (event) {
        if (event) {
          event.preventDefault();
        }

        alertInstance.close(this);
      };
    };

    _createClass(Alert, null, [{
      key: "VERSION",
      get: function get() {
        return VERSION;
      }
    }]);

    return Alert;
  }();
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  $(document).on(Event.CLICK_DATA_API, Selector.DISMISS, Alert._handleDismiss(new Alert()));
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $.fn[NAME] = Alert._jQueryInterface;
  $.fn[NAME].Constructor = Alert;

  $.fn[NAME].noConflict = function () {
    $.fn[NAME] = JQUERY_NO_CONFLICT;
    return Alert._jQueryInterface;
  };

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  var NAME$1 = 'button';
  var VERSION$1 = '4.2.1';
  var DATA_KEY$1 = 'bs.button';
  var EVENT_KEY$1 = "." + DATA_KEY$1;
  var DATA_API_KEY$1 = '.data-api';
  var JQUERY_NO_CONFLICT$1 = $.fn[NAME$1];
  var ClassName$1 = {
    ACTIVE: 'active',
    BUTTON: 'btn',
    FOCUS: 'focus'
  };
  var Selector$1 = {
    DATA_TOGGLE_CARROT: '[data-toggle^="button"]',
    DATA_TOGGLE: '[data-toggle="buttons"]',
    INPUT: 'input:not([type="hidden"])',
    ACTIVE: '.active',
    BUTTON: '.btn'
  };
  var Event$1 = {
    CLICK_DATA_API: "click" + EVENT_KEY$1 + DATA_API_KEY$1,
    FOCUS_BLUR_DATA_API: "focus" + EVENT_KEY$1 + DATA_API_KEY$1 + " " + ("blur" + EVENT_KEY$1 + DATA_API_KEY$1)
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

  };

  var Button =
  /*#__PURE__*/
  function () {
    function Button(element) {
      this._element = element;
    } // Getters


    var _proto = Button.prototype;

    // Public
    _proto.toggle = function toggle() {
      var triggerChangeEvent = true;
      var addAriaPressed = true;
      var rootElement = $(this._element).closest(Selector$1.DATA_TOGGLE)[0];

      if (rootElement) {
        var input = this._element.querySelector(Selector$1.INPUT);

        if (input) {
          if (input.type === 'radio') {
            if (input.checked && this._element.classList.contains(ClassName$1.ACTIVE)) {
              triggerChangeEvent = false;
            } else {
              var activeElement = rootElement.querySelector(Selector$1.ACTIVE);

              if (activeElement) {
                $(activeElement).removeClass(ClassName$1.ACTIVE);
              }
            }
          }

          if (triggerChangeEvent) {
            if (input.hasAttribute('disabled') || rootElement.hasAttribute('disabled') || input.classList.contains('disabled') || rootElement.classList.contains('disabled')) {
              return;
            }

            input.checked = !this._element.classList.contains(ClassName$1.ACTIVE);
            $(input).trigger('change');
          }

          input.focus();
          addAriaPressed = false;
        }
      }

      if (addAriaPressed) {
        this._element.setAttribute('aria-pressed', !this._element.classList.contains(ClassName$1.ACTIVE));
      }

      if (triggerChangeEvent) {
        $(this._element).toggleClass(ClassName$1.ACTIVE);
      }
    };

    _proto.dispose = function dispose() {
      $.removeData(this._element, DATA_KEY$1);
      this._element = null;
    }; // Static


    Button._jQueryInterface = function _jQueryInterface(config) {
      return this.each(function () {
        var data = $(this).data(DATA_KEY$1);

        if (!data) {
          data = new Button(this);
          $(this).data(DATA_KEY$1, data);
        }

        if (config === 'toggle') {
          data[config]();
        }
      });
    };

    _createClass(Button, null, [{
      key: "VERSION",
      get: function get() {
        return VERSION$1;
      }
    }]);

    return Button;
  }();
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  $(document).on(Event$1.CLICK_DATA_API, Selector$1.DATA_TOGGLE_CARROT, function (event) {
    event.preventDefault();
    var button = event.target;

    if (!$(button).hasClass(ClassName$1.BUTTON)) {
      button = $(button).closest(Selector$1.BUTTON);
    }

    Button._jQueryInterface.call($(button), 'toggle');
  }).on(Event$1.FOCUS_BLUR_DATA_API, Selector$1.DATA_TOGGLE_CARROT, function (event) {
    var button = $(event.target).closest(Selector$1.BUTTON)[0];
    $(button).toggleClass(ClassName$1.FOCUS, /^focus(in)?$/.test(event.type));
  });
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $.fn[NAME$1] = Button._jQueryInterface;
  $.fn[NAME$1].Constructor = Button;

  $.fn[NAME$1].noConflict = function () {
    $.fn[NAME$1] = JQUERY_NO_CONFLICT$1;
    return Button._jQueryInterface;
  };

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  var NAME$2 = 'carousel';
  var VERSION$2 = '4.2.1';
  var DATA_KEY$2 = 'bs.carousel';
  var EVENT_KEY$2 = "." + DATA_KEY$2;
  var DATA_API_KEY$2 = '.data-api';
  var JQUERY_NO_CONFLICT$2 = $.fn[NAME$2];
  var ARROW_LEFT_KEYCODE = 37; // KeyboardEvent.which value for left arrow key

  var ARROW_RIGHT_KEYCODE = 39; // KeyboardEvent.which value for right arrow key

  var TOUCHEVENT_COMPAT_WAIT = 500; // Time for mouse compat events to fire after touch

  var SWIPE_THRESHOLD = 40;
  var Default = {
    interval: 5000,
    keyboard: true,
    slide: false,
    pause: 'hover',
    wrap: true,
    touch: true
  };
  var DefaultType = {
    interval: '(number|boolean)',
    keyboard: 'boolean',
    slide: '(boolean|string)',
    pause: '(string|boolean)',
    wrap: 'boolean',
    touch: 'boolean'
  };
  var Direction = {
    NEXT: 'next',
    PREV: 'prev',
    LEFT: 'left',
    RIGHT: 'right'
  };
  var Event$2 = {
    SLIDE: "slide" + EVENT_KEY$2,
    SLID: "slid" + EVENT_KEY$2,
    KEYDOWN: "keydown" + EVENT_KEY$2,
    MOUSEENTER: "mouseenter" + EVENT_KEY$2,
    MOUSELEAVE: "mouseleave" + EVENT_KEY$2,
    TOUCHSTART: "touchstart" + EVENT_KEY$2,
    TOUCHMOVE: "touchmove" + EVENT_KEY$2,
    TOUCHEND: "touchend" + EVENT_KEY$2,
    POINTERDOWN: "pointerdown" + EVENT_KEY$2,
    POINTERUP: "pointerup" + EVENT_KEY$2,
    DRAG_START: "dragstart" + EVENT_KEY$2,
    LOAD_DATA_API: "load" + EVENT_KEY$2 + DATA_API_KEY$2,
    CLICK_DATA_API: "click" + EVENT_KEY$2 + DATA_API_KEY$2
  };
  var ClassName$2 = {
    CAROUSEL: 'carousel',
    ACTIVE: 'active',
    SLIDE: 'slide',
    RIGHT: 'carousel-item-right',
    LEFT: 'carousel-item-left',
    NEXT: 'carousel-item-next',
    PREV: 'carousel-item-prev',
    ITEM: 'carousel-item',
    POINTER_EVENT: 'pointer-event'
  };
  var Selector$2 = {
    ACTIVE: '.active',
    ACTIVE_ITEM: '.active.carousel-item',
    ITEM: '.carousel-item',
    ITEM_IMG: '.carousel-item img',
    NEXT_PREV: '.carousel-item-next, .carousel-item-prev',
    INDICATORS: '.carousel-indicators',
    DATA_SLIDE: '[data-slide], [data-slide-to]',
    DATA_RIDE: '[data-ride="carousel"]'
  };
  var PointerType = {
    TOUCH: 'touch',
    PEN: 'pen'
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

  };

  var Carousel =
  /*#__PURE__*/
  function () {
    function Carousel(element, config) {
      this._items = null;
      this._interval = null;
      this._activeElement = null;
      this._isPaused = false;
      this._isSliding = false;
      this.touchTimeout = null;
      this.touchStartX = 0;
      this.touchDeltaX = 0;
      this._config = this._getConfig(config);
      this._element = element;
      this._indicatorsElement = this._element.querySelector(Selector$2.INDICATORS);
      this._touchSupported = 'ontouchstart' in document.documentElement || navigator.maxTouchPoints > 0;
      this._pointerEvent = Boolean(window.PointerEvent || window.MSPointerEvent);

      this._addEventListeners();
    } // Getters


    var _proto = Carousel.prototype;

    // Public
    _proto.next = function next() {
      if (!this._isSliding) {
        this._slide(Direction.NEXT);
      }
    };

    _proto.nextWhenVisible = function nextWhenVisible() {
      // Don't call next when the page isn't visible
      // or the carousel or its parent isn't visible
      if (!document.hidden && $(this._element).is(':visible') && $(this._element).css('visibility') !== 'hidden') {
        this.next();
      }
    };

    _proto.prev = function prev() {
      if (!this._isSliding) {
        this._slide(Direction.PREV);
      }
    };

    _proto.pause = function pause(event) {
      if (!event) {
        this._isPaused = true;
      }

      if (this._element.querySelector(Selector$2.NEXT_PREV)) {
        Util.triggerTransitionEnd(this._element);
        this.cycle(true);
      }

      clearInterval(this._interval);
      this._interval = null;
    };

    _proto.cycle = function cycle(event) {
      if (!event) {
        this._isPaused = false;
      }

      if (this._interval) {
        clearInterval(this._interval);
        this._interval = null;
      }

      if (this._config.interval && !this._isPaused) {
        this._interval = setInterval((document.visibilityState ? this.nextWhenVisible : this.next).bind(this), this._config.interval);
      }
    };

    _proto.to = function to(index) {
      var _this = this;

      this._activeElement = this._element.querySelector(Selector$2.ACTIVE_ITEM);

      var activeIndex = this._getItemIndex(this._activeElement);

      if (index > this._items.length - 1 || index < 0) {
        return;
      }

      if (this._isSliding) {
        $(this._element).one(Event$2.SLID, function () {
          return _this.to(index);
        });
        return;
      }

      if (activeIndex === index) {
        this.pause();
        this.cycle();
        return;
      }

      var direction = index > activeIndex ? Direction.NEXT : Direction.PREV;

      this._slide(direction, this._items[index]);
    };

    _proto.dispose = function dispose() {
      $(this._element).off(EVENT_KEY$2);
      $.removeData(this._element, DATA_KEY$2);
      this._items = null;
      this._config = null;
      this._element = null;
      this._interval = null;
      this._isPaused = null;
      this._isSliding = null;
      this._activeElement = null;
      this._indicatorsElement = null;
    }; // Private


    _proto._getConfig = function _getConfig(config) {
      config = _objectSpread({}, Default, config);
      Util.typeCheckConfig(NAME$2, config, DefaultType);
      return config;
    };

    _proto._handleSwipe = function _handleSwipe() {
      var absDeltax = Math.abs(this.touchDeltaX);

      if (absDeltax <= SWIPE_THRESHOLD) {
        return;
      }

      var direction = absDeltax / this.touchDeltaX; // swipe left

      if (direction > 0) {
        this.prev();
      } // swipe right


      if (direction < 0) {
        this.next();
      }
    };

    _proto._addEventListeners = function _addEventListeners() {
      var _this2 = this;

      if (this._config.keyboard) {
        $(this._element).on(Event$2.KEYDOWN, function (event) {
          return _this2._keydown(event);
        });
      }

      if (this._config.pause === 'hover') {
        $(this._element).on(Event$2.MOUSEENTER, function (event) {
          return _this2.pause(event);
        }).on(Event$2.MOUSELEAVE, function (event) {
          return _this2.cycle(event);
        });
      }

      this._addTouchEventListeners();
    };

    _proto._addTouchEventListeners = function _addTouchEventListeners() {
      var _this3 = this;

      if (!this._touchSupported) {
        return;
      }

      var start = function start(event) {
        if (_this3._pointerEvent && PointerType[event.originalEvent.pointerType.toUpperCase()]) {
          _this3.touchStartX = event.originalEvent.clientX;
        } else if (!_this3._pointerEvent) {
          _this3.touchStartX = event.originalEvent.touches[0].clientX;
        }
      };

      var move = function move(event) {
        // ensure swiping with one touch and not pinching
        if (event.originalEvent.touches && event.originalEvent.touches.length > 1) {
          _this3.touchDeltaX = 0;
        } else {
          _this3.touchDeltaX = event.originalEvent.touches[0].clientX - _this3.touchStartX;
        }
      };

      var end = function end(event) {
        if (_this3._pointerEvent && PointerType[event.originalEvent.pointerType.toUpperCase()]) {
          _this3.touchDeltaX = event.originalEvent.clientX - _this3.touchStartX;
        }

        _this3._handleSwipe();

        if (_this3._config.pause === 'hover') {
          // If it's a touch-enabled device, mouseenter/leave are fired as
          // part of the mouse compatibility events on first tap - the carousel
          // would stop cycling until user tapped out of it;
          // here, we listen for touchend, explicitly pause the carousel
          // (as if it's the second time we tap on it, mouseenter compat event
          // is NOT fired) and after a timeout (to allow for mouse compatibility
          // events to fire) we explicitly restart cycling
          _this3.pause();

          if (_this3.touchTimeout) {
            clearTimeout(_this3.touchTimeout);
          }

          _this3.touchTimeout = setTimeout(function (event) {
            return _this3.cycle(event);
          }, TOUCHEVENT_COMPAT_WAIT + _this3._config.interval);
        }
      };

      $(this._element.querySelectorAll(Selector$2.ITEM_IMG)).on(Event$2.DRAG_START, function (e) {
        return e.preventDefault();
      });

      if (this._pointerEvent) {
        $(this._element).on(Event$2.POINTERDOWN, function (event) {
          return start(event);
        });
        $(this._element).on(Event$2.POINTERUP, function (event) {
          return end(event);
        });

        this._element.classList.add(ClassName$2.POINTER_EVENT);
      } else {
        $(this._element).on(Event$2.TOUCHSTART, function (event) {
          return start(event);
        });
        $(this._element).on(Event$2.TOUCHMOVE, function (event) {
          return move(event);
        });
        $(this._element).on(Event$2.TOUCHEND, function (event) {
          return end(event);
        });
      }
    };

    _proto._keydown = function _keydown(event) {
      if (/input|textarea/i.test(event.target.tagName)) {
        return;
      }

      switch (event.which) {
        case ARROW_LEFT_KEYCODE:
          event.preventDefault();
          this.prev();
          break;

        case ARROW_RIGHT_KEYCODE:
          event.preventDefault();
          this.next();
          break;

        default:
      }
    };

    _proto._getItemIndex = function _getItemIndex(element) {
      this._items = element && element.parentNode ? [].slice.call(element.parentNode.querySelectorAll(Selector$2.ITEM)) : [];
      return this._items.indexOf(element);
    };

    _proto._getItemByDirection = function _getItemByDirection(direction, activeElement) {
      var isNextDirection = direction === Direction.NEXT;
      var isPrevDirection = direction === Direction.PREV;

      var activeIndex = this._getItemIndex(activeElement);

      var lastItemIndex = this._items.length - 1;
      var isGoingToWrap = isPrevDirection && activeIndex === 0 || isNextDirection && activeIndex === lastItemIndex;

      if (isGoingToWrap && !this._config.wrap) {
        return activeElement;
      }

      var delta = direction === Direction.PREV ? -1 : 1;
      var itemIndex = (activeIndex + delta) % this._items.length;
      return itemIndex === -1 ? this._items[this._items.length - 1] : this._items[itemIndex];
    };

    _proto._triggerSlideEvent = function _triggerSlideEvent(relatedTarget, eventDirectionName) {
      var targetIndex = this._getItemIndex(relatedTarget);

      var fromIndex = this._getItemIndex(this._element.querySelector(Selector$2.ACTIVE_ITEM));

      var slideEvent = $.Event(Event$2.SLIDE, {
        relatedTarget: relatedTarget,
        direction: eventDirectionName,
        from: fromIndex,
        to: targetIndex
      });
      $(this._element).trigger(slideEvent);
      return slideEvent;
    };

    _proto._setActiveIndicatorElement = function _setActiveIndicatorElement(element) {
      if (this._indicatorsElement) {
        var indicators = [].slice.call(this._indicatorsElement.querySelectorAll(Selector$2.ACTIVE));
        $(indicators).removeClass(ClassName$2.ACTIVE);

        var nextIndicator = this._indicatorsElement.children[this._getItemIndex(element)];

        if (nextIndicator) {
          $(nextIndicator).addClass(ClassName$2.ACTIVE);
        }
      }
    };

    _proto._slide = function _slide(direction, element) {
      var _this4 = this;

      var activeElement = this._element.querySelector(Selector$2.ACTIVE_ITEM);

      var activeElementIndex = this._getItemIndex(activeElement);

      var nextElement = element || activeElement && this._getItemByDirection(direction, activeElement);

      var nextElementIndex = this._getItemIndex(nextElement);

      var isCycling = Boolean(this._interval);
      var directionalClassName;
      var orderClassName;
      var eventDirectionName;

      if (direction === Direction.NEXT) {
        directionalClassName = ClassName$2.LEFT;
        orderClassName = ClassName$2.NEXT;
        eventDirectionName = Direction.LEFT;
      } else {
        directionalClassName = ClassName$2.RIGHT;
        orderClassName = ClassName$2.PREV;
        eventDirectionName = Direction.RIGHT;
      }

      if (nextElement && $(nextElement).hasClass(ClassName$2.ACTIVE)) {
        this._isSliding = false;
        return;
      }

      var slideEvent = this._triggerSlideEvent(nextElement, eventDirectionName);

      if (slideEvent.isDefaultPrevented()) {
        return;
      }

      if (!activeElement || !nextElement) {
        // Some weirdness is happening, so we bail
        return;
      }

      this._isSliding = true;

      if (isCycling) {
        this.pause();
      }

      this._setActiveIndicatorElement(nextElement);

      var slidEvent = $.Event(Event$2.SLID, {
        relatedTarget: nextElement,
        direction: eventDirectionName,
        from: activeElementIndex,
        to: nextElementIndex
      });

      if ($(this._element).hasClass(ClassName$2.SLIDE)) {
        $(nextElement).addClass(orderClassName);
        Util.reflow(nextElement);
        $(activeElement).addClass(directionalClassName);
        $(nextElement).addClass(directionalClassName);
        var nextElementInterval = parseInt(nextElement.getAttribute('data-interval'), 10);

        if (nextElementInterval) {
          this._config.defaultInterval = this._config.defaultInterval || this._config.interval;
          this._config.interval = nextElementInterval;
        } else {
          this._config.interval = this._config.defaultInterval || this._config.interval;
        }

        var transitionDuration = Util.getTransitionDurationFromElement(activeElement);
        $(activeElement).one(Util.TRANSITION_END, function () {
          $(nextElement).removeClass(directionalClassName + " " + orderClassName).addClass(ClassName$2.ACTIVE);
          $(activeElement).removeClass(ClassName$2.ACTIVE + " " + orderClassName + " " + directionalClassName);
          _this4._isSliding = false;
          setTimeout(function () {
            return $(_this4._element).trigger(slidEvent);
          }, 0);
        }).emulateTransitionEnd(transitionDuration);
      } else {
        $(activeElement).removeClass(ClassName$2.ACTIVE);
        $(nextElement).addClass(ClassName$2.ACTIVE);
        this._isSliding = false;
        $(this._element).trigger(slidEvent);
      }

      if (isCycling) {
        this.cycle();
      }
    }; // Static


    Carousel._jQueryInterface = function _jQueryInterface(config) {
      return this.each(function () {
        var data = $(this).data(DATA_KEY$2);

        var _config = _objectSpread({}, Default, $(this).data());

        if (typeof config === 'object') {
          _config = _objectSpread({}, _config, config);
        }

        var action = typeof config === 'string' ? config : _config.slide;

        if (!data) {
          data = new Carousel(this, _config);
          $(this).data(DATA_KEY$2, data);
        }

        if (typeof config === 'number') {
          data.to(config);
        } else if (typeof action === 'string') {
          if (typeof data[action] === 'undefined') {
            throw new TypeError("No method named \"" + action + "\"");
          }

          data[action]();
        } else if (_config.interval) {
          data.pause();
          data.cycle();
        }
      });
    };

    Carousel._dataApiClickHandler = function _dataApiClickHandler(event) {
      var selector = Util.getSelectorFromElement(this);

      if (!selector) {
        return;
      }

      var target = $(selector)[0];

      if (!target || !$(target).hasClass(ClassName$2.CAROUSEL)) {
        return;
      }

      var config = _objectSpread({}, $(target).data(), $(this).data());

      var slideIndex = this.getAttribute('data-slide-to');

      if (slideIndex) {
        config.interval = false;
      }

      Carousel._jQueryInterface.call($(target), config);

      if (slideIndex) {
        $(target).data(DATA_KEY$2).to(slideIndex);
      }

      event.preventDefault();
    };

    _createClass(Carousel, null, [{
      key: "VERSION",
      get: function get() {
        return VERSION$2;
      }
    }, {
      key: "Default",
      get: function get() {
        return Default;
      }
    }]);

    return Carousel;
  }();
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  $(document).on(Event$2.CLICK_DATA_API, Selector$2.DATA_SLIDE, Carousel._dataApiClickHandler);
  $(window).on(Event$2.LOAD_DATA_API, function () {
    var carousels = [].slice.call(document.querySelectorAll(Selector$2.DATA_RIDE));

    for (var i = 0, len = carousels.length; i < len; i++) {
      var $carousel = $(carousels[i]);

      Carousel._jQueryInterface.call($carousel, $carousel.data());
    }
  });
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $.fn[NAME$2] = Carousel._jQueryInterface;
  $.fn[NAME$2].Constructor = Carousel;

  $.fn[NAME$2].noConflict = function () {
    $.fn[NAME$2] = JQUERY_NO_CONFLICT$2;
    return Carousel._jQueryInterface;
  };

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  var NAME$3 = 'collapse';
  var VERSION$3 = '4.2.1';
  var DATA_KEY$3 = 'bs.collapse';
  var EVENT_KEY$3 = "." + DATA_KEY$3;
  var DATA_API_KEY$3 = '.data-api';
  var JQUERY_NO_CONFLICT$3 = $.fn[NAME$3];
  var Default$1 = {
    toggle: true,
    parent: ''
  };
  var DefaultType$1 = {
    toggle: 'boolean',
    parent: '(string|element)'
  };
  var Event$3 = {
    SHOW: "show" + EVENT_KEY$3,
    SHOWN: "shown" + EVENT_KEY$3,
    HIDE: "hide" + EVENT_KEY$3,
    HIDDEN: "hidden" + EVENT_KEY$3,
    CLICK_DATA_API: "click" + EVENT_KEY$3 + DATA_API_KEY$3
  };
  var ClassName$3 = {
    SHOW: 'show',
    COLLAPSE: 'collapse',
    COLLAPSING: 'collapsing',
    COLLAPSED: 'collapsed'
  };
  var Dimension = {
    WIDTH: 'width',
    HEIGHT: 'height'
  };
  var Selector$3 = {
    ACTIVES: '.show, .collapsing',
    DATA_TOGGLE: '[data-toggle="collapse"]'
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

  };

  var Collapse =
  /*#__PURE__*/
  function () {
    function Collapse(element, config) {
      this._isTransitioning = false;
      this._element = element;
      this._config = this._getConfig(config);
      this._triggerArray = [].slice.call(document.querySelectorAll("[data-toggle=\"collapse\"][href=\"#" + element.id + "\"]," + ("[data-toggle=\"collapse\"][data-target=\"#" + element.id + "\"]")));
      var toggleList = [].slice.call(document.querySelectorAll(Selector$3.DATA_TOGGLE));

      for (var i = 0, len = toggleList.length; i < len; i++) {
        var elem = toggleList[i];
        var selector = Util.getSelectorFromElement(elem);
        var filterElement = [].slice.call(document.querySelectorAll(selector)).filter(function (foundElem) {
          return foundElem === element;
        });

        if (selector !== null && filterElement.length > 0) {
          this._selector = selector;

          this._triggerArray.push(elem);
        }
      }

      this._parent = this._config.parent ? this._getParent() : null;

      if (!this._config.parent) {
        this._addAriaAndCollapsedClass(this._element, this._triggerArray);
      }

      if (this._config.toggle) {
        this.toggle();
      }
    } // Getters


    var _proto = Collapse.prototype;

    // Public
    _proto.toggle = function toggle() {
      if ($(this._element).hasClass(ClassName$3.SHOW)) {
        this.hide();
      } else {
        this.show();
      }
    };

    _proto.show = function show() {
      var _this = this;

      if (this._isTransitioning || $(this._element).hasClass(ClassName$3.SHOW)) {
        return;
      }

      var actives;
      var activesData;

      if (this._parent) {
        actives = [].slice.call(this._parent.querySelectorAll(Selector$3.ACTIVES)).filter(function (elem) {
          if (typeof _this._config.parent === 'string') {
            return elem.getAttribute('data-parent') === _this._config.parent;
          }

          return elem.classList.contains(ClassName$3.COLLAPSE);
        });

        if (actives.length === 0) {
          actives = null;
        }
      }

      if (actives) {
        activesData = $(actives).not(this._selector).data(DATA_KEY$3);

        if (activesData && activesData._isTransitioning) {
          return;
        }
      }

      var startEvent = $.Event(Event$3.SHOW);
      $(this._element).trigger(startEvent);

      if (startEvent.isDefaultPrevented()) {
        return;
      }

      if (actives) {
        Collapse._jQueryInterface.call($(actives).not(this._selector), 'hide');

        if (!activesData) {
          $(actives).data(DATA_KEY$3, null);
        }
      }

      var dimension = this._getDimension();

      $(this._element).removeClass(ClassName$3.COLLAPSE).addClass(ClassName$3.COLLAPSING);
      this._element.style[dimension] = 0;

      if (this._triggerArray.length) {
        $(this._triggerArray).removeClass(ClassName$3.COLLAPSED).attr('aria-expanded', true);
      }

      this.setTransitioning(true);

      var complete = function complete() {
        $(_this._element).removeClass(ClassName$3.COLLAPSING).addClass(ClassName$3.COLLAPSE).addClass(ClassName$3.SHOW);
        _this._element.style[dimension] = '';

        _this.setTransitioning(false);

        $(_this._element).trigger(Event$3.SHOWN);
      };

      var capitalizedDimension = dimension[0].toUpperCase() + dimension.slice(1);
      var scrollSize = "scroll" + capitalizedDimension;
      var transitionDuration = Util.getTransitionDurationFromElement(this._element);
      $(this._element).one(Util.TRANSITION_END, complete).emulateTransitionEnd(transitionDuration);
      this._element.style[dimension] = this._element[scrollSize] + "px";
    };

    _proto.hide = function hide() {
      var _this2 = this;

      if (this._isTransitioning || !$(this._element).hasClass(ClassName$3.SHOW)) {
        return;
      }

      var startEvent = $.Event(Event$3.HIDE);
      $(this._element).trigger(startEvent);

      if (startEvent.isDefaultPrevented()) {
        return;
      }

      var dimension = this._getDimension();

      this._element.style[dimension] = this._element.getBoundingClientRect()[dimension] + "px";
      Util.reflow(this._element);
      $(this._element).addClass(ClassName$3.COLLAPSING).removeClass(ClassName$3.COLLAPSE).removeClass(ClassName$3.SHOW);
      var triggerArrayLength = this._triggerArray.length;

      if (triggerArrayLength > 0) {
        for (var i = 0; i < triggerArrayLength; i++) {
          var trigger = this._triggerArray[i];
          var selector = Util.getSelectorFromElement(trigger);

          if (selector !== null) {
            var $elem = $([].slice.call(document.querySelectorAll(selector)));

            if (!$elem.hasClass(ClassName$3.SHOW)) {
              $(trigger).addClass(ClassName$3.COLLAPSED).attr('aria-expanded', false);
            }
          }
        }
      }

      this.setTransitioning(true);

      var complete = function complete() {
        _this2.setTransitioning(false);

        $(_this2._element).removeClass(ClassName$3.COLLAPSING).addClass(ClassName$3.COLLAPSE).trigger(Event$3.HIDDEN);
      };

      this._element.style[dimension] = '';
      var transitionDuration = Util.getTransitionDurationFromElement(this._element);
      $(this._element).one(Util.TRANSITION_END, complete).emulateTransitionEnd(transitionDuration);
    };

    _proto.setTransitioning = function setTransitioning(isTransitioning) {
      this._isTransitioning = isTransitioning;
    };

    _proto.dispose = function dispose() {
      $.removeData(this._element, DATA_KEY$3);
      this._config = null;
      this._parent = null;
      this._element = null;
      this._triggerArray = null;
      this._isTransitioning = null;
    }; // Private


    _proto._getConfig = function _getConfig(config) {
      config = _objectSpread({}, Default$1, config);
      config.toggle = Boolean(config.toggle); // Coerce string values

      Util.typeCheckConfig(NAME$3, config, DefaultType$1);
      return config;
    };

    _proto._getDimension = function _getDimension() {
      var hasWidth = $(this._element).hasClass(Dimension.WIDTH);
      return hasWidth ? Dimension.WIDTH : Dimension.HEIGHT;
    };

    _proto._getParent = function _getParent() {
      var _this3 = this;

      var parent;

      if (Util.isElement(this._config.parent)) {
        parent = this._config.parent; // It's a jQuery object

        if (typeof this._config.parent.jquery !== 'undefined') {
          parent = this._config.parent[0];
        }
      } else {
        parent = document.querySelector(this._config.parent);
      }

      var selector = "[data-toggle=\"collapse\"][data-parent=\"" + this._config.parent + "\"]";
      var children = [].slice.call(parent.querySelectorAll(selector));
      $(children).each(function (i, element) {
        _this3._addAriaAndCollapsedClass(Collapse._getTargetFromElement(element), [element]);
      });
      return parent;
    };

    _proto._addAriaAndCollapsedClass = function _addAriaAndCollapsedClass(element, triggerArray) {
      var isOpen = $(element).hasClass(ClassName$3.SHOW);

      if (triggerArray.length) {
        $(triggerArray).toggleClass(ClassName$3.COLLAPSED, !isOpen).attr('aria-expanded', isOpen);
      }
    }; // Static


    Collapse._getTargetFromElement = function _getTargetFromElement(element) {
      var selector = Util.getSelectorFromElement(element);
      return selector ? document.querySelector(selector) : null;
    };

    Collapse._jQueryInterface = function _jQueryInterface(config) {
      return this.each(function () {
        var $this = $(this);
        var data = $this.data(DATA_KEY$3);

        var _config = _objectSpread({}, Default$1, $this.data(), typeof config === 'object' && config ? config : {});

        if (!data && _config.toggle && /show|hide/.test(config)) {
          _config.toggle = false;
        }

        if (!data) {
          data = new Collapse(this, _config);
          $this.data(DATA_KEY$3, data);
        }

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError("No method named \"" + config + "\"");
          }

          data[config]();
        }
      });
    };

    _createClass(Collapse, null, [{
      key: "VERSION",
      get: function get() {
        return VERSION$3;
      }
    }, {
      key: "Default",
      get: function get() {
        return Default$1;
      }
    }]);

    return Collapse;
  }();
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  $(document).on(Event$3.CLICK_DATA_API, Selector$3.DATA_TOGGLE, function (event) {
    // preventDefault only for <a> elements (which change the URL) not inside the collapsible element
    if (event.currentTarget.tagName === 'A') {
      event.preventDefault();
    }

    var $trigger = $(this);
    var selector = Util.getSelectorFromElement(this);
    var selectors = [].slice.call(document.querySelectorAll(selector));
    $(selectors).each(function () {
      var $target = $(this);
      var data = $target.data(DATA_KEY$3);
      var config = data ? 'toggle' : $trigger.data();

      Collapse._jQueryInterface.call($target, config);
    });
  });
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $.fn[NAME$3] = Collapse._jQueryInterface;
  $.fn[NAME$3].Constructor = Collapse;

  $.fn[NAME$3].noConflict = function () {
    $.fn[NAME$3] = JQUERY_NO_CONFLICT$3;
    return Collapse._jQueryInterface;
  };

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  var NAME$4 = 'dropdown';
  var VERSION$4 = '4.2.1';
  var DATA_KEY$4 = 'bs.dropdown';
  var EVENT_KEY$4 = "." + DATA_KEY$4;
  var DATA_API_KEY$4 = '.data-api';
  var JQUERY_NO_CONFLICT$4 = $.fn[NAME$4];
  var ESCAPE_KEYCODE = 27; // KeyboardEvent.which value for Escape (Esc) key

  var SPACE_KEYCODE = 32; // KeyboardEvent.which value for space key

  var TAB_KEYCODE = 9; // KeyboardEvent.which value for tab key

  var ARROW_UP_KEYCODE = 38; // KeyboardEvent.which value for up arrow key

  var ARROW_DOWN_KEYCODE = 40; // KeyboardEvent.which value for down arrow key

  var RIGHT_MOUSE_BUTTON_WHICH = 3; // MouseEvent.which value for the right button (assuming a right-handed mouse)

  var REGEXP_KEYDOWN = new RegExp(ARROW_UP_KEYCODE + "|" + ARROW_DOWN_KEYCODE + "|" + ESCAPE_KEYCODE);
  var Event$4 = {
    HIDE: "hide" + EVENT_KEY$4,
    HIDDEN: "hidden" + EVENT_KEY$4,
    SHOW: "show" + EVENT_KEY$4,
    SHOWN: "shown" + EVENT_KEY$4,
    CLICK: "click" + EVENT_KEY$4,
    CLICK_DATA_API: "click" + EVENT_KEY$4 + DATA_API_KEY$4,
    KEYDOWN_DATA_API: "keydown" + EVENT_KEY$4 + DATA_API_KEY$4,
    KEYUP_DATA_API: "keyup" + EVENT_KEY$4 + DATA_API_KEY$4
  };
  var ClassName$4 = {
    DISABLED: 'disabled',
    SHOW: 'show',
    DROPUP: 'dropup',
    DROPRIGHT: 'dropright',
    DROPLEFT: 'dropleft',
    MENURIGHT: 'dropdown-menu-right',
    MENULEFT: 'dropdown-menu-left',
    POSITION_STATIC: 'position-static'
  };
  var Selector$4 = {
    DATA_TOGGLE: '[data-toggle="dropdown"]',
    FORM_CHILD: '.dropdown form',
    MENU: '.dropdown-menu',
    NAVBAR_NAV: '.navbar-nav',
    VISIBLE_ITEMS: '.dropdown-menu .dropdown-item:not(.disabled):not(:disabled)'
  };
  var AttachmentMap = {
    TOP: 'top-start',
    TOPEND: 'top-end',
    BOTTOM: 'bottom-start',
    BOTTOMEND: 'bottom-end',
    RIGHT: 'right-start',
    RIGHTEND: 'right-end',
    LEFT: 'left-start',
    LEFTEND: 'left-end'
  };
  var Default$2 = {
    offset: 0,
    flip: true,
    boundary: 'scrollParent',
    reference: 'toggle',
    display: 'dynamic'
  };
  var DefaultType$2 = {
    offset: '(number|string|function)',
    flip: 'boolean',
    boundary: '(string|element)',
    reference: '(string|element)',
    display: 'string'
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

  };

  var Dropdown =
  /*#__PURE__*/
  function () {
    function Dropdown(element, config) {
      this._element = element;
      this._popper = null;
      this._config = this._getConfig(config);
      this._menu = this._getMenuElement();
      this._inNavbar = this._detectNavbar();

      this._addEventListeners();
    } // Getters


    var _proto = Dropdown.prototype;

    // Public
    _proto.toggle = function toggle() {
      if (this._element.disabled || $(this._element).hasClass(ClassName$4.DISABLED)) {
        return;
      }

      var parent = Dropdown._getParentFromElement(this._element);

      var isActive = $(this._menu).hasClass(ClassName$4.SHOW);

      Dropdown._clearMenus();

      if (isActive) {
        return;
      }

      var relatedTarget = {
        relatedTarget: this._element
      };
      var showEvent = $.Event(Event$4.SHOW, relatedTarget);
      $(parent).trigger(showEvent);

      if (showEvent.isDefaultPrevented()) {
        return;
      } // Disable totally Popper.js for Dropdown in Navbar


      if (!this._inNavbar) {
        /**
         * Check for Popper dependency
         * Popper - https://popper.js.org
         */
        if (typeof Popper === 'undefined') {
          throw new TypeError('Bootstrap\'s dropdowns require Popper.js (https://popper.js.org/)');
        }

        var referenceElement = this._element;

        if (this._config.reference === 'parent') {
          referenceElement = parent;
        } else if (Util.isElement(this._config.reference)) {
          referenceElement = this._config.reference; // Check if it's jQuery element

          if (typeof this._config.reference.jquery !== 'undefined') {
            referenceElement = this._config.reference[0];
          }
        } // If boundary is not `scrollParent`, then set position to `static`
        // to allow the menu to "escape" the scroll parent's boundaries
        // https://github.com/twbs/bootstrap/issues/24251


        if (this._config.boundary !== 'scrollParent') {
          $(parent).addClass(ClassName$4.POSITION_STATIC);
        }

        this._popper = new Popper(referenceElement, this._menu, this._getPopperConfig());
      } // If this is a touch-enabled device we add extra
      // empty mouseover listeners to the body's immediate children;
      // only needed because of broken event delegation on iOS
      // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html


      if ('ontouchstart' in document.documentElement && $(parent).closest(Selector$4.NAVBAR_NAV).length === 0) {
        $(document.body).children().on('mouseover', null, $.noop);
      }

      this._element.focus();

      this._element.setAttribute('aria-expanded', true);

      $(this._menu).toggleClass(ClassName$4.SHOW);
      $(parent).toggleClass(ClassName$4.SHOW).trigger($.Event(Event$4.SHOWN, relatedTarget));
    };

    _proto.show = function show() {
      if (this._element.disabled || $(this._element).hasClass(ClassName$4.DISABLED) || $(this._menu).hasClass(ClassName$4.SHOW)) {
        return;
      }

      var relatedTarget = {
        relatedTarget: this._element
      };
      var showEvent = $.Event(Event$4.SHOW, relatedTarget);

      var parent = Dropdown._getParentFromElement(this._element);

      $(parent).trigger(showEvent);

      if (showEvent.isDefaultPrevented()) {
        return;
      }

      $(this._menu).toggleClass(ClassName$4.SHOW);
      $(parent).toggleClass(ClassName$4.SHOW).trigger($.Event(Event$4.SHOWN, relatedTarget));
    };

    _proto.hide = function hide() {
      if (this._element.disabled || $(this._element).hasClass(ClassName$4.DISABLED) || !$(this._menu).hasClass(ClassName$4.SHOW)) {
        return;
      }

      var relatedTarget = {
        relatedTarget: this._element
      };
      var hideEvent = $.Event(Event$4.HIDE, relatedTarget);

      var parent = Dropdown._getParentFromElement(this._element);

      $(parent).trigger(hideEvent);

      if (hideEvent.isDefaultPrevented()) {
        return;
      }

      $(this._menu).toggleClass(ClassName$4.SHOW);
      $(parent).toggleClass(ClassName$4.SHOW).trigger($.Event(Event$4.HIDDEN, relatedTarget));
    };

    _proto.dispose = function dispose() {
      $.removeData(this._element, DATA_KEY$4);
      $(this._element).off(EVENT_KEY$4);
      this._element = null;
      this._menu = null;

      if (this._popper !== null) {
        this._popper.destroy();

        this._popper = null;
      }
    };

    _proto.update = function update() {
      this._inNavbar = this._detectNavbar();

      if (this._popper !== null) {
        this._popper.scheduleUpdate();
      }
    }; // Private


    _proto._addEventListeners = function _addEventListeners() {
      var _this = this;

      $(this._element).on(Event$4.CLICK, function (event) {
        event.preventDefault();
        event.stopPropagation();

        _this.toggle();
      });
    };

    _proto._getConfig = function _getConfig(config) {
      config = _objectSpread({}, this.constructor.Default, $(this._element).data(), config);
      Util.typeCheckConfig(NAME$4, config, this.constructor.DefaultType);
      return config;
    };

    _proto._getMenuElement = function _getMenuElement() {
      if (!this._menu) {
        var parent = Dropdown._getParentFromElement(this._element);

        if (parent) {
          this._menu = parent.querySelector(Selector$4.MENU);
        }
      }

      return this._menu;
    };

    _proto._getPlacement = function _getPlacement() {
      var $parentDropdown = $(this._element.parentNode);
      var placement = AttachmentMap.BOTTOM; // Handle dropup

      if ($parentDropdown.hasClass(ClassName$4.DROPUP)) {
        placement = AttachmentMap.TOP;

        if ($(this._menu).hasClass(ClassName$4.MENURIGHT)) {
          placement = AttachmentMap.TOPEND;
        }
      } else if ($parentDropdown.hasClass(ClassName$4.DROPRIGHT)) {
        placement = AttachmentMap.RIGHT;
      } else if ($parentDropdown.hasClass(ClassName$4.DROPLEFT)) {
        placement = AttachmentMap.LEFT;
      } else if ($(this._menu).hasClass(ClassName$4.MENURIGHT)) {
        placement = AttachmentMap.BOTTOMEND;
      }

      return placement;
    };

    _proto._detectNavbar = function _detectNavbar() {
      return $(this._element).closest('.navbar').length > 0;
    };

    _proto._getPopperConfig = function _getPopperConfig() {
      var _this2 = this;

      var offsetConf = {};

      if (typeof this._config.offset === 'function') {
        offsetConf.fn = function (data) {
          data.offsets = _objectSpread({}, data.offsets, _this2._config.offset(data.offsets) || {});
          return data;
        };
      } else {
        offsetConf.offset = this._config.offset;
      }

      var popperConfig = {
        placement: this._getPlacement(),
        modifiers: {
          offset: offsetConf,
          flip: {
            enabled: this._config.flip
          },
          preventOverflow: {
            boundariesElement: this._config.boundary
          }
        } // Disable Popper.js if we have a static display

      };

      if (this._config.display === 'static') {
        popperConfig.modifiers.applyStyle = {
          enabled: false
        };
      }

      return popperConfig;
    }; // Static


    Dropdown._jQueryInterface = function _jQueryInterface(config) {
      return this.each(function () {
        var data = $(this).data(DATA_KEY$4);

        var _config = typeof config === 'object' ? config : null;

        if (!data) {
          data = new Dropdown(this, _config);
          $(this).data(DATA_KEY$4, data);
        }

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError("No method named \"" + config + "\"");
          }

          data[config]();
        }
      });
    };

    Dropdown._clearMenus = function _clearMenus(event) {
      if (event && (event.which === RIGHT_MOUSE_BUTTON_WHICH || event.type === 'keyup' && event.which !== TAB_KEYCODE)) {
        return;
      }

      var toggles = [].slice.call(document.querySelectorAll(Selector$4.DATA_TOGGLE));

      for (var i = 0, len = toggles.length; i < len; i++) {
        var parent = Dropdown._getParentFromElement(toggles[i]);

        var context = $(toggles[i]).data(DATA_KEY$4);
        var relatedTarget = {
          relatedTarget: toggles[i]
        };

        if (event && event.type === 'click') {
          relatedTarget.clickEvent = event;
        }

        if (!context) {
          continue;
        }

        var dropdownMenu = context._menu;

        if (!$(parent).hasClass(ClassName$4.SHOW)) {
          continue;
        }

        if (event && (event.type === 'click' && /input|textarea/i.test(event.target.tagName) || event.type === 'keyup' && event.which === TAB_KEYCODE) && $.contains(parent, event.target)) {
          continue;
        }

        var hideEvent = $.Event(Event$4.HIDE, relatedTarget);
        $(parent).trigger(hideEvent);

        if (hideEvent.isDefaultPrevented()) {
          continue;
        } // If this is a touch-enabled device we remove the extra
        // empty mouseover listeners we added for iOS support


        if ('ontouchstart' in document.documentElement) {
          $(document.body).children().off('mouseover', null, $.noop);
        }

        toggles[i].setAttribute('aria-expanded', 'false');
        $(dropdownMenu).removeClass(ClassName$4.SHOW);
        $(parent).removeClass(ClassName$4.SHOW).trigger($.Event(Event$4.HIDDEN, relatedTarget));
      }
    };

    Dropdown._getParentFromElement = function _getParentFromElement(element) {
      var parent;
      var selector = Util.getSelectorFromElement(element);

      if (selector) {
        parent = document.querySelector(selector);
      }

      return parent || element.parentNode;
    }; // eslint-disable-next-line complexity


    Dropdown._dataApiKeydownHandler = function _dataApiKeydownHandler(event) {
      // If not input/textarea:
      //  - And not a key in REGEXP_KEYDOWN => not a dropdown command
      // If input/textarea:
      //  - If space key => not a dropdown command
      //  - If key is other than escape
      //    - If key is not up or down => not a dropdown command
      //    - If trigger inside the menu => not a dropdown command
      if (/input|textarea/i.test(event.target.tagName) ? event.which === SPACE_KEYCODE || event.which !== ESCAPE_KEYCODE && (event.which !== ARROW_DOWN_KEYCODE && event.which !== ARROW_UP_KEYCODE || $(event.target).closest(Selector$4.MENU).length) : !REGEXP_KEYDOWN.test(event.which)) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      if (this.disabled || $(this).hasClass(ClassName$4.DISABLED)) {
        return;
      }

      var parent = Dropdown._getParentFromElement(this);

      var isActive = $(parent).hasClass(ClassName$4.SHOW);

      if (!isActive || isActive && (event.which === ESCAPE_KEYCODE || event.which === SPACE_KEYCODE)) {
        if (event.which === ESCAPE_KEYCODE) {
          var toggle = parent.querySelector(Selector$4.DATA_TOGGLE);
          $(toggle).trigger('focus');
        }

        $(this).trigger('click');
        return;
      }

      var items = [].slice.call(parent.querySelectorAll(Selector$4.VISIBLE_ITEMS));

      if (items.length === 0) {
        return;
      }

      var index = items.indexOf(event.target);

      if (event.which === ARROW_UP_KEYCODE && index > 0) {
        // Up
        index--;
      }

      if (event.which === ARROW_DOWN_KEYCODE && index < items.length - 1) {
        // Down
        index++;
      }

      if (index < 0) {
        index = 0;
      }

      items[index].focus();
    };

    _createClass(Dropdown, null, [{
      key: "VERSION",
      get: function get() {
        return VERSION$4;
      }
    }, {
      key: "Default",
      get: function get() {
        return Default$2;
      }
    }, {
      key: "DefaultType",
      get: function get() {
        return DefaultType$2;
      }
    }]);

    return Dropdown;
  }();
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  $(document).on(Event$4.KEYDOWN_DATA_API, Selector$4.DATA_TOGGLE, Dropdown._dataApiKeydownHandler).on(Event$4.KEYDOWN_DATA_API, Selector$4.MENU, Dropdown._dataApiKeydownHandler).on(Event$4.CLICK_DATA_API + " " + Event$4.KEYUP_DATA_API, Dropdown._clearMenus).on(Event$4.CLICK_DATA_API, Selector$4.DATA_TOGGLE, function (event) {
    event.preventDefault();
    event.stopPropagation();

    Dropdown._jQueryInterface.call($(this), 'toggle');
  }).on(Event$4.CLICK_DATA_API, Selector$4.FORM_CHILD, function (e) {
    e.stopPropagation();
  });
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $.fn[NAME$4] = Dropdown._jQueryInterface;
  $.fn[NAME$4].Constructor = Dropdown;

  $.fn[NAME$4].noConflict = function () {
    $.fn[NAME$4] = JQUERY_NO_CONFLICT$4;
    return Dropdown._jQueryInterface;
  };

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  var NAME$5 = 'modal';
  var VERSION$5 = '4.2.1';
  var DATA_KEY$5 = 'bs.modal';
  var EVENT_KEY$5 = "." + DATA_KEY$5;
  var DATA_API_KEY$5 = '.data-api';
  var JQUERY_NO_CONFLICT$5 = $.fn[NAME$5];
  var ESCAPE_KEYCODE$1 = 27; // KeyboardEvent.which value for Escape (Esc) key

  var Default$3 = {
    backdrop: true,
    keyboard: true,
    focus: true,
    show: true
  };
  var DefaultType$3 = {
    backdrop: '(boolean|string)',
    keyboard: 'boolean',
    focus: 'boolean',
    show: 'boolean'
  };
  var Event$5 = {
    HIDE: "hide" + EVENT_KEY$5,
    HIDDEN: "hidden" + EVENT_KEY$5,
    SHOW: "show" + EVENT_KEY$5,
    SHOWN: "shown" + EVENT_KEY$5,
    FOCUSIN: "focusin" + EVENT_KEY$5,
    RESIZE: "resize" + EVENT_KEY$5,
    CLICK_DISMISS: "click.dismiss" + EVENT_KEY$5,
    KEYDOWN_DISMISS: "keydown.dismiss" + EVENT_KEY$5,
    MOUSEUP_DISMISS: "mouseup.dismiss" + EVENT_KEY$5,
    MOUSEDOWN_DISMISS: "mousedown.dismiss" + EVENT_KEY$5,
    CLICK_DATA_API: "click" + EVENT_KEY$5 + DATA_API_KEY$5
  };
  var ClassName$5 = {
    SCROLLBAR_MEASURER: 'modal-scrollbar-measure',
    BACKDROP: 'modal-backdrop',
    OPEN: 'modal-open',
    FADE: 'fade',
    SHOW: 'show'
  };
  var Selector$5 = {
    DIALOG: '.modal-dialog',
    DATA_TOGGLE: '[data-toggle="modal"]',
    DATA_DISMISS: '[data-dismiss="modal"]',
    FIXED_CONTENT: '.fixed-top, .fixed-bottom, .is-fixed, .sticky-top',
    STICKY_CONTENT: '.sticky-top'
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

  };

  var Modal =
  /*#__PURE__*/
  function () {
    function Modal(element, config) {
      this._config = this._getConfig(config);
      this._element = element;
      this._dialog = element.querySelector(Selector$5.DIALOG);
      this._backdrop = null;
      this._isShown = false;
      this._isBodyOverflowing = false;
      this._ignoreBackdropClick = false;
      this._isTransitioning = false;
      this._scrollbarWidth = 0;
    } // Getters


    var _proto = Modal.prototype;

    // Public
    _proto.toggle = function toggle(relatedTarget) {
      return this._isShown ? this.hide() : this.show(relatedTarget);
    };

    _proto.show = function show(relatedTarget) {
      var _this = this;

      if (this._isShown || this._isTransitioning) {
        return;
      }

      if ($(this._element).hasClass(ClassName$5.FADE)) {
        this._isTransitioning = true;
      }

      var showEvent = $.Event(Event$5.SHOW, {
        relatedTarget: relatedTarget
      });
      $(this._element).trigger(showEvent);

      if (this._isShown || showEvent.isDefaultPrevented()) {
        return;
      }

      this._isShown = true;

      this._checkScrollbar();

      this._setScrollbar();

      this._adjustDialog();

      this._setEscapeEvent();

      this._setResizeEvent();

      $(this._element).on(Event$5.CLICK_DISMISS, Selector$5.DATA_DISMISS, function (event) {
        return _this.hide(event);
      });
      $(this._dialog).on(Event$5.MOUSEDOWN_DISMISS, function () {
        $(_this._element).one(Event$5.MOUSEUP_DISMISS, function (event) {
          if ($(event.target).is(_this._element)) {
            _this._ignoreBackdropClick = true;
          }
        });
      });

      this._showBackdrop(function () {
        return _this._showElement(relatedTarget);
      });
    };

    _proto.hide = function hide(event) {
      var _this2 = this;

      if (event) {
        event.preventDefault();
      }

      if (!this._isShown || this._isTransitioning) {
        return;
      }

      var hideEvent = $.Event(Event$5.HIDE);
      $(this._element).trigger(hideEvent);

      if (!this._isShown || hideEvent.isDefaultPrevented()) {
        return;
      }

      this._isShown = false;
      var transition = $(this._element).hasClass(ClassName$5.FADE);

      if (transition) {
        this._isTransitioning = true;
      }

      this._setEscapeEvent();

      this._setResizeEvent();

      $(document).off(Event$5.FOCUSIN);
      $(this._element).removeClass(ClassName$5.SHOW);
      $(this._element).off(Event$5.CLICK_DISMISS);
      $(this._dialog).off(Event$5.MOUSEDOWN_DISMISS);

      if (transition) {
        var transitionDuration = Util.getTransitionDurationFromElement(this._element);
        $(this._element).one(Util.TRANSITION_END, function (event) {
          return _this2._hideModal(event);
        }).emulateTransitionEnd(transitionDuration);
      } else {
        this._hideModal();
      }
    };

    _proto.dispose = function dispose() {
      [window, this._element, this._dialog].forEach(function (htmlElement) {
        return $(htmlElement).off(EVENT_KEY$5);
      });
      /**
       * `document` has 2 events `Event.FOCUSIN` and `Event.CLICK_DATA_API`
       * Do not move `document` in `htmlElements` array
       * It will remove `Event.CLICK_DATA_API` event that should remain
       */

      $(document).off(Event$5.FOCUSIN);
      $.removeData(this._element, DATA_KEY$5);
      this._config = null;
      this._element = null;
      this._dialog = null;
      this._backdrop = null;
      this._isShown = null;
      this._isBodyOverflowing = null;
      this._ignoreBackdropClick = null;
      this._isTransitioning = null;
      this._scrollbarWidth = null;
    };

    _proto.handleUpdate = function handleUpdate() {
      this._adjustDialog();
    }; // Private


    _proto._getConfig = function _getConfig(config) {
      config = _objectSpread({}, Default$3, config);
      Util.typeCheckConfig(NAME$5, config, DefaultType$3);
      return config;
    };

    _proto._showElement = function _showElement(relatedTarget) {
      var _this3 = this;

      var transition = $(this._element).hasClass(ClassName$5.FADE);

      if (!this._element.parentNode || this._element.parentNode.nodeType !== Node.ELEMENT_NODE) {
        // Don't move modal's DOM position
        document.body.appendChild(this._element);
      }

      this._element.style.display = 'block';

      this._element.removeAttribute('aria-hidden');

      this._element.setAttribute('aria-modal', true);

      this._element.scrollTop = 0;

      if (transition) {
        Util.reflow(this._element);
      }

      $(this._element).addClass(ClassName$5.SHOW);

      if (this._config.focus) {
        this._enforceFocus();
      }

      var shownEvent = $.Event(Event$5.SHOWN, {
        relatedTarget: relatedTarget
      });

      var transitionComplete = function transitionComplete() {
        if (_this3._config.focus) {
          _this3._element.focus();
        }

        _this3._isTransitioning = false;
        $(_this3._element).trigger(shownEvent);
      };

      if (transition) {
        var transitionDuration = Util.getTransitionDurationFromElement(this._dialog);
        $(this._dialog).one(Util.TRANSITION_END, transitionComplete).emulateTransitionEnd(transitionDuration);
      } else {
        transitionComplete();
      }
    };

    _proto._enforceFocus = function _enforceFocus() {
      var _this4 = this;

      $(document).off(Event$5.FOCUSIN) // Guard against infinite focus loop
      .on(Event$5.FOCUSIN, function (event) {
        if (document !== event.target && _this4._element !== event.target && $(_this4._element).has(event.target).length === 0) {
          _this4._element.focus();
        }
      });
    };

    _proto._setEscapeEvent = function _setEscapeEvent() {
      var _this5 = this;

      if (this._isShown && this._config.keyboard) {
        $(this._element).on(Event$5.KEYDOWN_DISMISS, function (event) {
          if (event.which === ESCAPE_KEYCODE$1) {
            event.preventDefault();

            _this5.hide();
          }
        });
      } else if (!this._isShown) {
        $(this._element).off(Event$5.KEYDOWN_DISMISS);
      }
    };

    _proto._setResizeEvent = function _setResizeEvent() {
      var _this6 = this;

      if (this._isShown) {
        $(window).on(Event$5.RESIZE, function (event) {
          return _this6.handleUpdate(event);
        });
      } else {
        $(window).off(Event$5.RESIZE);
      }
    };

    _proto._hideModal = function _hideModal() {
      var _this7 = this;

      this._element.style.display = 'none';

      this._element.setAttribute('aria-hidden', true);

      this._element.removeAttribute('aria-modal');

      this._isTransitioning = false;

      this._showBackdrop(function () {
        $(document.body).removeClass(ClassName$5.OPEN);

        _this7._resetAdjustments();

        _this7._resetScrollbar();

        $(_this7._element).trigger(Event$5.HIDDEN);
      });
    };

    _proto._removeBackdrop = function _removeBackdrop() {
      if (this._backdrop) {
        $(this._backdrop).remove();
        this._backdrop = null;
      }
    };

    _proto._showBackdrop = function _showBackdrop(callback) {
      var _this8 = this;

      var animate = $(this._element).hasClass(ClassName$5.FADE) ? ClassName$5.FADE : '';

      if (this._isShown && this._config.backdrop) {
        this._backdrop = document.createElement('div');
        this._backdrop.className = ClassName$5.BACKDROP;

        if (animate) {
          this._backdrop.classList.add(animate);
        }

        $(this._backdrop).appendTo(document.body);
        $(this._element).on(Event$5.CLICK_DISMISS, function (event) {
          if (_this8._ignoreBackdropClick) {
            _this8._ignoreBackdropClick = false;
            return;
          }

          if (event.target !== event.currentTarget) {
            return;
          }

          if (_this8._config.backdrop === 'static') {
            _this8._element.focus();
          } else {
            _this8.hide();
          }
        });

        if (animate) {
          Util.reflow(this._backdrop);
        }

        $(this._backdrop).addClass(ClassName$5.SHOW);

        if (!callback) {
          return;
        }

        if (!animate) {
          callback();
          return;
        }

        var backdropTransitionDuration = Util.getTransitionDurationFromElement(this._backdrop);
        $(this._backdrop).one(Util.TRANSITION_END, callback).emulateTransitionEnd(backdropTransitionDuration);
      } else if (!this._isShown && this._backdrop) {
        $(this._backdrop).removeClass(ClassName$5.SHOW);

        var callbackRemove = function callbackRemove() {
          _this8._removeBackdrop();

          if (callback) {
            callback();
          }
        };

        if ($(this._element).hasClass(ClassName$5.FADE)) {
          var _backdropTransitionDuration = Util.getTransitionDurationFromElement(this._backdrop);

          $(this._backdrop).one(Util.TRANSITION_END, callbackRemove).emulateTransitionEnd(_backdropTransitionDuration);
        } else {
          callbackRemove();
        }
      } else if (callback) {
        callback();
      }
    }; // ----------------------------------------------------------------------
    // the following methods are used to handle overflowing modals
    // todo (fat): these should probably be refactored out of modal.js
    // ----------------------------------------------------------------------


    _proto._adjustDialog = function _adjustDialog() {
      var isModalOverflowing = this._element.scrollHeight > document.documentElement.clientHeight;

      if (!this._isBodyOverflowing && isModalOverflowing) {
        this._element.style.paddingLeft = this._scrollbarWidth + "px";
      }

      if (this._isBodyOverflowing && !isModalOverflowing) {
        this._element.style.paddingRight = this._scrollbarWidth + "px";
      }
    };

    _proto._resetAdjustments = function _resetAdjustments() {
      this._element.style.paddingLeft = '';
      this._element.style.paddingRight = '';
    };

    _proto._checkScrollbar = function _checkScrollbar() {
      var rect = document.body.getBoundingClientRect();
      this._isBodyOverflowing = rect.left + rect.right < window.innerWidth;
      this._scrollbarWidth = this._getScrollbarWidth();
    };

    _proto._setScrollbar = function _setScrollbar() {
      var _this9 = this;

      if (this._isBodyOverflowing) {
        // Note: DOMNode.style.paddingRight returns the actual value or '' if not set
        //   while $(DOMNode).css('padding-right') returns the calculated value or 0 if not set
        var fixedContent = [].slice.call(document.querySelectorAll(Selector$5.FIXED_CONTENT));
        var stickyContent = [].slice.call(document.querySelectorAll(Selector$5.STICKY_CONTENT)); // Adjust fixed content padding

        $(fixedContent).each(function (index, element) {
          var actualPadding = element.style.paddingRight;
          var calculatedPadding = $(element).css('padding-right');
          $(element).data('padding-right', actualPadding).css('padding-right', parseFloat(calculatedPadding) + _this9._scrollbarWidth + "px");
        }); // Adjust sticky content margin

        $(stickyContent).each(function (index, element) {
          var actualMargin = element.style.marginRight;
          var calculatedMargin = $(element).css('margin-right');
          $(element).data('margin-right', actualMargin).css('margin-right', parseFloat(calculatedMargin) - _this9._scrollbarWidth + "px");
        }); // Adjust body padding

        var actualPadding = document.body.style.paddingRight;
        var calculatedPadding = $(document.body).css('padding-right');
        $(document.body).data('padding-right', actualPadding).css('padding-right', parseFloat(calculatedPadding) + this._scrollbarWidth + "px");
      }

      $(document.body).addClass(ClassName$5.OPEN);
    };

    _proto._resetScrollbar = function _resetScrollbar() {
      // Restore fixed content padding
      var fixedContent = [].slice.call(document.querySelectorAll(Selector$5.FIXED_CONTENT));
      $(fixedContent).each(function (index, element) {
        var padding = $(element).data('padding-right');
        $(element).removeData('padding-right');
        element.style.paddingRight = padding ? padding : '';
      }); // Restore sticky content

      var elements = [].slice.call(document.querySelectorAll("" + Selector$5.STICKY_CONTENT));
      $(elements).each(function (index, element) {
        var margin = $(element).data('margin-right');

        if (typeof margin !== 'undefined') {
          $(element).css('margin-right', margin).removeData('margin-right');
        }
      }); // Restore body padding

      var padding = $(document.body).data('padding-right');
      $(document.body).removeData('padding-right');
      document.body.style.paddingRight = padding ? padding : '';
    };

    _proto._getScrollbarWidth = function _getScrollbarWidth() {
      // thx d.walsh
      var scrollDiv = document.createElement('div');
      scrollDiv.className = ClassName$5.SCROLLBAR_MEASURER;
      document.body.appendChild(scrollDiv);
      var scrollbarWidth = scrollDiv.getBoundingClientRect().width - scrollDiv.clientWidth;
      document.body.removeChild(scrollDiv);
      return scrollbarWidth;
    }; // Static


    Modal._jQueryInterface = function _jQueryInterface(config, relatedTarget) {
      return this.each(function () {
        var data = $(this).data(DATA_KEY$5);

        var _config = _objectSpread({}, Default$3, $(this).data(), typeof config === 'object' && config ? config : {});

        if (!data) {
          data = new Modal(this, _config);
          $(this).data(DATA_KEY$5, data);
        }

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError("No method named \"" + config + "\"");
          }

          data[config](relatedTarget);
        } else if (_config.show) {
          data.show(relatedTarget);
        }
      });
    };

    _createClass(Modal, null, [{
      key: "VERSION",
      get: function get() {
        return VERSION$5;
      }
    }, {
      key: "Default",
      get: function get() {
        return Default$3;
      }
    }]);

    return Modal;
  }();
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  $(document).on(Event$5.CLICK_DATA_API, Selector$5.DATA_TOGGLE, function (event) {
    var _this10 = this;

    var target;
    var selector = Util.getSelectorFromElement(this);

    if (selector) {
      target = document.querySelector(selector);
    }

    var config = $(target).data(DATA_KEY$5) ? 'toggle' : _objectSpread({}, $(target).data(), $(this).data());

    if (this.tagName === 'A' || this.tagName === 'AREA') {
      event.preventDefault();
    }

    var $target = $(target).one(Event$5.SHOW, function (showEvent) {
      if (showEvent.isDefaultPrevented()) {
        // Only register focus restorer if modal will actually get shown
        return;
      }

      $target.one(Event$5.HIDDEN, function () {
        if ($(_this10).is(':visible')) {
          _this10.focus();
        }
      });
    });

    Modal._jQueryInterface.call($(target), config, this);
  });
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $.fn[NAME$5] = Modal._jQueryInterface;
  $.fn[NAME$5].Constructor = Modal;

  $.fn[NAME$5].noConflict = function () {
    $.fn[NAME$5] = JQUERY_NO_CONFLICT$5;
    return Modal._jQueryInterface;
  };

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  var NAME$6 = 'tooltip';
  var VERSION$6 = '4.2.1';
  var DATA_KEY$6 = 'bs.tooltip';
  var EVENT_KEY$6 = "." + DATA_KEY$6;
  var JQUERY_NO_CONFLICT$6 = $.fn[NAME$6];
  var CLASS_PREFIX = 'bs-tooltip';
  var BSCLS_PREFIX_REGEX = new RegExp("(^|\\s)" + CLASS_PREFIX + "\\S+", 'g');
  var DefaultType$4 = {
    animation: 'boolean',
    template: 'string',
    title: '(string|element|function)',
    trigger: 'string',
    delay: '(number|object)',
    html: 'boolean',
    selector: '(string|boolean)',
    placement: '(string|function)',
    offset: '(number|string)',
    container: '(string|element|boolean)',
    fallbackPlacement: '(string|array)',
    boundary: '(string|element)'
  };
  var AttachmentMap$1 = {
    AUTO: 'auto',
    TOP: 'top',
    RIGHT: 'right',
    BOTTOM: 'bottom',
    LEFT: 'left'
  };
  var Default$4 = {
    animation: true,
    template: '<div class="tooltip" role="tooltip">' + '<div class="arrow"></div>' + '<div class="tooltip-inner"></div></div>',
    trigger: 'hover focus',
    title: '',
    delay: 0,
    html: false,
    selector: false,
    placement: 'top',
    offset: 0,
    container: false,
    fallbackPlacement: 'flip',
    boundary: 'scrollParent'
  };
  var HoverState = {
    SHOW: 'show',
    OUT: 'out'
  };
  var Event$6 = {
    HIDE: "hide" + EVENT_KEY$6,
    HIDDEN: "hidden" + EVENT_KEY$6,
    SHOW: "show" + EVENT_KEY$6,
    SHOWN: "shown" + EVENT_KEY$6,
    INSERTED: "inserted" + EVENT_KEY$6,
    CLICK: "click" + EVENT_KEY$6,
    FOCUSIN: "focusin" + EVENT_KEY$6,
    FOCUSOUT: "focusout" + EVENT_KEY$6,
    MOUSEENTER: "mouseenter" + EVENT_KEY$6,
    MOUSELEAVE: "mouseleave" + EVENT_KEY$6
  };
  var ClassName$6 = {
    FADE: 'fade',
    SHOW: 'show'
  };
  var Selector$6 = {
    TOOLTIP: '.tooltip',
    TOOLTIP_INNER: '.tooltip-inner',
    ARROW: '.arrow'
  };
  var Trigger = {
    HOVER: 'hover',
    FOCUS: 'focus',
    CLICK: 'click',
    MANUAL: 'manual'
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

  };

  var Tooltip =
  /*#__PURE__*/
  function () {
    function Tooltip(element, config) {
      /**
       * Check for Popper dependency
       * Popper - https://popper.js.org
       */
      if (typeof Popper === 'undefined') {
        throw new TypeError('Bootstrap\'s tooltips require Popper.js (https://popper.js.org/)');
      } // private


      this._isEnabled = true;
      this._timeout = 0;
      this._hoverState = '';
      this._activeTrigger = {};
      this._popper = null; // Protected

      this.element = element;
      this.config = this._getConfig(config);
      this.tip = null;

      this._setListeners();
    } // Getters


    var _proto = Tooltip.prototype;

    // Public
    _proto.enable = function enable() {
      this._isEnabled = true;
    };

    _proto.disable = function disable() {
      this._isEnabled = false;
    };

    _proto.toggleEnabled = function toggleEnabled() {
      this._isEnabled = !this._isEnabled;
    };

    _proto.toggle = function toggle(event) {
      if (!this._isEnabled) {
        return;
      }

      if (event) {
        var dataKey = this.constructor.DATA_KEY;
        var context = $(event.currentTarget).data(dataKey);

        if (!context) {
          context = new this.constructor(event.currentTarget, this._getDelegateConfig());
          $(event.currentTarget).data(dataKey, context);
        }

        context._activeTrigger.click = !context._activeTrigger.click;

        if (context._isWithActiveTrigger()) {
          context._enter(null, context);
        } else {
          context._leave(null, context);
        }
      } else {
        if ($(this.getTipElement()).hasClass(ClassName$6.SHOW)) {
          this._leave(null, this);

          return;
        }

        this._enter(null, this);
      }
    };

    _proto.dispose = function dispose() {
      clearTimeout(this._timeout);
      $.removeData(this.element, this.constructor.DATA_KEY);
      $(this.element).off(this.constructor.EVENT_KEY);
      $(this.element).closest('.modal').off('hide.bs.modal');

      if (this.tip) {
        $(this.tip).remove();
      }

      this._isEnabled = null;
      this._timeout = null;
      this._hoverState = null;
      this._activeTrigger = null;

      if (this._popper !== null) {
        this._popper.destroy();
      }

      this._popper = null;
      this.element = null;
      this.config = null;
      this.tip = null;
    };

    _proto.show = function show() {
      var _this = this;

      if ($(this.element).css('display') === 'none') {
        throw new Error('Please use show on visible elements');
      }

      var showEvent = $.Event(this.constructor.Event.SHOW);

      if (this.isWithContent() && this._isEnabled) {
        $(this.element).trigger(showEvent);
        var shadowRoot = Util.findShadowRoot(this.element);
        var isInTheDom = $.contains(shadowRoot !== null ? shadowRoot : this.element.ownerDocument.documentElement, this.element);

        if (showEvent.isDefaultPrevented() || !isInTheDom) {
          return;
        }

        var tip = this.getTipElement();
        var tipId = Util.getUID(this.constructor.NAME);
        tip.setAttribute('id', tipId);
        this.element.setAttribute('aria-describedby', tipId);
        this.setContent();

        if (this.config.animation) {
          $(tip).addClass(ClassName$6.FADE);
        }

        var placement = typeof this.config.placement === 'function' ? this.config.placement.call(this, tip, this.element) : this.config.placement;

        var attachment = this._getAttachment(placement);

        this.addAttachmentClass(attachment);

        var container = this._getContainer();

        $(tip).data(this.constructor.DATA_KEY, this);

        if (!$.contains(this.element.ownerDocument.documentElement, this.tip)) {
          $(tip).appendTo(container);
        }

        $(this.element).trigger(this.constructor.Event.INSERTED);
        this._popper = new Popper(this.element, tip, {
          placement: attachment,
          modifiers: {
            offset: {
              offset: this.config.offset
            },
            flip: {
              behavior: this.config.fallbackPlacement
            },
            arrow: {
              element: Selector$6.ARROW
            },
            preventOverflow: {
              boundariesElement: this.config.boundary
            }
          },
          onCreate: function onCreate(data) {
            if (data.originalPlacement !== data.placement) {
              _this._handlePopperPlacementChange(data);
            }
          },
          onUpdate: function onUpdate(data) {
            return _this._handlePopperPlacementChange(data);
          }
        });
        $(tip).addClass(ClassName$6.SHOW); // If this is a touch-enabled device we add extra
        // empty mouseover listeners to the body's immediate children;
        // only needed because of broken event delegation on iOS
        // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html

        if ('ontouchstart' in document.documentElement) {
          $(document.body).children().on('mouseover', null, $.noop);
        }

        var complete = function complete() {
          if (_this.config.animation) {
            _this._fixTransition();
          }

          var prevHoverState = _this._hoverState;
          _this._hoverState = null;
          $(_this.element).trigger(_this.constructor.Event.SHOWN);

          if (prevHoverState === HoverState.OUT) {
            _this._leave(null, _this);
          }
        };

        if ($(this.tip).hasClass(ClassName$6.FADE)) {
          var transitionDuration = Util.getTransitionDurationFromElement(this.tip);
          $(this.tip).one(Util.TRANSITION_END, complete).emulateTransitionEnd(transitionDuration);
        } else {
          complete();
        }
      }
    };

    _proto.hide = function hide(callback) {
      var _this2 = this;

      var tip = this.getTipElement();
      var hideEvent = $.Event(this.constructor.Event.HIDE);

      var complete = function complete() {
        if (_this2._hoverState !== HoverState.SHOW && tip.parentNode) {
          tip.parentNode.removeChild(tip);
        }

        _this2._cleanTipClass();

        _this2.element.removeAttribute('aria-describedby');

        $(_this2.element).trigger(_this2.constructor.Event.HIDDEN);

        if (_this2._popper !== null) {
          _this2._popper.destroy();
        }

        if (callback) {
          callback();
        }
      };

      $(this.element).trigger(hideEvent);

      if (hideEvent.isDefaultPrevented()) {
        return;
      }

      $(tip).removeClass(ClassName$6.SHOW); // If this is a touch-enabled device we remove the extra
      // empty mouseover listeners we added for iOS support

      if ('ontouchstart' in document.documentElement) {
        $(document.body).children().off('mouseover', null, $.noop);
      }

      this._activeTrigger[Trigger.CLICK] = false;
      this._activeTrigger[Trigger.FOCUS] = false;
      this._activeTrigger[Trigger.HOVER] = false;

      if ($(this.tip).hasClass(ClassName$6.FADE)) {
        var transitionDuration = Util.getTransitionDurationFromElement(tip);
        $(tip).one(Util.TRANSITION_END, complete).emulateTransitionEnd(transitionDuration);
      } else {
        complete();
      }

      this._hoverState = '';
    };

    _proto.update = function update() {
      if (this._popper !== null) {
        this._popper.scheduleUpdate();
      }
    }; // Protected


    _proto.isWithContent = function isWithContent() {
      return Boolean(this.getTitle());
    };

    _proto.addAttachmentClass = function addAttachmentClass(attachment) {
      $(this.getTipElement()).addClass(CLASS_PREFIX + "-" + attachment);
    };

    _proto.getTipElement = function getTipElement() {
      this.tip = this.tip || $(this.config.template)[0];
      return this.tip;
    };

    _proto.setContent = function setContent() {
      var tip = this.getTipElement();
      this.setElementContent($(tip.querySelectorAll(Selector$6.TOOLTIP_INNER)), this.getTitle());
      $(tip).removeClass(ClassName$6.FADE + " " + ClassName$6.SHOW);
    };

    _proto.setElementContent = function setElementContent($element, content) {
      var html = this.config.html;

      if (typeof content === 'object' && (content.nodeType || content.jquery)) {
        // Content is a DOM node or a jQuery
        if (html) {
          if (!$(content).parent().is($element)) {
            $element.empty().append(content);
          }
        } else {
          $element.text($(content).text());
        }
      } else {
        $element[html ? 'html' : 'text'](content);
      }
    };

    _proto.getTitle = function getTitle() {
      var title = this.element.getAttribute('data-original-title');

      if (!title) {
        title = typeof this.config.title === 'function' ? this.config.title.call(this.element) : this.config.title;
      }

      return title;
    }; // Private


    _proto._getContainer = function _getContainer() {
      if (this.config.container === false) {
        return document.body;
      }

      if (Util.isElement(this.config.container)) {
        return $(this.config.container);
      }

      return $(document).find(this.config.container);
    };

    _proto._getAttachment = function _getAttachment(placement) {
      return AttachmentMap$1[placement.toUpperCase()];
    };

    _proto._setListeners = function _setListeners() {
      var _this3 = this;

      var triggers = this.config.trigger.split(' ');
      triggers.forEach(function (trigger) {
        if (trigger === 'click') {
          $(_this3.element).on(_this3.constructor.Event.CLICK, _this3.config.selector, function (event) {
            return _this3.toggle(event);
          });
        } else if (trigger !== Trigger.MANUAL) {
          var eventIn = trigger === Trigger.HOVER ? _this3.constructor.Event.MOUSEENTER : _this3.constructor.Event.FOCUSIN;
          var eventOut = trigger === Trigger.HOVER ? _this3.constructor.Event.MOUSELEAVE : _this3.constructor.Event.FOCUSOUT;
          $(_this3.element).on(eventIn, _this3.config.selector, function (event) {
            return _this3._enter(event);
          }).on(eventOut, _this3.config.selector, function (event) {
            return _this3._leave(event);
          });
        }
      });
      $(this.element).closest('.modal').on('hide.bs.modal', function () {
        if (_this3.element) {
          _this3.hide();
        }
      });

      if (this.config.selector) {
        this.config = _objectSpread({}, this.config, {
          trigger: 'manual',
          selector: ''
        });
      } else {
        this._fixTitle();
      }
    };

    _proto._fixTitle = function _fixTitle() {
      var titleType = typeof this.element.getAttribute('data-original-title');

      if (this.element.getAttribute('title') || titleType !== 'string') {
        this.element.setAttribute('data-original-title', this.element.getAttribute('title') || '');
        this.element.setAttribute('title', '');
      }
    };

    _proto._enter = function _enter(event, context) {
      var dataKey = this.constructor.DATA_KEY;
      context = context || $(event.currentTarget).data(dataKey);

      if (!context) {
        context = new this.constructor(event.currentTarget, this._getDelegateConfig());
        $(event.currentTarget).data(dataKey, context);
      }

      if (event) {
        context._activeTrigger[event.type === 'focusin' ? Trigger.FOCUS : Trigger.HOVER] = true;
      }

      if ($(context.getTipElement()).hasClass(ClassName$6.SHOW) || context._hoverState === HoverState.SHOW) {
        context._hoverState = HoverState.SHOW;
        return;
      }

      clearTimeout(context._timeout);
      context._hoverState = HoverState.SHOW;

      if (!context.config.delay || !context.config.delay.show) {
        context.show();
        return;
      }

      context._timeout = setTimeout(function () {
        if (context._hoverState === HoverState.SHOW) {
          context.show();
        }
      }, context.config.delay.show);
    };

    _proto._leave = function _leave(event, context) {
      var dataKey = this.constructor.DATA_KEY;
      context = context || $(event.currentTarget).data(dataKey);

      if (!context) {
        context = new this.constructor(event.currentTarget, this._getDelegateConfig());
        $(event.currentTarget).data(dataKey, context);
      }

      if (event) {
        context._activeTrigger[event.type === 'focusout' ? Trigger.FOCUS : Trigger.HOVER] = false;
      }

      if (context._isWithActiveTrigger()) {
        return;
      }

      clearTimeout(context._timeout);
      context._hoverState = HoverState.OUT;

      if (!context.config.delay || !context.config.delay.hide) {
        context.hide();
        return;
      }

      context._timeout = setTimeout(function () {
        if (context._hoverState === HoverState.OUT) {
          context.hide();
        }
      }, context.config.delay.hide);
    };

    _proto._isWithActiveTrigger = function _isWithActiveTrigger() {
      for (var trigger in this._activeTrigger) {
        if (this._activeTrigger[trigger]) {
          return true;
        }
      }

      return false;
    };

    _proto._getConfig = function _getConfig(config) {
      config = _objectSpread({}, this.constructor.Default, $(this.element).data(), typeof config === 'object' && config ? config : {});

      if (typeof config.delay === 'number') {
        config.delay = {
          show: config.delay,
          hide: config.delay
        };
      }

      if (typeof config.title === 'number') {
        config.title = config.title.toString();
      }

      if (typeof config.content === 'number') {
        config.content = config.content.toString();
      }

      Util.typeCheckConfig(NAME$6, config, this.constructor.DefaultType);
      return config;
    };

    _proto._getDelegateConfig = function _getDelegateConfig() {
      var config = {};

      if (this.config) {
        for (var key in this.config) {
          if (this.constructor.Default[key] !== this.config[key]) {
            config[key] = this.config[key];
          }
        }
      }

      return config;
    };

    _proto._cleanTipClass = function _cleanTipClass() {
      var $tip = $(this.getTipElement());
      var tabClass = $tip.attr('class').match(BSCLS_PREFIX_REGEX);

      if (tabClass !== null && tabClass.length) {
        $tip.removeClass(tabClass.join(''));
      }
    };

    _proto._handlePopperPlacementChange = function _handlePopperPlacementChange(popperData) {
      var popperInstance = popperData.instance;
      this.tip = popperInstance.popper;

      this._cleanTipClass();

      this.addAttachmentClass(this._getAttachment(popperData.placement));
    };

    _proto._fixTransition = function _fixTransition() {
      var tip = this.getTipElement();
      var initConfigAnimation = this.config.animation;

      if (tip.getAttribute('x-placement') !== null) {
        return;
      }

      $(tip).removeClass(ClassName$6.FADE);
      this.config.animation = false;
      this.hide();
      this.show();
      this.config.animation = initConfigAnimation;
    }; // Static


    Tooltip._jQueryInterface = function _jQueryInterface(config) {
      return this.each(function () {
        var data = $(this).data(DATA_KEY$6);

        var _config = typeof config === 'object' && config;

        if (!data && /dispose|hide/.test(config)) {
          return;
        }

        if (!data) {
          data = new Tooltip(this, _config);
          $(this).data(DATA_KEY$6, data);
        }

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError("No method named \"" + config + "\"");
          }

          data[config]();
        }
      });
    };

    _createClass(Tooltip, null, [{
      key: "VERSION",
      get: function get() {
        return VERSION$6;
      }
    }, {
      key: "Default",
      get: function get() {
        return Default$4;
      }
    }, {
      key: "NAME",
      get: function get() {
        return NAME$6;
      }
    }, {
      key: "DATA_KEY",
      get: function get() {
        return DATA_KEY$6;
      }
    }, {
      key: "Event",
      get: function get() {
        return Event$6;
      }
    }, {
      key: "EVENT_KEY",
      get: function get() {
        return EVENT_KEY$6;
      }
    }, {
      key: "DefaultType",
      get: function get() {
        return DefaultType$4;
      }
    }]);

    return Tooltip;
  }();
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */


  $.fn[NAME$6] = Tooltip._jQueryInterface;
  $.fn[NAME$6].Constructor = Tooltip;

  $.fn[NAME$6].noConflict = function () {
    $.fn[NAME$6] = JQUERY_NO_CONFLICT$6;
    return Tooltip._jQueryInterface;
  };

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  var NAME$7 = 'popover';
  var VERSION$7 = '4.2.1';
  var DATA_KEY$7 = 'bs.popover';
  var EVENT_KEY$7 = "." + DATA_KEY$7;
  var JQUERY_NO_CONFLICT$7 = $.fn[NAME$7];
  var CLASS_PREFIX$1 = 'bs-popover';
  var BSCLS_PREFIX_REGEX$1 = new RegExp("(^|\\s)" + CLASS_PREFIX$1 + "\\S+", 'g');

  var Default$5 = _objectSpread({}, Tooltip.Default, {
    placement: 'right',
    trigger: 'click',
    content: '',
    template: '<div class="popover" role="tooltip">' + '<div class="arrow"></div>' + '<h3 class="popover-header"></h3>' + '<div class="popover-body"></div></div>'
  });

  var DefaultType$5 = _objectSpread({}, Tooltip.DefaultType, {
    content: '(string|element|function)'
  });

  var ClassName$7 = {
    FADE: 'fade',
    SHOW: 'show'
  };
  var Selector$7 = {
    TITLE: '.popover-header',
    CONTENT: '.popover-body'
  };
  var Event$7 = {
    HIDE: "hide" + EVENT_KEY$7,
    HIDDEN: "hidden" + EVENT_KEY$7,
    SHOW: "show" + EVENT_KEY$7,
    SHOWN: "shown" + EVENT_KEY$7,
    INSERTED: "inserted" + EVENT_KEY$7,
    CLICK: "click" + EVENT_KEY$7,
    FOCUSIN: "focusin" + EVENT_KEY$7,
    FOCUSOUT: "focusout" + EVENT_KEY$7,
    MOUSEENTER: "mouseenter" + EVENT_KEY$7,
    MOUSELEAVE: "mouseleave" + EVENT_KEY$7
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

  };

  var Popover =
  /*#__PURE__*/
  function (_Tooltip) {
    _inheritsLoose(Popover, _Tooltip);

    function Popover() {
      return _Tooltip.apply(this, arguments) || this;
    }

    var _proto = Popover.prototype;

    // Overrides
    _proto.isWithContent = function isWithContent() {
      return this.getTitle() || this._getContent();
    };

    _proto.addAttachmentClass = function addAttachmentClass(attachment) {
      $(this.getTipElement()).addClass(CLASS_PREFIX$1 + "-" + attachment);
    };

    _proto.getTipElement = function getTipElement() {
      this.tip = this.tip || $(this.config.template)[0];
      return this.tip;
    };

    _proto.setContent = function setContent() {
      var $tip = $(this.getTipElement()); // We use append for html objects to maintain js events

      this.setElementContent($tip.find(Selector$7.TITLE), this.getTitle());

      var content = this._getContent();

      if (typeof content === 'function') {
        content = content.call(this.element);
      }

      this.setElementContent($tip.find(Selector$7.CONTENT), content);
      $tip.removeClass(ClassName$7.FADE + " " + ClassName$7.SHOW);
    }; // Private


    _proto._getContent = function _getContent() {
      return this.element.getAttribute('data-content') || this.config.content;
    };

    _proto._cleanTipClass = function _cleanTipClass() {
      var $tip = $(this.getTipElement());
      var tabClass = $tip.attr('class').match(BSCLS_PREFIX_REGEX$1);

      if (tabClass !== null && tabClass.length > 0) {
        $tip.removeClass(tabClass.join(''));
      }
    }; // Static


    Popover._jQueryInterface = function _jQueryInterface(config) {
      return this.each(function () {
        var data = $(this).data(DATA_KEY$7);

        var _config = typeof config === 'object' ? config : null;

        if (!data && /dispose|hide/.test(config)) {
          return;
        }

        if (!data) {
          data = new Popover(this, _config);
          $(this).data(DATA_KEY$7, data);
        }

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError("No method named \"" + config + "\"");
          }

          data[config]();
        }
      });
    };

    _createClass(Popover, null, [{
      key: "VERSION",
      // Getters
      get: function get() {
        return VERSION$7;
      }
    }, {
      key: "Default",
      get: function get() {
        return Default$5;
      }
    }, {
      key: "NAME",
      get: function get() {
        return NAME$7;
      }
    }, {
      key: "DATA_KEY",
      get: function get() {
        return DATA_KEY$7;
      }
    }, {
      key: "Event",
      get: function get() {
        return Event$7;
      }
    }, {
      key: "EVENT_KEY",
      get: function get() {
        return EVENT_KEY$7;
      }
    }, {
      key: "DefaultType",
      get: function get() {
        return DefaultType$5;
      }
    }]);

    return Popover;
  }(Tooltip);
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */


  $.fn[NAME$7] = Popover._jQueryInterface;
  $.fn[NAME$7].Constructor = Popover;

  $.fn[NAME$7].noConflict = function () {
    $.fn[NAME$7] = JQUERY_NO_CONFLICT$7;
    return Popover._jQueryInterface;
  };

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  var NAME$8 = 'scrollspy';
  var VERSION$8 = '4.2.1';
  var DATA_KEY$8 = 'bs.scrollspy';
  var EVENT_KEY$8 = "." + DATA_KEY$8;
  var DATA_API_KEY$6 = '.data-api';
  var JQUERY_NO_CONFLICT$8 = $.fn[NAME$8];
  var Default$6 = {
    offset: 10,
    method: 'auto',
    target: ''
  };
  var DefaultType$6 = {
    offset: 'number',
    method: 'string',
    target: '(string|element)'
  };
  var Event$8 = {
    ACTIVATE: "activate" + EVENT_KEY$8,
    SCROLL: "scroll" + EVENT_KEY$8,
    LOAD_DATA_API: "load" + EVENT_KEY$8 + DATA_API_KEY$6
  };
  var ClassName$8 = {
    DROPDOWN_ITEM: 'dropdown-item',
    DROPDOWN_MENU: 'dropdown-menu',
    ACTIVE: 'active'
  };
  var Selector$8 = {
    DATA_SPY: '[data-spy="scroll"]',
    ACTIVE: '.active',
    NAV_LIST_GROUP: '.nav, .list-group',
    NAV_LINKS: '.nav-link',
    NAV_ITEMS: '.nav-item',
    LIST_ITEMS: '.list-group-item',
    DROPDOWN: '.dropdown',
    DROPDOWN_ITEMS: '.dropdown-item',
    DROPDOWN_TOGGLE: '.dropdown-toggle'
  };
  var OffsetMethod = {
    OFFSET: 'offset',
    POSITION: 'position'
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

  };

  var ScrollSpy =
  /*#__PURE__*/
  function () {
    function ScrollSpy(element, config) {
      var _this = this;

      this._element = element;
      this._scrollElement = element.tagName === 'BODY' ? window : element;
      this._config = this._getConfig(config);
      this._selector = this._config.target + " " + Selector$8.NAV_LINKS + "," + (this._config.target + " " + Selector$8.LIST_ITEMS + ",") + (this._config.target + " " + Selector$8.DROPDOWN_ITEMS);
      this._offsets = [];
      this._targets = [];
      this._activeTarget = null;
      this._scrollHeight = 0;
      $(this._scrollElement).on(Event$8.SCROLL, function (event) {
        return _this._process(event);
      });
      this.refresh();

      this._process();
    } // Getters


    var _proto = ScrollSpy.prototype;

    // Public
    _proto.refresh = function refresh() {
      var _this2 = this;

      var autoMethod = this._scrollElement === this._scrollElement.window ? OffsetMethod.OFFSET : OffsetMethod.POSITION;
      var offsetMethod = this._config.method === 'auto' ? autoMethod : this._config.method;
      var offsetBase = offsetMethod === OffsetMethod.POSITION ? this._getScrollTop() : 0;
      this._offsets = [];
      this._targets = [];
      this._scrollHeight = this._getScrollHeight();
      var targets = [].slice.call(document.querySelectorAll(this._selector));
      targets.map(function (element) {
        var target;
        var targetSelector = Util.getSelectorFromElement(element);

        if (targetSelector) {
          target = document.querySelector(targetSelector);
        }

        if (target) {
          var targetBCR = target.getBoundingClientRect();

          if (targetBCR.width || targetBCR.height) {
            // TODO (fat): remove sketch reliance on jQuery position/offset
            return [$(target)[offsetMethod]().top + offsetBase, targetSelector];
          }
        }

        return null;
      }).filter(function (item) {
        return item;
      }).sort(function (a, b) {
        return a[0] - b[0];
      }).forEach(function (item) {
        _this2._offsets.push(item[0]);

        _this2._targets.push(item[1]);
      });
    };

    _proto.dispose = function dispose() {
      $.removeData(this._element, DATA_KEY$8);
      $(this._scrollElement).off(EVENT_KEY$8);
      this._element = null;
      this._scrollElement = null;
      this._config = null;
      this._selector = null;
      this._offsets = null;
      this._targets = null;
      this._activeTarget = null;
      this._scrollHeight = null;
    }; // Private


    _proto._getConfig = function _getConfig(config) {
      config = _objectSpread({}, Default$6, typeof config === 'object' && config ? config : {});

      if (typeof config.target !== 'string') {
        var id = $(config.target).attr('id');

        if (!id) {
          id = Util.getUID(NAME$8);
          $(config.target).attr('id', id);
        }

        config.target = "#" + id;
      }

      Util.typeCheckConfig(NAME$8, config, DefaultType$6);
      return config;
    };

    _proto._getScrollTop = function _getScrollTop() {
      return this._scrollElement === window ? this._scrollElement.pageYOffset : this._scrollElement.scrollTop;
    };

    _proto._getScrollHeight = function _getScrollHeight() {
      return this._scrollElement.scrollHeight || Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
    };

    _proto._getOffsetHeight = function _getOffsetHeight() {
      return this._scrollElement === window ? window.innerHeight : this._scrollElement.getBoundingClientRect().height;
    };

    _proto._process = function _process() {
      var scrollTop = this._getScrollTop() + this._config.offset;

      var scrollHeight = this._getScrollHeight();

      var maxScroll = this._config.offset + scrollHeight - this._getOffsetHeight();

      if (this._scrollHeight !== scrollHeight) {
        this.refresh();
      }

      if (scrollTop >= maxScroll) {
        var target = this._targets[this._targets.length - 1];

        if (this._activeTarget !== target) {
          this._activate(target);
        }

        return;
      }

      if (this._activeTarget && scrollTop < this._offsets[0] && this._offsets[0] > 0) {
        this._activeTarget = null;

        this._clear();

        return;
      }

      var offsetLength = this._offsets.length;

      for (var i = offsetLength; i--;) {
        var isActiveTarget = this._activeTarget !== this._targets[i] && scrollTop >= this._offsets[i] && (typeof this._offsets[i + 1] === 'undefined' || scrollTop < this._offsets[i + 1]);

        if (isActiveTarget) {
          this._activate(this._targets[i]);
        }
      }
    };

    _proto._activate = function _activate(target) {
      this._activeTarget = target;

      this._clear();

      var queries = this._selector.split(',').map(function (selector) {
        return selector + "[data-target=\"" + target + "\"]," + selector + "[href=\"" + target + "\"]";
      });

      var $link = $([].slice.call(document.querySelectorAll(queries.join(','))));

      if ($link.hasClass(ClassName$8.DROPDOWN_ITEM)) {
        $link.closest(Selector$8.DROPDOWN).find(Selector$8.DROPDOWN_TOGGLE).addClass(ClassName$8.ACTIVE);
        $link.addClass(ClassName$8.ACTIVE);
      } else {
        // Set triggered link as active
        $link.addClass(ClassName$8.ACTIVE); // Set triggered links parents as active
        // With both <ul> and <nav> markup a parent is the previous sibling of any nav ancestor

        $link.parents(Selector$8.NAV_LIST_GROUP).prev(Selector$8.NAV_LINKS + ", " + Selector$8.LIST_ITEMS).addClass(ClassName$8.ACTIVE); // Handle special case when .nav-link is inside .nav-item

        $link.parents(Selector$8.NAV_LIST_GROUP).prev(Selector$8.NAV_ITEMS).children(Selector$8.NAV_LINKS).addClass(ClassName$8.ACTIVE);
      }

      $(this._scrollElement).trigger(Event$8.ACTIVATE, {
        relatedTarget: target
      });
    };

    _proto._clear = function _clear() {
      [].slice.call(document.querySelectorAll(this._selector)).filter(function (node) {
        return node.classList.contains(ClassName$8.ACTIVE);
      }).forEach(function (node) {
        return node.classList.remove(ClassName$8.ACTIVE);
      });
    }; // Static


    ScrollSpy._jQueryInterface = function _jQueryInterface(config) {
      return this.each(function () {
        var data = $(this).data(DATA_KEY$8);

        var _config = typeof config === 'object' && config;

        if (!data) {
          data = new ScrollSpy(this, _config);
          $(this).data(DATA_KEY$8, data);
        }

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError("No method named \"" + config + "\"");
          }

          data[config]();
        }
      });
    };

    _createClass(ScrollSpy, null, [{
      key: "VERSION",
      get: function get() {
        return VERSION$8;
      }
    }, {
      key: "Default",
      get: function get() {
        return Default$6;
      }
    }]);

    return ScrollSpy;
  }();
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  $(window).on(Event$8.LOAD_DATA_API, function () {
    var scrollSpys = [].slice.call(document.querySelectorAll(Selector$8.DATA_SPY));
    var scrollSpysLength = scrollSpys.length;

    for (var i = scrollSpysLength; i--;) {
      var $spy = $(scrollSpys[i]);

      ScrollSpy._jQueryInterface.call($spy, $spy.data());
    }
  });
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $.fn[NAME$8] = ScrollSpy._jQueryInterface;
  $.fn[NAME$8].Constructor = ScrollSpy;

  $.fn[NAME$8].noConflict = function () {
    $.fn[NAME$8] = JQUERY_NO_CONFLICT$8;
    return ScrollSpy._jQueryInterface;
  };

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  var NAME$9 = 'tab';
  var VERSION$9 = '4.2.1';
  var DATA_KEY$9 = 'bs.tab';
  var EVENT_KEY$9 = "." + DATA_KEY$9;
  var DATA_API_KEY$7 = '.data-api';
  var JQUERY_NO_CONFLICT$9 = $.fn[NAME$9];
  var Event$9 = {
    HIDE: "hide" + EVENT_KEY$9,
    HIDDEN: "hidden" + EVENT_KEY$9,
    SHOW: "show" + EVENT_KEY$9,
    SHOWN: "shown" + EVENT_KEY$9,
    CLICK_DATA_API: "click" + EVENT_KEY$9 + DATA_API_KEY$7
  };
  var ClassName$9 = {
    DROPDOWN_MENU: 'dropdown-menu',
    ACTIVE: 'active',
    DISABLED: 'disabled',
    FADE: 'fade',
    SHOW: 'show'
  };
  var Selector$9 = {
    DROPDOWN: '.dropdown',
    NAV_LIST_GROUP: '.nav, .list-group',
    ACTIVE: '.active',
    ACTIVE_UL: '> li > .active',
    DATA_TOGGLE: '[data-toggle="tab"], [data-toggle="pill"], [data-toggle="list"]',
    DROPDOWN_TOGGLE: '.dropdown-toggle',
    DROPDOWN_ACTIVE_CHILD: '> .dropdown-menu .active'
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

  };

  var Tab =
  /*#__PURE__*/
  function () {
    function Tab(element) {
      this._element = element;
    } // Getters


    var _proto = Tab.prototype;

    // Public
    _proto.show = function show() {
      var _this = this;

      if (this._element.parentNode && this._element.parentNode.nodeType === Node.ELEMENT_NODE && $(this._element).hasClass(ClassName$9.ACTIVE) || $(this._element).hasClass(ClassName$9.DISABLED)) {
        return;
      }

      var target;
      var previous;
      var listElement = $(this._element).closest(Selector$9.NAV_LIST_GROUP)[0];
      var selector = Util.getSelectorFromElement(this._element);

      if (listElement) {
        var itemSelector = listElement.nodeName === 'UL' || listElement.nodeName === 'OL' ? Selector$9.ACTIVE_UL : Selector$9.ACTIVE;
        previous = $.makeArray($(listElement).find(itemSelector));
        previous = previous[previous.length - 1];
      }

      var hideEvent = $.Event(Event$9.HIDE, {
        relatedTarget: this._element
      });
      var showEvent = $.Event(Event$9.SHOW, {
        relatedTarget: previous
      });

      if (previous) {
        $(previous).trigger(hideEvent);
      }

      $(this._element).trigger(showEvent);

      if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) {
        return;
      }

      if (selector) {
        target = document.querySelector(selector);
      }

      this._activate(this._element, listElement);

      var complete = function complete() {
        var hiddenEvent = $.Event(Event$9.HIDDEN, {
          relatedTarget: _this._element
        });
        var shownEvent = $.Event(Event$9.SHOWN, {
          relatedTarget: previous
        });
        $(previous).trigger(hiddenEvent);
        $(_this._element).trigger(shownEvent);
      };

      if (target) {
        this._activate(target, target.parentNode, complete);
      } else {
        complete();
      }
    };

    _proto.dispose = function dispose() {
      $.removeData(this._element, DATA_KEY$9);
      this._element = null;
    }; // Private


    _proto._activate = function _activate(element, container, callback) {
      var _this2 = this;

      var activeElements = container && (container.nodeName === 'UL' || container.nodeName === 'OL') ? $(container).find(Selector$9.ACTIVE_UL) : $(container).children(Selector$9.ACTIVE);
      var active = activeElements[0];
      var isTransitioning = callback && active && $(active).hasClass(ClassName$9.FADE);

      var complete = function complete() {
        return _this2._transitionComplete(element, active, callback);
      };

      if (active && isTransitioning) {
        var transitionDuration = Util.getTransitionDurationFromElement(active);
        $(active).removeClass(ClassName$9.SHOW).one(Util.TRANSITION_END, complete).emulateTransitionEnd(transitionDuration);
      } else {
        complete();
      }
    };

    _proto._transitionComplete = function _transitionComplete(element, active, callback) {
      if (active) {
        $(active).removeClass(ClassName$9.ACTIVE);
        var dropdownChild = $(active.parentNode).find(Selector$9.DROPDOWN_ACTIVE_CHILD)[0];

        if (dropdownChild) {
          $(dropdownChild).removeClass(ClassName$9.ACTIVE);
        }

        if (active.getAttribute('role') === 'tab') {
          active.setAttribute('aria-selected', false);
        }
      }

      $(element).addClass(ClassName$9.ACTIVE);

      if (element.getAttribute('role') === 'tab') {
        element.setAttribute('aria-selected', true);
      }

      Util.reflow(element);
      $(element).addClass(ClassName$9.SHOW);

      if (element.parentNode && $(element.parentNode).hasClass(ClassName$9.DROPDOWN_MENU)) {
        var dropdownElement = $(element).closest(Selector$9.DROPDOWN)[0];

        if (dropdownElement) {
          var dropdownToggleList = [].slice.call(dropdownElement.querySelectorAll(Selector$9.DROPDOWN_TOGGLE));
          $(dropdownToggleList).addClass(ClassName$9.ACTIVE);
        }

        element.setAttribute('aria-expanded', true);
      }

      if (callback) {
        callback();
      }
    }; // Static


    Tab._jQueryInterface = function _jQueryInterface(config) {
      return this.each(function () {
        var $this = $(this);
        var data = $this.data(DATA_KEY$9);

        if (!data) {
          data = new Tab(this);
          $this.data(DATA_KEY$9, data);
        }

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError("No method named \"" + config + "\"");
          }

          data[config]();
        }
      });
    };

    _createClass(Tab, null, [{
      key: "VERSION",
      get: function get() {
        return VERSION$9;
      }
    }]);

    return Tab;
  }();
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  $(document).on(Event$9.CLICK_DATA_API, Selector$9.DATA_TOGGLE, function (event) {
    event.preventDefault();

    Tab._jQueryInterface.call($(this), 'show');
  });
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $.fn[NAME$9] = Tab._jQueryInterface;
  $.fn[NAME$9].Constructor = Tab;

  $.fn[NAME$9].noConflict = function () {
    $.fn[NAME$9] = JQUERY_NO_CONFLICT$9;
    return Tab._jQueryInterface;
  };

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  var NAME$a = 'toast';
  var VERSION$a = '4.2.1';
  var DATA_KEY$a = 'bs.toast';
  var EVENT_KEY$a = "." + DATA_KEY$a;
  var JQUERY_NO_CONFLICT$a = $.fn[NAME$a];
  var Event$a = {
    CLICK_DISMISS: "click.dismiss" + EVENT_KEY$a,
    HIDE: "hide" + EVENT_KEY$a,
    HIDDEN: "hidden" + EVENT_KEY$a,
    SHOW: "show" + EVENT_KEY$a,
    SHOWN: "shown" + EVENT_KEY$a
  };
  var ClassName$a = {
    FADE: 'fade',
    HIDE: 'hide',
    SHOW: 'show',
    SHOWING: 'showing'
  };
  var DefaultType$7 = {
    animation: 'boolean',
    autohide: 'boolean',
    delay: 'number'
  };
  var Default$7 = {
    animation: true,
    autohide: true,
    delay: 500
  };
  var Selector$a = {
    DATA_DISMISS: '[data-dismiss="toast"]'
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

  };

  var Toast =
  /*#__PURE__*/
  function () {
    function Toast(element, config) {
      this._element = element;
      this._config = this._getConfig(config);
      this._timeout = null;

      this._setListeners();
    } // Getters


    var _proto = Toast.prototype;

    // Public
    _proto.show = function show() {
      var _this = this;

      $(this._element).trigger(Event$a.SHOW);

      if (this._config.animation) {
        this._element.classList.add(ClassName$a.FADE);
      }

      var complete = function complete() {
        _this._element.classList.remove(ClassName$a.SHOWING);

        _this._element.classList.add(ClassName$a.SHOW);

        $(_this._element).trigger(Event$a.SHOWN);

        if (_this._config.autohide) {
          _this.hide();
        }
      };

      this._element.classList.remove(ClassName$a.HIDE);

      this._element.classList.add(ClassName$a.SHOWING);

      if (this._config.animation) {
        var transitionDuration = Util.getTransitionDurationFromElement(this._element);
        $(this._element).one(Util.TRANSITION_END, complete).emulateTransitionEnd(transitionDuration);
      } else {
        complete();
      }
    };

    _proto.hide = function hide(withoutTimeout) {
      var _this2 = this;

      if (!this._element.classList.contains(ClassName$a.SHOW)) {
        return;
      }

      $(this._element).trigger(Event$a.HIDE);

      if (withoutTimeout) {
        this._close();
      } else {
        this._timeout = setTimeout(function () {
          _this2._close();
        }, this._config.delay);
      }
    };

    _proto.dispose = function dispose() {
      clearTimeout(this._timeout);
      this._timeout = null;

      if (this._element.classList.contains(ClassName$a.SHOW)) {
        this._element.classList.remove(ClassName$a.SHOW);
      }

      $(this._element).off(Event$a.CLICK_DISMISS);
      $.removeData(this._element, DATA_KEY$a);
      this._element = null;
      this._config = null;
    }; // Private


    _proto._getConfig = function _getConfig(config) {
      config = _objectSpread({}, Default$7, $(this._element).data(), typeof config === 'object' && config ? config : {});
      Util.typeCheckConfig(NAME$a, config, this.constructor.DefaultType);
      return config;
    };

    _proto._setListeners = function _setListeners() {
      var _this3 = this;

      $(this._element).on(Event$a.CLICK_DISMISS, Selector$a.DATA_DISMISS, function () {
        return _this3.hide(true);
      });
    };

    _proto._close = function _close() {
      var _this4 = this;

      var complete = function complete() {
        _this4._element.classList.add(ClassName$a.HIDE);

        $(_this4._element).trigger(Event$a.HIDDEN);
      };

      this._element.classList.remove(ClassName$a.SHOW);

      if (this._config.animation) {
        var transitionDuration = Util.getTransitionDurationFromElement(this._element);
        $(this._element).one(Util.TRANSITION_END, complete).emulateTransitionEnd(transitionDuration);
      } else {
        complete();
      }
    }; // Static


    Toast._jQueryInterface = function _jQueryInterface(config) {
      return this.each(function () {
        var $element = $(this);
        var data = $element.data(DATA_KEY$a);

        var _config = typeof config === 'object' && config;

        if (!data) {
          data = new Toast(this, _config);
          $element.data(DATA_KEY$a, data);
        }

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError("No method named \"" + config + "\"");
          }

          data[config](this);
        }
      });
    };

    _createClass(Toast, null, [{
      key: "VERSION",
      get: function get() {
        return VERSION$a;
      }
    }, {
      key: "DefaultType",
      get: function get() {
        return DefaultType$7;
      }
    }]);

    return Toast;
  }();
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */


  $.fn[NAME$a] = Toast._jQueryInterface;
  $.fn[NAME$a].Constructor = Toast;

  $.fn[NAME$a].noConflict = function () {
    $.fn[NAME$a] = JQUERY_NO_CONFLICT$a;
    return Toast._jQueryInterface;
  };

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v4.2.1): index.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
   * --------------------------------------------------------------------------
   */

  (function () {
    if (typeof $ === 'undefined') {
      throw new TypeError('Bootstrap\'s JavaScript requires jQuery. jQuery must be included before Bootstrap\'s JavaScript.');
    }

    var version = $.fn.jquery.split(' ')[0].split('.');
    var minMajor = 1;
    var ltMajor = 2;
    var minMinor = 9;
    var minPatch = 1;
    var maxMajor = 4;

    if (version[0] < ltMajor && version[1] < minMinor || version[0] === minMajor && version[1] === minMinor && version[2] < minPatch || version[0] >= maxMajor) {
      throw new Error('Bootstrap\'s JavaScript requires at least jQuery v1.9.1 but less than v4.0.0');
    }
  })();

  exports.Util = Util;
  exports.Alert = Alert;
  exports.Button = Button;
  exports.Carousel = Carousel;
  exports.Collapse = Collapse;
  exports.Dropdown = Dropdown;
  exports.Modal = Modal;
  exports.Popover = Popover;
  exports.Scrollspy = ScrollSpy;
  exports.Tab = Tab;
  exports.Toast = Toast;
  exports.Tooltip = Tooltip;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=bootstrap.js.map


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYm9vdHN0cmFwL2Rpc3QvanMvYm9vdHN0cmFwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUUsS0FBNEQsb0JBQW9CLG1CQUFPLENBQUMsdUJBQVcsR0FBRyxtQkFBTyxDQUFDLG9CQUFRO0FBQ3hILEVBQUUsU0FDOEQ7QUFDaEUsQ0FBQyxxQ0FBcUM7O0FBRXRDO0FBQ0E7O0FBRUE7QUFDQSxtQkFBbUIsa0JBQWtCO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLG1CQUFtQixzQkFBc0I7QUFDekM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7O0FBRUE7QUFDQTtBQUNBLE9BQU87QUFDUDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EscUNBQXFDOztBQUVyQztBQUNBLGFBQWE7QUFDYjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnRUFBZ0U7QUFDaEU7O0FBRUEseUJBQXlCO0FBQ3pCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhDQUE4QztBQUM5QyxPQUFPOztBQUVQO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsT0FBTzs7O0FBR1A7QUFDQTtBQUNBO0FBQ0EsNkRBQTZEOztBQUU3RDtBQUNBO0FBQ0EsT0FBTzs7O0FBR1A7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxPQUFPOzs7QUFHUDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsT0FBTzs7O0FBR1A7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7O0FBR0w7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxNQUFNOzs7QUFHTjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQOztBQUVBO0FBQ0E7QUFDQSxNQUFNOzs7QUFHTjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOzs7QUFHTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQU07OztBQUdOO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhCQUE4Qjs7QUFFOUIsK0JBQStCOztBQUUvQixtQ0FBbUM7O0FBRW5DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxLQUFLOzs7QUFHTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNOzs7QUFHTjtBQUNBLCtCQUErQjtBQUMvQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsbURBQW1EOztBQUVuRDtBQUNBO0FBQ0EsT0FBTzs7O0FBR1A7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0EsU0FBUztBQUNUOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE9BQU87O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87O0FBRVA7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYLFNBQVM7QUFDVCxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxNQUFNOzs7QUFHTjtBQUNBO0FBQ0E7O0FBRUEsc0NBQXNDOztBQUV0QztBQUNBLG9DQUFvQztBQUNwQzs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBLG1DQUFtQzs7QUFFbkM7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTs7QUFFQSwyQ0FBMkMsU0FBUztBQUNwRDs7QUFFQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsOENBQThDLFNBQVM7QUFDdkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOzs7QUFHTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsdUJBQXVCLHdCQUF3QjtBQUMvQztBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNOzs7QUFHTjtBQUNBLCtCQUErQjtBQUMvQiw2Q0FBNkM7O0FBRTdDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0EscUNBQXFDOztBQUVyQztBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBTTs7O0FBR047QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsc0NBQXNDLDZFQUE2RTs7QUFFbkg7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEtBQUs7QUFDTCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCOztBQUUxQix5QkFBeUI7O0FBRXpCLHNCQUFzQjs7QUFFdEIsNEJBQTRCOztBQUU1Qiw4QkFBOEI7O0FBRTlCLG1DQUFtQzs7QUFFbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxLQUFLOzs7QUFHTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxPQUFPOzs7QUFHUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Qsb0RBQW9EOztBQUVwRDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTs7O0FBR0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQU07OztBQUdOO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsT0FBTztBQUNQOztBQUVBO0FBQ0EsK0JBQStCO0FBQy9CO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsMkNBQTJDOztBQUUzQztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBLE9BQU87QUFDUDtBQUNBLE9BQU87QUFDUDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLHlDQUF5Qyx5REFBeUQ7QUFDbEc7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxNQUFNOzs7QUFHTjtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE9BQU87QUFDUDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSwyQ0FBMkMsU0FBUztBQUNwRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsU0FBUztBQUNUOzs7QUFHQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsTUFBTTs7O0FBR047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsR0FBRztBQUNIO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0Qjs7QUFFNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOzs7QUFHTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE9BQU87QUFDUDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULE9BQU87O0FBRVA7QUFDQTtBQUNBLE9BQU87QUFDUDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsT0FBTztBQUNQO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE1BQU07OztBQUdOO0FBQ0EsK0JBQStCO0FBQy9CO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE9BQU87O0FBRVA7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFNBQVM7QUFDVCxPQUFPO0FBQ1A7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULE9BQU87QUFDUDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0EsT0FBTztBQUNQOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE9BQU87QUFDUDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0dBQWdHOztBQUVoRztBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVMsRUFBRTs7QUFFWDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVMsRUFBRTs7QUFFWDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTyxFQUFFOztBQUVUO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxPQUFPLEVBQUU7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07OztBQUdOO0FBQ0E7QUFDQTs7QUFFQSxzQ0FBc0MsK0VBQStFOztBQUVySDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsT0FBTztBQUNQOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEseUVBQXlFOztBQUV6RTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxLQUFLOztBQUVMO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPOzs7QUFHUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQjs7QUFFMUI7QUFDQTtBQUNBOztBQUVBO0FBQ0EsS0FBSzs7O0FBR0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsMENBQTBDO0FBQzFDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSwyQ0FBMkM7QUFDM0M7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTs7O0FBR047QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsTUFBTTs7O0FBR047QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWCxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQSxXQUFXO0FBQ1g7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPOztBQUVQO0FBQ0Esc0NBQXNDO0FBQ3RDO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsT0FBTztBQUNQO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSwrQkFBK0Isc0dBQXNHOztBQUVySTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNOzs7QUFHTjtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGtDQUFrQztBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUgsc0NBQXNDO0FBQ3RDO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHlDQUF5Qzs7QUFFekM7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxNQUFNOzs7QUFHTjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQU07OztBQUdOO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE9BQU87QUFDUDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDs7QUFFQTtBQUNBLEtBQUs7OztBQUdMOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsT0FBTztBQUNQO0FBQ0EsT0FBTztBQUNQO0FBQ0EsT0FBTztBQUNQOztBQUVBO0FBQ0EsT0FBTztBQUNQOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNOzs7QUFHTjtBQUNBLCtCQUErQiwrREFBK0Q7O0FBRTlGO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUEsZ0NBQWdDLEtBQUs7QUFDckM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxPQUFPOztBQUVQOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBLDJDQUEyQztBQUMzQzs7QUFFQSx3SUFBd0k7O0FBRXhJO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE9BQU87QUFDUDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQSxPQUFPO0FBQ1AsTUFBTTs7O0FBR047QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBOztBQUVBLGtDQUFrQyxLQUFLO0FBQ3ZDOztBQUVBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOzs7QUFHTDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsT0FBTzs7QUFFUDtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBTTs7O0FBR047QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxNQUFNOzs7QUFHTjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsT0FBTztBQUNQOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEtBQUs7OztBQUdMOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNOzs7QUFHTjtBQUNBLCtCQUErQix3RkFBd0Y7QUFDdkg7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE9BQU87QUFDUDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLE1BQU07OztBQUdOO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGdEQUFnRCxjQUFjOztBQUU5RCxDQUFDO0FBQ0QiLCJmaWxlIjoiYnVpbGQvdmVuZG9yL3ZlbmRvci5ib290c3RyYXAuOTZhOTkyMTFjOWRjYjYyMTNjN2MuY2h1bmsuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcclxuICAqIEJvb3RzdHJhcCB2NC4yLjEgKGh0dHBzOi8vZ2V0Ym9vdHN0cmFwLmNvbS8pXHJcbiAgKiBDb3B5cmlnaHQgMjAxMS0yMDE4IFRoZSBCb290c3RyYXAgQXV0aG9ycyAoaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2dyYXBocy9jb250cmlidXRvcnMpXHJcbiAgKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9ibG9iL21hc3Rlci9MSUNFTlNFKVxyXG4gICovXHJcbihmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XHJcbiAgdHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnID8gZmFjdG9yeShleHBvcnRzLCByZXF1aXJlKCdwb3BwZXIuanMnKSwgcmVxdWlyZSgnanF1ZXJ5JykpIDpcclxuICB0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgPyBkZWZpbmUoWydleHBvcnRzJywgJ3BvcHBlci5qcycsICdqcXVlcnknXSwgZmFjdG9yeSkgOlxyXG4gIChmYWN0b3J5KChnbG9iYWwuYm9vdHN0cmFwID0ge30pLGdsb2JhbC5Qb3BwZXIsZ2xvYmFsLmpRdWVyeSkpO1xyXG59KHRoaXMsIChmdW5jdGlvbiAoZXhwb3J0cyxQb3BwZXIsJCkgeyAndXNlIHN0cmljdCc7XHJcblxyXG4gIFBvcHBlciA9IFBvcHBlciAmJiBQb3BwZXIuaGFzT3duUHJvcGVydHkoJ2RlZmF1bHQnKSA/IFBvcHBlclsnZGVmYXVsdCddIDogUG9wcGVyO1xyXG4gICQgPSAkICYmICQuaGFzT3duUHJvcGVydHkoJ2RlZmF1bHQnKSA/ICRbJ2RlZmF1bHQnXSA6ICQ7XHJcblxyXG4gIGZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTtcclxuICAgICAgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlO1xyXG4gICAgICBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7XHJcbiAgICAgIGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7XHJcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9jcmVhdGVDbGFzcyhDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHtcclxuICAgIGlmIChwcm90b1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpO1xyXG4gICAgaWYgKHN0YXRpY1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpO1xyXG4gICAgcmV0dXJuIENvbnN0cnVjdG9yO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX2RlZmluZVByb3BlcnR5KG9iaiwga2V5LCB2YWx1ZSkge1xyXG4gICAgaWYgKGtleSBpbiBvYmopIHtcclxuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB7XHJcbiAgICAgICAgdmFsdWU6IHZhbHVlLFxyXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxyXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlXHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgb2JqW2tleV0gPSB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gb2JqO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX29iamVjdFNwcmVhZCh0YXJnZXQpIHtcclxuICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV0gIT0gbnVsbCA/IGFyZ3VtZW50c1tpXSA6IHt9O1xyXG4gICAgICB2YXIgb3duS2V5cyA9IE9iamVjdC5rZXlzKHNvdXJjZSk7XHJcblxyXG4gICAgICBpZiAodHlwZW9mIE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICBvd25LZXlzID0gb3duS2V5cy5jb25jYXQoT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhzb3VyY2UpLmZpbHRlcihmdW5jdGlvbiAoc3ltKSB7XHJcbiAgICAgICAgICByZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihzb3VyY2UsIHN5bSkuZW51bWVyYWJsZTtcclxuICAgICAgICB9KSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIG93bktleXMuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICAgICAgX2RlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCBzb3VyY2Vba2V5XSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0YXJnZXQ7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfaW5oZXJpdHNMb29zZShzdWJDbGFzcywgc3VwZXJDbGFzcykge1xyXG4gICAgc3ViQ2xhc3MucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckNsYXNzLnByb3RvdHlwZSk7XHJcbiAgICBzdWJDbGFzcy5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBzdWJDbGFzcztcclxuICAgIHN1YkNsYXNzLl9fcHJvdG9fXyA9IHN1cGVyQ2xhc3M7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAqIEJvb3RzdHJhcCAodjQuMi4xKTogdXRpbC5qc1xyXG4gICAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2Jsb2IvbWFzdGVyL0xJQ0VOU0UpXHJcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgKi9cclxuICAvKipcclxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgKiBQcml2YXRlIFRyYW5zaXRpb25FbmQgSGVscGVyc1xyXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAqL1xyXG5cclxuICB2YXIgVFJBTlNJVElPTl9FTkQgPSAndHJhbnNpdGlvbmVuZCc7XHJcbiAgdmFyIE1BWF9VSUQgPSAxMDAwMDAwO1xyXG4gIHZhciBNSUxMSVNFQ09ORFNfTVVMVElQTElFUiA9IDEwMDA7IC8vIFNob3V0b3V0IEFuZ3VzQ3JvbGwgKGh0dHBzOi8vZ29vLmdsL3B4d1FHcClcclxuXHJcbiAgZnVuY3Rpb24gdG9UeXBlKG9iaikge1xyXG4gICAgcmV0dXJuIHt9LnRvU3RyaW5nLmNhbGwob2JqKS5tYXRjaCgvXFxzKFthLXpdKykvaSlbMV0udG9Mb3dlckNhc2UoKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGdldFNwZWNpYWxUcmFuc2l0aW9uRW5kRXZlbnQoKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBiaW5kVHlwZTogVFJBTlNJVElPTl9FTkQsXHJcbiAgICAgIGRlbGVnYXRlVHlwZTogVFJBTlNJVElPTl9FTkQsXHJcbiAgICAgIGhhbmRsZTogZnVuY3Rpb24gaGFuZGxlKGV2ZW50KSB7XHJcbiAgICAgICAgaWYgKCQoZXZlbnQudGFyZ2V0KS5pcyh0aGlzKSkge1xyXG4gICAgICAgICAgcmV0dXJuIGV2ZW50LmhhbmRsZU9iai5oYW5kbGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgcHJlZmVyLXJlc3QtcGFyYW1zXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVuZGVmaW5lZFxyXG4gICAgICB9XHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gdHJhbnNpdGlvbkVuZEVtdWxhdG9yKGR1cmF0aW9uKSB7XHJcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG5cclxuICAgIHZhciBjYWxsZWQgPSBmYWxzZTtcclxuICAgICQodGhpcykub25lKFV0aWwuVFJBTlNJVElPTl9FTkQsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgY2FsbGVkID0gdHJ1ZTtcclxuICAgIH0pO1xyXG4gICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGlmICghY2FsbGVkKSB7XHJcbiAgICAgICAgVXRpbC50cmlnZ2VyVHJhbnNpdGlvbkVuZChfdGhpcyk7XHJcbiAgICAgIH1cclxuICAgIH0sIGR1cmF0aW9uKTtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gc2V0VHJhbnNpdGlvbkVuZFN1cHBvcnQoKSB7XHJcbiAgICAkLmZuLmVtdWxhdGVUcmFuc2l0aW9uRW5kID0gdHJhbnNpdGlvbkVuZEVtdWxhdG9yO1xyXG4gICAgJC5ldmVudC5zcGVjaWFsW1V0aWwuVFJBTlNJVElPTl9FTkRdID0gZ2V0U3BlY2lhbFRyYW5zaXRpb25FbmRFdmVudCgpO1xyXG4gIH1cclxuICAvKipcclxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAqIFB1YmxpYyBVdGlsIEFwaVxyXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICovXHJcblxyXG5cclxuICB2YXIgVXRpbCA9IHtcclxuICAgIFRSQU5TSVRJT05fRU5EOiAnYnNUcmFuc2l0aW9uRW5kJyxcclxuICAgIGdldFVJRDogZnVuY3Rpb24gZ2V0VUlEKHByZWZpeCkge1xyXG4gICAgICBkbyB7XHJcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWJpdHdpc2VcclxuICAgICAgICBwcmVmaXggKz0gfn4oTWF0aC5yYW5kb20oKSAqIE1BWF9VSUQpOyAvLyBcIn5+XCIgYWN0cyBsaWtlIGEgZmFzdGVyIE1hdGguZmxvb3IoKSBoZXJlXHJcbiAgICAgIH0gd2hpbGUgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHByZWZpeCkpO1xyXG5cclxuICAgICAgcmV0dXJuIHByZWZpeDtcclxuICAgIH0sXHJcbiAgICBnZXRTZWxlY3RvckZyb21FbGVtZW50OiBmdW5jdGlvbiBnZXRTZWxlY3RvckZyb21FbGVtZW50KGVsZW1lbnQpIHtcclxuICAgICAgdmFyIHNlbGVjdG9yID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdGFyZ2V0Jyk7XHJcblxyXG4gICAgICBpZiAoIXNlbGVjdG9yIHx8IHNlbGVjdG9yID09PSAnIycpIHtcclxuICAgICAgICB2YXIgaHJlZkF0dHIgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnaHJlZicpO1xyXG4gICAgICAgIHNlbGVjdG9yID0gaHJlZkF0dHIgJiYgaHJlZkF0dHIgIT09ICcjJyA/IGhyZWZBdHRyLnRyaW0oKSA6ICcnO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gc2VsZWN0b3IgJiYgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3RvcikgPyBzZWxlY3RvciA6IG51bGw7XHJcbiAgICB9LFxyXG4gICAgZ2V0VHJhbnNpdGlvbkR1cmF0aW9uRnJvbUVsZW1lbnQ6IGZ1bmN0aW9uIGdldFRyYW5zaXRpb25EdXJhdGlvbkZyb21FbGVtZW50KGVsZW1lbnQpIHtcclxuICAgICAgaWYgKCFlbGVtZW50KSB7XHJcbiAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgIH0gLy8gR2V0IHRyYW5zaXRpb24tZHVyYXRpb24gb2YgdGhlIGVsZW1lbnRcclxuXHJcblxyXG4gICAgICB2YXIgdHJhbnNpdGlvbkR1cmF0aW9uID0gJChlbGVtZW50KS5jc3MoJ3RyYW5zaXRpb24tZHVyYXRpb24nKTtcclxuICAgICAgdmFyIHRyYW5zaXRpb25EZWxheSA9ICQoZWxlbWVudCkuY3NzKCd0cmFuc2l0aW9uLWRlbGF5Jyk7XHJcbiAgICAgIHZhciBmbG9hdFRyYW5zaXRpb25EdXJhdGlvbiA9IHBhcnNlRmxvYXQodHJhbnNpdGlvbkR1cmF0aW9uKTtcclxuICAgICAgdmFyIGZsb2F0VHJhbnNpdGlvbkRlbGF5ID0gcGFyc2VGbG9hdCh0cmFuc2l0aW9uRGVsYXkpOyAvLyBSZXR1cm4gMCBpZiBlbGVtZW50IG9yIHRyYW5zaXRpb24gZHVyYXRpb24gaXMgbm90IGZvdW5kXHJcblxyXG4gICAgICBpZiAoIWZsb2F0VHJhbnNpdGlvbkR1cmF0aW9uICYmICFmbG9hdFRyYW5zaXRpb25EZWxheSkge1xyXG4gICAgICAgIHJldHVybiAwO1xyXG4gICAgICB9IC8vIElmIG11bHRpcGxlIGR1cmF0aW9ucyBhcmUgZGVmaW5lZCwgdGFrZSB0aGUgZmlyc3RcclxuXHJcblxyXG4gICAgICB0cmFuc2l0aW9uRHVyYXRpb24gPSB0cmFuc2l0aW9uRHVyYXRpb24uc3BsaXQoJywnKVswXTtcclxuICAgICAgdHJhbnNpdGlvbkRlbGF5ID0gdHJhbnNpdGlvbkRlbGF5LnNwbGl0KCcsJylbMF07XHJcbiAgICAgIHJldHVybiAocGFyc2VGbG9hdCh0cmFuc2l0aW9uRHVyYXRpb24pICsgcGFyc2VGbG9hdCh0cmFuc2l0aW9uRGVsYXkpKSAqIE1JTExJU0VDT05EU19NVUxUSVBMSUVSO1xyXG4gICAgfSxcclxuICAgIHJlZmxvdzogZnVuY3Rpb24gcmVmbG93KGVsZW1lbnQpIHtcclxuICAgICAgcmV0dXJuIGVsZW1lbnQub2Zmc2V0SGVpZ2h0O1xyXG4gICAgfSxcclxuICAgIHRyaWdnZXJUcmFuc2l0aW9uRW5kOiBmdW5jdGlvbiB0cmlnZ2VyVHJhbnNpdGlvbkVuZChlbGVtZW50KSB7XHJcbiAgICAgICQoZWxlbWVudCkudHJpZ2dlcihUUkFOU0lUSU9OX0VORCk7XHJcbiAgICB9LFxyXG4gICAgLy8gVE9ETzogUmVtb3ZlIGluIHY1XHJcbiAgICBzdXBwb3J0c1RyYW5zaXRpb25FbmQ6IGZ1bmN0aW9uIHN1cHBvcnRzVHJhbnNpdGlvbkVuZCgpIHtcclxuICAgICAgcmV0dXJuIEJvb2xlYW4oVFJBTlNJVElPTl9FTkQpO1xyXG4gICAgfSxcclxuICAgIGlzRWxlbWVudDogZnVuY3Rpb24gaXNFbGVtZW50KG9iaikge1xyXG4gICAgICByZXR1cm4gKG9ialswXSB8fCBvYmopLm5vZGVUeXBlO1xyXG4gICAgfSxcclxuICAgIHR5cGVDaGVja0NvbmZpZzogZnVuY3Rpb24gdHlwZUNoZWNrQ29uZmlnKGNvbXBvbmVudE5hbWUsIGNvbmZpZywgY29uZmlnVHlwZXMpIHtcclxuICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gY29uZmlnVHlwZXMpIHtcclxuICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGNvbmZpZ1R5cGVzLCBwcm9wZXJ0eSkpIHtcclxuICAgICAgICAgIHZhciBleHBlY3RlZFR5cGVzID0gY29uZmlnVHlwZXNbcHJvcGVydHldO1xyXG4gICAgICAgICAgdmFyIHZhbHVlID0gY29uZmlnW3Byb3BlcnR5XTtcclxuICAgICAgICAgIHZhciB2YWx1ZVR5cGUgPSB2YWx1ZSAmJiBVdGlsLmlzRWxlbWVudCh2YWx1ZSkgPyAnZWxlbWVudCcgOiB0b1R5cGUodmFsdWUpO1xyXG5cclxuICAgICAgICAgIGlmICghbmV3IFJlZ0V4cChleHBlY3RlZFR5cGVzKS50ZXN0KHZhbHVlVHlwZSkpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGNvbXBvbmVudE5hbWUudG9VcHBlckNhc2UoKSArIFwiOiBcIiArIChcIk9wdGlvbiBcXFwiXCIgKyBwcm9wZXJ0eSArIFwiXFxcIiBwcm92aWRlZCB0eXBlIFxcXCJcIiArIHZhbHVlVHlwZSArIFwiXFxcIiBcIikgKyAoXCJidXQgZXhwZWN0ZWQgdHlwZSBcXFwiXCIgKyBleHBlY3RlZFR5cGVzICsgXCJcXFwiLlwiKSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgZmluZFNoYWRvd1Jvb3Q6IGZ1bmN0aW9uIGZpbmRTaGFkb3dSb290KGVsZW1lbnQpIHtcclxuICAgICAgaWYgKCFkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuYXR0YWNoU2hhZG93KSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgIH0gLy8gQ2FuIGZpbmQgdGhlIHNoYWRvdyByb290IG90aGVyd2lzZSBpdCdsbCByZXR1cm4gdGhlIGRvY3VtZW50XHJcblxyXG5cclxuICAgICAgaWYgKHR5cGVvZiBlbGVtZW50LmdldFJvb3ROb2RlID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgdmFyIHJvb3QgPSBlbGVtZW50LmdldFJvb3ROb2RlKCk7XHJcbiAgICAgICAgcmV0dXJuIHJvb3QgaW5zdGFuY2VvZiBTaGFkb3dSb290ID8gcm9vdCA6IG51bGw7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChlbGVtZW50IGluc3RhbmNlb2YgU2hhZG93Um9vdCkge1xyXG4gICAgICAgIHJldHVybiBlbGVtZW50O1xyXG4gICAgICB9IC8vIHdoZW4gd2UgZG9uJ3QgZmluZCBhIHNoYWRvdyByb290XHJcblxyXG5cclxuICAgICAgaWYgKCFlbGVtZW50LnBhcmVudE5vZGUpIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIFV0aWwuZmluZFNoYWRvd1Jvb3QoZWxlbWVudC5wYXJlbnROb2RlKTtcclxuICAgIH1cclxuICB9O1xyXG4gIHNldFRyYW5zaXRpb25FbmRTdXBwb3J0KCk7XHJcblxyXG4gIC8qKlxyXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAqIENvbnN0YW50c1xyXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAqL1xyXG5cclxuICB2YXIgTkFNRSA9ICdhbGVydCc7XHJcbiAgdmFyIFZFUlNJT04gPSAnNC4yLjEnO1xyXG4gIHZhciBEQVRBX0tFWSA9ICdicy5hbGVydCc7XHJcbiAgdmFyIEVWRU5UX0tFWSA9IFwiLlwiICsgREFUQV9LRVk7XHJcbiAgdmFyIERBVEFfQVBJX0tFWSA9ICcuZGF0YS1hcGknO1xyXG4gIHZhciBKUVVFUllfTk9fQ09ORkxJQ1QgPSAkLmZuW05BTUVdO1xyXG4gIHZhciBTZWxlY3RvciA9IHtcclxuICAgIERJU01JU1M6ICdbZGF0YS1kaXNtaXNzPVwiYWxlcnRcIl0nXHJcbiAgfTtcclxuICB2YXIgRXZlbnQgPSB7XHJcbiAgICBDTE9TRTogXCJjbG9zZVwiICsgRVZFTlRfS0VZLFxyXG4gICAgQ0xPU0VEOiBcImNsb3NlZFwiICsgRVZFTlRfS0VZLFxyXG4gICAgQ0xJQ0tfREFUQV9BUEk6IFwiY2xpY2tcIiArIEVWRU5UX0tFWSArIERBVEFfQVBJX0tFWVxyXG4gIH07XHJcbiAgdmFyIENsYXNzTmFtZSA9IHtcclxuICAgIEFMRVJUOiAnYWxlcnQnLFxyXG4gICAgRkFERTogJ2ZhZGUnLFxyXG4gICAgU0hPVzogJ3Nob3cnXHJcbiAgICAvKipcclxuICAgICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgICogQ2xhc3MgRGVmaW5pdGlvblxyXG4gICAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAgKi9cclxuXHJcbiAgfTtcclxuXHJcbiAgdmFyIEFsZXJ0ID1cclxuICAvKiNfX1BVUkVfXyovXHJcbiAgZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gQWxlcnQoZWxlbWVudCkge1xyXG4gICAgICB0aGlzLl9lbGVtZW50ID0gZWxlbWVudDtcclxuICAgIH0gLy8gR2V0dGVyc1xyXG5cclxuXHJcbiAgICB2YXIgX3Byb3RvID0gQWxlcnQucHJvdG90eXBlO1xyXG5cclxuICAgIC8vIFB1YmxpY1xyXG4gICAgX3Byb3RvLmNsb3NlID0gZnVuY3Rpb24gY2xvc2UoZWxlbWVudCkge1xyXG4gICAgICB2YXIgcm9vdEVsZW1lbnQgPSB0aGlzLl9lbGVtZW50O1xyXG5cclxuICAgICAgaWYgKGVsZW1lbnQpIHtcclxuICAgICAgICByb290RWxlbWVudCA9IHRoaXMuX2dldFJvb3RFbGVtZW50KGVsZW1lbnQpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB2YXIgY3VzdG9tRXZlbnQgPSB0aGlzLl90cmlnZ2VyQ2xvc2VFdmVudChyb290RWxlbWVudCk7XHJcblxyXG4gICAgICBpZiAoY3VzdG9tRXZlbnQuaXNEZWZhdWx0UHJldmVudGVkKCkpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuX3JlbW92ZUVsZW1lbnQocm9vdEVsZW1lbnQpO1xyXG4gICAgfTtcclxuXHJcbiAgICBfcHJvdG8uZGlzcG9zZSA9IGZ1bmN0aW9uIGRpc3Bvc2UoKSB7XHJcbiAgICAgICQucmVtb3ZlRGF0YSh0aGlzLl9lbGVtZW50LCBEQVRBX0tFWSk7XHJcbiAgICAgIHRoaXMuX2VsZW1lbnQgPSBudWxsO1xyXG4gICAgfTsgLy8gUHJpdmF0ZVxyXG5cclxuXHJcbiAgICBfcHJvdG8uX2dldFJvb3RFbGVtZW50ID0gZnVuY3Rpb24gX2dldFJvb3RFbGVtZW50KGVsZW1lbnQpIHtcclxuICAgICAgdmFyIHNlbGVjdG9yID0gVXRpbC5nZXRTZWxlY3RvckZyb21FbGVtZW50KGVsZW1lbnQpO1xyXG4gICAgICB2YXIgcGFyZW50ID0gZmFsc2U7XHJcblxyXG4gICAgICBpZiAoc2VsZWN0b3IpIHtcclxuICAgICAgICBwYXJlbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKCFwYXJlbnQpIHtcclxuICAgICAgICBwYXJlbnQgPSAkKGVsZW1lbnQpLmNsb3Nlc3QoXCIuXCIgKyBDbGFzc05hbWUuQUxFUlQpWzBdO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gcGFyZW50O1xyXG4gICAgfTtcclxuXHJcbiAgICBfcHJvdG8uX3RyaWdnZXJDbG9zZUV2ZW50ID0gZnVuY3Rpb24gX3RyaWdnZXJDbG9zZUV2ZW50KGVsZW1lbnQpIHtcclxuICAgICAgdmFyIGNsb3NlRXZlbnQgPSAkLkV2ZW50KEV2ZW50LkNMT1NFKTtcclxuICAgICAgJChlbGVtZW50KS50cmlnZ2VyKGNsb3NlRXZlbnQpO1xyXG4gICAgICByZXR1cm4gY2xvc2VFdmVudDtcclxuICAgIH07XHJcblxyXG4gICAgX3Byb3RvLl9yZW1vdmVFbGVtZW50ID0gZnVuY3Rpb24gX3JlbW92ZUVsZW1lbnQoZWxlbWVudCkge1xyXG4gICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG5cclxuICAgICAgJChlbGVtZW50KS5yZW1vdmVDbGFzcyhDbGFzc05hbWUuU0hPVyk7XHJcblxyXG4gICAgICBpZiAoISQoZWxlbWVudCkuaGFzQ2xhc3MoQ2xhc3NOYW1lLkZBREUpKSB7XHJcbiAgICAgICAgdGhpcy5fZGVzdHJveUVsZW1lbnQoZWxlbWVudCk7XHJcblxyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgdmFyIHRyYW5zaXRpb25EdXJhdGlvbiA9IFV0aWwuZ2V0VHJhbnNpdGlvbkR1cmF0aW9uRnJvbUVsZW1lbnQoZWxlbWVudCk7XHJcbiAgICAgICQoZWxlbWVudCkub25lKFV0aWwuVFJBTlNJVElPTl9FTkQsIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgIHJldHVybiBfdGhpcy5fZGVzdHJveUVsZW1lbnQoZWxlbWVudCwgZXZlbnQpO1xyXG4gICAgICB9KS5lbXVsYXRlVHJhbnNpdGlvbkVuZCh0cmFuc2l0aW9uRHVyYXRpb24pO1xyXG4gICAgfTtcclxuXHJcbiAgICBfcHJvdG8uX2Rlc3Ryb3lFbGVtZW50ID0gZnVuY3Rpb24gX2Rlc3Ryb3lFbGVtZW50KGVsZW1lbnQpIHtcclxuICAgICAgJChlbGVtZW50KS5kZXRhY2goKS50cmlnZ2VyKEV2ZW50LkNMT1NFRCkucmVtb3ZlKCk7XHJcbiAgICB9OyAvLyBTdGF0aWNcclxuXHJcblxyXG4gICAgQWxlcnQuX2pRdWVyeUludGVyZmFjZSA9IGZ1bmN0aW9uIF9qUXVlcnlJbnRlcmZhY2UoY29uZmlnKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciAkZWxlbWVudCA9ICQodGhpcyk7XHJcbiAgICAgICAgdmFyIGRhdGEgPSAkZWxlbWVudC5kYXRhKERBVEFfS0VZKTtcclxuXHJcbiAgICAgICAgaWYgKCFkYXRhKSB7XHJcbiAgICAgICAgICBkYXRhID0gbmV3IEFsZXJ0KHRoaXMpO1xyXG4gICAgICAgICAgJGVsZW1lbnQuZGF0YShEQVRBX0tFWSwgZGF0YSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoY29uZmlnID09PSAnY2xvc2UnKSB7XHJcbiAgICAgICAgICBkYXRhW2NvbmZpZ10odGhpcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgQWxlcnQuX2hhbmRsZURpc21pc3MgPSBmdW5jdGlvbiBfaGFuZGxlRGlzbWlzcyhhbGVydEluc3RhbmNlKSB7XHJcbiAgICAgIHJldHVybiBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICBpZiAoZXZlbnQpIHtcclxuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBhbGVydEluc3RhbmNlLmNsb3NlKHRoaXMpO1xyXG4gICAgICB9O1xyXG4gICAgfTtcclxuXHJcbiAgICBfY3JlYXRlQ2xhc3MoQWxlcnQsIG51bGwsIFt7XHJcbiAgICAgIGtleTogXCJWRVJTSU9OXCIsXHJcbiAgICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xyXG4gICAgICAgIHJldHVybiBWRVJTSU9OO1xyXG4gICAgICB9XHJcbiAgICB9XSk7XHJcblxyXG4gICAgcmV0dXJuIEFsZXJ0O1xyXG4gIH0oKTtcclxuICAvKipcclxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgKiBEYXRhIEFwaSBpbXBsZW1lbnRhdGlvblxyXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAqL1xyXG5cclxuXHJcbiAgJChkb2N1bWVudCkub24oRXZlbnQuQ0xJQ0tfREFUQV9BUEksIFNlbGVjdG9yLkRJU01JU1MsIEFsZXJ0Ll9oYW5kbGVEaXNtaXNzKG5ldyBBbGVydCgpKSk7XHJcbiAgLyoqXHJcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICogalF1ZXJ5XHJcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICovXHJcblxyXG4gICQuZm5bTkFNRV0gPSBBbGVydC5falF1ZXJ5SW50ZXJmYWNlO1xyXG4gICQuZm5bTkFNRV0uQ29uc3RydWN0b3IgPSBBbGVydDtcclxuXHJcbiAgJC5mbltOQU1FXS5ub0NvbmZsaWN0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgJC5mbltOQU1FXSA9IEpRVUVSWV9OT19DT05GTElDVDtcclxuICAgIHJldHVybiBBbGVydC5falF1ZXJ5SW50ZXJmYWNlO1xyXG4gIH07XHJcblxyXG4gIC8qKlxyXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAqIENvbnN0YW50c1xyXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAqL1xyXG5cclxuICB2YXIgTkFNRSQxID0gJ2J1dHRvbic7XHJcbiAgdmFyIFZFUlNJT04kMSA9ICc0LjIuMSc7XHJcbiAgdmFyIERBVEFfS0VZJDEgPSAnYnMuYnV0dG9uJztcclxuICB2YXIgRVZFTlRfS0VZJDEgPSBcIi5cIiArIERBVEFfS0VZJDE7XHJcbiAgdmFyIERBVEFfQVBJX0tFWSQxID0gJy5kYXRhLWFwaSc7XHJcbiAgdmFyIEpRVUVSWV9OT19DT05GTElDVCQxID0gJC5mbltOQU1FJDFdO1xyXG4gIHZhciBDbGFzc05hbWUkMSA9IHtcclxuICAgIEFDVElWRTogJ2FjdGl2ZScsXHJcbiAgICBCVVRUT046ICdidG4nLFxyXG4gICAgRk9DVVM6ICdmb2N1cydcclxuICB9O1xyXG4gIHZhciBTZWxlY3RvciQxID0ge1xyXG4gICAgREFUQV9UT0dHTEVfQ0FSUk9UOiAnW2RhdGEtdG9nZ2xlXj1cImJ1dHRvblwiXScsXHJcbiAgICBEQVRBX1RPR0dMRTogJ1tkYXRhLXRvZ2dsZT1cImJ1dHRvbnNcIl0nLFxyXG4gICAgSU5QVVQ6ICdpbnB1dDpub3QoW3R5cGU9XCJoaWRkZW5cIl0pJyxcclxuICAgIEFDVElWRTogJy5hY3RpdmUnLFxyXG4gICAgQlVUVE9OOiAnLmJ0bidcclxuICB9O1xyXG4gIHZhciBFdmVudCQxID0ge1xyXG4gICAgQ0xJQ0tfREFUQV9BUEk6IFwiY2xpY2tcIiArIEVWRU5UX0tFWSQxICsgREFUQV9BUElfS0VZJDEsXHJcbiAgICBGT0NVU19CTFVSX0RBVEFfQVBJOiBcImZvY3VzXCIgKyBFVkVOVF9LRVkkMSArIERBVEFfQVBJX0tFWSQxICsgXCIgXCIgKyAoXCJibHVyXCIgKyBFVkVOVF9LRVkkMSArIERBVEFfQVBJX0tFWSQxKVxyXG4gICAgLyoqXHJcbiAgICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgICAqIENsYXNzIERlZmluaXRpb25cclxuICAgICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgICovXHJcblxyXG4gIH07XHJcblxyXG4gIHZhciBCdXR0b24gPVxyXG4gIC8qI19fUFVSRV9fKi9cclxuICBmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBCdXR0b24oZWxlbWVudCkge1xyXG4gICAgICB0aGlzLl9lbGVtZW50ID0gZWxlbWVudDtcclxuICAgIH0gLy8gR2V0dGVyc1xyXG5cclxuXHJcbiAgICB2YXIgX3Byb3RvID0gQnV0dG9uLnByb3RvdHlwZTtcclxuXHJcbiAgICAvLyBQdWJsaWNcclxuICAgIF9wcm90by50b2dnbGUgPSBmdW5jdGlvbiB0b2dnbGUoKSB7XHJcbiAgICAgIHZhciB0cmlnZ2VyQ2hhbmdlRXZlbnQgPSB0cnVlO1xyXG4gICAgICB2YXIgYWRkQXJpYVByZXNzZWQgPSB0cnVlO1xyXG4gICAgICB2YXIgcm9vdEVsZW1lbnQgPSAkKHRoaXMuX2VsZW1lbnQpLmNsb3Nlc3QoU2VsZWN0b3IkMS5EQVRBX1RPR0dMRSlbMF07XHJcblxyXG4gICAgICBpZiAocm9vdEVsZW1lbnQpIHtcclxuICAgICAgICB2YXIgaW5wdXQgPSB0aGlzLl9lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoU2VsZWN0b3IkMS5JTlBVVCk7XHJcblxyXG4gICAgICAgIGlmIChpbnB1dCkge1xyXG4gICAgICAgICAgaWYgKGlucHV0LnR5cGUgPT09ICdyYWRpbycpIHtcclxuICAgICAgICAgICAgaWYgKGlucHV0LmNoZWNrZWQgJiYgdGhpcy5fZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoQ2xhc3NOYW1lJDEuQUNUSVZFKSkge1xyXG4gICAgICAgICAgICAgIHRyaWdnZXJDaGFuZ2VFdmVudCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIHZhciBhY3RpdmVFbGVtZW50ID0gcm9vdEVsZW1lbnQucXVlcnlTZWxlY3RvcihTZWxlY3RvciQxLkFDVElWRSk7XHJcblxyXG4gICAgICAgICAgICAgIGlmIChhY3RpdmVFbGVtZW50KSB7XHJcbiAgICAgICAgICAgICAgICAkKGFjdGl2ZUVsZW1lbnQpLnJlbW92ZUNsYXNzKENsYXNzTmFtZSQxLkFDVElWRSk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgaWYgKHRyaWdnZXJDaGFuZ2VFdmVudCkge1xyXG4gICAgICAgICAgICBpZiAoaW5wdXQuaGFzQXR0cmlidXRlKCdkaXNhYmxlZCcpIHx8IHJvb3RFbGVtZW50Lmhhc0F0dHJpYnV0ZSgnZGlzYWJsZWQnKSB8fCBpbnB1dC5jbGFzc0xpc3QuY29udGFpbnMoJ2Rpc2FibGVkJykgfHwgcm9vdEVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdkaXNhYmxlZCcpKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpbnB1dC5jaGVja2VkID0gIXRoaXMuX2VsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKENsYXNzTmFtZSQxLkFDVElWRSk7XHJcbiAgICAgICAgICAgICQoaW5wdXQpLnRyaWdnZXIoJ2NoYW5nZScpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGlucHV0LmZvY3VzKCk7XHJcbiAgICAgICAgICBhZGRBcmlhUHJlc3NlZCA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGFkZEFyaWFQcmVzc2VkKSB7XHJcbiAgICAgICAgdGhpcy5fZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtcHJlc3NlZCcsICF0aGlzLl9lbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhDbGFzc05hbWUkMS5BQ1RJVkUpKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHRyaWdnZXJDaGFuZ2VFdmVudCkge1xyXG4gICAgICAgICQodGhpcy5fZWxlbWVudCkudG9nZ2xlQ2xhc3MoQ2xhc3NOYW1lJDEuQUNUSVZFKTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBfcHJvdG8uZGlzcG9zZSA9IGZ1bmN0aW9uIGRpc3Bvc2UoKSB7XHJcbiAgICAgICQucmVtb3ZlRGF0YSh0aGlzLl9lbGVtZW50LCBEQVRBX0tFWSQxKTtcclxuICAgICAgdGhpcy5fZWxlbWVudCA9IG51bGw7XHJcbiAgICB9OyAvLyBTdGF0aWNcclxuXHJcblxyXG4gICAgQnV0dG9uLl9qUXVlcnlJbnRlcmZhY2UgPSBmdW5jdGlvbiBfalF1ZXJ5SW50ZXJmYWNlKGNvbmZpZykge1xyXG4gICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgZGF0YSA9ICQodGhpcykuZGF0YShEQVRBX0tFWSQxKTtcclxuXHJcbiAgICAgICAgaWYgKCFkYXRhKSB7XHJcbiAgICAgICAgICBkYXRhID0gbmV3IEJ1dHRvbih0aGlzKTtcclxuICAgICAgICAgICQodGhpcykuZGF0YShEQVRBX0tFWSQxLCBkYXRhKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChjb25maWcgPT09ICd0b2dnbGUnKSB7XHJcbiAgICAgICAgICBkYXRhW2NvbmZpZ10oKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICBfY3JlYXRlQ2xhc3MoQnV0dG9uLCBudWxsLCBbe1xyXG4gICAgICBrZXk6IFwiVkVSU0lPTlwiLFxyXG4gICAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcclxuICAgICAgICByZXR1cm4gVkVSU0lPTiQxO1xyXG4gICAgICB9XHJcbiAgICB9XSk7XHJcblxyXG4gICAgcmV0dXJuIEJ1dHRvbjtcclxuICB9KCk7XHJcbiAgLyoqXHJcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICogRGF0YSBBcGkgaW1wbGVtZW50YXRpb25cclxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgKi9cclxuXHJcblxyXG4gICQoZG9jdW1lbnQpLm9uKEV2ZW50JDEuQ0xJQ0tfREFUQV9BUEksIFNlbGVjdG9yJDEuREFUQV9UT0dHTEVfQ0FSUk9ULCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICB2YXIgYnV0dG9uID0gZXZlbnQudGFyZ2V0O1xyXG5cclxuICAgIGlmICghJChidXR0b24pLmhhc0NsYXNzKENsYXNzTmFtZSQxLkJVVFRPTikpIHtcclxuICAgICAgYnV0dG9uID0gJChidXR0b24pLmNsb3Nlc3QoU2VsZWN0b3IkMS5CVVRUT04pO1xyXG4gICAgfVxyXG5cclxuICAgIEJ1dHRvbi5falF1ZXJ5SW50ZXJmYWNlLmNhbGwoJChidXR0b24pLCAndG9nZ2xlJyk7XHJcbiAgfSkub24oRXZlbnQkMS5GT0NVU19CTFVSX0RBVEFfQVBJLCBTZWxlY3RvciQxLkRBVEFfVE9HR0xFX0NBUlJPVCwgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICB2YXIgYnV0dG9uID0gJChldmVudC50YXJnZXQpLmNsb3Nlc3QoU2VsZWN0b3IkMS5CVVRUT04pWzBdO1xyXG4gICAgJChidXR0b24pLnRvZ2dsZUNsYXNzKENsYXNzTmFtZSQxLkZPQ1VTLCAvXmZvY3VzKGluKT8kLy50ZXN0KGV2ZW50LnR5cGUpKTtcclxuICB9KTtcclxuICAvKipcclxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgKiBqUXVlcnlcclxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgKi9cclxuXHJcbiAgJC5mbltOQU1FJDFdID0gQnV0dG9uLl9qUXVlcnlJbnRlcmZhY2U7XHJcbiAgJC5mbltOQU1FJDFdLkNvbnN0cnVjdG9yID0gQnV0dG9uO1xyXG5cclxuICAkLmZuW05BTUUkMV0ubm9Db25mbGljdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICQuZm5bTkFNRSQxXSA9IEpRVUVSWV9OT19DT05GTElDVCQxO1xyXG4gICAgcmV0dXJuIEJ1dHRvbi5falF1ZXJ5SW50ZXJmYWNlO1xyXG4gIH07XHJcblxyXG4gIC8qKlxyXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAqIENvbnN0YW50c1xyXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAqL1xyXG5cclxuICB2YXIgTkFNRSQyID0gJ2Nhcm91c2VsJztcclxuICB2YXIgVkVSU0lPTiQyID0gJzQuMi4xJztcclxuICB2YXIgREFUQV9LRVkkMiA9ICdicy5jYXJvdXNlbCc7XHJcbiAgdmFyIEVWRU5UX0tFWSQyID0gXCIuXCIgKyBEQVRBX0tFWSQyO1xyXG4gIHZhciBEQVRBX0FQSV9LRVkkMiA9ICcuZGF0YS1hcGknO1xyXG4gIHZhciBKUVVFUllfTk9fQ09ORkxJQ1QkMiA9ICQuZm5bTkFNRSQyXTtcclxuICB2YXIgQVJST1dfTEVGVF9LRVlDT0RFID0gMzc7IC8vIEtleWJvYXJkRXZlbnQud2hpY2ggdmFsdWUgZm9yIGxlZnQgYXJyb3cga2V5XHJcblxyXG4gIHZhciBBUlJPV19SSUdIVF9LRVlDT0RFID0gMzk7IC8vIEtleWJvYXJkRXZlbnQud2hpY2ggdmFsdWUgZm9yIHJpZ2h0IGFycm93IGtleVxyXG5cclxuICB2YXIgVE9VQ0hFVkVOVF9DT01QQVRfV0FJVCA9IDUwMDsgLy8gVGltZSBmb3IgbW91c2UgY29tcGF0IGV2ZW50cyB0byBmaXJlIGFmdGVyIHRvdWNoXHJcblxyXG4gIHZhciBTV0lQRV9USFJFU0hPTEQgPSA0MDtcclxuICB2YXIgRGVmYXVsdCA9IHtcclxuICAgIGludGVydmFsOiA1MDAwLFxyXG4gICAga2V5Ym9hcmQ6IHRydWUsXHJcbiAgICBzbGlkZTogZmFsc2UsXHJcbiAgICBwYXVzZTogJ2hvdmVyJyxcclxuICAgIHdyYXA6IHRydWUsXHJcbiAgICB0b3VjaDogdHJ1ZVxyXG4gIH07XHJcbiAgdmFyIERlZmF1bHRUeXBlID0ge1xyXG4gICAgaW50ZXJ2YWw6ICcobnVtYmVyfGJvb2xlYW4pJyxcclxuICAgIGtleWJvYXJkOiAnYm9vbGVhbicsXHJcbiAgICBzbGlkZTogJyhib29sZWFufHN0cmluZyknLFxyXG4gICAgcGF1c2U6ICcoc3RyaW5nfGJvb2xlYW4pJyxcclxuICAgIHdyYXA6ICdib29sZWFuJyxcclxuICAgIHRvdWNoOiAnYm9vbGVhbidcclxuICB9O1xyXG4gIHZhciBEaXJlY3Rpb24gPSB7XHJcbiAgICBORVhUOiAnbmV4dCcsXHJcbiAgICBQUkVWOiAncHJldicsXHJcbiAgICBMRUZUOiAnbGVmdCcsXHJcbiAgICBSSUdIVDogJ3JpZ2h0J1xyXG4gIH07XHJcbiAgdmFyIEV2ZW50JDIgPSB7XHJcbiAgICBTTElERTogXCJzbGlkZVwiICsgRVZFTlRfS0VZJDIsXHJcbiAgICBTTElEOiBcInNsaWRcIiArIEVWRU5UX0tFWSQyLFxyXG4gICAgS0VZRE9XTjogXCJrZXlkb3duXCIgKyBFVkVOVF9LRVkkMixcclxuICAgIE1PVVNFRU5URVI6IFwibW91c2VlbnRlclwiICsgRVZFTlRfS0VZJDIsXHJcbiAgICBNT1VTRUxFQVZFOiBcIm1vdXNlbGVhdmVcIiArIEVWRU5UX0tFWSQyLFxyXG4gICAgVE9VQ0hTVEFSVDogXCJ0b3VjaHN0YXJ0XCIgKyBFVkVOVF9LRVkkMixcclxuICAgIFRPVUNITU9WRTogXCJ0b3VjaG1vdmVcIiArIEVWRU5UX0tFWSQyLFxyXG4gICAgVE9VQ0hFTkQ6IFwidG91Y2hlbmRcIiArIEVWRU5UX0tFWSQyLFxyXG4gICAgUE9JTlRFUkRPV046IFwicG9pbnRlcmRvd25cIiArIEVWRU5UX0tFWSQyLFxyXG4gICAgUE9JTlRFUlVQOiBcInBvaW50ZXJ1cFwiICsgRVZFTlRfS0VZJDIsXHJcbiAgICBEUkFHX1NUQVJUOiBcImRyYWdzdGFydFwiICsgRVZFTlRfS0VZJDIsXHJcbiAgICBMT0FEX0RBVEFfQVBJOiBcImxvYWRcIiArIEVWRU5UX0tFWSQyICsgREFUQV9BUElfS0VZJDIsXHJcbiAgICBDTElDS19EQVRBX0FQSTogXCJjbGlja1wiICsgRVZFTlRfS0VZJDIgKyBEQVRBX0FQSV9LRVkkMlxyXG4gIH07XHJcbiAgdmFyIENsYXNzTmFtZSQyID0ge1xyXG4gICAgQ0FST1VTRUw6ICdjYXJvdXNlbCcsXHJcbiAgICBBQ1RJVkU6ICdhY3RpdmUnLFxyXG4gICAgU0xJREU6ICdzbGlkZScsXHJcbiAgICBSSUdIVDogJ2Nhcm91c2VsLWl0ZW0tcmlnaHQnLFxyXG4gICAgTEVGVDogJ2Nhcm91c2VsLWl0ZW0tbGVmdCcsXHJcbiAgICBORVhUOiAnY2Fyb3VzZWwtaXRlbS1uZXh0JyxcclxuICAgIFBSRVY6ICdjYXJvdXNlbC1pdGVtLXByZXYnLFxyXG4gICAgSVRFTTogJ2Nhcm91c2VsLWl0ZW0nLFxyXG4gICAgUE9JTlRFUl9FVkVOVDogJ3BvaW50ZXItZXZlbnQnXHJcbiAgfTtcclxuICB2YXIgU2VsZWN0b3IkMiA9IHtcclxuICAgIEFDVElWRTogJy5hY3RpdmUnLFxyXG4gICAgQUNUSVZFX0lURU06ICcuYWN0aXZlLmNhcm91c2VsLWl0ZW0nLFxyXG4gICAgSVRFTTogJy5jYXJvdXNlbC1pdGVtJyxcclxuICAgIElURU1fSU1HOiAnLmNhcm91c2VsLWl0ZW0gaW1nJyxcclxuICAgIE5FWFRfUFJFVjogJy5jYXJvdXNlbC1pdGVtLW5leHQsIC5jYXJvdXNlbC1pdGVtLXByZXYnLFxyXG4gICAgSU5ESUNBVE9SUzogJy5jYXJvdXNlbC1pbmRpY2F0b3JzJyxcclxuICAgIERBVEFfU0xJREU6ICdbZGF0YS1zbGlkZV0sIFtkYXRhLXNsaWRlLXRvXScsXHJcbiAgICBEQVRBX1JJREU6ICdbZGF0YS1yaWRlPVwiY2Fyb3VzZWxcIl0nXHJcbiAgfTtcclxuICB2YXIgUG9pbnRlclR5cGUgPSB7XHJcbiAgICBUT1VDSDogJ3RvdWNoJyxcclxuICAgIFBFTjogJ3BlbidcclxuICAgIC8qKlxyXG4gICAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAgKiBDbGFzcyBEZWZpbml0aW9uXHJcbiAgICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgICAqL1xyXG5cclxuICB9O1xyXG5cclxuICB2YXIgQ2Fyb3VzZWwgPVxyXG4gIC8qI19fUFVSRV9fKi9cclxuICBmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBDYXJvdXNlbChlbGVtZW50LCBjb25maWcpIHtcclxuICAgICAgdGhpcy5faXRlbXMgPSBudWxsO1xyXG4gICAgICB0aGlzLl9pbnRlcnZhbCA9IG51bGw7XHJcbiAgICAgIHRoaXMuX2FjdGl2ZUVsZW1lbnQgPSBudWxsO1xyXG4gICAgICB0aGlzLl9pc1BhdXNlZCA9IGZhbHNlO1xyXG4gICAgICB0aGlzLl9pc1NsaWRpbmcgPSBmYWxzZTtcclxuICAgICAgdGhpcy50b3VjaFRpbWVvdXQgPSBudWxsO1xyXG4gICAgICB0aGlzLnRvdWNoU3RhcnRYID0gMDtcclxuICAgICAgdGhpcy50b3VjaERlbHRhWCA9IDA7XHJcbiAgICAgIHRoaXMuX2NvbmZpZyA9IHRoaXMuX2dldENvbmZpZyhjb25maWcpO1xyXG4gICAgICB0aGlzLl9lbGVtZW50ID0gZWxlbWVudDtcclxuICAgICAgdGhpcy5faW5kaWNhdG9yc0VsZW1lbnQgPSB0aGlzLl9lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoU2VsZWN0b3IkMi5JTkRJQ0FUT1JTKTtcclxuICAgICAgdGhpcy5fdG91Y2hTdXBwb3J0ZWQgPSAnb250b3VjaHN0YXJ0JyBpbiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQgfHwgbmF2aWdhdG9yLm1heFRvdWNoUG9pbnRzID4gMDtcclxuICAgICAgdGhpcy5fcG9pbnRlckV2ZW50ID0gQm9vbGVhbih3aW5kb3cuUG9pbnRlckV2ZW50IHx8IHdpbmRvdy5NU1BvaW50ZXJFdmVudCk7XHJcblxyXG4gICAgICB0aGlzLl9hZGRFdmVudExpc3RlbmVycygpO1xyXG4gICAgfSAvLyBHZXR0ZXJzXHJcblxyXG5cclxuICAgIHZhciBfcHJvdG8gPSBDYXJvdXNlbC5wcm90b3R5cGU7XHJcblxyXG4gICAgLy8gUHVibGljXHJcbiAgICBfcHJvdG8ubmV4dCA9IGZ1bmN0aW9uIG5leHQoKSB7XHJcbiAgICAgIGlmICghdGhpcy5faXNTbGlkaW5nKSB7XHJcbiAgICAgICAgdGhpcy5fc2xpZGUoRGlyZWN0aW9uLk5FWFQpO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIF9wcm90by5uZXh0V2hlblZpc2libGUgPSBmdW5jdGlvbiBuZXh0V2hlblZpc2libGUoKSB7XHJcbiAgICAgIC8vIERvbid0IGNhbGwgbmV4dCB3aGVuIHRoZSBwYWdlIGlzbid0IHZpc2libGVcclxuICAgICAgLy8gb3IgdGhlIGNhcm91c2VsIG9yIGl0cyBwYXJlbnQgaXNuJ3QgdmlzaWJsZVxyXG4gICAgICBpZiAoIWRvY3VtZW50LmhpZGRlbiAmJiAkKHRoaXMuX2VsZW1lbnQpLmlzKCc6dmlzaWJsZScpICYmICQodGhpcy5fZWxlbWVudCkuY3NzKCd2aXNpYmlsaXR5JykgIT09ICdoaWRkZW4nKSB7XHJcbiAgICAgICAgdGhpcy5uZXh0KCk7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgX3Byb3RvLnByZXYgPSBmdW5jdGlvbiBwcmV2KCkge1xyXG4gICAgICBpZiAoIXRoaXMuX2lzU2xpZGluZykge1xyXG4gICAgICAgIHRoaXMuX3NsaWRlKERpcmVjdGlvbi5QUkVWKTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBfcHJvdG8ucGF1c2UgPSBmdW5jdGlvbiBwYXVzZShldmVudCkge1xyXG4gICAgICBpZiAoIWV2ZW50KSB7XHJcbiAgICAgICAgdGhpcy5faXNQYXVzZWQgPSB0cnVlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAodGhpcy5fZWxlbWVudC5xdWVyeVNlbGVjdG9yKFNlbGVjdG9yJDIuTkVYVF9QUkVWKSkge1xyXG4gICAgICAgIFV0aWwudHJpZ2dlclRyYW5zaXRpb25FbmQodGhpcy5fZWxlbWVudCk7XHJcbiAgICAgICAgdGhpcy5jeWNsZSh0cnVlKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLl9pbnRlcnZhbCk7XHJcbiAgICAgIHRoaXMuX2ludGVydmFsID0gbnVsbDtcclxuICAgIH07XHJcblxyXG4gICAgX3Byb3RvLmN5Y2xlID0gZnVuY3Rpb24gY3ljbGUoZXZlbnQpIHtcclxuICAgICAgaWYgKCFldmVudCkge1xyXG4gICAgICAgIHRoaXMuX2lzUGF1c2VkID0gZmFsc2U7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICh0aGlzLl9pbnRlcnZhbCkge1xyXG4gICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5faW50ZXJ2YWwpO1xyXG4gICAgICAgIHRoaXMuX2ludGVydmFsID0gbnVsbDtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHRoaXMuX2NvbmZpZy5pbnRlcnZhbCAmJiAhdGhpcy5faXNQYXVzZWQpIHtcclxuICAgICAgICB0aGlzLl9pbnRlcnZhbCA9IHNldEludGVydmFsKChkb2N1bWVudC52aXNpYmlsaXR5U3RhdGUgPyB0aGlzLm5leHRXaGVuVmlzaWJsZSA6IHRoaXMubmV4dCkuYmluZCh0aGlzKSwgdGhpcy5fY29uZmlnLmludGVydmFsKTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBfcHJvdG8udG8gPSBmdW5jdGlvbiB0byhpbmRleCkge1xyXG4gICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG5cclxuICAgICAgdGhpcy5fYWN0aXZlRWxlbWVudCA9IHRoaXMuX2VsZW1lbnQucXVlcnlTZWxlY3RvcihTZWxlY3RvciQyLkFDVElWRV9JVEVNKTtcclxuXHJcbiAgICAgIHZhciBhY3RpdmVJbmRleCA9IHRoaXMuX2dldEl0ZW1JbmRleCh0aGlzLl9hY3RpdmVFbGVtZW50KTtcclxuXHJcbiAgICAgIGlmIChpbmRleCA+IHRoaXMuX2l0ZW1zLmxlbmd0aCAtIDEgfHwgaW5kZXggPCAwKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAodGhpcy5faXNTbGlkaW5nKSB7XHJcbiAgICAgICAgJCh0aGlzLl9lbGVtZW50KS5vbmUoRXZlbnQkMi5TTElELCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICByZXR1cm4gX3RoaXMudG8oaW5kZXgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGFjdGl2ZUluZGV4ID09PSBpbmRleCkge1xyXG4gICAgICAgIHRoaXMucGF1c2UoKTtcclxuICAgICAgICB0aGlzLmN5Y2xlKCk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB2YXIgZGlyZWN0aW9uID0gaW5kZXggPiBhY3RpdmVJbmRleCA/IERpcmVjdGlvbi5ORVhUIDogRGlyZWN0aW9uLlBSRVY7XHJcblxyXG4gICAgICB0aGlzLl9zbGlkZShkaXJlY3Rpb24sIHRoaXMuX2l0ZW1zW2luZGV4XSk7XHJcbiAgICB9O1xyXG5cclxuICAgIF9wcm90by5kaXNwb3NlID0gZnVuY3Rpb24gZGlzcG9zZSgpIHtcclxuICAgICAgJCh0aGlzLl9lbGVtZW50KS5vZmYoRVZFTlRfS0VZJDIpO1xyXG4gICAgICAkLnJlbW92ZURhdGEodGhpcy5fZWxlbWVudCwgREFUQV9LRVkkMik7XHJcbiAgICAgIHRoaXMuX2l0ZW1zID0gbnVsbDtcclxuICAgICAgdGhpcy5fY29uZmlnID0gbnVsbDtcclxuICAgICAgdGhpcy5fZWxlbWVudCA9IG51bGw7XHJcbiAgICAgIHRoaXMuX2ludGVydmFsID0gbnVsbDtcclxuICAgICAgdGhpcy5faXNQYXVzZWQgPSBudWxsO1xyXG4gICAgICB0aGlzLl9pc1NsaWRpbmcgPSBudWxsO1xyXG4gICAgICB0aGlzLl9hY3RpdmVFbGVtZW50ID0gbnVsbDtcclxuICAgICAgdGhpcy5faW5kaWNhdG9yc0VsZW1lbnQgPSBudWxsO1xyXG4gICAgfTsgLy8gUHJpdmF0ZVxyXG5cclxuXHJcbiAgICBfcHJvdG8uX2dldENvbmZpZyA9IGZ1bmN0aW9uIF9nZXRDb25maWcoY29uZmlnKSB7XHJcbiAgICAgIGNvbmZpZyA9IF9vYmplY3RTcHJlYWQoe30sIERlZmF1bHQsIGNvbmZpZyk7XHJcbiAgICAgIFV0aWwudHlwZUNoZWNrQ29uZmlnKE5BTUUkMiwgY29uZmlnLCBEZWZhdWx0VHlwZSk7XHJcbiAgICAgIHJldHVybiBjb25maWc7XHJcbiAgICB9O1xyXG5cclxuICAgIF9wcm90by5faGFuZGxlU3dpcGUgPSBmdW5jdGlvbiBfaGFuZGxlU3dpcGUoKSB7XHJcbiAgICAgIHZhciBhYnNEZWx0YXggPSBNYXRoLmFicyh0aGlzLnRvdWNoRGVsdGFYKTtcclxuXHJcbiAgICAgIGlmIChhYnNEZWx0YXggPD0gU1dJUEVfVEhSRVNIT0xEKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB2YXIgZGlyZWN0aW9uID0gYWJzRGVsdGF4IC8gdGhpcy50b3VjaERlbHRhWDsgLy8gc3dpcGUgbGVmdFxyXG5cclxuICAgICAgaWYgKGRpcmVjdGlvbiA+IDApIHtcclxuICAgICAgICB0aGlzLnByZXYoKTtcclxuICAgICAgfSAvLyBzd2lwZSByaWdodFxyXG5cclxuXHJcbiAgICAgIGlmIChkaXJlY3Rpb24gPCAwKSB7XHJcbiAgICAgICAgdGhpcy5uZXh0KCk7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgX3Byb3RvLl9hZGRFdmVudExpc3RlbmVycyA9IGZ1bmN0aW9uIF9hZGRFdmVudExpc3RlbmVycygpIHtcclxuICAgICAgdmFyIF90aGlzMiA9IHRoaXM7XHJcblxyXG4gICAgICBpZiAodGhpcy5fY29uZmlnLmtleWJvYXJkKSB7XHJcbiAgICAgICAgJCh0aGlzLl9lbGVtZW50KS5vbihFdmVudCQyLktFWURPV04sIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgICAgcmV0dXJuIF90aGlzMi5fa2V5ZG93bihldmVudCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICh0aGlzLl9jb25maWcucGF1c2UgPT09ICdob3ZlcicpIHtcclxuICAgICAgICAkKHRoaXMuX2VsZW1lbnQpLm9uKEV2ZW50JDIuTU9VU0VFTlRFUiwgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgICByZXR1cm4gX3RoaXMyLnBhdXNlKGV2ZW50KTtcclxuICAgICAgICB9KS5vbihFdmVudCQyLk1PVVNFTEVBVkUsIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgICAgcmV0dXJuIF90aGlzMi5jeWNsZShldmVudCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuX2FkZFRvdWNoRXZlbnRMaXN0ZW5lcnMoKTtcclxuICAgIH07XHJcblxyXG4gICAgX3Byb3RvLl9hZGRUb3VjaEV2ZW50TGlzdGVuZXJzID0gZnVuY3Rpb24gX2FkZFRvdWNoRXZlbnRMaXN0ZW5lcnMoKSB7XHJcbiAgICAgIHZhciBfdGhpczMgPSB0aGlzO1xyXG5cclxuICAgICAgaWYgKCF0aGlzLl90b3VjaFN1cHBvcnRlZCkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgdmFyIHN0YXJ0ID0gZnVuY3Rpb24gc3RhcnQoZXZlbnQpIHtcclxuICAgICAgICBpZiAoX3RoaXMzLl9wb2ludGVyRXZlbnQgJiYgUG9pbnRlclR5cGVbZXZlbnQub3JpZ2luYWxFdmVudC5wb2ludGVyVHlwZS50b1VwcGVyQ2FzZSgpXSkge1xyXG4gICAgICAgICAgX3RoaXMzLnRvdWNoU3RhcnRYID0gZXZlbnQub3JpZ2luYWxFdmVudC5jbGllbnRYO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoIV90aGlzMy5fcG9pbnRlckV2ZW50KSB7XHJcbiAgICAgICAgICBfdGhpczMudG91Y2hTdGFydFggPSBldmVudC5vcmlnaW5hbEV2ZW50LnRvdWNoZXNbMF0uY2xpZW50WDtcclxuICAgICAgICB9XHJcbiAgICAgIH07XHJcblxyXG4gICAgICB2YXIgbW92ZSA9IGZ1bmN0aW9uIG1vdmUoZXZlbnQpIHtcclxuICAgICAgICAvLyBlbnN1cmUgc3dpcGluZyB3aXRoIG9uZSB0b3VjaCBhbmQgbm90IHBpbmNoaW5nXHJcbiAgICAgICAgaWYgKGV2ZW50Lm9yaWdpbmFsRXZlbnQudG91Y2hlcyAmJiBldmVudC5vcmlnaW5hbEV2ZW50LnRvdWNoZXMubGVuZ3RoID4gMSkge1xyXG4gICAgICAgICAgX3RoaXMzLnRvdWNoRGVsdGFYID0gMDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgX3RoaXMzLnRvdWNoRGVsdGFYID0gZXZlbnQub3JpZ2luYWxFdmVudC50b3VjaGVzWzBdLmNsaWVudFggLSBfdGhpczMudG91Y2hTdGFydFg7XHJcbiAgICAgICAgfVxyXG4gICAgICB9O1xyXG5cclxuICAgICAgdmFyIGVuZCA9IGZ1bmN0aW9uIGVuZChldmVudCkge1xyXG4gICAgICAgIGlmIChfdGhpczMuX3BvaW50ZXJFdmVudCAmJiBQb2ludGVyVHlwZVtldmVudC5vcmlnaW5hbEV2ZW50LnBvaW50ZXJUeXBlLnRvVXBwZXJDYXNlKCldKSB7XHJcbiAgICAgICAgICBfdGhpczMudG91Y2hEZWx0YVggPSBldmVudC5vcmlnaW5hbEV2ZW50LmNsaWVudFggLSBfdGhpczMudG91Y2hTdGFydFg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBfdGhpczMuX2hhbmRsZVN3aXBlKCk7XHJcblxyXG4gICAgICAgIGlmIChfdGhpczMuX2NvbmZpZy5wYXVzZSA9PT0gJ2hvdmVyJykge1xyXG4gICAgICAgICAgLy8gSWYgaXQncyBhIHRvdWNoLWVuYWJsZWQgZGV2aWNlLCBtb3VzZWVudGVyL2xlYXZlIGFyZSBmaXJlZCBhc1xyXG4gICAgICAgICAgLy8gcGFydCBvZiB0aGUgbW91c2UgY29tcGF0aWJpbGl0eSBldmVudHMgb24gZmlyc3QgdGFwIC0gdGhlIGNhcm91c2VsXHJcbiAgICAgICAgICAvLyB3b3VsZCBzdG9wIGN5Y2xpbmcgdW50aWwgdXNlciB0YXBwZWQgb3V0IG9mIGl0O1xyXG4gICAgICAgICAgLy8gaGVyZSwgd2UgbGlzdGVuIGZvciB0b3VjaGVuZCwgZXhwbGljaXRseSBwYXVzZSB0aGUgY2Fyb3VzZWxcclxuICAgICAgICAgIC8vIChhcyBpZiBpdCdzIHRoZSBzZWNvbmQgdGltZSB3ZSB0YXAgb24gaXQsIG1vdXNlZW50ZXIgY29tcGF0IGV2ZW50XHJcbiAgICAgICAgICAvLyBpcyBOT1QgZmlyZWQpIGFuZCBhZnRlciBhIHRpbWVvdXQgKHRvIGFsbG93IGZvciBtb3VzZSBjb21wYXRpYmlsaXR5XHJcbiAgICAgICAgICAvLyBldmVudHMgdG8gZmlyZSkgd2UgZXhwbGljaXRseSByZXN0YXJ0IGN5Y2xpbmdcclxuICAgICAgICAgIF90aGlzMy5wYXVzZSgpO1xyXG5cclxuICAgICAgICAgIGlmIChfdGhpczMudG91Y2hUaW1lb3V0KSB7XHJcbiAgICAgICAgICAgIGNsZWFyVGltZW91dChfdGhpczMudG91Y2hUaW1lb3V0KTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBfdGhpczMudG91Y2hUaW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIF90aGlzMy5jeWNsZShldmVudCk7XHJcbiAgICAgICAgICB9LCBUT1VDSEVWRU5UX0NPTVBBVF9XQUlUICsgX3RoaXMzLl9jb25maWcuaW50ZXJ2YWwpO1xyXG4gICAgICAgIH1cclxuICAgICAgfTtcclxuXHJcbiAgICAgICQodGhpcy5fZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKFNlbGVjdG9yJDIuSVRFTV9JTUcpKS5vbihFdmVudCQyLkRSQUdfU1RBUlQsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgcmV0dXJuIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBpZiAodGhpcy5fcG9pbnRlckV2ZW50KSB7XHJcbiAgICAgICAgJCh0aGlzLl9lbGVtZW50KS5vbihFdmVudCQyLlBPSU5URVJET1dOLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICAgIHJldHVybiBzdGFydChldmVudCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgJCh0aGlzLl9lbGVtZW50KS5vbihFdmVudCQyLlBPSU5URVJVUCwgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgICByZXR1cm4gZW5kKGV2ZW50KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5fZWxlbWVudC5jbGFzc0xpc3QuYWRkKENsYXNzTmFtZSQyLlBPSU5URVJfRVZFTlQpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgICQodGhpcy5fZWxlbWVudCkub24oRXZlbnQkMi5UT1VDSFNUQVJULCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICAgIHJldHVybiBzdGFydChldmVudCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgJCh0aGlzLl9lbGVtZW50KS5vbihFdmVudCQyLlRPVUNITU9WRSwgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgICByZXR1cm4gbW92ZShldmVudCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgJCh0aGlzLl9lbGVtZW50KS5vbihFdmVudCQyLlRPVUNIRU5ELCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICAgIHJldHVybiBlbmQoZXZlbnQpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIF9wcm90by5fa2V5ZG93biA9IGZ1bmN0aW9uIF9rZXlkb3duKGV2ZW50KSB7XHJcbiAgICAgIGlmICgvaW5wdXR8dGV4dGFyZWEvaS50ZXN0KGV2ZW50LnRhcmdldC50YWdOYW1lKSkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgc3dpdGNoIChldmVudC53aGljaCkge1xyXG4gICAgICAgIGNhc2UgQVJST1dfTEVGVF9LRVlDT0RFOlxyXG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgIHRoaXMucHJldigpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgIGNhc2UgQVJST1dfUklHSFRfS0VZQ09ERTpcclxuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICB0aGlzLm5leHQoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIF9wcm90by5fZ2V0SXRlbUluZGV4ID0gZnVuY3Rpb24gX2dldEl0ZW1JbmRleChlbGVtZW50KSB7XHJcbiAgICAgIHRoaXMuX2l0ZW1zID0gZWxlbWVudCAmJiBlbGVtZW50LnBhcmVudE5vZGUgPyBbXS5zbGljZS5jYWxsKGVsZW1lbnQucGFyZW50Tm9kZS5xdWVyeVNlbGVjdG9yQWxsKFNlbGVjdG9yJDIuSVRFTSkpIDogW107XHJcbiAgICAgIHJldHVybiB0aGlzLl9pdGVtcy5pbmRleE9mKGVsZW1lbnQpO1xyXG4gICAgfTtcclxuXHJcbiAgICBfcHJvdG8uX2dldEl0ZW1CeURpcmVjdGlvbiA9IGZ1bmN0aW9uIF9nZXRJdGVtQnlEaXJlY3Rpb24oZGlyZWN0aW9uLCBhY3RpdmVFbGVtZW50KSB7XHJcbiAgICAgIHZhciBpc05leHREaXJlY3Rpb24gPSBkaXJlY3Rpb24gPT09IERpcmVjdGlvbi5ORVhUO1xyXG4gICAgICB2YXIgaXNQcmV2RGlyZWN0aW9uID0gZGlyZWN0aW9uID09PSBEaXJlY3Rpb24uUFJFVjtcclxuXHJcbiAgICAgIHZhciBhY3RpdmVJbmRleCA9IHRoaXMuX2dldEl0ZW1JbmRleChhY3RpdmVFbGVtZW50KTtcclxuXHJcbiAgICAgIHZhciBsYXN0SXRlbUluZGV4ID0gdGhpcy5faXRlbXMubGVuZ3RoIC0gMTtcclxuICAgICAgdmFyIGlzR29pbmdUb1dyYXAgPSBpc1ByZXZEaXJlY3Rpb24gJiYgYWN0aXZlSW5kZXggPT09IDAgfHwgaXNOZXh0RGlyZWN0aW9uICYmIGFjdGl2ZUluZGV4ID09PSBsYXN0SXRlbUluZGV4O1xyXG5cclxuICAgICAgaWYgKGlzR29pbmdUb1dyYXAgJiYgIXRoaXMuX2NvbmZpZy53cmFwKSB7XHJcbiAgICAgICAgcmV0dXJuIGFjdGl2ZUVsZW1lbnQ7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciBkZWx0YSA9IGRpcmVjdGlvbiA9PT0gRGlyZWN0aW9uLlBSRVYgPyAtMSA6IDE7XHJcbiAgICAgIHZhciBpdGVtSW5kZXggPSAoYWN0aXZlSW5kZXggKyBkZWx0YSkgJSB0aGlzLl9pdGVtcy5sZW5ndGg7XHJcbiAgICAgIHJldHVybiBpdGVtSW5kZXggPT09IC0xID8gdGhpcy5faXRlbXNbdGhpcy5faXRlbXMubGVuZ3RoIC0gMV0gOiB0aGlzLl9pdGVtc1tpdGVtSW5kZXhdO1xyXG4gICAgfTtcclxuXHJcbiAgICBfcHJvdG8uX3RyaWdnZXJTbGlkZUV2ZW50ID0gZnVuY3Rpb24gX3RyaWdnZXJTbGlkZUV2ZW50KHJlbGF0ZWRUYXJnZXQsIGV2ZW50RGlyZWN0aW9uTmFtZSkge1xyXG4gICAgICB2YXIgdGFyZ2V0SW5kZXggPSB0aGlzLl9nZXRJdGVtSW5kZXgocmVsYXRlZFRhcmdldCk7XHJcblxyXG4gICAgICB2YXIgZnJvbUluZGV4ID0gdGhpcy5fZ2V0SXRlbUluZGV4KHRoaXMuX2VsZW1lbnQucXVlcnlTZWxlY3RvcihTZWxlY3RvciQyLkFDVElWRV9JVEVNKSk7XHJcblxyXG4gICAgICB2YXIgc2xpZGVFdmVudCA9ICQuRXZlbnQoRXZlbnQkMi5TTElERSwge1xyXG4gICAgICAgIHJlbGF0ZWRUYXJnZXQ6IHJlbGF0ZWRUYXJnZXQsXHJcbiAgICAgICAgZGlyZWN0aW9uOiBldmVudERpcmVjdGlvbk5hbWUsXHJcbiAgICAgICAgZnJvbTogZnJvbUluZGV4LFxyXG4gICAgICAgIHRvOiB0YXJnZXRJbmRleFxyXG4gICAgICB9KTtcclxuICAgICAgJCh0aGlzLl9lbGVtZW50KS50cmlnZ2VyKHNsaWRlRXZlbnQpO1xyXG4gICAgICByZXR1cm4gc2xpZGVFdmVudDtcclxuICAgIH07XHJcblxyXG4gICAgX3Byb3RvLl9zZXRBY3RpdmVJbmRpY2F0b3JFbGVtZW50ID0gZnVuY3Rpb24gX3NldEFjdGl2ZUluZGljYXRvckVsZW1lbnQoZWxlbWVudCkge1xyXG4gICAgICBpZiAodGhpcy5faW5kaWNhdG9yc0VsZW1lbnQpIHtcclxuICAgICAgICB2YXIgaW5kaWNhdG9ycyA9IFtdLnNsaWNlLmNhbGwodGhpcy5faW5kaWNhdG9yc0VsZW1lbnQucXVlcnlTZWxlY3RvckFsbChTZWxlY3RvciQyLkFDVElWRSkpO1xyXG4gICAgICAgICQoaW5kaWNhdG9ycykucmVtb3ZlQ2xhc3MoQ2xhc3NOYW1lJDIuQUNUSVZFKTtcclxuXHJcbiAgICAgICAgdmFyIG5leHRJbmRpY2F0b3IgPSB0aGlzLl9pbmRpY2F0b3JzRWxlbWVudC5jaGlsZHJlblt0aGlzLl9nZXRJdGVtSW5kZXgoZWxlbWVudCldO1xyXG5cclxuICAgICAgICBpZiAobmV4dEluZGljYXRvcikge1xyXG4gICAgICAgICAgJChuZXh0SW5kaWNhdG9yKS5hZGRDbGFzcyhDbGFzc05hbWUkMi5BQ1RJVkUpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBfcHJvdG8uX3NsaWRlID0gZnVuY3Rpb24gX3NsaWRlKGRpcmVjdGlvbiwgZWxlbWVudCkge1xyXG4gICAgICB2YXIgX3RoaXM0ID0gdGhpcztcclxuXHJcbiAgICAgIHZhciBhY3RpdmVFbGVtZW50ID0gdGhpcy5fZWxlbWVudC5xdWVyeVNlbGVjdG9yKFNlbGVjdG9yJDIuQUNUSVZFX0lURU0pO1xyXG5cclxuICAgICAgdmFyIGFjdGl2ZUVsZW1lbnRJbmRleCA9IHRoaXMuX2dldEl0ZW1JbmRleChhY3RpdmVFbGVtZW50KTtcclxuXHJcbiAgICAgIHZhciBuZXh0RWxlbWVudCA9IGVsZW1lbnQgfHwgYWN0aXZlRWxlbWVudCAmJiB0aGlzLl9nZXRJdGVtQnlEaXJlY3Rpb24oZGlyZWN0aW9uLCBhY3RpdmVFbGVtZW50KTtcclxuXHJcbiAgICAgIHZhciBuZXh0RWxlbWVudEluZGV4ID0gdGhpcy5fZ2V0SXRlbUluZGV4KG5leHRFbGVtZW50KTtcclxuXHJcbiAgICAgIHZhciBpc0N5Y2xpbmcgPSBCb29sZWFuKHRoaXMuX2ludGVydmFsKTtcclxuICAgICAgdmFyIGRpcmVjdGlvbmFsQ2xhc3NOYW1lO1xyXG4gICAgICB2YXIgb3JkZXJDbGFzc05hbWU7XHJcbiAgICAgIHZhciBldmVudERpcmVjdGlvbk5hbWU7XHJcblxyXG4gICAgICBpZiAoZGlyZWN0aW9uID09PSBEaXJlY3Rpb24uTkVYVCkge1xyXG4gICAgICAgIGRpcmVjdGlvbmFsQ2xhc3NOYW1lID0gQ2xhc3NOYW1lJDIuTEVGVDtcclxuICAgICAgICBvcmRlckNsYXNzTmFtZSA9IENsYXNzTmFtZSQyLk5FWFQ7XHJcbiAgICAgICAgZXZlbnREaXJlY3Rpb25OYW1lID0gRGlyZWN0aW9uLkxFRlQ7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZGlyZWN0aW9uYWxDbGFzc05hbWUgPSBDbGFzc05hbWUkMi5SSUdIVDtcclxuICAgICAgICBvcmRlckNsYXNzTmFtZSA9IENsYXNzTmFtZSQyLlBSRVY7XHJcbiAgICAgICAgZXZlbnREaXJlY3Rpb25OYW1lID0gRGlyZWN0aW9uLlJJR0hUO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAobmV4dEVsZW1lbnQgJiYgJChuZXh0RWxlbWVudCkuaGFzQ2xhc3MoQ2xhc3NOYW1lJDIuQUNUSVZFKSkge1xyXG4gICAgICAgIHRoaXMuX2lzU2xpZGluZyA9IGZhbHNlO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgdmFyIHNsaWRlRXZlbnQgPSB0aGlzLl90cmlnZ2VyU2xpZGVFdmVudChuZXh0RWxlbWVudCwgZXZlbnREaXJlY3Rpb25OYW1lKTtcclxuXHJcbiAgICAgIGlmIChzbGlkZUV2ZW50LmlzRGVmYXVsdFByZXZlbnRlZCgpKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoIWFjdGl2ZUVsZW1lbnQgfHwgIW5leHRFbGVtZW50KSB7XHJcbiAgICAgICAgLy8gU29tZSB3ZWlyZG5lc3MgaXMgaGFwcGVuaW5nLCBzbyB3ZSBiYWlsXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLl9pc1NsaWRpbmcgPSB0cnVlO1xyXG5cclxuICAgICAgaWYgKGlzQ3ljbGluZykge1xyXG4gICAgICAgIHRoaXMucGF1c2UoKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5fc2V0QWN0aXZlSW5kaWNhdG9yRWxlbWVudChuZXh0RWxlbWVudCk7XHJcblxyXG4gICAgICB2YXIgc2xpZEV2ZW50ID0gJC5FdmVudChFdmVudCQyLlNMSUQsIHtcclxuICAgICAgICByZWxhdGVkVGFyZ2V0OiBuZXh0RWxlbWVudCxcclxuICAgICAgICBkaXJlY3Rpb246IGV2ZW50RGlyZWN0aW9uTmFtZSxcclxuICAgICAgICBmcm9tOiBhY3RpdmVFbGVtZW50SW5kZXgsXHJcbiAgICAgICAgdG86IG5leHRFbGVtZW50SW5kZXhcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBpZiAoJCh0aGlzLl9lbGVtZW50KS5oYXNDbGFzcyhDbGFzc05hbWUkMi5TTElERSkpIHtcclxuICAgICAgICAkKG5leHRFbGVtZW50KS5hZGRDbGFzcyhvcmRlckNsYXNzTmFtZSk7XHJcbiAgICAgICAgVXRpbC5yZWZsb3cobmV4dEVsZW1lbnQpO1xyXG4gICAgICAgICQoYWN0aXZlRWxlbWVudCkuYWRkQ2xhc3MoZGlyZWN0aW9uYWxDbGFzc05hbWUpO1xyXG4gICAgICAgICQobmV4dEVsZW1lbnQpLmFkZENsYXNzKGRpcmVjdGlvbmFsQ2xhc3NOYW1lKTtcclxuICAgICAgICB2YXIgbmV4dEVsZW1lbnRJbnRlcnZhbCA9IHBhcnNlSW50KG5leHRFbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1pbnRlcnZhbCcpLCAxMCk7XHJcblxyXG4gICAgICAgIGlmIChuZXh0RWxlbWVudEludGVydmFsKSB7XHJcbiAgICAgICAgICB0aGlzLl9jb25maWcuZGVmYXVsdEludGVydmFsID0gdGhpcy5fY29uZmlnLmRlZmF1bHRJbnRlcnZhbCB8fCB0aGlzLl9jb25maWcuaW50ZXJ2YWw7XHJcbiAgICAgICAgICB0aGlzLl9jb25maWcuaW50ZXJ2YWwgPSBuZXh0RWxlbWVudEludGVydmFsO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLl9jb25maWcuaW50ZXJ2YWwgPSB0aGlzLl9jb25maWcuZGVmYXVsdEludGVydmFsIHx8IHRoaXMuX2NvbmZpZy5pbnRlcnZhbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciB0cmFuc2l0aW9uRHVyYXRpb24gPSBVdGlsLmdldFRyYW5zaXRpb25EdXJhdGlvbkZyb21FbGVtZW50KGFjdGl2ZUVsZW1lbnQpO1xyXG4gICAgICAgICQoYWN0aXZlRWxlbWVudCkub25lKFV0aWwuVFJBTlNJVElPTl9FTkQsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICQobmV4dEVsZW1lbnQpLnJlbW92ZUNsYXNzKGRpcmVjdGlvbmFsQ2xhc3NOYW1lICsgXCIgXCIgKyBvcmRlckNsYXNzTmFtZSkuYWRkQ2xhc3MoQ2xhc3NOYW1lJDIuQUNUSVZFKTtcclxuICAgICAgICAgICQoYWN0aXZlRWxlbWVudCkucmVtb3ZlQ2xhc3MoQ2xhc3NOYW1lJDIuQUNUSVZFICsgXCIgXCIgKyBvcmRlckNsYXNzTmFtZSArIFwiIFwiICsgZGlyZWN0aW9uYWxDbGFzc05hbWUpO1xyXG4gICAgICAgICAgX3RoaXM0Ll9pc1NsaWRpbmcgPSBmYWxzZTtcclxuICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJChfdGhpczQuX2VsZW1lbnQpLnRyaWdnZXIoc2xpZEV2ZW50KTtcclxuICAgICAgICAgIH0sIDApO1xyXG4gICAgICAgIH0pLmVtdWxhdGVUcmFuc2l0aW9uRW5kKHRyYW5zaXRpb25EdXJhdGlvbik7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgJChhY3RpdmVFbGVtZW50KS5yZW1vdmVDbGFzcyhDbGFzc05hbWUkMi5BQ1RJVkUpO1xyXG4gICAgICAgICQobmV4dEVsZW1lbnQpLmFkZENsYXNzKENsYXNzTmFtZSQyLkFDVElWRSk7XHJcbiAgICAgICAgdGhpcy5faXNTbGlkaW5nID0gZmFsc2U7XHJcbiAgICAgICAgJCh0aGlzLl9lbGVtZW50KS50cmlnZ2VyKHNsaWRFdmVudCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChpc0N5Y2xpbmcpIHtcclxuICAgICAgICB0aGlzLmN5Y2xlKCk7XHJcbiAgICAgIH1cclxuICAgIH07IC8vIFN0YXRpY1xyXG5cclxuXHJcbiAgICBDYXJvdXNlbC5falF1ZXJ5SW50ZXJmYWNlID0gZnVuY3Rpb24gX2pRdWVyeUludGVyZmFjZShjb25maWcpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGRhdGEgPSAkKHRoaXMpLmRhdGEoREFUQV9LRVkkMik7XHJcblxyXG4gICAgICAgIHZhciBfY29uZmlnID0gX29iamVjdFNwcmVhZCh7fSwgRGVmYXVsdCwgJCh0aGlzKS5kYXRhKCkpO1xyXG5cclxuICAgICAgICBpZiAodHlwZW9mIGNvbmZpZyA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICAgIF9jb25maWcgPSBfb2JqZWN0U3ByZWFkKHt9LCBfY29uZmlnLCBjb25maWcpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIGFjdGlvbiA9IHR5cGVvZiBjb25maWcgPT09ICdzdHJpbmcnID8gY29uZmlnIDogX2NvbmZpZy5zbGlkZTtcclxuXHJcbiAgICAgICAgaWYgKCFkYXRhKSB7XHJcbiAgICAgICAgICBkYXRhID0gbmV3IENhcm91c2VsKHRoaXMsIF9jb25maWcpO1xyXG4gICAgICAgICAgJCh0aGlzKS5kYXRhKERBVEFfS0VZJDIsIGRhdGEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHR5cGVvZiBjb25maWcgPT09ICdudW1iZXInKSB7XHJcbiAgICAgICAgICBkYXRhLnRvKGNvbmZpZyk7XHJcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgYWN0aW9uID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgaWYgKHR5cGVvZiBkYXRhW2FjdGlvbl0gPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJObyBtZXRob2QgbmFtZWQgXFxcIlwiICsgYWN0aW9uICsgXCJcXFwiXCIpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGRhdGFbYWN0aW9uXSgpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoX2NvbmZpZy5pbnRlcnZhbCkge1xyXG4gICAgICAgICAgZGF0YS5wYXVzZSgpO1xyXG4gICAgICAgICAgZGF0YS5jeWNsZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIENhcm91c2VsLl9kYXRhQXBpQ2xpY2tIYW5kbGVyID0gZnVuY3Rpb24gX2RhdGFBcGlDbGlja0hhbmRsZXIoZXZlbnQpIHtcclxuICAgICAgdmFyIHNlbGVjdG9yID0gVXRpbC5nZXRTZWxlY3RvckZyb21FbGVtZW50KHRoaXMpO1xyXG5cclxuICAgICAgaWYgKCFzZWxlY3Rvcikge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgdmFyIHRhcmdldCA9ICQoc2VsZWN0b3IpWzBdO1xyXG5cclxuICAgICAgaWYgKCF0YXJnZXQgfHwgISQodGFyZ2V0KS5oYXNDbGFzcyhDbGFzc05hbWUkMi5DQVJPVVNFTCkpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciBjb25maWcgPSBfb2JqZWN0U3ByZWFkKHt9LCAkKHRhcmdldCkuZGF0YSgpLCAkKHRoaXMpLmRhdGEoKSk7XHJcblxyXG4gICAgICB2YXIgc2xpZGVJbmRleCA9IHRoaXMuZ2V0QXR0cmlidXRlKCdkYXRhLXNsaWRlLXRvJyk7XHJcblxyXG4gICAgICBpZiAoc2xpZGVJbmRleCkge1xyXG4gICAgICAgIGNvbmZpZy5pbnRlcnZhbCA9IGZhbHNlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBDYXJvdXNlbC5falF1ZXJ5SW50ZXJmYWNlLmNhbGwoJCh0YXJnZXQpLCBjb25maWcpO1xyXG5cclxuICAgICAgaWYgKHNsaWRlSW5kZXgpIHtcclxuICAgICAgICAkKHRhcmdldCkuZGF0YShEQVRBX0tFWSQyKS50byhzbGlkZUluZGV4KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgIH07XHJcblxyXG4gICAgX2NyZWF0ZUNsYXNzKENhcm91c2VsLCBudWxsLCBbe1xyXG4gICAgICBrZXk6IFwiVkVSU0lPTlwiLFxyXG4gICAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcclxuICAgICAgICByZXR1cm4gVkVSU0lPTiQyO1xyXG4gICAgICB9XHJcbiAgICB9LCB7XHJcbiAgICAgIGtleTogXCJEZWZhdWx0XCIsXHJcbiAgICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xyXG4gICAgICAgIHJldHVybiBEZWZhdWx0O1xyXG4gICAgICB9XHJcbiAgICB9XSk7XHJcblxyXG4gICAgcmV0dXJuIENhcm91c2VsO1xyXG4gIH0oKTtcclxuICAvKipcclxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgKiBEYXRhIEFwaSBpbXBsZW1lbnRhdGlvblxyXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAqL1xyXG5cclxuXHJcbiAgJChkb2N1bWVudCkub24oRXZlbnQkMi5DTElDS19EQVRBX0FQSSwgU2VsZWN0b3IkMi5EQVRBX1NMSURFLCBDYXJvdXNlbC5fZGF0YUFwaUNsaWNrSGFuZGxlcik7XHJcbiAgJCh3aW5kb3cpLm9uKEV2ZW50JDIuTE9BRF9EQVRBX0FQSSwgZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIGNhcm91c2VscyA9IFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChTZWxlY3RvciQyLkRBVEFfUklERSkpO1xyXG5cclxuICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBjYXJvdXNlbHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgdmFyICRjYXJvdXNlbCA9ICQoY2Fyb3VzZWxzW2ldKTtcclxuXHJcbiAgICAgIENhcm91c2VsLl9qUXVlcnlJbnRlcmZhY2UuY2FsbCgkY2Fyb3VzZWwsICRjYXJvdXNlbC5kYXRhKCkpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG4gIC8qKlxyXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAqIGpRdWVyeVxyXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAqL1xyXG5cclxuICAkLmZuW05BTUUkMl0gPSBDYXJvdXNlbC5falF1ZXJ5SW50ZXJmYWNlO1xyXG4gICQuZm5bTkFNRSQyXS5Db25zdHJ1Y3RvciA9IENhcm91c2VsO1xyXG5cclxuICAkLmZuW05BTUUkMl0ubm9Db25mbGljdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICQuZm5bTkFNRSQyXSA9IEpRVUVSWV9OT19DT05GTElDVCQyO1xyXG4gICAgcmV0dXJuIENhcm91c2VsLl9qUXVlcnlJbnRlcmZhY2U7XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICogQ29uc3RhbnRzXHJcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICovXHJcblxyXG4gIHZhciBOQU1FJDMgPSAnY29sbGFwc2UnO1xyXG4gIHZhciBWRVJTSU9OJDMgPSAnNC4yLjEnO1xyXG4gIHZhciBEQVRBX0tFWSQzID0gJ2JzLmNvbGxhcHNlJztcclxuICB2YXIgRVZFTlRfS0VZJDMgPSBcIi5cIiArIERBVEFfS0VZJDM7XHJcbiAgdmFyIERBVEFfQVBJX0tFWSQzID0gJy5kYXRhLWFwaSc7XHJcbiAgdmFyIEpRVUVSWV9OT19DT05GTElDVCQzID0gJC5mbltOQU1FJDNdO1xyXG4gIHZhciBEZWZhdWx0JDEgPSB7XHJcbiAgICB0b2dnbGU6IHRydWUsXHJcbiAgICBwYXJlbnQ6ICcnXHJcbiAgfTtcclxuICB2YXIgRGVmYXVsdFR5cGUkMSA9IHtcclxuICAgIHRvZ2dsZTogJ2Jvb2xlYW4nLFxyXG4gICAgcGFyZW50OiAnKHN0cmluZ3xlbGVtZW50KSdcclxuICB9O1xyXG4gIHZhciBFdmVudCQzID0ge1xyXG4gICAgU0hPVzogXCJzaG93XCIgKyBFVkVOVF9LRVkkMyxcclxuICAgIFNIT1dOOiBcInNob3duXCIgKyBFVkVOVF9LRVkkMyxcclxuICAgIEhJREU6IFwiaGlkZVwiICsgRVZFTlRfS0VZJDMsXHJcbiAgICBISURERU46IFwiaGlkZGVuXCIgKyBFVkVOVF9LRVkkMyxcclxuICAgIENMSUNLX0RBVEFfQVBJOiBcImNsaWNrXCIgKyBFVkVOVF9LRVkkMyArIERBVEFfQVBJX0tFWSQzXHJcbiAgfTtcclxuICB2YXIgQ2xhc3NOYW1lJDMgPSB7XHJcbiAgICBTSE9XOiAnc2hvdycsXHJcbiAgICBDT0xMQVBTRTogJ2NvbGxhcHNlJyxcclxuICAgIENPTExBUFNJTkc6ICdjb2xsYXBzaW5nJyxcclxuICAgIENPTExBUFNFRDogJ2NvbGxhcHNlZCdcclxuICB9O1xyXG4gIHZhciBEaW1lbnNpb24gPSB7XHJcbiAgICBXSURUSDogJ3dpZHRoJyxcclxuICAgIEhFSUdIVDogJ2hlaWdodCdcclxuICB9O1xyXG4gIHZhciBTZWxlY3RvciQzID0ge1xyXG4gICAgQUNUSVZFUzogJy5zaG93LCAuY29sbGFwc2luZycsXHJcbiAgICBEQVRBX1RPR0dMRTogJ1tkYXRhLXRvZ2dsZT1cImNvbGxhcHNlXCJdJ1xyXG4gICAgLyoqXHJcbiAgICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgICAqIENsYXNzIERlZmluaXRpb25cclxuICAgICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgICovXHJcblxyXG4gIH07XHJcblxyXG4gIHZhciBDb2xsYXBzZSA9XHJcbiAgLyojX19QVVJFX18qL1xyXG4gIGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIENvbGxhcHNlKGVsZW1lbnQsIGNvbmZpZykge1xyXG4gICAgICB0aGlzLl9pc1RyYW5zaXRpb25pbmcgPSBmYWxzZTtcclxuICAgICAgdGhpcy5fZWxlbWVudCA9IGVsZW1lbnQ7XHJcbiAgICAgIHRoaXMuX2NvbmZpZyA9IHRoaXMuX2dldENvbmZpZyhjb25maWcpO1xyXG4gICAgICB0aGlzLl90cmlnZ2VyQXJyYXkgPSBbXS5zbGljZS5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJbZGF0YS10b2dnbGU9XFxcImNvbGxhcHNlXFxcIl1baHJlZj1cXFwiI1wiICsgZWxlbWVudC5pZCArIFwiXFxcIl0sXCIgKyAoXCJbZGF0YS10b2dnbGU9XFxcImNvbGxhcHNlXFxcIl1bZGF0YS10YXJnZXQ9XFxcIiNcIiArIGVsZW1lbnQuaWQgKyBcIlxcXCJdXCIpKSk7XHJcbiAgICAgIHZhciB0b2dnbGVMaXN0ID0gW10uc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFNlbGVjdG9yJDMuREFUQV9UT0dHTEUpKTtcclxuXHJcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSB0b2dnbGVMaXN0Lmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgdmFyIGVsZW0gPSB0b2dnbGVMaXN0W2ldO1xyXG4gICAgICAgIHZhciBzZWxlY3RvciA9IFV0aWwuZ2V0U2VsZWN0b3JGcm9tRWxlbWVudChlbGVtKTtcclxuICAgICAgICB2YXIgZmlsdGVyRWxlbWVudCA9IFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcikpLmZpbHRlcihmdW5jdGlvbiAoZm91bmRFbGVtKSB7XHJcbiAgICAgICAgICByZXR1cm4gZm91bmRFbGVtID09PSBlbGVtZW50O1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpZiAoc2VsZWN0b3IgIT09IG51bGwgJiYgZmlsdGVyRWxlbWVudC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICB0aGlzLl9zZWxlY3RvciA9IHNlbGVjdG9yO1xyXG5cclxuICAgICAgICAgIHRoaXMuX3RyaWdnZXJBcnJheS5wdXNoKGVsZW0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5fcGFyZW50ID0gdGhpcy5fY29uZmlnLnBhcmVudCA/IHRoaXMuX2dldFBhcmVudCgpIDogbnVsbDtcclxuXHJcbiAgICAgIGlmICghdGhpcy5fY29uZmlnLnBhcmVudCkge1xyXG4gICAgICAgIHRoaXMuX2FkZEFyaWFBbmRDb2xsYXBzZWRDbGFzcyh0aGlzLl9lbGVtZW50LCB0aGlzLl90cmlnZ2VyQXJyYXkpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAodGhpcy5fY29uZmlnLnRvZ2dsZSkge1xyXG4gICAgICAgIHRoaXMudG9nZ2xlKCk7XHJcbiAgICAgIH1cclxuICAgIH0gLy8gR2V0dGVyc1xyXG5cclxuXHJcbiAgICB2YXIgX3Byb3RvID0gQ29sbGFwc2UucHJvdG90eXBlO1xyXG5cclxuICAgIC8vIFB1YmxpY1xyXG4gICAgX3Byb3RvLnRvZ2dsZSA9IGZ1bmN0aW9uIHRvZ2dsZSgpIHtcclxuICAgICAgaWYgKCQodGhpcy5fZWxlbWVudCkuaGFzQ2xhc3MoQ2xhc3NOYW1lJDMuU0hPVykpIHtcclxuICAgICAgICB0aGlzLmhpZGUoKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLnNob3coKTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBfcHJvdG8uc2hvdyA9IGZ1bmN0aW9uIHNob3coKSB7XHJcbiAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcblxyXG4gICAgICBpZiAodGhpcy5faXNUcmFuc2l0aW9uaW5nIHx8ICQodGhpcy5fZWxlbWVudCkuaGFzQ2xhc3MoQ2xhc3NOYW1lJDMuU0hPVykpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciBhY3RpdmVzO1xyXG4gICAgICB2YXIgYWN0aXZlc0RhdGE7XHJcblxyXG4gICAgICBpZiAodGhpcy5fcGFyZW50KSB7XHJcbiAgICAgICAgYWN0aXZlcyA9IFtdLnNsaWNlLmNhbGwodGhpcy5fcGFyZW50LnF1ZXJ5U2VsZWN0b3JBbGwoU2VsZWN0b3IkMy5BQ1RJVkVTKSkuZmlsdGVyKGZ1bmN0aW9uIChlbGVtKSB7XHJcbiAgICAgICAgICBpZiAodHlwZW9mIF90aGlzLl9jb25maWcucGFyZW50ID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICByZXR1cm4gZWxlbS5nZXRBdHRyaWJ1dGUoJ2RhdGEtcGFyZW50JykgPT09IF90aGlzLl9jb25maWcucGFyZW50O1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIHJldHVybiBlbGVtLmNsYXNzTGlzdC5jb250YWlucyhDbGFzc05hbWUkMy5DT0xMQVBTRSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmIChhY3RpdmVzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgYWN0aXZlcyA9IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoYWN0aXZlcykge1xyXG4gICAgICAgIGFjdGl2ZXNEYXRhID0gJChhY3RpdmVzKS5ub3QodGhpcy5fc2VsZWN0b3IpLmRhdGEoREFUQV9LRVkkMyk7XHJcblxyXG4gICAgICAgIGlmIChhY3RpdmVzRGF0YSAmJiBhY3RpdmVzRGF0YS5faXNUcmFuc2l0aW9uaW5nKSB7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICB2YXIgc3RhcnRFdmVudCA9ICQuRXZlbnQoRXZlbnQkMy5TSE9XKTtcclxuICAgICAgJCh0aGlzLl9lbGVtZW50KS50cmlnZ2VyKHN0YXJ0RXZlbnQpO1xyXG5cclxuICAgICAgaWYgKHN0YXJ0RXZlbnQuaXNEZWZhdWx0UHJldmVudGVkKCkpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChhY3RpdmVzKSB7XHJcbiAgICAgICAgQ29sbGFwc2UuX2pRdWVyeUludGVyZmFjZS5jYWxsKCQoYWN0aXZlcykubm90KHRoaXMuX3NlbGVjdG9yKSwgJ2hpZGUnKTtcclxuXHJcbiAgICAgICAgaWYgKCFhY3RpdmVzRGF0YSkge1xyXG4gICAgICAgICAgJChhY3RpdmVzKS5kYXRhKERBVEFfS0VZJDMsIG51bGwpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgdmFyIGRpbWVuc2lvbiA9IHRoaXMuX2dldERpbWVuc2lvbigpO1xyXG5cclxuICAgICAgJCh0aGlzLl9lbGVtZW50KS5yZW1vdmVDbGFzcyhDbGFzc05hbWUkMy5DT0xMQVBTRSkuYWRkQ2xhc3MoQ2xhc3NOYW1lJDMuQ09MTEFQU0lORyk7XHJcbiAgICAgIHRoaXMuX2VsZW1lbnQuc3R5bGVbZGltZW5zaW9uXSA9IDA7XHJcblxyXG4gICAgICBpZiAodGhpcy5fdHJpZ2dlckFycmF5Lmxlbmd0aCkge1xyXG4gICAgICAgICQodGhpcy5fdHJpZ2dlckFycmF5KS5yZW1vdmVDbGFzcyhDbGFzc05hbWUkMy5DT0xMQVBTRUQpLmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCB0cnVlKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5zZXRUcmFuc2l0aW9uaW5nKHRydWUpO1xyXG5cclxuICAgICAgdmFyIGNvbXBsZXRlID0gZnVuY3Rpb24gY29tcGxldGUoKSB7XHJcbiAgICAgICAgJChfdGhpcy5fZWxlbWVudCkucmVtb3ZlQ2xhc3MoQ2xhc3NOYW1lJDMuQ09MTEFQU0lORykuYWRkQ2xhc3MoQ2xhc3NOYW1lJDMuQ09MTEFQU0UpLmFkZENsYXNzKENsYXNzTmFtZSQzLlNIT1cpO1xyXG4gICAgICAgIF90aGlzLl9lbGVtZW50LnN0eWxlW2RpbWVuc2lvbl0gPSAnJztcclxuXHJcbiAgICAgICAgX3RoaXMuc2V0VHJhbnNpdGlvbmluZyhmYWxzZSk7XHJcblxyXG4gICAgICAgICQoX3RoaXMuX2VsZW1lbnQpLnRyaWdnZXIoRXZlbnQkMy5TSE9XTik7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICB2YXIgY2FwaXRhbGl6ZWREaW1lbnNpb24gPSBkaW1lbnNpb25bMF0udG9VcHBlckNhc2UoKSArIGRpbWVuc2lvbi5zbGljZSgxKTtcclxuICAgICAgdmFyIHNjcm9sbFNpemUgPSBcInNjcm9sbFwiICsgY2FwaXRhbGl6ZWREaW1lbnNpb247XHJcbiAgICAgIHZhciB0cmFuc2l0aW9uRHVyYXRpb24gPSBVdGlsLmdldFRyYW5zaXRpb25EdXJhdGlvbkZyb21FbGVtZW50KHRoaXMuX2VsZW1lbnQpO1xyXG4gICAgICAkKHRoaXMuX2VsZW1lbnQpLm9uZShVdGlsLlRSQU5TSVRJT05fRU5ELCBjb21wbGV0ZSkuZW11bGF0ZVRyYW5zaXRpb25FbmQodHJhbnNpdGlvbkR1cmF0aW9uKTtcclxuICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZVtkaW1lbnNpb25dID0gdGhpcy5fZWxlbWVudFtzY3JvbGxTaXplXSArIFwicHhcIjtcclxuICAgIH07XHJcblxyXG4gICAgX3Byb3RvLmhpZGUgPSBmdW5jdGlvbiBoaWRlKCkge1xyXG4gICAgICB2YXIgX3RoaXMyID0gdGhpcztcclxuXHJcbiAgICAgIGlmICh0aGlzLl9pc1RyYW5zaXRpb25pbmcgfHwgISQodGhpcy5fZWxlbWVudCkuaGFzQ2xhc3MoQ2xhc3NOYW1lJDMuU0hPVykpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciBzdGFydEV2ZW50ID0gJC5FdmVudChFdmVudCQzLkhJREUpO1xyXG4gICAgICAkKHRoaXMuX2VsZW1lbnQpLnRyaWdnZXIoc3RhcnRFdmVudCk7XHJcblxyXG4gICAgICBpZiAoc3RhcnRFdmVudC5pc0RlZmF1bHRQcmV2ZW50ZWQoKSkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgdmFyIGRpbWVuc2lvbiA9IHRoaXMuX2dldERpbWVuc2lvbigpO1xyXG5cclxuICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZVtkaW1lbnNpb25dID0gdGhpcy5fZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVtkaW1lbnNpb25dICsgXCJweFwiO1xyXG4gICAgICBVdGlsLnJlZmxvdyh0aGlzLl9lbGVtZW50KTtcclxuICAgICAgJCh0aGlzLl9lbGVtZW50KS5hZGRDbGFzcyhDbGFzc05hbWUkMy5DT0xMQVBTSU5HKS5yZW1vdmVDbGFzcyhDbGFzc05hbWUkMy5DT0xMQVBTRSkucmVtb3ZlQ2xhc3MoQ2xhc3NOYW1lJDMuU0hPVyk7XHJcbiAgICAgIHZhciB0cmlnZ2VyQXJyYXlMZW5ndGggPSB0aGlzLl90cmlnZ2VyQXJyYXkubGVuZ3RoO1xyXG5cclxuICAgICAgaWYgKHRyaWdnZXJBcnJheUxlbmd0aCA+IDApIHtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRyaWdnZXJBcnJheUxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICB2YXIgdHJpZ2dlciA9IHRoaXMuX3RyaWdnZXJBcnJheVtpXTtcclxuICAgICAgICAgIHZhciBzZWxlY3RvciA9IFV0aWwuZ2V0U2VsZWN0b3JGcm9tRWxlbWVudCh0cmlnZ2VyKTtcclxuXHJcbiAgICAgICAgICBpZiAoc2VsZWN0b3IgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgdmFyICRlbGVtID0gJChbXS5zbGljZS5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpKSk7XHJcblxyXG4gICAgICAgICAgICBpZiAoISRlbGVtLmhhc0NsYXNzKENsYXNzTmFtZSQzLlNIT1cpKSB7XHJcbiAgICAgICAgICAgICAgJCh0cmlnZ2VyKS5hZGRDbGFzcyhDbGFzc05hbWUkMy5DT0xMQVBTRUQpLmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuc2V0VHJhbnNpdGlvbmluZyh0cnVlKTtcclxuXHJcbiAgICAgIHZhciBjb21wbGV0ZSA9IGZ1bmN0aW9uIGNvbXBsZXRlKCkge1xyXG4gICAgICAgIF90aGlzMi5zZXRUcmFuc2l0aW9uaW5nKGZhbHNlKTtcclxuXHJcbiAgICAgICAgJChfdGhpczIuX2VsZW1lbnQpLnJlbW92ZUNsYXNzKENsYXNzTmFtZSQzLkNPTExBUFNJTkcpLmFkZENsYXNzKENsYXNzTmFtZSQzLkNPTExBUFNFKS50cmlnZ2VyKEV2ZW50JDMuSElEREVOKTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgIHRoaXMuX2VsZW1lbnQuc3R5bGVbZGltZW5zaW9uXSA9ICcnO1xyXG4gICAgICB2YXIgdHJhbnNpdGlvbkR1cmF0aW9uID0gVXRpbC5nZXRUcmFuc2l0aW9uRHVyYXRpb25Gcm9tRWxlbWVudCh0aGlzLl9lbGVtZW50KTtcclxuICAgICAgJCh0aGlzLl9lbGVtZW50KS5vbmUoVXRpbC5UUkFOU0lUSU9OX0VORCwgY29tcGxldGUpLmVtdWxhdGVUcmFuc2l0aW9uRW5kKHRyYW5zaXRpb25EdXJhdGlvbik7XHJcbiAgICB9O1xyXG5cclxuICAgIF9wcm90by5zZXRUcmFuc2l0aW9uaW5nID0gZnVuY3Rpb24gc2V0VHJhbnNpdGlvbmluZyhpc1RyYW5zaXRpb25pbmcpIHtcclxuICAgICAgdGhpcy5faXNUcmFuc2l0aW9uaW5nID0gaXNUcmFuc2l0aW9uaW5nO1xyXG4gICAgfTtcclxuXHJcbiAgICBfcHJvdG8uZGlzcG9zZSA9IGZ1bmN0aW9uIGRpc3Bvc2UoKSB7XHJcbiAgICAgICQucmVtb3ZlRGF0YSh0aGlzLl9lbGVtZW50LCBEQVRBX0tFWSQzKTtcclxuICAgICAgdGhpcy5fY29uZmlnID0gbnVsbDtcclxuICAgICAgdGhpcy5fcGFyZW50ID0gbnVsbDtcclxuICAgICAgdGhpcy5fZWxlbWVudCA9IG51bGw7XHJcbiAgICAgIHRoaXMuX3RyaWdnZXJBcnJheSA9IG51bGw7XHJcbiAgICAgIHRoaXMuX2lzVHJhbnNpdGlvbmluZyA9IG51bGw7XHJcbiAgICB9OyAvLyBQcml2YXRlXHJcblxyXG5cclxuICAgIF9wcm90by5fZ2V0Q29uZmlnID0gZnVuY3Rpb24gX2dldENvbmZpZyhjb25maWcpIHtcclxuICAgICAgY29uZmlnID0gX29iamVjdFNwcmVhZCh7fSwgRGVmYXVsdCQxLCBjb25maWcpO1xyXG4gICAgICBjb25maWcudG9nZ2xlID0gQm9vbGVhbihjb25maWcudG9nZ2xlKTsgLy8gQ29lcmNlIHN0cmluZyB2YWx1ZXNcclxuXHJcbiAgICAgIFV0aWwudHlwZUNoZWNrQ29uZmlnKE5BTUUkMywgY29uZmlnLCBEZWZhdWx0VHlwZSQxKTtcclxuICAgICAgcmV0dXJuIGNvbmZpZztcclxuICAgIH07XHJcblxyXG4gICAgX3Byb3RvLl9nZXREaW1lbnNpb24gPSBmdW5jdGlvbiBfZ2V0RGltZW5zaW9uKCkge1xyXG4gICAgICB2YXIgaGFzV2lkdGggPSAkKHRoaXMuX2VsZW1lbnQpLmhhc0NsYXNzKERpbWVuc2lvbi5XSURUSCk7XHJcbiAgICAgIHJldHVybiBoYXNXaWR0aCA/IERpbWVuc2lvbi5XSURUSCA6IERpbWVuc2lvbi5IRUlHSFQ7XHJcbiAgICB9O1xyXG5cclxuICAgIF9wcm90by5fZ2V0UGFyZW50ID0gZnVuY3Rpb24gX2dldFBhcmVudCgpIHtcclxuICAgICAgdmFyIF90aGlzMyA9IHRoaXM7XHJcblxyXG4gICAgICB2YXIgcGFyZW50O1xyXG5cclxuICAgICAgaWYgKFV0aWwuaXNFbGVtZW50KHRoaXMuX2NvbmZpZy5wYXJlbnQpKSB7XHJcbiAgICAgICAgcGFyZW50ID0gdGhpcy5fY29uZmlnLnBhcmVudDsgLy8gSXQncyBhIGpRdWVyeSBvYmplY3RcclxuXHJcbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLl9jb25maWcucGFyZW50LmpxdWVyeSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgIHBhcmVudCA9IHRoaXMuX2NvbmZpZy5wYXJlbnRbMF07XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHBhcmVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGhpcy5fY29uZmlnLnBhcmVudCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciBzZWxlY3RvciA9IFwiW2RhdGEtdG9nZ2xlPVxcXCJjb2xsYXBzZVxcXCJdW2RhdGEtcGFyZW50PVxcXCJcIiArIHRoaXMuX2NvbmZpZy5wYXJlbnQgKyBcIlxcXCJdXCI7XHJcbiAgICAgIHZhciBjaGlsZHJlbiA9IFtdLnNsaWNlLmNhbGwocGFyZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpKTtcclxuICAgICAgJChjaGlsZHJlbikuZWFjaChmdW5jdGlvbiAoaSwgZWxlbWVudCkge1xyXG4gICAgICAgIF90aGlzMy5fYWRkQXJpYUFuZENvbGxhcHNlZENsYXNzKENvbGxhcHNlLl9nZXRUYXJnZXRGcm9tRWxlbWVudChlbGVtZW50KSwgW2VsZW1lbnRdKTtcclxuICAgICAgfSk7XHJcbiAgICAgIHJldHVybiBwYXJlbnQ7XHJcbiAgICB9O1xyXG5cclxuICAgIF9wcm90by5fYWRkQXJpYUFuZENvbGxhcHNlZENsYXNzID0gZnVuY3Rpb24gX2FkZEFyaWFBbmRDb2xsYXBzZWRDbGFzcyhlbGVtZW50LCB0cmlnZ2VyQXJyYXkpIHtcclxuICAgICAgdmFyIGlzT3BlbiA9ICQoZWxlbWVudCkuaGFzQ2xhc3MoQ2xhc3NOYW1lJDMuU0hPVyk7XHJcblxyXG4gICAgICBpZiAodHJpZ2dlckFycmF5Lmxlbmd0aCkge1xyXG4gICAgICAgICQodHJpZ2dlckFycmF5KS50b2dnbGVDbGFzcyhDbGFzc05hbWUkMy5DT0xMQVBTRUQsICFpc09wZW4pLmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCBpc09wZW4pO1xyXG4gICAgICB9XHJcbiAgICB9OyAvLyBTdGF0aWNcclxuXHJcblxyXG4gICAgQ29sbGFwc2UuX2dldFRhcmdldEZyb21FbGVtZW50ID0gZnVuY3Rpb24gX2dldFRhcmdldEZyb21FbGVtZW50KGVsZW1lbnQpIHtcclxuICAgICAgdmFyIHNlbGVjdG9yID0gVXRpbC5nZXRTZWxlY3RvckZyb21FbGVtZW50KGVsZW1lbnQpO1xyXG4gICAgICByZXR1cm4gc2VsZWN0b3IgPyBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKSA6IG51bGw7XHJcbiAgICB9O1xyXG5cclxuICAgIENvbGxhcHNlLl9qUXVlcnlJbnRlcmZhY2UgPSBmdW5jdGlvbiBfalF1ZXJ5SW50ZXJmYWNlKGNvbmZpZykge1xyXG4gICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpO1xyXG4gICAgICAgIHZhciBkYXRhID0gJHRoaXMuZGF0YShEQVRBX0tFWSQzKTtcclxuXHJcbiAgICAgICAgdmFyIF9jb25maWcgPSBfb2JqZWN0U3ByZWFkKHt9LCBEZWZhdWx0JDEsICR0aGlzLmRhdGEoKSwgdHlwZW9mIGNvbmZpZyA9PT0gJ29iamVjdCcgJiYgY29uZmlnID8gY29uZmlnIDoge30pO1xyXG5cclxuICAgICAgICBpZiAoIWRhdGEgJiYgX2NvbmZpZy50b2dnbGUgJiYgL3Nob3d8aGlkZS8udGVzdChjb25maWcpKSB7XHJcbiAgICAgICAgICBfY29uZmlnLnRvZ2dsZSA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCFkYXRhKSB7XHJcbiAgICAgICAgICBkYXRhID0gbmV3IENvbGxhcHNlKHRoaXMsIF9jb25maWcpO1xyXG4gICAgICAgICAgJHRoaXMuZGF0YShEQVRBX0tFWSQzLCBkYXRhKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0eXBlb2YgY29uZmlnID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgaWYgKHR5cGVvZiBkYXRhW2NvbmZpZ10gPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJObyBtZXRob2QgbmFtZWQgXFxcIlwiICsgY29uZmlnICsgXCJcXFwiXCIpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGRhdGFbY29uZmlnXSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIF9jcmVhdGVDbGFzcyhDb2xsYXBzZSwgbnVsbCwgW3tcclxuICAgICAga2V5OiBcIlZFUlNJT05cIixcclxuICAgICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XHJcbiAgICAgICAgcmV0dXJuIFZFUlNJT04kMztcclxuICAgICAgfVxyXG4gICAgfSwge1xyXG4gICAgICBrZXk6IFwiRGVmYXVsdFwiLFxyXG4gICAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcclxuICAgICAgICByZXR1cm4gRGVmYXVsdCQxO1xyXG4gICAgICB9XHJcbiAgICB9XSk7XHJcblxyXG4gICAgcmV0dXJuIENvbGxhcHNlO1xyXG4gIH0oKTtcclxuICAvKipcclxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgKiBEYXRhIEFwaSBpbXBsZW1lbnRhdGlvblxyXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAqL1xyXG5cclxuXHJcbiAgJChkb2N1bWVudCkub24oRXZlbnQkMy5DTElDS19EQVRBX0FQSSwgU2VsZWN0b3IkMy5EQVRBX1RPR0dMRSwgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAvLyBwcmV2ZW50RGVmYXVsdCBvbmx5IGZvciA8YT4gZWxlbWVudHMgKHdoaWNoIGNoYW5nZSB0aGUgVVJMKSBub3QgaW5zaWRlIHRoZSBjb2xsYXBzaWJsZSBlbGVtZW50XHJcbiAgICBpZiAoZXZlbnQuY3VycmVudFRhcmdldC50YWdOYW1lID09PSAnQScpIHtcclxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgJHRyaWdnZXIgPSAkKHRoaXMpO1xyXG4gICAgdmFyIHNlbGVjdG9yID0gVXRpbC5nZXRTZWxlY3RvckZyb21FbGVtZW50KHRoaXMpO1xyXG4gICAgdmFyIHNlbGVjdG9ycyA9IFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcikpO1xyXG4gICAgJChzZWxlY3RvcnMpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICB2YXIgJHRhcmdldCA9ICQodGhpcyk7XHJcbiAgICAgIHZhciBkYXRhID0gJHRhcmdldC5kYXRhKERBVEFfS0VZJDMpO1xyXG4gICAgICB2YXIgY29uZmlnID0gZGF0YSA/ICd0b2dnbGUnIDogJHRyaWdnZXIuZGF0YSgpO1xyXG5cclxuICAgICAgQ29sbGFwc2UuX2pRdWVyeUludGVyZmFjZS5jYWxsKCR0YXJnZXQsIGNvbmZpZyk7XHJcbiAgICB9KTtcclxuICB9KTtcclxuICAvKipcclxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgKiBqUXVlcnlcclxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgKi9cclxuXHJcbiAgJC5mbltOQU1FJDNdID0gQ29sbGFwc2UuX2pRdWVyeUludGVyZmFjZTtcclxuICAkLmZuW05BTUUkM10uQ29uc3RydWN0b3IgPSBDb2xsYXBzZTtcclxuXHJcbiAgJC5mbltOQU1FJDNdLm5vQ29uZmxpY3QgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAkLmZuW05BTUUkM10gPSBKUVVFUllfTk9fQ09ORkxJQ1QkMztcclxuICAgIHJldHVybiBDb2xsYXBzZS5falF1ZXJ5SW50ZXJmYWNlO1xyXG4gIH07XHJcblxyXG4gIC8qKlxyXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAqIENvbnN0YW50c1xyXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAqL1xyXG5cclxuICB2YXIgTkFNRSQ0ID0gJ2Ryb3Bkb3duJztcclxuICB2YXIgVkVSU0lPTiQ0ID0gJzQuMi4xJztcclxuICB2YXIgREFUQV9LRVkkNCA9ICdicy5kcm9wZG93bic7XHJcbiAgdmFyIEVWRU5UX0tFWSQ0ID0gXCIuXCIgKyBEQVRBX0tFWSQ0O1xyXG4gIHZhciBEQVRBX0FQSV9LRVkkNCA9ICcuZGF0YS1hcGknO1xyXG4gIHZhciBKUVVFUllfTk9fQ09ORkxJQ1QkNCA9ICQuZm5bTkFNRSQ0XTtcclxuICB2YXIgRVNDQVBFX0tFWUNPREUgPSAyNzsgLy8gS2V5Ym9hcmRFdmVudC53aGljaCB2YWx1ZSBmb3IgRXNjYXBlIChFc2MpIGtleVxyXG5cclxuICB2YXIgU1BBQ0VfS0VZQ09ERSA9IDMyOyAvLyBLZXlib2FyZEV2ZW50LndoaWNoIHZhbHVlIGZvciBzcGFjZSBrZXlcclxuXHJcbiAgdmFyIFRBQl9LRVlDT0RFID0gOTsgLy8gS2V5Ym9hcmRFdmVudC53aGljaCB2YWx1ZSBmb3IgdGFiIGtleVxyXG5cclxuICB2YXIgQVJST1dfVVBfS0VZQ09ERSA9IDM4OyAvLyBLZXlib2FyZEV2ZW50LndoaWNoIHZhbHVlIGZvciB1cCBhcnJvdyBrZXlcclxuXHJcbiAgdmFyIEFSUk9XX0RPV05fS0VZQ09ERSA9IDQwOyAvLyBLZXlib2FyZEV2ZW50LndoaWNoIHZhbHVlIGZvciBkb3duIGFycm93IGtleVxyXG5cclxuICB2YXIgUklHSFRfTU9VU0VfQlVUVE9OX1dISUNIID0gMzsgLy8gTW91c2VFdmVudC53aGljaCB2YWx1ZSBmb3IgdGhlIHJpZ2h0IGJ1dHRvbiAoYXNzdW1pbmcgYSByaWdodC1oYW5kZWQgbW91c2UpXHJcblxyXG4gIHZhciBSRUdFWFBfS0VZRE9XTiA9IG5ldyBSZWdFeHAoQVJST1dfVVBfS0VZQ09ERSArIFwifFwiICsgQVJST1dfRE9XTl9LRVlDT0RFICsgXCJ8XCIgKyBFU0NBUEVfS0VZQ09ERSk7XHJcbiAgdmFyIEV2ZW50JDQgPSB7XHJcbiAgICBISURFOiBcImhpZGVcIiArIEVWRU5UX0tFWSQ0LFxyXG4gICAgSElEREVOOiBcImhpZGRlblwiICsgRVZFTlRfS0VZJDQsXHJcbiAgICBTSE9XOiBcInNob3dcIiArIEVWRU5UX0tFWSQ0LFxyXG4gICAgU0hPV046IFwic2hvd25cIiArIEVWRU5UX0tFWSQ0LFxyXG4gICAgQ0xJQ0s6IFwiY2xpY2tcIiArIEVWRU5UX0tFWSQ0LFxyXG4gICAgQ0xJQ0tfREFUQV9BUEk6IFwiY2xpY2tcIiArIEVWRU5UX0tFWSQ0ICsgREFUQV9BUElfS0VZJDQsXHJcbiAgICBLRVlET1dOX0RBVEFfQVBJOiBcImtleWRvd25cIiArIEVWRU5UX0tFWSQ0ICsgREFUQV9BUElfS0VZJDQsXHJcbiAgICBLRVlVUF9EQVRBX0FQSTogXCJrZXl1cFwiICsgRVZFTlRfS0VZJDQgKyBEQVRBX0FQSV9LRVkkNFxyXG4gIH07XHJcbiAgdmFyIENsYXNzTmFtZSQ0ID0ge1xyXG4gICAgRElTQUJMRUQ6ICdkaXNhYmxlZCcsXHJcbiAgICBTSE9XOiAnc2hvdycsXHJcbiAgICBEUk9QVVA6ICdkcm9wdXAnLFxyXG4gICAgRFJPUFJJR0hUOiAnZHJvcHJpZ2h0JyxcclxuICAgIERST1BMRUZUOiAnZHJvcGxlZnQnLFxyXG4gICAgTUVOVVJJR0hUOiAnZHJvcGRvd24tbWVudS1yaWdodCcsXHJcbiAgICBNRU5VTEVGVDogJ2Ryb3Bkb3duLW1lbnUtbGVmdCcsXHJcbiAgICBQT1NJVElPTl9TVEFUSUM6ICdwb3NpdGlvbi1zdGF0aWMnXHJcbiAgfTtcclxuICB2YXIgU2VsZWN0b3IkNCA9IHtcclxuICAgIERBVEFfVE9HR0xFOiAnW2RhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIl0nLFxyXG4gICAgRk9STV9DSElMRDogJy5kcm9wZG93biBmb3JtJyxcclxuICAgIE1FTlU6ICcuZHJvcGRvd24tbWVudScsXHJcbiAgICBOQVZCQVJfTkFWOiAnLm5hdmJhci1uYXYnLFxyXG4gICAgVklTSUJMRV9JVEVNUzogJy5kcm9wZG93bi1tZW51IC5kcm9wZG93bi1pdGVtOm5vdCguZGlzYWJsZWQpOm5vdCg6ZGlzYWJsZWQpJ1xyXG4gIH07XHJcbiAgdmFyIEF0dGFjaG1lbnRNYXAgPSB7XHJcbiAgICBUT1A6ICd0b3Atc3RhcnQnLFxyXG4gICAgVE9QRU5EOiAndG9wLWVuZCcsXHJcbiAgICBCT1RUT006ICdib3R0b20tc3RhcnQnLFxyXG4gICAgQk9UVE9NRU5EOiAnYm90dG9tLWVuZCcsXHJcbiAgICBSSUdIVDogJ3JpZ2h0LXN0YXJ0JyxcclxuICAgIFJJR0hURU5EOiAncmlnaHQtZW5kJyxcclxuICAgIExFRlQ6ICdsZWZ0LXN0YXJ0JyxcclxuICAgIExFRlRFTkQ6ICdsZWZ0LWVuZCdcclxuICB9O1xyXG4gIHZhciBEZWZhdWx0JDIgPSB7XHJcbiAgICBvZmZzZXQ6IDAsXHJcbiAgICBmbGlwOiB0cnVlLFxyXG4gICAgYm91bmRhcnk6ICdzY3JvbGxQYXJlbnQnLFxyXG4gICAgcmVmZXJlbmNlOiAndG9nZ2xlJyxcclxuICAgIGRpc3BsYXk6ICdkeW5hbWljJ1xyXG4gIH07XHJcbiAgdmFyIERlZmF1bHRUeXBlJDIgPSB7XHJcbiAgICBvZmZzZXQ6ICcobnVtYmVyfHN0cmluZ3xmdW5jdGlvbiknLFxyXG4gICAgZmxpcDogJ2Jvb2xlYW4nLFxyXG4gICAgYm91bmRhcnk6ICcoc3RyaW5nfGVsZW1lbnQpJyxcclxuICAgIHJlZmVyZW5jZTogJyhzdHJpbmd8ZWxlbWVudCknLFxyXG4gICAgZGlzcGxheTogJ3N0cmluZydcclxuICAgIC8qKlxyXG4gICAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAgKiBDbGFzcyBEZWZpbml0aW9uXHJcbiAgICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgICAqL1xyXG5cclxuICB9O1xyXG5cclxuICB2YXIgRHJvcGRvd24gPVxyXG4gIC8qI19fUFVSRV9fKi9cclxuICBmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBEcm9wZG93bihlbGVtZW50LCBjb25maWcpIHtcclxuICAgICAgdGhpcy5fZWxlbWVudCA9IGVsZW1lbnQ7XHJcbiAgICAgIHRoaXMuX3BvcHBlciA9IG51bGw7XHJcbiAgICAgIHRoaXMuX2NvbmZpZyA9IHRoaXMuX2dldENvbmZpZyhjb25maWcpO1xyXG4gICAgICB0aGlzLl9tZW51ID0gdGhpcy5fZ2V0TWVudUVsZW1lbnQoKTtcclxuICAgICAgdGhpcy5faW5OYXZiYXIgPSB0aGlzLl9kZXRlY3ROYXZiYXIoKTtcclxuXHJcbiAgICAgIHRoaXMuX2FkZEV2ZW50TGlzdGVuZXJzKCk7XHJcbiAgICB9IC8vIEdldHRlcnNcclxuXHJcblxyXG4gICAgdmFyIF9wcm90byA9IERyb3Bkb3duLnByb3RvdHlwZTtcclxuXHJcbiAgICAvLyBQdWJsaWNcclxuICAgIF9wcm90by50b2dnbGUgPSBmdW5jdGlvbiB0b2dnbGUoKSB7XHJcbiAgICAgIGlmICh0aGlzLl9lbGVtZW50LmRpc2FibGVkIHx8ICQodGhpcy5fZWxlbWVudCkuaGFzQ2xhc3MoQ2xhc3NOYW1lJDQuRElTQUJMRUQpKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB2YXIgcGFyZW50ID0gRHJvcGRvd24uX2dldFBhcmVudEZyb21FbGVtZW50KHRoaXMuX2VsZW1lbnQpO1xyXG5cclxuICAgICAgdmFyIGlzQWN0aXZlID0gJCh0aGlzLl9tZW51KS5oYXNDbGFzcyhDbGFzc05hbWUkNC5TSE9XKTtcclxuXHJcbiAgICAgIERyb3Bkb3duLl9jbGVhck1lbnVzKCk7XHJcblxyXG4gICAgICBpZiAoaXNBY3RpdmUpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciByZWxhdGVkVGFyZ2V0ID0ge1xyXG4gICAgICAgIHJlbGF0ZWRUYXJnZXQ6IHRoaXMuX2VsZW1lbnRcclxuICAgICAgfTtcclxuICAgICAgdmFyIHNob3dFdmVudCA9ICQuRXZlbnQoRXZlbnQkNC5TSE9XLCByZWxhdGVkVGFyZ2V0KTtcclxuICAgICAgJChwYXJlbnQpLnRyaWdnZXIoc2hvd0V2ZW50KTtcclxuXHJcbiAgICAgIGlmIChzaG93RXZlbnQuaXNEZWZhdWx0UHJldmVudGVkKCkpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH0gLy8gRGlzYWJsZSB0b3RhbGx5IFBvcHBlci5qcyBmb3IgRHJvcGRvd24gaW4gTmF2YmFyXHJcblxyXG5cclxuICAgICAgaWYgKCF0aGlzLl9pbk5hdmJhcikge1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIENoZWNrIGZvciBQb3BwZXIgZGVwZW5kZW5jeVxyXG4gICAgICAgICAqIFBvcHBlciAtIGh0dHBzOi8vcG9wcGVyLmpzLm9yZ1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGlmICh0eXBlb2YgUG9wcGVyID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQm9vdHN0cmFwXFwncyBkcm9wZG93bnMgcmVxdWlyZSBQb3BwZXIuanMgKGh0dHBzOi8vcG9wcGVyLmpzLm9yZy8pJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgcmVmZXJlbmNlRWxlbWVudCA9IHRoaXMuX2VsZW1lbnQ7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9jb25maWcucmVmZXJlbmNlID09PSAncGFyZW50Jykge1xyXG4gICAgICAgICAgcmVmZXJlbmNlRWxlbWVudCA9IHBhcmVudDtcclxuICAgICAgICB9IGVsc2UgaWYgKFV0aWwuaXNFbGVtZW50KHRoaXMuX2NvbmZpZy5yZWZlcmVuY2UpKSB7XHJcbiAgICAgICAgICByZWZlcmVuY2VFbGVtZW50ID0gdGhpcy5fY29uZmlnLnJlZmVyZW5jZTsgLy8gQ2hlY2sgaWYgaXQncyBqUXVlcnkgZWxlbWVudFxyXG5cclxuICAgICAgICAgIGlmICh0eXBlb2YgdGhpcy5fY29uZmlnLnJlZmVyZW5jZS5qcXVlcnkgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgIHJlZmVyZW5jZUVsZW1lbnQgPSB0aGlzLl9jb25maWcucmVmZXJlbmNlWzBdO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gLy8gSWYgYm91bmRhcnkgaXMgbm90IGBzY3JvbGxQYXJlbnRgLCB0aGVuIHNldCBwb3NpdGlvbiB0byBgc3RhdGljYFxyXG4gICAgICAgIC8vIHRvIGFsbG93IHRoZSBtZW51IHRvIFwiZXNjYXBlXCIgdGhlIHNjcm9sbCBwYXJlbnQncyBib3VuZGFyaWVzXHJcbiAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2lzc3Vlcy8yNDI1MVxyXG5cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX2NvbmZpZy5ib3VuZGFyeSAhPT0gJ3Njcm9sbFBhcmVudCcpIHtcclxuICAgICAgICAgICQocGFyZW50KS5hZGRDbGFzcyhDbGFzc05hbWUkNC5QT1NJVElPTl9TVEFUSUMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fcG9wcGVyID0gbmV3IFBvcHBlcihyZWZlcmVuY2VFbGVtZW50LCB0aGlzLl9tZW51LCB0aGlzLl9nZXRQb3BwZXJDb25maWcoKSk7XHJcbiAgICAgIH0gLy8gSWYgdGhpcyBpcyBhIHRvdWNoLWVuYWJsZWQgZGV2aWNlIHdlIGFkZCBleHRyYVxyXG4gICAgICAvLyBlbXB0eSBtb3VzZW92ZXIgbGlzdGVuZXJzIHRvIHRoZSBib2R5J3MgaW1tZWRpYXRlIGNoaWxkcmVuO1xyXG4gICAgICAvLyBvbmx5IG5lZWRlZCBiZWNhdXNlIG9mIGJyb2tlbiBldmVudCBkZWxlZ2F0aW9uIG9uIGlPU1xyXG4gICAgICAvLyBodHRwczovL3d3dy5xdWlya3Ntb2RlLm9yZy9ibG9nL2FyY2hpdmVzLzIwMTQvMDIvbW91c2VfZXZlbnRfYnViLmh0bWxcclxuXHJcblxyXG4gICAgICBpZiAoJ29udG91Y2hzdGFydCcgaW4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50ICYmICQocGFyZW50KS5jbG9zZXN0KFNlbGVjdG9yJDQuTkFWQkFSX05BVikubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgJChkb2N1bWVudC5ib2R5KS5jaGlsZHJlbigpLm9uKCdtb3VzZW92ZXInLCBudWxsLCAkLm5vb3ApO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLl9lbGVtZW50LmZvY3VzKCk7XHJcblxyXG4gICAgICB0aGlzLl9lbGVtZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsIHRydWUpO1xyXG5cclxuICAgICAgJCh0aGlzLl9tZW51KS50b2dnbGVDbGFzcyhDbGFzc05hbWUkNC5TSE9XKTtcclxuICAgICAgJChwYXJlbnQpLnRvZ2dsZUNsYXNzKENsYXNzTmFtZSQ0LlNIT1cpLnRyaWdnZXIoJC5FdmVudChFdmVudCQ0LlNIT1dOLCByZWxhdGVkVGFyZ2V0KSk7XHJcbiAgICB9O1xyXG5cclxuICAgIF9wcm90by5zaG93ID0gZnVuY3Rpb24gc2hvdygpIHtcclxuICAgICAgaWYgKHRoaXMuX2VsZW1lbnQuZGlzYWJsZWQgfHwgJCh0aGlzLl9lbGVtZW50KS5oYXNDbGFzcyhDbGFzc05hbWUkNC5ESVNBQkxFRCkgfHwgJCh0aGlzLl9tZW51KS5oYXNDbGFzcyhDbGFzc05hbWUkNC5TSE9XKSkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgdmFyIHJlbGF0ZWRUYXJnZXQgPSB7XHJcbiAgICAgICAgcmVsYXRlZFRhcmdldDogdGhpcy5fZWxlbWVudFxyXG4gICAgICB9O1xyXG4gICAgICB2YXIgc2hvd0V2ZW50ID0gJC5FdmVudChFdmVudCQ0LlNIT1csIHJlbGF0ZWRUYXJnZXQpO1xyXG5cclxuICAgICAgdmFyIHBhcmVudCA9IERyb3Bkb3duLl9nZXRQYXJlbnRGcm9tRWxlbWVudCh0aGlzLl9lbGVtZW50KTtcclxuXHJcbiAgICAgICQocGFyZW50KS50cmlnZ2VyKHNob3dFdmVudCk7XHJcblxyXG4gICAgICBpZiAoc2hvd0V2ZW50LmlzRGVmYXVsdFByZXZlbnRlZCgpKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAkKHRoaXMuX21lbnUpLnRvZ2dsZUNsYXNzKENsYXNzTmFtZSQ0LlNIT1cpO1xyXG4gICAgICAkKHBhcmVudCkudG9nZ2xlQ2xhc3MoQ2xhc3NOYW1lJDQuU0hPVykudHJpZ2dlcigkLkV2ZW50KEV2ZW50JDQuU0hPV04sIHJlbGF0ZWRUYXJnZXQpKTtcclxuICAgIH07XHJcblxyXG4gICAgX3Byb3RvLmhpZGUgPSBmdW5jdGlvbiBoaWRlKCkge1xyXG4gICAgICBpZiAodGhpcy5fZWxlbWVudC5kaXNhYmxlZCB8fCAkKHRoaXMuX2VsZW1lbnQpLmhhc0NsYXNzKENsYXNzTmFtZSQ0LkRJU0FCTEVEKSB8fCAhJCh0aGlzLl9tZW51KS5oYXNDbGFzcyhDbGFzc05hbWUkNC5TSE9XKSkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgdmFyIHJlbGF0ZWRUYXJnZXQgPSB7XHJcbiAgICAgICAgcmVsYXRlZFRhcmdldDogdGhpcy5fZWxlbWVudFxyXG4gICAgICB9O1xyXG4gICAgICB2YXIgaGlkZUV2ZW50ID0gJC5FdmVudChFdmVudCQ0LkhJREUsIHJlbGF0ZWRUYXJnZXQpO1xyXG5cclxuICAgICAgdmFyIHBhcmVudCA9IERyb3Bkb3duLl9nZXRQYXJlbnRGcm9tRWxlbWVudCh0aGlzLl9lbGVtZW50KTtcclxuXHJcbiAgICAgICQocGFyZW50KS50cmlnZ2VyKGhpZGVFdmVudCk7XHJcblxyXG4gICAgICBpZiAoaGlkZUV2ZW50LmlzRGVmYXVsdFByZXZlbnRlZCgpKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAkKHRoaXMuX21lbnUpLnRvZ2dsZUNsYXNzKENsYXNzTmFtZSQ0LlNIT1cpO1xyXG4gICAgICAkKHBhcmVudCkudG9nZ2xlQ2xhc3MoQ2xhc3NOYW1lJDQuU0hPVykudHJpZ2dlcigkLkV2ZW50KEV2ZW50JDQuSElEREVOLCByZWxhdGVkVGFyZ2V0KSk7XHJcbiAgICB9O1xyXG5cclxuICAgIF9wcm90by5kaXNwb3NlID0gZnVuY3Rpb24gZGlzcG9zZSgpIHtcclxuICAgICAgJC5yZW1vdmVEYXRhKHRoaXMuX2VsZW1lbnQsIERBVEFfS0VZJDQpO1xyXG4gICAgICAkKHRoaXMuX2VsZW1lbnQpLm9mZihFVkVOVF9LRVkkNCk7XHJcbiAgICAgIHRoaXMuX2VsZW1lbnQgPSBudWxsO1xyXG4gICAgICB0aGlzLl9tZW51ID0gbnVsbDtcclxuXHJcbiAgICAgIGlmICh0aGlzLl9wb3BwZXIgIT09IG51bGwpIHtcclxuICAgICAgICB0aGlzLl9wb3BwZXIuZGVzdHJveSgpO1xyXG5cclxuICAgICAgICB0aGlzLl9wb3BwZXIgPSBudWxsO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIF9wcm90by51cGRhdGUgPSBmdW5jdGlvbiB1cGRhdGUoKSB7XHJcbiAgICAgIHRoaXMuX2luTmF2YmFyID0gdGhpcy5fZGV0ZWN0TmF2YmFyKCk7XHJcblxyXG4gICAgICBpZiAodGhpcy5fcG9wcGVyICE9PSBudWxsKSB7XHJcbiAgICAgICAgdGhpcy5fcG9wcGVyLnNjaGVkdWxlVXBkYXRlKCk7XHJcbiAgICAgIH1cclxuICAgIH07IC8vIFByaXZhdGVcclxuXHJcblxyXG4gICAgX3Byb3RvLl9hZGRFdmVudExpc3RlbmVycyA9IGZ1bmN0aW9uIF9hZGRFdmVudExpc3RlbmVycygpIHtcclxuICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuXHJcbiAgICAgICQodGhpcy5fZWxlbWVudCkub24oRXZlbnQkNC5DTElDSywgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHJcbiAgICAgICAgX3RoaXMudG9nZ2xlKCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICBfcHJvdG8uX2dldENvbmZpZyA9IGZ1bmN0aW9uIF9nZXRDb25maWcoY29uZmlnKSB7XHJcbiAgICAgIGNvbmZpZyA9IF9vYmplY3RTcHJlYWQoe30sIHRoaXMuY29uc3RydWN0b3IuRGVmYXVsdCwgJCh0aGlzLl9lbGVtZW50KS5kYXRhKCksIGNvbmZpZyk7XHJcbiAgICAgIFV0aWwudHlwZUNoZWNrQ29uZmlnKE5BTUUkNCwgY29uZmlnLCB0aGlzLmNvbnN0cnVjdG9yLkRlZmF1bHRUeXBlKTtcclxuICAgICAgcmV0dXJuIGNvbmZpZztcclxuICAgIH07XHJcblxyXG4gICAgX3Byb3RvLl9nZXRNZW51RWxlbWVudCA9IGZ1bmN0aW9uIF9nZXRNZW51RWxlbWVudCgpIHtcclxuICAgICAgaWYgKCF0aGlzLl9tZW51KSB7XHJcbiAgICAgICAgdmFyIHBhcmVudCA9IERyb3Bkb3duLl9nZXRQYXJlbnRGcm9tRWxlbWVudCh0aGlzLl9lbGVtZW50KTtcclxuXHJcbiAgICAgICAgaWYgKHBhcmVudCkge1xyXG4gICAgICAgICAgdGhpcy5fbWVudSA9IHBhcmVudC5xdWVyeVNlbGVjdG9yKFNlbGVjdG9yJDQuTUVOVSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gdGhpcy5fbWVudTtcclxuICAgIH07XHJcblxyXG4gICAgX3Byb3RvLl9nZXRQbGFjZW1lbnQgPSBmdW5jdGlvbiBfZ2V0UGxhY2VtZW50KCkge1xyXG4gICAgICB2YXIgJHBhcmVudERyb3Bkb3duID0gJCh0aGlzLl9lbGVtZW50LnBhcmVudE5vZGUpO1xyXG4gICAgICB2YXIgcGxhY2VtZW50ID0gQXR0YWNobWVudE1hcC5CT1RUT007IC8vIEhhbmRsZSBkcm9wdXBcclxuXHJcbiAgICAgIGlmICgkcGFyZW50RHJvcGRvd24uaGFzQ2xhc3MoQ2xhc3NOYW1lJDQuRFJPUFVQKSkge1xyXG4gICAgICAgIHBsYWNlbWVudCA9IEF0dGFjaG1lbnRNYXAuVE9QO1xyXG5cclxuICAgICAgICBpZiAoJCh0aGlzLl9tZW51KS5oYXNDbGFzcyhDbGFzc05hbWUkNC5NRU5VUklHSFQpKSB7XHJcbiAgICAgICAgICBwbGFjZW1lbnQgPSBBdHRhY2htZW50TWFwLlRPUEVORDtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSBpZiAoJHBhcmVudERyb3Bkb3duLmhhc0NsYXNzKENsYXNzTmFtZSQ0LkRST1BSSUdIVCkpIHtcclxuICAgICAgICBwbGFjZW1lbnQgPSBBdHRhY2htZW50TWFwLlJJR0hUO1xyXG4gICAgICB9IGVsc2UgaWYgKCRwYXJlbnREcm9wZG93bi5oYXNDbGFzcyhDbGFzc05hbWUkNC5EUk9QTEVGVCkpIHtcclxuICAgICAgICBwbGFjZW1lbnQgPSBBdHRhY2htZW50TWFwLkxFRlQ7XHJcbiAgICAgIH0gZWxzZSBpZiAoJCh0aGlzLl9tZW51KS5oYXNDbGFzcyhDbGFzc05hbWUkNC5NRU5VUklHSFQpKSB7XHJcbiAgICAgICAgcGxhY2VtZW50ID0gQXR0YWNobWVudE1hcC5CT1RUT01FTkQ7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBwbGFjZW1lbnQ7XHJcbiAgICB9O1xyXG5cclxuICAgIF9wcm90by5fZGV0ZWN0TmF2YmFyID0gZnVuY3Rpb24gX2RldGVjdE5hdmJhcigpIHtcclxuICAgICAgcmV0dXJuICQodGhpcy5fZWxlbWVudCkuY2xvc2VzdCgnLm5hdmJhcicpLmxlbmd0aCA+IDA7XHJcbiAgICB9O1xyXG5cclxuICAgIF9wcm90by5fZ2V0UG9wcGVyQ29uZmlnID0gZnVuY3Rpb24gX2dldFBvcHBlckNvbmZpZygpIHtcclxuICAgICAgdmFyIF90aGlzMiA9IHRoaXM7XHJcblxyXG4gICAgICB2YXIgb2Zmc2V0Q29uZiA9IHt9O1xyXG5cclxuICAgICAgaWYgKHR5cGVvZiB0aGlzLl9jb25maWcub2Zmc2V0ID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgb2Zmc2V0Q29uZi5mbiA9IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICBkYXRhLm9mZnNldHMgPSBfb2JqZWN0U3ByZWFkKHt9LCBkYXRhLm9mZnNldHMsIF90aGlzMi5fY29uZmlnLm9mZnNldChkYXRhLm9mZnNldHMpIHx8IHt9KTtcclxuICAgICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgICAgIH07XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgb2Zmc2V0Q29uZi5vZmZzZXQgPSB0aGlzLl9jb25maWcub2Zmc2V0O1xyXG4gICAgICB9XHJcblxyXG4gICAgICB2YXIgcG9wcGVyQ29uZmlnID0ge1xyXG4gICAgICAgIHBsYWNlbWVudDogdGhpcy5fZ2V0UGxhY2VtZW50KCksXHJcbiAgICAgICAgbW9kaWZpZXJzOiB7XHJcbiAgICAgICAgICBvZmZzZXQ6IG9mZnNldENvbmYsXHJcbiAgICAgICAgICBmbGlwOiB7XHJcbiAgICAgICAgICAgIGVuYWJsZWQ6IHRoaXMuX2NvbmZpZy5mbGlwXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgcHJldmVudE92ZXJmbG93OiB7XHJcbiAgICAgICAgICAgIGJvdW5kYXJpZXNFbGVtZW50OiB0aGlzLl9jb25maWcuYm91bmRhcnlcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IC8vIERpc2FibGUgUG9wcGVyLmpzIGlmIHdlIGhhdmUgYSBzdGF0aWMgZGlzcGxheVxyXG5cclxuICAgICAgfTtcclxuXHJcbiAgICAgIGlmICh0aGlzLl9jb25maWcuZGlzcGxheSA9PT0gJ3N0YXRpYycpIHtcclxuICAgICAgICBwb3BwZXJDb25maWcubW9kaWZpZXJzLmFwcGx5U3R5bGUgPSB7XHJcbiAgICAgICAgICBlbmFibGVkOiBmYWxzZVxyXG4gICAgICAgIH07XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBwb3BwZXJDb25maWc7XHJcbiAgICB9OyAvLyBTdGF0aWNcclxuXHJcblxyXG4gICAgRHJvcGRvd24uX2pRdWVyeUludGVyZmFjZSA9IGZ1bmN0aW9uIF9qUXVlcnlJbnRlcmZhY2UoY29uZmlnKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBkYXRhID0gJCh0aGlzKS5kYXRhKERBVEFfS0VZJDQpO1xyXG5cclxuICAgICAgICB2YXIgX2NvbmZpZyA9IHR5cGVvZiBjb25maWcgPT09ICdvYmplY3QnID8gY29uZmlnIDogbnVsbDtcclxuXHJcbiAgICAgICAgaWYgKCFkYXRhKSB7XHJcbiAgICAgICAgICBkYXRhID0gbmV3IERyb3Bkb3duKHRoaXMsIF9jb25maWcpO1xyXG4gICAgICAgICAgJCh0aGlzKS5kYXRhKERBVEFfS0VZJDQsIGRhdGEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHR5cGVvZiBjb25maWcgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICBpZiAodHlwZW9mIGRhdGFbY29uZmlnXSA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIk5vIG1ldGhvZCBuYW1lZCBcXFwiXCIgKyBjb25maWcgKyBcIlxcXCJcIik7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgZGF0YVtjb25maWddKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgRHJvcGRvd24uX2NsZWFyTWVudXMgPSBmdW5jdGlvbiBfY2xlYXJNZW51cyhldmVudCkge1xyXG4gICAgICBpZiAoZXZlbnQgJiYgKGV2ZW50LndoaWNoID09PSBSSUdIVF9NT1VTRV9CVVRUT05fV0hJQ0ggfHwgZXZlbnQudHlwZSA9PT0gJ2tleXVwJyAmJiBldmVudC53aGljaCAhPT0gVEFCX0tFWUNPREUpKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB2YXIgdG9nZ2xlcyA9IFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChTZWxlY3RvciQ0LkRBVEFfVE9HR0xFKSk7XHJcblxyXG4gICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gdG9nZ2xlcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG4gICAgICAgIHZhciBwYXJlbnQgPSBEcm9wZG93bi5fZ2V0UGFyZW50RnJvbUVsZW1lbnQodG9nZ2xlc1tpXSk7XHJcblxyXG4gICAgICAgIHZhciBjb250ZXh0ID0gJCh0b2dnbGVzW2ldKS5kYXRhKERBVEFfS0VZJDQpO1xyXG4gICAgICAgIHZhciByZWxhdGVkVGFyZ2V0ID0ge1xyXG4gICAgICAgICAgcmVsYXRlZFRhcmdldDogdG9nZ2xlc1tpXVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGlmIChldmVudCAmJiBldmVudC50eXBlID09PSAnY2xpY2snKSB7XHJcbiAgICAgICAgICByZWxhdGVkVGFyZ2V0LmNsaWNrRXZlbnQgPSBldmVudDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghY29udGV4dCkge1xyXG4gICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgZHJvcGRvd25NZW51ID0gY29udGV4dC5fbWVudTtcclxuXHJcbiAgICAgICAgaWYgKCEkKHBhcmVudCkuaGFzQ2xhc3MoQ2xhc3NOYW1lJDQuU0hPVykpIHtcclxuICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGV2ZW50ICYmIChldmVudC50eXBlID09PSAnY2xpY2snICYmIC9pbnB1dHx0ZXh0YXJlYS9pLnRlc3QoZXZlbnQudGFyZ2V0LnRhZ05hbWUpIHx8IGV2ZW50LnR5cGUgPT09ICdrZXl1cCcgJiYgZXZlbnQud2hpY2ggPT09IFRBQl9LRVlDT0RFKSAmJiAkLmNvbnRhaW5zKHBhcmVudCwgZXZlbnQudGFyZ2V0KSkge1xyXG4gICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgaGlkZUV2ZW50ID0gJC5FdmVudChFdmVudCQ0LkhJREUsIHJlbGF0ZWRUYXJnZXQpO1xyXG4gICAgICAgICQocGFyZW50KS50cmlnZ2VyKGhpZGVFdmVudCk7XHJcblxyXG4gICAgICAgIGlmIChoaWRlRXZlbnQuaXNEZWZhdWx0UHJldmVudGVkKCkpIHtcclxuICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgIH0gLy8gSWYgdGhpcyBpcyBhIHRvdWNoLWVuYWJsZWQgZGV2aWNlIHdlIHJlbW92ZSB0aGUgZXh0cmFcclxuICAgICAgICAvLyBlbXB0eSBtb3VzZW92ZXIgbGlzdGVuZXJzIHdlIGFkZGVkIGZvciBpT1Mgc3VwcG9ydFxyXG5cclxuXHJcbiAgICAgICAgaWYgKCdvbnRvdWNoc3RhcnQnIGluIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkge1xyXG4gICAgICAgICAgJChkb2N1bWVudC5ib2R5KS5jaGlsZHJlbigpLm9mZignbW91c2VvdmVyJywgbnVsbCwgJC5ub29wKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRvZ2dsZXNbaV0uc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyk7XHJcbiAgICAgICAgJChkcm9wZG93bk1lbnUpLnJlbW92ZUNsYXNzKENsYXNzTmFtZSQ0LlNIT1cpO1xyXG4gICAgICAgICQocGFyZW50KS5yZW1vdmVDbGFzcyhDbGFzc05hbWUkNC5TSE9XKS50cmlnZ2VyKCQuRXZlbnQoRXZlbnQkNC5ISURERU4sIHJlbGF0ZWRUYXJnZXQpKTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBEcm9wZG93bi5fZ2V0UGFyZW50RnJvbUVsZW1lbnQgPSBmdW5jdGlvbiBfZ2V0UGFyZW50RnJvbUVsZW1lbnQoZWxlbWVudCkge1xyXG4gICAgICB2YXIgcGFyZW50O1xyXG4gICAgICB2YXIgc2VsZWN0b3IgPSBVdGlsLmdldFNlbGVjdG9yRnJvbUVsZW1lbnQoZWxlbWVudCk7XHJcblxyXG4gICAgICBpZiAoc2VsZWN0b3IpIHtcclxuICAgICAgICBwYXJlbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHBhcmVudCB8fCBlbGVtZW50LnBhcmVudE5vZGU7XHJcbiAgICB9OyAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgY29tcGxleGl0eVxyXG5cclxuXHJcbiAgICBEcm9wZG93bi5fZGF0YUFwaUtleWRvd25IYW5kbGVyID0gZnVuY3Rpb24gX2RhdGFBcGlLZXlkb3duSGFuZGxlcihldmVudCkge1xyXG4gICAgICAvLyBJZiBub3QgaW5wdXQvdGV4dGFyZWE6XHJcbiAgICAgIC8vICAtIEFuZCBub3QgYSBrZXkgaW4gUkVHRVhQX0tFWURPV04gPT4gbm90IGEgZHJvcGRvd24gY29tbWFuZFxyXG4gICAgICAvLyBJZiBpbnB1dC90ZXh0YXJlYTpcclxuICAgICAgLy8gIC0gSWYgc3BhY2Uga2V5ID0+IG5vdCBhIGRyb3Bkb3duIGNvbW1hbmRcclxuICAgICAgLy8gIC0gSWYga2V5IGlzIG90aGVyIHRoYW4gZXNjYXBlXHJcbiAgICAgIC8vICAgIC0gSWYga2V5IGlzIG5vdCB1cCBvciBkb3duID0+IG5vdCBhIGRyb3Bkb3duIGNvbW1hbmRcclxuICAgICAgLy8gICAgLSBJZiB0cmlnZ2VyIGluc2lkZSB0aGUgbWVudSA9PiBub3QgYSBkcm9wZG93biBjb21tYW5kXHJcbiAgICAgIGlmICgvaW5wdXR8dGV4dGFyZWEvaS50ZXN0KGV2ZW50LnRhcmdldC50YWdOYW1lKSA/IGV2ZW50LndoaWNoID09PSBTUEFDRV9LRVlDT0RFIHx8IGV2ZW50LndoaWNoICE9PSBFU0NBUEVfS0VZQ09ERSAmJiAoZXZlbnQud2hpY2ggIT09IEFSUk9XX0RPV05fS0VZQ09ERSAmJiBldmVudC53aGljaCAhPT0gQVJST1dfVVBfS0VZQ09ERSB8fCAkKGV2ZW50LnRhcmdldCkuY2xvc2VzdChTZWxlY3RvciQ0Lk1FTlUpLmxlbmd0aCkgOiAhUkVHRVhQX0tFWURPV04udGVzdChldmVudC53aGljaCkpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cclxuICAgICAgaWYgKHRoaXMuZGlzYWJsZWQgfHwgJCh0aGlzKS5oYXNDbGFzcyhDbGFzc05hbWUkNC5ESVNBQkxFRCkpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciBwYXJlbnQgPSBEcm9wZG93bi5fZ2V0UGFyZW50RnJvbUVsZW1lbnQodGhpcyk7XHJcblxyXG4gICAgICB2YXIgaXNBY3RpdmUgPSAkKHBhcmVudCkuaGFzQ2xhc3MoQ2xhc3NOYW1lJDQuU0hPVyk7XHJcblxyXG4gICAgICBpZiAoIWlzQWN0aXZlIHx8IGlzQWN0aXZlICYmIChldmVudC53aGljaCA9PT0gRVNDQVBFX0tFWUNPREUgfHwgZXZlbnQud2hpY2ggPT09IFNQQUNFX0tFWUNPREUpKSB7XHJcbiAgICAgICAgaWYgKGV2ZW50LndoaWNoID09PSBFU0NBUEVfS0VZQ09ERSkge1xyXG4gICAgICAgICAgdmFyIHRvZ2dsZSA9IHBhcmVudC5xdWVyeVNlbGVjdG9yKFNlbGVjdG9yJDQuREFUQV9UT0dHTEUpO1xyXG4gICAgICAgICAgJCh0b2dnbGUpLnRyaWdnZXIoJ2ZvY3VzJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkKHRoaXMpLnRyaWdnZXIoJ2NsaWNrJyk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB2YXIgaXRlbXMgPSBbXS5zbGljZS5jYWxsKHBhcmVudC5xdWVyeVNlbGVjdG9yQWxsKFNlbGVjdG9yJDQuVklTSUJMRV9JVEVNUykpO1xyXG5cclxuICAgICAgaWYgKGl0ZW1zLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgdmFyIGluZGV4ID0gaXRlbXMuaW5kZXhPZihldmVudC50YXJnZXQpO1xyXG5cclxuICAgICAgaWYgKGV2ZW50LndoaWNoID09PSBBUlJPV19VUF9LRVlDT0RFICYmIGluZGV4ID4gMCkge1xyXG4gICAgICAgIC8vIFVwXHJcbiAgICAgICAgaW5kZXgtLTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGV2ZW50LndoaWNoID09PSBBUlJPV19ET1dOX0tFWUNPREUgJiYgaW5kZXggPCBpdGVtcy5sZW5ndGggLSAxKSB7XHJcbiAgICAgICAgLy8gRG93blxyXG4gICAgICAgIGluZGV4Kys7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChpbmRleCA8IDApIHtcclxuICAgICAgICBpbmRleCA9IDA7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGl0ZW1zW2luZGV4XS5mb2N1cygpO1xyXG4gICAgfTtcclxuXHJcbiAgICBfY3JlYXRlQ2xhc3MoRHJvcGRvd24sIG51bGwsIFt7XHJcbiAgICAgIGtleTogXCJWRVJTSU9OXCIsXHJcbiAgICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xyXG4gICAgICAgIHJldHVybiBWRVJTSU9OJDQ7XHJcbiAgICAgIH1cclxuICAgIH0sIHtcclxuICAgICAga2V5OiBcIkRlZmF1bHRcIixcclxuICAgICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XHJcbiAgICAgICAgcmV0dXJuIERlZmF1bHQkMjtcclxuICAgICAgfVxyXG4gICAgfSwge1xyXG4gICAgICBrZXk6IFwiRGVmYXVsdFR5cGVcIixcclxuICAgICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XHJcbiAgICAgICAgcmV0dXJuIERlZmF1bHRUeXBlJDI7XHJcbiAgICAgIH1cclxuICAgIH1dKTtcclxuXHJcbiAgICByZXR1cm4gRHJvcGRvd247XHJcbiAgfSgpO1xyXG4gIC8qKlxyXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAqIERhdGEgQXBpIGltcGxlbWVudGF0aW9uXHJcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICovXHJcblxyXG5cclxuICAkKGRvY3VtZW50KS5vbihFdmVudCQ0LktFWURPV05fREFUQV9BUEksIFNlbGVjdG9yJDQuREFUQV9UT0dHTEUsIERyb3Bkb3duLl9kYXRhQXBpS2V5ZG93bkhhbmRsZXIpLm9uKEV2ZW50JDQuS0VZRE9XTl9EQVRBX0FQSSwgU2VsZWN0b3IkNC5NRU5VLCBEcm9wZG93bi5fZGF0YUFwaUtleWRvd25IYW5kbGVyKS5vbihFdmVudCQ0LkNMSUNLX0RBVEFfQVBJICsgXCIgXCIgKyBFdmVudCQ0LktFWVVQX0RBVEFfQVBJLCBEcm9wZG93bi5fY2xlYXJNZW51cykub24oRXZlbnQkNC5DTElDS19EQVRBX0FQSSwgU2VsZWN0b3IkNC5EQVRBX1RPR0dMRSwgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblxyXG4gICAgRHJvcGRvd24uX2pRdWVyeUludGVyZmFjZS5jYWxsKCQodGhpcyksICd0b2dnbGUnKTtcclxuICB9KS5vbihFdmVudCQ0LkNMSUNLX0RBVEFfQVBJLCBTZWxlY3RvciQ0LkZPUk1fQ0hJTEQsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gIH0pO1xyXG4gIC8qKlxyXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAqIGpRdWVyeVxyXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAqL1xyXG5cclxuICAkLmZuW05BTUUkNF0gPSBEcm9wZG93bi5falF1ZXJ5SW50ZXJmYWNlO1xyXG4gICQuZm5bTkFNRSQ0XS5Db25zdHJ1Y3RvciA9IERyb3Bkb3duO1xyXG5cclxuICAkLmZuW05BTUUkNF0ubm9Db25mbGljdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICQuZm5bTkFNRSQ0XSA9IEpRVUVSWV9OT19DT05GTElDVCQ0O1xyXG4gICAgcmV0dXJuIERyb3Bkb3duLl9qUXVlcnlJbnRlcmZhY2U7XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICogQ29uc3RhbnRzXHJcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICovXHJcblxyXG4gIHZhciBOQU1FJDUgPSAnbW9kYWwnO1xyXG4gIHZhciBWRVJTSU9OJDUgPSAnNC4yLjEnO1xyXG4gIHZhciBEQVRBX0tFWSQ1ID0gJ2JzLm1vZGFsJztcclxuICB2YXIgRVZFTlRfS0VZJDUgPSBcIi5cIiArIERBVEFfS0VZJDU7XHJcbiAgdmFyIERBVEFfQVBJX0tFWSQ1ID0gJy5kYXRhLWFwaSc7XHJcbiAgdmFyIEpRVUVSWV9OT19DT05GTElDVCQ1ID0gJC5mbltOQU1FJDVdO1xyXG4gIHZhciBFU0NBUEVfS0VZQ09ERSQxID0gMjc7IC8vIEtleWJvYXJkRXZlbnQud2hpY2ggdmFsdWUgZm9yIEVzY2FwZSAoRXNjKSBrZXlcclxuXHJcbiAgdmFyIERlZmF1bHQkMyA9IHtcclxuICAgIGJhY2tkcm9wOiB0cnVlLFxyXG4gICAga2V5Ym9hcmQ6IHRydWUsXHJcbiAgICBmb2N1czogdHJ1ZSxcclxuICAgIHNob3c6IHRydWVcclxuICB9O1xyXG4gIHZhciBEZWZhdWx0VHlwZSQzID0ge1xyXG4gICAgYmFja2Ryb3A6ICcoYm9vbGVhbnxzdHJpbmcpJyxcclxuICAgIGtleWJvYXJkOiAnYm9vbGVhbicsXHJcbiAgICBmb2N1czogJ2Jvb2xlYW4nLFxyXG4gICAgc2hvdzogJ2Jvb2xlYW4nXHJcbiAgfTtcclxuICB2YXIgRXZlbnQkNSA9IHtcclxuICAgIEhJREU6IFwiaGlkZVwiICsgRVZFTlRfS0VZJDUsXHJcbiAgICBISURERU46IFwiaGlkZGVuXCIgKyBFVkVOVF9LRVkkNSxcclxuICAgIFNIT1c6IFwic2hvd1wiICsgRVZFTlRfS0VZJDUsXHJcbiAgICBTSE9XTjogXCJzaG93blwiICsgRVZFTlRfS0VZJDUsXHJcbiAgICBGT0NVU0lOOiBcImZvY3VzaW5cIiArIEVWRU5UX0tFWSQ1LFxyXG4gICAgUkVTSVpFOiBcInJlc2l6ZVwiICsgRVZFTlRfS0VZJDUsXHJcbiAgICBDTElDS19ESVNNSVNTOiBcImNsaWNrLmRpc21pc3NcIiArIEVWRU5UX0tFWSQ1LFxyXG4gICAgS0VZRE9XTl9ESVNNSVNTOiBcImtleWRvd24uZGlzbWlzc1wiICsgRVZFTlRfS0VZJDUsXHJcbiAgICBNT1VTRVVQX0RJU01JU1M6IFwibW91c2V1cC5kaXNtaXNzXCIgKyBFVkVOVF9LRVkkNSxcclxuICAgIE1PVVNFRE9XTl9ESVNNSVNTOiBcIm1vdXNlZG93bi5kaXNtaXNzXCIgKyBFVkVOVF9LRVkkNSxcclxuICAgIENMSUNLX0RBVEFfQVBJOiBcImNsaWNrXCIgKyBFVkVOVF9LRVkkNSArIERBVEFfQVBJX0tFWSQ1XHJcbiAgfTtcclxuICB2YXIgQ2xhc3NOYW1lJDUgPSB7XHJcbiAgICBTQ1JPTExCQVJfTUVBU1VSRVI6ICdtb2RhbC1zY3JvbGxiYXItbWVhc3VyZScsXHJcbiAgICBCQUNLRFJPUDogJ21vZGFsLWJhY2tkcm9wJyxcclxuICAgIE9QRU46ICdtb2RhbC1vcGVuJyxcclxuICAgIEZBREU6ICdmYWRlJyxcclxuICAgIFNIT1c6ICdzaG93J1xyXG4gIH07XHJcbiAgdmFyIFNlbGVjdG9yJDUgPSB7XHJcbiAgICBESUFMT0c6ICcubW9kYWwtZGlhbG9nJyxcclxuICAgIERBVEFfVE9HR0xFOiAnW2RhdGEtdG9nZ2xlPVwibW9kYWxcIl0nLFxyXG4gICAgREFUQV9ESVNNSVNTOiAnW2RhdGEtZGlzbWlzcz1cIm1vZGFsXCJdJyxcclxuICAgIEZJWEVEX0NPTlRFTlQ6ICcuZml4ZWQtdG9wLCAuZml4ZWQtYm90dG9tLCAuaXMtZml4ZWQsIC5zdGlja3ktdG9wJyxcclxuICAgIFNUSUNLWV9DT05URU5UOiAnLnN0aWNreS10b3AnXHJcbiAgICAvKipcclxuICAgICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgICogQ2xhc3MgRGVmaW5pdGlvblxyXG4gICAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAgKi9cclxuXHJcbiAgfTtcclxuXHJcbiAgdmFyIE1vZGFsID1cclxuICAvKiNfX1BVUkVfXyovXHJcbiAgZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gTW9kYWwoZWxlbWVudCwgY29uZmlnKSB7XHJcbiAgICAgIHRoaXMuX2NvbmZpZyA9IHRoaXMuX2dldENvbmZpZyhjb25maWcpO1xyXG4gICAgICB0aGlzLl9lbGVtZW50ID0gZWxlbWVudDtcclxuICAgICAgdGhpcy5fZGlhbG9nID0gZWxlbWVudC5xdWVyeVNlbGVjdG9yKFNlbGVjdG9yJDUuRElBTE9HKTtcclxuICAgICAgdGhpcy5fYmFja2Ryb3AgPSBudWxsO1xyXG4gICAgICB0aGlzLl9pc1Nob3duID0gZmFsc2U7XHJcbiAgICAgIHRoaXMuX2lzQm9keU92ZXJmbG93aW5nID0gZmFsc2U7XHJcbiAgICAgIHRoaXMuX2lnbm9yZUJhY2tkcm9wQ2xpY2sgPSBmYWxzZTtcclxuICAgICAgdGhpcy5faXNUcmFuc2l0aW9uaW5nID0gZmFsc2U7XHJcbiAgICAgIHRoaXMuX3Njcm9sbGJhcldpZHRoID0gMDtcclxuICAgIH0gLy8gR2V0dGVyc1xyXG5cclxuXHJcbiAgICB2YXIgX3Byb3RvID0gTW9kYWwucHJvdG90eXBlO1xyXG5cclxuICAgIC8vIFB1YmxpY1xyXG4gICAgX3Byb3RvLnRvZ2dsZSA9IGZ1bmN0aW9uIHRvZ2dsZShyZWxhdGVkVGFyZ2V0KSB7XHJcbiAgICAgIHJldHVybiB0aGlzLl9pc1Nob3duID8gdGhpcy5oaWRlKCkgOiB0aGlzLnNob3cocmVsYXRlZFRhcmdldCk7XHJcbiAgICB9O1xyXG5cclxuICAgIF9wcm90by5zaG93ID0gZnVuY3Rpb24gc2hvdyhyZWxhdGVkVGFyZ2V0KSB7XHJcbiAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcblxyXG4gICAgICBpZiAodGhpcy5faXNTaG93biB8fCB0aGlzLl9pc1RyYW5zaXRpb25pbmcpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICgkKHRoaXMuX2VsZW1lbnQpLmhhc0NsYXNzKENsYXNzTmFtZSQ1LkZBREUpKSB7XHJcbiAgICAgICAgdGhpcy5faXNUcmFuc2l0aW9uaW5nID0gdHJ1ZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdmFyIHNob3dFdmVudCA9ICQuRXZlbnQoRXZlbnQkNS5TSE9XLCB7XHJcbiAgICAgICAgcmVsYXRlZFRhcmdldDogcmVsYXRlZFRhcmdldFxyXG4gICAgICB9KTtcclxuICAgICAgJCh0aGlzLl9lbGVtZW50KS50cmlnZ2VyKHNob3dFdmVudCk7XHJcblxyXG4gICAgICBpZiAodGhpcy5faXNTaG93biB8fCBzaG93RXZlbnQuaXNEZWZhdWx0UHJldmVudGVkKCkpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuX2lzU2hvd24gPSB0cnVlO1xyXG5cclxuICAgICAgdGhpcy5fY2hlY2tTY3JvbGxiYXIoKTtcclxuXHJcbiAgICAgIHRoaXMuX3NldFNjcm9sbGJhcigpO1xyXG5cclxuICAgICAgdGhpcy5fYWRqdXN0RGlhbG9nKCk7XHJcblxyXG4gICAgICB0aGlzLl9zZXRFc2NhcGVFdmVudCgpO1xyXG5cclxuICAgICAgdGhpcy5fc2V0UmVzaXplRXZlbnQoKTtcclxuXHJcbiAgICAgICQodGhpcy5fZWxlbWVudCkub24oRXZlbnQkNS5DTElDS19ESVNNSVNTLCBTZWxlY3RvciQ1LkRBVEFfRElTTUlTUywgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgcmV0dXJuIF90aGlzLmhpZGUoZXZlbnQpO1xyXG4gICAgICB9KTtcclxuICAgICAgJCh0aGlzLl9kaWFsb2cpLm9uKEV2ZW50JDUuTU9VU0VET1dOX0RJU01JU1MsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAkKF90aGlzLl9lbGVtZW50KS5vbmUoRXZlbnQkNS5NT1VTRVVQX0RJU01JU1MsIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgICAgaWYgKCQoZXZlbnQudGFyZ2V0KS5pcyhfdGhpcy5fZWxlbWVudCkpIHtcclxuICAgICAgICAgICAgX3RoaXMuX2lnbm9yZUJhY2tkcm9wQ2xpY2sgPSB0cnVlO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHRoaXMuX3Nob3dCYWNrZHJvcChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIF90aGlzLl9zaG93RWxlbWVudChyZWxhdGVkVGFyZ2V0KTtcclxuICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIF9wcm90by5oaWRlID0gZnVuY3Rpb24gaGlkZShldmVudCkge1xyXG4gICAgICB2YXIgX3RoaXMyID0gdGhpcztcclxuXHJcbiAgICAgIGlmIChldmVudCkge1xyXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICghdGhpcy5faXNTaG93biB8fCB0aGlzLl9pc1RyYW5zaXRpb25pbmcpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciBoaWRlRXZlbnQgPSAkLkV2ZW50KEV2ZW50JDUuSElERSk7XHJcbiAgICAgICQodGhpcy5fZWxlbWVudCkudHJpZ2dlcihoaWRlRXZlbnQpO1xyXG5cclxuICAgICAgaWYgKCF0aGlzLl9pc1Nob3duIHx8IGhpZGVFdmVudC5pc0RlZmF1bHRQcmV2ZW50ZWQoKSkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5faXNTaG93biA9IGZhbHNlO1xyXG4gICAgICB2YXIgdHJhbnNpdGlvbiA9ICQodGhpcy5fZWxlbWVudCkuaGFzQ2xhc3MoQ2xhc3NOYW1lJDUuRkFERSk7XHJcblxyXG4gICAgICBpZiAodHJhbnNpdGlvbikge1xyXG4gICAgICAgIHRoaXMuX2lzVHJhbnNpdGlvbmluZyA9IHRydWU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuX3NldEVzY2FwZUV2ZW50KCk7XHJcblxyXG4gICAgICB0aGlzLl9zZXRSZXNpemVFdmVudCgpO1xyXG5cclxuICAgICAgJChkb2N1bWVudCkub2ZmKEV2ZW50JDUuRk9DVVNJTik7XHJcbiAgICAgICQodGhpcy5fZWxlbWVudCkucmVtb3ZlQ2xhc3MoQ2xhc3NOYW1lJDUuU0hPVyk7XHJcbiAgICAgICQodGhpcy5fZWxlbWVudCkub2ZmKEV2ZW50JDUuQ0xJQ0tfRElTTUlTUyk7XHJcbiAgICAgICQodGhpcy5fZGlhbG9nKS5vZmYoRXZlbnQkNS5NT1VTRURPV05fRElTTUlTUyk7XHJcblxyXG4gICAgICBpZiAodHJhbnNpdGlvbikge1xyXG4gICAgICAgIHZhciB0cmFuc2l0aW9uRHVyYXRpb24gPSBVdGlsLmdldFRyYW5zaXRpb25EdXJhdGlvbkZyb21FbGVtZW50KHRoaXMuX2VsZW1lbnQpO1xyXG4gICAgICAgICQodGhpcy5fZWxlbWVudCkub25lKFV0aWwuVFJBTlNJVElPTl9FTkQsIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgICAgcmV0dXJuIF90aGlzMi5faGlkZU1vZGFsKGV2ZW50KTtcclxuICAgICAgICB9KS5lbXVsYXRlVHJhbnNpdGlvbkVuZCh0cmFuc2l0aW9uRHVyYXRpb24pO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuX2hpZGVNb2RhbCgpO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIF9wcm90by5kaXNwb3NlID0gZnVuY3Rpb24gZGlzcG9zZSgpIHtcclxuICAgICAgW3dpbmRvdywgdGhpcy5fZWxlbWVudCwgdGhpcy5fZGlhbG9nXS5mb3JFYWNoKGZ1bmN0aW9uIChodG1sRWxlbWVudCkge1xyXG4gICAgICAgIHJldHVybiAkKGh0bWxFbGVtZW50KS5vZmYoRVZFTlRfS0VZJDUpO1xyXG4gICAgICB9KTtcclxuICAgICAgLyoqXHJcbiAgICAgICAqIGBkb2N1bWVudGAgaGFzIDIgZXZlbnRzIGBFdmVudC5GT0NVU0lOYCBhbmQgYEV2ZW50LkNMSUNLX0RBVEFfQVBJYFxyXG4gICAgICAgKiBEbyBub3QgbW92ZSBgZG9jdW1lbnRgIGluIGBodG1sRWxlbWVudHNgIGFycmF5XHJcbiAgICAgICAqIEl0IHdpbGwgcmVtb3ZlIGBFdmVudC5DTElDS19EQVRBX0FQSWAgZXZlbnQgdGhhdCBzaG91bGQgcmVtYWluXHJcbiAgICAgICAqL1xyXG5cclxuICAgICAgJChkb2N1bWVudCkub2ZmKEV2ZW50JDUuRk9DVVNJTik7XHJcbiAgICAgICQucmVtb3ZlRGF0YSh0aGlzLl9lbGVtZW50LCBEQVRBX0tFWSQ1KTtcclxuICAgICAgdGhpcy5fY29uZmlnID0gbnVsbDtcclxuICAgICAgdGhpcy5fZWxlbWVudCA9IG51bGw7XHJcbiAgICAgIHRoaXMuX2RpYWxvZyA9IG51bGw7XHJcbiAgICAgIHRoaXMuX2JhY2tkcm9wID0gbnVsbDtcclxuICAgICAgdGhpcy5faXNTaG93biA9IG51bGw7XHJcbiAgICAgIHRoaXMuX2lzQm9keU92ZXJmbG93aW5nID0gbnVsbDtcclxuICAgICAgdGhpcy5faWdub3JlQmFja2Ryb3BDbGljayA9IG51bGw7XHJcbiAgICAgIHRoaXMuX2lzVHJhbnNpdGlvbmluZyA9IG51bGw7XHJcbiAgICAgIHRoaXMuX3Njcm9sbGJhcldpZHRoID0gbnVsbDtcclxuICAgIH07XHJcblxyXG4gICAgX3Byb3RvLmhhbmRsZVVwZGF0ZSA9IGZ1bmN0aW9uIGhhbmRsZVVwZGF0ZSgpIHtcclxuICAgICAgdGhpcy5fYWRqdXN0RGlhbG9nKCk7XHJcbiAgICB9OyAvLyBQcml2YXRlXHJcblxyXG5cclxuICAgIF9wcm90by5fZ2V0Q29uZmlnID0gZnVuY3Rpb24gX2dldENvbmZpZyhjb25maWcpIHtcclxuICAgICAgY29uZmlnID0gX29iamVjdFNwcmVhZCh7fSwgRGVmYXVsdCQzLCBjb25maWcpO1xyXG4gICAgICBVdGlsLnR5cGVDaGVja0NvbmZpZyhOQU1FJDUsIGNvbmZpZywgRGVmYXVsdFR5cGUkMyk7XHJcbiAgICAgIHJldHVybiBjb25maWc7XHJcbiAgICB9O1xyXG5cclxuICAgIF9wcm90by5fc2hvd0VsZW1lbnQgPSBmdW5jdGlvbiBfc2hvd0VsZW1lbnQocmVsYXRlZFRhcmdldCkge1xyXG4gICAgICB2YXIgX3RoaXMzID0gdGhpcztcclxuXHJcbiAgICAgIHZhciB0cmFuc2l0aW9uID0gJCh0aGlzLl9lbGVtZW50KS5oYXNDbGFzcyhDbGFzc05hbWUkNS5GQURFKTtcclxuXHJcbiAgICAgIGlmICghdGhpcy5fZWxlbWVudC5wYXJlbnROb2RlIHx8IHRoaXMuX2VsZW1lbnQucGFyZW50Tm9kZS5ub2RlVHlwZSAhPT0gTm9kZS5FTEVNRU5UX05PREUpIHtcclxuICAgICAgICAvLyBEb24ndCBtb3ZlIG1vZGFsJ3MgRE9NIHBvc2l0aW9uXHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLl9lbGVtZW50KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcclxuXHJcbiAgICAgIHRoaXMuX2VsZW1lbnQucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWhpZGRlbicpO1xyXG5cclxuICAgICAgdGhpcy5fZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtbW9kYWwnLCB0cnVlKTtcclxuXHJcbiAgICAgIHRoaXMuX2VsZW1lbnQuc2Nyb2xsVG9wID0gMDtcclxuXHJcbiAgICAgIGlmICh0cmFuc2l0aW9uKSB7XHJcbiAgICAgICAgVXRpbC5yZWZsb3codGhpcy5fZWxlbWVudCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgICQodGhpcy5fZWxlbWVudCkuYWRkQ2xhc3MoQ2xhc3NOYW1lJDUuU0hPVyk7XHJcblxyXG4gICAgICBpZiAodGhpcy5fY29uZmlnLmZvY3VzKSB7XHJcbiAgICAgICAgdGhpcy5fZW5mb3JjZUZvY3VzKCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciBzaG93bkV2ZW50ID0gJC5FdmVudChFdmVudCQ1LlNIT1dOLCB7XHJcbiAgICAgICAgcmVsYXRlZFRhcmdldDogcmVsYXRlZFRhcmdldFxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHZhciB0cmFuc2l0aW9uQ29tcGxldGUgPSBmdW5jdGlvbiB0cmFuc2l0aW9uQ29tcGxldGUoKSB7XHJcbiAgICAgICAgaWYgKF90aGlzMy5fY29uZmlnLmZvY3VzKSB7XHJcbiAgICAgICAgICBfdGhpczMuX2VsZW1lbnQuZm9jdXMoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIF90aGlzMy5faXNUcmFuc2l0aW9uaW5nID0gZmFsc2U7XHJcbiAgICAgICAgJChfdGhpczMuX2VsZW1lbnQpLnRyaWdnZXIoc2hvd25FdmVudCk7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICBpZiAodHJhbnNpdGlvbikge1xyXG4gICAgICAgIHZhciB0cmFuc2l0aW9uRHVyYXRpb24gPSBVdGlsLmdldFRyYW5zaXRpb25EdXJhdGlvbkZyb21FbGVtZW50KHRoaXMuX2RpYWxvZyk7XHJcbiAgICAgICAgJCh0aGlzLl9kaWFsb2cpLm9uZShVdGlsLlRSQU5TSVRJT05fRU5ELCB0cmFuc2l0aW9uQ29tcGxldGUpLmVtdWxhdGVUcmFuc2l0aW9uRW5kKHRyYW5zaXRpb25EdXJhdGlvbik7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdHJhbnNpdGlvbkNvbXBsZXRlKCk7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgX3Byb3RvLl9lbmZvcmNlRm9jdXMgPSBmdW5jdGlvbiBfZW5mb3JjZUZvY3VzKCkge1xyXG4gICAgICB2YXIgX3RoaXM0ID0gdGhpcztcclxuXHJcbiAgICAgICQoZG9jdW1lbnQpLm9mZihFdmVudCQ1LkZPQ1VTSU4pIC8vIEd1YXJkIGFnYWluc3QgaW5maW5pdGUgZm9jdXMgbG9vcFxyXG4gICAgICAub24oRXZlbnQkNS5GT0NVU0lOLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICBpZiAoZG9jdW1lbnQgIT09IGV2ZW50LnRhcmdldCAmJiBfdGhpczQuX2VsZW1lbnQgIT09IGV2ZW50LnRhcmdldCAmJiAkKF90aGlzNC5fZWxlbWVudCkuaGFzKGV2ZW50LnRhcmdldCkubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICBfdGhpczQuX2VsZW1lbnQuZm9jdXMoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICBfcHJvdG8uX3NldEVzY2FwZUV2ZW50ID0gZnVuY3Rpb24gX3NldEVzY2FwZUV2ZW50KCkge1xyXG4gICAgICB2YXIgX3RoaXM1ID0gdGhpcztcclxuXHJcbiAgICAgIGlmICh0aGlzLl9pc1Nob3duICYmIHRoaXMuX2NvbmZpZy5rZXlib2FyZCkge1xyXG4gICAgICAgICQodGhpcy5fZWxlbWVudCkub24oRXZlbnQkNS5LRVlET1dOX0RJU01JU1MsIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgICAgaWYgKGV2ZW50LndoaWNoID09PSBFU0NBUEVfS0VZQ09ERSQxKSB7XHJcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgICAgICBfdGhpczUuaGlkZSgpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9IGVsc2UgaWYgKCF0aGlzLl9pc1Nob3duKSB7XHJcbiAgICAgICAgJCh0aGlzLl9lbGVtZW50KS5vZmYoRXZlbnQkNS5LRVlET1dOX0RJU01JU1MpO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIF9wcm90by5fc2V0UmVzaXplRXZlbnQgPSBmdW5jdGlvbiBfc2V0UmVzaXplRXZlbnQoKSB7XHJcbiAgICAgIHZhciBfdGhpczYgPSB0aGlzO1xyXG5cclxuICAgICAgaWYgKHRoaXMuX2lzU2hvd24pIHtcclxuICAgICAgICAkKHdpbmRvdykub24oRXZlbnQkNS5SRVNJWkUsIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgICAgcmV0dXJuIF90aGlzNi5oYW5kbGVVcGRhdGUoZXZlbnQpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgICQod2luZG93KS5vZmYoRXZlbnQkNS5SRVNJWkUpO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIF9wcm90by5faGlkZU1vZGFsID0gZnVuY3Rpb24gX2hpZGVNb2RhbCgpIHtcclxuICAgICAgdmFyIF90aGlzNyA9IHRoaXM7XHJcblxyXG4gICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcblxyXG4gICAgICB0aGlzLl9lbGVtZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCB0cnVlKTtcclxuXHJcbiAgICAgIHRoaXMuX2VsZW1lbnQucmVtb3ZlQXR0cmlidXRlKCdhcmlhLW1vZGFsJyk7XHJcblxyXG4gICAgICB0aGlzLl9pc1RyYW5zaXRpb25pbmcgPSBmYWxzZTtcclxuXHJcbiAgICAgIHRoaXMuX3Nob3dCYWNrZHJvcChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgJChkb2N1bWVudC5ib2R5KS5yZW1vdmVDbGFzcyhDbGFzc05hbWUkNS5PUEVOKTtcclxuXHJcbiAgICAgICAgX3RoaXM3Ll9yZXNldEFkanVzdG1lbnRzKCk7XHJcblxyXG4gICAgICAgIF90aGlzNy5fcmVzZXRTY3JvbGxiYXIoKTtcclxuXHJcbiAgICAgICAgJChfdGhpczcuX2VsZW1lbnQpLnRyaWdnZXIoRXZlbnQkNS5ISURERU4pO1xyXG4gICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgX3Byb3RvLl9yZW1vdmVCYWNrZHJvcCA9IGZ1bmN0aW9uIF9yZW1vdmVCYWNrZHJvcCgpIHtcclxuICAgICAgaWYgKHRoaXMuX2JhY2tkcm9wKSB7XHJcbiAgICAgICAgJCh0aGlzLl9iYWNrZHJvcCkucmVtb3ZlKCk7XHJcbiAgICAgICAgdGhpcy5fYmFja2Ryb3AgPSBudWxsO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIF9wcm90by5fc2hvd0JhY2tkcm9wID0gZnVuY3Rpb24gX3Nob3dCYWNrZHJvcChjYWxsYmFjaykge1xyXG4gICAgICB2YXIgX3RoaXM4ID0gdGhpcztcclxuXHJcbiAgICAgIHZhciBhbmltYXRlID0gJCh0aGlzLl9lbGVtZW50KS5oYXNDbGFzcyhDbGFzc05hbWUkNS5GQURFKSA/IENsYXNzTmFtZSQ1LkZBREUgOiAnJztcclxuXHJcbiAgICAgIGlmICh0aGlzLl9pc1Nob3duICYmIHRoaXMuX2NvbmZpZy5iYWNrZHJvcCkge1xyXG4gICAgICAgIHRoaXMuX2JhY2tkcm9wID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgdGhpcy5fYmFja2Ryb3AuY2xhc3NOYW1lID0gQ2xhc3NOYW1lJDUuQkFDS0RST1A7XHJcblxyXG4gICAgICAgIGlmIChhbmltYXRlKSB7XHJcbiAgICAgICAgICB0aGlzLl9iYWNrZHJvcC5jbGFzc0xpc3QuYWRkKGFuaW1hdGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJCh0aGlzLl9iYWNrZHJvcCkuYXBwZW5kVG8oZG9jdW1lbnQuYm9keSk7XHJcbiAgICAgICAgJCh0aGlzLl9lbGVtZW50KS5vbihFdmVudCQ1LkNMSUNLX0RJU01JU1MsIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgICAgaWYgKF90aGlzOC5faWdub3JlQmFja2Ryb3BDbGljaykge1xyXG4gICAgICAgICAgICBfdGhpczguX2lnbm9yZUJhY2tkcm9wQ2xpY2sgPSBmYWxzZTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGlmIChldmVudC50YXJnZXQgIT09IGV2ZW50LmN1cnJlbnRUYXJnZXQpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGlmIChfdGhpczguX2NvbmZpZy5iYWNrZHJvcCA9PT0gJ3N0YXRpYycpIHtcclxuICAgICAgICAgICAgX3RoaXM4Ll9lbGVtZW50LmZvY3VzKCk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBfdGhpczguaGlkZSgpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpZiAoYW5pbWF0ZSkge1xyXG4gICAgICAgICAgVXRpbC5yZWZsb3codGhpcy5fYmFja2Ryb3ApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJCh0aGlzLl9iYWNrZHJvcCkuYWRkQ2xhc3MoQ2xhc3NOYW1lJDUuU0hPVyk7XHJcblxyXG4gICAgICAgIGlmICghY2FsbGJhY2spIHtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghYW5pbWF0ZSkge1xyXG4gICAgICAgICAgY2FsbGJhY2soKTtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBiYWNrZHJvcFRyYW5zaXRpb25EdXJhdGlvbiA9IFV0aWwuZ2V0VHJhbnNpdGlvbkR1cmF0aW9uRnJvbUVsZW1lbnQodGhpcy5fYmFja2Ryb3ApO1xyXG4gICAgICAgICQodGhpcy5fYmFja2Ryb3ApLm9uZShVdGlsLlRSQU5TSVRJT05fRU5ELCBjYWxsYmFjaykuZW11bGF0ZVRyYW5zaXRpb25FbmQoYmFja2Ryb3BUcmFuc2l0aW9uRHVyYXRpb24pO1xyXG4gICAgICB9IGVsc2UgaWYgKCF0aGlzLl9pc1Nob3duICYmIHRoaXMuX2JhY2tkcm9wKSB7XHJcbiAgICAgICAgJCh0aGlzLl9iYWNrZHJvcCkucmVtb3ZlQ2xhc3MoQ2xhc3NOYW1lJDUuU0hPVyk7XHJcblxyXG4gICAgICAgIHZhciBjYWxsYmFja1JlbW92ZSA9IGZ1bmN0aW9uIGNhbGxiYWNrUmVtb3ZlKCkge1xyXG4gICAgICAgICAgX3RoaXM4Ll9yZW1vdmVCYWNrZHJvcCgpO1xyXG5cclxuICAgICAgICAgIGlmIChjYWxsYmFjaykge1xyXG4gICAgICAgICAgICBjYWxsYmFjaygpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGlmICgkKHRoaXMuX2VsZW1lbnQpLmhhc0NsYXNzKENsYXNzTmFtZSQ1LkZBREUpKSB7XHJcbiAgICAgICAgICB2YXIgX2JhY2tkcm9wVHJhbnNpdGlvbkR1cmF0aW9uID0gVXRpbC5nZXRUcmFuc2l0aW9uRHVyYXRpb25Gcm9tRWxlbWVudCh0aGlzLl9iYWNrZHJvcCk7XHJcblxyXG4gICAgICAgICAgJCh0aGlzLl9iYWNrZHJvcCkub25lKFV0aWwuVFJBTlNJVElPTl9FTkQsIGNhbGxiYWNrUmVtb3ZlKS5lbXVsYXRlVHJhbnNpdGlvbkVuZChfYmFja2Ryb3BUcmFuc2l0aW9uRHVyYXRpb24pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBjYWxsYmFja1JlbW92ZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIGlmIChjYWxsYmFjaykge1xyXG4gICAgICAgIGNhbGxiYWNrKCk7XHJcbiAgICAgIH1cclxuICAgIH07IC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIC8vIHRoZSBmb2xsb3dpbmcgbWV0aG9kcyBhcmUgdXNlZCB0byBoYW5kbGUgb3ZlcmZsb3dpbmcgbW9kYWxzXHJcbiAgICAvLyB0b2RvIChmYXQpOiB0aGVzZSBzaG91bGQgcHJvYmFibHkgYmUgcmVmYWN0b3JlZCBvdXQgb2YgbW9kYWwuanNcclxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcblxyXG4gICAgX3Byb3RvLl9hZGp1c3REaWFsb2cgPSBmdW5jdGlvbiBfYWRqdXN0RGlhbG9nKCkge1xyXG4gICAgICB2YXIgaXNNb2RhbE92ZXJmbG93aW5nID0gdGhpcy5fZWxlbWVudC5zY3JvbGxIZWlnaHQgPiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0O1xyXG5cclxuICAgICAgaWYgKCF0aGlzLl9pc0JvZHlPdmVyZmxvd2luZyAmJiBpc01vZGFsT3ZlcmZsb3dpbmcpIHtcclxuICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLnBhZGRpbmdMZWZ0ID0gdGhpcy5fc2Nyb2xsYmFyV2lkdGggKyBcInB4XCI7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICh0aGlzLl9pc0JvZHlPdmVyZmxvd2luZyAmJiAhaXNNb2RhbE92ZXJmbG93aW5nKSB7XHJcbiAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS5wYWRkaW5nUmlnaHQgPSB0aGlzLl9zY3JvbGxiYXJXaWR0aCArIFwicHhcIjtcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBfcHJvdG8uX3Jlc2V0QWRqdXN0bWVudHMgPSBmdW5jdGlvbiBfcmVzZXRBZGp1c3RtZW50cygpIHtcclxuICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS5wYWRkaW5nTGVmdCA9ICcnO1xyXG4gICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLnBhZGRpbmdSaWdodCA9ICcnO1xyXG4gICAgfTtcclxuXHJcbiAgICBfcHJvdG8uX2NoZWNrU2Nyb2xsYmFyID0gZnVuY3Rpb24gX2NoZWNrU2Nyb2xsYmFyKCkge1xyXG4gICAgICB2YXIgcmVjdCA9IGRvY3VtZW50LmJvZHkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICAgIHRoaXMuX2lzQm9keU92ZXJmbG93aW5nID0gcmVjdC5sZWZ0ICsgcmVjdC5yaWdodCA8IHdpbmRvdy5pbm5lcldpZHRoO1xyXG4gICAgICB0aGlzLl9zY3JvbGxiYXJXaWR0aCA9IHRoaXMuX2dldFNjcm9sbGJhcldpZHRoKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIF9wcm90by5fc2V0U2Nyb2xsYmFyID0gZnVuY3Rpb24gX3NldFNjcm9sbGJhcigpIHtcclxuICAgICAgdmFyIF90aGlzOSA9IHRoaXM7XHJcblxyXG4gICAgICBpZiAodGhpcy5faXNCb2R5T3ZlcmZsb3dpbmcpIHtcclxuICAgICAgICAvLyBOb3RlOiBET01Ob2RlLnN0eWxlLnBhZGRpbmdSaWdodCByZXR1cm5zIHRoZSBhY3R1YWwgdmFsdWUgb3IgJycgaWYgbm90IHNldFxyXG4gICAgICAgIC8vICAgd2hpbGUgJChET01Ob2RlKS5jc3MoJ3BhZGRpbmctcmlnaHQnKSByZXR1cm5zIHRoZSBjYWxjdWxhdGVkIHZhbHVlIG9yIDAgaWYgbm90IHNldFxyXG4gICAgICAgIHZhciBmaXhlZENvbnRlbnQgPSBbXS5zbGljZS5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoU2VsZWN0b3IkNS5GSVhFRF9DT05URU5UKSk7XHJcbiAgICAgICAgdmFyIHN0aWNreUNvbnRlbnQgPSBbXS5zbGljZS5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoU2VsZWN0b3IkNS5TVElDS1lfQ09OVEVOVCkpOyAvLyBBZGp1c3QgZml4ZWQgY29udGVudCBwYWRkaW5nXHJcblxyXG4gICAgICAgICQoZml4ZWRDb250ZW50KS5lYWNoKGZ1bmN0aW9uIChpbmRleCwgZWxlbWVudCkge1xyXG4gICAgICAgICAgdmFyIGFjdHVhbFBhZGRpbmcgPSBlbGVtZW50LnN0eWxlLnBhZGRpbmdSaWdodDtcclxuICAgICAgICAgIHZhciBjYWxjdWxhdGVkUGFkZGluZyA9ICQoZWxlbWVudCkuY3NzKCdwYWRkaW5nLXJpZ2h0Jyk7XHJcbiAgICAgICAgICAkKGVsZW1lbnQpLmRhdGEoJ3BhZGRpbmctcmlnaHQnLCBhY3R1YWxQYWRkaW5nKS5jc3MoJ3BhZGRpbmctcmlnaHQnLCBwYXJzZUZsb2F0KGNhbGN1bGF0ZWRQYWRkaW5nKSArIF90aGlzOS5fc2Nyb2xsYmFyV2lkdGggKyBcInB4XCIpO1xyXG4gICAgICAgIH0pOyAvLyBBZGp1c3Qgc3RpY2t5IGNvbnRlbnQgbWFyZ2luXHJcblxyXG4gICAgICAgICQoc3RpY2t5Q29udGVudCkuZWFjaChmdW5jdGlvbiAoaW5kZXgsIGVsZW1lbnQpIHtcclxuICAgICAgICAgIHZhciBhY3R1YWxNYXJnaW4gPSBlbGVtZW50LnN0eWxlLm1hcmdpblJpZ2h0O1xyXG4gICAgICAgICAgdmFyIGNhbGN1bGF0ZWRNYXJnaW4gPSAkKGVsZW1lbnQpLmNzcygnbWFyZ2luLXJpZ2h0Jyk7XHJcbiAgICAgICAgICAkKGVsZW1lbnQpLmRhdGEoJ21hcmdpbi1yaWdodCcsIGFjdHVhbE1hcmdpbikuY3NzKCdtYXJnaW4tcmlnaHQnLCBwYXJzZUZsb2F0KGNhbGN1bGF0ZWRNYXJnaW4pIC0gX3RoaXM5Ll9zY3JvbGxiYXJXaWR0aCArIFwicHhcIik7XHJcbiAgICAgICAgfSk7IC8vIEFkanVzdCBib2R5IHBhZGRpbmdcclxuXHJcbiAgICAgICAgdmFyIGFjdHVhbFBhZGRpbmcgPSBkb2N1bWVudC5ib2R5LnN0eWxlLnBhZGRpbmdSaWdodDtcclxuICAgICAgICB2YXIgY2FsY3VsYXRlZFBhZGRpbmcgPSAkKGRvY3VtZW50LmJvZHkpLmNzcygncGFkZGluZy1yaWdodCcpO1xyXG4gICAgICAgICQoZG9jdW1lbnQuYm9keSkuZGF0YSgncGFkZGluZy1yaWdodCcsIGFjdHVhbFBhZGRpbmcpLmNzcygncGFkZGluZy1yaWdodCcsIHBhcnNlRmxvYXQoY2FsY3VsYXRlZFBhZGRpbmcpICsgdGhpcy5fc2Nyb2xsYmFyV2lkdGggKyBcInB4XCIpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAkKGRvY3VtZW50LmJvZHkpLmFkZENsYXNzKENsYXNzTmFtZSQ1Lk9QRU4pO1xyXG4gICAgfTtcclxuXHJcbiAgICBfcHJvdG8uX3Jlc2V0U2Nyb2xsYmFyID0gZnVuY3Rpb24gX3Jlc2V0U2Nyb2xsYmFyKCkge1xyXG4gICAgICAvLyBSZXN0b3JlIGZpeGVkIGNvbnRlbnQgcGFkZGluZ1xyXG4gICAgICB2YXIgZml4ZWRDb250ZW50ID0gW10uc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFNlbGVjdG9yJDUuRklYRURfQ09OVEVOVCkpO1xyXG4gICAgICAkKGZpeGVkQ29udGVudCkuZWFjaChmdW5jdGlvbiAoaW5kZXgsIGVsZW1lbnQpIHtcclxuICAgICAgICB2YXIgcGFkZGluZyA9ICQoZWxlbWVudCkuZGF0YSgncGFkZGluZy1yaWdodCcpO1xyXG4gICAgICAgICQoZWxlbWVudCkucmVtb3ZlRGF0YSgncGFkZGluZy1yaWdodCcpO1xyXG4gICAgICAgIGVsZW1lbnQuc3R5bGUucGFkZGluZ1JpZ2h0ID0gcGFkZGluZyA/IHBhZGRpbmcgOiAnJztcclxuICAgICAgfSk7IC8vIFJlc3RvcmUgc3RpY2t5IGNvbnRlbnRcclxuXHJcbiAgICAgIHZhciBlbGVtZW50cyA9IFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIlwiICsgU2VsZWN0b3IkNS5TVElDS1lfQ09OVEVOVCkpO1xyXG4gICAgICAkKGVsZW1lbnRzKS5lYWNoKGZ1bmN0aW9uIChpbmRleCwgZWxlbWVudCkge1xyXG4gICAgICAgIHZhciBtYXJnaW4gPSAkKGVsZW1lbnQpLmRhdGEoJ21hcmdpbi1yaWdodCcpO1xyXG5cclxuICAgICAgICBpZiAodHlwZW9mIG1hcmdpbiAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICQoZWxlbWVudCkuY3NzKCdtYXJnaW4tcmlnaHQnLCBtYXJnaW4pLnJlbW92ZURhdGEoJ21hcmdpbi1yaWdodCcpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7IC8vIFJlc3RvcmUgYm9keSBwYWRkaW5nXHJcblxyXG4gICAgICB2YXIgcGFkZGluZyA9ICQoZG9jdW1lbnQuYm9keSkuZGF0YSgncGFkZGluZy1yaWdodCcpO1xyXG4gICAgICAkKGRvY3VtZW50LmJvZHkpLnJlbW92ZURhdGEoJ3BhZGRpbmctcmlnaHQnKTtcclxuICAgICAgZG9jdW1lbnQuYm9keS5zdHlsZS5wYWRkaW5nUmlnaHQgPSBwYWRkaW5nID8gcGFkZGluZyA6ICcnO1xyXG4gICAgfTtcclxuXHJcbiAgICBfcHJvdG8uX2dldFNjcm9sbGJhcldpZHRoID0gZnVuY3Rpb24gX2dldFNjcm9sbGJhcldpZHRoKCkge1xyXG4gICAgICAvLyB0aHggZC53YWxzaFxyXG4gICAgICB2YXIgc2Nyb2xsRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgIHNjcm9sbERpdi5jbGFzc05hbWUgPSBDbGFzc05hbWUkNS5TQ1JPTExCQVJfTUVBU1VSRVI7XHJcbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoc2Nyb2xsRGl2KTtcclxuICAgICAgdmFyIHNjcm9sbGJhcldpZHRoID0gc2Nyb2xsRGl2LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoIC0gc2Nyb2xsRGl2LmNsaWVudFdpZHRoO1xyXG4gICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKHNjcm9sbERpdik7XHJcbiAgICAgIHJldHVybiBzY3JvbGxiYXJXaWR0aDtcclxuICAgIH07IC8vIFN0YXRpY1xyXG5cclxuXHJcbiAgICBNb2RhbC5falF1ZXJ5SW50ZXJmYWNlID0gZnVuY3Rpb24gX2pRdWVyeUludGVyZmFjZShjb25maWcsIHJlbGF0ZWRUYXJnZXQpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGRhdGEgPSAkKHRoaXMpLmRhdGEoREFUQV9LRVkkNSk7XHJcblxyXG4gICAgICAgIHZhciBfY29uZmlnID0gX29iamVjdFNwcmVhZCh7fSwgRGVmYXVsdCQzLCAkKHRoaXMpLmRhdGEoKSwgdHlwZW9mIGNvbmZpZyA9PT0gJ29iamVjdCcgJiYgY29uZmlnID8gY29uZmlnIDoge30pO1xyXG5cclxuICAgICAgICBpZiAoIWRhdGEpIHtcclxuICAgICAgICAgIGRhdGEgPSBuZXcgTW9kYWwodGhpcywgX2NvbmZpZyk7XHJcbiAgICAgICAgICAkKHRoaXMpLmRhdGEoREFUQV9LRVkkNSwgZGF0YSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodHlwZW9mIGNvbmZpZyA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgIGlmICh0eXBlb2YgZGF0YVtjb25maWddID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiTm8gbWV0aG9kIG5hbWVkIFxcXCJcIiArIGNvbmZpZyArIFwiXFxcIlwiKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBkYXRhW2NvbmZpZ10ocmVsYXRlZFRhcmdldCk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChfY29uZmlnLnNob3cpIHtcclxuICAgICAgICAgIGRhdGEuc2hvdyhyZWxhdGVkVGFyZ2V0KTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICBfY3JlYXRlQ2xhc3MoTW9kYWwsIG51bGwsIFt7XHJcbiAgICAgIGtleTogXCJWRVJTSU9OXCIsXHJcbiAgICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xyXG4gICAgICAgIHJldHVybiBWRVJTSU9OJDU7XHJcbiAgICAgIH1cclxuICAgIH0sIHtcclxuICAgICAga2V5OiBcIkRlZmF1bHRcIixcclxuICAgICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XHJcbiAgICAgICAgcmV0dXJuIERlZmF1bHQkMztcclxuICAgICAgfVxyXG4gICAgfV0pO1xyXG5cclxuICAgIHJldHVybiBNb2RhbDtcclxuICB9KCk7XHJcbiAgLyoqXHJcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICogRGF0YSBBcGkgaW1wbGVtZW50YXRpb25cclxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgKi9cclxuXHJcblxyXG4gICQoZG9jdW1lbnQpLm9uKEV2ZW50JDUuQ0xJQ0tfREFUQV9BUEksIFNlbGVjdG9yJDUuREFUQV9UT0dHTEUsIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgdmFyIF90aGlzMTAgPSB0aGlzO1xyXG5cclxuICAgIHZhciB0YXJnZXQ7XHJcbiAgICB2YXIgc2VsZWN0b3IgPSBVdGlsLmdldFNlbGVjdG9yRnJvbUVsZW1lbnQodGhpcyk7XHJcblxyXG4gICAgaWYgKHNlbGVjdG9yKSB7XHJcbiAgICAgIHRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBjb25maWcgPSAkKHRhcmdldCkuZGF0YShEQVRBX0tFWSQ1KSA/ICd0b2dnbGUnIDogX29iamVjdFNwcmVhZCh7fSwgJCh0YXJnZXQpLmRhdGEoKSwgJCh0aGlzKS5kYXRhKCkpO1xyXG5cclxuICAgIGlmICh0aGlzLnRhZ05hbWUgPT09ICdBJyB8fCB0aGlzLnRhZ05hbWUgPT09ICdBUkVBJykge1xyXG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciAkdGFyZ2V0ID0gJCh0YXJnZXQpLm9uZShFdmVudCQ1LlNIT1csIGZ1bmN0aW9uIChzaG93RXZlbnQpIHtcclxuICAgICAgaWYgKHNob3dFdmVudC5pc0RlZmF1bHRQcmV2ZW50ZWQoKSkge1xyXG4gICAgICAgIC8vIE9ubHkgcmVnaXN0ZXIgZm9jdXMgcmVzdG9yZXIgaWYgbW9kYWwgd2lsbCBhY3R1YWxseSBnZXQgc2hvd25cclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgICR0YXJnZXQub25lKEV2ZW50JDUuSElEREVOLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKCQoX3RoaXMxMCkuaXMoJzp2aXNpYmxlJykpIHtcclxuICAgICAgICAgIF90aGlzMTAuZm9jdXMoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgTW9kYWwuX2pRdWVyeUludGVyZmFjZS5jYWxsKCQodGFyZ2V0KSwgY29uZmlnLCB0aGlzKTtcclxuICB9KTtcclxuICAvKipcclxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgKiBqUXVlcnlcclxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgKi9cclxuXHJcbiAgJC5mbltOQU1FJDVdID0gTW9kYWwuX2pRdWVyeUludGVyZmFjZTtcclxuICAkLmZuW05BTUUkNV0uQ29uc3RydWN0b3IgPSBNb2RhbDtcclxuXHJcbiAgJC5mbltOQU1FJDVdLm5vQ29uZmxpY3QgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAkLmZuW05BTUUkNV0gPSBKUVVFUllfTk9fQ09ORkxJQ1QkNTtcclxuICAgIHJldHVybiBNb2RhbC5falF1ZXJ5SW50ZXJmYWNlO1xyXG4gIH07XHJcblxyXG4gIC8qKlxyXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAqIENvbnN0YW50c1xyXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAqL1xyXG5cclxuICB2YXIgTkFNRSQ2ID0gJ3Rvb2x0aXAnO1xyXG4gIHZhciBWRVJTSU9OJDYgPSAnNC4yLjEnO1xyXG4gIHZhciBEQVRBX0tFWSQ2ID0gJ2JzLnRvb2x0aXAnO1xyXG4gIHZhciBFVkVOVF9LRVkkNiA9IFwiLlwiICsgREFUQV9LRVkkNjtcclxuICB2YXIgSlFVRVJZX05PX0NPTkZMSUNUJDYgPSAkLmZuW05BTUUkNl07XHJcbiAgdmFyIENMQVNTX1BSRUZJWCA9ICdicy10b29sdGlwJztcclxuICB2YXIgQlNDTFNfUFJFRklYX1JFR0VYID0gbmV3IFJlZ0V4cChcIihefFxcXFxzKVwiICsgQ0xBU1NfUFJFRklYICsgXCJcXFxcUytcIiwgJ2cnKTtcclxuICB2YXIgRGVmYXVsdFR5cGUkNCA9IHtcclxuICAgIGFuaW1hdGlvbjogJ2Jvb2xlYW4nLFxyXG4gICAgdGVtcGxhdGU6ICdzdHJpbmcnLFxyXG4gICAgdGl0bGU6ICcoc3RyaW5nfGVsZW1lbnR8ZnVuY3Rpb24pJyxcclxuICAgIHRyaWdnZXI6ICdzdHJpbmcnLFxyXG4gICAgZGVsYXk6ICcobnVtYmVyfG9iamVjdCknLFxyXG4gICAgaHRtbDogJ2Jvb2xlYW4nLFxyXG4gICAgc2VsZWN0b3I6ICcoc3RyaW5nfGJvb2xlYW4pJyxcclxuICAgIHBsYWNlbWVudDogJyhzdHJpbmd8ZnVuY3Rpb24pJyxcclxuICAgIG9mZnNldDogJyhudW1iZXJ8c3RyaW5nKScsXHJcbiAgICBjb250YWluZXI6ICcoc3RyaW5nfGVsZW1lbnR8Ym9vbGVhbiknLFxyXG4gICAgZmFsbGJhY2tQbGFjZW1lbnQ6ICcoc3RyaW5nfGFycmF5KScsXHJcbiAgICBib3VuZGFyeTogJyhzdHJpbmd8ZWxlbWVudCknXHJcbiAgfTtcclxuICB2YXIgQXR0YWNobWVudE1hcCQxID0ge1xyXG4gICAgQVVUTzogJ2F1dG8nLFxyXG4gICAgVE9QOiAndG9wJyxcclxuICAgIFJJR0hUOiAncmlnaHQnLFxyXG4gICAgQk9UVE9NOiAnYm90dG9tJyxcclxuICAgIExFRlQ6ICdsZWZ0J1xyXG4gIH07XHJcbiAgdmFyIERlZmF1bHQkNCA9IHtcclxuICAgIGFuaW1hdGlvbjogdHJ1ZSxcclxuICAgIHRlbXBsYXRlOiAnPGRpdiBjbGFzcz1cInRvb2x0aXBcIiByb2xlPVwidG9vbHRpcFwiPicgKyAnPGRpdiBjbGFzcz1cImFycm93XCI+PC9kaXY+JyArICc8ZGl2IGNsYXNzPVwidG9vbHRpcC1pbm5lclwiPjwvZGl2PjwvZGl2PicsXHJcbiAgICB0cmlnZ2VyOiAnaG92ZXIgZm9jdXMnLFxyXG4gICAgdGl0bGU6ICcnLFxyXG4gICAgZGVsYXk6IDAsXHJcbiAgICBodG1sOiBmYWxzZSxcclxuICAgIHNlbGVjdG9yOiBmYWxzZSxcclxuICAgIHBsYWNlbWVudDogJ3RvcCcsXHJcbiAgICBvZmZzZXQ6IDAsXHJcbiAgICBjb250YWluZXI6IGZhbHNlLFxyXG4gICAgZmFsbGJhY2tQbGFjZW1lbnQ6ICdmbGlwJyxcclxuICAgIGJvdW5kYXJ5OiAnc2Nyb2xsUGFyZW50J1xyXG4gIH07XHJcbiAgdmFyIEhvdmVyU3RhdGUgPSB7XHJcbiAgICBTSE9XOiAnc2hvdycsXHJcbiAgICBPVVQ6ICdvdXQnXHJcbiAgfTtcclxuICB2YXIgRXZlbnQkNiA9IHtcclxuICAgIEhJREU6IFwiaGlkZVwiICsgRVZFTlRfS0VZJDYsXHJcbiAgICBISURERU46IFwiaGlkZGVuXCIgKyBFVkVOVF9LRVkkNixcclxuICAgIFNIT1c6IFwic2hvd1wiICsgRVZFTlRfS0VZJDYsXHJcbiAgICBTSE9XTjogXCJzaG93blwiICsgRVZFTlRfS0VZJDYsXHJcbiAgICBJTlNFUlRFRDogXCJpbnNlcnRlZFwiICsgRVZFTlRfS0VZJDYsXHJcbiAgICBDTElDSzogXCJjbGlja1wiICsgRVZFTlRfS0VZJDYsXHJcbiAgICBGT0NVU0lOOiBcImZvY3VzaW5cIiArIEVWRU5UX0tFWSQ2LFxyXG4gICAgRk9DVVNPVVQ6IFwiZm9jdXNvdXRcIiArIEVWRU5UX0tFWSQ2LFxyXG4gICAgTU9VU0VFTlRFUjogXCJtb3VzZWVudGVyXCIgKyBFVkVOVF9LRVkkNixcclxuICAgIE1PVVNFTEVBVkU6IFwibW91c2VsZWF2ZVwiICsgRVZFTlRfS0VZJDZcclxuICB9O1xyXG4gIHZhciBDbGFzc05hbWUkNiA9IHtcclxuICAgIEZBREU6ICdmYWRlJyxcclxuICAgIFNIT1c6ICdzaG93J1xyXG4gIH07XHJcbiAgdmFyIFNlbGVjdG9yJDYgPSB7XHJcbiAgICBUT09MVElQOiAnLnRvb2x0aXAnLFxyXG4gICAgVE9PTFRJUF9JTk5FUjogJy50b29sdGlwLWlubmVyJyxcclxuICAgIEFSUk9XOiAnLmFycm93J1xyXG4gIH07XHJcbiAgdmFyIFRyaWdnZXIgPSB7XHJcbiAgICBIT1ZFUjogJ2hvdmVyJyxcclxuICAgIEZPQ1VTOiAnZm9jdXMnLFxyXG4gICAgQ0xJQ0s6ICdjbGljaycsXHJcbiAgICBNQU5VQUw6ICdtYW51YWwnXHJcbiAgICAvKipcclxuICAgICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgICogQ2xhc3MgRGVmaW5pdGlvblxyXG4gICAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAgKi9cclxuXHJcbiAgfTtcclxuXHJcbiAgdmFyIFRvb2x0aXAgPVxyXG4gIC8qI19fUFVSRV9fKi9cclxuICBmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBUb29sdGlwKGVsZW1lbnQsIGNvbmZpZykge1xyXG4gICAgICAvKipcclxuICAgICAgICogQ2hlY2sgZm9yIFBvcHBlciBkZXBlbmRlbmN5XHJcbiAgICAgICAqIFBvcHBlciAtIGh0dHBzOi8vcG9wcGVyLmpzLm9yZ1xyXG4gICAgICAgKi9cclxuICAgICAgaWYgKHR5cGVvZiBQb3BwZXIgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQm9vdHN0cmFwXFwncyB0b29sdGlwcyByZXF1aXJlIFBvcHBlci5qcyAoaHR0cHM6Ly9wb3BwZXIuanMub3JnLyknKTtcclxuICAgICAgfSAvLyBwcml2YXRlXHJcblxyXG5cclxuICAgICAgdGhpcy5faXNFbmFibGVkID0gdHJ1ZTtcclxuICAgICAgdGhpcy5fdGltZW91dCA9IDA7XHJcbiAgICAgIHRoaXMuX2hvdmVyU3RhdGUgPSAnJztcclxuICAgICAgdGhpcy5fYWN0aXZlVHJpZ2dlciA9IHt9O1xyXG4gICAgICB0aGlzLl9wb3BwZXIgPSBudWxsOyAvLyBQcm90ZWN0ZWRcclxuXHJcbiAgICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XHJcbiAgICAgIHRoaXMuY29uZmlnID0gdGhpcy5fZ2V0Q29uZmlnKGNvbmZpZyk7XHJcbiAgICAgIHRoaXMudGlwID0gbnVsbDtcclxuXHJcbiAgICAgIHRoaXMuX3NldExpc3RlbmVycygpO1xyXG4gICAgfSAvLyBHZXR0ZXJzXHJcblxyXG5cclxuICAgIHZhciBfcHJvdG8gPSBUb29sdGlwLnByb3RvdHlwZTtcclxuXHJcbiAgICAvLyBQdWJsaWNcclxuICAgIF9wcm90by5lbmFibGUgPSBmdW5jdGlvbiBlbmFibGUoKSB7XHJcbiAgICAgIHRoaXMuX2lzRW5hYmxlZCA9IHRydWU7XHJcbiAgICB9O1xyXG5cclxuICAgIF9wcm90by5kaXNhYmxlID0gZnVuY3Rpb24gZGlzYWJsZSgpIHtcclxuICAgICAgdGhpcy5faXNFbmFibGVkID0gZmFsc2U7XHJcbiAgICB9O1xyXG5cclxuICAgIF9wcm90by50b2dnbGVFbmFibGVkID0gZnVuY3Rpb24gdG9nZ2xlRW5hYmxlZCgpIHtcclxuICAgICAgdGhpcy5faXNFbmFibGVkID0gIXRoaXMuX2lzRW5hYmxlZDtcclxuICAgIH07XHJcblxyXG4gICAgX3Byb3RvLnRvZ2dsZSA9IGZ1bmN0aW9uIHRvZ2dsZShldmVudCkge1xyXG4gICAgICBpZiAoIXRoaXMuX2lzRW5hYmxlZCkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGV2ZW50KSB7XHJcbiAgICAgICAgdmFyIGRhdGFLZXkgPSB0aGlzLmNvbnN0cnVjdG9yLkRBVEFfS0VZO1xyXG4gICAgICAgIHZhciBjb250ZXh0ID0gJChldmVudC5jdXJyZW50VGFyZ2V0KS5kYXRhKGRhdGFLZXkpO1xyXG5cclxuICAgICAgICBpZiAoIWNvbnRleHQpIHtcclxuICAgICAgICAgIGNvbnRleHQgPSBuZXcgdGhpcy5jb25zdHJ1Y3RvcihldmVudC5jdXJyZW50VGFyZ2V0LCB0aGlzLl9nZXREZWxlZ2F0ZUNvbmZpZygpKTtcclxuICAgICAgICAgICQoZXZlbnQuY3VycmVudFRhcmdldCkuZGF0YShkYXRhS2V5LCBjb250ZXh0KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnRleHQuX2FjdGl2ZVRyaWdnZXIuY2xpY2sgPSAhY29udGV4dC5fYWN0aXZlVHJpZ2dlci5jbGljaztcclxuXHJcbiAgICAgICAgaWYgKGNvbnRleHQuX2lzV2l0aEFjdGl2ZVRyaWdnZXIoKSkge1xyXG4gICAgICAgICAgY29udGV4dC5fZW50ZXIobnVsbCwgY29udGV4dCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGNvbnRleHQuX2xlYXZlKG51bGwsIGNvbnRleHQpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAoJCh0aGlzLmdldFRpcEVsZW1lbnQoKSkuaGFzQ2xhc3MoQ2xhc3NOYW1lJDYuU0hPVykpIHtcclxuICAgICAgICAgIHRoaXMuX2xlYXZlKG51bGwsIHRoaXMpO1xyXG5cclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX2VudGVyKG51bGwsIHRoaXMpO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIF9wcm90by5kaXNwb3NlID0gZnVuY3Rpb24gZGlzcG9zZSgpIHtcclxuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX3RpbWVvdXQpO1xyXG4gICAgICAkLnJlbW92ZURhdGEodGhpcy5lbGVtZW50LCB0aGlzLmNvbnN0cnVjdG9yLkRBVEFfS0VZKTtcclxuICAgICAgJCh0aGlzLmVsZW1lbnQpLm9mZih0aGlzLmNvbnN0cnVjdG9yLkVWRU5UX0tFWSk7XHJcbiAgICAgICQodGhpcy5lbGVtZW50KS5jbG9zZXN0KCcubW9kYWwnKS5vZmYoJ2hpZGUuYnMubW9kYWwnKTtcclxuXHJcbiAgICAgIGlmICh0aGlzLnRpcCkge1xyXG4gICAgICAgICQodGhpcy50aXApLnJlbW92ZSgpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLl9pc0VuYWJsZWQgPSBudWxsO1xyXG4gICAgICB0aGlzLl90aW1lb3V0ID0gbnVsbDtcclxuICAgICAgdGhpcy5faG92ZXJTdGF0ZSA9IG51bGw7XHJcbiAgICAgIHRoaXMuX2FjdGl2ZVRyaWdnZXIgPSBudWxsO1xyXG5cclxuICAgICAgaWYgKHRoaXMuX3BvcHBlciAhPT0gbnVsbCkge1xyXG4gICAgICAgIHRoaXMuX3BvcHBlci5kZXN0cm95KCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuX3BvcHBlciA9IG51bGw7XHJcbiAgICAgIHRoaXMuZWxlbWVudCA9IG51bGw7XHJcbiAgICAgIHRoaXMuY29uZmlnID0gbnVsbDtcclxuICAgICAgdGhpcy50aXAgPSBudWxsO1xyXG4gICAgfTtcclxuXHJcbiAgICBfcHJvdG8uc2hvdyA9IGZ1bmN0aW9uIHNob3coKSB7XHJcbiAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcblxyXG4gICAgICBpZiAoJCh0aGlzLmVsZW1lbnQpLmNzcygnZGlzcGxheScpID09PSAnbm9uZScpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1BsZWFzZSB1c2Ugc2hvdyBvbiB2aXNpYmxlIGVsZW1lbnRzJyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciBzaG93RXZlbnQgPSAkLkV2ZW50KHRoaXMuY29uc3RydWN0b3IuRXZlbnQuU0hPVyk7XHJcblxyXG4gICAgICBpZiAodGhpcy5pc1dpdGhDb250ZW50KCkgJiYgdGhpcy5faXNFbmFibGVkKSB7XHJcbiAgICAgICAgJCh0aGlzLmVsZW1lbnQpLnRyaWdnZXIoc2hvd0V2ZW50KTtcclxuICAgICAgICB2YXIgc2hhZG93Um9vdCA9IFV0aWwuZmluZFNoYWRvd1Jvb3QodGhpcy5lbGVtZW50KTtcclxuICAgICAgICB2YXIgaXNJblRoZURvbSA9ICQuY29udGFpbnMoc2hhZG93Um9vdCAhPT0gbnVsbCA/IHNoYWRvd1Jvb3QgOiB0aGlzLmVsZW1lbnQub3duZXJEb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsIHRoaXMuZWxlbWVudCk7XHJcblxyXG4gICAgICAgIGlmIChzaG93RXZlbnQuaXNEZWZhdWx0UHJldmVudGVkKCkgfHwgIWlzSW5UaGVEb20pIHtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciB0aXAgPSB0aGlzLmdldFRpcEVsZW1lbnQoKTtcclxuICAgICAgICB2YXIgdGlwSWQgPSBVdGlsLmdldFVJRCh0aGlzLmNvbnN0cnVjdG9yLk5BTUUpO1xyXG4gICAgICAgIHRpcC5zZXRBdHRyaWJ1dGUoJ2lkJywgdGlwSWQpO1xyXG4gICAgICAgIHRoaXMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZGVzY3JpYmVkYnknLCB0aXBJZCk7XHJcbiAgICAgICAgdGhpcy5zZXRDb250ZW50KCk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmNvbmZpZy5hbmltYXRpb24pIHtcclxuICAgICAgICAgICQodGlwKS5hZGRDbGFzcyhDbGFzc05hbWUkNi5GQURFKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBwbGFjZW1lbnQgPSB0eXBlb2YgdGhpcy5jb25maWcucGxhY2VtZW50ID09PSAnZnVuY3Rpb24nID8gdGhpcy5jb25maWcucGxhY2VtZW50LmNhbGwodGhpcywgdGlwLCB0aGlzLmVsZW1lbnQpIDogdGhpcy5jb25maWcucGxhY2VtZW50O1xyXG5cclxuICAgICAgICB2YXIgYXR0YWNobWVudCA9IHRoaXMuX2dldEF0dGFjaG1lbnQocGxhY2VtZW50KTtcclxuXHJcbiAgICAgICAgdGhpcy5hZGRBdHRhY2htZW50Q2xhc3MoYXR0YWNobWVudCk7XHJcblxyXG4gICAgICAgIHZhciBjb250YWluZXIgPSB0aGlzLl9nZXRDb250YWluZXIoKTtcclxuXHJcbiAgICAgICAgJCh0aXApLmRhdGEodGhpcy5jb25zdHJ1Y3Rvci5EQVRBX0tFWSwgdGhpcyk7XHJcblxyXG4gICAgICAgIGlmICghJC5jb250YWlucyh0aGlzLmVsZW1lbnQub3duZXJEb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsIHRoaXMudGlwKSkge1xyXG4gICAgICAgICAgJCh0aXApLmFwcGVuZFRvKGNvbnRhaW5lcik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkKHRoaXMuZWxlbWVudCkudHJpZ2dlcih0aGlzLmNvbnN0cnVjdG9yLkV2ZW50LklOU0VSVEVEKTtcclxuICAgICAgICB0aGlzLl9wb3BwZXIgPSBuZXcgUG9wcGVyKHRoaXMuZWxlbWVudCwgdGlwLCB7XHJcbiAgICAgICAgICBwbGFjZW1lbnQ6IGF0dGFjaG1lbnQsXHJcbiAgICAgICAgICBtb2RpZmllcnM6IHtcclxuICAgICAgICAgICAgb2Zmc2V0OiB7XHJcbiAgICAgICAgICAgICAgb2Zmc2V0OiB0aGlzLmNvbmZpZy5vZmZzZXRcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZmxpcDoge1xyXG4gICAgICAgICAgICAgIGJlaGF2aW9yOiB0aGlzLmNvbmZpZy5mYWxsYmFja1BsYWNlbWVudFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBhcnJvdzoge1xyXG4gICAgICAgICAgICAgIGVsZW1lbnQ6IFNlbGVjdG9yJDYuQVJST1dcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgcHJldmVudE92ZXJmbG93OiB7XHJcbiAgICAgICAgICAgICAgYm91bmRhcmllc0VsZW1lbnQ6IHRoaXMuY29uZmlnLmJvdW5kYXJ5XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBvbkNyZWF0ZTogZnVuY3Rpb24gb25DcmVhdGUoZGF0YSkge1xyXG4gICAgICAgICAgICBpZiAoZGF0YS5vcmlnaW5hbFBsYWNlbWVudCAhPT0gZGF0YS5wbGFjZW1lbnQpIHtcclxuICAgICAgICAgICAgICBfdGhpcy5faGFuZGxlUG9wcGVyUGxhY2VtZW50Q2hhbmdlKGRhdGEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgb25VcGRhdGU6IGZ1bmN0aW9uIG9uVXBkYXRlKGRhdGEpIHtcclxuICAgICAgICAgICAgcmV0dXJuIF90aGlzLl9oYW5kbGVQb3BwZXJQbGFjZW1lbnRDaGFuZ2UoZGF0YSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgJCh0aXApLmFkZENsYXNzKENsYXNzTmFtZSQ2LlNIT1cpOyAvLyBJZiB0aGlzIGlzIGEgdG91Y2gtZW5hYmxlZCBkZXZpY2Ugd2UgYWRkIGV4dHJhXHJcbiAgICAgICAgLy8gZW1wdHkgbW91c2VvdmVyIGxpc3RlbmVycyB0byB0aGUgYm9keSdzIGltbWVkaWF0ZSBjaGlsZHJlbjtcclxuICAgICAgICAvLyBvbmx5IG5lZWRlZCBiZWNhdXNlIG9mIGJyb2tlbiBldmVudCBkZWxlZ2F0aW9uIG9uIGlPU1xyXG4gICAgICAgIC8vIGh0dHBzOi8vd3d3LnF1aXJrc21vZGUub3JnL2Jsb2cvYXJjaGl2ZXMvMjAxNC8wMi9tb3VzZV9ldmVudF9idWIuaHRtbFxyXG5cclxuICAgICAgICBpZiAoJ29udG91Y2hzdGFydCcgaW4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KSB7XHJcbiAgICAgICAgICAkKGRvY3VtZW50LmJvZHkpLmNoaWxkcmVuKCkub24oJ21vdXNlb3ZlcicsIG51bGwsICQubm9vcCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgY29tcGxldGUgPSBmdW5jdGlvbiBjb21wbGV0ZSgpIHtcclxuICAgICAgICAgIGlmIChfdGhpcy5jb25maWcuYW5pbWF0aW9uKSB7XHJcbiAgICAgICAgICAgIF90aGlzLl9maXhUcmFuc2l0aW9uKCk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgdmFyIHByZXZIb3ZlclN0YXRlID0gX3RoaXMuX2hvdmVyU3RhdGU7XHJcbiAgICAgICAgICBfdGhpcy5faG92ZXJTdGF0ZSA9IG51bGw7XHJcbiAgICAgICAgICAkKF90aGlzLmVsZW1lbnQpLnRyaWdnZXIoX3RoaXMuY29uc3RydWN0b3IuRXZlbnQuU0hPV04pO1xyXG5cclxuICAgICAgICAgIGlmIChwcmV2SG92ZXJTdGF0ZSA9PT0gSG92ZXJTdGF0ZS5PVVQpIHtcclxuICAgICAgICAgICAgX3RoaXMuX2xlYXZlKG51bGwsIF90aGlzKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBpZiAoJCh0aGlzLnRpcCkuaGFzQ2xhc3MoQ2xhc3NOYW1lJDYuRkFERSkpIHtcclxuICAgICAgICAgIHZhciB0cmFuc2l0aW9uRHVyYXRpb24gPSBVdGlsLmdldFRyYW5zaXRpb25EdXJhdGlvbkZyb21FbGVtZW50KHRoaXMudGlwKTtcclxuICAgICAgICAgICQodGhpcy50aXApLm9uZShVdGlsLlRSQU5TSVRJT05fRU5ELCBjb21wbGV0ZSkuZW11bGF0ZVRyYW5zaXRpb25FbmQodHJhbnNpdGlvbkR1cmF0aW9uKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgY29tcGxldGUoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgX3Byb3RvLmhpZGUgPSBmdW5jdGlvbiBoaWRlKGNhbGxiYWNrKSB7XHJcbiAgICAgIHZhciBfdGhpczIgPSB0aGlzO1xyXG5cclxuICAgICAgdmFyIHRpcCA9IHRoaXMuZ2V0VGlwRWxlbWVudCgpO1xyXG4gICAgICB2YXIgaGlkZUV2ZW50ID0gJC5FdmVudCh0aGlzLmNvbnN0cnVjdG9yLkV2ZW50LkhJREUpO1xyXG5cclxuICAgICAgdmFyIGNvbXBsZXRlID0gZnVuY3Rpb24gY29tcGxldGUoKSB7XHJcbiAgICAgICAgaWYgKF90aGlzMi5faG92ZXJTdGF0ZSAhPT0gSG92ZXJTdGF0ZS5TSE9XICYmIHRpcC5wYXJlbnROb2RlKSB7XHJcbiAgICAgICAgICB0aXAucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0aXApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgX3RoaXMyLl9jbGVhblRpcENsYXNzKCk7XHJcblxyXG4gICAgICAgIF90aGlzMi5lbGVtZW50LnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScpO1xyXG5cclxuICAgICAgICAkKF90aGlzMi5lbGVtZW50KS50cmlnZ2VyKF90aGlzMi5jb25zdHJ1Y3Rvci5FdmVudC5ISURERU4pO1xyXG5cclxuICAgICAgICBpZiAoX3RoaXMyLl9wb3BwZXIgIT09IG51bGwpIHtcclxuICAgICAgICAgIF90aGlzMi5fcG9wcGVyLmRlc3Ryb3koKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChjYWxsYmFjaykge1xyXG4gICAgICAgICAgY2FsbGJhY2soKTtcclxuICAgICAgICB9XHJcbiAgICAgIH07XHJcblxyXG4gICAgICAkKHRoaXMuZWxlbWVudCkudHJpZ2dlcihoaWRlRXZlbnQpO1xyXG5cclxuICAgICAgaWYgKGhpZGVFdmVudC5pc0RlZmF1bHRQcmV2ZW50ZWQoKSkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgJCh0aXApLnJlbW92ZUNsYXNzKENsYXNzTmFtZSQ2LlNIT1cpOyAvLyBJZiB0aGlzIGlzIGEgdG91Y2gtZW5hYmxlZCBkZXZpY2Ugd2UgcmVtb3ZlIHRoZSBleHRyYVxyXG4gICAgICAvLyBlbXB0eSBtb3VzZW92ZXIgbGlzdGVuZXJzIHdlIGFkZGVkIGZvciBpT1Mgc3VwcG9ydFxyXG5cclxuICAgICAgaWYgKCdvbnRvdWNoc3RhcnQnIGluIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkge1xyXG4gICAgICAgICQoZG9jdW1lbnQuYm9keSkuY2hpbGRyZW4oKS5vZmYoJ21vdXNlb3ZlcicsIG51bGwsICQubm9vcCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuX2FjdGl2ZVRyaWdnZXJbVHJpZ2dlci5DTElDS10gPSBmYWxzZTtcclxuICAgICAgdGhpcy5fYWN0aXZlVHJpZ2dlcltUcmlnZ2VyLkZPQ1VTXSA9IGZhbHNlO1xyXG4gICAgICB0aGlzLl9hY3RpdmVUcmlnZ2VyW1RyaWdnZXIuSE9WRVJdID0gZmFsc2U7XHJcblxyXG4gICAgICBpZiAoJCh0aGlzLnRpcCkuaGFzQ2xhc3MoQ2xhc3NOYW1lJDYuRkFERSkpIHtcclxuICAgICAgICB2YXIgdHJhbnNpdGlvbkR1cmF0aW9uID0gVXRpbC5nZXRUcmFuc2l0aW9uRHVyYXRpb25Gcm9tRWxlbWVudCh0aXApO1xyXG4gICAgICAgICQodGlwKS5vbmUoVXRpbC5UUkFOU0lUSU9OX0VORCwgY29tcGxldGUpLmVtdWxhdGVUcmFuc2l0aW9uRW5kKHRyYW5zaXRpb25EdXJhdGlvbik7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29tcGxldGUoKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5faG92ZXJTdGF0ZSA9ICcnO1xyXG4gICAgfTtcclxuXHJcbiAgICBfcHJvdG8udXBkYXRlID0gZnVuY3Rpb24gdXBkYXRlKCkge1xyXG4gICAgICBpZiAodGhpcy5fcG9wcGVyICE9PSBudWxsKSB7XHJcbiAgICAgICAgdGhpcy5fcG9wcGVyLnNjaGVkdWxlVXBkYXRlKCk7XHJcbiAgICAgIH1cclxuICAgIH07IC8vIFByb3RlY3RlZFxyXG5cclxuXHJcbiAgICBfcHJvdG8uaXNXaXRoQ29udGVudCA9IGZ1bmN0aW9uIGlzV2l0aENvbnRlbnQoKSB7XHJcbiAgICAgIHJldHVybiBCb29sZWFuKHRoaXMuZ2V0VGl0bGUoKSk7XHJcbiAgICB9O1xyXG5cclxuICAgIF9wcm90by5hZGRBdHRhY2htZW50Q2xhc3MgPSBmdW5jdGlvbiBhZGRBdHRhY2htZW50Q2xhc3MoYXR0YWNobWVudCkge1xyXG4gICAgICAkKHRoaXMuZ2V0VGlwRWxlbWVudCgpKS5hZGRDbGFzcyhDTEFTU19QUkVGSVggKyBcIi1cIiArIGF0dGFjaG1lbnQpO1xyXG4gICAgfTtcclxuXHJcbiAgICBfcHJvdG8uZ2V0VGlwRWxlbWVudCA9IGZ1bmN0aW9uIGdldFRpcEVsZW1lbnQoKSB7XHJcbiAgICAgIHRoaXMudGlwID0gdGhpcy50aXAgfHwgJCh0aGlzLmNvbmZpZy50ZW1wbGF0ZSlbMF07XHJcbiAgICAgIHJldHVybiB0aGlzLnRpcDtcclxuICAgIH07XHJcblxyXG4gICAgX3Byb3RvLnNldENvbnRlbnQgPSBmdW5jdGlvbiBzZXRDb250ZW50KCkge1xyXG4gICAgICB2YXIgdGlwID0gdGhpcy5nZXRUaXBFbGVtZW50KCk7XHJcbiAgICAgIHRoaXMuc2V0RWxlbWVudENvbnRlbnQoJCh0aXAucXVlcnlTZWxlY3RvckFsbChTZWxlY3RvciQ2LlRPT0xUSVBfSU5ORVIpKSwgdGhpcy5nZXRUaXRsZSgpKTtcclxuICAgICAgJCh0aXApLnJlbW92ZUNsYXNzKENsYXNzTmFtZSQ2LkZBREUgKyBcIiBcIiArIENsYXNzTmFtZSQ2LlNIT1cpO1xyXG4gICAgfTtcclxuXHJcbiAgICBfcHJvdG8uc2V0RWxlbWVudENvbnRlbnQgPSBmdW5jdGlvbiBzZXRFbGVtZW50Q29udGVudCgkZWxlbWVudCwgY29udGVudCkge1xyXG4gICAgICB2YXIgaHRtbCA9IHRoaXMuY29uZmlnLmh0bWw7XHJcblxyXG4gICAgICBpZiAodHlwZW9mIGNvbnRlbnQgPT09ICdvYmplY3QnICYmIChjb250ZW50Lm5vZGVUeXBlIHx8IGNvbnRlbnQuanF1ZXJ5KSkge1xyXG4gICAgICAgIC8vIENvbnRlbnQgaXMgYSBET00gbm9kZSBvciBhIGpRdWVyeVxyXG4gICAgICAgIGlmIChodG1sKSB7XHJcbiAgICAgICAgICBpZiAoISQoY29udGVudCkucGFyZW50KCkuaXMoJGVsZW1lbnQpKSB7XHJcbiAgICAgICAgICAgICRlbGVtZW50LmVtcHR5KCkuYXBwZW5kKGNvbnRlbnQpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAkZWxlbWVudC50ZXh0KCQoY29udGVudCkudGV4dCgpKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgJGVsZW1lbnRbaHRtbCA/ICdodG1sJyA6ICd0ZXh0J10oY29udGVudCk7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgX3Byb3RvLmdldFRpdGxlID0gZnVuY3Rpb24gZ2V0VGl0bGUoKSB7XHJcbiAgICAgIHZhciB0aXRsZSA9IHRoaXMuZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtb3JpZ2luYWwtdGl0bGUnKTtcclxuXHJcbiAgICAgIGlmICghdGl0bGUpIHtcclxuICAgICAgICB0aXRsZSA9IHR5cGVvZiB0aGlzLmNvbmZpZy50aXRsZSA9PT0gJ2Z1bmN0aW9uJyA/IHRoaXMuY29uZmlnLnRpdGxlLmNhbGwodGhpcy5lbGVtZW50KSA6IHRoaXMuY29uZmlnLnRpdGxlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gdGl0bGU7XHJcbiAgICB9OyAvLyBQcml2YXRlXHJcblxyXG5cclxuICAgIF9wcm90by5fZ2V0Q29udGFpbmVyID0gZnVuY3Rpb24gX2dldENvbnRhaW5lcigpIHtcclxuICAgICAgaWYgKHRoaXMuY29uZmlnLmNvbnRhaW5lciA9PT0gZmFsc2UpIHtcclxuICAgICAgICByZXR1cm4gZG9jdW1lbnQuYm9keTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKFV0aWwuaXNFbGVtZW50KHRoaXMuY29uZmlnLmNvbnRhaW5lcikpIHtcclxuICAgICAgICByZXR1cm4gJCh0aGlzLmNvbmZpZy5jb250YWluZXIpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gJChkb2N1bWVudCkuZmluZCh0aGlzLmNvbmZpZy5jb250YWluZXIpO1xyXG4gICAgfTtcclxuXHJcbiAgICBfcHJvdG8uX2dldEF0dGFjaG1lbnQgPSBmdW5jdGlvbiBfZ2V0QXR0YWNobWVudChwbGFjZW1lbnQpIHtcclxuICAgICAgcmV0dXJuIEF0dGFjaG1lbnRNYXAkMVtwbGFjZW1lbnQudG9VcHBlckNhc2UoKV07XHJcbiAgICB9O1xyXG5cclxuICAgIF9wcm90by5fc2V0TGlzdGVuZXJzID0gZnVuY3Rpb24gX3NldExpc3RlbmVycygpIHtcclxuICAgICAgdmFyIF90aGlzMyA9IHRoaXM7XHJcblxyXG4gICAgICB2YXIgdHJpZ2dlcnMgPSB0aGlzLmNvbmZpZy50cmlnZ2VyLnNwbGl0KCcgJyk7XHJcbiAgICAgIHRyaWdnZXJzLmZvckVhY2goZnVuY3Rpb24gKHRyaWdnZXIpIHtcclxuICAgICAgICBpZiAodHJpZ2dlciA9PT0gJ2NsaWNrJykge1xyXG4gICAgICAgICAgJChfdGhpczMuZWxlbWVudCkub24oX3RoaXMzLmNvbnN0cnVjdG9yLkV2ZW50LkNMSUNLLCBfdGhpczMuY29uZmlnLnNlbGVjdG9yLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIF90aGlzMy50b2dnbGUoZXZlbnQpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIGlmICh0cmlnZ2VyICE9PSBUcmlnZ2VyLk1BTlVBTCkge1xyXG4gICAgICAgICAgdmFyIGV2ZW50SW4gPSB0cmlnZ2VyID09PSBUcmlnZ2VyLkhPVkVSID8gX3RoaXMzLmNvbnN0cnVjdG9yLkV2ZW50Lk1PVVNFRU5URVIgOiBfdGhpczMuY29uc3RydWN0b3IuRXZlbnQuRk9DVVNJTjtcclxuICAgICAgICAgIHZhciBldmVudE91dCA9IHRyaWdnZXIgPT09IFRyaWdnZXIuSE9WRVIgPyBfdGhpczMuY29uc3RydWN0b3IuRXZlbnQuTU9VU0VMRUFWRSA6IF90aGlzMy5jb25zdHJ1Y3Rvci5FdmVudC5GT0NVU09VVDtcclxuICAgICAgICAgICQoX3RoaXMzLmVsZW1lbnQpLm9uKGV2ZW50SW4sIF90aGlzMy5jb25maWcuc2VsZWN0b3IsIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgICAgICByZXR1cm4gX3RoaXMzLl9lbnRlcihldmVudCk7XHJcbiAgICAgICAgICB9KS5vbihldmVudE91dCwgX3RoaXMzLmNvbmZpZy5zZWxlY3RvciwgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBfdGhpczMuX2xlYXZlKGV2ZW50KTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICAgICQodGhpcy5lbGVtZW50KS5jbG9zZXN0KCcubW9kYWwnKS5vbignaGlkZS5icy5tb2RhbCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAoX3RoaXMzLmVsZW1lbnQpIHtcclxuICAgICAgICAgIF90aGlzMy5oaWRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGlmICh0aGlzLmNvbmZpZy5zZWxlY3Rvcikge1xyXG4gICAgICAgIHRoaXMuY29uZmlnID0gX29iamVjdFNwcmVhZCh7fSwgdGhpcy5jb25maWcsIHtcclxuICAgICAgICAgIHRyaWdnZXI6ICdtYW51YWwnLFxyXG4gICAgICAgICAgc2VsZWN0b3I6ICcnXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5fZml4VGl0bGUoKTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBfcHJvdG8uX2ZpeFRpdGxlID0gZnVuY3Rpb24gX2ZpeFRpdGxlKCkge1xyXG4gICAgICB2YXIgdGl0bGVUeXBlID0gdHlwZW9mIHRoaXMuZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtb3JpZ2luYWwtdGl0bGUnKTtcclxuXHJcbiAgICAgIGlmICh0aGlzLmVsZW1lbnQuZ2V0QXR0cmlidXRlKCd0aXRsZScpIHx8IHRpdGxlVHlwZSAhPT0gJ3N0cmluZycpIHtcclxuICAgICAgICB0aGlzLmVsZW1lbnQuc2V0QXR0cmlidXRlKCdkYXRhLW9yaWdpbmFsLXRpdGxlJywgdGhpcy5lbGVtZW50LmdldEF0dHJpYnV0ZSgndGl0bGUnKSB8fCAnJyk7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LnNldEF0dHJpYnV0ZSgndGl0bGUnLCAnJyk7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgX3Byb3RvLl9lbnRlciA9IGZ1bmN0aW9uIF9lbnRlcihldmVudCwgY29udGV4dCkge1xyXG4gICAgICB2YXIgZGF0YUtleSA9IHRoaXMuY29uc3RydWN0b3IuREFUQV9LRVk7XHJcbiAgICAgIGNvbnRleHQgPSBjb250ZXh0IHx8ICQoZXZlbnQuY3VycmVudFRhcmdldCkuZGF0YShkYXRhS2V5KTtcclxuXHJcbiAgICAgIGlmICghY29udGV4dCkge1xyXG4gICAgICAgIGNvbnRleHQgPSBuZXcgdGhpcy5jb25zdHJ1Y3RvcihldmVudC5jdXJyZW50VGFyZ2V0LCB0aGlzLl9nZXREZWxlZ2F0ZUNvbmZpZygpKTtcclxuICAgICAgICAkKGV2ZW50LmN1cnJlbnRUYXJnZXQpLmRhdGEoZGF0YUtleSwgY29udGV4dCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChldmVudCkge1xyXG4gICAgICAgIGNvbnRleHQuX2FjdGl2ZVRyaWdnZXJbZXZlbnQudHlwZSA9PT0gJ2ZvY3VzaW4nID8gVHJpZ2dlci5GT0NVUyA6IFRyaWdnZXIuSE9WRVJdID0gdHJ1ZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKCQoY29udGV4dC5nZXRUaXBFbGVtZW50KCkpLmhhc0NsYXNzKENsYXNzTmFtZSQ2LlNIT1cpIHx8IGNvbnRleHQuX2hvdmVyU3RhdGUgPT09IEhvdmVyU3RhdGUuU0hPVykge1xyXG4gICAgICAgIGNvbnRleHQuX2hvdmVyU3RhdGUgPSBIb3ZlclN0YXRlLlNIT1c7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBjbGVhclRpbWVvdXQoY29udGV4dC5fdGltZW91dCk7XHJcbiAgICAgIGNvbnRleHQuX2hvdmVyU3RhdGUgPSBIb3ZlclN0YXRlLlNIT1c7XHJcblxyXG4gICAgICBpZiAoIWNvbnRleHQuY29uZmlnLmRlbGF5IHx8ICFjb250ZXh0LmNvbmZpZy5kZWxheS5zaG93KSB7XHJcbiAgICAgICAgY29udGV4dC5zaG93KCk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBjb250ZXh0Ll90aW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKGNvbnRleHQuX2hvdmVyU3RhdGUgPT09IEhvdmVyU3RhdGUuU0hPVykge1xyXG4gICAgICAgICAgY29udGV4dC5zaG93KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9LCBjb250ZXh0LmNvbmZpZy5kZWxheS5zaG93KTtcclxuICAgIH07XHJcblxyXG4gICAgX3Byb3RvLl9sZWF2ZSA9IGZ1bmN0aW9uIF9sZWF2ZShldmVudCwgY29udGV4dCkge1xyXG4gICAgICB2YXIgZGF0YUtleSA9IHRoaXMuY29uc3RydWN0b3IuREFUQV9LRVk7XHJcbiAgICAgIGNvbnRleHQgPSBjb250ZXh0IHx8ICQoZXZlbnQuY3VycmVudFRhcmdldCkuZGF0YShkYXRhS2V5KTtcclxuXHJcbiAgICAgIGlmICghY29udGV4dCkge1xyXG4gICAgICAgIGNvbnRleHQgPSBuZXcgdGhpcy5jb25zdHJ1Y3RvcihldmVudC5jdXJyZW50VGFyZ2V0LCB0aGlzLl9nZXREZWxlZ2F0ZUNvbmZpZygpKTtcclxuICAgICAgICAkKGV2ZW50LmN1cnJlbnRUYXJnZXQpLmRhdGEoZGF0YUtleSwgY29udGV4dCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChldmVudCkge1xyXG4gICAgICAgIGNvbnRleHQuX2FjdGl2ZVRyaWdnZXJbZXZlbnQudHlwZSA9PT0gJ2ZvY3Vzb3V0JyA/IFRyaWdnZXIuRk9DVVMgOiBUcmlnZ2VyLkhPVkVSXSA9IGZhbHNlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoY29udGV4dC5faXNXaXRoQWN0aXZlVHJpZ2dlcigpKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBjbGVhclRpbWVvdXQoY29udGV4dC5fdGltZW91dCk7XHJcbiAgICAgIGNvbnRleHQuX2hvdmVyU3RhdGUgPSBIb3ZlclN0YXRlLk9VVDtcclxuXHJcbiAgICAgIGlmICghY29udGV4dC5jb25maWcuZGVsYXkgfHwgIWNvbnRleHQuY29uZmlnLmRlbGF5LmhpZGUpIHtcclxuICAgICAgICBjb250ZXh0LmhpZGUoKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbnRleHQuX3RpbWVvdXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAoY29udGV4dC5faG92ZXJTdGF0ZSA9PT0gSG92ZXJTdGF0ZS5PVVQpIHtcclxuICAgICAgICAgIGNvbnRleHQuaGlkZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSwgY29udGV4dC5jb25maWcuZGVsYXkuaGlkZSk7XHJcbiAgICB9O1xyXG5cclxuICAgIF9wcm90by5faXNXaXRoQWN0aXZlVHJpZ2dlciA9IGZ1bmN0aW9uIF9pc1dpdGhBY3RpdmVUcmlnZ2VyKCkge1xyXG4gICAgICBmb3IgKHZhciB0cmlnZ2VyIGluIHRoaXMuX2FjdGl2ZVRyaWdnZXIpIHtcclxuICAgICAgICBpZiAodGhpcy5fYWN0aXZlVHJpZ2dlclt0cmlnZ2VyXSkge1xyXG4gICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9O1xyXG5cclxuICAgIF9wcm90by5fZ2V0Q29uZmlnID0gZnVuY3Rpb24gX2dldENvbmZpZyhjb25maWcpIHtcclxuICAgICAgY29uZmlnID0gX29iamVjdFNwcmVhZCh7fSwgdGhpcy5jb25zdHJ1Y3Rvci5EZWZhdWx0LCAkKHRoaXMuZWxlbWVudCkuZGF0YSgpLCB0eXBlb2YgY29uZmlnID09PSAnb2JqZWN0JyAmJiBjb25maWcgPyBjb25maWcgOiB7fSk7XHJcblxyXG4gICAgICBpZiAodHlwZW9mIGNvbmZpZy5kZWxheSA9PT0gJ251bWJlcicpIHtcclxuICAgICAgICBjb25maWcuZGVsYXkgPSB7XHJcbiAgICAgICAgICBzaG93OiBjb25maWcuZGVsYXksXHJcbiAgICAgICAgICBoaWRlOiBjb25maWcuZGVsYXlcclxuICAgICAgICB9O1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAodHlwZW9mIGNvbmZpZy50aXRsZSA9PT0gJ251bWJlcicpIHtcclxuICAgICAgICBjb25maWcudGl0bGUgPSBjb25maWcudGl0bGUudG9TdHJpbmcoKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHR5cGVvZiBjb25maWcuY29udGVudCA9PT0gJ251bWJlcicpIHtcclxuICAgICAgICBjb25maWcuY29udGVudCA9IGNvbmZpZy5jb250ZW50LnRvU3RyaW5nKCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIFV0aWwudHlwZUNoZWNrQ29uZmlnKE5BTUUkNiwgY29uZmlnLCB0aGlzLmNvbnN0cnVjdG9yLkRlZmF1bHRUeXBlKTtcclxuICAgICAgcmV0dXJuIGNvbmZpZztcclxuICAgIH07XHJcblxyXG4gICAgX3Byb3RvLl9nZXREZWxlZ2F0ZUNvbmZpZyA9IGZ1bmN0aW9uIF9nZXREZWxlZ2F0ZUNvbmZpZygpIHtcclxuICAgICAgdmFyIGNvbmZpZyA9IHt9O1xyXG5cclxuICAgICAgaWYgKHRoaXMuY29uZmlnKSB7XHJcbiAgICAgICAgZm9yICh2YXIga2V5IGluIHRoaXMuY29uZmlnKSB7XHJcbiAgICAgICAgICBpZiAodGhpcy5jb25zdHJ1Y3Rvci5EZWZhdWx0W2tleV0gIT09IHRoaXMuY29uZmlnW2tleV0pIHtcclxuICAgICAgICAgICAgY29uZmlnW2tleV0gPSB0aGlzLmNvbmZpZ1trZXldO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIGNvbmZpZztcclxuICAgIH07XHJcblxyXG4gICAgX3Byb3RvLl9jbGVhblRpcENsYXNzID0gZnVuY3Rpb24gX2NsZWFuVGlwQ2xhc3MoKSB7XHJcbiAgICAgIHZhciAkdGlwID0gJCh0aGlzLmdldFRpcEVsZW1lbnQoKSk7XHJcbiAgICAgIHZhciB0YWJDbGFzcyA9ICR0aXAuYXR0cignY2xhc3MnKS5tYXRjaChCU0NMU19QUkVGSVhfUkVHRVgpO1xyXG5cclxuICAgICAgaWYgKHRhYkNsYXNzICE9PSBudWxsICYmIHRhYkNsYXNzLmxlbmd0aCkge1xyXG4gICAgICAgICR0aXAucmVtb3ZlQ2xhc3ModGFiQ2xhc3Muam9pbignJykpO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIF9wcm90by5faGFuZGxlUG9wcGVyUGxhY2VtZW50Q2hhbmdlID0gZnVuY3Rpb24gX2hhbmRsZVBvcHBlclBsYWNlbWVudENoYW5nZShwb3BwZXJEYXRhKSB7XHJcbiAgICAgIHZhciBwb3BwZXJJbnN0YW5jZSA9IHBvcHBlckRhdGEuaW5zdGFuY2U7XHJcbiAgICAgIHRoaXMudGlwID0gcG9wcGVySW5zdGFuY2UucG9wcGVyO1xyXG5cclxuICAgICAgdGhpcy5fY2xlYW5UaXBDbGFzcygpO1xyXG5cclxuICAgICAgdGhpcy5hZGRBdHRhY2htZW50Q2xhc3ModGhpcy5fZ2V0QXR0YWNobWVudChwb3BwZXJEYXRhLnBsYWNlbWVudCkpO1xyXG4gICAgfTtcclxuXHJcbiAgICBfcHJvdG8uX2ZpeFRyYW5zaXRpb24gPSBmdW5jdGlvbiBfZml4VHJhbnNpdGlvbigpIHtcclxuICAgICAgdmFyIHRpcCA9IHRoaXMuZ2V0VGlwRWxlbWVudCgpO1xyXG4gICAgICB2YXIgaW5pdENvbmZpZ0FuaW1hdGlvbiA9IHRoaXMuY29uZmlnLmFuaW1hdGlvbjtcclxuXHJcbiAgICAgIGlmICh0aXAuZ2V0QXR0cmlidXRlKCd4LXBsYWNlbWVudCcpICE9PSBudWxsKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAkKHRpcCkucmVtb3ZlQ2xhc3MoQ2xhc3NOYW1lJDYuRkFERSk7XHJcbiAgICAgIHRoaXMuY29uZmlnLmFuaW1hdGlvbiA9IGZhbHNlO1xyXG4gICAgICB0aGlzLmhpZGUoKTtcclxuICAgICAgdGhpcy5zaG93KCk7XHJcbiAgICAgIHRoaXMuY29uZmlnLmFuaW1hdGlvbiA9IGluaXRDb25maWdBbmltYXRpb247XHJcbiAgICB9OyAvLyBTdGF0aWNcclxuXHJcblxyXG4gICAgVG9vbHRpcC5falF1ZXJ5SW50ZXJmYWNlID0gZnVuY3Rpb24gX2pRdWVyeUludGVyZmFjZShjb25maWcpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGRhdGEgPSAkKHRoaXMpLmRhdGEoREFUQV9LRVkkNik7XHJcblxyXG4gICAgICAgIHZhciBfY29uZmlnID0gdHlwZW9mIGNvbmZpZyA9PT0gJ29iamVjdCcgJiYgY29uZmlnO1xyXG5cclxuICAgICAgICBpZiAoIWRhdGEgJiYgL2Rpc3Bvc2V8aGlkZS8udGVzdChjb25maWcpKSB7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIWRhdGEpIHtcclxuICAgICAgICAgIGRhdGEgPSBuZXcgVG9vbHRpcCh0aGlzLCBfY29uZmlnKTtcclxuICAgICAgICAgICQodGhpcykuZGF0YShEQVRBX0tFWSQ2LCBkYXRhKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0eXBlb2YgY29uZmlnID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgaWYgKHR5cGVvZiBkYXRhW2NvbmZpZ10gPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJObyBtZXRob2QgbmFtZWQgXFxcIlwiICsgY29uZmlnICsgXCJcXFwiXCIpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGRhdGFbY29uZmlnXSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIF9jcmVhdGVDbGFzcyhUb29sdGlwLCBudWxsLCBbe1xyXG4gICAgICBrZXk6IFwiVkVSU0lPTlwiLFxyXG4gICAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcclxuICAgICAgICByZXR1cm4gVkVSU0lPTiQ2O1xyXG4gICAgICB9XHJcbiAgICB9LCB7XHJcbiAgICAgIGtleTogXCJEZWZhdWx0XCIsXHJcbiAgICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xyXG4gICAgICAgIHJldHVybiBEZWZhdWx0JDQ7XHJcbiAgICAgIH1cclxuICAgIH0sIHtcclxuICAgICAga2V5OiBcIk5BTUVcIixcclxuICAgICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XHJcbiAgICAgICAgcmV0dXJuIE5BTUUkNjtcclxuICAgICAgfVxyXG4gICAgfSwge1xyXG4gICAgICBrZXk6IFwiREFUQV9LRVlcIixcclxuICAgICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XHJcbiAgICAgICAgcmV0dXJuIERBVEFfS0VZJDY7XHJcbiAgICAgIH1cclxuICAgIH0sIHtcclxuICAgICAga2V5OiBcIkV2ZW50XCIsXHJcbiAgICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xyXG4gICAgICAgIHJldHVybiBFdmVudCQ2O1xyXG4gICAgICB9XHJcbiAgICB9LCB7XHJcbiAgICAgIGtleTogXCJFVkVOVF9LRVlcIixcclxuICAgICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XHJcbiAgICAgICAgcmV0dXJuIEVWRU5UX0tFWSQ2O1xyXG4gICAgICB9XHJcbiAgICB9LCB7XHJcbiAgICAgIGtleTogXCJEZWZhdWx0VHlwZVwiLFxyXG4gICAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcclxuICAgICAgICByZXR1cm4gRGVmYXVsdFR5cGUkNDtcclxuICAgICAgfVxyXG4gICAgfV0pO1xyXG5cclxuICAgIHJldHVybiBUb29sdGlwO1xyXG4gIH0oKTtcclxuICAvKipcclxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgKiBqUXVlcnlcclxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgKi9cclxuXHJcblxyXG4gICQuZm5bTkFNRSQ2XSA9IFRvb2x0aXAuX2pRdWVyeUludGVyZmFjZTtcclxuICAkLmZuW05BTUUkNl0uQ29uc3RydWN0b3IgPSBUb29sdGlwO1xyXG5cclxuICAkLmZuW05BTUUkNl0ubm9Db25mbGljdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICQuZm5bTkFNRSQ2XSA9IEpRVUVSWV9OT19DT05GTElDVCQ2O1xyXG4gICAgcmV0dXJuIFRvb2x0aXAuX2pRdWVyeUludGVyZmFjZTtcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgKiBDb25zdGFudHNcclxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgKi9cclxuXHJcbiAgdmFyIE5BTUUkNyA9ICdwb3BvdmVyJztcclxuICB2YXIgVkVSU0lPTiQ3ID0gJzQuMi4xJztcclxuICB2YXIgREFUQV9LRVkkNyA9ICdicy5wb3BvdmVyJztcclxuICB2YXIgRVZFTlRfS0VZJDcgPSBcIi5cIiArIERBVEFfS0VZJDc7XHJcbiAgdmFyIEpRVUVSWV9OT19DT05GTElDVCQ3ID0gJC5mbltOQU1FJDddO1xyXG4gIHZhciBDTEFTU19QUkVGSVgkMSA9ICdicy1wb3BvdmVyJztcclxuICB2YXIgQlNDTFNfUFJFRklYX1JFR0VYJDEgPSBuZXcgUmVnRXhwKFwiKF58XFxcXHMpXCIgKyBDTEFTU19QUkVGSVgkMSArIFwiXFxcXFMrXCIsICdnJyk7XHJcblxyXG4gIHZhciBEZWZhdWx0JDUgPSBfb2JqZWN0U3ByZWFkKHt9LCBUb29sdGlwLkRlZmF1bHQsIHtcclxuICAgIHBsYWNlbWVudDogJ3JpZ2h0JyxcclxuICAgIHRyaWdnZXI6ICdjbGljaycsXHJcbiAgICBjb250ZW50OiAnJyxcclxuICAgIHRlbXBsYXRlOiAnPGRpdiBjbGFzcz1cInBvcG92ZXJcIiByb2xlPVwidG9vbHRpcFwiPicgKyAnPGRpdiBjbGFzcz1cImFycm93XCI+PC9kaXY+JyArICc8aDMgY2xhc3M9XCJwb3BvdmVyLWhlYWRlclwiPjwvaDM+JyArICc8ZGl2IGNsYXNzPVwicG9wb3Zlci1ib2R5XCI+PC9kaXY+PC9kaXY+J1xyXG4gIH0pO1xyXG5cclxuICB2YXIgRGVmYXVsdFR5cGUkNSA9IF9vYmplY3RTcHJlYWQoe30sIFRvb2x0aXAuRGVmYXVsdFR5cGUsIHtcclxuICAgIGNvbnRlbnQ6ICcoc3RyaW5nfGVsZW1lbnR8ZnVuY3Rpb24pJ1xyXG4gIH0pO1xyXG5cclxuICB2YXIgQ2xhc3NOYW1lJDcgPSB7XHJcbiAgICBGQURFOiAnZmFkZScsXHJcbiAgICBTSE9XOiAnc2hvdydcclxuICB9O1xyXG4gIHZhciBTZWxlY3RvciQ3ID0ge1xyXG4gICAgVElUTEU6ICcucG9wb3Zlci1oZWFkZXInLFxyXG4gICAgQ09OVEVOVDogJy5wb3BvdmVyLWJvZHknXHJcbiAgfTtcclxuICB2YXIgRXZlbnQkNyA9IHtcclxuICAgIEhJREU6IFwiaGlkZVwiICsgRVZFTlRfS0VZJDcsXHJcbiAgICBISURERU46IFwiaGlkZGVuXCIgKyBFVkVOVF9LRVkkNyxcclxuICAgIFNIT1c6IFwic2hvd1wiICsgRVZFTlRfS0VZJDcsXHJcbiAgICBTSE9XTjogXCJzaG93blwiICsgRVZFTlRfS0VZJDcsXHJcbiAgICBJTlNFUlRFRDogXCJpbnNlcnRlZFwiICsgRVZFTlRfS0VZJDcsXHJcbiAgICBDTElDSzogXCJjbGlja1wiICsgRVZFTlRfS0VZJDcsXHJcbiAgICBGT0NVU0lOOiBcImZvY3VzaW5cIiArIEVWRU5UX0tFWSQ3LFxyXG4gICAgRk9DVVNPVVQ6IFwiZm9jdXNvdXRcIiArIEVWRU5UX0tFWSQ3LFxyXG4gICAgTU9VU0VFTlRFUjogXCJtb3VzZWVudGVyXCIgKyBFVkVOVF9LRVkkNyxcclxuICAgIE1PVVNFTEVBVkU6IFwibW91c2VsZWF2ZVwiICsgRVZFTlRfS0VZJDdcclxuICAgIC8qKlxyXG4gICAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAgKiBDbGFzcyBEZWZpbml0aW9uXHJcbiAgICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgICAqL1xyXG5cclxuICB9O1xyXG5cclxuICB2YXIgUG9wb3ZlciA9XHJcbiAgLyojX19QVVJFX18qL1xyXG4gIGZ1bmN0aW9uIChfVG9vbHRpcCkge1xyXG4gICAgX2luaGVyaXRzTG9vc2UoUG9wb3ZlciwgX1Rvb2x0aXApO1xyXG5cclxuICAgIGZ1bmN0aW9uIFBvcG92ZXIoKSB7XHJcbiAgICAgIHJldHVybiBfVG9vbHRpcC5hcHBseSh0aGlzLCBhcmd1bWVudHMpIHx8IHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIF9wcm90byA9IFBvcG92ZXIucHJvdG90eXBlO1xyXG5cclxuICAgIC8vIE92ZXJyaWRlc1xyXG4gICAgX3Byb3RvLmlzV2l0aENvbnRlbnQgPSBmdW5jdGlvbiBpc1dpdGhDb250ZW50KCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5nZXRUaXRsZSgpIHx8IHRoaXMuX2dldENvbnRlbnQoKTtcclxuICAgIH07XHJcblxyXG4gICAgX3Byb3RvLmFkZEF0dGFjaG1lbnRDbGFzcyA9IGZ1bmN0aW9uIGFkZEF0dGFjaG1lbnRDbGFzcyhhdHRhY2htZW50KSB7XHJcbiAgICAgICQodGhpcy5nZXRUaXBFbGVtZW50KCkpLmFkZENsYXNzKENMQVNTX1BSRUZJWCQxICsgXCItXCIgKyBhdHRhY2htZW50KTtcclxuICAgIH07XHJcblxyXG4gICAgX3Byb3RvLmdldFRpcEVsZW1lbnQgPSBmdW5jdGlvbiBnZXRUaXBFbGVtZW50KCkge1xyXG4gICAgICB0aGlzLnRpcCA9IHRoaXMudGlwIHx8ICQodGhpcy5jb25maWcudGVtcGxhdGUpWzBdO1xyXG4gICAgICByZXR1cm4gdGhpcy50aXA7XHJcbiAgICB9O1xyXG5cclxuICAgIF9wcm90by5zZXRDb250ZW50ID0gZnVuY3Rpb24gc2V0Q29udGVudCgpIHtcclxuICAgICAgdmFyICR0aXAgPSAkKHRoaXMuZ2V0VGlwRWxlbWVudCgpKTsgLy8gV2UgdXNlIGFwcGVuZCBmb3IgaHRtbCBvYmplY3RzIHRvIG1haW50YWluIGpzIGV2ZW50c1xyXG5cclxuICAgICAgdGhpcy5zZXRFbGVtZW50Q29udGVudCgkdGlwLmZpbmQoU2VsZWN0b3IkNy5USVRMRSksIHRoaXMuZ2V0VGl0bGUoKSk7XHJcblxyXG4gICAgICB2YXIgY29udGVudCA9IHRoaXMuX2dldENvbnRlbnQoKTtcclxuXHJcbiAgICAgIGlmICh0eXBlb2YgY29udGVudCA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgIGNvbnRlbnQgPSBjb250ZW50LmNhbGwodGhpcy5lbGVtZW50KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5zZXRFbGVtZW50Q29udGVudCgkdGlwLmZpbmQoU2VsZWN0b3IkNy5DT05URU5UKSwgY29udGVudCk7XHJcbiAgICAgICR0aXAucmVtb3ZlQ2xhc3MoQ2xhc3NOYW1lJDcuRkFERSArIFwiIFwiICsgQ2xhc3NOYW1lJDcuU0hPVyk7XHJcbiAgICB9OyAvLyBQcml2YXRlXHJcblxyXG5cclxuICAgIF9wcm90by5fZ2V0Q29udGVudCA9IGZ1bmN0aW9uIF9nZXRDb250ZW50KCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5lbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1jb250ZW50JykgfHwgdGhpcy5jb25maWcuY29udGVudDtcclxuICAgIH07XHJcblxyXG4gICAgX3Byb3RvLl9jbGVhblRpcENsYXNzID0gZnVuY3Rpb24gX2NsZWFuVGlwQ2xhc3MoKSB7XHJcbiAgICAgIHZhciAkdGlwID0gJCh0aGlzLmdldFRpcEVsZW1lbnQoKSk7XHJcbiAgICAgIHZhciB0YWJDbGFzcyA9ICR0aXAuYXR0cignY2xhc3MnKS5tYXRjaChCU0NMU19QUkVGSVhfUkVHRVgkMSk7XHJcblxyXG4gICAgICBpZiAodGFiQ2xhc3MgIT09IG51bGwgJiYgdGFiQ2xhc3MubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICR0aXAucmVtb3ZlQ2xhc3ModGFiQ2xhc3Muam9pbignJykpO1xyXG4gICAgICB9XHJcbiAgICB9OyAvLyBTdGF0aWNcclxuXHJcblxyXG4gICAgUG9wb3Zlci5falF1ZXJ5SW50ZXJmYWNlID0gZnVuY3Rpb24gX2pRdWVyeUludGVyZmFjZShjb25maWcpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGRhdGEgPSAkKHRoaXMpLmRhdGEoREFUQV9LRVkkNyk7XHJcblxyXG4gICAgICAgIHZhciBfY29uZmlnID0gdHlwZW9mIGNvbmZpZyA9PT0gJ29iamVjdCcgPyBjb25maWcgOiBudWxsO1xyXG5cclxuICAgICAgICBpZiAoIWRhdGEgJiYgL2Rpc3Bvc2V8aGlkZS8udGVzdChjb25maWcpKSB7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIWRhdGEpIHtcclxuICAgICAgICAgIGRhdGEgPSBuZXcgUG9wb3Zlcih0aGlzLCBfY29uZmlnKTtcclxuICAgICAgICAgICQodGhpcykuZGF0YShEQVRBX0tFWSQ3LCBkYXRhKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0eXBlb2YgY29uZmlnID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgaWYgKHR5cGVvZiBkYXRhW2NvbmZpZ10gPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJObyBtZXRob2QgbmFtZWQgXFxcIlwiICsgY29uZmlnICsgXCJcXFwiXCIpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGRhdGFbY29uZmlnXSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIF9jcmVhdGVDbGFzcyhQb3BvdmVyLCBudWxsLCBbe1xyXG4gICAgICBrZXk6IFwiVkVSU0lPTlwiLFxyXG4gICAgICAvLyBHZXR0ZXJzXHJcbiAgICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xyXG4gICAgICAgIHJldHVybiBWRVJTSU9OJDc7XHJcbiAgICAgIH1cclxuICAgIH0sIHtcclxuICAgICAga2V5OiBcIkRlZmF1bHRcIixcclxuICAgICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XHJcbiAgICAgICAgcmV0dXJuIERlZmF1bHQkNTtcclxuICAgICAgfVxyXG4gICAgfSwge1xyXG4gICAgICBrZXk6IFwiTkFNRVwiLFxyXG4gICAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcclxuICAgICAgICByZXR1cm4gTkFNRSQ3O1xyXG4gICAgICB9XHJcbiAgICB9LCB7XHJcbiAgICAgIGtleTogXCJEQVRBX0tFWVwiLFxyXG4gICAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcclxuICAgICAgICByZXR1cm4gREFUQV9LRVkkNztcclxuICAgICAgfVxyXG4gICAgfSwge1xyXG4gICAgICBrZXk6IFwiRXZlbnRcIixcclxuICAgICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XHJcbiAgICAgICAgcmV0dXJuIEV2ZW50JDc7XHJcbiAgICAgIH1cclxuICAgIH0sIHtcclxuICAgICAga2V5OiBcIkVWRU5UX0tFWVwiLFxyXG4gICAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcclxuICAgICAgICByZXR1cm4gRVZFTlRfS0VZJDc7XHJcbiAgICAgIH1cclxuICAgIH0sIHtcclxuICAgICAga2V5OiBcIkRlZmF1bHRUeXBlXCIsXHJcbiAgICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xyXG4gICAgICAgIHJldHVybiBEZWZhdWx0VHlwZSQ1O1xyXG4gICAgICB9XHJcbiAgICB9XSk7XHJcblxyXG4gICAgcmV0dXJuIFBvcG92ZXI7XHJcbiAgfShUb29sdGlwKTtcclxuICAvKipcclxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgKiBqUXVlcnlcclxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgKi9cclxuXHJcblxyXG4gICQuZm5bTkFNRSQ3XSA9IFBvcG92ZXIuX2pRdWVyeUludGVyZmFjZTtcclxuICAkLmZuW05BTUUkN10uQ29uc3RydWN0b3IgPSBQb3BvdmVyO1xyXG5cclxuICAkLmZuW05BTUUkN10ubm9Db25mbGljdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICQuZm5bTkFNRSQ3XSA9IEpRVUVSWV9OT19DT05GTElDVCQ3O1xyXG4gICAgcmV0dXJuIFBvcG92ZXIuX2pRdWVyeUludGVyZmFjZTtcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgKiBDb25zdGFudHNcclxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgKi9cclxuXHJcbiAgdmFyIE5BTUUkOCA9ICdzY3JvbGxzcHknO1xyXG4gIHZhciBWRVJTSU9OJDggPSAnNC4yLjEnO1xyXG4gIHZhciBEQVRBX0tFWSQ4ID0gJ2JzLnNjcm9sbHNweSc7XHJcbiAgdmFyIEVWRU5UX0tFWSQ4ID0gXCIuXCIgKyBEQVRBX0tFWSQ4O1xyXG4gIHZhciBEQVRBX0FQSV9LRVkkNiA9ICcuZGF0YS1hcGknO1xyXG4gIHZhciBKUVVFUllfTk9fQ09ORkxJQ1QkOCA9ICQuZm5bTkFNRSQ4XTtcclxuICB2YXIgRGVmYXVsdCQ2ID0ge1xyXG4gICAgb2Zmc2V0OiAxMCxcclxuICAgIG1ldGhvZDogJ2F1dG8nLFxyXG4gICAgdGFyZ2V0OiAnJ1xyXG4gIH07XHJcbiAgdmFyIERlZmF1bHRUeXBlJDYgPSB7XHJcbiAgICBvZmZzZXQ6ICdudW1iZXInLFxyXG4gICAgbWV0aG9kOiAnc3RyaW5nJyxcclxuICAgIHRhcmdldDogJyhzdHJpbmd8ZWxlbWVudCknXHJcbiAgfTtcclxuICB2YXIgRXZlbnQkOCA9IHtcclxuICAgIEFDVElWQVRFOiBcImFjdGl2YXRlXCIgKyBFVkVOVF9LRVkkOCxcclxuICAgIFNDUk9MTDogXCJzY3JvbGxcIiArIEVWRU5UX0tFWSQ4LFxyXG4gICAgTE9BRF9EQVRBX0FQSTogXCJsb2FkXCIgKyBFVkVOVF9LRVkkOCArIERBVEFfQVBJX0tFWSQ2XHJcbiAgfTtcclxuICB2YXIgQ2xhc3NOYW1lJDggPSB7XHJcbiAgICBEUk9QRE9XTl9JVEVNOiAnZHJvcGRvd24taXRlbScsXHJcbiAgICBEUk9QRE9XTl9NRU5VOiAnZHJvcGRvd24tbWVudScsXHJcbiAgICBBQ1RJVkU6ICdhY3RpdmUnXHJcbiAgfTtcclxuICB2YXIgU2VsZWN0b3IkOCA9IHtcclxuICAgIERBVEFfU1BZOiAnW2RhdGEtc3B5PVwic2Nyb2xsXCJdJyxcclxuICAgIEFDVElWRTogJy5hY3RpdmUnLFxyXG4gICAgTkFWX0xJU1RfR1JPVVA6ICcubmF2LCAubGlzdC1ncm91cCcsXHJcbiAgICBOQVZfTElOS1M6ICcubmF2LWxpbmsnLFxyXG4gICAgTkFWX0lURU1TOiAnLm5hdi1pdGVtJyxcclxuICAgIExJU1RfSVRFTVM6ICcubGlzdC1ncm91cC1pdGVtJyxcclxuICAgIERST1BET1dOOiAnLmRyb3Bkb3duJyxcclxuICAgIERST1BET1dOX0lURU1TOiAnLmRyb3Bkb3duLWl0ZW0nLFxyXG4gICAgRFJPUERPV05fVE9HR0xFOiAnLmRyb3Bkb3duLXRvZ2dsZSdcclxuICB9O1xyXG4gIHZhciBPZmZzZXRNZXRob2QgPSB7XHJcbiAgICBPRkZTRVQ6ICdvZmZzZXQnLFxyXG4gICAgUE9TSVRJT046ICdwb3NpdGlvbidcclxuICAgIC8qKlxyXG4gICAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAgKiBDbGFzcyBEZWZpbml0aW9uXHJcbiAgICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgICAqL1xyXG5cclxuICB9O1xyXG5cclxuICB2YXIgU2Nyb2xsU3B5ID1cclxuICAvKiNfX1BVUkVfXyovXHJcbiAgZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gU2Nyb2xsU3B5KGVsZW1lbnQsIGNvbmZpZykge1xyXG4gICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG5cclxuICAgICAgdGhpcy5fZWxlbWVudCA9IGVsZW1lbnQ7XHJcbiAgICAgIHRoaXMuX3Njcm9sbEVsZW1lbnQgPSBlbGVtZW50LnRhZ05hbWUgPT09ICdCT0RZJyA/IHdpbmRvdyA6IGVsZW1lbnQ7XHJcbiAgICAgIHRoaXMuX2NvbmZpZyA9IHRoaXMuX2dldENvbmZpZyhjb25maWcpO1xyXG4gICAgICB0aGlzLl9zZWxlY3RvciA9IHRoaXMuX2NvbmZpZy50YXJnZXQgKyBcIiBcIiArIFNlbGVjdG9yJDguTkFWX0xJTktTICsgXCIsXCIgKyAodGhpcy5fY29uZmlnLnRhcmdldCArIFwiIFwiICsgU2VsZWN0b3IkOC5MSVNUX0lURU1TICsgXCIsXCIpICsgKHRoaXMuX2NvbmZpZy50YXJnZXQgKyBcIiBcIiArIFNlbGVjdG9yJDguRFJPUERPV05fSVRFTVMpO1xyXG4gICAgICB0aGlzLl9vZmZzZXRzID0gW107XHJcbiAgICAgIHRoaXMuX3RhcmdldHMgPSBbXTtcclxuICAgICAgdGhpcy5fYWN0aXZlVGFyZ2V0ID0gbnVsbDtcclxuICAgICAgdGhpcy5fc2Nyb2xsSGVpZ2h0ID0gMDtcclxuICAgICAgJCh0aGlzLl9zY3JvbGxFbGVtZW50KS5vbihFdmVudCQ4LlNDUk9MTCwgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgcmV0dXJuIF90aGlzLl9wcm9jZXNzKGV2ZW50KTtcclxuICAgICAgfSk7XHJcbiAgICAgIHRoaXMucmVmcmVzaCgpO1xyXG5cclxuICAgICAgdGhpcy5fcHJvY2VzcygpO1xyXG4gICAgfSAvLyBHZXR0ZXJzXHJcblxyXG5cclxuICAgIHZhciBfcHJvdG8gPSBTY3JvbGxTcHkucHJvdG90eXBlO1xyXG5cclxuICAgIC8vIFB1YmxpY1xyXG4gICAgX3Byb3RvLnJlZnJlc2ggPSBmdW5jdGlvbiByZWZyZXNoKCkge1xyXG4gICAgICB2YXIgX3RoaXMyID0gdGhpcztcclxuXHJcbiAgICAgIHZhciBhdXRvTWV0aG9kID0gdGhpcy5fc2Nyb2xsRWxlbWVudCA9PT0gdGhpcy5fc2Nyb2xsRWxlbWVudC53aW5kb3cgPyBPZmZzZXRNZXRob2QuT0ZGU0VUIDogT2Zmc2V0TWV0aG9kLlBPU0lUSU9OO1xyXG4gICAgICB2YXIgb2Zmc2V0TWV0aG9kID0gdGhpcy5fY29uZmlnLm1ldGhvZCA9PT0gJ2F1dG8nID8gYXV0b01ldGhvZCA6IHRoaXMuX2NvbmZpZy5tZXRob2Q7XHJcbiAgICAgIHZhciBvZmZzZXRCYXNlID0gb2Zmc2V0TWV0aG9kID09PSBPZmZzZXRNZXRob2QuUE9TSVRJT04gPyB0aGlzLl9nZXRTY3JvbGxUb3AoKSA6IDA7XHJcbiAgICAgIHRoaXMuX29mZnNldHMgPSBbXTtcclxuICAgICAgdGhpcy5fdGFyZ2V0cyA9IFtdO1xyXG4gICAgICB0aGlzLl9zY3JvbGxIZWlnaHQgPSB0aGlzLl9nZXRTY3JvbGxIZWlnaHQoKTtcclxuICAgICAgdmFyIHRhcmdldHMgPSBbXS5zbGljZS5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwodGhpcy5fc2VsZWN0b3IpKTtcclxuICAgICAgdGFyZ2V0cy5tYXAoZnVuY3Rpb24gKGVsZW1lbnQpIHtcclxuICAgICAgICB2YXIgdGFyZ2V0O1xyXG4gICAgICAgIHZhciB0YXJnZXRTZWxlY3RvciA9IFV0aWwuZ2V0U2VsZWN0b3JGcm9tRWxlbWVudChlbGVtZW50KTtcclxuXHJcbiAgICAgICAgaWYgKHRhcmdldFNlbGVjdG9yKSB7XHJcbiAgICAgICAgICB0YXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRhcmdldFNlbGVjdG9yKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0YXJnZXQpIHtcclxuICAgICAgICAgIHZhciB0YXJnZXRCQ1IgPSB0YXJnZXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcblxyXG4gICAgICAgICAgaWYgKHRhcmdldEJDUi53aWR0aCB8fCB0YXJnZXRCQ1IuaGVpZ2h0KSB7XHJcbiAgICAgICAgICAgIC8vIFRPRE8gKGZhdCk6IHJlbW92ZSBza2V0Y2ggcmVsaWFuY2Ugb24galF1ZXJ5IHBvc2l0aW9uL29mZnNldFxyXG4gICAgICAgICAgICByZXR1cm4gWyQodGFyZ2V0KVtvZmZzZXRNZXRob2RdKCkudG9wICsgb2Zmc2V0QmFzZSwgdGFyZ2V0U2VsZWN0b3JdO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgIH0pLmZpbHRlcihmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgIHJldHVybiBpdGVtO1xyXG4gICAgICB9KS5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgICAgICAgcmV0dXJuIGFbMF0gLSBiWzBdO1xyXG4gICAgICB9KS5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgX3RoaXMyLl9vZmZzZXRzLnB1c2goaXRlbVswXSk7XHJcblxyXG4gICAgICAgIF90aGlzMi5fdGFyZ2V0cy5wdXNoKGl0ZW1bMV0pO1xyXG4gICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgX3Byb3RvLmRpc3Bvc2UgPSBmdW5jdGlvbiBkaXNwb3NlKCkge1xyXG4gICAgICAkLnJlbW92ZURhdGEodGhpcy5fZWxlbWVudCwgREFUQV9LRVkkOCk7XHJcbiAgICAgICQodGhpcy5fc2Nyb2xsRWxlbWVudCkub2ZmKEVWRU5UX0tFWSQ4KTtcclxuICAgICAgdGhpcy5fZWxlbWVudCA9IG51bGw7XHJcbiAgICAgIHRoaXMuX3Njcm9sbEVsZW1lbnQgPSBudWxsO1xyXG4gICAgICB0aGlzLl9jb25maWcgPSBudWxsO1xyXG4gICAgICB0aGlzLl9zZWxlY3RvciA9IG51bGw7XHJcbiAgICAgIHRoaXMuX29mZnNldHMgPSBudWxsO1xyXG4gICAgICB0aGlzLl90YXJnZXRzID0gbnVsbDtcclxuICAgICAgdGhpcy5fYWN0aXZlVGFyZ2V0ID0gbnVsbDtcclxuICAgICAgdGhpcy5fc2Nyb2xsSGVpZ2h0ID0gbnVsbDtcclxuICAgIH07IC8vIFByaXZhdGVcclxuXHJcblxyXG4gICAgX3Byb3RvLl9nZXRDb25maWcgPSBmdW5jdGlvbiBfZ2V0Q29uZmlnKGNvbmZpZykge1xyXG4gICAgICBjb25maWcgPSBfb2JqZWN0U3ByZWFkKHt9LCBEZWZhdWx0JDYsIHR5cGVvZiBjb25maWcgPT09ICdvYmplY3QnICYmIGNvbmZpZyA/IGNvbmZpZyA6IHt9KTtcclxuXHJcbiAgICAgIGlmICh0eXBlb2YgY29uZmlnLnRhcmdldCAhPT0gJ3N0cmluZycpIHtcclxuICAgICAgICB2YXIgaWQgPSAkKGNvbmZpZy50YXJnZXQpLmF0dHIoJ2lkJyk7XHJcblxyXG4gICAgICAgIGlmICghaWQpIHtcclxuICAgICAgICAgIGlkID0gVXRpbC5nZXRVSUQoTkFNRSQ4KTtcclxuICAgICAgICAgICQoY29uZmlnLnRhcmdldCkuYXR0cignaWQnLCBpZCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25maWcudGFyZ2V0ID0gXCIjXCIgKyBpZDtcclxuICAgICAgfVxyXG5cclxuICAgICAgVXRpbC50eXBlQ2hlY2tDb25maWcoTkFNRSQ4LCBjb25maWcsIERlZmF1bHRUeXBlJDYpO1xyXG4gICAgICByZXR1cm4gY29uZmlnO1xyXG4gICAgfTtcclxuXHJcbiAgICBfcHJvdG8uX2dldFNjcm9sbFRvcCA9IGZ1bmN0aW9uIF9nZXRTY3JvbGxUb3AoKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLl9zY3JvbGxFbGVtZW50ID09PSB3aW5kb3cgPyB0aGlzLl9zY3JvbGxFbGVtZW50LnBhZ2VZT2Zmc2V0IDogdGhpcy5fc2Nyb2xsRWxlbWVudC5zY3JvbGxUb3A7XHJcbiAgICB9O1xyXG5cclxuICAgIF9wcm90by5fZ2V0U2Nyb2xsSGVpZ2h0ID0gZnVuY3Rpb24gX2dldFNjcm9sbEhlaWdodCgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuX3Njcm9sbEVsZW1lbnQuc2Nyb2xsSGVpZ2h0IHx8IE1hdGgubWF4KGRvY3VtZW50LmJvZHkuc2Nyb2xsSGVpZ2h0LCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsSGVpZ2h0KTtcclxuICAgIH07XHJcblxyXG4gICAgX3Byb3RvLl9nZXRPZmZzZXRIZWlnaHQgPSBmdW5jdGlvbiBfZ2V0T2Zmc2V0SGVpZ2h0KCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5fc2Nyb2xsRWxlbWVudCA9PT0gd2luZG93ID8gd2luZG93LmlubmVySGVpZ2h0IDogdGhpcy5fc2Nyb2xsRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQ7XHJcbiAgICB9O1xyXG5cclxuICAgIF9wcm90by5fcHJvY2VzcyA9IGZ1bmN0aW9uIF9wcm9jZXNzKCkge1xyXG4gICAgICB2YXIgc2Nyb2xsVG9wID0gdGhpcy5fZ2V0U2Nyb2xsVG9wKCkgKyB0aGlzLl9jb25maWcub2Zmc2V0O1xyXG5cclxuICAgICAgdmFyIHNjcm9sbEhlaWdodCA9IHRoaXMuX2dldFNjcm9sbEhlaWdodCgpO1xyXG5cclxuICAgICAgdmFyIG1heFNjcm9sbCA9IHRoaXMuX2NvbmZpZy5vZmZzZXQgKyBzY3JvbGxIZWlnaHQgLSB0aGlzLl9nZXRPZmZzZXRIZWlnaHQoKTtcclxuXHJcbiAgICAgIGlmICh0aGlzLl9zY3JvbGxIZWlnaHQgIT09IHNjcm9sbEhlaWdodCkge1xyXG4gICAgICAgIHRoaXMucmVmcmVzaCgpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoc2Nyb2xsVG9wID49IG1heFNjcm9sbCkge1xyXG4gICAgICAgIHZhciB0YXJnZXQgPSB0aGlzLl90YXJnZXRzW3RoaXMuX3RhcmdldHMubGVuZ3RoIC0gMV07XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9hY3RpdmVUYXJnZXQgIT09IHRhcmdldCkge1xyXG4gICAgICAgICAgdGhpcy5fYWN0aXZhdGUodGFyZ2V0KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHRoaXMuX2FjdGl2ZVRhcmdldCAmJiBzY3JvbGxUb3AgPCB0aGlzLl9vZmZzZXRzWzBdICYmIHRoaXMuX29mZnNldHNbMF0gPiAwKSB7XHJcbiAgICAgICAgdGhpcy5fYWN0aXZlVGFyZ2V0ID0gbnVsbDtcclxuXHJcbiAgICAgICAgdGhpcy5fY2xlYXIoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB2YXIgb2Zmc2V0TGVuZ3RoID0gdGhpcy5fb2Zmc2V0cy5sZW5ndGg7XHJcblxyXG4gICAgICBmb3IgKHZhciBpID0gb2Zmc2V0TGVuZ3RoOyBpLS07KSB7XHJcbiAgICAgICAgdmFyIGlzQWN0aXZlVGFyZ2V0ID0gdGhpcy5fYWN0aXZlVGFyZ2V0ICE9PSB0aGlzLl90YXJnZXRzW2ldICYmIHNjcm9sbFRvcCA+PSB0aGlzLl9vZmZzZXRzW2ldICYmICh0eXBlb2YgdGhpcy5fb2Zmc2V0c1tpICsgMV0gPT09ICd1bmRlZmluZWQnIHx8IHNjcm9sbFRvcCA8IHRoaXMuX29mZnNldHNbaSArIDFdKTtcclxuXHJcbiAgICAgICAgaWYgKGlzQWN0aXZlVGFyZ2V0KSB7XHJcbiAgICAgICAgICB0aGlzLl9hY3RpdmF0ZSh0aGlzLl90YXJnZXRzW2ldKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgX3Byb3RvLl9hY3RpdmF0ZSA9IGZ1bmN0aW9uIF9hY3RpdmF0ZSh0YXJnZXQpIHtcclxuICAgICAgdGhpcy5fYWN0aXZlVGFyZ2V0ID0gdGFyZ2V0O1xyXG5cclxuICAgICAgdGhpcy5fY2xlYXIoKTtcclxuXHJcbiAgICAgIHZhciBxdWVyaWVzID0gdGhpcy5fc2VsZWN0b3Iuc3BsaXQoJywnKS5tYXAoZnVuY3Rpb24gKHNlbGVjdG9yKSB7XHJcbiAgICAgICAgcmV0dXJuIHNlbGVjdG9yICsgXCJbZGF0YS10YXJnZXQ9XFxcIlwiICsgdGFyZ2V0ICsgXCJcXFwiXSxcIiArIHNlbGVjdG9yICsgXCJbaHJlZj1cXFwiXCIgKyB0YXJnZXQgKyBcIlxcXCJdXCI7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgdmFyICRsaW5rID0gJChbXS5zbGljZS5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwocXVlcmllcy5qb2luKCcsJykpKSk7XHJcblxyXG4gICAgICBpZiAoJGxpbmsuaGFzQ2xhc3MoQ2xhc3NOYW1lJDguRFJPUERPV05fSVRFTSkpIHtcclxuICAgICAgICAkbGluay5jbG9zZXN0KFNlbGVjdG9yJDguRFJPUERPV04pLmZpbmQoU2VsZWN0b3IkOC5EUk9QRE9XTl9UT0dHTEUpLmFkZENsYXNzKENsYXNzTmFtZSQ4LkFDVElWRSk7XHJcbiAgICAgICAgJGxpbmsuYWRkQ2xhc3MoQ2xhc3NOYW1lJDguQUNUSVZFKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAvLyBTZXQgdHJpZ2dlcmVkIGxpbmsgYXMgYWN0aXZlXHJcbiAgICAgICAgJGxpbmsuYWRkQ2xhc3MoQ2xhc3NOYW1lJDguQUNUSVZFKTsgLy8gU2V0IHRyaWdnZXJlZCBsaW5rcyBwYXJlbnRzIGFzIGFjdGl2ZVxyXG4gICAgICAgIC8vIFdpdGggYm90aCA8dWw+IGFuZCA8bmF2PiBtYXJrdXAgYSBwYXJlbnQgaXMgdGhlIHByZXZpb3VzIHNpYmxpbmcgb2YgYW55IG5hdiBhbmNlc3RvclxyXG5cclxuICAgICAgICAkbGluay5wYXJlbnRzKFNlbGVjdG9yJDguTkFWX0xJU1RfR1JPVVApLnByZXYoU2VsZWN0b3IkOC5OQVZfTElOS1MgKyBcIiwgXCIgKyBTZWxlY3RvciQ4LkxJU1RfSVRFTVMpLmFkZENsYXNzKENsYXNzTmFtZSQ4LkFDVElWRSk7IC8vIEhhbmRsZSBzcGVjaWFsIGNhc2Ugd2hlbiAubmF2LWxpbmsgaXMgaW5zaWRlIC5uYXYtaXRlbVxyXG5cclxuICAgICAgICAkbGluay5wYXJlbnRzKFNlbGVjdG9yJDguTkFWX0xJU1RfR1JPVVApLnByZXYoU2VsZWN0b3IkOC5OQVZfSVRFTVMpLmNoaWxkcmVuKFNlbGVjdG9yJDguTkFWX0xJTktTKS5hZGRDbGFzcyhDbGFzc05hbWUkOC5BQ1RJVkUpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAkKHRoaXMuX3Njcm9sbEVsZW1lbnQpLnRyaWdnZXIoRXZlbnQkOC5BQ1RJVkFURSwge1xyXG4gICAgICAgIHJlbGF0ZWRUYXJnZXQ6IHRhcmdldFxyXG4gICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgX3Byb3RvLl9jbGVhciA9IGZ1bmN0aW9uIF9jbGVhcigpIHtcclxuICAgICAgW10uc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHRoaXMuX3NlbGVjdG9yKSkuZmlsdGVyKGZ1bmN0aW9uIChub2RlKSB7XHJcbiAgICAgICAgcmV0dXJuIG5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKENsYXNzTmFtZSQ4LkFDVElWRSk7XHJcbiAgICAgIH0pLmZvckVhY2goZnVuY3Rpb24gKG5vZGUpIHtcclxuICAgICAgICByZXR1cm4gbm9kZS5jbGFzc0xpc3QucmVtb3ZlKENsYXNzTmFtZSQ4LkFDVElWRSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfTsgLy8gU3RhdGljXHJcblxyXG5cclxuICAgIFNjcm9sbFNweS5falF1ZXJ5SW50ZXJmYWNlID0gZnVuY3Rpb24gX2pRdWVyeUludGVyZmFjZShjb25maWcpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGRhdGEgPSAkKHRoaXMpLmRhdGEoREFUQV9LRVkkOCk7XHJcblxyXG4gICAgICAgIHZhciBfY29uZmlnID0gdHlwZW9mIGNvbmZpZyA9PT0gJ29iamVjdCcgJiYgY29uZmlnO1xyXG5cclxuICAgICAgICBpZiAoIWRhdGEpIHtcclxuICAgICAgICAgIGRhdGEgPSBuZXcgU2Nyb2xsU3B5KHRoaXMsIF9jb25maWcpO1xyXG4gICAgICAgICAgJCh0aGlzKS5kYXRhKERBVEFfS0VZJDgsIGRhdGEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHR5cGVvZiBjb25maWcgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICBpZiAodHlwZW9mIGRhdGFbY29uZmlnXSA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIk5vIG1ldGhvZCBuYW1lZCBcXFwiXCIgKyBjb25maWcgKyBcIlxcXCJcIik7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgZGF0YVtjb25maWddKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgX2NyZWF0ZUNsYXNzKFNjcm9sbFNweSwgbnVsbCwgW3tcclxuICAgICAga2V5OiBcIlZFUlNJT05cIixcclxuICAgICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XHJcbiAgICAgICAgcmV0dXJuIFZFUlNJT04kODtcclxuICAgICAgfVxyXG4gICAgfSwge1xyXG4gICAgICBrZXk6IFwiRGVmYXVsdFwiLFxyXG4gICAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcclxuICAgICAgICByZXR1cm4gRGVmYXVsdCQ2O1xyXG4gICAgICB9XHJcbiAgICB9XSk7XHJcblxyXG4gICAgcmV0dXJuIFNjcm9sbFNweTtcclxuICB9KCk7XHJcbiAgLyoqXHJcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICogRGF0YSBBcGkgaW1wbGVtZW50YXRpb25cclxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgKi9cclxuXHJcblxyXG4gICQod2luZG93KS5vbihFdmVudCQ4LkxPQURfREFUQV9BUEksIGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBzY3JvbGxTcHlzID0gW10uc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFNlbGVjdG9yJDguREFUQV9TUFkpKTtcclxuICAgIHZhciBzY3JvbGxTcHlzTGVuZ3RoID0gc2Nyb2xsU3B5cy5sZW5ndGg7XHJcblxyXG4gICAgZm9yICh2YXIgaSA9IHNjcm9sbFNweXNMZW5ndGg7IGktLTspIHtcclxuICAgICAgdmFyICRzcHkgPSAkKHNjcm9sbFNweXNbaV0pO1xyXG5cclxuICAgICAgU2Nyb2xsU3B5Ll9qUXVlcnlJbnRlcmZhY2UuY2FsbCgkc3B5LCAkc3B5LmRhdGEoKSk7XHJcbiAgICB9XHJcbiAgfSk7XHJcbiAgLyoqXHJcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICogalF1ZXJ5XHJcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICovXHJcblxyXG4gICQuZm5bTkFNRSQ4XSA9IFNjcm9sbFNweS5falF1ZXJ5SW50ZXJmYWNlO1xyXG4gICQuZm5bTkFNRSQ4XS5Db25zdHJ1Y3RvciA9IFNjcm9sbFNweTtcclxuXHJcbiAgJC5mbltOQU1FJDhdLm5vQ29uZmxpY3QgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAkLmZuW05BTUUkOF0gPSBKUVVFUllfTk9fQ09ORkxJQ1QkODtcclxuICAgIHJldHVybiBTY3JvbGxTcHkuX2pRdWVyeUludGVyZmFjZTtcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgKiBDb25zdGFudHNcclxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgKi9cclxuXHJcbiAgdmFyIE5BTUUkOSA9ICd0YWInO1xyXG4gIHZhciBWRVJTSU9OJDkgPSAnNC4yLjEnO1xyXG4gIHZhciBEQVRBX0tFWSQ5ID0gJ2JzLnRhYic7XHJcbiAgdmFyIEVWRU5UX0tFWSQ5ID0gXCIuXCIgKyBEQVRBX0tFWSQ5O1xyXG4gIHZhciBEQVRBX0FQSV9LRVkkNyA9ICcuZGF0YS1hcGknO1xyXG4gIHZhciBKUVVFUllfTk9fQ09ORkxJQ1QkOSA9ICQuZm5bTkFNRSQ5XTtcclxuICB2YXIgRXZlbnQkOSA9IHtcclxuICAgIEhJREU6IFwiaGlkZVwiICsgRVZFTlRfS0VZJDksXHJcbiAgICBISURERU46IFwiaGlkZGVuXCIgKyBFVkVOVF9LRVkkOSxcclxuICAgIFNIT1c6IFwic2hvd1wiICsgRVZFTlRfS0VZJDksXHJcbiAgICBTSE9XTjogXCJzaG93blwiICsgRVZFTlRfS0VZJDksXHJcbiAgICBDTElDS19EQVRBX0FQSTogXCJjbGlja1wiICsgRVZFTlRfS0VZJDkgKyBEQVRBX0FQSV9LRVkkN1xyXG4gIH07XHJcbiAgdmFyIENsYXNzTmFtZSQ5ID0ge1xyXG4gICAgRFJPUERPV05fTUVOVTogJ2Ryb3Bkb3duLW1lbnUnLFxyXG4gICAgQUNUSVZFOiAnYWN0aXZlJyxcclxuICAgIERJU0FCTEVEOiAnZGlzYWJsZWQnLFxyXG4gICAgRkFERTogJ2ZhZGUnLFxyXG4gICAgU0hPVzogJ3Nob3cnXHJcbiAgfTtcclxuICB2YXIgU2VsZWN0b3IkOSA9IHtcclxuICAgIERST1BET1dOOiAnLmRyb3Bkb3duJyxcclxuICAgIE5BVl9MSVNUX0dST1VQOiAnLm5hdiwgLmxpc3QtZ3JvdXAnLFxyXG4gICAgQUNUSVZFOiAnLmFjdGl2ZScsXHJcbiAgICBBQ1RJVkVfVUw6ICc+IGxpID4gLmFjdGl2ZScsXHJcbiAgICBEQVRBX1RPR0dMRTogJ1tkYXRhLXRvZ2dsZT1cInRhYlwiXSwgW2RhdGEtdG9nZ2xlPVwicGlsbFwiXSwgW2RhdGEtdG9nZ2xlPVwibGlzdFwiXScsXHJcbiAgICBEUk9QRE9XTl9UT0dHTEU6ICcuZHJvcGRvd24tdG9nZ2xlJyxcclxuICAgIERST1BET1dOX0FDVElWRV9DSElMRDogJz4gLmRyb3Bkb3duLW1lbnUgLmFjdGl2ZSdcclxuICAgIC8qKlxyXG4gICAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAgKiBDbGFzcyBEZWZpbml0aW9uXHJcbiAgICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgICAqL1xyXG5cclxuICB9O1xyXG5cclxuICB2YXIgVGFiID1cclxuICAvKiNfX1BVUkVfXyovXHJcbiAgZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gVGFiKGVsZW1lbnQpIHtcclxuICAgICAgdGhpcy5fZWxlbWVudCA9IGVsZW1lbnQ7XHJcbiAgICB9IC8vIEdldHRlcnNcclxuXHJcblxyXG4gICAgdmFyIF9wcm90byA9IFRhYi5wcm90b3R5cGU7XHJcblxyXG4gICAgLy8gUHVibGljXHJcbiAgICBfcHJvdG8uc2hvdyA9IGZ1bmN0aW9uIHNob3coKSB7XHJcbiAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcblxyXG4gICAgICBpZiAodGhpcy5fZWxlbWVudC5wYXJlbnROb2RlICYmIHRoaXMuX2VsZW1lbnQucGFyZW50Tm9kZS5ub2RlVHlwZSA9PT0gTm9kZS5FTEVNRU5UX05PREUgJiYgJCh0aGlzLl9lbGVtZW50KS5oYXNDbGFzcyhDbGFzc05hbWUkOS5BQ1RJVkUpIHx8ICQodGhpcy5fZWxlbWVudCkuaGFzQ2xhc3MoQ2xhc3NOYW1lJDkuRElTQUJMRUQpKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB2YXIgdGFyZ2V0O1xyXG4gICAgICB2YXIgcHJldmlvdXM7XHJcbiAgICAgIHZhciBsaXN0RWxlbWVudCA9ICQodGhpcy5fZWxlbWVudCkuY2xvc2VzdChTZWxlY3RvciQ5Lk5BVl9MSVNUX0dST1VQKVswXTtcclxuICAgICAgdmFyIHNlbGVjdG9yID0gVXRpbC5nZXRTZWxlY3RvckZyb21FbGVtZW50KHRoaXMuX2VsZW1lbnQpO1xyXG5cclxuICAgICAgaWYgKGxpc3RFbGVtZW50KSB7XHJcbiAgICAgICAgdmFyIGl0ZW1TZWxlY3RvciA9IGxpc3RFbGVtZW50Lm5vZGVOYW1lID09PSAnVUwnIHx8IGxpc3RFbGVtZW50Lm5vZGVOYW1lID09PSAnT0wnID8gU2VsZWN0b3IkOS5BQ1RJVkVfVUwgOiBTZWxlY3RvciQ5LkFDVElWRTtcclxuICAgICAgICBwcmV2aW91cyA9ICQubWFrZUFycmF5KCQobGlzdEVsZW1lbnQpLmZpbmQoaXRlbVNlbGVjdG9yKSk7XHJcbiAgICAgICAgcHJldmlvdXMgPSBwcmV2aW91c1twcmV2aW91cy5sZW5ndGggLSAxXTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdmFyIGhpZGVFdmVudCA9ICQuRXZlbnQoRXZlbnQkOS5ISURFLCB7XHJcbiAgICAgICAgcmVsYXRlZFRhcmdldDogdGhpcy5fZWxlbWVudFxyXG4gICAgICB9KTtcclxuICAgICAgdmFyIHNob3dFdmVudCA9ICQuRXZlbnQoRXZlbnQkOS5TSE9XLCB7XHJcbiAgICAgICAgcmVsYXRlZFRhcmdldDogcHJldmlvdXNcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBpZiAocHJldmlvdXMpIHtcclxuICAgICAgICAkKHByZXZpb3VzKS50cmlnZ2VyKGhpZGVFdmVudCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgICQodGhpcy5fZWxlbWVudCkudHJpZ2dlcihzaG93RXZlbnQpO1xyXG5cclxuICAgICAgaWYgKHNob3dFdmVudC5pc0RlZmF1bHRQcmV2ZW50ZWQoKSB8fCBoaWRlRXZlbnQuaXNEZWZhdWx0UHJldmVudGVkKCkpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChzZWxlY3Rvcikge1xyXG4gICAgICAgIHRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLl9hY3RpdmF0ZSh0aGlzLl9lbGVtZW50LCBsaXN0RWxlbWVudCk7XHJcblxyXG4gICAgICB2YXIgY29tcGxldGUgPSBmdW5jdGlvbiBjb21wbGV0ZSgpIHtcclxuICAgICAgICB2YXIgaGlkZGVuRXZlbnQgPSAkLkV2ZW50KEV2ZW50JDkuSElEREVOLCB7XHJcbiAgICAgICAgICByZWxhdGVkVGFyZ2V0OiBfdGhpcy5fZWxlbWVudFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHZhciBzaG93bkV2ZW50ID0gJC5FdmVudChFdmVudCQ5LlNIT1dOLCB7XHJcbiAgICAgICAgICByZWxhdGVkVGFyZ2V0OiBwcmV2aW91c1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgICQocHJldmlvdXMpLnRyaWdnZXIoaGlkZGVuRXZlbnQpO1xyXG4gICAgICAgICQoX3RoaXMuX2VsZW1lbnQpLnRyaWdnZXIoc2hvd25FdmVudCk7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICBpZiAodGFyZ2V0KSB7XHJcbiAgICAgICAgdGhpcy5fYWN0aXZhdGUodGFyZ2V0LCB0YXJnZXQucGFyZW50Tm9kZSwgY29tcGxldGUpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNvbXBsZXRlKCk7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgX3Byb3RvLmRpc3Bvc2UgPSBmdW5jdGlvbiBkaXNwb3NlKCkge1xyXG4gICAgICAkLnJlbW92ZURhdGEodGhpcy5fZWxlbWVudCwgREFUQV9LRVkkOSk7XHJcbiAgICAgIHRoaXMuX2VsZW1lbnQgPSBudWxsO1xyXG4gICAgfTsgLy8gUHJpdmF0ZVxyXG5cclxuXHJcbiAgICBfcHJvdG8uX2FjdGl2YXRlID0gZnVuY3Rpb24gX2FjdGl2YXRlKGVsZW1lbnQsIGNvbnRhaW5lciwgY2FsbGJhY2spIHtcclxuICAgICAgdmFyIF90aGlzMiA9IHRoaXM7XHJcblxyXG4gICAgICB2YXIgYWN0aXZlRWxlbWVudHMgPSBjb250YWluZXIgJiYgKGNvbnRhaW5lci5ub2RlTmFtZSA9PT0gJ1VMJyB8fCBjb250YWluZXIubm9kZU5hbWUgPT09ICdPTCcpID8gJChjb250YWluZXIpLmZpbmQoU2VsZWN0b3IkOS5BQ1RJVkVfVUwpIDogJChjb250YWluZXIpLmNoaWxkcmVuKFNlbGVjdG9yJDkuQUNUSVZFKTtcclxuICAgICAgdmFyIGFjdGl2ZSA9IGFjdGl2ZUVsZW1lbnRzWzBdO1xyXG4gICAgICB2YXIgaXNUcmFuc2l0aW9uaW5nID0gY2FsbGJhY2sgJiYgYWN0aXZlICYmICQoYWN0aXZlKS5oYXNDbGFzcyhDbGFzc05hbWUkOS5GQURFKTtcclxuXHJcbiAgICAgIHZhciBjb21wbGV0ZSA9IGZ1bmN0aW9uIGNvbXBsZXRlKCkge1xyXG4gICAgICAgIHJldHVybiBfdGhpczIuX3RyYW5zaXRpb25Db21wbGV0ZShlbGVtZW50LCBhY3RpdmUsIGNhbGxiYWNrKTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgIGlmIChhY3RpdmUgJiYgaXNUcmFuc2l0aW9uaW5nKSB7XHJcbiAgICAgICAgdmFyIHRyYW5zaXRpb25EdXJhdGlvbiA9IFV0aWwuZ2V0VHJhbnNpdGlvbkR1cmF0aW9uRnJvbUVsZW1lbnQoYWN0aXZlKTtcclxuICAgICAgICAkKGFjdGl2ZSkucmVtb3ZlQ2xhc3MoQ2xhc3NOYW1lJDkuU0hPVykub25lKFV0aWwuVFJBTlNJVElPTl9FTkQsIGNvbXBsZXRlKS5lbXVsYXRlVHJhbnNpdGlvbkVuZCh0cmFuc2l0aW9uRHVyYXRpb24pO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNvbXBsZXRlKCk7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgX3Byb3RvLl90cmFuc2l0aW9uQ29tcGxldGUgPSBmdW5jdGlvbiBfdHJhbnNpdGlvbkNvbXBsZXRlKGVsZW1lbnQsIGFjdGl2ZSwgY2FsbGJhY2spIHtcclxuICAgICAgaWYgKGFjdGl2ZSkge1xyXG4gICAgICAgICQoYWN0aXZlKS5yZW1vdmVDbGFzcyhDbGFzc05hbWUkOS5BQ1RJVkUpO1xyXG4gICAgICAgIHZhciBkcm9wZG93bkNoaWxkID0gJChhY3RpdmUucGFyZW50Tm9kZSkuZmluZChTZWxlY3RvciQ5LkRST1BET1dOX0FDVElWRV9DSElMRClbMF07XHJcblxyXG4gICAgICAgIGlmIChkcm9wZG93bkNoaWxkKSB7XHJcbiAgICAgICAgICAkKGRyb3Bkb3duQ2hpbGQpLnJlbW92ZUNsYXNzKENsYXNzTmFtZSQ5LkFDVElWRSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoYWN0aXZlLmdldEF0dHJpYnV0ZSgncm9sZScpID09PSAndGFiJykge1xyXG4gICAgICAgICAgYWN0aXZlLnNldEF0dHJpYnV0ZSgnYXJpYS1zZWxlY3RlZCcsIGZhbHNlKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgICQoZWxlbWVudCkuYWRkQ2xhc3MoQ2xhc3NOYW1lJDkuQUNUSVZFKTtcclxuXHJcbiAgICAgIGlmIChlbGVtZW50LmdldEF0dHJpYnV0ZSgncm9sZScpID09PSAndGFiJykge1xyXG4gICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdhcmlhLXNlbGVjdGVkJywgdHJ1ZSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIFV0aWwucmVmbG93KGVsZW1lbnQpO1xyXG4gICAgICAkKGVsZW1lbnQpLmFkZENsYXNzKENsYXNzTmFtZSQ5LlNIT1cpO1xyXG5cclxuICAgICAgaWYgKGVsZW1lbnQucGFyZW50Tm9kZSAmJiAkKGVsZW1lbnQucGFyZW50Tm9kZSkuaGFzQ2xhc3MoQ2xhc3NOYW1lJDkuRFJPUERPV05fTUVOVSkpIHtcclxuICAgICAgICB2YXIgZHJvcGRvd25FbGVtZW50ID0gJChlbGVtZW50KS5jbG9zZXN0KFNlbGVjdG9yJDkuRFJPUERPV04pWzBdO1xyXG5cclxuICAgICAgICBpZiAoZHJvcGRvd25FbGVtZW50KSB7XHJcbiAgICAgICAgICB2YXIgZHJvcGRvd25Ub2dnbGVMaXN0ID0gW10uc2xpY2UuY2FsbChkcm9wZG93bkVsZW1lbnQucXVlcnlTZWxlY3RvckFsbChTZWxlY3RvciQ5LkRST1BET1dOX1RPR0dMRSkpO1xyXG4gICAgICAgICAgJChkcm9wZG93blRvZ2dsZUxpc3QpLmFkZENsYXNzKENsYXNzTmFtZSQ5LkFDVElWRSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsIHRydWUpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoY2FsbGJhY2spIHtcclxuICAgICAgICBjYWxsYmFjaygpO1xyXG4gICAgICB9XHJcbiAgICB9OyAvLyBTdGF0aWNcclxuXHJcblxyXG4gICAgVGFiLl9qUXVlcnlJbnRlcmZhY2UgPSBmdW5jdGlvbiBfalF1ZXJ5SW50ZXJmYWNlKGNvbmZpZykge1xyXG4gICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpO1xyXG4gICAgICAgIHZhciBkYXRhID0gJHRoaXMuZGF0YShEQVRBX0tFWSQ5KTtcclxuXHJcbiAgICAgICAgaWYgKCFkYXRhKSB7XHJcbiAgICAgICAgICBkYXRhID0gbmV3IFRhYih0aGlzKTtcclxuICAgICAgICAgICR0aGlzLmRhdGEoREFUQV9LRVkkOSwgZGF0YSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodHlwZW9mIGNvbmZpZyA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgIGlmICh0eXBlb2YgZGF0YVtjb25maWddID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiTm8gbWV0aG9kIG5hbWVkIFxcXCJcIiArIGNvbmZpZyArIFwiXFxcIlwiKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBkYXRhW2NvbmZpZ10oKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICBfY3JlYXRlQ2xhc3MoVGFiLCBudWxsLCBbe1xyXG4gICAgICBrZXk6IFwiVkVSU0lPTlwiLFxyXG4gICAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcclxuICAgICAgICByZXR1cm4gVkVSU0lPTiQ5O1xyXG4gICAgICB9XHJcbiAgICB9XSk7XHJcblxyXG4gICAgcmV0dXJuIFRhYjtcclxuICB9KCk7XHJcbiAgLyoqXHJcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICogRGF0YSBBcGkgaW1wbGVtZW50YXRpb25cclxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgKi9cclxuXHJcblxyXG4gICQoZG9jdW1lbnQpLm9uKEV2ZW50JDkuQ0xJQ0tfREFUQV9BUEksIFNlbGVjdG9yJDkuREFUQV9UT0dHTEUsIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICBUYWIuX2pRdWVyeUludGVyZmFjZS5jYWxsKCQodGhpcyksICdzaG93Jyk7XHJcbiAgfSk7XHJcbiAgLyoqXHJcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICogalF1ZXJ5XHJcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICovXHJcblxyXG4gICQuZm5bTkFNRSQ5XSA9IFRhYi5falF1ZXJ5SW50ZXJmYWNlO1xyXG4gICQuZm5bTkFNRSQ5XS5Db25zdHJ1Y3RvciA9IFRhYjtcclxuXHJcbiAgJC5mbltOQU1FJDldLm5vQ29uZmxpY3QgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAkLmZuW05BTUUkOV0gPSBKUVVFUllfTk9fQ09ORkxJQ1QkOTtcclxuICAgIHJldHVybiBUYWIuX2pRdWVyeUludGVyZmFjZTtcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgKiBDb25zdGFudHNcclxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgKi9cclxuXHJcbiAgdmFyIE5BTUUkYSA9ICd0b2FzdCc7XHJcbiAgdmFyIFZFUlNJT04kYSA9ICc0LjIuMSc7XHJcbiAgdmFyIERBVEFfS0VZJGEgPSAnYnMudG9hc3QnO1xyXG4gIHZhciBFVkVOVF9LRVkkYSA9IFwiLlwiICsgREFUQV9LRVkkYTtcclxuICB2YXIgSlFVRVJZX05PX0NPTkZMSUNUJGEgPSAkLmZuW05BTUUkYV07XHJcbiAgdmFyIEV2ZW50JGEgPSB7XHJcbiAgICBDTElDS19ESVNNSVNTOiBcImNsaWNrLmRpc21pc3NcIiArIEVWRU5UX0tFWSRhLFxyXG4gICAgSElERTogXCJoaWRlXCIgKyBFVkVOVF9LRVkkYSxcclxuICAgIEhJRERFTjogXCJoaWRkZW5cIiArIEVWRU5UX0tFWSRhLFxyXG4gICAgU0hPVzogXCJzaG93XCIgKyBFVkVOVF9LRVkkYSxcclxuICAgIFNIT1dOOiBcInNob3duXCIgKyBFVkVOVF9LRVkkYVxyXG4gIH07XHJcbiAgdmFyIENsYXNzTmFtZSRhID0ge1xyXG4gICAgRkFERTogJ2ZhZGUnLFxyXG4gICAgSElERTogJ2hpZGUnLFxyXG4gICAgU0hPVzogJ3Nob3cnLFxyXG4gICAgU0hPV0lORzogJ3Nob3dpbmcnXHJcbiAgfTtcclxuICB2YXIgRGVmYXVsdFR5cGUkNyA9IHtcclxuICAgIGFuaW1hdGlvbjogJ2Jvb2xlYW4nLFxyXG4gICAgYXV0b2hpZGU6ICdib29sZWFuJyxcclxuICAgIGRlbGF5OiAnbnVtYmVyJ1xyXG4gIH07XHJcbiAgdmFyIERlZmF1bHQkNyA9IHtcclxuICAgIGFuaW1hdGlvbjogdHJ1ZSxcclxuICAgIGF1dG9oaWRlOiB0cnVlLFxyXG4gICAgZGVsYXk6IDUwMFxyXG4gIH07XHJcbiAgdmFyIFNlbGVjdG9yJGEgPSB7XHJcbiAgICBEQVRBX0RJU01JU1M6ICdbZGF0YS1kaXNtaXNzPVwidG9hc3RcIl0nXHJcbiAgICAvKipcclxuICAgICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgICogQ2xhc3MgRGVmaW5pdGlvblxyXG4gICAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAgKi9cclxuXHJcbiAgfTtcclxuXHJcbiAgdmFyIFRvYXN0ID1cclxuICAvKiNfX1BVUkVfXyovXHJcbiAgZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gVG9hc3QoZWxlbWVudCwgY29uZmlnKSB7XHJcbiAgICAgIHRoaXMuX2VsZW1lbnQgPSBlbGVtZW50O1xyXG4gICAgICB0aGlzLl9jb25maWcgPSB0aGlzLl9nZXRDb25maWcoY29uZmlnKTtcclxuICAgICAgdGhpcy5fdGltZW91dCA9IG51bGw7XHJcblxyXG4gICAgICB0aGlzLl9zZXRMaXN0ZW5lcnMoKTtcclxuICAgIH0gLy8gR2V0dGVyc1xyXG5cclxuXHJcbiAgICB2YXIgX3Byb3RvID0gVG9hc3QucHJvdG90eXBlO1xyXG5cclxuICAgIC8vIFB1YmxpY1xyXG4gICAgX3Byb3RvLnNob3cgPSBmdW5jdGlvbiBzaG93KCkge1xyXG4gICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG5cclxuICAgICAgJCh0aGlzLl9lbGVtZW50KS50cmlnZ2VyKEV2ZW50JGEuU0hPVyk7XHJcblxyXG4gICAgICBpZiAodGhpcy5fY29uZmlnLmFuaW1hdGlvbikge1xyXG4gICAgICAgIHRoaXMuX2VsZW1lbnQuY2xhc3NMaXN0LmFkZChDbGFzc05hbWUkYS5GQURFKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdmFyIGNvbXBsZXRlID0gZnVuY3Rpb24gY29tcGxldGUoKSB7XHJcbiAgICAgICAgX3RoaXMuX2VsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShDbGFzc05hbWUkYS5TSE9XSU5HKTtcclxuXHJcbiAgICAgICAgX3RoaXMuX2VsZW1lbnQuY2xhc3NMaXN0LmFkZChDbGFzc05hbWUkYS5TSE9XKTtcclxuXHJcbiAgICAgICAgJChfdGhpcy5fZWxlbWVudCkudHJpZ2dlcihFdmVudCRhLlNIT1dOKTtcclxuXHJcbiAgICAgICAgaWYgKF90aGlzLl9jb25maWcuYXV0b2hpZGUpIHtcclxuICAgICAgICAgIF90aGlzLmhpZGUoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH07XHJcblxyXG4gICAgICB0aGlzLl9lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoQ2xhc3NOYW1lJGEuSElERSk7XHJcblxyXG4gICAgICB0aGlzLl9lbGVtZW50LmNsYXNzTGlzdC5hZGQoQ2xhc3NOYW1lJGEuU0hPV0lORyk7XHJcblxyXG4gICAgICBpZiAodGhpcy5fY29uZmlnLmFuaW1hdGlvbikge1xyXG4gICAgICAgIHZhciB0cmFuc2l0aW9uRHVyYXRpb24gPSBVdGlsLmdldFRyYW5zaXRpb25EdXJhdGlvbkZyb21FbGVtZW50KHRoaXMuX2VsZW1lbnQpO1xyXG4gICAgICAgICQodGhpcy5fZWxlbWVudCkub25lKFV0aWwuVFJBTlNJVElPTl9FTkQsIGNvbXBsZXRlKS5lbXVsYXRlVHJhbnNpdGlvbkVuZCh0cmFuc2l0aW9uRHVyYXRpb24pO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNvbXBsZXRlKCk7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgX3Byb3RvLmhpZGUgPSBmdW5jdGlvbiBoaWRlKHdpdGhvdXRUaW1lb3V0KSB7XHJcbiAgICAgIHZhciBfdGhpczIgPSB0aGlzO1xyXG5cclxuICAgICAgaWYgKCF0aGlzLl9lbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhDbGFzc05hbWUkYS5TSE9XKSkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgJCh0aGlzLl9lbGVtZW50KS50cmlnZ2VyKEV2ZW50JGEuSElERSk7XHJcblxyXG4gICAgICBpZiAod2l0aG91dFRpbWVvdXQpIHtcclxuICAgICAgICB0aGlzLl9jbG9zZSgpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuX3RpbWVvdXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgIF90aGlzMi5fY2xvc2UoKTtcclxuICAgICAgICB9LCB0aGlzLl9jb25maWcuZGVsYXkpO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIF9wcm90by5kaXNwb3NlID0gZnVuY3Rpb24gZGlzcG9zZSgpIHtcclxuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX3RpbWVvdXQpO1xyXG4gICAgICB0aGlzLl90aW1lb3V0ID0gbnVsbDtcclxuXHJcbiAgICAgIGlmICh0aGlzLl9lbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhDbGFzc05hbWUkYS5TSE9XKSkge1xyXG4gICAgICAgIHRoaXMuX2VsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShDbGFzc05hbWUkYS5TSE9XKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgJCh0aGlzLl9lbGVtZW50KS5vZmYoRXZlbnQkYS5DTElDS19ESVNNSVNTKTtcclxuICAgICAgJC5yZW1vdmVEYXRhKHRoaXMuX2VsZW1lbnQsIERBVEFfS0VZJGEpO1xyXG4gICAgICB0aGlzLl9lbGVtZW50ID0gbnVsbDtcclxuICAgICAgdGhpcy5fY29uZmlnID0gbnVsbDtcclxuICAgIH07IC8vIFByaXZhdGVcclxuXHJcblxyXG4gICAgX3Byb3RvLl9nZXRDb25maWcgPSBmdW5jdGlvbiBfZ2V0Q29uZmlnKGNvbmZpZykge1xyXG4gICAgICBjb25maWcgPSBfb2JqZWN0U3ByZWFkKHt9LCBEZWZhdWx0JDcsICQodGhpcy5fZWxlbWVudCkuZGF0YSgpLCB0eXBlb2YgY29uZmlnID09PSAnb2JqZWN0JyAmJiBjb25maWcgPyBjb25maWcgOiB7fSk7XHJcbiAgICAgIFV0aWwudHlwZUNoZWNrQ29uZmlnKE5BTUUkYSwgY29uZmlnLCB0aGlzLmNvbnN0cnVjdG9yLkRlZmF1bHRUeXBlKTtcclxuICAgICAgcmV0dXJuIGNvbmZpZztcclxuICAgIH07XHJcblxyXG4gICAgX3Byb3RvLl9zZXRMaXN0ZW5lcnMgPSBmdW5jdGlvbiBfc2V0TGlzdGVuZXJzKCkge1xyXG4gICAgICB2YXIgX3RoaXMzID0gdGhpcztcclxuXHJcbiAgICAgICQodGhpcy5fZWxlbWVudCkub24oRXZlbnQkYS5DTElDS19ESVNNSVNTLCBTZWxlY3RvciRhLkRBVEFfRElTTUlTUywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiBfdGhpczMuaGlkZSh0cnVlKTtcclxuICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIF9wcm90by5fY2xvc2UgPSBmdW5jdGlvbiBfY2xvc2UoKSB7XHJcbiAgICAgIHZhciBfdGhpczQgPSB0aGlzO1xyXG5cclxuICAgICAgdmFyIGNvbXBsZXRlID0gZnVuY3Rpb24gY29tcGxldGUoKSB7XHJcbiAgICAgICAgX3RoaXM0Ll9lbGVtZW50LmNsYXNzTGlzdC5hZGQoQ2xhc3NOYW1lJGEuSElERSk7XHJcblxyXG4gICAgICAgICQoX3RoaXM0Ll9lbGVtZW50KS50cmlnZ2VyKEV2ZW50JGEuSElEREVOKTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgIHRoaXMuX2VsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShDbGFzc05hbWUkYS5TSE9XKTtcclxuXHJcbiAgICAgIGlmICh0aGlzLl9jb25maWcuYW5pbWF0aW9uKSB7XHJcbiAgICAgICAgdmFyIHRyYW5zaXRpb25EdXJhdGlvbiA9IFV0aWwuZ2V0VHJhbnNpdGlvbkR1cmF0aW9uRnJvbUVsZW1lbnQodGhpcy5fZWxlbWVudCk7XHJcbiAgICAgICAgJCh0aGlzLl9lbGVtZW50KS5vbmUoVXRpbC5UUkFOU0lUSU9OX0VORCwgY29tcGxldGUpLmVtdWxhdGVUcmFuc2l0aW9uRW5kKHRyYW5zaXRpb25EdXJhdGlvbik7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29tcGxldGUoKTtcclxuICAgICAgfVxyXG4gICAgfTsgLy8gU3RhdGljXHJcblxyXG5cclxuICAgIFRvYXN0Ll9qUXVlcnlJbnRlcmZhY2UgPSBmdW5jdGlvbiBfalF1ZXJ5SW50ZXJmYWNlKGNvbmZpZykge1xyXG4gICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgJGVsZW1lbnQgPSAkKHRoaXMpO1xyXG4gICAgICAgIHZhciBkYXRhID0gJGVsZW1lbnQuZGF0YShEQVRBX0tFWSRhKTtcclxuXHJcbiAgICAgICAgdmFyIF9jb25maWcgPSB0eXBlb2YgY29uZmlnID09PSAnb2JqZWN0JyAmJiBjb25maWc7XHJcblxyXG4gICAgICAgIGlmICghZGF0YSkge1xyXG4gICAgICAgICAgZGF0YSA9IG5ldyBUb2FzdCh0aGlzLCBfY29uZmlnKTtcclxuICAgICAgICAgICRlbGVtZW50LmRhdGEoREFUQV9LRVkkYSwgZGF0YSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodHlwZW9mIGNvbmZpZyA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgIGlmICh0eXBlb2YgZGF0YVtjb25maWddID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiTm8gbWV0aG9kIG5hbWVkIFxcXCJcIiArIGNvbmZpZyArIFwiXFxcIlwiKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBkYXRhW2NvbmZpZ10odGhpcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgX2NyZWF0ZUNsYXNzKFRvYXN0LCBudWxsLCBbe1xyXG4gICAgICBrZXk6IFwiVkVSU0lPTlwiLFxyXG4gICAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcclxuICAgICAgICByZXR1cm4gVkVSU0lPTiRhO1xyXG4gICAgICB9XHJcbiAgICB9LCB7XHJcbiAgICAgIGtleTogXCJEZWZhdWx0VHlwZVwiLFxyXG4gICAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcclxuICAgICAgICByZXR1cm4gRGVmYXVsdFR5cGUkNztcclxuICAgICAgfVxyXG4gICAgfV0pO1xyXG5cclxuICAgIHJldHVybiBUb2FzdDtcclxuICB9KCk7XHJcbiAgLyoqXHJcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICogalF1ZXJ5XHJcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICovXHJcblxyXG5cclxuICAkLmZuW05BTUUkYV0gPSBUb2FzdC5falF1ZXJ5SW50ZXJmYWNlO1xyXG4gICQuZm5bTkFNRSRhXS5Db25zdHJ1Y3RvciA9IFRvYXN0O1xyXG5cclxuICAkLmZuW05BTUUkYV0ubm9Db25mbGljdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICQuZm5bTkFNRSRhXSA9IEpRVUVSWV9OT19DT05GTElDVCRhO1xyXG4gICAgcmV0dXJuIFRvYXN0Ll9qUXVlcnlJbnRlcmZhY2U7XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgKiBCb290c3RyYXAgKHY0LjIuMSk6IGluZGV4LmpzXHJcbiAgICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvYmxvYi9tYXN0ZXIvTElDRU5TRSlcclxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAqL1xyXG5cclxuICAoZnVuY3Rpb24gKCkge1xyXG4gICAgaWYgKHR5cGVvZiAkID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdCb290c3RyYXBcXCdzIEphdmFTY3JpcHQgcmVxdWlyZXMgalF1ZXJ5LiBqUXVlcnkgbXVzdCBiZSBpbmNsdWRlZCBiZWZvcmUgQm9vdHN0cmFwXFwncyBKYXZhU2NyaXB0LicpO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciB2ZXJzaW9uID0gJC5mbi5qcXVlcnkuc3BsaXQoJyAnKVswXS5zcGxpdCgnLicpO1xyXG4gICAgdmFyIG1pbk1ham9yID0gMTtcclxuICAgIHZhciBsdE1ham9yID0gMjtcclxuICAgIHZhciBtaW5NaW5vciA9IDk7XHJcbiAgICB2YXIgbWluUGF0Y2ggPSAxO1xyXG4gICAgdmFyIG1heE1ham9yID0gNDtcclxuXHJcbiAgICBpZiAodmVyc2lvblswXSA8IGx0TWFqb3IgJiYgdmVyc2lvblsxXSA8IG1pbk1pbm9yIHx8IHZlcnNpb25bMF0gPT09IG1pbk1ham9yICYmIHZlcnNpb25bMV0gPT09IG1pbk1pbm9yICYmIHZlcnNpb25bMl0gPCBtaW5QYXRjaCB8fCB2ZXJzaW9uWzBdID49IG1heE1ham9yKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignQm9vdHN0cmFwXFwncyBKYXZhU2NyaXB0IHJlcXVpcmVzIGF0IGxlYXN0IGpRdWVyeSB2MS45LjEgYnV0IGxlc3MgdGhhbiB2NC4wLjAnKTtcclxuICAgIH1cclxuICB9KSgpO1xyXG5cclxuICBleHBvcnRzLlV0aWwgPSBVdGlsO1xyXG4gIGV4cG9ydHMuQWxlcnQgPSBBbGVydDtcclxuICBleHBvcnRzLkJ1dHRvbiA9IEJ1dHRvbjtcclxuICBleHBvcnRzLkNhcm91c2VsID0gQ2Fyb3VzZWw7XHJcbiAgZXhwb3J0cy5Db2xsYXBzZSA9IENvbGxhcHNlO1xyXG4gIGV4cG9ydHMuRHJvcGRvd24gPSBEcm9wZG93bjtcclxuICBleHBvcnRzLk1vZGFsID0gTW9kYWw7XHJcbiAgZXhwb3J0cy5Qb3BvdmVyID0gUG9wb3ZlcjtcclxuICBleHBvcnRzLlNjcm9sbHNweSA9IFNjcm9sbFNweTtcclxuICBleHBvcnRzLlRhYiA9IFRhYjtcclxuICBleHBvcnRzLlRvYXN0ID0gVG9hc3Q7XHJcbiAgZXhwb3J0cy5Ub29sdGlwID0gVG9vbHRpcDtcclxuXHJcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuXHJcbn0pKSk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWJvb3RzdHJhcC5qcy5tYXBcclxuIl0sInNvdXJjZVJvb3QiOiIifQ==