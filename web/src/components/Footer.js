import React from "react";
import styled from "styled-components";

const FooterWrapper = styled.footer`
  background-color: rgba(0, 0, 0, 0.6);
  color: #fff;
  padding: 10px;
  text-align: center;
  font-size: 0.75rem;
  position: absolute;
  bottom: 0;
  width: 100%;
`;

const Footer = () => {
  return <FooterWrapper>&copy; 2024 MyApp. All rights reserved.</FooterWrapper>;
};

export default Footer;
