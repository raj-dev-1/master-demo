"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Image from "next/image";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useUserContext } from "@/context/UserContext";
import CheckboxFour from "@/components/Checkboxes/CheckboxFour";
import { IoCloudUploadOutline } from "react-icons/io5";
import { LuUser } from "react-icons/lu";
import { MdOutlineEmail } from "react-icons/md";
import { useEffect, useState } from "react";
import { SettingFormValues } from "@/types/form";
import { useFormik } from "formik";
import { settingValidation } from "@/validations/loginValidation";
import { putApiCall } from "@/utils/apicall";
import { TbPasswordUser } from "react-icons/tb";
import { toast } from "react-toastify";
import { objectToFormData } from "@/utils/setting";

const Settings = () => {
  const [user, setUser] = useUserContext();
  const [gender, setGender] = useState("");
  const [fileNew, setFileNew] = useState<any>(null);
  const [passwordData, setPasswordData] = useState({
    email: user?.profile?.email,
    password: "",
  });

  useEffect(() => {
    if (user?.profile?.gender) {
      setGender(user?.profile?.gender);
    }
  }, [user]);

  const handleGenderChange = (value: any) => {
    setGender(value);
    setFieldValue("gender", value);
  };

  const InitialValues: SettingFormValues = {
    name: user?.profile.name || "",
    gender: user?.profile.gender || "",
    email: user?.profile.email || "",
    image: user?.profile?.image || "",
    phone: user?.profile.phone || "",
    address: user?.profile.address || "",
    department: user?.profile.department || "",
    div: user?.profile.div || "",
    user: user?.profile.user || "",
  };

  const {
    values,
    handleBlur,
    handleChange,
    handleSubmit,
    errors,
    touched,
    resetForm,
    setFieldValue,
    setFieldError,
  } = useFormik({
    initialValues: InitialValues,
    validationSchema: settingValidation,
    onSubmit: () => {
      setProfile();
    },
  });

  const setProfile = async () => {
    try {
      let result: any;
      const formData: any = objectToFormData(values);
      if (fileNew !== null) {
        formData.set("image", fileNew);
      } else {
        formData.delete("image");
      }
      for (const [key, value] of formData.entries()) {
        console.log(`Key: ${key}, Value: ${value}`);
      }
      if (user.profile.user == "student" || user.profile.roleId == 4) {
        result = await putApiCall("/user/editUser", formData);
      } else {
        result = await putApiCall("/manage/editUser", formData);
      }
      if (result?.status === 200) {
        const updatedUser = result.data.user;
        const { message } = result.data;
        setUser((prevUser: any) => ({
          ...prevUser,
          message,
          profile: {
            ...updatedUser,
          },
        }));
        toast.success(message || "Profile updated successfully");
      }
    } catch (error: any) {
      console.error("Error updating user profile:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "An error occurred while updating the profile",
      );
    }
  };

  const handleChangeP = (e: any) => {
    const { name, value } = e.target;
    setPasswordData((prevData: any) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmitP = async (e: any) => {
    e.preventDefault();
    try {
      console.log(passwordData);
      const result = await putApiCall("/user/resetPassword", passwordData);
      if (result?.status === 200) {
        toast.success(result.data.message || "Password updated successfully");
      } else {
        toast.error(
          result.data.message ||
            "An error occurred while updating the password",
        );
      }
    } catch (error: any) {
      console.error("Error updating password:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "An error occurred while updating the password",
      );
    }
  };

  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile: any = e.target.files?.[0];
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (selectedFile && !allowedTypes.includes(selectedFile.type)) {
      setFieldError(
        "image",
        "Invalid file type. Please select a JPEG, PNG, or JPG image.",
      );
      return;
    } else if (selectedFile) {
      setFileNew(selectedFile);
    }
  };

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-full">
        <Breadcrumb pageName="Settings" />
        <div className="flex flex-wrap gap-8 xl:flex-nowrap">
          <div className="w-full xl:w-3/5">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Personal Information
                </h3>
              </div>
              <div className="p-7">
                <form onSubmit={handleSubmit}>
                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="name"
                      >
                        Full Name
                      </label>
                      <div className="relative">
                        <span className="absolute left-4.5 top-4">
                          <LuUser className="h-5 w-5 " />
                        </span>
                        <input
                          className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          type="text"
                          name="name"
                          id="name"
                          value={values.name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Devid Jhon"
                        />
                        {touched.name && errors.name && (
                          <div className="text-red-500">{errors.name}</div>
                        )}
                      </div>
                    </div>

                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="phone"
                      >
                        Phone Number
                      </label>
                      <input
                        className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        name="phone"
                        id="phone"
                        placeholder="+990 3343 7865"
                        value={values.phone}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      {touched.phone && errors.phone && (
                        <div className="text-red-500">{errors.phone}</div>
                      )}
                    </div>
                  </div>

                  <div className="mb-5.5">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="email"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <span className="absolute left-4.5 top-4">
                        <MdOutlineEmail className="h-5 w-5" />
                      </span>
                      <input
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 pl-11.5 pr-4.5 font-normal text-black outline-none focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary dark:disabled:bg-black"
                        type="email"
                        name="email"
                        id="email"
                        placeholder="devidjond45@gmail.com"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      />
                      {touched.email && errors.email && (
                        <div className="text-red-500">{errors.email}</div>
                      )}
                    </div>
                  </div>

                  {user?.profile?.user !== "student" &&
                    user?.profile?.roleId !== 4 && (
                      <div className="mb-5.5">
                        <label
                          className="mb-3 block text-sm font-medium text-black dark:text-white"
                          htmlFor="department"
                        >
                          Department
                        </label>
                        <input
                          className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          type="text"
                          name="department"
                          id="department"
                          placeholder="devidjhon24"
                          value={values.department}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        {touched.department && errors.department && (
                          <div className="text-red-500">
                            {errors.department}
                          </div>
                        )}
                      </div>
                    )}

                  <div className="mb-5.5">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="address"
                    >
                      Address
                    </label>
                    <input
                      className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      type="text"
                      name="address"
                      id="address"
                      placeholder="devidjhon24"
                      value={values.address}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {touched.address && errors.address && (
                      <div className="text-red-500">{errors.address}</div>
                    )}
                  </div>

                  <div className="mb-5.5">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="gender"
                    >
                      Gender
                    </label>
                    <div className="flex items-center gap-3">
                      <CheckboxFour
                        value1="male"
                        value2="female"
                        selectedValue={gender}
                        onChange={handleGenderChange}
                      />
                    </div>
                    {touched.gender && errors.gender && (
                      <div className="text-red-500">{errors.gender}</div>
                    )}
                  </div>

                  <div className="flex justify-end gap-4.5">
                    <button
                      className="flex justify-center rounded border border-stroke px-6 py-2 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                      type="button"
                      onClick={(e) => {
                        e.preventDefault(); 
                        resetForm(); 
                        setFileNew(null);
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      className="flex justify-center rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90"
                      type="submit"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="flex w-full flex-col gap-8 xl:w-2/5">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Your Photo
                </h3>
              </div>
              <div className="p-7">
                <form action="#" onSubmit={handleSubmit}>
                  <div className="mb-4 flex items-center gap-3">
                    <div className="h-15 w-15 overflow-hidden rounded-full">
                      {/* <Image
                        src={user?.profile?.image}
                        width={60}
                        height={60}
                        alt="User"
                      /> */}
                      {fileNew !== null && (
                        <div className="flex items-center justify-center">
                          <Image
                            className="rounded-full object-cover"
                            src={URL.createObjectURL(fileNew)}
                            width={60}
                            height={60}
                            alt="profile"
                          />
                        </div>
                      )}
                      {fileNew === null && (
                        <div className="flex items-center justify-center">
                          <Image
                            className="rounded-full object-cover"
                            src={values.image}
                            width={60}
                            height={60}
                            alt="profile"
                          />
                        </div>
                      )}
                    </div>
                    {errors.image && touched.image && (
                      <p className="errors_para" style={{ marginTop: "15px" }}>
                        {errors.image}
                      </p>
                    )}
                    <div>
                      <span className="mb-1.5 text-black dark:text-white">
                        Edit your photo
                      </span>
                      <span className="flex gap-2.5">
                        <button className="text-sm hover:text-primary">
                          Delete
                        </button>
                        <button className="text-sm hover:text-primary">
                          Update
                        </button>
                      </span>
                    </div>
                  </div>

                  <div
                    id="FileUpload"
                    className="relative mb-5.5 block w-full cursor-pointer appearance-none rounded border border-dashed border-primary bg-gray px-4 py-4 dark:bg-meta-4 sm:py-7.5"
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleChangeFile}
                      className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                    />
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
                        <IoCloudUploadOutline />
                      </span>
                      <p>
                        <span className="text-primary">Click to upload</span> or
                        drag and drop
                      </p>
                      <p className="mt-1.5">
                        SVG, PNG, JPG or GIF (max. 800x400px)
                      </p>
                    </div>
                  </div>

                  <div className="mb-6 flex justify-end gap-4.5">
                    <button
                      onClick={(e) => {
                        e.preventDefault(); 
                        setFileNew(null);
                      }}
                      className="flex justify-center rounded border border-stroke px-6 py-2 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                      type="submit"
                    >
                      Cancel
                    </button>
                    <button
                      className="flex justify-center rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90"
                      type="submit"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Your Account
                </h3>
              </div>
              <div className="p-7">
                <form onSubmit={handleSubmitP}>
                  <div className="mb-5.5">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Email
                    </label>
                    <div className="relative">
                      <span className="absolute left-4.5 top-4">
                        <MdOutlineEmail className="h-5 w-5" />
                      </span>
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="email"
                        name="email"
                        placeholder="devidjond45@gmail.com"
                        value={user?.profile?.email}
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="mb-5.5">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Password
                    </label>
                    <div className="relative">
                      <span className="absolute left-4.5 top-4">
                        <TbPasswordUser />
                      </span>
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="password"
                        name="password"
                        id="password"
                        onChange={handleChangeP}
                      />
                    </div>
                  </div>

                  {/* <div className="mb-5.5">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Current password
                    </label>
                    <div className="relative">
                      <span className="absolute left-4.5 top-4">
                        <TbPasswordUser />
                      </span>
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="password"
                        name="confirmPassword"
                        id="confirmPassword"
                        onChange={handleChangeP}
                      />
                    </div>
                  </div> */}

                  <div className="flex justify-end gap-4.5">
                    <button
                      className="flex justify-center rounded border border-stroke px-6 py-2 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                      type="submit"
                    >
                      Cancel
                    </button>
                    <button
                      className="flex justify-center rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90"
                      type="submit"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Settings;
