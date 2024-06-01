"use client";
import React, { useEffect, useState } from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  isWithinInterval,
  isAfter,
} from "date-fns";

import Breadcrumb from "../Breadcrumbs/Breadcrumb";
import { useUserContext } from "@/context/UserContext";
import { getApiCall } from "@/utils/apicall";

export const getLeaveData = () => {
  return [
    {
      status: "Pending",
      leaveType: "raj",
      startDate: "2024-05-06",
      endDate: "2024-05-07",
    },
    {
      status: "Approved",
      leaveType: "Aaron",
      startDate: "2024-05-12",
      endDate: "2024-05-14",
    },
    {
      status: "Rejected",
      leaveType: "Aaron",
      startDate: "2024-05-23",
      endDate: "2024-05-26",
    },
    {
      status: "Pending",
      leaveType: "mayur",
      startDate: "2024-05-23",
      endDate: "2024-05-26",
    },
    {
      status: "Pending",
      leaveType: "keyur",
      startDate: "2024-05-23",
      endDate: "2024-05-26",
    },
    {
      status: "Pending",
      leaveType: "om",
      startDate: "2024-05-23",
      endDate: "2024-05-26",
    },
    {
      status: "Pending",
      leaveType: "ravu",
      startDate: "2024-05-23",
      endDate: "2024-05-26",
    },
    {
      status: "Pending",
      leaveType: "ravu",
      startDate: "2024-05-23",
      endDate: "2024-05-26",
    },
    {
      status: "Pending",
      leaveType: "ravu",
      startDate: "2024-05-23",
      endDate: "2024-05-26",
    },
    {
      status: "Pending",
      leaveType: "ravu",
      startDate: "2024-05-23",
      endDate: "2024-05-26",
    },
    {
      status: "Pending",
      leaveType: "ravu",
      startDate: "2024-05-23",
      endDate: "2024-05-26",
    },
    {
      status: "Pending",
      leaveType: "ravu",
      startDate: "2024-05-23",
      endDate: "2024-05-26",
    },
  ];
};

export const leaveTypes: any = {
  Approved: "before:bg-green-500",
  Pending: "before:bg-yellow-400",
  Recalled: "before:bg-pink-500",
  Rejected: "before:bg-red-500",
  Holiday: "before:bg-stone-600",
};

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [leaveData, setLeaveData] = useState<{ [key: string]: any }>({});
  const [user, setUser] = useUserContext();
  const getApi = async () => {
    try {
      let result: any;
      if (user.profile.user == "student") {
        result = await getApiCall("/user/leaveStatus");
        setLeaveData(result.data.leaveStatus);
      } else {
        result = await getApiCall("/manage/userLeaveStatus");
        setLeaveData(result.data.leaveStatus);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  useEffect(() => {
    // Fetch leave data
    // const data = getLeaveData();
    if(user){
      getApi();
    }
    // setLeaveData(data);
  }, [user]);

  console.log("calnders", leaveData);

  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const prevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleDateClick = (day: Date) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(day);
      setEndDate(null);
    } else if (isAfter(day, startDate)) {
      setEndDate(day);
    } else {
      setStartDate(day);
    }
  };

  const renderHeader = () => {
    const dateFormat = "yyyy MMMM";
    return (
      <div className="header flex justify-between border-2 border-stroke dark:border-strokedark p-2">
        <span className="text-lg font-bold text-black dark:text-gray">
          {format(currentDate, dateFormat)}
        </span>
        <div className="buttons">
          <button className="p-1 text-black dark:text-white" onClick={prevMonth}>
            <svg
              width="1em"
              height="1em"
              viewBox="0 0 16 16"
              className="bi bi-arrow-left-circle"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"
              />
              <path
                fillRule="evenodd"
                d="M8.354 11.354a.5.5 0 0 0 0-.708L5.707 8l2.647-2.646a.5.5 0 1 0-.708-.708l-3 3a.5.5 0 0 0 0 .708l3 3a.5.5 0 0 0 .708 0z"
              />
              <path
                fillRule="evenodd"
                d="M11.5 8a.5.5 0 0 0-.5-.5H6a.5.5 0 0 0 0 1h5a.5.5 0 0 0 .5-.5z"
              />
            </svg>
          </button>
          <button className="p-1 text-black dark:text-white" onClick={nextMonth}>
            <svg
              width="1em"
              height="1em"
              viewBox="0 0 16 16"
              className="bi bi-arrow-right-circle"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"
              />
              <path
                fillRule="evenodd"
                d="M7.646 11.354a.5.5 0 0 1 0-.708L10.293 8 7.646 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0z"
              />
              <path
                fillRule="evenodd"
                d="M4.5 8a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5z"
              />
            </svg>
          </button>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const dateFormat = "EEE";
    const days = [];
    let start = startOfWeek(currentDate);

    for (let i = 0; i < 7; i++) {
      days.push(
        <th
          key={i}
          className={`h-10 w-10 ${i == 0 ? 'border-l-2': ''} border-r-2 border-stroke dark:border-strokedark p-2 text-xs sm:w-20 md:w-30 lg:w-30 xl:w-40 xl:text-sm`}
        >
          <span className="hidden text-black dark:text-gray sm:block md:block lg:block xl:block">
            {format(addDays(start, i), dateFormat)}
          </span>
          <span className="block text-black dark:text-gray sm:hidden md:hidden lg:hidden xl:hidden">
            {format(addDays(start, i), "EEE").substring(0, 3)}
          </span>
        </th>,
      );
    }
    return <tr>{days}</tr>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
  
    const dateFormat = "d";
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";
  
    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat);
        const cloneDay = day;
        const leaveInfos = Object.values(leaveData).filter((info) => {
          const adjustedStartDate = new Date(info.startDate);
          adjustedStartDate.setDate(adjustedStartDate.getDate() - 1);
          const endDate = new Date(info.endDate);
  
          return isWithinInterval(day, {
            start: adjustedStartDate,
            end: endDate,
          });
        });
  
        const isSelected =
          startDate &&
          endDate &&
          isWithinInterval(day, { start: startDate, end: endDate });
  
        let cellContent = (
          <div className="flex h-full min-h-40 w-full flex-col overflow-hidden p-2">
            <div className="top w-full">
              <span className="text-gray-500">{formattedDate}</span>
            </div>
            <div className="bottom h-30 w-full flex-grow cursor-pointer py-1"></div>
          </div>
        );
  
        if (leaveInfos.length > 0) {
          const uniqueLeaves : any = [];
  
          leaveInfos.forEach((leaveInfo) => {
            if (
              !uniqueLeaves.some(
                (uniqueLeave : any) =>
                  uniqueLeave.startDate === leaveInfo.startDate &&
                  uniqueLeave.endDate === leaveInfo.endDate
              )
            ) {
              uniqueLeaves.push(leaveInfo);
            }
          });
  
          cellContent = (
            <div className="mx-auto flex h-full min-h-40 w-full flex-col overflow-hidden p-2">
              <div className="top w-full">
                <span className="text-gray-500">{formattedDate}</span>
              </div>
              <div className="bottom flex w-full flex-grow cursor-pointer flex-col gap-1 py-1">
                {uniqueLeaves.map((leaveInfo : any, index : number) => (
                  <span
                    key={index}
                    className={`block rounded-md px-1 overflow-hidden relative py-0 text-center lg:py-1.5 custom_piece text-black bg-gray dark:bg-meta-4 dark:text-white ${
                      leaveTypes[leaveInfo.status]
                    }`}
                  >
                    {leaveInfo.leaveType}
                  </span>
                ))}
              </div>
            </div>
          );
        }
  
        days.push(
          <td
            key={day.toString()}
            className={`ease hover:bg-gray-300 min-h-40 h-full w-10 cursor-pointer overflow-auto border-stroke dark:border-strokedark border-2 sm:w-20 md:w-30 lg:w-30 xl:w-40 
                ${
                  !isSameMonth(day, monthStart)
                    ? "text-gray-600 bg-stroke dark:bg-strokedark"
                    : isSameDay(day, new Date())
                    ? "bg-blue-200 dark:bg-sky-900"
                    : isSelected
                    ? ""
                    : "text-gray-700"
                } `}
            onClick={() => handleDateClick(cloneDay)}
          >
            {cellContent}
          </td>
        );
        day = addDays(day, 1);
      }
      rows.push(<tr key={day.toString()}>{days}</tr>);
      days = [];
    }
    return <tbody>{rows}</tbody>;
  };
  
  
  return (
    <div className="container mx-auto mt-16">
      <Breadcrumb pageName="Calendar" />
      <div className="w-full max-w-full rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        {renderHeader()}
        <table className="w-full ">
          <thead>{renderDays()}</thead>
          {renderCells()}
        </table>
      </div>
      <div className="mt-3 flex sm:flex-row flex-col gap-3 ">
        <div className="flex items-center space-x-2">
          <div className="h-4 w-4 bg-green-500"></div>
          <span className="text-black dark:text-white">Approved</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="h-4 w-4 bg-yellow-400"></div>
          <span className="text-black dark:text-white">Pending</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="h-4 w-4 bg-pink-500"></div>
          <span className="text-black dark:text-white">Recalled</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="bg-red-500 h-4 w-4 bg-red"></div>
          <span className="text-black dark:text-white">Rejected</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="h-4 w-4 bg-stone-600"></div>
          <span className="text-black dark:text-white">Holiday</span>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
