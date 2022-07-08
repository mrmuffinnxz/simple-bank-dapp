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
    it("4. As a user, I want to transfer the ERC 20 token that is in the balance of my account to one of the other accounts through the account name.", async function () {
        await bank.connect(user1).addAccount("A");
        await bank.connect(user1).deposit("A", {
            value: ethers.utils.parseEther("1.0"),
        })

        await bank.connect(user1).addAccount("B");
        await bank.connect(user1).deposit("B", {
            value: ethers.utils.parseEther("1.0"),
        })

        await expect(
            bank.connect(user1).transferAmount("C", "B", ethers.utils.parseEther("0.1"))
        ).to.be.revertedWith("transfer_fail_from_name_not_exist");

        await expect(
            bank.connect(user1).transferAmount("A", "C", ethers.utils.parseEther("0.1"))
        ).to.be.revertedWith("transfer_fail_to_name_not_exist");

        await expect(
            bank.connect(user2).transferAmount("B", "A", ethers.utils.parseEther("0.1"))
        ).to.be.revertedWith("transfer_fail_from_not_owner");

        await expect(
            bank.connect(user2).transferAmount("A", "B", ethers.utils.parseEther("0.1"))
        ).to.be.revertedWith("transfer_fail_from_not_owner");

        await expect(
            bank.connect(user1).transferAmount("A", "B", ethers.utils.parseEther("0"))
        ).to.be.revertedWith("transfer_fail_value_less_than_100");

        await expect(
            bank.connect(user1).transferAmount("A", "B", 99)
        ).to.be.revertedWith("transfer_fail_value_less_than_100");

        await expect(
            bank.connect(user1).transferAmount("A", "B", ethers.utils.parseEther("10.0"))
        ).to.be.revertedWith("transfer_fail_from_balance_not_enough");

        await expect(
            await bank.connect(user1).transferAmount("A", "B", ethers.utils.parseEther("0.1"))
        ).to.emit(bank, "TransferAmountEvent").withArgs("A", "B", ethers.utils.parseEther("0.1"));

        await expect(
            await bank.connect(user1).transferAmount("B", "A", ethers.utils.parseEther("0.2"))
        ).to.emit(bank, "TransferAmountEvent").withArgs("B", "A", ethers.utils.parseEther("0.2"));

        expect(await bank.connect(user1).getBalanceByName("A")).to.equal(ethers.utils.parseEther("1.1"));
        expect(await bank.connect(user1).getBalanceByName("B")).to.equal(ethers.utils.parseEther("0.9"));
    });
    it("5. [BONUS] When a user executes a token transfer to other accounts that is not yours, the contract must deduct 1% of the transferred amount as a platform fee", async function () {
        await bank.connect(user1).addAccount("A");
        await bank.connect(user1).deposit("A", {
            value: ethers.utils.parseEther("1.0"),
        });

        await bank.connect(user2).addAccount("B");
        await bank.connect(user2).deposit("B", {
            value: ethers.utils.parseEther("1.0"),
        });

        await expect(
            bank.connect(user1).transferAmount("C", "B", ethers.utils.parseEther("0.1"))
        ).to.be.revertedWith("transfer_fail_from_name_not_exist");

        await expect(
            bank.connect(user1).transferAmount("A", "C", ethers.utils.parseEther("0.1"))
        ).to.be.revertedWith("transfer_fail_to_name_not_exist");

        await expect(
            bank.connect(user1).transferAmount("B", "A", ethers.utils.parseEther("0.1"))
        ).to.be.revertedWith("transfer_fail_from_not_owner");

        await expect(
            bank.connect(user2).transferAmount("A", "B", ethers.utils.parseEther("0.1"))
        ).to.be.revertedWith("transfer_fail_from_not_owner");

        await expect(
            bank.connect(user1).transferAmount("A", "B", ethers.utils.parseEther("0"))
        ).to.be.revertedWith("transfer_fail_value_less_than_100");

        await expect(
            bank.connect(user1).transferAmount("A", "B", 99)
        ).to.be.revertedWith("transfer_fail_value_less_than_100");

        await expect(
            bank.connect(user1).transferAmount("A", "B", ethers.utils.parseEther("10.0"))
        ).to.be.revertedWith("transfer_fail_from_balance_not_enough");

        await expect(
            await bank.connect(user1).transferAmount("A", "B", ethers.utils.parseEther("0.1"))
        ).to.emit(bank, "TransferAmountEvent").withArgs("A", "B", ethers.utils.parseEther("0.099"));

        expect(await bank.connect(user1).getBalanceByName("A")).to.equal(ethers.utils.parseEther("0.9"));
        expect(await bank.connect(user1).getBalanceByName("B")).to.equal(ethers.utils.parseEther("1.099"));
        expect(await bank.connect(user1).getBankBalance()).to.equal(ethers.utils.parseEther("0.001"));

        await expect(
            await bank.connect(user2).transferAmount("B", "A", ethers.utils.parseEther("0.2"))
        ).to.emit(bank, "TransferAmountEvent").withArgs("B", "A", ethers.utils.parseEther("0.198"));

        expect(await bank.connect(user1).getBalanceByName("A")).to.equal(ethers.utils.parseEther("1.098"));
        expect(await bank.connect(user1).getBalanceByName("B")).to.equal(ethers.utils.parseEther("0.899"));

        expect(await bank.connect(user1).getBankBalance()).to.equal(ethers.utils.parseEther("0.003"));
        expect(await provider.getBalance(bank.address)).to.equal(ethers.utils.parseEther("2.0"));
    });
    it("6. [BONUS] As a user, I want to transfer the ERC 20 token that is in the balance of my account to multipleaccounts at the same time through the list of account names.", async function () {
        await bank.connect(user1).addAccount("A");
        await bank.connect(user1).deposit("A", {
            value: ethers.utils.parseEther("10.0"),
        })

        await bank.connect(user1).addAccount("A2");
        await bank.connect(user1).deposit("A2", {
            value: ethers.utils.parseEther("1.0"),
        })

        await bank.connect(user2).addAccount("B");
        await bank.connect(user2).deposit("B", {
            value: ethers.utils.parseEther("1.0"),
        })

        await expect(
            bank.connect(user1).transferAmountList("C", ["A2", "B"], ethers.utils.parseEther("0.1"))
        ).to.be.revertedWith("transfer_fail_from_name_not_exist");

        await expect(
            bank.connect(user1).transferAmountList("B", ["A", "A2"], ethers.utils.parseEther("0.1"))
        ).to.be.revertedWith("transfer_fail_from_not_owner");

        await expect(
            bank.connect(user1).transferAmountList("A", ["A2", "B"], 99)
        ).to.be.revertedWith("transfer_fail_value_less_than_100");

        await expect(
            bank.connect(user1).transferAmountList("A", ["A2", "B"], ethers.utils.parseEther("6.0"))
        ).to.be.revertedWith("transfer_fail_from_balance_not_enough");

        await expect(
            bank.connect(user1).transferAmountList("A", ["A2", "C"], ethers.utils.parseEther("0.1"))
        ).to.be.revertedWith("transfer_fail_to_name_not_exist");

        await expect(
            bank.connect(user1).transferAmountList("A", ["A2", "B"], ethers.utils.parseEther("0.1"))
        ).to.emit(bank, "TransferAmountEvent").withArgs("A", "A2", ethers.utils.parseEther("0.1"))
            .to.emit(bank, "TransferAmountEvent").withArgs("A", "B", ethers.utils.parseEther("0.099"));

        expect(await bank.connect(user1).getBalanceByName("A")).to.equal(ethers.utils.parseEther("9.8"));
        expect(await bank.connect(user1).getBalanceByName("A2")).to.equal(ethers.utils.parseEther("1.1"));
        expect(await bank.connect(user1).getBalanceByName("B")).to.equal(ethers.utils.parseEther("1.099"));
        
        expect(await bank.connect(user1).getBankBalance()).to.equal(ethers.utils.parseEther("0.001"));
        expect(await provider.getBalance(bank.address)).to.equal(ethers.utils.parseEther("12.0"));
    });
});
