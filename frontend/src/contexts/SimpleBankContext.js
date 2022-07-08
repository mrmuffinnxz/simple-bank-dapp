import React, {
    useState,
    useEffect,
    createContext,
    useContext,
    useCallback,
} from "react";
import contract from "../contracts/SimpleBank.json";
import { ethers } from "ethers";
import { useMetaMask } from "./MetaMaskContext";

const contractAddress = "0x0625B3eBc42f138C89D165c9484933df0c16ebaa";
const abi = contract.abi;

const SimepleBankContext = createContext();

export function useSimpleBank() {
    return useContext(SimepleBankContext);
}

export default function SimpleBankProvider({ children }) {
    const { ethereum } = window;
    const { user } = useMetaMask();

    const [accounts, setAccounts] = useState();

    const reloadAccount = useCallback(async () => {
        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const simpleBankContract = new ethers.Contract(
                contractAddress,
                abi,
                signer
            );
            let accs = await simpleBankContract.getUserAccounts();
            setAccounts(accs);
        }
    }, [ethereum]);

    async function addAccount(name) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const simpleBankContract = new ethers.Contract(
            contractAddress,
            abi,
            signer
        );
        let tx = await simpleBankContract.addAccount(name);
        await tx.wait();
        reloadAccount();
    }

    useEffect(() => {
        if (user) {
            reloadAccount();
        }
    }, [user, reloadAccount]);

    const value = { accounts, addAccount };

    return (
        <SimepleBankContext.Provider value={value}>
            {children}
        </SimepleBankContext.Provider>
    );
}
