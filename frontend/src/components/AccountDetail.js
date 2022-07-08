import React from "react";

export default function AccountDetail({ account }) {
    return (
        <div className="account-detail">
            <table className="account-detail-table">
                <tr>
                    <td>Account Name:</td>
                    <td style={{ textAlign: "right" }}>{account.name}</td>
                </tr>
                <tr>
                    <td>Balance:</td>
                    <td style={{ textAlign: "right" }}>
                        {account.balance} GoerliETH
                    </td>
                </tr>
            </table>
            <div className="account-detail-control">
                <div className="navigation-account" style={{ width: "25%" }}>
                    Deposit
                </div>
                <div className="navigation-account" style={{ width: "25%" }}>
                    Withdrawn
                </div>
                <div className="navigation-account" style={{ width: "25%" }}>
                    Transfer
                </div>
            </div>
        </div>
    );
}
