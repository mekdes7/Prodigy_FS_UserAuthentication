import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
    axios.defaults.withCredentials=true
  const BackendURL = import.meta.env.VITE_BACKEND_URL;
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(null); 
console.log("BackendURL:", BackendURL);

const getAuthState=async()=>{
    try {
        const {data}=await axios.get(BackendURL+'/api/auth/is-auth')
        if(data.success){
            setIsLoggedin(true)
            getUserData()
        }
    } catch (error) {
        toast.error(error.response?.data?.message );
    }
}
useEffect(()=>{
getAuthState();
},[])

  const getUserData = async () => {
  try {
    const response = await axios.get(BackendURL + "/api/user/data", {
      withCredentials: true,
    });

    if (response.data.success) {
      console.log("User Data:", response.data.userData); 
      setUserData(response.data.userData);
    } else {
      toast.error(response.data.message);
    }
  } catch (error) {
    toast.error(error.response?.data?.message );
  }
};
  const value = {
    BackendURL,
    isLoggedin,
    setIsLoggedin,
    userData,
    setUserData,
    getUserData,
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};