import { useState, useEffect } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { getProgram, getSignaturePDA } from '../utils/anchorClient';

export const useSignatureCheck = (petitionAddress) => {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [hasSigned, setHasSigned] = useState(false);
  const [checking, setChecking] = useState(false);

  const checkSignature = async () => {
    if (!wallet.publicKey || !petitionAddress) return;
    setChecking(true);

    try {
      const program = getProgram(wallet, connection);
      const [signaturePDA] = getSignaturePDA(petitionAddress, wallet.publicKey);
      
      // Try to fetch signature account
      await program.account.signature.fetch(signaturePDA);
      setHasSigned(true); // If fetch succeeds, user has signed
    } catch (error) {
      setHasSigned(false); // If fetch fails, user hasn't signed
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    checkSignature();
  }, [wallet.publicKey, petitionAddress]);

  return { hasSigned, checking, recheck: checkSignature };
};
