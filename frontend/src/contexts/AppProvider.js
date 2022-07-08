import React from "react";
import MetaMaskProvider from "./MetaMaskContext";
import SimpleBankProvider from "./SimpleBankContext";

export default function AppProvider({ children }) {
    return (
        <MetaMaskProvider>
            <SimpleBankProvider>{children}</SimpleBankProvider>
        </MetaMaskProvider>
    );
}
