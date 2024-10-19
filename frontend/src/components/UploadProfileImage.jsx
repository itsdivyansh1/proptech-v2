import { Upload } from "lucide-react";
import { createContext, useEffect, useState } from "react";
import { Button } from "./ui/button";

// Create a context to manage the script loading state
const CloudinaryScriptContext = createContext();

function UploadProfileImage({ uwConfig, setImages, setAvatar }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Check if the script is already loaded
    if (!loaded) {
      const uwScript = document.getElementById("uw");
      if (!uwScript) {
        // If not loaded, create and load the script
        const script = document.createElement("script");
        script.setAttribute("async", "");
        script.setAttribute("id", "uw");
        script.src = "https://upload-widget.cloudinary.com/global/all.js";
        script.addEventListener("load", () => setLoaded(true));
        document.body.appendChild(script);
      } else {
        // If already loaded, update the state
        setLoaded(true);
      }
    }
  }, [loaded]);

  const initializeCloudinaryWidget = (e) => {
    e.preventDefault();
    if (loaded) {
      var myWidget = window.cloudinary.createUploadWidget(
        uwConfig,
        (error, result) => {
          if (!error && result && result.event === "success") {
            console.log("Done! Here is the image info: ", result.info);
            if (setImages) {
              setImages((prev) => [...prev, result.info.secure_url]);
            } else if (setAvatar) {
              setAvatar(result.info.secure_url);
              myWidget.close(); // Close widget after avatar upload
            }
          }
        }
      );

      document.getElementById("upload_widget").addEventListener(
        "click",
        function () {
          myWidget.open();
        },
        false
      );
    }
  };

  return (
    <CloudinaryScriptContext.Provider value={{ loaded }}>
      <button
        id="upload_widget"
        className="cloudinary-button flex items-center justify-center"
        onClick={initializeCloudinaryWidget}
      >
        <Upload />
      </button>
    </CloudinaryScriptContext.Provider>
  );
}

export default UploadProfileImage;
export { CloudinaryScriptContext };
