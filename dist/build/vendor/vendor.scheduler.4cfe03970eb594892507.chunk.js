(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["vendor/vendor.scheduler"],{

/***/ "GXno":
/*!*********************************************************************!*\
  !*** ./node_modules/scheduler/cjs/scheduler-tracing.development.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/** @license React v0.13.1
 * scheduler-tracing.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */





if (true) {
  (function() {
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

// Helps identify side effects in begin-phase lifecycle hooks and setState reducers:


// In some cases, StrictMode should also double-render lifecycles.
// This can be confusing for tests though,
// And it can be bad for performance in production.
// This feature flag can be used to control the behavior:


// To preserve the "Pause on caught exceptions" behavior of the debugger, we
// replay the begin phase of a failed component inside invokeGuardedCallback.


// Warn about deprecated, async-unsafe lifecycles; relates to RFC #6:


// Gather advanced timing metrics for Profiler subtrees.


// Trace which interactions trigger each commit.
var enableSchedulerTracing = true;

// Only used in www builds.
 // TODO: true? Here it might just be false.

// Only used in www builds.


// Only used in www builds.


// React Fire: prevent the value and checked attributes from syncing
// with their related DOM properties


// These APIs will no longer be "unstable" in the upcoming 16.7 release,
// Control this behavior with a flag to support 16.6 minor releases in the meanwhile.

var DEFAULT_THREAD_ID = 0;

// Counters used to generate unique IDs.
var interactionIDCounter = 0;
var threadIDCounter = 0;

// Set of currently traced interactions.
// Interactions "stack"–
// Meaning that newly traced interactions are appended to the previously active set.
// When an interaction goes out of scope, the previous set (if any) is restored.
exports.__interactionsRef = null;

// Listener(s) to notify when interactions begin and end.
exports.__subscriberRef = null;

if (enableSchedulerTracing) {
  exports.__interactionsRef = {
    current: new Set()
  };
  exports.__subscriberRef = {
    current: null
  };
}

function unstable_clear(callback) {
  if (!enableSchedulerTracing) {
    return callback();
  }

  var prevInteractions = exports.__interactionsRef.current;
  exports.__interactionsRef.current = new Set();

  try {
    return callback();
  } finally {
    exports.__interactionsRef.current = prevInteractions;
  }
}

function unstable_getCurrent() {
  if (!enableSchedulerTracing) {
    return null;
  } else {
    return exports.__interactionsRef.current;
  }
}

function unstable_getThreadID() {
  return ++threadIDCounter;
}

function unstable_trace(name, timestamp, callback) {
  var threadID = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : DEFAULT_THREAD_ID;

  if (!enableSchedulerTracing) {
    return callback();
  }

  var interaction = {
    __count: 1,
    id: interactionIDCounter++,
    name: name,
    timestamp: timestamp
  };

  var prevInteractions = exports.__interactionsRef.current;

  // Traced interactions should stack/accumulate.
  // To do that, clone the current interactions.
  // The previous set will be restored upon completion.
  var interactions = new Set(prevInteractions);
  interactions.add(interaction);
  exports.__interactionsRef.current = interactions;

  var subscriber = exports.__subscriberRef.current;
  var returnValue = void 0;

  try {
    if (subscriber !== null) {
      subscriber.onInteractionTraced(interaction);
    }
  } finally {
    try {
      if (subscriber !== null) {
        subscriber.onWorkStarted(interactions, threadID);
      }
    } finally {
      try {
        returnValue = callback();
      } finally {
        exports.__interactionsRef.current = prevInteractions;

        try {
          if (subscriber !== null) {
            subscriber.onWorkStopped(interactions, threadID);
          }
        } finally {
          interaction.__count--;

          // If no async work was scheduled for this interaction,
          // Notify subscribers that it's completed.
          if (subscriber !== null && interaction.__count === 0) {
            subscriber.onInteractionScheduledWorkCompleted(interaction);
          }
        }
      }
    }
  }

  return returnValue;
}

function unstable_wrap(callback) {
  var threadID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DEFAULT_THREAD_ID;

  if (!enableSchedulerTracing) {
    return callback;
  }

  var wrappedInteractions = exports.__interactionsRef.current;

  var subscriber = exports.__subscriberRef.current;
  if (subscriber !== null) {
    subscriber.onWorkScheduled(wrappedInteractions, threadID);
  }

  // Update the pending async work count for the current interactions.
  // Update after calling subscribers in case of error.
  wrappedInteractions.forEach(function (interaction) {
    interaction.__count++;
  });

  var hasRun = false;

  function wrapped() {
    var prevInteractions = exports.__interactionsRef.current;
    exports.__interactionsRef.current = wrappedInteractions;

    subscriber = exports.__subscriberRef.current;

    try {
      var returnValue = void 0;

      try {
        if (subscriber !== null) {
          subscriber.onWorkStarted(wrappedInteractions, threadID);
        }
      } finally {
        try {
          returnValue = callback.apply(undefined, arguments);
        } finally {
          exports.__interactionsRef.current = prevInteractions;

          if (subscriber !== null) {
            subscriber.onWorkStopped(wrappedInteractions, threadID);
          }
        }
      }

      return returnValue;
    } finally {
      if (!hasRun) {
        // We only expect a wrapped function to be executed once,
        // But in the event that it's executed more than once–
        // Only decrement the outstanding interaction counts once.
        hasRun = true;

        // Update pending async counts for all wrapped interactions.
        // If this was the last scheduled async work for any of them,
        // Mark them as completed.
        wrappedInteractions.forEach(function (interaction) {
          interaction.__count--;

          if (subscriber !== null && interaction.__count === 0) {
            subscriber.onInteractionScheduledWorkCompleted(interaction);
          }
        });
      }
    }
  }

  wrapped.cancel = function cancel() {
    subscriber = exports.__subscriberRef.current;

    try {
      if (subscriber !== null) {
        subscriber.onWorkCanceled(wrappedInteractions, threadID);
      }
    } finally {
      // Update pending async counts for all wrapped interactions.
      // If this was the last scheduled async work for any of them,
      // Mark them as completed.
      wrappedInteractions.forEach(function (interaction) {
        interaction.__count--;

        if (subscriber && interaction.__count === 0) {
          subscriber.onInteractionScheduledWorkCompleted(interaction);
        }
      });
    }
  };

  return wrapped;
}

var subscribers = null;
if (enableSchedulerTracing) {
  subscribers = new Set();
}

function unstable_subscribe(subscriber) {
  if (enableSchedulerTracing) {
    subscribers.add(subscriber);

    if (subscribers.size === 1) {
      exports.__subscriberRef.current = {
        onInteractionScheduledWorkCompleted: onInteractionScheduledWorkCompleted,
        onInteractionTraced: onInteractionTraced,
        onWorkCanceled: onWorkCanceled,
        onWorkScheduled: onWorkScheduled,
        onWorkStarted: onWorkStarted,
        onWorkStopped: onWorkStopped
      };
    }
  }
}

function unstable_unsubscribe(subscriber) {
  if (enableSchedulerTracing) {
    subscribers.delete(subscriber);

    if (subscribers.size === 0) {
      exports.__subscriberRef.current = null;
    }
  }
}

function onInteractionTraced(interaction) {
  var didCatchError = false;
  var caughtError = null;

  subscribers.forEach(function (subscriber) {
    try {
      subscriber.onInteractionTraced(interaction);
    } catch (error) {
      if (!didCatchError) {
        didCatchError = true;
        caughtError = error;
      }
    }
  });

  if (didCatchError) {
    throw caughtError;
  }
}

function onInteractionScheduledWorkCompleted(interaction) {
  var didCatchError = false;
  var caughtError = null;

  subscribers.forEach(function (subscriber) {
    try {
      subscriber.onInteractionScheduledWorkCompleted(interaction);
    } catch (error) {
      if (!didCatchError) {
        didCatchError = true;
        caughtError = error;
      }
    }
  });

  if (didCatchError) {
    throw caughtError;
  }
}

function onWorkScheduled(interactions, threadID) {
  var didCatchError = false;
  var caughtError = null;

  subscribers.forEach(function (subscriber) {
    try {
      subscriber.onWorkScheduled(interactions, threadID);
    } catch (error) {
      if (!didCatchError) {
        didCatchError = true;
        caughtError = error;
      }
    }
  });

  if (didCatchError) {
    throw caughtError;
  }
}

function onWorkStarted(interactions, threadID) {
  var didCatchError = false;
  var caughtError = null;

  subscribers.forEach(function (subscriber) {
    try {
      subscriber.onWorkStarted(interactions, threadID);
    } catch (error) {
      if (!didCatchError) {
        didCatchError = true;
        caughtError = error;
      }
    }
  });

  if (didCatchError) {
    throw caughtError;
  }
}

function onWorkStopped(interactions, threadID) {
  var didCatchError = false;
  var caughtError = null;

  subscribers.forEach(function (subscriber) {
    try {
      subscriber.onWorkStopped(interactions, threadID);
    } catch (error) {
      if (!didCatchError) {
        didCatchError = true;
        caughtError = error;
      }
    }
  });

  if (didCatchError) {
    throw caughtError;
  }
}

function onWorkCanceled(interactions, threadID) {
  var didCatchError = false;
  var caughtError = null;

  subscribers.forEach(function (subscriber) {
    try {
      subscriber.onWorkCanceled(interactions, threadID);
    } catch (error) {
      if (!didCatchError) {
        didCatchError = true;
        caughtError = error;
      }
    }
  });

  if (didCatchError) {
    throw caughtError;
  }
}

exports.unstable_clear = unstable_clear;
exports.unstable_getCurrent = unstable_getCurrent;
exports.unstable_getThreadID = unstable_getThreadID;
exports.unstable_trace = unstable_trace;
exports.unstable_wrap = unstable_wrap;
exports.unstable_subscribe = unstable_subscribe;
exports.unstable_unsubscribe = unstable_unsubscribe;
  })();
}


/***/ }),

/***/ "MGln":
/*!*************************************************************!*\
  !*** ./node_modules/scheduler/cjs/scheduler.development.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global, console) {/** @license React v0.13.1
 * scheduler.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */





if (true) {
  (function() {
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var enableSchedulerDebugging = false;

/* eslint-disable no-var */

// TODO: Use symbols?
var ImmediatePriority = 1;
var UserBlockingPriority = 2;
var NormalPriority = 3;
var LowPriority = 4;
var IdlePriority = 5;

// Max 31 bit integer. The max integer size in V8 for 32-bit systems.
// Math.pow(2, 30) - 1
// 0b111111111111111111111111111111
var maxSigned31BitInt = 1073741823;

// Times out immediately
var IMMEDIATE_PRIORITY_TIMEOUT = -1;
// Eventually times out
var USER_BLOCKING_PRIORITY = 250;
var NORMAL_PRIORITY_TIMEOUT = 5000;
var LOW_PRIORITY_TIMEOUT = 10000;
// Never times out
var IDLE_PRIORITY = maxSigned31BitInt;

// Callbacks are stored as a circular, doubly linked list.
var firstCallbackNode = null;

var currentDidTimeout = false;
// Pausing the scheduler is useful for debugging.
var isSchedulerPaused = false;

var currentPriorityLevel = NormalPriority;
var currentEventStartTime = -1;
var currentExpirationTime = -1;

// This is set when a callback is being executed, to prevent re-entrancy.
var isExecutingCallback = false;

var isHostCallbackScheduled = false;

var hasNativePerformanceNow = typeof performance === 'object' && typeof performance.now === 'function';

function ensureHostCallbackIsScheduled() {
  if (isExecutingCallback) {
    // Don't schedule work yet; wait until the next time we yield.
    return;
  }
  // Schedule the host callback using the earliest expiration in the list.
  var expirationTime = firstCallbackNode.expirationTime;
  if (!isHostCallbackScheduled) {
    isHostCallbackScheduled = true;
  } else {
    // Cancel the existing host callback.
    cancelHostCallback();
  }
  requestHostCallback(flushWork, expirationTime);
}

function flushFirstCallback() {
  var flushedNode = firstCallbackNode;

  // Remove the node from the list before calling the callback. That way the
  // list is in a consistent state even if the callback throws.
  var next = firstCallbackNode.next;
  if (firstCallbackNode === next) {
    // This is the last callback in the list.
    firstCallbackNode = null;
    next = null;
  } else {
    var lastCallbackNode = firstCallbackNode.previous;
    firstCallbackNode = lastCallbackNode.next = next;
    next.previous = lastCallbackNode;
  }

  flushedNode.next = flushedNode.previous = null;

  // Now it's safe to call the callback.
  var callback = flushedNode.callback;
  var expirationTime = flushedNode.expirationTime;
  var priorityLevel = flushedNode.priorityLevel;
  var previousPriorityLevel = currentPriorityLevel;
  var previousExpirationTime = currentExpirationTime;
  currentPriorityLevel = priorityLevel;
  currentExpirationTime = expirationTime;
  var continuationCallback;
  try {
    continuationCallback = callback();
  } finally {
    currentPriorityLevel = previousPriorityLevel;
    currentExpirationTime = previousExpirationTime;
  }

  // A callback may return a continuation. The continuation should be scheduled
  // with the same priority and expiration as the just-finished callback.
  if (typeof continuationCallback === 'function') {
    var continuationNode = {
      callback: continuationCallback,
      priorityLevel: priorityLevel,
      expirationTime: expirationTime,
      next: null,
      previous: null
    };

    // Insert the new callback into the list, sorted by its expiration. This is
    // almost the same as the code in `scheduleCallback`, except the callback
    // is inserted into the list *before* callbacks of equal expiration instead
    // of after.
    if (firstCallbackNode === null) {
      // This is the first callback in the list.
      firstCallbackNode = continuationNode.next = continuationNode.previous = continuationNode;
    } else {
      var nextAfterContinuation = null;
      var node = firstCallbackNode;
      do {
        if (node.expirationTime >= expirationTime) {
          // This callback expires at or after the continuation. We will insert
          // the continuation *before* this callback.
          nextAfterContinuation = node;
          break;
        }
        node = node.next;
      } while (node !== firstCallbackNode);

      if (nextAfterContinuation === null) {
        // No equal or lower priority callback was found, which means the new
        // callback is the lowest priority callback in the list.
        nextAfterContinuation = firstCallbackNode;
      } else if (nextAfterContinuation === firstCallbackNode) {
        // The new callback is the highest priority callback in the list.
        firstCallbackNode = continuationNode;
        ensureHostCallbackIsScheduled();
      }

      var previous = nextAfterContinuation.previous;
      previous.next = nextAfterContinuation.previous = continuationNode;
      continuationNode.next = nextAfterContinuation;
      continuationNode.previous = previous;
    }
  }
}

function flushImmediateWork() {
  if (
  // Confirm we've exited the outer most event handler
  currentEventStartTime === -1 && firstCallbackNode !== null && firstCallbackNode.priorityLevel === ImmediatePriority) {
    isExecutingCallback = true;
    try {
      do {
        flushFirstCallback();
      } while (
      // Keep flushing until there are no more immediate callbacks
      firstCallbackNode !== null && firstCallbackNode.priorityLevel === ImmediatePriority);
    } finally {
      isExecutingCallback = false;
      if (firstCallbackNode !== null) {
        // There's still work remaining. Request another callback.
        ensureHostCallbackIsScheduled();
      } else {
        isHostCallbackScheduled = false;
      }
    }
  }
}

function flushWork(didTimeout) {
  // Exit right away if we're currently paused

  if (enableSchedulerDebugging && isSchedulerPaused) {
    return;
  }

  isExecutingCallback = true;
  var previousDidTimeout = currentDidTimeout;
  currentDidTimeout = didTimeout;
  try {
    if (didTimeout) {
      // Flush all the expired callbacks without yielding.
      while (firstCallbackNode !== null && !(enableSchedulerDebugging && isSchedulerPaused)) {
        // TODO Wrap in feature flag
        // Read the current time. Flush all the callbacks that expire at or
        // earlier than that time. Then read the current time again and repeat.
        // This optimizes for as few performance.now calls as possible.
        var currentTime = exports.unstable_now();
        if (firstCallbackNode.expirationTime <= currentTime) {
          do {
            flushFirstCallback();
          } while (firstCallbackNode !== null && firstCallbackNode.expirationTime <= currentTime && !(enableSchedulerDebugging && isSchedulerPaused));
          continue;
        }
        break;
      }
    } else {
      // Keep flushing callbacks until we run out of time in the frame.
      if (firstCallbackNode !== null) {
        do {
          if (enableSchedulerDebugging && isSchedulerPaused) {
            break;
          }
          flushFirstCallback();
        } while (firstCallbackNode !== null && !shouldYieldToHost());
      }
    }
  } finally {
    isExecutingCallback = false;
    currentDidTimeout = previousDidTimeout;
    if (firstCallbackNode !== null) {
      // There's still work remaining. Request another callback.
      ensureHostCallbackIsScheduled();
    } else {
      isHostCallbackScheduled = false;
    }
    // Before exiting, flush all the immediate work that was scheduled.
    flushImmediateWork();
  }
}

function unstable_runWithPriority(priorityLevel, eventHandler) {
  switch (priorityLevel) {
    case ImmediatePriority:
    case UserBlockingPriority:
    case NormalPriority:
    case LowPriority:
    case IdlePriority:
      break;
    default:
      priorityLevel = NormalPriority;
  }

  var previousPriorityLevel = currentPriorityLevel;
  var previousEventStartTime = currentEventStartTime;
  currentPriorityLevel = priorityLevel;
  currentEventStartTime = exports.unstable_now();

  try {
    return eventHandler();
  } finally {
    currentPriorityLevel = previousPriorityLevel;
    currentEventStartTime = previousEventStartTime;

    // Before exiting, flush all the immediate work that was scheduled.
    flushImmediateWork();
  }
}

function unstable_wrapCallback(callback) {
  var parentPriorityLevel = currentPriorityLevel;
  return function () {
    // This is a fork of runWithPriority, inlined for performance.
    var previousPriorityLevel = currentPriorityLevel;
    var previousEventStartTime = currentEventStartTime;
    currentPriorityLevel = parentPriorityLevel;
    currentEventStartTime = exports.unstable_now();

    try {
      return callback.apply(this, arguments);
    } finally {
      currentPriorityLevel = previousPriorityLevel;
      currentEventStartTime = previousEventStartTime;
      flushImmediateWork();
    }
  };
}

function unstable_scheduleCallback(callback, deprecated_options) {
  var startTime = currentEventStartTime !== -1 ? currentEventStartTime : exports.unstable_now();

  var expirationTime;
  if (typeof deprecated_options === 'object' && deprecated_options !== null && typeof deprecated_options.timeout === 'number') {
    // FIXME: Remove this branch once we lift expiration times out of React.
    expirationTime = startTime + deprecated_options.timeout;
  } else {
    switch (currentPriorityLevel) {
      case ImmediatePriority:
        expirationTime = startTime + IMMEDIATE_PRIORITY_TIMEOUT;
        break;
      case UserBlockingPriority:
        expirationTime = startTime + USER_BLOCKING_PRIORITY;
        break;
      case IdlePriority:
        expirationTime = startTime + IDLE_PRIORITY;
        break;
      case LowPriority:
        expirationTime = startTime + LOW_PRIORITY_TIMEOUT;
        break;
      case NormalPriority:
      default:
        expirationTime = startTime + NORMAL_PRIORITY_TIMEOUT;
    }
  }

  var newNode = {
    callback: callback,
    priorityLevel: currentPriorityLevel,
    expirationTime: expirationTime,
    next: null,
    previous: null
  };

  // Insert the new callback into the list, ordered first by expiration, then
  // by insertion. So the new callback is inserted any other callback with
  // equal expiration.
  if (firstCallbackNode === null) {
    // This is the first callback in the list.
    firstCallbackNode = newNode.next = newNode.previous = newNode;
    ensureHostCallbackIsScheduled();
  } else {
    var next = null;
    var node = firstCallbackNode;
    do {
      if (node.expirationTime > expirationTime) {
        // The new callback expires before this one.
        next = node;
        break;
      }
      node = node.next;
    } while (node !== firstCallbackNode);

    if (next === null) {
      // No callback with a later expiration was found, which means the new
      // callback has the latest expiration in the list.
      next = firstCallbackNode;
    } else if (next === firstCallbackNode) {
      // The new callback has the earliest expiration in the entire list.
      firstCallbackNode = newNode;
      ensureHostCallbackIsScheduled();
    }

    var previous = next.previous;
    previous.next = next.previous = newNode;
    newNode.next = next;
    newNode.previous = previous;
  }

  return newNode;
}

function unstable_pauseExecution() {
  isSchedulerPaused = true;
}

function unstable_continueExecution() {
  isSchedulerPaused = false;
  if (firstCallbackNode !== null) {
    ensureHostCallbackIsScheduled();
  }
}

function unstable_getFirstCallbackNode() {
  return firstCallbackNode;
}

function unstable_cancelCallback(callbackNode) {
  var next = callbackNode.next;
  if (next === null) {
    // Already cancelled.
    return;
  }

  if (next === callbackNode) {
    // This is the only scheduled callback. Clear the list.
    firstCallbackNode = null;
  } else {
    // Remove the callback from its position in the list.
    if (callbackNode === firstCallbackNode) {
      firstCallbackNode = next;
    }
    var previous = callbackNode.previous;
    previous.next = next;
    next.previous = previous;
  }

  callbackNode.next = callbackNode.previous = null;
}

function unstable_getCurrentPriorityLevel() {
  return currentPriorityLevel;
}

function unstable_shouldYield() {
  return !currentDidTimeout && (firstCallbackNode !== null && firstCallbackNode.expirationTime < currentExpirationTime || shouldYieldToHost());
}

// The remaining code is essentially a polyfill for requestIdleCallback. It
// works by scheduling a requestAnimationFrame, storing the time for the start
// of the frame, then scheduling a postMessage which gets scheduled after paint.
// Within the postMessage handler do as much work as possible until time + frame
// rate. By separating the idle call into a separate event tick we ensure that
// layout, paint and other browser work is counted against the available time.
// The frame rate is dynamically adjusted.

// We capture a local reference to any global, in case it gets polyfilled after
// this module is initially evaluated. We want to be using a
// consistent implementation.
var localDate = Date;

// This initialization code may run even on server environments if a component
// just imports ReactDOM (e.g. for findDOMNode). Some environments might not
// have setTimeout or clearTimeout. However, we always expect them to be defined
// on the client. https://github.com/facebook/react/pull/13088
var localSetTimeout = typeof setTimeout === 'function' ? setTimeout : undefined;
var localClearTimeout = typeof clearTimeout === 'function' ? clearTimeout : undefined;

// We don't expect either of these to necessarily be defined, but we will error
// later if they are missing on the client.
var localRequestAnimationFrame = typeof requestAnimationFrame === 'function' ? requestAnimationFrame : undefined;
var localCancelAnimationFrame = typeof cancelAnimationFrame === 'function' ? cancelAnimationFrame : undefined;

// requestAnimationFrame does not run when the tab is in the background. If
// we're backgrounded we prefer for that work to happen so that the page
// continues to load in the background. So we also schedule a 'setTimeout' as
// a fallback.
// TODO: Need a better heuristic for backgrounded work.
var ANIMATION_FRAME_TIMEOUT = 100;
var rAFID;
var rAFTimeoutID;
var requestAnimationFrameWithTimeout = function (callback) {
  // schedule rAF and also a setTimeout
  rAFID = localRequestAnimationFrame(function (timestamp) {
    // cancel the setTimeout
    localClearTimeout(rAFTimeoutID);
    callback(timestamp);
  });
  rAFTimeoutID = localSetTimeout(function () {
    // cancel the requestAnimationFrame
    localCancelAnimationFrame(rAFID);
    callback(exports.unstable_now());
  }, ANIMATION_FRAME_TIMEOUT);
};

if (hasNativePerformanceNow) {
  var Performance = performance;
  exports.unstable_now = function () {
    return Performance.now();
  };
} else {
  exports.unstable_now = function () {
    return localDate.now();
  };
}

var requestHostCallback;
var cancelHostCallback;
var shouldYieldToHost;

var globalValue = null;
if (typeof window !== 'undefined') {
  globalValue = window;
} else if (typeof global !== 'undefined') {
  globalValue = global;
}

if (globalValue && globalValue._schedMock) {
  // Dynamic injection, only for testing purposes.
  var globalImpl = globalValue._schedMock;
  requestHostCallback = globalImpl[0];
  cancelHostCallback = globalImpl[1];
  shouldYieldToHost = globalImpl[2];
  exports.unstable_now = globalImpl[3];
} else if (
// If Scheduler runs in a non-DOM environment, it falls back to a naive
// implementation using setTimeout.
typeof window === 'undefined' ||
// Check if MessageChannel is supported, too.
typeof MessageChannel !== 'function') {
  // If this accidentally gets imported in a non-browser environment, e.g. JavaScriptCore,
  // fallback to a naive implementation.
  var _callback = null;
  var _flushCallback = function (didTimeout) {
    if (_callback !== null) {
      try {
        _callback(didTimeout);
      } finally {
        _callback = null;
      }
    }
  };
  requestHostCallback = function (cb, ms) {
    if (_callback !== null) {
      // Protect against re-entrancy.
      setTimeout(requestHostCallback, 0, cb);
    } else {
      _callback = cb;
      setTimeout(_flushCallback, 0, false);
    }
  };
  cancelHostCallback = function () {
    _callback = null;
  };
  shouldYieldToHost = function () {
    return false;
  };
} else {
  if (typeof console !== 'undefined') {
    // TODO: Remove fb.me link
    if (typeof localRequestAnimationFrame !== 'function') {
      console.error("This browser doesn't support requestAnimationFrame. " + 'Make sure that you load a ' + 'polyfill in older browsers. https://fb.me/react-polyfills');
    }
    if (typeof localCancelAnimationFrame !== 'function') {
      console.error("This browser doesn't support cancelAnimationFrame. " + 'Make sure that you load a ' + 'polyfill in older browsers. https://fb.me/react-polyfills');
    }
  }

  var scheduledHostCallback = null;
  var isMessageEventScheduled = false;
  var timeoutTime = -1;

  var isAnimationFrameScheduled = false;

  var isFlushingHostCallback = false;

  var frameDeadline = 0;
  // We start out assuming that we run at 30fps but then the heuristic tracking
  // will adjust this value to a faster fps if we get more frequent animation
  // frames.
  var previousFrameTime = 33;
  var activeFrameTime = 33;

  shouldYieldToHost = function () {
    return frameDeadline <= exports.unstable_now();
  };

  // We use the postMessage trick to defer idle work until after the repaint.
  var channel = new MessageChannel();
  var port = channel.port2;
  channel.port1.onmessage = function (event) {
    isMessageEventScheduled = false;

    var prevScheduledCallback = scheduledHostCallback;
    var prevTimeoutTime = timeoutTime;
    scheduledHostCallback = null;
    timeoutTime = -1;

    var currentTime = exports.unstable_now();

    var didTimeout = false;
    if (frameDeadline - currentTime <= 0) {
      // There's no time left in this idle period. Check if the callback has
      // a timeout and whether it's been exceeded.
      if (prevTimeoutTime !== -1 && prevTimeoutTime <= currentTime) {
        // Exceeded the timeout. Invoke the callback even though there's no
        // time left.
        didTimeout = true;
      } else {
        // No timeout.
        if (!isAnimationFrameScheduled) {
          // Schedule another animation callback so we retry later.
          isAnimationFrameScheduled = true;
          requestAnimationFrameWithTimeout(animationTick);
        }
        // Exit without invoking the callback.
        scheduledHostCallback = prevScheduledCallback;
        timeoutTime = prevTimeoutTime;
        return;
      }
    }

    if (prevScheduledCallback !== null) {
      isFlushingHostCallback = true;
      try {
        prevScheduledCallback(didTimeout);
      } finally {
        isFlushingHostCallback = false;
      }
    }
  };

  var animationTick = function (rafTime) {
    if (scheduledHostCallback !== null) {
      // Eagerly schedule the next animation callback at the beginning of the
      // frame. If the scheduler queue is not empty at the end of the frame, it
      // will continue flushing inside that callback. If the queue *is* empty,
      // then it will exit immediately. Posting the callback at the start of the
      // frame ensures it's fired within the earliest possible frame. If we
      // waited until the end of the frame to post the callback, we risk the
      // browser skipping a frame and not firing the callback until the frame
      // after that.
      requestAnimationFrameWithTimeout(animationTick);
    } else {
      // No pending work. Exit.
      isAnimationFrameScheduled = false;
      return;
    }

    var nextFrameTime = rafTime - frameDeadline + activeFrameTime;
    if (nextFrameTime < activeFrameTime && previousFrameTime < activeFrameTime) {
      if (nextFrameTime < 8) {
        // Defensive coding. We don't support higher frame rates than 120hz.
        // If the calculated frame time gets lower than 8, it is probably a bug.
        nextFrameTime = 8;
      }
      // If one frame goes long, then the next one can be short to catch up.
      // If two frames are short in a row, then that's an indication that we
      // actually have a higher frame rate than what we're currently optimizing.
      // We adjust our heuristic dynamically accordingly. For example, if we're
      // running on 120hz display or 90hz VR display.
      // Take the max of the two in case one of them was an anomaly due to
      // missed frame deadlines.
      activeFrameTime = nextFrameTime < previousFrameTime ? previousFrameTime : nextFrameTime;
    } else {
      previousFrameTime = nextFrameTime;
    }
    frameDeadline = rafTime + activeFrameTime;
    if (!isMessageEventScheduled) {
      isMessageEventScheduled = true;
      port.postMessage(undefined);
    }
  };

  requestHostCallback = function (callback, absoluteTimeout) {
    scheduledHostCallback = callback;
    timeoutTime = absoluteTimeout;
    if (isFlushingHostCallback || absoluteTimeout < 0) {
      // Don't wait for the next frame. Continue working ASAP, in a new event.
      port.postMessage(undefined);
    } else if (!isAnimationFrameScheduled) {
      // If rAF didn't already schedule one, we need to schedule a frame.
      // TODO: If this rAF doesn't materialize because the browser throttles, we
      // might want to still have setTimeout trigger rIC as a backup to ensure
      // that we keep performing work.
      isAnimationFrameScheduled = true;
      requestAnimationFrameWithTimeout(animationTick);
    }
  };

  cancelHostCallback = function () {
    scheduledHostCallback = null;
    isMessageEventScheduled = false;
    timeoutTime = -1;
  };
}

exports.unstable_ImmediatePriority = ImmediatePriority;
exports.unstable_UserBlockingPriority = UserBlockingPriority;
exports.unstable_NormalPriority = NormalPriority;
exports.unstable_IdlePriority = IdlePriority;
exports.unstable_LowPriority = LowPriority;
exports.unstable_runWithPriority = unstable_runWithPriority;
exports.unstable_scheduleCallback = unstable_scheduleCallback;
exports.unstable_cancelCallback = unstable_cancelCallback;
exports.unstable_wrapCallback = unstable_wrapCallback;
exports.unstable_getCurrentPriorityLevel = unstable_getCurrentPriorityLevel;
exports.unstable_shouldYield = unstable_shouldYield;
exports.unstable_continueExecution = unstable_continueExecution;
exports.unstable_pauseExecution = unstable_pauseExecution;
exports.unstable_getFirstCallbackNode = unstable_getFirstCallbackNode;
  })();
}

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../webpack/buildin/global.js */ "yLpj"), __webpack_require__(/*! ./../../console-browserify/index.js */ "ziTh")))

/***/ }),

/***/ "QCnb":
/*!*****************************************!*\
  !*** ./node_modules/scheduler/index.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


if (false) {} else {
  module.exports = __webpack_require__(/*! ./cjs/scheduler.development.js */ "MGln");
}


/***/ }),

/***/ "bwe0":
/*!*******************************************!*\
  !*** ./node_modules/scheduler/tracing.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


if (false) {} else {
  module.exports = __webpack_require__(/*! ./cjs/scheduler-tracing.development.js */ "GXno");
}


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvc2NoZWR1bGVyL2Nqcy9zY2hlZHVsZXItdHJhY2luZy5kZXZlbG9wbWVudC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvc2NoZWR1bGVyL2Nqcy9zY2hlZHVsZXIuZGV2ZWxvcG1lbnQuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3NjaGVkdWxlci9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvc2NoZWR1bGVyL3RyYWNpbmcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRWE7Ozs7QUFJYixJQUFJLElBQXFDO0FBQ3pDO0FBQ0E7O0FBRUEsOENBQThDLGNBQWM7O0FBRTVEOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7O0FBR0Esa0RBQWtEOzs7QUFHbEQ7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7O0FBR0E7OztBQUdBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOzs7Ozs7Ozs7Ozs7O0FDdGFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRWE7Ozs7QUFJYixJQUFJLElBQXFDO0FBQ3pDO0FBQ0E7O0FBRUEsOENBQThDLGNBQWM7O0FBRTVEOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSwrQkFBK0I7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87O0FBRVA7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7Ozs7Ozs7Ozs7Ozs7O0FDMXBCYTs7QUFFYixJQUFJLEtBQXFDLEVBQUUsRUFFMUM7QUFDRCxtQkFBbUIsbUJBQU8sQ0FBQyw0Q0FBZ0M7QUFDM0Q7Ozs7Ozs7Ozs7Ozs7QUNOYTs7QUFFYixJQUFJLEtBQXFDLEVBQUUsRUFFMUM7QUFDRCxtQkFBbUIsbUJBQU8sQ0FBQyxvREFBd0M7QUFDbkUiLCJmaWxlIjoiYnVpbGQvdmVuZG9yL3ZlbmRvci5zY2hlZHVsZXIuNGNmZTAzOTcwZWI1OTQ4OTI1MDcuY2h1bmsuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGxpY2Vuc2UgUmVhY3QgdjAuMTMuMVxuICogc2NoZWR1bGVyLXRyYWNpbmcuZGV2ZWxvcG1lbnQuanNcbiAqXG4gKiBDb3B5cmlnaHQgKGMpIEZhY2Vib29rLCBJbmMuIGFuZCBpdHMgYWZmaWxpYXRlcy5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cblxuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSB7XG4gIChmdW5jdGlvbigpIHtcbid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcblxuLy8gSGVscHMgaWRlbnRpZnkgc2lkZSBlZmZlY3RzIGluIGJlZ2luLXBoYXNlIGxpZmVjeWNsZSBob29rcyBhbmQgc2V0U3RhdGUgcmVkdWNlcnM6XG5cblxuLy8gSW4gc29tZSBjYXNlcywgU3RyaWN0TW9kZSBzaG91bGQgYWxzbyBkb3VibGUtcmVuZGVyIGxpZmVjeWNsZXMuXG4vLyBUaGlzIGNhbiBiZSBjb25mdXNpbmcgZm9yIHRlc3RzIHRob3VnaCxcbi8vIEFuZCBpdCBjYW4gYmUgYmFkIGZvciBwZXJmb3JtYW5jZSBpbiBwcm9kdWN0aW9uLlxuLy8gVGhpcyBmZWF0dXJlIGZsYWcgY2FuIGJlIHVzZWQgdG8gY29udHJvbCB0aGUgYmVoYXZpb3I6XG5cblxuLy8gVG8gcHJlc2VydmUgdGhlIFwiUGF1c2Ugb24gY2F1Z2h0IGV4Y2VwdGlvbnNcIiBiZWhhdmlvciBvZiB0aGUgZGVidWdnZXIsIHdlXG4vLyByZXBsYXkgdGhlIGJlZ2luIHBoYXNlIG9mIGEgZmFpbGVkIGNvbXBvbmVudCBpbnNpZGUgaW52b2tlR3VhcmRlZENhbGxiYWNrLlxuXG5cbi8vIFdhcm4gYWJvdXQgZGVwcmVjYXRlZCwgYXN5bmMtdW5zYWZlIGxpZmVjeWNsZXM7IHJlbGF0ZXMgdG8gUkZDICM2OlxuXG5cbi8vIEdhdGhlciBhZHZhbmNlZCB0aW1pbmcgbWV0cmljcyBmb3IgUHJvZmlsZXIgc3VidHJlZXMuXG5cblxuLy8gVHJhY2Ugd2hpY2ggaW50ZXJhY3Rpb25zIHRyaWdnZXIgZWFjaCBjb21taXQuXG52YXIgZW5hYmxlU2NoZWR1bGVyVHJhY2luZyA9IHRydWU7XG5cbi8vIE9ubHkgdXNlZCBpbiB3d3cgYnVpbGRzLlxuIC8vIFRPRE86IHRydWU/IEhlcmUgaXQgbWlnaHQganVzdCBiZSBmYWxzZS5cblxuLy8gT25seSB1c2VkIGluIHd3dyBidWlsZHMuXG5cblxuLy8gT25seSB1c2VkIGluIHd3dyBidWlsZHMuXG5cblxuLy8gUmVhY3QgRmlyZTogcHJldmVudCB0aGUgdmFsdWUgYW5kIGNoZWNrZWQgYXR0cmlidXRlcyBmcm9tIHN5bmNpbmdcbi8vIHdpdGggdGhlaXIgcmVsYXRlZCBET00gcHJvcGVydGllc1xuXG5cbi8vIFRoZXNlIEFQSXMgd2lsbCBubyBsb25nZXIgYmUgXCJ1bnN0YWJsZVwiIGluIHRoZSB1cGNvbWluZyAxNi43IHJlbGVhc2UsXG4vLyBDb250cm9sIHRoaXMgYmVoYXZpb3Igd2l0aCBhIGZsYWcgdG8gc3VwcG9ydCAxNi42IG1pbm9yIHJlbGVhc2VzIGluIHRoZSBtZWFud2hpbGUuXG5cbnZhciBERUZBVUxUX1RIUkVBRF9JRCA9IDA7XG5cbi8vIENvdW50ZXJzIHVzZWQgdG8gZ2VuZXJhdGUgdW5pcXVlIElEcy5cbnZhciBpbnRlcmFjdGlvbklEQ291bnRlciA9IDA7XG52YXIgdGhyZWFkSURDb3VudGVyID0gMDtcblxuLy8gU2V0IG9mIGN1cnJlbnRseSB0cmFjZWQgaW50ZXJhY3Rpb25zLlxuLy8gSW50ZXJhY3Rpb25zIFwic3RhY2tcIuKAk1xuLy8gTWVhbmluZyB0aGF0IG5ld2x5IHRyYWNlZCBpbnRlcmFjdGlvbnMgYXJlIGFwcGVuZGVkIHRvIHRoZSBwcmV2aW91c2x5IGFjdGl2ZSBzZXQuXG4vLyBXaGVuIGFuIGludGVyYWN0aW9uIGdvZXMgb3V0IG9mIHNjb3BlLCB0aGUgcHJldmlvdXMgc2V0IChpZiBhbnkpIGlzIHJlc3RvcmVkLlxuZXhwb3J0cy5fX2ludGVyYWN0aW9uc1JlZiA9IG51bGw7XG5cbi8vIExpc3RlbmVyKHMpIHRvIG5vdGlmeSB3aGVuIGludGVyYWN0aW9ucyBiZWdpbiBhbmQgZW5kLlxuZXhwb3J0cy5fX3N1YnNjcmliZXJSZWYgPSBudWxsO1xuXG5pZiAoZW5hYmxlU2NoZWR1bGVyVHJhY2luZykge1xuICBleHBvcnRzLl9faW50ZXJhY3Rpb25zUmVmID0ge1xuICAgIGN1cnJlbnQ6IG5ldyBTZXQoKVxuICB9O1xuICBleHBvcnRzLl9fc3Vic2NyaWJlclJlZiA9IHtcbiAgICBjdXJyZW50OiBudWxsXG4gIH07XG59XG5cbmZ1bmN0aW9uIHVuc3RhYmxlX2NsZWFyKGNhbGxiYWNrKSB7XG4gIGlmICghZW5hYmxlU2NoZWR1bGVyVHJhY2luZykge1xuICAgIHJldHVybiBjYWxsYmFjaygpO1xuICB9XG5cbiAgdmFyIHByZXZJbnRlcmFjdGlvbnMgPSBleHBvcnRzLl9faW50ZXJhY3Rpb25zUmVmLmN1cnJlbnQ7XG4gIGV4cG9ydHMuX19pbnRlcmFjdGlvbnNSZWYuY3VycmVudCA9IG5ldyBTZXQoKTtcblxuICB0cnkge1xuICAgIHJldHVybiBjYWxsYmFjaygpO1xuICB9IGZpbmFsbHkge1xuICAgIGV4cG9ydHMuX19pbnRlcmFjdGlvbnNSZWYuY3VycmVudCA9IHByZXZJbnRlcmFjdGlvbnM7XG4gIH1cbn1cblxuZnVuY3Rpb24gdW5zdGFibGVfZ2V0Q3VycmVudCgpIHtcbiAgaWYgKCFlbmFibGVTY2hlZHVsZXJUcmFjaW5nKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGV4cG9ydHMuX19pbnRlcmFjdGlvbnNSZWYuY3VycmVudDtcbiAgfVxufVxuXG5mdW5jdGlvbiB1bnN0YWJsZV9nZXRUaHJlYWRJRCgpIHtcbiAgcmV0dXJuICsrdGhyZWFkSURDb3VudGVyO1xufVxuXG5mdW5jdGlvbiB1bnN0YWJsZV90cmFjZShuYW1lLCB0aW1lc3RhbXAsIGNhbGxiYWNrKSB7XG4gIHZhciB0aHJlYWRJRCA9IGFyZ3VtZW50cy5sZW5ndGggPiAzICYmIGFyZ3VtZW50c1szXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzNdIDogREVGQVVMVF9USFJFQURfSUQ7XG5cbiAgaWYgKCFlbmFibGVTY2hlZHVsZXJUcmFjaW5nKSB7XG4gICAgcmV0dXJuIGNhbGxiYWNrKCk7XG4gIH1cblxuICB2YXIgaW50ZXJhY3Rpb24gPSB7XG4gICAgX19jb3VudDogMSxcbiAgICBpZDogaW50ZXJhY3Rpb25JRENvdW50ZXIrKyxcbiAgICBuYW1lOiBuYW1lLFxuICAgIHRpbWVzdGFtcDogdGltZXN0YW1wXG4gIH07XG5cbiAgdmFyIHByZXZJbnRlcmFjdGlvbnMgPSBleHBvcnRzLl9faW50ZXJhY3Rpb25zUmVmLmN1cnJlbnQ7XG5cbiAgLy8gVHJhY2VkIGludGVyYWN0aW9ucyBzaG91bGQgc3RhY2svYWNjdW11bGF0ZS5cbiAgLy8gVG8gZG8gdGhhdCwgY2xvbmUgdGhlIGN1cnJlbnQgaW50ZXJhY3Rpb25zLlxuICAvLyBUaGUgcHJldmlvdXMgc2V0IHdpbGwgYmUgcmVzdG9yZWQgdXBvbiBjb21wbGV0aW9uLlxuICB2YXIgaW50ZXJhY3Rpb25zID0gbmV3IFNldChwcmV2SW50ZXJhY3Rpb25zKTtcbiAgaW50ZXJhY3Rpb25zLmFkZChpbnRlcmFjdGlvbik7XG4gIGV4cG9ydHMuX19pbnRlcmFjdGlvbnNSZWYuY3VycmVudCA9IGludGVyYWN0aW9ucztcblxuICB2YXIgc3Vic2NyaWJlciA9IGV4cG9ydHMuX19zdWJzY3JpYmVyUmVmLmN1cnJlbnQ7XG4gIHZhciByZXR1cm5WYWx1ZSA9IHZvaWQgMDtcblxuICB0cnkge1xuICAgIGlmIChzdWJzY3JpYmVyICE9PSBudWxsKSB7XG4gICAgICBzdWJzY3JpYmVyLm9uSW50ZXJhY3Rpb25UcmFjZWQoaW50ZXJhY3Rpb24pO1xuICAgIH1cbiAgfSBmaW5hbGx5IHtcbiAgICB0cnkge1xuICAgICAgaWYgKHN1YnNjcmliZXIgIT09IG51bGwpIHtcbiAgICAgICAgc3Vic2NyaWJlci5vbldvcmtTdGFydGVkKGludGVyYWN0aW9ucywgdGhyZWFkSUQpO1xuICAgICAgfVxuICAgIH0gZmluYWxseSB7XG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm5WYWx1ZSA9IGNhbGxiYWNrKCk7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBleHBvcnRzLl9faW50ZXJhY3Rpb25zUmVmLmN1cnJlbnQgPSBwcmV2SW50ZXJhY3Rpb25zO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgaWYgKHN1YnNjcmliZXIgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHN1YnNjcmliZXIub25Xb3JrU3RvcHBlZChpbnRlcmFjdGlvbnMsIHRocmVhZElEKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgaW50ZXJhY3Rpb24uX19jb3VudC0tO1xuXG4gICAgICAgICAgLy8gSWYgbm8gYXN5bmMgd29yayB3YXMgc2NoZWR1bGVkIGZvciB0aGlzIGludGVyYWN0aW9uLFxuICAgICAgICAgIC8vIE5vdGlmeSBzdWJzY3JpYmVycyB0aGF0IGl0J3MgY29tcGxldGVkLlxuICAgICAgICAgIGlmIChzdWJzY3JpYmVyICE9PSBudWxsICYmIGludGVyYWN0aW9uLl9fY291bnQgPT09IDApIHtcbiAgICAgICAgICAgIHN1YnNjcmliZXIub25JbnRlcmFjdGlvblNjaGVkdWxlZFdvcmtDb21wbGV0ZWQoaW50ZXJhY3Rpb24pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXR1cm5WYWx1ZTtcbn1cblxuZnVuY3Rpb24gdW5zdGFibGVfd3JhcChjYWxsYmFjaykge1xuICB2YXIgdGhyZWFkSUQgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IERFRkFVTFRfVEhSRUFEX0lEO1xuXG4gIGlmICghZW5hYmxlU2NoZWR1bGVyVHJhY2luZykge1xuICAgIHJldHVybiBjYWxsYmFjaztcbiAgfVxuXG4gIHZhciB3cmFwcGVkSW50ZXJhY3Rpb25zID0gZXhwb3J0cy5fX2ludGVyYWN0aW9uc1JlZi5jdXJyZW50O1xuXG4gIHZhciBzdWJzY3JpYmVyID0gZXhwb3J0cy5fX3N1YnNjcmliZXJSZWYuY3VycmVudDtcbiAgaWYgKHN1YnNjcmliZXIgIT09IG51bGwpIHtcbiAgICBzdWJzY3JpYmVyLm9uV29ya1NjaGVkdWxlZCh3cmFwcGVkSW50ZXJhY3Rpb25zLCB0aHJlYWRJRCk7XG4gIH1cblxuICAvLyBVcGRhdGUgdGhlIHBlbmRpbmcgYXN5bmMgd29yayBjb3VudCBmb3IgdGhlIGN1cnJlbnQgaW50ZXJhY3Rpb25zLlxuICAvLyBVcGRhdGUgYWZ0ZXIgY2FsbGluZyBzdWJzY3JpYmVycyBpbiBjYXNlIG9mIGVycm9yLlxuICB3cmFwcGVkSW50ZXJhY3Rpb25zLmZvckVhY2goZnVuY3Rpb24gKGludGVyYWN0aW9uKSB7XG4gICAgaW50ZXJhY3Rpb24uX19jb3VudCsrO1xuICB9KTtcblxuICB2YXIgaGFzUnVuID0gZmFsc2U7XG5cbiAgZnVuY3Rpb24gd3JhcHBlZCgpIHtcbiAgICB2YXIgcHJldkludGVyYWN0aW9ucyA9IGV4cG9ydHMuX19pbnRlcmFjdGlvbnNSZWYuY3VycmVudDtcbiAgICBleHBvcnRzLl9faW50ZXJhY3Rpb25zUmVmLmN1cnJlbnQgPSB3cmFwcGVkSW50ZXJhY3Rpb25zO1xuXG4gICAgc3Vic2NyaWJlciA9IGV4cG9ydHMuX19zdWJzY3JpYmVyUmVmLmN1cnJlbnQ7XG5cbiAgICB0cnkge1xuICAgICAgdmFyIHJldHVyblZhbHVlID0gdm9pZCAwO1xuXG4gICAgICB0cnkge1xuICAgICAgICBpZiAoc3Vic2NyaWJlciAhPT0gbnVsbCkge1xuICAgICAgICAgIHN1YnNjcmliZXIub25Xb3JrU3RhcnRlZCh3cmFwcGVkSW50ZXJhY3Rpb25zLCB0aHJlYWRJRCk7XG4gICAgICAgIH1cbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgcmV0dXJuVmFsdWUgPSBjYWxsYmFjay5hcHBseSh1bmRlZmluZWQsIGFyZ3VtZW50cyk7XG4gICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgZXhwb3J0cy5fX2ludGVyYWN0aW9uc1JlZi5jdXJyZW50ID0gcHJldkludGVyYWN0aW9ucztcblxuICAgICAgICAgIGlmIChzdWJzY3JpYmVyICE9PSBudWxsKSB7XG4gICAgICAgICAgICBzdWJzY3JpYmVyLm9uV29ya1N0b3BwZWQod3JhcHBlZEludGVyYWN0aW9ucywgdGhyZWFkSUQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmV0dXJuVmFsdWU7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIGlmICghaGFzUnVuKSB7XG4gICAgICAgIC8vIFdlIG9ubHkgZXhwZWN0IGEgd3JhcHBlZCBmdW5jdGlvbiB0byBiZSBleGVjdXRlZCBvbmNlLFxuICAgICAgICAvLyBCdXQgaW4gdGhlIGV2ZW50IHRoYXQgaXQncyBleGVjdXRlZCBtb3JlIHRoYW4gb25jZeKAk1xuICAgICAgICAvLyBPbmx5IGRlY3JlbWVudCB0aGUgb3V0c3RhbmRpbmcgaW50ZXJhY3Rpb24gY291bnRzIG9uY2UuXG4gICAgICAgIGhhc1J1biA9IHRydWU7XG5cbiAgICAgICAgLy8gVXBkYXRlIHBlbmRpbmcgYXN5bmMgY291bnRzIGZvciBhbGwgd3JhcHBlZCBpbnRlcmFjdGlvbnMuXG4gICAgICAgIC8vIElmIHRoaXMgd2FzIHRoZSBsYXN0IHNjaGVkdWxlZCBhc3luYyB3b3JrIGZvciBhbnkgb2YgdGhlbSxcbiAgICAgICAgLy8gTWFyayB0aGVtIGFzIGNvbXBsZXRlZC5cbiAgICAgICAgd3JhcHBlZEludGVyYWN0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uIChpbnRlcmFjdGlvbikge1xuICAgICAgICAgIGludGVyYWN0aW9uLl9fY291bnQtLTtcblxuICAgICAgICAgIGlmIChzdWJzY3JpYmVyICE9PSBudWxsICYmIGludGVyYWN0aW9uLl9fY291bnQgPT09IDApIHtcbiAgICAgICAgICAgIHN1YnNjcmliZXIub25JbnRlcmFjdGlvblNjaGVkdWxlZFdvcmtDb21wbGV0ZWQoaW50ZXJhY3Rpb24pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgd3JhcHBlZC5jYW5jZWwgPSBmdW5jdGlvbiBjYW5jZWwoKSB7XG4gICAgc3Vic2NyaWJlciA9IGV4cG9ydHMuX19zdWJzY3JpYmVyUmVmLmN1cnJlbnQ7XG5cbiAgICB0cnkge1xuICAgICAgaWYgKHN1YnNjcmliZXIgIT09IG51bGwpIHtcbiAgICAgICAgc3Vic2NyaWJlci5vbldvcmtDYW5jZWxlZCh3cmFwcGVkSW50ZXJhY3Rpb25zLCB0aHJlYWRJRCk7XG4gICAgICB9XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIC8vIFVwZGF0ZSBwZW5kaW5nIGFzeW5jIGNvdW50cyBmb3IgYWxsIHdyYXBwZWQgaW50ZXJhY3Rpb25zLlxuICAgICAgLy8gSWYgdGhpcyB3YXMgdGhlIGxhc3Qgc2NoZWR1bGVkIGFzeW5jIHdvcmsgZm9yIGFueSBvZiB0aGVtLFxuICAgICAgLy8gTWFyayB0aGVtIGFzIGNvbXBsZXRlZC5cbiAgICAgIHdyYXBwZWRJbnRlcmFjdGlvbnMuZm9yRWFjaChmdW5jdGlvbiAoaW50ZXJhY3Rpb24pIHtcbiAgICAgICAgaW50ZXJhY3Rpb24uX19jb3VudC0tO1xuXG4gICAgICAgIGlmIChzdWJzY3JpYmVyICYmIGludGVyYWN0aW9uLl9fY291bnQgPT09IDApIHtcbiAgICAgICAgICBzdWJzY3JpYmVyLm9uSW50ZXJhY3Rpb25TY2hlZHVsZWRXb3JrQ29tcGxldGVkKGludGVyYWN0aW9uKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiB3cmFwcGVkO1xufVxuXG52YXIgc3Vic2NyaWJlcnMgPSBudWxsO1xuaWYgKGVuYWJsZVNjaGVkdWxlclRyYWNpbmcpIHtcbiAgc3Vic2NyaWJlcnMgPSBuZXcgU2V0KCk7XG59XG5cbmZ1bmN0aW9uIHVuc3RhYmxlX3N1YnNjcmliZShzdWJzY3JpYmVyKSB7XG4gIGlmIChlbmFibGVTY2hlZHVsZXJUcmFjaW5nKSB7XG4gICAgc3Vic2NyaWJlcnMuYWRkKHN1YnNjcmliZXIpO1xuXG4gICAgaWYgKHN1YnNjcmliZXJzLnNpemUgPT09IDEpIHtcbiAgICAgIGV4cG9ydHMuX19zdWJzY3JpYmVyUmVmLmN1cnJlbnQgPSB7XG4gICAgICAgIG9uSW50ZXJhY3Rpb25TY2hlZHVsZWRXb3JrQ29tcGxldGVkOiBvbkludGVyYWN0aW9uU2NoZWR1bGVkV29ya0NvbXBsZXRlZCxcbiAgICAgICAgb25JbnRlcmFjdGlvblRyYWNlZDogb25JbnRlcmFjdGlvblRyYWNlZCxcbiAgICAgICAgb25Xb3JrQ2FuY2VsZWQ6IG9uV29ya0NhbmNlbGVkLFxuICAgICAgICBvbldvcmtTY2hlZHVsZWQ6IG9uV29ya1NjaGVkdWxlZCxcbiAgICAgICAgb25Xb3JrU3RhcnRlZDogb25Xb3JrU3RhcnRlZCxcbiAgICAgICAgb25Xb3JrU3RvcHBlZDogb25Xb3JrU3RvcHBlZFxuICAgICAgfTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gdW5zdGFibGVfdW5zdWJzY3JpYmUoc3Vic2NyaWJlcikge1xuICBpZiAoZW5hYmxlU2NoZWR1bGVyVHJhY2luZykge1xuICAgIHN1YnNjcmliZXJzLmRlbGV0ZShzdWJzY3JpYmVyKTtcblxuICAgIGlmIChzdWJzY3JpYmVycy5zaXplID09PSAwKSB7XG4gICAgICBleHBvcnRzLl9fc3Vic2NyaWJlclJlZi5jdXJyZW50ID0gbnVsbDtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gb25JbnRlcmFjdGlvblRyYWNlZChpbnRlcmFjdGlvbikge1xuICB2YXIgZGlkQ2F0Y2hFcnJvciA9IGZhbHNlO1xuICB2YXIgY2F1Z2h0RXJyb3IgPSBudWxsO1xuXG4gIHN1YnNjcmliZXJzLmZvckVhY2goZnVuY3Rpb24gKHN1YnNjcmliZXIpIHtcbiAgICB0cnkge1xuICAgICAgc3Vic2NyaWJlci5vbkludGVyYWN0aW9uVHJhY2VkKGludGVyYWN0aW9uKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgaWYgKCFkaWRDYXRjaEVycm9yKSB7XG4gICAgICAgIGRpZENhdGNoRXJyb3IgPSB0cnVlO1xuICAgICAgICBjYXVnaHRFcnJvciA9IGVycm9yO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgaWYgKGRpZENhdGNoRXJyb3IpIHtcbiAgICB0aHJvdyBjYXVnaHRFcnJvcjtcbiAgfVxufVxuXG5mdW5jdGlvbiBvbkludGVyYWN0aW9uU2NoZWR1bGVkV29ya0NvbXBsZXRlZChpbnRlcmFjdGlvbikge1xuICB2YXIgZGlkQ2F0Y2hFcnJvciA9IGZhbHNlO1xuICB2YXIgY2F1Z2h0RXJyb3IgPSBudWxsO1xuXG4gIHN1YnNjcmliZXJzLmZvckVhY2goZnVuY3Rpb24gKHN1YnNjcmliZXIpIHtcbiAgICB0cnkge1xuICAgICAgc3Vic2NyaWJlci5vbkludGVyYWN0aW9uU2NoZWR1bGVkV29ya0NvbXBsZXRlZChpbnRlcmFjdGlvbik7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGlmICghZGlkQ2F0Y2hFcnJvcikge1xuICAgICAgICBkaWRDYXRjaEVycm9yID0gdHJ1ZTtcbiAgICAgICAgY2F1Z2h0RXJyb3IgPSBlcnJvcjtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIGlmIChkaWRDYXRjaEVycm9yKSB7XG4gICAgdGhyb3cgY2F1Z2h0RXJyb3I7XG4gIH1cbn1cblxuZnVuY3Rpb24gb25Xb3JrU2NoZWR1bGVkKGludGVyYWN0aW9ucywgdGhyZWFkSUQpIHtcbiAgdmFyIGRpZENhdGNoRXJyb3IgPSBmYWxzZTtcbiAgdmFyIGNhdWdodEVycm9yID0gbnVsbDtcblxuICBzdWJzY3JpYmVycy5mb3JFYWNoKGZ1bmN0aW9uIChzdWJzY3JpYmVyKSB7XG4gICAgdHJ5IHtcbiAgICAgIHN1YnNjcmliZXIub25Xb3JrU2NoZWR1bGVkKGludGVyYWN0aW9ucywgdGhyZWFkSUQpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBpZiAoIWRpZENhdGNoRXJyb3IpIHtcbiAgICAgICAgZGlkQ2F0Y2hFcnJvciA9IHRydWU7XG4gICAgICAgIGNhdWdodEVycm9yID0gZXJyb3I7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICBpZiAoZGlkQ2F0Y2hFcnJvcikge1xuICAgIHRocm93IGNhdWdodEVycm9yO1xuICB9XG59XG5cbmZ1bmN0aW9uIG9uV29ya1N0YXJ0ZWQoaW50ZXJhY3Rpb25zLCB0aHJlYWRJRCkge1xuICB2YXIgZGlkQ2F0Y2hFcnJvciA9IGZhbHNlO1xuICB2YXIgY2F1Z2h0RXJyb3IgPSBudWxsO1xuXG4gIHN1YnNjcmliZXJzLmZvckVhY2goZnVuY3Rpb24gKHN1YnNjcmliZXIpIHtcbiAgICB0cnkge1xuICAgICAgc3Vic2NyaWJlci5vbldvcmtTdGFydGVkKGludGVyYWN0aW9ucywgdGhyZWFkSUQpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBpZiAoIWRpZENhdGNoRXJyb3IpIHtcbiAgICAgICAgZGlkQ2F0Y2hFcnJvciA9IHRydWU7XG4gICAgICAgIGNhdWdodEVycm9yID0gZXJyb3I7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICBpZiAoZGlkQ2F0Y2hFcnJvcikge1xuICAgIHRocm93IGNhdWdodEVycm9yO1xuICB9XG59XG5cbmZ1bmN0aW9uIG9uV29ya1N0b3BwZWQoaW50ZXJhY3Rpb25zLCB0aHJlYWRJRCkge1xuICB2YXIgZGlkQ2F0Y2hFcnJvciA9IGZhbHNlO1xuICB2YXIgY2F1Z2h0RXJyb3IgPSBudWxsO1xuXG4gIHN1YnNjcmliZXJzLmZvckVhY2goZnVuY3Rpb24gKHN1YnNjcmliZXIpIHtcbiAgICB0cnkge1xuICAgICAgc3Vic2NyaWJlci5vbldvcmtTdG9wcGVkKGludGVyYWN0aW9ucywgdGhyZWFkSUQpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBpZiAoIWRpZENhdGNoRXJyb3IpIHtcbiAgICAgICAgZGlkQ2F0Y2hFcnJvciA9IHRydWU7XG4gICAgICAgIGNhdWdodEVycm9yID0gZXJyb3I7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICBpZiAoZGlkQ2F0Y2hFcnJvcikge1xuICAgIHRocm93IGNhdWdodEVycm9yO1xuICB9XG59XG5cbmZ1bmN0aW9uIG9uV29ya0NhbmNlbGVkKGludGVyYWN0aW9ucywgdGhyZWFkSUQpIHtcbiAgdmFyIGRpZENhdGNoRXJyb3IgPSBmYWxzZTtcbiAgdmFyIGNhdWdodEVycm9yID0gbnVsbDtcblxuICBzdWJzY3JpYmVycy5mb3JFYWNoKGZ1bmN0aW9uIChzdWJzY3JpYmVyKSB7XG4gICAgdHJ5IHtcbiAgICAgIHN1YnNjcmliZXIub25Xb3JrQ2FuY2VsZWQoaW50ZXJhY3Rpb25zLCB0aHJlYWRJRCk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGlmICghZGlkQ2F0Y2hFcnJvcikge1xuICAgICAgICBkaWRDYXRjaEVycm9yID0gdHJ1ZTtcbiAgICAgICAgY2F1Z2h0RXJyb3IgPSBlcnJvcjtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIGlmIChkaWRDYXRjaEVycm9yKSB7XG4gICAgdGhyb3cgY2F1Z2h0RXJyb3I7XG4gIH1cbn1cblxuZXhwb3J0cy51bnN0YWJsZV9jbGVhciA9IHVuc3RhYmxlX2NsZWFyO1xuZXhwb3J0cy51bnN0YWJsZV9nZXRDdXJyZW50ID0gdW5zdGFibGVfZ2V0Q3VycmVudDtcbmV4cG9ydHMudW5zdGFibGVfZ2V0VGhyZWFkSUQgPSB1bnN0YWJsZV9nZXRUaHJlYWRJRDtcbmV4cG9ydHMudW5zdGFibGVfdHJhY2UgPSB1bnN0YWJsZV90cmFjZTtcbmV4cG9ydHMudW5zdGFibGVfd3JhcCA9IHVuc3RhYmxlX3dyYXA7XG5leHBvcnRzLnVuc3RhYmxlX3N1YnNjcmliZSA9IHVuc3RhYmxlX3N1YnNjcmliZTtcbmV4cG9ydHMudW5zdGFibGVfdW5zdWJzY3JpYmUgPSB1bnN0YWJsZV91bnN1YnNjcmliZTtcbiAgfSkoKTtcbn1cbiIsIi8qKiBAbGljZW5zZSBSZWFjdCB2MC4xMy4xXG4gKiBzY2hlZHVsZXIuZGV2ZWxvcG1lbnQuanNcbiAqXG4gKiBDb3B5cmlnaHQgKGMpIEZhY2Vib29rLCBJbmMuIGFuZCBpdHMgYWZmaWxpYXRlcy5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cblxuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSB7XG4gIChmdW5jdGlvbigpIHtcbid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcblxudmFyIGVuYWJsZVNjaGVkdWxlckRlYnVnZ2luZyA9IGZhbHNlO1xuXG4vKiBlc2xpbnQtZGlzYWJsZSBuby12YXIgKi9cblxuLy8gVE9ETzogVXNlIHN5bWJvbHM/XG52YXIgSW1tZWRpYXRlUHJpb3JpdHkgPSAxO1xudmFyIFVzZXJCbG9ja2luZ1ByaW9yaXR5ID0gMjtcbnZhciBOb3JtYWxQcmlvcml0eSA9IDM7XG52YXIgTG93UHJpb3JpdHkgPSA0O1xudmFyIElkbGVQcmlvcml0eSA9IDU7XG5cbi8vIE1heCAzMSBiaXQgaW50ZWdlci4gVGhlIG1heCBpbnRlZ2VyIHNpemUgaW4gVjggZm9yIDMyLWJpdCBzeXN0ZW1zLlxuLy8gTWF0aC5wb3coMiwgMzApIC0gMVxuLy8gMGIxMTExMTExMTExMTExMTExMTExMTExMTExMTExMTFcbnZhciBtYXhTaWduZWQzMUJpdEludCA9IDEwNzM3NDE4MjM7XG5cbi8vIFRpbWVzIG91dCBpbW1lZGlhdGVseVxudmFyIElNTUVESUFURV9QUklPUklUWV9USU1FT1VUID0gLTE7XG4vLyBFdmVudHVhbGx5IHRpbWVzIG91dFxudmFyIFVTRVJfQkxPQ0tJTkdfUFJJT1JJVFkgPSAyNTA7XG52YXIgTk9STUFMX1BSSU9SSVRZX1RJTUVPVVQgPSA1MDAwO1xudmFyIExPV19QUklPUklUWV9USU1FT1VUID0gMTAwMDA7XG4vLyBOZXZlciB0aW1lcyBvdXRcbnZhciBJRExFX1BSSU9SSVRZID0gbWF4U2lnbmVkMzFCaXRJbnQ7XG5cbi8vIENhbGxiYWNrcyBhcmUgc3RvcmVkIGFzIGEgY2lyY3VsYXIsIGRvdWJseSBsaW5rZWQgbGlzdC5cbnZhciBmaXJzdENhbGxiYWNrTm9kZSA9IG51bGw7XG5cbnZhciBjdXJyZW50RGlkVGltZW91dCA9IGZhbHNlO1xuLy8gUGF1c2luZyB0aGUgc2NoZWR1bGVyIGlzIHVzZWZ1bCBmb3IgZGVidWdnaW5nLlxudmFyIGlzU2NoZWR1bGVyUGF1c2VkID0gZmFsc2U7XG5cbnZhciBjdXJyZW50UHJpb3JpdHlMZXZlbCA9IE5vcm1hbFByaW9yaXR5O1xudmFyIGN1cnJlbnRFdmVudFN0YXJ0VGltZSA9IC0xO1xudmFyIGN1cnJlbnRFeHBpcmF0aW9uVGltZSA9IC0xO1xuXG4vLyBUaGlzIGlzIHNldCB3aGVuIGEgY2FsbGJhY2sgaXMgYmVpbmcgZXhlY3V0ZWQsIHRvIHByZXZlbnQgcmUtZW50cmFuY3kuXG52YXIgaXNFeGVjdXRpbmdDYWxsYmFjayA9IGZhbHNlO1xuXG52YXIgaXNIb3N0Q2FsbGJhY2tTY2hlZHVsZWQgPSBmYWxzZTtcblxudmFyIGhhc05hdGl2ZVBlcmZvcm1hbmNlTm93ID0gdHlwZW9mIHBlcmZvcm1hbmNlID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgcGVyZm9ybWFuY2Uubm93ID09PSAnZnVuY3Rpb24nO1xuXG5mdW5jdGlvbiBlbnN1cmVIb3N0Q2FsbGJhY2tJc1NjaGVkdWxlZCgpIHtcbiAgaWYgKGlzRXhlY3V0aW5nQ2FsbGJhY2spIHtcbiAgICAvLyBEb24ndCBzY2hlZHVsZSB3b3JrIHlldDsgd2FpdCB1bnRpbCB0aGUgbmV4dCB0aW1lIHdlIHlpZWxkLlxuICAgIHJldHVybjtcbiAgfVxuICAvLyBTY2hlZHVsZSB0aGUgaG9zdCBjYWxsYmFjayB1c2luZyB0aGUgZWFybGllc3QgZXhwaXJhdGlvbiBpbiB0aGUgbGlzdC5cbiAgdmFyIGV4cGlyYXRpb25UaW1lID0gZmlyc3RDYWxsYmFja05vZGUuZXhwaXJhdGlvblRpbWU7XG4gIGlmICghaXNIb3N0Q2FsbGJhY2tTY2hlZHVsZWQpIHtcbiAgICBpc0hvc3RDYWxsYmFja1NjaGVkdWxlZCA9IHRydWU7XG4gIH0gZWxzZSB7XG4gICAgLy8gQ2FuY2VsIHRoZSBleGlzdGluZyBob3N0IGNhbGxiYWNrLlxuICAgIGNhbmNlbEhvc3RDYWxsYmFjaygpO1xuICB9XG4gIHJlcXVlc3RIb3N0Q2FsbGJhY2soZmx1c2hXb3JrLCBleHBpcmF0aW9uVGltZSk7XG59XG5cbmZ1bmN0aW9uIGZsdXNoRmlyc3RDYWxsYmFjaygpIHtcbiAgdmFyIGZsdXNoZWROb2RlID0gZmlyc3RDYWxsYmFja05vZGU7XG5cbiAgLy8gUmVtb3ZlIHRoZSBub2RlIGZyb20gdGhlIGxpc3QgYmVmb3JlIGNhbGxpbmcgdGhlIGNhbGxiYWNrLiBUaGF0IHdheSB0aGVcbiAgLy8gbGlzdCBpcyBpbiBhIGNvbnNpc3RlbnQgc3RhdGUgZXZlbiBpZiB0aGUgY2FsbGJhY2sgdGhyb3dzLlxuICB2YXIgbmV4dCA9IGZpcnN0Q2FsbGJhY2tOb2RlLm5leHQ7XG4gIGlmIChmaXJzdENhbGxiYWNrTm9kZSA9PT0gbmV4dCkge1xuICAgIC8vIFRoaXMgaXMgdGhlIGxhc3QgY2FsbGJhY2sgaW4gdGhlIGxpc3QuXG4gICAgZmlyc3RDYWxsYmFja05vZGUgPSBudWxsO1xuICAgIG5leHQgPSBudWxsO1xuICB9IGVsc2Uge1xuICAgIHZhciBsYXN0Q2FsbGJhY2tOb2RlID0gZmlyc3RDYWxsYmFja05vZGUucHJldmlvdXM7XG4gICAgZmlyc3RDYWxsYmFja05vZGUgPSBsYXN0Q2FsbGJhY2tOb2RlLm5leHQgPSBuZXh0O1xuICAgIG5leHQucHJldmlvdXMgPSBsYXN0Q2FsbGJhY2tOb2RlO1xuICB9XG5cbiAgZmx1c2hlZE5vZGUubmV4dCA9IGZsdXNoZWROb2RlLnByZXZpb3VzID0gbnVsbDtcblxuICAvLyBOb3cgaXQncyBzYWZlIHRvIGNhbGwgdGhlIGNhbGxiYWNrLlxuICB2YXIgY2FsbGJhY2sgPSBmbHVzaGVkTm9kZS5jYWxsYmFjaztcbiAgdmFyIGV4cGlyYXRpb25UaW1lID0gZmx1c2hlZE5vZGUuZXhwaXJhdGlvblRpbWU7XG4gIHZhciBwcmlvcml0eUxldmVsID0gZmx1c2hlZE5vZGUucHJpb3JpdHlMZXZlbDtcbiAgdmFyIHByZXZpb3VzUHJpb3JpdHlMZXZlbCA9IGN1cnJlbnRQcmlvcml0eUxldmVsO1xuICB2YXIgcHJldmlvdXNFeHBpcmF0aW9uVGltZSA9IGN1cnJlbnRFeHBpcmF0aW9uVGltZTtcbiAgY3VycmVudFByaW9yaXR5TGV2ZWwgPSBwcmlvcml0eUxldmVsO1xuICBjdXJyZW50RXhwaXJhdGlvblRpbWUgPSBleHBpcmF0aW9uVGltZTtcbiAgdmFyIGNvbnRpbnVhdGlvbkNhbGxiYWNrO1xuICB0cnkge1xuICAgIGNvbnRpbnVhdGlvbkNhbGxiYWNrID0gY2FsbGJhY2soKTtcbiAgfSBmaW5hbGx5IHtcbiAgICBjdXJyZW50UHJpb3JpdHlMZXZlbCA9IHByZXZpb3VzUHJpb3JpdHlMZXZlbDtcbiAgICBjdXJyZW50RXhwaXJhdGlvblRpbWUgPSBwcmV2aW91c0V4cGlyYXRpb25UaW1lO1xuICB9XG5cbiAgLy8gQSBjYWxsYmFjayBtYXkgcmV0dXJuIGEgY29udGludWF0aW9uLiBUaGUgY29udGludWF0aW9uIHNob3VsZCBiZSBzY2hlZHVsZWRcbiAgLy8gd2l0aCB0aGUgc2FtZSBwcmlvcml0eSBhbmQgZXhwaXJhdGlvbiBhcyB0aGUganVzdC1maW5pc2hlZCBjYWxsYmFjay5cbiAgaWYgKHR5cGVvZiBjb250aW51YXRpb25DYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHZhciBjb250aW51YXRpb25Ob2RlID0ge1xuICAgICAgY2FsbGJhY2s6IGNvbnRpbnVhdGlvbkNhbGxiYWNrLFxuICAgICAgcHJpb3JpdHlMZXZlbDogcHJpb3JpdHlMZXZlbCxcbiAgICAgIGV4cGlyYXRpb25UaW1lOiBleHBpcmF0aW9uVGltZSxcbiAgICAgIG5leHQ6IG51bGwsXG4gICAgICBwcmV2aW91czogbnVsbFxuICAgIH07XG5cbiAgICAvLyBJbnNlcnQgdGhlIG5ldyBjYWxsYmFjayBpbnRvIHRoZSBsaXN0LCBzb3J0ZWQgYnkgaXRzIGV4cGlyYXRpb24uIFRoaXMgaXNcbiAgICAvLyBhbG1vc3QgdGhlIHNhbWUgYXMgdGhlIGNvZGUgaW4gYHNjaGVkdWxlQ2FsbGJhY2tgLCBleGNlcHQgdGhlIGNhbGxiYWNrXG4gICAgLy8gaXMgaW5zZXJ0ZWQgaW50byB0aGUgbGlzdCAqYmVmb3JlKiBjYWxsYmFja3Mgb2YgZXF1YWwgZXhwaXJhdGlvbiBpbnN0ZWFkXG4gICAgLy8gb2YgYWZ0ZXIuXG4gICAgaWYgKGZpcnN0Q2FsbGJhY2tOb2RlID09PSBudWxsKSB7XG4gICAgICAvLyBUaGlzIGlzIHRoZSBmaXJzdCBjYWxsYmFjayBpbiB0aGUgbGlzdC5cbiAgICAgIGZpcnN0Q2FsbGJhY2tOb2RlID0gY29udGludWF0aW9uTm9kZS5uZXh0ID0gY29udGludWF0aW9uTm9kZS5wcmV2aW91cyA9IGNvbnRpbnVhdGlvbk5vZGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBuZXh0QWZ0ZXJDb250aW51YXRpb24gPSBudWxsO1xuICAgICAgdmFyIG5vZGUgPSBmaXJzdENhbGxiYWNrTm9kZTtcbiAgICAgIGRvIHtcbiAgICAgICAgaWYgKG5vZGUuZXhwaXJhdGlvblRpbWUgPj0gZXhwaXJhdGlvblRpbWUpIHtcbiAgICAgICAgICAvLyBUaGlzIGNhbGxiYWNrIGV4cGlyZXMgYXQgb3IgYWZ0ZXIgdGhlIGNvbnRpbnVhdGlvbi4gV2Ugd2lsbCBpbnNlcnRcbiAgICAgICAgICAvLyB0aGUgY29udGludWF0aW9uICpiZWZvcmUqIHRoaXMgY2FsbGJhY2suXG4gICAgICAgICAgbmV4dEFmdGVyQ29udGludWF0aW9uID0gbm9kZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBub2RlID0gbm9kZS5uZXh0O1xuICAgICAgfSB3aGlsZSAobm9kZSAhPT0gZmlyc3RDYWxsYmFja05vZGUpO1xuXG4gICAgICBpZiAobmV4dEFmdGVyQ29udGludWF0aW9uID09PSBudWxsKSB7XG4gICAgICAgIC8vIE5vIGVxdWFsIG9yIGxvd2VyIHByaW9yaXR5IGNhbGxiYWNrIHdhcyBmb3VuZCwgd2hpY2ggbWVhbnMgdGhlIG5ld1xuICAgICAgICAvLyBjYWxsYmFjayBpcyB0aGUgbG93ZXN0IHByaW9yaXR5IGNhbGxiYWNrIGluIHRoZSBsaXN0LlxuICAgICAgICBuZXh0QWZ0ZXJDb250aW51YXRpb24gPSBmaXJzdENhbGxiYWNrTm9kZTtcbiAgICAgIH0gZWxzZSBpZiAobmV4dEFmdGVyQ29udGludWF0aW9uID09PSBmaXJzdENhbGxiYWNrTm9kZSkge1xuICAgICAgICAvLyBUaGUgbmV3IGNhbGxiYWNrIGlzIHRoZSBoaWdoZXN0IHByaW9yaXR5IGNhbGxiYWNrIGluIHRoZSBsaXN0LlxuICAgICAgICBmaXJzdENhbGxiYWNrTm9kZSA9IGNvbnRpbnVhdGlvbk5vZGU7XG4gICAgICAgIGVuc3VyZUhvc3RDYWxsYmFja0lzU2NoZWR1bGVkKCk7XG4gICAgICB9XG5cbiAgICAgIHZhciBwcmV2aW91cyA9IG5leHRBZnRlckNvbnRpbnVhdGlvbi5wcmV2aW91cztcbiAgICAgIHByZXZpb3VzLm5leHQgPSBuZXh0QWZ0ZXJDb250aW51YXRpb24ucHJldmlvdXMgPSBjb250aW51YXRpb25Ob2RlO1xuICAgICAgY29udGludWF0aW9uTm9kZS5uZXh0ID0gbmV4dEFmdGVyQ29udGludWF0aW9uO1xuICAgICAgY29udGludWF0aW9uTm9kZS5wcmV2aW91cyA9IHByZXZpb3VzO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBmbHVzaEltbWVkaWF0ZVdvcmsoKSB7XG4gIGlmIChcbiAgLy8gQ29uZmlybSB3ZSd2ZSBleGl0ZWQgdGhlIG91dGVyIG1vc3QgZXZlbnQgaGFuZGxlclxuICBjdXJyZW50RXZlbnRTdGFydFRpbWUgPT09IC0xICYmIGZpcnN0Q2FsbGJhY2tOb2RlICE9PSBudWxsICYmIGZpcnN0Q2FsbGJhY2tOb2RlLnByaW9yaXR5TGV2ZWwgPT09IEltbWVkaWF0ZVByaW9yaXR5KSB7XG4gICAgaXNFeGVjdXRpbmdDYWxsYmFjayA9IHRydWU7XG4gICAgdHJ5IHtcbiAgICAgIGRvIHtcbiAgICAgICAgZmx1c2hGaXJzdENhbGxiYWNrKCk7XG4gICAgICB9IHdoaWxlIChcbiAgICAgIC8vIEtlZXAgZmx1c2hpbmcgdW50aWwgdGhlcmUgYXJlIG5vIG1vcmUgaW1tZWRpYXRlIGNhbGxiYWNrc1xuICAgICAgZmlyc3RDYWxsYmFja05vZGUgIT09IG51bGwgJiYgZmlyc3RDYWxsYmFja05vZGUucHJpb3JpdHlMZXZlbCA9PT0gSW1tZWRpYXRlUHJpb3JpdHkpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICBpc0V4ZWN1dGluZ0NhbGxiYWNrID0gZmFsc2U7XG4gICAgICBpZiAoZmlyc3RDYWxsYmFja05vZGUgIT09IG51bGwpIHtcbiAgICAgICAgLy8gVGhlcmUncyBzdGlsbCB3b3JrIHJlbWFpbmluZy4gUmVxdWVzdCBhbm90aGVyIGNhbGxiYWNrLlxuICAgICAgICBlbnN1cmVIb3N0Q2FsbGJhY2tJc1NjaGVkdWxlZCgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaXNIb3N0Q2FsbGJhY2tTY2hlZHVsZWQgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gZmx1c2hXb3JrKGRpZFRpbWVvdXQpIHtcbiAgLy8gRXhpdCByaWdodCBhd2F5IGlmIHdlJ3JlIGN1cnJlbnRseSBwYXVzZWRcblxuICBpZiAoZW5hYmxlU2NoZWR1bGVyRGVidWdnaW5nICYmIGlzU2NoZWR1bGVyUGF1c2VkKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaXNFeGVjdXRpbmdDYWxsYmFjayA9IHRydWU7XG4gIHZhciBwcmV2aW91c0RpZFRpbWVvdXQgPSBjdXJyZW50RGlkVGltZW91dDtcbiAgY3VycmVudERpZFRpbWVvdXQgPSBkaWRUaW1lb3V0O1xuICB0cnkge1xuICAgIGlmIChkaWRUaW1lb3V0KSB7XG4gICAgICAvLyBGbHVzaCBhbGwgdGhlIGV4cGlyZWQgY2FsbGJhY2tzIHdpdGhvdXQgeWllbGRpbmcuXG4gICAgICB3aGlsZSAoZmlyc3RDYWxsYmFja05vZGUgIT09IG51bGwgJiYgIShlbmFibGVTY2hlZHVsZXJEZWJ1Z2dpbmcgJiYgaXNTY2hlZHVsZXJQYXVzZWQpKSB7XG4gICAgICAgIC8vIFRPRE8gV3JhcCBpbiBmZWF0dXJlIGZsYWdcbiAgICAgICAgLy8gUmVhZCB0aGUgY3VycmVudCB0aW1lLiBGbHVzaCBhbGwgdGhlIGNhbGxiYWNrcyB0aGF0IGV4cGlyZSBhdCBvclxuICAgICAgICAvLyBlYXJsaWVyIHRoYW4gdGhhdCB0aW1lLiBUaGVuIHJlYWQgdGhlIGN1cnJlbnQgdGltZSBhZ2FpbiBhbmQgcmVwZWF0LlxuICAgICAgICAvLyBUaGlzIG9wdGltaXplcyBmb3IgYXMgZmV3IHBlcmZvcm1hbmNlLm5vdyBjYWxscyBhcyBwb3NzaWJsZS5cbiAgICAgICAgdmFyIGN1cnJlbnRUaW1lID0gZXhwb3J0cy51bnN0YWJsZV9ub3coKTtcbiAgICAgICAgaWYgKGZpcnN0Q2FsbGJhY2tOb2RlLmV4cGlyYXRpb25UaW1lIDw9IGN1cnJlbnRUaW1lKSB7XG4gICAgICAgICAgZG8ge1xuICAgICAgICAgICAgZmx1c2hGaXJzdENhbGxiYWNrKCk7XG4gICAgICAgICAgfSB3aGlsZSAoZmlyc3RDYWxsYmFja05vZGUgIT09IG51bGwgJiYgZmlyc3RDYWxsYmFja05vZGUuZXhwaXJhdGlvblRpbWUgPD0gY3VycmVudFRpbWUgJiYgIShlbmFibGVTY2hlZHVsZXJEZWJ1Z2dpbmcgJiYgaXNTY2hlZHVsZXJQYXVzZWQpKTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gS2VlcCBmbHVzaGluZyBjYWxsYmFja3MgdW50aWwgd2UgcnVuIG91dCBvZiB0aW1lIGluIHRoZSBmcmFtZS5cbiAgICAgIGlmIChmaXJzdENhbGxiYWNrTm9kZSAhPT0gbnVsbCkge1xuICAgICAgICBkbyB7XG4gICAgICAgICAgaWYgKGVuYWJsZVNjaGVkdWxlckRlYnVnZ2luZyAmJiBpc1NjaGVkdWxlclBhdXNlZCkge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICAgIGZsdXNoRmlyc3RDYWxsYmFjaygpO1xuICAgICAgICB9IHdoaWxlIChmaXJzdENhbGxiYWNrTm9kZSAhPT0gbnVsbCAmJiAhc2hvdWxkWWllbGRUb0hvc3QoKSk7XG4gICAgICB9XG4gICAgfVxuICB9IGZpbmFsbHkge1xuICAgIGlzRXhlY3V0aW5nQ2FsbGJhY2sgPSBmYWxzZTtcbiAgICBjdXJyZW50RGlkVGltZW91dCA9IHByZXZpb3VzRGlkVGltZW91dDtcbiAgICBpZiAoZmlyc3RDYWxsYmFja05vZGUgIT09IG51bGwpIHtcbiAgICAgIC8vIFRoZXJlJ3Mgc3RpbGwgd29yayByZW1haW5pbmcuIFJlcXVlc3QgYW5vdGhlciBjYWxsYmFjay5cbiAgICAgIGVuc3VyZUhvc3RDYWxsYmFja0lzU2NoZWR1bGVkKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlzSG9zdENhbGxiYWNrU2NoZWR1bGVkID0gZmFsc2U7XG4gICAgfVxuICAgIC8vIEJlZm9yZSBleGl0aW5nLCBmbHVzaCBhbGwgdGhlIGltbWVkaWF0ZSB3b3JrIHRoYXQgd2FzIHNjaGVkdWxlZC5cbiAgICBmbHVzaEltbWVkaWF0ZVdvcmsoKTtcbiAgfVxufVxuXG5mdW5jdGlvbiB1bnN0YWJsZV9ydW5XaXRoUHJpb3JpdHkocHJpb3JpdHlMZXZlbCwgZXZlbnRIYW5kbGVyKSB7XG4gIHN3aXRjaCAocHJpb3JpdHlMZXZlbCkge1xuICAgIGNhc2UgSW1tZWRpYXRlUHJpb3JpdHk6XG4gICAgY2FzZSBVc2VyQmxvY2tpbmdQcmlvcml0eTpcbiAgICBjYXNlIE5vcm1hbFByaW9yaXR5OlxuICAgIGNhc2UgTG93UHJpb3JpdHk6XG4gICAgY2FzZSBJZGxlUHJpb3JpdHk6XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgcHJpb3JpdHlMZXZlbCA9IE5vcm1hbFByaW9yaXR5O1xuICB9XG5cbiAgdmFyIHByZXZpb3VzUHJpb3JpdHlMZXZlbCA9IGN1cnJlbnRQcmlvcml0eUxldmVsO1xuICB2YXIgcHJldmlvdXNFdmVudFN0YXJ0VGltZSA9IGN1cnJlbnRFdmVudFN0YXJ0VGltZTtcbiAgY3VycmVudFByaW9yaXR5TGV2ZWwgPSBwcmlvcml0eUxldmVsO1xuICBjdXJyZW50RXZlbnRTdGFydFRpbWUgPSBleHBvcnRzLnVuc3RhYmxlX25vdygpO1xuXG4gIHRyeSB7XG4gICAgcmV0dXJuIGV2ZW50SGFuZGxlcigpO1xuICB9IGZpbmFsbHkge1xuICAgIGN1cnJlbnRQcmlvcml0eUxldmVsID0gcHJldmlvdXNQcmlvcml0eUxldmVsO1xuICAgIGN1cnJlbnRFdmVudFN0YXJ0VGltZSA9IHByZXZpb3VzRXZlbnRTdGFydFRpbWU7XG5cbiAgICAvLyBCZWZvcmUgZXhpdGluZywgZmx1c2ggYWxsIHRoZSBpbW1lZGlhdGUgd29yayB0aGF0IHdhcyBzY2hlZHVsZWQuXG4gICAgZmx1c2hJbW1lZGlhdGVXb3JrKCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gdW5zdGFibGVfd3JhcENhbGxiYWNrKGNhbGxiYWNrKSB7XG4gIHZhciBwYXJlbnRQcmlvcml0eUxldmVsID0gY3VycmVudFByaW9yaXR5TGV2ZWw7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgLy8gVGhpcyBpcyBhIGZvcmsgb2YgcnVuV2l0aFByaW9yaXR5LCBpbmxpbmVkIGZvciBwZXJmb3JtYW5jZS5cbiAgICB2YXIgcHJldmlvdXNQcmlvcml0eUxldmVsID0gY3VycmVudFByaW9yaXR5TGV2ZWw7XG4gICAgdmFyIHByZXZpb3VzRXZlbnRTdGFydFRpbWUgPSBjdXJyZW50RXZlbnRTdGFydFRpbWU7XG4gICAgY3VycmVudFByaW9yaXR5TGV2ZWwgPSBwYXJlbnRQcmlvcml0eUxldmVsO1xuICAgIGN1cnJlbnRFdmVudFN0YXJ0VGltZSA9IGV4cG9ydHMudW5zdGFibGVfbm93KCk7XG5cbiAgICB0cnkge1xuICAgICAgcmV0dXJuIGNhbGxiYWNrLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIGN1cnJlbnRQcmlvcml0eUxldmVsID0gcHJldmlvdXNQcmlvcml0eUxldmVsO1xuICAgICAgY3VycmVudEV2ZW50U3RhcnRUaW1lID0gcHJldmlvdXNFdmVudFN0YXJ0VGltZTtcbiAgICAgIGZsdXNoSW1tZWRpYXRlV29yaygpO1xuICAgIH1cbiAgfTtcbn1cblxuZnVuY3Rpb24gdW5zdGFibGVfc2NoZWR1bGVDYWxsYmFjayhjYWxsYmFjaywgZGVwcmVjYXRlZF9vcHRpb25zKSB7XG4gIHZhciBzdGFydFRpbWUgPSBjdXJyZW50RXZlbnRTdGFydFRpbWUgIT09IC0xID8gY3VycmVudEV2ZW50U3RhcnRUaW1lIDogZXhwb3J0cy51bnN0YWJsZV9ub3coKTtcblxuICB2YXIgZXhwaXJhdGlvblRpbWU7XG4gIGlmICh0eXBlb2YgZGVwcmVjYXRlZF9vcHRpb25zID09PSAnb2JqZWN0JyAmJiBkZXByZWNhdGVkX29wdGlvbnMgIT09IG51bGwgJiYgdHlwZW9mIGRlcHJlY2F0ZWRfb3B0aW9ucy50aW1lb3V0ID09PSAnbnVtYmVyJykge1xuICAgIC8vIEZJWE1FOiBSZW1vdmUgdGhpcyBicmFuY2ggb25jZSB3ZSBsaWZ0IGV4cGlyYXRpb24gdGltZXMgb3V0IG9mIFJlYWN0LlxuICAgIGV4cGlyYXRpb25UaW1lID0gc3RhcnRUaW1lICsgZGVwcmVjYXRlZF9vcHRpb25zLnRpbWVvdXQ7XG4gIH0gZWxzZSB7XG4gICAgc3dpdGNoIChjdXJyZW50UHJpb3JpdHlMZXZlbCkge1xuICAgICAgY2FzZSBJbW1lZGlhdGVQcmlvcml0eTpcbiAgICAgICAgZXhwaXJhdGlvblRpbWUgPSBzdGFydFRpbWUgKyBJTU1FRElBVEVfUFJJT1JJVFlfVElNRU9VVDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFVzZXJCbG9ja2luZ1ByaW9yaXR5OlxuICAgICAgICBleHBpcmF0aW9uVGltZSA9IHN0YXJ0VGltZSArIFVTRVJfQkxPQ0tJTkdfUFJJT1JJVFk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBJZGxlUHJpb3JpdHk6XG4gICAgICAgIGV4cGlyYXRpb25UaW1lID0gc3RhcnRUaW1lICsgSURMRV9QUklPUklUWTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIExvd1ByaW9yaXR5OlxuICAgICAgICBleHBpcmF0aW9uVGltZSA9IHN0YXJ0VGltZSArIExPV19QUklPUklUWV9USU1FT1VUO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgTm9ybWFsUHJpb3JpdHk6XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBleHBpcmF0aW9uVGltZSA9IHN0YXJ0VGltZSArIE5PUk1BTF9QUklPUklUWV9USU1FT1VUO1xuICAgIH1cbiAgfVxuXG4gIHZhciBuZXdOb2RlID0ge1xuICAgIGNhbGxiYWNrOiBjYWxsYmFjayxcbiAgICBwcmlvcml0eUxldmVsOiBjdXJyZW50UHJpb3JpdHlMZXZlbCxcbiAgICBleHBpcmF0aW9uVGltZTogZXhwaXJhdGlvblRpbWUsXG4gICAgbmV4dDogbnVsbCxcbiAgICBwcmV2aW91czogbnVsbFxuICB9O1xuXG4gIC8vIEluc2VydCB0aGUgbmV3IGNhbGxiYWNrIGludG8gdGhlIGxpc3QsIG9yZGVyZWQgZmlyc3QgYnkgZXhwaXJhdGlvbiwgdGhlblxuICAvLyBieSBpbnNlcnRpb24uIFNvIHRoZSBuZXcgY2FsbGJhY2sgaXMgaW5zZXJ0ZWQgYW55IG90aGVyIGNhbGxiYWNrIHdpdGhcbiAgLy8gZXF1YWwgZXhwaXJhdGlvbi5cbiAgaWYgKGZpcnN0Q2FsbGJhY2tOb2RlID09PSBudWxsKSB7XG4gICAgLy8gVGhpcyBpcyB0aGUgZmlyc3QgY2FsbGJhY2sgaW4gdGhlIGxpc3QuXG4gICAgZmlyc3RDYWxsYmFja05vZGUgPSBuZXdOb2RlLm5leHQgPSBuZXdOb2RlLnByZXZpb3VzID0gbmV3Tm9kZTtcbiAgICBlbnN1cmVIb3N0Q2FsbGJhY2tJc1NjaGVkdWxlZCgpO1xuICB9IGVsc2Uge1xuICAgIHZhciBuZXh0ID0gbnVsbDtcbiAgICB2YXIgbm9kZSA9IGZpcnN0Q2FsbGJhY2tOb2RlO1xuICAgIGRvIHtcbiAgICAgIGlmIChub2RlLmV4cGlyYXRpb25UaW1lID4gZXhwaXJhdGlvblRpbWUpIHtcbiAgICAgICAgLy8gVGhlIG5ldyBjYWxsYmFjayBleHBpcmVzIGJlZm9yZSB0aGlzIG9uZS5cbiAgICAgICAgbmV4dCA9IG5vZGU7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgbm9kZSA9IG5vZGUubmV4dDtcbiAgICB9IHdoaWxlIChub2RlICE9PSBmaXJzdENhbGxiYWNrTm9kZSk7XG5cbiAgICBpZiAobmV4dCA9PT0gbnVsbCkge1xuICAgICAgLy8gTm8gY2FsbGJhY2sgd2l0aCBhIGxhdGVyIGV4cGlyYXRpb24gd2FzIGZvdW5kLCB3aGljaCBtZWFucyB0aGUgbmV3XG4gICAgICAvLyBjYWxsYmFjayBoYXMgdGhlIGxhdGVzdCBleHBpcmF0aW9uIGluIHRoZSBsaXN0LlxuICAgICAgbmV4dCA9IGZpcnN0Q2FsbGJhY2tOb2RlO1xuICAgIH0gZWxzZSBpZiAobmV4dCA9PT0gZmlyc3RDYWxsYmFja05vZGUpIHtcbiAgICAgIC8vIFRoZSBuZXcgY2FsbGJhY2sgaGFzIHRoZSBlYXJsaWVzdCBleHBpcmF0aW9uIGluIHRoZSBlbnRpcmUgbGlzdC5cbiAgICAgIGZpcnN0Q2FsbGJhY2tOb2RlID0gbmV3Tm9kZTtcbiAgICAgIGVuc3VyZUhvc3RDYWxsYmFja0lzU2NoZWR1bGVkKCk7XG4gICAgfVxuXG4gICAgdmFyIHByZXZpb3VzID0gbmV4dC5wcmV2aW91cztcbiAgICBwcmV2aW91cy5uZXh0ID0gbmV4dC5wcmV2aW91cyA9IG5ld05vZGU7XG4gICAgbmV3Tm9kZS5uZXh0ID0gbmV4dDtcbiAgICBuZXdOb2RlLnByZXZpb3VzID0gcHJldmlvdXM7XG4gIH1cblxuICByZXR1cm4gbmV3Tm9kZTtcbn1cblxuZnVuY3Rpb24gdW5zdGFibGVfcGF1c2VFeGVjdXRpb24oKSB7XG4gIGlzU2NoZWR1bGVyUGF1c2VkID0gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gdW5zdGFibGVfY29udGludWVFeGVjdXRpb24oKSB7XG4gIGlzU2NoZWR1bGVyUGF1c2VkID0gZmFsc2U7XG4gIGlmIChmaXJzdENhbGxiYWNrTm9kZSAhPT0gbnVsbCkge1xuICAgIGVuc3VyZUhvc3RDYWxsYmFja0lzU2NoZWR1bGVkKCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gdW5zdGFibGVfZ2V0Rmlyc3RDYWxsYmFja05vZGUoKSB7XG4gIHJldHVybiBmaXJzdENhbGxiYWNrTm9kZTtcbn1cblxuZnVuY3Rpb24gdW5zdGFibGVfY2FuY2VsQ2FsbGJhY2soY2FsbGJhY2tOb2RlKSB7XG4gIHZhciBuZXh0ID0gY2FsbGJhY2tOb2RlLm5leHQ7XG4gIGlmIChuZXh0ID09PSBudWxsKSB7XG4gICAgLy8gQWxyZWFkeSBjYW5jZWxsZWQuXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKG5leHQgPT09IGNhbGxiYWNrTm9kZSkge1xuICAgIC8vIFRoaXMgaXMgdGhlIG9ubHkgc2NoZWR1bGVkIGNhbGxiYWNrLiBDbGVhciB0aGUgbGlzdC5cbiAgICBmaXJzdENhbGxiYWNrTm9kZSA9IG51bGw7XG4gIH0gZWxzZSB7XG4gICAgLy8gUmVtb3ZlIHRoZSBjYWxsYmFjayBmcm9tIGl0cyBwb3NpdGlvbiBpbiB0aGUgbGlzdC5cbiAgICBpZiAoY2FsbGJhY2tOb2RlID09PSBmaXJzdENhbGxiYWNrTm9kZSkge1xuICAgICAgZmlyc3RDYWxsYmFja05vZGUgPSBuZXh0O1xuICAgIH1cbiAgICB2YXIgcHJldmlvdXMgPSBjYWxsYmFja05vZGUucHJldmlvdXM7XG4gICAgcHJldmlvdXMubmV4dCA9IG5leHQ7XG4gICAgbmV4dC5wcmV2aW91cyA9IHByZXZpb3VzO1xuICB9XG5cbiAgY2FsbGJhY2tOb2RlLm5leHQgPSBjYWxsYmFja05vZGUucHJldmlvdXMgPSBudWxsO1xufVxuXG5mdW5jdGlvbiB1bnN0YWJsZV9nZXRDdXJyZW50UHJpb3JpdHlMZXZlbCgpIHtcbiAgcmV0dXJuIGN1cnJlbnRQcmlvcml0eUxldmVsO1xufVxuXG5mdW5jdGlvbiB1bnN0YWJsZV9zaG91bGRZaWVsZCgpIHtcbiAgcmV0dXJuICFjdXJyZW50RGlkVGltZW91dCAmJiAoZmlyc3RDYWxsYmFja05vZGUgIT09IG51bGwgJiYgZmlyc3RDYWxsYmFja05vZGUuZXhwaXJhdGlvblRpbWUgPCBjdXJyZW50RXhwaXJhdGlvblRpbWUgfHwgc2hvdWxkWWllbGRUb0hvc3QoKSk7XG59XG5cbi8vIFRoZSByZW1haW5pbmcgY29kZSBpcyBlc3NlbnRpYWxseSBhIHBvbHlmaWxsIGZvciByZXF1ZXN0SWRsZUNhbGxiYWNrLiBJdFxuLy8gd29ya3MgYnkgc2NoZWR1bGluZyBhIHJlcXVlc3RBbmltYXRpb25GcmFtZSwgc3RvcmluZyB0aGUgdGltZSBmb3IgdGhlIHN0YXJ0XG4vLyBvZiB0aGUgZnJhbWUsIHRoZW4gc2NoZWR1bGluZyBhIHBvc3RNZXNzYWdlIHdoaWNoIGdldHMgc2NoZWR1bGVkIGFmdGVyIHBhaW50LlxuLy8gV2l0aGluIHRoZSBwb3N0TWVzc2FnZSBoYW5kbGVyIGRvIGFzIG11Y2ggd29yayBhcyBwb3NzaWJsZSB1bnRpbCB0aW1lICsgZnJhbWVcbi8vIHJhdGUuIEJ5IHNlcGFyYXRpbmcgdGhlIGlkbGUgY2FsbCBpbnRvIGEgc2VwYXJhdGUgZXZlbnQgdGljayB3ZSBlbnN1cmUgdGhhdFxuLy8gbGF5b3V0LCBwYWludCBhbmQgb3RoZXIgYnJvd3NlciB3b3JrIGlzIGNvdW50ZWQgYWdhaW5zdCB0aGUgYXZhaWxhYmxlIHRpbWUuXG4vLyBUaGUgZnJhbWUgcmF0ZSBpcyBkeW5hbWljYWxseSBhZGp1c3RlZC5cblxuLy8gV2UgY2FwdHVyZSBhIGxvY2FsIHJlZmVyZW5jZSB0byBhbnkgZ2xvYmFsLCBpbiBjYXNlIGl0IGdldHMgcG9seWZpbGxlZCBhZnRlclxuLy8gdGhpcyBtb2R1bGUgaXMgaW5pdGlhbGx5IGV2YWx1YXRlZC4gV2Ugd2FudCB0byBiZSB1c2luZyBhXG4vLyBjb25zaXN0ZW50IGltcGxlbWVudGF0aW9uLlxudmFyIGxvY2FsRGF0ZSA9IERhdGU7XG5cbi8vIFRoaXMgaW5pdGlhbGl6YXRpb24gY29kZSBtYXkgcnVuIGV2ZW4gb24gc2VydmVyIGVudmlyb25tZW50cyBpZiBhIGNvbXBvbmVudFxuLy8ganVzdCBpbXBvcnRzIFJlYWN0RE9NIChlLmcuIGZvciBmaW5kRE9NTm9kZSkuIFNvbWUgZW52aXJvbm1lbnRzIG1pZ2h0IG5vdFxuLy8gaGF2ZSBzZXRUaW1lb3V0IG9yIGNsZWFyVGltZW91dC4gSG93ZXZlciwgd2UgYWx3YXlzIGV4cGVjdCB0aGVtIHRvIGJlIGRlZmluZWRcbi8vIG9uIHRoZSBjbGllbnQuIGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9yZWFjdC9wdWxsLzEzMDg4XG52YXIgbG9jYWxTZXRUaW1lb3V0ID0gdHlwZW9mIHNldFRpbWVvdXQgPT09ICdmdW5jdGlvbicgPyBzZXRUaW1lb3V0IDogdW5kZWZpbmVkO1xudmFyIGxvY2FsQ2xlYXJUaW1lb3V0ID0gdHlwZW9mIGNsZWFyVGltZW91dCA9PT0gJ2Z1bmN0aW9uJyA/IGNsZWFyVGltZW91dCA6IHVuZGVmaW5lZDtcblxuLy8gV2UgZG9uJ3QgZXhwZWN0IGVpdGhlciBvZiB0aGVzZSB0byBuZWNlc3NhcmlseSBiZSBkZWZpbmVkLCBidXQgd2Ugd2lsbCBlcnJvclxuLy8gbGF0ZXIgaWYgdGhleSBhcmUgbWlzc2luZyBvbiB0aGUgY2xpZW50LlxudmFyIGxvY2FsUmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gdHlwZW9mIHJlcXVlc3RBbmltYXRpb25GcmFtZSA9PT0gJ2Z1bmN0aW9uJyA/IHJlcXVlc3RBbmltYXRpb25GcmFtZSA6IHVuZGVmaW5lZDtcbnZhciBsb2NhbENhbmNlbEFuaW1hdGlvbkZyYW1lID0gdHlwZW9mIGNhbmNlbEFuaW1hdGlvbkZyYW1lID09PSAnZnVuY3Rpb24nID8gY2FuY2VsQW5pbWF0aW9uRnJhbWUgOiB1bmRlZmluZWQ7XG5cbi8vIHJlcXVlc3RBbmltYXRpb25GcmFtZSBkb2VzIG5vdCBydW4gd2hlbiB0aGUgdGFiIGlzIGluIHRoZSBiYWNrZ3JvdW5kLiBJZlxuLy8gd2UncmUgYmFja2dyb3VuZGVkIHdlIHByZWZlciBmb3IgdGhhdCB3b3JrIHRvIGhhcHBlbiBzbyB0aGF0IHRoZSBwYWdlXG4vLyBjb250aW51ZXMgdG8gbG9hZCBpbiB0aGUgYmFja2dyb3VuZC4gU28gd2UgYWxzbyBzY2hlZHVsZSBhICdzZXRUaW1lb3V0JyBhc1xuLy8gYSBmYWxsYmFjay5cbi8vIFRPRE86IE5lZWQgYSBiZXR0ZXIgaGV1cmlzdGljIGZvciBiYWNrZ3JvdW5kZWQgd29yay5cbnZhciBBTklNQVRJT05fRlJBTUVfVElNRU9VVCA9IDEwMDtcbnZhciByQUZJRDtcbnZhciByQUZUaW1lb3V0SUQ7XG52YXIgcmVxdWVzdEFuaW1hdGlvbkZyYW1lV2l0aFRpbWVvdXQgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgLy8gc2NoZWR1bGUgckFGIGFuZCBhbHNvIGEgc2V0VGltZW91dFxuICByQUZJRCA9IGxvY2FsUmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uICh0aW1lc3RhbXApIHtcbiAgICAvLyBjYW5jZWwgdGhlIHNldFRpbWVvdXRcbiAgICBsb2NhbENsZWFyVGltZW91dChyQUZUaW1lb3V0SUQpO1xuICAgIGNhbGxiYWNrKHRpbWVzdGFtcCk7XG4gIH0pO1xuICByQUZUaW1lb3V0SUQgPSBsb2NhbFNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgIC8vIGNhbmNlbCB0aGUgcmVxdWVzdEFuaW1hdGlvbkZyYW1lXG4gICAgbG9jYWxDYW5jZWxBbmltYXRpb25GcmFtZShyQUZJRCk7XG4gICAgY2FsbGJhY2soZXhwb3J0cy51bnN0YWJsZV9ub3coKSk7XG4gIH0sIEFOSU1BVElPTl9GUkFNRV9USU1FT1VUKTtcbn07XG5cbmlmIChoYXNOYXRpdmVQZXJmb3JtYW5jZU5vdykge1xuICB2YXIgUGVyZm9ybWFuY2UgPSBwZXJmb3JtYW5jZTtcbiAgZXhwb3J0cy51bnN0YWJsZV9ub3cgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIFBlcmZvcm1hbmNlLm5vdygpO1xuICB9O1xufSBlbHNlIHtcbiAgZXhwb3J0cy51bnN0YWJsZV9ub3cgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGxvY2FsRGF0ZS5ub3coKTtcbiAgfTtcbn1cblxudmFyIHJlcXVlc3RIb3N0Q2FsbGJhY2s7XG52YXIgY2FuY2VsSG9zdENhbGxiYWNrO1xudmFyIHNob3VsZFlpZWxkVG9Ib3N0O1xuXG52YXIgZ2xvYmFsVmFsdWUgPSBudWxsO1xuaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG4gIGdsb2JhbFZhbHVlID0gd2luZG93O1xufSBlbHNlIGlmICh0eXBlb2YgZ2xvYmFsICE9PSAndW5kZWZpbmVkJykge1xuICBnbG9iYWxWYWx1ZSA9IGdsb2JhbDtcbn1cblxuaWYgKGdsb2JhbFZhbHVlICYmIGdsb2JhbFZhbHVlLl9zY2hlZE1vY2spIHtcbiAgLy8gRHluYW1pYyBpbmplY3Rpb24sIG9ubHkgZm9yIHRlc3RpbmcgcHVycG9zZXMuXG4gIHZhciBnbG9iYWxJbXBsID0gZ2xvYmFsVmFsdWUuX3NjaGVkTW9jaztcbiAgcmVxdWVzdEhvc3RDYWxsYmFjayA9IGdsb2JhbEltcGxbMF07XG4gIGNhbmNlbEhvc3RDYWxsYmFjayA9IGdsb2JhbEltcGxbMV07XG4gIHNob3VsZFlpZWxkVG9Ib3N0ID0gZ2xvYmFsSW1wbFsyXTtcbiAgZXhwb3J0cy51bnN0YWJsZV9ub3cgPSBnbG9iYWxJbXBsWzNdO1xufSBlbHNlIGlmIChcbi8vIElmIFNjaGVkdWxlciBydW5zIGluIGEgbm9uLURPTSBlbnZpcm9ubWVudCwgaXQgZmFsbHMgYmFjayB0byBhIG5haXZlXG4vLyBpbXBsZW1lbnRhdGlvbiB1c2luZyBzZXRUaW1lb3V0LlxudHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcgfHxcbi8vIENoZWNrIGlmIE1lc3NhZ2VDaGFubmVsIGlzIHN1cHBvcnRlZCwgdG9vLlxudHlwZW9mIE1lc3NhZ2VDaGFubmVsICE9PSAnZnVuY3Rpb24nKSB7XG4gIC8vIElmIHRoaXMgYWNjaWRlbnRhbGx5IGdldHMgaW1wb3J0ZWQgaW4gYSBub24tYnJvd3NlciBlbnZpcm9ubWVudCwgZS5nLiBKYXZhU2NyaXB0Q29yZSxcbiAgLy8gZmFsbGJhY2sgdG8gYSBuYWl2ZSBpbXBsZW1lbnRhdGlvbi5cbiAgdmFyIF9jYWxsYmFjayA9IG51bGw7XG4gIHZhciBfZmx1c2hDYWxsYmFjayA9IGZ1bmN0aW9uIChkaWRUaW1lb3V0KSB7XG4gICAgaWYgKF9jYWxsYmFjayAhPT0gbnVsbCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgX2NhbGxiYWNrKGRpZFRpbWVvdXQpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgX2NhbGxiYWNrID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gIH07XG4gIHJlcXVlc3RIb3N0Q2FsbGJhY2sgPSBmdW5jdGlvbiAoY2IsIG1zKSB7XG4gICAgaWYgKF9jYWxsYmFjayAhPT0gbnVsbCkge1xuICAgICAgLy8gUHJvdGVjdCBhZ2FpbnN0IHJlLWVudHJhbmN5LlxuICAgICAgc2V0VGltZW91dChyZXF1ZXN0SG9zdENhbGxiYWNrLCAwLCBjYik7XG4gICAgfSBlbHNlIHtcbiAgICAgIF9jYWxsYmFjayA9IGNiO1xuICAgICAgc2V0VGltZW91dChfZmx1c2hDYWxsYmFjaywgMCwgZmFsc2UpO1xuICAgIH1cbiAgfTtcbiAgY2FuY2VsSG9zdENhbGxiYWNrID0gZnVuY3Rpb24gKCkge1xuICAgIF9jYWxsYmFjayA9IG51bGw7XG4gIH07XG4gIHNob3VsZFlpZWxkVG9Ib3N0ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcbn0gZWxzZSB7XG4gIGlmICh0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAvLyBUT0RPOiBSZW1vdmUgZmIubWUgbGlua1xuICAgIGlmICh0eXBlb2YgbG9jYWxSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJUaGlzIGJyb3dzZXIgZG9lc24ndCBzdXBwb3J0IHJlcXVlc3RBbmltYXRpb25GcmFtZS4gXCIgKyAnTWFrZSBzdXJlIHRoYXQgeW91IGxvYWQgYSAnICsgJ3BvbHlmaWxsIGluIG9sZGVyIGJyb3dzZXJzLiBodHRwczovL2ZiLm1lL3JlYWN0LXBvbHlmaWxscycpO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIGxvY2FsQ2FuY2VsQW5pbWF0aW9uRnJhbWUgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJUaGlzIGJyb3dzZXIgZG9lc24ndCBzdXBwb3J0IGNhbmNlbEFuaW1hdGlvbkZyYW1lLiBcIiArICdNYWtlIHN1cmUgdGhhdCB5b3UgbG9hZCBhICcgKyAncG9seWZpbGwgaW4gb2xkZXIgYnJvd3NlcnMuIGh0dHBzOi8vZmIubWUvcmVhY3QtcG9seWZpbGxzJyk7XG4gICAgfVxuICB9XG5cbiAgdmFyIHNjaGVkdWxlZEhvc3RDYWxsYmFjayA9IG51bGw7XG4gIHZhciBpc01lc3NhZ2VFdmVudFNjaGVkdWxlZCA9IGZhbHNlO1xuICB2YXIgdGltZW91dFRpbWUgPSAtMTtcblxuICB2YXIgaXNBbmltYXRpb25GcmFtZVNjaGVkdWxlZCA9IGZhbHNlO1xuXG4gIHZhciBpc0ZsdXNoaW5nSG9zdENhbGxiYWNrID0gZmFsc2U7XG5cbiAgdmFyIGZyYW1lRGVhZGxpbmUgPSAwO1xuICAvLyBXZSBzdGFydCBvdXQgYXNzdW1pbmcgdGhhdCB3ZSBydW4gYXQgMzBmcHMgYnV0IHRoZW4gdGhlIGhldXJpc3RpYyB0cmFja2luZ1xuICAvLyB3aWxsIGFkanVzdCB0aGlzIHZhbHVlIHRvIGEgZmFzdGVyIGZwcyBpZiB3ZSBnZXQgbW9yZSBmcmVxdWVudCBhbmltYXRpb25cbiAgLy8gZnJhbWVzLlxuICB2YXIgcHJldmlvdXNGcmFtZVRpbWUgPSAzMztcbiAgdmFyIGFjdGl2ZUZyYW1lVGltZSA9IDMzO1xuXG4gIHNob3VsZFlpZWxkVG9Ib3N0ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBmcmFtZURlYWRsaW5lIDw9IGV4cG9ydHMudW5zdGFibGVfbm93KCk7XG4gIH07XG5cbiAgLy8gV2UgdXNlIHRoZSBwb3N0TWVzc2FnZSB0cmljayB0byBkZWZlciBpZGxlIHdvcmsgdW50aWwgYWZ0ZXIgdGhlIHJlcGFpbnQuXG4gIHZhciBjaGFubmVsID0gbmV3IE1lc3NhZ2VDaGFubmVsKCk7XG4gIHZhciBwb3J0ID0gY2hhbm5lbC5wb3J0MjtcbiAgY2hhbm5lbC5wb3J0MS5vbm1lc3NhZ2UgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICBpc01lc3NhZ2VFdmVudFNjaGVkdWxlZCA9IGZhbHNlO1xuXG4gICAgdmFyIHByZXZTY2hlZHVsZWRDYWxsYmFjayA9IHNjaGVkdWxlZEhvc3RDYWxsYmFjaztcbiAgICB2YXIgcHJldlRpbWVvdXRUaW1lID0gdGltZW91dFRpbWU7XG4gICAgc2NoZWR1bGVkSG9zdENhbGxiYWNrID0gbnVsbDtcbiAgICB0aW1lb3V0VGltZSA9IC0xO1xuXG4gICAgdmFyIGN1cnJlbnRUaW1lID0gZXhwb3J0cy51bnN0YWJsZV9ub3coKTtcblxuICAgIHZhciBkaWRUaW1lb3V0ID0gZmFsc2U7XG4gICAgaWYgKGZyYW1lRGVhZGxpbmUgLSBjdXJyZW50VGltZSA8PSAwKSB7XG4gICAgICAvLyBUaGVyZSdzIG5vIHRpbWUgbGVmdCBpbiB0aGlzIGlkbGUgcGVyaW9kLiBDaGVjayBpZiB0aGUgY2FsbGJhY2sgaGFzXG4gICAgICAvLyBhIHRpbWVvdXQgYW5kIHdoZXRoZXIgaXQncyBiZWVuIGV4Y2VlZGVkLlxuICAgICAgaWYgKHByZXZUaW1lb3V0VGltZSAhPT0gLTEgJiYgcHJldlRpbWVvdXRUaW1lIDw9IGN1cnJlbnRUaW1lKSB7XG4gICAgICAgIC8vIEV4Y2VlZGVkIHRoZSB0aW1lb3V0LiBJbnZva2UgdGhlIGNhbGxiYWNrIGV2ZW4gdGhvdWdoIHRoZXJlJ3Mgbm9cbiAgICAgICAgLy8gdGltZSBsZWZ0LlxuICAgICAgICBkaWRUaW1lb3V0ID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIE5vIHRpbWVvdXQuXG4gICAgICAgIGlmICghaXNBbmltYXRpb25GcmFtZVNjaGVkdWxlZCkge1xuICAgICAgICAgIC8vIFNjaGVkdWxlIGFub3RoZXIgYW5pbWF0aW9uIGNhbGxiYWNrIHNvIHdlIHJldHJ5IGxhdGVyLlxuICAgICAgICAgIGlzQW5pbWF0aW9uRnJhbWVTY2hlZHVsZWQgPSB0cnVlO1xuICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZVdpdGhUaW1lb3V0KGFuaW1hdGlvblRpY2spO1xuICAgICAgICB9XG4gICAgICAgIC8vIEV4aXQgd2l0aG91dCBpbnZva2luZyB0aGUgY2FsbGJhY2suXG4gICAgICAgIHNjaGVkdWxlZEhvc3RDYWxsYmFjayA9IHByZXZTY2hlZHVsZWRDYWxsYmFjaztcbiAgICAgICAgdGltZW91dFRpbWUgPSBwcmV2VGltZW91dFRpbWU7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocHJldlNjaGVkdWxlZENhbGxiYWNrICE9PSBudWxsKSB7XG4gICAgICBpc0ZsdXNoaW5nSG9zdENhbGxiYWNrID0gdHJ1ZTtcbiAgICAgIHRyeSB7XG4gICAgICAgIHByZXZTY2hlZHVsZWRDYWxsYmFjayhkaWRUaW1lb3V0KTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIGlzRmx1c2hpbmdIb3N0Q2FsbGJhY2sgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgdmFyIGFuaW1hdGlvblRpY2sgPSBmdW5jdGlvbiAocmFmVGltZSkge1xuICAgIGlmIChzY2hlZHVsZWRIb3N0Q2FsbGJhY2sgIT09IG51bGwpIHtcbiAgICAgIC8vIEVhZ2VybHkgc2NoZWR1bGUgdGhlIG5leHQgYW5pbWF0aW9uIGNhbGxiYWNrIGF0IHRoZSBiZWdpbm5pbmcgb2YgdGhlXG4gICAgICAvLyBmcmFtZS4gSWYgdGhlIHNjaGVkdWxlciBxdWV1ZSBpcyBub3QgZW1wdHkgYXQgdGhlIGVuZCBvZiB0aGUgZnJhbWUsIGl0XG4gICAgICAvLyB3aWxsIGNvbnRpbnVlIGZsdXNoaW5nIGluc2lkZSB0aGF0IGNhbGxiYWNrLiBJZiB0aGUgcXVldWUgKmlzKiBlbXB0eSxcbiAgICAgIC8vIHRoZW4gaXQgd2lsbCBleGl0IGltbWVkaWF0ZWx5LiBQb3N0aW5nIHRoZSBjYWxsYmFjayBhdCB0aGUgc3RhcnQgb2YgdGhlXG4gICAgICAvLyBmcmFtZSBlbnN1cmVzIGl0J3MgZmlyZWQgd2l0aGluIHRoZSBlYXJsaWVzdCBwb3NzaWJsZSBmcmFtZS4gSWYgd2VcbiAgICAgIC8vIHdhaXRlZCB1bnRpbCB0aGUgZW5kIG9mIHRoZSBmcmFtZSB0byBwb3N0IHRoZSBjYWxsYmFjaywgd2UgcmlzayB0aGVcbiAgICAgIC8vIGJyb3dzZXIgc2tpcHBpbmcgYSBmcmFtZSBhbmQgbm90IGZpcmluZyB0aGUgY2FsbGJhY2sgdW50aWwgdGhlIGZyYW1lXG4gICAgICAvLyBhZnRlciB0aGF0LlxuICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lV2l0aFRpbWVvdXQoYW5pbWF0aW9uVGljayk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIE5vIHBlbmRpbmcgd29yay4gRXhpdC5cbiAgICAgIGlzQW5pbWF0aW9uRnJhbWVTY2hlZHVsZWQgPSBmYWxzZTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgbmV4dEZyYW1lVGltZSA9IHJhZlRpbWUgLSBmcmFtZURlYWRsaW5lICsgYWN0aXZlRnJhbWVUaW1lO1xuICAgIGlmIChuZXh0RnJhbWVUaW1lIDwgYWN0aXZlRnJhbWVUaW1lICYmIHByZXZpb3VzRnJhbWVUaW1lIDwgYWN0aXZlRnJhbWVUaW1lKSB7XG4gICAgICBpZiAobmV4dEZyYW1lVGltZSA8IDgpIHtcbiAgICAgICAgLy8gRGVmZW5zaXZlIGNvZGluZy4gV2UgZG9uJ3Qgc3VwcG9ydCBoaWdoZXIgZnJhbWUgcmF0ZXMgdGhhbiAxMjBoei5cbiAgICAgICAgLy8gSWYgdGhlIGNhbGN1bGF0ZWQgZnJhbWUgdGltZSBnZXRzIGxvd2VyIHRoYW4gOCwgaXQgaXMgcHJvYmFibHkgYSBidWcuXG4gICAgICAgIG5leHRGcmFtZVRpbWUgPSA4O1xuICAgICAgfVxuICAgICAgLy8gSWYgb25lIGZyYW1lIGdvZXMgbG9uZywgdGhlbiB0aGUgbmV4dCBvbmUgY2FuIGJlIHNob3J0IHRvIGNhdGNoIHVwLlxuICAgICAgLy8gSWYgdHdvIGZyYW1lcyBhcmUgc2hvcnQgaW4gYSByb3csIHRoZW4gdGhhdCdzIGFuIGluZGljYXRpb24gdGhhdCB3ZVxuICAgICAgLy8gYWN0dWFsbHkgaGF2ZSBhIGhpZ2hlciBmcmFtZSByYXRlIHRoYW4gd2hhdCB3ZSdyZSBjdXJyZW50bHkgb3B0aW1pemluZy5cbiAgICAgIC8vIFdlIGFkanVzdCBvdXIgaGV1cmlzdGljIGR5bmFtaWNhbGx5IGFjY29yZGluZ2x5LiBGb3IgZXhhbXBsZSwgaWYgd2UncmVcbiAgICAgIC8vIHJ1bm5pbmcgb24gMTIwaHogZGlzcGxheSBvciA5MGh6IFZSIGRpc3BsYXkuXG4gICAgICAvLyBUYWtlIHRoZSBtYXggb2YgdGhlIHR3byBpbiBjYXNlIG9uZSBvZiB0aGVtIHdhcyBhbiBhbm9tYWx5IGR1ZSB0b1xuICAgICAgLy8gbWlzc2VkIGZyYW1lIGRlYWRsaW5lcy5cbiAgICAgIGFjdGl2ZUZyYW1lVGltZSA9IG5leHRGcmFtZVRpbWUgPCBwcmV2aW91c0ZyYW1lVGltZSA/IHByZXZpb3VzRnJhbWVUaW1lIDogbmV4dEZyYW1lVGltZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcHJldmlvdXNGcmFtZVRpbWUgPSBuZXh0RnJhbWVUaW1lO1xuICAgIH1cbiAgICBmcmFtZURlYWRsaW5lID0gcmFmVGltZSArIGFjdGl2ZUZyYW1lVGltZTtcbiAgICBpZiAoIWlzTWVzc2FnZUV2ZW50U2NoZWR1bGVkKSB7XG4gICAgICBpc01lc3NhZ2VFdmVudFNjaGVkdWxlZCA9IHRydWU7XG4gICAgICBwb3J0LnBvc3RNZXNzYWdlKHVuZGVmaW5lZCk7XG4gICAgfVxuICB9O1xuXG4gIHJlcXVlc3RIb3N0Q2FsbGJhY2sgPSBmdW5jdGlvbiAoY2FsbGJhY2ssIGFic29sdXRlVGltZW91dCkge1xuICAgIHNjaGVkdWxlZEhvc3RDYWxsYmFjayA9IGNhbGxiYWNrO1xuICAgIHRpbWVvdXRUaW1lID0gYWJzb2x1dGVUaW1lb3V0O1xuICAgIGlmIChpc0ZsdXNoaW5nSG9zdENhbGxiYWNrIHx8IGFic29sdXRlVGltZW91dCA8IDApIHtcbiAgICAgIC8vIERvbid0IHdhaXQgZm9yIHRoZSBuZXh0IGZyYW1lLiBDb250aW51ZSB3b3JraW5nIEFTQVAsIGluIGEgbmV3IGV2ZW50LlxuICAgICAgcG9ydC5wb3N0TWVzc2FnZSh1bmRlZmluZWQpO1xuICAgIH0gZWxzZSBpZiAoIWlzQW5pbWF0aW9uRnJhbWVTY2hlZHVsZWQpIHtcbiAgICAgIC8vIElmIHJBRiBkaWRuJ3QgYWxyZWFkeSBzY2hlZHVsZSBvbmUsIHdlIG5lZWQgdG8gc2NoZWR1bGUgYSBmcmFtZS5cbiAgICAgIC8vIFRPRE86IElmIHRoaXMgckFGIGRvZXNuJ3QgbWF0ZXJpYWxpemUgYmVjYXVzZSB0aGUgYnJvd3NlciB0aHJvdHRsZXMsIHdlXG4gICAgICAvLyBtaWdodCB3YW50IHRvIHN0aWxsIGhhdmUgc2V0VGltZW91dCB0cmlnZ2VyIHJJQyBhcyBhIGJhY2t1cCB0byBlbnN1cmVcbiAgICAgIC8vIHRoYXQgd2Uga2VlcCBwZXJmb3JtaW5nIHdvcmsuXG4gICAgICBpc0FuaW1hdGlvbkZyYW1lU2NoZWR1bGVkID0gdHJ1ZTtcbiAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZVdpdGhUaW1lb3V0KGFuaW1hdGlvblRpY2spO1xuICAgIH1cbiAgfTtcblxuICBjYW5jZWxIb3N0Q2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgc2NoZWR1bGVkSG9zdENhbGxiYWNrID0gbnVsbDtcbiAgICBpc01lc3NhZ2VFdmVudFNjaGVkdWxlZCA9IGZhbHNlO1xuICAgIHRpbWVvdXRUaW1lID0gLTE7XG4gIH07XG59XG5cbmV4cG9ydHMudW5zdGFibGVfSW1tZWRpYXRlUHJpb3JpdHkgPSBJbW1lZGlhdGVQcmlvcml0eTtcbmV4cG9ydHMudW5zdGFibGVfVXNlckJsb2NraW5nUHJpb3JpdHkgPSBVc2VyQmxvY2tpbmdQcmlvcml0eTtcbmV4cG9ydHMudW5zdGFibGVfTm9ybWFsUHJpb3JpdHkgPSBOb3JtYWxQcmlvcml0eTtcbmV4cG9ydHMudW5zdGFibGVfSWRsZVByaW9yaXR5ID0gSWRsZVByaW9yaXR5O1xuZXhwb3J0cy51bnN0YWJsZV9Mb3dQcmlvcml0eSA9IExvd1ByaW9yaXR5O1xuZXhwb3J0cy51bnN0YWJsZV9ydW5XaXRoUHJpb3JpdHkgPSB1bnN0YWJsZV9ydW5XaXRoUHJpb3JpdHk7XG5leHBvcnRzLnVuc3RhYmxlX3NjaGVkdWxlQ2FsbGJhY2sgPSB1bnN0YWJsZV9zY2hlZHVsZUNhbGxiYWNrO1xuZXhwb3J0cy51bnN0YWJsZV9jYW5jZWxDYWxsYmFjayA9IHVuc3RhYmxlX2NhbmNlbENhbGxiYWNrO1xuZXhwb3J0cy51bnN0YWJsZV93cmFwQ2FsbGJhY2sgPSB1bnN0YWJsZV93cmFwQ2FsbGJhY2s7XG5leHBvcnRzLnVuc3RhYmxlX2dldEN1cnJlbnRQcmlvcml0eUxldmVsID0gdW5zdGFibGVfZ2V0Q3VycmVudFByaW9yaXR5TGV2ZWw7XG5leHBvcnRzLnVuc3RhYmxlX3Nob3VsZFlpZWxkID0gdW5zdGFibGVfc2hvdWxkWWllbGQ7XG5leHBvcnRzLnVuc3RhYmxlX2NvbnRpbnVlRXhlY3V0aW9uID0gdW5zdGFibGVfY29udGludWVFeGVjdXRpb247XG5leHBvcnRzLnVuc3RhYmxlX3BhdXNlRXhlY3V0aW9uID0gdW5zdGFibGVfcGF1c2VFeGVjdXRpb247XG5leHBvcnRzLnVuc3RhYmxlX2dldEZpcnN0Q2FsbGJhY2tOb2RlID0gdW5zdGFibGVfZ2V0Rmlyc3RDYWxsYmFja05vZGU7XG4gIH0pKCk7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ3Byb2R1Y3Rpb24nKSB7XG4gIG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9janMvc2NoZWR1bGVyLnByb2R1Y3Rpb24ubWluLmpzJyk7XG59IGVsc2Uge1xuICBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vY2pzL3NjaGVkdWxlci5kZXZlbG9wbWVudC5qcycpO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdwcm9kdWN0aW9uJykge1xuICBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vY2pzL3NjaGVkdWxlci10cmFjaW5nLnByb2R1Y3Rpb24ubWluLmpzJyk7XG59IGVsc2Uge1xuICBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vY2pzL3NjaGVkdWxlci10cmFjaW5nLmRldmVsb3BtZW50LmpzJyk7XG59XG4iXSwic291cmNlUm9vdCI6IiJ9