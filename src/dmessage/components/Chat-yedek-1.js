import React, { useState, useEffect } from "react";
import { db } from "../../../firebase";
import {
  collection,
  addDoc,
  where,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
  getDocs,
} from "firebase/firestore";
import { useSelector } from "react-redux";
import Scrollbars from 'react-custom-scrollbars-2';

export const Chat = ({ room }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesRef = collection(db, "messages");
  const user = useSelector(state => state.auth.user);
  

  useEffect(() => {
    const queryMessages = query(
      messagesRef,
      where("room", "==", room),
      orderBy("createdAt")
    );
    const unsuscribe = onSnapshot(queryMessages, (snapshot) => {
      let messages = [];
      snapshot.forEach((doc) => {
        messages.push({ ...doc.data(), id: doc.id });
      });
      
      setMessages(messages);
    });

    return () => unsuscribe();
  }, [messagesRef, room]);

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

  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const fetchedUsers = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setUsers(fetchedUsers);
      } catch (error) {
        console.log('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);
  

  return (
    <div className="chat-app p-4 w-[800px] h-[500px] ">
      <div className="header items-center text-center flex justify-center">
        <h1 className="p-4 text-cyan-500 font-extrabold">{room.toUpperCase()} Odasına Hoşgeldiniz.</h1>
      </div>
      <div className="messages border border-gray-500 p-8  text-black font-bold flex flex-col flex-nowrap h-[350px]  ">
      <Scrollbars style={{ width:720, height: 700 }} >
      {messages.map((message) => {
  const currentUser = users.find((user) => user.full_name === message.user);

  return (
    <div key={message.id} className={`message flex ${user.full_name === message.user ? 'justify-end pr-4' : 'justify-start'}`}>
      <span className="user flex text-center">
        {currentUser && (
          <div className="mt-2">
            <img src={currentUser.photoURL} className="w-8 rounded-full" alt="bulunamadı" />
          </div>
        )}
        <div className="border bg-purple-700 text-gray-100 rounded-lg h-8 ml-2 mr-2 mt-2 font-semibold p-2 text-center flex items-center">
          {message.text}
        </div>
      </span>
    </div>
  );
})}

        </Scrollbars>
      </div>
      <div className="bottom-bar"> 
      <form onSubmit={handleSubmit} className="new-message-form text-black p-4 justify-end flex ">
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
