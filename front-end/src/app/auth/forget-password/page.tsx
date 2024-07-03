"use client";
import * as Yup from "yup";
import React from "react";
import Link from "next/link";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { postApiCall } from "@/utils/apicall";
import { toast } from "react-toastify";

const page = () => {
  // const [userData, setUserData] = useState<any>({
  //   email: "",
  //   password:"",
  // });
  const InitialValues : {email: string;} = {
    email: "",
  };
  const router = useRouter();
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
    validationSchema: Yup.object({
        email: Yup.string()
          .email("Please Enter Valid email")
          .required("Please Enter email"),
      }),
    onSubmit: async () => {
      const result = await postApiCall("/auth/forgetPassword", values);
      console.log(result);
      if (result?.status == 201) { 
        toast.success(result?.data?.message); 
        localStorage.setItem("email", values.email);
        router.push('/auth/verifyOpt'); 
        resetForm(); 
      } else { 
        toast.error(result?.data?.message); 
      } 
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
              Forget Password
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
                  <button
                    type="submit"
                    className="m-0 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-gradient-to-r from-fuchsia-600 to-blue-600 px-4 py-4 text-base font-semibold text-white transition-all duration-200 hover:opacity-80 focus:opacity-80 focus:outline-none"
                  >
                    Log in
                  </button>
                </div>
              </div>
            </form>

          </div>
        </div>
      </div>
    </section>
  );
};

export default page;
