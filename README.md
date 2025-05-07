---
Title: React Plugin-Based JSON UI Renderer with Tapable Hooks.
Excerpt: A modular React rendering engine powered by Tapable-style hooks. Define UI using JSON, extend behavior with plugins, and dynamically load components, callbacks, and styling.
Tech: "React, Tapable , Modular JSON-driven Rendering"
---

# React Plugin-Based JSON Renderer

A plugin-extensible React library for rendering UI from a JSON schema using a Tapable-style hook system. Inspired by Webpack’s plugin architecture, this library allows you to dynamically register components, attach runtime behavior, and manipulate rendering using well-defined lifecycle hooks.

---

## ✨ Features

- 🔌 Plugin system with lifecycle hooks via [`tapable`](https://github.com/webpack/tapable)
- ⚡ Lazy-loaded React components from JSON schema
- ✅ Default + user-defined callback composition (e.g., `onClick`)
- 🛑 `shouldRender` hook to block rendering based on rules
- ⏱️ Render time instrumentation & reporting
- 🔐 Error boundaries to catch render-time crashes
- 🔄 Dynamic runtime asset registration

---

## 🔧 Installation

```bash
npm install
```

## Usage

- Define Your Component Assets

```js
// These are key value pair where the key is the Asset name and value is the Import Path
const assets = {
  text: () => import("./components/builtin/TextComponent"),
  button: () => import("./components/builtin/ButtonComponent"),
  card: () => import("./components/builtin/CardComponent"),
};
```

- Register Assets via Plugin

```js
import { pluginManager } from "./core/PluginManager";
import { createCustomAssetPlugin } from "./plugins/CustomAssetPlugin";

pluginManager.apply(createCustomAssetPlugin(assets));
```

- Register Core Plugins

```js
import { DefaultCallbackPlugin } from "./plugins/DefaultCallbackPlugin";
import { RenderTimingPlugin } from "./plugins/RenderTimingPlugin";
import { GuardPlugin } from "./plugins/GuardPlugin";

pluginManager.apply(DefaultCallbackPlugin);
pluginManager.apply(RenderTimingPlugin);
pluginManager.apply(GuardPlugin);
```

- Render the Schema

```js
const schema = [
  { type: "text", props: { value: "Welcome!" } },
  { type: "button", props: { label: "Click Me", onClick: "$handleClick" } },
  {
    type: "card",
    props: { title: "Card Title", content: "Details...", disabled: false },
  },
];

const context = {
  handleClick: () => alert("Hello from context!"),
};

<DynamicRenderer type={node.type} props={node.props} />;
```

- Built-in Plugins
  - DefaultCallbackPlugin: Composes default handlers (onClick, onChange) with user-defined ones passed in the JSON schema.
  - GuardPlugin - Blocks rendering for certain component types or props via shouldRender.
    RenderTimingPlugin - Measures render time for each component and logs a summary table:
  - StylePlugin - Wraps rendered components in a styled container if styleWrapper prop is provided.

### Example Schema Format

```json
[
  {
    "type": "text",
    "props": {
      "value": "Hello World"
    }
  },
  {
    "type": "button",
    "props": {
      "label": "Click",
      "onClick": "$handleClick"
    }
  }
]
```

### Some Lifecycle Hooks (via Tapable)

| Hook           | Type                       | Purpose                                                                                                                      |
| -------------- | -------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `shouldRender` | `SyncBailHook`             | Decide whether to render a component based on type and props. Return `false` to skip rendering.                              |
| `beforeRender` | `AsyncSeriesHook`          | Called before component is resolved and props are finalized. Ideal for dynamic plugin loading, validation, or prop mutation. |
| `afterRender`  | `AsyncSeriesWaterfallHook` | Called after resolving the component, allowing mutation or wrapping. Return the final React component.                       |
| `register`     | `SyncHook`                 | Called whenever a new asset/component type is registered into the plugin manager.                                            |
