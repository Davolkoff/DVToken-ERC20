import { run, ethers } from "hardhat";
import { ERC20__factory } from "../typechain";

async function main() {
  await run("compile");

  const ERC20 = await ethers.getContractFactory("MyERC20");
  const contract = await ERC20.deploy("DVCoin", "DVC", 18);

  await contract.deployed();

  console.log("Contract address: ", contract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });