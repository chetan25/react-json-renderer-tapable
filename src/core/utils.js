export function composeHandlers(defaultFn, userFn) {
  if (!userFn) return defaultFn;
  return (...args) => {
    defaultFn?.(...args);
    userFn?.(...args);
  };
}
