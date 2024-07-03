import { postApiCall } from "@/utils/apicall";
import { updateUserValidation } from "@/validations/loginValidation";
import { useFormik } from "formik";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { BsBuildingGear } from "react-icons/bs";
import { LuUser } from "react-icons/lu";
import { MdOutlineEmail, MdOutlinePhoneIphone } from "react-icons/md";
import { PiTreeViewThin } from "react-icons/pi";
import { Faculty } from "../Tables/AllUser";
import { toast } from "react-toastify";

interface UpdateModalProps {
  setUpdateModal: Dispatch<SetStateAction<boolean>>;
  userId: number | null;
  selectValue: string;
  userData: Faculty[];
  setApiData:Dispatch<SetStateAction<Faculty[]>>;
}

const UpdateModal: React.FC<UpdateModalProps> = ({
  setUpdateModal,
  userId,
  selectValue,
  userData,
  setApiData
}) => {
  const [initialValues, setInitialValues] = useState<Faculty>({
    name: "",
    email: "",
    phone: "",
    department: "",
    div: "",
  });

  useEffect(() => {
    if (userId !== null) {
      const user = userData.find((item) => item.id === userId);
      if (user) {
        setInitialValues(user);
      }
    }
  }, [userId, userData]);

  const {
    values,
    handleBlur,
    handleChange,
    handleSubmit,
    errors,
    touched,
  } = useFormik({
    initialValues,
    enableReinitialize: true, // This ensures that Formik will reinitialize with new initialValues
    validationSchema: updateUserValidation,
    onSubmit: (values) => {
      updateApi(values);
    },
  });

  const updateApi = async (values: Faculty) => {
    try {
        let response: any;
      if (selectValue === "student") {
        response = await postApiCall(`/user/editStudent/${userId}`, values);
      } else {
        response = await postApiCall(`/user/editFaculty/${userId}`, values);
      } 
      if(response.status == 200){
          toast.success("User data updated successfully!");
          setApiData(prevData => 
            prevData.map(item => item.id === userId ? { ...item, ...values } : item)
          );
        setUpdateModal(false); // Close modal on success
      }
    } catch (error) {
      console.error("Error updating user data:", error);
      toast.error("Failed to update user data.");
    }
  };


  return (
    <div className="fixed left-0 right-0 top-0 z-50 flex h-[calc(100%-1rem)] max-h-full w-full items-center justify-center overflow-y-auto overflow-x-hidden md:inset-0">
      <div className="relative max-h-full w-full max-w-md p-4">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark-2">
          <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              User Data
            </h3>
          </div>
          <div className="p-7">
            <form onSubmit={handleSubmit}>
              <div className="mb-5.5">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Name
                </label>
                <div className="relative">
                  <span className="absolute left-4.5 top-4">
                    <LuUser className="h-5 w-5" />
                  </span>
                  <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter Username"
                  />
                  {errors.name && touched.name && <div>{errors.name}</div>}
                </div>
              </div>

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
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter Email"
                  />
                  {errors.email && touched.email && <div className="mt-2 text-sm text-danger">{errors.email}</div>}
                </div>
              </div>

              <div className="mb-5.5">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Phone
                </label>
                <div className="relative">
                  <span className="absolute left-4.5 top-4">
                    <MdOutlinePhoneIphone className="h-5 w-5" />
                  </span>
                  <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    name="phone"
                    value={values.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter Phone Number"
                  />
                  {errors.phone && touched.phone && <div className="mt-2 text-sm text-danger">{errors.phone}</div>}
                </div>
              </div>

              <div className="mb-5.5">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Department
                </label>
                <div className="relative">
                  <span className="absolute left-4.5 top-4">
                    <BsBuildingGear className="h-5 w-5" />
                  </span>
                  <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    name="department"
                    value={values.department}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter Department"
                  />
                  {errors.department && touched.department && <div className="mt-2 text-sm text-danger">{errors.department}</div>}
                </div>
              </div>

              <div className="mb-5.5">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Division
                </label>
                <div className="relative">
                  <span className="absolute left-4.5 top-4">
                    <PiTreeViewThin className="h-5 w-5" />
                  </span>
                  <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    name="div"
                    value={values.div}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter Division"
                  />
                  {errors.div && touched.div && <div className="mt-2 text-sm text-danger">{errors.div}</div>}
                </div>
              </div>

              <div className="flex justify-end gap-4.5">
                <button
                  className="flex justify-center rounded border border-stroke px-6 py-2 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setUpdateModal(false);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="flex justify-center rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90"
                  type="submit"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateModal;
