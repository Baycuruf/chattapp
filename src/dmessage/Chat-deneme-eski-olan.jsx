import React, { useState } from "react";
import { Chat } from "./components/Chat";
import { Auth } from "./components/Auth";
import { AppWrapper } from "./components/AppWrapper";
import Cookies from "universal-cookie";



const cookies = new Cookies();

function ChatApp() {
  const [isAuth, setIsAuth] = useState(cookies.get("auth-token"));
  const [isInChat, setIsInChat] = useState(null);
  const [room, setRooms] = useState("");

  if (!isAuth) {
    return (
      <AppWrapper
        isAuth={isAuth}
        setIsAuth={setIsAuth}
        setIsInChat={setIsInChat}
      >
        <Auth setIsAuth={setIsAuth} />
      </AppWrapper>
    );
  }

  return (
    <AppWrapper isAuth={isAuth} setIsAuth={setIsAuth} setIsInChat={setIsInChat}>
      {!isInChat ? (
        <div className="room flex items-center justify-center border border-sky-600  text-center h-32 gap-x-4 p-4 ">
          <label className="bg-cyan-500 w-24 h-12 text-white rounded-lg">
            {" "}
            Oda adını giriniz:{" "}
          </label>
          <input
            className="border border-black h-8"
            onChange={(e) => setRooms(e.target.value)}
          />
          <button
            className="bg-cyan-500 text-white rounded-lg w-24 h-12 "
            onClick={() => {
              setIsInChat(true);
            }}
          >
            Odaya Gir
          </button>
        </div>
      ) : (
        <Chat room={room} />
      )}
    </AppWrapper>
  );
}

export default ChatApp;
