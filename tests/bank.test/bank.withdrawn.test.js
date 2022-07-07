import { expect } from "chai";
import { ethers } from "hardhat";

describe("Bank Withdrawn Test", function () {
    let Bank, bank, provider, user1, user2, user3;

    beforeEach(async () => {
        Bank = await ethers.getContractFactory("Bank");
        bank = await Bank.deploy();
        await bank.deployed();
        [user1, user2, user3] = await ethers.getSigners();
        provider = ethers.provider;
        console.log("bank deployed at:" + bank.address);
    });
    it("3. As a user, I want to withdraw the ERC 20 token that is in the balance of my account\n -The contract must withdraw an arbitrary amount of the ERC 20 standard token", async function () {
        await bank.connect(user1).addAccount("A");
        const addressA = await bank.connect(user1).getAccountByName("A");
        const accountA = await ethers.getContractAt("Account", addressA);
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

        await expect(
            await bank.connect(user1).withdrawn("A", ethers.utils.parseEther("0.1"))
        ).to.emit(bank, "WithdrawnEvent").withArgs("A", user1.address, ethers.utils.parseEther("0.1"));
    });
    it("3.5. Directly withdrawn from Account Contract", async function () {
        await bank.connect(user1).addAccount("A");
        const addressA = await bank.connect(user1).getAccountByName("A");
        const accountA = await ethers.getContractAt("Account", addressA);
        await bank.connect(user1).deposit("A", {
            value: ethers.utils.parseEther("1.0"),
        })

        await expect(
            accountA.connect(user2).withdrawn(user1.address, ethers.utils.parseEther("0.1"))
        ).to.be.revertedWith("withdrawn_fail_not_bank_or_owner");

        await expect(
            accountA.connect(user1).withdrawn(user1.address, ethers.utils.parseEther("0"))
        ).to.be.revertedWith("withdrawn_fail_value_zero");

        await expect(
            accountA.connect(user1).withdrawn(user1.address, ethers.utils.parseEther("10.0"))
        ).to.be.revertedWith("withdrawn_fail_balance_not_enough");

        await expect(
            await accountA.connect(user1).withdrawn(user1.address, ethers.utils.parseEther("0.1"))
        ).to.emit(accountA, "WithdrawnEvent").withArgs(user1.address, ethers.utils.parseEther("0.1"));

        await expect(
            await accountA.connect(user1).withdrawn(user2.address, ethers.utils.parseEther("0.1"))
        ).to.emit(accountA, "WithdrawnEvent").withArgs(user2.address, ethers.utils.parseEther("0.1"));

        expect(await bank.connect(user1).getBalanceByName("A")).to.equal(ethers.utils.parseEther("0.8"));
    });
});
