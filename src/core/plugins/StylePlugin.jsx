import React from "react";

export const StylePlugin = {
  apply(manager) {
    manager.hooks.afterRender.tap(
      "WithStylePlugin",
      (Component, type, props) => {
        if (props.styleWrapper) {
          return function StyledWrapper(innerProps) {
            return (
              <div style={props.styleWrapper}>
                <Component {...innerProps} />
              </div>
            );
          };
        }
        return Component;
      }
    );
  },
};
