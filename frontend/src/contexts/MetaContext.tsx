import { createContext, useContext, useReducer, ReactNode } from "react"
import { useState, useEffect } from 'react';


interface MetaProviderProps {
    children: ReactNode;
}

type MetaContextType = {
    isOnline: boolean;
    isSplitPaneOn: boolean;
    setIsSplitPaneOn: (value: boolean) => void;
};

const MetaContext = createContext<MetaContextType>({
    isOnline: true,
    isSplitPaneOn: false,
    setIsSplitPaneOn: () => { },
});


const MetaProvider: React.FC<MetaProviderProps> = ({ children }) => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [isSplitPaneOn, setIsSplitPaneOn] = useState<boolean>(false);


    useEffect(() => {
        console.debug("isSplitPaneOn: ", isSplitPaneOn); // Print the isSplitPaneOn state whenever it changes
    }, [isSplitPaneOn]);

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
        <MetaContext.Provider value={{ isOnline, isSplitPaneOn, setIsSplitPaneOn }}>
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

export { MetaProvider, useMeta }