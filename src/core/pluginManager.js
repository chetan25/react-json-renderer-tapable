// core/PluginManager.js
import {
  SyncHook,
  SyncWaterfallHook,
  AsyncSeriesHook,
  AsyncSeriesWaterfallHook,
  SyncBailHook,
} from "tapable";

export class PluginManager {
  constructor() {
    this.hooks = {
      beforeRender: new AsyncSeriesHook(["type", "props"]),
      afterRender: new AsyncSeriesWaterfallHook(["Component", "type", "props"]),
      register: new SyncHook(["type", "loader"]),
      shouldRender: new SyncBailHook(["type", "props"]),
    };

    this.registry = new Map();
    this.loadedPlugins = new Set();
    this.context = {};
  }

  apply(plugin) {
    plugin.apply(this);
  }

  registerComponent(type, loader) {
    this.registry.set(type, loader);
    this.hooks.register.call(type, loader);
  }

  getComponent(type) {
    return this.registry.get(type);
  }

  async loadAsyncPlugin(name, importFn) {
    if (this.loadedPlugins.has(name)) return;
    const plugin = await importFn();
    plugin.default?.apply(this);
    this.loadedPlugins.add(name);
  }
}

export const pluginManager = new PluginManager();
