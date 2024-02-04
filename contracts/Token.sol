// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Token {
    address public owner;
    mapping(address => uint256) public balances;

    event TokensTransferred(address indexed from, address indexed to, uint256 amount, uint256 timestamp);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    modifier ensureTimestamp() {
        require(block.timestamp > lastTimestamp, "Transactions must have different timestamps");
        lastTimestamp = block.timestamp;
        _;
    }

    uint256 private lastTimestamp;

    constructor() {
        owner = msg.sender;
    }

    function transfer(address to, uint256 amount) external onlyOwner ensureTimestamp returns (bool) {
        require(balances[msg.sender] >= amount, "Insufficient balance");

        balances[msg.sender] -= amount;
        balances[to] += amount;

        emit TokensTransferred(msg.sender, to, amount, block.timestamp);

        return true;
    }
}
