import React from 'react';
import Nav from './Nav';
import Main from './Main';
import Book from './Book';
import Footer from './Footer';


const Home = () => {
  return (
    <>
      <Nav />
      <div className='mainBook'>
        <Main />
        <Book />
      </div>
      <Footer />
    </>
  );
};

export default Home;
