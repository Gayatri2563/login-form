import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MultistepForm from "./components/MultistepForm";
import Dashboard from "./pages/Dashboard";
import { UserProvider } from "./context/UserContext";

const App: React.FC = () => {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MultistepForm />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;
