import React from "react";

// Inline so there is no icon package in the bundle. Both inherit currentColor.

export function ArrowUpRight(props) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
      <path d="M3 13 13 3M5 3h8v8" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function ArrowDown(props) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
      <path d="M8 2v12M3 9l5 5 5-5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
