import { ethers } from "hardhat";
import hardhat from "hardhat";
import { Voting } from "../typechain-types";

async function main() {
    const contractAddress = "0x68B1D87F95878fE05B998F19b66F4baba5De1aed";
    const votingContract = await hardhat.ethers.getContractAt("Voting", contractAddress);


    // const res = await votingContract.vote(1);
    // console.log(res);

    // const votes = await votingContract.getCandidate(1);
    // console.log('candidate is: ', votes);

    let candidates = [];
    for (let i = 0; i < 3; i++) {
        candidates.push(await votingContract.candidates(i));
    }

    console.log('candidates: ', candidates);

    const getWinnerTrx = await votingContract.getWinnerWithTransaction();
    
    votingContract.on(votingContract.filters.WinnerDeclared(), (winner) => {
        console.log(winner);
    });

    // console.log('winner: ', await votingContract.getWinner());

    // console.log(await votingContract.ca);
}

main().catch((error) => {
    console.log(error);
    process.exit(1);
})
