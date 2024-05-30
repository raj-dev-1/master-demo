import axios, { AxiosResponse } from "axios";
const baseUrl = process.env.NEXT_PUBLIC_BASEURL;

export const getApiCall = async (url: string) => {
  try {
    const res : any = await axios.get(`${baseUrl + url}`, { withCredentials: true });
    return res.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const postApiCall = async (url: string, data: any) => {
  try {
    const res = await axios.post(`${baseUrl + url}`, data);
    return res.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
