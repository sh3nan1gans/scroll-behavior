"use strict";

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports["default"] = createUseScroll;

function createUseScroll(updateScroll, start, stop) {
  return function (createHistory) {
    return function (options) {
      var history = createHistory(options);

      var numListeners = 0;

      function checkStart() {
        if (++numListeners === 1 && start) {
          start(history);
        }
      }

      function checkStop() {
        if (--numListeners === 0 && stop) {
          stop();
        }
      }

      function listenBefore(hook) {
        checkStart();
        var unlisten = history.listenBefore(hook);

        return function () {
          unlisten();
          checkStop();
        };
      }

      var listeners = [],
          currentLocation = undefined,
          unlisten = undefined;

      function onChange(location) {
        currentLocation = location;

        listeners.forEach(function (listener) {
          return listener(location);
        });
        updateScroll(location);
      }

      function listen(listener) {
        checkStart();

        if (listeners.length === 0) {
          unlisten = history.listen(onChange);
        }

        // Add the listener to the list afterward so we can manage calling it
        // initially with the current location.
        listeners.push(listener);
        listener(currentLocation);

        return function () {
          listeners = listeners.filter(function (item) {
            return item !== listener;
          });
          if (listeners.length === 0) {
            unlisten();
          }

          checkStop();
        };
      }

      return _extends({}, history, {
        listenBefore: listenBefore,
        listen: listen
      });
    };
  };
}

module.exports = exports["default"];