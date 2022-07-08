import React, {
    useState,
    createContext,
    useContext,
    useEffect,
    useCallback,
} from "react";

const MetaMaskContext = createContext();

export function useMetaMask() {
    return useContext(MetaMaskContext);
}

export default function MetaMaskProvider({ children }) {
    const [user, setUser] = useState();
    const { ethereum } = window;

    const connectWallet = useCallback(async () => {
        if (ethereum) {
            const accounts = await ethereum.request({
                method: "eth_requestAccounts",
            });
            const chainId = await ethereum.request({ method: "eth_chainId" });
            if (accounts.length > 0) {
                setUser({ address: accounts[0], chain: chainId });
            }
        }
    }, [ethereum]);

    useEffect(() => {
        connectWallet();
    }, [connectWallet]);

    useEffect(() => {
        if (ethereum) {
            ethereum.on("chainChanged", () => {
                if (user) {
                    connectWallet();
                }
            });
            ethereum.on("accountsChanged", () => {
                if (user) {
                    connectWallet();
                }
            });
        }
    }, [ethereum, user, connectWallet]);

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
