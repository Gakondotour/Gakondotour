import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const Dashboard = () => {
  const [data, setData] = useState([])
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      fetchData();
    }
  }, [token,navigate]); // Added for a dependencies to useEffect

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(response.data.booking_list || []);
    } catch (error) {
      console.error(error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token"); // Clear the token
    navigate("/login"); // Redirect to the login page
  };

  const deleteData = async (id) => {
    try {
      await axios.delete("http://localhost:5000/dashboard", {
        headers: { Authorization: `Bearer ${token}` }, data:{id}
      });
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <button onClick={logout}>Logout</button>
      <ul>
        {data.map((x) => (
          <li key={x.id}>
            <strong>Full Name:</strong> {x.name} <br />
            <strong>Number of People:</strong> {x.number_of_people} <br />
            <strong>Activity:</strong> {x.activity} <br />
            <strong>Date:</strong> {x.date_time} <br />
            <strong>Phone:</strong> {x.phone} <br />
            <strong>Email:</strong> {x.email} <br />
            <button onClick={() => deleteData(x.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
