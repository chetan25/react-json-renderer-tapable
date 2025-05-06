import React from "react";

export const LoggerPlugin = {
  apply(manager) {
    manager.hooks.afterRender.tap(
      "WrapWithLoggerPlugin",
      (Component, type, props) => {
        return function Wrapped(props) {
          console.log(`[${type}] rendering with props:`, props);
          return <Component {...props} />;
        };
      }
    );
  },
};
