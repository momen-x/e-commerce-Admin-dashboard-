"use client";
import { Toaster } from "react-hot-toast";

const ToasterProvider = () => {
  
  return (
    <div>
      <Toaster position="bottom-right" reverseOrder={true} />
    </div>
  );
};

export default ToasterProvider;
