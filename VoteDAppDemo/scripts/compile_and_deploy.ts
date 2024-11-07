import hardhat from "hardhat";

async function main() {
    await hardhat.run("compile");

    // const address = "0x6649Fd56417e4cd7237971C392FfA2b0D0A2545E";

    // const provider = new hardhat.ethers.JsonRpcProvider(process.env.INFURA_URL, "sepolia");
    // const balance = await provider.getBalance(address);
    // console.log("Balance from direct RPC query:", balance.toString());

    // const [signer] = await hardhat.ethers.getSigners();
    // console.log("Signer address:", await signer.getAddress());
    // const balance = await signer.provider.getBalance(signer.getAddress());
    // console.log("Signer balance:", balance.toString());

    // const SimpleStorage = await hardhat.ethers.getContractFactory("SimpleStorage");
    // const simpleStorage = await SimpleStorage.deploy();
    // await simpleStorage.waitForDeployment();
    // console.log("SimpleStorage deployed to:", await simpleStorage.getAddress());

    // console.log("----------------------------------------------------------------");
    // console.log("----------------------------------------------------------------");
    // console.log("----------------------------------------------------------------");
    // console.log("----------------------------------------------------------------");
    // console.log("----------------------------------------------------------------");

    // const trxResponse = await simpleStorage.store(69);
    // const trxReceipt = await trxResponse.wait();

    // console.log(trxReceipt);

    // console.log("----------------------------------------------------------------");
    // console.log("----------------------------------------------------------------");
    // console.log("----------------------------------------------------------------");

    // console.log(trxReceipt?.logs);

    // const parsedLogs = trxReceipt?.logs.map((log) => simpleStorage.interface.parseLog(log));
    // console.log(parsedLogs);

    // console.log(parsedLogs![0]?.args[0]);
    // console.log(parsedLogs![0]?.args[1]);
    // console.log(parsedLogs![0]?.args[2]);
    // console.log(parsedLogs![0]?.args[3]);

    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const contract = await hardhat.ethers.getContractAt("SimpleStorage", contractAddress);

    await contract.store(69);

    const value = await contract.storedData();
    console.log("value: ", value);
}

main().catch((error) => {
    console.log(error);
    process.exit(1);
});
