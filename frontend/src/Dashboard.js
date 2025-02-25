import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MDBBtn, MDBNavbarLink } from "mdb-react-ui-kit";

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [price, setPrice] = useState([]);
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
  
      const bookingList = response.data.booking_list || []; //  Correct variable name
  
      // Retrieve price from localStorage using email as the key
      const updatedBookings = bookingList.map((booking) => ({
        ...booking,
        price: localStorage.getItem(`price_${booking.email}`) || "N/A", // Default to "N/A" if not found
      }));
  
      setData(updatedBookings); //  Update state correctly
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
    <div style={{ backgroundColor: "#fff" }}>
      <h1 style={{ textAlign: "center" }}>Admin Dashboard</h1>
      <table className="tableStyle" style={{ borderCollapse: "collapse", width: "100%" }}>
        <tr>
          <th style={{ border: "2px solid black", padding: "8px" }}>Full Name</th>
          <th style={{ border: "2px solid black", padding: "8px" }}>Number of People</th>
          <th style={{ border: "2px solid black", padding: "8px" }}>Activity</th>
          <th style={{ border: "2px solid black", padding: "8px" }}>Date</th>
          <th style={{ border: "2px solid black", padding: "8px" }}>Phone</th>
          <th style={{ border: "2px solid black", padding: "8px" }}>Email</th>
          <th style={{ border: "2px solid black", padding: "8px" }}>Price</th>
          <th style={{ border: "2px solid black", padding: "8px" }}>Deletion</th>
        </tr>

        {data.map((x) => (
          <tr key={x.id}>
            <td style={{ border: "2px solid black", padding: "8px" }}>{x.name}</td>
            <td style={{ border: "2px solid black", padding: "8px" }}>{x.number_of_people}</td>
            <td style={{ border: "2px solid black", padding: "8px" }}>{Array.isArray(x.activity)
              ? x.activity.map((act) => act.replace(/_/g, " ")).join(", ")
              : x.activity.replace(/_/g, " ")}</td>
            <td style={{ border: "2px solid black", padding: "8px" }}>{x.date_time}</td>
            <td style={{ border: "2px solid black", padding: "8px" }}>{x.phone}</td>
            <td style={{ border: "2px solid black", padding: "8px" }}>{x.email}</td>
            <td style={{ border: "2px solid black", padding: "8px" }}>{x.price ? `$${x.price}` : "NON"}</td>
            <td style={{ border: "2px solid black", padding: "8px" }}>
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
        ))}
      </table>

      <MDBBtn
        className="me-1"
        color="success"
        style={{ margin: "10px", cursor: "pointer", position:'absolute', bottom:"0%" }}
        onClick={logout}
      >
        Logout
      </MDBBtn>
      <MDBNavbarLink
        style={{ margin: "10px", cursor: "pointer", color: "darkGreen"}}
        className="link-hover"
        href="/contact_admin"
      >
        <strong>Texts</strong>
      </MDBNavbarLink>
    </div>
  );
};

export default Dashboard;
