import React from 'react';
import '../../styles/main/footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} Time Capsule. All rights reserved.</p>
    </footer>
  );
};

export default Footer;