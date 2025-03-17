import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

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

// Context
import AuthContext from "./context/AuthContext";
import { getToken, setToken, removeToken } from "./utils/auth";
import api from "./utils/api";

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

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = getToken();

      if (token) {
        try {
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          const res = await api.get("/api/users/me");
          setUser(res.data);
        } catch (err) {
          console.error("Error loading user:", err);
          removeToken();
        }
      }

      setLoading(false);
    };

    loadUser();
  }, []);

  const login = (userData, token) => {
    setToken(token);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setUser(userData);
  };

  const logout = () => {
    removeToken();
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated: !!user }}
    >
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Navbar />
          <main style={{ minHeight: "calc(100vh - 128px)", padding: "20px" }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/login"
                element={user ? <Navigate to="/dashboard" /> : <Login />}
              />
              <Route
                path="/register"
                element={user ? <Navigate to="/dashboard" /> : <Register />}
              />
              <Route path="/profile/:id" element={<PublicProfile />} />

              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile/edit"
                element={
                  <PrivateRoute>
                    <EditProfile />
                  </PrivateRoute>
                }
              />
              <Route
                path="/pets"
                element={
                  <PrivateRoute>
                    <Pets />
                  </PrivateRoute>
                }
              />
              <Route
                path="/pets/add"
                element={
                  <PrivateRoute>
                    <AddPet />
                  </PrivateRoute>
                }
              />
              <Route
                path="/pets/edit/:id"
                element={
                  <PrivateRoute>
                    <EditPet />
                  </PrivateRoute>
                }
              />
              <Route
                path="/availability"
                element={
                  <PrivateRoute>
                    <Availability />
                  </PrivateRoute>
                }
              />
              <Route
                path="/requests"
                element={
                  <PrivateRoute>
                    <Requests />
                  </PrivateRoute>
                }
              />
              <Route
                path="/requests/create"
                element={
                  <PrivateRoute>
                    <CreateRequest />
                  </PrivateRoute>
                }
              />
              <Route
                path="/assignments"
                element={
                  <PrivateRoute>
                    <Assignments />
                  </PrivateRoute>
                }
              />

              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <AdminRoute>
                    <AdminUsers />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/certificates"
                element={
                  <AdminRoute>
                    <AdminCertificates />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/requests"
                element={
                  <AdminRoute>
                    <AdminRequests />
                  </AdminRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </Router>
      </ThemeProvider>
    </AuthContext.Provider>
  );
}

export default App;
