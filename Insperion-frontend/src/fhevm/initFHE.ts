import { initFhevm, FhevmInstance } from "@zama-fhe/relayer-sdk";

let fhevm: FhevmInstance | null = null;

/**
 * Returns a globally initialized FHEVM instance
 */
export async function getFhevm(): Promise<FhevmInstance> {
  if (!fhevm) {
    fhevm = await initFhevm({
      relayerUrl: "https://relayer.testnet.zama.cloud",
      network: "sepolia",
    });
  }
  return fhevm;
}
