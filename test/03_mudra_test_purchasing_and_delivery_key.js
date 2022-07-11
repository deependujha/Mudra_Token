const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("Unit testing for purchasing items and delivery key", function () {
  let Token;
  let hardhatToken;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async function () {
    Token = await ethers.getContractFactory("MudraToken");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    hardhatToken = await Token.deploy();
    await hardhatToken.buyMudra(2000, { value: ethers.utils.parseEther("2") });
    await hardhatToken
      .connect(addr1)
      .buyMudra(1000, { value: ethers.utils.parseEther("1") });
  });
  // unit testing- for purchasing item
  it("purchasing item deducts token from sender, but doesn't send it to the seller", async () => {
    let ownerBalanceBefore = await hardhatToken.myBalance();
    let addr1BalanceBefore = await hardhatToken.connect(addr1).myBalance();
    await hardhatToken.connect(addr1).purchaseItem(1234, owner.address, 400);
    let addr1BalanceAfter = await hardhatToken.connect(addr1).myBalance();
    let ownerBalanceAfter = await hardhatToken.myBalance();
    expect(ownerBalanceAfter).to.equal(ownerBalanceBefore);
    expect(addr1BalanceAfter).to.equal(addr1BalanceBefore - 400);
  });

  it("only buyer can get access to read delivery key", async () => {
    console.log(`*****************************************************`);
    await hardhatToken.connect(addr1).purchaseItem(1234, owner.address, 400);
    await expect(
      hardhatToken.connect(addr2).checkDeliveryKey(1234)
    ).to.be.revertedWith("Sorry, You are not the buyer.");
    await expect(
      hardhatToken.connect(owner).checkDeliveryKey(1234)
    ).to.be.revertedWith("Sorry, You are not the buyer.");
    const deliveryKey = await hardhatToken
      .connect(addr1)
      .checkDeliveryKey(1234);
    console.log(`my delivery key for order id:1234 is ${deliveryKey}`);
    console.log(`*****************************************************`);
  });

  it("not having enough tokens should be reverted", async () => {
    await expect(
      hardhatToken.connect(addr1).purchaseItem(23456, addr2.address, 1500)
    ).to.be.revertedWith("You don't have sufficient tokens.");
  });
});
