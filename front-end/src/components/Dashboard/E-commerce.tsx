"use client";
import React from "react";
import CardDataStats from "../CardDataStats";
import { useUserContext } from "@/context/UserContext";
import { UserFetcher } from "../UserFetcher/UserFetcher";
import { PiStudentLight } from "react-icons/pi";
import { GiTeacher } from "react-icons/gi";
import LeaveReport from "../Tables/LeaveReport";
import AllUser from "../Tables/AllUser";
import LeaveRequest from "../Tables/LeaveRequest";
import LeaveHistory from "../Tables/LeaveHistory";
import StudentLeaveRequest from "../Tables/StudentLeaveRequest";

const ECommerce: React.FC = () => {
  const [user, setUser] = useUserContext();
  return (
    <>
      <UserFetcher />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3 2xl:gap-7.5">
        {user?.profile?.user == "student" || user?.profile?.user == "admin" ? (
          <CardDataStats title="Student" total="20 Leaves" rate="0.43%" levelUp>
            <PiStudentLight className="h-5 w-5 fill-primary dark:fill-white" />
          </CardDataStats>
        ) : null}
        {user?.profile?.user == "faculty" || user?.profile?.user == "admin" ? (
          <CardDataStats title="faculty" total="15 Leaves" rate="2.59%" levelUp>
            <GiTeacher className="h-5 w-5 fill-primary dark:fill-white" />
          </CardDataStats>
        ) : null}
      </div>

      {user?.profile?.user == "admin" && (
        <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
          <LeaveReport />
        </div>
      )}

      {user?.profile?.user == "student" && user?.profile?.roleId == 4 && (
        <div className="boxrounded-sm mt-6 border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h4 className="mb-3 text-title-sm2 font-bold">Leave Request</h4>
          <LeaveHistory />
        </div>
      )}
      {user?.profile?.user == "admin" && (
        <div className="boxrounded-sm mt-6 border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h4 className="mb-3 text-title-sm2 font-bold">All User</h4>
          <AllUser />
        </div>
      )}
      {user?.profile?.user == "admin" && (
        <div className="boxrounded-sm mt-6 border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h4 className="mb-3 text-title-sm2 font-bold">All Leave Request</h4>
          <LeaveRequest />
        </div>
      )}
      {user?.profile?.user == "faculty" && (
        <div className="boxrounded-sm mt-6 border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h4 className="mb-3 text-title-sm2 font-bold">Requested Student Leave</h4>
          <StudentLeaveRequest />
        </div>
      )}
    </>
  );
};

export default ECommerce;
