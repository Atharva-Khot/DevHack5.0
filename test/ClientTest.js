
const ClientContract = artifacts.require("Client");
const TokenContract = artifacts.require("Token");


contract("Client", (accounts) => {
  let clientInstance;
  let tokenInstance;
  const clientAddress = accounts[3];
  const recipient = accounts[1];

  beforeEach(async () => {
    tokenInstance = await TokenContract.new({ from: clientAddress });
    clientInstance = await ClientContract.new(tokenInstance.address, { from: clientAddress });
  });

  it("should have the correct initial state", async () => {
    const tokenContract = await clientInstance.tokenContract();
    const clientAddressInContract = await clientInstance.clientAddress();

    assert.equal(tokenContract, tokenInstance.address, "Incorrect token contract address");
    assert.equal(clientAddressInContract, clientAddress, "Incorrect client address in contract");
  });

  it("should deposit tokens successfully", async () => {
    const amount = 200;

    // Attempt to deposit tokens by another account
    try{
        await clientInstance.depositTokens(amount, { from: recipient });
        assert.fail("Deposit should have failed");
    } catch (error) {
      assert.include(
        error.message,
        "Only the owner can call this function",
        "Deposit should have failed with ownership error"
      );
    }
  });

  it("should fail to transfer tokens if not called by the owner", async () => {
        const amount = 50;
    
        // Deposit tokens to the client contract
        await clientInstance.depositTokens(amount, { from: clientAddress });
    
        // Transfer tokens from the client to recipient
        const tx = await clientInstance.transferTokens(recipient, amount, { from: clientAddress });
    
        // Check balances after the transfer
        const clientBalance = await clientInstance.getBalance();
        const recipientBalance = await tokenInstance.balances(recipient);
    
        // Use Chai's expect for more readable assertions
        expect(clientBalance.toNumber()).to.equal(0, "Client balance is incorrect");
        expect(recipientBalance.toNumber()).to.equal(amount, "Recipient balance is incorrect");
    
        // Check the emitted event
        expect(tx.logs.length).to.equal(1, "Should emit one event");
        expect(tx.logs[0].event).to.equal("TokensTransferred", "Event should be TokensTransferred");
        expect(tx.logs[0].args.from).to.equal(clientAddress, "Incorrect event 'from' address");
        expect(tx.logs[0].args.to).to.equal(recipient, "Incorrect event 'to' address");
        expect(tx.logs[0].args.amount.toNumber()).to.equal(amount, "Incorrect event amount");
      });
});