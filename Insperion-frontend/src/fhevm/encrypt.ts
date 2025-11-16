// src/fhevm/encrypt.ts

import { getFhevm } from "./initFHE";

/**
 * Encrypts a uint64 value using FHEVM relayer SDK
 */
export async function encryptUint64(value: number) {
  if (Number.isNaN(value) || value < 0) {
    throw new Error("Invalid value for encryption");
  }

  const fhevm = await getFhevm();

  // IMPORTANT:
  // encrypt64 returns { handles: number[], publicKey: string }
  return await fhevm.encrypt64(value);
}
