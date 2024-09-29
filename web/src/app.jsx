import styles from './app.module.css';

// import { useEffect, useState } from "react";
import Navbar from "./components/navbar";
import NotFound from './pages/not-found';
import Upload from './pages/upload';
// import FileUploadComponent from "./components/FileUploadComponent";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { BrowserRouter, Route, Routes } from 'react-router-dom';

export default function App() {
  // const [message, setMessage] = useState("");
  // useEffect(() => {
  //   fetch("/api")
  //     .then((response) => response.json())
  //     .then((data) => setMessage(data.message));
  // }, []);

  return (
    <div className={styles['app']}>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route exact path="/" element={<Upload/>}/>
          <Route path="*" element={<NotFound/>}/>
        </Routes>
        {/* <div>
          <div>Welcome to Our High-Tech Startup</div>
          <div>
            Upload your files easily and securely with our cutting-edge service.
          </div>
          <FileUploadComponent />
          <UploadBox />
        </div> */}
      </BrowserRouter>
    </div>
  );
}
