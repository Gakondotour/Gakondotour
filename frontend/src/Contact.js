import { useEffect, useState } from "react";
import axios from "axios";
import { MDBInput, MDBTextArea, MDBBtn } from "mdb-react-ui-kit";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import Nav from "./Nav";

const Contact = () => {
  const API_URL = process.env.REACT_APP_BACKEND_URL || "http://127.0.0.1:5000/contact"; 
  const [dataContact, setDataContact] = useState({ name: "", email: "", text: "" });
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
         if (response.status === 200) {
          setDataContact(data || {});
        };
      } catch (err) {
        console.error("Error fetching contact data:", err);
      }
    };
    
    fetchData();
  }, [API_URL]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(API_URL, dataContact, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 201) {
        navigate("/", { state: {message:'Thank you, We received your message and we will get back to you as soon as possible.'} });
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to send the request. Please try again.");
    }
  }


  return (
    <div style={{ backgroundColor: "white" }}>
      <Nav />
      <p style={{ color: "black" }}>
        <b>Send us a message, and we will answer you as soon as possible.</b>
      </p>

      <form onSubmit={handleSubmit} style={{ color: "black", margin: "20px" }}>
        <div className="row">
          <div className="col-md-3">
            <MDBInput
              label={<span style={{ color: "black" }}>Full name</span>}
              id="form1"
              style={{ color: "black", margin:'10px'  }}
              type="text"
              name="name"
              placeholder="Full name"
              value={dataContact.name}
              onChange={(e) => setDataContact({ ...dataContact, name: e.target.value })}
              required
            />
          </div>

          <div className="col-md-3">
            <MDBInput
              label={<span style={{ color: "black" }}>Email</span>}
              id="typeEmail"
              style={{ color: "black", margin:'10px' }}
              type="email"
              name="email"
              placeholder="example@example.com"
              value={dataContact.email}
              onChange={(e) => setDataContact({ ...dataContact, email: e.target.value })}
              required
            />
          </div>

          <div className="col-md-10">
            <MDBTextArea
              label={<span style={{ color: "black"}}>Message</span>}
              id="textAreaExample"
              rows="12"
              style={{ color: "black", margin:'10px'}}
              type='textArea'
              name='textArea'
              placeholder="Type here ....."
              value={dataContact.text}
              onChange={(e) => setDataContact({ ...dataContact, text: e.target.value })}
              required
            />
          </div>
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <MDBBtn
          className="me-1"
          style={{ color: "#fff", backgroundColor: "#9BBF6A" }}
          type="submit"
        >
          Send
        </MDBBtn>
      </form>
      <Footer />
    </div>
    
  );
};

export default Contact;