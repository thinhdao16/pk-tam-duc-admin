import { createContext, useContext, useState } from "react";

export const AuthContext = createContext(); // Tạo AuthContext

export function AuthContextProvider({ children }) {
    const [loadingGlobal, setLoadingGlobal] = useState(false);
    const [dataXdndDesign, setDataXdndDesign] = useState([]);
    const [refeshLogin, setRefeshLogin] = useState(null)
    return (
        <AuthContext.Provider
            value={{
                loadingGlobal,
                setLoadingGlobal,
                dataXdndDesign,
                setDataXdndDesign,
                refeshLogin, setRefeshLogin
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
export function useAuthContext() {
    return useContext(AuthContext);
}
