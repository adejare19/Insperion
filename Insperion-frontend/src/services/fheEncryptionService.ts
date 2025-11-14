// Insperion-frontend/src/services/fheEncryptionService.ts

import { createInstance, SepoliaConfig, EncryptInputOptions } from '@zama-fhe/relayer-sdk';
import { BigNumberish } from 'ethers'; 

/**
 * Encrypts a plaintext amount for a specific contract and user address.
 * @param amountPlaintext The amount to encrypt (euint64).
 * @param contractAddress The address of the CreditRegistry.
 * @param userAddress The user's wallet address (EVM address).
 * @returns A promise that resolves to the encrypted handle (bytes32 string).
 */
export async function getEncryptedDepositHandle(
    amountPlaintext: BigNumberish,
    contractAddress: string,
    userAddress: string
): Promise<string> {
    
    if (!contractAddress || !userAddress) {
        throw new Error("Missing contract or user address for encryption.");
    }

    try {
        // 1. Initialize the FHEVM client instance (uses SepoliaConfig defaults)
        const fhevm = await createInstance(SepoliaConfig); 

        // 2. Prepare parameters
        const amountBigInt = BigInt(amountPlaintext.toString());
        const options: EncryptInputOptions = {
            contractAddress: contractAddress,
            userAddress: userAddress,
        };

        // 3. Encrypt the value
        const encInput = await fhevm.encrypt64(amountBigInt, options);

        const encHandle = encInput.handles[0]; // The bytes32 string
        
        console.log(`Successfully generated encrypted handle for ${amountPlaintext}`);
        
        return encHandle;

    } catch (error) {
        console.error("Encryption failed in the frontend:", error);
        throw new Error("Failed to generate encrypted handle via SDK. Check network access.");
    }
}
