import React, { useState } from "react";
import { useSimpleBank } from "../contexts/SimpleBankContext";

export default function CreateAccount() {
    const [isOpenCreate, setIsOpenCreate] = useState(false);
    const [name, setName] = useState("");
    const { addAccount } = useSimpleBank();

    return isOpenCreate ? (
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
                    }}
                >
                    Cancel
                </div>
                <div
                    className="navigation-account"
                    onClick={(e) => {
                        e.preventDefault();
                        if (name !== "") {
                            addAccount(name);
                        }
                    }}
                >
                    Create
                </div>
            </div>
        </div>
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
