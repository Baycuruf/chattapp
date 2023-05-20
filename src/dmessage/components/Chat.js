import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
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
import Scrollbars from "react-custom-scrollbars-2";


export const Chat = ({ room }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesRef = collection(db, "messages");
  const user = useSelector((state) => state.auth.user);

  
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (newMessage === "") return;
    await addDoc(messagesRef, {
      text: newMessage,
      createdAt: serverTimestamp(),
      user: user.displayName,
      room,
      
    });

    setNewMessage("");
  };
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Firestore örneğini alın
        const usersCollection = collection(db, "users");
        const querySnapshot = await getDocs(usersCollection);
        const usersData = querySnapshot.docs.map((doc) => doc.data());
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  
  

  return (
    <div className="chat-app p-4 w-[800px] h-[500px]">
      <div className="header items-center text-center flex justify-center">
        <h1 className="p-4 text-cyan-500 font-extrabold">
          {room} Odasına Hoşgeldiniz.
        </h1>
      </div>
      <div className="messages border border-gray-500 p-8  text-black font-bold flex flex-col flex-nowrap h-[350px]">
  <Scrollbars style={{ width: 720, height: 700 }}>
    {messages.map((message) => (
      <>
        {user.displayName === message.user ? (
          <div key={message.id} className="message flex justify-end pr-4">
            <span className="user flex text-center">
              {users.map((user) => (
                <div className="mt-2 flex items-center">
                  {message.user === user.username ? (
                    <img
                      src={user.photoURL}
                      className="w-8 rounded-full"
                      alt="bulunamadı"
                    />
                  ) : (
                    ""
                  )}
                </div>
              ))}
              <div className="border bg-green-700 text-gray-100 rounded-lg  h-8 ml-2 mr-2 font-semibold mt-2 p-2 flex justify-center text-center items-center">
                <span>{message.text}</span> 
                {message.createdAt && (
                    <span className="text-xs font-thin p-2">
                    {message.createdAt.toDate().toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  )}
                
              </div>
            </span>
          </div>
        ) : (
          <div key={message.id} className="message flex justify-start ">
            <span className="user flex text-center">
              {users.map((user) => (
                <div className="mt-2 flex items-center">
                  {message.user === user.username ? (
                    <img
                      src={user.photoURL}
                      className="w-8 rounded-full"
                      alt="bulunamadı"
                    />
                  ) : (
                    ""
                  )}
                </div>
              ))}
              <div className="border bg-[#202124] text-gray-100 rounded-lg ml-2 mr-2 mt-2 font-semibold p-2 text-center flex items-center">
                <div>
                  <h className="justif-start flex mb-2 text-pink-700">
                    {message.user}
                  </h>
                  <span>{message.text}</span>
                  {message.createdAt && (
                    <span className="text-xs font-thin p-2">
                    {message.createdAt.toDate().toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  )}
                  
                </div>
              </div>
            </span>
          </div>
        )}
      </>
    ))}
  </Scrollbars>
</div>

      <div className="bottom-bar">
        <form
          onSubmit={handleSubmit}
          className="new-message-form text-black p-4 justify-end flex "
        >
          <input
            type="text"
            value={newMessage}
            onChange={(event) => setNewMessage(event.target.value)}
            className="new-message-input border border-black h-10 w-full p-2"
            placeholder="Mesajınızı bu bölgeye yazınız..."
          />
          <button
            type="submit"
            className="send-button bg-green-500 text-white h-10 rounded-md ml-1 p-1"
          >
            Gönder
          </button>
        </form>
      </div>
    </div>
  );
};


// const [users, setUsers] = useState([]);

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const response = await axios.get("http://localhost:3000/api/users");
//         console.log(response.data); // API endpointini doğru şekilde belirtin
//         setUsers(response.data);
//       } catch (error) {
//         console.error("Error fetching users:", error);
//       }
//     };

//     fetchUsers();
//   }, []);