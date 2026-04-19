// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title NexusDAO
 * @dev Governança simplificada para o protocolo Nexus.
 */
contract NexusDAO is Ownable {
    IERC20 public votingToken;

    struct Proposal {
        string description;
        uint256 voteCount;
        bool executed;
        mapping(address => bool) hasVoted;
    }

    Proposal[] public proposals;
    uint256 public constant MIN_VOTES_TO_EXECUTE = 100 * 1e18;

    event ProposalCreated(uint256 proposalId, string description);
    event Voted(uint256 proposalId, address indexed voter, uint256 weight);
    event ProposalExecuted(uint256 proposalId);

    constructor(address _votingToken, address initialOwner) Ownable(initialOwner) {
        votingToken = IERC20(_votingToken);
    }

    function createProposal(string memory description) external {
        uint256 proposalId = proposals.length;
        Proposal storage newProposal = proposals.push();
        newProposal.description = description;
        newProposal.voteCount = 0;
        newProposal.executed = false;

        emit ProposalCreated(proposalId, description);
    }

    function vote(uint256 proposalId) external {
        Proposal storage proposal = proposals[proposalId];
        require(!proposal.executed, "Proposal already executed");
        require(!proposal.hasVoted[msg.sender], "Already voted");

        uint256 weight = votingToken.balanceOf(msg.sender);
        require(weight > 0, "No voting power");

        proposal.voteCount += weight;
        proposal.hasVoted[msg.sender] = true;

        emit Voted(proposalId, msg.sender, weight);
    }

    function executeProposal(uint256 proposalId) external onlyOwner {
        Proposal storage proposal = proposals[proposalId];
        require(!proposal.executed, "Already executed");
        require(proposal.voteCount >= MIN_VOTES_TO_EXECUTE, "Not enough votes");

        proposal.executed = true;
        emit ProposalExecuted(proposalId);
    }

    function getProposalCount() external view returns (uint256) {
        return proposals.length;
    }
}
