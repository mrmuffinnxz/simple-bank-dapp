import React, { useState, createContext, useContext, useEffect } from "react";

const MetaMaskContext = createContext();

export function useMetaMask() {
    return useContext(MetaMaskContext);
}

export default function MetaMaskProvider({ children }) {
    const [user, setUser] = useState();
    const { ethereum } = window;

    async function connectWallet() {
        if (ethereum) {
            const accounts = await ethereum.request({
                method: "eth_requestAccounts",
            });
            if (accounts.length > 0) {
                setUser(accounts[0]);
            }
        }
    }

    const value = {
        user,
        connectWallet,
    };

    return (
        <MetaMaskContext.Provider value={value}>
            {children}
        </MetaMaskContext.Provider>
    );
}
