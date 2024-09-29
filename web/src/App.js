import Navbar from "./components/Navbar";
import UploadBox from "./components/UploadBox";
import { ContentWrapper, Header, Description } from "./styles";
import { useEffect, useState } from "react";
import FileUploadComponent from "./components/FileUploadComponent";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api")
      .then((response) => response.json())
      .then((data) => setMessage(data.message));
  }, []);

  return (
    <div className="App">
      <Navbar />
      <ContentWrapper>
        <Header>Welcome to Our High-Tech Startup</Header>
        <Description>
          Upload your files easily and securely with our cutting-edge service.
        </Description>
        <FileUploadComponent />
        <UploadBox />
      </ContentWrapper>
    </div>
  );
}

export default App;
