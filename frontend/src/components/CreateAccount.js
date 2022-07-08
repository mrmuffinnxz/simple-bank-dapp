import React, { useState } from "react";
import { useSimpleBank } from "../contexts/SimpleBankContext";

export default function CreateAccount() {
    const [isOpenCreate, setIsOpenCreate] = useState(false);
    const [name, setName] = useState("");
    const { addAccount } = useSimpleBank();

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    return isOpenCreate ? (
        loading ? (
            <div className="account-add-form">Creating account...</div>
        ) : (
            <div className="account-add-form">
                <div className="account-add-form-input">
                    <div style={{ width: "30%" }}>Account Name:</div>
                    <input
                        style={{ width: "70%" }}
                        value={name}
                        onChange={(e) => {
                            e.preventDefault();
                            setName(e.target.value);
                        }}
                    ></input>
                </div>
                <div className="account-add-form-button">
                    <div
                        className="navigation-account"
                        style={{ marginRight: "10px" }}
                        onClick={(e) => {
                            e.preventDefault();
                            setIsOpenCreate(false);
                            setLoading(false);
                            setError("");
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
                            if (name !== "") {
                                addAccount(name)
                                    .then(() => {
                                        setIsOpenCreate(false);
                                        setLoading(false);
                                        setName("");
                                    })
                                    .catch(() => {
                                        setError(
                                            "Create account failed, this account name might be already in use."
                                        );
                                        setLoading(false);
                                    });
                            }
                        }}
                    >
                        Create
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
        )
    ) : (
        <div
            className="account-add"
            onClick={(e) => {
                e.preventDefault();
                setIsOpenCreate(true);
            }}
        >
            + Create Bank Account
        </div>
    );
}
