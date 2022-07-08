import React from "react";
import { useSimpleBank } from "../contexts/SimpleBankContext";
import CreateAccount from "./CreateAccount";

export default function Account() {
    const { accounts } = useSimpleBank();

    return (
        <div className="account-container">
            <div>My Account</div>
            {accounts &&
                accounts.map((account, idx) => (
                    <div key={idx} className="account-sub-container">
                        Account {idx}
                    </div>
                ))}
            <CreateAccount />
        </div>
    );
}
