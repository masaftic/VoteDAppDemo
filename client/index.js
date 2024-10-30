// import { ethers } from 'ethers';
// import votingArtifact from '../artifacts/contracts/Voting.sol/Voting.json';

// const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Your deployed contract address
// const votingAbi = votingArtifact.abi;

// const provider = new ethers.providers.Web3Provider(window.ethereum);
// const signer = provider.getSigner();

// const votingContract = new ethers.Contract(contractAddress, votingAbi, signer);


// // app.js
// async function connectWallet() {
//     // Check if MetaMask is installed
//     if (window.ethereum) {
//         getAccount()
//     } else {
//         alert('Please install MetaMask!');
//     }
// }

// // Attach the click event to the button
// document.getElementById('connectWallet').addEventListener('click', connectWallet);


// async function getAccount() {
//     const accounts = await window.ethereum
//         .request({ method: "eth_requestAccounts" })
//         .catch((err) => {
//             if (err.code === 4001) {
//                 // EIP-1193 userRejectedRequest error.
//                 // If this happens, the user rejected the connection request.
//                 console.log("Please connect to MetaMask.")
//             } else {
//                 console.error(err)
//             }
//         })
//     const account = accounts[0]
//     document.getElementById('account').innerHTML = account
// }


// async function vote(candidateId) {
//     if (typeof window.ethereum === 'undefined') {
//         alert('MetaMask is not installed!');
//         return;
//     }

//     const account = (await window.ethereum.request({ method: "eth_requestAccounts" }))[0];

//     // Define the transaction
//     const transactionParameters = {
//         to: contractAddress, // Replace with your contract address
//         from: account,
//         data: new ethers.utils.Interface(votingAbi).encodeFunctionData("vote", [candidateId]), // Encodes the call to the contract's vote function
//     };

//     try {
//         // Send the transaction
//         const txHash = await window.ethereum.request({
//             method: 'eth_sendTransaction',
//             params: [transactionParameters],
//         });
//         console.log('Transaction sent! Hash:', txHash);
//     } catch (error) {
//         console.error('Transaction failed:', error);
//     }
// }

// document.getElementById('vote').addEventListener('click', () => vote(1)); // Voting for candidate 1

import { ethers } from "./ethMin.js";

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
        const response = await fetch(CONTRACT_ADDRESS_PATH); // Adjust the path as needed
        const data = await response.json();
        return data["Egypt#Voting"];
    }

    async function fetchContractABI() {
        const response = await fetch(CONTRACT_ABI_PATH); // Adjust the path as needed
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

    // Initial call to set the status
    updateVotingStatus();

    // Update the status every minute
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