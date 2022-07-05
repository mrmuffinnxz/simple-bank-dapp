import { expect } from "chai";
import { ethers } from "hardhat";

describe("Bank", function () {
    let Bank, bank, user1, user2;

    beforeEach(async () => {
        Bank = await ethers.getContractFactory("Bank");
        bank = await Bank.deploy();
        await bank.deployed();
        [user1, user2] = await ethers.getSigners();
        console.log("bank deployed at:" + bank.address);
    });

    it("1. As a user, I want to create a new bank account that I can specify the unique account name to my liking", async function () {
        await expect(bank.connect(user1).addAccount("A")).to.emit(
            bank,
            "AddAccountEvent"
        );
        await expect(bank.connect(user1).addAccount("A")).to.be.revertedWith(
            "add_account_fail_name_exist"
        );
        await expect(bank.connect(user1).addAccount("B")).to.emit(
            bank,
            "AddAccountEvent"
        );
    });
    it("2. As a user, I want to recharge/deposit an ERC 20 or CW 20 token to my account by specifying the account name\n -The contract must receive an arbitrary amount of ERC 20 standard token", async function () {
        await bank.connect(user1).addAccount("A");

        const addressA = await bank.connect(user1).getAccountByName("A");
        const accountA = await ethers.getContractAt("Account", addressA);

        await expect(
            accountA.connect(user1).deposit({
                value: ethers.utils.parseEther("0"),
            })
        ).to.be.revertedWith("deposit_fail_value_zero");

        await expect(
            accountA.connect(user1).deposit({
                value: ethers.utils.parseEther("1.0"),
            })
        ).to.emit(accountA, "DepositEvent").withArgs(user1.address, ethers.utils.parseEther("1.0"));

        await expect(
            accountA.connect(user2).deposit({
                value: ethers.utils.parseEther("1.0"),
            })
        ).to.emit(accountA, "DepositEvent").withArgs(user2.address, ethers.utils.parseEther("1.0"));
    });
    it("3. As a user, I want to withdraw the ERC 20 token that is in the balance of my account\n -The contract must withdraw an arbitrary amount of the ERC 20 standard token", async function () {
        await bank.connect(user1).addAccount("A");

        const addressA = await bank.connect(user1).getAccountByName("A");
        const accountA = await ethers.getContractAt("Account", addressA);
        await accountA.connect(user1).deposit({
            value: ethers.utils.parseEther("1.0"),
        });

        await expect(
            accountA.connect(user2).withdrawn(ethers.utils.parseEther("0.1"))
        ).to.be.revertedWith("withdrawn_fail_not_owner");

        await expect(
            accountA.connect(user1).withdrawn(ethers.utils.parseEther("0"))
        ).to.be.revertedWith("withdrawn_fail_value_zero");

        await expect(
            accountA.connect(user1).withdrawn(ethers.utils.parseEther("10.0"))
        ).to.be.revertedWith("withdrawn_fail_balance_not_enough");

        await expect(
            accountA.connect(user1).withdrawn(ethers.utils.parseEther("0.1"))
        ).to.emit(accountA, "WithdrawnEvent").withArgs(user1.address, ethers.utils.parseEther("0.1"));

        expect(await accountA.getBalance()).to.equal(ethers.utils.parseEther("0.9"));
    });
    it("4. As a user, I want to transfer the ERC 20 token that is in the balance of my account to one of the other accounts through the account name.", async function () {
        await bank.connect(user1).addAccount("A");

        const addressA = await bank.connect(user1).getAccountByName("A");
        const accountA = await ethers.getContractAt("Account", addressA);
        await accountA.connect(user1).deposit({
            value: ethers.utils.parseEther("1.0"),
        });

        await bank.connect(user1).addAccount("B");

        const addressB = await bank.connect(user2).getAccountByName("B");
        const accountB = await ethers.getContractAt("Account", addressB);
        await accountB.connect(user2).deposit({
            value: ethers.utils.parseEther("1.0"),
        });

        await expect(
            accountA.connect(user2).transferAmount(accountB.address, ethers.utils.parseEther("0.1"))
        ).to.be.revertedWith("transfer_fail_not_owner");

        await expect(
            accountA.connect(user1).transferAmount(accountB.address, ethers.utils.parseEther("0"))
        ).to.be.revertedWith("transfer_fail_value_zero");

        await expect(
            accountA.connect(user1).transferAmount(accountB.address, ethers.utils.parseEther("10.0"))
        ).to.be.revertedWith("transfer_fail_balance_not_enough");

        await expect(
            accountA.connect(user1).transferAmount(accountB.address, ethers.utils.parseEther("0.1"))
        ).to.emit(accountA, "TransferAmountEvent").withArgs(accountB.address, ethers.utils.parseEther("0.1"));

        expect(await accountA.getBalance()).to.equal(ethers.utils.parseEther("0.9"));
        expect(await accountB.getBalance()).to.equal(ethers.utils.parseEther("1.1"));
    });
});
