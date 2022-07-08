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
            let names = await simpleBankContract.getUserAccounts();

            const getBalanceByName = async (name) => {
                let balance = ethers.utils.formatEther(
                    await simpleBankContract.getBalanceByName(name)
                );
                return {
                    name,
                    balance,
                };
            };
            const promises = [];
            names.forEach((name) => {
                promises.push(getBalanceByName(name));
            });
            Promise.all(promises).then((results) => {
                setAccounts(results);
            });
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

    async function deposit(name, amount) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const simpleBankContract = new ethers.Contract(
            contractAddress,
            abi,
            signer
        );
        let tx = await simpleBankContract.deposit(name, {
            value: ethers.utils.parseEther(amount),
        });
        await tx.wait();
        reloadAccount();
    }

    async function withdrawn(name, amount) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const simpleBankContract = new ethers.Contract(
            contractAddress,
            abi,
            signer
        );
        let tx = await simpleBankContract.withdrawn(
            name,
            ethers.utils.parseEther(amount)
        );
        await tx.wait();
        reloadAccount();
    }

    async function transfer(from, to, amount) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const simpleBankContract = new ethers.Contract(
            contractAddress,
            abi,
            signer
        );
        let tx = await simpleBankContract.transferAmount(
            from,
            to,
            ethers.utils.parseEther(amount)
        );
        await tx.wait();
        reloadAccount();
    }

    useEffect(() => {
        if (user) {
            reloadAccount();
        }
    }, [user, reloadAccount]);

    const value = { accounts, addAccount, deposit, withdrawn, transfer };

    return (
        <SimepleBankContext.Provider value={value}>
            {children}
        </SimepleBankContext.Provider>
    );
}
