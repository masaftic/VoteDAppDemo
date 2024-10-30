import { ethers } from "hardhat";
import { expect } from "chai";
import { Voting } from "../typechain-types/Voting";

import * as fs from "fs";
import { ContractTransactionResponse } from "ethers";

describe("Voting Contract", function () {
    const candidates = ["Sisi", "Ahmed Tantawy", "Hosni Mubarak"];
    let votingContract: Voting & {
        deploymentTransaction(): ContractTransactionResponse;
    };
    const startTime = Math.floor(new Date().getTime() / 1000);
    const endTime = startTime + 4;

    beforeEach(async () => {
        // Reset the network to ensure a clean slate for each test
        await ethers.provider.send("hardhat_reset", []);

        // Deploy the contract fresh for each test
        const Voting = await ethers.getContractFactory("Voting");
        votingContract = await Voting.deploy(candidates, startTime, endTime);
        await votingContract.waitForDeployment();
    });


    it("Should deploy the contract", async function () {
        const signers = await ethers.getSigners();
        expect(await votingContract.owner()).to.equal(signers[0].address);
    });

    it("Should have the correct candidates", async function () {
        let candidatesResults = [];
        for (let i = 0; i < candidates.length; i++) {
            candidatesResults.push(await votingContract.getCandidate(i));
        }

        for (let i = 0; i < candidates.length; i++) {
            expect(candidatesResults[i].name).to.equal(candidates[i]);
            expect(candidatesResults[i].voteCount).to.equal(0);
        }
    });

    it("Should have the correct start time", async function () {
        expect(await votingContract.startTime()).to.equal(startTime);
    });

    it("Should have the correct end time", async function () {
        expect(await votingContract.endTime()).to.equal(endTime);
    });


    it("Should allow voting", async function () {
        await votingContract.vote(1);
        expect(await votingContract.getVoteCount(1)).to.equal(1);
    });

    it("Should not allow voting after the voting period has ended", async function () {
        // Advance blockchain time by 9 seconds
        await ethers.provider.send("evm_increaseTime", [9000]);
        await ethers.provider.send("evm_mine", []);

        await expect(votingContract.vote(1)).to.be.revertedWith("Voting period has ended");
    });

    it("Should compute Ahmed Tantawy as winner", async function () {
        await votingContract.vote(1);

        // Advance blockchain time by 9 seconds
        await ethers.provider.send("evm_increaseTime", [9000]);
        await ethers.provider.send("evm_mine", []);

        const winner = await votingContract.getWinner();
        let candidatesResults = [];
        for (let i = 0; i < candidates.length; i++) {
            candidatesResults.push(await votingContract.getCandidate(i));
        }

        // console.log(candidatesResults);

        expect(winner.name).to.equal("Ahmed Tantawy");
        expect(winner.voteCount).to.equal(1);
    });
});