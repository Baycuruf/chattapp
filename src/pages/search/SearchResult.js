import { doc, getDoc, updateDoc } from "firebase/firestore";
import React from "react";
import { Link } from "react-router-dom";
import { auth, db } from "../../firebase";
import { toast } from "react-hot-toast";

const SearchResults = ({ searchResults }) => {
  const currentUser = auth.currentUser;

  const followUser = async (userToFollow) => {
    try {
      const userDocRef = doc(db, "users", currentUser.displayName);
      const userData = await getDoc(userDocRef);
      const user = userData.data();
      const followingArray = Array.isArray(user.following)
        ? user.following
        : [];
      const isAlreadyFollowing = followingArray.includes(
        userToFollow?.username
      );

      if (isAlreadyFollowing) {
        toast.error("Bu kullanıcıyı zaten takip ediyorsunuz!");
      } else {
        const updatedFollowing = [...followingArray, userToFollow?.username];

        // Kullanıcının takip ettiği kişinin followers listesine eklenmesi
        const followedUserDocRef = doc(db, "users", userToFollow.username);
        const followedUserData = await getDoc(followedUserDocRef);
        const followedUser = followedUserData.data();
        const followersArray = Array.isArray(followedUser.followers)
          ? followedUser.followers
          : [];
        const updatedFollowers = [...followersArray, currentUser.displayName];

        await updateDoc(userDocRef, {
          following: updatedFollowing,
        });

        await updateDoc(followedUserDocRef, {
          followers: updatedFollowers,
        });

        toast.success("Kullanıcı başarıyla takip ediliyor!");
      }
    } catch (error) {
      toast.error("Kullanıcı takip edilemedi:", error);
    }
  };

  const unfollowUser = async (userToUnfollow) => {
    try {
      const userDocRef = doc(db, "users", currentUser.displayName);
      const userData = await getDoc(userDocRef);
      const user = userData.data();
      const isFollowing =
        user.following && user.following.includes(userToUnfollow.username);

      if (isFollowing) {
        const updatedFollowing = user.following.filter(
          (userId) => userId !== userToUnfollow.username
        );

        await updateDoc(userDocRef, {
          following: updatedFollowing,
        });
        toast.success("Kullanıcı takipten başarıyla çıkarıldı!");
      } else {
        toast.error("Bu kullanıcıyı zaten takip etmiyorsunuz!");
      }
    } catch (error) {
      toast.error("Kullanıcı takipten çıkarılamadı:", error);
    }
  };

  if (searchResults.length === 0) {
    return <p>Aradığınız kullanıcı bulunamadı.</p>;
  }

  return (
    <ul>
      {searchResults.map((user) => (
        <div
          className="flex gap-2 bg-gray-300 rounded-md p-2 m-4"
          key={user.id}
        >
         
          <div className="flex justify-center items-center gap-2">
            <div>{user.username}</div>
            <img
              src={user.photoURL}
              alt={user.username}
              className="w-8 h-8 rounded-full"
            />
          </div>
          <div className="p-2 gap-2 flex">
            <button
              className="w-20 h-10 bg-blue-500 rounded items-center justify-center text-center"
              onClick={() => followUser(user)}
            >
              Takip Et
            </button>
            <button
              className="w-20 h-10 bg-yellow-500 rounded items-center justify-center text-center"
              onClick={() => unfollowUser(user)}
            >
              Takipi Bırak
            </button>
            <Link
              className="w-20 h-10 flex bg-green-500 rounded text-center justify-center items-center"
              to={`/profile/${user.username}`}
            >
              Profile Git
            </Link>
          </div>
        </div>
      ))}
    </ul>
  );
};

export default SearchResults;
