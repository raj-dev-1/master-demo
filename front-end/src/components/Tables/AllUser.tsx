"use client";
import { getApiCall } from "@/utils/apicall";
import { ChangeEvent, useEffect, useState } from "react";
import DropdownDefault from "../Dropdowns/DropdownDefault";
import DeleteModal from "../modal/DeleteModal";
import { toast } from "react-toastify";
import UpdateModal from "../modal/UpdateModal";
import { FiArrowDown, FiArrowUp } from "react-icons/fi";

export interface Faculty {
  id?: number | undefined;
  name: string;
  email: string;
  phone: string;
  department: string;
  div: string;
}
export interface UserLeave {
  usedLeave?: string;
  availableLeave?: string;
}

export interface RequestedBy {
  id?: number;
  name?: string;
  email?: string;
  roleId?: number;
}

export interface RequestedTo {
  id?: number;
  name?: string;
  email?: string;
  roleId?: number;
}

export interface LeaveType {
  id?: number;
  userId?: number;
  startDate: string;
  endDate: string;
  requestToId: number | string; // allow string for initial state
  leaveType: string;
  reason: string;
  status: string;
  roleId?: number;
  createdAt?: string;
  updatedAt?: string;
  UserLeave?: UserLeave;
  requestedBy?: RequestedBy;
  requestedTo?: RequestedTo;
}

const AllUser = () => {
  const [dropDown, setDropdown] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [updateModal, setUpdateModal] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [maxPage, setMaxPage] = useState<number>(1);
  const [searchValue, setSearchValue] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("");
  const [sortField, setSortField] = useState<string>("name");
  const [userId, setUserId] = useState<number | null>(null);
  const [apiData, setApiData] = useState<Faculty[]>([]);
  const [selectValue, setSelectValue] = useState<string>("");
  useEffect(() => {
    const fetchApiData = async () => {
      try {
        if (selectValue == "student") {
          let response: any = await getApiCall(
            `/user/studentList/?search=${searchValue}&page=${currentPage}&sort=${sortField}&order=${sortOrder}`,
          );
          setApiData(response?.data?.dataList || []);
          setMaxPage(response.data.maxPage);
        } else {
          let response: any = await getApiCall(
            `/user/facultyList/?search=${searchValue}&page=${currentPage}&sort=${sortField}&order=${sortOrder}`,
          );
          setApiData(response?.data?.dataList || []);
          setMaxPage(response?.data?.maxPage);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchApiData();
  }, [selectValue, searchValue, currentPage,sortField,sortOrder]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue]);

  const deletApi = async () => {
    try {
      if (userId === null) {
        toast.error("No user selected for deletion");
        return;
      }
      const result = await getApiCall(`/user/removeUser/${userId}`);
      const filteredData = apiData.filter((item) => item.id != userId);
      if (result.status === 200) {
        toast.success("User removed successfully");
        setApiData(filteredData);
      } else {
        toast.error("Failed to remove user");
      }
    } catch (error) {
      console.error("Error removing user:", error);
      toast.error("An error occurred while removing the user");
    }
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };
  
  return (
    <>
      <div className="rounded-sm border border-stroke bg-white dark:border-body dark:bg-boxdark">
        <div className="relative bg-white dark:bg-boxdark sm:rounded-lg">
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
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setSearchValue(e.target.value)
                    }
                    className="bg-gray-50 border-gray-300 text-gray-900 dark:placeholder-gray-400 block w-full rounded-lg border p-2 pl-10 text-sm focus:outline-primary dark:border-body dark:bg-boxdark dark:text-white dark:focus:outline-form-strokedark"
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
                        className="block px-4 py-2 transition-all duration-300 hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-white"
                        onClick={() => {
                          setSelectValue("student");
                          setDropdown(false);
                          setCurrentPage(1);
                        }}
                      >
                        Student
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="block px-4 py-2 transition-all duration-300 hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-white"
                        onClick={() => {
                          setSelectValue("faculty");
                          setDropdown(false);
                          setCurrentPage(1);
                        }}
                      >
                        faculty
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="text-gray-500 dark:text-gray-400 w-full text-left text-sm">
              <thead className="text-gray-700 dark:text-gray-400 border border-stroke bg-primary text-xs uppercase text-white dark:border-form-strokedark dark:bg-strokedark">
                <tr>
                  <th scope="col" className="px-4 py-3">
                    <div
                      className="inline-flex cursor-pointer items-center"
                      onClick={() => {
                        handleSort("name")
                        setSortOrder(
                          sortOrder == ""
                            ? "asc"
                            : sortOrder == "asc"
                              ? "desc"
                              : sortOrder == "desc"
                                ? ""
                                : "",
                        )
                      }}
                    >
                      Name{" "}
                      {sortField === "name" &&
                        (sortOrder === "asc" ? <FiArrowDown /> : sortOrder === "desc" ? <FiArrowUp /> : "")}
                    </div>
                  </th>
                  <th scope="col" className="px-4 py-3">
                    <div
                      className="inline-flex cursor-pointer select-none items-center"
                      onClick={() =>{ 
                        handleSort("email")
                        setSortOrder(
                          sortOrder == ""
                            ? "asc"
                            : sortOrder == "asc"
                              ? "desc"
                              : sortOrder == "desc"
                                ? ""
                                : "asc",
                        )
                      }}
                    >
                      Email
                      {sortField === "email" &&
                        (sortOrder === "asc" ? <FiArrowDown /> : sortOrder === "desc" ? <FiArrowUp /> : "")}
                    </div>
                  </th>
                  <th scope="col" className="px-4 py-3">
                    <div
                      className="flex cursor-pointer select-none items-center"
                      onClick={() =>
                        {handleSort("phone")
                        setSortOrder(
                          sortOrder == ""
                            ? "asc"
                            : sortOrder == "asc"
                              ? "desc"
                              : sortOrder == "desc"
                                ? ""
                                : "asc",
                        )}
                      }
                    >
                      Phone
                      {sortField === "phone" &&
                        (sortOrder === "asc" ? <FiArrowDown /> : sortOrder === "desc" ? <FiArrowUp /> : "")}
                    </div>
                  </th>
                  <th scope="col" className="px-4 py-3">
                    <div
                      className="flex cursor-pointer select-none items-center"
                      onClick={() =>
                        {handleSort("department")
                          setSortOrder(
                            sortOrder == ""
                              ? "asc"
                              : sortOrder == "asc"
                                ? "desc"
                                : sortOrder == "desc"
                                  ? ""
                                  : "asc",
                          )}
                      }
                    >
                      Department
                      {sortField === "department" &&
                        (sortOrder === "asc" ? <FiArrowDown /> : sortOrder === "desc" ? <FiArrowUp /> : "")}
                    </div>
                  </th>
                  <th scope="col" className="px-4 py-3">
                    <div
                      className="flex cursor-pointer select-none items-center"
                      onClick={() =>
                        {handleSort("div")
                          setSortOrder(
                            sortOrder == ""
                              ? "asc"
                              : sortOrder == "asc"
                                ? "desc"
                                : sortOrder == "desc"
                                  ? ""
                                  : "asc",
                          )}
                      }
                    >
                      Division
                      {sortField === "div" &&
                        (sortOrder === "asc" ? <FiArrowDown /> : sortOrder === "desc" ? <FiArrowUp /> : "")}
                    </div>
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
                    className="border-b border-stroke last:border-none dark:border-body"
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
                      <DropdownDefault
                        userIdnum={item.id}
                        setUserId={setUserId}
                        setDeleteModal={setDeleteModal}
                        setUpdateModal={setUpdateModal}
                      />
                    </td>
                  </tr>
                ))}
                {apiData.length == 0 && (
                  <tr className="border-b border-stroke dark:border-body">
                    <td className="px-4 py-3 text-center" colSpan={7}>
                      No Data Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <ul className="mt-3 flex h-10 items-center justify-end -space-x-px text-base">
        <li>
          <a
            href="js:"
            onClick={(e) => {
              e.preventDefault();
              setCurrentPage((p) => (p > 1 ? p - 1 : p));
            }}
            className="text-gray-500 dark:hover:bg-gray-700 ms-0 flex h-10 items-center justify-center rounded-s-lg border border-e-0 border-stroke bg-white px-4 leading-tight transition-all duration-300 hover:bg-bodydark hover:text-white dark:border-form-strokedark dark:bg-form-input dark:text-gray dark:hover:text-white"
          >
            <span className="sr-only">Previous</span>
            <svg
              className="h-3 w-3 rtl:rotate-180"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 1 1 5l4 4"
              />
            </svg>
          </a>
        </li>
        {/* Map over an array to create page numbers dynamically */}
        {Array.from(
          {
            length:
              Math.min(maxPage, currentPage + 2) -
              Math.max(1, currentPage - 2) +
              1,
          },
          (_, index) => Math.max(1, currentPage - 2) + index,
        ).map((page) => (
          <li key={page}>
            <a
              href="js:"
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage(page);
              }}
              className={`flex h-10 items-center justify-center px-4 leading-tight ${currentPage === page ? "border-primary bg-primary text-white" : ""} border border-stroke dark:border-form-strokedark dark:hover:bg-graydark dark:hover:text-white`}
            >
              {page}
            </a>
          </li>
        ))}
        <li>
          <a
            href="js:"
            onClick={(e) => {
              e.preventDefault();
              setCurrentPage((p) => (p < maxPage ? p + 1 : p));
            }}
            className="text-gray-500 dark:bg-gray-800 dark:hover:bg-gray-700 flex h-10 items-center justify-center rounded-e-lg border border-stroke bg-white px-4 leading-tight transition-all hover:bg-bodydark hover:text-white dark:border-form-strokedark dark:bg-form-input dark:hover:text-white"
          >
            <span className="sr-only">Next</span>
            <svg
              className="h-3 w-3 rtl:rotate-180"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 9 4-4-4-4"
              />
            </svg>
          </a>
        </li>
      </ul>
      {deleteModal && (
        <DeleteModal deleteApi={deletApi} setDeleteModal={setDeleteModal} />
      )}
      {updateModal && (
        <UpdateModal
          userData={apiData}
          setApiData={setApiData}
          userId={userId}
          selectValue={selectValue}
          setUpdateModal={setUpdateModal}
        />
      )}
    </>
  );
};

export default AllUser;
