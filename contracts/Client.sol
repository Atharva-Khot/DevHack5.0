// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Token.sol";

contract Client {
    Token public tokenContract;
    address public clientAddress;

    event TokensDeposited(address indexed user, uint256 amount, uint256 timestamp);
    event TokensTransferred(address indexed from, address indexed to, uint256 amount, uint256 timestamp);

    constructor(address _tokenContract) {
        tokenContract = Token(_tokenContract);
        clientAddress = msg.sender;
    }

    function depositTokens(uint256 amount) external returns (bool) {
        tokenContract.transfer(address(this), amount);

        emit TokensDeposited(clientAddress, amount, block.timestamp);

        return true;
    }

    function transferTokens(address to, uint256 amount) external returns (bool) {
        tokenContract.transfer(to, amount);

        emit TokensTransferred(clientAddress, to, amount, block.timestamp);

        return true;
    }

    function getBalance() external view returns (uint256) {
        return tokenContract.balances(clientAddress);
    }
}


