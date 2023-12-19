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
      };
    case "LOGOUT":
      return {
        ...state,
        isLoggedIn: false,
        userName: null,
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
  });

  useEffect(() => {
    console.log("Auth State Updated:", state);
    localStorage.setItem("isLoggedIn", state.isLoggedIn.toString());
    localStorage.setItem("userName", state.userName || "");
  }, [state.isLoggedIn, state.userName]);
  

  const login = (userName) => {
    dispatch({ type: "LOGIN", payload: { userName } });
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userName", userName);
    navigate("/Admin");
  };
  
  const logout = () => {
    dispatch({ type: "LOGOUT" });
    // Naviguer vers la page souhaitée après la déconnexion
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
