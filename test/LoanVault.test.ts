// test/LoanVault.test.ts
import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { Policy, CreditRegistry, LoanVault } from "../types"; // Adjust path as needed

// Helper to encrypt a number locally for testing
let encrypt64: (value: number) => Promise<string>;
let decrypt64: (euint64: string) => Promise<number>;

describe("Insperion Loan Vault (FHE Logic Test)", function () {
    let deployer: SignerWithAddress;
    let borrower: SignerWithAddress;
    let policy: Policy;
    let registry: CreditRegistry;
    let vault: LoanVault;

    before(async function () {
        [deployer, borrower] = await ethers.getSigners();

        // **CRITICAL:** Initialize local FHE helpers for test environment
        // This relies on the Hardhat FHEVM plugin initializing correctly locally, 
        // which usually works even when the task creation fails.
        const fhevm = await (hre as any).fhevm.getFhevmInstance();
        encrypt64 = fhevm.encrypt64;
        decrypt64 = fhevm.decrypt64;
    });

    beforeEach(async function () {
        // Deploy Policy
        const PolicyFactory = await ethers.getContractFactory("Policy");
        policy = await PolicyFactory.deploy();
        await policy.waitForDeployment();
        
        // Deploy CreditRegistry
        const RegistryFactory = await ethers.getContractFactory("CreditRegistry");
        registry = await RegistryFactory.deploy(policy.target);
        await registry.waitForDeployment();

        // Deploy LoanVault
        const LoanVaultFactory = await ethers.getContractFactory("LoanVault");
        vault = await LoanVaultFactory.deploy(registry.target, policy.target);
        await vault.waitForDeployment();
    });

    it("should allow borrow if LTV and Score are met, and update debt/score", async function () {
        // --- SETUP: Encrypted Deposit ---
        const COLLATERAL = 10000;
        const initialScore = 700;
        const BORROW_AMOUNT = 5000;
        // Max LTV is 7500 bps (75%) -> Max Debt = 7500

        // Encrypt inputs
        const encCollateral = await encrypt64(COLLATERAL);
        const encInitialScore = await encrypt64(initialScore);
        const encBorrowAmount = await encrypt64(BORROW_AMOUNT);

        // Manually set score (for test simplicity, a real user would earn it)
        await registry.connect(deployer).updateScore(
            borrower.address, 
            encInitialScore, 
            true // Increase (set score to initialScore)
        );

        // Deposit collateral (using the contract's depositCollateral)
        await registry.connect(borrower).depositCollateral(encCollateral);

        // --- ACTION: Encrypted Borrow ---
        await expect(vault.connect(borrower).borrow(encBorrowAmount))
            .to.not.be.reverted;

        // --- ASSERTION: Verify state changes (using decryption helper) ---
        const encDebtAfter = await registry.getEncDebt(borrower.address);
        const decryptedDebt = await decrypt64(encDebtAfter);

        expect(decryptedDebt).to.equal(BORROW_AMOUNT, "Encrypted debt should equal borrowed amount");
        
        // Score should have decreased slightly (SCORE_STEP_SMALL = 10)
        const encScoreAfter = await registry.getEncScore(borrower.address);
        const decryptedScore = await decrypt64(encScoreAfter);
        expect(decryptedScore).to.equal(initialScore - 10, "Score should decrease after borrowing");
    });
    
    // Add a test case for LTV failure here...
    // Add a test case for isLiquidatable check here...
});
