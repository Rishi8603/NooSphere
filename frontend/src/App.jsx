import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Authpage from "./pages/Authpage";
import Layout from "./Components/Layout";
import Homepage from "./pages/Homepage";
import UserProfile from "./pages/UserProfile";
import Settings from "./pages/Settings";
import PostDetail from './pages/PostDetail';
import ProtectedRoute from "./Components/ProtectedRoute";
import FollowersListPage from "./pages/FollowersListPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="/" element={<Homepage />} />
          <Route path="/user/:userId" element={<UserProfile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/posts/:postId" element={<PostDetail />} />
          <Route path="/user/:userId/followers" element={<FollowersListPage />} />
          <Route path="/user/:userId/following" element={<FollowersListPage />} />
        </Route>
        <Route path="/auth" element={<Authpage />} />
        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
    </Router>
  );
};

export default App;