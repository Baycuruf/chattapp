import React from "react";
import { Formik, Form, Field } from "formik";
import { collection, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

const CommentForm = ({ postId }) => {
  const handleSubmit = async (values, { resetForm }) => {
    try {
      const postRef = doc(db, "posts", postId);

      // Postun comment array'ine yeni yorumu ekleyin
      await updateDoc(postRef, {
        comment: [...postRef.comment, values.comment],
      });

      // Formu sıfırla
      resetForm();
    } catch (error) {
      console.error("Yorum eklenirken bir hata oluştu:", error);
    }
  };

  return (
    <Formik initialValues={{ comment: "" }} onSubmit={handleSubmit}>
      <Form>
        <Field
          placeholder="Yorum yazın"
          as="textarea"
          className="w-64 h-24 border border-black p-2 text-black"
          id="comment"
          name="comment"
        />
        <button
          className="bg-blue-500 text-white py-2 px-4 mt-2 rounded"
          type="submit"
        >
          Yorum Yap
        </button>
      </Form>
    </Formik>
  );
};

export default CommentForm;
