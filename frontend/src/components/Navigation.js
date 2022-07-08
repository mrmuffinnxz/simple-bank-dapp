import React from "react";
import { useMetaMask } from "../contexts/MetaMaskContext";

export default function Navigation() {
    const { user, connectWallet } = useMetaMask();

    return (
        <div className="navigation-container">
            <h2>10XBANK</h2>
            {user ? (
                user.chain === "0x5" ? (
                    <div className="navigation-account">
                        {user.address.substring(0, 5) + "..." + user.address.substr(user.address.length - 5)}
                    </div>
                ) : (
                    <div className="navigation-account" style={{fontSize: "1vw"}}>
                        Wrong chain! Please change to Goerli Test Network
                    </div>
                )
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
