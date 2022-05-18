import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

describe("ERC20 Contract", function () {
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;
  let contract: Contract;

  beforeEach(async function() {
  [owner, addr1, addr2] = await ethers.getSigners();

  const ERC20 = await ethers.getContractFactory("MyERC20", owner);
  contract = await ERC20.deploy();

  await contract.deployed();

  const tx = {
    to: contract.address,
    value: 10000
  }

  const txSend = await addr1.sendTransaction(tx);
  await txSend.wait();
  });

  describe("Returning information", function(){
    it("Should return total supply of token", async function() {
      expect(await contract.totalSupply()).to.equal(100000000);
    });

    it("Should return balance of account", async function() {
      expect(await contract.balanceOf(addr1.address)).to.equal(100000000);
      expect(await contract.balanceOf(owner.address)).to.equal(0);
    });

    it("Should return name of token", async function() {
      expect(await contract.name()).to.equal("DVToken");
    });

    it("Should return symbol of token", async function() {
      expect(await contract.symbol()).to.equal("DVT");
    });

    it("Should return number of decimals of token", async function() {
      expect(await contract.decimals()).to.equal(18);
    });

    it("Should return information about approves", async function() {
      await contract.approve(addr1.address, 1000);
      expect(await contract.allowance(owner.address, addr1.address)).to.equal(1000);
    });
  });

  describe("Transfers", function(){
    beforeEach(async function(){ 
      const tx = {
        to: contract.address,
        value: 10000
      }

      const txSend = await owner.sendTransaction(tx);
      await txSend.wait();
    });

    it("Should transfer tokens between accounts", async function() {
      await contract.transfer(addr1.address, 1000);
      expect(await contract.balanceOf(addr1.address)).to.equal(100001000);
    });

    it("Should revert transaction if you have not enough tokens", async function(){
      await expect(contract.transfer(addr1.address, 100000000000)).to.be.revertedWith("Not enough tokens");
    });

    it("Should revert transaction if you try to send tokens on 0x0 address", async function(){
      await expect(contract.transfer("0x0000000000000000000000000000000000000000", 10000)).to.be.revertedWith("Enter correct address");
    });

    it("Should transfer tokens from another account if you have permission", async function() {
      await contract.connect(addr1).approve(owner.address, 1000);
      await contract.transferFrom(addr1.address, addr2.address, 1000);
      expect(await contract.balanceOf(addr2.address)).to.equal(1000);
    });

    it("Should revert transaction if you try to send more tokens than exist on balance", async function(){
      await contract.connect(addr1).approve(owner.address, 100000000000000);
      await expect(contract.transferFrom(addr1.address, addr2.address, 100000000000000)).to.be.revertedWith("Not enough tokens");
    });

    it("Should revert transaction if you try to send more tokens than allowed", async function(){
      await contract.connect(addr1).approve(owner.address, 10);
      await expect(contract.transferFrom(addr1.address, addr2.address, 100)).to.be.revertedWith("You try to transfer more than allowed");
    });

    it("Should convert ETH to DVT, when you send ETH to smart contract", async function() {
      expect(await contract.balanceOf(owner.address)).to.equal(100000000);
    });

    it("Should convert DVT to ETH, when you withdraw DVT from smart contract", async function() {
      const tx = {
        to: contract.address,
        value: await ethers.utils.parseEther("0.1")
      }

      const txSend = await addr1.sendTransaction(tx);
      await txSend.wait();

      let startBalance = await ethers.utils.formatEther(await ethers.provider.getBalance(addr1.address));
      await contract.connect(addr1).withdraw(addr1.address, await ethers.utils.parseEther("1000"));
      let endBalance = await ethers.utils.formatEther(await ethers.provider.getBalance(addr1.address));
      
      let difference = Number(endBalance) - Number(startBalance)
      expect(await contract.balanceOf(addr1.address)).to.equal(100000000);
      expect(difference.toFixed(1)).to.equal('0.1');
    });

    it("Should revert withdrawing if you have not got enough tokens", async function() {
      await expect(contract.withdraw(owner.address, 10000000000000)).to.be.revertedWith("Not enough tokens");
    });

    it("Should revert withdrawing if you are not an owner of account", async function() {
      await expect(contract.withdraw(addr2.address, 1)).to.be.revertedWith("Only owner of account can withdraw ETH");
    });
  });

  

});
