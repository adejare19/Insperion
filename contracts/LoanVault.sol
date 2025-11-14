// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {TFHE} from "@fhevm/solidity/TFHE.sol";
import {ebool, euint64} from "@fhevm/solidity/lib/FHE.sol";
import "./CreditRegistry.sol";
import "./Policy.sol";

/// @title LoanVault
/// @notice Encrypted borrowing & repayment logic using CreditRegistry + Policy
contract LoanVault {
    CreditRegistry public registry;
    Policy public policy;

    // For score nudges
    euint64 private constant SCORE_STEP_SMALL = TFHE.asEuint64(10);
    euint64 private constant SCORE_STEP_LARGE = TFHE.asEuint64(50);

    constructor(address _registry, address _policy) {
        registry = CreditRegistry(_registry);
        policy = Policy(_policy);
    }

    // -----------------------------
    // Core borrowing logic
    // -----------------------------

    /// @notice Borrow an encrypted amount.
    /// @dev encAmount is an euint64 handle; the caller encrypts client-side via FHEVM tooling.
    function borrow(euint64 encAmount) external {
        // Load encrypted state
        CreditRegistry.Account memory a = registry.getAccount(msg.sender);

        // newDebt = currentDebt + encAmount
        euint64 encNewDebt = TFHE.add(a.encDebt, encAmount);

        // LTV check:
        //
        // We want: newDebt / collateral <= maxLTVBps / 10000
        // To avoid division, we check cross-multiplied inequality:
        //
        // newDebt * 10000 <= collateral * maxLTVBps
        //
        // (All values are encrypted)

        // If collateral is zero, just fail fast in plaintext (safe).
        bool hasCollateral = TFHE.reveal(TFHE.gt(a.encCollateral, TFHE.asEuint64(0)));
        require(hasCollateral, "No collateral");

        euint64 encNewDebtScaled = TFHE.mul(encNewDebt, TFHE.asEuint64(10000));
        euint64 encLtvLimit = TFHE.mul(a.encCollateral, policy.encMaxLTV());

        ebool okLTV = TFHE.le(encNewDebtScaled, encLtvLimit);

        // Score check: score >= minScore
        ebool okScore = TFHE.ge(a.encScore, policy.encMinScore());

        // Combine
        ebool okBoth = TFHE.and(okLTV, okScore);
        bool canBorrow = TFHE.reveal(okBoth);

        require(canBorrow, "Insufficient collateral or score");

        // State updates: encrypted
        registry.borrowFor(msg.sender, encAmount);

        // Optional: slightly penalize score on additional leverage
        registry.updateScore(msg.sender, SCORE_STEP_SMALL, false);
    }

    /// @notice Repay an encrypted amount.
    /// @dev For Phase 1, we assume the caller repays at most their outstanding debt.
    function repay(euint64 encAmount) external {
        // Decrease debt
        registry.repayFor(msg.sender, encAmount);

        // Reward good behavior: bump score
        registry.updateScore(msg.sender, SCORE_STEP_SMALL, true);
    }

    // -----------------------------
    // Liquidation / health logic
    // -----------------------------

    /// @notice Returns whether the account is in liquidation zone according to encLiqThreshold.
    /// @dev This reveals only a boolean "red/or not", not the actual LTV.
    function isLiquidatable(address user) external view returns (bool) {
        CreditRegistry.Account memory a = registry.getAccount(user);

        // If no collateral, treat as liquidatable
        bool hasCollateral = TFHE.reveal(TFHE.gt(a.encCollateral, TFHE.asEuint64(0)));
        if (!hasCollateral) {
            return true;
        }

        // Check: debt * 10000 > collateral * liqThresholdBps
        euint64 encDebtScaled = TFHE.mul(a.encDebt, TFHE.asEuint64(10000));
        euint64 encLiqLimit = TFHE.mul(a.encCollateral, policy.encLiqThreshold());

        ebool overLimit = TFHE.gt(encDebtScaled, encLiqLimit);
        bool result = TFHE.reveal(overLimit);
        return result;
    }
}
