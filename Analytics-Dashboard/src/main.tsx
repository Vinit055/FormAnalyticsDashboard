import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createRoot } from "react-dom/client";
import "./index.css";
import Dashboard from "./components/Dashboard";
import { ThemeProvider } from "./theme/ThemeProvider";
// import Reports from "./components/Reports";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="system" storageKey="form-analytics-theme">
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        {/* <Route path="/reports" element={<Reports />} /> */}
      </Routes>
    </BrowserRouter>
  </ThemeProvider>
);
