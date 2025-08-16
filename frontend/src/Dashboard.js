import React, {useState, useEffect, useCallback} from "react";
import axios from "axios";
import {useLocation, useNavigate} from "react-router-dom";
import {MDBBtn, MDBNavbarLink} from "mdb-react-ui-kit";

const API_URL = process.env.REACT_APP_BACKEND_URL;

const Dashboard = () => {
    const [data, setData] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();

    const params = new URLSearchParams(location.search);
    const token = params.get("token") ?? localStorage.getItem("token");
    const isAdmin = params.get("is_admin") ?? localStorage.getItem("is_admin");

    if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("is_admin", isAdmin);
    }else{
        navigate('login')
    }

    const fetchData = useCallback(async () => {
        try {
            const response = await axios.get(API_URL + "/dashboard", {
                headers: {Authorization: `Bearer ${token}`},
            });

            const bookingList = response.data.booking_list || [];

            const updatedBookings = bookingList.map((booking) => ({
                ...booking,
                price: localStorage.getItem(`price_${booking.email}`) || "N/A",
            }));

            setData(updatedBookings);
        } catch (error) {
            console.error(error);
        }
    }, [token]); // ✅ only depends on token

    useEffect(() => {
        if (!token) {
            navigate("/login");
        } else {
            fetchData();
        }
    }, [fetchData, navigate, token]); // ✅ now stable

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const deleteData = async (id) => {
        try {
            await axios.delete(API_URL + "/dashboard", {
                headers: {Authorization: `Bearer ${token}`},
                data: {id},
            });
            fetchData();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div style={{backgroundColor: "#fff"}}>
            <h1 style={{textAlign: "center"}}>Admin Dashboard</h1>
            <table className="tableStyle" style={{borderCollapse: "collapse", width: "100%"}}>
                <thead>
                <tr>
                    <th style={{border: "2px solid black", padding: "8px"}}>Full Name</th>
                    <th style={{border: "2px solid black", padding: "8px"}}>Number of People</th>
                    <th style={{border: "2px solid black", padding: "8px"}}>Activity</th>
                    <th style={{border: "2px solid black", padding: "8px"}}>Date</th>
                    <th style={{border: "2px solid black", padding: "8px"}}>Phone</th>
                    <th style={{border: "2px solid black", padding: "8px"}}>Email</th>
                    <th style={{border: "2px solid black", padding: "8px"}}>Price</th>
                    <th style={{border: "2px solid black", padding: "8px"}}>Deletion</th>
                </tr>
                </thead>
                <tbody>
                {data.map((x) => (
                    <tr key={x.id}>
                        <td style={{border: "2px solid black", padding: "8px"}}>{x.name}</td>
                        <td style={{border: "2px solid black", padding: "8px"}}>{x.number_of_people}</td>
                        <td style={{border: "2px solid black", padding: "8px"}}>
                            {Array.isArray(x.activity)
                                ? x.activity.map((act) => act.replace(/_/g, " ")).join(", ")
                                : x.activity.replace(/_/g, " ")}
                        </td>
                        <td style={{border: "2px solid black", padding: "8px"}}>{x.date_time}</td>
                        <td style={{border: "2px solid black", padding: "8px"}}>{x.phone}</td>
                        <td style={{border: "2px solid black", padding: "8px"}}>{x.email}</td>
                        <td style={{border: "2px solid black", padding: "8px"}}>{x.price ? `$${x.price}` : "NON"}</td>
                        <td style={{border: "2px solid black", padding: "8px"}}>
                            <MDBBtn
                                className="me-1"
                                color="danger"
                                style={{cursor: "pointer"}}
                                onClick={() => {
                                    if (window.confirm("Do you really want to delete this Booking?")) {
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
                style={{margin: "10px", cursor: "pointer", position: 'absolute', bottom: "0%"}}
                onClick={logout}
            >
                Logout
            </MDBBtn>
            <MDBNavbarLink
                style={{margin: "10px", cursor: "pointer", color: "darkGreen"}}
                className="link-hover"
                href="/contact_admin"
            >
                <strong>Texts</strong>
            </MDBNavbarLink>
        </div>
    );
};

export default Dashboard;
