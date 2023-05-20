import { collection, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { auth, db } from '../../firebase';
import { toast } from 'react-hot-toast';

function Likes() {
  const currentUser = auth.currentUser;
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, "users");
        const querySnapshot = await getDocs(usersCollection);
        const usersData = querySnapshot.docs.map((doc) => doc.data());
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

 
  const followUser = async (userToFollow) => {
    try {
      const userDocRef = doc(db, "users", currentUser.displayName);
      const userData = await getDoc(userDocRef);
      const user = userData.data();
      const followingArray = Array.isArray(user.following) ? user.following : [];
      const isAlreadyFollowing = followingArray.includes(userToFollow?.username);
  
      if (isAlreadyFollowing) {
        toast.error("Bu kullanıcıyı zaten takip ediyorsunuz!");
      } else {
        const updatedFollowing = [...followingArray, userToFollow?.username];
  
        // Kullanıcının takip ettiği kişinin followers listesine eklenmesi
        const followedUserDocRef = doc(db, "users", userToFollow.username);
        const followedUserData = await getDoc(followedUserDocRef);
        const followedUser = followedUserData.data();
        const followersArray = Array.isArray(followedUser.followers) ? followedUser.followers : [];
        const updatedFollowers = [...followersArray, currentUser.displayName];
  
        await updateDoc(userDocRef, {
          following: updatedFollowing
        });
  
        await updateDoc(followedUserDocRef, {
          followers: updatedFollowers
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
      const isFollowing = user.following && user.following.includes(userToUnfollow.username);
  
      if (isFollowing) {
        const updatedFollowing = user.following.filter(userId => userId !== userToUnfollow.username);
  
        await updateDoc(userDocRef, {
          following: updatedFollowing
        });
        toast.success("Kullanıcı takipten başarıyla çıkarıldı!");
      } else {
        toast.error("Bu kullanıcıyı zaten takip etmiyorsunuz!");
      }
    } catch (error) {
      toast.error("Kullanıcı takipten çıkarılamadı:", error);
    }
  };

  return (
    <div>
      {users.map((user) => {
        if (user.uid !== currentUser?.uid) {
          return (
            <div className="mt-2 flex items-center gap-4 p-4 " key={user.uid}>
              <div>
                <img className='w-12 h-12 rounded-full' alt='bulunamadı' src={user.photoURL || "no-avatar.jpg"} />
              </div>
              <div className='flex items-center bg-red-700 rounded border border-black p-2'>{user.username}</div>
              <div className='flex items-center bg-green-700 border border-black p-2'>Takipçi: {user.followers.length}</div>
              <div className='flex items-center bg-green-700 border border-black p-2'>Takip edilen: {user.following.length}</div>
              <div className='flex items-center bg-blue-600 border border-black p-2'>post: {user.post.length}</div>
              
              <div className='flex gap-4'>
               
                <button className='w-24 h-12 bg-blue-500 rounded' onClick={() => followUser(user)}>Takip Et</button>
                <button className='w-24 h-12 bg-yellow-500 rounded' onClick={() => unfollowUser(user)}>Takipten Çıkar</button>
              </div>
            </div>
          );
        } else {
          return null; // Giriş yapmış kullanıcıyı liste dışında tutar
        }
      })}
    </div>
  );
}

export default Likes;

// const addFriend = async (friendUser) => {
//   try {
//     const userDocRef = doc(db, "users", currentUser.displayName);
//     const userData = await getDoc(userDocRef);
//     const user = userData.data();
//     const isAlreadyFriend = user.friends && user.friends.includes(friendUser.username);

//     if (isAlreadyFriend) {
//       toast.error("Bu kullanıcı zaten eklenmiş!");
//     } else {
//       const updatedFriends = [...user.friends, friendUser.username];

//       await updateDoc(userDocRef, {
//         friends: updatedFriends
//       });
//       toast.success("Arkadaş başarıyla eklendi!");
//     }
//   } catch (error) {
//     toast.error("Arkadaş Eklenemedi:", error);
//   }
// };

// const removeFriend = async (friendUser) => {
//   try {
//     const userDocRef = doc(db, "users", currentUser.displayName);
//     const userData = await getDoc(userDocRef);
//     const user = userData.data();
//     const isFriend = user.friends && user.friends.includes(friendUser.username);

//     if (isFriend) {
//       const updatedFriends = user.friends.filter(friendId => friendId !== friendUser.username);

//       await updateDoc(userDocRef, {
//         friends: updatedFriends
//       });
//       toast.success("Arkadaşlıktan başarıyla çıkarıldı!");
//     } else {
//       toast.error("Bu kullanıcı zaten arkadaş değil!");
//     }
//   } catch (error) {
//     toast.error("Arkadaş Silinemedi:", error);
//   }
// };