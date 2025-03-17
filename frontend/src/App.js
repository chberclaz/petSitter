import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

// Components
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import PrivateRoute from "./components/routing/PrivateRoute";
import AdminRoute from "./components/routing/AdminRoute";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import Pets from "./pages/Pets";
import AddPet from "./pages/AddPet";
import EditPet from "./pages/EditPet";
import Availability from "./pages/Availability";
import Requests from "./pages/Requests";
import CreateRequest from "./pages/CreateRequest";
import Assignments from "./pages/Assignments";
import PublicProfile from "./pages/PublicProfile";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminCertificates from "./pages/admin/AdminCertificates";
import AdminRequests from "./pages/admin/AdminRequests";
import SittingRequests from "./pages/SittingRequests";
import NotFound from "./pages/NotFound";

// Context
import AuthContext from "./context/AuthContext";
import { getToken, setToken, removeToken } from "./utils/auth";
import api from "./utils/api";

import "./App.css";

const theme = createTheme({
  palette: {
    primary: {
      main: "#4caf50",
    },
    secondary: {
      main: "#ff9800",
    },
  },
});

// Logger component to track route changes
const RouteLogger = () => {
  const location = useLocation();

  useEffect(() => {
    console.log("[Navigation] Route changed:", location.pathname);
  }, [location]);

  return null;
};

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    console.log("[App] Component mounted");
    loadUser();
  }, []);

  const loadUser = async () => {
    console.log("[App] Loading user");
    const token = localStorage.getItem("token");
    console.log("[App] Token in localStorage:", !!token);

    if (!token) {
      console.log("[App] No token found, skipping user load");
      setLoading(false);
      return;
    }

    try {
      console.log("[App] Fetching user data");
      const res = await api.get("/api/auth/me");
      console.log("[App] User data received", {
        userId: res.data?.id,
        userEmail: res.data?.email,
        userRole: res.data?.role,
      });
      setUser(res.data);
      setIsAuthenticated(true);
      console.log("[App] User authenticated");
    } catch (err) {
      console.error("[App] Error loading user:", err);
      console.log("[App] Clearing invalid token");
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
      console.log("[App] Loading completed");
    }
  };

  const login = (token, userData) => {
    console.log("[App] Login function called", {
      hasToken: !!token,
      hasUserData: !!userData,
      userId: userData?.id,
      userEmail: userData?.email,
    });
    localStorage.setItem("token", token);
    setUser(userData);
    setIsAuthenticated(true);
    console.log("[App] Authentication state updated:", true);
  };

  const logout = () => {
    console.log("[App] Logout function called");
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
    console.log("[App] Authentication state updated:", false);
  };

  if (loading) {
    console.log("[App] Still loading, showing loading screen");
    return <div>Loading...</div>;
  }

  console.log("[App] Rendering with auth state:", isAuthenticated);

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <CssBaseline />
        <AuthContext.Provider
          value={{ user, login, logout, isAuthenticated: !!user }}
        >
          <Router>
            <RouteLogger />
            <div className="App">
              <Navbar
                user={user}
                isAuthenticated={isAuthenticated}
                logout={logout}
              />
              <main className="container">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route
                    path="/login"
                    element={
                      isAuthenticated
                        ? (console.log(
                            "[App] User already authenticated, redirecting from login to dashboard"
                          ),
                          (<Navigate to="/dashboard" />))
                        : (console.log("[App] Rendering login page"),
                          (<Login login={login} />))
                    }
                  />
                  <Route
                    path="/register"
                    element={
                      isAuthenticated
                        ? (console.log(
                            "[App] User already authenticated, redirecting from register to dashboard"
                          ),
                          (<Navigate to="/dashboard" />))
                        : (console.log("[App] Rendering register page"),
                          (<Register login={login} />))
                    }
                  />
                  <Route path="/profile/:id" element={<PublicProfile />} />

                  <Route
                    path="/dashboard"
                    element={
                      <PrivateRoute
                        isAuthenticated={isAuthenticated}
                        redirectPath="/login"
                      >
                        <Dashboard />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <PrivateRoute
                        isAuthenticated={isAuthenticated}
                        redirectPath="/login"
                      >
                        <Profile />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/profile/edit"
                    element={
                      <PrivateRoute isAuthenticated={isAuthenticated}>
                        <EditProfile />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/pets"
                    element={
                      <PrivateRoute
                        isAuthenticated={isAuthenticated}
                        redirectPath="/login"
                      >
                        <Pets />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/pets/add"
                    element={
                      <PrivateRoute isAuthenticated={isAuthenticated}>
                        <AddPet />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/pets/edit/:id"
                    element={
                      <PrivateRoute isAuthenticated={isAuthenticated}>
                        <EditPet />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/availability"
                    element={
                      <PrivateRoute
                        isAuthenticated={isAuthenticated}
                        redirectPath="/login"
                      >
                        <Availability />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/requests"
                    element={
                      <PrivateRoute isAuthenticated={isAuthenticated}>
                        <Requests />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/requests/create"
                    element={
                      <PrivateRoute isAuthenticated={isAuthenticated}>
                        <CreateRequest />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/assignments"
                    element={
                      <PrivateRoute isAuthenticated={isAuthenticated}>
                        <Assignments />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/sitting-requests"
                    element={
                      <PrivateRoute
                        isAuthenticated={isAuthenticated}
                        redirectPath="/login"
                      >
                        <SittingRequests />
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path="/admin"
                    element={
                      <AdminRoute
                        isAuthenticated={isAuthenticated}
                        user={user}
                        redirectPath="/dashboard"
                      >
                        <AdminDashboard />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/users"
                    element={
                      <AdminRoute isAuthenticated={isAuthenticated} user={user}>
                        <AdminUsers />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/certificates"
                    element={
                      <AdminRoute isAuthenticated={isAuthenticated} user={user}>
                        <AdminCertificates />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/requests"
                    element={
                      <AdminRoute isAuthenticated={isAuthenticated} user={user}>
                        <AdminRequests />
                      </AdminRoute>
                    }
                  />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </AuthContext.Provider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
