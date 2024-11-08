import { buildModule, IgnitionModuleBuilder } from "@nomicfoundation/ignition-core";
import hardhat from "hardhat";

export const deployModule = (m: IgnitionModuleBuilder) => {
    const candidates = ["Sisi", "Ahmed Tantawy", "Hosni Mubarak"];
    const startTime = Math.floor(new Date().getTime() / 1000);
    const endTime = startTime + 30;

    console.log('startTime:', startTime);
    console.log('endTime:', endTime);



    if (!hardhat.network.name) {
        throw new Error("Hardhat node is not running. Please start the Hardhat node and try again.");
    }

	// Example contract deployment
	const votingContract = m.contract("Voting", [candidates, startTime, endTime]);

    m.call(votingContract, "getCandidate", [1]);

	// Return the result
    return { votingContract };
};

export default buildModule("Egyptww", deployModule);
