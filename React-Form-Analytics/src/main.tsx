import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import UserRegistrationForm from "./RegistrationForm.tsx";
import { Toaster } from "sonner";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Toaster richColors position="top-center" />
    <UserRegistrationForm />
  </StrictMode>
);