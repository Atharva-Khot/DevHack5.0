// migrations/2_deploy_contracts.js
const Token = artifacts.require("Token");
const TokenServer = artifacts.require("Server");
const TokenClient = artifacts.require("Client");

module.exports = function (deployer) {
  deployer.deploy(Token)
    .then(() => deployer.deploy(TokenServer, 1000)) // 1000 initial tokens
    .then(() => deployer.deploy(TokenClient, TokenServer.address))
    .then(() => deployer.deploy(TokenClient, Token.address))
    .then(() => deployer.deploy(TokenClient, Token.address))
    .then(() => deployer.deploy(TokenClient, Token.address));
};
