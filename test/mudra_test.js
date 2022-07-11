const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Mudra deployment", function () {
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

  // Unit testing for checking token name, symbol, and initial supply.
  it("Deploying Mudra.sol should name the token 'Mudra', symbol should be 'MDR', and initial total supply should be 0.", async () => {
    const tokenName = await hardhatToken.name();
    const tokenSymbol = await hardhatToken.symbol();
    const tokenTotalSupply = await hardhatToken.totalSupply();
    expect(tokenName).to.equal("Mudra");
    expect(tokenSymbol).to.equal("MDR");
    expect(tokenTotalSupply).to.equal(0);
  });

  // Unit testing for buying token and cashing it in.
  it("Call should be reverted with 'Please send more ethers', if sent amount is less than no. of tokens asked for.", async () => {
    await expect(
      hardhatToken.buyMudra(2500, { value: ethers.utils.parseEther("1.0") })
    ).to.be.revertedWith(
      "Please send more ethers. Rate is- 1000 mudras for 1 ether."
    );
  });

  // Unit testing for checking inital balance of owner, addr1, and addr2.
  it("Initial balance of owner, addr1, addr2 should be 0.", async()=>{
    const ownerBalanace=await hardhatToken.myBalance()
    const addr1Balanace=await hardhatToken.connect(addr1).myBalance()
    const addr2Balanace=await hardhatToken.connect(addr2).myBalance()
    expect(ownerBalanace).to.equal(0);
    expect(addr1Balanace).to.equal(0);
    expect(addr2Balanace).to.equal(0);
  })

  
});
