import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../../firebase";

const Comment = ({ comment, postId, currentUser }) => {
  const [user, setUser] = useState(null);
  const [timeAgo, setTimeAgo] = useState("");
  const [deleted, setDeleted] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Kullanıcıyı kullanıcı adına göre sorgula
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("username", "==", comment.username));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          // İlk eşleşen kullanıcıyı al
          const userData = querySnapshot.docs[0].data();
          setUser(userData);
        }
      } catch (error) {
        console.error(
          "Kullanıcı verilerini getirme işlemi sırasında bir hata oluştu:",
          error
        );
      }
    };

    fetchUser();
  }, [comment.username]);

  useEffect(() => {
    const calculateTimeAgo = () => {
      const now = new Date();
      const createdAt =
        comment.createdAt instanceof Date
          ? comment.createdAt
          : comment.createdAt.toDate();
      const diffInMinutes = Math.round((now - createdAt) / 60000);

      if (diffInMinutes < 60) {
        setTimeAgo(`${diffInMinutes} dakika önce`);
      } else {
        const diffInHours = Math.floor(diffInMinutes / 60);
        setTimeAgo(`${diffInHours} saat önce`);
      }
    };

    calculateTimeAgo();
  }, [comment.createdAt]);

  const handleDeleteComment = async (postId, commentId) => {
    try {
      const postRef = doc(db, "posts", postId);
      const postSnapshot = await getDoc(postRef);

      if (postSnapshot.exists()) {
        const postDoc = postSnapshot.data();
        const updatedComments = postDoc.comment.filter(
          (comment) => comment.id !== commentId
        );

        await updateDoc(postRef, { comment: updatedComments });

        console.log("Yorum başarıyla silindi.");
        setDeleted(true);
      } else {
        console.error("Güncellenmek istenen belge mevcut değil");
      }
    } catch (error) {
      console.error("Yorumu silme işlemi sırasında bir hata oluştu:", error);
    }
  };

  return (
    <div key={comment.id} className={`w-full p-2 ${deleted ? "hidden" : ""}`}>
      {user && (
        <div className="flex items-center border border-gray-300 p-2">
          <div className="p-2">
            <li className="flex justify-center items-center text-center font-bold">
              <img
                className="w-8 h-8 rounded-full mr-2"
                src={user.photoURL}
                alt={user.username}
              />{" "}
              {comment.username}{" "}
              <span className="p-1 text-gray-400 font-semibold">{timeAgo}</span>{" "}
              {currentUser.displayName === comment.username && (
                <button onClick={() => handleDeleteComment(postId, comment.id)}>
                  Sil
                </button>
              )}
            </li>
            <li className="p-2 ml-8">{comment.content}</li>
          </div>
        </div>
      )}
    </div>
  );
};

export default Comment;
