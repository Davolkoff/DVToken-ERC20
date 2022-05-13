import { task } from "hardhat/config";
import * as ERC20Aritfact from "../artifacts/contracts/ERC20.sol/ERC20.json";

task("withdraw", "Prints total supply of token")
.addParam("address", "Address of contract")
.addParam("user", "Address of user")
.addParam("amount", "Amount of tokens")
.setAction(async (args,hre) => {
  const [signer] = await hre.ethers.getSigners();
  const ERC20Contract = new hre.ethers.Contract(
    args.address,
    ERC20Aritfact.abi,
    signer
  )

  await ERC20Contract.withdraw(args.user, args.amount);
  console.log("Tokens successfully withdrawn");
});