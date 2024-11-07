// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Voting {
    struct Candidate {
        string name;
        uint voteCount;
    }

    address public immutable owner;

    mapping(address => bool) public hasVoted;

    Candidate[] public candidates;

    event Voted(address indexed voter, uint indexed candidateId);
    event WinnerDeclared(string name, uint voteCount);

    uint public startTime;

    uint public endTime;

    constructor(string[] memory _names, uint _startTime, uint _endTime) {
        require(_startTime < _endTime, "Start time must be before end time");
        owner = msg.sender;
        startTime = _startTime;
        endTime = _endTime;

        for (uint i = 0; i < _names.length; i++) {
            candidates.push(Candidate({name: _names[i], voteCount: 0}));
        }

        console.log("Constructor:: start time:   %d", startTime);
        console.log("Constructor:: Current time: %d", block.timestamp);
        console.log("Constructor:: End time:     %d", endTime);
    }


    // DON'T PUT A FALL BACK FUNCTION FOR SOME REASON IT MAKES SYNC ERRORS
    fallback() external {}

    modifier onlyDuringVotingPeriod() {
        require(
            block.timestamp >= startTime,
            "Voting period has not started yet"
        );
        require(block.timestamp <= endTime, "Voting period has ended");
        _;
    }

    function vote(uint candidateId) public {
        console.log("Vote:: start time:   %d", startTime);
        console.log("Vote:: Current time: %d", block.timestamp);
        console.log("Vote:: End time:     %d", endTime);

        require(
            block.timestamp >= startTime,
            "Voting period has not started yet"
        );
        require(block.timestamp <= endTime, "Voting period has ended");

        require(candidateId < candidates.length, "Invalid candidate ID");
        require(!hasVoted[msg.sender], "You have already voted");

        candidates[candidateId].voteCount++;
        hasVoted[msg.sender] = true;

        emit Voted(msg.sender, candidateId);
    }

    function getCandidate(
        uint candidateId
    ) public view returns (string memory name, uint voteCount) {
        require(candidateId < candidates.length, "Invalid candidate ID");

        Candidate memory candidate = candidates[candidateId];
        return (candidate.name, candidate.voteCount);
    }

    function getVoteCount(
        uint candidateId
    ) public view returns (uint voteCount) {
        require(candidateId < candidates.length, "Invalid candidate ID");

        Candidate memory candidate = candidates[candidateId];
        return candidate.voteCount;
    }

    // should be a state-changing function to be able to calculate time properly
    function getWinnerWithTransaction()
        public
        returns (string memory name, uint voteCount)
    {
        (name, voteCount) = getWinner();
        emit WinnerDeclared(name, voteCount); // Emit winner details
    }

    function getWinner()
        public
        view
        returns (string memory name, uint voteCount)
    {
        require(block.timestamp > endTime, "Voting period has not ended yet");

        uint maxVotes = 0;
        uint winnerId = 0;

        for (uint i = 0; i < candidates.length; i++) {
            if (candidates[i].voteCount > maxVotes) {
                maxVotes = candidates[i].voteCount;
                winnerId = i;
            }
        }

        Candidate memory winner = candidates[winnerId];
        return (winner.name, winner.voteCount);
    }

    function getStartTime() public view returns (uint256) {
        return startTime;
    }

    function getEndTime() public view returns (uint256) {
        return endTime;
    }
}
