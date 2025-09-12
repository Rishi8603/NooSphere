import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Authpage from "./pages/Authpage";
// import Dashboard from "./pages/Dashboard";
import Homepage from "./pages/Homepage";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <Router>
      <Routes>

        <Route path="/auth" element={<Authpage />} />
        
        <Route path="/"
          element={
            <ProtectedRoute>
              <Homepage/>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
    </Router>
  );
};

export default App;