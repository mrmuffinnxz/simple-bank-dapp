import React from "react";
import { useMetaMask } from "../contexts/MetaMaskContext";
import "../css/Navigation.css";

export default function Navigation() {
    const { user } = useMetaMask();

    return (
        <div className="navigation-container">
            <h2 style={{ marginLeft: "10px", padding: "5px" }}>10XBANK</h2>
            {user ? (
                <div className="navigation-account">
                    {user.substring(0, 20) + "..."}
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
