import React from "react";
import Account from "./components/Account";
import Navigation from "./components/Navigation";
import AppProvider from "./contexts/AppProvider";
import "./css/App.css";

export default function App() {
    return (
        <AppProvider>
            <div className="App">
                <div className="app_container absolute_center">
                    {typeof window.ethereum === "undefined" ? (
                        <h1 className="install-wallet-text">
                            Please install MetaMask Wallet
                        </h1>
                    ) : (
                        <div>
                            <Navigation />
                            <Account />
                        </div>
                    )}
                </div>
            </div>
        </AppProvider>
    );
}
