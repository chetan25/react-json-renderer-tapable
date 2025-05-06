// plugins/DefaultCallbackPlugin.js
import { defaultHandlers } from "../defaultBehaviors";
import { composeHandlers } from "../utils";

export const DefaultCallbackPlugin = {
  apply(manager) {
    manager.hooks.beforeRender.tap("DefaultCallbackPlugin", (type, props) => {
      for (const key in props) {
        const val = props[key];
        const isRef = typeof val === "string" && val.startsWith("$");

        const userFn = isRef ? manager.context?.[val.slice(1)] : val;
        const defaultFn = defaultHandlers[key];

        if (defaultFn) {
          props[key] = composeHandlers(defaultFn, userFn);
        }
      }
    });
  },
};
