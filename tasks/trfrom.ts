import { task } from "hardhat/config";
import * as ERC20Aritfact from "../artifacts/contracts/ERC20.sol/MyERC20.json";

task("trfrom", "Transfers tokens to another user with private key")
.addParam("address", "Address of contract")
.addParam("from", "Address of account with tokens")
.addParam("to", "Address for transfer tokens")
.addParam("amount", "Amount of tokens")
.setAction(async (args,hre) => {
  const [signer] = await hre.ethers.getSigners();
  const ERC20Contract = new hre.ethers.Contract(
    args.address,
    ERC20Aritfact.abi,
    signer
  )
  await ERC20Contract.transferFrom(args.from, args.to, args.amount);
  console.log("Tokens successfully transfered");
});