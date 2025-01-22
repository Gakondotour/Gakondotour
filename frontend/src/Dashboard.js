import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MDBBtn } from "mdb-react-ui-kit";


const Dashboard = () => {
  const [data, setData] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  let logoutTimeout;

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      fetchData();
    }

    // Clear timeout if user navigates away
    return () => clearTimeout(logoutTimeout);
  }, [token, navigate]);

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
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        logoutTimeout = setTimeout(logout, 5000000);
      } else {
        clearTimeout(logoutTimeout);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  const deleteData = async (id) => {
    try {
      await axios.delete("http://localhost:5000/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
        data: { id },
      });
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{backgroundColor:"#fff"}}>
      <h1 style={{ textAlign: "center" }}>Admin Dashboard</h1>
      <table className="tableStyle">
          <tr>
            <th>Full Name</th>
            <th>Number of People</th>
            <th>Activity</th>
            <th>Date</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Price</th>
            <th>Deletion</th>
          </tr>

          {data.map((x) => (
            <tr key={x.id}>
              <td>{x.name}</td>
              <td>{x.number_of_people}</td>
              <td>{x.activity}</td>
              <td>{x.date_time}</td>
              <td>{x.phone}</td>
              <td>{x.email}</td>
              <td>{x.price}</td>
              <td>
                <button className='buttonStyle' onClick={() => deleteData(x.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
      </table>

  <MDBBtn className="me-1" color="success" style={{margin:"10px", cursor:"pointer" }}  onClick={logout}>
        Logout
      </MDBBtn>
    </div>
  );
};

export default Dashboard;