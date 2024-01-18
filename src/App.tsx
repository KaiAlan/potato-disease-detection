import React, { useState } from "react";
import http from "./http-common";

function App() {
  const [currentImage, setCurrentImage] = useState<File>();
  const [progress, setProgress] = useState<number>(0);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const selectedFiles = e.target.files as FileList;
    setCurrentImage(selectedFiles?.[0]);
    setPreviewImage(URL.createObjectURL(selectedFiles?.[0]));
    setProgress(0);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentImage) return;
    setProgress(0);

    const onUploadProgress = (e: any) => {
      setProgress(Math.round((100 * e.loaded) / e.total));
    };

    let formData = new FormData();
    formData.append("file", currentImage);

    http
      .post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress,
      })
      .catch((err) => {
        console.log(err);
        if (err.response && err.response.data && err.response.data.message) {
          setMessage(err.response.data.message);
        } else {
          setMessage("Could not upload the Image!");
        }

        setCurrentImage(undefined);
      });
  };

  return (
    <main className="flex justify-center items-center w-full h-screen">
      <div className=" flex flex-col justify-center items-center w-1/5 h-2/5 border-2 border-white rounded-md">
        <p className="font-bold text-white p-10"> upload your image here: </p>

        <form onSubmit={handleSubmit} className="flex flex-col">
          <input type="file" onChange={handleChange} />
          <button type="submit" className="font-semibold bg-blue-500 rounded-md border-1 w-1/2">
            Submit
          </button>
        </form>
      </div>
        <div className="flex flex-col justify-center items-center w-2/5 h-2/5 border-2 border-white rounded-md">
          {currentImage && progress > 0 && (
            <div className="">
              <div
                className=""
                role=""
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
                style={{ width: progress + "%" }}
              >
                {progress}%
              </div>
            </div>
          )}

          {previewImage && (
            <div className="w-4/5 h-4/5">
              <img className="w-full h-full" src={previewImage} alt="Preview Image" />
            </div>
          )}

          {message && (
            <div className="" role="alert">
              {message}
            </div>
          )}
        </div>
    </main>
  );
}

export default App;
