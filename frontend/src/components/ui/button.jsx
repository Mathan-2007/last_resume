import React from "react";

export function Button({ className, variant = "default", ...props }) {
  const baseStyle = {
    borderRadius: "0.75rem", // rounded-xl
    padding: "0.5rem 1rem", // px-4 py-2
    fontWeight: 500, // font-medium
    transition: "all 0.2s ease-in-out",
    border: "1px solid transparent",
  };

  const variants = {
    default: {
      backgroundColor: "var(--primary-accent)",
      color: "var(--primary-bg)",
    },
    outline: {
      borderColor: "var(--border-color)",
      backgroundColor: "var(--primary-bg)",
      color: "var(--primary-text)",
    },
  };

  const style = {
    ...baseStyle,
    ...variants[variant],
  };

  return (
    <button
      style={style}
      className={className}
      {...props}
    />
  );
}
