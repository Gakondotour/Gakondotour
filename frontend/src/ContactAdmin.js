import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MDBBtn, MDBNavbarLink } from "mdb-react-ui-kit";

const ContactAdmin = () => {
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
      const response = await axios.get("http://localhost:5000/contact_admin", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setData(response.data.contact_list || []);
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
        logoutTimeout = setTimeout(logout, 25000);
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
      await axios.delete("http://localhost:5000/contact_admin", {
        headers: { Authorization: `Bearer ${token}` },
        data: { id },
      });
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ backgroundColor: "#fff" }}>
      <h1 style={{ textAlign: "center" }}>messages</h1>
      <table className="tableStyle">
        <tr>
          <th>Full Name</th>
          <th>Email</th>
          <th>Text</th>
          <th>Deletion</th>
        </tr>

        {data.length > 0 ? (
            data.map((x) => (
          <tr key={x.id}>
            <td>{x.name}</td>
            <td>{x.email}</td>
            <td>{x.text}</td>
            <td>
              <MDBBtn
                className="me-1"
                color="danger"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  const confirmBox = window.confirm(
                    "Do you really want to delete this Booking?"
                  );
                  if (confirmBox === true) {
                    deleteData(x.id);
                  }
                }}
              >
                Delete
              </MDBBtn>
            </td>
          </tr>
        ))): null}
      </table>

      <MDBBtn
        className="me-1"
        color="success"
        style={{ margin: "10px", cursor: "pointer", position:'absolute', bottom:"0%"  }}
        onClick={logout}
      >
        Logout
      </MDBBtn>
      <MDBNavbarLink
        style={{ margin: "10px", cursor: "pointer", color: "darkGreen"}}
        className="link-hover"
        href="/Dashboard"
      >
        <strong>Dashboard</strong>
      </MDBNavbarLink>
    </div>
  );
};

export default ContactAdmin;
