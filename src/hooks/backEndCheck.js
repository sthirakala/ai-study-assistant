import { useEffect } from "react";
import { testBackend } from "../api";

const useBackendCheck = () => {

  useEffect(() => {

    testBackend()
      .then((data) => {
        console.log(data.message);
      })
      .catch((error) => {
        console.error("Backend connection failed:", error);
      });

  }, []);

};

export default useBackendCheck;