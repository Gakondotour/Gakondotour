import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-custom-alert";
import Book from "./Book";
import img1 from "./images/IMG-20241105-WA0006.jpg";
import img2 from "./images/IMG-20241105-WA0020.jpg";
import img3 from "./images/IMG-20241105-WA0016.jpg";
import img4 from "./images/IMG-20241105-WA0018.jpg";
import img5 from "./images/IMG-20241105-WA0011.jpg";
import img6 from "./images/IMG-20241105-WA0022.jpg";
import img7 from "./images/IMG-20241105-WA0020.jpg";
import img8 from "./images/IMG-20241105-WA0023.jpg";
import img9 from "./images/IMG-20250117-WA0041.jpg";
import img10 from "./images/IMG-20250117-WA0011.jpg";
import img11 from "./images/IMG-20250117-WA0012.jpg";
import img12 from "./images/IMG-20250117-WA0030.jpg";
import img13 from "./images/IMG-20250117-WA0049.jpg";
import img14 from "./images/IMG-20250117-WA0055.jpg";
import img15 from "./images/IMG-20250117-WA0060.jpg";
import img16 from "./images/IMG-20250117-WA0064.jpg";

const imgs = [
  img1, img2, img3, img4, img5, img6, img7, img8,
  img9, img10, img11, img12, img13, img14, img15, img16
];

const Main = () => {
  const [slideshow, setSlideshow] = useState(0);
  const [anime, setAnime] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const message = location.state?.message;
  const toastShown = useRef(false); // Prevent duplicate alerts

  useEffect(() => {
    if (message && !toastShown.current) {
      toast.success(<p>{message}</p>);
      toastShown.current = true; // Mark toast as shown

      // Clear the message in the history state
      setTimeout(() => {
        navigate(".", { replace: true, state: {} });
      }, 3000);
    }

    const interval = setInterval(() => {
      setAnime(true);
      setTimeout(() => {
        setSlideshow((a) => (a + 1) % imgs.length);
        setAnime(false);
      }, 1000);
    }, 10000);

    return () => clearInterval(interval);
  }, [navigate, message]);

  return (
    <div style={{ backgroundColor: '#788859' }}>
      <div className="main_img">
        <img
          src={imgs[slideshow]}
          className={`main_imgs ${anime ? "fade-out" : "fade-in"}`}
          alt={`Image ${slideshow + 1}`}
        />
        <Book />
        <div className="dots">
          {imgs.map((_, index) => (
            <span
              key={index}
              className={`dot ${index === slideshow ? "active" : ""}`}
              onClick={() => setSlideshow(index)}
            ></span>
          ))}
        </div>
      </div>
      <ToastContainer floatingTime={3000} />
    </div>
  );
};

export default Main;
