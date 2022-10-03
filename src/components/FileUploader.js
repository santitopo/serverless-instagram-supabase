import { Button, Typography } from "@mui/material";
import React, { useRef } from "react";

const shortenText = (text) => {
  if (text?.length > 6) {
    const termination = text.substring(text?.length - 4, text?.length);
    return text.substring(0, 6) + "..." + termination;
  }
  return text;
};

const FileUploader = ({
  text,
  onFileSelectError,
  onFileSelectSuccess,
  selectedFileName,
}) => {
  const fileInput = useRef(null);

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file.size > 2200000) {
      onFileSelectError({ error: "File size cannot exceed more than 1MB" });
    } else onFileSelectSuccess(file);
  };

  return (
    <div className="file-uploader">
      <input
        accept="image/*"
        hidden
        ref={fileInput}
        type="file"
        onChange={handleFileInput}
      />
      <Button
        variant="contained"
        component="label"
        onClick={(e) => fileInput.current && fileInput.current.click()}
        className="btn btn-primary"
      >
        {text}
      </Button>
      <Typography>{shortenText(selectedFileName)}</Typography>
    </div>
  );
};

export default FileUploader;
