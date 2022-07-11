const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("Buying Mudra, and cashing it in", function () {
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
  });
  // Unit testing- should be able to buy and it should change buyer balance and total tokens supply
  it("should be able to buy Mudra, and it should change totalTokens and buyer balance", async () => {
    await hardhatToken
      .connect(addr1)
      .buyMudra(2000, { value: ethers.utils.parseEther("2") });
    await hardhatToken
      .connect(addr2)
      .buyMudra(1500, { value: ethers.utils.parseEther("1.5") });
    const totalSupply = await hardhatToken.totalSupply();
    const myBal = await hardhatToken.connect(addr1).myBalance();
    expect(totalSupply).to.equal(3500);
    expect(myBal).to.equal(2000);
    const addr2Bal = await hardhatToken.connect(addr2).myBalance();
    expect(addr2Bal).to.equal(1500);
  });

  // Unit testing- should be reverted if want to cashin more than one has
  it("should be reverted if want to cashin more than one has", async () => {
    await hardhatToken
      .connect(addr1)
      .buyMudra(2000, { value: ethers.utils.parseEther("2") });
    const myBal = await hardhatToken.connect(addr1).myBalance();
    expect(myBal).to.equal(2000);
    await expect(
      hardhatToken.connect(addr1).cashInMudra(3000)
    ).to.be.revertedWith("You don't have sufficient tokens.");
  });
});
