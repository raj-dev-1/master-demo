"use client";
import { getApiCall } from "@/utils/apicall";
import { useEffect, useState } from "react";

interface Faculty {
  name: string;
  email: string;
  phone: string;
  department: string;
  div: string;
}

const TableOne = () => {
  const [dropDown, setDropdown] = useState<boolean>(false);
  const [apiData, setApiData] = useState<Faculty[]>([]);
  const [selectValue, setSelectValue] = useState<string>("");
  useEffect(() => { 
    const fetchApiData = async () => {
      try {
        if(selectValue == "student"){
            let response : any = await getApiCall("/manage/studentList");
            setApiData(response?.data?.studentList || []);
        } else if(selectValue == "faculty"){
            let response : any = await getApiCall("/manage/facultyList");
            setApiData(response?.data?.facultyList || []);
        } else {
            let response : any = await getApiCall("/manage/hodList");
            setApiData(response?.data?.hodList || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchApiData();
  }, [selectValue]);

  console.log(apiData);

  return (
    <div className="rounded-sm border border-stroke bg-white dark:border-body dark:bg-boxdark">
      <div className="relative overflow-hidden bg-white dark:bg-boxdark sm:rounded-lg">
        <div className="flex flex-col items-center justify-between space-y-3 p-4 md:flex-row md:space-x-4 md:space-y-0">
          <div className="w-full md:w-1/2">
            <form className="flex items-center">
              <label htmlFor="simple-search" className="sr-only">
                Search
              </label>
              <div className="relative w-full">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg
                    aria-hidden="true"
                    className="text-gray-500 dark:text-gray-400 h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  id="simple-search"
                  className="bg-gray-50 border-gray-300 text-gray-900 dark:placeholder-gray-400 block w-full rounded-lg border p-2 pl-10 text-sm dark:border-body dark:bg-boxdark dark:text-white"
                  placeholder="Search"
                />
              </div>
            </form>
          </div>
          <div className="flex w-full flex-shrink-0 flex-col items-stretch justify-end space-y-2 md:w-auto md:flex-row md:items-center md:space-x-3 md:space-y-0">
            <div className="relative flex w-full flex-col items-end justify-end space-x-3 md:w-auto">
              <button
                onClick={() => {
                  setDropdown(!dropDown);
                }}
                className="text-gray-900 border-gray-200 hover:bg-gray-100 hover:text-primary-700 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 mb-1 flex w-full items-center justify-center rounded-lg border bg-white px-4 py-2 text-sm font-medium focus:outline-none dark:bg-form-input dark:hover:text-white md:w-auto"
                type="button"
              >
                <svg
                  className="-ml-1 mr-1.5 h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    clipRule="evenodd"
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  />
                </svg>
                Actions
              </button>
              <div
                className={`${dropDown ? "" : "hidden"} dark:divide-gray-600 absolute right-0 top-10 z-10 w-44 divide-y divide-stroke rounded border border-stroke bg-white shadow-default dark:bg-strokedark`}
              >
                <ul className="text-gray-700 dark:text-gray-200 py-1 text-sm">
                  <li>
                    <a
                      href="#"
                      className="hover:bg-gray-100 dark:hover:bg-gray-600 block px-4 py-2 dark:hover:text-white"
                      onClick={() => {
                        setSelectValue('student');
                        setDropdown(false);
                    }}
                    >
                      Student
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:bg-gray-100 dark:hover:bg-gray-600 block px-4 py-2 dark:hover:text-white"
                      onClick={() => {
                        setSelectValue('faculty');
                        setDropdown(false);
                    }}
                    >
                      faculty
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:bg-gray-100 dark:hover:bg-gray-600 block px-4 py-2 dark:hover:text-white"
                      onClick={() => {
                        setSelectValue('hod');
                        setDropdown(false);
                    }}
                    >
                      hod
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="text-gray-500 dark:text-gray-400 w-full text-left text-sm">
            <thead className="text-gray-700 dark:text-gray-400 bg-primary text-xs uppercase text-white dark:bg-strokedark">
              <tr>
                <th scope="col" className="px-4 py-3">
                  Name
                </th>
                <th scope="col" className="px-4 py-3">
                  Email
                </th>
                <th scope="col" className="px-4 py-3">
                  Phone
                </th>
                <th scope="col" className="px-4 py-3">
                  Department
                </th>
                <th scope="col" className="px-4 py-3">
                  Division
                </th>
                <th scope="col" className="px-4 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {apiData.map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-stroke dark:border-body"
                >
                  <th
                    scope="row"
                    className="text-gray-900 whitespace-nowrap px-4 py-3 font-medium dark:text-white"
                  >
                    {item.name}
                  </th>
                  <td className="px-4 py-3">{item.email}</td>
                  <td className="px-4 py-3">{item.phone}</td>
                  <td className="px-4 py-3">{item.department}</td>
                  <td className="px-4 py-3">{item.div}</td>
                  <td className="flex items-center justify-end px-4 py-3">
                    <button
                      id="dropdown-button"
                      data-dropdown-toggle="dropdown"
                      className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100 inline-flex items-center rounded-lg p-0.5 text-center text-sm font-medium focus:outline-none"
                      type="button"
                    >
                      <svg
                        className="h-5 w-5"
                        aria-hidden="true"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                      </svg>
                    </button>
                    <div
                      id="dropdown"
                      className="divide-gray-100 dark:bg-gray-700 dark:divide-gray-600 z-10 hidden w-44 divide-y rounded bg-white shadow"
                    >
                      <ul
                        className="text-gray-700 dark:text-gray-200 py-1 text-sm"
                        aria-labelledby="dropdown-button"
                      >
                        <li>
                          <a
                            href="#"
                            className="hover:bg-gray-100 dark:hover:bg-gray-600 block px-4 py-2 dark:hover:text-white"
                          >
                            Show
                          </a>
                        </li>
                        <li>
                          <a
                            href="#"
                            className="hover:bg-gray-100 dark:hover:bg-gray-600 block px-4 py-2 dark:hover:text-white"
                          >
                            Edit
                          </a>
                        </li>
                      </ul>
                      <div className="py-1">
                        <a
                          href="#"
                          className="text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 block px-4 py-2 text-sm dark:hover:text-white"
                        >
                          Delete
                        </a>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
              {apiData.length == 0 && (
                <tr className="border-b border-stroke dark:border-body">
                  <td className="px-4 py-3 text-center" colSpan={6}>No Data Found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TableOne;
