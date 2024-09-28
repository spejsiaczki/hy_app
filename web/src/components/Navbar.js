import React from "react";
import styled from "styled-components";

const Nav = styled.nav`
  width: 100vw;
  display: flex;
  justify-content: space-between;
  padding: 15px 0 15px 0;
  background-color: rgba(0, 0, 0, 0.6);
  position: absolute;
  top: 0;
`;

const Logo = styled.div`
  font-size: 1rem;
  font-weight: bold;
  color: #ffffff;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 50px;
`;

const NavLink = styled.a`
  padding 15px;
  color: #fff;
  text-decoration: none;
  font-size: 1rem;
  width: 100px;
  transition: color 0.3s ease;

  &:hover {
    color: #f06c9b; /* Magenta accent */
    text-decoration: underline;
  }
`;

const Navbar = () => {
  return (
    <Nav>
      <Logo>MyApp</Logo>
      <NavLinks>
        <NavLink href="#pricing">Pricing</NavLink>
        <NavLink href="#about">About</NavLink>
        <NavLink href="#hackyeah">HackYeah</NavLink>
      </NavLinks>
    </Nav>
  );
};

export default Navbar;
