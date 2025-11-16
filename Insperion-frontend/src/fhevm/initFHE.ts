// src/fhevm/initFHE.ts
// ---------------------------------------------
// Fully aligned with Zama Relayer SDK documentation.
// Ready for production usage.
// ---------------------------------------------

import {
  createInstance,
  FhevmInstance,
  SepoliaConfig,
} from "@zama-fhe/relayer-sdk";

let fhevm: FhevmInstance | null = null;

/**
 * Initialize and return a global FHEVM instance.
 *
 * This ensures:
 *  - We create the instance only once
 *  - Config matches Zama docs fully
 *  - Relayer & verification contracts load correctly
 */
export async function getFhevm(): Promise<FhevmInstance> {
  if (fhevm) return fhevm;

  try {
    // ---------------------------------------------
    // Option A — Simple & Recommended:
    // Fully managed Sepolia config (from official docs)
    // ---------------------------------------------
    fhevm = await createInstance(SepoliaConfig);

    // ---------------------------------------------
    // Option B (Commented) — FULL Manual config
    // If you ever want explicit addresses.
    // ---------------------------------------------
    /*
    fhevm = await createInstance({
      aclContractAddress: "0x687820221192C5B662b25367F70076A37bc79b6c",
      kmsContractAddress: "0x1364cBBf2cDF5032C47d8226a6f6FBD2AFCDacAC",
      inputVerifierContractAddress: "0xbc91f3daD1A5F19F8390c400196e58073B6a0BC4",

      verifyingContractAddressDecryption: "0xb6E160B1ff80D67Bfe90A85eE06Ce0A2613607D1",
      verifyingContractAddressInputVerification:
        "0x7048C39f048125eDa9d678AEbaDfB22F7900a29F",

      chainId: 11155111,          // Sepolia host chain
      gatewayChainId: 55815,      // FHEVM gateway chain
      network: "https://eth-sepolia.public.blastapi.io",
      relayerUrl: "https://relayer.testnet.zama.cloud",
    });
    */

    console.log("🔐 FHEVM initialized successfully.");
    return fhevm;
  } catch (err) {
    console.error("❌ Failed to initialize FHEVM:", err);
    throw new Error("FHEVM initialization failed. See console for details.");
  }
}
