import { task } from "hardhat/config";
import * as ERC20Aritfact from "../artifacts/contracts/ERC20.sol/ERC20.json";

task("approve", "Sets the amount of tokens that another user can dispose of")
.addParam("address", "Address of contract")
.addParam("spender", "Address of of spender")
.addParam("amount", "Amount of tokens")
.setAction(async (args,hre) => {
  const [signer] = await hre.ethers.getSigners();
  const ERC20Contract = new hre.ethers.Contract(
    args.address,
    ERC20Aritfact.abi,
    signer
  )
  await ERC20Contract.approve(args.spender, args.amount);
  console.log("Successfully approved");
});