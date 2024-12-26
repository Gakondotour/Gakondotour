import { useEffect, useState } from "react";
import axios from 'axios';


const Book = ( () =>{
    const [data, setData] = useState([])


    useEffect(() => {
    //fetch db from background
    axios.get('http://127.0.0.1:5000/')
    .then(res => setData(res.data))
    .catch(error => `Error ${error}`)
    }, [])

    return(
        <>
        <h1>Booking</h1>
        </>
    )
})

export default Book