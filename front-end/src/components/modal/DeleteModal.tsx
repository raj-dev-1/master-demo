import React, { Dispatch, SetStateAction } from "react";
interface DeleteModalProps {
    setDeleteModal: Dispatch<SetStateAction<boolean>>;
    deleteApi: (params: any) => void;
}
const DeleteModal : React.FC<DeleteModalProps> = ({setDeleteModal, deleteApi}) => {
  return (
    <div
      className="fixed flex z-50 h-[calc(100%-1rem)] max-h-full w-full items-center justify-center overflow-y-auto overflow-x-hidden md:inset-0"
    >
      <div className="relative max-h-full w-full max-w-md p-4">
        <div className="dark:bg-form-input  relative rounded-lg bg-white shadow-4">
          <button
            type="button"
            onClick={() => setDeleteModal(false)}
            className="text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 absolute end-2.5 top-3 ms-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-sm dark:hover:text-white"
            data-modal-hide="popup-modal"
          >
            <svg
              className="h-3 w-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
            <span className="sr-only">Close modal</span>
          </button>
          <div className="p-4 text-center md:p-5">
            <svg
              className="text-gray-400 dark:text-gray-200 mx-auto mb-4 h-12 w-12"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            <h3 className="text-gray-500 dark:text-gray-400 mb-5 text-lg font-normal">
              Are you sure you want to delete this user?
            </h3>
            <button
              type="button"
              onClick={deleteApi} 
              className="inline-flex mx-2 items-center transition-all rounded bg-red-600 px-5 py-2.5 text-center font-medium text-white hover:bg-red-800 "
            > Yes, I'm sure </button>
            <button onClick={() => setDeleteModal(false)} className="inline-flex mx-2 justify-center rounded border border-stroke px-5 py-2.5 font-medium text-black hover:shadow-1 dark:border-form-strokedark dark:text-white" type="button"> No, cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
