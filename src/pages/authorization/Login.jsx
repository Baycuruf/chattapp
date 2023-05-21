import React, { useEffect } from "react";
import { auth, login } from "../../firebase";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Helmet } from "react-helmet";

function Login() {
  const navigate = useNavigate();

  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      const username = user.displayName;
      navigate(`/${username}`, {
        replace: true,
      });
    }
  }, [user, navigate]);

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .required("E-mail alanı boş bırakılamaz")
      .email("Geçersiz e-mail adresi"),
    password: Yup.string().required("Parola alanı boş bırakılamaz"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    const { email, password } = values;
    const user = await login(email, password);
    if (user) {
      const username = user.displayName;
      navigate(`/${username}`, {
        replace: true,
      });
    }
    setSubmitting(false);
  };

  return (
    <div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form className="grid gap-y-4 py-4 max-w-xl mx-auto text-black">
          <div>
            <Field
              type="email"
              id="email"
              name="email"
              placeholder="E-mail"
              className="shadow-sm focus:ring_primary focus:border-primary block w-full sm:text-sm border-gma h-9 p-2"
            />
            <ErrorMessage
              name="email"
              component="div"
              className="text-yellow-500"
            />
          </div>

          <div>
            <Field
              type="password"
              id="password"
              name="password"
              placeholder="Parola"
              className="shadow-sm focus:ring_primary focus:border-primary block w-full sm:text-sm border-gma h-9 p-2"
            />
            <ErrorMessage
              name="password"
              component="div"
              className="text-yellow-500"
            />
          </div>

          <div>
            <button
              className="bg-black cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded"
              type="submit"
            >
              Giriş Yap
            </button>
          </div>
        </Form>
      </Formik>

      <div className="flex items-center text-center justify-center">
        <Link
          className="bg-green-500 rounded w-24 text-white h-10 tex-center p-2"
          to="/auth/register"
        >
          Kayıt Ol
        </Link>
      </div>
    </div>
  );
}

export default Login;
