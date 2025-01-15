import React from 'react';
import Nav from './Nav';
import Main from './Main';
import Book from './Book';
import Footer from './Footer';
import Activities from './Activities';

const Home = () => {
  return (
    <div>
      <Nav />
      <Main />
      <Book />
      <Activities />
      <Footer />
    </div>
  );
};

export default Home;
