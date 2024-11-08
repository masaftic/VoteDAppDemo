import { ethers } from "ethers";


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
    const CONTRACT_INFO_PATH = "./deployments-info/voting_contract_info.json";

    let votingContract;
    let startTime;
    let endTime;

    let connected = false;

    async function connect() {
        mustHaveMetaMask();

        let accounts;

        try {
            console.log('Requesting accounts...');
            accounts = await requestAccounts();
            console.log('Accounts:', accounts);

            connectButton.innerHTML = 'Connected';
            connected = true;

            document.getElementById('account').innerHTML = `account address: ${accounts[0]}`;
        }
        catch (error) {
            alert('Error connecting with MetaMask');
            console.error(error);
            return;
        }

        try {
            votingContract = await initializeContract();
        } catch (e) {
            console.error(e);
            return;
        }

        startTime = await votingContract.getStartTime();
        endTime = await votingContract.getEndTime();

        document.getElementById("startTime").innerHTML = convertToDate(startTime);
        document.getElementById("endTime").innerHTML = convertToDate(endTime);
    }


    async function requestAccounts() {
        return await window.ethereum.request({ method: 'eth_requestAccounts' });
    }

    async function fetchContractInfo() {
        const response = await fetch(CONTRACT_INFO_PATH);
        const data = await response.json();
        return data;
    }


    async function initializeContract() {
        const provider = new ethers.BrowserProvider(window.ethereum);
        console.log('provider: ', provider);

        const signer = await provider.getSigner();
        console.log('Signer: ', signer);

        const contractInfo = await fetchContractInfo();

        const contractAbi = contractInfo.abi;
        console.log('contract abi: ', contractAbi);

        const contractAddress = contractInfo.address;
        console.log('contract address: ', contractAddress);
        
        votingContract = new ethers.Contract(contractAddress, contractAbi, signer);
        console.log('Contract initialized: ', votingContract);

        return votingContract;
    }

    let currentTime;

    function updateVotingStatus() {
        currentTime = Math.floor(Date.now() / 1000); // Current time in seconds

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

        // Format the date to a more readable format
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
        };
        return date.toLocaleString(undefined, options);
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
            if (currentTime <= endTime) {
                alert("Voting hasn't ended yet");
                return;
            }

            document.getElementById("winner").innerHTML = "Fetching winner...";

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
