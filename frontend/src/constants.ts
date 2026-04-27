export const TOKEN_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function balanceOf(address) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function mint(address to, uint256 amount) returns (bool)"
];

export const NFT_ABI = [
  "function safeMint(address to, string uri) returns (bool)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function balanceOf(address) view returns (uint256)"
];

export const STAKING_ABI = [
  "function stake(uint256 amount) external",
  "function withdraw(uint256 amount) external",
  "function getReward() external",
  "function earned(address account) view returns (uint256)",
  "function balanceOf(address account) view returns (uint256)",
  "function getLatestPrice() view returns (int256)"
];

export const DAO_ABI = [
  "function createProposal(string description) external",
  "function vote(uint256 proposalId) external",
  "function proposals(uint256) view returns (string description, uint256 voteCount, bool executed)",
  "function getProposalCount() view returns (uint256)"
];
