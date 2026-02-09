import { useState, useEffect } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { getProgram, getPlatformPDA, getPetitionPDA } from '../utils/anchorClient';

export const usePetitions = () => {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [petitions, setPetitions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPetitions = async () => {
    if (!wallet.publicKey) return;//exit early if no user wallet connected
    setLoading(true);//set loading to true when we start fetching petitions

    try {
      const program = getProgram(wallet, connection);
      const [platformPDA] = getPlatformPDA();

      const platform = await program.account.Platform.fetch(platformPDA);
      const totalPetitions = platform.totalPetitions.toNumber();

      const petitionPromises = [];//its an array of object of Premises, for this case the Premises are the resolved petitions
      for (let i = 0; i < totalPetitions; i++) {
        const [petitionPDA] = getPetitionPDA(i);
        petitionPromises.push(
          program.account.Petition.fetch(petitionPDA).then(data => ({//when the ith id petition is fetched then an promise resolves into object of ...data(rest operator) and pda of petition
            ...data,
            address: petitionPDA,
          }))
        );
      }//petitionPromises.push() will keep on adding the fetched petition obj into array wuntil loop ends

      const fetchedPetitions = await Promise.all(petitionPromises);// Promise.all waits until all promises are resolved into array of objects(petitionPromises)
      setPetitions(fetchedPetitions);//setting fetched petitions to the petitions state 
    } catch (error) {
      console.error("Error fetching petitions:", error);
      setPetitions([]);//set the petitions state empty if error
    } finally {
      setLoading(false);//in the end setloading has to be false
    }
  };

  useEffect(() => {//useeffect calls the fetchpetition() whenever the wallet pubkey changes
    fetchPetitions();
  }, [wallet.publicKey]);

  return { petitions, loading, refetch: fetchPetitions };//returning these so that the it can be destrucutured and used in commponents, 
  //refetch() i,e,e fetchPetitions() is used whenever the petition is created, to update the ui
};
