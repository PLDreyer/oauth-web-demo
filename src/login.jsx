import React, { useContext } from "react";
import { MyContext } from "./context";
import login from "./auth_handler";


export default () => {
  const { code, setCode } = useContext(MyContext)
  console.log("code: ", code)
  const styles = {
    layout: {
      height: "100%",
      width: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center"
    },
    button: {
      display: "flex"
    }
  }

  const onSubmit = async (event) => {
    event.preventDefault();
    await login(setCode)
  }

  return (
    <div style={styles.layout}>
      { code }
      <div>
        Click to login
      </div>
      <button style={styles.button} onClick={onSubmit} title={"Login"}>Login</button>
    </div>
  )
}