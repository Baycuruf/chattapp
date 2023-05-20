// Home.js
import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  onSnapshot,
  updateDoc,
  doc,
  getDocs,
  orderBy,
} from "firebase/firestore";
import { auth } from "../../firebase";
import { db } from "../../firebase";
import PostsList from "./PostList";

const Home = () => {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const user = auth.currentUser;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const usersData = querySnapshot.docs.map((doc) => doc.data());
        setUsers(usersData);
      } catch (error) {
        console.error("Hata:", error);
      }
    };

    const fetchPosts = async () => {
      try {
        const postsCollection = collection(db, "posts");
        const q = query(postsCollection, orderBy("createdAt", "desc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
          const fetchedPosts = [];
          snapshot.forEach((doc) => {
            fetchedPosts.push({ id: doc.id, ...doc.data() });
          });

          setPosts(fetchedPosts);
        });

        return () => {
          unsubscribe();
        };
      } catch (error) {
        console.error("Gönderiler alınırken bir hata oluştu:", error);
      }
    };

    fetchUsers();
    fetchPosts();
  }, []);

  const handleLike = async (postId) => {
    try {
      const postRef = doc(db, "posts", postId);
      const post = posts.find((post) => post.id === postId);

      if (post.likes.includes(user.displayName)) {
        await updateDoc(postRef, {
          likes: post.likes.filter((like) => like !== user.displayName),
          isActive: false,
        });
      } else {
        await updateDoc(postRef, {
          likes: [...post.likes, user.displayName],
          dislikes: post.dislikes.filter(
            (dislike) => dislike !== user.displayName
          ),
          isActive: true,
        });
      }
    } catch (error) {
      console.error("Like işlemi sırasında bir hata oluştu:", error);
    }
  };

  const handleDislike = async (postId) => {
    try {
      const postRef = doc(db, "posts", postId);
      const post = posts.find((post) => post.id === postId);

      if (post.dislikes.includes(user.displayName)) {
        await updateDoc(postRef, {
          dislikes: post.dislikes.filter(
            (dislike) => dislike !== user.displayName
          ),
          isActive: false,
        });
      } else {
        await updateDoc(postRef, {
          dislikes: [...post.dislikes, user.displayName],
          likes: post.likes.filter((like) => like !== user.displayName),
          isActive: true,
        });
      }
    } catch (error) {
      console.error("Dislike işlemi sırasında bir hata oluştu:", error);
    }
  };

  return (
    <div className="w-full justify-center p-8 items-center text-white">
      <h2 className="font-bold text-xl flex justify-center p-4">Gönderiler</h2>
      <PostsList
        posts={posts}
        users={users}
        handleLike={handleLike}
        handleDislike={handleDislike}
      />
    </div>
  );
};

export default Home;



// import React, { useEffect, useState } from "react";
// import {
//   collection,
//   query,
//   onSnapshot,
//   updateDoc,
//   doc,
//   getDocs,
//   orderBy,
// } from "firebase/firestore";
// import { auth } from "../firebase";
// import { db } from "../firebase";
// import Icon from "../components/Icon";

// const Home = () => {
//   //FİRESTOREDAKİ USERSLARI DÖNDÜRMEK İÇİN
//   const [users, setUsers] = useState([]);

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const querySnapshot = await getDocs(collection(db, "users"));
//         const usersData = querySnapshot.docs.map((doc) => doc.data());
//         setUsers(usersData);
//       } catch (error) {
//         console.error("Hata:", error);
//       }
//     };

//     fetchUsers();
//   }, []);

//   /////BURAYA KADAR
//   const user = auth.currentUser;
//   const [posts, setPosts] = useState([]);

//   useEffect(() => {
//     const fetchPosts = async () => {
//       try {
//         const postsCollection = collection(db, "posts");
//         const q = query(postsCollection, orderBy("createdAt", "desc")); // Oluşturulma tarihine göre azalan sırayla sırala

//         const unsubscribe = onSnapshot(q, (snapshot) => {
//           const fetchedPosts = [];
//           snapshot.forEach((doc) => {
//             fetchedPosts.push({ id: doc.id, ...doc.data() });
//           });

//           setPosts(fetchedPosts);
//         });

//         return () => {
//           unsubscribe();
//         };
//       } catch (error) {
//         console.error("Gönderiler alınırken bir hata oluştu:", error);
//       }
//     };

//     fetchPosts();
//   }, []);

//   const handleLike = async (postId) => {
//     try {
//       const postRef = doc(db, "posts", postId);
//       const post = posts.find((post) => post.id === postId);

//       if (post.likes.includes(user.displayName)) {
//         // Kullanıcının adı zaten likes dizisinde, bu nedenle sil
//         await updateDoc(postRef, {
//           likes: post.likes.filter((like) => like !== user.displayName),
//           isActive: false, // Ekstra veriyi güncelle (isActive değerini false yap)
//         });
//       } else {
//         // Kullanıcının adı likes dizisinde yok, bu nedenle ekle ve dislikes dizisinden sil
//         await updateDoc(postRef, {
//           likes: [...post.likes, user.displayName],
//           dislikes: post.dislikes.filter(
//             (dislike) => dislike !== user.displayName
//           ),
//           isActive: true,
//           // Ekstra veriyi güncelle (isActive değerini true yap)
//         });
//       }
//     } catch (error) {
//       console.error("Like işlemi sırasında bir hata oluştu:", error);
//     }
//   };

//   const handleDislike = async (postId) => {
//     try {
//       const postRef = doc(db, "posts", postId);
//       const post = posts.find((post) => post.id === postId);

//       if (post.dislikes.includes(user.displayName)) {
//         // Kullanıcının adı zaten dislikes dizisinde, bu nedenle sil
//         await updateDoc(postRef, {
//           dislikes: post.dislikes.filter(
//             (dislike) => dislike !== user.displayName
//           ),
//           isActives: false, // Ekstra veriyi güncelle (isActive değerini true yap)
//         });
//       } else {
//         // Kullanıcının adı dislikes dizisinde yok, bu nedenle ekle ve likes dizisinden sil
//         await updateDoc(postRef, {
//           dislikes: [...post.dislikes, user.displayName],
//           likes: post.likes.filter((like) => like !== user.displayName),
//           isActives: true, // Ekstra veriyi güncelle (isActive değerini true yap)
//         });
//       }
//     } catch (error) {
//       console.error("Dislike işlemi sırasında bir hata oluştu:", error);
//     }
//   };

//   return (
//     <div className="w-full justify-center p-8 items-center text-white ">
//       <h2 className="font-bold text-xl flex justify-center p-4">Gönderiler</h2>
//       {posts.length === 0 ? (
//         <p>Henüz gönderi yok.</p>
//       ) : (
//         <ul className=" items-center grid justify-center">
//           {posts.map((post) => {
//             // Kullanıcıyı bul
//             const user = users.find((user) => user.username === post.username);
//             //BURADA POST DATE TARİHİNİ TİME AGOYA DÖNÜŞTÜRÜYORUM
//             const now = new Date();
//             const postTime = post.createdAt.toDate();
//             const diffInMinutes = Math.round((now - postTime) / 60000); // Farkı dakikaya çevir

//             let timeAgo;

//             if (diffInMinutes < 60) {
//               timeAgo = `${diffInMinutes} dakika önce`;
//             } else {
//               const diffInHours = Math.floor(diffInMinutes / 60); // Farkı saate çevir
//               timeAgo = `${diffInHours} saat önce`;
//             }
//           /// AYNEN ÖYLE ///
//             return (
//               <li
//                 key={post.id}
//                 className="rounded border border-gray-300 w-[620px] overflow-hidden whitespace-pre-wrap break-words"
//               >
//                 <div className="rounded flex text-base font-bold w-[620px] h-20">
//                   {user && user.photoURL && (
//                     <div className="flex items-center p-2">
//                       <img
//                         className="w-16 h-16 rounded-full  "
//                         src={user.photoURL}
//                         alt={user.username}
//                       />
//                     </div>
//                   )}
//                   <div className="justify-end h-20 text-center items-center flex gap-4 ">
//                     {post.username}
//                    <span className="text-gray-400 font-semibold">{timeAgo}</span> 
//                   </div>
//                 </div>
//                 <p className=" p-4 w-[620px] -center -center  -center text-md font-semibold overflow-wrap break-word">
//                   {post.content}
//                 </p>
//                 <div className="border border-gray-300 p-2 gap-4 flex items-center justify-center w-[620px]">
//                   <div>
//                     <p className="flex items-center justify-center gap-3 h-6 w-12">
//                       <button
//                         className={`flex items-center justify-center text-center ${
//                           post.isActive ? "active" : ""
//                         }`}
//                         onClick={() => handleLike(post.id)}
//                       >
//                         <Icon
//                           name={post.isActive ? "like-filled" : "like"}
//                           size={24}
//                         />
//                       </button>

//                       {post.likes.length}
//                     </p>
//                   </div>
//                   <div>
//                     <p className="flex items-center justify-center gap-3 h-6 w-12">
//                       <button
//                         className={`flex items-center justify-center text-center ${
//                           post.isActives ? "active" : ""
//                         }`}
//                         onClick={() => handleDislike(post.id)}
//                       >
//                         <Icon
//                           name={post.isActives ? "like-filled" : "like"}
//                           size={24}
//                           className="transform rotate-180"
//                         />
//                       </button>

//                       {post.dislikes.length}
//                     </p>
//                   </div>
                 
//                 </div>
//                 <div className="w-48 text-sm">
//                   {" "}
//                   {post.createdAt.toDate().toLocaleString([], {
//                     year: "numeric",
//                     month: "long",
//                     day: "numeric",
//                     hour: "2-digit",
//                     minute: "2-digit",
//                   })}
//                 </div>
//               </li>
//             );
//           })}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default Home;