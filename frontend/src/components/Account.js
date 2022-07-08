import React from "react";
import { useSimpleBank } from "../contexts/SimpleBankContext";
import AccountDetail from "./AccountDetail";
import CreateAccount from "./CreateAccount";

export default function Account() {
    const { accounts } = useSimpleBank();

    return (
        <div className="account-container">
            <div>My Account</div>
            {accounts ? (
                accounts.map((account, idx) => (
                    <AccountDetail key={idx} account={account} />
                ))
            ) : (
                <div style={{ marginTop: "20px" }}>Loading account...</div>
            )}
            <CreateAccount />
        </div>
    );
}
