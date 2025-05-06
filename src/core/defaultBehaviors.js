export const defaultHandlers = {
  onClick: (props) => {
    console.log(`Default onClick fired for:`, props?.label || "unknown");
  },
  onChange: (e) => {
    console.log(`Default onChange:`, e?.target?.value);
  },
};
