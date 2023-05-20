import React from "react";
import Post from "./Post";
import { auth } from "../../firebase";

const PostsList = ({ users, posts, handleLike, handleDislike }) => {
  const currentUser = auth.currentUser;

  return (
    <ul className="items-center grid justify-center">
      {posts.length === 0 ? (
        <p>Henüz gönderi yok.</p>
      ) : (
        posts.map((post) => {
          const usern = users.find(
            (user) => user.username === currentUser.displayName
          );
          if (
            usern &&
            usern.following &&
            usern.following.some((username) => username === post.username)
          ) {
            return (
              <Post
                key={post.id}
                post={post}
                users={users}
                handleLike={handleLike}
                handleDislike={handleDislike}
              />
            );
          }

          return null;
        })
      )}
    </ul>
  );
};

export default PostsList;

// {posts.length === 0 ? (
//         <p>Henüz gönderi yok.</p>
//       ) : (
//         posts.map((post) => {
//           return users.map((usera) => {

//             return usera.following.map((followingItem, index) => {
//               console.log(followingItem)
//               if (followingItem === post.username) {
//                 return (
//                   <div key={index}>
//                     <Post
//                       key={post.id}
//                       post={post}
//                       users={users}
//                       handleLike={handleLike}
//                       handleDislike={handleDislike}
//                     />
//                   </div>
//                 );
//               }
//               return null;
//             });
//           });
//         })
//       )
//           }
