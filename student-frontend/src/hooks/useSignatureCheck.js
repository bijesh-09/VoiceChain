import { useState, useEffect } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { getProgram, getSignaturePDA } from '../utils/anchorClient';

//useSignatureCheck only checks wheteher the current user has signed the opened petition or not, 
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
      const [signaturePDA] = getSignaturePDA(petitionAddress, wallet.publicKey);//returns the address of the signature account if exists, if doesnt exists also its fine, the address will be where the signatuer acc will be if it will exist in the future

      // Try to fetch signature account
      await program.account.Signature.fetch(signaturePDA);
      setHasSigned(true); // If fetch succeeds, user has signed
    } catch (error) {
      console.error('Error checking signature:', error);
      setHasSigned(false); // If fetch fails, user hasn't signed
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    checkSignature();
  }, [wallet.publicKey, petitionAddress, checkSignature]);//checks signature only when users wallet addr changes or user switch to another petiton

  return { hasSigned, checking, recheck: checkSignature };
};
