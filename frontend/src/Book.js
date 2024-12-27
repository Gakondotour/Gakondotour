import { useEffect, useState } from "react";
import axios from 'axios';

const Book = () => {
    const [data, setData] = useState([])

    useEffect(() => {
        //fetch db from backend
        axios.get('http://127.0.0.1:5000/')
        .then(res => {
            console.log(res.data); // Verify response
            setData(res.data.book);
        })
        .catch(error => console.error(`Error: ${error}`));
    }, [])

    return (
        <>
            <div>
                {data.map((item, index) => (
                    <div key={index}>
                        <p>Name: {item.full_name}</p>
                        <p>Number of People: {item.number_of_people}</p>
                        <p>Activity: {item.activity}</p>
                        <p>Date and Time: {item.date_time}</p>
                        <p>Phone: {item.phone}</p>
                        <p>Email: {item.email}</p>
                    </div>
                ))}
            </div>
            <h1>{data}</h1>
            <h1>Bookign</h1>
        </>
    )
}

export default Book
