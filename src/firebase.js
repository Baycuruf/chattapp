import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  updateProfile,
} from "firebase/auth";
import { getFirestore} from "@firebase/firestore";
import { toast } from "react-hot-toast";
import { login as loginHandle, logout as logoutHandle } from "./stores/auth";
import stores from "./stores";


const firebaseConfig = {
  apiKey: "AIzaSyBK1a-xToHW0ft-BTuZlOH-tmEydYU_TGg",
  authDomain: "chatting-app-249bd.firebaseapp.com",
  databaseURL: "https://chatting-app-249bd-default-rtdb.firebaseio.com",
  projectId: "chatting-app-249bd",
  storageBucket: "chatting-app-249bd.appspot.com",
  messagingSenderId: "282903896634",
  appId: "1:282903896634:web:090df924a7235e337d0b03",
  measurementId: "G-MVQ2LWPF8K",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

// export const register = async ({ email, password,username }) => {
//     try {
//       const response = await createUserWithEmailAndPassword(
//         auth,
//         email,
//         password
//       );
//       if (response.user) {
//         await updateProfile(auth.currentUser, {
//           displayName: username
//         });

//         return response.user;
//       }
//     } catch (error) {
//       console.error(error.code);
//     }
//   };




export const register = async (email, password) => {
  try {
    const { user } = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );


    return user;
  } catch (error) {
    console.log(error);
  }
};

export const getUserInfo = async (uname) => {
  try {
    const username = await updateProfile(auth.currentUser.displayName);
    if (username.exists()) {
      const user = await auth.currentUser;
      return user;
    } else {
      toast.error("Kullanıcı Bulunamadı!");
      throw new Error("Kullanıcı Bulunamadı!");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const login = async (email, password) => {
  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    return user;
  } catch (error) {
    toast.error(error.message);
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    toast.error(error.message);
  }
};
export const update = async (data) => {
  try {
    await updateProfile(auth.currentUser, data);
    console.log(data);
    toast.success("Profil Güncellendi.");
    return true;
  } catch (error) {
    toast.error(error.message);
  }
};
//PAROLAYI GÜNCELLEME
export const resetPassword = async (password) => {
  try {
    await updatePassword(auth.currentUser, password);
    console.log("Parola Güncellendi.");
    return true;
  } catch (error) {
    console.log(error.message);
  }
};
export const emailVerification = async () => {
  try {
    await sendEmailVerification(auth.currentUser);
    toast.success(
      `Doğrulama maili ${auth.currentUser.email} adresine gönderildi.`
    );
  } catch (error) {
    toast.error(error.message);
  }
};
onAuthStateChanged(auth, (user) => {
  if (user) {
    stores.dispatch(
      loginHandle({
        displayName: user.displayName,
        email: user.email,
        emailVerified: user.emailVerified,
        photoURL: user.photoURL,
        phoneNumber: user.phoneNumber,
        uid: user.uid,
      })
    );
  } else {
    stores.dispatch(logoutHandle());
  }
});
