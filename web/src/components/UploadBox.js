import React, { useState } from "react";
import styled from "styled-components";
import { FiUpload } from "react-icons/fi";


const UploadBox = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <Box>
      {!file ? (
        <>
          <UploadIcon />
          <UploadText>Click to Upload File</UploadText>
          <input
            type="file"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </>
      ) : (
        <UploadText>{file.name}</UploadText>
      )}
    </Box>
  );
};

export default UploadBox;
