import React, { createContext, useContext } from "react";
import AuthStore from "../stores/AuthStore";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const authStore = React.useMemo(() => new AuthStore(), []);

    return (
        <AuthContext.Provider value={authStore}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);