// SPDX-License-Identifier: MIT

pragma solidity 0.8.15;

import "./Account.sol";

contract Bank {
    mapping(address => Account[]) users;
    mapping(string => Account) accounts;
    mapping(string => bool) isAccountNameExist;

    event AddAccountEvent(address _user, string _name, Account _account);

    function addAccount(string memory _name) public {
        require(isAccountNameExist[_name] == false, "add_account_fail_name_exist");
        Account newAccount = new Account(msg.sender, _name);
        users[msg.sender].push(newAccount);
        accounts[_name] = newAccount;
        isAccountNameExist[_name] = true;
        emit AddAccountEvent(msg.sender, _name, newAccount);
    }

    function getAccountByName(string memory _name) public view returns (Account) {
        return accounts[_name];
    }

    function getAccounts() public view returns (Account[] memory) {
        return users[msg.sender];
    }
}
