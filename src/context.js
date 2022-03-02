import React, {useState} from "react";

export const Store = () => {
  const [code, setCode] = useState("");
  const [accessToken, setAccessToken ] = useState("")

  return {
    code,
    setCode,
    accessToken,
    setAccessToken,
  }
}

export const MyContext = React.createContext({
});