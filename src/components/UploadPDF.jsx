import { useState } from "react";
import {RiUploadCloudFill} from "react-icons/ri";
import "./css/UploadPDF.css";

const UploadPDF = () => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [result, setResult] = useState(null);
    const handleFileChange = (e) =>{
        const selectedFile = e.target.files[0];
        if(selectedFile){
            setFile(selectedFile);
        }
    };
    const handleUpload = async () => {

  if (!file) return;


  setUploading(true);


  const formData = new FormData();

  formData.append("file", file);


  const response = await fetch(
    "http://localhost:8000/upload",
    {
      method: "POST",
      body: formData,
    }
  );


  const data = await response.json();


  setResult(data);

  setUploading(false);
};

    return (<div className="upload-box">

  <h2>Upload Study Material</h2>

  <label className="upload-area">

    <RiUploadCloudFill className="upload-icon"/>

    <p className="upload-text">
      Click to upload your PDF here
    </p>

    <p className="upload-subtext">
      Supports PDF files
    </p>

    <input
      className="file-input"
      type="file"
      accept=".pdf"
      onChange={handleFileChange}
    />

  </label>


  {file && (
    <>
    <div className="file-name">
      📄 {file.name}
    </div>
    
    </>
  )}
  <button
      className="upload-button"
      onClick={handleUpload}
    >
      {uploading ? "Processing..." : "Process Document"}
    </button>
    {result && (
      <div>

        <h3>
          😊 Successfully Uploaded!
        </h3>

        <p>
          📄 {result.filename}
        </p>

        <p>
          Total Pages: {result.pages}
        </p>

      </div>
    )}

</div>);
}
 
export default UploadPDF;