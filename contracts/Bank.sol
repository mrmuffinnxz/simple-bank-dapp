// SPDX-License-Identifier: MIT

pragma solidity 0.8.15;

import "./Account.sol";

contract Bank {
    mapping(address => Account[]) users;
    mapping(string => Account) accounts;
    mapping(string => bool) isNameExist;

    function addAccount(string memory _name) public returns (string memory) {
        require(isNameExist[_name] == false, "add_account_fail_name_exist");
        isNameExist[_name] = true;
        Account newAccount = new Account(msg.sender, _name);
        users[msg.sender].push(newAccount);
        accounts[_name] = newAccount;
        return "add_account_success";
    }

    function getAccounts() public view returns (Account[] memory) {
        return users[msg.sender];
    }
}
