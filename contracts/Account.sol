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
    
    event DepositEvent(address _from, uint _amount);
    event WithdrawnEvent(address _to, uint _amount);
    event TransferAmountEvent(Account _to, uint _amount);

    function deposit() public payable {
        require(msg.value > 0, "deposit_fail_value_zero");
        emit DepositEvent(msg.sender, msg.value);
    }

    function withdrawn(uint _amount) public {
        require(owner == msg.sender, "withdrawn_fail_not_owner");
        require(_amount > 0, "withdrawn_fail_value_zero");
        require(address(this).balance >= _amount, "withdrawn_fail_balance_not_enough");
        payable(msg.sender).transfer(_amount);
        emit WithdrawnEvent(msg.sender, _amount);
    }

    function transferAmount(Account _receiver, uint _amount) public {
        require(owner == msg.sender, "transfer_fail_not_owner");
        require(_amount > 0, "transfer_fail_value_zero");
        require(address(this).balance >= _amount, "transfer_fail_balance_not_enough");
        payable(address(_receiver)).transfer(_amount);
        emit TransferAmountEvent(_receiver, _amount);
    }

    function getOwner() public view returns (address payable) {
        return owner;
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}
