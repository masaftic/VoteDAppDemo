import { ethers } from "./ethMin.js";

/**
 * Main function to initialize the voting DApp.
 * 
 * This function sets up event listeners for various buttons, initializes the voting contract,
 * and updates the voting status periodically.
 * 
 * @async
 * @function main
 * 
 * @description
 * - Connects to MetaMask and initializes the voting contract.
 * - Sets up event listeners for the "Connect Wallet", "Show Winner", and vote buttons.
 * - Fetches and displays the voting start and end times.
 * - Updates the voting status every second.
 * 
 * @requires ethers
 * @requires window.ethereum
 * 
 * @constant {string} LOCAL_NETWORK_URL - The URL of the local Ethereum network.
 * @constant {string} CONTRACT_ADDRESS_PATH - The path to the JSON file containing the contract address.
 * @constant {string} CONTRACT_ABI_PATH - The path to the JSON file containing the contract ABI.
 * 
 * @property {Object} votingContract - The initialized voting contract.
 * @property {number} startTime - The start time of the voting period.
 * @property {number} endTime - The end time of the voting period.
 * @property {boolean} connected - Indicates whether the wallet is connected.
 * 
 * @function connect - Connects to MetaMask and initializes the voting contract.
 * @function requestAccounts - Requests the user's Ethereum accounts.
 * @function fetchContractAddress - Fetches the contract address from a JSON file.
 * @function fetchContractABI - Fetches the contract ABI from a JSON file.
 * @function initializeContract - Initializes the voting contract.
 * @function updateVotingStatus - Updates the voting status based on the current time.
 * @function convertToDate - Converts a timestamp in seconds to a Date object.
 * @function vote - Casts a vote for a candidate.
 * @function showWinner - Displays the winner of the voting.
 * @function mustHaveMetaMask - Checks if MetaMask is installed.
 */
async function main() {


    const connectButton = document.getElementById("connectWallet");
    connectButton.onclick = connect;

    const showWinnerButton = document.getElementById("showWinner");
    showWinnerButton.onclick = showWinner;


    const voteButtons = document.querySelectorAll(".voteButton");
    voteButtons.forEach(button => {
        button.onclick = () => vote(button.dataset.candidateId);
    });


    const LOCAL_NETWORK_URL = "http://127.0.0.1:8545";
    const CONTRACT_ADDRESS_PATH = "../ignition/deployments/chain-31337/deployed_addresses.json";
    const CONTRACT_ABI_PATH = `../artifacts/contracts/Voting.sol/Voting.json`;

    let votingContract;
    let startTime;
    let endTime;

    let connected = false;

    async function connect() {
        mustHaveMetaMask();

        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
        } catch (error) {
            alert('Error connecting with MetaMask');
            console.error(error);
        }

        votingContract = await initializeContract();

        startTime = await votingContract.startTime();
        endTime = await votingContract.endTime();
    
        document.getElementById("startTime").innerHTML = convertToDate(startTime);
        document.getElementById("endTime").innerHTML = convertToDate(endTime);

        connectButton.innerHTML = 'Connected';
        connected = true;
        console.log(ethers);

        const accounts = await ethereum.request({ method: 'eth_accounts' });

        document.getElementById('account').innerHTML = `account address: ${accounts[0]}`;
        console.log(accounts);
    }


    async function requestAccounts() {
        return await window.ethereum.request({ method: 'eth_requestAccounts' });
    }

    async function fetchContractAddress() {
        const response = await fetch(CONTRACT_ADDRESS_PATH);
        const data = await response.json();
        return data["Egypt#Voting"];
    }

    async function fetchContractABI() {
        const response = await fetch(CONTRACT_ABI_PATH);
        const data = await response.json();
        return data.abi;
    }

    async function initializeContract() {
        const provider = new ethers.BrowserProvider(window.ethereum);
        console.log('provider:', provider);

        const signer = await provider.getSigner();
        console.log('Signer:', signer);

        const contractAbi = await fetchContractABI();
        console.log('contract abi:', contractAbi);

        const contractAddress = await fetchContractAddress();
        console.log('contract address:', contractAddress);

        const votingContract = new ethers.Contract(contractAddress, contractAbi, signer);
        console.log('Contract initialized:', votingContract);

        return votingContract;
    }

    function updateVotingStatus() {
        const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds

        let status = '';
        if (currentTime < startTime) {
            status = "Voting hasn't started";
        } else if (currentTime >= startTime && currentTime <= endTime) {
            status = "Voting in progress";
        } else if (connected) {
            status = "Voting ended";
        } else {
            status = ""
        }

        document.getElementById("currentTime").innerHTML = convertToDate(currentTime);
        document.getElementById("votingStatus").innerHTML = status;
    }

    updateVotingStatus();

    setInterval(updateVotingStatus, 1000);


    function convertToDate(timestampInSeconds) {
        const timestampInMillis = Number(timestampInSeconds) * 1000;

        const date = new Date(timestampInMillis);
        return date;
    }


    async function vote(candidateId) {
        mustHaveMetaMask();

        console.log(candidateId);

        try {
            const result = await votingContract.vote(candidateId);
            await result.wait();
            console.log('Voted:', result);
        } catch (e) {
            console.error(e);
        }
    }

    async function showWinner() {
        mustHaveMetaMask();

        try {
            const votingContract = await initializeContract(); // Assume you have this from your previous setup

            votingContract.on(votingContract.filters.WinnerDeclared(), (winner) => {
                const name = winner.args[0];
                const votes = winner.args[1];

                document.getElementById("winner").innerHTML = `winner: ${name}, with ${votes} votes`;
                
                console.log(winner);
            });


            // Call the getWinnerWithTransaction function
            await votingContract.getWinnerWithTransaction();
           
            

        } catch (e) {
            console.error(e);
        }

    }


    function mustHaveMetaMask() {
        if (typeof window.ethereum === 'undefined') {
            alert('MetaMask is not installed!');
            return;
        }
    }

}



main().catch(console.error);