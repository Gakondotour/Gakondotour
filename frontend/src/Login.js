import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MDBBtn } from "mdb-react-ui-kit";
import { ToastContainer, toast } from 'react-custom-alert';
import 'react-custom-alert/dist/index.css';
import Nav from "./Nav";
import Footer from "./Footer";

const Login = () => {
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const navigate = useNavigate();

  const login = async () => {
    try {
      const response = await axios.post("http://localhost:5000/login", {
        username,
        password,
      });
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        navigate("/dashboard");
      } else {
        alert("Invalid credentials");
      }
    } catch (error) {
      console.error("Login failed:", error);
      toast.error(
        "You have entered an incorrect username or password, if you are not the administrator, you will be subject to legal action."
      );
    }
  };

  const loginWithGoogle = () => {
    // Redirect to backend Google OAuth endpoint
    window.location.href = "http://localhost:5000/authorize";
  };

  return (
    <div>
      <Nav />
      <div className="login-form">
        <h1 style={{ color: "#000" }}>Login</h1>
        <p style={{ color: "#4f101a" }}>
          <b>
            Attention: This is a private page. If you are not the admin, please
            do not log in.
          </b>
        </p>
        <input
            id="username"
          type="text"
          placeholder="Username"
          style={{ color: "black" }}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
            id="password"
          type="password"
          placeholder="Password"
          style={{ color: "black" }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div style={{ marginTop: "10px" }}>
          <MDBBtn className="me-2" color="success" onClick={login}>
            Login
          </MDBBtn>
          <MDBBtn color="primary" onClick={loginWithGoogle}>
            Login with Google
          </MDBBtn>
        </div>
      </div>
      <ToastContainer floatingTime={6000} />
      <Footer />
    </div>
  );
};

export default Login;
