// import React, { useEffect } from "react";
// import { auth, register } from "../../firebase";
// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { GoogleAuthProvider, signInWithPopup, updateProfile } from "firebase/auth";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";

// function Register() {
//   const [email, setEmail] = useState("");
//   const [displayName, setDisplayName] = useState("");
//   const [password, setPassword] = useState("");
//   const [user, setUser] = useState(auth.currentUser);
//   console.log(user);
//   const navigate = useNavigate();

//   const handleGoogleSignIn = async () => {
//     const provider = new GoogleAuthProvider();
//     try {
//       const result = await signInWithPopup(auth, provider);
//       const user = result.user;
//       if (user) {
//         const username = user.displayName;
//         navigate(`/${username}`, {
//           replace: true,
//         });
//       }
      
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged((currentUser) => {
//       setUser(currentUser);
//     });

//     return () => unsubscribe();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const user = await register(email, password);
//    await updateProfile(user, { displayName })
  
//     if (user) {
//       const username = user.displayName;
//       navigate(`/${username}`, {
//         replace: true,
//       });
//     }
    
//   };

//   const validationSchema = Yup.object().shape({
//     email: Yup.string().email("Geçerli bir e-posta adresi girin").required("E-posta alanı zorunludur"),
//     displayName: Yup.string().required("Kullanıcı adı alanı zorunludur"),
//     password: Yup.string().required("Parola alanı zorunludur"),
//   });
  
//   return (
//     <div>
//       <Formik
//         initialValues={{ email: "", displayName: "", password: "" }}
//         validationSchema={validationSchema}
//         onSubmit={handleSubmit}
//       >
//       <Form
//         className="grid gap-y-4 py-4 max-w-xl mx-auto text-black"
//         onSubmit={handleSubmit}
//       >
//         <div>
          
//           <Field
//             type="email"
//             name="email"
//             placeholder="E-mail"
//             className="shadow-sm focus:ring_primary focus:border-primary block w-full sm:text-sm border-gma h-9"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />
//           <ErrorMessage name="email" component="div" className="text-red-500" />
//         </div>

//         <div>
          
//           <Field
//             name="displayName"
//             placeholder="Kullanıcı Adı"
//             className="shadow-sm focus:ring_primary focus:border-primary block w-full sm:text-sm border-gma h-9"
//             value={displayName}
//             onChange={(e) => setDisplayName(e.target.value)}
//           />
//            <ErrorMessage name="displayName" component="div" className="text-red-500" />
//         </div>

//         <div>
          
//           <Field
//             type="password"
//             name="password"
//             placeholder="Parola"
//             className="shadow-sm focus:ring_primary focus:border-primary block w-full sm:text-sm border-gma h-9"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />
//            <ErrorMessage name="password" component="div" className="text-red-500" />
//         </div>
//         <div>
//           <button
//             className="bg-black cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded"
//             disabled={!email || !password}
//             type="submit"
//             onSubmit={handleSubmit}
//           >
//             Kayıt ol
//           </button>
//         </div>
        
//         <div className="flex gap-4">
//         <button
//           className="bg-red-500 cursor-pointer text-white font-bold py-2 px-4 rounded"
//           type="button"
//           onClick={handleGoogleSignIn}
//         >
//           Google ile giriş yap
//         </button>
//         <div className="flex items-center text-center justify-center">
//         <Link className=" rounded text-green-500 font-semibold h-10 tex-center p-2" to="/auth/login">
//           Zaten Hesabın Var Mı ? Giriş Yap
//         </Link>
//       </div>
//       </div>

      
//       </Form>
//       </Formik>
//     </div>
//   );
// }

// export default Register;
import React, { useState, useEffect } from "react";
import {  db } from "../../firebase";
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
        {messages.map((message) => (
        <>
        {user.displayName === message.user ? (
        <div key={message.id} className="message flex justify-end pr-4">
        <span className="user flex text-center">
          {users.map((user) => (
          <div className="mt-2">
            {message.user === user.displayName ?(<img src={user.photoURL} className="w-8 rounded-full" alt="bulunamadı"/>):("samine")}
            
          </div>))}
          
         <div className="border bg-purple-700 text-gray-100 rounded-lg h-8 ml-2 mr-2 font-semibold mt-2 p-2 flex justify-center text-center items-center">{message.text}</div></span> 
      </div>
        ):(
        <div key={message.id} className="message flex justify-start ">
            <span className="user flex text-center">
              {users.map((user) => (
              <div className="mt-2">
                {message.user === user.displayName ?(<img src={user.photoURL} className="w-8 rounded-full" alt="bulunamadı"/>):("sami")}
              </div>))}
              
              <div className="border bg-purple-700 text-gray-100 rounded-lg h-8 ml-2 mr-2 mt-2 font-semibold p-2 text-center flex items-center">{message.text}</div></span>
          </div>)}
       
          </>
          
        ))}
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
