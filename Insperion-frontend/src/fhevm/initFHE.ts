// src/fhevm/initFHE.ts

import { createInstance, SepoliaConfig, FhevmInstance } from "@zama-fhe/relayer-sdk";

let fhevm: FhevmInstance | null = null;

/**
 * Returns a globally initialized FHEVM client instance
 */
export async function getFhevm(): Promise<FhevmInstance> {
  if (!fhevm) {
    // Use built‐in SepoliaConfig for simplicity (contains correct ACL/KMS etc)
    fhevm = await createInstance(SepoliaConfig);

    // OR: If you wish manual config:
    // fhevm = await createInstance({
    //   aclContractAddress: "...",
    //   inputVerifierContractAddress: "...",
    //   kmsContractAddress: "...",
    //   verifyingContractAddressDecryption: "...",
    //   verifyingContractAddressInputVerification: "...",
    //   chainId: 11155111,
    //   gatewayChainId: 55815,
    //   relayerUrl: "https://relayer.testnet.zama.cloud",
    //   network: "https://sepolia.infura.io/v3/YOUR_INFURA_KEY"
    // });

    // Optionally: validate that instance is healthy, has public key etc
  }
  return fhevm;
}
