export function createCustomAssetPlugin(assetMap) {
  return {
    apply(manager) {
      for (const [type, loader] of Object.entries(assetMap)) {
        manager.registerComponent(type, loader);
      }
    },
  };
}
