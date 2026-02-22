import { createContext } from "react";

export const INITIAL_DATA = {
    time: "Loading...",
    timeElapsed: "0 seconds",
};

export type DataContextType = {
    data: Record<string, string | number>;
    appendHistory: (text: string) => void;
    setShowCopied: (status: boolean) => void;
};

export const DataContext = createContext<DataContextType>({
    data: INITIAL_DATA,
    appendHistory: () => {},
    setShowCopied: () => {},
});
