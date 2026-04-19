import { expect } from "chai";
import { network } from "hardhat";

const { ethers, networkHelpers } = await network.create();
const { loadFixture } = networkHelpers;

describe("Nexus Protocol", function () {
  async function deployProtocolFixture() {
    const [owner, otherAccount] = await ethers.getSigners();

    // 1. Deploy NexusToken
    const token = await ethers.deployContract("NexusToken", [owner.address]);

    // 2. Deploy NexusNFT
    const nft = await ethers.deployContract("NexusNFT", [owner.address]);

    // 3. Deploy Mock Oracle (ETH/USD price set to 2000)
    const oracle = await ethers.deployContract("MockV3Aggregator", [2000n * 10n ** 8n]);

    // 4. Deploy NexusStaking
    const staking = await ethers.deployContract("NexusStaking", [
      await token.getAddress(),
      await token.getAddress(),
      await oracle.getAddress(),
      owner.address
    ]);

    // 5. Deploy NexusDAO
    const dao = await ethers.deployContract("NexusDAO", [await token.getAddress(), owner.address]);

    return { token, nft, staking, dao, oracle, owner, otherAccount };
  }

  describe("NexusToken", function () {
    it("Should have correct name and symbol", async function () {
      const { token } = await loadFixture(deployProtocolFixture);
      expect(await token.name()).to.equal("Nexus Token");
      expect(await token.symbol()).to.equal("NEX");
    });

    it("Should mint initial supply to owner", async function () {
      const { token, owner } = await loadFixture(deployProtocolFixture);
      const ownerBalance = await token.balanceOf(owner.address);
      expect(ownerBalance).to.equal(ethers.parseEther("1000000"));
    });
  });

  describe("NexusNFT", function () {
    it("Should mint a new NFT", async function () {
      const { nft, otherAccount } = await loadFixture(deployProtocolFixture);
      await nft.safeMint(otherAccount.address, "ipfs://test");
      expect(await nft.ownerOf(0)).to.equal(otherAccount.address);
      expect(await nft.tokenURI(0)).to.equal("ipfs://test");
    });
  });

  describe("NexusStaking", function () {
    it("Should stake tokens and earn rewards", async function () {
      const { token, staking, owner } = await loadFixture(deployProtocolFixture);
      const stakeAmount = ethers.parseEther("100");

      // Approve and Stake
      await token.approve(await staking.getAddress(), stakeAmount);
      await staking.stake(stakeAmount);

      expect(await staking.balanceOf(owner.address)).to.equal(stakeAmount);

      // Fast forward time
      await networkHelpers.time.increase(3600);

      const earned = await staking.earned(owner.address);
      expect(earned).to.be.gt(0n);
    });

    it("Should adjust rewards based on oracle price", async function () {
      const { staking, oracle } = await loadFixture(deployProtocolFixture);
      
      const rateAt2000 = await staking.getAdjustedRewardRate();
      
      // Update price to 4000
      await oracle.updatePrice(4000n * 10n ** 8n);
      const rateAt4000 = await staking.getAdjustedRewardRate();
      
      expect(rateAt4000).to.equal(rateAt2000 * 2n);
    });
  });

  describe("NexusDAO", function () {
    it("Should create and vote on proposals", async function () {
      const { dao, token, owner } = await loadFixture(deployProtocolFixture);
      
      await dao.createProposal("Increase staking rewards");
      await dao.vote(0);
      
      const proposal = await dao.proposals(0);
      expect(proposal.voteCount).to.equal(await token.balanceOf(owner.address));
    });
  });
});
