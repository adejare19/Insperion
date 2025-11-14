// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {TFHE} from "@fhevm/solidity/TFHE.sol";
import {ebool, euint64} from "@fhevm/solidity/lib/FHE.sol";

/// @title Policy
/// @notice Stores encrypted risk parameters for Insperion (all in basis points / simple integers)
contract Policy {
    // Max loan-to-value ratio in basis points (e.g. 7500 = 75%)
    euint64 public encMaxLTV;

    // Minimum credit score required to borrow
    euint64 public encMinScore;

    // Liquidation LTV threshold in bps (e.g. 9000 = 90%)
    euint64 public encLiqThreshold;

    // APR in basis points (e.g. 800 = 8.00%)
    euint64 public encAprBps;

    constructor() {
        // Sensible defaults for demo / test
        encMaxLTV = TFHE.asEuint64(7500);
        encMinScore = TFHE.asEuint64(500);
        encLiqThreshold = TFHE.asEuint64(9000);
        encAprBps = TFHE.asEuint64(800);
    }

    /// @notice Allows updating risk parameters (in encrypted form)
    /// @dev In a real system this would be governance-controlled, not public
    function setParams(
        euint64 _maxLTV,
        euint64 _minScore,
        euint64 _liqThreshold,
        euint64 _aprBps
    ) external {
        encMaxLTV = _maxLTV;
        encMinScore = _minScore;
        encLiqThreshold = _liqThreshold;
        encAprBps = _aprBps;
    }
}
