import React, { useState } from "react";
import styled from "styled-components";
import { FiUpload } from "react-icons/fi";

const Box = styled.div`
  width: 400px;
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2px dashed #ffa500; /* Orange accent */
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.1);
  cursor: pointer;
  color: #fff;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

const UploadIcon = styled(FiUpload)`
  font-size: 3rem;
  color: #f06c9b; /* Magenta accent */
`;

const UploadText = styled.p`
  font-size: 1.25rem;
  margin-top: 10px;
  color: #fff;
`;

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
