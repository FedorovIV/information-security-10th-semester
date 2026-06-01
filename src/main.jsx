import React from "react";
import { createRoot } from "react-dom/client";
import { MDXProvider } from "@mdx-js/react";
import App from "./App.jsx";
import "./styles.css";

const components = {
  a: ({ href = "", children, ...props }) => {
    const isExternal = /^https?:\/\//.test(href);
    return (
      <a
        href={href}
        target={isExternal || href.endsWith(".pdf") ? "_blank" : undefined}
        rel={isExternal || href.endsWith(".pdf") ? "noreferrer" : undefined}
        {...props}
      >
        {children}
      </a>
    );
  },
  table: (props) => (
    <div className="tableWrap">
      <table {...props} />
    </div>
  )
};

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <MDXProvider components={components}>
      <App />
    </MDXProvider>
  </React.StrictMode>
);
