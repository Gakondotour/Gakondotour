import Nav from './Nav';

import img2 from "./images/IMG-20241105-WA0008.jpg";
import img3 from "./images/IMG-20241105-WA0019.jpg";
import img5 from "./images/IMG-20241105-WA0025.jpg";
import img6 from "./images/IMG-20241105-WA0026.jpg";
import img7 from "./images/IMG-20241105-WA0027.jpg";
import img8 from "./images/IMG-20250117-WA0003.jpg";
import img9 from "./images/IMG-20250117-WA0031.jpg";
import img10 from "./images/IMG-20250117-WA0032.jpg";
import img11 from "./images/IMG-20250117-WA0036.jpg";
import img12 from "./images/IMG-20250117-WA0038.jpg";
import img13 from "./images/IMG-20250117-WA0043.jpg";
import img14 from "./images/IMG-20250117-WA0053.jpg";
import img15 from "./images/IMG-20250117-WA0057.jpg";
import img16 from "./images/IMG-20250117-WA0059.jpg";
import img17 from "./images/IMG-20250117-WA0061.jpg";
import img4 from "./images/IMG-20241105-WA0024.jpg";
import Footer from './Footer';


const ActivityImages = () => {

    const imgs = [img2, img13, img14, img5, img16, img17, img8, img9, img10, img11, img12, img3, img4, img15, img6, img7 ]
    return(
        <div>
            <Nav />
            <div className='diVactivityImgs'> 
            <h2 style={{color:"black", textAlign:"left"}}>OUR ACTIVITIES' GALLERY</h2>
            {imgs.map((img, value) => (
                <img className="activityImgs" key={value} src={img} target alt={`Activity ${value+1}`} />
            
            ))}
            </div>
            <Footer />
        </div>
    )
}

export default ActivityImages