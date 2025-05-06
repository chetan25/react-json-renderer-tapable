import React from "react";

export default function CardComponent({ title, content, footer, style }) {
  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: 8,
        padding: 16,
        ...style,
      }}
    >
      {title && <h3>{title}</h3>}
      {content && <p>{content}</p>}
      {footer && <small>{footer}</small>}
    </div>
  );
}
