import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthContextProvider } from "./components/auth/AuthContextProvider.tsx";
import { StudentContextProvider } from "./components/student/StudentContextProvider.tsx";
import { StaffContextProvider } from "./components/staff/StaffContextProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <AuthContextProvider>
      <StudentContextProvider>
        <StaffContextProvider>
          <StrictMode>
            <App />
          </StrictMode>
        </StaffContextProvider>
      </StudentContextProvider>
    </AuthContextProvider>
  </BrowserRouter>
);
