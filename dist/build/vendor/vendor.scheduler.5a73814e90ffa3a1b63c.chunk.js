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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvc2NoZWR1bGVyL2Nqcy9zY2hlZHVsZXItdHJhY2luZy5kZXZlbG9wbWVudC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvc2NoZWR1bGVyL2Nqcy9zY2hlZHVsZXIuZGV2ZWxvcG1lbnQuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3NjaGVkdWxlci9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvc2NoZWR1bGVyL3RyYWNpbmcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRWE7Ozs7QUFJYixJQUFJLElBQXFDO0FBQ3pDO0FBQ0E7O0FBRUEsOENBQThDLGNBQWM7O0FBRTVEOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7O0FBR0Esa0RBQWtEOzs7QUFHbEQ7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7O0FBR0E7OztBQUdBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOzs7Ozs7Ozs7Ozs7O0FDdGFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRWE7Ozs7QUFJYixJQUFJLElBQXFDO0FBQ3pDO0FBQ0E7O0FBRUEsOENBQThDLGNBQWM7O0FBRTVEOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSwrQkFBK0I7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87O0FBRVA7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7Ozs7Ozs7Ozs7Ozs7O0FDMXBCYTs7QUFFYixJQUFJLEtBQXFDLEVBQUUsRUFFMUM7QUFDRCxtQkFBbUIsbUJBQU8sQ0FBQyw0Q0FBZ0M7QUFDM0Q7Ozs7Ozs7Ozs7Ozs7QUNOYTs7QUFFYixJQUFJLEtBQXFDLEVBQUUsRUFFMUM7QUFDRCxtQkFBbUIsbUJBQU8sQ0FBQyxvREFBd0M7QUFDbkUiLCJmaWxlIjoiYnVpbGQvdmVuZG9yL3ZlbmRvci5zY2hlZHVsZXIuNWE3MzgxNGU5MGZmYTNhMWI2M2MuY2h1bmsuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGxpY2Vuc2UgUmVhY3QgdjAuMTMuMVxyXG4gKiBzY2hlZHVsZXItdHJhY2luZy5kZXZlbG9wbWVudC5qc1xyXG4gKlxyXG4gKiBDb3B5cmlnaHQgKGMpIEZhY2Vib29rLCBJbmMuIGFuZCBpdHMgYWZmaWxpYXRlcy5cclxuICpcclxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXHJcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cclxuICovXHJcblxyXG4ndXNlIHN0cmljdCc7XHJcblxyXG5cclxuXHJcbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpIHtcclxuICAoZnVuY3Rpb24oKSB7XHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XHJcblxyXG4vLyBIZWxwcyBpZGVudGlmeSBzaWRlIGVmZmVjdHMgaW4gYmVnaW4tcGhhc2UgbGlmZWN5Y2xlIGhvb2tzIGFuZCBzZXRTdGF0ZSByZWR1Y2VyczpcclxuXHJcblxyXG4vLyBJbiBzb21lIGNhc2VzLCBTdHJpY3RNb2RlIHNob3VsZCBhbHNvIGRvdWJsZS1yZW5kZXIgbGlmZWN5Y2xlcy5cclxuLy8gVGhpcyBjYW4gYmUgY29uZnVzaW5nIGZvciB0ZXN0cyB0aG91Z2gsXHJcbi8vIEFuZCBpdCBjYW4gYmUgYmFkIGZvciBwZXJmb3JtYW5jZSBpbiBwcm9kdWN0aW9uLlxyXG4vLyBUaGlzIGZlYXR1cmUgZmxhZyBjYW4gYmUgdXNlZCB0byBjb250cm9sIHRoZSBiZWhhdmlvcjpcclxuXHJcblxyXG4vLyBUbyBwcmVzZXJ2ZSB0aGUgXCJQYXVzZSBvbiBjYXVnaHQgZXhjZXB0aW9uc1wiIGJlaGF2aW9yIG9mIHRoZSBkZWJ1Z2dlciwgd2VcclxuLy8gcmVwbGF5IHRoZSBiZWdpbiBwaGFzZSBvZiBhIGZhaWxlZCBjb21wb25lbnQgaW5zaWRlIGludm9rZUd1YXJkZWRDYWxsYmFjay5cclxuXHJcblxyXG4vLyBXYXJuIGFib3V0IGRlcHJlY2F0ZWQsIGFzeW5jLXVuc2FmZSBsaWZlY3ljbGVzOyByZWxhdGVzIHRvIFJGQyAjNjpcclxuXHJcblxyXG4vLyBHYXRoZXIgYWR2YW5jZWQgdGltaW5nIG1ldHJpY3MgZm9yIFByb2ZpbGVyIHN1YnRyZWVzLlxyXG5cclxuXHJcbi8vIFRyYWNlIHdoaWNoIGludGVyYWN0aW9ucyB0cmlnZ2VyIGVhY2ggY29tbWl0LlxyXG52YXIgZW5hYmxlU2NoZWR1bGVyVHJhY2luZyA9IHRydWU7XHJcblxyXG4vLyBPbmx5IHVzZWQgaW4gd3d3IGJ1aWxkcy5cclxuIC8vIFRPRE86IHRydWU/IEhlcmUgaXQgbWlnaHQganVzdCBiZSBmYWxzZS5cclxuXHJcbi8vIE9ubHkgdXNlZCBpbiB3d3cgYnVpbGRzLlxyXG5cclxuXHJcbi8vIE9ubHkgdXNlZCBpbiB3d3cgYnVpbGRzLlxyXG5cclxuXHJcbi8vIFJlYWN0IEZpcmU6IHByZXZlbnQgdGhlIHZhbHVlIGFuZCBjaGVja2VkIGF0dHJpYnV0ZXMgZnJvbSBzeW5jaW5nXHJcbi8vIHdpdGggdGhlaXIgcmVsYXRlZCBET00gcHJvcGVydGllc1xyXG5cclxuXHJcbi8vIFRoZXNlIEFQSXMgd2lsbCBubyBsb25nZXIgYmUgXCJ1bnN0YWJsZVwiIGluIHRoZSB1cGNvbWluZyAxNi43IHJlbGVhc2UsXHJcbi8vIENvbnRyb2wgdGhpcyBiZWhhdmlvciB3aXRoIGEgZmxhZyB0byBzdXBwb3J0IDE2LjYgbWlub3IgcmVsZWFzZXMgaW4gdGhlIG1lYW53aGlsZS5cclxuXHJcbnZhciBERUZBVUxUX1RIUkVBRF9JRCA9IDA7XHJcblxyXG4vLyBDb3VudGVycyB1c2VkIHRvIGdlbmVyYXRlIHVuaXF1ZSBJRHMuXHJcbnZhciBpbnRlcmFjdGlvbklEQ291bnRlciA9IDA7XHJcbnZhciB0aHJlYWRJRENvdW50ZXIgPSAwO1xyXG5cclxuLy8gU2V0IG9mIGN1cnJlbnRseSB0cmFjZWQgaW50ZXJhY3Rpb25zLlxyXG4vLyBJbnRlcmFjdGlvbnMgXCJzdGFja1wi4oCTXHJcbi8vIE1lYW5pbmcgdGhhdCBuZXdseSB0cmFjZWQgaW50ZXJhY3Rpb25zIGFyZSBhcHBlbmRlZCB0byB0aGUgcHJldmlvdXNseSBhY3RpdmUgc2V0LlxyXG4vLyBXaGVuIGFuIGludGVyYWN0aW9uIGdvZXMgb3V0IG9mIHNjb3BlLCB0aGUgcHJldmlvdXMgc2V0IChpZiBhbnkpIGlzIHJlc3RvcmVkLlxyXG5leHBvcnRzLl9faW50ZXJhY3Rpb25zUmVmID0gbnVsbDtcclxuXHJcbi8vIExpc3RlbmVyKHMpIHRvIG5vdGlmeSB3aGVuIGludGVyYWN0aW9ucyBiZWdpbiBhbmQgZW5kLlxyXG5leHBvcnRzLl9fc3Vic2NyaWJlclJlZiA9IG51bGw7XHJcblxyXG5pZiAoZW5hYmxlU2NoZWR1bGVyVHJhY2luZykge1xyXG4gIGV4cG9ydHMuX19pbnRlcmFjdGlvbnNSZWYgPSB7XHJcbiAgICBjdXJyZW50OiBuZXcgU2V0KClcclxuICB9O1xyXG4gIGV4cG9ydHMuX19zdWJzY3JpYmVyUmVmID0ge1xyXG4gICAgY3VycmVudDogbnVsbFxyXG4gIH07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHVuc3RhYmxlX2NsZWFyKGNhbGxiYWNrKSB7XHJcbiAgaWYgKCFlbmFibGVTY2hlZHVsZXJUcmFjaW5nKSB7XHJcbiAgICByZXR1cm4gY2FsbGJhY2soKTtcclxuICB9XHJcblxyXG4gIHZhciBwcmV2SW50ZXJhY3Rpb25zID0gZXhwb3J0cy5fX2ludGVyYWN0aW9uc1JlZi5jdXJyZW50O1xyXG4gIGV4cG9ydHMuX19pbnRlcmFjdGlvbnNSZWYuY3VycmVudCA9IG5ldyBTZXQoKTtcclxuXHJcbiAgdHJ5IHtcclxuICAgIHJldHVybiBjYWxsYmFjaygpO1xyXG4gIH0gZmluYWxseSB7XHJcbiAgICBleHBvcnRzLl9faW50ZXJhY3Rpb25zUmVmLmN1cnJlbnQgPSBwcmV2SW50ZXJhY3Rpb25zO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gdW5zdGFibGVfZ2V0Q3VycmVudCgpIHtcclxuICBpZiAoIWVuYWJsZVNjaGVkdWxlclRyYWNpbmcpIHtcclxuICAgIHJldHVybiBudWxsO1xyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4gZXhwb3J0cy5fX2ludGVyYWN0aW9uc1JlZi5jdXJyZW50O1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gdW5zdGFibGVfZ2V0VGhyZWFkSUQoKSB7XHJcbiAgcmV0dXJuICsrdGhyZWFkSURDb3VudGVyO1xyXG59XHJcblxyXG5mdW5jdGlvbiB1bnN0YWJsZV90cmFjZShuYW1lLCB0aW1lc3RhbXAsIGNhbGxiYWNrKSB7XHJcbiAgdmFyIHRocmVhZElEID0gYXJndW1lbnRzLmxlbmd0aCA+IDMgJiYgYXJndW1lbnRzWzNdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbM10gOiBERUZBVUxUX1RIUkVBRF9JRDtcclxuXHJcbiAgaWYgKCFlbmFibGVTY2hlZHVsZXJUcmFjaW5nKSB7XHJcbiAgICByZXR1cm4gY2FsbGJhY2soKTtcclxuICB9XHJcblxyXG4gIHZhciBpbnRlcmFjdGlvbiA9IHtcclxuICAgIF9fY291bnQ6IDEsXHJcbiAgICBpZDogaW50ZXJhY3Rpb25JRENvdW50ZXIrKyxcclxuICAgIG5hbWU6IG5hbWUsXHJcbiAgICB0aW1lc3RhbXA6IHRpbWVzdGFtcFxyXG4gIH07XHJcblxyXG4gIHZhciBwcmV2SW50ZXJhY3Rpb25zID0gZXhwb3J0cy5fX2ludGVyYWN0aW9uc1JlZi5jdXJyZW50O1xyXG5cclxuICAvLyBUcmFjZWQgaW50ZXJhY3Rpb25zIHNob3VsZCBzdGFjay9hY2N1bXVsYXRlLlxyXG4gIC8vIFRvIGRvIHRoYXQsIGNsb25lIHRoZSBjdXJyZW50IGludGVyYWN0aW9ucy5cclxuICAvLyBUaGUgcHJldmlvdXMgc2V0IHdpbGwgYmUgcmVzdG9yZWQgdXBvbiBjb21wbGV0aW9uLlxyXG4gIHZhciBpbnRlcmFjdGlvbnMgPSBuZXcgU2V0KHByZXZJbnRlcmFjdGlvbnMpO1xyXG4gIGludGVyYWN0aW9ucy5hZGQoaW50ZXJhY3Rpb24pO1xyXG4gIGV4cG9ydHMuX19pbnRlcmFjdGlvbnNSZWYuY3VycmVudCA9IGludGVyYWN0aW9ucztcclxuXHJcbiAgdmFyIHN1YnNjcmliZXIgPSBleHBvcnRzLl9fc3Vic2NyaWJlclJlZi5jdXJyZW50O1xyXG4gIHZhciByZXR1cm5WYWx1ZSA9IHZvaWQgMDtcclxuXHJcbiAgdHJ5IHtcclxuICAgIGlmIChzdWJzY3JpYmVyICE9PSBudWxsKSB7XHJcbiAgICAgIHN1YnNjcmliZXIub25JbnRlcmFjdGlvblRyYWNlZChpbnRlcmFjdGlvbik7XHJcbiAgICB9XHJcbiAgfSBmaW5hbGx5IHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGlmIChzdWJzY3JpYmVyICE9PSBudWxsKSB7XHJcbiAgICAgICAgc3Vic2NyaWJlci5vbldvcmtTdGFydGVkKGludGVyYWN0aW9ucywgdGhyZWFkSUQpO1xyXG4gICAgICB9XHJcbiAgICB9IGZpbmFsbHkge1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIHJldHVyblZhbHVlID0gY2FsbGJhY2soKTtcclxuICAgICAgfSBmaW5hbGx5IHtcclxuICAgICAgICBleHBvcnRzLl9faW50ZXJhY3Rpb25zUmVmLmN1cnJlbnQgPSBwcmV2SW50ZXJhY3Rpb25zO1xyXG5cclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgaWYgKHN1YnNjcmliZXIgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgc3Vic2NyaWJlci5vbldvcmtTdG9wcGVkKGludGVyYWN0aW9ucywgdGhyZWFkSUQpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZmluYWxseSB7XHJcbiAgICAgICAgICBpbnRlcmFjdGlvbi5fX2NvdW50LS07XHJcblxyXG4gICAgICAgICAgLy8gSWYgbm8gYXN5bmMgd29yayB3YXMgc2NoZWR1bGVkIGZvciB0aGlzIGludGVyYWN0aW9uLFxyXG4gICAgICAgICAgLy8gTm90aWZ5IHN1YnNjcmliZXJzIHRoYXQgaXQncyBjb21wbGV0ZWQuXHJcbiAgICAgICAgICBpZiAoc3Vic2NyaWJlciAhPT0gbnVsbCAmJiBpbnRlcmFjdGlvbi5fX2NvdW50ID09PSAwKSB7XHJcbiAgICAgICAgICAgIHN1YnNjcmliZXIub25JbnRlcmFjdGlvblNjaGVkdWxlZFdvcmtDb21wbGV0ZWQoaW50ZXJhY3Rpb24pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHJldHVyblZhbHVlO1xyXG59XHJcblxyXG5mdW5jdGlvbiB1bnN0YWJsZV93cmFwKGNhbGxiYWNrKSB7XHJcbiAgdmFyIHRocmVhZElEID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiBERUZBVUxUX1RIUkVBRF9JRDtcclxuXHJcbiAgaWYgKCFlbmFibGVTY2hlZHVsZXJUcmFjaW5nKSB7XHJcbiAgICByZXR1cm4gY2FsbGJhY2s7XHJcbiAgfVxyXG5cclxuICB2YXIgd3JhcHBlZEludGVyYWN0aW9ucyA9IGV4cG9ydHMuX19pbnRlcmFjdGlvbnNSZWYuY3VycmVudDtcclxuXHJcbiAgdmFyIHN1YnNjcmliZXIgPSBleHBvcnRzLl9fc3Vic2NyaWJlclJlZi5jdXJyZW50O1xyXG4gIGlmIChzdWJzY3JpYmVyICE9PSBudWxsKSB7XHJcbiAgICBzdWJzY3JpYmVyLm9uV29ya1NjaGVkdWxlZCh3cmFwcGVkSW50ZXJhY3Rpb25zLCB0aHJlYWRJRCk7XHJcbiAgfVxyXG5cclxuICAvLyBVcGRhdGUgdGhlIHBlbmRpbmcgYXN5bmMgd29yayBjb3VudCBmb3IgdGhlIGN1cnJlbnQgaW50ZXJhY3Rpb25zLlxyXG4gIC8vIFVwZGF0ZSBhZnRlciBjYWxsaW5nIHN1YnNjcmliZXJzIGluIGNhc2Ugb2YgZXJyb3IuXHJcbiAgd3JhcHBlZEludGVyYWN0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uIChpbnRlcmFjdGlvbikge1xyXG4gICAgaW50ZXJhY3Rpb24uX19jb3VudCsrO1xyXG4gIH0pO1xyXG5cclxuICB2YXIgaGFzUnVuID0gZmFsc2U7XHJcblxyXG4gIGZ1bmN0aW9uIHdyYXBwZWQoKSB7XHJcbiAgICB2YXIgcHJldkludGVyYWN0aW9ucyA9IGV4cG9ydHMuX19pbnRlcmFjdGlvbnNSZWYuY3VycmVudDtcclxuICAgIGV4cG9ydHMuX19pbnRlcmFjdGlvbnNSZWYuY3VycmVudCA9IHdyYXBwZWRJbnRlcmFjdGlvbnM7XHJcblxyXG4gICAgc3Vic2NyaWJlciA9IGV4cG9ydHMuX19zdWJzY3JpYmVyUmVmLmN1cnJlbnQ7XHJcblxyXG4gICAgdHJ5IHtcclxuICAgICAgdmFyIHJldHVyblZhbHVlID0gdm9pZCAwO1xyXG5cclxuICAgICAgdHJ5IHtcclxuICAgICAgICBpZiAoc3Vic2NyaWJlciAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgc3Vic2NyaWJlci5vbldvcmtTdGFydGVkKHdyYXBwZWRJbnRlcmFjdGlvbnMsIHRocmVhZElEKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZmluYWxseSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgIHJldHVyblZhbHVlID0gY2FsbGJhY2suYXBwbHkodW5kZWZpbmVkLCBhcmd1bWVudHMpO1xyXG4gICAgICAgIH0gZmluYWxseSB7XHJcbiAgICAgICAgICBleHBvcnRzLl9faW50ZXJhY3Rpb25zUmVmLmN1cnJlbnQgPSBwcmV2SW50ZXJhY3Rpb25zO1xyXG5cclxuICAgICAgICAgIGlmIChzdWJzY3JpYmVyICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHN1YnNjcmliZXIub25Xb3JrU3RvcHBlZCh3cmFwcGVkSW50ZXJhY3Rpb25zLCB0aHJlYWRJRCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gcmV0dXJuVmFsdWU7XHJcbiAgICB9IGZpbmFsbHkge1xyXG4gICAgICBpZiAoIWhhc1J1bikge1xyXG4gICAgICAgIC8vIFdlIG9ubHkgZXhwZWN0IGEgd3JhcHBlZCBmdW5jdGlvbiB0byBiZSBleGVjdXRlZCBvbmNlLFxyXG4gICAgICAgIC8vIEJ1dCBpbiB0aGUgZXZlbnQgdGhhdCBpdCdzIGV4ZWN1dGVkIG1vcmUgdGhhbiBvbmNl4oCTXHJcbiAgICAgICAgLy8gT25seSBkZWNyZW1lbnQgdGhlIG91dHN0YW5kaW5nIGludGVyYWN0aW9uIGNvdW50cyBvbmNlLlxyXG4gICAgICAgIGhhc1J1biA9IHRydWU7XHJcblxyXG4gICAgICAgIC8vIFVwZGF0ZSBwZW5kaW5nIGFzeW5jIGNvdW50cyBmb3IgYWxsIHdyYXBwZWQgaW50ZXJhY3Rpb25zLlxyXG4gICAgICAgIC8vIElmIHRoaXMgd2FzIHRoZSBsYXN0IHNjaGVkdWxlZCBhc3luYyB3b3JrIGZvciBhbnkgb2YgdGhlbSxcclxuICAgICAgICAvLyBNYXJrIHRoZW0gYXMgY29tcGxldGVkLlxyXG4gICAgICAgIHdyYXBwZWRJbnRlcmFjdGlvbnMuZm9yRWFjaChmdW5jdGlvbiAoaW50ZXJhY3Rpb24pIHtcclxuICAgICAgICAgIGludGVyYWN0aW9uLl9fY291bnQtLTtcclxuXHJcbiAgICAgICAgICBpZiAoc3Vic2NyaWJlciAhPT0gbnVsbCAmJiBpbnRlcmFjdGlvbi5fX2NvdW50ID09PSAwKSB7XHJcbiAgICAgICAgICAgIHN1YnNjcmliZXIub25JbnRlcmFjdGlvblNjaGVkdWxlZFdvcmtDb21wbGV0ZWQoaW50ZXJhY3Rpb24pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB3cmFwcGVkLmNhbmNlbCA9IGZ1bmN0aW9uIGNhbmNlbCgpIHtcclxuICAgIHN1YnNjcmliZXIgPSBleHBvcnRzLl9fc3Vic2NyaWJlclJlZi5jdXJyZW50O1xyXG5cclxuICAgIHRyeSB7XHJcbiAgICAgIGlmIChzdWJzY3JpYmVyICE9PSBudWxsKSB7XHJcbiAgICAgICAgc3Vic2NyaWJlci5vbldvcmtDYW5jZWxlZCh3cmFwcGVkSW50ZXJhY3Rpb25zLCB0aHJlYWRJRCk7XHJcbiAgICAgIH1cclxuICAgIH0gZmluYWxseSB7XHJcbiAgICAgIC8vIFVwZGF0ZSBwZW5kaW5nIGFzeW5jIGNvdW50cyBmb3IgYWxsIHdyYXBwZWQgaW50ZXJhY3Rpb25zLlxyXG4gICAgICAvLyBJZiB0aGlzIHdhcyB0aGUgbGFzdCBzY2hlZHVsZWQgYXN5bmMgd29yayBmb3IgYW55IG9mIHRoZW0sXHJcbiAgICAgIC8vIE1hcmsgdGhlbSBhcyBjb21wbGV0ZWQuXHJcbiAgICAgIHdyYXBwZWRJbnRlcmFjdGlvbnMuZm9yRWFjaChmdW5jdGlvbiAoaW50ZXJhY3Rpb24pIHtcclxuICAgICAgICBpbnRlcmFjdGlvbi5fX2NvdW50LS07XHJcblxyXG4gICAgICAgIGlmIChzdWJzY3JpYmVyICYmIGludGVyYWN0aW9uLl9fY291bnQgPT09IDApIHtcclxuICAgICAgICAgIHN1YnNjcmliZXIub25JbnRlcmFjdGlvblNjaGVkdWxlZFdvcmtDb21wbGV0ZWQoaW50ZXJhY3Rpb24pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIHdyYXBwZWQ7XHJcbn1cclxuXHJcbnZhciBzdWJzY3JpYmVycyA9IG51bGw7XHJcbmlmIChlbmFibGVTY2hlZHVsZXJUcmFjaW5nKSB7XHJcbiAgc3Vic2NyaWJlcnMgPSBuZXcgU2V0KCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHVuc3RhYmxlX3N1YnNjcmliZShzdWJzY3JpYmVyKSB7XHJcbiAgaWYgKGVuYWJsZVNjaGVkdWxlclRyYWNpbmcpIHtcclxuICAgIHN1YnNjcmliZXJzLmFkZChzdWJzY3JpYmVyKTtcclxuXHJcbiAgICBpZiAoc3Vic2NyaWJlcnMuc2l6ZSA9PT0gMSkge1xyXG4gICAgICBleHBvcnRzLl9fc3Vic2NyaWJlclJlZi5jdXJyZW50ID0ge1xyXG4gICAgICAgIG9uSW50ZXJhY3Rpb25TY2hlZHVsZWRXb3JrQ29tcGxldGVkOiBvbkludGVyYWN0aW9uU2NoZWR1bGVkV29ya0NvbXBsZXRlZCxcclxuICAgICAgICBvbkludGVyYWN0aW9uVHJhY2VkOiBvbkludGVyYWN0aW9uVHJhY2VkLFxyXG4gICAgICAgIG9uV29ya0NhbmNlbGVkOiBvbldvcmtDYW5jZWxlZCxcclxuICAgICAgICBvbldvcmtTY2hlZHVsZWQ6IG9uV29ya1NjaGVkdWxlZCxcclxuICAgICAgICBvbldvcmtTdGFydGVkOiBvbldvcmtTdGFydGVkLFxyXG4gICAgICAgIG9uV29ya1N0b3BwZWQ6IG9uV29ya1N0b3BwZWRcclxuICAgICAgfTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHVuc3RhYmxlX3Vuc3Vic2NyaWJlKHN1YnNjcmliZXIpIHtcclxuICBpZiAoZW5hYmxlU2NoZWR1bGVyVHJhY2luZykge1xyXG4gICAgc3Vic2NyaWJlcnMuZGVsZXRlKHN1YnNjcmliZXIpO1xyXG5cclxuICAgIGlmIChzdWJzY3JpYmVycy5zaXplID09PSAwKSB7XHJcbiAgICAgIGV4cG9ydHMuX19zdWJzY3JpYmVyUmVmLmN1cnJlbnQgPSBudWxsO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gb25JbnRlcmFjdGlvblRyYWNlZChpbnRlcmFjdGlvbikge1xyXG4gIHZhciBkaWRDYXRjaEVycm9yID0gZmFsc2U7XHJcbiAgdmFyIGNhdWdodEVycm9yID0gbnVsbDtcclxuXHJcbiAgc3Vic2NyaWJlcnMuZm9yRWFjaChmdW5jdGlvbiAoc3Vic2NyaWJlcikge1xyXG4gICAgdHJ5IHtcclxuICAgICAgc3Vic2NyaWJlci5vbkludGVyYWN0aW9uVHJhY2VkKGludGVyYWN0aW9uKTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIGlmICghZGlkQ2F0Y2hFcnJvcikge1xyXG4gICAgICAgIGRpZENhdGNoRXJyb3IgPSB0cnVlO1xyXG4gICAgICAgIGNhdWdodEVycm9yID0gZXJyb3I7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgaWYgKGRpZENhdGNoRXJyb3IpIHtcclxuICAgIHRocm93IGNhdWdodEVycm9yO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gb25JbnRlcmFjdGlvblNjaGVkdWxlZFdvcmtDb21wbGV0ZWQoaW50ZXJhY3Rpb24pIHtcclxuICB2YXIgZGlkQ2F0Y2hFcnJvciA9IGZhbHNlO1xyXG4gIHZhciBjYXVnaHRFcnJvciA9IG51bGw7XHJcblxyXG4gIHN1YnNjcmliZXJzLmZvckVhY2goZnVuY3Rpb24gKHN1YnNjcmliZXIpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIHN1YnNjcmliZXIub25JbnRlcmFjdGlvblNjaGVkdWxlZFdvcmtDb21wbGV0ZWQoaW50ZXJhY3Rpb24pO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgaWYgKCFkaWRDYXRjaEVycm9yKSB7XHJcbiAgICAgICAgZGlkQ2F0Y2hFcnJvciA9IHRydWU7XHJcbiAgICAgICAgY2F1Z2h0RXJyb3IgPSBlcnJvcjtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICBpZiAoZGlkQ2F0Y2hFcnJvcikge1xyXG4gICAgdGhyb3cgY2F1Z2h0RXJyb3I7XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBvbldvcmtTY2hlZHVsZWQoaW50ZXJhY3Rpb25zLCB0aHJlYWRJRCkge1xyXG4gIHZhciBkaWRDYXRjaEVycm9yID0gZmFsc2U7XHJcbiAgdmFyIGNhdWdodEVycm9yID0gbnVsbDtcclxuXHJcbiAgc3Vic2NyaWJlcnMuZm9yRWFjaChmdW5jdGlvbiAoc3Vic2NyaWJlcikge1xyXG4gICAgdHJ5IHtcclxuICAgICAgc3Vic2NyaWJlci5vbldvcmtTY2hlZHVsZWQoaW50ZXJhY3Rpb25zLCB0aHJlYWRJRCk7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICBpZiAoIWRpZENhdGNoRXJyb3IpIHtcclxuICAgICAgICBkaWRDYXRjaEVycm9yID0gdHJ1ZTtcclxuICAgICAgICBjYXVnaHRFcnJvciA9IGVycm9yO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gIGlmIChkaWRDYXRjaEVycm9yKSB7XHJcbiAgICB0aHJvdyBjYXVnaHRFcnJvcjtcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG9uV29ya1N0YXJ0ZWQoaW50ZXJhY3Rpb25zLCB0aHJlYWRJRCkge1xyXG4gIHZhciBkaWRDYXRjaEVycm9yID0gZmFsc2U7XHJcbiAgdmFyIGNhdWdodEVycm9yID0gbnVsbDtcclxuXHJcbiAgc3Vic2NyaWJlcnMuZm9yRWFjaChmdW5jdGlvbiAoc3Vic2NyaWJlcikge1xyXG4gICAgdHJ5IHtcclxuICAgICAgc3Vic2NyaWJlci5vbldvcmtTdGFydGVkKGludGVyYWN0aW9ucywgdGhyZWFkSUQpO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgaWYgKCFkaWRDYXRjaEVycm9yKSB7XHJcbiAgICAgICAgZGlkQ2F0Y2hFcnJvciA9IHRydWU7XHJcbiAgICAgICAgY2F1Z2h0RXJyb3IgPSBlcnJvcjtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICBpZiAoZGlkQ2F0Y2hFcnJvcikge1xyXG4gICAgdGhyb3cgY2F1Z2h0RXJyb3I7XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBvbldvcmtTdG9wcGVkKGludGVyYWN0aW9ucywgdGhyZWFkSUQpIHtcclxuICB2YXIgZGlkQ2F0Y2hFcnJvciA9IGZhbHNlO1xyXG4gIHZhciBjYXVnaHRFcnJvciA9IG51bGw7XHJcblxyXG4gIHN1YnNjcmliZXJzLmZvckVhY2goZnVuY3Rpb24gKHN1YnNjcmliZXIpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIHN1YnNjcmliZXIub25Xb3JrU3RvcHBlZChpbnRlcmFjdGlvbnMsIHRocmVhZElEKTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIGlmICghZGlkQ2F0Y2hFcnJvcikge1xyXG4gICAgICAgIGRpZENhdGNoRXJyb3IgPSB0cnVlO1xyXG4gICAgICAgIGNhdWdodEVycm9yID0gZXJyb3I7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgaWYgKGRpZENhdGNoRXJyb3IpIHtcclxuICAgIHRocm93IGNhdWdodEVycm9yO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gb25Xb3JrQ2FuY2VsZWQoaW50ZXJhY3Rpb25zLCB0aHJlYWRJRCkge1xyXG4gIHZhciBkaWRDYXRjaEVycm9yID0gZmFsc2U7XHJcbiAgdmFyIGNhdWdodEVycm9yID0gbnVsbDtcclxuXHJcbiAgc3Vic2NyaWJlcnMuZm9yRWFjaChmdW5jdGlvbiAoc3Vic2NyaWJlcikge1xyXG4gICAgdHJ5IHtcclxuICAgICAgc3Vic2NyaWJlci5vbldvcmtDYW5jZWxlZChpbnRlcmFjdGlvbnMsIHRocmVhZElEKTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIGlmICghZGlkQ2F0Y2hFcnJvcikge1xyXG4gICAgICAgIGRpZENhdGNoRXJyb3IgPSB0cnVlO1xyXG4gICAgICAgIGNhdWdodEVycm9yID0gZXJyb3I7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgaWYgKGRpZENhdGNoRXJyb3IpIHtcclxuICAgIHRocm93IGNhdWdodEVycm9yO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0cy51bnN0YWJsZV9jbGVhciA9IHVuc3RhYmxlX2NsZWFyO1xyXG5leHBvcnRzLnVuc3RhYmxlX2dldEN1cnJlbnQgPSB1bnN0YWJsZV9nZXRDdXJyZW50O1xyXG5leHBvcnRzLnVuc3RhYmxlX2dldFRocmVhZElEID0gdW5zdGFibGVfZ2V0VGhyZWFkSUQ7XHJcbmV4cG9ydHMudW5zdGFibGVfdHJhY2UgPSB1bnN0YWJsZV90cmFjZTtcclxuZXhwb3J0cy51bnN0YWJsZV93cmFwID0gdW5zdGFibGVfd3JhcDtcclxuZXhwb3J0cy51bnN0YWJsZV9zdWJzY3JpYmUgPSB1bnN0YWJsZV9zdWJzY3JpYmU7XHJcbmV4cG9ydHMudW5zdGFibGVfdW5zdWJzY3JpYmUgPSB1bnN0YWJsZV91bnN1YnNjcmliZTtcclxuICB9KSgpO1xyXG59XHJcbiIsIi8qKiBAbGljZW5zZSBSZWFjdCB2MC4xMy4xXHJcbiAqIHNjaGVkdWxlci5kZXZlbG9wbWVudC5qc1xyXG4gKlxyXG4gKiBDb3B5cmlnaHQgKGMpIEZhY2Vib29rLCBJbmMuIGFuZCBpdHMgYWZmaWxpYXRlcy5cclxuICpcclxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXHJcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cclxuICovXHJcblxyXG4ndXNlIHN0cmljdCc7XHJcblxyXG5cclxuXHJcbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpIHtcclxuICAoZnVuY3Rpb24oKSB7XHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XHJcblxyXG52YXIgZW5hYmxlU2NoZWR1bGVyRGVidWdnaW5nID0gZmFsc2U7XHJcblxyXG4vKiBlc2xpbnQtZGlzYWJsZSBuby12YXIgKi9cclxuXHJcbi8vIFRPRE86IFVzZSBzeW1ib2xzP1xyXG52YXIgSW1tZWRpYXRlUHJpb3JpdHkgPSAxO1xyXG52YXIgVXNlckJsb2NraW5nUHJpb3JpdHkgPSAyO1xyXG52YXIgTm9ybWFsUHJpb3JpdHkgPSAzO1xyXG52YXIgTG93UHJpb3JpdHkgPSA0O1xyXG52YXIgSWRsZVByaW9yaXR5ID0gNTtcclxuXHJcbi8vIE1heCAzMSBiaXQgaW50ZWdlci4gVGhlIG1heCBpbnRlZ2VyIHNpemUgaW4gVjggZm9yIDMyLWJpdCBzeXN0ZW1zLlxyXG4vLyBNYXRoLnBvdygyLCAzMCkgLSAxXHJcbi8vIDBiMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExXHJcbnZhciBtYXhTaWduZWQzMUJpdEludCA9IDEwNzM3NDE4MjM7XHJcblxyXG4vLyBUaW1lcyBvdXQgaW1tZWRpYXRlbHlcclxudmFyIElNTUVESUFURV9QUklPUklUWV9USU1FT1VUID0gLTE7XHJcbi8vIEV2ZW50dWFsbHkgdGltZXMgb3V0XHJcbnZhciBVU0VSX0JMT0NLSU5HX1BSSU9SSVRZID0gMjUwO1xyXG52YXIgTk9STUFMX1BSSU9SSVRZX1RJTUVPVVQgPSA1MDAwO1xyXG52YXIgTE9XX1BSSU9SSVRZX1RJTUVPVVQgPSAxMDAwMDtcclxuLy8gTmV2ZXIgdGltZXMgb3V0XHJcbnZhciBJRExFX1BSSU9SSVRZID0gbWF4U2lnbmVkMzFCaXRJbnQ7XHJcblxyXG4vLyBDYWxsYmFja3MgYXJlIHN0b3JlZCBhcyBhIGNpcmN1bGFyLCBkb3VibHkgbGlua2VkIGxpc3QuXHJcbnZhciBmaXJzdENhbGxiYWNrTm9kZSA9IG51bGw7XHJcblxyXG52YXIgY3VycmVudERpZFRpbWVvdXQgPSBmYWxzZTtcclxuLy8gUGF1c2luZyB0aGUgc2NoZWR1bGVyIGlzIHVzZWZ1bCBmb3IgZGVidWdnaW5nLlxyXG52YXIgaXNTY2hlZHVsZXJQYXVzZWQgPSBmYWxzZTtcclxuXHJcbnZhciBjdXJyZW50UHJpb3JpdHlMZXZlbCA9IE5vcm1hbFByaW9yaXR5O1xyXG52YXIgY3VycmVudEV2ZW50U3RhcnRUaW1lID0gLTE7XHJcbnZhciBjdXJyZW50RXhwaXJhdGlvblRpbWUgPSAtMTtcclxuXHJcbi8vIFRoaXMgaXMgc2V0IHdoZW4gYSBjYWxsYmFjayBpcyBiZWluZyBleGVjdXRlZCwgdG8gcHJldmVudCByZS1lbnRyYW5jeS5cclxudmFyIGlzRXhlY3V0aW5nQ2FsbGJhY2sgPSBmYWxzZTtcclxuXHJcbnZhciBpc0hvc3RDYWxsYmFja1NjaGVkdWxlZCA9IGZhbHNlO1xyXG5cclxudmFyIGhhc05hdGl2ZVBlcmZvcm1hbmNlTm93ID0gdHlwZW9mIHBlcmZvcm1hbmNlID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgcGVyZm9ybWFuY2Uubm93ID09PSAnZnVuY3Rpb24nO1xyXG5cclxuZnVuY3Rpb24gZW5zdXJlSG9zdENhbGxiYWNrSXNTY2hlZHVsZWQoKSB7XHJcbiAgaWYgKGlzRXhlY3V0aW5nQ2FsbGJhY2spIHtcclxuICAgIC8vIERvbid0IHNjaGVkdWxlIHdvcmsgeWV0OyB3YWl0IHVudGlsIHRoZSBuZXh0IHRpbWUgd2UgeWllbGQuXHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG4gIC8vIFNjaGVkdWxlIHRoZSBob3N0IGNhbGxiYWNrIHVzaW5nIHRoZSBlYXJsaWVzdCBleHBpcmF0aW9uIGluIHRoZSBsaXN0LlxyXG4gIHZhciBleHBpcmF0aW9uVGltZSA9IGZpcnN0Q2FsbGJhY2tOb2RlLmV4cGlyYXRpb25UaW1lO1xyXG4gIGlmICghaXNIb3N0Q2FsbGJhY2tTY2hlZHVsZWQpIHtcclxuICAgIGlzSG9zdENhbGxiYWNrU2NoZWR1bGVkID0gdHJ1ZTtcclxuICB9IGVsc2Uge1xyXG4gICAgLy8gQ2FuY2VsIHRoZSBleGlzdGluZyBob3N0IGNhbGxiYWNrLlxyXG4gICAgY2FuY2VsSG9zdENhbGxiYWNrKCk7XHJcbiAgfVxyXG4gIHJlcXVlc3RIb3N0Q2FsbGJhY2soZmx1c2hXb3JrLCBleHBpcmF0aW9uVGltZSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGZsdXNoRmlyc3RDYWxsYmFjaygpIHtcclxuICB2YXIgZmx1c2hlZE5vZGUgPSBmaXJzdENhbGxiYWNrTm9kZTtcclxuXHJcbiAgLy8gUmVtb3ZlIHRoZSBub2RlIGZyb20gdGhlIGxpc3QgYmVmb3JlIGNhbGxpbmcgdGhlIGNhbGxiYWNrLiBUaGF0IHdheSB0aGVcclxuICAvLyBsaXN0IGlzIGluIGEgY29uc2lzdGVudCBzdGF0ZSBldmVuIGlmIHRoZSBjYWxsYmFjayB0aHJvd3MuXHJcbiAgdmFyIG5leHQgPSBmaXJzdENhbGxiYWNrTm9kZS5uZXh0O1xyXG4gIGlmIChmaXJzdENhbGxiYWNrTm9kZSA9PT0gbmV4dCkge1xyXG4gICAgLy8gVGhpcyBpcyB0aGUgbGFzdCBjYWxsYmFjayBpbiB0aGUgbGlzdC5cclxuICAgIGZpcnN0Q2FsbGJhY2tOb2RlID0gbnVsbDtcclxuICAgIG5leHQgPSBudWxsO1xyXG4gIH0gZWxzZSB7XHJcbiAgICB2YXIgbGFzdENhbGxiYWNrTm9kZSA9IGZpcnN0Q2FsbGJhY2tOb2RlLnByZXZpb3VzO1xyXG4gICAgZmlyc3RDYWxsYmFja05vZGUgPSBsYXN0Q2FsbGJhY2tOb2RlLm5leHQgPSBuZXh0O1xyXG4gICAgbmV4dC5wcmV2aW91cyA9IGxhc3RDYWxsYmFja05vZGU7XHJcbiAgfVxyXG5cclxuICBmbHVzaGVkTm9kZS5uZXh0ID0gZmx1c2hlZE5vZGUucHJldmlvdXMgPSBudWxsO1xyXG5cclxuICAvLyBOb3cgaXQncyBzYWZlIHRvIGNhbGwgdGhlIGNhbGxiYWNrLlxyXG4gIHZhciBjYWxsYmFjayA9IGZsdXNoZWROb2RlLmNhbGxiYWNrO1xyXG4gIHZhciBleHBpcmF0aW9uVGltZSA9IGZsdXNoZWROb2RlLmV4cGlyYXRpb25UaW1lO1xyXG4gIHZhciBwcmlvcml0eUxldmVsID0gZmx1c2hlZE5vZGUucHJpb3JpdHlMZXZlbDtcclxuICB2YXIgcHJldmlvdXNQcmlvcml0eUxldmVsID0gY3VycmVudFByaW9yaXR5TGV2ZWw7XHJcbiAgdmFyIHByZXZpb3VzRXhwaXJhdGlvblRpbWUgPSBjdXJyZW50RXhwaXJhdGlvblRpbWU7XHJcbiAgY3VycmVudFByaW9yaXR5TGV2ZWwgPSBwcmlvcml0eUxldmVsO1xyXG4gIGN1cnJlbnRFeHBpcmF0aW9uVGltZSA9IGV4cGlyYXRpb25UaW1lO1xyXG4gIHZhciBjb250aW51YXRpb25DYWxsYmFjaztcclxuICB0cnkge1xyXG4gICAgY29udGludWF0aW9uQ2FsbGJhY2sgPSBjYWxsYmFjaygpO1xyXG4gIH0gZmluYWxseSB7XHJcbiAgICBjdXJyZW50UHJpb3JpdHlMZXZlbCA9IHByZXZpb3VzUHJpb3JpdHlMZXZlbDtcclxuICAgIGN1cnJlbnRFeHBpcmF0aW9uVGltZSA9IHByZXZpb3VzRXhwaXJhdGlvblRpbWU7XHJcbiAgfVxyXG5cclxuICAvLyBBIGNhbGxiYWNrIG1heSByZXR1cm4gYSBjb250aW51YXRpb24uIFRoZSBjb250aW51YXRpb24gc2hvdWxkIGJlIHNjaGVkdWxlZFxyXG4gIC8vIHdpdGggdGhlIHNhbWUgcHJpb3JpdHkgYW5kIGV4cGlyYXRpb24gYXMgdGhlIGp1c3QtZmluaXNoZWQgY2FsbGJhY2suXHJcbiAgaWYgKHR5cGVvZiBjb250aW51YXRpb25DYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgdmFyIGNvbnRpbnVhdGlvbk5vZGUgPSB7XHJcbiAgICAgIGNhbGxiYWNrOiBjb250aW51YXRpb25DYWxsYmFjayxcclxuICAgICAgcHJpb3JpdHlMZXZlbDogcHJpb3JpdHlMZXZlbCxcclxuICAgICAgZXhwaXJhdGlvblRpbWU6IGV4cGlyYXRpb25UaW1lLFxyXG4gICAgICBuZXh0OiBudWxsLFxyXG4gICAgICBwcmV2aW91czogbnVsbFxyXG4gICAgfTtcclxuXHJcbiAgICAvLyBJbnNlcnQgdGhlIG5ldyBjYWxsYmFjayBpbnRvIHRoZSBsaXN0LCBzb3J0ZWQgYnkgaXRzIGV4cGlyYXRpb24uIFRoaXMgaXNcclxuICAgIC8vIGFsbW9zdCB0aGUgc2FtZSBhcyB0aGUgY29kZSBpbiBgc2NoZWR1bGVDYWxsYmFja2AsIGV4Y2VwdCB0aGUgY2FsbGJhY2tcclxuICAgIC8vIGlzIGluc2VydGVkIGludG8gdGhlIGxpc3QgKmJlZm9yZSogY2FsbGJhY2tzIG9mIGVxdWFsIGV4cGlyYXRpb24gaW5zdGVhZFxyXG4gICAgLy8gb2YgYWZ0ZXIuXHJcbiAgICBpZiAoZmlyc3RDYWxsYmFja05vZGUgPT09IG51bGwpIHtcclxuICAgICAgLy8gVGhpcyBpcyB0aGUgZmlyc3QgY2FsbGJhY2sgaW4gdGhlIGxpc3QuXHJcbiAgICAgIGZpcnN0Q2FsbGJhY2tOb2RlID0gY29udGludWF0aW9uTm9kZS5uZXh0ID0gY29udGludWF0aW9uTm9kZS5wcmV2aW91cyA9IGNvbnRpbnVhdGlvbk5vZGU7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB2YXIgbmV4dEFmdGVyQ29udGludWF0aW9uID0gbnVsbDtcclxuICAgICAgdmFyIG5vZGUgPSBmaXJzdENhbGxiYWNrTm9kZTtcclxuICAgICAgZG8ge1xyXG4gICAgICAgIGlmIChub2RlLmV4cGlyYXRpb25UaW1lID49IGV4cGlyYXRpb25UaW1lKSB7XHJcbiAgICAgICAgICAvLyBUaGlzIGNhbGxiYWNrIGV4cGlyZXMgYXQgb3IgYWZ0ZXIgdGhlIGNvbnRpbnVhdGlvbi4gV2Ugd2lsbCBpbnNlcnRcclxuICAgICAgICAgIC8vIHRoZSBjb250aW51YXRpb24gKmJlZm9yZSogdGhpcyBjYWxsYmFjay5cclxuICAgICAgICAgIG5leHRBZnRlckNvbnRpbnVhdGlvbiA9IG5vZGU7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgbm9kZSA9IG5vZGUubmV4dDtcclxuICAgICAgfSB3aGlsZSAobm9kZSAhPT0gZmlyc3RDYWxsYmFja05vZGUpO1xyXG5cclxuICAgICAgaWYgKG5leHRBZnRlckNvbnRpbnVhdGlvbiA9PT0gbnVsbCkge1xyXG4gICAgICAgIC8vIE5vIGVxdWFsIG9yIGxvd2VyIHByaW9yaXR5IGNhbGxiYWNrIHdhcyBmb3VuZCwgd2hpY2ggbWVhbnMgdGhlIG5ld1xyXG4gICAgICAgIC8vIGNhbGxiYWNrIGlzIHRoZSBsb3dlc3QgcHJpb3JpdHkgY2FsbGJhY2sgaW4gdGhlIGxpc3QuXHJcbiAgICAgICAgbmV4dEFmdGVyQ29udGludWF0aW9uID0gZmlyc3RDYWxsYmFja05vZGU7XHJcbiAgICAgIH0gZWxzZSBpZiAobmV4dEFmdGVyQ29udGludWF0aW9uID09PSBmaXJzdENhbGxiYWNrTm9kZSkge1xyXG4gICAgICAgIC8vIFRoZSBuZXcgY2FsbGJhY2sgaXMgdGhlIGhpZ2hlc3QgcHJpb3JpdHkgY2FsbGJhY2sgaW4gdGhlIGxpc3QuXHJcbiAgICAgICAgZmlyc3RDYWxsYmFja05vZGUgPSBjb250aW51YXRpb25Ob2RlO1xyXG4gICAgICAgIGVuc3VyZUhvc3RDYWxsYmFja0lzU2NoZWR1bGVkKCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciBwcmV2aW91cyA9IG5leHRBZnRlckNvbnRpbnVhdGlvbi5wcmV2aW91cztcclxuICAgICAgcHJldmlvdXMubmV4dCA9IG5leHRBZnRlckNvbnRpbnVhdGlvbi5wcmV2aW91cyA9IGNvbnRpbnVhdGlvbk5vZGU7XHJcbiAgICAgIGNvbnRpbnVhdGlvbk5vZGUubmV4dCA9IG5leHRBZnRlckNvbnRpbnVhdGlvbjtcclxuICAgICAgY29udGludWF0aW9uTm9kZS5wcmV2aW91cyA9IHByZXZpb3VzO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gZmx1c2hJbW1lZGlhdGVXb3JrKCkge1xyXG4gIGlmIChcclxuICAvLyBDb25maXJtIHdlJ3ZlIGV4aXRlZCB0aGUgb3V0ZXIgbW9zdCBldmVudCBoYW5kbGVyXHJcbiAgY3VycmVudEV2ZW50U3RhcnRUaW1lID09PSAtMSAmJiBmaXJzdENhbGxiYWNrTm9kZSAhPT0gbnVsbCAmJiBmaXJzdENhbGxiYWNrTm9kZS5wcmlvcml0eUxldmVsID09PSBJbW1lZGlhdGVQcmlvcml0eSkge1xyXG4gICAgaXNFeGVjdXRpbmdDYWxsYmFjayA9IHRydWU7XHJcbiAgICB0cnkge1xyXG4gICAgICBkbyB7XHJcbiAgICAgICAgZmx1c2hGaXJzdENhbGxiYWNrKCk7XHJcbiAgICAgIH0gd2hpbGUgKFxyXG4gICAgICAvLyBLZWVwIGZsdXNoaW5nIHVudGlsIHRoZXJlIGFyZSBubyBtb3JlIGltbWVkaWF0ZSBjYWxsYmFja3NcclxuICAgICAgZmlyc3RDYWxsYmFja05vZGUgIT09IG51bGwgJiYgZmlyc3RDYWxsYmFja05vZGUucHJpb3JpdHlMZXZlbCA9PT0gSW1tZWRpYXRlUHJpb3JpdHkpO1xyXG4gICAgfSBmaW5hbGx5IHtcclxuICAgICAgaXNFeGVjdXRpbmdDYWxsYmFjayA9IGZhbHNlO1xyXG4gICAgICBpZiAoZmlyc3RDYWxsYmFja05vZGUgIT09IG51bGwpIHtcclxuICAgICAgICAvLyBUaGVyZSdzIHN0aWxsIHdvcmsgcmVtYWluaW5nLiBSZXF1ZXN0IGFub3RoZXIgY2FsbGJhY2suXHJcbiAgICAgICAgZW5zdXJlSG9zdENhbGxiYWNrSXNTY2hlZHVsZWQoKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpc0hvc3RDYWxsYmFja1NjaGVkdWxlZCA9IGZhbHNlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBmbHVzaFdvcmsoZGlkVGltZW91dCkge1xyXG4gIC8vIEV4aXQgcmlnaHQgYXdheSBpZiB3ZSdyZSBjdXJyZW50bHkgcGF1c2VkXHJcblxyXG4gIGlmIChlbmFibGVTY2hlZHVsZXJEZWJ1Z2dpbmcgJiYgaXNTY2hlZHVsZXJQYXVzZWQpIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcblxyXG4gIGlzRXhlY3V0aW5nQ2FsbGJhY2sgPSB0cnVlO1xyXG4gIHZhciBwcmV2aW91c0RpZFRpbWVvdXQgPSBjdXJyZW50RGlkVGltZW91dDtcclxuICBjdXJyZW50RGlkVGltZW91dCA9IGRpZFRpbWVvdXQ7XHJcbiAgdHJ5IHtcclxuICAgIGlmIChkaWRUaW1lb3V0KSB7XHJcbiAgICAgIC8vIEZsdXNoIGFsbCB0aGUgZXhwaXJlZCBjYWxsYmFja3Mgd2l0aG91dCB5aWVsZGluZy5cclxuICAgICAgd2hpbGUgKGZpcnN0Q2FsbGJhY2tOb2RlICE9PSBudWxsICYmICEoZW5hYmxlU2NoZWR1bGVyRGVidWdnaW5nICYmIGlzU2NoZWR1bGVyUGF1c2VkKSkge1xyXG4gICAgICAgIC8vIFRPRE8gV3JhcCBpbiBmZWF0dXJlIGZsYWdcclxuICAgICAgICAvLyBSZWFkIHRoZSBjdXJyZW50IHRpbWUuIEZsdXNoIGFsbCB0aGUgY2FsbGJhY2tzIHRoYXQgZXhwaXJlIGF0IG9yXHJcbiAgICAgICAgLy8gZWFybGllciB0aGFuIHRoYXQgdGltZS4gVGhlbiByZWFkIHRoZSBjdXJyZW50IHRpbWUgYWdhaW4gYW5kIHJlcGVhdC5cclxuICAgICAgICAvLyBUaGlzIG9wdGltaXplcyBmb3IgYXMgZmV3IHBlcmZvcm1hbmNlLm5vdyBjYWxscyBhcyBwb3NzaWJsZS5cclxuICAgICAgICB2YXIgY3VycmVudFRpbWUgPSBleHBvcnRzLnVuc3RhYmxlX25vdygpO1xyXG4gICAgICAgIGlmIChmaXJzdENhbGxiYWNrTm9kZS5leHBpcmF0aW9uVGltZSA8PSBjdXJyZW50VGltZSkge1xyXG4gICAgICAgICAgZG8ge1xyXG4gICAgICAgICAgICBmbHVzaEZpcnN0Q2FsbGJhY2soKTtcclxuICAgICAgICAgIH0gd2hpbGUgKGZpcnN0Q2FsbGJhY2tOb2RlICE9PSBudWxsICYmIGZpcnN0Q2FsbGJhY2tOb2RlLmV4cGlyYXRpb25UaW1lIDw9IGN1cnJlbnRUaW1lICYmICEoZW5hYmxlU2NoZWR1bGVyRGVidWdnaW5nICYmIGlzU2NoZWR1bGVyUGF1c2VkKSk7XHJcbiAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIC8vIEtlZXAgZmx1c2hpbmcgY2FsbGJhY2tzIHVudGlsIHdlIHJ1biBvdXQgb2YgdGltZSBpbiB0aGUgZnJhbWUuXHJcbiAgICAgIGlmIChmaXJzdENhbGxiYWNrTm9kZSAhPT0gbnVsbCkge1xyXG4gICAgICAgIGRvIHtcclxuICAgICAgICAgIGlmIChlbmFibGVTY2hlZHVsZXJEZWJ1Z2dpbmcgJiYgaXNTY2hlZHVsZXJQYXVzZWQpIHtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBmbHVzaEZpcnN0Q2FsbGJhY2soKTtcclxuICAgICAgICB9IHdoaWxlIChmaXJzdENhbGxiYWNrTm9kZSAhPT0gbnVsbCAmJiAhc2hvdWxkWWllbGRUb0hvc3QoKSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9IGZpbmFsbHkge1xyXG4gICAgaXNFeGVjdXRpbmdDYWxsYmFjayA9IGZhbHNlO1xyXG4gICAgY3VycmVudERpZFRpbWVvdXQgPSBwcmV2aW91c0RpZFRpbWVvdXQ7XHJcbiAgICBpZiAoZmlyc3RDYWxsYmFja05vZGUgIT09IG51bGwpIHtcclxuICAgICAgLy8gVGhlcmUncyBzdGlsbCB3b3JrIHJlbWFpbmluZy4gUmVxdWVzdCBhbm90aGVyIGNhbGxiYWNrLlxyXG4gICAgICBlbnN1cmVIb3N0Q2FsbGJhY2tJc1NjaGVkdWxlZCgpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaXNIb3N0Q2FsbGJhY2tTY2hlZHVsZWQgPSBmYWxzZTtcclxuICAgIH1cclxuICAgIC8vIEJlZm9yZSBleGl0aW5nLCBmbHVzaCBhbGwgdGhlIGltbWVkaWF0ZSB3b3JrIHRoYXQgd2FzIHNjaGVkdWxlZC5cclxuICAgIGZsdXNoSW1tZWRpYXRlV29yaygpO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gdW5zdGFibGVfcnVuV2l0aFByaW9yaXR5KHByaW9yaXR5TGV2ZWwsIGV2ZW50SGFuZGxlcikge1xyXG4gIHN3aXRjaCAocHJpb3JpdHlMZXZlbCkge1xyXG4gICAgY2FzZSBJbW1lZGlhdGVQcmlvcml0eTpcclxuICAgIGNhc2UgVXNlckJsb2NraW5nUHJpb3JpdHk6XHJcbiAgICBjYXNlIE5vcm1hbFByaW9yaXR5OlxyXG4gICAgY2FzZSBMb3dQcmlvcml0eTpcclxuICAgIGNhc2UgSWRsZVByaW9yaXR5OlxyXG4gICAgICBicmVhaztcclxuICAgIGRlZmF1bHQ6XHJcbiAgICAgIHByaW9yaXR5TGV2ZWwgPSBOb3JtYWxQcmlvcml0eTtcclxuICB9XHJcblxyXG4gIHZhciBwcmV2aW91c1ByaW9yaXR5TGV2ZWwgPSBjdXJyZW50UHJpb3JpdHlMZXZlbDtcclxuICB2YXIgcHJldmlvdXNFdmVudFN0YXJ0VGltZSA9IGN1cnJlbnRFdmVudFN0YXJ0VGltZTtcclxuICBjdXJyZW50UHJpb3JpdHlMZXZlbCA9IHByaW9yaXR5TGV2ZWw7XHJcbiAgY3VycmVudEV2ZW50U3RhcnRUaW1lID0gZXhwb3J0cy51bnN0YWJsZV9ub3coKTtcclxuXHJcbiAgdHJ5IHtcclxuICAgIHJldHVybiBldmVudEhhbmRsZXIoKTtcclxuICB9IGZpbmFsbHkge1xyXG4gICAgY3VycmVudFByaW9yaXR5TGV2ZWwgPSBwcmV2aW91c1ByaW9yaXR5TGV2ZWw7XHJcbiAgICBjdXJyZW50RXZlbnRTdGFydFRpbWUgPSBwcmV2aW91c0V2ZW50U3RhcnRUaW1lO1xyXG5cclxuICAgIC8vIEJlZm9yZSBleGl0aW5nLCBmbHVzaCBhbGwgdGhlIGltbWVkaWF0ZSB3b3JrIHRoYXQgd2FzIHNjaGVkdWxlZC5cclxuICAgIGZsdXNoSW1tZWRpYXRlV29yaygpO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gdW5zdGFibGVfd3JhcENhbGxiYWNrKGNhbGxiYWNrKSB7XHJcbiAgdmFyIHBhcmVudFByaW9yaXR5TGV2ZWwgPSBjdXJyZW50UHJpb3JpdHlMZXZlbDtcclxuICByZXR1cm4gZnVuY3Rpb24gKCkge1xyXG4gICAgLy8gVGhpcyBpcyBhIGZvcmsgb2YgcnVuV2l0aFByaW9yaXR5LCBpbmxpbmVkIGZvciBwZXJmb3JtYW5jZS5cclxuICAgIHZhciBwcmV2aW91c1ByaW9yaXR5TGV2ZWwgPSBjdXJyZW50UHJpb3JpdHlMZXZlbDtcclxuICAgIHZhciBwcmV2aW91c0V2ZW50U3RhcnRUaW1lID0gY3VycmVudEV2ZW50U3RhcnRUaW1lO1xyXG4gICAgY3VycmVudFByaW9yaXR5TGV2ZWwgPSBwYXJlbnRQcmlvcml0eUxldmVsO1xyXG4gICAgY3VycmVudEV2ZW50U3RhcnRUaW1lID0gZXhwb3J0cy51bnN0YWJsZV9ub3coKTtcclxuXHJcbiAgICB0cnkge1xyXG4gICAgICByZXR1cm4gY2FsbGJhY2suYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuICAgIH0gZmluYWxseSB7XHJcbiAgICAgIGN1cnJlbnRQcmlvcml0eUxldmVsID0gcHJldmlvdXNQcmlvcml0eUxldmVsO1xyXG4gICAgICBjdXJyZW50RXZlbnRTdGFydFRpbWUgPSBwcmV2aW91c0V2ZW50U3RhcnRUaW1lO1xyXG4gICAgICBmbHVzaEltbWVkaWF0ZVdvcmsoKTtcclxuICAgIH1cclxuICB9O1xyXG59XHJcblxyXG5mdW5jdGlvbiB1bnN0YWJsZV9zY2hlZHVsZUNhbGxiYWNrKGNhbGxiYWNrLCBkZXByZWNhdGVkX29wdGlvbnMpIHtcclxuICB2YXIgc3RhcnRUaW1lID0gY3VycmVudEV2ZW50U3RhcnRUaW1lICE9PSAtMSA/IGN1cnJlbnRFdmVudFN0YXJ0VGltZSA6IGV4cG9ydHMudW5zdGFibGVfbm93KCk7XHJcblxyXG4gIHZhciBleHBpcmF0aW9uVGltZTtcclxuICBpZiAodHlwZW9mIGRlcHJlY2F0ZWRfb3B0aW9ucyA9PT0gJ29iamVjdCcgJiYgZGVwcmVjYXRlZF9vcHRpb25zICE9PSBudWxsICYmIHR5cGVvZiBkZXByZWNhdGVkX29wdGlvbnMudGltZW91dCA9PT0gJ251bWJlcicpIHtcclxuICAgIC8vIEZJWE1FOiBSZW1vdmUgdGhpcyBicmFuY2ggb25jZSB3ZSBsaWZ0IGV4cGlyYXRpb24gdGltZXMgb3V0IG9mIFJlYWN0LlxyXG4gICAgZXhwaXJhdGlvblRpbWUgPSBzdGFydFRpbWUgKyBkZXByZWNhdGVkX29wdGlvbnMudGltZW91dDtcclxuICB9IGVsc2Uge1xyXG4gICAgc3dpdGNoIChjdXJyZW50UHJpb3JpdHlMZXZlbCkge1xyXG4gICAgICBjYXNlIEltbWVkaWF0ZVByaW9yaXR5OlxyXG4gICAgICAgIGV4cGlyYXRpb25UaW1lID0gc3RhcnRUaW1lICsgSU1NRURJQVRFX1BSSU9SSVRZX1RJTUVPVVQ7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgVXNlckJsb2NraW5nUHJpb3JpdHk6XHJcbiAgICAgICAgZXhwaXJhdGlvblRpbWUgPSBzdGFydFRpbWUgKyBVU0VSX0JMT0NLSU5HX1BSSU9SSVRZO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIElkbGVQcmlvcml0eTpcclxuICAgICAgICBleHBpcmF0aW9uVGltZSA9IHN0YXJ0VGltZSArIElETEVfUFJJT1JJVFk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgTG93UHJpb3JpdHk6XHJcbiAgICAgICAgZXhwaXJhdGlvblRpbWUgPSBzdGFydFRpbWUgKyBMT1dfUFJJT1JJVFlfVElNRU9VVDtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBOb3JtYWxQcmlvcml0eTpcclxuICAgICAgZGVmYXVsdDpcclxuICAgICAgICBleHBpcmF0aW9uVGltZSA9IHN0YXJ0VGltZSArIE5PUk1BTF9QUklPUklUWV9USU1FT1VUO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdmFyIG5ld05vZGUgPSB7XHJcbiAgICBjYWxsYmFjazogY2FsbGJhY2ssXHJcbiAgICBwcmlvcml0eUxldmVsOiBjdXJyZW50UHJpb3JpdHlMZXZlbCxcclxuICAgIGV4cGlyYXRpb25UaW1lOiBleHBpcmF0aW9uVGltZSxcclxuICAgIG5leHQ6IG51bGwsXHJcbiAgICBwcmV2aW91czogbnVsbFxyXG4gIH07XHJcblxyXG4gIC8vIEluc2VydCB0aGUgbmV3IGNhbGxiYWNrIGludG8gdGhlIGxpc3QsIG9yZGVyZWQgZmlyc3QgYnkgZXhwaXJhdGlvbiwgdGhlblxyXG4gIC8vIGJ5IGluc2VydGlvbi4gU28gdGhlIG5ldyBjYWxsYmFjayBpcyBpbnNlcnRlZCBhbnkgb3RoZXIgY2FsbGJhY2sgd2l0aFxyXG4gIC8vIGVxdWFsIGV4cGlyYXRpb24uXHJcbiAgaWYgKGZpcnN0Q2FsbGJhY2tOb2RlID09PSBudWxsKSB7XHJcbiAgICAvLyBUaGlzIGlzIHRoZSBmaXJzdCBjYWxsYmFjayBpbiB0aGUgbGlzdC5cclxuICAgIGZpcnN0Q2FsbGJhY2tOb2RlID0gbmV3Tm9kZS5uZXh0ID0gbmV3Tm9kZS5wcmV2aW91cyA9IG5ld05vZGU7XHJcbiAgICBlbnN1cmVIb3N0Q2FsbGJhY2tJc1NjaGVkdWxlZCgpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICB2YXIgbmV4dCA9IG51bGw7XHJcbiAgICB2YXIgbm9kZSA9IGZpcnN0Q2FsbGJhY2tOb2RlO1xyXG4gICAgZG8ge1xyXG4gICAgICBpZiAobm9kZS5leHBpcmF0aW9uVGltZSA+IGV4cGlyYXRpb25UaW1lKSB7XHJcbiAgICAgICAgLy8gVGhlIG5ldyBjYWxsYmFjayBleHBpcmVzIGJlZm9yZSB0aGlzIG9uZS5cclxuICAgICAgICBuZXh0ID0gbm9kZTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgICBub2RlID0gbm9kZS5uZXh0O1xyXG4gICAgfSB3aGlsZSAobm9kZSAhPT0gZmlyc3RDYWxsYmFja05vZGUpO1xyXG5cclxuICAgIGlmIChuZXh0ID09PSBudWxsKSB7XHJcbiAgICAgIC8vIE5vIGNhbGxiYWNrIHdpdGggYSBsYXRlciBleHBpcmF0aW9uIHdhcyBmb3VuZCwgd2hpY2ggbWVhbnMgdGhlIG5ld1xyXG4gICAgICAvLyBjYWxsYmFjayBoYXMgdGhlIGxhdGVzdCBleHBpcmF0aW9uIGluIHRoZSBsaXN0LlxyXG4gICAgICBuZXh0ID0gZmlyc3RDYWxsYmFja05vZGU7XHJcbiAgICB9IGVsc2UgaWYgKG5leHQgPT09IGZpcnN0Q2FsbGJhY2tOb2RlKSB7XHJcbiAgICAgIC8vIFRoZSBuZXcgY2FsbGJhY2sgaGFzIHRoZSBlYXJsaWVzdCBleHBpcmF0aW9uIGluIHRoZSBlbnRpcmUgbGlzdC5cclxuICAgICAgZmlyc3RDYWxsYmFja05vZGUgPSBuZXdOb2RlO1xyXG4gICAgICBlbnN1cmVIb3N0Q2FsbGJhY2tJc1NjaGVkdWxlZCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBwcmV2aW91cyA9IG5leHQucHJldmlvdXM7XHJcbiAgICBwcmV2aW91cy5uZXh0ID0gbmV4dC5wcmV2aW91cyA9IG5ld05vZGU7XHJcbiAgICBuZXdOb2RlLm5leHQgPSBuZXh0O1xyXG4gICAgbmV3Tm9kZS5wcmV2aW91cyA9IHByZXZpb3VzO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIG5ld05vZGU7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHVuc3RhYmxlX3BhdXNlRXhlY3V0aW9uKCkge1xyXG4gIGlzU2NoZWR1bGVyUGF1c2VkID0gdHJ1ZTtcclxufVxyXG5cclxuZnVuY3Rpb24gdW5zdGFibGVfY29udGludWVFeGVjdXRpb24oKSB7XHJcbiAgaXNTY2hlZHVsZXJQYXVzZWQgPSBmYWxzZTtcclxuICBpZiAoZmlyc3RDYWxsYmFja05vZGUgIT09IG51bGwpIHtcclxuICAgIGVuc3VyZUhvc3RDYWxsYmFja0lzU2NoZWR1bGVkKCk7XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiB1bnN0YWJsZV9nZXRGaXJzdENhbGxiYWNrTm9kZSgpIHtcclxuICByZXR1cm4gZmlyc3RDYWxsYmFja05vZGU7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHVuc3RhYmxlX2NhbmNlbENhbGxiYWNrKGNhbGxiYWNrTm9kZSkge1xyXG4gIHZhciBuZXh0ID0gY2FsbGJhY2tOb2RlLm5leHQ7XHJcbiAgaWYgKG5leHQgPT09IG51bGwpIHtcclxuICAgIC8vIEFscmVhZHkgY2FuY2VsbGVkLlxyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuXHJcbiAgaWYgKG5leHQgPT09IGNhbGxiYWNrTm9kZSkge1xyXG4gICAgLy8gVGhpcyBpcyB0aGUgb25seSBzY2hlZHVsZWQgY2FsbGJhY2suIENsZWFyIHRoZSBsaXN0LlxyXG4gICAgZmlyc3RDYWxsYmFja05vZGUgPSBudWxsO1xyXG4gIH0gZWxzZSB7XHJcbiAgICAvLyBSZW1vdmUgdGhlIGNhbGxiYWNrIGZyb20gaXRzIHBvc2l0aW9uIGluIHRoZSBsaXN0LlxyXG4gICAgaWYgKGNhbGxiYWNrTm9kZSA9PT0gZmlyc3RDYWxsYmFja05vZGUpIHtcclxuICAgICAgZmlyc3RDYWxsYmFja05vZGUgPSBuZXh0O1xyXG4gICAgfVxyXG4gICAgdmFyIHByZXZpb3VzID0gY2FsbGJhY2tOb2RlLnByZXZpb3VzO1xyXG4gICAgcHJldmlvdXMubmV4dCA9IG5leHQ7XHJcbiAgICBuZXh0LnByZXZpb3VzID0gcHJldmlvdXM7XHJcbiAgfVxyXG5cclxuICBjYWxsYmFja05vZGUubmV4dCA9IGNhbGxiYWNrTm9kZS5wcmV2aW91cyA9IG51bGw7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHVuc3RhYmxlX2dldEN1cnJlbnRQcmlvcml0eUxldmVsKCkge1xyXG4gIHJldHVybiBjdXJyZW50UHJpb3JpdHlMZXZlbDtcclxufVxyXG5cclxuZnVuY3Rpb24gdW5zdGFibGVfc2hvdWxkWWllbGQoKSB7XHJcbiAgcmV0dXJuICFjdXJyZW50RGlkVGltZW91dCAmJiAoZmlyc3RDYWxsYmFja05vZGUgIT09IG51bGwgJiYgZmlyc3RDYWxsYmFja05vZGUuZXhwaXJhdGlvblRpbWUgPCBjdXJyZW50RXhwaXJhdGlvblRpbWUgfHwgc2hvdWxkWWllbGRUb0hvc3QoKSk7XHJcbn1cclxuXHJcbi8vIFRoZSByZW1haW5pbmcgY29kZSBpcyBlc3NlbnRpYWxseSBhIHBvbHlmaWxsIGZvciByZXF1ZXN0SWRsZUNhbGxiYWNrLiBJdFxyXG4vLyB3b3JrcyBieSBzY2hlZHVsaW5nIGEgcmVxdWVzdEFuaW1hdGlvbkZyYW1lLCBzdG9yaW5nIHRoZSB0aW1lIGZvciB0aGUgc3RhcnRcclxuLy8gb2YgdGhlIGZyYW1lLCB0aGVuIHNjaGVkdWxpbmcgYSBwb3N0TWVzc2FnZSB3aGljaCBnZXRzIHNjaGVkdWxlZCBhZnRlciBwYWludC5cclxuLy8gV2l0aGluIHRoZSBwb3N0TWVzc2FnZSBoYW5kbGVyIGRvIGFzIG11Y2ggd29yayBhcyBwb3NzaWJsZSB1bnRpbCB0aW1lICsgZnJhbWVcclxuLy8gcmF0ZS4gQnkgc2VwYXJhdGluZyB0aGUgaWRsZSBjYWxsIGludG8gYSBzZXBhcmF0ZSBldmVudCB0aWNrIHdlIGVuc3VyZSB0aGF0XHJcbi8vIGxheW91dCwgcGFpbnQgYW5kIG90aGVyIGJyb3dzZXIgd29yayBpcyBjb3VudGVkIGFnYWluc3QgdGhlIGF2YWlsYWJsZSB0aW1lLlxyXG4vLyBUaGUgZnJhbWUgcmF0ZSBpcyBkeW5hbWljYWxseSBhZGp1c3RlZC5cclxuXHJcbi8vIFdlIGNhcHR1cmUgYSBsb2NhbCByZWZlcmVuY2UgdG8gYW55IGdsb2JhbCwgaW4gY2FzZSBpdCBnZXRzIHBvbHlmaWxsZWQgYWZ0ZXJcclxuLy8gdGhpcyBtb2R1bGUgaXMgaW5pdGlhbGx5IGV2YWx1YXRlZC4gV2Ugd2FudCB0byBiZSB1c2luZyBhXHJcbi8vIGNvbnNpc3RlbnQgaW1wbGVtZW50YXRpb24uXHJcbnZhciBsb2NhbERhdGUgPSBEYXRlO1xyXG5cclxuLy8gVGhpcyBpbml0aWFsaXphdGlvbiBjb2RlIG1heSBydW4gZXZlbiBvbiBzZXJ2ZXIgZW52aXJvbm1lbnRzIGlmIGEgY29tcG9uZW50XHJcbi8vIGp1c3QgaW1wb3J0cyBSZWFjdERPTSAoZS5nLiBmb3IgZmluZERPTU5vZGUpLiBTb21lIGVudmlyb25tZW50cyBtaWdodCBub3RcclxuLy8gaGF2ZSBzZXRUaW1lb3V0IG9yIGNsZWFyVGltZW91dC4gSG93ZXZlciwgd2UgYWx3YXlzIGV4cGVjdCB0aGVtIHRvIGJlIGRlZmluZWRcclxuLy8gb24gdGhlIGNsaWVudC4gaHR0cHM6Ly9naXRodWIuY29tL2ZhY2Vib29rL3JlYWN0L3B1bGwvMTMwODhcclxudmFyIGxvY2FsU2V0VGltZW91dCA9IHR5cGVvZiBzZXRUaW1lb3V0ID09PSAnZnVuY3Rpb24nID8gc2V0VGltZW91dCA6IHVuZGVmaW5lZDtcclxudmFyIGxvY2FsQ2xlYXJUaW1lb3V0ID0gdHlwZW9mIGNsZWFyVGltZW91dCA9PT0gJ2Z1bmN0aW9uJyA/IGNsZWFyVGltZW91dCA6IHVuZGVmaW5lZDtcclxuXHJcbi8vIFdlIGRvbid0IGV4cGVjdCBlaXRoZXIgb2YgdGhlc2UgdG8gbmVjZXNzYXJpbHkgYmUgZGVmaW5lZCwgYnV0IHdlIHdpbGwgZXJyb3JcclxuLy8gbGF0ZXIgaWYgdGhleSBhcmUgbWlzc2luZyBvbiB0aGUgY2xpZW50LlxyXG52YXIgbG9jYWxSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSB0eXBlb2YgcmVxdWVzdEFuaW1hdGlvbkZyYW1lID09PSAnZnVuY3Rpb24nID8gcmVxdWVzdEFuaW1hdGlvbkZyYW1lIDogdW5kZWZpbmVkO1xyXG52YXIgbG9jYWxDYW5jZWxBbmltYXRpb25GcmFtZSA9IHR5cGVvZiBjYW5jZWxBbmltYXRpb25GcmFtZSA9PT0gJ2Z1bmN0aW9uJyA/IGNhbmNlbEFuaW1hdGlvbkZyYW1lIDogdW5kZWZpbmVkO1xyXG5cclxuLy8gcmVxdWVzdEFuaW1hdGlvbkZyYW1lIGRvZXMgbm90IHJ1biB3aGVuIHRoZSB0YWIgaXMgaW4gdGhlIGJhY2tncm91bmQuIElmXHJcbi8vIHdlJ3JlIGJhY2tncm91bmRlZCB3ZSBwcmVmZXIgZm9yIHRoYXQgd29yayB0byBoYXBwZW4gc28gdGhhdCB0aGUgcGFnZVxyXG4vLyBjb250aW51ZXMgdG8gbG9hZCBpbiB0aGUgYmFja2dyb3VuZC4gU28gd2UgYWxzbyBzY2hlZHVsZSBhICdzZXRUaW1lb3V0JyBhc1xyXG4vLyBhIGZhbGxiYWNrLlxyXG4vLyBUT0RPOiBOZWVkIGEgYmV0dGVyIGhldXJpc3RpYyBmb3IgYmFja2dyb3VuZGVkIHdvcmsuXHJcbnZhciBBTklNQVRJT05fRlJBTUVfVElNRU9VVCA9IDEwMDtcclxudmFyIHJBRklEO1xyXG52YXIgckFGVGltZW91dElEO1xyXG52YXIgcmVxdWVzdEFuaW1hdGlvbkZyYW1lV2l0aFRpbWVvdXQgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcclxuICAvLyBzY2hlZHVsZSByQUYgYW5kIGFsc28gYSBzZXRUaW1lb3V0XHJcbiAgckFGSUQgPSBsb2NhbFJlcXVlc3RBbmltYXRpb25GcmFtZShmdW5jdGlvbiAodGltZXN0YW1wKSB7XHJcbiAgICAvLyBjYW5jZWwgdGhlIHNldFRpbWVvdXRcclxuICAgIGxvY2FsQ2xlYXJUaW1lb3V0KHJBRlRpbWVvdXRJRCk7XHJcbiAgICBjYWxsYmFjayh0aW1lc3RhbXApO1xyXG4gIH0pO1xyXG4gIHJBRlRpbWVvdXRJRCA9IGxvY2FsU2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAvLyBjYW5jZWwgdGhlIHJlcXVlc3RBbmltYXRpb25GcmFtZVxyXG4gICAgbG9jYWxDYW5jZWxBbmltYXRpb25GcmFtZShyQUZJRCk7XHJcbiAgICBjYWxsYmFjayhleHBvcnRzLnVuc3RhYmxlX25vdygpKTtcclxuICB9LCBBTklNQVRJT05fRlJBTUVfVElNRU9VVCk7XHJcbn07XHJcblxyXG5pZiAoaGFzTmF0aXZlUGVyZm9ybWFuY2VOb3cpIHtcclxuICB2YXIgUGVyZm9ybWFuY2UgPSBwZXJmb3JtYW5jZTtcclxuICBleHBvcnRzLnVuc3RhYmxlX25vdyA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiBQZXJmb3JtYW5jZS5ub3coKTtcclxuICB9O1xyXG59IGVsc2Uge1xyXG4gIGV4cG9ydHMudW5zdGFibGVfbm93ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuIGxvY2FsRGF0ZS5ub3coKTtcclxuICB9O1xyXG59XHJcblxyXG52YXIgcmVxdWVzdEhvc3RDYWxsYmFjaztcclxudmFyIGNhbmNlbEhvc3RDYWxsYmFjaztcclxudmFyIHNob3VsZFlpZWxkVG9Ib3N0O1xyXG5cclxudmFyIGdsb2JhbFZhbHVlID0gbnVsbDtcclxuaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgZ2xvYmFsVmFsdWUgPSB3aW5kb3c7XHJcbn0gZWxzZSBpZiAodHlwZW9mIGdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICBnbG9iYWxWYWx1ZSA9IGdsb2JhbDtcclxufVxyXG5cclxuaWYgKGdsb2JhbFZhbHVlICYmIGdsb2JhbFZhbHVlLl9zY2hlZE1vY2spIHtcclxuICAvLyBEeW5hbWljIGluamVjdGlvbiwgb25seSBmb3IgdGVzdGluZyBwdXJwb3Nlcy5cclxuICB2YXIgZ2xvYmFsSW1wbCA9IGdsb2JhbFZhbHVlLl9zY2hlZE1vY2s7XHJcbiAgcmVxdWVzdEhvc3RDYWxsYmFjayA9IGdsb2JhbEltcGxbMF07XHJcbiAgY2FuY2VsSG9zdENhbGxiYWNrID0gZ2xvYmFsSW1wbFsxXTtcclxuICBzaG91bGRZaWVsZFRvSG9zdCA9IGdsb2JhbEltcGxbMl07XHJcbiAgZXhwb3J0cy51bnN0YWJsZV9ub3cgPSBnbG9iYWxJbXBsWzNdO1xyXG59IGVsc2UgaWYgKFxyXG4vLyBJZiBTY2hlZHVsZXIgcnVucyBpbiBhIG5vbi1ET00gZW52aXJvbm1lbnQsIGl0IGZhbGxzIGJhY2sgdG8gYSBuYWl2ZVxyXG4vLyBpbXBsZW1lbnRhdGlvbiB1c2luZyBzZXRUaW1lb3V0LlxyXG50eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJyB8fFxyXG4vLyBDaGVjayBpZiBNZXNzYWdlQ2hhbm5lbCBpcyBzdXBwb3J0ZWQsIHRvby5cclxudHlwZW9mIE1lc3NhZ2VDaGFubmVsICE9PSAnZnVuY3Rpb24nKSB7XHJcbiAgLy8gSWYgdGhpcyBhY2NpZGVudGFsbHkgZ2V0cyBpbXBvcnRlZCBpbiBhIG5vbi1icm93c2VyIGVudmlyb25tZW50LCBlLmcuIEphdmFTY3JpcHRDb3JlLFxyXG4gIC8vIGZhbGxiYWNrIHRvIGEgbmFpdmUgaW1wbGVtZW50YXRpb24uXHJcbiAgdmFyIF9jYWxsYmFjayA9IG51bGw7XHJcbiAgdmFyIF9mbHVzaENhbGxiYWNrID0gZnVuY3Rpb24gKGRpZFRpbWVvdXQpIHtcclxuICAgIGlmIChfY2FsbGJhY2sgIT09IG51bGwpIHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBfY2FsbGJhY2soZGlkVGltZW91dCk7XHJcbiAgICAgIH0gZmluYWxseSB7XHJcbiAgICAgICAgX2NhbGxiYWNrID0gbnVsbDtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH07XHJcbiAgcmVxdWVzdEhvc3RDYWxsYmFjayA9IGZ1bmN0aW9uIChjYiwgbXMpIHtcclxuICAgIGlmIChfY2FsbGJhY2sgIT09IG51bGwpIHtcclxuICAgICAgLy8gUHJvdGVjdCBhZ2FpbnN0IHJlLWVudHJhbmN5LlxyXG4gICAgICBzZXRUaW1lb3V0KHJlcXVlc3RIb3N0Q2FsbGJhY2ssIDAsIGNiKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIF9jYWxsYmFjayA9IGNiO1xyXG4gICAgICBzZXRUaW1lb3V0KF9mbHVzaENhbGxiYWNrLCAwLCBmYWxzZSk7XHJcbiAgICB9XHJcbiAgfTtcclxuICBjYW5jZWxIb3N0Q2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBfY2FsbGJhY2sgPSBudWxsO1xyXG4gIH07XHJcbiAgc2hvdWxkWWllbGRUb0hvc3QgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfTtcclxufSBlbHNlIHtcclxuICBpZiAodHlwZW9mIGNvbnNvbGUgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAvLyBUT0RPOiBSZW1vdmUgZmIubWUgbGlua1xyXG4gICAgaWYgKHR5cGVvZiBsb2NhbFJlcXVlc3RBbmltYXRpb25GcmFtZSAhPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICBjb25zb2xlLmVycm9yKFwiVGhpcyBicm93c2VyIGRvZXNuJ3Qgc3VwcG9ydCByZXF1ZXN0QW5pbWF0aW9uRnJhbWUuIFwiICsgJ01ha2Ugc3VyZSB0aGF0IHlvdSBsb2FkIGEgJyArICdwb2x5ZmlsbCBpbiBvbGRlciBicm93c2Vycy4gaHR0cHM6Ly9mYi5tZS9yZWFjdC1wb2x5ZmlsbHMnKTtcclxuICAgIH1cclxuICAgIGlmICh0eXBlb2YgbG9jYWxDYW5jZWxBbmltYXRpb25GcmFtZSAhPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICBjb25zb2xlLmVycm9yKFwiVGhpcyBicm93c2VyIGRvZXNuJ3Qgc3VwcG9ydCBjYW5jZWxBbmltYXRpb25GcmFtZS4gXCIgKyAnTWFrZSBzdXJlIHRoYXQgeW91IGxvYWQgYSAnICsgJ3BvbHlmaWxsIGluIG9sZGVyIGJyb3dzZXJzLiBodHRwczovL2ZiLm1lL3JlYWN0LXBvbHlmaWxscycpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdmFyIHNjaGVkdWxlZEhvc3RDYWxsYmFjayA9IG51bGw7XHJcbiAgdmFyIGlzTWVzc2FnZUV2ZW50U2NoZWR1bGVkID0gZmFsc2U7XHJcbiAgdmFyIHRpbWVvdXRUaW1lID0gLTE7XHJcblxyXG4gIHZhciBpc0FuaW1hdGlvbkZyYW1lU2NoZWR1bGVkID0gZmFsc2U7XHJcblxyXG4gIHZhciBpc0ZsdXNoaW5nSG9zdENhbGxiYWNrID0gZmFsc2U7XHJcblxyXG4gIHZhciBmcmFtZURlYWRsaW5lID0gMDtcclxuICAvLyBXZSBzdGFydCBvdXQgYXNzdW1pbmcgdGhhdCB3ZSBydW4gYXQgMzBmcHMgYnV0IHRoZW4gdGhlIGhldXJpc3RpYyB0cmFja2luZ1xyXG4gIC8vIHdpbGwgYWRqdXN0IHRoaXMgdmFsdWUgdG8gYSBmYXN0ZXIgZnBzIGlmIHdlIGdldCBtb3JlIGZyZXF1ZW50IGFuaW1hdGlvblxyXG4gIC8vIGZyYW1lcy5cclxuICB2YXIgcHJldmlvdXNGcmFtZVRpbWUgPSAzMztcclxuICB2YXIgYWN0aXZlRnJhbWVUaW1lID0gMzM7XHJcblxyXG4gIHNob3VsZFlpZWxkVG9Ib3N0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuIGZyYW1lRGVhZGxpbmUgPD0gZXhwb3J0cy51bnN0YWJsZV9ub3coKTtcclxuICB9O1xyXG5cclxuICAvLyBXZSB1c2UgdGhlIHBvc3RNZXNzYWdlIHRyaWNrIHRvIGRlZmVyIGlkbGUgd29yayB1bnRpbCBhZnRlciB0aGUgcmVwYWludC5cclxuICB2YXIgY2hhbm5lbCA9IG5ldyBNZXNzYWdlQ2hhbm5lbCgpO1xyXG4gIHZhciBwb3J0ID0gY2hhbm5lbC5wb3J0MjtcclxuICBjaGFubmVsLnBvcnQxLm9ubWVzc2FnZSA9IGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgaXNNZXNzYWdlRXZlbnRTY2hlZHVsZWQgPSBmYWxzZTtcclxuXHJcbiAgICB2YXIgcHJldlNjaGVkdWxlZENhbGxiYWNrID0gc2NoZWR1bGVkSG9zdENhbGxiYWNrO1xyXG4gICAgdmFyIHByZXZUaW1lb3V0VGltZSA9IHRpbWVvdXRUaW1lO1xyXG4gICAgc2NoZWR1bGVkSG9zdENhbGxiYWNrID0gbnVsbDtcclxuICAgIHRpbWVvdXRUaW1lID0gLTE7XHJcblxyXG4gICAgdmFyIGN1cnJlbnRUaW1lID0gZXhwb3J0cy51bnN0YWJsZV9ub3coKTtcclxuXHJcbiAgICB2YXIgZGlkVGltZW91dCA9IGZhbHNlO1xyXG4gICAgaWYgKGZyYW1lRGVhZGxpbmUgLSBjdXJyZW50VGltZSA8PSAwKSB7XHJcbiAgICAgIC8vIFRoZXJlJ3Mgbm8gdGltZSBsZWZ0IGluIHRoaXMgaWRsZSBwZXJpb2QuIENoZWNrIGlmIHRoZSBjYWxsYmFjayBoYXNcclxuICAgICAgLy8gYSB0aW1lb3V0IGFuZCB3aGV0aGVyIGl0J3MgYmVlbiBleGNlZWRlZC5cclxuICAgICAgaWYgKHByZXZUaW1lb3V0VGltZSAhPT0gLTEgJiYgcHJldlRpbWVvdXRUaW1lIDw9IGN1cnJlbnRUaW1lKSB7XHJcbiAgICAgICAgLy8gRXhjZWVkZWQgdGhlIHRpbWVvdXQuIEludm9rZSB0aGUgY2FsbGJhY2sgZXZlbiB0aG91Z2ggdGhlcmUncyBub1xyXG4gICAgICAgIC8vIHRpbWUgbGVmdC5cclxuICAgICAgICBkaWRUaW1lb3V0ID0gdHJ1ZTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAvLyBObyB0aW1lb3V0LlxyXG4gICAgICAgIGlmICghaXNBbmltYXRpb25GcmFtZVNjaGVkdWxlZCkge1xyXG4gICAgICAgICAgLy8gU2NoZWR1bGUgYW5vdGhlciBhbmltYXRpb24gY2FsbGJhY2sgc28gd2UgcmV0cnkgbGF0ZXIuXHJcbiAgICAgICAgICBpc0FuaW1hdGlvbkZyYW1lU2NoZWR1bGVkID0gdHJ1ZTtcclxuICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZVdpdGhUaW1lb3V0KGFuaW1hdGlvblRpY2spO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBFeGl0IHdpdGhvdXQgaW52b2tpbmcgdGhlIGNhbGxiYWNrLlxyXG4gICAgICAgIHNjaGVkdWxlZEhvc3RDYWxsYmFjayA9IHByZXZTY2hlZHVsZWRDYWxsYmFjaztcclxuICAgICAgICB0aW1lb3V0VGltZSA9IHByZXZUaW1lb3V0VGltZTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAocHJldlNjaGVkdWxlZENhbGxiYWNrICE9PSBudWxsKSB7XHJcbiAgICAgIGlzRmx1c2hpbmdIb3N0Q2FsbGJhY2sgPSB0cnVlO1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIHByZXZTY2hlZHVsZWRDYWxsYmFjayhkaWRUaW1lb3V0KTtcclxuICAgICAgfSBmaW5hbGx5IHtcclxuICAgICAgICBpc0ZsdXNoaW5nSG9zdENhbGxiYWNrID0gZmFsc2U7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9O1xyXG5cclxuICB2YXIgYW5pbWF0aW9uVGljayA9IGZ1bmN0aW9uIChyYWZUaW1lKSB7XHJcbiAgICBpZiAoc2NoZWR1bGVkSG9zdENhbGxiYWNrICE9PSBudWxsKSB7XHJcbiAgICAgIC8vIEVhZ2VybHkgc2NoZWR1bGUgdGhlIG5leHQgYW5pbWF0aW9uIGNhbGxiYWNrIGF0IHRoZSBiZWdpbm5pbmcgb2YgdGhlXHJcbiAgICAgIC8vIGZyYW1lLiBJZiB0aGUgc2NoZWR1bGVyIHF1ZXVlIGlzIG5vdCBlbXB0eSBhdCB0aGUgZW5kIG9mIHRoZSBmcmFtZSwgaXRcclxuICAgICAgLy8gd2lsbCBjb250aW51ZSBmbHVzaGluZyBpbnNpZGUgdGhhdCBjYWxsYmFjay4gSWYgdGhlIHF1ZXVlICppcyogZW1wdHksXHJcbiAgICAgIC8vIHRoZW4gaXQgd2lsbCBleGl0IGltbWVkaWF0ZWx5LiBQb3N0aW5nIHRoZSBjYWxsYmFjayBhdCB0aGUgc3RhcnQgb2YgdGhlXHJcbiAgICAgIC8vIGZyYW1lIGVuc3VyZXMgaXQncyBmaXJlZCB3aXRoaW4gdGhlIGVhcmxpZXN0IHBvc3NpYmxlIGZyYW1lLiBJZiB3ZVxyXG4gICAgICAvLyB3YWl0ZWQgdW50aWwgdGhlIGVuZCBvZiB0aGUgZnJhbWUgdG8gcG9zdCB0aGUgY2FsbGJhY2ssIHdlIHJpc2sgdGhlXHJcbiAgICAgIC8vIGJyb3dzZXIgc2tpcHBpbmcgYSBmcmFtZSBhbmQgbm90IGZpcmluZyB0aGUgY2FsbGJhY2sgdW50aWwgdGhlIGZyYW1lXHJcbiAgICAgIC8vIGFmdGVyIHRoYXQuXHJcbiAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZVdpdGhUaW1lb3V0KGFuaW1hdGlvblRpY2spO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgLy8gTm8gcGVuZGluZyB3b3JrLiBFeGl0LlxyXG4gICAgICBpc0FuaW1hdGlvbkZyYW1lU2NoZWR1bGVkID0gZmFsc2U7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgbmV4dEZyYW1lVGltZSA9IHJhZlRpbWUgLSBmcmFtZURlYWRsaW5lICsgYWN0aXZlRnJhbWVUaW1lO1xyXG4gICAgaWYgKG5leHRGcmFtZVRpbWUgPCBhY3RpdmVGcmFtZVRpbWUgJiYgcHJldmlvdXNGcmFtZVRpbWUgPCBhY3RpdmVGcmFtZVRpbWUpIHtcclxuICAgICAgaWYgKG5leHRGcmFtZVRpbWUgPCA4KSB7XHJcbiAgICAgICAgLy8gRGVmZW5zaXZlIGNvZGluZy4gV2UgZG9uJ3Qgc3VwcG9ydCBoaWdoZXIgZnJhbWUgcmF0ZXMgdGhhbiAxMjBoei5cclxuICAgICAgICAvLyBJZiB0aGUgY2FsY3VsYXRlZCBmcmFtZSB0aW1lIGdldHMgbG93ZXIgdGhhbiA4LCBpdCBpcyBwcm9iYWJseSBhIGJ1Zy5cclxuICAgICAgICBuZXh0RnJhbWVUaW1lID0gODtcclxuICAgICAgfVxyXG4gICAgICAvLyBJZiBvbmUgZnJhbWUgZ29lcyBsb25nLCB0aGVuIHRoZSBuZXh0IG9uZSBjYW4gYmUgc2hvcnQgdG8gY2F0Y2ggdXAuXHJcbiAgICAgIC8vIElmIHR3byBmcmFtZXMgYXJlIHNob3J0IGluIGEgcm93LCB0aGVuIHRoYXQncyBhbiBpbmRpY2F0aW9uIHRoYXQgd2VcclxuICAgICAgLy8gYWN0dWFsbHkgaGF2ZSBhIGhpZ2hlciBmcmFtZSByYXRlIHRoYW4gd2hhdCB3ZSdyZSBjdXJyZW50bHkgb3B0aW1pemluZy5cclxuICAgICAgLy8gV2UgYWRqdXN0IG91ciBoZXVyaXN0aWMgZHluYW1pY2FsbHkgYWNjb3JkaW5nbHkuIEZvciBleGFtcGxlLCBpZiB3ZSdyZVxyXG4gICAgICAvLyBydW5uaW5nIG9uIDEyMGh6IGRpc3BsYXkgb3IgOTBoeiBWUiBkaXNwbGF5LlxyXG4gICAgICAvLyBUYWtlIHRoZSBtYXggb2YgdGhlIHR3byBpbiBjYXNlIG9uZSBvZiB0aGVtIHdhcyBhbiBhbm9tYWx5IGR1ZSB0b1xyXG4gICAgICAvLyBtaXNzZWQgZnJhbWUgZGVhZGxpbmVzLlxyXG4gICAgICBhY3RpdmVGcmFtZVRpbWUgPSBuZXh0RnJhbWVUaW1lIDwgcHJldmlvdXNGcmFtZVRpbWUgPyBwcmV2aW91c0ZyYW1lVGltZSA6IG5leHRGcmFtZVRpbWU7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBwcmV2aW91c0ZyYW1lVGltZSA9IG5leHRGcmFtZVRpbWU7XHJcbiAgICB9XHJcbiAgICBmcmFtZURlYWRsaW5lID0gcmFmVGltZSArIGFjdGl2ZUZyYW1lVGltZTtcclxuICAgIGlmICghaXNNZXNzYWdlRXZlbnRTY2hlZHVsZWQpIHtcclxuICAgICAgaXNNZXNzYWdlRXZlbnRTY2hlZHVsZWQgPSB0cnVlO1xyXG4gICAgICBwb3J0LnBvc3RNZXNzYWdlKHVuZGVmaW5lZCk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgcmVxdWVzdEhvc3RDYWxsYmFjayA9IGZ1bmN0aW9uIChjYWxsYmFjaywgYWJzb2x1dGVUaW1lb3V0KSB7XHJcbiAgICBzY2hlZHVsZWRIb3N0Q2FsbGJhY2sgPSBjYWxsYmFjaztcclxuICAgIHRpbWVvdXRUaW1lID0gYWJzb2x1dGVUaW1lb3V0O1xyXG4gICAgaWYgKGlzRmx1c2hpbmdIb3N0Q2FsbGJhY2sgfHwgYWJzb2x1dGVUaW1lb3V0IDwgMCkge1xyXG4gICAgICAvLyBEb24ndCB3YWl0IGZvciB0aGUgbmV4dCBmcmFtZS4gQ29udGludWUgd29ya2luZyBBU0FQLCBpbiBhIG5ldyBldmVudC5cclxuICAgICAgcG9ydC5wb3N0TWVzc2FnZSh1bmRlZmluZWQpO1xyXG4gICAgfSBlbHNlIGlmICghaXNBbmltYXRpb25GcmFtZVNjaGVkdWxlZCkge1xyXG4gICAgICAvLyBJZiByQUYgZGlkbid0IGFscmVhZHkgc2NoZWR1bGUgb25lLCB3ZSBuZWVkIHRvIHNjaGVkdWxlIGEgZnJhbWUuXHJcbiAgICAgIC8vIFRPRE86IElmIHRoaXMgckFGIGRvZXNuJ3QgbWF0ZXJpYWxpemUgYmVjYXVzZSB0aGUgYnJvd3NlciB0aHJvdHRsZXMsIHdlXHJcbiAgICAgIC8vIG1pZ2h0IHdhbnQgdG8gc3RpbGwgaGF2ZSBzZXRUaW1lb3V0IHRyaWdnZXIgcklDIGFzIGEgYmFja3VwIHRvIGVuc3VyZVxyXG4gICAgICAvLyB0aGF0IHdlIGtlZXAgcGVyZm9ybWluZyB3b3JrLlxyXG4gICAgICBpc0FuaW1hdGlvbkZyYW1lU2NoZWR1bGVkID0gdHJ1ZTtcclxuICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lV2l0aFRpbWVvdXQoYW5pbWF0aW9uVGljayk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgY2FuY2VsSG9zdENhbGxiYWNrID0gZnVuY3Rpb24gKCkge1xyXG4gICAgc2NoZWR1bGVkSG9zdENhbGxiYWNrID0gbnVsbDtcclxuICAgIGlzTWVzc2FnZUV2ZW50U2NoZWR1bGVkID0gZmFsc2U7XHJcbiAgICB0aW1lb3V0VGltZSA9IC0xO1xyXG4gIH07XHJcbn1cclxuXHJcbmV4cG9ydHMudW5zdGFibGVfSW1tZWRpYXRlUHJpb3JpdHkgPSBJbW1lZGlhdGVQcmlvcml0eTtcclxuZXhwb3J0cy51bnN0YWJsZV9Vc2VyQmxvY2tpbmdQcmlvcml0eSA9IFVzZXJCbG9ja2luZ1ByaW9yaXR5O1xyXG5leHBvcnRzLnVuc3RhYmxlX05vcm1hbFByaW9yaXR5ID0gTm9ybWFsUHJpb3JpdHk7XHJcbmV4cG9ydHMudW5zdGFibGVfSWRsZVByaW9yaXR5ID0gSWRsZVByaW9yaXR5O1xyXG5leHBvcnRzLnVuc3RhYmxlX0xvd1ByaW9yaXR5ID0gTG93UHJpb3JpdHk7XHJcbmV4cG9ydHMudW5zdGFibGVfcnVuV2l0aFByaW9yaXR5ID0gdW5zdGFibGVfcnVuV2l0aFByaW9yaXR5O1xyXG5leHBvcnRzLnVuc3RhYmxlX3NjaGVkdWxlQ2FsbGJhY2sgPSB1bnN0YWJsZV9zY2hlZHVsZUNhbGxiYWNrO1xyXG5leHBvcnRzLnVuc3RhYmxlX2NhbmNlbENhbGxiYWNrID0gdW5zdGFibGVfY2FuY2VsQ2FsbGJhY2s7XHJcbmV4cG9ydHMudW5zdGFibGVfd3JhcENhbGxiYWNrID0gdW5zdGFibGVfd3JhcENhbGxiYWNrO1xyXG5leHBvcnRzLnVuc3RhYmxlX2dldEN1cnJlbnRQcmlvcml0eUxldmVsID0gdW5zdGFibGVfZ2V0Q3VycmVudFByaW9yaXR5TGV2ZWw7XHJcbmV4cG9ydHMudW5zdGFibGVfc2hvdWxkWWllbGQgPSB1bnN0YWJsZV9zaG91bGRZaWVsZDtcclxuZXhwb3J0cy51bnN0YWJsZV9jb250aW51ZUV4ZWN1dGlvbiA9IHVuc3RhYmxlX2NvbnRpbnVlRXhlY3V0aW9uO1xyXG5leHBvcnRzLnVuc3RhYmxlX3BhdXNlRXhlY3V0aW9uID0gdW5zdGFibGVfcGF1c2VFeGVjdXRpb247XHJcbmV4cG9ydHMudW5zdGFibGVfZ2V0Rmlyc3RDYWxsYmFja05vZGUgPSB1bnN0YWJsZV9nZXRGaXJzdENhbGxiYWNrTm9kZTtcclxuICB9KSgpO1xyXG59XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ3Byb2R1Y3Rpb24nKSB7XHJcbiAgbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2Nqcy9zY2hlZHVsZXIucHJvZHVjdGlvbi5taW4uanMnKTtcclxufSBlbHNlIHtcclxuICBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vY2pzL3NjaGVkdWxlci5kZXZlbG9wbWVudC5qcycpO1xyXG59XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ3Byb2R1Y3Rpb24nKSB7XHJcbiAgbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2Nqcy9zY2hlZHVsZXItdHJhY2luZy5wcm9kdWN0aW9uLm1pbi5qcycpO1xyXG59IGVsc2Uge1xyXG4gIG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9janMvc2NoZWR1bGVyLXRyYWNpbmcuZGV2ZWxvcG1lbnQuanMnKTtcclxufVxyXG4iXSwic291cmNlUm9vdCI6IiJ9