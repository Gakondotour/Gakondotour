// src/Main.js
import React, { use } from "react";
import { useState, useEffect } from "react";
import img1 from "./images/IMG-20241105-WA0006.jpg";
import img2 from "./images/IMG-20241105-WA0020.jpg";
import img3 from "./images/IMG-20241105-WA0016.jpg";
import img4 from "./images/IMG-20241105-WA0018.jpg";
import img5 from "./images/IMG-20241105-WA0011.jpg";
import img6 from "./images/IMG-20241105-WA0022.jpg";
import img7 from "./images/IMG-20241105-WA0010.jpg";


const imgs = [img1, img2, img3, img4, img5, img6, img7];

const Main = () => {
  const [slideshow, setSlideshow] = useState(0);
  const [anime, setAnime] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnime(true);
      setTimeout(() => {
        setSlideshow((a) => (a + 1) % imgs.length); 
        setAnime(false);
      }, 1000);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className='main_img img-fluid'>
        <img
          src={imgs[slideshow]}
          className={`main_imgs ${anime ? 'exit' : 'enter'}`}
          alt={`Image ${slideshow + 1}`}
        />
      </div>
      <div className="dots">
          {imgs.map((_, index) => (
            <span
              key={index}
              className={`dot ${index === slideshow ? "active" : ""}`}
              onClick={() => setSlideshow(index)}
            ></span>
          ))}
      </div>
    </>
  );
};

export default Main;
