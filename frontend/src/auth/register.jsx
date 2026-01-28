import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { validationAuthSchema } from "./validation/auth.validator";
import api from "../config/axios.config";
import Cookies from "js-cookie";
import { ErrorToast, SuccessToast } from "../config/toast.config";
import { useNavigate } from "react-router-dom";

const SingUpPage = () => {
  const navigate = useNavigate();
  const handleSubmit = (values, { setSubmitting }) => {
    api
      .post("/user/register", values, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        const { message, token } = res.data;
        Cookies.set("access_token", token, { expires: 1 });
        SuccessToast(message);
        navigate("/");
      })
      .catch((error) => {
        const { message } = error.response.data;
        ErrorToast(message);
      });
    setSubmitting(false);
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-8">
        {/* WhatsApp logo */}
        <div className="flex justify-center mb-6">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
            alt="WhatsApp"
            className="h-16 w-16"
          />
        </div>

        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          SingUP to WhatsApp
        </h2>

        {/* Formik Form */}
        <Formik
          initialValues={{ username: "", password: "" }}
          validationSchema={validationAuthSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form>
              {/* Username input */}
              <div className="mb-4">
                <label htmlFor="username" className="block text-gray-700 mb-2">
                  Username
                </label>
                <Field name="username">
                  {({ field }) => (
                    <input
                      {...field}
                      type="text"
                      id="username"
                      placeholder="Enter your username"
                      className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-1 ${
                        errors.username && touched.username
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-green-500"
                      }`}
                    />
                  )}
                </Field>
                <ErrorMessage
                  name="username"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Password input */}
              <div className="mb-4">
                <label htmlFor="password" className="block text-gray-700 mb-2">
                  Password
                </label>
                <Field name="password">
                  {({ field }) => (
                    <input
                      {...field}
                      type="password"
                      id="password"
                      placeholder="Enter your password"
                      className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 ${
                        errors.password && touched.password
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-green-500"
                      }`}
                    />
                  )}
                </Field>
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Remember me */}
              <div className="flex items-center mb-6">
                <input
                  type="checkbox"
                  id="remember"
                  className="h-4 w-4 text-green-500 focus:ring-green-400 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember"
                  className="ml-2 text-gray-600 text-sm"
                >
                  Remember me
                </label>
              </div>

              {/* Login button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </button>
            </Form>
          )}
        </Formik>

        <a href="/login">Login</a>

        {/* Footer */}
        <p className="text-center text-gray-400 text-xs mt-6">
          © 2025 WhatsApp
        </p>
      </div>
    </div>
  );
};

export default SingUpPage;
