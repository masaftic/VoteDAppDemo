// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.27;

contract SimpleStorage {
    uint256 public storedData;

    constructor() {
        storedData = 420;
    }

    event DataStored(
        uint256 indexed oldData,
        uint256 indexed newData,
        address sender,
        uint256 timestamp
    );

    function store(uint256 newData) public {
        emit DataStored(storedData, newData, msg.sender, block.timestamp);
        storedData = newData;
    }
}
