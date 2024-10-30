import { ethers } from "hardhat";
import hardhat from "hardhat";
import { Voting } from "../typechain-types";
import { readFileSync } from "fs";

async function main() {
    const contractAddress = JSON.parse(readFileSync('./ignition/deployments/chain-31337/deployed_addresses.json').toString())["Egypt#Voting"];
    
    const votingContract = await hardhat.ethers.getContractAt("Voting", contractAddress);

    let candidates = [];
    for (let i = 0; i < 3; i++) {
        candidates.push(await votingContract.candidates(i));
    }

    console.log('candidates: ', candidates);
}

main().catch((error) => {
    console.log(error);
    process.exit(1);
})
