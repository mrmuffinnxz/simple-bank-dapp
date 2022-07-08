import React, { useState } from "react";
import { useSimpleBank } from "../contexts/SimpleBankContext";

export default function DepositMode({ account, setMode }) {
    const [amount, setAmount] = useState("");
    const { deposit } = useSimpleBank();

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    return loading ? (
        <div className="account-add-form">Depositing...</div>
    ) : (
        <div className="account-add-form">
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
                            deposit(account.name, amount)
                                .then(() => {
                                    setMode("");
                                    setLoading(false);
                                    setAmount("");
                                })
                                .catch((e) => {
                                    console.log(e);
                                    setError(
                                        "Deposit failed, wrong account name, or amount equal zero, or insufficient balance in wallet"
                                    );
                                    setLoading(false);
                                });
                        } else {
                            setError("Deposit failed, Only accept real number");
                            setLoading(false);
                        }
                    }}
                >
                    Deposit
                </div>
            </div>
            <div
                style={{
                    color: "red",
                    marginTop: error === "" ? "0px" : "10px",
                }}
            >
                {error}
            </div>
        </div>
    );
}
