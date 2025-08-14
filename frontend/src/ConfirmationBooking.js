import { useRef, useState } from "react"; // Import hooks at the top
import { useLocation, useNavigate } from "react-router-dom";
import { MDBBtn } from "mdb-react-ui-kit";
import axios from "axios";
import { ToastContainer, toast } from "react-custom-alert";
import "react-custom-alert/dist/index.css";
import emailjs from "emailjs-com";
import Nav from "./Nav";
import Footer from "./Footer";

const ConfirmationBooking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // const [redirect, setRedirect] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const API_URL = process.env.REACT_APP_BACKEND_URL || "http://127.0.0.1:5000";
  // const formRef = useRef(); // Declare all hooks at the top level

  const booking = location.state?.booking || {};
  const price = location.state?.price || 0;

  const sendEmail = async function () {
      const templateParams = {
          name: booking.name,
          email: booking.email,
          price: price,
      };
      const response = await axios.post(API_URL+'/sendmail', templateParams)
      if (response.status >= 400) {
          console.error(response.data)
          return;
      }
      console.log('Mail sent.')
  }

  const sendEmailViaEmailJs = async () => {
    if (!booking || !booking.email) {
      toast.error("Invalid booking details. Cannot send email.");
      return;
    }

    const templateParams = {
      name: booking.name,
      email: booking.email,
      price: price,
    };

    try {
      const result = await emailjs.send(
        "service_5jhkeo7", // Your EmailJS Service ID
        "template_p2u0e6m", // Your EmailJS Template ID
        templateParams,
        "rzYru0Szrq0A6llqW" // Your Public Key
      );
      console.log("Sending email with:", templateParams);
      console.log("Email successfully sent:", result.text);
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Invalid booking details. Cannot send email.");
    }
  };


  //function to confirm booking
  const handleConfirm = async () => {
    try {
      localStorage.setItem(`price_${booking.email}`, price); // Save price in localStorage
      
      const response = await axios.post(
        `${API_URL}/confirmation_booking`,
        { ...booking, price },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 201) {
        setIsDisabled(true);
        sendEmail();

        toast.success(
          <div style={{ width: "100%" }}>
            <p>
              Thank you, your booking has been successfully confirmed and you
              will receive an email within 24 hours to guide you through the
              payment steps.
            </p>
            <button
              onClick={() => {
                navigate("/"); // Redirect directly to the home page
              }}
              style={{
                textAlign: "center",
                backgroundColor: "#9BBF6A",
                color: "white",
                padding: "10px 10px",
                border: "none",
                cursor: "pointer",
                marginTop: "10px",
              }}
            >
              OK
            </button>
          </div>
        );
      } else {
        console.warn(`Unexpected response status: ${response.status}`);
      }
    } catch (error) {
      console.error(
        "Error confirming booking:",
        error.response?.data || error.message
      );
      toast.error("Failed to confirm booking. Please try again.");
    }
  };

  // Early return moved below hook declarations
  if (!booking) {
    return <p>Error: No booking data found. Please go back and try again.</p>;
  }

  return (
    <div>
      <Nav />
      <div className="confirmationPage">
        <h2
          style={{
            color: "black",
            marginBottom: "5vh",
            marginLeft: "2vw",
            marginTop: "3vh",
          }}
        >
          Confirm Your Booking
        </h2>
        <div style={{ marginLeft: "2vw" }}>
          <p style={{ color: "black" }}>
            <strong style={{ padding: "10px" }}>Full Name:</strong>{" "}
            {booking.name}
          </p>
          <p style={{ color: "black" }}>
            <strong style={{ padding: "10px" }}>Number of People:</strong>{" "}
            {booking.number_of_people}
          </p>
          <p style={{ color: "black" }}>
            <strong style={{ padding: "10px" }}>Activity:</strong>{" "}
            {Array.isArray(booking.activity)
              ? booking.activity.map((act) => act.replace(/_/g, " ")).join(", ")
              : booking.activity.replace(/_/g, " ")}
          </p>
          <p style={{ color: "black" }}>
            <strong style={{ padding: "10px" }}>Date:</strong>{" "}
            {booking.date_time}
          </p>
          <p style={{ color: "black" }}>
            <strong style={{ padding: "10px" }}>Phone:</strong> {booking.phone}
          </p>
          <p style={{ color: "black" }}>
            <strong style={{ padding: "10px" }}>Email:</strong> {booking.email}
          </p>
          <h2 style={{ color: "darkRed" }}>Total Price: ${price}</h2>
          <p style={{ color: "darkRed" }}>
            <b>
              Payment and cancellation of the booking will be made through the
              email you will receive.
            </b>
          </p>
        </div>
        <div style={{ margin: "25px" }}>
          <MDBBtn
            className="me-1"
            style={{
              color: "#fff",
              backgroundColor: "#9BBF6A",
              margin: "15px auto",
            }}
            type="submit"
            onClick={handleConfirm}
            disabled={isDisabled}
          >
            Confirm Booking
          </MDBBtn>
          <MDBBtn
            className="me-1"
            style={{
              color: "#fff",
              backgroundColor: "grey",
              margin: "15px auto",
            }}
            type="submit"
            onClick={() => navigate("/")}
          >
            Edit Booking
          </MDBBtn>
        </div>
      </div>
      <ToastContainer floatingTime={500000} />
      <Footer />
    </div>
  );
};

export default ConfirmationBooking;
