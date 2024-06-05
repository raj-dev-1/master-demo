"use client";
import React, { useEffect, useState } from "react";
// import ChartOne from "../Charts/ChartOne";
// import ChartThree from "../Charts/ChartThree";
// import ChartTwo from "../Charts/ChartTwo";
// import ChatCard from "../Chat/ChatCard";
// import TableOne from "../Tables/TableOne";
import CardDataStats from "../CardDataStats";
// import MapOne from "../Maps/MapOne";
import TableThree from "../Tables/TableThree";
import { useUserContext } from "@/context/UserContext";
import { UserFetcher } from "../UserFetcher/UserFetcher";
import { PiStudentLight } from "react-icons/pi";
import { RiUserSettingsFill } from "react-icons/ri";
import { GiTeacher } from "react-icons/gi";
import TableOne from "../Tables/TableOne";

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
        {user?.profile?.user == "hod" || user?.profile?.user == "admin" ? (
          <CardDataStats title="Hod" total="12 Leaves" rate="4.35%" levelUp>
            <RiUserSettingsFill className="h-5 w-5 fill-primary dark:fill-white" />
          </CardDataStats>
        ) : null}
        {user?.profile?.user == "faculty" || user?.profile?.user == "admin" ? (
          <CardDataStats title="faculty" total="15 Leaves" rate="2.59%" levelUp>
            <GiTeacher className="h-5 w-5 fill-primary dark:fill-white" />
          </CardDataStats>
        ) : null}
      </div>

      {/* <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <ChartOne />
        <ChartTwo />
        <ChartThree />
        <MapOne />
        <ChatCard />
      </div> */}

      {user?.profile?.user != "admin" && user?.profile?.roleId != 1 && (
        <div className="boxrounded-sm mt-6 border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h4 className="mb-3 text-title-sm2 font-bold">Leave Request</h4>
          <TableThree />
        </div>
      )}
      <div className="boxrounded-sm mt-6 border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h4 className="mb-3 text-title-sm2 font-bold">Leave Request</h4>
          <TableOne />
        </div>
    </>
  );
};

export default ECommerce;
