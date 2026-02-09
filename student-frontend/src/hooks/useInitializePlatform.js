import { useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { SystemProgram } from '@solana/web3.js';
import { getProgram, getPlatformPDA } from '../utils/anchorClient';

export const useInitializePlatform = () => {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [platformExists, setPlatformExists] = useState(null);
  const [checking, setChecking] = useState(false);
  const [initializing, setInitializing] = useState(false);

  const checkPlatformExists = async () => {
    if (!wallet.publicKey) return;
    setChecking(true);

    try {
      const program = getProgram(wallet, connection);
      const [platformPDA] = getPlatformPDA();

      await program.account.Platform.fetch(platformPDA);
      setPlatformExists(true);
    } catch (error) {
      setPlatformExists(false);
    } finally {
      setChecking(false);
    }
  };

  const initializePlatform = async () => {
    if (!wallet.publicKey) {
      throw new Error('Wallet not connected');
    }

    setInitializing(true);

    try {
      const program = getProgram(wallet, connection);
      const [platformPDA] = getPlatformPDA();

      const tx = await program.methods
        .initializePlatform()
        .accounts({
          admin: wallet.publicKey,
          systemProgram: SystemProgram.programId,
          platform: platformPDA,
        })
        .rpc();

      console.log('Platform initialized! Tx:', tx);
      setPlatformExists(true);
      return tx;
    } catch (error) {
      console.error('Failed to initialize platform:', error);
      throw error;
    } finally {
      setInitializing(false);
    }
  };

  return {
    platformExists,
    checking,
    initializing,
    checkPlatformExists,
    initializePlatform,
  };
};