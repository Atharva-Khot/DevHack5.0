// TokenTest.js
const TokenContract = artifacts.require("Token");

contract("Token", (accounts) => {
  let tokenInstance;
  const owner = accounts[0];
  const recipient = accounts[1];

  beforeEach(async () => {
    tokenInstance = await TokenContract.new({ from: owner });
  });

  it("should have the correct initial state", async () => {
    const contractOwner = await tokenInstance.owner();
    const ownerBalance = await tokenInstance.balances(owner);

    assert.equal(contractOwner, owner, "Incorrect contract owner");
    assert.equal(ownerBalance.toNumber(), 0, "Owner balance is not zero initially");
  });

  it("should fail to transfer more tokens than the owner's balance", async () => {
        const amount = 100;

        // Transfer tokens from owner to recipient
        const tx = await tokenInstance.transfer(recipient, amount, { from: owner });
    
        // Check balances after the transfer
        const ownerBalance = await tokenInstance.balances(owner);
        const recipientBalance = await tokenInstance.balances(recipient);
    
        assert.equal(ownerBalance.toNumber(), 0, "Owner balance is incorrect");
        assert.equal(recipientBalance.toNumber(), amount, "Recipient balance is incorrect");
    
        // Check the emitted event
        assert.equal(tx.logs.length, 1, "Should emit one event");
        assert.equal(tx.logs[0].event, "TokensTransferred", "Event should be TokensTransferred");
        assert.equal(tx.logs[0].args.from, owner, "Incorrect event 'from' address");
        assert.equal(tx.logs[0].args.to, recipient, "Incorrect event 'to' address");
        assert.equal(tx.logs[0].args.amount.toNumber(), amount, "Incorrect event amount");
      });
      

  it("should not allow non-owner to transfer tokens", async () => {
    const amount = 50;

    // Attempt to transfer tokens from another account
    try {
      await tokenInstance.transfer(recipient, amount, { from: recipient });
      assert.fail("Transfer should have failed");
    } catch (error) {
      assert.include(
        error.message,
        "Only the owner can call this function",
        "Transfer should have failed with ownership error"
      );
    }
  });

  it("should not allow transferring more tokens than the balance", async () => {
    const amount = 101;

    // Attempt to transfer more tokens than the balance
    try {
      await tokenInstance.transfer(recipient, amount, { from: owner });
      assert.fail("Transfer should have failed");
    } catch (error) {
      assert.include(
        error.message,
        "Insufficient balance",
        "Transfer should have failed with insufficient balance error"
      );
    }
  });
});

