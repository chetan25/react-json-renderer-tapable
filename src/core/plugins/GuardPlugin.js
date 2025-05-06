export const GuardPlugin = {
  apply(manager) {
    manager.hooks.shouldRender.tap("GuardPlugin", (type, props) => {
      if (type === "card" && props.disabled) {
        console.warn(`Card is disabled via props`);
        return false;
      }
    });
  },
};
