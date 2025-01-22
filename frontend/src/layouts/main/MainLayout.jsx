import React from 'react';
import Navbar from '../../components/main/Navbar';
import Footer from '../../components/main/Footer';
import '../../styles/main/mainLayout.css';

const MainLayout = ({ children }) => {
  return (
    <div className="main-layout">
      <Navbar />
      <main className="content">{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;
