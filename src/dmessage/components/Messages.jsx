import React from 'react'
import { useEffect, useState } from 'react';
  import { collection, getDocs } from 'firebase/firestore';
  import { db } from '../../../firebase';

  
  
  const Messages = () => {
    const [users, setUsers] = useState([]);
  
    useEffect(() => {
      const fetchUsers = async () => {
        try {
          const querySnapshot = await getDocs(collection(db, 'messages'));
          const fetchedUsers = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setUsers(fetchedUsers);
        } catch (error) {
          console.log('Error fetching users:', error);
        }
      };
  
      fetchUsers();
    }, []);
  
    return (
      <div className=''>
        <h1>Arkadaşlar</h1>
        
        <ul className='grid grid-cols-4'>
          {users.map((user) => (
            
            <div key={user.room} className='h-[200px] w-[200px] border-black border'>
              <li className='text-sky-500 w-28 text-xs font-semibold text-center'>Gönderen: {user.user}</li>
              <li className='text-sky-500 w-28 text-md font-semibold text-center'>MESAJ: {user.text}</li>
              
              
            </div>
          ))}
        </ul>
     
      </div>
    );
  };
  
  export default Messages;  