// SPDX-License-Identifier: MIT

pragma solidity 0.8.15;

contract Account {
    address private bank;
    address private owner;
    string private name;

    constructor(address _owner, string memory _name) {
        bank = msg.sender;
        owner = payable(_owner);
        name = _name;
    }

    event DepositEvent(address _from, uint256 _amount);
    event WithdrawnEvent(address _to, uint256 _amount);
    event TransferAmountEvent(Account _to, uint256 _amount);

    receive() external payable {
        require(msg.value > 0, "receive_fail_value_zero");
        emit DepositEvent(msg.sender, msg.value);
    }

    function deposit(address _from) public payable {
        require(msg.value > 0, "deposit_fail_value_zero");
        emit DepositEvent(_from, msg.value);
    }

    function withdrawn(address _receiver, uint256 _amount) public {
        require(
            msg.sender == bank || msg.sender == owner,
            "withdrawn_fail_not_bank_or_owner"
        );
        require(_amount > 0, "withdrawn_fail_value_zero");
        require(
            this.getBalance() >= _amount,
            "withdrawn_fail_balance_not_enough"
        );
        payable(_receiver).transfer(_amount);
        emit WithdrawnEvent(_receiver, _amount);
    }

    function transferAmount(Account _receiver, uint256 _amount) public {
        require(
            msg.sender == bank || msg.sender == owner,
            "transfer_fail_not_bank_or_owner"
        );
        require(_amount > 0, "transfer_fail_value_zero");
        require(
            this.getBalance() >= _amount,
            "transfer_fail_balance_not_enough"
        );
        payable(address(_receiver)).transfer(_amount);
        emit TransferAmountEvent(_receiver, _amount);
    }

    function getBank() public view returns (address) {
        return bank;
    }

    function getOwner() public view returns (address) {
        return owner;
    }

    function getName() public view returns (string memory) {
        return name;
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
