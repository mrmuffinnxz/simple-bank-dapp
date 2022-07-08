import React, { useState } from "react";
import { useSimpleBank } from "../contexts/SimpleBankContext";

export default function WithdrawnMode({ account, setMode }) {
    const [amount, setAmount] = useState("");
    const { withdrawn } = useSimpleBank();

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    return loading ? (
        <div className="account-add-form">Withdrawning...</div>
    ) : (
        <div className="account-add-form">
            <div style={{ marginBottom: "10px" }}>Withdrawn</div>
            <div
                style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "10px",
                }}
            >
                <div>Account name:</div> <div>{account.name}</div>
            </div>
            <div
                style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "10px",
                }}
            >
                <div>Balance:</div> <div>{account.balance} GoerliETH</div>
            </div>
            <div className="account-add-form-input">
                <div style={{ width: "40%" }}>GoerliETH amount:</div>
                <input
                    style={{ width: "60%" }}
                    value={amount}
                    onChange={(e) => {
                        e.preventDefault();
                        setAmount(e.target.value);
                    }}
                ></input>
            </div>
            <div className="account-add-form-button">
                <div
                    className="navigation-account"
                    style={{ marginRight: "10px" }}
                    onClick={(e) => {
                        e.preventDefault();
                        setMode("");
                        setLoading(false);
                        setError("");
                        setAmount("");
                    }}
                >
                    Cancel
                </div>
                <div
                    className="navigation-account"
                    onClick={(e) => {
                        e.preventDefault();
                        setLoading(true);
                        setError("");
                        if (!isNaN(amount)) {
                            withdrawn(account.name, amount)
                                .then(() => {
                                    setMode("");
                                    setLoading(false);
                                    setAmount("");
                                })
                                .catch(() => {
                                    setError(
                                        "Withdrawn failed, wrong account name, or not account owner, or amount equal zero, or insufficient balance in account"
                                    );
                                    setLoading(false);
                                });
                        } else {
                            setError(
                                "Withdrawn failed, Only accept real number"
                            );
                            setLoading(false);
                        }
                    }}
                >
                    Withdrawn
                </div>
            </div>
            <div
                style={{
                    color: "red",
                    marginTop: error === "" ? "0px" : "10px",
                    fontSize: "12px",
                }}
            >
                {error}
            </div>
        </div>
    );
}
