import { expect } from "chai";
import { ethers } from "hardhat";

describe("Simple Bank Basic Test", function () {
    let SimpleBank, bank, provider, owner, user1, user2;

    beforeEach(async () => {
        [owner, user1, user2] = await ethers.getSigners();
        provider = ethers.provider;
        SimpleBank = await ethers.getContractFactory("SimpleBank");
        bank = await SimpleBank.connect(owner).deploy();
        await bank.deployed();
        console.log("bank deployed at:" + bank.address);
    });
    it("0. Bank deployment", async function () {
        expect(await bank.connect(user1).getBankOwner()).to.equal(owner.address);
        expect(await bank.connect(user1).getBankBalance()).to.equal(0);
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
        await expect(bank.connect(user2).addAccount("B")).to.be.revertedWith(
            "add_account_fail_name_exist"
        );
        await expect(bank.connect(user2).addAccount("C")).to.emit(
            bank,
            "AddAccountEvent"
        );
        const user1Accounts = await bank.connect(user1).getUserAccounts();
        const user2Accounts = await bank.connect(user2).getUserAccounts();

        expect(user1Accounts.length).to.equal(2);
        expect(user2Accounts.length).to.equal(1);

        expect(user1Accounts[0]).to.equal("A");
        expect(user1Accounts[1]).to.equal("B");
        expect(user2Accounts[0]).to.equal("C");

        expect(await bank.connect(user2).getBalanceByName("A")).to.equal(0);;
        expect(await bank.connect(user2).getOwnerByName("A")).to.equal(user1.address);
    });
});
