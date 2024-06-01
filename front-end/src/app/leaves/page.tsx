"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Image from "next/image";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useUserContext } from "@/context/UserContext";
import CheckboxFour from "@/components/Checkboxes/CheckboxFour";
import { IoCloudUploadOutline } from "react-icons/io5";
import { LuUser } from "react-icons/lu";
import { MdOutlineMailOutline } from "react-icons/md";

import { useEffect, useState } from "react";
import { getApiCall } from "@/utils/apicall";
import DatePickerOne from "@/components/FormElements/DatePicker/DatePickerOne";
import SelectGroupTwo from "@/components/SelectGroup/SelectGroupTwo";

interface LeaveBalanceData {
  userId: number;
  totalLeave: string;
  availableLeave: string;
  usedLeave: string;
  academicYear: string;
  totalWorkingDays: string;
  attendancePercentage: string;
}

interface ApiResponse {
  leaveBalance: LeaveBalanceData;
  message: string;
}

const Leaves: React.FC = () => {
  const [user] = useUserContext();
  const [leaveBalance, setLeaveBalance] = useState<LeaveBalanceData>({
    userId: 0,
    totalLeave: "",
    availableLeave: "",
    usedLeave: "",
    academicYear: "",
    totalWorkingDays: "",
    attendancePercentage: "",
  });

  const getApi = async () => {
    try {
      if (user.profile.user == "student") {
        const leaveBalanceResult: ApiResponse =
          await getApiCall("/user/leaveBalance");
          console.log(leaveBalanceResult.data);
        setLeaveBalance(leaveBalanceResult.data.leaveBalance);
      }
      // Fetch leave balance data
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    if (user) {
      getApi();
    }
  }, [user]);
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-full">
        <Breadcrumb pageName="Apply Leaves" />

        <div className="flex flex-wrap gap-8 xl:flex-nowrap">
          <div className="w-full xl:w-3/5">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Apply Leave
                </h3>
              </div>
              <div className="p-7">
                <form action="#">
                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full sm:w-1/2">
                      <SelectGroupTwo title="Leave Type" />
                    </div>

                    <div className="w-full sm:w-1/2">
                      <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                        Available Leave
                      </label>
                      <input
                        type="text"
                        placeholder="Disabled label"
                        disabled
                        value={leaveBalance.availableLeave}
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary dark:disabled:bg-black"
                      />
                    </div>
                  </div>
                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full sm:w-1/2">
                      <DatePickerOne label="From" />
                    </div>
                    <div className="w-full sm:w-1/2">
                      <DatePickerOne label="To" />
                    </div>
                  </div>
                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full sm:w-1/2">
                      <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                        Number of Days
                      </label>
                      <input
                        placeholder="Default Input"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        type="text"
                      />
                    </div>
                    <div className="w-full sm:w-1/2">
                      <SelectGroupTwo title="Leave Day" />
                    </div>
                  </div>
                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <div className="w-full">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                        Reason
                    </label>
                    <textarea rows={6} placeholder="Write minimum 200 characters " className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary">
                    </textarea>
                  </div>
                  </div>
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
          <div className="w-full xl:w-2/5">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Leave Balance
                </h3>
              </div>
              <div className="p-7">
                <div className="dark:bg-gray-800 rounded-lg bg-white dark:bg-boxdark">
                  <ul className="space-y-4">
                    <li className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-300">
                        Total Leave:
                      </span>
                      <span className="text-gray-900 dark:text-white">
                        {leaveBalance.totalLeave}
                      </span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-300">
                        Available Leave:
                      </span>
                      <span className="text-gray-900 dark:text-white">
                        {leaveBalance.availableLeave}
                      </span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-300">
                        Used Leave:
                      </span>
                      <span className="text-gray-900 dark:text-white">
                        {leaveBalance.usedLeave}
                      </span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-300">
                        Academic Year:
                      </span>
                      <span className="text-gray-900 dark:text-white">
                        {leaveBalance.academicYear}
                      </span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-300">
                        Total Working Days:
                      </span>
                      <span className="text-gray-900 dark:text-white">
                        {leaveBalance.totalWorkingDays}
                      </span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-300">
                        Attendance Percentage:
                      </span>
                      <span className="text-gray-900 dark:text-white">
                        {leaveBalance.attendancePercentage}%
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Leaves;
