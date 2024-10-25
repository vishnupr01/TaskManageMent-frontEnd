import { useContext } from "react";

import { Navigate } from "react-router-dom";
import { AuthContext } from "../contex/AuthContext";

export const ProtectedRoutes = ({ children }) => {
  const { isAuthenticated,loading} = useContext(AuthContext);
    console.log("isAuthenticated:",isAuthenticated);
    if(loading){
      return null
    }
  return isAuthenticated ? children : <Navigate to="/login" />;
};