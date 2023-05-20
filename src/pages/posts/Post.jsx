import React, { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  deleteDoc,
  updateDoc,
  doc,
  getDoc,

} from "firebase/firestore";
import { auth } from "../../firebase";
import Icon from "../../components/Icon";
import { toast } from "react-hot-toast";


const Post = () => {
  const user = auth.currentUser;
  const [posts, setPosts] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(null);
  
  
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const db = getFirestore();
        const postsCollection = collection(db, "posts");

        // Sadece mevcut kullanıcının gönderilerini al
        const q = query(
          postsCollection,
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
        );

        // Gönderileri dinle
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const fetchedPosts = [];
          snapshot.forEach((doc) => {
            fetchedPosts.push({ id: doc.id, ...doc.data() });
          });

          // Gönderileri state'e atmadan önce kontrol et
          if (fetchedPosts.length > 0) {
            setPosts(fetchedPosts);
          }
        });

        return () => {
          // Abonelikten çıkarken temizlik yap
          unsubscribe();
        };
      } catch (error) {
        console.error("Gönderiler alınırken bir hata oluştu:", error);
      }
    };

    if (user) {
      // Kullanıcı oturum açmışsa gönderileri al
      fetchPosts();
    }
  }, [user]);

  const handleDelete = async (postId) => {
    try {
      const db = getFirestore();
      const postRef = doc(db, "posts", postId);
  
      // İlgili gönderiyi sil
      await deleteDoc(postRef);
  
      // Kullanıcı koleksiyonunu güncelle
      if (user) {
        const userRef = doc(db, "users", user.displayName);
        const userDoc = await getDoc(userRef);
  
        // Kullanıcının gönderilerini güncelle
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (Array.isArray(userData.post)) {
            const updatedPosts = userData.post.filter((post) => post !== postId);
  
            // Kullanıcının gönderilerini güncellenmiş diziyi kullanarak güncelle
            await updateDoc(userRef, { post: updatedPosts });
  
            // Gönderiyi listeden kaldır
            setPosts((prevPosts) =>
              prevPosts.filter((post) => post.id !== postId)
            );
  
            toast.success("Gönderi silindi");
            return;
          }
        }
      }
  
      toast.error("Gönderi silinirken bir hata oluştu");
    } catch (error) {
      console.error("Gönderi silinirken bir hata oluştu:", error);
      toast.error("Gönderi silinirken bir hata oluştu");
    }
  };
  
  
  
  const handleEdit = async (postId, content) => {
    try {
      const db = getFirestore();
      const postRef = doc(db, "posts", postId);
      await updateDoc(postRef, { content });
    } catch (error) {
      console.error("Gönderi güncellenirken bir hata oluştu:", error);
    }
  };

  return (
    <div>
      {posts.length === 0 ? (
        <p>Henüz gönderi yok.</p>
      ) : (
        <ul className="grid items-center grid-cols-2">
          {posts.map((post) => (
            <li
              key={post.id}
              className="border border-black  items-center text-center"
            >
              {post.editing ? (
                <div className="grid items-center w-[420px] h-[230px] gap-3 mb-12">
                  <textarea
              className="text-black w-[420px] h-[190px] font-semibold resize-none "
                    value={post.content}
                    onChange={(e) => {
                      const updatedPosts = [...posts];
                      updatedPosts.find((p) => p.id === post.id).content =
                        e.target.value;
                      setPosts(updatedPosts);
                    }}
                  ></textarea>
                  <div className="flex items-center justify-center text-center"><button
                  className="bg-green-600 rounded w-24 h-12 flex items-center justify-center"
                    onClick={() => {
                      handleEdit(post.id, post.content);
                      const updatedPosts = [...posts];
                      updatedPosts.find(
                        (p) => p.id === post.id
                      ).editing = false;
                      setPosts(updatedPosts);
                    }}
                  >
                    Kaydet
                  </button></div>
                  
                </div>
              ) : (
                <div className="w-[420px] overflow-hidden whitespace-pre-wrap break-words">
                  <p className="border border-black p-4 h-48 w-[420px] justify-center overflow-hidden">{post.content}</p>
                  <div className="border border-black p-2 gap-4 flex items-center justify-center">
                    <p className="flex items-center justify-center gap-3 h-6 w-12">
                      <Icon name="like" size={12} /> {""} {post.likes.length}
                    </p>
                    <p className="flex items-center justify-center gap-3 h-6 w-12">
                      <Icon
                        name="like"
                        className="transform rotate-180"
                        size={12}
                      />
                      {post.dislikes.length}
                    </p>
                  </div>
                  <div className="flex gap-x-4 p-4 justify-center items-center">
                    <button
                      onClick={() => {
                        const updatedPosts = [...posts];
                        updatedPosts.find(
                          (p) => p.id === post.id
                        ).editing = true;
                        setPosts(updatedPosts);
                      }}
                    >
                      <Icon name="edit" size={12} />
                    </button>
                    <button
                    onClick={() => setConfirmDelete(post.id)}
                  >
                    <Icon name="close" size={12} />
                  </button>
                  {confirmDelete === post.id && (
                  <div className="text-sm  h-[8px] flex gap-x-2 justify-center items-center text-center">
                      <p className="p-4">Emin misiniz?</p>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="bg-green-500 rounded p-2"
                      >
                        Evet
                      </button>
                      <button
                        onClick={() => setConfirmDelete(null)}
                        className="bg-red-500 rounded p-2"
                      >
                        Hayır
                      </button>
                    </div>
                     )}
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Post;
