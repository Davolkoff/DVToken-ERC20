import { run, ethers } from "hardhat";
import { threadId } from "worker_threads";

async function main() {
  await run("compile");

  const [signer] = await ethers.getSigners();

  const ERC20 = await ethers.getContractFactory("ERC20", signer);
  const contract = await ERC20.deploy();

  await contract.deployed();

  console.log("Contract address: ", contract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });