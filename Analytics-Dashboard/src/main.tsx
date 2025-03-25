import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Dashboard from "./components/Dashboard";
import { ThemeProvider } from "./theme/ThemeProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="form-analytics-theme">
      <Dashboard />
    </ThemeProvider>
  </StrictMode>
);
