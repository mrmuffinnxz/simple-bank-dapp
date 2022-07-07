import { expect } from "chai";
import { ethers } from "hardhat";

describe("Simple Bank Deposit Test", function () {
    let SimpleBank, bank, provider, owner, user1, user2;

    beforeEach(async () => {
        [owner, user1, user2] = await ethers.getSigners();
        provider = ethers.provider;
        SimpleBank = await ethers.getContractFactory("SimpleBank");
        bank = await SimpleBank.connect(owner).deploy();
        await bank.deployed();
        console.log("bank deployed at:" + bank.address);
    });
    it("2. As a user, I want to recharge/deposit an ERC 20 or CW 20 token to my account by specifying the account name\n -The contract must receive an arbitrary amount of ERC 20 standard token", async function () {
        await bank.connect(user1).addAccount("A");

        await expect(
            bank.connect(user1).deposit("B", {
                value: ethers.utils.parseEther("1.0"),
            })
        ).to.be.revertedWith("deposit_fail_name_not_exist");

        await expect(
            bank.connect(user1).deposit("A", {
                value: ethers.utils.parseEther("0"),
            })
        ).to.be.revertedWith("deposit_fail_value_zero");

        await expect(await bank.connect(user1).deposit("A", {
            value: ethers.utils.parseEther("1.0"),
        })).to.emit(bank, "DepositEvent").withArgs(user1.address, "A", ethers.utils.parseEther("1.0"));

        await expect(await bank.connect(user2).deposit("A", {
            value: ethers.utils.parseEther("1.0"),
        })).to.emit(bank, "DepositEvent").withArgs(user2.address, "A", ethers.utils.parseEther("1.0"));

        expect(await bank.connect(user1).getBalanceByName("A")).to.equal(ethers.utils.parseEther("2.0"));
    });
});
