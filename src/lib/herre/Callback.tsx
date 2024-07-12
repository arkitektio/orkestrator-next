import React, { useEffect } from "react";

export interface CallbackProps {}

export const Callback: React.FC<CallbackProps> = (props) => {
  useEffect(() => {
    let code = new URLSearchParams(window.location.search).get("code");
    console.log(code);
    if (code) {
      localStorage.setItem("herre-code", code);
      window.close();
    }
  }, []);

  return <>Signing in.....</>;
};
