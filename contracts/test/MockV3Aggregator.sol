// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title MockV3Aggregator
 * @dev Mock do oráculo Chainlink para testes locais.
 */
contract MockV3Aggregator {
    int256 private _price;

    constructor(int256 initialPrice) {
        _price = initialPrice;
    }

    function updatePrice(int256 newPrice) external {
        _price = newPrice;
    }

    function latestRoundData()
        external
        view
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        )
    {
        return (1, _price, block.timestamp, block.timestamp, 1);
    }
}
