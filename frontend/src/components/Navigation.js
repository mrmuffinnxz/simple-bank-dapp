import React, { useState } from "react";
import "../css/Navigation.css";

export default function Navigation() {
    const [account, setAccount] = useState();
    async function connectWallet() {
        const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);
    }

    return (
        <div className="navigation-container">
            <h4>10XBANK</h4>
            {account ? (
                <div className="navigation-account">
                    {account.substring(0, 20) + "..."}
                </div>
            ) : (
                <div
                    className="navigation-account"
                    onClick={(e) => {
                        e.preventDefault();
                        connectWallet();
                    }}
                >
                    Connect Wallet
                </div>
            )}
        </div>
    );
}
