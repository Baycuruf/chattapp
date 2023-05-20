import React, { useEffect, useState } from "react";
import { auth, db } from "../../../firebase";
import { useSelector } from "react-redux";
import { collection, getDocs } from "firebase/firestore";
import { useParams } from "react-router-dom";

function Header() {
  const { username } = useParams();
  const [user, setUser] = useState(useSelector((state) => state.auth.user));
  console.log(user)
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
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
    <header className="flex items-center px-24 gap-x-24 py-4 pb-10">
      <div>
        <nav className="flex items-center gap-x-10">
          <div className="flex">
            {users.map((usera) => {
              if (usera.username === username) {
                return (
                  <div className="flex items-center px- gap-x-20 py-4 ">
                    <img
                      alt=""
                      src={usera.photoURL || "/no-avatar.jpg"}
                      className="w-[150px] h-[150px] rounded-full"
                    />
                    <div className="mb-4">
                      <h1 className="text-[28px] font-bold">
                        {usera.username}
                      </h1>
                    </div>
                    <div className="flex gap-4" key={usera.uid}>
                      <div className="font-semibold">
                        Gönderi : {usera.post.length}
                      </div>
                      <div className="font-semibold">
                        Takip edilen : {usera.following.length}
                      </div>
                      <div className="font-semibold">
                        Takipçi : {usera.followers.length}
                      </div>
                      <div className="font-semibold">tel: {usera.phoneNumber}</div>
                    </div>
                  </div>
                );
              } else {
                return null; // Giriş yapmış kullanıcıyı liste dışında tutar
              }
            })}{" "}
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;
