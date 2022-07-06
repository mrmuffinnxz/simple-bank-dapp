import { expect } from "chai";
import { ethers } from "hardhat";

describe("Bank Deposit Test", function () {
    let Bank, bank, provider, user1, user2, user3;

    beforeEach(async () => {
        Bank = await ethers.getContractFactory("Bank");
        bank = await Bank.deploy();
        await bank.deployed();
        [user1, user2, user3] = await ethers.getSigners();
        provider = ethers.provider;
        console.log("bank deployed at:" + bank.address);
    });
    it("2. As a user, I want to recharge/deposit an ERC 20 or CW 20 token to my account by specifying the account name\n -The contract must receive an arbitrary amount of ERC 20 standard token", async function () {
        await bank.connect(user1).addAccount("A");
        const addressA = await bank.connect(user1).getAccountByName("A");
        const accountA = await ethers.getContractAt("Account", addressA);

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

        await expect(
            await bank.connect(user1).deposit("A", {
                value: ethers.utils.parseEther("1.0"),
            })
        ).to.changeEtherBalances([user1, accountA], [-ethers.utils.parseEther("1.0"), ethers.utils.parseEther("1.0")])
            .to.emit(bank, "DepositEvent").withArgs(user1.address, "A", ethers.utils.parseEther("1.0"))
            .to.emit(accountA, "DepositEvent").withArgs(user1.address, ethers.utils.parseEther("1.0"));

        await expect(
            await bank.connect(user2).deposit("A", {
                value: ethers.utils.parseEther("1.0"),
            })
        ).to.changeEtherBalances([user2, accountA], [-ethers.utils.parseEther("1.0"), ethers.utils.parseEther("1.0")])
            .to.emit(bank, "DepositEvent").withArgs(user2.address, "A", ethers.utils.parseEther("1.0"))
            .to.emit(accountA, "DepositEvent").withArgs(user2.address, ethers.utils.parseEther("1.0"));

        expect(await bank.connect(user1).getBalanceByName("A")).to.equal(ethers.utils.parseEther("2.0"));
    });
    it("2.5. Directly deposit to Account Contract", async function () {
        await bank.connect(user1).addAccount("A");
        const addressA = await bank.connect(user1).getAccountByName("A");
        const accountA = await ethers.getContractAt("Account", addressA);

        await expect(
            accountA.connect(user1).deposit(user1.address, {
                value: ethers.utils.parseEther("0"),
            })
        ).to.be.revertedWith("deposit_fail_value_zero");

        await expect(
            await accountA.connect(user1).deposit(user1.address, {
                value: ethers.utils.parseEther("1.0"),
            })
        ).to.changeEtherBalances([user1, accountA], [-ethers.utils.parseEther("1.0"), ethers.utils.parseEther("1.0")])
            .to.emit(accountA, "DepositEvent").withArgs(user1.address, ethers.utils.parseEther("1.0"));

        await expect(
            await accountA.connect(user2).deposit(user2.address, {
                value: ethers.utils.parseEther("1.0"),
            })
        ).to.changeEtherBalances([user2, accountA], [-ethers.utils.parseEther("1.0"), ethers.utils.parseEther("1.0")])
            .to.emit(accountA, "DepositEvent").withArgs(user2.address, ethers.utils.parseEther("1.0"));

        expect(await bank.connect(user1).getBalanceByName("A")).to.equal(ethers.utils.parseEther("2.0"));
    });
});
