import Calendar from "@/components/Calender";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
// import axios from "axios";
// import { useEffect } from "react";

export const metadata: Metadata = {
  title: "Next.js Calender",
};

const CalendarPage = () => {
  // const getApi = async () => {
  //   try {
  //     const res = await axios.get("http://localhost:5000");
  //     const data = res.data;
  //     console.log(data);
  //   } catch (error) {
  //     console.error("erors",error);
  //   }
  // };

  // useEffect(() => {
  //   getApi();
  // }, []);
  return (
    <DefaultLayout>
      <Calendar />
    </DefaultLayout>
  );
};

export default CalendarPage;
