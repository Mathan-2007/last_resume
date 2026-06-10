import React from "react";

export function Card({ className, ...props }) {
  const style = {
    borderRadius: "1rem", // rounded-2xl
    border: "1px solid var(--border-color)",
    backgroundColor: "var(--primary-bg)",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)", // shadow-md
    padding: "1rem", // p-4
    transition: "box-shadow 0.3s ease-in-out",
  };

  return <div style={style} className={className} {...props} />;
}

export function CardHeader({ className, ...props }) {
  const style = {
    marginBottom: "0.5rem", // mb-2
    fontWeight: 600, // font-semibold
    fontSize: "1.25rem", // text-xl
  };

  return <div style={style} className={className} {...props} />;
}

export function CardContent({ className, ...props }) {
  const style = {
    color: "var(--primary-text)",
  };

  return <div style={style} className={className} {...props} />;
}

export function CardFooter({ className, ...props }) {
  const style = {
    marginTop: "0.75rem", // mt-3
    fontSize: "0.875rem", // text-sm
    color: "#6b7280", // text-gray-500
  };

  return <div style={style} className={className} {...props} />;
}
