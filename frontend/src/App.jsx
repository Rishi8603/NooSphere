import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Authpage from "./pages/Authpage";
import Layout from "./components/Layout";
import Homepage from "./pages/Homepage";
import UserProfile from "./pages/UserProfile";
import Settings from "./pages/Settings";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<Authpage />} />
        
        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="/" element={<Homepage />} />
          <Route path="/user/:userId" element={<UserProfile />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
    </Router>
  );
};

export default App;