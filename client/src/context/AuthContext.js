import React, { useEffect, createContext, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [me, setMe] = useState();

  useEffect(() => {
    const sessionId = localStorage.getItem("sessionId");
    console.log(sessionId);
    if (me) {
      axios.defaults.headers.common.sessionid = me.sessionId;
      localStorage.setItem("sessionId", me.sessionId);
    } else if (sessionId) {
      axios
        .get("/users/me", { headers: { sessionid: sessionId } }) // get 방식은 body 가 없음. 바로 config임
        .then((result) =>
          setMe({
            name: result.data.name,
            userId: result.data.userId,
            sessionId: result.data.sessionId,
          })
        )
        .catch((err) => {
          console.log(err);
          localStorage.removeItem("sessionId");
          delete axios.defaults.headers.common.sessionid;
        });
    } else delete axios.defaults.headers.common.sessionid;
  }, [me]);

  return (
    <AuthContext.Provider value={[me, setMe]}>{children}</AuthContext.Provider>
  );
};
