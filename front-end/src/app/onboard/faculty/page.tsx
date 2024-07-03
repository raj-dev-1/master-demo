"use client";

import React from 'react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import { registerValidation } from '@/validations/loginValidation';
import { postApiCall } from '@/utils/apicall';
import { RegisterFormValues } from '@/types/form';

const page = () => {
  const InitialValues: RegisterFormValues = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  };
  
  const router = useRouter();

  const {
    values,
    handleBlur,
    handleChange,
    handleSubmit,
    errors,
    touched,
    resetForm,
  } = useFormik({
    initialValues: InitialValues,
    validationSchema: registerValidation,
    onSubmit: async (values) => {
      const result = await postApiCall("/user/registerFaculty", values);
      console.log(result);
      if (result?.status == 201) {
        toast.success("Registration successful");
        router.push("/");
        resetForm();
      } else {
        toast.error(result.message);
      }
    },
  });
  return (
    <section >
      <div className="grid h-screen grid-cols-1 lg:grid-cols-2">
        <div className="bg-gray-50 relative flex items-end px-4 pb-10 pt-60 sm:px-6 sm:pb-16 md:justify-center lg:px-8 lg:pb-24">
          <div className="absolute inset-0">
            <img
              className="h-full w-full object-cover"
              src="https://cdn.rareblocks.xyz/collection/celebration/images/signup/4/girl-working-on-laptop.jpg"
              alt=""
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
          <div className="relative">
            <div className="w-full max-w-xl xl:mx-auto xl:w-full xl:max-w-xl xl:pr-24">
              <h3 className="text-4xl font-bold text-white">
                Join Patoliya to <br className="hidden xl:block" />
                build your website in talwind
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
                    Commercial License
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
                  <span className="text-lg font-medium text-white">React</span>
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
                  <span className="text-lg font-medium text-white">Redux</span>
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
                    And much more
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
          <div className="xl:mx-auto xl:w-full xl:max-w-sm 2xl:max-w-md">
            <h2 className="text-2xl font-bold text-center leading-tight text-black dark:text-white sm:text-3xl">
              Sign up
            </h2>
            <form onSubmit={handleSubmit} className="mt-8">
              <div className="space-y-5">
                <div className='relative'>
                  <label
                    htmlFor="name"
                    className="text-base font-medium text-gray-900"
                  >
                    Full Name
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="name"
                      value={values.name}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                  {errors.name && touched.name ? (
                    <p className="absolute -bottom-5 left-0 mt-2 text-sm text-red-600" id="email-error">
                      {errors.name}
                    </p>
                  ) : null}
                </div>
                <div className='relative'>
                  <label
                    htmlFor="email"
                    className="text-base font-medium text-gray-900"
                  >
                    {" "}
                    Email address{" "}
                  </label>
                  <div className="mt-2">
                    <input
                      type="email"
                      name="email"
                      value={values.email}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                  {errors.email && touched.email ? (
                    <p className="absolute -bottom-5 left-0 mt-2 text-sm text-red-600" id="email-error">
                      {errors.email}
                    </p>
                  ) : null}
                </div>
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
                    className="inline-flex mt-5 w-full items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Create free account
                  </button>
                </div>
              </div>
            </form>
            {/* <div className="mt-3 space-y-3">
              <button
                type="button"
                className="inline-flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-500 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <svg
                  className="mr-2 h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M23.994 12.26c0-.823-.074-1.62-.206-2.39H12.245v4.52h6.601a5.645 5.645 0 0 1-2.45 3.705v3.082h3.96c2.32-2.14 3.638-5.295 3.638-8.917z" />
                  <path d="M12.245 24c3.25 0 5.97-1.082 7.957-2.924l-3.96-3.083c-1.1.74-2.492 1.18-3.997 1.18-3.072 0-5.668-2.075-6.594-4.867H1.651v3.06C3.638 21.478 7.636 24 12.245 24z" />
                  <path d="M5.65 14.457a6.913 6.913 0 0 1 0-4.91V6.485H1.65a12.012 12.012 0 0 0 0 10.965l4-3.057z" />
                  <path d="M12.245 4.774c1.792 0 3.395.62 4.66 1.837l3.495-3.495C18.213 1.32 15.492.24 12.245.24 7.636.24 3.638 2.763 1.651 6.485l4 3.062c.926-2.793 3.522-4.773 6.594-4.773z" />
                </svg>
                Sign up with Google
              </button>
            </div> */}
            <p className="mt-5 text-sm text-gray-600">
              By signing up, you agree to our{" "}
              <a
                href="#"
                title=""
                className="font-medium text-blue-600 hover:underline"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="#"
                title=""
                className="font-medium text-blue-600 hover:underline"
              >
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default page;
