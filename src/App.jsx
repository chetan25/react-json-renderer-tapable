import { useState, useEffect, Suspense } from "react";

import { pluginManager } from "./core/pluginManager";
import { createCustomAssetPlugin } from "./core/plugins/CustomAssetPlugin";
import { DefaultCallbackPlugin } from "./core/plugins/DefaultCallbackPlugin";
import { StylePlugin } from "./core/plugins/StylePlugin";
import { LoggerPlugin } from "./core/plugins/LoggerPlugin";
import { GuardPlugin } from "./core/plugins/GuardPlugin";
import { DynamicRenderer } from "./core/components/DynamicRenderer";
import { RenderTimingPlugin } from "./core/plugins/RenderTimingPlugin";
import "./App.css";

// Register core plugins
pluginManager.apply(DefaultCallbackPlugin);
pluginManager.apply(StylePlugin);
pluginManager.apply(LoggerPlugin);
pluginManager.apply(GuardPlugin);
pluginManager.apply(RenderTimingPlugin);

// Register dynamic component types
const assets = {
  text: () => import("./components/Text"),
  button: () => import("./components/Button"),
  card: () => import("./components/Card"),
};

const CustomAssetsPlugin = createCustomAssetPlugin(assets);
pluginManager.apply(CustomAssetsPlugin);

// Optional: Register context handlers
const context = {
  handleClick: () => console.log("Clicked!"),
};
pluginManager.context = context;

// ✅ Simulate async schema fetching
async function fetchSchemaFromApi() {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve([
        { type: "text", props: { value: "Welcome to Plugin Renderer" } },
        {
          type: "button",
          props: { label: "Click me", onClick: "$handleClick" },
        },
        // {
        //   type: "card",
        //   props: { title: "Card Title", content: "Card content here." },
        // },
      ]);
    }, 1000)
  );
}

function App() {
  const [schema, setSchema] = useState(null);

  useEffect(() => {
    fetchSchemaFromApi().then(setSchema);
  }, []);

  useEffect(() => {
    if (schema) {
      setTimeout(() => {
        pluginManager.getRenderTimingReport?.(); // Optional safe call
      }, 200); // Delay to ensure rendering is done
    }
  }, [schema]);

  if (!schema) return <p>Loading schema...</p>;

  return (
    <div style={{ padding: 24 }}>
      <h2>Plugin-Based Renderer</h2>

      {schema.map((node, i) => (
        <Suspense fallback={<p>Loading {node.type}...</p>} key={i}>
          <DynamicRenderer
            type={node.type}
            props={node.props}
            context={context}
          />
        </Suspense>
      ))}
    </div>
  );
}

export default App;
