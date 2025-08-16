import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MDBBtn, MDBNavbarLink } from "mdb-react-ui-kit";

const API_URL = process.env.REACT_APP_BACKEND_URL;

const ContactAdmin = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

   if (!token) {
        navigate('login')
    }

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get(API_URL + "/contact_admin", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(response.data.contact_list || []);
    } catch (error) {
      console.error(error);
    }
  }, [token]);

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      fetchData();
    }
  }, [token, navigate, fetchData]);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const deleteData = async (id) => {
    try {
      await axios.delete(API_URL + "/contact_admin", {
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
      <h1 style={{ textAlign: "center" }}>Messages</h1>
      <table
        className="tableStyle"
        style={{ borderCollapse: "collapse", width: "100%" }}
      >
        <thead>
          <tr>
            <th style={{ border: "2px solid black", padding: "8px" }}>
              Full Name
            </th>
            <th style={{ border: "2px solid black", padding: "8px" }}>Email</th>
            <th style={{ border: "2px solid black", padding: "8px" }}>Text</th>
            <th style={{ border: "2px solid black", padding: "8px" }}>
              Deletion
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((x) => (
            <tr key={x.id}>
              <td style={{ border: "2px solid black", padding: "8px" }}>
                {x.name}
              </td>
              <td style={{ border: "2px solid black", padding: "8px" }}>
                {x.email}
              </td>
              <td style={{ border: "2px solid black", padding: "8px" }}>
                {x.text}
              </td>
              <td style={{ border: "2px solid black", padding: "8px" }}>
                <MDBBtn
                  className="me-1"
                  color="danger"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    if (
                      window.confirm(
                        "Do you really want to delete this message?"
                      )
                    ) {
                      deleteData(x.id);
                    }
                  }}
                >
                  Delete
                </MDBBtn>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <MDBBtn
        className="me-1"
        color="success"
        style={{
          margin: "10px",
          cursor: "pointer",
          position: "absolute",
          bottom: "0%",
        }}
        onClick={logout}
      >
        Logout
      </MDBBtn>
      <MDBNavbarLink
        style={{ margin: "10px", cursor: "pointer", color: "darkGreen" }}
        className="link-hover"
        href="/dashboard"
      >
        <strong>Dashboard</strong>
      </MDBNavbarLink>
    </div>
  );
};

export default ContactAdmin;
