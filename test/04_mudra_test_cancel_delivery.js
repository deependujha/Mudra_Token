const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("Unit testing for cancelling orders", function () {
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

  it("only user can cancel his/her order", async () => {
    await expect(
      hardhatToken.connect(addr2).cancelOrder(1234)
    ).to.be.revertedWith("Sorry, You are not the buyer.");
    await expect(hardhatToken.cancelOrder(1234)).to.be.revertedWith(
      "Sorry, You are not the buyer."
    );
    const deliveryKey = await hardhatToken
      .connect(addr1)
      .checkDeliveryKey(1234);
    console.log(`Delivery key for order:1234 is ${deliveryKey}`);
    await hardhatToken.connect(addr1).cancelOrder(1234);
    await expect(
      hardhatToken.connect(addr1).checkDeliveryKey(1234)
    ).to.be.revertedWith("Sorry, You are not the buyer.");
  });
});
