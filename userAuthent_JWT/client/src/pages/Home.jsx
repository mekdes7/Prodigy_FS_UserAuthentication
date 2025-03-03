import React from 'react';
import NavBar from '../components/NavBar';
import Header from '../components/Header';

const Home = () => {
  return (
    <div className='h-screen w-full bg-[url("/bg_img.png")] bg-cover bg-center flex flex-col'>
      <NavBar />
      <Header />
    </div>
  );
};

export default Home;
