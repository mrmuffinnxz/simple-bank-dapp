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
    it("4. As a user, I want to transfer the ERC 20 token that is in the balance of my account to one of the other accounts through the account name.", async function () {
        await bank.connect(user1).addAccount("A");
        const addressA = await bank.connect(user1).getAccountByName("A");
        const accountA = await ethers.getContractAt("Account", addressA);
        await bank.connect(user1).deposit("A", {
            value: ethers.utils.parseEther("1.0"),
        })

        await bank.connect(user2).addAccount("B");
        const addressB = await bank.connect(user2).getAccountByName("B");
        const accountB = await ethers.getContractAt("Account", addressB);
        await bank.connect(user2).deposit("B", {
            value: ethers.utils.parseEther("1.0"),
        })

        await expect(
            bank.connect(user1).transferAmount("C", "B", ethers.utils.parseEther("0.1"))
        ).to.be.revertedWith("transfer_fail_from_not_exist");

        await expect(
            bank.connect(user1).transferAmount("A", "C", ethers.utils.parseEther("0.1"))
        ).to.be.revertedWith("transfer_fail_to_not_exist");

        await expect(
            bank.connect(user1).transferAmount("B", "A", ethers.utils.parseEther("0.1"))
        ).to.be.revertedWith("transfer_fail_not_owner");

        await expect(
            bank.connect(user2).transferAmount("A", "B", ethers.utils.parseEther("0.1"))
        ).to.be.revertedWith("transfer_fail_not_owner");

        await expect(
            bank.connect(user1).transferAmount("A", "B", ethers.utils.parseEther("0"))
        ).to.be.revertedWith("transfer_fail_value_zero");

        await expect(
            bank.connect(user1).transferAmount("A", "B", ethers.utils.parseEther("10.0"))
        ).to.be.revertedWith("transfer_fail_balance_not_enough");

        await expect(
            await bank.connect(user1).transferAmount("A", "B", ethers.utils.parseEther("0.1"))
        ).to.changeEtherBalances([accountA, accountB], [-ethers.utils.parseEther("0.1"), ethers.utils.parseEther("0.1")])
            .to.emit(bank, "TransferAmountEvent").withArgs("A", "B", ethers.utils.parseEther("0.1"))
            .to.emit(accountA, "TransferAmountEvent").withArgs(accountB.address, ethers.utils.parseEther("0.1"))
            .to.emit(accountB, "DepositEvent").withArgs(accountA.address, ethers.utils.parseEther("0.1"));

        await expect(
            await bank.connect(user2).transferAmount("B", "A", ethers.utils.parseEther("0.2"))
        ).to.changeEtherBalances([accountB, accountA], [-ethers.utils.parseEther("0.2"), ethers.utils.parseEther("0.2")])
            .to.emit(bank, "TransferAmountEvent").withArgs("B", "A", ethers.utils.parseEther("0.2"))
            .to.emit(accountB, "TransferAmountEvent").withArgs(accountA.address, ethers.utils.parseEther("0.2"))
            .to.emit(accountA, "DepositEvent").withArgs(accountB.address, ethers.utils.parseEther("0.2"));

        expect(await bank.connect(user1).getBalanceByName("A")).to.equal(ethers.utils.parseEther("1.1"));
        expect(await bank.connect(user1).getBalanceByName("B")).to.equal(ethers.utils.parseEther("0.9"));
    });

    it("4.5. Directly transfer from Account Contract to Account Contract", async function () {
        await bank.connect(user1).addAccount("A");
        const addressA = await bank.connect(user1).getAccountByName("A");
        const accountA = await ethers.getContractAt("Account", addressA);
        await bank.connect(user1).deposit("A", {
            value: ethers.utils.parseEther("1.0"),
        })

        await bank.connect(user2).addAccount("B");
        const addressB = await bank.connect(user2).getAccountByName("B");
        const accountB = await ethers.getContractAt("Account", addressB);
        await bank.connect(user2).deposit("B", {
            value: ethers.utils.parseEther("1.0"),
        })

        await expect(
            accountA.connect(user2).transferAmount(accountB.address, ethers.utils.parseEther("0.1"))
        ).to.be.revertedWith("transfer_fail_not_bank_or_owner");

        await expect(
            accountA.connect(user1).transferAmount(accountB.address, ethers.utils.parseEther("0"))
        ).to.be.revertedWith("transfer_fail_value_zero");

        await expect(
            accountA.connect(user1).transferAmount(accountB.address, ethers.utils.parseEther("10.0"))
        ).to.be.revertedWith("transfer_fail_balance_not_enough");

        await expect(
            await accountA.connect(user1).transferAmount(accountB.address, ethers.utils.parseEther("0.1"))
        ).to.changeEtherBalances([accountA, accountB], [-ethers.utils.parseEther("0.1"), ethers.utils.parseEther("0.1")])
            .to.emit(accountA, "TransferAmountEvent").withArgs(accountB.address, ethers.utils.parseEther("0.1"))
            .to.emit(accountB, "DepositEvent").withArgs(accountA.address, ethers.utils.parseEther("0.1"));
        
        await expect(
            await accountB.connect(user2).transferAmount(accountA.address, ethers.utils.parseEther("0.2"))
        ).to.changeEtherBalances([accountB, accountA], [-ethers.utils.parseEther("0.2"), ethers.utils.parseEther("0.2")])
            .to.emit(accountB, "TransferAmountEvent").withArgs(accountA.address, ethers.utils.parseEther("0.2"))
            .to.emit(accountA, "DepositEvent").withArgs(accountB.address, ethers.utils.parseEther("0.2"));
            
        expect(await bank.connect(user1).getBalanceByName("A")).to.equal(ethers.utils.parseEther("1.1"));
        expect(await bank.connect(user1).getBalanceByName("B")).to.equal(ethers.utils.parseEther("0.9"));
    });
});
