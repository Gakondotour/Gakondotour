// src/Main.js
import React, { use } from "react";
import { useState, useEffect } from "react";
import img1 from "./images/IMG-20241105-WA0018.jpg";
import img2 from "./images/IMG-20241105-WA0025.jpg";
import img3 from "./images/IMG-20241105-WA0011.jpg";
import img4 from "./images/IMG-20241105-WA0016.jpg";

const imgs = [img1, img2, img3, img4];

const Main = () => {
  const [slideshow, setSlideshow] = useState(0);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(true);
      setTimeout(() => {
        setSlideshow((a) => (a + 1) % imgs.length); 
        setFade(false);
      }, 500);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className='main_img'>
        <img
          src={imgs[slideshow]}
          className={`main_imgs ${fade ? 'exit' : 'enter'}`}
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
