import React, { useEffect, useState } from "react";
import { update, auth, db } from "../../../firebase";

import { useDispatch, useSelector,} from "react-redux";
import { login } from "../../../stores/auth";
import { Link } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";
import { toast } from "react-hot-toast";

function UpdateProfile() {
  const dispatch = useDispatch();
  
  const [user, setUser] = useState(useSelector((state) => state.auth.user));
  console.log(user)
  const currentUser = auth.currentUser;
  const [displayName, setDisplayName] = useState(currentUser ? currentUser.displayName : null);
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber || 0)
  const [avatar, setAvatar] = useState(user.photoURL || "");

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      await update({
        displayName,
        photoURL: avatar,
        phoneNumber,
      });
  
      const userRef = doc(db, "users", user.displayName);
      await updateDoc(userRef, {
        username:displayName,
        photoURL: avatar,
        phoneNumber,
      });
  
      dispatch(
        login({
          displayName: auth.currentUser.displayName,
          phoneNumber: auth.currentUser.phoneNumber,
          email: auth.currentUser.email,
          emailVerified: auth.currentUser.emailVerified,
          photoURL: auth.currentUser.photoURL,
          uid: auth.currentUser.uid,
        })
      );
  
      toast.success("Profil Güncellendi.");
    } catch (error) {
      toast.error(error.message);
    }
  };
  
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  
  //   try {
  //     const user = auth.currentUser;
  
  //     await update({
  //       displayName,
  //       photoURL: avatar,
  //     });
  
  //     await updatePhoneNumber({
  //       phoneNumber,
  //     });
  
  //     dispatch(
  //       login({
  //         displayName: user.displayName,
  //         phoneNumber: user.phoneNumber,
  //         email: user.email,
  //         emailVerified: user.emailVerified,
  //         photoURL: user.photoURL,
  //         uid: user.uid,
  //       })
  //     );
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  
  
  return (
    <div>
      <form
        className="grid gap-y-4 py-4 max-w-xl mx-auto text-black"
        onSubmit={handleSubmit}
      >
        <h1 className="bg-black text-xl font-bold mb-4 text-white">Update Profile</h1>
        <div>
          <label className="bg-black block text-sm font-medium text-white">Kullanıcı Adı:{user.displayName}</label>
          <input
            type="text"
            placeholder="Kullanıcı adı"
            className="shadow-sm focus:ring_primary focus:border-primary block w-full sm:text-sm border-gma"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          ></input>
        </div>
        <div>
          <button
            className="bg-black cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded"
            type="submit"
          >
            Güncelle
          </button>
        </div>
        <div>
          <label className="bg-black block text-sm font-medium text-white">Telefon: {user.phoneNumber}</label>
          <input
            type="text"
            placeholder="Telefon"
            className="shadow-sm focus:ring_primary focus:border-primary block w-full sm:text-sm border-gma"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          ></input>
        </div>

        <div>
          <button
            className="bg-black cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded"
            type="submit"
          >
            Güncelle
          </button>
        </div>

        <div>
          <label className="bg-black block text-sm font-medium text-white">Profil Fotoğrafı:{<img alt="fotoğraf bulunamadı" src={user.photoURL}/>}</label>
          <input
            type="text"
            placeholder="Avatarı Güncelle"
            className="shadow-sm focus:ring_primary focus:border-primary block w-full sm:text-sm border-gma"
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
          ></input>
        </div>

        <div>
          <button
            className="bg-black cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded"
            type="submit"
          >
            Güncelle
          </button>
        </div>
      </form>
      <Link to="/updatepassword">
        <button className="bg-black cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded">
          Parolayı Güncelle
        </button>
      </Link>
    </div>
  );
}

export default UpdateProfile;
