import React, { useEffect } from 'react';
import axios from 'axios';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import Fehmi from './Fehmi';

const NewLike = () => {
  useEffect(() => {
    axios.get('http://localhost:3000/api/users')
      .then(response => {
        const users = response.data;

        // Koleksiyonu ve dökümanları oluştur
        const batch = [];

        users.forEach(user => {
          const { displayName, photoURL, uid } = user;

          const userDocRef = doc(db, 'users', displayName);

          const userDocData = {
            username: displayName,
            uid: uid,
            friends: [],
            post: [],
            photoURL: photoURL || null, // photoURL değeri yoksa null olarak ayarla
          };

          batch.push(setDoc(userDocRef, userDocData));
        });

        // Değişiklikleri Firestore'a uygula
        return Promise.all(batch);
      })
      .then(() => {
        console.log('Firestore koleksiyonu ve dökümanları başarıyla oluşturuldu.');
      })
      .catch(error => {
        console.error('Hata:', error);
      });
  }, []);

  return (
    <div>
      <Fehmi/>
    </div>
  );
};

export default NewLike;

