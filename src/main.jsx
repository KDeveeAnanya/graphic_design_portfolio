import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "@fontsource-variable/bricolage-grotesque/wdth.css";
import "@fontsource/anton/400.css";
import "@fontsource/instrument-sans/400.css";
import "@fontsource/instrument-sans/600.css";
import "@fontsource/instrument-serif/400.css";
import "@fontsource/jetbrains-mono/400.css";
import "./styles/global.css";
import "./styles/hero.css";
import "./styles/sections.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);

console.info(
  "%c~/creative-space %c— hi. Press Ctrl/Cmd + K to explore.",
  "color:#CBF498;font-family:monospace",
  "color:inherit"
);
