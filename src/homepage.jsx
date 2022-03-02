import React, { useContext, useEffect } from "react";
import { MyContext } from "./context";
import { verifyCallback } from "./auth_handler";

export default (props) => {
  const { code, setCode, accessToken, setAccessToken } = useContext(MyContext)

  const styles = {
    layout: {
      height: "100%",
      width: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    },
    card: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      alignItems: "center",
      height: "200px",
      width: "200px"
    },
    tokenCard: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "space-around",
      height: "100%"
    }
  }

  useEffect(async () => {
    await verifyCallback(setAccessToken);
  }, [])

  return (
    <div style={styles.layout}>
      <div style={styles.card}>
        <div>
          Homepage
        </div>
        <div style={styles.tokenCard}>
          <div>
            AccessToken:
          </div>
          <div>
            {accessToken}
          </div>
        </div>
      </div>
    </div>
  )
}