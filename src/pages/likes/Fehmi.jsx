import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';

const Fehmi = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const usersData = querySnapshot.docs.map(doc => doc.data());
        setUsers(usersData);
      } catch (error) {
        console.error('Hata:', error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <h2>Kullanıcılar</h2>
      <ul>
        {users.map((user, index) => (
          <li key={index}>
            <strong>Kullanıcı Adı:</strong> {user.username}<br />
            <strong>UID:</strong> {user.uid}<br />
            <strong>Arkadaşlar:</strong> {user.friends.join(', ')}<br />
            <strong>Gönderiler:</strong> {user.post.join(', ')}<br />
            <strong>Profil Resmi URL:</strong> {user.photoURL}<br />
            <br />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Fehmi;
