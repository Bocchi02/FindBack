import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import axios from "axios";

import Login from "./views/Login";
import Register from "./views/Register";
import UserDashboard from "./views/UserDashboard";
import AdminDashboard from "./views/AdminDashboard";

function App() {
  const [user, setUser] = useState(null);

  // ------------------------
  // RESTORE SESSION
  // ------------------------
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      axios.defaults.headers.common["Authorization"] = "Bearer " + savedToken;
    }
  }, []);

  // ------------------------
  // LOGIN
  // ------------------------
  const handleLogin = (data) => {
    setUser(data.user);
    axios.defaults.headers.common["Authorization"] = "Bearer " + data.token;

    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("token", data.token);
  };

  // ------------------------
  // LOGOUT
  // ------------------------
  const handleLogout = () => {
    setUser(null);
    delete axios.defaults.headers.common["Authorization"];

    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <Router>
      <Routes>
        {/* AUTH */}
        <Route
          path="/login"
          element={
            !user ? <Login onLogin={handleLogin} /> : <Navigate to="/" />
          }
        />

        <Route
          path="/register"
          element={!user ? <Register /> : <Navigate to="/" />}
        />

        {/* DASHBOARD */}
        <Route
          path="/"
          element={
            user ? (
              user.role === "admin" ? (
                <AdminDashboard user={user} onLogout={handleLogout} />
              ) : (
                <UserDashboard user={user} onLogout={handleLogout} />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
