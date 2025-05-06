import React, { useEffect, useState } from "react";
import { pluginManager } from "../pluginManager";
import { defaultHandlers } from "../defaultBehaviors";
import { composeHandlers } from "../utils";
import { ErrorBoundary } from "./ErrorBoundary";

export function DynamicRenderer({ type, props, context = {} }) {
  const [Component, setComponent] = useState(null);
  const [resolvedProps, setResolvedProps] = useState(props);

  useEffect(() => {
    const load = async () => {
      const shouldRender = pluginManager.hooks.shouldRender.call(type, props);
      if (shouldRender === false) {
        console.warn(`[shouldRender] prevented rendering: ${type}`);
        return;
      }

      const startTime = performance.now(); // Start render time

      // ✅ Fire beforeRender async hook
      await pluginManager.hooks.beforeRender.promise(type, props);

      // ✅ Get loader from plugin registry
      const loader = pluginManager.getComponent(type);
      if (!loader) {
        console.warn(`No component registered for type "${type}"`);
        return;
      }

      const mod = await loader();
      let Comp = mod.default || mod;

      // ✅ Compose default + user-defined handlers
      const finalProps = { ...props };
      // ✅ Fire afterRender async waterfall hook to wrap/replace component
      const FinalComponent = await pluginManager.hooks.afterRender.promise(
        Comp,
        type,
        finalProps
      );

      const endTime = performance.now();
      console.log(`[render:${type}] ${Math.round(endTime - startTime)}ms`);

      setResolvedProps(finalProps);
      setComponent(() => FinalComponent);
    };

    load();
  }, [type, props]);

  if (!Component) return null; // Suspense fallback will render
  return (
    <ErrorBoundary>
      <Component {...resolvedProps} />
    </ErrorBoundary>
  );
}
