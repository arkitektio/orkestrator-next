import { useState } from "react";
import { DebugContext } from "./DebugContext";


export const DebugProvider = (props: {children: React.ReactNode}) => {
    const [debug, setDebug] = useState(false);
    return <DebugContext.Provider value={{debug, setDebug}}>{props.children}</DebugContext.Provider>;
}