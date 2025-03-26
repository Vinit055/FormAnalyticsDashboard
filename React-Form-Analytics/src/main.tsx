import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import UserRegistrationForm from "./RegistrationForm.tsx";
import { Toaster } from "sonner";
import FormSuccess from "./FormSuccess.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Toaster richColors position="top-center" />
      <Routes>
        <Route path="/" element={<UserRegistrationForm />} />
        <Route path="/form-success" element={<FormSuccess />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
