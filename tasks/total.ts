import { task } from "hardhat/config";
import * as ERC20Aritfact from "../artifacts/contracts/ERC20.sol/ERC20.json";

task("total", "Prints total supply of token")
.addParam("address", "Address of contract")
.setAction(async (args,hre) => {
  const [signer] = await hre.ethers.getSigners();
  const ERC20Contract = new hre.ethers.Contract(
    args.address,
    ERC20Aritfact.abi,
    signer
  )
  
  console.log(`Total supply of token: ${await ERC20Contract.totalSupply()}`);
});