// PostsList.js
import React from "react";
import Post from "../home/Post";

const PostsList = ({ posts, users, handleLike, handleDislike }) => {
  return (
    <ul className="items-center grid justify-center">
      {posts.length === 0 ? (
        <p>Henüz gönderi yok.</p>
      ) : (
        posts.map((post) => (
          <Post
            key={post.id}
            post={post}
            users={users}
            handleLike={handleLike}
            handleDislike={handleDislike}
          />
        ))
      )}
    </ul>
  );
};

export default PostsList;
