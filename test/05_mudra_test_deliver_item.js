const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("Unit testing for delivery of items", function () {
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
    await hardhatToken.connect(addr1).purchaseItem(1234, addr2.address, 400);
  });

  it("should revert on entering wrong delivery key", async () => {
    const deliveryKey = await hardhatToken
      .connect(addr1)
      .checkDeliveryKey(1234);
    const wrongDeliveryKey = deliveryKey + 1;
    await expect(
      hardhatToken.deliverItem(1234, wrongDeliveryKey)
    ).to.be.revertedWith("Sorry, wrong delivery key. Please recheck.");
  });

  it("should transfer balance from address to seller", async () => {
    const deliveryKey = await hardhatToken
      .connect(addr1)
      .checkDeliveryKey(1234);
    const sellerBalanceBefore = await hardhatToken.connect(addr2).myBalance();
    await hardhatToken.deliverItem(1234, deliveryKey);
    const sellerBalanceAfter = await hardhatToken.connect(addr2).myBalance();
    expect(sellerBalanceAfter).to.equal(sellerBalanceBefore + 400);
    await expect(
      hardhatToken.connect(addr1).checkDeliveryKey(1234)
    ).to.be.revertedWith("Sorry, You are not the buyer.");
  });
});
