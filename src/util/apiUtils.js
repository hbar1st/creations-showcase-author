

import { redirect } from "react-router";
import { getToken } from "../util/storage";


// const CS_API_URL = "https://civic-janenna-hbar1stdev-7cb31133.koyeb.app";
export const CS_API_URL = "http://localhost:3000"
export const API_HEADERS = {
  "Content-Type": "application/x-www-form-urlencoded",
  Authorization: `Bearer ${getToken()}`,
};
  
export async function getDashboardData() {

  // TODO call the api to get all the data needed to display the author dashboard
  const res = await fetch(`${CS_API_URL}/user`, {
    method: "GET",
    headers: API_HEADERS,
  });

  if (res.status === 401) {
    console.log("trying to get user data but not authorized")
    throw redirect("/");
  }
  if (res.ok) {    
    const data = await res.json();
    console.log("this is the data the loader should show: ", data.user);
    return data.user;
  } else {
    throw new Error("Internal error. Failed to contact the server. Contact support if the issue persists.")
  }
}
