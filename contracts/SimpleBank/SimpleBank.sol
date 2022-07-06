// SPDX-License-Identifier: MIT

pragma solidity 0.8.15;

contract SimpleBank {
    address owner;

    struct Account {
        address owner;
        string name;
        uint256 balance;
    }

    mapping(address => string[]) userAccounts;
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
        accounts[_name] = Account(msg.sender, _name, 0);
        userAccounts[msg.sender].push(_name);
        isAccountNameExist[_name] = true;
        emit AddAccountEvent(msg.sender, _name, accounts[_name]);
    }

    function deposit(string memory _name) public payable {
        require(
            isAccountNameExist[_name] == true,
            "deposit_fail_name_not_exist"
        );
        require(msg.value > 0, "deposit_fail_value_zero");
        accounts[_name].balance += msg.value;
        emit DepositEvent(msg.sender, _name, msg.value);
    }

    function withdrawn(string memory _name, uint256 _amount) public {
        require(
            isAccountNameExist[_name] == true,
            "withdrawn_fail_name_not_exist"
        );
        require(
            accounts[_name].owner == msg.sender,
            "withdrawn_fail_not_owner"
        );
        require(_amount > 0, "withdrawn_fail_value_zero");
        require(
            accounts[_name].balance >= _amount,
            "withdrawn_fail_balance_not_enough"
        );
        accounts[_name].balance -= _amount;
        emit WithdrawnEvent(_name, msg.sender, _amount);
    }

    function transferAmount(
        string memory _from,
        string memory _to,
        uint256 _amount
    ) public {
        require(
            isAccountNameExist[_from] == true,
            "transfer_fail_from_name_not_exist"
        );
        require(
            isAccountNameExist[_to] == true,
            "transfer_fail_to_name_not_exist"
        );
        require(
            accounts[_from].owner == msg.sender,
            "transfer_fail_from_not_owner"
        );
        require(
            accounts[_to].owner == msg.sender,
            "transfer_fail_to_not_owner"
        );
        require(_amount > 0, "transfer_fail_value_zero");
        require(
            accounts[_from].balance >= _amount,
            "transfer_fail_from_balance_not_enough"
        );
        accounts[_from].balance -= _amount;
        accounts[_to].balance += _amount;
        emit TransferAmountEvent(_from, _to, _amount);
    }

    function getAccountByName(string memory _name)
        public
        view
        returns (Account memory)
    {
        return accounts[_name];
    }

    function getBalanceByName(string memory _name)
        public
        view
        returns (uint256)
    {
        return accounts[_name].balance;
    }

    function getUserAccounts(address _user)
        public
        view
        returns (string[] memory)
    {
        return userAccounts[_user];
    }
}