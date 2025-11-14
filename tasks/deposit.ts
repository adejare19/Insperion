// tasks/deposit.ts
import { task } from "hardhat/config";
import { ethers } from "hardhat";

// Import the SDK createInstance
import { createInstance, SepoliaConfig } from "@zama-fhe/relayer-sdk";

task("deposit", "Performs an encrypted deposit to CreditRegistry")
  .addParam("amount", "The plaintext amount to deposit (uint64)")
  .setAction(async (taskArgs, hre) => {
    console.log("🚀 Starting encrypted deposit...");

    const CREDIT_REGISTRY_ADDRESS = "0x7F27898168479faDFAB56ADf57a36834899f80c4";

    const [signer] = await hre.ethers.getSigners();
    const userAddr = await signer.getAddress();
    console.log("User address:", userAddr);

    // 1) Initialize the FHEVM client instance
    // You can either pass the full config object or just use SepoliaConfig
    const fhevm = await createInstance(SepoliaConfig);
    console.log("✅ FHEVM client initialized");

    // 2) Encrypt the amount
    const amountPlain = BigInt(taskArgs.amount);
    console.log("💰 Plain deposit amount:", amountPlain.toString());

    // The SDK may allow specifying the target contract & user to embed into the handle
    const encInput = await fhevm.encrypt64(amountPlain, {
      contractAddress: CREDIT_REGISTRY_ADDRESS,
      userAddress: userAddr,
    });
    // Assuming the SDK returns something like:
    // { handles: [bytes32], inputProof?: string | bytes }
    const encHandle = encInput.handles[0];
    const inputProof = encInput.inputProof;

    console.log("🔐 Encrypted deposit handle:", encHandle);
    if (inputProof) {
      console.log("📄 Input proof present");
    }

    // 3) Call your contract method with encrypted handle (and proof if required)
    const registry = new hre.ethers.Contract(
      CREDIT_REGISTRY_ADDRESS,
      ["function depositCollateral(euint64 encAmount)"],
      signer
    );

    let tx;
    if (inputProof) {
      // If your contract signature expects the proof parameter:
      tx = await registry.depositCollateral(encHandle, inputProof);
    } else {
      tx = await registry.depositCollateral(encHandle);
    }

    console.log("📨 Transaction sent:", tx.hash);
    const receipt = await tx.wait();
    console.log("✅ Transaction confirmed in block:", receipt.blockNumber);
    console.log("🔍 View on Etherscan (Sepolia): https://sepolia.etherscan.io/tx/" + tx.hash);
  });
