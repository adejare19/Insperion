// contracts/CreditRegistry.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Correct FHEVM Imports
import {TFHE} from "@fhevm/solidity/TFHE.sol";
import {ebool, euint64} from "@fhevm/solidity/lib/FHE.sol"; 
import "./Policy.sol";

/// @title CreditRegistry
/// @notice Central encrypted ledger of collateral, debt, and credit score per user.
contract CreditRegistry {
    struct Account {
        euint64 encCollateral;
        euint64 encDebt;
        euint64 encScore;
    }

    mapping(address => Account) private accounts;
    Policy public policy;
    address public loanVaultAddress; // NEW: Address of the authorized LoanVault

    // Modifier to restrict access to the LoanVault
    modifier onlyLoanVault() {
        require(msg.sender == loanVaultAddress, "CR: Unauthorized caller");
        _;
    }

    // CONSTRUCTOR NOW REQUIRES THE VAULT ADDRESS
    constructor(address _policy, address _loanVault) { 
        policy = Policy(_policy);
        loanVaultAddress = _loanVault;
    }

    // -----------------------------
    // Core account accessors (Unchanged)
    // -----------------------------
    // ... (getAccount, getEncCollateral, getEncDebt, getEncScore) ...
    function getAccount(address user) external view returns (Account memory) {
        return accounts[user];
    }

    function getEncCollateral(address user) external view returns (euint64) {
        return accounts[user].encCollateral;
    }

    function getEncDebt(address user) external view returns (euint64) {
        return accounts[user].encDebt;
    }

    function getEncScore(address user) external view returns (euint64) {
        return accounts[user].encScore;
    }

    // -----------------------------
    // Collateral & score operations (Unchanged, but relies on new imports)
    // -----------------------------

    /// @notice Encrypted deposit
    function depositCollateral(euint64 encAmount) external {
        Account storage a = accounts[msg.sender];
        a.encCollateral = TFHE.add(a.encCollateral, encAmount);
    }

    /// @notice General-purpose encrypted score update
    function updateScore(address user, euint64 encDelta, bool increase) external {
        Account storage a = accounts[user];

        if (increase) {
            a.encScore = TFHE.add(a.encScore, encDelta);
        } else {
            a.encScore = TFHE.sub(a.encScore, encDelta);
        }
    }

    /// @notice Simple eligibility check vs min score
    function isEligible(address user) external view returns (bool) {
        Account storage a = accounts[user];
        ebool okScore = TFHE.ge(a.encScore, policy.encMinScore());
        bool result = TFHE.reveal(okScore);
        return result;
    }

    // -----------------------------
    // Debt bookkeeping (SECURED)
    // -----------------------------

    /// @notice Increase encrypted debt for a user (called by LoanVault on borrow)
    function borrowFor(address user, euint64 encAmount) 
        external 
        onlyLoanVault // SECURED
    {
        Account storage a = accounts[user];
        a.encDebt = TFHE.add(a.encDebt, encAmount);
    }

    /// @notice Decrease encrypted debt for a user (called by LoanVault on repay)
    function repayFor(address user, euint64 encAmount) 
        external 
        onlyLoanVault // SECURED
    {
        Account storage a = accounts[user];
        a.encDebt = TFHE.sub(a.encDebt, encAmount);
    }
}
