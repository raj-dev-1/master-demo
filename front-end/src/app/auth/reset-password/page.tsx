"use client";
import * as Yup from "yup";
import React from "react";
import Link from "next/link";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import {  getApiCall, putApiCall } from "@/utils/apicall";
import { toast } from "react-toastify";

const page = () => {
  // const [userData, setUserData] = useState<any>({
  //   email: "",
  //   password:"",
  // });
  const InitialValues: { password: string; confirmPassword: string } = {
    password: "",
    confirmPassword: "",
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
      password: Yup.string().min(5).required("Please Enter Password"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Please confirm your password"),
    }),
    onSubmit: async () => {
      const result = await putApiCall("/auth/resetPassword", {password:values.password});
      if (result?.status == 200) {
        toast.success(result?.data?.message);
        await getApiCall("/auth/logout");
        router.push("/user/login");
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
              Reset Password
            </h2>

            <form className="mt-8" onSubmit={handleSubmit}>
              <div className="space-y-5">
              <div className='relative'>
                  <label
                    htmlFor="password"
                    className="text-base font-medium text-gray-900"
                  >
                    {" "}
                    Password{" "}
                  </label>
                  <div className="mt-2">
                    <input
                      type="password"
                      name="password"
                      value={values.password}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                  {errors.password && touched.password ? (
                    <p className="absolute -bottom-5 left-0 mt-2 text-sm text-red-600" id="email-error">
                      {errors.password}
                    </p>
                  ) : null}
                </div>
                <div className='relative'>
                  <label
                    htmlFor="confirmPassword"
                    className="text-base font-medium text-gray-900"
                  >
                    {" "}
                    Confirm Password{" "}
                  </label>
                  <div className="mt-2">
                    <input
                      type="password"
                      name="confirmPassword"
                      value={values.confirmPassword}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="Enter your confirm password"
                      className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                  {errors.confirmPassword && touched.confirmPassword ? (
                    <p className="absolute -bottom-5 left-0 mt-2 text-sm text-red-600" id="email-error">
                      {errors.confirmPassword}
                    </p>
                  ) : null}
                </div>

                <div>
                  <button
                    type="submit"
                    className="m-0 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-gradient-to-r from-fuchsia-600 to-blue-600 px-4 py-4 text-base font-semibold text-white transition-all duration-200 hover:opacity-80 focus:opacity-80 focus:outline-none"
                  >
                    Submit
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
