import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { clearToken, getToken } from "../util/storage";

// const CS_API_URL = "https://civic-janenna-hbar1stdev-7cb31133.koyeb.app";
export const CS_API_URL = "http://localhost:3000";

export const getHeader = (token) => ({
  "Content-Type": "application/x-www-form-urlencoded",
  Authorization: `Bearer ${token}`,
});


export async function callPutAPI(route, formData) {
    if (!getToken) {
      console.trace(getToken);
      throw new Error("Unexpected error: token is missing");
    }
    try {
      const res = await fetch(`${CS_API_URL}${route}`, {
        method: "PUT",
        headers: getHeader(getToken()),
        body: new URLSearchParams(formData),
      });
      if (res.status === 401) {
        console.log("trying to get data but not authorized");
        clearToken();
        navigate("/login", { state: location.pathname });
      } else if (res.ok || res.status === 400) {
        const data = await res.json();
        console.log("this is the data the page should show: ", data);
        return data;
      } else {
        throw new Error(
          "Internal error. Failed to contact the server. Contact support if the issue persists. Status code: " +
            res.status
        );
      }
    } catch (error) {
      console.log(error, error.stack);
      throw new Error(
        "Internal error. Failed to complete the request. Contact support if the issue persists"
      );
    }
  }


export function useAuthorizeToken() {
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const res = await fetch(`${CS_API_URL}/user/authenticate`, {
          method: "GET",
          headers: getHeader(getToken()),
        });
        if (res.status === 404) {
          console.log("umm, api call didn't go thru?");
          throw new Error("Internal Error. Contact support if error persists.");
        } else if (!res.ok) {
          console.log("about to clear the token in apiUtils");
          clearToken();
          setIsAuthorized(false);
        } else if (res.ok) {
          setIsAuthorized(true);
        }
      } catch (error) {
        console.log(error, error.stack);
        throw new Error(error.message);
      }
    };
    if (getToken()) {
      verifyToken();
    }
  }, []);

  return isAuthorized;
}

export function useGetAPI(route) {
  const [data, setData] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    async function callAPI() {
      if (!getToken) {
        console.trace(getToken);
        throw new Error("Unexpected error: token is missing");
      }
      try {
        const res = await fetch(`${CS_API_URL}${route}`, {
          method: "GET",
          headers: getHeader(getToken()),
        });
        if (res.status === 401) {
          console.log("trying to get user data but not authorized");
          clearToken();
          navigate("/login", { state: location.pathname });
        } else if (res.ok) {
          const data = await res.json();
          console.log("this is the data the loader should show: ", data.user);
          setData(data);
        } else {
          throw new Error(
            "Internal error. Failed to contact the server. Contact support if the issue persists."
          );
        }
      } catch (error) {
        console.log(error, error.stack);
        throw new Error(
          "Internal error. Failed to complete the request. Contact support if the issue persists"
        );
      }
    }
    if (route) {
      callAPI();
    }
  }, [location.pathname, navigate, route]);

  return data;
}
