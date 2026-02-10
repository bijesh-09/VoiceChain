import { useCallback, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { SystemProgram } from '@solana/web3.js';
import { getProgram, getPlatformPDA } from '../utils/anchorClient';

export const useInitializePlatform = () => {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [platformExists, setPlatformExists] = useState(null);
  const [checking, setChecking] = useState(false);
  const [initializing, setInitializing] = useState(false);

  const checkPlatformExists = useCallback(async () => {
    if (!wallet.publicKey) {
      setPlatformExists(null);
      return;
    }
    setChecking(true);

    try {
      const program = getProgram(wallet, connection);
      const [platformPDA] = getPlatformPDA();

      await program.account.platform.fetch(platformPDA);
      setPlatformExists(true);
    } catch (error) {
      console.error('Error checking platform existence:', error);

      const message = String(error?.message ?? '').toLowerCase();
      const accountMissing =
        message.includes('account does not exist') ||
        message.includes('could not find account') ||
        message.includes('not found');

      if (accountMissing) {
        setPlatformExists(false);
      }
    } finally {
      setChecking(false);
    }
  }, [connection, wallet]);

  const initializePlatform = useCallback(async () => {
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
  }, [connection, wallet]);

  return {
    platformExists,
    checking,
    initializing,
    checkPlatformExists,
    initializePlatform,
  };
};
