import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MDBInput, MDBBtn } from "mdb-react-ui-kit";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Book = () => {
  const API_URL = process.env.REACT_APP_BACKEND_URL || "http://127.0.0.1:5000"; // Flask API URL
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    number_of_people: "",
    activity: "",
    date_time: "",
    phone: "",
    email: "",
  });

  const [bookedDates, setBookedDates] = useState({});
  const [error, setError] = useState("");
  const [price, setPrice] = useState(null); // To track and display the calculated price

  const activityPrices = {
    RUBONA_HIKING: 50,
    CONGO_NILE_TRAIL: 75,
    GISENYI_CITY_TOUR: 40,
    BOAT_TRIP: 100,
    COFFEE_AND_TEA_TOUR: 60,
    RURAL_AREA_TOUR: 45,
    CULTURE_TOURS: 80,
    ISLAND_TOURS: 90,
    BANANA_BEER_DEMONSTRATION: 30,
  };

  useEffect(() => {
    // Fetch booked dates from the backend
    const fetchBookedDates = async () => {
      try {
        const response = await axios.get(API_URL);
        if (response.status === 200) {
          setBookedDates(response.data.booked_dates || {});
        }
      } catch (err) {
        console.error("Failed to fetch booked dates:", err.message);
      }
    };
    fetchBookedDates();
  }, []);

  useEffect(() => {
    // Update price whenever activity or number of people changes
    if (formData.activity && formData.number_of_people) {
      const activityPrice = activityPrices[formData.activity] || 0;
      const total = activityPrice * parseInt(formData.number_of_people, 10);
      setPrice(total);
    } else {
      setPrice(null);
    }
  }, [formData.activity, formData.number_of_people]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API_URL}`, formData, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 201) {
        navigate("/confirmation_booking", {
          state: { booking: formData, price },
        });
      } else {
        console.warn(`Unexpected response status: ${response.status}`);
      }
    } catch (error) {
      console.error(
        "Error creating booking:",
        error.response?.data || error.message
      );
      setError(
        error.response?.data?.message ||
          "Failed to create booking. Please try again."
      );
    }
  };

  // Check if a date is disabled
  const isDateDisabled = (date) => {
    const today = new Date();
    if (date < today) {
      return true; // Disable past dates
    }

    // Check if the selected date is already booked for the chosen activity
    const formattedDate = date.toISOString().split("T")[0];
    if (bookedDates[formattedDate]) {
      return true;
    }
    return false;
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="bookingForm">
        <div className="row">
          <div className="col-md-6">
            <MDBInput
              className="custom-btn-white"
              label="Full name"
              id="form1"
              type="text"
              name="name"
              placeholder="Full name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          <div className="col-md-6">
            <MDBInput
              className="custom-btn-white"
              label="How many persons"
              id="typeNumber"
              type="number"
              name="number_of_people"
              placeholder="enter a number"
              value={formData.number_of_people}
              onChange={(e) =>
                setFormData({ ...formData, number_of_people: e.target.value })
              }
              required
            />
          </div>

          <div className="col-md-6">
            <select
              label="Activities"
              className="selection"
              name="activity"
              value={formData.activity}
              onChange={(e) =>
                setFormData({ ...formData, activity: e.target.value })
              }
              required
            >
              <option style={{ color: "#dddddd" }} value="">
                Select an activity
              </option>
              {Object.keys(activityPrices).map((activity) => (
                <option
                  key={activity}
                  style={{ color: "#fff" }}
                  value={activity}
                >
                  {activity.replace(/_/g, " ").toLowerCase()}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-6">
            <DatePicker
              className="selection"
              selected={
                formData.date_time ? new Date(formData.date_time) : null
              }
              onChange={(date) =>
                setFormData({
                  ...formData,
                  date_time: date.toISOString().split("T")[0],
                })
              }
              filterDate={(date) => !isDateDisabled(date)}
              placeholderText="Select a date"
              required
            />
          </div>

          <div className="col-md-6">
            <MDBInput
              label="phone"
              id="typeNumber"
              className="custom-btn-white"
              type="tel"
              name="phone"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              required
            />
          </div>

          <div className="col-md-6">
            <MDBInput
              label="Email"
              id="typeEmail"
              type="email"
              name="email"
              className="custom-btn-white"
              placeholder="example@example.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            ></MDBInput>
          </div>
        </div>

        {price && <p className="p-message">Total Price: ${price}</p>}
        {error && <p className="error-message">{error}</p>}

        <MDBBtn
          className="me-1"
          style={{ color: "#fff", backgroundColor: "#9BBF6A" }}
          type="submit"
        >
          Book
        </MDBBtn>
        <MDBBtn
          className="me-1"
          style={{ color: "#fff", backgroundColor: "#E57373" }}
          type="reset"
          onClick={() => {
            setFormData({
              name: "",
              number_of_people: "",
              activity: "",
              date_time: "",
              phone: "",
              email: "",
            });
            setPrice(null); // Reset the price
          }}
        >
          Reset
        </MDBBtn>
      </form>
    </>
  );
};

export default Book;
