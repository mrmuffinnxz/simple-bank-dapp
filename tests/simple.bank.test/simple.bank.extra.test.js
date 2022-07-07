import { expect } from "chai";
import { ethers } from "hardhat";

describe("Simple Bank Transfer Test", function () {
    let SimpleBank, bank, provider, owner, user1, user2;

    beforeEach(async () => {
        [owner, user1, user2] = await ethers.getSigners();
        provider = ethers.provider;
        SimpleBank = await ethers.getContractFactory("SimpleBank");
        bank = await SimpleBank.connect(owner).deploy();
        await bank.deployed();
        console.log("bank deployed at:" + bank.address);
    });
    it("7. Withrawn Bank Balance", async function () {
        await bank.connect(user1).addAccount("A");
        await bank.connect(user1).deposit("A", {
            value: ethers.utils.parseEther("1.0"),
        });

        await bank.connect(user2).addAccount("B");
        await bank.connect(user2).deposit("B", {
            value: ethers.utils.parseEther("1.0"),
        });

        await bank.connect(user1).transferAmount("A", "B", ethers.utils.parseEther("0.1"));
        await bank.connect(user2).transferAmount("B", "A", ethers.utils.parseEther("0.2"));

        await expect(bank.connect(user1).withdrawnBankBalance(ethers.utils.parseEther("0.001"))).to.be.revertedWith(
            "withdrawn_bank_fail_not_owner"
        );

        await expect(bank.connect(owner).withdrawnBankBalance(ethers.utils.parseEther("0"))).to.be.revertedWith(
            "withdrawn_bank_fail_value_zero"
        );

        await expect(bank.connect(owner).withdrawnBankBalance(ethers.utils.parseEther("1.0"))).to.be.revertedWith(
            "withdrawn_bank_fail_balance_not_enough"
        );

        expect(await bank.connect(user1).getBankBalance()).to.equal(ethers.utils.parseEther("0.003"));
        expect(await bank.connect(owner).withdrawnBankBalance(ethers.utils.parseEther("0.001"))).to.emit(bank, "withdrawnBankBalanceEvent").withArgs( ethers.utils.parseEther("0.001"));
        expect(await bank.connect(user1).getBankBalance()).to.equal(ethers.utils.parseEther("0.002"));
    });
});
