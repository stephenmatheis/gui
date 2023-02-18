import { createContext, useState, useContext } from 'react';

const WindowContext = createContext();

export function useWindowContext() {
    return useContext(WindowContext);
}

export function WindowProvider({ children }) {
    const [order, setOrder] = useState([]);

    return (
        <WindowContext.Provider value={{ order, setOrder }}>
            {children}
        </WindowContext.Provider>
    )
}