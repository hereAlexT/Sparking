import { createContext, useContext, useReducer, ReactNode } from "react"
import { useState, useEffect } from 'react';


interface MetaProviderProps {
    children: ReactNode;
}

type MetaContextType = {
    isOnline: boolean;
};

const MetaContext = createContext<MetaContextType>({
    isOnline: true,
});

const initialState = {
    isOnline: true,
}


const MetaProvider: React.FC<MetaProviderProps> = ({ children }) => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const handleStatusChange = () => {
            setIsOnline(navigator.onLine);
        };

        window.addEventListener("online", handleStatusChange);
        window.addEventListener("offline", handleStatusChange);

        // Cleanup function to remove event listeners
        return () => {
            window.removeEventListener("online", handleStatusChange);
            window.removeEventListener("offline", handleStatusChange);
        };
    }, []); // Empty dependency array to run effect only once on mount


    return (
        <MetaContext.Provider value={{ isOnline }}>
            {children}
        </MetaContext.Provider>
    )
}


const useMeta = () => { 
    const context = useContext(MetaContext);
    if (context === undefined) {
        throw new Error('useMeta must be used within a MetaProvider')
    }
    return context;
}

export {MetaProvider, useMeta}