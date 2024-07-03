"use client";
import { useUserContext } from "@/context/UserContext";
import { getApiCall } from "@/utils/apicall";
import { useEffect, useState } from "react";

const LeaveHistory = () => {
  const [user, setUser] = useUserContext();
  const [data, setData] = useState<any>([]);

  const getApi = async () => {
    try {
      let result: any = await getApiCall("/leave/leaveStatus");
        setData(result.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  
  useEffect(() => {
    if(user){
      getApi();
    }
  }, [user]);

  return (
    <div className="relative overflow-x-auto dark:border-strokedark sm:rounded-sm">
      <table className="text-gray-500 dark:text-gray-400 w-full text-left text-sm rtl:text-right">
        <thead className="text-gray-700 border-b-2 border-stroke bg-white text-xs uppercase dark:border-strokedark dark:bg-boxdark">
          <tr>
            <th scope="col" className="px-6 py-3">
              #
            </th>
            <th scope="col" className="px-6 py-3">
              <div className="flex items-center">
                LeaveType
              </div>
            </th>
            <th scope="col" className="px-6 py-3">
              <div className="flex items-center">
                Reason
              </div>
            </th>
            <th scope="col" className="px-6 py-3">
              <div className="flex items-center">
                From
              </div>
            </th>
            <th scope="col" className="px-6 py-3">
              <div className="flex items-center">
                To
              </div>
            </th>
            <th scope="col" className="px-6 py-3">
              <div className="flex items-center">
                Approved By
              </div>
            </th>
            <th scope="col" className="px-6 py-3">
              <div className="flex items-center">
                Status
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          { data?.leaveStatus?.length != 0 ? (
            data?.leaveStatus?.map((item: any, index: number) => (
              <tr
                key={index}
                className="border-b border-stroke bg-white dark:border-strokedark dark:bg-boxdark"
              >
                <th
                  scope="row"
                  className="text-gray-900 whitespace-nowrap px-6 py-4 font-medium dark:text-white"
                >
                  {item.id}
                </th>
                <td className="px-6 py-4">{item.leaveType}</td>
                <td className="px-6 py-4">{item.reason}</td>
                <td className="px-6 py-4">{item.startDate}</td>
                <td className="px-6 py-4">{item.endDate}</td>
                <td className="px-6 py-4">{item.requestedTo.name}</td>
                <td className="px-6 py-4">
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
                </td>
                
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
  );
};

export default LeaveHistory;
