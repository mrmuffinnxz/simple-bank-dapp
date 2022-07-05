// SPDX-License-Identifier: MIT

pragma solidity 0.8.15;

contract Account {
    string name;
    uint256 balance;

    constructor(string memory _name) {
        name = _name;
        balance = 0;
    }
}