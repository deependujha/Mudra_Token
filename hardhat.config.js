require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config()
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",
  networks: {
    ropsten: {
    url:
    `https://ropsten.infura.io/v3/${process.env.INFURA_API_KEY}`,
    accounts: [`${process.env.ROPSTEN_PRIVATE_KEY}`]
    }
    }
    
};
