// App.tsx
import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import "./App.css";
import AdminRoutes from "./routes/client/AdminRoutes";
import UserRoutes from "./routes/client/UserRoutes";

const App: React.FC = () => {
  return (
    <Router>
<Toaster
  position="bottom-right"
  richColors
  closeButton
  expand
  toastOptions={{
    style: {
      marginRight: "12px",
      fontSize: "0.95rem",
      padding: "1rem 1.25rem",
      maxWidth: "26rem",
      borderRadius: "14px",
      background: "#111111",
      color: "#ffffff",
      border: "1px solid #222",
      boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
      whiteSpace: "normal",
      wordBreak: "break-word",
      overflowWrap: "anywhere",
    },
  }}
/>


      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/*" element={<UserRoutes />} />
          <Route path="/admin/*" element={<AdminRoutes />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
