import React from "react";

export default function ButtonComponent({ label, onClick, style }) {
  return (
    <button onClick={onClick} style={style}>
      {label}
    </button>
  );
}
