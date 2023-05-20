import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { NavLink, useParams } from 'react-router-dom';
import { db } from '../../../firebase';
import Header from '../components/Header';
import Icon from '../../../components/Icon';
import classNames from 'classnames';


function Profile() {
    const { username } = useParams();
    const [users, setUsers] = useState([]);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchUserData = async () => {
          try {
            const usersCollection = collection(db, "users");
            const usersSnapshot = await getDocs(usersCollection);
            const usersData = usersSnapshot.docs.map((doc) => doc.data());
            setUsers(usersData);
      
            const postsCollection = collection(db, "posts");
            const postsSnapshot = await getDocs(postsCollection);
            const postsData = postsSnapshot.docs.map((doc) => doc.data());
            setPosts(postsData);
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        };
      
        fetchUserData();
      }, []);
      
  return (
    <div className='flex justify-center items-center text-center'>
      {users.map((user) => {
        if(user.username === username){
            return <div key={user.uid}>
                <Header user={user} />
                <nav className="border-t flex gap-x-16 justify-center items-center">
          <NavLink
            to={`/profile/${username}`}
            end={true}
            className={({ isActive }) =>
              classNames({
                "text-xs flex py-5 border-t tracking-widest items-center gap-x-1.5 font-semibold": true,
                "text-[#8e8e8e] border-transparent": !isActive,
                "text-black border-black": isActive,
              })
            }
          >
            <Icon name="posts" size={12} />
            GÖNDERİLER
          </NavLink>
          <NavLink
            to={`/profile/${username}/reels`}
            end={true}
            className={({ isActive }) =>
              classNames({
                "text-xs flex py-5 border-t tracking-widest items-center gap-x-1.5 font-semibold": true,
                "text-[#8e8e8e] border-transparent": !isActive,
                "text-black border-black": isActive,
              })
            }
          >
            <Icon name="reels" size={12} />
            REELS
          </NavLink>
          <NavLink
            to={`/profile/${username}/tagged`}
            end={true}
            className={({ isActive }) =>
              classNames({
                "text-xs flex py-5 border-t items-center tracking-widest gap-x-1.5 font-semibold": true,
                "text-[#8e8e8e] border-transparent": !isActive,
                "text-black border-black": isActive,
              })
            }
          >
            <Icon name="tickets" size={12} />
            ETİKETLENENLER
          </NavLink>
          
        </nav>
        <div className='flex justify-center flex-col items-center gap-4 pt-10'>
      <div className='h-[62px] w-[62px] border-2 rounded-full border-black flex items-center justify-center'>
        <Icon name="posts" size={32}/>
      </div>
      {posts.map((post) => {
        
        if (post.username === username){
            return (
                <h6 key={post.userId} className='text-md font-bold flex'>
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
                              
                            
                            </div>
                          </div>
          
          
                </h6>
            );
        }
        return null;
      })}

      
      
    </div>
            </div>

        }
        else{
            return null
        }
      })}
    </div>
  )
}

export default Profile
