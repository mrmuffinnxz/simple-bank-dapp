import { expect } from "chai";
import { ethers } from "hardhat";

describe("Bank", function () {
    let Bank, bank, provider, user1, user2, user3;

    beforeEach(async () => {
        Bank = await ethers.getContractFactory("Bank");
        bank = await Bank.deploy();
        await bank.deployed();
        [user1, user2, user3] = await ethers.getSigners();
        provider = ethers.provider;
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
});
