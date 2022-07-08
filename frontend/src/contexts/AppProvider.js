import React from "react";

export default function AppProvider({ children }) {
    return (
        <MetaMaskProvider>
            <SimpleBankProvider>{children}</SimpleBankProvider>
        </MetaMaskProvider>
    );
}
