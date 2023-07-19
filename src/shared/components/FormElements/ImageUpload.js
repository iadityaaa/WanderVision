import React, { useRef, useState, useEffect } from "react";
import Button from "./Button";
import "./ImageUpload.css";

const ImageUpload = (props) => {
  const [file, SetFile] = useState();
  const [previewUrl, SetpreviewUrl] = useState();
  const [isValid, setIsValid] = useState();
  const filePickerRef = useRef();

  //Performing certain actions based on the state of the file
  useEffect(() => {
    //If no file
    if (!file) {
      return;
    }
    const fileReader = new FileReader(); //Generating an image previw url by an api built in the browser FileReader (gives binary data)
    fileReader.onload = () => {
      //This executes when file reading done
      //Making the file an url which can then be submitted in the backend
      SetpreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  }, [file]);

  const pickedHandler = (event) => {
    let pickedFile;
    let fileIsValid = isValid;
    console.log("file changed");
    //Here the goal is to generate something that helps us to preview the file and forward the file to the surrounding element where we wana use it
    if (event.target.files || event.target.files === 1) {
      //It holds the file that user selected (defaultJS) is the evenet is a native file picker
      pickedFile = event.target.files[0];
      SetFile(pickedFile);
      fileIsValid = true;
      setIsValid(true); //It doesnot immediately update the state value but schedules it. Why??
    } else {
      setIsValid(false);
      fileIsValid = false;
    }
    props.onInput(props.id, pickedFile, fileIsValid);
  };

  const pickImageHandler = () => {
    // console.log("file clicked");
    filePickerRef.current.click();
  };

  return (
    <div className="form-control">
      <input
        id={props.id}
        style={{ display: "none" }}
        ref={filePickerRef} //using ref to access a particular dom element
        type="file"
        accept=".jpg,.png,jpeg"
        onChange={pickedHandler} //Two way input binding
      />
      {/* Hiding the input area and instead displaying a button which when clicked fires the Handler function which will allow us to access the input finally */}
      <div className={`image-upload ${props.center && "center"}`}>
        <div className="image-upload__preview">
          {previewUrl && <img src={previewUrl} alt="Preview" />}
          {!previewUrl && <p>Please upload an image!.</p>}
        </div>
        <label className="image_upload_label" onClick={pickImageHandler}>
          Upload Image
        </label>
      </div>
      {/* If not valid format of image picked */}
      {!isValid && <p>{props.errorText}</p>}
    </div>
  );
};

export default ImageUpload;
