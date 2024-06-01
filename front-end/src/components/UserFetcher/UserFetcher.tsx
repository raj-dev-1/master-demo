import { useUserContext } from "@/context/UserContext";
import { getApiCall } from "@/utils/apicall";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

export function UserFetcher() {
  const [user, setUser] = useUserContext();
  const [role, setRole] = useState("");

  const getApi = async () => {
    try {
      const result = await getApiCall("/user/profile");
      setUser(result.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    const storedRole = Cookies.get("role");
    if (storedRole) {
      setRole(storedRole);
    }
    getApi();
  }, []);
  return null; // This component doesn't render anything
}
