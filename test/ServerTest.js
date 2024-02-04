const ServerContract = artifacts.require("Server");
const TokenContract = artifacts.require("Token");

contract("Server", (accounts) => {
  let serverInstance;
  let tokenInstance;
  const owner = accounts[0];
  const recipient = accounts[1];
  const anotherAccount = accounts[2];

  beforeEach(async () => {
    tokenInstance = await TokenContract.new({ from: owner });
    serverInstance = await ServerContract.new(1000, { from: owner });
    await serverInstance.setTokenContract(tokenInstance.address, { from: owner });
  });

  it("should have the correct initial state", async () => {
    const contractOwner = await serverInstance.owner();
    const totalTokens = await serverInstance.totalTokens();

    assert.equal(contractOwner, owner, "Incorrect contract owner");
    assert.equal(totalTokens.toNumber(), 1000, "Incorrect total tokens");
  });

  it("should fail to allocate tokens if not called by the owner", async () => {
    const amount = 100;

    // Allocate tokens to recipient
    const tx = await serverInstance.allocateTokens(recipient, amount, { from: owner });

    // Check total tokens after allocation
    const totalTokens = await serverInstance.totalTokens();
    assert.equal(totalTokens.toNumber(), 900, "Incorrect total tokens after allocation");

    // Check transaction history
    const transactionHistory = await serverInstance.getTransactionHistory(recipient);
    assert.equal(transactionHistory.length, 1, "Transaction history should have one entry");
    assert.equal(transactionHistory[0], amount, "Incorrect transaction history amount");

    // Check the emitted event
    assert.equal(tx.logs.length, 1, "Should emit one event");
    assert.equal(tx.logs[0].event, "TokensAllocated", "Event should be TokensAllocated");
    assert.equal(tx.logs[0].args.user, recipient, "Incorrect event 'user' address");
    assert.equal(tx.logs[0].args.amount.toNumber(), amount, "Incorrect event amount");
  });

  it("should not allow non-owner to allocate tokens", async () => {
    const amount = 50;

    // Attempt to allocate tokens by another account
    try {
      await serverInstance.allocateTokens(anotherAccount, amount, { from: anotherAccount });
      assert.fail("Allocation should have failed");
    } catch (error) {
      assert.include(
        error.message,
        "Only the owner can call this function",
        "Allocation should have failed with ownership error"
      );
    }
  });

  it("should not allow allocating more tokens than available", async () => {
    const amount = 1001;

    // Attempt to allocate more tokens than available
    try {
      await serverInstance.allocateTokens(recipient, amount, { from: owner });
      assert.fail("Allocation should have failed");
    } catch (error) {
      assert.include(
        error.message,
        "Insufficient tokens in the server",
        "Allocation should have failed with insufficient tokens error"
      );
    }
  });
});