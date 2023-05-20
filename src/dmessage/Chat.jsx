import React, { useState, useEffect } from "react";
import { Chat } from "./components/Chat";
import { Auth } from "./components/Auth";
import { AppWrapper } from "./components/AppWrapper";
import Cookies from "universal-cookie";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useSelector } from "react-redux";

const cookies = new Cookies();

function ChatApp() {
  const [isAuth, setIsAuth] = useState(cookies.get("auth-token"));
  const [isInChat, setIsInChat] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [room, setRoom] = useState("");
  const [newRoomName, setNewRoomName] = useState(""); // Yeni oda adını tutacak state
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "messages"));
        const fetchedRooms = [];
        querySnapshot.forEach((doc) => {
          const createdBy = doc.data().user;
          if (createdBy === user?.displayName) {
            const room = doc.data().room;
            if (room && !fetchedRooms.includes(room)) {
              fetchedRooms.push(room);
            }
          }
        });
        setRooms(fetchedRooms);
      } catch (error) {
        console.log("Error fetching rooms:", error);
      }
    };

    if (user?.displayName) {
      fetchRooms();
    }
  }, [user?.displayName]);

  const odayaGir = (room) => {
    setIsInChat(true);
    setRoom(room);
  };

  const handleNewRoomSubmit = async (e) => {
    e.preventDefault();

    // Yeni oda adını Firestore'a ekleyin
    try {
      const docRef = await addDoc(collection(db, "messages"), {
        room: newRoomName,
        createdAt: new Date(),
        admin:user.displayName,
        text: `Bu oda ${user.displayName} tarafından kuruldu.`
      });
      setRooms([...rooms, newRoomName]);
      setNewRoomName("");
      console.log("Yeni oda oluşturuldu:", docRef.id);
    } catch (error) {
      console.error("Yeni oda oluşturulurken hata oluştu:", error);
    }
  };

  if (isAuth) {
    return (
      <AppWrapper>
        <Auth setIsAuth={setIsAuth} />
      </AppWrapper>
    );
  }

  return (
    <AppWrapper>
      {!isInChat ? (
        <>
          <div className="room-list">
            <h1 className="p-4 bg-red-400 text-white font-extrabold text-lg">
              Sohbeti Seçin
            </h1>
            {rooms.map((room) => (
              <div
                className="cursor-pointer bg-slate-500 text-white font-semibold text-md"
                key={room}
                onClick={() => odayaGir(room)}
              >
                {room}
                <hr></hr>
              </div>
            ))}
          </div>

          <form onSubmit={handleNewRoomSubmit} className="mt-4">
            <input
              type="text"
              placeholder="Yeni Oda Adı"
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              className="border  border-gray-300 rounded-md py-2 px-4 mr-2"
            />
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md"
            >
              Oda Oluştur
            </button>
          </form>
        </>
      ) : (
        <Chat room={room} />
      )}
    </AppWrapper>
  );
}

export default ChatApp;
