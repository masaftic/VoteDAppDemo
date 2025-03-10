import hardhat from "hardhat";
import fs from "fs/promises";
import path from "path";
import { deployModule } from "../ignition/modules/Voting";
import { buildModule } from "@nomicfoundation/ignition-core";

async function main() {
    await hardhat.run("compile");

    await hardhat.ignition.deploy(buildModule("Egypt_Elections", deployModule));

    // const candidates = ["Sisi", "Ahmed Tantawy", "Hosni Mubarak"];
    // const startTime = Math.floor(new Date().getTime() / 1000);
    // const endTime = startTime + 30;

    // console.log('startTime:', startTime);
    // console.log('endTime:', endTime);

    // const votingContract = await hardhat.ethers.getContractFactory("Voting");
    // const voting = await votingContract.deploy(candidates, startTime, endTime);
    // await voting.waitForDeployment();

    // const votingAddress = await voting.getAddress();
    // console.log("Voting deployed to:", votingAddress);

    // const contractInfo = {
    //     address: votingAddress,
    //     abi: voting.interface.format(),
    //     candidates,
    //     startTime,
    //     endTime,
    // };

    // await fs.writeFile('deployments-info/voting_contract_info.json', JSON.stringify(contractInfo, null, 2));
    // console.log("Saved deployments info to deployments-info/voting_contract_info.json");

    // const test = await voting.getStartTime();
    // console.log('test:', test.toString());
}

main().catch((error) => {
    console.log(error);
    process.exit(1);
})
