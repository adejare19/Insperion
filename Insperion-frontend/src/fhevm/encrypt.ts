import { getFhevm } from "./initFHE";

export async function encryptUint64(value: number) {
  const fhevm = await getFhevm();
  return await fhevm.encrypt64(value);
}
