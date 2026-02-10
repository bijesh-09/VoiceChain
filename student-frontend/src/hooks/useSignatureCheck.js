import { useState, useEffect, useCallback } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { getSignaturePDA } from '../utils/anchorClient';

// useSignatureCheck only checks whether the current user has signed the opened petition or not
export const useSignatureCheck = (petitionAddress) => {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [hasSigned, setHasSigned] = useState(false);
  const [checking, setChecking] = useState(false);

  const checkSignature = useCallback(async () => {
    if (!wallet.publicKey || !petitionAddress) {
      setHasSigned(false);
      return;
    }

    setChecking(true);
    try {
      const [signaturePDA] = getSignaturePDA(petitionAddress, wallet.publicKey);

      // More robust than program.account.signature.fetch(...) in production:
      // just check whether the signature PDA account exists.
      const accountInfo = await connection.getAccountInfo(signaturePDA, 'confirmed');
      setHasSigned(!!accountInfo);
    } catch (error) {
      console.error('Error checking signature:', error);
      setHasSigned(false);
    } finally {
      setChecking(false);
    }
  }, [connection, petitionAddress, wallet.publicKey]);

  useEffect(() => {
    checkSignature();
  }, [checkSignature]);

  return { hasSigned, checking, recheck: checkSignature };
};
