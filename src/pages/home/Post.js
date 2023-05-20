import React, { useEffect, useState } from "react";
import Icon from "../../components/Icon";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import PostHeader from "../home/post/PostHeader";
import Comment from "../home/post/Comment";
import CommentForm from "../home/post/CommentForm";

const Post = ({ post, users, handleLike, handleDislike }) => {
  const user = users.find((user) => user.username === post.username);
  const currentUser = auth.currentUser;
  const [comments, setComments] = useState([]);
  const now = new Date();
  const postTime = post.createdAt.toDate();
  const diffInMinutes = Math.round((now - postTime) / 60000);

  let timeAgo;
  if (diffInMinutes < 60) {
    timeAgo = `${diffInMinutes} dakika önce`;
  } else {
    const diffInHours = Math.floor(diffInMinutes / 60);
    timeAgo = `${diffInHours} saat önce`;
  }

  const [showCommentForm, setShowCommentForm] = useState(false);
  const [commentText, setCommentText] = useState("");

  const generateCommentId = () => {
    const randomNum = Math.floor(Math.random() * 1000000);
    return randomNum.toString();
  };

  const handleCommentFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const postRef = doc(db, "posts", post.id);
      const postSnapshot = await getDoc(postRef);
      if (postSnapshot.exists()) {
        const postDoc = postSnapshot.data();

        const newComment = {
          id: generateCommentId(),
          content: commentText,
          createdAt: new Date(),
          username: currentUser.displayName,
        };

        const updatedComment = [...(postDoc.comment || []), newComment];

        await updateDoc(postRef, { comment: updatedComment });
        setComments(updatedComment);
        setCommentText("");
        setShowCommentForm(false);
      } else {
        console.error("Güncellenmek istenen belge mevcut değil");
      }
    } catch (error) {
      console.error("Yorum ekleme işlemi sırasında bir hata oluştu:", error);
    }
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const postRef = doc(db, "posts", post.id);
        const postSnapshot = await getDoc(postRef);
        if (postSnapshot.exists()) {
          const postDoc = postSnapshot.data();
          const postComments = postDoc.comment || [];
          setComments(postComments);
        }
      } catch (error) {
        console.error(
          "Yorumları getirme işlemi sırasında bir hata oluştu:",
          error
        );
      }
    };

    fetchComments();
  }, [post.id]);

  
  return (
    <li
      key={post.id}
      className="rounded border border-gray-300 w-[620px] overflow-hidden whitespace-pre-wrap break-words"
    >
      
      <PostHeader post={post} user={user} timeAgo={timeAgo} />
      <p className="p-4 w-[620px] text-md font-semibold overflow-wrap break-word">
        {post.content}
      </p>

      <div className="border border-gray-300 p-2 gap-4 flex items-center justify-center w-[620px]">
        <div>
          <p className="flex items-center justify-center gap-3 h-6 w-12">
            <button
              className={`flex items-center justify-center text-center ${
                post.isActive ? "active" : ""
              }`}
              onClick={() => handleLike(post.id)}
            >
              <Icon name={post.isActive ? "like-filled" : "like"} size={24} />
            </button>
            {post.likes.length}
          </p>
        </div>
        <div>
          <p className="flex items-center justify-center gap-3 h-6 w-12">
            <button
              className={`flex items-center justify-center text-center ${
                post.isActives ? "active" : ""
              }`}
              onClick={() => handleDislike(post.id)}
            >
              <Icon
                name={post.isActives ? "like-filled" : "like"}
                size={24}
                className="transform rotate-180"
              />
            </button>
            {post.dislikes.length}
          </p>
        </div>
        <div>
          <button
            className="flex items-center justify-center text-center gap-x-2"
            onClick={() => setShowCommentForm(!showCommentForm)}
          >
            <Icon name="comment" size={24} /> {comments.length}
          </button>
        </div>
      </div>
      <div className="w-48 text-sm">
        {post.createdAt.toDate().toLocaleString([], {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>
      {showCommentForm && (
        <div>
          <h1>Yorumlar</h1>
          <ul>
            {comments.map((comment) => (
              <Comment key={comment.id} comment={comment} postId={post.id} currentUser={currentUser} />
            ))}
          </ul>
          <CommentForm
            handleCommentFormSubmit={handleCommentFormSubmit}
            commentText={commentText}
            setCommentText={setCommentText}
          />
        </div>
      )}
    </li>
  );
};

export default Post;
