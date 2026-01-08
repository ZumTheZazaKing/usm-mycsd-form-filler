/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext } from "react";

const StoreContext = createContext({});

export const StoreProvider = ({children}) => {
    return (
        <StoreContext.Provider>
            {children}
        </StoreContext.Provider>
    )
};

export const useStore = () => useContext(StoreContext)