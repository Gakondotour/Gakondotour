import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MDBBtn } from "mdb-react-ui-kit";
import Nav from "./Nav";
import Footer from "./Footer";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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
    }
  };

  return (
    <div>
      <Nav />
      <div className="login-form">
        <h1 style={{color:"#000"}}>Login</h1>
        <p style={{color:"#DC4C64"}}><b>
          Attention: This is a private page. If you are not the admin, please do not log in.
        </b></p>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <MDBBtn className="me-1" color="success" onClick={login}>
          Login
        </MDBBtn>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
