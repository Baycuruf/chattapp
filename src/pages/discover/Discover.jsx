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
import PostsList from "./Postlist";

const Discover = () => {
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
      <h2 className="font-bold text-xl flex justify-center p-4">Keşfet</h2>
      <PostsList
        posts={posts}
        users={users}
        handleLike={handleLike}
        handleDislike={handleDislike}
      />
    </div>
  );
};

export default Discover;



