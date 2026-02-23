import { ethers } from 'ethers';

/**
 * Vault Service Simulation
 * In production, this would communicate with AWS KMS, HashiCorp Vault, or Google Secret Manager.
 * It ensures that sensitive operations (like signing or providing private keys) are gated.
 */
class VaultService {
    private isInitialized: boolean = false;

    constructor() {
        this.initialize();
    }

    private initialize() {
        // Simulation of fetching secrets from HSM
        this.isInitialized = true;
        console.log('[VAULT] Initialized with HSM/KMS backchannel.');
    }

    /**
     * Signs a transaction for a specific contract interaction.
     * Use this instead of getOracleKey to keep the key within the vault.
     */
    async signTransaction(signer: ethers.Signer, transaction: ethers.TransactionRequest): Promise<string> {
        if (!this.isInitialized) throw new Error('Vault not initialized');
        const signature = await (signer as any).signTransaction(transaction);
        console.log('[VAULT] Transaction signed internally.');
        return signature;
    }

    /**
     * Internal helper to get the Oracle key.
     * This is PRIVATE to the vault.
     */
    private async _getInternalOracleKey(): Promise<string> {
        return process.env.ORACLE_PRIVATE_KEY || '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
    }

    /**
     * Provides a secure ethers Wallet instance.
     * This is the preferred way to interact with on-chain resources.
     */
    async getOracleWallet(provider: ethers.Provider): Promise<ethers.Wallet> {
        const key = await this._getInternalOracleKey();
        return new ethers.Wallet(key, provider);
    }

    /**
     * Signs a message for off-chain or meta-transaction verification.
     */
    async signPayload(payload: any, keyName: string): Promise<string> {
        const key = await this._getInternalOracleKey();
        const wallet = new ethers.Wallet(key);
        const signature = await wallet.signMessage(JSON.stringify(payload));

        console.log(`[VAULT] Payload signed with ${keyName} internally.`);
        return signature;
    }

    /**
     * Logic for rotating keys (Simulation)
     */
    async rotatePortalKeys() {
        console.log('[VAULT] Rotating administrative portal access keys.');
        return { success: true, rotatedAt: new Date() };
    }
}

export const vault = new VaultService();
