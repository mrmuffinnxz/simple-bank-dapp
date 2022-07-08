import React, { useState } from "react";
import DepositMode from "./DepositMode";

export default function AccountDetail({ account }) {
    const [mode, setMode] = useState("");

    var content = "";
    if (mode === "deposit") {
        content = <DepositMode account={account} setMode={setMode} />;
    } else {
        content = (
            <div className="account-detail">
                <table className="account-detail-table">
                    <tbody>
                        <tr>
                            <td>Account Name:</td>
                            <td style={{ textAlign: "right" }}>
                                {account.name}
                            </td>
                        </tr>
                        <tr>
                            <td>Balance:</td>
                            <td style={{ textAlign: "right" }}>
                                {account.balance} GoerliETH
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div className="account-detail-control">
                    <div
                        className="navigation-account"
                        style={{ width: "25%" }}
                        onClick={(e) => {
                            e.preventDefault();
                            setMode("deposit");
                        }}
                    >
                        Deposit
                    </div>
                    <div
                        className="navigation-account"
                        style={{ width: "25%" }}
                        onClick={(e) => {
                            e.preventDefault();
                            setMode("withdrawn");
                        }}
                    >
                        Withdrawn
                    </div>
                    <div
                        className="navigation-account"
                        style={{ width: "25%" }}
                        onClick={(e) => {
                            e.preventDefault();
                            setMode("transfer");
                        }}
                    >
                        Transfer
                    </div>
                </div>
            </div>
        );
    }

    return content;
}
