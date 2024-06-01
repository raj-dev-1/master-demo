"use client";

import React, { useContext } from "react";
import Link from "next/link";
import Cookies from 'js-cookie';
import { useFormik } from "formik";
import { loginValidation } from "@/validations/loginValidation";
import { LoginFormValues } from "@/types/form";
import { postApiCall } from "@/utils/apicall";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/context/UserContext";
import { toast } from "react-toastify";

const page = () => {
  // const [userData, setUserData] = useState<any>({
  //   email: "",
  //   password:"",
  // });
  const InitialValues : LoginFormValues = {
    email: "",
    password: "",
  };
  const router = useRouter();
  const [user,setUser] = useUserContext();
  // console.log(user);
  // const  handleChange = (e : any) => {
  //   let { value , name  } = e.target;
  //   setUserData((values : any) => ({ ...values, [name]: value }));
  // }

  const {
    values,
    handleBlur,
    handleChange,
    handleSubmit,
    errors,
    touched,
    resetForm, // Add resetForm from useFormik
  } = useFormik({
    initialValues: InitialValues,
    validationSchema: loginValidation,
    onSubmit: async (values) => {
      // Reset the form values
      console.log(values);
      const result = await postApiCall("/user/login", values);
      console.log(result);
      if (result?.status == 200) {
        const expirationDate = new Date();
        expirationDate.setTime(expirationDate.getTime() + (1 * 60 * 60 * 1000)); // 1 hours in milliseconds
        Cookies.set('jwt', result.token, { expires: expirationDate }); 
        toast.success("Login successful");
        router.push('/'); // Redirect to home page
      } else {
        toast.error("Login failed");
      }
      resetForm();
    },
  });

  return (
    <section className="bg-white">
      <div className="grid h-screen grid-cols-1 lg:grid-cols-2">
        <div className="bg-gray-50 relative flex items-end px-4 pb-10 pt-60 sm:px-6 sm:pb-16 md:justify-center lg:px-8 lg:pb-24">
          <div className="absolute inset-0">
            <img
              className="h-full w-full object-cover object-top"
              src="https://cdn.rareblocks.xyz/collection/celebration/images/signin/4/girl-thinking.jpg"
              alt=""
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>

          <div className="relative">
            <div className="w-full max-w-xl xl:mx-auto xl:w-full xl:max-w-xl xl:pr-24">
              <h3 className="text-4xl font-bold text-white">
                Join Patoliya to <br className="hidden xl:block" />
                build your website in tailwind
              </h3>
              <ul className="mt-10 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
                <li className="flex items-center space-x-3">
                  <div className="inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-500">
                    <svg
                      className="h-3.5 w-3.5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </div>
                  <span className="text-lg font-medium text-white">
                    {" "}
                    Commercial License{" "}
                  </span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-500">
                    <svg
                      className="h-3.5 w-3.5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </div>
                  <span className="text-lg font-medium text-white">
                    {" "}
                    React{" "}
                  </span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-500">
                    <svg
                      className="h-3.5 w-3.5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </div>
                  <span className="text-lg font-medium text-white">
                    {" "}
                    Redux{" "}
                  </span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-500">
                    <svg
                      className="h-3.5 w-3.5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </div>
                  <span className="text-lg font-medium text-white">
                    Consize Design{" "}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center bg-white px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
          <div className="xl:mx-auto xl:w-full xl:max-w-sm 2xl:max-w-md">
            <h2 className="text-center text-3xl font-bold leading-tight text-black sm:text-4xl">
              Sign in{" "}
            </h2>
            <p className="text-gray-600 mt-2 text-center text-base">
              Don’t have an account?{" "}
              <Link
                href="/user/register"
                title=""
                className="font-medium text-blue-600 transition-all duration-200 hover:text-blue-700 hover:underline focus:text-blue-700"
              >
                Create a free account
              </Link>
            </p>

            <form className="mt-8" onSubmit={handleSubmit}>
              <div className="space-y-5">
                <div>
                  <label
                    htmlFor=""
                    className="text-gray-900 text-base font-medium"
                  >
                    {" "}
                    Email address{" "}
                  </label>
                  <div className="text-gray-400 focus-within:text-gray-600 relative mt-2.5">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <svg
                        className="h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                        />
                      </svg>
                    </div>

                    <input
                      type="text"
                      value={values.email}
                      name="email"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      id=""
                      placeholder="Enter email to get started"
                      className="placeholder-gray-500 border-gray-200 bg-gray-50 block w-full rounded-md border py-4 pl-10 pr-4 text-black caret-blue-600 transition-all duration-200 focus:border-blue-600 focus:bg-white focus:outline-none"
                    />
                  </div>
                  {errors.email && touched.email ? (
                    <p className="mt-2 text-sm text-danger">{errors.email}</p>
                  ) : (
                    ""
                  )}
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor=""
                      className="text-gray-900 text-base font-medium"
                    >
                      {" "}
                      Password{" "}
                    </label>
                    <Link
                      href="/"
                      title=""
                      className="text-sm font-medium text-blue-600 transition-all duration-200 hover:text-blue-700 hover:underline focus:text-blue-700"
                    >
                      {" "}
                      Forgot password?{" "}
                    </Link>
                  </div>
                  <div className="text-gray-400 focus-within:text-gray-600 relative mt-2.5">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <svg
                        className="h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
                        />
                      </svg>
                    </div>
                    <input
                      type="password"
                      value={values.password}
                      name="password"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      id=""
                      placeholder="Enter your password"
                      className="placeholder-gray-500 border-gray-200 bg-gray-50 block w-full rounded-md border py-4 pl-10 pr-4 text-black caret-blue-600 transition-all duration-200 focus:border-blue-600 focus:bg-white focus:outline-none"
                    />
                  </div>
                    {errors.password && touched.password ? (
                      <p className="mt-2 text-sm text-danger">{errors.password}</p>
                    ) : (
                      ""
                    )}
                </div>

                <div>
                  <button
                    type="submit"
                    className="m-0 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-gradient-to-r from-fuchsia-600 to-blue-600 px-4 py-4 text-base font-semibold text-white transition-all duration-200 hover:opacity-80 focus:opacity-80 focus:outline-none"
                  >
                    Log in
                  </button>
                </div>
              </div>
            </form>

            <div className="mt-3 space-y-3">
              <button
                type="button"
                className="text-gray-700 border-gray-200 hover:bg-gray-100 focus:bg-gray-100 relative inline-flex w-full items-center justify-center rounded-md border-2 bg-white px-4 py-4 text-base font-semibold transition-all duration-200 hover:text-black focus:text-black focus:outline-none"
              >
                <div className="absolute inset-y-0 left-0 p-4">
                  <svg
                    className="h-6 w-6 text-rose-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M20.283 10.356h-8.327v3.451h4.792c-.446 2.193-2.313 3.453-4.792 3.453a5.27 5.27 0 0 1-5.279-5.28 5.27 5.27 0 0 1 5.279-5.279c1.259 0 2.397.447 3.29 1.178l2.6-2.599c-1.584-1.381-3.615-2.233-5.89-2.233a8.908 8.908 0 0 0-8.934 8.934 8.907 8.907 0 0 0 8.934 8.934c4.467 0 8.529-3.249 8.529-8.934 0-.528-.081-1.097-.202-1.625z"></path>
                  </svg>
                </div>
                Sign in with Google
              </button>

              <button
                type="button"
                className="text-gray-700 border-gray-200 hover:bg-gray-100 focus:bg-gray-100 relative inline-flex w-full items-center justify-center rounded-md border-2 bg-white px-4 py-4 text-base font-semibold transition-all duration-200 hover:text-black focus:text-black focus:outline-none"
              >
                <div className="absolute inset-y-0 left-0 p-4">
                  <svg
                    className="h-6 w-6 text-[#2563EB]"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M13.397 20.997v-8.196h2.765l.411-3.209h-3.176V7.548c0-.926.258-1.56 1.587-1.56h1.684V3.127A22.336 22.336 0 0 0 14.201 3c-2.444 0-4.122 1.492-4.122 4.231v2.355H7.332v3.209h2.753v8.202h3.312z"></path>
                  </svg>
                </div>
                Sign in with Facebook
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default page;
