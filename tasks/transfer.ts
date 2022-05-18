import { task } from "hardhat/config";
import * as ERC20Aritfact from "../artifacts/contracts/ERC20.sol/MyERC20.json";

task("transfer", "Transfers tokens to another user")
.addParam("address", "Address of contract")
.addParam("to", "Address for transfer tokens")
.addParam("amount", "Amount of tokens")
.setAction(async (args,hre) => {
  const [signer] = await hre.ethers.getSigners();
  const ERC20Contract = new hre.ethers.Contract(
    args.address,
    ERC20Aritfact.abi,
    signer
  )

  await ERC20Contract.transfer(args.to, args.amount);
  console.log("Tokens successfully transfered");
});