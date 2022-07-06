// SPDX-License-Identifier: MIT

pragma solidity 0.8.15;

import "./Account.sol";

contract Bank {
    mapping(address => Account[]) userAccounts;
    mapping(string => Account) accounts;
    mapping(string => bool) isAccountNameExist;

    event AddAccountEvent(address _user, string _name, Account _account);
    event DepositEvent(address _from, string _to, uint256 _amount);
    event WithdrawnEvent(string _from, address _to, uint256 _amount);
    event TransferAmountEvent(string _from, string _to, uint256 _amount);

    function addAccount(string memory _name) public {
        require(
            isAccountNameExist[_name] == false,
            "add_account_fail_name_exist"
        );
        Account newAccount = new Account(msg.sender, _name);
        userAccounts[msg.sender].push(newAccount);
        accounts[_name] = newAccount;
        isAccountNameExist[_name] = true;
        emit AddAccountEvent(msg.sender, _name, newAccount);
    }

    function deposit(string memory _name) public payable {
        require(
            isAccountNameExist[_name] == true,
            "deposit_fail_name_not_exist"
        );
        require(msg.value > 0, "deposit_fail_value_zero");
        accounts[_name].deposit{value: msg.value}(msg.sender);
        emit DepositEvent(msg.sender, _name, msg.value);
    }

    function withdrawn(string memory _name, uint256 _amount) public {
        require(
            isAccountNameExist[_name] == true,
            "withdrawn_fail_name_not_exist"
        );
        require(
            msg.sender == accounts[_name].getOwner(),
            "withdrawn_fail_not_owner"
        );
        require(_amount > 0, "withdrawn_fail_value_zero");
        require(
            accounts[_name].getBalance() >= _amount,
            "withdrawn_fail_balance_not_enough"
        );
        accounts[_name].withdrawn(msg.sender, _amount);
        emit WithdrawnEvent(_name, msg.sender, _amount);
    }

    function transferAmount(
        string memory _from,
        string memory _to,
        uint256 _amount
    ) public {
        require(
            isAccountNameExist[_from] == true,
            "transfer_fail_from_not_exist"
        );
        require(isAccountNameExist[_to] == true, "transfer_fail_to_not_exist");
        require(
            msg.sender == accounts[_from].getOwner(),
            "transfer_fail_not_owner"
        );
        require(_amount > 0, "transfer_fail_value_zero");
        require(
            accounts[_from].getBalance() >= _amount,
            "transfer_fail_balance_not_enough"
        );
        accounts[_from].transferAmount(accounts[_to], _amount);
        emit TransferAmountEvent(_from, _to, _amount);
    }

    function getAccountByName(string memory _name)
        public
        view
        returns (Account)
    {
        return accounts[_name];
    }

    function getBalanceByName(string memory _name)
        public
        view
        returns (uint256)
    {
        return accounts[_name].getBalance();
    }

    function getUserAccounts()
        public
        view
        returns (Account[] memory)
    {
        return userAccounts[msg.sender];
    }
}
