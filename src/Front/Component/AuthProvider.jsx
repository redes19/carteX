import React, { createContext, useReducer, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        isLoggedIn: true,
        userName: action.payload.userName,
        isAdmin: action.payload.isAdmin || false,
      };
    case "LOGOUT":
      return {
        ...state,
        isLoggedIn: false,
        userName: null,
        isAdmin: false,
      };
    default:
      return state;
  }
};

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(authReducer, {
    isLoggedIn: localStorage.getItem("isLoggedIn") === "true",
    userName: localStorage.getItem("userName") || null,
    isAdmin: Number(localStorage.getItem("isAdmin")) === 1, // Parse as boolean
  });

  useEffect(() => {
    console.log("Auth State Updated:", state);
    localStorage.setItem("isLoggedIn", state.isLoggedIn.toString());
    localStorage.setItem("userName", state.userName || "");
    localStorage.setItem("isAdmin", state.isAdmin ? "1" : "0");
  }, [state]);

  const login = (userName, token, isAdmin) => {
    dispatch({ type: "LOGIN", payload: { userName, isAdmin: isAdmin || false } });

    console.log("Isadmin:", isAdmin);

    localStorage.setItem("token", token);
    navigate("/");
  };

  const logout = () => {
    dispatch({ type: "LOGOUT" });
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth };
