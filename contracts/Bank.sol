// SPDX-License-Identifier: MIT

pragma solidity 0.8.15;

import "./Account.sol";

contract Bank {
    mapping(address => Account[]) users;
    mapping(string => bool) isNameExist;

    function addAccount(string memory _name) public returns (string memory) {
        require(isNameExist[_name] == true, "add_account_fail_name_exist");
        isNameExist[_name] = true;
        Account newAccount = new Account(_name);
        users[msg.sender].push(newAccount);
        return "add_account_success";
    }

    function getAccounts() public view returns (Account[] memory) {
        return users[msg.sender];
    }
}
