import styled from "styled-components";

export const AppWrapper = styled.div`
  font-family: "
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  justify-content: space-between;
  background: url("/path-to-your-background-image.jpg") no-repeat center center
    fixed;
  background-size: cover;
  overflow: hidden; /* Disable scrolling */
  color: #fff;
  position: relative;
`;

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  flex-grow: 1;
  position: relative;
  z-index: 1;
`;

export const Header = styled.h1`
  font-size: 2.5rem;
  color: #eee;
  margin-bottom: 10px;
`;

export const Description = styled.p`
  font-size: 1.25rem;
  margin-bottom: 40px;
  color: #fff;
`;
