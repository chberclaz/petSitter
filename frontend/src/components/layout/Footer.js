import React from "react";
import { Box, Typography, Container, Link } from "@mui/material";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <p>&copy; {new Date().getFullYear()} PetSitter. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
