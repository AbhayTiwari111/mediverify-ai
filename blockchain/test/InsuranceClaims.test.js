const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("InsuranceClaims", function () {
  let contract;
  let owner;
  let claimant;

  beforeEach(async function () {
    [owner, claimant] = await ethers.getSigners();
    const InsuranceClaims = await ethers.getContractFactory("InsuranceClaims");
    contract = await InsuranceClaims.deploy();
  });

  it("registers a verified claim", async function () {
    const tx = await contract.registerVerifiedClaim(claimant.address, "Hospitalization", "abc123", ethers.parseEther("2.5"));
    const receipt = await tx.wait();

    const claim = await contract.getClaim(1);
    expect(claim.claimant).to.equal(claimant.address);
    expect(claim.amount).to.equal(ethers.parseEther("2.5"));
    expect(claim.status).to.equal(1);
    expect(receipt.logs.length).to.greaterThan(0);
  });

  it("settles a verified claim when funded", async function () {
    await contract.registerVerifiedClaim(claimant.address, "Surgery", "xyz456", ethers.parseEther("1.0"));

    const fundTx = {
      to: await contract.getAddress(),
      value: ethers.parseEther("5.0"),
    };

    await owner.sendTransaction(fundTx);
    await contract.settleClaim(1);

    const claim = await contract.getClaim(1);
    expect(claim.status).to.equal(2);
    expect(await contract.getTotalSettled()).to.equal(ethers.parseEther("1.0"));
  });

  it("rejects a claim with an invalid resolution state", async function () {
    await contract.registerVerifiedClaim(claimant.address, "Dental", "dental-1", ethers.parseEther("0.5"));
    await contract.rejectClaim(1, "Insufficient evidence");

    const claim = await contract.getClaim(1);
    expect(claim.status).to.equal(3);
  });

  it("only insurer can register claims", async function () {
    await expect(
      contract.connect(claimant).registerVerifiedClaim(claimant.address, "Accident", "something", ethers.parseEther("1.0"))
    ).to.be.revertedWith("Only insurer can call this");
  });
});
