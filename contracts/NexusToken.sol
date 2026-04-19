// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

/**
 * @title NexusToken
 * @dev Token ERC-20 nativo para o protocolo Nexus.
 */
contract NexusToken is ERC20, ERC20Burnable, Ownable {
    constructor(address initialOwner) 
        ERC20("Nexus Token", "NEX") 
        Ownable(initialOwner) 
    {
        // Cunhagem inicial de 1.000.000 NEX
        _mint(initialOwner, 1000000 * 10**decimals());
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}
