import React, { useState, useEffect, createContext, useContext } from "react";
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

    const [simpleBankContract, setSimpleBankContract] = useState();
    const [accounts, setAccounts] = useState();

    useEffect(() => {
        if (ethereum) {
            const provider = new ethers.providers.getDefaultProvider("goerli", {
                etherscan: process.env.REACT_APP_ETHERSCAN_API_KEY,
            });
            const bankContract = new ethers.Contract(
                contractAddress,
                abi,
                provider
            );
            setSimpleBankContract(bankContract);
        }
    }, [ethereum]);

    async function reloadAccount() {
        if (user && simpleBankContract) {
            let accs = await simpleBankContract.getUserAccounts();
            setAccounts(accs);
            console.log(accs);
        }
    }

    useEffect(() => {
        reloadAccount();
    }, [user, simpleBankContract]);

    const value = { simpleBankContract };

    return (
        <SimepleBankContext.Provider value={value}>
            {children}
        </SimepleBankContext.Provider>
    );
}
