// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Token.sol";

contract Server {
    address public owner;
    Token public tokenContract;
    uint256 public totalTokens;
    mapping(address => uint256[]) public transactionHistory;

    event TokensAllocated(address indexed user, uint256 amount, uint256 timestamp);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    constructor(uint256 initialTokens) {
        owner = msg.sender;
        totalTokens = initialTokens;
        tokenContract = new Token();
    }

    function allocateTokens(address user, uint256 amount) external onlyOwner returns (bool) {
        require(totalTokens >= amount, "Insufficient tokens in the server");

        totalTokens -= amount;

        bool success = tokenContract.transfer(user, amount);
        if (success) {
            transactionHistory[user].push(amount);
            emit TokensAllocated(user, amount, block.timestamp);
            return true;
        }

        return false;
    }

    function getTransactionHistory(address user) external view returns (uint256[] memory) {
        return transactionHistory[user];
    }

    function setTokenContract(address _tokenContract) external onlyOwner {
        tokenContract = Token(_tokenContract);
    }
}
