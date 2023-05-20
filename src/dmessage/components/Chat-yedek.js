import React, { useState, useEffect } from "react";
import { db } from "../../../firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";
import { useSelector } from "react-redux";
import Scrollbars from 'react-custom-scrollbars-2';

export const Chat = ({ room }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesRef = collection(db, "messages");
  const user = useSelector(state => state.auth.user);
  const users = useSelector(state => state.auth.user); // Yerelde kullanıcıları saklayan state

  useEffect(() => {
    const queryMessages = collection(db, "messages");
    const unsubscribe = onSnapshot(queryMessages, (snapshot) => {
      let fetchedMessages = [];
      snapshot.forEach((doc) => {
        fetchedMessages.push({ ...doc.data(), id: doc.id });
      });
      setMessages(fetchedMessages);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (newMessage === "") return;
    await addDoc(messagesRef, {
      text: newMessage,
      createdAt: serverTimestamp(),
      user: user.full_name,
      room,
    });

    setNewMessage("");
  };

  return (
    <div className="chat-app p-4 w-[800px] h-[500px] ">
      <div className="header items-center text-center flex justify-center">
        <h1 className="p-4 text-cyan-500 font-extrabold">{room.toUpperCase()} Odasına Hoşgeldiniz.</h1>
      </div>
      <div className="messages border border-gray-500 p-8  text-black font-bold flex flex-col flex-nowrap h-[350px]  ">
        <Scrollbars style={{ width:720, height: 700 }} >
          {messages.map((message) => (
            <>
              {user.full_name === message.user ? (
                <div key={message.id} className="message flex justify-end pr-4">
                  <span className="user flex text-center">
                    {users.map((user) => (
                      <div className="mt-2">
                        {message.user === user.full_name ?(<img src={user.photoURL} className="w-8 rounded-full" alt="bulunamadı"/>):("")}
                      </div>
                    ))}
                    <div className="border bg-purple-700 text-gray-100 rounded-lg h-8 ml-2 mr-2 font-semibold mt-2 p-2 flex justify-center text-center items-center">{message.text}</div>
                  </span>
                </div>
              ) : (
                <div key={message.id} className="message flex justify-start ">
                  <span className="user flex text-center">
                    {users.map((user) => (
                      <div className="mt-2">
                        {message.user === user.full_name ?(<img src={user.photoURL} className="w-8 rounded-full" alt="bulunamadı"/>):("")}
                      </div>
                    ))}
                   
                   <div className="border bg-purple-700 text-gray-100 rounded-lg h-8 ml-2 mr-2 mt-2 font-semibold p-2 text-center flex items-center">{message.text}</div>
                  </span>
                </div>
              )}
            </>
          ))}
        </Scrollbars>
      </div>
      <div className="bottom-bar">
        <form onSubmit={handleSubmit} className="new-message-form text-black p-4 justify-end flex">
          <input
            type="text"
            value={newMessage}
            onChange={(event) => setNewMessage(event.target.value)}
            className="new-message-input border border-black h-10 w-full"
            placeholder="Mesajınızı bu bölgeye yazınız..."
          />
          <button type="submit" className="send-button bg-green-500 text-white h-10 rounded-md ml-1 p-1">
            Gönder
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;