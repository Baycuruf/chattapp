import React from "react";
import { Formik, Form, Field } from "formik";
import {
  collection,
  serverTimestamp,
  updateDoc,
  arrayUnion,
  doc,
  setDoc,
} from "firebase/firestore";
import { auth, db } from "../../firebase";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const user = auth.currentUser;
  const navigate = useNavigate();

  const generatePostId = () => {
    // Rastgele bir post ID'si oluşturmak için gerekli işlemleri gerçekleştir
    // Örnek olarak, timestamp'i kullanarak bir post ID'si oluşturulabilir
    const timestamp = new Date().getTime();
    const randomId = Math.random().toString(36).substring(2, 10);
    return `${timestamp}_${randomId}`;
  };

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const postsCollection = collection(db, "posts");

      // Rastgele bir post ID'si oluştur
      const postId = generatePostId();

      // Postu Firestore'a ekle
      const postDocRef = doc(postsCollection, postId);
      await setDoc(postDocRef, {
        userId: user.uid,
        username: user.displayName,
        content: values.content,
        likes: [],
        dislikes: [],
        comment: [],
        createdAt: serverTimestamp(),
      });

      // Kullanıcının gönderi listesine gönderiyi ekle
      const userDocRef = doc(db, "users", user.displayName);
      await updateDoc(userDocRef, {
        post: arrayUnion(postDocRef.id),
      });

      toast.success("Post Gönderildi");
      
      // Ana sayfaya yönlendir
      navigate("/");

      // Formu sıfırla
      resetForm();
    } catch (error) {
      console.error("Gönderi oluşturulurken bir hata oluştu:", error);
      toast.error("Gönderi oluşturulurken bir hata oluştu:");
    }
  };

  return (
    <div className="flex items-center justify-center text-center w-full p-4 ">
      <Formik initialValues={{ content: "" }} onSubmit={handleSubmit}>
        <Form className="flex items-center gap-4 p-4">
          <Field
            placeholder="Yeni Bir Post Oluşturmak İçin Buraya yazınız.."
            as="textarea"
            className="w-96 h-48 border border-black p-2 text-black"
            id="content"
            name="content"
          />

          <button
            className="bg-green-700 rounded text-white w-24 h-12"
            type="submit"
          >
            Oluştur
          </button>
        </Form>
      </Formik>
    </div>
  );
};

export default CreatePost;
