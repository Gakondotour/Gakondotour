import { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { MDBInput, MDBBtn } from 'mdb-react-ui-kit';


const Book = () => {

    const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://127.0.0.1:5000';  // Flask API URL
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        name: "",
        number_of_people: "",
        activity: "",
        date_time: "",
        phone: "",
        email: "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const response = await axios.post(`${API_URL}`, formData,
                {headers: { 'Content-Type': 'application/json' }}
            );
    
            if (response.status === 201) {
                navigate('/confirmation_booking', { state: { booking: formData } });
            } else {
                console.warn(`Unexpected response status: ${response.status}`);
            }
        } catch (error) {
            console.error("Error creating booking:", error.response?.data || error.message);
            alert("Failed to create booking. Please check your input.");
        }
    };
    
    
    return (
        <>
           <form onSubmit={handleSubmit} className="bookingForm">
           <div className="row">
           <div className="col-md-6">
            <MDBInput className="custom-btn-white" label="Full name" id="form1" 
            type="text"
            name="name"
            placeholder="Full name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name:e.target.value})}
            required 
            />
            </div>

            <div className="col-md-6">
            <MDBInput className="custom-btn-white" label="How many persons" id="typeNumber" 
            type="number" 
            name="number_of_people"
            placeholder="inter a number" 
            value={formData.number_of_people}
            onChange={(e) => setFormData({...formData, number_of_people:e.target.value})}
            required
            />
            </div>

            <div className="col-md-6">
        <select 
        label="Activities"
        className="selection custom-btn-white"
          name="activity"
          value={formData.activity}
          onChange={(e) => setFormData({...formData, activity:e.target.value})}
          required
        >
          <option value="">Select an activity</option>
          <option value="RUBONA_HIKING">Rubona hiking</option>
          <option value="CONGO_NILE_TRAIL">Congo Nile trail</option>
          <option value="GISENYI_CITY_TOUR">Gisenyi city tour</option>
          <option value="BOAT_TRIP">Boat trip</option>
          <option value="COFFEE_AND_TEA_TOUR">Coffee and tea tour</option>
          <option value="RURAL_AREA_TOUR">Rural area tour</option>
          <option value="CULTURE_TOURS">Culture tours</option>
          <option value="ISLAND_TOURS">Island tours</option>
          <option value="BANANA_BEER_DEMONSTRATION">Banana beer demonstration</option>
        </select>
      </div>

      <div className="col-md-6">
        <MDBInput className="custom-btn-white"
          label="Date"
          type="date"
          name="date_time"
          value={formData.date_time}
          onChange={(e) => setFormData({ ...formData, date_time: e.target.value })}
          required
        />
    </div>

    <div className="col-md-6">
            <MDBInput label="phone" id="typeNumber" className="custom-btn-white"
            type="number" 
            name="phone"
             placeholder="+00 000000000" 
             value={formData.phone}
             onChange={(e) => setFormData({...formData, phone:e.target.value})}
             required
            />
            </div>

            <div className="col-md-6">
            <MDBInput label="Email" id="typeEmail" type="email" name="email" className="custom-btn-white"
             placeholder="example@example.com" 
             value={formData.email}
             onChange={(e) => setFormData({...formData, email:e.target.value})}
             required >
            </MDBInput>            
            </div>
            </div>

            <MDBBtn className='me-1' style={{color:"#fff", backgroundColor:"#9BBF6A"}} type="submit">Book</MDBBtn>
            <MDBBtn className='me-1' style={{color:"#fff", backgroundColor:"#E57373"}}  type="reset" onClick={() => setFormData({
                name: "",
                number_of_people: "",
                activity: "",
                date_time: "",
                phone: "",
                email: "",
            })}>Reset</MDBBtn>
           </form>
        </>
    );
};

export default Book;
