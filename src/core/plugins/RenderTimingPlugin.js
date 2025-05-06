export const RenderTimingPlugin = {
  renderTimes: {},

  apply(manager) {
    manager.hooks.beforeRender.tap("RenderTimingPlugin", (type) => {
      RenderTimingPlugin.renderTimes[type] = {
        start: performance.now(),
        end: null,
        total: null,
      };
    });

    manager.hooks.afterRender.tap(
      "RenderTimingPlugin",
      (Component, type, props) => {
        const record = RenderTimingPlugin.renderTimes[type];
        if (record) {
          record.end = performance.now();
          record.total = record.end - record.start;
        }

        return Component;
      }
    );

    // Optional: expose method to print report
    manager.getRenderTimingReport = () => {
      console.table(
        Object.entries(RenderTimingPlugin.renderTimes).map(
          ([type, { total }]) => ({
            Component: type,
            "Render Time (ms)": total?.toFixed(2),
          })
        )
      );
    };
  },
};
