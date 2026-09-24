// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract InsuranceClaims {
    enum ClaimStatus {
        Submitted,
        Verified,
        Settled,
        Rejected
    }

    struct Claim {
        uint256 id;
        address claimant;
        string claimType;
        string medicalHash;
        uint256 amount;
        ClaimStatus status;
        bool exists;
    }

    uint256 public totalClaims;
    uint256 public totalSettled;
    address public insurer;

    mapping(uint256 => Claim) public claims;

    event ClaimVerified(uint256 indexed id, address indexed claimant, string claimType, uint256 amount);
    event ClaimSettled(uint256 indexed id, address indexed claimant, uint256 amount);
    event ClaimRejected(uint256 indexed id, address indexed claimant, string reason);

    modifier onlyInsurer() {
        require(msg.sender == insurer, "Only insurer can call this");
        _;
    }

    constructor() {
        insurer = msg.sender;
    }

    receive() external payable {}

    function registerVerifiedClaim(
        address _claimant,
        string memory _claimType,
        string memory _medicalHash,
        uint256 _amount
    ) external onlyInsurer returns (uint256) {
        require(_claimant != address(0), "Invalid claimant address");
        require(_amount > 0, "Amount must be positive");

        uint256 claimId = totalClaims + 1;
        totalClaims = claimId;

        claims[claimId] = Claim({
            id: claimId,
            claimant: _claimant,
            claimType: _claimType,
            medicalHash: _medicalHash,
            amount: _amount,
            status: ClaimStatus.Verified,
            exists: true
        });

        emit ClaimVerified(claimId, _claimant, _claimType, _amount);
        return claimId;
    }

    function settleClaim(uint256 _claimId) external onlyInsurer {
        Claim storage claim = claims[_claimId];
        require(claim.exists, "Claim does not exist");
        require(claim.status == ClaimStatus.Verified, "Claim is not verified");
        require(address(this).balance >= claim.amount, "Insufficient contract balance");

        claim.status = ClaimStatus.Settled;
        totalSettled += claim.amount;

        (bool sent, ) = payable(claim.claimant).call{value: claim.amount}("");
        require(sent, "Settlement transfer failed");

        emit ClaimSettled(_claimId, claim.claimant, claim.amount);
    }

    function rejectClaim(uint256 _claimId, string memory reason) external onlyInsurer {
        Claim storage claim = claims[_claimId];
        require(claim.exists, "Claim does not exist");
        require(claim.status == ClaimStatus.Verified, "Claim has already been resolved");

        claim.status = ClaimStatus.Rejected;
        emit ClaimRejected(_claimId, claim.claimant, reason);
    }

    function getClaim(uint256 _claimId) external view returns (Claim memory) {
        return claims[_claimId];
    }

    function getTotalSettled() external view returns (uint256) {
        return totalSettled;
    }

    function withdraw(address payable _to, uint256 _amount) external onlyInsurer {
        require(address(this).balance >= _amount, "Insufficient balance");
        (bool sent, ) = _to.call{value: _amount}("");
        require(sent, "Withdrawal failed");
    }
}
