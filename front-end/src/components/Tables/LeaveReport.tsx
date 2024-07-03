"use client";
import { useUserContext } from "@/context/UserContext";
import { getApiCall } from "@/utils/apicall";
import { useEffect, useState } from "react";

const LeaveReport = () => {
  const [user, setUser] = useUserContext();
  const [data, setData] = useState<any>([]);

  const getApi = async () => {
    try {
      let result: any = await getApiCall("/leave/leaveReport");
      setData(result.data.leaveReport);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    if (user.profile.user == "admin") {
      getApi();
    }
  }, [user]);

  const roleByName : any = {
    1: "admin",
    2: "hod",
    3: "faculty",
    4: "student",
  };

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-12">
      <h4 className="mb-6 px-5 pb-2.5 pt-6 text-xl font-bold text-black dark:text-white sm:px-7.5 xl:pb-1">
        Leave Report
      </h4>
      <div className="relative overflow-x-auto dark:border-strokedark sm:rounded-sm">
        <table className="text-gray-500 dark:text-gray-400 w-full text-left text-sm rtl:text-right">
          <thead className="text-gray-700 border-b-2 border-stroke bg-white text-xs uppercase dark:border-strokedark dark:bg-boxdark">
            <tr>
              <th scope="col" className="px-6 py-3">
                #
              </th>
              <th scope="col" className="px-6 py-3">
                <div className="flex items-center">
                  Name
                </div>
              </th>
              <th scope="col" className="px-6 py-3">
                <div className="flex items-center">
                  Email
                </div>
              </th>
              <th scope="col" className="px-6 py-3">
                <div className="flex items-center">
                  Role
                </div>
              </th>
              <th scope="col" className="px-6 py-3">
                <div className="flex items-center">
                  total Leave
                </div>
              </th>
              <th scope="col" className="px-6 py-3">
                <div className="flex items-center">
                available Leave
                </div>
              </th>
              <th scope="col" className="px-6 py-3">
                <div className="flex items-center">
                used Leave
                </div>
              </th>
              <th scope="col" className="px-6 py-3">
                <div className="flex items-center">
                total Working Days
                </div>
              </th>
              <th scope="col" className="px-6 py-3">
                <div className="flex items-center">
                attendance Percentage
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {data?.length != 0 ? (
              data?.map((item: any, index: number) => (
                <tr
                  key={index}
                  className="border-b border-stroke bg-white dark:border-strokedark dark:bg-boxdark"
                >
                  <th
                    scope="row"
                    className="text-gray-900 whitespace-nowrap px-6 py-4 font-medium dark:text-white"
                  >
                    {index +1}
                  </th>
                  <td className="px-6 py-4">{item.User.name}</td>
                  <td className="px-6 py-4">{item.User.email}</td>
                  <td className="px-6 py-4">{roleByName[item.User.roleId]}</td>
                  <td className="px-6 py-4">{item.totalLeave}</td>
                  <td className="px-6 py-4">{item.availableLeave}</td>
                  <td className="px-6 py-4">{item.usedLeave}</td>
                  <td className="px-6 py-4">{item.totalWorkingDays}</td>
                  <td className="px-6 py-4">{item.attendancePercentage} %</td>
                  {/* <td className="px-6 py-4">
                    <span
                      className={`inline-block rounded border border-transparent px-2.5 py-0.5 text-xs font-medium ${
                        item.status === "Approved"
                          ? "bg-green-100 text-green-500 dark:bg-green-500/20"
                          : item.status === "Pending"
                            ? "bg-yellow-100 text-yellow-500 dark:bg-yellow-500/20"
                            : item.status === "Rejected"
                              ? "bg-red-100 text-red-500 dark:bg-red-500/20"
                              : ""
                      } dark:border-transparent`}
                    >
                      {item.status}
                    </span>
                  </td> */}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="px-6 py-4 text-center">
                  No Data Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaveReport;
