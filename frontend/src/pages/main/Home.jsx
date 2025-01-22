import React from 'react';
import MainLayout from '../../layouts/main/MainLayout';
import '../../styles/main/home.css';

const Home = () => {
  return (
    <MainLayout>
      <div className="home-content">
        <h1>Welcome to Time Capsule</h1>
        <p>Your memories, preserved forever.</p>
      </div>
    </MainLayout>
  );
};

export default Home;
