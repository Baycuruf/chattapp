import React, { useEffect, useState } from "react";
import { auth, register } from "../../firebase";
import { Link, useNavigate } from "react-router-dom";
import { GoogleAuthProvider, signInWithPopup, updateProfile } from "firebase/auth";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { doc, getFirestore, setDoc } from "firebase/firestore";

function Register() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      if (user) {
        const username = user.displayName;
        navigate(`/${username}`, {
          replace: true,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (values) => {
    const { email, password, displayName } = values;
    try {
      const user = await register(email, password);
      await updateProfile(user, { displayName });
  
      if (user) {
        const username = user.displayName;
        const db = getFirestore();
        const newUser = {
          following:[],
          followers:[],
          photoURL: user.photoURL,
          post: [],
          phoneNumber:null,
          uid: user.uid,
          username: user.displayName
        };
  
        await setDoc(doc(db, "users", user.displayName), newUser);
  
        navigate(`/${username}`, {
          replace: true,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Geçerli bir e-posta adresi girin").required("E-posta alanı zorunludur"),
    displayName: Yup.string().required("Kullanıcı adı alanı zorunludur"),
    password: Yup.string().required("Parola alanı zorunludur"),
  });

  return (
    <div>
      <Formik
        initialValues={{ email: "", displayName: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form className="grid gap-y-4 py-4 max-w-xl mx-auto text-black">
          <div>
            <Field
              type="email"
              name="email"
              placeholder="E-mail"
              className="shadow-sm focus:ring_primary focus:border-primary block w-full sm:text-sm border-gma h-9"
            />
            <ErrorMessage name="email" component="div" className="text-red-500" />
          </div>

          <div>
            <Field
              name="displayName"
              placeholder="Kullanıcı Adı"
              className="shadow-sm focus:ring_primary focus:border-primary block w-full sm:text-sm border-gma h-9"
            />
            <ErrorMessage name="displayName" component="div" className="text-red-500" />
          </div>

          <div>
            <Field
              type="password"
              name="password"
              placeholder="Parola"
              className="shadow-sm focus:ring_primary focus:border-primary block w-full sm:text-sm border-gma h-9"
            />
            <ErrorMessage name="password" component="div" className="text-red-500" />
          </div>
          <div>
            <button
              className="bg-black cursor-pointer text-white font-bold py-2 px-4 rounded"
              type="submit"
              disabled={user !== null}
            >
              Kayıt ol
            </button>
          </div>

           <div className="flex gap-4">
            <button
              className="bg-red-500 cursor-pointer text-white font-bold py-2 px-4 rounded"
              type="button"
              onClick={handleGoogleSignIn}
              disabled={user !== null}
            >
              Google ile giriş yap
            </button>
            <div className="flex items-center text-center justify-center">
              <Link className="rounded text-green-500 font-semibold h-10 tex-center p-2" to="/auth/login">
                Zaten Hesabın Var Mı ? Giriş Yap
              </Link>
            </div>
          </div>
        </Form>
      </Formik>
    </div>
  );
}

export default Register;
