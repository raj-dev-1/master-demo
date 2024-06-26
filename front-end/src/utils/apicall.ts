import axios from "axios";
const baseUrl = process.env.NEXT_PUBLIC_BASEURL;

export const getApiCall = async (url: string) => {
  try {
    const res: any = await axios.get(`${baseUrl + url}`, { withCredentials: true });
    return res;
  } catch (error: any) {
    console.error(error);
    return error?.response?.data;
    // throw new Error(error.response?.data?.message || error.message || 'An error occurred');
  }
};

export const postApiCall = async (url: string, data: any) => {
  try {
    const res: any = await axios.post(`${baseUrl + url}`, data, { withCredentials: true })
    return res;
  } catch (error: any) {
    console.error(error);
    return error?.response?.data;
    // throw new Error(error.response?.data?.message || error.message || 'An error occurred');
  }
};

export const putApiCall = async (url: string, data: any) => {
  try {
    const res: any = await axios.put(`${baseUrl + url}`, data, { withCredentials: true });
    return res;
  } catch (error: any) {
    console.error(error);
    return error?.response?.data;
  }
};
