const hre = require("hardhat");

async function main() {
  const InsuranceClaims = await hre.ethers.getContractFactory("InsuranceClaims");
  const contract = await InsuranceClaims.deploy();

  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log(`InsuranceClaims deployed to: ${address}`);

  const provider = hre.ethers.provider;
  const signer = (await provider.getSigner()).address;
  console.log(`Insurer wallet: ${signer}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
