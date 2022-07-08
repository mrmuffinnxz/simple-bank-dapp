import React, { useState } from "react";
import { useSimpleBank } from "../contexts/SimpleBankContext";

export default function TransferMode({ account, setMode }) {
    const [name, setName] = useState("");
    const [amount, setAmount] = useState("");
    const { transfer } = useSimpleBank();

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    return loading ? (
        <div className="account-add-form">Transfering...</div>
    ) : (
        <div className="account-add-form">
            <div style={{ marginBottom: "10px" }}>Transfer</div>
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
                className="account-add-form-input"
                style={{ marginBottom: "10px" }}
            >
                <div style={{ width: "40%" }}>To account name:</div>
                <input
                    style={{ width: "60%" }}
                    value={name}
                    onChange={(e) => {
                        e.preventDefault();
                        setName(e.target.value);
                    }}
                ></input>
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
                        setName("");
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
                        if (!isNaN(amount) && name !== "") {
                            transfer(account.name, name, amount)
                                .then(() => {
                                    setMode("");
                                    setLoading(false);
                                    setAmount("");
                                    setName("");
                                })
                                .catch((e) => {
                                    console.log(e);
                                    setError(
                                        "Transfer failed, wrong account name, or not account owner, or amount equal zero, or insufficient balance in account"
                                    );
                                    setLoading(false);
                                });
                        } else {
                            setError(
                                "Transfer failed, Only accept real number and name must not be empty"
                            );
                            setLoading(false);
                        }
                    }}
                >
                    Transfer
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
