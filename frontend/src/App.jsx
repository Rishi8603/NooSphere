import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/Signup"></Route>
        <Route path="/Login"></Route>
        <Route path="/Dashboard"></Route>
      </Routes>
    </Router>
  );
}

