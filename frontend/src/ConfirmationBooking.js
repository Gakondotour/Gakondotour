import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Nav from "./Nav";
import Footer from "./Footer";

const ConfirmationBooking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_BACKEND_URL || "http://127.0.0.1:5000";

  const booking = location.state?.booking;

  if (!booking) {
    return <p>Error: No booking data found. Please go back and try again.</p>;
  }

  const handleConfirm = async () => {
    try {
      const response = await axios.post(`${API_URL}/confirmation_booking`, booking, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 201) {
        alert("Booking confirmed successfully!");
        navigate("/"); // Redirect to home or another relevant page
      } else {
        console.warn(`Unexpected response status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error confirming booking:", error.response?.data || error.message);
      alert("Failed to confirm booking. Please try again.");
    }
  };

  return (
    <div className="confirmation-page">
      <Nav />

      <h2>Confirm Your Booking</h2>
      <div>
        <p><strong>Full Name:</strong> {booking.name}</p>
        <p><strong>Number of People:</strong> {booking.number_of_people}</p>
        <p><strong>Activity:</strong> {booking.activity}</p>
        <p><strong>Date:</strong> {booking.date_time}</p>
        <p><strong>Phone:</strong> {booking.phone}</p>
        <p><strong>Email:</strong> {booking.email}</p>
      </div>
      <div>
        <button onClick={handleConfirm}>Confirm Booking</button>
        <button onClick={() => navigate("/")}>Edit</button>
      </div>

      <Footer />
    </div>
  );
};

export default ConfirmationBooking;
