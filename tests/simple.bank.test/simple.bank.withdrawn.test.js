import { expect } from "chai";
import { ethers } from "hardhat";

describe("Simple Bank Withdrawn Test", function () {
    let SimpleBank, bank, provider, owner, user1, user2;

    beforeEach(async () => {
        [owner, user1, user2] = await ethers.getSigners();
        provider = ethers.provider;
        SimpleBank = await ethers.getContractFactory("SimpleBank");
        bank = await SimpleBank.connect(owner).deploy();
        await bank.deployed();
        console.log("bank deployed at:" + bank.address);
    });
    it("3. As a user, I want to withdraw the ERC 20 token that is in the balance of my account\n -The contract must withdraw an arbitrary amount of the ERC 20 standard token", async function () {
        await bank.connect(user1).addAccount("A");
        await bank.connect(user1).deposit("A", {
            value: ethers.utils.parseEther("1.0"),
        })

        await expect(
            bank.connect(user1).withdrawn("B", ethers.utils.parseEther("0.1"))
        ).to.be.revertedWith("withdrawn_fail_name_not_exist");

        await expect(
            bank.connect(user2).withdrawn("A", ethers.utils.parseEther("0.1"))
        ).to.be.revertedWith("withdrawn_fail_not_owner");

        await expect(
            bank.connect(user1).withdrawn("A", ethers.utils.parseEther("0"))
        ).to.be.revertedWith("withdrawn_fail_value_zero");

        await expect(
            bank.connect(user1).withdrawn("A", ethers.utils.parseEther("10.0"))
        ).to.be.revertedWith("withdrawn_fail_balance_not_enough");

        expect(await bank.connect(user1).getBalanceByName("A")).to.equal(ethers.utils.parseEther("1.0"));

        await expect(
            await bank.connect(user1).withdrawn("A", ethers.utils.parseEther("0.1"))
        ).to.emit(bank, "WithdrawnEvent").withArgs("A", user1.address, ethers.utils.parseEther("0.1"));

        expect(await bank.connect(user1).getBalanceByName("A")).to.equal(ethers.utils.parseEther("0.9"));
    });
});
