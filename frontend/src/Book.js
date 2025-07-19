import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MDBInput, MDBBtn } from "mdb-react-ui-kit";
import DatePicker from "react-datepicker";
import ReCAPTCHA from "react-google-recaptcha";
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
    bookingType: "", // Track whether user selects per day or per hour
  });

  const [bookedDates, setBookedDates] = useState({});
  const [error, setError] = useState("");
  const [price, setPrice] = useState(null); // To track and display the calculated price
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState(null);

  const activityPrices = {
    CONGO_NILE_TRAIL: 50,
    BOAT_TRIP: 60,
    COFFEE_AND_TEA_TOUR: 40,
    ISLAND_TOURS: 120,
  };

  const activityPricesH = {
    RUBONA_HIKING: 10,
    GISENYI_CITY_TOUR: 30,
    RURAL_AREA_TOUR: 40,
    CULTURE_TOURS: 80,
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
      const activityPriceH = activityPricesH[formData.activity] || 0;
      const total =
        activityPrice * parseInt(formData.number_of_people, 10) ||
        activityPriceH * parseInt(formData.number_of_people, 10);
      setPrice(total);
    } else {
      setPrice(null);
    }
  }, [formData.activity, formData.number_of_people]);


  useEffect(() => {
    console.log("Price updated:", price);
  }, [price]);


  const handleRecaptchaChange = (token) => {
    setRecaptchaToken(token);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitted(true);

    if (!recaptchaToken) {
      setError("Please complete the reCAPTCHA verification.");
      return;
    }


    if (formData.activity.length === 0) {
      return; // Stop submission if no activity is selected
    }

    // If booking per hour, send multiple requests (one per selected activity)
    if (
      formData.bookingType === "perHour" &&
      Array.isArray(formData.activity)
    ) {
      try {
        await Promise.all(
          formData.activity.map(async (activity) => {
            await axios.post(
              `${API_URL}`,
              { ...formData, activity }, // Send each activity separately
              { headers: { "Content-Type": "application/json" } }
            );
          })
        );

        navigate("/confirmation_booking", {
          state: { booking: formData, price },
        });
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
    } else {
      // For per day bookings, send a single request
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
    }
  };

  // Check if a date is disabled
  const isDateDisabled = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) {
      return true; // Disable past dates
    }

    // Check if the selected date is already booked for the chosen activity
    const localDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    );
    const formattedDate = localDate.toISOString().split("T")[0];
    if (bookedDates[formattedDate]) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    if (formData.activity && formData.number_of_people) {
      let total = 0;

      if (Array.isArray(formData.activity)) {
        // If booking per hour, sum up all selected activities
        total = formData.activity.reduce(
          (sum, activity) => sum + (activityPricesH[activity] || 0),
          0
        );
      } else {
        total = activityPrices[formData.activity] || 0;
      }

      total *= parseInt(formData.number_of_people, 10) || 0;
      setPrice(total);
    } else {
      setPrice(null);
    }
  }, [formData.activity, formData.number_of_people]);


  return (
    <>
      <form onSubmit={handleSubmit} className="bookingForm" method="POST">
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
              className="selection"
              name="bookingType"
              value={formData.bookingType}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  bookingType: e.target.value,
                  activity: "",
                })
              }
              required
            >
              <option value="">Select Booking Type</option>
              <option value="perDay">Per Day</option>
              <option value="perHour">Per Hour</option>
            </select>
          </div>

          {formData.bookingType === "perDay" && (
            <div className="col-md-6">
              <select
                className="selection"
                name="activity"
                value={formData.activity}
                onChange={(e) =>
                  setFormData({ ...formData, activity: e.target.value })
                }
                required
              >
                <option value="">Select an activity per day</option>
                {Object.keys(activityPrices).map((activity) => (
                  <option key={activity} value={activity}>
                    {activity.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </div>
          )}

          {formData.bookingType === "perHour" && (
            <div className="col-md-6">
              <div className="dropdown">
                <button
                  className="selection"
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)} // Toggle dropdown
                >
                  Select activities per hour
                </button>

                {dropdownOpen && ( // Conditionally show dropdown content
                  <ul className="dropdown-menu show custom-dropdown" style={{ display: "block" }}>
                    {Object.keys(activityPricesH).map((activity) => {
                      const hours =
                        {
                          RUBONA_HIKING: 2,
                          GISENYI_CITY_TOUR: 1,
                          RURAL_AREA_TOUR: 3,
                          CULTURE_TOURS: 2,
                          BANANA_BEER: 2,
                        }[activity] || 1; // Default to 1 hour if not listed

                      return (
                        <li key={activity} className="dropdown-item">
                          <input
                            type="checkbox"
                            value={activity}
                            checked={formData.activity.includes(activity)}
                            onChange={(e) => {
                              const selectedActivities = [...formData.activity];
                              if (e.target.checked) {
                                selectedActivities.push(activity);
                              } else {
                                const index = selectedActivities.indexOf(activity);
                                if (index > -1) {
                                  selectedActivities.splice(index, 1);
                                }
                              }
                              setFormData({
                                ...formData,
                                activity: selectedActivities,
                              });
                            }}
                          />{" "}
                          {activity.replace(/_/g, " ")} {hours}/h
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
              {/* Display validation message if no activity is selected */}
              {formSubmitted && formData.activity.length === 0 && (
                <p className="text-danger">Please select at least one activity.</p>
              )}
            </div>
          )}

          <div className="col-md-6">
            <DatePicker
              className="date"
              selected={
                formData.date_time ? new Date(formData.date_time) : null
              }
              onChange={(date) => {
                const localDate = new Date(
                  date.getTime() - date.getTimezoneOffset() * 60000
                );
                setFormData({
                  ...formData,
                  date_time: localDate.toISOString().split("T")[0],
                });
              }}
              filterDate={(date) => !isDateDisabled(date)}
              placeholderText="DD/MM/YYYY"
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

        {price && (
          <p className="p-message" style={{ color: "#f5e2e3" }}>
            <strong>Total Price: ${price}</strong>
          </p>
        )}

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

        <div style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "30px",
          marginBottom: "20px"
        }}>
          <ReCAPTCHA
            sitekey="6LcWmYgrAAAAAA0NHlBbvNqOge93cNRi3L2OIpIh"
            onChange={handleRecaptchaChange} />
        </div>


      </form>
    </>
  );
};

export default Book;
