// SPDX-License-Identifier: MIT

pragma solidity 0.8.15;

contract Account {
    address payable owner;
    string name;

    constructor(address _owner, string memory _name) {
        owner = payable(_owner);
        name = _name;
    }

    receive() payable external {}
    
    function deposit() public payable returns (string memory) {
        require(msg.value > 0, "deposit_fail_value_zero");
        return "deposit_success";
    }

    function withdrawn(uint amount) public returns (string memory) {
        require(owner == msg.sender, "withdrawn_fail_not_owner");
        require(amount > 0, "withdrawn_fail_value_zero");
        require(address(this).balance >= amount, "withdrawn_fail_balance_not_enough");
        payable(msg.sender).transfer(amount);
        return "withdrawn_success";
    }

    function transfer(Account receiver, uint amount) public returns (string memory) {
        require(owner == msg.sender, "transfer_fail_not_owner");
        require(amount > 0, "transfer_fail_value_zero");
        require(address(this).balance >= amount, "transfer_fail_balance_not_enough");
        payable(address(receiver)).transfer(amount);
        return "transfer_success";
    }

    function getOwner() public view returns (address payable) {
        return owner;
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}
