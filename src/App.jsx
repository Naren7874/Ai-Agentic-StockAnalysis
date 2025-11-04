import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import Dashboard from "./pages/Dashboard";
import AiAgent from "./pages/AIAgent";
import AnalysisPage from "./pages/AnalysisPage";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ProtectedRoute from "./lib/ProtectedRoute";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ai-agent"
                element={
                  <ProtectedRoute>
                    <AiAgent />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/analysis"
                element={
                  <ProtectedRoute>
                    <AnalysisPage />
                  </ProtectedRoute>
                }
              />
              {/* Redirect all unknown routes to home */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;