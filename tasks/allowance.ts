import { task } from "hardhat/config";
import * as ERC20Aritfact from "../artifacts/contracts/ERC20.sol/MyERC20.json";

task("allowance", "Returns the rest of the tokens that can be spent by user from a certain account")
.addParam("address", "Address of contract")
.addParam("owner", "Address of owner of tokens")
.addParam("spender", "Address of spender")
.setAction(async (args,hre) => {
  const [signer] = await hre.ethers.getSigners();
  const ERC20Contract = new hre.ethers.Contract(
    args.address,
    ERC20Aritfact.abi,
    signer
  )

  console.log(`Remains: ${await ERC20Contract.allowance(args.owner, args.spender)}`);
});