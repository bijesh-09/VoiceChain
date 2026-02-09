import { useState, useEffect } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { getProgram, getPlatformPDA, getPetitionPDA } from '../utils/anchorClient';

export const usePetitions = () => {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [petitions, setPetitions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPetitions = async () => {
    if (!wallet.publicKey) return;
    setLoading(true);

    try {
      const program = getProgram(wallet, connection);
      const [platformPDA] = getPlatformPDA();
      
      const platform = await program.account.platform.fetch(platformPDA);
      const totalPetitions = platform.totalPetitions.toNumber();

      const petitionPromises = [];
      for (let i = 0; i < totalPetitions; i++) {
        const [petitionPDA] = getPetitionPDA(i);
        petitionPromises.push(
          program.account.petition.fetch(petitionPDA).then(data => ({
            ...data,
            address: petitionPDA,
          }))
        );
      }

      const fetchedPetitions = await Promise.all(petitionPromises);
      setPetitions(fetchedPetitions);
    } catch (error) {
      console.error("Error fetching petitions:", error);
      setPetitions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPetitions();
  }, [wallet.publicKey]);

  return { petitions, loading, refetch: fetchPetitions };
};
