import React, { useEffect, useState } from "react";
import contract from "../contracts/SimpleBank.json";
import { ethers } from "ethers";

const contractAddress = "0xDb634E178cABB16dE30E50062744E597e4738FF5";
const abi = contract.abi;

const SimepleBankContext = createContext();

export function useSimpleBank() {
    return useContext(SimepleBankContext);
}

export default function SimpleBankProvider({ children }) {
    const [simpleBankContract, setSimpleBankContract] = useState();
    const { ethereum } = window;

    useEffect(() => {
        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const bankContract = new ethers.Contract(
                contractAddress,
                abi,
                signer
            );
            setSimpleBankContract(bankContract);
        }
    }, [ethereum]);

    const value = { simpleBankContract };

    return (
        <SimepleBankContext.Provider value={value}>
            {children}
        </SimepleBankContext.Provider>
    );
}
